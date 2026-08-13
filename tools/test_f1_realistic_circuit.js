/* Regression guard for round 1125: Realistic Circuit is additive and Battery Saver stays intact. */
'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const f1=fs.readFileSync(path.join(root,'js/f1_3d.js'),'utf8');
const modes=fs.readFileSync(path.join(root,'js/f1_modes.js'),'utf8');

const zone=f1.split('✨ F1 REALISTIC CIRCUIT')[1].split('function buildTrackScene')[0];
assert.ok(zone,'Realistic Circuit zone must exist');
assert.ok(/activeGraphicsMode==='quality'/.test(f1),'realistic visuals must be gated by quality mode');
assert.ok(/if\(realistic&&!realisticRoot\)/.test(f1),'realistic scene must be created lazily');
assert.ok(/realisticRoot\.visible=realistic/.test(f1),'mode switch must hide the realistic group in Battery Saver');
assert.ok((zone.match(/new THREE\.InstancedMesh/g)||[]).length>=1,'repeated trackside objects must use instancing');
assert.ok(!/PointLight|SpotLight/.test(zone),'realistic trackside must not create one dynamic light per pole');
for(const label of ['VOCAB WORLD','WORD BOOST','LEXICON','XP+','VOCAB GP','LEARN • RACE • WIN'])
  assert.ok(zone.includes(label),`missing fictional board: ${label}`);
assert.ok(!/Pirelli|Rolex|Aramco|\bAWS\b|\bFIA\b/i.test(zone),'real sponsor branding must not enter the realistic zone');
for(const feature of ['catch fencing','pit wall','marshal posts','skyline','racing groove'])
  assert.ok(zone.toLowerCase().includes(feature),`missing feature guard: ${feature}`);
assert.ok(/RFP_EYE\s*=\s*1\.30/.test(f1)&&/camera\.near=realistic\?\.14:\.3/.test(f1),
  'quality cockpit eye level/near plane must stay separate from Battery Saver');
assert.ok(/activeGraphicsMode==='quality'[\s\S]{0,160}racingLineLat/.test(f1),
  'quality collectibles must follow the computed racing line');

/* Exact Phase-1 Battery Saver profile guard: this visual upgrade must not trade its quality away. */
for(const token of [
  "DEFAULT_MODE='battery'", "pixelRatioCap:2", "powerPreference:'default'", "toneMapping:'none'",
  'background:0x0d1430', 'fogNear:340', 'fogFar:1600', 'cameraFar:2100',
  'hemisphere:0.72', 'keyLight:1.05', 'warmLight:0.35', "assetSet:'f1-current'"
]) assert.ok(modes.includes(token),`Battery Saver contract changed: ${token}`);
assert.ok(modes.includes("assetSet:'f1-realistic-circuit-v2'"));
assert.strictEqual((f1.match(/new THREE\.Scene\(/g)||[]).length,1,'must keep one shared scene');
assert.strictEqual((f1.match(/new THREE\.WebGLRenderer\(/g)||[]).length,1,'must keep one shared renderer');

console.log('PASS F1 Realistic Circuit: quality-only scene, cockpit, trackside density, instancing and Battery Saver isolation');
