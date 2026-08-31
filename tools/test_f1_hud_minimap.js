'use strict';
const assert=require('assert');
const fs=require('fs');

const f1=fs.readFileSync('js/f1_3d.js','utf8');

assert.match(f1,/#f1-statusright\{[^}]*flex-direction:column/,
  'coin and lap/time HUD must form one right-side vertical stack');
assert.match(f1,/<div id="f1-statusright"><div id="f1-coins">[^<]+<\/div><div id="f1-laps"><\/div><button id="f1-musicbtn"[^>]*>[^<]+<\/button><\/div>/,
  'right stack must keep coin, lap/time, and the Racing music button in that order');
assert.match(f1,/#f1-musicbtn\{[^}]*position:static[^}]*min-height:34px/,
  'music button must stay in normal stack flow instead of overlapping another HUD panel');
assert.match(f1,/#f1-map\{[^}]*left:8px;top:96px[^}]*width:min\(48vh,32vw\)[^}]*height:min\(48vh,32vw\)/,
  'minimap must sit below the large live-position card and remain about half a landscape phone screen tall');
assert.match(f1,/@media \(max-height:430px\)\{[\s\S]*#f1-map\{top:80px;width:min\(33vh,26vw\);height:min\(33vh,26vw\)\}/,
  'short landscape screens must clear both the position card and the steering control');
assert.doesNotMatch(f1,/#f1-map\{width:96px;height:96px\}/,
  'short landscape screens must not shrink the minimap back to the old tiny size');

const drawMap=f1.slice(f1.indexOf('function drawMap()'),f1.indexOf('🪽 รอบ 904: DRS'));
assert.ok(drawMap,'drawMap zone must exist');
assert.doesNotMatch(drawMap,/ghostShown|ghostGrp/,
  'minimap must never draw the local Best-Lap ghost');
assert.match(drawMap,/for\(const uid in peers\)[\s\S]*peerColor\(uid,p\.colorIdx\)/,
  'active peer dots must use each racer selected car color');
assert.match(drawMap,/Math\.sin\(performance\.now\(\)\*\.0105\)[\s\S]*playerCarStyle\.hex/,
  'the local racer dot must continuously pulse in the selected car color');
assert.match(f1,/now-mapAt>100/,
  'minimap must refresh at 10 Hz so moving player dots remain easy to follow');

console.log('PASS F1 HUD/minimap: right-side coin/lap/music stack, large map, live-color racers, no ghost, pulsing self');
