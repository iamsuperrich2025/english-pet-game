'use strict';

const assert = require('node:assert/strict');
const {CAMPAIGN, normalizeEntitlements, applyAcDuplicateRefund} = require('./ac-duplicate-refund');

const uid = 'player_uid_123';
const rows = normalizeEntitlements({
  [uid]:{amount:50000, count:2, evidence:'snapshot_delta_3_to_1'},
});
assert.deepEqual(rows[uid], {amount:50000, count:2, evidence:'snapshot_delta_3_to_1'});
assert.throws(()=>normalizeEntitlements({[uid]:{amount:50000, count:1}}), /entitlement_invalid/);
assert.throws(()=>normalizeEntitlements({[uid]:{amount:26000, count:1}}), /entitlement_invalid/);

const wrapper = {data:JSON.stringify({coins:-18266}), at:10};
const first = applyAcDuplicateRefund(wrapper, rows[uid], 1000);
assert.equal(first.changed, true);
assert.equal(first.state.coins, 31734, 'negative balance must receive the exact refund, not be clamped before credit');
assert.deepEqual(first.state.acDuplicateRefundNotice, {total:50000, count:2});
assert.equal(first.state.acDuplicateRefunds[CAMPAIGN].amount, 50000);

const twice = applyAcDuplicateRefund(first.wrapper, rows[uid], 2000);
assert.equal(twice.changed, false);
assert.equal(twice.state.coins, 31734, 'campaign marker must prevent a duplicate refund');
console.log('PASS AC duplicate refund: validated entitlements, exact negative-balance credit, idempotent campaign marker');
