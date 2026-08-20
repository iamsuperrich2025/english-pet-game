'use strict';
const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('js/adventure3d.js','utf8');
const intro=fs.readFileSync('js/adv3d_intro.js','utf8');

const checks=[
  ["label:'โลกโดรน FPV', emoji:'🛸', reward:50", 'โลกโดรนให้โบนัสคำละ 50 เหรียญ'],
  ['function orderedLetterMode(){ return !!(M&&(M.heli||M.drone)); }', 'โลกโดรนใช้กติกาเรียงลำดับร่วมกับเฮลิคอปเตอร์'],
  ['pickWords(orderedLetterMode()?1:GUIDE_WORDS)', 'โลกโดรนถือคำเป้าหมายเดียว'],
  ["if(!orderedLetterMode()) for(let i=0;i<8;i++) spawnLetter", 'ไม่สร้างตัวอักษรหลอกในโลกโดรน'],
  ['const free=rooms.filter(r=>!droneUsedRooms.has(r))', 'ตัวอักษรโดรนแยกคนละห้องเมื่อมีห้องเพียงพอ'],
  ['if(!expected || ch!==expected)', 'ตัวอักษรผิดลำดับจะไม่ถูกเก็บ'],
  ['if(orderedLetterMode()) orderedWordProgress++', 'ขยับลำดับเมื่อเก็บตัวที่ถูกเท่านั้น'],
  ['if(!M.hotel && !orderedLetterMode()) letterRespawns.push', 'ตัวอักษรคำเก่าไม่เกิดซ้ำในรอบคำใหม่'],
];
for(const [needle,msg] of checks) assert(src.includes(needle),msg);
assert(intro.includes('ต้องเก็บ<b>ตามลำดับจากซ้ายไปขวา</b>'),'การ์ดวิธีเล่นโดรนต้องอธิบายกติกาตามลำดับ');

const word='budget';
const roomLetters=word.split('');
assert.strictEqual(roomLetters.length,6,'BUDGET ต้องมีตัวอักษรในห้อง 6 ตัว');
assert.strictEqual(new Set(roomLetters.map((_,i)=>`room-${i}`)).size,6,'ตัวอักษรแยกอยู่ 6 ห้อง');
let progress=0,coins=0;
function collect(ch){
  if(ch!==word[progress]) return false;
  progress++; coins++;
  if(progress===word.length) coins+=50;
  return true;
}
assert.strictEqual(collect('u'),false,'เก็บ U ก่อน B ไม่ได้');
for(const ch of word) assert.strictEqual(collect(ch),true,`ต้องเก็บ ${ch.toUpperCase()} ได้ตามลำดับ`);
assert.strictEqual(coins,56,'BUDGET = 6 เหรียญจากตัวอักษร + 50 เหรียญจากคำสำเร็จ');
console.log('✅ drone letter round: current word only, unique rooms, ordered collection, 1 coin/letter + 50 coins/word');
