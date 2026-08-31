'use strict';

const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const f1=fs.readFileSync(path.join(root,'js/f1_3d.js'),'utf8');
const build=fs.readFileSync(path.join(root,'tools/build_web.mjs'),'utf8');
const asset=path.join(root,'sound/racing/Velocity_Vocabulary.mp3');

assert.ok(fs.existsSync(asset),'missing Velocity Vocabulary MP3');
assert.ok(fs.statSync(asset).size>3_000_000,'Racing BGM asset is unexpectedly small');
assert.match(f1,/const RACE_BGM_BUILD_URL='__VW_F1_RACE_BGM_URL__'/,'source must keep a build-time BGM token');
assert.match(f1,/new Audio\(\)[\s\S]*?preload='metadata'[\s\S]*?loop=true/,
  'Racing BGM must stream lazily through a looping media element');
assert.doesNotMatch(f1.slice(f1.indexOf('function raceMusicPreferenceOn'),f1.indexOf('const GEARS=')),/fetch\(|arrayBuffer\(|decodeAudioData/,
  'Racing BGM must not perform an eager full-buffer download');
assert.match(f1,/id="f1-statusright"[\s\S]*?id="f1-laps"[\s\S]*?id="f1-musicbtn"/,
  'music button must live in the non-overlapping top-right status column');
assert.match(f1,/id="f1-musicbtn"[^>]*aria-pressed="true"/,'music button must expose its state accessibly');
assert.match(f1,/running=true;\s*raceMusicStart\(\)/,'Racing entry must start BGM only after the world is active');
assert.match(f1,/function exitWorld\(\)\{\s*running=false;\s*raceMusicStop\(RACE_BGM_EXIT_FADE_MS,true/,
  'Racing exit must fade, stop, and rewind the BGM');
assert.doesNotMatch(f1,/exitBox\.classList\.remove\('on'\);\s*if\(typeof Music[\s\S]{0,80}resumeBg/,
  'lobby music must not resume immediately over the Racing fade');
assert.match(build,/Velocity_Vocabulary\.mp3/,'build must include the requested untracked MP3');
assert.match(build,/makeImmutableAlias\('sound\/racing\/Velocity_Vocabulary\.mp3'\)/,
  'build must fingerprint the MP3 for immutable browser disk caching');
assert.match(build,/replace\(TOKEN_F1_RACE_BGM, f1RaceBgmUrl\)/,
  'build must inject the fingerprinted MP3 URL into the lazy Racing engine');

const st=f1.indexOf('function raceMusicPreferenceOn');
const en=f1.indexOf('const GEARS=',st);
assert.ok(st>=0&&en>st,'cannot isolate Racing BGM module');
const moduleSource=f1.slice(st,en);

let now=0,created=0,musicOn=true,resumeCalls=0;
class FakeAudio {
  constructor(){created++;this.preload='auto';this.loop=false;this.volume=1;this.src='';this.paused=true;this.currentTime=17;this.listeners={};}
  addEventListener(name,fn){this.listeners[name]=fn;}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
}
const button={attrs:{},textContent:'',title:'',setAttribute(k,v){this.attrs[k]=v;},classList:{toggle(){}}};
const context={
  Audio:FakeAudio,
  Promise,
  performance:{now:()=>now},
  setTimeout(fn,ms){now+=Math.min(40,Number(ms)||0);fn();return 1;},
  clearTimeout(){},
  document:{hidden:false},
  state:{sound:true,musicOff:false},
  Music:{isMusicOn:()=>musicOn,setMusic(v){musicOn=v;},resumeBg(){resumeCalls++;}},
  saveState(){},
  running:true,
};
vm.createContext(context);
vm.runInContext([
  "const RACE_BGM_URL='sound/racing/Velocity_Vocabulary.mp3';",
  'const RACE_BGM_VOLUME=.42;',
  'let raceBgm=null,raceBgmBtn=this.__button,raceBgmFadeTimer=0,raceBgmFadeToken=0,raceBgmPlayToken=0,raceBgmBlocked=false;',
  moduleSource,
  'this.__api={start:raceMusicStart,stop:raceMusicStop,toggle:raceMusicToggle,get audio(){return raceBgm;}};',
].join('\n'),Object.assign(context,{__button:button}),{filename:'f1_race_bgm.vm.js'});

(async()=>{
  const api=context.__api;
  assert.strictEqual(created,0,'MP3 must not be requested when the website loads');
  await api.start();
  assert.strictEqual(created,1,'first Racing entry must create exactly one media element');
  assert.strictEqual(api.audio.preload,'metadata');
  assert.strictEqual(api.audio.loop,true);
  assert.strictEqual(api.audio.src,'sound/racing/Velocity_Vocabulary.mp3');
  assert.strictEqual(api.audio.paused,false);
  assert.strictEqual(api.audio.volume,.42);

  api.toggle();
  assert.strictEqual(musicOn,false,'off button must persist through the existing global music preference');
  assert.strictEqual(api.audio.paused,true,'off button must fade to a paused media element');
  assert.strictEqual(created,1,'toggle must reuse the locally cached media element');

  await api.toggle();
  assert.strictEqual(musicOn,true);
  assert.strictEqual(api.audio.paused,false);
  let faded=false;
  api.stop(1100,true,()=>{faded=true;});
  assert.strictEqual(faded,true,'exit callback must run after fade completion');
  assert.strictEqual(api.audio.paused,true);
  assert.strictEqual(api.audio.currentTime,0,'exit must rewind for the next Racing session');
  assert.strictEqual(api.audio.volume,.42,'fade must restore configured volume for the next entry');
  assert.strictEqual(resumeCalls,0,'isolated BGM module must not resume lobby music itself');

  console.log('PASS f1_race_bgm: lazy stream, loop, accessible toggle, reuse, fade/stop/rewind, immutable build URL');
})().catch((error)=>{console.error(error);process.exitCode=1;});
