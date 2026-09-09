/* Real Chromium + isolated RTDB emulator acceptance for competitive Frontline. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve(process.env.FRONTLINE_TEST_OUT||'work/frontline-v1-browser');
await fs.mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const contexts=[],pages=[],errors=[],requests=[],checks=[];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const snapshot=page=>page.evaluate(()=>Frontline.inspect());
const check=(name,detail=true)=>{checks.push({name,detail});console.log('PASS',name);};
async function until(fn,label,timeout=15000,step=70){
  const end=Date.now()+timeout;while(Date.now()<end){if(await fn())return;await sleep(step);}throw Error('Timed out: '+label);
}
async function aimAt(page,x,z){
  for(let i=0;i<9;i++){
    const p=(await snapshot(page)).local,angle=Math.atan2(x-p.x,p.z-z),diff=Math.atan2(Math.sin(angle-p.hull),Math.cos(angle-p.hull));
    if(Math.abs(diff)<.045)return;
    const key=diff>0?'KeyD':'KeyA';await page.keyboard.down(key);await sleep(Math.min(720,Math.abs(diff)/1.7*1000));
    await page.keyboard.up(key);await sleep(70);
  }
  throw Error('Could not aim tank');
}
async function tapKey(page,key,settle=40){await page.keyboard.down(key);await sleep(90);await page.keyboard.up(key);await sleep(settle);}
async function setSpeed(page,level){await page.locator('#fl-speed').evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));},level);}
async function sampleDriveSpeed(page,level){
  await setSpeed(page,level);await page.locator('[data-auto="1"]').click();
  // Compare equal simulated time; several software-rendered tabs can drop unequal
  // numbers of frames during identical wall-clock sleeps (the game caps each dt).
  const sample=await page.evaluate(()=>new Promise((resolve,reject)=>{
    let prior=null,last=0,elapsed=0,distance=0,frames=0;const started=performance.now();
    function frame(now){
      const s=Frontline.inspect();
      if(!s.local||!s.connected||s.input.auto!==1)return reject(Error('Drive interrupted during speed sample'));
      if(prior){elapsed+=Math.min(.05,(now-last)/1000);distance+=Math.hypot(s.local.x-prior.x,s.local.z-prior.z);frames++;}
      if(elapsed>=.65)return resolve({elapsed,distance,frames,speed:distance/elapsed});
      if(now-started>10000)return reject(Error('No steady animation frames during speed sample'));
      prior=s.local;last=now;requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }));
  await page.locator('[data-auto="1"]').click();return sample;
}
async function geometry(page){
  return page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const selectors=['.fl-brand','.fl-target','.fl-stats','#fl-roster','#fl-leave','[data-auto="1"]','[data-auto="-1"]',
      '[data-hold="left"]','[data-hold="right"]','.fl-speed-control','[data-hold="drop"]','[data-hold="bomb"]','[data-hold="fire"]'];
    const boxes=Object.fromEntries(selectors.map(s=>[s,rect(document.querySelector(s))]));
    const overlaps=list=>list.some((a,i)=>list.slice(i+1).some(b=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y));
    const canvas=rect(document.querySelector('#fl-canvas')),controls=selectors.slice(4).map(s=>boxes[s]),hud=selectors.slice(0,4).map(s=>boxes[s]);
    return{width:innerWidth,height:innerHeight,boxes,inside:Object.values(boxes).every(r=>r.x>=-1&&r.y>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1),
      controlsOverlap:overlaps(controls),hudOverlap:overlaps(hud),buttonsMin44:selectors.filter(s=>s.includes('data-')||s==='#fl-leave').every(s=>boxes[s].height>=44),
      autoAboveSteer:Math.max(boxes['[data-auto="1"]'].bottom,boxes['[data-auto="-1"]'].bottom)<=Math.min(boxes['[data-hold="left"]'].y,boxes['[data-hold="right"]'].y),
      fullField:Math.abs(canvas.width-innerWidth)<1&&Math.abs(canvas.height-innerHeight)<1,scroll:document.documentElement.scrollHeight>innerHeight};
  });
}
let roomPath,config;
async function admin(method,suffix='',body){
  const response=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
    method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!response.ok)throw Error('Emulator fixture: '+await response.text());return response.json();
}
try{
  const code='R'+String(2000+Math.floor(Math.random()*2000));
  for(let i=0;i<5;i++){
    const contextOptions={viewport:{width:812,height:375},hasTouch:i===3};
    if(i===3)contextOptions.userAgent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36';
    const ctx=await browser.newContext(contextOptions);contexts.push(ctx);
    const page=await ctx.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    const response=await page.goto(BASE+'/__dev/frontline?room='+code);assert.equal(response.status(),200);
  }
  assert.equal((await pages[0].request.get(BASE+'/frontline')).status(),404);check('Frontline remains available only at the local development route');
  config=await pages[0].evaluate(()=>FRONTLINE_DEV);roomPath=config.namespace+'/'+config.token+'/rooms/'+code;

  await pages[0].locator('#fl-join').click();
  await until(async()=>{const s=await snapshot(pages[0]);return s.local&&Object.keys(s.room.players).length===4;},'first player with bots');
  let first=await snapshot(pages[0]);
  assert.equal(Object.values(first.room.players).filter(p=>p.bot).length,3);
  assert.equal(Object.keys(first.room.guards).length,2);
  check('one human gets three player-seat bots plus two neutral anti-collusion guards');

  for(let i=1;i<4;i++){await pages[i].locator('#fl-join').click();await until(async()=>!!(await snapshot(pages[i])).local,'human '+(i+1));}
  await until(async()=>Object.values((await snapshot(pages[0])).room.players).every(p=>!p.bot),'all humans replaced bots');
  assert.ok((await Promise.all(pages.slice(0,4).map(snapshot))).every(s=>s.local.hp===5000));
  check('real players replace bots until four humans; every tank starts at 5000 HP');

  await pages[4].locator('#fl-join').click();
  await until(async()=>!!(await snapshot(pages[4])).local,'fifth moved to next room');
  assert.equal(await pages[4].locator('#fl-room').innerText(),'R'+String(Number(code.slice(1))+1));
  assert.equal(Object.values((await snapshot(pages[4])).room.players).filter(p=>!p.bot).length,1);
  assert.equal(Object.values((await snapshot(pages[0])).room.players).filter(p=>!p.bot).length,4);
  check('fifth human automatically joins the next room with three bots while the first room stays capped at four');
  await pages[4].locator('#fl-leave').click();
  await until(async()=>!(await pages[4].locator('#fl-join').isDisabled()),'overflow client left');
  await pages[4].locator('#fl-code').fill(code.slice(1));
  const attack=await pages[0].evaluate(async rp=>{const db=firebase.apps[0].database(),mine=Frontline.inspect().local;
    try{await db.ref(rp+'/players/s4').set({...mine,slot:4,id:'fifth'});return'accepted';}catch(error){return error.code;}},roomPath);
  assert.match(attack,/permission_denied/i);check('emulator rules reject a direct fifth-seat write');
  const inboxAttack=await pages[0].evaluate(async rp=>{
    const s=Frontline.inspect(),other=Object.keys(s.room.players).find(k=>k!==s.id),path=rp.replace('/rooms/','/inputs/')+'/'+other;
    try{await firebase.apps[0].database().ref(path).set({...Frontline.tankPose(s.local),uid:s.local.id,t:Date.now(),fireSeq:10,bombSeq:10});return'accepted';}
    catch(e){return e.code;}
  },roomPath);
  assert.match(inboxAttack,/permission_denied/i);check('a player cannot write another player input mailbox');
  const outside=await fetch('http://127.0.0.1:19445/production.json?ns=demo-vocab-frontline-v1-default-rtdb');
  assert.equal(outside.status,401);check('all non-test database roots are denied');

  const g=await geometry(pages[0]);
  assert.ok(g.inside&&g.buttonsMin44&&!g.controlsOverlap&&!g.hudOverlap&&!g.scroll&&g.autoAboveSteer&&g.fullField,JSON.stringify(g));
  check('812x375 field is full-screen; AUTO is left above steering; BOMB and FIRE fit',g);
  const selection=await pages[0].locator('[data-hold="right"]').evaluate(button=>({
    userSelect:getComputedStyle(button).userSelect,
    allowed:button.dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true}))
  }));
  assert.equal(selection.userSelect,'none');assert.equal(selection.allowed,false);
  check('touch controls cancel text selection and long-press selection behavior',selection);

  const mobile=pages[3];await mobile.evaluate(async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();}catch(_){}});
  await mobile.setViewportSize({width:390,height:844});await sleep(130);
  assert.equal(await mobile.locator('#fl-rotate').evaluate(e=>getComputedStyle(e).display),'grid');
  assert.equal(await mobile.locator('#fl-canvas').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  await mobile.screenshot({path:path.join(OUT,'portrait-rotate.png')});
  await mobile.setViewportSize({width:812,height:375});await sleep(130);
  assert.equal(await mobile.locator('#fl-rotate').evaluate(e=>getComputedStyle(e).display),'none');
  check('portrait play is blocked until the phone returns to landscape');

  const states=await Promise.all(pages.slice(0,4).map(snapshot)),bySeat={};
  states.forEach((s,i)=>bySeat[s.id]=pages[i]);
  const player=bySeat.s0;
  const slow=await sampleDriveSpeed(player,0),fast=await sampleDriveSpeed(player,2);
  assert.ok(Math.abs(slow.speed-3)<.05&&Math.abs(fast.speed-7.5)<.05,JSON.stringify({slow,fast}));
  check('three-position speed slider changes travel speed while play continues',{slow,fast});
  let a,b;
  a=await snapshot(player);await player.locator('[data-auto="1"]').click();await player.keyboard.down('KeyD');await sleep(520);await player.keyboard.up('KeyD');
  b=await snapshot(player);await player.locator('[data-auto="1"]').click();
  assert.ok(Math.hypot(b.local.x-a.local.x,b.local.z-a.local.z)>.8&&Math.abs(b.local.hull-a.local.hull)>.25);
  check('AUTO FORWARD plus RIGHT steers while moving');
  a=await snapshot(player);await player.locator('[data-auto="-1"]').click();await player.keyboard.down('KeyA');await sleep(520);await player.keyboard.up('KeyA');
  b=await snapshot(player);await player.locator('[data-auto="-1"]').click();
  assert.ok(Math.hypot(b.local.x-a.local.x,b.local.z-a.local.z)>.5&&Math.abs(b.local.hull-a.local.hull)>.25);
  assert.equal(await player.locator('[data-auto][aria-pressed="true"]').count(),0);
  check('AUTO REVERSE plus LEFT steers while reversing and auto states stay exclusive');

  await mobile.locator('[data-auto="-1"]').tap();
  const left=await mobile.locator('[data-hold="left"]').boundingBox(),fire=await mobile.locator('[data-hold="fire"]').boundingBox();
  const cdp=await contexts[3].newCDPSession(mobile);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[
    {x:left.x+left.width/2,y:left.y+left.height/2,id:1},{x:fire.x+fire.width/2,y:fire.y+fire.height/2,id:2}]});
  await sleep(150);const touch=await snapshot(mobile);
  assert.equal(touch.input.turn,-1);assert.equal(touch.input.fire,true);assert.equal(touch.input.auto,-1);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await sleep(80);
  assert.equal((await snapshot(mobile)).input.fire,false);await mobile.locator('[data-auto="-1"]').tap();
  check('native simultaneous touch steering and FIRE work during latched movement');

  const centerBefore=(await snapshot(player)).metrics.chunkCenter,p0=(await snapshot(player)).local;
  await aimAt(player,p0.x,p0.z-40);await setSpeed(player,2);
  await player.locator('[data-auto="1"]').click();await sleep(3100);await player.locator('[data-auto="1"]').click();
  const streamed=(await snapshot(player)).metrics;assert.equal(streamed.chunks,15);assert.notDeepEqual(streamed.chunkCenter,centerBefore);
  check('large field recycles the same 15 procedural chunks around the moving tank',{before:centerBefore,after:streamed.chunkCenter});

  const current=await Promise.all(Object.entries(bySeat).map(async([id,page])=>[id,(await snapshot(page)).local]));
  const shooterPose=(await snapshot(player)).local;
  const rivals=current.filter(([id])=>id!=='s0').sort((a,b)=>Math.hypot(a[1].x-shooterPose.x,a[1].z-shooterPose.z)-Math.hypot(b[1].x-shooterPose.x,b[1].z-shooterPose.z));
  const targetId=rivals[0][0],target=bySeat[targetId];
  let targetPose=(await snapshot(target)).local,dist=Math.hypot(targetPose.x-shooterPose.x,targetPose.z-shooterPose.z);
  if(dist>20){
    await aimAt(player,targetPose.x,targetPose.z);await setSpeed(player,2);
    await player.locator('[data-auto="1"]').click();await sleep(Math.min(3200,(dist-18)/7.5*1000));await player.locator('[data-auto="1"]').click();
  }
  await admin('PATCH','/guards/g0',{x:80,z:80});await admin('PATCH','/guards/g1',{x:-80,z:-80});
  for(const id of Object.keys(bySeat))await admin('PATCH','/bases/'+id,{hp:0});
  await admin('PATCH','/bases/'+targetId,{x:80,z:-80});
  await admin('PATCH','/players/'+targetId,{carried:'P'});
  const hpBefore=(await admin('GET','/players/'+targetId)).hp;let hitTarget=false;
  for(let attempt=0;attempt<4&&!hitTarget;attempt++){
    targetPose=(await snapshot(target)).local;await aimAt(player,targetPose.x,targetPose.z);await sleep(320);
    await tapKey(player,'Space');await sleep(520);
    hitTarget=(await admin('GET','/players/'+targetId)).hp===hpBefore-100;
  }
  assert.equal(hitTarget,true,'tank hit fixture could not land a synchronized shell');
  await until(async()=>{const e=await admin('GET','/events/s0');return e&&e.dropped==='P';},'authoritative cargo drop');
  await until(async()=>{const m=(await snapshot(player)).metrics;return m.bullets>0||m.explosions>0;},'shell visual',1200,20);
  check('discrete shell hit explodes, deals 100 HP, and drops the rival carried letter');

  await sleep(500);await admin('PATCH','/bases/'+targetId,{hp:5000,x:targetPose.x,z:targetPose.z});
  const targetHp=(await admin('GET','/players/'+targetId)).hp;let baseHit=false;
  for(let attempt=0;attempt<4&&!baseHit;attempt++){
    await aimAt(player,targetPose.x,targetPose.z);await sleep(320);await tapKey(player,'Space',520);
    try{await until(async()=>(await admin('GET','/bases/'+targetId)).hp<=4750,'base shell damage',1800,40);baseHit=true;}catch(_){}
  }
  assert.equal(baseHit,true,'base shield fixture could not land a synchronized shell');
  assert.equal((await admin('GET','/players/'+targetId)).hp,targetHp);
  check('intact base shield takes 250 shell damage before the tank inside');

  const owner=(await snapshot(player)).id,bombHp=(await admin('GET','/players/'+owner)).hp;
  await tapKey(player,'KeyB',30);
  await until(async()=>Object.values(await admin('GET','/bombs')||{}).some(b=>b.owner===owner),'bomb placed');
  await until(async()=>(await snapshot(player)).metrics.bombs===1,'bomb visible on client');
  await until(async()=>Object.values(await admin('GET','/bombs')||{}).some(b=>b.owner===owner&&b.explodedAt>0),'bomb exploded',4000,40);
  await until(async()=>{const m=(await snapshot(player)).metrics;return m.explosions>0;},'bomb burst',900,20);
  assert.equal((await admin('GET','/players/'+owner)).hp,bombHp-250);
  check('BOMB creates a visible timed explosive and Bomber-style radial self/rival damage');

  const beforeCoins=await Promise.all(pages.slice(0,4).map(page=>page.evaluate(()=>({coins:state.coins,daily:state.daily.coins,lifetime:state.lifetimeCoins}))));
  const roomData=await admin('GET'),pose=(await snapshot(player)).local,coreKeys=Object.keys(roomData.letters).filter(k=>/^a\d+$/.test(k));
  assert.equal(coreKeys.length,26);assert.equal(new Set(coreKeys.map(k=>roomData.letters[k].letter)).size,26);
  const movedLetters={...roomData.letters};
  for(const [i,key] of coreKeys.entries()){movedLetters[key]={...movedLetters[key],x:70-i%5,z:70-Math.floor(i/5)*3};}
  const eKey=coreKeys.find(k=>movedLetters[k].letter==='E'),serial=movedLetters[eKey].serial;
  movedLetters[eKey]={...movedLetters[eKey],x:pose.x,z:pose.z};
  await admin('PATCH','',{word:{target:'APPLE',round:0,completedAt:0,winnerId:''},letters:movedLetters,rewards:null});
  await admin('PATCH','/players/'+owner,{carried:''});
  await admin('PATCH','/bases/'+owner,{stored:'APPL',x:pose.x+12,z:pose.z+12});
  await until(async()=>(await admin('GET','/players/'+owner)).carried==='E','ram pickup E');
  assert.ok((await admin('GET','/letters/'+eKey)).serial>serial);
  await until(async()=>/CARRY E/.test(await player.locator('#fl-roster .you').innerText()),'roster carried E');
  check('ram collision picks up E, attaches it to the tank, and respawns E forever');
  await admin('PATCH','/bases/'+owner,{x:pose.x,z:pose.z});
  await until(async()=>(await admin('GET')).word.winnerId===owner,'APPLE completed');
  await until(async()=>(await snapshot(player)).sessionCoins===1000,'winner session earnings');
  const allCoins=await Promise.all(Object.entries(bySeat).map(async([id,page])=>[id,await snapshot(page)]));
  for(const [id,s] of allCoins){assert.equal(s.coins,beforeCoins[states.findIndex(s=>s.id===id)].coins);assert.equal(s.sessionCoins,id===owner?1000:0);}
  assert.equal(await player.locator('#fl-coins').innerText(),'1,000');
  assert.equal(await player.evaluate(()=>state.daily.coins),beforeCoins[0].daily);
  check('first word winner gets 1000 visible session coins, rivals get zero, central wallet stays unchanged until EXIT');
  assert.equal(await player.locator('#fl-translation').innerText(),await player.evaluate(()=>vocabForStudent().find(p=>p[0]==='apple')[1]));
  assert.ok(await player.locator('#fl-victory').isVisible());
  assert.match(await player.locator('#fl-victory').innerText(),/1,000/);
  assert.equal((await snapshot(player)).audio.rewardCues,1);assert.equal((await snapshot(player)).audio.state,'running');
  assert.ok(await target.locator('#fl-victory').isVisible());
  check('shared ShootWord Thai translation, visible winner announcement, and synthesized reward cue');

  await until(async()=>(await snapshot(player)).metrics.tankModelReady,'cute tank GLB ready',5000,50);
  await pages[0].screenshot({path:path.join(OUT,'landscape-final.png')});
  const assetUrls=[...new Set(requests.filter(url=>url.includes('/frontline/assets/tank-')))];
  assert.ok(assetUrls.some(url=>url.endsWith('/tank-cute.glb')));
  assert.equal(assetUrls.some(url=>url.endsWith('.webp')),false);
  const modelResponse=await pages[0].request.get(BASE+'/frontline/assets/tank-cute.glb'),modelBytes=await modelResponse.body();
  assert.equal(modelResponse.status(),200);assert.equal(modelBytes.subarray(0,4).toString(),'glTF');
  assert.ok(modelBytes.length>50000&&modelBytes.length<200000);
  check('shared texture-free cute tank GLB loads and replaces all eight direction sprites',{bytes:modelBytes.length,assetUrls});

  const active=await Promise.all(pages.slice(0,4).map(snapshot)),hostIndex=active.findIndex(s=>s.id==='s0');
  const survivor=pages[(hostIndex+1)%4],oldTick=(await snapshot(survivor)).room.tickAt;
  await pages[hostIndex].locator('#fl-leave').click();
  assert.equal(hostIndex,0,'fixture winner is the departing host');
  const wallet=await player.evaluate(()=>({coins:state.coins,daily:state.daily.coins,lifetime:state.lifetimeCoins,
    save:JSON.parse(localStorage.getItem(Frontline.C.saveKey)),production:localStorage.getItem('petVocabAdventure_v1')}));
  assert.equal(wallet.coins,beforeCoins[0].coins+1000);assert.equal(wallet.daily,beforeCoins[0].daily+1000);
  assert.equal(wallet.lifetime,beforeCoins[0].lifetime+1000);assert.equal(wallet.save.coins,wallet.coins);assert.equal(wallet.production,null);
  assert.equal((await snapshot(player)).sessionCoins,0);assert.match(await player.locator('#fl-launch-status').innerText(),/1,000/);
  check('EXIT banks session earnings exactly once through central coins, daily earnings, lifetime earnings and isolated save');
  await until(async()=>Object.values((await snapshot(survivor)).room.players).filter(p=>p.bot).length===1,'bot replaced host');
  await until(async()=>(await snapshot(survivor)).room.tickAt>oldTick+300,'host migration');
  check('leaving human is replaced by a bot and simulation leadership migrates');
  await pages[4].locator('#fl-join').click();await until(async()=>!!(await snapshot(pages[4])).local,'late join replaced bot');
  assert.equal(Object.values((await snapshot(pages[4])).room.players).filter(p=>p.bot).length,0);
  check('new human replaces the vacant bot seat');

  const final=await snapshot(survivor);assert.equal(final.metrics.chunks,15);assert.equal(final.metrics.pickups>=26,true);
  check('bounded scene cost with four rivals, two guards, A-Z, bases, bullets, and bombs',final.metrics);
  assert.equal(errors.length,0,errors.join('\n'));
  assert.ok(requests.every(url=>url.startsWith(BASE)||url.startsWith('data:')));
  assert.ok(requests.every(url=>!url.includes(':19445')));
  assert.ok(requests.some(url=>url.startsWith(BASE+'/.lp')));
  check('zero page errors, mobile HTTP long-poll, zero production requests, and one browser-facing LAN port');
  await fs.writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors,requests:[...new Set(requests)],namespace:roomPath},null,2));
}catch(error){
  const debug=await Promise.all(pages.map(async p=>({status:await p.locator('#fl-launch-status').innerText(),url:p.url(),state:(await snapshot(p)).connected})));
  console.log(JSON.stringify(debug));
  await fs.writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,error:error.stack,checks,errors,debug},null,2));
  console.error(error);process.exitCode=1;
}finally{await browser.close();}
