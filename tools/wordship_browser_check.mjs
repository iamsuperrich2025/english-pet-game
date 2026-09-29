// รอบ 1624 — กัน回归 "กดปุ่มกองเรือแล้วนิ่ง": โอเวอร์เลย์โหลด + timeout fallback + preload
// เคส A: ปกติ (ต้องเข้าเกมได้ เรือ glb) · B: GLB โดนบล็อก (ต้อง fallback เรือ cute แล้วเข้าเกม) · C: GLB ช้า (ต้องเห็นโอเวอร์เลย์ %)
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.cwd()),out=path.resolve('_t/ws1624');await fs.mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://local').pathname);const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep))throw Error();const body=await fs.readFile(f);res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.glb')?'model/gltf-binary':'application/octet-stream');res.setHeader('content-length',body.length);res.end(body);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(18770,'127.0.0.1',r));
const results={};
async function newPage(browser,errors){
  const page=await browser.newPage();
  await page.setViewportSize({width:1318,height:615});
  page.on('pageerror',e=>errors.push('pageerror:'+e.message));
  page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });
  return page;
}
const state=()=>page.evaluate(()=>({running:WordShip._t.running,style:WordShip._t.shipStyle,overlay:!!document.querySelector('#wsh-ship-load'),overlayText:(document.querySelector('#wsh-ship-load')||{}).textContent||null,vfx:!!WordShip._t.getWaterVFX()}));
let page;
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
  // A: ปกติ
  let errsA=[]; page=await newPage(browser,errsA);
  await page.goto('http://127.0.0.1:18770/tools/wordship_preview.html');
  await page.waitForFunction(()=>window.WordShip&&WordShip._t.running===true,null,{timeout:15000});
  await page.waitForTimeout(600);
  results.A=await state(); results.A.errors=errsA;
  await page.click('#wsh-intro button'); // กด "ออกทะเล!" จริง — เกมถึงจะ unpause (ซ่อนแผงอย่างเดียวคือสาเหตุเรือค้างที่จุดเริ่ม)
  await page.waitForTimeout(400);
  await page.evaluate(()=>WordShip._t.setPaused(true)); // หยุดนิ่งเพื่อถ่ายภาพ
  await page.waitForTimeout(300);
  await page.screenshot({path:path.join(out,'A-normal.png')});
  await page.close();

  // B: GLB โดนบล็อก — ต้อง fallback cute แล้วเข้าเกมได้
  let errsB=[]; page=await newPage(browser,errsB);
  await page.route('**/ship_1_web.glb',r=>r.abort());
  await page.goto('http://127.0.0.1:18770/tools/wordship_preview.html');
  await page.waitForFunction(()=>window.WordShip&&WordShip._t.running===true,null,{timeout:15000});
  await page.waitForTimeout(600);
  results.B=await state(); results.B.errors=errsB;
  await page.screenshot({path:path.join(out,'B-blocked.png')});
  await page.close();

  // C: GLB ช้า 2.5 วิ — ต้องเห็นโอเวอร์เลย์ตอนรอ แล้วเข้าเกม glb ปกติ
  let errsC=[]; page=await newPage(browser,errsC);
  await page.route('**/ship_1_web.glb',async r=>{await new Promise(s=>setTimeout(s,2500));r.continue();});
  await page.goto('http://127.0.0.1:18770/tools/wordship_preview.html');
  let sawOverlay=false,overlayText=null;
  try{ await page.waitForSelector('#wsh-ship-load',{timeout:2600}); sawOverlay=true; overlayText=await page.$eval('#wsh-ship-load',el=>el.textContent); await page.screenshot({path:path.join(out,'C-overlay.png')}); }catch(_){}
  await page.waitForFunction(()=>window.WordShip&&WordShip._t.running===true,null,{timeout:15000});
  await page.waitForTimeout(600);
  results.C=await state(); results.C.sawOverlay=sawOverlay; results.C.overlayText=overlayText; results.C.errors=errsC;
  await page.screenshot({path:path.join(out,'C-loaded.png')});
  await page.close();

  // D: สมจริงหน้า classic — ไม่มี THREE ล่วงหน้า ต้องเจอหน้าพัก แล้วโหลด three.min.js เองจนเข้าเกมได้
  let errsD=[]; page=await newPage(browser,errsD);
  await page.route('**/three.min.js',async r=>{await new Promise(s=>setTimeout(s,1600));r.continue();}); // จำลองเน็ตช้าให้เห็นหน้าพัก
  await page.goto('http://127.0.0.1:18770/tools/wordship_preview_classic.html',{waitUntil:'domcontentloaded'});
  let sawBoot=false,bootText=null;
  try{ await page.waitForSelector('#wsh-boot-load',{state:'visible',timeout:4000}); sawBoot=true; bootText=await page.$eval('#wsh-boot-load .wsh-boot-txt',el=>el.textContent); await page.screenshot({path:path.join(out,'D-boot.png')}); }catch(_){}
  await page.waitForFunction(()=>window.WordShip&&WordShip._t.running===true,null,{timeout:20000});
  await page.waitForTimeout(600);
  results.D=await state(); results.D.sawBoot=sawBoot; results.D.bootText=bootText;
  results.D.threeLoaded=await page.evaluate(()=>!!window.THREE);
  results.D.errors=errsD;
  await page.screenshot({path:path.join(out,'D-opened.png')});
  await page.close();
}finally{ await browser.close(); server.close(); }
console.log(JSON.stringify(results,null,1));
