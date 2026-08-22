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
  PICDICT_BOOK:[
    {g:'สัตว์โลกน่ารัก',sheets:[['Animals.png'],['Birds.png']]},
    {g:'อาหาร & เครื่องดื่ม',sheets:[['Food.png']]},
  ],
  PICDICT_WORDS:{
    'Animals.png':{cols:2,rows:5,words:Array.from({length:9},(_,i)=>[`animal${i}`,`สัตว์${i}`])},
    'Birds.png':{cols:2,rows:3,words:Array.from({length:5},(_,i)=>[`bird${i}`,`นก${i}`])},
    'Food.png':{cols:2,rows:3,words:Array.from({length:5},(_,i)=>[`food${i}`,`อาหาร${i}`])},
  },
  document:{readyState:'loading',addEventListener:()=>{},getElementById:()=>null},
};
context.window=context;
vm.runInNewContext(source,context,{filename:'js/picmatch.js'});

const api=context.PicMatch._t;
api.writeGroupCycles({});
assert.deepStrictEqual(Object.keys(api.readGroupCycles()),[]);

let result=api.visitPage('Animals.png',0,4);
assert.deepStrictEqual({...result},{cycleComplete:false,remaining:4,total:5,groupName:'สัตว์โลกน่ารัก'});
assert.strictEqual(api.pageLock('Animals.png',0,4).locked,true,'ชุดที่เปิดดูแล้วต้องล็อกทันที');
assert.strictEqual(api.pageLock('Animals.png',4,4).locked,false,'ชุดที่ยังไม่เปิดในหมวดเดียวกันต้องเข้าได้');
assert.strictEqual(api.pageLock('Birds.png',0,4).remaining,0,'หมวดย่อยอื่นในหมวดใหญ่เดียวกันยังต้องเข้าได้');

api.visitPage('Food.png',0,4);
assert.strictEqual(api.pageLock('Food.png',0,4).locked,true,'อีกหมวดใหญ่ต้องมีวงรอบแยกกัน');
assert.strictEqual(api.pageLock('Animals.png',0,4).remaining,4,'การเปิดชุดในหมวดใหญ่อื่นต้องไม่ลดจำนวนคงเหลือ');

for(const [file,start] of [['Animals.png',4],['Animals.png',8],['Birds.png',0]]) api.visitPage(file,start,4);
assert.strictEqual(api.pageLock('Animals.png',0,4).locked,true,'ยังขาดชุดสุดท้ายในหมวดย่อยอื่น ห้ามปลดก่อน');
result=api.visitPage('Birds.png',4,4);
assert.deepStrictEqual({...result},{cycleComplete:true,remaining:0,total:5,groupName:'สัตว์โลกน่ารัก'});
for(const [file,start] of [['Animals.png',0],['Animals.png',4],['Animals.png',8],['Birds.png',0],['Birds.png',4]])
  assert.strictEqual(api.pageLock(file,start,4).locked,false,'ครบหมวดใหญ่แล้วต้องปลดล็อกทุกชุดพร้อมกัน');
assert.strictEqual(api.pageLock('Food.png',0,4).locked,true,'การปลดหมวดสัตว์ต้องไม่ปลดหมวดอาหาร');

api.visitPage('Animals.png',0,4);
assert.strictEqual(api.pageLock('Animals.png',0,4).locked,true,'รอบใหม่ต้องวนกติกาเดิมซ้ำได้');
assert.strictEqual(api.pageLock('Animals.png',0,10).locked,false,'การแบ่งชุดคนละระดับชั้นต้องไม่ปะปนกัน');

result=api.visitPage('Food.png',0,10);
assert.deepStrictEqual({...result},{cycleComplete:true,remaining:0,total:1,groupName:'อาหาร & เครื่องดื่ม'},'หมวดใหญ่ที่มีชุดเดียวต้องปลดล็อกใหม่ทันที');

assert.match(source,/function chooseSheet[\s\S]*?pm\.pageCycle=visitPage\(file,start\);[\s\S]*?newRound\(\)/,'ต้องล็อกทันทีใน chooseSheet ก่อนเริ่มรอบ');
assert.doesNotMatch(source,/if\(pm\.matched === pm\.pairs\.length\)\{[\s\S]{0,160}visitPage/,'ห้ามรอให้เล่นจบรอบจึงค่อยล็อก');
assert.match(source,/ชุดนี้ถูกล็อกตั้งแต่เปิดเข้ามา/);
assert.match(source,/เปิดดูครบทุกชุดในหมวดใหญ่[^`]*ปลดล็อกทุกชุด/);
assert.doesNotMatch(source,/picmatch_category_cycles_v1|categoryCycle/,'ห้ามใช้วงรอบรายหมวดย่อยเดิม');
assert.match(source,/id="pm-rule-ok">รับทราบ ✅<\/button>/);
assert.doesNotMatch(source,/setTimeout\(newRound,\s*thunder/,'ห้ามวนเล่นหน้าเดิมอัตโนมัติ');

console.log('PASS picmatch major-group cycle: entering locks immediately, all subcategories count, groups stay independent');
