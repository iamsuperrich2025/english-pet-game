"use strict";
/* ============================================================
   wear_extra.js — ชิ้นสวมแบบ PNG จัตุรัสโปร่งใส (คอลเลกชันพรีเมียม)
   แยกจาก wear.js เพราะไฟล์นั้นถูกสร้างทับอัตโนมัติด้วย tools/wearlab.py

   ระบบ center-mode ใช้หมุดตา/หัวเดิม และรองรับ slot ใหม่แบบ data-driven:
   เพิ่ม ITEM + PNG + spec กลางเพียงชุดเดียวได้ทันที ส่วน profile รายสายพันธุ์
   เป็นตัวเลือกสำหรับเก็บตำแหน่งให้ละเอียดขึ้น ไม่ต้องสร้างภาพแยกทุกสายพันธุ์
   ============================================================ */
(function registerPremiumWear(){
  if(typeof WEAR_PIECE === 'undefined') return;

  const root = 'img/wear/premium/';
  const pieces = {
    flower_beret:    {file:'flower_beret.png',    pose:'beret'},
    heart_glasses:   {file:'heart_glasses.png',   pose:'face'},
    aviator_goggles: {file:'aviator_goggles.png', pose:'face'},
    pearl_collar:    {file:'pearl_collar.png',    pose:'neck'},
    star_tiara:      {file:'star_tiara.png',      pose:'tiara'},
    moon_hat:        {file:'moon_hat.png',        pose:'hat'},
    rainbow_hoodie:  {file:'rainbow_hoodie.png',  pose:'hoodie'},
    explorer_vest:   {file:'explorer_vest.png',   pose:'vest'},
    galaxy_pajamas:  {file:'galaxy_pajamas.png',  pose:'pajamas'},
    royal_cape:      {file:'royal_cape.png',      pose:'cape'},
  };

  // size/y วัดเป็นจำนวนเท่าของระยะห่างตา; x=0 คือกึ่งกลางใบหน้า
  const profiles = {
    cat: {
      beret:[2.00,-1.00,'head'], tiara:[1.75,-0.95,'head'], hat:[2.00,-1.41,'head'],
      face:[1.95,-0.97,'eye'], neck:[2.15,-0.10,'eye'],
      hoodie:[3.25,-1.05,'eye'], vest:[3.00,0.10,'eye'], pajamas:[3.20,0.05,'eye'], cape:[3.20,-0.25,'eye'],
    },
    dog: {
      beret:[2.40,-1.20,'head'], tiara:[2.20,-1.19,'head'], hat:[2.50,-1.83,'head'],
      face:[2.30,-1.15,'eye'], neck:[2.40,-0.16,'eye'],
      hoodie:[3.55,-1.05,'eye'], vest:[3.30,0.10,'eye'], pajamas:[3.50,0.05,'eye'], cape:[3.50,-0.25,'eye'],
    },
    dragon: {
      beret:[1.80,-0.90,'head'], tiara:[1.55,-0.81,'head'], hat:[2.10,-1.49,'head'],
      face:[2.30,-1.15,'eye'], neck:[2.00,-0.07,'eye'],
      hoodie:[2.95,-0.72,'eye'], vest:[2.80,0.10,'eye'], pajamas:[3.00,0.10,'eye'], cape:[1.75,-0.08,'eye'],
    },
  };

  Object.entries(pieces).forEach(([id,piece])=>{
    Object.entries(profiles).forEach(([pet,profile])=>{
      const [size,y,anchor] = profile[piece.pose];
      WEAR_PIECE[`${pet}_${id}`] = {
        f:root + piece.file, mode:'center', anchor, size, x:0, y, k:1,
      };
    });
    // fallback สำหรับสายพันธุ์ที่จะเพิ่มในอนาคต; ปรับเฉพาะ profile เมื่ออยากจูนละเอียด
    const [size,y,anchor] = profiles.cat[piece.pose];
    WEAR_PIECE[`all_${id}`] = {
      f:root + piece.file, mode:'center', anchor, size, x:0, y, k:1,
    };
  });
})();
