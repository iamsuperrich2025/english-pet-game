#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js', 'f1_3d.js'), 'utf8');
let failures = 0;

function ok(condition, label) {
  if (condition) console.log('PASS', label);
  else { console.error('FAIL', label); failures++; }
}

function has(pattern) {
  return typeof pattern === 'string' ? src.includes(pattern) : pattern.test(src);
}

// Solo racing: no locally simulated competitors or bot-only DRS path remains.
for (const pattern of [
  /\bBOT_N\b/, /\bbots\b/, /function\s+bot(?:Tick|Reset|Place|Ensure|Rel|ProfileBuild)\b/,
  /รถบ[ออ]ท/, /for\s*\(const b of bots\)/
]) ok(!has(pattern), `removed bot runtime: ${pattern}`);
ok(has('function drsPeerGap()') && has('for(const uid in peers)'), 'DRS still follows real online players');

// Tyres remain visual car geometry only; degradation, HUD and service stop are gone.
for (const pattern of [
  /\bTYRE_W_/, /\bTYRE_GRIP_MIN\b/, /function\s+tyre(?:Wear|Grip|Hud|Reset)\b/,
  /id="f1-tyre"/, /id="f1-pit"/, /Math\.round\(tyre\*100\)/,
  /จอดนิ่ง 3 วิ = ยางใหม่/, /Snd\.(?:wrench|tyreDone)\(/
]) ok(!has(pattern), `removed tyre degradation: ${pattern}`);
ok(has('const gripMax=Math.min(GRIP_CAP,(GRIP_BASE+GRIP_DF*spd*spd))*sc.grip;'), 'player grip no longer depends on tyre condition');

// Player ghost contract must remain end-to-end: storage, recording, playback and UI.
for (const pattern of [
  "const GHOST_KEY    = 'vwF1Ghost'", 'function ghostLoad()', 'function ghostSave()',
  'function ghostReset()', 'function ghostRecord(dt,prog)', 'function ghostKeep(t)',
  'function ghostTick(dt)', 'ghostLoad(); ghostReset(); ghostHide();',
  'if(lapStartAt) ghostRecord(dt,prog);', 'ghostTick(dt);', 'id="f1-gap"',
  'รถเงาของตัวเอง', 'if(ghostShown&&ghostGrp)'
]) ok(has(pattern), `kept player ghost: ${pattern}`);

if (failures) {
  console.error(`\nF1 solo/ghost regression failed: ${failures}`);
  process.exit(1);
}
console.log('\nF1 solo/ghost regression passed');
