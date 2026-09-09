/* Hull-direction locomotion with three live speeds, protected bases, and no lateral slide. */
(function () {
  'use strict';
  const F=window.Frontline;
  F.newTank=function(id,slot,now,bot=false){
    const home=F.baseSpot?F.baseSpot(slot):{x:(slot-1.5)*3,z:9};
    return {id,slot,bot,x:home.x,z:home.z,hull:slot<2?Math.PI:0,turret:slot<2?Math.PI:0,
      hp:F.C.maxHp,carried:'',carriedRevision:0,dropSeq:0,dropResult:'',t:now,fireSeq:0,lastFire:0,bombSeq:0,lastBomb:0,respawnAt:0};
  };
  F.drive=function(tank,input,dt,room,key){
    if(tank.hp<=0)return '';
    dt=Math.max(0,Math.min(dt,.05));
    tank.hull=F.wrap(tank.hull+input.turn*F.C.turnSpeed*dt);tank.turret=tank.hull;
    const level=Math.max(0,Math.min(2,Number.isInteger(input.speedLevel)?input.speedLevel:1));
    const speed=input.auto===1?F.C.speeds[level]:input.auto===-1?-F.C.reverseSpeeds[level]:0;
    const rawX=tank.x+Math.sin(tank.hull)*speed*dt,rawZ=tank.z-Math.cos(tank.hull)*speed*dt;
    const nx=Math.max(-F.C.halfX+1,Math.min(F.C.halfX-1,rawX));
    const nz=Math.max(-F.C.halfZ+1,Math.min(F.C.halfZ-1,rawZ));
    if(!speed||!dt)return '';
    // Only the real arena edge and intact rival vaults block driving. Garden props are visual.
    if(room&&F.canOccupy&&!F.canOccupy(room,key,nx,nz))return 'base';
    if(room&&F.moveTank){if(F.moveTank(tank,room,key,nx,nz))return 'tank';}
    else{tank.x=nx;tank.z=nz;}
    return Math.abs(rawX-nx)>1e-8||Math.abs(rawZ-nz)>1e-8?'edge':'';
  };
  F.tankPose=p=>({x:F.round(p.x),z:F.round(p.z),hull:F.round(p.hull),turret:F.round(p.turret)});
})();
