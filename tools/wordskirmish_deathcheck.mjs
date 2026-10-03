// รอบ 1632 — ยืนยันศพทหาร: เดินแล้วตายต้องนอนตรง ไม่ค้างท่าเดิน + เกิดใหม่กลับมาเดินได้
import fs from 'node:fs/promises'; import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { chromium } = require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(process.cwd()), out = path.resolve('_t/ws1632'); await fs.mkdir(out, { recursive: true });
const server = http.createServer(async (req, res) => { try { const p = decodeURIComponent(new URL(req.url, 'http://local').pathname); const f = path.resolve(root, '.' + p); if (!f.startsWith(root + path.sep)) throw Error(); const body = await fs.readFile(f); res.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.glb') ? 'model/gltf-binary' : 'application/octet-stream'); res.end(body); } catch { res.statusCode = 404; res.end(); } });
await new Promise(r => server.listen(18773, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage(); await page.setViewportSize({ width: 1318, height: 615 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('http://127.0.0.1:18773/tools/wordskirmish_preview.html');
await page.waitForFunction(() => window.WordSkirmish && WordSkirmish._t && WordSkirmish._t.running === true, null, { timeout: 20000 });
await page.waitForTimeout(1200);
await page.click('#skm-intro-ok');
await page.waitForTimeout(2500);
// เดินไป 0.7 วิ แล้วตายค้างท่าเดิน
await page.keyboard.down('w'); await page.waitForTimeout(700);
const dead = await page.evaluate(() => {
  const t = WordSkirmish._t;
  t.setPlayer({ hp: 0, alive: false, respawnAt: 1e9 });
  return { walking: t.playerMesh.userData.rig.current };
});
await page.keyboard.up('w');
await page.waitForTimeout(600); // ให้ step วางท่าศพ + หมุนนอน
await page.evaluate(() => {
  const t = WordSkirmish._t; t.setRunning(false);
  const p = t.player;
  t.camera.fov = 42; t.camera.updateProjectionMatrix();
  t.camera.position.set(p.x + 2.4, 1.6, p.z + 1.2); t.camera.lookAt(p.x, .35, p.z); t.camera.updateMatrixWorld();
  t.renderer.render(t.scene, t.camera);
});
console.log('ตอนตายคลิปล่าสุด =', JSON.stringify(dead));
await page.screenshot({ path: path.join(out, 'dead-body.png') });
// เกิดใหม่ → ต้องกลับมาเล่นท่า aim ได้
const back = await page.evaluate(async () => {
  const t = WordSkirmish._t;
  t.setRunning(true);
  t.setPlayer({ hp: 100, alive: true, respawnAt: 0 });
  await new Promise(r => setTimeout(r, 700));
  return { clip: t.playerMesh.userData.rig.current, deadPosed: t.playerMesh.userData.rig.deadPosed, rz: t.playerMesh.rotation.z };
});
console.log('หลังเกิดใหม่ =', JSON.stringify(back));
await browser.close(); server.close();
