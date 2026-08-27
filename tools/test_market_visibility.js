'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const online = fs.readFileSync('js/online.js', 'utf8');
const rules = fs.readFileSync('handoff/RULES.md', 'utf8');
const browse = ui.match(/function renderMarketBrowse\(\)\{[\s\S]*?\r?\n\}(?=\r?\n\r?\n\/\* 🛒)/);
assert.ok(browse, 'renderMarketBrowse block not found');

const context = {
  Online: {
    marketOk: true,
    market: [
      {key: 'mine-key', sid: 'me', sn: 'ร้านฉัน', id: 'mine', p: 500},
      {key: 'other-key', sid: 'other', sn: 'ร้านผู้เล่นอื่น', id: 'other', p: 700},
    ],
  },
  onlineKey: ()=>'me',
  state: {coins: 1000, wishlist: []},
  collectInfo: id=>({name: id === 'mine' ? 'สินค้าของฉัน' : 'สินค้าคนอื่น', emoji: '📦', tier: 'c'}),
  COLLECT_TIERS: {c: {color: '#08c', stars: '★'}},
  collectImg: ()=>null,
  escapeHTML: value=>String(value),
  fmtNum: value=>String(value),
};
vm.createContext(context);
vm.runInContext(browse[0], context);
const html = context.renderMarketBrowse();

assert.ok(html.includes('สินค้าของฉัน'), 'seller must see their own listing');
assert.ok(html.includes('ร้านของฉัน'), 'own listing label missing');
assert.ok(html.includes('โพสต์ขายแล้ว'), 'own listing status missing');
assert.ok(!html.includes('data-key="mine-key"'), 'own listing must not expose a buy action');
assert.ok(html.includes('data-key="other-key"'), 'other player listing must remain buyable');
assert.ok(html.includes('สินค้าคนอื่น'), 'global market must include non-friend players');
assert.ok(html.includes('ตลาดผู้เล่นทั้งหมด'), 'global market heading missing');
assert.ok(html.includes('ทุกคนเห็นทุกประกาศ'), 'global visibility explanation missing');
assert.ok(!ui.includes('(Online.market || []).filter(m=>m.sid !== me)'), 'own-listing exclusion returned');

const watch = online.match(/function marketWatch\(\)\{[\s\S]*?\r?\n\}(?=\r?\n\/\* ลงขายจริง)/);
assert.ok(watch, 'marketWatch block not found');
assert.ok(watch[0].includes("Online.db.ref('market').limitToLast(120)"), 'market must watch the shared global root');
assert.ok(!/friends|friendCodes|friendReq/.test(watch[0]), 'global market must not filter by friendship');
assert.ok(/"market":\s*\{\s*"\.read":\s*"auth != null"/.test(rules), 'market rules must allow every signed-in player to read');

console.log('PASS market visibility: own listing shown safely + global listings visible to every signed-in player');
