'use strict';
const {execFileSync} = require('child_process');
const fs = require('fs');
const {completedSellerClaims, sellerNeedsPayout, parseWrapper} = require('../functions/market-settlement');

const FB_JS = 'C:\\Users\\rober\\bin\\node\\node_modules\\firebase-tools\\lib\\bin\\firebase.js';
const NODE = process.execPath;
const ledgerPath = process.argv[2] || '';
const ledger = ledgerPath
  ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8').replace(/^\uFEFF/, ''))
  : JSON.parse(execFileSync(NODE, [
    FB_JS, 'database:get', '/marketLedger',
    '--project', 'english-pet-game',
    '--instance', 'english-pet-game-default-rtdb',
  ], {encoding: 'utf8', maxBuffer: 20 * 1024 * 1024}));
const claims = completedSellerClaims(ledger);
const bySeller = new Map();
for (const claim of claims) {
  if (!bySeller.has(claim.sid)) bySeller.set(claim.sid, []);
  bySeller.get(claim.sid).push(claim);
}

function getSave(uid) {
  const out = execFileSync(NODE, [
    FB_JS,
    'database:get', `/users/${uid}/save`,
    '--project', 'english-pet-game',
    '--instance', 'english-pet-game-default-rtdb',
  ], {encoding: 'utf8', maxBuffer: 20 * 1024 * 1024});
  return JSON.parse(out);
}

let unpaid = 0, coins = 0, skipped = 0, errors = 0;
for (const [sid, rows] of bySeller) {
  let state = null;
  try {
    const wrap = getSave(sid);
    state = parseWrapper(wrap);
  } catch (error) {
    errors++;
    console.log('save_error', sid.slice(-6), String(error.message || error).slice(0, 80));
    continue;
  }
  let localUnpaid = 0, localAmt = 0;
  for (const claim of rows) {
    if (sellerNeedsPayout(state, claim)) {
      localUnpaid++;
      localAmt += Number(claim.p) || 0;
    } else skipped++;
  }
  unpaid += localUnpaid;
  coins += localAmt;
  console.log(sid.slice(-6), 'sales', rows.length, 'unpaid', localUnpaid, 'amt', localAmt);
}
console.log('TOTAL sales', claims.length, 'unpaid', unpaid, 'coins', coins, 'paid_ok', skipped, 'errors', errors);
