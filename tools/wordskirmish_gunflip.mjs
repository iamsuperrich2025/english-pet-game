// รอบ 1632 — กลับกระบอกปืน 180° (พานท้ายชี้หน้า → ปากกระบอกชี้หน้า) คำนวณอิลูร์ใหม่ + ถ่ายยืนยัน
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
  true;`);
const res = await page.evaluate(`
  (() => {
    const THREE = window.THREE;
    __pose('aim', 0.2);
    // อิลูร์ปัจจุบัน (หัวกลับ) → คูณกลับรอบแกน Y ใน local 180°
    const qOld = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.8228, -0.207, 2.4634, 'XYZ'));
    const qFlip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const qNew = qOld.clone().multiply(qFlip);
    const e = new THREE.Euler().setFromQuaternion(qNew, 'XYZ');
    __rig.gun.quaternion.copy(qNew);
    // ยิง muzzleTest ที่ปลาย +Z ใหม่เพื่อเช็กว่าไฟออกปลายกระบอกจริง
    __rig.mixer.update(0.001);
    const gp = new THREE.Vector3(); __rig.gun.updateWorldMatrix(true, true); __rig.gun.getWorldPosition(gp);
    const mz = new THREE.Vector3(0, 0, .475).applyMatrix4(__rig.gun.matrixWorld);
    // กล้องมองจากข้างหน้า-ข้าง: เห็นว่าปลายไหนเป็นไฟ
    __t.camera.fov = 38; __t.camera.updateProjectionMatrix();
    __t.camera.position.set(1.6, 1.5, -10.4); __t.camera.lookAt(0, 1.3, -8.6); __t.camera.updateMatrixWorld();
    __t.muzzleTest && 0;
    // แสงจากปลายกระบอกจริง (ใช้ muzzle world ของ rig)
    const mwp = new THREE.Vector3(); __rig.muzzle.getWorldPosition(mwp);
    window.__mwp = [mwp.x, mwp.y, mwp.z];
    __t.renderer.render(__t.scene, __t.camera);
    return JSON.stringify({ euler: [e.x, e.y, e.z].map(v => +v.toFixed(4)), muzzleWorld: [mwp.x, mwp.y, mwp.z].map(v => +v.toFixed(2)) });
  })()`);
console.log('flipped →', res);
await page.screenshot({ path: path.join(out, 'flip-aim.png') });
console.log('done');
await browser.close(); server.close();
