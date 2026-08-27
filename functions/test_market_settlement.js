'use strict';

const assert = require('assert');
const fs = require('fs');
const {applyBuyer, applySeller, refundBuyer} = require('./market-settlement');
const {acquireSettlementLease, claimMarketListing} = require('./index')._test;

const functionSource = fs.readFileSync('./index.js', 'utf8');
assert.equal((functionSource.match(/\.transaction\(/g) || []).length, 1,
  'all secure market transactions must use the null-guess-safe wrapper');

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

(async()=>{
  const listing = {sid: 'seller', id: 'cake', p: 500, sn: 'ผู้ขาย'};
  const claimed = {...listing, st: 'processing', tx: claim.tx, bid: claim.bid, bn: claim.bn};
  let callbacks = 0;
  const nullGuessRef = {
    transaction(update){
      callbacks++;
      const proposal = update(null); // Firebase's first local guess can be null.
      assert.equal(proposal.st, 'processing', 'first null guess must not abort a live listing');
      callbacks++;
      const authoritative = update(listing);
      return Promise.resolve({committed: true, snapshot: {val: ()=>authoritative}});
    },
  };
  const live = await claimMarketListing(nullGuessRef, listing, claim.tx, claim.bid, claim.bn);
  assert.equal(live.result.committed, true);
  assert.equal(live.reason, '');
  assert.equal(callbacks, 2);
  assert.equal(live.result.snapshot.val().tx, claim.tx);

  let deletedCallbacks = 0;
  const deletedDuringClaimRef = {
    transaction(update){
      deletedCallbacks++;
      const staleProposal = update(null);
      assert.equal(staleProposal.st, 'processing');
      deletedCallbacks++;
      const retry = update(null); // Server says it was really deleted after the pre-read.
      assert.equal(retry, undefined, 'authoritative null retry must abort instead of resurrecting');
      return Promise.resolve({committed: false, snapshot: {val: ()=>null}});
    },
  };
  const gone = await claimMarketListing(deletedDuringClaimRef, claimed, claim.tx, claim.bid, claim.bn);
  assert.equal(gone.result.committed, false);
  assert.equal(gone.reason, 'sold_out');
  assert.equal(deletedCallbacks, 2);

  const ledger = {tx: claim.tx, key: claim.key, status: 'claimed'};
  const leaseRef = {
    get(){ return Promise.resolve({val: ()=>ledger}); },
    transaction(update){
      const proposal = update(null);
      assert.equal(proposal.status, 'claimed', 'lease must survive the first null guess');
      return Promise.resolve({committed: true, snapshot: {val: ()=>proposal}});
    },
  };
  const lease = await acquireSettlementLease(leaseRef, 'worker-1');
  assert.equal(lease.acquired, true, 'claimed purchase must acquire a settlement lease');
  assert.equal(lease.ledger.leaseBy, 'worker-1');
  assert.ok(lease.ledger.leaseUntil > Date.now());

  console.log('PASS secure market settlement: idempotent settlement + RTDB null-guess-safe claim/lease/save/release');
})().catch(error=>{ console.error(error); process.exit(1); });
