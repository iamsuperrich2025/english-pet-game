// รอบ 1632 — ยืนยันท่าผ่าน code path จริง: ปล่อยลูปวิ่ง (poseSoldier แมพ idle→aim เอง) แล้วค่อย freeze ถ่าย
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
// ปล่อยให้ลูปวิ่ง 1.2 วิ (ผู้เล่นยืนนิ่ง → poseSoldier ต้องเลือก aim เอง) แล้วอ่านคลิปจริง ก่อน freeze
const clip = await page.evaluate(async () => {
  const t = WordSkirmish._t;
  t.setLook(0, -0.04); t.setPlayer({ x: 0, z: -8, yaw: 0 });
  await new Promise(r => setTimeout(r, 1200));
  return t.playerMesh.userData.rig.current;
});
console.log('clip ที่เลือกจริงตอนยืนนิ่ง =', clip);
await page.evaluate(() => {
  const t = WordSkirmish._t;
  t.setRunning(false);
  t.playerMesh.position.set(0, 0, -8); t.playerMesh.rotation.set(0, 0, 0); t.playerMesh.visible = true;
  t.playerMesh.userData.rig.mixer.update(0.02);
  t.camera.fov = 42; t.camera.updateProjectionMatrix();
  t.camera.position.set(2.2, 1.35, -7.6); t.camera.lookAt(0, 1.15, -8); t.camera.updateMatrixWorld();
  t.renderer.render(t.scene, t.camera);
});
await page.screenshot({ path: path.join(out, 'v-idle-real.png') });
// บอทตัวหนึ่งให้ฟื้น+ยืนนิ่ง → เช็คบอทก็เฝ้าท่าเล็งเหมือนกัน
await page.evaluate(() => {
  const t = WordSkirmish._t;
  const b = t.bots[0]; b.alive = true; b.hp = 100; b.x = 2.5; b.z = -10;
  b.mesh.position.set(2.5, 0, -10); b.mesh.rotation.set(0, -0.6, 0); b.mesh.visible = true;
  t.camera.position.set(4.6, 1.4, -8.4); t.camera.lookAt(2.5, 1.1, -10); t.camera.updateMatrixWorld();
  t.renderer.render(t.scene, t.camera);
});
await page.screenshot({ path: path.join(out, 'v-bot-real.png') });
console.log('done');
await browser.close(); server.close();
