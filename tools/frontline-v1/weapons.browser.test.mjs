/* Mobile quick-tap and slow-transport regression, using only the isolated demo emulator. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-weapons');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const errors=[],checks=[],requests=[];let roomPath,phone;
const pause=ms=>new Promise(r=>setTimeout(r,ms)),state=p=>p.evaluate(()=>Frontline.inspect());
async function until(fn,label,ms=12000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(35);}throw Error('Timed out: '+label);}
async function admin(method,suffix='',body){
  const res=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
    method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw Error(await res.text());return res.json();
}
const pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
try{
  const context=await browser.newContext({viewport:{width:1000,height:500},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  phone=await context.newPage();const peer=await browser.newPage({viewport:{width:1000,height:500}}),code='R'+String(6000+Math.floor(Math.random()*2000));
  for(const page of [phone,peer]){
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    await page.goto(BASE+'/__dev/frontline?room='+code);await page.locator('#fl-join').click();
    await until(async()=>!!(await state(page)).local,'joined');
  }
  const config=await phone.evaluate(()=>FRONTLINE_DEV);roomPath=config.namespace+'/'+config.token+'/rooms/'+code;
  const room=await admin('GET');
  for(const [id,p] of Object.entries(room.players))if(p.bot)await admin('PATCH','/players/'+id,{hp:0,respawnAt:Date.now()+120000});
  for(const id of Object.keys(room.guards))await admin('PATCH','/guards/'+id,{hp:0,respawnAt:Date.now()+120000});
  const s=await state(phone),owner=s.id;
  await until(async()=>(await state(phone)).metrics.tankModelReady,'model ready');
  const cdp=await context.newCDPSession(phone);await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:180,downloadThroughput:256000,uploadThroughput:128000});
  for(let n=0;n<4;n++){
    await until(async()=>(await state(phone)).attacks.busy,'position write busy');
    const before=(await admin('GET','/players/'+owner)).fireSeq;
    await phone.locator('[data-hold=fire]').tap();
    await until(async()=>(await admin('GET','/players/'+owner)).fireSeq>before,'quick tap acknowledged');
    await pause(600);
    assert.equal((await admin('GET','/players/'+owner)).fireSeq,before+1,'one tap must produce exactly one accepted shot');
  }
  pass('four native quick FIRE taps during busy mobile writes each produce exactly one shot');
  assert.ok((await state(peer)).metrics.shotsShown>=4);assert.ok((await state(phone)).metrics.shotsShown>=4);
  pass('both clients display accepted projectiles despite mobile transport latency');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await pause(650);
  const beforeBomb=(await admin('GET','/players/'+owner)).bombSeq;
  await phone.locator('[data-hold=bomb]').tap();
  await until(async()=>(await admin('GET','/players/'+owner)).bombSeq>beforeBomb,'first bomb acknowledged');
  await pause(730);await phone.locator('[data-hold=bomb]').tap();
  await until(async()=>(await admin('GET','/players/'+owner)).bombSeq>beforeBomb+1,'second bomb acknowledged');
  const bombs=Object.values(await admin('GET','/bombs')||{}).filter(b=>b.owner===owner&&!b.explodedAt);
  assert.equal(bombs.length,2);assert.equal(await phone.locator('.fl-bomb-timer:visible').count(),2);
  pass('two native BOMB taps place two simultaneous bombs with countdowns; no ammo stock limit');
  await phone.screenshot({path:path.join(OUT,'bomb-warning.png')});
  const bursts=(await state(phone)).metrics.blastsShown;
  await until(async()=>(await state(phone)).metrics.blastsShown>=bursts+2,'chain explosion effects');
  await pause(170);
  await phone.screenshot({path:path.join(OUT,'bomb-burst.png')});
  await until(async()=>(await admin('GET','/players/'+owner)).hp===4500,'two explosions cause real damage');
  pass('both bomb explosions create visible effects and apply their damage');
  await until(async()=>Object.keys(await admin('GET','/bombs')||{}).length===0,'expired bomb cleanup');
  const budget=(await state(phone)).metrics;
  assert.equal(budget.textures,1);assert.equal(budget.effectPool,44);assert.equal(budget.chunks,15);
  assert.ok(budget.calls<350&&budget.triangles<65000,JSON.stringify(budget));
  pass('fixed effects pool and recycled terrain retain one small shadow target and bounded scene cost',budget);
  const lastSeq=(await admin('GET','/players/'+owner)).bombSeq;
  await phone.locator('[data-hold=bomb]').tap();
  await until(async()=>(await admin('GET','/players/'+owner)).bombSeq>lastSeq,'bomb available again');
  pass('bomb supply is still available after earlier bombs have exploded');
  assert.equal(errors.length,0,errors.join('\n'));
  assert.ok(requests.every(u=>u.startsWith(BASE)||u.startsWith('data:')));
  pass('no page errors or production network requests');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));
}catch(e){console.error(e);const debug=phone?await state(phone):null;console.log(JSON.stringify({debug,message:phone&&await phone.locator('#fl-message').innerText()}));process.exitCode=1;await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,error:e.stack,errors,debug},null,2));}
finally{await browser.close();}
