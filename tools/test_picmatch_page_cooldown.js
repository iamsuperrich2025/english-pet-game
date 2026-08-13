#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','picmatch.js'),'utf8');
const data=new Map();
const localStorage={
  getItem:key=>data.has(key)?data.get(key):null,
  setItem:(key,value)=>data.set(key,String(value)),
};
const context={
  console, localStorage, setTimeout:()=>0, clearInterval:()=>{}, setInterval:()=>0,
  addEventListener:()=>{},
  document:{readyState:'loading',addEventListener:()=>{},getElementById:()=>null},
};
context.window=context;
vm.runInNewContext(source,context,{filename:'js/picmatch.js'});

const api=context.PicMatch._t;
api.writeRecentPages([]);
assert.deepStrictEqual(Array.from(api.readRecentPages()),[]);

api.rememberPage('Animals.png',0);
assert.strictEqual(api.pageLock('Animals.png',0).locked,true);
assert.strictEqual(api.pageLock('Animals.png',0).remaining,10);

for(let i=1;i<=9;i++) api.rememberPage(`Other${i}.png`,0);
assert.strictEqual(api.pageLock('Animals.png',0).locked,true);
assert.strictEqual(api.pageLock('Animals.png',0).remaining,1);

api.rememberPage('Other10.png',0);
assert.strictEqual(api.pageLock('Animals.png',0).locked,false);
assert.strictEqual(api.readRecentPages().length,10);

api.rememberPage('Animals.png',0);
assert.strictEqual(api.pageLock('Animals.png',0).remaining,10);
assert.strictEqual(api.pageLock('Animals.png',4).locked,false,'คนละหน้าในหมวดเดียวกันต้องเล่นได้');

assert.match(source,/showRuleNotice\('เล่นหน้านี้เสร็จแล้ว[^']*10 หน้า/);
assert.match(source,/id="pm-rule-ok">รับทราบ ✅<\/button>/);
assert.doesNotMatch(source,/setTimeout\(newRound,\s*thunder/,'ห้ามวนเล่นหน้าเดิมอัตโนมัติ');

console.log('PASS picmatch page cooldown: lock 10 other pages, rolling unlock, acknowledgement notice');
