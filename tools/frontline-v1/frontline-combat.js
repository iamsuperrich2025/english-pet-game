/* Authoritative shell collision for rivals, vaults, and two neutral anti-collusion wardens. */
(function () {
  'use strict';
  const F=window.Frontline;
  function rayCircle(sx,sz,dx,dz,target,radius,limit){
    const x=target.x-sx,z=target.z-sz,along=x*dx+z*dz;
    if(along<=.1||along>=limit)return null;
    const side2=x*x+z*z-along*along,r2=radius*radius;if(side2>=r2)return null;
    return Math.max(.1,along-Math.sqrt(r2-Math.max(0,side2)));
  }
  F.pickHit=function(pose,room,shooterId,guardShot=false){
    const dx=Math.sin(pose.turret),dz=-Math.cos(pose.turret),sx=pose.x+dx*1.55,sz=pose.z+dz*1.55;
    let distance=F.C.range,targetType='',targetId='';
    function consider(type,id,target,radius){
      const hit=rayCircle(sx,sz,dx,dz,target,radius,distance);
      if(hit===null)return;distance=hit;targetType=type;targetId=id;
    }
    for(const [id,base] of Object.entries(room.bases||{})){
      if((guardShot||id!==shooterId)&&base.hp>0)consider('base',id,base,F.C.baseBlockRadius);
    }
    for(const [id,p] of Object.entries(room.players||{})){
      if(id!==shooterId&&p.hp>0)consider('player',id,p,1.05);
    }
    if(!guardShot)for(const [id,guard] of Object.entries(room.guards||{})){
      if(guard.hp>0)consider('guard',id,guard,1.05);
    }
    return{targetType,targetId,distance:F.round(distance),x:F.round(sx),z:F.round(sz),
      endX:F.round(sx+dx*distance),endZ:F.round(sz+dz*distance)};
  };
  function event(room,id,seq,hit,kind,dropped,now){
    room.events=room.events||{};room.events[id]={id:seq,x:hit.x,z:hit.z,endX:hit.endX,endZ:hit.endZ,
      targetType:hit.targetType,targetId:hit.targetId,kind,dropped:dropped||'',at:now,
      hitAt:Math.round(now+hit.distance/F.C.bulletSpeed*1000)};
  }
  F.commitFire=function(room,id,seq,now){
    const p=room&&room.players&&room.players[id];
    if(!p||p.hp<=0||seq<=p.fireSeq||now-p.lastFire<F.C.fireMs)return false;
    const hit=F.pickHit(p,room,id),target=hit.targetType==='player'&&room.players[hit.targetId];
    let kind='miss',dropped='';
    if(target){
      target.hp=Math.max(0,target.hp-F.C.tankDamage);dropped=F.dropCarried(room,hit.targetId,target.x,target.z,now);
      if(!target.hp)target.respawnAt=now+F.C.respawnMs;kind=target.hp?'tank-hit':'tank-down';
    }else if(hit.targetType==='base')kind=F.damageBase(room,hit.targetId,now);
    else if(hit.targetType==='guard'){
      const guard=room.guards[hit.targetId];guard.hp=Math.max(0,guard.hp-F.C.tankDamage);
      if(!guard.hp)guard.respawnAt=now+F.C.guardRespawnMs;kind=guard.hp?'guard-hit':'guard-down';
    }
    p.fireSeq=seq;p.lastFire=now;event(room,id,seq,hit,kind,dropped,now);return true;
  };
  F.commitGuardFire=function(room,id,seq,now){
    const guard=room.guards&&room.guards[id];
    if(!guard||guard.hp<=0||seq<=guard.fireSeq||now-guard.lastFire<F.C.fireMs)return false;
    const hit=F.pickHit(guard,room,id,true),target=hit.targetType==='player'&&room.players[hit.targetId];
    let kind='miss',dropped='';
    if(target){
      target.hp=Math.max(0,target.hp-F.C.tankDamage);dropped=F.dropCarried(room,hit.targetId,target.x,target.z,now);
      if(!target.hp)target.respawnAt=now+F.C.respawnMs;kind=target.hp?'tank-hit':'tank-down';
    }else if(hit.targetType==='base')kind=F.damageBase(room,hit.targetId,now);
    guard.fireSeq=seq;guard.lastFire=now;event(room,id,seq,hit,kind,dropped,now);return true;
  };
})();
