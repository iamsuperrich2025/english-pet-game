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
for(const photo of ["crowd.jpg","pit.jpg","tower.jpg","tent.jpg"])
  assert.ok(!f1.includes(`texProbe('${photo}'`),`trackside architecture must not load billboard/photo texture: ${photo}`);
for(const token of ['PREMIUM MODULAR CIRCUIT ARCHITECTURE','grandstandRows:7','photoTextures:0','instancedParts','MeshStandardMaterial'])
  assert.ok(f1.includes(token),`missing premium 3D architecture contract: ${token}`);
assert.ok(!/matLit\(['"]crowd/.test(f1),'crowd must be low-poly geometry, never a lit billboard plane');
assert.ok(/RFP_EYE\s*=\s*1\.30/.test(f1)&&/camera\.near=realistic\?\.14:\.3/.test(f1),
  'quality cockpit eye level/near plane must stay separate from Battery Saver');
assert.ok(/activeGraphicsMode==='quality'[\s\S]{0,160}racingLineLat/.test(f1),
  'quality collectibles must follow the computed racing line');
assert.ok(/function footprintCrossesRoad\([\s\S]*pointInFootprint/.test(f1),
  'OSM buildings crossing the road must be culled before construction');
assert.ok(/function barrierBounce\([\s\S]*BARRIER_BOUNCE/.test(f1)&&/px\+=vx\*dt; pz\+=vz\*dt;\s*barrierBounce\(\)/.test(f1),
  'trackside barrier must clamp and reflect vehicle velocity after movement');

const words=f1.slice(f1.indexOf('function spawnLetters'),f1.indexOf('เพื่อนร่วมสนาม'));
assert.ok(/const gap=TOTAL\/word\.en\.length/.test(words),'letter gap must equal lap distance divided by word length');
assert.ok(/\(i\+\.5\)\*gap/.test(words),'letters must occupy the center of evenly divided lap segments');
assert.ok(!/LETTER_COPIES/.test(f1),'one-lap word must not create duplicate letter copies');
assert.ok(!/setTimeout\(\(\)=>\{ if\(running\) pickWord\(\)/.test(words),'completed word must wait for the next lap');
assert.ok(/ครบรอบ![\s\S]{0,1500}pickWord\(\)/.test(f1),'a fresh word must be selected only when a lap completes');
const collect=f1.slice(f1.indexOf('function collectTick'),f1.indexOf('function completeWord'));
assert.ok(/const localX=px,localZ=pz/.test(collect)&&!/peers\[|for\s*\([^)]*peers/.test(collect),
  'online players must collect only their own local letters');
const payload=f1.slice(f1.indexOf('function netSend'),f1.indexOf('function sendChat'));
assert.ok(!/(?:got|letters|word)\s*:/.test(payload),'network payload must never publish letter ownership or collection state');
const receive=f1.slice(f1.indexOf('function onPeer'),f1.indexOf('function showPeerBubble'));
assert.ok(!/\b(?:word|letters)\s*=|scene\.remove\(.*spr/.test(receive),'peer updates must never remove local letters');

const peer=f1.slice(f1.indexOf('function buildPeer'),f1.indexOf('function onPeer'));
assert.ok(peer.includes('TexLib.peerCar')&&peer.includes("view='camera-facing-rear-three-quarter'"),
  'remote racers must use the camera-facing 2.5D peer-car sprite');
assert.ok(!/buildF1Car|makeCar\(/.test(peer),'remote racers must not build heavy 3D cars');

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
