/* Shared Arena letter/home HUD math — same edge-arrow rules as Frontline. */
(function(){
'use strict';
function remain(target,stored,carried){
  const word=String(target||'').toUpperCase().replace(/[^A-Z]/g,''),bank={};
  if(stored&&typeof stored==='object'&&!Array.isArray(stored)){for(const [ch,n] of Object.entries(stored))if(n>0)bank[ch]=n;}
  else for(const ch of stored||'')bank[ch]=(bank[ch]||0)+1;
  if(Array.isArray(carried))for(const ch of carried)bank[ch]=(bank[ch]||0)+1;
  else if(carried)bank[carried]=(bank[carried]||0)+1;
  const left={};
  for(const ch of word){if(bank[ch]>0)bank[ch]--;else left[ch]=(left[ch]||0)+1;}
  return left;
}
function neededLetterHints(items,from,left){
  const ox=from&&from.x||0,oz=from&&from.z||0,best={};
  for(const item of items||[]){
    if(!left||!left[item.letter])continue;
    const d=Math.hypot(item.x-ox,item.z-oz);
    if(!best[item.letter]||d<best[item.letter].d)best[item.letter]={letter:item.letter,x:item.x,z:item.z,d};
  }
  return Object.values(best);
}
function placeLetterHint(px,py,width,height){
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
}
window.ArenaNav={remain,neededLetterHints,placeLetterHint};
})();
