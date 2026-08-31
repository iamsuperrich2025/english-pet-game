'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');
const ui=fs.readFileSync('js/ui.js','utf8');
const build=fs.readFileSync('tools/build_web.mjs','utf8');
const preflight=fs.readFileSync('tools/check_missing_assets.py','utf8');

assert.match(src,/const RFP_EYE\s*=\s*1\.30/,'Realistic eye height must stay at driver helmet height');
assert.match(src,/const RFP_FOV\s*=\s*66/,'Realistic cockpit must use a natural helmet-eye FOV');
assert.match(src,/#f1-cockpit\{[^}]*var\(--f1-cockpit-center\)[^}]*background-size:100% auto[^}]*calc\(100% \+ 1vh\)/,
  'Every graphics mode must use the selected-color WebP cockpit frame');
assert.match(src,/#f1-wrap\.fp #f1-wheel,#f1-wrap\.fp #f1-leds,#f1-wrap\.fp #f1-quality-wheel\{display:none!important\}/,
  'No graphics mode may overlay a legacy red cockpit/wheel layer');
assert.match(src,/#f1-wrap\.fp #f1-cockpit-turn\{display:block!important\}/,
  'Every graphics mode must show the matching-color turning hands/wheel frame');
assert.match(src,/#f1-wrap\.realistic\.fp #f1-quality-wheel\{display:none\}/,
  'Realistic must hide the obsolete procedural wheel so hands and wheel remain coherent');
assert.match(src,/cockpitAsset\(handDeg<0\?['"]left['"]:['"]right['"]\)/,
  'The live steering direction must select genuinely different left/right hand poses');
assert.match(src,/knobEl\.style\.setProperty\('--ctl-turn'/,
  'Touch/keyboard steering control must visibly rotate with actual steer');
assert.match(src,/#f1-wrap\.fp #f1-dash\{display:block!important\}/,
  'Every cockpit mode must retain the live steering-wheel dashboard');
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
assert.doesNotMatch(src,/F1_FP_WHEELS|function buildFpWheels\(|function fpWheelTick\(|\bfpWheels\b/,
  'The retired 3D first-person wheel overlay must not exist in any graphics mode');
assert.match(src,/carGrp\.visible=\(camMode===['"]chase['"]\)/,
  'The complete car, including rear wheels/bodywork, must stay hidden in cockpit view');
assert.match(src,/camera\.near=realistic\?\.14:\.3/,'Realistic near plane regression');
assert.match(ui,/const f1EngineUrl=['"]__VW_F1_ENGINE_URL__['"][\s\S]{0,160}loadScriptOnce\(f1EngineUrl\.startsWith/,
  'The local build must not reuse a stale pre-fix F1 engine from browser/service-worker cache');
assert.match(src,/VIP PIT GARAGE[\s\S]*data-car-color/,'A premium pre-race color-selection garage must be present');
assert.match(src,/localStorage\.setItem\(CAR_COLOR_KEY,playerCarStyle\.key\)/,'Selected car color must persist locally');
assert.match(src,/cw:F1_COLOR_WIRE\+playerCarStyle\.key/,
  'Multiplayer payload must carry the selected car color through the NetRoom-safe wire field');
assert.doesNotMatch(src,/PLAYER_CAR_MODEL_URLS|function glbEnsure\(|function makeCar\(/,
  'The cancelled round-898 GLB model must not remain reachable from the player runtime');
assert.match(src,/function replacePlayerCar\(\)[\s\S]*buildPeerF1Car\(playerCarStyle\.value\)[\s\S]*modelKind='vrx1-faceted-low-poly'/,
  'The local player must use the selected-color VR-X1 faceted model introduced in rounds 1210/1216');
assert.match(src,/function paintPlayerStyle\(key\)[\s\S]*playerCarStyle=carStyleByKey\(key\);[\s\S]*saveCarStyle\(\);[\s\S]*replacePlayerCar\(\)/,
  'A swatch click must persist the selected color immediately and repaint the local VR-X1');
assert.match(src,/wrapEl\.style\.setProperty\('--f1-cockpit-center'[\s\S]*cockpitAsset\('center'\)/,
  'The same selected style must update the matching cockpit interior');
assert.match(src,/carProofEl\.textContent='🏎️ VR-X1 รุ่นใหม่ · '\+playerCarStyle\.label/,
  'The live HUD must visibly report the actual selected model/color for device-side QA');
for(const oldAsset of ['cockpit.webp','cockpit_body.webp','wheel.webp','wheel_body.webp']){
  assert.ok(!src.includes(`url('img/f1/${oldAsset}')`)&&!src.includes(`src='img/f1/${oldAsset}'`),
    `Runtime must never load retired red cockpit asset ${oldAsset}`);
}
assert.match(src,/function buildPeer\(uid,p\)[\s\S]*buildPeerF1Car\(col\)/,
  'Remote racers must remain on the shared low-poly model so multiplayer performance stays bounded');
assert.match(build,/const F1_COCKPIT_ASSETS[\s\S]*\['red', 'blue', 'green', 'yellow', 'orange'\]/,
  'Build must enumerate every supported cockpit color');
assert.match(build,/for \(const asset of cockpitRefs\)[\s\S]*makeImmutableAlias\(asset\)/,
  'Every referenced cockpit variant must receive an immutable build alias');
assert.doesNotMatch(build,/TOKEN_F1_PLAYER_MODEL_ASSET|playerModelRefs/,
  'The build must not reintroduce immutable URLs for the cancelled GLB player model');
assert.doesNotMatch(preflight,/img\/models\/f1_car(?:_lite)?\.glb/,
  'Deploy preflight must not require the cancelled GLB player model');
for(const color of ['red','blue','green','yellow','orange']){
  for(const name of ['center','left','right']){
    const suffix=color==='red'?'':`_${color}`;
    const asset=`img/f1/cockpit_turn_${name}${suffix}.webp`;
    assert.ok(preflight.includes(`"${asset}"`),`Deploy preflight must require ${asset}`);
    assert.ok(fs.existsSync(asset),`${asset} must exist`);
    assert.ok(fs.statSync(asset).size<100*1024,`${asset} must remain mobile-light (<100 KiB)`);
    const bytes=fs.readFileSync(asset);
    assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF',`${asset} must be a real RIFF WebP`);
    assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP',`${asset} must be WebP-encoded, not renamed`);
    assert.ok(bytes.includes(Buffer.from('ALPH')),`${asset} must preserve transparency so the road remains visible`);
  }
}

console.log('PASS F1 Realistic cockpit visibility contract');
