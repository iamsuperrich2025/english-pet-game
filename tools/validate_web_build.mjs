import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_ARG = process.argv.indexOf('--dist');
const DIST = path.resolve(DIST_ARG >= 0 && process.argv[DIST_ARG + 1]
  ? process.argv[DIST_ARG + 1]
  : path.join(ROOT, 'dist'));
const failures = [];
const SKY_CHARACTER_ASSETS = [
  'img/characters/sky_soft_cuboid_chibi_8dir.webp',
  'img/characters/sky_soft_cuboid_chibi_explorer_8dir.webp',
  'img/characters/sky_soft_cuboid_chibi_captain_8dir.webp',
  'img/characters/sky_soft_cuboid_chibi_schoolgirl_8dir.webp',
  'img/characters/sky_soft_cuboid_chibi_witch_8dir.webp',
  'img/characters/sky_soft_cuboid_chibi_pajamas_8dir.webp',
];
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
const deletion = await requireFile('delete-account.html');
const privacy = await requireFile('privacy.html');
await requireFile('.well-known/assetlinks.json');
try {
  const engine = await fs.stat(path.join(DIST, 'sound/racing/engineSound.mp3'));
  if (engine.size < 100000) failures.push('F1 engine audio asset is unexpectedly small');
} catch { failures.push('missing dist/sound/racing/engineSound.mp3'); }
for (const asset of SKY_CHARACTER_ASSETS) {
  try {
    const skyCharacter = await fs.stat(path.join(DIST, asset));
    if (skyCharacter.size < 350000) failures.push(`Sky Soft Cuboid Chibi atlas is unexpectedly small: ${asset}`);
  } catch { failures.push(`missing dist/${asset}`); }
}
if (!deletion.includes('freddommun@gmail.com') || !deletion.includes('Delete Account')) failures.push('delete-account.html is incomplete');
if (!privacy.includes('delete-account.html') || !privacy.includes('Profile photos')) failures.push('privacy.html is incomplete');

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
  for (const asset of SKY_CHARACTER_ASSETS) if (!assets.files?.[`/${asset}`]) failures.push(`asset-manifest.json omits ${asset}`);
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
