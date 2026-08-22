'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const src=fs.readFileSync('js/f1_3d.js','utf8');

function fn(name){
  const start=src.indexOf(`function ${name}(`);assert.ok(start>=0,`${name} missing`);
  const brace=src.indexOf('{',start);let depth=0;
  for(let i=brace;i<src.length;i++){if(src[i]==='{')depth++;else if(src[i]==='}'&&--depth===0)return src.slice(start,i+1);}
  throw new Error(`unclosed ${name}`);
}

assert.match(src,/const RAMP_ROLL_MAX\s*=\s*\.28/,'anti-roll cap must remain 16 degrees');
assert.match(src,/bodyRoll=lerp\(bodyRoll,terrainRoll,[^\n]*RAMP_ROLL_RETURN/,'body must spring back upright instead of flipping');
assert.match(src,/carGrp\.rotation\.z=lerp\([^\n]*bodyRoll\+steer/,'terrain roll must visibly tilt the player car');
assert.match(src,/av:Math\.round\(bodyRoll\*1000\)\/1000/,'roll must use the NetRoom-supported av hot field');
assert.match(src,/p\.grp\.rotation\.z=p\.rollCur/,'remote cars must reproduce the same ramp tilt');
assert.match(src,/camera\.rotateZ\(bodyRoll\*\.52\)/,'cockpit must feel a restrained version of the suspension tilt');

const LINE={n:100,x:[],z:[],nx:[],nz:[],cum:[]};
for(let i=0;i<LINE.n;i++){LINE.x.push(0);LINE.z.push(i*5);LINE.nx.push(1);LINE.nz.push(0);LINE.cum.push(i*5);}
const jump={startIdx:0,lat:0,entryM:5,riseM:20,takeoffD:25,landStartD:50,landM:20,landEndD:70,endD:76,recoverD:82,height:3,landH:2};
const ctx={Math,LINE,JUMPS:[jump],TOTAL:500,RAMP_ROLL_TRACK:1.68,RAMP_ROLL_MAX:.28,RAMP_ROLL_EDGE:.34,
  clamp:(v,a,b)=>v<a?a:(v>b?b:v),lerp:(a,b,t)=>a+(b-a)*t,nearIdx:()=>4};
vm.createContext(ctx);
for(const name of ['jumpDeltaD','jumpHalfAtD','jumpPhaseAtD','jumpHeightAtD','jumpWheelGround','jumpTerrainRoll'])
  vm.runInContext(`${fn(name)};this.${name}=${name}`,ctx);

assert.ok(Math.abs(ctx.jumpTerrainRoll(0,20,4))<1e-9,'both wheels on the ramp must keep the car level');
const edgeRoll=ctx.jumpTerrainRoll(3.15,20,4);
assert.ok(Math.abs(edgeRoll)>.08,'straddling the ramp edge must visibly lift one side');
assert.ok(Math.abs(edgeRoll)<=.28,'edge roll must never exceed the anti-flip cap');
assert.strictEqual(ctx.jumpTerrainRoll(6,20,4),0,'both wheels outside the ramp must return upright');

console.log('PASS F1 ramp-edge wheel lift, anti-roll cap, spring return and multiplayer roll');
