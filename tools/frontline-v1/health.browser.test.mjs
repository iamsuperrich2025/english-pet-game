/* Real local-emulator checks for 5,000 HP and lightweight overhead health bars. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-health');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const checks=[],errors=[],pause=ms=>new Promise(r=>setTimeout(r,ms)),state=p=>p.evaluate(()=>Frontline.inspect());
let roomPath;
async function until(fn,label){const end=Date.now()+10000;while(Date.now()<end){if(await fn())return;await pause(40);}throw Error('Timed out: '+label);}
async function admin(method,suffix='',body){
  const res=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
    method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw Error(await res.text());return res.json();
}
const pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
try{
  const phone=await browser.newPage({viewport:{width:812,height:375},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  const peer=await browser.newPage({viewport:{width:812,height:375}}),code='R'+String(4000+Math.floor(Math.random()*1800));
  for(const page of [phone,peer]){
    page.on('pageerror',e=>errors.push(e.message));await page.goto(BASE+'/__dev/frontline?room='+code);
    await page.locator('#fl-join').click();await until(async()=>!!(await state(page)).local,'joined');
  }
  const s=await state(phone),id=s.id,config=await phone.evaluate(()=>FRONTLINE_DEV);
  roomPath=config.namespace+'/'+config.token+'/rooms/'+code;
  assert.ok(Object.values({...s.room.players,...s.room.guards}).every(p=>p.hp===5000));
  await until(async()=>await phone.locator('.fl-health').count()===6,'six bars');
  assert.equal((await state(phone)).metrics.textures,1);pass('humans, bots and guards start at 5000 HP with six CSS bars; only the scene shadow target is a texture');
  for(const [key,p] of Object.entries(s.room.players))if(p.bot)await admin('PATCH','/players/'+key,{hp:0,respawnAt:Date.now()+120000});
  for(const key of Object.keys(s.room.guards))await admin('PATCH','/guards/'+key,{hp:0,respawnAt:Date.now()+120000});
  const selector='.fl-health[data-actor="'+id+'"]';
  const rejected=await phone.evaluate(async roomPath=>{
    try{await firebase.apps[0].database().ref(roomPath+'/players/'+Frontline.inspect().id+'/hp').set(5001);return'accepted';}
    catch(error){return error.code;}
  },roomPath);
  assert.match(rejected,/permission_denied/i);pass('emulator rejects HP above 5000');
  for(const [hp,level] of [[5000,'green'],[2501,'green'],[2500,'yellow'],[1251,'yellow'],[1250,'red'],[500,'red']]){
    await admin('PATCH','/players/'+id,{hp});
    await until(async()=>{for(const page of [phone,peer]){
      const bar=page.locator(selector);if(await bar.getAttribute('aria-valuenow')!==String(hp)||await bar.getAttribute('data-level')!==level)return false;
    }return true;},hp+' HP synced');
    const ratio=await phone.locator(selector+' > i').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).a);
    assert.ok(Math.abs(ratio-hp/5000)<.0001);assert.equal(await phone.locator(selector).getAttribute('aria-valuemax'),'5000');
    assert.ok(await phone.locator(selector).isVisible());
    if(hp===5000||hp===2500||hp===500)await phone.screenshot({path:path.join(OUT,level+'.png')});
  }
  pass('green/yellow/red thresholds and proportional fills agree on both clients, including exact boundaries');
  await admin('PATCH','/players/'+id,{hp:0,respawnAt:Date.now()+1500});
  await until(async()=>!await phone.locator(selector).isVisible(),'destroyed tank bar hidden');
  await until(async()=>(await state(phone)).local?.hp===5000&&await phone.locator(selector).isVisible(),'full HP respawn');
  assert.equal(await phone.locator(selector).getAttribute('data-level'),'green');pass('destroyed tank hides its bar and respawns with a full green 5000-HP bar');
  await phone.locator('[data-auto="1"]').tap();await pause(1400);await phone.locator('[data-auto="1"]').tap();
  const pose=(await state(phone)).local;
  await admin('PATCH','/bases/'+id,{x:pose.x+18,z:pose.z+18});
  await admin('PATCH','/players/'+id,{carried:'A',hp:1200});
  await until(async()=>(await state(phone)).local.carried==='A'&&await phone.locator('.fl-carried-letter').filter({hasText:/^A$/}).first().isVisible(),'carried letter rendered');
  const layout=await phone.evaluate(selector=>{
    const bar=document.querySelector(selector),r=bar.getBoundingClientRect();
    const token=[...document.querySelectorAll('.fl-carried-letter')].find(el=>!el.hidden&&el.textContent==='A').getBoundingClientRect();
    return{bar:{x:r.x,y:r.y,bottom:r.bottom,width:r.width},tokenTop:token.top,gap:token.top-r.bottom,pointerEvents:getComputedStyle(bar).pointerEvents};
  },selector);
  assert.ok(layout.gap>=5);assert.equal(layout.pointerEvents,'none');pass('health bar stays above carried letters without consuming touch input',layout);
  await phone.screenshot({path:path.join(OUT,'carried-health.png')});
  await phone.locator('[data-hold=right]').dispatchEvent('pointerdown',{pointerId:91});await pause(300);
  await phone.locator('[data-hold=right]').dispatchEvent('pointerup',{pointerId:91});
  assert.ok(await phone.locator(selector).isVisible());
  await phone.locator('#fl-leave').click();await until(async()=>!await phone.locator('#fl-join').isDisabled(),'left');
  assert.equal(await phone.locator('.fl-health').count(),0);pass('health bars are removed when the scene is disposed');
  assert.equal(errors.length,0,errors.join('\n'));pass('zero browser page errors');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));
}catch(error){console.error(error);process.exitCode=1;await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack},null,2));}
finally{await browser.close();}
