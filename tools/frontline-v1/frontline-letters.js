/* Persistent A-Z field pickups, carried tokens, deposits, drops, and destroyed-base raids. */
(function () {
  'use strict';
  const F=window.Frontline;
  function randomPoint(index,serial){
    for(let pass=0;pass<8;pass++){
      const seed=(index+1)*97+(serial+pass*31)*193;
      const x=F.round((Math.sin(seed*12.9898)*43758.5453%1)*74);
      const z=F.round((Math.sin((seed+17)*78.233)*12345.6789%1)*74);
      const safe=[0,1,2,3].every(slot=>{const b=F.baseSpot(slot);return Math.hypot(x-b.x,z-b.z)>7;});
      if(safe)return{x,z};
    }
    return{x:(index%2?1:-1)*(34+(index%5)*7),z:(index%3-1)*32};
  }
  F.spawnLetters=function(){
    const letters={};
    F.C.alphabet.split('').forEach((letter,index)=>{
      const p=randomPoint(index,0);letters['a'+index]={letter,x:p.x,z:p.z,serial:0};
    });
    return letters;
  };
  F.relocateLetter=function(item){
    const index=item.letter.charCodeAt(0)-65;item.serial=(item.serial||0)+1;
    const p=randomPoint(index,item.serial);item.x=p.x;item.z=p.z;
  };
  F.dropCarried=function(room,key,x,z,now){
    const p=room.players&&room.players[key];if(!p||!p.carried)return '';
    const letter=p.carried;p.carried='';
    room.letters['d'+key]={letter,x:F.round(x),z:F.round(z),serial:now,blockedId:key,blockedUntil:now+1250};
    return letter;
  };
  F.tickLetters=function(room,now){
    for(const [key,p] of Object.entries(room.players||{})){
      if(p.hp<=0)continue;
      const own=room.bases&&room.bases[key];
      if(p.carried&&own&&Math.hypot(p.x-own.x,p.z-own.z)<=F.C.baseRadius){
        own.stored+=p.carried;p.carried='';
        F.completeWord(room,key,now);
        continue;
      }
      if(p.carried)continue;
      let picked='';
      for(const [letterKey,item] of Object.entries(room.letters||{})){
        if(item.blockedId===key&&now<(item.blockedUntil||0))continue;
        if(Math.hypot(p.x-item.x,p.z-item.z)>F.C.pickupRadius)continue;
        picked=item.letter;
        if(letterKey[0]==='a')F.relocateLetter(item);else delete room.letters[letterKey];
        break;
      }
      if(picked){p.carried=picked;p.carriedRevision=(p.carriedRevision||0)+1;continue;}
      for(const [baseKey,base] of Object.entries(room.bases||{})){
        if(baseKey===key||base.hp>0||Math.hypot(p.x-base.x,p.z-base.z)>F.C.baseRadius)continue;
        p.carried=F.takeStored(base,room.word.target);
        if(p.carried){p.carriedRevision=(p.carriedRevision||0)+1;break;}
      }
      if(!p.carried&&own)F.completeWord(room,key,now);
    }
  };
})();
