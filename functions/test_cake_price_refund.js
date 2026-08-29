'use strict';
const assert = require('node:assert/strict');
const {
  CAMPAIGN, CAKE_PRICE_POLICY, collectCakeRefundEntitlements, applyCakeRefundEntitlement,
} = require('./cake-price-refund');

assert.equal(Object.keys(CAKE_PRICE_POLICY).length, 125);
for (const policy of Object.values(CAKE_PRICE_POLICY)) {
  assert.ok(policy.newPrice >= 3000 && policy.newPrice <= 5000);
}

const save = state => ({data:JSON.stringify(state), at:10});
const users = {
  receiver:{save:save({coins:10, giftBox:[
    {k:'shop', id:'cake_gold', from:'buyerA', ts:1},
    {k:'collect', id:'cake2026_100', from:'buyerA', ts:2},
    {k:'shop', id:'cake_heart', from:'buyerA', ts:3},
  ]})},
  buyerA:{save:save({coins:100, giftBox:[]})},
};
const gifts = {
  friendB:{
    buyerA:{pendingHigh:{k:'shop', id:'cake_pearl', st:'pending'}},
    buyerB:{pendingLow:{k:'shop', id:'cake_dino', st:'pending'}},
  },
};
const entitlements = collectCakeRefundEntitlements(users, gifts);
assert.equal(entitlements.buyerA.amount, (20000-5000) + (22000-5000));
assert.equal(entitlements.buyerA.acceptedCount, 1);
assert.equal(entitlements.buyerA.pendingCount, 1);
assert.equal(entitlements.buyerA.escrow['friendB:pendingHigh'], 5000);
assert.equal(entitlements.buyerB.amount, 0);
assert.equal(entitlements.buyerB.escrow['friendB:pendingLow'], 1500);

const first = applyCakeRefundEntitlement(users.buyerA.save, entitlements.buyerA, 1000);
assert.equal(first.state.coins, 32100);
assert.equal(first.state.cakeGiftRefundNotice.total, 32000);
assert.ok(first.state.cakePriceRefunds[CAMPAIGN]);
const twice = applyCakeRefundEntitlement(first.wrapper, entitlements.buyerA, 2000);
assert.equal(twice.state.coins, 32100, 'campaign must never refund twice');
assert.equal(twice.changed, false);
console.log('PASS cake gift price refund: accepted/pending only, escrow grandfathering, idempotent credit');
