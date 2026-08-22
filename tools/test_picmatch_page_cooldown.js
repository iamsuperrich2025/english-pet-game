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
  state:{student:{grade:'ป.1'}},
  PICDICT_WORDS:{
    'Animals.png':{cols:2,rows:5,words:Array.from({length:9},(_,i)=>[`animal${i}`,`สัตว์${i}`])},
    'Birds.png':{cols:2,rows:3,words:Array.from({length:5},(_,i)=>[`bird${i}`,`นก${i}`])},
  },
  document:{readyState:'loading',addEventListener:()=>{},getElementById:()=>null},
};
context.window=context;
vm.runInNewContext(source,context,{filename:'js/picmatch.js'});

const api=context.PicMatch._t;
api.writeCategoryCycles({});
assert.deepStrictEqual(Object.keys(api.readCategoryCycles()),[]);

let result=api.completePage('Animals.png',0,4);
assert.deepStrictEqual({...result},{cycleComplete:false,remaining:2,total:3});
assert.strictEqual(api.pageLock('Animals.png',0,4).locked,true,'ชุดที่เล่นจบรอบแล้วต้องล็อก');
assert.strictEqual(api.pageLock('Animals.png',4,4).locked,false,'ชุดที่ยังไม่เล่นในหมวดเดียวกันต้องเล่นได้');
assert.strictEqual(api.pageLock('Birds.png',0,4).locked,false,'หมวดอื่นต้องไม่ถูกล็อกตาม');

result=api.completePage('Animals.png',4,4);
assert.deepStrictEqual({...result},{cycleComplete:false,remaining:1,total:3});
assert.strictEqual(api.pageLock('Animals.png',0,4).remaining,1);
assert.strictEqual(api.pageLock('Animals.png',4,4).locked,true);
assert.strictEqual(api.pageLock('Animals.png',8,4).locked,false);

result=api.completePage('Animals.png',8,4);
assert.deepStrictEqual({...result},{cycleComplete:true,remaining:0,total:3});
for(const start of [0,4,8]) assert.strictEqual(api.pageLock('Animals.png',start,4).locked,false,'ครบหมวดแล้วต้องปลดล็อกทุกชุด');

api.completePage('Animals.png',0,4);
assert.strictEqual(api.pageLock('Animals.png',0,4).locked,true,'รอบใหม่ต้องวนกติกาเดิมซ้ำได้');
assert.strictEqual(api.pageLock('Animals.png',0,10).locked,false,'การแบ่งชุดคนละระดับชั้นต้องไม่ปะปนกัน');

result=api.completePage('Birds.png',0,10);
assert.deepStrictEqual({...result},{cycleComplete:true,remaining:0,total:1},'หมวดที่มีชุดเดียวต้องปลดล็อกใหม่ทันที');

assert.match(source,/เล่นชุดนี้จบรอบแล้ว[^`]*ถูกล็อกชั่วคราว/);
assert.match(source,/เล่นครบทุกชุดในหมวด[^`]*ปลดล็อกทุกชุด/);
assert.match(source,/id="pm-rule-ok">รับทราบ ✅<\/button>/);
assert.doesNotMatch(source,/setTimeout\(newRound,\s*thunder/,'ห้ามวนเล่นหน้าเดิมอัตโนมัติ');

console.log('PASS picmatch category cycle: completed set locks, category completion unlocks all, loops forever');
