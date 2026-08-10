/* Vocab World service worker
 *
 * Delivery contract:
 * - HTML navigations are network-first with the last valid shell as fallback.
 * - version.json is network-only and is never answered from Cache Storage.
 * - immutable /assets/build URLs are cache-first.
 * - every other same-origin asset uses its content hash from asset-manifest.json
 *   as the Cache Storage key, so unchanged GLB/audio/texture/data files survive deploys.
 * - player state lives outside Cache Storage (localStorage/Firebase) and is never touched here.
 */
'use strict';

const BUILD_ID = '__VW_BUILD_VERSION__';
const SHELL_CACHE = `vw-shell-${BUILD_ID}`;
const ASSET_CACHE = 'vw-assets-content-v1';
const MANIFEST_URL = `/asset-manifest.json?v=${encodeURIComponent(BUILD_ID)}`;
const PRECACHE = __VW_PRECACHE__;
let assetManifestPromise = null;

function sameOrigin(url) {
  return url.origin === self.location.origin;
}

function noStoreRequest(request) {
  return new Request(request, { cache: 'no-store' });
}

async function fetchAssetManifest(forceNetwork = false) {
  if (assetManifestPromise && !forceNetwork) return assetManifestPromise;
  assetManifestPromise = (async () => {
    const manifestRequest = new Request(MANIFEST_URL, { cache: 'no-store' });
    const manifestCache = await caches.open(SHELL_CACHE);
    try {
      const response = await fetch(manifestRequest);
      if (!response.ok) throw new Error(`asset manifest HTTP ${response.status}`);
      const copy = response.clone();
      const data = await response.json();
      if (!data || data.build !== BUILD_ID || !data.files) throw new Error('asset manifest/build mismatch');
      await manifestCache.put(manifestRequest, copy);
      return data;
    } catch (error) {
      const cached = await manifestCache.match(manifestRequest);
      if (cached) return cached.json();
      throw error;
    }
  })();
  return assetManifestPromise;
}

async function cacheShellAtomically() {
  const cache = await caches.open(SHELL_CACHE);
  try {
    await Promise.all(PRECACHE.map(async (url) => {
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!response.ok) throw new Error(`precache ${url}: HTTP ${response.status}`);
      await cache.put(url, response);
    }));
    await fetchAssetManifest(true);
  } catch (error) {
    await caches.delete(SHELL_CACHE);
    throw error;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheShellAtomically().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const shellKeys = keys.filter((key) => key.startsWith('vw-shell-')).sort().reverse();
    const keep = new Set([SHELL_CACHE, ...shellKeys.filter((key) => key !== SHELL_CACHE).slice(0, 1)]);
    await Promise.all(shellKeys.filter((key) => !keep.has(key)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function cachedShellFallback(request) {
  const direct = await caches.match(request, { ignoreSearch: true });
  if (direct) return direct;
  return (await caches.match('/index.html')) || (await caches.match('/offline.html'));
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(new Request(request, { cache: 'no-cache' }));
    if (!response.ok) throw new Error(`navigation HTTP ${response.status}`);
    const cache = await caches.open(SHELL_CACHE);
    await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cachedShellFallback(request)) || Response.error();
  }
}

async function cacheFirstImmutable(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

function versionedCacheKey(pathname, hash) {
  return new Request(`${self.location.origin}/__vw_asset__${pathname}?v=${encodeURIComponent(hash)}`);
}

async function previousAsset(pathname, cache) {
  const expectedPath = `/__vw_asset__${pathname}`;
  const keys = await cache.keys();
  for (let index = keys.length - 1; index >= 0; index -= 1) {
    if (new URL(keys[index].url).pathname === expectedPath) {
      const hit = await cache.match(keys[index]);
      if (hit) return hit;
    }
  }
  return null;
}

async function contentHashCacheFirst(request, url) {
  const cache = await caches.open(ASSET_CACHE);
  let entry = null;
  try {
    const manifest = await fetchAssetManifest();
    entry = manifest.files[url.pathname] || null;
  } catch {
    // A previous cache can still keep the current game playable while offline.
  }

  if (entry && entry.hash) {
    const key = versionedCacheKey(url.pathname, entry.hash);
    const cached = await cache.match(key);
    if (cached) return cached;
    try {
      const response = await fetch(new Request(request, { cache: 'no-cache' }));
      if (!response.ok) throw new Error(`asset HTTP ${response.status}`);
      await cache.put(key, response.clone());
      return response;
    } catch {
      const previous = await previousAsset(url.pathname, cache);
      if (previous) return previous;
      throw new Error(`No cached version of ${url.pathname}`);
    }
  }

  const direct = await cache.match(request, { ignoreSearch: true });
  if (direct) return direct;
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cachedShellFallback(request)) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!sameOrigin(url)) return;

  if (url.pathname === '/version.json') {
    event.respondWith(fetch(noStoreRequest(request)).catch(() => new Response(
      JSON.stringify({ error: 'offline', version: null }),
      { status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
    )));
    return;
  }

  if (url.pathname === '/sw.js' || url.pathname === '/asset-manifest.json') {
    event.respondWith(fetch(noStoreRequest(request)));
    return;
  }

  if (request.mode === 'navigate' || /\/(?:index(?:_classic)?|offline)\.html$/.test(url.pathname)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Range responses must remain browser-managed; caching a partial video corrupts later playback.
  if (request.headers.has('range')) return;

  if (url.pathname.startsWith('/assets/build/')) {
    event.respondWith(cacheFirstImmutable(request));
    return;
  }

  event.respondWith(contentHashCacheFirst(request, url));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'VW_BUILD_INFO') {
    event.source?.postMessage({ type: 'VW_BUILD_INFO', build: BUILD_ID });
  }
});
