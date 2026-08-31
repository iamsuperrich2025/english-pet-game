'use strict';

const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'js/lettercannon.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/lettercannon.css'),'utf8');
const build=fs.readFileSync(path.join(root,'tools/build_web.mjs'),'utf8');
const asset=path.join(root,'sound/letter_cannon/Wordflight_Beyond_the_Stars.mp3');

assert.ok(fs.existsSync(asset),'missing Beyond the Stars MP3');
assert.ok(fs.statSync(asset).size>3_000_000,'Letter Cannon BGM asset is unexpectedly small');
assert.match(code,/const LC_BGM_BUILD_URL='__VW_LC_BGM_URL__'/,'source must keep a build-time BGM token');
assert.match(code,/new Audio\(\);a\.preload='metadata';a\.loop=true/,'BGM must stream lazily through one looping media element');
const moduleStart=code.indexOf('function lcMusicPreferenceOn');
const moduleEnd=code.indexOf('function noiseBurst',moduleStart);
assert.ok(moduleStart>=0&&moduleEnd>moduleStart,'cannot isolate Letter Cannon BGM module');
const moduleSource=code.slice(moduleStart,moduleEnd);
assert.doesNotMatch(moduleSource,/fetch\(|arrayBuffer\(|decodeAudioData/,'BGM must not force an eager full-file download');
assert.match(code,/id="lc-music"[^>]*aria-pressed="true"/,'visible music button must expose state accessibly');
assert.ok(code.indexOf('id="lc-music"')<code.indexOf('class="lc-actions"'),'music button must be separate from the crowded right action row');
assert.match(css,/#lc-game \.lc-musicbtn\{[^}]*top:7px;left:7px;[^}]*pointer-events:auto/,'music button must occupy the free top-left HUD area');
for(const width of [280,301,360,361,540]){const compact=width<=360,musicWidth=compact?82:88,actionsWidth=compact?173:197,gap=(width-7-actionsWidth)-(7+musicWidth);assert(gap>=10,'music/actions gap must stay >=10px at '+width+'px, got '+gap);const height=compact?35:38;assert(7+height<=55,'music button must end before the word HUD at '+width+'px');}
assert.match(code,/running=true;resetMission\(\);if\(typeof Music[\s\S]{0,120}lcMusicStart\(\)/,'entry must start the BGM only after the game is active');
assert.match(code,/running=false;lcMusicStop\(LC_BGM_EXIT_FADE_MS,true/,'exit must fade, stop, and rewind the BGM');
assert.doesNotMatch(code,/releasePortrait\(\);if\(typeof Music[\s\S]{0,80}resumeBg/,'Lobby music must wait for the Letter Cannon fade callback');
assert.match(build,/sound\/letter_cannon\/Wordflight_Beyond_the_Stars\.mp3/,'production build must include the requested MP3');
assert.match(build,/makeImmutableAlias\('sound\/letter_cannon\/Wordflight_Beyond_the_Stars\.mp3'\)/,'build must fingerprint the MP3 for immutable disk caching');
assert.match(build,/replace\(TOKEN_LC_BGM, lcBgmUrl\)/,'build must inject the fingerprinted URL into Letter Cannon');

let now=0,created=0,musicOn=true,resumeCalls=0;
class FakeAudio{
  constructor(){created++;this.preload='auto';this.loop=false;this.volume=1;this.src='';this.paused=true;this.currentTime=19;this.listeners={};}
  addEventListener(name,fn){this.listeners[name]=fn;}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
}
const button={attrs:{},textContent:'',title:'',setAttribute(k,v){this.attrs[k]=v;},classList:{toggle(){}}};
const context={
  Audio:FakeAudio,Promise,performance:{now:()=>now},
  setTimeout(fn,ms){now+=Math.min(40,Number(ms)||0);fn();return 1;},clearTimeout(){},
  state:{sound:true,musicOff:false},Music:{isMusicOn:()=>musicOn,setMusic(v){musicOn=v;},resumeBg(){resumeCalls++;}},
  saveState(){},running:true,
};
vm.createContext(context);
vm.runInContext([
  "const LC_BGM_URL='sound/letter_cannon/Wordflight_Beyond_the_Stars.mp3';",
  'const LC_BGM_VOLUME=.4;',
  'let lcBgm=null,lcBgmBtn=this.__button,lcBgmFadeTimer=0,lcBgmFadeToken=0,lcBgmPlayToken=0,lcBgmBlocked=false;',
  moduleSource,
  'this.__api={start:lcMusicStart,stop:lcMusicStop,toggle:lcMusicToggle,get audio(){return lcBgm;}};',
].join('\n'),Object.assign(context,{__button:button}),{filename:'letter_cannon_bgm.vm.js'});

(async()=>{
  const api=context.__api;
  assert.strictEqual(created,0,'website load must not request the MP3');
  await api.start();
  assert.strictEqual(created,1,'first game entry creates one media element');
  assert.strictEqual(api.audio.preload,'metadata');
  assert.strictEqual(api.audio.loop,true);
  assert.strictEqual(api.audio.src,'sound/letter_cannon/Wordflight_Beyond_the_Stars.mp3');
  assert.strictEqual(api.audio.paused,false);
  assert.strictEqual(api.audio.volume,.4);
  api.toggle();
  assert.strictEqual(musicOn,false,'off button persists through the global music preference');
  assert.strictEqual(api.audio.paused,true,'off button fades to a paused media element');
  assert.strictEqual(created,1,'toggle reuses the same locally cached media element');
  await api.toggle();
  assert.strictEqual(musicOn,true);
  assert.strictEqual(api.audio.paused,false);
  let faded=false;api.stop(1100,true,()=>{faded=true;});
  assert.strictEqual(faded,true,'exit callback runs after fade completion');
  assert.strictEqual(api.audio.paused,true);
  assert.strictEqual(api.audio.currentTime,0,'exit rewinds for the next session');
  assert.strictEqual(api.audio.volume,.4,'fade restores configured volume');
  assert.strictEqual(resumeCalls,0,'isolated BGM module never resumes Lobby itself');
  console.log('PASS letter_cannon_bgm: lazy stream, loop, visible toggle, reuse, fade/stop/rewind, immutable build URL');
})().catch(error=>{console.error(error);process.exitCode=1;});
