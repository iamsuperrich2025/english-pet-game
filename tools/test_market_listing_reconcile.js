'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const online = fs.readFileSync('js/online.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const block = online.match(/const marketListingChecks = Object\.create\(null\);[\s\S]*?\nfunction marketWatch\(\)\{/);
assert.ok(block, 'market listing reconciliation block not found');
const reconcileSource = block[0].replace(/\nfunction marketWatch\(\)\{$/, '');

function snap(value){ return {exists:()=>value !== null, val:()=>value}; }
const paths = {
  'market/live': {sid:'seller-1'},
  'msold/seller-1/live': null,
  'market/processing': {sid:'seller-1', st:'processing'},
  'msold/seller-1/processing': null,
  'market/sold': null,
  'msold/seller-1/sold': {settled:true},
  'market/stale': null,
  'msold/seller-1/stale': null,
};
const messages = [];
let saves = 0;
let renders = 0;
const context = {
  Online: {
    db: {ref:path=>({once:()=>Promise.resolve(snap(paths[path] === undefined ? null : paths[path]))})},
    marketOk: true,
    market: [],
    marketListingStatus: {},
  },
  state: {
    listings: [
      {id:'cake_stale', price:1000000, listedAt:1, netKey:'stale'},
      {id:'cake_sold', price:500, listedAt:2, netKey:'sold'},
    ],
    collection: [],
  },
  onlineKey: ()=>'seller-1',
  saveState: ()=>{ saves++; },
  renderMarketCard: ()=>{ renders++; },
  toast: msg=>messages.push(msg),
  sfx: {wrong:()=>{}},
  Promise,
  Object,
  String,
  Array,
  setTimeout,
};
vm.createContext(context);
vm.runInContext(reconcileSource, context);

(async()=>{
  assert.strictEqual(await context.marketResolveMissingListing('live'), 'online');
  assert.strictEqual(context.Online.marketListingStatus.live, 'online');

  assert.strictEqual(await context.marketResolveMissingListing('processing'), 'online');
  assert.strictEqual(context.Online.marketListingStatus.processing, 'sold', 'claimed listing must show settlement state');

  assert.strictEqual(await context.marketResolveMissingListing('sold'), 'sold');
  assert.strictEqual(context.Online.marketListingStatus.sold, 'sold');
  assert.ok(context.state.listings.some(l=>l.netKey === 'sold'), 'receipt listing must wait for sold watcher');

  assert.strictEqual(await context.marketResolveMissingListing('stale'), 'restored');
  assert.deepStrictEqual(Array.from(context.state.collection), ['cake_stale']);
  assert.ok(!context.state.listings.some(l=>l.netKey === 'stale'), 'stale listing must be removed');
  assert.strictEqual(messages[0], '⚠️ การลงขายสินค้านี้ไม่สำเร็จ');
  assert.strictEqual(saves, 1);
  assert.strictEqual(renders, 4, 'live, processing, sold, and restored states must each refresh the market UI');

  assert.strictEqual(await context.marketResolveMissingListing('stale'), 'gone');
  assert.deepStrictEqual(Array.from(context.state.collection), ['cake_stale'], 'retry must not duplicate restored item');
  assert.strictEqual(saves, 1, 'retry must not save or restore twice');

  assert.ok(ui.includes("netState === 'online'"), 'online label must require verified live state');
  assert.ok(ui.includes('กำลังตรวจสอบสถานะการขาย…'), 'checking label missing');
  assert.ok(!/const st = l\.netKey\s*\?\s*\{t:'🌏 แขวนอยู่ในตลาดเพื่อนออนไลน์/.test(ui), 'netKey alone must not claim online listing');

  console.log('PASS market listing reconciliation: live/sold/stale states, auto-restore, no duplicate');
})().catch(err=>{ console.error(err); process.exit(1); });
