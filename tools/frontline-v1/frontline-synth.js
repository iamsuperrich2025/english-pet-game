/* Original toy instruments: short bounded voices, shared limiter and reusable noise. */
(function(){
  'use strict';
  const F=window.Frontline;
  F.makeSynth=function(context){
    const master=context.createGain(),limiter=context.createDynamicsCompressor(),active=new Set();
    master.gain.value=.6;limiter.threshold.value=-18;limiter.knee.value=18;limiter.ratio.value=5;
    master.connect(limiter);limiter.connect(context.destination);
    const noise=context.createBuffer(1,context.sampleRate*.7,context.sampleRate),data=noise.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
    let closed=false,peak=0;
    function voice(source,delay,duration,volume,pan=0,filter=null){
      if(closed||context.state!=='running'||active.size>=24){source.disconnect();return;}
      const gain=context.createGain(),at=context.currentTime+delay;
      const panner=context.createStereoPanner?context.createStereoPanner():null;
      gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
      source.connect(filter||gain);if(filter)filter.connect(gain);
      if(panner){panner.pan.value=pan;gain.connect(panner);panner.connect(master);}else gain.connect(master);
      const item={source,gain,panner,filter};active.add(item);peak=Math.max(peak,active.size);
      source.onended=()=>{active.delete(item);source.disconnect();gain.disconnect();panner?.disconnect();filter?.disconnect();};
      source.start(at);source.stop(at+duration+.02);
    }
    function tone(frequency,delay=.0,duration=.16,volume=.06,type='sine',end=frequency,pan=0){
      if(closed||context.state!=='running'||active.size>=24)return;
      const node=context.createOscillator(),at=context.currentTime+delay;node.type=type;
      node.frequency.setValueAtTime(frequency,at);node.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);
      voice(node,delay,duration,volume,pan);
    }
    function puff(duration=.18,volume=.04,cutoff=900,pan=0){
      if(closed||context.state!=='running'||active.size>=24)return;
      const source=context.createBufferSource(),filter=context.createBiquadFilter();source.buffer=noise;
      filter.type='lowpass';filter.frequency.value=cutoff;voice(source,0,duration,volume,pan,filter);
    }
    return{tone,puff,master,
      silence(muted){master.gain.setTargetAtTime(muted?0:.6,context.currentTime,.025);},
      stopVoices(){for(const v of active){try{v.source.stop();}catch(_){}}},
      inspect:()=>({voices:active.size,peakVoices:peak}),
      dispose(){closed=true;this.stopVoices();master.disconnect();limiter.disconnect();}
    };
  };
})();
