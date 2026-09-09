/* Original 96 BPM garden march; pentatonic marimba, soft bass, tiny shakers. No music files. */
(function(){
  'use strict';
  window.Frontline.makeScore=function(context,synth){
    const melody=[0,4,7,9,7,4,2,-1,4,7,12,9,7,4,2,-1,0,2,4,7,9,7,4,-1,7,4,2,0,2,4,0,-1];
    const roots=[0,5,9,7],beat=60/96/2;let index=0,next=0,enabled=false,duckUntil=0;
    function tick(){
      if(!enabled||context.state!=='running')return;
      if(next<context.currentTime-.1)next=context.currentTime+.04;
      while(next<context.currentTime+.15){
        const delay=next-context.currentTime,note=melody[index%melody.length],quiet=context.currentTime<duckUntil?.24:1;
        if(note>=0)synth.tone(523.25*Math.pow(2,note/12),delay,.23,.023*quiet,'sine');
        if(index%4===0)synth.tone(130.81*Math.pow(2,roots[Math.floor(index/8)%4]/12),delay,.43,.029*quiet,'triangle');
        if(index%2===1)synth.tone(1400,delay,.035,.005*quiet,'sine',1050);
        index++;next+=beat;
      }
    }
    return{tick,duck(){duckUntil=context.currentTime+2.5;},
      set(active){if(enabled===active)return;enabled=active;next=context.currentTime+.04;},inspect:()=>({musicPlaying:enabled,musicNotes:index})};
  };
})();
