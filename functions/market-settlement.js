'use strict';

const MAX_MARKERS = 120;

class MarketStateError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function parseWrapper(wrapper) {
  if (!wrapper || typeof wrapper.data !== 'string') throw new MarketStateError('save_missing');
  let state;
  try { state = JSON.parse(wrapper.data); } catch (_) { throw new MarketStateError('save_invalid'); }
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw new MarketStateError('save_invalid');
  if (!Array.isArray(state.collection)) state.collection = [];
  if (!Array.isArray(state.listings)) state.listings = [];
  if (!Array.isArray(state.tradeSold)) state.tradeSold = [];
  if (!state.marketTx || typeof state.marketTx !== 'object' || Array.isArray(state.marketTx)) state.marketTx = {};
  state.coins = Number(state.coins);
  if (!Number.isFinite(state.coins) || state.coins < 0) throw new MarketStateError('coins_invalid');
  return state;
}

function thaiDay(timestamp) {
  return new Date(timestamp + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function pruneMarkers(markers) {
  const entries = Object.entries(markers || {});
  if (entries.length <= MAX_MARKERS) return markers;
  entries.sort((a, b) => Number(b[1] && b[1].at || 0) - Number(a[1] && a[1].at || 0));
  return Object.fromEntries(entries.slice(0, MAX_MARKERS));
}

function finishWrapper(state, timestamp) {
  state.marketTx = pruneMarkers(state.marketTx);
  state.savedAt = timestamp;
  return {data: JSON.stringify(state), at: timestamp};
}

function applyBuyer(wrapper, claim, timestamp) {
  const state = parseWrapper(wrapper);
  const marker = state.marketTx[claim.tx];
  if (marker && marker.r === 'buyer') return {wrapper, state, changed: false};
  if (marker && marker.r === 'buyer_refunded') throw new MarketStateError('buyer_refunded');
  if (state.coins < claim.p) throw new MarketStateError('not_enough_coins');
  state.coins -= claim.p;
  state.collection.push(claim.id);
  if (Array.isArray(state.wishlist)) {
    const index = state.wishlist.indexOf(claim.id);
    if (index >= 0) state.wishlist.splice(index, 1);
  }
  state.marketTx[claim.tx] = {r: 'buyer', at: timestamp, id: claim.id, p: claim.p, key: claim.key};
  return {wrapper: finishWrapper(state, timestamp), state, changed: true};
}

function applySeller(wrapper, claim, timestamp) {
  const state = parseWrapper(wrapper);
  const marker = state.marketTx[claim.tx];
  if (marker && marker.r === 'seller') return {wrapper, state, changed: false};
  const index = state.listings.findIndex(listing => listing &&
    String(listing.netKey || '') === claim.key &&
    String(listing.id || '') === claim.id &&
    Number(listing.price) === claim.p);
  if (index < 0) throw new MarketStateError('seller_not_ready');
  state.listings.splice(index, 1);
  state.coins += claim.p;
  const today = thaiDay(timestamp);
  if (!state.daily || state.daily.date !== today) state.daily = {date: today, coins: 0};
  state.daily.coins = Number(state.daily.coins) || 0;
  state.daily.coins += claim.p;
  state.lifetimeCoins = (Number(state.lifetimeCoins) || 0) + claim.p;
  state.tradeSold.push({id: claim.id, price: claim.p, ts: timestamp, buyer: claim.bn, tx: claim.tx});
  if (state.tradeSold.length > 20) state.tradeSold = state.tradeSold.slice(-20);
  state.marketTx[claim.tx] = {r: 'seller', at: timestamp, id: claim.id, p: claim.p, key: claim.key};
  return {wrapper: finishWrapper(state, timestamp), state, changed: true};
}

function refundBuyer(wrapper, claim, timestamp) {
  const state = parseWrapper(wrapper);
  const marker = state.marketTx[claim.tx];
  if (marker && marker.r === 'buyer_refunded') return {wrapper, state, changed: false};
  if (!marker || marker.r !== 'buyer') return {wrapper, state, changed: false};
  state.coins += claim.p;
  const index = state.collection.lastIndexOf(claim.id);
  if (index >= 0) state.collection.splice(index, 1);
  state.marketTx[claim.tx] = {r: 'buyer_refunded', at: timestamp, id: claim.id, p: claim.p, key: claim.key};
  return {wrapper: finishWrapper(state, timestamp), state, changed: true};
}

module.exports = {MarketStateError, applyBuyer, applySeller, refundBuyer, parseWrapper, thaiDay};
