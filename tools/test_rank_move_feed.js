/* Regression: lobby rank-movement feed reports improvements only. */
'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('js/ui.js', 'utf8');
const start = source.indexOf('const RANK_MOVE_TOPICS =');
const end = source.indexOf('const LB_BCAT_TOP =', start);
assert(start >= 0 && end > start, 'rank movement zone not found');

const feed = {innerHTML:'', id:'rank-move-feed'};
const rowsByTab = {
  coins: [
    {uid:'a', name:'Alpha'},
    {uid:'b', name:'Bee'}
  ]
};
let scrollInits = 0;
const context = {
  Online: {ready:true, boardReady:true, bbBoardReady:true},
  document: {getElementById:id=>id === 'rank-move-feed' ? feed : null},
  escapeHTML:s=>String(s).replace(/[&<>"']/g, c=>({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[c]),
  initSideScroll:el=>{ assert.strictEqual(el, feed); scrollInits += 1; },
  lbRankRows:tab=>rowsByTab[tab] || []
};
vm.createContext(context);
vm.runInContext(source.slice(start, end)
  + '\nglobalThis.__rankMoveTest={check:rankMoveFeedCheck,items:__rankMoveItems};', context);

context.__rankMoveTest.check();
assert.strictEqual(context.__rankMoveTest.items.length, 0, 'baseline must stay silent');

rowsByTab.coins = [
  {uid:'b', name:'Bee'},
  {uid:'a', name:'Alpha'}
];
context.__rankMoveTest.check();
assert.strictEqual(context.__rankMoveTest.items.length, 1, 'only the improving player is reported');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(context.__rankMoveTest.items[0])),
  {uid:'b', name:'Bee', ico:'🪙', topic:'เหรียญ', from:2, to:1, up:1}
);
assert(feed.innerHTML.includes('Bee'), 'improving player name is rendered');
assert(feed.innerHTML.includes('เหรียญ'), 'ranking topic is rendered');
assert(feed.innerHTML.includes('#2→#1'), 'old and new rank are rendered');
assert(!feed.innerHTML.includes('Alpha'), 'falling player is not reported');

context.__rankMoveTest.check();
assert.strictEqual(context.__rankMoveTest.items.length, 1, 'unchanged rankings do not duplicate reports');
assert(scrollInits >= 2, 'auto-scroll is initialized for the feed');

/* The shared scroller must stop while touched and resume exactly after 5 seconds. */
const scrollStart = source.indexOf('const SIDE_SCROLL_SPEED');
const scrollEnd = source.indexOf('/* ============================================================\n   Daily Quest', scrollStart);
assert(scrollStart >= 0 && scrollEnd > scrollStart, 'shared side-scroll zone not found');
let now = 1000;
const listeners = {};
const chunks = [{offsetTop:0}, {offsetTop:100}];
const scrollEl = {
  id:'rank-move-feed', clientHeight:32, scrollHeight:100, scrollTop:0, __ssBound:false,
  _html:'<div>row</div>',
  get innerHTML(){ return this._html; }, set innerHTML(v){ this._html = v; },
  addEventListener:(type, fn)=>{ listeners['el:'+type] = fn; },
  querySelectorAll:()=>chunks
};
const scrollContext = {
  Date:{now:()=>now},
  document:{getElementById:id=>id === scrollEl.id ? scrollEl : null},
  window:{addEventListener:(type, fn)=>{ listeners['win:'+type] = fn; }},
  requestAnimationFrame:()=>{}
};
vm.createContext(scrollContext);
vm.runInContext(source.slice(scrollStart, scrollEnd)
  + '\nglobalThis.__scrollTest={init:initSideScroll,tick:sideScrollTick,state:sideScrollSt};', scrollContext);
scrollContext.__scrollTest.init(scrollEl);
now = 3000;
scrollContext.__scrollTest.tick(1000);
scrollContext.__scrollTest.tick(2000);
assert(scrollEl.scrollTop > 0, 'feed auto-scrolls when untouched');

listeners['el:pointerdown']();
scrollEl.scrollTop = 40;
scrollContext.__scrollTest.tick(3000);
assert.strictEqual(scrollEl.scrollTop, 40, 'touch holds the current user-selected position');
listeners['win:pointerup']();
now = 7999;
scrollContext.__scrollTest.tick(4000);
assert.strictEqual(scrollEl.scrollTop, 40, 'feed stays paused during the 5-second grace period');
now = 8001;
scrollContext.__scrollTest.tick(5000);
assert(scrollEl.scrollTop > 40, 'feed resumes after the 5-second grace period');

console.log('PASS rank movement feed: baseline silent, improvements only, topic and rank delta rendered');
