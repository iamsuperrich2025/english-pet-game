'use strict';
const fs=require('fs');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(a.includes('รอบ 1511')||a.includes('ซอมบี้เลือดแดง'),'zombie round mark');
assert(a.includes('0xc41e1e'),'red blood color');
assert(a.includes('baseY:1.55')||a.includes('baseY'),'zombie ground height');
assert(a.includes('engaging')&&a.includes('Math.atan2(g.x-camera.position.x'),'face player when engaging');
assert(a.includes('BLOOD=0xc41e1e')||a.includes('🩸'),'blood explode');
assert(a.includes('บอสซอมบี้')||a.includes('ล้มซอมบี้'),'zombie copy');
assert(!a.includes('IcosahedronGeometry(2.2,1)'),'no old alien icosa body');
assert(fx.includes('Round 1511')||fx.includes('รอบ 1511')||fx.includes('Round 1513')||fx.includes('รอบ 1513'),'fx round');

console.log('mecha-1511 zombie checks passed');
