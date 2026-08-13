#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function functionSource(source, name){
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `missing ${name}`);
  const brace = source.indexOf('{', start);
  let depth = 0;
  for(let i = brace; i < source.length; i++){
    if(source[i] === '{') depth++;
    else if(source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unterminated ${name}`);
}

const ranksSource = fs.readFileSync('js/data/ranks.js', 'utf8');
const stateSource = fs.readFileSync('js/state.js', 'utf8');
const mainSource = fs.readFileSync('js/main.js', 'utf8');
const uiSource = fs.readFileSync('js/ui.js', 'utf8');
const grantSource = functionSource(stateSource, 'grantRankPromotionRewards');

const context = {console};
vm.createContext(context);
vm.runInContext(`${ranksSource}\nthis.rankInfo=rankInfo;this.rankFromKey=rankFromKey;this.RANKS=RANKS;this.RANK_PROMOTION_REWARD=RANK_PROMOTION_REWARD;`, context);
vm.runInContext(`
  let state;
  let heldAssets=0;
  function netWorth(){ return state.coins + heldAssets; }
  function dailyTick(){ if(!state.daily) state.daily={coins:0}; }
  ${grantSource}
  this.runGrant=(s,assets=0)=>{state=s;heldAssets=assets;return grantRankPromotionRewards();};
`, context);

const fresh = {coins:5000,lifetimeCoins:5000,daily:{coins:0},rankRewardIdx:0,rankRewardNotice:null};
assert.strictEqual(context.runGrant(fresh), null, 'starting rank must not receive a free promotion reward');

const firstPromotion = {coins:10000,lifetimeCoins:10000,daily:{coins:0},rankRewardIdx:0,rankRewardNotice:null};
let notice = context.runGrant(firstPromotion);
assert.strictEqual(firstPromotion.coins, 20000);
assert.strictEqual(firstPromotion.daily.coins, 10000);
assert.strictEqual(firstPromotion.rankRewardIdx, 1);
assert.deepStrictEqual({count:notice.count,total:notice.total,backfill:notice.backfill},{count:1,total:10000,backfill:false});

const subTierOnly = {coins:80000,lifetimeCoins:80000,daily:{coins:0},rankRewardIdx:1,rankRewardNotice:null};
assert.strictEqual(context.runGrant(subTierOnly), null, 'III -> II -> I must not pay');
assert.strictEqual(subTierOnly.coins, 80000);

// ภาพตัวอย่าง Emerald Archivist II: net worth 10,728,965 => ผ่านแรงค์ใหญ่ 5 ครั้งหลัง Novice
const oldSave = {coins:9993365,lifetimeCoins:9993365,daily:{coins:321},rankRewardIdx:null,rankRewardNotice:null};
notice = context.runGrant(oldSave, 735600);
assert.strictEqual(notice.count, 5);
assert.strictEqual(notice.total, 50000);
assert.strictEqual(notice.backfill, true);
assert.strictEqual(oldSave.coins, 10043365);
assert.strictEqual(oldSave.daily.coins, 321, 'back pay must not distort today earnings');
assert.strictEqual(oldSave.rankRewardIdx, 5);
const paidCoins = oldSave.coins;
assert.strictEqual(context.runGrant(oldSave, 735600), null, 'back pay must be idempotent');
assert.strictEqual(oldSave.coins, paidCoins);

const modalSource = functionSource(mainSource, 'showRankRewardNotice');
assert.match(modalSource, /sfx\.rankup/);
assert.match(modalSource, /sfx\.coinGet/);
assert.match(modalSource, /addEventListener\('click',[\s\S]*state\.rankRewardNotice = null/);
assert.doesNotMatch(modalSource, /setTimeout\([^)]*ov\.remove/, 'notice must never auto-dismiss');
assert.match(modalSource, /III \/ II \/ I ไม่นับเป็นแรงค์ใหญ่/);

const moveGrantSource = functionSource(uiSource, 'rankMoveRewardCheck');
const moveContext = {console, setTimeout:()=>0};
vm.createContext(moveContext);
vm.runInContext(`
  const RANK_MOVE_REWARD=1000;
  let state;
  function saveState(){}
  function addCoins(n){ state.coins+=n; state.lifetimeCoins=(state.lifetimeCoins||0)+n; }
  ${moveGrantSource}
  this.runMove=(s,rank)=>{state=s;return rankMoveRewardCheck({key:'coins',ico:'🪙',label:'เหรียญ'},rank);};
`, moveContext);
const moving = {coins:0,lifetimeCoins:0,rankMoveBest:{},rankMoveRewardNotice:null};
assert.strictEqual(moveContext.runMove(moving,16),0,'first observed position is baseline, not retro pay');
assert.strictEqual(moveContext.runMove(moving,15),1000);
assert.strictEqual(moveContext.runMove(moving,14),1000);
assert.strictEqual(moving.coins,2000);
assert.strictEqual(moveContext.runMove(moving,16),0,'falling must not deduct or reset best rank');
assert.strictEqual(moveContext.runMove(moving,15),0,'climbing back below the old best must not pay twice');
assert.strictEqual(moveContext.runMove(moving,13),1000);
assert.strictEqual(moving.coins,3000);
assert.strictEqual(moving.rankMoveBest.coins,13);

const moveModalSource = functionSource(uiSource, 'showRankMoveRewardNotice');
assert.match(moveModalSource, /sfx\.rankup/);
assert.match(moveModalSource, /sfx\.coinGet/);
assert.match(moveModalSource, /addEventListener\('click',[\s\S]*state\.rankMoveRewardNotice = null/);
assert.doesNotMatch(moveModalSource, /setTimeout\([^)]*ov\.remove/, 'rank movement notice must never auto-dismiss');

console.log('PASS rank rewards: major ranks 10,000, leaderboard best-position gains 1,000, no duplicate after falling, persistent modals');
