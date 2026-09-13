"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const code=read('js/wordship.js');
const shoot=read('js/shootword.js');
const html=read('index_classic.html');
const ui=read('js/ui.js');
const city=read('js/city3d.js');
const main=read('js/main.js');
const home=read('js/home-v2.js');
const css=read('css/wordship.css');
const build=read('tools/build_web.mjs');
const stateCode=read('js/state.js');

assert(html.includes('id="btn-rail-wordship"')&&html.includes('กองเรือคำศัพท์'),'classic rail button');
assert(html.includes('id="btn-rail-wordship"')&&/\bid="btn-rail-wordship"[^>]*\bhidden\b/.test(html),'classic rail starts hidden so public first paint cannot open it');
assert(ui.includes('function wordShipAdminAllowed')&&ui.includes('WORDSHIP_LOCK_MSG')&&ui.includes('if(!wordShipAdminAllowed())'),'lobby refuses to download or open the game for non-admins');
assert(ui.includes('function refreshWordShipLock')&&ui.includes('b.hidden=!ok'),'rail visibility follows admin login');
assert(city.includes("b.go==='wordship'")&&city.includes('cityAdminAccess')&&city.includes('เปิดให้แอดมินเท่านั้น'),'3D city harbor explains the admin lock instead of travelling');
assert(home.includes("'wordship'")&&home.includes("ADMIN_ONLY_WORLD_ACTIONS")&&/'wordship'/.test((home.match(/const ADMIN_ONLY_WORLD_ACTIONS = new Set\(\[([\s\S]*?)\]\)/)||[])[1]||''),'Home V2 hides the card from non-admins');
assert(code.includes('function adminAllowed')&&code.includes("isAdmin()===true"),'game open itself re-checks admin');
assert(!/<script[^>]+js\/wordship\.js/.test(html)&&!html.includes('href="css/wordship.css"'),'game JS/CSS are not in the lobby HTML download');
assert(ui.includes("loadScriptOnce('js/wordship.js')")&&ui.includes("loadStylesheetOnce('wordship-css','css/wordship.css')"),'first click lazy-loads the module');
assert(ui.includes('async function openWordShip')&&ui.includes('btn-rail-wordship'),'lobby binder lives in ui.js');
assert(main.includes("wordship:'#btn-rail-wordship'"),'city go=wordship routes to the rail button');
assert(city.includes("bld('wordship'")&&city.includes('กองเรือคำศัพท์'),'3D city harbor');
assert(!city.includes('CapsuleGeometry'),'city marker uses existing cylinder helper');
assert(home.includes("['wordship','ship','กองเรือคำศัพท์','#btn-rail-wordship']")&&home.includes("wordship:'⚓'"),'Home V2 card');
assert(home.includes('wordship:\'#btn-rail-wordship\''),'Home V2 click delegates to classic rail');
assert(stateCode.includes('wshScore:0')&&stateCode.includes('wshWords:0')&&stateCode.includes('wshIntro:0'),'save fields');
assert(build.includes("'js/wordship.js'")&&build.includes("'css/wordship.css'"),'production copy list');
assert(!code.includes('http')&&!code.includes('fetch(')&&!code.includes('.mp3')&&!code.includes('.webp')&&!code.includes('.png')&&!code.includes('.avif'),'no extra media or vocab network calls');
assert(code.includes("typeof vocabForStudent==='function'")&&code.includes('MINLEN=3, MAXLEN=10'),'same ShootWord length rules');
assert(shoot.includes('const MINLEN=3, MAXLEN=10'),'ShootWord still owns the source length rule');
assert(css.includes('@media(max-height:430px)')&&css.includes('#wsh-game')&&!css.includes('overflow:auto'),'short landscape HUD without inner scrollbars');

const awarded={n:0};
const sandbox={
  console, performance:{now:()=>0}, Math, setTimeout:fn=>0, clearTimeout(){},
  requestAnimationFrame:()=>1, cancelAnimationFrame(){},
  window:{AudioContext:null, webkitAudioContext:null, addEventListener(){}, devicePixelRatio:1},
  document:{readyState:'complete', addEventListener(){}, getElementById(){return null;}, createElement(){return {style:{},classList:{add(){},remove(){}},appendChild(){},addEventListener(){},querySelector(){return null},setAttribute(){}};}, body:{appendChild(){}}},
  state:{student:{grade:'ป.1'}, sound:false, wshScore:0, wshWords:0, wshIntro:0},
  vocabForStudent:()=>[['cat','แมว'],['dog','สุนัข'],['bird','นก'],['apple','แอปเปิล'],['to','ถึง'],['extraordinarily','ยาวเกิน'],['book','หนังสือ']],
  addCoins(n){awarded.n+=n;}, saveState(){}, Music:{suspendBg(){}, resumeBg(){}}, toast(){}
};
sandbox.window=sandbox; sandbox.document.body=sandbox.document.body;
vm.createContext(sandbox); vm.runInContext(code, sandbox);
const T=sandbox.WordShip._t;
assert(T.adminAllowed()===false,'missing admin identity cannot open the fleet');
sandbox.isAdmin=()=>true;
assert(T.adminAllowed()===true,'admin identity can open the fleet');

function shootPool(src){
  const seen=new Set(), out=[];
  src.forEach(pair=>{
    const w=String(pair[0]||'').toUpperCase().replace(/[^A-Z]/g,'');
    if(w.length>=3 && w.length<=10 && !seen.has(w)) out.push(w);
  });
  return out.sort();
}
assert.strictEqual(JSON.stringify(T.pool().map(x=>x.w).sort()), JSON.stringify(shootPool(sandbox.vocabForStudent())), 'Word Fleet pool matches ShootWord filtering of the same in-memory list');
assert(!T.pool().some(x=>x.w==='TO'||x.w==='EXTRAORDINARILY'), 'too-short and too-long words stay out');
assert(T.pool().some(x=>x.w==='CAT'&&x.th==='แมว'), 'Thai meaning rides along from vocabForStudent');

T.setViewport(812,375); T.resetRun();
assert.strictEqual(T.MAX_FLEET,1,'only one enemy ship is allowed');
assert.strictEqual(T.fleet.filter(s=>s.alive).length,1, 'exactly one live ship');
assert(T.fleet[0].target && T.fleet[0].word===T.word.w, 'the single hull carries the target word');
const lim=T.waterLimits();
assert(T.fleet[0].y>=lim.top && T.fleet[0].y<=lim.bottom, 'spawn stays in the water band');
assert(lim.top>=375*T.WATER_HORIZON, 'water top is not above the horizon / sky');
const far=T.spawnWave(T.pickCourse('nearFar',1));
assert.strictEqual(far.mode,'nearFar','near-to-far course is available');
assert(far.vx>0 && far.vy<0,'left-to-right near-to-far moves right and away');
assert.strictEqual(Math.hypot(far.vx,far.vy).toFixed(3), T.shipSpeed().toFixed(3), 'course speed is constant');
const nearScale=T.depthScale(far.startY), farScale=T.depthScale(far.endY);
assert(nearScale>farScale, 'far water uses a smaller hull than near water');
far.y=far.endY; T.applyShipScale(far);
assert(far.w<far.baseW && far.scale===farScale, 'hull shrinks when it sails farther');
const left=T.spawnWave(T.pickCourse('flat',-1));
assert(left.vx<0 && Math.abs(left.vy)<1e-9,'right-to-left flat course keeps a constant depth');
T.step(.05);
assert(T.fleet[0].y>=lim.top && T.fleet[0].y<=lim.bottom, 'after moving, the ship is still in the water');
assert.strictEqual(Math.hypot(T.fleet[0].vx,T.fleet[0].vy).toFixed(3), T.shipSpeed().toFixed(3), 'speed does not change while sailing');

const coins0=awarded.n;
T.resetRun();
const target=T.fleet.find(s=>s.target);
const pay=T.HIT_COIN+target.word.length*2+T.PERFECT_BONUS;
T.hitShip(target);
assert.strictEqual(awarded.n,coins0+pay,'correct sink pays letter coins plus word bonus');
assert.strictEqual(T.wordsDone,1,'completed word advances the round counter');
assert(T.settleScoreRun()>0,'lifetime score settles once');
assert.strictEqual(T.settleScoreRun(),0,'second settle does not double-count');

T.resetRun(); T.setRunning(true); T.setPaused(false);
const fired=T.fire(); assert(fired,'player can fire a shell');
assert(T.shells.some(s=>s.alive),'shell is pooled rather than allocated unbounded');
for(let i=0;i<80;i++) T.fire();
assert(T.shells.length<=40,'shell pool is capped');

console.log('wordship ok');
