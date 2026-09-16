'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('รอบ 1492')||fx.includes('Round 1492')||fx.includes('Round 1505')||fx.includes('รอบ 1505')||fx.includes('Round 1506')||fx.includes('รอบ 1506'),'round mark');
assert(fx.includes('fireRing=!!shot.ballistic || !!shot.hit'),'fire ring on any ballistic impact');
assert(
  fx.includes('(shot.ballistic||shot.hit)?920:260')||
  fx.includes('(shot.ballistic||shot.hit)?1200:280')||
  fx.includes('fireRing?1200:280')||
  fx.includes('(shot.ballistic||shot.hit)?1500:280')||
  fx.includes('fireRing?1500:280'),
  'long duration for ground+letter'
);
assert(fx.includes('0xff812e')||fx.includes('0xff6a14')||fx.includes('FLAME=0xff6a14')||fx.includes('FLAME=0xff7a18'),'arena fire orange');
assert(!/const hitBoom=!!shot\.hit/.test(fx),'no longer letter-only fire ring');

console.log('mecha-1492 ground fire-ring checks passed');
