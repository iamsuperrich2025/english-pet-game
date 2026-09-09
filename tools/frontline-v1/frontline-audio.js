/* Cute sound director: gameplay cues, distance mixing, engine, music and mobile lifecycle. */
(function(){
  'use strict';
  const F=window.Frontline,KEY='vw.frontline.sound.v1';
  F.makeAudio=function(){
    let context=null,synth=null,score=null,engine=null,muted=false,disposed=false,playing=false;
    let previous=null,lastLow=0,lastTick=0,rewardCues=0;const counts={},cooldowns=new Map();
    try{muted=localStorage.getItem(KEY)==='off';}catch(_){}
    function ready(){return !disposed&&!muted&&!document.hidden&&context?.state==='running';}
    function unlock(){
      if(disposed)return;
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
      try{
        if(!context){context=new Audio({latencyHint:'interactive'});synth=F.makeSynth(context);score=F.makeScore(context,synth);}
        synth.silence(muted||document.hidden);
        if(context.state==='suspended'&&!document.hidden)context.resume().catch(()=>{});
        score.set(playing&&!muted&&!document.hidden);
      }catch(_){/* Audio is optional; unavailable devices can still play. */}
    }
    function cue(name,strength=1,pan=0){
      if(!ready()||strength<.015)return;
      const now=context.currentTime,gap={shot:.065,impact:.1,explosion:.16,hit:.18,click:.08,fuse:.18}[name]||.06;
      if(now-(cooldowns.get(name)??-10)<gap)return;cooldowns.set(name,now);counts[name]=(counts[name]||0)+1;
      const t=(f,d=0,len=.14,v=.06,type='sine',end=f)=>synth.tone(f,d,len,v*strength,type,end,pan);
      const notes=(list,step=.09,v=.065)=>list.forEach((f,i)=>t(f,i*step,.25,v,'triangle'));
      switch(name){
        case 'shot':t(430,0,.12,.10,'triangle',100);t(900,.012,.06,.045,'sine',400);synth.puff(.09,.055*strength,1500,pan);break;
        case 'impact':t(170,0,.23,.11,'sine',55);synth.puff(.22,.1*strength,950,pan);t(780,.03,.12,.025,'triangle',280);break;
        case 'explosion':t(130,0,.55,.18,'sine',38);t(240,.03,.32,.07,'triangle',70);synth.puff(.6,.18*strength,1200,pan);notes([659,880,1046],.055,.018);break;
        case 'bomb':t(340,0,.15,.085,'sine',140);t(900,.08,.12,.045,'sine',700);break;
        case 'fuse':t(1050,0,.045,.035,'sine',1350);break;
        case 'pickup':notes([659,880,1318]);break;
        case 'drop':notes([880,659,440],.065);break;
        case 'bank':notes([523,659,784,1046],.085);break;
        case 'hit':t(230,0,.22,.085,'triangle',110);t(380,.05,.16,.04,'sine',210);break;
        case 'down':notes([523,392,330,262],.12);break;
        case 'respawn':notes([392,523,659,784],.09);break;
        case 'baseDown':notes([440,330,220],.1);synth.puff(.4,.07,650,pan);break;
        case 'low':t(659,0,.14,.035);t(523,.18,.15,.035);break;
        case 'round':notes([523,784,1046]);break;
        case 'join':notes([392,523,659,784]);break;
        case 'disconnect':notes([440,330],.16,.035);break;
        case 'error':notes([330,294],.12,.04);break;
        case 'speed':t(440+strength*180,0,.12,.035);break;
        default:t(660,0,.075,.035,'sine',880);
      }
    }
    function stopEngine(){if(engine){try{engine.node.stop();}catch(_){}engine.node.disconnect();engine.gain.disconnect();engine=null;}}
    function update(room,local,id,input,active){
      if(!local)return;
      const moving=active&&local.hp>0&&!!input.auto;
      if(ready()&&playing){
        if(!engine){const node=context.createOscillator(),gain=context.createGain();node.type='triangle';gain.gain.value=0;
          node.connect(gain);gain.connect(synth.master);node.start();engine={node,gain};}
        engine.node.frequency.setTargetAtTime(moving?58+input.speedLevel*16:42,context.currentTime,.15);
        engine.gain.gain.setTargetAtTime(moving?.026:0,context.currentTime,.1);
        if(previous&&previous.speed!==input.speedLevel)cue('speed',input.speedLevel+.2);
        if(previous&&previous.auto!==input.auto)cue('click');
        if(local.hp>0&&local.hp<F.C.maxHp*.25&&context.currentTime-lastLow>6){cue('low');lastLow=context.currentTime;}
        const near=Object.values(room.bombs||{}).filter(b=>!b.explodedAt&&Math.hypot(b.x-local.x,b.z-local.z)<9);
        if(near.length&&context.currentTime-lastTick>.35){cue('fuse');lastTick=context.currentTime;}
      }
      previous={speed:input.speedLevel,auto:input.auto};
    }
    function spatial(name,x,z,focus){if(!focus)return;const distance=Math.hypot(x-focus.x,z-focus.z);
      cue(name,Math.max(0,1-distance/38)*.75,Math.max(-.8,Math.min(.8,(x-focus.x)/20)));}
    function visibility(){
      if(document.hidden){score?.set(false);synth?.silence(true);synth?.stopVoices();stopEngine();context?.suspend().catch(()=>{});}
      else unlock();
    }
    const timer=setInterval(()=>{if(ready())score?.tick();},100);
    document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',visibility);
    return{unlock,cue,spatial,update,
      start(){playing=true;unlock();cue('join');},
      reward(won){if(!ready())return;rewardCues++;score.duck();const notes=won?[523,659,784,1046,1318,1568]:[659,784,1046];
        notes.forEach((f,i)=>synth.tone(f,i*.13,.4,won?.095:.055,'triangle'));},
      shot(){cue('shot');},
      toggle(){muted=!muted;try{localStorage.setItem(KEY,muted?'off':'on');}catch(_){}unlock();if(muted){synth?.stopVoices();stopEngine();}return !muted;},
      inspect(){return{muted,state:context?.state||'unavailable',voices:synth?.inspect().voices||0,rewardCues,...synth?.inspect(),...score?.inspect(),cues:{...counts}};},
      dispose(){disposed=true;playing=false;clearInterval(timer);document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);
        document.removeEventListener('visibilitychange',visibility);stopEngine();synth?.dispose();context?.close().catch(()=>{});}
    };
  };
})();
