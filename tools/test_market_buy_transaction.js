'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('js/online.js', 'utf8');
const match = source.match(/function marketBuy\(item\)\{[\s\S]*?\n\}\n\/\* ฝั่งคนขาย:/);
assert.ok(match, 'marketBuy function not found');
const marketBuySource = match[0].replace(/\n\/\* ฝั่งคนขาย:[\s\S]*$/, '');

function makeContext(listing){
  const writes = [];
  const ctx = {
    Online: {
      ready: true,
      db: {
        ref(path){
          if(path.startsWith('market/')){
            return {
              transaction(update){
                const next = update({...listing});
                assert.strictEqual(next, null, 'validated listing must be deleted');
                // Firebase returns the post-transaction snapshot, which is null after deletion.
                return Promise.resolve({committed:true, snapshot:{val:()=>null}});
              },
            };
          }
          return {
            set(value){ writes.push({path, value}); return Promise.resolve(); },
          };
        },
      },
    },
    onlineKey: ()=>'buyer-1',
    onlineDisplayName: ()=>'ผู้ซื้อ',
    firebase: {database:{ServerValue:{TIMESTAMP:{'.sv':'timestamp'}}}},
    Promise,
  };
  vm.createContext(ctx);
  vm.runInContext(marketBuySource, ctx);
  return {ctx, writes};
}

(async()=>{
  const listing = {sid:'seller-1', sn:'ผู้ขาย', id:'product_1', p:1000000};
  const {ctx, writes} = makeContext(listing);
  const out = await ctx.marketBuy({key:'listing-1', ...listing});

  assert.strictEqual(out.ok, true, 'buyer must receive a successful result after deletion');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(out.item)), {
    key:'listing-1', sid:'seller-1', id:'product_1', p:1000000, sn:'ผู้ขาย',
  });
  assert.strictEqual(writes.length, 1, 'seller receipt must be written once');
  assert.strictEqual(writes[0].path, 'msold/seller-1/listing-1');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(writes[0].value)), {
    id:'product_1', p:1000000, bn:'ผู้ซื้อ', ts:{'.sv':'timestamp'},
  });

  console.log('PASS market buy transaction: captured listing survives null snapshot and creates receipt');
})().catch(err=>{ console.error(err); process.exit(1); });
