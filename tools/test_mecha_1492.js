'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('รอบ 1492')||fx.includes('Round 1492'),'round mark');
assert(fx.includes('fireRing=!!shot.ballistic || !!shot.hit'),'fire ring on any ballistic impact');
assert(fx.includes('(shot.ballistic||shot.hit)?920:260'),'long duration for ground+letter');
assert(fx.includes('0xff812e'),'arena fire orange');
assert(!/const hitBoom=!!shot\.hit/.test(fx),'no longer letter-only fire ring');

console.log('mecha-1492 ground fire-ring checks passed');
