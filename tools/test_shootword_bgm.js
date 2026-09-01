'use strict';

const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'js/shootword.js'),'utf8');
const build=fs.readFileSync(path.join(root,'tools/build_web.mjs'),'utf8');
const asset=path.join(root,'sound/shootWord/Fairgame_Fun.mp3');

assert.ok(fs.existsSync(asset),'missing Fairgame Fun MP3');
assert.ok(fs.statSync(asset).size>1_000_000,'ShootWord BGM asset is unexpectedly small');
assert.match(code,/const SG_BGM_BUILD_URL='__VW_SG_BGM_URL__'/,'source must keep a build-time BGM token');
assert.match(code,/new Audio\(\);\s*a\.preload='metadata';\s*a\.loop=true/,
  'ShootWord BGM must stream lazily through one looping media element');
const moduleStart=code.indexOf('function sgMusicCanPlay');
const moduleEnd=code.indexOf('/* ============================================================\n     🖼️ Canvas textures',moduleStart);
assert.ok(moduleStart>=0&&moduleEnd>moduleStart,'cannot isolate ShootWord BGM module');
const moduleSource=code.slice(moduleStart,moduleEnd);
assert.doesNotMatch(moduleSource,/fetch\(|arrayBuffer\(|decodeAudioData/,
  'ShootWord BGM must not force an eager full-file download');
assert.match(code,/id="sg-music"[^>]*aria-pressed="true"/,
  'visible music button must expose state accessibly');
assert.match(code,/#sg-music\{[^}]*top:clamp\(54px,13vh,82px\);right:1vh;[^}]*z-index:6;[^}]*min-height:clamp\(34px,7vh,42px\)/,
  'music button must occupy the free top-right column below Exit with a clear touch target');
assert.match(code,/#sg-music\[aria-pressed="false"\]/,
  'off state must have a clearly different visual treatment');
for(const height of [375,610,812]){
  const top=Math.max(54,Math.min(height*.13,82));
  const musicBottom=top+42;
  const exitBottom=height*.01+34;
  const shootHeight=Math.max(112,Math.min(height*.30,195));
  const shootTop=height-Math.max(height*.016,0)-shootHeight;
  assert.ok(top-exitBottom>=12,'music button must stay below Exit at '+height+'px');
  assert.ok(shootTop-musicBottom>=40,'music button must stay above the right Shoot control at '+height+'px');
}
assert.match(code,/running=true; lastT=performance\.now\(\);\s*if\(typeof Music[\s\S]{0,100}sgMusicStart\(\)/,
  'entry must suspend Lobby and start ShootWord BGM only after the game is active');
assert.match(code,/running=false;\s*sgMusicStop\(SG_BGM_EXIT_FADE_MS,true/,
  'exit must fade, stop, and rewind the BGM');
assert.doesNotMatch(code,/overlay\.style\.display='none';\s*if\(typeof Music[\s\S]{0,80}resumeBg/,
  'Lobby music must wait for the ShootWord fade callback');
assert.match(build,/sound\/shootWord\/Fairgame_Fun\.mp3/,
  'production build must include the requested MP3');
assert.match(build,/makeImmutableAlias\('sound\/shootWord\/Fairgame_Fun\.mp3'\)/,
  'build must fingerprint the MP3 for immutable browser disk caching');
assert.match(build,/replace\(TOKEN_SG_BGM, sgBgmUrl\)/,
  'build must inject the fingerprinted URL into ShootWord');

let now=0,created=0;
class FakeAudio{
  constructor(){created++;this.preload='auto';this.loop=false;this.volume=1;this.src='';this.paused=true;this.currentTime=23;this.listeners={};}
  addEventListener(name,fn){this.listeners[name]=fn;}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
}
const button={attrs:{},textContent:'',title:'',setAttribute(k,v){this.attrs[k]=v;},classList:{toggle(){}}};
const context={
  Audio:FakeAudio,Promise,performance:{now:()=>now},
  setTimeout(fn,ms){now+=Math.min(40,Number(ms)||0);fn();return 1;},clearTimeout(){},
  document:{hidden:false},state:{sound:true},running:true,
};
vm.createContext(context);
vm.runInContext([
  "const SG_BGM_URL='sound/shootWord/Fairgame_Fun.mp3';",
  'const SG_BGM_VOLUME=.4;',
  'let sgBgm=null,sgBgmBtn=this.__button,sgBgmFadeTimer=0,sgBgmFadeToken=0,sgBgmPlayToken=0,sgBgmBlocked=false,sgMusicEnabled=true;',
  moduleSource,
  'this.__api={start:sgMusicStart,stop:sgMusicStop,toggle:sgMusicToggle,get audio(){return sgBgm;},get enabled(){return sgMusicEnabled;}};',
].join('\n'),Object.assign(context,{__button:button}),{filename:'shootword_bgm.vm.js'});

(async()=>{
  const api=context.__api;
  assert.strictEqual(created,0,'website load must not request the MP3');
  await api.start();
  assert.strictEqual(created,1,'first ShootWord entry creates one media element');
  assert.strictEqual(api.audio.preload,'metadata');
  assert.strictEqual(api.audio.loop,true);
  assert.strictEqual(api.audio.src,'sound/shootWord/Fairgame_Fun.mp3');
  assert.strictEqual(api.audio.paused,false);
  assert.strictEqual(api.audio.volume,.4);
  api.toggle();
  assert.strictEqual(api.enabled,false,'off button must disable ShootWord music');
  assert.strictEqual(api.audio.paused,true,'off button must fade to a paused media element');
  assert.strictEqual(created,1,'toggle must reuse the same locally cached media element');
  await api.toggle();
  assert.strictEqual(api.enabled,true);
  assert.strictEqual(api.audio.paused,false);
  let faded=false;
  api.stop(1100,true,()=>{faded=true;});
  assert.strictEqual(faded,true,'exit callback must run after fade completion');
  assert.strictEqual(api.audio.paused,true);
  assert.strictEqual(api.audio.currentTime,0,'exit must rewind for the next session');
  assert.strictEqual(api.audio.volume,.4,'fade must restore configured volume');
  console.log('PASS shootword_bgm: lazy stream, loop, clear toggle, HUD separation, reuse, fade/stop/rewind, immutable URL');
})().catch(error=>{console.error(error);process.exitCode=1;});
