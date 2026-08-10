import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const failures = [];
const requireFile = async (rel) => {
  try { return await fs.readFile(path.join(DIST, rel), 'utf8'); }
  catch { failures.push(`missing dist/${rel}`); return ''; }
};

const versionText = await requireFile('version.json');
const manifestText = await requireFile('manifest.webmanifest');
const assetManifestText = await requireFile('asset-manifest.json');
const sw = await requireFile('sw.js');
const index = await requireFile('index.html');
const classic = await requireFile('index_classic.html');
await requireFile('.well-known/assetlinks.json');

try {
  const version = JSON.parse(versionText);
  if (!version.version || !version.updated) failures.push('version.json must contain version and updated');
} catch { failures.push('version.json is invalid JSON'); }

try {
  const manifest = JSON.parse(manifestText);
  if (manifest.start_url !== '/' || manifest.scope !== '/') failures.push('PWA start_url/scope must both be /');
  if (manifest.display !== 'fullscreen' || manifest.orientation !== 'landscape') failures.push('PWA must be fullscreen landscape');
} catch { failures.push('manifest.webmanifest is invalid JSON'); }

try {
  const assets = JSON.parse(assetManifestText);
  if (!assets.build || !assets.files || Object.keys(assets.files).length < 10) failures.push('asset-manifest.json is incomplete');
} catch { failures.push('asset-manifest.json is invalid JSON'); }

for (const [name, text] of [['sw.js', sw], ['index.html', index], ['index_classic.html', classic]]) {
  if (/__VW_(?:BUILD|PRECACHE)/.test(text)) failures.push(`${name} contains an unreplaced build token`);
}
for (const [name, text] of [['index.html', index], ['index_classic.html', classic]]) {
  if (!text.includes('manifest.webmanifest')) failures.push(`${name} does not reference manifest.webmanifest`);
  if (!text.includes('/assets/build/')) failures.push(`${name} does not use immutable startup assets`);
}
if (/caches\.keys\(\).*caches\.delete|unregister\(\)/s.test(index + classic)) {
  failures.push('HTML still contains destructive cache/service-worker clearing');
}

async function findForbidden(dir, prefix = '') {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name);
    if (entry.isDirectory()) await findForbidden(path.join(dir, entry.name), rel);
    else if (/\.(?:aab|apk|dex|jar|so)$/i.test(entry.name)) failures.push(`native executable leaked into dist: ${rel}`);
  }
}
await findForbidden(DIST);

if (failures.length) {
  console.error(failures.map((item) => `FAIL: ${item}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS: Vocab World web build/PWA/cache/TWA delivery invariants');
}
