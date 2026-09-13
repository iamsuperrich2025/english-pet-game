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
assert(T.word&&T.word.w.length>=3, 'wave starts with a grade-safe word');
assert(T.fleet.filter(s=>s.alive).length>=2, 'at least one decoy ship sails with the target');
assert.strictEqual(T.fleet.filter(s=>s.alive&&s.target).length,1, 'exactly one target ship');
assert(T.fleet.every(s=>s.word), 'every hull shows an English word');
const decoy=T.fleet.find(s=>!s.target);
const coins0=awarded.n;
T.hitShip(decoy);
assert.strictEqual(awarded.n,coins0,'wrong hull never pays coins');
assert.strictEqual(T.misses,1,'wrong shot is counted');
assert.strictEqual(decoy.alive,true,'decoy stays afloat so the child can read it again');

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
