'use strict';
const assert = require('assert');
const fs = require('fs');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const cfg = fs.readFileSync('js/coinaward.js', 'utf8');
const state = fs.readFileSync('js/state.js', 'utf8');
const html = fs.readFileSync('index_classic.html', 'utf8');
const build = fs.readFileSync('tools/build_web.mjs', 'utf8');
const rulesText = fs.readFileSync('handoff/RULES.md', 'utf8');
const rules = JSON.parse(rulesText.match(/```json\s*([\s\S]*?)```/)[1]);

assert.ok(cfg.includes("path:    'coinAward'"), 'coin award RTDB path missing');
assert.ok(cfg.includes("field:   'coins'"), 'coin award must rank by leaderboard coins');
assert.ok(cfg.includes("scoreOf: ()=> (typeof state !== 'undefined' ? (state.coins || 0) : 0)"), 'local coin score missing');
assert.ok(ui.includes("tab === 'coins' ? (typeof CoinAward !== 'undefined' ? CoinAward : null)"), 'coin award bar missing');
assert.ok(ui.includes("pz:(typeof CoinAward !== 'undefined') ? CoinAward.prizeFor(i+1) : 0"), 'coin rank prize labels missing');
assert.ok(ui.includes("if(e.target.closest('.coa-open'))"), 'coin award board handler missing');
assert.ok(state.includes("coinAwardSeen:''") && state.includes('coinAwardPaid:[]') && state.includes('coinAwardLog:[]'), 'coin award state defaults missing');
assert.ok(html.indexOf('js/award.js') < html.indexOf('js/coinaward.js'), 'coin award must load after shared factory');
assert.ok(build.includes("'js/coinaward.js'"), 'production build must include coin award module');
assert.ok(rules.rules.coinAward && rules.rules.coinAward.$m, 'coinAward rules zone missing');
assert.strictEqual(rules.rules.coinAward.$m.w.$uid.$other['.validate'], false, 'unknown award fields must be rejected');

const award = fs.readFileSync('js/award.js', 'utf8');
const prizes = award.match(/const PRIZES = \[([^\]]+)\]/)[1].split(',').map(Number);
assert.deepStrictEqual(prizes, [10000,9000,8000,7000,6000,5000,4000,3000,2000,1000]);
console.log('PASS coin leaderboard monthly award');
