'use strict';
const assert=require('assert');
const fs=require('fs');

const game=fs.readFileSync('js/game.js','utf8');
const pic=fs.readFileSync('js/picmatch.js','utf8');
const util=fs.readFileSync('js/util.js','utf8');

assert.match(game,/roundRestartId:null/,'word matching must track its delayed restart');
assert.match(game,/function stopGameRoundClock\(\)[\s\S]*clearInterval\(game\.timerId\)[\s\S]*clearTimeout\(game\.roundRestartId\)/,
  'word matching exit must cancel both interval and delayed restart');
assert.match(game,/function scheduleGameRound\(delay\)[\s\S]*if\(gameRoundActive\(\)\) newRound\(\)/,
  'word matching may restart only while its own screen remains active');
assert.doesNotMatch(game,/setTimeout\(newRound/,
  'word matching must not leave an untracked newRound timeout behind');
assert.match(game,/if\(!gameRoundActive\(\)\)\{ stopGameRoundClock\(\); return; \}/,
  'word matching interval must self-stop after any unexpected screen change');

assert.match(pic,/roundRestartId:0/,'picture matching must track its delayed restart');
assert.match(pic,/function stopRoundClock\(\)[\s\S]*clearInterval\(pm\.timerId\)[\s\S]*clearTimeout\(pm\.roundRestartId\)/,
  'picture matching exit must cancel both interval and delayed restart');
assert.match(pic,/function scheduleRound\(delay\)[\s\S]*if\(roundActive\(\)\)newRound\(\)/,
  'picture matching may restart only while its own round remains active');
assert.doesNotMatch(pic,/setTimeout\(newRound/,
  'picture matching must not leave an untracked newRound timeout behind');

assert.match(util,/หมดเวลา! ลองรอบใหม่[\s\S]*wordGame[\s\S]*picGame[\s\S]*if\(!active\) return null/,
  'global toast must reject stale matching timeout alerts outside both matching screens');

console.log('PASS stale matching timers: interval + delayed restart stop on exit; timeout toast blocked off-screen');
