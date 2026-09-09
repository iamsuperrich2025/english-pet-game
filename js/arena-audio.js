"use strict";
/* Arena music + user-approved MEGA, elemental cast, shield impact, healing, lightning and fire clips; previous SFX remain removed (round 1394). */
(function(){
  let active=false,unlocked=false,detach=[];
  const enabled=()=>active&&!document.hidden&&typeof state!=='undefined'&&!!state.sound;
  // Keep music compressed: one media element plays a cached Blob, never a full PCM buffer.
  const musicTracks=[
    {file:'bgmusic-b6b49f8fdc7aeb2f.ogg',hash:'b6b49f8fdc7aeb2f',type:'audio/ogg; codecs="opus"'},
    {file:'bgmusic-e450dce94058763f.mp3',hash:'e450dce94058763f',type:'audio/mpeg'}
  ];
  let music=null,musicUrl='',musicBlob=null,musicLoad=null,musicPending=false,musicTimer=0,musicRetryAt=0;
  let musicTrack=null,musicDownloads=0;
  function musicEnabled(){return enabled()&&unlocked&&!state.musicOff;}
  async function cachedAudioBlob(track,onDownload){
    let cache=null;const path='/sound/arena/'+track.file,key=location.origin+'/__vw_asset__'+path+'?v='+track.hash;
    try{cache=await caches.open('vw-assets-content-v1');const hit=await cache.match(key);if(hit)return await hit.blob();}catch(_){}
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      onDownload();const response=await fetch(path,{signal:controller.signal});
      if(!response.ok)throw Error('Arena audio unavailable');
      if(cache)try{await cache.put(key,response.clone());}catch(_){}
      return await response.blob();
    }finally{clearTimeout(timer);}
  }
  async function loadMusic(){
    if(musicBlob)return musicBlob;if(musicLoad)return musicLoad;
    musicLoad=cachedAudioBlob(musicTrack,()=>musicDownloads++).then(blob=>musicBlob=blob)
      .catch(()=>{musicRetryAt=performance.now()+10000;return null;}).finally(()=>{musicLoad=null;});
    return musicLoad;
  }
  // One reusable compressed-media player per approved cue; no PCM buffers or voice stacking.
  function createEffect(track,volume,gap=250){
    let player=null,blob=null,url='',loading=null,pending=false,generation=0;
    let retryAt=0,last=-Infinity,played=0,downloads=0;
    function load(){
      if(blob)return Promise.resolve(blob);if(loading)return loading;
      if(performance.now()<retryAt)return Promise.resolve(null);
      loading=cachedAudioBlob(track,()=>downloads++).then(value=>blob=value)
        .catch(()=>{retryAt=performance.now()+10000;return null;}).finally(()=>{loading=null;});
      return loading;
    }
    function prepare(){if(enabled()&&unlocked)void load();}
    function pause(){generation++;if(player){player.pause();try{player.currentTime=0;}catch(_){}}}
    function stop(){
      pause();if(player){player.removeAttribute('src');player.load();player=null;}
      if(url)URL.revokeObjectURL(url);url='';pending=false;last=-Infinity;
    }
    function play(){
      if(!enabled()||!unlocked||pending||performance.now()-last<gap)return;
      try{
        if(!player){player=new Audio();player.preload='none';player.volume=volume;}
        const element=player,at=generation;pending=true;last=performance.now();
        void load().then(value=>{
          if(!value||element!==player||at!==generation||!enabled()||performance.now()-last>1000)return;
          if(!url){url=URL.createObjectURL(value);element.src=url;}
          element.currentTime=0;
          return element.play().then(()=>{if(element!==player||at!==generation||!enabled())element.pause();else played++;});
        }).catch(()=>{}).finally(()=>{if(element===player)pending=false;});
      }catch(_){pending=false;}
    }
    return {prepare,play,pause,stop,stats:()=>({playing:!!player&&!player.paused,played,cached:!!blob,downloads})};
  }
  const mega=createEffect({file:'mega-5583f203fe74a126.mp3',hash:'5583f203fe74a126'},.55);
  const element=createEffect({file:'element-91011ad1b87d230d.mp3',hash:'91011ad1b87d230d'},.55);
  const shield=createEffect({file:'shield-2a738b9421347bc6.mp3',hash:'2a738b9421347bc6'},.55);
  const heal=createEffect({file:'heal-f5beb28f8a0c7708.mp3',hash:'f5beb28f8a0c7708'},.55,1800);
  const lightning=createEffect({file:'lightning-261c63b74d97a82f.mp3',hash:'261c63b74d97a82f'},.55);
  const fire=createEffect({file:'fire-a6fea31058694941.mp3',hash:'a6fea31058694941'},.55);
  function pauseEffects(){mega.pause();element.pause();shield.pause();heal.pause();lightning.pause();fire.pause();}
  function pauseMusic(){if(music)music.pause();}
  function syncMusic(){
    if(!enabled())pauseEffects();
    if(!musicEnabled()){pauseMusic();return;}
    if(musicPending||performance.now()<musicRetryAt)return;
    try{
      if(!music){
        music=new Audio();music.preload='none';music.loop=true;music.volume=.16;
        musicTrack=musicTrack||musicTracks.find(track=>music.canPlayType(track.type))||musicTracks[1];
      }
      if(!music.paused)return;
      const element=music;musicPending=true;
      void loadMusic().then(blob=>{
        if(!blob||element!==music||!musicEnabled())return;
        if(!musicUrl){musicUrl=URL.createObjectURL(blob);element.src=musicUrl;}
        return element.play().then(()=>{if(element!==music||!musicEnabled())element.pause();});
      }).catch(()=>{musicRetryAt=performance.now()+10000;})
        .finally(()=>{if(element===music)musicPending=false;});
    }catch(_){musicPending=false;musicRetryAt=performance.now()+10000;}
  }
  function stopMusic(){
    clearInterval(musicTimer);musicTimer=0;pauseMusic();
    if(music){music.removeAttribute('src');music.load();music=null;}
    if(musicUrl)URL.revokeObjectURL(musicUrl);musicUrl='';musicPending=false;
  }

  function unlock(event){
    if(!event.isTrusted||!enabled()||(event.type==='keydown'&&event.repeat))return;
    unlocked=true;element.prepare();shield.prepare();heal.prepare();lightning.prepare();fire.prepare();syncMusic();
  }
  function start(root){
    stop();active=true;
    const listen=(el,type,fn,options)=>{el.addEventListener(type,fn,options);detach.push(()=>el.removeEventListener(type,fn,options));};
    listen(root,'pointerdown',unlock,{capture:true,passive:true});
    listen(window,'keydown',unlock,true);
    listen(document,'visibilitychange',()=>{if(document.hidden){pauseMusic();pauseEffects();}else syncMusic();});
    listen(window,'pagehide',()=>{pauseMusic();pauseEffects();});
    musicTimer=setInterval(syncMusic,500);
  }
  function stop(){mega.stop();element.stop();shield.stop();heal.stop();lightning.stop();fire.stop();stopMusic();active=false;unlocked=false;detach.splice(0).forEach(fn=>fn());}
  window.ArenaAudio={start,stop,exit:stop,prepareMega:mega.prepare,playMega:mega.play,playElement:family=>(family==='arc'?lightning:family==='fire'?fire:element).play(),playShield:shield.play,playHeal:heal.play,
    stats:()=>({active,unlocked,mega:mega.stats(),element:element.stats(),shield:shield.stats(),heal:heal.stats(),lightning:lightning.stats(),fire:fire.stats(),music:{playing:!!music&&!music.paused,loop:!!music&&music.loop,volume:music?.volume||0,track:musicTrack?.file||'',cached:!!musicBlob,downloads:musicDownloads}})};
})();
