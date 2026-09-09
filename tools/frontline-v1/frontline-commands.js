/* The elected host consumes per-seat inputs without racing other writers on room state. */
(function(){
  'use strict';
  const F=window.Frontline;
  // Room heartbeats are outputs of simulation. Elect from incoming commands so
  // a sleeping host cannot prevent the next live phone from restarting that simulation.
  F.commandLeader=(room,commands,now)=>Object.keys(room?.players||{}).filter(key=>{
    const p=room.players[key],c=commands&&commands[key];
    return !p.bot&&c?.uid===p.id&&Number.isFinite(c.t)&&c.t<=now+1000&&now-c.t<F.C.hostLeaseMs;
  }).sort()[0];
  F.applyCommands=function(room,commands,now){
    for(const [key,c] of Object.entries(commands||{})){
      const p=room.players&&room.players[key];
      if(!p||p.bot||p.id!==c.uid||now-c.t>F.C.leaseMs||c.t<p.t)continue;
      if(p.hp>0&&(c.bumpSeq||0)===(p.bumpSeq||0)){
        const limit=F.C.speeds[2]*Math.min(.3,Math.max(0,(c.t-p.t)/1000)),dx=c.x-p.x,dz=c.z-p.z,d=Math.hypot(dx,dz);
        const scale=d>limit&&d?limit/d:1;
        if(F.moveTank)F.moveTank(p,room,key,p.x+dx*scale,p.z+dz*scale);
        else Object.assign(p,F.tankPose(c));
        p.hull=c.hull;p.turret=c.turret;
      }
      p.t=c.t;
      F.commitDrop(room,key,c.dropSeq,c.dropLetter,c.dropRevision,now);
      if(p.hp>0){F.commitFire(room,key,c.fireSeq,now);F.placeBomb(room,key,c.bombSeq,now);}
      else{p.fireSeq=Math.max(p.fireSeq,c.fireSeq);p.bombSeq=Math.max(p.bombSeq,c.bombSeq);}
    }
    return room;
  };
})();
