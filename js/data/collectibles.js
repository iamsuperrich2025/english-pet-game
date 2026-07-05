"use strict";
/* ============================================================
   DATA: สินค้าผลิต (Products) + ตลาดขายต่อ
   ------------------------------------------------------------
   แนวคิดใหม่ (5 ก.ค. 2026): ผู้เล่น "ผลิต" สินค้าเองในโรงงาน
   โดยจ่ายด้วยแต้มคำศัพท์ (ตอบถูก 1 คำ = 1 แต้มผลิต) ผลิตครบ
   ได้ของเข้าคลัง → ตั้งราคาขายต่อในตลาด / ส่งมอบออเดอร์พิเศษ
   ภาพ: img/collectibles/collect_<id>.png
   (prompt: PROMPTS_COLLECTIBLES.md ชุดแรก 12 + PROMPTS_PRODUCTS.md อีก 38)
   ไม่มีภาพ → ใช้อีโมจิแทนอัตโนมัติ
   ============================================================ */

/* ระดับความหายาก (คุมสีกรอบ/ประกายในฉากเปิดภาพใหญ่) */
const COLLECT_TIERS = {
  common:    {name:'ทั่วไป',  label:'Common',    stars:'🔹',   color:'#7d97a5'},
  rare:      {name:'หายาก',  label:'Rare',      stars:'⭐',    color:'#5bc0de'},
  epic:      {name:'เอพิก',  label:'Epic',      stars:'⭐⭐',   color:'#a98bec'},
  legendary: {name:'ตำนาน',  label:'Legendary', stars:'⭐⭐⭐',  color:'#f5a623'},
  mythic:    {name:'เทพ',    label:'Mythic',    stars:'👑',    color:'#d4386f'},
};

/* หมวดสินค้า (dropdown กรองแคตตาล็อกในโรงงาน) */
const COLLECT_CATS = [
  {id:'food',    name:'อาหาร/เบเกอรี่',   emoji:'🍰'},
  {id:'toy',     name:'ของเล่น',          emoji:'🧸'},
  {id:'fashion', name:'แฟชั่น',           emoji:'👗'},
  {id:'gadget',  name:'แก็ดเจ็ต',         emoji:'📱'},
  {id:'vehicle', name:'ยานพาหนะ/ของหรู', emoji:'🚀'},
];

/* price = ราคาฐาน (จุดอ้างอิงตลาด + มูลค่าทรัพย์สินใน net worth)
   words = แต้มคำศัพท์ที่ใช้ผลิต (ตอบถูก 1 คำ = 1 แต้ม)
   อัตราโดยประมาณ: common ~25 เหรียญ/คำ · rare ~50 · epic ~80 · legendary ~130 · mythic ~300
   → สินค้าระดับสูงคุ้มแรงกว่า แต่ต้องขยันสะสมคำนานกว่า */
const COLLECTIBLES = [
  /* ---- 🍰 อาหาร/เบเกอรี่ ---- */
  {id:'cupcake',      emoji:'🧁', name:'คัพเค้กสตรอว์เบอร์รี', cat:'food',    tier:'common',    price:500,     words:20},
  {id:'donut',        emoji:'🍩', name:'โดนัทเคลือบ',          cat:'food',    tier:'common',    price:800,     words:30},
  {id:'cookiejar',    emoji:'🍪', name:'โหลคุกกี้',            cat:'food',    tier:'common',    price:1200,    words:45},
  {id:'icecream',     emoji:'🍨', name:'ไอศกรีมซันเดย์',       cat:'food',    tier:'common',    price:1500,    words:55},
  {id:'boba',         emoji:'🧋', name:'ชานมไข่มุก',           cat:'food',    tier:'common',    price:2000,    words:70},
  {id:'macaron',      emoji:'🍬', name:'ชุดมาการองสายรุ้ง',    cat:'food',    tier:'rare',      price:5000,    words:100},
  {id:'chocbox',      emoji:'🍫', name:'กล่องช็อกโกแลตหรู',    cat:'food',    tier:'rare',      price:8000,    words:160},
  {id:'fruitcake',    emoji:'🍰', name:'เค้กผลไม้สด',          cat:'food',    tier:'rare',      price:12000,   words:240},
  {id:'rainbowcake',  emoji:'🌈', name:'เค้กสายรุ้ง',          cat:'food',    tier:'rare',      price:18000,   words:360},
  {id:'weddingcake',  emoji:'🎂', name:'เค้กฉลอง 5 ชั้น',      cat:'food',    tier:'epic',      price:40000,   words:500},
  /* ---- 🧸 ของเล่น ---- */
  {id:'kite',         emoji:'🪁', name:'ว่าวมังกร',            cat:'toy',     tier:'common',    price:1000,    words:40},
  {id:'teaset',       emoji:'🫖', name:'ชุดน้ำชากระเบื้อง',    cat:'toy',     tier:'common',    price:2500,    words:85},
  {id:'toytrain',     emoji:'🚂', name:'รถไฟของเล่น',          cat:'toy',     tier:'common',    price:3000,    words:100},
  {id:'blocks',       emoji:'🏰', name:'ปราสาทตัวต่อ',         cat:'toy',     tier:'rare',      price:10000,   words:200},
  {id:'boardgame',    emoji:'🎲', name:'บอร์ดเกมผจญภัย',       cat:'toy',     tier:'rare',      price:15000,   words:300},
  {id:'teddy',        emoji:'🧸', name:'ตุ๊กตาหมี',            cat:'toy',     tier:'rare',      price:20000,   words:400},
  {id:'unicorn',      emoji:'🦄', name:'ยูนิคอร์นตุ๊กตา',      cat:'toy',     tier:'rare',      price:30000,   words:600},
  {id:'dollhouse',    emoji:'🏠', name:'บ้านตุ๊กตา',           cat:'toy',     tier:'rare',      price:60000,   words:1200},
  {id:'robot',        emoji:'🤖', name:'หุ่นยนต์ของเล่น',      cat:'toy',     tier:'epic',      price:150000,  words:1900},
  {id:'dinorobot',    emoji:'🦖', name:'หุ่นยนต์ไดโนเสาร์',    cat:'toy',     tier:'legendary', price:500000,  words:3800},
  /* ---- 👗 แฟชั่น ---- */
  {id:'cap',          emoji:'🧢', name:'หมวกแก๊ปดาวทอง',       cat:'fashion', tier:'common',    price:800,     words:30},
  {id:'scarf',        emoji:'🧣', name:'ผ้าพันคอสายรุ้ง',      cat:'fashion', tier:'common',    price:1500,    words:55},
  {id:'tshirt',       emoji:'👕', name:'เสื้อยืดกราฟิก',       cat:'fashion', tier:'common',    price:2000,    words:70},
  {id:'backpack',     emoji:'🎒', name:'เป้แพนด้า',            cat:'fashion', tier:'rare',      price:6000,    words:120},
  {id:'sneakers',     emoji:'👟', name:'รองเท้าผ้าใบไฟ LED',   cat:'fashion', tier:'rare',      price:9000,    words:180},
  {id:'sunglasses',   emoji:'🕶️', name:'แว่นกันแดดทรงดาว',     cat:'fashion', tier:'rare',      price:12000,   words:240},
  {id:'dress',        emoji:'👗', name:'ชุดเดรสเจ้าหญิง',      cat:'fashion', tier:'epic',      price:50000,   words:630},
  {id:'wizardhat',    emoji:'🧙', name:'หมวกพ่อมด',            cat:'fashion', tier:'epic',      price:60000,   words:750},
  {id:'handbag',      emoji:'👜', name:'กระเป๋าถือหรู',        cat:'fashion', tier:'epic',      price:90000,   words:1100},
  {id:'necklace',     emoji:'💎', name:'สร้อยคอเพชร',          cat:'fashion', tier:'legendary', price:300000,  words:2300},
  /* ---- 📱 แก็ดเจ็ต ---- */
  {id:'headphones',   emoji:'🎧', name:'หูฟังไร้สาย',          cat:'gadget',  tier:'rare',      price:7000,    words:140},
  {id:'gamepad',      emoji:'🎮', name:'จอยเกมไร้สาย',         cat:'gadget',  tier:'rare',      price:10000,   words:200},
  {id:'speaker',      emoji:'🔊', name:'ลำโพงบลูทูธ',          cat:'gadget',  tier:'rare',      price:15000,   words:300},
  {id:'smartwatch',   emoji:'⌚', name:'นาฬิกาอัจฉริยะ',       cat:'gadget',  tier:'epic',      price:45000,   words:560},
  {id:'camera',       emoji:'📷', name:'กล้องถ่ายรูปเรโทร',    cat:'gadget',  tier:'epic',      price:60000,   words:750},
  {id:'microscope',   emoji:'🔬', name:'กล้องจุลทรรศน์',       cat:'gadget',  tier:'epic',      price:80000,   words:1000},
  {id:'vr',           emoji:'🥽', name:'แว่น VR',              cat:'gadget',  tier:'epic',      price:120000,  words:1500},
  {id:'console',      emoji:'🕹️', name:'เครื่องเกมคอนโซล',     cat:'gadget',  tier:'legendary', price:250000,  words:1900},
  {id:'drone',        emoji:'🛸', name:'โดรนถ่ายภาพ',          cat:'gadget',  tier:'legendary', price:400000,  words:3100},
  {id:'telescope',    emoji:'🔭', name:'กล้องดูดาวทองเหลือง',  cat:'gadget',  tier:'legendary', price:800000,  words:6200},
  /* ---- 🚀 ยานพาหนะ/ของหรู ---- */
  {id:'skateboard',   emoji:'🛹', name:'สเก็ตบอร์ดกาแล็กซี',   cat:'vehicle', tier:'common',    price:3500,    words:120},
  {id:'scooter',      emoji:'🛴', name:'สกู๊ตเตอร์ไฟฟ้า',      cat:'vehicle', tier:'rare',      price:14000,   words:280},
  {id:'bicycle',      emoji:'🚲', name:'จักรยานเสือภูเขา',     cat:'vehicle', tier:'rare',      price:18000,   words:360},
  {id:'rccar',        emoji:'🚗', name:'รถบังคับ',             cat:'vehicle', tier:'epic',      price:80000,   words:1000},
  {id:'rcboat',       emoji:'🚤', name:'เรือบังคับ',           cat:'vehicle', tier:'epic',      price:100000,  words:1250},
  {id:'gokart',       emoji:'🏁', name:'รถโกคาร์ท',            cat:'vehicle', tier:'epic',      price:130000,  words:1600},
  {id:'rcplane',      emoji:'✈️', name:'เครื่องบินบังคับ',      cat:'vehicle', tier:'epic',      price:250000,  words:3100},
  {id:'rchelicopter', emoji:'🚁', name:'เฮลิคอปเตอร์บังคับ',   cat:'vehicle', tier:'legendary', price:350000,  words:2700},
  {id:'goldyacht',    emoji:'🛥️', name:'เรือยอชต์ทองคำ',       cat:'vehicle', tier:'mythic',    price:1500000, words:5000},
  {id:'goldcar',      emoji:'🏎️', name:'รถสปอร์ตทองคำ',        cat:'vehicle', tier:'mythic',    price:2000000, words:6700},
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
