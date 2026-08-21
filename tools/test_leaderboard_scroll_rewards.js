"use strict";
const fs = require("fs");
const assert = require("assert");

const read = p => fs.readFileSync(p, "utf8");
const state = read("js/state.js");
const ui = read("js/ui.js");
const award = read("js/award.js");
const tp = read("js/tpaward.js");
const lobbyCss = read("css/lobby.css");
const graph = read("js/rankgraph.js");
const graphCss = read("css/rankgraph.css");

assert(state.includes("if(typeof onlinePushScore === 'function') onlinePushScore();"), "saveState must sync leaderboard immediately");
assert(ui.includes("coins:Math.round(state.coins||0)"), "coin leaderboard must use the signed-in player's live lobby balance");
assert(ui.includes('class="lbf-scroll"') && ui.includes('aria-label="เลื่อนดูอันดับผู้เล่นทั้งหมด"'), "leaderboard needs a vertical scroll region");
assert(/\.lbf-scroll\{[^}]*overflow-y:auto;[^}]*overflow-x:hidden;/s.test(lobbyCss), "leaderboard must allow only vertical scrolling");
assert(/\.lbf-scroll::-webkit-scrollbar\{[^}]*display:none/s.test(lobbyCss), "leaderboard scrollbar must be hidden");

const doubled = [20000,18000,16000,14000,12000,10000,8000,6000,4000,2000];
const m = tp.match(/prizes:\s*\[([^\]]+)\]/);
assert(m, "typing award needs a custom prize table");
assert.deepStrictEqual(m[1].split(",").map(Number), doubled, "typing Top 10 prizes must be doubled");
assert(award.includes("const PRIZES = Array.isArray(cfg.prizes)"), "award engine must honor per-category prizes");

assert(graph.includes("หนึ่งผู้เล่นต่อหนึ่งแถว"), "rank graph must use readable vertical rows");
assert(/\.rg-stage\{[^}]*overflow-y:auto;[^}]*overflow-x:hidden;/s.test(graphCss), "rank graph must allow only vertical scrolling");
assert(/\.rg-stage::-webkit-scrollbar\{[^}]*display:none/s.test(graphCss), "rank graph scrollbar must be hidden");

console.log("leaderboard scroll/reward regression: PASS");
