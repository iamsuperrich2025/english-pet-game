"use strict";
/* ============================================================
   DATA: คลังคำศัพท์แบ่งตามระดับชั้น 5 ระดับ (ป.1 ถึง ม.6)
   แต่ละระดับมี 8 หมวด × 10 คำ — เพิ่ม/แก้คำได้เลย
   ไม่กระทบเซฟผู้เล่น (ประวัติสอบอ้างอิงด้วย id หมวด)
   ============================================================
   หมายเหตุ: หมวดระดับ 1 คง id เดิม (animals, food, ...) เพื่อให้
   เซฟเก่าที่เคยสอบผ่านแล้วยังนับว่าผ่านอยู่                       */

const VOCAB_BANDS = [
  /* ---------- ระดับ 1: ป.1–ป.2 ---------- */
  {band:1, grades:['ต่ำกว่าประถมศึกษา','ป.1','ป.2'], label:'ประถมต้น (ป.1–ป.2)', cats:[
    {id:'animals', name:'สัตว์', emoji:'🐾', reward:500, words:[
      ['cat','แมว'],['dog','สุนัข'],['bird','นก'],['fish','ปลา'],['rabbit','กระต่าย'],
      ['elephant','ช้าง'],['tiger','เสือ'],['monkey','ลิง'],['horse','ม้า'],['chicken','ไก่'],
    ]},
    {id:'food', name:'อาหารและผลไม้', emoji:'🍎', reward:500, words:[
      ['apple','แอปเปิ้ล'],['banana','กล้วย'],['orange','ส้ม'],['egg','ไข่'],['milk','นม'],
      ['rice','ข้าว'],['water','น้ำ'],['bread','ขนมปัง'],['mango','มะม่วง'],['candy','ลูกอม'],
    ]},
    {id:'colors', name:'สี', emoji:'🎨', reward:500, words:[
      ['red','สีแดง'],['blue','สีน้ำเงิน'],['green','สีเขียว'],['yellow','สีเหลือง'],['black','สีดำ'],
      ['white','สีขาว'],['pink','สีชมพู'],['purple','สีม่วง'],['brown','สีน้ำตาล'],['gray','สีเทา'],
    ]},
    {id:'body', name:'ร่างกาย', emoji:'🙋', reward:500, words:[
      ['hand','มือ'],['foot','เท้า'],['eye','ตา'],['ear','หู'],['nose','จมูก'],
      ['mouth','ปาก'],['head','หัว'],['leg','ขา'],['arm','แขน'],['hair','ผม'],
    ]},
    {id:'family', name:'ครอบครัวและผู้คน', emoji:'👨‍👩‍👧', reward:500, words:[
      ['mother','แม่'],['father','พ่อ'],['teacher','คุณครู'],['friend','เพื่อน'],['brother','พี่ชาย'],
      ['sister','พี่สาว'],['grandmother','ยาย'],['grandfather','ปู่'],['baby','เด็กทารก'],['family','ครอบครัว'],
    ]},
    {id:'nature', name:'ธรรมชาติ', emoji:'🌳', reward:500, words:[
      ['sun','พระอาทิตย์'],['moon','พระจันทร์'],['star','ดวงดาว'],['rain','ฝน'],['cloud','เมฆ'],
      ['tree','ต้นไม้'],['flower','ดอกไม้'],['sky','ท้องฟ้า'],['sea','ทะเล'],['mountain','ภูเขา'],
    ]},
    {id:'things', name:'ของใช้และสถานที่', emoji:'🏠', reward:500, words:[
      ['school','โรงเรียน'],['book','หนังสือ'],['pencil','ดินสอ'],['bag','กระเป๋า'],['chair','เก้าอี้'],
      ['table','โต๊ะ'],['shoe','รองเท้า'],['hat','หมวก'],['house','บ้าน'],['car','รถยนต์'],
    ]},
    {id:'actions', name:'กริยาและความรู้สึก', emoji:'🏃', reward:500, words:[
      ['run','วิ่ง'],['walk','เดิน'],['eat','กิน'],['sleep','นอน'],['swim','ว่ายน้ำ'],
      ['happy','มีความสุข'],['sad','เศร้า'],['hot','ร้อน'],['cold','เย็น'],['big','ใหญ่'],
    ]},
  ]},

  /* ---------- ระดับ 2: ป.3–ป.4 ---------- */
  {band:2, grades:['ป.3','ป.4'], label:'ประถมกลาง (ป.3–ป.4)', cats:[
    {id:'b2_school', name:'ห้องเรียนของเรา', emoji:'📖', reward:500, words:[
      ['ruler','ไม้บรรทัด'],['eraser','ยางลบ'],['scissors','กรรไกร'],['glue','กาว'],['notebook','สมุด'],
      ['crayon','สีเทียน'],['desk','โต๊ะเรียน'],['board','กระดาน'],['paper','กระดาษ'],['pen','ปากกา'],
    ]},
    {id:'b2_days', name:'วันและเวลา', emoji:'📅', reward:500, words:[
      ['Monday','วันจันทร์'],['Tuesday','วันอังคาร'],['Wednesday','วันพุธ'],['Thursday','วันพฤหัสบดี'],['Friday','วันศุกร์'],
      ['Saturday','วันเสาร์'],['Sunday','วันอาทิตย์'],['today','วันนี้'],['morning','ตอนเช้า'],['night','กลางคืน'],
    ]},
    {id:'b2_weather', name:'อากาศและฤดูกาล', emoji:'⛅', reward:500, words:[
      ['sunny','แดดออก'],['rainy','ฝนตก'],['windy','ลมแรง'],['cloudy','มีเมฆมาก'],['storm','พายุ'],
      ['rainbow','รุ้ง'],['snow','หิมะ'],['season','ฤดู'],['summer','ฤดูร้อน'],['winter','ฤดูหนาว'],
    ]},
    {id:'b2_animals2', name:'สัตว์โลกกว้าง', emoji:'🦁', reward:500, words:[
      ['lion','สิงโต'],['bear','หมี'],['snake','งู'],['frog','กบ'],['duck','เป็ด'],
      ['pig','หมู'],['cow','วัว'],['sheep','แกะ'],['bee','ผึ้ง'],['ant','มด'],
    ]},
    {id:'b2_verbs', name:'กริยาน่ารู้', emoji:'🤸', reward:500, words:[
      ['jump','กระโดด'],['sing','ร้องเพลง'],['dance','เต้นรำ'],['read','อ่าน'],['write','เขียน'],
      ['draw','วาดรูป'],['play','เล่น'],['drink','ดื่ม'],['open','เปิด'],['close','ปิด'],
    ]},
    {id:'b2_clothes', name:'เสื้อผ้าเครื่องแต่งกาย', emoji:'👕', reward:500, words:[
      ['shirt','เสื้อเชิ้ต'],['pants','กางเกง'],['skirt','กระโปรง'],['dress','ชุดกระโปรง'],['sock','ถุงเท้า'],
      ['glove','ถุงมือ'],['belt','เข็มขัด'],['button','กระดุม'],['pocket','กระเป๋าเสื้อ'],['uniform','ชุดนักเรียน'],
    ]},
    {id:'b2_numbers', name:'ตัวเลขและจำนวน', emoji:'🔢', reward:500, words:[
      ['eleven','สิบเอ็ด'],['twelve','สิบสอง'],['twenty','ยี่สิบ'],['thirty','สามสิบ'],['forty','สี่สิบ'],
      ['fifty','ห้าสิบ'],['hundred','หนึ่งร้อย'],['thousand','หนึ่งพัน'],['first','ลำดับที่หนึ่ง'],['second','ลำดับที่สอง'],
    ]},
    {id:'b2_fruits', name:'ผักและผลไม้', emoji:'🥕', reward:500, words:[
      ['watermelon','แตงโม'],['pineapple','สับปะรด'],['grape','องุ่น'],['papaya','มะละกอ'],['coconut','มะพร้าว'],
      ['carrot','แครอท'],['corn','ข้าวโพด'],['potato','มันฝรั่ง'],['tomato','มะเขือเทศ'],['onion','หัวหอม'],
    ]},
  ]},

  /* ---------- ระดับ 3: ป.5–ป.6 ---------- */
  {band:3, grades:['ป.5','ป.6'], label:'ประถมปลาย (ป.5–ป.6)', cats:[
    {id:'b3_jobs', name:'อาชีพ', emoji:'👮', reward:500, words:[
      ['doctor','หมอ'],['nurse','พยาบาล'],['police','ตำรวจ'],['farmer','ชาวนา'],['soldier','ทหาร'],
      ['singer','นักร้อง'],['driver','คนขับรถ'],['cook','พ่อครัว'],['dentist','หมอฟัน'],['pilot','นักบิน'],
    ]},
    {id:'b3_places', name:'สถานที่ในเมือง', emoji:'🏙️', reward:500, words:[
      ['hospital','โรงพยาบาล'],['market','ตลาด'],['temple','วัด'],['airport','สนามบิน'],['station','สถานี'],
      ['bank','ธนาคาร'],['museum','พิพิธภัณฑ์'],['library','ห้องสมุด'],['park','สวนสาธารณะ'],['restaurant','ร้านอาหาร'],
    ]},
    {id:'b3_sports', name:'กีฬาและงานอดิเรก', emoji:'⚽', reward:500, words:[
      ['football','ฟุตบอล'],['basketball','บาสเกตบอล'],['badminton','แบดมินตัน'],['swimming','การว่ายน้ำ'],['running','การวิ่ง'],
      ['music','ดนตรี'],['movie','ภาพยนตร์'],['game','เกม'],['camping','การตั้งแคมป์'],['fishing','การตกปลา'],
    ]},
    {id:'b3_health', name:'สุขภาพ', emoji:'🏥', reward:500, words:[
      ['medicine','ยา'],['fever','ไข้'],['headache','อาการปวดหัว'],['toothache','อาการปวดฟัน'],['cough','ไอ'],
      ['sneeze','จาม'],['healthy','แข็งแรง'],['exercise','ออกกำลังกาย'],['clean','สะอาด'],['dirty','สกปรก'],
    ]},
    {id:'b3_travel', name:'การเดินทาง', emoji:'✈️', reward:500, words:[
      ['train','รถไฟ'],['boat','เรือ'],['bicycle','จักรยาน'],['motorcycle','รถจักรยานยนต์'],['ticket','ตั๋ว'],
      ['map','แผนที่'],['street','ถนน'],['bridge','สะพาน'],['traffic','การจราจร'],['journey','การเดินทาง'],
    ]},
    {id:'b3_feelings', name:'ความรู้สึก', emoji:'😊', reward:500, words:[
      ['angry','โกรธ'],['afraid','กลัว'],['excited','ตื่นเต้น'],['tired','เหนื่อย'],['bored','เบื่อ'],
      ['surprised','ประหลาดใจ'],['proud','ภูมิใจ'],['shy','อาย'],['hungry','หิว'],['thirsty','กระหายน้ำ'],
    ]},
    {id:'b3_house', name:'ในบ้านของเรา', emoji:'🛋️', reward:500, words:[
      ['kitchen','ห้องครัว'],['bathroom','ห้องน้ำ'],['bedroom','ห้องนอน'],['window','หน้าต่าง'],['door','ประตู'],
      ['lamp','โคมไฟ'],['mirror','กระจกเงา'],['towel','ผ้าเช็ดตัว'],['pillow','หมอน'],['blanket','ผ้าห่ม'],
    ]},
    {id:'b3_verbs2', name:'กริยาชวนคิด', emoji:'💭', reward:500, words:[
      ['think','คิด'],['know','รู้'],['understand','เข้าใจ'],['remember','จำได้'],['forget','ลืม'],
      ['believe','เชื่อ'],['choose','เลือก'],['help','ช่วยเหลือ'],['share','แบ่งปัน'],['learn','เรียนรู้'],
    ]},
  ]},

  /* ---------- ระดับ 4: ม.1–ม.3 ---------- */
  {band:4, grades:['ม.1','ม.2','ม.3'], label:'มัธยมต้น (ม.1–ม.3)', cats:[
    {id:'b4_environment', name:'สิ่งแวดล้อม', emoji:'🌍', reward:500, words:[
      ['pollution','มลพิษ'],['garbage','ขยะ'],['recycle','รีไซเคิล'],['forest','ป่าไม้'],['energy','พลังงาน'],
      ['climate','ภูมิอากาศ'],['drought','ภัยแล้ง'],['flood','น้ำท่วม'],['wildlife','สัตว์ป่า'],['planet','ดาวเคราะห์'],
    ]},
    {id:'b4_technology', name:'เทคโนโลยี', emoji:'💻', reward:500, words:[
      ['computer','คอมพิวเตอร์'],['internet','อินเทอร์เน็ต'],['website','เว็บไซต์'],['password','รหัสผ่าน'],['screen','หน้าจอ'],
      ['keyboard','แป้นพิมพ์'],['download','ดาวน์โหลด'],['message','ข้อความ'],['robot','หุ่นยนต์'],['invention','สิ่งประดิษฐ์'],
    ]},
    {id:'b4_school2', name:'ชีวิตนักเรียน', emoji:'🎒', reward:500, words:[
      ['subject','วิชา'],['science','วิทยาศาสตร์'],['history','ประวัติศาสตร์'],['mathematics','คณิตศาสตร์'],['examination','การสอบ'],
      ['homework','การบ้าน'],['knowledge','ความรู้'],['dictionary','พจนานุกรม'],['scholarship','ทุนการศึกษา'],['activity','กิจกรรม'],
    ]},
    {id:'b4_adjectives', name:'คำคุณศัพท์', emoji:'✨', reward:500, words:[
      ['beautiful','สวยงาม'],['difficult','ยาก'],['important','สำคัญ'],['dangerous','อันตราย'],['expensive','ราคาแพง'],
      ['cheap','ราคาถูก'],['famous','มีชื่อเสียง'],['comfortable','สบาย'],['delicious','อร่อย'],['interesting','น่าสนใจ'],
    ]},
    {id:'b4_verbs3', name:'กริยาระดับกลาง', emoji:'🚀', reward:500, words:[
      ['improve','ปรับปรุง'],['decide','ตัดสินใจ'],['explain','อธิบาย'],['prepare','เตรียม'],['protect','ปกป้อง'],
      ['invite','เชิญ'],['promise','สัญญา'],['travel','เดินทางท่องเที่ยว'],['create','สร้างสรรค์'],['collect','สะสม'],
    ]},
    {id:'b4_society', name:'สังคมและชุมชน', emoji:'🏘️', reward:500, words:[
      ['community','ชุมชน'],['culture','วัฒนธรรม'],['tradition','ประเพณี'],['government','รัฐบาล'],['citizen','พลเมือง'],
      ['law','กฎหมาย'],['freedom','เสรีภาพ'],['peace','สันติภาพ'],['volunteer','อาสาสมัคร'],['charity','การกุศล'],
    ]},
    {id:'b4_character', name:'อารมณ์และนิสัย', emoji:'🎭', reward:500, words:[
      ['honest','ซื่อสัตย์'],['generous','ใจกว้าง'],['patient','อดทน'],['confident','มั่นใจ'],['jealous','อิจฉา'],
      ['lonely','เหงา'],['nervous','ประหม่า'],['cheerful','ร่าเริง'],['polite','สุภาพ'],['lazy','ขี้เกียจ'],
    ]},
    {id:'b4_work', name:'โลกของงาน', emoji:'💼', reward:500, words:[
      ['business','ธุรกิจ'],['company','บริษัท'],['salary','เงินเดือน'],['meeting','การประชุม'],['customer','ลูกค้า'],
      ['product','สินค้า'],['service','บริการ'],['interview','การสัมภาษณ์'],['experience','ประสบการณ์'],['success','ความสำเร็จ'],
    ]},
  ]},

  /* ---------- ระดับ 5: ม.4–ม.6 ---------- */
  {band:5, grades:['ม.4','ม.5','ม.6','ปริญญาตรี','สูงกว่าปริญญาตรี'], label:'มัธยมปลาย (ม.4–ม.6)', cats:[
    {id:'b5_academic', name:'คำศัพท์วิชาการ', emoji:'🎓', reward:500, words:[
      ['analyze','วิเคราะห์'],['research','การวิจัย'],['theory','ทฤษฎี'],['evidence','หลักฐาน'],['conclusion','บทสรุป'],
      ['hypothesis','สมมติฐาน'],['experiment','การทดลอง'],['definition','คำจำกัดความ'],['comparison','การเปรียบเทียบ'],['evaluate','ประเมินผล'],
    ]},
    {id:'b5_abstract', name:'ความคิดเชิงลึก', emoji:'🧠', reward:500, words:[
      ['opportunity','โอกาส'],['responsibility','ความรับผิดชอบ'],['achievement','ความสำเร็จที่ภาคภูมิ'],['challenge','ความท้าทาย'],['solution','ทางแก้ปัญหา'],
      ['decision','การตัดสินใจ'],['ambition','ความทะเยอทะยาน'],['imagination','จินตนาการ'],['consequence','ผลที่ตามมา'],['perspective','มุมมอง'],
    ]},
    {id:'b5_economy', name:'เศรษฐกิจ', emoji:'📈', reward:500, words:[
      ['economy','เศรษฐกิจ'],['investment','การลงทุน'],['profit','กำไร'],['budget','งบประมาณ'],['inflation','เงินเฟ้อ'],
      ['currency','สกุลเงิน'],['employment','การจ้างงาน'],['industry','อุตสาหกรรม'],['agriculture','เกษตรกรรม'],['export','การส่งออก'],
    ]},
    {id:'b5_science', name:'วิทยาศาสตร์ขั้นสูง', emoji:'🔬', reward:500, words:[
      ['gravity','แรงโน้มถ่วง'],['molecule','โมเลกุล'],['oxygen','ออกซิเจน'],['temperature','อุณหภูมิ'],['pressure','ความดัน'],
      ['vaccine','วัคซีน'],['bacteria','แบคทีเรีย'],['evolution','วิวัฒนาการ'],['galaxy','กาแล็กซี'],['laboratory','ห้องปฏิบัติการ'],
    ]},
    {id:'b5_verbs4', name:'กริยาขั้นสูง', emoji:'⚡', reward:500, words:[
      ['accomplish','ทำสำเร็จ'],['communicate','สื่อสาร'],['contribute','มีส่วนร่วม'],['demonstrate','แสดงให้เห็น'],['establish','ก่อตั้ง'],
      ['investigate','สืบสวน'],['negotiate','เจรจาต่อรอง'],['participate','เข้าร่วม'],['recommend','แนะนำ'],['transform','เปลี่ยนแปลง'],
    ]},
    {id:'b5_media', name:'สื่อและข่าวสาร', emoji:'📰', reward:500, words:[
      ['journalist','นักข่าว'],['headline','พาดหัวข่าว'],['advertisement','โฆษณา'],['audience','ผู้ชม'],['broadcast','การออกอากาศ'],
      ['documentary','สารคดี'],['publication','สิ่งพิมพ์'],['editor','บรรณาธิการ'],['rumor','ข่าวลือ'],['source','แหล่งข่าว'],
    ]},
    {id:'b5_character2', name:'บุคลิกภาพ', emoji:'🌟', reward:500, words:[
      ['sincere','จริงใจ'],['ambitious','ทะเยอทะยาน'],['creative','มีความคิดสร้างสรรค์'],['flexible','ยืดหยุ่น'],['independent','เป็นตัวของตัวเอง'],
      ['optimistic','มองโลกในแง่ดี'],['pessimistic','มองโลกในแง่ร้าย'],['reliable','น่าเชื่อถือ'],['sensitive','อ่อนไหว'],['determined','มุ่งมั่น'],
    ]},
    {id:'b5_global', name:'โลกและอนาคต', emoji:'🌐', reward:500, words:[
      ['globalization','โลกาภิวัตน์'],['population','ประชากร'],['poverty','ความยากจน'],['education','การศึกษา'],['development','การพัฒนา'],
      ['cooperation','ความร่วมมือ'],['innovation','นวัตกรรม'],['sustainability','ความยั่งยืน'],['intelligence','สติปัญญา'],['future','อนาคต'],
    ]},
  ]},
];

/* หา band จากชั้นเรียน เช่น 'ป.5' → ระดับ 3 */
function gradeBand(grade){
  const b = VOCAB_BANDS.find(b=>b.grades.includes(grade));
  return b || VOCAB_BANDS[0];
}
/* หมวดคำศัพท์ตามชั้นของนักเรียนที่ล็อกอินอยู่ */
function catsForStudent(){
  return gradeBand(state.student ? state.student.grade : 'ป.1').cats;
}
/* คลังคำคละทุกหมวด (ตามระดับชั้นนักเรียน) — ใช้ในเกมจับคู่แบบคละ */
function vocabForStudent(){
  return catsForStudent().flatMap(c=>c.words);
}
/* หาหมวดจาก id (ค้นทุกระดับ — ไว้แสดงประวัติสอบเก่า) */
const ALL_CATS = VOCAB_BANDS.flatMap(b=>b.cats);
function findCat(id){ return ALL_CATS.find(c=>c.id===id) || null; }
