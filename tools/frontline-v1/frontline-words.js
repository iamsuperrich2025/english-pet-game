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
