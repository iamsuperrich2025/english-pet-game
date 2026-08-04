"use strict";
/* ============================================================
   📖 picdict.js (data) — สารบัญหนังสือ Picture Dictionary (รอบ 992)
   แผ่นภาพจริงอยู่ img/matching/<file> (แผ่นโปสเตอร์การ์ดคำศัพท์ ภาพ+อังกฤษ+ไทย)
   โครง: กลุ่ม → รายชื่อแผ่น [ไฟล์, ชื่ออังกฤษ, ชื่อไทย]
   ⚠️ เสียงอ่าน/คำแปลรายช่องอยู่คนละไฟล์: js/data/picdict_words.js
      (เจนตาม PROMPT_PICDICT_SONNET.md — ห้ามย้ายมารวมไฟล์นี้ กันชนกับ session เจนคำ)
   ============================================================ */
const PICDICT_BOOK = [
  {icon:'🐾', g:'สัตว์โลกน่ารัก', sheets:[
    ['WildAnimals.png','Wild Animals','สัตว์ป่า'],
    ['FarmAnimals.png','Farm Animals','สัตว์ในฟาร์ม'],
    ['SeaAnimals.png','Sea Animals','สัตว์ทะเล'],
    ['Birds.png','Birds','นก'],
    ['Insects.png','Insects','แมลง'],
    ['animal1.png','Animals 1','สัตว์รวมมิตร ชุด 1'],
    ['animal2.png','Animals 2','สัตว์รวมมิตร ชุด 2'],
  ]},
  {icon:'🍎', g:'อาหาร & เครื่องดื่ม', sheets:[
    ['food.png','Food','อาหาร'],
    ['fruit.png','Fruits','ผลไม้'],
    ['Vegetables.png','Vegetables','ผัก'],
    ['Drinks.png','Drinks','เครื่องดื่ม'],
  ]},
  {icon:'🏠', g:'บ้านของฉัน', sheets:[
    ['House.png','House','บ้าน'],
    ['Bedroom.png','Bedroom','ห้องนอน'],
    ['Bathroom.png','Bathroom','ห้องน้ำ'],
    ['Kitchen.png','Kitchen','ห้องครัว'],
    ['Furniture.png','Furniture','เฟอร์นิเจอร์'],
    ['Tools.png','Tools','เครื่องมือ'],
  ]},
  {icon:'🧒', g:'ตัวเรา & ครอบครัว', sheets:[
    ['BodyParts.png','Body Parts','ร่างกายของเรา'],
    ['Family.png','Family','ครอบครัว'],
    ['Clothes.png','Clothes','เสื้อผ้า'],
    ['Feelings.png','Feelings','ความรู้สึก'],
    ['DailyRoutines.png','Daily Routines','กิจวัตรประจำวัน'],
    ['Jobs.png','Jobs','อาชีพ'],
  ]},
  {icon:'🏫', g:'โรงเรียน & ภาษา', sheets:[
    ['School.png','School','โรงเรียน'],
    ['Classroom Objects.png','Classroom Objects','ของใช้ในห้องเรียน'],
    ['Colors.png','Colors','สี'],
    ['Shapes.png','Shapes','รูปทรง'],
    ['Time.png','Time','เวลา'],
    ['Opposites.png','Opposites','คำตรงข้าม'],
    ['Prepositions.png','Prepositions','คำบอกตำแหน่ง'],
    ['Action Verbs.png','Action Verbs','คำกริยา'],
    ['Adjectives.png','Adjectives','คำคุณศัพท์'],
  ]},
  {icon:'🌳', g:'ธรรมชาติ & ท้องฟ้า', sheets:[
    ['Nature.png','Nature','ธรรมชาติ'],
    ['Weather.png','Weather','ลมฟ้าอากาศ'],
    ['Seasons.png','Seasons','ฤดูกาล'],
    ['Trees.png','Trees','ต้นไม้'],
    ['Flowers.png','Flowers','ดอกไม้'],
    ['Space.png','Space','อวกาศ'],
  ]},
  {icon:'⚽', g:'เล่น & กิจกรรม', sheets:[
    ['Sports.png','Sports','กีฬา'],
    ['Hobbies.png','Hobbies','งานอดิเรก'],
    ['Toys.png','Toys','ของเล่น'],
    ['MusicalInstruments.png','Musical Instruments','เครื่องดนตรี'],
    ['Holidays.png','Holidays','วันหยุด & เทศกาล'],
  ]},
  {icon:'🚗', g:'รอบตัวเรา', sheets:[
    ['Transportation.png','Transportation','ยานพาหนะ'],
    ['Places.png','Places','สถานที่'],
    ['Safety Signs.png','Safety Signs','ป้ายความปลอดภัย'],
  ]},
];
