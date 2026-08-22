"use strict";
/* ============================================================
   DATA: สัตว์เลี้ยง + อาหาร  (แก้ไฟล์นี้เพื่อเพิ่มสัตว์/เมนูใหม่
   ได้เลย โดยไม่กระทบคะแนน/เซฟของผู้เล่นเดิม)
   ============================================================
   วิธีเพิ่มสัตว์ใหม่: เพิ่ม key ใหม่ใน PETS ตามแบบด้านล่าง แล้ววาง WebP มาตรฐาน
   <key>_newborn.webp (หรือ <key>_egg.webp) + <key>_baby_*.webp +
   <key>_adult_*.webp ใน img/animal/                                      */

const PETS = {
  dog:{
    name:'น้องหมา', price:3000,
    startKey:'newborn', eggName:'ลูกหมาแรกเกิด', eggClass:'basket-dog',
    eggDesc:'หลับปุ๋ยในตะกร้าผ้าห่มสีฟ้า', decals:[],
    baby:'🐶', adult:'🐕',    ability:'⏰ โฮ่งพลังเวลา: เพิ่มเวลาในเกม +20 วินาที',
    favFood:{emoji:'🦴', en:'Bone', name:'กระดูกยักษ์', price:300, fill:45, exp:15},
  },
  cat:{
    name:'น้องแมว', price:3000,
    startKey:'newborn', eggName:'ลูกแมวแรกเกิด', eggClass:'basket-cat',
    eggDesc:'หลับปุ๋ยในตะกร้าผ้าห่มสีส้ม', decals:[],
    baby:'🐱', adult:'🐈',    ability:'💡 เหมียวรู้ใจ: ช่วยตัดช้อยส์ใบ้คำตอบ 1 ครั้งต่อรอบ',
    favFood:{emoji:'🐟', en:'Fish', name:'ปลาย่างหอมกรุ่น', price:300, fill:45, exp:15},
  },
  dragon:{
    // มังกรเป็นสัตว์ในนิทาน จึงยังฟักจากไข่ได้ (ต่างจากหมา/แมวที่เกิดเป็นตัว)
    name:'น้องมังกร', price:10000,
    startKey:'egg', eggName:'ไข่มังกร', eggClass:'egg-dragon',
    eggDesc:'ไข่ลายเกล็ดมีออร่าไฟ', decals:[],
    baby:'🐲', adult:'🐉',    ability:'🔥 ลมหายใจไฟ: คอมโบ ×3 ขึ้นไป ได้เหรียญ ×2 · ไม่ป่วยจากอากาศร้อน',
    favFood:{emoji:'🌶️', en:'Chili', name:'พริกไฟลุกโชน', price:300, fill:45, exp:15},
  },
  elephant:{
    name:'น้องช้าง', price:2000000,
    startKey:'newborn', eggName:'ลูกช้างแรกเกิด', eggClass:'basket-elephant',
    eggDesc:'ลูกช้างตัวน้อยหลับสบายอยู่ในตะกร้า', decals:[],
    baby:'🐘', adult:'🐘',
    ability:'🐾 เพื่อนร่วมทาง: เติบโต ฝึกคำศัพท์ และร่วมผจญภัยไปกับผู้เล่น',
    favFood:{emoji:'🍌', en:'Banana', name:'กล้วยหอม', price:300, fill:45, exp:15},
  },
  meerkat:{
    name:'น้องเมียร์แคต', price:70000,
    startKey:'newborn', eggName:'ลูกเมียร์แคตแรกเกิด', eggClass:'basket-meerkat',
    eggDesc:'ลูกเมียร์แคตจิ๋วขดตัวหลับในตะกร้า', decals:[],
    baby:'🐾', adult:'🐾',
    ability:'🐾 เพื่อนร่วมทาง: เติบโต ฝึกคำศัพท์ และร่วมผจญภัยไปกับผู้เล่น',
    favFood:{emoji:'🪱', en:'Mealworm', name:'หนอนนก', price:300, fill:45, exp:15},
  },
  tyrannosaurusRex:{
    name:'น้องไทแรนโนซอรัส เร็กซ์', price:80000,
    startKey:'newborn', eggName:'ลูกทีเร็กซ์แรกเกิด', eggClass:'basket-tyrannosaurus',
    eggDesc:'ลูกทีเร็กซ์เพิ่งฟักจากไข่และกำลังหลับปุ๋ย', decals:[],
    baby:'🦖', adult:'🦖',
    ability:'🐾 เพื่อนร่วมทาง: เติบโต ฝึกคำศัพท์ และร่วมผจญภัยไปกับผู้เล่น',
    favFood:{emoji:'🍖', en:'Meat', name:'เนื้อชิ้นโต', price:300, fill:45, exp:15},
  },
  toucan:{
    name:'น้องทูแคน', price:480000,
    startKey:'newborn', eggName:'ลูกทูแคนแรกเกิด', eggClass:'basket-toucan',
    eggDesc:'ลูกทูแคนปากสีรุ้งนอนอุ่นอยู่ในรัง', decals:[],
    baby:'🐦', adult:'🐦',
    ability:'🐾 เพื่อนร่วมทาง: เติบโต ฝึกคำศัพท์ และร่วมผจญภัยไปกับผู้เล่น',
    favFood:{emoji:'🥭', en:'Mango', name:'มะม่วงสุก', price:300, fill:45, exp:15},
  },
  buffalo:{
    name:'น้องควาย', price:100000,
    startKey:'newborn', eggName:'ลูกควายแรกเกิด', eggClass:'basket-buffalo',
    eggDesc:'ลูกควายตัวน้อยหลับปุ๋ยในตะกร้าสาน', decals:[],
    baby:'🐃', adult:'🐃',
    ability:'🐾 เพื่อนร่วมทาง: เติบโต ฝึกคำศัพท์ และร่วมผจญภัยไปกับผู้เล่น',
    favFood:{emoji:'🌾', en:'Grass', name:'หญ้าอ่อน', price:300, fill:45, exp:15},
  },
  sikaDeer:{
    name:'น้องกวางซีกา', price:70000,
    startKey:'newborn', eggName:'ลูกกวางซีกาแรกเกิด', eggClass:'basket-sika-deer',
    eggDesc:'ลูกกวางลายจุดนอนหลับอย่างอบอุ่นในตะกร้า', decals:[],
    baby:'🦌', adult:'🦌',
    ability:'🐾 เพื่อนร่วมทาง: เติบโต ฝึกคำศัพท์ และร่วมผจญภัยไปกับผู้เล่น',
    favFood:{emoji:'🍃', en:'Leaves', name:'ใบไม้อ่อน', price:300, fill:45, exp:15},
  },
};

/* เมนูอาหาร (คิว 7725691507 ข้อ 2+3): สัตว์หิวมื้อเย็นวันละครั้ง เวลา 18:00
   ต้องกินสะสมความอิ่มให้ครบ 100 ถึงนับว่าอิ่มมื้อนั้น (fill = ความอิ่มต่อชิ้น
   ชิ้นเดียวไม่เต็มหลอด ต้องผสมหลายอย่าง) — feast พิเศษ เต็มหลอดทันที + ตุนข้ามมื้อพรุ่งนี้ */
/* ข้อ 5.1 แยกอาหาร 2 ชุด (human:true = ชุดอาหารคน):
   อาหารคนที่เป็นโทษกับสัตว์ชนิดนั้น (badFor) ยังป้อนได้ (มีป๊อปอัพเตือนก่อน)
   กินแล้วอิ่มจริง แต่พิษสะสม (toxin ต่อชิ้น) — สะสมครบ 100 → ป่วยทันที ขับพิษ/รักษา 1,000
   why = เหตุผลจริงที่ใช้สอนเด็กในป๊อปอัพเตือน
   มังกร (สัตว์ในนิทาน — วิเคราะห์ตามความน่าจะเป็น): สัตว์ไฟกินเนื้อ/ของเผ็ดได้ แต่ขนมหวาน+นมเป็นโทษ */
const FOODS = [
  /* ---- ชุดอาหารสัตว์ (ปลอดภัยทุกชนิด) ---- */
  {id:'apple',   emoji:'🍎', en:'Apple',   name:'แอปเปิ้ล',   price:150, fill:25},
  {id:'chicken', emoji:'🍗', en:'Chicken', name:'น่องไก่',    price:250, fill:40},
  /* อาหารวิเศษ: เต็มหลอดทันที + อิ่มตุนข้ามมื้อพรุ่งนี้ได้เลย ไม่ต้องกลับมาป้อน */
  {id:'feast',   emoji:'🍱', en:'Feast',   name:'ชุดอาหารวิเศษ', price:1000, fill:100, skipNext:true, special:true},
  /* ---- ชุดอาหารคน (คนกินได้ แต่บางอย่างเป็นโทษกับสัตว์) ---- */
  {id:'cookie',  emoji:'🍪', en:'Cookie',  name:'คุกกี้',     price:100, fill:20, human:true,
   toxin:25, badFor:['dog','cat','dragon'], why:'ขนมหวานของคน น้ำตาลเยอะเกินไปสำหรับสัตว์ทุกชนิด'},
  {id:'noodles', emoji:'🍜', en:'Noodles', name:'ก๋วยเตี๋ยว', price:350, fill:50, human:true,
   toxin:20, badFor:['dog','cat'], why:'อาหารปรุงรสของคน มีหอม กระเทียม และเค็มเกินไปสำหรับหมาแมว (มังกรชอบของเผ็ดร้อน กินได้)'},
  {id:'cake',    emoji:'🍰', en:'Cake',    name:'เค้ก',       price:500, fill:65, human:true,
   toxin:30, badFor:['dog','cat','dragon'], why:'หวานจัด มีเนย ครีม และน้ำตาลเยอะมาก สัตว์กินแล้วป่วยง่าย'},
  {id:'choco',   emoji:'🍫', en:'Chocolate', name:'ช็อกโกแลต', price:200, fill:30, human:true,
   toxin:40, badFor:['dog','cat','dragon'], why:'ช็อกโกแลตมีสารธีโอโบรมีน เป็นพิษจริงกับหมาและแมว อันตรายมาก!',
   whyDragon:'มังกรเป็นสัตว์ไฟชอบของเผ็ดร้อน ขนมหวานเข้มข้นอย่างช็อกโกแลตไม่ดีกับท้องมังกรเลย'},
  {id:'grapes',  emoji:'🍇', en:'Grapes',  name:'องุ่น',      price:150, fill:25, human:true,
   toxin:35, badFor:['dog','cat'], why:'องุ่นเป็นพิษกับไตของหมาและแมวจริงๆ แม้กินแค่ไม่กี่ลูก (มังกรตัวใหญ่ กินผลไม้ได้)'},
  {id:'milk',    emoji:'🥛', en:'Milk',    name:'นมวัว',      price:120, fill:20, human:true,
   toxin:20, badFor:['dog','cat','dragon'], why:'หมาแมวโตแล้วย่อยนมวัวไม่ได้ กินแล้วท้องเสีย',
   whyDragon:'มังกรเป็นสัตว์ไฟ ท้องรับนมวัวเย็นๆ ไม่ได้ กินแล้วท้องเสียเหมือนกัน'},
];

/* สัตว์ป่า/สัตว์พิเศษควรกินอาหารเฉพาะชนิด ไม่สอนเด็กให้นำอาหารคนไปป้อนจริง */
const SPECIAL_DIET_PETS = new Set(['elephant','meerkat','tyrannosaurusRex','toucan','buffalo','sikaDeer']);
/* อาหารนี้เป็นโทษกับสัตว์ชนิดนี้ไหม (ข้อ 5.1) */
function foodBadFor(food, type){
  return (Array.isArray(food.badFor) && food.badFor.includes(type))
    || (food.human && SPECIAL_DIET_PETS.has(type));
}
/* เหตุผลที่ใช้สอน — มังกรมีเหตุผลเฉพาะ (whyDragon) เพราะเหตุผลจริงของหมาแมวใช้กับสัตว์ในนิทานไม่ได้ */
function foodWhy(food, type){
  if(food.human && SPECIAL_DIET_PETS.has(type)) return 'สัตว์ป่าและสัตว์พิเศษต้องกินอาหารเฉพาะชนิด อาหารปรุงรสของคนอาจทำให้ป่วยได้';
  return (type === 'dragon' && food.whyDragon) ? food.whyDragon : (food.why || '');
}
