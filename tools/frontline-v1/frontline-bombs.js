/* Unlimited bombs with a short placement interval, timed fuse, radial damage, and chains. */
(function () {
  'use strict';
  const F=window.Frontline;
  F.placeBomb=function(room,key,seq,now){
    const p=room&&room.players&&room.players[key];if(!p)return false;room.bombs=room.bombs||{};
    if(p.hp<=0||seq<=p.bombSeq||now-p.lastBomb<F.C.bombCooldown)return false;
    p.bombSeq=seq;p.lastBomb=now;
    room.bombs[key+'_'+seq]={id:seq,owner:key,x:F.round(p.x),z:F.round(p.z),explodeAt:now+F.C.bombFuse,explodedAt:0};
    return true;
  };
  function blastTank(room,key,p,bomb,now){
    if(p.hp<=0||Math.hypot(p.x-bomb.x,p.z-bomb.z)>F.C.bombRadius)return;
    p.hp=Math.max(0,p.hp-F.C.bombDamage);F.dropCarried(room,key,p.x,p.z,now);
    if(!p.hp)p.respawnAt=now+F.C.respawnMs;
  }
  F.stepBombs=function(room,now){
    room.bombs=room.bombs||{};
    const queue=Object.values(room.bombs).filter(b=>!b.explodedAt&&now>=b.explodeAt);
    while(queue.length){
      const bomb=queue.shift();if(bomb.explodedAt)continue;bomb.explodedAt=now;
      for(const [key,p] of Object.entries(room.players||{}))blastTank(room,key,p,bomb,now);
      for(const guard of Object.values(room.guards||{})){
        if(guard.hp<=0||Math.hypot(guard.x-bomb.x,guard.z-bomb.z)>F.C.bombRadius)continue;
        guard.hp=Math.max(0,guard.hp-F.C.bombDamage);if(!guard.hp)guard.respawnAt=now+F.C.guardRespawnMs;
      }
      for(const base of Object.values(room.bases||{})){
        if(base.hp>0&&Math.hypot(base.x-bomb.x,base.z-bomb.z)<=F.C.bombRadius+1)base.hp=Math.max(0,base.hp-F.C.bombBaseDamage);
      }
      for(const other of Object.values(room.bombs)){
        if(!other.explodedAt&&other!==bomb&&Math.hypot(other.x-bomb.x,other.z-bomb.z)<=F.C.bombRadius){
          other.explodeAt=now;queue.push(other);
        }
      }
    }
    for(const [key,bomb] of Object.entries(room.bombs))if(bomb.explodedAt&&now-bomb.explodedAt>650)delete room.bombs[key];
  };
})();
