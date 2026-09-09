/* One-shot manual drops: intent revision, host acknowledgement, and bounded loose cards. */
(function(){
  'use strict';
  const F=window.Frontline;
  function dropPoint(room,key,p){
    // Prefer behind the hull. At map/base edges, keep the card reachable and outside pickup range.
    for(const offset of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,3*Math.PI/4,-3*Math.PI/4,Math.PI]){
      const angle=p.hull+offset,x=F.round(p.x-Math.sin(angle)*2.2),z=F.round(p.z+Math.cos(angle)*2.2);
      if(Math.abs(x)>F.C.halfX-1||Math.abs(z)>F.C.halfZ-1)continue;
      const protectedBase=Object.values(room.bases||{}).some(b=>b.hp>0&&Math.hypot(x-b.x,z-b.z)<=F.C.baseBlockRadius+.2);
      if(!protectedBase&&F.canOccupy(room,key,x,z))return{x,z};
    }
    return null;
  }
  F.commitDrop=function(room,key,seq,letter,revision,now){
    const p=room.players?.[key];
    if(!p||!Number.isSafeInteger(seq)||seq<1||seq<=(p.dropSeq||0))return false;
    // Acknowledge rejected intent too, so it cannot apply after a new pickup or respawn.
    p.dropSeq=seq;p.dropResult='EMPTY';
    if(p.hp<=0||!p.carried)return false;
    p.dropResult='CHANGED';
    if(letter!==p.carried||revision!==(p.carriedRevision||0))return false;
    room.letters=room.letters||{};p.dropResult='FULL';
    if(Object.keys(room.letters).filter(k=>/^ds[0-3]_/.test(k)).length>=32)return false;
    p.dropResult='BLOCKED';const point=dropPoint(room,key,p);if(!point)return false;
    let card='d'+key+'_'+seq;while(room.letters[card])card+='_';
    room.letters[card]={letter,x:point.x,z:point.z,serial:now,blockedId:key,blockedUntil:now+1250};
    p.carried='';p.dropResult=letter;return true;
  };
})();
