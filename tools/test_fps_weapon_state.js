'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','fpsweapon.js'),'utf8');
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);
const API=sandbox.window.FpsWeaponRuntime;
const fireRateTraces=[];
const rapidAdsTrace=[];
const assert=(ok,label)=>{if(!ok)throw new Error(label)};
const equal=(actual,expected,label)=>assert(actual===expected,`${label}: expected ${expected}, got ${actual}`);
const near=(actual,expected,tolerance,label)=>assert(Math.abs(actual-expected)<=tolerance,`${label}: expected ${expected} +/- ${tolerance}, got ${actual}`);
const make=options=>API.create(options);
const adsFrame=frame=>Number((String(frame).match(/_ads_(\d+)\.png$/)||[])[1]||0);
const fireFrame=frame=>Number((String(frame).match(/_fire_(\d+)\.png$/)||[])[1]||0);

function finishEquip(machine,intent={},dt=1/60){
  for(let i=0;i<100&&machine.state==='EQUIP';i++) machine.step(dt,intent);
  assert(machine.state!=='EQUIP','equip completes');
}
function advance(machine,seconds,intent={},maxDt=.05){
  let result;
  while(seconds>1e-12){ const dt=Math.min(maxDt,seconds); result=machine.step(dt,intent); seconds-=dt; }
  return result;
}
function captureFire(machine,intentForStep,dt=1/60,maxSteps=100){
  const seen=[]; let entered=false, terminalOpportunities=0;
  for(let i=0;i<maxSteps;i++){
    const intent=typeof intentForStep==='function'?intentForStep(i):intentForStep;
    const result=machine.step(dt,intent||{});
    if(result.state==='FIRE'){
      entered=true;
      const frame=result.fireFrame;
      if(frame===4) terminalOpportunities++;
      if(frame&&seen[seen.length-1]!==frame) seen.push(frame);
    }else if(entered){
      return {seen,terminalOpportunities,result,steps:i+1};
    }
  }
  throw new Error('FIRE did not return to a base state');
}
function assertFireSequence(result,label){
  equal(result.seen.join(','),'1,2,3,4',`${label} presents every FIRE frame in order`);
  assert(result.terminalOpportunities>=1,`${label} presents frame 4 before leaving FIRE`);
}

// Core state priority and existing sprint/reload behavior.
let m=make();
equal(m.state,'EQUIP','starts EQUIP');
finishEquip(m);
equal(m.state,'IDLE','EQUIP -> IDLE');
equal(m.step(.05,{moving:true}).state,'WALK','IDLE -> WALK');
equal(m.step(.05,{moving:true,sprinting:true}).state,'SPRINT','WALK -> SPRINT');
m.triggerFire();
const sprintShot=m.step(0,{moving:true,sprinting:true});
equal(sprintShot.state,'FIRE','fire request enters FIRE on the shot tick');
equal(sprintShot.fireFrame,1,'sprint shot renders FIRE frame 1 immediately');
const sprintFire=captureFire(m,{moving:true},1/60);
sprintFire.seen.unshift(sprintShot.fireFrame);
assertFireSequence(sprintFire,'synchronized sprint FIRE');
equal(m.state,'WALK','sprint FIRE returns to WALK after sprint intent clears');

// A: releasing ADS from frames 1..5 preserves the exact normalized position.
for(let targetFrame=1;targetFrame<=5;targetFrame++){
  m=make(); finishEquip(m);
  m.step(0,{ads:true});
  advance(m,((targetFrame-1)/6+.01)*API.CONFIG.adsDuration,{ads:true});
  equal(adsFrame(m.frame),targetFrame,`ADS_ENTER reaches frame ${targetFrame}`);
  const beforeProgress=m.adsProgress, beforeFrame=m.frame;
  const reversed=m.step(0,{ads:false});
  equal(reversed.state,'ADS_EXIT',`release at frame ${targetFrame} enters ADS_EXIT`);
  near(m.adsProgress,beforeProgress,1e-9,`release at frame ${targetFrame} preserves progress`);
  equal(reversed.frame,beforeFrame,`release at frame ${targetFrame} preserves frame`);
  m.step(.01,{ads:false});
  assert(m.adsProgress<beforeProgress||beforeProgress===0,`ADS_EXIT moves backward from frame ${targetFrame}`);
  assert(adsFrame(m.frame)<=targetFrame,`ADS_EXIT never jumps forward from frame ${targetFrame}`);
}

// B/C: reversing ADS_EXIT at several progress points, plus rapid repeated reversals.
for(const targetProgress of [.9,.65,.4,.15]){
  m=make(); finishEquip(m); m.step(0,{ads:true}); advance(m,API.CONFIG.adsDuration,{ads:true});
  equal(m.state,'ADS','full ADS reached before reverse test');
  m.step(0,{ads:false});
  advance(m,(1-targetProgress)*API.CONFIG.adsExitDuration,{ads:false});
  near(m.adsProgress,targetProgress,1e-7,`ADS_EXIT reaches progress ${targetProgress}`);
  const beforeProgress=m.adsProgress, beforeFrame=m.frame;
  const reversed=m.step(0,{ads:true});
  equal(reversed.state,'ADS_ENTER',`press during ADS_EXIT at ${targetProgress}`);
  near(m.adsProgress,beforeProgress,1e-9,`re-entry at ${targetProgress} preserves progress`);
  equal(reversed.frame,beforeFrame,`re-entry at ${targetProgress} preserves frame`);
  m.step(.01,{ads:true});
  assert(m.adsProgress>beforeProgress,`ADS_ENTER resumes forward from ${targetProgress}`);
}
m=make(); finishEquip(m); m.step(0,{ads:true}); advance(m,.1,{ads:true});
near(m.adsProgress,.5,1e-9,'half ADS_ENTER progress'); m.step(0,{ads:false});
advance(m,.079,{ads:false}); equal(m.state,'ADS_EXIT','half ADS_EXIT remains active before proportional .08s');
advance(m,.0011,{ads:false}); equal(m.state,'IDLE','half ADS_EXIT completes after proportional .08s');
m=make(); finishEquip(m); m.step(0,{ads:true}); advance(m,API.CONFIG.adsDuration,{ads:true}); m.step(0,{ads:false});
advance(m,.096,{ads:false}); near(m.adsProgress,.4,1e-9,'ADS_EXIT reaches .4 before timing reverse'); m.step(0,{ads:true});
advance(m,.119,{ads:true}); equal(m.state,'ADS_ENTER','re-enter from .4 remains active before proportional .12s');
advance(m,.0011,{ads:true}); equal(m.state,'ADS','re-enter from .4 completes after proportional .12s');
m=make(); finishEquip(m);
for(let i=0;i<24;i++){
  const ads=i%2===0, before=m.adsProgress;
  const result=m.step((i%3+1)/240,{ads});
  rapidAdsTrace.push(`${result.state}:ADS${adsFrame(result.frame)}@${m.adsProgress.toFixed(3)}`);
  if(ads) assert(m.adsProgress+1e-9>=before,`rapid reversal ${i} is nondecreasing while held`);
  else assert(m.adsProgress<=before+1e-9,`rapid reversal ${i} is nonincreasing while released`);
  const expected=Math.min(6,Math.floor(m.adsProgress*6)+1);
  if(result.state==='ADS_ENTER'||result.state==='ADS_EXIT'||result.state==='ADS') equal(adsFrame(result.frame),expected,`rapid reversal ${i} uses normalized frame rule`);
}

// ADS boundaries hold at exactly 1 and 0, and the frame rule is FPS-independent.
for(const fps of [30,60,120]){
  m=make(); finishEquip(m,{},1/fps);
  for(let i=0;i<100&&m.state!=='ADS';i++){
    const result=m.step(1/fps,{ads:true});
    const expected=Math.min(6,Math.floor(m.adsProgress*6)+1);
    if(result.state==='ADS_ENTER'||result.state==='ADS') equal(adsFrame(result.frame),expected,`${fps} FPS ADS frame follows progress`);
  }
  equal(m.state,'ADS',`${fps} FPS reaches ADS`); near(m.adsProgress,1,1e-9,`${fps} FPS ADS clamps at 1`);
  for(let i=0;i<5;i++){ m.step(1/fps,{ads:true}); near(m.adsProgress,1,1e-9,`${fps} FPS holds ADS at 1`); }
  for(let i=0;i<100&&m.adsProgress>0;i++) m.step(1/fps,{ads:false});
  near(m.adsProgress,0,1e-9,`${fps} FPS ADS_EXIT clamps at 0`);
  for(let i=0;i<5;i++){ m.step(1/fps,{}); near(m.adsProgress,0,1e-9,`${fps} FPS holds hip at 0`); }
}

// D/E/L/M: hip FIRE presents 1,2,3,4 at every render rate and returns by latest movement intent.
for(const fps of [30,60,120]){
  for(const moving of [false,true]){
    m=make(); finishEquip(m,{moving},1/fps); m.step(0,{moving}); m.triggerFire();
    const result=captureFire(m,{moving},1/fps);
    assertFireSequence(result,`${fps} FPS ${moving?'WALK':'IDLE'} FIRE`);
    equal(result.result.state,moving?'WALK':'IDLE',`${fps} FPS FIRE returns to latest hip base`);
    if(!moving) fireRateTraces.push(`${fps} FPS: FIRE ${result.seen.join('>')} -> ${result.result.state}`);
  }
}
m=make(); finishEquip(m); m.triggerFire();
assertFireSequence(captureFire(m,{},.1),'clamped dt-spike FIRE');

// F/G/H/I: preserve ADS position through FIRE and resume from the latest ADS intent.
m=make(); finishEquip(m); m.step(0,{ads:true}); m.step(.07,{ads:true});
const partialProgress=m.adsProgress;
m.triggerFire();
let result=captureFire(m,{ads:true},1/60);
assertFireSequence(result,'ADS_ENTER FIRE');
equal(result.result.state,'ADS_ENTER','FIRE during ADS_ENTER resumes ADS_ENTER');
near(m.adsProgress,partialProgress,1e-9,'FIRE preserves partial ADS progress');

m=make(); finishEquip(m); m.step(0,{ads:true}); advance(m,API.CONFIG.adsDuration,{ads:true});
m.triggerFire(); result=captureFire(m,{ads:true},1/60);
assertFireSequence(result,'full ADS FIRE');
equal(result.result.state,'ADS','FIRE from ADS returns to ADS while held');
equal(result.result.frame,API.ASSETS.ads[API.ASSETS.ads.length-1],'ADS FIRE keeps optic-aligned sprite');

m=make(); finishEquip(m); m.step(0,{ads:true}); advance(m,API.CONFIG.adsDuration,{ads:true});
m.triggerFire(); result=captureFire(m,{ads:false},1/60);
assertFireSequence(result,'ADS release during FIRE');
equal(result.result.state,'ADS_EXIT','release ADS during FIRE resumes ADS_EXIT');
near(m.adsProgress,1,1e-9,'release during FIRE keeps pre-shot ADS position');

m=make(); finishEquip(m); m.triggerFire(); result=captureFire(m,{ads:true},1/60);
assertFireSequence(result,'ADS press during hip FIRE');
equal(result.result.state,'ADS_ENTER','press ADS during hip FIRE starts ADS_ENTER');
near(m.adsProgress,0,1e-9,'hip FIRE starts ADS_ENTER from hip progress');

// J/K: reload keeps priority; repeated triggers form a bounded one-shot queue.
m=make(); finishEquip(m); m.triggerFire(); equal(m.step(0,{}).state,'FIRE','FIRE begins before reload interrupt');
equal(m.step(.01,{reloading:true}).state,'RELOAD','reload interrupts FIRE immediately');
m.triggerFire(); equal(m.step(.03,{reloading:true}).state,'RELOAD','fire is blocked during reload');
equal(m.step(.01,{reloading:false}).state,'IDLE','reload returns to valid base without stale fire');

const stateChanges=[];
m=make({onState:state=>stateChanges.push(state)}); finishEquip(m); m.triggerFire(); m.step(0,{});
m.triggerFire(); m.triggerFire(); m.triggerFire();
for(let i=0;i<100;i++) m.step(1/60,{});
equal(stateChanges.filter(state=>state==='FIRE').length,2,'duplicate triggers during FIRE queue at most one follow-up shot');

// N/O: reset/dispose clear transient state and callbacks remain quiescent while disposed; no timers exist.
let frameCallbacks=0;
m=make({onFrame:()=>frameCallbacks++}); finishEquip(m); m.step(.08,{ads:true}); m.triggerFire(); m.step(0,{ads:true});
assert(m.adsProgress>0,'dispose setup has ADS progress');
const callbacksBeforeDispose=frameCallbacks;
m.dispose();
near(m.adsProgress,0,1e-9,'dispose clears ADS progress'); equal(m.fireFrame,0,'dispose clears FIRE presentation');
const disposedResult=m.step(.1,{ads:true});
equal(disposedResult.frame,'','disposed step returns no frame'); equal(frameCallbacks,callbacksBeforeDispose,'disposed runtime emits no stale callback');
m.reset();
equal(m.state,'EQUIP','reset restores EQUIP'); near(m.adsProgress,0,1e-9,'reset clears ADS progress'); equal(m.fireFrame,0,'reset clears FIRE frame');
finishEquip(m); equal(m.state,'IDLE','reset clears pending FIRE');
assert(!/\b(?:setTimeout|setInterval|requestAnimationFrame)\s*\(/.test(source),'state machine creates no timer or animation queue');

console.log(`TRACE rapid ADS reversal: ${rapidAdsTrace.join(' > ')}`);
fireRateTraces.forEach(trace=>console.log(`TRACE ${trace}`));
console.log('PASS FPS weapon state: normalized reversible ADS; FIRE 1,2,3,4 at 30/60/120 FPS + dt spike; priority, queue and lifecycle regressions');
