// รอบ 1635 — เทียบแอนิเมชันต้นฉบับ vs merged: ถ่ายชุดเฟรมเดียวกันของคลิป fire/aim/walk
import fs from 'node:fs/promises'; import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { chromium } = require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(process.cwd()), out = path.resolve('_t/ws1635'); await fs.mkdir(out, { recursive: true });
const server = http.createServer(async (req, res) => { try { const p = decodeURIComponent(new URL(req.url, 'http://local').pathname); const f = path.resolve(root, '.' + p); if (!f.startsWith(root + path.sep)) throw Error(); const body = await fs.readFile(f); res.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.glb') ? 'model/gltf-binary' : 'application/octet-stream'); res.end(body); } catch { res.statusCode = 404; res.end(); } });
await new Promise(r => server.listen(18773, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage(); await page.setViewportSize({ width: 900, height: 700 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
const shots = [
  ['orig-fire', 'minigames/VocabSkirmish/animations/sol1_Side_Shot.glb', [0.15, 0.8, 1.6, 2.6]],
  ['v2-fire', 'minigames/VocabSkirmish/models/soldier_v2.glb', [0.15, 0.8, 1.6, 2.6]],
  ['orig-aim', 'minigames/VocabSkirmish/animations/sol1_Walk_Forward_with_Bow.glb', [0.3, 0.9]],
  ['v2-aim', 'minigames/VocabSkirmish/models/soldier_v2.glb', [0.3, 0.9]],
];
for (const [tag, src, times] of shots) {
  const clip = tag.includes('fire') ? 'fire' : (tag.includes('aim') ? 'aim' : '');
  await page.goto('http://127.0.0.1:18773/tools/anim_viewer.html?src=' + encodeURIComponent(src) + (tag.startsWith('v2') ? '&clip=' + clip : ''));
  await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  console.log(tag, 'clips:', await page.evaluate(() => window.clipNames.join(',')));
  for (const t of times) {
    await page.evaluate(tt => window.seek(tt), t);
    await page.screenshot({ path: path.join(out, `${tag}-t${t}.png`) });
  }
  console.log('shot', tag);
}
await browser.close(); server.close();
