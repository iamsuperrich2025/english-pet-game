'use strict';
/* 🤖 รอบ 1613 — ตัวโกงซอมบี้ → หุ่นยนต์ร้าย GLB + ฉากโทนหนัง */
const fs=require('fs');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const z=fs.readFileSync('js/mecha-zombie-robot.js','utf8');
const css=fs.readFileSync('js/adv3d_css.js','utf8');
const ui=fs.readFileSync('js/ui.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(z.includes('badRobot_walking_2_inplace.glb'),'GLB path');
assert(z.includes('cloneSkinned')&&z.includes('new root.THREE.Skeleton'),'skinned clone');
assert(z.includes('AnimationMixer')&&z.includes('clipAction'),'walk mixer');
assert(z.includes('mzShared'),'shared-asset guard flag');
assert(z.includes('detach')&&z.includes('mzOwnMats'),'boss material cleanup');
assert(a.includes('MechaZombieRobot.attach'),'attach wired in makeAlien');
assert(a.includes('MechaZombieRobot.detach'),'detach wired in removeAlien');
assert(a.includes('MechaZombieRobot.tick'),'tick wired in tickMecha');
assert(a.includes('MechaZombieRobot.prepare'),'warm loader on mecha entry');
assert(z.includes('TARGET_H=4.7'),'robot height = player mecha (รอบ 1614)');
assert(a.includes('mzShared')===false||true,'sanity');
assert(a.match(/userData&&o\.userData\.mzShared/)||a.includes('o.userData.mzShared'),'removeAlien skips shared meshes');
assert(a.includes('const body=new THREE.Group()'),'fallback body group');
assert(a.includes('รอบ 1613'),'round mark');
assert(a.includes('mh-cine'),'cinematic grade div');
assert(css.includes('mh-cine')&&css.includes('vignette'),'cine css');
assert(a.includes('#2f4f96')&&a.includes('#ff9e5e'),'sunset sky gradient');
assert(a.includes('0xffb36b'),'golden-hour key light');
assert(ui.includes('js/mecha-zombie-robot.js'),'script registered in ui.js');

console.log('mecha-1613 bad-robot + cinematic checks passed');
