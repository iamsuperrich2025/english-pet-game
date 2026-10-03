// รอบ 1634 — ปุ่ม/คีย์ "ออก" ตอน scoped ต้องออกแค่สโคป ไม่ออกเกม
import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { chromium } = require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(process.cwd());
const server = http.createServer(async (req, res) => { try { const p = decodeURIComponent(new URL(req.url, 'http://local').pathname); const f = path.resolve(root, '.' + p); if (!f.startsWith(root + path.sep)) throw Error(); const body = await fs_read(f); res.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.glb') ? 'model/gltf-binary' : 'application/octet-stream'); res.end(body); } catch { res.statusCode = 404; res.end(); } });
import fs from 'node:fs/promises'; const fs_read = fs.readFile;
await new Promise(r => server.listen(18773, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage(); await page.setViewportSize({ width: 1318, height: 615 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('http://127.0.0.1:18773/tools/wordskirmish_preview.html');
await page.waitForFunction(() => window.WordSkirmish && WordSkirmish._t && WordSkirmish._t.running === true, null, { timeout: 20000 });
await page.waitForTimeout(1200);
await page.click('#skm-intro-ok');
await page.waitForTimeout(2500);
await page.keyboard.press('v'); await page.waitForTimeout(400);
const scoped0 = await page.evaluate(() => WordSkirmish._t.scoped);
await page.click('#skm-exit'); await page.waitForTimeout(300);
const afterBtn = await page.evaluate(() => ({ scoped: WordSkirmish._t.scoped, running: WordSkirmish._t.running, battle: WordSkirmish._t.battle, rootShown: document.querySelector('#skm-root') ? document.querySelector('#skm-root').style.display : '?' }));
await page.keyboard.press('v'); await page.waitForTimeout(300);
await page.keyboard.press('Escape'); await page.waitForTimeout(300);
const afterEsc = await page.evaluate(() => ({ scoped: WordSkirmish._t.scoped, running: WordSkirmish._t.running, battle: WordSkirmish._t.battle }));
// ไม่ scoped แล้วกดออก = ออกเกมได้ปกติ
await page.keyboard.press('Escape'); await page.waitForTimeout(300);
const afterEsc2 = await page.evaluate(() => ({ running: WordSkirmish._t.running }));
console.log(JSON.stringify({ scoped0, afterBtn, afterEsc, afterEsc2 }, null, 1));
const pass = scoped0 === true && afterBtn.scoped === false && afterBtn.running === true && afterBtn.battle === true
  && afterEsc.scoped === false && afterEsc.running === true && afterEsc2.running === false;
console.log(pass ? '✅ PASS' : '❌ FAIL');
await browser.close(); server.close();
