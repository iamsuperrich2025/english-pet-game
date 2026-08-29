'use strict';

const CAMPAIGN = 'cake_gift_price_3000_5000_v1';

const LEGACY_CAKE_PRICES = {
  cake_dino:1500, cake_unicorn:1500, cake_rainbow:1500,
  cake_puppy:1800, cake_kitten:1800,
  cake_rocket:2000, cake_princess:2000, cake_racecar:2000,
  cake_heart:3000, cake_rose:3500, cake_swan:4000,
  cake_redvelvet:3500, cake_berrylove:3500,
  cake_choco:4500, cake_matcha:4500, cake_coffee:4500,
  cake_fruittart:5000, cake_orchid:6000, cake_gold:20000,
  cake_marble:15000, cake_tiered:18000, cake_pearl:22000,
};

const NEW_CAKE_OLD_PRICES = [
  3500,4500,6000,4500,4500,3500,6000,6000,4500,6000,
  6000,4500,4500,6000,6000,6000,4500,4500,6000,4500,
  6000,4500,6000,6000,6000,6000,6000,4500,6000,6000,
  6000,4500,6000,12000,12000,12000,15000,12000,12000,15000,
  12000,15000,15000,3500,4500,3500,3500,4500,4500,3500,
  4500,4500,3500,6000,6000,6000,6000,12000,8000,8000,
  8000,8000,12000,15000,12000,12000,15000,15000,12000,18000,
  12000,15000,15000,4500,4500,6000,6000,6000,6000,6000,
  4500,4500,8000,8000,12000,8000,12000,8000,10000,10000,
  12000,12000,8000,10000,8000,8000,12000,12000,15000,12000,
  12000,12000,12000,
];

NEW_CAKE_OLD_PRICES.forEach((price, index) => {
  LEGACY_CAKE_PRICES[`cake2026_${String(index + 1).padStart(3, '0')}`] = price;
});
Object.freeze(LEGACY_CAKE_PRICES);

function currentCakePrice(oldPrice) {
  return Math.max(3000, Math.min(5000, Number(oldPrice) || 0));
}

const CAKE_PRICE_POLICY = Object.freeze(Object.fromEntries(
  Object.entries(LEGACY_CAKE_PRICES).map(([id, oldPrice]) => [id, Object.freeze({oldPrice, newPrice:currentCakePrice(oldPrice)})])
));

function parseSave(wrapper) {
  if (!wrapper || typeof wrapper.data !== 'string') return null;
  try {
    const state = JSON.parse(wrapper.data);
    return state && typeof state === 'object' && !Array.isArray(state) ? state : null;
  } catch (_) {
    return null;
  }
}

function collectCakeRefundEntitlements(users, gifts) {
  const out = Object.create(null);
  const row = uid => {
    if (!out[uid]) out[uid] = {amount:0, acceptedCount:0, pendingCount:0, escrow:{}};
    return out[uid];
  };

  for (const [toUid, user] of Object.entries(users || {})) {
    const state = parseSave(user && user.save);
    if (!state || !Array.isArray(state.giftBox)) continue;
    state.giftBox.forEach(gift => {
      if (!gift || gift.k !== 'shop' || typeof gift.from !== 'string' || !gift.from) return;
      const policy = CAKE_PRICE_POLICY[gift.id];
      if (!policy || policy.oldPrice <= policy.newPrice) return;
      const target = row(gift.from);
      target.amount += policy.oldPrice - policy.newPrice;
      target.acceptedCount++;
    });
  }

  for (const [toUid, senders] of Object.entries(gifts || {})) {
    for (const [fromUid, giftRows] of Object.entries(senders || {})) {
      for (const [giftKey, gift] of Object.entries(giftRows || {})) {
        if (!gift || gift.k !== 'shop' || gift.st !== 'pending') continue;
        const policy = CAKE_PRICE_POLICY[gift.id];
        if (!policy) continue;
        const target = row(fromUid);
        target.escrow[`${toUid}:${giftKey}`] = Math.min(policy.oldPrice, policy.newPrice);
        if (policy.oldPrice > policy.newPrice) {
          target.amount += policy.oldPrice - policy.newPrice;
          target.pendingCount++;
        }
      }
    }
  }

  return Object.fromEntries(Object.entries(out).filter(([, value]) =>
    value.amount > 0 || Object.keys(value.escrow).length > 0
  ));
}

function applyCakeRefundEntitlement(wrapper, entitlement, now = Date.now()) {
  const state = parseSave(wrapper);
  if (!state) throw new Error('save_invalid');
  const result = {...entitlement, amount:Number(entitlement && entitlement.amount) || 0};
  if (!state.cakePriceRefunds || typeof state.cakePriceRefunds !== 'object' || Array.isArray(state.cakePriceRefunds)) {
    state.cakePriceRefunds = {};
  }
  if (!state.cakeGiftEscrowV1 || typeof state.cakeGiftEscrowV1 !== 'object' || Array.isArray(state.cakeGiftEscrowV1)) {
    state.cakeGiftEscrowV1 = {};
  }

  let changed = false;
  if (!state.cakePriceRefunds[CAMPAIGN]) {
    state.coins = Math.max(0, Number(state.coins) || 0) + result.amount;
    state.cakePriceRefunds[CAMPAIGN] = {
      amount:result.amount,
      acceptedCount:Number(result.acceptedCount) || 0,
      pendingCount:Number(result.pendingCount) || 0,
      at:now,
    };
    if (result.amount > 0) {
      state.cakeGiftRefundNotice = {
        total:result.amount,
        count:(Number(result.acceptedCount) || 0) + (Number(result.pendingCount) || 0),
      };
    }
    changed = true;
  }
  for (const [key, value] of Object.entries(result.escrow || {})) {
    const price = Number(value);
    if (!Number.isFinite(price) || price < 0 || state.cakeGiftEscrowV1[key] === price) continue;
    state.cakeGiftEscrowV1[key] = price;
    changed = true;
  }
  if (!changed) return {wrapper, state, changed:false};
  return {
    wrapper:{...wrapper, data:JSON.stringify(state), at:Math.max(Number(wrapper.at) || 0, now)},
    state,
    changed:true,
  };
}

module.exports = {
  CAMPAIGN, LEGACY_CAKE_PRICES, CAKE_PRICE_POLICY,
  currentCakePrice, parseSave, collectCakeRefundEntitlements, applyCakeRefundEntitlement,
};
