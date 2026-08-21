'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');

assert.match(src,/function layoutBoard\(\)[\s\S]*lapEl\.getBoundingClientRect\(\)[\s\S]*boardEl\.getBoundingClientRect\(\)/,
  'The multiplayer board must use the real lap HUD and board dimensions');
assert.match(src,/maxX=Math\.max\(edge,wrap\.width-board\.width-edge\)[\s\S]*lap\.right-wrap\.left\+gap/,
  'The board must prefer the free space immediately beside the lap HUD and remain on screen');
assert.match(src,/overlaps\(candidate\(\),lap\)\|\|overlaps\(candidate\(\),word\)[\s\S]*Math\.max\(lap\.bottom,word&&word\.height\?word\.bottom:wrap\.top\)/,
  'Narrow screens must place the board below both top HUD panels instead of overlapping them');
assert.match(src,/if\(sig===boardSig\)\{ boardEl\.classList\.add\('on'\); layoutBoard\(\); return; \}/,
  'An unchanged scoreboard must still be repositioned after a viewport change');
assert.match(src,/function fit\(\)[\s\S]*layoutWheel\(\);[\s\S]*layoutBoard\(\);/,
  'Resize and orientation changes must recalculate the board position');

console.log('PASS F1 multiplayer board responsive non-overlap contract');
