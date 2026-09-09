/* Room reducers for four rivals or bots, private vaults, winner rounds, and host migration. */
(function () {
  'use strict';
  const F=window.Frontline;
  F.pruneRoom=function(room,now){
    room.players=room.players||{};room.bases=room.bases||{};
    for(const [key,p] of Object.entries(room.players)){
      if(p.bot||now-p.t<=F.C.leaseMs)continue;
      if(p.carried)F.dropCarried(room,key,p.x,p.z,now);
      delete room.players[key];delete room.bases[key];
      if(room.events)delete room.events[key];if(room.rewards)delete room.rewards[key];
    }
    for(const name of ['events','rewards'])for(const key of Object.keys(room[name]||{})){
      if(!room.players[key])delete room[name][key];
    }
    return room;
  };
  F.admit=function(current,id,now,runId){
    let room=current&&F.pruneRoom(current,now);
    if(!room)room={run:runId,word:F.newWord(0),letters:F.spawnLetters(),players:{},bases:{},guards:F.spawnGuards(now),tickAt:now};
    const existing=Object.entries(room.players).find(([,p])=>p.id===id);
    if(existing){existing[1].t=now;F.fillBots(room,now);return room;}
    let entry=Object.entries(room.players).find(([,p])=>p.bot);
    if(!entry){
      const used=Object.values(room.players);
      if(used.length>=F.C.maxPlayers)return;
      const slot=[0,1,2,3].find(n=>!used.some(p=>p.slot===n));entry=['s'+slot,{slot}];
    }
    const key=entry[0],slot=entry[1].slot;
    if(room.events)delete room.events[key];if(room.rewards)delete room.rewards[key];
    room.bases[key]=F.newBase(slot,id);room.players[key]=F.newTank(id,slot,now,false);
    F.fillBots(room,now);if(F.clearSpawn)F.clearSpawn(room,room.players[key],key);return room;
  };
  F.leader=(room,now=Date.now())=>Object.keys(room&&room.players||{})
    .filter(key=>!room.players[key].bot&&now-room.players[key].t<F.C.leaseMs).sort()[0];
  F.stepRoom=function(room,id,now,commands){
    if(!room)return;
    const leader=commands?F.commandLeader(room,commands,now):F.leader(room,now);
    if(leader!==id||now-room.tickAt<F.C.worldMs-10)return;
    F.pruneRoom(room,now);F.fillBots(room,now);
    const dt=Math.min(.25,Math.max(0,(now-room.tickAt)/1000));room.tickAt=now;
    if(room.word.completedAt&&now-room.word.completedAt>=2600)room.word=F.newWord(room.word.round+1);
    F.stepBots(room,dt,now);F.stepGuards(room,dt,now);F.stepBombs(room,now);F.tickLetters(room,now);
    for(const [key,p] of Object.entries(room.players)){
      if(p.hp<=0&&now>=p.respawnAt){
        const fresh=F.newTank(p.id,p.slot,now,p.bot);
        Object.assign(p,fresh,{fireSeq:p.fireSeq,lastFire:p.lastFire,bombSeq:p.bombSeq,lastBomb:p.lastBomb,
          dropSeq:p.dropSeq||0,dropResult:p.dropResult||'',carriedRevision:p.carriedRevision||0});
        if(F.clearSpawn)F.clearSpawn(room,p,key);
      }
      p.hp=F.round(p.hp);
    }
    return room;
  };
})();
