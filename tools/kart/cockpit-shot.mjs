// รอบ 1622 — ถ่ายภาพมุมคนขับจริงของ Kart/Pick-Up หลังซ่อนพวงมาลัย 3D (ตรวจด้วยตา)
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.cwd()),out=path.resolve(process.env.KART_OUTPUT||'work/kart-qa');await fs.mkdir(out,{recursive:true});
const base=await fs.readFile('tools/kart/browser.mjs','utf8'),html=base.match(/const html=`([\s\S]*?)`;\s*const server=/)[1];
for(const [mi,mode] of ['kart','pickup'].entries()){
  const pageHtml=html.replace('src="/js/kart3d.js"',`src="/js/${mode}3d.js"`),port=17491+mi;
  const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://local');if(url.pathname==='/__shot'){res.setHeader('content-type','text/html; charset=utf-8');res.end(pageHtml);return;}const f=path.resolve(root,'.'+url.pathname);if(!f.startsWith(root+path.sep))throw Error();res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'application/octet-stream');res.end(await fs.readFile(f));}catch{res.statusCode=404;res.end();}});
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']}),page=await browser.newPage();
  await page.setViewportSize({width:1318,height:615});
  try{
    await page.goto(`http://127.0.0.1:${port}/__shot`);
    await page.evaluate(()=>{const W=window.KartWorld||window.PickupWorld;W.start();});
    await page.waitForSelector('#kart-garage-confirm,#pickup-garage-confirm',{state:'visible',timeout:8000});
    await page.click('#kart-garage-confirm,#pickup-garage-confirm');
    await page.waitForSelector('#kart-go,#pickup-go',{state:'visible',timeout:8000});
    await page.click('#kart-go,#pickup-go');
    await page.waitForTimeout(400);
    const which=await page.evaluate(()=>({kart:!!window.KartWorld,pickup:!!window.PickupWorld,hoodVisible:(()=>{const W=window.KartWorld||window.PickupWorld,t=W._t;return t&&t.carGrp?t.carGrp.visible:null})()}));
    console.log(mode,JSON.stringify(which));
    await page.evaluate(()=>{const W=window.KartWorld||window.PickupWorld,t=W._t,L=t.line;
      const i=(t.sfIdx+60)%L.n,nx=L.nx[i],nz=L.nz[i];
      t.pos={x:L.x[i]+nx*2,z:L.z[i]+nz*2,yaw:Math.atan2(L.tx[i],L.tz[i]),spd:40};
      if(t.setHold)t.setHold(.7);t.step(.033,90);t.step(.033,120);
    });
    await page.waitForTimeout(350);
    await page.screenshot({path:path.join(out,`cockpit-${mode}.png`)});
  }finally{await browser.close();server.close();}
}
console.log('SHOTS_OK',out);
