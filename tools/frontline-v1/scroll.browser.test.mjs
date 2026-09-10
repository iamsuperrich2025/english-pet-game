import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const out=new URL('file:///'+process.cwd().replaceAll('\\','/')+'/work/frontline-scroll/');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1370,height:615}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 // Exercise fingerprinted production modules inside the isolated demo shell, without live Auth/data.
 if(process.env.FRONTLINE_BUILD){
  const build=process.env.FRONTLINE_BUILD,html=await readFile(path.join(build,'frontline/index.html'),'utf8');
  for(const name of ['scene','ui']){
   const src=[...html.matchAll(/src="([^"]+)"/g)].map(m=>m[1]).find(url=>url.includes('/frontline-'+name+'.'));
   assert.ok(src,'production module missing: '+name);
   const body=await readFile(path.join(build,src),'utf8');
   await page.route('**/frontline/frontline-'+name+'.js',route=>route.fulfill({contentType:'text/javascript',body}));
  }
 }

 await page.goto('http://127.0.0.1:19444/__dev/frontline');
 await page.evaluate(()=>{
  const F=Frontline;document.getElementById('launcher').hidden=true;document.getElementById('battle').hidden=false;
  const Original=THREE.OrthographicCamera;THREE.OrthographicCamera=class extends Original{constructor(...args){super(...args);window.__camera=this;}};
  const room=F.admit(null,'scroll-test',Date.now(),'scroll-test');
  const local=room.players.s0;Object.assign(local,{x:0,z:5,hull:0,turret:0});
  window.__scroll={room,local,scene:F.makeScene(document.getElementById('fl-canvas'),document.getElementById('fl-labels')),ui:F.makeUI(),now:1000};
  window.__draw=(dt=1/60)=>{const s=__scroll;s.now+=dt*1000;s.scene.render(s.room,s.local,'s0',dt,s.now);s.ui.update(s.room,'s0',{auto:0,turn:0,speedLevel:1},{now:Date.now()},true);};
  __draw();
 });
 await page.waitForFunction(()=>__scroll.scene.metrics().tankModelReady);
 const result=await page.evaluate(async()=>{
  const s=__scroll;__draw();
  const observer=new MutationObserver(()=>{});observer.observe(document.getElementById('battle'),{subtree:true,childList:true});
  for(let i=0;i<60;i++)__draw();const textMutations=observer.takeRecords().length;observer.disconnect();
  const x=__camera.position.x;s.local.x+=3;s.local.bumpSeq=1;__draw();
  const correctionFirstFrame=__camera.position.x-x;
  for(let i=0;i<60;i++)__draw();const settledError=Math.abs(__camera.position.x-s.local.x);
  const samples=[];let previous=performance.now();
  for(let i=0;i<100;i++){await new Promise(requestAnimationFrame);const now=performance.now();samples.push(now-previous);previous=now;s.local.z-=.1;__draw();}
  samples.sort((a,b)=>a-b);
  const metrics=s.scene.metrics();return{textMutations,correctionFirstFrame,settledError,metrics,frames:{median:samples[50],p95:samples[95]}};
 });
 for(const [w,h] of [[1370,615],[812,375],[667,320]]){await page.setViewportSize({width:w,height:h});await page.evaluate(()=>__draw());await page.screenshot({path:new URL(w+'x'+h+'.png',out).pathname.replace(/^\/([A-Z]:)/,'$1')});}
 await page.evaluate(()=>__scroll.scene.dispose());
 result.errors=errors;await writeFile(new URL('report.json',out),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(process.argv[2]!=='before'){assert.ok(result.correctionFirstFrame<.5);assert.ok(result.settledError<.005);assert.ok(result.textMutations<10);assert.equal(errors.length,0);}
}finally{await browser.close();}
