// จูนแสงเกม wordship สด: เปิดเกมจริง 1 ครั้ง แล้วไล่ชุดแสงหลายแบบ ถ่ายภาพทุกชุด
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.cwd()),out=path.resolve('_t/lightlab');await fs.mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://local').pathname);const f=path.resolve(root,'.'+p.split('?')[0]);const body=await fs.readFile(f);res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.glb')?'model/gltf-binary':'application/octet-stream');res.end(body);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(18773,'127.0.0.1',r));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage();await page.setViewportSize({width:1370,height:615});
page.on('pageerror',e=>console.log('PAGEERROR',e.message));
await page.goto('http://127.0.0.1:18773/tools/wordship_preview.html');
await page.waitForFunction(()=>window.WordShip&&WordShip._t.running===true,null,{timeout:20000});
await page.waitForTimeout(800);
await page.click('#wsh-intro button');
await page.waitForTimeout(500);
await page.evaluate(()=>WordShip._t.setPaused(true));
await page.waitForTimeout(300);

const RIGS=[
 ['r5_aces_exp14',{h:1.45,s:1.0,f:.55,tone:1,exp:1.4}],
 ['r7_mid',{h:1.0,s:1.0,f:0.30}],
 ['r8_sunhi',{h:0.9,s:1.1,f:0.25}],
];
for(const [name,r] of RIGS){
  await page.evaluate(rg=>{
    const sc=WordShip._t.scene, rdr=WordShip._t.rdr;
    const lights=[]; sc.traverse(o=>{ if(o.isLight) lights.push(o); });
    for(const l of lights){
      if(l.isHemisphereLight) l.intensity=rg.h;
      else if(l.isDirectionalLight){
        // sun คือตัวที่ไม่ได้ผูก target ตามเรือ — แยกด้วยสี: sun 0xf0ead8, fill 0xfff2df
        if(l.color.getHex()===0xfff2df) l.intensity=rg.f; else l.intensity=rg.s;
      }
    }
    rdr.toneMapping=rg.tone?THREE.ACESFilmicToneMapping:THREE.NoToneMapping;
    rdr.toneMappingExposure=rg.exp||1;
  },r);
  await page.waitForTimeout(200);
  await page.screenshot({path:path.join(out,'tune_'+name+'.png')});
  console.log('shot',name);
}
await browser.close();server.close();console.log('done');
