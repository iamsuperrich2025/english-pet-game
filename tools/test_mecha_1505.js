'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('Round 1505')||fx.includes('รอบ 1505'),'round mark');
assert(fx.includes('CAPACITY=384'),'higher instance capacity');
assert(fx.includes('fireRing=!!shot.ballistic || !!shot.hit'),'fire ring any land');
assert(fx.includes('(shot.ballistic||shot.hit)?1200:280')||fx.includes('fireRing?1200:280'),'1.2s fire impact');
assert(fx.includes('HOT=0xfff8e6'),'white-hot core');
assert(fx.includes('FLAME=0xff6a14'),'hot flame orange');
assert(fx.includes('EMBER=0xc43a08'),'ember fade');
assert(fx.includes('BLOOM=0xff4010'),'bloom accent');
assert(fx.includes('5.2*t*t'),'gravity on sparks');
assert(fx.includes('tongues=10'),'flame tongues');
assert(/for\(let j=0;j<18;j\+\+\)/.test(fx),'18 gravity sparks');
assert(fx.includes("local('halo',shot,p,0,0,.05,.42,.42,.55,HOT)"),'shell hot halo');
assert(fx.includes('for(let j=1;j<=7;j++)'),'longer shell trail');
console.log('mecha-1505 spectacular fire FX checks passed');
