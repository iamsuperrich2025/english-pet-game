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

assert(ui.includes("const LB_TP_DISPLAY = 100;"), "typing full leaderboard must use the same display limit as coins");
assert(/if\(tab === 'tp'\)[\s\S]*?slice\(0, LB_TP_DISPLAY\)/.test(ui), "typing rank rows must include players below the prize Top 10");
assert(ui.includes("const LB_WS_TOP = 10;") && ui.includes("const LB_WS_DISPLAY = 100;"), "word search must keep Top 10 prizes while displaying Top 100");
assert(/if\(tab === 'ws'\)[\s\S]*?slice\(0, LB_WS_DISPLAY\)/.test(ui), "word search must include players below the prize Top 10");
assert(ui.includes("const LB_PM_TOP = 10;") && ui.includes("const LB_PM_DISPLAY = 100;"), "picture matching must keep Top 10 prizes while displaying Top 100");
assert(/if\(tab === 'pm'\)[\s\S]*?slice\(0, LB_PM_DISPLAY\)/.test(ui), "picture matching must include players below the prize Top 10");
assert(ui.includes("const LB_BB_TOP = 10;") && ui.includes("const LB_BB_DISPLAY = 100;"), "bubble must keep Top 10 prizes while displaying Top 100");
assert(/if\(tab === 'bb'\)[\s\S]*?slice\(0,LB_BB_DISPLAY\)/.test(ui), "bubble must include players below the prize Top 10");
assert(ui.includes("const LB_SG_TOP = 10;") && ui.includes("const LB_SG_DISPLAY = 100;"), "shoot word must keep Top 10 prizes while displaying Top 100");
assert(/if\(tab === 'sg'\)[\s\S]*?slice\(0, LB_SG_DISPLAY\)/.test(ui), "shoot word must include players below the prize Top 10");
assert(ui.includes("__lbfTab === 'ws' ? LB_WS_DISPLAY"), "full leaderboard must use the word-search display limit");
assert(ui.includes("__lbfTab === 'pm' ? LB_PM_DISPLAY"), "full leaderboard must use the picture-matching display limit");
assert(ui.includes("__lbfTab === 'bb' ? LB_BB_DISPLAY"), "full leaderboard must use the bubble display limit");
assert(ui.includes("__lbfTab === 'sg' ? LB_SG_DISPLAY"), "full leaderboard must use the shoot-word display limit");
assert(ui.includes("sort((a,b)=> b.ws - a.ws).slice(0, LB_WS_DISPLAY)"), "word-search ranks must stay in descending score order");
assert(ui.includes("sort((a,b)=> b.pm - a.pm).slice(0, LB_PM_DISPLAY)"), "picture-matching ranks must stay in descending score order");
assert(ui.includes("sort((a,b)=>b.bb-a.bb).slice(0,LB_BB_DISPLAY)"), "bubble ranks must stay in descending score order");
assert(ui.includes("sort((a,b)=> b.sg - a.sg).slice(0, LB_SG_DISPLAY)"), "shoot-word ranks must stay in descending score order");

const doubled = [20000,18000,16000,14000,12000,10000,8000,6000,4000,2000];
const m = tp.match(/prizes:\s*\[([^\]]+)\]/);
assert(m, "typing award needs a custom prize table");
assert.deepStrictEqual(m[1].split(",").map(Number), doubled, "typing Top 10 prizes must be doubled");
assert(award.includes("const PRIZES = Array.isArray(cfg.prizes)"), "award engine must honor per-category prizes");

assert(graph.includes("หนึ่งผู้เล่นต่อหนึ่งแถว"), "rank graph must use readable vertical rows");
assert(/\.rg-stage\{[^}]*overflow-y:auto;[^}]*overflow-x:hidden;/s.test(graphCss), "rank graph must allow only vertical scrolling");
assert(/\.rg-stage::-webkit-scrollbar\{[^}]*display:none/s.test(graphCss), "rank graph scrollbar must be hidden");

console.log("leaderboard scroll/reward regression: PASS");
