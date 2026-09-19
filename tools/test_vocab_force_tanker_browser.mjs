import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire(import.meta.url);
const deps='C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {chromium}=require(deps+'playwright');
const sharp=require(deps+'sharp');
const base=process.env.VF_PREVIEW_URL||'http://127.0.0.1:4177/minigames/vocab-force/index.html?qa=tanker';
const outDir=process.env.VF_QA_DIR||path.resolve('work','vocab-force-tanker-qa');
fs.mkdirSync(outDir,{recursive:true});
const errors=[];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
try{
  const page=await browser.newPage({viewport:{width:812,height:375},hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/^Failed to load resource/.test(m.text())) errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400) errors.push(r.status()+' '+r.url());});
  page.on('requestfailed',r=>errors.push('request failed '+r.url()+' '+(r.failure()?.errorText||'')));
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('.vf-select-card',{state:'visible',timeout:15000});
  await page.evaluate(()=>{ if(window.VocabForce&&VocabForce._t) VocabForce._t.wantHunters=()=>false; });
  await page.locator('.vf-select-card').first().click();
  await page.locator('.vf-select-start').click();
  await page.waitForFunction(()=>document.querySelector('#vf-game')?.classList.contains('is-playing'),null,{timeout:90000});
  await page.waitForFunction(()=>VocabForce._t.live().tanker?.ready===true,null,{timeout:30000});
  const idle=await page.evaluate(()=>{
    const live=VocabForce._t.live(),t=live.tanker,p=live.player,T=window.THREE;
    if(live.enemies){
      live.enemies.dropHunters?.();
      live.enemies.tick=()=>({dead:[],bites:[],fires:[],impacts:[],lands:[]});
    }
    const tb=new T.Box3().setFromObject(t.root),ts=new T.Vector3();tb.getSize(ts);
    const pb=new T.Box3().setFromObject(p.pivot),ps=new T.Vector3();pb.getSize(ps);
    const c=t.collider,hit=live.arena.collide(c.minx-.2,0,(c.minz+c.maxz)/2,.55);
    return {state:t.state,count:live.scene.getObjectsByProperty('name','VFOilTanker').length,tanker:{x:ts.x,y:ts.y,z:ts.z},playerHeight:ps.y,collision:!!(hit.wall&&hit.hitBox?.tanker),collider:{minx:c.minx,maxx:c.maxx,minz:c.minz,maxz:c.maxz}};
  });
  if(idle.state!=='idle'||idle.count!==1) throw new Error('expected exactly one idle tanker');
  if(Math.max(idle.tanker.x,idle.tanker.z)<idle.playerHeight*3.5) throw new Error('tanker is not realistically larger than player');
  if(!idle.collision) throw new Error('tanker collision missing');
  await page.evaluate(()=>{
    const live=VocabForce._t.live(),c=live.tanker.collider;
    live.player.resetForRound({x:c.minx-1.05,y:live.arena.surfaceY(c.minx-1.05,(c.minz+c.maxz)/2),z:(c.minz+c.maxz)/2,yaw:Math.PI/2});
    live.player.hp=500; live.player.invuln=0; live.hud.setHp(500,live.player.maxHp);
  });
  await page.locator('.vf-punch').click({position:{x:28,y:28}});
  await page.waitForFunction(()=>VocabForce._t.live().tanker.state!=='idle',null,{timeout:5000});
  await page.waitForTimeout(700);
  const flight=await page.evaluate(()=>{
    const t=VocabForce._t.live().tanker;
    return {state:t.state,distance:Math.hypot(t.root.position.x-t.spawn.x,t.root.position.z-t.spawn.z),rotation:Math.abs(t.root.rotation.x)+Math.abs(t.root.rotation.y-t.spawn.yaw)+Math.abs(t.root.rotation.z),eventId:t.eventId};
  });
  if(flight.state!=='launched'||flight.distance<20||flight.rotation<8||!flight.eventId) throw new Error('tanker launch/tumble did not reach cinematic thresholds');
  await page.waitForFunction(()=>['exploding','destroyed'].includes(VocabForce._t.live().tanker.state),null,{timeout:6000});
  await page.waitForTimeout(550);
  const blastA=await page.evaluate(()=>{
    const live=VocabForce._t.live(),t=live.tanker,root=document.querySelector('#vf-game'),touch=document.querySelector('.vf-touch'),spec=document.querySelector('.vf-spectator');
    const rr=root.getBoundingClientRect(),sr=spec.getBoundingClientRect();
    return {state:t.state,hp:live.player.hp,alive:live.player.alive,spectator:live.spectator.active,damageEvent:t.damageEventId,fireRadius:t.fx.fireA.scale.x,fireVisible:t.fx.fireA.visible&&t.fx.fireA.material.opacity>0,shockVisible:t.fx.shock.visible,ui:!spec.hidden,touchHidden:getComputedStyle(touch).display==='none',rootSpectating:root.classList.contains('is-spectating'),uiRect:{left:sr.left,top:sr.top,right:sr.right,bottom:sr.bottom},rootRect:{left:rr.left,top:rr.top,right:rr.right,bottom:rr.bottom}};
  });
  await page.waitForTimeout(650);
  const blastB=await page.evaluate(()=>({fireRadius:VocabForce._t.live().tanker.fx.fireA.scale.x}));
  if(blastA.hp!==0||blastA.alive!==false||!blastA.spectator||!blastA.damageEvent) throw new Error('exact 500 damage did not enter spectator');
  if(!blastA.fireVisible||!blastA.shockVisible||blastB.fireRadius<=blastA.fireRadius) throw new Error('blast/fire wave is not visibly expanding');
  if(!blastA.ui||!blastA.touchHidden||!blastA.rootSpectating) throw new Error('spectator HUD/control lock missing');
  if(blastA.uiRect.left<blastA.rootRect.left||blastA.uiRect.right>blastA.rootRect.right||blastA.uiRect.top<blastA.rootRect.top||blastA.uiRect.bottom>blastA.rootRect.bottom) throw new Error('spectator HUD overflows the 812x375 viewport');
  const png=path.join(outDir,'vocab-force-tanker-spectator.png');
  const webp=path.join(outDir,'vocab-force-tanker-spectator.webp');
  await page.screenshot({path:png});
  await sharp(png).webp({quality:88,alphaQuality:100}).toFile(webp);
  fs.unlinkSync(png);
  const reset=await page.evaluate(()=>{
    const live=VocabForce._t.live(),next=(live.round.seed||1)+101;
    live.resetRound({w:'APPLE',th:'แอปเปิล',seed:next});
    const t=live.tanker,p=live.player;
    return {hp:p.hp,alive:p.alive,spectator:live.spectator.active,tanker:t.state,visible:t.root.visible,count:live.scene.getObjectsByProperty('name','VFOilTanker').length,spawnGap:Math.hypot(p.x-t.spawn.x,p.z-t.spawn.z)};
  });
  if(reset.hp!==1000||!reset.alive||reset.spectator||reset.tanker!=='idle'||!reset.visible||reset.count!==1||reset.spawnGap<18) throw new Error('round reset/spawn/tanker restore failed');
  if(errors.length) throw new Error('browser errors: '+errors.join(' | '));
  console.log(JSON.stringify({ok:true,idle,flight,blastA,blastB,reset,screenshot:webp},null,2));
}finally{
  await browser.close();
}
