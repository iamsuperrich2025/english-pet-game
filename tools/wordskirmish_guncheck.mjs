// รอบ 1632 — ยืนยันหลังกลับปลายกระบอกใน normalizeGun: muzzle ต้องอยู่ข้างหน้าผู้เล่น + ภาพ side
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
const check = await page.evaluate(`
  (() => {
    const t = WordSkirmish._t, THREE = window.THREE;
    t.bots.forEach(b => { b.alive = false; if (b.mesh && b.mesh.userData.rig) { const r = b.mesh.userData.rig; Object.values(r.actions).forEach(a => a.stop()); r.current = ''; } });
    t.setLook(0, -0.04); t.setPlayer({ x: 0, z: -8, yaw: 0 });
    t.playerMesh.position.set(0, 0, -8); t.playerMesh.rotation.set(0, 0, 0); t.playerMesh.visible = true;
    t.setRunning(false);
    const rig = t.playerMesh.userData.rig;
    Object.values(rig.actions).forEach(a => a.stop());
    rig.actions.aim.reset().play(); rig.current = 'aim'; rig.mixer.update(0.2); rig.mixer.update(0.001);
    const mwp = new THREE.Vector3(); rig.muzzle.getWorldPosition(mwp);
    t.camera.fov = 40; t.camera.updateProjectionMatrix();
    t.camera.position.set(2.2, 1.35, -7.6); t.camera.lookAt(0, 1.2, -8); t.camera.updateMatrixWorld();
    t.renderer.render(t.scene, t.camera);
    return JSON.stringify({ muzzle: [mwp.x, mwp.y, mwp.z].map(v => +v.toFixed(2)), playerZ: -8, muzzleAhead: mwp.z < -8.2 });
  })()`);
console.log('check →', check);
await page.screenshot({ path: path.join(out, 'fix-side.png') });
await browser.close(); server.close();
