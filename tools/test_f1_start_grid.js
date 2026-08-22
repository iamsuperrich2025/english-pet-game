'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');

const src=fs.readFileSync('js/f1_3d.js','utf8');
const netroom=fs.readFileSync('js/netroom.js','utf8');

assert.match(src,/const GRID_FRONT_M\s*=\s*18/,'The first grid car must sit safely behind the S/F line');
assert.match(src,/const GRID_GAP_M\s*=\s*18/,'Grid positions must leave a visibly wide 18 metre gap');
assert.match(src,/const GRID_SIDE_M\s*=\s*3\.2/,'Grid cars must alternate across two separated lanes');
assert.match(src,/const GRID_SAFE_M\s*=\s*15/,'Legacy clients must retain a 15 metre exclusion radius');
assert.doesNotMatch(src,/Math\.floor\(Math\.random\(\)\*GRID_N\)/,
  'Starting slots must never be random because random players can overlap');
assert.match(src,/function startGridUids\(\)[\s\S]*Object\.keys\(peers\)[\s\S]*\.sort\(\)/,
  'Every client must derive the same ordered multiplayer roster');
assert.match(src,/function resolvePeerCars\(dt\)\{\s*if\(gridFormationActive\(\)\)return false/,
  'Collision impulses must stay disabled while the start grid is settling');
assert.match(src,/if\(!gridFormationActive\(\)&&\(missedJump\|\|/,
  'The portal must not trigger while multiplayer cars are settling on the grid');
assert.match(src,/else payload\.c=F1_GRID_WIRE\+gridSlot/,
  'Each client must report its reserved grid slot through the backward-compatible chat field');
assert.doesNotMatch(src,/hp:F1_GRID_WIRE\+gridSlot/,
  'Grid packets must not overload the friend-seat hp field');
assert.match(src,/settleStartGrid\(false\);[\s\S]*function showPeerBubble/,
  'A newly received peer must immediately trigger deterministic grid settlement');

function functionSource(name){
  const start=src.indexOf(`function ${name}(`);
  assert.ok(start>=0,`${name} must exist`);
  const brace=src.indexOf('{',start);let depth=0;
  for(let i=brace;i<src.length;i++){
    if(src[i]==='{')depth++;
    else if(src[i]==='}'&&--depth===0)return src.slice(start,i+1);
  }
  throw new Error(`Unclosed ${name}`);
}

/* Exercise the real positioning function on a straight 5 m sampled line. */
const n=200,LINE={n,x:[],z:[],tx:[],tz:[]};
for(let i=0;i<n;i++){LINE.x.push(0);LINE.z.push(i*5);LINE.tx.push(0);LINE.tz.push(1);}
const poseCtx={LINE,sfIdx:100,GRID_N:20,GRID_FRONT_M:18,GRID_GAP_M:18,GRID_SIDE_M:3.2,SAMPLE_M:5,
  clamp:(v,a,b)=>v<a?a:(v>b?b:v),lerp:(a,b,t)=>a+(b-a)*t,Math};
vm.createContext(poseCtx);
vm.runInContext(`${functionSource('gridPose')};this.gridPose=gridPose`,poseCtx);
const poses=Array.from({length:10},(_,i)=>poseCtx.gridPose(i));
for(let i=0;i<poses.length;i++){
  assert.strictEqual(poses[i].back,18+i*18,`slot ${i} must be at its exact staggered distance`);
  assert.strictEqual(poses[i].side,(i%2?1:-1)*3.2,`slot ${i} must alternate left/right`);
  if(i){
    assert.ok(Math.abs((poses[i-1].z-poses[i].z)-18)<1e-9,`slots ${i-1}/${i} need 18 m longitudinal clearance`);
    const dist=Math.hypot(poses[i].x-poses[i-1].x,poses[i].z-poses[i-1].z);
    assert.ok(dist>15,`adjacent slots ${i-1}/${i} must be visibly farther apart than the F1 footprint`);
  }
}
for(let i=0;i<poses.length;i++)for(let j=i+1;j<poses.length;j++){
  const longitudinal=Math.abs(poses[i].z-poses[j].z),lateral=Math.abs(poses[i].x-poses[j].x);
  assert.ok(longitudinal>=5.85||lateral>=2.4,`grid slots ${i}/${j} must not overlap the compound car footprint`);
}

const slotCtx={GRID_N:20,clamp:(v,a,b)=>v<a?a:(v>b?b:v)};
vm.createContext(slotCtx);
vm.runInContext(`${functionSource('startGridSlotFor')};this.startGridSlotFor=startGridSlotFor`,slotCtx);
const uids=['driver-z','driver-a','driver-m','driver-c'];
const expected=uids.slice().sort();
for(let i=0;i<expected.length;i++)assert.strictEqual(slotCtx.startGridSlotFor(expected[i],uids),i,
  'All clients must map a UID to the same unique dense slot regardless of arrival order');

/* Prove c survives the actual NetRoom cold packet and remains harmless without ct. */
const netCtx={console,performance:{now:()=>0},setTimeout,clearTimeout,document:{getElementById:()=>null}};
netCtx.window=netCtx;vm.runInNewContext(netroom,netCtx,{filename:'js/netroom.js'});
const split=netCtx.NetRoom._split({n:'driver',x:1,z:2,c:'F1G:7'});
assert.strictEqual(split.cold.c,'F1G:7','grid reservation must enter the sharded cold packet');
assert.strictEqual(netCtx.NetRoom._merge(split.hot,split.cold).c,'F1G:7','grid reservation must survive NetRoom merge');

/* A stale/old client without a slot marker occupying our desired pose must push us farther back. */
const safeCtx={...poseCtx,GRID_SAFE_M:15,peers:{legacy:{gridSlot:null,tgt:{x:poses[0].x,z:poses[0].z}}}};
vm.createContext(safeCtx);
vm.runInContext(`${functionSource('gridSlotClear')};${functionSource('safeStartGridSlot')};this.gridSlotClear=gridSlotClear;this.safeStartGridSlot=safeStartGridSlot`,safeCtx);
assert.strictEqual(safeCtx.gridSlotClear(0),false,'an unmarked legacy car must reserve the real space it occupies');
const fallback=safeCtx.safeStartGridSlot(0);
assert.strictEqual(fallback,1,'the next widely separated slot should be selected');
assert.ok(Math.hypot(poses[fallback].x-poses[0].x,poses[fallback].z-poses[0].z)>=15,
  'legacy fallback must maintain the full safety radius');

const packetCtx={GRID_N:20,F1_GRID_WIRE:'F1G:'};
vm.createContext(packetCtx);
vm.runInContext(`${functionSource('packetGridSlot')};this.packetGridSlot=packetGridSlot`,packetCtx);
assert.strictEqual(packetCtx.packetGridSlot({c:'F1G:7'}),7,'c marker must decode the selected slot');
assert.strictEqual(packetCtx.packetGridSlot({c:'hello',ct:123}),null,'normal chat must never be mistaken for a grid slot');

console.log('PASS F1 deterministic 18 m grid plus 15 m legacy-client exclusion');
