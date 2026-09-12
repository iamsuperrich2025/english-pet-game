/* Development server only. Does not read Firebase production config or deploy anything. */
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { proxyEmulatorHttp, attachEmulatorUpgrade } from './preview-proxy.mjs';
import { randomBytes, createHash } from 'node:crypto';
import { makeAdmission } from './preview-admission.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const depsArg = process.argv.indexOf('--deps');
const DEPS = path.resolve(depsArg >= 0 ? process.argv[depsArg + 1] : path.join(ROOT, 'work/frontline-v1-deps'));
const HOST = process.argv.includes('--lan') ? '0.0.0.0' : '127.0.0.1';
const PROJECT = 'demo-vocab-frontline-v1', NS = PROJECT + '-default-rtdb';
const WEB_PORT = 19444, EMULATOR_PORT = 19445;
const token = randomBytes(12).toString('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const jreDirs = await fs.readdir(path.join(DEPS, 'java'));
const java = process.env.FRONTLINE_JAVA || path.join(DEPS, 'java', jreDirs[0], 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
const jar = await fs.readFile(path.join(DEPS, 'database.jar'));
if (createHash('sha256').update(jar).digest('hex') !== 'b70d99344caf17c98b6f910fa8f6edf32a7c016cb1035e8915f70d38901eb97f') throw Error('Unexpected Firebase emulator checksum.');
const emulator = spawn(java, ['-jar', path.join(DEPS, 'database.jar'), '--host', '127.0.0.1', '--port', String(EMULATOR_PORT), '--single_project_mode', 'Error'],
  { cwd: DEPS, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let emulatorLog = '', stopped = false;
for (const stream of [emulator.stdout, emulator.stderr]) stream.on('data', data => { emulatorLog = (emulatorLog + data).slice(-6000); });
emulator.on('error', error => { console.error(error); process.exitCode = 1; });
emulator.on('exit', code => { if (!stopped) { console.error('Test emulator exited', code, emulatorLog); process.exit(1); } });
const api = `http://127.0.0.1:${EMULATOR_PORT}/.settings/rules.json?ns=${NS}`;
let installed = false;
for (let i = 0; i < 100; i++) {
  try {
    const response = await fetch(api, { method: 'PUT', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: await fs.readFile(path.join(DIR, 'database.rules.json'), 'utf8') });
    if (!response.ok) throw Error(await response.text());
    installed = true; break;
  } catch (error) { if (i === 99) console.error(error); await sleep(200); }
}
if (!installed) { stopped = true; emulator.kill(); throw Error('Emulator rules could not be installed. ' + emulatorLog); }
const shared = { '/shared/items.js': 'js/data/items.js', '/shared/homes.js': 'js/data/homes.js', '/shared/state.js': 'js/state.js', '/shared/thaitime.js': 'js/thaitime.js', '/shared/three.min.js': 'js/vendor/three.min.js', '/shared/gltfloader.js': 'js/vendor/GLTFLoader.js' };
    const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg' };
shared['/shared/vocab.js']='js/data/vocab.js';
shared['/shared/ranks.js']='js/data/ranks.js';
const admit=await makeAdmission(DIR,token,NS,EMULATOR_PORT);
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://' + req.headers.host), hostname = url.hostname;
    if (!/^(localhost|127\.0\.0\.1|\[::1\]|10\.[\d.]+|192\.168\.[\d.]+|172\.(1[6-9]|2\d|3[01])\.[\d.]+)$/.test(hostname)) throw Error('Invalid host');
    const p = decodeURIComponent(url.pathname);
    if(p==='/__dev/frontline/admit')return admit(req,res);
    if (proxyEmulatorHttp(req, res, EMULATOR_PORT, NS)) return;
    let body, ext = path.extname(p);
    if (p === '/dev-config.js') body = `window.FRONTLINE_DEV=${JSON.stringify({ project: PROJECT, namespace: 'frontline_v1_dev', token, port: WEB_PORT, mobileLongPolling: true })};`;
    else if (p === '/' || p === '/__dev/frontline') { body = await fs.readFile(path.join(DIR, 'index.html')); ext = '.html'; }
    else if (p === '/index_classic.html' || p === '/index.html') {
      body = '<!doctype html><html lang="th"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vocab World Lobby</title><body style="margin:0;min-height:100dvh;display:grid;place-items:center;background:linear-gradient(#fff8d4,#b7e08a);font-family:ui-rounded,system-ui,sans-serif;color:#27563a"><main id="lobby-stub" style="text-align:center;padding:24px"><h1>กลับ Lobby</h1><p>หน้าทดสอบ Frontline ไม่มีล็อบบี้เต็มของเกมหลัก</p><p><a href="/__dev/frontline">← Frontline ทดสอบ</a></p></main>';
      ext = '.html';
    }
    else if (shared[p]) {
      body = await fs.readFile(path.join(ROOT, shared[p]), 'utf8');
      if (p === '/shared/state.js') {
        const marker = "const STORAGE_KEY = 'petVocabAdventure_v1';";
        if (body.split(marker).length !== 2) throw Error('Shared save contract changed; refusing unsafe preview.');
        // Reuse central state/coin implementation byte-for-byte except the preview save key.
        body = body.replace(marker, "const STORAGE_KEY = 'vw.frontline-v1.test.save.v1';");
      }
    } else if (/^\/sdk\/firebase-(app|database)-compat\.js$/.test(p)) body = await fs.readFile(path.join(DEPS, path.basename(p)));
    else if (/^\/sound\/Frontline\/bgmusic-[a-f0-9]+\.(ogg|mp3)$/.test(p)) body = await fs.readFile(path.join(ROOT, ...p.slice(1).split('/')));
    else if (/^\/frontline\/assets\/[a-z0-9_-]+\.(avif|webp|glb)$/.test(p)) body = await fs.readFile(path.join(DIR, 'assets', path.basename(p)));
    else if (/^\/frontline\/frontline-[a-z]+\.js$/.test(p) || /^\/frontline\/frontline(?:-[a-z]+)?\.css$/.test(p)) body = await fs.readFile(path.join(DIR, path.basename(p)));
    else throw Error('Not found');
    const binary=ext==='.ogg'||ext==='.mp3'||ext==='.glb'||ext==='.avif'||ext==='.webp';
    res.writeHead(200, { 'Content-Type': (mime[ext] || 'text/plain') + (binary?'':'; charset=utf-8'), 'Cache-Control': /^\/sound\/Frontline\/bgmusic-/.test(p)?'public, max-age=31536000, immutable':'no-store',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'` });
    res.end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
});
server.on('error', error => { console.error(error); stopped = true; emulator.kill(); process.exit(1); });
attachEmulatorUpgrade(server, EMULATOR_PORT, NS);
server.listen(WEB_PORT, HOST, () => {
  console.log('Frontline V1 local preview: http://127.0.0.1:19444/__dev/frontline');
  console.log(`Emulator only: ${NS}/frontline_v1_dev/${token}/rooms/<CODE>`);
  console.log('Single-port LAN gateway: browsers use 19444; emulator stays on 127.0.0.1:19445.');
  console.log('Production routes, Firebase data, and save keys are inaccessible. Ctrl+C stops both processes.');
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { stopped = true; server.close(); emulator.kill(); process.exit(0); });
