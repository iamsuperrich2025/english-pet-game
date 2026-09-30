// ถ่ายภาพเกมจริง wordship (ผ่าน preview page) — เทียบกับภาพที่ผู้ใช้ส่ง
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.cwd()),out=path.resolve('_t/lightlab');await fs.mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://local').pathname);const f=path.resolve(root,'.'+p.split('?')[0]);const body=await fs.readFile(f);res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.glb')?'model/gltf-binary':'application/octet-stream');res.end(body);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(18772,'127.0.0.1',r));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage();await page.setViewportSize({width:1370,height:615}); // ขนาดเดียวภาพผู้ใช้
page.on('pageerror',e=>console.log('PAGEERROR',e.message));
await page.goto('http://127.0.0.1:18772/tools/wordship_preview.html');
await page.waitForFunction(()=>window.WordShip&&WordShip._t.running===true,null,{timeout:20000});
await page.waitForTimeout(800);
await page.click('#wsh-intro button');
await page.waitForTimeout(500);
await page.evaluate(()=>WordShip._t.setPaused(true));
await page.waitForTimeout(300);
await page.screenshot({path:path.join(out,'game_live.png')});
// เทียบ encoding/ค่าจริงในเกม
console.log(await page.evaluate(()=>{
  const r=WordShip._t; const out={style:r.shipStyle};
  try{out.enc=window.THREE?THREE.LinearEncoding:null;}catch(_){}
  return JSON.stringify(out);
}));
await browser.close();server.close();console.log('done');
