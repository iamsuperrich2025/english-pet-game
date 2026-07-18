"use strict";
/* ============================================================
   DATA: 🆕 New Word — คำศัพท์ใหม่โชว์หน้า Lobby (รอบ 116)
   สุ่ม 1 คำ/การ login ตามระดับชั้น (band เดียวกับ vocab.js)
   ------------------------------------------------------------
   format ต่อ entry = ตรงกับสเปกพจนานุกรม TASK_DICTIONARY_SONNET.md เป๊ะ:
   [en, pos, ipa, เสียงอ่านไทย, ประโยคอังกฤษง่ายๆ อธิบายความหมาย, ความหมายไทย]
   ------------------------------------------------------------
   🔮 อนาคต: ระบบ Dictionary (DICT_FILES ใน js/data/dict/ — ผู้ใช้รัน Gemini สร้าง)
   เสร็จเมื่อไหร่ ให้ดึงคำจากคลังนั้นมาเสริม/แทนได้ที่ newWordPool() จุดเดียว
   ============================================================ */

const NEW_WORDS = {
  /* band 1 — ประถมต้น (ต่ำกว่าประถม, ป.1–ป.2) */
  1:[
    ["cat","n.","/kæt/","แคท","A cat is a small pet. It says \"meow.\"","แมว"],
    ["dog","n.","/dɒɡ/","ด็อก","A dog is a friendly pet. It says \"woof!\"","หมา, สุนัข"],
    ["sun","n.","/sʌn/","ซัน","The sun is hot and bright in the sky.","ดวงอาทิตย์"],
    ["fish","n.","/fɪʃ/","ฟิช","A fish lives in water and can swim.","ปลา"],
    ["apple","n.","/ˈæp.əl/","แอป-เพิ่ล","An apple is a round fruit. It can be red or green.","แอปเปิล"],
    ["book","n.","/bʊk/","บุ๊ค","A book has pages for you to read.","หนังสือ"],
    ["egg","n.","/eɡ/","เอ้ก","A hen gives us eggs to eat.","ไข่"],
    ["milk","n.","/mɪlk/","มิลค์","Milk is a white drink from a cow.","นม"],
    ["bird","n.","/bɜːd/","เบิร์ด","A bird has wings and can fly.","นก"],
    ["run","v.","/rʌn/","รัน","To run is to move very fast with your legs.","วิ่ง"],
    ["red","adj.","/red/","เร้ด","Red is the color of a tomato.","สีแดง"],
    ["hand","n.","/hænd/","แฮนด์","You use your hand to hold things.","มือ"],
  ],
  /* band 2 — ประถมกลาง (ป.3–ป.4) */
  2:[
    ["happy","adj.","/ˈhæp.i/","แฮพ-พี่","You feel happy when you smile and laugh.","มีความสุข, ดีใจ"],
    ["window","n.","/ˈwɪn.dəʊ/","วิน-โด้","A window lets light come into a room.","หน้าต่าง"],
    ["breakfast","n.","/ˈbrek.fəst/","เบรค-ฟาสท์","Breakfast is the first meal of the day.","อาหารเช้า"],
    ["river","n.","/ˈrɪv.ər/","ริ-เว่อร์","A river is water that moves to the sea.","แม่น้ำ"],
    ["teacher","n.","/ˈtiː.tʃər/","ที-เช่อร์","A teacher helps children learn at school.","ครู"],
    ["kitchen","n.","/ˈkɪtʃ.ən/","คิท-เช่น","The kitchen is the room where we cook food.","ห้องครัว"],
    ["rabbit","n.","/ˈræb.ɪt/","แร็บ-บิท","A rabbit has long ears and jumps fast.","กระต่าย"],
    ["cloud","n.","/klaʊd/","คลาวด์","A cloud is white and floats in the sky.","เมฆ"],
    ["jump","v.","/dʒʌmp/","จั๊มพ์","To jump is to push your body up into the air.","กระโดด"],
    ["family","n.","/ˈfæm.əl.i/","แฟ-มิ-ลี่","Your family is your father, mother, sisters and brothers.","ครอบครัว"],
    ["clean","adj.","/kliːn/","คลีน","Something clean has no dirt on it.","สะอาด"],
    ["market","n.","/ˈmɑː.kɪt/","มาร์-เก็ต","A market is a place where people buy and sell things.","ตลาด"],
  ],
  /* band 3 — ประถมปลาย (ป.5–ป.6) */
  3:[
    ["weather","n.","/ˈweð.ər/","เว-เธ่อร์","The weather is how hot, cold or rainy it is outside.","สภาพอากาศ"],
    ["library","n.","/ˈlaɪ.brər.i/","ไล-บรา-รี่","A library is a place with many books to read.","ห้องสมุด"],
    ["vegetable","n.","/ˈvedʒ.tə.bəl/","เวจ-ทะ-เบิ้ล","A vegetable is a plant we eat, like a carrot.","ผัก"],
    ["healthy","adj.","/ˈhel.θi/","เฮล-ธี่","You are healthy when your body is strong and not sick.","แข็งแรง, สุขภาพดี"],
    ["mountain","n.","/ˈmaʊn.tɪn/","เมาน์-เท่น","A mountain is very high land.","ภูเขา"],
    ["promise","v.","/ˈprɒm.ɪs/","พรอ-มิส","To promise is to say you will really do something.","สัญญา"],
    ["arrive","v.","/əˈraɪv/","อะ-ไรฟ์","To arrive is to get to a place.","มาถึง, ไปถึง"],
    ["brave","adj.","/breɪv/","เบรฟ","A brave person is not afraid.","กล้าหาญ"],
    ["forest","n.","/ˈfɒr.ɪst/","ฟอ-เรสท์","A forest is a place with many trees.","ป่า"],
    ["museum","n.","/mjuːˈziː.əm/","มิว-เซี่ยม","A museum shows old and interesting things.","พิพิธภัณฑ์"],
    ["planet","n.","/ˈplæn.ɪt/","แพลน-เน็ต","The Earth is a planet that goes around the sun.","ดาวเคราะห์"],
    ["whisper","v.","/ˈwɪs.pər/","วิส-เพ่อร์","To whisper is to speak very quietly.","กระซิบ"],
  ],
  /* band 4 — มัธยมต้น (ม.1–ม.3) */
  4:[
    ["environment","n.","/ɪnˈvaɪ.rən.mənt/","อิน-ไว-เริน-เมนท์","The environment is the land, water and air around us.","สิ่งแวดล้อม"],
    ["experience","n.","/ɪkˈspɪə.ri.əns/","อิค-สเปีย-เรียนซ์","An experience is something that happens to you.","ประสบการณ์"],
    ["opportunity","n.","/ˌɒp.əˈtʃuː.nə.ti/","ออพ-พอ-ทู-นิ-ที่","An opportunity is a chance to do something good.","โอกาส"],
    ["decision","n.","/dɪˈsɪʒ.ən/","ดิ-ซิ-ชั่น","A decision is a choice you make after thinking.","การตัดสินใจ"],
    ["culture","n.","/ˈkʌl.tʃər/","คัล-เช่อร์","Culture is the way of life of a group of people.","วัฒนธรรม"],
    ["invent","v.","/ɪnˈvent/","อิน-เว้นท์","To invent is to make something new for the first time.","ประดิษฐ์, คิดค้น"],
    ["courage","n.","/ˈkʌr.ɪdʒ/","เคอ-ริจ","Courage means you do something even when you are afraid.","ความกล้าหาญ"],
    ["journey","n.","/ˈdʒɜː.ni/","เจอร์-นี่","A journey is when you travel from one place to another.","การเดินทาง"],
    ["protect","v.","/prəˈtekt/","โพร-เท็คท์","To protect is to keep someone safe.","ปกป้อง, คุ้มครอง"],
    ["knowledge","n.","/ˈnɒl.ɪdʒ/","นอ-ลิจ","Knowledge is what you know and learn.","ความรู้"],
    ["curious","adj.","/ˈkjʊə.ri.əs/","คิว-เรียส","A curious person wants to know about things.","อยากรู้อยากเห็น"],
    ["average","adj.","/ˈæv.ər.ɪdʒ/","แอฟ-เวอ-ริจ","Average means normal — not big and not small.","ปานกลาง, โดยเฉลี่ย"],
  ],
  /* band 5 — มัธยมปลายขึ้นไป (ม.4–ม.6, ปริญญาตรี, สูงกว่า) */
  5:[
    ["achievement","n.","/əˈtʃiːv.mənt/","อะ-ชีฟ-เมนท์","An achievement is something good you worked hard to do.","ความสำเร็จ"],
    ["responsibility","n.","/rɪˌspɒn.səˈbɪl.ə.ti/","ริ-สปอน-ซะ-บิ-ลิ-ที่","A responsibility is a job you must do.","ความรับผิดชอบ"],
    ["sustainable","adj.","/səˈsteɪ.nə.bəl/","ซัส-เต-นะ-เบิ้ล","Something sustainable can continue for a long time without hurting nature.","ยั่งยืน"],
    ["negotiate","v.","/nəˈɡəʊ.ʃi.eɪt/","นิ-โก-ชิ-เอท","To negotiate is to talk with someone to reach an agreement.","เจรจาต่อรอง"],
    ["perspective","n.","/pəˈspek.tɪv/","เพอร์-สเปค-ทีฟ","A perspective is a way of thinking about something.","มุมมอง"],
    ["ambitious","adj.","/æmˈbɪʃ.əs/","แอม-บิ-เชิส","An ambitious person wants to be very successful.","ทะเยอทะยาน"],
    ["consequence","n.","/ˈkɒn.sɪ.kwəns/","คอน-ซิ-เควนซ์","A consequence is what happens because of what you do.","ผลที่ตามมา"],
    ["efficient","adj.","/ɪˈfɪʃ.ənt/","อิ-ฟิ-เชี่ยนท์","Something efficient works well without wasting time.","มีประสิทธิภาพ"],
    ["phenomenon","n.","/fəˈnɒm.ɪ.nən/","ฟะ-นอ-มิ-นอน","A phenomenon is something interesting that happens, like a rainbow.","ปรากฏการณ์"],
    ["priority","n.","/praɪˈɒr.ə.ti/","ไพร-ออ-ริ-ที่","A priority is the most important thing to do first.","สิ่งสำคัญอันดับแรก"],
    ["reluctant","adj.","/rɪˈlʌk.tənt/","ริ-ลัค-เทินท์","A reluctant person does not really want to do something.","ลังเล, ไม่เต็มใจ"],
    ["versatile","adj.","/ˈvɜː.sə.taɪl/","เวอร์-ซะ-ไทล์","Something versatile can be used in many different ways.","ใช้ได้หลายแบบ, อเนกประสงค์"],
  ],
};

/* คลังคำของนักเรียนที่ล็อกอินอยู่ (ตาม band ชั้นเรียน) — จุดต่อระบบ Dictionary ในอนาคต */
function newWordPool(){
  const band = gradeBand(state.student ? state.student.grade : 'ป.1').band;
  return NEW_WORDS[band] || NEW_WORDS[1];
}
