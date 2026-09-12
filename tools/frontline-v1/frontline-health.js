/* Small texture-free overhead health bars and floating hit numbers; visual state stays local. */
(function(){
  'use strict';
  const F=window.Frontline,LIFE=800,MAX_FLOATS=6;
  F.hpLoss=function(prev,hp){return prev==null?0:Math.max(0,Math.ceil(prev)-Math.ceil(hp));};
  F.makeHealthBar=function(labels,key){
    const element=document.createElement('span'),fill=document.createElement('i'),floats=[];
    element.className='fl-health';element.dataset.actor=key;element.setAttribute('role','progressbar');
    element.setAttribute('aria-valuemin','0');element.appendChild(fill);labels.appendChild(element);
    let previous='',lastHp=null;
    function recycle(){
      let el=floats.find(node=>node.hidden);
      if(el)return el;
      if(floats.length>=MAX_FLOATS){el=floats.shift();floats.push(el);return el;}
      el=document.createElement('span');el.className='fl-float';el.hidden=true;labels.appendChild(el);floats.push(el);
      return el;
    }
    return{
      element,
      update(player){
        const max=player.slot>=4?F.C.guardHp:F.C.maxHp,hp=Math.ceil(Math.max(0,Math.min(max,player.hp)));
        const lost=F.hpLoss(lastHp,hp);lastHp=hp;
        if(lost){const el=recycle();el.hidden=false;el.textContent='-'+lost;el.dataset.at=String(performance.now());}
        const name=player.slot>=4?'GUARD':'P'+(player.slot+1)+(player.bot?' BOT':'');
        const signature=name+':'+hp+':'+max;if(signature===previous)return;previous=signature;
        const ratio=hp/max;element.dataset.level=ratio>.5?'green':ratio>.25?'yellow':'red';
        element.setAttribute('aria-label',name+' HP');element.setAttribute('aria-valuemax',String(max));
        element.setAttribute('aria-valuenow',String(hp));element.setAttribute('aria-valuetext',hp+' / '+max+' HP');
        fill.style.transform='scaleX('+ratio+')';element.hidden=hp<=0;
      },
      lift(project,x,z,now){
        for(const el of floats){
          if(el.hidden)continue;
          const age=now-Number(el.dataset.at||now);
          if(age>=LIFE){el.hidden=true;continue;}
          project(el,x,3.35+age/LIFE*1.7,z);
          el.style.opacity=String(Math.max(0,1-age/LIFE));
        }
      },
      dispose(){element.remove();for(const el of floats)el.remove();floats.length=0;}
    };
  };
})();
