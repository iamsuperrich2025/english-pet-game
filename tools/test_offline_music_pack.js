const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const music = read('js/music.js');
const util = read('js/util.js');
const sw = read('sw.js');
const html = read('index_classic.html');
const css = read('css/lobby.css');

assert(music.includes("const OFFLINE_CACHE = 'vw-assets-content-v1'"), 'music pack must reuse the persistent content-hash cache');
assert(music.includes('offlinePackInfo, offlinePackDownload, offlinePackRemove'), 'Music offline-pack public API missing');
assert(music.includes("fetch(file.path, {cache:'no-cache'})"), 'music pack must download a full normal GET');
assert(music.includes('/__vw_asset__${pathname}?v=${encodeURIComponent(hash)}'), 'music pack cache key must match sw.js');
assert(util.includes('data-tab="offline"') && util.includes('set-music-pack-download'), 'offline settings tab missing');
assert(css.includes('.set-offline-card') && css.includes('@media (max-height:430px)'), 'offline card responsive CSS missing');
assert(html.includes("openSettings('offline')"), 'successful PWA install must reveal the offline-pack tab');
assert(sw.includes('cachedRangeOrNetwork(request, url)'), 'Range requests are not routed through the local cache');
assert(sw.includes("status: 206, statusText: 'Partial Content'"), 'cached media must answer HTTP 206');

class TestRequest extends Request {
  constructor(input, init) {
    super(typeof input === 'string' ? new URL(input, 'https://example.test/') : input, init);
  }
}
const listeners = {};
let networkFallbacks = 0;
const assetCache = {
  async match(request) {
    const url = new URL(request.url);
    if (url.pathname === '/__vw_asset__/sound/bgm/bgm_01.mp3') {
      return new Response('abcdefghij', {headers:{'Content-Type':'audio/mpeg','ETag':'music-h1'}});
    }
    return null;
  },
  async keys() { return []; },
};
const shellCache = { async match(){ return null; }, async put(){} };
const sandbox = {
  self: {
    location: { origin: 'https://example.test' },
    addEventListener(type, fn) { listeners[type] = fn; },
    skipWaiting() {},
    clients: { claim() {} },
  },
  URL, Request:TestRequest, Response, Headers, Blob, console,
  caches: { open: async name => name === 'vw-assets-content-v1' ? assetCache : shellCache },
  fetch: async input => {
    const url = new URL(typeof input === 'string' ? input : input.url, 'https://example.test/');
    if (url.pathname === '/asset-manifest.json') {
      return new Response(JSON.stringify({build:'__VW_BUILD_VERSION__',files:{
        '/sound/bgm/bgm_01.mp3':{hash:'h1',bytes:10},
      }}), {headers:{'Content-Type':'application/json'}});
    }
    networkFallbacks++;
    return new Response('network', {status:200});
  },
};
vm.createContext(sandbox);
vm.runInContext(sw.replace('__VW_PRECACHE__', '[]'), sandbox, { filename: 'sw.js' });
const range = sandbox.parseSingleRange;
assert.deepStrictEqual({...range('bytes=0-99', 1000)}, {start:0,end:99});
assert.deepStrictEqual({...range('bytes=900-', 1000)}, {start:900,end:999});
assert.deepStrictEqual({...range('bytes=-100', 1000)}, {start:900,end:999});
assert.strictEqual(range('bytes=0-1,4-5', 1000), null);
assert.strictEqual(range('bytes=1000-', 1000), null);

(async()=>{
  const musicUrl = new URL('https://example.test/sound/bgm/bgm_01.mp3');
  const cached = await sandbox.cachedRangeOrNetwork(new TestRequest(musicUrl, {headers:{Range:'bytes=2-5'}}), musicUrl);
  assert.strictEqual(cached.status, 206);
  assert.strictEqual(cached.headers.get('Content-Range'), 'bytes 2-5/10');
  assert.strictEqual(cached.headers.get('Content-Type'), 'audio/mpeg');
  assert.strictEqual(await cached.text(), 'cdef');
  assert.strictEqual(networkFallbacks, 0, 'cached Range must not hit the network');

  const missingUrl = new URL('https://example.test/sound/bgm/not-downloaded.mp3');
  const fallback = await sandbox.cachedRangeOrNetwork(new TestRequest(missingUrl, {headers:{Range:'bytes=0-3'}}), missingUrl);
  assert.strictEqual(await fallback.text(), 'network');
  assert.strictEqual(networkFallbacks, 1, 'uncached Range must fall back to the network exactly once');

  console.log('PASS offline music pack: persistent hash cache, install/settings UI, and cached 206 Range playback');
})().catch(error=>{ console.error(error); process.exitCode = 1; });
