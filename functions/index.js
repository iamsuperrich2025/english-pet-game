'use strict';

const crypto = require('crypto');
const {initializeApp} = require('firebase-admin/app');
const {getDatabase} = require('firebase-admin/database');
const {logger} = require('firebase-functions');
const {setGlobalOptions} = require('firebase-functions/v2');
const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {onValueUpdated} = require('firebase-functions/v2/database');
const {MarketStateError, applyBuyer, applySeller, refundBuyer} = require('./market-settlement');

const REGION = 'asia-southeast1';
const DB_INSTANCE = 'english-pet-game-default-rtdb';
const DB_URL = 'https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app';
const KEY_RE = /^[A-Za-z0-9_-]{10,80}$/;
const REQUEST_RE = /^[A-Za-z0-9_-]{16,80}$/;
const LEASE_MS = 75000; // ยาวกว่า timeout 60 วิ: invocation เก่าต้องจบก่อนตัวกู้รายการรับช่วง
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

initializeApp({databaseURL: DB_URL});
setGlobalOptions({region: REGION, maxInstances: 10, memory: '256MiB', timeoutSeconds: 60});

function publicResult(ledger) {
  return {
    ok: ledger.status === 'completed',
    reason: ledger.reason || null,
    tx: ledger.tx,
    item: ledger.status === 'completed' ? {
      key: ledger.key,
      sid: ledger.sid,
      id: ledger.id,
      p: ledger.p,
      sn: ledger.sn || 'เพื่อน',
    } : null,
  };
}

function cleanListing(value) {
  const listing = value || {};
  const sid = String(listing.sid || '');
  const id = String(listing.id || '');
  const p = Number(listing.p);
  if (!sid || !id || !Number.isFinite(p) || p < 1 || p > 1000000) return null;
  return {sid, id, p, sn: String(listing.sn || 'เพื่อน').slice(0, 40)};
}

async function transactSave(uid, transform) {
  let stateError = null;
  const ref = getDatabase().ref(`users/${uid}/save`);
  const result = await ref.transaction(current => {
    try {
      const out = transform(current);
      stateError = null;
      return out.wrapper;
    } catch (error) {
      stateError = error instanceof MarketStateError ? error.code : 'save_invalid';
      return;
    }
  }, undefined, false);
  if (!result.committed) throw new MarketStateError(stateError || 'save_conflict');
  return JSON.parse(result.snapshot.val().data);
}

async function releaseListing(claim) {
  await getDatabase().ref(`market/${claim.key}`).transaction(current => {
    if (!current || current.tx !== claim.tx || current.st !== 'processing') return;
    const restored = {...current};
    delete restored.st; delete restored.tx; delete restored.bid;
    delete restored.bn; delete restored.startedAt;
    return restored;
  }, undefined, false);
}

async function failAndCompensate(claim, reason) {
  try {
    await transactSave(claim.bid, current => refundBuyer(current, claim, Date.now()));
  } catch (error) {
    logger.error('market buyer refund needs retry', {tx: claim.tx, reason, code: error.code || error.message});
    throw error;
  }
  await releaseListing(claim);
  await getDatabase().ref(`marketLedger/${claim.tx}`).update({
    status: 'failed', reason, failedAt: Date.now(), leaseBy: null, leaseUntil: null,
  });
  return {ok: false, reason, tx: claim.tx};
}

async function acquireSettlementLease(ledgerRef, leaseBy) {
  const now = Date.now();
  let acquired = false;
  const result = await ledgerRef.transaction(current => {
    if (!current || current.status === 'completed' || current.status === 'failed') return;
    if (Number(current.leaseUntil) > now && current.leaseBy !== leaseBy) return;
    acquired = true;
    return {...current, leaseBy, leaseUntil: now + LEASE_MS, lastAttemptAt: now};
  }, undefined, false);
  return {acquired: result.committed && acquired, ledger: result.snapshot.val()};
}

async function waitForSettlement(ledgerRef) {
  for (let attempt = 0; attempt < 16; attempt++) {
    const ledger = (await ledgerRef.get()).val();
    if (ledger && (ledger.status === 'completed' || ledger.status === 'failed')) return publicResult(ledger);
    await wait(500);
  }
  return null;
}

async function settleClaim(claim) {
  const db = getDatabase();
  const ledgerRef = db.ref(`marketLedger/${claim.tx}`);
  const existing = (await ledgerRef.get()).val();
  if (existing && existing.status === 'completed') return publicResult(existing);
  if (existing && existing.status === 'failed') return publicResult(existing);

  const leaseBy = crypto.randomBytes(12).toString('hex');
  const lease = await acquireSettlementLease(ledgerRef, leaseBy);
  if (!lease.acquired) {
    const settled = await waitForSettlement(ledgerRef);
    return settled || {ok: false, reason: 'processing', tx: claim.tx};
  }

  let buyerState;
  try {
    buyerState = await transactSave(claim.bid, current => applyBuyer(current, claim, Date.now()));
  } catch (error) {
    const reason = error.code === 'not_enough_coins' ? 'not_enough_coins' : 'buyer_save_error';
    await releaseListing(claim);
    await ledgerRef.update({
      status: 'failed', reason, failedAt: Date.now(), leaseBy: null, leaseUntil: null,
    });
    return {ok: false, reason, tx: claim.tx};
  }
  await ledgerRef.update({status: 'buyer_applied', buyerAppliedAt: Date.now()});

  let sellerState = null;
  let sellerError = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      sellerState = await transactSave(claim.sid, current => applySeller(current, claim, Date.now()));
      sellerError = null;
      break;
    } catch (error) {
      sellerError = error;
      if (error.code !== 'seller_not_ready') break;
      await wait(750);
    }
  }
  if (!sellerState) {
    const reason = sellerError && sellerError.code === 'seller_not_ready' ? 'seller_not_ready' : 'seller_save_error';
    return failAndCompensate(claim, reason);
  }

  const completedAt = Date.now();
  const updates = {};
  updates[`market/${claim.key}`] = null;
  updates[`msold/${claim.sid}/${claim.key}`] = {
    id: claim.id, p: claim.p, bn: claim.bn, ts: completedAt,
    tx: claim.tx, settled: true,
  };
  updates[`marketLedger/${claim.tx}/status`] = 'completed';
  updates[`marketLedger/${claim.tx}/completedAt`] = completedAt;
  updates[`marketLedger/${claim.tx}/buyerCoinsAfter`] = buyerState.coins;
  updates[`marketLedger/${claim.tx}/sellerCoinsAfter`] = sellerState.coins;
  updates[`marketLedger/${claim.tx}/leaseBy`] = null;
  updates[`marketLedger/${claim.tx}/leaseUntil`] = null;
  await db.ref().update(updates);
  return publicResult({...claim, status: 'completed'});
}

async function beginPurchase(uid, listingKey, requestId) {
  const db = getDatabase();
  const tx = crypto.createHash('sha256').update(`${uid}|${requestId}`).digest('hex').slice(0, 40);
  const ledgerRef = db.ref(`marketLedger/${tx}`);
  const oldLedger = (await ledgerRef.get()).val();
  if (oldLedger) {
    if (oldLedger.bid !== uid || oldLedger.key !== listingKey) throw new HttpsError('permission-denied', 'Transaction ownership mismatch');
    if (oldLedger.status === 'completed' || oldLedger.status === 'failed') return publicResult(oldLedger);
  } else {
    await ledgerRef.set({tx, bid: uid, key: listingKey, status: 'attempting', createdAt: Date.now()});
  }

  const profile = (await db.ref(`users/${uid}/profile/name`).get()).val();
  const buyerName = typeof profile === 'string' && profile.trim() ? profile.trim().slice(0, 40) : 'เพื่อน';
  let reason = 'sold_out';
  const marketRef = db.ref(`market/${listingKey}`);
  const result = await marketRef.transaction(current => {
    if (!current || typeof current !== 'object') { reason = 'sold_out'; return; }
    if (current.st === 'processing') {
      if (current.tx === tx && current.bid === uid) { reason = ''; return current; }
      reason = 'sold_out'; return;
    }
    const listing = cleanListing(current);
    if (!listing) { reason = 'invalid'; return; }
    if (listing.sid === uid) { reason = 'own_item'; return; }
    reason = '';
    return {...current, st: 'processing', tx, bid: uid, bn: buyerName, startedAt: Date.now()};
  }, undefined, false);
  if (!result.committed) {
    await ledgerRef.update({status: 'failed', reason, failedAt: Date.now()});
    return {ok: false, reason, tx};
  }
  const current = result.snapshot.val();
  const listing = cleanListing(current);
  if (!listing) return failAndCompensate({tx, key: listingKey, bid: uid}, 'invalid');
  const claim = {tx, key: listingKey, bid: uid, bn: buyerName, ...listing};
  await ledgerRef.update({...claim, status: 'claimed', claimedAt: Date.now()});
  return settleClaim(claim);
}

exports.marketBuySecure = onCall({enforceAppCheck: false}, async request => {
  if (!request.auth || !request.auth.uid) throw new HttpsError('unauthenticated', 'Please sign in');
  const listingKey = String(request.data && request.data.listingKey || '');
  const requestId = String(request.data && request.data.requestId || '');
  if (!KEY_RE.test(listingKey) || !REQUEST_RE.test(requestId)) throw new HttpsError('invalid-argument', 'Invalid purchase request');
  try {
    return await beginPurchase(request.auth.uid, listingKey, requestId);
  } catch (error) {
    logger.error('marketBuySecure failed', {listingKey, code: error.code || error.message});
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Purchase could not be completed safely');
  }
});

exports.resumeMarketSettlement = onValueUpdated({
  ref: '/market/{listingKey}',
  instance: DB_INSTANCE,
  retry: true,
  maxInstances: 5,
}, async event => {
  const value = event.data.after.val();
  if (!value || value.st !== 'processing' || !value.tx || !value.bid) return;
  const listing = cleanListing(value);
  if (!listing) return;
  const claim = {
    tx: String(value.tx), key: event.params.listingKey,
    bid: String(value.bid), bn: String(value.bn || 'เพื่อน').slice(0, 40), ...listing,
  };
  const result = await settleClaim(claim);
  if (!result.ok && result.reason === 'processing') {
    throw new Error('settlement_lease_busy');
  }
  if (!result.ok && result.reason !== 'not_enough_coins' && result.reason !== 'seller_not_ready') {
    throw new Error(result.reason || 'settlement_failed');
  }
});

exports._test = {cleanListing, beginPurchase, settleClaim};
