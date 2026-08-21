'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');
const ui=fs.readFileSync('js/ui.js','utf8');
const build=fs.readFileSync('tools/build_web.mjs','utf8');
const preflight=fs.readFileSync('tools/check_missing_assets.py','utf8');

assert.match(src,/const RFP_EYE\s*=\s*1\.30/,'Realistic eye height must stay at driver helmet height');
assert.match(src,/const RFP_FOV\s*=\s*66/,'Realistic cockpit must use a natural helmet-eye FOV');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-cockpit\{[^}]*background-size:100% auto[^}]*calc\(100% \+ 1vh\)/,
  'Realistic cockpit must be a wide lower plate with a road-dominant helmet-eye view');
assert.match(src,/realistic\.fp #f1-cockpit\{[^}]*cockpit_turn_center\.webp/,
  'Realistic mode must use the optimized centered cockpit-and-hands frame');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-wheel,#f1-wrap\.realistic\.fp #f1-leds,#f1-wrap\.realistic\.fp #f1-quality-wheel\{display:none!important\}/,
  'Realistic must not overlay either legacy wheel frame over its integrated cockpit plate');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-cockpit-turn\{display:block!important\}/,
  'Realistic must show the complete turning hands/wheel frame');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-quality-wheel\{display:none\}/,
  'Realistic must hide the obsolete procedural wheel so hands and wheel remain coherent');
assert.match(src,/handDeg<0\?['"]img\/f1\/cockpit_turn_left\.webp['"]:['"]img\/f1\/cockpit_turn_right\.webp['"]/,
  'The live steering direction must select genuinely different left/right hand poses');
assert.match(src,/knobEl\.style\.setProperty\('--ctl-turn'/,
  'Touch/keyboard steering control must visibly rotate with actual steer');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-dash\{display:block!important[^}]*left:44vw[^}]*top:calc\(101vh - 14vw\)/,
  'Realistic must retain a correctly aligned live dashboard');
assert.match(src,/g\.name=['"]F1_FP_WHEELS['"]/,
  'The separate first-person wheel group must remain identifiable for visual QA');
assert.match(src,/fpWheels\.visible=fp&&activeGraphicsMode!==['"]quality['"]/,
  'Realistic must not render a second 3D wheel layer over its cockpit asset');
assert.match(src,/fpWheels\.visible=camMode===['"]cockpit['"]&&!realistic/,
  'Switching into Realistic must immediately hide first-person 3D wheels');
assert.match(src,/carGrp\.visible=\(camMode===['"]chase['"]\)/,
  'The complete car, including rear wheels/bodywork, must stay hidden in cockpit view');
assert.match(src,/camera\.near=realistic\?\.14:\.3/,'Realistic near plane regression');
assert.match(ui,/const f1EngineUrl=['"]__VW_F1_ENGINE_URL__['"][\s\S]{0,160}loadScriptOnce\(f1EngineUrl\.startsWith/,
  'The local build must not reuse a stale pre-fix F1 engine from browser/service-worker cache');
for(const name of ['center','left','right']){
  const asset=`img/f1/cockpit_turn_${name}.webp`;
  assert.ok(build.includes(`'${asset}'`),`${asset} must be copied even before its first commit`);
  assert.ok(build.includes(`makeImmutableAlias('${asset}')`),`${asset} must bypass stale caches`);
  assert.ok(preflight.includes(`"${asset}"`),`Deploy preflight must require ${asset}`);
}

console.log('PASS F1 Realistic cockpit visibility contract');
