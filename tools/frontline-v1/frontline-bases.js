/* Four private letter vaults. Homes never open; banked letters stay with the owner. */
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
      if(baseKey===key)continue;
      if(Math.hypot(x-base.x,z-base.z)<F.C.baseBlockRadius)return false;
    }
    return true;
  };
  F.damageBase=function(room,key){
    const base=room.bases&&room.bases[key];
    if(!base)return 'miss';
    return 'base-safe';
  };
  F.takeStored=function(){return '';};
})();
