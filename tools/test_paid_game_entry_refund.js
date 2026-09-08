'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const stateSrc = fs.readFileSync('js/state.js', 'utf8');
const main = fs.readFileSync('js/main.js', 'utf8');
const items = fs.readFileSync('js/data/items.js', 'utf8');
const calendar = fs.readFileSync('js/data/calendar.js', 'utf8');

const blockStart = ui.indexOf('function worldEntryStarted()');
const blockEnd = ui.indexOf('function railWorldClick(', blockStart);
assert.ok(blockStart >= 0 && blockEnd > blockStart, 'free-entry and legacy-refund block must exist');

const ctx = {
  console,
  state:{coins:1000, gameEntryTx:null, gameEntryRefundNotice:null, advTicket:false},
  saveCount:0, railCount:0, syncCount:0, sellCount:0, resetCount:0, noticeCount:0,
  saveState(){ ctx.saveCount++; },
  renderRailWorlds(){ ctx.railCount++; },
  syncCoinHeader(){ ctx.syncCount++; },
  sellInc(){ ctx.sellCount++; },
  feedEvent(){},
  fmtNum:n=>String(n),
  advResetLoad(){ ctx.resetCount++; },
  sfx:{buy(){}, wrong(){}},
  toast(){},
  setTimeout(fn){ fn(); return 1; },
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(ui.slice(blockStart, blockEnd), ctx);
ctx.showGameEntryRefundNotice = ()=>{ ctx.noticeCount++; };

// คืนเงินต้อง atomic ใน state, rollback สิทธิ์ชั่วคราว และห้ามคืนซ้ำด้วย tx id เดิม
const tx = {id:'tx-1', amount:500, game:'โลกทดสอบ', ticketKey:'advTicket', wasUnlocked:false};
ctx.state.gameEntryTx = tx;
ctx.state.advTicket = true;
assert.strictEqual(ctx.gameEntryRefund(tx, 'โหลดไม่สำเร็จ'), true);
assert.strictEqual(ctx.state.coins, 1500);
assert.strictEqual(ctx.state.gameEntryTx, null);
assert.strictEqual(ctx.state.advTicket, false);
assert.strictEqual(ctx.state.gameEntryRefundNotice.amount, 500);
assert.strictEqual(ctx.state.gameEntryRefundNotice.reason, 'โหลดไม่สำเร็จ');
assert.strictEqual(ctx.gameEntryRefund(tx, 'ซ้ำ'), false);
assert.strictEqual(ctx.state.coins, 1500, 'same transaction must never refund twice');

// แม้ข้อมูลราคาเก่าหลุดเข้ามา เส้นทางเปิดเกมล้มเหลวต้องไม่หักเหรียญหรือสร้าง refund notice ใหม่
ctx.state = {coins:1000, gameEntryTx:null, gameEntryRefundNotice:null, advTicket:false};
const overlay = {removed:false, remove(){ this.removed=true; }};
const button = {disabled:false};
const worldFail = {mode:'adv', label:'ทดสอบ', ticketKey:'advTicket', enter:async()=>ctx.worldEntryStopped('เครื่องเล่นไม่ได้')};
(async()=>{
  await ctx.startWorldEntry(worldFail, {free:false, fee:500}, false, overlay, button);
  assert.strictEqual(ctx.state.coins, 1000);
  assert.strictEqual(ctx.state.gameEntryTx, null);
  assert.strictEqual(ctx.state.gameEntryRefundNotice, null);
  assert.strictEqual(ctx.state.advTicket, false);
  assert.strictEqual(ctx.noticeCount, 0);

  // เส้นทางสำเร็จ: เข้าได้ฟรีแม้ caller ส่ง fee เก่ามา และยังบันทึกว่าเคยเข้าโลก
  ctx.state = {coins:1000, gameEntryTx:null, gameEntryRefundNotice:null, advTicket:false};
  const worldOk = {mode:'adv', label:'ทดสอบ', ticketKey:'advTicket', enter:async()=>ctx.worldEntryStarted()};
  await ctx.startWorldEntry(worldOk, {free:false, fee:500}, false, {remove(){}}, {disabled:false});
  assert.strictEqual(ctx.state.coins, 1000);
  assert.strictEqual(ctx.state.gameEntryTx, null);
  assert.strictEqual(ctx.state.advTicket, true);
  assert.strictEqual(ctx.sellCount, 1);

  // เครื่องค้าง/reload: boot ต้องกู้ tx หลัง Cloud sync แล้วแสดงกล่องก่อนคิวรางวัลอื่น
  assert.match(stateSrc, /gameEntryTx:null/);
  assert.match(stateSrc, /gameEntryRefundNotice:null/);
  assert.ok(main.indexOf('recoverInterruptedGameEntry()') < main.indexOf('careTick();'));
  assert.match(main, /showGameEntryRefundNotice\(\(\)=>showPetShoppingGrantNotice\(/);
  const startEntry = ui.slice(ui.indexOf('async function startWorldEntry('), ui.indexOf('function railWorldClick('));
  assert.doesNotMatch(startEntry, /state\.coins|gameEntryTx|\.fee/);
  assert.match(items, /const WORLD_ENTRY_FEE\s*=\s*0\s*;/);
  const calendarCtx = {};
  vm.runInNewContext(`${calendar};globalThis.results=['adv','sky','haunt','heli','drone','drive','soccer','moto','invasion','mecha','f1'].map(worldEntryInfo);`, calendarCtx);
  for(const result of calendarCtx.results){
    assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), {fee:0,free:true,discount:false,reason:'ทุกเกมเข้าเล่นฟรี',ownerDiscount:false,ownerReason:''});
  }
  for(const fn of ['enterSkyPlayground3D','enterAdventure3D','enterHaunted3D','enterHeli3D','enterDrone3D','enterDrive3D',
    'enterSoccer3D','enterMoto3D','enterF1_3D','enterInvasion3D','enterMecha3D']){
    const start=ui.indexOf(`async function ${fn}(`);
    const end=ui.indexOf('\nasync function ',start+16)>0 ? ui.indexOf('\nasync function ',start+16) : ui.length;
    assert.ok(start>=0, `${fn} must exist`);
    assert.match(ui.slice(start,end), /worldEntryStarted\(\)/, `${fn} must explicitly confirm a playable start`);
  }

  // กล่องต้องบอกคืนเงิน+จำนวน+สาเหตุ, เล่นเสียงเงินเข้า และปิดได้เฉพาะปุ่มรับทราบ
  const noticeStart = ui.indexOf('function showGameEntryRefundNotice(');
  const noticeEnd = ui.indexOf('async function startWorldEntry(', noticeStart);
  const notice = ui.slice(noticeStart, noticeEnd);
  assert.match(notice, /คืนค่าเข้าแล้ว/);
  assert.match(notice, /\+\$\{fmtNum\(b\.amount\)\} เหรียญ/);
  assert.match(notice, /escapeHTML\(b\.reason\)/);
  assert.match(notice, /setTimeout\(\(\)=>sfx\.coinGet\(\), 420\)/);
  assert.match(notice, />รับทราบ<\/button>/);
  assert.doesNotMatch(notice, /Escape|keydown|e\.target===ov/);
  assert.strictEqual((notice.match(/ov\.remove\(\)/g)||[]).length, 1,
    'refund notice may be removed only by the acknowledge button');

  assert.match(main, /ทุกโลกเข้าเล่นฟรี ไม่มีการหักเหรียญ/);
  console.log('PASS all game entries are free, hostile legacy fees cannot deduct coins, and pending legacy charges still refund safely');
})().catch(err=>{ console.error(err); process.exitCode=1; });
