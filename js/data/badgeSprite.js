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
/* ✨ รอบ 954 (ผู้ใช้: "แสงวิ่งผ่านหน้าเหรียญ" บนการ์ดเข็ม .lbcat-ic/.pl-badge-card-ic): <img> เป็น
   replaced element วาดทับ background เสมอ ทำ overlay แสงบน ::after ตรง ๆ ไม่ได้ (สเปกไม่รองรับ
   ::before/::after บน <img>) → ห่อด้วย span.badge-shine ให้ ::after ของ span วิ่งทับหน้าเหรียญแทน
   (จำกัดเฉพาะ 2 คลาสนี้ตามที่ขอ — เหรียญเล็กในสถิตินักพิมพ์ยังเป็น <img> เดี่ยวเหมือนเดิม)
   💡 รอบ 960 (ผู้ใช้: "แสงกระพริบทั้งแผ่นดูเหมือนไฟล์พัง — เอาแสงกรีดกรอบเหรียญตามสันนูนแทน"):
   ส่ง `--bsrc` (URL รูปเหรียญใบนั้นเอง) ลงไปกับ style ของ span ด้วย เพื่อให้ CSS เอาไป
   `mask-image` ตัดแสงให้อยู่ "เฉพาะในรูปทรงเหรียญ" (ไม่ล้นพื้นโปร่ง/กรอบสี่เหลี่ยม = ต้นตอที่ดูเหมือนพัง)
   ต้องส่งจากที่นี่เพราะ CSS ไม่รู้ว่าเหรียญใบไหนใช้ไฟล์อะไร · url() ไม่ต้องใส่ quote — path มาจาก
   BADGE_IMG ของเราเอง ไม่มีช่องว่าง/อักขระพิเศษ (มีแค่ ?v= ซึ่ง url token รับได้) */
const BADGE_SHINE_CLS = {'lbcat-ic':1, 'pl-badge-card-ic':1};
/* 🖱️ รอบ 957 (ผู้ใช้: "คลิกเหรียญ ให้ขึ้นข้อความอธิบายว่าได้มาอย่างไร"): เพิ่มพารามิเตอร์ที่ 3
   `clickable` (ค่าเริ่มต้น true) — ผูก onclick เรียก showBadgeInfo(emoji) (js/game.js) ที่ element
   หลักเลย (ไม่ห่อ wrapper ใหม่ กันกระทบ CSS เดิมของทุกจุดที่เรียกอยู่แล้ว) · ใส่ false เฉพาะจุดที่ไม่ควร
   กดได้ เช่น ป้ายฉลองเข็มใหม่ (overlay ปิด pointer-events ทั้งกล่องอยู่แล้ว เพื่อไม่บังการเล่น)
   ⚠️ ไม่ผูก onclick ซ้ำใน fallback ของ onerror (โหลดรูปพัง) — ไฟล์เหรียญครบทุกไฟล์แล้วตั้งแต่รอบ 953
   โอกาสเข้า path นี้แทบเป็นศูนย์ ไม่คุ้มความเสี่ยง escape ซ้อนชั้น (fallback string ใช้ single quote
   ห่อทั้งก้อนอยู่แล้ว ใส่ onclick ที่มี '${emoji}' จะชนกัน) */
function badgeIcHTML(emoji, cls, clickable){
  if(clickable === undefined) clickable = true;
  const img = BADGE_IMG[emoji];
  const src = img ? img + '?v=' + BADGE_IMG_V : '';
  const onclickAttr = clickable ? ` onclick="event.stopPropagation();typeof showBadgeInfo==='function'&&showBadgeInfo('${emoji}')"` : '';
  const ccls = clickable ? ' badge-clickable' : '';
  if(!img) return `<span class="${cls}${ccls} badge-ic-fallback"${onclickAttr}>${emoji}</span>`;
  if(BADGE_SHINE_CLS[cls]){
    return `<span class="${cls} badge-shine${ccls}" style="--bsrc:url(${src})"${onclickAttr}><img class="badge-shine-img" src="${src}" alt="" onerror="this.parentElement.outerHTML='&lt;span class=&quot;${cls} badge-ic-fallback&quot;&gt;${emoji}&lt;/span&gt;'"></span>`;
  }
  return `<img class="${cls}${ccls}" src="${src}" alt=""${onclickAttr} onerror="this.outerHTML='&lt;span class=&quot;${cls} badge-ic-fallback&quot;&gt;${emoji}&lt;/span&gt;'">`;
}
