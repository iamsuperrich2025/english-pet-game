"use strict";
/* ============================================================
   DATA: ที่พักสัตว์เลี้ยง + เครื่องปรับอากาศ + สภาพดินฟ้าอากาศ
   ------------------------------------------------------------
   ภาพที่พัก: วางไฟล์ img/home/home_<id>.png (prompt เจนภาพอยู่ใน
   PROMPTS_RANK_HOME.md) ไม่มีภาพจะใช้อีโมจิแทน                    */

/* quizBonus = โบนัสเหรียญเมื่อทำแบบทดสอบครบ 10 ข้อ (ได้ทุกครั้งที่ทำจบ ไม่ต้องสอบผ่าน) */
const HOMES = [
  {id:'basic',  emoji:'⛺', name:'เพิงหลังคาไม้', price:1000, quizBonus:0,
   desc:'มีแค่หลังคากันฝน ไม่มีผนังปิดล้อม', acNote:'ติดแอร์ไม่ได้ (ไม่มีผนัง)', canAC:false, builtinAC:false},
  {id:'medium', emoji:'🏡', name:'บ้านสองชั้นน่ารัก', price:100000, quizBonus:100,
   desc:'บ้านสองชั้นขนาดกลางแสนอบอุ่น', acNote:'ซื้อแอร์เพิ่มได้', canAC:true, builtinAC:false},
  {id:'castle', emoji:'🏰', name:'ปราสาทราชวังอังกฤษ', price:1000000, quizBonus:200,
   desc:'หรูหราใหญ่โตสไตล์ราชวัง', acNote:'มีแอร์ในตัวแล้ว เย็นฉ่ำ!', canAC:false, builtinAC:true},
];
const AC_PRICE   = 20000;   // ค่าเครื่องปรับอากาศ (รวมติดตั้ง = 25,000)
const AC_INSTALL = 5000;    // ค่าติดตั้ง
function homeInfo(id){ return HOMES.find(h=>h.id===id) || null; }

/* ---- ค่าบำรุงบ้านรายเดือน (เครื่องยนต์บิลอยู่ใน state.js: billTick) ----
   บิลออกทุกวันที่ 1 = 0.5% ของราคาบ้าน · เดือนแรกที่ซื้อฟรี
   ค้างจ่ายถึงวันที่ 5 → บ้านเสื่อมสภาพ (ภาพ home_<id>_decayed.png)
   ค้างจ่ายข้ามเดือน → บ้านพัง (ภาพ home_<id>_ruined.png) กลายเป็นคนไร้บ้าน */
const MAINT_RATE = 0.005;   // 0.5% ของราคาบ้านต่อเดือน
const DECAY_DAY  = 5;       // ค้างจ่ายถึงวันที่นี้ → เสื่อมสภาพ
function maintCost(homeId){
  const h = homeInfo(homeId);
  return h ? Math.round(h.price * MAINT_RATE) : 0;
}

/* ---- ค่าไฟรายเดือน (บิล id 'elec' — เครื่องยนต์เดียวกับค่าบำรุง) ----
   บิลออกทุกวันที่ 1 = 0.5% ของราคาบ้าน · เดือนแรกที่ซื้อฟรี
   ค้างจ่ายถึงสิ้นเดือน → ถูกตัดไฟ บ้านมืดทั้งหลัง (ภาพ home_<id>_dark.png)
   แอร์ใช้ไม่ได้ → สัตว์ป่วยจากร้อนทุก 6 ชม. (มังกร immune เหมือนเดิม)
   จะจ่ายบิลค้างได้ต้องซื้อหม้อแปลงใหม่ก่อน */
const ELEC_RATE        = 0.005;   // 0.5% ของราคาบ้านต่อเดือน
const TRANSFORMER_COST = 1000;    // หม้อแปลงใหม่ (ซื้อก่อนจึงจ่ายค่าไฟค้างได้)
function elecCost(homeId){
  const h = homeInfo(homeId);
  return h ? Math.round(h.price * ELEC_RATE) : 0;
}

/* ---- ค่าน้ำรายเดือน (บิล id 'water' — โครงเดียวกับค่าไฟ) ----
   ค้างจ่ายถึงสิ้นเดือน → ถูกตัดน้ำ (ภาพ home_<id>_nowater.png)
   สัตว์ขาดน้ำสะสมครบ 6 ชม. → ป่วย (โดนทุกชนิด มังกรก็ต้องกินน้ำ)
   จะจ่ายบิลค้างได้ต้องจ่ายค่าติดตั้งระบบน้ำใหม่ก่อน */
const WATER_RATE         = 0.005;   // 0.5% ของราคาบ้านต่อเดือน
const WATER_INSTALL_COST = 1000;    // ค่าติดตั้งระบบน้ำใหม่ (จ่ายก่อนจึงจ่ายค่าน้ำค้างได้)
function waterCost(homeId){
  const h = homeInfo(homeId);
  return h ? Math.round(h.price * WATER_RATE) : 0;
}

/* ---- ค่าจัดการขยะรายเดือน (บิล id 'trash' — โครงคล้ายค่าบำรุง แต่ "ไม่ตัดบริการ/ไม่ทำบ้านพัง") ----
   บิลออกทุกวันที่ 1 = 0.5% ของราคาบ้าน · เดือนแรกที่ซื้อฟรี
   ค้างจ่ายข้ามเดือน → โดนค่าปรับ +TRASH_FINE ทบสะสมทุกเดือนที่ยังค้าง (จ่ายครบเมื่อไหร่ค่าปรับหยุด)
   ต่างจากบิลอื่น: ไม่มีการตัดบริการ ไม่ทำบ้านพัง — แค่ค่าปรับพอกขึ้นเรื่อยๆ */
const TRASH_RATE = 0.005;   // 0.5% ของราคาบ้านต่อเดือน
const TRASH_FINE = 500;     // ค่าปรับต่อเดือนที่ค้างจ่าย (ทบสะสม)
function trashCost(homeId){
  const h = homeInfo(homeId);
  return h ? Math.round(h.price * TRASH_RATE) : 0;
}

/* ---- ฝนตกประจำวัน: ตกทุกวันเวลา 19:00 น. นาน 1 ชั่วโมง (event หลัก ไม่สุ่ม) ----
   มีบ้านสภาพดี = ปลอดภัย · ไม่มีบ้าน/บ้านทรุดโทรม = เปียกจนป่วย (รักษา 1,000)
   คำนวณจากเวลาล้วนๆ ไม่ต้องเซฟ */
const RAIN_HOUR   = 19;
const RAIN_DUR_MS = 60*60*1000;
function rainStartToday(now){
  return thAtHour(now, RAIN_HOUR);   // 🇹🇭 รอบ 988: 19:00 "เวลาไทย" ของวันนั้น (js/thaitime.js)
}
function rainNow(now){
  const s = rainStartToday(now);
  return now >= s && now < s + RAIN_DUR_MS;
}
function nextRainStart(now){         // ฝนรอบถัดไป (ถ้ากำลังตกอยู่ = รอบที่กำลังตก)
  const s = rainStartToday(now);
  return now < s + RAIN_DUR_MS ? s : s + 24*3600*1000;
}

/* สภาพอากาศ: ฝนตกตามตาราง 19:00 แน่นอน · เวลาอื่นหมุนเวียน แดด/ร้อน/เมฆ ทุก 3 ชม. */
const WEATHERS = [
  {id:'sunny',  emoji:'☀️', name:'แดดจ้า'},
  {id:'hot',    emoji:'🔥', name:'ร้อนจัด'},
  {id:'cloudy', emoji:'⛅', name:'เมฆครึ้ม'},
  {id:'rain',   emoji:'🌧️', name:'ฝนตก'},
];
function weatherNow(){
  if(rainNow(Date.now())) return WEATHERS[3];   // 19:00-20:00 ฝนตกแน่นอนทุกวัน
  const seed = Math.floor(Date.now()/(3*3600*1000));
  const h = (seed * 2654435761) >>> 0;          // hash ง่ายๆ ให้ลำดับดูสุ่ม
  return WEATHERS[h % 3];                       // นอกเวลาฝน: แดด/ร้อน/เมฆ เท่านั้น
}
