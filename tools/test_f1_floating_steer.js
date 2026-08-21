'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');

const zone=src.slice(src.indexOf('floating steering pad'),src.indexOf('/* คันเร่ง/เบรก */'));
assert.ok(zone.length>1200,'floating steering control zone must exist');
assert.match(src,/#f1-steer\{[\s\S]*pointer-events:none/,
  'the visible wheel must not be the only touch target');
assert.match(zone,/wrapEl\.addEventListener\('pointerdown'/,
  'the full game surface must listen for a new steering touch');
assert.match(zone,/e\.clientX>wr\.left\+wr\.width\*\.5/,
  'steering touches must stay inside the left half of the screen');
assert.match(zone,/e\.target\.closest&&e\.target\.closest\(steerBlock\)/,
  'HUD, dialogs and buttons must remain clickable instead of becoming steering input');
assert.match(zone,/steerBox\.style\.left=x\+'px'[\s\S]*steerBox\.style\.top=y\+'px'[\s\S]*bottom='auto'/,
  'the wheel center must relocate to the player touch point');
assert.match(zone,/steerCtl=clamp\(\(cx-steerAnchorX\)\/steerRadius,-1,1\)/,
  'steering must follow horizontal finger travel relative to the touch origin');
assert.match(zone,/wrapEl\.setPointerCapture\(sid\)/,
  'the active steering finger must remain captured after sliding outside the wheel');
assert.match(zone,/pointermove[\s\S]*sid===e\.pointerId[\s\S]*steerTo\(e\.clientX\)/,
  'captured pointer movement must continuously update steering');
assert.match(zone,/pointerup[\s\S]*pointercancel[\s\S]*lostpointercapture/,
  'all pointer-ending paths must release steering safely');
assert.match(zone,/resetSteer\(rehome\)[\s\S]*steerCtl=0/,
  'release and race restart must return steering to neutral');

console.log('PASS F1 floating steering pad: left-half relocation, continuous capture and safe release');
