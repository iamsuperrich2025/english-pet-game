'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('Round 1516')||fx.includes('รอบ 1516'),'round mark');
const impact=fx.slice(fx.indexOf('function drawImpact'), fx.indexOf('function tick'));
assert(impact.includes('สะเก็ดไฟ'),'ember spark comment');
assert(!impact.includes("world('crystal'"),'no dark debris crystals on blast');
assert(!impact.includes('j%2?SMOKE'),'no dark smoke orbs on blast');
assert(impact.includes('0xffffff')&&impact.includes('STREAK'),'orange-white spark colors');
assert(impact.includes("world('ring'"),'shock rings kept');

console.log('mecha-1516 orange-white spark checks passed');
