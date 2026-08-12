'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','invasion3d.js'),'utf8');
const start=source.indexOf('const JOY_TOUCH_SLOP=');
const end=source.indexOf('function bindInput()',start);
if(start<0||end<0) throw new Error('input role helpers not found');

const sandbox={};
vm.runInNewContext(source.slice(start,end)+`\nthis.api={
  role:invTouchRole, inRect:invTouchInRect, lookSide:invTouchLookSide, slop:JOY_TOUCH_SLOP
};`,sandbox);
const {role,slop}=sandbox.api;
const touch=(x,y)=>({clientX:x,clientY:y});
const leftJoy={left:40,right:140,top:210,bottom:310,width:100,height:100};
const rightJoy={left:672,right:772,top:210,bottom:310,width:100,height:100};
const eq=(actual,expected,label)=>{
  if(actual!==expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
};

eq(slop,20,'finger slop');
eq(role(touch(90,260),leftJoy,812,false,false),'move','center of movement pad');
eq(role(touch(152,260),leftJoy,812,false,false),'move','near movement-pad edge');
eq(role(touch(152,260),leftJoy,812,false,true),'move-reserved','second finger cannot steal movement pad');
eq(role(touch(170,260),leftJoy,812,false,false),'ignored','left-side miss never becomes camera');
eq(role(touch(700,180),leftJoy,812,false,false),'look','right side controls camera');
eq(role(touch(720,260),rightJoy,812,false,false),'move','left-handed pad on right');
eq(role(touch(620,260),rightJoy,812,false,false),'ignored','right-side miss never becomes camera in left-handed layout');
eq(role(touch(110,180),rightJoy,812,false,false),'look','left side controls camera in left-handed layout');
eq(role(touch(152,260),leftJoy,812,true,false),'ignored','nearby button is not swallowed by movement slop');

// Release hardening: changedTouches may omit the joystick id on some multi-touch WebViews.
const bindStart=source.indexOf('function bindInput()');
const bindEnd=source.indexOf('function moveJoy(',bindStart);
const bindSource=source.slice(bindStart,bindEnd);
eq(/const endTouch=e=>\{[\s\S]*?joyAlive\(e\);/.test(bindSource),true,'touchend reconciles against authoritative active touches');
eq(/window\.addEventListener\('blur',releaseMovement\)/.test(bindSource),true,'focus loss clears transient movement');
eq(/visibilitychange[\s\S]*?releaseMovement\(\)/.test(bindSource),true,'hidden page clears transient movement');
eq(/#inv-weapon-sprite\{[\s\S]*?background-position:50% 50%;background-size:cover/.test(source),true,'wide hip viewmodel maps to the viewport without aspect distortion');
eq(/data-state="ADS_EXIT"\]\{background-position:50% 100%;background-size:contain\}/.test(source),true,'ADS restores centered optic alignment');
eq(/if\(fpsWeaponReady&&weapon==='rifle'\) return \[0,0\];/.test(source),true,'sprite rifle reticle and shot direction converge at screen centre');

console.log('PASS invasion touch roles: 9 role cases + input guards + weapon/aim anchors');
