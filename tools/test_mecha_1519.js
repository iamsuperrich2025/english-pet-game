'use strict';
const fs=require('fs');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(a.includes('function buildMechaSky'),'mecha sky builder');
assert(a.includes('function buildMechaScenery'),'mecha scenery');
assert(a.includes('rev:1519'),'scene rev 1519');
assert(a.includes("if(md!=='mecha')"),'no gray fence on mecha');
assert(a.includes("if(wk!=='mecha') applySky"),'mecha skips panorama sky');
assert(a.includes('sky:0xa8d4f0'),'soft sky fog color');
const mechaBlock=a.slice(a.indexOf("}else if(md==='mecha'){"), a.indexOf('ringAds(sc, 5, 45, 0, null)'));
assert(mechaBlock.includes('buildMechaSky'),'sky in mecha block');
assert(mechaBlock.includes('buildMechaScenery'),'scenery in mecha block');
assert(!mechaBlock.includes('Dodecahedron'),'no mecha rock clutter in block');
console.log('mecha-1519 checks passed');
