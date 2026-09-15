'use strict';

const CAMPAIGN = 'ac_duplicate_purchase_20260915_v1';
const AC_TOTAL = 25000;
const UID_RE = /^[A-Za-z0-9_-]{10,128}$/;

function parseSave(wrapper) {
  if (!wrapper || typeof wrapper.data !== 'string') return null;
  try {
    const state = JSON.parse(wrapper.data);
    return state && typeof state === 'object' && !Array.isArray(state) ? state : null;
  } catch (_) {
    return null;
  }
}

function normalizeEntitlements(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('entitlements_invalid');
  const rows = Object.entries(input);
  if (!rows.length || rows.length > 20) throw new Error('entitlements_invalid');
  const out = {};
  for (const [uid, raw] of rows) {
    const amount = Math.floor(Number(raw && raw.amount));
    const count = Math.floor(Number(raw && raw.count));
    if (!UID_RE.test(uid) || amount < AC_TOTAL || amount > AC_TOTAL * 20 || amount % AC_TOTAL || count !== amount / AC_TOTAL) {
      throw new Error('entitlement_invalid');
    }
    out[uid] = {amount, count, evidence:String(raw.evidence || '').slice(0, 80)};
  }
  return out;
}

function applyAcDuplicateRefund(wrapper, entitlement, now = Date.now()) {
  const state = parseSave(wrapper);
  if (!state) throw new Error('save_invalid');
  const normalized = normalizeEntitlements({temporary_uid:entitlement}).temporary_uid;
  if (!state.acDuplicateRefunds || typeof state.acDuplicateRefunds !== 'object' || Array.isArray(state.acDuplicateRefunds)) {
    state.acDuplicateRefunds = {};
  }
  if (state.acDuplicateRefunds[CAMPAIGN]) return {wrapper, state, changed:false};

  const currentCoins = Number(state.coins);
  state.coins = (Number.isFinite(currentCoins) ? currentCoins : 0) + normalized.amount;
  state.acDuplicateRefunds[CAMPAIGN] = {...normalized, at:now};
  state.acDuplicateRefundNotice = {total:normalized.amount, count:normalized.count};
  return {
    wrapper:{...wrapper, data:JSON.stringify(state), at:Math.max(Number(wrapper.at) || 0, now)},
    state,
    changed:true,
  };
}

module.exports = {CAMPAIGN, AC_TOTAL, parseSave, normalizeEntitlements, applyAcDuplicateRefund};
