'use strict';
const assert=require('assert');
const fs=require('fs');

const ui=fs.readFileSync('js/ui.js','utf8');
const comingSoon=/const WORLD3D_COMING_SOON\s*=\s*new Set\(\[([^\]]+)]\)/.exec(ui);
assert.ok(comingSoon,'WORLD3D coming-soon registry must exist');

const lockedModes=[...comingSoon[1].matchAll(/['"]([^'"]+)['"]/g)].map(m=>m[1]);
assert.ok(lockedModes.includes('moto'),'Motorbike must remain locked for non-testers');
assert.ok(!lockedModes.includes('f1'),'F1 must remain open to every player after round 1225');
assert.ok(lockedModes.includes('invasion'),'Mothership must be locked alongside Motorbike for non-testers');
assert.match(ui,/{\s*mode:['"]f1['"][^\n]*enter:enterF1_3D\s*}/,
  'Public F1 must remain registered with its real entry function');
assert.match(ui,/function world3DComingSoon\(w\)[\s\S]{0,220}!\(typeof isTester === ['"]function['"] && isTester\(\)\)/,
  'Coming-soon worlds must remain accessible to tester accounts');
assert.ok(ui.indexOf('if(world3DComingSoon(w))')<ui.indexOf("if(w.mode==='f1')"),
  'Generic locks must resolve before the public F1 graphics selector or entry dialog');
assert.match(ui,/const comingSoon = world3DComingSoon\(w\);[\s\S]{0,300}b\.classList\.add\(['"]locked['"]\)/,
  'Lobby renderer must show the same visual lock used by Motorbike');

console.log('PASS F1 stays public while Motorbike and Mothership keep the coming-soon gate');
