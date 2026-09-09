/* Per-seat input mailboxes and a single elected simulation writer, demo emulator only. */
(function(){
  'use strict';
  const F=window.Frontline;
  F.connect=async function(code,notify){
    const config=F.assertDev();
    if(!/^R\d{4}$/.test(code))throw Error('Use a four-digit room number.');
    const uid='p'+F.randomId(),app=firebase.initializeApp({projectId:F.C.project,
      databaseURL:'https://'+F.C.project+'-default-rtdb.firebaseio.com'},uid),db=app.database();
    if(config.mobileLongPolling&&(/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||new URLSearchParams(location.search).get('transport')==='longpoll'))
      db.INTERNAL.forceLongPolling();
    db.useEmulator(location.hostname,config.port,{mockUserToken:{sub:uid,user_id:uid}});
    const prefix=F.C.namespace+'/'+config.token,ref=db.ref(prefix+'/rooms/'+code),inputs=db.ref(prefix+'/inputs/'+code);
    const info=db.ref('.info/connected'),clock=db.ref('.info/serverTimeOffset');
    let id=null,own=null,alive=true,ready=false,connected=false,latest=null,commands={},offset=0,rejoining=false,lastAdmission=0;
    let busy=false,worldBusy=false,lastPose=0,lastWorld=0,sequence=0,bombSequence=0,dropSequence=0,dropIntent=null,write=Promise.resolve(),tick=Promise.resolve();
    const pending={fire:false,bomb:false,drop:null},serverNow=()=>Date.now()+offset;
    const report=error=>{if(alive)notify({error:error.message||String(error)});};
    const onTime=s=>{offset=Number(s.val())||0;};
    const ownsSeat=()=>!!id&&latest?.players?.[id]?.id===uid&&!latest.players[id].bot;
    async function admit(){
      const response=await fetch('/__dev/frontline/admit',{method:'POST',headers:{'Content-Type':'application/json','X-Frontline-Token':config.token},
        body:JSON.stringify({code,uid})});
      const result=await response.json();
      if(!response.ok){const error=Error(result.error||'Cannot join test room.');error.code=result.code;throw error;}
      if(own){await own.onDisconnect().cancel();await ref.onDisconnect().cancel();}
      id=result.id;own=inputs.child(id);
      await ref.onDisconnect().update({['players/'+id]:null,['events/'+id]:null,['rewards/'+id]:null});
      await own.onDisconnect().remove();
      latest=(await ref.once('value')).val();const initial=latest?.players?.[id];
      if(initial?.id!==uid)throw Error('กำลังคืนที่นั่งผู้เล่น…');
      sequence=initial.fireSeq;bombSequence=initial.bombSeq;pending.fire=pending.bomb=false;pending.drop=null;dropSequence=initial.dropSeq||0;dropIntent=null;lastPose=0;
      await own.set({...F.tankPose(initial),uid,t:serverNow(),fireSeq:sequence,bombSeq:bombSequence,dropSeq:dropSequence,dropLetter:'',dropRevision:0});
    }
    function publish(){
      if(!alive)return;const mine=ownsSeat(),p=mine&&latest.players[id];
      if(p){sequence=Math.max(sequence,p.fireSeq||0);bombSequence=Math.max(bombSequence,p.bombSeq||0);dropSequence=Math.max(dropSequence,p.dropSeq||0);}
      if(!p||p.hp<=0){pending.fire=pending.bomb=false;pending.drop=null;}
      notify({room:latest,id,connected:connected&&mine&&!rejoining,missing:ready&&(!mine||rejoining)});
    }
    const onRoom=s=>{latest=s.val();publish();};
    async function recover(){
      if(!alive||!ready||!connected||rejoining||serverNow()-lastAdmission<2000)return;
      lastAdmission=serverNow();rejoining=true;pending.fire=pending.bomb=false;pending.drop=null;publish();
      try{await write;await admit();}catch(error){report(error);}
      finally{rejoining=false;publish();}
    }
    const onInputs=s=>{commands=s.val()||{};};
    const onConnection=s=>{
      const before=connected;connected=s.val()===true;
      if(!connected){pending.fire=pending.bomb=false;pending.drop=null;}
      publish();
      if(ready&&connected&&!before)recover();
    };
    clock.on('value',onTime);info.on('value',onConnection);
    try{
      await admit();ready=true;inputs.on('value',onInputs,report);ref.on('value',onRoom,report);
    }catch(error){
      alive=false;clock.off('value',onTime);info.off('value',onConnection);db.goOffline();await app.delete();throw error;
    }
    function pumpWorld(now){
      if(worldBusy||now-lastWorld<F.C.worldMs||F.commandLeader(latest,commands,now)!==id)return;
      worldBusy=true;lastWorld=now;
      tick=ref.transaction(room=>{
        if(!room||room.players?.[id]?.id!==uid)return;
        const at=serverNow();if(F.commandLeader(room,commands,at)!==id)return;
        F.applyCommands(room,commands,at);
        return F.stepRoom(room,id,at,commands);
      },undefined,false).catch(report).finally(()=>{worldBusy=false;});
    }
    return{
      get id(){return id;},code,get room(){return latest;},get connected(){return connected&&ownsSeat()&&!rejoining;},
      maintain(){if(alive&&ready&&connected&&!ownsSeat()&&!document.hidden)recover();},
      attackState(){const p=latest?.players?.[id];return{fire:pending.fire||!!p&&sequence>p.fireSeq,
        bomb:pending.bomb||!!p&&bombSequence>p.bombSeq,drop:!!pending.drop||!!p&&dropSequence>(p.dropSeq||0),busy,now:serverNow()};},
      update(pose,fire,bomb,drop){
        if(!alive||!connected||rejoining||!ownsSeat()||pose.id!==uid)return;
        const now=serverNow(),p=latest.players[id];pumpWorld(now);
        if(pose.hp>0){pending.fire=pending.fire||!!fire;pending.bomb=pending.bomb||!!bomb;}
        if(drop&&pose.hp>0&&!pending.drop&&dropSequence<=(p.dropSeq||0))pending.drop={letter:drop.letter,revision:drop.revision};
        if(busy)return;
        const shoot=pending.fire&&sequence<=p.fireSeq&&now-p.lastFire>=F.C.fireMs;
        const place=pending.bomb&&bombSequence<=p.bombSeq&&now-p.lastBomb>=F.C.bombCooldown;
        const release=pending.drop&&dropSequence<=(p.dropSeq||0);
        if(now-lastPose<F.C.sendMs&&!shoot&&!place&&!release)return;
        if(shoot){sequence++;pending.fire=false;}if(place){bombSequence++;pending.bomb=false;}
        if(release){dropSequence++;dropIntent=pending.drop;pending.drop=null;}
        lastPose=now;busy=true;
        // Inputs stay outside room state. A slow phone can write without racing the host transaction.
        write=own.set({...F.tankPose(pose),uid,t:now,bumpSeq:pose.bumpSeq||0,fireSeq:sequence,bombSeq:bombSequence,
          dropSeq:dropSequence,dropLetter:dropIntent?.letter||'',dropRevision:dropIntent?.revision||0})
          .catch(report).finally(()=>{busy=false;});
      },
      async close(){
        if(!alive)return;alive=false;
        ref.off('value',onRoom);inputs.off('value',onInputs);clock.off('value',onTime);info.off('value',onConnection);
        try{await Promise.race([Promise.allSettled([write,tick]),new Promise(r=>setTimeout(r,1200))]);}
        finally{db.goOffline();await app.delete();}
      }
    };
  };
})();
