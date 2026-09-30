// light lab runner: ถ่ายภาพ ship glb ซ้าย=rig เกมเดิม / ขวา=rig ทดลอง (ส่ง query ปรับค่าได้)
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.cwd()),out=path.resolve('_t/lightlab');await fs.mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://local').pathname);const f=path.resolve(root,'.'+p.split('?')[0]);const body=await fs.readFile(f);res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.glb')?'model/gltf-binary':'application/octet-stream');res.end(body);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(18771,'127.0.0.1',r));
const shots=process.argv.slice(2); // เช่น "name1:hemi=.9&sun=2.2" "name2:tone=none&hemi=.7"
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage();await page.setViewportSize({width:1400,height:640});
page.on('pageerror',e=>console.log('PAGEERROR',e.message));
for(const spec of shots.length?shots:['base:']){
  const [name,q]=spec.split(':');
  await page.goto('http://127.0.0.1:18771/tools/wordship_lightlab.html'+(q?'?'+q:''));
  await page.waitForFunction(()=>window.__ready===true,null,{timeout:20000});
  await page.waitForTimeout(700);
  console.log(name,await page.evaluate(()=>document.getElementById('rev').textContent));
  await page.screenshot({path:path.join(out,name+'.png')});
}
await browser.close();server.close();
console.log('done ->',out);
