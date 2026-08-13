'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const online = fs.readFileSync('js/online.js', 'utf8');
const state = fs.readFileSync('js/state.js', 'utf8');
const cfg = fs.readFileSync('js/onlinecoinaward.js', 'utf8');
const html = fs.readFileSync('index_classic.html', 'utf8');
const build = fs.readFileSync('tools/build_web.mjs', 'utf8');
const rulesText = fs.readFileSync('handoff/RULES.md', 'utf8');

assert.ok(ui.includes("'coins','assets','online','badges'"), 'online coin tab must follow assets');
assert.ok(ui.includes('const LB_ONLINE_TOP = 100;'), 'online coin leaderboard must show Top 100');
assert.ok(ui.includes('data-t="online">🌐 เหรียญออนไลน์'), 'full-screen online coin tab missing');
assert.ok(/if\(tab === 'online'\)[\s\S]*?Online\.onlineCoinBoard[\s\S]*?slice\(0, LB_ONLINE_TOP\)/.test(ui), 'online ranks must use the dedicated Top 100 board');
assert.ok(/tab === 'online'[\s\S]*?OnlineCoinAward\.prizeFor\(i\+1\)/.test(ui), 'online prizes are not connected to rank rows');
assert.ok(ui.includes("'🌐 อันดับเหรียญออนไลน์'"), 'online coin leaderboard title missing');

assert.ok(online.includes('const oe    = Math.round(state.onlineEarned || 0);'), 'wallet online earnings must be the published score');
assert.ok(online.includes('bb, oe}, base'), 'new score payload must include oe');
assert.ok(online.includes("orderByChild('oe').limitToLast(LEADERBOARD_QUERY_SIZE)"), 'online coin board needs its own indexed query');
assert.ok(online.includes('Online.onlineCoinBoard=out.slice(0,LEADERBOARD_SIZE)'), 'online coin board must cap at 100');

assert.ok(cfg.includes("field:   'oe'"), 'award must rank leaderboard.oe');
assert.ok(cfg.includes('state.onlineEarned || 0'), 'self award score must use the Lobby online wallet total');
assert.ok(cfg.includes('ไม่รีเซ็ตรายวัน'), 'online coin rules must state that the total never resets daily');
assert.ok(state.includes('state.onlineEarned += whole'), 'online earnings must accumulate onto the saved lifetime total');
const dailyTick = state.match(/function dailyTick\(\)\{([\s\S]*?)\n\}/)[1];
assert.ok(!dailyTick.includes('onlineEarned'), 'online lifetime total must not reset with daily state');
assert.ok(cfg.includes('Online.onlineCoinBoard || []'), 'monthly cut must use the dedicated online board');
assert.ok(html.indexOf('js/award.js') < html.indexOf('js/onlinecoinaward.js'), 'online award must load after the shared factory');
assert.ok(build.includes("'js/onlinecoinaward.js'"), 'production build must include the new module');
assert.ok(state.includes("onlineCoinAwardSeen:''") && state.includes('onlineCoinAwardPaid:[]') && state.includes('onlineCoinAwardLog:[]'), 'award state defaults missing');

const jsonBlock = rulesText.match(/```json\s*([\s\S]*?)\s*```/);
assert.ok(jsonBlock, 'rules JSON block missing');
const rules = JSON.parse(jsonBlock[1]).rules;
assert.ok(rules.leaderboard['.indexOn'].includes('oe'), 'leaderboard.oe index missing');
assert.ok(rules.leaderboard.$uid.oe, 'leaderboard.oe validation missing');
assert.ok(rules.onlineCoinAward && rules.onlineCoinAward.$m, 'onlineCoinAward rules zone missing');
assert.strictEqual(rules.onlineCoinAward.$m.$other['.validate'], false, 'unknown award snapshot fields must be rejected');

const prizes = vm.runInNewContext(`(()=>{const window={};${fs.readFileSync('js/award.js','utf8')};return window.AwardCore.PRIZES})()`);
assert.deepStrictEqual(Array.from(prizes), [10000,9000,8000,7000,6000,5000,4000,3000,2000,1000]);
console.log('PASS online coin leaderboard: wallet source, dedicated Top 100 query, Top 10 prizes, state, build, rules');
