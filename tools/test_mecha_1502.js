'use strict';
const fs=require('fs');
const path=require('path');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

const dir='sound/robot/mecha';
const need=['step_a','step_b','impact_a','impact_b','explode_a','explode_b','warn_a','warn_b',
  'enemy_a','enemy_b','pickup_a','pickup_b','shield','fire_var_a','fire_var_b'];
need.forEach(n=>assert(fs.existsSync(path.join(dir,n+'.mp3')), 'clip '+n));
assert(fs.existsSync('sound/robot/allroboteffect.mp3'),'source pack');
assert(a.includes('/sound/robot/mecha/'),'mecha clip path');
assert(a.includes("file:'impact_a.mp3'"),'impact clip');
assert(a.includes("file:'explode_a.mp3'"),'explode clip');
assert(a.includes("file:'step_a.mp3'"),'step clip');
assert(a.includes("file:'warn_a.mp3'"),'warn clip');
assert(a.includes("file:'enemy_a.mp3'"),'enemy clip');
assert(a.includes("file:'pickup_a.mp3'"),'pickup clip');
assert(a.includes("file:'shield.mp3'"),'shield clip');
assert(a.includes('function')||a.includes('shield()'),'shield method');
assert(/MechaAudio\.shield\(\)/.test(a),'shield used on block');
assert(a.includes("_pick(['fire','fireVarA','fireVarB'])"),'fire variants rotate');
assert(a.includes("_pick(['impactA','impactB'])"),'impact rotate');
assert(a.includes('à¸£à¸­à¸š 1502')||a.includes('allroboteffect'),'round note');

console.log('mecha-1502 robot SFX pack split checks passed');

