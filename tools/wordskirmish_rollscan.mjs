// รอบ 1632 — ถ่าย close-up ปืนมุมเดียว 4 ค่า roll เพื่อเลือกด้าม/สไลด์ถูกด้าน
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
  window.__pose = (clip, adv) => { Object.values(__rig.actions).forEach(a => a.stop()); if (clip) { __rig.actions[clip].reset().play(); __rig.current = clip; } __rig.mixer.update(adv || 0.55); };
  window.__align = (fx,fy,fz) => {
    const THREE = window.THREE, hand = __rig.gun.parent;
    hand.updateWorldMatrix(true,false);
    const wq = new THREE.Quaternion(); hand.getWorldQuaternion(wq);
    const qWorld = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), new THREE.Vector3(fx,fy,fz).normalize());
    const q = wq.clone().invert().multiply(qWorld);
    __rig.gun.quaternion.copy(q);
    return q;
  };
  window.__roll = (deg) => {
    const THREE = window.THREE, q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), deg*Math.PI/180);
    __rig.gun.quaternion.multiply(q);
  };
  window.__gunCam = (rollDeg) => {
    __pose('aim', 0.2); __align(0,0,-1); __roll(rollDeg);
    const THREE = window.THREE, gp = new THREE.Vector3();
    __rig.gun.updateWorldMatrix(true,true); __rig.gun.getWorldPosition(gp);
    __t.camera.fov=30; __t.camera.updateProjectionMatrix();
    __t.camera.position.set(gp.x+1.1, gp.y+0.25, gp.z-0.5);
    __t.camera.lookAt(gp.x, gp.y, gp.z);
    __t.camera.updateMatrixWorld();
    __t.renderer.render(__t.scene, __t.camera);
  };
  true;`);
for (const deg of [0, 90, 180, 270]) {
  await page.evaluate(`__gunCam(${deg})`);
  await page.screenshot({ path: path.join(out, `r${deg}.png`) });
  console.log('r' + deg);
}
// คืนค่าอิลูร์ของ align (roll0) สำหรับอบเข้าโค้ด
const eulers = await page.evaluate(`
  (() => { __pose('aim',0.2); const q = __align(0,0,-1);
    const THREE = window.THREE, e = new THREE.Euler().setFromQuaternion(q, 'XYZ');
    const hand = __rig.gun.parent; hand.updateWorldMatrix(true,false);
    const wq = new THREE.Quaternion(); hand.getWorldQuaternion(wq);
    const gx = new THREE.Vector3(0,0,1).applyQuaternion(wq.clone().multiply(q));
    return JSON.stringify({euler:[e.x,e.y,e.z].map(v=>+v.toFixed(4)), gunWorldDir:[gx.x,gx.y,gx.z].map(v=>+v.toFixed(3))}); })()`);
console.log('align@aim0.2 →', eulers);
await browser.close(); server.close();
