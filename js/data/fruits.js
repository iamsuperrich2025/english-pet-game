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

/* ── 📊 ราคาตลาดขึ้นลงตามอุปทาน — กันเหรียญเฟ้อ (รอบ 395) ──
   ปัญหาเดิม: ต้นไม้ปลูกไม่จำกัด ขายราคาคงที่ตลอดกาล → เอากำไรทบต้น
   ซื้อต้นเพิ่มได้เรื่อยๆ เหรียญโตทวีคูณไม่มีเพดาน
   กลไกใหม่: ขายผลชนิดไหน อุปทาน (supply) ชนิดนั้น +1 ต่อต้นที่ขาย
   → ราคาจริง = ราคาฐาน × (1 − DROP×supply) ต่ำสุด FLOOR
   supply ลดลงครึ่งหนึ่งทุก HALF_MS (หยุดขายราคาฟื้นเอง)
   ผล: เล่นเบาๆ วันละไม่กี่ต้นราคาแทบไม่ตก · ปลูกเป็นฟาร์มร้อยต้น
   ราคาดิ่งเหลือ 25% คืนทุนช้ามาก ไม่คุ้มทบต้นอีก + เด็กได้เรียนรู้
   อุปสงค์-อุปทานจริงๆ (ขายเยอะ=ล้นตลาด · กระจายชนิด=ราคาดี) */
const FRUIT_MKT_DROP    = 0.10;             // ขาย 1 ต้น ราคาชนิดนั้นตก 10%
const FRUIT_MKT_FLOOR   = 0.25;             // ราคาต่ำสุด 25% ของราคาฐาน
const FRUIT_MKT_HALF_MS = 10*3600*1000;     // supply ลดครึ่งทุก 10 ชม.

/* อุปทานปัจจุบันของผลไม้ชนิดนี้ (ตัวเลขสลายตัวเองตามเวลา) */
function fruitMktSupply(id, now){
  const m = state.fruitMkt && state.fruitMkt[id];
  if(!m || !(m.s > 0)) return 0;
  return m.s * Math.pow(0.5, (now - m.at)/FRUIT_MKT_HALF_MS);
}
/* ตัวคูณราคาตลาดตอนนี้ 0.25–1.0 */
function fruitPriceMult(id, now){
  return Math.max(FRUIT_MKT_FLOOR, 1 - FRUIT_MKT_DROP*fruitMktSupply(id, now));
}
/* ราคาขายจริงตอนนี้ (ปัดเป็นจำนวนเต็ม อย่างน้อย 1) */
function fruitSellNow(id, now){
  const f = fruitInfo(id);
  return f ? Math.max(1, Math.round(f.sell * fruitPriceMult(id, now))) : 0;
}
/* บันทึกการขาย n ต้น → อุปทานพุ่ง ราคาชนิดนี้ตกสำหรับรอบถัดไป */
function fruitMktAdd(id, n, now){
  if(!state.fruitMkt || typeof state.fruitMkt !== 'object') state.fruitMkt = {};
  state.fruitMkt[id] = {s: fruitMktSupply(id, now) + n, at: now};
}
/* ป้ายสถานะตลาดไว้โชว์เด็กเข้าใจง่าย */
function fruitMktLabel(id, now){
  const pct = Math.round(fruitPriceMult(id, now)*100);
  if(pct >= 90) return {pct, emoji:'📈', text:'ราคาดีมาก'};
  if(pct >= 60) return {pct, emoji:'🙂', text:'ราคาปกติ'};
  if(pct >= 35) return {pct, emoji:'📉', text:'เริ่มล้นตลาด'};
  return {pct, emoji:'🫠', text:'ล้นตลาด ราคาถูกมาก'};
}
