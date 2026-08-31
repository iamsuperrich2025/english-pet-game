/* Vocab World: Frontline 1944 — ADMIN PREVIEW ONLY
 * Phase 1.2.3 Mobile Drive Input Hardening: canonical tank controller, streamed battlefield sectors, logical world coordinates,
 * lightweight terrain/collision, 2.5D occlusion anchors, tank runtime,
 * pooled projectiles, and multiplayer-ready tank state.
 *
 * IMPORTANT: this module remains isolated from shared Firebase/economy/auth code.
 * It consumes the current shared interfaces and never creates parallel auth paths.
 */
(function(){
'use strict';

const CFG={
  letterCoins:1,
  wordBonus:50,
  dpr:1.35,
  viewW:156,
  cameraOffsetX:62,
  cameraHeight:86,
  cameraOffsetZ:72,
  runtimeVersion:'P1.2.3-20260831-MOBILE-DRIVE-HARDENED',
  sectorWidth:180,
  sectorLength:150,
  streamRadius:1,
  preloadAhead:2,
  descriptorCacheCap:7,
  playerHP:380,
  tankRadius:2.45,
  tankFootprintHalfWidth:2.65,
  tankFootprintHalfLength:4.05,
  tankSweepMaxStep:.28,
  tankSweepMaxYaw:.045,
  tankForwardSpeed:22,
  tankReverseSpeed:9.5,
  tankAcceleration:13,
  tankBrake:19,
  tankCoast:8,
  tankTurnRate:1.62,
  turretTurnRate:3.4,
  shotSpeed:68,
  shotLife:1.7,
  shotDamage:24,
  projectileCap:40,
  enemyProjectileCap:24,
  fxCap:60,
  enemyCap:10,
  fortressTrigger:38,
  fortressCoreHP:145,
  bossBaseHP:190,
  defendersBase:4,
  damageEventCap:80
};

const LAYER=Object.freeze({
  BACKGROUND:0,
  TERRAIN:1,
  ROADS_WATER:2,
  GROUND_DECOR:3,
  GAMEPLAY_PROPS:4,
  ACTORS:5,
  FOREGROUND_OCCLUDERS:6,
  COMBAT_FX:7,
  ATMOSPHERE:8
});

const TERRAIN=Object.freeze({
  ROAD:Object.freeze({id:'ROAD',speed:1.08,blocked:false}),
  GRASS:Object.freeze({id:'GRASS',speed:1.00,blocked:false}),
  MUD:Object.freeze({id:'MUD',speed:0.58,blocked:false}),
  DAMAGED_GROUND:Object.freeze({id:'DAMAGED_GROUND',speed:0.78,blocked:false}),
  SHALLOW_WATER:Object.freeze({id:'SHALLOW_WATER',speed:0.43,blocked:false}),
  DEEP_WATER:Object.freeze({id:'DEEP_WATER',speed:0.00,blocked:true}),
  FORTIFICATION:Object.freeze({id:'FORTIFICATION',speed:0.00,blocked:true})
});

// Exactly ten reusable visual-sector identities. Logical sector index is deliberately separate.
const SECTOR_TEMPLATES=Object.freeze([
  Object.freeze({id:'farmland',label:'Farmland',base:0x65734c,fieldA:0x8d8350,fieldB:0x727c4b}),
  Object.freeze({id:'wheat_fields',label:'Wheat Fields',base:0x6d7548,fieldA:0xa79455,fieldB:0x847849}),
  Object.freeze({id:'forest',label:'Forest',base:0x526747,fieldA:0x65754c,fieldB:0x475c3e}),
  Object.freeze({id:'village',label:'Village',base:0x65704b,fieldA:0x81764b,fieldB:0x6d7248}),
  Object.freeze({id:'ruined_village',label:'Ruined Village',base:0x665f48,fieldA:0x756846,fieldB:0x625946}),
  Object.freeze({id:'river_crossing',label:'River Crossing',base:0x60704c,fieldA:0x7d7d4c,fieldB:0x65764c}),
  Object.freeze({id:'defensive_line',label:'Defensive Line',base:0x626a49,fieldA:0x7b7447,fieldB:0x5d6846}),
  Object.freeze({id:'artillery_zone',label:'Artillery Zone',base:0x635f47,fieldA:0x756846,fieldB:0x5f5842}),
  Object.freeze({id:'military_camp',label:'Military Camp',base:0x5e6b48,fieldA:0x746f49,fieldB:0x596440}),
  Object.freeze({id:'fortress_approach',label:'Fortress Approach',base:0x5d6446,fieldA:0x786d45,fieldB:0x565f43})
]);

const G={
  running:false,starting:false,root:null,canvas:null,renderer:null,scene:null,camera:null,raf:0,last:0,
  layers:{},keys:new Set(),listeners:[],joy:{x:0,y:0,id:null,active:false,transport:'idle',lastTransport:'none',captured:false,moves:0,lastEventAt:0},aim:{x:0,y:-1,id:null,active:false,transport:'idle',lastTransport:'none',captured:false,moves:0,lastEventAt:0},
  firing:false,fireAt:0,pointerAim:null,lowFx:false,toastTimer:0,routeTried:false,routeDenied:false,
  player:null,tankRuntime:null,inputAdapter:null,enemies:[],fortress:null,sectorStreamer:null,collision:null,terrain:null,pools:null,
  occluders:[],smoke:[],sun:null,sunTarget:null,word:null,pos:0,wordRunId:'',wordsDone:0,
  fortressSerial:0,objectiveSectorIndex:null,claimed:new Set(),audit:null,damageEvents:[],
  fireEventSerial:0,resources:null,raycaster:null,groundPlane:null,progressHydrated:false,lastControlInputAt:0,desktopFireQueued:false,runtimeIdentity:null,
};

const $=s=>G.root&&G.root.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const dist2=(a,b)=>{const x=a.x-b.x,z=a.z-b.z;return x*x+z*z;};
const wrapPi=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a;};
function approach(v,target,amount){return v<target?Math.min(target,v+amount):Math.max(target,v-amount);}
function rotateToward(v,target,maxStep){const d=wrapPi(target-v);return v+clamp(d,-maxStep,maxStep);}
function listen(t,n,f,o){t.addEventListener(n,f,o);G.listeners.push(()=>t.removeEventListener(n,f,o));}
function hash32(n){n=(n|0)+0x6d2b79f5;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return (n^(n>>>14))>>>0;}
function randFrom(seed){let s=hash32(seed)||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}

function adminAllowed(){
  try{if(typeof isAdmin==='function'&&isAdmin()===true)return true;}catch(e){}
  try{if(typeof canAccessAdmin==='function'&&canAccessAdmin()===true)return true;}catch(e){}
  for(const n of ['isAdmin','canAccessAdmin']){try{const v=window[n];if(typeof v==='function'&&v()===true)return true;if(v===true)return true;}catch(e){}}
  try{if(window.AdminGate&&typeof window.AdminGate.allowed==='function'&&window.AdminGate.allowed()===true)return true;}catch(e){}
  return false; // fail closed; never infer admin from URL, email or editable profile data.
}
function lockNotice(){if(typeof toast==='function')toast('🔒 Vocab Frontline 1944 เป็น ADMIN PREVIEW เท่านั้น');}
function syncAdminEntry(){
  const ok=adminAllowed(),runtimeOpen=!!G.root;
  for(const id of ['btn-rail-frontline1944','btn-frontline1944-admin-launcher']){
    const b=document.getElementById(id);if(!b)continue;
    const hide=!ok||runtimeOpen;b.hidden=hide;b.setAttribute('aria-hidden',hide?'true':'false');b.style.pointerEvents=hide?'none':'';
    if(ok&&!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>open());}
  }
}

function claimTankRuntimeOwnership(){
  const identity={kind:'tank',phase:'1.2.3',version:CFG.runtimeVersion,sharedRuntime:true,active:true};G.runtimeIdentity=identity;
  try{window.__VW_FRONTLINE1944_RUNTIME__=identity;}catch(e){}
  try{if(document.documentElement)document.documentElement.dataset.vwFrontline1944Runtime='tank';if(document.body)document.body.dataset.vwFrontline1944Runtime='tank';}catch(e){}
  try{if(typeof CustomEvent==='function')window.dispatchEvent(new CustomEvent('vw:frontline1944-runtime',{detail:identity}));}catch(e){}
  return identity;
}
function releaseTankRuntimeOwnership(){
  if(G.runtimeIdentity)G.runtimeIdentity.active=false;
  try{if(window.__VW_FRONTLINE1944_RUNTIME__&&window.__VW_FRONTLINE1944_RUNTIME__.version===CFG.runtimeVersion)window.__VW_FRONTLINE1944_RUNTIME__.active=false;}catch(e){}
  try{if(document.documentElement)delete document.documentElement.dataset.vwFrontline1944Runtime;if(document.body)delete document.body.dataset.vwFrontline1944Runtime;}catch(e){}
}
function runtimeIdentity(){return G.runtimeIdentity||{kind:'tank',phase:'1.2.3',version:CFG.runtimeVersion,sharedRuntime:true,active:false};}

function normalizeWord(x){
  let en='',th='';
  if(Array.isArray(x)){en=x[0];th=x[1]||'';}
  else if(x&&typeof x==='object'){en=x.en||x.word||x.eng||x.english||'';th=x.th||x.meaning||x.thai||'';}
  en=String(en||'').trim().toUpperCase().replace(/[^A-Z]/g,'');
  return en.length>=2&&en.length<=10?{en,th:String(th||'')}:null;
}
function vocabPool(){
  let raw=[];
  try{if(typeof f1VocabForStudent==='function')raw=f1VocabForStudent()||[];}catch(e){}
  if(!raw.length)try{if(typeof vocabForStudent==='function')raw=vocabForStudent()||[];}catch(e){}
  const seen=new Set(),out=[];
  for(const x of raw){const w=normalizeWord(x);if(w&&!seen.has(w.en)){seen.add(w.en);out.push(w);}}
  return out;
}
function auditVocabulary(){
  const grades=['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6'],out={},student=window.state&&state.student,old=student&&student.grade;
  if(!student)return {source:typeof f1VocabForStudent==='function'?'f1VocabForStudent':typeof vocabForStudent==='function'?'vocabForStudent':'missing',counts:out};
  try{for(const grade of grades){student.grade=grade;const p=vocabPool();out[grade]={count:p.length,unique:new Set(p.map(w=>w.en)).size};}}finally{student.grade=old;}
  G.audit={source:typeof f1VocabForStudent==='function'?'f1VocabForStudent':'vocabForStudent',counts:out};
  console.info('[Frontline1944] Vocabulary audit',G.audit);return G.audit;
}
function ensureProgress(){
  if(!window.state)return null;
  state.frontline1944=state.frontline1944||{};const p=state.frontline1944;
  p.claims=Array.isArray(p.claims)?p.claims:[];
  p.wordsDone=Number(p.wordsDone)||0;p.fortressSerial=Number(p.fortressSerial)||0;
  p.tank=p.tank&&typeof p.tank==='object'?p.tank:{};
  if(!G.progressHydrated){G.claimed=new Set(p.claims);G.wordsDone=p.wordsDone;G.fortressSerial=p.fortressSerial;G.progressHydrated=true;}
  return p;
}
function persist(){
  const p=ensureProgress();if(!p)return;
  p.word=G.word&&G.word.en||'';p.meaning=G.word&&G.word.th||'';p.letterPos=G.pos;p.wordRunId=G.wordRunId;
  p.wordsDone=G.wordsDone;p.fortressSerial=G.fortressSerial;p.claims=Array.from(G.claimed).slice(-160);
  p.objectiveSectorIndex=Number.isFinite(G.objectiveSectorIndex)?G.objectiveSectorIndex:null;
  if(G.player){const pose=authoritativeTankPose(G.player);p.tank={x:pose.x,z:pose.z,hullRotation:pose.heading,turretRotation:pose.turretHeading};}
  if(typeof saveState==='function')saveState();
  if(typeof authPushSave==='function')try{authPushSave(false);}catch(e){}
}
function claim(id,coins){if(G.claimed.has(id))return false;G.claimed.add(id);if(typeof addCoins==='function')addCoins(coins);persist();return true;}
function chooseWord(forceNew){
  const pool=vocabPool();if(!pool.length){showToast('ไม่พบคลังคำศัพท์','Frontline จะไม่สร้างฐานคำศัพท์ซ้ำเอง');return false;}
  const p=ensureProgress(),saved=!forceNew&&p&&p.word&&normalizeWord({en:p.word,th:p.meaning});
  if(saved&&p.letterPos<saved.en.length){G.word=saved;G.pos=clamp(Number(p.letterPos)||0,0,saved.en.length);G.wordRunId=p.wordRunId||('W'+Date.now().toString(36));}
  else{const prev=G.word&&G.word.en;let pick=pool[Math.floor(Math.random()*pool.length)];if(pool.length>1&&pick.en===prev)pick=pool[(pool.indexOf(pick)+1)%pool.length];G.word=pick;G.pos=0;G.wordRunId='W'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);}
  updateHud();return true;
}
function pronounce(w){try{if(typeof speakWord==='function'){speakWord(w);return;}if(typeof pronounceWord==='function'){pronounceWord(w);return;}if(typeof speechSynthesis!=='undefined'){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(w));}}catch(e){}}
function awardLetter(fortressId){
  if(!G.word||G.pos>=G.word.en.length)return;
  const ch=G.word.en[G.pos],id='fortress:'+fortressId;
  if(!claim(id,CFG.letterCoins))return;
  G.pos++;showToast('ยึดตัวอักษร '+ch,'+'+CFG.letterCoins+' เหรียญ · '+G.word.en.slice(0,G.pos));
  burst(G.player.world,0xffda72,16);
  if(G.pos>=G.word.en.length){
    const done=G.word.en,bid='word:'+G.wordRunId;
    if(claim(bid,CFG.wordBonus)){G.wordsDone++;if(window.state&&state.frontline1944)state.frontline1944.wordsDone=G.wordsDone;showToast(done+' สำเร็จ!','โบนัส +'+CFG.wordBonus+' เหรียญ · เตรียมคำถัดไป');pronounce(done);burst(G.player.world,0xffef9a,28);}
    setTimeout(()=>{if(G.running){chooseWord(true);activateNextFortress(false);}},900);
  }else{persist();activateNextFortress(false);}
  updateHud();
}

function loadThree(){return new Promise((res,rej)=>{
  if(window.THREE){res();return;}
  const old=document.querySelector('script[data-fl44-three]');
  if(old){old.addEventListener('load',()=>res(),{once:true});old.addEventListener('error',rej,{once:true});return;}
  const s=document.createElement('script');s.src='js/vendor/three.min.js';s.dataset.fl44Three='1';s.onload=()=>res();s.onerror=()=>rej(new Error('THREE load failed'));document.head.appendChild(s);
});}

function makeDom(){
  const r=document.createElement('div');r.id='vw-frontline1944';
  r.innerHTML=`<div class="fl44-loading"><div><b>Vocab World: Frontline 1944</b><small>กำลังเตรียม Sector Streamer + Tank Runtime · ADMIN PREVIEW</small></div></div>
  <div class="fl44-hud"><div class="fl44-top">
    <div class="fl44-panel fl44-player"><div class="fl44-player-row"><b>TANK</b><span id="fl44-hptext">${CFG.playerHP}/${CFG.playerHP}</span></div><div class="fl44-bar"><i id="fl44-hp"></i></div><small id="fl44-terrain">GRASS · ×1.00</small></div>
    <div class="fl44-panel fl44-word"><small>TARGET WORD</small><b id="fl44-word">—</b><div class="fl44-slots" id="fl44-slots"></div></div>
    <div class="fl44-panel fl44-coins"><span>เหรียญรวม</span><strong id="fl44-coins">0</strong><span id="fl44-grade"></span><small id="fl44-sector">Sector 0</small><small id="fl44-runtime">P1.2.3</small><small id="fl44-input">DRIVE READY · PTR/WIN</small></div>
  </div>
  <div class="fl44-panel fl44-boss" id="fl44-boss"><div class="fl44-boss-name" id="fl44-bossname">FORTRESS COMMANDER</div><div class="fl44-bar"><i id="fl44-bosshp"></i></div></div>
  <div class="fl44-panel fl44-objective"><b id="fl44-objective">ค้นหาฐานศัตรู</b><span id="fl44-distance">—</span><div class="fl44-arrow" id="fl44-arrow">➤</div></div>
  <div class="fl44-panel fl44-state" id="fl44-state">เดินทางไปยังฐานเป้าหมาย</div></div>
  <div class="fl44-controls"><div class="fl44-stick" id="fl44-stick"><i class="fl44-knob"></i><span>DRIVE</span></div><div class="fl44-aim-stick" id="fl44-aim-stick"><i class="fl44-aim-knob"></i><span>AIM</span></div><button class="fl44-fire" id="fl44-fire">FIRE</button></div>
  <button class="fl44-exit" id="fl44-exit">ออก</button><div class="fl44-toast" id="fl44-toast"><b></b><span></span></div>`;
  r.dataset.runtimeVersion=CFG.runtimeVersion;r.dataset.runtimeKind='tank';document.body.appendChild(r);G.root=r;claimTankRuntimeOwnership();syncAdminEntry();$('#fl44-exit').onclick=close;bindControls();
}
function showToast(a,b){if(!G.root)return;const t=$('#fl44-toast');t.querySelector('b').textContent=a;t.querySelector('span').textContent=b||'';t.classList.add('on');clearTimeout(G.toastTimer);G.toastTimer=setTimeout(()=>t&&t.classList.remove('on'),1700);}

const WorldSpace={
  // Logical sector numbers increase in the tank's default forward direction (-Z on screen/world).
  // This keeps the endless objective progression intuitive while remaining fully independent of pixels.
  sectorIndexAtZ(z){return Math.floor((-z+CFG.sectorLength*.5)/CFG.sectorLength);},
  sectorCenterZ(index){return -index*CFG.sectorLength;},
  localToWorld(index,x,z){return {x,z:z+this.sectorCenterZ(index)};},
  worldToSector(x,z){const logicalIndex=this.sectorIndexAtZ(z);return {logicalIndex,x,z:z-this.sectorCenterZ(logicalIndex)};},
  worldToScreen(x,y,z){
    if(!G.camera||!window.THREE)return null;const v=new THREE.Vector3(x,y,z).project(G.camera);
    return {x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight,visible:v.z>=-1&&v.z<=1};
  }
};

class ResourceCache{
  constructor(){this.geometries=new Map();this.materials=new Map();}
  geometry(kind){
    if(this.geometries.has(kind))return this.geometries.get(kind);let g;
    if(kind==='box')g=new THREE.BoxGeometry(1,1,1);
    else if(kind==='plane')g=new THREE.PlaneGeometry(1,1);
    else if(kind==='cylinder')g=new THREE.CylinderGeometry(1,1,1,8);
    else if(kind==='cone4')g=new THREE.ConeGeometry(1,1,4);
    else if(kind==='canopy')g=new THREE.DodecahedronGeometry(1,0);
    else if(kind==='sphere')g=new THREE.SphereGeometry(1,8,6);
    else if(kind==='shell')g=new THREE.CylinderGeometry(.22,.22,1,6);
    else if(kind==='spark')g=new THREE.OctahedronGeometry(1,0);
    else g=new THREE.BoxGeometry(1,1,1);
    this.geometries.set(kind,g);return g;
  }
  material(color,mode='standard'){
    const key=mode+':'+color;if(this.materials.has(key))return this.materials.get(key);let m;
    if(mode==='basic')m=new THREE.MeshBasicMaterial({color,transparent:true,opacity:1,depthWrite:false});
    else if(mode==='lambert')m=new THREE.MeshLambertMaterial({color});
    else m=new THREE.MeshStandardMaterial({color,roughness:.88,metalness:.04});
    this.materials.set(key,m);return m;
  }
  mesh(kind,color,scale,mode='standard'){
    const m=new THREE.Mesh(this.geometry(kind),this.material(color,mode));
    if(scale)m.scale.set(scale[0],scale[1],scale[2]);m.castShadow=kind!=='plane';m.receiveShadow=true;return m;
  }
  dispose(){for(const g of this.geometries.values())g.dispose&&g.dispose();for(const m of this.materials.values())m.dispose&&m.dispose();this.geometries.clear();this.materials.clear();}
}

function sharedMesh(kind,color,sx=1,sy=1,sz=1,mode='standard'){return G.resources.mesh(kind,color,[sx,sy,sz],mode);}
function addToLayer(layer,o){G.layers[layer].add(o);return o;}
function addToSector(rt,layer,o){rt.groups[layer].add(o);return o;}
function setWorldPos(o,x,y,z){o.position.set(x,y,z);return o;}

class TerrainSystem{
  constructor(){this.bySector=new Map();}
  registerRect(sectorIndex,x,z,w,h,type,priority=10,tag=''){const list=this.bySector.get(sectorIndex)||[];list.push({shape:'rect',x,z,w,h,type,priority,tag});this.bySector.set(sectorIndex,list);}
  registerCircle(sectorIndex,x,z,r,type,priority=10,tag=''){const list=this.bySector.get(sectorIndex)||[];list.push({shape:'circle',x,z,r,type,priority,tag});this.bySector.set(sectorIndex,list);}
  clearSector(index){this.bySector.delete(index);}
  sample(x,z){
    const idx=WorldSpace.sectorIndexAtZ(z),candidates=[];
    for(const k of [idx-1,idx,idx+1]){const list=this.bySector.get(k);if(list)candidates.push(...list);}
    let best=null;
    for(const q of candidates){let hit=false;if(q.shape==='rect')hit=Math.abs(x-q.x)<=q.w*.5&&Math.abs(z-q.z)<=q.h*.5;else{const dx=x-q.x,dz=z-q.z;hit=dx*dx+dz*dz<=q.r*q.r;}if(hit&&(!best||q.priority>best.priority))best=q;}
    const t=best&&TERRAIN[best.type]||TERRAIN.GRASS;return {id:t.id,speed:t.speed,blocked:t.blocked,zone:best};
  }
  stats(){let zones=0;for(const v of this.bySector.values())zones+=v.length;return {sectorBuckets:this.bySector.size,zones};}
}

class CollisionSystem{
  constructor(terrain){this.terrain=terrain;this.bySector=new Map();}
  registerCircle(sectorIndex,x,z,r,meta={}){const list=this.bySector.get(sectorIndex)||[];list.push({shape:'circle',x,z,r,ownerId:meta.ownerId||'',kind:meta.kind||'solid',tag:meta.tag||'',solid:meta.solid!==false});this.bySector.set(sectorIndex,list);}
  registerAABB(sectorIndex,x,z,w,h,meta={}){const list=this.bySector.get(sectorIndex)||[];list.push({shape:'aabb',x,z,w,h,ownerId:meta.ownerId||'',kind:meta.kind||'solid',tag:meta.tag||'',solid:meta.solid!==false});this.bySector.set(sectorIndex,list);}
  clearSector(index,ownerPrefix){
    if(!ownerPrefix){this.bySector.delete(index);return;}
    const list=this.bySector.get(index)||[],next=list.filter(c=>!String(c.ownerId||'').startsWith(ownerPrefix));if(next.length)this.bySector.set(index,next);else this.bySector.delete(index);
  }
  removeOwner(ownerId){for(const [k,list] of this.bySector){const next=list.filter(c=>c.ownerId!==ownerId);if(next.length)this.bySector.set(k,next);else this.bySector.delete(k);}}
  collidersNear(x,z){const idx=WorldSpace.sectorIndexAtZ(z),out=[];for(const k of [idx-1,idx,idx+1]){const list=this.bySector.get(k);if(list)out.push(...list);}return out;}
  blockedTerrainFootprint(x,z,radius){
    const r=Math.max(0,Number(radius)||0)*.9,diag=r*.70710678,pts=[[0,0],[r,0],[-r,0],[0,r],[0,-r],[diag,diag],[diag,-diag],[-diag,diag],[-diag,-diag]];
    for(const q of pts){const terrain=this.terrain.sample(x+q[0],z+q[1]);if(terrain.blocked)return terrain;}
    return null;
  }
  tankFootprintSamples(x,z,heading,halfWidth,halfLength){
    const f=forwardFromRotation(heading),r=rightFromRotation(heading),pts=[[0,0],[halfWidth,halfLength],[-halfWidth,halfLength],[halfWidth,-halfLength],[-halfWidth,-halfLength],[0,halfLength],[0,-halfLength],[halfWidth,0],[-halfWidth,0],[halfWidth*.5,halfLength],[-halfWidth*.5,halfLength],[halfWidth*.5,-halfLength],[-halfWidth*.5,-halfLength]];
    return pts.map(([sx,sz])=>({x:x+r.x*sx+f.x*sz,z:z+r.z*sx+f.z*sz}));
  }
  blockedTankTerrain(x,z,heading,halfWidth,halfLength){
    for(const p of this.tankFootprintSamples(x,z,heading,halfWidth,halfLength)){const terrain=this.terrain.sample(p.x,p.z);if(terrain.blocked)return terrain;}
    return null;
  }
  circleHitsOBB(c,x,z,heading,halfWidth,halfLength){
    const r=rightFromRotation(heading),f=forwardFromRotation(heading),dx=c.x-x,dz=c.z-z,lx=dx*r.x+dz*r.z,lz=dx*f.x+dz*f.z,nx=clamp(lx,-halfWidth,halfWidth),nz=clamp(lz,-halfLength,halfLength),qx=lx-nx,qz=lz-nz;return qx*qx+qz*qz<=c.r*c.r;
  }
  aabbHitsOBB(c,x,z,heading,halfWidth,halfLength){
    const r=rightFromRotation(heading),f=forwardFromRotation(heading),dx=c.x-x,dz=c.z-z,aw=c.w*.5,ah=c.h*.5;
    if(Math.abs(dx)>halfWidth*Math.abs(r.x)+halfLength*Math.abs(f.x)+aw)return false;
    if(Math.abs(dz)>halfWidth*Math.abs(r.z)+halfLength*Math.abs(f.z)+ah)return false;
    if(Math.abs(dx*r.x+dz*r.z)>halfWidth+aw*Math.abs(r.x)+ah*Math.abs(r.z))return false;
    if(Math.abs(dx*f.x+dz*f.z)>halfLength+aw*Math.abs(f.x)+ah*Math.abs(f.z))return false;
    return true;
  }
  hitTankFootprint(x,z,heading,halfWidth=CFG.tankFootprintHalfWidth,halfLength=CFG.tankFootprintHalfLength,ignoreOwner=''){
    const blockedTerrain=this.blockedTankTerrain(x,z,heading,halfWidth,halfLength);if(blockedTerrain)return {blocked:true,type:'terrain',terrain:blockedTerrain};
    const terrain=this.terrain.sample(x,z);
    for(const c of this.collidersNear(x,z)){if(!c.solid||c.ownerId===ignoreOwner)continue;const hit=c.shape==='circle'?this.circleHitsOBB(c,x,z,heading,halfWidth,halfLength):this.aabbHitsOBB(c,x,z,heading,halfWidth,halfLength);if(hit)return {blocked:true,type:'solid',collider:c,terrain};}
    return {blocked:false,terrain};
  }
  hitSolid(x,z,radius,ignoreOwner=''){
    const blockedTerrain=this.blockedTerrainFootprint(x,z,radius);if(blockedTerrain)return {blocked:true,type:'terrain',terrain:blockedTerrain};
    const terrain=this.terrain.sample(x,z);
    for(const c of this.collidersNear(x,z)){if(!c.solid||c.ownerId===ignoreOwner)continue;let hit=false;
      if(c.shape==='circle'){const dx=x-c.x,dz=z-c.z,rr=radius+c.r;hit=dx*dx+dz*dz<=rr*rr;}
      else{const nx=clamp(x,c.x-c.w*.5,c.x+c.w*.5),nz=clamp(z,c.z-c.h*.5,c.z+c.h*.5),dx=x-nx,dz=z-nz;hit=dx*dx+dz*dz<=radius*radius;}
      if(hit)return {blocked:true,type:'solid',collider:c,terrain};
    }
    return {blocked:false,terrain};
  }
  hitSolidOnly(x,z,radius,ignoreOwner=''){
    for(const c of this.collidersNear(x,z)){if(!c.solid||c.ownerId===ignoreOwner)continue;let hit=false;
      if(c.shape==='circle'){const dx=x-c.x,dz=z-c.z,rr=radius+c.r;hit=dx*dx+dz*dz<=rr*rr;}
      else{const nx=clamp(x,c.x-c.w*.5,c.x+c.w*.5),nz=clamp(z,c.z-c.h*.5,c.z+c.h*.5),dx=x-nx,dz=z-nz;hit=dx*dx+dz*dz<=radius*radius;}
      if(hit)return c;
    }return null;
  }
  resolveCircleMove(from,to,radius){
    const dx=to.x-from.x,dz=to.z-from.z,len=Math.hypot(dx,dz),steps=Math.max(1,Math.ceil(len/Math.max(.55,radius*.38))),stepX=dx/steps,stepZ=dz/steps;let x=from.x,z=from.z,blocked=false,contact=null;
    for(let i=0;i<steps;i++){
      const tx=x+stepX;let h=this.hitSolid(tx,z,radius);if(!h.blocked)x=tx;else{blocked=true;contact=h;}
      const tz=z+stepZ;h=this.hitSolid(x,tz,radius);if(!h.blocked)z=tz;else{blocked=true;contact=h;}
    }
    return {x,z,blocked,contact,terrain:this.terrain.sample(x,z)};
  }
  // Legacy compatibility helper for non-player callers. The authoritative player tank uses resolveTankSweep().
  resolveVehicleMove(from,to,radius){
    const dx=to.x-from.x,dz=to.z-from.z,len=Math.hypot(dx,dz),steps=Math.max(1,Math.ceil(len/Math.max(.28,radius*.18))),stepX=dx/steps,stepZ=dz/steps;let x=from.x,z=from.z,blocked=false,contact=null;
    for(let i=0;i<steps;i++){const nx=x+stepX,nz=z+stepZ,h=this.hitSolid(nx,nz,radius);if(h.blocked){blocked=true;contact=h;break;}x=nx;z=nz;}
    return {x,z,blocked,contact,terrain:this.terrain.sample(x,z)};
  }
  resolveTankSweep(from,to,halfWidth=CFG.tankFootprintHalfWidth,halfLength=CFG.tankFootprintHalfLength,ignoreOwner=''){
    const dx=to.x-from.x,dz=to.z-from.z,dh=wrapPi(to.heading-from.heading),distance=Math.hypot(dx,dz),steps=Math.max(1,Math.ceil(distance/CFG.tankSweepMaxStep),Math.ceil(Math.abs(dh)/CFG.tankSweepMaxYaw));let x=from.x,z=from.z,heading=from.heading,blocked=false,contact=null;
    for(let i=1;i<=steps;i++){const q=i/steps,nx=from.x+dx*q,nz=from.z+dz*q,nh=wrapPi(from.heading+dh*q),hit=this.hitTankFootprint(nx,nz,nh,halfWidth,halfLength,ignoreOwner);if(hit.blocked){blocked=true;contact=hit;break;}x=nx;z=nz;heading=nh;}
    return {x,z,heading,blocked,contact,terrain:this.terrain.sample(x,z)};
  }
  stats(){let colliders=0;for(const v of this.bySector.values())colliders+=v.length;return {sectorBuckets:this.bySector.size,colliders};}
}
function visualIdFor(logicalIndex){return hash32((logicalIndex|0)*1103515245+12345)%SECTOR_TEMPLATES.length;}
function sectorDescriptor(logicalIndex){return {logicalIndex,visualSectorId:visualIdFor(logicalIndex),seed:hash32(logicalIndex^0x1944),centerZ:WorldSpace.sectorCenterZ(logicalIndex)};}

function createSectorGroups(index){const groups={};for(const k of Object.values(LAYER)){const g=new THREE.Group();g.name='FL44Sector'+index+'Layer'+k;G.layers[k].add(g);groups[k]=g;}return groups;}
function removeSectorGroups(groups){for(const g of Object.values(groups||{})){if(g&&g.parent)g.parent.remove(g);}}
function registerOccluder(rt,o,anchorZ,priority=0){o.userData=o.userData||{};o.userData.occluder=true;o.userData.depthAnchor={worldZ:anchorZ,priority,foreground:true};o.renderOrder=6000+priority;rt.occluders.push(o);G.occluders.push(o);return o;}
function updateOcclusionOrder(){
  if(!G.player||!G.sectorStreamer)return;const center=WorldSpace.sectorCenterZ(G.sectorStreamer.currentIndex);
  for(const o of G.occluders){if(!o.parent)continue;const a=o.userData&&o.userData.depthAnchor;if(!a)continue;const ySort=clamp(Math.round((a.worldZ-center)*2),-240,240);o.renderOrder=6000+ySort+(a.priority||0);}
  G.player.group.renderOrder=5000+clamp(Math.round((G.player.world.z-center)*2),-240,240);
}

function addBaseSectorArt(rt,t){
  const base=sharedMesh('plane',t.base,CFG.sectorWidth,CFG.sectorLength,1,'lambert');base.rotation.x=-Math.PI/2;base.position.set(0,-.08,rt.desc.centerZ);addToSector(rt,LAYER.BACKGROUND,base);
  const rng=rt.rng;
  for(let i=0;i<5;i++){
    const w=28+rng()*45,h=28+rng()*48,x=-CFG.sectorWidth*.36+rng()*CFG.sectorWidth*.72,z=rt.desc.centerZ-CFG.sectorLength*.36+rng()*CFG.sectorLength*.72;
    const p=sharedMesh('plane',i%2?t.fieldA:t.fieldB,w,h,1,'lambert');p.rotation.x=-Math.PI/2;p.rotation.z=(rng()-.5)*.18;p.position.set(x,-.04,z);addToSector(rt,LAYER.TERRAIN,p);
  }
  // A lightweight through-road keeps sectors traversable. Final art can replace it without changing terrain data.
  const road=sharedMesh('plane',0x776b56,11,CFG.sectorLength*.98,1,'lambert');road.rotation.x=-Math.PI/2;road.position.set(0,.015,rt.desc.centerZ);addToSector(rt,LAYER.ROADS_WATER,road);
  G.terrain.registerRect(rt.index,0,rt.desc.centerZ,12,CFG.sectorLength,'ROAD',35,'through-road');
}
function addFieldRows(rt,x,z,w,h,color){for(let i=0;i<7;i++){const row=sharedMesh('plane',color,w*.88,.32,1,'lambert');row.rotation.x=-Math.PI/2;row.position.set(x,.02,z-h*.34+i*h*.11);addToSector(rt,LAYER.ROADS_WATER,row);}}
function addCrater(rt,x,z,r=2.4){const ring=sharedMesh('cylinder',0x4b4437,r,.15,r,'standard');ring.position.set(x,.03,z);addToSector(rt,LAYER.GROUND_DECOR,ring);G.terrain.registerCircle(rt.index,x,z,r*1.2,'DAMAGED_GROUND',45,'crater');}
function addMudPatch(rt,x,z,w,h){const p=sharedMesh('plane',0x514a3b,w,h,1,'lambert');p.rotation.x=-Math.PI/2;p.position.set(x,.025,z);addToSector(rt,LAYER.TERRAIN,p);G.terrain.registerRect(rt.index,x,z,w,h,'MUD',44,'mud');}
function addTree(rt,x,z,s=1){
  const trunk=sharedMesh('cylinder',0x51422d,.52*s,3.5*s,.52*s);trunk.position.set(x,1.75*s,z);addToSector(rt,LAYER.GAMEPLAY_PROPS,trunk);
  G.collision.registerCircle(rt.index,x,z,.72*s,{ownerId:rt.ownerId,kind:'tree_trunk',tag:'tree'});
  const canopy=new THREE.Group(),m=G.resources.material(0x405c38,'standard');
  const geo=G.resources.geometry('canopy');
  for(const q of [[0,0,0,1],[1.15,.08,.2,.78],[-1.05,.12,.18,.72],[.2,.28,-.9,.7]]){const c=new THREE.Mesh(geo,m);c.scale.setScalar(1.85*s*q[3]);c.position.set(q[0]*s,q[1]*s,q[2]*s);c.castShadow=true;canopy.add(c);}
  canopy.position.set(x,4.15*s,z);addToSector(rt,LAYER.FOREGROUND_OCCLUDERS,canopy);registerOccluder(rt,canopy,z,10);return {trunk,canopy};
}
function addHouse(rt,x,z,ruined=false){
  const g=new THREE.Group(),body=sharedMesh('box',ruined?0x736756:0x8d8268,6,ruined?2.3:3.5,5);body.position.y=(ruined?2.3:3.5)*.5;g.add(body);
  if(!ruined){const roof=sharedMesh('cone4',0x554a3d,4.4,2.4,4.4);roof.position.y=4.6;roof.rotation.y=Math.PI/4;g.add(roof);}
  else{const wall=sharedMesh('box',0x625a4f,2.2,2.5,.55);wall.position.set(2.1,2.5,0);g.add(wall);}
  g.position.set(x,0,z);addToSector(rt,LAYER.GAMEPLAY_PROPS,g);G.collision.registerAABB(rt.index,x,z,6.4,5.5,{ownerId:rt.ownerId,kind:ruined?'ruin':'house'});return g;
}
function addBunker(rt,x,z){const g=new THREE.Group(),base=sharedMesh('box',0x5a584a,7,2.2,5.5);base.position.y=1.1;g.add(base);const top=sharedMesh('box',0x4d5043,5.6,1.1,4.1);top.position.y=2.6;g.add(top);g.position.set(x,0,z);addToSector(rt,LAYER.GAMEPLAY_PROPS,g);G.collision.registerAABB(rt.index,x,z,7.2,5.8,{ownerId:rt.ownerId,kind:'bunker'});G.terrain.registerRect(rt.index,x,z,7.2,5.8,'FORTIFICATION',80,'bunker');return g;}
function addCampTent(rt,x,z){const g=new THREE.Group(),b=sharedMesh('cone4',0x6c6b51,3.4,3,4.2);b.rotation.y=Math.PI/4;b.position.y=1.5;g.add(b);g.position.set(x,0,z);addToSector(rt,LAYER.GAMEPLAY_PROPS,g);G.collision.registerAABB(rt.index,x,z,5.5,6.5,{ownerId:rt.ownerId,kind:'tent'});}
function addWall(rt,x,z,w,h,rot=0,kind='stone_wall'){
  const m=sharedMesh('box',0x625e50,w,1.25,h);m.position.set(x,.62,z);m.rotation.y=rot;addToSector(rt,LAYER.GAMEPLAY_PROPS,m);
  // Collision proxies stay axis-aligned and lightweight. Art can rotate independently in later phases.
  const cw=Math.abs(Math.cos(rot))*w+Math.abs(Math.sin(rot))*h,ch=Math.abs(Math.sin(rot))*w+Math.abs(Math.cos(rot))*h;
  const margin=.45;G.collision.registerAABB(rt.index,x,z,cw+margin*2,ch+margin*2,{ownerId:rt.ownerId,kind});G.terrain.registerRect(rt.index,x,z,cw+margin*2,ch+margin*2,'FORTIFICATION',82,kind);
}
function addBridgeCrossing(rt){
  const riverZ=rt.desc.centerZ+6;
  const river=sharedMesh('plane',0x486d77,CFG.sectorWidth*.98,20,1,'lambert');river.rotation.x=-Math.PI/2;river.position.set(0,.03,riverZ);addToSector(rt,LAYER.ROADS_WATER,river);
  G.terrain.registerRect(rt.index,0,riverZ,CFG.sectorWidth,20,'DEEP_WATER',70,'deep-river');
  const deck=sharedMesh('box',0x776a54,12,.7,25);deck.position.set(0,.38,riverZ);addToSector(rt,LAYER.GAMEPLAY_PROPS,deck);
  G.terrain.registerRect(rt.index,0,riverZ,10.5,27,'ROAD',100,'bridge-crossing'); // bridge explicitly overrides deep water
  for(const x of [-6.1,6.1]){const rail=sharedMesh('box',0x4a493e,.35,1.1,25);rail.position.set(x,1.1,riverZ);addToSector(rt,LAYER.GAMEPLAY_PROPS,rail);G.collision.registerAABB(rt.index,x,riverZ,.55,25,{ownerId:rt.ownerId,kind:'bridge_rail'});}
  const ford=sharedMesh('plane',0x62828a,15,20,1,'lambert');ford.rotation.x=-Math.PI/2;ford.position.set(-48,.035,riverZ);addToSector(rt,LAYER.ROADS_WATER,ford);
  G.terrain.registerRect(rt.index,-48,riverZ,14,20,'SHALLOW_WATER',95,'ford');
}
function addSmoke(rt,x,z,s=1){
  const m=new THREE.SpriteMaterial({map:makeSmokeTexture(),transparent:true,depthWrite:false,opacity:.43});const spr=new THREE.Sprite(m);spr.scale.set(12*s,12*s,1);spr.position.set(x,5,z);addToSector(rt,LAYER.ATMOSPHERE,spr);rt.uniqueMaterials.push(m);const rec={sprite:spr,ownerId:rt.ownerId,baseY:5,phase:rt.rng()*10};rt.smoke.push(rec);G.smoke.push(rec);
}
let _smokeTexture=null;
function makeSmokeTexture(){
  if(_smokeTexture)return _smokeTexture;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(55,56,52,.62)');g.addColorStop(.55,'rgba(55,56,52,.28)');g.addColorStop(1,'rgba(55,56,52,0)');x.fillStyle=g;x.fillRect(0,0,64,64);_smokeTexture=new THREE.CanvasTexture(c);return _smokeTexture;
}

function populateSector(rt){
  const t=SECTOR_TEMPLATES[rt.desc.visualSectorId],rng=rt.rng,cz=rt.desc.centerZ;addBaseSectorArt(rt,t);
  const left=-42-rng()*24,right=42+rng()*24;
  addFieldRows(rt,left,cz-28,38,42,t.fieldA);addFieldRows(rt,right,cz+30,42,38,t.fieldB);
  const scatterTrees=(count,x0,x1,z0,z1)=>{for(let i=0;i<count;i++){let x=lerp(x0,x1,rng()),z=lerp(z0,z1,rng());if(Math.abs(x)<12)x+=x<0?-15:15;addTree(rt,x,z,.82+rng()*.35);}};
  switch(t.id){
    case 'farmland':scatterTrees(9,-82,-54,cz-68,cz+68);scatterTrees(7,54,82,cz-68,cz+68);addHouse(rt,-56,cz+8,false);break;
    case 'wheat_fields':scatterTrees(8,-84,-62,cz-70,cz+70);addHouse(rt,58,cz-34,false);addHouse(rt,66,cz-22,false);break;
    case 'forest':scatterTrees(25,-84,-22,cz-68,cz+68);scatterTrees(22,24,84,cz-68,cz+68);break;
    case 'village':for(let i=0;i<8;i++)addHouse(rt,(i%2?-1:1)*(34+(i%3)*10),cz-48+Math.floor(i/2)*27,false);scatterTrees(10,-82,82,cz-68,cz+68);break;
    case 'ruined_village':for(let i=0;i<7;i++)addHouse(rt,(i%2?-1:1)*(36+(i%3)*11),cz-45+Math.floor(i/2)*28,i%2===0);for(let i=0;i<7;i++)addCrater(rt,-66+rng()*132,cz-62+rng()*124,1.7+rng()*1.8);addSmoke(rt,52,cz+22,.9);break;
    case 'river_crossing':addBridgeCrossing(rt);scatterTrees(13,-84,-58,cz-65,cz+65);scatterTrees(12,58,84,cz-65,cz+65);break;
    case 'defensive_line':for(let x=-78;x<=78;x+=18){if(Math.abs(x)<14)continue;addWall(rt,x,cz+24,13,1.5,(x%36?-.15:.12),'defensive_wall');}addBunker(rt,-50,cz+38);addBunker(rt,50,cz+36);break;
    case 'artillery_zone':for(let i=0;i<10;i++)addCrater(rt,-75+rng()*150,cz-65+rng()*130,2+rng()*2.4);addMudPatch(rt,-44,cz+20,28,38);addMudPatch(rt,48,cz-28,34,30);addBunker(rt,58,cz+43);addSmoke(rt,-46,cz-16,1.1);break;
    case 'military_camp':for(let i=0;i<7;i++)addCampTent(rt,(i%2?-1:1)*(35+(i%3)*10),cz-45+Math.floor(i/2)*25);addBunker(rt,62,cz+45);scatterTrees(8,-84,-63,cz-68,cz+68);break;
    case 'fortress_approach':for(let x=-78;x<=78;x+=22){if(Math.abs(x)<13)continue;addWall(rt,x,cz+18,16,1.3,(x%44?-.08:.1),'approach_wall');}addMudPatch(rt,-45,cz-24,25,32);addMudPatch(rt,48,cz+38,25,28);addSmoke(rt,66,cz+10,.8);break;
  }
  // Always provide a few physical props outside the main road so collision can be exercised in every sector.
  if(t.id!=='forest'){scatterTrees(5,-84,-63,cz-68,cz+68);scatterTrees(4,63,84,cz-68,cz+68);}
}

function disposeSectorRuntime(rt){
  if(!rt)return;removeSectorGroups(rt.groups);G.collision.clearSector(rt.index,rt.ownerId);G.terrain.clearSector(rt.index);
  const occ=new Set(rt.occluders);G.occluders=G.occluders.filter(o=>!occ.has(o));const smoke=new Set(rt.smoke);G.smoke=G.smoke.filter(s=>!smoke.has(s));
  for(const m of rt.uniqueMaterials)m.dispose&&m.dispose();
}
function instantiateSector(desc){
  const rt={index:desc.logicalIndex,ownerId:'sector:'+desc.logicalIndex+':',desc,groups:createSectorGroups(desc.logicalIndex),rng:randFrom(desc.seed),occluders:[],smoke:[],uniqueMaterials:[],active:true};
  populateSector(rt);return rt;
}

class SectorStreamer{
  constructor(){this.currentIndex=0;this.active=new Map();this.preloaded=new Map();this.tickSerial=0;}
  preload(index){
    const active=this.active.get(index);if(active)return active.desc;
    const cached=this.preloaded.get(index);if(cached){cached.touched=++this.tickSerial;return cached.desc;}
    const d=sectorDescriptor(index);this.preloaded.set(index,{desc:d,touched:++this.tickSerial});this.trimDescriptorCache();return d;
  }
  trimDescriptorCache(){
    if(this.preloaded.size<=CFG.descriptorCacheCap)return;const entries=[...this.preloaded.entries()].sort((a,b)=>a[1].touched-b[1].touched);while(this.preloaded.size>CFG.descriptorCacheCap){const e=entries.shift();if(e)this.preloaded.delete(e[0]);else break;}
  }
  activate(index){
    if(this.active.has(index))return this.active.get(index);let d=this.preloaded.get(index)&&this.preloaded.get(index).desc;if(!d)d=sectorDescriptor(index);this.preloaded.delete(index);const rt=instantiateSector(d);this.active.set(index,rt);return rt;
  }
  deactivate(index){const rt=this.active.get(index);if(!rt)return;disposeSectorRuntime(rt);this.active.delete(index);}
  update(worldZ,force=false){
    const current=WorldSpace.sectorIndexAtZ(worldZ);if(!force&&current===this.currentIndex)return false;this.currentIndex=current;
    const desired=new Set([current-1,current,current+1]);
    for(const i of desired)this.activate(i);
    // Previous/Current/Next are the only fully active sectors. Neighbors beyond that are descriptor-preloaded only.
    for(const i of [...this.active.keys()])if(!desired.has(i))this.deactivate(i);
    this.preload(current+CFG.preloadAhead);this.preload(current-CFG.preloadAhead);
    for(const [i] of [...this.preloaded])if(Math.abs(i-current)>CFG.preloadAhead+1)this.preloaded.delete(i);
    updateOcclusionOrder();return true;
  }
  ensure(index){if(Math.abs(index-this.currentIndex)<=CFG.streamRadius)return this.activate(index);return this.preload(index);}
  isActive(index){return this.active.has(index);}
  visualId(index){const rt=this.active.get(index);return rt?rt.desc.visualSectorId:visualIdFor(index);}
  stats(){return {currentIndex:this.currentIndex,active:[...this.active.keys()].sort((a,b)=>a-b),preloaded:[...this.preloaded.keys()].sort((a,b)=>a-b),activeCount:this.active.size,preloadedCount:this.preloaded.size};}
  dispose(){for(const i of [...this.active.keys()])this.deactivate(i);this.preloaded.clear();}
}

class ObjectPool{
  constructor(name,cap,create,reset){this.name=name;this.cap=cap;this.create=create;this.reset=reset;this.free=[];this.active=[];this.created=0;}
  acquire(spec){if(this.active.length>=this.cap)return null;let o=this.free.pop();if(!o){if(this.created>=this.cap)return null;o=this.create();this.created++;}this.reset(o,spec);o.active=true;this.active.push(o);return o;}
  release(o){if(!o||!o.active)return;o.active=false;const i=this.active.indexOf(o);if(i>=0){const last=this.active.pop();if(last!==o)this.active[i]=last;}if(o.group)o.group.visible=false;if(o.mesh)o.mesh.visible=false;this.free.push(o);}
  releaseAll(){for(const o of [...this.active])this.release(o);}
  stats(){return {name:this.name,active:this.active.length,free:this.free.length,created:this.created,cap:this.cap};}
}

function createProjectilePool(name,cap,color){
  return new ObjectPool(name,cap,()=>{
    const group=new THREE.Group(),body=sharedMesh('shell',color,1,1.2,1,'standard');body.rotation.x=Math.PI/2;group.add(body);group.visible=false;addToLayer(LAYER.COMBAT_FX,group);
    return {group,world:{x:0,z:0},direction:{x:0,z:-1},speed:0,damage:0,ownerId:'',weaponId:'',impactEvent:'',lifetime:0,team:'',collisionRadius:.22,active:false};
  },(p,spec)=>{
    Object.assign(p,spec);p.world.x=spec.x;p.world.z=spec.z;p.direction={x:spec.dx,z:spec.dz};p.group.position.set(spec.x,spec.y||1.8,spec.z);p.group.rotation.y=rotationFromForward(spec.dx,spec.dz);p.group.visible=true;
  });
}
function createFxPool(){
  return new ObjectPool('impact-fx',CFG.fxCap,()=>{const mesh=sharedMesh('spark',0xffd074,.12,.12,.12,'basic');mesh.visible=false;addToLayer(LAYER.COMBAT_FX,mesh);return {mesh,world:{x:0,z:0},v:{x:0,y:0,z:0},life:0,maxLife:1,active:false};},(f,s)=>{f.mesh.material=G.resources.material(s.color||0xffd074,'basic');f.world={x:s.x,z:s.z};f.mesh.position.set(s.x,s.y||1.4,s.z);f.mesh.scale.setScalar(s.scale||.12);f.v=s.v;f.life=f.maxLife=s.life||.7;f.mesh.material.opacity=.95;f.mesh.visible=true;});
}
function initPools(){G.pools={playerProjectiles:createProjectilePool('player-shells',CFG.projectileCap,0xffd874),enemyProjectiles:createProjectilePool('enemy-shells',CFG.enemyProjectileCap,0xf08b52),fx:createFxPool()};}
function disposePools(){if(!G.pools)return;for(const p of Object.values(G.pools)){p.releaseAll();for(const o of [...p.free,...p.active]){const node=o.group||o.mesh;if(node&&node.parent)node.parent.remove(node);}}G.pools=null;}

function makeTank(color=0x4e5f4a){
  const root=new THREE.Group(),hull=new THREE.Group(),turret=new THREE.Group();root.add(hull);root.add(turret);
  const chassis=sharedMesh('box',color,5.8,1.25,8.2);chassis.position.y=1.05;hull.add(chassis);
  const upper=sharedMesh('box',0x596b52,4.8,.9,5.2);upper.position.set(0,1.85,-.25);hull.add(upper);
  // ADMIN PREVIEW orientation markers: yellow = HULL FRONT (-local Z), red = REAR. Keep until final tank art makes front/rear unmistakable.
  const frontMarker=sharedMesh('box',0xffd84f,3.4,.22,.55,'standard');frontMarker.position.set(0,1.88,-4.18);hull.add(frontMarker);
  const frontStripe=sharedMesh('box',0xffe889,.46,.12,2.45,'standard');frontStripe.position.set(0,2.36,-2.55);hull.add(frontStripe);
  const rearMarker=sharedMesh('box',0xc94b3c,2.3,.18,.42,'standard');rearMarker.position.set(0,1.7,4.18);hull.add(rearMarker);
  const frontArrow=sharedMesh('cone4',0xfff08a,1.05,1.8,1.05,'standard');frontArrow.rotation.x=-Math.PI/2;frontArrow.position.set(0,2.58,-4.72);hull.add(frontArrow);
  const rearLeft=sharedMesh('sphere',0xff4f3e,.26,.26,.26,'basic'),rearRight=sharedMesh('sphere',0xff4f3e,.26,.26,.26,'basic');rearLeft.position.set(-1.9,2.0,4.32);rearRight.position.set(1.9,2.0,4.32);hull.add(rearLeft);hull.add(rearRight);
  for(const sx of [-2.75,2.75]){const track=sharedMesh('box',0x242926,.72,1.2,8.7);track.position.set(sx,.78,0);hull.add(track);for(let z=-3.1;z<=3.1;z+=1.55){const wheel=sharedMesh('cylinder',0x343a34,.48,.34,.48);wheel.rotation.z=Math.PI/2;wheel.position.set(sx,.78,z);hull.add(wheel);}}
  const turretBase=sharedMesh('cylinder',0x61725a,1.95,.9,1.95);turretBase.position.y=2.65;turret.add(turretBase);
  const turretBox=sharedMesh('box',0x596b52,3.5,1.15,3.8);turretBox.position.set(0,3.15,-.25);turret.add(turretBox);
  const barrel=sharedMesh('box',0x303834,.38,.38,5.4);barrel.position.set(0,3.25,-3.55);turret.add(barrel);
  const cannonTip=new THREE.Object3D();cannonTip.position.set(0,3.25,-6.3);turret.add(cannonTip);
  const labelAnchor=new THREE.Object3D();labelAnchor.position.set(0,5.35,0);root.add(labelAnchor);
  const nameAnchor=new THREE.Object3D();nameAnchor.position.set(0,5.55,0);root.add(nameAnchor);
  const hpAnchor=new THREE.Object3D();hpAnchor.position.set(0,5.18,0);root.add(hpAnchor);
  const damageAnchor=new THREE.Object3D();damageAnchor.position.set(0,6.05,0);root.add(damageAnchor);
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});root.renderOrder=5000;addToLayer(LAYER.ACTORS,root);
  return {group:root,hull,turret,barrel,cannonTip,frontMarker,frontStripe,rearMarker,frontArrow,rearLeft,rearRight,labelAnchor,nameAnchor,hpAnchor,damageAnchor,world:{x:0,z:0},speed:0,hullRotation:0,turretRotation:0,turretTargetRotation:0,hp:CFG.playerHP,maxHp:CFG.playerHP,invuln:0,radius:CFG.tankRadius,footprint:{halfWidth:CFG.tankFootprintHalfWidth,halfLength:CFG.tankFootprintHalfLength},
    playerId:'local',displayName:'Player',activeWeapon:'main_cannon',fireEvent:0,visualUpgradeTier:0,damageStatistic:{match:0,lifetime:0},
    hullVisualTier:0,armorTier:0,engineTier:0,turretTier:0,mainWeaponId:'main_cannon',specialWeaponId:'',skinId:'default'};
}
function playerIdentity(){
  let id='local',name='Player';try{id=String((window.state&&state.student&&(state.student.uid||state.student.id))||(window.auth&&auth.currentUser&&auth.currentUser.uid)||'local');}catch(e){}
  try{name=String((window.state&&state.student&&(state.student.name||state.student.displayName))||(window.auth&&auth.currentUser&&auth.currentUser.displayName)||'Player');}catch(e){}
  return {id,name};
}
function makePlayer(){
  const t=makeTank(0x4f6250),p=ensureProgress(),saved=p&&p.tank||{},id=playerIdentity();t.playerId=id.id;t.displayName=id.name;
  t.world.x=Number.isFinite(Number(saved.x))?Number(saved.x):0;t.world.z=Number.isFinite(Number(saved.z))?Number(saved.z):0;
  t.hullRotation=Number.isFinite(Number(saved.hullRotation))?wrapPi(Number(saved.hullRotation)):0;t.turretRotation=Number.isFinite(Number(saved.turretRotation))?wrapPi(Number(saved.turretRotation)):t.hullRotation;t.turretTargetRotation=t.turretRotation;
  syncTankVisual(t);G.player=t;G.tankRuntime=new TankRuntime(t,G.collision,G.terrain);return t;
}
function authoritativeTankPose(t){
  if(t&&t===G.player&&G.tankRuntime&&G.tankRuntime.entity===t)return G.tankRuntime.pose();
  return {x:t&&t.world?t.world.x:0,z:t&&t.world?t.world.z:0,heading:t?wrapPi(Number(t.hullRotation)||0):0,turretHeading:t?wrapPi(Number(t.turretRotation)||0):0,speed:t?Number(t.speed)||0:0};
}
function syncTankVisual(t){t.group.position.set(t.world.x,0,t.world.z);t.hull.rotation.y=t.hullRotation;t.turret.rotation.y=t.turretRotation;if(t.group.updateMatrixWorld)t.group.updateMatrixWorld(true);}
function tankStateSnapshot(t=G.player){
  if(!t)return null;const pose=authoritativeTankPose(t);return {playerId:t.playerId,displayName:t.displayName,position:{x:pose.x,z:pose.z},hullRotation:pose.heading,turretRotation:pose.turretHeading,hp:t.hp,maxHp:t.maxHp,activeWeapon:t.activeWeapon,fireEvent:t.fireEvent,visualUpgradeTier:t.visualUpgradeTier,damageStatistic:{match:t.damageStatistic.match,lifetime:t.damageStatistic.lifetime},hullVisualTier:t.hullVisualTier,armorTier:t.armorTier,engineTier:t.engineTier,turretTier:t.turretTier,mainWeaponId:t.mainWeaponId,specialWeaponId:t.specialWeaponId,skinId:t.skinId};
}
function interpolateRemoteTank(tank,target,dt){
  if(!tank||!target||!target.position)return;tank.world.x=lerp(tank.world.x,Number(target.position.x)||0,1-Math.pow(.002,dt));tank.world.z=lerp(tank.world.z,Number(target.position.z)||0,1-Math.pow(.002,dt));tank.hullRotation=wrapPi(rotateToward(tank.hullRotation,Number(target.hullRotation)||0,dt*5));tank.turretRotation=wrapPi(rotateToward(tank.turretRotation,Number(target.turretRotation)||0,dt*8));syncTankVisual(tank);
}
function makeEnemyFigure(color=0x695b44){
  const g=new THREE.Group(),body=sharedMesh('box',color,1.6,2,1.05);body.position.y=2;g.add(body);const head=sharedMesh('sphere',0xd0aa83,.72,.72,.72);head.position.y=3.55;g.add(head);const helmet=sharedMesh('sphere',0x4d4137,.78,.55,.78);helmet.position.y=3.85;g.add(helmet);for(const sx of [-.42,.42]){const leg=sharedMesh('box',0x383b31,.5,1.2,.55);leg.position.set(sx,.65,0);g.add(leg);}g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;
}
function makeBossTank(){const t=makeTank(0x5c5541);t.group.parent.remove(t.group);t.group.scale.set(.78,.78,.78);return t.group;}
function spawnEnemy(x,z,boss){
  if(G.enemies.length>=CFG.enemyCap&&!boss)return null;const g=boss?makeBossTank():makeEnemyFigure();g.position.set(x,0,z);g.renderOrder=5000;addToLayer(LAYER.ACTORS,g);const max=boss?CFG.bossBaseHP+G.fortressSerial*12:44+Math.min(40,G.fortressSerial*3),e={id:(boss?'boss:':'defender:')+Date.now().toString(36)+Math.random().toString(36).slice(2,5),group:g,world:{x,z},hp:max,maxHp:max,boss,fireAt:performance.now()+400+Math.random()*800,speed:boss?4.5:5.8,dead:false,radius:boss?2.1:1.0};G.enemies.push(e);if(boss&&G.fortress)G.fortress.boss=e;return e;
}

function registerFortressCollision(f){
  const id=f.ownerId,idx=f.sectorIndex,x=f.world.x,z=f.world.z;
  // Continuous proxies remove the tiny segment seams that a tank could previously penetrate at corners/endpoints.
  G.collision.registerAABB(idx,x,z-10,20.2,2.25,{ownerId:id,kind:'fortress_wall'});
  G.collision.registerAABB(idx,x-10,z,2.25,20.2,{ownerId:id,kind:'fortress_wall'});
  G.collision.registerAABB(idx,x+10,z,2.25,20.2,{ownerId:id,kind:'fortress_wall'});
  G.collision.registerAABB(idx,x-6.8,z+10,6.0,2.25,{ownerId:id,kind:'fortress_wall'});
  G.collision.registerAABB(idx,x+6.8,z+10,6.0,2.25,{ownerId:id,kind:'fortress_wall'});
  G.collision.registerAABB(idx,x,z,6.4,6.4,{ownerId:id,kind:'fortress_core'});
}
function makeFortress(sectorIndex,serial){
  const desc=sectorDescriptor(sectorIndex),side=serial%2===0?-1:1,x=side*(34+(hash32(serial)%15)),z=desc.centerZ+28,ownerId='fortress:'+serial;
  const g=new THREE.Group();g.position.set(x,0,z);addToLayer(LAYER.GAMEPLAY_PROPS,g);const sand=G.resources.material(0x756a4d,'standard');
  for(let i=-3;i<=3;i++){for(const [lx,lz] of [[i*2.7,-10],[i*2.7,10],[-10,i*2.7],[10,i*2.7]]){if(lz===10&&Math.abs(lx)<5)continue;const w=new THREE.Mesh(G.resources.geometry('box'),sand);w.scale.set(2.5,1.15,1.45);w.position.set(lx,.58,lz);w.castShadow=true;w.receiveShadow=true;g.add(w);}}
  const core=sharedMesh('box',0x575247,5.5,4.4,5.5);core.position.y=2.2;g.add(core);const tower=sharedMesh('box',0x47483f,2.8,3.4,2.8);tower.position.y=5.5;g.add(tower);const mast=sharedMesh('box',0x403b32,.14,4,.14);mast.position.set(0,8.8,0);g.add(mast);
  const f={group:g,world:{x,z},sectorIndex,serial,id:'F'+serial,ownerId,state:'dormant',core,coreHP:CFG.fortressCoreHP,maxCoreHP:CFG.fortressCoreHP,boss:null,defendersSpawned:false};registerFortressCollision(f);return f;
}
function removeFortress(){if(!G.fortress)return;G.collision.removeOwner(G.fortress.ownerId);if(G.fortress.group&&G.fortress.group.parent)G.fortress.group.parent.remove(G.fortress.group);G.fortress=null;for(const e of G.enemies){if(e.group&&e.group.parent)e.group.parent.remove(e.group);}G.enemies.length=0;}
function activateNextFortress(initial){
  const oldSector=G.fortress&&G.fortress.sectorIndex;removeFortress();
  const current=G.sectorStreamer?G.sectorStreamer.currentIndex:WorldSpace.sectorIndexAtZ(G.player?G.player.world.z:0),p=ensureProgress();let target;
  if(initial&&p&&Number.isFinite(Number(p.objectiveSectorIndex))&&Number(p.objectiveSectorIndex)>=current)target=Number(p.objectiveSectorIndex);
  else target=Math.max(current+1,Number.isFinite(oldSector)?oldSector+1:current+1);
  G.objectiveSectorIndex=target;G.sectorStreamer&&G.sectorStreamer.ensure(target);G.fortressSerial++;G.fortress=makeFortress(target,G.fortressSerial);persist();updateHud();
}
function spawnDefenders(){
  if(!G.fortress||G.fortress.defendersSpawned)return;G.fortress.defendersSpawned=true;G.fortress.state='defenders';const n=Math.min(7,CFG.defendersBase+Math.floor(G.fortress.serial/4));for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=14+(i%2)*3;spawnEnemy(G.fortress.world.x+Math.cos(a)*r,G.fortress.world.z+Math.sin(a)*r,false);}showToast('เข้าสู่เขตฐานศัตรู','ทำลายหน่วยป้องกันเพื่อเรียกบอส');updateHud();
}
function spawnBoss(){if(!G.fortress||G.fortress.boss)return;G.fortress.state='boss';spawnEnemy(G.fortress.world.x,G.fortress.world.z-7,true);showToast('BOSS: Fortress Commander','ป้อมทุกแห่งมีบอสประจำฐาน');updateHud();}

function recordDamage(sourceId,targetId,value,kind){const e={sourceId:String(sourceId||''),targetId:String(targetId||''),value:Number(value)||0,kind:String(kind||'damage'),at:Date.now()};G.damageEvents.push(e);if(G.damageEvents.length>CFG.damageEventCap)G.damageEvents.splice(0,G.damageEvents.length-CFG.damageEventCap);if(G.player&&e.sourceId===G.player.playerId)G.player.damageStatistic.match+=e.value;return e;}
function damageEnemy(e,d,projectile){if(e.dead)return;e.hp-=d;recordDamage(projectile&&projectile.ownerId||G.player.playerId,e.id,d,'projectile');burst(e.world,e.boss?0xff8a4c:0xe7c36d,e.boss?5:3);if(e.hp<=0){e.dead=true;burst(e.world,0xffa24e,e.boss?24:11);if(e.boss&&G.fortress){G.fortress.state='core';G.fortress.boss=null;showToast('บอสถูกทำลาย','Fortress Core เปิดจุดอ่อนแล้ว');}if(e.group&&e.group.parent)e.group.parent.remove(e.group);e.group=null;updateHud();}}
function damagePlayer(d,projectile){if(!G.player||G.player.invuln>0)return;G.player.hp=Math.max(0,G.player.hp-d);G.player.invuln=.55;recordDamage(projectile&&projectile.ownerId||'enemy',G.player.playerId,d,'projectile');burst(G.player.world,0xff7048,8);if(G.player.hp<=0){G.player.hp=G.player.maxHp;const idx=Math.max(0,G.sectorStreamer.currentIndex-1);if(G.tankRuntime)G.tankRuntime.teleport(0,WorldSpace.sectorCenterZ(idx),G.tankRuntime.heading);else{G.player.world.x=0;G.player.world.z=WorldSpace.sectorCenterZ(idx);G.player.speed=0;}G.sectorStreamer.update(G.player.world.z,true);showToast('ถอยกลับจุดรวมพล','ฟื้น HP แล้ว · ภารกิจยังดำเนินต่อ');}updateHud();}
function destroyCore(){const f=G.fortress;if(!f||f.state!=='core')return;f.state='destroyed';burst(f.world,0xffb351,32);showToast('FORTRESS DESTROYED','กำลังยึดตัวอักษรจากฐาน');const id=f.id;setTimeout(()=>{if(G.running)awardLetter(id);},620);updateHud();}

function cannonWorldPosition(t){if(t.group&&t.group.updateMatrixWorld)t.group.updateMatrixWorld(true);const v=new THREE.Vector3();t.cannonTip.getWorldPosition(v);return v;}
function cannonWorldRay(t){
  if(t.group&&t.group.updateMatrixWorld)t.group.updateMatrixWorld(true);const tip=new THREE.Vector3(),base=new THREE.Vector3();t.cannonTip.getWorldPosition(tip);t.barrel.getWorldPosition(base);let dx=tip.x-base.x,dz=tip.z-base.z,L=Math.hypot(dx,dz);
  if(L<1e-5){const f=forwardFromRotation(authoritativeTankPose(t).turretHeading);dx=f.x;dz=f.z;L=1;}return {origin:{x:tip.x,y:tip.y,z:tip.z},direction:{x:dx/L,z:dz/L}};
}
function cannonWorldDirection(t){return cannonWorldRay(t).direction;}
function spawnProjectile(pool,spec){const p=pool.acquire(spec);if(!p)return null;p.impactEvent='';return p;}
function firePlayer(){
  if(!G.running||!G.player)return;const now=performance.now();if(now<G.fireAt)return;G.fireAt=now+190;
  const t=G.player,ray=cannonWorldRay(t),tip=ray.origin,dir=ray.direction;G.fireEventSerial++;t.fireEvent=G.fireEventSerial;
  spawnProjectile(G.pools.playerProjectiles,{x:tip.x+dir.x*.2,z:tip.z+dir.z*.2,y:tip.y,dx:dir.x,dz:dir.z,speed:CFG.shotSpeed,damage:CFG.shotDamage,ownerId:t.playerId,weaponId:t.mainWeaponId,impactEvent:'pending',lifetime:CFG.shotLife,team:'player',collisionRadius:.22});
  burst({x:tip.x,z:tip.z},0xffdc80,3);
}
function enemyFire(e){
  if(!G.player)return;const dx=G.player.world.x-e.world.x,dz=G.player.world.z-e.world.z,L=Math.hypot(dx,dz);if(L<2)return;const ux=dx/L,uz=dz/L;
  spawnProjectile(G.pools.enemyProjectiles,{x:e.world.x+ux*1.5,z:e.world.z+uz*1.5,y:e.boss?2.3:2,dx:ux,dz:uz,speed:e.boss?25:21,damage:e.boss?18:10,ownerId:e.id,weaponId:e.boss?'boss_cannon':'defender_weapon',impactEvent:'pending',lifetime:2.4,team:'enemy',collisionRadius:.2});
}
function projectileImpact(p,kind){p.impactEvent=kind;burst(p.world,p.team==='player'?0xffbf65:0xf08b52,kind==='terrain'?2:4);}
function tickProjectilePool(pool,dt,isPlayer){
  for(const p of [...pool.active]){
    p.lifetime-=dt;if(p.lifetime<=0){pool.release(p);continue;}
    const travel=p.speed*dt,steps=Math.max(1,Math.ceil(travel/1.0));let hit=false;
    for(let i=0;i<steps&&!hit;i++){
      p.world.x+=p.direction.x*travel/steps;p.world.z+=p.direction.z*travel/steps;
      if(isPlayer){
        for(const e of G.enemies){if(e.dead||!e.group)continue;const dx=p.world.x-e.world.x,dz=p.world.z-e.world.z,rr=p.collisionRadius+e.radius;if(dx*dx+dz*dz<rr*rr){damageEnemy(e,p.damage,p);projectileImpact(p,'enemy');hit=true;break;}}
        const f=G.fortress;if(!hit&&f&&f.state==='core'){const dx=p.world.x-f.world.x,dz=p.world.z-f.world.z;if(dx*dx+dz*dz<11){f.coreHP-=p.damage;recordDamage(p.ownerId,f.id,p.damage,'fortress_core');projectileImpact(p,'fortress_core');hit=true;if(f.coreHP<=0)destroyCore();}}
      }else if(G.player){const dx=p.world.x-G.player.world.x,dz=p.world.z-G.player.world.z,rr=p.collisionRadius+G.player.radius;if(dx*dx+dz*dz<rr*rr){damagePlayer(p.damage,p);projectileImpact(p,'player');hit=true;}}
      if(!hit){const solid=G.collision.hitSolidOnly(p.world.x,p.world.z,p.collisionRadius,p.ownerId);if(solid){projectileImpact(p,'solid');hit=true;}}
    }
    if(hit){pool.release(p);continue;}p.group.position.x=p.world.x;p.group.position.z=p.world.z;
  }
}
function burst(pos,color,n){
  if(!G.pools||!G.pools.fx)return;n=G.lowFx?Math.ceil(n*.45):n;n=Math.min(n,CFG.fxCap-G.pools.fx.active.length);
  for(let i=0;i<n;i++){G.pools.fx.acquire({x:pos.x,z:pos.z,y:1.4,color,scale:.08+Math.random()*.11,v:{x:(Math.random()-.5)*8,y:2+Math.random()*6,z:(Math.random()-.5)*8},life:.35+Math.random()*.55});}
}
function tickFx(dt,now){
  if(G.pools)for(const f of [...G.pools.fx.active]){f.life-=dt;if(f.life<=0){G.pools.fx.release(f);continue;}f.v.y-=7*dt;f.mesh.position.x+=f.v.x*dt;f.mesh.position.y+=f.v.y*dt;f.mesh.position.z+=f.v.z*dt;f.mesh.material.opacity=clamp(f.life/f.maxLife,0,1);}
  if(!G.lowFx)for(const s of G.smoke){if(!s.sprite.parent)continue;s.sprite.position.y=s.baseY+Math.sin(now*.00045+s.phase)*1.3;}
}

// Three.js hull visual convention: the yellow front arrow points along local -Z.
// Rotating local -Z by Object3D.rotation.y produces (-sin(yaw), 0, -cos(yaw)).
// These functions are therefore the single coordinate convention for visual hull, collision footprint and motion.
function forwardFromRotation(rotation){return {x:-Math.sin(rotation),z:-Math.cos(rotation)};}
function rightFromRotation(rotation){return {x:Math.cos(rotation),z:-Math.sin(rotation)};}
function rotationFromForward(x,z){const L=Math.hypot(Number(x)||0,Number(z)||0);return L>1e-9?wrapPi(Math.atan2(-(Number(x)||0)/L,-(Number(z)||0)/L)):0;}
function driveDelta(rotation,speed,dt){const f=forwardFromRotation(rotation);return {x:f.x*speed*dt,z:f.z*speed*dt};}
function normalizeTankCommand(c={}){return {throttle:clamp(Number(c.throttle)||0,-1,1),steering:clamp(Number(c.steering)||0,-1,1),turretTargetHeading:Number.isFinite(Number(c.turretTargetHeading))?wrapPi(Number(c.turretTargetHeading)):null,fire:!!c.fire,source:String(c.source||'none')};}
function desktopCommandFromState(keys,pointerAim,pose,fireQueued=false){
  const throttle=(keys.has('ArrowUp')||keys.has('KeyW')?1:0)-(keys.has('ArrowDown')||keys.has('KeyS')?1:0),steering=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);let turretTargetHeading=null;
  if(pointerAim&&pose){const ax=pointerAim.x-pose.x,az=pointerAim.z-pose.z;if(ax*ax+az*az>1)turretTargetHeading=rotationFromForward(ax,az);}
  return normalizeTankCommand({throttle,steering,turretTargetHeading,fire:fireQueued||keys.has('Space')||keys.has('KeyJ'),source:'desktop'});
}
function mobileCommandFromState(joy,aim,firing,aimWorldDirection){
  const active=!!(joy&&joy.active),throttle=active&&Math.abs(joy.y)>.08?-joy.y:0,steering=active&&Math.abs(joy.x)>.08?joy.x:0,turretTargetHeading=aim&&aim.active&&aimWorldDirection?rotationFromForward(aimWorldDirection.x,aimWorldDirection.z):null;
  return normalizeTankCommand({throttle,steering,turretTargetHeading,fire:!!firing,source:'mobile'});
}
function mergeTankCommands(desktop,mobile,mobileMoveActive=false,mobileAimActive=false){
  desktop=normalizeTankCommand(desktop);mobile=normalizeTankCommand(mobile);return normalizeTankCommand({throttle:mobileMoveActive?mobile.throttle:desktop.throttle,steering:mobileMoveActive?mobile.steering:desktop.steering,turretTargetHeading:mobileAimActive&&mobile.turretTargetHeading!=null?mobile.turretTargetHeading:desktop.turretTargetHeading,fire:desktop.fire||mobile.fire,source:(mobileMoveActive||mobileAimActive||mobile.fire)?'mobile+shared':'desktop+shared'});
}
function screenAimDirection(x,y){
  if(!G.camera||!G.camera.matrixWorld)return {x,z:-y};
  if(G.camera.updateMatrixWorld)G.camera.updateMatrixWorld();const e=G.camera.matrixWorld.elements,rx=e[0],rz=e[2],ux=e[4],uz=e[6],wx=rx*x-ux*y,wz=rz*x-uz*y,L=Math.hypot(wx,wz)||1;return {x:wx/L,z:wz/L};
}
class DesktopTankInputAdapter{
  sample(runtime){const pose=runtime?runtime.pose():authoritativeTankPose(G.player),cmd=desktopCommandFromState(G.keys,G.pointerAim,pose,G.desktopFireQueued);G.desktopFireQueued=false;return cmd;}
}
class MobileTankInputAdapter{
  sample(){const aimWorld=G.aim.active&&Math.hypot(G.aim.x,G.aim.y)>.12?screenAimDirection(G.aim.x,G.aim.y):null;return mobileCommandFromState(G.joy,G.aim,G.firing,aimWorld);}
}
class UnifiedTankInputAdapter{
  constructor(){this.desktop=new DesktopTankInputAdapter();this.mobile=new MobileTankInputAdapter();}
  sample(runtime){const d=this.desktop.sample(runtime),m=this.mobile.sample(runtime);return mergeTankCommands(d,m,!!G.joy.active,!!G.aim.active);}
}
class TankRuntime{
  constructor(entity,collision,terrain){this.entity=entity;this.collision=collision;this.terrain=terrain;this.x=Number(entity.world.x)||0;this.z=Number(entity.world.z)||0;this.heading=wrapPi(Number(entity.hullRotation)||0);this.turretHeading=wrapPi(Number(entity.turretRotation)||this.heading);this.turretTargetHeading=this.turretHeading;this.speed=Number(entity.speed)||0;this.lastMotion={dx:0,dz:0,longitudinalVelocity:0,lateralVelocity:0,blocked:false,heading:this.heading};this.syncEntity();}
  pose(){return {x:this.x,z:this.z,heading:this.heading,turretHeading:this.turretHeading,speed:this.speed};}
  forward(){return forwardFromRotation(this.heading);}
  teleport(x,z,heading=this.heading){this.x=Number(x)||0;this.z=Number(z)||0;this.heading=wrapPi(Number(heading)||0);this.speed=0;this.syncEntity();}
  syncEntity(){const t=this.entity;t.world.x=this.x;t.world.z=this.z;t.speed=this.speed;t.hullRotation=this.heading;t.turretRotation=this.turretHeading;t.turretTargetRotation=this.turretTargetHeading;syncTankVisual(t);}
  step(command,dt){
    const cmd=normalizeTankCommand(command);dt=clamp(Number(dt)||0,0,.05);const maxLinear=CFG.tankForwardSpeed*dt,maxYaw=CFG.tankTurnRate*dt,steps=Math.max(1,Math.ceil(maxLinear/CFG.tankSweepMaxStep),Math.ceil(maxYaw/CFG.tankSweepMaxYaw)),h=dt/steps;let blocked=false,contact=null,totalDx=0,totalDz=0,lastStepDx=0,lastStepDz=0,lastForward=forwardFromRotation(this.heading);
    for(let i=0;i<steps;i++){
      const terrain=this.terrain.sample(this.x,this.z),maxForward=CFG.tankForwardSpeed*terrain.speed,maxReverse=CFG.tankReverseSpeed*terrain.speed,target=cmd.throttle>=0?cmd.throttle*maxForward:cmd.throttle*maxReverse,accel=Math.abs(target)>Math.abs(this.speed)?CFG.tankAcceleration:CFG.tankBrake;
      if(Math.abs(cmd.throttle)>.02)this.speed=approach(this.speed,target,accel*h);else this.speed=approach(this.speed,0,CFG.tankCoast*h);
      const speedRatio=clamp(Math.abs(this.speed)/CFG.tankForwardSpeed,0,1),turnAuthority=.52+.48*speedRatio,nextHeading=wrapPi(this.heading-cmd.steering*CFG.tankTurnRate*turnAuthority*h),d=driveDelta(nextHeading,this.speed,h),from={x:this.x,z:this.z,heading:this.heading},to={x:this.x+d.x,z:this.z+d.z,heading:nextHeading},fp=this.entity.footprint||{halfWidth:CFG.tankFootprintHalfWidth,halfLength:CFG.tankFootprintHalfLength},moved=this.collision.resolveTankSweep(from,to,fp.halfWidth,fp.halfLength,this.entity.ownerId||'');
      lastStepDx=moved.x-this.x;lastStepDz=moved.z-this.z;totalDx+=lastStepDx;totalDz+=lastStepDz;this.x=moved.x;this.z=moved.z;this.heading=moved.heading;lastForward=forwardFromRotation(this.heading);if(moved.blocked){blocked=true;contact=moved.contact;this.speed=0;break;}
    }
    const edge=CFG.sectorWidth*.5-(this.entity.footprint?this.entity.footprint.halfWidth:CFG.tankFootprintHalfWidth)-1;if(Math.abs(this.x)>edge){this.x=clamp(this.x,-edge,edge);this.speed=0;blocked=true;}
    if(cmd.turretTargetHeading!=null)this.turretTargetHeading=cmd.turretTargetHeading;this.turretHeading=wrapPi(rotateToward(this.turretHeading,this.turretTargetHeading,CFG.turretTurnRate*dt));
    const right=rightFromRotation(this.heading),vx=h>0?lastStepDx/h:0,vz=h>0?lastStepDz/h:0;this.lastMotion={dx:totalDx,dz:totalDz,longitudinalVelocity:vx*lastForward.x+vz*lastForward.z,lateralVelocity:vx*right.x+vz*right.z,blocked,contact,heading:this.heading};this.syncEntity();return {command:cmd,fire:cmd.fire,motion:this.lastMotion,pose:this.pose()};
  }
}
function tickTank(dt){
  const t=G.player;if(!t||!G.tankRuntime)return;const cmd=(G.inputAdapter||(G.inputAdapter=new UnifiedTankInputAdapter())).sample(G.tankRuntime),result=G.tankRuntime.step(cmd,dt);t.invuln=Math.max(0,t.invuln-dt);t.group.visible=t.invuln<=0||Math.floor(t.invuln*18)%2===0;G.sectorStreamer.update(t.world.z,false);if(result.fire)firePlayer();
}
function tickFortress(){
  const f=G.fortress;if(!f||!G.player)return;const active=G.sectorStreamer.isActive(f.sectorIndex);f.group.visible=active;if(!active)return;const pd=Math.hypot(G.player.world.x-f.world.x,G.player.world.z-f.world.z);if(f.state==='dormant'&&pd<CFG.fortressTrigger)spawnDefenders();if(f.state==='defenders'){const live=G.enemies.some(e=>!e.dead&&!e.boss);if(f.defendersSpawned&&!live)spawnBoss();}
}
function tickEnemies(dt,now){
  for(const e of G.enemies){if(e.dead||!e.group)continue;const entitySector=WorldSpace.sectorIndexAtZ(e.world.z),sectorActive=G.sectorStreamer.isActive(entitySector);e.group.visible=sectorActive;if(!sectorActive)continue;const dx=G.player.world.x-e.world.x,dz=G.player.world.z-e.world.z,L=Math.hypot(dx,dz);if(L>(e.boss?9:7)&&L<55){const ux=dx/L,uz=dz/L,res=G.collision.resolveCircleMove(e.world,{x:e.world.x+ux*e.speed*dt,z:e.world.z+uz*e.speed*dt},e.radius);e.world.x=res.x;e.world.z=res.z;e.group.position.set(e.world.x,0,e.world.z);e.group.rotation.y=Math.atan2(ux,uz)+Math.PI;}if(now>e.fireAt&&L<36){enemyFire(e);e.fireAt=now+(e.boss?760:1180)+Math.random()*700;}}
  G.enemies=G.enemies.filter(e=>!e.dead&&e.group);
}

function cameraTick(dt){
  if(!G.player)return;const p=G.player.world,target=new THREE.Vector3(p.x+CFG.cameraOffsetX,CFG.cameraHeight,p.z+CFG.cameraOffsetZ);G.camera.position.lerp(target,1-Math.pow(.003,dt));G.camera.lookAt(p.x,0,p.z);
  if(G.sun&&G.sunTarget){G.sun.position.set(p.x-55,78,p.z+40);G.sunTarget.position.set(p.x,0,p.z);G.sun.target=G.sunTarget;}
}
function updateObjective(){if(!G.fortress||!G.player)return;const a=G.player.world,b=G.fortress.world,dx=b.x-a.x,dz=b.z-a.z,ang=Math.atan2(dx,-dz)*180/Math.PI,meters=Math.round(Math.hypot(dx,dz)*4);const ar=$('#fl44-arrow');if(ar)ar.style.transform='rotate('+ang+'deg)';const ds=$('#fl44-distance');if(ds)ds.textContent=meters+' m';}
function fortressStateText(){const f=G.fortress;if(!f)return 'กำลังค้นหาเป้าหมาย';return ({dormant:'เดินทางไปยังฐานเป้าหมาย',defenders:'ทำลายหน่วยป้องกัน',boss:'กำจัดบอสประจำฐาน',core:'บอสพ่ายแล้ว · ทำลาย Fortress Core',destroyed:'ฐานถูกทำลาย · รับตัวอักษร'})[f.state]||f.state;}
function updateHud(){
  if(!G.root)return;const hp=G.player?G.player.hp:CFG.playerHP,$hp=$('#fl44-hp');if($hp)$hp.style.width=(hp/CFG.playerHP*100)+'%';const ht=$('#fl44-hptext');if(ht)ht.textContent=Math.ceil(hp)+'/'+CFG.playerHP;
  const w=$('#fl44-word');if(w)w.textContent=G.word?G.word.en:'—';const slots=$('#fl44-slots');if(slots){slots.innerHTML='';if(G.word)for(let i=0;i<G.word.en.length;i++){const s=document.createElement('i');s.className='fl44-slot'+(i<G.pos?' done':'');s.textContent=i<G.pos?G.word.en[i]:'_';slots.appendChild(s);}}
  const c=$('#fl44-coins');if(c)c.textContent=window.state?Number(state.coins||0).toLocaleString():'0';const gr=$('#fl44-grade');if(gr)gr.textContent=(window.state&&state.student&&state.student.grade)||'';
  const st=$('#fl44-state');if(st)st.textContent=fortressStateText();const b=$('#fl44-boss'),be=G.fortress&&G.fortress.boss;if(b)b.classList.toggle('on',!!be);if(be){$('#fl44-bossname').textContent='FORTRESS COMMANDER · ฐาน '+G.fortress.serial;$('#fl44-bosshp').style.width=clamp(be.hp/be.maxHp*100,0,100)+'%';}
  const ob=$('#fl44-objective');if(ob)ob.textContent=G.fortress?'Fortress '+G.fortress.serial:'ค้นหาฐานศัตรู';
  const terrain=$('#fl44-terrain');if(terrain&&G.player){const t=G.terrain.sample(G.player.world.x,G.player.world.z);terrain.textContent=t.id+' · ×'+t.speed.toFixed(2);}
  const sec=$('#fl44-sector');if(sec&&G.sectorStreamer){const idx=G.sectorStreamer.currentIndex,vid=G.sectorStreamer.visualId(idx);sec.textContent='Sector '+idx+' · '+SECTOR_TEMPLATES[vid].label;}
  const input=$('#fl44-input');if(input){const j=G.joy,a=G.aim,mode=('PointerEvent' in window)?'PTR/WIN':'TOUCH/WIN';if(j.active)input.textContent='D T'+(-j.y).toFixed(2)+' S'+j.x.toFixed(2)+' · '+String(j.transport||mode).toUpperCase();else if(a.active)input.textContent='A '+a.x.toFixed(2)+'/'+(-a.y).toFixed(2)+' · '+String(a.transport||mode).toUpperCase();else input.textContent='DRIVE READY · '+mode;}
}

function inputNow(){return typeof performance!=='undefined'&&performance&&typeof performance.now==='function'?performance.now():Date.now();}
function consumeControlEvent(e){if(!e)return;if(e.cancelable!==false&&typeof e.preventDefault==='function')e.preventDefault();if(typeof e.stopPropagation==='function')e.stopPropagation();}
function stickVectorFromRect(rect,clientX,clientY){
  const w=Math.max(1,Number(rect&&rect.width)||1),h=Math.max(1,Number(rect&&rect.height)||1),cx=(Number(rect&&rect.left)||0)+w/2,cy=(Number(rect&&rect.top)||0)+h/2,m=Math.max(1,Math.min(w,h)*.36);let dx=(Number(clientX)||0)-cx,dy=(Number(clientY)||0)-cy;const L=Math.hypot(dx,dy)||1,k=Math.min(1,m/L);dx*=k;dy*=k;return {x:dx/m,y:dy/m,dx,dy};
}
function resetStickState(target,knob){
  target.lastTransport=target.transport&&target.transport!=='idle'?target.transport:(target.lastTransport||'none');target.id=null;target.x=0;target.y=0;target.active=false;target.transport='idle';target.captured=false;if(knob)knob.style.transform='translate(0,0)';
}
function bindStickElement(stick,knob,target,role='drive'){
  if(!stick||!knob||!target)return;stick.style.touchAction='none';stick.style.overscrollBehavior='contain';
  const apply=(clientX,clientY,transport)=>{const v=stickVectorFromRect(stick.getBoundingClientRect(),clientX,clientY);target.x=v.x;target.y=v.y;target.active=true;target.transport=transport;target.lastTransport=transport;target.lastEventAt=inputNow();target.moves=(Number(target.moves)||0)+1;G.lastControlInputAt=target.lastEventAt;knob.style.transform='translate('+v.dx+'px,'+v.dy+'px)';return v;};
  const reset=()=>resetStickState(target,knob);
  if('PointerEvent' in window){
    const down=e=>{if(target.active&&e.pointerId!==target.id)return;target.id=e.pointerId;target.captured=false;apply(e.clientX,e.clientY,'pointer/window');try{if(stick.setPointerCapture){stick.setPointerCapture(e.pointerId);target.captured=typeof stick.hasPointerCapture==='function'?!!stick.hasPointerCapture(e.pointerId):true;}}catch(_){target.captured=false;}consumeControlEvent(e);};
    const move=e=>{if(!target.active||e.pointerId!==target.id)return;apply(e.clientX,e.clientY,'pointer/window');consumeControlEvent(e);};
    const end=e=>{if(!target.active||e.pointerId!==target.id)return;try{if(target.captured&&stick.releasePointerCapture)stick.releasePointerCapture(e.pointerId);}catch(_){}reset();consumeControlEvent(e);};
    listen(stick,'pointerdown',down,{passive:false});
    // Authoritative drag tracking lives on window capture, not on the stick. DRIVE/AIM stay alive if mobile pointer capture is rejected or lost.
    listen(window,'pointermove',move,{passive:false,capture:true});listen(window,'pointerup',end,{passive:false,capture:true});listen(window,'pointercancel',end,{passive:false,capture:true});
    listen(stick,'lostpointercapture',e=>{if(target.active&&e.pointerId===target.id){target.captured=false;target.lastEventAt=inputNow();target.lastTransport='pointer/window';}});
  }else{
    const findTouch=e=>{const all=[...(e.touches||[]),...(e.changedTouches||[])];return all.find(t=>t.identifier===target.id)||null;};
    const down=e=>{if(target.active)return;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;target.id=t.identifier;apply(t.clientX,t.clientY,'touch/window');consumeControlEvent(e);};
    const move=e=>{if(!target.active)return;const t=findTouch(e);if(!t)return;apply(t.clientX,t.clientY,'touch/window');consumeControlEvent(e);};
    const end=e=>{if(!target.active)return;const t=[...(e.changedTouches||[])].find(q=>q.identifier===target.id);if(!t)return;reset();consumeControlEvent(e);};
    listen(stick,'touchstart',down,{passive:false});listen(window,'touchmove',move,{passive:false,capture:true});listen(window,'touchend',end,{passive:false,capture:true});listen(window,'touchcancel',end,{passive:false,capture:true});
  }
  target.role=role;return {reset};
}
function bindStick(stickSel,knobSel,target,isAim){const stick=$(stickSel),knob=$(knobSel);return bindStickElement(stick,knob,target,isAim?'aim':'drive');}
function bindPressControl(el,onDown,onUp){
  if(!el)return;el.style.touchAction='none';let activeId=null;const reset=()=>{if(activeId!=null)activeId=null;onUp();};
  if('PointerEvent' in window){
    const down=e=>{if(activeId!=null&&activeId!==e.pointerId)return;activeId=e.pointerId;onDown();G.lastControlInputAt=inputNow();try{if(el.setPointerCapture)el.setPointerCapture(e.pointerId);}catch(_){}consumeControlEvent(e);},up=e=>{if(activeId==null||e.pointerId!==activeId)return;activeId=null;onUp();consumeControlEvent(e);};
    listen(el,'pointerdown',down,{passive:false});listen(window,'pointerup',up,{passive:false,capture:true});listen(window,'pointercancel',up,{passive:false,capture:true});listen(el,'lostpointercapture',()=>{});
  }else{
    const down=e=>{if(activeId!=null)return;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;activeId=t.identifier;onDown();G.lastControlInputAt=inputNow();consumeControlEvent(e);},up=e=>{if(activeId==null)return;const t=[...(e.changedTouches||[])].find(q=>q.identifier===activeId);if(!t)return;activeId=null;onUp();consumeControlEvent(e);};
    listen(el,'touchstart',down,{passive:false});listen(window,'touchend',up,{passive:false,capture:true});listen(window,'touchcancel',up,{passive:false,capture:true});
  }
  return {reset};
}
function bindControls(){
  G.inputAdapter=new UnifiedTankInputAdapter();const down=e=>{G.keys.add(e.code);G.lastControlInputAt=inputNow();if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();},up=e=>G.keys.delete(e.code);listen(window,'keydown',down,{passive:false});listen(window,'keyup',up);
  bindStick('#fl44-stick','.fl44-knob',G.joy,false);bindStick('#fl44-aim-stick','.fl44-aim-knob',G.aim,true);
  const fire=$('#fl44-fire'),fireBinding=bindPressControl(fire,()=>{G.firing=true;fire.classList.add('on');},()=>{G.firing=false;fire.classList.remove('on');});
  listen(G.root,'contextmenu',e=>e.preventDefault(),{passive:false});
  const reset=()=>{G.keys.clear();G.desktopFireQueued=false;resetStickState(G.joy,$('.fl44-knob'));resetStickState(G.aim,$('.fl44-aim-knob'));if(fireBinding)fireBinding.reset();else{G.firing=false;if(fire)fire.classList.remove('on');}};listen(window,'blur',reset);listen(document,'visibilitychange',()=>{if(document.hidden)reset();});
}
function pointerToGround(e){if(!G.camera||!G.canvas||!G.raycaster)return null;const r=G.canvas.getBoundingClientRect(),x=((e.clientX-r.left)/r.width)*2-1,y=-((e.clientY-r.top)/r.height)*2+1;G.raycaster.setFromCamera({x,y},G.camera);const hit=new THREE.Vector3();return G.raycaster.ray.intersectPlane(G.groundPlane,hit)?{x:hit.x,z:hit.z}:null;}
function bindCanvasAim(){
  if(!G.canvas)return;listen(G.canvas,'pointermove',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen'){const p=pointerToGround(e);if(p)G.pointerAim=p;}});listen(G.canvas,'pointerleave',e=>{if(e.pointerType==='mouse')G.pointerAim=null;});listen(G.canvas,'pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){const p=pointerToGround(e);if(p)G.pointerAim=p;G.desktopFireQueued=true;G.lastControlInputAt=performance.now();}});
}

function resize(){if(!G.renderer||!G.camera)return;const w=innerWidth,h=innerHeight,aspect=w/Math.max(1,h),vw=CFG.viewW,vh=vw/aspect;G.camera.left=-vw/2;G.camera.right=vw/2;G.camera.top=vh/2;G.camera.bottom=-vh/2;G.camera.updateProjectionMatrix();G.renderer.setSize(w,h,false);}
function buildLayers(){for(const [name,i] of Object.entries(LAYER)){const g=new THREE.Group();g.name='FrontlineLayer_'+name;g.renderOrder=i*1000;G.scene.add(g);G.layers[i]=g;}}
function buildWorld(){
  G.scene=new THREE.Scene();G.scene.background=new THREE.Color(0x8f9c88);G.scene.fog=new THREE.FogExp2(0xa5aa97,.0045);buildLayers();
  const amb=new THREE.HemisphereLight(0xdde3cf,0x4a4638,1.32);G.scene.add(amb);G.sun=new THREE.DirectionalLight(0xffedc7,1.42);G.sun.position.set(-55,78,40);G.sun.castShadow=!G.lowFx;G.sun.shadow.mapSize.set(G.lowFx?512:1024,G.lowFx?512:1024);G.sun.shadow.camera.left=-70;G.sun.shadow.camera.right=70;G.sun.shadow.camera.top=70;G.sun.shadow.camera.bottom=-70;G.sun.shadow.camera.far=180;G.sunTarget=new THREE.Object3D();G.scene.add(G.sunTarget);G.sun.target=G.sunTarget;G.scene.add(G.sun);
  G.terrain=new TerrainSystem();G.collision=new CollisionSystem(G.terrain);G.sectorStreamer=new SectorStreamer();initPools();makePlayer();G.sectorStreamer.currentIndex=WorldSpace.sectorIndexAtZ(G.player.world.z);G.sectorStreamer.update(G.player.world.z,true);activateNextFortress(true);
}
function initThree(){
  G.canvas=document.createElement('canvas');G.root.insertBefore(G.canvas,G.root.firstChild);G.renderer=new THREE.WebGLRenderer({canvas:G.canvas,antialias:!(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4),alpha:false,powerPreference:'high-performance'});G.renderer.setPixelRatio(Math.min(devicePixelRatio||1,CFG.dpr));G.renderer.shadowMap.enabled=!G.lowFx;G.renderer.shadowMap.type=THREE.PCFSoftShadowMap;if('outputEncoding' in G.renderer&&THREE.sRGBEncoding)G.renderer.outputEncoding=THREE.sRGBEncoding;G.camera=new THREE.OrthographicCamera(-CFG.viewW/2,CFG.viewW/2,CFG.viewW/3,-CFG.viewW/3,.1,420);G.camera.position.set(CFG.cameraOffsetX,CFG.cameraHeight,CFG.cameraOffsetZ);G.camera.lookAt(0,0,0);G.resources=new ResourceCache();G.raycaster=new THREE.Raycaster();G.groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);resize();listen(window,'resize',resize);listen(window,'orientationchange',()=>setTimeout(resize,120));buildWorld();bindCanvasAim();
}
function loop(now){
  if(!G.running)return;const dt=Math.min(.034,G.last?(now-G.last)/1000:.016);G.last=now;tickTank(dt);tickFortress();tickEnemies(dt,now);tickProjectilePool(G.pools.playerProjectiles,dt,true);tickProjectilePool(G.pools.enemyProjectiles,dt,false);tickFx(dt,now);cameraTick(dt);updateOcclusionOrder();updateObjective();if((now|0)%220<34)updateHud();G.renderer.render(G.scene,G.camera);G.raf=requestAnimationFrame(loop);
}

function clearScene(){
  removeFortress();if(G.sectorStreamer)G.sectorStreamer.dispose();disposePools();G.occluders.length=0;G.smoke.length=0;if(G.player&&G.player.group&&G.player.group.parent)G.player.group.parent.remove(G.player.group);G.player=null;G.tankRuntime=null;if(_smokeTexture){_smokeTexture.dispose&&_smokeTexture.dispose();_smokeTexture=null;}if(G.resources){G.resources.dispose();G.resources=null;}
}
async function open(){
  if(!adminAllowed()){lockNotice();return false;}if(G.running||G.starting)return true;G.starting=true;G.progressHydrated=false;makeDom();
  try{await loadThree();ensureProgress();G.lowFx=!!(window.state&&state.noAnim)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);auditVocabulary();if(!chooseWord(false))throw new Error('Vocabulary source unavailable');initThree();G.running=true;G.last=0;const l=$('.fl44-loading');if(l)l.remove();if(typeof Music!=='undefined'&&Music.suspendBg)Music.suspendBg();G.raf=requestAnimationFrame(loop);showToast('Phase 1.2.3 Runtime '+CFG.runtimeVersion,'Mobile DRIVE/AIM hardened · Desktop canonical controller locked');return true;}
  catch(e){console.error('[Frontline1944]',e);const l=$('.fl44-loading');if(l)l.innerHTML='<div><b>เปิด Frontline ไม่สำเร็จ</b><small>'+String(e&&e.message||e)+'</small></div>';setTimeout(close,2200);return false;}
  finally{G.starting=false;}
}
function close(){
  if(!G.root&&!G.running)return;G.running=false;releaseTankRuntimeOwnership();G.starting=false;cancelAnimationFrame(G.raf);G.raf=0;clearTimeout(G.toastTimer);G.listeners.splice(0).forEach(f=>{try{f();}catch(e){}});G.keys.clear();try{persist();}catch(e){};try{if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();}catch(e){};try{clearScene();}catch(e){console.warn('[Frontline1944] cleanup',e);}if(G.renderer){G.renderer.dispose();G.renderer.forceContextLoss&&G.renderer.forceContextLoss();}if(G.root)G.root.remove();if(typeof Music!=='undefined'&&Music.resumeBg)Music.resumeBg();Object.assign(G,{root:null,canvas:null,renderer:null,scene:null,camera:null,layers:{},sectorStreamer:null,collision:null,terrain:null,pools:null,fortress:null,enemies:[],player:null,tankRuntime:null,inputAdapter:null,last:0,firing:false,desktopFireQueued:false,pointerAim:null,raycaster:null,groundPlane:null,sun:null,sunTarget:null,progressHydrated:false});syncAdminEntry();if(typeof renderDashboard==='function')try{renderDashboard();}catch(e){}
}
function routeCheck(){syncAdminEntry();let requested=window.__VW_FRONTLINE1944_ROUTE__===true;try{requested=requested||new URLSearchParams(location.search).get('go')==='frontline1944';}catch(e){}if(!requested)return;if(adminAllowed()){if(!G.routeTried){G.routeTried=true;open();}}else if(!G.routeDenied){G.routeDenied=true;lockNotice();}}

function occlusionAcceptance(){const tree=G.occluders.find(x=>x.userData&&x.userData.occluder);return {pass:!!(tree&&tree.userData.depthAnchor&&tree.userData.depthAnchor.foreground&&G.player&&G.player.group.renderOrder<tree.renderOrder),playerOrder:G.player&&G.player.group.renderOrder,canopyOrder:tree&&tree.renderOrder,foreground:!!(tree&&tree.userData&&tree.userData.depthAnchor&&tree.userData.depthAnchor.foreground)};}
function foundationDiagnostics(){return {runtimeVersion:CFG.runtimeVersion,runtimeIdentity:runtimeIdentity(),sectorStreamer:G.sectorStreamer&&G.sectorStreamer.stats(),terrain:G.terrain&&G.terrain.stats(),collision:G.collision&&G.collision.stats(),pools:G.pools&&Object.fromEntries(Object.entries(G.pools).map(([k,p])=>[k,p.stats()])),tank:tankStateSnapshot(),tankMotion:G.tankRuntime&&G.tankRuntime.lastMotion,controls:{lastInputAt:G.lastControlInputAt,pointerEvents:('PointerEvent' in window),sharedRuntime:!!G.inputAdapter,drive:{x:G.joy.x,y:G.joy.y,active:G.joy.active,id:G.joy.id,transport:G.joy.transport,lastTransport:G.joy.lastTransport,captured:G.joy.captured,moves:G.joy.moves,lastEventAt:G.joy.lastEventAt},aim:{x:G.aim.x,y:G.aim.y,active:G.aim.active,id:G.aim.id,transport:G.aim.transport,lastTransport:G.aim.lastTransport,captured:G.aim.captured,moves:G.aim.moves,lastEventAt:G.aim.lastEventAt}},occlusion:occlusionAcceptance(),damageEvents:G.damageEvents.length,visualSectorCount:SECTOR_TEMPLATES.length};}

window.Frontline1944={VERSION:CFG.runtimeVersion,open,close,auditVocabulary,adminAllowed,_t:{CFG,G,TERRAIN,LAYER,SECTOR_TEMPLATES,WorldSpace,TerrainSystem,CollisionSystem,SectorStreamer,ObjectPool,TankRuntime,DesktopTankInputAdapter,MobileTankInputAdapter,UnifiedTankInputAdapter,visualIdFor,sectorDescriptor,chooseWord,awardLetter,activateNextFortress,tankStateSnapshot,interpolateRemoteTank,authoritativeTankPose,forwardFromRotation,rightFromRotation,rotationFromForward,driveDelta,normalizeTankCommand,desktopCommandFromState,mobileCommandFromState,mergeTankCommands,stickVectorFromRect,resetStickState,bindStickElement,cannonWorldPosition,cannonWorldDirection,cannonWorldRay,runtimeIdentity,occlusionAcceptance,foundationDiagnostics,updateHud}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',routeCheck,{once:true});else routeCheck();
let polls=0;const poll=setInterval(()=>{syncAdminEntry();routeCheck();if(++polls>90||document.getElementById('btn-rail-frontline1944')&&!document.getElementById('btn-rail-frontline1944').hidden)clearInterval(poll);},500);
})();
