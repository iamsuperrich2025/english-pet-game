"use strict";
/* ============================================================
   DATA: ของขวัญส่งให้เพื่อน (ข้อ 0.5)
   ------------------------------------------------------------
   ผู้เล่นซื้อของขวัญด้วยเหรียญแล้วส่งให้เพื่อน (หรือส่ง "สินค้า
   collectible" จากคลังก็ได้ — ดู online.js/ui.js)
   ของที่ "ได้รับ" เก็บใน state.giftBox (ห้องของขวัญแยกต่างหาก)
   → ขายต่อ/ส่งต่อไม่ได้ · ไม่รวมกับ collection/ตลาด/assetValue
   ภาพเดิม: img/gifts/gift_<id>.png · รายการที่มี image ใช้ WebP ร่วมได้
   prompt: PROMPTS_GIFTS.md (เค้ก 22 · กุหลาบ 14 · การ์ด 14)
   ============================================================ */

/* หมวดของขวัญ (แท็บกรองในกล่องเลือกของขวัญ) */
const GIFT_CATS = [
  {id:'cake', name:'เค้ก',   emoji:'🎂'},
  {id:'rose', name:'กุหลาบ', emoji:'🌹'},
  {id:'card', name:'การ์ด',  emoji:'💌'},
];

/* id = ชื่อไฟล์ตัดคำนำหน้า gift_ และ .png ออก (ภาพ img/gifts/gift_<id>.png)
   price = ราคาซื้อด้วยเหรียญ (จ่ายตอนส่ง — ถ้าเพื่อนไม่รับ/หมดอายุ คืนเหรียญ) */
const GIFTS = [
  /* ---- 🎂 เค้ก 22 แบบ ---- */
  {id:'cake_dino',      emoji:'🦕', name:'เค้กไดโนเสาร์',            cat:'cake', price:1500},
  {id:'cake_unicorn',   emoji:'🦄', name:'เค้กยูนิคอร์น',           cat:'cake', price:1500},
  {id:'cake_rainbow',   emoji:'🌈', name:'เค้กสายรุ้งวันเกิด',       cat:'cake', price:1500},
  {id:'cake_puppy',     emoji:'🐶', name:'เค้กหน้าหมาน้อย',          cat:'cake', price:1800},
  {id:'cake_kitten',    emoji:'🐱', name:'เค้กหน้าแมวเหมียว',        cat:'cake', price:1800},
  {id:'cake_rocket',    emoji:'🚀', name:'เค้กจรวดอวกาศ',           cat:'cake', price:2000},
  {id:'cake_princess',  emoji:'🏰', name:'เค้กปราสาทเจ้าหญิง',       cat:'cake', price:2000},
  {id:'cake_racecar',   emoji:'🏎️', name:'เค้กรถแข่ง',              cat:'cake', price:2000},
  {id:'cake_heart',     emoji:'❤️', name:'เค้กหัวใจสตรอว์เบอร์รี',   cat:'cake', price:3000},
  {id:'cake_rose',      emoji:'🌹', name:'เค้กดอกกุหลาบครีม',        cat:'cake', price:3500},
  {id:'cake_swan',      emoji:'🦢', name:'เค้กหงส์คู่',             cat:'cake', price:4000},
  {id:'cake_redvelvet', emoji:'❤️', name:'เค้กเรดเวลเวทหัวใจ',       cat:'cake', price:3500},
  {id:'cake_berrylove', emoji:'🍓', name:'เค้กสตรอว์เบอร์รีช็อกโกแลต', cat:'cake', price:3500},
  {id:'cake_choco',     emoji:'🍫', name:'เค้กช็อกโกแลตหรู',        cat:'cake', price:4500},
  {id:'cake_matcha',    emoji:'🍵', name:'เค้กชาเขียวมัทฉะ',        cat:'cake', price:4500},
  {id:'cake_coffee',    emoji:'☕', name:'เค้กกาแฟ',               cat:'cake', price:4500},
  {id:'cake_fruittart', emoji:'🥧', name:'ทาร์ตผลไม้รวม',           cat:'cake', price:5000},
  {id:'cake_orchid',    emoji:'🌸', name:'เค้กกล้วยไม้',            cat:'cake', price:6000},
  {id:'cake_gold',      emoji:'🥇', name:'เค้กทองคำเปลว',           cat:'cake', price:20000},
  {id:'cake_marble',    emoji:'🎂', name:'เค้กหินอ่อนหรู',          cat:'cake', price:15000},
  {id:'cake_tiered',    emoji:'🎂', name:'เค้ก 3 ชั้นขาวทอง',       cat:'cake', price:18000},
  {id:'cake_pearl',     emoji:'🎂', name:'เค้กไข่มุกหรู',           cat:'cake', price:22000},
  /* เค้กชุดใหม่อ้างรายการกลางเดียวกับโรงงานและใช้ภาพ WebP ชุดเดียวกัน */
  ...NEW_CAKES_2026.map(({id, emoji, name, giftPrice:price, image, displayImage})=>({id, emoji, name, cat:'cake', price, image, displayImage})),
  /* ---- 🌹 กุหลาบ 14 แบบ ---- */
  {id:'rose_red',        emoji:'🌹', name:'กุหลาบแดง 1 ดอก',        cat:'rose', price:600},
  {id:'rose_pink',       emoji:'🌷', name:'กุหลาบชมพู 1 ดอก',       cat:'rose', price:600},
  {id:'rose_white',      emoji:'🤍', name:'กุหลาบขาว 1 ดอก',        cat:'rose', price:600},
  {id:'rose_yellow',     emoji:'🌼', name:'กุหลาบเหลือง 1 ดอก',     cat:'rose', price:600},
  {id:'rosewrap_red',    emoji:'💐', name:'ช่อกุหลาบแดง (ห่อ)',     cat:'rose', price:1500},
  {id:'rosewrap_pink',   emoji:'💐', name:'ช่อกุหลาบชมพู (ห่อ)',    cat:'rose', price:1500},
  {id:'rosewrap_white',  emoji:'💐', name:'ช่อกุหลาบขาว (ห่อ)',     cat:'rose', price:1500},
  {id:'rosewrap_yellow', emoji:'💐', name:'ช่อกุหลาบเหลือง (ห่อ)',  cat:'rose', price:1500},
  {id:'bouquet_red',     emoji:'💐', name:'ช่อกุหลาบแดงช่อใหญ่',    cat:'rose', price:6000},
  {id:'bouquet_pink',    emoji:'💐', name:'ช่อกุหลาบชมพูช่อใหญ่',   cat:'rose', price:6000},
  {id:'bouquet_white',   emoji:'💐', name:'ช่อกุหลาบขาวช่อใหญ่',    cat:'rose', price:6000},
  {id:'bouquet_yellow',  emoji:'💐', name:'ช่อกุหลาบเหลืองช่อใหญ่', cat:'rose', price:6000},
  {id:'bouquet_rainbow', emoji:'🌈', name:'ช่อกุหลาบหลากสี',       cat:'rose', price:8000},
  {id:'roses_heartbox',  emoji:'💝', name:'กล่องหัวใจกุหลาบ',       cat:'rose', price:15000},
  /* ---- 💌 การ์ดคริสต์มาส & ปีใหม่ 14 แบบ ---- */
  {id:'card_xmas_tree',        emoji:'🎄', name:'การ์ดต้นคริสต์มาส',    cat:'card', price:1200},
  {id:'card_xmas_santa',       emoji:'🎅', name:'การ์ดซานตาคลอส',      cat:'card', price:1200},
  {id:'card_xmas_snowman',     emoji:'⛄', name:'การ์ดสโนว์แมน',       cat:'card', price:1200},
  {id:'card_xmas_reindeer',    emoji:'🦌', name:'การ์ดกวางเรนเดียร์',   cat:'card', price:1200},
  {id:'card_xmas_wreath',      emoji:'🎍', name:'การ์ดพวงหรีดคริสต์มาส', cat:'card', price:1200},
  {id:'card_xmas_gingerbread', emoji:'🍪', name:'การ์ดขนมปังขิง',      cat:'card', price:1200},
  {id:'card_xmas_penguin',     emoji:'🐧', name:'การ์ดเพนกวินคริสต์มาส', cat:'card', price:1200},
  {id:'card_ny_fireworks',     emoji:'🎆', name:'การ์ดพลุปีใหม่',       cat:'card', price:1500},
  {id:'card_ny_clock',         emoji:'🕛', name:'การ์ดนาฬิกาเที่ยงคืน',  cat:'card', price:1500},
  {id:'card_ny_balloon',       emoji:'🎈', name:'การ์ดลูกโป่งฉลอง',     cat:'card', price:1500},
  {id:'card_ny_gold',          emoji:'✨', name:'การ์ดทองเริ่มปีใหม่',   cat:'card', price:2500},
  {id:'card_ny_lantern',       emoji:'🏮', name:'การ์ดโคมลอย',         cat:'card', price:1500},
  {id:'card_ny_stars',         emoji:'🌟', name:'การ์ดดาวแห่งความหวัง',  cat:'card', price:1500},
  {id:'card_ny_sunrise',       emoji:'🌅', name:'การ์ดพระอาทิตย์ปีใหม่', cat:'card', price:1500},
];

const GIFT_BY_ID = {};
for(const g of GIFTS) GIFT_BY_ID[g.id] = g;

/* หาข้อมูลของขวัญจาก id (undefined ถ้าไม่มี) */
function giftInfo(id){ return GIFT_BY_ID[id]; }
