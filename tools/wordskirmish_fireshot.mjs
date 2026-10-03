// รอบ 1635 — ถ่ายท่ายิงจริงหลัง FIRE_AT (ข้าม windup) พร้อมปืน
import fs from 'node:fs/promises'; import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { chromium } = require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(process.cwd()), out = path.resolve('_t/ws1635'); await fs.mkdir(out, { recursive: true });
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
await page.waitForTimeout(500);
await page.keyboard.down('f'); await page.waitForTimeout(430); // อยู่ในช่วง forceClip fire (0.32s) + เผื่อเฟรม
const st = await page.evaluate(() => {
  const t = WordSkirmish._t, rig = t.playerMesh.userData.rig, p = t.player;
  t.setRunning(false);
  rig.mixer.update(0.05);
  t.camera.fov = 42; t.camera.updateProjectionMatrix();
  t.camera.position.set(p.x + 2.2, 1.45, p.z + 0.6); t.camera.lookAt(p.x, 1.15, p.z); t.camera.updateMatrixWorld();
  t.renderer.render(t.scene, t.camera);
  return { clip: rig.current, fireTime: +rig.actions.fire.time.toFixed(2) };
});
console.log('ตอนยิง =', JSON.stringify(st));
await page.screenshot({ path: path.join(out, 'fire-new.png') });
await browser.close(); server.close();
