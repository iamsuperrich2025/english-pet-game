'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('Round 1513')||fx.includes('รอบ 1513')||fx.includes('Round 1514')||fx.includes('รอบ 1514'),'round mark');
const impact=fx.slice(fx.indexOf('function drawImpact'), fx.indexOf('function tick'));
assert(impact.includes("world('ring'"),'impact shock rings');
assert(impact.includes('0xffffff'),'outer white ring');
assert(impact.includes('grad=[DEEP,FLAME')||impact.includes('grad=[DEEP'),'orange-to-white gradient stack');
assert(impact.includes('shockFade'),'shock rings fade with blast');
assert(impact.includes('ก้อนเปลวบิลโลว์')||impact.includes('for(let j=0;j<14;j++)'),'volumetric fireball kept');

console.log('mecha-1513 gradient shock ring checks passed');
