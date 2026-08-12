'use strict';
const assert = require('assert');
const fs = require('fs');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const state = fs.readFileSync('js/state.js', 'utf8');
const award = fs.readFileSync('js/assetaward.js', 'utf8');
const html = fs.readFileSync('index_classic.html', 'utf8');
const build = fs.readFileSync('tools/build_web.mjs', 'utf8');
const rulesText = fs.readFileSync('handoff/RULES.md', 'utf8');

assert.ok(ui.includes("'coins','assets','badges'"), 'assets tab missing from leaderboard order');
assert.ok(ui.includes("data-t=\"assets\">🏆 ทรัพย์สินรวม"), 'full-screen assets tab missing');
assert.ok(ui.includes('const LB_ASSET_TOP = 100;'), 'assets leaderboard must show Top 100');
assert.ok(/if\(tab === 'assets'\)[\s\S]*?r\.av[\s\S]*?slice\(0, LB_ASSET_TOP\)/.test(ui), 'assets ranking must use leaderboard.av and cap at Top 100');
assert.ok(/tab === 'assets'[\s\S]*?AssetAward/.test(ui), 'assets prize integration missing');
assert.ok(award.includes("field:   'av'"), 'award must rank the existing asset-value field');
assert.ok(award.includes("scoreOf: ()=> (typeof assetValue === 'function' ? assetValue() : 0)"), 'self score must use live assetValue');
assert.ok(html.indexOf('js/award.js') < html.indexOf('js/assetaward.js'), 'asset award must load after shared award factory');
assert.ok(build.includes("'js/assetaward.js'"), 'production build must include the new award module before its first commit');
assert.ok(state.includes("assetAwardSeen:''") && state.includes('assetAwardPaid:[]') && state.includes('assetAwardLog:[]'), 'award state defaults missing');

const jsonBlock = rulesText.match(/```json\s*([\s\S]*?)\s*```/);
assert.ok(jsonBlock, 'rules JSON block missing');
const rules = JSON.parse(jsonBlock[1]).rules;
assert.ok(rules.assetAward && rules.assetAward.$m, 'assetAward rules zone missing');
assert.strictEqual(rules.assetAward.$m.$other['.validate'], false, 'unknown snapshot fields must be rejected');

const prizes = require('vm').runInNewContext(`(()=>{const window={};${fs.readFileSync('js/award.js','utf8')};return window.AwardCore.PRIZES})()`);
assert.deepStrictEqual(Array.from(prizes), [10000,9000,8000,7000,6000,5000,4000,3000,2000,1000]);
assert.strictEqual(prizes.length, 10, 'monthly prizes must remain limited to ranks 1-10');
console.log('PASS asset leaderboard: Top 100 display, av ranking, Top 10 monthly prizes, state, load order, rules');
