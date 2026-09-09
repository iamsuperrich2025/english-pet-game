/* One-time optional development dependencies, saved only under work/. */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = path.join(ROOT, 'work/frontline-v1-deps');
await fs.mkdir(DIR, { recursive: true });
async function download(url, name, hash) {
  const response = await fetch(url); if (!response.ok) throw Error('Download failed: ' + response.status);
  const data = Buffer.from(await response.arrayBuffer());
  if (hash && createHash('sha256').update(data).digest('hex') !== hash) throw Error('Checksum failed: ' + name);
  await fs.writeFile(path.join(DIR, name), data); console.log(name, data.length, 'bytes (development only)');
}
const releases = await fetch('https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jre&os=windows&vendor=eclipse').then(r => r.json());
const jre = releases[0]?.binary?.package; if (!jre?.link || !jre.checksum) throw Error('Java package unavailable');
await Promise.all([
  download(jre.link, 'jre.zip', jre.checksum),
  download('https://storage.googleapis.com/firebase-preview-drop/emulator/firebase-database-emulator-v4.11.2.jar', 'database.jar', 'b70d99344caf17c98b6f910fa8f6edf32a7c016cb1035e8915f70d38901eb97f'),
  ...['app', 'database'].map(name => download(`https://www.gstatic.com/firebasejs/9.23.0/firebase-${name}-compat.js`, `firebase-${name}-compat.js`))
]);
await fs.mkdir(path.join(DIR, 'java'), { recursive: true });
execFileSync('tar.exe', ['-xf', path.join(DIR, 'jre.zip'), '-C', path.join(DIR, 'java')], { windowsHide: true });
console.log('Ready: node tools/frontline-v1/preview.mjs');
