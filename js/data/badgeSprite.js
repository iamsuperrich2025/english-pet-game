/* 🎖️ รอบ 677: ภาพเหรียญจริงแทนอิโมจิเข็ม — ผู้ใช้เจนภาพชุดเดียว (img/badges/originals/new_badge_sheet.png ชีตคมชัด 1 ส.ค.)
   แล้ว tools/badgelab.py ตัดเป็นไฟล์แยกทีละเหรียญ (ห้ามเขียนทับ badge_sheet.png ต้นฉบับ)
   คีย์ = อิโมจิเข็มเดิมใน BADGE_META (js/game.js) → path ไฟล์ที่ตัดไว้แล้ว
   ยังไม่มีไฟล์ครบ/โหลดพัง → badgeIcHTML() ถอยไปโชว์อิโมจิเดิมให้เอง (แพทเทิร์นเดียวกับ rankBadgeHTML) */
const BADGE_IMG = {
  '🥉':'img/badges/pilot_1.png', '🥈':'img/badges/pilot_2.png', '🥇':'img/badges/pilot_3.png',
  '⚡':'img/badges/thunder_1.png', '🌩️':'img/badges/thunder_2.png', '⛈️':'img/badges/thunder_3.png',
  '🎯':'img/badges/daredevil_1.png', '🌀':'img/badges/daredevil_2.png', '🔥':'img/badges/daredevil_3.png',
  '🏅':'img/badges/diligent_1.png', '🎖️':'img/badges/diligent_2.png', '🏆':'img/badges/diligent_3.png',
  '🪟':'img/badges/glass_1.png', '💥':'img/badges/glass_2.png', '🥽':'img/badges/glass_3.png',
  '⚔️':'img/badges/mechaboss_1.png', '🛡️':'img/badges/mechaboss_2.png', '🤖':'img/badges/mechaboss_3.png',
  '🪶':'img/badges/softland_1.png', '🕊️':'img/badges/softland_2.png', '🦅':'img/badges/softland_3.png',
  '🪂':'img/badges/airletter_1.png', '🛫':'img/badges/airletter_2.png', '🦸':'img/badges/airletter_3.png',
  '🐾':'img/badges/bff_1.png', '💞':'img/badges/bff_2.png', '🫶':'img/badges/bff_3.png',
  '⌨️':'img/badges/typist_1.png', '🔠':'img/badges/typist_2.png', '📜':'img/badges/typist_3.png',
  '✒️':'img/badges/typist_4.png', '🦾':'img/badges/typist_5.png',
  '👑':'img/badges/crown.png',
};
/* 🔄 รอบ 953: ท้าย URL ต้องมี ?v=<เลข> เสมอ — ผู้ใช้ยังเห็นเหรียญเวอร์ชันเก่า (พื้นหลังทึบ + เหรียญข้างเคียงติดมา)
   ทั้งที่ไฟล์ในเครื่อง/บนเว็บถูกตัดใหม่แล้ว เพราะรูปโดน cache 2 ชั้น: Firebase Hosting ส่ง
   `Cache-Control: public, max-age=604800` (7 วัน) + service worker เป็น cache-first สำหรับรูป
   → URL เดิมเป๊ะ = เบราว์เซอร์ไม่ยิงขอใหม่เลย · เปลี่ยนเลขนี้ทุกครั้งที่ตัดไฟล์เหรียญใหม่ (บัมพ์ CACHE_VERSION ใน sw.js ด้วย) */
const BADGE_IMG_V = '953';
function badgeIcHTML(emoji, cls){
  const img = BADGE_IMG[emoji];
  const src = img ? img + '?v=' + BADGE_IMG_V : '';
  return img ? `<img class="${cls}" src="${src}" alt="" onerror="this.outerHTML='&lt;span class=&quot;${cls} badge-ic-fallback&quot;&gt;${emoji}&lt;/span&gt;'">`
             : `<span class="${cls} badge-ic-fallback">${emoji}</span>`;
}
