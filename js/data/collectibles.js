"use strict";
/* ============================================================
   DATA: สินค้าสะสมฟุ่มเฟือย (Collectibles) + ตลาดซื้อขายต่อ
   ------------------------------------------------------------
   ของเล่นสุดหรูที่เด็กประถมชอบ ซื้อสะสม → เปิดภาพใหญ่ตอนได้มา →
   ตั้งราคาขายต่อเองได้แบบ Global Trade HQ (SimCity BuildIt)
   ภาพ: img/collectibles/collect_<id>.png (prompt ใน PROMPTS_COLLECTIBLES.md)
   ไม่มีภาพ → ใช้อีโมจิแทนอัตโนมัติ
   ============================================================ */

/* ระดับความหายาก (คุมสีกรอบ/ประกายในฉากเปิดภาพใหญ่) */
const COLLECT_TIERS = {
  rare:      {name:'หายาก',  label:'Rare',      stars:'⭐',    color:'#5bc0de'},
  epic:      {name:'เอพิก',  label:'Epic',      stars:'⭐⭐',   color:'#a98bec'},
  legendary: {name:'ตำนาน',  label:'Legendary', stars:'⭐⭐⭐',  color:'#f5a623'},
  mythic:    {name:'เทพ',    label:'Mythic',    stars:'👑',    color:'#d4386f'},
};

/* ราคา = "ราคาปกติ/ราคาฐาน" ใช้เป็นจุดอ้างอิงของตลาด (ตั้งขายถูก/แพงเทียบตัวนี้)
   นับเป็นทรัพย์สินใน net worth ด้วยราคาฐานนี้ (assetValue ใน state.js) */
const COLLECTIBLES = [
  {id:'teddy',        emoji:'🧸', name:'ตุ๊กตาหมี',           tier:'rare',      price:20000},
  {id:'unicorn',      emoji:'🦄', name:'ยูนิคอร์นตุ๊กตา',      tier:'rare',      price:30000},
  {id:'dollhouse',    emoji:'🏠', name:'บ้านตุ๊กตา',          tier:'rare',      price:60000},
  {id:'rccar',        emoji:'🚗', name:'รถบังคับ',            tier:'epic',      price:80000},
  {id:'rcboat',       emoji:'🚤', name:'เรือบังคับ',          tier:'epic',      price:100000},
  {id:'robot',        emoji:'🤖', name:'หุ่นยนต์ของเล่น',      tier:'epic',      price:150000},
  {id:'rcplane',      emoji:'✈️', name:'เครื่องบินบังคับ',     tier:'epic',      price:250000},
  {id:'rchelicopter', emoji:'🚁', name:'เฮลิคอปเตอร์บังคับ',   tier:'legendary', price:350000},
  {id:'drone',        emoji:'🛸', name:'โดรนถ่ายภาพ',         tier:'legendary', price:400000},
  {id:'dinorobot',    emoji:'🦖', name:'หุ่นยนต์ไดโนเสาร์',    tier:'legendary', price:500000},
  {id:'telescope',    emoji:'🔭', name:'กล้องดูดาวทองเหลือง',  tier:'legendary', price:800000},
  {id:'goldcar',      emoji:'🏎️', name:'รถสปอร์ตทองคำ',       tier:'mythic',    price:2000000},
];

function collectInfo(id){ return COLLECTIBLES.find(c=>c.id === id) || null; }
function collectTier(id){ const c = collectInfo(id); return c ? COLLECT_TIERS[c.tier] : null; }

/* ---------- ตลาดขายต่อ: ตั้งราคาถูก = ขายไว, ตั้งแพงเกิน = ไม่มีคนซื้อ ----------
   ratio = ราคาที่ตั้งขาย / ราคาฐาน — คืน "เวลาโดยประมาณกว่าจะมีลูกค้ามาซื้อ" */
function listingSellMs(ratio){
  if(ratio <= 0.6)  return 20*60*1000;      // ถูกมาก ~20 นาที
  if(ratio <= 0.85) return 60*60*1000;      // ต่ำกว่าตลาด ~1 ชม.
  if(ratio <= 1.1)  return 3*60*60*1000;    // ราคาตลาดพอดี ~3 ชม.
  if(ratio <= 1.35) return 8*60*60*1000;    // สูงกว่าตลาด ~8 ชม.
  if(ratio <= 1.6)  return 24*60*60*1000;   // แพง ~1 วัน
  return Infinity;                          // แพงเกินไป ไม่มีคนซื้อ
}
/* ข้อความบอกสถานะราคาที่ตั้ง (โชว์ในกล่องตั้งราคา + รายการที่ลงขาย) */
function listingStatus(ratio){
  if(ratio <= 0.6)  return {t:'🔥 ตั้งถูกมาก ลูกค้าแย่งกันซื้อ ขายไวสุดๆ', c:'#2e7d43'};
  if(ratio <= 0.85) return {t:'⚡ ต่ำกว่าราคาตลาด ขายได้ไว',            c:'#2e7d43'};
  if(ratio <= 1.1)  return {t:'👍 ราคาตลาดพอดี ขายได้เรื่อยๆ',          c:'#8a6d1a'};
  if(ratio <= 1.35) return {t:'🐢 สูงกว่าตลาด ต้องรอลูกค้านานหน่อย',     c:'#c07a1a'};
  if(ratio <= 1.6)  return {t:'😴 แพง กว่าจะมีคนซื้อนานมาก',            c:'#c0392b'};
  return {t:'🚫 แพงเกินไป อาจไม่มีใครซื้อเลยนะ',                        c:'#c0392b'};
}
