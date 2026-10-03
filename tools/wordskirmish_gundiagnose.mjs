// รอบ 1632 — วินิจฉัย: คลิป aim จริงเป็นแบบไหน + ทดลองหมุนปืนให้ลำกล้องชี้ทิศเล็ง
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
const info = await page.evaluate(() => {
  const t = WordSkirmish._t;
  t.bots.forEach(b => { b.alive = false; if (b.mesh && b.mesh.userData.rig) { const r = b.mesh.userData.rig; Object.values(r.actions).forEach(a => a.stop()); r.current = ''; } });
  t.setLook(0, -0.04); t.setPlayer({ x: 0, z: -8, yaw: 0 });
  t.playerMesh.position.set(0, 0, -8); t.playerMesh.rotation.set(0, 0, 0); t.playerMesh.visible = true;
  t.setRunning(false);
  const rig = t.playerMesh.userData.rig;
  const clips = {}; for (const k in rig.actions) clips[k] = +rig.actions[k].getClip().duration.toFixed(2);
  return { clips, gunParent: rig.gun ? rig.gun.parent.name : null };
});
console.log('clips:', JSON.stringify(info));
const shot = async (name, js) => { await page.evaluate(js); await page.screenshot({ path: path.join(out, name) }); console.log('shot', name); };
await page.evaluate(`
  window.__t = WordSkirmish._t; window.__rig = __t.playerMesh.userData.rig;
  window.__pose = (clip, adv) => { Object.values(__rig.actions).forEach(a => a.stop()); if (clip) { __rig.actions[clip].reset().play(); __rig.current = clip; } __rig.mixer.update(adv || 0.55); };
  window.__cam = (x,y,z,tx,ty,tz) => { __t.camera.fov=42; __t.camera.updateProjectionMatrix(); __t.camera.position.set(x,y,z); __t.camera.lookAt(tx,ty,tz); __t.camera.updateMatrixWorld(); };
  window.__render = () => __t.renderer.render(__t.scene, __t.camera);
  // คำนวณหมุนปืนให้ลำกล้อง (+Z ของปืน) ชี้ทิศ fwd ในโลก คืนเป็นมุมอิลูร์
  window.__align = (fx,fy,fz) => {
    const THREE = window.THREE, hand = __rig.gun.parent;
    hand.updateWorldMatrix(true,false);
    const wq = new THREE.Quaternion(); hand.getWorldQuaternion(wq);
    const qWorld = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), new THREE.Vector3(fx,fy,fz).normalize());
    const q = wq.clone().invert().multiply(qWorld);
    __rig.gun.quaternion.copy(q);
    return [q.x,q.y,q.z,q.w].map(v=>+v.toFixed(3));
  };
  window.__roll = (deg) => { // หมุนรอบแกนลำกล้องหลัง align
    const THREE = window.THREE, q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), deg*Math.PI/180);
    __rig.gun.quaternion.multiply(q);
  };
  true;`);
// aim มุมข้างเพียวๆ (ยังไม่ align) — ดูว่าคลิป aim แขนชี้ทางไหน
await shot('d1-aim-raw-side.png', `__pose('aim'); __cam(2.3,1.2,-8, 0,1.05,-8); __render();`);
// align ลำกล้องไปทาง -Z (ทิศเล็งตอน yaw 0) แล้วลอง roll 4 ค่า
for (const deg of [0, 90, 180, 270]) {
  await shot(`d2-aim-aligned-roll${deg}.png`, `__pose('aim',0.001); const q=__align(0,0,-1); __roll(${deg}); __cam(2.3,1.2,-8, 0,1.05,-8); __render();`);
}
// idle หลัง align (ท่าเดินถือปืน) — ดูข้าง+หน้า
await shot('d3-idle-aligned-side.png', `__pose('idle',0.001); __align(0,0,-1); __roll(0); __cam(2.3,1.2,-8, 0,1.05,-8); __render();`);
await shot('d4-idle-aligned-front.png', `__pose('idle',0.001); __cam(1.4,1.4,-9.9, 0,1.1,-8); __render();`);
console.log(await page.evaluate(() => JSON.stringify({ savedAlign: window.__lastQ || null })));
await browser.close(); server.close();
