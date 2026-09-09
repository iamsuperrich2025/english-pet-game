/* Two neutral anti-collusion wardens target the current word leader without consuming player seats. */
(function () {
  'use strict';
  const F=window.Frontline;
  F.spawnGuards=function(now){
    return{
      g0:{id:'guard-0',slot:4,bot:true,x:-5,z:0,hull:0,turret:0,hp:F.C.guardHp,t:now,fireSeq:0,lastFire:0,respawnAt:0},
      g1:{id:'guard-1',slot:4,bot:true,x:5,z:0,hull:0,turret:0,hp:F.C.guardHp,t:now,fireSeq:0,lastFire:0,respawnAt:0}
    };
  };
  function leader(room,guard){
    const entries=Object.entries(room.players||{}).filter(([,p])=>p.hp>0);
    return entries.sort((a,b)=>{
      const ap=F.wordMarks(room.bases[a[0]].stored,room.word.target).filter(Boolean).length+(a[1].carried?.5:0);
      const bp=F.wordMarks(room.bases[b[0]].stored,room.word.target).filter(Boolean).length+(b[1].carried?.5:0);
      return bp-ap||Math.hypot(a[1].x-guard.x,a[1].z-guard.z)-Math.hypot(b[1].x-guard.x,b[1].z-guard.z);
    })[0];
  }
  F.stepGuards=function(room,dt,now){
    room.guards=room.guards||F.spawnGuards(now);
    for(const [key,guard] of Object.entries(room.guards)){
      guard.t=now;
      if(guard.hp<=0){
        if(now>=guard.respawnAt){
          const fresh=F.spawnGuards(now)[key];Object.assign(guard,fresh,{fireSeq:guard.fireSeq,lastFire:guard.lastFire});
          if(F.clearSpawn)F.clearSpawn(room,guard,'guard');
        }
        continue;
      }
      const targetEntry=leader(room,guard);if(!targetEntry)continue;
      const target=targetEntry[1],angle=Math.atan2(target.x-guard.x,guard.z-target.z),diff=F.wrap(angle-guard.hull);
      F.drive(guard,{auto:Math.hypot(target.x-guard.x,target.z-guard.z)>7?1:0,
        turn:Math.max(-1,Math.min(1,diff/.35)),speedLevel:1},dt,room,'guard');
      if(now-guard.lastFire>=750&&Math.abs(diff)<.18)F.commitGuardFire(room,key,guard.fireSeq+1,now);
    }
  };
})();
