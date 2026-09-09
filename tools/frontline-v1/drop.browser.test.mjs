/* Native mobile DROP, two-client pickup, and landscape layout; demo emulator fixtures only. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-drop');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const checks=[],errors=[],requests=[],pause=ms=>new Promise(r=>setTimeout(r,ms)),state=p=>p.evaluate(()=>Frontline.inspect());
let roomPath,phone,peer;
async function until(fn,label,ms=15000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(45);}throw Error('Timed out: '+label);}
async function admin(method,suffix='',body){
  const res=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
    method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw Error(await res.text());return res.json();
}
const pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
async function stageCarry(id,letter){const p=await admin('GET','/players/'+id);await admin('PATCH','/players/'+id,{carried:letter,carriedRevision:(p.carriedRevision||0)+1});}
async function aimAt(page,x,z){
  for(let i=0;i<12;i++){
    const p=(await state(page)).local,angle=Math.atan2(x-p.x,p.z-z),delta=Math.atan2(Math.sin(angle-p.hull),Math.cos(angle-p.hull));
    if(Math.abs(delta)<.035)return;
    const key=delta>0?'KeyD':'KeyA';await page.keyboard.down(key);await pause(Math.min(600,Math.abs(delta)/1.7*1000));await page.keyboard.up(key);await pause(60);
  }
  throw Error('Could not aim at dropped card');
}
async function layout(page){
  return page.evaluate(()=>{
    const selectors=['.fl-brand','.fl-stats','.fl-coach','.fl-target','#fl-roster','#fl-leave','#fl-sound',
      '[data-auto="1"]','[data-auto="-1"]','[data-hold="left"]','[data-hold="right"]','.fl-speed-control','[data-hold="drop"]','[data-hold="bomb"]','[data-hold="fire"]'];
    const hint=document.querySelector('#fl-drop-hint');if(!hint.hidden&&getComputedStyle(hint).display!=='none')selectors.push('#fl-drop-hint');
    const boxes=selectors.map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{selector,x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};});
    const overlaps=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i],b=boxes[j];if(a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y)overlaps.push([a.selector,b.selector]);}
    const auto=document.querySelector('.fl-auto').getBoundingClientRect(),steer=document.querySelector('.fl-steer').getBoundingClientRect();
    return{width:innerWidth,height:innerHeight,boxes,overlaps,gap:steer.top-auto.bottom,
      inside:boxes.every(r=>r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight),
      buttons44:boxes.filter(r=>r.selector.includes('data-')).every(r=>r.width>=44&&r.height>=44)};
  });
}
try{
  const context=await browser.newContext({viewport:{width:1008,height:566},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  phone=await context.newPage();peer=await browser.newPage({viewport:{width:1008,height:566}});
  const code='R'+String(8000+Math.floor(Math.random()*1000));
  for(const page of [phone,peer]){
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    await page.goto(BASE+'/__dev/frontline?room='+code+'&transport=longpoll');await page.locator('#fl-join').click();
    await until(async()=>(await state(page)).local&&(await state(page)).metrics?.tankModelReady,'joined and model ready');
  }
  const config=await phone.evaluate(()=>FRONTLINE_DEV);roomPath=config.namespace+'/'+config.token+'/rooms/'+code;
  assert.equal(config.project,'demo-vocab-frontline-v1');assert.equal(config.namespace,'frontline_v1_dev');
  const s=await state(phone),owner=s.id,other=(await state(peer)).id,home=s.room.bases[owner];
  const freeze={};for(const [id,p] of Object.entries(s.room.players))if(p.bot){freeze['players/'+id+'/hp']=0;freeze['players/'+id+'/respawnAt']=Date.now()+180000;}
  for(const id of Object.keys(s.room.guards)){freeze['guards/'+id+'/hp']=0;freeze['guards/'+id+'/respawnAt']=Date.now()+180000;}
  for(const [id,item] of Object.entries(s.room.letters)){freeze['letters/'+id+'/x']=70+(item.letter.charCodeAt(0)%5);freeze['letters/'+id+'/z']=70;}
  await admin('PATCH','',freeze);await phone.locator('#fl-speed').evaluate(el=>{el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await phone.locator('[data-auto="1"]').tap();await until(async()=>{const p=(await state(phone)).local;return Math.hypot(p.x-home.x,p.z-home.z)>10;},'drive clear of own base');
  await phone.locator('[data-auto="1"]').tap();await until(async()=>(await state(phone)).input.auto===0,'drive stopped');
  await stageCarry(owner,'N');await until(async()=>(await state(phone)).local.carried==='N'&&await phone.locator('[data-hold=drop]').isEnabled(),'carried N enables DROP');
  await until(()=>phone.locator('#fl-drop-hint').isVisible(),'wrong-letter hint');
  assert.match(await phone.locator('[data-hold=drop]').getAttribute('aria-label'),/N/);pass('carried wrong letter enables orange DROP and an explicit label/hint');
  for(const size of [{width:1008,height:566},{width:812,height:375},{width:667,height:320}]){
    await phone.setViewportSize(size);await pause(140);const geometry=await layout(phone);
    assert.ok(geometry.inside&&geometry.buttons44&&geometry.gap>=40&&!geometry.overlaps.length,JSON.stringify(geometry));
    pass(size.width+'x'+size.height+' DROP, visible hint, HUD and controls fit with no overlap',geometry);
    await phone.screenshot({path:path.join(OUT,'drop-ready-'+size.width+'.png')});
  }
  await phone.setViewportSize({width:1008,height:566});await pause(140);
  const before=await admin('GET'),beforeSeq=before.players[owner].dropSeq||0,balance=(await state(phone)).coins,session=(await state(phone)).sessionCoins;
  const cdp=await context.newCDPSession(phone);await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:180,downloadThroughput:256000,uploadThroughput:128000});
  await phone.locator('[data-auto="1"]').tap();await until(async()=>(await state(phone)).attacks.busy,'busy movement write');
  await phone.locator('[data-hold=drop]').tap();
  await until(async()=>(await admin('GET','/players/'+owner)).dropSeq===beforeSeq+1,'native quick DROP acknowledged');
  await phone.locator('[data-auto="1"]').tap();await until(async()=>(await state(phone)).local.carried==='','local carry cleared');
  const cardId='d'+owner+'_'+(beforeSeq+1);let dropped=await admin('GET','/letters/'+cardId);
  assert.equal(dropped.letter,'N');assert.equal(dropped.blockedId,owner);
  await until(async()=>{for(const page of [phone,peer]){const v=await state(page);if(v.room.players[owner].carried||v.room.letters[cardId]?.letter!=='N')return false;}return true;},'both clients see card on ground');
  await pause(1500);assert.equal((await admin('GET','/players/'+owner)).dropSeq,beforeSeq+1);
  assert.equal((await state(phone)).local.carried,'');assert.ok(await phone.locator('[data-hold=drop]').isDisabled());
  assert.equal((await admin('GET','/letters/'+cardId)).letter,'N');
  pass('native DROP during busy movement and 180ms mobile latency creates exactly one acknowledged shared card');
  pass('empty button disables and the owner does not immediately re-pick the dropped letter, including after the pickup lock expires');
  await phone.screenshot({path:path.join(OUT,'drop-after.png')});
  assert.deepEqual((await admin('GET')).rewards||{},before.rewards||{});assert.deepEqual((await admin('GET')).bases,before.bases);
  assert.equal((await state(phone)).coins,balance);assert.equal((await state(phone)).sessionCoins,session);
  pass('dropping does not change base banks, word rewards, session earnings or the central wallet');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await aimAt(peer,dropped.x,dropped.z);await peer.locator('#fl-speed').evaluate(el=>{el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await peer.locator('[data-auto="1"]').click();
  await until(async()=>(await state(peer)).local.carried==='N','rival drives into the dropped card',20000);await peer.locator('[data-auto="1"]').click();
  await until(async()=>(await state(phone)).room.players[other].carried==='N'&&!(await state(phone)).room.letters[cardId],'rival pickup synchronized');
  assert.equal(await admin('GET','/letters/'+cardId),null);pass('a second player can drive into the dropped card and carry it away; both clients agree');
  await stageCarry(owner,'A');await until(async()=>(await state(phone)).local.carried==='A','stage Q card');
  const qSeq=(await admin('GET','/players/'+owner)).dropSeq||0;
  await phone.keyboard.down('KeyQ');await until(async()=>(await admin('GET','/players/'+owner)).dropSeq===qSeq+1,'Q shortcut acknowledged');
  await stageCarry(owner,'B');await until(async()=>(await state(phone)).local.carried==='B','new card while Q held');
  await phone.keyboard.down('KeyQ');await pause(450);assert.equal((await admin('GET','/players/'+owner)).dropSeq,qSeq+1);assert.equal((await state(phone)).local.carried,'B');
  await phone.keyboard.up('KeyQ');await phone.keyboard.press('KeyQ');
  await until(async()=>(await admin('GET','/players/'+owner)).dropSeq===qSeq+2,'fresh Q edge drops next card');
  pass('Q drops once per press; holding/repeating Q cannot discard a newly acquired letter');
  assert.ok(requests.some(u=>u.includes('/.lp?')),'Android long-poll transport observed');
  assert.equal(errors.length,0,errors.join('\n'));assert.ok(requests.every(u=>u.startsWith(BASE)||u.startsWith('data:')));
  pass('Android long-poll works with no page errors and no production requests');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors,namespace:roomPath},null,2));
}catch(error){console.error(error);const debug=phone?await state(phone).catch(()=>null):null;process.exitCode=1;
  if(phone)await phone.screenshot({path:path.join(OUT,'failure.png')}).catch(()=>{});
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack,debug},null,2));
}finally{await browser.close();}
