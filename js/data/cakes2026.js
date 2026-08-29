"use strict";
/* ============================================================
   DATA: เค้กชุดใหม่ 2026 — ใช้ร่วมกันในโรงงานและร้านของขวัญ
   ------------------------------------------------------------
   กติกา:
   - ลำดับคือรหัสถาวร cake2026_001..103; เพิ่มของใหม่ต่อท้ายเท่านั้น
   - ราคาเค้กทุกชนิดล็อกช่วง 3,000–5,000 (รอบปรับราคา 2026-08-29)
   - ค่าในรายการด้านล่างคือราคาเดิม ใช้คำนวณลำดับราคาและคืนส่วนต่างย้อนหลัง
   - image = thumbnail 256×256 สำหรับการ์ดแบบ lazy-load
   - displayImage = WebP 512×512 สำหรับฉากเปิดของขวัญ/ดูภาพใหญ่
   ============================================================ */

const NEW_CAKES_2026 = Object.freeze([
  /* 🎂 วันเกิด */
  {emoji:'🍓', name:'เค้กวันเกิดผลไม้สด',          price:12000, giftPrice:3500},
  {emoji:'🌈', name:'เค้กวันเกิดสายรุ้ง',           price:15000, giftPrice:4500},
  {emoji:'🌙', name:'เค้กวันเกิดพระจันทร์ดาว',      price:18000, giftPrice:6000},
  {emoji:'🎈', name:'เค้กวันเกิดลูกโป่ง',            price:15000, giftPrice:4500},
  {emoji:'🍫', name:'เค้กวันเกิดช็อกโกแลต',         price:15000, giftPrice:4500},
  {emoji:'🥝', name:'เค้กวันเกิดผลไม้รวม',           price:12000, giftPrice:3500},
  {emoji:'👑', name:'เค้กวันเกิดมงกุฎเจ้าหญิง',      price:18000, giftPrice:6000},
  {emoji:'🏆', name:'เค้กวันเกิดถ้วยแชมป์',          price:18000, giftPrice:6000},
  {emoji:'❤️', name:'เค้กวันเกิดหัวใจ',              price:15000, giftPrice:4500},
  {emoji:'☁️', name:'เค้กวันเกิดเมฆสายรุ้ง',         price:18000, giftPrice:6000},

  /* 💞 มิตรภาพและความคิดถึง */
  {emoji:'🧸', name:'เค้กเพื่อนซี้หมีคู่',            price:18000, giftPrice:6000},
  {emoji:'💐', name:'เค้กขอบคุณเพื่อนหมีน้อย',       price:15000, giftPrice:4500},
  {emoji:'🌞', name:'เค้กยิ้มด้วยกันสายรุ้ง',         price:15000, giftPrice:4500},
  {emoji:'💞', name:'เค้กเบสตี้หัวใจคู่',             price:18000, giftPrice:6000},
  {emoji:'🌈', name:'เค้กมิตรภาพเมฆสายรุ้ง',         price:18000, giftPrice:6000},
  {emoji:'🐰', name:'เค้กเพื่อนซี้กระต่ายลูกกวาด',    price:18000, giftPrice:6000},
  {emoji:'🎁', name:'เค้กแบ่งปันความสุข',             price:15000, giftPrice:4500},
  {emoji:'🐶', name:'เค้กขอบคุณเพื่อนหมาน้อย',       price:15000, giftPrice:4500},
  {emoji:'🌙', name:'เค้กคิดถึงนะพระจันทร์',          price:18000, giftPrice:6000},
  {emoji:'🌼', name:'เค้กรอยยิ้มดอกไม้',              price:15000, giftPrice:4500},

  /* 💪 กำลังใจ */
  {emoji:'🦁', name:'เค้กสู้ชนะสิงโต',                price:18000, giftPrice:6000},
  {emoji:'⭐', name:'เค้กสู้ชนะดาวน้อย',              price:15000, giftPrice:4500},
  {emoji:'🦁', name:'เค้กสู้ชนะสิงโตนักสู้',          price:18000, giftPrice:6000},
  {emoji:'🧸', name:'เค้กสู้ชนะหมีแชมเปียน',         price:18000, giftPrice:6000},
  {emoji:'🐼', name:'เค้กสู้ชนะแพนด้า',               price:18000, giftPrice:6000},
  {emoji:'🎓', name:'เค้กสู้ชนะนักเรียนดาว',          price:18000, giftPrice:6000},
  {emoji:'🏆', name:'เค้กสู้ชนะถ้วยดาว',              price:18000, giftPrice:6000},
  {emoji:'🐧', name:'เค้กสู้ชนะเพนกวิน',              price:15000, giftPrice:4500},
  {emoji:'🐭', name:'เค้กสู้ชนะหนูแชมป์',             price:18000, giftPrice:6000},
  {emoji:'🐧', name:'เค้กสู้ชนะเพนกวินบัณฑิต',        price:18000, giftPrice:6000},
  {emoji:'🐼', name:'เค้กสู้ชนะถ้วยทองแพนด้า',        price:18000, giftPrice:6000},
  {emoji:'🐥', name:'เค้กสู้ชนะเป็ดน้อย',             price:15000, giftPrice:4500},
  {emoji:'🐰', name:'เค้กสู้ชนะกระต่ายนักเรียน',      price:18000, giftPrice:6000},

  /* 🏅 ความสำเร็จ */
  {emoji:'👑', name:'เค้กยินดีดาวมงกุฎ',              price:30000, giftPrice:12000},
  {emoji:'🎓', name:'เค้กนักเรียนดาวเด่น',            price:30000, giftPrice:12000},
  {emoji:'😎', name:'เค้กสุดยอดดาวแชมป์',             price:30000, giftPrice:12000},
  {emoji:'🏆', name:'เค้กถ้วยทองแห่งชัยชนะ',          price:35000, giftPrice:15000},
  {emoji:'⭐', name:'เค้กดาวทองแห่งความสำเร็จ',       price:30000, giftPrice:12000},
  {emoji:'🎓', name:'เค้กภูมิใจในตัวเธอ',             price:30000, giftPrice:12000},
  {emoji:'🥇', name:'เค้กผู้ชนะอันดับหนึ่ง',           price:35000, giftPrice:15000},
  {emoji:'🎉', name:'เค้กฉลองความสำเร็จ',             price:30000, giftPrice:12000},
  {emoji:'💯', name:'เค้กคะแนนเต็มเพอร์เฟกต์',         price:35000, giftPrice:15000},
  {emoji:'🥇', name:'เค้กเหรียญทองแห่งชัยชนะ',        price:35000, giftPrice:15000},

  /* 🙏 ขอโทษและคืนดี */
  {emoji:'🧸', name:'เค้กขอโทษนะหมีน้อย',             price:12000, giftPrice:3500},
  {emoji:'💌', name:'เค้กโปรดยกโทษให้หมีน้อย',        price:15000, giftPrice:4500},
  {emoji:'🐶', name:'เค้กขอโทษนะหมาน้อย',             price:12000, giftPrice:3500},
  {emoji:'🐕', name:'เค้กขอโทษนะลูกหมาชมพู',          price:12000, giftPrice:3500},
  {emoji:'👧', name:'เค้กขอโทษจากใจสาวน้อย',          price:15000, giftPrice:4500},
  {emoji:'🧸', name:'เค้กขอโทษจากใจหมีน้อย',          price:15000, giftPrice:4500},
  {emoji:'🐶', name:'เค้กขอโทษนะลูกหมา',              price:12000, giftPrice:3500},
  {emoji:'🍓', name:'เค้กวันเกิดสตรอว์เบอร์รี',       price:15000, giftPrice:4500},
  {emoji:'💗', name:'เค้กขอโทษหมีหัวใจ',              price:15000, giftPrice:4500},
  {emoji:'🧸', name:'เค้กขอโทษจากใจเจ้าหมี',          price:12000, giftPrice:3500},

  /* 🐾 สัตว์น่ารัก */
  {emoji:'🍯', name:'เค้กหมีน้ำผึ้ง',                 price:18000, giftPrice:6000},
  {emoji:'🐰', name:'เค้กกระต่ายสวนแครอต',            price:18000, giftPrice:6000},
  {emoji:'🐱', name:'เค้กแมวน้อยน้ำผึ้ง',             price:18000, giftPrice:6000},
  {emoji:'🐶', name:'เค้กหมาน้อยช็อกโกแลต',           price:18000, giftPrice:6000},
  {emoji:'🐼', name:'เค้กแพนด้าป่าไผ่สองชั้น',        price:30000, giftPrice:12000},
  {emoji:'🦊', name:'เค้กจิ้งจอกป่าเบอร์รี',          price:22000, giftPrice:8000},
  {emoji:'🐣', name:'เค้กรังนกวันสดใส',               price:20000, giftPrice:8000},
  {emoji:'🐸', name:'เค้กกบเจ้าชายบึงบัว',            price:22000, giftPrice:8000},
  {emoji:'🐝', name:'เค้กผึ้งน้อยรวงทอง',             price:22000, giftPrice:8000},
  {emoji:'🐧', name:'เค้กเพนกวินเมืองหิมะ',           price:30000, giftPrice:12000},

  /* ✨ โลกแฟนตาซี */
  {emoji:'🏰', name:'เค้กปราสาทเมฆสายรุ้ง',           price:35000, giftPrice:15000},
  {emoji:'🌙', name:'เค้กพระจันทร์นิทราดวงดาว',       price:30000, giftPrice:12000},
  {emoji:'🦄', name:'เค้กยูนิคอร์นสายรุ้ง',           price:30000, giftPrice:12000},
  {emoji:'💎', name:'เค้กมงกุฎคริสตัลเจ้าหญิง',       price:35000, giftPrice:15000},
  {emoji:'🍄', name:'เค้กบ้านเห็ดสวนมหัศจรรย์',       price:35000, giftPrice:15000},
  {emoji:'🦋', name:'เค้กสวนผีเสื้อดอกไม้',           price:30000, giftPrice:12000},
  {emoji:'🍭', name:'เค้กเมืองลูกกวาด',               price:40000, giftPrice:18000},
  {emoji:'☁️', name:'เค้กเมฆน้อยบอลลูนสายรุ้ง',       price:30000, giftPrice:12000},
  {emoji:'💖', name:'เค้กอัญมณีสายรุ้ง',              price:35000, giftPrice:15000},
  {emoji:'🌌', name:'เค้กกาแล็กซีดวงดาว',             price:35000, giftPrice:15000},

  /* 🍫 รสชาติและผลไม้ */
  {emoji:'🍓', name:'เค้กสตรอว์เบอร์รีครีมชมพู',      price:15000, giftPrice:4500},
  {emoji:'🫐', name:'เค้กบลูเบอร์รีครีมม่วง',         price:15000, giftPrice:4500},
  {emoji:'🍫', name:'เค้กช็อกโกแลตคุกกี้',            price:18000, giftPrice:6000},
  {emoji:'🍪', name:'เค้กคุกกี้มิลค์กี้',             price:18000, giftPrice:6000},
  {emoji:'🍬', name:'เค้กมาร์ชแมลโลว์พาสเทล',        price:18000, giftPrice:6000},
  {emoji:'🍩', name:'เค้กโดนัทปาร์ตี้',               price:18000, giftPrice:6000},
  {emoji:'🥭', name:'เค้กมะม่วงซัมเมอร์',             price:18000, giftPrice:6000},
  {emoji:'🍇', name:'เค้กองุ่นครีมม่วง',               price:15000, giftPrice:4500},
  {emoji:'🍉', name:'เค้กแตงโมสดชื่น',                price:15000, giftPrice:4500},
  {emoji:'🍨', name:'เค้กไอศกรีมแฟนตาซี',            price:20000, giftPrice:8000},

  /* 📚 โรงเรียน */
  {emoji:'🏫', name:'เค้กเปิดเทอมแสนสนุก',            price:22000, giftPrice:8000},
  {emoji:'💯', name:'เค้กสอบผ่านร้อยคะแนน',           price:30000, giftPrice:12000},
  {emoji:'🎨', name:'เค้กชมรมศิลปะสีรุ้ง',            price:22000, giftPrice:8000},
  {emoji:'🌟', name:'เค้กนักเรียนดาวทอง',             price:30000, giftPrice:12000},
  {emoji:'📖', name:'เค้กนักอ่านตัวน้อย',             price:22000, giftPrice:8000},
  {emoji:'🧑‍🤝‍🧑', name:'เค้กเพื่อนร่วมชั้น',          price:25000, giftPrice:10000},
  {emoji:'🎶', name:'เค้กชมรมโรงเรียน',               price:25000, giftPrice:10000},
  {emoji:'🎪', name:'เค้กเทศกาลโรงเรียน',             price:30000, giftPrice:12000},
  {emoji:'🏅', name:'เค้กนักเรียนดาวเด่นยอดเยี่ยม',   price:30000, giftPrice:12000},
  {emoji:'🏖️', name:'เค้กสุขสันต์วันหยุดทะเล',       price:22000, giftPrice:8000},

  /* 🎮 งานอดิเรกและการผจญภัย */
  {emoji:'⚽', name:'เค้กแชมป์กีฬา',                   price:25000, giftPrice:10000},
  {emoji:'🎨', name:'เค้กจิตรกรสีรุ้ง',               price:22000, giftPrice:8000},
  {emoji:'🎸', name:'เค้กดนตรีแสนสนุก',               price:22000, giftPrice:8000},
  {emoji:'🧭', name:'เค้กนักสำรวจภูเขา',              price:30000, giftPrice:12000},
  {emoji:'🚀', name:'เค้กนักบินอวกาศ',                price:30000, giftPrice:12000},
  {emoji:'🎡', name:'เค้กสวนสนุกแสนสุข',              price:35000, giftPrice:15000},
  {emoji:'🎮', name:'เค้กเกมเมอร์เลเวลอัป',           price:30000, giftPrice:12000},
  {emoji:'🐠', name:'เค้กโลกใต้ทะเล',                 price:30000, giftPrice:12000},
  {emoji:'🦕', name:'เค้กดินแดนไดโนเสาร์',           price:30000, giftPrice:12000},
  {emoji:'🤖', name:'เค้กหุ่นยนต์อนาคต',              price:30000, giftPrice:12000},
].map((cake, index)=>{
  const serial = String(index + 1).padStart(3, '0');
  const tier = cake.price >= 25000 ? 'epic' : 'rare';
  const price = Math.max(3000, Math.min(5000, cake.giftPrice));
  return Object.freeze({
    ...cake,
    price,
    giftPrice:price,
    id:`cake2026_${serial}`,
    tier,
    words:Math.max(60, Math.round(price / 50)),
    image:`img/collectibles/cakes2026/cake_${serial}_256.webp`,
    displayImage:`img/collectibles/cakes2026/cake_${serial}.webp`,
  });
}));
