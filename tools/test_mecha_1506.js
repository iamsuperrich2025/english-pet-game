'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('Round 1506')||fx.includes('รอบ 1506'),'round mark');
assert(fx.includes('CAPACITY=512'),'capacity 512');
assert(fx.includes('fireRing=!!shot.ballistic || !!shot.hit'),'fire ring any land');
assert(fx.includes('fireRing?1500:280')||fx.includes('(shot.ballistic||shot.hit)?1500:280'),'1.5s volumetric blast');
assert(fx.includes('function world('),'world-up helper');
assert(fx.includes('function streak('),'radial streak helper');
assert(fx.includes('SMOKE=0x2a1a12'),'dark smoke');
assert(fx.includes('ROCK=0x3a3228'),'rock debris');
assert(fx.includes('STREAK=0xffaa28'),'streak color');
assert(fx.includes("world('crystal'"),'crystal debris');
assert(fx.includes('streak(ox,oy,oz'),'streaks drawn');
assert(/for\(let j=0;j<14;j\+\+\)/.test(fx),'14 fire puffs / streaks');
assert(/for\(let j=0;j<12;j\+\+\)/.test(fx),'12 smoke puffs');
assert(/for\(let j=0;j<22;j\+\+\)/.test(fx),'22 gravity sparks');
assert(fx.includes('6.2*t*t')||fx.includes('5.8*t*t'),'gravity on debris/sparks');
assert(fx.includes('opacity:.42'),'stronger bloom halo');

console.log('mecha-1506 volumetric fireball checks passed');
