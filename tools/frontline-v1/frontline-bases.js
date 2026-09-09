/* Four private letter vaults; enemy entry opens only after the vault is destroyed. */
(function () {
  'use strict';
  const F=window.Frontline;
  const spots=[{x:-18,z:18},{x:18,z:18},{x:-18,z:-18},{x:18,z:-18}];
  F.baseSpot=slot=>({...spots[slot]});
  F.newBase=function(slot,ownerId){
    const p=F.baseSpot(slot);
    return {ownerId,slot,x:p.x,z:p.z,hp:F.C.baseHp,stored:''};
  };
  F.canOccupy=function(room,key,x,z){
    for(const [baseKey,base] of Object.entries(room&&room.bases||{})){
      if(baseKey===key||base.hp<=0)continue;
      if(Math.hypot(x-base.x,z-base.z)<F.C.baseBlockRadius)return false;
    }
    return true;
  };
  F.damageBase=function(room,key,now){
    const base=room.bases&&room.bases[key];
    if(!base||base.hp<=0)return 'miss';
    base.hp=Math.max(0,base.hp-F.C.baseDamage);
    return base.hp?'base-hit':'base-down';
  };
  F.takeStored=function(base,target){
    if(!base||!base.stored)return '';
    const needed=target.split('').find(ch=>base.stored.includes(ch));
    const letter=needed||base.stored[0];
    base.stored=base.stored.replace(letter,'');
    return letter;
  };
})();
