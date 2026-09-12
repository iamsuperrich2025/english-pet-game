/* Per-player letter banks and winner-only target-word rewards. */
(function () {
  'use strict';
  const F=window.Frontline;
  // Same word/Thai pairs as ShootWord.pool(), without loading the shooting game's renderer.
  const words=vocabForStudent().map(pair=>({target:String(pair[0]).toUpperCase().replace(/[^A-Z]/g,''),translation:pair[1]}))
    .filter(w=>w.target.length>=3&&w.target.length<=8&&w.translation);
  words.sort((a,b)=>Number(b.target==='APPLE')-Number(a.target==='APPLE'));
  F.wordTranslation=target=>words.find(w=>w.target===target)?.translation||'';
  F.newWord=round=>({...words[round%words.length],round,completedAt:0,winnerId:''});
  F.wordMarks=function(stored,target){
    const bank={};for(const ch of stored||'')bank[ch]=(bank[ch]||0)+1;
    return target.split('').map(ch=>{if(bank[ch]){bank[ch]--;return true;}return false;});
  };
  F.hasWord=(stored,target)=>F.wordMarks(stored,target).every(Boolean);
  F.carryHelps=function(stored,target,carried){
    if(!carried||!target)return false;
    return F.wordMarks(stored||'',target).some((done,i)=>!done&&target[i]===carried);
  };
  F.neededLetterHints=function(room,key,from){
    const word=room&&room.word,target=word&&word.target||'';
    if(!target||word.completedAt)return [];
    const remain={};
    F.wordMarks(room.bases&&room.bases[key]&&room.bases[key].stored||'',target).forEach((done,i)=>{
      if(!done)remain[target[i]]=(remain[target[i]]||0)+1;
    });
    const carried=room.players&&room.players[key]&&room.players[key].carried;
    if(carried&&remain[carried]&&!--remain[carried])delete remain[carried];
    const ox=from&&from.x||0,oz=from&&from.z||0,best={};
    for(const item of Object.values(room.letters||{})){
      if(!remain[item.letter])continue;
      const d=Math.hypot(item.x-ox,item.z-oz);
      if(!best[item.letter]||d<best[item.letter].d)best[item.letter]={letter:item.letter,x:item.x,z:item.z,d};
    }
    return Object.values(best);
  };
  F.ownBaseHint=function(room,key){
    const base=room&&room.bases&&room.bases[key];
    return base?{x:base.x,z:base.z}:null;
  };
  F.placeLetterHint=function(px,py,width,height){
    const padX=52,padTop=86,padBottom=124,minX=padX,maxX=width-padX,minY=padTop,maxY=height-padBottom;
    if(px>=minX&&px<=maxX&&py>=minY&&py<=maxY)return {visible:false,x:px,y:py,angle:0};
    const cx=width/2,cy=Math.min(Math.max(height*.42,minY+20),maxY-20),dx=px-cx,dy=py-cy;
    let t=1;
    if(dx>1e-6)t=Math.min(t,(maxX-cx)/dx);
    if(dx<-1e-6)t=Math.min(t,(minX-cx)/dx);
    if(dy>1e-6)t=Math.min(t,(maxY-cy)/dy);
    if(dy<-1e-6)t=Math.min(t,(minY-cy)/dy);
    t=Math.max(0,Math.min(1,t));
    return {visible:true,x:cx+dx*t,y:cy+dy*t,angle:Math.atan2(dx,-dy)};
  };
  F.completeWord=function(room,key,now){
    if(room.word.completedAt)return false;
    const base=room.bases&&room.bases[key];
    if(!base||!F.hasWord(base.stored,room.word.target))return false;
    let stored=base.stored;
    for(const ch of room.word.target)stored=stored.replace(ch,'');
    base.stored=stored;room.word.completedAt=now;room.word.winnerId=key;
    room.rewards=room.rewards||{};room.rewards[key]=(room.rewards[key]||0)+F.C.reward;
    return true;
  };
})();
