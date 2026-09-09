"use strict";
/* Arena background music only; sampled SFX removed at the user's request (round 1392). */
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
  async function loadMusic(){
    if(musicBlob)return musicBlob;if(musicLoad)return musicLoad;
    const track=musicTrack,path='/sound/arena/'+track.file;
    musicLoad=(async function fetchArenaMusic(){
      let cache=null;
      const key=location.origin+'/__vw_asset__'+path+'?v='+track.hash;
      try{cache=await caches.open('vw-assets-content-v1');const hit=await cache.match(key);if(hit)return musicBlob=await hit.blob();}catch(_){}
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
      try{
        musicDownloads++;const response=await fetch(path,{signal:controller.signal});
        if(!response.ok)throw Error('Arena music unavailable');
        // Same key as the existing service worker: retained across unrelated game deployments.
        if(cache)try{await cache.put(key,response.clone());}catch(_){}
        return musicBlob=await response.blob();
      }finally{clearTimeout(timer);}
    })().catch(()=>{musicRetryAt=performance.now()+10000;return null;}).finally(()=>{musicLoad=null;});
    return musicLoad;
  }
  function pauseMusic(){if(music)music.pause();}
  function syncMusic(){
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
    unlocked=true;syncMusic();
  }
  function start(root){
    stop();active=true;
    const listen=(el,type,fn,options)=>{el.addEventListener(type,fn,options);detach.push(()=>el.removeEventListener(type,fn,options));};
    listen(root,'pointerdown',unlock,{capture:true,passive:true});
    listen(window,'keydown',unlock,true);
    listen(document,'visibilitychange',()=>{if(document.hidden)pauseMusic();else syncMusic();});
    listen(window,'pagehide',pauseMusic);
    musicTimer=setInterval(syncMusic,500);
  }
  function stop(){stopMusic();active=false;unlocked=false;detach.splice(0).forEach(fn=>fn());}
  window.ArenaAudio={start,stop,exit:stop,
    stats:()=>({active,unlocked,music:{playing:!!music&&!music.paused,loop:!!music&&music.loop,volume:music?.volume||0,track:musicTrack?.file||'',cached:!!musicBlob,downloads:musicDownloads}})};
})();
