/* Lightweight host-simulated rivals fill every empty seat and obey the same movement/combat rules. */
(function () {
  'use strict';
  const F=window.Frontline;
  F.fillBots=function(room,now){
    room.players=room.players||{};room.bases=room.bases||{};
    for(let slot=0;slot<F.C.maxPlayers;slot++){
      const key='s'+slot;if(room.players[key])continue;
      const id='bot-'+slot;
      room.bases[key]=F.newBase(slot,id);
      room.players[key]=F.newTank(id,slot,now,true);
      if(F.clearSpawn)F.clearSpawn(room,room.players[key],key);
    }
  };
  function wantedLetter(base,target){
    const bank={};for(const ch of base.stored||'')bank[ch]=(bank[ch]||0)+1;
    for(const ch of target){if(bank[ch])bank[ch]--;else return ch;}
    return target[0];
  }
  F.stepBots=function(room,dt,now){
    for(const [key,p] of Object.entries(room.players||{})){
      if(!p.bot)continue;p.t=now;
      if(p.hp<=0)continue;
      const home=room.bases[key],wanted=wantedLetter(home,room.word.target);
      let goal=home;
      if(!p.carried){
        const choices=Object.values(room.letters||{}).filter(item=>item.letter===wanted);
        if(choices.length)goal=choices.reduce((best,item)=>
          Math.hypot(item.x-p.x,item.z-p.z)<Math.hypot(best.x-p.x,best.z-p.z)?item:best,choices[0]);
      }
      const angle=Math.atan2(goal.x-p.x,p.z-goal.z),diff=F.wrap(angle-p.hull);
      const turn=Math.max(-1,Math.min(1,diff/.4));
      F.drive(p,{auto:Math.hypot(goal.x-p.x,goal.z-p.z)>.8?1:0,turn,speedLevel:1},dt,room,key);
      const rivalBase=Object.entries(room.bases||{}).find(([baseKey,base])=>baseKey!==key&&base.hp>0&&Math.hypot(base.x-p.x,base.z-p.z)<5.8);
      if(rivalBase)F.placeBomb(room,key,p.bombSeq+1,now);
      if(now-p.lastFire>=850&&Math.abs(diff)<.22)F.commitFire(room,key,p.fireSeq+1,now);
    }
  };
})();
