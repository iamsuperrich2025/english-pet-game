'use strict';

const assert=require('assert');
const fs=require('fs');
const f1=fs.readFileSync('js/f1_3d.js','utf8');

assert.match(f1,/id="f1-position"[^>]*aria-live="polite"/,
  'live race position HUD must be announced accessibly');
assert.match(f1,/#f1-position\{[^}]*min-width:142px[^}]*height:82px/s,
  'race position must use a large glanceable timing-tower card');
assert.match(f1,/repeating-conic-gradient\(#f5f7fa 0 25%,#15191f 0 50%\)/,
  'race position must carry the R4 chequered-flag visual');
assert.match(f1,/l:lapCount,q:Math\.round\(lastProg\)/,
  'multiplayer packets must publish lap and track progress');
assert.match(f1,/a\.lap\*TOTAL\+a\.prog,bs=b\.lap\*TOTAL\+b\.prog/,
  'live order must combine completed laps with current track progress');
assert.match(f1,/function packetRaceProgress[\s\S]*nearIdx\(d\.x,d\.z,hint\)/,
  'older clients without progress packets must fall back to their physical track position');
assert.match(f1,/updateRacePosition\(\);[\s\S]*drsHud\(\)/,
  'HUD tick must keep the visible race position current');
assert.match(f1,/#f1-map\{position:absolute;left:8px;top:96px/,
  'minimap must move below the large position card');
assert.match(f1,/#f1-map\{top:80px;width:min\(33vh,26vw\);height:min\(33vh,26vw\)\}/,
  '812x375 layout must leave clearance above the 156px steering control');
assert.ok(80+375*.33 < 375-9-156,
  'compact minimap bottom must stay above steering top at 812x375');

console.log('PASS F1 live position: R4 timing tower, race progress packets, live ordering, responsive minimap clearance');
