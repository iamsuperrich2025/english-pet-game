/* ============================================================
   adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
   🌍 adv   = โลกผจญภัยกลางวัน: เก็บตัวอักษรประกอบคำ 15🪙/คำ · monster ยิงสู้ได้
   👻 haunt = โลกผีสิงกลางคืน: 25🪙/คำ · ผี 8 ตัว โผล่ 20 วิแล้วย้ายที่
              สู้ไม่ได้ต้องหนี · โดนจับ = game over ทันที + jump scare
   🚁 heli  = โลกเฮลิคอปเตอร์ (รอบ 52): 30🪙/คำ · ลงจอดดาดฟ้าเก็บตัวอักษร
   🛸 drone = โลกโดรน FPV Racing (รอบ 85): 35🪙/คำ · เร็ว/คล่องกว่าเฮลิฯ
              บินลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง (บินเฉียด ไม่ต้องจอด)
   ทั้ง 2 โลก multiplayer สไตล์ Roblox: ผู้เล่นอื่นโผล่ใน map ผ่าน Firebase
   (/world/<map>/<uid> = ตำแหน่ง) · เจอเพื่อนที่ชวน/ถูกชวน (tinv) ครั้งแรก
   ของ map → เงินคืนคนละ TINV_CASHBACK
   เสียงหลอน: สังเคราะห์ Web Audio (ไม่มีลิขสิทธิ์) · ถ้ามีไฟล์ sound/haunt_*.mp3
   (เจนจาก Suno — ดู PROMPTS_SOUND.md) จะสลับใช้ไฟล์จริงอัตโนมัติ
   ▶ โหลด dynamic หลัง js/vendor/three.min.js (global THREE) เท่านั้น
   ============================================================ */
(function(){
'use strict';

/* ---------- ค่ากติกากลาง ---------- */
const GUIDE_WORDS  = 10;        // จำนวนคำ guideline บนจอ (8.1)
const RELOCATE_MS  = 75000;     // ตัวอักษรค้างครบเวลานี้ → สุ่มย้ายที่ (8.2)
const HALF         = 60;        // ครึ่งความกว้างแผนที่ (โลก 120×120)
const PLAYER_SPEED = 6;         // m/s
const HAUNT_LIVES  = 3;         // 👻 หัวใจโลกผี: โดนแตะเสีย 1 ดวง หมดเมื่อไรจบ (กันตายทีเดียว)
const HAUNT_IFRAME = 1500;      // กันโดนซ้ำหลังโดนแตะ (ms)
const PICK_DIST    = 1.6;       // ระยะเดินเก็บตัวอักษร
const EYE_H        = 1.6;
const NET_SEND_MS  = 180;       // ส่งตำแหน่งขึ้น DB ถี่สุดเท่านี้ (~5.5Hz)

/* ---------- ค่าเฉพาะโหมด ---------- */
const MODES = {
  adv: {
    label:'โลกผจญภัย', emoji:'🌍', reward:15, doneKey:'advDone',
    shoot:true, ghost:false,
    sky:0x8ed4f7, fogN:30, fogF:95, ground:0x7ec850,
    monMax:4, monSpawnMs:16000, monSpeed:3.4, monDmg:10, monHp:2,
    monEmoji:['👾','🕷️','🦇','👻'],
    intro:'🌍 <b>โลกผจญภัย!</b><br><small>เก็บตัวอักษรมาประกอบคำทางซ้าย · ระวัง monster 👾 ยิงสู้ได้</small>',
    hint:'คลิกจอ=ล็อกเมาส์ · WASD เดิน · คลิกยิง · Esc ปลดเมาส์แล้วค่อยกดออก',
  },
  haunt: {
    label:'โลกผีสิง', emoji:'👻', reward:25, doneKey:'hauntDone',
    shoot:false, ghost:true,
    sky:0x090916, fogN:9, fogF:46, ground:0x18251d,
    ghostMax:7, ghostLife:3000, ghostSpeed:4.3, huntR:14, seeR:9,
    ghostEmoji:['👻','👻','👻','💀','🧟'],
    intro:'👻 <b>โลกผีสิง...</b><br><small>ผีโผล่ทีละ 3 วิแล้วย้ายที่ · สู้ไม่ได้ ถ้าโผล่ใกล้ให้วิ่งหนี!<br>มีหัวใจ ❤️❤️❤️ 3 ดวง โดนผีแตะเสีย 1 ดวง (กระเด็นหนีได้) หมดเมื่อไรโดนผีหลอกเต็มจอ แล้วฟื้นใหม่เล่นต่อได้เลย</small>',
    hint:'คลิกจอ=ล็อกเมาส์ · WASD วิ่งหนี · สู้ไม่ได้!! · โดนแตะเสียหัวใจ · Esc ปลดเมาส์แล้วค่อยกดออก',
    koTitle:'💫 พลังหมดแล้ว!',
  },
  heli: {
    label:'โลกเฮลิคอปเตอร์', emoji:'🚁', reward:30, doneKey:'heliDone',
    shoot:false, ghost:false, heli:true,
    sky:0x9fd9f7, fogN:45, fogF:150, ground:0x8a8f96,
    intro:'🚁 <b>โลกเฮลิคอปเตอร์ Bell!</b><br><small>เริ่มแบบ<b>เดินเท้า</b>ในเมือง — เลือกทางของหนูเอง:<br>🔴 เดินไปหา<b>เฮลิฯ สีแดง</b>ลานกลาง = ขับเองเต็มระบบ<br>🛗 เข้า<b>ตึกป้ายเขียว</b> ขึ้นลิฟต์ → นั่ง<b>เฮลิฯ สีฟ้า</b>ชมวิวริมหน้าต่าง → กด 🪂 <b>โดดวิงสูท</b>ร่อนเก็บตัวอักษรระหว่างตึก!</small>',
    hint:'เดิน: WASD+เมาส์มอง · ขับ: W/S เอียง A/D สไลด์ Q/E หัน Space ขึ้น Shift ลง · วิงสูท: W ก้มดิ่ง S เชิด A/D เลี้ยว',
    koTitle:'🚁💥 เฮลิคอปเตอร์พังแล้ว!',
  },
  drone: {
    label:'โลกโดรน FPV', emoji:'🛸', reward:35, doneKey:'droneDone',
    shoot:false, ghost:false, drone:true,
    sky:0x9aa6b2, fogN:32, fogF:135, ground:0x45484d,
    intro:'🛸 <b>โลกโดรน FPV Racing!</b><br><small>บินเร็วสุดๆ ลอด<b>หน้าต่างตึกร้าง</b>เข้าไปในห้องต่างๆ<br>บินเฉียดตัวอักษรเพื่อเก็บ (ไม่ต้องจอด!) · ระวังชนกำแพง<br>💨 เฉียดกำแพงหวุดหวิดแบบไม่ชน = เหรียญโบนัส (ยิ่งเฉียด+คอมโบ ยิ่งได้)!</small>',
    hint:'W/S เดินหน้า-ถอย · A/D เอียงข้าง · Q/E หันหัว · Space ขึ้น · Shift ลง · บินเฉียดตัวอักษรเก็บได้เลย',
    koTitle:'🛸💥 โดรนพังแล้ว!',
  },
  drive: {
    label:'โลกขับรถกำแพงเพชร', emoji:'🚗', reward:40, doneKey:'driveDone',
    shoot:false, ghost:false, drive:true,
    sky:0xaee0f7, fogN:120, fogF:650, ground:0x9cb968,
    intro:'🚗 <b>ขับรถเที่ยวเมืองกำแพงเพชร!</b><br><small>ถนนจริงทั้งเมืองจากแผนที่จริง — เริ่มที่<b>หอนาฬิกาวงเวียนต้นโพธิ์</b><br>ขับชนตัวอักษรบนถนนเพื่อเก็บ · ออกนอกถนนรถช้าลง · ระวังชนตึก!<br>🚔 <b>ขับเกิน 90 กม./ชม. = โดนใบสั่ง หักเหรียญจริง!</b></small>',
    hint:'W/S คันเร่ง-เบรก/ถอย · A/D เลี้ยวซ้าย-ขวา · H บีบแตร · เกิน 90 กม./ชม. โดนใบสั่ง! · 🚦 ไฟแดงต้องหยุด · เลี้ยวที่แยกเปิดไฟเลี้ยวด้วย',
    koTitle:'🚗💥 รถพังแล้ว!',
  },
  soccer: {
    label:'สนามฟุตบอล', emoji:'⚽', reward:20, doneKey:'soccerDone',
    shoot:false, ghost:false, soccer:true,
    sky:0x8fd0f5, fogN:80, fogF:360, ground:0x3f9d43,
    intro:'⚽ <b>สนามฟุตบอล!</b><br><small>เตะบอลใส่ป้ายตัวอักษร<b>สีทอง</b> (ประกอบคำได้) = ได้เหรียญ 🪙 · ป้ายหงายหลังแล้วเด้งกลับให้เตะอีกได้<br>กดปุ่มเตะ<b>ค้าง</b>เพิ่มพลังแล้วปล่อย · เล็งได้ทุกทิศ · ครบคำ +20🪙</small>',
    hint:'A/D เล็งซ้าย-ขวา · W/S เงย-ก้ม · เว้นวรรค(กดค้าง)=ชาร์จพลัง ปล่อย=เตะ · V สลับมุมกล้อง',
    koTitle:'⚽ หมดเวลา!',
  },
  mecha: {
    label:'โลกหุ่นยนต์นักรบ', emoji:'🤖', reward:35, doneKey:'mechaDone',
    shoot:false, ghost:false, mecha:true,
    sky:0x232f45, fogN:36, fogF:250, ground:0x4a4a54,
    intro:'🤖 <b>หุ่นยนต์นักรบ!</b><br><small>มุมมองในหุ่นยักษ์สูง 5 เมตร — เดินบุกยิง<b>เอเลี่ยนตัวอักษร</b><br>ยิงตัวอักษร<b>เรียงตามลำดับในคำ</b> ครบคำ = เอเลี่ยนระเบิด! · เอเลี่ยนเคลื่อนที่ตลอด เล็งดีๆ</small>',
    hint:'W/S เดินหน้า-ถอย · A/D หันตัว · คลิก/ปุ่มยิง = ยิงตัวอักษร (ต้องเรียงลำดับ!) · เมาส์/ลากขวา = เล็ง',
    koTitle:'🤖💥 หุ่นยนต์ถูกทำลาย!',
  },
};
MODES.adv.koTitle='💫 พลังหมดแล้ว!';
const SHOOT_GAP_MS = 280;
const MONSTER_REWARD = 2;       // เหรียญ/ตัว เมื่อยิง monster แตก (โหมด adv)
const AD_COUNT = 10;            // ป้ายโฆษณาบนยอดตึกในเมืองเฮลิฯ (เลขป้ายคงที่ — เมือง seed แล้ว)
/* 📢 รอบ 183: ชื่อร้านบนตึกในโลกขับรถ — เอาชื่อจริงจาก OSM ออก (กันปัญหาลิขสิทธิ์)
   โชว์เฉพาะ "ผู้ลงโฆษณากับเรา" เท่านั้น → เพิ่มชื่อที่นี่ (เรียงขึ้นตึกอัตโนมัติ) · ว่าง = ตึกไม่มีชื่อ
   ตึกที่ไม่มีผู้ลงโฆษณา จะขึ้นป้ายเชิญ "ลงโฆษณาที่นี่" ห่างๆ (ทุก ~16 หลัง) */
const SHOP_ADS = [];           // เช่น ['ร้านก๋วยเตี๋ยวเรือป้านิด','คลินิกทันตกรรมยิ้มสวย'] — ผู้ใช้เติมเมื่อมีลูกค้า
/* 🎖️ ใบอนุญาตนักบิน (รอบ 62): สตรีคประกอบคำโดยไม่ชนเลย → เข็มติดท้ายชื่อ (ได้แล้วไม่หาย) */
const PILOT_TIERS=[[5,1,'🥉','ทองแดง'],[15,2,'🥈','เงิน'],[30,3,'🥇','ทอง']];
function pilotEmoji(b){ return ['','🥉','🥈','🥇'][b||0]||''; }

/* ---------- สถานะรอบเล่น ---------- */
let mode='adv', M=MODES.adv;
let built=false, running=false, rafId=0;
let renderer, camera, clock;
let worlds={};                    // ฉาก static ต่อโหมด {scene,trees,buildings} สร้างครั้งเดียว
let scene=null, trees=[], buildings=[];
let solids=[];                    // 🛸 กล่องกันชนของตึกร้าง (โหมด drone) — {x,y,z,hx,hy,hz}
/* 💨 โบนัสบินเฉียด (near-miss · รอบ 86) — ใช้ทั้ง heli/drone: เข้าใกล้กำแพงแล้วถอยรอดโดยไม่ชน = ได้เหรียญ */
let nmActive=false, nmMin=99, nmCrashed=false, nmCombo=0, nmLastAt=0, nmPopEl=null, comboFxEl=null;
/* ---------- โดรน FPV (โหมด drone) — เร็วและคล่องกว่าเฮลิฯ บินเข้าตึกได้ ---------- */
const DRONE_R     = 0.6;          // รัศมีตัวโดรน (กันชนกับกำแพง)
const DRONE_ACCEL = 30;           // แรงเร่งเดินหน้า/สไลด์ (เฮลิฯ = 13 → โดรนแรงกว่ามาก)
const DRONE_VMAX  = 30;           // ความเร็วแนวราบสูงสุด m/s (เฮลิฯ = 17)
const DRONE_CLIMB = 17;           // แรงไต่/ดิ่ง
const DRONE_YAWSP = 2.3;          // ความเร็วหันหัว (เฮลิฯ = 1.5)
const DRONE_GRAV  = 2.6;          // แรงโน้มถ่วงเบาๆ (ปล่อยคันเร่ง = ค่อยๆ ร่วงลง)

/* 🚗 โหมดขับรถเมืองกำแพงเพชร (โหมด drive) — เมืองจริงจาก OSM (js/data/city_kpp.js)
   จุด (0,0) = หอนาฬิกาวงเวียนต้นโพธิ์ · หน่วยเมตร · เหนือ = -z */
const CAR_EYE    = 1.32;          // ความสูงตาคนขับ
const CAR_ACCEL  = 11;            // m/s² (รอบ 128: เพิ่มให้ไต่ถึงท็อปสปีดใหม่ไหว)
const CAR_BRAKE  = 15;
const CAR_VMAX   = 55.6;          // ~200 กม./ชม. บนถนน (รอบ 128 · เกิน 90 = ผิดกฎหมาย โดนใบสั่ง)
const CAR_LEGAL_KMH = 90;         // ลิมิตตามกฎหมายในเกม — เกินแล้วโดนใบสั่ง ม.67
const CAR_FINE_SPEED = 200;       // 🪙 ค่าปรับขับเร็ว/ครั้ง (หักตอนออกจากโลก · สูงสุด 5 ครั้ง/รอบ)
const CAR_FINE_BELT  = 300;       // 🪙 ค่าปรับไม่คาดเข็มขัด (หักทันที ครั้งเดียว/รอบ)
const CAR_REPAIR_FEE = 1000;      // 🪙 ค่าซ่อมรถเมื่อชนสิ่งของแรง (รอบ 130 · หักตอนออก · สูงสุด 3 ครั้ง/รอบ)
const CAR_FINE_SIGNAL = 5;        // 🪙 ค่าปรับเข้าทางแยกไม่เปิดไฟเลี้ยว (รอบ 182 ผู้ใช้เคาะ 5 เหรียญ · หักตอนออก · เดิม 100)
const CAR_RAM_FEE     = 10000;    // 🛠️ เจตนาชนรถผู้เล่นอื่นครบ 3 ครั้ง/รอบ = ค่าซ่อมรถ (รอบ 133 · ประกันไม่คุ้มครองเจตนาชน · ครั้งเดียว/รอบ)
const CAR_FINE_RED    = 300;      // 🚦 ค่าปรับฝ่าไฟแดง ม.22 (รอบ 133 · หักตอนออก · สูงสุด 5 ใบ/รอบ)
const CAR_VMAX_OFF = 7;           // ออกนอกถนน (ดิน/หญ้า) ช้าลงมาก
const CAR_VREV   = 6.5;           // ถอยหลังสูงสุด
const CAR_WB     = 2.6;           // ระยะฐานล้อ (bicycle model)
const CAR_STEER_MAX = .52;        // มุมเลี้ยวสูงสุด (rad) ตอนรถช้า
let dSpeed=0, dSteer=0, dLook=0;  // ความเร็ว(ลงชื่อ) · มุมพวงมาลัย(smooth) · หันหัวมองข้างชั่วคราว
let drivePerf={vmaxMul:1,accMul:1,steerMul:1};   // 🚗 รอบ 232: สมรรถนะคันที่ขับ (ตั้งตอน start จาก stat ใน CARS · ผูกกับป้ายโชว์รูม)
let dRoll=0, dRollV=0;            // 🏎️ รอบ 142: มุมโคลงตัวถัง + ความเร็วเชิงมุม (สปริงช่วงล่างหน่วงต่ำ — โยกซ้ายขวาแบบรถจริง)
let dVelX=0, dVelZ=0, dCamYaw=0;  // 🏁 ฟีล R4: ทิศวิ่งจริงไถลตามหัวรถ (drift) + กล้องหันตามแบบหน่วง
let padSteer=0, padSt=false, padTh=false;  // 🎛️ รอบ 127: ปุ่มคอนโซล (มือถือ) — พวงมาลัยซ้าย + คันเร่งขวา (กดค้าง)
let padBr=false, gearR=false, gearSyncFn=null;  // 🦶 รอบ 139: ปุ่มเบรค (กดค้าง) + เกียร์ถอยหลัง R (toggle) — gearSyncFn อัปเดตหน้าปุ่มตอน reset
let carRevBeepAt=0, tlClickPh=-1;               // 🔊 รอบ 140: จังหวะเสียงติ๊ดถอยหลัง + เฟสเสียงติ๊ก-ต่อกไฟเลี้ยว (-1=เพิ่งเปิด ดังทันที)
/* 🚔 รอบ 128: สตาร์ทเครื่อง/เข็มขัด + ระบบใบสั่งจราจร */
let carEngineOn=false, carBelted=false, carStartOpen=false;   // สวิตช์ + แผงเตรียมออกรถยังเปิดอยู่
let carFines=[], carOverSpeed=false, carBeltFined=false, carLawSeen=false;   // ใบสั่งสะสม/สถานะเตือน
// 🚦 รอบ 132: ไฟเลี้ยว (0=ปิด 1=ซ้าย 2=ขวา) + ตรวจทางแยก ม.36 + ชนรถเพื่อน
let tlSig=0, tlSigAt=0, tlYawOn=0, tlRetAt=0;         // สถานะไฟเลี้ยว + มุมตอนเปิด + เวลานัดเด้งกลับหลังเลี้ยวเสร็จ (รอบ 135)
let tlInJunc=false, tlYawEnter=0, tlSigSeen=false;    // กำลังอยู่ในโซนทางแยก + มุมตอนเข้า + เคยเปิดไฟระหว่างผ่านแยกไหม
let tlJuncWarnUntil=0, juncEl=null;                   // 🚦 รอบ 182: ป้ายเตือน "ใกล้ทางแยก เปิดไฟเลี้ยว" (โชว์ชั่วคราว)
let tlChkAt=0, tlCoolAt=0;                            // จังหวะเช็กทางแยก (ทุก 300ms) + cooldown หลังออกจากแยก
let carPeerHitAt=0;                                   // cooldown ชนรถเพื่อน (กันโดนรัวติดๆ)
let netTlOk=true;                                     // rules /world ยังไม่รับ field tl → ตัด tl ส่งซ้ำ ไม่พัง multiplayer
let carPeerHits=0;                                    // 🛠️ รอบ 133: นับ "เจตนาชน" รถเพื่อนรอบนี้ (ครบ 3 = ค่าซ่อม CAR_RAM_FEE)
let rlChkAt=0, rlCoolAt=0, rlForce=null;              // 🚦 รอบ 133: ไฟแดง — จังหวะเช็ก + cooldown ใบสั่ง + testkit บังคับเฟสไฟ
let carDashEl=null, carWheelEl=null, carHornAt=0, carNameAt=0, carStreet='';
/* 🧭 รอบ 200-201: GPS นำทางไปตัวอักษร (ลูกศร+ระยะทาง+เสียงอังกฤษ · เลี้ยวตามถนนจริง A* แบบ Google Maps) */
let gpsTarget=null, gpsSpokeAt=0, gpsLastTurn='', gpsMile=0, gpsArrivedFor=null;
let gpsArrowEl=null, gpsDistEl=null, gpsTurnEl=null, gpsLetEl=null;
let gpsRoute=null, gpsWpi=0, gpsRouteFor=null, gpsRouteAt=0;   // เส้นทางตามถนน (A*) + waypoint ปัจจุบัน
let carGaugeCv=null, carGaugeCtx=null, carDashImg=null;   // เข็มวิ่งจริงบนคลัสเตอร์ของภาพ dash.png
let radioScreenEl=null, radioVizCv=null, radioVizCtx=null, radioHintEl=null, radioListEl=null;   // 🎵 วิทยุในรถ (รอบ 181)
let carBobbleEl=null, carBobbleImg=null, bobAng=0, bobVel=0, _bobVW=0, _bobVH=0, _bobAv='';       // 🪆 ตุ๊กตาดุ๊กดิ๊ก (รอบ 191)
let bobPitch=0, bobPitchV=0, _bobPrevSpd=0, _bobSkin=null, _bobAC=null;                           // 🪆 รอบ 193: ก้ม-เงย + สกิน + เสียงสะกิด
let radioBars=new Float32Array(32);                       // ระดับแท่ง visualizer (หน่วงนุ่ม)
let cityMapCv=null;               // แผนที่เมืองวาดครั้งเดียว → ใช้เป็นเรดาร์หมุนได้
/* ---------- เฮลิคอปเตอร์ (โหมด heli) ---------- */
const HELI_SKID=1.35;             // ความสูงตาคนขับเหนือแท่นลงจอด (คาน skid)
let hVel={x:0,y:0,z:0}, hCol=0, hLanded=true, hHitAt=0, hWarnLvl=0, hudInstEl=null, hudWarnEl=null, cockpitEl=null;
/* 🎯💡🏆 รอบ 350: ระบบช่วยจัดกึ่งกลางเป้า + ไฟส่องหมอก + โบนัสลงนุ่ม */
const ASSIST_R=14, ASSIST_ALT=26, ASSIST_PAD=3.0;   // รัศมีเริ่มติ๊ด · สูงไม่เกิน · "ตรงเป้า" = ในวง helipad (ring 2.4-3.0)
let assistTgt=null;                      // เป้าดาดฟ้าตัวอักษรที่ใกล้สุดตอนกำลังร่อนลง {x,z,y,d}
let heliLight=null, heliLightOn=false, _lightHintAt=0;   // 💡 สปอตไลต์ใต้ท้อง (แสงจริง — ตึกเป็น Lambert รับแสงได้)
let hAirAt=0;                            // เวลาเทคออฟล่าสุด — โบนัสลงนุ่มต้องบินจริง >3 วิ (กันเด้งฟาร์ม)
let propsEl=null, propSpinCur=0, propStallUntil=0;   // 🌀 ใบพัดโดรน — จำค่า --pspin ล่าสุด (เขียน DOM เฉพาะตอนเปลี่ยนจริง) + ช่วงสตอลหลังชน
const PROP_STALL_MS=420;                            // ชนแล้วใบพัดหมุนช้า+สะบัดนานเท่านี้
/* 🌀 ใบพัดหัก (ชนแรงมาก) — ใบข้างที่ชนหยุดหมุน บินช้าลง จนกว่าจะเก็บตัวอักษรถัดไป = ซ่อมเสร็จ */
let propBroken='';                                  // '' | 'l' | 'r'
const PROP_BREAK_SPD=18;                            // ความเร็วตอนชนที่ทำให้ใบพัดหัก (สตอลเฉยๆ = 9)
const PROP_BROKEN_MUL=.72;                          // ใบพัดหักแล้วบินได้แค่ 72% ของความเร็วปกติ
/* 🔋 แบตเตอรี่โดรน — ไหลลงตามเวลา · เก็บตัวอักษร/บินเฉียดได้ชาร์จคืน · หมดแล้วบินอืดแต่ยังเล่นต่อได้ (ไม่ตัดจบเกม) */
let droneBat=100, droneBatWarnAt=0;
const BAT_DRAIN=100/210;                            // เต็ม→หมด ~3.5 นาทีถ้าไม่ชาร์จเลย
const BAT_LETTER=8, BAT_NEARMISS=4;                 // ชาร์จคืนต่อ 1 ตัวอักษร / 1 ครั้งที่บินเฉียดรอด
const BAT_LOW=20;                                   // ต่ำกว่านี้ = เตือน
const BAT_EMPTY_MUL=.55;                            // แบตหมด: ความเร็ว+แรงไต่เหลือ 55%
/* ⚡ สถานีชาร์จบนดาดฟ้า — ลอยในรัศมีเหนือแท่นแล้วแบตวิ่งขึ้นเร็ว */
let droneChargers=[], droneCharging=false;
const CHG_R=3.4, CHG_H=7, CHG_RATE=26;              // รัศมีแนวราบ · ความสูงเหนือดาดฟ้าที่ยังชาร์จได้ · %/วินาที
/* 🏁 โหมดแข่งเวลา — บินผ่านห่วง FPV ครบ 6 ห่วงตามลำดับก่อนแบตหมด */
let droneGates=[], raceOn=false, raceIdx=0, raceStart=0, raceHudEl=null, raceBtnEl=null;
const GATE_R=3.4, RACE_REWARD=40;
/* 📸 กล้องในเกม — จับภาพเฟรมถัดไป (ต้องอ่านทันทีหลัง render เพราะ canvas ถูกล้างทุกเฟรม) */
let shotWanted=false, photoEl=null, photoImgEl=null, flashEl=null;
/* 🪟⛈🚪 รอบ 336: กระจกที่ยังไม่แตก + ฟ้าแลบสะท้อนกระจก + ประตูเปิดได้ */
let droneGlass=[], droneDoors=[], droneWinMat=null, droneGlassMat=null;
let boltAt=0, boltFlashUntil=0, boltEl=null, rainEl=null, rainUntil=0;
let skipStartEl=null, hViewSwitched=false;              // ⏭ ปุ่มข้ามสตาร์ท · ธงตัดไปมุมบินแล้ว (รอบ 347)
function showHeliSkip(on){ if(skipStartEl) skipStartEl.classList.toggle('on',!!on); }
const BOLT_MIN=11000, BOLT_MAX=24000;               // ฟ้าแลบทุก 11-24 วิ
const GLASS_HIT_R=1.9, GLASS_COIN=2;                // ชนบานกระจก: รัศมี · เหรียญที่ได้
const DOOR_R=2.6, DOOR_COIN=8, DOOR_BAT=15;         // ชนประตู: รัศมี · รางวัลในห้องเก็บของ
let hTiltF=0, hTiltS=0;           // การเอียงหัว/ข้าง แบบ smooth — ใช้ทั้งมุมกล้องและเข็มเส้นขอบฟ้า (รอบ 61)
let gaugeCtx=null, gaugeCanvasEl=null;   // canvas เข็มที่วาดทับหน้าปัดในภาพค็อกพิต (รอบ 342)
let hAtcCleared=false;            // รอบ 64: หอบังคับประกาศ "อนุญาตขึ้นบิน" ไปแล้ว (ครั้งเดียว/รอบเข้าโลก)

/* ============================================================
   ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
   ที่ลอยนิ่งหน้าประตู ประกอบเป็นคำ = เหรียญ · เลือกสีเสื้อ+เบอร์ · มุมมอง 1st/3rd
   ============================================================ */
const SOCCER_SHIRTS=[
  {n:'แดง',c:0xe53935},{n:'น้ำเงิน',c:0x1e59d0},{n:'เขียว',c:0x2e9e4a},{n:'เหลือง',c:0xf6c026},
  {n:'ส้ม',c:0xef6c00},{n:'ม่วง',c:0x8e24aa},{n:'ฟ้า',c:0x29b6f6},{n:'ชมพู',c:0xec407a},
  {n:'ขาว',c:0xf0f0f0},{n:'ดำ',c:0x2b2f36},
];
const BALL_R=0.34, BALL_G=17, PLAYER_Z=8, GOAL_Z=-19;      // รัศมีบอล · แรงโน้มถ่วง · จุดยืน/ประตู (แกน z)
const GOAL_HW=4, GOAL_H=3;                                 // ครึ่งกว้างประตู · ความสูงคาน
const KICK_SPD_MIN=9, KICK_SPD_MAX=32, CHARGE_RATE=78;     // ความเร็วเตะต่ำ-สูง (m/s) · พลังชาร์จ/วินาที
const AIM_YAW_SP=0.9, AIM_PITCH_SP=0.7, SOCCER_COLLECT=1.7;// ความไวเล็ง + ระยะบอลชนป้าย
const SOCCER_TILES=14, SOCCER_LETTER_COIN=5;              // จำนวนป้ายเป้าคงที่ · เหรียญ/ตัวอักษรที่ประกอบคำได้
let soccerBall=null, soccerPlayer=null, soccerGuide=[];    // ลูกบอล · หุ่นนักเตะ · จุดพรีวิววิถีเตะ
let _soccerTileGeo=null, coinPopEl=null;                   // geometry ป้าย (แชร์) · เลเยอร์ป๊อปเหรียญ
let sbVel={x:0,y:0,z:0}, sbLive=false, sbRestAt=0, sbKickAt=0, sbGoaled=false;
let aimYaw=0, aimPitch=0.34, sChg=0, sCharging=false, sKickHeld=false, sPrevV=false, sLegSwing=0;
let soccerCam1=false;                                      // true=มุมมองบุคคลที่ 1
let sKitShirt=0xe53935, sKitNo='10';
let sPadU=false, sPadD=false, sPadL=false, sPadR=false;    // ปุ่มเล็ง (มือถือ)
let soccerStartEl=null, powerFillEl=null;

/* ============================================================
   🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
   ยิงตัวอักษรเรียงลำดับในคำ → ครบคำ เอเลี่ยนระเบิด · เอเลี่ยนเคลื่อนที่ตลอด · เดินมีเสียงหุ่นย่ำ
   ============================================================ */
const MECHA_EYE=5.0, MECHA_ACCEL=9, MECHA_VMAX=11, MECHA_DECEL=7, MECHA_TURN=1.35;
const ALIEN_COUNT=3, ALIEN_SPEED=2.4, MECHA_LETTER_COIN=3;
const MECHA_MAX_HP=240;                             // 🤖 รอบ 236: พลังหุ่นสูงกว่าโลกอื่น (เดิม 100 โดนไม่กี่ทีตาย น่าเบื่อ)
const MECHA_ATK_RANGE=8, MECHA_ATK_DMG=8;          // 🤖 รอบ 225: เอเลี่ยนเข้าประชิดโจมตี → HUD กะพริบแดง + สัญญาณเตือน
const ALIEN_SHOT_SPD=15, ALIEN_SHOT_DMG=6, ALIEN_SHOT_GAP=3200;   // 🤖 รอบ 226: เอเลี่ยนยิงกระสุน (หลบได้)
const POWERUP_GAP=15000, POWERUP_MAX=2, POWERUP_RANGE=3.4, POWERUP_HEAL=30;   // ❄️❤️ ของเก็บลดร้อน/ฟื้นพลัง
const BOSS_SCALE=1.85, BOSS_BONUS=45;   // 👾 บอส: คำยาวพิเศษ + โบนัสเหรียญ (สเกลเริ่มต้น · แต่ละสายพันธุ์ override)
const COMBO_X2=3, COMBO_X3=6, SHIELD_MS=3500;   // 🔥 รอบ 227: คอมโบ ×2/×3 · 🛡️ โล่กันกระสุน 3.5 วิ
/* 👾 รอบ 229: บอสหลายสายพันธุ์ — ต่างกันที่ รูปทรง/สี/ตา/สีกระสุน/ความเร็วยิง/ความยาวคำ (หมุนเวียนทีละสาย)
   ธีมน่ารักเหมาะเด็ก (ไม่ใช้หัวกะโหลก/เลือด) · geo() คืน geometry ใหม่ทุกครั้ง (dispose ได้อิสระ) */
const BOSS_SPECIES=[
  {key:'ember', name:'Ember', th:'อีมเบอร์ จอมเพลิง',   emoji:'🔥', geo:()=>new THREE.IcosahedronGeometry(2.2,1), body:0xff5a2f, emis:0x551126, eye:0xffdd55, shot:0xff6a3a, scale:1.9,  shotSpd:1.0,  wordPick:8 },
  {key:'frost', name:'Frost', th:'ฟรอสต์ ราชันน้ำแข็ง', emoji:'❄️', geo:()=>new THREE.OctahedronGeometry(2.6,0),  body:0x6fd8ff, emis:0x14384f, eye:0xffffff, shot:0x9fe6ff, scale:1.85, shotSpd:1.28, wordPick:8 },
  {key:'venom', name:'Venom', th:'เวน่อม พิษมรกต',      emoji:'🟢', geo:()=>new THREE.DodecahedronGeometry(2.3,0),body:0x6bd23a, emis:0x1d4a12, eye:0xeaff5a, shot:0x9bff5a, scale:1.85, shotSpd:1.1,  wordPick:9 },
  {key:'volt',  name:'Volt',  th:'โวลต์ สายฟ้า',         emoji:'⚡', geo:()=>new THREE.TetrahedronGeometry(2.8,0), body:0xffd23a, emis:0x5a4400, eye:0xfff2a0, shot:0xffe14d, scale:1.72, shotSpd:1.4,  wordPick:7 },
  {key:'titan', name:'Titan', th:'ไททัน เหล็กกล้า',      emoji:'🛡️', geo:()=>new THREE.BoxGeometry(3.4,3.4,3.4),  body:0x9aa7b4, emis:0x2a3540, eye:0xff8a8a, shot:0xcfe0ff, scale:2.05, shotSpd:0.85, wordPick:10 },
];
let mBossSpeciesIdx=0;
function pickBossSpecies(){ const sp=BOSS_SPECIES[mBossSpeciesIdx%BOSS_SPECIES.length]; mBossSpeciesIdx++; return sp; }
/* 🌊 รอบ 229: Endless Wave — เอเลี่ยนมาเป็นเวฟ เคลียร์ครบ→เวฟถัดไป (ยากขึ้น) · ทุกเวฟที่ 3 = Boss Wave */
const WAVE_BASE_GOAL=4, WAVE_BOSS_EVERY=3;
function waveCfg(w){
  const boss = w % WAVE_BOSS_EVERY === 0;                          // เวฟ 3,6,9… มีบอสปิดท้าย
  const goal = WAVE_BASE_GOAL + Math.floor((w-1)/2) + (boss?1:0);  // ยิ่งเวฟสูง ยิ่งต้องล้มเยอะ (+บอส)
  const conc = Math.min(3 + Math.floor(w/3), 6);                   // เอเลี่ยนพร้อมกันบนสนาม (เพดาน 6)
  const spd  = 1 + (w-1)*0.05;                                     // เอเลี่ยนยิงถี่/เร็วขึ้นตามเวฟ
  return {boss, goal, conc, spd};
}
let mWave=0, mWaveGoal=0, mWaveConc=3, mWaveKilled=0, mWaveSpawned=0, mWaveBoss=false, mWaveBossDone=false, mWaveSpd=1;
/* อาวุธต่อหุ่น (ผูกกับ robot_id ในตลาด) — ต่างกันที่ สี tracer · จังหวะยิง · ลูกเล่น (twin/spread/beam) */
const MECHA_WEAPONS={
  robot_01:{name:'หอกพลาสมา',   color:0xff4d4d, gap:300},
  robot_02:{name:'พลาสมาคู่',   color:0x37b6ff, gap:210, twin:true},
  robot_03:{name:'ชุดจรวด',     color:0x6bd07a, gap:360, arc:true},
  robot_04:{name:'เรลกัน',      color:0xffd24d, gap:340, rail:true},
  robot_05:{name:'หมัดสายฟ้า',  color:0x8fe6ff, gap:230, bolt:true},
  robot_06:{name:'พ่นไฟ',       color:0xff8a3a, gap:120, flame:true},
  robot_07:{name:'จานเลื่อย',   color:0xff6b6b, gap:260, saw:true},
  robot_08:{name:'เกาส์ช็อตกัน',color:0xffd23a, gap:330, spread:true},
  robot_09:{name:'ลำแสงไอออน',  color:0x7a6cff, gap:120, beam:true},
  robot_10:{name:'ปืนเยือกแข็ง',color:0xbfe9ff, gap:280, frost:true},
};
let mSpeed=0, mBobPhase=0, mStepDn=false, mLastFire=0;
let mFwdBtn=0, mStrafeBtn=0, mFireHeld=false;
let aliens=[], mechaWeapon=MECHA_WEAPONS.robot_01, mechaTracers=[], mFocusAlien=null;
let mhUI=null, mHeat=0, mHudAt=0;   // 🤖 รอบ 224: กรอบ HUD ห้องนักบิน (ภาพตามหุ่น + ค่าตัวเลขเรียลไทม์ + ความร้อนปืน)
let mOverheat=false, mHitAt=0, mLowHp=false;   // 🤖 รอบ 225: ปืนโอเวอร์ฮีต + iframe โดนตี + สถานะพลังงานต่ำ
let alienShots=[], powerups=[], mNextPowerAt=0;   // 🤖 รอบ 226: กระสุนเอเลี่ยน + ของเก็บ (คูลแดนต์/ซ่อม)
let mCombo=0, mShieldUntil=0;   // 🔥🛡️ รอบ 227: คอมโบยิงติดกัน + โล่พลังงาน
let mComboMax=0, mBossKills=0, mShotsFired=0, mShotsHit=0;   // 📊 รอบ 228: สถิติจบเกม (คอมโบสูงสุด/ล้มบอส/ความแม่น)

/* ============================================================
   📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
   Aviation English — เสียงพูด+ข้อความบนจอเป็นอังกฤษ (เด็กได้ซึมซับเพิ่ม)
   ใช้เสียงอังกฤษที่ดีที่สุดของเครื่อง (pickSpeakVoice เดียวกับระบบอ่านคำศัพท์)
   + เสียง "ซ่า-คลิก" squelch ก่อนพูด · รายงานลม/ทัศนวิสัย/ความสูง/
   เพื่อนร่วมน่านฟ้า · อนุญาตขึ้นบิน · ชมลงจอดนุ่ม · ครูฝึกลุ้นใกล้ได้เข็ม
   ============================================================ */
/* 🎙️ วลีตอบวิทยุของนักบิน (รอบ 67) — อังกฤษ + คำแปลไทย (เด็กไม่รู้จะตอบอะไรก็อ่านตามได้) */
const ATC_REPLIES=[
  ['Roger!','รับทราบ!'],
  ['Copy that, tower!','ทราบแล้ว หอบังคับ!'],
  ['Wilco!','จะปฏิบัติตาม!'],
];
const ATC_CLOSERS=[
  'Good copy, captain.',
  'Loud and clear, captain. Tower out.',
  'Read you loud and clear. Safe flying!',
];
const ATC={
  el:null, replyEl:null, nextAt:0, _tm:0, _rtm:0, voice:null, voiceTried:false,
  WINDS:['north','northeast','east','southeast','south','southwest','west','northwest'],
  enVoice(){
    if(this.voiceTried) return this.voice;
    try{
      if(typeof pickSpeakVoice==='function'){ this.voice=pickSpeakVoice(); this.voiceTried=true; return this.voice; }
      const find=()=>{ const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)); if(vs.length) this.voice=vs[0]; };
      find();
      if(!this.voice) speechSynthesis.addEventListener('voiceschanged',find,{once:true});
      this.voiceTried=true;
    }catch(e){ this.voiceTried=true; }
    return this.voice;
  },
  say(text,noReply){
    if(this.el){
      this.el.textContent='📻 '+text;
      this.el.classList.add('show');
      clearTimeout(this._tm);
      this._tm=setTimeout(()=>this.el.classList.remove('show'),6500);
    }
    HeliSound.squelch();
    // เสียงพูดอังกฤษ (เสียงดีสุดที่เครื่องมี) — ไม่พูดทับของเก่า
    if(state.sound && 'speechSynthesis' in window && !speechSynthesis.speaking){
      try{
        const u=new SpeechSynthesisUtterance(text);
        u.lang='en-US'; u.rate=.98; u.pitch=.85; u.volume=.9;   // โทนต่ำนิดๆ แบบเจ้าหน้าที่หอ
        const v=this.enVoice(); if(v) u.voice=v;
        setTimeout(()=>{ try{ speechSynthesis.speak(u); }catch(e){} },180);  // รอ squelch จบ
      }catch(e){}
    }
    // 🎙️ หอพูดจบ → เปิดปุ่มให้นักบินตอบ (ยกเว้นประโยคปิดท้าย)
    if(noReply) this.hideReply(); else this.showReply();
  },
  showReply(){
    if(!this.replyEl) return;
    this.replyEl.classList.add('show');
    clearTimeout(this._rtm);
    this._rtm=setTimeout(()=>this.hideReply(),9000);
  },
  hideReply(){
    if(!this.replyEl) return;
    clearTimeout(this._rtm);
    this.replyEl.classList.remove('show');
  },
  reply(i){
    const r=ATC_REPLIES[i]; if(!r) return;
    this.hideReply();
    sfx.select();
    if(this.el){                                  // echo คำตอบของเราขึ้นจอวิทยุ
      this.el.textContent='🎙️ '+r[0]+' — '+r[1];
      this.el.classList.add('show');
      clearTimeout(this._tm);
      this._tm=setTimeout(()=>this.el.classList.remove('show'),3500);
    }
    if(state.sound && 'speechSynthesis' in window){
      try{
        speechSynthesis.cancel();                 // ตัดเสียงหอ (ตอบแทรกแบบวิทยุจริง)
        const u=new SpeechSynthesisUtterance(r[0]);
        u.lang='en-US'; u.rate=1.0; u.pitch=1.18; u.volume=.95;  // โทนสูงขึ้น = เสียงนักบินตัวน้อย
        const v=this.enVoice(); if(v) u.voice=v;
        speechSynthesis.speak(u);
      }catch(e){}
    }
    if(Math.random()<.5) setTimeout(()=>{         // หอตอบปิดท้ายเป็นครั้งคราว
      if(running) this.say(ATC_CLOSERS[Math.floor(Math.random()*ATC_CLOSERS.length)],true);
    },2000);
  },
  pick(){
    const alt=Math.round(Math.max(0,camera.position.y-HELI_SKID));
    const wd=this.WINDS[Math.floor(Math.random()*this.WINDS.length)];
    const ws=5+Math.floor(Math.random()*16);
    const msgs=[
      `Tower to captain: wind from the ${wd} at ${ws} kilometers per hour.`,
      'Visibility is excellent. Clear skies. Enjoy your flight, captain.',
      `Your altitude is ${alt} meters. Keep it steady, captain.`,
      'Letters are waiting on the rooftops. Land gently, captain.',
      `Weather report: light ${wd} wind. Perfect flying conditions.`,
    ];
    if(alt>38) msgs.push('You are flying very high, captain. Watch your descent rate.');
    if(Object.keys(peers).length) msgs.push('Traffic alert: another helicopter is in your airspace. Keep your distance, captain.');
    if((state.heliStreak||0)>2) msgs.push(`Your no-crash streak is ${state.heliStreak} words. Excellent flying, captain!`);
    return msgs[Math.floor(Math.random()*msgs.length)];
  },
  tick(now){
    if(!running || !HeliSound.ready) return;
    if(!this.nextAt) this.nextAt=now+18000;               // ข้อความสภาพแวดล้อมแรก ~18 วิหลังพร้อมบิน
    if(now<this.nextAt) return;
    if(now-lastBanAt<4000 || (banEl && banEl.classList.contains('stay'))) return; // ไม่พูดทับจังหวะฉลอง/KO
    this.nextAt=now+45000+Math.random()*30000;            // คุยทุก ~45–75 วิ
    this.say(this.pick());
  },
  reset(){
    this.nextAt=0;
    clearTimeout(this._tm);
    if(this.el) this.el.classList.remove('show');
    this.hideReply();
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  },
};
let yaw=0, pitch=0;
let hp=100, maxHp=100, sessionCoins=0, sessionWords=0;   // 🤖 รอบ 236: maxHp ต่อโลก (โลกหุ่น=MECHA_MAX_HP · อื่นๆ=100)
let hauntLives=HAUNT_LIVES, hurtUntil=0;   // 👻 ระบบหัวใจโลกผี + ช่วงกันโดนซ้ำ
let hauntRunStart=0, hauntRecordShown=false;   // ⏱ รอบ 256: จับเวลา "หนีผีรอดนานสุด" (รอดต่อเนื่องไม่โดนจับ · สถิติใน state.hauntSurviveBest)
let sessionWordLog=[];             // 📖 คำที่ประกอบสำเร็จรอบนี้ {en,th} — โชว์เป็นสมุดคำศัพท์ตอนออก (ทบทวนคำ)
let inv={};                       // ตัวอักษรในกระเป๋า {a:2,...}
let words=[];                     // guideline [{en,th}]
let letters=[];                   // ตัวอักษรในโลก [{ch,spr,born}]
let monsters=[];                  // adv: [{spr,hp,tgt,wanderAt,hitAt}] · haunt(ผี): [{spr,born,hunting,wailAt,tgt,wanderAt}]
let shots=[];                     // [{mesh,dir,life}]
let keys={}, joy={on:false,dx:0,dy:0}, lookTouch=null, lastShot=0, lastEnsure=0, lastSpawn=0;
let dmgFlashEl, hudWordsEl, hudInvEl, hudHpEl, hudCoinEl, hudHuntEl, hudHeartEl, hudSurvEl, hudBoardEl, mapCv, mapCtx, banEl, overlayEl, canvasEl, scareEl, hintEl, introEl;
let texCache={};

/* ---------- multiplayer ---------- */
let peers={};                     // uid → {spr, cur:{x,z}, tgt:{x,z}, n, av, bubble, lastCt}
let worldRef=null, myRef=null, lastNetSend=0, lastSent=null;
let lastSharedDone=null;          // 🤝 คำล่าสุดที่ประกอบเสร็จ — กันลูกทีมที่ทำเสร็จก่อนวนกลับไปรับคำเดิมของหัวหน้า
/* แชทลอยหัวแบบ Roblox: พิมพ์สั้นๆ โชว์เหนือหัว BUBBLE_MS */
const CHAT_MAX=60, BUBBLE_MS=5000;
let myChat=null;                  // {text, ts} — แนบไปกับ sendPos ระหว่างยังสด (ct ใช้ Date.now คงที่ กันเด้งซ้ำ)
let chatBoxEl=null, chatInputEl=null, selfMsgEl=null;

/* ============================================================
   คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
   ============================================================ */
function doneList(){ return state[M.doneKey]; }
function wordPool(second){
  const cur = words.map(w=>w.en);
  let pool = vocabForStudent()
    .filter(([en])=>/^[a-z]{2,9}$/i.test(en))
    .filter(([en])=>!doneList().includes(en.toLowerCase()) && !cur.includes(en.toLowerCase()));
  if(!pool.length && second!==true){
    // ประกอบครบทุกคำในระดับชั้นแล้ว → เริ่มรอบใหม่ (คำเติมไม่มีวันหมดตามสเปก 8.6)
    state[M.doneKey] = [];
    saveState();
    return wordPool(true);
  }
  return pool;
}
function pickWords(n){
  return shuffle(wordPool()).slice(0,n).map(([en,th])=>({en:en.toLowerCase(), th}));
}

/* ============================================================
   Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
   ============================================================ */
const TILE_COLORS = ['#ff8a65','#4fc3f7','#aed581','#ffd54f','#ba68c8','#f06292','#4dd0e1','#ff8a80'];
function letterTexture(ch){
  const key='L'+ch;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const col=TILE_COLORS[(ch.charCodeAt(0)-97)%TILE_COLORS.length];
  c.beginPath(); c.roundRect(8,8,112,112,26);
  c.fillStyle=col; c.fill();
  c.lineWidth=8; c.strokeStyle='rgba(255,255,255,.9)'; c.stroke();
  c.fillStyle='#fff'; c.font='900 84px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(ch.toUpperCase(),64,72);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
function emojiTexture(emo){
  const key='E'+emo;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.font='100px serif'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(emo,64,70);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
/* 👻 ภาพผีไทย (อัปเกรดจาก emoji) — วาง img/ghosts/ghost_1.png … ghost_5.png (PNG โปร่งใส 1024×1024)
   ภาพไหนโหลดได้ใช้แทน emoji · ผีที่ลอยอยู่แล้วสลับภาพตอน respawn (ทุก 20 วิ) · prompt ใน PROMPTS_GHOSTS.md */
const GHOST_IMG_MAX=5;
const ghostTex=[];
let ghostProbed=false;
let ghostProbeLeft=0;      // จำนวนภาพที่ยัง probe ไม่เสร็จ (โหลดสำเร็จ/พลาด)
let onGhostReady=null;     // callback เรียกครั้งเดียวเมื่อ probe ครบทุกภาพ
let ghostGen=0;            // token ทุกครั้งที่ล้าง/เปลี่ยนด่าน — กัน spawn ที่ค้างอยู่ปล่อยผีผิดด่าน
// วัดกรอบตัวผี (พิกเซลไม่โปร่งใส) ตอนโหลด → คืนสัดส่วนไว้ฟิตสเกลอัตโนมัติ (ไม่ต้อง hardcode ทีละตัว · ครอบภาพผีที่เจนใหม่ในอนาคตด้วย)
function measureGhostBox(img){
  const cw=img.naturalWidth||img.width, ch=img.naturalHeight||img.height, aspect=cw/ch;
  const w=160, h=Math.max(1,Math.round(160*ch/cw));    // ย่อวัดพอ (สัดส่วนเท่าเดิม เร็วกว่าสแกนเต็มภาพ)
  try{
    const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
    const x=cv.getContext('2d'); x.drawImage(img,0,0,w,h);
    const d=x.getImageData(0,0,w,h).data;
    let top=h, bot=-1;
    for(let y=0;y<h;y++){ for(let px=0;px<w;px++){ if(d[(y*w+px)*4+3]>16){ if(y<top)top=y; bot=y; break; } } }
    if(bot<top) return {aspect, fhFrac:.95, belowFrac:.03};   // ภาพโปร่งหมด → ค่ากันเหนียว
    return {aspect, fhFrac:(bot-top+1)/h, belowFrac:(h-1-bot)/h};  // สัดส่วนตัว + ระยะขอบล่างถึงเท้า
  }catch(e){ return {aspect, fhFrac:.95, belowFrac:.03}; }     // canvas tainted → เดาสัดส่วน
}
function probeGhostImages(){
  if(ghostProbed) return; ghostProbed=true;
  ghostProbeLeft=GHOST_IMG_MAX;
  const settle=()=>{ if(--ghostProbeLeft<=0 && onGhostReady){ const f=onGhostReady; onGhostReady=null; f(); } };  // ครบทุกภาพ → เรียก callback
  for(let i=1;i<=GHOST_IMG_MAX;i++){
    const img=new Image();                             // probe ด้วย Image (ห้าม fetch local — กติกาเดียวกับ probeImages)
    img.onload=()=>{ const t=new THREE.Texture(img); t.needsUpdate=true; t.userData=Object.assign({gi:i},measureGhostBox(img)); ghostTex.push(t); settle(); };  // gi=เลขไฟล์ + สัดส่วนตัวจริง
    img.onerror=settle;                                // ภาพหาย/โหลดพลาด ก็นับว่า settle (ไม่ให้ค้างรอ)
    img.src='img/ghosts/ghost_'+i+'.png';
  }
}
// เรียก cb เมื่อภาพผีพร้อม (probe ครบทุกภาพแล้ว ไม่ว่าโหลดได้กี่ภาพ) · ถ้าครบอยู่แล้ว → เรียกทันที
function whenGhostsReady(cb){
  if(!ghostProbed || ghostProbeLeft<=0) cb();
  else onGhostReady=cb;
}
function ghostTexture(){
  if(ghostTex.length) return ghostTex[Math.floor(Math.random()*ghostTex.length)];
  return emojiTexture(M.ghostEmoji[Math.floor(Math.random()*M.ghostEmoji.length)]);
}
// jump scare: คืน src ภาพผีสุ่มตัว (ถ้าผู้ใช้วางภาพแล้ว) ไม่มี = null → ใช้ emoji 👻 เต็มจอเดิม
function ghostScareSrc(){
  if(!ghostTex.length) return null;
  const t=ghostTex[Math.floor(Math.random()*ghostTex.length)];
  return (t.image && t.image.src) || null;
}
/* 📢 ป้ายโฆษณาบนยอดตึก (รอบ 58) — พื้นหลังคนละสไตล์ต่อป้าย + เลขป้ายมุมซ้ายเสมอ
   ยังไม่มีลูกค้า = ข้อความ "ติดต่อโฆษณา โทร 064-357 6645"
   วางไฟล์ img/ads/ad_<เลข>.png (สัดส่วน 8:3 เช่น 1024×384) → ภาพลูกค้าขึ้นแทนทันที */
const AD_STYLES=[
  ['#ff8a80','#b71c1c','#fff'],['#81d4fa','#0d47a1','#fff'],['#c5e1a5','#33691e','#1b3609'],
  ['#ffd54f','#e65100','#5d3a00'],['#ce93d8','#4a148c','#fff'],['#f8bbd0','#880e4f','#fff'],
  ['#80cbc4','#004d40','#fff'],['#ffab91','#bf360c','#fff'],['#cfd8dc','#263238','#eceff1'],
  ['#fff59d','#f9a825','#5d3a00'],
];
function adBoardTexture(n){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=192;
  const c=cv.getContext('2d');
  const [c1,c2,tc]=AD_STYLES[(n-1)%AD_STYLES.length];
  const tex=new THREE.CanvasTexture(cv);
  const draw=(img)=>{
    const g=c.createLinearGradient(0,0,512,192);
    g.addColorStop(0,c1); g.addColorStop(1,c2);
    c.fillStyle=g; c.fillRect(0,0,512,192);
    // ลวดลายพื้นหลังต่างกัน 3 ตระกูล (แถบ/จุด/ดาว) สลับตามเลขป้าย
    c.globalAlpha=.14; c.fillStyle='#fff';
    if(n%3===0){ for(let x=0;x<512;x+=64) c.fillRect(x,0,20,192); }
    else if(n%3===1){ for(let x=28;x<512;x+=72) for(let y=28;y<192;y+=68){ c.beginPath(); c.arc(x,y,13,0,7); c.fill(); } }
    else{ c.font='40px serif'; for(let x=14;x<512;x+=92) c.fillText('✦',x,58+((x/92|0)%2)*84); }
    c.globalAlpha=1;
    if(img){
      c.drawImage(img,6,6,500,180);                    // โฆษณาลูกค้าเต็มป้าย (เว้นกรอบ 6px)
    }else{
      c.fillStyle=tc; c.textAlign='center';
      c.font='900 42px Kanit, Tahoma, Arial'; c.fillText('ติดต่อโฆษณา',256,76);
      c.font='900 50px Kanit, Tahoma, Arial'; c.fillText('โทร 064-357 6645',256,142);
    }
    // กรอบขาว + เลขป้าย (โชว์ตลอดแม้มีโฆษณา — ลูกค้าใช้อ้างอิงว่าลงป้ายไหน)
    c.lineWidth=8; c.strokeStyle='rgba(255,255,255,.9)'; c.strokeRect(4,4,504,184);
    c.fillStyle='rgba(0,0,0,.68)';
    c.beginPath(); c.roundRect(10,10,92,38,10); c.fill();
    c.fillStyle='#ffd54f'; c.font='900 24px Arial'; c.textAlign='center';
    c.fillText('ป้าย '+n,56,37);
    tex.needsUpdate=true;
  };
  draw(null);
  const img=new Image();                               // probe ภาพลูกค้า (กติกาเดียวกับ probeImages)
  img.onload=()=>draw(img);
  img.src='img/ads/ad_'+n+'.png';
  return tex;
}
/* 📢 รอบ 204: ป้ายโฆษณาตั้งพื้น (แผ่น 8:3 บนเสา 2 ต้น) — ใช้ adBoardTexture (โชว์ "ติดต่อโฆษณา โทร 064-357 6645"
   ตราบใดที่ยังไม่มีไฟล์ img/ads/ad_<n>.png) · ติดในโลกที่ยังไม่มีป้าย (adv/haunt/drone/soccer/mecha) */
let _adSeq=AD_COUNT;                                    // เลขป้ายเริ่มต่อจากเฮลิฯ (กันชน ad_<n>.png)
function addAdBillboard(sc,n,x,z,angle,groundY){
  const pw=7, ph=pw*3/8, postH=3;
  const g=new THREE.Group();
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),
    new THREE.MeshBasicMaterial({map:adBoardTexture(n),side:THREE.DoubleSide}));
  panel.position.y=postH+ph/2; g.add(panel);
  const poleG=new THREE.CylinderGeometry(.13,.13,postH+ph,6), poleM=new THREE.MeshLambertMaterial({color:0x37474f});
  [-pw/3,pw/3].forEach(off=>{ const p=new THREE.Mesh(poleG,poleM); p.position.set(off,(postH+ph)/2,0); g.add(p); });
  g.position.set(x,groundY||0,z); g.rotation.y=angle; sc.add(g);
}
/* วางป้ายเป็นวงรอบสนาม หันหน้าเข้ากลาง · tr!=null = เพิ่มกันชน (โลกเดิน) */
function ringAds(sc,count,radius,groundY,tr){
  for(let i=0;i<count;i++){
    const a=(i+.5)/count*Math.PI*2, x=Math.cos(a)*radius, z=Math.sin(a)*radius;
    addAdBillboard(sc,++_adSeq,x,z,Math.atan2(-x,-z),groundY);
    if(tr) tr.push({x,z,r:1.4});
  }
}

/* 🏙️ ผนังตึกโลกเฮลิฯ — default วาดหน้าต่างเรียงชั้น (procedural) ให้ดูมีมิติกว่ากล่องสีล้วน
   วางไฟล์ img/buildings/facade_<n>.png (n=1..6 · ภาพต่อกันได้/seamless จัตุรัส) → ผนังจริงขึ้นแทน tile ขึ้นตึกอัตโนมัติ
   prompt อยู่ใน PROMPTS_BUILDINGS.md */
const BUILDING_TINTS=[0x9fb2c8,0xc8b89f,0xb0c8a8,0xc8a8b8,0x9fc8c4,0xbfae90];
function buildingFacadeTexture(n){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;            // tile ซ้ำขึ้นตึก (repeat ตั้งตามขนาดตึกตอนสร้าง)
  const base='#'+('000000'+BUILDING_TINTS[(n-1)%BUILDING_TINTS.length].toString(16)).slice(-6);
  const drawProc=()=>{
    c.fillStyle=base; c.fillRect(0,0,128,128);
    for(let gy=0;gy<3;gy++)for(let gx=0;gx<3;gx++){       // หน้าต่าง 3×3 ต่อกระเบื้อง (บางบานติดไฟ)
      c.fillStyle=Math.random()<.45?'rgba(255,236,170,.92)':'rgba(28,38,54,.85)';
      c.fillRect(gx*42+9,gy*42+9,26,30);
    }
    tex.needsUpdate=true;
  };
  drawProc();
  const img=new Image();                               // probe รูปผนังจริง (กติกาเดียวกับ probeImages)
  img.onload=()=>{ tex.image=img; tex.needsUpdate=true; };
  img.src='img/buildings/facade_'+n+'.png';
  return tex;
}

/* ป้ายผู้เล่นคนอื่น: ชื่อ + ภาพตัวละคร (player_male/female.png ถ้ามี · ไม่มีใช้อีโมจิ)
   โหมดเฮลิคอปเตอร์: เพื่อนเป็น 🚁 บินอยู่ (ตำแหน่ง+ความสูงจริงจาก /world) */
function makePeerSprite(name, av){
  const cv=document.createElement('canvas'); cv.width=128; cv.height=170;
  const tex=new THREE.CanvasTexture(cv);
  const flyMode=M.heli||M.drone;
  const draw=(img)=>{
    const c=cv.getContext('2d');
    c.clearRect(0,0,128,170);
    c.fillStyle='rgba(0,0,0,.55)';
    c.beginPath(); c.roundRect(4,2,120,30,12); c.fill();
    c.fillStyle='#fff'; c.font='bold 19px Arial'; c.textAlign='center'; c.textBaseline='middle';
    let nm=(name||'เพื่อน'); if(nm.length>9) nm=nm.slice(0,8)+'…';
    c.fillText(nm,64,18);
    if(flyMode){
      // 🚁 รอบ 355: โลกเฮลิฯ อ่านเฟสของเพื่อนจาก av ('h_w'=เดิน 'h_r'=นั่งโดยสาร 'h_g'=วิงสูท 'h_p'=ขับ)
      const em=M.drone?'🛸':(av&&av.slice(0,2)==='h_'?({w:'🚶',r:'💺',g:'🪂',p:'🚁'}[av.charAt(2)]||'🚁'):'🚁');
      c.font='96px serif'; c.fillText(em,64,105);
    }
    else if(img){ c.drawImage(img,14,36,100,130); }
    else{ c.font='90px serif'; c.fillText(av==='male'?'👦':'👧',64,105); }
    tex.needsUpdate=true;
  };
  draw(null);
  if(!flyMode && (av==='male' || av==='female')){
    const img=new Image();
    img.onload=()=>draw(img);
    img.src='img/player_'+av+'.png';
  }
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  spr.scale.set(flyMode?2.4:1.7,flyMode?2.4:2.26,1);
  return spr;
}

/* ============================================================
   🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
   สไตล์ของเล่นบล็อกทั่วไป ออกแบบเอง (ห้ามก๊อปทรงมินิฟิกเกอร์การค้า — เครื่องหมายการค้า)
   ส่งรหัสผ่าน field av เดิมใน /world ('blk1'..'blk8' ≤8 ตัวอักษร ผ่าน rules เดิม ไม่ต้อง publish ใหม่)
   geometry/material แชร์ร่วมกันทุกตัว (cache ไม่ dispose) — ต่อ peer มีของตัวเองแค่ป้ายชื่อ
   ============================================================ */
const BLOCK_AVATARS={
  blk1:{name:'เรซเซอร์แดง',  skin:0xffcf9e, shirt:0xe53935, pants:0x1e58c8, hair:0x2b2320, style:'flat', car:0xd32f2f},
  blk2:{name:'กัปตันฟ้า',    skin:0xffd9ae, shirt:0x29b6f6, pants:0x274a8f, hair:0x6d4c2f, style:'tall', car:0x0288d1},
  blk3:{name:'ชาเขียว',      skin:0xf2b98a, shirt:0x43a047, pants:0x7a6a4f, hair:0xef6c00, style:'cap',  car:0x2e7d32},
  blk4:{name:'ซันนี่ส้ม',    skin:0xffcf9e, shirt:0xfb8c00, pants:0x5d4037, hair:0x232323, style:'pony', car:0xef6c00, blush:true},
  blk5:{name:'วิซาร์ดม่วง',  skin:0xffd9ae, shirt:0x8e24aa, pants:0x4e5a63, hair:0xffca28, style:'flat', car:0x6a1b9a},
  blk6:{name:'พิ้งกี้',      skin:0xffe0bd, shirt:0xf06292, pants:0xfafafa, hair:0x8d5a3b, style:'pony', car:0xec407a, blush:true},
  blk7:{name:'เลม่อน',       skin:0xf2b98a, shirt:0xfdd835, pants:0x33691e, hair:0x232323, style:'cap',  car:0xf9a825},
  blk8:{name:'มิ้นตี้',      skin:0xffd9ae, shirt:0x4db6ac, pants:0x37474f, hair:0xf5f5f5, style:'tall', car:0x00897b, blush:true},
};
const _blkGeo={}, _blkMat={}, _blkFace={}, _blkThumbs={};
function blkGeo(w,h,d){ const k=w+'_'+h+'_'+d; return _blkGeo[k]||(_blkGeo[k]=new THREE.BoxGeometry(w,h,d)); }
function blkMat(color){ return _blkMat[color]||(_blkMat[color]=new THREE.MeshLambertMaterial({color})); }
function blkCyl(r,h){ const k='c'+r+'_'+h; return _blkGeo[k]||(_blkGeo[k]=new THREE.CylinderGeometry(r,r,h,14)); }
/* หน้ายิ้มตาโต วาดลง texture ด้าน -Z ของหัว (ทิศหน้ารถ) */
function blkFaceMat(id){
  if(_blkFace[id]) return _blkFace[id];
  const a=BLOCK_AVATARS[id], cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.fillStyle='#'+('000000'+a.skin.toString(16)).slice(-6); c.fillRect(0,0,128,128);
  [[42,56],[86,56]].forEach(([x,y])=>{
    c.fillStyle='#1c1c1c'; c.beginPath(); c.arc(x,y,12,0,7); c.fill();
    c.fillStyle='#fff'; c.beginPath(); c.arc(x+4,y-4,4.5,0,7); c.fill();
  });
  if(a.blush){ c.fillStyle='rgba(255,120,130,.45)'; [[24,82],[104,82]].forEach(([x,y])=>{ c.beginPath(); c.arc(x,y,10,0,7); c.fill(); }); }
  c.strokeStyle='#8d4a35'; c.lineWidth=6; c.lineCap='round';
  c.beginPath(); c.arc(64,72,20,Math.PI*.22,Math.PI*.78); c.stroke();
  return _blkFace[id]=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(cv)});
}
/* หุ่นบล็อกยืน/นั่ง สูง ~1.7 หน่วย หันหน้า -Z (seated=ไม่มีขา แขนเอื้อมจับพวงมาลัย) */
function makeBlockFigure(id, seated){
  const a=BLOCK_AVATARS[id]||BLOCK_AVATARS.blk1;
  const g=new THREE.Group();
  const skin=blkMat(a.skin), shirt=blkMat(a.shirt), pants=blkMat(a.pants), hairM=blkMat(a.hair);
  const hipY=seated?0:.5;
  // ท่ายืน: แขน-ขาห้อยจาก pivot ที่สะโพก/หัวไหล่ (ท่าพักหน้าตาเท่าเดิม แต่หมุน rotation.x แกว่งเดินได้)
  g.userData.limbs=[];                       // [ขาซ้าย, ขาขวา, แขนซ้าย, แขนขวา] — เฉพาะท่ายืน
  if(!seated) [-0.15,0.15].forEach(x=>{
    const piv=new THREE.Group(); piv.position.set(x,.5,0);
    const leg=new THREE.Mesh(blkGeo(.24,.5,.28),pants); leg.position.y=-.25; piv.add(leg);
    g.add(piv); g.userData.limbs.push(piv);
  });
  const torso=new THREE.Mesh(blkGeo(.6,.6,.36),shirt); torso.position.y=hipY+.3; g.add(torso);
  [-1,1].forEach(s=>{
    if(seated){
      const arm=new THREE.Mesh(blkGeo(.17,.46,.22),shirt);
      arm.position.set(s*.41,hipY+.34,-.12); arm.rotation.z=s*-.12; arm.rotation.x=-1.0;
      const hand=new THREE.Mesh(blkGeo(.16,.14,.18),skin); hand.position.y=-.3; arm.add(hand);
      g.add(arm);
    }else{
      const piv=new THREE.Group(); piv.position.set(s*.41,hipY+.57,0);
      const arm=new THREE.Mesh(blkGeo(.17,.46,.22),shirt); arm.position.y=-.23; arm.rotation.z=s*-.12;
      const hand=new THREE.Mesh(blkGeo(.16,.14,.18),skin); hand.position.y=-.3; arm.add(hand);
      piv.add(arm); g.add(piv); g.userData.limbs.push(piv);
    }
  });
  const head=new THREE.Mesh(blkGeo(.5,.46,.46),[skin,skin,skin,skin,skin,blkFaceMat(id)]);
  head.position.y=hipY+.86; g.add(head);
  const topY=hipY+1.09;
  if(a.style==='cap'){
    const cap=new THREE.Mesh(blkGeo(.56,.16,.52),hairM); cap.position.y=topY+.05; g.add(cap);
    const brim=new THREE.Mesh(blkGeo(.56,.07,.3),hairM); brim.position.set(0,topY,-.38); g.add(brim);
  }else{
    const hair=new THREE.Mesh(blkGeo(.54,a.style==='tall'?.3:.14,.5),hairM);
    hair.position.y=topY+(a.style==='tall'?.13:.05); g.add(hair);
    if(a.style==='pony'){ const tail=new THREE.Mesh(blkGeo(.18,.34,.16),hairM); tail.position.set(0,hipY+.92,.3); g.add(tail); }
  }
  return g;
}
/* รถบล็อกเปิดประทุน หัวรถ -Z พวงมาลัยขวาแบบไทย · ล้อเก็บใน userData.wheels ให้หมุนตอนวิ่ง */
function makeBlockCar(id){
  const a=BLOCK_AVATARS[id]||BLOCK_AVATARS.blk1;
  const g=new THREE.Group();
  const body=blkMat(a.car), dark=blkMat(0x2b3136), glass=blkMat(0xbfe3ff), lamp=blkMat(0xfff59d);
  const base=new THREE.Mesh(blkGeo(1.9,.6,4.1),body); base.position.y=.75; g.add(base);
  const shield=new THREE.Mesh(blkGeo(1.7,.5,.09),glass); shield.position.set(0,1.28,-.62); shield.rotation.x=-.2; g.add(shield);
  const seatback=new THREE.Mesh(blkGeo(1.7,.55,.26),body); seatback.position.set(0,1.28,1.15); g.add(seatback);
  [-.45,.45].forEach(x=>{ const stud=new THREE.Mesh(blkCyl(.17,.09),body); stud.position.set(x,1.09,-1.45); g.add(stud); });
  [-.6,.6].forEach(x=>{ const hl=new THREE.Mesh(blkGeo(.24,.18,.07),lamp); hl.position.set(x,.86,-2.06); g.add(hl); });
  // 🚦 รอบ 132: ไฟเลี้ยวส้ม 4 มุม (หน้า-ท้าย ซ้าย/ขวา) — ซ่อนไว้ tickPeers สั่งกะพริบตาม field tl
  const blink=blkMat(0xff9800);
  g.userData.blinkL=[]; g.userData.blinkR=[];
  [[-1,'blinkL'],[1,'blinkR']].forEach(([sx,key])=>{
    [-2.06,2.06].forEach(z=>{
      const b=new THREE.Mesh(blkGeo(.16,.15,.07),blink);
      b.position.set(sx*.82,1.0,z); b.visible=false;
      g.add(b); g.userData[key].push(b);
    });
  });
  // ⬜ รอบ 140: ไฟถอยหลังขาว 2 ดวงท้ายรถ (+Z) — เครื่องเพื่อนคำนวณเองจากทิศวิ่งสวนหัวรถ ไม่มี field ใหม่ (rules tl ล็อก 0-2)
  const revM=blkMat(0xffffff);
  g.userData.revs=[];
  [-.45,.45].forEach(x=>{
    const m=new THREE.Mesh(blkGeo(.2,.15,.07),revM);
    m.position.set(x,.86,2.06); m.visible=false;
    g.add(m); g.userData.revs.push(m);
  });
  // 🔴 รอบ 141: ไฟเบรคแดง 2 ดวงท้ายรถ (ริมนอก ใต้ไฟเลี้ยว) — เครื่องเพื่อนคำนวณจากอัตราชะลอ ไม่มี field ใหม่
  const brkM=blkMat(0xd50000);
  g.userData.brks=[];
  [-.82,.82].forEach(x=>{
    const m=new THREE.Mesh(blkGeo(.24,.18,.07),brkM);
    m.position.set(x,.86,2.06); m.visible=false;
    g.add(m); g.userData.brks.push(m);
  });
  g.userData.wheels=[];
  [[-1,-1.35],[1,-1.35],[-1,1.35],[1,1.35]].forEach(([sx,z])=>{
    const hold=new THREE.Group(); hold.position.set(sx*.97,.5,z);
    const wh=new THREE.Mesh(blkCyl(.5,.32),dark); wh.rotation.z=Math.PI/2; hold.add(wh);
    const hub=new THREE.Mesh(blkCyl(.2,.34),blkMat(0xcfd8dc)); hub.rotation.z=Math.PI/2; hold.add(hub);
    g.add(hold); g.userData.wheels.push(hold);
  });
  return g;
}
/* ป้ายชื่อลอยหัว (ของเฉพาะ peer — dispose ตอนออก) */
function blkNameSprite(name){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=64;
  const c=cv.getContext('2d');
  c.fillStyle='rgba(0,0,0,.55)'; c.beginPath(); c.roundRect(8,6,240,52,20); c.fill();
  c.fillStyle='#fff'; c.font='bold 28px Arial'; c.textAlign='center'; c.textBaseline='middle';
  let nm=name||'เพื่อน'; if(nm.length>14) nm=nm.slice(0,13)+'…';
  c.fillText(nm,128,32);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true}));
  spr.scale.set(2.7,.68,1); spr.userData.own=true;
  return spr;
}
/* เพื่อนในโลกขับรถ = รถบล็อก + หุ่นบล็อกนั่งขับ + ป้ายชื่อ · av ไม่ใช่ blk (client เก่า) → สุ่มคงที่จาก uid */
function makeBlockPeer(name, av, uid){
  const bid=BLOCK_AVATARS[av]?av:'blk'+(1+String(uid||'').split('').reduce((h,ch)=>(h*31+ch.charCodeAt(0))>>>0,0)%8);
  const g=new THREE.Group();
  g.add(makeBlockCar(bid));
  const fig=makeBlockFigure(bid,true); fig.position.set(.35,1.02,.3); g.add(fig);
  const label=blkNameSprite(name); label.position.set(0,2.85,0); g.add(label);
  g.userData.wheels=g.children[0].userData.wheels;
  g.userData.blinkL=g.children[0].userData.blinkL;   // 🚦 ให้ tickPeers สั่งไฟเลี้ยวกะพริบได้ตรงๆ
  g.userData.blinkR=g.children[0].userData.blinkR;
  g.userData.revs=g.children[0].userData.revs;       // ⬜ รอบ 140: ไฟถอยหลังขาว
  g.userData.brks=g.children[0].userData.brks;       // 🔴 รอบ 141: ไฟเบรคแดง
  return g;
}
/* เพื่อนในโลกเดิน (adv/haunt) = หุ่นบล็อกเต็มตัวยืนบนพื้น เดินแกว่งแขน-ขาจริง + ป้ายชื่อ */
function makeBlockWalkPeer(name, av, uid){
  const bid=BLOCK_AVATARS[av]?av:'blk'+(1+String(uid||'').split('').reduce((h,ch)=>(h*31+ch.charCodeAt(0))>>>0,0)%8);
  const g=new THREE.Group();
  const fig=makeBlockFigure(bid,false); g.add(fig);
  const label=blkNameSprite(name); label.position.set(0,2.25,0); g.add(label);
  g.userData.limbs=fig.userData.limbs;      // ให้ tickPeers หมุนแกว่งได้ตรงๆ
  return g;
}
function disposeBlockPeer(g){
  g.traverse(o=>{ if(o.userData&&o.userData.own){ if(o.material.map)o.material.map.dispose(); o.material.dispose(); } });
}

/* ---------- 🧱 หน้าต่างเลือกตัวละครบล็อกก่อนออกรถ (เรียกจาก ui.js ก่อน start('drive')) ---------- */
function blkBuildThumbs(){
  if(_blkThumbs.blk1) return;
  const rend=new THREE.WebGLRenderer({alpha:true,antialias:true});
  rend.setSize(150,190);
  const sc=new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xffffff,0x999999,1.1));
  const sun=new THREE.DirectionalLight(0xfff2cc,.75); sun.position.set(-2,4,-3); sc.add(sun);
  const cam=new THREE.PerspectiveCamera(34,150/190,.1,10);
  cam.position.set(.75,1.25,-2.9); cam.lookAt(0,.82,0);
  Object.keys(BLOCK_AVATARS).forEach(id=>{
    const fig=makeBlockFigure(id,false); fig.rotation.y=-.35; sc.add(fig);
    rend.render(sc,cam);
    _blkThumbs[id]=rend.domElement.toDataURL();
    sc.remove(fig);
  });
  rend.dispose();
}
let blkPickEl=null, blkPickSel=null, blkPickRes=null;
function blkBuildPicker(){
  if(blkPickEl) return;
  const st=document.createElement('style');
  st.textContent=`
  #blk-pick{position:fixed;inset:0;z-index:120;background:rgba(10,14,24,.72);display:none;
    align-items:center;justify-content:center;font-family:inherit}
  #blk-pick.on{display:flex}
  /* รอบ 145 (สเปกผู้ใช้): แผงเกือบเต็มจอ · กริด 4×2 สเกลตามความสูงจริงไม่มี scroll · ปุ่มคอลัมน์ขวา */
  .blk-card{background:#fff;border-radius:22px;padding:10px 16px 12px;width:min(96vw,900px);height:min(94vh,560px);
    box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;text-align:center;
    box-shadow:0 12px 40px rgba(0,0,0,.45)}
  .blk-card h2{margin:2px 0 8px;font-size:clamp(16px,4vw,22px);color:#3949ab;flex:0 0 auto}
  .blk-body{display:flex;gap:14px;flex:1;min-height:0;align-items:stretch}
  .blk-grid{flex:1;min-width:0;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);
    grid-template-rows:repeat(2,1fr);gap:8px}
  .blk-it{border:3px solid #e0e0e0;border-radius:14px;padding:4px 2px 5px;cursor:pointer;background:#f7f9ff;
    transition:transform .12s,border-color .12s;display:flex;flex-direction:column;align-items:center;
    justify-content:space-between;min-height:0;box-sizing:border-box}
  .blk-it img{flex:1 1 0;min-height:0;width:100%;object-fit:contain;display:block}
  .blk-it .bn{flex:0 0 auto;font-size:clamp(10px,1.8vh,13px);font-weight:800;color:#37474f;line-height:1.2}
  .blk-it.sel{border-color:#43a047;background:#e9f9ec;transform:scale(1.04);box-shadow:0 4px 14px rgba(67,160,71,.35)}
  .blk-btns{flex:0 0 auto;display:flex;flex-direction:column;gap:14px;justify-content:center;margin:0}
  .blk-go{background:#43a047;color:#fff;border:0;border-radius:14px;font-weight:800;font-size:clamp(15px,2.4vw,18px);
    padding:14px 22px;font-family:inherit;cursor:pointer;white-space:nowrap}
  .blk-x{background:#eceff1;color:#546e7a;border:0;border-radius:14px;font-weight:700;font-size:clamp(13px,2vw,15px);
    padding:12px 18px;font-family:inherit;cursor:pointer;white-space:nowrap}`;
  document.head.appendChild(st);
  blkPickEl=document.createElement('div');
  blkPickEl.id='blk-pick';
  blkPickEl.innerHTML=`<div class="blk-card"><h2>🧱 เลือกตัวละครบล็อกของหนู</h2>
    <div class="blk-body">
      <div class="blk-grid"></div>
      <div class="blk-btns"><button class="blk-go">🚗 ออกรถ!</button><button class="blk-x">✖ ยกเลิก</button></div>
    </div></div>`;
  document.body.appendChild(blkPickEl);
  blkPickEl.querySelector('.blk-go').addEventListener('click',()=>{
    state.blockAv=blkPickSel; saveState(); sfx.select();
    blkPickEl.classList.remove('on');
    const r=blkPickRes; blkPickRes=null; if(r) r(true);
  });
  blkPickEl.querySelector('.blk-x').addEventListener('click',()=>{
    blkPickEl.classList.remove('on');
    const r=blkPickRes; blkPickRes=null; if(r) r(false);
  });
}
function pickBlockAvatar(goLabel){
  return new Promise(res=>{
    blkBuildThumbs(); blkBuildPicker();
    blkPickEl.querySelector('.blk-go').textContent=goLabel||'🚗 ออกรถ!';   // ปุ่มยืนยันตามโลกที่จะเข้า
    blkPickSel=BLOCK_AVATARS[state.blockAv]?state.blockAv:'blk1';
    const grid=blkPickEl.querySelector('.blk-grid');
    // รอบ 147: ภาพตัวละครจริงของผู้ใช้ img/blocks/blk<n>.png มาก่อน · ไม่มีไฟล์/โหลดพลาด → fallback ภาพเรนเดอร์จากโมเดล
    grid.innerHTML=Object.keys(BLOCK_AVATARS).map(id=>
      `<div class="blk-it${id===blkPickSel?' sel':''}" data-id="${id}">
         <img src="img/blocks/${id}.png" alt=""><div class="bn">${BLOCK_AVATARS[id].name}</div></div>`).join('');
    grid.querySelectorAll('.blk-it img').forEach(im=>{
      im.addEventListener('error',()=>{ im.src=_blkThumbs[im.closest('.blk-it').dataset.id]; },{once:true});
    });
    grid.querySelectorAll('.blk-it').forEach(el=>el.addEventListener('click',()=>{
      blkPickSel=el.dataset.id; sfx.select();
      grid.querySelectorAll('.blk-it').forEach(e2=>e2.classList.toggle('sel',e2===el));
    }));
    blkPickRes=res;
    blkPickEl.classList.add('on');
  });
}

/* ---------- แชทลอยหัว (Roblox-style) ---------- */
function bubbleSprite(text){
  const cv=document.createElement('canvas'); cv.width=360; cv.height=120;
  const c=cv.getContext('2d');
  c.font='600 26px Arial';
  // ตัดเป็น ≤2 บรรทัดตามความกว้างจริง (รองรับไทย/อังกฤษปน)
  const maxW=320, lines=[]; let cur='';
  for(const ch of String(text)){
    if(c.measureText(cur+ch).width>maxW){ lines.push(cur); cur=ch; if(lines.length===2) break; }
    else cur+=ch;
  }
  if(lines.length<2 && cur) lines.push(cur);
  if(lines.length===2 && cur && lines[1]!==cur) lines[1]=lines[1].slice(0,-1)+'…';
  const h=lines.length>1?110:78;
  const spooky=mode==='haunt';                    // โลกผี: กรอบดำ ตัวเขียวเรืองแสง
  c.clearRect(0,0,360,120);
  c.fillStyle=spooky?'rgba(8,8,20,.92)':'rgba(255,255,255,.95)';
  c.beginPath(); c.roundRect(6,6,348,h-12,20); c.fill();
  c.strokeStyle=spooky?'rgba(124,255,176,.75)':'rgba(0,0,0,.25)'; c.lineWidth=3; c.stroke();
  if(spooky){ c.shadowColor='#7cffb0'; c.shadowBlur=14; }
  c.fillStyle=spooky?'#7cffb0':'#333'; c.textAlign='center'; c.textBaseline='middle';
  lines.forEach((ln,i)=>c.fillText(ln,180,(lines.length>1?36:h/2)+i*36));
  c.shadowBlur=0;
  const tex=new THREE.CanvasTexture(cv);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  spr.scale.set(3.0,1.0,1);
  return spr;
}
function showPeerBubble(p, text){
  if(p.bubble){ scene.remove(p.bubble.spr); p.bubble.spr.material.map.dispose(); p.bubble.spr.material.dispose(); }
  const spr=bubbleSprite(text);
  spr.position.set(p.cur.x, 3.1, p.cur.z);
  scene.add(spr);
  p.bubble={spr, until:performance.now()+BUBBLE_MS};
  sfx.select();
}
function removePeerBubble(p){
  if(!p.bubble) return;
  scene.remove(p.bubble.spr); p.bubble.spr.material.map.dispose(); p.bubble.spr.material.dispose();
  p.bubble=null;
}

/* ============================================================
   สร้างฉาก static ครั้งเดียวต่อโหมด
   ============================================================ */
/* ---------- 🛸 ตึกร้างกลวง (โหมด drone): เปลือกคอนกรีตมีหน้าต่างเปิดให้บินลอดเข้าไปในห้องต่างๆ ---------- */
function concreteTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.fillStyle='#8b8c88'; c.fillRect(0,0,128,128);
  for(let i=0;i<90;i++){                       // คราบน้ำ/รอยเปื้อนแนวดิ่ง
    c.fillStyle=`rgba(${60+(Math.random()*40|0)},${60+(Math.random()*40|0)},${58+(Math.random()*38|0)},${(.06+Math.random()*.12).toFixed(3)})`;
    c.fillRect(Math.random()*128,Math.random()*128,1+Math.random()*3,1+Math.random()*22);
  }
  c.strokeStyle='rgba(40,40,42,.4)'; c.lineWidth=1;
  for(let i=0;i<6;i++){                         // รอยแตกร้าว
    c.beginPath(); let x=Math.random()*128,y=Math.random()*128; c.moveTo(x,y);
    for(let j=0;j<4;j++){ x+=(Math.random()*2-1)*22; y+=(Math.random()*2-1)*22; c.lineTo(x,y); } c.stroke();
  }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}
/* 🪟 หน้าต่างแตก (fallback วาดเอง) — พื้นโปร่ง เหลือกรอบ + เศษกระจกมุมบน · ผู้ใช้วาง img/tex/tex_window.png ทับได้
   ⚠️ ต้องโปร่งเสมอ เพราะโดรนบินลอดช่องหน้าต่างจริง — ทึบเมื่อไหร่จะดูเหมือนบินทะลุกระจก */
function brokenWindowTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.strokeStyle='rgba(44,46,44,.95)'; c.lineWidth=11; c.strokeRect(5.5,5.5,117,117);   // กรอบหน้าต่าง
  c.fillStyle='rgba(196,214,220,.30)';                                                  // เศษกระจกเหลือติดมุม
  [[11,11,58,20],[11,11,20,52],[117,11,-46,26],[117,117,-30,-22],[11,117,34,-18]].forEach(([x,y,dx,dy])=>{
    c.beginPath(); c.moveTo(x,y); c.lineTo(x+dx,y); c.lineTo(x,y+dy); c.closePath(); c.fill();
  });
  c.strokeStyle='rgba(210,228,232,.42)'; c.lineWidth=1.4;                               // รอยแตกลามจากมุม
  for(let i=0;i<5;i++){
    c.beginPath(); let x=14+Math.random()*100, y=14+Math.random()*100; c.moveTo(x,y);
    for(let j=0;j<3;j++){ x+=(Math.random()*2-1)*26; y+=(Math.random()*2-1)*26; c.lineTo(x,y); } c.stroke();
  }
  const t=new THREE.CanvasTexture(cv); return t;
}
/* 🪟 กระจกที่ยังไม่แตก — ฟ้าแลบสะท้อนวับได้ · โดรนชนแล้วแตกเป็นช่องโล่ง (รอบ 336) */
function intactGlassTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,128,128);
  g.addColorStop(0,'rgba(150,190,205,.62)'); g.addColorStop(.45,'rgba(96,132,150,.5)');
  g.addColorStop(1,'rgba(176,206,216,.58)');
  c.fillStyle=g; c.fillRect(0,0,128,128);
  c.strokeStyle='rgba(255,255,255,.30)'; c.lineWidth=7;                 // แสงพาดเฉียงบนกระจก
  c.beginPath(); c.moveTo(-10,44); c.lineTo(52,-10); c.stroke();
  c.beginPath(); c.moveTo(24,124); c.lineTo(104,30); c.lineWidth=3; c.stroke();
  for(let i=0;i<40;i++){                                                // คราบฝุ่น
    c.fillStyle=`rgba(70,80,80,${(.03+Math.random()*.09).toFixed(3)})`;
    c.beginPath(); c.arc(Math.random()*128,Math.random()*128,2+Math.random()*9,0,7); c.fill();
  }
  c.strokeStyle='rgba(44,46,44,.95)'; c.lineWidth=11; c.strokeRect(5.5,5.5,117,117);   // กรอบเดียวกับบานแตก
  return new THREE.CanvasTexture(cv);
}
/* ⚡ ไอคอนสายฟ้าบนแท่นชาร์จ (วาดเอง พื้นโปร่ง) */
function chargeIconTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.fillStyle='#9dffdc'; c.shadowColor='#35ffb0'; c.shadowBlur=14;
  c.beginPath(); c.moveTo(74,16); c.lineTo(40,70); c.lineTo(62,70); c.lineTo(52,112);
  c.lineTo(90,54); c.lineTo(66,54); c.closePath(); c.fill();
  return new THREE.CanvasTexture(cv);
}
/* 🚪 ประตูเหล็กสนิม (fallback วาดเอง) — ผู้ใช้วาง img/tex/tex_door.png ทับได้ */
function rustyDoorTexture(){
  const cv=document.createElement('canvas'); cv.width=96; cv.height=160;
  const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,96,160); g.addColorStop(0,'#6d5442'); g.addColorStop(.5,'#8a6a4f'); g.addColorStop(1,'#5b4536');
  c.fillStyle=g; c.fillRect(0,0,96,160);
  c.strokeStyle='rgba(40,30,22,.75)'; c.lineWidth=4; c.strokeRect(2,2,92,156);          // ขอบบานประตู
  c.lineWidth=3; c.strokeRect(12,14,72,58); c.strokeRect(12,86,72,58);                  // ช่องบานบน/ล่าง
  for(let i=0;i<70;i++){                                                                 // คราบสนิม
    c.fillStyle=`rgba(${120+(Math.random()*60|0)},${50+(Math.random()*40|0)},${20+(Math.random()*25|0)},${(.08+Math.random()*.25).toFixed(2)})`;
    c.beginPath(); c.arc(Math.random()*96,Math.random()*160,1+Math.random()*7,0,7); c.fill();
  }
  c.fillStyle='#3c3630'; c.beginPath(); c.arc(78,80,5,0,7); c.fill();                    // ลูกบิด
  return new THREE.CanvasTexture(cv);
}
function dAddBox(sc,mat,solids,cx,cy,cz,sx,sy,sz){
  const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);
  m.position.set(cx,cy,cz); sc.add(m);
  solids.push({x:cx,y:cy,z:cz,hx:sx/2,hy:sy/2,hz:sz/2});
}
/* ตึกร้าง 1 หลัง: เสา 4 มุม + มุลเลียนแบ่งหน้าต่าง (เว้นช่องบินลอด) + พื้นแต่ละชั้นมีปล่องกลาง + ผนังกั้นห้อง
   คืน {x,z,w,d,h,solids,rooms} — rooms = จุดวางตัวอักษรในห้องต่างๆ */
function buildAbandoned(sc,mat,cx,cz,w,d,rnd,winMat,doorMat,glassMat){
  const solids=[], rooms=[];
  const levels=2+(rnd()<.5?1:0);               // 2–3 ชั้น
  const fH=5, h=levels*fH, t=0.4, pw=0.7;
  const doorSide=Math.floor(rnd()*2);          // 0/1 = ด้านหน้าซ้าย/ขวา มีประตูใหญ่ชั้นล่าง
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sz])=>{   // เสา 4 มุมสูงเต็มตึก
    dAddBox(sc,mat,solids,cx+sx*(w/2-pw/2),h/2,cz+sz*(d/2-pw/2),pw,h,pw);
  });
  for(let li=0;li<levels;li++){
    const y0=li*fH, yMid=y0+fH/2, wallH=fH-1;
    if(li>0){                                   // พื้นชั้นบน: วงขอบ เว้นปล่องกลาง ~8×8 ให้บินขึ้น/ลง
      const bw=(w-8)/2, bd=(d-8)/2;
      dAddBox(sc,mat,solids,cx,y0,cz-(d/2-bd/2), w, t, bd);
      dAddBox(sc,mat,solids,cx,y0,cz+(d/2-bd/2), w, t, bd);
      dAddBox(sc,mat,solids,cx-(w/2-bw/2),y0,cz, bw, t, d-2*bd);
      dAddBox(sc,mat,solids,cx+(w/2-bw/2),y0,cz, bw, t, d-2*bd);
      rooms.push({x:cx+(rnd()*2-1)*(w/2-3), y:y0+1.5, z:cz+(rnd()*2-1)*(d/2-3)});
    }
    [-1,1].forEach(s=>{                          // มุลเลียนหน้า/หลัง (เว้นด้านประตูชั้นล่าง)
      const skip=(li===0 && doorSide===(s<0?0:1));
      if(!skip){ dAddBox(sc,mat,solids,cx+s*w/4,yMid,cz-d/2+pw/2,pw,wallH,pw);
                 dAddBox(sc,mat,solids,cx+s*w/4,yMid,cz+d/2-pw/2,pw,wallH,pw); }
    });
    [-1,1].forEach(s=>{                          // มุลเลียนซ้าย/ขวา
      dAddBox(sc,mat,solids,cx-w/2+pw/2,yMid,cz+s*d/4,pw,wallH,pw);
      dAddBox(sc,mat,solids,cx+w/2-pw/2,yMid,cz+s*d/4,pw,wallH,pw);
    });
    dAddBox(sc,mat,solids,cx,y0+fH-0.3,cz-d/2+pw/2, w,0.5,pw);   // คานบน (ทับหลัง) รอบตึก
    dAddBox(sc,mat,solids,cx,y0+fH-0.3,cz+d/2-pw/2, w,0.5,pw);
    dAddBox(sc,mat,solids,cx-w/2+pw/2,y0+fH-0.3,cz, pw,0.5,d);
    dAddBox(sc,mat,solids,cx+w/2-pw/2,y0+fH-0.3,cz, pw,0.5,d);
  }
  const half=(w/2-2)/2;                          // ผนังกั้นห้องชั้นล่าง (ช่องประตูกลาง ±2)
  dAddBox(sc,mat,solids,cx-(2+half),fH/2,cz,(w/2-2),fH-1,pw);
  dAddBox(sc,mat,solids,cx+(2+half),fH/2,cz,(w/2-2),fH-1,pw);
  rooms.push({x:cx-w/4, y:1.6, z:cz-d/4});
  rooms.push({x:cx+w/4, y:1.6, z:cz+d/4});
  rooms.push({x:cx, y:h+1.5, z:cz});             // ดาดฟ้าเปิด — ดิ่งลงมาจากด้านบนได้
  /* 🪟🚪 กระจกแตก 1 บานต่อหน้าตึกต่อชั้น + ประตูสนิมชั้นล่าง (ตกแต่งล้วน ไม่มี solid — บินลอดได้เหมือนเดิม) */
  const glass=[], doors=[];
  if(winMat){
    // ขนาดบานผูกกับสัดส่วนภาพจริง (tex_window 704×525 = 1.34 · tex_door 448×884 = 0.507) ไม่งั้นภาพยืดบิด
    const ph2=(fH-1)*0.66, pw2=Math.min(Math.min(w,d)*0.42, ph2*1.34), eps=0.07;
    for(let li=0;li<levels;li++){
      const yMid=li*fH+fH/2;
      [[0,-d/2+eps,0],[0,d/2-eps,Math.PI],[-w/2+eps,0,Math.PI/2],[w/2-eps,0,-Math.PI/2]].forEach(([ox,oz,ry],fi)=>{
        if(li===0 && fi===doorSide) return;      // ชั้นล่างด้านประตู เว้นไว้ให้ประตู
        // 🪟 ~1 ใน 3 ของบานยังมีกระจกอยู่ (แพตเทิร์นคงที่ ไม่ใช้ rnd → ผังเมืองเดิมเป๊ะ) — บินชนแล้วแตกได้
        const intact=glassMat && ((li+fi)%3===0);
        const m=new THREE.Mesh(new THREE.PlaneGeometry(pw2,ph2), intact?glassMat:winMat);
        m.position.set(cx+ox,yMid,cz+oz); m.rotation.y=ry; sc.add(m);
        if(intact) glass.push({m, x:cx+ox, y:yMid, z:cz+oz, done:false});
      });
    }
    if(doorMat){
      // 🚪 บานประตูหมุนรอบบานพับ: pivot อยู่ขอบซ้าย ตัวบานเลื่อนออกครึ่งความกว้าง
      const dw=1.72, dz=doorSide===0?-d/2+eps:d/2-eps;
      const pivot=new THREE.Object3D();
      pivot.position.set(cx-dw/2,1.7,cz+dz); pivot.rotation.y=doorSide===0?0:Math.PI; sc.add(pivot);
      const dr=new THREE.Mesh(new THREE.PlaneGeometry(dw,3.4),doorMat);
      dr.position.set(dw/2,0,0); pivot.add(dr);
      // inz = ทิศ "เข้าไปในตัวตึก" จากหน้าประตู (ใช้วางตัวอักษรลับในห้องหลังประตู)
      doors.push({pivot, base:pivot.rotation.y, x:cx, y:1.7, z:cz+dz, inz:(doorSide===0?1:-1), open:false, ang:0});
    }
  }
  return {x:cx,z:cz,w,d,h,solids,rooms,glass,doors};
}

/* ============================================================
   🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
   ถนน 705 สาย + ตึกจริง 79 หลัง (36 หลังมีชื่อจริง) + แม่น้ำปิง ตำแหน่งตรงพิกัดจริง
   ตึกแถวเพิ่มเติมวางเรียงตามแนวถนนจริงแบบ seed คงที่ (bake มาแล้ว) → ทุกเครื่องเห็นเมืองเดียวกัน
   ============================================================ */
function makeNameSprite(name){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=104;
  const c=cv.getContext('2d');
  c.font='700 40px sans-serif'; c.textAlign='center'; c.textBaseline='middle';
  c.shadowColor='rgba(0,0,0,.9)'; c.shadowBlur=10;
  c.lineWidth=7; c.strokeStyle='rgba(0,0,0,.85)'; c.strokeText(name,256,52,492);
  c.fillStyle='#fff'; c.fillText(name,256,52,492);
  const t=new THREE.CanvasTexture(cv);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));
  spr.scale.set(30,6.1,1);
  return spr;
}
/* geometry แบนราบจากลิสต์สามเหลี่ยม [x,z,...] (normal ชี้ขึ้น) */
function flatGeom(arr,y){
  const n=arr.length/2, pos=new Float32Array(n*3), nor=new Float32Array(n*3);
  for(let i=0;i<n;i++){ pos[i*3]=arr[i*2]; pos[i*3+1]=y; pos[i*3+2]=arr[i*2+1]; nor[i*3+1]=1; }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.BufferAttribute(nor,3));
  return g;
}
/* เหมือน flatGeom แต่มี UV = worldXZ/tile (ปูภาพลายซ้ำทั่วพื้น เช่น ทางเท้า) — รอบ 182 */
function flatGeomUV(arr,y,tile){
  const n=arr.length/2, pos=new Float32Array(n*3), nor=new Float32Array(n*3), uv=new Float32Array(n*2);
  for(let i=0;i<n;i++){ const x=arr[i*2], z=arr[i*2+1];
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z; nor[i*3+1]=1; uv[i*2]=x/tile; uv[i*2+1]=z/tile; }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.BufferAttribute(nor,3));
  g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  return g;
}
function buildDriveCity(sc){
  const C=window.KPP_CITY;
  sc.add(new THREE.HemisphereLight(0xffffff,0x93a072,1.02));
  const sun=new THREE.DirectionalLight(0xfff2cc,.8); sun.position.set(160,320,110); sc.add(sun);
  const R=C.rad;
  /* 🛣️ รอบ 213: ถนนจริงบางเส้นยื่นพ้นรัศมี rad (สุด ~3.7 กม.) — เดิม grid/พื้น/ขอบเมือง อิง rad=2200
     ทำให้ถนนนอกรัศมี "ขับไม่ได้" (grid=0 คลานเหมือนนอกถนน) หรือ "ไปไม่ถึง" (รถโดนดึงกลับที่ rad-25)
     → คำนวณขอบเขตจริงจากถนนทุกเส้น (รัศมีไกลสุด) แล้วขยายทุกอย่างให้คลุมสุดปลายถนน */
  let RX=R;
  C.r.forEach(rd=>{ const p=rd[3]; for(let i=0;i<p.length;i+=2){ const r=Math.hypot(p[i],p[i+1]); if(r>RX)RX=r; } });
  RX=Math.ceil(RX)+80;                                       // เผื่อความกว้างถนน+กันชนขอบ
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+500,RX*2+500),
    new THREE.MeshLambertMaterial({color:MODES.drive.ground}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-.06; sc.add(ground);

  /* ---------- แม่น้ำปิง (ribbon กว้าง 120m ตามแนวจริง) ---------- */
  const rivTris=[];
  const rivSegs=[];
  C.v.forEach(p=>{
    for(let i=0;i<p.length-2;i+=2){
      const x1=p[i],z1=p[i+1],x2=p[i+2],z2=p[i+3];
      const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz)||1e-6,ux=dx/L,uz=dz/L;
      const w=120, ex=ux*w*.5, ez=uz*w*.5;
      const ax=x1-ex,az=z1-ez,bx=x2+ex,bz=z2+ez, nx=-uz*w/2,nz=ux*w/2;
      rivTris.push(ax+nx,az+nz,bx+nx,bz+nz,bx-nx,bz-nz, ax+nx,az+nz,bx-nx,bz-nz,ax-nx,az-nz);
      rivSegs.push([x1,z1,x2,z2]);
    }
  });
  sc.add(new THREE.Mesh(flatGeom(rivTris,-.03),new THREE.MeshLambertMaterial({color:0x5b93c4})));

  /* ---------- ถนนทุกสาย (mesh รวมก้อนเดียว) + เส้นแบ่งเลนถนนใหญ่ ---------- */
  const roadTris=[], dashTris=[], nameSegs=[], roadPts=[];
  const GS=6, GW=Math.ceil(RX*2/GS), GOFF=RX;               // road grid: 0=นอกถนน 1=ถนน 2=น้ำ (คลุมสุดปลายถนน รอบ 213)
  const grid=new Uint8Array(GW*GW);
  /* 🧭 รอบ 284: กริดนำทาง GPS แยกจากกริดฟิสิกส์ — grid เดิมทาเผื่อกว้าง (สี่เหลี่ยม ±rr ช่อง ไว้ให้ขับไหล่ทางไม่สะดุด)
     แต่ GPS ใช้แล้วได้เส้นทาง/จุดเลี้ยวนอกผิวถนนจริง → ngrid ทาเป็นวงกลมรัศมีครึ่งความกว้างถนนจริงเท่านั้น */
  const ngrid=new Uint8Array(GW*GW);
  const gset=(x,z,v)=>{ const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx>=0&&gz>=0&&gx<GW&&gz<GW){ const k=gz*GW+gx; if(v===1||!grid[k]) grid[k]=v; } };
  const ngset=(x,z)=>{ const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx>=0&&gz>=0&&gx<GW&&gz<GW) ngrid[gz*GW+gx]=1; };
  rivSegs.forEach(s=>{                                       // ทาสีน้ำลง grid ก่อน (ถนน=สะพาน ทาทับทีหลัง)
    const L=Math.hypot(s[2]-s[0],s[3]-s[1]), st=Math.max(1,Math.floor(L/GS*2));
    for(let i=0;i<=st;i++){
      const x=s[0]+(s[2]-s[0])*i/st, z=s[1]+(s[3]-s[1])*i/st;
      for(let ox=-10;ox<=10;ox++) for(let oz=-10;oz<=10;oz++)
        if(Math.hypot(ox*GS,oz*GS)<=62) gset(x+ox*GS,z+oz*GS,2);
    }
  });
  const ROAD_WIDEN=1.4;                                     // รอบ 180 (สเปกผู้ใช้): ขยายเลนถนนกว้างขึ้น ~40% (ของเดิมแคบไป)
  C.r.forEach(rd=>{
    const w=rd[0]*ROAD_WIDEN, major=rd[1], nm=rd[2], p=rd[3];
    for(let i=0;i<p.length-2;i+=2){
      const x1=p[i],z1=p[i+1],x2=p[i+2],z2=p[i+3];
      const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz)||1e-6,ux=dx/L,uz=dz/L;
      const ex=ux*w*.5,ez=uz*w*.5;                           // ยืดปลายท่อนกันรอยโหว่ตรงโค้ง
      const ax=x1-ex,az=z1-ez,bx=x2+ex,bz=z2+ez, nx=-uz*w/2,nz=ux*w/2;
      roadTris.push(ax+nx,az+nz,bx+nx,bz+nz,bx-nx,bz-nz, ax+nx,az+nz,bx-nx,bz-nz,ax-nx,az-nz);
      if(major){
        if(nm) nameSegs.push([x1,z1,x2,z2,nm,w]);
        for(let t=5;t<L-2;t+=9){                             // เส้นประกลางถนน
          const cx=x1+ux*t, cz=z1+uz*t, hx=ux*1.3, hz=uz*1.3, mx=-uz*.18, mz=ux*.18;
          dashTris.push(cx-hx+mx,cz-hz+mz,cx+hx+mx,cz+hz+mz,cx+hx-mx,cz+hz-mz,
                        cx-hx+mx,cz-hz+mz,cx+hx-mx,cz+hz-mz,cx-hx-mx,cz-hz-mz);
        }
      }
      const rr=Math.ceil((w/2+1.5)/GS), st=Math.max(1,Math.floor(L/GS*2));
      // 🧭 รอบ 284: nrad = รัศมีทาสีกริดนำทาง — ตามครึ่งความกว้างถนนจริง (+1ม. กันหลุดขอบ)
      //   ขั้นต่ำ GS+0.1 การันตีแสตมป์รูปกากบาท (±1 ช่องแนวตั้ง/นอน) ให้ถนนเฉียงต่อกันแบบ cardinal ผ่านกฎกันตัดมุมของ A*
      const nrad=Math.max(w/2+1, GS+0.1);
      for(let s2=0;s2<=st;s2++){
        const x=x1+dx*s2/st, z=z1+dz*s2/st;
        for(let ox=-rr;ox<=rr;ox++) for(let oz=-rr;oz<=rr;oz++){
          gset(x+ox*GS,z+oz*GS,1);
          if(Math.hypot(ox*GS,oz*GS)<=nrad) ngset(x+ox*GS,z+oz*GS);
        }
      }
      if(w>=5) for(let t=0;t<L;t+=15) roadPts.push(x1+ux*t,z1+uz*t);  // จุด spawn ตัวอักษรบนถนน
    }
  });
  /* 🛣️ รอบ 202: ผิวถนนวางสูงกว่าเลนจักรยาน/ทางเท้า (y มากกว่า = depth ชนะตอนซ้อน) →
     ตรงทางแยกที่ถนนตัดกัน ผิวถนนทับเลนฟ้า/ทางเท้าของถนนที่ตัดผ่าน (เดิมเลนฟ้าลอยทับถนนดูรก) */
  sc.add(new THREE.Mesh(flatGeom(roadTris,.06),new THREE.MeshLambertMaterial({color:0x41454c})));   // ผิวถนน (บนสุดของกลุ่ม decal)
  sc.add(new THREE.Mesh(flatGeom(dashTris,.075),new THREE.MeshBasicMaterial({color:0xd8d8d2})));     // เส้นประกลางถนน (เหนือผิวถนน)

  /* ---------- 🚲 รอบ 182: เลนจักรยาน (ฟ้าขอบขาว) + ทางเท้า ขนาบถนนทุกเส้นที่ขับได้ ----------
     ถัดจากขอบถนน: เลนจักรยานฟ้า (เส้นขาว 2 ขอบ) → ทางเท้าปูลาย (img/city/sidewalk.png ถ้ามี)
     ทั้งหมดเป็น decal พื้น (y เล็กน้อย) ไม่กระทบ grid ที่ขับได้ (ขับทับ=นอกถนน ช้าลงตามจริง) */
  const bikeTris=[], bikeEdgeTris=[], walkTris=[];
  const BIKE_W=1.7, WALK_W=2.6, LINE_W=0.28;
  C.r.forEach(rd=>{
    const w=rd[0]*ROAD_WIDEN; if(w<7) return;                // เฉพาะถนนจริง (ข้าม service road เล็ก)
    const p=rd[3];
    for(let i=0;i<p.length-2;i+=2){
      const x1=p[i],z1=p[i+1],x2=p[i+2],z2=p[i+3];
      const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz)||1e-6,ux=dx/L,uz=dz/L;
      const ex=ux*w*.5,ez=uz*w*.5, ax=x1-ex,az=z1-ez,bx=x2+ex,bz=z2+ez, pux=-uz,puz=ux;
      const strip=(arr,d0,d1)=>{ for(const sgn of [1,-1]){ const e0=sgn*d0,e1=sgn*d1;
        const a0x=ax+pux*e0,a0z=az+puz*e0,b0x=bx+pux*e0,b0z=bz+puz*e0,a1x=ax+pux*e1,a1z=az+puz*e1,b1x=bx+pux*e1,b1z=bz+puz*e1;
        arr.push(a0x,a0z,b0x,b0z,b1x,b1z, a0x,a0z,b1x,b1z,a1x,a1z); } };
      const r=w/2;
      strip(bikeTris,     r, r+BIKE_W);                      // เลนจักรยาน (ฟ้า)
      strip(bikeEdgeTris, r, r+LINE_W);                      // เส้นขาวขอบใน (ชิดถนน)
      strip(bikeEdgeTris, r+BIKE_W-LINE_W, r+BIKE_W);        // เส้นขาวขอบนอก (ชิดทางเท้า)
      strip(walkTris,     r+BIKE_W, r+BIKE_W+WALK_W);        // ทางเท้า
    }
  });
  const walkMat=new THREE.MeshLambertMaterial({color:0x9c9a90});
  sc.add(new THREE.Mesh(flatGeomUV(walkTris,.028,3.2), walkMat));            // ทางเท้า (ต่ำสุด)
  sc.add(new THREE.Mesh(flatGeom(bikeTris,.033),new THREE.MeshLambertMaterial({color:0x2f7fd0})));   // เลนฟ้า
  sc.add(new THREE.Mesh(flatGeom(bikeEdgeTris,.045),new THREE.MeshBasicMaterial({color:0xf2f2f2}))); // ขอบขาว
  const swImg=new Image();                                                    // probe ภาพลายทางเท้า → ปูแทนสีเรียบ
  swImg.onload=()=>{ const tx=new THREE.Texture(swImg); tx.wrapS=tx.wrapT=THREE.RepeatWrapping; tx.needsUpdate=true;
    walkMat.map=tx; walkMat.color.setHex(0xffffff); walkMat.needsUpdate=true; };
  swImg.src='img/city/sidewalk.png';

  /* ---------- กำแพงกันชน (ตึกจริง=ขอบ polygon · ตึกแถว=กล่องหมุน) ใน spatial hash ---------- */
  const SCELL=42, solidGrid={};
  const sAdd=(cx,cz,r,o)=>{
    const x0=Math.floor((cx-r)/SCELL),x1=Math.floor((cx+r)/SCELL),z0=Math.floor((cz-r)/SCELL),z1=Math.floor((cz+r)/SCELL);
    for(let gx=x0;gx<=x1;gx++) for(let gz=z0;gz<=z1;gz++){
      const k=gx+','+gz; (solidGrid[k]=solidGrid[k]||[]).push(o);
    }
  };

  /* 🎨 รอบ 213: โทนเมือง "น่ารักเข้าชุดรถบล็อกสีสด" — ผนังพาสเทลลูกกวาด + หลังคาสีสดใส (toy town)
     CUTE_ROOF ใช้ร่วมทั้งตึกจริง (ฝาครอบยอด) และตึกแถว (หลังคาจั่ว) ให้สีหลังคาทั้งเมืองเป็นชุดเดียวกัน */
  const CUTE_ROOF=[0xff8f87,0x66c2f0,0x7fd8a6,0xffce5c,0xc7a3f2,0xf59ac4,0xffb46b,0x5ad1c4];
  /* ---------- ตึกจริง 79 หลัง (ผัง footprint ตรงพิกัดจริง) + ป้ายชื่อสถานที่ ---------- */
  const tints=[0xffe0dd,0xdcefff,0xd9f5e2,0xfff2ce,0xe9dcff,0xd2f2ee,0xffe8cf,0xf7dcee];  // ผนังพาสเทลลูกกวาด
  C.b.forEach((b,bi)=>{
    const h=b[0], p=b[2];   // รอบ 183: เลิกใช้ชื่อ OSM (b[1]) — โชว์เฉพาะผู้ลงโฆษณา (SHOP_ADS)
    const shape=new THREE.Shape();
    shape.moveTo(p[0],-p[1]);
    for(let i=2;i<p.length;i+=2) shape.lineTo(p[i],-p[i+1]);
    const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});
    g.rotateX(-Math.PI/2);                                   // extrude → แกน y · shape.y=-z → z โลกตรงพิกัดจริง
    sc.add(new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:tints[bi%tints.length],side:THREE.DoubleSide})));
    // 🏠 ฝาครอบยอดสีสด (roof cap) — ตึกจริงผังไม่สม่ำเสมอ ใช้แผ่นสีตามผังวางบนยอดแทนหลังคาจั่ว
    const cap=new THREE.ExtrudeGeometry(shape,{depth:1.4,bevelEnabled:false}); cap.rotateX(-Math.PI/2);
    const capM=new THREE.Mesh(cap,new THREE.MeshLambertMaterial({color:CUTE_ROOF[bi%CUTE_ROOF.length],side:THREE.DoubleSide}));
    capM.position.y=h; sc.add(capM);
    let cx=0,cz=0; const n=p.length/2;
    for(let i=0;i<p.length;i+=2){ cx+=p[i]/n; cz+=p[i+1]/n; }
    for(let i=0;i<p.length;i+=2){                            // ขอบ polygon = กำแพง
      const x1=p[i],z1=p[i+1],x2=p[(i+2)%p.length],z2=p[(i+3)%p.length];
      sAdd((x1+x2)/2,(z1+z2)/2,Math.hypot(x2-x1,z2-z1)/2+3,{t:1,x1,z1,x2,z2});
    }
    // ชื่อบนตึก: ผู้ลงโฆษณาก่อน (เรียงลงตึกเว้นระยะ) · ไม่มี = ป้ายเชิญลงโฆษณาห่างๆ · ไม่โชว์ชื่อจริง OSM
    let adName=null;
    if(SHOP_ADS.length && bi%4===0) adName=SHOP_ADS[((bi/4)|0)%SHOP_ADS.length];
    if(!adName && bi%16===0) adName='📢 ลงโฆษณาที่นี่ ☎ 064-357 6645';
    if(adName){ const spr=makeNameSprite(adName); spr.position.set(cx,h+5,cz); sc.add(spr); }
  });

  /* ---------- ตึกแถวริมถนนจริง (InstancedMesh แยกตามจำนวนชั้น — ผัง bake seed คงที่)
     รอรับภาพ facade จริง img/city/*.png (PROMPTS_BUILDINGS_KPP.md): มีไฟล์ = ผนังเป็นภาพจริงทันที
     ไม่มี = สีล้วนตามเดิม · ภาพ 1 ไฟล์ = หน้าตึกเต็มความสูง (ชั้นล่างประตูม้วน) tile ซ้ำแนวนอน ~2.5 คูหา ---------- */
  const lots=C.p;
  const m4=new THREE.Matrix4(), q=new THREE.Quaternion(), eu=new THREE.Euler(),
        vv=new THREE.Vector3(), sv=new THREE.Vector3();
  const pal=[0xffd9d9,0xd9ecff,0xd9f6df,0xfff1c9,0xece0ff,0xd2f4ef,0xffe6cc,0xf7dcee].map(c=>new THREE.Color(c));  // รอบ 213: ผนังตึกแถวพาสเทลลูกกวาด (คูณกับภาพ facade → เมืองสีสดน่ารัก)
  const FACADE_FILES={1:'house_1fl',2:'shop_2fl',3:'shop_3fl',4:'shop_4fl'};
  const grp={1:[],2:[],3:[],4:[]};
  lots.forEach(L=>{                                           // L = [x,z,rot,w,d,h]
    grp[Math.max(1,Math.min(4,Math.round(L[5]/3.3)))].push(L);
    sAdd(L[0],L[1],Math.hypot(L[3],L[4])/2+2,{t:0,x:L[0],z:L[1],rot:L[2],hx:L[3]/2,hz:L[4]/2});
  });
  Object.keys(grp).forEach(fl=>{
    const list=grp[fl]; if(!list.length) return;
    const g=new THREE.BoxGeometry(1,1,1);
    const uv=g.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setX(i, uv.getX(i)*2.5);   // ~2.5 คูหา/หลัง (ภาพ seamless แนวนอน)
    const mat=new THREE.MeshLambertMaterial({color:0xffffff});
    const im=new THREE.InstancedMesh(g,mat,list.length);
    for(let i=0;i<list.length;i++){
      const L=list[i];
      eu.set(0,L[2],0); q.setFromEuler(eu);
      vv.set(L[0],L[5]/2,L[1]); sv.set(L[3],L[5],L[4]);
      m4.compose(vv,q,sv); im.setMatrixAt(i,m4);
      im.setColorAt(i,pal[i%pal.length]);                     // tint พาสเทลคูณกับภาพ → ตึกแถวสีต่างกัน
    }
    im.instanceMatrix.needsUpdate=true;
    if(im.instanceColor) im.instanceColor.needsUpdate=true;
    sc.add(im);
    const fimg=new Image();                                   // probe ภาพจริง — โหลดได้ค่อย swap เข้า material
    fimg.onload=()=>{
      const tx=new THREE.Texture(fimg);
      tx.wrapS=tx.wrapT=THREE.RepeatWrapping; tx.needsUpdate=true;
      mat.map=tx; mat.needsUpdate=true;
    };
    fimg.src='img/city/'+FACADE_FILES[fl]+'.png';
  });

  /* 🏠 รอบ 213: หลังคาทรงปิรามิดสีลูกกวาด (hip roof) คลุมยอดตึกแถวทุกหลัง — เมืองน่ารักแบบ toy town
     InstancedMesh ก้อนเดียว (1 draw call) · มุมหลังคาตรงมุมกล่องพอดี (cone 4 ด้าน หมุน 45°) · ชายคายื่นเล็กน้อย */
  const roofGeo=new THREE.ConeGeometry(Math.SQRT1_2,1,4); roofGeo.rotateY(Math.PI/4);
  const roof=new THREE.InstancedMesh(roofGeo,new THREE.MeshLambertMaterial({color:0xffffff}),lots.length);
  const rcol=new THREE.Color();
  for(let i=0;i<lots.length;i++){
    const L=lots[i], rh=Math.max(1.4,Math.min(L[3],L[4])*0.5);   // สูงหลังคาตามด้านแคบ (ไม่แหลมเกิน)
    eu.set(0,L[2],0); q.setFromEuler(eu);
    vv.set(L[0],L[5]+rh/2,L[1]); sv.set(L[3]*1.12,rh,L[4]*1.12);  // ชายคายื่น 12%
    m4.compose(vv,q,sv); roof.setMatrixAt(i,m4);
    roof.setColorAt(i,rcol.set(CUTE_ROOF[i%CUTE_ROOF.length]));
  }
  roof.instanceMatrix.needsUpdate=true;
  if(roof.instanceColor) roof.instanceColor.needsUpdate=true;
  sc.add(roof);

  /* ---------- หอนาฬิกาวงเวียนต้นโพธิ์ (แลนด์มาร์กจุดเกิด 0,0) ---------- */
  const brick=new THREE.MeshLambertMaterial({color:0xa8542f});
  const brickD=new THREE.MeshLambertMaterial({color:0x8c3f22});
  const island=new THREE.Mesh(new THREE.CircleGeometry(13,30),new THREE.MeshLambertMaterial({color:0x6aa84f}));
  island.rotation.x=-Math.PI/2; island.position.y=.08; sc.add(island);
  const hedge=new THREE.Mesh(new THREE.TorusGeometry(12.4,.6,6,30),new THREE.MeshLambertMaterial({color:0x3f7a33}));
  hedge.rotation.x=Math.PI/2; hedge.position.y=.5; sc.add(hedge);
  const twBase=new THREE.Mesh(new THREE.BoxGeometry(7,2.2,7),brickD); twBase.position.y=1.1; sc.add(twBase);
  const twShaft=new THREE.Mesh(new THREE.BoxGeometry(4.6,12,4.6),brick); twShaft.position.y=8.2; sc.add(twShaft);
  const twClock=new THREE.Mesh(new THREE.BoxGeometry(5.4,3.4,5.4),brickD); twClock.position.y=15.9; sc.add(twClock);
  const faceG=new THREE.CircleGeometry(1.35,20), faceM=new THREE.MeshBasicMaterial({color:0xf6f1df});
  [[0,2.71,0],[0,-2.71,Math.PI],[2.71,0,Math.PI/2],[-2.71,0,-Math.PI/2]].forEach(f=>{
    const fc=new THREE.Mesh(faceG,faceM);
    fc.position.set(f[0],15.9,f[1]); fc.rotation.y=f[2];
    fc.translateZ(.04); sc.add(fc);                          // ดันหน้าปัดพ้นผิวอิฐเล็กน้อย
  });
  let tw=6.2;
  [18.2,19.6,20.8].forEach(y=>{
    const tier=new THREE.Mesh(new THREE.BoxGeometry(tw,1.1,tw),brickD); tier.position.y=y; sc.add(tier); tw*=.62;
  });
  const spire=new THREE.Mesh(new THREE.ConeGeometry(1.1,3.6,8),new THREE.MeshLambertMaterial({color:0xd9b44a}));
  spire.position.y=23.2; sc.add(spire);
  sAdd(0,0,15,{t:2,x:0,z:0,r:13.2});                          // เกาะกลางวงเวียน = วงกลมชนไม่ได้ (ตามเกาะจริง)

  /* ---------- จุดเกิด: บนถนนวงแหวนรอบวงเวียนหอนาฬิกา (จุดถนนที่ใกล้หอสุด นอกเกาะกลาง r14) ---------- */
  let spawn={x:0,z:34,yaw:0}, bestD=1e9;
  C.r.forEach(rd=>{
    if(rd[0]<6) return;                                      // ข้าม service road
    const p=rd[3];
    for(let i=0;i<p.length-2;i+=2){
      const dx=p[i+2]-p[i], dz=p[i+3]-p[i+1], L2=dx*dx+dz*dz||1e-9;
      let t=((0-p[i])*dx+(0-p[i+1])*dz)/L2; t=t<0?0:(t>1?1:t);
      const px=p[i]+dx*t, pz=p[i+1]+dz*t, d=Math.hypot(px,pz);
      if(d>=16 && d<bestD){ bestD=d; spawn={x:px,z:pz,yaw:Math.atan2(-dx,-dz)}; }
    }
  });

  /* ---------- แผนที่เมืองสำหรับเรดาร์ (วาดครั้งเดียว 0.25px/m) ---------- */
  const MPX=.25, MSZ=Math.ceil(RX*2*MPX)+40;                 // เรดาร์คลุมถนนนอกรัศมีด้วย (รอบ 213)
  cityMapCv=document.createElement('canvas'); cityMapCv.width=cityMapCv.height=MSZ;
  const mc=cityMapCv.getContext('2d');
  mc.fillStyle='rgba(16,26,20,.9)'; mc.fillRect(0,0,MSZ,MSZ);
  const M0=MSZ/2;
  mc.strokeStyle='rgba(70,120,175,.95)'; mc.lineWidth=120*MPX; mc.lineCap='round';
  C.v.forEach(p=>{ mc.beginPath(); mc.moveTo(M0+p[0]*MPX,M0+p[1]*MPX);
    for(let i=2;i<p.length;i+=2) mc.lineTo(M0+p[i]*MPX,M0+p[i+1]*MPX); mc.stroke(); });
  C.r.forEach(rd=>{
    const p=rd[3];
    mc.strokeStyle=rd[1]?'rgba(255,255,255,.85)':'rgba(255,255,255,.4)';
    mc.lineWidth=Math.max(1,rd[0]*MPX); mc.lineCap='round';
    mc.beginPath(); mc.moveTo(M0+p[0]*MPX,M0+p[1]*MPX);
    for(let i=2;i<p.length;i+=2) mc.lineTo(M0+p[i]*MPX,M0+p[i+1]*MPX);
    mc.stroke();
  });
  mc.fillStyle='#ffab40'; mc.beginPath(); mc.arc(M0,M0,3,0,7); mc.fill();   // หอนาฬิกา

  worlds.drive={scene:sc, trees:[], buildings:[],
    d:{grid,ngrid,GS,GW,GOFF,solidGrid,SCELL,roadPts,nameSegs,spawn,rad:RX}};   // ngrid = กริดนำทาง GPS (รอบ 284)
  /* 🚦 รอบ 182: precompute รายการทางแยก (จุด arms>=3 ที่ cluster รวมกัน) — robust กว่า sample สด
     (โซน arms>=3 แคบระดับ sub-meter → เตือน/ปรับแบบ sample จุดเดียวพลาด · ใช้ระยะจากรายการแทน) */
  const junctions=[];
  for(let i=0;i<roadPts.length;i+=2){
    const x=roadPts[i], z=roadPts[i+1];
    if(driveArms(x,z)>=3){
      const m=junctions.find(j=>Math.hypot(j.x-x,j.z-z)<16);
      if(m){ m.x=(m.x+x)/2; m.z=(m.z+z)/2; } else junctions.push({x,z});
    }
  }
  worlds.drive.d.junctions=junctions;
}

/* ============================================================
   🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
   วางไฟล์ img/sky/<key>.jpg (หรือ .png) → เกน background เป็นภาพจริงทันที · ไม่มีไฟล์ = คงสีพื้นเดิม
   prompt ภาพใน PROMPTS_SKY.md — 5 แบบใช้ครอบ 7 โลก
   ============================================================ */
const SKY_IMG={ adv:'sky_day', haunt:'sky_night', heli:'sky_dawn', drone:'sky_storm', drive:'sky_day', soccer:'sky_day', mecha:'sky_alien' };
function applySky(sc, mode){
  const key=SKY_IMG[mode]; if(!key || !sc) return;
  const set=img=>{ const tex=new THREE.Texture(img); tex.needsUpdate=true;
    tex.mapping=THREE.EquirectangularReflectionMapping; sc.background=tex; };
  const jpg=new Image();
  jpg.onload=()=>set(jpg);
  jpg.onerror=()=>{ const png=new Image(); png.onload=()=>set(png); png.src='img/sky/'+key+'.png'; };  // ลอง .png ถ้าไม่มี .jpg
  jpg.src='img/sky/'+key+'.jpg';
}
/* ============================================================
   🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
   ไม่มีไฟล์ = คงลายที่วาดด้วยโค้ดเดิม (เกมไม่พังแน่นอน) · ภาพต้องต่อขอบได้ไร้รอยต่อ (seamless/tileable)
   prompt ภาพใน PROMPTS_TEXTURE.md
   ============================================================ */
const imgTexCache={};                                  // key -> Image ที่โหลดแล้ว | 'none' (ไม่มีไฟล์ ไม่ต้องลองซ้ำ)
function applyTex(mat,key,rx,ry,tint,pngFirst){        // tint = สีคูณทับภาพ (โลกกลางคืนใช้ภาพเดียวกันแต่หม่นลง) · pngFirst = ภาพที่ต้องมีพื้นโปร่ง (หน้าต่าง/ประตู)
  if(!mat||!key) return;
  rx=rx||1; ry=ry||1;
  const ext1=pngFirst?'.png':'.jpg', ext2=pngFirst?'.jpg':'.png';
  const use=img=>{
    const t=new THREE.Texture(img); t.needsUpdate=true;
    t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry);
    if(mat.map && mat.map.dispose) mat.map.dispose();
    mat.map=t; if(mat.color) mat.color.set(tint||0xffffff); mat.needsUpdate=true;
  };
  const c=imgTexCache[key];
  if(c==='none') return;
  if(c){ use(c); return; }
  const first=new Image();
  first.onload=()=>{ imgTexCache[key]=first; use(first); };
  first.onerror=()=>{
    const second=new Image();
    second.onload=()=>{ imgTexCache[key]=second; use(second); };
    second.onerror=()=>{ imgTexCache[key]='none'; };
    second.src='img/tex/'+key+ext2;
  };
  first.src='img/tex/'+key+ext1;
}
function buildScene(md){
  if(md==='drive'){
    const sc=new THREE.Scene();
    sc.background=new THREE.Color(MODES.drive.sky);
    sc.fog=new THREE.Fog(MODES.drive.sky, MODES.drive.fogN, MODES.drive.fogF);
    buildDriveCity(sc);
    return;
  }
  const cfg=MODES[md];
  const sc=new THREE.Scene();
  const tr=[];
  sc.background=new THREE.Color(cfg.sky);
  sc.fog=new THREE.Fog(cfg.sky, cfg.fogN, cfg.fogF);

  if(md==='adv'){
    sc.add(new THREE.HemisphereLight(0xffffff,0x6faa50,1.05));
    const sun=new THREE.DirectionalLight(0xfff2cc,.8); sun.position.set(30,60,20); sc.add(sun);
  }else if(md==='haunt'){
    sc.add(new THREE.HemisphereLight(0x9db4ff,0x1a2418,.38));
    const moonL=new THREE.DirectionalLight(0xbfd0ff,.3); moonL.position.set(-40,50,-30); sc.add(moonL);
    // พระจันทร์เต็มดวงสีซีด
    const moon=new THREE.Mesh(new THREE.CircleGeometry(6,24),
      new THREE.MeshBasicMaterial({color:0xf5f0d8,fog:false}));
    moon.position.set(-45,38,-70); moon.lookAt(0,EYE_H,0); sc.add(moon);
  }
  // (โหมด heli ใส่แสงของตัวเองในบล็อกเมืองด้านล่าง)

  const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(HALF*2+20,HALF*2+20),
    new THREE.MeshLambertMaterial({color:cfg.ground}));
  ground.rotation.x=-Math.PI/2; sc.add(ground);
  // 🧱 พื้นภาพจริงในโลกเมือง (โดรนใส่ในบล็อกตัวเอง) · โลกผีใช้ภาพเดียวกันแต่ tint หม่นให้เข้ากับกลางคืน
  if(md==='heli') applyTex(ground.material,'tex_ground',26,26);
  else if(md==='haunt') applyTex(ground.material,'tex_ground',20,20,0x7d8490);

  // รั้วรอบแผนที่
  const fenceMat=new THREE.MeshLambertMaterial({color:md==='adv'?0xb98a5a:0x3a3a4a});
  [[0,-HALF],[0,HALF]].forEach(([x,z])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(HALF*2,1.6,.4),fenceMat);
    f.position.set(x,.8,z); sc.add(f);
  });
  [[-HALF,0],[HALF,0]].forEach(([x,z])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(.4,1.6,HALF*2),fenceMat);
    f.position.set(x,.8,z); sc.add(f);
  });

  if(md==='adv'){
    // ต้นไม้เขียว + หิน + ดอกไม้
    const trunkG=new THREE.CylinderGeometry(.35,.5,2.6,7);
    const trunkM=new THREE.MeshLambertMaterial({color:0x8b5a2b});
    const crownG=new THREE.IcosahedronGeometry(2.1,0);
    const crownM=new THREE.MeshLambertMaterial({color:0x2e8b3d});
    for(let i=0;i<42;i++){
      const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
      if(Math.hypot(x,z)<8) continue;
      const t1=new THREE.Mesh(trunkG,trunkM); t1.position.set(x,1.3,z);
      const c1=new THREE.Mesh(crownG,crownM); c1.position.set(x,3.6,z);
      c1.rotation.y=Math.random()*Math.PI;
      sc.add(t1,c1); tr.push({x,z,r:1.0});
    }
    const rockG=new THREE.DodecahedronGeometry(1,0);
    const rockM=new THREE.MeshLambertMaterial({color:0x9e9e9e});
    for(let i=0;i<14;i++){
      const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
      if(Math.hypot(x,z)<8) continue;
      const r=new THREE.Mesh(rockG,rockM);
      const s=.5+Math.random()*.9;
      r.scale.set(s,s*.7,s); r.position.set(x,s*.4,z); r.rotation.y=Math.random()*3;
      sc.add(r); tr.push({x,z,r:s*.9});
    }
    const flG=new THREE.SphereGeometry(.16,6,5);
    ['#ff6b81','#ffd54f','#fff','#b388ff'].forEach(col=>{
      const m=new THREE.MeshBasicMaterial({color:col});
      for(let i=0;i<22;i++){
        const f=new THREE.Mesh(flG,m);
        f.position.set((Math.random()*2-1)*(HALF-4),.16,(Math.random()*2-1)*(HALF-4));
        sc.add(f);
      }
    });
  }else if(md==='heli'){
    // เมืองตึกสูง: ตัวอักษรวางบนดาดฟ้า ต้องบินลอดตึกแล้วลงจอดเก็บ
    const hemi=new THREE.HemisphereLight(0xffffff,0x777a80,1.0); sc.add(hemi);   // 🌙 เก็บ ref ไว้หรี่ตอนกลางคืน (รอบ 351)
    const sun=new THREE.DirectionalLight(0xfff4d6,.7); sun.position.set(40,80,30); sc.add(sun);
    // ถนนตาราง (เส้นเข้มบนพื้น)
    const roadM=new THREE.MeshLambertMaterial({color:0x50545a});
    applyTex(roadM,'tex_asphalt',22,2);              // 🧱 ถนนภาพจริง (ชุดเดียวกับโลกโดรน)
    for(let i=-2;i<=2;i++){
      const r1=new THREE.Mesh(new THREE.PlaneGeometry(HALF*2+20,6),roadM);
      r1.rotation.x=-Math.PI/2; r1.position.set(0,.02,i*24); sc.add(r1);
      const r2=new THREE.Mesh(new THREE.PlaneGeometry(6,HALF*2+20),roadM);
      r2.rotation.x=-Math.PI/2; r2.position.set(i*24,.02,0); sc.add(r2);
    }
    // ตึก: กริดทุก 24m เว้นลานกลาง (จุดเกิด) · เก็บ footprint ไว้เช็กชน+วางตัวอักษร
    // ⚠️ ผังเมือง seed คงที่ (รอบ 58): ทุกเครื่อง/ทุกรอบเห็นเมืองเดียวกันเป๊ะ —
    //    เพื่อน multiplayer ไม่บินทะลุตึกกัน + ป้ายโฆษณาเลขเดิมอยู่ตำแหน่งเดิมเสมอ (ลูกค้าเลือกป้ายได้)
    const rnd=seededRand(87251);
    const list=[];
    for(let gx=-2;gx<=2;gx++) for(let gz=-2;gz<=2;gz++){
      if(gx===0 && gz===0) continue;                    // ลานกลาง = จุดเกิด/สนามบินหลัก
      if(rnd()<.22) continue;                           // เว้นช่องว่างให้เมืองโปร่ง
      const x=gx*24 + (rnd()*4-2);
      const z=gz*24 + (rnd()*4-2);
      const w=9+rnd()*4, d=9+rnd()*4, h=8+rnd()*20;
      const tn=Math.floor(rnd()*6)+1;                   // 1 rnd() ต่อตึก (เท่าเดิม → ผังเมือง seed คงเดิมเป๊ะ)
      const facade=buildingFacadeTexture(tn);
      facade.repeat.set(Math.max(1,Math.round(w/8)), Math.max(2,Math.round(h/6)));  // หน้าต่าง ~ทุก 8m กว้าง / ทุกชั้น ~6m
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),
        new THREE.MeshLambertMaterial({map:facade}));
      b.position.set(x,h/2,z); sc.add(b);
      // ขอบดาดฟ้า + วง helipad ให้เล็งง่าย
      const pad=new THREE.Mesh(new THREE.CircleGeometry(3.2,20),
        new THREE.MeshLambertMaterial({color:0x3d434b}));
      pad.rotation.x=-Math.PI/2; pad.position.set(x,h+.03,z); sc.add(pad);
      const ring=new THREE.Mesh(new THREE.RingGeometry(2.4,3.0,20),
        new THREE.MeshBasicMaterial({color:0xffd54f,side:THREE.DoubleSide}));
      ring.rotation.x=-Math.PI/2; ring.position.set(x,h+.06,z); sc.add(ring);
      list.push({x,z,w,d,h});
    }
    // 📢 ป้ายโฆษณาแนบผนังตึก (รอบ 359 — เดิมลอยเหนือดาดฟ้า ค่อมตัวอักษร) — ตึกเว้นตึก สูงสุด AD_COUNT ป้าย เลขคงที่
    // ติดผนังฝั่งหันเข้ากลางเมือง ชิดใต้ขอบดาดฟ้า · วางไฟล์ img/ads/ad_<เลข>.png = โฆษณาลูกค้าขึ้นแทนทันที
    const ads=[], adGlows=[];
    list.forEach((b,i)=>{
      if(ads.length>=AD_COUNT || i%2===1) return;
      const n=ads.length+1;
      const toX=Math.abs(b.x)>=Math.abs(b.z);           // เลือกผนังฝั่งแกนที่หันเข้ากลางเมืองมากสุด
      const sx=toX?-Math.sign(b.x||1):0, sz=toX?0:-Math.sign(b.z||1);
      const faceW=toX?b.d:b.w;                          // ความกว้างผนังด้านนั้น
      const pw=Math.min(faceW-.8,11), ph=pw*3/8;
      const panel=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),
        new THREE.MeshBasicMaterial({map:adBoardTexture(n),side:THREE.DoubleSide}));
      panel.name='adpanel'+n;
      panel.position.set(b.x+sx*(b.w/2+.08), b.h-ph/2-.5, b.z+sz*(b.d/2+.08));
      panel.rotation.y=Math.atan2(sx,sz);               // normal ชี้ออกจากผนังเข้ากลางเมือง
      // 🌙 แสงเรืองรอบขอบป้ายตอนกลางคืน (รอบ 360) — แผ่นใหญ่กว่าป้ายซ่อนหลังป้าย · fogUpdate คุม visible/opacity
      const glow=new THREE.Mesh(new THREE.PlaneGeometry(pw+.9,ph+.9),
        new THREE.MeshBasicMaterial({color:0xffe9a8,transparent:true,opacity:0,
          blending:THREE.AdditiveBlending,depthWrite:false}));
      glow.position.z=-.03; glow.visible=false; panel.add(glow);   // ลูกของ panel — หมุน/ย้ายตามอัตโนมัติ
      adGlows.push(glow);
      sc.add(panel);
      ads.push({n, x:b.x, z:b.z, h:b.h});
    });
    // ลานจอดกลางเมือง (จุดเกิด)
    const basePad=new THREE.Mesh(new THREE.CircleGeometry(5,24),
      new THREE.MeshLambertMaterial({color:0x3d434b}));
    basePad.rotation.x=-Math.PI/2; basePad.position.set(0,.03,0); sc.add(basePad);
    const baseH=new THREE.Mesh(new THREE.RingGeometry(3.4,4.2,24),
      new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));
    baseH.rotation.x=-Math.PI/2; baseH.position.set(0,.06,0); sc.add(baseH);
    // ⭐🌕 ดาว+พระจันทร์ (รอบ 353) — โผล่เฉพาะกลางคืน (fogUpdate คุม opacity/visible) · fog:false ไม่งั้นหมอกกลืน
    const sp=[];
    for(let i=0;i<190;i++){
      const a=rnd()*Math.PI*2, e=.15+rnd()*.8, R=170;      // กระจายบนโดมฟ้า มุมเงย .15-.95 rad
      sp.push(Math.cos(a)*Math.cos(e)*R, Math.sin(e)*R, Math.sin(a)*Math.cos(e)*R);
    }
    const starG=new THREE.BufferGeometry();
    starG.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
    const stars=new THREE.Points(starG,new THREE.PointsMaterial({color:0xdfe8ff,size:1.7,
      sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));
    stars.visible=false; sc.add(stars);
    const moon=new THREE.Mesh(new THREE.CircleGeometry(7,24),
      new THREE.MeshBasicMaterial({color:0xf2eeda,transparent:true,opacity:0,fog:false,depthWrite:false}));
    moon.position.set(-90,95,-120); moon.lookAt(0,0,0); moon.visible=false; sc.add(moon);
    // 🚨 ไฟกันชนกะพริบบนยอดตึกสูงสุด 6 หลัง (รอบ 353) — แบบตึกจริง ช่วยกะระยะยอดตึกตอนมืด
    const beacons=[];
    [...list].sort((a,b)=>b.h-a.h).slice(0,6).forEach((b,i)=>{
      const m=new THREE.Mesh(new THREE.SphereGeometry(.34,8,6),
        new THREE.MeshBasicMaterial({color:0xff2d2d,transparent:true,opacity:0,fog:false}));
      m.position.set(b.x,b.h+.55,b.z); m.visible=false; sc.add(m);
      beacons.push({m,ph:i*.37});                    // ph = เฟสคนละจังหวะ ไม่วาบพร้อมกัน
    });
    worlds[md]={scene:sc, trees:tr, buildings:list, ads, adGlows, lights:{hemi,sun},
                night:{stars,moon}, beacons,         // 🌙 ของตกแต่งกลางคืน (fogUpdate/tickHeli คุม)
                foot:buildHeliFoot(sc,list)};        // 🚶 รอบ 354: ของโหมดเดินเท้า (ตึกเทอร์มินัล/ลิฟต์/เฮลิฯ จอด)
    return;
  }else if(md==='drone'){
    // 🛸 เมืองตึกร้าง: ตึกกลวงมีหน้าต่าง บินลอดเข้าไปเก็บตัวอักษรในห้องต่างๆ
    sc.add(new THREE.HemisphereLight(0xcfd6dd,0x3a3d42,.95));
    const sun=new THREE.DirectionalLight(0xd8dde4,.5); sun.position.set(-30,70,40); sc.add(sun);
    const roadM=new THREE.MeshLambertMaterial({color:0x3c3f44});
    applyTex(roadM,'tex_asphalt',24,2);              // 🧱 ถนนยางมะตอย (มีภาพจริงก็ใช้ ไม่มีก็สีเดิม)
    applyTex(ground.material,'tex_ground',26,26);    // 🧱 พื้นดิน/ลานคอนกรีตแตกร้าวรอบเมืองร้าง
    for(let i=-2;i<=2;i++){
      const r1=new THREE.Mesh(new THREE.PlaneGeometry(HALF*2+20,7),roadM); r1.rotation.x=-Math.PI/2; r1.position.set(0,.02,i*26); sc.add(r1);
      const r2=new THREE.Mesh(new THREE.PlaneGeometry(7,HALF*2+20),roadM); r2.rotation.x=-Math.PI/2; r2.position.set(i*26,.02,0); sc.add(r2);
    }
    const cMat=new THREE.MeshLambertMaterial({map:concreteTexture()});
    applyTex(cMat,'tex_concrete',2,2);               // 🧱 ผนังตึกร้าง (ทับลาย canvas เดิมถ้ามีไฟล์ภาพ)
    // 🪟🚪 หน้าต่างแตก + ประตูสนิม (ใช้ร่วมกันทุกตึก 1 material) — รับภาพ png พื้นโปร่งจาก img/tex/ ได้
    // ⚡ alphaTest (ไม่ใช่ transparent) — ตัดพื้นโปร่งแบบ cutout เรนเดอร์ในรอบทึบ ไม่ต้องเรียงลำดับ 200 ชิ้นทุกเฟรม
    const winMat=new THREE.MeshLambertMaterial({map:brokenWindowTexture(),alphaTest:.35,side:THREE.DoubleSide});
    applyTex(winMat,'tex_window',1,1,null,true);
    const doorMat=new THREE.MeshLambertMaterial({map:rustyDoorTexture(),side:THREE.DoubleSide});
    applyTex(doorMat,'tex_door',1,1,null,true);
    // 🪟 บานที่ยังมีกระจก (โปร่งแสงจริง ต้องใช้ transparent — มีไม่มาก ~1/3 ของบานทั้งหมด)
    const glassMat=new THREE.MeshLambertMaterial({map:intactGlassTexture(),transparent:true,
      opacity:.82,side:THREE.DoubleSide,depthWrite:false});
    const rnd=seededRand(41987);
    const list=[];
    for(let gx=-2;gx<=2;gx++) for(let gz=-2;gz<=2;gz++){
      if(gx===0 && gz===0) continue;                    // ลานกลาง = จุดเกิด
      if(rnd()<.18) continue;                            // เว้นช่องให้เมืองโปร่ง บินได้สะดวก
      const x=gx*26+(rnd()*4-2), z=gz*26+(rnd()*4-2);
      const w=16+rnd()*6, d=16+rnd()*6;
      list.push(buildAbandoned(sc,cMat,x,z,w,d,rnd,winMat,doorMat,glassMat));
    }
    // ห่วงเรืองแสง (เกตแข่ง FPV) — 🏁 รอบ 335: ใช้เป็นด่านโหมดแข่งเวลาด้วย (เก็บตำแหน่งไว้)
    const gateCol=[0xff3b6b,0x28e0ff,0xffd54f,0x6cff8a,0xb388ff];
    const gates=[];
    for(let i=0;i<6;i++){
      const g=new THREE.Mesh(new THREE.TorusGeometry(2.6,.28,8,24),
        new THREE.MeshBasicMaterial({color:gateCol[i%gateCol.length]}));
      const a=i/6*Math.PI*2, rr=20+rnd()*18;
      g.position.set(Math.cos(a)*rr, 5+rnd()*10, Math.sin(a)*rr);
      g.rotation.y=a+Math.PI/2; sc.add(g);
      gates.push({m:g, x:g.position.x, y:g.position.y, z:g.position.z, col:gateCol[i%gateCol.length]});
    }
    // ⚡ สถานีชาร์จบนดาดฟ้า — ลอยนิ่งเหนือแท่นแล้วแบตเพิ่มเร็ว (ตึกเว้น 3 หลัง)
    const chargers=[];
    list.forEach((b,i)=>{
      if(i%4!==0) return;
      const pad=new THREE.Mesh(new THREE.CircleGeometry(3.1,22),
        new THREE.MeshBasicMaterial({color:0x0b3a2e}));
      pad.rotation.x=-Math.PI/2; pad.position.set(b.x,b.h+.08,b.z); sc.add(pad);
      const ring=new THREE.Mesh(new THREE.RingGeometry(2.5,3.1,22),
        new THREE.MeshBasicMaterial({color:0x35ffb0,side:THREE.DoubleSide}));
      ring.rotation.x=-Math.PI/2; ring.position.set(b.x,b.h+.12,b.z); sc.add(ring);
      const bolt=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.2),
        new THREE.MeshBasicMaterial({map:chargeIconTexture(),transparent:true,side:THREE.DoubleSide}));
      bolt.rotation.x=-Math.PI/2; bolt.position.set(b.x,b.h+.16,b.z); sc.add(bolt);
      chargers.push({x:b.x, y:b.h, z:b.z, ring});
    });
    const basePad=new THREE.Mesh(new THREE.CircleGeometry(5,24),new THREE.MeshLambertMaterial({color:0x2f3236}));
    basePad.rotation.x=-Math.PI/2; basePad.position.set(0,.03,0); sc.add(basePad);
    const all=[]; list.forEach(b=>b.solids.forEach(s=>all.push(s)));
    ringAds(sc, 4, 14, 0, null);               // 📢 ป้ายโฆษณากลางลานเมืองร้าง (drone)
    const glassAll=[], doorAll=[];
    list.forEach(b=>{ (b.glass||[]).forEach(g=>glassAll.push(g)); (b.doors||[]).forEach(dr=>doorAll.push(dr)); });
    worlds[md]={scene:sc, trees:tr, buildings:list, solids:all, gates, chargers,
                glass:glassAll, doors:doorAll, winMat, glassMat};
    return;
  }else if(md==='soccer'){
    // ⚽ สนามฟุตบอล: พื้นหญ้า+เส้นสนาม · ประตู+ตาข่าย · อัฒจันทร์ 4 ด้าน · ลูกบอล · จุดพรีวิววิถี
    sc.add(new THREE.HemisphereLight(0xffffff,0x4f8f43,1.12));
    const sun=new THREE.DirectionalLight(0xfff4d0,.72); sun.position.set(24,55,32); sc.add(sun);
    const fieldW=44, fieldL=64;
    const field=new THREE.Mesh(new THREE.PlaneGeometry(fieldW,fieldL),
      new THREE.MeshLambertMaterial({map:soccerFieldTexture()}));
    field.rotation.x=-Math.PI/2; field.position.y=.02; sc.add(field);
    buildSoccerGoal(sc, GOAL_Z, GOAL_HW*2, GOAL_H);
    buildStands(sc, fieldW, fieldL);
    soccerBall=new THREE.Mesh(new THREE.SphereGeometry(BALL_R,18,14), soccerBallMat());
    soccerBall.position.set(0,BALL_R,PLAYER_Z); sc.add(soccerBall);
    soccerGuide=[];
    const gm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85});
    for(let i=0;i<14;i++){ const d=new THREE.Mesh(new THREE.SphereGeometry(.09,7,6),gm); d.visible=false; sc.add(d); soccerGuide.push(d); }
    ringAds(sc, 6, 26, 0, null);               // 📢 ป้ายโฆษณาริมสนามฟุตบอล (soccer)
    worlds[md]={scene:sc, trees:[], buildings:[]};
    return;
  }else if(md==='mecha'){
    // 🤖 สมรภูมิเอเลี่ยน: พื้นมืด + ก้อนหิน/ซากปรักหักพัง + คริสตัลเรืองแสง + แสงสลัว (เอเลี่ยนสร้างตอน start)
    sc.add(new THREE.HemisphereLight(0x8090c0,0x2a2a34,.9));
    const key=new THREE.DirectionalLight(0xbfd0ff,.55); key.position.set(-30,60,20); sc.add(key);
    const tr=[];
    const rockM=new THREE.MeshLambertMaterial({color:0x3a3a44});
    const rockG=new THREE.DodecahedronGeometry(1,0);
    for(let i=0;i<40;i++){
      const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
      if(Math.hypot(x,z)<10) continue;
      const r=new THREE.Mesh(rockG,rockM); const s=1+Math.random()*3.4;
      r.scale.set(s,s*.8,s); r.position.set(x,s*.4,z); r.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);
      sc.add(r); tr.push({x,z,r:s*1.05});
    }
    // คริสตัลเรืองแสงสีม่วง/ฟ้า (บรรยากาศต่างดาว)
    const cCol=[0x7c5cff,0x36e0ff,0xff5aa0,0x66ffcc];
    for(let i=0;i<26;i++){
      const cr=new THREE.Mesh(new THREE.ConeGeometry(.5+Math.random()*.7,2+Math.random()*4,5),
        new THREE.MeshBasicMaterial({color:cCol[i%cCol.length]}));
      const x=(Math.random()*2-1)*(HALF-4), z=(Math.random()*2-1)*(HALF-4);
      if(Math.hypot(x,z)<8){ i--; continue; }
      cr.position.set(x,1.4,z); cr.rotation.z=(Math.random()-.5)*.5; sc.add(cr);
    }
    ringAds(sc, 5, 45, 0, null);               // 📢 ป้ายโฆษณารอบสมรภูมิ (mecha)
    worlds[md]={scene:sc, trees:tr, buildings:[]};
    return;
  }else{
    // ต้นไม้ตายกิ่งโกร๋น + ป้ายหลุมศพ + ฟักทอง + ดวงไฟวิญญาณ
    const trunkM=new THREE.MeshLambertMaterial({color:0x2e2019});
    const trunkG=new THREE.CylinderGeometry(.22,.42,3.4,6);
    const branchG=new THREE.CylinderGeometry(.08,.16,1.8,5);
    for(let i=0;i<34;i++){
      const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
      if(Math.hypot(x,z)<8) continue;
      const t1=new THREE.Mesh(trunkG,trunkM); t1.position.set(x,1.7,z);
      const b1=new THREE.Mesh(branchG,trunkM);
      b1.position.set(x+.5,2.9,z); b1.rotation.z=-.8+Math.random()*.4;
      const b2=new THREE.Mesh(branchG,trunkM);
      b2.position.set(x-.5,2.5,z); b2.rotation.z=.8-Math.random()*.4;
      sc.add(t1,b1,b2); tr.push({x,z,r:.8});
    }
    const graveG=new THREE.BoxGeometry(.9,1.2,.22);
    const graveM=new THREE.MeshLambertMaterial({color:0x777788});
    for(let i=0;i<22;i++){
      const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
      if(Math.hypot(x,z)<8) continue;
      const g=new THREE.Mesh(graveG,graveM);
      g.position.set(x,.6,z); g.rotation.y=Math.random()*3; g.rotation.z=(Math.random()-.5)*.16;
      sc.add(g); tr.push({x,z,r:.7});
    }
    for(let i=0;i<12;i++){
      const p=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture('🎃'),transparent:true}));
      p.position.set((Math.random()*2-1)*(HALF-5),.55,(Math.random()*2-1)*(HALF-5));
      p.scale.set(1.1,1.1,1); sc.add(p);
    }
    const wispM=new THREE.MeshBasicMaterial({color:0x7cffb0});
    for(let i=0;i<10;i++){
      const w=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),wispM);
      w.position.set((Math.random()*2-1)*(HALF-4),1.4+Math.random()*1.5,(Math.random()*2-1)*(HALF-4));
      sc.add(w);
    }
  }
  ringAds(sc, 6, 44, 0, tr);                 // 📢 ป้าย "ติดต่อโฆษณา" รอบสนาม (adv/haunt)
  worlds[md]={scene:sc, trees:tr};
}

/* ============================================================
   ตัวอักษรในโลก (8.2)
   ============================================================ */
function randPos(minFromPlayer){
  for(let i=0;i<30;i++){
    const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
    if(Math.hypot(x-camera.position.x,z-camera.position.z)>=(minFromPlayer||10)) return {x,z};
  }
  return {x:0,z:0};
}
/* 🚗 สุ่มจุดบนถนนจริง ระยะ min–max จากผู้เล่น (โหมด drive) */
function randRoadPos(minD,maxD){
  const D=worlds.drive&&worlds.drive.d;
  if(!D) return randPos(minD);
  const pts=D.roadPts, n=pts.length/2;
  for(let i=0;i<40;i++){
    const j=Math.floor(Math.random()*n);
    const x=pts[j*2], z=pts[j*2+1];
    const d=Math.hypot(x-camera.position.x,z-camera.position.z);
    if(d>=minD && d<=maxD) return {x,z};
  }
  return {x:camera.position.x,z:camera.position.z+80};
}
function spawnLetter(ch){
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
  if(M.drive){
    // โหมดขับรถ: ตัวอักษรลอยบนถนนจริง — ขับชนเพื่อเก็บ (ไม่ต้องจอด)
    const p=randRoadPos(60,450);
    spr.position.set(p.x,1.7,p.z);
    spr.scale.set(3.4,3.4,1);                    // ใหญ่ มองเห็นแต่ไกลตอนขับ
  }else if(M.drone && buildings.length){
    // โหมดโดรน: ตัวอักษรซ่อนอยู่ในห้องต่างๆ ของตึกร้าง — บินลอดหน้าต่างเข้าไปเก็บ
    const b=buildings[Math.floor(Math.random()*buildings.length)];
    const r=b.rooms[Math.floor(Math.random()*b.rooms.length)];
    spr.position.set(r.x+(Math.random()*2-1), r.y, r.z+(Math.random()*2-1));
    spr.scale.set(1.8,1.8,1);
  }else if(M.heli && buildings.length){
    // โหมดเฮลิคอปเตอร์: ตัวอักษรอยู่บนยอดตึก (สุ่มตึก) — ต้องลงจอดเก็บ
    const b=buildings[Math.floor(Math.random()*buildings.length)];
    spr.position.set(b.x,b.h+1.3,b.z);
    spr.scale.set(2.2,2.2,1);                    // ใหญ่ขึ้น มองเห็นจากไกล
  }else if(M.soccer){
    // ⚽ ป้ายลอยนิ่งเป็นเป้าหน้าประตู — เตะบอลชนเพื่อเก็บ
    const p=soccerLetterPos();
    spr.position.set(p.x,p.y,p.z);
    spr.scale.set(2.5,2.5,1);                    // ป้ายใหญ่ เล็งเตะง่าย
  }else{
    const p=randPos(10);
    spr.position.set(p.x,1.15,p.z);
    spr.scale.set(1.5,1.5,1);
  }
  scene.add(spr);
  letters.push({ch,spr,born:performance.now(),baseY:spr.position.y});
}
function spawnLettersForWord(w){ w.en.split('').forEach(spawnLetter); }
/* เติมตัวอักษรที่ยังขาด (ผู้เล่นอาจใช้ตัวอักษรของคำ A ไปประกอบคำ B) */
function ensureCoverage(){
  const worldCnt={}; letters.forEach(l=>worldCnt[l.ch]=(worldCnt[l.ch]||0)+1);
  const haveCnt=Object.assign({},inv);
  words.forEach(w=>{
    const need={}; w.en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
    Object.keys(need).forEach(ch=>{
      let miss=need[ch]-(haveCnt[ch]||0)-(worldCnt[ch]||0);
      const useFromInv=Math.min(need[ch],haveCnt[ch]||0);
      haveCnt[ch]=(haveCnt[ch]||0)-useFromInv;
      while(miss-->0 && letters.length<90){ spawnLetter(ch); worldCnt[ch]=(worldCnt[ch]||0)+1; }
    });
  });
}
function relocateLetters(now){
  letters.forEach(l=>{
    if(now-l.born>=RELOCATE_MS){
      if(M.drive){
        const p=randRoadPos(60,450);
        l.spr.position.set(p.x,1.7,p.z);
      }else if(M.drone && buildings.length){
        const b=buildings[Math.floor(Math.random()*buildings.length)];
        const r=b.rooms[Math.floor(Math.random()*b.rooms.length)];
        l.spr.position.set(r.x+(Math.random()*2-1), r.y, r.z+(Math.random()*2-1));
      }else if(M.heli && buildings.length){
        const b=buildings[Math.floor(Math.random()*buildings.length)];
        l.spr.position.set(b.x,b.h+1.3,b.z);
      }else if(M.soccer){
        const p=soccerLetterPos();
        l.spr.position.set(p.x,p.y,p.z);
      }else{
        const p=randPos(10);
        l.spr.position.set(p.x,1.15,p.z);
      }
      l.baseY=l.spr.position.y;
      l.born=now;
    }
  });
}
function removeLetter(i){
  const l=letters[i];
  scene.remove(l.spr); l.spr.material.dispose();
  letters.splice(i,1);
}

/* ============================================================
   🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
   รวมขั้นตอนไว้ที่เดียว — ทุกโลก (เดิน/เฮลิฯ/โดรน/ขับรถ) เรียกฟังก์ชันนี้
   เดิมแต่ละโลกเขียนซ้ำกัน 4 ที่ ทำให้แก้ตกหล่นง่าย
   ============================================================ */
const LETTER_COIN=1;                         // เหรียญต่อตัวอักษร 1 ตัว
function pickUpLetter(i){
  const l=letters[i], ch=l.ch;
  const at=l.spr.position.clone();            // เก็บตำแหน่งไว้ก่อนลบ (ไว้เด้งป้ายตรงจุดนั้น)
  inv[ch]=(inv[ch]||0)+1;
  addCoins(LETTER_COIN);
  sessionCoins+=LETTER_COIN;                  // ให้สรุปท้ายรอบตรงกับที่ได้จริง
  removeLetter(i);
  letterPop(at,ch);                           // 🅰️ ป้ายตัวอักษร +1🪙 เด้งตรงจุดที่เก็บ
  letterChime();                              // 🔔 เสียงเก็บตัวอักษร (คนละเสียงกับจบคำ)
  speakLetter(ch);                            // 🔠 อ่านชื่อตัวอักษร (เอ บี ซี)
  renderHudInv(); renderHudWords(); renderHudTop();   // renderHudTop = อัปเดตเลขเหรียญบนจอทันที
  tryCompleteWords();
}
/* ป้ายเด้ง "ตัวอักษร +1🪙" ที่ตำแหน่งตัวอักษรในโลก 3D */
function letterPop(worldPos,ch){
  if(!coinPopEl || !camera) return;
  const v=worldPos.clone().project(camera);
  const el=document.createElement('div');
  el.className='sc-pop letter-pop';
  el.innerHTML=`<b>${ch.toUpperCase()}</b> +${LETTER_COIN}🪙`;
  const W=window.innerWidth, H=window.innerHeight;
  // เก็บตอนตัวอักษรอยู่ชิดตัว/หลังกล้อง (v.z>1) → เด้งกลางจอแทน ห้ามหายไปเฉยๆ
  const behind=v.z>1;
  const px=behind ? W*.5 : (v.x*.5+.5)*W;
  const py=behind ? H*.62 : (-v.y*.5+.5)*H;
  const pad=44;
  el.style.left=Math.max(pad,Math.min(W-pad,px))+'px';
  el.style.top =Math.max(pad,Math.min(H-pad,py))+'px';
  coinPopEl.appendChild(el);
  setTimeout(()=>el.remove(),900);
}
/* เสียง "ติ๊ง" สองโน้ตไล่ขึ้น — สั้น สดใส แยกออกจากเสียงจบคำชัดเจน */
function letterChime(){
  if(!state.sound) return;
  try{
    const S=HeliSound; S.ensureCtx();
    const ctx=S.ctx, t=ctx.currentTime;
    [[880,0],[1320,.07]].forEach(([f,d])=>{
      const o=ctx.createOscillator(); o.type='triangle'; o.frequency.value=f;
      const g=ctx.createGain();
      g.gain.setValueAtTime(.0001,t+d);
      g.gain.exponentialRampToValueAtTime(.13,t+d+.012);
      g.gain.exponentialRampToValueAtTime(.0001,t+d+.19);
      o.connect(g); g.connect(ctx.destination);
      o.start(t+d); o.stop(t+d+.2);
    });
  }catch(e){ sfx.coin(); }                            // เบราว์เซอร์ไม่รองรับ → ใช้เสียงเดิม
}

/* ============================================================
   ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
   ============================================================ */
function tryCompleteWords(){
  let done=true;
  while(done){
    done=false;
    for(let i=0;i<words.length;i++){
      const w=words[i];
      const need={}; w.en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
      if(Object.keys(need).every(ch=>(inv[ch]||0)>=need[ch])){
        Object.keys(need).forEach(ch=>{ inv[ch]-=need[ch]; if(inv[ch]<=0) delete inv[ch]; });
        completeWord(i); done=true; break;
      }
    }
  }
}
function completeWord(i){
  const w=words[i];
  words.splice(i,1);
  lastSharedDone=w.en;                      // 🤝 กันลูกทีมที่ทำคำนี้เสร็จก่อน วนกลับไปรับคำเดิมของหัวหน้า (รอหัวหน้าเปลี่ยนคำก่อน)
  doneList().push(w.en);
  addCoins(M.reward);
  sessionCoins+=M.reward; sessionWords++;
  questEvent('word3d');                     // 🎯 Daily Quest: ประกอบคำในโลก 3D
  if(!sessionWordLog.some(x=>x.en===w.en)) sessionWordLog.push({en:w.en,th:w.th});   // 📖 เก็บเข้าสมุดคำศัพท์รอบนี้ (ไม่ซ้ำ)
  if(typeof vbRecord==='function') vbRecord(w.en,w.th,true);   // 📒 รอบ 291: ลงสมุดคำศัพท์ถาวร (vocabbook.js)
  sfx.levelup();
  setTimeout(()=>speakWord(w.en), 700);     // 🔊 อ่านคำที่ผสมสำเร็จ (รอแตรฉลองจบก่อน)
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(60);
  showBanner(`🎉 <b>${escapeHTML(w.en.toUpperCase())}</b> = ${escapeHTML(w.th)}<br><span class="adv-ban-coin">+${M.reward} 🪙</span>`);
  const fresh=pickWords(1);                 // เติมคำใหม่ให้ครบ 10 (8.4)
  if(M.soccer){ fresh.forEach(nw=>words.push(nw)); soccerRetarget(); }   // ⚽ ป้ายคงที่ รีไซเคิลเอง (ไม่ spawn เพิ่ม)
  else{ fresh.forEach(nw=>{ words.push(nw); spawnLettersForWord(nw); }); ensureCoverage(); }
  if(myRef) sendPos(true);                  // 🤝 ดันคำเป้าหมายใหม่ให้ลูกทีมตามทันที (ไม่ต้องรอขยับตำแหน่ง)
  // 🎖️ สตรีคนักบิน (รอบ 62): ประกอบคำในโลกเฮลิฯ +1 · ข้ามเส้น 5/15/30 → เข็มใหม่ (ไม่มีวันหลุด)
  if(M.heli){
    state.heliStreak=(state.heliStreak||0)+1;
    // 🎧 ครูฝึกลุ้นตอนเหลืออีก 1 คำจะได้เข็มใหม่ (รอจังหวะฉลองคำ+อ่านคำจบก่อน)
    const near=PILOT_TIERS.find(t=>t[1]>state.pilotBadge && state.heliStreak===t[0]-1);
    if(near) setTimeout(()=>{
      if(running) ATC.say(`One more word for your ${['','bronze','silver','gold'][near[1]]} pilot badge, captain. Stay calm and fly safe!`);
    },3200);
    const tier=PILOT_TIERS.filter(t=>state.heliStreak>=t[0]).pop();
    if(tier && tier[1]>state.pilotBadge){
      state.pilotBadge=tier[1];
      setTimeout(()=>{
        celebrateBadge(tier[2], `ได้เข็มนักบิน${tier[3]}!`,
          `บิน ${tier[0]} คำติดโดยไม่ชนเลย — สุดยอดกัปตัน! เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกแล้ว 🎉`);
        if(typeof checkCrown === 'function') checkCrown();   // 👑 เช็กเข็มลับ (ครบ 4 สาย)
        if(myRef) sendPos(true);            // อัปเดตชื่อ+เข็มบนหัวทุกเครื่อง
      },2600);                              // รอ banner ฉลองคำจบก่อน
    }
  }
  saveState();
  if(myRef) sendPos(true);                  // ประกาศคะแนนใหม่ขึ้นกระดานทุกเครื่องทันที
  renderHudWords(); renderHudInv(); renderHudTop(); renderBoard();
}

/* ============================================================
   โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
   ============================================================ */
function spawnMonster(){
  if(monsters.length>=M.monMax) return;
  const emo=M.monEmoji[Math.floor(Math.random()*M.monEmoji.length)];
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture(emo),transparent:true}));
  const p=randPos(22);
  spr.position.set(p.x,1.2,p.z); spr.scale.set(2.2,2.2,1);
  scene.add(spr);
  monsters.push({spr,hp:M.monHp,tgt:randPos(0),wanderAt:0,hitAt:0});
}
function killMonster(i){
  const m=monsters[i];
  scene.remove(m.spr); m.spr.material.dispose();
  monsters.splice(i,1);
  addCoins(MONSTER_REWARD); sessionCoins+=MONSTER_REWARD;
  sfx.coin();
  saveState(); renderHudTop();
}
function tickMonsters(dt,now){
  const px=camera.position.x, pz=camera.position.z;
  monsters.forEach(m=>{
    const mp=m.spr.position;
    const d=Math.hypot(px-mp.x,pz-mp.z);
    let tx,tz,sp;
    if(d<15){ tx=px; tz=pz; sp=M.monSpeed; }
    else{
      if(now>m.wanderAt){ m.tgt=randPos(0); m.wanderAt=now+4000+Math.random()*4000; }
      tx=m.tgt.x; tz=m.tgt.z; sp=M.monSpeed*.45;
    }
    const dd=Math.hypot(tx-mp.x,tz-mp.z);
    if(dd>.3){ mp.x+=(tx-mp.x)/dd*sp*dt; mp.z+=(tz-mp.z)/dd*sp*dt; }
    mp.y=1.2+Math.sin(now/300+mp.x)*0.15;
    if(d<1.5 && now-m.hitAt>1200){
      m.hitAt=now;
      damagePlayer(M.monDmg);
      const kx=(px-mp.x)/(d||1), kz=(pz-mp.z)/(d||1);
      movePlayer(kx*1.2, kz*1.2);
    }
  });
}
function damagePlayer(n){
  if(!running) return;
  hp=Math.max(0,hp-n);
  sfx.wrong();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(80);
  dmgFlashEl.classList.remove('on'); void dmgFlashEl.offsetWidth; dmgFlashEl.classList.add('on');
  // 🎖️ ชนในโลกเฮลิฯ = สตรีคนักบินขาด (เข็มที่ได้แล้วไม่หาย)
  if(M.heli && (state.heliStreak||0)>0){
    state.heliStreak=0; saveState();
    showBanner('💔 <b>สตรีคนักบินขาดแล้ว!</b><br><small>เริ่มนับใหม่ — บินให้เนียนกว่าเดิมนะกัปตัน</small>');
  }
  renderHudTop();
  if(hp<=0) knockedOut();
}

/* ---------- ยิง (เฉพาะโหมด adv) ---------- */
function shoot(){
  const now=performance.now();
  if(!running || !M.shoot || now-lastShot<SHOOT_GAP_MS) return;
  lastShot=now;
  sfx.select();
  const mesh=new THREE.Mesh(
    new THREE.SphereGeometry(.14,8,6),
    new THREE.MeshBasicMaterial({color:0xffe13a}));
  mesh.position.copy(camera.position);
  const dir=new THREE.Vector3(); camera.getWorldDirection(dir);
  mesh.position.addScaledVector(dir,.6);
  scene.add(mesh);
  shots.push({mesh,dir,life:1.4});
}
function tickShots(dt){
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];
    s.mesh.position.addScaledVector(s.dir,30*dt);
    s.life-=dt;
    let hit=false;
    for(let j=monsters.length-1;j>=0;j--){
      if(s.mesh.position.distanceTo(monsters[j].spr.position)<1.2){
        hit=true;
        monsters[j].hp--;
        if(monsters[j].hp<=0) killMonster(j);
        else{ sfx.correct(); monsters[j].spr.material.color.set(0xff8080);
              setTimeout(((m)=>()=>{ if(m.spr.material) m.spr.material.color.set(0xffffff); })(monsters[j]),150); }
        break;
      }
    }
    if(hit || s.life<=0){
      scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose();
      shots.splice(i,1);
    }
  }
}

/* ============================================================
   โหมด haunt: ผีโผล่ 3 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
   ============================================================ */
function spawnGhost(first){
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:ghostTexture(),transparent:true,opacity:0}));
  spr.scale.set(2.6,2.6,1);
  scene.add(spr);
  const g={spr,born:0,hunting:false,tgt:{x:0,z:0},wanderAt:0,wailAt:0};
  respawnGhost(g, first?28:0);              // ตอนเริ่มเกม บังคับเกิดไกลผู้เล่นก่อน (ยังไม่ทันตั้งตัว)
  monsters.push(g);
}
// สไตล์เฉพาะตัว (index=เลขไฟล์ ghost_N · ไม่มี = ใช้ค่า default) · h=ความสูงตัวในโลก · squeeze<1 = ผอมกว่าสัดส่วนจริง
const GHOST_STYLE={ 2:{h:5.8, squeeze:.6} };   // เปรต ghost_2: สูงโย่งเท่าต้นตาล + ผอมพิเศษ (look ที่ผู้ใช้เลือก)
const GHOST_H_DEFAULT=2.5;                      // ผีทั่วไปสูงเท่านี้ในโลกจริง
function applyGhostSize(g){  // ฟิตสเกลอัตโนมัติจากสัดส่วนภาพจริง → ไม่บิดเบี้ยว(ภาพแนวตั้งไม่โดนบีบ) เท้าแตะพื้น ครอบภาพผีทุกตัว
  const u=g.spr.material.map && g.spr.material.map.userData;
  if(u && u.fhFrac){
    const st=GHOST_STYLE[u.gi]||{}, Hf=st.h||GHOST_H_DEFAULT, sq=st.squeeze||1;
    const sy=Hf/u.fhFrac, sx=sy*u.aspect*sq;   // sy จากความสูงตัวที่อยากได้ · sx รักษาสัดส่วนภาพจริง (×squeeze)
    g.spr.scale.set(sx,sy,1);
    g.baseY=sy*(0.5-u.belowFrac);              // ดันขอบล่างตัว (เท้า) ให้แตะพื้นพอดี
  } else { g.spr.scale.set(2.6,2.6,1); g.baseY=1.35; }   // emoji / ยังวัดไม่เสร็จ → ค่าเดิม
}
function respawnGhost(g, minDist){
  // ภาพผีเจนเสร็จโหลดช้ากว่าเกมเริ่ม → สลับเป็นภาพจริง (และสุ่มตัวใหม่) ทุกครั้งที่ย้ายที่
  if(ghostTex.length){ g.spr.material.map=ghostTexture(); g.spr.material.needsUpdate=true; }
  applyGhostSize(g);
  const p=randPos(minDist!==undefined?minDist:0);
  g.spr.position.set(p.x,g.baseY,p.z);
  g.born=performance.now();
  g.tgt=randPos(0); g.wanderAt=0;
  const d=Math.hypot(p.x-camera.position.x,p.z-camera.position.z);
  const wasHunting=g.hunting;
  g.hunting=d<M.huntR;
  if(g.hunting && !wasHunting && running){       // ลุ้นตรงนี้: ผีสุ่มเกิดใกล้เรา!
    HSound.whoosh();
    if(state.haptic!==false && navigator.vibrate) navigator.vibrate([60,40,60]);
  }
}
function tickGhosts(dt,now){
  tickSurvive();                                   // ⏱ อัปเดตนาฬิกาหนีรอด + banner สถิติใหม่
  const px=camera.position.x, pz=camera.position.z;
  let hunted=null;
  monsters.forEach(g=>{
    const life=now-g.born;
    if(life>=M.ghostLife){ respawnGhost(g); return; }     // ครบอายุผี (3 วิ) → หายไปเกิดที่ใหม่ (รอด!)
    // โปร่งใสตอนเกิด/ก่อนหาย (เตือนล่วงหน้า) · fade สั้นลงตามอายุ ไม่งั้นผี 3 วิจะจางเกือบตลอด
    const fade=Math.min(600,M.ghostLife*.12);
    const fadeIn=Math.min(1,life/fade), fadeOut=Math.min(1,(M.ghostLife-life)/fade);
    g.spr.material.opacity=.92*Math.min(fadeIn,fadeOut);
    const mp=g.spr.position;
    const d=Math.hypot(px-mp.x,pz-mp.z);
    if(!g.hunting && d<M.seeR){                            // เดินเข้าไปใกล้ผีเอง → มันเห็นเรา
      g.hunting=true;
      HSound.whoosh();
      if(state.haptic!==false && navigator.vibrate) navigator.vibrate([60,40,60]);
    }
    if(g.hunting){
      const dd=d||1;
      mp.x+=(px-mp.x)/dd*M.ghostSpeed*dt;
      mp.z+=(pz-mp.z)/dd*M.ghostSpeed*dt;
      if(!hunted || (M.ghostLife-life)<hunted.left) hunted={left:M.ghostLife-life, dist:d};
      if(now-g.wailAt>2600){ g.wailAt=now; HSound.wail(); }
    }else{
      if(now>g.wanderAt){ g.tgt=randPos(0); g.wanderAt=now+5000+Math.random()*5000; }
      const dd=Math.hypot(g.tgt.x-mp.x,g.tgt.z-mp.z);
      if(dd>.3){ mp.x+=(g.tgt.x-mp.x)/dd*.8*dt; mp.z+=(g.tgt.z-mp.z)/dd*.8*dt; }
    }
    mp.y=(g.baseY||1.35)+Math.sin(now/260+mp.x)*.22;
    if(d<1.25 && g.spr.material.opacity>.5) ghostHit(g);   // โดนแตะ = เสียหัวใจ (หมดค่อยจบ)
  });
  // HUD นับถอยหลังหนี + เสียงหัวใจเต้นตามความใกล้
  if(hunted && running){
    hudHuntEl.style.display='block';
    hudHuntEl.textContent=`👻 หนี! อีก ${Math.ceil(hunted.left/1000)} วิ ผีจะหายไป`;
    overlayEl.classList.add('adv-hunted');
    HSound.heartbeat(hunted.dist);
  }else{
    hudHuntEl.style.display='none';
    overlayEl.classList.remove('adv-hunted');
    HSound.heartbeat(null);
  }
}

/* 📖 สมุดคำศัพท์รอบนี้ — โชว์คำที่ประกอบสำเร็จ + คำแปลไทย ตอนออก/จบเกม (ทบทวนคำ · ครู/ผู้ปกครองเห็นผลเรียนรู้) */
function sessionRecapHtml(){
  if(!sessionWordLog.length) return '';
  const chips=sessionWordLog.map(x=>`<span class="adv-recap-w">${escapeHTML(x.en.toUpperCase())}<small>${escapeHTML(x.th)}</small></span>`).join('');
  return `<div class="adv-recap"><div class="adv-recap-h">📖 คำที่หนูประกอบได้รอบนี้ (${sessionWordLog.length} คำ)</div><div class="adv-recap-list">${chips}</div></div>`;
}

/* ⏱ รอบ 256: สถิติ "หนีผีรอดนานสุด" — เวลารอดต่อเนื่อง (วินาที) ไม่โดนจับ · จบช่วงตอนโดนจับ/ออกโลก */
function hauntRunSec(){ return hauntRunStart ? Math.floor((performance.now()-hauntRunStart)/1000) : 0; }
function fmtSurv(s){ return s>=60 ? `${Math.floor(s/60)} นาที ${s%60} วิ` : `${s} วิ`; }
function hauntSurviveFinish(){
  if(mode!=='haunt' || !hauntRunStart) return;
  const run=hauntRunSec();
  hauntRunStart=0;
  if(run > (state.hauntSurviveBest||0)){
    state.hauntSurviveBest=run;
    saveState();
    if(typeof onlinePushScore==='function') onlinePushScore();   // ดันสถิติขึ้น /leaderboard (field hs) ให้เพื่อนเห็นในการ์ด
  }
}
function tickSurvive(){
  if(!hudSurvEl || mode!=='haunt' || !running || !hauntRunStart) return;
  const run=hauntRunSec(), best=state.hauntSurviveBest||0;
  const txt=`⏱ รอด ${fmtSurv(run)} · 🏆 ${fmtSurv(Math.max(best,run))}`;
  if(hudSurvEl.textContent!==txt) hudSurvEl.textContent=txt;
  if(!hauntRecordShown && best>0 && run>best){
    hauntRecordShown=true;
    sfx.levelup();
    showBanner(`🏆 <b>สถิติใหม่! หนีผีรอดนานสุด ${fmtSurv(run)}</b><br><small>ยิ่งรอดนานสถิติยิ่งพุ่ง — เพื่อนเห็นในการ์ดของหนูด้วยนะ</small>`);
  }
}

/* ---------- โดนผีแตะ = เสียหัวใจ 1 ดวง (ไม่ตายทีเดียว) ---------- */
function renderHearts(){
  if(!hudHeartEl) return;
  const on = mode==='haunt';
  if(hudSurvEl) hudSurvEl.style.display = on ? 'block' : 'none';
  if(!on){ hudHeartEl.style.display='none'; return; }
  hudHeartEl.style.display='block';
  const live=Math.max(0,Math.min(HAUNT_LIVES,hauntLives));
  hudHeartEl.textContent='❤️'.repeat(live)+'🖤'.repeat(HAUNT_LIVES-live);
}
function ghostHit(g){
  if(!running) return;
  const now=performance.now();
  if(now<hurtUntil) return;                      // อยู่ในช่วงกันโดนซ้ำ — ยังไม่เสียหัวใจ
  hauntLives--;
  renderHearts();
  if(hauntLives<=0){ caught(); return; }         // หัวใจหมด → jump scare เต็มจอ แล้วฟื้นเล่นต่อ (รอบ 255 ไม่มีจบเกม)
  hurtUntil=now+HAUNT_IFRAME;
  // กระเด็นผู้เล่นออกจากผี + ผีถอย + เลิกไล่ชั่วครู่ (ให้ตั้งตัวหนีต่อ)
  const mp=g.spr.position, dx=camera.position.x-mp.x, dz=camera.position.z-mp.z, dd=Math.hypot(dx,dz)||1;
  movePlayer(dx/dd*3.4, dz/dd*3.4);
  mp.x-=dx/dd*2.2; mp.z-=dz/dd*2.2;
  g.hunting=false; g.wanderAt=now+1400; g.tgt=randPos(0);
  dmgFlashEl.classList.remove('on'); void dmgFlashEl.offsetWidth; dmgFlashEl.classList.add('on');
  HSound.whoosh();
  // 📳 สั่นแรงชัด "โดนผีทำร้าย" — กระแทก 2 ที (iOS ไม่รองรับ Vibration API สั่นไม่ได้)
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([350,90,180,90,350]);
  showBanner(`💔 <b>โดนผีแตะ! เหลือ ${hauntLives} หัวใจ</b><br><small>รีบวิ่งหนีต่อ! หัวใจหมดระวังผีหลอกเต็มจอ!!</small>`);
}

/* ---------- Jump scare (รอบ 255 ผู้ใช้สั่ง 17 ก.ค. 2026: โลก 3D ไม่มีตาย/เกมโอเวอร์) ----------
   หลอกเต็มจอเหมือนเดิม (ผู้ใช้เคาะ: เต็มที่) แต่ไม่จบเกม — ฟื้นหัวใจครบ 3 ดวง ผีย้ายไปไกล เล่นต่อได้เลย */
function caught(){
  if(!running) return;
  hauntSurviveFinish();                          // ⏱ โดนจับ = จบช่วงรอด เก็บสถิติถ้าทำได้นานกว่าเดิม
  hurtUntil=performance.now()+6000;              // กันผีแตะซ้ำช่วงโดนหลอก+เพิ่งฟื้น
  HSound.heartbeat(null);
  HSound.scream();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([400,90,220]);
  const gsrc=ghostScareSrc(), scareImg=scareEl.querySelector('img');   // ผีไทยพุ่งเต็มจอถ้ามีภาพ ไม่มี=👻 emoji เดิม
  if(gsrc && scareImg){ scareImg.src=gsrc; scareEl.classList.add('has-img'); }
  else scareEl.classList.remove('has-img');
  scareEl.classList.add('on');
  overlayEl.classList.add('adv-shake');
  setTimeout(()=>{
    scareEl.classList.remove('on');
    overlayEl.classList.remove('adv-shake');
    hauntLives=HAUNT_LIVES;
    renderHearts();
    monsters.forEach(g=>respawnGhost(g, 28));    // ผีกระเจิงไปเกิดไกลๆ ให้ผู้เล่นตั้งตัวใหม่
    hauntRunStart=performance.now(); hauntRecordShown=false;   // ⏱ เริ่มจับเวลารอดรอบใหม่
    showBanner(`👻 <b>โดนผีจับ!! แต่หนูฟื้นแล้ว</b> ❤️❤️❤️<br><small>ผีกระเจิงไปไกลแล้ว — เริ่มจับเวลาหนีรอดรอบใหม่ ⏱ ทำสถิติให้ดีกว่าเดิมนะ</small>`);
  },1500);
}

/* ---------- พลังหมด (รอบ 255 ผู้ใช้สั่ง 17 ก.ค. 2026): ไม่มีตาย/เกมโอเวอร์ทุกโลก 3D ----------
   ฟื้นพลังเต็มอัตโนมัติ เล่นต่อได้เรื่อยๆ เบื่อเมื่อไหร่กดออกเอง (ไม่ต้องจ่ายค่ารักษา ไม่ล็อกเข้าโลก)
   ⚠️ ค่าปรับจราจรโลกขับรถกำแพงเพชรเป็นคนละระบบ — ยังมีผลตามเดิม */
function knockedOut(){
  hp=maxHp;
  renderHudTop();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([200,80,200]);
  showBanner(`${M.koTitle||'💫 พลังหมดแล้ว!'}<br><small>🔧 ฟื้นพลังอัตโนมัติเต็มหลอด — เล่นต่อได้เลย เบื่อเมื่อไหร่ค่อยกดออกนะ</small>`);
}

/* ============================================================
   เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
   ถ้ามีไฟล์ sound/haunt_ambient.mp3 / haunt_chase.mp3 / haunt_scare.mp3
   (เจนจาก Suno — PROMPTS_SOUND.md) จะใช้ไฟล์จริงแทนอัตโนมัติ
   ============================================================ */
const HSound={
  ctx:null, master:null, ambNodes:[], eerieTimer:0, hbTimer:0, hbRate:0,
  files:{amb:null,chase:null,scare:null}, probed:false, chaseOn:false,
  probe(){
    if(this.probed) return; this.probed=true;
    // probe ด้วย Audio element (ห้าม fetch local — กติกาเดียวกับ probeImages)
    [['amb','sound/haunt_ambient.mp3'],['chase','sound/haunt_chase.mp3'],['scare','sound/haunt_scare.mp3']].forEach(([k,src])=>{
      const a=new Audio();
      a.addEventListener('canplaythrough',()=>{ this.files[k]=a; },{once:true});
      a.preload='auto'; a.src=src;
    });
  },
  ensure(){
    if(!this.ctx){
      this.ctx=new (window.AudioContext||window.webkitAudioContext)();
      this.master=this.ctx.createGain();
      this.master.gain.value=.9;
      this.master.connect(this.ctx.destination);
    }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
  },
  noiseBuf(){
    if(this._nb) return this._nb;
    const len=this.ctx.sampleRate*2, buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    this._nb=buf; return buf;
  },
  startAmbient(){
    if(!state.sound) return;
    this.probe();
    if(this.files.amb){ this.files.amb.loop=true; this.files.amb.volume=.55; this.files.amb.play().catch(()=>{}); return; }
    this.ensure();
    // ลมหอน: white noise → lowpass + LFO ขยับความถี่
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf(); n.loop=true;
    const lp=this.ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=260; lp.Q.value=1.2;
    const ng=this.ctx.createGain(); ng.gain.value=.05;
    const lfo=this.ctx.createOscillator(); lfo.frequency.value=.13;
    const lfoG=this.ctx.createGain(); lfoG.gain.value=140;
    lfo.connect(lfoG); lfoG.connect(lp.frequency);
    n.connect(lp); lp.connect(ng); ng.connect(this.master);
    n.start(); lfo.start();
    // drone ทุ้มสองเสียงเพี้ยนกันนิดๆ (หลอนแบบคลาสสิก)
    const o1=this.ctx.createOscillator(); o1.type='sine'; o1.frequency.value=55;
    const o2=this.ctx.createOscillator(); o2.type='sine'; o2.frequency.value=56.7;
    const og=this.ctx.createGain(); og.gain.value=.035;
    o1.connect(og); o2.connect(og); og.connect(this.master);
    o1.start(); o2.start();
    this.ambNodes=[n,lfo,o1,o2,og,ng];
    // โน้ตหลอนสุ่มเป็นระยะ
    this.eerieTimer=setInterval(()=>{ if(state.sound) this.eerie(); },9000+Math.random()*7000);
  },
  eerie(){
    this.ensure();
    const o=this.ctx.createOscillator(); o.type='sine';
    const f=300+Math.random()*500;
    o.frequency.setValueAtTime(f,this.ctx.currentTime);
    o.frequency.linearRampToValueAtTime(f*.82,this.ctx.currentTime+2.2);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.0001,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.03,this.ctx.currentTime+.7);
    g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+2.4);
    o.connect(g); g.connect(this.master);
    o.start(); o.stop(this.ctx.currentTime+2.5);
  },
  wail(){                                    // เสียงผีหวีดตอนไล่
    if(!state.sound) return;
    this.ensure();
    const o=this.ctx.createOscillator(); o.type='triangle';
    o.frequency.setValueAtTime(700,this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(320,this.ctx.currentTime+.9);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.06,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.95);
    o.connect(g); g.connect(this.master);
    o.start(); o.stop(this.ctx.currentTime+1);
  },
  whoosh(){                                  // ผีโผล่ใกล้ (เตือนให้หนี)
    if(!state.sound) return;
    this.ensure();
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=2;
    bp.frequency.setValueAtTime(1400,this.ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(180,this.ctx.currentTime+.55);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.22,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.6);
    n.connect(bp); bp.connect(g); g.connect(this.master);
    n.start(); n.stop(this.ctx.currentTime+.65);
  },
  heartbeat(dist){                           // dist=null → หยุด · ยิ่งใกล้ยิ่งเร็ว
    if(dist===null){
      if(this.hbTimer){ clearInterval(this.hbTimer); this.hbTimer=0; this.hbRate=0; }
      if(this.files.chase && this.chaseOn){ this.files.chase.pause(); this.chaseOn=false; }
      return;
    }
    if(!state.sound) return;
    if(this.files.chase){
      if(!this.chaseOn){ this.files.chase.loop=true; this.files.chase.volume=.7; this.files.chase.play().catch(()=>{}); this.chaseOn=true; }
      return;
    }
    const rate=dist<6?380:dist<12?560:800;
    if(rate===this.hbRate) return;
    this.hbRate=rate;
    if(this.hbTimer) clearInterval(this.hbTimer);
    const thump=(when,vol)=>{
      const o=this.ctx.createOscillator(); o.type='sine'; o.frequency.value=52;
      const g=this.ctx.createGain();
      g.gain.setValueAtTime(vol,when);
      g.gain.exponentialRampToValueAtTime(.001,when+.14);
      o.connect(g); g.connect(this.master);
      o.start(when); o.stop(when+.15);
    };
    this.ensure();
    this.hbTimer=setInterval(()=>{
      if(!state.sound) return;
      const t=this.ctx.currentTime;
      thump(t,.24); thump(t+.17,.15);        // ตุบ-ตับ
    },rate);
  },
  scream(){                                  // jump scare!
    if(!state.sound) return;
    if(this.files.scare){ this.files.scare.currentTime=0; this.files.scare.volume=1; this.files.scare.play().catch(()=>{}); return; }
    this.ensure();
    const t=this.ctx.currentTime;
    const o1=this.ctx.createOscillator(); o1.type='sawtooth';
    o1.frequency.setValueAtTime(820,t); o1.frequency.exponentialRampToValueAtTime(140,t+1.1);
    const o2=this.ctx.createOscillator(); o2.type='square';
    o2.frequency.setValueAtTime(666,t); o2.frequency.exponentialRampToValueAtTime(97,t+1.1);
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.5,t);
    g.gain.exponentialRampToValueAtTime(.001,t+1.25);
    o1.connect(g); o2.connect(g); n.connect(g); g.connect(this.master);
    o1.start(t); o2.start(t); n.start(t);
    o1.stop(t+1.3); o2.stop(t+1.3); n.stop(t+1.3);
  },
  stopAll(){
    this.heartbeat(null);
    if(this.eerieTimer){ clearInterval(this.eerieTimer); this.eerieTimer=0; }
    this.ambNodes.forEach(nd=>{ try{ nd.stop ? nd.stop() : nd.disconnect(); }catch(e){} });
    this.ambNodes=[];
    if(this.files.amb){ this.files.amb.pause(); }
    if(this.files.chase){ this.files.chase.pause(); this.chaseOn=false; }
  },
};

/* ============================================================
   Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
   /world/<map>/<uid> = {n,av,x,z,yaw,ts} · onDisconnect ลบตัวเอง
   letters/monster เป็นของใครของมัน (ไม่ sync — เห็นกันอย่างเดียว)
   ============================================================ */
function netReady(){
  return typeof Online!=='undefined' && Online.ready && Online.db
      && typeof Auth!=='undefined' && Auth.user;
}
function netJoin(){
  if(!netReady()) return;
  const uid=onlineKey();
  worldRef=Online.db.ref('world/'+mode);
  myRef=worldRef.child(uid);
  myRef.onDisconnect().remove();
  lastSent=null; sendPos(true);
  worldRef.on('child_added',onPeerData);
  worldRef.on('child_changed',onPeerData);
  worldRef.on('child_removed',s=>removePeer(s.key));
  Voice.join();
  podiumJoin();
}
function sendPos(force){
  if(!myRef) return;
  const now=performance.now();
  if(!force && now-lastNetSend<NET_SEND_MS) return;
  const x=Math.round(camera.position.x*10)/10, z=Math.round(camera.position.z*10)/10,
        y=Math.round(yaw*100)/100;
  if(!force && lastSent && lastSent.x===x && lastSent.z===z && lastSent.yaw===y) return;
  lastNetSend=now; lastSent={x,z,yaw:y};
  const payload={
    n:onlineDisplayName()+pilotEmoji(state.pilotBadge)+thunderEmoji(state.thunderBadge)+daredevilEmoji(state.daredevilBadge)+glassEmoji(state.glassBadge)+diligentEmoji(state.diligentBadge)+mechaBossEmoji(state.mechaBossBadge)+softLandEmoji(state.perfLandBadge)+airLetterEmoji(state.airLetterBadge),   // 🎖️⚡🎯🏅🪶🪂 เข็มติดท้ายชื่อ (เพื่อนเห็นทุกโลก)
    // 🧱 โลกขับรถ+โลกเดินส่งรหัสตัวบล็อก · 🚁 รอบ 355: โลกเฮลิฯ ยัดเฟสเดินเท้าลง av แทน ('h_w/r/g/p' ≤8 ผ่าน rules เดิม ไม่ต้อง publish — makePeerSprite ฝั่งรับไม่เคยใช้ av ในโหมดบินอยู่แล้ว)
    av:M.heli?('h_'+({walk:'w',lift:'w',ride:'r',wing:'g',pilot:'p'}[hPhase]||'p'))
      :(((M.drive||mode==='adv'||mode==='haunt')&&state.blockAv)?state.blockAv:(state.playerAvatar||'')),
    x, z, yaw:y, m:Voice.mic?1:0, w:sessionWords, ts:firebase.database.ServerValue.TIMESTAMP,
  };
  if(M.heli||M.drone) payload.y=Math.round(camera.position.y*10)/10;   // ความสูงบิน (โหมดเฮลิฯ/โดรน)
  // 🚦 รอบ 132: ไฟเลี้ยว (1=ซ้าย 2=ขวา) — ปิดไม่ส่ง field หายไปเอง (set ทับทั้ง node) · rules ต้องรับ tl ก่อน (RULES.md)
  if(M.drive && netTlOk && tlSig) payload.tl=tlSig;
  // 🤝 คำเป้าหมายปัจจุบัน — ส่งเฉพาะตอนมีเพื่อนปาร์ตี้(invite กัน)อยู่ในโลกจริง
  // (คนเล่นทั่วไปไม่ส่ง → ไม่ผูกกับ rules ใหม่ ไม่มีทางทำ /world พังถ้ายังไม่ publish)
  if(words[0] && Object.keys(peers).some(uid=>tinvLinked(uid))) payload.cw=words[0].en+'|'+words[0].th;
  // แนบแชทลอยหัวระหว่างยังสด (ct = Date.now คงที่ต่อข้อความ — ฝั่งรับใช้แยกข้อความใหม่/เก่า)
  if(myChat && Date.now()-myChat.ts<BUBBLE_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  myRef.set(payload).catch(()=>{
    // 🚦 rules ยังไม่รับ field tl (ยังไม่ publish) → ตัด tl แล้วส่งซ้ำทันที กัน multiplayer พังทั้งก้อน
    if(payload.tl!==undefined){ netTlOk=false; delete payload.tl; myRef.set(payload).catch(()=>{}); }
  });
}
/* ส่งแชทลอยหัว: กรองคำหยาบ + echo ของตัวเองมุมล่าง */
function sendChat(text){
  text=String(text||'').trim().slice(0,CHAT_MAX);
  if(!text) return;
  if(typeof nameHasBadWord==='function' && nameHasBadWord(text)){
    sfx.wrong(); toast('⚠️ ข้อความมีคำไม่สุภาพ ลองพิมพ์ใหม่นะ'); return;
  }
  myChat={text, ts:Date.now()};
  if(myRef) sendPos(true);
  selfMsgEl.textContent='💬 '+text;
  selfMsgEl.classList.add('on');
  clearTimeout(selfMsgEl._tm);
  selfMsgEl._tm=setTimeout(()=>selfMsgEl.classList.remove('on'),BUBBLE_MS);
  sfx.select();
}
function toggleChatBox(open){
  const showing=getComputedStyle(chatBoxEl).display!=='none';   // CSS ตั้ง none ไว้ inline ยังว่าง — ต้องดู computed
  const want=open===undefined?!showing:open;
  chatBoxEl.style.display=want?'flex':'none';
  if(want){
    if(document.pointerLockElement) document.exitPointerLock();
    chatInputEl.value='';
    setTimeout(()=>chatInputEl.focus(),50);
  }
}
function onPeerData(snap){
  const uid=snap.key;
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  const d=snap.val()||{};
  if(typeof d.x!=='number' || typeof d.z!=='number') return;
  const py=(typeof d.y==='number')?d.y:1.5;
  let p=peers[uid];
  const walkBlk=(mode==='adv'||mode==='haunt'||mode==='soccer');   // 🧱 โลกเดิน/สนามฟุตบอล: เพื่อน = หุ่นบล็อกเดินได้ (มาร่วมเตะในสนามเดียวกัน)
  if(!p){
    // 🧱 โลกขับรถ: เพื่อน = รถบล็อก+หุ่นบล็อก 3D หมุนตาม yaw · โลกเดิน = หุ่นบล็อกเดิน · เฮลิฯ/โดรนคง sprite เดิม
    p=peers[uid]={spr:M.drive?makeBlockPeer(d.n,d.av,uid):walkBlk?makeBlockWalkPeer(d.n,d.av,uid):makePeerSprite(d.n,d.av),
                  cur:{x:d.x,z:d.z,y:py}, tgt:{x:d.x,z:d.z,y:py}, n:d.n||'เพื่อน',
                  blk:!!M.drive, walk:walkBlk, av:d.av, yawCur:d.yaw||0, yawTgt:d.yaw||0, stride:0, swing:0};
    p.spr.position.set(d.x,(p.blk||p.walk)?0:py,d.z);
    if(p.blk||p.walk) p.spr.rotation.y=p.yawCur;
    scene.add(p.spr);
    showBanner(`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> อยู่ในโลกนี้ด้วย!`);
    tinvCheck(uid);
    Voice.onPeer(uid);
  }else if((p.blk||p.walk) && d.av!==p.av){
    // เพื่อนออก-เข้าใหม่ด้วยตัวบล็อกอื่น (child_changed) → สร้างตัวใหม่ตามที่เลือก
    scene.remove(p.spr); disposeBlockPeer(p.spr);
    p.av=d.av; p.spr=p.blk?makeBlockPeer(d.n,d.av,uid):makeBlockWalkPeer(d.n,d.av,uid);
    p.spr.position.set(p.cur.x,0,p.cur.z); p.spr.rotation.y=p.yawCur;
    scene.add(p.spr);
  }else if(M.heli && d.av!==p.av){
    // 🚁 รอบ 355: เพื่อนเปลี่ยนเฟส (เดิน→นั่ง→วิงสูท→ขับ) → วาด sprite ใหม่ให้ตรงอิริยาบถ
    scene.remove(p.spr); p.spr.material.dispose();
    p.av=d.av; p.spr=makePeerSprite(d.n,d.av);
    p.spr.position.set(p.cur.x,p.cur.y,p.cur.z);
    scene.add(p.spr);
  }
  p.tgt={x:d.x,z:d.z,y:py};
  if(typeof d.yaw==='number') p.yawTgt=d.yaw;
  // 🔴 รอบ 141: ตรวจ "เบรคจริง" จากอัตราชะลอระหว่างแพ็กเก็ต (~180ms/แพ็กเก็ต) — ไม่มี field ใหม่ ไม่ต้องแก้ rules
  // เกณฑ์ dec > drag(0.16×v)+4 → CAR_BRAKE 15 ทะลุสบาย ถอนคันเร่ง coast ไม่ติด · ต้องเข้าเกณฑ์ 2 แพ็กเก็ตติด
  // (ตำแหน่งปัด 0.1m → noise ความเร็ว ±0.55 m/s ระดับแพ็กเก็ตเดียว) · tickPeers เป็นคนนับถอยหลัง p.brkT+โชว์ไฟ
  if(p.blk){
    const tn=(typeof d.ts==='number')?d.ts:performance.now();   // ts จากเซิร์ฟเวอร์ = ระยะห่างแพ็กเก็ตแม่นกว่าเวลาฝั่งรับ (ตัด jitter เน็ต)
    if(p.pkAt!==undefined){
      const pdt=(tn-p.pkAt)/1000;
      if(pdt>.05){
        const pv=Math.hypot(d.x-p.pkX,d.z-p.pkZ)/pdt;
        if(pv>80) p.pvH=[];                                       // teleport/respawn — ทิ้งประวัติ
        else{
          // ประวัติ 5 แพ็กเก็ต (~0.72 วิ) เทียบความเร็วเฉลี่ยครึ่งแรก vs ครึ่งหลัง — baseline ยาว noise (ปัด 0.1m + jitter ts) เหลือจิ๋ว
          // เบรคจริง 15: vA-vB ~5.4 · coast หนักสุด (ท็อปสปีด 45): ~2.4+noise — เกณฑ์ drop สเกลตามความเร็วแยกขาด
          (p.pvH=p.pvH||[]).push({t:tn/1000, x:d.x, z:d.z}); if(p.pvH.length>5) p.pvH.shift();
          if(p.pvH.length===5){
            const A=p.pvH[0], Mm=p.pvH[2], B=p.pvH[4];
            const tA=Mm.t-A.t, tB=B.t-Mm.t;
            if(tA>.15 && tA<1.2 && tB>.15 && tB<1.2){
              const vA=Math.hypot(Mm.x-A.x,Mm.z-A.z)/tA, vB=Math.hypot(B.x-Mm.x,B.z-Mm.z)/tB;
              const drop=vA-vB, dec=drop/((tA+tB)/2);
              const braking=(drop>3+.08*vA && dec>.16*vA+2.5)         // เบรคแรงตอนวิ่ง (margin สเกลตาม v กัน coast ท็อปสปีด+noise)
                          ||(vA>1.2 && vB<.3 && dec>2);               // หยุดสนิทเร็วผิดธรรมชาติ = เหยียบเบรคจนจอด
              if(braking) p.brkT=Math.max(p.brkT||0,.45);
            }
          }
        }
        p.pkAt=tn; p.pkX=d.x; p.pkZ=d.z;
      }
    }else{ p.pkAt=tn; p.pkX=d.x; p.pkZ=d.z; }
  }
  // 🏆 กระดานคะแนน: จำนวนคำที่เพื่อนประกอบได้รอบนี้ (field w) — เปลี่ยนเมื่อไหร่วาดใหม่
  const w=typeof d.w==='number'?d.w:0;
  if(p.w!==w){ p.w=w; renderBoard(); }
  p.cw=(typeof d.cw==='string')?d.cw:null;             // 🤝 คำเป้าหมายของเพื่อน (ใช้ตอนเราเป็นลูกทีมตามหัวหน้า)
  p.tl=(d.tl===1||d.tl===2)?d.tl:0;                    // 🚦 ไฟเลี้ยวของเพื่อน (รอบ 132 — tickPeers สั่งกะพริบ)
  // ไอคอน 🎤 เหนือหัวคนที่เปิดไมค์ (เด็กเห็นชัดว่าเดินเข้าใกล้ใครแล้วคุยได้)
  if(d.m===1 && !p.micSpr){
    p.micSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture('🎤'),transparent:true}));
    p.micSpr.scale.set(.7,.7,1);
    p.micSpr.position.set(p.cur.x,2.72,p.cur.z);
    scene.add(p.micSpr);
  }else if(d.m!==1 && p.micSpr){
    scene.remove(p.micSpr); p.micSpr.material.dispose(); p.micSpr=null;   // texture 🎤 อยู่ใน cache ห้าม dispose map
  }
  // แชทลอยหัว: ct เปลี่ยน = ข้อความใหม่ (ct คงที่ต่อข้อความ ฝั่งส่งแนบซ้ำได้ไม่เด้งซ้ำ)
  if(typeof d.ct==='number' && typeof d.c==='string' && d.c && p.lastCt!==d.ct){
    p.lastCt=d.ct;
    showPeerBubble(p, d.c);
  }
}
function removePeer(uid){
  const p=peers[uid];
  if(!p) return;
  removePeerBubble(p);
  if(p.micSpr){ scene.remove(p.micSpr); p.micSpr.material.dispose(); p.micSpr=null; }
  Voice.drop(uid);
  scene.remove(p.spr);
  if(p.blk||p.walk) disposeBlockPeer(p.spr);                      // 🧱 geometry/material แชร์ — dispose เฉพาะป้ายชื่อ
  else{ p.spr.material.map.dispose(); p.spr.material.dispose(); }
  delete peers[uid];
  renderBoard();
}
function netLeave(){
  podiumLeave();
  Voice.leave();
  if(worldRef){ worldRef.off('child_added'); worldRef.off('child_changed'); worldRef.off('child_removed'); }
  if(myRef){ myRef.remove().catch(()=>{}); }
  Object.keys(peers).forEach(removePeer);
  worldRef=null; myRef=null;
}
function tickPeers(dt,now){
  Object.keys(peers).forEach(uid=>{
    const p=peers[uid];
    const k=Math.min(1,dt*6);                     // lerp นุ่มๆ ระหว่างแพ็กเก็ต
    p.cur.x+=(p.tgt.x-p.cur.x)*k;
    p.cur.z+=(p.tgt.z-p.cur.z)*k;
    p.cur.y+=((p.tgt.y||1.5)-(p.cur.y||1.5))*k;
    const baseY=(M.heli||M.drone)?(p.cur.y||1.5):1.5;   // เฮลิฯ/โดรน: เพื่อนบินตามความสูงจริง
    if(p.blk){
      // 🧱 รถบล็อกวิ่งบนพื้น หมุนหัวรถตาม yaw (lerp ทางสั้น กันสะบัดตอนข้าม ±π) + ล้อหมุนตามระยะจริง
      const moved=Math.hypot(p.tgt.x-p.cur.x,p.tgt.z-p.cur.z)*k;
      p.spr.position.set(p.cur.x,0,p.cur.z);
      let dy=p.yawTgt-p.yawCur; dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
      p.yawCur+=dy*k; p.spr.rotation.y=p.yawCur;
      // 🏎️ รอบ 142: ตัวถังรถเพื่อนโคลงออกนอกโค้งตามแรง G เหมือนรถเรา (order YZX = roll รอบแกนตัวรถหลัง yaw)
      if(p.spr.rotation.order!=='YZX') p.spr.rotation.order='YZX';
      const pLatA=-(dy*k/Math.max(dt,.001))*(moved/Math.max(dt,.001));   // ลบเพราะ yaw เกมลดลงตอนเลี้ยวขวา (convention เดียวกับ latA รถเรา)
      const pRollTgt=Math.max(-.1,Math.min(.1, pLatA*.008));
      p.roll=(p.roll||0)+(pRollTgt-(p.roll||0))*Math.min(1,dt*6);
      p.spr.rotation.z=p.roll;
      (p.spr.userData.wheels||[]).forEach(w=>{ w.rotation.x-=moved/.5; });
      // 🚦 รอบ 132: ไฟเลี้ยวเพื่อนกะพริบตาม field tl (จังหวะ 400ms เหมือนไฟเลี้ยวจริง)
      const ph=Math.floor(now/400)%2===0;
      (p.spr.userData.blinkL||[]).forEach(m=>{ m.visible=p.tl===1&&ph; });
      (p.spr.userData.blinkR||[]).forEach(m=>{ m.visible=p.tl===2&&ph; });
      // ⬜ รอบ 140: ไฟถอยหลังขาว — วิ่งสวนทิศหัวรถ (dot<-.5) ค้าง ~0.25 วิถึงติด (hysteresis กันวูบตอนเด้งชน/แพ็กเก็ตกระตุก)
      const rvx=p.tgt.x-p.cur.x, rvz=p.tgt.z-p.cur.z, rvm=Math.hypot(rvx,rvz);
      const backing=rvm>.12 && (rvx*-Math.sin(p.yawCur)+rvz*-Math.cos(p.yawCur))/rvm<-.5;
      p.revT=backing?Math.min(.6,(p.revT||0)+dt):Math.max(0,(p.revT||0)-dt*2);
      (p.spr.userData.revs||[]).forEach(m=>{ m.visible=p.revT>.25; });
      // 🔴 รอบ 141: ไฟเบรคแดง — ตรวจจับใน onPeerData (วัดจากแพ็กเก็ตตรงๆ สะอาดกว่า lerp รายเฟรม) · ที่นี่แค่นับถอยหลัง+โชว์
      p.brkT=Math.max(0,(p.brkT||0)-dt);
      (p.spr.userData.brks||[]).forEach(m=>{ m.visible=p.brkT>0; });
    }else if(p.walk){
      // 🧱 หุ่นบล็อกเดิน: หันตาม yaw (lerp ทางสั้น) + แกว่งแขน-ขาตามระยะที่เดินจริง · หยุด=ลู่คืนท่ายืน
      const moved=Math.hypot(p.tgt.x-p.cur.x,p.tgt.z-p.cur.z)*k;
      p.stride=(p.stride||0)+moved;
      const speedN=Math.min(1,(moved/Math.max(dt,.001))/3);        // 0..1 ตามความเร็วจริง (เต็มที่ ~3 m/s)
      p.swing=(p.swing||0)+(speedN-(p.swing||0))*Math.min(1,dt*8);
      const a=Math.sin(p.stride*3.4)*.6*p.swing;
      const L=p.spr.userData.limbs||[];
      if(L.length===4){ L[0].rotation.x=a; L[1].rotation.x=-a; L[2].rotation.x=-a*.8; L[3].rotation.x=a*.8; }
      p.spr.position.set(p.cur.x,Math.abs(Math.sin(p.stride*3.4))*.045*p.swing,p.cur.z);   // เด้งก้าวเล็กๆ
      let dy=p.yawTgt-p.yawCur; dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
      p.yawCur+=dy*k; p.spr.rotation.y=p.yawCur;
    }else{
      p.spr.position.set(p.cur.x,baseY+Math.sin(now/280+p.cur.x)*.05,p.cur.z);
    }
    if(p.bubble){
      if(now>p.bubble.until) removePeerBubble(p);
      else p.bubble.spr.position.set(p.cur.x,p.blk?3.65:p.walk?2.8:baseY+1.6,p.cur.z);   // ลอยตามหัว (ตัวบล็อก: พ้นป้ายชื่อ)
    }
    if(p.micSpr) p.micSpr.position.set(p.cur.x,(p.blk?3.35:p.walk?2.55:baseY+1.22)+Math.sin(now/300)*.06,p.cur.z);
    // เสียงพูดเบาลงตามระยะห่างในโลก (สไตล์ Roblox) — ไกลเกิน ~45m = เงียบ
    const en=Voice.pcs[uid];
    if(en && en.audio && !en.audio.muted){
      const d=Math.hypot(p.cur.x-camera.position.x,p.cur.z-camera.position.z);
      en.audio.volume=Math.max(0,Math.min(1,1.15-d/45));
    }
  });
  syncPartyWord();                                // 🤝 ลูกทีมตามคำของหัวหน้าปาร์ตี้ (เห็นคำเดียวกัน)
}

/* ============================================================
   Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
   Firebase ใช้แค่ signaling: /rtc/<map>/<toUid>/<msgId>={f,t,d,ts}
   (ผู้รับอ่าน+ลบกล่องตัวเอง · ผู้ส่ง push ได้เฉพาะ f=ตัวเอง)
   🎤 ไมค์ปิดเป็นค่าเริ่มต้นทุกครั้งที่เข้า (ความปลอดภัยเด็ก — ไม่จำข้ามรอบ)
   🔊 ลำโพง + โหมด (all=ทุกคนใน map / friends=เฉพาะเพื่อนที่ invite กันใน map นี้)
   จำใน state.voiceSpk/voiceMode · เสียงเบาลงตามระยะห่างในโลก (สไตล์ Roblox)
   ============================================================ */
const RTC_CFG={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}]};
function tinvLinked(uid){
  const sent=state.tinvSent && state.tinvSent[uid];
  const got=(typeof Online!=='undefined' && Online.tinv)?Online.tinv[uid]:null;
  return (sent && sent.map===mode) || (got && got.map===mode);
}
/* 🤝 คำเป้าหมายร่วมของปาร์ตี้ที่ invite กัน — หัวหน้า = key น้อยสุดในกลุ่ม (ทุกเครื่องคำนวณตรงกัน)
   เราเป็นหัวหน้า/เล่นคนเดียว → คืน null (ใช้คำตัวเอง) · เป็นลูกทีม → คืนคำของหัวหน้า {e,t} */
function partyWord(){
  const linked=Object.keys(peers).filter(uid=>tinvLinked(uid));
  if(!linked.length) return null;
  const me=(typeof onlineKey==='function')?onlineKey():null;
  if(!me) return null;
  const leader=[me,...linked].sort()[0];
  if(leader===me) return null;                        // เราเป็นหัวหน้า → คนอื่นตามคำเรา
  const cw=peers[leader] && peers[leader].cw;
  if(!cw) return null;
  const i=cw.indexOf('|');
  return i>0 ? {e:cw.slice(0,i), t:cw.slice(i+1)} : null;
}
/* ลูกทีมดันคำของหัวหน้าขึ้นเป็นคำเป้าหมาย (words[0]) → เห็นคำเดียวกัน ช่วยกันเก็บตัวอักษรได้ */
function syncPartyWord(){
  const pw=partyWord();
  if(!pw || !pw.e) return;                            // ไม่ใช่ลูกทีม / หัวหน้ายังไม่ส่งคำ
  if(pw.e===lastSharedDone) return;                   // คำนี้เราทำเสร็จก่อนแล้ว → เล่นคำตัวเองไปก่อน รอหัวหน้าเปลี่ยนคำ
  if(words[0] && words[0].en===pw.e) return;          // ตรงกับหัวหน้าอยู่แล้ว
  const idx=words.findIndex(w=>w.en===pw.e);
  if(idx>=0){ const [w]=words.splice(idx,1); words.unshift(w); }   // มีอยู่แล้ว → ดันขึ้นหน้าสุด
  else words.unshift({en:pw.e, th:pw.t});             // ยังไม่มี → เพิ่มคำหัวหน้า
  lastSharedDone=null;
  ensureCoverage();                                   // สร้างตัวอักษรของคำนี้ในโลกให้เก็บได้
  renderHudInv(); renderHudWords();
}
const Voice={
  mic:false, spk:true, vmode:'all',
  stream:null, pcs:{}, inRef:null,
  roomMuted:false, classRef:null, _prevRoom:null,   // 👩‍🏫 ครูปิดเสียงทั้งห้อง (/class/<map>/muteAll)
  allowed(uid){ return this.vmode==='all' || tinvLinked(uid); },
  join(){
    if(!netReady()) return;
    this.spk=state.voiceSpk!==false;
    this.vmode=state.voiceMode==='friends'?'friends':'all';
    this.mic=false;                                        // ปิดไมค์เสมอตอนเข้า
    this.inRef=Online.db.ref('rtc/'+mode+'/'+onlineKey());
    this.inRef.remove().catch(()=>{});                     // ล้างข้อความค้างจากรอบก่อน
    this.inRef.on('child_added',(s)=>{ const m=s.val(); s.ref.remove().catch(()=>{}); if(m) this.handle(m); });
    // 👩‍🏫 ฟังสถานะ "ครูปิดเสียงทั้งห้อง" ของ map นี้ (สถานะค้างอยู่ใน DB — เด็กเข้าทีหลังก็โดนล็อกด้วย)
    this._prevRoom=null;
    this.classRef=Online.db.ref('class/'+mode+'/muteAll');
    this.classRef.on('value',(s)=>{
      const v=s.val();
      const on=!!(v && v.on);
      this.roomMuted=on;
      const teacher=(typeof isTeacher==='function' && isTeacher());
      if(on && !teacher && this.mic) this.setMic(false);   // ตัดไมค์เด็กที่เปิดค้างทันที
      if(this._prevRoom!==null || on){                     // เข้ามาเจอห้องปิดอยู่ก็แจ้ง / สถานะเปลี่ยนก็แจ้ง
        if(this._prevRoom!==on){
          showBanner(on?'👩‍🏫 <b>คุณครูปิดเสียงทั้งห้อง</b><br><small>ไมค์ทุกคนถูกปิดชั่วคราว</small>'
                       :'👩‍🏫 <b>คุณครูเปิดเสียงห้องแล้ว</b><br><small>เปิดไมค์คุยกันได้เลย</small>');
        }
      }
      this._prevRoom=on;
      updateVoiceBtns();
    });
    updateVoiceBtns();
  },
  leave(){
    if(this.classRef){ this.classRef.off(); this.classRef=null; }
    this.roomMuted=false; this._prevRoom=null;
    if(this.inRef){ this.inRef.off(); this.inRef.remove().catch(()=>{}); this.inRef=null; }
    Object.keys(this.pcs).forEach(uid=>this.drop(uid));
    if(this.stream){ this.stream.getTracks().forEach(tr=>tr.stop()); this.stream=null; }  // คืนไมค์ให้เครื่อง
    this.mic=false;
  },
  sig(uid,t,d){
    if(!netReady()) return;
    Online.db.ref('rtc/'+mode+'/'+uid).push({
      f:onlineKey(), t, d:JSON.stringify(d), ts:firebase.database.ServerValue.TIMESTAMP,
    }).catch(()=>{});
  },
  ensure(uid){
    if(this.pcs[uid]) return this.pcs[uid];
    const pc=new RTCPeerConnection(RTC_CFG);
    const en=this.pcs[uid]={pc, audio:null, sender:null, iceQ:[], haveRemote:false};
    const tr=pc.addTransceiver('audio',{direction:'sendrecv'});   // ช่องเสียงมีเสมอ — สลับ track ทีหลัง ไม่ต้อง renegotiate
    en.sender=tr.sender;
    if(this.mic && this.stream) tr.sender.replaceTrack(this.stream.getAudioTracks()[0]).catch(()=>{});
    pc.onicecandidate=e=>{ if(e.candidate) this.sig(uid,'ice',e.candidate.toJSON()); };
    pc.ontrack=e=>{
      if(!en.audio){ en.audio=document.createElement('audio'); en.audio.autoplay=true; document.body.appendChild(en.audio); }
      en.audio.srcObject=e.streams[0];
      en.audio.muted=!this.spk;
    };
    return en;
  },
  drop(uid){
    const en=this.pcs[uid];
    if(!en) return;
    try{ en.pc.close(); }catch(e){}
    if(en.audio){ en.audio.srcObject=null; en.audio.remove(); }
    delete this.pcs[uid];
  },
  onPeer(uid){                                             // เพื่อนโผล่ใน map → ฝั่ง uid น้อยกว่าเป็นคนชวนต่อสาย (กันชนกัน)
    if(!this.inRef || !this.allowed(uid) || this.pcs[uid]) return;
    if(onlineKey()<uid) this.call(uid);
  },
  async call(uid){
    const en=this.ensure(uid);
    try{
      const of=await en.pc.createOffer();
      await en.pc.setLocalDescription(of);
      this.sig(uid,'offer',en.pc.localDescription.toJSON());
    }catch(e){}
  },
  async handle(m){
    const uid=m.f;
    let d; try{ d=JSON.parse(m.d); }catch(e){ return; }
    if(m.t==='offer'){
      if(!this.allowed(uid)) return;                       // โหมดเพื่อน: ไม่รับสายคนนอก
      const en=this.ensure(uid);
      try{
        await en.pc.setRemoteDescription(d); en.haveRemote=true;
        en.iceQ.splice(0).forEach(c=>en.pc.addIceCandidate(c).catch(()=>{}));
        const an=await en.pc.createAnswer();
        await en.pc.setLocalDescription(an);
        this.sig(uid,'answer',en.pc.localDescription.toJSON());
      }catch(e){}
    }else if(m.t==='answer'){
      const en=this.pcs[uid]; if(!en) return;
      try{ await en.pc.setRemoteDescription(d); en.haveRemote=true;
           en.iceQ.splice(0).forEach(c=>en.pc.addIceCandidate(c).catch(()=>{})); }catch(e){}
    }else if(m.t==='ice'){
      const en=this.pcs[uid]; if(!en) return;
      if(en.haveRemote) en.pc.addIceCandidate(d).catch(()=>{});
      else en.iceQ.push(d);
    }
  },
  async setMic(on){
    if(on && this.roomMuted && !(typeof isTeacher==='function' && isTeacher())){
      sfx.wrong(); toast('👩‍🏫 คุณครูปิดเสียงห้องอยู่ — เปิดไมค์ไม่ได้ตอนนี้นะ'); return;
    }
    if(on && !this.stream){
      try{ this.stream=await navigator.mediaDevices.getUserMedia({audio:true}); }
      catch(e){ sfx.wrong(); toast('🎤 เปิดไมค์ไม่สำเร็จ — ต้องกด "อนุญาต" ไมโครโฟนในเบราว์เซอร์นะ'); updateVoiceBtns(); return; }
    }
    this.mic=on;
    const track=on&&this.stream?this.stream.getAudioTracks()[0]:null;
    Object.values(this.pcs).forEach(en=>{ if(en.sender) en.sender.replaceTrack(track).catch(()=>{}); });
    if(myRef) sendPos(true);                               // ประกาศสถานะไมค์ (ไอคอน 🎤 เหนือหัว) ทันที
    showBanner(on?'🎤 <b>เปิดไมค์แล้ว</b><br><small>เพื่อนใน map ได้ยินเสียงหนู</small>'
                 :'🎤 <b>ปิดไมค์แล้ว</b><br><small>ไม่มีใครได้ยินเสียงหนู</small>');
    updateVoiceBtns();
  },
  /* 👩‍🏫 ครูสลับปิด/เปิดเสียงทั้งห้อง (เฉพาะบัญชีใน TEACHER_EMAILS — auth.js) */
  toggleRoomMute(){
    if(!this.classRef){ sfx.wrong(); toast('⚠️ ยังไม่ได้เชื่อมต่อออนไลน์ — สั่งปิดเสียงห้องไม่ได้'); return; }
    const on=!this.roomMuted;
    this.classRef.set({on, by:onlineDisplayName(), ts:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{});
  },
  setSpk(on){
    this.spk=on; state.voiceSpk=on; saveState();
    Object.values(this.pcs).forEach(en=>{ if(en.audio) en.audio.muted=!on; });
    updateVoiceBtns();
  },
  setMode(m){
    this.vmode=m; state.voiceMode=m; saveState();
    Object.keys(this.pcs).forEach(uid=>{ if(!this.allowed(uid)) this.drop(uid); });   // ตัดสายคนนอกทันที
    Object.keys(peers).forEach(uid=>this.onPeer(uid));                                // ต่อสายที่ขาด (ฝั่งเราเป็นผู้ชวน)
    showBanner(m==='friends'?'👥 <b>คุยเฉพาะเพื่อนที่ชวนกัน</b><br><small>ได้ยิน/พูดเฉพาะเพื่อนที่ invite กันใน map นี้</small>'
                            :'🌐 <b>คุยกับทุกคนใน map</b>');
    updateVoiceBtns();
  },
};
function updateVoiceBtns(){
  const mic=document.getElementById('adv-mic'), spk=document.getElementById('adv-spk'),
        vm=document.getElementById('adv-vmode'), tm=document.getElementById('adv-tmute');
  if(!mic) return;
  const teacher=(typeof isTeacher==='function' && isTeacher());
  const locked=Voice.roomMuted && !teacher;
  mic.textContent=locked?'🎤 ครูปิด':(Voice.mic?'🎤 เปิด':'🎤 ปิด');
  mic.classList.toggle('v-off',!Voice.mic);
  mic.classList.toggle('v-lock',locked);
  spk.textContent=Voice.spk?'🔊 เปิด':'🔇 ปิด';
  spk.classList.toggle('v-off',!Voice.spk);
  vm.textContent=Voice.vmode==='friends'?'👥 เพื่อน':'🌐 ทุกคน';
  tm.style.display=teacher?'block':'none';
  tm.textContent=Voice.roomMuted?'👩‍🏫 เปิดเสียงห้อง':'👩‍🏫 ปิดเสียงห้อง';
  tm.classList.toggle('v-muting',Voice.roomMuted);
  const pb=document.getElementById('adv-podbtn');
  if(pb) pb.style.display=teacher?'block':'none';
}

/* ============================================================
   🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
   ครู snapshot อันดับ top 3 เขียนขึ้น DB → ทุกเครื่องเห็นโพเดียม 🥇🥈🥉
   + แตรฉลอง · คนติดโพเดียมรับโบนัส (เช็ก uid ตัวเอง) · จบพิธีคะแนน
   รีเซ็ตเริ่มรอบใหม่ · ครูลบ node ใน 15 วิ + กันเล่นซ้ำด้วย id ในหน่วยความจำ
   ============================================================ */
const PODIUM_BONUS=[100,50,25];       // โบนัสที่ 1/2/3
let podiumRef=null, lastPodiumId=0;
function podiumJoin(){
  if(!netReady()) return;
  podiumRef=Online.db.ref('class/'+mode+'/podium');
  podiumRef.on('value',(s)=>{
    const v=s.val();
    if(!v || typeof v.id!=='number' || v.id===lastPodiumId) return;
    if(Math.abs(Date.now()-v.id)>5*60*1000) return;   // พิธีเก่าค้าง DB — ไม่เล่นซ้ำ
    lastPodiumId=v.id;
    showPodium(v);
  });
}
function podiumLeave(){ if(podiumRef){ podiumRef.off(); podiumRef=null; } }
function endRound(){
  if(!(typeof isTeacher==='function' && isTeacher())) return;
  if(!podiumRef){ sfx.wrong(); toast('⚠️ ยังไม่ได้เชื่อมต่อออนไลน์ — จบรอบแข่งไม่ได้'); return; }
  const rows=[{u:onlineKey(), n:onlineDisplayName(), w:sessionWords}];
  Object.keys(peers).forEach(uid=>rows.push({u:uid, n:peers[uid].n||'เพื่อน', w:peers[uid].w||0}));
  rows.sort((a,b)=>b.w-a.w);
  const ref=podiumRef;
  ref.set({id:Date.now(), by:onlineDisplayName(),
           ts:firebase.database.ServerValue.TIMESTAMP, top:rows.slice(0,3)}).catch(()=>{});
  setTimeout(()=>{ ref.remove().catch(()=>{}); },15000);
}
function showPodium(v){
  const top=Array.isArray(v.top)?v.top:Object.values(v.top||{});
  const me=(typeof onlineKey==='function' && typeof Auth!=='undefined' && Auth.user)?onlineKey():'';
  let myBonus=0;
  top.forEach((r,i)=>{ if(r && me && r.u===me) myBonus=PODIUM_BONUS[i]||0; });
  if(myBonus){ addCoins(myBonus); saveState(); sessionCoins+=myBonus; }
  sessionWords=0; sessionWordLog=[];                 // เริ่มรอบแข่งใหม่ทุกคน
  if(myRef) sendPos(true);
  renderBoard(); renderHudTop();
  const wasRunning=running;
  running=false;                                     // พักเกมระหว่างพิธี (ผีไม่แอบจับ)
  const medal=['🥇','🥈','🥉'], hgt=[104,74,56], ord=[1,0,2];   // วางเรียง 2-1-3
  const cols=ord.filter(i=>top[i]).map(i=>{
    const r=top[i];
    return `<div class="adv-pd-col">
      <div class="adv-pd-name">${medal[i]} ${escapeHTML(r.n||'?')}<br><small>${r.w||0} คำ</small></div>
      <div class="adv-pd-stand s${i}" style="height:${hgt[i]}px">${i+1}</div>
    </div>`;
  }).join('');
  const pd=document.getElementById('adv-podium');
  pd.innerHTML=`<div class="adv-pd-box">
    <div class="adv-pd-title">🏁 จบรอบแข่ง! ผลจาก ${escapeHTML(v.by||'คุณครู')}</div>
    <div class="adv-pd-row">${cols||'<small style="color:#fff">รอบนี้ยังไม่มีคะแนน — รอบใหม่เริ่มแล้ว!</small>'}</div>
    <div class="adv-pd-me">${myBonus?`🎁 หนูได้โบนัสโพเดียม +${myBonus} 🪙!`:'รอบใหม่เริ่มแล้ว เก็บคำเลย! 🔤'}</div>
    <small class="adv-pd-hint">แตะเพื่อปิด</small>
  </div>`;
  pd.classList.add('on');
  sfx.rankup();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([80,60,80]);
  const close=()=>{
    pd.classList.remove('on'); pd.removeEventListener('click',close); clearTimeout(tm);
    if(wasRunning && overlayEl.classList.contains('on') && hp>0 && !banEl.classList.contains('stay')){
      running=true; clock.getDelta(); loop();
    }
  };
  const tm=setTimeout(close,8000);
  pd.addEventListener('click',close);
}

/* ---------- ส่วนลดชวนเพื่อน: เจอกันใน map จริง → เงินคืน (ครั้งเดียว/map) ---------- */
function tinvCheck(uid){
  if(state.tinvClaimed[mode]) return;
  const sentRec=state.tinvSent && state.tinvSent[uid];
  const inRec=(typeof Online!=='undefined' && Online.tinv) ? Online.tinv[uid] : null;
  const match=(sentRec && sentRec.map===mode) || (inRec && inRec.map===mode);
  if(!match) return;
  state.tinvClaimed[mode]=true;
  addCoins(TINV_CASHBACK);
  sessionCoins+=TINV_CASHBACK;
  sfx.rankup();
  saveState(); renderHudTop();
  const nm=peers[uid]?peers[uid].n:'เพื่อน';
  showBanner(`🎊 เล่นพร้อมกับ <b>${escapeHTML(nm)}</b> ตามคำชวน!<br><span class="adv-ban-coin">รับเงินคืน +${fmtNum(TINV_CASHBACK)} 🪙</span>`);
  if(inRec && typeof tinvClear==='function') tinvClear(uid);   // เคลียร์คำเชิญฝั่งเรา (ฝั่งเพื่อนรับของเขาเอง)
}

/* ============================================================
   HUD
   ============================================================ */
let lastBanAt=0;                  // เวลา banner ล่าสุด (ATC เว้นจังหวะไม่พูดทับ)
function showBanner(html){
  if(banEl.classList.contains('stay')) return;
  lastBanAt=performance.now();
  banEl.innerHTML=html;
  banEl.classList.remove('show'); void banEl.offsetWidth; banEl.classList.add('show');
}
function renderHudTop(){
  hudHpEl.style.width=(maxHp?Math.max(0,Math.min(100,hp/maxHp*100)):hp)+'%';   // 🤖 รอบ 236: อิง maxHp ต่อโลก
  hudHpEl.className='adv-hp-fill'+(hp<=maxHp*0.3?' low':'');
  hudCoinEl.textContent=`🪙 +${fmtNum(sessionCoins)} · 📖 ${sessionWords} คำ`;
}
function renderHudWords(){   // โชว์คำเป้าหมายปัจจุบัน (words[0]) เป็นคำใหญ่ทีละคำ · ตัวอักษรที่เก็บแล้วไฮไลต์เขียว
  const w=words[0];
  if(!w){ hudWordsEl.innerHTML=''; return; }
  const have=Object.assign({},inv);
  const chips=w.en.split('').map(ch=>{
    const ok=(have[ch]||0)>0; if(ok) have[ch]--;
    return `<span class="adv-fch${ok?' got':''}">${ch.toUpperCase()}</span>`;
  }).join('');
  hudWordsEl.innerHTML=`<div class="adv-fword">${chips}</div><div class="adv-fth">${escapeHTML(w.th)}</div>`;
}
function renderHudInv(){
  const ks=Object.keys(inv).sort();
  hudInvEl.innerHTML=ks.length
    ? ks.map(ch=>`<span class="adv-inv-ch">${ch.toUpperCase()}${inv[ch]>1?'×'+inv[ch]:''}</span>`).join('')
    : '<span class="adv-inv-empty">เดินชนตัวอักษรเพื่อเก็บ ✨</span>';
}
/* ระดับเข็มนักผาดโผนจาก "ชื่อที่ sync มาแล้ว" (เข็มติดท้ายชื่อ) — ไม่ต้องเพิ่ม field/rules ใหม่ */
function ddTierFromName(n){ n=n||''; if(n.indexOf('🔥')>=0) return 3; if(n.indexOf('🌀')>=0) return 2; if(n.indexOf('🎯')>=0) return 1; return 0; }
/* 🏆 กระดานคะแนนสด: ใครประกอบคำได้เยอะสุดรอบนี้ + ท็อปนักผาดโผนในสนาม (me + เพื่อนใน map) */
function renderBoard(){
  if(!hudBoardEl) return;
  const rows=[{n:(state.profileName||'หนู')+pilotEmoji(state.pilotBadge)+thunderEmoji(state.thunderBadge)+daredevilEmoji(state.daredevilBadge)+glassEmoji(state.glassBadge)+diligentEmoji(state.diligentBadge)+mechaBossEmoji(state.mechaBossBadge)+softLandEmoji(state.perfLandBadge)+airLetterEmoji(state.airLetterBadge), w:sessionWords, me:true}];
  Object.keys(peers).forEach(uid=>rows.push({n:peers[uid].n||'เพื่อน', w:peers[uid].w||0}));
  rows.sort((a,b)=>b.w-a.w);
  const meIdx=rows.findIndex(r=>r.me);
  const row=(r,i)=>`<div class="adv-b-row${r.me?' me':''}">
    <span class="adv-b-nm">${i===0&&r.w>0?'👑':(i+1)+'.'} ${escapeHTML(r.n)}</span><b>${r.w}</b></div>`;
  let html=rows.slice(0,4).map(row).join('');
  if(meIdx>=4) html+=`<div class="adv-b-more">⋯</div>`+row(rows[meIdx],meIdx);   // เราหลุด top 4 → โชว์แถวตัวเองต่อท้าย
  // 🎯 ท็อปนักผาดโผนในสนาม (เฉพาะโลกบิน heli/drone · จัดอันดับตามระดับเข็มในชื่อที่ sync แล้ว)
  if(M.heli||M.drone){
    const ace=rows.map(r=>({n:r.n, me:r.me, tier:ddTierFromName(r.n)})).filter(r=>r.tier>0).sort((a,b)=>b.tier-a.tier);
    if(ace.length){
      const aceHtml=ace.slice(0,3).map((r,i)=>
        `<div class="adv-b-row${r.me?' me':''}"><span class="adv-b-nm">${['🥇','🥈','🥉'][i]||'•'} ${escapeHTML(r.n)}</span></div>`).join('');
      html+=`<div class="adv-b-title" style="margin-top:6px">🎯 ท็อปนักผาดโผน</div>`+aceHtml;
    }
  }
  hudBoardEl.innerHTML=`<div class="adv-b-title">🏆 ประกอบคำรอบนี้</div>`+html;
}
/* 🗺️ รอบ 144: แผนที่ขยายเกือบเต็มจอ (แตะ minimap เปิด) — north-up ครอบตัวอักษรทุกตัว+ผู้เล่น
   โลกขับรถวาดถนน/แม่น้ำจาก driveCell · ตัวอักษรที่ต้องเก็บของคำปัจจุบัน = เหลืองใหญ่ ตัวอื่นเทาเล็ก */
let bigMapTimer=0;
function drawBigMap(){
  const cv=overlayEl && overlayEl.querySelector('#adv-bigmap-cv');
  if(!cv) return;
  const w=cv.clientWidth, h=cv.clientHeight;
  if(!w || !h) return;
  const dpr=Math.min(2,window.devicePixelRatio||1);
  if(cv.width!==Math.round(w*dpr)){ cv.width=Math.round(w*dpr); cv.height=Math.round(h*dpr); }
  const c=cv.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  c.fillStyle='#0a1626'; c.fillRect(0,0,w,h);
  // ขอบเขต: ตัวอักษรทุกตัว + ผู้เล่น + ขอบ 8%
  const px=camera.position.x, pz=camera.position.z;
  let minX=px,maxX=px,minZ=pz,maxZ=pz;
  letters.forEach(l=>{ const q=l.spr.position;
    if(q.x<minX)minX=q.x; if(q.x>maxX)maxX=q.x; if(q.z<minZ)minZ=q.z; if(q.z>maxZ)maxZ=q.z; });
  const pad=Math.max(maxX-minX,maxZ-minZ)*.08+25;
  minX-=pad; maxX+=pad; minZ-=pad; maxZ+=pad;
  const sc=Math.min(w/(maxX-minX), h/(maxZ-minZ));
  const ox=(w-(maxX-minX)*sc)/2, oz=(h-(maxZ-minZ)*sc)/2;
  const X=x=>ox+(x-minX)*sc, Z=z=>oz+(z-minZ)*sc;
  // พื้นหลังถนนจริง (เฉพาะโลกขับรถ — sample driveCell ทีละ 4px)
  if(M.drive){
    const st=4;
    for(let sy=0;sy<h;sy+=st){
      const wz=minZ+(sy-oz)/sc;
      for(let sx=0;sx<w;sx+=st){
        const cell=driveCell(minX+(sx-ox)/sc, wz);
        if(cell===1){ c.fillStyle='rgba(150,170,195,.5)'; c.fillRect(sx,sy,st,st); }
        else if(cell===2){ c.fillStyle='rgba(45,95,170,.45)'; c.fillRect(sx,sy,st,st); }
      }
    }
  }
  // ตัวอักษรที่ยังต้องเก็บของคำปัจจุบัน (logic เดียวกับ minimap)
  const need={};
  if(words[0]) words[0].en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
  for(const ch in need) need[ch]=Math.max(0,need[ch]-(inv[ch]||0));
  c.textAlign='center'; c.textBaseline='middle';
  letters.forEach(l=>{
    const x=X(l.spr.position.x), y=Z(l.spr.position.z), hot=need[l.ch]>0;
    c.beginPath(); c.arc(x,y,hot?13:8,0,Math.PI*2);
    c.fillStyle=hot?'#ffd54f':'rgba(255,255,255,.25)'; c.fill();
    if(hot){ c.lineWidth=2; c.strokeStyle='#fff'; c.stroke(); }
    c.fillStyle=hot?'#1c2330':'#dfe7f2';
    c.font=`bold ${hot?15:10}px system-ui,sans-serif`;
    c.fillText(l.ch.toUpperCase(),x,y+.5);
  });
  // ผู้เล่น: ลูกศรแดงชี้ตามทิศหัวรถ
  c.save(); c.translate(X(px),Z(pz)); c.rotate(Math.atan2(-Math.cos(yaw),-Math.sin(yaw)));
  c.beginPath(); c.moveTo(15,0); c.lineTo(-9,9); c.lineTo(-4,0); c.lineTo(-9,-9); c.closePath();
  c.fillStyle='#ff5252'; c.fill(); c.lineWidth=2.5; c.strokeStyle='#fff'; c.stroke();
  c.restore();
  // หัวข้อ: คำที่กำลังตามหา
  const tt=overlayEl.querySelector('#adv-bigmap-title');
  if(tt) tt.innerHTML='🗺️ แผนที่ตัวอักษร'+(words[0]?` — ตามหา: <b>${words[0].en.toUpperCase()}</b> (${escapeHTML(words[0].th)})`:'');
}
function openBigMap(){
  const el=overlayEl && overlayEl.querySelector('#adv-bigmap');
  if(!el) return;
  el.classList.add('on');
  drawBigMap();
  clearInterval(bigMapTimer);
  bigMapTimer=setInterval(drawBigMap,600);            // อัปเดตสด (ตัวอักษรโดนเก็บ/รถวิ่ง)
}
function closeBigMap(){
  const el=overlayEl && overlayEl.querySelector('#adv-bigmap');
  if(el) el.classList.remove('on');
  clearInterval(bigMapTimer); bigMapTimer=0;
}
function drawMinimap(){
  const S=mapCv.width, sc=M.drive? S/620 : S/(HALF*2+8);   // 🚗 เมืองจริงใหญ่ → ซูมเรดาร์ออก (~310m)
  mapCtx.clearRect(0,0,S,S);
  mapCtx.fillStyle=mode==='haunt'?'rgba(18,14,34,.78)':'rgba(20,40,20,.72)';
  mapCtx.beginPath(); mapCtx.arc(S/2,S/2,S/2,0,7); mapCtx.fill();
  if(M.drive && cityMapCv){
    // วาดแผนที่ถนนจริง (bitmap เมืองวาดครั้งเดียว) หมุนแบบ heading-up ใต้จุดต่างๆ
    const MPX=.25, k=sc/MPX;
    mapCtx.save();
    mapCtx.beginPath(); mapCtx.arc(S/2,S/2,S/2,0,7); mapCtx.clip();
    mapCtx.translate(S/2,S/2); mapCtx.rotate(yaw); mapCtx.scale(k,k);
    mapCtx.drawImage(cityMapCv,
      -(cityMapCv.width/2+camera.position.x*MPX),
      -(cityMapCv.height/2+camera.position.z*MPX));
    mapCtx.restore();
  }
  // ตัวอักษรที่ "ยังต้องเก็บ" ของคำปัจจุบัน (words[0]) — หักที่มีในมือแล้ว → ไฮไลต์คนละสี
  const need={};
  if(words[0]) words[0].en.split('').forEach(c=>need[c]=(need[c]||0)+1);
  for(const c in need) need[c]=Math.max(0,need[c]-(inv[c]||0));
  const cx=camera.position.x, cz=camera.position.z;
  mapCtx.save();
  mapCtx.beginPath(); mapCtx.arc(S/2,S/2,S/2,0,7); mapCtx.clip();   // กันจุดล้นออกนอกวงเรดาร์
  mapCtx.translate(S/2,S/2);
  mapCtx.rotate(yaw);                          // 🧭 heading-up: ทิศที่หันอยู่ = ขึ้นบนเสมอ · โลกหมุนรอบผู้เล่นตรงกลาง
  const rel=(ex,ez)=>[(ex-cx)*sc,(ez-cz)*sc];  // ตำแหน่งเทียบผู้เล่น (ctx หมุนให้เอง)
  letters.forEach(l=>{
    const [x,y]=rel(l.spr.position.x,l.spr.position.z);
    const want=need[l.ch]>0;                   // ตัวที่ต้องเก็บของคำนี้
    mapCtx.fillStyle=want?'#ffe14d':'rgba(150,162,175,.5)';
    mapCtx.beginPath(); mapCtx.arc(x,y,want?3:1.7,0,7); mapCtx.fill();
    if(want){ mapCtx.strokeStyle='rgba(255,255,255,.9)'; mapCtx.lineWidth=.8; mapCtx.stroke(); }
  });
  monsters.forEach(m=>{
    const [x,y]=rel(m.spr.position.x,m.spr.position.z);
    mapCtx.fillStyle=(mode==='haunt' && !m.hunting)?'#b0bfff':'#ff5252';
    mapCtx.beginPath(); mapCtx.arc(x,y,3,0,7); mapCtx.fill();
  });
  mapCtx.fillStyle='#69f0ae';
  Object.keys(peers).forEach(uid=>{
    const p=peers[uid]; const [x,y]=rel(p.cur.x,p.cur.z);
    mapCtx.beginPath(); mapCtx.arc(x,y,3,0,7); mapCtx.fill();
  });
  // ➡️ ลูกศรขอบเรดาร์: ชี้ไปตัวอักษรที่ยังต้องเก็บซึ่งอยู่ไกลเกินขอบวง (จัดกลุ่มตามมุมทุก 30° กันรก · เก็บตัวใกล้สุดต่อกลุ่ม)
  const edgeR=S/2-6, off={};
  letters.forEach(l=>{
    if(!(need[l.ch]>0)) return;
    const dx=l.spr.position.x-cx, dz=l.spr.position.z-cz, len=Math.hypot(dx,dz);
    if(len*sc<=S/2-3) return;                 // อยู่ในเรดาร์แล้ว ไม่ต้องมีลูกศร
    const b=Math.round(Math.atan2(dz,dx)/(Math.PI/6));
    if(!off[b] || len<off[b].len) off[b]={len, nx:dx/len, nz:dz/len};
  });
  Object.keys(off).forEach(b=>{
    const o=off[b];
    mapCtx.save();
    mapCtx.translate(o.nx*edgeR, o.nz*edgeR); mapCtx.rotate(Math.atan2(o.nz,o.nx));
    mapCtx.fillStyle='#ffe14d'; mapCtx.strokeStyle='rgba(0,0,0,.55)'; mapCtx.lineWidth=.6;
    mapCtx.beginPath(); mapCtx.moveTo(5,0); mapCtx.lineTo(-2.5,3.6); mapCtx.lineTo(-2.5,-3.6); mapCtx.closePath();
    mapCtx.fill(); mapCtx.stroke();
    mapCtx.restore();
  });
  mapCtx.restore();
  // จุดผู้เล่น: อยู่กลางเรดาร์ ชี้ขึ้นเสมอ (โลกหมุนรอบตัวนี้)
  mapCtx.fillStyle='#fff';
  mapCtx.beginPath(); mapCtx.moveTo(S/2,S/2-6); mapCtx.lineTo(S/2+4.5,S/2+5); mapCtx.lineTo(S/2-4.5,S/2+5); mapCtx.closePath(); mapCtx.fill();
}

/* ============================================================
   DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
   ============================================================ */
/* 🚗 รอบ 230: โหลดคอนโซล/หน้าปัดตามคันที่ขับ — ภาพชุดใหม่ (แดชบอร์ดสวยงาม ไม่มีพวงมาลัยในภาพ)
   img/3d_car/3d_dash_<carId>.png → (fallback เก่า) img/car/dash_<carId>.png → dash.png → CSS จำลอง */
function loadCarDash(){
  if(!carDashEl) return;
  const cid = (typeof myCar==='function' && myCar()) ? myCar().id : null;
  const put = im=>{ carDashEl.innerHTML=''; carDashEl.appendChild(im); carDashImg=im; };
  const css = ()=>{ carDashEl.innerHTML='<div class="cd-css"></div>'; carDashImg=null; };
  const tryLoad = (src,next)=>{ const im=new Image(); im.onload=()=>put(im); im.onerror=next; im.src=src; };
  const legacy = ()=> cid ? tryLoad('img/car/dash_'+cid+'.png', ()=>tryLoad('img/car/dash.png',css))
                          : tryLoad('img/car/dash.png',css);
  if(cid) tryLoad('img/3d_car/3d_dash_'+cid+'.png', legacy); else legacy();   // ชุดใหม่ก่อน · ไม่มี→ของเดิม
  loadCarWheel();                                                             // พวงมาลัยต่อคัน (โหลดคู่กับ dash)
}
/* 🚗 รอบ 230: พวงมาลัยตามคันที่ขับ (โปร่งใส หมุนได้) — img/3d_car/3d_wheel_<NN>.png → wheel.png → วง CSS */
function loadCarWheel(){
  if(!carWheelEl) return;
  const cid = (typeof myCar==='function' && myCar()) ? myCar().id : null;
  const num = cid ? cid.replace('car_','') : null;      // 'car_03' → '03'
  const put = im=>{ carWheelEl.innerHTML=''; carWheelEl.appendChild(im); };
  const css = ()=>{ carWheelEl.innerHTML='<div class="cw-css"></div>'; };
  const tryLoad = (src,next)=>{ const im=new Image(); im.onload=()=>put(im); im.onerror=next; im.src=src; };
  if(num) tryLoad('img/3d_car/3d_wheel_'+num+'.png', ()=>tryLoad('img/car/wheel.png',css));
  else tryLoad('img/car/wheel.png',css);
}
function buildDom(){
  const st=document.createElement('style');
  st.textContent=`
  #adv-overlay{position:fixed;inset:0;z-index:95;background:#000;display:none;touch-action:none}
  #adv-overlay.on{display:block}
  #adv-canvas{width:100%;height:100%;display:block}
  .adv-hud{position:absolute;pointer-events:none;font-family:inherit}
  #adv-topbar{top:8px;left:50%;transform:translateX(-50%);display:flex;gap:10px;align-items:center}
  .adv-hp{width:150px;height:16px;background:rgba(0,0,0,.45);border:2px solid #fff;border-radius:10px;overflow:hidden}
  .adv-haunt .adv-hp{display:none}
  .adv-hp-fill{height:100%;background:#66bb6a;transition:width .25s}
  .adv-hp-fill.low{background:#ef5350}
  #adv-coin{color:#fff;font-weight:800;font-size:14px;text-shadow:0 1px 3px #000;white-space:nowrap}
  #adv-board{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.5);border-radius:12px;
    padding:6px 9px;min-width:132px;max-width:190px;pointer-events:none}
  /* 🚁 รอบ 352: กล้องใต้ท้องย้ายไปมุมซ้ายบน (ไม่บังวิวหน้า) → กระดานอันดับหลบลงมาอยู่ใต้กล้อง
     สูตร: y กล้อง 30px + สูงกล้อง 26vh (BC.h) + ช่องไฟ 8px — แก้ BC ต้องแก้ตรงนี้ด้วย */
  .adv-heli #adv-board{top:calc(26vh + 38px)}
  .adv-b-title{color:#ffd54f;font-weight:800;font-size:12px;margin-bottom:2px;white-space:nowrap}
  .adv-b-row{color:#fff;font-size:12px;font-weight:600;display:flex;gap:8px;justify-content:space-between;line-height:1.4}
  .adv-b-row.me{color:#8ef7a5}
  .adv-b-nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px}
  .adv-b-more{color:#bbb;font-size:10px;line-height:.7;text-align:center}
  /* คำเป้าหมายใหญ่ทีละคำ กลางบนจอ (แทนลิสต์ 10 คำเดิม) — ตัวอักษรเก็บแล้วไฮไลต์เขียว จบคำแล้วเด้งคำถัดไปเอง
     · top:82 เลี่ยงชนแถบ "👻 หนี!" (top:52) + topbar · pointer-events:none ไม่บังนิ้ว · อยู่เหนือ crosshair/คอนโซล */
  #adv-words{top:82px;left:50%;transform:translateX(-50%);text-align:center;background:rgba(0,0,0,.4);
    border-radius:16px;padding:7px 16px;pointer-events:none;max-width:94vw}
  .adv-fword{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}
  .adv-fch{display:inline-block;min-width:30px;text-align:center;font-size:clamp(20px,5.5vw,34px);font-weight:800;
    color:#fff;background:rgba(255,255,255,.15);border-radius:9px;padding:3px 8px;text-shadow:0 2px 4px #000;transition:background .2s,box-shadow .2s}
  .adv-fch.got{background:#66bb6a;box-shadow:0 0 13px #66bb6a}
  .adv-fth{color:#ffe082;font-size:clamp(13px,3.4vw,18px);font-weight:700;margin-top:4px;text-shadow:0 1px 3px #000}
  #adv-hearts{display:none;left:10px;top:42px;font-size:24px;letter-spacing:3px;pointer-events:none;
    filter:drop-shadow(0 1px 3px rgba(0,0,0,.85))}
  #adv-survive{display:none;left:10px;top:78px;font-size:14px;font-weight:800;color:#c6f6d5;pointer-events:none;
    background:rgba(0,0,0,.45);border-radius:10px;padding:3px 10px;text-shadow:0 1px 3px #000}
  #adv-map{top:8px;right:8px;pointer-events:auto;cursor:pointer}  /* รอบ 144: แตะ = เปิดแผนที่ขยาย */
  #adv-exit{top:118px;right:8px;pointer-events:auto;background:rgba(211,47,47,.92);color:#fff;border:2px solid #fff;
    border-radius:12px;font-weight:800;font-size:14px;padding:7px 12px;font-family:inherit}
  #adv-hunt{top:52px;left:50%;transform:translateX(-50%);color:#ff5252;font-weight:900;font-size:18px;
    text-shadow:0 1px 4px #000;background:rgba(0,0,0,.5);border-radius:12px;padding:4px 14px;display:none;
    animation:advHuntPulse .6s infinite}
  @keyframes advHuntPulse{0%,100%{opacity:1}50%{opacity:.55}}
  #adv-inv{bottom:8px;left:50%;transform:translateX(-50%);max-width:70vw;background:rgba(0,0,0,.42);
    border-radius:12px;padding:5px 10px;display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
  .adv-inv-ch{color:#fff;font-weight:800;font-size:13px;background:rgba(255,255,255,.18);border-radius:6px;padding:1px 6px}
  .adv-inv-empty{color:#eee;font-size:12px}
  #adv-cross{top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;
    background:rgba(255,255,255,.9);box-shadow:0 0 4px #000}
  .adv-haunt #adv-cross{display:none}
  #adv-dmg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(255,0,0,.55));opacity:0}
  #adv-dmg.on{animation:advDmg .5s ease-out}
  @keyframes advDmg{0%{opacity:1}100%{opacity:0}}
  .adv-hunted #adv-dmg{animation:advHuntVig 1.1s ease-in-out infinite}
  @keyframes advHuntVig{0%,100%{opacity:.25}50%{opacity:.6}}
  #adv-banner{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#fff;
    font-size:20px;text-shadow:0 2px 6px #000;opacity:0;pointer-events:none;background:rgba(0,0,0,.55);
    border-radius:16px;padding:12px 22px;max-width:86vw;z-index:5}
  #adv-banner.show{animation:advBan 2.4s ease-out}
  #adv-banner.stay{opacity:1;animation:none;pointer-events:auto}
  .adv-ban-coin{color:#ffd54f;font-weight:900}
  @keyframes advBan{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}
    20%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
  .adv-ko{font-size:22px;font-weight:800}
  .adv-ko small{font-size:14px;font-weight:600;color:#ffcdd2}
  .adv-ko-btn{margin-top:10px;background:#43a047;color:#fff;border:2px solid #fff;border-radius:12px;
    font-weight:800;font-size:16px;padding:9px 20px;font-family:inherit}
  #adv-scare{position:absolute;inset:0;pointer-events:none;z-index:9;display:none;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at center,rgba(120,0,0,.85),#000 78%)}
  #adv-scare.on{display:flex;animation:advScare 1.5s ease-out forwards}
  #adv-scare span{font-size:56vh;line-height:1;filter:drop-shadow(0 0 40px #f00)}
  #adv-scare img{display:none;max-width:100vw;max-height:100vh;object-fit:contain;
    filter:drop-shadow(0 0 55px #f00) contrast(1.12) saturate(1.15)}
  #adv-scare.has-img img{display:block}
  #adv-scare.has-img span{display:none}
  @keyframes advScare{0%{opacity:0;transform:scale(.25)}8%{opacity:1;transform:scale(1.15)}
    16%{transform:scale(.95)}24%{transform:scale(1.08)}70%{opacity:1}100%{opacity:0;transform:scale(1.35)}}
  .adv-shake{animation:advShake .12s linear 9}
  @keyframes advShake{0%{transform:translate(0,0)}25%{transform:translate(-12px,6px)}50%{transform:translate(10px,-8px)}
    75%{transform:translate(-8px,-6px)}100%{transform:translate(9px,7px)}}
  #adv-joy{position:absolute;bottom:18px;left:18px;width:110px;height:110px;border-radius:50%;
    background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.4);pointer-events:none;display:none}
  #adv-joy-dot{position:absolute;left:50%;top:50%;width:44px;height:44px;border-radius:50%;
    background:rgba(255,255,255,.5);transform:translate(-50%,-50%)}
  #adv-shoot{position:absolute;bottom:26px;right:22px;width:76px;height:76px;border-radius:50%;pointer-events:auto;
    background:rgba(255,167,38,.9);border:3px solid #fff;font-size:32px;display:none}
  .adv-touch #adv-joy{display:block}
  .adv-touch #adv-shoot{display:block}
  .adv-touch.adv-haunt #adv-shoot{display:none}
  .adv-touch.adv-heli #adv-shoot{display:none}
  .adv-touch.adv-drone #adv-shoot{display:none}
  .adv-touch.adv-mecha #adv-shoot{display:none}   /* รอบ 221: โลกหุ่นใช้ #mecha-fire (🔫) แทน — ซ่อนปุ่มยิงส้ม 🔥 ที่เผลอโผล่มาทับ ▼ มุมขวาล่าง */
  .adv-heli #adv-cross{display:none}
  /* 🛸 โหมดโดรน FPV: OSD สีเขียวเรือง + เรติเคิลกรอบ + ขอบจอมืด (ฟีลกล้อง FPV) */
  .adv-drone #adv-inst{display:block;color:#7cff9d;font-family:'Courier New',monospace;letter-spacing:.5px;
    background:rgba(0,22,8,.4);border:1px solid rgba(124,255,157,.4);text-shadow:0 0 6px rgba(124,255,157,.75)}
  .adv-drone #adv-gauges,.adv-drone #adv-cockpit{display:none}
  .adv-drone #adv-cross{width:22px;height:22px;background:none;border:2px solid rgba(124,255,157,.85);
    border-radius:0;box-shadow:0 0 5px rgba(0,0,0,.85)}
  #adv-overlay.adv-drone:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;
    box-shadow:inset 0 0 130px 34px rgba(0,0,0,.5)}
  /* 🌀 ใบพัดโดรนซ้าย-ขวา (รอบ 323) — แขน+มอเตอร์+จานใบพัดเบลอหมุน เอียงตามมุมกล้อง FPV
     ความเร็วหมุนผูกกับคันเร่งจริงผ่านตัวแปร --pspin (ตั้งใน tickDrone) */
  #adv-props{position:absolute;inset:0;pointer-events:none;display:none;z-index:2;overflow:hidden}
  .adv-drone #adv-props{display:block}
  #adv-props .prop{position:absolute;bottom:4vh;width:34vmin;height:34vmin;
    transform:perspective(420px) rotateX(56deg)}
  #adv-props .prop-l{left:-8vmin}
  #adv-props .prop-r{right:-8vmin}
  #adv-props .prop i{position:absolute;inset:0;border-radius:50%;
    background:conic-gradient(rgba(226,235,245,.34) 0deg 14deg,rgba(226,235,245,.05) 14deg 172deg,
      rgba(226,235,245,.34) 180deg 194deg,rgba(226,235,245,.05) 194deg 360deg);
    filter:blur(1.1px);animation:advProp var(--pspin,.3s) linear infinite;
    box-shadow:inset 0 0 26px rgba(0,0,0,.28),0 0 12px rgba(0,0,0,.25)}
  #adv-props .prop b{position:absolute;left:50%;top:50%;width:17%;height:17%;transform:translate(-50%,-50%);
    border-radius:50%;background:radial-gradient(circle at 35% 30%,#79808a,#22252a 72%);
    box-shadow:0 0 9px rgba(0,0,0,.65)}
  #adv-props .prop:after{content:'';position:absolute;left:50%;top:50%;width:60%;height:8%;border-radius:5px;
    background:linear-gradient(180deg,#454b55,#181b20);box-shadow:0 2px 6px rgba(0,0,0,.5);transform-origin:0 50%}
  #adv-props .prop-l:after{transform:translateY(-50%) rotate(38deg)}
  #adv-props .prop-r:after{transform:translateY(-50%) rotate(142deg)}
  @keyframes advProp{to{transform:rotate(360deg)}}
  html.no-anim #adv-props .prop i{animation:none}
  /* 💥 ชนกำแพง: ทั้งชุดสะบัด + ใบพัดหมุนช้าลง (ตั้ง --pspin เป็นค่าสตอลใน tickDrone) */
  #adv-props.hit{animation:propShake .42s ease-out}
  #adv-props.hit .prop i{filter:blur(2.2px) saturate(.5) brightness(.8)}
  @keyframes propShake{0%{transform:translate3d(0,0,0)}18%{transform:translate3d(-7px,5px,0)}
    42%{transform:translate3d(6px,-4px,0)}68%{transform:translate3d(-4px,2px,0)}100%{transform:none}}
  html.no-anim #adv-props.hit{animation:none}
  /* 🌀 ใบพัดหัก: ข้างที่หักหยุดหมุน เอียงตก สีมืด + มอเตอร์กะพริบแดง (ซ่อมด้วยการเก็บตัวอักษร) */
  #adv-props.broken-l .prop-l i,#adv-props.broken-r .prop-r i{animation:none;opacity:.5;
    filter:blur(.4px) saturate(.25) brightness(.55);transform:rotate(24deg)}
  #adv-props.broken-l .prop-l b,#adv-props.broken-r .prop-r b{background:radial-gradient(circle at 40% 35%,#ff8a80,#5b1a15 72%);
    animation:propWarn .7s ease-in-out infinite}
  @keyframes propWarn{0%,100%{box-shadow:0 0 9px rgba(0,0,0,.65)}50%{box-shadow:0 0 16px 4px rgba(255,82,82,.75)}}
  html.no-anim #adv-props .prop b{animation:none}
  /* 🪫 แบตต่ำ: แถบ OSD เปลี่ยนเป็นแดงกะพริบ */
  .adv-drone #adv-inst.bat-low{color:#ff8f8f;border-color:rgba(255,120,120,.6);
    background:rgba(40,0,0,.42);text-shadow:0 0 6px rgba(255,120,120,.8);animation:batLow 1.1s ease-in-out infinite}
  @keyframes batLow{0%,100%{opacity:1}50%{opacity:.55}}
  html.no-anim .adv-drone #adv-inst.bat-low{animation:none}
  /* 🏁📸 ปุ่มโหมดแข่ง + กล้อง (โชว์เฉพาะโลกโดรน · ซ้อนกันมุมขวาล่าง เหนือปุ่มยิงที่ซ่อนอยู่แล้ว) */
  #adv-race,#adv-shot{position:absolute;right:14px;display:none;pointer-events:auto;z-index:5;
    width:62px;padding:6px 0 4px;border-radius:12px;border:1px solid rgba(124,255,157,.5);
    background:rgba(0,26,12,.62);color:#9dffc4;font-size:19px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,255,157,.6)}
  #adv-race small,#adv-shot small{display:block;font-size:9.5px;letter-spacing:.02em}
  /* วางใต้ปุ่ม 🚪ออก มุมขวาบน — พ้นจานใบพัดขวา (เริ่มที่ ~265px) และพ้นจอยสติ๊กมุมล่างซ้าย */
  #adv-race{top:164px} #adv-shot{top:212px}
  .adv-drone #adv-race,.adv-drone #adv-shot{display:block}
  #adv-race:active,#adv-shot:active{background:rgba(124,255,157,.28)}
  #adv-race.on{background:rgba(255,214,79,.22);border-color:#ffd54f;color:#ffe9a3;text-shadow:0 0 6px rgba(255,213,79,.7)}
  /* 🌧️🎚️ ปุ่มที่ปัดน้ำฝน + ปรับมุมนั่ง (เฉพาะโลกเฮลิฯ · วางใต้ปุ่มออก มุมขวาบน) */
  /* ⚠️ คอลัมน์ขวาเต็มถึง y~317 (ออก/แชท/ไมค์/ลำโพง/โหมดเสียง) → วางคู่นี้ "ชิดล่างขวา" แทน
     ยึดจากขอบล่าง จอเตี้ยแค่ไหนก็ไม่หลุด */
  #adv-wiper,#adv-seat{position:absolute;bottom:10px;display:none;pointer-events:auto;z-index:6;
    width:58px;padding:5px 0 3px;border-radius:12px;border:1px solid rgba(124,200,255,.5);
    background:rgba(0,18,32,.72);color:#a9dcff;font-size:17px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,200,255,.6)}
  #adv-wiper small,#adv-seat small{display:block;font-size:9px;letter-spacing:.02em}
  #adv-visor{position:absolute;bottom:10px;right:142px;display:none;pointer-events:auto;z-index:6;
    width:58px;padding:5px 0 3px;border-radius:12px;border:1px solid rgba(124,200,255,.5);
    background:rgba(0,18,32,.72);color:#a9dcff;font-size:17px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,200,255,.6)}
  #adv-visor small{display:block;font-size:9px;letter-spacing:.02em}
  .adv-heli #adv-visor{display:block}
  #adv-visor:active{background:rgba(124,200,255,.28)}
  #adv-visor.on,#adv-wiper.on,#adv-light.on{background:rgba(124,255,157,.2);border-color:#7cff9d;color:#c6ffd8}
  /* 💡 ปุ่มไฟส่องหมอก (รอบ 350) — ต่อแถวล่างขวา: seat 14 · wiper 78 · visor 142 · light 206 */
  #adv-light{position:absolute;bottom:10px;right:206px;display:none;pointer-events:auto;z-index:6;
    width:58px;padding:5px 0 3px;border-radius:12px;border:1px solid rgba(124,200,255,.5);
    background:rgba(0,18,32,.72);color:#a9dcff;font-size:17px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,200,255,.6)}
  #adv-light small{display:block;font-size:9px;letter-spacing:.02em}
  .adv-heli #adv-light{display:block}
  #adv-light:active{background:rgba(124,200,255,.28)}
  /* 🚶🪂 รอบ 354: เฟสเดินเท้าในโลกเฮลิฯ */
  #adv-wing,#adv-tour{position:absolute;bottom:10px;display:none;pointer-events:auto;z-index:7;
    width:64px;padding:6px 0 4px;border-radius:12px;border:1px solid rgba(255,213,79,.65);
    background:rgba(40,28,0,.78);color:#ffe9a8;font-size:19px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(255,213,79,.6)}
  #adv-wing{right:14px} #adv-tour{right:86px}
  #adv-wing small,#adv-tour small{display:block;font-size:9px;letter-spacing:.02em}
  #adv-wing:active,#adv-tour:active{background:rgba(255,213,79,.3)}
  .adv-heli.show-wing #adv-wing{display:block}
  .adv-heli.show-tour #adv-tour{display:block}
  /* เฟสเดิน/นั่ง/วิงสูท = ไม่ใช่นักบิน → ซ่อนกรอบค็อกพิต/กระจก/ปุ่มนักบินทั้งชุด */
  .adv-heli.hfoot #adv-cockpit,.adv-heli.hfoot #adv-glass,.adv-heli.hfoot #adv-wiper,
  .adv-heli.hfoot #adv-seat,.adv-heli.hfoot #adv-visor,.adv-heli.hfoot #adv-light,
  .adv-heli.hfoot #adv-skipstart{display:none}
  .adv-heli.hfoot #adv-board{top:8px}                /* ไม่มีกล้องใต้ท้องมุมซ้ายบน — กระดานกลับขึ้นบนสุด */
  #adv-liftfx{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:8;
    display:flex;align-items:center;justify-content:center;color:#b9ffdd;font-weight:800;font-size:18px;
    transition:opacity .35s ease}
  #adv-liftfx.on{opacity:1;pointer-events:auto}
  #adv-wiper{right:78px} #adv-seat{right:14px}
  .adv-heli #adv-wiper,.adv-heli #adv-seat{display:block}
  #adv-wiper:active,#adv-seat:active{background:rgba(124,200,255,.28)}
  #adv-wiper.on{background:rgba(124,255,157,.2);border-color:#7cff9d;color:#c6ffd8}
  /* ⏭ ปุ่มข้ามซีเควนซ์สตาร์ทเฮลิฯ (โชว์เฉพาะระหว่างสตาร์ท · บินรอบ 2-3 ไม่ต้องรอครบ) */
  #adv-skipstart{position:absolute;display:none;left:50%;bottom:74px;transform:translateX(-50%);z-index:6;
    pointer-events:auto;padding:7px 16px;border-radius:14px;border:1px solid rgba(255,213,79,.6);
    background:rgba(38,26,0,.72);color:#ffe9a3;font-size:13px;font-family:'Courier New',monospace;
    text-shadow:0 0 6px rgba(255,213,79,.6)}
  #adv-skipstart.on{display:block}
  #adv-skipstart:active{background:rgba(255,213,79,.28)}
  #adv-racehud{display:none;top:64px;left:50%;transform:translateX(-50%);z-index:5;
    background:rgba(0,22,8,.62);border:1px solid rgba(124,255,157,.45);border-radius:8px;
    padding:4px 12px;color:#9dffc4;font-family:'Courier New',monospace;font-size:13px;white-space:nowrap}
  #adv-racehud b{color:#fff}
  /* 📸 แฟลชตอนกดชัตเตอร์ + การ์ดพรีวิวภาพ */
  /* 🌧️ ฝนบนเลนส์กล้อง FPV — ริ้วฝนเฉียงวิ่งลง + หยดน้ำเกาะเลนส์ (CSS ล้วน · เปิดตอนพายุเท่านั้น) */
  #adv-rain{position:absolute;inset:0;pointer-events:none;z-index:6;opacity:0;transition:opacity 1.4s ease}
  #adv-rain.on{opacity:1}
  #adv-rain:before{content:'';position:absolute;inset:-20% -10%;
    background:repeating-linear-gradient(74deg,rgba(255,255,255,0) 0 9px,rgba(198,222,240,.30) 9px 10.5px,rgba(255,255,255,0) 10.5px 22px);
    animation:advRain .55s linear infinite}
  @keyframes advRain{to{transform:translate3d(-42px,150px,0)}}
  #adv-rain i{position:absolute;display:block;border-radius:52% 48% 46% 54%;
    background:radial-gradient(circle at 34% 30%,rgba(255,255,255,.62),rgba(190,215,235,.28) 58%,rgba(120,150,175,.10));
    box-shadow:inset 0 -1px 2px rgba(255,255,255,.45),0 1px 3px rgba(0,0,0,.28);
    backdrop-filter:blur(1px);animation:advDrop 3s ease-in infinite}
  @keyframes advDrop{0%{transform:translateY(0) scale(1);opacity:.85}
    72%{transform:translateY(16px) scale(1.04);opacity:.7}
    100%{transform:translateY(46px) scale(.7);opacity:0}}
  html.no-anim #adv-rain:before,html.no-anim #adv-rain i{animation:none}
  /* ⛈ ฟ้าแลบ — วาบ 2 จังหวะแบบสายฟ้าจริง (ขาวอมฟ้า ไม่ใช่ขาวล้วนแบบแฟลชกล้อง) */
  #adv-bolt{position:absolute;inset:0;pointer-events:none;z-index:7;opacity:0;
    background:linear-gradient(180deg,rgba(226,240,255,.92),rgba(150,190,230,.35) 55%,rgba(60,80,110,0))}
  #adv-bolt.on{animation:advBolt .42s ease-out}
  @keyframes advBolt{0%{opacity:0}6%{opacity:.9}16%{opacity:.12}28%{opacity:.75}48%{opacity:.06}100%{opacity:0}}
  html.no-anim #adv-bolt.on{animation:none}
  #adv-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:8}
  #adv-flash.on{animation:advFlash .26s ease-out}
  @keyframes advFlash{0%{opacity:.85}100%{opacity:0}}
  #adv-photo{position:absolute;inset:0;display:none;place-items:center;z-index:9;
    background:rgba(0,0,0,.68);pointer-events:auto;padding:12px}
  #adv-photo.on{display:grid}
  #adv-photo .ph-card{display:flex;flex-direction:column;gap:8px;max-width:min(88vw,560px);
    background:#10151a;border:1px solid rgba(124,255,157,.35);border-radius:12px;padding:10px}
  #adv-photo img{display:block;width:100%;max-height:58vh;object-fit:contain;border-radius:7px;background:#000}
  #adv-photo .ph-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  #adv-photo button{pointer-events:auto;border:1px solid rgba(124,255,157,.5);border-radius:9px;
    padding:8px 14px;font-size:14px;font-weight:700;background:rgba(0,26,12,.7);color:#9dffc4}
  #adv-photo #adv-photo-save{background:#1f7a4d;border-color:#2fae6d;color:#eafff2}
  /* 🛸 ขอบตัวโดรน+ขาลงจอด ล่างจอ — ให้รู้สึกเหมือนนั่งอยู่บนเครื่องจริง (ไม่บังทางบิน) */
  #adv-props .dframe{position:absolute;left:50%;bottom:0;transform:translateX(-50%);
    width:min(58vmin,420px);height:8.5vh;min-height:52px}
  #adv-props .dframe:before{content:'';position:absolute;left:50%;bottom:3.4vh;transform:translateX(-50%);
    width:38%;height:2.2vh;min-height:14px;border-radius:16px 16px 7px 7px;
    background:linear-gradient(180deg,#39404a,#12161b 78%);
    box-shadow:0 -1px 0 rgba(255,255,255,.09),0 6px 16px rgba(0,0,0,.5)}
  #adv-props .dframe:after{content:'';position:absolute;left:12%;right:12%;bottom:.6vh;height:1vh;min-height:6px;
    border-radius:5px;background:linear-gradient(180deg,#333a43,#0d1115);box-shadow:0 3px 10px rgba(0,0,0,.55)}
  #adv-props .skid{position:absolute;bottom:1vh;width:1.1vh;min-width:7px;height:4.4vh;min-height:26px;
    border-radius:4px;background:linear-gradient(180deg,#39404a,#0f1317)}
  #adv-props .skid-l{left:33%;transform:rotate(11deg)}
  #adv-props .skid-r{right:33%;transform:rotate(-11deg)}
  /* 🚗 โหมดขับรถกำแพงเพชร: แผงหน้าปัด+ฝากระโปรง (img/car/dash.png) + พวงมาลัยขวาหมุนจริง (img/car/wheel.png)
     รถพวงมาลัยขวาแบบเมืองไทย · ไม่มีภาพ → CSS จำลองทั้งคู่ (พวงมาลัยยังหมุนได้) */
  .adv-drive #adv-inst{display:block}
  .adv-drive #adv-cross{display:none}
  .adv-drive #adv-gauges,.adv-drive #adv-cockpit{display:none}
  /* 🚗 รอบ 284 (สเปกผู้ใช้): คอนโซลสูงบังเส้นทาง → เลื่อนทั้งแผงลง 20vh (จอวิทยุ/ตุ๊กตา/เกจ ผูกกับ rect ของภาพ เลื่อนตามเอง) */
  #adv-cardash{position:absolute;left:0;right:0;bottom:-20vh;pointer-events:none;display:none;z-index:3}
  .adv-drive #adv-cardash{display:block}
  /* 🚗 รอบ 231: แดชบอร์ดชุดใหม่ — object-position 65% ตัดกระจกหน้า(ถนนวาดในภาพ)ทิ้งให้หมด เหลือเฉพาะแผงหน้าปัด
     · max-height 46vh (เตี้ยลง ไม่บังทางมองเห็นฉาก 3D จริง) — ยืนยันตัดกระจกครบทุกคัน (กระจกจบ ~40% ของภาพ) */
  #adv-cardash img{width:100%;display:block;max-height:46vh;object-fit:cover;object-position:50% 65%}
  /* เข็มหน้าปัดวิ่งจริง — canvas ทับตำแหน่งวงเกจของภาพ dash.png (อยู่เหนือแผง ใต้พวงมาลัย) */
  #adv-cargauges{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none;z-index:3}
  .adv-drive #adv-cargauges{display:block}
  #adv-cardash .cd-css{height:36vh;background:linear-gradient(180deg,#262a31,#101216);
    border-top:5px solid #343943;border-radius:26px 26px 0 0;margin:0 -2vw}  /* รอบ 284: แผงเลื่อนลง 20vh → เพิ่มสูงชดเชยให้เหลือแถบ 16vh */
  /* 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่เลือก (blkN.png) ยืนบนแผงหน้าปัด หัวส่ายตามแรงเลี้ยว
     JS ตั้ง left/top/size ตามพิกัดภาพ dash (BOBBLE_FOOT) · img หมุนรอบฐาน (เท้า) ด้วยสปริงใน bobbleTick */
  #adv-bobble{position:absolute;display:none;z-index:4;pointer-events:auto;cursor:pointer;
    perspective:560px;will-change:transform}
  .adv-drive #adv-bobble{display:block}
  #adv-bobble img{width:100%;height:100%;display:block;object-fit:contain;object-position:50% 100%;
    transform-origin:50% 96%;filter:drop-shadow(0 3px 5px rgba(0,0,0,.55));will-change:transform}
  /* 👆 รอบ 193: เด้งตอนถูกสะกิด */
  @keyframes bobPoke{0%{transform:scale(1)}28%{transform:scale(1.13)}62%{transform:scale(.95)}100%{transform:scale(1)}}
  #adv-bobble.poke{animation:bobPoke .42s ease-out}
  html.no-anim #adv-bobble.poke{animation:none}
  /* 🪆 รอบ 193: สกินตุ๊กตาพิเศษ (ใช้ทั้งตัวจริง #adv-bobble + พรีวิว .dp-prev · เอฟเฟกต์ filter ล้วน)
     ต้องมี #adv-bobble นำหน้าเพื่อชนะ specificity ของ base rule (#adv-bobble img) */
  #adv-bobble.bskin-glow img,.dp-prev.bskin-glow img{filter:drop-shadow(0 0 5px #7ff) drop-shadow(0 0 11px #12d6ff) brightness(1.06);animation:bskGlow 1.5s ease-in-out infinite}
  @keyframes bskGlow{0%,100%{filter:drop-shadow(0 0 4px #7ff) drop-shadow(0 0 8px #12d6ff) brightness(1.04)}50%{filter:drop-shadow(0 0 9px #bff) drop-shadow(0 0 18px #29e0ff) brightness(1.14)}}
  #adv-bobble.bskin-gold img,.dp-prev.bskin-gold img{filter:sepia(1) saturate(3.4) hue-rotate(-16deg) brightness(1.14) drop-shadow(0 0 7px #ffcf4d)}
  #adv-bobble.bskin-rainbow img,.dp-prev.bskin-rainbow img{animation:bskRainbow 3s linear infinite}
  @keyframes bskRainbow{0%{filter:hue-rotate(0deg) saturate(1.6) drop-shadow(0 0 6px #f9a)}100%{filter:hue-rotate(360deg) saturate(1.6) drop-shadow(0 0 6px #9af)}}
  #adv-bobble.bskin-ghost img,.dp-prev.bskin-ghost img{filter:brightness(1.35) grayscale(.25) drop-shadow(0 0 9px #aef);opacity:.5}
  html.no-anim #adv-bobble.bskin-glow img,html.no-anim #adv-bobble.bskin-rainbow img,html.no-anim .dp-prev.bskin-glow img,html.no-anim .dp-prev.bskin-rainbow img{animation:none}
  /* 🪆 รอบ 193: หน้าต่างเลือก/ปลดล็อกสกินตุ๊กตา */
  #adv-dollpick{position:absolute;inset:0;display:none;align-items:center;justify-content:center;z-index:9;
    background:rgba(4,12,26,.55);pointer-events:auto}
  #adv-dollpick .dp-box{width:min(540px,94vw);box-sizing:border-box;background:rgba(10,22,42,.97);
    border:2px solid #4fc3f7;border-radius:18px;padding:13px 16px 15px;color:#e6f3ff;box-shadow:0 0 26px rgba(79,195,247,.45)}
  #adv-dollpick .dp-head{display:flex;align-items:center;justify-content:space-between;font-size:17px;font-weight:800;color:#8fd6ff}
  #adv-dollpick .dp-x{border:none;background:rgba(255,255,255,.12);color:#cfe4fa;border-radius:8px;width:28px;height:28px;font-size:14px;cursor:pointer}
  #adv-dollpick .dp-coin{text-align:center;font-size:13px;color:#ffe08a;margin:5px 0 9px}
  #adv-dollpick .dp-grid{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
  #adv-dollpick .dp-cell{flex:0 0 auto;width:92px;background:rgba(18,40,72,.6);border:2px solid rgba(95,200,255,.3);
    border-radius:13px;padding:7px 5px 8px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:3px}
  #adv-dollpick .dp-cell.sel{border-color:#ffd54a;box-shadow:0 0 12px rgba(255,213,74,.5)}
  #adv-dollpick .dp-cell:active{transform:scale(.95)}
  #adv-dollpick .dp-prev{position:relative;width:100%;height:62px;display:flex;align-items:flex-end;justify-content:center}
  #adv-dollpick .dp-prev img{height:60px;object-fit:contain}
  #adv-dollpick .dp-prev b{position:absolute;top:-2px;right:6px;font-size:15px}
  #adv-dollpick .dp-name{font-size:12px;font-weight:700;color:#dcefff}
  #adv-dollpick .dp-cell i{font-size:11.5px;font-style:normal;font-weight:800;padding:2px 8px;border-radius:9px}
  #adv-dollpick .dp-cost{background:rgba(255,205,80,.16);color:#ffd76a}
  #adv-dollpick .dp-use{background:rgba(90,200,255,.16);color:#8fd6ff}
  #adv-dollpick .dp-on{background:#ffd54a;color:#5a4300}
  #adv-dollpick .dp-hint{text-align:center;font-size:11px;color:#9ec8e8;margin-top:10px}
  /* ปุ่มเปิดหน้าแต่งตุ๊กตา ในแผงเตรียมออกรถ */
  #cs-doll{display:block;margin:10px auto 0;background:rgba(79,195,247,.16);color:#bfe8ff;border:1.5px solid #4fc3f7;
    border-radius:12px;font-family:inherit;font-weight:800;font-size:14px;padding:8px 18px;cursor:pointer}
  #cs-doll:active{transform:scale(.96)}
  #adv-bobble .bob-base{position:absolute;left:50%;bottom:-3px;width:46%;height:9px;transform:translateX(-50%);
    background:radial-gradient(50% 60% at 50% 50%,rgba(0,0,0,.5),transparent 72%);border-radius:50%;pointer-events:none}
  /* ขดสปริงเล็กๆ ใต้ตุ๊กตา (โผล่จากใต้เท้า) ให้ดูเหมือนตั้งบนสปริงจริง */
  #adv-bobble .bob-coil{position:absolute;left:50%;bottom:1px;width:16%;height:12%;transform:translateX(-50%);
    background:repeating-linear-gradient(180deg,rgba(200,200,210,.85) 0 2px,rgba(90,95,110,.35) 2px 4px);
    border-radius:0 0 40% 40%;opacity:.7;pointer-events:none}
  /* 🎵 รอบ 181: จอวิทยุ head-unit — วางทับจอดำกลางคอนโซล (JS ตั้ง left/top/size ตามภาพ dash) */
  #adv-radio-screen{position:absolute;display:none;z-index:5;cursor:pointer;overflow:hidden;
    border-radius:3px;box-shadow:0 0 0 1px rgba(90,190,255,.25) inset,0 0 12px rgba(70,160,255,.22)}
  #adv-radio-viz{position:absolute;inset:0;width:100%;height:100%;display:block}
  #adv-radio-hint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:2px;text-align:center;pointer-events:none;line-height:1.1}
  #adv-radio-hint b{color:#8fe0ff;font-size:clamp(9px,1.5vw,13px);letter-spacing:1px;
    text-shadow:0 0 8px rgba(80,180,255,.8);animation:radioPulse 1.8s ease-in-out infinite}
  #adv-radio-hint span{color:#bcd7f0;font-size:clamp(7px,1.1vw,10px)}
  @keyframes radioPulse{0%,100%{opacity:.55}50%{opacity:1}}
  #adv-radio-screen.playing{box-shadow:0 0 0 1px rgba(120,220,255,.5) inset,0 0 18px rgba(80,190,255,.4)}
  /* แผงเลือกเพลง sci-fi — วางเหนือจอ (JS ตั้ง left/width/bottom) */
  #adv-radio-list{position:absolute;z-index:9;display:none;padding:9px 10px;
    background:linear-gradient(165deg,rgba(18,44,80,.97),rgba(6,18,40,.98));
    border:1px solid rgba(95,200,255,.5);border-radius:12px;color:#dcebfb;
    box-shadow:0 10px 30px rgba(2,10,28,.7),inset 0 0 22px rgba(80,180,255,.08);backdrop-filter:blur(3px)}
  #adv-radio-list .rl-head{display:flex;align-items:center;justify-content:space-between;
    font-size:12px;font-weight:800;color:#eaf7ff;margin-bottom:7px;letter-spacing:.5px}
  #adv-radio-list .rl-x{border:none;background:rgba(255,255,255,.1);color:#cfe4fa;border-radius:7px;
    width:22px;height:22px;cursor:pointer;font-size:12px}
  #adv-radio-list .rl-tracks{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:9px;max-height:26vh;overflow-y:auto;scrollbar-width:none}
  #adv-radio-list .rl-tracks::-webkit-scrollbar{display:none}
  #adv-radio-list .rl-track{display:flex;align-items:center;gap:5px;cursor:pointer;
    padding:5px 11px;border-radius:8px;font-size:12px;font-weight:700;font-family:inherit;
    background:rgba(11,31,66,.6);color:#bdd8f2;border:1px solid rgba(95,200,255,.28)}
  #adv-radio-list .rl-track .rl-eq{font-size:10px;color:#7fd0ff}
  #adv-radio-list .rl-track.on{background:linear-gradient(180deg,#2a7fd0,#1a5296);color:#fff;
    border-color:rgba(150,225,255,.8);box-shadow:0 0 10px rgba(80,180,255,.5)}
  #adv-radio-list .rl-modes{display:flex;gap:6px;margin-bottom:8px}
  #adv-radio-list .rl-mode{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;
    padding:6px 4px;border-radius:9px;font-size:11px;font-weight:800;font-family:inherit;line-height:1.1;
    background:rgba(11,31,66,.55);color:#a9c8e8;border:1px solid rgba(95,200,255,.3)}
  #adv-radio-list .rl-mode small{font-size:9px;font-weight:600;color:#8fb3d8}
  #adv-radio-list .rl-mode.on{background:linear-gradient(180deg,#37b6ff,#2160c8);color:#fff;
    border-color:rgba(150,225,255,.85);box-shadow:0 0 12px rgba(80,180,255,.55)}
  #adv-radio-list .rl-mode.on small{color:#dcefff}
  #adv-radio-list .rl-power{width:100%;cursor:pointer;padding:6px;border-radius:9px;
    font-size:11.5px;font-weight:800;font-family:inherit;
    background:rgba(70,20,32,.7);color:#ffc9cf;border:1px solid rgba(255,140,150,.5)}
  #adv-radio-list .rl-power:active,#adv-radio-list .rl-mode:active,#adv-radio-list .rl-track:active{transform:scale(.96)}
  /* 🚗 รอบ 230: พวงมาลัยขวาแบบไทย (ภาพชุดใหม่ ต่อคัน · โปร่งใส) · โผล่จากขอบล่างขวาแบบมองจากที่นั่งคนขับ
     ภาพ aspect ~1.5 (กว้างกว่าสูง) → คงสัดส่วนไม่บิด · เกจวิ่งจริงลอดช่องบนพวงมาลัย (drawCarGauges อิงตำแหน่งนี้) */
  /* รอบ 284 (สเปกผู้ใช้): กดพวงมาลัยลงจนขอบบนเกือบแตะขอบล่างจอ — bottom=calc(8vh-สูง) = เห็นขอบบน 8vh พอดีทุกจอ */
  #adv-carwheel{position:absolute;left:76%;bottom:calc(8vh - min(50vh,50vw));transform:translateX(-50%);
    height:min(50vh,50vw);width:auto;aspect-ratio:1.5;pointer-events:none;display:none;z-index:4;will-change:transform}
  .adv-drive #adv-carwheel{display:block}
  #adv-carwheel img{width:100%;height:100%;display:block;object-fit:contain}
  #adv-carwheel .cw-css{width:100%;height:100%;border-radius:50%;border:2.6vh solid #23262c;
    box-shadow:0 0 0 5px #14161a inset,0 5px 16px rgba(0,0,0,.55);position:relative;background:transparent}
  #adv-carwheel .cw-css:before{content:'';position:absolute;left:50%;top:50%;width:80%;height:11%;
    background:#23262c;transform:translate(-50%,-50%);border-radius:8px}
  #adv-carwheel .cw-css:after{content:'';position:absolute;left:50%;top:50%;width:11%;height:46%;
    background:#23262c;transform:translateX(-50%);border-radius:8px}
  #adv-horn{position:absolute;bottom:26px;right:22px;width:76px;height:76px;border-radius:50%;pointer-events:auto;
    background:rgba(66,165,245,.9);border:3px solid #fff;font-size:30px;display:none}
  .adv-touch.adv-drive #adv-horn{display:block}
  /* 🎛️ รอบ 127: ปุ่มจางๆ บนคอนโซลโหมดขับรถ (มือถือ) — ซ้าย=บังคับซ้าย-ขวา · ขวา=คันเร่งกดค้าง ปล่อยแล้วรถชลอเอง */
  #adv-steerpad,#adv-gaspad,#adv-brakepad,#adv-gearbtn,#adv-gearrev{display:none;position:absolute;pointer-events:auto;z-index:6;
    -webkit-user-select:none;user-select:none;touch-action:none;opacity:.34;transition:opacity .15s}
  #adv-steerpad.on,#adv-gaspad.on,#adv-brakepad.on{opacity:.68}
  .adv-touch.adv-drive #adv-steerpad{display:flex}
  .adv-touch.adv-drive #adv-gaspad{display:flex}
  .adv-touch.adv-drive #adv-brakepad{display:flex}
  .adv-touch.adv-drive #adv-gearbtn{display:flex}
  .adv-touch.adv-drive #adv-gearrev{display:flex}
  /* รอบ 143: ยืดแถบพวงมาลัยขึ้นบน+ลงล่างอย่างละ 1 ช่วง (64→192px สูง 3 เท่า จุดกึ่งกลางเดิม) — นิ้วลอยขึ้นลงไม่หลุดปุ่ม */
  #adv-steerpad{left:2.5%;bottom:calc(max(20vh,104px) - 64px);width:min(42vw,290px);height:192px;border-radius:34px;
    background:rgba(18,22,30,.6);border:2px solid rgba(255,255,255,.55);box-sizing:border-box;
    align-items:center;justify-content:space-between;padding:0 16px;color:#fff;font-size:24px}
  /* วงจอยสำรองมุมล่างซ้ายโดนแถบพวงมาลัยสูงขึ้นทับ → โหมดขับรถซ่อนตอนพัก โชว์เฉพาะตอนลากใช้งานจริง (.live) */
  .adv-touch.adv-drive #adv-joy{display:none}
  .adv-touch.adv-drive #adv-joy.live{display:block}
  .adv-touch.adv-mecha #adv-joy{display:none}   /* รอบ 222: โลกหุ่นใช้ปุ่มบังคับเอง ไม่ใช้จอย — ซ่อนวงกลมขาว (จอยเบส) ที่โผล่หลัง ◀▶ */
  #adv-steerdot{position:absolute;left:50%;top:50%;width:42px;height:42px;border-radius:50%;
    transform:translate(-50%,-50%);background:rgba(255,255,255,.78);box-shadow:0 0 10px rgba(0,0,0,.45);
    pointer-events:none}
  #adv-gaspad{right:20px;bottom:max(20vh,104px);width:94px;height:94px;border-radius:50%;flex-direction:column;
    background:rgba(40,165,88,.55);border:2px solid rgba(255,255,255,.6);
    align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:26px;line-height:1.05}
  #adv-gaspad small{font-size:12.5px;font-weight:700}
  /* 🦶 รอบ 139: ปุ่มเบรคแดง ซ้ายคันเร่งแบบแป้นรถจริง (กดค้าง=เบรคอย่างเดียว ไม่ถอย) */
  #adv-brakepad{right:124px;bottom:max(20vh,104px);width:84px;height:84px;border-radius:50%;flex-direction:column;
    background:rgba(198,45,45,.5);border:2px solid rgba(255,255,255,.6);
    align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:23px;line-height:1.05}
  #adv-brakepad small{font-size:12px;font-weight:700}
  /* ⚙️ รอบ 144 (สเปกผู้ใช้): แยกเกียร์เป็น 2 ปุ่ม — D เหนือปุ่มเบรค · R ตำแหน่งก้านไฟเลี้ยวเดิม (right:224 แถวล่าง)
     แตะปุ่มไหน = เข้าเกียร์นั้น (radio) · D ติด=เขียว · R ติด=เหลืองกะพริบ + คันเร่งเปลี่ยนเป็น "ถอย" ส้ม */
  #adv-gearbtn,#adv-gearrev{box-sizing:border-box;flex-direction:column;border-radius:14px;
    background:rgba(18,22,30,.6);border:2px solid rgba(255,255,255,.55);
    align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:19px;line-height:1}
  #adv-gearbtn{right:124px;bottom:calc(max(20vh,104px) + 96px);width:84px;height:52px}
  #adv-gearrev{right:224px;bottom:max(20vh,104px);width:64px;height:84px}
  #adv-gearbtn small,#adv-gearrev small{font-size:10.5px;font-weight:700;margin-top:2px}
  #adv-gearbtn.on{opacity:1;background:rgba(20,90,45,.75);border-color:#7dffb0;color:#c4ffd9}
  #adv-gearrev.on{opacity:1;background:rgba(120,70,0,.75);border-color:#ffb300;color:#ffd54f;
    animation:tlBlink .8s steps(1) infinite}
  #adv-gaspad.rev{background:rgba(230,126,20,.6)}
  /* รอบ 129→135: ปุ่มเร่ง/เลี้ยวลดลงมาระดับล่าง (20vh — ผู้ใช้ลองจริงแล้ว 40vh สูงไป) · แตรมุมล่างขวาเดิม */
  .adv-touch.adv-drive #adv-horn{bottom:26px;right:22px;width:64px;height:64px;font-size:26px;opacity:.8}
  /* 🚦 รอบ 135: ก้านไฟเลี้ยวแนวตั้งฝั่งขวา (แทนปุ่ม ⬅️➡️ รอบ 132) — ดันขึ้น=ไฟซ้าย ดันลง=ไฟขวา
     knob ค้างตำแหน่งจนรถเลี้ยวเสร็จแล้วเด้งกลับเองเหมือนก้านไฟรถจริง (tlTick หน่วง ~0.9 วิ) */
  #adv-tlpad{display:none;position:absolute;pointer-events:auto;z-index:6;right:20px;bottom:calc(max(20vh,104px) + 100px);  /* รอบ 144: ย้ายไปเหนือคันเร่ง (สเปกผู้ใช้) · เตี้ยลง 150→110 กันชนแถวปุ่มบนจอเตี้ย */
    width:60px;height:110px;border-radius:999px;background:rgba(18,22,30,.6);border:2px solid rgba(255,255,255,.55);
    box-sizing:border-box;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 0;
    font-size:17px;line-height:1;opacity:.34;transition:opacity .15s;
    -webkit-user-select:none;user-select:none;touch-action:none}
  .adv-drive #adv-tlpad{display:flex}
  #adv-tlpad.on{opacity:.85}
  #adv-tlpad.sig{opacity:1;border-color:#ffb300;animation:tlBlink .8s steps(1) infinite}
  #adv-tldot{position:absolute;left:50%;top:50%;width:40px;height:40px;border-radius:50%;
    transform:translate(-50%,-50%);background:rgba(255,255,255,.78);box-shadow:0 0 10px rgba(0,0,0,.45);
    pointer-events:none;transition:top .18s}
  #adv-tlpad.sig #adv-tldot{background:rgba(255,179,0,.95)}
  @keyframes tlBlink{0%,49%{filter:brightness(1.5)}50%,100%{filter:brightness(.55);opacity:.5}}
  /* 🗺️ รอบ 144 (สเปกผู้ใช้จาก screenshot จริง): minimap ไปบนซ้ายสุด · กระดานคะแนนขยับขวาต่อจาก map ·
     ปุ่มออกแทนที่ปุ่มแชทเดิม (top:8 right:140) · ปุ่มบนขวาจัดกริด 2 คอลัมน์แถวละ 50px เป็นระเบียบ · ? ไปมุมขวาสุด */
  .adv-drive #adv-map{left:8px;right:auto}
  .adv-drive #adv-board{left:136px;max-width:120px}
  .adv-drive #adv-topbar{left:276px;transform:none}  /* ตรึงลงช่องว่างระหว่างกระดาน (จบ 268) กับปุ่มแชท (เริ่ม ~489) */
  .adv-drive .adv-hp{width:80px}   /* รอบ 147: ย่ออีกขั้น เปิดทางแถวปุ่มเดียวด้านขวา */
  /* รอบ 147 (สเปกผู้ใช้): ปุ่มขวาบนแถวเดียวทั้งหมด ย่อขนาดให้พอดี — ซ้าย→ขวา: ทุกคน·ปิด·ปิด·แชท·?·ออก(ริมขวาสุด)
     ต้อง min-width:0 ทับ .adv-vbtn (base fix 86px) ไม่งั้นชนกันเอง · speed pill เลื่อนลง top:52 หลบแถวปุ่ม */
  .adv-drive #adv-exit{top:8px;right:8px;font-size:12.5px;padding:5px 9px}
  .adv-drive #adv-help{top:8px;right:74px;width:30px;height:30px;font-size:14px}
  .adv-drive #adv-chat-btn{top:8px;right:108px;font-size:12px;padding:5px 8px}
  .adv-drive #adv-mic{top:8px;right:172px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-drive #adv-spk{top:8px;right:224px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-drive #adv-vmode{top:8px;right:276px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-drive #adv-inst{top:52px}
  .adv-drive #adv-tmute{top:52px;right:108px;font-size:11px;padding:4px 6px;min-width:0}   /* ปุ่มครู แถวสอง (เลี่ยงก้านไฟเลี้ยว right:20) */
  .adv-drive #adv-podbtn{top:52px;right:200px;font-size:11px;padding:4px 6px;min-width:0}
  /* 🤖 รอบ 216: HUD โลกหุ่น (mecha) — เลย์เอาต์เฉพาะที่ "พอดีจอมือถือแคบ" (568×320 ก็ไม่ทับ)
     ผู้ใช้รอบก่อนสั่งย้ายขึ้นบนเหมือนโลกขับรถ แต่แถวเดียวแบบ drive ยาวเกินจอแคบ → ปุ่มทับปุ่มยิง
     แก้: minimap บนซ้าย · HP+เหรียญ ต่อขวา map · ปุ่มยูทิลิตี้ 2 แถวมุมบนขวา (เหนือปุ่มยิงเสมอ) · ซ่อนกระดานคะแนน (จอแคบไม่พอ)
     ยืนยัน getBoundingClientRect 480–844 กว้าง = ไม่มีปุ่มทับกัน + ไม่ทับปุ่มยิง/ปุ่มเดิน */
  /* 🤖 รอบ 237 (ผู้ใช้ screenshot): ปุ่มบนขวาเดิม 3 แถว โดนขอบกรอบห้องนักบิน (mh-frame z:5 ทึบมุมบนขวา) บังจนกดยาก
     แก้: (1) ปุ่มยูทิลิตี้ "แถวเดียว" ริมบนขวา (เหมือนโลกขับรถ) (2) map+เหรียญ/HP ซ้อนเป็นคอลัมน์ซ้าย (map บน · pill ใต้ map)
          เปิดที่บนขวาทั้งแถบให้ปุ่มเรียงแถวเดียวไม่ชน (3) ทุกตัว z-index:6 (>กรอบ 5) → ขอบ HUD บังไม่ได้อีก */
  .adv-mecha #adv-map{top:8px;left:8px;right:auto;z-index:6}
  .adv-mecha #adv-board{display:none}
  .adv-mecha #adv-topbar{top:134px;left:8px;transform:none;z-index:6}   /* เหรียญ/HP ลงใต้ minimap (คอลัมน์ซ้าย) เปิดที่บนขวาให้ปุ่มแถวเดียว */
  .adv-mecha .adv-hp{width:80px}
  /* ปุ่มยูทิลิตี้แถวเดียวบนขวา (ซ้าย→ขวา: ทุกคน·เปิด·ปิด·แชท·?·ออก) — ระยะเดียวกับโลกขับรถที่พิสูจน์แล้วไม่ทับกัน */
  .adv-mecha #adv-exit{top:8px;right:8px;font-size:12px;padding:5px 9px;z-index:6}
  .adv-mecha #adv-help{top:8px;right:74px;width:30px;height:30px;font-size:14px;z-index:6}
  .adv-mecha #adv-chat-btn{top:8px;right:108px;font-size:12px;padding:5px 8px;z-index:6}
  .adv-mecha #adv-mic{top:8px;right:172px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  .adv-mecha #adv-spk{top:8px;right:224px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  .adv-mecha #adv-vmode{top:8px;right:276px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  .adv-mecha #adv-tmute{top:46px;right:8px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}    /* ปุ่มครู/podium (โชว์เฉพาะบางกรณี) แถวสองริมขวา */
  .adv-mecha #adv-podbtn{top:46px;right:100px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  /* 🗺️ รอบ 144: แผนที่ขยายเกือบเต็มจอ — แตะ minimap เปิด · โชว์ตำแหน่งตัวอักษรชัดเจน + ปุ่มปิดใหญ่ */
  #adv-bigmap{position:absolute;inset:10px;z-index:60;display:none;flex-direction:column;pointer-events:auto;
    background:rgba(6,12,24,.96);border:2px solid #4fc3f7;border-radius:16px;
    box-shadow:0 0 34px rgba(0,0,0,.65);overflow:hidden}
  #adv-bigmap.on{display:flex}
  #adv-bigmap-head{display:flex;align-items:center;justify-content:space-between;gap:10px;
    padding:8px 12px;flex:0 0 auto}
  #adv-bigmap-title{color:#8fd6ff;font-weight:800;font-size:clamp(14px,2.6vw,17px);text-shadow:0 1px 3px #000;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #adv-bigmap-title b{color:#ffd54f}
  #adv-bigmap-x{background:#e53935;color:#fff;border:2px solid #fff;border-radius:12px;font-family:inherit;
    font-weight:800;font-size:15px;padding:8px 18px;cursor:pointer;flex:0 0 auto}
  #adv-bigmap-x:active{background:#b71c1c}
  #adv-bigmap-cv{flex:1;width:100%;min-height:0}
  /* 🚔 รอบ 128: ป้ายเตือนขับเร็วผิดกฎหมาย — แดงกะพริบกลางบน */
  #adv-lawwarn{position:absolute;top:120px;left:50%;transform:translateX(-50%);display:none;z-index:7;
    background:rgba(160,20,20,.88);border:2px solid #ff6b5e;border-radius:14px;color:#fff;
    font-size:clamp(12px,2.6vw,15px);line-height:1.45;text-align:center;padding:8px 18px;max-width:92vw;
    box-shadow:0 0 18px rgba(255,60,40,.65);animation:lawBlink 1s ease-in-out infinite;pointer-events:none}
  @keyframes lawBlink{0%,100%{opacity:1}50%{opacity:.55}}
  /* 🚔 แผงเตรียมออกรถ — สวิตช์สไตล์เดียวกับหน้า setting (reuse .set-switch จาก style.css) */
  #adv-carstart{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;z-index:8;
    width:min(420px,92vw);box-sizing:border-box;background:rgba(10,22,42,.93);border:2px solid #4fc3f7;
    border-radius:20px;padding:16px 20px 18px;color:#e6f3ff;pointer-events:auto;
    box-shadow:0 0 30px rgba(79,195,247,.4)}
  #adv-carstart h3{margin:0 0 10px;text-align:center;font-size:20px;color:#8fd6ff}
  /* รอบ 148: ภาพตัวละครที่เลือกนั่งในรถ — โชว์เฉพาะมีไฟล์จริง (โหลดสำเร็จ) */
  #cs-avatar{display:none;margin:0 auto 8px;max-height:min(100px,18vh);max-width:82%;border-radius:12px}
  #adv-carstart .cs-row{display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:10px 2px;border-bottom:1px dashed rgba(120,180,230,.35)}
  #adv-carstart .cs-lab{font-size:15.5px;font-weight:700}
  #adv-carstart .cs-lab small{display:block;font-size:11.5px;font-weight:400;color:#9ec8e8;margin-top:2px}
  #cs-go{display:block;margin:14px auto 0;background:linear-gradient(135deg,#43a047,#2e7d32);color:#fff;
    border:0;border-radius:14px;font-family:inherit;font-weight:800;font-size:18px;padding:11px 34px;cursor:pointer}
  #cs-go:disabled{background:#4a5a6a;opacity:.6;cursor:default}
  /* 🚔 แผงกฎหมายพื้นฟ้า sci-fi (สไตล์กระจกเรือง + scanline แบบแผงสถานะรอบ 63) */
  /* รอบ 146: ยืดกว้าง 94vw + กฎหมาย 3 ก้อนเรียง 3 คอลัมน์ → เตี้ยพอใส่ปุ่มรับทราบไม่มี scrollbar */
  #adv-lawinfo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;z-index:9;
    width:min(94vw,920px);max-height:92vh;overflow-y:auto;box-sizing:border-box;pointer-events:auto;
    background:linear-gradient(160deg,rgba(14,52,96,.96),rgba(8,30,60,.96));
    border:2px solid #56c8ff;border-radius:18px;padding:12px 18px 14px;color:#dff2ff;
    box-shadow:0 0 34px rgba(86,200,255,.5),inset 0 0 60px rgba(86,200,255,.08);
    font-size:13.5px;line-height:1.55}
  #adv-lawinfo .li-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-items:stretch}
  #adv-lawinfo:before{content:'';position:absolute;inset:0;border-radius:16px;pointer-events:none;
    background:repeating-linear-gradient(0deg,rgba(140,220,255,.05) 0 2px,transparent 2px 5px)}
  #adv-lawinfo h3{margin:0 0 8px;color:#7fe0ff;font-size:17.5px;text-align:center;
    text-shadow:0 0 12px rgba(127,224,255,.7)}
  #adv-lawinfo .li-sec{margin:8px 0;padding:8px 11px;border-left:3px solid #56c8ff;
    background:rgba(86,200,255,.08);border-radius:0 10px 10px 0}
  #adv-lawinfo .li-grid .li-sec{margin:0}
  #adv-lawinfo .li-ok{display:block;margin:12px auto 0;background:linear-gradient(135deg,#29b6f6,#0288d1);
    color:#fff;border:0;border-radius:12px;font-family:inherit;font-weight:800;font-size:16px;
    padding:10px 30px;cursor:pointer}
  /* กล่องแจ้งโดนปรับ (ใช้ทั้งเข็มขัด + สรุปใบสั่งตอนออก) */
  .adv-lawnotice{position:fixed;inset:0;z-index:130;background:rgba(8,10,18,.72);
    display:flex;align-items:center;justify-content:center;font-family:inherit}
  .adv-lawnotice .ln-box{width:min(400px,92vw);box-sizing:border-box;background:#fff;border-radius:18px;
    border:3px solid #e53935;padding:18px 20px;text-align:center;color:#39414d;font-size:15.5px;line-height:1.6}
  .adv-lawnotice .ln-box b{color:#c62828}
  .adv-lawnotice button{margin-top:14px;background:#e53935;color:#fff;border:0;border-radius:12px;
    font-family:inherit;font-weight:800;font-size:16px;padding:10px 30px;cursor:pointer}
  /* 💨 ป๊อปโบนัสบินเฉียด (heli/drone) — เด้งขึ้นจางหายเหนือ crosshair */
  #adv-nearmiss{top:43%;left:50%;transform:translateX(-50%);pointer-events:none;opacity:0;z-index:6;
    color:#fff;font-weight:900;font-size:clamp(15px,3.6vw,21px);text-shadow:0 2px 6px #000;white-space:nowrap;
    background:rgba(0,0,0,.42);border-radius:12px;padding:4px 15px}
  #adv-nearmiss .nm-coin{color:#ffd54f}
  #adv-nearmiss .nm-rec{color:#8ef7a5;font-size:.82em;text-shadow:0 0 8px rgba(142,247,165,.8)}
  #adv-nearmiss.show{animation:advNm 1.15s ease-out}
  @keyframes advNm{0%{opacity:0;transform:translate(-50%,8px) scale(.8)}
    15%{opacity:1;transform:translate(-50%,-4px) scale(1.1)}
    30%{transform:translate(-50%,-10px) scale(1)}
    78%{opacity:1;transform:translate(-50%,-24px)}
    100%{opacity:0;transform:translate(-50%,-38px)}}
  /* 🔥 คอมโบร้อน: ป๊อปเรืองแสงส้ม/แดง + ตัวใหญ่ขึ้น */
  #adv-nearmiss.combo-hot{background:rgba(60,20,0,.55);color:#ffe0a3;
    text-shadow:0 0 10px rgba(255,140,20,.9),0 2px 5px #000;box-shadow:0 0 18px rgba(255,120,20,.6)}
  #adv-nearmiss.combo-fire{background:rgba(70,10,0,.6);color:#ffd0a0;font-size:clamp(17px,4.2vw,25px);
    text-shadow:0 0 14px rgba(255,80,10,1),0 2px 6px #000;box-shadow:0 0 26px rgba(255,70,10,.8)}
  #adv-nearmiss.combo-fire .nm-coin{color:#fff2b0}
  /* ไฟลุกวาบขอบจอตอนคอมโบร้อน (ไม่บังนิ้ว) */
  #adv-combofx{position:absolute;inset:0;pointer-events:none;z-index:5;opacity:0}
  #adv-combofx.on.lv1{animation:advCombo .7s ease-out;
    background:radial-gradient(ellipse at center,transparent 52%,rgba(255,160,30,.5))}
  #adv-combofx.on.lv2{animation:advCombo .85s ease-out;
    background:radial-gradient(ellipse at center,transparent 44%,rgba(255,70,10,.72))}
  @keyframes advCombo{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
  #adv-inst{top:34px;left:50%;transform:translateX(-50%);color:#fff;font-weight:800;font-size:13px;
    text-shadow:0 1px 3px #000;background:rgba(0,0,0,.4);border-radius:10px;padding:2px 12px;display:none;white-space:nowrap}
  .adv-heli #adv-inst{display:block}
  #adv-warn{top:60px;left:50%;transform:translateX(-50%);display:none;color:#fff;font-weight:900;font-size:15px;
    background:rgba(198,40,40,.92);border:2px solid #fff;border-radius:12px;padding:3px 14px;white-space:nowrap;
    text-shadow:0 1px 3px #000}
  #adv-warn.warn1{animation:advWarnBlink 1s infinite}
  #adv-warn.warn2{animation:advWarnBlink .5s infinite}
  #adv-warn.warn3{animation:advWarnBlink .22s infinite;background:rgba(255,23,23,.98);font-size:17px}
  @keyframes advWarnBlink{0%,100%{opacity:1}50%{opacity:.35}}
  /* 🚦 รอบ 182: ป้ายเตือนใกล้ทางแยก (เปิดไฟเลี้ยว) — แถบเหลืองอำพันบนกลางจอ กะพริบเบาๆ */
  #adv-junc{top:96px;left:50%;transform:translateX(-50%);display:none;z-index:6;
    color:#241a00;font-weight:900;font-size:13.5px;white-space:nowrap;
    background:linear-gradient(180deg,#ffe08a,#ffc23d);border:2px solid #fff;border-radius:12px;
    padding:4px 15px;box-shadow:0 3px 12px rgba(120,80,0,.4);animation:juncBlink .9s infinite}
  @keyframes juncBlink{0%,100%{opacity:1}50%{opacity:.55}}
  /* 🚦 รอบ 185: แสงไฟเลี้ยวส้มกระพริบมุมบนซ้าย/ขวา (ตรงตำแหน่งลูกศร) — โชว์ตอนเปิดไฟเลี้ยวฝั่งนั้น */
  .adv-tlglow{position:absolute;top:0;width:34vw;max-width:230px;height:46vh;pointer-events:none;
    display:none;opacity:0;z-index:5}
  #adv-tlglow-l{left:0;background:radial-gradient(120% 88% at 0% 20%,rgba(255,160,30,.9),rgba(255,120,0,.34) 40%,transparent 72%)}
  #adv-tlglow-r{right:0;background:radial-gradient(120% 88% at 100% 20%,rgba(255,160,30,.9),rgba(255,120,0,.34) 40%,transparent 72%)}
  .adv-tlglow.on{display:block;animation:tlGlowBlink .8s steps(1,end) infinite}
  @keyframes tlGlowBlink{0%{opacity:.95}50%{opacity:0}100%{opacity:.95}}
  /* 🚦 รอบ 187 (A3): แสงสะท้อนบนกระจก/ฝากระโปรง — แถบส้มด้านล่าง blend screen ให้เหมือนแสงสะท้อน */
  .adv-tlreflect{position:absolute;bottom:0;width:54vw;max-width:440px;height:36vh;pointer-events:none;
    display:none;opacity:0;z-index:4;mix-blend-mode:screen}
  #adv-tlreflect-l{left:0;background:radial-gradient(88% 72% at 10% 100%,rgba(255,150,25,.62),rgba(255,120,0,.18) 46%,transparent 74%)}
  #adv-tlreflect-r{right:0;background:radial-gradient(88% 72% at 90% 100%,rgba(255,150,25,.62),rgba(255,120,0,.18) 46%,transparent 74%)}
  .adv-tlreflect.on{display:block;animation:tlGlowBlink .8s steps(1,end) infinite}
  /* 🌧️☀️ ชั้น "บนกระจก" — ที่ปัดน้ำฝน + แสงแดดสาด
     ⚠️ ต้องอยู่ "ใต้" กรอบค็อกพิต (z3) เพื่อให้เสา/หลังคาบังได้เอง แต่ "เหนือ" โลก 3D (canvas ไม่มี z-index) */
  #adv-glass{position:absolute;inset:0;pointer-events:none;display:none;z-index:2}
  .adv-heli #adv-glass{display:block}
  #adv-cockpit{position:absolute;inset:0;pointer-events:none;display:none;z-index:3}
  .adv-heli #adv-cockpit{display:block}
  /* 🚁 กรอบค็อกพิตเต็มจอ — ช่องกระจกในไฟล์ png โปร่งใส จึงมองทะลุเห็นโลก 3D ผ่านกระจกจริงๆ
     ⚠️ ใช้ background-image ไม่ใช่ <img> เพราะต้องคุมสเกล/ตำแหน่งเองให้ตรงกับ cpMap (ปรับมุมนั่งได้) */
  #adv-cockpit{background-repeat:no-repeat}
  /* canvas เข็ม: ทับกรอบพอดีเป๊ะ วาดด้วยพิกัดในภาพผ่าน transform */
  #adv-gauges{position:absolute;inset:0;width:100%;height:100%;
    pointer-events:none;display:none;z-index:4}
  .adv-heli #adv-gauges{display:block}
  #adv-radio{position:absolute;bottom:calc(1vh + 14vh);left:50%;transform:translateX(-50%);max-width:82vw;
    pointer-events:none;display:none;z-index:5;background:rgba(6,14,8,.78);color:#8ef7a5;
    border:1px solid rgba(142,247,165,.45);border-radius:10px;padding:5px 14px;
    font-size:13.5px;font-weight:700;letter-spacing:.3px;text-shadow:0 0 7px rgba(142,247,165,.7);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #adv-radio.show{display:block;animation:advRadioIn .25s ease-out}
  @keyframes advRadioIn{0%{opacity:0;transform:translateX(-50%) translateY(8px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}
  #adv-reply{position:absolute;bottom:calc(1vh + 14vh + 40px);left:50%;transform:translateX(-50%);
    display:none;z-index:5;text-align:center;pointer-events:auto}
  #adv-reply.show{display:block;animation:advRadioIn .25s ease-out}
  .adv-reply-hint{color:#d7ffe2;font-size:12px;font-weight:700;text-shadow:0 1px 4px #000;margin-bottom:5px;
    background:rgba(6,14,8,.6);border-radius:8px;padding:2px 10px;display:inline-block}
  .adv-reply-row{display:flex;gap:7px;justify-content:center;flex-wrap:wrap}
  .adv-rp{background:rgba(6,20,10,.88);color:#8ef7a5;border:1.5px solid rgba(142,247,165,.55);
    border-radius:11px;padding:5px 13px;font-family:inherit;font-weight:900;font-size:14px;line-height:1.15;
    text-shadow:0 0 6px rgba(142,247,165,.6)}
  .adv-rp small{display:block;color:#b8d9c2;font-size:10.5px;font-weight:600;text-shadow:none}
  .adv-rp:active{background:rgba(142,247,165,.25)}
  /* ไม่มีภาพ (ยังไม่เจนจาก PROMPTS_HELI.md) → cockpit จำลองด้วย CSS: แผงหน้าปัด+เสากรอบ */
  #adv-cockpit .cp-css{height:15vh;background:linear-gradient(180deg,#2a2f38,#14171d);
    border-top:4px solid #3d4450;border-radius:24px 24px 0 0;margin:0 -2vw;position:relative}
  #adv-cockpit .cp-css:before{content:'';position:absolute;left:50%;top:-11vh;transform:translateX(-50%);
    width:3vw;height:11vh;background:linear-gradient(180deg,rgba(40,44,52,.0),#2a2f38);border-radius:8px}
  #adv-cockpit .cp-dash{position:absolute;top:10px;left:50%;transform:translateX(-50%);
    display:flex;gap:14px;color:#8fe3a0;font-weight:800;font-size:12px;font-family:monospace}
  #adv-cockpit .cp-dash span{background:#0d0f13;border:2px solid #3d4450;border-radius:8px;padding:3px 10px}
  #adv-hint{bottom:8px;right:8px;color:#fff;font-size:11px;text-shadow:0 1px 3px #000;text-align:right;opacity:.85}
  .adv-touch #adv-hint{display:none}
  #adv-chat-btn{position:absolute;top:160px;right:8px;pointer-events:auto;background:rgba(33,150,243,.92);
    color:#fff;border:2px solid #fff;border-radius:12px;font-weight:800;font-size:14px;padding:7px 12px;font-family:inherit}
  .adv-vbtn{position:absolute;right:8px;pointer-events:auto;background:rgba(67,160,71,.92);color:#fff;
    border:2px solid #fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;font-family:inherit;min-width:86px}
  .adv-vbtn.v-off{background:rgba(97,97,97,.92)}
  .adv-vbtn.v-lock{background:rgba(230,126,34,.92)}
  #adv-mic{top:202px} #adv-spk{top:242px} #adv-vmode{top:282px;background:rgba(123,31,162,.92)}
  #adv-tmute{top:322px;background:rgba(198,40,40,.92);display:none}
  #adv-tmute.v-muting{background:rgba(46,125,50,.92)}
  #adv-podbtn{top:362px;background:rgba(249,168,37,.95);color:#5d3a00;display:none}
  #adv-podium{position:absolute;inset:0;display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.74);z-index:8;pointer-events:auto}
  #adv-podium.on{display:flex}
  .adv-pd-box{text-align:center;max-width:88vw}
  .adv-pd-title{color:#ffd54f;font-weight:900;font-size:20px;text-shadow:0 2px 6px #000;margin-bottom:14px}
  .adv-pd-row{display:flex;align-items:flex-end;gap:12px;justify-content:center}
  .adv-pd-col{display:flex;flex-direction:column;align-items:center;gap:6px;animation:advPdRise .7s ease-out}
  .adv-pd-name{color:#fff;font-weight:800;font-size:15px;text-shadow:0 1px 4px #000;max-width:120px;
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .adv-pd-name small{color:#ffe082;font-weight:700;white-space:normal}
  .adv-pd-stand{width:92px;border-radius:9px 9px 0 0;color:rgba(0,0,0,.55);font-weight:900;font-size:26px;
    display:flex;align-items:center;justify-content:center}
  .adv-pd-stand.s0{background:linear-gradient(180deg,#ffe082,#f9a825)}
  .adv-pd-stand.s1{background:linear-gradient(180deg,#e8e8e8,#9e9e9e)}
  .adv-pd-stand.s2{background:linear-gradient(180deg,#ffab91,#8d6e63)}
  .adv-pd-me{margin-top:14px;color:#8ef7a5;font-weight:900;font-size:17px;text-shadow:0 1px 4px #000}
  .adv-pd-hint{display:block;margin-top:8px;color:#ccc;font-size:11px}
  @keyframes advPdRise{0%{opacity:0;transform:translateY(42px)}100%{opacity:1;transform:translateY(0)}}
  #adv-chat-box{position:absolute;bottom:56px;left:50%;transform:translateX(-50%);display:none;flex-direction:column;gap:6px;
    background:rgba(0,0,0,.6);border-radius:14px;padding:8px;pointer-events:auto;width:min(420px,86vw)}
  .adv-chat-row{display:flex;gap:6px}
  #adv-quick{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}
  .adv-qc{background:rgba(255,255,255,.92);border:none;border-radius:9px;padding:5px 10px;
    font-size:13px;font-weight:700;font-family:inherit;color:#333}
  .adv-qc:active{background:#ffe082}
  #adv-chat-input{flex:1;border:none;border-radius:9px;padding:8px 10px;font-size:15px;font-family:inherit;outline:none}
  #adv-chat-send{background:#43a047;color:#fff;border:none;border-radius:9px;font-weight:800;font-size:14px;
    padding:8px 14px;font-family:inherit}
  #adv-selfmsg{position:absolute;bottom:96px;left:50%;transform:translateX(-50%);max-width:70vw;
    background:rgba(255,255,255,.95);color:#333;border-radius:14px;padding:5px 13px;font-size:14px;font-weight:600;
    display:none;pointer-events:none}
  #adv-selfmsg.on{display:block}
  .adv-haunt #adv-selfmsg{background:rgba(8,8,20,.92);color:#7cffb0;border:1px solid rgba(124,255,176,.6);
    text-shadow:0 0 8px rgba(124,255,176,.8)}
  .adv-haunt .adv-qc{background:rgba(20,20,38,.95);color:#7cffb0;border:1px solid rgba(124,255,176,.4)}
  /* ❓ ปุ่มวิธีเล่น (ซ้ายมินิแมป) + การ์ดวิธีเล่นตอนเข้าโลกครั้งแรก — โชว์คอนโทรลจอสัมผัสที่เดิมมือถือไม่มีบอกเลย */
  #adv-help{top:8px;right:132px;pointer-events:auto;background:rgba(0,0,0,.5);color:#fff;
    border:2px solid rgba(255,255,255,.82);border-radius:50%;width:36px;height:36px;
    font-size:17px;font-weight:900;font-family:inherit;line-height:1;padding:0}
  #adv-help:active{background:rgba(255,255,255,.25)}
  #adv-intro{position:absolute;inset:0;z-index:12;display:none;align-items:center;justify-content:center;
    background:rgba(4,8,16,.82);pointer-events:auto;padding:12px;overflow:auto}
  #adv-intro.on{display:flex;animation:advIntroIn .28s ease-out}
  @keyframes advIntroIn{0%{opacity:0}100%{opacity:1}}
  .adv-intro-card{background:linear-gradient(180deg,rgba(24,32,48,.98),rgba(12,16,28,.98));
    border:2px solid rgba(120,200,255,.55);border-radius:20px;padding:14px 20px;max-width:min(640px,94vw);
    box-shadow:0 8px 40px rgba(0,0,0,.6),0 0 30px rgba(80,160,255,.25);text-align:center;max-height:96vh;overflow:auto}
  .adv-intro-emoji{font-size:34px;line-height:1;margin-bottom:0}
  .adv-intro-card h2{color:#fff;font-size:19px;font-weight:900;margin:0 0 10px;text-shadow:0 2px 6px #000}
  .adv-intro-body{display:flex;gap:16px;text-align:left;margin-bottom:12px}
  .adv-intro-side{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:9px;justify-content:center}
  .adv-intro-goal{color:#dbe8ff;font-size:13.5px;line-height:1.45;margin:0;
    background:rgba(80,140,255,.14);border-radius:12px;padding:8px 12px}
  .adv-intro-goal b{color:#ffe082}
  .adv-intro-ctrl-h{color:#8fd4ff;font-size:12.5px;font-weight:800;letter-spacing:.3px;text-align:left;margin:0}
  .adv-intro-list{list-style:none;margin:0;padding:0;text-align:left;display:flex;flex-direction:column;gap:7px}
  .adv-intro-list li{display:flex;align-items:center;gap:10px;color:#eef4ff;font-size:13px;line-height:1.32}
  .adv-intro-list .ic{flex:0 0 32px;height:32px;display:flex;align-items:center;justify-content:center;
    font-size:17px;background:rgba(255,255,255,.08);border-radius:9px}
  .adv-intro-list b{color:#ffe082}
  .adv-intro-tip{color:#bcd0e8;font-size:12px;line-height:1.4;margin:0}
  .adv-intro-tip b{color:#ffe082}
  @media (max-width:560px){.adv-intro-body{flex-direction:column;gap:9px}}
  @media (max-height:430px){.adv-intro-emoji{font-size:26px}.adv-intro-card{padding:11px 18px}.adv-intro-card h2{font-size:17px;margin-bottom:8px}.adv-intro-body{margin-bottom:9px}}
  #adv-intro-go{background:linear-gradient(180deg,#5eb7ff,#2f7fe0);color:#fff;border:none;border-radius:14px;
    font-family:inherit;font-weight:900;font-size:17px;padding:11px 30px;box-shadow:0 4px 14px rgba(47,127,224,.55)}
  #adv-intro-go:active{transform:scale(.96)}
  .adv-haunt .adv-intro-card{border-color:rgba(124,255,176,.5);box-shadow:0 8px 40px rgba(0,0,0,.7),0 0 30px rgba(60,255,140,.2)}
  .adv-haunt .adv-intro-goal{background:rgba(40,255,140,.1)}
  .adv-haunt .adv-intro-ctrl-h{color:#7cffb0}
  .adv-haunt #adv-intro-go{background:linear-gradient(180deg,#3ddc84,#1f9e5a)}
  /* 📖 สมุดคำศัพท์รอบนี้ (ตอนออก/จบเกม) — ทบทวนคำที่ประกอบสำเร็จ */
  .adv-recap{margin:9px auto 2px;max-width:340px}
  .adv-recap-h{color:#ffe082;font-size:12.5px;font-weight:800;margin-bottom:5px;text-shadow:0 1px 3px #000}
  .adv-recap-list{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;max-height:96px;overflow-y:auto}
  .adv-recap-w{display:flex;flex-direction:column;align-items:center;line-height:1.15;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:9px;padding:3px 9px;
    color:#fff;font-weight:800;font-size:12.5px}
  .adv-recap-w small{color:#bcd0e8;font-weight:600;font-size:10.5px}
  .adv-haunt .adv-recap-w{background:rgba(40,255,140,.1);border-color:rgba(124,255,176,.3)}
  .adv-haunt .adv-recap-w small{color:#9fe8bf}
  /* ⚽ โหมดสนามฟุตบอล — ปุ่มเล็ง (ซ้าย) · ปุ่มเตะกดค้าง (ขวา) · แถบพลัง · ปุ่มสลับกล้อง · แผงเลือกชุด */
  .adv-soccer #adv-cross,.adv-soccer #adv-gauges,.adv-soccer #adv-cockpit{display:none}
  #adv-aimpad{position:absolute;display:none;left:16px;bottom:20px;width:150px;height:150px;z-index:6;
    pointer-events:none;-webkit-user-select:none;user-select:none}
  .adv-touch.adv-soccer #adv-aimpad{display:block}
  #adv-aimpad .apb{position:absolute;width:52px;height:52px;border-radius:14px;pointer-events:auto;
    background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.5);color:#fff;font-size:22px;
    display:flex;align-items:center;justify-content:center;touch-action:none}
  #adv-aimpad .apb:active{background:rgba(255,255,255,.4)}
  #adv-aimpad .ap-u{left:49px;top:0}#adv-aimpad .ap-d{left:49px;bottom:0}
  #adv-aimpad .ap-l{left:0;top:49px}#adv-aimpad .ap-r{right:0;top:49px}
  #adv-kick{position:absolute;display:none;bottom:26px;right:22px;width:88px;height:88px;border-radius:50%;
    z-index:6;pointer-events:auto;background:rgba(46,158,74,.92);border:3px solid #fff;color:#fff;
    font-size:20px;font-weight:900;line-height:1.05;flex-direction:column;align-items:center;justify-content:center;
    touch-action:none;-webkit-user-select:none;user-select:none}
  #adv-kick small{font-size:11px;font-weight:700}
  #adv-kick:active{transform:scale(.94)}
  .adv-touch.adv-soccer #adv-kick{display:flex}
  #adv-power{position:absolute;display:none;right:12px;top:50%;transform:translateY(-50%);width:20px;height:180px;
    z-index:6;background:rgba(0,0,0,.45);border:2px solid #fff;border-radius:12px;overflow:hidden;pointer-events:none}
  .adv-soccer #adv-power{display:block}
  #adv-power-fill{position:absolute;left:0;bottom:0;width:100%;height:0%;
    background:linear-gradient(0deg,#43a047,#ffd54f,#e53935);transition:height .04s linear}
  #adv-scam{position:absolute;display:none;top:56px;right:8px;z-index:6;pointer-events:auto;
    background:rgba(0,0,0,.5);color:#fff;border:2px solid #fff;border-radius:12px;
    font-family:inherit;font-weight:800;font-size:13px;padding:6px 10px}
  .adv-soccer #adv-scam{display:block}
  #adv-soccerstart{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;z-index:8;
    width:min(420px,92vw);box-sizing:border-box;background:rgba(10,30,20,.95);border:2px solid #43d17a;
    border-radius:20px;padding:16px 20px 18px;color:#e6fff0;pointer-events:auto;
    box-shadow:0 0 30px rgba(67,209,122,.4)}
  #adv-soccerstart.on{display:block}
  #adv-soccerstart h3{margin:0 0 12px;text-align:center;font-size:20px;color:#8fffc0}
  #adv-soccerstart .ss-lab{font-size:13.5px;font-weight:700;color:#a9e8c4;margin:8px 0 6px}
  #adv-soccerstart .ss-shirts{display:flex;flex-wrap:wrap;gap:9px;justify-content:center}
  #adv-soccerstart .ss-shirt{width:40px;height:40px;border-radius:10px;border:3px solid rgba(255,255,255,.35);
    cursor:pointer;padding:0}
  #adv-soccerstart .ss-shirt.sel{border-color:#fff;box-shadow:0 0 12px rgba(255,255,255,.7);transform:scale(1.08)}
  #adv-soccerstart .ss-num{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:4px}
  #adv-soccerstart .ss-num button{width:44px;height:44px;border-radius:12px;border:2px solid #43d17a;
    background:rgba(67,209,122,.16);color:#c9ffdf;font-size:24px;font-weight:900;font-family:inherit;cursor:pointer}
  #adv-soccerstart .ss-num button:active{transform:scale(.92)}
  #adv-soccerstart #ss-no{font-size:30px;font-weight:900;color:#fff;min-width:56px;text-align:center}
  #adv-soccerstart #ss-go{display:block;margin:16px auto 0;background:linear-gradient(135deg,#43a047,#2e7d32);
    color:#fff;border:0;border-radius:14px;font-family:inherit;font-weight:800;font-size:18px;padding:11px 34px;cursor:pointer}
  #adv-soccerstart #ss-go:active{transform:scale(.96)}
  /* 🪙 ป๊อปเหรียญตอนเตะโดนตัวอักษรที่ประกอบคำได้ — เด้งใหญ่แล้วลอยขึ้นจาง (หวือหวาเหมือนจับคู่คำศัพท์) */
  #adv-coinpop{position:absolute;inset:0;pointer-events:none;z-index:7;overflow:hidden}
  #adv-coinpop .sc-pop{position:absolute;transform:translate(-50%,-50%);font-weight:900;
    font-size:clamp(20px,4.4vw,30px);color:#ffdf4d;white-space:nowrap;
    text-shadow:0 0 10px rgba(255,190,30,.9),0 2px 5px #000;animation:scPop .9s ease-out forwards}
  @keyframes scPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}
    22%{opacity:1;transform:translate(-50%,-58%) scale(1.25)}
    38%{transform:translate(-50%,-62%) scale(1)}
    100%{opacity:0;transform:translate(-50%,-150%) scale(1)}}
  html.no-anim #adv-coinpop .sc-pop{animation:none;opacity:0}
  /* 🔠 ป้ายตอนเก็บตัวอักษร: โชว์ตัวอักษรตัวใหญ่ในวงกลม + เหรียญที่ได้ (รอบ 345) */
  #adv-coinpop .letter-pop{display:flex;align-items:center;gap:7px;font-size:clamp(15px,3vw,20px);
    color:#fff8d6;text-shadow:0 0 8px rgba(255,190,30,.85),0 2px 5px #000}
  #adv-coinpop .letter-pop b{display:inline-flex;align-items:center;justify-content:center;
    width:1.85em;height:1.85em;border-radius:50%;font-size:1.25em;line-height:1;
    background:radial-gradient(circle at 35% 28%,#fff3ad,#f7b733 62%,#c8801a);
    color:#4a2c00;border:2px solid #fff2c4;text-shadow:none;
    box-shadow:0 0 12px rgba(255,200,60,.85),0 2px 6px rgba(0,0,0,.5)}
  /* 🤖 โหมดหุ่นยนต์นักรบ — ปุ่มบังคับใสๆ (เดินหน้า/ถอย/หัน/ยิง) + ไฮไลต์ตัวอักษรตัวถัดไปที่ต้องยิง */
  .adv-mecha #adv-cross{width:26px;height:26px;background:none;border:2px solid rgba(120,230,255,.9);
    border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,.7),0 0 10px rgba(80,200,255,.5)}
  .adv-mecha #adv-cross:after{content:'';position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;
    transform:translate(-50%,-50%);background:rgba(140,240,255,.95)}
  .adv-mecha .adv-fch.mnext{background:rgba(80,200,255,.4);box-shadow:0 0 12px rgba(80,200,255,.8);
    outline:2px solid #7fe6ff}
  .mecha-btn{position:absolute;display:none;z-index:6;pointer-events:auto;-webkit-user-select:none;user-select:none;
    touch-action:none;background:rgba(120,200,255,.14);border:2px solid rgba(150,220,255,.5);color:#dff2ff;
    border-radius:16px;align-items:center;justify-content:center;font-size:26px;font-weight:800;backdrop-filter:blur(2px)}
  .mecha-btn:active{background:rgba(120,200,255,.34)}
  .adv-touch.adv-mecha .mecha-btn{display:flex}
  /* รอบ 220 (ผู้ใช้ · แก้ชนบนจอแคบ): 3 คลัสเตอร์แยกกันชัด — ◀▶ ซ้ายล่าง · ▲▼ ขวาล่าง · ปุ่มยิงกลางใต้คำ
     (รอบ 219 ปุ่มยิงใต้ตัวท้าย H ค่อนขวา → ชน ▲▼ ขวาล่างบนจอ ~480px · ย้ายปุ่มยิงมากลางจอ = ช่องกลางกว้างพอ ไม่ชนทั้ง 2 ฝั่ง) */
  #mecha-fwd{right:22px;bottom:104px;width:76px;height:70px}       /* ▲ เดินหน้า (ขวาล่าง) */
  #mecha-back{right:22px;bottom:24px;width:76px;height:70px}       /* ▼ ถอย (ขวาล่าง) */
  #mecha-left{left:22px;bottom:24px;width:70px;height:70px;border-radius:50%}    /* ◀ เลี้ยวซ้าย (ซ้ายล่าง) */
  #mecha-right{left:100px;bottom:24px;width:70px;height:70px;border-radius:50%}  /* ▶ เลี้ยวขวา (ซ้ายล่าง) */
  #mecha-fire{right:146px;top:186px;width:92px;height:92px;border-radius:50%;font-size:34px;
    background:rgba(255,90,110,.32);border-color:rgba(255,150,160,.7)}   /* รอบ 221 (ผู้ใช้): ย้ายไปขวา ให้อยู่คอลัมน์เดียวกับปุ่ม "ทุกคน"/vmode (right:162+ครึ่ง60 −ครึ่ง92 = right:146) */
  #mecha-fire2{left:24px;top:138px;width:84px;height:84px;border-radius:50%;font-size:30px;
    background:rgba(255,90,110,.32);border-color:rgba(255,150,160,.7)}   /* รอบ 223 (ผู้ใช้): ปุ่มยิงตัวที่ 2 ใต้ minimap ซ้าย (ยิงได้สองมือ) */
  #mecha-fire:active,#mecha-fire2:active{background:rgba(255,90,110,.55)}
  /* 🤖 รอบ 224: กรอบ HUD ห้องนักบินตามหุ่นแต่ละตัว (img/robots/hud/robotHUD_NN.png) + เอฟเฟกต์ไล่เฉดสี + ค่าตัวเลขเรียลไทม์
     --mh = สีประจำอาวุธของหุ่น (ตั้งตอนเข้าเกมจาก MECHA_WEAPONS) · กรอบเจาะกลางให้มองทะลุเห็นสนามรบ */
  #mecha-hud{position:absolute;inset:0;z-index:5;pointer-events:none;display:none;
    --mh:#7fe6ff;--mh-soft:rgba(127,230,255,.85)}
  .adv-mecha #mecha-hud{display:block}
  #mecha-hud .mh-frame{position:absolute;inset:0;background-size:cover;background-position:center;
    -webkit-mask-image:radial-gradient(ellipse 41% 53% at 50% 47%,transparent 55%,#000 80%);
            mask-image:radial-gradient(ellipse 41% 53% at 50% 47%,transparent 55%,#000 80%)}
  #mecha-hud .mh-tint{position:absolute;inset:0;mix-blend-mode:screen;opacity:.32;
    background:radial-gradient(ellipse 72% 72% at 50% 50%,transparent 40%,var(--mh) 125%)}
  #mecha-hud .mh-sweep{position:absolute;inset:0;mix-blend-mode:screen;opacity:.5;
    background:linear-gradient(115deg,transparent 40%,var(--mh-soft) 50%,transparent 60%);
    background-size:260% 100%;animation:mhSweep 5.5s linear infinite}
  @keyframes mhSweep{0%{background-position:180% 0}100%{background-position:-90% 0}}
  #mecha-hud .mh-scan{position:absolute;inset:0;opacity:.12;
    background:repeating-linear-gradient(0deg,transparent 0 2px,#000 2px 3px)}
  html.no-anim #mecha-hud .mh-sweep{animation:none;opacity:.28}
  /* แถบเทเลเมทรีบาง ๆ กลางล่าง (โซนเดียวที่ปลอดปุ่มทุกจอ — ต่ำกว่าปุ่มยิงกลาง เหนือ ◀▶/▲▼ ไม่ชน) */
  #mecha-hud .mh-tele{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);
    display:flex;gap:5px;flex-wrap:nowrap;justify-content:center;max-width:96vw;pointer-events:none}
  #mecha-hud .mh-chip{display:flex;align-items:center;gap:4px;padding:2px 8px;border-radius:14px;
    background:linear-gradient(160deg,rgba(6,16,26,.74),rgba(4,10,18,.56));border:1px solid var(--mh);
    box-shadow:0 0 9px rgba(0,0,0,.45),inset 0 0 8px rgba(0,0,0,.35);white-space:nowrap;
    font-family:'Segoe UI',system-ui,sans-serif;color:#dff5ff;text-shadow:0 0 5px rgba(0,0,0,.7)}
  #mecha-hud .mh-chip span{opacity:.68;font-size:8.5px;font-weight:700;letter-spacing:1px}
  #mecha-hud .mh-chip i{opacity:.6;font-size:8.5px;font-style:normal}
  #mecha-hud .mh-chip b{font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums;
    color:var(--mh);text-shadow:0 0 7px var(--mh)}
  #mecha-hud .mh-id{background:linear-gradient(160deg,rgba(10,22,34,.82),rgba(6,14,24,.66))}
  #mecha-hud .mh-id b{background:linear-gradient(90deg,var(--mh),#fff,var(--mh));background-size:200% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
    letter-spacing:1.5px;animation:mhShine 3.4s linear infinite;text-shadow:none}
  @keyframes mhShine{0%{background-position:0 0}100%{background-position:200% 0}}
  html.no-anim #mecha-hud .mh-id b{animation:none;-webkit-text-fill-color:var(--mh);color:var(--mh)}
  #mecha-hud .mh-bar{width:30px;height:7px;border-radius:4px;background:rgba(255,255,255,.13);
    overflow:hidden;box-shadow:inset 0 0 3px rgba(0,0,0,.6)}
  #mecha-hud .mh-bar i{display:block;height:100%;width:0;border-radius:4px;transition:width .18s ease;font-size:0}
  #mecha-hud .mh-heat i{background:linear-gradient(90deg,#ffd24d,#ff5a3a)}
  /* ป้าย "ล็อกเป้า" ใต้เป้าเล็ง (โผล่เมื่อเล็งตรงตัวอักษรตัวถัดไป) */
  #mecha-hud .mh-lock{position:absolute;top:calc(50% + 26px);left:50%;transform:translateX(-50%);
    display:none;padding:2px 10px;border-radius:12px;font-family:'Segoe UI',system-ui,sans-serif;
    font-size:11px;font-weight:800;letter-spacing:1.5px;white-space:nowrap;color:#fff;
    background:rgba(8,16,26,.55);border:1px solid var(--mh);text-shadow:0 0 6px var(--mh);
    box-shadow:0 0 12px var(--mh)}
  #mecha-hud.locked .mh-lock{display:block;animation:mhBlink 1s steps(1) infinite}
  @keyframes mhBlink{50%{opacity:.35}}
  html.no-anim #mecha-hud.locked .mh-lock{animation:none}
  /* 🤖 รอบ 225: เรดาร์เข็มกวาดกลางจอ (ชี้ทิศเอเลี่ยน · เจาะกลางไว้ไม่บังเป้าเล็ง) */
  #mecha-hud .mh-radar{position:absolute;left:50%;top:50%;width:150px;height:150px;
    transform:translate(-50%,-50%);pointer-events:none}
  #mecha-hud .mh-rr{position:absolute;inset:2px;border-radius:50%;border:1px solid var(--mh);opacity:.28}
  #mecha-hud .mh-rr2{inset:28px;opacity:.2}
  #mecha-hud .mh-rsweep{position:absolute;inset:0;border-radius:50%;opacity:.5;
    background:conic-gradient(from 0deg,transparent 0deg 322deg,var(--mh) 356deg,transparent 360deg);
    -webkit-mask:radial-gradient(circle,transparent 24%,#000 26%);mask:radial-gradient(circle,transparent 24%,#000 26%);
    animation:mhRadar 3.2s linear infinite}
  @keyframes mhRadar{to{transform:rotate(360deg)}}
  html.no-anim #mecha-hud .mh-rsweep{animation:none;opacity:.32}
  #mecha-hud .mh-blip{position:absolute;left:75px;top:75px;width:7px;height:7px;border-radius:50%;
    background:var(--mh);box-shadow:0 0 7px var(--mh);transform:translate(-50%,-50%);display:none}
  #mecha-hud .mh-blip.boss{width:12px;height:12px;background:#ff3b6b;box-shadow:0 0 10px #ff3b6b}
  #mecha-hud .mh-blip.tgt{width:11px;height:11px;background:#fff;box-shadow:0 0 10px var(--mh),0 0 4px #fff;
    animation:mhBlip .7s ease-in-out infinite}
  @keyframes mhBlip{50%{transform:translate(-50%,-50%) scale(1.5)}}
  html.no-anim #mecha-hud .mh-blip.tgt{animation:none}
  /* 🔥 โอเวอร์ฮีต — ปืนล็อกชั่วคราวเมื่อ HEAT เต็ม */
  #mecha-hud.overheat .mh-heatchip{border-color:#ff5a3a;animation:mhBlink .5s steps(1) infinite}
  #mecha-hud.overheat .mh-heat i{background:#ff3b3b}
  #mecha-hud.overheat #mh-heatlbl{color:#ff8a6a;opacity:1;letter-spacing:.5px}
  html.no-anim #mecha-hud.overheat .mh-heatchip{animation:none}
  /* 🚨 กะพริบแดง + เตือน เมื่อโดนเอเลี่ยนโจมตี / พลังงานต่ำ */
  #mecha-hud .mh-alarm{position:absolute;inset:0;pointer-events:none;opacity:0;
    background:radial-gradient(ellipse 75% 75% at 50% 50%,transparent 42%,rgba(255,40,40,.6) 118%)}
  #mecha-hud.hit .mh-alarm{animation:mhHit .5s ease-out}
  @keyframes mhHit{0%{opacity:.95}100%{opacity:0}}
  #mecha-hud.lowhp .mh-alarm{opacity:.3;animation:mhLow 1.1s ease-in-out infinite}
  @keyframes mhLow{50%{opacity:.55}}
  html.no-anim #mecha-hud.hit .mh-alarm,html.no-anim #mecha-hud.lowhp .mh-alarm{animation:none;opacity:0}
  /* 👾 รอบ 227: แถบพลังบอส (บนกลาง · โผล่เฉพาะตอนมีบอส · โซน y44-70 ปลอดปุ่ม) */
  #mecha-hud .mh-boss{position:absolute;top:44px;left:132px;display:none;
    align-items:center;gap:6px;padding:2px 9px;border-radius:13px;max-width:200px;
    background:linear-gradient(160deg,rgba(40,6,16,.8),rgba(24,4,12,.66));border:1px solid #ff3b6b;
    box-shadow:0 0 12px rgba(255,59,107,.5);font-family:'Segoe UI',system-ui,sans-serif}
  #mecha-hud.bosson .mh-boss{display:flex}
  #mecha-hud .mh-boss-ttl{font-size:10px;font-weight:800;letter-spacing:.5px;color:#ff7a9c;text-shadow:0 0 6px #ff3b6b;white-space:nowrap}
  #mecha-hud .mh-boss-bar{width:clamp(78px,26vw,120px);height:9px}
  #mecha-hud .mh-boss-bar i{background:linear-gradient(90deg,#ff3b6b,#ff9a3a);width:100%}
  /* 🔥 คอมโบ — ป๊อปกลางบน (ใต้คำ เหนือเป้าเล็ง) */
  #mecha-hud .mh-combo{position:absolute;top:104px;left:50%;transform:translateX(-50%);
    font-family:'Segoe UI',system-ui,sans-serif;font-weight:900;white-space:nowrap;opacity:0;
    color:#fff;text-shadow:0 0 10px var(--mh),0 1px 3px #000}
  #mecha-hud .mh-combo.pop{animation:mhCombo .8s ease-out}
  @keyframes mhCombo{0%{opacity:0;transform:translateX(-50%) scale(.6)}25%{opacity:1;transform:translateX(-50%) scale(1.12)}
    45%{transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(1)}}
  html.no-anim #mecha-hud .mh-combo.pop{animation:none;opacity:0}
  /* 🛡️ โล่พลังงาน — บับเบิลเรืองรอบจอตอนกันกระสุน */
  #mecha-hud .mh-shield{position:absolute;inset:0;pointer-events:none;opacity:0;border-radius:0;
    background:radial-gradient(ellipse 74% 74% at 50% 50%,transparent 48%,rgba(120,220,255,.28) 96%,rgba(160,240,255,.5) 118%);
    box-shadow:inset 0 0 60px rgba(120,220,255,.4)}
  #mecha-hud.shielded .mh-shield{opacity:1;animation:mhShield .9s ease-in-out infinite}
  @keyframes mhShield{50%{opacity:.55}}
  html.no-anim #mecha-hud.shielded .mh-shield{animation:none;opacity:.8}
  /* 🔫 รอบ 228: ปุ่มยิงเปลี่ยนสีตามสถานะ (feedback) — โอเวอร์ฮีต/คอมโบ/ร้อน/โล่ */
  #mecha-fire.fs-hot,#mecha-fire2.fs-hot{background:rgba(255,150,60,.4);border-color:rgba(255,190,120,.85)}
  #mecha-fire.fs-over,#mecha-fire2.fs-over{background:rgba(255,60,60,.5);border-color:#ff5a5a;
    box-shadow:0 0 14px rgba(255,60,60,.7);animation:mhBlink .5s steps(1) infinite}
  #mecha-fire.fs-combo,#mecha-fire2.fs-combo{background:rgba(255,205,70,.45);border-color:#ffd24d;
    box-shadow:0 0 16px rgba(255,210,80,.8)}
  #mecha-fire.fs-shield,#mecha-fire2.fs-shield{background:rgba(120,215,255,.45);border-color:#8fe6ff;
    box-shadow:0 0 16px rgba(120,215,255,.75)}
  html.no-anim #mecha-fire.fs-over,html.no-anim #mecha-fire2.fs-over{animation:none}
  /* 📊 รอบ 228: บรรทัดสถิติในหน้าจบเกม */
  .adv-ko-stat{margin:6px auto 2px;padding:5px 10px;border-radius:10px;font-size:13px;font-weight:700;
    color:#ffe9a8;background:rgba(255,180,60,.14);border:1px solid rgba(255,200,90,.4);display:inline-block}
  /* 🧭 GPS นำทาง (โหมดขับรถ) — การ์ดสไตล์ Google Maps: ลูกศรชี้ + คำสั่งเลี้ยว + ระยะทาง + ตัวอักษรเป้า */
  #adv-gps{position:absolute;display:none;left:8px;top:150px;z-index:6;pointer-events:none;
    background:linear-gradient(160deg,rgba(20,120,86,.95),rgba(10,78,58,.96));
    border:2px solid #35d17e;border-radius:14px;padding:8px 12px 9px;min-width:130px;color:#eafff4;
    box-shadow:0 4px 16px rgba(0,0,0,.42)}
  .adv-drive #adv-gps{display:block}
  #adv-gps .gps-top{display:flex;align-items:center;gap:9px}
  #adv-gps .gps-arrow{font-size:26px;line-height:1;display:inline-block;transition:transform .3s ease;
    color:#8effc4;filter:drop-shadow(0 0 5px rgba(80,255,170,.75))}
  #adv-gps .gps-turn{font-size:15px;font-weight:800;white-space:nowrap}
  #adv-gps .gps-bot{display:flex;align-items:baseline;gap:8px;margin-top:4px}
  #adv-gps .gps-bot b{font-size:22px;color:#ffe082;line-height:1}
  #adv-gps .gps-lab{font-size:11px;color:#bfe8d4;font-weight:700}
  #adv-gps .gps-dist{font-size:14px;font-weight:800;color:#dffbee;margin-left:auto}
  /* จอเตี้ย: ย้าย GPS ลงนิดไม่ให้ชนแถวปุ่มบน */
  @media (max-height:430px){ #adv-gps{top:138px;padding:6px 10px} #adv-gps .gps-arrow{font-size:22px} }`;
  document.head.appendChild(st);

  overlayEl=document.createElement('div');
  overlayEl.id='adv-overlay';
  overlayEl.innerHTML=`
    <canvas id="adv-canvas"></canvas>
    <div class="adv-hud" id="adv-topbar"><div class="adv-hp"><div class="adv-hp-fill" id="adv-hp"></div></div><span id="adv-coin"></span></div>
    <div class="adv-hud" id="adv-board"></div>
    <div class="adv-hud" id="adv-words"></div>
    <canvas class="adv-hud" id="adv-map" width="120" height="120"></canvas>
    <button class="adv-hud" id="adv-exit">🚪 ออก</button>
    <button class="adv-hud" id="adv-help">❓</button>
    <div class="adv-hud" id="adv-hunt"></div>
    <div class="adv-hud" id="adv-hearts"></div>
    <div class="adv-hud" id="adv-survive"></div>
    <div class="adv-hud" id="adv-inst"></div>
    <div class="adv-hud" id="adv-warn"></div>
    <div class="adv-hud" id="adv-junc">⚠️ ใกล้ทางแยก! เปิดไฟเลี้ยว ⬅️ ➡️ ก่อนเข้าแยก · ไม่งั้นปรับ 🪙5</div>
    <div id="adv-gps">
      <div class="gps-top"><span class="gps-arrow" id="gps-arrow">▲</span><span class="gps-turn" id="gps-turn">ตรงไป</span></div>
      <div class="gps-bot"><span class="gps-lab">🎯 ไป</span><b id="gps-letter">A</b><span class="gps-dist" id="gps-dist">0 ม.</span></div>
    </div>
    <div id="adv-props"><div class="prop prop-l"><i></i><b></b></div><div class="prop prop-r"><i></i><b></b></div><div class="dframe"><i class="skid skid-l"></i><i class="skid skid-r"></i></div></div>
    <div class="adv-hud" id="adv-racehud"></div>
    <button id="adv-skipstart">⏭ ข้ามการสตาร์ทเครื่อง</button>
    <button id="adv-visor">🕶️<small>ม่านบังแดด</small></button>
    <button id="adv-light">💡<small>ไฟส่อง</small></button>
    <button id="adv-wing">🪂<small>โดดวิงสูท</small></button>
    <button id="adv-tour">🛬<small>จบทัวร์</small></button>
    <button id="adv-wiper">🌧️<small>ที่ปัดน้ำ</small></button>
    <button id="adv-seat">🎚️<small>มุมนั่ง</small></button>
    <button id="adv-race">🏁<small>แข่งเวลา</small></button>
    <button id="adv-shot">📸<small>ถ่ายภาพ</small></button>
    <div id="adv-flash"></div>
    <div id="adv-bolt"></div>
    <div id="adv-rain"></div>
    <div id="adv-photo"><div class="ph-card"><img id="adv-photo-img" alt="ภาพที่ถ่ายในโลกโดรน">
      <div class="ph-btns"><button id="adv-photo-save">📥 บันทึกลงเครื่อง</button>
      <button id="adv-photo-close">ปิด</button></div></div></div>
    <canvas id="adv-glass"></canvas>
    <div id="adv-cockpit"></div>
    <div id="adv-cardash"></div>
    <div id="adv-bobble"><span class="bob-base"></span><span class="bob-coil"></span><img id="adv-bobble-img" alt=""></div>
    <canvas id="adv-cargauges"></canvas>
    <!-- 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer) + แผงเลือกเพลง sci-fi -->
    <div id="adv-radio-screen"><canvas id="adv-radio-viz"></canvas><div id="adv-radio-hint"></div></div>
    <div id="adv-radio-list" style="display:none"></div>
    <div id="adv-carwheel"></div>
    <button id="adv-horn">📯</button>
    <canvas id="adv-gauges" width="620" height="130"></canvas>
    <div id="adv-radio"></div>
    <div id="adv-reply">
      <div class="adv-reply-hint">🗣️ แตะตอบหอบังคับ แล้วลองพูดตามดังๆ ดูสิ!</div>
      <div class="adv-reply-row">
        ${ATC_REPLIES.map((r,i)=>`<button class="adv-rp" data-i="${i}">${r[0]}<small>${r[1]}</small></button>`).join('')}
      </div>
    </div>
    <div class="adv-hud" id="adv-inv"></div>
    <div id="adv-combofx"></div>
    <div class="adv-hud" id="adv-nearmiss"></div>
    <div class="adv-hud" id="adv-cross"></div>
    <div id="adv-dmg"></div>
    <div id="adv-banner"></div>
    <div id="adv-scare"><img id="adv-scare-img" alt=""><span>👻</span></div>
    <div id="adv-joy"><div id="adv-joy-dot"></div></div>
    <div id="adv-steerpad"><span>◀</span><i id="adv-steerdot"></i><span>▶</span></div>
    <div id="adv-gaspad">▲<small>เร่ง</small></div>
    <div id="adv-brakepad">■<small>เบรค</small></div>
    <div id="adv-gearbtn">D<small>เดินหน้า</small></div>
    <div id="adv-gearrev">R<small>ถอยหลัง</small></div>
    <div id="adv-bigmap">
      <div id="adv-bigmap-head">
        <span id="adv-bigmap-title">🗺️ แผนที่ตัวอักษร</span>
        <button id="adv-bigmap-x">✖ ปิดแผนที่</button>
      </div>
      <canvas id="adv-bigmap-cv"></canvas>
    </div>
    <div id="adv-tlpad"><span>⬅️</span><i id="adv-tldot"></i><span>➡️</span></div>
    <!-- 🚦 รอบ 185: แสงไฟเลี้ยวสีส้มกระพริบมุมซ้าย/ขวา (ตรงตำแหน่งลูกศรบนแดชบอร์ด) -->
    <div id="adv-tlglow-l" class="adv-tlglow"></div>
    <div id="adv-tlglow-r" class="adv-tlglow"></div>
    <!-- 🚦 รอบ 187 (A3): แสงไฟเลี้ยวสะท้อนบนกระจก/ฝากระโปรง (ล่าง — blend screen ให้ดูเป็นแสงสะท้อน) -->
    <div id="adv-tlreflect-l" class="adv-tlreflect"></div>
    <div id="adv-tlreflect-r" class="adv-tlreflect"></div>
    <div id="adv-lawwarn"></div>
    <div id="adv-carstart">
      <h3>🚗 เตรียมออกรถ</h3>
      <img id="cs-avatar" alt="">  <!-- รอบ 148: ภาพตัวละครที่เลือกนั่งในรถ (img/blocks/car_blk<n>.png · ไม่มีไฟล์=ซ่อน) -->
      <div class="cs-row">
        <div class="cs-lab">🔑 สตาร์ทเครื่องยนต์<small>เครื่องไม่ติด รถออกไม่ได้นะ</small></div>
        <button class="set-switch off" id="cs-engine"><span class="set-sw-knob"></span><span class="set-sw-txt">ปิด</span></button>
      </div>
      <div class="cs-row">
        <div class="cs-lab">🔒 คาดเข็มขัดนิรภัย<small>ปลอดภัย + ไม่โดนใบสั่ง ม.123</small></div>
        <button class="set-switch off" id="cs-belt"><span class="set-sw-knob"></span><span class="set-sw-txt">ปิด</span></button>
      </div>
      <button id="cs-doll" type="button">🪆 แต่งตุ๊กตาหน้ารถ</button>
      <button id="cs-go" disabled>🚗 ออกรถ!</button>
    </div>
    <div id="adv-lawinfo"></div>
    <button id="adv-shoot">🔥</button>
    <button id="adv-chat-btn">💬 แชท</button>
    <button class="adv-vbtn v-off" id="adv-mic">🎤 ปิด</button>
    <button class="adv-vbtn" id="adv-spk">🔊 เปิด</button>
    <button class="adv-vbtn" id="adv-vmode">🌐 ทุกคน</button>
    <button class="adv-vbtn" id="adv-tmute">👩‍🏫 ปิดเสียงห้อง</button>
    <button class="adv-vbtn" id="adv-podbtn">🏁 จบรอบแข่ง</button>
    <div id="adv-podium"></div>
    <div id="adv-chat-box">
      <div id="adv-quick"></div>
      <div class="adv-chat-row">
        <input id="adv-chat-input" maxlength="60" placeholder="พิมพ์สั้นๆ โชว์ลอยหัว 5 วิ...">
        <button id="adv-chat-send">ส่ง</button>
      </div>
    </div>
    <div id="adv-selfmsg"></div>
    <!-- ⚽ โหมดสนามฟุตบอล -->
    <div id="adv-aimpad">
      <div class="apb ap-u">▲</div><div class="apb ap-d">▼</div>
      <div class="apb ap-l">◀</div><div class="apb ap-r">▶</div>
    </div>
    <button id="adv-kick">⚽<small>เตะ</small></button>
    <div id="adv-power"><div id="adv-power-fill"></div></div>
    <button id="adv-scam">👁️ มุมกล้อง</button>
    <div id="adv-coinpop"></div>
    <!-- 🤖 โหมดหุ่นยนต์นักรบ -->
    <div id="mecha-hud" class="adv-hud">
      <div class="mh-frame"></div>       <!-- กรอบห้องนักบินตามหุ่นแต่ละตัว (เจาะกลางให้เห็นสนามรบ) -->
      <div class="mh-tint"></div>        <!-- ไล่เฉดสีตามสีอาวุธ -->
      <div class="mh-sweep"></div>       <!-- ลำแสงกวาดไล่เฉด -->
      <div class="mh-scan"></div>        <!-- เส้นสแกน -->
      <div class="mh-tele">
        <div class="mh-chip mh-wavechip"><span>WAVE</span><b id="mh-wave">1</b></div>
        <div class="mh-chip"><span>RNG</span><b id="mh-rng">--</b><i>m</i></div>
        <div class="mh-chip"><span>TGT</span><b id="mh-tgt">0</b></div>
        <div class="mh-chip mh-heatchip"><span id="mh-heatlbl">HEAT</span><div class="mh-bar mh-heat"><i id="mh-heatbar"></i></div></div>
      </div>
      <div class="mh-radar"><span class="mh-rr"></span><span class="mh-rr mh-rr2"></span><span class="mh-rsweep"></span></div>
      <div class="mh-boss" id="mh-boss"><span class="mh-boss-ttl">👾 BOSS</span><div class="mh-bar mh-boss-bar"><i id="mh-boss-fill"></i></div></div>
      <div class="mh-combo" id="mh-combo"></div>
      <div class="mh-lock" id="mh-lock">◎ TARGET&nbsp;LOCK</div>
      <div class="mh-shield"></div>
      <div class="mh-alarm"></div>
    </div>
    <div class="mecha-btn" id="mecha-fwd">▲</div>
    <div class="mecha-btn" id="mecha-back">▼</div>
    <div class="mecha-btn" id="mecha-left">◀</div>
    <div class="mecha-btn" id="mecha-right">▶</div>
    <div class="mecha-btn" id="mecha-fire">🔫</div>
    <div class="mecha-btn" id="mecha-fire2">🔫</div>
    <div id="adv-soccerstart">
      <h3>⚽ เลือกชุดนักเตะ</h3>
      <div class="ss-lab">สีเสื้อ</div>
      <div class="ss-shirts" id="ss-shirts"></div>
      <div class="ss-lab">เบอร์หลังเสื้อ</div>
      <div class="ss-num"><button id="ss-minus" type="button">−</button><span id="ss-no">10</span><button id="ss-plus" type="button">+</button></div>
      <button id="ss-go" type="button">⚽ เตะเลย!</button>
    </div>
    <div class="adv-hud" id="adv-hint"></div>
    <div id="adv-intro"></div>`;
  document.body.appendChild(overlayEl);

  canvasEl=overlayEl.querySelector('#adv-canvas');
  dmgFlashEl=overlayEl.querySelector('#adv-dmg');
  hudBoardEl=overlayEl.querySelector('#adv-board');
  hudWordsEl=overlayEl.querySelector('#adv-words');
  mhUI={ root:overlayEl.querySelector('#mecha-hud'), frame:overlayEl.querySelector('#mecha-hud .mh-frame'),
    rng:overlayEl.querySelector('#mh-rng'), tgt:overlayEl.querySelector('#mh-tgt'),
    heat:overlayEl.querySelector('#mh-heatbar'), heatlbl:overlayEl.querySelector('#mh-heatlbl'),
    lock:overlayEl.querySelector('#mh-lock'), bossFill:overlayEl.querySelector('#mh-boss-fill'),
    bossTtl:overlayEl.querySelector('#mecha-hud .mh-boss-ttl'), wave:overlayEl.querySelector('#mh-wave'),   // 🌊👾 รอบ 229: เวฟ + ชื่อสายพันธุ์บอส
    combo:overlayEl.querySelector('#mh-combo'),
    fireBtns:[overlayEl.querySelector('#mecha-fire'),overlayEl.querySelector('#mecha-fire2')],
    blips:[] };   // 🤖 รอบ 224-228: HUD กรอบหุ่น + เรดาร์ + บอส/คอมโบ + ปุ่มยิง feedback
  var mhRadar=overlayEl.querySelector('#mecha-hud .mh-radar');
  if(mhRadar){ for(var _b=0;_b<6;_b++){ var _bl=document.createElement('span'); _bl.className='mh-blip'; mhRadar.appendChild(_bl); mhUI.blips.push(_bl); } }
  hudInvEl=overlayEl.querySelector('#adv-inv');
  hudHpEl=overlayEl.querySelector('#adv-hp');
  hudCoinEl=overlayEl.querySelector('#adv-coin');
  hudHuntEl=overlayEl.querySelector('#adv-hunt');
  hudHeartEl=overlayEl.querySelector('#adv-hearts');
  hudSurvEl=overlayEl.querySelector('#adv-survive');   // ⏱ รอบ 256: นาฬิกาหนีผีรอด
  banEl=overlayEl.querySelector('#adv-banner');
  juncEl=overlayEl.querySelector('#adv-junc');       // 🚦 รอบ 182: ป้ายเตือนใกล้ทางแยก
  gpsArrowEl=overlayEl.querySelector('#gps-arrow');  // 🧭 รอบ 200: GPS นำทาง
  gpsTurnEl=overlayEl.querySelector('#gps-turn');
  gpsDistEl=overlayEl.querySelector('#gps-dist');
  gpsLetEl=overlayEl.querySelector('#gps-letter');
  scareEl=overlayEl.querySelector('#adv-scare');
  hintEl=overlayEl.querySelector('#adv-hint');
  introEl=overlayEl.querySelector('#adv-intro');
  mapCv=overlayEl.querySelector('#adv-map'); mapCtx=mapCv.getContext('2d');
  chatBoxEl=overlayEl.querySelector('#adv-chat-box');
  chatInputEl=overlayEl.querySelector('#adv-chat-input');
  selfMsgEl=overlayEl.querySelector('#adv-selfmsg');
  hudInstEl=overlayEl.querySelector('#adv-inst');
  propsEl=overlayEl.querySelector('#adv-props');
  hudWarnEl=overlayEl.querySelector('#adv-warn');
  nmPopEl=overlayEl.querySelector('#adv-nearmiss');
  comboFxEl=overlayEl.querySelector('#adv-combofx');
  cockpitEl=overlayEl.querySelector('#adv-cockpit');
  gaugeCanvasEl=overlayEl.querySelector('#adv-gauges');
  gaugeCtx=gaugeCanvasEl.getContext('2d');
  ATC.el=overlayEl.querySelector('#adv-radio');
  ATC.replyEl=overlayEl.querySelector('#adv-reply');
  ATC.replyEl.querySelectorAll('.adv-rp').forEach(b=>{
    b.addEventListener('click',()=>ATC.reply(+b.dataset.i));
  });
  // 🚁 กรอบค็อกพิตเต็มจอ (รอบ 344): img/heli_frame.png ช่องกระจกโปร่ง → มองทะลุเห็นโลก 3D ผ่านกระจกจริง
  // สร้างไฟล์ด้วย tools/cockpit_prep.py · เข็มที่ขยับจริงคือ canvas #adv-gauges วาดทับหน้าปัดในภาพ (CP_GAUGES)
  const cpImg=new Image();
  cpImg.onload=()=>{
    cpNat={w:cpImg.naturalWidth,h:cpImg.naturalHeight,src:cpImg.src};
    cpBox=''; layoutCockpit();
  };
  cpImg.onerror=()=>{ cockpitEl.innerHTML=`<div class="cp-css"></div>`; cpMap=null; cpNat=null; };
  cpImg.src='img/heli_frame.png';
  // 🎚️ ภาพ "มุมบิน" — เฉพาะแผงหน้าปัดล่าง (ตัดจากกรอบเต็มที่ y=DASH_OFF_Y)
  const dashImg=new Image();
  dashImg.onload=()=>{
    cpDashNat={w:dashImg.naturalWidth,h:dashImg.naturalHeight,src:dashImg.src};
    cpBox=''; layoutCockpit();
  };
  dashImg.onerror=()=>{ cpDashNat=null; };      // ไม่มีไฟล์ = ใช้กรอบเต็มอย่างเดียว
  dashImg.src='img/heli_dash.png';
  // 🚗 หน้าปัดรถ+พวงมาลัย: ใช้ภาพ img/car/dash.png + wheel.png ถ้าเจนแล้ว (PROMPTS_CAR.md) · ไม่มี → CSS จำลอง
  carDashEl=overlayEl.querySelector('#adv-cardash');
  carWheelEl=overlayEl.querySelector('#adv-carwheel');
  loadCarDash();                                    // 🚗 รอบ 230: คอนโซล+พวงมาลัยตามคันที่ขับ (loadCarDash เรียก loadCarWheel เอง)
  carGaugeCv=overlayEl.querySelector('#adv-cargauges');
  carGaugeCtx=carGaugeCv.getContext('2d');
  // 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ
  carBobbleEl=overlayEl.querySelector('#adv-bobble');
  carBobbleImg=overlayEl.querySelector('#adv-bobble-img');
  // 🎵 รอบ 181: วิทยุในรถ — จอ head-unit
  radioScreenEl=overlayEl.querySelector('#adv-radio-screen');
  radioVizCv=overlayEl.querySelector('#adv-radio-viz');
  radioVizCtx=radioVizCv?radioVizCv.getContext('2d'):null;
  radioHintEl=overlayEl.querySelector('#adv-radio-hint');
  radioListEl=overlayEl.querySelector('#adv-radio-list');
  if(radioScreenEl){
    radioScreenEl.addEventListener('click', ()=>{
      if(typeof Music==='undefined' || !Music.ready()){ toast('🎵 ยังไม่มีไฟล์เพลงในรถ (วางใน sound/SongsInCar/)'); return; }
      if(!Music.isCarOn()){ Music.carRadio(true); radioSetHint(); }   // ปิดอยู่ → เปิดวิทยุ
      else radioToggleList();                                          // เปิดอยู่ → เปิด/ปิดรายการเพลง
    });
  }
  if(radioListEl){
    radioListEl.addEventListener('click', e=>{
      const tr=e.target.closest('.rl-track'); if(tr){ Music.playCar(+tr.dataset.i); renderRadioList(); return; }
      const md=e.target.closest('.rl-mode'); if(md){ Music.setMode(md.dataset.m); renderRadioList(); return; }
      if(e.target.closest('.rl-power')){ Music.carRadio(false); radioListEl.style.display='none'; radioSetHint(); return; }
      if(e.target.closest('.rl-x')){ radioListEl.style.display='none'; }
    });
  }
  const hornBtn=overlayEl.querySelector('#adv-horn');
  hornBtn.addEventListener('touchstart',e=>{ e.preventDefault(); CarSound.horn(); },{passive:false});
  hornBtn.addEventListener('click',e=>{ e.preventDefault(); CarSound.horn(); });

  /* 🎛️ รอบ 127: ปุ่มคอนโซลโหมดขับรถ — ซ้าย=พวงมาลัย (แตะ/ลากในแถบ = องศาตามตำแหน่งนิ้ว)
     ขวา=คันเร่งกดค้าง ปล่อยแล้วรถชลอจนหยุดเอง (แรงต้านใน tickDrive)
     stopPropagation กันไปโดน handler ของ overlay ที่จะเสกจอยสติ๊กซ้อน · จับ touch แยกนิ้วด้วย identifier */
  const steerPad=overlayEl.querySelector('#adv-steerpad');
  const steerDot=overlayEl.querySelector('#adv-steerdot');
  const gasPad=overlayEl.querySelector('#adv-gaspad');
  let steerTid=null, gasTid=null;
  const steerFrom=(t)=>{
    const r=steerPad.getBoundingClientRect();
    const v=(((t.clientX-r.left)/r.width)*2-1)*1.25;      // ขยับถึงขอบ = เลี้ยวเต็ม (ไม่ต้องเป๊ะสุดขอบ)
    padSteer=Math.max(-1,Math.min(1,v));
    steerDot.style.left=(50+padSteer*36)+'%';
  };
  const steerOff=()=>{ steerTid=null; padSt=false; padSteer=0; steerDot.style.left='50%'; steerPad.classList.remove('on'); };
  steerPad.addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation();
    if(steerTid!==null) return;
    const t=e.changedTouches[0];
    steerTid=t.identifier; padSt=true; steerPad.classList.add('on'); steerFrom(t);
  },{passive:false});
  steerPad.addEventListener('touchmove',e=>{
    e.preventDefault(); e.stopPropagation();
    for(const t of e.changedTouches) if(t.identifier===steerTid) steerFrom(t);
  },{passive:false});
  ['touchend','touchcancel'].forEach(ev=>steerPad.addEventListener(ev,e=>{
    e.stopPropagation();
    for(const t of e.changedTouches) if(t.identifier===steerTid) steerOff();
  }));
  gasPad.addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation();
    if(gasTid!==null) return;
    gasTid=e.changedTouches[0].identifier; padTh=true; gasPad.classList.add('on');
  },{passive:false});
  ['touchend','touchcancel'].forEach(ev=>gasPad.addEventListener(ev,e=>{
    e.stopPropagation();
    for(const t of e.changedTouches) if(t.identifier===gasTid){ gasTid=null; padTh=false; gasPad.classList.remove('on'); }
  }));

  /* 🦶 รอบ 139: ปุ่มเบรค — กดค้าง=เบรคอย่างเดียว (ไม่ไหลไปถอยหลังเหมือนกด S ค้าง) */
  const brakePad=overlayEl.querySelector('#adv-brakepad');
  let brakeTid=null;
  brakePad.addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation();
    if(brakeTid!==null) return;
    brakeTid=e.changedTouches[0].identifier; padBr=true; brakePad.classList.add('on');
  },{passive:false});
  ['touchend','touchcancel'].forEach(ev=>brakePad.addEventListener(ev,e=>{
    e.stopPropagation();
    for(const t of e.changedTouches) if(t.identifier===brakeTid){ brakeTid=null; padBr=false; brakePad.classList.remove('on'); }
  }));

  /* ⚙️ รอบ 144: เกียร์ 2 ปุ่มแยก D/R (radio — แตะปุ่มไหนเข้าเกียร์นั้น) · R แล้วคันเร่งกลายเป็นถอยหลัง ป้ายส้ม */
  const gearBtn=overlayEl.querySelector('#adv-gearbtn');
  const gearRev=overlayEl.querySelector('#adv-gearrev');
  gearSyncFn=()=>{
    gearBtn.classList.toggle('on',!gearR);
    gearRev.classList.toggle('on',gearR);
    gasPad.classList.toggle('rev',gearR);
    gasPad.innerHTML=gearR?'▼<small>ถอย</small>':'▲<small>เร่ง</small>';
  };
  const gearSet=v=>{ if(gearR===v) return; gearR=v; gearSyncFn(); sfx.select&&sfx.select(); };
  gearBtn.addEventListener('touchstart',e=>{ e.preventDefault(); e.stopPropagation(); gearSet(false); },{passive:false});
  gearBtn.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); gearSet(false); });
  gearRev.addEventListener('touchstart',e=>{ e.preventDefault(); e.stopPropagation(); gearSet(true); },{passive:false});
  gearRev.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); gearSet(true); });
  gearSyncFn();                                        // เริ่มต้นไฮไลต์ D

  /* 🗺️ รอบ 144: แตะ minimap = เปิดแผนที่ขยาย · ปุ่มแดงปิด · กันนิ้วทะลุไปโดนจอย/กล้อง */
  mapCv.addEventListener('click',e=>{ e.preventDefault(); openBigMap(); });
  mapCv.addEventListener('touchstart',e=>{ e.preventDefault(); e.stopPropagation(); openBigMap(); },{passive:false});
  const bigMapEl=overlayEl.querySelector('#adv-bigmap');
  bigMapEl.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});
  bigMapEl.addEventListener('touchmove',e=>e.stopPropagation(),{passive:true});
  const bigX=overlayEl.querySelector('#adv-bigmap-x');
  bigX.addEventListener('click',e=>{ e.preventDefault(); closeBigMap(); });
  bigX.addEventListener('touchstart',e=>{ e.preventDefault(); e.stopPropagation(); closeBigMap(); },{passive:false});

  /* 🚦 รอบ 135: ก้านไฟเลี้ยวแนวตั้ง — ลากขึ้นเกินครึ่ง=ไฟซ้าย ลากลง=ไฟขวา ปล่อยกลาง=ปิด
     knob ค้างตามสถานะไฟ (tlSet ขยับให้) แล้วเด้งกลับเองเมื่อ tlTick ดับไฟหลังเลี้ยวเสร็จ
     preventDefault ใน touchstart กัน click สังเคราะห์ยิงซ้ำ · เดสก์ท็อป: คลิกครึ่งบน/ล่าง/กลาง */
  const tlPad=overlayEl.querySelector('#adv-tlpad');
  let tlTid=null;
  const tlFrom=t=>{
    const r=tlPad.getBoundingClientRect();
    const v=Math.max(-1,Math.min(1,(((t.clientY-r.top)/r.height)*2-1)*1.25));
    tlDotY(v);
    return v;
  };
  tlPad.addEventListener('touchstart',e=>{
    e.preventDefault(); e.stopPropagation();
    if(tlTid!==null) return;
    const t=e.changedTouches[0];
    tlTid=t.identifier; tlPad.classList.add('on'); tlFrom(t);
  },{passive:false});
  tlPad.addEventListener('touchmove',e=>{
    e.preventDefault(); e.stopPropagation();
    for(const t of e.changedTouches) if(t.identifier===tlTid) tlFrom(t);
  },{passive:false});
  ['touchend','touchcancel'].forEach(ev=>tlPad.addEventListener(ev,e=>{
    e.stopPropagation();
    for(const t of e.changedTouches) if(t.identifier===tlTid){
      tlTid=null; tlPad.classList.remove('on');
      const v=tlFrom(t);
      tlSet(v<-.35?1:v>.35?2:0);
      if(typeof sfx!=='undefined') sfx.select();
    }
  }));
  tlPad.addEventListener('click',e=>{
    e.preventDefault();
    const r=tlPad.getBoundingClientRect();
    const v=((e.clientY-r.top)/r.height)*2-1;
    if(v<-.33) tlSet(tlSig===1?0:1);
    else if(v>.33) tlSet(tlSig===2?0:2);
    else tlSet(0);
    if(typeof sfx!=='undefined') sfx.select();
  });

  /* 🚔 รอบ 128: แผงเตรียมออกรถ — สวิตช์สตาร์ทเครื่อง (เสียงไดสตาร์ท) + เข็มขัด (เสียงคลิก) + ปุ่มออกรถ */
  // 🧱🚗 รอบ 148: ภาพตัวละครนั่งรถในแผงเตรียมออกรถ — โหลดสำเร็จค่อยโชว์ / 404 ซ่อน (carStartShow เป็นคนตั้ง src)
  const csAvatar=overlayEl.querySelector('#cs-avatar');
  csAvatar.addEventListener('load',()=>{ csAvatar.style.display='block'; });
  csAvatar.addEventListener('error',()=>{ csAvatar.style.display='none'; });

  const csEngine=overlayEl.querySelector('#cs-engine');
  const csBelt=overlayEl.querySelector('#cs-belt');
  const csGo=overlayEl.querySelector('#cs-go');
  const setSw=(btn,on)=>{ btn.classList.toggle('on',on); btn.classList.toggle('off',!on);
    btn.querySelector('.set-sw-txt').textContent=on?'เปิด':'ปิด'; };
  csEngine.addEventListener('click',()=>{
    carEngineOn=!carEngineOn;
    setSw(csEngine,carEngineOn);
    if(carEngineOn) CarSound.ignite(); else CarSound.stop();
    csGo.disabled=!carEngineOn;
  });
  csBelt.addEventListener('click',()=>{
    carBelted=!carBelted;
    setSw(csBelt,carBelted);
    if(carBelted){ CarSound.beltClick(); if(!carLawSeen) setTimeout(()=>showLawInfo(false),650); }
  });
  csGo.addEventListener('click',()=>{
    if(!carEngineOn) return;
    const closePanel=()=>{ carStartOpen=false; overlayEl.querySelector('#adv-carstart').style.display='none'; sfx.select(); };
    if(!carBelted) showLawInfo(true, closePanel);   // ยังไม่คาด → เตือนข้อกฎหมายก่อน (ยืนยันแล้วออกได้ แต่จะโดนปรับ)
    else closePanel();
  });
  overlayEl.querySelector('#cs-doll').addEventListener('click',()=>{ sfx.select(); openDollPicker(); });   // 🪆 รอบ 193
  // 👆 รอบ 193: แตะตุ๊กตาหน้ารถ = สะกิดให้ส่าย + เสียงปิ๊ง (กันไปโดน joystick/กล้อง)
  if(carBobbleEl){
    const poke=e=>{ e.preventDefault(); e.stopPropagation(); bobblePoke(); };
    carBobbleEl.addEventListener('touchstart',poke,{passive:false});
    carBobbleEl.addEventListener('mousedown',poke);
  }

  // ⚽ โหมดสนามฟุตบอล — ปุ่มเล็ง (กดค้าง) · ปุ่มเตะ (กดค้าง=ชาร์จ) · สลับกล้อง · แผงเลือกชุด
  soccerStartEl=overlayEl.querySelector('#adv-soccerstart');
  powerFillEl=overlayEl.querySelector('#adv-power-fill');
  coinPopEl=overlayEl.querySelector('#adv-coinpop');
  const holdBtn=(sel,down,up)=>{
    const el=overlayEl.querySelector(sel); if(!el) return;
    const d=e=>{ e.preventDefault(); e.stopPropagation(); down(); };
    const u=e=>{ e.preventDefault(); e.stopPropagation(); up(); };
    el.addEventListener('touchstart',d,{passive:false}); el.addEventListener('touchend',u,{passive:false});
    el.addEventListener('touchcancel',u,{passive:false});
    el.addEventListener('mousedown',d); el.addEventListener('mouseup',u); el.addEventListener('mouseleave',u);
  };
  holdBtn('#adv-aimpad .ap-u',()=>sPadU=true,()=>sPadU=false);
  holdBtn('#adv-aimpad .ap-d',()=>sPadD=true,()=>sPadD=false);
  holdBtn('#adv-aimpad .ap-l',()=>sPadL=true,()=>sPadL=false);
  holdBtn('#adv-aimpad .ap-r',()=>sPadR=true,()=>sPadR=false);
  holdBtn('#adv-kick',()=>sKickHeld=true,()=>sKickHeld=false);
  overlayEl.querySelector('#adv-scam').addEventListener('click',()=>{ soccerCam1=!soccerCam1; sfx.select(); });
  overlayEl.querySelector('#ss-minus').addEventListener('click',()=>{ let n=Math.max(1,(+sKitNo||10)-1); sKitNo=String(n); overlayEl.querySelector('#ss-no').textContent=sKitNo; sfx.select(); });
  overlayEl.querySelector('#ss-plus').addEventListener('click',()=>{ let n=Math.min(99,(+sKitNo||10)+1); sKitNo=String(n); overlayEl.querySelector('#ss-no').textContent=sKitNo; sfx.select(); });
  overlayEl.querySelector('#ss-go').addEventListener('click',()=>{ sfx.select(); soccerKitGo(); });

  // 🤖 ปุ่มบังคับหุ่นยนต์ (กดค้าง)
  holdBtn('#mecha-fwd',()=>mFwdBtn=1,()=>mFwdBtn=0);
  holdBtn('#mecha-back',()=>mFwdBtn=-1,()=>mFwdBtn=0);
  holdBtn('#mecha-left',()=>mStrafeBtn=-1,()=>mStrafeBtn=0);   /* รอบ 222: ◀▶ = ขยับข้าง (สเตรฟ) ไม่ใช่หมุนตัว · หมุน/เล็ง = ลากจอ */
  holdBtn('#mecha-right',()=>mStrafeBtn=1,()=>mStrafeBtn=0);
  holdBtn('#mecha-fire',()=>mFireHeld=true,()=>mFireHeld=false);
  holdBtn('#mecha-fire2',()=>mFireHeld=true,()=>mFireHeld=false);   /* รอบ 223: ปุ่มยิงตัวที่ 2 (ใต้ minimap) ยิงเหมือนกัน */

  overlayEl.querySelector('#adv-exit').addEventListener('click',confirmExit);
  // 🏁📸 โหมดแข่งเวลา + กล้องในเกม (โลกโดรน)
  raceHudEl=overlayEl.querySelector('#adv-racehud');
  raceBtnEl=overlayEl.querySelector('#adv-race');
  photoEl=overlayEl.querySelector('#adv-photo');
  photoImgEl=overlayEl.querySelector('#adv-photo-img');
  flashEl=overlayEl.querySelector('#adv-flash');
  boltEl=overlayEl.querySelector('#adv-bolt');
  rainEl=overlayEl.querySelector('#adv-rain');
  raceBtnEl.addEventListener('click',e=>{ e.preventDefault(); if(raceOn) raceStop(false); else raceStartRun(); });
  overlayEl.querySelector('#adv-shot').addEventListener('click',e=>{ e.preventDefault(); shotWanted=true; });
  skipStartEl=overlayEl.querySelector('#adv-skipstart');
  skipStartEl.addEventListener('click',e=>{ e.preventDefault(); HeliSound.skipStart(); });
  // 🌧️🎚️ ที่ปัดน้ำฝน (ปิด→ช้า→เร็ว) + ปรับมุมนั่ง (ต่ำ→ปกติ→สูง)
  glassCanvasEl=overlayEl.querySelector('#adv-glass');
  glassCtx=glassCanvasEl.getContext('2d');
  overlayEl.querySelector('#adv-wiper').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setWiper((wiperMode+1)%3);
  });
  overlayEl.querySelector('#adv-seat').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setSeat((seatLevel+1)%3);
  });
  overlayEl.querySelector('#adv-visor').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setVisor(!visorDown);
  });
  overlayEl.querySelector('#adv-light').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setHeliLight(!heliLightOn);
  });
  overlayEl.querySelector('#adv-wing').addEventListener('click',e=>{   // 🪂 โดดจากเฮลิฯ ทัวร์ หรือจากขอบดาดฟ้า
    e.preventDefault();
    if(hPhase==='ride') beginWing(true);
    else if(hPhase==='walk') beginWing(false);
  });
  overlayEl.querySelector('#adv-tour').addEventListener('click',e=>{
    e.preventDefault(); if(hPhase==='ride') endRide(true);
  });
  overlayEl.querySelector('#adv-photo-save').addEventListener('click',savePhoto);
  overlayEl.querySelector('#adv-photo-close').addEventListener('click',()=>photoEl.classList.remove('on'));
  overlayEl.querySelector('#adv-help').addEventListener('click',()=>showIntro(mode,true));
  const shootBtn=overlayEl.querySelector('#adv-shoot');
  shootBtn.addEventListener('touchstart',e=>{ e.preventDefault(); shoot(); },{passive:false});
  shootBtn.addEventListener('click',e=>{ e.preventDefault(); shoot(); });

  overlayEl.querySelector('#adv-mic').addEventListener('click',()=>Voice.setMic(!Voice.mic));
  overlayEl.querySelector('#adv-spk').addEventListener('click',()=>Voice.setSpk(!Voice.spk));
  overlayEl.querySelector('#adv-vmode').addEventListener('click',()=>Voice.setMode(Voice.vmode==='all'?'friends':'all'));
  overlayEl.querySelector('#adv-tmute').addEventListener('click',()=>Voice.toggleRoomMute());
  overlayEl.querySelector('#adv-podbtn').addEventListener('click',endRound);

  overlayEl.querySelector('#adv-chat-btn').addEventListener('click',()=>toggleChatBox());
  overlayEl.querySelector('#adv-chat-send').addEventListener('click',()=>{
    sendChat(chatInputEl.value); toggleChatBox(false);
  });
  // quick chat: เด็กเล็กพิมพ์ช้า → แตะเดียวส่งเลย (ปลอดภัย ไม่ต้องพิมพ์เอง)
  const QUICK_CHATS=['สวัสดี! 👋','มาทางนี้! 🏃','ไปเก็บคำกัน! 🔤','ช่วยด้วย! 🆘','เก่งมาก! 🎉','หนีเร็ว!! 👻'];
  const quickEl=overlayEl.querySelector('#adv-quick');
  QUICK_CHATS.forEach(txt=>{
    const b=document.createElement('button');
    b.className='adv-qc'; b.textContent=txt;
    b.addEventListener('click',()=>{ sendChat(txt); toggleChatBox(false); });
    quickEl.appendChild(b);
  });
  chatInputEl.addEventListener('keydown',e=>{
    e.stopPropagation();                                   // กัน WASD ในช่องพิมพ์ไปขยับตัวละคร
    if(e.code==='Enter'){ sendChat(chatInputEl.value); toggleChatBox(false); }
    if(e.code==='Escape') toggleChatBox(false);
  });

  bindInput();
}

function confirmExit(){
  if(!running){ exitWorld(); return; }
  running=false;                                   // พักเกมระหว่างถาม
  askConfirm(`<h2>🚪 ออกจาก${M.label}</h2>
    <p style="font-size:15px;margin:6px 0">รอบนี้เก็บได้ <b>${sessionWords}</b> คำ · <b>+${fmtNum(sessionCoins)}</b> 🪙<br>
    <small>กลับมาเล่นต่อเมื่อไหร่ก็ได้ ตั๋วใช้ได้ตลอด</small></p>${sessionRecapHtml()}`,
    'ออกเลย', ()=>exitWorld());
  // askConfirm ไม่มี callback ตอนยกเลิก → เฝ้า overlay หาย แล้วเล่นต่อ
  const watch=setInterval(()=>{
    if(!document.querySelector('.levelup-overlay')){
      clearInterval(watch);
      if(overlayEl.classList.contains('on') && hp>0 && !running){ running=true; clock.getDelta(); loop(); }
    }
  },200);
}

/* ============================================================
   Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
   ============================================================ */
const IS_TOUCH='ontouchstart' in window;
function bindInput(){
  document.addEventListener('keydown',e=>{
    if(!overlayEl.classList.contains('on')) return;
    if(e.target && e.target.tagName==='INPUT') return;     // กำลังพิมพ์แชท
    if(e.code==='Enter' && running){ toggleChatBox(true); e.preventDefault(); return; }
    if((M.soccer||M.mecha) && (e.code==='Space'||e.code.startsWith('Arrow'))) e.preventDefault();   // ⚽🤖 กันหน้าเลื่อน
    keys[e.code]=true;
  });
  document.addEventListener('keyup',e=>{ keys[e.code]=false; });

  if(!IS_TOUCH){
    canvasEl.addEventListener('click',()=>{
      if(M.soccer) return;                            // ⚽ ฟุตบอลใช้เมาส์กับปุ่ม HUD ไม่ล็อกเคอร์เซอร์
      if(document.pointerLockElement===canvasEl){ if(M.mecha) mechaFire(performance.now()); else shoot(); }
      else canvasEl.requestPointerLock();
    });
    document.addEventListener('mousemove',e=>{
      if(document.pointerLockElement!==canvasEl) return;
      if(M.drive){ dLook=Math.max(-1.35,Math.min(1.35,dLook-e.movementX*.003)); return; }  // 🚗 เมาส์=ชะโงกมอง รถเลี้ยวด้วย A/D
      yaw-=e.movementX*.0024;
      pitch=Math.max(-1.25,Math.min(1.25,pitch-e.movementY*.0024));
    });
  }else{
    overlayEl.classList.add('adv-touch');
    const joyEl=overlayEl.querySelector('#adv-joy'), dotEl=overlayEl.querySelector('#adv-joy-dot');
    let joyId=null, joyCx=0, joyCy=0;
    overlayEl.addEventListener('touchstart',e=>{
      if(M.soccer) return;                            // ⚽ โหมดฟุตบอลใช้ปุ่มเล็ง/เตะเอง ไม่มีจอย/ลากมองรอบ
      for(const t of e.changedTouches){
        if(t.target.closest('#adv-shoot,#adv-horn,#adv-exit,#adv-help,#adv-intro,#adv-banner,#adv-chat-btn,#adv-chat-box,.adv-vbtn,#adv-podium,#adv-reply,#adv-map,#adv-bigmap,#adv-aimpad,#adv-kick,#adv-scam,#adv-soccerstart,.mecha-btn,#adv-wiper,#adv-seat,#adv-skipstart,#adv-visor,#adv-light,#adv-wing,#adv-tour')) continue;   /* รอบ 346: +ที่ปัดน้ำ/มุมนั่ง/ข้ามสตาร์ท — อยู่ครึ่งขวา ถ้าไม่กันไว้ นิ้วที่กดปุ่มจะกลายเป็นลากคันเร่ง · รอบ 350: +ม่านบังแดด(ตกหล่นจากรอบ 348!)/ไฟส่อง */  /* #adv-words เอาออก — เป็น pointer-events:none แล้ว นิ้วโดนคันบังคับได้ · รอบ 144: +map/bigmap · รอบ 196: +soccer · รอบ 199: +mecha */
        if(!M.mecha && t.clientX<window.innerWidth*.45 && joyId===null){   // 🤖 mecha ใช้ปุ่มบังคับเอง ครึ่งซ้ายไม่เป็นจอย (ลากได้แต่มองรอบครึ่งขวา)
          joyId=t.identifier; joyCx=t.clientX; joyCy=t.clientY;
          joyEl.style.left=(joyCx-55)+'px'; joyEl.style.top=(joyCy-55)+'px'; joyEl.style.bottom='auto';
          joyEl.classList.add('live');                 // รอบ 143: โหมดขับรถซ่อนวงจอยตอนพัก — โชว์เฉพาะตอนใช้จริง
          joy.on=true; joy.dx=0; joy.dy=0;
        }else if(lookTouch===null){
          lookTouch={id:t.identifier,x:t.clientX,y:t.clientY};
        }
      }
    },{passive:true});
    overlayEl.addEventListener('touchmove',e=>{
      for(const t of e.changedTouches){
        if(t.identifier===joyId){
          const dx=t.clientX-joyCx, dy=t.clientY-joyCy, d=Math.hypot(dx,dy), max=48;
          const cl=d>max?max/d:1;
          joy.dx=dx*cl/max; joy.dy=dy*cl/max;
          dotEl.style.transform=`translate(calc(-50% + ${dx*cl}px),calc(-50% + ${dy*cl}px))`;
        }else if(lookTouch && t.identifier===lookTouch.id){
          if(M.drive){
            // โหมดขับรถ: ลากขวา = ชะโงกมองซ้าย-ขวาชั่วคราว (ปล่อยแล้วเด้งกลับมองหน้า)
            dLook=Math.max(-1.35,Math.min(1.35,dLook-(t.clientX-lookTouch.x)*.006));
          }else if((M.heli&&hPhase==='pilot')||M.drone){
            // โหมดบิน (ขับเอง): ลากขวาแนวนอน = หันหัว · แนวตั้ง = ขึ้น/ลง (throttle/collective)
            // 🚶 รอบ 354: เฟสเดิน/นั่ง/วิงสูทของโลกเฮลิฯ ตกไปใช้ look ปกติข้างล่างแทน
            yaw-=(t.clientX-lookTouch.x)*(M.drone?.005:.004);
            hCol=Math.max(-1,Math.min(1,hCol-(t.clientY-lookTouch.y)*.012));
          }else{
            yaw-=(t.clientX-lookTouch.x)*.005;
            pitch=Math.max(-1.25,Math.min(1.25,pitch-(t.clientY-lookTouch.y)*.005));
          }
          lookTouch.x=t.clientX; lookTouch.y=t.clientY;
        }
      }
    },{passive:true});
    const endTouch=e=>{
      for(const t of e.changedTouches){
        if(t.identifier===joyId){ joyId=null; joy.on=false; joy.dx=joy.dy=0;
          dotEl.style.transform='translate(-50%,-50%)';
          joyEl.classList.remove('live');
          joyEl.style.left='18px'; joyEl.style.top='auto'; joyEl.style.bottom='18px'; }
        if(lookTouch && t.identifier===lookTouch.id){ lookTouch=null; hCol=0; }   // ปล่อยนิ้ว = hover
      }
    };
    overlayEl.addEventListener('touchend',endTouch,{passive:true});
    overlayEl.addEventListener('touchcancel',endTouch,{passive:true});
  }

  window.addEventListener('resize',()=>{
    if(!renderer || !overlayEl.classList.contains('on')) return;
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    layoutCockpit();                               // 🎛️ เข็มต้องขยับตามภาพค็อกพิตเมื่อหมุนจอ
  });
}

/* ---------- เดิน + กันทะลุสิ่งกีดขวาง/รั้ว ---------- */
function movePlayer(mx,mz){
  let nx=camera.position.x+mx, nz=camera.position.z+mz;
  nx=Math.max(-HALF+1.2,Math.min(HALF-1.2,nx));
  nz=Math.max(-HALF+1.2,Math.min(HALF-1.2,nz));
  for(const t of trees){
    const d=Math.hypot(nx-t.x,nz-t.z), min=t.r+.5;
    if(d<min && d>0){ nx=t.x+(nx-t.x)/d*min; nz=t.z+(nz-t.z)/d*min; }
  }
  camera.position.x=nx; camera.position.z=nz;
}
function tickPlayer(dt,now){
  let fw=0,sd=0;
  if(keys.KeyW||keys.ArrowUp) fw+=1;
  if(keys.KeyS||keys.ArrowDown) fw-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  if(fw||sd){
    const l=Math.hypot(fw,sd)||1;
    if(l>1){ fw/=l; sd/=l; }
    const sin=Math.sin(yaw),cos=Math.cos(yaw);
    movePlayer((-sin*fw+cos*sd)*PLAYER_SPEED*dt,(-cos*fw-sin*sd)*PLAYER_SPEED*dt);
    camera.position.y=EYE_H+Math.sin(now/180)*.045;      // ก้าวเดินหัวโยกนิดๆ
  }
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);

  // เก็บตัวอักษร
  for(let i=letters.length-1;i>=0;i--){
    const lp=letters[i].spr.position;
    if(Math.hypot(lp.x-camera.position.x,lp.z-camera.position.z)<PICK_DIST) pickUpLetter(i);
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });
}

/* ============================================================
   🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
   จอยซ้าย/WASD = เอียงตัว (cyclic) · ลากขวาแนวตั้ง/Space-Shift = ขึ้นลง (collective)
   ลากขวาแนวนอน/Q-E = หันหัว (yaw) · ลงจอดเบาๆ บนดาดฟ้าใกล้ตัวอักษร = เก็บ
   ============================================================ */
/* ============================================================
   🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
   ============================================================ */
function collideDrone(p){
  let hit=false;
  const spd=Math.hypot(hVel.x,hVel.y,hVel.z);
  for(const b of buildings){
    if(Math.abs(p.x-b.x)>b.w/2+4 || Math.abs(p.z-b.z)>b.d/2+4 || p.y>b.h+4) continue;   // broad-phase
    for(const s of b.solids){
      const dx=p.x-s.x, dy=p.y-s.y, dz=p.z-s.z;
      const ox=s.hx+DRONE_R-Math.abs(dx), oy=s.hy+DRONE_R-Math.abs(dy), oz=s.hz+DRONE_R-Math.abs(dz);
      if(ox>0 && oy>0 && oz>0){                    // ทะลุกล่อง → ดันออกตามแกนที่ทะลุน้อยสุด + เด้ง
        if(ox<=oy && ox<=oz){ p.x+=dx>=0?ox:-ox; hVel.x*=-.28; }
        else if(oy<=ox && oy<=oz){ p.y+=dy>=0?oy:-oy; hVel.y*=-.28; }
        else { p.z+=dz>=0?oz:-oz; hVel.z*=-.28; }
        hit=true;
      }
    }
  }
  return hit?spd:0;
}
/* 💥 ชนกำแพง → ใบพัดสะบัด+หมุนช้าลง (รีสตาร์ตแอนิเมชันด้วยการถอด class ก่อนใส่ใหม่ ชนรัวๆ ก็สะบัดทุกครั้ง) */
function propStall(now){
  if(!propsEl) return;
  propStallUntil=now+PROP_STALL_MS;
  propsEl.classList.remove('hit'); void propsEl.offsetWidth; propsEl.classList.add('hit');
  setTimeout(()=>{ if(propsEl) propsEl.classList.remove('hit'); }, PROP_STALL_MS);
}
/* 🌀 ชนแรงมาก → ใบพัดข้างที่ชนหัก (เลือกข้างจากทิศที่เบนออกตอนชน) · ซ่อมได้ด้วยการเก็บตัวอักษรถัดไป */
function propBreak(side){
  if(propBroken) return;                            // หักอยู่แล้ว ไม่ซ้ำซ้อน
  propBroken=side;
  if(propsEl) propsEl.classList.add('broken-'+side);
  showBanner('🌀 ใบพัดหัก! เก็บตัวอักษรถัดไปเพื่อซ่อม');
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([40,60,40]);
}
function propFix(){
  if(!propBroken) return;
  if(propsEl) propsEl.classList.remove('broken-l','broken-r');
  propBroken='';
  showBanner('🔧 ซ่อมใบพัดเสร็จ! บินเต็มสปีดได้แล้ว');
}
/* 🔋 ชาร์จแบต (บวก) — คุมไม่ให้เกิน 100 */
function droneBatAdd(n){ droneBat=Math.max(0,Math.min(100,droneBat+n)); }

/* ⛈ ฟ้าแลบ — จอวาบ + กระจกทุกบานสะท้อนแสงขาววับ + เสียงฟ้าร้องตามมา */
function lightningBolt(now){
  boltFlashUntil=now+220;
  startRain(now);                                   // 🌧️ ฟ้าแลบแล้วฝนสาดเลนส์ตามมา
  if(boltEl){ boltEl.classList.remove('on'); void boltEl.offsetWidth; boltEl.classList.add('on');
              setTimeout(()=>boltEl&&boltEl.classList.remove('on'),420); }
  if(droneGlassMat){ droneGlassMat.color.setHex(0xffffff); droneGlassMat.opacity=1; }
  setTimeout(()=>{ if(droneGlassMat){ droneGlassMat.color.setHex(0xffffff); droneGlassMat.opacity=.82; } },200);
  setTimeout(()=>DroneSound.thunder(), 300+Math.random()*700);   // เสียงมาทีหลังแสง (ระยะทาง)
}
/* 🌧️ ฝนสาดเลนส์กล้อง FPV — เปิดหลังฟ้าแลบ 9-15 วิ แล้วค่อยๆ จางเอง (CSS ล้วน ไม่กินเฟรม)
   หยดน้ำบนเลนส์สุ่มตำแหน่งใหม่ทุกครั้ง = ไม่ซ้ำแพตเทิร์นเดิม */
function startRain(now){
  if(!rainEl) return;
  rainUntil=now+9000+Math.random()*6000;
  if(!rainEl.childElementCount){
    let html='';
    for(let i=0;i<14;i++){
      const x=(4+Math.random()*92).toFixed(1), y=(4+Math.random()*88).toFixed(1);
      const s=(9+Math.random()*22).toFixed(0), d=(2.2+Math.random()*3.4).toFixed(1), dl=(Math.random()*4).toFixed(1);
      html+=`<i style="left:${x}%;top:${y}%;width:${s}px;height:${(s*1.25)|0}px;animation-duration:${d}s;animation-delay:-${dl}s"></i>`;
    }
    rainEl.innerHTML=html;
  }
  rainEl.classList.add('on');
}
function stopRain(){ if(rainEl) rainEl.classList.remove('on'); }
/* 🪟 บินชนบานที่ยังมีกระจก = แตก (สลับเป็นบานโล่ง) + เศษกระจกกระเด็น + เหรียญ */
function smashGlass(g,now){
  g.done=true;
  if(droneWinMat) g.m.material=droneWinMat;
  DroneSound.glass();
  addCoins(GLASS_COIN); sessionCoins+=GLASS_COIN; renderHudTop();
  droneBatAdd(3);
  showBanner(`🪟 กระจกแตก! +${GLASS_COIN}🪙`);
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(22);
  awardGlass();
}
/* 🪟 นับบานกระจกที่ทุบสะสม → ปลดเข็มจอมทุบกระจก (แพตเทิร์นเดียวกับเข็มผาดโผน) */
function awardGlass(){
  state.glassCount=(state.glassCount||0)+1;
  const tier=GLASS_TIERS.filter(t=>state.glassCount>=t[0]).pop();
  if(tier && tier[1]>(state.glassBadge||0)){
    state.glassBadge=tier[1];
    renderBoard();
    setTimeout(()=>{
      if(!running) return;
      celebrateBadge(glassEmoji(tier[1]), `ได้${GLASS_TIER_UI[tier[1]]}!`,
        `ทุบกระจกตึกร้างครบ ${tier[0]} บาน — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกแล้ว 🎉`);
      if(typeof checkCrown === 'function') checkCrown();
      if(myRef) sendPos(true);
    }, 1200);
  }
  saveState();
}
/* 🔤 ตัวอักษรที่ยัง "ขาดจริง" ตัวหนึ่ง (ยังไม่มีในมือและยังไม่มีวางในโลก) — ใช้ซ่อนหลังประตู */
function neededLetter(){
  const worldCnt={}; letters.forEach(l=>worldCnt[l.ch]=(worldCnt[l.ch]||0)+1);
  const haveCnt=Object.assign({},inv);
  for(const w of words){
    for(const ch of w.en.split('')){
      const used=Math.min(1,haveCnt[ch]||0);
      if(used){ haveCnt[ch]--; continue; }
      if((worldCnt[ch]||0)>0){ worldCnt[ch]--; continue; }
      return ch;                                   // ตัวนี้ขาดจริง
    }
  }
  const w=words[0];                                // ไม่ขาดเลย → แถมตัวแรกของคำแรก
  return w?w.en[0]:'A';
}
/* 🚪 บินชนประตู = บานแกว่งเปิด เจอของในห้องเก็บของ (เหรียญ + แบต + ตัวอักษรลับในห้อง) */
function openDoor(dr){
  dr.open=true;
  DroneSound.thud();
  addCoins(DOOR_COIN); sessionCoins+=DOOR_COIN; renderHudTop();
  droneBatAdd(DOOR_BAT);
  // 🔤 ตัวอักษรลับโผล่ในห้องหลังประตู (ตัวที่ยังขาดอยู่จริง) — บินเข้าไปเก็บต่อได้เลย
  let secret='';
  if(letters.length<90 && words.length){
    secret=neededLetter();
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(secret),transparent:true}));
    spr.position.set(dr.x, 1.8, dr.z+dr.inz*2.8);      // เยื้องเข้าไปในห้องหลังประตู
    spr.scale.set(2.1,2.1,1);
    scene.add(spr);
    letters.push({ch:secret,spr,born:performance.now(),baseY:1.8});
    renderHudWords();
  }
  showBanner(`🚪 เปิดประตูเจอห้องเก็บของ! +${DOOR_COIN}🪙 · 🔋+${DOOR_BAT}%`+(secret?` · 🔤 เจอตัว ${secret} ข้างใน!`:''));
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([18,40,18]);
}
/* 🏁 โหมดแข่งเวลา — เริ่ม/จบ/อัปเดตป้าย */
function raceStartRun(){
  if(!droneGates.length) return;
  raceOn=true; raceIdx=0; raceStart=performance.now(); droneBat=100;
  gateHighlight();
  showBanner('🏁 เริ่มแข่ง! บินผ่านห่วงให้ครบ 6 ก่อนแบตหมด');
  renderRaceHud();
}
function raceStop(win){
  if(!raceOn) return;
  const secs=(performance.now()-raceStart)/1000;
  raceOn=false;
  droneGates.forEach(g=>{ g.m.scale.setScalar(1); g.m.material.color.setHex(g.col); });
  if(win){
    const best=state.droneRaceBest||0;
    const record=!best || secs<best;
    if(record){ state.droneRaceBest=Math.round(secs*10)/10; saveState(); }
    addCoins(RACE_REWARD); sessionCoins+=RACE_REWARD; renderHudTop();
    celebrateBadge('🏁', `จบสนาม ${secs.toFixed(1)} วินาที!`,
      `ผ่านครบ 6 ห่วง +${RACE_REWARD}🪙${record?' · 🏆 สถิติใหม่!':` · สถิติดีสุด ${best.toFixed(1)} วิ`}`);
  }else{
    showBanner('🔋 แบตหมดก่อนจบสนาม — ลองใหม่ได้เลย!');
  }
  renderRaceHud();
}
/* ห่วงถัดไปโตขึ้น+ขาวสว่าง · ห่วงที่ผ่านแล้วหรี่ลง (เห็นชัดว่าต้องไปไหนต่อ) */
function gateHighlight(){
  droneGates.forEach((g,i)=>{
    const done=i<raceIdx, next=i===raceIdx;
    g.m.scale.setScalar(next?1.25:1);
    g.m.material.color.setHex(done?0x39424d:(next?0xffffff:g.col));
  });
}
function renderRaceHud(){
  if(!raceHudEl) return;
  if(!raceOn){ raceHudEl.style.display='none'; if(raceBtnEl) raceBtnEl.classList.remove('on'); return; }
  if(raceBtnEl) raceBtnEl.classList.add('on');
  const secs=(performance.now()-raceStart)/1000;
  raceHudEl.style.display='block';
  raceHudEl.innerHTML=`🏁 ห่วง <b>${raceIdx}/6</b> · ⏱ ${secs.toFixed(1)} วิ`+
    (state.droneRaceBest?` · 🏆 ${state.droneRaceBest.toFixed(1)} วิ`:'');
}
function tickDrone(dt,now){
  let fw=0,sd=0,yawIn=0,col=0;
  if(keys.KeyW||keys.ArrowUp) fw+=1;
  if(keys.KeyS||keys.ArrowDown) fw-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(keys.KeyQ) yawIn+=1;
  if(keys.KeyE) yawIn-=1;
  if(keys.Space) col+=1;
  if(keys.ShiftLeft||keys.ShiftRight||keys.KeyC) col-=1;
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  col+=hCol; col=Math.max(-1,Math.min(1,col));
  yaw+=yawIn*DRONE_YAWSP*dt;

  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  hVel.x+=(-sin*fw+cos*sd)*DRONE_ACCEL*dt;
  hVel.z+=(-cos*fw-sin*sd)*DRONE_ACCEL*dt;
  // 🌀🔋 ใบพัดหัก / แบตหมด = บินอืดลง (ตัวคูณรวมกัน แต่ยังบินเก็บตัวอักษรได้เสมอ)
  const powMul=(propBroken?PROP_BROKEN_MUL:1)*(droneBat<=0?BAT_EMPTY_MUL:1);
  hVel.y+=(col*DRONE_CLIMB*powMul - DRONE_GRAV)*dt;
  hVel.y*=Math.max(0,1-1.1*dt);
  const drag=Math.max(0,1-1.15*dt); hVel.x*=drag; hVel.z*=drag;
  const hs=Math.hypot(hVel.x,hVel.z), vmax=DRONE_VMAX*powMul;
  if(hs>vmax){ hVel.x*=vmax/hs; hVel.z*=vmax/hs; }

  const p={x:camera.position.x+hVel.x*dt, y:camera.position.y+hVel.y*dt, z:camera.position.z+hVel.z*dt};
  p.x=Math.max(-HALF+1.5,Math.min(HALF-1.5,p.x));
  p.z=Math.max(-HALF+1.5,Math.min(HALF-1.5,p.z));
  p.y=Math.min(62,p.y);
  if(p.y<DRONE_R){ p.y=DRONE_R; if(hVel.y<0) hVel.y*=-.2; }         // แตะพื้น = เด้งเบา
  const crashSpd=collideDrone(p);
  if(crashSpd>9 && now-hHitAt>900){
    hHitAt=now; damagePlayer(14); DroneSound.thud(); nmCrashed=true; nmCombo=0; propStall(now);
    // ชนแรงมาก = ใบพัดหัก · ข้างที่หัก = ข้างที่พุ่งเข้าหากำแพง (คิดจากทิศสไลด์เทียบหัวโดรน)
    if(crashSpd>PROP_BREAK_SPD) propBreak((cos*hVel.x - sin*hVel.z)>=0 ? 'r' : 'l');
  }
  camera.position.set(p.x,p.y,p.z);

  // เอียงตัวแบบ FPV (แรงเฉื่อย) — ก้ม/เงยตามเดินหน้า + banking ตอนสไลด์
  hTiltF+=(fw-hTiltF)*Math.min(1,dt*6);
  hTiltS+=(sd-hTiltS)*Math.min(1,dt*6);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw);
  camera.rotateX(-hTiltF*.22);
  camera.rotateZ(-hTiltS*.28);

  // เก็บตัวอักษร: บินเฉียด (ไม่ต้องจอด)
  for(let i=letters.length-1;i>=0;i--){
    const lp=letters[i].spr.position;
    if(Math.hypot(lp.x-p.x,lp.y-p.y,lp.z-p.z)<2.4){
      pickUpLetter(i);
      droneBatAdd(BAT_LETTER); propFix();          // 🔋 ชาร์จแบต + 🔧 ซ่อมใบพัดที่หัก
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.5)+Math.sin(now/380+l.spr.position.x*2)*.12; });

  // เตือนใกล้ชนกำแพง (บี๊บถี่ขึ้นตามระยะ + ไฟแดง)
  hWarnLvl=0; let warnMsg='', near=99;
  for(const b of buildings){
    if(Math.abs(p.x-b.x)>b.w/2+9 || Math.abs(p.z-b.z)>b.d/2+9 || p.y>b.h+3) continue;
    for(const s of b.solids){
      const dd=Math.hypot(Math.max(0,Math.abs(p.x-s.x)-s.hx),Math.max(0,Math.abs(p.y-s.y)-s.hy),Math.max(0,Math.abs(p.z-s.z)-s.hz));
      if(dd<near) near=dd;
    }
  }
  if(near<1.2){ hWarnLvl=3; warnMsg='🚨 ใกล้กำแพงมาก!'; }
  else if(near<2.4){ hWarnLvl=2; warnMsg='⚠️ ระวังชน!'; }
  else if(near<4){ hWarnLvl=1; warnMsg='⚠️ มีกำแพงใกล้ๆ'; }
  nearMissTick(near, now, 1.9, 4, 1.0);                // 💨 บินเฉียดกำแพงแล้วรอด = โบนัส
  if(hudWarnEl){
    if(hWarnLvl>0){ hudWarnEl.style.display='block'; hudWarnEl.textContent=warnMsg; hudWarnEl.className='adv-hud warn'+hWarnLvl; }
    else hudWarnEl.style.display='none';
  }
  DroneSound.proximity(hWarnLvl);

  // ⛈ ฟ้าแลบเป็นระยะ (เมืองร้างใต้พายุ)
  if(now>boltAt){ boltAt=now+BOLT_MIN+Math.random()*(BOLT_MAX-BOLT_MIN); if(boltEl) lightningBolt(now); }
  if(rainUntil && now>rainUntil){ rainUntil=0; stopRain(); }      // 🌧️ ฝนหยุดเอง
  // 🪟 ชนบานที่ยังมีกระจก → แตก (เช็กเฉพาะบานที่ยังไม่แตก · ตัดด้วยระยะหยาบก่อน)
  for(const g of droneGlass){
    if(g.done) continue;
    if(Math.abs(p.x-g.x)>GLASS_HIT_R || Math.abs(p.y-g.y)>GLASS_HIT_R || Math.abs(p.z-g.z)>GLASS_HIT_R) continue;
    if(Math.hypot(p.x-g.x,p.y-g.y,p.z-g.z)<GLASS_HIT_R) smashGlass(g,now);
  }
  // 🚪 ชนประตู → เปิด + ของรางวัล · บานที่เปิดแล้วค่อยๆ แกว่งจนสุด
  for(const dr of droneDoors){
    if(!dr.open){
      if(Math.abs(p.x-dr.x)<DOOR_R && Math.abs(p.z-dr.z)<DOOR_R && p.y<4.2 &&
         Math.hypot(p.x-dr.x,p.z-dr.z)<DOOR_R) openDoor(dr);
    }else if(dr.ang>-1.55){
      dr.ang=Math.max(-1.55, dr.ang-2.6*dt);      // แกว่งเปิดจนสุด ~110°
      dr.pivot.rotation.y=dr.base+dr.ang;
    }
  }

  // ⚡ ลอยเหนือแท่นชาร์จ = แบตวิ่งขึ้นเร็ว (ห่วงเต้นตามจังหวะให้เห็นว่ากำลังชาร์จ)
  droneCharging=false;
  for(const cg of droneChargers){
    if(Math.hypot(p.x-cg.x,p.z-cg.z)<CHG_R && p.y>cg.y && p.y<cg.y+CHG_H){ droneCharging=true;
      droneBatAdd(CHG_RATE*dt);
      cg.ring.scale.setScalar(1+Math.sin(now/120)*.08);
      break;
    }
  }
  // 🏁 โหมดแข่ง: ผ่านห่วงตามลำดับ (ห่วงถัดไปเท่านั้นที่นับ)
  if(raceOn && droneGates.length){
    const g=droneGates[raceIdx];
    if(g && Math.hypot(p.x-g.x,p.y-g.y,p.z-g.z)<GATE_R){
      raceIdx++; sfx.coin(); addCoins(3); sessionCoins+=3; renderHudTop();
      if(state.haptic!==false && navigator.vibrate) navigator.vibrate(18);
      if(raceIdx>=droneGates.length) raceStop(true); else { gateHighlight(); showBanner(`🏁 ผ่านห่วง ${raceIdx}/6 · +3🪙`); }
    }
    renderRaceHud();
  }

  // 🔋 แบตไหลลงตามเวลา · เตือนตอนต่ำ/หมด (ทุก 6 วิ ไม่ให้รก)
  const batWas=droneBat;
  droneBat=Math.max(0,droneBat-BAT_DRAIN*dt);
  if(raceOn && droneBat<=0) raceStop(false);
  if(droneBat<=0 && batWas>0) showBanner('🔋 แบตหมด! บินอืดลง — เก็บตัวอักษรเพื่อชาร์จ');
  else if(droneBat<BAT_LOW && now-droneBatWarnAt>6000){ droneBatWarnAt=now; showBanner('🪫 แบตใกล้หมด — เก็บตัวอักษร/บินเฉียดเพื่อชาร์จ'); }

  if(hudInstEl){
    const spd=Math.round(Math.hypot(hVel.x,hVel.z)*3.6);
    const bat=Math.round(droneBat);
    const icon=droneCharging?'⚡':(bat<BAT_LOW?'🪫':'🔋');
    hudInstEl.textContent=`🔴 REC · ▲ ${Math.max(0,p.y-DRONE_R).toFixed(0)}m · 🚀 ${spd} กม./ชม. · ${icon} ${bat}%`+
      (droneCharging?' กำลังชาร์จ':'')+(propBroken?' · 🌀 ใบพัดหัก':'');
    hudInstEl.classList.toggle('bat-low', bat<BAT_LOW);
  }
  // 🌀 ใบพัดหมุนเร็วขึ้นตามคันเร่ง (ความเร็วราบ + ไต่ระดับขึ้น) · ชนแล้วสตอลช้าลงชั่วครู่ — เขียน DOM เฉพาะตอนค่าขยับจริง
  if(propsEl){
    const load=Math.min(1, Math.hypot(hVel.x,hVel.z)/DRONE_VMAX*.75 + Math.max(0,col)*.4);
    const dur=now<propStallUntil ? .95 : .34-.22*load;
    if(Math.abs(dur-propSpinCur)>.012){ propSpinCur=dur; propsEl.style.setProperty('--pspin',dur.toFixed(3)+'s'); }
  }
  DroneSound.update(col,Math.hypot(hVel.x,hVel.z),dt);
}

/* 💨 โบนัสบินเฉียด — เรียกทุกเฟรมด้วยระยะห่างกำแพงที่ใกล้สุด (d)
   เข้าเขตเสี่ยง (d<enterR) แล้วถอยออกพ้น (d>exitR) โดยไม่ชนระหว่างนั้น = ได้เหรียญค่าความเสี่ยง
   ยิ่งเฉียดใกล้ (d<superR) + คอมโบต่อเนื่อง = ยิ่งได้เยอะ · ชน = ริบโบนัส+รีเซ็ตคอมโบ */
function nearMissTick(d, now, enterR, exitR, superR){
  if(d<enterR){
    nmActive=true;
    if(d<nmMin) nmMin=d;
  }else if(nmActive && d>exitR){
    if(!nmCrashed && now-nmLastAt>700){
      nmLastAt=now; nmCombo++;
      const record=nmCombo>(state.bestCombo||0);             // 🏆 คอมโบเฉียดสูงสุดตลอดกาล
      if(record){ state.bestCombo=nmCombo; saveState(); }
      const superClose=nmMin<superR;
      const hot=nmCombo>=3;                                 // 🔥 คอมโบไฟลุก (≥3): โบนัสพิเศษ+เอฟเฟกต์+เสียงเชียร์
      let bonus=(superClose?4:2)+Math.min(4,nmCombo-1);     // คอมโบเพิ่มสูงสุด +4
      if(hot) bonus+=2;                                     // โบนัสไฟลุก
      addCoins(bonus); sessionCoins+=bonus;
      if(M.drone) droneBatAdd(BAT_NEARMISS);                // 🔋 บินเฉียดรอด = ชาร์จแบตคืนนิดหน่อย
      if(state.haptic!==false && navigator.vibrate) navigator.vibrate(hot?[20,30,20]:25);
      showNearMiss(superClose,bonus,nmCombo,hot,record&&nmCombo>=3);
      if(hot){ comboCheer(nmCombo); comboFlash(nmCombo>=5?2:1); } else sfx.coin();
      if(superClose) awardDaredevil();                      // 🎯 นับสถิติผาดโผน → เข็มนักบินผาดโผน
      renderHudTop();
    }
    nmActive=false; nmMin=99; nmCrashed=false;
  }
}
function showNearMiss(superClose,bonus,combo,hot,record){
  if(!nmPopEl) return;
  const cmb=combo>1?` <b>×${combo}</b>`:'';
  const flame=combo>=5?'🔥🔥 ':(hot?'🔥 ':'');
  const label=superClose?'เฉียดสุดๆ!':'เฉียดหวุดหวิด!';
  const rec=record?` <span class="nm-rec">🏆 สถิติใหม่!</span>`:'';
  nmPopEl.innerHTML=`${flame}💨 ${label}${cmb} <span class="nm-coin">+${bonus}🪙</span>${rec}`;
  nmPopEl.className='adv-hud'+(combo>=5?' combo-fire':(hot?' combo-hot':''));
  void nmPopEl.offsetWidth; nmPopEl.classList.add('show');
}
/* 🎯 นับ "บินเฉียดสุดๆ" สะสม → ปลดเข็มนักบินผาดโผน (สไตล์เดียวกับเข็มสายฟ้า/นักบิน) */
function awardDaredevil(){
  state.daredevilCount=(state.daredevilCount||0)+1;
  const tier=DAREDEVIL_TIERS.filter(t=>state.daredevilCount>=t[0]).pop();
  if(tier && tier[1]>(state.daredevilBadge||0)){
    state.daredevilBadge=tier[1];
    renderBoard();                                          // อัปเดตเข็มท้ายชื่อในกระดานคะแนนทันที
    setTimeout(()=>{
      if(!running) return;
      celebrateBadge(daredevilEmoji(tier[1]), `ได้${DAREDEVIL_TIER_UI[tier[1]]}!`,
        `บินเฉียดสุดๆ ครบ ${tier[0]} ครั้ง — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกแล้ว 🎉`);
      if(typeof checkCrown === 'function') checkCrown();     // 👑 เช็กเข็มลับ (ครบ 4 สาย)
      if(myRef) sendPos(true);                              // อัปเดตชื่อ+เข็มบนหัวทุกเครื่อง
    }, 1400);
  }
  saveState();
}
/* 🎉 เสียงเชียร์คอมโบ — อาร์เพจโจขึ้นบันได (ยิ่งคอมโบยิ่งหลายโน้ต) ใช้ ctx ของเครื่องที่กำลังบิน */
function comboCheer(combo){
  if(!state.sound) return;
  const S=M.drone?DroneSound:HeliSound;
  S.ensureCtx(); const ctx=S.ctx; if(!ctx) return;
  const t=ctx.currentTime, notes=[523,659,784,1047,1319];
  const n=Math.min(notes.length, 2+Math.floor(combo/2));
  for(let i=0;i<n;i++){
    const o=ctx.createOscillator(); o.type='triangle'; o.frequency.value=notes[i];
    const g=ctx.createGain();
    g.gain.setValueAtTime(.0001,t+i*.07);
    g.gain.exponentialRampToValueAtTime(.14,t+i*.07+.02);
    g.gain.exponentialRampToValueAtTime(.001,t+i*.07+.22);
    o.connect(g); g.connect(S.master||ctx.destination); o.start(t+i*.07); o.stop(t+i*.07+.24);
  }
}
/* ไฟลุกวาบขอบจอตอนคอมโบร้อน (1=ทอง · 2=แดงส้มแรงกว่า) */
function comboFlash(level){
  if(!comboFxEl) return;
  comboFxEl.className=''; void comboFxEl.offsetWidth;
  comboFxEl.classList.add('on','lv'+level);
}
/* ============================================================
   🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
   จอยซ้าย/WASD = คันเร่ง-เบรก + เลี้ยว · H/ปุ่ม 📯 = แตร · ขับชนตัวอักษรเก็บ
   ============================================================ */
function driveCell(x,z){                 // 0=นอกถนน 1=ถนน 2=แม่น้ำ
  const D=worlds.drive.d;
  const gx=Math.floor((x+D.GOFF)/D.GS), gz=Math.floor((z+D.GOFF)/D.GS);
  if(gx<0||gz<0||gx>=D.GW||gz>=D.GW) return 0;
  return D.grid[gz*D.GW+gx];
}
function nearestStreet(x,z){             // ชื่อถนนจริงที่กำลังวิ่งอยู่ (โชว์บน OSD)
  const D=worlds.drive.d; let best=26, nm='';
  for(const s of D.nameSegs){
    const dx=s[2]-s[0], dz=s[3]-s[1], L2=dx*dx+dz*dz||1e-9;
    let t=((x-s[0])*dx+(z-s[1])*dz)/L2; t=t<0?0:(t>1?1:t);
    const d=Math.hypot(x-s[0]-dx*t, z-s[1]-dz*t);
    if(d<best){ best=d; nm=s[4]; }
  }
  return nm;
}
function collideCar(p){
  const D=worlds.drive.d, CR=1.15;       // รัศมีตัวรถ
  let hit=false;
  const list=D.solidGrid[Math.floor(p.x/D.SCELL)+','+Math.floor(p.z/D.SCELL)]||[];
  for(const s of list){
    if(s.t===2){                          // วงกลม (เกาะกลางวงเวียน) = ดันออกตามรัศมี
      const ex=p.x-s.x, ez=p.z-s.z, d=Math.hypot(ex,ez), min=s.r+CR;
      if(d<min){ const push=(min-d)/(d||1e-6); p.x+=ex*push; p.z+=ez*push; hit=true; }
    }else if(s.t===0){                    // ตึกแถว = กล่องหมุนรอบแกน y
      const c=Math.cos(s.rot), si=Math.sin(s.rot);
      const dx=p.x-s.x, dz=p.z-s.z;
      const lx=dx*c-dz*si, lz=dx*si+dz*c;                    // โลก→เฟรมตึก (Ry(-rot))
      const ox=s.hx+CR-Math.abs(lx), oz=s.hz+CR-Math.abs(lz);
      if(ox>0 && oz>0){
        let px=0,pz=0;
        if(ox<oz) px=lx>=0?ox:-ox; else pz=lz>=0?oz:-oz;     // ดันออกแกนที่ทะลุน้อยสุด
        p.x+=px*c+pz*si; p.z+=-px*si+pz*c;                   // เฟรมตึก→โลก
        hit=true;
      }
    }else{                                // ตึกจริง = กำแพงตามขอบ polygon จริง
      const dx=s.x2-s.x1, dz=s.z2-s.z1, L2=dx*dx+dz*dz||1e-9;
      let t=((p.x-s.x1)*dx+(p.z-s.z1)*dz)/L2; t=t<0?0:(t>1?1:t);
      const qx=s.x1+dx*t, qz=s.z1+dz*t;
      const ex=p.x-qx, ez=p.z-qz, d=Math.hypot(ex,ez);
      if(d<CR){ const push=(CR-d)/(d||1e-6); p.x+=ex*push; p.z+=ez*push; hit=true; }
    }
  }
  return hit;
}
/* 🚦 รอบ 132→135: เปิด/ปิดไฟเลี้ยว — จำมุมตอนเปิดไว้ให้ดับเองหลังเลี้ยวเสร็จ + ประกาศให้เพื่อนเห็นทันที (field tl)
   knob บนก้านโยกขยับตามสถานะ: บน=ไฟซ้าย ล่าง=ไฟขวา กลาง=ปิด (เด้งกลับตอน tlTick สั่ง tlSet(0)) */
function tlDotY(v){
  const d=document.getElementById('adv-tldot');
  if(d) d.style.top=(50+v*33)+'%';
}
function tlSet(v){
  tlSig=v; tlSigAt=performance.now(); tlYawOn=yaw; tlRetAt=0;
  tlClickPh=-1;                                      // 🔊 รอบ 140: เปิดปุ๊บ "ติ๊ก" ดังทันทีเฟรมแรก (เหมือนรีเลย์จริง)
  const pad=document.getElementById('adv-tlpad');
  if(pad) pad.classList.toggle('sig',v!==0);
  // 🚦 รอบ 185: แสงส้มกระพริบมุมซ้าย(v=1)/ขวา(v=2) ตรงตำแหน่งลูกศร · รอบ 187: + สะท้อนบนกระจก/ฝากระโปรง
  const gl=document.getElementById('adv-tlglow-l'), gr=document.getElementById('adv-tlglow-r');
  const rl=document.getElementById('adv-tlreflect-l'), rr=document.getElementById('adv-tlreflect-r');
  if(gl) gl.classList.toggle('on',v===1);
  if(gr) gr.classList.toggle('on',v===2);
  if(rl) rl.classList.toggle('on',v===1);
  if(rr) rr.classList.toggle('on',v===2);
  tlDotY(v===1?-1:v===2?1:0);
  if(myRef) sendPos(true);
}
/* นับ "แขนถนน" รอบจุด — sample วงกลมรัศมี 12m 16 ทิศจาก road grid นับกลุ่มถนนที่ติดกัน
   ทางตรง/โค้ง = 2 แขน · สามแยกขึ้นไป >= 3 = ทางแยกที่ต้องให้สัญญาณไฟเลี้ยว */
function driveArms(x,z){
  const on=[];
  for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    on.push(driveCell(x+Math.cos(a)*12, z+Math.sin(a)*12)===1);
  }
  let arms=0;
  for(let i=0;i<16;i++) if(on[i] && !on[(i+15)%16]) arms++;   // นับขอบขึ้นแบบวงกลม (ต้น-ปลายวงต่อกันไม่นับซ้ำ)
  return arms;
}
/* ไฟเลี้ยวดับเอง + ตรวจ "เลี้ยวที่ทางแยกโดยไม่เปิดไฟเลี้ยว" (ม.36 — ใบละ CAR_FINE_SIGNAL หักตอนออก)
   เข้าโซนแยก (แขนถนน>=3) จำมุมไว้ → ออกจากโซนแล้ว yaw เปลี่ยนเกิน ~45° = เลี้ยวจริง · ระหว่างนั้นไม่เคยเปิดไฟ = ใบสั่ง */
function tlTick(px,pz,now){
  if(tlSig){
    // 🔊 รอบ 140: เสียงรีเลย์ "ติ๊ก-ต่อก" ตามเฟสกะพริบ 400ms เดียวกับไฟเพื่อน (tlClickPh=-1 ตอนเพิ่งเปิด = ดังทันที)
    const cph=Math.floor(now/400)%2;
    if(cph!==tlClickPh){ tlClickPh=cph; CarSound.tlClick(cph===0); }
    let dy=yaw-tlYawOn; dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
    // รอบ 135: เลี้ยวเสร็จ (เกิน ~50°+คืนพวง) → หน่วง ~0.9 วิ แล้วก้านเด้งกลับเองแบบรถจริง · เปิดค้างนานเกิน 20 วิ = ดับ
    if(Math.abs(dy)>.87 && Math.abs(dSteer)<.07 && !tlRetAt) tlRetAt=now+900;
    if((tlRetAt && now>tlRetAt) || now-tlSigAt>20000) tlSet(0);
  }
  if(now-tlChkAt<200) return;                        // เช็กทางแยกทุก 200ms พอ
  tlChkAt=now;
  // 🚦 รอบ 182: เตือน+ปรับจาก "รายการทางแยก" ที่ precompute (D.junctions) — เช็กด้วยระยะ robust
  const jns=(worlds.drive.d.junctions)||[];
  // เตือนล่วงหน้า: มีแยกอยู่ข้างหน้า (ทิศ yaw) ภายใน ~24m + ยังไม่เปิดไฟ
  let jAhead=false;
  if(dSpeed>1.5){
    const fdx=-Math.sin(yaw), fdz=-Math.cos(yaw);
    for(const j of jns){ const rx=j.x-px, rz=j.z-pz, dist=Math.hypot(rx,rz);
      if(dist>2 && dist<24 && (rx*fdx+rz*fdz)/dist>0.55){ jAhead=true; break; } }
  }
  if(jAhead && !tlSig){ tlJuncWarnUntil=now+1500; if(juncEl) juncEl.style.display='block'; }
  else if(juncEl && now>tlJuncWarnUntil) juncEl.style.display='none';
  // เข้าทางแยก: อยู่ในรัศมี ~7.5m ของจุดแยก + กำลังวิ่ง → เข้าแยกแล้ว
  let inJ=false;
  if(Math.abs(dSpeed)>1.5) for(const j of jns){ if(Math.hypot(j.x-px,j.z-pz)<7.5){ inJ=true; break; } }
  if(inJ && !tlInJunc){
    if(now<tlCoolAt) return;                         // เพิ่งออกจากแยกก่อนหน้า — เว้นระยะกันนับซ้อน
    tlInJunc=true; tlYawEnter=yaw;
    // เข้าทางแยกโดยไม่เปิดไฟเลี้ยว = ปรับ 🪙5 (ผู้ใช้เคาะ) — เพดาน 40 ใบ/รอบ (ใบละ 5 เบา)
    if(!tlSig && carFines.filter(f=>f.t==='signal').length<40){
      carFines.push({t:'signal', fine:CAR_FINE_SIGNAL});
      sfx.wrong();
      const n=carFines.filter(f=>f.t==='signal').length;
      showBanner(`🚦 เข้าทางแยกไม่เปิดไฟเลี้ยว! ปรับ 🪙${CAR_FINE_SIGNAL}<br>
        <small>กดปุ่มไฟเลี้ยว ⬅️ ➡️ ก่อนถึงแยกทุกครั้งนะ · โดนแล้ว ${n} ครั้ง (หักตอนออกจากเกม)</small>`);
    }
  }else if(tlInJunc && !inJ){ tlInJunc=false; tlCoolAt=now+2500; }
}
/* ============================================================
   🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
   เฟสไฟคำนวณจากนาฬิกาเครื่อง (Date.now) — ทุกเครื่องเห็นสีเดียวกันโดยไม่ต้อง sync ผ่าน DB
   เขียว 10 วิ → เหลือง 3 วิ → แดง 11 วิ (รอบ 24 วิ · seed ต่อแยก ไฟไม่เปลี่ยนพร้อมกันทั้งเมือง)
   ============================================================ */
const TL_GREEN=10, TL_YELLOW=3;
// รอบ 183 (ผู้ใช้เคาะ): ไฟแดงโชว์ ~10 วิ · ถ้าคนเล่นมาก (peer ในโลกขับรถ >=3) ~15 วิ
function tlRedDur(){ return (Object.keys(peers).length>=3) ? 15 : 10; }
function tlightPhase(seed,nowMs,redDur){
  if(rlForce!=null) return rlForce;                        // testkit บังคับเฟส (0=เขียว 1=เหลือง 2=แดง)
  const red=redDur||10, cycle=TL_GREEN+TL_YELLOW+red;
  const t=((nowMs||Date.now())/1000+seed*5.31)%cycle;
  return t<TL_GREEN?0:(t<TL_GREEN+TL_YELLOW?1:2);
}
let tlMats=null;
function buildTrafficLights(){
  const D=worlds.drive.d;
  if(D.tlights) return;                                    // สร้างครั้งเดียว (scene โลกขับรถคงอยู่ข้ามการเข้า-ออก)
  // หาแยกใหญ่: ถนน + แขนถนน>=3 → เรียงตามระยะจากหอนาฬิกา (0,0) ให้ใจกลางเมืองได้ไฟก่อน
  // แล้ว greedy เว้นระยะ >=90m กันเสาถี่ · เพดาน 30 จุด (เดิมสแกนจากมุม → ไฟกระจุกขอบเมืองหมด)
  const cand=[];
  for(let z=-700;z<=700;z+=18)
    for(let x=-700;x<=700;x+=18)
      if(driveCell(x,z)===1 && driveArms(x,z)>=3) cand.push({x,z,d:x*x+z*z});
  cand.sort((a,b)=>a.d-b.d);
  const spots=[];
  for(const c of cand){
    if(spots.length>=30) break;
    if(spots.some(s=>Math.hypot(s.x-c.x,s.z-c.z)<90)) continue;
    spots.push(c);
  }
  if(!tlMats){
    const B=c=>new THREE.MeshBasicMaterial({color:c});
    tlMats={pole:new THREE.MeshLambertMaterial({color:0x2b363c}),
      head:new THREE.MeshLambertMaterial({color:0x11181d}),
      on: [B(0x35d94f),B(0xffc107),B(0xff2f26)],           // ติด: เขียว/เหลือง/แดง (index = เฟส)
      off:[B(0x0c3016),B(0x40330a),B(0x33100d)],           // ดับ: สีหม่นของดวงเดียวกัน
      halo:[0x35d94f,0xffc107,0xff2f26]};                  // สี glow รอบดวงที่ติด (รอบ 183)
  }
  // รอบ 183: เสา/หัว/ดวงใหญ่ขึ้นให้เห็นเด่นแต่ไกล + ดวงที่ติดมี glow ล้อมรอบ
  const poleG=new THREE.CylinderGeometry(.12,.17,6.4,8);
  const headG=new THREE.BoxGeometry(.92,2.55,.6);
  const lampG=new THREE.SphereGeometry(.34,12,10);
  const haloG=new THREE.SphereGeometry(.72,12,10);
  const LAMP_Y=[5.55,6.35,7.15];                           // เขียวล่าง-เหลืองกลาง-แดงบน (แบบไฟจริง · ยกสูงตามหัวใหญ่)
  D.tlights=spots.map((s,i)=>{
    let px=s.x+8, pz=s.z+8;                                // เสาตั้งริมถนน — หาช่องนอกถนนรอบแยก
    for(let a=0;a<8;a++){
      const qx=s.x+Math.cos(a*Math.PI/4)*9, qz=s.z+Math.sin(a*Math.PI/4)*9;
      if(driveCell(qx,qz)===0){ px=qx; pz=qz; break; }
    }
    const g=new THREE.Group();
    const pole=new THREE.Mesh(poleG,tlMats.pole); pole.position.y=3.2; g.add(pole);
    const head=new THREE.Mesh(headG,tlMats.head); head.position.y=6.35; g.add(head);
    const lamps=[0,1,2].map(k=>{
      const m=new THREE.Mesh(lampG,tlMats.off[k]);
      m.position.set(0,LAMP_Y[k],.28); g.add(m); return m; // ดันดวงพ้นหน้าหัว · ทรงกลมเห็นได้ทุกทิศ
    });
    const halo=new THREE.Mesh(haloG,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.32,
      blending:THREE.AdditiveBlending,depthWrite:false}));
    halo.position.set(0,LAMP_Y[2],.28); halo.visible=false; g.add(halo);   // glow ย้ายไปดวงที่ติด
    g.position.set(px,0,pz);
    scene.add(g);
    return {x:s.x, z:s.z, seed:i, lamps, halo, st:-1};
  });
}
/* อัปเดตสีไฟ (ทุก ~250ms สลับ material ที่แชร์กัน) + ตรวจฝ่าไฟแดง: อยู่ในโซนแยกไฟแดง + ยังวิ่ง >10 กม./ชม. */
function rlTick(px,pz,now){
  const D=worlds.drive.d;
  if(!D.tlights || !D.tlights.length) return;
  if(now-rlChkAt<250) return;
  rlChkAt=now;
  const nowMs=Date.now(), redDur=tlRedDur();
  for(const L of D.tlights){
    const ph=tlightPhase(L.seed,nowMs,redDur);
    if(L.st!==ph){ L.st=ph;
      L.lamps.forEach((m,k)=>{ m.material=k===ph?tlMats.on[k]:tlMats.off[k]; });
      if(L.halo){ L.halo.position.y=[5.55,6.35,7.15][ph]; L.halo.material.color.setHex(tlMats.halo[ph]); L.halo.visible=true; }
    }
  }
  if(now<rlCoolAt) return;
  if(Math.abs(dSpeed)*3.6<=10) return;                     // ชะลอจนเกือบหยุด = ไม่นับฝ่า (เด็กหยุดรอไฟได้)
  for(const L of D.tlights){
    if(L.st!==2 || Math.hypot(L.x-px,L.z-pz)>13) continue;
    rlCoolAt=now+8000;
    if(carFines.filter(f=>f.t==='redlight').length<5){
      carFines.push({t:'redlight', fine:CAR_FINE_RED});
      sfx.wrong();
      showBanner(`🚨 ฝ่าไฟแดง! ผิด พ.ร.บ.จราจรทางบก <b>มาตรา 22</b><br>
        <small>(กฎหมายจริง: ปรับไม่เกิน 4,000 บาท) ใบสั่ง 🪙${CAR_FINE_RED} หักตอนออกจากเกม · โดนแล้ว ${carFines.filter(f=>f.t==='redlight').length} ใบ<br>เจอไฟแดงต้องหยุดรอนะ 🚦</small>`);
    }
    break;
  }
}
/* ============================================================
   🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
   ============================================================ */
/* เส้นทางแบบ Google Maps ใช้ "กริดถนนที่ขับได้" (D.grid · แข็งแรงกว่ากราฟ polyline เพราะเชื่อมทุกแยกอัตโนมัติ) */
/* 🧭 รอบ 284: เส้นทาง GPS ใช้ ngrid (ผิวถนนจริง) — grid ฟิสิกส์ทาเผื่อกว้าง ทำ A* หาเส้น/จุดเลี้ยวนอกถนน */
function cellDrivable(D,gx,gz){ return gx>=0&&gz>=0&&gx<D.GW&&gz<D.GW && (D.ngrid||D.grid)[gz*D.GW+gx]===1; }
function cellCenter(D,gx,gz){ return {x:gx*D.GS-D.GOFF+D.GS/2, z:gz*D.GS-D.GOFF+D.GS/2}; }
/* 🚗 รอบ 234: มองเห็นตรงๆบนถนนไหม (สุ่มจุดตามเส้นตรง a→b เช็กทุกช่องว่าเป็นถนน) — ใช้ string-pulling ตัด staircase ของกริด */
function losClear(D,ax,az,bx,bz){
  const dx=bx-ax, dz=bz-az, dist=Math.hypot(dx,dz);
  const steps=Math.max(1, Math.ceil(dist/(D.GS*0.5)));
  for(let i=0;i<=steps;i++){
    const t=i/steps, x=ax+dx*t, z=az+dz*t;
    const gx=Math.floor((x+D.GOFF)/D.GS), gz=Math.floor((z+D.GOFF)/D.GS);
    if(!cellDrivable(D,gx,gz)) return false;
  }
  return true;
}
function nearestDrivableCell(D,x,z){
  const cx=Math.floor((x+D.GOFF)/D.GS), cz=Math.floor((z+D.GOFF)/D.GS);
  for(let r=0;r<=12;r++) for(let ox=-r;ox<=r;ox++) for(let oz=-r;oz<=r;oz++){
    if(r>0 && Math.abs(ox)!==r && Math.abs(oz)!==r) continue;
    if(cellDrivable(D,cx+ox,cz+oz)) return [cx+ox,cz+oz];
  }
  return null;
}
/* A* บนกริดถนน คืน array {x,z} (ย่อจุดที่อยู่แนวเดียวกันแล้ว) หรือ null */
function routeGrid(D,sx,sz,tx,tz){
  const s=nearestDrivableCell(D,sx,sz), g=nearestDrivableCell(D,tx,tz);
  if(!s||!g) return null;
  const GW=D.GW, N=GW*GW, sIdx=s[1]*GW+s[0], gIdx=g[1]*GW+g[0], ggx=g[0], ggz=g[1];
  if(sIdx===gIdx) return [cellCenter(D,s[0],s[1])];
  const gsc=new Float64Array(N).fill(Infinity), came=new Int32Array(N).fill(-1), closed=new Uint8Array(N);
  const heap=[];
  const push=(i,f)=>{ heap.push({i,f}); let c=heap.length-1;
    while(c>0){ const p=(c-1)>>1; if(heap[p].f<=heap[c].f) break; const t=heap[p]; heap[p]=heap[c]; heap[c]=t; c=p; } };
  const pop=()=>{ const top=heap[0], last=heap.pop();
    if(heap.length){ heap[0]=last; let p=0; for(;;){ let l=2*p+1,r=2*p+2,m=p;
      if(l<heap.length&&heap[l].f<heap[m].f)m=l; if(r<heap.length&&heap[r].f<heap[m].f)m=r;
      if(m===p)break; const t=heap[m]; heap[m]=heap[p]; heap[p]=t; p=m; } } return top; };
  const DIRS=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.4142],[1,-1,1.4142],[-1,1,1.4142],[-1,-1,1.4142]];
  gsc[sIdx]=0; push(sIdx, Math.hypot(s[0]-ggx,s[1]-ggz));
  let guard=0;
  while(heap.length && guard++<400000){
    const cur=pop().i; if(cur===gIdx) break; if(closed[cur]) continue; closed[cur]=1;
    const cgx=cur%GW, cgz=(cur/GW)|0;
    for(const d of DIRS){
      const nx=cgx+d[0], nz=cgz+d[1]; if(!cellDrivable(D,nx,nz)) continue;
      if(d[0]&&d[1] && (!cellDrivable(D,cgx+d[0],cgz)||!cellDrivable(D,cgx,cgz+d[1]))) continue;  // กันตัดมุม
      const ni=nz*GW+nx; if(closed[ni]) continue;
      const ng=gsc[cur]+d[2];
      if(ng<gsc[ni]){ gsc[ni]=ng; came[ni]=cur; push(ni, ng+Math.hypot(nx-ggx,nz-ggz)); }
    }
  }
  if(came[gIdx]<0) return null;
  const cells=[]; let c=gIdx, gd=0;
  while(c>=0 && gd++<200000){ cells.push(c); if(c===sIdx) break; c=came[c]; }
  cells.reverse();
  const pts=cells.map(ci=>cellCenter(D, ci%GW, (ci/GW)|0));
  if(pts.length<=2) return pts;
  // ย่อจุดแนวตรง (เก็บเฉพาะจุดที่ทิศเปลี่ยน) — ลดจำนวนจุดก่อนขัดเส้น
  const simp=[pts[0]];
  for(let i=1;i<pts.length-1;i++){
    const ax=pts[i].x-pts[i-1].x, az=pts[i].z-pts[i-1].z, bx=pts[i+1].x-pts[i].x, bz=pts[i+1].z-pts[i].z;
    if(Math.abs(ax*bz-az*bx)>0.01) simp.push(pts[i]);   // ไม่ collinear = มุมของกริด
  }
  simp.push(pts[pts.length-1]);
  if(simp.length<=2) return simp;
  // 🚗 รอบ 234: string-pulling — รวมช่วงที่มองเห็นตรงๆบนถนนเป็นเส้นเดียว (ตัด staircase ของกริดบนถนนเฉียง)
  // → เหลือเฉพาะ "มุมเลี้ยวจริง" ที่แยกถนน · แก้บั๊ก GPS สั่งเลี้ยวผีตอนถนนตรง แล้วเลี้ยวตกถนน
  const out=[simp[0]]; let anchor=0;
  while(anchor<simp.length-1){
    let far=anchor+1;
    for(let j=simp.length-1;j>anchor+1;j--){
      if(losClear(D, simp[anchor].x,simp[anchor].z, simp[j].x,simp[j].z)){ far=j; break; }
    }
    out.push(simp[far]); anchor=far;
  }
  return out;
}
function pickGpsTarget(){
  const need={}; words.forEach(w=>{ for(const c of w.en) need[c]=(need[c]||0)+1; });
  Object.keys(inv).forEach(c=>{ if(need[c]) need[c]-=(inv[c]||0); });
  const cx=camera.position.x, cz=camera.position.z;
  let best=null,bestD=1e18, bn=null,bnD=1e18;
  letters.forEach(l=>{
    const d=Math.hypot(l.spr.position.x-cx,l.spr.position.z-cz);
    if(d<bestD){ bestD=d; best=l; }
    if((need[l.ch]||0)>0 && d<bnD){ bnD=d; bn=l; }
  });
  gpsTarget = bn||best; gpsMile=0; gpsLastTurn=''; gpsArrivedFor=null;
}
function gpsSpeak(text,force){
  const now=performance.now();
  if(!force && now-gpsSpokeAt<3200) return;
  if(!state.sound || !('speechSynthesis' in window)) return;
  try{
    if(!force && speechSynthesis.speaking) return;
    if(force) speechSynthesis.cancel();
    gpsSpokeAt=now;
    const u=new SpeechSynthesisUtterance(text);
    u.lang='en-US'; u.rate=1.0; u.pitch=1.0; u.volume=.95;
    let v=null; try{ if(typeof pickSpeakVoice==='function') v=pickSpeakVoice(); }catch(e){}
    if(v) u.voice=v;
    speechSynthesis.speak(u);
  }catch(e){}
}
/* 🧭 รอบ 286: เส้นนำทางสีฟ้าลอยบนถนน (แบบ Google Maps) — ribbon แบนตาม gpsRoute ที่ A* คำนวณ
   วาดใหม่ทุกเฟรม (จุดเริ่ม = ตัวรถ เลื่อนตลอด) ลง buffer จองล่วงหน้า ไม่ alloc ซ้ำ · y=0.09 เหนือเส้นประถนน (.075)
   ข้อต่อใช้ perp เฉลี่ย (miter) เส้นเลยต่อเนื่องไม่มีรอยหักตรงมุมเลี้ยว · route fallback (เชื่อมถนนไม่ถึง) ไม่วาด */
let navLineMesh=null, navLinePos=null;
const NAVLINE_W=1.15, NAVLINE_MAXP=200;                     // ครึ่งกว้าง 1.15ม. · จุดสูงสุด/เส้น
function navLineEnsure(){
  if(navLineMesh) return;
  navLinePos=new Float32Array((NAVLINE_MAXP-1)*6*3);
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(navLinePos,3));
  navLineMesh=new THREE.Mesh(g, new THREE.MeshBasicMaterial({color:0x2f9cff, transparent:true, opacity:.55,
    depthWrite:false, side:THREE.DoubleSide}));
  navLineMesh.renderOrder=2; navLineMesh.frustumCulled=false;   // เส้นยาวคดเคี้ยว bounding เพี้ยนง่าย — วาดเสมอ
  worlds.drive.scene.add(navLineMesh);
}
function navLineHide(){ if(navLineMesh) navLineMesh.visible=false; }
function navLineUpdate(cx,cz){
  if(!gpsRoute || gpsRoute.fallback || gpsWpi>=gpsRoute.length){ navLineHide(); return; }
  navLineEnsure();
  const pts=[{x:cx,z:cz}];
  for(let i=gpsWpi;i<gpsRoute.length;i++) pts.push(gpsRoute[i]);
  const P=[pts[0]];                                          // ตัดจุดชิดกัน (<0.6ม.) กัน perp เพี้ยน
  for(let i=1;i<pts.length;i++){ const q=P[P.length-1];
    if(Math.hypot(pts[i].x-q.x, pts[i].z-q.z)>0.6) P.push(pts[i]); }
  if(P.length<2){ navLineHide(); return; }
  if(P.length>NAVLINE_MAXP) P.length=NAVLINE_MAXP;
  const per=[];
  for(let i=0;i<P.length;i++){
    const a=P[Math.max(0,i-1)], b=P[Math.min(P.length-1,i+1)];
    const dx=b.x-a.x, dz=b.z-a.z, L=Math.hypot(dx,dz)||1e-6;
    per.push([-dz/L*NAVLINE_W, dx/L*NAVLINE_W]);
  }
  const y=0.09, arr=navLinePos; let o=0;
  for(let i=0;i<P.length-1;i++){
    const ax=P[i].x+per[i][0],   az=P[i].z+per[i][1],   bx=P[i].x-per[i][0],   bz=P[i].z-per[i][1];
    const ex=P[i+1].x+per[i+1][0], ez=P[i+1].z+per[i+1][1], fx=P[i+1].x-per[i+1][0], fz=P[i+1].z-per[i+1][1];
    arr[o++]=ax;arr[o++]=y;arr[o++]=az; arr[o++]=bx;arr[o++]=y;arr[o++]=bz; arr[o++]=ex;arr[o++]=y;arr[o++]=ez;
    arr[o++]=bx;arr[o++]=y;arr[o++]=bz; arr[o++]=fx;arr[o++]=y;arr[o++]=fz; arr[o++]=ex;arr[o++]=y;arr[o++]=ez;
  }
  navLineMesh.visible=true;
  navLineMesh.geometry.setDrawRange(0,(P.length-1)*6);
  navLineMesh.geometry.attributes.position.needsUpdate=true;
}
function tickGps(now){
  const D=worlds.drive.d;
  // เป้าหมายหาย (เก็บได้/ย้าย) → เลือกใหม่ + ประกาศ + ล้างเส้นทางเก่า
  if(!gpsTarget || letters.indexOf(gpsTarget)<0){
    pickGpsTarget(); gpsRoute=null; gpsRouteFor=null;
    if(gpsTarget) gpsSpeak('Next letter '+gpsTarget.ch.toUpperCase()+'.',true);
  }
  const box=gpsArrowEl?gpsArrowEl.parentElement.parentElement:null;
  if(!gpsTarget){ if(box) box.style.display='none'; return; }
  if(box) box.style.display='';
  const cx=camera.position.x, cz=camera.position.z;
  const tx=gpsTarget.spr.position.x, tz=gpsTarget.spr.position.z;
  const finalDist=Math.hypot(tx-cx,tz-cz);

  // (re)route ตามถนนจริง — เปลี่ยนเป้า / ออกนอกเส้นทาง / ครบเวลา
  const strayed = gpsRoute && gpsWpi<gpsRoute.length &&
    Math.hypot(gpsRoute[Math.min(gpsWpi,gpsRoute.length-1)].x-cx, gpsRoute[Math.min(gpsWpi,gpsRoute.length-1)].z-cz)>28;
  if(!gpsRoute || gpsRouteFor!==gpsTarget || (now-gpsRouteAt>1200 && strayed)){
    gpsRouteAt=now; gpsRouteFor=gpsTarget;
    let path=routeGrid(D, cx,cz, tx,tz);
    if(path && path.length){
      path.push({x:tx,z:tz});                          // ต่อจุดสุดท้ายไปที่ตัวอักษรจริง
      for(let i=1;i<path.length-1;i++){                // precompute ทิศเลี้ยวแต่ละจุด
        // 🚗 รอบ 234: ข้ามช่วงสั้น (<9ม.) — ทิศของช่วงสั้นเป็น noise (โดยเฉพาะช่วงสุดท้ายไปตัวอักษร) → กันจุดเลี้ยวผี
        const s1=Math.hypot(path[i].x-path[i-1].x, path[i].z-path[i-1].z);
        const s2=Math.hypot(path[i+1].x-path[i].x, path[i+1].z-path[i].z);
        if(s1<9 || s2<9){ path[i].turn='straight'; continue; }
        const a=Math.atan2(path[i].x-path[i-1].x, -(path[i].z-path[i-1].z));
        const b=Math.atan2(path[i+1].x-path[i].x, -(path[i+1].z-path[i].z));
        let d=b-a; d=((d+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
        path[i].turn = Math.abs(d)<0.5?'straight':(d>0?'right':'left');
      }
      gpsRoute=path; gpsWpi=path.length>1?1:0;
    } else { gpsRoute=[{x:tx,z:tz}]; gpsWpi=0; }        // fallback เส้นตรง (เชื่อมถนนไม่ถึง)
  }
  // ผ่าน waypoint ที่ถึงแล้ว
  while(gpsWpi<gpsRoute.length-1 && Math.hypot(gpsRoute[gpsWpi].x-cx,gpsRoute[gpsWpi].z-cz)<9) gpsWpi++;
  const wp=gpsRoute[Math.min(gpsWpi,gpsRoute.length-1)];
  // ระยะที่เหลือ "ตามถนน"
  let remain=Math.hypot(wp.x-cx,wp.z-cz);
  for(let i=gpsWpi;i<gpsRoute.length-1;i++) remain+=Math.hypot(gpsRoute[i+1].x-gpsRoute[i].x,gpsRoute[i+1].z-gpsRoute[i].z);
  // หาเลี้ยวถัดไป + ระยะถึงจุดเลี้ยว (ตามถนน) — คำนวณก่อนโชว์ เพื่อโชว์ระยะถึง "จุดเลี้ยว" ตอนใกล้เลี้ยว
  let turnDir='straight', turnDist=Math.hypot(wp.x-cx,wp.z-cz);
  for(let i=gpsWpi;i<gpsRoute.length-1;i++){
    if(gpsRoute[i].turn && gpsRoute[i].turn!=='straight'){ turnDir=gpsRoute[i].turn; break; }
    turnDist+=Math.hypot(gpsRoute[i+1].x-gpsRoute[i].x,gpsRoute[i+1].z-gpsRoute[i].z);
  }
  const turning=(turnDir!=='straight' && turnDist<70);   // มีเลี้ยวใกล้ (<70ม.) = โหมดเตือนเลี้ยว
  // ลูกศรชี้ waypoint ถัดไป (ตามแนวถนน)
  let rel=Math.atan2(wp.x-cx,-(wp.z-cz))+yaw;
  rel=((rel+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
  if(gpsArrowEl) gpsArrowEl.style.transform='rotate('+(rel*180/Math.PI).toFixed(0)+'deg)';
  // ระยะที่โชว์ = ถึงจุดเลี้ยวถ้ากำลังจะเลี้ยว (แม่นกว่า · ไม่ใช่ระยะถึงตัวอักษร) ไม่งั้น = ระยะที่เหลือ
  const showDist=turning?turnDist:remain;
  if(gpsDistEl) gpsDistEl.textContent = showDist>=1000?(showDist/1000).toFixed(1)+' กม.':Math.round(showDist)+' ม.';
  if(gpsLetEl) gpsLetEl.textContent = gpsTarget.ch.toUpperCase();
  // ป้ายคำสั่ง: ใกล้มาก (<16ม.) = "เลี้ยว…เลย" · ไกลกว่า = "เลี้ยว…" (เตือนล่วงหน้า) · ไม่มีเลี้ยว = ตรงไป
  const turnLabel = turning ? (turnDist<16 ? {left:'เลี้ยวซ้ายเลย',right:'เลี้ยวขวาเลย'}[turnDir] : {left:'เลี้ยวซ้าย',right:'เลี้ยวขวา'}[turnDir]) : 'ตรงไป';
  if(gpsTurnEl) gpsTurnEl.textContent = turnLabel;
  // เสียงนำทางแบบ Google Maps
  if(finalDist<9){
    if(gpsArrivedFor!==gpsTarget){ gpsArrivedFor=gpsTarget; gpsSpeak('You have arrived at letter '+gpsTarget.ch.toUpperCase()+'.',true); }
    return;
  }
  if(turnDir!=='straight'){
    const mile = turnDist<20?20 : turnDist<45?45 : turnDist<95?95 : 0;
    if(mile && (mile!==gpsMile || turnDir!==gpsLastTurn)){
      gpsMile=mile; gpsLastTurn=turnDir;
      gpsSpeak(mile<=20 ? 'Turn '+turnDir+' now.' : 'In '+mile+' meters, turn '+turnDir+'.');
    }
  }else{
    const mile = remain<45?45 : remain<130?130 : 0;
    if(mile && (mile!==gpsMile || gpsLastTurn!=='straight')){ gpsMile=mile; gpsLastTurn='straight';
      gpsSpeak('Continue straight for '+mile+' meters.'); }
  }
}
function tickDrive(dt,now){
  const D=worlds.drive.d;
  let th=0, sd=0;
  if(keys.KeyW||keys.ArrowUp) th+=1;
  if(keys.KeyS||keys.ArrowDown) th-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(joy.on){ th=-joy.dy; sd=joy.dx; }
  if(padSt) sd=padSteer;                     // 🎛️ ปุ่มคอนโซล (รอบ 127) — ชนะ joystick เฉพาะแกนของตัวเอง
  if(padTh) th=gearR?-1:1;                   // คันเร่งกดค้าง · เกียร์ R = ถอยหลัง (รอบ 139) · ปล่อย = แรงต้านชลอจนหยุดเอง
  if(padBr) th=0;                            // 🦶 รอบ 139: เบรคชนะคันเร่ง (เบรคอย่างเดียว ไม่สลับไปถอย)
  if(!carEngineOn || carStartOpen) th=0;     // 🚔 รอบ 128: เครื่องยังไม่ติด/ยังไม่กดออกรถ → คันเร่งไม่ทำงาน
  if(keys.KeyH && now-carHornAt>500){ carHornAt=now; CarSound.horn(); }
  // 🔊 รอบ 140: "ติ๊ด ติ๊ด" ถอยหลัง — เกียร์ R (มือถือ) หรือกำลังวิ่งถอยจริง (คีย์บอร์ด S) · ทุก 600ms
  if(carEngineOn && !carStartOpen && (gearR || dSpeed<-.5) && now-carRevBeepAt>600){
    carRevBeepAt=now; CarSound.revBeep();
  }

  const onRoad=driveCell(camera.position.x,camera.position.z);
  const vmax=onRoad===1?CAR_VMAX*drivePerf.vmaxMul:CAR_VMAX_OFF;   // 🚗 รอบ 232: ท็อปสปีดตามคัน (นอกถนนเท่ากันหมด)
  if(th>0) dSpeed+=CAR_ACCEL*drivePerf.accMul*(onRoad===1?1:.55)*th*dt;   // อัตราเร่งตามคัน
  else if(th<0){
    if(dSpeed>.3) dSpeed=Math.max(0,dSpeed-CAR_BRAKE*dt);          // เบรกก่อน
    else dSpeed=Math.max(-CAR_VREV,dSpeed+CAR_ACCEL*.7*th*dt);     // จอดแล้วกดค้าง = ถอยหลัง
  }
  if(padBr) dSpeed=dSpeed>0?Math.max(0,dSpeed-CAR_BRAKE*1.2*dt)    // 🦶 รอบ 139: ปุ่มเบรค — หน่วงเข้าหา 0 ทั้งเดินหน้า/ถอยหลัง
                           :Math.min(0,dSpeed+CAR_BRAKE*1.2*dt);
  dSpeed*=Math.max(0,1-(onRoad===1?.16:1.15)*dt);                  // แรงต้าน (รอบ 128: ลดลงให้ไต่ถึง 200 กม./ชม. ได้)
  if(dSpeed>vmax) dSpeed=Math.max(vmax,dSpeed-CAR_BRAKE*.8*dt);

  /* 🏁 พวงมาลัยฟีล R4: ไต่เข้าโค้งนุ่ม (attack ช้ากว่า release) + ลดองศาตามความเร็วพอประมาณ */
  const tgt=sd*CAR_STEER_MAX*drivePerf.steerMul/(1+Math.abs(dSpeed)*.045);   // 🚗 รอบ 232: เกาะถนน/เข้าโค้งตามคัน
  const ramp=Math.abs(tgt)>Math.abs(dSteer)?3.8:6.0;               // กดเลี้ยว=ค่อยๆ หัก · ปล่อย=คืนไวกว่า
  dSteer+=(tgt-dSteer)*Math.min(1,dt*ramp);
  let yawRate=(dSpeed/CAR_WB)*Math.tan(dSteer);
  const maxYaw=1.9/(1+Math.abs(dSpeed)*.06);                       // จำกัดอัตราหมุนหัวรถ ยิ่งเร็วยิ่งวงกว้าง
  const yrApplied=Math.max(-maxYaw,Math.min(maxYaw,yawRate));      // 🏎️ รอบ 142: เก็บอัตราหมุนจริงไว้คิดแรง G ด้านข้าง
  yaw-=yrApplied*dt;

  /* ทิศวิ่งจริงไถลตามหัวรถแบบ Ridge Racer — grip ลดเมื่อเลี้ยวแรงตอนเร็ว = สไลด์เข้าโค้งลื่นๆ */
  const sin=Math.sin(yaw), cos=Math.cos(yaw);
  const grip=Math.min(1, dt*(6.5-Math.min(3.8,Math.abs(dSteer)*Math.abs(dSpeed)*.38)));
  dVelX+=(-sin*dSpeed-dVelX)*grip;
  dVelZ+=(-cos*dSpeed-dVelZ)*grip;
  const p={x:camera.position.x+dVelX*dt, z:camera.position.z+dVelZ*dt};
  const dc=Math.hypot(p.x,p.z);
  if(dc>D.rad-25){ const f=(D.rad-25)/dc; p.x*=f; p.z*=f; dSpeed*=.5; dVelX*=.5; dVelZ*=.5; }  // สุดขอบเมือง
  if(driveCell(p.x,p.z)===2){ p.x=camera.position.x; p.z=camera.position.z; dSpeed*=-.3; dVelX*=-.3; dVelZ*=-.3; }  // ริมแม่น้ำ (ข้ามได้เฉพาะสะพาน)
  const hitSpd=Math.hypot(dVelX,dVelZ);
  if(collideCar(p)){
    if(hitSpd>7 && now-hHitAt>900){
      hHitAt=now; damagePlayer(Math.min(30,Math.round(hitSpd*1.3))); CarSound.thud();
      // 🔧 รอบ 130: ชนสิ่งของแรง = ค่าซ่อมรถ 🪙1,000 (สะสม หักตอนออกพร้อมใบสั่ง · เพดาน 3 ครั้ง/รอบ)
      if(carFines.filter(f=>f.t==='crash').length<3){
        carFines.push({t:'crash', fine:CAR_REPAIR_FEE});
        showBanner(`🔧 รถชนแรง! ค่าซ่อม <b>🪙${fmtNum(CAR_REPAIR_FEE)}</b><br><small>จ่ายตอนออกจากเกม · ชนแล้ว ${carFines.filter(f=>f.t==='crash').length} ครั้ง</small>`);
      }
    }
    else if(hitSpd>2.5) CarSound.thud();
    dSpeed*=.12; dVelX*=.12; dVelZ*=.12;
  }
  /* 🚗💥 รอบ 132+133: ชนรถผู้เล่นอื่น (peer = รถบล็อก ระยะ ~2.5m + cooldown 4 วิกันรัว)
     "ฝ่ายชน" = เราวิ่งอยู่ (hitSpd>2) และทิศวิ่งพุ่ง "เข้าหา" เขา — จอดเฉยๆ/ถูกคนอื่นมาชน ไม่โดนอะไรเลย
     ครั้งที่ 1-2: มีประกัน=ประกันจ่าย · ไม่มี=ค่าเสียหาย CAR_HITCAR_FEE/ครั้ง (เตือนแรงตอนครั้งที่ 2)
     ครั้งที่ 3 = เจตนาชน: ค่าซ่อมรถ CAR_RAM_FEE ครั้งเดียว/รอบ — ประกันไม่คุ้มครองการเจตนาชน */
  if(hitSpd>2 && now-carPeerHitAt>4000){
    for(const uid in peers){
      const pr=peers[uid];
      if(!pr.blk) continue;
      const dxp=pr.cur.x-p.x, dzp=pr.cur.z-p.z;
      if(Math.hypot(dxp,dzp)<2.5 && dVelX*dxp+dVelZ*dzp>0){
        carPeerHitAt=now; carPeerHits++; CarSound.thud();
        dSpeed*=.15; dVelX*=.15; dVelZ*=.15;
        const warn2=carPeerHits===2?`<br>⚠️ <b>ชนอีกครั้ง = เจตนาชน ค่าซ่อมรถ 🪙${fmtNum(CAR_RAM_FEE)} (ประกันไม่คุ้มครอง!)</b>`:'';
        if(carPeerHits>=3){
          if(carPeerHits===3){
            carFines.push({t:'ram', fine:CAR_RAM_FEE});
            sfx.wrong();
            showBanner(`🚨 เจตนาชนรถคนอื่นครบ 3 ครั้ง! ค่าซ่อมรถ <b>🪙${fmtNum(CAR_RAM_FEE)}</b><br><small>🛡️ ประกันไม่คุ้มครองการเจตนาชน · จ่ายตอนออกจากเกม</small>`);
          }else{
            showBanner(`🚗💥 ชนรถของ <b>${escapeHTML(pr.n)}</b>!<br><small>โดนค่าซ่อมเจตนาชนไปแล้วรอบนี้ — ขับดีๆ นะ 🙏</small>`);
          }
        }else if(typeof myCar==='function' && myCar() && myCar().insured){   // 🚗 รอบ 211: ประกันของคันที่ขับอยู่
          showBanner(`🚗💥 ชนรถของ <b>${escapeHTML(pr.n)}</b>!<br><small>🛡️ ประกันเป็นผู้จ่ายให้แล้ว — ขับระวังขึ้นอีกนิดนะ${warn2}</small>`);
        }else{
          carFines.push({t:'hitcar', fine:CAR_HITCAR_FEE});
          sfx.wrong();
          showBanner(`🚗💥 ชนรถของ <b>${escapeHTML(pr.n)}</b>! ไม่มีประกัน = ค่าเสียหาย <b>🪙${fmtNum(CAR_HITCAR_FEE)}</b><br><small>จ่ายตอนออกจากเกม · มีประกัน (หมวดยานพาหนะ) ครั้งหน้าประกันจ่ายให้${warn2}</small>`);
        }
        break;
      }
    }
  }
  camera.position.set(p.x, CAR_EYE+Math.sin(now/95)*Math.min(.045,Math.abs(dSpeed)*.002), p.z);

  dLook*=Math.max(0,1-dt*2.6);                                     // หันมองข้างแล้วค่อยๆ เด้งกลับ
  dCamYaw+=(yaw-dCamYaw)*Math.min(1,dt*6.5);                       // กล้องหันตามหัวรถแบบหน่วง ไม่สะบัด
  camera.rotation.set(0,0,0);
  camera.rotateY(dCamYaw+dLook-dSteer*.10*Math.min(1,Math.abs(dSpeed)/10));  // ชายตามองเข้าโค้งนิดๆ แบบ R4
  camera.rotateX(-.02);                                            // ก้มนิดเดียว เห็นฝากระโปรง
  /* 🏎️ รอบ 142: ตัวถังโคลงตามแรง G ด้านข้างแบบรถจริง (แทนเอียงเข้าโค้งตาม dSteer แบบ arcade เดิม)
     เลนส์ออก "นอกโค้ง" ตามแรงเหวี่ยง · สปริงหน่วงต่ำ (ζ~0.58) → มีโยกตัวซ้าย-ขวาค้างนิดๆ ตอนหักพวง/คืนพวง */
  const latA=yrApplied*dSpeed;                                     // แรง G ด้านข้าง (rad/s × m/s ≈ m/s²)
  const rollTgt=Math.max(-.12,Math.min(.12, latA*.008));
  const sdt=Math.min(dt,.05);                                      // กันสปริงเด้งหลุดตอนเฟรมกระตุก
  dRollV+=((rollTgt-dRoll)*60 - dRollV*9)*sdt;
  dRoll+=dRollV*sdt;
  camera.rotateZ(dRoll);

  // เก็บตัวอักษร: ขับชน (ไม่ต้องจอด)
  for(let i=letters.length-1;i>=0;i--){
    const lp=letters[i].spr.position;
    if(Math.hypot(lp.x-p.x,lp.z-p.z)<3.4){
      pickUpLetter(i);
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.7)+Math.sin(now/380+l.spr.position.x*2)*.14; });

  // พวงมาลัยหมุนตามจริง (ภาพ img/car/wheel.png หรือวง CSS)
  if(carWheelEl) carWheelEl.style.transform='translateX(-50%) rotate('+(dSteer*440).toFixed(1)+'deg)';

  tickGps(now);                                                   // 🧭 GPS นำทางไปตัวอักษร
  // OSD: ความเร็ว + ชื่อถนนจริงที่กำลังวิ่ง
  if(now-carNameAt>600){ carNameAt=now; carStreet=nearestStreet(p.x,p.z); }
  if(hudInstEl){
    const kmh=Math.round(Math.abs(dSpeed)*3.6);
    hudInstEl.textContent='🚗 '+kmh+' กม./ชม.'+(onRoad===1?'':' · 🌿 นอกถนน')+(carStreet?' · 🛣️ '+carStreet:'');
  }
  /* 🚔 รอบ 128: ตรวจกฎจราจร — เร็วเกิน 90 = ใบสั่ง ม.67 (สะสม หักตอนออก) · ไม่คาดเข็มขัดแล้วขับ = ปรับ ม.123 ทันที */
  const kmhLaw=Math.abs(dSpeed)*3.6;
  const warnEl=document.getElementById('adv-lawwarn');
  if(kmhLaw>CAR_LEGAL_KMH){
    if(!carOverSpeed){
      carOverSpeed=true;
      if(carFines.filter(f=>f.t==='speed').length<5){       // เพดาน 5 ใบ/รอบ กันหมดตัว
        carFines.push({t:'speed', fine:CAR_FINE_SPEED});
        sfx.wrong();
      }
    }
    if(warnEl){
      warnEl.style.display='block';
      warnEl.innerHTML=`🚨 เร็วเกิน ${CAR_LEGAL_KMH} กม./ชม. — ผิด พ.ร.บ.จราจรทางบก <b>มาตรา 67</b> (ปรับไม่เกิน 4,000 บาท)<br>โดนใบสั่งแล้ว ${carFines.filter(f=>f.t==='speed').length} ใบ · ใบละ 🪙${CAR_FINE_SPEED} หักตอนออกจากเกม`;
    }
  }else if(kmhLaw<CAR_LEGAL_KMH-5){
    carOverSpeed=false;
    if(warnEl) warnEl.style.display='none';
  }
  if(!carBelted && !carBeltFined && kmhLaw>10 && carEngineOn && !carStartOpen){
    carBeltFined=true;
    carFines.push({t:'belt', fine:CAR_FINE_BELT});
    state.coins=Math.max(0,state.coins-CAR_FINE_BELT);       // ม.123: หักทันที (กล่องแจ้งเด้งเลย)
    saveState();
    lawNotice(`<b>🚔 ใบสั่ง! ไม่คาดเข็มขัดนิรภัย</b><br><br>
      ผิด พ.ร.บ.จราจรทางบก พ.ศ. 2522 <b>มาตรา 123</b><br>
      (กฎหมายจริง: ปรับไม่เกิน 2,000 บาท)<br><br>
      ถูกหักค่าปรับ <b style="color:#c8901a">🪙${fmtNum(CAR_FINE_BELT)}</b> จากเหรียญของหนูแล้ว<br>
      <small>คราวหน้าเลื่อนสวิตช์คาดเข็มขัดก่อนออกรถนะ 🙏</small>`);
  }
  tlTick(p.x,p.z,now);                                       // 🚦 รอบ 132: ไฟเลี้ยวดับเอง + ตรวจแยก ม.36
  rlTick(p.x,p.z,now);                                       // 🚦 รอบ 133: อัปเดตสีไฟจราจร + ตรวจฝ่าไฟแดง ม.22
  CarSound.update(th,Math.abs(dSpeed),dt);
  // 🛞 รอบ 183: เสียงยางเสียดสี — วัดความเร็ว "ด้านข้าง" ที่ไถล (velocity ตั้งฉากกับหัวรถ)
  // sin/cos = ทิศหัวรถ (คำนวณข้างบน) · cross กับ (dVelX,dVelZ) = องค์ประกอบด้านข้าง
  const _vlen=Math.hypot(dVelX,dVelZ);
  const slipPerp=(_vlen>0.6 && onRoad===1)?Math.abs(dVelX*(-cos)-dVelZ*(-sin)):0;
  CarSound.setSkid(Math.max(0,Math.min(1,(slipPerp-1.6)/6)));
  drawCarGauges();
  radioTick();                                              // 🎵 รอบ 181: จอวิทยุ + visualizer
  bobbleTick(dt, latA, dSpeed, now);                        // 🪆 รอบ 191: ตุ๊กตาหัวส่ายตามแรงเลี้ยว
}
/* ============================================================
   🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
   ตำแหน่งวงเกจวัดจากภาพจริง: ซ้าย (1096,662) r80 · ขวา (1258.5,662) r78 (ภาพ 1536×1024)
   ภาพโดน crop ด้วย object-fit:cover + object-position 50% 66% → คำนวณ scale/offset เองทุกเฟรม
   (เชื่อ getBoundingClientRect — กฎทองข้อ 3) · ไม่มีภาพ dash = ไม่วาด (แผง CSS ไม่มีวงเกจ)
   ============================================================ */
function drawCarDial(c,cx,cy,r,frac,max,step,redFrom){
  const a0=Math.PI*.75, sweep=Math.PI*1.5;                  // กวาด 270° แบบเกจรถจริง
  c.save(); c.translate(cx,cy);
  // 🚗 รอบ 230: จานเกจ (แดชบอร์ดชุดใหม่ไม่มีวงในภาพ) — จานเข้ม+ขอบเงิน → cluster สมบูรณ์ ลอดพวงมาลัย
  c.fillStyle='rgba(9,12,17,.84)'; c.beginPath(); c.arc(0,0,r*1.05,0,7); c.fill();
  c.lineWidth=Math.max(2,r*.06); c.strokeStyle='rgba(132,142,158,.82)'; c.beginPath(); c.arc(0,0,r*1.05,0,7); c.stroke();
  c.strokeStyle='rgba(228,233,240,.9)'; c.fillStyle='rgba(222,228,236,.92)';
  c.font='700 '+Math.max(7,r*.17)+'px sans-serif'; c.textAlign='center'; c.textBaseline='middle';
  const n=Math.round(max/step);
  for(let i=0;i<=n;i++){
    const a=a0+sweep*i/n, co=Math.cos(a), si=Math.sin(a);
    c.lineWidth=Math.max(1,r*.028);
    c.beginPath(); c.moveTo(co*r*.88,si*r*.88); c.lineTo(co*r*.74,si*r*.74); c.stroke();
    c.fillText(String(i*step), co*r*.56, si*r*.56);
  }
  if(redFrom!=null){                                        // โซนแดงวัดรอบ
    c.strokeStyle='rgba(255,64,58,.85)'; c.lineWidth=Math.max(2,r*.055);
    c.beginPath(); c.arc(0,0,r*.81, a0+sweep*(redFrom/max), a0+sweep); c.stroke();
  }
  const a=a0+sweep*Math.max(0,Math.min(1,frac));
  c.rotate(a);
  c.shadowColor='rgba(0,0,0,.65)'; c.shadowBlur=r*.07;      // เข็มแดงเรียว + เงา
  c.fillStyle='#ff4433';
  c.beginPath(); c.moveTo(-r*.17,0); c.lineTo(0,-r*.04); c.lineTo(r*.8,0); c.lineTo(0,r*.04);
  c.closePath(); c.fill();
  c.shadowBlur=0; c.rotate(-a);
  c.fillStyle='#14171c'; c.beginPath(); c.arc(0,0,r*.12,0,7); c.fill();
  c.strokeStyle='#454c56'; c.lineWidth=Math.max(1,r*.03); c.stroke();
  c.restore();
}
function drawCarGauges(){
  if(!carGaugeCtx) return;
  const vw=window.innerWidth, vh=window.innerHeight, dpr=Math.min(window.devicePixelRatio||1,2);
  const c=carGaugeCtx;
  if(carGaugeCv.width!==Math.round(vw*dpr)||carGaugeCv.height!==Math.round(vh*dpr)){
    carGaugeCv.width=Math.round(vw*dpr); carGaugeCv.height=Math.round(vh*dpr);
  }
  c.setTransform(dpr,0,0,dpr,0,0);
  c.clearRect(0,0,vw,vh);
  // 🚗 รอบ 230: เกจ 2 วง (สปีด+รอบ) ลอดช่องบนพวงมาลัยแบบรถจริง — อิงตำแหน่ง "นิ่ง" ของพวงมาลัย
  //   (offsetLeft/Top ไม่รวม transform → พวงมาลัยหมุนแล้วเกจไม่สั่น · พวงมาลัย z:4 > เกจ z:3 = ทับบางส่วนสมจริง)
  if(mode!=='drive' || !carWheelEl) return;
  const ww=carWheelEl.offsetWidth, wh=carWheelEl.offsetHeight;
  if(!ww||!wh) return;
  const gcx=carWheelEl.offsetLeft;                          // translateX(-50%) → offsetLeft = จุดกึ่งกลางแนวนอน
  let gcy=carWheelEl.offsetTop + wh*0.285;                  // ช่องเปิดเหนือดุมพวงมาลัย
  const r=wh*0.105;
  gcy=Math.min(gcy, vh - r*1.25);   // 🚗 รอบ 284: พวงมาลัยถูกกดลงเกือบพ้นจอ → ยกเกจขึ้นเกาะขอบล่าง ไม่หลุดจอ
  const kmh=Math.abs(dSpeed)*3.6;
  drawCarDial(c, gcx-r*1.30, gcy, r, kmh/240, 240, 40, CAR_LEGAL_KMH);   // สปีด 0-240 · โซนแดง = เกิน 90 ผิดกฎหมาย
  drawCarDial(c, gcx+r*1.30, gcy, r, .1+(CarSound.rpm||0)*.75, 8, 1, 6.5);  // วัดรอบ (idle ~0.8)
}

/* ============================================================
   🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
   จอวางทับ "หน้าจอดำระหว่างลูกบิด 2 ปุ่ม" บนภาพ dash.png (พิกัดภาพ RADIO_RECT)
   map พิกัดภาพ→จอ สูตรเดียวกับเข็มเกจ (object-fit cover + object-position 50% 66%)
   ============================================================ */
const RADIO_RECT=[560,514,835,606];                         // 🚗 รอบ 231: จอ head-unit ค่ากลาง (fallback ถ้าไม่รู้จักคัน)
/* 🚗 รอบ 235: จอ head-unit ต่อคัน — จอดำแต่ละคันขนาด/ตำแหน่งไม่เท่ากัน (วัดจากภาพ 3d_dash_<id>.png จริง 1536×1024) */
const CAR_RADIO_RECT={
  car_01:[555,456,856,606], car_02:[585,518,821,652], car_03:[555,524,787,645],
  car_04:[506,471,789,591], car_05:[512,543,749,669], car_06:[550,500,788,606],
  car_07:[563,580,782,685], car_08:[528,598,710,700], car_09:[550,501,786,592],
  car_10:[521,520,808,669],
};
function carRadioRect(){ const c=(typeof myCar==='function'&&myCar())?myCar():null; return (c&&CAR_RADIO_RECT[c.id])||RADIO_RECT; }
let _radioVW=0,_radioVH=0;
function radioLayout(){
  if(!radioScreenEl) return;
  if(mode!=='drive' || !carDashImg || !carDashImg.parentNode){ radioScreenEl.style.display='none'; return; }
  const box=carDashImg.getBoundingClientRect();
  if(!box.width){ radioScreenEl.style.display='none'; return; }
  const s=box.width/1536, offY=Math.max(0,1024*s-box.height)*.65;   // 🚗 รอบ 231: ตรงกับ object-position 65% ของแดชบอร์ดชุดใหม่
  const gx=ix=>box.left+ix*s, gy=iy=>box.top+iy*s-offY;
  const [X0,Y0,X1,Y1]=carRadioRect();   // 🚗 รอบ 235: จอตามคันที่ขับ
  const L=gx(X0), T=gy(Y0), W=(X1-X0)*s, H=(Y1-Y0)*s;
  radioScreenEl.style.display='block';
  radioScreenEl.style.left=L+'px'; radioScreenEl.style.top=T+'px';
  radioScreenEl.style.width=W+'px'; radioScreenEl.style.height=H+'px';
  const dpr=Math.min(window.devicePixelRatio||1,2);
  radioVizCv.width=Math.round(W*dpr); radioVizCv.height=Math.round(H*dpr);
  radioVizCv.style.width=W+'px'; radioVizCv.style.height=H+'px';
  if(radioListEl){                                          // แผงรายการวางเหนือจอ (กว้างกว่าจอ ~2.6 เท่า)
    const lw=Math.max(W*2.6, 300);
    let ll=L+W/2-lw/2; ll=Math.max(6, Math.min(ll, window.innerWidth-lw-6));
    radioListEl.style.left=ll+'px'; radioListEl.style.width=lw+'px';
    radioListEl.style.bottom=(window.innerHeight-T+8)+'px';
  }
  radioSetHint();
}
function radioSetHint(){
  if(!radioHintEl||!radioScreenEl) return;
  const on=typeof Music!=='undefined' && Music.isCarOn();
  radioScreenEl.classList.toggle('playing', on);
  radioHintEl.innerHTML = on ? '' : '<b>♪ MUSIC</b><span>แตะเพื่อเปิดเพลงในรถ</span>';
}
function renderRadioList(){
  if(!radioListEl || typeof Music==='undefined') return;
  const tracks=Music.carTracks(), cur=Music.curCar(), m=Music.mode();
  const LBL={all:['REPEAT ALL','เล่นซ้ำทั้งหมด'],one:['REPEAT ONE','เล่นซ้ำเพลง'],shuffle:['SHUFFLE','สุ่มเล่น']};
  radioListEl.innerHTML=`
    <div class="rl-head"><span>🎵 CAR RADIO · เพลงในรถ</span><button class="rl-x" type="button">✕</button></div>
    <div class="rl-tracks">${tracks.map((t,i)=>`<button class="rl-track${i===cur?' on':''}" data-i="${i}" type="button"><span class="rl-eq">${i===cur?'▶':'♪'}</span>Track ${i+1}</button>`).join('')}</div>
    <div class="rl-modes">${['all','one','shuffle'].map(k=>`<button class="rl-mode${m===k?' on':''}" data-m="${k}" type="button">${LBL[k][0]}<small>${LBL[k][1]}</small></button>`).join('')}</div>
    <button class="rl-power" type="button">⏻ TURN OFF · ปิดเพลง</button>`;
}
function radioToggleList(){
  if(!radioListEl) return;
  if(radioListEl.style.display==='block'){ radioListEl.style.display='none'; return; }
  renderRadioList(); radioLayout(); radioListEl.style.display='block';
}
function drawRadioViz(){
  if(!radioVizCtx||!radioScreenEl||radioScreenEl.style.display==='none') return;
  const cv=radioVizCv, c=radioVizCtx, W=cv.width, H=cv.height;
  const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'rgba(10,28,52,.94)'); g.addColorStop(1,'rgba(3,10,24,.97)');
  c.fillStyle=g; c.fillRect(0,0,W,H);
  const on=typeof Music!=='undefined' && Music.isCarOn();
  if(!on) return;                                           // ปิด → จอมืด (ข้อความ hint HTML ทับ)
  const data=Music.vizData(), n=radioBars.length, bw=W/n;
  for(let i=0;i<n;i++){
    const v=data?data[i]/255:0;
    radioBars[i]= v>radioBars[i] ? v : radioBars[i]*0.85+v*0.15;   // ขึ้นเร็ว ตกช้า (นุ่มตา)
    const bh=Math.max(H*0.05, radioBars[i]*H*0.92), x=i*bw, y=H-bh;
    const bg=c.createLinearGradient(0,H,0,y);
    bg.addColorStop(0,'#1668b8'); bg.addColorStop(.6,'#4fc3f7'); bg.addColorStop(1,'#b6f2ff');
    c.fillStyle=bg; c.fillRect(x+bw*0.16, y, bw*0.68, bh);
    c.fillStyle='rgba(190,242,255,.95)'; c.fillRect(x+bw*0.16, y, bw*0.68, Math.max(1,H*0.03));
  }
}
function radioTick(){
  if(!radioScreenEl) return;
  if(mode!=='drive'){ if(radioScreenEl.style.display!=='none'){ radioScreenEl.style.display='none'; if(radioListEl) radioListEl.style.display='none'; } return; }
  if(radioScreenEl.style.display==='none' || window.innerWidth!==_radioVW || window.innerHeight!==_radioVH){
    _radioVW=window.innerWidth; _radioVH=window.innerHeight; radioLayout();
  }
  drawRadioViz();
}
/* ============================================================
   🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
   ยืนบนแผงหน้าปัดตรงลูกศร · "หัว" ส่ายซ้าย-ขวาตามแรงเลี้ยว (สปริงหน่วงต่ำ)
   ตำแหน่งเท้า = พิกัดภาพ dash.png (BOBBLE_FOOT) map สูตรเดียวกับจอวิทยุ/เข็มเกจ
   ============================================================ */
const BOBBLE_FOOT=[318,540];   // 🚗 รอบ 230: จุดวางเท้าตุ๊กตา — แผงเรียบฝั่งซ้ายของแดชบอร์ดชุดใหม่ (พิกัดภาพ 1536×1024)
const BOBBLE_H=372;            // ความสูงตุ๊กตา (พิกัดภาพ) · กว้าง = สูง×สัดส่วนภาพ blk (341/512)
const BOBBLE_ASPECT=341/512;
/* สปริงหัวส่าย: ζ~0.16 (โยกค้างหลายจังหวะแบบตุ๊กตาสปริงจริง) · หมุนสูงสุด ~22°
   BOB_FORCE จูนให้เลี้ยวปกติส่ายเห็นชัด (~8-12°) โค้งแรงชนเพดานแล้วสปริงกลับ */
const BOB_OMEGA=8.4, BOB_ZETA=0.16, BOB_FORCE=0.5, BOB_MAXDEG=22;
/* 🪆 รอบ 193 (ต่อยอด): ก้ม-เงยตามเร่ง/เบรก (แกนหน้า-หลัง) · สปริงชุดเดียวกัน */
const BOB_PITCH_FORCE=0.9, BOB_PITCH_MAXDEG=16;
/* สกินตุ๊กตาพิเศษ (ปลดล็อกด้วยเหรียญ · เอฟเฟกต์ CSS ล้วน ไม่มีไฟล์เพิ่ม) */
const BOBBLE_SKINS=[
  {id:'',        emoji:'🧍', name:'ปกติ',      cost:0},
  {id:'glow',    emoji:'✨', name:'เรืองแสง',  cost:2000},
  {id:'gold',    emoji:'🏅', name:'ทองคำ',     cost:6000},
  {id:'rainbow', emoji:'🌈', name:'สายรุ้ง',   cost:12000},
  {id:'ghost',   emoji:'👻', name:'ล่องหน',    cost:20000},
];
function bobbleSetAvatar(){
  if(!carBobbleImg) return;
  const id=BLOCK_AVATARS[state.blockAv]?state.blockAv:'blk1';
  if(_bobAv===id) return;                         // src เดิม cache แล้ว ไม่ยิงซ้ำ
  _bobAv=id; carBobbleImg.src=`img/blocks/${id}.png`;
  bobbleApplySkin();
}
function bobbleLayout(){
  if(!carBobbleEl) return;
  if(mode!=='drive' || !carDashImg || !carDashImg.parentNode){ carBobbleEl.style.display='none'; return; }
  const box=carDashImg.getBoundingClientRect();
  if(!box.width){ carBobbleEl.style.display='none'; return; }
  const s=box.width/1536, offY=Math.max(0,1024*s-box.height)*.65;   // 🚗 รอบ 231: ตรงกับ object-position 65% ของแดชบอร์ดชุดใหม่
  const footX=box.left+BOBBLE_FOOT[0]*s, footY=box.top+BOBBLE_FOOT[1]*s-offY;
  const h=BOBBLE_H*s, w=h*BOBBLE_ASPECT;
  carBobbleEl.style.display='';
  carBobbleEl.style.height=h+'px'; carBobbleEl.style.width=w+'px';
  carBobbleEl.style.left=(footX-w/2)+'px'; carBobbleEl.style.top=(footY-h)+'px';
}
/* อัปเดตทุกเฟรม: สปริงขับด้วยแรง G ด้านข้าง (latA) → หัวเหวี่ยง "นอกโค้ง" แล้วสปริงกลับ */
function bobbleTick(dt, latA, speed, now){
  if(!carBobbleImg || mode!=='drive') return;
  if(carBobbleEl.style.display==='none' || window.innerWidth!==_bobVW || window.innerHeight!==_bobVH){
    _bobVW=window.innerWidth; _bobVH=window.innerHeight; bobbleLayout();
  }
  const sdt=Math.min(dt,.05);
  // สปริงส่ายข้าง (rotateZ): θ'' = -ω²θ - 2ζω·θ' - (แรงข้าง)  · latA บวก/ลบ = เลี้ยวซ้าย/ขวา
  bobVel += (-BOB_OMEGA*BOB_OMEGA*bobAng - 2*BOB_ZETA*BOB_OMEGA*bobVel - latA*BOB_FORCE) * sdt;
  bobAng += bobVel*sdt;
  const maxR=BOB_MAXDEG*Math.PI/180;
  if(bobAng> maxR){ bobAng= maxR; if(bobVel>0) bobVel*=-.3; }
  if(bobAng<-maxR){ bobAng=-maxR; if(bobVel<0) bobVel*=-.3; }
  // 🪆 รอบ 193: สปริงก้ม-เงย (rotateX) ตามแรงเร่ง/เบรก (แกนหน้า-หลัง) · accel = อัตราเปลี่ยนความเร็ว
  const accel=(speed-_bobPrevSpd)/sdt; _bobPrevSpd=speed;
  bobPitchV += (-BOB_OMEGA*BOB_OMEGA*bobPitch - 2*BOB_ZETA*BOB_OMEGA*bobPitchV + accel*BOB_PITCH_FORCE) * sdt;
  bobPitch += bobPitchV*sdt;
  const maxP=BOB_PITCH_MAXDEG*Math.PI/180;
  if(bobPitch> maxP){ bobPitch= maxP; if(bobPitchV>0) bobPitchV*=-.3; }
  if(bobPitch<-maxP){ bobPitch=-maxP; if(bobPitchV<0) bobPitchV*=-.3; }
  // สั่นเบาๆ ตอนเครื่องเดิน/วิ่ง ให้ดูมีชีวิต (สเกลตามความเร็ว)
  const idle=Math.sin(now/85)*0.010*Math.min(1,Math.abs(speed)/7);
  const degZ=(bobAng+idle)*180/Math.PI, degX=bobPitch*180/Math.PI;
  carBobbleImg.style.transform=`rotateX(${degX.toFixed(2)}deg) rotate(${degZ.toFixed(2)}deg)`;
}
/* 🪆 รอบ 193: สะกิดตุ๊กตา — อัดแรงเข้าสปริงทั้ง 2 แกน + เสียง "ปิ๊ง" สังเคราะห์ */
function bobblePoke(){
  bobVel += (Math.random()<0.5?-1:1)*6.5;   // เหวี่ยงข้างแรงๆ
  bobPitchV += 5;                            // สะบัดหน้าลงนิด
  if(carBobbleEl){ carBobbleEl.classList.remove('poke'); void carBobbleEl.offsetWidth; carBobbleEl.classList.add('poke'); }
  try{
    _bobAC=_bobAC||new (window.AudioContext||window.webkitAudioContext)();
    if(_bobAC.state==='suspended') _bobAC.resume();
    const t=_bobAC.currentTime, o=_bobAC.createOscillator(), g=_bobAC.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(720,t); o.frequency.exponentialRampToValueAtTime(190,t+0.16);
    o.frequency.exponentialRampToValueAtTime(340,t+0.28);   // เด้งกลับขึ้นนิด = ฟีลสปริง
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.34);
    o.connect(g).connect(_bobAC.destination); o.start(t); o.stop(t+0.36);
  }catch(e){}
}
/* 🪆 รอบ 193: ใส่สกินให้ตุ๊กตา (คลาส CSS บน #adv-bobble) */
function bobbleApplySkin(){
  if(!carBobbleEl) return;
  const owned=(typeof state!=='undefined' && state.bobbleSkin) ? state.bobbleSkin : '';
  const id=BOBBLE_SKINS.some(s=>s.id===owned)?owned:'';
  if(_bobSkin===id) return;
  BOBBLE_SKINS.forEach(s=>{ if(s.id) carBobbleEl.classList.remove('bskin-'+s.id); });
  if(id) carBobbleEl.classList.add('bskin-'+id);
  _bobSkin=id;
}
/* 🪆 รอบ 193: หน้าต่างเลือก/ปลดล็อกสกินตุ๊กตา (เปิดจากปุ่มในแผงเตรียมออกรถ) */
function dollOwned(id){ return !id || (typeof state!=='undefined' && state.bobbleOwned && state.bobbleOwned[id]); }
function openDollPicker(){
  if(!overlayEl) return;
  let el=overlayEl.querySelector('#adv-dollpick');
  if(!el){ el=document.createElement('div'); el.id='adv-dollpick'; overlayEl.appendChild(el); }
  const img=`img/blocks/${BLOCK_AVATARS[state.blockAv]?state.blockAv:'blk1'}.png`;
  const fmt=n=>(typeof fmtNum==='function')?fmtNum(n):n;
  const render=()=>{
    const sel=state.bobbleSkin||'';
    el.innerHTML=`<div class="dp-box">
      <div class="dp-head"><span>🪆 แต่งตุ๊กตาหน้ารถ</span><button class="dp-x" type="button">✕</button></div>
      <div class="dp-coin">มีเหรียญ 🪙${fmt(state.coins||0)}</div>
      <div class="dp-grid">${BOBBLE_SKINS.map(s=>{
        const owned=dollOwned(s.id), on=sel===s.id;
        const tag = on?'<i class="dp-on">ใช้อยู่</i>' : owned?'<i class="dp-use">เลือก</i>' : `<i class="dp-cost">🪙${fmt(s.cost)}</i>`;
        return `<button class="dp-cell${on?' sel':''}" data-id="${s.id}" type="button">
          <span class="dp-prev bskin-${s.id||'none'}"><img src="${img}" alt=""><b>${s.emoji}</b></span>
          <span class="dp-name">${s.name}</span>${tag}</button>`;
      }).join('')}</div>
      <div class="dp-hint">👆 ตอนขับ แตะตุ๊กตาบนแผงหน้าปัด = สะกิดให้ส่ายเล่นได้</div>
    </div>`;
    el.querySelector('.dp-x').addEventListener('click',()=>{ el.style.display='none'; sfx.select(); });
    el.querySelectorAll('.dp-cell').forEach(b=>b.addEventListener('click',()=>{
      const id=b.dataset.id, sk=BOBBLE_SKINS.find(s=>s.id===id);
      if(dollOwned(id)){ state.bobbleSkin=id; if(typeof saveState==='function') saveState(); bobbleApplySkin(); sfx.select(); render(); return; }
      if((state.coins||0) < sk.cost){ sfx.wrong(); toast(`เหรียญยังไม่พอ — ต้องมี 🪙${fmt(sk.cost)}`); return; }
      if(typeof addCoins==='function') addCoins(-sk.cost); else state.coins=Math.max(0,(state.coins||0)-sk.cost);
      if(!state.bobbleOwned) state.bobbleOwned={};
      state.bobbleOwned[id]=true; state.bobbleSkin=id;
      if(typeof saveState==='function') saveState();
      bobbleApplySkin(); sfx.coin(); toast(`ปลดล็อกตุ๊กตา${sk.name} ${sk.emoji} แล้ว!`); render();
    }));
  };
  render(); el.style.display='flex';
}
/* ============================================================
   🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
   ============================================================ */
function carStartShow(){                       // เด้งทุกครั้งที่เข้าโลกขับรถ — เครื่องดับ/ยังไม่คาดเข็มขัด
  const p=document.getElementById('adv-carstart');
  if(!p) return;
  carStartOpen=true;
  p.style.display='block';
  bobbleSetAvatar(); bobbleApplySkin();                   // 🪆 รอบ 191/193: ตั้งรูปตุ๊กตา + สกินตามที่เลือก
  // 🧱🚗 รอบ 148: ภาพตัวละครที่เลือกนั่งในรถ (แมทกับ state.blockAv) — มีไฟล์ค่อยโชว์ ไม่มี=แผงหน้าตาเดิม
  const av=p.querySelector('#cs-avatar');
  if(av){
    av.style.display='none';
    av.src=`img/blocks/car_${BLOCK_AVATARS[state.blockAv]?state.blockAv:'blk1'}.png`;
    if(av.complete && av.naturalWidth>0) av.style.display='block';   // src เดิมถูก cache แล้ว load ไม่ยิงซ้ำ
  }
  const eng=p.querySelector('#cs-engine'), blt=p.querySelector('#cs-belt'), go=p.querySelector('#cs-go');
  [eng,blt].forEach(b=>{ b.classList.remove('on'); b.classList.add('off'); b.querySelector('.set-sw-txt').textContent='ปิด'; });
  go.disabled=true;
}
/* แผงกฎหมายพื้นฟ้า sci-fi — ความรู้กฎหมายจริง + กติกาในเกม (withWarn=เด้งตอนกดออกรถทั้งที่ยังไม่คาดเข็มขัด) */
function showLawInfo(withWarn, cb){
  const el=document.getElementById('adv-lawinfo');
  if(!el){ if(cb) cb(); return; }
  if(document.pointerLockElement) document.exitPointerLock();
  carLawSeen=true;
  el.innerHTML=`<h3>🛡️ SAFETY BRIEFING — กฎหมายจราจรที่หนูควรรู้</h3>
    ${withWarn?`<div class="li-sec" style="border-color:#ffb74d;background:rgba(255,183,77,.14)">⚠️ <b>หนูยังไม่คาดเข็มขัด!</b> ถ้าออกรถตอนนี้จะโดนใบสั่งทันที — กลับไปเลื่อนสวิตช์ก่อนก็ยังทันนะ</div>`:''}
    <div class="li-grid">
      <div class="li-sec">🔒 <b>เข็มขัดนิรภัย — พ.ร.บ.จราจรทางบก พ.ศ. 2522 มาตรา 123</b><br>
        ผู้ขับขี่และผู้โดยสารต้องคาดเข็มขัดนิรภัยขณะรถวิ่ง · ฝ่าฝืนมีโทษ<b>ปรับไม่เกิน 2,000 บาท</b><br>
        <small>ในเกม: ขับโดยไม่คาด = หักทันที 🪙${fmtNum(CAR_FINE_BELT)}</small></div>
      <div class="li-sec">🚨 <b>ขับรถเร็วเกินกำหนด — มาตรา 67</b><br>
        ขับเกินความเร็วที่กฎหมายกำหนดมีโทษ<b>ปรับไม่เกิน 4,000 บาท</b><br>
        <small>ในเกม: เกิน ${CAR_LEGAL_KMH} กม./ชม. = ใบสั่งครั้งละ 🪙${fmtNum(CAR_FINE_SPEED)} (หักตอนออกจากเกม)</small></div>
      <div class="li-sec">⚖️ <b>โทษจำคุก</b> (ความผิดร้ายแรง เช่น ขับประมาทจนคนอื่นบาดเจ็บ)<br>
        ศาลในเกมนี้เมตตาให้ <b>"รอลงอาญา"</b> ไว้ก่อน — แต่ค่าปรับหักจากเหรียญจริงนะ 😌</div>
    </div>
    <button class="li-ok">🫡 รับทราบ ขับขี่ปลอดภัย!</button>`;
  el.style.display='block';
  el.querySelector('.li-ok').addEventListener('click',()=>{ el.style.display='none'; sfx.select(); if(cb) cb(); });
}
/* กล่องแจ้งโดนปรับ (แดง-ขาว อ่านง่าย) — ใช้ทั้งใบสั่งเข็มขัดคาเกม + สรุปใบสั่งตอนออก */
function lawNotice(html){
  if(document.pointerLockElement) document.exitPointerLock();
  const ov=document.createElement('div');
  ov.className='adv-lawnotice';
  ov.innerHTML=`<div class="ln-box">${html}<br><button>รับทราบ 🫡</button></div>`;
  ov.querySelector('button').addEventListener('click',()=>ov.remove());
  document.body.appendChild(ov);
  if(typeof sfx!=='undefined') sfx.wrong();
}
/* สรุปใบสั่ง+ค่าซ่อมตอนออกจากโลกขับรถ — หักค่าปรับขับเร็ว/ค่าซ่อมที่ค้าง + แจ้งยอดรวม */
function driveFineSettle(){
  const speedFines=carFines.filter(f=>f.t==='speed');
  const crashFines=carFines.filter(f=>f.t==='crash');
  const signalFines=carFines.filter(f=>f.t==='signal');   // 🚦 รอบ 132: ไม่ให้สัญญาณไฟเลี้ยว ม.36
  const hitFines=carFines.filter(f=>f.t==='hitcar');      // 🚗💥 รอบ 132: ชนรถผู้เล่นอื่นแบบไม่มีประกัน
  const redFines=carFines.filter(f=>f.t==='redlight');    // 🚦 รอบ 133: ฝ่าไฟแดง ม.22
  const ramFine=carFines.find(f=>f.t==='ram');            // 🛠️ รอบ 133: เจตนาชนรถเพื่อนครบ 3 ครั้ง
  const beltFine=carFines.find(f=>f.t==='belt');
  if(!speedFines.length && !crashFines.length && !signalFines.length && !hitFines.length && !redFines.length && !ramFine && !beltFine){ carFines=[]; return; }
  const speedTotal=speedFines.reduce((s,f)=>s+f.fine,0);
  const crashTotal=crashFines.reduce((s,f)=>s+f.fine,0);
  const signalTotal=signalFines.reduce((s,f)=>s+f.fine,0);
  const hitTotal=hitFines.reduce((s,f)=>s+f.fine,0);
  const redTotal=redFines.reduce((s,f)=>s+f.fine,0);
  const dueTotal=speedTotal+crashTotal+signalTotal+hitTotal+redTotal+(ramFine?ramFine.fine:0);
  if(dueTotal>0){ state.coins=Math.max(0,state.coins-dueTotal); saveState(); }
  const html=`<b>🚔 สรุปใบสั่ง + ค่าซ่อมรอบนี้</b><br><br>
    ${speedFines.length?`🚨 ขับเร็วเกิน ${CAR_LEGAL_KMH} กม./ชม. (ม.67) × ${speedFines.length} ครั้ง = <b>🪙${fmtNum(speedTotal)}</b><br>`:''}
    ${signalFines.length?`🚦 ไม่ให้สัญญาณไฟเลี้ยวที่ทางแยก (ม.36) × ${signalFines.length} ครั้ง = <b>🪙${fmtNum(signalTotal)}</b><br>`:''}
    ${redFines.length?`🚨 ฝ่าไฟแดง (ม.22) × ${redFines.length} ครั้ง = <b>🪙${fmtNum(redTotal)}</b><br>`:''}
    ${crashFines.length?`🔧 ค่าซ่อมรถ ชนสิ่งของ × ${crashFines.length} ครั้ง = <b>🪙${fmtNum(crashTotal)}</b><br>`:''}
    ${hitFines.length?`🚗💥 ค่าเสียหายชนรถผู้เล่นอื่น (ไม่มีประกัน) × ${hitFines.length} ครั้ง = <b>🪙${fmtNum(hitTotal)}</b><br>`:''}
    ${ramFine?`🛠️ เจตนาชนรถผู้เล่นอื่นครบ 3 ครั้ง — ค่าซ่อมรถ = <b>🪙${fmtNum(ramFine.fine)}</b> <small>(ประกันไม่คุ้มครองการเจตนาชน)</small><br>`:''}
    ${beltFine?`🔒 ไม่คาดเข็มขัดนิรภัย (ม.123) = 🪙${fmtNum(beltFine.fine)} <small>(หักไปแล้วระหว่างขับ)</small><br>`:''}
    <br>${dueTotal?`หักเพิ่มจากเหรียญ <b>🪙${fmtNum(dueTotal)}</b> · `:''}คงเหลือ 🪙${fmtNum(state.coins)}<br>
    <small>⚖️ โทษจำคุก (ถ้ามี) ศาลเมตตาให้ "รอลงอาญา" — คราวหน้าขับตามกฎนะ 😌</small>`;
  carFines=[];
  setTimeout(()=>lawNotice(html), 450);
}

/* เสียงเครื่องยนต์สังเคราะห์ Web Audio (สไตล์เดียวกับ DroneSound — ปลอดลิขสิทธิ์) */
const CarSound={
  ctx:null, osc:null, osc2:null, gain:null, lp:null, on:false, rpm:0,
  start(){
    if(this.on) return;
    try{
      this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();
      const c=this.ctx; if(c.state==='suspended') c.resume();
      this.gain=c.createGain(); this.gain.gain.value=0;
      this.lp=c.createBiquadFilter(); this.lp.type='lowpass'; this.lp.frequency.value=520;
      this.osc=c.createOscillator(); this.osc.type='sawtooth'; this.osc.frequency.value=55;
      this.osc2=c.createOscillator(); this.osc2.type='square'; this.osc2.frequency.value=28;
      const g2=c.createGain(); g2.gain.value=.5;
      this.osc.connect(this.lp); this.osc2.connect(g2); g2.connect(this.lp);
      this.lp.connect(this.gain); this.gain.connect(c.destination);
      this.osc.start(); this.osc2.start(); this.on=true; this.rpm=0;
    }catch(e){}
  },
  update(th,spd,dt){
    if(!this.on) return;
    const tgt=.18+Math.min(1,spd/CAR_VMAX)*.72+(th>0?.14:0);
    this.rpm+=(tgt-this.rpm)*Math.min(1,dt*3);
    this.osc.frequency.value=48+this.rpm*175;
    this.osc2.frequency.value=24+this.rpm*88;
    this.lp.frequency.value=360+this.rpm*950;
    this.gain.gain.value=.03+this.rpm*.05;
  },
  /* 🛞 รอบ 183: เสียงยางเสียดสีผิวถนน (เลี้ยวโค้งแรง/เหวี่ยง) — noise วนต่อเนื่อง ผ่าน bandpass
     ramp ดังตามความแรงการไถล (setSkid ต่อเฟรม · 0=เงียบ 1=เอี๊ยดสุด) */
  skidStart(){
    if(this.skidGain||!this.ctx) return;
    try{
      const c=this.ctx;
      const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate), d=nb.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const src=c.createBufferSource(); src.buffer=nb; src.loop=true;
      const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1650; bp.Q.value=5.5;
      const g=c.createGain(); g.gain.value=0;
      src.connect(bp); bp.connect(g); g.connect(c.destination); src.start();
      this.skidGain=g; this.skidBp=bp;
    }catch(e){}
  },
  setSkid(amt){
    if(typeof state!=='undefined' && !state.sound){ if(this.skidGain) this.skidGain.gain.value=0; return; }
    if(!this.ctx) return;
    if(!this.skidGain) this.skidStart();
    if(!this.skidGain) return;
    const a=Math.max(0,Math.min(1,amt));
    const tgt=a*a*0.13;                                     // ยกกำลังสอง — เงียบตอนเลี้ยวเบา ดังชัดตอนไถลแรง
    const g=this.skidGain.gain;
    g.value += (tgt-g.value)*0.35;                          // ramp นุ่ม (ไม่ป๊อป)
    if(this.skidBp) this.skidBp.frequency.value=1350+a*900; // ไถลแรง = แหลมขึ้น
  },
  /* 🚔 รอบ 128: เสียงไดสตาร์ท "วี้ดๆๆ" ~0.7 วิ แล้วเครื่องติด + เร่งรอบวูบ (เรียกตอนเลื่อนสวิตช์สตาร์ท) */
  ignite(){
    try{
      this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();
      const c=this.ctx; if(c.state==='suspended') c.resume();
      const t=c.currentTime;
      const o=c.createOscillator(), g=c.createGain();
      o.type='sawtooth'; o.frequency.setValueAtTime(72,t);
      const lfo=c.createOscillator(); lfo.frequency.value=11;      // รอบไดสตาร์ทหมุนติ๊กๆ
      const lg=c.createGain(); lg.gain.value=26; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(.07,t); g.gain.setValueAtTime(.07,t+.62); g.gain.exponentialRampToValueAtTime(.001,t+.8);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t+.85); lfo.start(t); lfo.stop(t+.85);
      setTimeout(()=>{ this.start(); if(this.on) this.rpm=.95; },680);   // เครื่องติด! รอบพุ่งแล้วค่อยลดลง idle
    }catch(e){}
  },
  /* เสียงคาดเข็มขัด: ดึงสาย "ฟืด" + ล็อกหัวเข็มขัด "คลิก-แคล็ก" */
  beltClick(){
    try{
      this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();
      const c=this.ctx; if(c.state==='suspended') c.resume();
      const t=c.currentTime;
      const n=c.createBufferSource(), nb=c.createBuffer(1,c.sampleRate*.22,c.sampleRate);
      const d=nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
      n.buffer=nb;
      const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2600;
      const ng=c.createGain(); ng.gain.value=.06;
      n.connect(bp); bp.connect(ng); ng.connect(c.destination); n.start(t);   // ฟืด (ดึงสาย)
      [[.24,2000],[.32,1150]].forEach(([dt0,f])=>{                            // คลิก-แคล็ก
        const o=c.createOscillator(), g=c.createGain();
        o.type='square'; o.frequency.value=f;
        g.gain.setValueAtTime(.14,t+dt0); g.gain.exponentialRampToValueAtTime(.001,t+dt0+.05);
        o.connect(g); g.connect(c.destination); o.start(t+dt0); o.stop(t+dt0+.07);
      });
    }catch(e){}
  },
  /* 🔊 รอบ 140: "ติ๊ด" ถอยหลังแบบรถจริง — โทนเดี่ยว ~1kHz สั้นๆ (เรียกซ้ำทุก 600ms ใน tickDrive ตอนเกียร์ R/วิ่งถอย) */
  revBeep(){
    if(!this.ctx) return;
    try{
      const c=this.ctx, t=c.currentTime;
      const o=c.createOscillator(), g=c.createGain();
      o.type='square'; o.frequency.value=1000;
      const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600;   // ตัดขอบ square ให้เป็น "ติ๊ด" ไม่แสบหู
      g.gain.setValueAtTime(.055,t); g.gain.setValueAtTime(.055,t+.16); g.gain.exponentialRampToValueAtTime(.001,t+.2);
      o.connect(lp); lp.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.22);
    }catch(e){}
  },
  /* 🔊 รอบ 140: รีเลย์ไฟเลี้ยว "ติ๊ก-ต่อก" — คลิกสั้นมากสลับสูง/ต่ำตามเฟสกะพริบ 400ms */
  tlClick(hi){
    if(!this.ctx) return;
    try{
      const c=this.ctx, t=c.currentTime;
      const o=c.createOscillator(), g=c.createGain();
      o.type='square'; o.frequency.value=hi?1480:960;
      g.gain.setValueAtTime(.07,t); g.gain.exponentialRampToValueAtTime(.001,t+.035);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.05);
      const th=c.createOscillator(), tg=c.createGain();                 // ตัวถังไม้ "ต่อก" เบาๆ ใต้คลิก
      th.type='sine'; th.frequency.setValueAtTime(hi?420:300,t); th.frequency.exponentialRampToValueAtTime(140,t+.05);
      tg.gain.setValueAtTime(.05,t); tg.gain.exponentialRampToValueAtTime(.001,t+.06);
      th.connect(tg); tg.connect(c.destination); th.start(t); th.stop(t+.07);
    }catch(e){}
  },
  horn(){
    if(!this.ctx) return;
    try{
      const c=this.ctx, t=c.currentTime;
      [440,554].forEach(f=>{
        const o=c.createOscillator(), g=c.createGain();
        o.type='square'; o.frequency.value=f;
        g.gain.setValueAtTime(.09,t); g.gain.exponentialRampToValueAtTime(.001,t+.42);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.45);
      });
    }catch(e){}
  },
  thud(){
    if(!this.ctx) return;
    try{
      const c=this.ctx, t=c.currentTime;
      const o=c.createOscillator(), g=c.createGain();
      o.type='sine'; o.frequency.setValueAtTime(110,t); o.frequency.exponentialRampToValueAtTime(38,t+.22);
      g.gain.setValueAtTime(.5,t); g.gain.exponentialRampToValueAtTime(.001,t+.3);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.32);
    }catch(e){}
  },
  stop(){
    if(this.skidGain) this.skidGain.gain.value=0;           // 🛞 รอบ 183: ตัดเสียงยางตอนดับเครื่อง/ออกจากโลก
    if(!this.on) return;
    try{ this.osc.stop(); this.osc2.stop(); }catch(e){}
    this.osc=this.osc2=null; this.on=false;
  },
};

/* ขั้นตอนสตาร์ทเครื่อง Bell 212 — ข้อความตรงกับเสียงที่ได้ยินจริงในไฟล์ heli_start.mp3 */
/* ⚠️ เวลาต้องตรงกับ heli_start.mp3 (18.3 วิ · สร้างจาก tools/cut_heli.py)
   แก้ไฟล์เสียงเมื่อไหร่ ต้องมาไล่เวลาตรงนี้ด้วย ไม่งั้นข้อความไม่ตรงกับที่ได้ยิน */
const HELI_PHASES=[
  [0 ,'🌀 กดปุ่มสตาร์ท · เทอร์ไบน์เริ่มหมุน (ฟังเสียงครางสูงขึ้น)'],
  [5 ,'⛽ จ่ายเชื้อเพลิง · รอจังหวะจุดระเบิด'],
  [8 ,'🔥 จุดระเบิด! เครื่องยนต์ติดแล้ว'],
  [11,'🚁 ใบพัดเริ่มหมุน · รอบกำลังไต่ขึ้น'],
  [15,'📈 ใบพัดใกล้รอบเต็ม... เตรียมขึ้นบิน'],
];
function heliStartPhase(now){
  const t=(now-(HeliSound._startAt||now))/1000;
  let txt=HELI_PHASES[0][1];
  for(const [at,s] of HELI_PHASES) if(t>=at) txt=s;
  const left=Math.max(0,Math.ceil((HeliSound.startDur||29)-t));
  return txt+(left?` · ⏱️ ${left} วิ`:'');
}
function heliFloorAt(x,z){
  let f=0;
  for(const b of buildings){
    if(Math.abs(x-b.x)<=b.w/2+.4 && Math.abs(z-b.z)<=b.d/2+.4 && b.h>f) f=b.h;
  }
  return f;
}
/* 🏆 โบนัสลงนุ่ม (รอบ 350) — ต่อยอดแถบเตือนดิ่ง: แตะพื้นช้ากว่าเกณฑ์ = ได้เหรียญ
   สอนทักษะเดียวกับที่แถบสอน (ร่อนลงนุ่มๆ) แต่เป็นรางวัลบวกแทนคำเตือน
   คืน true เมื่อได้โบนัส (ผู้เรียกใช้ตัดสินใจว่ายังต้องให้ ATC ชมซ้ำไหม) */
const SOFT_TIERS=[[1.3,10,'🏆 Perfect landing!'],[3,4,'👍 ลงนุ่มมาก']];   // [ดิ่งไม่เกิน m/s, เหรียญ, ป้าย]
let sLandTot=0, sLandPerf=0, sLandSoft=0;              // 📊 สถิติรอบบินนี้ (รีเซ็ตตอนเข้าโลก) — โชว์สรุปตอนออก
function softLandBonus(impact,now){
  sLandTot++;
  if(!hAirAt || now-hAirAt<3000) return false;         // ต้องบินจริง >3 วิ — กันกระดกขึ้นลงถี่ๆ ฟาร์มเหรียญ
  const tier=SOFT_TIERS.find(t=>impact<=t[0]);
  if(!tier) return false;
  const [,coin,label]=tier;
  addCoins(coin); sessionCoins+=coin; renderHudTop();
  showBanner(`${label} +${coin}🪙 (แตะพื้น ${impact.toFixed(1)} m/s)`);
  if(coin>=10){ sfx.levelup(); ATC.say('Perfect landing, captain! Textbook approach!'); sLandPerf++; awardPerfLand(); }
  else{ sfx.select(); sLandSoft++; }
  return true;
}
/* 🪶 นับ Perfect landing สะสมถาวร → เข็มมือนุ่ม 10/25/50 (แพตเทิร์นเดียวกับ awardGlass รอบ 337) */
function awardPerfLand(){
  state.perfLandCount=(state.perfLandCount||0)+1;
  const tier=SOFTLAND_TIERS.filter(t=>state.perfLandCount>=t[0]).pop();
  if(tier && tier[1]>(state.perfLandBadge||0)){
    state.perfLandBadge=tier[1];
    renderBoard();
    setTimeout(()=>{
      if(!running) return;
      celebrateBadge(softLandEmoji(tier[1]), `ได้${SOFTLAND_TIER_UI[tier[1]]}!`,
        `ลงจอดเพอร์เฟกต์ครบ ${tier[0]} ครั้ง — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกแล้ว 🎉`);
      if(typeof checkCrown === 'function') checkCrown();
      if(myRef) sendPos(true);
    }, 1200);
  }
  saveState();
}
/* 💡 ไฟส่องหมอก (รอบ 350) — สปอตไลต์จริงใต้ท้องเครื่อง ส่องไปข้างหน้า-ลงล่าง
   ตึก/แท่นจอดเป็น MeshLambert รับแสงจริง → เห็นวงแสงบนดาดฟ้า ช่วยหาเป้าตอนหมอกลง
   เปิดไฟ = หมอกบางลงด้วย (fogUpdate คูณ .62) ให้รู้สึกว่า "ไฟตัดหมอก" จริง */
function setHeliLight(on){
  heliLightOn=on;
  const b=overlayEl&&overlayEl.querySelector('#adv-light');
  if(b){ b.classList.toggle('on',on); b.querySelector('small').textContent=on?'ไฟเปิด':'ไฟส่อง'; }
  _fogAt=0;                                            // บังคับ fogUpdate คำนวณใหม่ทันที (ปกติ throttle 800ms)
  if(!scene) return;
  if(on){
    if(!heliLight){
      heliLight=new THREE.SpotLight(0xfff2c8, 2.6, 90, .5, .45, 1.1);
      heliLight.target=new THREE.Object3D();
    }
    scene.add(heliLight); scene.add(heliLight.target);
  }else if(heliLight){ scene.remove(heliLight); scene.remove(heliLight.target); }
}
/* ============================================================
   🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
   สุ่มดาดฟ้าเป้าหมาย → เสาแสงเขียวพัลส์มองเห็นไกล → บินไปลงจอด = +เหรียญ → เป้าใหม่วนไป
   ใช้ระบบที่มีอยู่ครบ: วงเป้า/ติ๊ดช่วยเล็ง/โบนัสลงนุ่ม ทำงานร่วมกันเอง
   ============================================================ */
const MAIL_COIN=25, MAIL_FIRST_MS=15000, MAIL_GAP_MS=9000;   // เหรียญ/ชิ้น · หน่วงก่อนงานแรก · พักระหว่างงาน
let mailOn=false, mailTgt=null, mailNextAt=0, mailCount=0, mailMk=null;
function mailStart(){
  const c=buildings.filter(b=>!mailTgt||b!==mailTgt.b);
  const b=c[Math.floor(Math.random()*c.length)];
  if(!b) return;
  if(!mailMk){                                     // มาร์กเกอร์สร้างครั้งเดียว (ค้างใน scene แค่ย้าย/ซ่อน)
    const g=new THREE.Group();
    const col=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,26,12,1,true),
      new THREE.MeshBasicMaterial({color:0x39ffb2,transparent:true,opacity:.26,
        side:THREE.DoubleSide,depthWrite:false,fog:false}));
    col.position.y=13; g.add(col);
    const ring=new THREE.Mesh(new THREE.RingGeometry(1.6,2.4,20),
      new THREE.MeshBasicMaterial({color:0x39ffb2,transparent:true,opacity:.9,
        side:THREE.DoubleSide,depthWrite:false}));
    ring.rotation.x=-Math.PI/2; ring.position.y=.2; g.add(ring);
    g._col=col; g._ring=ring;
    mailMk=g; scene.add(g);
  }
  mailMk.visible=true;
  mailMk.position.set(b.x,b.h,b.z);
  mailTgt={b}; mailOn=true;
  ATC.say('Night mail mission, captain! Deliver to the glowing green rooftop.');
  showBanner('🛩️📦 ภารกิจไปรษณีย์กลางคืน! บินไปลงจอดดาดฟ้าแสงเขียว');
}
function mailStop(){ mailOn=false; mailTgt=null; if(mailMk) mailMk.visible=false; }
function mailTick(now){
  if(!HeliSound.ready) return;
  if(heliNight<.5){ if(mailOn) mailStop(); return; }   // ฟ้าสว่างแล้ว = จบกะไปรษณีย์
  if(!mailOn){
    if(!mailNextAt) mailNextAt=now+MAIL_FIRST_MS;
    if(now>=mailNextAt) mailStart();
    return;
  }
  const p=.5+.5*Math.sin(now/320);                  // เสาแสงหายใจ มองแล้วรู้ว่าเป็นเป้า
  mailMk._col.material.opacity=.14+.2*p;
  mailMk._ring.material.opacity=.5+.45*p;
}
/* ============================================================
   🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
   เข้าโลกแล้ว "เริ่มเดิน" → เดินเข้าตึกเทอร์มินัล (ล็อบบี้จริง) → ลิฟต์ขึ้นดาดฟ้า →
   ขึ้นเฮลิฯ โดยสาร นั่งริมหน้าต่างชมเมือง → กด 🪂 ใส่วิงสูทโดดร่อนเก็บตัวอักษรระหว่างตึก
   หรือเดินไปที่เฮลิฯ สีแดงลานกลาง = ขับเองแบบเดิมครบทุกระบบ
   hPhase: walk | lift | ride | wing | pilot
   ============================================================ */
const FOOT_EYE=1.55, FOOT_SPD=5.2, WING_COLLECT=3.4, RIDE_SPD=8.5;
let hPhase='walk', termB=null, liftUntil=0, liftToRoof=true, liftEl=null;
let rideWp=[], rideIdx=0, ridePos={x:0,y:0,z:0}, rideYaw=0, paxSnd=null;
let rideSpin=1, _rideDusted=false;                   // 🌪️ 0→1 = ใบพัดกำลังเร่งก่อนยกตัว (รอบ 357)
/* 🔊 เสียงประตูสไลด์ (รอบ 358) — "ชึ่ก" (noise ผ่าน bandpass กวาดตามทิศเลื่อน) จบด้วย "กึก" (ทุ้มสั้นเข้าราง)
   ต่อตรง destination แบบ assist (ไม่ผ่าน master ที่โดน envLp) · แพตเทิร์นเดียวกับ beltClick */
function doorSlideSfx(open){
  if(!state.sound) return;
  try{
    HeliSound.ensureCtx();
    const c=HeliSound.ctx, t=c.currentTime;
    const nb=c.createBuffer(1,c.sampleRate*.3,c.sampleRate);
    const d=nb.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length*.6);
    const n=c.createBufferSource(); n.buffer=nb;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.1;
    bp.frequency.setValueAtTime(open?700:1350,t);               // เปิด=กวาดขึ้น · ปิด=กวาดลง
    bp.frequency.linearRampToValueAtTime(open?1350:700,t+.26);
    const g=c.createGain();
    g.gain.setValueAtTime(.045,t); g.gain.linearRampToValueAtTime(.028,t+.2);
    g.gain.exponentialRampToValueAtTime(.001,t+.3);
    n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t);
    const o=c.createOscillator(), og=c.createGain();            // "กึก" สุดราง
    o.type='sine'; o.frequency.setValueAtTime(150,t+.26); o.frequency.exponentialRampToValueAtTime(70,t+.33);
    og.gain.setValueAtTime(.0001,t); og.gain.setValueAtTime(.09,t+.26); og.gain.exponentialRampToValueAtTime(.001,t+.36);
    o.connect(og); og.connect(c.destination); o.start(t); o.stop(t+.38);
  }catch(e){}
}
/* 🚪 เลื่อนประตูสไลด์ของลำ (target 0=ปิด 1=เปิด) — เรียกทุกเฟรม เลื่อนนุ่มเอง + เล่นเสียงตอนทิศเปลี่ยน */
function doorLerp(h,target,k){
  if(!h||!h._door) return;
  if(h._doorTgt===undefined) h._doorTgt=target;       // เฟรมแรกไม่ต้องดัง (สถานะตั้งต้น)
  else if(h._doorTgt!==target){ h._doorTgt=target; doorSlideSfx(target===1); }
  h._doorOpen+=(target-h._doorOpen)*Math.min(1,k);
  h._door.position.z=h._doorOpen*1.15;               // สไลด์ไปทางหางตามรางจริง
}
let wSpd=12, wP=0, wBank=0, _footHintAt=0;
const WRING_COIN=5;                                  // 💫 เหรียญฐานต่อแหวน (×คอมโบ: 5,10,15,...)
let ringCombo=0;
/* 🎨 สีลำพิเศษตามเทศกาล (รอบ 357) — ตัดสินตอน buildScene จากวันที่จริงของเครื่องผู้เล่น
   ปีใหม่ 20 ธ.ค.–5 ม.ค. = ทอง-แดงมงคล · สงกรานต์ 11–16 เม.ย. = ฟ้าน้ำ-ชมพูดอกไม้ */
function festivalPaint(d){
  d=d||new Date();
  const mo=d.getMonth()+1, day=d.getDate();
  if((mo===12&&day>=20)||(mo===1&&day<=5))
    return {name:'ปีใหม่', emoji:'🎊', pilot:0xd4a017, pilotAcc:0xc62828, pax:0xb8860b, paxAcc:0xe53935};
  if(mo===4&&day>=11&&day<=16)
    return {name:'สงกรานต์', emoji:'💦', pilot:0x00acc1, pilotAcc:0xf48fb1, pax:0x26c6da, paxAcc:0xffe082};
  return null;
}
/* 🌪️ ฝุ่นตลบใต้ใบพัด (รอบ 357) — สไปรต์วงแหวนพุ่งออก+ลอยขึ้น+จาง แล้วลบตัวเอง
   ใช้ตอนเครื่องติด/เฮลิฯ ออกบิน · ticked ทั้งใน tickHeli (pilot) และ tickHeliFoot */
let dusts=[], _dustTex=null;
function dustTexture(){
  if(_dustTex) return _dustTex;
  const cv=document.createElement('canvas'); cv.width=cv.height=48;
  const c=cv.getContext('2d');
  const gr=c.createRadialGradient(24,24,3,24,24,23);
  gr.addColorStop(0,'rgba(214,204,186,.85)'); gr.addColorStop(.6,'rgba(196,186,168,.4)'); gr.addColorStop(1,'rgba(180,172,156,0)');
  c.fillStyle=gr; c.fillRect(0,0,48,48);
  return _dustTex=new THREE.CanvasTexture(cv);
}
function dustBurst(x,y,z,n){
  if(!scene) return;
  for(let i=0;i<(n||24);i++){
    const a=Math.random()*Math.PI*2, r=.6+Math.random()*1.2;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:dustTexture(),transparent:true,
      opacity:.55+Math.random()*.3,depthWrite:false}));
    const sc0=.7+Math.random()*.9;
    s.scale.set(sc0,sc0,1);
    s.position.set(x+Math.cos(a)*r, y+.25+Math.random()*.3, z+Math.sin(a)*r);
    scene.add(s);
    dusts.push({s, vx:Math.cos(a)*(2.2+Math.random()*2.4), vz:Math.sin(a)*(2.2+Math.random()*2.4),
                vy:.5+Math.random()*.9, life:1.4+Math.random()*.9, t:0});
  }
}
function dustTick(dt){
  for(let i=dusts.length-1;i>=0;i--){
    const d=dusts[i];
    d.t+=dt;
    d.s.position.x+=d.vx*dt; d.s.position.z+=d.vz*dt; d.s.position.y+=d.vy*dt;
    d.vx*=1-1.3*dt; d.vz*=1-1.3*dt;                    // แรงพุ่งออกหน่วงลง เหลือลอยฟุ้ง
    d.s.scale.multiplyScalar(1+1.1*dt);                // ฟุ้งบานออก
    d.s.material.opacity*=1-(d.t/d.life)*dt*3.2;
    if(d.t>=d.life||d.s.material.opacity<.03){
      scene.remove(d.s); d.s.material.dispose();       // texture แชร์ cache ห้าม dispose map
      dusts.splice(i,1);
    }
  }
}
/* 🚁 เฮลิคอปเตอร์ทรง Bell 212 (รอบ 356 — ผู้ใช้ให้ดูวิดีโอ Bell 212 Landing เป็นแบบ)
   จุดสังเกตจริงของ 212 ที่เก็บครบ: ห้องโดยสารเหลี่ยมมน · จมูกกระจกมน+กระจกคาง ·
   ฝาครอบเครื่อง Twin-Pac ยาวบนหลังคา+ท่อไอเสีย · ใบพัดหลัก "2 กลีบ"+flybar ถ่วง ·
   บูมหางเรียว+แพนหางกลางบูม+ครีบตั้งเฉียง · ใบพัดหาง 2 กลีบฝั่งซ้าย · สกีลงจอด 2 ราง */
function heliMeshBuild(col,accent){
  const g=new THREE.Group();
  const bm=new THREE.MeshLambertMaterial({color:col});                 // สีตัวถังหลัก
  const dk=new THREE.MeshLambertMaterial({color:0x2a2d33});            // เหล็กเข้ม (ใบพัด/สกี)
  const gl=new THREE.MeshLambertMaterial({color:0x223744});            // กระจกเข้มอมฟ้า
  const wt=new THREE.MeshLambertMaterial({color:accent||0xe8e6df});    // คาดใต้ท้อง (ทูโทน — เทศกาลเปลี่ยนสีได้)
  // 🖼️ รอบ 358: มีไฟล์ texture = แปะอัตโนมัติ (prompt เจนใน PROMPTS_HELI_TEXTURE.md + Artifact)
  //    ⚠️ ภาพต้องเป็น "โทนเทาอ่อนเกือบขาว" — applyTex ใช้ tint คูณทับ ลายเดียวย้อมได้ทุกสีลำ (แดง/ฟ้า/เทศกาล)
  applyTex(bm,'tex_heli_body',1,1,col);              // ผิวโลหะรอยแนวแผ่น+หมุดย้ำ ย้อมสีตัวถัง
  applyTex(wt,'tex_heli_body',1,1,accent||0xe8e6df); // คาดใต้ท้องลายเดียวกัน ย้อมสี accent
  applyTex(dk,'tex_heli_metal',1,1);                 // โลหะเข้มด้านใช้งานหนัก (ใบพัด/สกี — สีจากภาพตรงๆ)
  // ── ห้องโดยสาร: กล่องหลัก + ท้องมน + คาดสีขาว ──
  const cab=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.25,3.1),bm); cab.position.set(0,1.28,0); g.add(cab);
  const belly=new THREE.Mesh(new THREE.BoxGeometry(1.45,.42,2.9),wt); belly.position.set(0,.68,0); g.add(belly);
  // ── จมูกมน (ครึ่งทรงกลมบี้) + กระจกหน้า 2 บานเอียง + กระจกคาง ──
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.78,12,9),bm);
  nose.scale.set(1,.92,1.15); nose.position.set(0,1.05,-1.62); g.add(nose);
  const shield=new THREE.Mesh(new THREE.BoxGeometry(1.38,.82,.07),gl);
  shield.position.set(0,1.68,-1.46); shield.rotation.x=-.52; g.add(shield);
  const chinL=new THREE.Mesh(new THREE.BoxGeometry(.5,.4,.07),gl);
  chinL.position.set(-.4,.78,-1.98); chinL.rotation.x=.35; g.add(chinL);
  const chinR=chinL.clone(); chinR.position.x=.4; g.add(chinR);
  // ── หน้าต่างบานเลื่อนฝั่งซ้าย + 🚪 ประตูสไลด์จริงฝั่งขวา (รอบ 357 — เลื่อนเปิดตอนผู้เล่นเดินเข้าใกล้) ──
  const winL=new THREE.Mesh(new THREE.BoxGeometry(.04,.5,1.5),gl);
  winL.position.set(-.81,1.55,.15); g.add(winL);
  const door=new THREE.Group(); door.position.set(.82,0,0);            // เลื่อนแกน z ของกลุ่มนี้ = ประตูสไลด์
  const doorP=new THREE.Mesh(new THREE.BoxGeometry(.06,1.1,1.35),bm);  // บานประตูสีตัวถัง
  doorP.position.set(0,1.35,.15); door.add(doorP);
  const doorW=new THREE.Mesh(new THREE.BoxGeometry(.07,.48,.9),gl);    // หน้าต่างบนบาน
  doorW.position.set(0,1.56,.15); door.add(doorW);
  const rail=new THREE.Mesh(new THREE.BoxGeometry(.03,.05,2.6),dk);    // รางเลื่อนบนลำ
  rail.position.set(.84,1.98,.6); g.add(rail);
  g.add(door);
  g._door=door; g._doorOpen=0;                                         // 0=ปิดสนิท · 1=เลื่อนไปหลังสุด
  // ── ฝาครอบเครื่องยนต์ Twin-Pac บนหลังคา + ช่องรับลม + ท่อไอเสีย ──
  const cowl=new THREE.Mesh(new THREE.BoxGeometry(.95,.5,2.5),bm); cowl.position.set(0,2.12,.45); g.add(cowl);
  const intake=new THREE.Mesh(new THREE.BoxGeometry(1.2,.3,.6),dk); intake.position.set(0,2.05,-.6); g.add(intake);
  const exh=new THREE.Mesh(new THREE.CylinderGeometry(.15,.17,.5,8),dk);
  exh.rotation.x=Math.PI/2-.35; exh.position.set(0,2.15,1.85); g.add(exh);
  // ── เสาใบพัด + ใบพัดหลัก 2 กลีบ + flybar ถ่วง (เอกลักษณ์ Bell) ──
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.5,8),dk); mast.position.set(0,2.5,.1); g.add(mast);
  const rotor=new THREE.Group(); rotor.position.set(0,2.72,.1);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.16,10),dk); rotor.add(hub);
  const blade=new THREE.Mesh(new THREE.BoxGeometry(8.6,.055,.42),dk); rotor.add(blade);   // 2 กลีบ = แท่งเดียวทะลุดุม
  const fly=new THREE.Mesh(new THREE.BoxGeometry(2.5,.04,.08),dk); fly.rotation.y=Math.PI/2; fly.position.y=-.12; rotor.add(fly);
  [[-1.25],[1.25]].forEach(([fz])=>{ const w=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),dk);
    w.position.set(0,-.12,fz); rotor.add(w); });
  g.add(rotor);
  // ── บูมหางเรียว + แพนหางกลางบูม + ครีบตั้งเฉียงหลัง ──
  const boom=new THREE.Mesh(new THREE.CylinderGeometry(.15,.31,3.6,9),bm);
  boom.rotation.x=Math.PI/2; boom.position.set(0,1.62,3.25); g.add(boom);
  const hstab=new THREE.Mesh(new THREE.BoxGeometry(1.7,.05,.44),bm); hstab.position.set(0,1.66,3.35); g.add(hstab);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(.08,1.3,.62),bm);
  fin.position.set(0,2.28,4.9); fin.rotation.x=-.16; g.add(fin);
  // ── ใบพัดหาง 2 กลีบ "ฝั่งซ้าย" ตามลำจริง ──
  const trot=new THREE.Group(); trot.position.set(-.17,2.42,4.98);
  const thub=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.1,8),dk); thub.rotation.z=Math.PI/2; trot.add(thub);
  const tblade=new THREE.Mesh(new THREE.BoxGeometry(.05,1.62,.15),dk); trot.add(tblade);
  g.add(trot);
  // ── สกีลงจอด: ราง 2 เส้น + ขาโค้ง 4 จุด ──
  [[-.78],[.78]].forEach(([sx])=>{
    const rail=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,3.4,8),dk);
    rail.rotation.x=Math.PI/2; rail.position.set(sx,.16,-.1); g.add(rail);
    const tip=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.55,8),dk);
    tip.rotation.x=Math.PI/2-.7; tip.position.set(sx,.32,-1.95); g.add(tip);   // ปลายหน้างอนขึ้น
    [[-.95],[.95]].forEach(([lz])=>{
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.62,8),dk);
      leg.rotation.z=sx>0?.42:-.42; leg.position.set(sx*.82,.48,lz); g.add(leg);
    });
  });
  g._rotor=rotor; g._trotor=trot;
  return g;
}
/* สร้างของโหมดเดินครั้งเดียวตอน buildScene: เลือกตึกเทอร์มินัล เจาะประตู ทำล็อบบี้+ลิฟต์+เฮลิฯ 2 ลำ */
function buildHeliFoot(sc,list){
  let term=null,td=1e9;
  list.forEach(b=>{ const d=Math.hypot(b.x,b.z); if(b.h>=12&&d<td){td=d;term=b;} });
  if(!term) term=list[0];
  // ประตูอยู่ผนังด้านที่หันเข้าลานกลาง (แกนที่ห่างจากศูนย์มากสุด)
  const ax=Math.abs(term.x)>=Math.abs(term.z)?'x':'z';
  const dir=ax==='x'?(term.x>0?-1:1):(term.z>0?-1:1);
  const doorC=ax==='x'
    ? {x:term.x+dir*term.w/2, z:term.z}
    : {x:term.x, z:term.z+dir*term.d/2};
  const IN=.18, CH=3.4;                              // ผนังในเยื้องเข้า · เพดานล็อบบี้สูง 3.4
  const wallM=new THREE.MeshBasicMaterial({color:0x23262e,side:THREE.DoubleSide});
  const w2=term.w/2-IN, d2=term.d/2-IN;
  // พื้น+เพดานล็อบบี้ (Basic = ไม่ง้อแสง ในตึกสว่างพอมองเห็น)
  const flo=new THREE.Mesh(new THREE.PlaneGeometry(term.w-IN*2,term.d-IN*2),
    new THREE.MeshBasicMaterial({color:0x383d47}));
  flo.rotation.x=-Math.PI/2; flo.position.set(term.x,.05,term.z); sc.add(flo);
  const cei=new THREE.Mesh(new THREE.PlaneGeometry(term.w-IN*2,term.d-IN*2),
    new THREE.MeshBasicMaterial({color:0x1b1e24}));
  cei.rotation.x=Math.PI/2; cei.position.set(term.x,CH,term.z); sc.add(cei);
  // ผนังใน 4 ด้าน (ด้านประตูเว้นช่องกว้าง 2.6)
  const mkWall=(w,h,x,z,ry)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),wallM);
    m.position.set(x,h/2,z); m.rotation.y=ry; sc.add(m); return m; };
  const G=1.3;                                       // ครึ่งความกว้างประตู
  if(ax==='x'){
    mkWall(term.d-IN*2,CH,term.x-dir*w2,term.z,Math.PI/2);            // ผนังหลัง (ตรงข้ามประตู)
    mkWall(term.w-IN*2,CH,term.x,term.z-d2,0);                        // ผนังข้าง 2 ด้าน
    mkWall(term.w-IN*2,CH,term.x,term.z+d2,0);
    const seg=(term.d-IN*2)/2-G;                                      // ผนังประตู 2 ท่อนขนาบช่อง
    mkWall(seg,CH,term.x+dir*w2,term.z-(G+seg/2),Math.PI/2);
    mkWall(seg,CH,term.x+dir*w2,term.z+(G+seg/2),Math.PI/2);
  }else{
    mkWall(term.w-IN*2,CH,term.x,term.z-dir*d2,0);
    mkWall(term.d-IN*2,CH,term.x-w2,term.z,Math.PI/2);
    mkWall(term.d-IN*2,CH,term.x+w2,term.z,Math.PI/2);
    const seg=(term.w-IN*2)/2-G;
    mkWall(seg,CH,term.x-(G+seg/2),term.z+dir*d2,0);
    mkWall(seg,CH,term.x+(G+seg/2),term.z+dir*d2,0);
  }
  // ป้าย 🛗 เหนือประตู (canvas texture — เห็นแต่ไกลว่าตึกนี้เข้าได้)
  const sc2=document.createElement('canvas'); sc2.width=256; sc2.height=96;
  const g2=sc2.getContext('2d');
  g2.fillStyle='#0d3527'; g2.fillRect(0,0,256,96);
  g2.strokeStyle='#39ffb2'; g2.lineWidth=5; g2.strokeRect(4,4,248,88);
  g2.fillStyle='#b9ffdd'; g2.font='700 44px system-ui'; g2.textAlign='center'; g2.textBaseline='middle';
  g2.fillText('🛗 ขึ้นดาดฟ้า',128,50);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.65),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc2),transparent:true,side:THREE.DoubleSide}));
  sign.position.set(doorC.x+(ax==='x'?dir*.12:0), 4.4, doorC.z+(ax==='z'?dir*.12:0));
  sign.rotation.y=ax==='x'?(dir>0?Math.PI/2:-Math.PI/2):(dir>0?0:Math.PI);
  sc.add(sign);
  // แผ่นลิฟต์เรืองแสง: ในล็อบบี้ (ชิดผนังหลัง) + จุดเดียวกันบนดาดฟ้า (ขาลง)
  const liftIn=ax==='x'? {x:term.x-dir*(w2-1.6), z:term.z} : {x:term.x, z:term.z-dir*(d2-1.6)};
  const mkPad=(y)=>{ const p=new THREE.Mesh(new THREE.CircleGeometry(1.15,20),
      new THREE.MeshBasicMaterial({color:0x39ffb2,transparent:true,opacity:.5}));
    p.rotation.x=-Math.PI/2; p.position.set(liftIn.x,y,liftIn.z); sc.add(p); return p; };
  const padG=mkPad(.09), padR=mkPad(term.h+.09);
  // 🚁 เฮลิฯ นักบิน (แดง) จอดลานกลาง · เฮลิฯ โดยสาร (ฟ้า) จอดดาดฟ้าเทอร์มินัล
  // 🎨 เทศกาล = ลำพิเศษ (ปีใหม่ทอง-แดง · สงกรานต์ฟ้า-ชมพู) — ปกติ แดง/ฟ้า
  const fest=festivalPaint();
  const pilotH=heliMeshBuild(fest?fest.pilot:0xd8342e, fest&&fest.pilotAcc);
  pilotH.position.set(0,.03,0); pilotH.rotation.y=.6; sc.add(pilotH);
  const paxH=heliMeshBuild(fest?fest.pax:0x2f7fd4, fest&&fest.paxAcc);
  const paxPos={x:term.x+(ax==='x'?dir*1.2:2.2), y:term.h+.03, z:term.z+(ax==='z'?dir*1.2:2.2)};
  paxH.position.set(paxPos.x,paxPos.y,paxPos.z); sc.add(paxH);
  // 💫 แหวนทองลอยกลางอากาศ (รอบ 355) — ร่อนวิงสูทลอดได้เหรียญ+คอมโบ · seed คงที่ เพื่อนเห็นตำแหน่งเดียวกัน
  const rr=seededRand(7741), rings=[];
  const ringG=new THREE.TorusGeometry(2.3,.24,8,22);
  for(let i=0;i<8&&rings.length<8;i++){
    let x=0,z=0,ok=false,tries=0;
    while(!ok&&tries++<30){
      x=(rr()*2-1)*44; z=(rr()*2-1)*44;
      ok=!list.some(b=>Math.abs(x-b.x)<b.w/2+3&&Math.abs(z-b.z)<b.d/2+3)&&Math.hypot(x,z)>10;
    }
    const m=new THREE.Mesh(ringG,new THREE.MeshBasicMaterial({color:0xffd54f,transparent:true,opacity:.9,fog:false}));
    m.position.set(x,9+rr()*12,z); m.rotation.y=rr()*Math.PI;
    sc.add(m);
    rings.push({m,got:false});
  }
  return {term,ax,dir,doorC,liftIn,padG,padR,pilotH,paxH,paxPos,rings,fest};
}
/* พื้นสำหรับ "คนเดิน" — ต่างจาก heliFloorAt: นับดาดฟ้าเฉพาะเมื่อผู้เล่นอยู่สูงระดับนั้นจริง
   (ไม่งั้นก้าวเข้าล็อบบี้ชั้นล่างจะโดนดีดขึ้นดาดฟ้าทันที เพราะ heliFloorAt มองตึกทึบทั้งก้อน) */
function footFloorAt(x,z,py){
  let f=0;
  for(const b of buildings){
    if(Math.abs(x-b.x)<=b.w/2+.3 && Math.abs(z-b.z)<=b.d/2+.3 && py>b.h-1.2 && b.h>f) f=b.h;
  }
  return f;
}
function insideTerm(x,z,m){ m=m||0; return Math.abs(x-termB.x)<=termB.w/2-m && Math.abs(z-termB.z)<=termB.d/2-m; }
function inDoorZone(x,z){
  const F=worlds.heli.foot;
  return Math.abs(x-F.doorC.x)<=1.35 && Math.abs(z-F.doorC.z)<=1.35;
}
function footHint(msg){ if(hudInstEl) hudInstEl.textContent=msg; }
function setFootBtns(wing,tour){
  overlayEl.classList.toggle('show-wing',!!wing);
  overlayEl.classList.toggle('show-tour',!!tour);
}
/* 🛗 ลิฟต์: เฟดดำสั้นๆ แล้วโผล่ปลายทาง (ขึ้นดาดฟ้า/ลงล็อบบี้) */
function liftStart(up,now){
  hPhase='lift'; liftToRoof=up; liftUntil=now+1300;
  if(!liftEl){
    liftEl=document.createElement('div');
    liftEl.id='adv-liftfx';
    overlayEl.appendChild(liftEl);
  }
  liftEl.textContent=up?'🛗 กำลังขึ้นลิฟต์ไปดาดฟ้า...':'🛗 กำลังลงลิฟต์ไปล็อบบี้...';
  liftEl.classList.add('on');
  sfx.select();
}
function beginRide(){
  const F=worlds.heli.foot;
  hPhase='ride';
  ridePos={x:F.paxPos.x, y:F.paxPos.y+1, z:F.paxPos.z};
  rideWp=[ {x:0,y:26,z:0}, {x:-30,y:20,z:26}, {x:34,y:23,z:20},
           {x:22,y:18,z:-30}, {x:-26,y:24,z:-18}, {x:termB.x,y:termB.h+9,z:termB.z} ];
  rideIdx=0; rideYaw=0;
  rideSpin=0; _rideDusted=false;                    // 🌪️ เริ่มจากใบพัดนิ่ง ค่อยๆ เร่งก่อนยกตัว
  dustBurst(F.paxPos.x,F.paxPos.y,F.paxPos.z,20);   // ฝุ่นฟุ้งรอบแรกตอนเครื่องติด
  yaw=rideYaw-Math.PI/2;                            // มองออกหน้าต่างขวาเป็นมุมตั้งต้น (ลากมองรอบได้)
  pitch=-.08;
  showBanner('🚁 ออกบินชมเมือง! นั่งริมหน้าต่าง ลากจอมองวิวได้ · พร้อมเมื่อไหร่กด 🪂 โดดวิงสูท');
  if(myRef) sendPos(true);                           // 💺 เพื่อนเห็นเราเป็นผู้โดยสารทันที
  try{                                              // เสียงใบพัดเบาๆ ในห้องโดยสาร (มีไฟล์ค่อยเล่น)
    if(HeliSound.files.rotor){ HeliSound.ensureCtx(); paxSnd=HeliSound.playBuf(HeliSound.files.rotor,{loop:true,vol:.15}); }
  }catch(e){}
}
function endRide(backToRoof){
  const F=worlds.heli.foot;
  try{ if(paxSnd){ paxSnd.src.stop(); paxSnd=null; } }catch(e){}
  F.paxH.position.set(F.paxPos.x,F.paxPos.y,F.paxPos.z); F.paxH.rotation.y=0;
  if(backToRoof){
    hPhase='walk';
    camera.position.set(F.paxPos.x+1.5, termB.h+FOOT_EYE, F.paxPos.z+1.5);
    showBanner('🛬 จบทัวร์ กลับดาดฟ้าเทอร์มินัล');
    if(myRef) sendPos(true);
  }
}
function beginWing(fromRide){
  if(fromRide) endRide(false);
  hPhase='wing';
  wSpd=fromRide?13:9; wP=0; wBank=0; ringCombo=0;
  const F=worlds.heli&&worlds.heli.foot;
  if(F) F.rings.forEach(r=>{ r.got=false; r.m.visible=true; });   // 💫 แหวนคืนครบทุกครั้งที่โดดใหม่
  if(fromRide){ yaw=rideYaw; camera.position.y-=1; }
  pitch=0;
  showBanner('🪂 วิงสูทกาง! W ก้มดิ่งเร่ง · S เชิดร่อน · A/D เลี้ยว · ลอดแหวนทอง 💫 ได้คอมโบ!');
  sfx.levelup();
  if(myRef) sendPos(true);                           // 🚁💺 เพื่อนเห็นเราเปลี่ยนเป็นร่มทันที
}
/* 🪂🎖️ นับตัวอักษรที่เก็บ "กลางอากาศ" (วิงสูท) → เข็มนักดิ่งพสุธา 25/60/120 (แพตเทิร์น awardGlass) */
function awardAirLetter(){
  state.airLetterCount=(state.airLetterCount||0)+1;
  const tier=AIRL_TIERS.filter(t=>state.airLetterCount>=t[0]).pop();
  if(tier && tier[1]>(state.airLetterBadge||0)){
    state.airLetterBadge=tier[1];
    renderBoard();
    setTimeout(()=>{
      if(!running) return;
      celebrateBadge(airLetterEmoji(tier[1]), `ได้${AIRL_TIER_UI[tier[1]]}!`,
        `เก็บตัวอักษรกลางอากาศครบ ${tier[0]} ตัว — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกแล้ว 🎉`);
      if(typeof checkCrown === 'function') checkCrown();
      if(myRef) sendPos(true);
    }, 1200);
  }
  saveState();
}
/* ขับเองแบบเดิม — เดินถึงเฮลิฯ แดงลานกลางแล้วเรียกอันนี้ (ยกมาจาก init เดิมของโลก) */
let _pilotDenyAt=0;
function beginPilot(){
  // 🎫 รอบ 356: คนเดินเข้ามาจากแผนที่โลกผจญภัย (ไม่มีตั๋วเฮลิฯ) นั่ง/วิงสูทฟรี แต่ขับเองต้องมีตั๋ว
  if(!state.heliTicket){
    const now=performance.now();
    if(now>_pilotDenyAt){ _pilotDenyAt=now+4000;
      sfx.wrong();
      showBanner('🎫 ขับเองต้องมีตั๋วโลกเฮลิคอปเตอร์ (ซื้อที่หน้าตลาด) — แต่นั่งโดยสาร/โดดวิงสูทฟรีนะ! ไปที่ตึกป้าย 🛗 เลย');
    }
    return;
  }
  const F=worlds.heli.foot;
  hPhase='pilot';
  overlayEl.classList.remove('hfoot'); setFootBtns(false,false);
  if(F) F.pilotH.visible=false;                      // เราขึ้นไปนั่งแล้ว — ซ่อนลำที่จอดโชว์
  camera.position.set(0,HELI_SKID,0);
  yaw=.6; pitch=0;
  hVel={x:0,y:0,z:0}; hCol=0; hLanded=true; hHitAt=0; hWarnLvl=0;
  hAtcCleared=false; ATC.reset();
  HeliSound.start();
  hViewSwitched=false; setSeat(0);
  layoutCockpit();
  dustBurst(0,.05,0,18);                             // 🌪️ ฝุ่นเริ่มฟุ้งตอนเครื่องติด
  showBanner('🚁 ขึ้นนั่งที่นักบิน! สตาร์ทเครื่องยนต์...');
  if(myRef) sendPos(true);                           // 🚁 เพื่อนเห็นเราเปลี่ยนเป็นนักบิน
}
/* วาดกรอบหน้าต่างห้องโดยสาร (เฟส ride) บน canvas เข็ม — เจาะช่องหน้าต่างมนตรงกลาง */
function drawCabinWindow(){
  if(!gaugeCtx) return;
  const c=gaugeCtx, dpr=Math.min(window.devicePixelRatio||1,2);
  const W=window.innerWidth, H=window.innerHeight;
  c.save(); c.setTransform(dpr,0,0,dpr,0,0);
  const mx=W*.09, my=H*.1, r=Math.min(W,H)*.16;
  c.fillStyle='#14171d';
  c.beginPath();
  c.rect(0,0,W,H);
  if(c.roundRect) c.roundRect(mx,my,W-mx*2,H-my*2,r);
  else c.rect(mx,my,W-mx*2,H-my*2);
  c.fill('evenodd');
  c.strokeStyle='#3a4150'; c.lineWidth=5;
  c.beginPath();
  if(c.roundRect) c.roundRect(mx+3,my+3,W-mx*2-6,H-my*2-6,r*.94); else c.rect(mx+3,my+3,W-mx*2-6,H-my*2-6);
  c.stroke();
  c.fillStyle='#9aa5b5'; c.font='700 12px system-ui'; c.textAlign='left';
  c.fillText('💺 ที่นั่งริมหน้าต่าง · ลากจอมองวิว',mx+14,H-my-12);
  c.restore();
}
function tickHeliFoot(dt,now){
  const F=worlds.heli&&worlds.heli.foot; if(!F) return;
  if(gaugeCtx){ gaugeCtx.setTransform(1,0,0,1,0,0); gaugeCtx.clearRect(0,0,gaugeCanvasEl.width,gaugeCanvasEl.height); }
  fogUpdate(now);                                    // 🌫️🌙 บรรยากาศ+ไฟกลางคืนทำงานทุกเฟสเหมือนกัน
  const bcs=worlds.heli.beacons;
  if(bcs){ const bOn=heliNight>.25;
    for(const b of bcs){ b.m.visible=bOn; if(bOn) b.m.material.opacity=((now/900+b.ph)%1)<.16?1:.12; } }
  F.pilotH._rotor.rotation.y+=dt*(hPhase==='ride'?0:.6);          // ใบพัดลำจอดหมุนเอื่อยๆ มีชีวิต
  for(const r of F.rings) if(!r.got) r.m.rotation.y+=dt*.5;       // 💫 แหวนหมุนช้าๆ เห็นแต่ไกล
  dustTick(dt);                                                    // 🌪️ ฝุ่นตลบ (ถ้ามี) ฟุ้ง-จาง-ลบตัวเอง
  const p=camera.position;
  // ── 🛗 ลิฟต์ ──
  if(hPhase==='lift'){
    if(now>=liftUntil){
      liftEl.classList.remove('on');
      camera.position.set(F.liftIn.x+(liftToRoof?1.6:1.6), (liftToRoof?termB.h:0)+FOOT_EYE, F.liftIn.z);
      hPhase='walk';
      showBanner(liftToRoof?'🛗 ถึงดาดฟ้าแล้ว! เดินไปขึ้นเฮลิคอปเตอร์สีฟ้าได้เลย':'🛗 ถึงล็อบบี้ชั้นล่าง');
    }
    return;
  }
  // ── 🚁 นั่งริมหน้าต่าง (ทัวร์อัตโนมัติ) ──
  if(hPhase==='ride'){
    // 🌪️ ช่วงเร่งใบพัด 2.6 วิ: ลำยังจอด ประตูเลื่อนปิด ใบพัดหมุนไต่รอบ → ครบแล้วฝุ่นตลบ+ยกตัว
    if(rideSpin<1){
      rideSpin=Math.min(1,rideSpin+dt/2.6);
      F.paxH._rotor.rotation.y+=dt*28*rideSpin*rideSpin;
      if(F.paxH._trotor) F.paxH._trotor.rotation.x+=dt*46*rideSpin;
      doorLerp(F.paxH,0,dt*2.0);
      if(rideSpin>=1&&!_rideDusted){ _rideDusted=true; dustBurst(ridePos.x,F.paxPos.y,ridePos.z,28); }
      const rg={x:Math.cos(rideYaw),z:-Math.sin(rideYaw)};
      camera.position.set(ridePos.x+rg.x*.8, ridePos.y+.3, ridePos.z+rg.z*.8);
      camera.rotation.set(0,0,0); camera.rotateY(yaw); camera.rotateX(pitch*.8);
      drawCabinWindow();
      setFootBtns(true,true);
      footHint('🚁 เครื่องติดแล้ว! ใบพัดกำลังเร่งรอบ เตรียมออกบิน...');
      return;
    }
    const wp=rideWp[rideIdx];
    const dx=wp.x-ridePos.x, dy=wp.y-ridePos.y, dz=wp.z-ridePos.z;
    const dd=Math.hypot(dx,dz);
    if(dd<3){ rideIdx=(rideIdx+1)%rideWp.length; }
    else{
      const tgtYaw=Math.atan2(-dx,-dz);              // หัวเครื่องชี้ทาง (forward = -sin,-cos)
      let dyaw=tgtYaw-rideYaw;
      while(dyaw>Math.PI) dyaw-=Math.PI*2; while(dyaw<-Math.PI) dyaw+=Math.PI*2;
      rideYaw+=dyaw*Math.min(1,dt*1.4);
      ridePos.x+=(dx/dd)*RIDE_SPD*dt; ridePos.z+=(dz/dd)*RIDE_SPD*dt;
      ridePos.y+=Math.max(-3,Math.min(3,dy))*dt*.9;
    }
    F.paxH.position.set(ridePos.x,ridePos.y-1.6,ridePos.z);
    F.paxH.rotation.y=rideYaw;
    F.paxH._rotor.rotation.y+=dt*28;
    if(F.paxH._trotor) F.paxH._trotor.rotation.x+=dt*46;   // ใบพัดหางหมุนเร็วกว่าตามจริง
    const rgt={x:Math.cos(rideYaw),z:-Math.sin(rideYaw)};            // เวกเตอร์ด้านขวาของหัวเครื่อง
    camera.position.set(ridePos.x+rgt.x*.8, ridePos.y+.3, ridePos.z+rgt.z*.8);
    camera.rotation.set(0,0,0); camera.rotateY(yaw); camera.rotateX(pitch*.8);
    drawCabinWindow();
    setFootBtns(true,true);
    footHint('💺 นั่งชมวิวริมหน้าต่าง · 🪂 = โดดวิงสูท · 🛬 = จบทัวร์กลับดาดฟ้า');
    return;
  }
  // ── 🪂 วิงสูท ──
  if(hPhase==='wing'){
    let dv=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);
    let bk=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
    if(joy.on){ dv=-joy.dy; bk=joy.dx; }
    wP+=(dv-wP)*Math.min(1,dt*4);
    wBank+=(bk-wBank)*Math.min(1,dt*5);
    yaw-=wBank*1.5*dt;
    wSpd+=(Math.max(0,wP)*16-(wSpd-13)*.5)*dt;
    wSpd=Math.max(7,Math.min(30,wSpd));
    const vy=-(2.4+Math.max(0,wP)*11+Math.min(0,wP)*1.7);            // ก้ม=ดิ่งเร็ว · เชิด=ร่อนช้าลง
    const sin=Math.sin(yaw),cos=Math.cos(yaw);
    let nx=p.x-sin*wSpd*dt, nz=p.z-cos*wSpd*dt, ny=p.y+vy*dt;
    nx=Math.max(-HALF+1,Math.min(HALF-1,nx)); nz=Math.max(-HALF+1,Math.min(HALF-1,nz));
    for(const b of buildings){                       // ชนข้างตึก = เจ็บ+เด้ง (สูตรเดียวกับตอนขับ)
      if(Math.abs(nx-b.x)<=b.w/2+.5 && Math.abs(nz-b.z)<=b.d/2+.5 && ny<b.h-.5){
        const pushX=(nx>b.x?1:-1)*((b.w/2+.7)-Math.abs(nx-b.x));
        const pushZ=(nz>b.z?1:-1)*((b.d/2+.7)-Math.abs(nz-b.z));
        if(Math.abs(pushX)<Math.abs(pushZ)) nx+=pushX; else nz+=pushZ;
        if(now-hHitAt>900){ hHitAt=now; damagePlayer(12); sfx.wrong(); }
        wSpd*=.45;
        break;
      }
    }
    const floor=heliFloorAt(nx,nz);
    if(ny<=floor+1.4){                               // ถึงพื้น/ดาดฟ้า = จบการร่อน
      camera.position.set(nx,floor+FOOT_EYE,nz);
      hPhase='walk'; pitch=0; ringCombo=0;
      if(wSpd>21){ damagePlayer(10); showBanner('🪂💥 ลงแรงไปหน่อย! เชิดหัว (S) ก่อนถึงพื้นนะ'); }
      else showBanner('🪂 ลงพื้นสวยงาม! เดินเก็บของต่อหรือหาทางขึ้นตึกใหม่ได้เลย');
      if(myRef) sendPos(true);                       // 🚶 เพื่อนเห็นเรากลับเป็นคนเดิน
      return;
    }
    camera.position.set(nx,ny,nz);
    camera.rotation.set(0,0,0);
    camera.rotateY(yaw);
    camera.rotateX(-.18-wP*.42+pitch*.3);
    camera.rotateZ(-wBank*.45);
    for(let i=letters.length-1;i>=0;i--){            // บินเฉียดเก็บตัวอักษร (จุดขายของวิงสูท — ไม่ต้องจอด)
      const lp=letters[i].spr.position;
      if(Math.hypot(lp.x-nx,lp.y-ny,lp.z-nz)<WING_COLLECT){ pickUpLetter(i); awardAirLetter(); }
    }
    // 💫 ลอดแหวนทอง = เหรียญ×คอมโบ (คอมโบรีเซ็ตตอนแตะพื้น)
    for(const r of F.rings){
      if(r.got) continue;
      const rp=r.m.position;
      if(Math.hypot(rp.x-nx,rp.y-ny,rp.z-nz)<2.4){
        r.got=true; r.m.visible=false;
        ringCombo++;
        const c=WRING_COIN*ringCombo;
        addCoins(c); sessionCoins+=c; renderHudTop();
        showBanner(`💫 ลอดแหวน ×${ringCombo}! +${c}🪙`);
        if(ringCombo>=3) sfx.levelup(); else sfx.select();
      }
    }
    letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });
    setFootBtns(false,false);
    footHint(`🪂 ⛰️ ${Math.max(0,ny-floor).toFixed(0)}m · 🚀 ${Math.round(wSpd*3.6)} กม./ชม. · W ก้มดิ่ง · S เชิดร่อน · A/D เลี้ยว`);
    return;
  }
  // ── 🚶 เดิน (พื้นเมือง / ในล็อบบี้ / บนดาดฟ้า) ──
  let fw=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);
  let sd=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  let nx=p.x+(-sin*fw+cos*sd)*FOOT_SPD*dt;
  let nz=p.z+(-cos*fw-sin*sd)*FOOT_SPD*dt;
  nx=Math.max(-HALF+1,Math.min(HALF-1,nx)); nz=Math.max(-HALF+1,Math.min(HALF-1,nz));
  const curFloor=footFloorAt(p.x,p.z,p.y), onRoof=p.y>curFloor-1&&curFloor>2;
  for(const b of buildings){
    const inN=Math.abs(nx-b.x)<=b.w/2+.3 && Math.abs(nz-b.z)<=b.d/2+.3;
    if(!inN) continue;
    if(p.y>b.h-1) continue;                          // ยืนบนดาดฟ้าตึกนี้อยู่ — ไม่ใช่การชนผนัง
    if(b===termB){                                   // ตึกเทอร์มินัล: ทะลุผนังได้เฉพาะช่องประตู
      const wasIn=insideTerm(p.x,p.z), willIn=insideTerm(nx,nz);
      if(wasIn===willIn) continue;                   // อยู่ฝั่งเดิม (ในล็อบบี้/นอกตึก) เดินต่อได้
      if(inDoorZone(nx,nz)||inDoorZone(p.x,p.z)) continue;
      nx=p.x; nz=p.z; break;
    }
    const pushX=(nx>b.x?1:-1)*((b.w/2+.4)-Math.abs(nx-b.x));
    const pushZ=(nz>b.z?1:-1)*((b.d/2+.4)-Math.abs(nz-b.z));
    if(Math.abs(pushX)<Math.abs(pushZ)) nx+=pushX; else nz+=pushZ;
  }
  const newFloor=footFloorAt(nx,nz,p.y);
  if(onRoof && curFloor-newFloor>2){ nx=p.x; nz=p.z; }              // ราวกันตกที่ขอบดาดฟ้า
  camera.position.set(nx,footFloorAt(nx,nz,p.y)+FOOT_EYE,nz);
  camera.rotation.set(0,0,0); camera.rotateY(yaw); camera.rotateX(pitch*.9);
  // ── จุดโต้ตอบ ──
  const dLift=Math.hypot(nx-F.liftIn.x,nz-F.liftIn.z);
  const dPilot=Math.hypot(nx,nz);
  const dPax=Math.hypot(nx-F.paxPos.x,nz-F.paxPos.z);
  const glow=.35+.3*(.5+.5*Math.sin(now/300));
  F.padG.material.opacity=glow; F.padR.material.opacity=glow;
  // 🚪 ประตูสไลด์ต้อนรับ: เดินใกล้ลำไหน บานลำนั้นเลื่อนเปิดเอง (ลำแดงเปิดเฉพาะคนมีตั๋ว)
  doorLerp(F.paxH,(onRoof&&dPax<4.5)?1:0,dt*2.4);
  doorLerp(F.pilotH,(dPilot<4&&camera.position.y<3&&state.heliTicket)?1:0,dt*2.4);
  if(insideTerm(nx,nz,-.3)&&camera.position.y<3.2){
    if(dLift<1.2){ liftStart(true,now); return; }
    footHint('🛗 เดินไปยืนบนวงแสงเขียว = ขึ้นลิฟต์ไปดาดฟ้า');
  }else if(onRoof&&insideTerm(nx,nz,-1)){
    if(dLift<1.2){ liftStart(false,now); return; }
    if(dPax<2.6){ beginRide(); return; }
    footHint('🚁 เดินเข้าหาเฮลิฯ สีฟ้า = ขึ้นนั่งชมวิว · วงแสงเขียว = ลิฟต์ลง · 🪂 โดดจากขอบก็ได้');
  }else if(dPilot<3.6&&camera.position.y<3){
    if(dPilot<2.1&&state.heliTicket){ beginPilot(); return; }
    if(dPilot<2.1&&!state.heliTicket){ beginPilot(); }   // ไม่มีตั๋ว → เด้งป้ายบอก (คูลดาวน์ในตัว) แล้วเดินต่อได้
    footHint(state.heliTicket?'🚁 เดินชิดเฮลิฯ สีแดงอีกนิด = ขึ้นขับเอง!'
      :'🎫 ลำนี้ต้องมีตั๋วเฮลิฯ ถึงขับได้ — นั่งโดยสารฟรีที่ตึกป้าย 🛗');
  }else if(now>_footHintAt){
    _footHintAt=now+400;
    footHint(onRoof?'🚶 บนดาดฟ้า · กด 🪂 โดดวิงสูทได้เลย!'
      :'🚶 เดินสำรวจเมือง · ตึกป้าย 🛗 = ขึ้นดาดฟ้ารอเฮลิฯ · เฮลิฯ แดงลานกลาง = ขับเอง');
  }
  setFootBtns(onRoof&&curFloor>6,false);             // บนดาดฟ้าสูงพอ = โชว์ปุ่มโดดวิงสูท
}
function tickHeli(dt,now){
  // ---- อ่านอินพุต ----
  let fw=0,sd=0,yawIn=0;
  if(keys.KeyW||keys.ArrowUp) fw+=1;
  if(keys.KeyS||keys.ArrowDown) fw-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(keys.KeyQ) yawIn+=1;
  if(keys.KeyE) yawIn-=1;
  let col=0;
  if(keys.Space) col+=1;
  if(keys.ShiftLeft||keys.ShiftRight||keys.KeyC) col-=1;
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  col+=hCol;                                   // จากลากนิ้วครึ่งขวา (มือถือ)
  col=Math.max(-1,Math.min(1,col));
  yaw+=yawIn*1.5*dt;

  // ---- ฟิสิกส์ ----
  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  if(hLanded){
    if(col>.25 && HeliSound.ready){ hLanded=false; hVel.y=2.5; hAirAt=now; }  // เทคออฟได้เมื่อสตาร์ทเครื่องเสร็จ
  }else{
    hVel.x+=(-sin*fw+cos*sd)*13*dt;
    hVel.z+=(-cos*fw-sin*sd)*13*dt;
    hVel.y+=(col*9 - hVel.y*1.8)*dt;           // ไต่/ลดระดับนุ่มๆ auto-hover
    const drag=Math.max(0,1-1.4*dt);
    hVel.x*=drag; hVel.z*=drag;
    const hs=Math.hypot(hVel.x,hVel.z);
    if(hs>17){ hVel.x*=17/hs; hVel.z*=17/hs; }
  }
  let nx=camera.position.x+hVel.x*dt;
  let ny=camera.position.y+hVel.y*dt;
  let nz=camera.position.z+hVel.z*dt;
  nx=Math.max(-HALF+2,Math.min(HALF-2,nx));
  nz=Math.max(-HALF+2,Math.min(HALF-2,nz));
  ny=Math.min(60,ny);

  // ---- ชนตึกด้านข้าง: บินต่ำกว่ายอด + ทะลุ footprint → เด้งออก+เจ็บ ----
  for(const b of buildings){
    const inX=Math.abs(nx-b.x)<=b.w/2+.9, inZ=Math.abs(nz-b.z)<=b.d/2+.9;
    if(inX && inZ && ny<b.h-.5){
      const pushX=(nx>b.x?1:-1)*((b.w/2+1)-Math.abs(nx-b.x));
      const pushZ=(nz>b.z?1:-1)*((b.d/2+1)-Math.abs(nz-b.z));
      if(Math.abs(pushX)<Math.abs(pushZ)) nx+=pushX; else nz+=pushZ;
      hVel.x*=-.25; hVel.z*=-.25;
      if(now-hHitAt>1000){ hHitAt=now; damagePlayer(20); HeliSound.thud(); nmCrashed=true; nmCombo=0; }
      break;
    }
  }

  // ---- พื้น/ดาดฟ้า: แตะพื้นเบา = ลงจอด · กระแทกแรง = เจ็บ ----
  const floor=heliFloorAt(nx,nz), minY=floor+HELI_SKID;
  if(ny<=minY){
    if(hVel.y<-7 && now-hHitAt>1000){ hHitAt=now; damagePlayer(25); HeliSound.thud(); ny=minY; hVel.y=2.2; }
    else{
      ny=minY;
      if(!hLanded && Math.abs(hVel.y)<=7 && col<=.1){
        const impact=Math.max(0,-hVel.y);              // ความเร็วดิ่งตอนแตะพื้น (ก่อนเคลียร์)
        hLanded=true; hVel={x:0,y:0,z:0}; sfx.select(); HeliSound.thud(.4);
        if(!softLandBonus(impact,now) && Math.random()<.35)
          ATC.say('Beautiful landing, captain. Very smooth!');   // 📻 หอชมเป็นครั้งคราว (ถ้าไม่ได้โบนัสอยู่แล้ว)
        // 🛩️📦 ลงจอดบนดาดฟ้าเป้าไปรษณีย์ = ส่งพัสดุสำเร็จ (ต้องจอดบน "ยอดตึกนั้นจริง" ไม่ใช่พื้นข้างตึก)
        if(mailOn && mailTgt){
          const mb=mailTgt.b;
          if(Math.abs(nx-mb.x)<=mb.w/2+.5 && Math.abs(nz-mb.z)<=mb.d/2+.5 && Math.abs(floor-mb.h)<.5){
            mailCount++;
            addCoins(MAIL_COIN); sessionCoins+=MAIL_COIN; renderHudTop();
            showBanner(`📦 ส่งพัสดุสำเร็จ! +${MAIL_COIN}🪙 · คืนนี้ส่งแล้ว ${mailCount} ชิ้น`);
            sfx.levelup(); ATC.say('Package delivered! Excellent work, captain.');
            mailStop(); mailNextAt=now+MAIL_GAP_MS;    // พักครู่แล้วสุ่มดาดฟ้าใหม่
          }
        }
      }
      hVel.y=Math.max(0,hVel.y);
      if(hLanded){ hVel.x=0; hVel.z=0; }
    }
  }
  camera.position.set(nx,ny,nz);
  // การเอียงแบบ smooth (แรงเฉื่อยเหมือนตัวเครื่องจริง) — ใช้ทั้งมุมกล้องและเข็มเส้นขอบฟ้า
  const tiltIn=hLanded?0:fw, sideIn=hLanded?0:sd;
  hTiltF+=(tiltIn-hTiltF)*Math.min(1,dt*5);
  hTiltS+=(sideIn-hTiltS)*Math.min(1,dt*5);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw);
  camera.rotateX(-hTiltF*.12);                  // กดหัว/เชิดหัวตามการเอียง (cockpit feedback)
  camera.rotateZ(-hTiltS*.09);

  // ---- เก็บตัวอักษร: ต้อง "ลงจอดแล้ว" บนดาดฟ้า/พื้นใกล้ตัวอักษร ----
  if(hLanded){
    for(let i=letters.length-1;i>=0;i--){
      const lp=letters[i].spr.position;
      if(Math.hypot(lp.x-nx,lp.z-nz)<3.6 && Math.abs((letters[i].baseY-1.3)-floor)<2) pickUpLetter(i);
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });

  // ---- ระบบเตือนภัยใกล้ชน (proximity warning — บี๊บถี่ขึ้นตามระยะ + ไฟแดงกะพริบ) ----
  hWarnLvl=0; let warnMsg='', wallDist=99, wallSide=0;  // wallDist/wallSide ใช้ต่อที่เสียงสะท้อน+แพนซ้ายขวา
  if(!hLanded && HeliSound.ready){
    let near=null;
    for(const b of buildings){
      if(ny>b.h+.8) continue;                          // อยู่เหนือยอดตึกนี้แล้ว ไม่มีทางชน
      const dx=Math.max(0,Math.abs(nx-b.x)-b.w/2);
      const dz=Math.max(0,Math.abs(nz-b.z)-b.d/2);
      const dw=Math.hypot(dx,dz);
      if(dw<wallDist){ wallDist=dw; near=b; }
    }
    // 🎧 ตึกที่ใกล้สุดอยู่ซ้ายหรือขวาของหัวเครื่อง? (-1 ซ้ายสุด · +1 ขวาสุด)
    // หมุนเวกเตอร์ไปหาตึกด้วย -yaw แล้วดูแกน x = ด้านข้างของนักบิน
    if(near){
      const rx=near.x-nx, rz=near.z-nz, c=Math.cos(-yaw), s=Math.sin(-yaw);
      const sx=rx*c-rz*s, len=Math.hypot(rx,rz);
      wallSide=len>.1 ? Math.max(-1,Math.min(1,sx/len)) : 0;
    }
    if(wallDist<3.5){ hWarnLvl=3; warnMsg='🚨 ใกล้ตึกมาก! หลบเดี๋ยวนี้!'; }
    else if(wallDist<6){ hWarnLvl=2; warnMsg='⚠️ ใกล้ตึก! ระวังชน'; }
    else if(wallDist<10){ hWarnLvl=1; warnMsg='⚠️ มีตึกใกล้ๆ'; }
    if(hVel.y<-6 && ny-floor<9){                       // ดิ่งเร็วใกล้พื้น/ดาดฟ้า → PULL UP
      if(hWarnLvl<2){ hWarnLvl=2; warnMsg='⬇️ ลดระดับเร็วเกิน! ดึงขึ้น!'; }
    }
    nearMissTick(wallDist, now, 3.2, 7, 1.7);          // 💨 เฉียดตึกแล้วรอด = โบนัส
  }else{ nmActive=false; nmMin=99; }                   // จอด/ยังไม่พร้อม = ยกเลิกจังหวะเฉียด
  if(hudWarnEl){
    if(hWarnLvl>0){
      hudWarnEl.style.display='block';
      hudWarnEl.textContent=warnMsg;
      hudWarnEl.className='adv-hud warn'+hWarnLvl;
    }else hudWarnEl.style.display='none';
  }
  HeliSound.proximity(hWarnLvl);

  // ---- หน้าปัด + เสียงใบพัด ----
  if(hudInstEl){
    if(!HeliSound.ready){
      hudInstEl.textContent=heliStartPhase(now);
    }else{
      const spd=Math.round(Math.hypot(hVel.x,hVel.z)*3.6);
      const stk=(state.heliStreak||0)>0?` · 🎖️ สตรีค ${state.heliStreak}`:'';
      const fog=heliFog>.35?' · 🌫️ หมอกลง พึ่งกล้อง':(heliNight>.6?' · 🌙 บินกลางคืน':'');
      const mail=mailOn&&mailTgt?` · 📦 ${Math.round(Math.hypot(mailTgt.b.x-nx,mailTgt.b.z-nz))} ม.`:'';
      hudInstEl.textContent=`⛰️ ${Math.max(0,ny-HELI_SKID).toFixed(0)}m · 🚀 ${spd} กม./ชม.${stk}${fog}${mail} ${hLanded?'· 🛬 จอดแล้ว':''}`;
    }
  }
  // 🎚️🌬️ ส่งสภาพแวดล้อมให้ระบบเสียง: สูงเท่าไหร่ · เร็วเท่าไหร่ · ใกล้ตึกแค่ไหน
  HeliSound.update(col,hLanded,dt,{alt:Math.max(0,ny-floor), spd:Math.hypot(hVel.x,hVel.z),
                                   near:wallDist, side:wallSide});
  rainTick(now);                                              // 🌧️ ตารางฝนตกเป็นช่วงๆ
  tickDrops(dt,Math.hypot(hVel.x,hVel.z));                    // 💧 หยดน้ำไหล/ปลิวตามความเร็ว
  fogUpdate(now);                                             // 🌫️🌙 หมอกเช้า+กลางคืนตามเวลาจริง
  // 🚨 ไฟกันชนยอดตึกกะพริบตอนกลางคืน (วาบสั้น 16% ของคาบ 0.9 วิ คนละเฟส — แบบตึกจริง)
  const bcs=worlds.heli&&worlds.heli.beacons;
  if(bcs){
    const bOn=heliNight>.25;
    for(const b of bcs){
      b.m.visible=bOn;
      if(bOn) b.m.material.opacity=((now/900+b.ph)%1)<.16?1:.12;
    }
  }
  mailTick(now);                                              // 🛩️📦 ภารกิจไปรษณีย์ (ทำงานเฉพาะกลางคืน)
  dustTick(dt);                                               // 🌪️ ฝุ่นตลบตอนสตาร์ท/เทคออฟ
  // 🎯 ระบบช่วยจัดกึ่งกลางเป้า (รอบ 350) — เหมือนเซนเซอร์ถอยรถ: ยิ่งใกล้เป้ายิ่งติ๊ดถี่ ตรงเป้า=รัว+โทนสูง
  assistTgt=null;
  if(!hLanded && HeliSound.ready){
    let bd=ASSIST_R;
    for(const l of letters){
      const lp=l.spr.position, roofY=(l.baseY||1.3)-1.3;
      const dxz=Math.hypot(lp.x-nx,lp.z-nz), alt=ny-roofY;
      if(dxz<bd && alt>0 && alt<ASSIST_ALT){ bd=dxz; assistTgt={x:lp.x,z:lp.z,y:roofY,d:dxz}; }
    }
    if(assistTgt) HeliSound.assist(assistTgt.d, assistTgt.d<ASSIST_PAD, now);
  }
  // 💡 ไฟส่อง: ตามตัวเครื่องทุกเฟรม — ส่องไปข้างหน้า-ลงล่าง (ทิศหน้า = -sin,-cos ตามฟิสิกส์ด้านบน)
  if(heliLight&&heliLightOn){
    heliLight.position.set(nx,ny-.6,nz);
    heliLight.target.position.set(nx-sin*14, Math.max(0,ny-16), nz-cos*14);
  }
  // 📻 หมอกหนา/ฟ้ามืด + ยังไม่เปิดไฟ → หอเตือนให้เปิด (เว้นช่วง 2 นาที ไม่พูดซ้ำถี่)
  if((heliFog>.5||heliNight>.6) && !heliLightOn && now>_lightHintAt){
    _lightHintAt=now+120000;
    ATC.say(heliNight>.6?'Night flight, captain. Switch on your searchlight.'
                        :'Heavy fog, captain. Switch on your searchlight.');
  }
  drawGauges();
  drawLandingTargets();                 // 🎯 วงเป้าลงจอดบนดาดฟ้าที่มีตัวอักษร
  drawDescentBar();                     // 📏 แถบเตือน + กรอบแดงตอนดิ่งเร็วเกิน
  drawBellyHud();                       // 📹 กรอบ+เส้นเล็งกล้องใต้ท้อง (ตัวภาพเรนเดอร์ใน loop)
  drawGlass(dt,now);                    // 🌧️☀️🕶️ หยดน้ำ + ที่ปัด + แสงแดด + ม่านบังแดด
  // 🎚️ สตาร์ทเสร็จ → ตัดไปมุมบิน (เห็นวิวสะดวก ไม่มีแผงเหนือหัว) ครั้งเดียวต่อรอบ
  if(HeliSound.ready && !hViewSwitched){
    hViewSwitched=true;
    setSeat(state.heliSeat==null?1:Math.min(2,Math.max(1,state.heliSeat)));
    dustBurst(nx,heliFloorAt(nx,nz)+.05,nz,30);      // 🌪️ ใบพัดถึงรอบเต็ม = ฝุ่นตลบชุดใหญ่
  }
  // 📻 หอบังคับการบิน: อนุญาตขึ้นบินครั้งแรกหลังสตาร์ทเสร็จ + รายงานสภาพแวดล้อมเป็นระยะ
  if(HeliSound.ready && !hAtcCleared){
    hAtcCleared=true;
    ATC.say('Engine start complete. Tower clears you for takeoff. Good luck, captain!');
    ATC.nextAt=now+40000;
  }
  ATC.tick(now);
}

/* ============================================================
   🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
   SPD ความเร็ว · ATT เส้นขอบฟ้าเทียม (ฟ้า/ดิน เอียง-ก้ม-เงยตามหัวเครื่อง)
   ALT ความสูง · V/S อัตราไต่-ลด · RPM รอบเครื่อง (โซนเขียว/เหลือง/แดง)
   ============================================================ */
/* ---------- 🎛️ เข็มวัดบนหน้าปัดจริงในกรอบค็อกพิต ----------
   รอบ 342: เลิกวาดหน้าปัดยักษ์ลอยหน้าจอ → วาดเฉพาะ "เข็ม" ทับหน้าปัดที่มีอยู่ในภาพ
   รอบ 344: ค็อกพิตเป็น "กรอบเต็มจอ" (img/heli_frame.png ช่องกระจกโปร่ง) → พิกัดใหม่ในภาพ 1100×626 */
const CP_NAT={w:1100,h:537};
const CP_GAUGES={
  spd:{x:302,y:313,r:21},   // ความเร็วลม
  att:{x:358,y:290,r:21},   // ขอบฟ้าเทียม (โดมฟ้า-ส้มในภาพ)
  alt:{x:410,y:294,r:21},   // ความสูง
  rpm:{x:359,y:354,r:24},   // รอบใบพัด
  vs :{x:415,y:354,r:21},   // อัตราไต่/ลด
};
let cpMap=null, cpBox='', cpNat=null, cpDashNat=null, cpPanelTop=0;   // {s,ox,oy} แปลงพิกัด "ในภาพกรอบ" → canvas
/* 🎚️ มุมมองในห้องนักบิน (รอบ 347)
   0 = เต็มลำ  — เห็นทั้งกระจก เสา หลังคา (ใช้ตอนสตาร์ทเครื่อง ได้อารมณ์)
   1 = มุมบิน  — เหลือแค่แผงหน้าปัดล่าง ไม่มีแผงเหนือหัว (ค่าเริ่มต้นหลังสตาร์ทเสร็จ)
   2 = มุมบินต่ำ — ดันแผงลงอีก เห็นวิวมากสุด
   ⚠️ ทุกโหมดวาดเข็ม/ที่ปัดด้วย "พิกัดในภาพกรอบเต็ม" เหมือนกันหมด — cpMap เป็นตัวแปลงให้ */
const SEAT_LABEL=['เต็มลำ','มุมบิน','บินต่ำ'];
const SEAT_P_FULL=.62;                           // ตำแหน่งแนวตั้งของกรอบเต็มลำ (0=ชิดบน 1=ชิดล่าง)
const SEAT_ZOOM=1.12;                            // ซูมกรอบเต็มลำเล็กน้อย ให้ครอบจอทุกสัดส่วน
const DASH_OFF_Y=228;                            // heli_dash.png ตัดมาจากกรอบเต็มที่ y นี้ (ต้องตรงกับ cockpit_prep.py)
const DASH_DROP=[0,0,.3];                        // โหมด 2 ดันแผงลงอีก 30% ของความสูงแผง
let seatLevel=1;
function setSeat(lv){
  seatLevel=lv;
  const b=overlayEl&&overlayEl.querySelector('#adv-seat');
  if(b) b.querySelector('small').textContent=SEAT_LABEL[lv];
  if(lv>0){ state.heliSeat=lv; saveState(); }    // จำเฉพาะมุมบิน (เต็มลำใช้ตอนสตาร์ทเท่านั้น)
  if(lv>0) setWiper(0);                          // มุมบินไม่มีกระจกให้ปัด
  const wb=overlayEl&&overlayEl.querySelector('#adv-wiper');
  if(wb) wb.style.visibility=lv>0?'hidden':'visible';   // ซ่อนปุ่มที่ปัดตอนมุมบิน (กดไปก็ไม่เห็นอะไร)
  cpBox='';
  layoutCockpit();   // ⚠️ ต้องวัดใหม่ "ทันที" ห้ามรอ drawGauges — ถ้าลูปหยุดอยู่ มุมมองจะไม่เปลี่ยนเลย
}
/* จัดวางกรอบค็อกพิต + canvas เข็ม/กระจกให้ทับกันพอดี (เรียกตอนโหลดภาพ/หมุนจอ/ปรับเบาะ) */
function layoutCockpit(){
  const cv=gaugeCanvasEl;
  if(!cockpitEl||!cv) return;
  const dash=seatLevel>0, nat=dash?cpDashNat:cpNat;
  if(!nat) return;
  const bw=cockpitEl.clientWidth, bh=cockpitEl.clientHeight;
  if(!bw||!bh) return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  [cv,glassCanvasEl].forEach(cc=>{
    if(!cc) return;
    if(cc.width!==Math.round(bw*dpr)||cc.height!==Math.round(bh*dpr)){
      cc.width=Math.round(bw*dpr); cc.height=Math.round(bh*dpr);
    }
  });
  let s,ox,oy,dw,dh,bgY;
  if(dash){
    s=bw/nat.w;                                  // เต็มความกว้าง ไม่ซูม (แผงจะได้ไม่ใหญ่เกิน)
    dw=bw; dh=nat.h*s;
    ox=0; bgY=bh-dh+dh*DASH_DROP[seatLevel];     // ชิดล่าง (โหมดบินต่ำดันลงอีก)
    oy=bgY-DASH_OFF_Y*s;                         // แปลงกลับเป็น "พิกัดกรอบเต็ม" ให้เข็มวางถูกที่
  }else{
    s=Math.max(bw/nat.w,bh/nat.h)*SEAT_ZOOM;
    dw=nat.w*s; dh=nat.h*s;
    ox=(bw-dw)/2; oy=bgY=(bh-dh)*SEAT_P_FULL;
  }
  cockpitEl.style.backgroundImage=`url(${dash?cpDashNat.src:cpNat.src})`;
  cockpitEl.style.backgroundSize=dw.toFixed(1)+'px '+dh.toFixed(1)+'px';
  cockpitEl.style.backgroundPosition=ox.toFixed(1)+'px '+bgY.toFixed(1)+'px';
  cpBox=bw+'x'+bh+'/'+cv.width+'x'+cv.height+'/'+seatLevel;
  cpMap={s:s*dpr*(nat.w/CP_NAT.w), ox:ox*dpr, oy:oy*dpr};
  // ขอบบนของแผงหน้าปัดบนจอ (CSS px) — กล้องใต้ท้องต้องลอยอยู่ "เหนือ" เส้นนี้
  // ⚠️ ถ้าวางทับแผง ภาพจากกล้องจะโดนภาพค็อกพิต (z3) บังหมด เพราะกล้องเรนเดอร์ลง canvas ฉาก (ชั้นล่างสุด)
  cpPanelTop=dash?bgY:(DASH_OFF_Y*s+oy);
}
/* ============================================================
   🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
   วาดด้วย "พิกัดในภาพกรอบ" ชุดเดียวกับเข็ม (cpMap) → ตรงกับกระจกในภาพเสมอ
   ที่ปัดที่วาดไว้ในภาพ = ท่าจอด (พาดแนวนอน) · ตัวที่ขยับกวาดออกจากจุดหมุนเดียวกัน
   ============================================================ */
const WIPER={ pivot:{x:404,y:126}, len:145, sweep:1.25, rest:Math.PI };  // rest=ชี้ซ้าย (ท่าจอดในภาพ)
const WIPER_SPD=[0,1.5,3.1];                    // เรเดียน/วิ ต่อโหมด (ปิด/ช้า/เร็ว)
let sunDir=2.1;                                 // ทิศดวงอาทิตย์ในโลก (เรเดียน) — คำนวณใหม่ตามเวลาจริงใน sunUpdate()
let sunHi=.6, sunWarm=0;                        // ความสูงดวงอาทิตย์ 0-1 · ความอุ่นของแสง 0-1 (เช้า/เย็น=1)
let wiperMode=0, wiperPhase=0, glassCtx=null, glassCanvasEl=null;
/* 🌅 ดวงอาทิตย์ตามเวลาจริงของเครื่องผู้เล่น — เช้าตะวันออก เที่ยงสูง เย็นตะวันตก
   06:00 → ทิศ -1.6 rad (ซ้าย) · 12:00 → 0 (ตรงหน้า สูง) · 18:00 → +1.6 (ขวา) */
function sunUpdate(){
  const h=new Date().getHours()+new Date().getMinutes()/60;
  const t=Math.max(0,Math.min(1,(h-6)/12));      // 0 = 6 โมงเช้า · 1 = 6 โมงเย็น
  sunDir=(t-.5)*3.2;
  sunHi=Math.sin(t*Math.PI);                     // สูงสุดตอนเที่ยง
  sunWarm=1-sunHi;                               // เช้า/เย็น = แสงส้มอุ่น · เที่ยง = ขาว
}
/* 🌫️🌙 บรรยากาศตามเวลาจริง (รอบ 349+351) — ต่อจากระบบเวลาจริง (sunUpdate)
   หมอกเช้า: หนาสุด ~05:48 จางหมดหลัง 08:30 · พลบค่ำ 18-19 บางๆ · ทัศนวิสัยสั้น → พึ่งกล้อง/ไฟ
   กลางคืน (หลัง ~2 ทุ่ม): ฟ้ามืด แสงเมืองหรี่ ป้ายโฆษณา/วง helipad เป็น MeshBasic ไม่โดนหรี่
   = เรืองแสงเหมือนป้ายไฟกลางคืนเองอัตโนมัติ · ไฟส่อง 💡 ยิ่งจำเป็น */
const HELI_FOG_N0=45, HELI_FOG_F0=150;           // ค่าปกติ (ตรงกับ MODES.heli)
let heliFog=0, heliNight=0, _fogAt=0;
const _fogSky=new THREE.Color(), _fogMist=new THREE.Color(0xdfe6ea), _fogCol=new THREE.Color();
const _nightSky=new THREE.Color(0x0d1322);       // ฟ้ากลางคืน (น้ำเงินเข้มเกือบดำ)
function fogUpdate(now){
  if(!scene||!scene.fog) return;
  if(now-_fogAt<800) return;                      // เวลาเปลี่ยนช้า — คำนวณใหม่ทุก ~0.8 วิพอ (กัน GC)
  _fogAt=now;
  const h=new Date().getHours()+new Date().getMinutes()/60;
  let f=0;
  if(h>=4 && h<=9)          f=1-Math.abs(h-5.8)/2.7;          // หมอกเช้า (หนาสุด 05:48)
  else if(h>=17.5 && h<=20) f=(1-Math.abs(h-18.6)/2)*.5;      // พลบค่ำบางๆ
  heliFog=Math.max(0,Math.min(1,f));
  if(heliLightOn) heliFog*=.62;                    // 💡 เปิดไฟส่อง = ลำแสงตัดหมอก มองไกลขึ้น (รอบ 350)
  // 🌙 ความมืด 0-1: มืดสนิท 20:00-04:30 · ไล่มืด 18:30→20:00 · ไล่สว่าง 04:30→06:00
  let n=0;
  if(h>=20 || h<4.5)        n=1;
  else if(h>=18.5)          n=(h-18.5)/1.5;
  else if(h<6)              n=1-(h-4.5)/1.5;
  heliNight=Math.max(0,Math.min(1,n));
  scene.fog.near=HELI_FOG_N0*(1-.86*heliFog);    // 45 → ~6 (มองเห็นใกล้มาก)
  scene.fog.far =HELI_FOG_F0*(1-.74*heliFog);    // 150 → ~39
  _fogSky.set(MODES.heli.sky);
  _fogCol.copy(_fogSky).lerp(_fogMist,heliFog*.8);   // ฟ้า → ขาวนวลอมเทา (หมอก)
  _fogCol.lerp(_nightSky,heliNight);                 // → มืดตามระดับกลางคืน
  scene.fog.color.copy(_fogCol);
  // ⚠️ background อาจเป็น "ภาพท้องฟ้า" (applySky) ไม่ใช่สี — .copy สีใส่ Texture = พัง ต้องเช็ก isColor
  if(scene.background&&scene.background.isColor) scene.background.copy(_fogCol);
  // หรี่แสงเมือง (ref เก็บไว้ตอน buildScene) — ไม่มืดสนิท ยังเห็นเงาตึกตัดฟ้า
  const L=worlds.heli&&worlds.heli.lights;
  if(L){ L.hemi.intensity=1.0*(1-.72*heliNight); L.sun.intensity=.7*(1-.85*heliNight); }
  // ⭐🌕 ดาว+พระจันทร์: จางเข้า-ออกตามระดับความมืด (หมอกหนาก็ยังเห็น — fog:false แต่ลด opacity ลงหน่อยให้เนียน)
  const N=worlds.heli&&worlds.heli.night;
  if(N){
    const on=heliNight>.35;
    N.stars.visible=N.moon.visible=on;
    if(on){
      N.stars.material.opacity=heliNight*.9*(1-heliFog*.6);
      N.moon.material.opacity=heliNight*.95*(1-heliFog*.5);
    }
  }
  // 📢🌙 แสงเรืองขอบป้ายผนัง (รอบ 360) — ติดเมื่อมืดพอ หรี่ตามหมอก
  const G=worlds.heli&&worlds.heli.adGlows;
  if(G){
    const on=heliNight>.3, op=heliNight*.55*(1-heliFog*.4);
    G.forEach(g=>{ g.visible=on; if(on) g.material.opacity=op; });
  }
}
/* 💧 หยดน้ำบนกระจก — เกิดตอนฝนตก · ถูกที่ปัดกวาดหาย · ความเร็วสูงก็ปลิวหายเอง */
const RAIN_MAX=90, RAIN_SPAWN=26;                // จำนวนหยดสูงสุด · หยด/วินาที ตอนฝนตก
const VISOR_Y=168, VISOR_CUT=.32;                // ม่านลงมาถึง y นี้ (พิกัดในภาพ) · เหลือแสงจ้าแค่ 32%
const RAIN_MIN=42000, RAIN_MAX_GAP=95000;        // ms: ฝนตกทุก ~42-95 วิ
const RAIN_DUR=[14000,26000];                    // ms: ตกนาน 14-26 วิ
let drops=[], rainOn=false, visorDown=false, rainNextAt=0, rainUntilAt=0;
/* หยดน้ำเกิดในโซนที่ "ที่ปัดกวาดถึง" เป็นหลัก — ปัดแล้วกระจกจะได้โล่งจริง
   (เกาะนอกโซนบ้างเล็กน้อยให้ดูเป็นธรรมชาติ แต่พวกนั้นจะไหลลง/ปลิวหายเอง) */
const DROP_ZONE=[[252,470],[630,848]], DROP_Y=[98,268];
function addDrop(){
  if(drops.length>=RAIN_MAX) return;
  const z=DROP_ZONE[Math.random()<.5?0:1];
  const wide=Math.random()<.18;                  // 18% เกาะนอกโซนที่ปัด
  drops.push({x:wide?120+Math.random()*860:z[0]+Math.random()*(z[1]-z[0]),
              y:DROP_Y[0]+Math.random()*(DROP_Y[1]-DROP_Y[0]),
              r:1.6+Math.random()*3.4, a:.5+Math.random()*.5, vy:0});
}
function tickDrops(dt,spd){
  if(rainOn) for(let i=0;i<RAIN_SPAWN*dt;i++) addDrop();
  if(rainOn && Math.random()<RAIN_SPAWN*dt%1) addDrop();
  const blow=Math.min(1,spd/22);                 // บินเร็ว = ลมพัดหยดน้ำหลุดไว
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i];
    // ⚠️ หยดน้ำจริงเกาะกระจกอยู่นาน ไม่ได้ร่วงทันที — ถ้าให้ไหลเร็วจะหลุดพ้นแนวที่ปัดก่อนโดนกวาด
    d.vy=Math.min(16,d.vy+(1.1+d.r*.45)*dt);     // หยดใหญ่ไหลลงเร็วกว่านิดหน่อย
    d.y+=d.vy*dt*(1+blow*2.5);
    d.a-=dt*(.035+blow*.45);
    if(d.a<=0||d.y>360) drops.splice(i,1);
  }
}
/* ที่ปัดกวาดผ่าน → ลบหยดน้ำในแนวใบปัด
   ⚠️ ต้องกวาด "ตลอดเส้นทางจากมุมเดิมถึงมุมใหม่" ไม่ใช่เช็กแค่มุมปัจจุบัน
   เพราะถ้าเฟรมตก (มือถือช้า/แท็บพักหลัง) ใบปัดจะกระโดดข้ามหยดไปเฉยๆ */
const WIPE_R=14;
function wipeDrops(angFrom,angTo){
  const P=WIPER.pivot, steps=Math.max(1,Math.min(10,Math.ceil(Math.abs(angTo-angFrom)/.06)));
  for(let s=0;s<=steps;s++){
    const ang=angFrom+(angTo-angFrom)*(s/steps);
    for(const side of [0,1]){
      const px=side?CP_NAT.w-P.x:P.x, a=side?Math.PI-ang:ang;
      const vx=Math.cos(a)*WIPER.len, vy=Math.sin(a)*WIPER.len;
      for(let i=drops.length-1;i>=0;i--){
        const d=drops[i];
        const wx=d.x-px, wy=d.y-P.y;
        const t=Math.max(0,Math.min(1,(wx*vx+wy*vy)/(vx*vx+vy*vy)));
        if(Math.hypot(wx-vx*t, wy-vy*t)<WIPE_R+d.r) drops.splice(i,1);
      }
    }
  }
}
function setWiper(mode){
  wiperMode=mode;
  const b=overlayEl&&overlayEl.querySelector('#adv-wiper');
  if(b){ b.classList.toggle('on',mode>0);
    b.querySelector('small').textContent=['ที่ปัดน้ำ','ปัดช้า','ปัดเร็ว'][mode]; }
}
function setVisor(on){
  visorDown=on;
  const b=overlayEl&&overlayEl.querySelector('#adv-visor');
  if(b){ b.classList.toggle('on',on); b.querySelector('small').textContent=on?'ม่านลง':'ม่านบังแดด'; }
}
/* 🌧️ ตารางฝน: ตกเป็นช่วงๆ เอง + เตือนทางวิทยุให้เปิดที่ปัด */
function rainTick(now){
  if(!rainNextAt){ rainNextAt=now+RAIN_MIN+Math.random()*(RAIN_MAX_GAP-RAIN_MIN); return; }
  if(!rainOn && now>=rainNextAt){
    rainOn=true;
    rainUntilAt=now+RAIN_DUR[0]+Math.random()*(RAIN_DUR[1]-RAIN_DUR[0]);
    ATC.say('Rain shower ahead, captain. Switch on your windshield wipers.');
  }else if(rainOn && now>=rainUntilAt){
    rainOn=false;
    rainNextAt=now+RAIN_MIN+Math.random()*(RAIN_MAX_GAP-RAIN_MIN);
  }
}
/* วาดใบปัด 1 ใบ (mirror=true = ฝั่งขวา สะท้อนแกน x) */
function drawBlade(c,ang,mirror){
  const P=WIPER.pivot, px=mirror?CP_NAT.w-P.x:P.x;
  // ⚠️ มุมคือทิศของใบปัดตรงๆ: ang=π คือชี้ซ้าย (ท่าจอดฝั่งซ้าย) · ฝั่งขวาสะท้อนเป็น π-ang
  // เคยพลาด: ใส่ rotate(a-π) + scale(-1,1) ทำให้ใบซ้ายชี้กลับเข้ากลางจอ
  const a=mirror?Math.PI-ang:ang;
  c.save();
  c.translate(px,P.y); c.rotate(a);
  c.strokeStyle='rgba(18,20,24,.92)'; c.lineCap='round';
  c.lineWidth=5.2; c.beginPath(); c.moveTo(6,0); c.lineTo(WIPER.len,0); c.stroke();  // ใบยาง
  c.lineWidth=2.4; c.strokeStyle='rgba(40,44,50,.95)';
  c.beginPath(); c.moveTo(0,0); c.lineTo(WIPER.len*.55,0); c.stroke();               // ก้าน
  c.beginPath(); c.arc(0,0,4.5,0,7); c.fillStyle='#2a2e34'; c.fill();                // หัวหมุน
  c.restore();
}
function drawGlass(dt,now){
  if(!glassCtx||!cpMap) return;
  const c=glassCtx;
  c.setTransform(1,0,0,1,0,0);
  c.clearRect(0,0,glassCanvasEl.width,glassCanvasEl.height);
  if(seatLevel>0) return;        // มุมบินไม่มีกระจก/หลังคาในภาพ → ไม่ต้องวาดที่ปัดกับแสงแดด
  c.setTransform(cpMap.s,0,0,cpMap.s,cpMap.ox,cpMap.oy);
  // ── ☀️ แสงแดดสาดผ่านกระจก: ทิศ/ความสูง/สี เปลี่ยนตามเวลาจริง (sunUpdate) ──
  let rel=sunDir-yaw;                                    // มุมสัมพัทธ์
  while(rel>Math.PI) rel-=Math.PI*2;
  while(rel<-Math.PI) rel+=Math.PI*2;
  const visorCut=visorDown?VISOR_CUT:1;                  // 🕶️ ม่านลง = แสงจ้าลดลง
  if(Math.abs(rel)<1.15){                                // หันหน้าเข้าหาแดดถึงจะเห็นแสงจ้า
    const k=(1-Math.abs(rel)/1.15)*visorCut;             // 1=ตรงหน้า 0=พ้นขอบ
    const sx=CP_NAT.w*(.5-rel*.42);
    const sy=210-sunHi*150-pitch*90;                     // เที่ยง=ดวงอาทิตย์สูง (y น้อย) · เช้า/เย็น=ต่ำลงมา
    const warm=Math.round(214-sunWarm*80), warm2=Math.round(150-sunWarm*70);
    const g=c.createRadialGradient(sx,sy,4,sx,sy,300);
    g.addColorStop(0,`rgba(255,246,${warm},${(.5*k).toFixed(3)})`);
    g.addColorStop(.35,`rgba(255,${Math.round(224-sunWarm*40)},${warm2},${(.18*k).toFixed(3)})`);
    g.addColorStop(1,'rgba(255,190,110,0)');
    c.fillStyle=g; c.fillRect(0,0,CP_NAT.w,CP_NAT.h);
    // ริ้วคราบบนกระจก — เห็นชัดเฉพาะตอนโดนแดดส่อง (เหมือนกระจกเป็นรอย)
    c.save(); c.globalAlpha=.13*k; c.strokeStyle='#fff6d8'; c.lineWidth=2.2;
    for(let i=0;i<7;i++){
      const bx=180+i*112;
      c.beginPath(); c.moveTo(bx,96); c.bezierCurveTo(bx+26,150,bx-14,200,bx+18,262); c.stroke();
    }
    c.restore();
  }
  // ── 💧 หยดน้ำบนกระจก (วาดก่อนใบปัด ใบปัดจะได้ดูเหมือนกวาดทับ) ──
  for(const d of drops){
    const g=c.createRadialGradient(d.x-d.r*.3,d.y-d.r*.35,d.r*.15,d.x,d.y,d.r);
    g.addColorStop(0,`rgba(255,255,255,${(d.a*.55).toFixed(3)})`);
    g.addColorStop(.55,`rgba(200,225,245,${(d.a*.28).toFixed(3)})`);
    g.addColorStop(1,`rgba(120,160,195,${(d.a*.12).toFixed(3)})`);
    c.fillStyle=g; c.beginPath(); c.arc(d.x,d.y,d.r,0,7); c.fill();
  }
  // ── 🕶️ ม่านบังแดด: แผ่นทึบแสงดึงลงจากขอบบนกระจก ──
  if(visorDown){
    const vy=VISOR_Y;
    const g=c.createLinearGradient(0,88,0,vy);
    g.addColorStop(0,'rgba(30,26,18,.93)');
    g.addColorStop(.82,'rgba(48,40,26,.86)');
    g.addColorStop(1,'rgba(60,50,32,.55)');
    c.fillStyle=g; c.fillRect(96,88,CP_NAT.w-192,vy-88);
    c.strokeStyle='rgba(120,104,70,.9)'; c.lineWidth=2.5;
    c.beginPath(); c.moveTo(96,vy); c.lineTo(CP_NAT.w-96,vy); c.stroke();
  }
  // ── 🌧️ ที่ปัดน้ำฝน (กวาดผ่านตรงไหน หยดน้ำตรงนั้นหายไปจริง) ──
  if(wiperMode>0){
    const prev=WIPER.rest-WIPER.sweep*(1-(Math.cos(wiperPhase)+1)/2);
    wiperPhase+=dt*WIPER_SPD[wiperMode];
    const t=(Math.cos(wiperPhase)+1)/2;                   // 1=ท่าจอด · 0=สุดปลายทาง (กลับไปกลับมานุ่ม)
    const ang=WIPER.rest-WIPER.sweep*(1-t);
    wipeDrops(prev,ang);
    drawBlade(c,ang,false);
    drawBlade(c,ang,true);
  }
}
/* ============================================================
   📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
   เรนเดอร์ฉากเดิมซ้ำอีกรอบด้วยกล้องที่มองตรงลงพื้น แล้วยัดลงมุมจอ (scissor)
   ใช้ดูว่าใต้ท้องมีอะไร ตอนร่อนลงจอดจะได้วางเครื่องตรงเป้า
   ============================================================ */
const BC={w:.23, h:.26, x:10, y:30};             // สัดส่วนของจอ (กว้าง/สูง) · มุมซ้ายบน (y เว้นที่แถบชื่อกล้อง 16px)
let bellyCam=null, bellyRect=null;
function drawBellyCam(){
  if(!renderer||!scene||!M.heli) return;
  if(!bellyCam) bellyCam=new THREE.PerspectiveCamera(78,1,.1,220);
  const W=window.innerWidth, H=window.innerHeight;
  const w=Math.round(W*BC.w), h=Math.round(H*BC.h);
  // 📍 รอบ 352 (ผู้ใช้สั่ง): ย้ายจากกลางจอ (บังวิวข้างหน้า) → มุมซ้ายบนสุด · กระดานอันดับย้ายลงไปอยู่ใต้กล้อง (CSS .adv-heli #adv-board)
  const x=BC.x, yTop=BC.y;
  bellyRect={x,y:yTop,w,h};
  // กล้องอยู่ใต้ท้องเครื่องเล็กน้อย มองดิ่งลง · หมุนตามหัวเครื่องให้ทิศตรงกับที่นักบินเห็น
  bellyCam.position.set(camera.position.x,Math.max(.6,camera.position.y-1.1),camera.position.z);
  bellyCam.rotation.set(-Math.PI/2,0,-yaw,'YXZ');
  bellyCam.aspect=w/h; bellyCam.updateProjectionMatrix();
  const pr=renderer.getPixelRatio();
  renderer.setScissorTest(true);
  // ⚠️ พิกัด viewport ของ WebGL นับจาก "ล่างซ้าย" ไม่ใช่บนซ้ายแบบ DOM
  const gy=H-yTop-h;
  renderer.setViewport(x,gy,w,h);
  renderer.setScissor(x,gy,w,h);
  renderer.render(scene,bellyCam);
  renderer.setScissorTest(false);
  renderer.setViewport(0,0,W,H);
}
/* กรอบ+เส้นเล็งของกล้องใต้ท้อง วาดบน canvas เข็ม (พิกัดจอตรงๆ ไม่ผ่าน cpMap) */
function drawBellyHud(){
  if(!bellyRect||!gaugeCtx) return;
  const c=gaugeCtx, dpr=Math.min(window.devicePixelRatio||1,2);
  const {x,y,w,h}=bellyRect;
  c.save();
  c.setTransform(dpr,0,0,dpr,0,0);
  c.strokeStyle='rgba(150,230,255,.85)'; c.lineWidth=2;
  c.strokeRect(x,y,w,h);
  c.fillStyle='rgba(0,20,32,.55)'; c.fillRect(x,y-16,w,16);
  c.fillStyle='#9fe8ff'; c.font='700 11px "Courier New",monospace'; c.textAlign='left';
  c.fillText('📹 ใต้ท้องเครื่อง',x+5,y-4);
  const alt=Math.max(0,camera.position.y-HELI_SKID);
  c.textAlign='right';
  c.fillStyle=alt<6?'#b6ffb0':'#9fe8ff';
  c.fillText(alt.toFixed(1)+' m',x+w-5,y-4);
  // เส้นเล็งกลางจอกล้อง — ยิ่งใกล้พื้นวงยิ่งเล็ก = เล็งจุดลงจอดได้แม่น
  const cx=x+w/2, cy=y+h/2, r=Math.max(6,Math.min(w,h)*.5*Math.min(1,alt/26));
  c.strokeStyle=alt<6?'rgba(150,255,150,.95)':'rgba(150,230,255,.8)';
  c.lineWidth=1.6;
  c.beginPath(); c.arc(cx,cy,r,0,7); c.stroke();
  c.beginPath();
  c.moveTo(cx-r-7,cy); c.lineTo(cx-r+3,cy); c.moveTo(cx+r-3,cy); c.lineTo(cx+r+7,cy);
  c.moveTo(cx,cy-r-7); c.lineTo(cx,cy-r+3); c.moveTo(cx,cy+r-3); c.lineTo(cx,cy+r+7);
  c.stroke();
  // 🎯 จุดเป้าลงจอด (รอบ 350): ฉายเป้าด้วย bellyCam ตรงๆ = ตรงกับภาพในกล้องเสมอ
  //    (เมทริกซ์ bellyCam อัปเดตตอน render เฟรมก่อน — lag 1 เฟรมมองไม่ออก)
  if(assistTgt&&bellyCam){
    _tgtV.set(assistTgt.x,assistTgt.y,assistTgt.z).project(bellyCam);
    let tx=x+(_tgtV.x*.5+.5)*w, ty=y+(-_tgtV.y*.5+.5)*h;
    tx=Math.max(x+5,Math.min(x+w-5,tx)); ty=Math.max(y+5,Math.min(y+h-5,ty));   // หลุดกรอบ = หนีบไว้ริมขอบ
    const hit=assistTgt.d<ASSIST_PAD;
    c.fillStyle=hit?'rgba(140,255,150,.95)':'rgba(255,205,80,.95)';
    c.beginPath(); c.arc(tx,ty,4,0,7); c.fill();
    c.strokeStyle=c.fillStyle; c.lineWidth=1.4;
    c.beginPath(); c.arc(tx,ty,8,0,7); c.stroke();
    c.font='700 10px system-ui,sans-serif'; c.textAlign='center'; c.fillStyle=c.strokeStyle;
    c.fillText(hit?'✓ ตรงเป้า ร่อนลงเลย':'◈ เป้า '+assistTgt.d.toFixed(1)+' ม.',cx,y+h-6);
  }
  c.restore();
}
/* ============================================================
   🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
   จับกลุ่มตัวอักษรตาม "ดาดฟ้าเดียวกัน" → วงเดียวต่อดาดฟ้า พร้อมตัวอักษรที่รออยู่
   อยู่ในจอ = วงเป้าเต้นเป็นจังหวะ (ใกล้/ตรง = เขียว) · หลุดจอ = ลูกศรชี้ทางที่ขอบ
   ============================================================ */
const _tgtV=new THREE.Vector3(), _tgtC=new THREE.Vector3();
function drawLandingTargets(){
  if(!gaugeCtx||!camera||!letters.length) return;
  camera.updateMatrixWorld();                         // ⚠️ HUD นี้วาดก่อน renderer.render → เมทริกซ์กล้องยังเป็นเฟรมก่อน ต้องอัปเดตเอง
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  const roofs={};
  for(const l of letters){
    const p=l.spr.position;
    const key=Math.round(p.x)+','+Math.round(p.z);
    let r=roofs[key];
    if(!r) r=roofs[key]={x:p.x,z:p.z,y:(l.baseY||1.3)-1.3,chs:[]};   // y = ยอดตึก (b.h)
    r.chs.push(l.ch);
  }
  const c=gaugeCtx, dpr=Math.min(window.devicePixelRatio||1,2);
  const W=window.innerWidth, H=window.innerHeight, cx=W/2, cy=H/2;
  const now=performance.now(), pulse=.5+.5*Math.sin(now/300);
  const mgx=44, mgy=76;                            // ระยะขอบจอที่ยังถือว่า "อยู่ในจอ"
  c.save(); c.setTransform(dpr,0,0,dpr,0,0);
  c.textAlign='center'; c.textBaseline='middle';
  for(const key in roofs){
    const r=roofs[key];
    _tgtC.set(r.x,r.y+.1,r.z).applyMatrix4(camera.matrixWorldInverse);   // พิกัดในระบบกล้อง (-z=หน้า)
    const inFront=_tgtC.z<-.15;
    _tgtV.set(r.x,r.y+.1,r.z).project(camera);
    let sx=(_tgtV.x*.5+.5)*W, sy=(-_tgtV.y*.5+.5)*H;
    const onScreen=inFront && sx>=mgx && sx<=W-mgx && sy>=mgy && sy<=H-mgy;
    const dxz=Math.hypot(r.x-camera.position.x, r.z-camera.position.z);
    const alt=camera.position.y-r.y;
    const near=dxz<7 && alt>0 && alt<16;          // เกือบถึงเป้า → เขียว
    const label=r.chs.join(' ');
    if(onScreen){
      const rad=Math.max(15,Math.min(64,760/(dxz+8)));
      const col=near?'120,255,150':'120,224,255';
      c.lineWidth=2.4; c.strokeStyle=`rgba(${col},${(.55+.4*pulse).toFixed(2)})`;
      c.beginPath(); c.arc(sx,sy,rad,0,7); c.stroke();
      c.lineWidth=1.4; c.strokeStyle=`rgba(${col},.4)`;
      c.beginPath(); c.arc(sx,sy,rad*(.55+.35*pulse),0,7); c.stroke();
      for(let k=0;k<4;k++){                        // ขีดกากบาทเล็ง 4 ทิศ
        const a=k*Math.PI/2, ux=Math.cos(a), uy=Math.sin(a);
        c.beginPath(); c.moveTo(sx+ux*(rad-6),sy+uy*(rad-6)); c.lineTo(sx+ux*(rad+6),sy+uy*(rad+6)); c.stroke();
      }
      c.font='800 15px system-ui,sans-serif';
      c.fillStyle='rgba(6,20,30,.62)';
      const tw=c.measureText(label).width+14;
      c.fillRect(sx-tw/2,sy-rad-24,tw,19);
      c.fillStyle=near?'#c6ffd2':'#dff4ff';
      c.fillText(label,sx,sy-rad-14);
      c.font='700 11px system-ui,sans-serif'; c.fillStyle=`rgba(${col},.95)`;
      c.fillText(near?'🛬 ลงจอดเก็บได้':Math.round(dxz)+' ม.',sx,sy+rad+13);
    }else{
      // หลุดจอ → ลูกศรที่ขอบชี้ทิศไปหาดาดฟ้า (ครอบคลุมกรณีอยู่ข้างหลังด้วย)
      let dx=sx-cx, dy=sy-cy;
      if(!inFront){ dx=-dx; dy=-dy; }             // หลังกล้อง = โปรเจกต์กลับด้าน ต้องพลิก
      const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
      const ex=cx+dx*(W/2-30), ey=cy+dy*(H/2-64);
      const px=Math.max(30,Math.min(W-30,ex)), py=Math.max(60,Math.min(H-40,ey));
      const a=Math.atan2(dy,dx);
      c.save(); c.translate(px,py); c.rotate(a);
      c.fillStyle='rgba(120,224,255,'+(.6+.4*pulse).toFixed(2)+')';
      c.beginPath(); c.moveTo(13,0); c.lineTo(-8,-9); c.lineTo(-8,9); c.closePath(); c.fill();
      c.restore();
      c.font='800 13px system-ui,sans-serif'; c.fillStyle='#dff4ff';
      c.fillText(label,px-dx*16,py-dy*16);
    }
  }
  c.restore();
}
/* ============================================================
   📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
   แถบแนวตั้งซ้ายจอ: บอกอัตราไต่/ดิ่ง · โซนแดง = ดิ่งแรงเกิน (จะเจ็บตอนแตะพื้น)
   ============================================================ */
const VS_HARD=-6, VS_CAUTION=-3;                 // m/s: ดิ่งแรงเกิน (เจ็บ) · เริ่มเตือน
function drawDescentBar(){
  if(!gaugeCtx||hLanded||!HeliSound.ready) return;
  const c=gaugeCtx, dpr=Math.min(window.devicePixelRatio||1,2);
  const H=window.innerHeight, now=performance.now();
  const bh=Math.min(190,H*.42), bw=12, x=16, y=(H-bh)/2;
  const vy=hVel.y, danger=vy<=VS_HARD, caution=vy<=VS_CAUTION;
  c.save(); c.setTransform(dpr,0,0,dpr,0,0);
  // ราง
  c.fillStyle='rgba(8,18,26,.55)';
  c.beginPath(); c.roundRect?c.roundRect(x,y,bw,bh,6):c.rect(x,y,bw,bh); c.fill();
  // โซนแดงล่าง (ช่วงดิ่งแรงเกิน) — ล่างสุดของแถบ
  const map=v=>y+bh*(1-(v+10)/20);               // +10 บนสุด · -10 ล่างสุด
  c.fillStyle='rgba(239,83,80,.22)';
  c.fillRect(x,map(VS_HARD),bw,y+bh-map(VS_HARD));
  // เส้นศูนย์ (0 = ลอยนิ่ง)
  c.strokeStyle='rgba(255,255,255,.5)'; c.lineWidth=1.5;
  const z0=map(0); c.beginPath(); c.moveTo(x-3,z0); c.lineTo(x+bw+3,z0); c.stroke();
  // ตัวชี้ปัจจุบัน
  const yy=Math.max(y,Math.min(y+bh,map(vy)));
  const col=danger?'#ff5350':caution?'#ffca3a':'#8be88f';
  c.fillStyle=col;
  c.beginPath(); c.moveTo(x+bw+3,yy); c.lineTo(x+bw+13,yy-5); c.lineTo(x+bw+13,yy+5); c.closePath(); c.fill();
  c.fillRect(x,yy-1.5,bw,3);
  // ป้าย 📏 + ค่าดิ่ง
  c.font='700 11px system-ui,sans-serif'; c.textAlign='center'; c.fillStyle=col;
  c.fillText('📏',x+bw/2,y-9);
  c.fillText((vy>=0?'+':'')+vy.toFixed(1),x+bw/2,y+bh+13);
  c.restore();
  // 🔴 ดิ่งแรงเกิน + ยังไม่ถึงพื้นไกลๆ → กรอบจอกะพริบแดง
  if(danger){
    const floor=heliFloorAt(camera.position.x,camera.position.z);
    if(camera.position.y-floor<12){
      const a=(.28+.32*(.5+.5*Math.sin(now/90)))*Math.min(1,(VS_HARD-vy)/4+.4);
      c.save(); c.setTransform(dpr,0,0,dpr,0,0);
      const W=window.innerWidth, th=Math.round(Math.min(W,H)*.09), red=`rgba(255,30,30,${a.toFixed(2)})`, clr='rgba(255,30,30,0)';
      const gT=c.createLinearGradient(0,0,0,th);   gT.addColorStop(0,red); gT.addColorStop(1,clr);
      c.fillStyle=gT; c.fillRect(0,0,W,th);                                   // บน
      const gB=c.createLinearGradient(0,H,0,H-th); gB.addColorStop(0,red); gB.addColorStop(1,clr);
      c.fillStyle=gB; c.fillRect(0,H-th,W,th);                                // ล่าง
      const gL=c.createLinearGradient(0,0,th,0);   gL.addColorStop(0,red); gL.addColorStop(1,clr);
      c.fillStyle=gL; c.fillRect(0,0,th,H);                                   // ซ้าย
      const gR=c.createLinearGradient(W,0,W-th,0); gR.addColorStop(0,red); gR.addColorStop(1,clr);
      c.fillStyle=gR; c.fillRect(W-th,0,th,H);                                // ขวา
      c.restore();
    }
  }
}
/* 📳 แรงสั่นสะเทือนของเครื่อง — เข็มกระตุกตามรอบใบพัดสูง + ตอนชน (รอบ 343)
   คืนค่า 0..1 · เข็มแต่ละตัวสั่นคนละจังหวะ จะได้ไม่ขยับพร้อมกันเป็นบล็อกเดียว */
function heliShake(now){
  let s=0;
  if(HeliSound.ready){
    const r=HeliSound.rpm;
    if(r>SHAKE_RPM) s=Math.min(1,(r-SHAKE_RPM)/(1.5-SHAKE_RPM));   // รอบยิ่งเกิน ยิ่งสั่น
  }
  const since=now-hHitAt;                                          // เพิ่งชน = สั่นแรงแล้วจางหาย
  if(since<SHAKE_HIT_MS) s=Math.max(s,SHAKE_HIT*(1-since/SHAKE_HIT_MS));
  return s;
}
/* เข็มบาง ยาวไม่เกินหน้าปัดที่วาดไว้ในภาพ — วาดด้วย "พิกัดในภาพ" (canvas ถูก transform ไว้แล้ว) */
function cpNeedle(c,g,frac,color,opt){
  const o=opt||{}, sw=(o.sweep||1.5)*Math.PI, a0=-Math.PI*.75;
  let a=a0+Math.max(0,Math.min(1,frac))*sw;
  // สั่นที่ "มุมเข็ม" ไม่ใช่ขยับทั้งหน้าปัด — เหมือนเข็มจริงที่สะบัดอยู่กับที่
  if(o.shake) a+=Math.sin(o.now/38+(o.phase||0))*o.shake*.055 + (Math.random()-.5)*o.shake*.02;
  const R=g.r;
  c.save();
  c.shadowColor='rgba(0,0,0,.85)'; c.shadowBlur=R*.12;
  c.strokeStyle=color; c.lineWidth=R*.12; c.lineCap='round';
  c.beginPath();
  c.moveTo(g.x-Math.sin(a)*R*.22,g.y+Math.cos(a)*R*.22);      // หางเข็มสั้นๆ แบบเข็มจริง
  c.lineTo(g.x+Math.sin(a)*R*.78,g.y-Math.cos(a)*R*.78);
  c.stroke();
  c.shadowBlur=0;
  c.beginPath(); c.arc(g.x,g.y,R*.1,0,7); c.fillStyle='#d8dde6'; c.fill();
  c.restore();
}
function drawGauges(){
  if(!gaugeCtx) return;
  // วัดใหม่เมื่ออะไรก็ตามเปลี่ยน (หมุนจอ/ย่อหน้าต่าง/ภาพเพิ่งโหลด/ปรับเบาะ/canvas โดนรีเซ็ต) — เช็กทุกเฟรมแต่ราคาถูก
  const _cv=gaugeCanvasEl;
  if(!cpMap || cpBox!==cockpitEl.clientWidth+'x'+cockpitEl.clientHeight+'/'+_cv.width+'x'+_cv.height+'/'+seatLevel)
    layoutCockpit();
  if(!cpMap) return;
  const c=gaugeCtx;
  c.setTransform(1,0,0,1,0,0);
  c.clearRect(0,0,gaugeCanvasEl.width,gaugeCanvasEl.height);
  // จับพิกัดให้ตรงกับกรอบที่ CSS วางไว้ → ต่อจากนี้วาดด้วย "พิกัดในภาพ" ได้เลย
  c.setTransform(cpMap.s,0,0,cpMap.s,cpMap.ox,cpMap.oy);
  const now=performance.now(), sh=heliShake(now);      // 📳 แรงสั่นร่วมของทุกเข็มรอบนี้
  // ── ขอบฟ้าเทียม: วาดในวงโดมที่มีอยู่ (ฟ้า/พื้นดินหมุน-เลื่อนตามการเอียง) ──
  const G=CP_GAUGES.att, R=G.r, ax=G.x, ay=G.y;
  c.save();
  c.beginPath(); c.arc(ax,ay,R*.9,0,7); c.clip();
  c.translate(ax,ay); c.rotate(hTiltS*.5+(sh?Math.sin(now/31)*sh*.028:0));   // โดมสั่นตามเครื่องด้วย
  const hy=-hTiltF*R*.6+(sh?Math.sin(now/26)*sh*R*.035:0);
  c.fillStyle='#5aa9d6'; c.fillRect(-R,-R*2,R*2,R*2+hy);
  c.fillStyle='#c2762c'; c.fillRect(-R,hy,R*2,R*2);
  c.strokeStyle='rgba(255,255,255,.9)'; c.lineWidth=R*.08;
  c.beginPath(); c.moveTo(-R,hy); c.lineTo(R,hy); c.stroke();
  c.restore();
  c.strokeStyle='#ff9800'; c.lineWidth=R*.1; c.lineCap='round';  // สัญลักษณ์เครื่อง (ตรึงกลาง)
  c.beginPath(); c.moveTo(ax-R*.5,ay); c.lineTo(ax-R*.16,ay); c.stroke();
  c.beginPath(); c.moveTo(ax+R*.5,ay); c.lineTo(ax+R*.16,ay); c.stroke();
  // ── เข็มที่เหลือ (แต่ละตัวสั่นคนละ phase = ดูเป็นเข็มกลไกแยกกัน) ──
  const spd=Math.hypot(hVel.x,hVel.z)*3.6;
  cpNeedle(c,CP_GAUGES.spd,spd/70,'#ffd9a0',{shake:sh,now,phase:0});
  const alt=Math.max(0,camera.position.y-HELI_SKID);
  cpNeedle(c,CP_GAUGES.alt,alt/60,'#bfe6ff',{shake:sh,now,phase:1.7});
  cpNeedle(c,CP_GAUGES.vs,(hVel.y+10)/20, hVel.y<-5?'#ff8a80':'#d6f5b0',{shake:sh,now,phase:3.4});
  // รอบใบพัด: มีแถบเขียว-แดงบางๆ บอกโซนปลอดภัย (ไม่ทึบ ไม่บังลายหน้าปัดในภาพ)
  const rg=CP_GAUGES.rpm;
  c.save(); c.globalAlpha=.55; c.lineWidth=rg.r*.11; c.lineCap='butt';
  [['#66bb6a',.35,1.0],['#ffd54f',1.0,1.25],['#ef5350',1.25,1.5]].forEach(([col,f1,f2])=>{
    c.beginPath();
    c.arc(rg.x,rg.y,rg.r*.86,-Math.PI*.75-Math.PI/2+(f1/1.5)*Math.PI*1.5,-Math.PI*.75-Math.PI/2+(f2/1.5)*Math.PI*1.5);
    c.strokeStyle=col; c.stroke();
  });
  c.restore();
  // เข็มรอบ: เข้าโซนแดงให้เข็มแดงขึ้นด้วย (ตากับหูบอกเรื่องเดียวกัน)
  cpNeedle(c,rg,HeliSound.rpm/1.5, HeliSound.rpm>=OD_RPM?'#ff7043':'#ffd9a0',{shake:sh,now,phase:5.1});
}

/* ---------- เสียงใบพัด Bell 212 — ไฟล์เสียงจริง (sound/heli_*.mp3) · ไม่มีไฟล์ = ตกไปใช้เสียงสังเคราะห์ ---------- */
const XF_START=1.1;              // วินาที: crossfade ท้ายไฟล์สตาร์ท → ลูปบิน
const PRELOAD_WAIT=6000;         // ms: รอไฟล์เสียงจริง decode เสร็จก่อน ถ้าเกินนี้ใช้เสียงสังเคราะห์แทน
/* 🎚️ เสียงตามสภาพแวดล้อม (รอบ 342) — จูนค่าพวกนี้ได้ถ้าอยากให้ชัด/บางกว่านี้ */
const ALT_QUIET_FROM=8, ALT_QUIET_TO=55;   // ม.: เริ่มเบาลงที่ 8 ม. → เบาสุดที่ 55 ม.
const ALT_MAX_DAMP=.42;                    // สูงสุดเบาลง 42% (ไม่ให้เงียบหาย)
const ALT_LP_MIN=1800;                     // Hz: ตอนสูงสุด ตัดความแหลมเหลือ 1.8kHz = เสียงทุ้มไกล
const ECHO_NEAR=9, ECHO_BOOST=.28;         // ม.: ใกล้ตึกกว่า 9 ม. เสียงสะท้อนดังขึ้นสูงสุด 28%
const WIND_FULL_SPD=26, WIND_MAX=.17;      // ม./วิ ที่ลมดังเต็ม · ระดับเสียงลมสูงสุด
const SHUTDOWN_SEC=4.2;                    // วินาที: ใบพัดค่อยๆ ช้าลงจนหยุดตอนออกจากโลก
/* 🎧🚨📳 รอบ 343 */
const PAN_MAX=.65, PAN_SMOOTH=.25;         // แพนซ้าย-ขวาสูงสุด (1=สุดข้าง) · หน่วงให้ลื่น ไม่วืดไปมา
const OD_RPM=1.25, OD_VOL=.085;            // rpm ที่เข้าโซนแดง (ตรงกับแถบแดงบนหน้าปัด) · ระดับเสียงหวอ
const SHAKE_RPM=1.15, SHAKE_MAX=.9;        // rpm ที่เข็มเริ่มสั่น · แอมพลิจูดสั่นสูงสุด (พิกเซลในพิกัดภาพ)
const SHAKE_HIT=2.6, SHAKE_HIT_MS=650;     // แรงสั่นตอนชน · สั่นนานเท่าไหร่แล้วจางหาย
const HeliSound={
  ctx:null,master:null,lfo:null,whine:null,whineG:null,nodes:[],
  files:{start:null,rotor:null,high:null},probed:false,on:false,
  startPlay:null,rotorPlay:null,highPlay:null,
  windG:null,windBp:null,envG:null,envLp:null,_downTm:0,   // 🌬️🎚️ ลมปะทะ + เสียงตามสภาพแวดล้อม (รอบ 342)
  envPan:null,_odOn:false,_odTm:0,                         // 🎧🚨 แพนซ้ายขวา + หวอรอบเกิน (รอบ 343)
  ready:false,rpm:0,_startTm:0,highOn:false,_startAt:0,startDur:0,
  probe(){
    if(this.probed) return; this.probed=true;
    // 3 ไฟล์ตัดจากเสียง Bell 212 จริง (tools/cut_heli.py): สตาร์ทเครื่อง / ลูปบินปกติ / ลูปเร่งเครื่องเต็มกำลัง
    // ⚠️ โหลดเป็น AudioBuffer ไม่ใช่ <audio> — HTMLAudio loop มีรอยสะดุดทุกรอบจาก encoder padding ของ mp3
    this.ensureCtx();
    this.loading=Promise.all(
      [['start','sound/heli_start.mp3'],['rotor','sound/heli_rotor.mp3'],['high','sound/heli_rotor_high.mp3']].map(([k,src])=>
        fetch(src).then(r=>r.ok?r.arrayBuffer():Promise.reject())
          .then(b=>this.ctx.decodeAudioData(b))
          .then(buf=>{ this.files[k]=buf; })
          .catch(()=>{})                      // ไม่มีไฟล์ = ตกไปใช้เสียงสังเคราะห์เหมือนเดิม
      ));
  },
  /* เล่น AudioBuffer ผ่าน gain ของตัวเอง — คืน {src,gain} ไว้คุมทีหลัง */
  playBuf(buf,{loop=false,vol=1,at=0,rate=1}={}){
    const src=this.ctx.createBufferSource(); src.buffer=buf; src.loop=loop; src.playbackRate.value=rate;
    const g=this.ctx.createGain(); g.gain.value=vol;
    src.connect(g); g.connect(this.master);
    src.start(at||this.ctx.currentTime);
    return {src,gain:g};
  },
  /* 🎯 ติ๊ดช่วยจัดกึ่งกลางเป้า (รอบ 350) — แบบเซนเซอร์ถอยรถ: ไกล=ห่าง ใกล้=ถี่ ตรงเป้า=รัว+โทนสูง
     ⚠️ ต่อตรง destination ไม่ผ่าน master — master โดน envLp (lowpass ตามความสูง) ทุ้มจนติ๊ดหาย */
  _assistAt:0,
  assist(dist,centered,now){
    if(!state.sound||!this.ctx) return;
    const gap=centered?130:280+(dist/14)*520;      // ms ระหว่างติ๊ด
    if(now-this._assistAt<gap) return;
    this._assistAt=now;
    try{
      const c=this.ctx,t=c.currentTime;
      const o=c.createOscillator(),g=c.createGain();
      o.type='sine'; o.frequency.value=centered?1560:1180;
      g.gain.setValueAtTime(centered?.055:.042,t);
      g.gain.exponentialRampToValueAtTime(.001,t+.045);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.06);
    }catch(e){}
  },
  ensureCtx(){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!this.ctx){ this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.connect(this.ctx.destination); }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
  },
  buildNodes(){
    this.ensureCtx();
    // ตุบใบพัด: sawtooth ทุ้ม AM ด้วย LFO ความถี่ใบพัด + ลมหมุนจาก noise + หวีดเทอร์ไบน์
    const osc=this.ctx.createOscillator(); osc.type='sawtooth'; osc.frequency.value=27;
    const lp=this.ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=140;
    const og=this.ctx.createGain(); og.gain.value=.001;
    const len=this.ctx.sampleRate*2, buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    const noi=this.ctx.createBufferSource(); noi.buffer=buf; noi.loop=true;
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=650; bp.Q.value=.8;
    const ng=this.ctx.createGain(); ng.gain.value=.001;
    this.lfo=this.ctx.createOscillator(); this.lfo.type='square'; this.lfo.frequency.value=2;
    const lg1=this.ctx.createGain(); lg1.gain.value=.14;
    const lg2=this.ctx.createGain(); lg2.gain.value=.05;
    this.lfo.connect(lg1); lg1.connect(og.gain);
    this.lfo.connect(lg2); lg2.connect(ng.gain);
    // เสียงหวีดเทอร์ไบน์ (เร่ง-เบาตาม RPM)
    this.whine=this.ctx.createOscillator(); this.whine.type='triangle'; this.whine.frequency.value=120;
    this.whineG=this.ctx.createGain(); this.whineG.gain.value=.0001;
    this.whine.connect(this.whineG); this.whineG.connect(this.master);
    osc.connect(lp); lp.connect(og); og.connect(this.master);
    noi.connect(bp); bp.connect(ng); ng.connect(this.master);
    osc.start(); noi.start(); this.lfo.start(); this.whine.start();
    this.nodes=[osc,noi,this.lfo,this.whine];
  },
  start(){                       // เข้าโลก → ซีเควนซ์สตาร์ทเครื่องก่อน (ready แล้วถึงบินได้)
    if(this.on) return;
    clearTimeout(this._downTm);  // ⚠️ เข้าโลกใหม่ระหว่างเครื่องยังดับไม่สุด — กัน stop() ที่ค้างคิวมาฆ่าเสียงที่เพิ่งสตาร์ท
    this.on=true; this.ready=false; this.rpm=0; this.highOn=false;
    this.probe();
    if(!state.sound){ this.ready=true; this.rpm=.55; return; }   // ปิดเสียง = ข้ามซีเควนซ์ บินได้เลย
    // ⚠️ เข้าโลกครั้งแรก ไฟล์ยัง decode ไม่เสร็จ → ต้องรอก่อน ไม่งั้นตกไปใช้เสียงสังเคราะห์ทุกครั้ง
    if(!this.files.start && this.loading){
      let raced=false;
      Promise.race([this.loading,new Promise(r=>setTimeout(r,PRELOAD_WAIT))]).then(()=>{
        if(raced || !this.on) return; raced=true;
        this.fileOrSynthStart();
      });
      return;
    }
    this.fileOrSynthStart();
  },
  fileOrSynthStart(){
    if(this.files.start){
      // ▶️ ซีเควนซ์สตาร์ทเต็มลำดับของ Bell 212 (เทอร์ไบน์คราง → จุดระเบิด → ใบพัดเร่งจนรอบเต็ม ~29 วิ)
      const buf=this.files.start, dur=buf.duration;
      this._startAt=performance.now(); this.startDur=dur;   // ให้ HUD บอกขั้นตอนตรงกับเสียงที่ได้ยิน
      this.ensureCtx();
      this.master.gain.value=1;              // ⚠️ stop() ปิด master ไว้ — เข้าโลกรอบ 2 ต้องเปิดคืน ไม่งั้นเงียบสนิท
      this.startPlay=this.playBuf(buf,{vol:.85});
      const t=this.ctx.currentTime;
      // ท้ายไฟล์สตาร์ท crossfade เข้าลูปบิน — ไม่ให้ได้ยินรอยต่อ
      this.startPlay.gain.gain.setValueAtTime(.85,t+dur-XF_START);
      this.startPlay.gain.gain.linearRampToValueAtTime(.0001,t+dur);
      this._startTm=setTimeout(()=>{ this.ready=true; this.rpm=.55; this.loopStart(); },(dur-XF_START)*1000);
      showHeliSkip(true);                    // ปุ่ม "ข้ามการสตาร์ท" สำหรับรอบถัดๆ ไป
      return;
    }
    // สังเคราะห์: เทอร์ไบน์สปูลขึ้น + ใบพัดค่อยๆ หมุนเร็วขึ้น ~3.5 วิ
    this._startAt=performance.now(); this.startDur=3.6;
    this.buildNodes();
    const t=this.ctx.currentTime;
    this.master.gain.setValueAtTime(.1,t);
    this.master.gain.linearRampToValueAtTime(.45,t+3.3);
    this.whine.frequency.setValueAtTime(85,t);
    this.whine.frequency.exponentialRampToValueAtTime(430,t+3.2);
    this.whineG.gain.setValueAtTime(.0001,t);
    this.whineG.gain.exponentialRampToValueAtTime(.055,t+1.6);
    this.lfo.frequency.setValueAtTime(1.6,t);
    this.lfo.frequency.linearRampToValueAtTime(10.5,t+3.4);
    this._startTm=setTimeout(()=>{ this.ready=true; this.rpm=.55; },3600);
  },
  /* 🚨 เสียงหวอเตือนรอบใบพัดเกินโซนแดง — สองโทนสลับแบบหวอเครื่องบินจริง
     เปิด/ปิดเองตาม rpm (เรียกทุกเฟรมได้ ไม่สร้าง node ซ้ำ) */
  overspeed(on){
    if(on===this._odOn) return;
    this._odOn=on;
    if(this._odTm){ clearInterval(this._odTm); this._odTm=0; }
    if(!on) return;
    let hi=false;
    const beep=()=>{
      if(!state.sound || !this.ctx || this.ctx.state==='closed') return;
      const t=this.ctx.currentTime;
      const o=this.ctx.createOscillator(); o.type='square';
      o.frequency.value=hi?1240:930; hi=!hi;              // สลับสองโทน = หวอ ไม่ใช่บี๊บเฉยๆ
      const g=this.ctx.createGain();
      g.gain.setValueAtTime(.001,t);
      g.gain.exponentialRampToValueAtTime(OD_VOL,t+.02);
      g.gain.exponentialRampToValueAtTime(.001,t+.19);
      o.connect(g); g.connect(this.master||this.ctx.destination);
      o.start(t); o.stop(t+.21);
    };
    this.ensureCtx(); beep();
    this._odTm=setInterval(beep,230);
  },
  /* 🌬️ เสียงลมปะทะ — noise ผ่าน bandpass ดังขึ้นตามความเร็ว (สร้างครั้งเดียว ใช้ยาว) */
  buildWind(){
    if(this.windG) return;
    this.ensureCtx();
    const len=this.ctx.sampleRate*3, b=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=b.getChannelData(0);
    let last=0;
    for(let i=0;i<len;i++){                     // brown-ish noise: ทุ้มกว่า white noise = เหมือนลมจริง
      last=(last+Math.random()*2-1)*.5; d[i]=last*1.6;
    }
    const src=this.ctx.createBufferSource(); src.buffer=b; src.loop=true;
    this.windBp=this.ctx.createBiquadFilter(); this.windBp.type='bandpass';
    this.windBp.frequency.value=520; this.windBp.Q.value=.55;
    this.windG=this.ctx.createGain(); this.windG.gain.value=.0001;
    src.connect(this.windBp); this.windBp.connect(this.windG); this.windG.connect(this.ctx.destination);
    src.start(); this.nodes.push(src);
  },
  /* 🛬 ดับเครื่อง: ใบพัดค่อยๆ ช้าลงจนหยุด (playbackRate + volume ไหลลงพร้อมกัน) */
  shutdown(){
    if(!this.ctx || (!this.rotorPlay && !this.startPlay)) return 0;
    const t=this.ctx.currentTime, D=SHUTDOWN_SEC;
    clearTimeout(this._startTm);
    this.overspeed(false);                 // 🚨 ดับเครื่องแล้วไม่ต้องหวอต่อ
    showHeliSkip(false);
    [this.startPlay,this.rotorPlay,this.highPlay].forEach(p=>{
      if(!p) return;
      try{
        p.gain.gain.cancelScheduledValues(t);
        p.gain.gain.setValueAtTime(Math.max(.0001,p.gain.gain.value),t);
        p.gain.gain.linearRampToValueAtTime(.0001,t+D);
        p.src.playbackRate.cancelScheduledValues(t);
        p.src.playbackRate.setValueAtTime(p.src.playbackRate.value,t);
        p.src.playbackRate.linearRampToValueAtTime(.16,t+D);   // ใบพัดหมุนช้าลงเรื่อยๆ (เสียงตุบห่างออก)
        p.src.stop(t+D+.05);
      }catch(e){}
    });
    if(this.windG){ this.windG.gain.cancelScheduledValues(t); this.windG.gain.linearRampToValueAtTime(.0001,t+.6); }
    this.startPlay=this.rotorPlay=this.highPlay=null;
    this.ready=false; this.rpm=0;
    // ⚠️ ต้องปลด on ทันที ไม่ใช่รอ stop() ตอนจบเฟด — ไม่งั้นผู้เล่นที่กลับเข้าโลกใหม่ภายใน 4.2 วิ
    //    จะโดน `if(this.on) return` ใน start() เตะออก = ไม่มีเสียงเครื่อง + ready ค้าง false = บินไม่ได้เลย
    this.on=false;
    this._downTm=setTimeout(()=>this.stop(),(D+.2)*1000);
    return D*1000;
  },
  /* ⏭ ข้ามซีเควนซ์สตาร์ท (บินรอบ 2-3 ไม่ต้องนั่งรอครบ 29 วิ) */
  skipStart(){
    if(!this.on || this.ready) return;
    clearTimeout(this._startTm);
    if(this.startPlay){
      const t=this.ctx.currentTime;
      this.startPlay.gain.gain.cancelScheduledValues(t);
      this.startPlay.gain.gain.setValueAtTime(this.startPlay.gain.gain.value,t);
      this.startPlay.gain.gain.linearRampToValueAtTime(.0001,t+.45);   // หรี่ลงนุ่มๆ ไม่ตัดห้วน
      try{ this.startPlay.src.stop(t+.5); }catch(e){}
      this.startPlay=null;
    }
    this.ready=true; this.rpm=.55;
    this.loopStart();
  },
  loopStart(){                   // จบไฟล์สตาร์ท → เข้าลูปบิน (ไฟล์ถ้ามี · ไม่มีใช้สังเคราะห์)
    if(!state.sound) return;
    showHeliSkip(false);
    if(this.files.rotor){
      if(this.rotorPlay) return;                          // กันเรียกซ้ำ (สตาร์ทจบ + กดข้าม)
      this.rotorPlay=this.playBuf(this.files.rotor,{loop:true,vol:.0001});
      this.rotorPlay.gain.gain.linearRampToValueAtTime(.55,this.ctx.currentTime+XF_START);
      if(this.files.high) this.highPlay=this.playBuf(this.files.high,{loop:true,vol:.0001});
    }else{
      this.buildNodes();
      this.master.gain.value=.4;
      this.whine.frequency.value=380; this.whineG.gain.value=.05;
      this.lfo.frequency.value=10.5;
    }
  },
  update(col,landed,dt,env){
    if(!this.on) return;
    if(!state.sound){ this.stop(); this.on=true; this.ready=true; return; }  // ปิดเสียงกลางคัน: เงียบแต่ยังบินได้
    if(env) this.envUpdate(env,dt);              // 🎚️🌬️ เสียงตามสภาพแวดล้อม + ลมปะทะ (ทำก่อน เพราะทำงานตอนสตาร์ทด้วย)
    if(!this.ready) return;                       // ระหว่างสตาร์ทเครื่อง ไม่ปรับ RPM
    // โมเดล RPM มีแรงเฉื่อย: เร่ง/เบาเครื่องค่อยเป็นค่อยไป (สมจริง ไม่กระโดด)
    const target=landed?.55:(1+Math.max(0,col)*.45);
    this.rpm+=(target-this.rpm)*Math.min(1,(dt||.016)*.9);
    const r=this.rpm;
    this.overspeed(r>=OD_RPM);                    // 🚨 เข้าโซนแดงบนหน้าปัด = หวอเตือน
    if(this.rotorPlay){
      const t=this.ctx.currentTime, sm=.08;             // setTargetAtTime = ไล่ค่านุ่มๆ ไม่กระตุกเป็นขั้น
      this.rotorPlay.src.playbackRate.setTargetAtTime(.8+r*.35,t,sm);
      if(this.highPlay){
        const hi=Math.max(0,Math.min(1,(r-.85)/.5));   // crossfade ลูปปกติ ↔ ลูปเร่งเครื่อง
        this.highPlay.src.playbackRate.setTargetAtTime(.9+r*.2,t,sm);
        this.highPlay.gain.gain.setTargetAtTime(.7*hi,t,sm);
        this.rotorPlay.gain.gain.setTargetAtTime(.55*(1-hi*.75),t,sm);
      }else{
        this.rotorPlay.gain.gain.setTargetAtTime(.3+r*.3,t,sm);
      }
      return;
    }
    if(this.lfo) this.lfo.frequency.value=6.5+r*6.5;
    if(this.whine){ this.whine.frequency.value=230+r*360; this.whineG.gain.value=.02+r*.05; }
    if(this.master) this.master.gain.value=.18+r*.32;
  },
  /* 🎚️🌬️ ปรับเสียงตามสภาพแวดล้อม — เรียกทุกเฟรมจาก tickHeli
     env = {alt: ความสูงเหนือพื้น(ม.), spd: ความเร็วแนวราบ(ม./วิ), near: ระยะถึงตึกใกล้สุด(ม.)} */
  envUpdate(env,dt){
    this.ensureCtx();
    const t=this.ctx.currentTime, sm=.12;
    // ⚠️ ห้ามแตะ master.gain ตรงนี้ — โหมดเสียงสังเคราะห์ใช้ master คุมระดับเครื่องยนต์อยู่ (จะตีกัน)
    // จึงแทรก envG (ระดับตามสภาพแวดล้อม) + envLp (ความทุ้ม) คั่นระหว่าง master → ลำโพง
    if(!this.envG){
      this.envG=this.ctx.createGain();
      this.envLp=this.ctx.createBiquadFilter(); this.envLp.type='lowpass'; this.envLp.frequency.value=20000;
      this.master.disconnect();
      this.master.connect(this.envG); this.envG.connect(this.envLp);
      // 🎧 แพนซ้าย-ขวาตามทิศตึกที่สะท้อนเสียงกลับมา (เบราว์เซอร์เก่าไม่มี StereoPanner = ข้ามไป ไม่พัง)
      if(this.ctx.createStereoPanner){
        this.envPan=this.ctx.createStereoPanner();
        this.envLp.connect(this.envPan); this.envPan.connect(this.ctx.destination);
      }else this.envLp.connect(this.ctx.destination);
    }
    // ① ยิ่งสูง อากาศบาง+ไกลพื้น = เสียงเบาลงและทุ้มลง (ไม่เกิน MAX_DAMP)
    const hi=Math.max(0,Math.min(1,(env.alt-ALT_QUIET_FROM)/(ALT_QUIET_TO-ALT_QUIET_FROM)));
    // ② บินใกล้ตึก = เสียงสะท้อนกลับมา ดังขึ้นนิดหน่อย (ground/wall effect)
    const echo=Math.max(0,Math.min(1,(ECHO_NEAR-Math.min(env.near,ECHO_NEAR))/ECHO_NEAR));
    this.envG.gain.setTargetAtTime((1-hi*ALT_MAX_DAMP)*(1+echo*ECHO_BOOST),t,sm);
    this.envLp.frequency.setTargetAtTime(20000-hi*(20000-ALT_LP_MIN),t,sm);
    // 🎧 เสียงสะท้อนเอียงไปข้างที่มีตึก — ไกลตึก (echo≈0) = อยู่กลางเหมือนเดิม
    if(this.envPan) this.envPan.pan.setTargetAtTime((env.side||0)*echo*PAN_MAX,t,PAN_SMOOTH);
    // ③ ลมปะทะตามความเร็ว (ยิ่งเร็วยิ่งดังและแหลมขึ้น) — ลมในห้องนักบิน ไม่ต้องโดนหรี่ตามความสูง
    this.buildWind();
    const sp=Math.max(0,Math.min(1,env.spd/WIND_FULL_SPD));
    this.windG.gain.setTargetAtTime(sp*sp*WIND_MAX,t,sm);
    this.windBp.frequency.setTargetAtTime(420+sp*900,t,sm);
  },
  /* เสียงวิทยุ "ซ่า-คลิก" (squelch) ก่อนหอบังคับพูด — สไตล์วิทยุการบินจริง */
  squelch(){
    if(!state.sound) return;
    this.ensureCtx();
    const t=this.ctx.currentTime;
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf?this.noiseBuf():(function(ctx){
      const len=ctx.sampleRate*.5, b=ctx.createBuffer(1,len,ctx.sampleRate);
      const d=b.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1; return b;
    })(this.ctx);
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1500; bp.Q.value=1.2;
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.09,t);
    g.gain.exponentialRampToValueAtTime(.001,t+.13);
    n.connect(bp); bp.connect(g); g.connect(this.master||this.ctx.destination);
    n.start(t); n.stop(t+.15);
    const o=this.ctx.createOscillator(); o.type='square'; o.frequency.value=1750;  // คลิกปลาย
    const og=this.ctx.createGain();
    og.gain.setValueAtTime(.06,t+.13);
    og.gain.exponentialRampToValueAtTime(.001,t+.18);
    o.connect(og); og.connect(this.master||this.ctx.destination);
    o.start(t+.13); o.stop(t+.19);
  },
  /* เสียงเตือนใกล้ชน: บี๊บถี่ขึ้นตามระดับ (1=ห่าง 2=ใกล้ 3=ใกล้มาก) — สไตล์ proximity warning */
  _proxLvl:0,_proxTm:0,
  proximity(level){
    if(level===this._proxLvl) return;
    this._proxLvl=level;
    if(this._proxTm){ clearInterval(this._proxTm); this._proxTm=0; }
    if(!level) return;
    const gap=[0,640,330,150][level], vol=[0,.1,.14,.2][level], freq=level===3?1180:950;
    const blip=()=>{
      if(!state.sound || !this.ctx) return;
      const t=this.ctx.currentTime;
      const o=this.ctx.createOscillator(); o.type='square'; o.frequency.value=freq;
      const g=this.ctx.createGain();
      g.gain.setValueAtTime(vol,t);
      g.gain.exponentialRampToValueAtTime(.001,t+.07);
      o.connect(g); g.connect(this.master||this.ctx.destination);
      o.start(t); o.stop(t+.08);
    };
    this.ensureCtx();
    blip();
    this._proxTm=setInterval(blip,gap);
  },
  thud(vol){
    if(!state.sound || !this.ctx) { sfx.wrong(); return; }
    const t=this.ctx.currentTime;
    const o=this.ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(70,t);
    o.frequency.exponentialRampToValueAtTime(35,t+.25);
    const g=this.ctx.createGain(); g.gain.setValueAtTime(vol||.6,t);
    g.gain.exponentialRampToValueAtTime(.001,t+.3);
    o.connect(g); g.connect(this.master||this.ctx.destination);
    o.start(t); o.stop(t+.32);
  },
  stop(){
    this.on=false; this.ready=false; this.rpm=0;
    this.proximity(0);
    this.overspeed(false);                               // 🚨 หวอต้องหยุด ไม่งั้นดังค้างนอกโลกเฮลิฯ
    clearTimeout(this._startTm); clearTimeout(this._downTm);
    showHeliSkip(false);
    if(this.windG) this.windG.gain.value=.0001;          // 🌬️ ลมต้องหยุดด้วย ไม่งั้นซ่าค้างหลังออกจากโลก
    [this.startPlay,this.rotorPlay,this.highPlay].forEach(p=>{ if(p) try{ p.src.stop(); }catch(e){} });
    this.startPlay=this.rotorPlay=this.highPlay=null;
    this.nodes.forEach(n=>{ try{ n.stop(); }catch(e){} });
    // ⚠️ แหล่งเสียงลมถูก stop() ไปกับ nodes แล้ว ต้องล้างตัวแปรด้วย ไม่งั้น buildWind คิดว่ามีอยู่ = รอบหน้าไม่มีเสียงลม
    this.nodes=[]; this.lfo=null; this.whine=null; this.whineG=null; this.windG=null; this.windBp=null;
    if(this.master) this.master.gain.value=0;
  },
};

/* ---------- เสียงโดรน FPV — สังเคราะห์ (ปลอดลิขสิทธิ์) · มีไฟล์ sound/drone_loop.mp3 ใช้แทนอัตโนมัติ ----------
   ต่างจากเฮลิฯ: เสียงบัซซ์แหลมของมอเตอร์ 4 ตัว ตอบสนองไว เร่งปุ๊บพุ่งขึ้นทันที (แรงเฉื่อยต่ำ) */
const DroneSound={
  ctx:null,master:null,motors:[],motorG:null,buzz:null,buzzG:null,noiseG:null,det:[-6,-2,3,7],nodes:[],
  files:{loop:null},probed:false,on:false,ready:false,rpm:0,
  probe(){
    if(this.probed) return; this.probed=true;
    const a=new Audio(); a.addEventListener('canplaythrough',()=>{ this.files.loop=a; },{once:true});
    a.preload='auto'; a.src='sound/drone_loop.mp3';    // อัปเกรดจาก Suno (PROMPTS_DRONE.md)
  },
  ensureCtx(){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!this.ctx){ this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.connect(this.ctx.destination); }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
  },
  buildNodes(){
    this.ensureCtx();
    this.motorG=this.ctx.createGain(); this.motorG.gain.value=.13; this.motorG.connect(this.master);
    this.motors=this.det.map(d=>{
      const o=this.ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=150+d; o.start(); o.connect(this.motorG); return o;
    });
    this.buzz=this.ctx.createOscillator(); this.buzz.type='square'; this.buzz.frequency.value=280;
    this.buzzG=this.ctx.createGain(); this.buzzG.gain.value=.03; this.buzz.connect(this.buzzG); this.buzzG.connect(this.master); this.buzz.start();
    const len=this.ctx.sampleRate*2, buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const nd=buf.getChannelData(0); for(let i=0;i<len;i++) nd[i]=Math.random()*2-1;
    const noi=this.ctx.createBufferSource(); noi.buffer=buf; noi.loop=true;
    const hp=this.ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1800;
    this.noiseG=this.ctx.createGain(); this.noiseG.gain.value=.01;
    noi.connect(hp); hp.connect(this.noiseG); this.noiseG.connect(this.master); noi.start();
    this.nodes=[...this.motors,this.buzz,noi];
  },
  start(){
    if(this.on) return;
    this.on=true; this.ready=false; this.rpm=.35;
    this.probe();
    if(!state.sound){ this.ready=true; return; }
    if(this.files.loop){
      this.files.loop.loop=true; this.files.loop.volume=.5;
      this.files.loop.play().catch(()=>{}); this.ready=true; return;
    }
    this.buildNodes();
    const t=this.ctx.currentTime;
    this.master.gain.setValueAtTime(.001,t);
    this.master.gain.linearRampToValueAtTime(.4,t+.5);   // อาร์มเร็ว (โดรนพร้อมบินทันที)
    setTimeout(()=>{ this.ready=true; },500);
  },
  update(col,speed,dt){
    if(!this.on) return;
    if(!state.sound){ this.stop(); this.on=true; this.ready=true; return; }
    const target=.5+Math.max(0,col)*.5 + Math.min(.5,speed/DRONE_VMAX*.5);   // RPM ตามคันเร่ง+ความเร็ว
    this.rpm+=(target-this.rpm)*Math.min(1,(dt||.016)*4);                     // ตอบสนองไว (แรงเฉื่อยต่ำ)
    const r=this.rpm;
    if(this.files.loop){ this.files.loop.playbackRate=.75+r*.9; this.files.loop.volume=.35+r*.3; return; }
    if(this.motors.length) this.motors.forEach((o,i)=>{ o.frequency.value=(150+this.det[i])*(1+r*2.2); });
    if(this.buzz) this.buzz.frequency.value=240+r*520;
    if(this.buzzG) this.buzzG.gain.value=.02+r*.05;
    if(this.noiseG) this.noiseG.gain.value=.006+Math.min(1,speed/DRONE_VMAX)*.05;
    if(this.master) this.master.gain.value=.18+r*.3;
  },
  _proxLvl:0,_proxTm:0,
  proximity(level){
    if(level===this._proxLvl) return; this._proxLvl=level;
    if(this._proxTm){ clearInterval(this._proxTm); this._proxTm=0; }
    if(!level) return;
    const gap=[0,600,300,140][level], vol=[0,.08,.12,.17][level], freq=level===3?1320:1050;
    const blip=()=>{
      if(!state.sound||!this.ctx) return;
      const t=this.ctx.currentTime;
      const o=this.ctx.createOscillator(); o.type='square'; o.frequency.value=freq;
      const g=this.ctx.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+.06);
      o.connect(g); g.connect(this.master||this.ctx.destination); o.start(t); o.stop(t+.07);
    };
    this.ensureCtx(); blip(); this._proxTm=setInterval(blip,gap);
  },
  thud(){
    if(!state.sound||!this.ctx){ sfx.wrong(); return; }
    const t=this.ctx.currentTime;
    const o=this.ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(90,t); o.frequency.exponentialRampToValueAtTime(40,t+.2);
    const g=this.ctx.createGain(); g.gain.setValueAtTime(.5,t); g.gain.exponentialRampToValueAtTime(.001,t+.25);
    o.connect(g); g.connect(this.master||this.ctx.destination); o.start(t); o.stop(t+.27);
  },
  /* 🪟 กระจกแตก — noise ความถี่สูงสั้นๆ ซ้อนเสียงเศษกระจกร่วง */
  glass(){
    if(!state.sound||!this.ctx) return;
    const t=this.ctx.currentTime, dur=.5;
    const buf=this.ctx.createBuffer(1,Math.floor(this.ctx.sampleRate*dur),this.ctx.sampleRate);
    const ch=buf.getChannelData(0);
    for(let i=0;i<ch.length;i++){ const k=i/ch.length; ch[i]=(Math.random()*2-1)*Math.pow(1-k,2.4); }
    const src=this.ctx.createBufferSource(); src.buffer=buf;
    const hp=this.ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=2600;
    const g=this.ctx.createGain(); g.gain.value=.5;
    src.connect(hp); hp.connect(g); g.connect(this.master||this.ctx.destination); src.start(t);
    for(let i=0;i<5;i++){                                   // เศษกระจกกระเด็นเป็นเม็ดๆ
      const o=this.ctx.createOscillator(); o.type='triangle';
      o.frequency.value=1800+Math.random()*2600;
      const gg=this.ctx.createGain(); const st=t+.05+Math.random()*.3;
      gg.gain.setValueAtTime(.0001,st); gg.gain.exponentialRampToValueAtTime(.12,st+.008);
      gg.gain.exponentialRampToValueAtTime(.0001,st+.12);
      o.connect(gg); gg.connect(this.master||this.ctx.destination); o.start(st); o.stop(st+.14);
    }
  },
  /* ⛈ ฟ้าผ่า — เสียงเปรี้ยงแล้วครืนยาว */
  thunder(){
    if(!state.sound||!this.ctx) return;
    const t=this.ctx.currentTime, dur=2.2;
    const buf=this.ctx.createBuffer(1,Math.floor(this.ctx.sampleRate*dur),this.ctx.sampleRate);
    const ch=buf.getChannelData(0);
    for(let i=0;i<ch.length;i++){ const k=i/ch.length; ch[i]=(Math.random()*2-1)*Math.pow(1-k,1.5); }
    const src=this.ctx.createBufferSource(); src.buffer=buf;
    const lp=this.ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(1400,t);
    lp.frequency.exponentialRampToValueAtTime(160,t+1.6);
    const g=this.ctx.createGain(); g.gain.setValueAtTime(.0001,t);
    g.gain.linearRampToValueAtTime(.42,t+.06); g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    src.connect(lp); lp.connect(g); g.connect(this.master||this.ctx.destination); src.start(t);
  },
  stop(){
    this.on=false; this.ready=false; this.rpm=0; this.proximity(0);
    if(this.files.loop) this.files.loop.pause();
    this.nodes.forEach(n=>{ try{ n.stop(); }catch(e){} }); this.nodes=[]; this.motors=[]; this.buzz=null;
    if(this.master) this.master.gain.value=0;
  },
};

/* ============================================================
   Loop หลัก
   ============================================================ */
/* ============================================================
   ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
   ============================================================ */
function soccerLetterPos(){
  return {x:(Math.random()*2-1)*9, y:1.1+Math.random()*4, z:GOAL_Z+3+Math.random()*11};   // ลอยนิ่งหน้าประตู
}
/* ตัวอักษรนี้ยัง "ต้องการ" ประกอบคำเป้าหมายอยู่ไหม (need รวมทุกคำ > ที่เก็บใน inv แล้ว) */
function letterNeeded(ch){
  let need=0; words.forEach(w=>{ for(const c of w.en) if(c===ch) need++; });
  return need > (inv[ch]||0);
}
/* multiset ตัวอักษรที่ยังต้องการ (เรียงตามลำดับคำ — คำแรกมาก่อน) */
function soccerNeededSet(){
  const need={}; words.forEach(w=>{ for(const c of w.en) need[c]=(need[c]||0)+1; });
  Object.keys(inv).forEach(c=>{ if(need[c]) need[c]=Math.max(0,need[c]-(inv[c]||0)); });
  const arr=[]; words.forEach(w=>{ for(const c of w.en){ if(need[c]>0){ arr.push(c); need[c]--; } } });
  return arr;
}
function soccerTileGeo(){ return _soccerTileGeo||(_soccerTileGeo=new THREE.PlaneGeometry(2.4,2.4)); }
/* ✨ ป้ายตัวอักษร "หวือหวา" เหมือนเหรียญ — พื้นทองไล่แสง + ประกายดาว + ตัวอักษรขาวขอบเข้ม (ตัวที่ประกอบคำได้) */
function soccerGoldTexture(ch){
  const key='SG'+ch; if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const c=cv.getContext('2d');
  const g=c.createRadialGradient(52,44,8,64,64,74);
  g.addColorStop(0,'#fff6c9'); g.addColorStop(.45,'#ffd23e'); g.addColorStop(1,'#e8952a');
  c.beginPath(); c.roundRect(8,8,112,112,26); c.fillStyle=g; c.fill();
  c.lineWidth=7; c.strokeStyle='#fff3b0'; c.stroke();
  c.fillStyle='rgba(255,255,255,.9)';                       // ประกายดาว
  [[30,28,7],[98,40,5],[46,104,5],[104,98,6]].forEach(([x,y,r])=>{
    c.beginPath(); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2, rr=k%2?r*.4:r; const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr; k?c.lineTo(px,py):c.moveTo(px,py); } c.closePath(); c.fill();
  });
  c.fillStyle='#fff'; c.font='900 82px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.lineWidth=7; c.strokeStyle='rgba(140,70,0,.85)';
  c.strokeText(ch.toUpperCase(),64,72); c.fillText(ch.toUpperCase(),64,72);
  const t=new THREE.CanvasTexture(cv); texCache[key]=t; return t;
}
/* ป้ายฟุตบอล = Plane (หงายหลังได้จริง) · gold=ประกอบคำได้ · ปกติ=ตัวอักษรทั่วไป */
function makeSoccerTile(ch,p){
  const gold=letterNeeded(ch);
  const mat=new THREE.MeshBasicMaterial({map:gold?soccerGoldTexture(ch):letterTexture(ch),transparent:true,side:THREE.DoubleSide});
  const m=new THREE.Mesh(soccerTileGeo(),mat);
  m.position.set(p.x,p.y,p.z);
  scene.add(m);
  return {ch,spr:m,born:performance.now(),baseY:p.y,home:{x:p.x,y:p.y,z:p.z},flip:0,cool:0,gold};
}
/* อัปเดตหน้าตาป้ายให้ตรงสถานะ needed (ทอง/ปกติ) — เรียกหลัง inv เปลี่ยน */
function soccerRefreshSkins(){
  letters.forEach(l=>{
    const g=letterNeeded(l.ch);
    if(g!==l.gold){ l.gold=g; l.spr.material.map=g?soccerGoldTexture(l.ch):letterTexture(l.ch); l.spr.material.needsUpdate=true; }
  });
}
/* สร้างชุดป้ายเป้าคงที่ (SOCCER_TILES ใบ) — ครอบตัวอักษรที่ต้องการ + เติมสุ่มจากคำเป้าหมาย */
function soccerBuildTargets(){
  while(letters.length) removeLetter(0);
  let chars=soccerNeededSet();
  const pool=[]; words.forEach(w=>{ for(const c of w.en) pool.push(c); });
  while(chars.length<SOCCER_TILES && pool.length) chars.push(pool[Math.floor(Math.random()*pool.length)]);
  chars=chars.slice(0,SOCCER_TILES);
  shuffle(chars).forEach(ch=>letters.push(makeSoccerTile(ch,soccerLetterPos())));
}
/* หลังประกอบคำเสร็จ: รีไซเคิลป้ายที่ไม่ต้องการแล้ว → ตัวอักษรที่ยังขาด (คงจำนวนป้ายเท่าเดิม) */
function soccerRetarget(){
  const need={}; soccerNeededSet().forEach(c=>need[c]=(need[c]||0)+1);
  letters.forEach(l=>{ if(letterNeeded(l.ch)) need[l.ch]=Math.max(0,(need[l.ch]||0)-1); });   // ที่โชว์อยู่แล้ว
  const want=[]; Object.keys(need).forEach(c=>{ for(let k=0;k<need[c];k++) want.push(c); });
  letters.forEach(l=>{
    if(!letterNeeded(l.ch) && want.length){
      l.ch=want.shift();
      l.home=soccerLetterPos(); l.spr.position.set(l.home.x,l.home.y,l.home.z); l.baseY=l.home.y;
    }
  });
  soccerRefreshSkins();
}
function soccerCoinPop(worldPos){
  if(!coinPopEl || !camera) return;
  const v=worldPos.clone().project(camera);
  if(v.z>1) return;
  const el=document.createElement('div'); el.className='sc-pop';
  el.innerHTML=`+${SOCCER_LETTER_COIN}🪙`;
  el.style.left=((v.x*.5+.5)*window.innerWidth)+'px';
  el.style.top=((-v.y*.5+.5)*window.innerHeight)+'px';
  coinPopEl.appendChild(el);
  setTimeout(()=>el.remove(),900);
}
/* พื้นสนาม: หญ้าลายตัด + เส้นขาว (ขอบ/เส้นกลาง/วงกลมกลาง/กรอบเขตโทษ 2 ฝั่ง) */
function soccerFieldTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=512;
  const c=cv.getContext('2d');
  for(let i=0;i<11;i++){ c.fillStyle=i%2?'#3f9d43':'#379139'; c.fillRect(0,i*512/11,512,512/11+1); }
  c.strokeStyle='rgba(255,255,255,.92)'; c.lineWidth=5;
  c.strokeRect(26,26,460,460);                                  // ขอบสนาม
  c.beginPath(); c.moveTo(26,256); c.lineTo(486,256); c.stroke();// เส้นกลาง
  c.beginPath(); c.arc(256,256,58,0,7); c.stroke();             // วงกลมกลาง
  [26,486-96].forEach(y0=>{ c.strokeRect(160,y0>256?y0:y0+70,192,96); }); // กรอบเขตโทษหยาบๆ 2 ฝั่ง
  const t=new THREE.CanvasTexture(cv); return t;
}
function soccerNetTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d'); c.clearRect(0,0,128,128);
  c.strokeStyle='rgba(255,255,255,.85)'; c.lineWidth=2;
  for(let i=0;i<=128;i+=12){ c.beginPath(); c.moveTo(i,0); c.lineTo(i,128); c.moveTo(0,i); c.lineTo(128,i); c.stroke(); }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(6,3); return t;
}
function soccerCrowdTexture(){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=64;
  const c=cv.getContext('2d'); c.fillStyle='#2a3138'; c.fillRect(0,0,256,64);
  const cols=['#ff5252','#ffd54f','#4fc3f7','#fff','#66bb6a','#ba68c8','#ff8a65'];
  for(let i=0;i<520;i++){ c.fillStyle=cols[(Math.random()*cols.length)|0];
    c.beginPath(); c.arc(Math.random()*256,Math.random()*64,1.6+Math.random()*1.4,0,7); c.fill(); }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(8,1); return t;
}
function soccerBallMat(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d'); c.fillStyle='#f5f5f5'; c.fillRect(0,0,128,128);
  c.fillStyle='#1a1a1a';
  for(let i=0;i<7;i++){ const x=Math.random()*128,y=Math.random()*128,r=8+Math.random()*7;
    c.beginPath(); for(let k=0;k<5;k++){ const a=k/5*7+i; const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r; k?c.lineTo(px,py):c.moveTo(px,py); } c.closePath(); c.fill(); }
  return new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(cv)});
}
function buildSoccerGoal(sc,z,w,h){
  const white=new THREE.MeshLambertMaterial({color:0xffffff});
  const r=0.12, hw=w/2;
  [-hw,hw].forEach(x=>{ const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,10),white); p.position.set(x,h/2,z); sc.add(p); });
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w,10),white); bar.rotation.z=Math.PI/2; bar.position.set(0,h,z); sc.add(bar);
  const net=new THREE.MeshBasicMaterial({map:soccerNetTexture(),transparent:true,side:THREE.DoubleSide,opacity:.5});
  const depth=2.4;
  const back=new THREE.Mesh(new THREE.PlaneGeometry(w,h),net); back.position.set(0,h/2,z-depth); sc.add(back);
  const top=new THREE.Mesh(new THREE.PlaneGeometry(w,depth),net); top.rotation.x=Math.PI/2; top.position.set(0,h,z-depth/2); sc.add(top);
  [-hw,hw].forEach(x=>{ const sd=new THREE.Mesh(new THREE.PlaneGeometry(depth,h),net); sd.rotation.y=Math.PI/2; sd.position.set(x,h/2,z-depth/2); sc.add(sd); });
}
function buildStands(sc,fw,fl){
  const crowd=new THREE.MeshLambertMaterial({map:soccerCrowdTexture(),side:THREE.DoubleSide});
  const hw=fw/2+5, hl=fl/2+5, H=7;
  const add=(w,px,pz,ry)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,H),crowd);
    m.position.set(px,H/2,pz); m.rotation.y=ry; m.rotation.x=-.2; sc.add(m); };
  add(fw+12,0,-hl,0); add(fw+12,0,hl,Math.PI);
  add(fl+12,-hw,0,Math.PI/2); add(fl+12,hw,0,-Math.PI/2);
}
function soccerNumTex(no){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d'); c.clearRect(0,0,128,128);
  c.font='900 78px Arial'; c.textAlign='center'; c.textBaseline='middle';
  const s=String(no).slice(0,2)||'10';
  c.lineWidth=8; c.strokeStyle='rgba(0,0,0,.55)'; c.strokeText(s,64,66);
  c.fillStyle='#fff'; c.fillText(s,64,66);
  return new THREE.CanvasTexture(cv);
}
/* หุ่นนักเตะบล็อก: เสื้อสีเลือก + เบอร์หลังเสื้อ (หัน +Z = ด้านหลัง เห็นจากกล้องหลังบอล) · ขวา = ขาเตะ */
function makeSoccerPlayer(shirtColor,no){
  const g=new THREE.Group();
  const skin=blkMat(0xffcf9e), shirt=blkMat(shirtColor), shorts=blkMat(0xffffff), hairM=blkMat(0x2b2320), boot=blkMat(0x232323);
  const legs=[];
  [-0.15,0.15].forEach(x=>{
    const piv=new THREE.Group(); piv.position.set(x,.5,0);
    const thigh=new THREE.Mesh(blkGeo(.22,.34,.24),shorts); thigh.position.y=-.17; piv.add(thigh);
    const shin=new THREE.Mesh(blkGeo(.2,.3,.22),skin); shin.position.y=-.46; piv.add(shin);
    const bt=new THREE.Mesh(blkGeo(.22,.14,.34),boot); bt.position.set(0,-.62,.05); piv.add(bt);
    g.add(piv); legs.push(piv);
  });
  const torso=new THREE.Mesh(blkGeo(.58,.62,.34),shirt); torso.position.y=.82; g.add(torso);
  const num=new THREE.Mesh(new THREE.PlaneGeometry(.4,.4),
    new THREE.MeshBasicMaterial({map:soccerNumTex(no),transparent:true}));
  num.position.set(0,.9,.18); g.add(num);                        // ด้าน +Z (หลัง)
  [-1,1].forEach(s=>{
    const arm=new THREE.Mesh(blkGeo(.15,.5,.2),shirt); arm.position.set(s*.4,.82,0); arm.rotation.z=s*-.08; g.add(arm);
    const hand=new THREE.Mesh(blkGeo(.14,.14,.16),skin); hand.position.set(s*.44,.53,0); g.add(hand);
  });
  const head=new THREE.Mesh(blkGeo(.44,.44,.44),skin); head.position.y=1.32; g.add(head);
  const hair=new THREE.Mesh(blkGeo(.48,.16,.48),hairM); hair.position.y=1.5; g.add(hair);
  g.userData.legs=legs;
  return g;
}
function soccerResetBall(){
  if(!soccerBall) return;
  soccerBall.position.set(0,BALL_R,PLAYER_Z);
  sbVel.x=sbVel.y=sbVel.z=0; sbLive=false; sbRestAt=0; sbGoaled=false; sChg=0; sCharging=false;
}
function soccerKick(power){
  const spd=KICK_SPD_MIN+(Math.max(6,power)/100)*(KICK_SPD_MAX-KICK_SPD_MIN);
  const dx=Math.sin(aimYaw), dz=-Math.cos(aimYaw), ch=Math.cos(aimPitch), sh=Math.sin(aimPitch);
  sbVel.x=dx*ch*spd; sbVel.z=dz*ch*spd; sbVel.y=sh*spd;
  sbLive=true; sbRestAt=0; sbKickAt=performance.now(); sbGoaled=false; sLegSwing=1;
  sfx.select();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(30);
}
function soccerCheer(){ sfx.levelup(); showBanner('⚽ <b>เข้าประตู!</b> เก่งมาก!'); }
function updateSoccerGuide(ready,dx,dz){
  if(!ready){ soccerGuide.forEach(d=>d.visible=false); return; }
  const power=sCharging?sChg:55;
  const spd=KICK_SPD_MIN+(Math.max(6,power)/100)*(KICK_SPD_MAX-KICK_SPD_MIN);
  const ch=Math.cos(aimPitch), sh=Math.sin(aimPitch);
  let vx=dx*ch*spd, vy=sh*spd, vz=dz*ch*spd;
  let px=0, py=BALL_R, pz=PLAYER_Z;
  const h=0.055;
  for(let i=0;i<soccerGuide.length;i++){
    for(let k=0;k<3;k++){ vy-=BALL_G*h; px+=vx*h; py+=vy*h; pz+=vz*h; }
    soccerGuide[i].position.set(px,Math.max(BALL_R,py),pz);
    soccerGuide[i].visible=(py>-.2);
  }
}
function soccerCamera(dt,dx,dz){
  const b=soccerBall.position;
  const k=Math.min(1,dt*4);
  if(soccerCam1){
    camera.position.set(-dx*.35,1.55,PLAYER_Z-dz*.35);
    camera.lookAt(dx*12,1.55+Math.sin(aimPitch)*7,PLAYER_Z+dz*12);
    return;
  }
  const foc = sbLive? b : {x:0,y:1.1,z:PLAYER_Z-1.5};
  const cx=foc.x - dx*8, cz=foc.z - dz*8, cy=(sbLive?b.y:1.4)+3.4;
  camera.position.x+=(cx-camera.position.x)*k;
  camera.position.y+=(cy-camera.position.y)*k;
  camera.position.z+=(cz-camera.position.z)*k;
  camera.lookAt(foc.x, foc.y+0.6, foc.z);
}
function tickSoccer(dt,now){
  // เล็ง (คีย์บอร์ด + ปุ่มมือถือ) — ปรับได้ตลอด แม้กำลังชาร์จ
  if(keys.KeyA||keys.ArrowLeft||sPadL) aimYaw-=AIM_YAW_SP*dt;
  if(keys.KeyD||keys.ArrowRight||sPadR) aimYaw+=AIM_YAW_SP*dt;
  if(keys.KeyW||keys.ArrowUp||sPadU) aimPitch+=AIM_PITCH_SP*dt;
  if(keys.KeyS||keys.ArrowDown||sPadD) aimPitch-=AIM_PITCH_SP*dt;
  aimYaw=Math.max(-.8,Math.min(.8,aimYaw));
  aimPitch=Math.max(.06,Math.min(.92,aimPitch));
  if(keys.KeyV && !sPrevV){ soccerCam1=!soccerCam1; sfx.select(); } sPrevV=!!keys.KeyV;

  const ready=!sbLive;
  const holding=(!!keys.Space||sKickHeld)&&ready;
  if(holding){ sCharging=true; sChg=Math.min(100,sChg+CHARGE_RATE*dt); }
  else if(sCharging){ soccerKick(sChg); sCharging=false; }        // ปล่อย = เตะ
  if(powerFillEl) powerFillEl.style.height=(sCharging?sChg:0)+'%';

  const dx=Math.sin(aimYaw), dz=-Math.cos(aimYaw);

  if(soccerPlayer){
    soccerPlayer.rotation.y=aimYaw;
    if(sLegSwing>0){ sLegSwing=Math.max(0,sLegSwing-dt*4);
      const sw=Math.sin((1-sLegSwing)*Math.PI)*1.25;
      if(soccerPlayer.userData.legs) soccerPlayer.userData.legs[1].rotation.x=-sw;
    }
  }
  updateSoccerGuide(ready,dx,dz);

  if(sbLive){
    sbVel.y-=BALL_G*dt;
    const b=soccerBall.position;
    b.x+=sbVel.x*dt; b.y+=sbVel.y*dt; b.z+=sbVel.z*dt;
    if(b.y<=BALL_R){ b.y=BALL_R;
      if(sbVel.y<-0.6){ sbVel.y=-sbVel.y*.5; sbVel.x*=.82; sbVel.z*=.82; }   // เด้งพื้น (สูญเสียแรงบ้าง)
      else { sbVel.y=0; sbVel.x*=(1-1.7*dt); sbVel.z*=(1-1.7*dt); }          // กลิ้งบนพื้น (แรงเสียดทานต่อวินาที)
    }
    else { sbVel.x*=(1-.12*dt); sbVel.z*=(1-.12*dt); }                       // แรงต้านอากาศ (เฉพาะตอนลอย)
    for(let i=0;i<letters.length;i++){
      const l=letters[i], lp=l.spr.position;
      if((l.cool||0)>now) continue;                                    // ยังหงายค้าง ยังไม่นับซ้ำ
      if(Math.hypot(lp.x-b.x,lp.y-b.y,lp.z-b.z)<SOCCER_COLLECT){
        l.flip=1; l.cool=now+520;                                      // หงายหลังแล้วเด้งกลับ (1 เตะ 1 ครั้ง)
        speakLetter(l.ch);
        if(letterNeeded(l.ch)){                                        // ตัวประกอบคำได้ = +เหรียญ + ป๊อปหวือหวา
          inv[l.ch]=(inv[l.ch]||0)+1;
          addCoins(SOCCER_LETTER_COIN); sessionCoins+=SOCCER_LETTER_COIN;
          soccerCoinPop(l.spr.position); sfx.coin();
          renderHudInv(); renderHudWords(); renderHudTop();
          tryCompleteWords();
          soccerRefreshSkins();
        } else { sfx.select(); }                                       // ตัวไม่ต้องการ = แค่เด้ง ไม่ได้เหรียญ
      }
    }
    if(!sbGoaled && b.z<GOAL_Z && Math.abs(b.x)<GOAL_HW && b.y<GOAL_H){ sbGoaled=true; soccerCheer(); }
    const spd=Math.hypot(sbVel.x,sbVel.y,sbVel.z);
    const oob=Math.abs(b.x)>30||b.z<GOAL_Z-7||b.z>PLAYER_Z+9||b.y>28;
    if((b.y<=BALL_R+.02 && spd<1.1) || oob || now-sbKickAt>4500){
      if(!sbRestAt) sbRestAt=now;
      if(now-sbRestAt>350 || oob) soccerResetBall();
    } else sbRestAt=0;
  }
  soccerCamera(dt,dx,dz);
  // แอนิเมชันป้าย: โดนเตะ = หงายหลัง+เด้งถอย แล้วสปริงกลับ · ปกติ = ลอยไหวเบาๆ
  const hm={x:0,y:0,z:0};
  letters.forEach(l=>{
    const home=l.home||{x:l.spr.position.x,y:l.baseY||2,z:l.spr.position.z};
    if(l.flip>0){
      l.flip=Math.max(0,l.flip-dt*2.6);
      const t=1-l.flip, s=Math.sin(t*Math.PI);
      l.spr.rotation.x=-s*1.5;                        // หงายหลัง (ยอดเอนออกจากผู้เตะ)
      l.spr.position.set(home.x, home.y+s*.35, home.z - s*.9);
    } else {
      l.spr.rotation.x=0;
      l.spr.position.set(home.x, home.y+Math.sin(now/500+home.x)*.14, home.z);
    }
  });
}
function soccerKitShow(){
  if(!soccerStartEl) return;
  running=false;
  sKitShirt=state.soccerShirt||SOCCER_SHIRTS[0].c;
  sKitNo=String(state.soccerNo||'10');
  const grid=soccerStartEl.querySelector('#ss-shirts');
  grid.innerHTML=SOCCER_SHIRTS.map(s=>
    `<button class="ss-shirt${s.c===sKitShirt?' sel':''}" data-c="${s.c}" title="${s.n}" style="background:#${('000000'+s.c.toString(16)).slice(-6)}"></button>`).join('');
  grid.querySelectorAll('.ss-shirt').forEach(b=>b.addEventListener('click',()=>{
    sKitShirt=+b.dataset.c; sfx.select();
    grid.querySelectorAll('.ss-shirt').forEach(x=>x.classList.toggle('sel',x===b));
  }));
  soccerStartEl.querySelector('#ss-no').textContent=sKitNo;
  soccerStartEl.classList.add('on');
}
function soccerKitGo(){
  state.soccerShirt=sKitShirt; state.soccerNo=sKitNo; saveState();
  soccerStartEl.classList.remove('on');
  if(soccerPlayer && scene) scene.remove(soccerPlayer);
  soccerPlayer=makeSoccerPlayer(sKitShirt,sKitNo);
  soccerPlayer.position.set(0,0,PLAYER_Z); scene.add(soccerPlayer);
  if(introSeen('soccer')){ beginPlay(); showBanner(M.intro); }
  else showIntro('soccer',false);
}

/* ============================================================
   🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
   ============================================================ */
const MechaAudio={
  ctx:null,
  ac(){ if(!this.ctx){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return this.ctx; },
  step(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(38,t+.18);
    const g=c.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.5,t+.012); g.gain.exponentialRampToValueAtTime(.0001,t+.26);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.28);
    const n=c.createBufferSource(), buf=c.createBuffer(1,1400,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
    n.buffer=buf; const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2600; bp.Q.value=.8;
    const ng=c.createGain(); ng.gain.value=.14; n.connect(bp); bp.connect(ng); ng.connect(c.destination); n.start(t); },
  fire(color){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='square'; const f0=520+((color>>8)&0xff);
    o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(130,t+.14);
    const g=c.createGain(); g.gain.setValueAtTime(.2,t); g.gain.exponentialRampToValueAtTime(.001,t+.15);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.16); },
  boom(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const n=c.createBufferSource(), buf=c.createBuffer(1,Math.floor(c.sampleRate*.6),c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
    n.buffer=buf; const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(1800,t); lp.frequency.exponentialRampToValueAtTime(120,t+.5);
    const g=c.createGain(); g.gain.setValueAtTime(.6,t); g.gain.exponentialRampToValueAtTime(.001,t+.6);
    n.connect(lp); lp.connect(g); g.connect(c.destination); n.start(t); },
  warn(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // 🚨 คลักซอนเตือน (โอเวอร์ฮีต/โดนตี) — สองโทนสั้น
    [0,.16].forEach((dt,i)=>{ const o=c.createOscillator(); o.type='sawtooth';
      o.frequency.setValueAtTime(i?520:660,t+dt); o.frequency.linearRampToValueAtTime(i?400:520,t+dt+.12);
      const g=c.createGain(); g.gain.setValueAtTime(.0001,t+dt); g.gain.exponentialRampToValueAtTime(.16,t+dt+.02); g.gain.exponentialRampToValueAtTime(.0001,t+dt+.13);
      const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=800; bp.Q.value=1.2;
      o.connect(bp); bp.connect(g); g.connect(c.destination); o.start(t+dt); o.stop(t+dt+.14); }); },
  enemyShot(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // 👾 เสียงเอเลี่ยนยิง (ซาวด์ต่ำลง)
    const o=c.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(300,t); o.frequency.exponentialRampToValueAtTime(90,t+.22);
    const g=c.createGain(); g.gain.setValueAtTime(.14,t); g.gain.exponentialRampToValueAtTime(.001,t+.24);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.25); },
  pickup(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // ✨ เสียงเก็บของ (ไล่ขึ้นสดใส)
    [660,990,1320].forEach((f,i)=>{ const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(f,t+i*.07);
      const g=c.createGain(); g.gain.setValueAtTime(.0001,t+i*.07); g.gain.exponentialRampToValueAtTime(.16,t+i*.07+.02); g.gain.exponentialRampToValueAtTime(.0001,t+i*.07+.16);
      o.connect(g); g.connect(c.destination); o.start(t+i*.07); o.stop(t+i*.07+.18); }); },
};
/* ✨ รอบ 226: สไปรต์ไอคอนอิโมจิ (ของเก็บ) */
function emojiSprite(emoji){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const x=cv.getContext('2d'); x.font='96px serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillText(emoji,64,74);
  return new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false}));
}
function makeAlien(bossArg){
  const boss=!!bossArg;
  const sp = boss ? (typeof bossArg==='object' ? bossArg : pickBossSpecies()) : null;   // 👾 รอบ 229: บอสมีสายพันธุ์
  const grp=new THREE.Group();
  const bodyCol = boss ? sp.body : new THREE.Color().setHSL(.28+Math.random()*.5,.55,.45).getHex();
  const body=new THREE.Mesh(boss ? sp.geo() : new THREE.IcosahedronGeometry(2.2,1),new THREE.MeshLambertMaterial({color:bodyCol,emissive:boss?sp.emis:0x000000}));
  body.scale.set(1,1.15,1); grp.add(body);
  for(let i=0;i<3;i++){ const e=new THREE.Mesh(new THREE.SphereGeometry(.34,10,8),new THREE.MeshBasicMaterial({color:boss?sp.eye:0xffee55}));
    e.position.set((i-1)*.8,.5,-1.95); grp.add(e); }
  const tCol=new THREE.MeshLambertMaterial({color:bodyCol});
  for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const leg=new THREE.Mesh(new THREE.CylinderGeometry(.18,.05,2.8,6),tCol);
    leg.position.set(Math.cos(a)*1.6,-1.7,Math.sin(a)*1.6); leg.rotation.z=Math.cos(a)*.5; leg.rotation.x=Math.sin(a)*.5; grp.add(leg); }
  let word;
  if(boss){ const c=pickWords(sp.wordPick); word=(c.slice().sort((a,b)=>b.en.length-a.en.length)[0])||{en:'dragon',th:'มังกร'}; }
  else word=(pickWords(1)[0])||{en:'cat',th:'แมว'};
  const letters=[]; const n=word.en.length;
  word.en.split('').forEach((ch,i)=>{
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
    spr.scale.set(1.9,1.9,1);
    const off={x:(i-(n-1)/2)*2.3, y:3.3, z:0};      // แถวเรียงซ้าย→ขวา ตามลำดับคำ เหนือหัวเอเลี่ยน
    spr.position.set(off.x,off.y,off.z); grp.add(spr);
    letters.push({ch,spr,idx:i,off,done:false});
  });
  const p=alienSpawnPos();
  const scl=boss?sp.scale:1;
  grp.position.set(p.x,4.5,p.z); if(boss) grp.scale.setScalar(scl); scene.add(grp);
  const al={grp,word,letters,nextIdx:0,tgt:{x:p.x,z:p.z},wanderAt:0,born:performance.now(),
            boss:!!boss, species:sp, gs:scl, shotAt:performance.now()+1400+Math.random()*1600};
  aliens.push(al);
  if(boss) showBanner(`${sp.emoji} <b>บอส${escapeHTML(sp.th)} มาแล้ว!</b><br>คำยาวพิเศษ — ยิงให้ครบรับโบนัส 🪙`);
  return al;
}
/* 🌊 รอบ 229: Endless Wave — เริ่มเวฟใหม่ (ตั้งเป้า/จำนวน/ความยาก) แล้วปล่อยเอเลี่ยนให้ครบ */
function startWave(w){
  const cfg=waveCfg(w);
  mWave=w; mWaveGoal=cfg.goal; mWaveConc=cfg.conc; mWaveSpd=cfg.spd;
  mWaveBoss=cfg.boss; mWaveBossDone=false; mWaveKilled=0; mWaveSpawned=0;
  if(w>(state.mechaWaveBest||0)) state.mechaWaveBest=w;              // 🏅 สถิติเวฟสูงสุด
  updateWaveHud();
  if(cfg.boss) showBanner(`🌊 <b>เวฟ ${w}</b> · 👾 <b>Boss Wave!</b><br>ล้มบอสให้ได้เพื่อไปต่อ 💪`);
  else showBanner(`🌊 <b>เวฟ ${w}</b> — ล้มเอเลี่ยน ${cfg.goal} ตัว!`);
  waveSpawnFill();
}
/* เติมเอเลี่ยนบนสนามให้ครบจำนวนพร้อมกัน (ไม่เกินเป้าเวฟ) · Boss Wave: บอสมาเป็นตัวสุดท้าย */
function waveSpawnFill(){
  while(aliens.length < mWaveConc && mWaveSpawned < mWaveGoal){
    const asBoss = mWaveBoss && !mWaveBossDone && (mWaveSpawned === mWaveGoal-1);   // มินเนี่ยนมาก่อน บอสปิดท้าย
    makeAlien(asBoss ? pickBossSpecies() : false);
    if(asBoss) mWaveBossDone=true;
    mWaveSpawned++;
  }
}
/* เคลียร์เวฟครบ → โบนัสเหรียญตามเวฟ + ฉลอง แล้วขึ้นเวฟถัดไป (หน่วงให้แบนเนอร์โชว์) */
function waveComplete(){
  const bonus=20+mWave*10;
  addCoins(bonus); sessionCoins+=bonus;
  if(MechaAudio.boom) MechaAudio.boom();
  showBanner(`🌊✨ <b>เวฟ ${mWave} สำเร็จ!</b><br><span class="adv-ban-coin">+${bonus} 🪙</span>`);
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate([60,40,60,40,120]);
  saveState(); renderHudTop();
  const nxt=mWave+1;
  setTimeout(()=>{ if(running && M.mecha) startWave(nxt); }, 1500);
}
function updateWaveHud(){ if(mhUI&&mhUI.wave) mhUI.wave.textContent=mWave||1; }
/* 🤖 รอบ 229: เช็ก+มอบเข็มนักล่าบอส (ล้มบอสสะสม 3/10/25) — แพทเทิร์นเดียวกับเข็มผาดโผน (game.js) */
function checkMechaBossBadge(){
  if(typeof MECHABOSS_TIERS==='undefined') return;
  const tier=MECHABOSS_TIERS.filter(t=>(state.mechaBoss||0)>=t[0]).pop();
  if(tier && tier[1]>(state.mechaBossBadge||0)){
    state.mechaBossBadge=tier[1]; saveState();
    setTimeout(()=>{ celebrateBadge(mechaBossEmoji(tier[1]), `ได้${MECHABOSS_TIER_UI[tier[1]]}!`,
      `ล้มบอสสะสมครบ ${tier[0]} ตัว — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกเลยนะ 🎉`); }, 1400);
  }
}
function alienSpawnPos(){
  for(let i=0;i<24;i++){ const x=(Math.random()*2-1)*(HALF-8), z=(Math.random()*2-1)*(HALF-8);
    if(!camera || Math.hypot(x-camera.position.x,z-camera.position.z)>22) return {x,z}; }
  return {x:0,z:-30};
}
function removeAlien(a){
  scene.remove(a.grp);
  a.grp.traverse(o=>{ if(o.material){ if(o.material.map&&o.material.map!==null&&o.geometry) {} o.material.dispose&&o.material.dispose(); } if(o.geometry) o.geometry.dispose&&o.geometry.dispose(); });
  const i=aliens.indexOf(a); if(i>=0) aliens.splice(i,1);
}
function mechaHudWord(a){
  if(!hudWordsEl) return;
  if(!a){ hudWordsEl.innerHTML=''; return; }
  const chips=a.word.en.split('').map((ch,i)=>
    `<span class="adv-fch${i<a.nextIdx?' got':''}${i===a.nextIdx?' mnext':''}">${ch.toUpperCase()}</span>`).join('');
  hudWordsEl.innerHTML=`<div class="adv-fword">${chips}</div><div class="adv-fth">${escapeHTML(a.word.th)}</div>`;
}
/* 🤖 รอบ 224: ตั้งภาพกรอบ HUD + สีประจำอาวุธ ตามหุ่นที่เลือกออกรบ */
function setMechaHudSkin(rid){
  if(!mhUI||!mhUI.root) return;
  const n=(String(rid).match(/(\d+)/)||[,'01'])[1].padStart(2,'0');
  mhUI.frame.style.backgroundImage=`url("img/robots/hud/robotHUD_${n}.png")`;
  const hex='#'+('000000'+((mechaWeapon.color||0x7fe6ff)>>>0).toString(16)).slice(-6);
  mhUI.root.style.setProperty('--mh',hex);
  mhUI.root.style.setProperty('--mh-soft',hex);
  mHeat=0; if(mhUI.heat) mhUI.heat.style.width='0%';
  if(mhUI.heatlbl) mhUI.heatlbl.textContent='HEAT';
  if(mhUI.root) mhUI.root.classList.remove('locked','hit','overheat','lowhp','shielded','bosson');
}
/* 🔥 รอบ 227: ป๊อปคอมโบกลางจอ */
function mechaComboPop(mult){
  if(!mhUI||!mhUI.combo) return;
  const el=mhUI.combo; el.textContent=`🔥 COMBO ×${mult}`; el.style.fontSize=(mult>=3?'26px':'20px');
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
}
function mechaShielded(now){ return now<mShieldUntil; }        // 🛡️ รอบ 227: กำลังกางโล่อยู่ไหม
/* 🚨 รอบ 225: โดนโจมตี → เสียหาย + HUD กะพริบแดง + คลักซอนเตือน (โล่กันได้) */
function mechaDamageFx(n){
  damagePlayer(n);                                            // ลด hp + แฟลช #adv-dmg + สั่น + knockedOut ถ้า hp หมด
  MechaAudio.warn();
  if(mhUI&&mhUI.root){ mhUI.root.classList.remove('hit'); void mhUI.root.offsetWidth; mhUI.root.classList.add('hit'); }
}
function mechaHitByAlien(a){
  if(mechaShielded(performance.now())){ MechaAudio.enemyShot(); if(a&&a.grp){ const gs=a.gs||1; a.grp.scale.setScalar(gs*.85); setTimeout(()=>{ if(a.grp) a.grp.scale.setScalar(gs); },140);} return; }  // 🛡️ โล่กัน = ไม่เสียหาย (ดันเอเลี่ยนหด)
  mechaDamageFx(MECHA_ATK_DMG);
  if(a&&a.grp){ const gs=a.gs||1; a.grp.scale.setScalar(gs*1.18); setTimeout(()=>{ if(a.grp) a.grp.scale.setScalar(gs); },160); }   // พุ่งเข้าใส่ (เด้งโต · คืนสเกลเดิม รวมบอส)
}
/* 👾 รอบ 226: เอเลี่ยนยิงกระสุนใส่หุ่น (เล็งตรงตำแหน่งปัจจุบัน — หลบได้ด้วยการสเตรฟ/เดิน) */
function spawnAlienShot(a){
  const from=a.grp.position.clone(); from.y=4.2;
  const dir=camera.position.clone().sub(from); dir.y+=.5; dir.normalize();
  const m=new THREE.Mesh(new THREE.SphereGeometry(a.boss?.6:.4,10,8),
    new THREE.MeshBasicMaterial({color:a.boss?(a.species?a.species.shot:0xff3b6b):0xffb43a}));
  m.position.copy(from); scene.add(m);
  const spd=ALIEN_SHOT_SPD*(a.boss?(a.species?a.species.shotSpd:1.1):1)*(mWaveSpd||1);   // 👾🌊 สายพันธุ์ + เวฟ
  alienShots.push({mesh:m,vel:dir.multiplyScalar(spd),life:5,dmg:a.boss?ALIEN_SHOT_DMG+3:ALIEN_SHOT_DMG});
  MechaAudio.enemyShot();
}
function removeAlienShot(i){
  const s=alienShots[i]; if(!s) return; scene.remove(s.mesh);
  if(s.mesh.geometry)s.mesh.geometry.dispose(); if(s.mesh.material)s.mesh.material.dispose();
  alienShots.splice(i,1);
}
function tickAlienShots(dt,now){
  for(let i=alienShots.length-1;i>=0;i--){
    const s=alienShots[i]; s.mesh.position.addScaledVector(s.vel,dt); s.life-=dt;
    if(s.mesh.position.distanceTo(camera.position)<2.2){          // โดนหุ่น
      if(mechaShielded(now)){ MechaAudio.pickup(); removeAlienShot(i); continue; }   // 🛡️ โล่กันกระสุน (ไม่เสียหาย)
      if(now>mHitAt){ mHitAt=now+700; mechaDamageFx(s.dmg); }
      removeAlienShot(i); continue;
    }
    if(s.life<=0 || Math.abs(s.mesh.position.x)>HALF || Math.abs(s.mesh.position.z)>HALF || s.mesh.position.y<0) removeAlienShot(i);
  }
}
/* ❄️❤️ รอบ 226: ของเก็บกลางสนาม — คูลแดนต์ (ลดร้อน) / ซ่อมเกราะ (ฟื้น hp) */
function spawnPowerup(){
  const type = (hp<=maxHp*0.6 && Math.random()<.55)?'repair' : (mHeat>50||mOverheat)?'cool'
             : ['cool','repair','shield'][Math.floor(Math.random()*3)];
  const grp=new THREE.Group();
  const col=type==='cool'?0x5fd0ff:(type==='repair'?0x4dff9b:0xffd24d);
  const core=new THREE.Mesh(new THREE.OctahedronGeometry(.95,0),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.5}));
  grp.add(core);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.35,.09,8,24),new THREE.MeshBasicMaterial({color:col}));
  ring.rotation.x=Math.PI/2; grp.add(ring);
  const icon=emojiSprite(type==='cool'?'❄️':(type==='repair'?'❤️':'🛡️')); icon.scale.set(2.3,2.3,1); grp.add(icon);
  const p=alienSpawnPos(); grp.position.set(p.x,2.6,p.z); scene.add(grp);
  powerups.push({grp,core,ring,type,bob:Math.random()*6});
}
function removePowerup(i){
  const pu=powerups[i]; if(!pu) return; scene.remove(pu.grp);
  pu.grp.traverse(o=>{ if(o.material)o.material.dispose&&o.material.dispose(); if(o.geometry)o.geometry.dispose&&o.geometry.dispose(); });
  powerups.splice(i,1);
}
function collectPowerup(pu){
  MechaAudio.pickup();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(30);
  if(pu.type==='cool'){ mHeat=0; mOverheat=false; showBanner('❄️ <b>ระบายความร้อน!</b> ปืนพร้อมยิงเต็มพิกัด'); }
  else if(pu.type==='shield'){ mShieldUntil=performance.now()+SHIELD_MS; showBanner('🛡️ <b>โล่พลังงาน!</b> กันกระสุน '+(SHIELD_MS/1000)+' วินาที'); }
  else { hp=Math.min(maxHp,hp+POWERUP_HEAL); renderHudTop(); showBanner(`❤️ <b>ซ่อมเกราะ +${POWERUP_HEAL}</b> พลังงานฟื้นแล้ว`); }
}
function tickPowerups(dt,now){
  for(let i=powerups.length-1;i>=0;i--){
    const pu=powerups[i]; pu.bob+=dt*2.2; pu.grp.position.y=2.6+Math.sin(pu.bob)*.35;
    pu.core.rotation.y+=dt*1.7; pu.core.rotation.x+=dt*1.1; pu.ring.rotation.z+=dt*1.4;
    if(Math.hypot(pu.grp.position.x-camera.position.x,pu.grp.position.z-camera.position.z)<POWERUP_RANGE){ collectPowerup(pu); removePowerup(i); }
  }
  if(now>mNextPowerAt && powerups.length<POWERUP_MAX){ mNextPowerAt=now+POWERUP_GAP; spawnPowerup(); }
}
/* อัปเดตค่าตัวเลขบน HUD (ระยะเป้า/จำนวนเป้า/ความร้อนปืน/ล็อกเป้า) + เรดาร์ + สถานะโอเวอร์ฮีต/พลังงานต่ำ — เรียกถี่จาก tickMecha (throttle) */
function updateMechaHud(dt,now){
  mHeat=Math.max(0,mHeat-dt*30);                              // ปืนเย็นลงเรื่อยๆ
  if(mOverheat && mHeat<=35) mOverheat=false;                 // เย็นพอแล้ว ปลดล็อกปืน
  if(!mhUI||!mhUI.root) return;
  if(now-mHudAt<110) return; mHudAt=now;                      // ~9fps พอ ประหยัดแรง
  const root=mhUI.root;
  mhUI.tgt.textContent=aliens.length;
  mhUI.heat.style.width=Math.round(mHeat)+'%';
  root.classList.toggle('overheat',mOverheat);
  if(mhUI.heatlbl) mhUI.heatlbl.textContent=mOverheat?'OVERHEAT':'HEAT';
  const low=hp<=maxHp*0.3; if(low!==mLowHp){ mLowHp=low; root.classList.toggle('lowhp',low); }
  root.classList.toggle('shielded', now<mShieldUntil);      // 🛡️ โล่พลังงาน
  const boss=aliens.find(a=>a.boss);                        // 👾 แถบพลังบอส (เหลือกี่ตัวอักษร)
  root.classList.toggle('bosson',!!boss);
  if(boss && mhUI.bossFill){ const len=boss.word.en.length; mhUI.bossFill.style.width=Math.round((len-boss.nextIdx)/len*100)+'%'; }
  if(boss && mhUI.bossTtl && boss.species) mhUI.bossTtl.textContent=`${boss.species.emoji} ${boss.species.name}`;   // 👾 รอบ 229: ชื่อสายพันธุ์บอส
  // 🔫 รอบ 228: ปุ่มยิงเปลี่ยนสีตามสถานะ (โอเวอร์ฮีต > โล่ > คอมโบ > ร้อน)
  if(mhUI.fireBtns){
    const fs = mOverheat?'fs-over' : (now<mShieldUntil?'fs-shield' : (mCombo>=COMBO_X2?'fs-combo' : (mHeat>60?'fs-hot':'')));
    mhUI.fireBtns.forEach(b=>{ if(!b) return; b.classList.remove('fs-hot','fs-over','fs-combo','fs-shield'); if(fs) b.classList.add(fs); });
  }
  // ระยะถึงเอเลี่ยนที่กำลังเล็ง (ถ้ามี) + ป้ายล็อกเป้า
  if(mFocusAlien&&mFocusAlien.grp){
    mhUI.rng.textContent=Math.round(camera.position.distanceTo(mFocusAlien.grp.position));
    root.classList.add('locked');
  }else{ mhUI.rng.textContent='--'; root.classList.remove('locked'); }
  // เรดาร์: วางจุดบลิปตามทิศ/ระยะเอเลี่ยน (β=0 ตรงหน้า=บนสุด · +ขวา · ระยะไกล=ขอบวง)
  if(mhUI.blips){
    const Fx=-Math.sin(yaw), Fz=-Math.cos(yaw); let bi=0;
    for(let k=0;k<aliens.length&&bi<mhUI.blips.length;k++){
      const a=aliens[k], dx=a.grp.position.x-camera.position.x, dz=a.grp.position.z-camera.position.z;
      const dist=Math.hypot(dx,dz), r=Math.max(9,Math.min(64,dist/80*64));
      const beta=Math.atan2(Fx*dz-Fz*dx, Fx*dx+Fz*dz);      // มุมสัมพัทธ์จากทิศหันหน้า (บวก=ขวา)
      const b=mhUI.blips[bi++]; b.style.display='block';
      b.style.left=(75+Math.sin(beta)*r)+'px'; b.style.top=(75-Math.cos(beta)*r)+'px';
      b.classList.toggle('boss',!!a.boss); b.classList.toggle('tgt',a===mFocusAlien);
    }
    for(;bi<mhUI.blips.length;bi++) mhUI.blips[bi].style.display='none';
  }
}
function mechaTracer(wx,wy,wz,hit){
  const dir=new THREE.Vector3(); camera.getWorldDirection(dir);
  const from=camera.position.clone().addScaledVector(dir,1.4); from.y-=.5;
  const to = hit ? new THREE.Vector3(wx,wy,wz)
    : camera.position.clone().addScaledVector(dir,60);
  const geo=new THREE.BufferGeometry().setFromPoints([from,to]);
  const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:mechaWeapon.color,transparent:true}));
  scene.add(line); mechaTracers.push({line,until:performance.now()+80});
}
function mechaFire(now){
  if(mOverheat){ if(now-mLastFire>140){ mLastFire=now; sfx.wrong(); } return; }   // 🔥 รอบ 225: ปืนโอเวอร์ฮีต — ยิงไม่ออก (คลิกได้เสียงปฏิเสธ) ต้องรอให้เย็น
  mLastFire=now;
  mShotsFired++;                                     // 📊 รอบ 228: นับนัดยิง (คำนวณความแม่น)
  mHeat=Math.min(100,mHeat+13);                     // 🤖 รอบ 224: ยิงแล้วปืนร้อนขึ้น (โชว์บนแถบ HEAT)
  if(mHeat>=100){ mOverheat=true; MechaAudio.warn(); }   // 🔥 รอบ 225: ร้อนเต็ม → ล็อกปืนจนเย็นพอ (ปลดใน updateMechaHud)
  MechaAudio.fire(mechaWeapon.color);
  camera.updateMatrixWorld(); camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  let best=null, bestD=0.1;
  aliens.forEach(a=>a.letters.forEach(l=>{
    if(l.done) return;
    const gs=a.gs||1, wx=a.grp.position.x+l.off.x*gs, wy=a.grp.position.y+l.off.y*gs, wz=a.grp.position.z+l.off.z*gs;
    const v=new THREE.Vector3(wx,wy,wz).project(camera);
    if(v.z>1) return;
    const dd=Math.hypot(v.x,v.y);
    if(dd<bestD){ bestD=dd; best={a,l,wx,wy,wz}; }
  }));
  if(best){
    mShotsHit++;                                      // 📊 รอบ 228: ยิงโดนตัวอักษร (นับความแม่น)
    mechaTracer(best.wx,best.wy,best.wz,true);
    if(best.l.idx===best.a.nextIdx){                 // ✅ ยิงถูกลำดับ → ตัวอักษรหาย
      best.l.done=true; best.l.spr.visible=false; best.a.nextIdx++;
      mCombo++; if(mCombo>mComboMax) mComboMax=mCombo;  // 🔥 รอบ 227: คอมโบ (×2 ที่ 3 · ×3 ที่ 6) · 📊 เก็บคอมโบสูงสุด
      const mult=mCombo>=COMBO_X3?3:(mCombo>=COMBO_X2?2:1), gain=MECHA_LETTER_COIN*mult;
      addCoins(gain); sessionCoins+=gain;
      if(mult>1) mechaComboPop(mult);
      sfx.coin(); speakLetter(best.l.ch); renderHudTop();
      if(mFocusAlien===best.a) mechaHudWord(best.a);
      if(best.a.nextIdx>=best.a.word.en.length) explodeAlien(best.a);
    }else{                                           // ❌ ผิดลำดับ → แฟลชแดง ตัวอักษรไม่หาย + คอมโบขาด
      mCombo=0;
      const l=best.l; if(l.spr.material){ l.spr.material.color.setHex(0xff3030);
        setTimeout(()=>{ if(l.spr&&l.spr.material) l.spr.material.color.setHex(0xffffff); },220); }
      sfx.wrong();
    }
  }else mechaTracer(0,0,0,false);
}
function explodeAlien(a){
  MechaAudio.boom();
  let col=0x88ff88; try{ col=a.grp.children[0].material.color.getHex(); }catch(e){}
  for(let i=0;i<20;i++){
    const pc=new THREE.Mesh(new THREE.SphereGeometry(.42,6,5),new THREE.MeshBasicMaterial({color:i%2?0xffaa33:col,transparent:true}));
    pc.position.copy(a.grp.position); scene.add(pc);
    const dir=new THREE.Vector3(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1).normalize();
    mechaTracers.push({line:pc,until:performance.now()+650,vel:dir.multiplyScalar(7+Math.random()*9),particle:true});
  }
  const reward=M.reward+(a.boss?BOSS_BONUS:0);       // 👾 บอส = โบนัสเหรียญเพิ่ม
  addCoins(reward); sessionCoins+=reward; sessionWords++;
  if(a.boss){ mBossKills++; state.mechaBoss=(state.mechaBoss||0)+1;   // 📊 รอบ 228: นับล้มบอส (เซสชัน + สะสมถาวร → กระดานออนไลน์)
    if(typeof onlinePushScore==='function') onlinePushScore();
    checkMechaBossBadge(); }                                          // 🤖 รอบ 229: เช็ก/มอบเข็มนักล่าบอส
  if(!sessionWordLog.some(x=>x.en===a.word.en)) sessionWordLog.push({en:a.word.en,th:a.word.th});
  if(typeof vbRecord==='function') vbRecord(a.word.en,a.word.th,true);   // 📒 รอบ 291: ลงสมุดคำศัพท์ถาวร
  doneList().push(a.word.en); questEvent('word3d'); sfx.levelup();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(a.boss?[90,60,120]:80);
  showBanner(`${a.boss?'👾💥':'💥'} <b>${escapeHTML(a.word.en.toUpperCase())}</b> = ${escapeHTML(a.word.th)}<br><span class="adv-ban-coin">+${reward} 🪙</span>`);
  setTimeout(()=>speakWord(a.word.en),500);
  const wasFocus=(mFocusAlien===a);
  removeAlien(a);
  if(wasFocus){ mFocusAlien=null; mechaHudWord(null); }
  mWaveKilled++;                                    // 🌊 รอบ 229: นับความคืบหน้าเวฟ
  if(mWaveKilled>=mWaveGoal) waveComplete();        // เคลียร์เวฟครบ → โบนัส + เวฟถัดไป
  else waveSpawnFill();                             // ยังไม่ครบ → เติมตัวใหม่คงจำนวนบนสนาม
  updateWaveHud();
  saveState(); renderHudTop(); renderBoard();
  if(myRef) sendPos(true);
}
function tickMecha(dt,now){
  // เดินหน้า-ถอย (โมเมนตัมหนักแบบหุ่น) + ◀▶ ขยับข้าง (สเตรฟ · รอบ 222 ผู้ใช้: ไม่ใช่หมุนตัว) · หมุน/เล็ง = ลากจอ
  let fwd=mFwdBtn; if(keys.KeyW||keys.ArrowUp)fwd+=1; if(keys.KeyS||keys.ArrowDown)fwd-=1;
  let str=mStrafeBtn; if(keys.KeyD||keys.ArrowRight)str+=1; if(keys.KeyA||keys.ArrowLeft)str-=1;
  fwd=Math.max(-1,Math.min(1,fwd)); str=Math.max(-1,Math.min(1,str));
  if(fwd) mSpeed+=MECHA_ACCEL*fwd*dt; else mSpeed-=Math.sign(mSpeed)*Math.min(Math.abs(mSpeed),MECHA_DECEL*dt);
  mSpeed=Math.max(-MECHA_VMAX*.6,Math.min(MECHA_VMAX,mSpeed));
  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  const strSpd=str*MECHA_VMAX*0.78;                                  // ขยับข้างตั้งฉากทิศหันหน้า (▶=ขวา · ตรง ไม่สะสมโมเมนตัม)
  let nx=camera.position.x - sin*mSpeed*dt + cos*strSpd*dt;
  let nz=camera.position.z - cos*mSpeed*dt - sin*strSpd*dt;
  camera.position.x=Math.max(-HALF+2,Math.min(HALF-2,nx));
  camera.position.z=Math.max(-HALF+2,Math.min(HALF-2,nz));
  // เดินย่ำ: bob หนัก + เสียงหุ่นทุกก้าว (นับทั้งเดินหน้า-ถอย และสเตรฟ)
  if(Math.abs(mSpeed)>0.5 || str!==0){
    mBobPhase+=Math.abs(mSpeed)*dt*0.9;
    camera.position.y=MECHA_EYE+Math.abs(Math.sin(mBobPhase))*0.35;
    const down=Math.sin(mBobPhase)<0;
    if(down && !mStepDn){ mStepDn=true; MechaAudio.step(); if(state.haptic!==false&&navigator.vibrate)navigator.vibrate(16); }
    if(!down) mStepDn=false;
  }else camera.position.y+=(MECHA_EYE-camera.position.y)*Math.min(1,dt*4);
  camera.rotation.set(0,0,0); camera.rotateY(yaw); camera.rotateX(pitch);
  camera.updateMatrixWorld(); camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  // ยิง (กดค้าง = ยิงรัวตามจังหวะอาวุธ)
  if((mFireHeld||keys.Space) && now-mLastFire>mechaWeapon.gap) mechaFire(now);
  // เอเลี่ยนเคลื่อนที่ + ไฮไลต์ตัวถัดไปที่ต้องยิง
  aliens.forEach(a=>{
    if(now>a.wanderAt){ a.tgt={x:(Math.random()*2-1)*(HALF-12),z:(Math.random()*2-1)*(HALF-12)}; a.wanderAt=now+2600+Math.random()*3200; }
    const g=a.grp.position, dx=a.tgt.x-g.x, dz=a.tgt.z-g.z, d=Math.hypot(dx,dz)||1;
    g.x+=dx/d*ALIEN_SPEED*dt; g.z+=dz/d*ALIEN_SPEED*dt; g.y=4.5+Math.sin(now/500+g.x)*.4;
    // 🚨 รอบ 225-226: เข้าประชิด→ทุบ (iframe 900ms · คูลดาวน์ 2.2s) · ระยะกลาง→ยิงกระสุน (หลบได้)
    if(running){ const dc=Math.hypot(g.x-camera.position.x,g.z-camera.position.z);
      if(dc<MECHA_ATK_RANGE && now>mHitAt && now>(a.atkAt||0)){ a.atkAt=now+2200; mHitAt=now+900; mechaHitByAlien(a); }
      else if(dc>=MECHA_ATK_RANGE && dc<75 && now>(a.shotAt||0)){ a.shotAt=now+ALIEN_SHOT_GAP+Math.random()*1600; spawnAlienShot(a); } }
    a.letters.forEach(l=>{ if(!l.done && l.spr.material){ const nx2=(l.idx===a.nextIdx);
      l.spr.scale.setScalar(nx2?2.5:1.9); l.spr.material.opacity=nx2?1:.8; } });
  });
  // โฟกัสเอเลี่ยนที่เล็งอยู่ → อัปเดต HUD คำ
  let fa=null, fd=0.55;
  aliens.forEach(a=>{ const l=a.letters[a.nextIdx]; if(!l||l.done) return;
    const gs=a.gs||1, wx=a.grp.position.x+l.off.x*gs, wy=a.grp.position.y+l.off.y*gs, wz=a.grp.position.z+l.off.z*gs;
    const v=new THREE.Vector3(wx,wy,wz).project(camera); if(v.z>1) return;
    const dd=Math.hypot(v.x,v.y); if(dd<fd){ fd=dd; fa=a; } });
  if(fa!==mFocusAlien){ mFocusAlien=fa; mechaHudWord(fa); }
  tickAlienShots(dt,now);                            // 👾 รอบ 226: กระสุนเอเลี่ยน (โดน→เสียหาย+กะพริบแดง)
  tickPowerups(dt,now);                              // ❄️❤️ รอบ 226: ของเก็บ (ลดร้อน/ฟื้นพลัง) + ตัวจับเวลาสปอว์น
  updateMechaHud(dt,now);                            // 🤖 รอบ 224: อัปเดตค่าตัวเลข HUD (ทิศ/ระยะ/เป้า/เหรียญ/ความร้อน)
  // tracer + particle ระเบิด
  for(let i=mechaTracers.length-1;i>=0;i--){
    const tr=mechaTracers[i];
    if(tr.particle){ tr.line.position.addScaledVector(tr.vel,dt); tr.vel.y-=14*dt;
      if(tr.line.material) tr.line.material.opacity=Math.max(0,(tr.until-now)/650); }
    if(now>tr.until){ scene.remove(tr.line); if(tr.line.geometry)tr.line.geometry.dispose(); if(tr.line.material)tr.line.material.dispose(); mechaTracers.splice(i,1); }
  }
}

function loop(){
  if(!running) return;
  rafId=requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.1), now=performance.now();
  if(M.heli){ if(hPhase==='pilot') tickHeli(dt,now); else tickHeliFoot(dt,now); }   // 🚶 รอบ 354: เฟสเดินเท้า/นั่ง/วิงสูท
  else if(M.drone){ tickDrone(dt,now); }
  else if(M.drive){ tickDrive(dt,now); }
  else if(M.soccer){ tickSoccer(dt,now); }
  else if(M.mecha){ tickMecha(dt,now); }
  else{
    tickPlayer(dt,now);
    if(M.ghost){ tickGhosts(dt,now); }
    else{
      tickMonsters(dt,now);
      tickShots(dt);
      if(now-lastSpawn>M.monSpawnMs){ lastSpawn=now; spawnMonster(); }
    }
  }
  if(now-lastEnsure>5000 && !M.soccer){ lastEnsure=now; relocateLetters(now); ensureCoverage(); }
  tickPeers(dt,now);
  sendPos(false);
  drawMinimap();
  renderer.render(scene,camera);
  if(M.heli&&hPhase==='pilot') drawBellyCam();   // 📹 กล้องใต้ท้อง — เฉพาะตอนขับเอง (เฟสเดิน/นั่ง/วิงสูทไม่มี)
  if(shotWanted) grabShot();                       // 📸 ต้องอ่าน canvas ทันทีหลัง render (บัฟเฟอร์ไม่ถูกเก็บไว้)
}
/* 📸 เก็บภาพเฟรมที่เพิ่งเรนเดอร์ → เด้งการ์ดพรีวิว (บันทึกลงเครื่องได้) */
function grabShot(){
  shotWanted=false;
  let url='';
  try{ url=renderer.domElement.toDataURL('image/jpeg',.88); }catch(e){ toast('📸 บันทึกภาพไม่ได้'); return; }
  if(photoImgEl) photoImgEl.src=url;
  if(photoEl) photoEl.classList.add('on');
  if(flashEl){ flashEl.classList.remove('on'); void flashEl.offsetWidth; flashEl.classList.add('on');
               setTimeout(()=>flashEl&&flashEl.classList.remove('on'),260); }
  sfx.coin();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(15);
}
function savePhoto(){
  if(!photoImgEl||!photoImgEl.src) return;
  const a=document.createElement('a');
  a.href=photoImgEl.src;
  a.download='vocabworld-drone-'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+'.jpg';
  document.body.appendChild(a); a.click(); a.remove();
  toast('📥 บันทึกภาพลงเครื่องแล้ว');
}

/* ============================================================
   เข้า/ออกโลก
   ============================================================ */
function clearEntities(){
  ghostGen++;                                      // ออก/เปลี่ยนด่าน → ยกเลิก spawn ผีที่ยังรอภาพโหลดค้างอยู่
  while(letters.length) removeLetter(0);
  monsters.forEach(m=>{ scene.remove(m.spr); m.spr.material.dispose(); }); monsters=[];
  shots.forEach(s=>{ scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); }); shots=[];
  aliens.forEach(a=>scene.remove(a.grp)); aliens=[];                          // 🤖 เอเลี่ยน
  mechaTracers.forEach(t=>{ scene.remove(t.line); }); mechaTracers=[];
  while(alienShots.length) removeAlienShot(0);                                // 👾 รอบ 226: กระสุนเอเลี่ยน
  while(powerups.length) removePowerup(0);                                    // ❄️❤️ ของเก็บ
}
/* ============================================================
   ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
   เดิมมือถือไม่มีบอกวิธีบังคับเลย (#adv-hint ซ่อนบนจอสัมผัส) → เด็กงงคอนโทรล
   ============================================================ */
const INTRO_KEY='pvadv_intro_v1';
function introSeenObj(){ try{ return JSON.parse(localStorage.getItem(INTRO_KEY))||{}; }catch(e){ return {}; } }
function introSeen(md){ return !!introSeenObj()[md]; }
function markIntroSeen(md){ const o=introSeenObj(); o[md]=1; try{ localStorage.setItem(INTRO_KEY,JSON.stringify(o)); }catch(e){} }
const INTRO={
  adv:{
    goal:'เดินเก็บ <b>ตัวอักษร</b> ที่ลอยอยู่ มาต่อเป็นคำที่โชว์กลางจอด้านบน · เจอมอนสเตอร์ 👾 <b>ยิงสู้ได้</b>!',
    touch:[['🕹️','ลากนิ้วครึ่งจอ <b>ซ้าย</b> = เดินไปทุกทิศ'],
           ['👀','ลากนิ้วครึ่งจอ <b>ขวา</b> = หันกล้องมองรอบ'],
           ['🔥','แตะปุ่มไฟมุมขวาล่าง = ยิงมอนสเตอร์']],
    keys:[['🖱️','คลิกจอ 1 ครั้ง = ล็อกเมาส์ แล้วขยับเมาส์เพื่อมอง'],
          ['⌨️','<b>WASD</b> หรือลูกศร = เดิน'],
          ['🔥','คลิกเมาส์ = ยิง · <b>Esc</b> = ปลดล็อกเมาส์']],
  },
  haunt:{
    goal:'เก็บตัวอักษรต่อคำเหมือนโลกอื่น แต่ <b>สู้ผีไม่ได้</b>! ผีเข้าใกล้เมื่อไร <b>ต้องวิ่งหนี</b> — โดนจับ = ผีหลอกเต็มจอ แล้วฟื้นเล่นต่อได้เลย (ไม่มีจบเกม)',
    touch:[['🕹️','ลากนิ้วครึ่งจอ <b>ซ้าย</b> = วิ่ง'],
           ['👀','ลากนิ้วครึ่งจอ <b>ขวา</b> = หันมองรอบ'],
           ['🏃','เห็นผีใกล้ = รีบวิ่งหนีไปทางตรงข้าม!']],
    keys:[['🖱️','คลิกจอ 1 ครั้ง = ล็อกเมาส์'],
          ['⌨️','<b>WASD</b> หรือลูกศร = วิ่งหนี'],
          ['🏃','สู้ไม่ได้! เจอผีใกล้ให้วิ่งหนีอย่างเดียว']],
  },
  heli:{
    goal:'ตัวอักษรอยู่ <b>บนยอดตึก</b> — บินไป <b>ลงจอดเบาๆ บนดาดฟ้า</b> เพื่อเก็บ · บินเฉียดตึกแบบไม่ชน = ได้เหรียญโบนัส 💨',
    touch:[['🕹️','จอย <b>ซ้าย</b> = เอียงบินหน้า-หลัง + สไลด์ซ้าย-ขวา'],
           ['↕️','ลากครึ่งจอ<b>ขวา ขึ้น-ลง</b> = ไต่ขึ้น / ลดระดับ'],
           ['🔄','ลากครึ่งจอ<b>ขวา ซ้าย-ขวา</b> = หันหัวเฮลิฯ']],
    keys:[['⌨️','<b>W/S</b> เอียงหน้า-หลัง · <b>A/D</b> สไลด์ข้าง'],
          ['↕️','<b>Space</b> = ขึ้น · <b>Shift</b> = ลง'],
          ['🔄','<b>Q/E</b> = หันหัว · จอดเบาๆ บนดาดฟ้าเพื่อเก็บ']],
  },
  drone:{
    goal:'บินเร็วสุดๆ ลอด <b>หน้าต่างตึกร้าง</b> เข้าไปในห้อง · <b>บินเฉียดตัวอักษรเก็บได้เลย ไม่ต้องจอด!</b> · เฉียดกำแพงไม่ชน = โบนัส 💨',
    touch:[['🕹️','จอย <b>ซ้าย</b> = พุ่งหน้า-ถอย + สไลด์ข้าง'],
           ['↕️','ลากครึ่งจอ<b>ขวา ขึ้น-ลง</b> = ไต่ / ดิ่ง'],
           ['🔄','ลากครึ่งจอ<b>ขวา ซ้าย-ขวา</b> = หันหัวโดรน']],
    keys:[['⌨️','<b>W/S</b> หน้า-ถอย · <b>A/D</b> เอียงข้าง'],
          ['↕️','<b>Space</b> = ขึ้น · <b>Shift</b> = ดิ่ง'],
          ['🔄','<b>Q/E</b> = หันหัว · บินเฉียดตัวอักษรเก็บเลย']],
  },
  drive:{
    goal:'ขับรถบน<b>ถนนจริงของเมืองกำแพงเพชร</b> (แผนที่จริงทั้งเมือง!) เริ่มที่หอนาฬิกาวงเวียนต้นโพธิ์ · <b>ขับชนตัวอักษร</b>บนถนนเพื่อเก็บ · ออกนอกถนนรถช้าลง ระวังชนตึก!',
    touch:[['🎛️','แถบ<b>พวงมาลัย</b>ล่างซ้าย = เลี้ยว · ปุ่มเขียว <b>▲ เร่ง</b> กดค้าง · ปุ่มแดง <b>■ เบรค</b> กดค้าง'],
           ['⚙️','ปุ่ม <b>D/R</b> เหนือคันเร่ง = สลับเกียร์เดินหน้า/ถอยหลัง (R แล้วปุ่มเร่งกลายเป็นถอย)'],
           ['📯','แตะปุ่มฟ้า มุมขวาล่าง = บีบแตร · ก้านขวา = ไฟเลี้ยว']],
    keys:[['⌨️','<b>W</b> = คันเร่ง · <b>S</b> = เบรก/ถอยหลัง'],
          ['🔄','<b>A/D</b> = หมุนพวงมาลัยซ้าย-ขวา'],
          ['📯','<b>H</b> = บีบแตร · เมาส์ = ชะโงกมองข้างทาง']],
  },
  soccer:{
    goal:'<b>เตะบอล</b>ใส่ป้ายตัวอักษร <b>สีทองวิบวับ</b> (ตัวที่ประกอบคำได้) = <b>ได้เหรียญ 🪙</b> · ป้ายจะ<b>หงายหลังแล้วเด้งกลับ</b>ให้เตะได้เรื่อยๆ · ครบคำ +20🪙 · เพื่อนมาร่วมเตะในสนามเดียวกันได้!',
    touch:[['🎯','ปุ่มลูกศร<b>ซ้าย</b> = เล็งขึ้น-ลง-ซ้าย-ขวา'],
           ['⚽','ปุ่ม <b>เตะ</b> ล่างขวา — กด<b>ค้าง</b>เพื่อเพิ่มพลัง (แถบพลังขวาจอ) แล้วปล่อย = เตะ'],
           ['🎥','ปุ่ม 👁️ มุมขวาบน = สลับมุมมองบุคคลที่ 1 / ที่ 3']],
    keys:[['🎯','<b>A/D</b> เล็งซ้าย-ขวา · <b>W/S</b> เงย-ก้ม'],
          ['⚽','<b>เว้นวรรค</b> กดค้าง = ชาร์จพลัง ปล่อย = เตะ'],
          ['🎥','<b>V</b> = สลับมุมกล้อง 1st / 3rd person']],
  },
  mecha:{
    goal:'อยู่ในหุ่นยนต์ยักษ์สูง 5 เมตร — เดินบุกยิง<b>เอเลี่ยนตัวอักษร</b> · ตัวอักษรลอยข้างเอเลี่ยนเป็นคำ · <b>ยิงเรียงตามลำดับในคำ</b> (ตัวที่ต้องยิงจะเรืองแสง) ครบคำ = ระเบิด! · เอเลี่ยนเคลื่อนที่ตลอด',
    touch:[['🕹️','ปุ่มใส <b>▲▼</b> ซ้ายล่าง = เดินหน้า-ถอย · <b>◀▶</b> = หันตัว'],
           ['🔫','ปุ่ม <b>ยิง</b> ขวาล่าง (กดค้าง = ยิงรัว) · เล็งให้ตรงตัวอักษรตัวที่เรืองแสง'],
           ['👀','ลากครึ่งจอ<b>ขวา</b> = หันเล็ง']],
    keys:[['⌨️','<b>W/S</b> เดินหน้า-ถอย · <b>A/D</b> หันตัว'],
          ['🔫','<b>คลิก</b> หรือ <b>เว้นวรรค</b> = ยิง (เรียงลำดับตัวอักษร!)'],
          ['👀','<b>เมาส์</b> (คลิกจอล็อก) = หันเล็ง']],
  },
};
function showIntro(md,reopen){
  if(!introEl) return;
  running=false;                                   // พักเกมระหว่างอ่าน (loop จะหยุดเฟรมถัดไป)
  const m=MODES[md]||MODES.adv, info=INTRO[md]||INTRO.adv;
  const rows=IS_TOUCH?info.touch:info.keys;
  introEl.innerHTML=`
    <div class="adv-intro-card">
      <div class="adv-intro-emoji">${m.emoji}</div>
      <h2>วิธีเล่น${m.label}</h2>
      <div class="adv-intro-body">
        <div class="adv-intro-side">
          <p class="adv-intro-goal">🎯 ${info.goal}</p>
          <p class="adv-intro-tip">💡 ต่อครบ 1 คำ = <b>+${m.reward}🪙</b> · กดปุ่ม 🚪 มุมขวาบนออกได้ทุกเมื่อ</p>
        </div>
        <div class="adv-intro-side">
          <div class="adv-intro-ctrl-h">${IS_TOUCH?'📱 การบังคับ (แตะจอ)':'⌨️ การบังคับ (คีย์บอร์ด + เมาส์)'}</div>
          <ul class="adv-intro-list">
            ${rows.map(r=>`<li><span class="ic">${r[0]}</span><span>${r[1]}</span></li>`).join('')}
          </ul>
        </div>
      </div>
      <button id="adv-intro-go">${reopen?'เล่นต่อ ▶':'เริ่มเล่นเลย! 🚀'}</button>`+`</div>`;
  introEl.classList.add('on');
  introEl.querySelector('#adv-intro-go').addEventListener('click',()=>closeIntro(md));
}
function closeIntro(md){
  markIntroSeen(md);
  introEl.classList.remove('on');
  beginPlay();
  showBanner(M.intro);
}
function beginPlay(){ clock.getDelta(); running=true; loop(); }   // เริ่ม/เล่นต่อ — ทิ้ง dt ที่ค้างช่วงพัก

function start(md,opt){
  mode=(md==='haunt'||md==='heli'||md==='drone'||md==='drive'||md==='soccer'||md==='mecha')?md:'adv';
  M=MODES[mode];
  if(mode==='adv' && !state.advTicket){ toast('🎫 ต้องมีตั๋วโลกผจญภัยก่อนนะ'); return; }
  if(mode==='haunt' && !state.hauntTicket){ toast('🎃 ต้องมีตั๋วโลกผีสิงก่อนนะ'); return; }
  // 🗺️ รอบ 356: เข้าเมืองเฮลิฯ แบบ "เดินเท้า" ผ่านแผนที่โลกผจญภัยได้โดยไม่ต้องมีตั๋วเฮลิฯ
  //    (เดิน/นั่งโดยสาร/วิงสูทฟรี — ขับเองค่อยเช็กตั๋วที่ beginPilot)
  if(mode==='heli' && !state.heliTicket && !(opt&&opt.walkIn)){ toast('🚁 ต้องมีตั๋วโลกเฮลิคอปเตอร์ก่อนนะ'); return; }
  if(mode==='drone' && !state.droneTicket){ toast('🛸 ต้องมีตั๋วโลกโดรน FPV ก่อนนะ'); return; }
  if(mode==='drive' && !state.driveTicket){ toast('🚗 ต้องมีตั๋วโลกขับรถกำแพงเพชรก่อนนะ'); return; }
  if(mode==='soccer' && !state.soccerTicket){ toast('⚽ ต้องมีตั๋วโลกสนามฟุตบอลก่อนนะ'); return; }
  if(mode==='mecha' && !(state.robots&&state.robots.length)){ toast('🤖 ต้องมีหุ่นยนต์อย่างน้อย 1 ตัวก่อนนะ'); return; }
  if(mode==='drive' && !window.KPP_CITY){ toast('🗺️ แผนที่เมืองยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ'); return; }
  /* รอบ 255: เลิกระบบบาดเจ็บล็อกเข้าโลก (advHurt) — โลก 3D ไม่มีตาย/เกมโอเวอร์แล้ว เข้าได้เสมอ */
  if(typeof Music!=='undefined') Music.suspendBg();   // 🎵 รอบ 181: พักเพลงพื้นหลัง (โลก 3D มี soundscape เอง)

  if(!built){
    buildDom();
    renderer=new THREE.WebGLRenderer({canvas:canvasEl,antialias:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    camera=new THREE.PerspectiveCamera(72,window.innerWidth/window.innerHeight,.1,220);
    clock=new THREE.Clock();
    built=true;
  }
  if(scene) clearEntities();                       // ล้างของโหมดก่อนหน้า (ถ้าเคยเข้า)
  if(!worlds[mode]) buildScene(mode);
  scene=worlds[mode].scene; trees=worlds[mode].trees||[]; buildings=worlds[mode].buildings||[];
  if(!worlds[mode]._sky){ worlds[mode]._sky=1; applySky(scene, mode); }   // 🌅 ท้องฟ้าภาพจริง (ครั้งเดียว/โลก · ไม่มีไฟล์=คงสีพื้น)
  solids=worlds[mode].solids||[];

  maxHp=100; hp=100; sessionCoins=0; sessionWords=0; sessionWordLog=[]; inv={}; keys={}; yaw=0; pitch=0;   // maxHp ปรับต่อโลกด้านล่าง
  hauntLives=HAUNT_LIVES; hurtUntil=0;                                 // 👻 รีเซ็ตหัวใจโลกผี
  hauntRunStart=performance.now(); hauntRecordShown=false;             // ⏱ รอบ 256: เริ่มจับเวลาหนีผีรอด
  nmActive=false; nmMin=99; nmCrashed=false; nmCombo=0; nmLastAt=0;    // 💨 รีเซ็ตโบนัสบินเฉียด
  if(M.heli){
    camera.position.set(0,HELI_SKID,0);            // เริ่มบนลานจอดกลางเมือง
    hVel={x:0,y:0,z:0}; hCol=0; hLanded=true; hHitAt=0; hWarnLvl=0;
    hAtcCleared=false; ATC.reset();
    if(hudWarnEl) hudWarnEl.style.display='none';
  }else if(M.drone){
    camera.position.set(0,10,0);                   // เริ่มลอยเหนือลานกลาง (ลานว่าง gx=gz=0) รอบตัวเป็นตึกร้าง
    hVel={x:0,y:0,z:0}; hCol=0; hHitAt=0; hWarnLvl=0; hTiltF=0; hTiltS=0;
    droneBat=100; droneBatWarnAt=0; propBroken=''; propStallUntil=0;   // 🔋🌀 เข้าใหม่ = แบตเต็ม ใบพัดครบ
    droneChargers=worlds.drone.chargers||[]; droneGates=worlds.drone.gates||[];   // ⚡🏁 แท่นชาร์จ + ห่วงแข่ง
    // 🪟🚪⛈ คืนสภาพกระจก/ประตูทุกครั้งที่เข้าใหม่ (ฉากถูก cache ไว้ใช้ซ้ำ)
    droneGlass=worlds.drone.glass||[]; droneDoors=worlds.drone.doors||[];
    droneWinMat=worlds.drone.winMat||null; droneGlassMat=worlds.drone.glassMat||null;
    droneGlass.forEach(g=>{ g.done=false; if(droneGlassMat) g.m.material=droneGlassMat; });
    droneDoors.forEach(dr=>{ dr.open=false; dr.ang=0; dr.pivot.rotation.y=dr.base; });
    boltAt=performance.now()+BOLT_MIN; boltFlashUntil=0; rainUntil=0; stopRain();
    raceOn=false; raceIdx=0; droneCharging=false; shotWanted=false;
    droneGates.forEach(g=>{ g.m.scale.setScalar(1); g.m.material.color.setHex(g.col); });
    if(photoEl) photoEl.classList.remove('on');
    renderRaceHud();
    if(propsEl){ propsEl.classList.remove('hit','broken-l','broken-r'); }
    if(hudInstEl) hudInstEl.classList.remove('bat-low');
    if(hudWarnEl) hudWarnEl.style.display='none';
  }else if(M.drive){
    const sp=worlds.drive.d.spawn;                 // เกิดบนถนนใหญ่ข้างวงเวียนหอนาฬิกา หันตามแนวถนน
    camera.position.set(sp.x,CAR_EYE,sp.z); yaw=sp.yaw;
    dSpeed=0; dSteer=0; dLook=0; hHitAt=0; carStreet=''; carNameAt=0;
    // 🚗 รอบ 232: ผูกสมรรถนะตามคันที่เลือกขับ (ตรงกับป้ายในโชว์รูม · คันแพง/สปอร์ต = เร็ว·เร่ง·เกาะถนนดีกว่าเบาๆ)
    (function(){ const cp=(typeof myCar==='function'&&myCar())?carInfo(myCar().id):null;
      const sp=(cp&&cp.spd)||3, ac=(cp&&cp.acc)||3, gr=(cp&&cp.grip)||3;
      drivePerf={ vmaxMul:0.82+sp*0.045, accMul:0.82+ac*0.045, steerMul:0.90+gr*0.025 }; })();
    gpsTarget=null; gpsSpokeAt=0; gpsLastTurn=''; gpsMile=0; gpsArrivedFor=null; gpsRoute=null; gpsRouteFor=null;   // 🧭 รีเซ็ต GPS
    dRoll=0; dRollV=0;                             // 🏎️ รอบ 142: ตัวถังเริ่มนิ่งตรง
    bobAng=0; bobVel=0; _bobVW=0;                   // 🪆 รอบ 191: ตุ๊กตาหน้ารถเริ่มนิ่ง + บังคับ relayout
    bobPitch=0; bobPitchV=0; _bobPrevSpd=0; _bobSkin=null;  // 🪆 รอบ 193: รีเซ็ตก้ม-เงย + บังคับใส่สกินใหม่
    dVelX=0; dVelZ=0; dCamYaw=sp.yaw;              // 🏁 R4: ทิศไถล+กล้องหน่วง เริ่มตรงหัวรถ
    padSteer=0; padSt=false; padTh=false;          // 🎛️ รอบ 127: ล้างสถานะปุ่มคอนโซลทุกครั้งที่เข้าโลก
    padBr=false; gearR=false; if(gearSyncFn) gearSyncFn();  // 🦶⚙️ รอบ 139: ล้างเบรค + เกียร์กลับ D ทุกครั้งที่เข้าโลก
    // 🚔 รอบ 128: รีเซ็ตกฎจราจร + เด้งแผงสตาร์ทเครื่อง/คาดเข็มขัดก่อนออกรถ
    carEngineOn=false; carBelted=false; carFines=[]; carOverSpeed=false; carBeltFined=false; carLawSeen=false;
    // 🚦 รอบ 132: รีเซ็ตไฟเลี้ยว + ตัวตรวจทางแยก + ชนรถเพื่อน (netTlOk คืน true เผื่อผู้ใช้เพิ่ง publish rules)
    tlSet(0); tlInJunc=false; tlChkAt=0; tlCoolAt=0; carPeerHitAt=0; netTlOk=true;
    tlJuncWarnUntil=0; if(juncEl) juncEl.style.display='none';   // 🚦 รอบ 182: รีเซ็ตป้ายเตือนแยก
    // 🚦 รอบ 133: รีเซ็ตตัวนับเจตนาชน + ไฟแดง แล้วปักไฟจราจรตามแยกใหญ่ (ครั้งแรกครั้งเดียว)
    carPeerHits=0; rlChkAt=0; rlCoolAt=0; rlForce=null;
    buildTrafficLights();
    loadCarDash();                                 // 🚗 รอบ 211: คอนโซล/หน้าปัดตามคันที่ขับ (dash_<id>.png · fallback dash.png)
    carStartShow();
  }else if(M.soccer){
    // ⚽ รีเซ็ตเล็ง/ชาร์จ/บอล · กล้องเริ่มหลังบอล (kit picker เด้งก่อนเล่น)
    aimYaw=0; aimPitch=.34; sChg=0; sCharging=false; sKickHeld=false; sPrevV=false; sLegSwing=0;
    soccerCam1=false; sPadU=sPadD=sPadL=sPadR=false;
    soccerResetBall();
    camera.position.set(0,4,PLAYER_Z+8); camera.lookAt(0,1.2,0);
  }else if(M.mecha){
    // 🤖 มุมมองในหุ่นสูง 5m · เลือกอาวุธตามหุ่นที่ครอบครอง
    maxHp=MECHA_MAX_HP; hp=maxHp;                       // 🤖 รอบ 236: หุ่นพลังเยอะกว่าโลกอื่น (ทนขึ้น ไม่ตายง่าย)
    mSpeed=0; mBobPhase=0; mStepDn=false; mFwdBtn=0; mStrafeBtn=0; mFireHeld=false; mLastFire=0;
    aliens=[]; mechaTracers=[]; mFocusAlien=null;
    mHeat=0; mOverheat=false; mHitAt=0; mLowHp=false;   // 🤖 รอบ 225: รีเซ็ตความร้อน/โอเวอร์ฮีต/iframe/พลังงานต่ำ
    alienShots=[]; powerups=[]; mNextPowerAt=performance.now()+8000;   // 🤖 รอบ 226: รีเซ็ตกระสุน/ของเก็บ (ชิ้นแรก ~8 วิ)
    mCombo=0; mShieldUntil=0;   // 🔥🛡️ รอบ 227: รีเซ็ตคอมโบ + โล่
    mComboMax=0; mBossKills=0; mShotsFired=0; mShotsHit=0;   // 📊 รอบ 228: รีเซ็ตสถิติรอบ
    mWave=0; mWaveKilled=0; mWaveSpawned=0; mWaveBoss=false; mWaveBossDone=false; mWaveSpd=1; mBossSpeciesIdx=0;   // 🌊 รอบ 229: รีเซ็ต Endless Wave
    const rid=(state.mechaRobot&&MECHA_WEAPONS[state.mechaRobot])?state.mechaRobot:((state.robots&&state.robots[0])||'robot_01');
    mechaWeapon=MECHA_WEAPONS[rid]||MECHA_WEAPONS.robot_01;
    setMechaHudSkin(rid);                          // 🤖 รอบ 224: กรอบ HUD + สีตามหุ่น
    camera.position.set(0,MECHA_EYE,26); yaw=0; pitch=-0.06;
  }else{
    camera.position.set(0,EYE_H,0);
  }
  camera.far=M.drive?800:(M.soccer?400:(M.mecha?320:220)); camera.updateProjectionMatrix();   // เมืองจริง/สนามใหญ่ต้องมองไกล
  if(!Array.isArray(state[M.doneKey])) state[M.doneKey]=[];
  words=pickWords(GUIDE_WORDS);
  if(M.soccer){ soccerBuildTargets(); }             // ⚽ ป้ายเป้าคงที่ (Plane หงายได้) แทนตัวอักษร sprite กระจาย
  else if(M.mecha){ startWave(1); }   // 🌊 รอบ 229: เริ่ม Endless Wave (เดิม spawn ALIEN_COUNT ตายตัว)
  else{
    words.forEach(spawnLettersForWord);
    for(let i=0;i<8;i++) spawnLetter('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]);
  }
  if(M.ghost){
    probeGhostImages();
    const gen=ghostGen;                            // ปล่อยผีเฉพาะตอนภาพโหลดเสร็จ (ยังโหลด=ด่านว่างไว้ก่อน ไม่โผล่ emoji)
    let spawned=false;
    const spawnAll=()=>{ if(spawned||gen!==ghostGen) return; spawned=true; for(let i=0;i<M.ghostMax;i++) spawnGhost(true); };
    whenGhostsReady(spawnAll);
    setTimeout(spawnAll, 9000);                     // กันเหนียว: ภาพค้างเกิน 9 วิ (เน็ตแย่/หาย) → ปล่อยไปก่อน (ด่านต้องมีผีเสมอ)
  }
  else if(!M.heli && !M.drone && !M.drive && !M.soccer && !M.mecha) spawnMonster();
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  scareEl.classList.remove('on');
  overlayEl.classList.toggle('adv-haunt',mode==='haunt');
  overlayEl.classList.toggle('adv-heli',mode==='heli');
  overlayEl.classList.toggle('adv-drone',mode==='drone');
  overlayEl.classList.toggle('adv-drive',mode==='drive');
  overlayEl.classList.toggle('adv-soccer',mode==='soccer');
  overlayEl.classList.toggle('adv-mecha',mode==='mecha');
  if(mode==='heli'){
    // 🚶 รอบ 354: เข้าโลกแล้ว "เริ่มเดินเท้า" — เครื่องยนต์ยังไม่สตาร์ท (beginPilot ค่อยสตาร์ทตอนเดินไปขึ้นเฮลิฯ แดง)
    hPhase='walk';
    termB=worlds.heli.foot.term;
    worlds.heli.foot.pilotH.visible=true;                 // ลำที่จอดโชว์กลับมา (เผื่อรอบก่อนขับอยู่)
    endRide(false);                                       // เฮลิฯ โดยสารกลับที่จอดดาดฟ้า + ตัดเสียงค้าง
    overlayEl.classList.add('hfoot'); setFootBtns(false,false);
    camera.position.set(1.5,FOOT_EYE,9);                  // เกิดริมลานกลาง มองเห็นเฮลิฯ แดง+เมือง
    HeliSound.probe();                                    // โหลดไฟล์เสียงรอไว้ (ใช้ทั้งตอนขับและเสียงห้องโดยสาร)
    hViewSwitched=false;
    setSeat(0);                                           // 🎚️ ตอนสตาร์ทเครื่อง = มุมเต็มลำ (ได้อารมณ์อยู่ในห้องนักบิน)
    setWiper(0); setVisor(false); setHeliLight(false);    // 🌧️🕶️💡 เข้าโลกใหม่ = ที่ปัด/ม่าน/ไฟ ปิดเสมอ
    drops=[]; rainOn=false; rainNextAt=0; bellyRect=null;  // 💧📹 ล้างสภาพอากาศ/กล้องของรอบก่อน
    assistTgt=null; hAirAt=0; _lightHintAt=0;              // 🎯🏆 ล้างระบบช่วยเล็ง/โบนัสลงนุ่มของรอบก่อน
    sLandTot=0; sLandPerf=0; sLandSoft=0;                  // 📊 เริ่มนับสถิติรอบบินใหม่ (สรุปตอนออก)
    mailStop(); mailNextAt=0; mailCount=0;                 // 🛩️📦 ล้างภารกิจไปรษณีย์ของรอบก่อน
    sunUpdate();                                          // 🌅 ตั้งดวงอาทิตย์ตามเวลาจริงตอนเข้าเล่น
    layoutCockpit();                                      // 🎛️ วัดขนาดหลังค็อกพิตโชว์แล้ว เข็มถึงทับตรงจุด
  }
  else if(mode==='drone') DroneSound.start();
  // โหมด drive ไม่สตาร์ทเสียงเครื่องอัตโนมัติแล้ว (รอบ 128) — ผู้เล่นเลื่อนสวิตช์สตาร์ทเองในแผงเตรียมออกรถ
  hintEl.textContent=M.hint;
  hudHuntEl.style.display='none';
  Voice.spk=state.voiceSpk!==false;                        // สะท้อนค่าที่จำไว้แม้ยังออฟไลน์ (join ทับอีกทีตอนต่อเน็ต)
  Voice.vmode=state.voiceMode==='friends'?'friends':'all';
  Voice.mic=false;
  updateVoiceBtns();

  overlayEl.classList.add('on');
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  renderHudTop(); renderHudWords(); renderHudInv(); renderBoard(); renderHearts();
  lastSpawn=performance.now(); lastEnsure=performance.now();
  netJoin();
  if(mode==='haunt') HSound.startAmbient();
  if(mode==='soccer'){
    renderer.render(scene,camera);      // แสดงสนามไว้ข้างหลัง แล้วเด้งแผงเลือกชุดนักเตะก่อนเล่น
    soccerKitShow();                    // กด "เตะเลย!" → soccerKitGo() สร้างหุ่น + เข้าเกม/วิธีเล่น
  }else if(introSeen(mode)){
    beginPlay();
    showBanner(M.intro);
  }else{
    renderer.render(scene,camera);      // แสดงฉากไว้ข้างหลังการ์ด (ยังไม่เดินลูป/พักเกม)
    showIntro(mode,false);              // การ์ดวิธีเล่นครั้งแรก — กด "เริ่มเล่น" แล้วค่อย beginPlay
  }
}

function exitWorld(){
  hauntSurviveFinish();                            // ⏱ ออกโลกผีเอง = นับเวลารอดรอบนี้เข้าสถิติด้วย
  running=false;
  cancelAnimationFrame(rafId);
  closeBigMap();                                   // 🗺️ รอบ 144: ปิดแผนที่ขยาย + หยุด interval วาด
  if(document.pointerLockElement) document.exitPointerLock();
  // 🚔 รอบ 128: หักค่าปรับใบสั่งที่ค้าง + แจ้งสรุป แล้วซ่อนแผงโหมดขับรถ
  if(M && M.drive) driveFineSettle();
  ['adv-carstart','adv-lawinfo','adv-lawwarn'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.style.display='none';
  });
  carStartOpen=false;
  raceOn=false; renderRaceHud();                   // 🏁 ออกกลางแข่ง = ยกเลิกรอบ + ซ่อนป้าย
  rainUntil=0; stopRain();                         // 🌧️ ฝนไม่ค้างข้ามโลก
  if(photoEl) photoEl.classList.remove('on');      // 📸 ปิดการ์ดพรีวิวภาพที่ค้าง
  netLeave();
  HSound.stopAll();
  // 🛬 ออกจากโลกเฮลิฯ = ดับเครื่อง (ใบพัดค่อยๆ ช้าลงจนหยุด) แทนตัดเสียงห้วนๆ
  if(mode==='heli' && state.sound && HeliSound.on) HeliSound.shutdown(); else HeliSound.stop();
  try{ if(paxSnd){ paxSnd.src.stop(); paxSnd=null; } }catch(e){}   // 🚁💺 รอบ 354: ตัดเสียงห้องโดยสารถ้าออกกลางทัวร์
  DroneSound.stop();
  CarSound.stop();
  ATC.reset();
  toggleChatBox(false);
  selfMsgEl.classList.remove('on');
  myChat=null;
  overlayEl.classList.remove('on','adv-hunted','adv-shake');
  if(introEl) introEl.classList.remove('on');
  scareEl.classList.remove('on');
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  if(typeof Music!=='undefined') Music.resumeBg();   // 🎵 รอบ 181: ปิดวิทยุรถ + เล่นเพลงพื้นหลังต่อ
  const rl=document.getElementById('adv-radio-list'); if(rl) rl.style.display='none';
  saveState();
  renderDashboard();
  if(M && M.mecha && (sessionWords>0 || mShotsFired>0))
    toast(`🤖 จบภารกิจหุ่น! ${mechaRecapLine()}`);
  else if(M && M.heli && sLandTot>0)                    // 📊 รอบ 351: สรุปรอบบิน (แพตเทิร์นเดียวกับ mechaRecapLine)
    toast(`🚁 จบรอบบิน! 🛬 ลงจอด ${sLandTot} ครั้ง · 🏆 เพอร์เฟกต์ ${sLandPerf} · 👍 นุ่ม ${sLandSoft}`+
      (mailCount>0?` · 📦 ส่งพัสดุ ${mailCount}`:'')+` · 📖 ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
  else if(sessionWords>0 || sessionCoins>0)
    toast(`${M.emoji} กลับจาก${M.label} — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}
/* 📊 รอบ 228: สรุปสถิติรอบโลกหุ่น (คอมโบสูงสุด · ล้มบอส · ความแม่น · จำนวนคำ) */
function mechaRecapLine(){
  const acc = mShotsFired ? Math.round(mShotsHit/mShotsFired*100) : 0;
  return `🌊 ถึงเวฟ ${mWave||1} · ⭐ คอมโบสูงสุด ×${mComboMax} · 👾 ล้มบอส ${mBossKills} · 🎯 แม่นยำ ${acc}% · 📖 ${sessionWords} คำ`;
}

window.Adventure3D={
  start,
  pickBlockAvatar,                     // 🧱 หน้าต่างเลือกตัวละครบล็อก (ui.js เรียกก่อน start('drive'))
  /* test hooks — ใช้เฉพาะตอนเทสต์ preview */
  _t:{
    get letters(){return letters}, get monsters(){return monsters}, get words(){return words},
    get inv(){return inv}, get peers(){return peers}, get hp(){return hp}, get mode(){return mode},
    get running(){return running}, set running(v){running=v},
    camera:()=>camera, damagePlayer, caught, spawnGhost, tinvCheck, onPeerData, exitWorld, sendChat, Voice, tinvLinked, showPodium, endRound,
    showIntro, introSeen, get introEl(){return introEl}, get wordLog(){return sessionWordLog}, knockedOut,
    give(ch,n){ inv[ch]=(inv[ch]||0)+(n||1); renderHudInv(); renderHudWords(); tryCompleteWords(); },
    get heli(){ return {vel:hVel, landed:hLanded, col:hCol, buildings, floorAt:heliFloorAt,
                        rpm:HeliSound.rpm, soundReady:HeliSound.ready, sound:HeliSound, warn:hWarnLvl,
                        ads:(worlds.heli&&worlds.heli.ads)||[], atc:ATC,
                        // 🌧️☀️🎚️💧🕶️📹 testkit: ที่ปัด / แสงแดด / มุมมอง / ฝน / ม่าน / กล้องใต้ท้อง
                        get wiper(){return wiperMode}, setWiper,
                        get seat(){return seatLevel}, setSeat,
                        get yaw(){return yaw}, setYaw:v=>{yaw=v}, setSun:v=>{sunDir=v},
                        get drops(){return drops.length},
                        // ⚠️ ต้องตั้ง rainUntilAt ด้วย ไม่งั้น rainTick เห็นว่าหมดเวลาแล้วปิดฝนทันที
                        rain:on=>{ rainOn=on; rainUntilAt=on?performance.now()+3e5:0;
                                   rainNextAt=performance.now()+3e5; },
                        clearDrops:()=>{ drops=[]; },
                        get visor(){return visorDown}, setVisor,
                        get bellyRect(){return bellyRect},
                        // บังคับวาดใหม่ 1 เฟรม — ใช้ตอนเทสต์ เพราะแท็บที่ถูก throttle ลูปแทบไม่เดิน
                        redraw:(dt)=>{ dt=dt||.016;
                          tickDrops(dt,Math.hypot(hVel.x,hVel.z));
                          fogUpdate(performance.now());
                          drawBellyCam();                     // เรนเดอร์กล้องใต้ท้อง + ตั้ง bellyRect (ลูปตายก็เทสต์ได้)
                          drawGauges(); drawLandingTargets(); drawDescentBar();
                          drawBellyHud(); drawGlass(dt,performance.now()); },
                        get fog(){return +heliFog.toFixed(2)},
                        get fogFar(){return scene&&scene.fog?+scene.fog.far.toFixed(1):null},
                        set landed(v){hLanded=v}, get vy(){return hVel.y}, set vy(v){hVel.y=v},
                        // 🎯💡🏆 รอบ 350: ช่วยเล็ง/ไฟส่อง/โบนัสลงนุ่ม
                        get assistTgt(){return assistTgt},
                        get light(){return heliLightOn}, setLight:setHeliLight,
                        get lightObj(){return heliLight},
                        set airAt(v){hAirAt=v},
                        softLand:(impact)=>softLandBonus(impact,performance.now()),
                        get night(){return +heliNight.toFixed(2)},
                        get lightLv(){const L=worlds.heli&&worlds.heli.lights;return L?{hemi:+L.hemi.intensity.toFixed(2),sun:+L.sun.intensity.toFixed(2)}:null},
                        get landStats(){return {tot:sLandTot,perf:sLandPerf,soft:sLandSoft}},
                        // ⭐🚨📦 รอบ 353: ของกลางคืน
                        get sky(){const N=worlds.heli&&worlds.heli.night;return N?{stars:N.stars.visible,starOp:+N.stars.material.opacity.toFixed(2),moon:N.moon.visible}:null},
                        get beacons(){const B=worlds.heli&&worlds.heli.beacons;return B?B.map(b=>({vis:b.m.visible,op:+b.m.material.opacity.toFixed(2)})):null},
                        get mail(){return {on:mailOn,count:mailCount,tgt:mailTgt?{x:mailTgt.b.x,z:mailTgt.b.z,h:mailTgt.b.h,w:mailTgt.b.w,d:mailTgt.b.d}:null}},
                        mailGo:mailStart, mailEnd:mailStop,
                        // 🚶🪂 รอบ 354: เฟสเดินเท้า
                        get phase(){return hPhase},
                        get foot(){const F=worlds.heli&&worlds.heli.foot;return F?{term:{x:F.term.x,z:F.term.z,h:F.term.h,w:F.term.w,d:F.term.d},door:F.doorC,lift:F.liftIn,pax:F.paxPos}:null},
                        goPilot:beginPilot, goRide:beginRide, goWing:beginWing,
                        rideEnd:endRide, footTick:(dt)=>tickHeliFoot(dt||.016,performance.now()),
                        get wing(){return {spd:+wSpd.toFixed(1),p:+wP.toFixed(2)}},
                        get rings(){const F=worlds.heli&&worlds.heli.foot;return F?F.rings.map(r=>({x:+r.m.position.x.toFixed(1),y:+r.m.position.y.toFixed(1),z:+r.m.position.z.toFixed(1),got:r.got})):null},
                        get ringCombo(){return ringCombo},
                        // 🚪🌪️🎨 รอบ 357
                        get doors(){const F=worlds.heli&&worlds.heli.foot;return F?{pax:+F.paxH._doorOpen.toFixed(2),pilot:+F.pilotH._doorOpen.toFixed(2)}:null},
                        get dustN(){return dusts.length},
                        get rideSpin(){return +rideSpin.toFixed(2)},
                        get fest(){const F=worlds.heli&&worlds.heli.foot;return F?(F.fest&&F.fest.name)||null:null},
                        festAt:(iso)=>{const f=festivalPaint(new Date(iso));return f?f.name:null},
                        tick:(dt)=>tickHeli(dt||.016,performance.now()),   // รัน tickHeli 1 สเต็ป (assistTgt/ไฟ คำนวณในนี้)
                        sunAt:h=>{
                          const t=Math.max(0,Math.min(1,(h-6)/12));
                          sunDir=(t-.5)*3.2; sunHi=Math.sin(t*Math.PI); sunWarm=1-sunHi;
                          return {sunDir:+sunDir.toFixed(2),sunHi:+sunHi.toFixed(2),sunWarm:+sunWarm.toFixed(2)};
                        }}; },
    get drone(){ return {vel:hVel, col:hCol, buildings, solids, warn:hWarnLvl,
                         rpm:DroneSound.rpm, sound:DroneSound, collide:collideDrone,
                         get bat(){return droneBat}, set bat(v){droneBat=v},        // 🔋 เทสต์แบต
                         get broken(){return propBroken}, breakProp:propBreak,      // 🌀 เทสต์ใบพัดหัก
                         get glass(){return droneGlass}, get doors(){return droneDoors},   // 🪟🚪 เทสต์กระจก/ประตู
                         bolt:()=>lightningBolt(performance.now())}; },             // ⛈ เทสต์ฟ้าแลบ
    get drive(){ return {get speed(){return dSpeed}, get steer(){return dSteer}, get street(){return carStreet},
                         d:worlds.drive&&worlds.drive.d, cell:driveCell, collide:collideCar,
                         sound:CarSound, wheelEl:carWheelEl, dashEl:carDashEl,
                         // 🚦 รอบ 132: testkit ไฟเลี้ยว/ทางแยก/ใบสั่ง
                         get tl(){return tlSig}, setTl:tlSet, arms:driveArms,
                         get fines(){return carFines}, get inJunc(){return tlInJunc},
                         get yaw(){return yaw}, set yaw(v){yaw=v;},
                         // 🚦 รอบ 133: testkit ไฟจราจร/เจตนาชน
                         get lights(){return worlds.drive.d.tlights}, forceLight(v){rlForce=v; rlChkAt=0;},
                         get peerHits(){return carPeerHits}, phase:tlightPhase,
                         get gpsRoute(){return gpsRoute}, get gpsTarget(){return gpsTarget},
                         get perf(){return drivePerf},   // 🚗 รอบ 232: สมรรถนะคันที่ขับ (ผูกจาก stat CARS)
                         route(sx,sz,tx,tz){return routeGrid(worlds.drive.d,sx,sz,tx,tz);}}; },
    get soccer(){ return {get ball(){return soccerBall}, get vel(){return sbVel}, get live(){return sbLive},
                          get aimYaw(){return aimYaw}, set aimYaw(v){aimYaw=v},
                          get aimPitch(){return aimPitch}, set aimPitch(v){aimPitch=v},
                          get charge(){return sChg}, kick:soccerKick, reset:soccerResetBall, kitGo:soccerKitGo,
                          get player(){return soccerPlayer}, get guide(){return soccerGuide},
                          get cam1(){return soccerCam1}, set cam1(v){soccerCam1=v}}; },
    get mecha(){ return {get aliens(){return aliens}, get weapon(){return mechaWeapon}, fire:mechaFire,
                         spawn:makeAlien, get speed(){return mSpeed}, set fwd(v){mFwdBtn=v}, set strafe(v){mStrafeBtn=v},
                         get focus(){return mFocusAlien}, audio:MechaAudio,
                         get heat(){return mHeat}, get overheat(){return mOverheat}, hit:mechaHitByAlien,
                         get shots(){return alienShots}, get powerups(){return powerups},
                         spawnBoss:(sp)=>makeAlien(sp||true), enemyShoot:spawnAlienShot, dropPowerup:spawnPowerup, collect:collectPowerup,
                         get combo(){return mCombo}, get shielded(){return performance.now()<mShieldUntil},
                         species:BOSS_SPECIES, startWave, waveComplete, kill:(a)=>explodeAlien(a||aliens[0]),   // 🌊👾 รอบ 229: Endless Wave + สายพันธุ์บอส (kill=จำลองล้ม)
                         get wave(){return {n:mWave,goal:mWaveGoal,killed:mWaveKilled,conc:mWaveConc,spawned:mWaveSpawned,boss:mWaveBoss,spd:mWaveSpd}},
                         get stats(){return {comboMax:mComboMax,bossKills:mBossKills,fired:mShotsFired,hit:mShotsHit,recap:mechaRecapLine()}}}; },
    set col(v){ hCol=v; },
    set landed(v){ hLanded=v; },
    setKeys(o){ keys=o||{}; },
    setDriveSpeed(v){ dSpeed=v; },   // 🚔 รอบ 128: testkit — inject ความเร็วตรงๆ (เทสต์ใบสั่ง/เกจ ไม่ต้องขับตามถนนจริง)
    step(dt){                        // เดินเกม 1 เฟรมเอง — rAF ไม่ fire ใน preview ที่มองไม่เห็นหน้าต่าง
      const now=performance.now(); dt=dt||.016;
      if(M.heli){ if(hPhase==='pilot') tickHeli(dt,now); else tickHeliFoot(dt,now); }
      else if(M.drone){ tickDrone(dt,now); }
      else if(M.drive){ tickDrive(dt,now); }
      else if(M.soccer){ tickSoccer(dt,now); }
      else if(M.mecha){ tickMecha(dt,now); }
      else{
        tickPlayer(dt,now);
        if(M.ghost) tickGhosts(dt,now); else { tickMonsters(dt,now); tickShots(dt); }
      }
      tickPeers(dt,now); drawMinimap(); renderer.render(scene,camera);
    },
    renderNow(){ camera.updateMatrixWorld(); renderer.render(scene,camera); },   // เทสต์: เรนเดอร์เฟรมเดียวโดยไม่ขยับกล้อง
  },
};
})();
