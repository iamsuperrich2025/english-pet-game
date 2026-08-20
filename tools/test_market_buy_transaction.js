'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('js/online.js', 'utf8');
const helpers = source.match(/const marketPurchaseRequests[\s\S]*?function marketResolveMissingListing/);
const buy = source.match(/function marketBuy\(item\)\{[\s\S]*?\n\}\n\/\* ฝั่งคนขาย:/);
assert.ok(helpers && buy, 'secure market client functions not found');
const helperSource = helpers[0].replace(/function marketResolveMissingListing[\s\S]*$/, '');
const buySource = buy[0].replace(/\n\/\* ฝั่งคนขาย:[\s\S]*$/, '');

(async()=>{
  const calls = [];
  let syncCount = 0;
  const ctx = {
    Online: {
      ready:true,
      db:{},
      functions:{
        httpsCallable(name){
          assert.strictEqual(name, 'marketBuySecure');
          return payload=>{
            calls.push(payload);
            if(calls.length === 1) return Promise.resolve({data:{ok:false, reason:'processing', tx:'tx-1'}});
            return Promise.resolve({data:{ok:true, tx:'tx-1', item:{key:'listing-1', sid:'seller-1', id:'product_1', p:1000000, sn:'ผู้ขาย'}}});
          };
        },
      },
    },
    authPushSaveAwait:()=>{ syncCount++; return Promise.resolve(true); },
    window:{crypto:{getRandomValues(bytes){ for(let i=0;i<bytes.length;i++) bytes[i]=i+1; }}},
    state:{marketTx:{}},
    Uint8Array,
    Array,
    Number,
    Object,
    Promise,
    Math,
    Date,
  };
  vm.createContext(ctx);
  vm.runInContext(`${helperSource}\n${buySource}`, ctx);
  const listing = {key:'listing-1', sid:'seller-1', sn:'ผู้ขาย', id:'product_1', p:1000000};
  const first = await ctx.marketBuy(listing);
  const second = await ctx.marketBuy(listing);

  assert.strictEqual(first.reason, 'processing');
  assert.strictEqual(second.ok, true);
  assert.strictEqual(syncCount, 2, 'buyer save must reach cloud before each callable attempt');
  assert.strictEqual(calls.length, 2);
  assert.strictEqual(calls[0].listingKey, 'listing-1');
  assert.strictEqual(calls[0].requestId, calls[1].requestId, 'retry must reuse the same idempotency key');
  assert.ok(!/\.transaction\(/.test(buySource), 'client must not delete market listings directly');
  assert.ok(!/msold\//.test(buySource), 'client must not create seller receipts directly');

  console.log('PASS secure market client: pre-syncs, calls server, and reuses retry id');
})().catch(err=>{ console.error(err); process.exit(1); });
