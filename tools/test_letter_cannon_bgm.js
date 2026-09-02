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
assert.match(code,/id="lc-music"[^>]*aria-pressed="true"[^>]*data-state="waiting"[^>]*aria-label=/,'visible music button must expose its initial waiting state accessibly');
assert.match(css,/\.lc-musicbtn\[data-state="on"\][^}]*#158d66/,'playing state must be visibly green');
assert.match(css,/\.lc-musicbtn\[data-state="off"\][^}]*#a83c52/,'off state must be visibly red');
assert.match(css,/\.lc-musicbtn\[data-state="waiting"\][^}]*#ffe283/,'waiting-for-gesture state must be visibly amber');
assert.ok(code.indexOf('id="lc-music"')<code.indexOf('class="lc-actions"'),'music button must be separate from the crowded right action row');
assert.match(css,/#lc-game \.lc-musicbtn\{[^}]*top:7px;left:7px;[^}]*pointer-events:auto/,'music button must occupy the free top-left HUD area');
for(const width of [280,301,360,361,540]){const compact=width<=360,musicWidth=compact?82:88,actionsWidth=compact?173:197,gap=(width-7-actionsWidth)-(7+musicWidth);assert(gap>=10,'music/actions gap must stay >=10px at '+width+'px, got '+gap);const height=compact?35:38;assert(7+height<=55,'music button must end before the word HUD at '+width+'px');}
assert.match(code,/function lcMusicPreferenceOn\(\)\{return lcMusicEnabled;\}/,'Dragon music must use a fresh session preference instead of persisted Lobby music-off');
assert.match(code,/function open\(\)\{[^}]*opening=true;lcMusicEnabled=true;lcBgmBlocked=false;if\(typeof Music[^}]*suspendBg\)Music\.suspendBg\(\);lcMusicStart\(\);requestPortrait\(\);Promise\.all/,'entry must request BGM playback synchronously inside the menu click gesture');
assert.match(code,/token!==lcBgmPlayToken\|\|\(!running&&!opening\)/,'gesture-started BGM must remain active while game assets finish loading');
assert.match(code,/running=true;resetMission\(\);if\(typeof Music[\s\S]{0,120}lcMusicStart\(\)/,'active game start must reaffirm BGM playback');
assert.match(code,/root\.addEventListener\('pointerdown',lcMusicUserGesture,[\s\S]{0,180}root\.addEventListener\('click',lcMusicUserGesture,[\s\S]{0,180}window\.addEventListener\('keydown',lcMusicUserGesture/,'any touch, click, or key inside the game must retry blocked BGM');
assert.match(code,/running=false;lcMusicStop\(LC_BGM_EXIT_FADE_MS,true/,'exit must fade, stop, and rewind the BGM');
assert.doesNotMatch(code,/releasePortrait\(\);if\(typeof Music[\s\S]{0,80}resumeBg/,'Lobby music must wait for the Letter Cannon fade callback');
assert.match(build,/sound\/letter_cannon\/Wordflight_Beyond_the_Stars\.mp3/,'production build must include the requested MP3');
assert.match(build,/makeImmutableAlias\('sound\/letter_cannon\/Wordflight_Beyond_the_Stars\.mp3'\)/,'build must fingerprint the MP3 for immutable disk caching');
assert.match(build,/replace\(TOKEN_LC_BGM, lcBgmUrl\)/,'build must inject the fingerprinted URL into Letter Cannon');
const toggleSoundSource=code.slice(code.indexOf('function toggleSound(){'),code.indexOf('function pause(',code.indexOf('function toggleSound(){')));
assert.doesNotMatch(toggleSoundSource,/lcMusicStart|lcMusicStop/,'sound-effects toggle must never start or stop the independent BGM');
const precacheSource=build.slice(build.indexOf('const precache ='),build.indexOf('const swPath',build.indexOf('const precache =')));
assert.doesNotMatch(precacheSource,/lcBgmUrl|Wordflight_Beyond_the_Stars/,'large BGM must stay out of Service Worker precache');

let now=0,created=0,resumeCalls=0,blockNext=false,playCalls=0;
class FakeAudio{
  constructor(){created++;this.preload='auto';this.loop=false;this.volume=1;this.src='';this.paused=true;this.currentTime=19;this.listeners={};}
  addEventListener(name,fn){this.listeners[name]=fn;}
  play(){playCalls++;if(blockNext){blockNext=false;this.paused=true;return Promise.reject(new Error('NotAllowedError'));}this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
}
const button={attrs:{},dataset:{},textContent:'',title:'',setAttribute(k,v){this.attrs[k]=v;if(k==='data-state')this.dataset.state=v;},classList:{toggle(){}}};
const context={
  Audio:FakeAudio,Promise,performance:{now:()=>now},
  setTimeout(fn,ms){now+=Math.min(40,Number(ms)||0);fn();return 1;},clearTimeout(){},
  state:{sound:false,musicOff:true},Music:{isMusicOn:()=>false,setMusic(){throw new Error('Dragon BGM must not mutate the Lobby preference');},resumeBg(){resumeCalls++;}},
  saveState(){},running:true,opening:false,
};
vm.createContext(context);
vm.runInContext([
  "const LC_BGM_URL='sound/letter_cannon/Wordflight_Beyond_the_Stars.mp3';",
  'const LC_BGM_VOLUME=.4;',
  'let lcBgm=null,lcBgmBtn=this.__button,lcBgmFadeTimer=0,lcBgmFadeToken=0,lcBgmPlayToken=0,lcBgmBlocked=false,lcMusicEnabled=true;',
  moduleSource,
  'this.__api={start:lcMusicStart,stop:lcMusicStop,toggle:lcMusicToggle,gesture:lcMusicUserGesture,get audio(){return lcBgm;},get enabled(){return lcMusicEnabled;}};',
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
  assert.strictEqual(button.textContent,'🎵 เปิดอยู่','Dragon music defaults on despite persisted Lobby music-off and muted effects');
  assert.strictEqual(button.dataset.state,'on','playing state is explicit');
  assert.match(moduleSource,/function lcMusicCanPlay\(\)\{return lcMusicPreferenceOn\(\);\}/,'BGM preference must be independent from the sound-effects switch');
  assert.doesNotMatch(moduleSource,/masterOff|state\.sound|state\.musicOff|Music\.isMusicOn|Music\.setMusic/,'BGM module must not inherit or mutate global audio preferences');
  api.toggle();
  assert.strictEqual(api.enabled,false,'off button controls only this Dragon session');
  assert.strictEqual(api.audio.paused,true,'off button fades to a paused media element');
  assert.strictEqual(button.textContent,'🔇 ปิดอยู่','off state is explicit instead of an ambiguous action label');
  assert.strictEqual(button.dataset.state,'off');
  assert.strictEqual(created,1,'toggle reuses the same locally cached media element');
  await api.toggle();
  assert.strictEqual(api.enabled,true);
  assert.strictEqual(api.audio.paused,false);
  blockNext=true;api.audio.pause();await api.start();
  assert.strictEqual(button.textContent,'▶ รอแตะจอ','blocked state clearly says any screen tap will start music');
  assert.strictEqual(button.dataset.state,'waiting');
  const callsBeforeGesture=playCalls;await api.gesture({target:{closest(){return null;}}});
  assert.strictEqual(playCalls,callsBeforeGesture+1,'first ordinary game touch retries playback automatically');
  assert.strictEqual(api.enabled,true,'automatic retry keeps the session music enabled');
  assert.strictEqual(api.audio.paused,false,'ordinary game touch starts the music without pressing the music button');
  assert.strictEqual(button.textContent,'🎵 เปิดอยู่');assert.strictEqual(button.dataset.state,'on');
  let faded=false;api.stop(1100,true,()=>{faded=true;});
  assert.strictEqual(faded,true,'exit callback runs after fade completion');
  assert.strictEqual(api.audio.paused,true);
  assert.strictEqual(api.audio.currentTime,0,'exit rewinds for the next session');
  assert.strictEqual(api.audio.volume,.4,'fade restores configured volume');
  assert.strictEqual(resumeCalls,0,'isolated BGM module never resumes Lobby itself');
  console.log('PASS letter_cannon_bgm: any-screen-touch autoplay retry, explicit on/off/waiting UI, session-on independence, lazy loop/reuse, fade/rewind/cache');
})().catch(error=>{console.error(error);process.exitCode=1;});
