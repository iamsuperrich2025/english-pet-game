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
  const EPSILON=1e-7;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const groundBase=intent=>intent.moving?STATES.WALK:STATES.IDLE;

  function frameAt(frames,elapsed,durationOrFps,loop){
    if(!frames.length) return '';
    const index=loop
      ?Math.floor(elapsed*durationOrFps)%frames.length
      :Math.min(frames.length-1,Math.floor(clamp(elapsed/durationOrFps,0,.999999)*frames.length));
    return frames[index];
  }
  function frameAtProgress(frames,progress){
    if(!frames.length) return '';
    return frames[Math.min(frames.length-1,Math.floor(clamp(progress,0,1)*frames.length))];
  }
  function createRenderer(element){
    let renderedSrc=null, renderedState=null, renderedVisible=null;
    const render=(src,state,ready)=>{
      const visible=!!(ready&&src);
      if(!element) return visible;
      if(renderedVisible!==visible){
        renderedVisible=visible;
        element.style.display=visible?'block':'none';
      }
      if(visible&&renderedSrc!==src){
        renderedSrc=src;
        element.style.backgroundImage=`url("${src}")`;
      }
      const nextState=state||'';
      if(renderedState!==nextState){
        renderedState=nextState;
        element.dataset.state=nextState;
      }
      return visible;
    };
    const reset=()=>{
      renderedSrc=null; renderedState=null; renderedVisible=null;
      if(!element) return;
      element.style.display='none';
      element.style.backgroundImage='';
      element.dataset.state='';
      renderedSrc=''; renderedState=''; renderedVisible=false;
    };
    return {render,reset,get src(){return renderedSrc},get state(){return renderedState},get visible(){return renderedVisible}};
  }
  function create(options){
    options=options||{};
    let state=STATES.EQUIP, elapsed=0, pendingFire=false, sprintExit=0, lastFrame='', disposed=false;
    let adsProgress=0, fireFrameIndex=0, fireTerminalPresented=false;
    const cache=new Map();
    let preloadPromise=null;
    const notify=()=>{ if(options.onState) options.onState(state); };
    const resumeState=intent=>intent.ads
      ?(adsProgress>=1-EPSILON?STATES.ADS:STATES.ADS_ENTER)
      :(adsProgress>EPSILON?STATES.ADS_EXIT:groundBase(intent));
    const enter=next=>{
      if(state===next) return;
      state=next;
      elapsed=0;
      if(next===STATES.FIRE){ fireFrameIndex=0; fireTerminalPresented=false; }
      notify();
    };
    const preload=()=>{
      if(typeof Image==='undefined') return Promise.resolve([]);
      if(preloadPromise) return preloadPromise;
      preloadPromise=Promise.allSettled(Object.values(ASSETS).flat().map(src=>new Promise((resolve,reject)=>{
        if(cache.has(src)) return resolve(cache.get(src));
        const image=new Image();
        image.decoding='async';
        image.onload=()=>{cache.set(src,image);resolve(image);};
        image.onerror=()=>reject(new Error(src));
        image.src=src;
      })));
      return preloadPromise;
    };
    const chooseFrame=()=>{
      if(state===STATES.EQUIP) return frameAt(ASSETS.equip,elapsed,CONFIG.equipDuration,false);
      if(state===STATES.WALK) return frameAt(ASSETS.walk,elapsed,CONFIG.walkFps,true);
      if(state===STATES.SPRINT) return frameAt(ASSETS.sprint,elapsed,CONFIG.sprintFps,true);
      if(state===STATES.ADS_ENTER||state===STATES.ADS_EXIT) return frameAtProgress(ASSETS.ads,adsProgress);
      if(state===STATES.ADS) return ASSETS.ads[ASSETS.ads.length-1];
      if(state===STATES.FIRE) return adsProgress>EPSILON
        ?frameAtProgress(ASSETS.ads,adsProgress)
        :ASSETS.fire[fireFrameIndex];
      if(state===STATES.RELOAD) return frameAt(ASSETS.reload,elapsed,CONFIG.reloadDuration,false);
      return ASSETS.idle[0];
    };
    function step(dt,intent){
      if(disposed) return {state,frame:'',ready:false};
      intent=Object.assign({enabled:true,moving:false,sprinting:false,ads:false,reloading:false},intent||{});
      dt=clamp(Number(dt)||0,0,.1);
      sprintExit=Math.max(0,sprintExit-dt);
      if(!intent.enabled){ lastFrame=''; return {state,frame:'',ready:false}; }

      if(intent.reloading&&state!==STATES.RELOAD){
        pendingFire=false;
        enter(STATES.RELOAD);
      }else if(state===STATES.RELOAD){
        elapsed+=dt;
        if(!intent.reloading) enter(resumeState(intent));
      }else if(state===STATES.EQUIP){
        elapsed+=dt;
        if(elapsed>=CONFIG.equipDuration) enter(resumeState(intent));
      }else if(state===STATES.FIRE){
        elapsed+=dt;
        const target=Math.min(ASSETS.fire.length-1,Math.floor(clamp(elapsed/CONFIG.fireDuration,0,1)*ASSETS.fire.length));
        if(fireFrameIndex<target) fireFrameIndex++;
        if(elapsed>=CONFIG.fireDuration&&fireFrameIndex===ASSETS.fire.length-1&&fireTerminalPresented){
          enter(resumeState(intent));
        }
      }else{
        if(pendingFire){
          pendingFire=false;
          enter(STATES.FIRE);
        }
        if(state!==STATES.FIRE&&!pendingFire){
          if(intent.sprinting){
            if(adsProgress>EPSILON) enter(STATES.ADS_EXIT);
            else enter(STATES.SPRINT);
          }else if(intent.ads){
            if(adsProgress<1-EPSILON) enter(STATES.ADS_ENTER);
            else enter(STATES.ADS);
          }else if(adsProgress>EPSILON) enter(STATES.ADS_EXIT);
          else enter(groundBase(intent));

          elapsed+=dt;
          if(state===STATES.ADS_ENTER){
            adsProgress=clamp(adsProgress+dt/CONFIG.adsDuration,0,1);
            if(adsProgress>=1-EPSILON){ adsProgress=1; enter(STATES.ADS); }
          }else if(state===STATES.ADS_EXIT){
            adsProgress=clamp(adsProgress-dt/CONFIG.adsExitDuration,0,1);
            if(adsProgress<=EPSILON){ adsProgress=0; enter(intent.sprinting?STATES.SPRINT:groundBase(intent)); }
          }
        }else if(state!==STATES.FIRE){
          elapsed+=dt;
        }
      }

      const frame=chooseFrame();
      if(frame!==lastFrame){
        lastFrame=frame;
        if(options.onFrame) options.onFrame(frame,state,cache.has(frame));
      }
      if(state===STATES.FIRE&&fireFrameIndex===ASSETS.fire.length-1) fireTerminalPresented=true;
      return {state,frame,ready:cache.has(frame),adsProgress,
        fireFrame:state===STATES.FIRE?fireFrameIndex+1:0,
        adsFire:state===STATES.FIRE&&adsProgress>EPSILON};
    }
    return {
      preload,
      step,
      triggerFire(){ if(state!==STATES.RELOAD&&state!==STATES.EQUIP) pendingFire=true; },
      reset(){
        state=STATES.EQUIP; elapsed=0; pendingFire=false; sprintExit=0; lastFrame=''; disposed=false;
        adsProgress=0; fireFrameIndex=0; fireTerminalPresented=false; notify();
      },
      dispose(){
        disposed=true; state=STATES.EQUIP; elapsed=0; pendingFire=false; sprintExit=0; lastFrame='';
        adsProgress=0; fireFrameIndex=0; fireTerminalPresented=false;
      },
      get state(){return state},
      get frame(){return lastFrame},
      get cached(){return cache.size},
      get adsProgress(){return adsProgress},
      get fireFrame(){return state===STATES.FIRE?fireFrameIndex+1:0}
    };
  }
  window.FpsWeaponRuntime={STATES,CONFIG,ASSETS,create,createRenderer};
})();
