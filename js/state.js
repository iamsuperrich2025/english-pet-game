"use strict";
/* ============================================================
   STATE + LocalStorage + กติกากลางของเกม
   (แยกจากไฟล์ data — อัปเกรดคำศัพท์/สัตว์/ไอเทมได้โดยไม่กระทบเซฟ)
   ============================================================ */
const STORAGE_KEY = 'petVocabAdventure_v1';

/* 🎁 รอบ 593 (ผู้ใช้สั่ง): รางวัล "สอบผ่านครั้งแรก" ของทุกหมวด/ทุกชุด 10 ข้อ = 500 (เดิม 100)
   ค่าจริงอยู่ที่ `reward:` ใน js/data/vocab.js + BAND_SET_REWARD ใน js/dictband.js — ค่านี้ใช้เป็น
   "เลขรุ่นรางวัล" สำหรับจ่ายย้อนหลัง (state.quizRewardVer) เท่านั้น แก้ที่ไหนต้องแก้ให้ตรงกันทั้ง 3 ที่ */
const QUIZ_PASS_REWARD = 500;

const CURE_COST      = 100;                // 🩹 รอบ 236: ลด 1000→100 (ตายในโลก 3D บ่อย เงินหมดไว ไม่สนุก)
const HUNGRY_SICK_MS = 2*60*60*1000;       // หิวเกิน 2 ชม. (ถึง 20:00) ยังกินไม่เต็มหลอด → ป่วย
/* คิว 7725691507 กลุ่ม A (ข้อ 1,2,3,6) */
const MEAL_HOUR       = 18;                // ข้อ 2+6: มื้อเย็นวันละครั้ง 18:00 (ทั้งสัตว์และคน)
const MEAL_FULL       = 100;               // ข้อ 3: ต้องกินสะสมความอิ่มครบ 100 ถึงนับว่าอิ่มมื้อนี้
const SLEEP_FROM_HOUR = 20;                // ข้อ 1: พาสัตว์เข้านอนได้ตั้งแต่ 20:00
const SLEEP_SICK_HOUR = 23;                // ข้อ 1: ถึง 23:00 ยังไม่นอน → ป่วย (ครั้งเดียวต่อคืน)
const WAKE_HOUR       = 6;                 // ข้อ 1: ตื่นนอนอัตโนมัติ 06:00
const DINNER_COST     = 200;               // ข้อ 6: ค่าข้าวเย็นของผู้เล่น (เมนูคนจริงมากลุ่ม B)
/* คิว 7725691507 ข้อ 5.1 (กลุ่ม B): พิษสะสมจากอาหารคนที่เป็นโทษกับสัตว์ */
const TOXIN_FULL     = 100;                // พิษสะสมครบ 100 → ป่วยทันที cause 'toxin'
const DETOX_COST     = 1000;               // ค่าขับพิษ (ล้างบาร์พิษก่อนป่วย) — พิษไม่ลดเอง
/* ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1): ทายว่าอาหารไหนให้สัตว์กินได้ — รางวัลรอบแรกของวัน */
const FOODQUIZ_Q     = 5;                  // จำนวนข้อต่อรอบ
const FOODQUIZ_COIN  = 10;                 // เหรียญต่อข้อที่ถูก (เท่าจับคู่ถูก 1 คำ)
const FOODQUIZ_BONUS = 25;                 // โบนัสตอบถูกครบทุกข้อ
const FOODQUIZ_MAX_PLAYS = 2;              // จำกัดจำนวนรอบที่เล่นได้ต่อวัน (รอบแรก=ได้รางวัล รอบสอง=ฝึกซ้อม)
/* คิว 7725691507 ข้อ 5.2: รูปร่างสัตว์ตามคุณภาพการกิน (ภาพ <pet>_adult_fat/thin/strong.png) */
const SHAPE_JUNK_MEALS  = 3;               // กินอาหารโทษติดกันกี่มื้อ → อ้วน
const SHAPE_CLEAN_MEALS = 3;               // กินสะอาดเต็มหลอดติดกันกี่มื้อ → ล่ำกำยำ
const SHAPE_MISS_MEALS  = 2;               // อดข้าว (ป่วยเพราะหิว) กี่มื้อ → ผอมโซ
const SHAPE_EXP_BONUS   = 2;               // ร่างล่ำ: EXP แถมต่อคำที่จับคู่ถูก
const HEAT_SICK_MS   = 6*60*60*1000;       // ร้อนสะสมครบ 6 ชม. → ป่วย (ยกเว้นมังกร/มีแอร์)
const THIRST_SICK_MS = 6*60*60*1000;       // ถูกตัดน้ำ: ขาดน้ำสะสมครบ 6 ชม. → ป่วย (โดนทุกชนิด)

const DEFAULT_STATE = {
  student:null,                       // {grade} (รอบ 187 คุ้มครองเด็ก: เลิกเก็บ first/last · เหลือ grade ไว้เลือกความยากคำศัพท์)
  /* 🔒 รอบ 647: ล็อกการเปลี่ยนระดับชั้น (กันเด็กลดชั้นเพื่อทำคำง่าย ๆ ปั๊มเหรียญ) — กติกาอยู่ใน js/gradelock.js */
  gradeSetAt:0,                       // เวลาที่ "เปลี่ยนชั้น" ครั้งล่าสุด (0 = ยังไม่เคยเปลี่ยน เปลี่ยนได้เลย · ตอนสมัครไม่นับเป็นการเปลี่ยน)
  gradeHist:[],                       // ประวัติชั้นทั้งหมดเรียงเก่า→ใหม่ [{g:'ป.3', at:ts}] — ตัวแรก = ชั้นที่เลือกตอนสมัคร
  profileName:null,                   // ชื่อในเกม (ข้อ 0.2 — ผ่านตัวกรอง badwords แล้ว โชว์ใน presence/leaderboard)
  playerAvatar:null,                  // ข้อ 4: ตัวละครผู้เลี้ยง 'male'/'female' (เลือกตอนลงทะเบียน · เปลี่ยนได้ในตั้งค่า · โชว์เฉพาะในเครื่อง)
  blockAv:null,                       // 🧱 ตัวละครบล็อกในโลก 3D 'blk1'..'blk8' (เลือกก่อนเข้าโลกขับรถ · เพื่อนใน map เห็นตัวนี้)
  profAv:null,                        // 🖼️ รอบ 751: รูปโปรไฟล์/ตัวยืนในล็อบบี้ 'blk1'..'blk88' (blk9+ = ภาพ 2D อย่างเดียว ไม่มีโมเดลในโลก 3D)
  advTicket:false,                    // ข้อ 7: การ์ดตั๋วโลกผจญภัย (ซื้อได้เมื่อมีสัตว์โตเต็มวัย · ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้)
  advDone:[],                         // ข้อ 8: คำที่ประกอบสำเร็จแล้วในโลกผจญภัย 3D (ไม่สุ่มซ้ำ · ครบทุกคำของระดับชั้นแล้วล้างเริ่มรอบใหม่)
  advHurt:false,                      // ข้อ 8: พลังหมด/โดนผีจับ → ต้องจ่ายค่ารักษา CURE_COST ก่อนเข้าโลก 3D ใหม่ (ใช้ร่วม 2 โลก)
  hauntTicket:false,                  // ตั๋วโลกผีสิงกลางคืน (ซื้อได้เมื่อมีตั๋วโลกผจญภัย · เฉพาะตัวเหมือนกัน)
  hauntDone:[],                       // คำที่ประกอบสำเร็จแล้วในโลกผีสิง (แยกจาก advDone)
  hauntSurviveBest:0,                 // ⏱ รอบ 256: สถิติหนีผีรอดนานสุด (วินาที · โชว์ HUD โลกผี + การ์ดผู้เล่น field hs)
  heliTicket:false,                   // ตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 51 · ซื้อได้เมื่อมีตั๋วโลกผจญภัย)
  heliDone:[],                        // คำที่ประกอบสำเร็จแล้วในโลกเฮลิคอปเตอร์ (แยกคลังต่อโลก)
  heliStreak:0,                       // รอบ 62: สตรีคประกอบคำในโลกเฮลิฯ โดยไม่ชนเลย (สะสมข้ามรอบ · ชน/กระแทกแรง = รีเซ็ต)
  pilotBadge:0,                       // รอบ 62: เข็มนักบินสูงสุดที่เคยได้ 0=ยังไม่มี 1=🥉(สตรีค 5) 2=🥈(15) 3=🥇(30) — ได้แล้วไม่หาย โชว์ท้ายชื่อใน map
  droneTicket:false,                  // รอบ 85: ตั๋วโลกโดรน FPV Racing (ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์)
  droneDone:[],                       // คำที่ประกอบสำเร็จแล้วในโลกโดรน (แยกคลังต่อโลก)
  driveTicket:false,                  // รอบ 113: ตั๋วโลกขับรถกำแพงเพชร (ซื้อได้เมื่อมีตั๋วโดรน)
  driveDone:[],                       // คำที่ประกอบสำเร็จแล้วในโลกขับรถ (แยกคลังต่อโลก)
  soccerTicket:false,                 // รอบ 196: ตั๋วโลกสนามฟุตบอล (ซื้อได้เมื่อมีตั๋วขับรถ)
  soccerDone:[],                      // คำที่ประกอบสำเร็จแล้วในโลกฟุตบอล (แยกคลังต่อโลก)
  soccerShirt:0xe53935,               // สีเสื้อนักเตะที่เลือกล่าสุด
  soccerNo:'10',                      // เบอร์หลังเสื้อที่เลือกล่าสุด
  invasionTicket:false,               // 🛸 รอบ 413: ตั๋วโลกยานแม่บุกโลก (ซื้อได้เมื่อมีตั๋วมอเตอร์ไซค์)
  invasionDone:[],                    // คำที่พิชิตในโลกยานแม่บุกโลก (แยกคลังต่อโลก)
  invasionBest:0,                     // ยานแม่ที่ปราบได้มากสุดในรอบเดียว (สถิติส่วนตัว)
  robots:[],                          // รอบ 199: หุ่นยนต์นักรบที่ครอบครอง (array ของ id · ซื้อกี่ตัวก็ได้)
  mechaRobot:null,                    // หุ่นที่เลือกใช้ล่าสุดในโลก 3D
  mechaDone:[],                       // คำที่พิชิตในโลกหุ่นยนต์ (แยกคลังต่อโลก)
  mechaBoss:0,                        // รอบ 228: จำนวนบอสที่ล้มสะสม (ขึ้นกระดานออนไลน์ 🤖)
  mechaBossBadge:0,                   // รอบ 229: เข็มนักล่าบอสสูงสุดที่เคยได้ 0=ไม่มี 1=⚔️(3) 2=🛡️(10) 3=🤖(25) — ได้แล้วไม่หาย โชว์ท้ายชื่อ
  mechaWaveBest:0,                    // รอบ 229: เวฟสูงสุดที่เคยไปถึงในโลกหุ่น (Endless Wave) — สถิติส่วนตัว
  wsScore:0,                          // 🔎 รอบ 590: แต้มสะสมตลอดกาลเกมค้นหาคำ (ขึ้นกระดานอันดับ field ws)
  wsWords:0,                          // 🔎 รอบ 590: จำนวนคำที่หาเจอทั้งหมด (โชว์ใต้ชื่อในกระดาน)
  wsBoards:0,                         // 🔎 รอบ 590: กระดานที่เล่นจบครบทุกคำ (โบนัสจบใบ WS_CLEAR_BONUS)
  tpUsed:[],                          // ⌨️ รอบ 648: คำที่พิมพ์สำเร็จแล้วในเกมพิมพ์คำศัพท์ — กติกา "คำห้ามซ้ำ" (หมดคลัง = ล้างแล้ววนใหม่)
  tpScore:0,                          // ⌨️ รอบ 649: แต้มสะสมตลอดกาลเกมพิมพ์คำ (ขึ้นกระดานอันดับ field tp)
  tpWords:0,                          // ⌨️ รอบ 649: จำนวนคำที่พิมพ์สำเร็จทั้งหมด (ไม่ล้างตอน tpUsed วนรอบใหม่)
  wsAwardSeen:'',                     // 🏆 รอบ 592: เดือนล่าสุดที่เช็ก/จ่ายรางวัลแล้ว ('YYYY-MM') — กันยิง DB ซ้ำ
  wsAwardPaid:[],                     // 🏆 รอบ 592: เดือนที่รับเหรียญรางวัลไปแล้ว (กันจ่ายซ้ำข้ามเครื่อง)
  wsAwardLog:[],                      // 🏆 รอบ 592: ประกาศรางวัลของตัวเอง [{m,r,p,s,at}] โชว์ในกระดานข้อความ
  typistBadge:0,                      // ⌨️ รอบ 654-655: เข็มนักพิมพ์สูงสุดที่เคยได้ 0=ไม่มี 1=⌨️(100 คำ) 2=🔠(500) 3=📜(1000) 4=✒️(3000) 5=🦾(10000) — ได้แล้วไม่หาย
  tpAwardSeen:'',                     // 🏆 รอบ 649: เหมือน wsAward* ทุกอย่าง แต่ของกระดาน ⌨️ พิมพ์คำ
  tpAwardPaid:[],
  tpAwardLog:[],
  rankSeen:0,                         // 🥇 รอบ 599: อันดับเหรียญที่เห็นล่าสุด (0=ยังไม่เคยติดกระดาน) — เลขใหม่น้อยกว่า = ไต่ขึ้น → ป้ายบนปุ่มรางเด้งฉลอง
  rankBest:0,                         // 🏅 รอบ 602: อันดับดีที่สุดที่เคยทำได้ (เลขน้อยสุด · 0=ยังไม่เคยติด) — โชว์ในหน้าสถิติ ไม่ลดลงเมื่ออันดับตก
  cars:[],                            // 🚗 รอบ 211: รถส่วนตัวหลายคัน — [{id:'car_01'..'car_10', insured:bool, loan:null|{remain,perMonth,month,paid,carry}}]
  carIdx:0,                           //    คันที่เลือกใช้ขับตอนนี้ (index ใน cars) · myCar()=คันปัจจุบัน · ตั๋ว=สิทธิ์เข้าเมือง รถ=พาหนะ · loan.carry=งวดค้าง (>0=ล็อกขับ)
  glassCount:0,                       // รอบ 337: จำนวนบานกระจกที่ทุบแตกในโลกโดรน — สู่เข็มจอมทุบกระจก
  glassBadge:0,                       // รอบ 337: เข็มจอมทุบกระจกสูงสุดที่เคยได้ 0=ไม่มี 1=🪟(20) 2=💥(50) 3=🥽(100) — ได้แล้วไม่หาย
  daredevilCount:0,                   // รอบ 87: จำนวน "บินเฉียดสุดๆ" สะสม (heli/drone) — สู่เข็มนักบินผาดโผน
  daredevilBadge:0,                   // รอบ 87: เข็มนักบินผาดโผนสูงสุดที่เคยได้ 0=ไม่มี 1=🎯(10) 2=🌀(30) 3=🔥(60) — ได้แล้วไม่หาย โชว์ท้ายชื่อ
  thunderCount:0,                     // รอบ 70: สายฟ้าแลบสะสม (จับคู่ครบไม่พลาดใน 5 วิ / สอบสายฟ้า)
  thunderBadge:0,                     // รอบ 70: เข็มสายฟ้าสูงสุดที่เคยได้ 0=ไม่มี 1=⚡(5 ครั้ง) 2=🌩️(15) 3=⛈️(30) — ได้แล้วไม่หาย โชว์ท้ายชื่อใน map
  diligentCount:0,                    // รอบ 105: จำนวน "รอบเล่นต่อ" สะสมถาวร (กดเล่นต่ออีกรอบในเกมจับคู่) — สู่เข็มนักเล่นขยัน
  diligentBadge:0,                    // รอบ 105: เข็มนักเล่นขยันสูงสุดที่เคยได้ 0=ไม่มี 1=🏅(20 รอบ) 2=🎖️(50) 3=🏆(100) — ได้แล้วไม่หาย โชว์ท้ายชื่อใน map
  patStreak:0,                        // รอบ 323: จำนวนวันติดต่อกันที่ "ลูบยาว" น้อง (นับวันละครั้ง · ขาดวัน = เริ่มใหม่)
  patStreakDay:'',                    // รอบ 323: วันล่าสุดที่นับสตรีคลูบยาวไปแล้ว (todayStr)
  patStreakBest:0,                    // รอบ 323: สตรีคยาวสุดที่เคยทำได้ (โชว์ในตู้เข็ม)
  patDays:[],                         // รอบ 325: วันที่ลูบยาว 30 วันล่าสุด ['YYYY-MM-DD'] — ปฏิทินจุดในหน้าโปรไฟล์น้อง
  bffBadge:0,                         // รอบ 323: เข็มเพื่อนซี้สูงสุดที่เคยได้ 0=ไม่มี 1=🐾(7 วัน) 2=💞(30) 3=🫶(100) — ได้แล้วไม่หาย
  crownBadge:0,                       // รอบ 109: เข็มลับ 👑 "นักสะสมเข็ม" — ได้เมื่อมีเข็มครบทั้ง 4 สาย (นักบิน+สายฟ้า+ผาดโผน+ขยัน) · โชว์นำหน้าชื่อ
  badgeWeekKey:'',                    // รอบ 109: คีย์สัปดาห์ (วันจันทร์) ที่เริ่มนับแต้มเข็มรายสัปดาห์
  badgeWeekStartScore:0,              // รอบ 109: แต้มเข็มรวมตอนต้นสัปดาห์นี้ (ไว้คิดว่าสัปดาห์นี้เก็บเพิ่มกี่แต้ม)
  badgeWeekHist:[],                   // รอบ 109: ประวัติแต้มเข็มที่เก็บเพิ่มรายสัปดาห์ [{wk,gain}] เก็บ 8 สัปดาห์ล่าสุด (กราฟในตู้เข็ม)
  tinvClaimed:{},                     // ส่วนลดชวนเพื่อน: {adv:true, haunt:true} = รับเงินคืน 2,000 ของ map นั้นไปแล้ว (ครั้งเดียว/map)
  tinvSent:{},                        // คำเชิญที่เราส่งออก: {toUid:{map,ts}} (ฝั่งรับดูจาก DB /tinv — ฝั่งส่งจำในเซฟ)
  voiceSpk:true,                      // voice chat ในโลก 3D: เปิดลำโพง (ได้ยินคนอื่น) — จำข้ามรอบ
  voiceMode:'all',                    // voice chat: 'all'=คุยทุกคนใน map · 'friends'=เฉพาะเพื่อนที่ invite กันใน map นั้น (ไมค์ไม่จำ — ปิดทุกครั้งที่เข้า เพื่อความปลอดภัยเด็ก)
  quizLog:[],                         // ประวัติสอบ: {cat, score, total, passed, ts}
  vocabBook:{},                       // 📒 รอบ 288: สมุดคำศัพท์ของฉัน — {en:{th,c:ถูก,w:ผิด,t:เจอล่าสุด,lw:ล่าสุดผิด?}} เก็บจากเกมจับคู่+ข้อสอบทุกแบบ (เพดาน VB_MAX ใน vocabbook.js)
  quizPassed:[],                      // หมวดที่เคยผ่านแล้ว (รางวัลใหญ่ครั้งแรกครั้งเดียว)
  certs:[],                           // 🎖️ รอบ 712: ใบประกาศที่ได้รับ {id,th,t,lv,sc,tt,ts,n} 1 ใบ/หมวด (ดู js/cert.js · เพดาน CERT_MAX)
  certsFilled:false,                  // 🎖️ รอบ 712: ออกใบย้อนหลังจาก quizLog ให้เซฟเก่าไปแล้วหรือยัง (certBackfill)
  quizRewardVer:QUIZ_PASS_REWARD,     // 🎁 รอบ 593: รางวัลสอบผ่านที่เซฟนี้ "เคยได้จริง" ต่อหมวด — น้อยกว่าค่าปัจจุบัน = จ่ายส่วนต่างย้อนหลังตอนโหลด
  quizBackPay:null,                   // ใบแจ้งจ่ายย้อนหลังที่ยังไม่ได้โชว์ {n,per,total,from,to,ts} (bootGame เด้งป๊อปอัพแล้วล้าง)
  giantRemoved:false,                 // 🦣 รอบ 659: เคยผ่าน migration ถอดโหมดขยายร่าง+คืนเงินแล้วหรือยัง (กันคืนซ้ำ)
  giantRefund:null,                   // ใบแจ้งคืนเงินร่างยักษ์ที่ยังไม่ได้โชว์ {total,ts} (bootGame เด้งป๊อปอัพแล้วล้าง)
  rp:0,                               // Rank Points
  coins:0,
  daily:{date:'', coins:0},           // เหรียญที่หาได้ "วันนี้" (ไว้แคปส่งครู)
  sound:true, haptic:true, noAnim:false, totalMatches:0,
  bestSessionCoins:0,                 // 🏆 สถิติเหรียญที่เก็บได้มากสุดในการเล่นเกมจับคู่ "ครั้งเดียว" ตลอดกาล (โชว์ในรายงาน)
  weekBestCoins:0,                    // 🗓️ สถิติเหรียญ/ครั้ง เฉพาะ "สัปดาห์นี้" (รีเซ็ตทุกวันจันทร์) — เป้าในเกมให้ทำลายใหม่ได้เรื่อยๆ ไม่ตัน
  weekKey:'',                         // คีย์สัปดาห์ (วันจันทร์ YYYY-MM-DD) ที่ weekBestCoins กำลังนับอยู่
  lifetimeCoins:0,                    // 🪙 เหรียญที่ "หาได้" สะสมตลอดการเล่น (ไม่หักตอนจ่าย) — เริ่มนับตั้งแต่รอบ 95 · ไว้โชว์รายงานความก้าวหน้า
  owned:[],                           // ไอเทมที่ซื้อแล้ว (ตู้เสื้อผ้ารวม ใช้ได้ทุกตัว)
  pets:[],                            // สัตว์ที่เลี้ยงอยู่ทั้งหมด (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
  active:0,                           // ตัวที่กำลังดูแลอยู่
  home:null,                          // 'basic' | 'medium' | 'castle'
  ac:false,                           // ติดแอร์แล้ว (สำหรับบ้าน medium)
  bills:{},                           // บิลรายเดือน: {maint:{month:'YYYY-MM', due, paid}, ...} (ค่าไฟ/น้ำ/เน็ต/ขยะ เสียบเพิ่มได้ · trash มี field fine สะสมค่าปรับ)
  petFoodPaidMonth:'',                // 🍖 เดือนล่าสุด (YYYY-MM) ที่จ่ายเงินค่าอาหารสัตว์รายเดือนไปแล้ว (กันจ่ายซ้ำ)
  petFoodWarnMonth:'',                // 🍖 เดือน (YYYY-MM ของวันที่ 1 ถัดไป) ที่เตือนล่วงหน้าไปแล้ว (กันเตือนซ้ำ)
  pendingRuin:null,                   // บ้านเพิ่งพัง (id บ้าน) — ให้ UI โชว์ฉากบ้านพังแล้วเคลียร์
  pendingCut:[],                      // บริการเพิ่งถูกตัด (['elec','water'...]) — ให้ UI เด้งกล่องเตือนแล้วเคลียร์
  powerCut:false,                     // ถูกตัดไฟ (ค้างค่าไฟข้ามเดือน) — บ้านมืด แอร์ใช้ไม่ได้
  transformerBought:false,            // ซื้อหม้อแปลงใหม่แล้ว รอจ่ายบิลค้างเพื่อให้ไฟกลับมา
  waterCut:false,                     // ถูกตัดน้ำ (ค้างค่าน้ำข้ามเดือน) — สัตว์ขาดน้ำจนป่วย
  plumbingBought:false,               // จ่ายค่าติดตั้งระบบน้ำใหม่แล้ว รอจ่ายบิลค้างเพื่อให้น้ำกลับมา
  phone:false,                        // มีมือถือ (โบนัสจับคู่ +5/ข้อ · ค่าเน็ต 1,000/เดือน)
  netCut:false,                       // ถูกตัดเน็ต (ค้างค่าเน็ตข้ามเดือน) — โบนัสมือถือระงับ
  farm:[],                            // ต้นไม้ที่ปลูกอยู่: {id:'orange'..., plantedAt:ts} ไม่จำกัดจำนวน
  fruitMkt:{},                        // 📊 อุปทานตลาดผลไม้ต่อชนิด {orange:{s,at}} — ขายถี่ราคาตก ฟื้นเองตามเวลา (รอบ 395)
  computer:false,                     // มีคอมพิวเตอร์ (รายได้ +0.01 เหรียญ/วิ · ค่าบริการข้อมูล 5,000/เดือน)
  compSince:null,                     // timestamp ที่ตกเหรียญรายได้คอมครั้งล่าสุด (เศษวินาทีสะสมต่อจากนี้)
  compEarned:0,                       // เหรียญที่คอมทำให้ทั้งหมด (ไว้โชว์)
  dataCut:false,                      // ถูกตัดบริการข้อมูล (ค้างข้ามเดือน) — รายได้คอมหยุดนิ่ง
  onlineSince:null,                   // item 8: timestamp เริ่มนับรายได้ออนไลน์ช่วงปัจจุบัน (รีเซ็ต null ทุกครั้งที่โหลดเกม — นับเฉพาะเวลาเปิดเกมจริง)
  onlineEarned:0,                     // item 8: เหรียญโบนัสออนไลน์สะสมทั้งหมด (ไว้โชว์ตัวเลขวิ่ง+สถิติ)
  quests:null,                        // item 3: ภารกิจรายวัน {date, prog:{id:n}, done:[id], allDone} — questTick สร้างให้เอง
  wishlist:[],                        // รอบ 126: id สินค้าสะสมที่เล็งไว้ — มีคนลงขายในตลาดจริง → แจ้งเตือน
  collection:[],                      // สินค้าที่ถือครอง (array of id — มีชิ้นซ้ำได้)
  listings:[],                        // ของที่ลงขายในตลาดอยู่: {id, price, listedAt}
  tradeSold:[],                       // ของที่ลูกค้ามาซื้อไปแล้ว รอผู้เล่นกดรับทราบ: {id, price, ts}
  producing:null,                     // งานผลิตในโรงงาน: {id, progress} (ตอบคำศัพท์ถูก 1 คำ = progress +1)
  producedCount:0,                    // จำนวนสินค้าที่ผลิตสำเร็จทั้งหมด (โชว์ในสถิติ)
  orders:[],                          // ออเดอร์พิเศษจากลูกค้าจำลอง: {key, id, buyer, grade, payout, expireAt}
  nextOrderAt:0,                      // เวลาที่ออเดอร์ใหม่จะเข้ามา (orderTick)
  rankKey:null,                       // key แรงค์ล่าสุดที่ฉลองไปแล้ว (ไว้เทียบเลื่อน/ลด — ดู refreshRank)
  onlineId:null,                      // id ประจำเครื่องสำหรับระบบออนไลน์ (สุ่มครั้งเดียวใน online.js)
  savedAt:0,                          // เวลาเซฟล่าสุด (ไว้เทียบเซฟเครื่อง vs cloud — ดู auth.js)
  ownerUid:null,                      // uid บัญชี Google เจ้าของเซฟนี้ (null = เซฟเก่ายังไม่ผูกบัญชี)
  chatSeen:{},                        // pairId → ts ข้อความล่าสุดที่อ่านแล้ว (ไว้แจ้งเตือนข้อความใหม่ ข้อ 0.4)
  nwQueue:[],                         // รอบ 326: คิวคำศัพท์ 🆕 New Word ที่ยังไม่ได้โชว์ (สลับลำดับแล้ว) — หมดคิว = สลับใหม่
  nwReadDay:'',                       // รอบ 329: วันที่กำลังนับ "อ่านคำใหม่กี่คำ" (todayStr)
  nwReadCount:0,                      // รอบ 329: อ่านคำใหม่ไปกี่คำแล้ววันนี้ (ครบ NW_DAILY_GOAL รับโบนัส)
  nwBonusDay:'',                      // รอบ 329: วันที่รับโบนัสอ่านครบไปแล้ว (กันรับซ้ำ)
  patRemindDay:'',                    // รอบ 328: วันที่เตือน "ยังไม่ได้ลูบน้อง" ไปแล้ว (เตือนวันละครั้งตอนเย็น)
  nwPaidAt:0,                         // รอบ 327: nwAt ของคำที่รับเหรียญไปแล้ว (กดอ่านซ้ำคำเดิมไม่ได้เหรียญซ้ำ)
  nwAt:0,                             // รอบ 326: เวลาที่เปลี่ยนคำล่าสุด (เปลี่ยนทุก 2 นาทีระหว่างอยู่ Lobby)
  greetSent:{},                       // รอบ 325: {uid: 'YYYY-MM-DD'} วันล่าสุดที่ส่ง "ทักทายน้อง" ให้แต่ละคน (จำกัดคนละ 1/วัน)
  giftBox:[],                         // ของขวัญที่ "รับ" ไว้ (ข้อ 0.5): {k:'shop'|'collect', id, from, fn:ชื่อผู้ส่ง, ts} — ขายต่อ/ส่งต่อไม่ได้ ไม่รวม assetValue
  playerFedDay:'',                    // ข้อ 6: mealDayKey ของมื้อเย็นที่ผู้เล่น (คน) กินแล้ว
  foodQuizDay:'',                     // ควิซอาหารปลอดภัย: วัน (toDateString) ที่รับรางวัลรอบแรกไปแล้ว (เล่นซ้ำได้แต่ไม่ได้เหรียญ)
  foodQuizPlayDay:'',                  // ควิซอาหารปลอดภัย: วัน (toDateString) ที่นับจำนวนรอบที่เล่นอยู่
  foodQuizPlayCount:0,                 // ควิซอาหารปลอดภัย: เล่นไปแล้วกี่รอบในวันนั้น (เพดาน FOODQUIZ_MAX_PLAYS)
  testerCoinDay:'',                   // 🧪 รอบ 163: วัน (toDateString) ที่เติมเหรียญผู้ทดสอบรอบวันนี้ไปแล้ว (เติมวันละครั้ง — ดู testerBoost ใน auth.js)
  spellDay:'',                        // 🌀 รอบ 174: วัน (toDateString) ของตัวนับเกมสะกดคำรายวัน
  spellWords:0,                       // 🌀 รอบ 174: จำนวนคำสะกดสำเร็จวันนี้ (5 คำแรกรางวัลเต็ม — ดู spellDayLeft ใน lobby3d.js)
  musicMode:'all',                    // 🎵 รอบ 181: โหมดวิทยุในรถ 'all'|'one'|'shuffle' (music.js)
  musicOff:false,                     // 🎵 รอบ 184: ปิดเพลงพื้นหลัง (ปุ่ม 🎵 ใน Lobby · แยกจากสวิตช์เสียง)
  playerSick:false,                   // ข้อ 6: ผู้เล่นป่วยเพราะไม่กินข้าวเย็น — จ่ายค่ารักษา 1,000 ถึงหาย
  playerSickDay:'',                   // ข้อ 6: mealDayKey ที่ป่วยไปแล้ว (กันป่วยซ้ำมื้อเดียวกันหลังรักษา)
  playerSickPending:false,            // ข้อ 6: เพิ่งป่วย รอ UI เด้งกล่องแจ้งครั้งเดียว
  feedShare:{coin:true, quiz:true, goods:true, other:true, assets:true},
                                      // 📰 รอบ 155 (default เปิดทุกหมวดตั้งแต่รอบ 565): หมวดกิจกรรมที่ยอมรายงานขึ้น profile/feed — ปิดเองได้ทีหลังในตั้งค่า
  follows:{},                         // 📰 รอบ 155: คนที่เรา follow {uid:{n:ชื่อ, g:ชั้น, ts}} — feed หน้า lobby รวมกิจกรรมของคนกลุ่มนี้
};

/* 📰 รอบ 155: หมวดกิจกรรมที่รายงานได้ (ใช้ร่วม settings/profile/feed) */
const FEED_CATS = {
  coin:  {e:'🪙', n:'ได้เหรียญพิเศษ',      d:'รางวัลภารกิจ/โบนัสก้อนพิเศษ/เหรียญจากจับคู่คำศัพท์'},
  quiz:  {e:'📝', n:'ผ่านการทดสอบ',        d:'สอบหมวดคำศัพท์ผ่าน'},
  goods: {e:'📦', n:'ได้สินค้าเพิ่ม',       d:'ผลิตสำเร็จ/ซื้อของ/ได้ของขวัญ'},
  other: {e:'✨', n:'ความเคลื่อนไหวอื่นๆ', d:'เลื่อนแรงค์/รับน้องใหม่'},
  assets:{e:'🏆', n:'เปิดเผยทรัพย์สิน',    d:'โชว์คลังสินค้าสะสมเป็นตารางในโปรไฟล์'},
};

/* ============================================================
   👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
   🌟 จุดที่เป็น "ตัวเรา" ไม่ใช่ Facebook: ทุกรีแอ็กชัน/คอมเมนต์ด่วน = คำอังกฤษจริง
   พร้อมคำแปลไทย → เด็กได้คำศัพท์ติดตัวทุกครั้งที่แสดงความรู้สึกกับเพื่อน
   k = ค่าที่เก็บลง /gfeed/<pid>/lk/<uid> (rules เดิมรับแค่ true → ถอยเป็นไลก์ธรรมดาเอง)
   ============================================================ */
const FEED_REACTIONS = [
  {k:'like', e:'👍', en:'Good!',    th:'เยี่ยม'},
  {k:'love', e:'❤️', en:'Love it!', th:'รักเลย'},
  {k:'haha', e:'😆', en:'Funny!',   th:'ตลกจัง'},
  {k:'wow',  e:'😮', en:'Wow!',     th:'ว้าว'},
  {k:'star', e:'🌟', en:'Awesome!', th:'สุดยอด'},
  {k:'care', e:'🤗', en:'Nice!',    th:'น่ารักจัง'},
];
function feedRx(k){ return FEED_REACTIONS.find(r=>r.k === k) || FEED_REACTIONS[0]; }
/* คอมเมนต์ด่วน — เด็กที่ยังพิมพ์ไม่คล่องแตะส่งได้เลย (ได้ประโยคอังกฤษจริงติดตัว) */
const FEED_QUICK_CM = [
  {en:'Well done!', th:'ทำได้ดีมาก'},
  {en:'Congrats!',  th:'ยินดีด้วย'},
  {en:'So cool!',   th:'เจ๋งมาก'},
  {en:'Nice one!',  th:'เยี่ยมไปเลย'},
  {en:'Amazing!',   th:'น่าทึ่ง'},
  {en:'Keep going!',th:'สู้ต่อไป'},
];

/* ---------- มื้ออาหาร (ข้อ 2): หิวมื้อเย็นวันละครั้ง เวลา 18:00
   slot = เวลา 18:00 ของมื้อล่าสุด · กินสะสมความอิ่มครบ 100 (ข้อ 3) → fedUpTo = slot
   feast เต็มหลอด + fedUpTo = มื้อพรุ่งนี้ (ตุนข้ามมื้อ) ---------- */
const SLOT_MS = 24*60*60*1000;
function currentSlotStart(now){
  const d = new Date(now);
  d.setHours(MEAL_HOUR,0,0,0);
  if(d.getTime() > now) d.setDate(d.getDate()-1);   // ก่อน 18:00 → มื้อล่าสุดคือเมื่อวาน
  return d.getTime();
}
function nextSlotStart(now){ return currentSlotStart(now) + SLOT_MS; }
/* key ประจำมื้อ (วันที่ของเวลา 18:00 มื้อล่าสุด) — ใช้กับข้าวเย็นคน (ข้อ 6) */
function mealDayKey(now){ return new Date(currentSlotStart(now)).toDateString(); }
/* key ประจำคืน (ข้อ 1): คืนนี้เริ่ม 20:00 ถึงเช้า 06:00 — หลังเที่ยงคืนยังนับเป็นคืนของเมื่อวาน */
function nightKeyOf(now){
  const d = new Date(now);
  if(d.getHours() < WAKE_HOUR) d.setDate(d.getDate()-1);
  return d.toDateString();
}
/* 🌙 รอบ 680: ตอนนี้เป็น "กลางคืน" หรือยัง — ตามนาฬิกาเครื่องผู้เล่นจริง
   ใช้ช่วงเดียวกับเวลานอนของน้อง (20:00–06:00) ฉากเวทีจะได้ตรงกับกติกานอนที่เด็กเห็นอยู่แล้ว
   (ฉากสลับเองภายใน 1 นาที — renderDashboard ถูกเรียกจาก tick ใน js/main.js อยู่แล้ว ไม่ต้องมี timer ใหม่) */
function isNightNow(now){
  const h = new Date(now || Date.now()).getHours();
  return h >= SLEEP_FROM_HOUR || h < WAKE_HOUR;
}

function newPet(type, name){
  return {type,
          name: name || PETS[type].name,   // ชื่อตั้งเอง (ข้อ 7) — ไม่ส่งมา = ชื่อชนิด เช่น "น้องหมา"
          level:1, exp:0,
          equipped:{head:null, face:null, neck:null},
          sick:false, sickCause:null,
          fedUpTo:0,        // timestamp มื้อที่กินครอบคลุมแล้ว (0 = ยังไม่เคยกิน)
          fullness:0,       // ข้อ 3: ความอิ่มสะสมของมื้อปัจจุบัน (0–100 ครบ 100 = อิ่มมื้อนี้)
          mealSlot:0,       // slot ที่ fullness นับอยู่ (เปลี่ยนมื้อ → รีเซ็ต 0)
          toxin:0,          // ข้อ 5.1: พิษสะสมจากอาหารโทษ (0–100 เต็ม → ป่วย · ไม่ลดเอง ขับพิษ 1,000)
          shape:'normal',   // ข้อ 5.2: รูปร่างตามคุณภาพการกิน normal/fat/thin/strong (ภาพเฉพาะโตเต็มวัย)
          junkMeals:0,      // ข้อ 5.2: มื้อที่มีอาหารโทษติดต่อกัน (ครบ 3 → อ้วน)
          cleanMeals:0,     // ข้อ 5.2: มื้อสะอาดเต็มหลอดติดต่อกัน (ครบ 3 → ล่ำกำยำ)
          missedMeals:0,    // ข้อ 5.2: มื้อที่อดจนป่วยติดต่อกัน (ครบ 2 → ผอมโซ)
          mealJunk:false,   // ข้อ 5.2: มื้อปัจจุบันกินอาหารโทษไปแล้วหรือยัง (รีเซ็ตเมื่อขึ้นมื้อใหม่/นับมื้อจบ)
          shapeSlot:0,      // ข้อ 5.2: slot มื้อล่าสุดที่นับรูปร่างไปแล้ว (กัน feast/กินซ้ำนับมื้อเดียวสองรอบ)
          sleeping:false,   // ข้อ 1: กำลังหลับอยู่ (ตื่นเอง 06:00)
          sleepSickDay:null,// ข้อ 1: nightKey คืนที่ป่วยเพราะไม่นอนไปแล้ว (กันป่วยซ้ำคืนเดียวกัน)
          heatFrom:null,    // เริ่มนับความร้อนสะสมตั้งแต่เมื่อไหร่ (null = ไม่ร้อน)
          thirstFrom:null,  // เริ่มนับขาดน้ำสะสมตั้งแต่เมื่อไหร่ (null = น้ำปกติ)
          patDay:null,      // รอบ 322: วันที่รับโบนัส "ลูบยาว" ไปแล้ว (todayStr) — วันละครั้งต่อตัว
          rainSickDay:null};// วันที่ป่วยเพราะฝนล่าสุด (กันป่วยซ้ำในฝนรอบเดียวกัน)
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const old = JSON.parse(raw);
      const s = Object.assign(structuredClone(DEFAULT_STATE), old);
      /* ---- migration เซฟรุ่นเก่า (สัตว์ตัวเดียว) → รุ่นใหม่ (หลายตัว) ---- */
      if(!Array.isArray(s.pets)) s.pets = [];
      if(old.pet !== undefined && !Array.isArray(old.pets)){
        if(old.pet && PETS[old.pet]){
          const now = Date.now();
          let eq = old.equipped || {head:null, face:null, neck:null};
          if(Array.isArray(old.wearing)){          // เซฟช่วงทดลองระบบชุดผสม
            eq = {head:null, face:null, neck:null};
            const it = ITEMS.find(i=>i.id === old.wearing[0]);
            if(it) eq[it.slot] = it.id;
          }
          const p = newPet(old.pet);
          p.level = old.level || 1; p.exp = old.exp || 0;
          p.equipped = eq;
          p.sick = !!old.sick; p.sickCause = old.sick ? 'hunger' : null;
          // ความหิวระบบเก่า (เกจ 0-100) → ระบบมื้อ: ถ้ายังไม่ท้องว่างถือว่ากินมื้อนี้แล้ว
          p.fedUpTo = (old.hunger == null || old.hunger > 0) ? currentSlotStart(now) : 0;
          s.pets = [p];
        }
        s.active = 0;
      }
      for(const k of ['pet','level','exp','hunger','lastTick','hungrySince','sick','fullUntil','equipped','wearing'])
        delete s[k];
      // ทำความสะอาดข้อมูลสัตว์ทุกตัว (กันสัตว์ที่ถูกตัดออก/ฟิลด์หาย)
      s.pets = s.pets.filter(p=>p && PETS[p.type]);
      // ชื่อสัตว์ (ข้อ 7): ตัวเดิมไม่มีชื่อ → default ชื่อชนิด (เช่น "น้องหมา")
      for(const p of s.pets){
        if(typeof p.name !== 'string' || !p.name.trim()) p.name = PETS[p.type].name;
      }
      for(const p of s.pets){
        if(!p.equipped) p.equipped = {head:null, face:null, neck:null};
        // ใส่ได้ทีละ 1 ชิ้น: ถ้าติดมาหลายชิ้นให้เหลือชิ้นเดียว (หัว > หน้า > คอ)
        const firstWorn = p.equipped.head ? 'head' : p.equipped.face ? 'face' : p.equipped.neck ? 'neck' : null;
        for(const slot of ['head','face','neck']) if(slot !== firstWorn) p.equipped[slot] = null;
        if(p.fedUpTo == null) p.fedUpTo = 0;
        // คิว 7725691507 กลุ่ม A: เซฟเก่าเพิ่งเข้าระบบมื้อเย็น 18:00 + การนอน
        // → ผ่อนผัน: ถือว่าอิ่มมื้อล่าสุดแล้ว + ไม่ลงโทษคืนแรก (กันป่วยย้อนหลังทันทีที่อัปเดต)
        if(typeof p.fullness !== 'number'){
          const nowMig = Date.now();
          p.fullness = 0; p.mealSlot = 0;
          if(p.fedUpTo > 0 && p.fedUpTo < currentSlotStart(nowMig)){
            p.fedUpTo = currentSlotStart(nowMig);
            p.fullness = MEAL_FULL; p.mealSlot = p.fedUpTo;
          }
          p.sleeping = false;
          p.sleepSickDay = nightKeyOf(nowMig);
        }
        if(typeof p.mealSlot !== 'number') p.mealSlot = 0;
        if(typeof p.toxin !== 'number') p.toxin = 0;   // ข้อ 5.1: เซฟเก่าเริ่มบาร์พิษว่าง
        // ข้อ 5.2: เซฟเก่าเริ่มรูปร่างปกติ นับมื้อใหม่จากศูนย์
        if(typeof p.shape !== 'string') p.shape = 'normal';
        if(typeof p.junkMeals !== 'number') p.junkMeals = 0;
        if(typeof p.cleanMeals !== 'number') p.cleanMeals = 0;
        if(typeof p.missedMeals !== 'number') p.missedMeals = 0;
        if(typeof p.mealJunk !== 'boolean') p.mealJunk = false;
        if(typeof p.shapeSlot !== 'number') p.shapeSlot = 0;
        if(typeof p.sleeping !== 'boolean') p.sleeping = false;
        if(p.sleepSickDay === undefined) p.sleepSickDay = null;
        if(p.heatFrom === undefined) p.heatFrom = null;
        if(p.thirstFrom === undefined) p.thirstFrom = null;
        if(p.rainSickDay === undefined) p.rainSickDay = null;
        if(p.sickCause === undefined) p.sickCause = p.sick ? 'hunger' : null;
      }
      /* 🦣 รอบ 659 (ผู้ใช้สั่ง): ถอด "โหมดขยายร่าง" ออกทั้งหมด — เซฟเก่าที่เคยจ่ายเหรียญปลดล็อกไว้
         ได้คืนเงินเต็มจำนวนครั้งเดียว (ราคาที่เคยเก็บต่อระดับ 1-4: 2000/4000/8000/16000 — เก็บสำเนาไว้ที่นี่
         เพื่อคำนวณคืนเงินให้ถูก แม้ระบบเดิมถูกลบไปแล้ว) → เด้งบอกผู้เล่นครั้งเดียวใน showGiantRefund (main.js) */
      if(!s.giantRemoved){
        const GIANT_COST_HIST = [0, 2000, 4000, 8000, 16000];
        let giantRefundTotal = 0;
        for(const p of s.pets){
          const paidLv = Math.max((typeof p.giant === 'number' ? p.giant : 0), (typeof p.giantMax === 'number' ? p.giantMax : 0));
          for(let i = 1; i <= paidLv; i++) giantRefundTotal += GIANT_COST_HIST[i] || 0;
        }
        if(giantRefundTotal > 0){
          s.coins = (s.coins||0) + giantRefundTotal;
          s.lifetimeCoins = (s.lifetimeCoins||0) + giantRefundTotal;
          s.giantRefund = {total: giantRefundTotal, ts: Date.now()};
        }
        s.giantRemoved = true;
      }
      for(const p of s.pets){ delete p.giant; delete p.giantMax; }   // ฟิลด์เก่า ไม่ใช้แล้ว
      if(s.active >= s.pets.length) s.active = 0;
      if(!s.daily || typeof s.daily !== 'object') s.daily = {date:'', coins:0};
      if(!s.bills || typeof s.bills !== 'object') s.bills = {};
      if(s.pendingRuin === undefined) s.pendingRuin = null;
      if(!Array.isArray(s.pendingCut)) s.pendingCut = [];
      if(typeof s.noAnim !== 'boolean') s.noAnim = false;
      // คิว 7725691507 ข้อ 6: เซฟเก่ายังไม่มีระบบข้าวเย็นคน → ถือว่ากินมื้อล่าสุดแล้ว (เริ่มนับมื้อหน้า)
      if(old.playerFedDay === undefined) s.playerFedDay = mealDayKey(Date.now());
      if(typeof s.foodQuizDay !== 'string') s.foodQuizDay = '';
      if(typeof s.foodQuizPlayDay !== 'string') s.foodQuizPlayDay = '';
      if(typeof s.foodQuizPlayCount !== 'number') s.foodQuizPlayCount = 0;
      if(s.playerAvatar !== 'male' && s.playerAvatar !== 'female') s.playerAvatar = null;  // ข้อ 4: ผู้เล่นเดิมค่อยเลือกในตั้งค่า
      if(!/^blk[1-8]$/.test(s.blockAv||'')) s.blockAv = null;                              // 🧱 ตัวละครบล็อกโลก 3D
      if(!/^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(s.profAv||'')) s.profAv = null;             // 🖼️ รูปโปรไฟล์/ตัวในล็อบบี้ blk1..blk88
      if(typeof s.advTicket !== 'boolean') s.advTicket = false;                            // ข้อ 7
      if(!Array.isArray(s.advDone)) s.advDone = [];                                        // ข้อ 8
      s.advHurt = false;   // รอบ 255: เลิกระบบบาดเจ็บถาวร (โลก 3D ไม่มีตาย/เกมโอเวอร์) — ล้าง flag ค้างของเซฟเก่าด้วย
      if(typeof s.hauntTicket !== 'boolean') s.hauntTicket = false;                        // โลกผีสิง
      if(!Array.isArray(s.hauntDone)) s.hauntDone = [];
      if(typeof s.hauntSurviveBest !== 'number') s.hauntSurviveBest = 0;   // ⏱ รอบ 256
      if(typeof s.heliTicket !== 'boolean') s.heliTicket = false;                          // โลกเฮลิคอปเตอร์
      if(!Array.isArray(s.heliDone)) s.heliDone = [];
      if(typeof s.heliStreak !== 'number') s.heliStreak = 0;                               // รอบ 62
      if(typeof s.pilotBadge !== 'number') s.pilotBadge = 0;
      if(typeof s.droneTicket !== 'boolean') s.droneTicket = false;                         // รอบ 85: โลกโดรน FPV
      if(!Array.isArray(s.droneDone)) s.droneDone = [];
      if(typeof s.driveTicket !== 'boolean') s.driveTicket = false;                         // รอบ 113: โลกขับรถกำแพงเพชร
      if(!Array.isArray(s.driveDone)) s.driveDone = [];
      if(typeof s.soccerTicket !== 'boolean') s.soccerTicket = false;                        // รอบ 196: โลกสนามฟุตบอล
      if(!Array.isArray(s.soccerDone)) s.soccerDone = [];
      if(typeof s.soccerShirt !== 'number') s.soccerShirt = 0xe53935;
      if(typeof s.soccerNo !== 'string') s.soccerNo = '10';
      if(!Array.isArray(s.robots)) s.robots = [];                                            // รอบ 199: หุ่นยนต์นักรบ
      if(!Array.isArray(s.invasionDone)) s.invasionDone = [];   // 🛸 รอบ 413: โลกยานแม่บุกโลก
      if(typeof s.invasionBest !== 'number') s.invasionBest = 0;
      if(!Array.isArray(s.mechaDone)) s.mechaDone = [];
      if(typeof s.mechaBoss !== 'number') s.mechaBoss = 0;   // รอบ 228: บอสที่ล้มสะสม
      if(typeof s.mechaBossBadge !== 'number') s.mechaBossBadge = 0;   // รอบ 229: เข็มนักล่าบอส
      if(typeof s.mechaWaveBest !== 'number') s.mechaWaveBest = 0;     // รอบ 229: เวฟสูงสุด (Endless Wave)
      if(typeof s.wsScore !== 'number' || s.wsScore < 0) s.wsScore = 0;   // 🔎 รอบ 590: แต้มสะสม Word Search
      if(typeof s.wsWords !== 'number' || s.wsWords < 0) s.wsWords = 0;
      if(typeof s.wsBoards !== 'number' || s.wsBoards < 0) s.wsBoards = 0;
      if(!Array.isArray(s.tpUsed)) s.tpUsed = [];   // ⌨️ รอบ 648: คำที่พิมพ์แล้วในเกมพิมพ์คำศัพท์ (กันคำซ้ำ)
      if(typeof s.tpScore !== 'number' || s.tpScore < 0) s.tpScore = 0;   // ⌨️ รอบ 649: แต้มสะสมเกมพิมพ์คำ
      if(typeof s.tpWords !== 'number' || s.tpWords < 0) s.tpWords = 0;
      // เซฟเก่าที่เล่นรอบ 648 มาแล้ว (มี tpUsed แต่ยังไม่มี tpScore) → นับคำที่เคยพิมพ์เป็นจำนวนคำตั้งต้น
      // (ให้แต้มย้อนหลังไม่ได้เพราะไม่รู้ความยาว/ความแม่นของคำที่ลบไปแล้ว — เริ่มนับแต้มจาก 0 เท่ากันทุกคน)
      if(!s.tpWords && s.tpUsed.length) s.tpWords = s.tpUsed.length;
      if(typeof s.wsAwardSeen !== 'string') s.wsAwardSeen = '';   // 🏆 รอบ 592: รางวัลรายเดือนแท็บค้นหาคำ
      if(!Array.isArray(s.wsAwardPaid)) s.wsAwardPaid = [];
      if(!Array.isArray(s.wsAwardLog)) s.wsAwardLog = [];
      if(typeof s.typistBadge !== 'number') s.typistBadge = 0;    // ⌨️ รอบ 654: เข็มนักพิมพ์
      if(typeof s.tpAwardSeen !== 'string') s.tpAwardSeen = '';   // 🏆 รอบ 649: รางวัลรายเดือนแท็บพิมพ์คำ
      if(!Array.isArray(s.tpAwardPaid)) s.tpAwardPaid = [];
      if(!Array.isArray(s.tpAwardLog)) s.tpAwardLog = [];
      /* 🎁 รอบ 593 (ผู้ใช้สั่ง): รางวัลสอบผ่าน 10 ข้อ 100 → 500 + "จ่ายย้อนหลัง" ให้คนที่สอบผ่านไปก่อนประกาศใหม่
         นับเฉพาะ id ที่เคยได้รางวัลเต็มเรตนี้จริง = หมวดคำศัพท์ตามชั้น (ALL_CATS) + ชุดคลังศัพท์ bandXsY
         (ตัด vbreview รางวัล 50 และสอบซ่อมรวม bandXretake รางวัล 0 ออก — คนละเรต ไม่ต้องชดเชย) */
      if(!Array.isArray(s.quizPassed)) s.quizPassed = [];
      // ⚠️ ต้องอ่านจาก old (เซฟดิบ) ไม่ใช่ s — s ถูก Object.assign ทับด้วยค่า default (500) ไปแล้ว เซฟเก่าจะดูเหมือนได้เรตใหม่
      const rwOld = (typeof old.quizRewardVer === 'number' && old.quizRewardVer > 0) ? old.quizRewardVer : 100;
      if(rwOld < QUIZ_PASS_REWARD){
        const per = QUIZ_PASS_REWARD - rwOld;
        const n = s.quizPassed.filter(id => /^band\d+s\d+$/.test(id) ||
          (typeof ALL_CATS !== 'undefined' && ALL_CATS.some(c=>c.id === id))).length;
        if(n > 0){
          s.coins = (s.coins||0) + per*n;
          s.lifetimeCoins = (s.lifetimeCoins||0) + per*n;   // เป็นเหรียญที่ได้จริง (แต่ไม่นับใน daily — ไม่ได้หามาจากการเล่นวันนี้)
          s.quizBackPay = {n, per, total:per*n, from:rwOld, to:QUIZ_PASS_REWARD, ts:Date.now()};
        }
        s.quizRewardVer = QUIZ_PASS_REWARD;
      }
      // 🚗 รอบ 211: รถส่วนตัวหลายคัน — ย้ายจากเซฟเก่า s.car (คันเดียว) → s.cars[] · sanitize รายคัน
      if(s.car && typeof s.car === 'object' && !Array.isArray(s.cars)){ s.cars = [s.car]; }   // migrate คันเดียว→array
      delete s.car;
      if(!Array.isArray(s.cars)) s.cars = [];
      s.cars = s.cars.filter(c => c && typeof c === 'object' && carInfo(c.id));               // ทิ้ง id เสีย
      s.cars.forEach(c => {
        c.insured = c.insured === true;
        const l = c.loan;
        if(!l || typeof l !== 'object' || typeof l.remain !== 'number' || l.remain <= 0) c.loan = null;
        else{
          if(typeof l.perMonth !== 'number' || l.perMonth < 1) l.perMonth = Math.ceil(l.remain/CAR_LOAN_MONTHS);
          if(typeof l.month !== 'string') l.month = ymStr(Date.now());
          if(typeof l.paid  !== 'number' || l.paid  < 0) l.paid  = 0;
          if(typeof l.carry !== 'number' || l.carry < 0) l.carry = 0;
        }
      });
      if(typeof s.carIdx !== 'number' || s.carIdx < 0 || s.carIdx >= s.cars.length) s.carIdx = 0;
      if(typeof s.glassCount !== 'number') s.glassCount = 0;                               // รอบ 337 (เข็มจอมทุบกระจก)
      if(typeof s.glassBadge !== 'number') s.glassBadge = 0;
      if(typeof s.daredevilCount !== 'number') s.daredevilCount = 0;                        // รอบ 87
      if(typeof s.daredevilBadge !== 'number') s.daredevilBadge = 0;
      if(typeof s.thunderCount !== 'number') s.thunderCount = 0;                           // รอบ 70
      if(typeof s.thunderBadge !== 'number') s.thunderBadge = 0;
      if(typeof s.diligentCount !== 'number') s.diligentCount = 0;                         // รอบ 105
      if(typeof s.diligentBadge !== 'number') s.diligentBadge = 0;
      if(typeof s.patStreak !== 'number') s.patStreak = 0;                                 // รอบ 323 (เข็มเพื่อนซี้)
      if(typeof s.patStreakDay !== 'string') s.patStreakDay = '';
      if(typeof s.patStreakBest !== 'number') s.patStreakBest = 0;
      if(!Array.isArray(s.patDays)) s.patDays = [];                                       // รอบ 325
      if(!s.greetSent || typeof s.greetSent !== 'object') s.greetSent = {};                // รอบ 325
      if(!Array.isArray(s.nwQueue)) s.nwQueue = [];                                        // รอบ 326
      if(typeof s.nwAt !== 'number') s.nwAt = 0;
      if(typeof s.nwPaidAt !== 'number') s.nwPaidAt = 0;                                    // รอบ 327
      if(typeof s.patRemindDay !== 'string') s.patRemindDay = '';                           // รอบ 328
      if(typeof s.nwReadDay !== 'string') s.nwReadDay = '';                                 // รอบ 329
      if(typeof s.nwReadCount !== 'number') s.nwReadCount = 0;
      if(typeof s.nwBonusDay !== 'string') s.nwBonusDay = '';
      if(typeof s.bffBadge !== 'number') s.bffBadge = 0;
      if(typeof s.crownBadge !== 'number') s.crownBadge = 0;                               // รอบ 109
      if(typeof s.badgeWeekKey !== 'string') s.badgeWeekKey = '';
      if(typeof s.badgeWeekStartScore !== 'number') s.badgeWeekStartScore = 0;
      if(!Array.isArray(s.badgeWeekHist)) s.badgeWeekHist = [];
      if(!s.tinvClaimed || typeof s.tinvClaimed !== 'object') s.tinvClaimed = {};
      if(!s.tinvSent || typeof s.tinvSent !== 'object') s.tinvSent = {};
      if(typeof s.voiceSpk !== 'boolean') s.voiceSpk = true;
      if(s.voiceMode !== 'all' && s.voiceMode !== 'friends') s.voiceMode = 'all';
      // เซฟเก่าที่มีบ้านแต่ยังไม่มีระบบบิล → เริ่มนับเดือนนี้แบบฟรี (บิลจริงออกวันที่ 1 เดือนหน้า)
      if(s.home && !s.bills.maint) s.bills.maint = {month: ymStr(Date.now()), due: 0, paid: 0};
      if(s.home && !s.bills.elec)  s.bills.elec  = {month: ymStr(Date.now()), due: 0, paid: 0};
      if(s.home && !s.bills.water) s.bills.water = {month: ymStr(Date.now()), due: 0, paid: 0};
      // ค่าจัดการขยะ (ข้อ 13): เซฟเก่ามีบ้านไม่มีบิลขยะ → ฟรีเดือนนี้ / ไม่มีบ้าน → ล้างบิลขยะ
      if(s.home && !s.bills.trash) s.bills.trash = {month: ymStr(Date.now()), due: 0, paid: 0, fine: 0};
      if(!s.home){ s.powerCut = false; s.transformerBought = false; s.waterCut = false; s.plumbingBought = false; delete s.bills.trash; }
      // เซฟเก่าที่มีมือถือแต่ยังไม่มีบิลเน็ต → เริ่มเดือนนี้แบบฟรี / ไม่มีมือถือ → ล้างสถานะตัดเน็ต
      if(s.phone && !s.bills.net) s.bills.net = {month: ymStr(Date.now()), due: 0, paid: 0};
      if(!s.phone){ s.netCut = false; delete s.bills.net; }
      // คอมพิวเตอร์ (ข้อ 11): เซฟเก่ามีคอมไม่มีบิล data → ฟรีเดือนนี้ / ไม่มีคอม → ล้างสถานะ
      if(s.computer && !s.bills.data) s.bills.data = {month: ymStr(Date.now()), due: 0, paid: 0};
      if(s.computer && s.compSince == null) s.compSince = Date.now();
      if(!s.computer){ s.dataCut = false; s.compSince = null; delete s.bills.data; }
      if(typeof s.compEarned !== 'number') s.compEarned = 0;
      // รายได้ออนไลน์ (item 8): นับเฉพาะเวลาที่เปิดเกมออนไลน์อยู่จริง — เริ่มนับใหม่ทุกการเปิดเกม
      if(typeof s.onlineEarned !== 'number') s.onlineEarned = 0;
      s.onlineSince = null;
      // Daily Quest (item 3): เซฟเก่า/ข้อมูลเสีย → เริ่มว่าง questTick สร้างชุดวันนี้เอง
      if(!s.quests || typeof s.quests !== 'object' || !Array.isArray(s.quests.done)) s.quests = null;
      // ของที่เล็งไว้ (รอบ 126): เซฟเก่าไม่มี → เริ่มว่าง / คัด id ที่ไม่รู้จักทิ้ง
      if(!Array.isArray(s.wishlist)) s.wishlist = [];
      s.wishlist = s.wishlist.filter(id=>collectInfo(id));
      // สวนผลไม้ (ข้อ 12): เซฟเก่าไม่มีสวน → เริ่มว่าง / คัดต้นที่ข้อมูลเสียทิ้ง
      if(!Array.isArray(s.farm)) s.farm = [];
      s.farm = s.farm.filter(t=>t && fruitInfo(t.id) && typeof t.plantedAt === 'number');
      // ตลาดผลไม้ (รอบ 395): เซฟเก่าไม่มี → เริ่มว่าง (ราคาเต็ม 100% ทุกชนิด)
      if(!s.fruitMkt || typeof s.fruitMkt !== 'object' || Array.isArray(s.fruitMkt)) s.fruitMkt = {};
      // สินค้าสะสม + ตลาดขายต่อ: เซฟเก่าไม่มี → เริ่มว่าง / คัดข้อมูลที่เสียทิ้ง
      if(!Array.isArray(s.collection)) s.collection = [];
      s.collection = s.collection.filter(id=>collectInfo(id));
      if(!Array.isArray(s.listings)) s.listings = [];
      s.listings = s.listings.filter(l=>l && collectInfo(l.id) && typeof l.price === 'number' && typeof l.listedAt === 'number');
      if(!Array.isArray(s.tradeSold)) s.tradeSold = [];
      // โรงงานผลิต + ออเดอร์พิเศษ (5 ก.ค. 2026): เซฟเก่าไม่มี → เริ่มว่าง / คัดข้อมูลเสียทิ้ง
      if(!s.producing || !collectInfo(s.producing.id) || typeof s.producing.progress !== 'number' || s.producing.progress < 0) s.producing = null;
      if(typeof s.producedCount !== 'number') s.producedCount = 0;
      if(!Array.isArray(s.orders)) s.orders = [];
      s.orders = s.orders.filter(o=>o && collectInfo(o.id) && typeof o.payout === 'number' && typeof o.expireAt === 'number');
      if(typeof s.nextOrderAt !== 'number') s.nextOrderAt = 0;
      // ระบบออนไลน์: เซฟเก่าไม่มี id → ให้ online.js สุ่มใหม่ตอนเชื่อมต่อ
      if(typeof s.onlineId !== 'string') s.onlineId = null;
      // Google Login (ข้อ 0.1): เซฟเก่าไม่มี field → default (ownerUid null = ยังไม่ผูกบัญชี)
      if(typeof s.savedAt !== 'number') s.savedAt = 0;
      if(typeof s.ownerUid !== 'string') s.ownerUid = null;
      // ชื่อในเกม (ข้อ 0.2): เซฟเก่าไม่มี → null (auth.js จะเด้งกล่องบังคับตั้งชื่อตอนเข้าเกม)
      if(typeof s.profileName !== 'string') s.profileName = null;
      // แชท (ข้อ 0.4): บันทึกว่าอ่านถึงข้อความไหนของแต่ละคู่แล้ว (ไว้แจ้งเตือนข้อความใหม่)
      if(!s.chatSeen || typeof s.chatSeen !== 'object' || Array.isArray(s.chatSeen)) s.chatSeen = {};
      // ห้องของขวัญ (ข้อ 0.5): เซฟเก่าไม่มี → เริ่มว่าง / คัดชิ้นที่ข้อมูลเสียทิ้ง
      if(!Array.isArray(s.giftBox)) s.giftBox = [];
      s.giftBox = s.giftBox.filter(x=>x && (x.k === 'shop' || x.k === 'collect') &&
        (x.k === 'shop' ? giftInfo(x.id) : collectInfo(x.id)));
      // 📰 Follow + Feed (รอบ 155 · default เปิดทุกหมวดตั้งแต่รอบ 565): เซฟเก่าไม่มี → ใช้ default / ไม่ follow ใคร
      if(!s.feedShare || typeof s.feedShare !== 'object' || Array.isArray(s.feedShare))
        s.feedShare = structuredClone(DEFAULT_STATE.feedShare);
      for(const k of Object.keys(DEFAULT_STATE.feedShare))
        if(typeof s.feedShare[k] !== 'boolean') s.feedShare[k] = DEFAULT_STATE.feedShare[k];
      if(!s.follows || typeof s.follows !== 'object' || Array.isArray(s.follows)) s.follows = {};
      return s;
    }
  }catch(e){ /* ข้อมูลเสีย เริ่มใหม่ */ }
  return structuredClone(DEFAULT_STATE);
}
function saveState(){
  state.savedAt = Date.now();          // ตราเวลาเซฟ (ไว้เทียบกับเซฟ cloud ใน auth.js)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
let state = loadState();

/* ---------- helpers ---------- */
function activePet(){ return state.pets[state.active] || null; }
function petStage(p){
  p = p || activePet();
  if(!p) return null;
  return p.level >= 3 ? 'adult' : (p.level === 2 ? 'baby' : 'egg');
}
function isAdult(p){ return petStage(p) === 'adult'; }
function abilityOn(p){ p = p || activePet(); return !!p && petStage(p) === 'adult' && !p.sick; }
function hasPetType(type){ return state.pets.some(p=>p.type === type); }

/* ---------- เหรียญ: สะสมทั้งหมด + ที่หาได้วันนี้ ---------- */
function todayStr(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function dailyTick(){
  if(state.daily.date !== todayStr()) state.daily = {date:todayStr(), coins:0};
}
function addCoins(n){        // ใช้ตอน "ได้" เหรียญเท่านั้น (ตอนจ่ายหักตรงๆ ได้เลย)
  dailyTick();
  const before = state.coins;
  state.coins += n;
  state.daily.coins += n;
  state.lifetimeCoins = (state.lifetimeCoins||0) + n;   // เหรียญสะสมตลอดการเล่น (ไว้โชว์รายงานความก้าวหน้า)
  // เหรียญเพิ่งข้ามเส้นราคาน้องที่ยังไม่มี → แจ้งทันที ไม่ต้องกลับไปเช็กที่ร้าน (เด้งเฉพาะจังหวะข้ามเส้น)
  if(typeof PETS !== 'undefined' && typeof toast === 'function'){
    const got = Object.keys(PETS).filter(k => before < PETS[k].price && state.coins >= PETS[k].price && !hasPetType(k));
    if(got.length) toast(`🎉 เหรียญพอรับ${got.map(k=>PETS[k].eggName).join(' และ ')}แล้ว! ไปร้านสัตว์เลี้ยงได้เลย`);
  }
  // การเลื่อน/ลดแรงค์ตรวจรวมที่ refreshRank() (เรียกใน careTick) เพราะ net worth
  // เปลี่ยนได้จากหลายทาง (ได้เหรียญ/ซื้อ-ขายทรัพย์สิน/จ่ายบิล) — ตรวจที่จุดนิ่งจุดเดียวกันเที่ยงตรงกว่า
}

/* ============================================================
   Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
   ทุกคนได้ชุดเดียวกันทั้งเซิร์ฟเวอร์ (seed จากวันที่ — ครูจัดกิจกรรมในห้องได้)
   ทำครบเป้า → รางวัลเข้ากระเป๋าทันที · เคลียร์ครบ 3 → โบนัสพิเศษเพิ่มอีก
   ============================================================ */
const QUEST_POOL = [
  {id:'match20',  ev:'match',   target:20, reward:100, emoji:'🃏', name:'จับคู่คำศัพท์ถูก 20 คำ'},
  {id:'quiz1',    ev:'quiz',    target:1,  reward:150, emoji:'📝', name:'สอบผ่าน 1 หมวด (ถูก 8 ข้อขึ้นไป)'},
  {id:'word3d3',  ev:'word3d',  target:3,  reward:150, emoji:'🌍', name:'ประกอบคำในโลก 3D 3 คำ'},
  {id:'feed1',    ev:'feed',    target:1,  reward:80,  emoji:'🍽️', name:'ป้อนอาหารน้องจนอิ่มเต็มหลอด 1 มื้อ'},
  {id:'produce1', ev:'produce', target:1,  reward:120, emoji:'🏭', name:'ผลิตสินค้าในโรงงานสำเร็จ 1 ชิ้น'},
  {id:'replay2',  ev:'replay',  target:2,  reward:80,  emoji:'🔁', name:'กด "เล่นต่ออีกรอบ" 2 ครั้ง'},
  {id:'dict5',    ev:'dict',    target:5,  reward:80,  emoji:'📖', name:'เปิดพจนานุกรมค้นคำ 5 คำ'},   // รอบ 285: นับเฉพาะคำใหม่ที่เจอผล (ไม่นับค้นคำเดิมซ้ำ)
  {id:'vbreview1',ev:'vbquiz',  target:1,  reward:120, emoji:'📒', name:'สอบทบทวนคำในสมุดของหนู 1 รอบ'},   // รอบ 291: นับตอนสอบทบทวนจบ (ผ่านหรือไม่ก็นับ — ให้กำลังใจความพยายาม)
];
const QUEST_PER_DAY = 3, QUEST_ALL_BONUS = 150;
function questsToday(){               // เลือก 3 ภารกิจของวันนี้ (deterministic จากวันที่)
  let seed = 0; const d = todayStr();
  for(let i = 0; i < d.length; i++) seed = (seed*31 + d.charCodeAt(i)) >>> 0;
  const rnd = seededRand(seed), pool = QUEST_POOL.slice();
  for(let i = pool.length-1; i > 0; i--){ const j = Math.floor(rnd()*(i+1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
  return pool.slice(0, QUEST_PER_DAY);
}
function questTick(){                 // ขึ้นวันใหม่ → ล้างความคืบหน้า เริ่มชุดใหม่
  if(!state.quests || state.quests.date !== todayStr())
    state.quests = {date: todayStr(), prog:{}, done:[], allDone:false};
}
function questEvent(ev, n){           // จุดรับแต้มกลาง — เกมส่วนไหนเกิดเหตุการณ์ก็ยิงมาที่นี่
  if(!state.student) return;
  questTick();
  n = n || 1;
  let changed = false;
  for(const q of questsToday()){
    if(q.ev !== ev || state.quests.done.includes(q.id)) continue;
    state.quests.prog[q.id] = (state.quests.prog[q.id]||0) + n;
    changed = true;
    if(state.quests.prog[q.id] >= q.target){
      state.quests.done.push(q.id);
      addCoins(q.reward);
      if(typeof feedEvent === 'function') feedEvent('coin', `ได้เหรียญพิเศษ +${q.reward} 🪙 จากภารกิจ ${q.emoji} ${q.name}`);
      if(typeof sfx !== 'undefined') sfx.levelup();
      if(typeof toast === 'function') toast(`🎯 ภารกิจสำเร็จ! ${q.emoji} ${q.name} — รับ +${q.reward} 🪙`);
      if(!state.quests.allDone && state.quests.done.length >= QUEST_PER_DAY){
        state.quests.allDone = true;
        addCoins(QUEST_ALL_BONUS);
        if(typeof feedEvent === 'function') feedEvent('coin', `เคลียร์ภารกิจครบ ${QUEST_PER_DAY} วันนี้ รับโบนัสพิเศษ +${QUEST_ALL_BONUS} 🪙 🏆`);
        if(typeof toast === 'function')
          setTimeout(()=>toast(`🏆 สุดยอด! เคลียร์ภารกิจครบทั้ง ${QUEST_PER_DAY} วันนี้ — โบนัสพิเศษ +${QUEST_ALL_BONUS} 🪙`), 1400);
      }
    }
  }
  if(changed){
    saveState();
    if(typeof renderQuestCard === 'function') renderQuestCard();
  }
}

/* ============================================================
   มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
   = เหรียญคงเหลือ + มูลค่าทรัพย์สินที่ถือครองอยู่ทั้งหมด
   ทรัพย์สินทุกชิ้นที่ยังถืออยู่คิด "ราคาเต็มที่ซื้อ" (ราคาขายคืนใช้ตอนขายจริงเท่านั้น
   ซึ่งได้กลับมาเป็นเหรียญไปแล้ว) → ซื้อแล้ว net worth เท่าเดิมเป๊ะ แรงค์ไม่ตก
   ============================================================ */
function assetValue(){
  let v = 0;
  for(const p of state.pets){ const c = PETS[p.type]; if(c) v += c.price; }               // สัตว์เลี้ยง
  if(state.home){ const h = homeInfo(state.home); if(h) v += h.price; }                    // ที่พัก
  if(state.ac) v += AC_PRICE + AC_INSTALL;                                                 // แอร์ (รวมติดตั้ง)
  for(const id of state.owned){ const it = ITEMS.find(i=>i.id === id); if(it) v += it.price; } // เสื้อผ้าในตู้
  if(state.phone) v += PHONE_PRICE;                                                        // มือถือ (ราคาเต็ม)
  if(state.computer) v += COMP_PRICE;                                                      // คอม (ราคาเต็ม)
  if(state.advTicket) v += TICKET_PRICE;                                                   // การ์ดตั๋วโลกผจญภัย (ข้อ 7)
  if(state.hauntTicket) v += HAUNT_PRICE;                                                  // ตั๋วโลกผีสิงกลางคืน
  if(state.heliTicket) v += HELI_PRICE;                                                    // ตั๋วโลกเฮลิคอปเตอร์
  if(state.droneTicket) v += DRONE_PRICE;                                                  // ตั๋วโลกโดรน FPV (รอบ 85)
  if(state.driveTicket) v += DRIVE_PRICE;                                                  // ตั๋วโลกขับรถกำแพงเพชร (รอบ 113)
  if(state.soccerTicket) v += SOCCER_PRICE;                                                // ตั๋วโลกสนามฟุตบอล (รอบ 196)
  if(state.invasionTicket && typeof INVASION_PRICE!=='undefined') v += INVASION_PRICE;     // 🛸 ตั๋วโลกยานแม่บุกโลก (รอบ 413)
  if(Array.isArray(state.robots)) for(const rid of state.robots){ const r=(typeof ROBOTS!=='undefined')&&ROBOTS.find(x=>x.id===rid); if(r) v += r.price; }  // หุ่นยนต์นักรบ (รอบ 199)
  for(const car of (state.cars || [])){                                                    // 🚗 รอบ 211: รถทุกคัน+พ.ร.บ.+ประกัน (สะสมนับเป็นทรัพย์สินรวม)
    const c = carInfo(car.id);
    // ผ่อนอยู่นับเฉพาะส่วนที่จ่ายแล้ว (ราคาเต็ม - หนี้คงเหลือ) → ซื้อผ่อน net worth เท่าเดิม ไม่ได้แรงค์ฟรี
    if(c) v += c.price - (car.loan ? car.loan.remain : 0) + CAR_PRB + (car.insured ? CAR_INSURANCE : 0);
  }
  for(const t of state.farm){ const f = fruitInfo(t.id); if(f) v += f.price; }             // ต้นไม้ในสวน
  for(const id of state.collection){ const c = collectInfo(id); if(c) v += c.price; }      // สินค้าสะสมในคลัง
  for(const l of state.listings){ const c = collectInfo(l.id); if(c) v += c.price; }       // ของที่ลงขายอยู่ (ยังเป็นของเรา)
  return v;
}
function netWorth(){ return state.coins + assetValue(); }
/* จำนวนชิ้นทรัพย์สินที่ถือครอง (นับคู่กับ assetValue เพื่อโชว์ในการ์ดผู้เล่น) */
function assetCount(){
  let n = 0;
  n += state.pets.length;                 // สัตว์เลี้ยง
  if(state.home) n += 1;                   // ที่พัก
  if(state.ac) n += 1;                      // แอร์
  n += state.owned.length;                 // เสื้อผ้าในตู้
  if(state.phone) n += 1;                   // มือถือ
  if(state.computer) n += 1;                // คอม
  n += state.farm.length;                  // ต้นไม้ในสวน
  n += state.collection.length;            // สินค้าสะสมในคลัง
  n += state.listings.length;              // ของที่ลงขายอยู่
  n += (state.cars ? state.cars.length : 0); // 🚗 รอบ 211: รถส่วนตัว (นับทุกคัน)
  return n;
}

/* ตรวจการเปลี่ยนแรงค์ที่ "จุดนิ่ง" (เรียกใน careTick หลัง net worth นิ่งแล้ว):
   เลื่อนข้ามแรงค์ใหญ่ → ฉากอลังการ · เลื่อนขั้นย่อย → toast · ลดลง → เงียบๆ */
function refreshRank(){
  const after = rankInfo(netWorth());
  if(state.rankKey == null){ state.rankKey = after.key; return; }   // ครั้งแรก/เซฟเก่า — จำไว้เฉยๆ ไม่ฉลอง
  if(after.key > state.rankKey){
    const before = rankFromKey(state.rankKey);
    if(after.idx > before.idx){
      setTimeout(()=>showRankUp(before, after), 700);              // ข้ามแรงค์ใหญ่ → ฉากอลังการ
    }else{
      setTimeout(()=>{ sfx.levelup(); toast(`🎖️ เลื่อนขั้นเป็น ${after.rank.emoji} ${after.label}!`, 2400); }, 700);
    }
    if(typeof feedEvent === 'function') feedEvent('other', `เลื่อนแรงค์เป็น ${after.rank.emoji} ${after.label} 🎖️`);
  }
  state.rankKey = after.key;   // อัปเดตทั้งเลื่อนขึ้น (ฉลองแล้ว) และลดลง (เงียบๆ)
}

/* ---------- ความหิว (มื้อเย็นวันละครั้ง 18:00) + ความร้อน (ป่วยทุก 6 ชม.) ---------- */
function heatProtected(){
  if(state.powerCut) return false;    // ถูกตัดไฟ → แอร์ใช้ไม่ได้ (แม้ปราสาทที่มีแอร์ในตัว)
  return state.home === 'castle' || (state.home === 'medium' && state.ac);
}
function rainProtected(){             // กันฝนได้ต้องมีบ้าน "สภาพดี" (บ้านทรุดโทรมหลังคารั่ว)
  return !!state.home && !homeDecayed();
}
function petHungry(p){ return p.level >= 2 && p.fedUpTo < currentSlotStart(Date.now()); }

/* ---------- รูปร่างตามคุณภาพการกิน (ข้อ 5.2) ----------
   ผอมโซ > อ้วน > ล่ำ: อดข้าวสำคัญสุด แล้วค่อยดูของโทษ/กินดี */
function petShapeOf(p){
  if((p.missedMeals||0) >= SHAPE_MISS_MEALS) return 'thin';
  if((p.junkMeals||0)  >= SHAPE_JUNK_MEALS)  return 'fat';
  if((p.cleanMeals||0) >= SHAPE_CLEAN_MEALS) return 'strong';
  return 'normal';
}
function updatePetShape(p){
  const s = petShapeOf(p);
  if(p.shape === s) return null;
  p.shape = s;
  return s;                        // เปลี่ยนร่าง → คืนร่างใหม่ให้ผู้เรียกแจ้งผู้เล่น
}
/* นับมื้อที่กินจนเต็มหลอด — ครั้งเดียวต่อ slot (feast ตุนพรุ่งนี้ไม่นับมื้อพรุ่งนี้ให้) */
function shapeMealDone(p, now){
  const slot = currentSlotStart(now);
  if(p.shapeSlot === slot) return null;
  p.shapeSlot = slot;
  if(p.mealJunk){ p.junkMeals = (p.junkMeals||0) + 1; p.cleanMeals = 0; }
  else          { p.cleanMeals = (p.cleanMeals||0) + 1; p.junkMeals = 0; }
  p.missedMeals = 0;
  p.mealJunk = false;
  return updatePetShape(p);
}
function heatPct(p){
  if(p.heatFrom == null) return 0;
  return Math.min(100, (Date.now() - p.heatFrom)/HEAT_SICK_MS*100);
}

/* ============================================================
   เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
   state.bills[id] = {month:'YYYY-MM', due, paid}
   ============================================================ */
function ymStr(now){
  const d = new Date(now);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
}
function billOutstanding(id){
  const b = state.bills[id];
  return b ? Math.max(0, b.due - b.paid) : 0;
}
/* ทะเบียนสาธารณูปโภครายเดือน: active() = ต้องออกบิลไหม · cutKey = ถูกตัดแล้ว
   fixKey = ต้องซื้ออุปกรณ์ซ่อมก่อนจ่ายบิลค้าง (null = จ่ายค้างได้เลย)
   (ข้อความ/ปุ่ม UI อยู่ใน UTILITY_UI ที่ ui.js) */
const UTILITIES = {
  elec:  {cost: elecCost,  cutKey: 'powerCut', fixKey: 'transformerBought', active: ()=>!!state.home},
  water: {cost: waterCost, cutKey: 'waterCut', fixKey: 'plumbingBought',    active: ()=>!!state.home},
  net:   {cost: netCost,   cutKey: 'netCut',   fixKey: null,                active: ()=>!!state.phone},
  data:  {cost: dataCost,  cutKey: 'dataCut',  fixKey: null,                active: ()=>!!state.computer},
};
const HOME_UTILITIES = ['elec','water'];   // ชนิดที่แสดงในการ์ดบ้าน (เน็ตอยู่การ์ดมือถือ)
/* บ้านเสื่อมสภาพ = ค้างค่าบำรุงตั้งแต่วันที่ 5 ของเดือนเป็นต้นไป (คำนวณสด ไม่ต้องเซฟ) */
function homeDecayed(){
  return !!state.home && billOutstanding('maint') > 0 && new Date(Date.now()).getDate() >= DECAY_DAY;
}
function billTick(now){
  const ym = ymStr(now);
  if(state.home){
    const b = state.bills.maint;
    if(!b || b.month !== ym){
      if(b && b.due - b.paid > 0){
        // ข้ามเข้าเดือนใหม่ทั้งที่ยังค้างจ่าย → บ้านพัง กลายเป็นคนไร้บ้าน
        state.pendingRuin = state.home;
        state.home = null;
        state.ac = false;
        delete state.bills.maint;
      }else{
        // วันที่ 1 ของเดือนใหม่ → ออกบิลรอบใหม่
        state.bills.maint = {month: ym, due: maintCost(state.home), paid: 0};
      }
    }
  }
  /* ค่าจัดการขยะ (บิล id 'trash' — โครงคล้ายค่าบำรุง แต่ "ไม่ตัดบริการ/ไม่ทำบ้านพัง"):
     ค้างข้ามเดือน → โดนค่าปรับ +TRASH_FINE ทบสะสม (จ่ายแบบ all-or-nothing เหมือน maint
     จึง track ยอดค่าปรับสะสมใน b.fine ได้ตรงๆ — จ่ายครบ carry=0 ค่าปรับรีเซ็ตเอง) */
  if(state.home){
    const b = state.bills.trash;
    if(!b || b.month !== ym){
      const carry = b ? Math.max(0, b.due - b.paid) : 0;
      const addFine  = carry > 0 ? TRASH_FINE : 0;
      const prevFine = carry > 0 ? (b.fine || 0) : 0;   // จ่ายครบแล้ว (carry 0) ค่าปรับสะสมหายไป
      state.bills.trash = {month: ym, due: carry + addFine + trashCost(state.home), paid: 0, fine: prevFine + addFine};
    }
  }
  /* สาธารณูปโภค (ค่าไฟ/ค่าน้ำ/ค่าเน็ต): ค้างจ่ายข้ามเดือน → ถูกตัด
     (บิลค้างทบเข้าบิลเดือนใหม่ ไม่หายไปไหน) ชนิดที่มี fixKey อุปกรณ์พังตอนโดนตัด
     ต้องซื้อ/ติดตั้งใหม่ก่อน จ่ายบิลครบแล้วถึงกลับมาใช้ได้ */
  for(const [id, u] of Object.entries(UTILITIES)){
    if(u.active()){
      const b = state.bills[id];
      if(!b || b.month !== ym){
        const carry = b ? Math.max(0, b.due - b.paid) : 0;
        if(carry > 0 && !state[u.cutKey]){
          state[u.cutKey] = true;
          if(u.fixKey) state[u.fixKey] = false;
          if(!Array.isArray(state.pendingCut)) state.pendingCut = [];
          state.pendingCut.push(id);   // ให้ UI เด้งกล่องเตือน "ถูกตัด..." (showCutNotice)
        }
        state.bills[id] = {month: ym, due: carry + u.cost(state.home), paid: 0};
      }
    }else{
      delete state.bills[id];
      state[u.cutKey] = false;
      if(u.fixKey) state[u.fixKey] = false;
    }
  }
  if(!state.home){ delete state.bills.maint; delete state.bills.trash; }
  /* 🚗 รอบ 131: งวดผ่อนรถรายเดือน — ข้ามเข้าเดือนใหม่ทั้งที่งวดยังจ่ายไม่ครบ
     → ส่วนที่ขาดทบเป็น "ยอดค้าง" (carry) · ค้าง = ล็อกขับจนกว่าจะจ่าย (ไม่ยึดรถ — ผู้ใช้เคาะ 11 ก.ค.) */
  (state.cars || []).forEach(car => {                     // 🚗 รอบ 211: ทบยอดค้างงวดผ่อนทุกคัน
    const L = car.loan;
    if(L && L.month !== ym){
      const due = Math.min(L.perMonth, Math.max(0, L.remain - (L.carry||0)));
      const short = Math.max(0, due - (L.paid||0));
      if(short > 0){
        L.carry = (L.carry||0) + short;
        if(typeof toast === 'function')
          toast(`🚗⚠️ ค้างค่างวดรถ 🪙${short.toLocaleString()} — ขับรถไม่ได้จนกว่าจะจ่ายที่หมวดยานพาหนะนะ`, 4200);
      }
      L.month = ym; L.paid = 0;
    }
  });
}
/* ============================================================
   🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
   (ตัวละ 10,000 เหรียญ) + เตือนล่วงหน้า 1 วัน (วันสุดท้ายของเดือน) ก่อนเงินเข้าจริง
   ============================================================ */
const PET_FOOD_PER_PET = 10000;
function petFoodTick(now){
  const petCount = state.pets.length;
  if(petCount <= 0) return;
  const amt = petCount * PET_FOOD_PER_PET;
  const d = new Date(now);
  const ym = ymStr(now);
  if(d.getDate() === 1 && state.petFoodPaidMonth !== ym){
    state.coins += amt;
    state.petFoodPaidMonth = ym;
    if(typeof toast === 'function')
      toast(`🍖 เงินค่าอาหารสัตว์เข้าแล้ว! เลี้ยง ${petCount} ตัว ได้ 🪙${fmtNum(amt)} เหรียญ`, 4200);
    if(typeof sfx !== 'undefined' && sfx.coinGetTier) sfx.coinGetTier(petCount >= 3 ? 2 : petCount >= 2 ? 1 : 0);
  }
  // เตือนล่วงหน้า: วันนี้เป็นวันสุดท้ายของเดือน (พรุ่งนี้คือวันที่ 1) → บอกจำนวนที่จะได้รับ
  const tomorrow = new Date(now); tomorrow.setDate(d.getDate() + 1);
  if(tomorrow.getDate() === 1){
    const warnYm = ymStr(tomorrow);
    if(state.petFoodWarnMonth !== warnYm){
      state.petFoodWarnMonth = warnYm;
      if(typeof toast === 'function')
        toast(`📅 พรุ่งนี้เงินค่าอาหารสัตว์เข้า! เลี้ยง ${petCount} ตัว จะได้ 🪙${fmtNum(amt)} เหรียญ`, 4200);
    }
  }
}

/* 🚗 รอบ 211: รถคันที่เลือกใช้ขับตอนนี้ (ไว้แทน state.car เดิม) */
function myCar(){ return (state.cars && state.cars[state.carIdx]) || null; }

/* 🚗 รอบ 131: ตัวช่วยงวดผ่อนรถ — เรียกจาก UI หมวดยานพาหนะ + ด่านล็อกขับ
   remain = หนี้คงเหลือทั้งหมด · carry = ส่วนของ remain ที่ค้างเลยกำหนด (>0 = ล็อกขับ)
   งวดเดือนนี้ = min(perMonth, remain-carry) · paid = จ่ายงวดเดือนนี้ไปแล้วเท่าไหร่ */
function carLoanDue(){
  const L = myCar() && myCar().loan;
  if(!L) return 0;
  return Math.min(L.perMonth, Math.max(0, L.remain - (L.carry||0)));
}
function carLoanOverdue(){
  const L = myCar() && myCar().loan;
  return L ? (L.carry||0) : 0;
}
/* ยอดที่ควรจ่ายตอนนี้ = ยอดค้าง + งวดเดือนนี้ส่วนที่ยังไม่จ่าย */
function carLoanPayable(){
  const L = myCar() && myCar().loan;
  if(!L) return 0;
  return (L.carry||0) + Math.max(0, carLoanDue() - (L.paid||0));
}
/* จ่ายเงินเข้ายอดผ่อน amt เหรียญ (ผู้เรียกหักเหรียญเอง) — เคลียร์ยอดค้างก่อน แล้วเข้างวดเดือนนี้ ที่เหลือ=โปะต้น
   ผ่อนหมด → ปลดหนี้ (loan=null) · คืน true เมื่อปิดยอดแล้ว */
function carLoanPay(amt){
  const L = myCar() && myCar().loan;
  if(!L || amt <= 0) return false;
  const clearCarry = Math.min(amt, L.carry||0);
  L.carry = (L.carry||0) - clearCarry;
  L.paid = (L.paid||0) + Math.max(0, amt - clearCarry);
  L.remain = Math.max(0, L.remain - amt);
  if(L.remain <= 0){ const c=myCar(); if(c) c.loan = null; return true; }
  return false;
}

/* ---------- รายได้คอมพิวเตอร์ (ข้อ 11): +0.01 เหรียญ/วิ = ตกเหรียญเต็มทุก 100 วิ
   ถูกตัดบริการข้อมูล → เข็มหยุดเดิน (compSince เลื่อนตามเวลา ไม่สะสม) ---------- */
function compTick(now){
  if(!state.computer || state.compSince == null) return;
  if(state.dataCut){ state.compSince = now; return; }   // ถูกตัด → รายได้หยุดนิ่ง
  const whole = Math.floor((now - state.compSince)/1000 * COMP_RATE);
  if(whole > 0){
    addCoins(whole);
    state.compEarned += whole;
    state.compSince += whole/COMP_RATE * 1000;          // เก็บเศษวินาทีไว้รอบถัดไป
  }
}

/* ---------- รายได้ออนไลน์ (item 8): แค่เปิดเกมออนไลน์อยู่ก็ได้เหรียญ +0.01/วิ ฟรีทุกคน
   นิยาม "ออนไลน์" = login แล้ว (Online.ready) + แท็บเกมมองเห็นอยู่ (visibilityState 'visible')
   ต่างจากรายได้คอม: ไม่นับเวลาตอนปิดเกม (onlineSince รีเซ็ต null ทุกการโหลด + ตอนแท็บถูกซ่อน) ---------- */
const ONLINE_RATE = 0.01;   // เหรียญต่อวินาที (เท่ารายได้คอม แต่อันนี้ฟรี ไม่ต้องซื้ออะไร)
function onlineEarnActive(){
  return typeof Online !== 'undefined' && Online.ready &&
         typeof document !== 'undefined' && document.visibilityState === 'visible';
}
function onlineEarnTick(now){          // คืนจำนวนเหรียญเต็มที่เพิ่งตก (ให้ UI รู้ว่าต้อง save/refresh)
  if(!onlineEarnActive()){ state.onlineSince = null; return 0; }
  if(state.onlineSince == null){ state.onlineSince = now; return 0; }
  const whole = Math.floor((now - state.onlineSince)/1000 * ONLINE_RATE);
  if(whole > 0){
    addCoins(whole);
    state.onlineEarned += whole;
    state.onlineSince += whole/ONLINE_RATE * 1000;   // เก็บเศษวินาทีไว้รอบถัดไป (แบบ compTick)
  }
  return whole;
}
function onlineEarnFlush(now){         // แท็บกำลังถูกซ่อน/ปิด → ตกเหรียญเต็มที่ค้าง แล้วหยุดนับ
  if(state.onlineSince == null) return;
  const whole = Math.floor((now - state.onlineSince)/1000 * ONLINE_RATE);
  if(whole > 0){ addCoins(whole); state.onlineEarned += whole; }
  state.onlineSince = null;
  saveState();
}

/* ---------- ตลาดขายต่อสินค้าสะสม (ข้อใหม่): ลูกค้าจำลองมาซื้อของที่เราลงขาย
   ตามเวลาที่ราคาเหมาะสม (ตั้งถูก = ขายไว) — จ่ายเงินเข้ากระเป๋าแล้วรอผู้เล่นรับทราบ ---------- */
function marketTick(now){
  if(!Array.isArray(state.listings) || !state.listings.length) return;
  const remain = [];
  for(const l of state.listings){
    const c = collectInfo(l.id);
    if(!c) continue;                                   // ของเสีย ทิ้ง
    if(l.netKey){ remain.push(l); continue; }          // 🏪 ประกาศจริงในตลาดออนไลน์ — รอคนจริงซื้อเท่านั้น (item 2)
    const dur = listingSellMs(l.price / c.price);
    if(dur !== Infinity && (now - l.listedAt) >= dur){
      addCoins(l.price);                               // มีลูกค้ามาซื้อ! เงินเข้ากระเป๋า
      state.tradeSold.push({id: l.id, price: l.price, ts: now});
    }else{
      remain.push(l);
    }
  }
  state.listings = remain;
  if(state.tradeSold.length > 20) state.tradeSold = state.tradeSold.slice(-20);
}

/* ============================================================
   โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
   ตอบถูกในเกมจับคู่ 1 คำ / ข้อสอบ 1 ข้อ = 1 แต้ม ไหลเข้างานที่เลือกค้างไว้
   ครบตามจำนวนคำของสินค้า → เข้าคลัง คืนค่า id ให้ UI เปิดฉากฉลอง
   ============================================================ */
function addCraft(n){
  // 🎟️ แต้มส่วนลดโรงงาน: ตอบถูกสะสมเสมอแม้ไม่ได้ตั้งงานผลิต (ใช้ลดราคาซื้อสูงสุดครึ่งราคา — buyCollectible)
  if(n > 0) state.wordCredit = Math.min(9999, (state.wordCredit||0) + n);
  if(!state.producing || n <= 0) return null;
  const c = collectInfo(state.producing.id);
  if(!c){ state.producing = null; return null; }
  state.producing.progress += n;
  if(state.producing.progress < c.words) return null;
  state.collection.push(c.id);       // ผลิตสำเร็จ! (แต้มเกินไม่ทบไปชิ้นถัดไป — เริ่มงานใหม่นับใหม่)
  state.producedCount++;
  state.producing = null;
  questEvent('produce');             // 🎯 Daily Quest: ผลิตสินค้าสำเร็จ
  if(typeof feedEvent === 'function') feedEvent('goods', `ผลิต ${c.emoji||''} ${c.name} สำเร็จจากโรงงาน 🏭`);
  return c.id;
}

/* ---------- ออเดอร์พิเศษ: ลูกค้าจำลองสั่งผลิตสินค้าเจาะจง จ่ายแพงกว่าราคาฐาน 30–80%
   มีเวลาส่งมอบ 24 ชม. · เข้ามาใหม่ทุก 2–4 ชม. · ค้างได้สูงสุด 2 ออเดอร์
   หมดเวลา → หายไปเงียบๆ (เดี๋ยวออเดอร์ใหม่ก็มา) ---------- */
const ORDER_MAX         = 2;
const ORDER_LIFE_MS     = 24*60*60*1000;
const ORDER_GAP_MIN_MS  = 2*60*60*1000;
const ORDER_GAP_SPAN_MS = 2*60*60*1000;
const ORDER_TIER_WEIGHT = {common:40, rare:35, epic:18, legendary:6, mythic:1};   // เน้นของที่เด็กผลิตไหว
function newOrder(now){
  // มือใหม่ที่ยังไม่เคยผลิตของ → ออเดอร์แรกๆ เป็นของ common ที่ทำไหวเสมอ
  const pool = state.producedCount === 0 ? COLLECTIBLES.filter(c=>c.tier === 'common') : COLLECTIBLES;
  let total = 0;
  for(const c of pool) total += ORDER_TIER_WEIGHT[c.tier] || 0;
  let r = Math.random()*total, item = pool[0];
  for(const c of pool){ r -= ORDER_TIER_WEIGHT[c.tier] || 0; if(r <= 0){ item = c; break; } }
  const buyer = ONLINE_NAMES[Math.floor(Math.random()*ONLINE_NAMES.length)];
  const mult = 1.3 + Math.random()*0.5;
  const payout = Math.max(10, Math.round(item.price*mult/10)*10);
  return {key: now + '-' + Math.floor(Math.random()*1e6), id:item.id,
          buyer:buyer.n, grade:buyer.g, payout, expireAt: now + ORDER_LIFE_MS};
}
function orderTick(now){
  state.orders = state.orders.filter(o=>o.expireAt > now);
  if(state.orders.length >= ORDER_MAX || now < state.nextOrderAt) return;
  state.orders.push(newOrder(now));
  state.nextOrderAt = now + ORDER_GAP_MIN_MS + Math.random()*ORDER_GAP_SPAN_MS;
}

/* เดินระบบดูแลสัตว์ทุกตัวตามเวลาจริง (เรียกทุกครั้งที่วาดหน้า + ทุก 1 นาที) */
function careTick(){
  const now = Date.now();
  const sickBefore = state.pets.filter(pp=>pp.sick).length;   // 🚨 ไว้เทียบท้ายฟังก์ชัน (หวอตอนเพิ่งล้มป่วย)
  compTick(now);          // ตกรายได้ค้างก่อน แล้วค่อยเช็กบิล/ตัดบริการ
  onlineEarnTick(now);    // โบนัสออนไลน์ (item 8) — เดินเฉพาะตอนเปิดเกมออนไลน์อยู่จริง
  billTick(now);
  petFoodTick(now);
  marketTick(now);        // ลูกค้ามาซื้อสินค้าที่เราลงขาย (net worth ขยับก่อน refreshRank)
  orderTick(now);         // ออเดอร์พิเศษหมดเวลา/เข้าใหม่
  const slot = currentSlotStart(now);
  const hourNow = new Date(now).getHours();
  for(const p of state.pets){
    if(p.level < 2) continue;                    // ไข่/แรกเกิดยังไม่หิวไม่ร้อน ไม่ต้องนอน
    // ข้อ 3: ขึ้นมื้อใหม่ (18:00) แล้วยังไม่อิ่มครอบมื้อนี้ → เริ่มนับความอิ่มสะสมใหม่จาก 0
    if(p.mealSlot !== slot && p.fedUpTo < slot){ p.mealSlot = slot; p.fullness = 0; p.mealJunk = false; }
    // ข้อ 2: หิวมื้อเย็น 18:00 — เกิน 2 ชม. (20:00) ยังกินไม่เต็มหลอด → ป่วย
    if(!p.sick && p.fedUpTo < slot && (now - slot) >= HUNGRY_SICK_MS){
      p.sick = true; p.sickCause = 'hunger';
      // ข้อ 5.2: อดข้าวติดกันหลายมื้อ → ผอมโซ
      p.missedMeals = (p.missedMeals||0) + 1; p.cleanMeals = 0; p.mealJunk = false;
      updatePetShape(p);
    }
    // ข้อ 1: ตื่นนอนอัตโนมัติช่วงเช้า (06:00 ถึงก่อน 20:00)
    if(p.sleeping && hourNow >= WAKE_HOUR && hourNow < SLEEP_FROM_HOUR) p.sleeping = false;
    // ข้อ 1: ถึง 23:00 (จนถึงเช้า) ยังไม่ได้เข้านอน → ป่วย (ครั้งเดียวต่อคืน)
    if(!p.sleeping && (hourNow >= SLEEP_SICK_HOUR || hourNow < WAKE_HOUR)){
      const nightKey = nightKeyOf(now);
      if(!p.sick && p.sleepSickDay !== nightKey){
        p.sick = true; p.sickCause = 'sleep';
        p.sleepSickDay = nightKey;
      }
    }
    // ความร้อนสะสม: มังกรทนร้อน / มีที่พักติดแอร์ = ปลอดภัย
    if(p.type === 'dragon' || heatProtected()){
      p.heatFrom = null;
    }else{
      if(p.heatFrom == null) p.heatFrom = now;
      if(!p.sick && (now - p.heatFrom) >= HEAT_SICK_MS){
        p.sick = true; p.sickCause = 'heat';
        p.heatFrom = now;                        // เริ่มนับรอบใหม่หลังหายป่วย
      }
    }
    // ฝนตกประจำวัน 19:00: ไม่มีบ้านสภาพดี → เปียกจนป่วยทันที (ป่วยครั้งเดียวต่อฝน 1 รอบ)
    if(rainNow(now) && !rainProtected()){
      const rainKey = new Date(now).toDateString();
      if(!p.sick && p.rainSickDay !== rainKey){
        p.sick = true; p.sickCause = 'rain';
        p.rainSickDay = rainKey;
      }
    }
    // ขาดน้ำสะสม: บ้านถูกตัดน้ำ → ครบ 6 ชม. ป่วย (โดนทุกชนิด มังกรก็ต้องกินน้ำ)
    if(!state.waterCut){
      p.thirstFrom = null;
    }else{
      if(p.thirstFrom == null) p.thirstFrom = now;
      if(!p.sick && (now - p.thirstFrom) >= THIRST_SICK_MS){
        p.sick = true; p.sickCause = 'thirst';
        p.thirstFrom = now;                      // เริ่มนับรอบใหม่หลังหายป่วย
      }
    }
  }
  // ข้อ 6: ผู้เล่น (คน) ต้องกินข้าวเย็น 18:00 — เกิน 20:00 ยังไม่กิน → ป่วย (ครั้งเดียวต่อมื้อ)
  const mKey = mealDayKey(now);
  if(state.student && !state.playerSick && state.playerFedDay !== mKey && state.playerSickDay !== mKey
     && (now - slot) >= HUNGRY_SICK_MS){
    state.playerSick = true; state.playerSickDay = mKey;
    state.playerSickPending = true;              // ให้ UI เด้งกล่องแจ้งครั้งเดียว
  }
  refreshRank();          // ตรวจเลื่อน/ลดแรงค์ตาม net worth ที่นิ่งแล้ว
  // 🚨 มีน้องเพิ่งล้มป่วยใน tick นี้ → หวอเบาๆ + toast บอกชื่อ (เด็กรู้ตัวไวแม้กำลังเล่นเกมอยู่
  //    ไม่ปล่อยน้องป่วยข้ามวัน) — badge เลขบนปุ่ม 💊 อัปเดตผ่าน renderDashboard ตามปกติ
  const sickPets = state.pets.filter(pp=>pp.sick);
  if(sickPets.length > sickBefore && typeof sfx !== 'undefined'){
    sfx.siren();
    toast(`🚨 ${sickPets.map(pp=>pp.name).join(', ')} ล้มป่วยแล้ว! กดปุ่ม 💊 รักษาได้เลยนะ`, 3200);
  }
  saveState();
}

/* ---------- EXP / เลเวล (แยกรายตัว) ----------
   ปรับให้เปลี่ยนช่วงวัยยากขึ้น: ฟักไข่/ลืมตา (Lv.2) ต้องสะสม 250 EXP
   โตเต็มวัย (Lv.3) ต้องสะสมอีก 600 EXP — เลเวลถัดๆ ไปเลเวลละ 400 */
function expNeed(level){
  if(level === 1) return 250;
  if(level === 2) return 600;
  return 400;
}
function addExp(amount, p){
  p = p || activePet();
  if(!p || amount <= 0) return;
  p.exp += amount;
  while(p.exp >= expNeed(p.level)){
    p.exp -= expNeed(p.level);
    p.level++;
    if(p.level === 2){
      // เพิ่งฟักไข่/ลืมตา → เริ่มนับหิวและความร้อนตั้งแต่ตอนนี้ (อิ่มมื้อล่าสุดมาแล้ว)
      p.fedUpTo = currentSlotStart(Date.now());
      p.fullness = MEAL_FULL; p.mealSlot = p.fedUpTo;
      p.heatFrom = null;
      p.sick = false; p.sickCause = null;
    }
    showLevelUp(p);
  }
}

/* ---------- Rank Points (แต้มความพยายามสะสม — โชว์ในหน้าสถิติ
   แรงค์จริงยึดยอดเหรียญคงเหลือแล้ว ดู addCoins) ---------- */
function addRP(n){
  dailyTick();
  state.rp += n;
  saveState();
}
