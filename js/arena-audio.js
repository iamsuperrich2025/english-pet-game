"use strict";
/* Arena-only sampled SFX. Kenney CC0 sources: SOUND_LICENSES.md. */
(function(){
  const cues={
    magicShot:{file:'magic-shot',volume:.45,gap:95,group:'shot'},
    hitLetter:{file:'hit-letter',volume:.40,gap:70,group:'impact'},
    letterBreak:{file:'letter-break',volume:.55,gap:85,group:'break'},
    coin:{file:'coin',volume:.45,gap:110,group:'reward'},
    correct:{file:'correct',volume:.50,gap:160,group:'feedback'},
    wrong:{file:'wrong',volume:.35,gap:450,group:'feedback'},
    megaReady:{file:'mega-ready',volume:.60,gap:700,group:'mega'},
    megaFire:{file:'mega-fire',volume:.70,gap:400,group:'mega'},
    shield:{file:'shield',volume:.55,gap:250,group:'shield'},
    uiClick:{file:'ui-click',volume:.30,gap:100,group:'ui'},
    uiBack:{file:'ui-back',volume:.30,gap:100,group:'ui'},
    enemyDefeat:{file:'letter-break',volume:.45,gap:85,group:'break',rate:.85}
  };
  const essential=['magicShot','hitLetter','letterBreak','uiClick'];
  const buffers=new Map(),loads=new Map(),failed=new Map(),last=new Map(),voices=new Set();
  const played={};let ctx=null,master=null,active=false,unlocked=false,epoch=0,detach=[];
  let peak=0,dropped=0,fetches=0;
  const enabled=()=>active&&!document.hidden&&typeof state!=='undefined'&&!!state.sound;
  function context(){
    if(ctx)return ctx;
    try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return null;
      ctx=new AudioContext();master=ctx.createGain();master.gain.value=.65;master.connect(ctx.destination);return ctx;
    }catch(_){return null;}
  }
  function preload(){if(enabled())essential.forEach(name=>{void load(cues[name].file);});}
  function load(file){
    if(buffers.has(file))return Promise.resolve(buffers.get(file));
    if(loads.has(file))return loads.get(file);
    if((failed.get(file)||0)>performance.now())return Promise.resolve(null);
    // Downloads can begin on Arena entry; decoding waits until a gesture has created the context.
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);
    fetches++;
    const promise=fetch('sound/arena/'+file+'.mp3',{signal:controller.signal})
      .then(r=>{if(!r.ok)throw Error('SFX unavailable');return r.arrayBuffer();})
      .then(data=>{buffers.set(file,data);return data;})
      .catch(()=>{failed.set(file,performance.now()+30000);return null;})
      .finally(()=>{clearTimeout(timer);loads.delete(file);});
    loads.set(file,promise);return promise;
  }
  const decoding=new Map();
  async function decoded(file,audio){
    const value=await load(file);if(!value)return null;
    if(!(value instanceof ArrayBuffer))return value;
    if(decoding.has(file))return decoding.get(file);
    const pending=audio.decodeAudioData(value.slice(0)).then(buffer=>{buffers.set(file,buffer);return buffer;})
      .catch(()=>{buffers.delete(file);failed.set(file,performance.now()+30000);return null;})
      .finally(()=>decoding.delete(file));
    decoding.set(file,pending);return pending;
  }
  function unlock(event){
    if(!event.isTrusted||!enabled()||(event.type==='keydown'&&event.repeat))return;
    const audio=context();if(!audio)return;
    unlocked=true;
    // resume() must be called synchronously in the trusted gesture, including after app backgrounding.
    try{if(audio.state!=='running')void audio.resume().catch(()=>{});}catch(_){}
    preload();essential.forEach(name=>{void decoded(cues[name].file,audio);});
  }
  function silence(){
    for(const voice of voices){try{voice.source.stop();}catch(_){}voice.source.disconnect();voice.gain.disconnect();}
    voices.clear();
  }
  function play(name){
    const cue=cues[name];if(!cue||!enabled()||!unlocked||!ctx)return false;
    const now=performance.now(),key=cue.group,throttleKey=key==='break'||key==='ui'?key:name;
    if(now-(last.get(throttleKey)??-Infinity)<cue.gap){dropped++;return false;}
    last.set(throttleKey,now);
    const audio=ctx,bus=master,token=epoch,deadline=now+(essential.includes(name)?200:650);
    void decoded(cue.file,audio).then(buffer=>{
      if(!buffer||token!==epoch||!enabled()||audio.state!=='running'||performance.now()>deadline)return;
      if(voices.size>=8||Array.from(voices).filter(v=>v.group===key).length>=2){dropped++;return;}
      const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=buffer;
      source.playbackRate.value=cue.rate||1;gain.gain.value=cue.volume;
      source.connect(gain);gain.connect(bus);const voice={source,gain,group:key};voices.add(voice);
      source.onended=()=>{voices.delete(voice);source.disconnect();gain.disconnect();};
      source.start();peak=Math.max(peak,voices.size);played[name]=(played[name]||0)+1;
    }).catch(()=>{});return true;
  }
  function start(root){
    stop();active=true;epoch++;
    const listen=(el,type,fn,options)=>{el.addEventListener(type,fn,options);detach.push(()=>el.removeEventListener(type,fn,options));};
    listen(root,'pointerdown',unlock,{capture:true,passive:true});
    listen(window,'keydown',unlock,true);
    listen(root,'click',event=>{
      const button=event.target.closest('button');if(!button||button.disabled||button.matches('[data-skill],#va-revive,#va-exit,#va-shop-open,#va-shop-close,#va-spells-open,#va-spells-close'))return;
      play(/close|back/.test(button.id)?'uiBack':'uiClick');
    },true);
    listen(document,'visibilitychange',()=>{if(document.hidden){epoch++;silence();if(ctx)void ctx.suspend().catch(()=>{});}});
    preload();
  }
  function stop(){
    active=false;unlocked=false;epoch++;detach.splice(0).forEach(fn=>fn());silence();last.clear();
    const old=ctx;ctx=master=null;if(old)void old.close().catch(()=>{});
  }
  // Exit cue runs in the existing context for its 56 ms clip, without keeping the game alive.
  function exit(){
    const old=ctx,token=epoch;play('uiBack');
    detach.splice(0).forEach(fn=>fn());
    setTimeout(()=>{if(epoch===token&&ctx===old)stop();},160);
  }
  window.ArenaAudio={start,stop,exit,play,preload,
    stats:()=>({active,unlocked,state:ctx?.state||'closed',voices:voices.size,peak,dropped,fetches,cached:buffers.size,played:{...played}})};
})();
