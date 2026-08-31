'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');

assert.match(src,/function layoutBoard\(\)[\s\S]*positionEl\.getBoundingClientRect\(\)[\s\S]*wordEl\.getBoundingClientRect\(\)[\s\S]*boardEl\.getBoundingClientRect\(\)/,
  'The multiplayer board must measure the live-position card, word HUD and final board geometry');
assert.match(src,/laneLeft=pos\.right-wrap\.left\+gap,laneRight=word\.left-wrap\.left-gap/,
  'The preferred board lane must begin after live position and end before the word HUD');
assert.match(src,/laneWidth>=minLane[\s\S]*x=laneLeft;[\s\S]*y=Math\.max\(edge,pos\.top-wrap\.top\)[\s\S]*width=Math\.min\(560,laneWidth\)/,
  'A wide screen must place the board in the requested upper-left lane');
assert.match(src,/minLane=Math\.min\(120,wrap\.width\*\.18\)/,
  'The scrolling board must keep using the upper lane when a short screen leaves at least 120px');
assert.match(src,/Math\.max\(pos\.bottom,word\.bottom,lap&&lap\.height\?lap\.bottom:wrap\.top\)[\s\S]*Math\.min\(560,wrap\.width-x-edge\)/,
  'A narrow screen must move the board below all top HUD panels and keep it on screen');
assert.match(src,/boardEl\.style\.width=Math\.round\(width\)\+'px'/,
  'The board width must fit the available lane instead of overlapping the word HUD');
assert.match(src,/if\(sig===boardSig\)\{ boardEl\.classList\.add\('on'\); layoutBoard\(\); return; \}/,
  'An unchanged scoreboard must still be repositioned after a viewport change');
assert.match(src,/function fit\(\)[\s\S]*layoutWheel\(\);[\s\S]*layoutBoard\(\);/,
  'Resize and orientation changes must recalculate the board position');

console.log('PASS F1 multiplayer board responsive non-overlap contract');
