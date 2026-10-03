// รอบ 1632/33 — ยืนยันศพช่วงเฟส A (ไม่มี respawn อัตโนมัติ) + บอทเดินไม่ลื่น (timeScale ตามความเร็ว)
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
await page.waitForFunction(() => WordSkirmish._t.roundState && WordSkirmish._t.roundState.phase === 'A', null, { timeout: 20000 });
await page.waitForTimeout(800);
// บอท cadence ก่อน
const bots = await page.evaluate(() => WordSkirmish._t.bots.slice(0, 3).map(b => { const r = b.mesh.userData.rig; return { clip: r.current, ts: +r.mixer.timeScale.toFixed(2) }; }));
console.log('บอท cadence =', JSON.stringify(bots));
// เดินแล้วตายช่วงเฟส A
await page.keyboard.down('w'); await page.waitForTimeout(600); await page.keyboard.up('w');
await page.evaluate(() => { const t = WordSkirmish._t; t.setPlayer({ hp: 0, alive: false }); t.applyDamage && 0; });
await page.waitForTimeout(700);
const st = await page.evaluate(() => {
  const t = WordSkirmish._t, rig = t.playerMesh.userData.rig, p = t.player;
  t.setRunning(false);
  t.camera.fov = 42; t.camera.updateProjectionMatrix();
  t.camera.position.set(p.x + 2.8, 2.2, p.z + 1.6); t.camera.lookAt(p.x, .3, p.z); t.camera.updateMatrixWorld();
  t.renderer.render(t.scene, t.camera);
  return { alive: t.player.alive, current: rig.current, deadPosed: rig.deadPosed, rz: +t.playerMesh.rotation.z.toFixed(3) };
});
console.log('สถานะตายเฟส A =', JSON.stringify(st));
await page.screenshot({ path: path.join(out, 'dead-phaseA.png') });
await browser.close(); server.close();
