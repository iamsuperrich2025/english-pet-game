import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({window:{},Math});
for(const name of ['config','scene'])vm.runInContext(readFileSync(new URL('./frontline-'+name+'.js',import.meta.url),'utf8'),context);
const F=context.window.Frontline,player=()=>({id:'player',slot:0,x:0,z:0,hull:0,turret:0,hp:5000,bumpSeq:0});
test('ordinary forward/reverse turns track immediately at 30/60/120 Hz without changing gameplay pose',()=>{
 for(const hz of [30,60,120])for(const auto of [-1,1]){
  const local=player(),sample=F.makeRenderPose();sample(local,1/hz);
  for(let i=0;i<hz*2;i++){
   local.hull+=1.7/hz;local.x+=Math.sin(local.hull)*7.5*auto/hz;local.z-=Math.cos(local.hull)*7.5*auto/hz;
   const before=JSON.stringify(local),view=sample(local,1/hz);
   assert.equal(view.x,local.x);assert.equal(view.z,local.z);assert.equal(JSON.stringify(local),before);
  }
 }
});
test('a server position correction is continuous and settles equally across refresh rates',()=>{
 const errors=[];
 for(const hz of [30,60,120]){
  const local=player(),sample=F.makeRenderPose();sample(local,1/hz);local.x=3;
  let previous=0;
  for(let i=0;i<hz;i++){const view=sample(local,1/hz);assert.ok(view.x>=previous&&view.x<=3);if(i===0)assert.ok(view.x<.75);previous=view.x;}
  errors.push(3-previous);assert.ok(3-previous<.001);assert.equal(local.x,3);
 }
 assert.ok(Math.max(...errors)-Math.min(...errors)<1e-9);
});
test('small bump revisions blend and repeated corrections remain bounded',()=>{
 const local=player(),sample=F.makeRenderPose();sample(local,1/60);
 local.x=.2;local.bumpSeq++;assert.ok(sample(local,1/60).x<.04);
 for(let i=0;i<30;i++){local.x=i%2?3:0;local.bumpSeq++;const view=sample(local,1/60);assert.ok(view.x>=0&&view.x<=3);}
});
test('respawn/re-entry, large teleports and resumed rendering reset camera history',()=>{
 const local=player(),sample=F.makeRenderPose();sample(local,1/60);local.x=3;sample(local,1/60);
 const respawn={...local,x:0};assert.equal(sample(respawn,1/60).x,0);
 respawn.x=40;assert.equal(sample(respawn,1/60).x,40);
 respawn.x=43;sample(respawn,1/60);assert.equal(sample(respawn,.5).x,43);
});
test('zero-delta frames stay finite and visual pose is reused',()=>{
 const local=player(),sample=F.makeRenderPose(),view=sample(local,0);local.x=3;
 assert.equal(sample(local,0),view);assert.equal(view.x,0);assert.ok(Number.isFinite(sample(local,1/60).x));
});
