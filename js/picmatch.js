"use strict";
/* ============================================================
   🖼️ picmatch.js — เกม "จับคู่ภาพ" (รอบ 977 · เชื่อม Picture Dictionary รอบ 1053)
   2 โหมด สลับด้วยปุ่มบนกระดาน:
   · "pic"  = ภาพจาก Picture Dictionary ↔ ภาพเดียวกัน
   · "word" = ภาพจาก Picture Dictionary ↔ คำศัพท์ภาษาอังกฤษ
   จับคู่ถูก = ได้เหรียญ/EXP/RP/คอมโบ/แต้มโรงงาน "สูตรเดียวกับเกมจับคู่คำศัพท์ทุกประการ" (ทั้ง 2 โหมด)
   (ใช้ตัวนับ game.* + addSessionCoins + showSessionSummary ชุดเดียวกับ js/game.js)
   แตะภาพ/คำไหน = อ่านออกเสียงภาษาอังกฤษ (speakWord → MP3/TTS)
   หมวด/คำ/กรอบภาพใช้ข้อมูลชุดเดียวกับ Picture Dictionary:
   js/data/picdict.js + picdict_words.js + picdict_grid.js · img/matching/web/*.webp
   ============================================================ */
(function(){
  /* 🎚️ รอบ 981/1057: ขนาดกระดานตามระดับชั้น — ชั้นโตสุดหยุดที่ 20 คู่
     เพื่อให้ภาพจาก Picture Dictionary ใหญ่ ชัด และไม่ถูกบีบจนเสียสัดส่วน */
  const SIZE_LOW  = [4,  60];      // ต่ำกว่าประถม · ป.1-2  → 8 ภาพ
  const SIZE_MID  = [10, 150];     // ป.3-4                → 20 ภาพ
  const SIZE_HIGH = [20, 300];     // ป.5 ขึ้นไป           → 40 ภาพ
  const NAME_MIN  = 80;            // ช่องเล็กกว่านี้ = ไม่โชว์ป้ายชื่อใต้ภาพ (ตัวหนังสือจะเล็กจนอ่านไม่ออก)
  const SHEET_AR  = 2 / 3;         // แผ่น Picture Dictionary ทุกใบ 1024×1536
  /* ✂️ รอบ 1059: ตารางที่อบจากตัวตรวจจับพิกเซล 2,641 ช่อง — ขอบแถวจริง + จุดก่อนเริ่มป้ายคำ */
  const PICDICT_ART_ROWS=Object.freeze({"Colors.png":[[0.01172,0.15495],[0.15495,0.29883],[0.29883,0.43685],[0.43685,0.57096],[0.57096,0.70247],[0.70247,0.82227],[0.82227,0.91927],[0.91927,1.0]],"Action Verbs.png":[[0.01172,0.17904],[0.17904,0.34766],[0.34766,0.51042],[0.51042,0.66471],[0.66471,0.80924],[0.80924,0.92253],[0.92253,1.0]],"Adjectives.png":[[0.01107,0.16536],[0.16536,0.31445],[0.31445,0.44792],[0.44792,0.57943],[0.57943,0.70182],[0.70182,0.81445],[0.81445,0.91471],[0.91471,1.0]],"Bathroom.png":[[0.01107,0.16471],[0.16471,0.31641],[0.31641,0.46224],[0.46224,0.60286],[0.60286,0.73242],[0.73242,0.84701],[0.84701,0.94401],[0.94401,1.0]],"Bedroom.png":[[0.01172,0.07292],[0.07292,0.16667],[0.16667,0.31966],[0.31966,0.45964],[0.45964,0.5918],[0.5918,0.7168],[0.7168,0.82943],[0.82943,1.0]],"Birds.png":[[0.01237,0.18034],[0.18034,0.34505],[0.34505,0.50651],[0.50651,0.65495],[0.65495,0.78581],[0.78581,0.9056],[0.9056,1.0]],"BodyParts.png":[[0.01172,0.15365],[0.15365,0.29102],[0.29102,0.42578],[0.42578,0.56185],[0.56185,0.69466],[0.69466,0.8151],[0.8151,0.91927],[0.91927,1.0]],"Classroom Objects.png":[[0.01237,0.16602],[0.16602,0.32227],[0.32227,0.4694],[0.4694,0.60221],[0.60221,0.7181],[0.7181,0.83203],[0.83203,0.9375],[0.9375,1.0]],"Clothes.png":[[0.01237,0.1543],[0.1543,0.29688],[0.29688,0.43424],[0.43424,0.5651],[0.5651,0.69531],[0.69531,0.81185],[0.81185,0.91797],[0.91797,1.0]],"DailyRoutines.png":[[0.02083,0.23893],[0.23893,0.45703],[0.45703,0.6569],[0.6569,0.84115],[0.84115,1.0]],"Drinks.png":[[0.01302,0.17122],[0.17122,0.33073],[0.33073,0.47917],[0.47917,0.61914],[0.61914,0.75065],[0.75065,0.88281],[0.88281,1.0]],"Family.png":[[0.01107,0.16081],[0.16081,0.31185],[0.31185,0.46615],[0.46615,0.62174],[0.62174,0.76628],[0.76628,0.89844],[0.89844,1.0]],"FarmAnimals.png":[[0.01432,0.15169],[0.15169,0.28971],[0.28971,0.42969],[0.42969,0.56445],[0.56445,0.69792],[0.69792,0.82682],[0.82682,0.92188],[0.92188,1.0]],"Feelings.png":[[0.01367,0.19531],[0.19531,0.37956],[0.37956,0.56641],[0.56641,0.75326],[0.75326,0.9043],[0.9043,1.0]],"Flowers.png":[[0.01628,0.19922],[0.19922,0.38216],[0.38216,0.5625],[0.5625,0.72982],[0.72982,0.87695],[0.87695,1.0]],"Furniture.png":[[0.01172,0.16341],[0.16341,0.31576],[0.31576,0.45833],[0.45833,0.59375],[0.59375,0.71029],[0.71029,0.82812],[0.82812,0.92318],[0.92318,1.0]],"Hobbies.png":[[0.02018,0.26367],[0.26367,0.51953],[0.51953,0.76497],[0.76497,1.0]],"Holidays.png":[[0.01758,0.21875],[0.21875,0.45117],[0.45117,0.66602],[0.66602,0.84505],[0.84505,1.0]],"House.png":[[0.01237,0.16276],[0.16276,0.3125],[0.3125,0.46094],[0.46094,0.59245],[0.59245,0.72201],[0.72201,0.83464],[0.83464,0.93164],[0.93164,1.0]],"Insects.png":[[0.02279,0.1582],[0.1582,0.29232],[0.29232,0.42839],[0.42839,0.5625],[0.5625,0.6875],[0.6875,0.80599],[0.80599,0.9069],[0.9069,1.0]],"Jobs.png":[[0.01497,0.19661],[0.19661,0.3776],[0.3776,0.55469],[0.55469,0.72656],[0.72656,0.87826],[0.87826,1.0]],"Kitchen.png":[[0.01237,0.16341],[0.16341,0.31576],[0.31576,0.45898],[0.45898,0.58854],[0.58854,0.70378],[0.70378,0.81445],[0.81445,0.91211],[0.91211,1.0]],"MusicalInstruments.png":[[0.01432,0.21875],[0.21875,0.45312],[0.45312,0.66081],[0.66081,0.84831],[0.84831,1.0]],"Nature.png":[[0.01367,0.14714],[0.14714,0.2806],[0.2806,0.41081],[0.41081,0.53646],[0.53646,0.65299],[0.65299,0.75781],[0.75781,0.85482],[0.85482,0.94857],[0.94857,1.0]],"Opposites.png":[[0.01107,0.16797],[0.16797,0.31641],[0.31641,0.45964],[0.45964,0.60352],[0.60352,0.73633],[0.73633,0.8444],[0.8444,0.9349],[0.9349,1.0]],"Places.png":[[0.01432,0.16862],[0.16862,0.32227],[0.32227,0.47461],[0.47461,0.61784],[0.61784,0.73828],[0.73828,0.8457],[0.8457,0.92969],[0.92969,1.0]],"Prepositions.png":[[0.03125,0.23503],[0.23503,0.44141],[0.44141,0.6224],[0.6224,0.82422],[0.82422,1.0]],"Safety Signs.png":[[0.03776,0.24414],[0.24414,0.44792],[0.44792,0.64518],[0.64518,0.81901],[0.81901,1.0]],"School.png":[[0.01302,0.15951],[0.15951,0.30664],[0.30664,0.45117],[0.45117,0.59961],[0.59961,0.72396],[0.72396,0.83203],[0.83203,0.92122],[0.92122,1.0]],"SeaAnimals.png":[[0.01693,0.18685],[0.18685,0.35286],[0.35286,0.51237],[0.51237,0.66146],[0.66146,0.79557],[0.79557,0.91536],[0.91536,1.0]],"Seasons.png":[[0.03971,0.17708],[0.17708,0.33724],[0.33724,0.48893],[0.48893,0.63737],[0.63737,0.76888],[0.76888,0.88867],[0.88867,1.0]],"Shapes.png":[[0.01237,0.16146],[0.16146,0.30794],[0.30794,0.44531],[0.44531,0.57227],[0.57227,0.68359],[0.68359,0.79948],[0.79948,0.90365],[0.90365,1.0]],"Space.png":[[0.01758,0.1875],[0.1875,0.34831],[0.34831,0.50846],[0.50846,0.6543],[0.6543,0.7819],[0.7819,0.89974],[0.89974,1.0]],"Sports.png":[[0.02018,0.17383],[0.17383,0.32292],[0.32292,0.47396],[0.47396,0.6237],[0.6237,0.77279],[0.77279,0.89714],[0.89714,1.0]],"Time.png":[[0.02148,0.19857],[0.19857,0.38151],[0.38151,0.50716],[0.50716,0.64714],[0.64714,0.76823],[0.76823,0.88867],[0.88867,1.0]],"Tools.png":[[0.01497,0.16667],[0.16667,0.31445],[0.31445,0.45638],[0.45638,0.58789],[0.58789,0.70312],[0.70312,0.8099],[0.8099,0.91406],[0.91406,1.0]],"Toys.png":[[0.01237,0.17253],[0.17253,0.33529],[0.33529,0.49414],[0.49414,0.64909],[0.64909,0.79036],[0.79036,0.91536],[0.91536,1.0]],"Transportation.png":[[0.01432,0.16602],[0.16602,0.31576],[0.31576,0.46484],[0.46484,0.59896],[0.59896,0.72917],[0.72917,0.8431],[0.8431,1.0]],"Trees.png":[[0.01172,0.17578],[0.17578,0.33854],[0.33854,0.5],[0.5,0.64974],[0.64974,0.77018],[0.77018,0.88477],[0.88477,1.0]],"Vegetables.png":[[0.01107,0.16862],[0.16862,0.32292],[0.32292,0.47721],[0.47721,0.6263],[0.6263,0.77083],[0.77083,0.89453],[0.89453,1.0]],"food.png":[[0.01107,0.16211],[0.16211,0.30924],[0.30924,0.44922],[0.44922,0.58203],[0.58203,0.71094],[0.71094,0.83268],[0.83268,0.93359],[0.93359,1.0]],"Weather.png":[[0.01367,0.1556],[0.1556,0.29297],[0.29297,0.43424],[0.43424,0.57096],[0.57096,0.71029],[0.71029,0.81055],[0.81055,0.90951],[0.90951,1.0]],"WildAnimals.png":[[0.02018,0.21419],[0.21419,0.40495],[0.40495,0.58919],[0.58919,0.75586],[0.75586,0.89062],[0.89062,1.0]],"animal1.png":[[0.0078,0.1302],[0.1315,0.2585],[0.2591,0.3887],[0.3887,0.5169],[0.5169,0.6335],[0.6335,0.7422],[0.7448,0.8372],[0.8438,0.9251],[0.9251,1]],"animal2.png":[[0.0052,0.1048],[0.1074,0.1927],[0.1927,0.2826],[0.2826,0.373],[0.373,0.4622],[0.4629,0.5475],[0.5475,0.6348],[0.6367,0.7174],[0.7188,0.7904],[0.791,0.8587],[0.8587,0.9277],[0.9277,0.9954]],"fruit.png":[[0.01107,0.16797],[0.16797,0.32161],[0.32161,0.47656],[0.47656,0.63021],[0.63021,0.77279],[0.77279,0.89453],[0.89453,1.0]]});
  const PICDICT_ART_CUTS=Object.freeze({"Colors.png":[0.6023,0.5994,0.6259,0.6158,0.6136,0.6326,0.6529,0.6121],"Action Verbs.png":[0.6365,0.6352,0.635,0.6121,0.5966,0.66,0.6557],"Adjectives.png":[0.6311,0.6344,0.6043,0.6285,0.6133,0.6426,0.66,0.6544],"Bathroom.png":[0.6191,0.6145,0.6179,0.6139,0.6333,0.617,0.66,0.66],"Bedroom.png":[0.62,0.6139,0.6176,0.5936,0.5957,0.5844,0.5848,0.62],"Birds.png":[0.601,0.6035,0.604,0.5978,0.5621,0.581,0.6233],"BodyParts.png":[0.5989,0.5911,0.5789,0.5922,0.5853,0.5912,0.5875,0.5879],"Classroom Objects.png":[0.6064,0.6208,0.6077,0.5975,0.5817,0.6036,0.6262,0.66],"Clothes.png":[0.5759,0.6097,0.5864,0.5869,0.6,0.6063,0.6468,0.66],"DailyRoutines.png":[0.5601,0.578,0.66,0.5651,0.6389],"Drinks.png":[0.6293,0.66,0.611,0.589,0.5839,0.576,0.6],"Family.png":[0.6272,0.6366,0.6332,0.6445,0.6282,0.6548,0.6449],"FarmAnimals.png":[0.6385,0.6495,0.6541,0.6513,0.6433,0.6518,0.5914,0.5917],"Feelings.png":[0.6453,0.6375,0.651,0.6388,0.6453,0.66],"Flowers.png":[0.6405,0.6334,0.6356,0.6404,0.6431,0.6522],"Furniture.png":[0.6317,0.6203,0.6051,0.6096,0.5951,0.6048,0.612,0.6191],"Hobbies.png":[0.66,0.6595,0.66,0.66],"Holidays.png":[0.6417,0.6025,0.5841,0.5641,0.5506],"House.png":[0.6244,0.6359,0.6154,0.6087,0.6031,0.6108,0.626,0.6321],"Insects.png":[0.6288,0.6352,0.6305,0.6255,0.626,0.6179,0.5847,0.5904],"Jobs.png":[0.66,0.66,0.66,0.66,0.66,0.66],"Kitchen.png":[0.6065,0.6075,0.6114,0.6082,0.6078,0.6162,0.6017,0.5898],"MusicalInstruments.png":[0.66,0.6444,0.6223,0.6104,0.6231],"Nature.png":[0.6043,0.6043,0.59,0.5916,0.5839,0.6023,0.579,0.6069,0.5509],"Opposites.png":[0.6368,0.6066,0.6159,0.6221,0.6123,0.6136,0.66,0.66],"Places.png":[0.6121,0.6127,0.6203,0.6295,0.6074,0.6174,0.6262,0.66],"Prepositions.png":[0.6012,0.587,0.66,0.6121,0.575],"Safety Signs.png":[0.5334,0.5948,0.513,0.5892,0.5721],"School.png":[0.6328,0.6387,0.6349,0.6461,0.6452,0.6136,0.6502,0.66],"SeaAnimals.png":[0.5804,0.5946,0.5995,0.5995,0.5818,0.5565,0.5904],"Seasons.png":[0.5959,0.6457,0.6359,0.6329,0.6285,0.6,0.66],"Shapes.png":[0.6169,0.6061,0.6148,0.6109,0.589,0.5649,0.66,0.6304],"Space.png":[0.6129,0.6066,0.6173,0.5955,0.5821,0.5772,0.5854],"Sports.png":[0.5936,0.6082,0.6086,0.6141,0.6126,0.6137,0.66],"Time.png":[0.6055,0.5426,0.5087,0.6169,0.66,0.5912,0.6007],"Tools.png":[0.6231,0.6094,0.6034,0.5938,0.5371,0.5726,0.5875,0.6189],"Toys.png":[0.6315,0.627,0.6143,0.6053,0.5902,0.5896,0.66],"Transportation.png":[0.6059,0.6098,0.6126,0.5915,0.58,0.66,0.5061],"Trees.png":[0.6179,0.615,0.604,0.6185,0.6074,0.6114,0.6247],"Vegetables.png":[0.599,0.591,0.6079,0.5995,0.5876,0.5908,0.6046],"food.png":[0.5957,0.5989,0.5936,0.5926,0.6114,0.5953,0.6073,0.6221],"Weather.png":[0.6218,0.6148,0.6202,0.6083,0.5311,0.5399,0.5704,0.6081],"WildAnimals.png":[0.6394,0.6371,0.6322,0.643,0.6175,0.66],"animal1.png":[0.6319,0.6212,0.6232,0.6247,0.6007,0.6097,0.6088,0.635,0.6533],"animal2.png":[0.6547,0.6124,0.638,0.6189,0.6246,0.6019,0.6168,0.6121,0.6068,0.6,0.6071,0.6144],"fruit.png":[0.5891,0.6106,0.6137,0.6106,0.6143,0.6007,0.617]});

  /* ระดับชั้นผู้เล่น → ระดับ 1(ป.1-2)/2(ป.3-4)/3(ป.5 ขึ้นไป) — ใช้คุมทั้งขนาดกระดานและกรองคลังสัตว์ (รอบ 980)
     คุมความยาก: ตรรกะเดียวกับ defaultSize ของเกมค้นหาคำ */
  function gradeTier(){
    const g = String((typeof state !== 'undefined' && state.student) ? state.student.grade : 'ป.1');
    if(g.indexOf('ต่ำกว่าประถม') === 0) return 1;
    const m = /^ป\.(\d)/.exec(g);
    if(m) return (+m[1] <= 2) ? 1 : (+m[1] <= 4) ? 2 : 3;
    return 3;                       // ม.1-ม.6 · ปริญญาตรี · สูงกว่าปริญญาตรี
  }
  function sizeForGrade(){ return [SIZE_LOW, SIZE_MID, SIZE_HIGH][gradeTier() - 1]; }
  const MODE_LABEL = {pic:'🖼️ ภาพ-ภาพ', word:'🔤 ภาพ-คำ'};

  let queue = [], qi = 0;          // เก็บไว้ใน test API เดิม; รอบ 1053 ใช้คลังชุดที่ผู้เล่นเลือกแทน
  let sec = null;                  // <section id="screen-picmatch">
  const pm = {
    mode:'pic',                    // 'pic' = ภาพเดียวกัน 2 ใบ · 'word' = ภาพกับคำอังกฤษ
    pairs:[], sel1:null, sel2:null, matched:0, checking:false,
    timerId:0, timeLeft:0, total:60, roundAt:0, clean:true, hintUsed:false,
    choosing:true, group:0, sheetFile:'', sheetEn:'', sheetTh:'', pageStart:0,
  };

  const $  = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const book = () => typeof PICDICT_BOOK !== 'undefined' ? PICDICT_BOOK : [];
  const wordsFor = file => (typeof PICDICT_WORDS !== 'undefined' && PICDICT_WORDS[file]) || null;
  const gridFor = file => (typeof PICDICT_GRID !== 'undefined' && PICDICT_GRID[file]) || null;
  /* Bedroom มีเส้นตกแต่งกลางแถวแรกที่ตัวตรวจพิกเซลอ่านเป็นเส้นแบ่งแถวผิด
     จึงยึดกรอบแถวเดิมที่ตรวจด้วยตาแล้ว และใช้จุดตัดก่อนป้ายคำของแต่ละแถว */
  const BEDROOM_ART_ROWS = [[0.0091,0.1595],[0.1634,0.3125],[0.3164,0.4518],[0.4557,0.5853],[0.5885,0.7116],[0.7135,0.8255],[0.8268,0.9212],[0.9212,1]];
  const BEDROOM_ART_CUTS = [0.659,0.6562,0.6385,0.6383,0.6205,0.6174,0.66,0.66];
  const artRowsFor = file => file === 'Bedroom.png' ? BEDROOM_ART_ROWS : (PICDICT_ART_ROWS[file] || null);
  const artCutsFor = file => file === 'Bedroom.png' ? BEDROOM_ART_CUTS : (PICDICT_ART_CUTS[file] || null);
  const sheetSrc = file => `img/matching/web/${file.replace(/\.png$/i,'.webp')}`;
  /* 🔎 รอบ 1057: สแกนกรอบ 2,641 ช่องแบบ lightweight พบกรอบกว้าง/แคบผิดแถว 63 จุด
     รายการนี้คือจุดที่ภาพจริงยืนยันว่ามีเศษการ์ดข้างเคียงหรือโดนตัด (เช่น Blogging) */
  const CROP_WIDTH_FIX = new Set([
    'Holidays.png:6','Holidays.png:28',
    'DailyRoutines.png:5','DailyRoutines.png:6','DailyRoutines.png:37',
    'Prepositions.png:20','Prepositions.png:21','Prepositions.png:22','Prepositions.png:27',
    'Prepositions.png:29','Prepositions.png:31','Prepositions.png:35','Prepositions.png:37','Prepositions.png:39',
    'Family.png:3','Family.png:4','Family.png:13','Family.png:14','Family.png:20','Family.png:27','Family.png:41',
  ]);
  const CROP_RECT_FIX = {
    /* เส้นประจริงของ Blogging: x 702–827px; กรอบอบเดิมลากถึง 864px กิน Bird Watching */
    'Hobbies.png:19':[.698,.5156,.8075,.7578],
  };
  function cleanRect(file,index,rect,W,G){
    let [x0,y0,x1,y1]=CROP_RECT_FIX[`${file}:${index}`] || rect;
    if(G && CROP_WIDTH_FIX.has(`${file}:${index}`)){
      const start=Math.floor(index/W.cols)*W.cols;
      const row=G.slice(start,Math.min(start+W.cols,W.words.length));
      const widths=row.map(r=>r[2]-r[0]).sort((a,b)=>a-b);
      const med=widths[Math.floor(widths.length/2)], cx=(x0+x1)/2;
      x0=Math.max(0,cx-med/2); x1=Math.min(1,cx+med/2);
    }
    const w=x1-x0, h=y1-y0, bx=x0, by=y0;
    const row=Math.floor(index/W.cols), cuts=artCutsFor(file);
    const artBottom=cuts && Number.isFinite(cuts[row]) ? cuts[row] : .66;
    /* รอบ 1059: ใช้เฉพาะเขตภาพประกอบด้านบนของการ์ด Picture Dictionary
       - ตัดชื่ออังกฤษ/ไทยด้านล่างตามขอบที่อบด้วย row consensus ของแต่ละแผ่น
       - กันเส้นประรอบการ์ดออก แต่เหลือระยะเผื่อวัตถุที่วาดชิดขอบ
       - กรอบใหม่เตี้ยลงจึงกว้างขึ้นเมื่อแสดงผล และ cropStyle ยังรักษาอัตราส่วนจริง */
    x0=bx+w*.04; x1=bx+w*.96;
    y0=by+h*.03; y1=by+h*artBottom;
    return [x0,y0,x1,y1];
  }
  function sheetItems(file){
    const W = wordsFor(file), G = gridFor(file), R = artRowsFor(file);
    if(!W) return [];
    return W.words.map(([en,th], index)=>{
      const row=Math.floor(index/W.cols);
      const fallback=[index%W.cols/W.cols,row/W.rows,(index%W.cols+1)/W.cols,(row+1)/W.rows];
      const base=(G && G[index]) || fallback;
      const rect=R && R[row] ? [base[0],R[row][0],base[2],R[row][1]] : base;
      return {key:`${file}:${index}`,file,index,en,th,rect:cleanRect(file,index,rect,W,G)};
    });
  }
  function pageSize(){
    const n = sizeForGrade()[0];
    return Math.min(20,n);              // รอบ 1057: ทุกโหมดไม่เกิน 20 คู่
  }
  const bank = () => pm.sheetFile
    ? sheetItems(pm.sheetFile).slice(pm.pageStart, pm.pageStart + pageSize()) : [];

  /* ---------- คลังชุดที่เลือก: ทุกภาพในลิงก์ชุดนั้นต้องได้ขึ้นกระดานครบ ---------- */
  function take(n){
    queue = shuffle(bank().slice()); qi = Math.min(n, queue.length);
    return queue.slice(0, qi);
  }

  /* ---------- สร้างหน้าจอครั้งเดียว ---------- */
  function build(){
    if(sec) return sec;
    sec = document.createElement('section');
    sec.id = 'screen-picmatch';
    sec.className = 'screen';
    sec.innerHTML = `
      <div class="game-top">
        <button class="back-btn" id="pm-back">⬅ กลับ</button>
        <div class="game-avatar" id="pm-avatar" title="ตัวละครของหนูมาเชียร์!"></div>
        <button class="pm-category-btn pm-play" id="pm-category" title="เลือกหมวดอื่น">📚 เลือกหมวด</button>
        <button class="pm-mode-btn" id="pm-mode" title="สลับโหมดเกม">🖼️ ภาพ-ภาพ</button>
        <button class="pm-now pm-play" id="pm-now" title="แตะฟังเสียงอีกครั้ง">🔊 <span id="pm-now-en">แตะภาพฟังเสียง</span><span class="pm-now-th" id="pm-now-th"></span></button>
        <div class="pm-right pm-play">
          <div class="coin-pill"><img class="coin-ic" src="img/coins/coin_gold.png" alt="เหรียญ" onerror="this.replaceWith('🪙')"> <span id="pm-coin">0</span></div>
          <div class="combo-pill" id="pm-combo">Combo ×0</div>
        </div>
      </div>
      <div class="pm-chooser" id="pm-chooser">
        <div class="pm-choose-head"><b>🖼️ เลือกหมวด Picture Dictionary</b><span id="pm-budget"></span></div>
        <div class="pm-group-tabs" id="pm-group-tabs"></div>
        <div class="pm-sheet-list" id="pm-sheet-list"></div>
      </div>
      <div class="timer-wrap pm-play"><div class="timer-fill" id="pm-timer"></div></div>
      <!-- 🔀 รอบ 985 (ผู้ใช้สั่ง): กระดานเดียว ภาพ 2 ชุดคละกันทั้งกระดาน (เลิกแยกแถวบน/แถวล่าง)
           #pm-grid-b เก็บไว้เป็นกล่องเปล่า เผื่อโค้ดเก่า/เทสต์ยังอ้างถึง -->
      <div class="pm-grid pm-play" id="pm-grid-a"></div>
      <div class="pm-grid pm-play" id="pm-grid-b" hidden></div>
      <button class="hint-btn pm-play" id="pm-hint" style="display:none">💡 น้องแมวช่วยตัดช้อยส์!</button>
      <p class="game-endless-note pm-note pm-play">♾️ ภาพทุกใบมาจาก <b>Picture Dictionary</b> · แตะภาพ/คำเพื่อฟังเสียง · ครั้งนี้เก็บไปแล้ว <b class="sess-coin" id="pm-sess">0 🪙</b><span class="pm-n2"><br>อยากเปลี่ยนหมวด กด <b>📚 หมวดภาพ</b> ด้านบนได้เสมอ 😊</span></p>
      <button class="pm-lobby-btn" id="pm-lobby">🚪 ออกไป Lobby</button>`;
    const host = $('screen-game') ? $('screen-game').parentNode : document.body;
    host.appendChild(sec);
    $('pm-back').addEventListener('click', backToChooser);
    $('pm-lobby').addEventListener('click', leaveLobby);
    $('pm-hint').addEventListener('click', hint);
    $('pm-mode').addEventListener('click', toggleMode);
    $('pm-category').addEventListener('click', showChooser);
    $('pm-now').addEventListener('click', replayNow);
    $('pm-group-tabs').addEventListener('click', e=>{
      const b=e.target.closest('[data-group]'); if(!b) return;
      pm.group=+b.dataset.group; renderChooser();
    });
    $('pm-sheet-list').addEventListener('click', e=>{
      const b=e.target.closest('[data-file][data-start]'); if(!b) return;
      chooseSheet(b.dataset.file,b.dataset.en,b.dataset.th,+b.dataset.start);
    });
    return sec;
  }

  /* ---------- สลับโหมด: ภาพ-ภาพ ↔ ภาพ-คำ (คลังคำคนละชุด ต้องสับคิวใหม่) ---------- */
  function toggleMode(){
    if(typeof sfx !== 'undefined') sfx.select();
    pm.mode = pm.mode === 'pic' ? 'word' : 'pic';
    queue = []; qi = 0;
    updateLabels();
    if(pm.choosing) renderChooser();
    else{
      pm.pageStart = Math.floor(pm.pageStart/pageSize())*pageSize();
      newRound();
    }
  }
  function updateLabels(){    // รอบ 985: เหลือแค่ปุ่มโหมด — ป้ายบอกแถวบน/ล่างถูกถอดออก (กระดานคละกันแล้ว)
    $('pm-mode').textContent = MODE_LABEL[pm.mode];
  }

  /* ============================================================
     📚 Picture Dictionary category chooser (รอบ 1053)
     8 กลุ่ม + 46 หมวดใช้สารบัญเดียวกับหนังสือ; หมวดที่เกินงบ 4/10/20 คู่
     แบ่งเป็นลิงก์ "ชุด" ใต้ชื่อหมวด เพื่อไม่ให้ภาพส่วนเกินหายไป
     ============================================================ */
  function renderChooser(){
    const groups=book(), budget=pageSize();
    const grade=String(typeof state !== 'undefined' && state.student ? state.student.grade : 'ป.1');
    if(!groups.length) return;
    pm.group=Math.max(0,Math.min(pm.group,groups.length-1));
    $('pm-budget').textContent=`${grade} · ${budget} คู่/ชุด${pm.mode==='word'&&sizeForGrade()[0]>20?' (โหมดคำจำกัด 20 คู่เพื่อให้อ่านชัด)':''}`;
    $('pm-group-tabs').innerHTML=groups.map((g,i)=>
      `<button class="pm-group-tab${i===pm.group?' on':''}" data-group="${i}">${g.icon} ${esc(g.g)}</button>`).join('');
    const gr=groups[pm.group];
    $('pm-sheet-list').innerHTML=gr.sheets.map(([file,en,th])=>{
      const count=sheetItems(file).length, pages=Math.ceil(count/budget);
      const links=Array.from({length:pages},(_,i)=>{
        const start=i*budget, end=Math.min(count,start+budget);
        return `<button class="pm-set-link" data-file="${esc(file)}" data-en="${esc(en)}" data-th="${esc(th)}" data-start="${start}">ชุด ${i+1} <small>${start+1}–${end}</small></button>`;
      }).join('');
      return `<article class="pm-sheet-card"><div class="pm-sheet-title"><span>${gr.icon}</span><b>${esc(th)}</b><small>${esc(en)} · ${count} ภาพ</small></div><div class="pm-set-links">${links}</div></article>`;
    }).join('');
  }
  function showChooser(){
    clearInterval(pm.timerId); pm.choosing=true;
    sec.classList.add('choosing');
    $('pm-back').hidden=true;
    renderChooser();
  }
  function chooseSheet(file,en,th,start){
    pm.sheetFile=file; pm.sheetEn=en; pm.sheetTh=th; pm.pageStart=start; pm.choosing=false;
    sec.classList.remove('choosing');
    $('pm-back').hidden=false;
    $('pm-back').textContent='⬅ กลับสารบัญ';
    const end=Math.min(sheetItems(file).length,start+pageSize());
    $('pm-category').textContent=`📚 ${th} ${start+1}–${end}`;
    updateLabels(); newRound(); fitGrid();
  }

  /* ---------- เปิดเกม ---------- */
  function open(){
    if(!book().length || typeof PICDICT_WORDS === 'undefined' || typeof PICDICT_GRID === 'undefined'){
      if(has('toast')) toast('⚠️ ยังโหลดคลังภาพไม่ได้ ลองรีเฟรชหน้าอีกครั้งนะ');
      return;
    }
    build();
    if(has('careTick')) careTick();
    // ตัวนับ "ครั้งนี้" ชุดเดียวกับเกมจับคู่คำศัพท์ (สถิติสัปดาห์/ตลอดกาลจึงนับรวมกัน)
    if(typeof game !== 'undefined'){
      game.combo = 0; game.sessionCoins = 0; game.sessionMatches = 0;
      game.sessMilestone = 0; game.beatBestShown = false;
      if(has('rolloverWeekBest')) rolloverWeekBest();
      game.prevBest = state.weekBestCoins || 0;
      game.prevAllBest = state.bestSessionCoins || 0;
    }
    setSess(0); setCombo();
    $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
    const av = $('pm-avatar');
    if(av && has('playerAvatarHTML')){ const h = playerAvatarHTML(''); av.innerHTML = h; av.style.display = h ? '' : 'none'; }
    const p = has('activePet') ? activePet() : null;
    $('pm-hint').style.display = (p && p.type === 'cat' && has('abilityOn') && abilityOn(p)) ? 'block' : 'none';
    showScreen('screen-picmatch');
    updateLabels(); showChooser();
  }

  /* ---------- รอบใหม่ ---------- */
  function newRound(){
    clearInterval(pm.timerId);
    if(!pm.sheetFile){ showChooser(); return; }
    pm.pairs = take(pageSize());
    pm.sel1 = pm.sel2 = null;
    pm.matched = 0; pm.checking = false; pm.hintUsed = false;
    pm.roundAt = Date.now(); pm.clean = true;
    resetNow();                        // 🔊 การ์ดชุดใหม่ทั้งกระดาน → เคลียร์ป้ายเสียง/ความหมายรอบก่อน

    const cropStyle = it=>{
      const [x0,y0,x1,y1]=it.rect, w=x1-x0, h=y1-y0;
      const px=w<.999 ? x0/(1-w)*100 : 0, py=h<.999 ? y0/(1-h)*100 : 0;
      // รอบ 1054: แยกการ escape ออกจาก ${...} ให้ทั้งคนและ static checker อ่านได้ตรงไปตรงมา
      const bg=encodeURI(sheetSrc(it.file)).split("'").join('%27');
      const ar=(w*SHEET_AR)/h;           // span อัตราส่วนเดียวกับ crop → ไม่ยืด/บีบภาพ
      return `--pm-img-ar:${ar};--pm-img-inv:${1/ar};background-image:url('${bg}');background-size:${100/w}% ${100/h}%;background-position:${px}% ${py}%`;
    };
    const imgCard = (side, it) =>
      `<button class="pm-card pm-sheet-card-img" data-key="${esc(it.key)}" data-en="${esc(it.en)}" data-th="${esc(it.th)}" data-side="${side}">
         <span class="pm-sheet-img" style="${cropStyle(it)}" role="img" aria-label="${esc(it.en)}"></span>
       </button>`;
    const wordCard = it =>
      `<button class="pm-card pm-wordcard" data-key="${esc(it.key)}" data-en="${esc(it.en)}" data-th="${esc(it.th)}" data-side="a2">
         <span class="pm-word-text">${esc(it.en)}</span>
       </button>`;
    /* 🔀 รอบ 985 (ผู้ใช้สั่ง "เอาภาพ 2 ชุดมาผสมกันเลย เค้าต้องคละกัน"):
       ทุกใบทั้ง 2 ชุดลงกริดเดียว สับไพ่รวมกันหมด — แตะใบไหนก่อนก็ได้ ขอแค่เป็นสัตว์ตัวเดียวกัน */
    const all = [];
    pm.pairs.forEach(it => {
      all.push(imgCard('a1',it));
      all.push(pm.mode === 'word' ? wordCard(it) : imgCard('a2',it));
    });
    $('pm-grid-a').innerHTML = shuffle(all).join('');
    $('pm-grid-b').innerHTML = '';
    [...sec.querySelectorAll('.pm-card')].forEach(c => c.addEventListener('click', () => pick(c)));
    fitGrid();                       // 📐 ย่อ/ขยายช่องให้กระดานทั้งใบพอดีจอ (กระดานใหญ่ = ภาพเล็กลง)

    const hb = $('pm-hint');
    hb.disabled = false; hb.textContent = '💡 น้องแมวช่วยตัดช้อยส์!';

    const p = has('activePet') ? activePet() : null;
    // เวลา: ตามขนาดกระดาน (+20 วิ ถ้าเลี้ยงสุนัขโตเต็มวัยไม่ป่วย — กติกาเดียวกับเกมจับคู่คำศัพท์)
    pm.total = Math.max(30,pm.pairs.length*(pm.pairs.length>20?12:15)) + ((p && p.type === 'dog' && has('abilityOn') && abilityOn(p)) ? 20 : 0);
    pm.timeLeft = pm.total;
    tickBar();
    pm.timerId = setInterval(()=>{
      pm.timeLeft--;
      tickBar();
      if(pm.timeLeft <= 0){
        clearInterval(pm.timerId);
        if(typeof sfx !== 'undefined') sfx.wrong();
        if(typeof game !== 'undefined') game.combo = 0;
        setCombo();
        if(has('toast')) toast('⏰ หมดเวลา! ลองรอบใหม่ สู้ๆ นะ');
        setTimeout(newRound, 900);
      }
    }, 1000);
    preload();   // โหลดภาพรอบถัดไปล่วงหน้า กันภาพขึ้นช้า
  }

  /* ---------- 📐 จัดกริดให้พอดีจอ (รอบ 981 · กระดานเดียวคละกันตั้งแต่รอบ 985) ----------
     เลือก "จำนวนคอลัมน์" ที่ทำให้ช่องใหญ่ที่สุด โดยการ์ดทั้งกระดานยังอยู่ในจอครบ ไม่ต้องเลื่อน
     กระดานสูงสุด 20 คู่ (40 ภาพ) จึงยังเห็นภาพใหญ่ชัด · ช่องเล็กกว่า NAME_MIN = ซ่อนป้ายชื่อ */
  function fitGrid(){
    const totalN = pm.pairs.length * 2;                  // รอบ 985: ขนาด "รอบ" ทั้งหมด (คงที่ทั้งรอบ ไม่ผันตามใบที่หายไป)
    if(!totalN || !sec || !sec.classList.contains('active')) return;
    const gA = $('pm-grid-a');
    sec.classList.toggle('big', totalN > 40);            // กระดานใหญ่ = บีบป้ายล่างเหลือบรรทัดเดียว เอาที่ไปขยายช่อง
    void gA.offsetWidth;                                 // บังคับ reflow ก่อนวัด (จอเต็มชั้น fixed — รอบ 984)
    const availW = gA.clientWidth;
    if(!availW) return;                                  // ยังไม่ได้โชว์จอ — เดี๋ยว open()/resize เรียกซ้ำ
    // 🧷 รอบ 1020: การ์ดที่จับคู่แล้วคงเป็นช่องล่องหนใน DOM → จำนวนลูกคงที่ตลอดรอบ
    // จึงรักษาจำนวนคอลัมน์ ขนาดช่อง และพิกัดของการ์ดใบอื่นไว้ตามกระดานเริ่มต้น
    const n = gA.children.length;
    if(!n) return;                                       // กระดานว่าง (เคลียร์ครบ รอ newRound ตั้งกระดานใหม่) — ข้ามคำนวณรอบนี้
    let used = 0;                                        // ความสูงของทุกอย่างที่ไม่ใช่กริด (หัว/แถบเวลา/ป้าย/โน้ต)
    [...sec.children].forEach(el=>{
      // 🐱 ปุ่มน้องแมวลอยมุมล่างขวา (position:absolute) ไม่กิน flow แล้ว → ไม่นับความสูงมาจอง
      if(!el.classList.contains('pm-grid') && el.offsetHeight && getComputedStyle(el).position !== 'absolute') used += el.offsetHeight + 6;
    });
    const availH = Math.max(60, window.innerHeight - sec.getBoundingClientRect().top - used - 10);
    const gap = totalN > 40 ? 4 : totalN > 16 ? 6 : 8;    // gap อิงขนาดรอบเดิม กันช่องกระโดดตอนใบเหลือน้อยใกล้จบ
    let best = 0, bestCols = n;
    for(let cols = 1; cols <= n; cols++){
      const rows = Math.ceil(n / cols);
      const s = Math.min((availW - gap*(cols-1)) / cols, (availH - gap*(rows-1)) / rows);
      // `>=` = ช่องใหญ่เท่ากันให้เลือกแบบที่คอลัมน์เยอะกว่า (กระดานกางเต็มความกว้างจอสวยกว่า แถวน้อยลง)
      if(s >= best){ best = s; bestCols = cols; }
    }
    let side = Math.max(24, Math.min(150, Math.floor(best)));
    const rows = Math.ceil(n / bestCols);
    const apply = s => {
      sec.style.setProperty('--pmh', s + 'px');
      sec.style.setProperty('--pmc', bestCols);
      sec.style.setProperty('--pmg', gap + 'px');
      sec.classList.toggle('tiny', s < NAME_MIN);
    };
    apply(side);
    /* คำนวณมาร์จิน/ขอบของแต่ละจอไม่ตรงเป๊ะเสมอ → วัดของจริงแล้วหดจนกระดานอยู่ในจอครบ (กฎทองข้อ 7)
       ⚠️ วัดจาก "ลูกใบล่างสุด" ไม่ใช่ตัว section — ป้ายล่างล้นออกนอก section ได้ (rect ของ section ไม่รวมส่วนที่ล้น) */
    const lowest = ()=>{
      let b = 0;
      [...sec.children].forEach(el=>{ const r = el.getBoundingClientRect(); if(r.height && r.bottom > b) b = r.bottom; });
      return b;
    };
    for(let i = 0; i < 6; i++){
      const over = lowest() - window.innerHeight;
      if(over <= 0 || side <= 24) break;
      side = Math.max(24, side - Math.max(1, Math.ceil(over / rows)));
      apply(side);
    }
  }
  window.addEventListener('resize', ()=>{ if(sec && sec.classList.contains('active')) fitGrid(); });

  let preImgs = [];
  function preload(){
    preImgs = [];
    if(pm.sheetFile){ const i=new Image(); i.src=sheetSrc(pm.sheetFile); preImgs.push(i); }
  }

  function tickBar(){
    const f = $('pm-timer');
    f.style.width = Math.max(0, (pm.timeLeft / pm.total) * 100) + '%';
    f.classList.toggle('low', pm.timeLeft <= 12);
  }
  function setCombo(){
    const n = (typeof game !== 'undefined') ? game.combo : 0;
    $('pm-combo').textContent = 'Combo ×' + n;
  }
  function setSess(add){
    if(typeof game === 'undefined') return;
    if(has('addSessionCoins')) addSessionCoins(add);   // นับรวมกับเกมจับคู่คำศัพท์ (สถิติสัปดาห์เดียวกัน)
    const el = $('pm-sess');
    if(el){
      el.textContent = (has('fmtNum') ? fmtNum(game.sessionCoins) : game.sessionCoins) + ' 🪙';
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }
  }

  /* 🗣️ ป้ายกลางบนจอ: คำอังกฤษ + ความหมายไทยของใบล่าสุดที่แตะ (แทนที่พื้นที่ว่างหลังย้ายเหรียญไปข้าง Combo) */
  function updateNow(en, th){
    pm.lastEn = en; pm.lastTh = th;
    const e = $('pm-now-en'), t = $('pm-now-th');
    if(e) e.textContent = en;
    if(t) t.textContent = th ? ' · ' + th : '';
  }
  function resetNow(){
    pm.lastEn = pm.lastTh = null;
    const e = $('pm-now-en'), t = $('pm-now-th');
    if(e) e.textContent = 'แตะภาพฟังเสียง';
    if(t) t.textContent = '';
  }
  function replayNow(){
    if(pm.lastEn) speakWord(pm.lastEn);
  }

  /* ---------- แตะภาพ ---------- */
  /* 🔀 รอบ 985: กระดานคละกันแล้ว → แตะใบไหนก่อนก็ได้ (เดิมต้องแถวบน 1 ใบ + แถวล่าง 1 ใบ)
     ใบแรกที่แตะ = sel1 · ใบที่สอง = sel2 → ตรวจทันที · แตะใบเดิมซ้ำ = ยกเลิกการเลือก */
  function pick(c){
    if(pm.checking || c.classList.contains('matched')) return;
    if(typeof sfx !== 'undefined') sfx.select();
    speakWord(c.dataset.en);                       // 🔊 เสียงอ่านชื่อสัตว์ภาษาอังกฤษ (ทุกใบในกระดาน)
    updateNow(c.dataset.en, c.dataset.th);          // 🗣️ ป้ายกลางบน: คำอังกฤษ+ความหมายไทยของใบล่าสุดที่แตะ
    if(pm.sel1 === c){ c.classList.remove('selected'); pm.sel1 = null; return; }
    if(!pm.sel1){ pm.sel1 = c; c.classList.add('selected'); return; }
    pm.sel2 = c;
    c.classList.add('selected');
    check();
  }

  /* ---------- ตรวจคู่ (สูตรรางวัลเดียวกับ checkMatch ใน js/game.js) ---------- */
  function check(){
    pm.checking = true;
    const A = pm.sel1, B = pm.sel2;
    const ok = A.dataset.key === B.dataset.key;

    if(!ok){
      if(typeof sfx !== 'undefined') sfx.wrong();
      pm.clean = false;
      if(has('vbRecord')){                          // 📒 จับผิด = ยังไม่แม่นคำนี้ → ลงสมุดทบทวน
        vbRecord(A.dataset.en, A.dataset.th, false);
        if(has('saveState')) saveState();
      }
      A.classList.add('shake'); B.classList.add('shake');
      if(typeof game !== 'undefined') game.combo = 0;
      setCombo();
      setTimeout(()=>{
        A.classList.remove('selected','shake'); B.classList.remove('selected','shake');
        pm.sel1 = pm.sel2 = null; pm.checking = false;
      }, 450);
      return;
    }

    if(typeof game !== 'undefined'){ game.combo++; game.sessionMatches++; }
    pm.matched++;
    if(typeof state !== 'undefined'){
      state.totalMatches++;
      // 🖼️ รอบ 979: แต้มสะสมตลอดกาล (state.pmScore/pmPairs/pmBoards) → แท็บใหม่ "🖼️ จับคู่ภาพ" (สูตรเดียวกับ wsScore)
      state.pmPairs = (state.pmPairs || 0) + 1;
      state.pmScore = Math.round((state.pmScore || 0) + 2);
    }
    if(has('questEvent')) questEvent('match');
    if(has('vbRecord')) vbRecord(A.dataset.en, A.dataset.th, true);

    const p = has('activePet') ? activePet() : null;
    let coins = 10, exp = 5, rp = 2; const notes = [];
    if(p && p.type === 'dragon' && has('abilityOn') && abilityOn(p) && game.combo >= 3){ coins *= 2; notes.push('🔥ไฟลุก x2'); }
    if(state.phone && !state.netCut && typeof PHONE_BONUS !== 'undefined'){ coins += PHONE_BONUS; notes.push(`📱 มือถือ +${PHONE_BONUS}`); }
    if(!p) exp = 0;
    else if(p.sick){ exp = 0; notes.push('🤒 ป่วยอยู่ ไม่ได้ EXP'); }
    else if(p.shape === 'strong' && typeof SHAPE_EXP_BONUS !== 'undefined'){ exp += SHAPE_EXP_BONUS; notes.push(`💪 ล่ำกำยำ +${SHAPE_EXP_BONUS} EXP`); }
    if(has('addCoins')) addCoins(coins);
    setSess(coins);
    if(has('addRP')) addRP(rp);

    if(has('addCraft')){                            // 🏭 แต้มผลิตโรงงาน (1 คู่ = 1 แต้ม) เหมือนจับคู่คำศัพท์
      const made = addCraft(1);
      if(made && has('showCollectReveal')) setTimeout(()=>showCollectReveal(made, null, true), 650);
      else if(state.producing && has('collectInfo')){
        const cc = collectInfo(state.producing.id);
        notes.push(`🏭 ${cc.name} ${state.producing.progress}/${cc.words}`);
      }
    }

    if(typeof sfx !== 'undefined'){ sfx.correct(); sfx.coin(); }
    const av = $('pm-avatar');
    if(av && state.playerAvatar){ av.classList.remove('cheer'); void av.offsetWidth; av.classList.add('cheer'); }
    if(has('floatFx')) floatFx(`+${coins} 🪙 +${rp} RP${exp > 0 ? ` +${exp} EXP` : ''}`, '#f2994a');
    if(game.combo >= 2 && has('floatFx')) setTimeout(()=>floatFx(`🔥 COMBO ×${game.combo}!`, '#ff6fa7'), 250);
    if(notes.length && has('toast')) setTimeout(()=>toast(notes.join(' · '), 1200), 500);

    setCombo();
    if(exp > 0 && has('addExp')) addExp(exp, p);
    $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
    if(has('saveState')) saveState();

    A.classList.remove('selected'); B.classList.remove('selected');
    A.classList.add('matched'); B.classList.add('matched');
    pm.sel1 = pm.sel2 = null; pm.checking = false;

    // 🧷 รอบ 1020: โชว์กรอบเขียวสักครู่แล้วหมุน+หดให้ล่องหน แต่คงปุ่มไว้เป็นช่องว่างในกริด
    // ห้าม remove()/fitGrid() หลังจับคู่ — การ์ดใบอื่นต้องอยู่พิกัดเดิมตลอดรอบ
    setTimeout(()=>{
      A.classList.add('gone'); B.classList.add('gone');
    }, 500);

    if(pm.matched === pm.pairs.length){
      clearInterval(pm.timerId);
      // โบนัสเคลียร์รอบคิดตามขนาดกระดาน (4 คู่ = +20🪙 +5RP · 20 คู่ = +100🪙 +25RP)
      const bCoin = pm.pairs.length * 5, bRp = Math.round(pm.pairs.length * 1.25);
      if(has('addCoins')) addCoins(bCoin);
      setSess(bCoin);
      if(has('addRP')) addRP(bRp);
      if(typeof state !== 'undefined'){   // 🖼️ รอบ 979: เคลียร์รอบ = โบนัสแต้มกระดานอันดับ (สูตรเดียวกับ WS_CLEAR_BONUS)
        state.pmBoards = (state.pmBoards || 0) + 1;
        state.pmScore = Math.round((state.pmScore || 0) + 10);
      }
      if(has('saveState')) saveState();
      $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
      // ⚡ สายฟ้าแลบ: เคลียร์ครบไม่พลาดเลยภายในเวลาที่กำหนด (เกณฑ์เดียวกับเกมจับคู่คำศัพท์ · คิดตามขนาดกระดาน)
      const thunder = pm.clean && typeof THUNDER_MS !== 'undefined'
                   && (Date.now() - pm.roundAt) <= THUNDER_MS * (pm.pairs.length / 4);
      if(thunder){
        if(has('thunderFx')) thunderFx();
        if(typeof sfx !== 'undefined') sfx.spark();
        if(has('addThunder')) addThunder();
        if(has('floatFx')) setTimeout(()=>floatFx('⚡ สายฟ้าแลบ! ไวเวอร์!', '#7fd4ff'), 200);
      }
      setTimeout(()=>{
        if(typeof sfx !== 'undefined') sfx.levelup();
        if(has('floatFx')) floatFx(`🎉 เก่งมาก! โบนัส +${bCoin} 🪙 +${bRp} RP`, '#5fc46a');
      }, thunder ? 900 : 400);
      setTimeout(newRound, thunder ? 2100 : 1600);
    }
  }

  /* ---------- ตัดช้อยส์ (แมวโตเต็มวัย) — ไฮไลต์คู่ที่ถูก 1 คู่ ---------- */
  function hint(){
    if(pm.hintUsed) return;
    const left = [...sec.querySelectorAll('.pm-card:not(.matched)')];
    if(!left.length) return;
    const a = left[Math.floor(Math.random() * left.length)];
    // รอบ 985: คู่ของมันอยู่ในกระดานเดียวกัน = ใบอื่นที่ key ตรงกัน
    const b = left.find(c => c !== a && c.dataset.key === a.dataset.key);
    pm.hintUsed = true;
    const hb = $('pm-hint');
    hb.disabled = true; hb.textContent = '💡 ใช้ไปแล้วรอบนี้';
    if(typeof sfx !== 'undefined') sfx.coin();
    a.classList.add('hint-glow'); if(b) b.classList.add('hint-glow');
    setTimeout(()=>{ a.classList.remove('hint-glow'); if(b) b.classList.remove('hint-glow'); }, 2500);
  }

  /* ---------- กลับสารบัญ / ออก Lobby ---------- */
  function backToChooser(){
    if(!pm.choosing) showChooser();
  }
  function lobbyBack(){
    if(has('renderDashboard')) renderDashboard();
    showScreen('screen-dashboard');
  }
  function leaveLobby(){
    clearInterval(pm.timerId);
    lobbyBack();
  }

  /* ---------- ออกจากเกม (API เดิมยังคงสรุปรางวัลก่อนกลับ Lobby) ---------- */
  function exit(){
    clearInterval(pm.timerId);
    const earned = (typeof game !== 'undefined') ? game.sessionCoins : 0;
    const matches = (typeof game !== 'undefined') ? game.sessionMatches : 0;
    const back = lobbyBack;
    if(earned <= 0 || !has('showSessionSummary')){ back(); return; }
    if(has('feedEvent')) feedEvent('coin', `จับคู่ภาพได้ ${has('fmtNum') ? fmtNum(earned) : earned} เหรียญ (${matches} คู่) 🖼️`);
    const isRecord = earned > (game.prevBest || 0);
    const allTime  = isRecord && earned > (game.prevAllBest || 0);
    showSessionSummary(earned, matches, isRecord, allTime, back, ()=>open());
  }

  /* ---------- ปุ่มเข้าเกม (ล็อบบี้เดิม) + Esc = ออก ---------- */
  function bind(){
    const b = $('btn-picmatch');
    if(b) b.addEventListener('click', ()=>{ if(has('closePanel')) closePanel(); open(); });
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && sec && sec.classList.contains('active')){
        if(pm.choosing) leaveLobby(); else backToChooser();
      }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();

  window.PicMatch = { open, exit, _t:{ pm, newRound, check, pick, take, showChooser, chooseSheet, sheetItems, pageSize, cleanRect, get queue(){ return queue; }, bank } };
})();
