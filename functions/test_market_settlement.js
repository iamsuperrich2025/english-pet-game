'use strict';

const assert = require('assert');
const {applyBuyer, applySeller, refundBuyer} = require('./market-settlement');

function wrapper(state) { return {data: JSON.stringify(state), at: 1}; }
function read(result) { return JSON.parse(result.wrapper.data); }

const claim = {tx: 'tx-1234567890123456', key: '-market-key-123456', bid: 'buyer', sid: 'seller', bn: 'ผู้ซื้อ', id: 'cake', p: 500};

const buyerBase = wrapper({coins: 1000, collection: [], listings: [], wishlist: ['cake'], marketTx: {}});
const buyerOnce = applyBuyer(buyerBase, claim, 100);
assert.equal(read(buyerOnce).coins, 500);
assert.deepEqual(read(buyerOnce).collection, ['cake']);
assert.deepEqual(read(buyerOnce).wishlist, []);
const buyerTwice = applyBuyer(buyerOnce.wrapper, claim, 200);
assert.equal(read(buyerTwice).coins, 500, 'buyer must not pay twice');
assert.deepEqual(read(buyerTwice).collection, ['cake'], 'buyer must not receive twice');

const sellerBase = wrapper({
  coins: 20, daily: {date: '', coins: 0}, lifetimeCoins: 100,
  collection: [], listings: [{netKey: claim.key, id: 'cake', price: 500}], tradeSold: [], marketTx: {},
});
const sellerOnce = applySeller(sellerBase, claim, Date.UTC(2026, 7, 20, 16));
assert.equal(read(sellerOnce).coins, 520);
assert.equal(read(sellerOnce).lifetimeCoins, 600);
assert.equal(read(sellerOnce).listings.length, 0);
assert.equal(read(sellerOnce).tradeSold.length, 1);
const sellerTwice = applySeller(sellerOnce.wrapper, claim, Date.UTC(2026, 7, 20, 17));
assert.equal(read(sellerTwice).coins, 520, 'seller must not be paid twice');

const refunded = refundBuyer(buyerOnce.wrapper, claim, 300);
assert.equal(read(refunded).coins, 1000);
assert.deepEqual(read(refunded).collection, []);
const refundedTwice = refundBuyer(refunded.wrapper, claim, 400);
assert.equal(read(refundedTwice).coins, 1000, 'refund must be idempotent');

assert.throws(()=>applyBuyer(wrapper({coins: 100, collection: [], listings: []}), claim, 1), /not_enough_coins/);
assert.throws(()=>applySeller(wrapper({coins: 0, collection: [], listings: [], tradeSold: []}), claim, 1), /seller_not_ready/);

console.log('PASS secure market settlement: buyer/seller/refund are idempotent');
