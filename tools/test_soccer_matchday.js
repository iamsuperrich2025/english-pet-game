'use strict';

const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const adv=fs.readFileSync(path.join(root,'js/adventure3d.js'),'utf8');
const css=fs.readFileSync(path.join(root,'js/adv3d_css.js'),'utf8');
const build=fs.readFileSync(path.join(root,'tools/build_web.mjs'),'utf8');
const serve=fs.readFileSync(path.join(root,'tools/serve_dist.mjs'),'utf8');
const song=path.join(root,'sound/football/Stadium_Celebration.mp3');
const sky=path.join(root,'img/sky/sky_soccer_day.avif');
const crowd=path.join(root,'img/tex/soccer_crowd_matchday.avif');

function avif(pathname,min,max){
  assert.ok(fs.existsSync(pathname),'missing '+path.relative(root,pathname));
  const data=fs.readFileSync(pathname),size=data.length;
  assert.ok(size>=min&&size<=max,`${path.basename(pathname)} unexpected ${size} bytes`);
  assert.strictEqual(data.subarray(4,8).toString('ascii'),'ftyp',path.basename(pathname)+' must be a real encoded image');
  assert.match(data.subarray(8,32).toString('ascii'),/avif|avis/,path.basename(pathname)+' must use AVIF, not a renamed file');
}
avif(sky,20_000,80_000);
avif(crowd,350_000,650_000);
assert.ok(fs.existsSync(song),'missing requested Stadium Celebration MP3');
assert.ok(fs.statSync(song).size>4_000_000,'football BGM is unexpectedly small');

assert.match(adv,/soccer:'sky_soccer_day'/,'soccer must use its dedicated match-day panorama');
assert.match(adv,/sky_soccer_day:\['avif','webp','jpg','png'\]/,'soccer sky must prefer AVIF with safe fallbacks');
assert.match(adv,/soccer_crowd_matchday[\s\S]{0,100}\['\.avif','\.webp'\]/,'stand must load the optimized match-day crowd texture');
assert.match(adv,/crowd\.rotation\.x=\.1\d?/,'crowd façade must lean away from the pitch, not flatten toward it');
assert.match(adv,/camH = sbLive\?3\.4:1\.0[\s\S]{0,1500}camera\.lookAt\(foc\.x\+dx\*5, foc\.y\+0\.3, foc\.z\+dz\*5\)/,'third-person camera must preserve target-like sky/field/player framing');
assert.match(adv,/soccerScoreboardTexture[\s\S]*?PLAY TOGETHER/,'stadium must include the target-like match-day scoreboard');
assert.match(adv,/soccerFloodTexture[\s\S]*?PlaneGeometry\(5\.1,2\.8\)/,'stadium must include bright lattice floodlights');
assert.match(adv,/const SOCCER_BGM_BUILD_URL='__VW_SOCCER_BGM_URL__'/,'source must keep the football BGM build token');
const musicStart=adv.indexOf('function soccerMusicCanPlay');
const musicEnd=adv.indexOf('/* 🔊 เสียงสนามสังเคราะห์',musicStart);
assert.ok(musicStart>=0&&musicEnd>musicStart,'cannot isolate soccer BGM module');
const musicSource=adv.slice(musicStart,musicEnd);
assert.match(musicSource,/new Audio\(\); a\.preload='metadata'; a\.loop=true/,'football BGM must lazy stream through a looping media element');
assert.doesNotMatch(musicSource,/fetch\(|arrayBuffer\(|decodeAudioData/,'football BGM must not eagerly download/decode the full file');
assert.match(adv,/soccerMusicSessionStart\(\);[\s\S]{0,160}SoccerAudio\.amb\(\)/,'music must begin only after the player presses ลงสนาม');
assert.match(adv,/soccerMusicStop\(SOCCER_BGM_EXIT_FADE_MS,true/,'football exit must fade, pause, and rewind');
assert.match(adv,/if\(!exitSoccer&&typeof Music!=='undefined'\) Music\.resumeBg\(\)/,'lobby music must wait until the football fade ends');
assert.match(adv,/id="adv-soccer-music"[^>]*aria-pressed="true"/,'music button must expose accessible state');
assert.match(css,/#adv-soccer-music\{[^}]*top:208px;right:8px/,'music button must live in the dedicated right-column gap');
assert.match(css,/@media \(max-height:400px\)[\s\S]*?#adv-soccer-music\{top:207px/,'music button must have a compact 812x375 layout');
assert.match(css,/@media \(max-height:330px\)[\s\S]*?#adv-aura\{top:168px;right:170px\}[\s\S]*?#adv-soccer-music\{top:auto;right:152px;bottom:26px;min-width:84px/,'ultra-short touch layout must separate aura, music, power, words, and kick controls');
assert.match(css,/@media \(max-height:290px\)[\s\S]*?#adv-joy\{width:56px;height:56px;bottom:8px\}/,'ultra-short touch layout must keep the aim stick clear of the full-size spin pad');
assert.match(build,/sound\/football\/Stadium_Celebration\.mp3/,'build must include the requested MP3');
assert.match(build,/img\/sky\/sky_soccer_day\.avif/,'build must include the match-day sky');
assert.match(build,/img\/tex\/soccer_crowd_matchday\.avif/,'build must include the match-day crowd');
assert.match(build,/makeImmutableAlias\('sound\/football\/Stadium_Celebration\.mp3'\)/,'build must fingerprint the MP3 for immutable browser disk caching');
assert.match(build,/adventureText\.replace\(TOKEN_SOCCER_BGM, soccerBgmUrl\)/,'build must inject the immutable URL into adventure3d');
assert.match(serve,/'\.avif': 'image\/avif'/,'local production server must return AVIF with the correct MIME type for visual QA');
assert.match(serve,/setHeader\('Accept-Ranges', 'bytes'\)[\s\S]*?writeHead\(206,[\s\S]*?createReadStream\(file, \{ start, end \}\)/,'production preview must stream media ranges instead of forcing a full MP3 download');

let now=0,created=0;
class FakeAudio{
  constructor(){created++;this.preload='auto';this.loop=false;this.volume=1;this.src='';this.paused=true;this.currentTime=31;this.listeners={};}
  addEventListener(name,fn){this.listeners[name]=fn;}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
}
const button={attrs:{},textContent:'',title:'',setAttribute(k,v){this.attrs[k]=v;},classList:{toggle(){}}};
const context={
  Audio:FakeAudio,Promise,performance:{now:()=>now},
  setTimeout(fn,ms){now+=Math.min(40,Number(ms)||0);fn();return 1;},clearTimeout(){},
  document:{hidden:false},state:{sound:true},
};
vm.createContext(context);
vm.runInContext([
  "const SOCCER_BGM_URL='sound/football/Stadium_Celebration.mp3';",
  'const SOCCER_BGM_VOLUME=.42;',
  'let soccerBgm=null,soccerBgmBtn=this.__button,soccerBgmFadeTimer=0,soccerBgmFadeToken=0,soccerBgmPlayToken=0;',
  'let soccerBgmBlocked=false,soccerMusicEnabled=true,soccerMusicSession=false;',
  musicSource,
  'this.__api={sessionStart:soccerMusicSessionStart,start:soccerMusicStart,stop:soccerMusicStop,toggle:soccerMusicToggle,visibility:soccerMusicVisibilityChange,get audio(){return soccerBgm;},get enabled(){return soccerMusicEnabled;}};',
].join('\n'),Object.assign(context,{__button:button}),{filename:'soccer_matchday_bgm.vm.js'});

(async()=>{
  const api=context.__api;
  assert.strictEqual(created,0,'MP3 must not be requested at website/world load or in the kit screen');
  api.sessionStart(); await Promise.resolve();
  assert.strictEqual(created,1,'ลงสนาม must create exactly one media element');
  assert.strictEqual(api.audio.preload,'metadata');
  assert.strictEqual(api.audio.loop,true);
  assert.strictEqual(api.audio.src,'sound/football/Stadium_Celebration.mp3');
  assert.strictEqual(api.audio.paused,false);
  api.toggle(); assert.strictEqual(api.enabled,false); assert.strictEqual(api.audio.paused,true);
  api.toggle(); await Promise.resolve(); assert.strictEqual(api.enabled,true); assert.strictEqual(api.audio.paused,false); assert.strictEqual(created,1,'toggle must reuse the cached media element');
  context.document.hidden=true; api.visibility(); assert.strictEqual(api.audio.paused,true,'hidden tab must pause without resetting');
  context.document.hidden=false; api.visibility(); await Promise.resolve(); assert.strictEqual(api.audio.paused,false,'visible tab must resume the same media element');
  let faded=false; api.stop(1100,true,()=>{faded=true;});
  assert.strictEqual(faded,true); assert.strictEqual(api.audio.paused,true); assert.strictEqual(api.audio.currentTime,0); assert.strictEqual(api.audio.volume,.42);
  console.log('PASS soccer_matchday: AVIF assets, stadium depth, HUD safe slot, lazy metadata stream, reuse, visibility pause, fade/stop/rewind, immutable URL');
})().catch(error=>{console.error(error);process.exitCode=1;});
