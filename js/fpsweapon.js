'use strict';
/* ============================================================
   🔫 FPS WEAPON STATE MACHINE — local adapter for invasion3d
   Owns only weapon presentation state. Gameplay, aiming, damage,
   controls and world lifecycle remain in js/invasion3d.js.
   ============================================================ */
(function(){
const STATES=Object.freeze({
  EQUIP:'EQUIP', IDLE:'IDLE', WALK:'WALK', SPRINT:'SPRINT',
  ADS_ENTER:'ADS_ENTER', ADS:'ADS', ADS_EXIT:'ADS_EXIT', FIRE:'FIRE', RELOAD:'RELOAD'
});
const CONFIG=Object.freeze({
  equipDuration:.34, walkFps:9, sprintFps:13, adsDuration:.20,
  adsExitDuration:.16, fireDuration:.045, reloadDuration:2.60, sprintExitDelay:.10
});
const ASSETS=Object.freeze({
  idle:['assets/weapons/fps/runtime/idle/fps_weapon_idle.png'],
  walk:Array.from({length:8},(_,i)=>`assets/weapons/fps/runtime/walk/fps_weapon_walk_${String(i+1).padStart(2,'0')}.png`),
  sprint:Array.from({length:8},(_,i)=>`assets/weapons/fps/runtime/sprint/fps_weapon_sprint_${String(i+1).padStart(2,'0')}.png`),
  equip:Array.from({length:8},(_,i)=>`assets/weapons/fps/runtime/equip/fps_weapon_equip_${String(i+1).padStart(2,'0')}.png`),
  ads:Array.from({length:6},(_,i)=>`assets/weapons/fps/runtime/ads/fps_weapon_ads_${String(i+1).padStart(2,'0')}.png`),
  fire:Array.from({length:4},(_,i)=>`assets/weapons/fps/runtime/fire/fps_weapon_fire_${String(i+1).padStart(2,'0')}.png`),
  reload:Array.from({length:12},(_,i)=>`assets/weapons/fps/runtime/reload/fps_weapon_reload_${String(i+1).padStart(2,'0')}.png`)
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function validBase(intent){ return intent.ads?'ADS':(intent.moving?'WALK':'IDLE'); }
function frameAt(frames,elapsed,duration,loop,reverse){
  if(!frames.length) return '';
  let index=loop?Math.floor(elapsed*duration)%frames.length:Math.min(frames.length-1,Math.floor(clamp(elapsed/duration,0,.999999)*frames.length));
  if(reverse) index=frames.length-1-index;
  return frames[index];
}
function create(options){
  options=options||{};
  let state=STATES.EQUIP, elapsed=0, previous=STATES.IDLE, pendingFire=false, sprintExit=0, lastFrame='', disposed=false;
  const cache=new Map(); let preloadPromise=null;
  const notify=()=>{ if(options.onState) options.onState(state); };
  const enter=(next,back)=>{ if(state===next) return; previous=back||previous; state=next; elapsed=0; notify(); };
  const preload=()=>{
    if(typeof Image==='undefined') return Promise.resolve([]);
    if(preloadPromise) return preloadPromise;
    preloadPromise=Promise.allSettled(Object.values(ASSETS).flat().map(src=>new Promise((resolve,reject)=>{
      if(cache.has(src)) return resolve(cache.get(src));
      const image=new Image(); image.decoding='async'; image.onload=()=>{cache.set(src,image);resolve(image);}; image.onerror=()=>reject(new Error(src)); image.src=src;
    })));
    return preloadPromise;
  };
  const chooseFrame=()=>{
    if(state===STATES.EQUIP) return frameAt(ASSETS.equip,elapsed,CONFIG.equipDuration,false,false);
    if(state===STATES.WALK) return frameAt(ASSETS.walk,elapsed,CONFIG.walkFps,true,false);
    if(state===STATES.SPRINT) return frameAt(ASSETS.sprint,elapsed,CONFIG.sprintFps,true,false);
    if(state===STATES.ADS_ENTER) return frameAt(ASSETS.ads,elapsed,CONFIG.adsDuration,false,false);
    if(state===STATES.ADS) return ASSETS.ads[ASSETS.ads.length-1];
    if(state===STATES.ADS_EXIT) return frameAt(ASSETS.ads,elapsed,CONFIG.adsExitDuration,false,true);
    if(state===STATES.FIRE) return frameAt(ASSETS.fire,elapsed,CONFIG.fireDuration,false,false);
    if(state===STATES.RELOAD) return frameAt(ASSETS.reload,elapsed,CONFIG.reloadDuration,false,false);
    return ASSETS.idle[0];
  };
  function step(dt,intent){
    if(disposed) return {state,frame:'',ready:false};
    intent=Object.assign({enabled:true,moving:false,sprinting:false,ads:false,reloading:false},intent||{});
    dt=clamp(Number(dt)||0,0,.1); elapsed+=dt; sprintExit=Math.max(0,sprintExit-dt);
    if(!intent.enabled){ lastFrame=''; return {state,frame:'',ready:false}; }
    if(intent.reloading && state!==STATES.RELOAD){ previous=validBase(intent); enter(STATES.RELOAD,previous); }
    else if(state===STATES.RELOAD){ if(!intent.reloading) enter(validBase(intent)); }
    else if(state===STATES.EQUIP){ if(elapsed>=CONFIG.equipDuration) enter(validBase(intent)); }
    else if(state===STATES.FIRE){ if(elapsed>=CONFIG.fireDuration) enter(validBase(intent)); }
    else{
      if(pendingFire){
        if(state===STATES.SPRINT){ sprintExit=CONFIG.sprintExitDelay; enter(intent.moving?STATES.WALK:STATES.IDLE); }
        else if(sprintExit<=0){ pendingFire=false; previous=validBase(intent); enter(STATES.FIRE,previous); }
      }else if(intent.sprinting){
        if(state===STATES.ADS||state===STATES.ADS_ENTER) enter(STATES.ADS_EXIT);
        else if(state===STATES.ADS_EXIT){ if(elapsed>=CONFIG.adsExitDuration) enter(STATES.SPRINT); }
        else enter(STATES.SPRINT);
      }
      else if(intent.ads){ if(state!==STATES.ADS&&state!==STATES.ADS_ENTER) enter(STATES.ADS_ENTER); else if(state===STATES.ADS_ENTER&&elapsed>=CONFIG.adsDuration) enter(STATES.ADS); }
      else if(state===STATES.ADS||state===STATES.ADS_ENTER){ enter(STATES.ADS_EXIT); }
      else if(state===STATES.ADS_EXIT){ if(elapsed>=CONFIG.adsExitDuration) enter(intent.moving?STATES.WALK:STATES.IDLE); }
      else enter(intent.moving?STATES.WALK:STATES.IDLE);
    }
    const frame=chooseFrame();
    if(frame!==lastFrame){ lastFrame=frame; if(options.onFrame) options.onFrame(frame,state,cache.has(frame)); }
    return {state,frame,ready:cache.has(frame)};
  }
  return {
    preload, step,
    triggerFire(){ if(state!==STATES.RELOAD&&state!==STATES.EQUIP) pendingFire=true; },
    reset(){ state=STATES.EQUIP; elapsed=0; previous=STATES.IDLE; pendingFire=false; sprintExit=0; lastFrame=''; disposed=false; notify(); },
    dispose(){ disposed=true; pendingFire=false; lastFrame=''; },
    get state(){return state}, get frame(){return lastFrame}, get cached(){return cache.size}
  };
}
window.FpsWeaponRuntime={STATES,CONFIG,ASSETS,create};
})();
