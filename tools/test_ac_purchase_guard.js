'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js', 'ui.js'), 'utf8');
const stateSource = fs.readFileSync(path.join(root, 'js', 'state.js'), 'utf8');
const mainSource = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
const start = ui.indexOf('function buyAC(){');
const end = ui.indexOf('\nfunction openHomeShop(){', start);
assert.ok(start >= 0 && end > start, 'buyAC block must exist');

const callbacks = [];
let confirmOpen = false;
let sales = 0;
let saves = 0;
const context = {
  AC_PRICE:20000,
  AC_INSTALL:5000,
  state:{home:'medium', ac:false, coins:100000, pets:[{type:'cat', heatFrom:123}], acPurchaseLog:[]},
  document:{getElementById:id => id === 'ac-buy-confirm' && confirmOpen ? {} : null},
  askConfirm:(html, label, callback)=>{
    assert.match(html, /id="ac-buy-confirm"/);
    assert.equal(label, 'ติดเลย!');
    confirmOpen = true;
    callbacks.push(callback);
  },
  fmtNum:String,
  toast:()=>{},
  renderDashboard:()=>{},
  saveState:()=>{ saves++; },
  sellInc:id=>{ assert.equal(id, 'ac'); sales++; },
  sfx:{wrong:()=>{}, buy:()=>{}},
  Date,
};
vm.createContext(context);
vm.runInContext(ui.slice(start, end), context);

context.buyAC();
context.buyAC();
assert.equal(callbacks.length, 1, 'rapid taps must open only one confirmation');
confirmOpen = false;
callbacks[0]();
assert.equal(context.state.coins, 75000);
assert.equal(context.state.ac, true);
assert.equal(context.state.acPurchaseLog.length, 1);
assert.equal(context.state.pets[0].heatFrom, null);
assert.equal(sales, 1);
assert.equal(saves, 1);

callbacks[0]();
assert.equal(context.state.coins, 75000, 'replayed confirmation callback must not charge twice');
assert.equal(context.state.acPurchaseLog.length, 1, 'replayed callback must not duplicate audit rows');
assert.equal(sales, 1);
assert.equal(saves, 1);

assert.match(stateSource, /acPurchaseLog:\[\]/);
assert.match(stateSource, /s\.acPurchaseLog = s\.acPurchaseLog\.filter/);
assert.match(stateSource, /acDuplicateRefunds:\{\}/);
assert.match(mainSource, /function showAcDuplicateRefundNotice\(\)/);
assert.match(mainSource, /data-ac-duplicate-refund/);
const noticeStart = mainSource.indexOf('function showAcDuplicateRefundNotice(){');
const noticeEnd = mainSource.indexOf('\n/* 🔍', noticeStart);
const noticeSource = mainSource.slice(noticeStart, noticeEnd);
assert.equal((noticeSource.match(/state\.acDuplicateRefundNotice\s*=\s*null/g) || []).length, 1,
  'refund notice may be cleared only by the acknowledge button');
assert.match(noticeSource, /querySelector\('\.rankup-btn'\)\.addEventListener\('click'/,
  'acknowledge button must own the only notice-clearing handler');
assert.doesNotMatch(noticeSource, /ov\.addEventListener\('click'|keydown|Escape|setTimeout\([^)]*ov\.remove/,
  'refund notice must not auto-dismiss, close on backdrop, or close on Escape');
console.log('PASS AC purchase guard: one charge only, bounded audit state, persistent refund notice until acknowledge');
