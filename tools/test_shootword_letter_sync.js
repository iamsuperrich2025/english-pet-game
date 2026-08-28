"use strict";
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');

const project=process.argv[2]||path.join(__dirname,'..');
const src=fs.readFileSync(path.join(project,'js','shootword.js'),'utf8');

function canvas(){
  const ctx=new Proxy({}, {get(target,key){
    if(key==='createLinearGradient') return ()=>({addColorStop(){}});
    if(key==='measureText') return ()=>({width:10});
    if(!(key in target)) target[key]=()=>{};
    return target[key];
  }});
  return {width:0,height:0,getContext:()=>ctx};
}
class CanvasTexture { constructor(source){ this.source=source; } }
const sandbox={
  console, Math, setTimeout:()=>1, clearTimeout(){}, setInterval:()=>1, clearInterval(){},
  requestAnimationFrame:()=>1, cancelAnimationFrame(){}, performance:{now:()=>1000},
  innerWidth:812, innerHeight:375, devicePixelRatio:1,
  document:{readyState:'complete',addEventListener(){},getElementById(){return null;},createElement:canvas},
  state:{student:{grade:'ป.1'},sound:false},
  vocabForStudent:()=>[['book','หนังสือ']],
  THREE:{CanvasTexture}
};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(src,sandbox,{filename:'shootword.js'});

const api=sandbox.ShootWord._t;
function plate(){
  return {
    letter:'X',st:'up',t:0,pend:null,ci:0,glow:0,
    hinge:{rotation:{x:0}},
    mesh:{material:[{},{},{},{},{map:null,needsUpdate:false}],scale:{set(){}}}
  };
}
for(let i=0;i<18;i++) api.plates.push(plate());
api.nextWord(true);

function upCount(ch){ return api.plates.filter(p=>p.st==='up'&&p.letter===ch).length; }
assert(upCount('B')>=1 && upCount('O')>=2 && upCount('K')>=1,
  'initial BOOK deal must expose every required letter including duplicate O');

// Reproduce the intermittent bug: both future O targets were shot out of order and are folding.
api.plates.filter(p=>p.letter==='O').forEach(p=>{ p.st='fall'; p.hinge.rotation.x=-1; });
assert.strictEqual(upCount('O'),0,'fixture must remove both visible O targets');
assert.strictEqual(api.ensureRemainingLetters(),true,'board invariant should repair missing future letters');
assert(upCount('O')>=2,'BOOK must immediately expose two O targets again');

assert(src.includes('pos>=word.w.length) nextWord(true)'),
  'reopening after the completed-word timer elapsed must start a fresh word');
assert(src.includes('dealToken===boardDealToken && word===dealWord'),
  'stale board callbacks must not overwrite the current word');

console.log('PASS shootword letter/word sync regression (duplicate future targets + reopen + stale deal guard)');
