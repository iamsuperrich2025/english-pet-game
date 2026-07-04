"use strict";
/* ============================================================
   DATA: สวนผลไม้ (upgrade ข้อ 12 — ฝึกเรื่องการทำธุรกิจ)
   ------------------------------------------------------------
   ซื้อต้นไม้ไปปลูกได้ไม่จำกัดจำนวน แต่ละต้นใช้เวลาออกผลต่างกัน
   ครบเวลาแล้วขายผลให้ระบบส่วนกลางได้ — ขายแล้วต้นเดิมเริ่มออกผล
   รอบใหม่ทันที (ต้นไม้ไม่หายไป ลงทุนครั้งเดียวเก็บผลได้เรื่อยๆ)
   ------------------------------------------------------------
   ราคาต้น: ผู้ใช้กำหนดช่วง 3,000–5,000 (ทุเรียนแพงที่สุด)
   ตัวเลขรายต้นด้านล่างเป็นค่าที่เสนอ — ปรับได้ที่ไฟล์นี้ไฟล์เดียว */

const FRUITS = [
  {id:'orange',     emoji:'🍊', name:'ส้ม',      price:3000, growDays:3, sell:300},
  {id:'apple',      emoji:'🍎', name:'แอปเปิล',  price:3500, growDays:4, sell:400},
  {id:'mangosteen', emoji:'🫐', name:'มังคุด',   price:4000, growDays:8, sell:800},
  {id:'durian',     emoji:'🍈', name:'ทุเรียน',  price:5000, growDays:8, sell:1000},
];
const FRUIT_DAY_MS = 24*3600*1000;

function fruitInfo(id){ return FRUITS.find(f=>f.id === id) || null; }
function fruitGrowMs(id){
  const f = fruitInfo(id);
  return f ? f.growDays * FRUIT_DAY_MS : 0;
}
/* เวลาที่เหลือก่อนต้นนี้พร้อมขาย (ms) — 0 = พร้อมขายแล้ว */
function fruitMsLeft(tree, now){
  return Math.max(0, tree.plantedAt + fruitGrowMs(tree.id) - now);
}
