'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const collectibles = fs.readFileSync('js/data/collectibles.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const stateSrc = fs.readFileSync('js/state.js', 'utf8');

const helpers = collectibles.match(/const MARKET_STALE_MS[\s\S]*function listingNeedsSystemOffer[\s\S]*?\n\}/);
assert.ok(helpers, 'system-offer helpers missing');
const ctx = {
  collectInfo(id){ return id === 'donut' ? {id:'donut', price:800, name:'โดนัทเคลือบ'} : null; },
};
vm.createContext(ctx);
vm.runInContext(helpers[0], ctx);

assert.ok(collectibles.includes("id:'donut'") && collectibles.includes('price:800'), 'factory donut price must stay 800');
assert.strictEqual(ctx.marketSystemBuyPrice('donut'), ctx.collectInfo('donut').price + 100);

const now = 2 * 24 * 60 * 60 * 1000;
const stale = {id:'donut', price:500000, listedAt:0};
assert.ok(ctx.listingNeedsSystemOffer(stale, now, ''), 'expensive stale listing must be offered');
assert.ok(!ctx.listingNeedsSystemOffer({id:'donut', price:500000, listedAt:now - 1000}, now, ''), 'fresh listing must wait 1 day');
assert.ok(!ctx.listingNeedsSystemOffer({id:'donut', price:50, listedAt:0}, now, ''), 'cheap listing must not farm system buy');
assert.ok(!ctx.listingNeedsSystemOffer({id:'donut', price:500000, listedAt:0, offerAskedAt:now - 1000}, now, ''), 'recently asked must wait');
assert.ok(!ctx.listingNeedsSystemOffer(stale, now, 'sold'), 'sold listing must not be offered');

const buy = stateSrc.match(/function applyMarketSystemBuy\(listing, now\)\{[\s\S]*?\n\}/);
assert.ok(buy, 'applyMarketSystemBuy missing');
const sctx = {
  state: {coins:100, listings:[stale], tradeSold:[]},
  marketSystemBuyPrice: ctx.marketSystemBuyPrice,
};
sctx.addCoins = function(n){ sctx.state.coins += n; };
vm.createContext(sctx);
vm.runInContext(buy[0], sctx);
const paid = sctx.applyMarketSystemBuy(stale, now);
assert.strictEqual(paid, 900);
assert.strictEqual(sctx.state.coins, 1000);
assert.strictEqual(sctx.state.listings.length, 0);
assert.strictEqual(sctx.state.tradeSold[0].buyer, 'ระบบตลาด');
assert.strictEqual(sctx.state.tradeSold[0].price, 900);

assert.ok(ui.includes('maybeOfferStaleMarketBuy'), 'offer tick missing');
assert.ok(ui.includes('img/coins/coin_gold.png'), 'coin image missing in offer dialog');
assert.ok(ui.includes('sfx.coinGet'), 'coin sound missing on accept');
assert.ok(/marketUnlist/.test(ui.match(/function acceptStaleMarketBuy[\s\S]*?\nfunction /)[0]), 'online listings must unlist first');
assert.ok(stateSrc.includes('maybeOfferStaleMarketBuy(now)'), 'marketTick must ask after simulated sales');

console.log('PASS market system buy: factory+100 offer after 1 day, coins credited, no cheap-list farm');
