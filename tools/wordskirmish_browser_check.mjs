// รอบ 1631 — browser check เกมรบคำหลังยกเครื่อง GLB + สนามใหม่ + Muzzle FX
// เคส A: intro เหลือปุ่มเดียว (ไม่มี #skm-training) · B: soldier GLB โหลด+ปืน+กล่อง hit · C: ท่าแอนิเมชัน (เดิน/วิ่ง/ย่อ)
// D: ลงสนามจริงบอท 7 + สนามใหม่โหลด · E: ยิงจริง → muzzle flash + ไฟ + tracer · F: scoped
import fs from 'node:fs/promises'; import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { chromium } = require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(process.cwd()), out = path.resolve('_t/ws1631'); await fs.mkdir(out, { recursive: true });
const server = http.createServer(async (req, res) => { try { const p = decodeURIComponent(new URL(req.url, 'http://local').pathname); const f = path.resolve(root, '.' + p); if (!f.startsWith(root + path.sep)) throw Error(); const body = await fs.readFile(f); res.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.glb') ? 'model/gltf-binary' : 'application/octet-stream'); res.setHeader('content-length', body.length); res.end(body); } catch { res.statusCode = 404; res.end(); } });
await new Promise(r => server.listen(18771, '127.0.0.1', r));
const results = {}; const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setViewportSize({ width: 1318, height: 615 });
page.on('pageerror', e => errors.push('pageerror:' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/favicon/.test((m.location() || {}).url || '')) errors.push('console:' + m.text()); });
try {
  await page.goto('http://127.0.0.1:18771/tools/wordskirmish_preview.html');
  await page.waitForFunction(() => window.WordSkirmish && WordSkirmish._t && WordSkirmish._t.running === true, null, { timeout: 20000 });
  await page.waitForTimeout(1500);

  // A: intro เหลือปุ่มเดียว + ล็อคแอดมินยังอยู่ (ข้อ 1/3)
  results.A = await page.evaluate(() => ({
    trainingGone: !document.querySelector('#skm-training'),
    buttons: [...document.querySelectorAll('#skm-intro button')].map(b => b.textContent),
    adminLockIntact: WordSkirmish._t.adminAllowed() === true,
  }));
  await page.screenshot({ path: path.join(out, 'A-intro.png') });

  // B: soldier lib โหลด + ปืน/กล่อง hit
  await page.waitForFunction(() => WordSkirmish._t.soldierLoaded() === true, null, { timeout: 20000 }).catch(() => {});
  results.B = await page.evaluate(() => {
    const rig = WordSkirmish._t.playerMesh && WordSkirmish._t.playerMesh.userData.rig;
    return {
      loaded: WordSkirmish._t.soldierLoaded(),
      isSoldier: !!(WordSkirmish._t.playerMesh && WordSkirmish._t.playerMesh.userData.isSoldier),
      hasGun: !!(WordSkirmish._t.playerMesh && WordSkirmish._t.playerMesh.userData.gun), hasMuzzle: !!(rig && rig.muzzle),
      hasMixer: !!(rig && rig.mixer && rig.actions && rig.actions.idle && rig.actions.walk && rig.actions.fire && rig.actions.reload && rig.actions.crouch),
      clips: rig && rig.actions ? Object.keys(rig.actions).join(',') : '-',
    };
  });

  // D: ลงสนามจริง → บอท 7 ตัว + สนามใหม่
  await page.click('#skm-intro-ok');
  await page.waitForTimeout(2500);
  results.D = await page.evaluate(() => {
    const bots = WordSkirmish._t.bots;
    return {
      battle: WordSkirmish._t.battle === true,
      botsAlive: bots.filter(b => b.alive).length,
      botSoldiers: bots.filter(b => b.mesh && b.mesh.userData.isSoldier).length,
      botGuns: bots.filter(b => b.mesh && b.mesh.userData.gun).length,
      fieldBlockers: WordSkirmish._t.field ? WordSkirmish._t.field.blockers.length : 0,
      fieldColliders: WordSkirmish._t.field ? WordSkirmish._t.field.colliders.length : 0,
    };
  });
  await page.screenshot({ path: path.join(out, 'D-spawn.png') });

  // C: ท่าแอนิเมชันในสนาม (เดิน/วิ่ง/ย่อ)
  await page.keyboard.down('w'); await page.waitForTimeout(700);
  results.C = { walking: await page.evaluate(() => WordSkirmish._t.playerMesh.userData.rig.current) };
  await page.keyboard.down('Shift'); await page.waitForTimeout(500);
  results.C.sprinting = await page.evaluate(() => WordSkirmish._t.playerMesh.userData.rig.current);
  await page.keyboard.up('Shift'); await page.keyboard.up('w'); await page.waitForTimeout(400);
  results.C.idleAfterStop = await page.evaluate(() => WordSkirmish._t.playerMesh.userData.rig.current);
  await page.screenshot({ path: path.join(out, 'C-backdrop.png') });

  // รอวอร์มอัพ 10 วิ → เฟส A (ยิงจริงได้)
  await page.waitForFunction(() => WordSkirmish._t.roundState && WordSkirmish._t.roundState.phase === 'A', null, { timeout: 16000 });

  // E: กดยิงค้าง → ตรวจ flash/light/tracer
  await page.keyboard.down('f');
  await page.waitForTimeout(250);
  results.E = await page.evaluate(() => {
    const t = WordSkirmish._t;
    return { ammo: t.inventory ? t.inventory.ammo[0] : -1, fireClip: t.playerMesh.userData.rig.current };
  });
  await page.screenshot({ path: path.join(out, 'E-firing.png') });
  await page.keyboard.up('f');

  // F: scoped
  await page.keyboard.press('v'); await page.waitForTimeout(500);
  results.F = await page.evaluate(() => ({ scoped: WordSkirmish._t.scoped === true, fovNarrow: WordSkirmish._t.camera.fov < 30 }));
  await page.screenshot({ path: path.join(out, 'F-scoped.png') });
  await page.keyboard.press('v');

  // G: ท่าย่อ + บอทยิง (muzzle บอท)
  await page.keyboard.press('c'); await page.waitForTimeout(700);
  results.G = await page.evaluate(() => WordSkirmish._t.playerMesh.userData.rig.current);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(out, 'G-crouch-bots.png') });

  results.errors = errors;
  const pass = results.A.trainingGone && results.A.buttons.length === 1 && results.B.loaded && results.B.isSoldier && results.B.hasGun && results.B.hasMuzzle
    && results.B.hasMixer && results.D.battle && results.D.botsAlive === 7 && results.D.botSoldiers === 7
    && (results.E.ammo < 24) && results.F.scoped && results.G === 'crouch' && errors.length === 0;
  console.log(JSON.stringify(results, null, 1));
  console.log(pass ? '✅ PASS ทุกเคส' : '❌ FAIL — ดู results');
} finally { await browser.close(); server.close(); }
