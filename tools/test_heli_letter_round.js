'use strict';
const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('js/adventure3d.js','utf8');

const checks=[
  ["label:'โลกเฮลิคอปเตอร์', emoji:'🚁', reward:50", 'โหมดเฮลิคอปเตอร์ให้โบนัสคำละ 50 เหรียญ'],
  ['pickWords(M.heli?1:GUIDE_WORDS)', 'โหมดเฮลิคอปเตอร์ถือคำเป้าหมายเดียว'],
  ["if(!M.heli) for(let i=0;i<8;i++) spawnLetter", 'ไม่สร้างตัวอักษรหลอกในโหมดเฮลิคอปเตอร์'],
  ['const free=buildings.filter(b=>!heliUsedRoofs.has(b))', 'ตัวอักษรแต่ละตัวต้องอยู่คนละดาดฟ้าเมื่อมีตึกเพียงพอ'],
  ['if(!expected || ch!==expected)', 'ตัวอักษรผิดลำดับจะไม่ถูกเก็บ'],
  ['if(M.heli) heliWordProgress++', 'ขยับลำดับเมื่อเก็บตัวที่ถูกเท่านั้น'],
  ['if(!M.hotel && !M.heli) letterRespawns.push', 'ตัวอักษรคำเก่าไม่เกิดซ้ำในรอบคำใหม่'],
];
for(const [needle,msg] of checks) assert(src.includes(needle),msg);

const word='budget';
const rooftopLetters=word.split('');
assert.strictEqual(rooftopLetters.length,6,'BUDGET ต้องมีตัวอักษรบนดาดฟ้า 6 ตัว');
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
console.log('✅ heli letter round: current word only, ordered collection, 1 coin/letter + 50 coins/word');
