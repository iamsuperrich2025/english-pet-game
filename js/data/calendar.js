"use strict";
/* ============================================================
   📅 รอบ 822 (ผู้ใช้สั่ง 30 ก.ค. 2026): ปฏิทินวันสำคัญไทย — คิดราคาเข้าโลก 3D
   วันหยุดราชการ/วันสำคัญ → ลดครึ่งราคา (WORLD_ENTRY_FEE)
   วันเด็กแห่งชาติ (เสาร์ที่ 2 ของเดือนมกราคม) + ผู้เล่นระดับชั้น ป.1-ป.6 → เข้าฟรี เฉพาะวันนั้น
   ที่มา: ปฏิทินวันหยุดราชการปี 2569 (infoquest.co.th / calendar.kapook.com)
   ⚠️ ปีถัดไปต้องมาเพิ่มวันที่เองทุกสิ้นปี (วันพระ/วันหยุดคำนวณจากจันทรคติ เลื่อนทุกปี)
   ============================================================ */
const THAI_HOLIDAYS = {
  '2026-01-01':'วันขึ้นปีใหม่',
  '2026-01-02':'วันหยุดพิเศษ',
  '2026-03-03':'วันมาฆบูชา',
  '2026-04-06':'วันจักรี',
  '2026-04-13':'วันสงกรานต์',
  '2026-04-14':'วันสงกรานต์',
  '2026-04-15':'วันสงกรานต์',
  '2026-05-01':'วันแรงงานแห่งชาติ',
  '2026-05-04':'วันฉัตรมงคล',
  '2026-05-13':'วันพืชมงคล',
  '2026-05-31':'วันวิสาขบูชา',
  '2026-06-01':'วันหยุดชดเชยวันวิสาขบูชา',
  '2026-06-03':'วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี',
  '2026-07-28':'วันเฉลิมพระชนมพรรษา ร.10',
  '2026-07-29':'วันอาสาฬหบูชา',
  '2026-07-30':'วันเข้าพรรษา',
  '2026-08-12':'วันแม่แห่งชาติ',
  '2026-10-13':'วันนวมินทรมหาราช',
  '2026-10-23':'วันปิยมหาราช',
  '2026-12-05':'วันพ่อแห่งชาติ',
  '2026-12-07':'วันหยุดชดเชยวันพ่อแห่งชาติ',
  '2026-12-10':'วันรัฐธรรมนูญ',
  '2026-12-31':'วันสิ้นปี',
};
const CHILDREN_DAY = '2026-01-10';   // 🧒 เสาร์ที่ 2 ของเดือนมกราคม 2569

/* 🤖🚗 รอบ 945 (ผู้ใช้สั่ง 3 ส.ค. 2026): ส่วนลดค่าเข้าโลก mecha/drive เมื่อมีหุ่น/รถของตัวเอง
   ลด 30% จากราคาวันนี้ (ทบกับส่วนลดวันหยุด/วันเด็ก — คิดต่อจากราคาที่ลดแล้ว) */
const OWNER_DISCOUNT_RATE = 0.3;

function todayYMD(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
const YOUNG_GRADES = ['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6'];

/* ราคาเข้าโลก 3D ของ "วันนี้" — {fee, free, discount, reason, ownerDiscount, ownerReason}
   mode (optional) = w.mode จาก WORLD3D — ใช้เช็กส่วนลดเจ้าของหุ่น/รถเท่านั้น ไม่ใส่ = ไม่มีส่วนลดนี้
   reason/ownerReason = โชว์บนหน้าจ่ายค่าเข้าเสมอ ตามกฎ "ห้ามลดราคา/ฟรีเงียบๆ" */
function worldEntryInfo(mode){
  const today = todayYMD();
  if(today === CHILDREN_DAY && YOUNG_GRADES.includes(typeof myGrade==='function' ? myGrade() : '')){
    return {fee:0, free:true, discount:false, reason:'🧒 วันเด็กแห่งชาติ — นักเรียน ป.1-ป.6 เล่นฟรี!', ownerDiscount:false, ownerReason:''};
  }
  const label = THAI_HOLIDAYS[today];
  let fee = label ? Math.round(WORLD_ENTRY_FEE/2) : WORLD_ENTRY_FEE;
  const discount = !!label;
  const reason = label || '';

  // 🤖🚗 รอบ 945: มีหุ่น/รถของตัวเอง (ไม่ใช่ของยืม) → ลดเพิ่ม 30% จากราคาข้างบน
  const hasOwnRobot = mode === 'mecha' && typeof state !== 'undefined' && !!(state.robots && state.robots.length);
  const hasOwnCar   = mode === 'drive' && typeof myCar === 'function' && !!myCar();
  let ownerDiscount = false, ownerReason = '';
  if(hasOwnRobot || hasOwnCar){
    fee = Math.round(fee * (1 - OWNER_DISCOUNT_RATE));
    ownerDiscount = true;
    ownerReason = hasOwnRobot ? '🤖 มีหุ่นยนต์ของตัวเอง — ลดเพิ่ม 30%' : '🚗 มีรถของตัวเอง — ลดเพิ่ม 30%';
  }
  return {fee, free:false, discount, reason, ownerDiscount, ownerReason};
}
