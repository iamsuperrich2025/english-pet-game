/* Regression for F1 sample engine lifecycle, RPM response, shift/drop, fallback and scope guards. */
'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const f1=fs.readFileSync(path.join(root,'js/f1_3d.js'),'utf8');
const asset=path.join(root,'sound/racing/engineSound.mp3');

assert.ok(fs.existsSync(asset),'missing F1 engine sample');
assert.ok(fs.statSync(asset).size>100000,'F1 engine sample is unexpectedly small');
assert.strictEqual(fs.readFileSync(asset).subarray(0,3).toString('ascii'),'ID3','engine asset must be a valid tagged MP3');
assert.ok(/const ENGINE_URL='sound\/racing\/engineSound\.mp3'/.test(f1),'runtime asset path mismatch');
assert.ok(/Snd\.tick\(spd,audioThr,[^;]+braking,camMode\)/.test(f1),'physics must pass throttle/brake/camera state to audio');
assert.ok(/function exitWorld\(\)[\s\S]*?Snd\.stop\(\)/.test(f1),'leaving F1 must dispose audio');
assert.strictEqual((f1.match(/Snd\.start\(\)/g)||[]).length,4,'audio unlock must remain limited to four user-gesture handlers');

const st=f1.indexOf('const Snd=(function(){');
const en=f1.indexOf('\nconst GEARS=',st);
assert.ok(st>=0&&en>st,'cannot isolate F1 sound module');
const sndSource=f1.slice(st,en);

function param(v=0){
  return {value:v,setTargetAtTime(x){this.value=x;},setValueAtTime(x){this.value=x;},
    linearRampToValueAtTime(x){this.value=x;},exponentialRampToValueAtTime(x){this.value=x;},cancelScheduledValues(){}};
}
function node(extra={}){ return Object.assign({connect(){return this;},disconnect(){},start(){},stop(){}},extra); }
class FakeAudioContext{
  constructor(){this.currentTime=1;this.sampleRate=8000;this.state='running';this.destination=node();}
  createGain(){return node({gain:param()});}
  createOscillator(){return node({frequency:param(),type:'sine'});}
  createBiquadFilter(){return node({frequency:param(),Q:param(),type:'lowpass'});}
  createBufferSource(){return node({playbackRate:param(1),loop:false,buffer:null});}
  createBuffer(ch,n){const data=new Float32Array(n);return {getChannelData(){return data;}};}
  decodeAudioData(){return Promise.resolve({duration:12});}
  resume(){this.state='running';return Promise.resolve();}
  close(){this.state='closed';return Promise.resolve();}
}

async function main(){
  let failFetch=false, warnings=0;
  const context={
    state:{sound:true},
    window:{AudioContext:FakeAudioContext},
    fetch:async()=>{if(failFetch)throw new Error('offline');return {ok:true,arrayBuffer:async()=>new ArrayBuffer(16)};},
    console:{warn(){warnings++;}},
    setTimeout(fn){fn();return 1;},
    Math,Promise,ArrayBuffer,Float32Array,
    clamp:(v,a,b)=>v<a?a:(v>b?b:v),
    lerp:(a,b,t)=>a+(b-a)*t,
    GEARS:[0,13,21,30,40,52,65,79,93],
    gearOf(v){for(let i=1;i<this.GEARS.length;i++){if(v<=this.GEARS[i])return i;}return 8;}
  };
  /* The runtime calls gearOf as a free function, not as a method. */
  context.gearOf=function(v){for(let i=1;i<context.GEARS.length;i++){if(v<=context.GEARS[i])return i;}return 8;};
  vm.createContext(context);
  vm.runInContext(`${sndSource}\nthis.__Snd=Snd;`,context,{filename:'f1_3d.audio.js'});
  const S=context.__Snd;

  assert.strictEqual(S.on,false,'audio must not autoplay during module initialization');
  S.start();
  await new Promise(resolve=>setImmediate(resolve));
  assert.strictEqual(S.mode,'sample','valid MP3 decode must replace the temporary synth');
  assert.strictEqual(S.asset,'sound/racing/engineSound.mp3');

  for(let i=0;i<60;i++)S.tick(0,0,false,1/60,false,false,'cockpit');
  assert.ok(S.rpm<0.01&&S.rpmActual<4200,'idle must settle near 4,000 RPM');
  for(let i=0;i<60;i++)S.tick(i*0.18,1,false,1/60,false,false,'cockpit');
  assert.ok(S.rpm>0.7&&S.rpmActual>14500,'full throttle must build toward high RPM');

  for(let i=0;i<30;i++)S.tick(12.9,1,false,1/60,false,false,'cockpit');
  const preShift=S.rpm;
  S.tick(13.1,1,false,1/60,false,false,'cockpit');
  assert.ok(S.rpm<preShift,'upshift must create a brief smooth RPM drop');

  const high=S.rpm;
  for(let i=0;i<30;i++)S.tick(13.1-i*0.32,0,false,1/60,false,true,'chase');
  assert.ok(S.rpm<high&&S.rpm>0.05,'braking/deceleration must lower RPM progressively, not snap to idle');
  S.stop();
  assert.strictEqual(S.on,false); assert.strictEqual(S.mode,'off');

  failFetch=true;
  S.start();
  await new Promise(resolve=>setImmediate(resolve));
  assert.strictEqual(S.mode,'fallback','load failure must keep synthesized engine available');
  assert.strictEqual(warnings,1,'fallback should log one concise development warning');
  S.stop();
  console.log('PASS f1_engine_audio: asset/sample, user unlock, RPM, upshift, braking, fallback, cleanup');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
