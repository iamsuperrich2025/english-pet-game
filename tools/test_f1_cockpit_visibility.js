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
assert.match(src,/realistic\.fp #f1-cockpit\{[^}]*var\(--f1-cockpit-center\)/,
  'Realistic mode must use the selected-color centered cockpit frame');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-wheel,#f1-wrap\.realistic\.fp #f1-leds,#f1-wrap\.realistic\.fp #f1-quality-wheel\{display:none!important\}/,
  'Realistic must not overlay either legacy wheel frame over its integrated cockpit plate');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-cockpit-turn\{display:block!important\}/,
  'Realistic must show the complete turning hands/wheel frame');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-quality-wheel\{display:none\}/,
  'Realistic must hide the obsolete procedural wheel so hands and wheel remain coherent');
assert.match(src,/cockpitAsset\(handDeg<0\?['"]left['"]:['"]right['"]\)/,
  'The live steering direction must select genuinely different left/right hand poses');
assert.match(src,/knobEl\.style\.setProperty\('--ctl-turn'/,
  'Touch/keyboard steering control must visibly rotate with actual steer');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-dash\{display:block!important\}/,
  'Realistic must retain the live steering-wheel dashboard');
assert.match(src,/QUALITY_DASH_POSE=\{[\s\S]*left:[\s\S]*deg:-23[\s\S]*right:[\s\S]*deg:21\.8/,
  'Realistic dashboard must use locations measured from all three cockpit frames');
assert.match(src,/QUALITY_DASH_SCALE=\.82[\s\S]*p\.w\*sx\*QUALITY_DASH_SCALE[\s\S]*p\.h\*sy\*QUALITY_DASH_SCALE/,
  'Realistic live screen must fit within the photographed LCD bezel at every steering pose');
assert.match(src,/function positionQualityDash\([\s\S]*lerp\(center\.cx,edge\.cx,t\)[\s\S]*rotate\('\+p\.deg/,
  'Realistic dashboard must interpolate position and angle with the visible hand frame');
assert.doesNotMatch(src,/#f1-wrap\.realistic\.fp #f1-dash\{[^}]*left:44vw/,
  'Realistic dashboard must not drift from a viewport-relative hard-coded offset');
assert.match(src,/#f1-wrap\.fp #f1-hud\{display:none\}/,
  'Cockpit must not show the duplicate floating speed and gear box');
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
assert.match(src,/VIP PIT GARAGE[\s\S]*data-car-color/,'A premium pre-race color-selection garage must be present');
assert.match(src,/localStorage\.setItem\(CAR_COLOR_KEY,playerCarStyle\.key\)/,'Selected car color must persist locally');
assert.match(src,/cw:F1_COLOR_WIRE\+playerCarStyle\.key/,
  'Multiplayer payload must carry the selected car color through the NetRoom-safe wire field');
assert.match(src,/PLAYER_CAR_MODEL_URLS=Object\.freeze\(\['img\/models\/f1_car_lite\.glb','img\/models\/f1_car\.glb'\]\)/,
  'The local player must prefer the detailed GLB model with a full-model fallback');
assert.match(src,/function replacePlayerCar\(\)[\s\S]*makeCar\(playerCarStyle,g=>installPlayerCar\(g,token\)\)/,
  'The local player must asynchronously upgrade from its lightweight placeholder to the detailed GLB');
assert.match(src,/function applyPlayerGlbStyle\([\s\S]*f1BodyTint[\s\S]*f1BodyMask/,
  'The selected exterior color must tint only body paint while preserving the GLB texture details');
assert.match(src,/wrapEl\.style\.setProperty\('--f1-cockpit-center'[\s\S]*cockpitAsset\('center'\)/,
  'The same selected style must update the matching cockpit interior');
assert.match(src,/function buildPeer\(uid,p\)[\s\S]*buildPeerF1Car\(col\)/,
  'Remote racers must remain on the shared low-poly model so multiplayer performance stays bounded');
assert.match(build,/const F1_COCKPIT_ASSETS[\s\S]*\['red', 'blue', 'green', 'yellow', 'orange'\]/,
  'Build must enumerate every supported cockpit color');
assert.match(build,/for \(const asset of cockpitRefs\)[\s\S]*makeImmutableAlias\(asset\)/,
  'Every referenced cockpit variant must receive an immutable build alias');
assert.match(build,/TOKEN_F1_PLAYER_MODEL_ASSET[\s\S]*for \(const asset of playerModelRefs\)[\s\S]*makeImmutableAlias\(asset\)/,
  'Player GLB URLs must receive immutable build aliases so a deploy cannot revive a cached old model');
for(const asset of ['img/models/f1_car_lite.glb','img/models/f1_car.glb']){
  assert.ok(preflight.includes(`"${asset}"`),`Deploy preflight must require ${asset}`);
  assert.ok(fs.existsSync(asset),`${asset} must exist`);
}
for(const color of ['red','blue','green','yellow','orange']){
  for(const name of ['center','left','right']){
    const suffix=color==='red'?'':`_${color}`;
    const asset=`img/f1/cockpit_turn_${name}${suffix}.webp`;
    assert.ok(preflight.includes(`"${asset}"`),`Deploy preflight must require ${asset}`);
    assert.ok(fs.existsSync(asset),`${asset} must exist`);
    assert.ok(fs.statSync(asset).size<100*1024,`${asset} must remain mobile-light (<100 KiB)`);
    assert.ok(fs.readFileSync(asset).includes(Buffer.from('ALPH')),`${asset} must preserve transparency so the road remains visible`);
  }
}

console.log('PASS F1 Realistic cockpit visibility contract');
