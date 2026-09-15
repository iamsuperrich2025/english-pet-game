'use strict';
const fs=require('fs');
const fx=fs.readFileSync('js/mecha-combat-fx.js','utf8');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fx.includes('function launch'),'fx launch');
assert(fx.includes('function sync'),'fx sync');
assert(fx.includes('function impact'),'fx impact');
assert(fx.includes('ballistic'),'fx ballistic flag');
assert(fx.includes('function fire'),'fx legacy fire kept');

assert(a.includes('MECHA_G=8.4'),'same G as wordship');
assert(a.includes('MECHA_SHELL_MASS=1.2'),'same shell mass');
assert(a.includes('MECHA_MUZZLE=62'),'same muzzle speed');
assert(a.includes('function spawnMechaShell'),'spawn shell');
assert(a.includes('function tickMechaShells'),'tick shells');
assert(a.includes('o.vy-=MECHA_G*MECHA_SHELL_MASS*dt'),'gravity integrate');
assert(a.includes('mechaFX.launch'),'uses launch');
assert(a.includes('mechaFX.sync'),'uses sync');
assert(a.includes('tickMechaShells(dt,now)'),'tick called from mecha loop');
assert(!/mechaFire[\s\S]{0,800}bestD=0\.1/.test(a),'hitscan crosshair pick removed from fire');

console.log('mecha-1481 ballistic checks passed');
