"use strict";
/* Round 1398 — native horizontal touch scrolling with mouse/keyboard support. */
(function(){
  const bound=new WeakSet();
  function bind(strip,label){
    if(!strip||bound.has(strip))return;bound.add(strip);
    strip.classList.add('va-swipe-strip');strip.tabIndex=0;
    strip.setAttribute('role','group');strip.setAttribute('aria-label',label+' · ปัดซ้ายขวาเพื่อดูเพิ่มเติม');
    let drag=null,suppress=false;
    strip.addEventListener('pointerdown',e=>{
      if(!e.isPrimary||e.button!==0)return;
      suppress=false;
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:strip.scrollLeft,mouse:e.pointerType==='mouse',moved:false};
    },true);
    strip.addEventListener('pointermove',e=>{
      if(!drag||drag.id!==e.pointerId)return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){
        drag.moved=true;suppress=true;
        if(drag.mouse){strip.setPointerCapture(e.pointerId);strip.classList.add('va-dragging');}
      }
      if(drag.mouse&&drag.moved){e.preventDefault();strip.scrollLeft=drag.left-dx;}
    });
    function end(e){if(!drag||drag.id!==e.pointerId)return;drag=null;strip.classList.remove('va-dragging');}
    strip.addEventListener('pointerup',end);strip.addEventListener('pointercancel',end);
    strip.addEventListener('lostpointercapture',end);
    strip.addEventListener('pointerleave',e=>{if(drag&&!drag.moved)end(e);});
    strip.addEventListener('dragstart',e=>e.preventDefault());
    strip.addEventListener('click',e=>{
      if((suppress&&e.detail!==0)||e.target.closest('[aria-disabled="true"]')){e.preventDefault();e.stopImmediatePropagation();}
    },true);
    strip.addEventListener('keydown',e=>{
      if(e.target!==strip)return;
      const step=Math.max(120,strip.clientWidth*.8),delta={ArrowLeft:-step,ArrowRight:step,Home:-strip.scrollWidth,End:strip.scrollWidth}[e.key];
      if(delta===undefined)return;e.preventDefault();e.stopPropagation();
      strip.scrollBy({left:delta,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
  }
  window.ArenaStrip={bind};
})();
