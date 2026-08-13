'use strict';
const assert=require('assert');
const fs=require('fs');

const ui=fs.readFileSync('js/ui.js','utf8');
const comingSoon=/const WORLD3D_COMING_SOON\s*=\s*new Set\(\[([^\]]+)]\)/.exec(ui);
assert.ok(comingSoon,'WORLD3D coming-soon registry must exist');

const lockedModes=[...comingSoon[1].matchAll(/['"]([^'"]+)['"]/g)].map(m=>m[1]);
assert.ok(lockedModes.includes('moto'),'Motorbike must remain locked for non-testers');
assert.ok(lockedModes.includes('f1'),'F1 must be locked alongside Motorbike for non-testers');
assert.ok(lockedModes.includes('invasion'),'Mothership must be locked alongside Motorbike for non-testers');
assert.match(ui,/function world3DComingSoon\(w\)[\s\S]{0,220}!\(typeof isTester === ['"]function['"] && isTester\(\)\)/,
  'Coming-soon worlds must remain accessible to tester accounts');
assert.ok(ui.indexOf('if(world3DComingSoon(w))')<ui.indexOf("if(w.mode==='f1')"),
  'F1 lock must run before opening its graphics selector or entry dialog');
assert.match(ui,/const comingSoon = world3DComingSoon\(w\);[\s\S]{0,300}b\.classList\.add\(['"]locked['"]\)/,
  'Lobby renderer must show the same visual lock used by Motorbike');

console.log('PASS F1 and Mothership lobby locks match Motorbike coming-soon gate');
