/* Regression for suspended phones, reclaimed seats, and separated touch controls. Demo only. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-resume');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const checks=[],errors=[],pause=ms=>new Promise(r=>setTimeout(r,ms)),state=p=>p.evaluate(()=>Frontline.inspect());
let phone,roomPath;
async function until(fn,label,ms=10000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(50);}throw Error('Timed out: '+label);}
async function admin(method,suffix='',body){
  const res=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
    method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw Error(await res.text());return res.json();
}
const pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
async function freeze(page){
  await page.evaluate(()=>{window.__realRAF=requestAnimationFrame;window.requestAnimationFrame=fn=>{window.__resumeFrame=fn;return 0;};});
  await until(()=>page.evaluate(()=>!!window.__resumeFrame),'frame paused');await pause(500);
}
async function resume(page){await page.evaluate(()=>{window.requestAnimationFrame=window.__realRAF;requestAnimationFrame(window.__resumeFrame);delete window.__resumeFrame;});}
async function weapons(page,label){
  const s=await state(page),p=await admin('GET','/players/'+s.id),shown=s.metrics.shotsShown;
  await page.locator('[data-hold=fire]').tap();
  await until(async()=>(await admin('GET','/players/'+s.id))?.fireSeq===p.fireSeq+1,label+' FIRE ack');
  await until(async()=>(await state(page)).metrics.shotsShown>shown,label+' visible bullet');
  await page.locator('[data-hold=bomb]').tap();
  await until(async()=>Object.values(await admin('GET','/bombs')||{}).some(b=>b.owner===s.id&&!b.explodedAt),label+' placed bomb');
  await until(async()=>await page.locator('.fl-bomb-timer:visible').count()>0,label+' visible bomb');
  await until(async()=>!(await state(page)).attacks.fire&&!(await state(page)).attacks.bomb,label+' commands settled');
  pass(label+': FIRE creates a visible shell and BOMB creates a visible timed bomb');
  await admin('PUT','/bombs',null);await pause(800);
}
try{
  const context=await browser.newContext({viewport:{width:812,height:375},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  phone=await context.newPage();phone.on('pageerror',e=>errors.push(e.message));
  const code='R'+String(8000+Math.floor(Math.random()*1800));
  await phone.goto(BASE+'/__dev/frontline?room='+code);await phone.locator('#fl-join').click();
  await until(async()=>!!(await state(phone)).local,'phone joined');
  const config=await phone.evaluate(()=>FRONTLINE_DEV);roomPath=config.namespace+'/'+config.token+'/rooms/'+code;
  const first=await state(phone),uid=first.local.id;
  const room=await admin('GET');
  for(const [id,p] of Object.entries(room.players))if(p.bot)await admin('PATCH','/players/'+id,{hp:0,respawnAt:Date.now()+120000});
  for(const id of Object.keys(room.guards))await admin('PATCH','/guards/'+id,{hp:0,respawnAt:Date.now()+120000});
  await weapons(phone,'fresh join');

  // Reproduce a lone phone returning after its room heartbeat has expired.
  await freeze(phone);const stale=Date.now()-20000;
  await admin('PATCH','',{['players/'+first.id+'/t']:stale,tickAt:stale});
  await resume(phone);await weapons(phone,'return to expired room');
  assert.ok(Date.now()-(await admin('GET','/tickAt'))<2000);pass('expired room resumes simulation without leaving or reloading');

  // A different host can have replaced the sleeping owner with a bot.
  await freeze(phone);
  const replacement=await phone.evaluate(slot=>Frontline.newTank('replacement-bot',slot,Date.now(),true),first.local.slot);
  replacement.hp=0;replacement.respawnAt=Date.now()+120000;
  await admin('PUT','/players/'+first.id,replacement);
  await until(async()=>{const s=await state(phone);return !s.local||s.local.id!==uid;},'seat replacement delivered');
  assert.equal((await state(phone)).local,null,'a replacement bot must never become the local player');
  await resume(phone);
  await until(async()=>{const s=await state(phone);return s.connected&&s.local?.id===uid&&!s.local.bot;},'owner automatically readmitted');
  assert.equal(Object.keys((await state(phone)).room.players).length,4);
  pass('reclaimed seat pauses controls, restores the human identity, and keeps the four-seat cap');
  await weapons(phone,'readmitted owner');

  const peer=await browser.newPage({viewport:{width:812,height:375},hasTouch:true});peer.on('pageerror',e=>errors.push(e.message));
  await peer.goto(BASE+'/__dev/frontline?room='+code);await peer.locator('#fl-join').click();
  await until(async()=>!!(await state(peer)).local,'peer joined');
  await freeze(phone);await pause(3200);
  await weapons(peer,'peer while first host is suspended');
  await resume(phone);await weapons(phone,'original host after returning');
  pass('a live peer takes over the world when the first host stops publishing');

  await phone.evaluate(()=>firebase.apps[0].database().goOffline());
  await until(async()=>!(await state(phone)).connected,'transport disconnected');
  await pause(300);await phone.evaluate(()=>firebase.apps[0].database().goOnline());
  await until(async()=>{const s=await state(phone);return s.connected&&s.local?.id===uid;},'transport recovered');
  await weapons(phone,'after transport reconnect');
  await phone.evaluate(()=>{
    dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));
    dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));
  });
  await weapons(phone,'after cached page return');

  for(const size of [{width:812,height:375},{width:667,height:320},{width:1000,height:500}]){
    await phone.setViewportSize(size);await pause(100);
    const geometry=await phone.evaluate(()=>{
      const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,height:r.height};};
      const auto=rect('.fl-auto'),steer=rect('.fl-steer');
      const buttons=[...document.querySelectorAll('.fl-controls button')].map(el=>el.getBoundingClientRect());
      return{gap:steer.y-auto.bottom,inside:buttons.every(r=>r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight),
        min44:buttons.every(r=>r.height>=44),auto,steer};
    });
    assert.ok(geometry.gap>=40&&geometry.inside&&geometry.min44,JSON.stringify(geometry));
    pass(size.width+'x'+size.height+' controls have at least 40px between AUTO and steering',geometry);
    if(size.width===812)await phone.screenshot({path:path.join(OUT,'landscape-controls.png')});
  }
  assert.equal(errors.length,0,errors.join('\n'));pass('no browser page errors');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));
}catch(error){console.error(error);process.exitCode=1;await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack,state:phone&&await state(phone)},null,2));}
finally{await browser.close();}
