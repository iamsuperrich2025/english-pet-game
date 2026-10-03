// รอบ 1632 — ถ่ายภาพสด close-up ทหาร+ปืน (จูนท่ายิง/มุมปืน)
// เข้าสนาม → หยุดลูป (setRunning false) → คุมท่า/กล้อง/เรนเดอร์เองผ่าน evaluate แล้ว screenshot ทีละมุม
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
// ตั้งผู้เล่นกลางสนาม หันหน้า -Z (yaw 0) · บอทพับไปก่อน แล้วหยุดลูปเพื่อคุมเฟรมเอง
await page.evaluate(() => {
  const t = WordSkirmish._t;
  t.bots.forEach(b => { b.alive = false; if (b.mesh && b.mesh.userData.rig) { const r = b.mesh.userData.rig; Object.values(r.actions).forEach(a => a.stop()); r.current = ''; } });
  t.setLook(0, -0.04);
  t.setPlayer({ x: 0, z: -8, yaw: 0 });
  t.playerMesh.position.set(0, 0, -8);
  t.playerMesh.rotation.set(0, 0, 0);
  t.playerMesh.visible = true;
  t.setRunning(false);
});
await page.waitForTimeout(200);

const shot = async (name, js) => {
  await page.evaluate(js);
  await page.screenshot({ path: path.join(out, name) });
  console.log('shot', name);
};
// helper ในเพจ: ตั้งท่า + มุมกล้อง + เหวี่ยงแสงยิง (ถ้าต้องการ) แล้วเรนเดอร์
const PRE = `
  const t = WordSkirmish._t, rig = t.playerMesh.userData.rig;
  window.__pose = (clip, adv) => {
    Object.values(rig.actions).forEach(a => a.stop());
    if (clip) { rig.actions[clip].reset().play(); rig.current = clip; }
    rig.mixer.update(adv || 0.55);
    rig.mixer.update(0.001);
  };
  window.__cam = (x, y, z, tx, ty, tz) => {
    t.camera.fov = 42; t.camera.updateProjectionMatrix();
    t.camera.position.set(x, y, z); t.camera.lookAt(tx, ty, tz);
    t.camera.updateMatrixWorld();
  };
  window.__render = () => t.renderer.render(t.scene, t.camera);
  window.__p = () => t.player;
  true;`;
await page.evaluate(PRE);

// 1) idle ข้างกาย — เห็นจุดยึดปืนกับมือชัดๆ
await shot('1-idle-side.png', `__pose('idle'); const p=__p(); __cam(p.x+2.1,1.35,p.z+0.4, p.x,1.05,p.z); __render();`);
// 2) idle เฉียงหน้า
await shot('2-idle-front.png', `__pose('idle'); const p=__p(); __cam(p.x+1.5,1.45,p.z-1.9, p.x,1.1,p.z); __render();`);
// 3) aim (เล็ง) ข้างกาย
await shot('3-aim-side.png', `__pose('aim'); const p=__p(); __cam(p.x+2.1,1.35,p.z+0.4, p.x,1.05,p.z); __render();`);
// 4) aim เฉียงหน้า — มุมปากกระบอก vs ทิศเล็ง
await shot('4-aim-front.png', `__pose('aim'); const p=__p(); __cam(p.x+1.5,1.45,p.z-1.9, p.x,1.1,p.z); __render();`);
// 5) fire + muzzle flash ด้านหน้า
await shot('5-fire-muzzle.png', `__pose('fire',0.1); const p=__p(); WordSkirmish._t.muzzleTest(); __cam(p.x+1.6,1.5,p.z-2.2, p.x,1.35,p.z); __render();`);
// 6) crouch ข้างกาย
await shot('6-crouch-side.png', `__pose('crouch'); const p=__p(); __cam(p.x+2.1,1.15,p.z+0.4, p.x,0.8,p.z); __render();`);
// 7) reload ข้างกาย
await shot('7-reload-side.png', `__pose('reload'); const p=__p(); __cam(p.x+2.1,1.35,p.z+0.4, p.x,1.05,p.z); __render();`);
// 8) มุม over-shoulder แบบเกมจริงตอน aim (เทียบ sight line)
await shot('8-aim-shoulder.png', `__pose('aim'); const p=__p(); __cam(p.x+Math.sin(0)*1.35,1.55,p.z+Math.cos(0)*1.35, p.x,1.3,p.z-6); __render();`);
console.log('done → _t/ws1632');
await browser.close(); server.close();
