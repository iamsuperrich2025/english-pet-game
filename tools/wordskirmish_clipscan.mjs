// รอบ 1632 — สแกนท่าทุกคลิป (raw ไม่ align) มุมข้างเดียวกัน
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
await page.evaluate(`
  const t = WordSkirmish._t;
  t.bots.forEach(b => { b.alive = false; if (b.mesh && b.mesh.userData.rig) { const r = b.mesh.userData.rig; Object.values(r.actions).forEach(a => a.stop()); r.current = ''; } });
  t.setLook(0, -0.04); t.setPlayer({ x: 0, z: -8, yaw: 0 });
  t.playerMesh.position.set(0, 0, -8); t.playerMesh.rotation.set(0, 0, 0); t.playerMesh.visible = true;
  t.setRunning(false);
  window.__t = t; window.__rig = t.playerMesh.userData.rig;
  window.__pose = (clip, adv) => { Object.values(__rig.actions).forEach(a => a.stop()); if (clip) { __rig.actions[clip].reset().play(); __rig.current = clip; } __rig.mixer.update(adv || 0.8); };
  window.__cam = (x,y,z,tx,ty,tz) => { __t.camera.fov=40; __t.camera.updateProjectionMatrix(); __t.camera.position.set(x,y,z); __t.camera.lookAt(tx,ty,tz); __t.camera.updateMatrixWorld(); };
  window.__render = () => __t.renderer.render(__t.scene, __t.camera);
  true;`);
// ตัวอย่าง 3 จุดของคลิปยาว (เช่น fire 4 วิ / reload 3.7 วิ / crouch 5.8 วิ)
const plan = [['walk', [.4]], ['sprint', [.3]], ['fire', [.2, 1.6, 3.2]], ['reload', [.5, 1.8, 3.2]], ['crouch', [.5, 2.5, 4.5]], ['aim', [.2, .8]]];
for (const [clip, times] of plan) {
  for (const tm of times) {
    await page.evaluate(`__pose('${clip}', ${tm}); __cam(2.4,1.25,-8, 0,1.1,-8); __render();`);
    await page.screenshot({ path: path.join(out, `s-${clip}-${tm}.png`) });
    console.log(`s-${clip}-${tm}`);
  }
}
await browser.close(); server.close();
