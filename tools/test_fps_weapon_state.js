'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','fpsweapon.js'),'utf8');
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);
const API=sandbox.window.FpsWeaponRuntime;
const assert=(ok,label)=>{if(!ok)throw new Error(label)};
const make=()=>API.create();
const step=(m,seconds,intent,fps=60)=>{for(let i=0;i<Math.ceil(seconds*fps);i++)m.step(1/fps,intent);return m.state};

let m=make();
assert(m.state==='EQUIP','starts EQUIP');
assert(step(m,.40,{})==='IDLE','EQUIP -> IDLE');
assert(step(m,.05,{moving:true})==='WALK','IDLE -> WALK');
assert(step(m,.05,{moving:true,sprinting:true})==='SPRINT','WALK -> SPRINT');
m.triggerFire(); step(m,.05,{moving:true});
assert(m.state!=='SPRINT','fire exits sprint before shooting');
assert(step(m,.11,{moving:true})==='FIRE','queued sprint fire starts');
assert(step(m,.06,{moving:true})==='WALK','FIRE -> WALK');
assert(step(m,.25,{ads:true})==='ADS','ADS_ENTER -> ADS');
m.triggerFire(); step(m,.02,{ads:true});
assert(m.state==='FIRE','ADS -> FIRE');
assert(step(m,.06,{ads:true})==='ADS','FIRE -> ADS');
assert(step(m,.20,{moving:true,ads:false})==='WALK','ADS_EXIT -> WALK');
assert(step(m,.02,{moving:true,reloading:true})==='RELOAD','WALK -> RELOAD');
assert(step(m,.1,{moving:true,reloading:true})==='RELOAD','duplicate reload blocked');
assert(step(m,.02,{moving:true,reloading:false})==='WALK','RELOAD -> previous valid state');
assert(step(m,.02,{moving:true,ads:true})==='ADS_ENTER','walk ADS enter');
assert(step(m,.02,{moving:true,ads:true,sprinting:true})==='ADS_EXIT','sprint cancels ADS');

m=make(); step(m,.40,{}); m.triggerFire(); step(m,.02,{});
assert(m.state==='FIRE','fire starts from idle');
assert(step(m,.01,{reloading:true})==='RELOAD','reload priority cancels fire');
m.triggerFire(); step(m,.03,{reloading:true});
assert(m.state==='RELOAD','fire blocked during reload');

m=make(); m.triggerFire(); step(m,.10,{});
assert(m.state==='EQUIP','fire blocked during equip');

const a=make(),b=make();
step(a,.42,{moving:true},30); step(b,.42,{moving:true},120);
assert(a.frame===b.frame,'animation timing independent of render FPS');
console.log('PASS FPS weapon state: transitions, priority, reload return, ADS/sprint, delta-time timing');
