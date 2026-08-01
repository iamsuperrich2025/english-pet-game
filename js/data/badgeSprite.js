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
function badgeIcHTML(emoji, cls){
  const img = BADGE_IMG[emoji];
  return img ? `<img class="${cls}" src="${img}" alt="" onerror="this.outerHTML='&lt;span class=&quot;${cls} badge-ic-fallback&quot;&gt;${emoji}&lt;/span&gt;'">`
             : `<span class="${cls} badge-ic-fallback">${emoji}</span>`;
}
