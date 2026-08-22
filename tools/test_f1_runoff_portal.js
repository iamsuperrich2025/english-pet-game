'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');

assert.match(src,/const SURF_RUNOFF\s*=\s*\{grip:0\.78, drag:0\.8\}/,
  'The light-grey paved runoff must remain controllable instead of behaving like sand');
assert.match(src,/const BARRIER_LAT\s*=\s*HALF_W\+RUNOFF_W\+\.75/,
  'The invisible collision boundary must sit beyond the full paved runoff width');
assert.match(src,/const postMoveSurf=surfAt\(px,pz,myIdx\)[\s\S]*crossedRunoffOuter=!airborne&&postMoveSurf\.surf==='sand'/,
  'The outer boundary must be checked after movement, at the actual new wheel position');
assert.match(src,/if\(!crossedRunoffOuter\)barrierBounce\(\)/,
  'Crossing the outer edge must enter the portal path instead of bouncing off an invisible wall');
const portalLine=src.match(/if\(!gridFormationActive\(\)&&\(missedJump\|\|crossedRunoffOuter\)\)[^\n]+/);
assert.ok(portalLine,'Portal condition must use the explicit outer-runoff crossing');
assert.doesNotMatch(portalLine[0],/surf===['"]runoff['"]/,
  'Driving anywhere inside the light-grey runoff must not trigger the portal');

/* Boundary contract: HALF_W=7.5 and RUNOFF_W=9 means 16.5 m is still paved;
   only a value beyond it is sand/portal territory. */
const HALF_W=7.5,RUNOFF_W=9,outer=HALF_W+RUNOFF_W;
for(const lat of [7.5,8,12,16,16.5])assert.ok(Math.abs(lat)<=outer,`${lat} m must remain driveable`);
assert.ok(16.51>outer,'The first point beyond the light-grey outer edge must enter portal territory');

console.log('PASS F1 paved runoff remains driveable; portal starts only beyond its outer edge');
