"use strict";
/* ============================================================
   DATA: สัตว์เลี้ยง + อาหาร  (แก้ไฟล์นี้เพื่อเพิ่มสัตว์/เมนูใหม่
   ได้เลย โดยไม่กระทบคะแนน/เซฟของผู้เล่นเดิม)
   ============================================================
   วิธีเพิ่มสัตว์ใหม่: เพิ่ม key ใหม่ใน PETS ตามแบบด้านล่าง
   แล้วเจนภาพชื่อ <key>_newborn.png (หรือ <key>_egg.png ถ้า startKey:'egg')
   + <key>_baby_*.png + <key>_adult_*.png วางในโฟลเดอร์ img/            */

const PETS = {
  dog:{
    name:'น้องหมา', price:3000,
    startKey:'newborn', eggName:'ลูกหมาแรกเกิด', eggClass:'basket-dog',
    eggDesc:'หลับปุ๋ยในตะกร้าผ้าห่มสีฟ้า', decals:[],
    baby:'🐶', adult:'🐕',    ability:'⏰ โฮ่งพลังเวลา: เพิ่มเวลาในเกม +20 วินาที',
    favFood:{emoji:'🦴', en:'Bone', name:'กระดูกยักษ์', price:300, exp:15},
  },
  cat:{
    name:'น้องแมว', price:3000,
    startKey:'newborn', eggName:'ลูกแมวแรกเกิด', eggClass:'basket-cat',
    eggDesc:'หลับปุ๋ยในตะกร้าผ้าห่มสีส้ม', decals:[],
    baby:'🐱', adult:'🐈',    ability:'💡 เหมียวรู้ใจ: ช่วยตัดช้อยส์ใบ้คำตอบ 1 ครั้งต่อรอบ',
    favFood:{emoji:'🐟', en:'Fish', name:'ปลาย่างหอมกรุ่น', price:300, exp:15},
  },
  dragon:{
    // มังกรเป็นสัตว์ในนิทาน จึงยังฟักจากไข่ได้ (ต่างจากหมา/แมวที่เกิดเป็นตัว)
    name:'น้องมังกร', price:10000,
    startKey:'egg', eggName:'ไข่มังกร', eggClass:'egg-dragon',
    eggDesc:'ไข่ลายเกล็ดมีออร่าไฟ', decals:[],
    baby:'🐲', adult:'🐉',    ability:'🔥 ลมหายใจไฟ: คอมโบ ×3 ขึ้นไป ได้เหรียญ ×2 · ไม่ป่วยจากอากาศร้อน',
    favFood:{emoji:'🌶️', en:'Chili', name:'พริกไฟลุกโชน', price:300, exp:15},
  },
};

/* เมนูอาหาร: สัตว์หิวทุก 3 ชั่วโมง (มื้อละ slot: 0,3,6,...,21 น.)
   อาหารธรรมดาอิ่ม 3 ชม. — feast พิเศษ อิ่ม 6 ชม. (ข้ามมื้อถัดไป) ราคา ≥2 เท่า */
const FOODS = [
  {id:'cookie',  emoji:'🍪', en:'Cookie',  name:'คุกกี้',     price:100},
  {id:'apple',   emoji:'🍎', en:'Apple',   name:'แอปเปิ้ล',   price:150},
  {id:'chicken', emoji:'🍗', en:'Chicken', name:'น่องไก่',    price:250},
  {id:'noodles', emoji:'🍜', en:'Noodles', name:'ก๋วยเตี๋ยว', price:350},
  {id:'cake',    emoji:'🍰', en:'Cake',    name:'เค้ก',       price:500},
  /* อาหารวิเศษ: อิ่ม 6 ชม. (มื้อนี้ + ข้ามมื้อถัดไปได้เลย ไม่ต้องกลับมาป้อน) */
  {id:'feast',   emoji:'🍱', en:'Feast',   name:'ชุดอาหารวิเศษ', price:1000, skipNext:true, special:true},
];
