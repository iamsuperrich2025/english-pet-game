/* Bounded production polling. Clients send controls; server returns the authoritative room. */
(function(){
  'use strict';const F=window.Frontline;
  F.connect=async function(code,notify){
    await F.productionReady;F.assertDev();
    let result=await F.api('join',code),alive=true,busy=false,last=0,connected=true;
    let fireSeq=result.room.players[result.id].fireSeq,bombSeq=result.room.players[result.id].bombSeq,dropSeq=result.room.players[result.id].dropSeq||0;
    let command={auto:0,turn:0,speedLevel:1,fireSeq,bombSeq,dropSeq,dropLetter:'',dropRevision:0};
    let pendingFire=false,pendingBomb=false,pendingDrop=null;
    F.live.code=code;F.live.earned=result.earned;F.live.claimed=result.claimed||0;
    localStorage.setItem('vw.frontline.live.room.'+F.live.user.uid,code);
    const publish=()=>{F.live.earned=result.earned;notify({room:result.room,id:result.id,connected});};publish();
    async function pump(){
      if(!alive||busy||document.hidden||performance.now()-last<300)return;
      busy=true;last=performance.now();const p=result.room.players[result.id];
      if(pendingFire&&fireSeq<=p.fireSeq){fireSeq++;pendingFire=false;}
      if(pendingBomb&&bombSeq<=p.bombSeq){bombSeq++;pendingBomb=false;}
      if(pendingDrop&&dropSeq<=(p.dropSeq||0)){dropSeq++;command.dropLetter=pendingDrop.letter;command.dropRevision=pendingDrop.revision;pendingDrop=null;}
      try{const next=await F.api('tick',code,{...command,fireSeq,bombSeq,dropSeq});if(!alive)return;result=next;connected=true;publish();}
      catch(error){
        if(!alive)return;
        connected=false;command.auto=0;command.turn=0;notify({connected:false,error:error.message});
        if(error.code==='SEAT_EXPIRED')try{result=await F.api('join',code);fireSeq=result.room.players[result.id].fireSeq;bombSeq=result.room.players[result.id].bombSeq;dropSeq=result.room.players[result.id].dropSeq||0;connected=true;publish();}catch(_){}
      }finally{busy=false;}
    }
    return{code,get id(){return result.id;},get room(){return result.room;},get connected(){return connected;},maintain:pump,
      attackState(){const p=result.room.players[result.id];return{fire:pendingFire||fireSeq>p.fireSeq,bomb:pendingBomb||bombSeq>p.bombSeq,drop:!!pendingDrop||dropSeq>(p.dropSeq||0),busy,now:Date.now()};},
      update(pose,fire,bomb,drop,controls){pendingFire=pendingFire||fire;pendingBomb=pendingBomb||bomb;if(drop)pendingDrop=drop;
        command={...command,auto:controls.auto,turn:controls.turn,speedLevel:controls.speedLevel};},
      async close(){if(!alive)return;alive=false;try{await F.api('leave',code);}catch(_){/* Seat expires after heartbeat lease. */}}
    };
  };
})();
