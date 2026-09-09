/* Small texture-free overhead health bars; visual state stays local to each renderer. */
(function(){
  'use strict';
  const F=window.Frontline;
  F.makeHealthBar=function(labels,key){
    const element=document.createElement('span'),fill=document.createElement('i');
    element.className='fl-health';element.dataset.actor=key;element.setAttribute('role','progressbar');
    element.setAttribute('aria-valuemin','0');element.appendChild(fill);labels.appendChild(element);
    let previous='';
    return{element,update(player){
      const max=player.slot>=4?F.C.guardHp:F.C.maxHp,hp=Math.ceil(Math.max(0,Math.min(max,player.hp)));
      const name=player.slot>=4?'GUARD':'P'+(player.slot+1)+(player.bot?' BOT':'');
      const signature=name+':'+hp+':'+max;if(signature===previous)return;previous=signature;
      const ratio=hp/max;element.dataset.level=ratio>.5?'green':ratio>.25?'yellow':'red';
      element.setAttribute('aria-label',name+' HP');element.setAttribute('aria-valuemax',String(max));
      element.setAttribute('aria-valuenow',String(hp));element.setAttribute('aria-valuetext',hp+' / '+max+' HP');
      fill.style.transform='scaleX('+ratio+')';element.hidden=hp<=0;
    }};
  };
})();
