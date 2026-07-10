"use strict";
/* ============================================================
   DATA: ระบบแรงค์สไตล์เกมยิงแนว Delta Force
   7 แรงค์ · แต่ละแรงค์มี 3 ขั้นย่อยนับถอยหลัง III → II → I
   (I คือขั้นสูงสุดของแรงค์ ตามธรรมเนียมเกมแนวนี้)
   แรงค์สูงสุด "Apex Wordmaster" ไม่มีขั้นย่อย
   ------------------------------------------------------------
   ⭐ เกณฑ์ (upgrade): แรงค์ยึดจาก "มูลค่าทรัพย์สินสุทธิ (net worth)"
   = เหรียญคงเหลือ + มูลค่าทรัพย์สินที่ถือครอง (netWorth() ใน state.js)
   ทรัพย์สินทุกชิ้นคิดราคาเต็มที่ซื้อ → ซื้อทรัพย์สินแรงค์ไม่ตก (เงินแปลงเป็นของมูลค่าเท่ากัน) · ใช้จ่ายกิน/บิลถึงลด
   เกณฑ์ปรับให้ยากขึ้นเท่าตัวจากเดิม (เพราะ net worth สูงกว่าเหรียญล้วน)
   RP ยังเก็บสะสมเป็น "แต้มความพยายาม" โชว์ในหน้าสถิติ
   ------------------------------------------------------------
   ภาพเหรียญตรา: วางไฟล์ img/rank/rank_<id>.png (เช่น rank_gold.png)
   เกมตรวจเจอเอง ไม่มีภาพจะใช้อีโมจิแทน                          */

const RANKS = [
  {id:'bronze',   name:'Novice Lexicon',    en:'NOVICE LEXICON',    emoji:'🥉', color:'#b07a4a', min:0},          // 0 – 9,999
  {id:'silver',   name:'Fluent Tracker',    en:'FLUENT TRACKER',    emoji:'🥈', color:'#9aa5b5', min:10000},      // 10,000 – 199,999
  {id:'gold',     name:'Silver Scholar',    en:'SILVER SCHOLAR',    emoji:'🥇', color:'#e0a92e', min:200000},     // 200,000 – 999,999
  {id:'platinum', name:'Golden Explorer',   en:'GOLDEN EXPLORER',   emoji:'💠', color:'#5bc0de', min:1000000},    // 1,000,000 – 1,999,999
  {id:'diamond',  name:'Platinum Linguist', en:'PLATINUM LINGUIST', emoji:'💎', color:'#7d5fc0', min:2000000},    // 2,000,000 – 3,999,999
  {id:'master',   name:'Emerald Archivist', en:'EMERALD ARCHIVIST', emoji:'🔱', color:'#e05b3a', min:4000000},    // 4,000,000 – 19,999,999
  {id:'marshal',  name:'Apex Wordmaster',   en:'APEX WORDMASTER',   emoji:'⭐', color:'#d4386f', min:20000000},   // ≥ 20,000,000
];
const RANK_TIERS = ['III','II','I'];   // นับถอยหลัง: III ต่ำสุด → I สูงสุด

/* คืนข้อมูลแรงค์จากมูลค่าทรัพย์สินสุทธิ (net worth):
   {idx, rank, next, tier, tierIdx, prog(0-1 ไปแรงค์ถัดไป), key(ไว้เทียบเลื่อนขั้น), label} */
function rankInfo(worth){
  let idx = 0;
  for(let i=0;i<RANKS.length;i++){ if(worth >= RANKS[i].min) idx = i; }
  const rank = RANKS[idx], next = RANKS[idx+1] || null;
  if(!next){    // แรงค์สูงสุด ไม่มีขั้นย่อย
    return {idx, rank, next:null, tier:'', tierIdx:0, prog:1, key:idx*10, label:rank.name};
  }
  const span = (next.min - rank.min)/3;
  const tierIdx = Math.min(2, Math.floor((worth - rank.min)/span));
  const tier = RANK_TIERS[tierIdx];
  return {
    idx, rank, next, tier, tierIdx,
    prog:(worth - rank.min)/(next.min - rank.min),
    key: idx*10 + tierIdx,
    label:`${rank.name} ${tier}`,
  };
}

/* สร้าง rankInfo แบบย่อจาก key ที่เก็บไว้ (ใช้ตอนเทียบ before ใน refreshRank) */
function rankFromKey(key){
  const idx = Math.floor(key/10), tierIdx = key % 10;
  const rank = RANKS[idx];
  const tier = RANKS[idx+1] ? RANK_TIERS[tierIdx] : '';
  return {idx, rank, tier, key, label: tier ? `${rank.name} ${tier}` : rank.name};
}
