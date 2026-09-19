import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const deps='C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {chromium}=require(deps+'playwright');
const url=process.env.VF_PREVIEW_URL||'http://127.0.0.1:4177/minigames/vocab-force/index.html?qa=tanker-multi';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
async function boot(page){
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('.vf-select-card',{state:'visible',timeout:30000});
  await page.evaluate(()=>{VocabForce._t.wantHunters=()=>false;});
  await page.locator('.vf-select-card').first().click();
  await page.locator('.vf-select-start').click();
  await page.waitForFunction(()=>document.querySelector('#vf-game')?.classList.contains('is-playing'),null,{timeout:90000});
  await page.waitForFunction(()=>VocabForce._t.live().tanker?.ready===true,null,{timeout:30000});
}
try{
  const host=await browser.newPage({viewport:{width:812,height:375},hasTouch:true,isMobile:true});
  const peer=await browser.newPage({viewport:{width:812,height:375},hasTouch:true,isMobile:true});
  await boot(host);
  await boot(peer);
  const seed=777;
  const baseRec={n:'Player',x:0,y:0,z:0,yaw:0,av:'nex',m:0,hp:'H|500',w:0,c:'APPLE',ct:seed,cw:'แอปเปิล',tr:'-',te:'-'};
  await host.evaluate(({seed,baseRec})=>{
    const l=VocabForce._t.live();
    l.enemies.dropHunters?.();l.enemies.tick=()=>({dead:[],bites:[],fires:[],impacts:[],lands:[]});
    l.net.myUid='a';l.net.room={online:true,joined:true,count:2,peers:{b:{}},roomLabel:'1'};
    l.net._rec={b:Object.assign({},baseRec,{n:'Peer'})};
    l.resetRound({w:'APPLE',th:'แอปเปิล',seed});
    const c=l.tanker.collider;
    l.player.resetForRound({x:c.minx-1.05,y:l.arena.surfaceY(c.minx-1.05,(c.minz+c.maxz)/2),z:(c.minz+c.maxz)/2,yaw:Math.PI/2});
    l.player.hp=500;l.player.invuln=0;l.hud.setHp(500,l.player.maxHp);
  },{seed,baseRec});
  await peer.evaluate(({seed,baseRec})=>{
    const l=VocabForce._t.live();
    l.enemies.dropHunters?.();l.enemies.tick=()=>({dead:[],bites:[],fires:[],impacts:[],lands:[]});
    l.net.myUid='b';l.net.room={online:true,joined:true,count:2,peers:{a:{}},roomLabel:'1'};
    l.net._rec={a:Object.assign({},baseRec,{n:'Host'})};
    l.resetRound({w:'APPLE',th:'แอปเปิล',seed});
    l.player.hp=500;l.player.invuln=0;l.hud.setHp(500,l.player.maxHp);
  },{seed,baseRec});
  const hostPublish=await host.evaluate(()=>{
    const l=VocabForce._t.live(),p=l.player,f=p.forward();
    if(!l.tanker.meleeHit({x:p.x+f.x*.85,y:p.y+1,z:p.z+f.z*.85},3,{kind:'punch',dir:f,player:p})) throw new Error('host close-range tanker hit was not queued');
    const requests=l.net.consumeTankerRequests();
    if(requests.length!==1) return {ok:false,stage:'request',requestCount:requests.length,raw:l.net._tankerReq};
    const seed=l.round.seed;
    const ev=l.tanker.acceptRequest(requests[0],seed+':qa:'+VocabForce._t.stableHash(requests[0].id),seed);
    if(!ev) return {ok:false,stage:'validate',request:requests[0]};
    l.net.publishTankerEvent(ev);
    const events=l.net.consumeTankerEvents();
    return {ok:events.length===1&&l.tanker.applyEvent(events[0]),wire:l.net._tankerEvent,id:ev.id};
  });
  if(!hostPublish.ok) throw new Error('host event publish failed '+JSON.stringify(hostPublish));
  const wire=hostPublish.wire;
  const peerAccept=await peer.evaluate(wire=>{
    const l=VocabForce._t.live();
    l.net._rec.a.te=wire;
    const events=l.net.consumeTankerEvents();
    if(events.length!==1) return {ok:false,isHost:l.net.isHost(),round:l.net._roundSeed,raw:l.net._hostRecord()?.te,parsed:VocabForce._t.parseTankerEvent(wire)};
    return {ok:l.tanker.applyEvent(events[0]),id:events[0].id};
  },wire);
  if(!peerAccept.ok) throw new Error('peer event accept failed '+JSON.stringify(peerAccept));
  await Promise.all([
    host.waitForFunction(()=>VocabForce._t.live().tanker.state==='launched',null,{timeout:5000}),
    peer.waitForFunction(()=>VocabForce._t.live().tanker.state==='launched',null,{timeout:5000})
  ]);
  const launch=await Promise.all([host,peer].map(p=>p.evaluate(()=>{const t=VocabForce._t.live().tanker;return {id:t.eventId,x:t.root.position.x,z:t.root.position.z};})));
  if(!launch[0].id||launch[0].id!==launch[1].id) throw new Error('host and peer did not share one tanker event id');
  await Promise.all([host,peer].map(p=>p.evaluate(()=>{const t=VocabForce._t.live().tanker;for(let i=0;i<180;i++) t.tick(1/60);})));
  await Promise.all([host,peer].map(p=>p.waitForFunction(()=>VocabForce._t.live().tanker.damageEventId&&VocabForce._t.live().player.alive===false,null,{timeout:7000})));
  const dead=await Promise.all([host,peer].map(p=>p.evaluate(()=>{const l=VocabForce._t.live();return {id:l.tanker.damageEventId,hp:l.player.hp,alive:l.player.alive,spectator:l.spectator.active};})));
  if(dead.some(v=>v.id!==launch[0].id||v.hp!==0||v.alive!==false||!v.spectator)) throw new Error('host/peer death or 500 damage diverged');
  await new Promise(r=>setTimeout(r,500));
  const stillZero=await Promise.all([host,peer].map(p=>p.evaluate(()=>VocabForce._t.live().player.hp)));
  if(stillZero.some(v=>v!==0)) throw new Error('duplicate/late global damage changed dead HP');
  await host.evaluate(()=>VocabForce._t.live().resetRound({w:'APPLE',th:'แอปเปิล',seed:778}));
  await peer.evaluate(()=>VocabForce._t.live().resetRound({w:'APPLE',th:'แอปเปิล',seed:778}));
  const reset=await Promise.all([host,peer].map(p=>p.evaluate(()=>{const l=VocabForce._t.live();return {x:l.player.x,z:l.player.z,hp:l.player.hp,alive:l.player.alive,tanker:l.tanker.state,count:l.scene.getObjectsByProperty('name','VFOilTanker').length};})));
  const gap=Math.hypot(reset[0].x-reset[1].x,reset[0].z-reset[1].z);
  if(reset.some(v=>v.hp!==1000||!v.alive||v.tanker!=='idle'||v.count!==1)||gap<60) throw new Error('two-player round reset/spawn assignment diverged');
  console.log(JSON.stringify({ok:true,eventId:launch[0].id,wire,launch,dead,reset,spawnGap:gap},null,2));
}finally{
  await browser.close();
}
