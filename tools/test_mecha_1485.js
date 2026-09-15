'use strict';
const fs=require('fs');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(a.includes("file:'MissileLaunch.mp3'")||a.includes("file:'fire.mp3'"),'launch sfx file');
assert(a.includes("dir:'/sound/robot/'"),'launch sfx path');
assert(a.includes("playClip('launch')"),'FIRE uses launch clip');
assert(a.includes('impactBoom'),'impact boom helper');
assert(a.includes("playClip('boom')"),'impact uses arena fire clip');
assert(a.includes('fire-a6fea31058694941.mp3'),'boom still arena fire');
assert(/function mechaKillShell[\s\S]{0,220}impactBoom/.test(a),'kill shell plays boom on hit');
assert(a.includes('function spawnMechaSmoke'),'smoke spawn');
assert(a.includes('function tickMechaSmoke'),'smoke tick');
assert(a.includes('spawnMechaSmoke(o.x-o.vx/sp'),'smoke behind velocity');
assert(a.includes('tickMechaSmoke(dt,now)'),'smoke in mecha loop');
assert(a.includes('clearMechaSmoke'),'smoke cleanup');
assert(fs.existsSync('sound/robot/MissileLaunch.mp3')||fs.existsSync('sound/robot/fire.mp3'),'robot launch asset on disk');

assert(fx.includes('fireRing')||fx.includes('hitBoom'),'fx fire-ring hit branch');
assert(fx.includes('0xff812e'),'fx fire orange');
assert(fx.includes('920:260')||fx.includes('shot.hit?920:260')||fx.includes('(shot.ballistic||shot.hit)?920:260'),'longer hit impact duration');

console.log('mecha-1485 missile SFX/smoke/fire-ring checks passed');
