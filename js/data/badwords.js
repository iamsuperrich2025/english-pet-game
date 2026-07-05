"use strict";
/* ============================================================
   DATA: ตัวกรองชื่อ + คำต้องห้าม (ข้อ 0.2 + ข้อ 7)
   ------------------------------------------------------------
   ใช้ร่วมกัน 2 ระบบ:
   - ชื่อในเกมของผู้เล่น (display name): checkName(raw, 2, 20)
   - ชื่อสัตว์เลี้ยง (backlog ข้อ 7):     checkName(raw, 1, 15)

   วิธีตรวจคำหยาบ: เทียบแบบ normalize ก่อนเสมอ —
   ตัวพิมพ์เล็ก → แปลงเลขที่ใช้แทนอักษร (5h1t→shit) → ตัดช่องว่าง/
   ตัวเลขที่เหลือ → ตัดวรรณยุกต์/ไม้ไต่คู้/การันต์ไทย → ยุบอักษรซ้ำติดกัน
   ทำให้ "F u C k", "fuuuck", "sh1t", "เหี้ย/เหีย" โดนดักหมด

   - BAD_PART  : โผล่เป็นส่วนหนึ่งของชื่อก็ไม่ผ่าน
   - BAD_EXACT : ไม่ผ่านเฉพาะชื่อทั้งชื่อตรงกับคำนี้ — สำหรับคำหยาบ
     ที่ไปพ้องกับคำปกติ (ฟักทอง/แมงมุม/กะหรี่ปั๊บ/peacock ต้องตั้งได้)
   เพิ่มคำใหม่: เติมใน array ได้เลย (พิมพ์รูปปกติ ระบบ normalize ให้เอง)
   ============================================================ */

/* อนุญาตเฉพาะ ไทย ก-ฮ สระ วรรณยุกต์ / a-z A-Z / 0-9 / เว้นวรรค (สเปกข้อ 0.2) */
const NAME_ALLOWED_RE = /^[฀-๿a-zA-Z0-9 ]+$/;

const BAD_PART = [
  // ไทย
  'เหี้ย', 'เฮี้ย', 'ควย', 'สัส', 'เย็ด', 'หี', 'แตด', 'เงี่ยน',
  'ดอกทอง', 'อีดอก', 'ตอแหล', 'ส้นตีน', 'ระยำ', 'สันดาน',
  'ชิบหาย', 'ฉิบหาย', 'มึง', 'มรึง', 'ไอ้สัส', 'ฟัค',
  // อังกฤษ
  'fuck', 'fuk', 'fck', 'shit', 'bitch', 'cunt', 'pussy', 'dick',
  'penis', 'vagina', 'porn', 'whore', 'slut', 'nigga', 'nigger',
  'asshole', 'bastard', 'dildo', 'hentai', 'blowjob', 'wank',
];

/* คำหยาบที่พ้องคำปกติ — บล็อกเฉพาะตั้งเป็นชื่อทั้งชื่อเป๊ะๆ */
const BAD_EXACT = [
  'กู', 'ฟัก', 'ควาย', 'กะหรี่', 'แม่ง', 'พ่อง', 'ห่า', 'เวร',
  'เสือก', 'จิ๋ม', 'หำ', 'สัด',
  'sex', 'cock', 'cum',
];

const NAME_LEET = {'0':'o', '1':'i', '3':'e', '4':'a', '5':'s', '7':'t', '8':'b'};

function nameNormalize(s){
  let t = String(s).toLowerCase();
  t = t.replace(/[0134578]/g, m=>NAME_LEET[m]);      // เลขที่เด็กใช้แทนตัวอักษร
  t = t.replace(/[^a-z฀-๿]+/g, '');        // ตัดช่องว่าง/เลขที่เหลือ/สัญลักษณ์
  t = t.replace(/[็-๎]/g, '');             // ตัดวรรณยุกต์ ไม้ไต่คู้ การันต์ (เหี้ย→เหีย)
  t = t.replace(/(.)\1+/g, '$1');                    // ยุบอักษรซ้ำติดกัน (fuuuck→fuck)
  return t;
}

const BAD_PART_N  = BAD_PART.map(nameNormalize).filter(w=>w);
const BAD_EXACT_N = BAD_EXACT.map(nameNormalize).filter(w=>w);

function nameHasBadWord(s){
  const n = nameNormalize(s);
  if(!n) return false;
  return BAD_PART_N.some(w=>n.includes(w)) || BAD_EXACT_N.includes(n);
}

/* ตรวจชื่อครบวงจร → {ok:true, name:ชื่อที่จัดระเบียบแล้ว} หรือ {ok:false, msg} */
function checkName(raw, min, max){
  const name = String(raw || '').replace(/\s+/g, ' ').trim();   // ยุบช่องว่างซ้อน
  if(!name) return {ok:false, msg:'ยังไม่ได้พิมพ์ชื่อเลยนะ'};
  if(name.length < min || name.length > max)
    return {ok:false, msg:`ชื่อต้องยาว ${min}–${max} ตัวอักษรนะ`};
  if(!NAME_ALLOWED_RE.test(name))
    return {ok:false, msg:'ใช้ได้เฉพาะภาษาไทย อังกฤษ ตัวเลข และเว้นวรรคนะ'};
  if(nameHasBadWord(name))
    return {ok:false, msg:'ชื่อนี้มีคำไม่สุภาพอยู่ ลองคิดชื่อใหม่นะ 😊'};
  return {ok:true, name};
}
