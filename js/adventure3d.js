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
const LETTER_RESPAWN_MS = 60000; // 🔠⏱️ รอบ 847 (ผู้ใช้สั่ง): เก็บตัวอักษรแล้วหาย → เกิดใหม่ "ที่เดิม" หลังผ่านไปเท่านี้ (เดิมมีระบบสุ่มย้ายที่ทุก 75 วิ — เอาออกแล้ว ตัวอักษรที่ยังไม่ถูกเก็บจะอยู่นิ่งตลอด)
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
    label:'โรงแรมผีสิง', emoji:'🏨', reward:25, doneKey:'hauntDone',
    shoot:false, ghost:true, hotel:true,
    /* หมอกตอน "ไฟยังไม่ดับ" ต้องไกลพอให้เห็นตัวโรงแรมสวย ๆ ตอนเดินเข้า (ข้อ 3)
       — ตอนไฟดับ hotelBlackout() หรี่เหลือ near 1.2 / far 24 = มืดสนิทเห็นแค่ลำไฟฉาย */
    sky:0x05060e, fogN:26, fogF:155, ground:0x1a1c18,
    ghostMax:5, ghostSpeed:1.35, keepR:4.6, scareR:3.0,
    ghostEmoji:['👻','👻','👻','💀','🧟'],
    intro:'🏨 <b>โรงแรมกำมะหยี่ ยินดีต้อนรับ...</b><br><small>เดินเข้าไปเก็บ<b>ตัวอักษรในห้องพัก</b>ทั้ง 5 ชั้น (มีลิฟต์ 🛗 กับบันได 🪜)<br>อีกประมาณ <b>2 นาทีไฟทั้งโรงแรมจะดับ</b> — ตอนนั้นกด <b>F</b> เปิดไฟฉาย 🔦<br>👻 ผีที่นี่<b>ไม่ทำร้ายใคร</b> แค่โผล่มาหลอกให้ตกใจเท่านั้น · กด <b>E</b> เปิดตู้เสื้อผ้า/ใช้ลิฟต์<br>🧑‍🤝‍🧑 <b>เล่นคนเดียวได้เลย ไม่ต้องรอเพื่อน</b> — โรงแรมหลังหนึ่งอยู่ด้วยกันได้ไม่เกิน 2 คน</small>',
    hint:'คลิกจอ=ล็อกเมาส์ · WASD เดิน · F=ไฟฉาย · E=เปิดตู้/กดลิฟต์ · ผีไม่ทำร้าย · Esc ปลดเมาส์แล้วค่อยกดออก',
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
    sky:0xaee0f7, fogN:120, fogF:650, ground:0x9a9a92,   // 🏙️ รอบ 831 (ผู้ใช้สั่ง): เดิมเขียวมะกอก-เหลือง → คอนกรีตเทาในเมือง
    intro:'🚗 <b>ขับรถเที่ยวเมืองกำแพงเพชร!</b><br><small>ถนนจริงทั้งเมืองจากแผนที่จริง — เริ่มที่<b>หอนาฬิกาวงเวียนต้นโพธิ์</b><br>ขับชนตัวอักษรบนถนนเพื่อเก็บ · ออกนอกถนนรถช้าลง · ระวังชนตึก!<br>🚔 <b>ขับเกิน 90 กม./ชม. = โดนใบสั่ง หักเหรียญจริง!</b></small>',
    hint:'W/S คันเร่ง-เบรก/ถอย · A/D เลี้ยวซ้าย-ขวา · H บีบแตร · เกิน 90 กม./ชม. โดนใบสั่ง! · 🚦 ไฟแดงต้องหยุด · เลี้ยวที่แยกเปิดไฟเลี้ยวด้วย',
    koTitle:'🚗💥 รถพังแล้ว!',
  },
  soccer: {
    label:'สนามฟุตบอล', emoji:'⚽', reward:20, doneKey:'soccerDone',
    shoot:false, ghost:false, soccer:true,
    sky:0x8fd0f5, fogN:80, fogF:360, ground:0x3f9d43,
    intro:'⚽ <b>สนามฟุตบอล!</b><br><small>เตะบอลใส่ป้ายตัวอักษร<b>สีทอง</b> (ประกอบคำได้) = ได้เหรียญ 🪙 · ป้ายหงายหลังแล้วเด้งกลับให้เตะอีกได้<br>🕹️ <b>บังคับแบบ PES:</b> สติ๊กมือซ้าย = เล็ง · ปุ่ม ⚽ มือขวากด<b>ค้าง</b> = ชาร์จพลัง ปล่อย = เตะ · ครบคำ +20🪙<br>🎱 <b>เลือกจุดเตะบนลูกบอลได้!</b> กดปุ่ม <b>🎱 จุดสัมผัส</b> เปิดหน้าต่างซูม แล้วลากเลือกจุด — เตะข้างลูก = <b>ลูกโค้ง</b> · เตะใต้ลูก = <b>ลอยโด่ง</b> · เตะบนลูก = <b>พุ่งจิก</b><br>🎯 <b>ยิงแบบกะระยะเอง</b> (ไม่มีเส้นช่วย) — อยากได้เส้นนำทาง กดปุ่ม <b>⚡ พลัง 500🪙</b> แปลงร่าง 60 นาที: มีออร่ารอบตัว + เส้นไกด์สีฟ้า + ลำแสงควงสว่านตอนชาร์จ<br>🧱 กด <b>ฟรีคิก</b> มีกำแพงคนมาขวาง ต้องปั่นอ้อมหรือเตะข้ามหัว!<br>🧤 <b>น้องมาเฝ้าประตู!</b> ยิงมุมเสา/โด่งข้ามหัวให้พ้นมือ · ปุ่ม 🎯 = ดวลจุดโทษ 60 วิ · ยิงเข้ามุมสวยมี<b>รีเพลย์</b> 🎬</small>',
    hint:'🕹️ สติ๊กมือซ้าย = เล็ง · ⚽ ปุ่มขวากดค้าง = ชาร์จพลัง ปล่อย = เตะ · 🎱 ปุ่ม "จุดสัมผัส" = เปิดหน้าต่างซูมเลือกจุดเตะบนลูกบอล (ซ้าย-ขวา = ลูกโค้ง · ล่าง = ลอยโด่ง · บน = พุ่งจิก) ดูริบบิ้นทองบอกวิถีก่อนเตะ! · คอม: A/D W/S · Q/E โค้ง · เว้นวรรค เตะ · V มุมกล้อง',
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
const AD_RENT_COIN = 1000;      // 🪧 รอบ 362: ค่าเช่าป้ายโฆษณาเฮลิฯ (ผู้เล่นจองใส่ชื่อตัวเอง · ผู้ใช้ปรับ 300→1000 รอบ 365)
const AD_RENT_MS = 7*864e5;     // อายุสัญญาเช่า 7 วัน — ต้องตรงกับ rules /ads (604800000 ms)
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
const CAR_EYE    = 1.55;          // ความสูงตาคนขับ (รอบ 805: ยกสูงขึ้นจาก 1.32 — เดิมมุมกล้องต่ำจนเห็นพื้นถนนเยอะเกินไปแบบรถแข่ง F1)
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
let netHpOk=true;                                     // 🚁 รอบ 376: field hp (ลำแดงจอดทิ้งไว้) แพตเทิร์นเดียวกับ tl
let carPeerHits=0;                                    // 🛠️ รอบ 133: นับ "เจตนาชน" รถเพื่อนรอบนี้ (ครบ 3 = ค่าซ่อม CAR_RAM_FEE)
let rlChkAt=0, rlCoolAt=0, rlForce=null;              // 🚦 รอบ 133: ไฟแดง — จังหวะเช็ก + cooldown ใบสั่ง + testkit บังคับเฟสไฟ
let carDashEl=null, carWheelEl=null, carHornAt=0, carNameAt=0, carStreet='';
/* 🧭 รอบ 200-201: GPS นำทางไปตัวอักษร (ลูกศร+ระยะทาง · เลี้ยวตามถนนจริง A* แบบ Google Maps)
   🔇 รอบ 778: ตัด "เสียงพูดนำทาง" ออกตามคำสั่งผู้ใช้ — เหลือนำทางด้วยภาพอย่างเดียว */
let gpsTarget=null;
let gpsArrowEl=null, gpsDistEl=null, gpsTurnEl=null, gpsLetEl=null;
let gpsRoute=null, gpsWpi=0, gpsRouteFor=null, gpsRouteAt=0;   // เส้นทางตามถนน (A*) + waypoint ปัจจุบัน
let gpsRouteTo=null;    // 🧭 รอบ 782: จุดหมายที่ใช้คำนวณเส้นทางล่าสุด (ตัวอักษรย้ายที่ทุก 75 วิ → ต้องคำนวณใหม่)
let carGaugeCv=null, carGaugeCtx=null, carDashImg=null;   // เข็มวิ่งจริงบนคลัสเตอร์ของภาพ dash.png
let radioScreenEl=null, radioVizCv=null, radioVizCtx=null, radioHintEl=null, radioListEl=null;   // 🎵 วิทยุในรถ (รอบ 181)
let carBobbleEl=null, carBobbleImg=null, bobAng=0, bobVel=0, _bobVW=0, _bobVH=0, _bobAv='';       // 🪆 ตุ๊กตาดุ๊กดิ๊ก (รอบ 191)
let bobPitch=0, bobPitchV=0, _bobPrevSpd=0, _bobSkin=null, _bobAC=null;                           // 🪆 รอบ 193: ก้ม-เงย + สกิน + เสียงสะกิด
let radioBars=new Float32Array(32);                       // ระดับแท่ง visualizer (หน่วงนุ่ม)
let cityMapCv=null;               // แผนที่เมืองวาดครั้งเดียว → ใช้เป็นเรดาร์หมุนได้
/* ---------- เฮลิคอปเตอร์ (โหมด heli) ---------- */
const HELI_SKID=1.35;             // ความสูงตาคนขับเหนือแท่นลงจอด (คาน skid)
const HELI_CRASH_FINE=500;        // 💥 รอบ 389: ค่าปรับขับชนเฮลิฯ ผู้เล่นอื่นกลางอากาศ (ฝ่ายพุ่งชนจ่าย)
const HELI_MESH_SCALE=1.6;        // 📏 รอบ 378: ขยายลำจอด/ลำเพื่อนเป็นสัดส่วนจริงเทียบคน (Bell 212)
let hVel={x:0,y:0,z:0}, hCol=0, hLanded=true, hHitAt=0, hWarnLvl=0, hudInstEl=null, hudWarnEl=null, cockpitEl=null;
let khUpEl=null, khDnEl=null;   // ⌨️🚁 รอบ 818: ป้ายบอกปุ่ม Space/Shift ขึ้น-ลง ค้างไว้ทางขวา (เฉพาะคนเล่นด้วยคอมพิวเตอร์)
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
let _heliCrashAt=-1e9;            // 💥 รอบ 389: คูลดาวน์ชนเฮลิฯ เพื่อน (กันโดนปรับรัวใน 3 วิ)
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
/* 👕 รอบ 939 (ผู้ใช้ 6 ข้อ): ชุดแข่งเต็มระบบ — กางเกงอีก 1 ชุดสี + ลายเสื้อสไตล์ทีมระดับโลก
   ลายอ้างอิงชุดจริงที่คุ้นตา (ไม่ใช้ชื่อ/ตราสโมสรจริง เลี่ยงลิขสิทธิ์ · โลโก้เสื้อ = VOCAB WORLD ทุกตัว):
   ริ้วตั้ง=บาร์ซ่า/ยูเว่ · ริ้วขวาง=เซลติก · สายสะพาย=เปรู/ริเวอร์เพลต · ครึ่งอก=อินเตอร์แบบผ่า ·
   หัวลูกศร=คลาสสิก · แขนต่างสี=ชุดเยือนยุค 90 · ไล่เฉด=ชุดโมเดิร์น */
const SOCCER_SHORTS=[
  {n:'ขาว',c:0xf4f4f4},{n:'ดำ',c:0x23262c},{n:'กรมท่า',c:0x1a2a55},{n:'แดง',c:0xc62828},
  {n:'น้ำเงิน',c:0x1e59d0},{n:'เขียว',c:0x1e7d3c},{n:'เหลือง',c:0xf0b41e},{n:'ฟ้า',c:0x3fb3f6},
  {n:'เลือดหมู',c:0x7b1f2b},{n:'เทา',c:0x8a919c},
];
const SOCCER_PATTERNS=[
  {k:'plain',   n:'เรียบคลาสสิก'},
  {k:'stripes', n:'ริ้วแนวตั้ง'},
  {k:'hoops',   n:'ริ้วแนวขวาง'},
  {k:'sash',    n:'สายสะพาย'},
  {k:'half',    n:'ครึ่งอกสองสี'},
  {k:'chevron', n:'หัวลูกศร'},
  {k:'sleeves', n:'แขนต่างสี'},
  {k:'grad',    n:'ไล่เฉดโมเดิร์น'},
];
/* 🏟️ รอบ 928 (ผู้ใช้: "สนามใหญ่ขึ้น 2 เท่า" — ขยายทั้งสนามจริง ระยะเตะไกลขึ้นด้วย):
   สนาม 44×64 → 88×128 · ประตู -19 → -38 · จุดยืนสุ่มไกลสุด ~58m (เดิม ~29m)
   ประตู/บอล/GK ขนาดเท่าเดิม (ของจริงไม่ขยายตามสนาม) · KICK_SPD_MAX 44→52 จากการจำลองฟิสิกส์:
   ที่ 44 ลอยตรงถึงแค่ 56m ไม่ถึงจุดไกลสุด · ที่ 52 ลอยถึง 66m + เด้ง/กลิ้งถึง 94m
   🚀 รอบ 930 (ผู้ใช้: "แก้แรงเตะจาก 52m/s เป็น 90m/s"): KICK_SPD_MAX 52→90 — จำลองฟิสิกส์ที่ 90
   ลอยตรงถึง ~102m (เกินระยะยิงไกลสุด 58m มาก แรงเตะจัดจ้านตามที่ขอ)
   🚀 รอบ 932 (ผู้ใช้: "ร่างปกติ 65 m/s · ร่างพลัง 100 m/s") — แยก 2 ระดับ:
   KICK_SPD_MAX 90→65 (ร่างปกติ เต็มแรง) · AURA_SPD ปรับให้ 65×AURA_SPD=100 พอดี (ร่างพลัง)
   จำลองฟิสิกส์: spd=65 pit=.20 ลอยตรงถึง 57.5m (ครอบคลุมระยะยิงไกลสุด 58m ในร่างปกติได้พอดี) */
const BALL_R=0.34, BALL_G=17, PLAYER_Z=16, GOAL_Z=-38;     // รัศมีบอล · แรงโน้มถ่วง · จุดยืน/ประตู (แกน z)
const GOAL_HW=4, GOAL_H=3;                                 // ครึ่งกว้างประตู · ความสูงคาน
const KICK_SPD_MIN=9, KICK_SPD_MAX=65, CHARGE_RATE=78;     // ความเร็วเตะต่ำ-สูง (m/s · รอบ 932: ร่างปกติเต็มแรง=65) · พลังชาร์จ/วินาที
const AIM_YAW_SP=0.9, AIM_PITCH_SP=0.7, SOCCER_COLLECT=1.7;// ความไวเล็ง + ระยะบอลชนป้าย
const SOCCER_TILES=1, SOCCER_LETTER_COIN=5;               // รอบ 404: เหลือป้ายเดียว โผล่ทีละตัวในกรอบประตู · เหรียญ/ตัวอักษรที่ประกอบคำได้
let soccerBall=null, soccerPlayer=null;                    // ลูกบอล · หุ่นนักเตะ (รอบ 401: จุดพรีวิวเดิม → ริบบิ้น guideRibbon)
let _soccerTileGeo=null, coinPopEl=null;                   // geometry ป้าย (แชร์) · เลเยอร์ป๊อปเหรียญ
let sbVel={x:0,y:0,z:0}, sbLive=false, sbRestAt=0, sbKickAt=0, sbGoaled=false;
let sbInGoal=false;                                        // ⚽ รอบ 405: ลูกนี้ "ผ่านเส้นประตูในกรอบจริง" แล้วหรือยัง (ตาข่ายจะอุ้มเฉพาะลูกที่เข้า)
let aimYaw=0, aimPitch=0.34, sChg=0, sCharging=false, sKickHeld=false, sPrevV=false, sLegSwing=0;
let soccerCam1=false;                                      // true=มุมมองบุคคลที่ 1
let sKitShirt=0xe53935, sKitNo='10', sKitShort=0xf4f4f4, sKitPat='plain';   // 👕 รอบ 939: + กางเกง/ลายเสื้อ
const AIM_STICK=1.35;                                      // 🕹️ รอบ 398: ตัวคูณความไวสติ๊กเล็ง (มือถือ · ดันสุด=เร็วกว่าปุ่มเดิม)
/* 🌀 รอบ 400: ลูกปั่นโค้ง "ตั้งก่อนเตะ" แบบ PES — ปัดปุ่มเตะซ้าย/ขวา (หรือ Q/E) ตั้งความโค้ง
   แล้ว "เส้นประวิถีโค้งตามให้เห็นก่อนเตะจริง" (เดิมมีแต่ฟิสิกส์ แต่เส้นประวาดตรงตลอด ผู้เล่นเลยไม่รู้ว่าปั่นได้) */
const CURL_SWIPE=70, CURL_KEY_SP=1.6;                      // ระยะปัดนิ้ว(px)=โค้งเต็ม · ความเร็วเพิ่มโค้งด้วยคีย์ Q/E ต่อวินาที
const CURL_SPIN=3.5;                                       // สปินตอนโค้งเต็ม — วัดจริงได้เบน ~3m ที่เส้นประตู (ประตูกว้าง ±4m · GK เอื้อม .9m → อ้อมได้แต่ยังเข้าประตูได้)
/* 🎱 รอบ 401: หน้าต่างซูมเลือก "จุดสัมผัสบอล" แบบสนุกเกอร์ + เส้นไกด์ริบบิ้นแบนกว้าง
   จุดสัมผัสแนวนอน = ไซด์สปิน (ฟิสิกส์จริง: เตะขวาของลูก → บอลโค้งซ้าย)
   จุดสัมผัสแนวตั้ง  = เตะใต้ลูก(แบ็คสปิน ลอยโด่ง) / เตะบนลูก(ท็อปสปิน พุ่งต่ำจิก) */
const HIT_LIFT=0.20, HIT_SPIN_X=2.6;                       // เตะใต้ลูกสุด = เพิ่มมุมยกกี่ rad · แบ็ค/ท็อปสปินสูงสุดจากจุดสัมผัส
const GUIDE_N=56, GUIDE_W=0.62;                            // จำนวนจุดจำลองริบบิ้น (รอบ 928: 44→56 ≈2.7วิ ให้เห็นถึงประตูที่ไกลขึ้น) · ความกว้างริบบิ้น (เมตร)
let sHit=0;                                                // -1 เตะใต้ลูก .. +1 เตะบนลูก
let sKickPunch=0;                                          // 💥 แรงกระตุกกล้องตอนเตะ (จางเองทุกเฟรม)
let spinPadEl=null, spinDotEl=null, spinLblEl=null, spinOpen=false;
let guideRibbon=null, guideMat=null, _gPts=[];
/* 🎨🎯🧱 รอบ 402: ริบบิ้นไล่สีตามพลัง · วงจุดตก · กำแพงคนฟรีคิก */
const FK_SPOT_Z=GOAL_Z+27, FK_WALL_GAP=9.15, FK_WALL_N=5;  // จุดตั้งเตะฟรีคิก (รอบ 928: 18→27m — เขตโทษใหม่ลึก ~19m ต้องพ้นกรอบ) · ระยะกำแพงตามกติกาจริง · จำนวนคน
const FK_MAN_R=0.42, FK_MAN_H=1.92;                        // รัศมี/ความสูงคนในกำแพง (ใช้เช็กบอลชน)
let landRing=null, landPt=null;
/* ⚡ รอบ 412: "โหมดพลังโอเวอร์ไดรฟ์" — จ่าย 100 เหรียญ (รอบ 852 ลดจาก 500) ได้ 60 นาที
   ปกติ (ร่างธรรมดา) = ไม่มีเส้นไกด์ ต้องกะระยะเอาแบบดั้งเดิม
   แปลงร่างแล้ว = มีออร่ารอบตัว + เส้นไกด์สีฟ้ากลับมา + ตอนชาร์จมีลำแสงควงสว่านวนรอบเส้นไกด์
   + 🚀 รอบ 852: บอลพุ่งเร็วขึ้น 20% (คูณใน kickLaunch — เส้นไกด์ใช้สูตรเดียวกันจึงตรงเสมอ)
   🚀 รอบ 932 (ผู้ใช้: "ร่างปกติ 65 m/s · ร่างพลัง 100 m/s"): AURA_SPD เปลี่ยนจากคูณ 1.2 คงที่
   เป็น 100/KICK_SPD_MAX ให้ร่างพลังเต็มแรงตรง 100 m/s เป๊ะเสมอ แม้ KICK_SPD_MAX จะถูกจูนอีกในอนาคต */
const AURA_COST=100, AURA_MS=60*60*1000, AURA_SPD=100/KICK_SPD_MAX;
/* 🔥💨 รอบ 852: ชาร์จถึง ≥30% ของหลอด = เปลวไฟล้อมบอล · เตะออกไป = ควันหางตามแบบ missile
   (รอบ 853 ผู้ใช้: หางไฟ/ควันต้องยาวขึ้นเพราะแรงลมปะทะ + ควันต้องชัดกว่าเดิมมาก → พ่นถี่ขึ้น 2 เท่า อายุยาวขึ้น ก้อนใหญ่ทึบขึ้น) */
const FIRE_CHG=30, SMOKE_MAX=180, SMOKE_LIFE=1.8, SMOKE_GAP=13;   // % ไฟติด · จำนวนก้อนควันสูงสุด · อายุควัน(วิ) · ช่วงพ่น(ms)
let fireGrp=null, fireFlames=[], smokePool=[], smokeIdx=0, _smokeAt=0, sbFlame=false;
let auraGrp=null, auraRings=[], auraSparks=[], auraCoil=[], auraCore=null, auraBarEl=null, auraBtnEl=null;   // 🌀 รอบ 939: + เกลียวไฟส้ม
let drillMesh=null, drillMat=null, drillPhase=0, _auraHudAt=0;
let fkOn=false, fkWall=null, fkMen=[];
let sCurl=0, curlEl=null, _curlShown=null;                 // -1 โค้งซ้าย .. +1 โค้งขวา
let soccerStartEl=null, powerFillEl=null;
/* ⚽🎨 รอบ 396: PES-look — ฟิสิกส์จริง (drag/Magnus/after-touch/เสา-คาน/ตาข่าย) + สนามสมจริง */
const SB_DRAG=0.018, SB_MAGNUS=0.055, SB_TOUCH=9.5;        // สปส.ต้านอากาศ · แรงโค้ง Magnus · ความไวบังคับโค้งกลางอากาศ (A/D)
const SPOST_R=0.12, SB_SPIN_MAX=4.5;                       // รัศมีเสาประตู · เพดานสปินรวม (รอบ 400 ลด 9→4.5 · สูงกว่านี้บอลเบนหลุดประตูตลอด)
let sbSpin={x:0,y:0,z:0};                                  // สปินบอล: y=ไซด์สปิน(โค้งซ้ายขวา) x=แบ็ค/ท็อปสปิน
let sbShadow=null, soccerNets=[], sbNetRipple=0, sbInNet=false;   // เงาบอล · ตาข่าย(กระเพื่อม) · บอลติดตาข่ายอยู่
const _sbAxis=new THREE.Vector3();                         // ตัวแปรหมุนบอล (reuse กัน GC)
/* ⚽🧤🎯🎬 รอบ 397: น้อง GK เฝ้าประตู + โหมดจุดโทษจับเวลา + รีเพลย์สโลว์โมชัน */
const GK_Z=GOAL_Z+0.9, GK_SPEED=3.4, GK_REACH_X=0.9, GK_REACH_Y=2.0;  // แนวยืน GK · ความเร็ววิ่ง · ระยะปัด (กว้าง/สูง)
const GK_SPRITES={ cat:{f:'pet_cat_walk.webp',fw:172,fh:172,fps:14}, dog:{f:'pet_dog_walk.webp',fw:127,fh:165,fps:14},
                   dragon:{f:'pet_dragon_idle.webp',fw:147,fh:139,fps:12} };
const PK_TIME=60, PK_COIN=2, PK_SPOT_Z=GOAL_Z+13;          // วินาทีต่อรอบจุดโทษ · เหรียญ/ประตู · จุดโทษ (รอบ 928: 7→13m ให้ตรงจุดโทษที่วาด 11m×K บนสนามใหญ่)
let gkMesh=null, gkX=0, gkType='', gkSaveAt=0, gkCoolAt=0;
let sBaseZ=PLAYER_Z, sBaseX=0;                             // จุดยืนเตะปัจจุบัน (โหมดปกติ=สุ่ม · จุดโทษ=PK_SPOT_Z · ฟรีคิก=FK_SPOT_Z)
let pkOn=false, pkEndAt=0, pkGoals=0, pkKicks=0, pkBest=0, pkHudEl=null;
let repOn=false, repTrace=[], repT=0, repEl=null, repSide=1, repPendAt=0, repPendTrace=null, repPkLeft=0;

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
let room=null, lastNetSend=0, lastSent=null;   // 🏟️ รอบ 640: room = ตัวจัดการสนามจาก js/netroom.js (แทน worldRef/myRef เดิม)
/* 🏟️ รอบ 640: "ออนไลน์อยู่จริงไหม" — เดิมเช็กด้วย `if(myRef)` กระจายอยู่ ~15 จุด */
function netUp(){ return !!(room && room.online); }
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
   🪓 เฟส 3 (รอบ 546): เนื้อจริงย้ายไป js/adv3d_tex.js (window.Adv3dTex — loadAdv3d โหลดให้ก่อนไฟล์นี้)
   ด้านล่างคง alias ชื่อเดิม จุดเรียกทั้งไฟล์ไม่ต้องแก้ · logic โฆษณา DB (adsFetch/adShop/flyby) พัวพัน closure ไม่ย้าย อยู่ต่อท้ายก้อนนี้
   ============================================================ */
let ghostGen=0;            // token ทุกครั้งที่ล้าง/เปลี่ยนด่าน — กัน spawn ที่ค้างอยู่ปล่อยผีผิดด่าน
/* 🪧 รอบ 362: ผู้เช่าป้ายจาก DB /ads/<n>={uid,n,ts} — โหลด/อัปเดตใน adsFetch/adsChanged ด้านล่าง */
let adRenters={};
function adRenterActive(n){ const r=adRenters[n]; return (r&&r.n&&Date.now()-r.ts<AD_RENT_MS)?r:null; }
Adv3dTex.bind({adRenterActive, adSeqBase:AD_COUNT});   // inject ค่า closure ที่ฝั่ง tex ต้องใช้
const letterTexture=Adv3dTex.letterTexture, emojiTexture=Adv3dTex.emojiTexture;
const letterTextureDark=Adv3dTex.letterTextureDark;      // 🖤 รอบ 778: แผ่นดำ ใช้เฉพาะโลกโรงแรมผีสิง
const letterTex=ch=>(M.hotel?letterTextureDark:letterTexture)(ch);
const ghostTex=Adv3dTex.ghostTex, probeGhostImages=Adv3dTex.probeGhostImages, whenGhostsReady=Adv3dTex.whenGhostsReady;
const ghostTexture=()=>Adv3dTex.ghostTexture(M.ghostEmoji), ghostScareSrc=Adv3dTex.ghostScareSrc;
const adBoardTexture=Adv3dTex.adBoardTexture, ringAds=Adv3dTex.ringAds;
const _adTexDraws=Adv3dTex.adTexDraws, _adHasImg=Adv3dTex.adHasImg;
const FACADE_ROWS=Adv3dTex.FACADE_ROWS, buildingFacadeTexture=Adv3dTex.buildingFacadeTexture;
const makePeerSprite=(name,av,grade)=>Adv3dTex.makePeerSprite(name,av,M,grade);

/* 🪧 รอบ 362: ระบบเช่าป้ายโฆษณาเมืองเฮลิฯ — จ่าย AD_RENT_COIN จองป้าย 1-10 ชื่อขึ้นบนตึก 7 วัน
   DB /ads/<n>={uid,n,ts} (rules: เขียนได้เมื่อ ว่าง/หมดอายุ/ป้ายตัวเอง — ดู handoff/RULES.md)
   rules ยังไม่ publish = เขียนโดน deny → toast บอก ไม่หักเหรียญ ไม่พังเกม · ปุ่ม 🪧 โชว์เฉพาะเฟสเดิน */
function adsFetch(){
  if(!(Online.ready&&Online.db)) return;             // ⚠️ Online เป็น const (ไม่มี window.Online!) — adventure3d โหลดหลัง online.js เสมอ
  Online.db.ref('ads').once('value').then(s=>{
    adRenters=s.val()||{};
    for(const k in _adTexDraws) _adTexDraws[k]();
    adShopRender();
    adsWatch();                                        // 📻 รอบ 363: เริ่มฟังสดหลังได้ snapshot แรก
  }).catch(()=>{});
}
/* 📻 รอบ 363: sync ผู้เช่าป้ายสด + หอบังคับประกาศเมื่อมีคนเช่าป้ายใหม่ (ทุกคนในเมืองเห็นชื่อขึ้นทันที)
   attach หลัง adsFetch เติม adRenters แล้ว → child_added ชุดแรกชื่อ/uid เท่าเดิม = ไม่ประกาศซ้ำ */
let _adsRef=null;
function adsWatch(){
  if(_adsRef||!(Online.ready&&Online.db)) return;
  _adsRef=Online.db.ref('ads');
  const onCh=s=>adsChanged(s.key,s.val());
  _adsRef.on('child_added',onCh); _adsRef.on('child_changed',onCh);
  _adsRef.on('child_removed',s=>adsChanged(s.key,null));
}
function adsStop(){ if(_adsRef){ _adsRef.off(); _adsRef=null; } }
function adsChanged(n,v){
  const old=adRenters[n];
  if(v) adRenters[n]=v; else delete adRenters[n];
  if(_adTexDraws[n]) _adTexDraws[n]();
  adShopRender();
  // ประกาศเฉพาะผู้เช่าใหม่จริง: ข้อมูลเดิม/ตัวเอง (มี toast อยู่แล้ว)/ข้อมูลเก่าเกิน 2 นาที = เงียบ
  if(!v || (old&&old.uid===v.uid&&old.n===v.n)) return;
  if(v.uid===onlineKey() || Date.now()-v.ts>12e4) return;
  ATC.say('Attention all pilots! Billboard '+n+' has a new sponsor. Congratulations!');
  toast('🪧 ป้าย '+n+' มีเจ้าของใหม่: '+v.n);
}
function adRentBuy(n,btn){
  if(!(Online.ready&&Online.db)){ sfx.wrong(); toast('🔌 ต้องออนไลน์ก่อนถึงเช่าป้ายได้นะ'); return; }
  if(state.coins<AD_RENT_COIN){ sfx.wrong(); toast('🪙 เหรียญไม่พอ — ค่าเช่าป้าย '+fmtNum(AD_RENT_COIN)+' เหรียญ'); return; }
  if(btn) btn.disabled=true;
  const rec={uid:onlineKey(), n:(onlineDisplayName()||'ผู้เล่น').slice(0,40),
             ts:firebase.database.ServerValue.TIMESTAMP};
  Online.db.ref('ads/'+n).set(rec).then(()=>{
    state.coins-=AD_RENT_COIN; saveState(); renderHudTop();      // หักเหรียญหลังเขียนสำเร็จเท่านั้น
    adRenters[n]={uid:rec.uid, n:rec.n, ts:Date.now()};
    if(_adTexDraws[n]) _adTexDraws[n]();
    sfx.coin(); toast('🪧 เช่าป้าย '+n+' สำเร็จ! ชื่อขึ้นบนตึกให้ทุกคนเห็น 7 วัน');
    adShopRender();
  }).catch(()=>{
    if(btn) btn.disabled=false;
    sfx.wrong(); toast('⚠️ ยังเช่าไม่ได้ — ป้ายอาจถูกจองตัดหน้า หรือระบบยังไม่เปิด ลองใหม่อีกทีนะ');
    adsFetch();
  });
}
/* 🪧💰 รอบ 366: บินผ่านป้ายตัวเองระยะใกล้ = +AD_FLYBY_COIN (เพดาน AD_FLYBY_CAP เหรียญ/วัน)
   ให้ผู้เช่าป้ายมีเหตุกลับมาบินชมป้ายทุกวัน · กันฟาร์ม: ต้องออกจากโซนก่อนถึงนับใหม่ + คูลดาวน์ 30 วิ/ป้าย
   นับรายวันใน state.adFlyby={d:'YYYY-MM-DD',n:เหรียญที่ได้วันนี้} (เซฟ cloud ตาม state ปกติ) */
/* 🎬🎵 รอบ 369: เพลงตามฉากโลกเฮลิฯ — กลางคืน=bgm_03 (สายลับ) · นักบิน/วิงสูท=bgm_01 (ทะยาน) ·
   เดิน/ลิฟต์/นั่งชม=bgm_02 (ล่องลอย) · sceneBg วนลูปเพลงนั้น ไม่มีไฟล์=คงเพลงเดิม · ออกโลก=ปล่อยคืน */
function heliMusicTick(){
  if(typeof Music==='undefined'||!Music.sceneBg) return;
  Music.sceneBg(heliNight>.5?'bgm_03':(hPhase==='pilot'||hPhase==='wing')?'bgm_01':'bgm_02');
}
const AD_FLYBY_COIN=2, AD_FLYBY_CAP=10;
let _adFlybyNear={}, _adFlybyAt={};
function adFlybyTick(now){
  const A=worlds.heli&&worlds.heli.ads; if(!A||!A.length) return;
  const day=new Date().toISOString().slice(0,10);
  if(!state.adFlyby||state.adFlyby.d!==day) state.adFlyby={d:day,n:0};
  const me=onlineKey();
  for(const a of A){
    const r=adRenterActive(a.n);
    if(!r||r.uid!==me){ _adFlybyNear[a.n]=false; continue; }
    const dxz=Math.hypot(camera.position.x-a.x,camera.position.z-a.z);
    const near=dxz<14 && camera.position.y>a.h-9 && camera.position.y<a.h+7;
    if(near && !_adFlybyNear[a.n] && now-(_adFlybyAt[a.n]||-1e9)>3e4 && state.adFlyby.n<AD_FLYBY_CAP){   // ⚠️ default -1e9 ไม่ใช่ 0 — ไม่งั้น 30 วิแรกหลังโหลดหน้าไม่ได้รางวัล
      _adFlybyAt[a.n]=now; state.adFlyby.n+=AD_FLYBY_COIN;
      addCoins(AD_FLYBY_COIN); sessionCoins+=AD_FLYBY_COIN; saveState(); renderHudTop();
      sfx.coin(); toast('🪧 บินผ่านป้ายตัวเอง +'+AD_FLYBY_COIN+'🪙 (วันนี้ '+state.adFlyby.n+'/'+AD_FLYBY_CAP+')');
    }
    _adFlybyNear[a.n]=near;
  }
}
let adShopEl=null;
function adShopOpen(){
  adsFetch();                                          // รีเฟรชสถานะล่าสุดก่อนโชว์
  if(!adShopEl){
    adShopEl=document.createElement('div');
    adShopEl.id='adv-adshop-dlg';
    overlayEl.appendChild(adShopEl);
    adShopEl.addEventListener('click',e=>{
      if(e.target===adShopEl||e.target.closest('.ash-x')){ adShopEl.style.display='none'; return; }
      const b=e.target.closest('.ash-rent'); if(b) adRentBuy(+b.dataset.n,b);
    });
  }
  adShopEl.style.display='flex';
  adShopRender(); sfx.select();
}
function adShopRender(){
  if(!adShopEl||adShopEl.style.display!=='flex') return;
  const esc=s=>String(s).replace(/[<>&"]/g,ch=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));
  let cards='';
  for(let n=1;n<=AD_COUNT;n++){
    let body;
    if(_adHasImg[n]) body='<span class="ash-st">🔒 มีผู้สนับสนุน</span>';
    else{
      const r=adRenterActive(n);
      if(r){
        const days=Math.max(1,Math.ceil((r.ts+AD_RENT_MS-Date.now())/864e5));
        body=(r.uid===onlineKey()?'<span class="ash-st">✅ ของฉัน</span>':'')
          +'<span class="ash-nm">'+esc(r.n)+'</span><span class="ash-st">เหลือ '+days+' วัน</span>';
      }else body='<button class="ash-rent" data-n="'+n+'">เช่า '+fmtNum(AD_RENT_COIN)+'🪙</button>';
    }
    cards+='<div class="ash-it"><b>🪧 '+n+'</b>'+body+'</div>';
  }
  adShopEl.innerHTML='<div class="ash-card"><div class="ash-head"><b>🪧 เช่าป้ายโฆษณา</b>'
    +'<small>ชื่อเราขึ้นบนตึกให้ทุกคนเห็น 7 วัน · ป้ายหมดอายุใครก็เช่าต่อได้</small>'
    +'<button class="ash-x">✖</button></div><div class="ash-grid">'+cards+'</div></div>';
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
/* 🎖️ รอบ 644: grade = ระดับชั้นเพื่อน → ดาว/เพชรใต้ชื่อ (ป้ายสูงขึ้น 24px · scale ปรับตามสัดส่วนผืน) */
function blkNameSprite(name,grade){
  const hasG=!!(typeof gradeSymbol==='function' && gradeSymbol(grade));
  const H=hasG?88:64;
  const cv=document.createElement('canvas'); cv.width=256; cv.height=H;
  const c=cv.getContext('2d');
  c.fillStyle='rgba(0,0,0,.55)'; c.beginPath(); c.roundRect(8,6,240,H-12,20); c.fill();
  c.fillStyle='#fff'; c.font='bold 28px Arial'; c.textAlign='center'; c.textBaseline='middle';
  let nm=name||'เพื่อน'; if(nm.length>14) nm=nm.slice(0,13)+'…';
  c.fillText(nm,128,hasG?30:32);
  if(hasG) gradeMarkCanvas(c,grade,128,63,22);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true}));
  spr.scale.set(2.7,2.7*H/256,1); spr.userData.own=true;
  return spr;
}
/* เพื่อนในโลกขับรถ = โมเดลรถ GLB สีตรงคันที่เขาขับ (รอบ 393 · av='blk3c07') + ป้ายชื่อ
   ยังไม่รู้รุ่น/โหลดโมเดลไม่ทัน → รถบล็อก+หุ่นนั่งขับแบบเดิมก่อน แล้วสลับเมื่อโหลดเสร็จ */
function makeBlockPeer(name, av, uid, grade){
  const pm=/^(blk\d+)c(\d\d)$/.exec(av||'');
  const bav=pm?pm[1]:av, cid=pm?'car_'+pm[2]:null;
  const bid=BLOCK_AVATARS[bav]?bav:'blk'+(1+String(uid||'').split('').reduce((h,ch)=>(h*31+ch.charCodeAt(0))>>>0,0)%8);
  const g=new THREE.Group();
  const setRefs=car=>['wheels','steerW','blinkL','blinkR','revs','brks'].forEach(k=>g.userData[k]=car.userData[k]||[]);
  if(cid&&carGlbSrc){
    const car=carGlbBuild(cid); g.add(car); setRefs(car);
  }else{
    const car=makeBlockCar(bid); g.add(car); setRefs(car);
    const fig=makeBlockFigure(bid,true); fig.position.set(.35,1.02,.3); g.add(fig);
    if(cid) carGlbEnsure(src=>{             // โหลดเสร็จ → สลับรถบล็อกเป็นโมเดลจริง (กลุ่ม peer เดิม ป้ายชื่อคงอยู่)
      if(!src) return;
      g.remove(car); g.remove(fig);         // material บล็อกแชร์ใน cache — ไม่ dispose
      const gl=carGlbBuild(cid); g.add(gl); setRefs(gl);
    });
  }
  const label=blkNameSprite(name,grade); label.position.set(0,2.85,0); g.add(label);
  return g;
}
/* เพื่อนในโลกเดิน (adv/haunt) = หุ่นบล็อกเต็มตัวยืนบนพื้น เดินแกว่งแขน-ขาจริง + ป้ายชื่อ */
function makeBlockWalkPeer(name, av, uid, grade){
  const bid=BLOCK_AVATARS[av]?av:'blk'+(1+String(uid||'').split('').reduce((h,ch)=>(h*31+ch.charCodeAt(0))>>>0,0)%8);
  const g=new THREE.Group();
  const fig=makeBlockFigure(bid,false); g.add(fig);
  const label=blkNameSprite(name,grade); label.position.set(0,2.25,0); g.add(label);
  g.userData.limbs=fig.userData.limbs;      // ให้ tickPeers หมุนแกว่งได้ตรงๆ
  return g;
}
function disposeBlockPeer(g){
  g.traverse(o=>{ if(o.userData&&o.userData.own){ if(o.material.map)o.material.map.dispose(); o.material.dispose(); } });
}
/* 🤖 รอบ 941: เพื่อนในโลกหุ่นยนต์ = หุ่นรบ 3D ตัวที่เขาเลือก (av='m_01'..'m_10' จาก state.mechaRobot ฝั่งส่ง)
   สูง ~4.7m เท่าสเกลหุ่นเรา (MECHA_EYE 5.0) · สีลำตัว = สีประจำหุ่น (ROBOTS) · ตา/ปืน/ช่องอก = สีอาวุธ (MECHA_WEAPONS)
   geometry/material ใช้ cache บล็อกร่วม (_blkGeo/_blkMat ไม่ dispose) · เดินแกว่งขาผ่าน userData.limbs เหมือนหุ่นบล็อก */
const _mechGlow={};
function mechGlowMat(color){ return _mechGlow[color]||(_mechGlow[color]=new THREE.MeshLambertMaterial({color:0x11151a,emissive:color})); }
function makeMechaFigure(rid){
  const r=(typeof ROBOTS!=='undefined')&&ROBOTS.find(x=>x.id===rid);
  const body=blkMat(r?parseInt(r.c.slice(1),16):0x8e99a8);
  const dark=blkMat(0x37474f), mid=blkMat(0x546e7a);
  const glow=mechGlowMat((MECHA_WEAPONS[rid]&&MECHA_WEAPONS[rid].color)||0x37b6ff);
  const g=new THREE.Group();
  g.userData.limbs=[];                        // [ขาซ้าย, ขาขวา, แขนซ้าย, แขนขวา] — tickPeers แกว่ง rotation.x
  [-0.55,0.55].forEach(x=>{
    const piv=new THREE.Group(); piv.position.set(x,2.35,0);
    const thigh=new THREE.Mesh(blkGeo(.55,1.05,.6),mid);  thigh.position.y=-.55;         piv.add(thigh);
    const shin =new THREE.Mesh(blkGeo(.45,1.1,.5),dark);  shin.position.y=-1.6;          piv.add(shin);
    const foot =new THREE.Mesh(blkGeo(.62,.25,.95),dark); foot.position.set(0,-2.22,-.08); piv.add(foot);
    g.add(piv); g.userData.limbs.push(piv);
  });
  const pelvis=new THREE.Mesh(blkGeo(1.35,.5,.85),dark); pelvis.position.y=2.45; g.add(pelvis);
  const torso=new THREE.Mesh(blkGeo(1.8,1.35,1.0),body); torso.position.y=3.35; g.add(torso);
  const vent=new THREE.Mesh(blkGeo(.9,.3,.08),glow); vent.position.set(0,3.45,-.52); g.add(vent);   // ช่องพลังงานหน้าอก
  [-1,1].forEach(s=>{
    const pad=new THREE.Mesh(blkGeo(.62,.55,.75),body); pad.position.set(s*1.25,3.98,0); g.add(pad); // บ่า
    const piv=new THREE.Group(); piv.position.set(s*1.25,3.75,0);
    const ua=new THREE.Mesh(blkGeo(.4,.95,.5),mid);   ua.position.y=-.5;  piv.add(ua);
    const fa=new THREE.Mesh(blkGeo(.36,.85,.44),dark); fa.position.y=-1.3; piv.add(fa);
    if(s>0){ const gun=new THREE.Mesh(blkCyl(.14,.9),glow); gun.rotation.x=Math.PI/2; gun.position.set(0,-1.55,-.55); piv.add(gun); }  // ปืนแขนขวา ชี้ -Z
    g.add(piv); g.userData.limbs.push(piv);
  });
  const head=new THREE.Mesh(blkGeo(.8,.62,.72),dark); head.position.y=4.32; g.add(head);
  const visor=new THREE.Mesh(blkGeo(.56,.16,.08),glow); visor.position.set(0,4.36,-.38); g.add(visor); // ตาเรืองแสง
  const pack=new THREE.Mesh(blkGeo(1.2,.95,.4),mid); pack.position.set(0,3.45,.66); g.add(pack);       // เครื่องยนต์หลัง
  return g;                                   // หันหน้า -Z (convention เดียวกับหุ่นบล็อก)
}
function makeMechaPeer(name, av, uid, grade){
  const mm=/^m_(\d\d)$/.exec(av||'');
  const rid=(mm&&MECHA_WEAPONS['robot_'+mm[1]])?'robot_'+mm[1]:'robot_01';
  const g=new THREE.Group();
  const fig=makeMechaFigure(rid); g.add(fig);
  const label=blkNameSprite(name,grade);
  label.position.set(0,5.35,0);
  label.scale.multiplyScalar(1.7);            // หุ่นสูง 4.7m — ป้ายต้องใหญ่ขึ้นถึงอ่านออกจากระยะไกล
  g.add(label);
  g.userData.limbs=fig.userData.limbs;        // ให้ tickPeers แกว่งเดินตรงๆ
  return g;
}

/* ============================================================
   🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
   โหลดครั้งเดียว cache → clone ต่อคัน (แพตเทิร์น heliGlbEnsure รอบ 382) · texture ย้อม 10 สี
   ตามคันที่เพื่อนขับจริง (tools/retint_car.py → img/models/car_tex_NN.jpg · คัน 01 ใช้ texture ฝัง)
   รุ่นรถส่งพ่วงใน av: 'blk3c07' (≤8 ตัว ผ่าน rules เดิม ไม่ต้อง publish · client เก่าเห็นรถบล็อกสุ่ม)
   ล้อหน้าหักเลี้ยวตามพวงมาลัยเพื่อน — ประเมินจาก yaw rate ย้อน bicycle model (ไม่ต้องส่ง field ใหม่)
   ============================================================ */
const CAR_GLB_URL='img/models/car_01.glb';
const CAR_GLB_LEN=4.35;                     // ยาวเท่ารถบล็อกเดิม — ระยะชน/ป้ายชื่อ/กล้องเดิมใช้ต่อได้
let carGlbSrc=null, carGlbFail=false; const carGlbCbs=[];
/* Tripo รวม "ล้อหน้าขวา+กันชนหน้า" ใน tripo_part_1 ก้อนเดียว → ผ่า triangle แยกล้อออกมาให้เลี้ยวได้
   (ล้ออื่นแยก node อยู่แล้ว: part_2=หน้าซ้าย part_3=หลังซ้าย part_5=หลังขวา · หัวรถโมเดล = +Z) */
function carSplitWheel(root){
  const p1=root.getObjectByName('tripo_part_1');
  if(!p1||!p1.geometry||!p1.geometry.index) return;
  const g=p1.geometry, idx=g.index.array, pos=g.attributes.position.array;
  const w=[], b=[];
  const mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9];       // bbox เฉพาะ vertex ล้อ (position แชร์กับกันชน — Box3 ปกติจะได้ศูนย์ผิด)
  for(let i=0;i<idx.length;i+=3){
    let cx=0,cz=0;
    for(let k=0;k<3;k++){ cx+=pos[idx[i+k]*3]; cz+=pos[idx[i+k]*3+2]; }
    // พิกัดโลก = local + ตำแหน่ง node — ล้ออยู่ x>0.10, z<0.365 · กันชนโค้งอยู่หน้าสุด z>0.365 + ฝั่งซ้าย
    if((cx/3+p1.position.x)>.10 && (cz/3+p1.position.z)<.365){
      w.push(idx[i],idx[i+1],idx[i+2]);
      for(let k=0;k<3;k++) for(let a=0;a<3;a++){ const v=pos[idx[i+k]*3+a];
        if(v<mn[a])mn[a]=v; if(v>mx[a])mx[a]=v; }
    }else b.push(idx[i],idx[i+1],idx[i+2]);
  }
  if(!w.length||!b.length) return;
  const wg=new THREE.BufferGeometry();
  wg.setAttribute('position',g.attributes.position);
  if(g.attributes.normal) wg.setAttribute('normal',g.attributes.normal);
  if(g.attributes.uv) wg.setAttribute('uv',g.attributes.uv);
  wg.setIndex(w);
  const wm=new THREE.Mesh(wg,p1.material); wm.name='car_wheel_fr'; wm.position.copy(p1.position);
  wm.userData.wCtr=new THREE.Vector3((mn[0]+mx[0])/2+p1.position.x,(mn[1]+mx[1])/2+p1.position.y,(mn[2]+mx[2])/2+p1.position.z);
  p1.parent.add(wm);
  g.setIndex(b);                             // part_1 เหลือเฉพาะกันชน
}
function carGlbEnsure(cb){
  if(carGlbSrc) return cb(carGlbSrc);
  if(carGlbFail) return cb(null);
  carGlbCbs.push(cb);
  if(carGlbCbs.length>1) return;
  const fin=g=>{ carGlbSrc=g||null; carGlbFail=!g; carGlbCbs.splice(0).forEach(f=>f(carGlbSrc)); };
  const load=()=>{ try{
    new THREE.GLTFLoader().load(CAR_GLB_URL,gl=>{
      gl.scene.traverse(o=>{ if(o.isMesh&&o.material&&o.material.map) o.material.map.encoding=THREE.LinearEncoding; });
      carSplitWheel(gl.scene);
      fin(gl.scene);
    },undefined,()=>fin(null));
  }catch(e){ fin(null); } };
  if(THREE.GLTFLoader) load();
  else{ const s=document.createElement('script'); s.src='js/vendor/GLTFLoader.js';
    s.onload=load; s.onerror=()=>fin(null); document.head.appendChild(s); }
}
/* material ต่อรุ่นรถ — clone จาก material ฝังครั้งเดียว cache แชร์ทุกคันรุ่นเดียวกัน (car_01 = ฝังเดิม ไม่ clone) */
const carMatCache={};
function carMatGet(root,cid){
  const mm=/^car_(\d\d)$/.exec(cid||''), nn=mm?mm[1]:'01';
  if(nn==='01') return null;
  if(carMatCache[nn]) return carMatCache[nn];
  let base=null; root.traverse(o=>{ if(!base&&o.isMesh) base=o.material; });
  if(!base) return null;
  const mat=base.clone();
  const tx=new THREE.TextureLoader().load('img/models/car_tex_'+nn+'.jpg');
  tx.flipY=false;                            // ⚠️ UV ของ glTF ไม่กลับแกน y (บทเรียนรอบ 383)
  tx.encoding=THREE.LinearEncoding;
  if(base.map){ tx.wrapS=base.map.wrapS; tx.wrapT=base.map.wrapT; }
  mat.map=tx;
  carMatCache[nn]=mat;
  return mat;
}
/* ประกอบรถ 1 คันจาก cache: ย้อมสี + pivot ล้อ (หน้า=steer ครอบ spin · หลัง=spin) + ไฟเลี้ยว/ถอย/เบรคชุดเดิม */
function carGlbBuild(cid){
  const g=new THREE.Group();
  g.userData.wheels=[]; g.userData.steerW=[];
  const root=carGlbSrc.clone(true);
  const mat=carMatGet(carGlbSrc,cid);
  if(mat) root.traverse(o=>{ if(o.isMesh) o.material=mat; });
  root.updateMatrixWorld(true);
  const mkWheel=(name,steer)=>{
    const part=root.getObjectByName(name); if(!part) return;
    const hold=new THREE.Group();
    if(part.userData.wCtr) hold.position.copy(part.userData.wCtr);   // ล้อผ่า: ศูนย์จริงจาก vertex ล้อ (geometry แชร์กับกันชน Box3 เชื่อไม่ได้)
    else hold.position.copy(new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()));
    const spin=new THREE.Group(); hold.add(spin); root.add(hold);
    root.updateMatrixWorld(true);
    spin.attach(part);                       // attach คงตำแหน่งโลกเดิม — ล้อหมุนรอบศูนย์ตัวเอง
    g.userData.wheels.push(spin);
    if(steer) g.userData.steerW.push(hold);
  };
  mkWheel('tripo_part_2',true); mkWheel('car_wheel_fr',true);
  mkWheel('tripo_part_3',false); mkWheel('tripo_part_5',false);
  root.rotation.y=Math.PI;                   // หัวโมเดล +Z → หันหัว -Z ตาม convention รถบล็อกเดิม
  root.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root);
  const s=CAR_GLB_LEN/(bb.max.z-bb.min.z);
  root.scale.setScalar(s);
  root.position.set(-(bb.min.x+bb.max.x)/2*s, -bb.min.y*s, -(bb.min.z+bb.max.z)/2*s);
  g.add(root);
  // 🚦⬜🔴 ชุดไฟเดิมของรถบล็อก (tickPeers คุมผ่าน userData เดิมได้ทันที) — ตัวถัง GLB กว้าง/มนกว่า ขยับตำแหน่งตาม
  const blink=blkMat(0xff9800);
  g.userData.blinkL=[]; g.userData.blinkR=[];
  [[-1,'blinkL'],[1,'blinkR']].forEach(([sx,key])=>{
    [-2.1,2.1].forEach(z=>{
      const m=new THREE.Mesh(blkGeo(.16,.15,.1),blink);
      m.position.set(sx*.95,1.0,z); m.visible=false;
      g.add(m); g.userData[key].push(m);
    });
  });
  const revM=blkMat(0xffffff);
  g.userData.revs=[];
  [-.4,.4].forEach(x=>{ const m=new THREE.Mesh(blkGeo(.2,.15,.1),revM);
    m.position.set(x,1.0,2.12); m.visible=false; g.add(m); g.userData.revs.push(m); });
  const brkM=blkMat(0xd50000);
  g.userData.brks=[];
  [-.72,.72].forEach(x=>{ const m=new THREE.Mesh(blkGeo(.24,.18,.1),brkM);
    m.position.set(x,1.0,2.12); m.visible=false; g.add(m); g.userData.brks.push(m); });
  g._glbShared=true;                         // geometry/material แชร์กับ cache — ห้าม dispose
  return g;
}
/* รหัสรุ่นรถของเรา ('c07') พ่วงท้าย av ตอนอยู่โลกขับรถ */
function carAvCode(){
  const c=(typeof myCar==='function')?myCar():null;
  const m=c&&/^car_(\d\d)$/.exec(c.id);
  return m?'c'+m[1]:'';
}
/* ── 👁️ รอบ 394: มุมมองที่ 3 โลกขับรถ — เห็นรถโมเดลคันจริงของตัวเอง (ปุ่ม 👁️ เดียวกับ soccer / คีย์ V) ── */
let dCam3=false, carSelfM=null, carSelfCid=null, dPrevV=false;
function driveCamToggle(){
  dCam3=!dCam3;
  overlayEl.classList.toggle('cam3',dCam3&&!!M.drive);
  if(!dCam3){ if(carSelfM) carSelfM.visible=false; return; }
  const cid=(typeof myCar==='function'&&myCar())?myCar().id:'car_01';
  carGlbEnsure(src=>{
    if(!src||!dCam3||!M.drive){ if(!src){ dCam3=false; overlayEl.classList.remove('cam3'); } return; }
    if(carSelfM&&carSelfCid!==cid){ if(carSelfM.parent)carSelfM.parent.remove(carSelfM); carSelfM=null; }
    if(!carSelfM){
      carSelfM=carGlbBuild(cid); carSelfCid=cid;
      carSelfM.rotation.order='YZX';
      scene.add(carSelfM);
    }
    carSelfM.position.set(camera.position.x,0,camera.position.z);
    carSelfM.rotation.y=yaw;
    carSelfM.visible=true;
  });
}
/* ── 🛞 รอบ 394: รอยยางดำตอนไถล — ทริกเกอร์ slipPerp ตัวเดียวกับเสียงยางรอบ 183 · pool วนใช้ซ้ำ จาง 6 วิ ── */
const SKID_N=90, SKID_MS=6000;
let skids=[], skidI=0, skidAcc=9;
function skidGeomGet(){
  if(skidGeomGet.g) return skidGeomGet.g;
  const g=new THREE.PlaneGeometry(.3,1.05); g.rotateX(-Math.PI/2);   // อบให้แบนราบใน geometry — mesh หมุนแค่ rotation.y
  return skidGeomGet.g=g;
}
function skidDrop(x,z,yw,now){
  if(!skids.length){                              // สร้าง pool ครั้งแรกตอนอยู่ฉาก drive แน่ๆ (เรียกจาก tickDrive เท่านั้น)
    for(let i=0;i<SKID_N;i++){
      const m=new THREE.Mesh(skidGeomGet(),
        new THREE.MeshBasicMaterial({color:0x14161a,transparent:true,opacity:0,depthWrite:false}));
      m.visible=false; m.renderOrder=1;
      m.position.y=.02+(i%7)*.004;                // เหลื่อมความสูงกัน z-fight ระหว่างรอยซ้อน
      scene.add(m); skids.push(m);
    }
  }
  const m=skids[skidI++%SKID_N];
  m.position.x=x; m.position.z=z; m.rotation.y=yw;
  m.visible=true; m.userData.t=now;
}
function skidTick(now){
  for(const m of skids){
    if(!m.visible) continue;
    const a=1-(now-m.userData.t)/SKID_MS;
    if(a<=0){ m.visible=false; continue; }
    m.material.opacity=.4*a;
  }
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
  rend.forceContextLoss();   // 🧹 รอบ 859: คืน WebGL context จริง (dispose เฉยๆ ค้างจน GC — มือถือ context มีโควตาจำกัด)
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
  const groundMat=new THREE.MeshLambertMaterial({color:MODES.drive.ground});
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+500,RX*2+500),groundMat);
  ground.rotation.x=-Math.PI/2; ground.position.y=-.06; sc.add(ground);
  /* 🏙️ รอบ 831 (ผู้ใช้สั่ง): probe ภาพพื้นคอนกรีตจริง เหมือนระบบทางเท้า/หน้าตึก — มีไฟล์ = ปูแทนทันที ไม่มี = สีเทาคอนกรีตเดิม */
  const gndImg=new Image();
  gndImg.onload=()=>{ const tx=new THREE.Texture(gndImg); tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
    const rep=Math.round((RX*2+500)/22); tx.repeat.set(rep,rep); tx.needsUpdate=true;
    groundMat.map=tx; groundMat.color.setHex(0x6e6e69); groundMat.needsUpdate=true; };
  gndImg.src='img/city/ground.png';

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
  /* 🧭 รอบ 782: ncost = "ค่าผ่านทาง" ของแต่ละช่องนำทาง — A* ใช้ถ่วงน้ำหนักให้เกาะผิวถนนจริง
     1 = มีผิวถนนอยู่ใต้ล้อจริง · 2 = ไหล่ทาง (กริดทาเผื่อ ผ่านได้แต่ไม่ใช่ถนน) · 4 = ติดตึก/กำแพง (รถชนผ่านไม่ได้) */
  const ncost=new Uint8Array(GW*GW);
  const gset=(x,z,v)=>{ const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx>=0&&gz>=0&&gx<GW&&gz<GW){ const k=gz*GW+gx; if(v===1||!grid[k]) grid[k]=v; } };
  const ngset=(x,z,sg)=>{ const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx<0||gz<0||gx>=GW||gz>=GW) return;
    const k=gz*GW+gx; ngrid[k]=1;
    // ศูนย์กลางช่องอยู่ในผิวถนนของท่อนนี้ไหม (เทียบระยะตั้งฉากกับครึ่งความกว้างถนนจริง)
    const ccx=gx*GS-GOFF+GS/2, ccz=gz*GS-GOFF+GS/2;
    let t=(ccx-sg.x1)*sg.ux+(ccz-sg.z1)*sg.uz; t=t<0?0:(t>sg.L?sg.L:t);
    if(Math.hypot(ccx-(sg.x1+sg.ux*t), ccz-(sg.z1+sg.uz*t))<=sg.w/2+0.6) ncost[k]=1;
    else if(!ncost[k]) ncost[k]=2; };
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
      const sg={x1,z1,ux,uz,L,w};                              // ท่อนถนนปัจจุบัน (ngset ใช้ตัดสินว่าช่องมีผิวถนนจริงไหม)
      for(let s2=0;s2<=st;s2++){
        const x=x1+dx*s2/st, z=z1+dz*s2/st;
        for(let ox=-rr;ox<=rr;ox++) for(let oz=-rr;oz<=rr;oz++){
          gset(x+ox*GS,z+oz*GS,1);
          if(Math.hypot(ox*GS,oz*GS)<=nrad) ngset(x+ox*GS,z+oz*GS,sg);
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
      /* 🐛 รอบ 798: เดิม e0/e1 คูณ sgn ตรง ๆ → ฝั่ง +1 เป็นภาพกระจกของฝั่ง -1 "ลำดับจุดกลับด้าน" = หลังหันขึ้นฟ้า
         ถูก back-face culling ตัดทิ้ง → ทั้งเมืองมีเลนจักรยาน/ทางเท้าโผล่แค่ข้างเดียวมาตั้งแต่รอบ 182
         (วัดด้วย raycast ลงจากฟ้าตามแนวถนนใหญ่ 8 สาย: ฝั่งหนึ่ง 117/117 อีกฝั่ง 1/117) — สลับ d0/d1 ตอน sgn=+1 คืนลำดับจุดให้ถูก */
      const strip=(arr,d0,d1)=>{ for(const sgn of [1,-1]){ const e0=sgn>0?d1:-d0, e1=sgn>0?d0:-d1;
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
  /* 🏢 รอบ 840 (ผู้ใช้: "ตึกยังแปะภาพไม่ครบ"): ตึกจริง (ExtrudeGeometry ผัง OSM) เดิมมีแค่สีพาสเทลล้วน
     ไม่เคยแปะภาพผนังเลย (ตึกแถวข้างล่างมี แต่กลุ่มนี้ไม่มี) → ใช้ img/city/shop_4fl.png ตามกฎเดิม
     "4 ชั้นขึ้นไป→shop_4fl" ใน PROMPTS_BUILDINGS_KPP.md · repeat ทุก ~13.2ม.(4 ชั้น) แนวตั้ง/10ม. แนวนอน
     ตาม z จริง (เมตร ไม่ normalize) เพราะ UV เริ่มต้นของ ExtrudeGeometry ใช้พิกัดโลกดิบ
     ⚠️ ตรวจจาก js/vendor/three.min.js จริง (addGroup): materialIndex 0 = ฝาบน/ล่าง(cap) ·
        materialIndex 1 = ผนังด้านข้าง(side) — สลับกับที่คนทั่วไปเข้าใจ ผิดลำดับ = ภาพผนังไปโผล่เป็นหลังคาแทน (บั๊กเดิม) */
  const towerWallMats=[];
  const towerTex=new THREE.Texture();
  towerTex.wrapS=towerTex.wrapT=THREE.RepeatWrapping;
  towerTex.repeat.set(.1,1/13.2);
  const towerImg=new Image();
  towerImg.onload=()=>{ towerTex.image=towerImg; towerTex.needsUpdate=true;
    towerWallMats.forEach(m=>{ m.map=towerTex; m.needsUpdate=true; }); };
  towerImg.src='img/city/shop_4fl.png';
  C.b.forEach((b,bi)=>{
    const h=b[0], p=b[2];   // รอบ 183: เลิกใช้ชื่อ OSM (b[1]) — โชว์เฉพาะผู้ลงโฆษณา (SHOP_ADS)
    const shape=new THREE.Shape();
    shape.moveTo(p[0],-p[1]);
    for(let i=2;i<p.length;i+=2) shape.lineTo(p[i],-p[i+1]);
    const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});
    g.rotateX(-Math.PI/2);                                   // extrude → แกน y · shape.y=-z → z โลกตรงพิกัดจริง
    const capFlatM=new THREE.MeshLambertMaterial({color:tints[bi%tints.length],side:THREE.DoubleSide});
    const wallM=new THREE.MeshLambertMaterial({color:tints[bi%tints.length],side:THREE.DoubleSide});
    towerWallMats.push(wallM);
    sc.add(new THREE.Mesh(g,[capFlatM,wallM]));              // [0]=cap บน/ล่าง (สีล้วน ถูกฝาครอบยอดข้างล่างบังอยู่แล้ว) · [1]=ผนังข้าง (ภาพจริง)
    // 🏠 ฝาครอบยอดสีสด (roof cap) — ตึกจริงผังไม่สม่ำเสมอ ใช้แผ่นสีตามผังวางบนยอดแทนหลังคาจั่ว
    const cap=new THREE.ExtrudeGeometry(shape,{depth:1.4,bevelEnabled:false}); cap.rotateX(-Math.PI/2);
    const capM=new THREE.Mesh(cap,new THREE.MeshLambertMaterial({color:CUTE_ROOF[bi%CUTE_ROOF.length],side:THREE.DoubleSide}));
    capM.position.y=h; sc.add(capM);
    let cx=0,cz=0; const n=p.length/2;
    for(let i=0;i<p.length;i+=2){ cx+=p[i]/n; cz+=p[i+1]/n; }
    for(let i=0;i<p.length;i+=2){                            // ขอบ polygon = กำแพง
      const x1=p[i],z1=p[i+1],x2=p[(i+2)%p.length],z2=p[(i+3)%p.length];
      // 🚁 รอบ 816: ติด h = ความสูงจริงของตึก (รถไม่สนใจ · เฮลิฯ ใช้ตัดสินว่าบินสูงพ้นยอดตึกนี้แล้วหรือยัง)
      sAdd((x1+x2)/2,(z1+z2)/2,Math.hypot(x2-x1,z2-z1)/2+3,{t:1,x1,z1,x2,z2,h:h+1.4});
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
    sAdd(L[0],L[1],Math.hypot(L[3],L[4])/2+2,{t:0,x:L[0],z:L[1],rot:L[2],hx:L[3]/2,hz:L[4]/2,h:L[5]+1.6});  // h = รอบ 816 (เฮลิฯ บินข้ามยอดได้)
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
  const roofMat=new THREE.MeshLambertMaterial({color:0xffffff});
  const roof=new THREE.InstancedMesh(roofGeo,roofMat,lots.length);
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
  /* 🧱🏠 รอบ 839: ลายกระเบื้องมุงหลังคาจริง — เหมือนระบบ facade (probe ภาพจริง img/city/roof_tile.png)
     ภาพต้องเป็นโทนขาว/เทาอ่อนเรียบๆ เพราะ CUTE_ROOF ยังคูณสีทับต่อหลังเหมือนเดิม (ภาพเข้ม = สีเพี้ยนทั้งเมือง) */
  const rfImg=new Image();
  rfImg.onload=()=>{ const tx=new THREE.Texture(rfImg); tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
    tx.repeat.set(2,2); tx.needsUpdate=true; roofMat.map=tx; roofMat.needsUpdate=true; };
  rfImg.src='img/city/roof_tile.png';

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
  sAdd(0,0,15,{t:2,x:0,z:0,r:13.2,h:27});                     // เกาะกลางวงเวียน = วงกลมชนไม่ได้ (ตามเกาะจริง) · h=ยอดหอนาฬิกา+ยอดแหลม (รอบ 816)

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

  /* ============================================================
     🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
     วัดจากเมืองจริงในเบราว์เซอร์ (กริดนำทาง 86,012 ช่อง: ผิวถนนจริง 53,434 · ไหล่ทาง 27,931):
       ① 4,647 ช่อง (5.4%) ตกอยู่ในตึก/ตึกแถว แต่ A* เดินผ่านได้ฟรี → string-pulling ลากเส้นตัดมุมทะลุตึก
          วัดด้วย collideCar ของเกมเอง (85 เส้น ~56 กม.): 29 เส้นมีช่วงทับตึกยาวเกิน 4 ม. ยาวสุด 34 ม.
          = จุดที่ผู้เล่นขับตามป้ายแล้ว "ไปต่อไม่ได้" เพราะโดนกำแพงดันออก
       ② กริดนำทางแตกเป็น 8 ก้อน — ก้อนหลัก 80,380 ช่อง ที่เหลือเป็นเกาะโดดเดี่ยว (872/71/27/12/1/1/1 ช่อง)
          ตัวอักษรที่เกิดบนเกาะพวกนี้ขับไปไม่ถึงเลย → routeGrid คืน null
       ③ พอ routeGrid คืน null โค้ดเดิมทำ fallback เส้นตรงแต่ "ลืมติดธง fallback" → ป้ายขึ้น "ตรงไป"
          พาขับทะลุทุ่ง/ตึก (ตรงกับภาพที่ผู้ใช้ส่งมารอบ 774) · navLineUpdate ก็เช็กธงนี้อยู่
       ④ ตัวอักษรย้ายที่เองทุก 75 วิ (relocTick) โดยยังเป็นวัตถุเดิม → gpsRouteFor ไม่เปลี่ยน
          เส้นทางเก่าค้าง GPS พาไปที่ที่ไม่มีอะไรแล้ว
     แก้: ทำแผนที่ "ค่าผ่านทาง (ncost) + ก้อนที่เชื่อมถึงกัน (ncomp)" ตอนสร้างเมืองครั้งเดียว แล้ว
       · A* ถ่วงน้ำหนักให้เกาะผิวถนนจริง + เลี่ยงช่องที่ติดตึก · losClear ห้ามลัดทะลุตึก (①)
       · คัดจุดเกิดตัวอักษร + เป้า GPS ให้เหลือเฉพาะจุดที่ขับไปถึงได้จริง (②)
       · ติดธง fallback จริง + ป้ายบอกตรง ๆ ว่า "ไม่มีถนนไปถึง" (③) · เป้าขยับเกิน 12 ม. = คำนวณใหม่ (④)
     ============================================================ */
  const NAV_CLR=1.55;                                          // รัศมีรถ 1.15 + เผื่อขอบ (ต้องเท่ากับ CR ใน collideCar)
  const navBlockedAt=(x,z,pad)=>{                              // ช่องนี้รถแทรกผ่านไม่ได้จริงไหม (เลขคณิตเดียวกับ collideCar)
    const R=NAV_CLR+(pad||0);                                  // pad = เผื่อเพิ่ม (รอบ 788: ถนนเชื่อมขอเลนกว้างกว่าตัวรถ)
    const list=solidGrid[Math.floor(x/SCELL)+','+Math.floor(z/SCELL)];
    if(!list) return false;
    for(const s of list){
      if(s.t===2){ if(Math.hypot(x-s.x,z-s.z)<s.r+R) return true; }
      else if(s.t===0){
        const c=Math.cos(s.rot), si=Math.sin(s.rot), dx=x-s.x, dz=z-s.z;
        if(Math.abs(dx*c-dz*si)<s.hx+R && Math.abs(dx*si+dz*c)<s.hz+R) return true;
      }else{
        const dx=s.x2-s.x1, dz=s.z2-s.z1, L2=dx*dx+dz*dz||1e-9;
        let t=((x-s.x1)*dx+(z-s.z1)*dz)/L2; t=t<0?0:(t>1?1:t);
        if(Math.hypot(x-s.x1-dx*t, z-s.z1-dz*t)<R) return true;
      }
    }
    return false;
  };
  for(let k=0;k<ngrid.length;k++){
    if(ngrid[k]!==1) continue;
    const gx=k%GW, gz=(k/GW)|0;
    if(navBlockedAt(gx*GS-GOFF+GS/2, gz*GS-GOFF+GS/2)) ncost[k]=4;
  }
  /* ก้อนที่เชื่อมถึงกัน (flood fill กติกาเดียวกับ A*: 8 ทิศ + ห้ามตัดมุม · ข้ามช่องที่ติดตึก) */
  const ncomp=new Int32Array(GW*GW);
  const navOpen=(gx,gz)=>gx>=0&&gz>=0&&gx<GW&&gz<GW&&ngrid[gz*GW+gx]===1&&ncost[gz*GW+gx]!==4;
  const NDIR=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  let compSize=[], nmain=0;
  const recomp=()=>{                                           // รอบ 788: เรียกซ้ำได้ (หลังปูถนนเชื่อม ก้อนเปลี่ยน)
    ncomp.fill(-1); compSize=[];
    for(let k0=0;k0<ncomp.length;k0++){
      if(ncomp[k0]>=0 || !navOpen(k0%GW,(k0/GW)|0)) continue;
      const cid=compSize.length, q=[k0]; ncomp[k0]=cid; let n=0, head=0;
      while(head<q.length){
        const cur=q[head++]; n++;
        const cgx=cur%GW, cgz=(cur/GW)|0;
        for(const d of NDIR){
          const nx=cgx+d[0], nz=cgz+d[1];
          if(!navOpen(nx,nz)) continue;
          if(d[0]&&d[1] && (!navOpen(cgx+d[0],cgz)||!navOpen(cgx,cgz+d[1]))) continue;
          const ni=nz*GW+nx;
          if(ncomp[ni]<0){ ncomp[ni]=cid; q.push(ni); }
        }
      }
      compSize.push(n);
    }
    nmain=0; for(let c=1;c<compSize.length;c++) if(compSize[c]>compSize[nmain]) nmain=c;
  };
  recomp();

  /* ============================================================
     🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
     (ผู้ใช้: "หาว่าเกาะพวกนี้อยู่ตรงไหนของเมือง แล้วเชื่อมเข้ากับถนนหลักให้ขับถึงได้จริง")
     รอบ 782 แค่ "กันไม่ให้ GPS ส่งไปเกาะ" (คัดจุดเกิดออก) — ถนนพวกนั้นยังขับไปไม่ถึงอยู่ดี
     วัดตำแหน่งจริงในเบราว์เซอร์ (กริด 1262×1262 · GS 6 ม.) เจอเกาะ 7 ก้อน รวม 984 ช่อง:
       ก้อน 872 ช่อง — ถนนสายเหนือแนวเฉียง NE→SW แถว (768,-2114) ปลายทางทิศตะวันตกจ่อ
         ถนนกำแพงเพชรสายเหนือ แต่ขาดช่วงสุดท้าย ~90 ม. (ข้อมูลถนนต้นทางตัดจบก่อนถึงแยก)
       ก้อน 71 / 27 / 12 ช่อง — ตอถนนย่านตะวันออก (ถนนราษฎร์รวมใจ) ที่ (2168,398)/(2215,126)/(2087,212) ขาด 8–38 ม.
       ก้อน 1 ช่องอีก 3 จุด — (245,-643) / (-553,-601) / (1961,449) ติดก้อนหลักแบบ "แตะกันแค่มุมทแยง"
         ซึ่งกฎห้ามตัดมุมของ A* ไม่ให้ผ่าน (ไม่ใช่ถนนขาดจริง)
     วิธี: BFS จากทุกช่องของเกาะออกไป "ที่ว่างที่รถแทรกผ่านได้จริง" (ไม่ใช่ตึกด้วย navBlockedAt · ไม่ใช่น้ำ)
       จนไปโดนก้อนหลัก → ย่อเส้นให้ตรงด้วย string pulling → ปูเป็นถนนจริงกว้าง 7 ม.
       (ทั้ง mesh ที่มองเห็น + grid ฟิสิกส์ + ngrid/ncost ของ GPS) แล้วคำนวณก้อนใหม่
     ⚠️ ปูแล้วต้องตีค่า ncost=4 ซ้ำที่ช่องซึ่งเฉี่ยวตึก — ngset ตั้ง 1/2 ทับค่า 4 เดิมได้
     ============================================================ */
  const LINK_W=7, LINK_SEEN_MAX=60000;                         // ถนนเชื่อมกว้าง 7 ม. · เพดานช่องที่ค้นต่อเกาะ (กันค้างถ้าเกาะโดนล้อมสนิท)
  /* เผื่อระยะห่างตึกให้ถนนเชื่อม "กว้างกว่าตัวรถ" — ลองรอบแรกแบบสบาย ๆ ถ้าไม่มีทางค่อยลดเหลือพอดีตัว
     (ทดสอบขับจริงแล้วเส้นที่เฉียดตึก 1.55 ม. รถครูดมุมตึกจนติดขัด แม้ "ผ่านได้" ตามคณิตศาสตร์) */
  const LINK_PADS=[1.1,0];
  const linkTris=[], linkCells=[], linkLog=[];
  const cCtr=g=>g*GS-GOFF+GS/2;
  const freeMemo=[new Map(),new Map()];                         // ช่องนี้รถแทรกผ่านได้ไหม (ไม่ใช่ตึก/ไม่ใช่น้ำ) — memo แยกตามระยะเผื่อ
  let padI=0;
  const freeCell=(gx,gz)=>{
    if(gx<0||gz<0||gx>=GW||gz>=GW) return false;
    const k=gz*GW+gx; if(grid[k]===2) return false;             // น้ำ (ไม่มีสะพาน = ไม่ปูข้าม)
    let v=freeMemo[padI].get(k);
    if(v===undefined){ v=!navBlockedAt(cCtr(gx),cCtr(gz),LINK_PADS[padI]); freeMemo[padI].set(k,v); }
    return v;
  };
  const linkClear=(x1,z1,x2,z2)=>{                             // ลากตรงจากจุดหนึ่งไปอีกจุด รถผ่านได้ตลอดแนวไหม
    const L=Math.hypot(x2-x1,z2-z1), st=Math.max(2,Math.ceil(L/2));
    for(let i=0;i<=st;i++){
      const x=x1+(x2-x1)*i/st, z=z1+(z2-z1)*i/st;
      if(navBlockedAt(x,z,LINK_PADS[padI])) return false;
      const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
      if(gx<0||gz<0||gx>=GW||gz>=GW || grid[gz*GW+gx]===2) return false;
    }
    return true;
  };
  const paveLink=(x1,z1,x2,z2)=>{                              // ปูถนนจริง 1 ท่อน (สูตรเดียวกับถนนปกติด้านบน)
    const dx=x2-x1, dz=z2-z1, L=Math.hypot(dx,dz)||1e-6, ux=dx/L, uz=dz/L, w=LINK_W;
    const ex=ux*w*.5, ez=uz*w*.5, ax=x1-ex,az=z1-ez, bx=x2+ex,bz=z2+ez, nx=-uz*w/2, nz=ux*w/2;
    linkTris.push(ax+nx,az+nz,bx+nx,bz+nz,bx-nx,bz-nz, ax+nx,az+nz,bx-nx,bz-nz,ax-nx,az-nz);
    const rr=Math.ceil((w/2+1.5)/GS), st=Math.max(1,Math.floor(L/GS*2)), nrad=Math.max(w/2+1,GS+0.1);
    const sg={x1,z1,ux,uz,L,w};
    for(let s2=0;s2<=st;s2++){
      const x=x1+dx*s2/st, z=z1+dz*s2/st;
      for(let ox=-rr;ox<=rr;ox++) for(let oz=-rr;oz<=rr;oz++){
        gset(x+ox*GS,z+oz*GS,1);
        if(Math.hypot(ox*GS,oz*GS)<=nrad){
          ngset(x+ox*GS,z+oz*GS,sg);
          const gx=Math.floor((x+ox*GS+GOFF)/GS), gz=Math.floor((z+oz*GS+GOFF)/GS);
          if(gx>=0&&gz>=0&&gx<GW&&gz<GW) linkCells.push(gz*GW+gx);
        }
      }
    }
  };
  const islands={};
  for(let k=0;k<ncomp.length;k++){ const c=ncomp[k]; if(c>=0&&c!==nmain) (islands[c]=islands[c]||[]).push(k); }
  for(const cid in islands){
    const seeds=islands[cid];
    let prev=null, hit=-1, scan=0;
    for(padI=0; padI<LINK_PADS.length && hit<0; padI++){        // ลองเลนกว้างก่อน ไม่มีทางค่อยยอมเลนพอดีตัว
      prev=new Map(); const q=seeds.slice(); let head=0, seen=0;
      for(const k of seeds) prev.set(k,-1);
      while(head<q.length && seen++<LINK_SEEN_MAX){
        const cur=q[head++], gx=cur%GW, gz=(cur/GW)|0;
        if(ncomp[cur]===nmain){ hit=cur; break; }
        for(const d of NDIR){
          const nx=gx+d[0], nz=gz+d[1];
          if(nx<0||nz<0||nx>=GW||nz>=GW) continue;
          const ni=nz*GW+nx;
          if(prev.has(ni)) continue;
          if(ncomp[ni]!==nmain && !freeCell(nx,nz)) continue;
          /* ห้ามตัดมุมเหมือน A* — ถ้าสองช่องข้าง ๆ เป็นตึก รถบีบผ่านมุมทแยงไม่ได้จริง
             (ไม่เช็กข้อนี้ = ปูถนนเชื่อม 8 ม. ทิ้งไว้เฉย ๆ แล้วเกาะก็ยังไม่ต่อ — เจอที่ (2087,212)) */
          if(d[0]&&d[1] && (!freeCell(gx+d[0],gz) || !freeCell(gx,gz+d[1]))) continue;
          prev.set(ni,cur); q.push(ni);
        }
      }
      scan+=seen;
      if(hit>=0) padI--;                                       // เจอแล้ว: คงระยะเผื่อชุดนี้ไว้ให้ขั้นย่อเส้น (linkClear)
    }
    if(hit<0){ padI=0; continue; }                             // โดนล้อมสนิทจริง — ปล่อยไว้ (ตัวกรองจุดเกิดด้านล่างตัดออกเอง)
    const path=[]; for(let cur=hit; cur>=0; cur=prev.get(cur)) path.push(cur);
    const pAt=i=>({x:cCtr(path[i]%GW), z:cCtr((path[i]/GW)|0)});
    let i=0, total=0; const poly=[pAt(0)];
    while(i<path.length-1){                                    // ย่อเส้นให้ตรงที่สุดเท่าที่รถผ่านได้ แล้วปูทีละท่อน
      let j=path.length-1;
      while(j>i+1){ const a=pAt(i), b=pAt(j); if(linkClear(a.x,a.z,b.x,b.z)) break; j--; }
      const a=pAt(i), b=pAt(j);
      paveLink(a.x,a.z,b.x,b.z); total+=Math.hypot(b.x-a.x,b.z-a.z); poly.push(b); i=j;
    }
    linkLog.push({comp:+cid, cells:seeds.length, m:Math.round(total), pad:LINK_PADS[padI], scan, poly});   // poly = แนวถนนเชื่อม (ปลายแรก=ฝั่งโครงข่ายหลัก · ปลายท้าย=ฝั่งเกาะ)
    padI=0;
  }
  if(linkTris.length){
    for(const k of linkCells) if(navBlockedAt(cCtr(k%GW), cCtr((k/GW)|0))) ncost[k]=4;   // ขอบถนนเชื่อมที่เฉี่ยวตึก = ห้าม A* ใช้
    sc.add(new THREE.Mesh(flatGeom(linkTris,.06), new THREE.MeshLambertMaterial({color:0x41454c})));

    /* 🚸 รอบ 798 (ผู้ใช้: "ถนนเชื่อมเกาะยังเป็นแถบยางมะตอยเปล่า") — แต่งเครื่องหมายจราจรให้เหมือนถนนปกติ
       ใช้ค่าคงที่/ระดับ y ชุดเดียวกับถนนหลักด้านบนเป๊ะ (เส้นประทุก 9 ม. · เลนจักรยาน BIKE_W ขอบขาว LINE_W · ทางเท้า WALK_W)
       + ใช้ walkMat ตัวเดิม → ภาพลาย img/city/sidewalk.png ที่ probe ไว้ปูทางเท้าถนนเชื่อมด้วยอัตโนมัติ
       ⚠️ decal พื้นล้วน — ห้ามแตะ grid/ngrid/ncost/roadPts (ไม่งั้นกริดนำทางที่เพิ่งเชื่อมเสร็จเพี้ยน)
       ⚠️ ข้ามฝั่งที่ล้นลงแม่น้ำ (grid==2) ไม่งั้นทางเท้า/เลนจักรยานลอยอยู่บนผิวน้ำ */
    const lkDash=[], lkBike=[], lkEdge=[], lkWalk=[], LKR=LINK_W/2;
    const wetAt=(x,z)=>{ const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
      return gx>=0&&gz>=0&&gx<GW&&gz<GW && grid[gz*GW+gx]===2; };
    for(const lg of linkLog) for(let i=0;i<lg.poly.length-1;i++){
      const a=lg.poly[i], b=lg.poly[i+1];
      const dx=b.x-a.x, dz=b.z-a.z, L=Math.hypot(dx,dz)||1e-6, ux=dx/L, uz=dz/L;
      for(let t=5;t<L-2;t+=9){                                 // เส้นประกลางถนน (สูตรเดียวกับถนนใหญ่)
        const cx=a.x+ux*t, cz=a.z+uz*t, hx=ux*1.3, hz=uz*1.3, mx=-uz*.18, mz=ux*.18;
        lkDash.push(cx-hx+mx,cz-hz+mz,cx+hx+mx,cz+hz+mz,cx+hx-mx,cz+hz-mz,
                    cx-hx+mx,cz-hz+mz,cx+hx-mx,cz+hz-mz,cx-hx-mx,cz-hz-mz);
      }
      const ex=ux*LINK_W*.5, ez=uz*LINK_W*.5;                  // ยืดปลายเท่าผิวถนนเชื่อม (paveLink) ให้ขอบเรียงกันพอดี
      const ax=a.x-ex, az=a.z-ez, bx=b.x+ex, bz=b.z+ez, pux=-uz, puz=ux;
      const strip=(arr,d0,d1,sgn)=>{ const e0=sgn>0?d1:-d0, e1=sgn>0?d0:-d1;   // ฝั่ง +1 สลับ d0/d1 กัน back-face (บั๊กเดิมรอบ 182 — ดูโน้ตที่ strip ของถนนหลัก)
        const a0x=ax+pux*e0,a0z=az+puz*e0,b0x=bx+pux*e0,b0z=bz+puz*e0,a1x=ax+pux*e1,a1z=az+puz*e1,b1x=bx+pux*e1,b1z=bz+puz*e1;
        arr.push(a0x,a0z,b0x,b0z,b1x,b1z, a0x,a0z,b1x,b1z,a1x,a1z); };
      for(const sgn of [1,-1]){
        const off=LKR+BIKE_W+WALK_W;
        let wet=false; for(let s=0;s<=4&&!wet;s++){ const q=s/4; wet=wetAt(ax+(bx-ax)*q+pux*sgn*off, az+(bz-az)*q+puz*sgn*off); }
        if(wet) continue;                                      // ฝั่งนี้ล้นลงน้ำ — ไม่ปู
        strip(lkBike, LKR, LKR+BIKE_W, sgn);                   // เลนจักรยาน (ฟ้า)
        strip(lkEdge, LKR, LKR+LINE_W, sgn);                   // เส้นขาวขอบใน (ชิดถนน)
        strip(lkEdge, LKR+BIKE_W-LINE_W, LKR+BIKE_W, sgn);     // เส้นขาวขอบนอก (ชิดทางเท้า)
        strip(lkWalk, LKR+BIKE_W, LKR+BIKE_W+WALK_W, sgn);     // ทางเท้า
      }
    }
    if(lkWalk.length) sc.add(new THREE.Mesh(flatGeomUV(lkWalk,.028,3.2), walkMat));                                  // ทางเท้า (ต่ำสุด)
    if(lkBike.length) sc.add(new THREE.Mesh(flatGeom(lkBike,.033),new THREE.MeshLambertMaterial({color:0x2f7fd0})));  // เลนฟ้า
    if(lkEdge.length) sc.add(new THREE.Mesh(flatGeom(lkEdge,.045),new THREE.MeshBasicMaterial({color:0xf2f2f2})));    // ขอบขาว
    if(lkDash.length) sc.add(new THREE.Mesh(flatGeom(lkDash,.075),new THREE.MeshBasicMaterial({color:0xd8d8d2})));    // เส้นประกลางถนน

    /* 🚸🛑 รอบ 800 (ผู้ใช้: "วาดทางม้าลาย+ป้ายหยุดตรงจุดบรรจบทั้ง 7 จุด") — ปลายแรกของ poly (poly[0]) = จุดบรรจบถนนหลัก
       ทางม้าลาย: แถบขาวตัดขวางถนนเชื่อม ใช้สี/เลเยอร์ y เดียวกับขอบขาวเลนจักรยานด้านบน (0xf2f2f2 @ y=.045) ผ่าน flatGeom เดิม
       ป้ายหยุด: ทรงกลม (เดียวกับ Sprite ป้ายชื่อ blkNameSprite) ยืนบนเสาข้างถนน หาจุดว่างด้วย navBlockedAt+grid สูตรเดียวกับ freeCell/buildTrafficLights */
    const CROSS_STRIPE=0.5, CROSS_GAP=0.45, CROSS_N=5, CROSS_MARGIN=0.6, CROSS_START=0.3;   // ระยะ/จำนวนแถบทางม้าลาย
    const crossTris=[];
    let signSprMat=null;
    const mkStopSignTex=()=>{                                  // ป้ายหยุดแปดเหลี่ยมแดง-ขาว (canvas เดียวกับเทคนิค blkNameSprite)
      const cv=document.createElement('canvas'); cv.width=128; cv.height=128;
      const c=cv.getContext('2d'), R=60, cx=64, cy=64, cut=R*0.414;
      c.beginPath();
      c.moveTo(cx-cut,cy-R); c.lineTo(cx+cut,cy-R); c.lineTo(cx+R,cy-cut); c.lineTo(cx+R,cy+cut);
      c.lineTo(cx+cut,cy+R); c.lineTo(cx-cut,cy+R); c.lineTo(cx-R,cy+cut); c.lineTo(cx-R,cy-cut); c.closePath();
      c.fillStyle='#c0392b'; c.fill(); c.lineWidth=6; c.strokeStyle='#fff'; c.stroke();
      c.fillStyle='#fff'; c.textAlign='center'; c.textBaseline='middle';
      c.font='bold 30px Arial'; c.fillText('STOP',cx,cy-12);
      c.font='bold 22px Arial'; c.fillText('หยุด',cx,cy+18);
      return new THREE.CanvasTexture(cv);
    };
    const signFree=(x,z)=>{                                    // จุดว่างข้างถนน (ไม่ใช่ถนน/น้ำ/ตึก) — สูตรเดียวกับ freeCell ด้านบน
      const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
      if(gx<0||gz<0||gx>=GW||gz>=GW || grid[gz*GW+gx]===2) return false;
      return grid[gz*GW+gx]===0 && !navBlockedAt(x,z);
    };
    for(const lg of linkLog){
      if(lg.poly.length<2) continue;
      const a=lg.poly[0], b=lg.poly[1];
      const dx=b.x-a.x, dz=b.z-a.z, L=Math.hypot(dx,dz)||1e-6, ux=dx/L, uz=dz/L, nx=-uz, nz=ux;
      const half=Math.max(0.5, LINK_W/2-CROSS_MARGIN);         // กว้างเท่าผิวถนนเชื่อม เว้นขอบทั้งสองฝั่ง
      for(let s=0;s<CROSS_N;s++){                              // แถบขาวสลับช่องว่างตัดขวางถนน (ยาวตามขวาง=half*2 · หนา=CROSS_STRIPE ตามแนวถนน)
        const t0=CROSS_START+s*(CROSS_STRIPE+CROSS_GAP), t1=t0+CROSS_STRIPE;
        const ax0=a.x+ux*t0, az0=a.z+uz*t0, ax1=a.x+ux*t1, az1=a.z+uz*t1;
        crossTris.push(ax0+nx*half,az0+nz*half, ax1+nx*half,az1+nz*half, ax1-nx*half,az1-nz*half,
                       ax0+nx*half,az0+nz*half, ax1-nx*half,az1-nz*half, ax0-nx*half,az0-nz*half);
      }
      let px=null, pz=null;                                    // หาจุดปักเสาป้ายหยุด: กวาดข้างถนนทั้งสองฝั่งจากใกล้ไปไกล
      // ⚠️ วัดจริงพบ 4/7 จุดอยู่ติดถนนหลักที่กว้างกว่าถนนเชื่อมมาก — ต้องกวาดไกลถึง ~32ม. ถึงพ้นผิวถนนหลัก (แคบกว่านี้หาไม่เจอ ป้ายหาย 4 จุด)
      for(let off=LINK_W/2+2; off<=40 && !px; off+=2)
        for(const sgn of [1,-1]){
          const qx=a.x+nx*off*sgn, qz=a.z+nz*off*sgn;
          if(signFree(qx,qz)){ px=qx; pz=qz; break; }
        }
      if(px==null) continue;                                  // โดนล้อมสนิทจริง — ข้ามป้าย (ทางม้าลาย/ถนนยังปกติ)
      if(!signSprMat) signSprMat=new THREE.SpriteMaterial({map:mkStopSignTex(),transparent:true});
      const poleG=new THREE.CylinderGeometry(.07,.09,2.3,8);
      const pole=new THREE.Mesh(poleG,new THREE.MeshLambertMaterial({color:0x8a8f94}));
      pole.position.set(px,1.15,pz); sc.add(pole);
      const spr=new THREE.Sprite(signSprMat); spr.scale.set(1.1,1.1,1); spr.position.set(px,2.65,pz);
      sc.add(spr);
    }
    if(crossTris.length) sc.add(new THREE.Mesh(flatGeom(crossTris,.045),new THREE.MeshBasicMaterial({color:0xf2f2f2})));

    recomp();                                                  // ก้อนใหม่หลังเชื่อม (เกาะควรถูกดูดเข้าก้อนหลัก)
  }

  /* คัดจุดเกิดตัวอักษร: ต้องอยู่ในก้อนหลัก + ในรัศมีที่รถขับไปถึงได้ (หนีบที่ rad-25 → เผื่อ 60) */
  const REACH_R=RX-60, keptPts=[];
  for(let i=0;i<roadPts.length;i+=2){
    const x=roadPts[i], z=roadPts[i+1];
    if(Math.hypot(x,z)>REACH_R) continue;
    const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx<0||gz<0||gx>=GW||gz>=GW) continue;
    let ok=ncomp[gz*GW+gx]===nmain;
    if(!ok) for(const d of NDIR){                              // เผื่อจุดตกร่องขอบช่อง — ดูช่องข้างเคียง 1 ช่อง
      const nx=gx+d[0], nz=gz+d[1];
      if(nx>=0&&nz>=0&&nx<GW&&nz<GW&&ncomp[nz*GW+nx]===nmain){ ok=true; break; }
    }
    if(ok) keptPts.push(x,z);
  }
  if(keptPts.length>=200){ roadPts.length=0; for(const v of keptPts) roadPts.push(v); }   // กันพลาด: เหลือน้อยผิดปกติ = ใช้ของเดิม

  /* ============================================================
     🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
     จนเจอพื้นที่ว่าง (นอกถนน/ไม่ชนตึก/ไม่ใช่น้ำ) ไว้ให้ตัวอักษร+เหรียญโบนัสไปโผล่บนหญ้าได้
     (เตรียมไว้สำหรับต่อยอด: เฮลิคอปเตอร์ลงจอดเก็บตัวอักษรบนพื้นที่สีเขียวนี้ในอนาคต)
     🩹 รอบ 831 (ผู้ใช้สั่ง): เดิมเช็กระยะห่างตึกแค่ NAV_CLR (~1.55ม. ระยะรถ) ตัวอักษรจึงลอยติดตึกได้
     (มองจากฟ้าเห็นชัดว่า "อยู่ใกล้ตึก") → เพิ่ม pad ให้ต้องห่างตึกจริงถึงจะเรียกว่า "พื้นที่โล่ง"
     ⚠️ ห้ามใช้ navBlockedAt ตรงๆ กับ pad ก้อนใหญ่นี้ — มันเช็กแค่ cell เดียว (SCELL=42ม.) พอสำหรับ
     รัศมีรถ 1.55ม. แต่ 15.55ม. ข้าม cell ได้ง่าย ทำให้ "มองไม่เห็น" ตึกที่อยู่ cell ข้างๆ (วัดจริงพลาด
     573/10,633 จุด — บางจุดห่างตึกแค่ 2.5ม.) → เขียนตัวเช็กแยกที่กวาด cell ข้างเคียงด้วย */
  const GREEN_BLDG_CLR=14;   // เมตร — ต้องห่างขอบตึกอย่างน้อยเท่านี้ถึงนับเป็นจุดโล่งวางตัวอักษรได้
  const greenBuildingClear=(x,z,R)=>{
    const cx=Math.floor(x/SCELL), cz=Math.floor(z/SCELL);
    for(let ox=-1;ox<=1;ox++) for(let oz=-1;oz<=1;oz++){
      const list=solidGrid[(cx+ox)+','+(cz+oz)]; if(!list) continue;
      for(const s of list){
        if(s.t===2){ if(Math.hypot(x-s.x,z-s.z)<s.r+R) return false; }
        else if(s.t===0){
          const c=Math.cos(s.rot), si=Math.sin(s.rot), dx=x-s.x, dz=z-s.z;
          if(Math.abs(dx*c-dz*si)<s.hx+R && Math.abs(dx*si+dz*c)<s.hz+R) return false;
        }else{
          const dx=s.x2-s.x1, dz=s.z2-s.z1, L2=dx*dx+dz*dz||1e-9;
          let t=((x-s.x1)*dx+(z-s.z1)*dz)/L2; t=t<0?0:(t>1?1:t);
          if(Math.hypot(x-s.x1-dx*t, z-s.z1-dz*t)<R) return false;
        }
      }
    }
    return true;
  };
  const greenFree=(x,z)=>{
    const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx<0||gz<0||gx>=GW||gz>=GW || grid[gz*GW+gx]===2) return false;
    return grid[gz*GW+gx]===0 && greenBuildingClear(x,z,NAV_CLR+GREEN_BLDG_CLR);
  };
  const greenPts=[];
  for(let i=0;i<roadPts.length;i+=2){
    const x=roadPts[i], z=roadPts[i+1];
    for(let tries=0;tries<14;tries++){                              // 🩹 รอบ 831: tries 8→14 + ค้นไกลขึ้น ชดเชย pad ตึกที่เข้มขึ้น
      const ang=Math.random()*Math.PI*2, dist=9+Math.random()*31;   // 9-40 ม. จากถนน = พ้นทางเท้า เข้าเขตหญ้า/ที่โล่งจริง
      const gx=x+Math.cos(ang)*dist, gz=z+Math.sin(ang)*dist;
      if(greenFree(gx,gz)){ greenPts.push(gx,gz); break; }
    }
  }

  worlds.drive={scene:sc, trees:[], buildings:[],
    d:{grid,ngrid,ncost,ncomp,nmain,GS,GW,GOFF,solidGrid,SCELL,roadPts,greenPts,nameSegs,spawn,rad:RX,links:linkLog}};   // ngrid = กริดนำทาง GPS (รอบ 284) · ncost/ncomp = รอบ 782 · links = ถนนเชื่อมเกาะ รอบ 788 · greenPts = พื้นที่สีเขียวข้างถนน รอบ 811
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
   🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
   (ผู้ใช้สั่ง 2 ข้อ: ① ทำระบบเฮลิฯ ลงจอดเก็บตัวอักษรบน greenPts ที่เตรียมไว้รอบ 811
                     ② ปุ่มเข้าโลกเฮลิฯ ต้องมีหน้าเลือกแผนที่เหมือนโลกขับรถ)
   วิธี: ไม่สร้างโหมดใหม่ (M.heli คุมโค้ดอยู่ ~40 จุด) — ใช้ "แผนที่ย่อย" ของโหมด heli แทน
     heliMap='city' = เมืองเฮลิฯ เดิม (ตัวอักษรบนดาดฟ้า · มีเฟสเดินเท้า/ลิฟต์/วิงสูท)
     heliMap='kpp'  = ยืมฉาก worlds.drive ทั้งก้อน (ถนน/ตึก/แม่น้ำจริง) แล้วขึ้นบินเลยตั้งแต่แรกเข้า
   ⚠️ ฉาก drive ไม่มี buildings[] (รถชนด้วย solidGrid) → เฮลิฯ ต้องเช็กชนจาก solidGrid เอง
      แต่ต้องมี "ความสูง" ด้วยไม่งั้นบินสูงแค่ไหนก็ยังชน → ติด h ให้ solid ทุกชิ้นตอนสร้างเมือง (ดูด้านบน)
   ============================================================ */
let heliMap='city';                          // 'city' | 'kpp' — ตั้งครั้งเดียวตอน start('heli',{map})
const heliKpp=()=>!!(M&&M.heli&&heliMap==='kpp');
const HELI_BODY_R=3.0;                       // รัศมีตัวเครื่อง (Bell 212 ลำจริง ~2.6 + เผื่อใบพัด)
const HELI_KPP_CEIL=170;                     // เพดานบินเมืองจริง (สูงพอมองเห็นผังเมืองทั้งย่าน)
/* เฮลิฯ ชนอะไรอยู่ไหมที่ (x,z) ระดับความสูง y — เลขคณิตชุดเดียวกับ collideCar แต่ข้ามชิ้นที่ "บินพ้นยอดแล้ว" */
function heliKppBlocked(x,z,y){
  const D=worlds.drive&&worlds.drive.d; if(!D) return false;
  const list=D.solidGrid[Math.floor(x/D.SCELL)+','+Math.floor(z/D.SCELL)];
  if(!list) return false;
  for(const s of list){
    if(y>=(s.h||0)) continue;                                  // บินสูงกว่ายอดชิ้นนี้ = ผ่านได้
    if(s.t===2){ if(Math.hypot(x-s.x,z-s.z)<s.r+HELI_BODY_R) return true; }
    else if(s.t===0){
      const c=Math.cos(s.rot), si=Math.sin(s.rot), dx=x-s.x, dz=z-s.z;
      if(Math.abs(dx*c-dz*si)<s.hx+HELI_BODY_R && Math.abs(dx*si+dz*c)<s.hz+HELI_BODY_R) return true;
    }else{
      const dx=s.x2-s.x1, dz=s.z2-s.z1, L2=dx*dx+dz*dz||1e-9;
      let t=((x-s.x1)*dx+(z-s.z1)*dz)/L2; t=t<0?0:(t>1?1:t);
      if(Math.hypot(x-s.x1-dx*t, z-s.z1-dz*t)<HELI_BODY_R) return true;
    }
  }
  return false;
}
/* จุดเกิด/จุดเกิดใหม่ของเฮลิฯ ในเมืองกำแพงเพชร — พื้นที่สีเขียวที่ "โล่งพอให้ลำลงจอดได้จริง" ใกล้หอนาฬิกาสุด
   (ลานกลางวงเวียน (0,0) เป็นเกาะหอนาฬิกา ลงจอดไม่ได้ · จุดเกิดของรถอยู่กลางถนน ใบพัดเฉี่ยวตึกแถว) */
let _heliKppSpawn=null;
function heliKppSpawn(){
  if(_heliKppSpawn) return _heliKppSpawn;
  const D=worlds.drive&&worlds.drive.d;
  if(!D) return {x:0,z:60,yaw:0};
  const G=D.greenPts||[];
  let best=null, bestD=1e9;
  for(let i=0;i<G.length;i+=2){
    const x=G[i], z=G[i+1], d=Math.hypot(x,z);
    if(d<25 || d>=bestD) continue;                             // เว้นเกาะวงเวียน · เอาที่ใกล้ใจกลางเมืองสุด
    if(heliKppBlocked(x,z,0.5)) continue;                      // ต้องโล่งจริงระดับพื้น (เผื่อรัศมีลำ)
    best={x,z,yaw:Math.atan2(-x,-z)}; bestD=d;                 // หันหน้าเข้าหอนาฬิกา — เห็นแลนด์มาร์กตั้งแต่เฟรมแรก
  }
  _heliKppSpawn=best||{x:D.spawn.x,z:D.spawn.z,yaw:D.spawn.yaw||0};
  return _heliKppSpawn;
}

/* ============================================================
   🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
   วางไฟล์ img/sky/<key>.jpg (หรือ .png) → เกน background เป็นภาพจริงทันที · ไม่มีไฟล์ = คงสีพื้นเดิม
   prompt ภาพใน PROMPTS_SKY.md — 5 แบบใช้ครอบ 7 โลก
   ============================================================ */
/* ⚠️ รอบ 694: ถอด haunt ออกจากตารางนี้ — โลกโรงแรมใช้ "ท้องฟ้าวาดเอง" (buildHauntSky ด้านล่าง)
   เพราะต้องหรี่/สว่างตามจังหวะไฟดับได้ ภาพ panorama นิ่ง ๆ ทำแบบนั้นไม่ได้ */
const SKY_IMG={ adv:'sky_day', heli:'sky_dawn', drone:'sky_storm', drive:'sky_dawn', soccer:'sky_day', mecha:'sky_alien' };
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
const imgTexPend={};                                   // key -> คิววัสดุที่รอภาพเดียวกันอยู่ (กันยิงซ้ำ)
function applyTex(mat,key,rx,ry,tint,pngFirst){        // tint = สีคูณทับภาพ (โลกกลางคืนใช้ภาพเดียวกันแต่หม่นลง) · pngFirst = ภาพที่ต้องมีพื้นโปร่ง (หน้าต่าง/ประตู)
  if(!mat||!key) return;
  rx=rx||1; ry=ry||1;
  const use=(m,img)=>{
    const t=new THREE.Texture(img); t.needsUpdate=true;
    t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(m.rx,m.ry);
    if(m.mat.map && m.mat.map.dispose) m.mat.map.dispose();
    m.mat.map=t; if(m.mat.color) m.mat.color.set(m.tint||0xffffff); m.mat.needsUpdate=true;
  };
  const c=imgTexCache[key];
  if(c==='none') return;
  const job={mat,rx,ry,tint};
  if(c){ use(job,c); return; }
  /* 🔁 รอบ 694: วัสดุหลายชิ้นขอ key เดียวกันพร้อมกัน (รูปในกรอบ 30 ใบ ใช้ภาพ 6 แบบ)
     เดิมจะยิง request ซ้ำใบละ 2 ครั้งก่อน cache จะทัน = 60 request → เข้าคิวรอภาพเดียวกันแทน */
  if(imgTexPend[key]){ imgTexPend[key].push(job); return; }
  imgTexPend[key]=[job];
  const done=(img)=>{
    imgTexCache[key]=img||'none';
    if(img) imgTexPend[key].forEach(j=>use(j,img));
    delete imgTexPend[key];
  };
  const ext1=pngFirst?'.png':'.jpg', ext2=pngFirst?'.jpg':'.png';
  const first=new Image();
  first.onload=()=>done(first);
  first.onerror=()=>{
    const second=new Image();
    second.onload=()=>done(second);
    second.onerror=()=>done(null);
    second.src='img/tex/'+key+ext2;
  };
  first.src='img/tex/'+key+ext1;
}
/* ============================================================
   🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
   ของเดิม = สีพื้นเรียบสีเดียว + จันทร์แผ่นกลมขาวใบเดียว (แบนมาก ไม่มีมิติ)
   ของใหม่ 5 ชั้นซ้อนกัน: ① โดมฟ้าไล่สี (ดำ→คราม→ม่วง→แดงหม่นที่ขอบฟ้า)
   ② ดาว 3 ชั้นกะพริบคนละจังหวะ ③ จันทร์เต็มดวงมีหลุมอุกกาบาต+รัศมีฟุ้ง
   ④ เมฆบางลอยผ่านหน้าจันทร์ ⑤ หมอกเลื้อยติดพื้นในสวน
   ⚠️ ทุกชิ้นบนฟ้าเป็น fog:false (ไม่งั้นตอนไฟดับ fog far=24 จะกลืนหายหมด) แล้วคุมความสว่าง
      เองด้วย opacity ใน tickHauntSky แทน — ไฟดับ = หรี่ฟ้าลง ไม่ให้สว่างทะลุหน้าต่างจนไม่มืด
   💰 ต้นทุน: draw call ~16 · ไม่มี PointLight เพิ่มเลย (มือถือไม่ตก FPS)
   ============================================================ */
/* 🔑 บทเรียนรอบนี้ (เสียเวลาหาอยู่นาน): รัศมีโดมต้อง ≤ (camera.far 220) − (ระยะไกลสุดที่ผู้เล่นเดินไปได้
   จากจุดกึ่งกลาง ≈ 85 ม. ที่มุมแผนที่) ไม่งั้นด้านไกลของโดม "เลย far plane" แล้วโดนตัดหาย
   → เห็นเป็น **จานดำกลม ๆ ลอยกลางฟ้า** (ตอนแรกนึกว่าสีไล่เพี้ยน แก้สีอยู่ 2 รอบก็ไม่หาย
   จนยิง raycast แล้วพบว่าโดนอยู่ที่ระยะ 246 ม. = เกิน far) */
const HSKY_R=132;                          // รัศมีโดมฟ้า (132 + 85 = 217 < far 220 ✔)
let hSky=null;                             // {dome,stars[],moon,halo,cloudGrp,mist[]}
function hskyTex(w,h,draw){
  const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
  draw(cv.getContext('2d'),cv);
  const t=new THREE.CanvasTexture(cv); t.needsUpdate=true; return t;
}
function buildHauntSky(sc){
  /* ① โดมไล่สี — sphere uv: v=1 คือกลางฟ้า, v=.5 คือเส้นขอบฟ้า
     → บนผืนผ้าใบ y=0 คือกลางฟ้า, y=ครึ่ง คือขอบฟ้า (ล่างกว่านั้นโดนพื้นบังอยู่แล้ว) */
  /* ⚠️ บทเรียนตอนเทสต์รอบนี้: อย่าให้ยอดฟ้า "ดำสนิท" แล้วไล่สีเร็ว — sphere uv ไล่ตามมุมเงย
     พอสีกระโดดในช่วงสั้น ๆ จะเห็นเป็น "จานดำกลม" ลอยอยู่กลางฟ้าชัดมาก (ภาพเทสต์แรกเป็นแบบนั้น)
     ต้องใช้ stop ถี่ ๆ และเริ่มที่น้ำเงินเข้ม (ไม่ใช่ดำ) จึงจะเนียนเป็นฟ้ากลางคืนจริง */
  const domeTex=hskyTex(8,512,c=>{
    const g=c.createLinearGradient(0,0,0,512);
    g.addColorStop(.00,'#070c1c');   // กลางฟ้า — น้ำเงินเข้มจัด (ดาวยังเด่น แต่ไม่เป็นรูโหว่ดำ)
    g.addColorStop(.10,'#080f24');
    g.addColorStop(.20,'#0b1430');
    g.addColorStop(.30,'#141c3e');
    g.addColorStop(.38,'#1f2249');   // คราม
    g.addColorStop(.44,'#2e2451');   // ม่วง
    g.addColorStop(.47,'#3a2742');
    g.addColorStop(.49,'#4b2b3a');   // แสงหม่นสีเลือดจาง ๆ ที่ขอบฟ้า (แค่พอเห็นเงาตึกตัดขอบ)
    g.addColorStop(.50,'#2a1a24');
    g.addColorStop(.52,'#0a0a12');
    g.addColorStop(1,'#05060e');     // ใต้ขอบฟ้า = สีเดียวกับหมอก (ไม่เห็นรอยต่อ)
    c.fillStyle=g; c.fillRect(0,0,8,512);
  });
  const dome=new THREE.Mesh(new THREE.SphereGeometry(HSKY_R,32,24),
    new THREE.MeshBasicMaterial({map:domeTex,side:THREE.BackSide,fog:false,
      transparent:true,opacity:1,depthWrite:false}));
  dome.renderOrder=-1; sc.add(dome);

  /* ② ดาว 3 ชั้น — คนละขนาด/ความสว่าง แล้วให้แต่ละชั้นหายใจคนละจังหวะ = เห็นเป็นดาวกะพริบ
     (PointsMaterial คุม opacity ต่อ "ชั้น" ไม่ได้ต่อดวง — 3 ชั้นก็พอหลอกตาแล้ว และถูกกว่าเชเดอร์เอง) */
  const starLayer=(n,size,col,op)=>{
    const pos=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      const a=Math.random()*Math.PI*2, y=Math.pow(Math.random(),.62);   // เกาะครึ่งบนฟ้าเป็นหลัก
      const r=Math.sqrt(Math.max(0,1-y*y));
      pos[i*3]=Math.cos(a)*r*HSKY_R*.96; pos[i*3+1]=y*HSKY_R*.9+8; pos[i*3+2]=Math.sin(a)*r*HSKY_R*.96;
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const p=new THREE.Points(g,new THREE.PointsMaterial({color:col,size,transparent:true,
      opacity:op,depthWrite:false,fog:false,sizeAttenuation:true}));
    sc.add(p);
    return {p,base:op,ph:Math.random()*6.28,sp:.45+Math.random()*.8};
  };
  const stars=[ starLayer(400,.95,0xdfe9ff,.85),   // ดาวเล็กเต็มฟ้า
                starLayer(240,1.55,0xffffff,.62),  // ดาวกลาง
                starLayer(110,2.3,0xcfe0ff,.44) ]; // ดาวดวงเด่น

  /* ③ พระจันทร์เต็มดวง — วาดหลุมอุกกาบาต + ขอบมืดให้ดูกลมเป็นลูก ไม่ใช่แผ่นกระดาษ */
  const moonTex=hskyTex(256,256,c=>{
    const g=c.createRadialGradient(104,96,8,128,128,126);
    g.addColorStop(0,'#fffdf0'); g.addColorStop(.55,'#f0e9d4');
    g.addColorStop(.86,'#cec6ab'); g.addColorStop(1,'#a49b85');
    c.beginPath(); c.arc(128,128,124,0,6.2832); c.fillStyle=g; c.fill();
    [[92,104,26],[152,86,15],[168,152,22],[102,168,18],[132,124,10],[74,146,11],[186,112,9],[120,70,8]]
      .forEach(([x,y,r])=>{
        const rg=c.createRadialGradient(x-r*.3,y-r*.3,r*.12,x,y,r);
        rg.addColorStop(0,'rgba(116,108,92,.44)'); rg.addColorStop(.7,'rgba(150,142,124,.22)');
        rg.addColorStop(1,'rgba(190,183,163,0)');
        c.fillStyle=rg; c.beginPath(); c.arc(x,y,r,0,6.2832); c.fill();
      });
    const lg=c.createRadialGradient(96,92,40,128,128,128);       // ขอบมืด (limb darkening)
    lg.addColorStop(0,'rgba(0,0,0,0)'); lg.addColorStop(1,'rgba(8,10,22,.52)');
    c.globalCompositeOperation='source-atop'; c.fillStyle=lg; c.fillRect(0,0,256,256);
    c.globalCompositeOperation='source-over';
  });
  const MD=new THREE.Vector3(-.46,.44,-.77).normalize();          // ทิศของดวงจันทร์
  const moonPos=MD.clone().multiplyScalar(HSKY_R*.87);
  const moon=new THREE.Mesh(new THREE.PlaneGeometry(26,26),
    new THREE.MeshBasicMaterial({map:moonTex,transparent:true,fog:false,depthWrite:false}));
  moon.position.copy(moonPos); moon.lookAt(0,EYE_H,0); sc.add(moon);
  const haloTex=hskyTex(128,128,c=>{
    const g=c.createRadialGradient(64,64,4,64,64,64);
    g.addColorStop(0,'rgba(210,226,255,.85)'); g.addColorStop(.30,'rgba(160,186,240,.30)');
    g.addColorStop(.62,'rgba(120,150,220,.10)'); g.addColorStop(1,'rgba(120,150,220,0)');
    c.fillStyle=g; c.fillRect(0,0,128,128);
  });
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(72,72),
    new THREE.MeshBasicMaterial({map:haloTex,transparent:true,fog:false,depthWrite:false,
      blending:THREE.AdditiveBlending,opacity:.34}));
  halo.position.copy(moonPos).multiplyScalar(.985); halo.lookAt(0,EYE_H,0); sc.add(halo);
  /* แสงจันทร์ต้องมาจาก "ทางเดียวกับดวงจันทร์จริง" ไม่งั้นเงาตึกทอดผิดข้างจนดูปลอม */
  if(hotelMoonL) hotelMoonL.position.copy(MD).multiplyScalar(90);

  /* ④ เมฆบางลอยผ่านหน้าจันทร์ — แขวนไว้ในกลุ่มเดียวแล้วหมุนกลุ่มช้า ๆ (ถูกกว่าขยับทีละก้อน)
     รัศมีน้อยกว่าจันทร์ → บางก้อนจะผ่าน "หน้า" ดวงจันทร์พอดี = จันทร์วูบมืดเป็นพัก ๆ */
  const cloudTex=hskyTex(256,128,c=>{
    for(let i=0;i<26;i++){
      const x=44+Math.random()*168, y=64+(Math.random()*2-1)*26, r=14+Math.random()*30;
      const g=c.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(14,16,30,.52)'); g.addColorStop(1,'rgba(14,16,30,0)');
      c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,6.2832); c.fill();
    }
  });
  const cloudGrp=new THREE.Group(); sc.add(cloudGrp);
  for(let i=0;i<6;i++){
    const a=Math.random()*Math.PI*2, rad=HSKY_R*.70, y=HSKY_R*(.26+Math.random()*.30);
    const cl=new THREE.Mesh(new THREE.PlaneGeometry(62+Math.random()*46,20+Math.random()*15),
      new THREE.MeshBasicMaterial({map:cloudTex,transparent:true,fog:false,depthWrite:false,
        opacity:.55+Math.random()*.3}));
    cl.position.set(Math.cos(a)*rad,y,Math.sin(a)*rad);
    cl.lookAt(0,y*.35,0); cloudGrp.add(cl);
  }

  /* ⑤ หมอกเลื้อยติดพื้นในสวนหน้าโรงแรม (อันนี้ "ให้โดนหมอกฉาก" ปกติ — มันอยู่ระดับพื้นจริง) */
  const mistTex=hskyTex(128,128,c=>{
    const g=c.createRadialGradient(64,64,6,64,64,62);
    g.addColorStop(0,'rgba(198,210,232,.55)'); g.addColorStop(.5,'rgba(176,190,220,.24)');
    g.addColorStop(1,'rgba(160,178,210,0)');
    c.fillStyle=g; c.fillRect(0,0,128,128);
  });
  /* แผ่นหมอกเป็นแผ่นนอน มองที่ระดับสายตาจะเห็นเฉียงมาก → ต้องแผ่นใหญ่+ซ้อนหลายชั้นถึงจะเห็นจริง
     (เทสต์รอบแรกวางแผ่นละ 22 ม. จาง .14 → มองจากพื้นแทบไม่เห็นอะไรเลย) */
  const mist=[];
  for(let i=0;i<11;i++){
    let x=0,z=0;
    for(let k=0;k<20;k++){                       // สุ่มจุดในสวน เลี่ยงตัวตึก
      const a=Math.random()*Math.PI*2, d=20+Math.random()*32;
      x=Math.cos(a)*d; z=Math.sin(a)*d;
      if(!HOTEL3D.insideHotel(x,z)) break;
    }
    const m=new THREE.Mesh(new THREE.PlaneGeometry(34,34),
      new THREE.MeshBasicMaterial({map:mistTex,transparent:true,opacity:.24,depthWrite:false}));
    m.rotation.x=-Math.PI/2; m.rotation.z=Math.random()*6.28;
    /* ⚠️ ต้องต่ำกว่าระดับตา (1.6 ม.) เสมอ — เทสต์แล้วถ้าแผ่นหมอกอยู่ระดับตาพอดี
       จะเห็นเป็น "แผ่นเทาทึบพาดเต็มจอ" (มองแผ่นบางจากด้านข้าง) */
    m.position.set(x,.25+Math.random()*.55,z); sc.add(m); mist.push(m);
  }

  hSky={dome,stars,moon,halo,cloudGrp,mist};
}
/* หายใจ/ลอย/หรี่ตอนไฟดับ — เรียกทุกเฟรมจาก tickHotelWorld */
function tickHauntSky(dt,now){
  if(!hSky) return;
  const k=blackedOut?.5:1, t=now*.001;
  for(let i=0;i<hSky.stars.length;i++){
    const s=hSky.stars[i];
    s.p.material.opacity=s.base*k*(.70+.30*Math.sin(t*s.sp+s.ph));
  }
  hSky.halo.material.opacity=(.30+.06*Math.sin(t*.6))*k;
  hSky.moon.material.opacity=blackedOut?.62:1;
  hSky.dome.material.opacity=blackedOut?.55:1;
  hSky.cloudGrp.rotation.y+=dt*.0042;
  for(let i=0;i<hSky.mist.length;i++){
    const m=hSky.mist[i];
    m.rotation.z+=dt*(.02+i*.005);
    m.material.opacity=(.20+.07*Math.sin(t*.28+i))*k;
  }
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
    /* 🏨 รอบ 684: โลกผีสิง = โรงแรม 5 ชั้น (ตัวตึกอยู่ js/hotel3d.js) — แสงเก็บ ref ไว้หรี่ตอนไฟดับ */
    hotelHemi=new THREE.HemisphereLight(0x9db4ff,0x1a2418,.72); sc.add(hotelHemi);
    hotelMoonL=new THREE.DirectionalLight(0xcfe0ff,.55); hotelMoonL.position.set(40,50,30); sc.add(hotelMoonL);
    /* 💡 แสงในอาคารตอนไฟยังติด — โคมไฟในตึกเป็นแค่ material เรืองแสง (ไม่ใช่ดวงไฟจริง เพราะ PointLight
       หลายสิบดวงมือถือไม่ไหว) จึงใช้ ambient อุ่น ๆ แทน "แสงจากโคมทั้งตึก" แล้วดับพร้อมกันตอนไฟดับ */
    hotelAmb=new THREE.AmbientLight(0xffe3bb,.62); sc.add(hotelAmb);
    buildHauntSky(sc);          // 🌌 รอบ 694: ฟ้าไล่สี+ดาว+จันทร์+เมฆ+หมอก (แทนจันทร์แผ่นแบนใบเดิม)
  }
  // (โหมด heli ใส่แสงของตัวเองในบล็อกเมืองด้านล่าง)

  /* 🩹 รอบ 764: พื้นแผ่นนี้อยู่ y=0 พอดีกับ "ผิวบนสุด" ของหลายชิ้นที่วางแนบพื้น
     (ลานหินหน้าประตูโรงแรม `accBox(A.stone,BX+1.6,-.1,...)` ผิวบน = 0 เป๊ะ · พื้นล็อบบี้ floorY(0)=0)
     → ระนาบซ้อนกันสนิท = z-fighting เห็นเป็นพื้นสีเทากระพริบสลับกับภาพ texture
     แก้ที่ต้นทางชั้นเดียว: ดัน "พื้น" ให้ถอยหลังในสมุดความลึกเล็กน้อย (polygonOffset)
     → ของที่วางแนบพื้นชนะเสมอ ไม่ต้องขยับ geometry ทีละชิ้น (ไม่เกิดช่องลอยใต้พุ่มไม้/รั้ว) */
  const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(HALF*2+20,HALF*2+20),
    new THREE.MeshLambertMaterial({color:cfg.ground,
      polygonOffset:true, polygonOffsetFactor:1, polygonOffsetUnits:1}));
  ground.rotation.x=-Math.PI/2; sc.add(ground);
  // 🧱 พื้นภาพจริงในโลกเมือง (โดรนใส่ในบล็อกตัวเอง) · โลกผีใช้ภาพเดียวกันแต่ tint หม่นให้เข้ากับกลางคืน
  if(md==='heli') applyTex(ground.material,'tex_ground',26,26);
  /* 🌑 รอบ 694: หม่นลงอีกจาก 0x7d8490 — พื้นสว่างโพลนทำให้สวนกลางคืนดูเหมือนกลางวัน
     (ทั้งที่ฟ้ามืด) เป็นอีกต้นเหตุที่ผู้ใช้บอกว่า "ข้างนอกไม่น่ากลัว" */
  else if(md==='haunt') applyTex(ground.material,'tex_ground',20,20,0x4d525c);

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
    // 🏢 รอบ 375: ดาดฟ้าพื้นทึบ (ผู้ใช้แจ้ง "ดาดฟ้าเป็นหน้าต่าง") — เดิม facade ห่อทั้งกล่องรวมด้านบน
    //    แยก material ด้านบน/ล่างเป็นคอนกรีตทึบ (มี tex_concrete ใช้ภาพ ไม่มีใช้สีเทา)
    const roofM=new THREE.MeshLambertMaterial({color:0x565b63});
    applyTex(roofM,'tex_concrete',2,2);
    for(let gx=-2;gx<=2;gx++) for(let gz=-2;gz<=2;gz++){
      if(gx===0 && gz===0) continue;                    // ลานกลาง = จุดเกิด/สนามบินหลัก
      if(rnd()<.22) continue;                           // เว้นช่องว่างให้เมืองโปร่ง
      const x=gx*24 + (rnd()*4-2);
      const z=gz*24 + (rnd()*4-2);
      const w=9+rnd()*4, d=9+rnd()*4, h=8+rnd()*20;
      const tn=Math.floor(rnd()*6)+1;                   // 1 rnd() ต่อตึก (เท่าเดิม → ผังเมือง seed คงเดิมเป๊ะ)
      const facade=buildingFacadeTexture(tn);
      // 🪟 รอบ 379: 1 แถวหน้าต่าง = 1 ชั้นจริง ~3ม. (ผู้ใช้ทัก "2 บาน = 1 ชั้น ขัดความจริง")
      //    ภาพ facade แต่ละแบบมีจำนวนชั้นใน tile ไม่เท่ากัน (นับจากภาพจริง) → repeat.y = ชั้นทั้งตึก/ชั้นต่อ tile
      //    floors เป็นจำนวนเต็ม = ขอบบนตึกตัดตรงรอยต่อชั้นพอดี ไม่หั่นกลางหน้าต่าง
      const rows=FACADE_ROWS[tn]||5, floors=Math.max(2,Math.round(h/3));
      facade.repeat.set(Math.max(1,Math.round(w/8)), floors/rows);
      const wallM=new THREE.MeshLambertMaterial({map:facade});
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),
        [wallM,wallM,roofM,roofM,wallM,wallM]);          // ลำดับหน้า box: +x,-x,บน,ล่าง,+z,-z
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
      if(n%4===1) glow.userData.ph=n*2.1;               // ✨ รอบ 361: ป้าย 1/5/9 กะพริบหายใจ คนละเฟส (adGlowPulse)
      adGlows.push(glow);
      sc.add(panel);
      ads.push({n, x:b.x, z:b.z, h:b.h});
    });
    adsFetch();                                       // 🪧 รอบ 362: โหลดผู้เช่าป้ายจาก DB (ไม่ออนไลน์=ข้ามเงียบ)
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
    // ⚽🎨 รอบ 396 PES-look: หญ้าลายตัด(ชั้นล่าง)+เส้นสนามคม(ชั้นบนโปร่ง) · ประตูตาข่ายอุ้มบอล ·
    //    อัฒจันทร์ 2 ชั้นมีหลังคา · สปอตไลต์ 4 มุม · ป้าย LED ริมสนาม · เงาบอล
    // 🌿 รอบ 410: ลดไฟลง (เดิม 1.05 ทำให้หญ้าเรืองแสงเป็นเขียวนีออน) + เพิ่มคอนทราสต์แดดให้มีมิติแบบภาพตัวอย่าง
    sc.add(new THREE.HemisphereLight(0xffffff,0x4f8f43,.80));
    const sun=new THREE.DirectionalLight(0xfff4d0,.95); sun.position.set(24,55,32); sc.add(sun);
    const fill=new THREE.DirectionalLight(0xdfe8ff,.20); fill.position.set(-30,40,-20); sc.add(fill);
    const fieldW=88, fieldL=128;               // 🏟️ รอบ 928: สนามใหญ่ขึ้น 2 เท่า (เดิม 44×64)
    // 🌿 รอบ 403: Phong + normal map = แสงจับใบหญ้าเป็นร่องเงา (เดิม Lambert เรียบแบนเหมือนกระดาษ)
    // 🌿 รอบ 410: ใช้ soccerTurfTexture (ภาพจริงรีดแถบออก+ลดสีจัด ปูถี่ 24×30) แทน applyTex ที่ปูแค่ 3×2
    const grassM=new THREE.MeshPhongMaterial({map:soccerTurfTexture(),normalMap:grassNormalTexture(),
      shininess:3, specular:0x16240f});
    grassM.normalScale=new THREE.Vector2(.85,.85);
    const grass=new THREE.Mesh(new THREE.PlaneGeometry(fieldW+26,fieldL+26),grassM);
    grass.rotation.x=-Math.PI/2; grass.position.y=.02; sc.add(grass);
    /* 🌱 รอบ 409 (ผู้ใช้สั่งถอด): เคยมีกอหญ้า 3D (รอบ 403) + ใบหญ้าเส้นตั้ง 220,000 ต้น (รอบ 406-408)
       ถอดออกหมดแล้ว — ยังไม่สวยสมบูรณ์ และวัดผลกระทบความลื่นไหลบนมือถือจริงไม่ได้ ไม่คุ้มความเสี่ยง
       เหลือ "ภาพสนามหญ้า" ล้วน: เทกซ์เจอร์ + normal map (แสงจับผิวหญ้า ไม่เพิ่ม geometry เลย) */
    const lines=new THREE.Mesh(new THREE.PlaneGeometry(fieldW,fieldL),
      new THREE.MeshBasicMaterial({map:soccerLinesTexture(),transparent:true,depthWrite:false}));
    lines.rotation.x=-Math.PI/2; lines.position.y=.035; sc.add(lines);
    buildSoccerGoal(sc, GOAL_Z, GOAL_HW*2, GOAL_H);
    buildStands(sc, fieldW, fieldL);
    soccerLedBoards(sc, fieldW, fieldL);
    const ballM=soccerBallMat();
    soccerBall=new THREE.Mesh(new THREE.SphereGeometry(BALL_R,24,18), ballM);
    soccerBall.position.set(0,BALL_R,PLAYER_Z); sc.add(soccerBall);
    applyTex(ballM,'soccer_ball',1,1);                         // 📷 ภาพลายบอลจริง img/tex/soccer_ball.jpg ทับได้
    sbShadow=new THREE.Mesh(new THREE.CircleGeometry(BALL_R*1.2,18),
      new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.34,depthWrite:false}));
    sbShadow.rotation.x=-Math.PI/2; sbShadow.position.set(0,.045,PLAYER_Z); sc.add(sbShadow);
    buildGuideRibbon(sc);                      // 🎀 รอบ 401: เส้นไกด์ริบบิ้นแบนกว้าง (แทนจุดกลมเล็ก 14 จุดเดิม)
    buildLandRing(sc);                         // 🎯 รอบ 402: วงบอกจุดตกลูก
    buildAura(sc); buildDrill(sc);             // ⚡ รอบ 412: ออร่ารอบตัว + ลำแสงควงสว่าน
    buildBallFX(sc);                           // 🔥💨 รอบ 852: ลูกไฟ (ชาร์จ ≥30%) + ควันหางมิสไซล์
    ringAds(sc, 6, 52, 0, null);               // 📢 ป้ายโฆษณาริมสนามฟุตบอล (soccer · รอบ 928: รัศมี 26→52 ตามสนาม 2 เท่า)
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
    /* ============================================================
       🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
       รอบตึกเป็นสวนหน้าโรงแรมยามวิกาล: ต้นไม้ตาย รั้วเตี้ย ทางเดินหิน
       ============================================================ */
    const hot=HOTEL3D.build(THREE,{ tex:applyTex, makeGhost:makeGhostSprite });
    sc.add(hot.grp);
    worlds[md]={scene:sc, trees:tr, hotel:hot};
    // ต้นไม้ตายกิ่งโกร๋นรอบตึก (เว้นตัวโรงแรม + ทางเดินหน้าประตู)
    const trunkM=new THREE.MeshLambertMaterial({color:0x2e2019});
    const trunkG=new THREE.CylinderGeometry(.22,.42,3.4,6);
    const branchG=new THREE.CylinderGeometry(.08,.16,1.8,5);
    const farFromHotel=(x,z)=>(x>HOTEL3D.BX+9 || x<HOTEL3D.WEST-6 || Math.abs(z)>HOTEL3D.BZ+6) &&
                              !(Math.abs(z)<5 && x>HOTEL3D.BX && x<HOTEL3D.BX+16);
    for(let i=0;i<30;i++){
      const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
      if(!farFromHotel(x,z)) continue;
      const t1=new THREE.Mesh(trunkG,trunkM); t1.position.set(x,1.7,z);
      const b1=new THREE.Mesh(branchG,trunkM);
      b1.position.set(x+.5,2.9,z); b1.rotation.z=-.8+Math.random()*.4;
      const b2=new THREE.Mesh(branchG,trunkM);
      b2.position.set(x-.5,2.5,z); b2.rotation.z=.8-Math.random()*.4;
      sc.add(t1,b1,b2); tr.push({x,z,r:.8});
    }
    // พุ่มไม้เตี้ยเรียงขนาบทางเดินเข้าโรงแรม (นำสายตาเด็กไปที่ประตูหน้า)
    const bushM=new THREE.MeshLambertMaterial({color:0x24361f});
    const bushG=new THREE.BoxGeometry(1.6,1.1,1.6);
    for(let i=0;i<7;i++){
      [-5.6,5.6].forEach(bz=>{
        const b=new THREE.Mesh(bushG,bushM);
        b.position.set(HOTEL3D.BX+7+i*2.6,.55,bz); sc.add(b);
        tr.push({x:b.position.x,z:bz,r:.9});
      });
    }
    return;                                   // โลกโรงแรมไม่ใช้ป้ายโฆษณารอบสนาม
  }
  ringAds(sc, 6, 44, 0, tr);                 // 📢 ป้าย "ติดต่อโฆษณา" รอบสนาม (adv)
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
/* 🌳🚁 รอบ 811: สุ่มจุดบนพื้นที่สีเขียวข้างถนนจริง ระยะ min–max จากผู้เล่น (โหมด drive)
   ใช้คู่กับ randRoadPos — สลับกันวางตัวอักษร/เหรียญโบนัส ให้กระจายทั้งบนถนนและบนหญ้าข้างทาง
   🩹 รอบ 816: เดิมสุ่ม 40 ครั้งไม่เข้าช่วงระยะแล้ว "ตกไปใช้จุดบนถนน" ทันที — วัดจริงในโลกเฮลิฯ
   ตกกลับ 18/55 จุด (33%) ตัวอักษรไปโผล่กลางถนนแทนหญ้า ซึ่งเฮลิฯ ลงจอดไม่ได้
   → เพิ่มขั้นกลาง: กวาดหาจุดสีเขียวในช่วงระยะทั้งหมดแล้วสุ่มจากนั้น (9,692 จุด ไม่กี่แสน op ไม่หนัก)
   ต่อด้วยจุดสีเขียวใดก็ได้ · ใช้ถนนเป็นทางออกสุดท้ายเฉพาะเมื่อไม่มี greenPts เลย */
function randGreenPos(minD,maxD){
  const D=worlds.drive&&worlds.drive.d;
  if(!D||!D.greenPts||!D.greenPts.length) return randRoadPos(minD,maxD);
  const pts=D.greenPts, n=pts.length/2, px=camera.position.x, pz=camera.position.z;
  for(let i=0;i<40;i++){                                    // ① สุ่มเร็ว (ส่วนใหญ่จบที่นี่)
    const j=Math.floor(Math.random()*n);
    const x=pts[j*2], z=pts[j*2+1];
    const d=Math.hypot(x-px,z-pz);
    if(d>=minD && d<=maxD) return {x,z};
  }
  const band=[];                                            // ② กวาดทั้งลิสต์ เอาทุกจุดที่อยู่ในช่วงระยะ
  for(let j=0;j<n;j++){
    const d=Math.hypot(pts[j*2]-px,pts[j*2+1]-pz);
    if(d>=minD && d<=maxD) band.push(j);
  }
  const j2=band.length?band[Math.floor(Math.random()*band.length)]   // ③ ไม่มีในช่วงเลย = เอาจุดเขียวใดก็ได้
                      :Math.floor(Math.random()*n);
  return {x:pts[j2*2], z:pts[j2*2+1]};
}
/* 🏨 สุ่มจุดวางตัวอักษรในโรงแรม — กระจายทุกชั้น แต่ให้ชั้นที่ผู้เล่นอยู่มีลุ้นเยอะกว่า
   🩹 รอบ 778 (ผู้ใช้สั่งข้อ 3+5): เดิมสุ่มจุดอิสระ → ตัวอักษรหลายตัวลงห้องเดียวกันและกองชิดกันเป็นก้อน
   ตอนนี้บังคับ 2 กติกา: **ห้องละไม่เกิน 2 ตัว** และ **ต้องห่างกันอย่างน้อย HOTEL_MIN_GAP เมตร** */
const HOTEL_PER_ROOM=2;          // ตัวอักษรสูงสุดต่อห้อง (ผู้ใช้สั่ง)
const HOTEL_MIN_GAP=3.4;         // ระยะห่างขั้นต่ำระหว่าง 2 ตัวที่อยู่ชั้นเดียวกัน (เมตร)
function hotelSpot(self){
  const sp=hotel.spots;
  if(!sp.length) return {x:0,y:0,z:0,room:''};
  const cnt={};                                       // นับตัวอักษรที่วางอยู่แล้วต่อห้อง (ไม่นับตัวที่กำลังย้ายเอง)
  letters.forEach(l=>{ if(l!==self && l.room) cnt[l.room]=(cnt[l.room]||0)+1; });
  const free=sp.filter(s=>(cnt[s.room]||0)<HOTEL_PER_ROOM);
  const all=free.length?free:sp;                      // เต็มทุกห้องจริง ๆ ค่อยยอมให้ล้น (ไม่ให้ตัวอักษรหาย)
  const near=all.filter(s=>Math.abs(s.y-HOTEL3D.floorY(HOTEL3D.floorOf(hFootY)))<.5);
  const pool=(near.length && Math.random()<.55)?near:all;
  const gap=p=>{                                      // ระยะถึงตัวอักษรที่ใกล้ที่สุดในชั้นเดียวกัน
    let d=1e9;
    for(let i=0;i<letters.length;i++){
      const l=letters[i]; if(l===self) continue;
      const lp=l.spr.position;
      if(Math.abs(lp.y-(p.y+1.15))>1.6) continue;     // คนละชั้น ไม่ต้องนับระยะ
      d=Math.min(d,Math.hypot(lp.x-p.x,lp.z-p.z));
    }
    return d;
  };
  for(let k=0;k<12;k++){                              // สุ่มก่อน — เจอจุดที่ห่างพอก็จบเลย (เร็ว + ตำแหน่งไม่ซ้ำซาก)
    const s=pool[Math.floor(Math.random()*pool.length)];
    const p={x:s.x+(Math.random()*2-1)*.5, y:s.y, z:s.z+(Math.random()*2-1)*.5, room:s.room};
    if(gap(p)>=HOTEL_MIN_GAP) return p;
  }
  /* สุ่มไม่เจอ (ห้องว่างเหลือน้อย/ตัวอักษรเยอะผิดปกติ) → ไล่ดูทุกจุดที่เหลือแล้วเลือกจุดที่ห่างที่สุด
     กันเคสเลวร้ายสุดคือ "กองติดกัน" ซึ่งเป็นอาการที่ผู้ใช้แจ้งมาพอดี (สุ่ม 12 ครั้งอย่างเดียวเคยเหลือคู่ห่าง 1.1 ม.) */
  let best=null,bestD=-1;
  for(let i=0;i<pool.length;i++){
    const s=pool[i], p={x:s.x,y:s.y,z:s.z,room:s.room}, d=gap(p);
    if(d>bestD){ bestD=d; best=p; }
  }
  return best||{x:0,y:0,z:0,room:''};
}
/* 🏨 รอบ 778 (ผู้ใช้สั่งข้อ 5): ในโรงแรมต้องมี "เฉพาะตัวอักษรของคำที่กำลังหาอยู่" (words[0]) เท่านั้น
   → เก็บกวาดตัวที่ไม่ใช่ของคำนี้ (คำเก่า/ตัวหลอก) ออกจากโลกก่อนเติมตัวที่ยังขาด */
function hotelPruneLetters(){
  const need={};
  if(words[0]) words[0].en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
  Object.keys(need).forEach(ch=>{ need[ch]=Math.max(0,need[ch]-(inv[ch]||0)); });  // ที่เก็บไว้ในมือแล้วไม่ต้องมีในโลก
  for(let i=letters.length-1;i>=0;i--){
    const ch=letters[i].ch;
    if((need[ch]||0)>0) need[ch]--; else removeLetter(i);
  }
}
function spawnLetter(ch){
  const isCoin=ch==='🪙';                         // 🪙 รอบ 811: เหรียญโบนัส (ไม่ใช่ตัวอักษรของคำ) ใช้เทกซ์เจอร์ emoji แทน
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:isCoin?emojiTexture('🪙'):letterTex(ch),transparent:true}));
  let hotelRoom='';
  if(M.drive){
    // โหมดขับรถ: ตัวอักษร/เหรียญลอยบนถนนจริง — ขับชนเพื่อเก็บ (ไม่ต้องจอด)
    // 🌳 รอบ 811: สุ่มครึ่งหนึ่งไปโผล่บนพื้นที่สีเขียวข้างถนนแทน ให้กระจายทั้งถนน+สนามหญ้า
    const p=Math.random()<.5?randGreenPos(60,450):randRoadPos(60,450);
    spr.position.set(p.x,1.7,p.z);
    spr.scale.set(3.4,3.4,1);                    // ใหญ่ มองเห็นแต่ไกลตอนขับ
  }else if(M.drone && buildings.length){
    // โหมดโดรน: ตัวอักษรซ่อนอยู่ในห้องต่างๆ ของตึกร้าง — บินลอดหน้าต่างเข้าไปเก็บ
    const b=buildings[Math.floor(Math.random()*buildings.length)];
    const r=b.rooms[Math.floor(Math.random()*b.rooms.length)];
    spr.position.set(r.x+(Math.random()*2-1), r.y, r.z+(Math.random()*2-1));
    spr.scale.set(1.8,1.8,1);
  }else if(heliKpp()){
    // 🚁🌳 รอบ 816: เฮลิฯ เหนือเมืองกำแพงเพชร — ตัวอักษรวางบน "พื้นที่สีเขียวข้างถนน" ต้องร่อนลงจอดเก็บ
    const p=randGreenPos(70,520);
    spr.position.set(p.x,1.4,p.z);
    spr.scale.set(3.4,3.4,1);                    // ใหญ่เท่าโหมดขับรถ — มองเห็นจากบนฟ้า
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
  }else if(M.hotel && hotel){
    // 🏨 ตัวอักษรซ่อนตามห้องพัก/ทางเดินของโรงแรม (สุ่มห้อง สุ่มชั้น — ข้อ 2 และ 9)
    const p=hotelSpot();
    spr.position.set(p.x,p.y+1.15,p.z);
    spr.scale.set(1.4,1.4,1);
    tintSprite(spr.material);              // เกิดตอนไฟดับแล้วก็ต้องหม่นเท่ากับตัวอื่น
    hotelRoom=p.room;                      // จำห้องไว้ใช้นับ "ห้องละ 2 ตัว" (รอบ 778)
  }else{
    const p=randPos(10);
    spr.position.set(p.x,1.15,p.z);
    spr.scale.set(1.5,1.5,1);
  }
  scene.add(spr);
  letters.push({ch,spr,born:performance.now(),baseY:spr.position.y,room:hotelRoom,bonus:isCoin});
}
function spawnLettersForWord(w){ w.en.split('').forEach(spawnLetter); }
/* เติมตัวอักษรที่ยังขาด (ผู้เล่นอาจใช้ตัวอักษรของคำ A ไปประกอบคำ B) */
function ensureCoverage(){
  /* 🏨 รอบ 778: โรงแรมผีสิงคุมเข้ม — เอาเฉพาะคำที่กำลังหาอยู่ (words[0]) และกวาดตัวที่ไม่เกี่ยวทิ้งก่อน */
  const tgtWords=M.hotel?words.slice(0,1):words;
  if(M.hotel) hotelPruneLetters();
  const worldCnt={}; letters.forEach(l=>worldCnt[l.ch]=(worldCnt[l.ch]||0)+1);
  const haveCnt=Object.assign({},inv);
  tgtWords.forEach(w=>{
    const need={}; w.en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
    Object.keys(need).forEach(ch=>{
      let miss=need[ch]-(haveCnt[ch]||0)-(worldCnt[ch]||0);
      const useFromInv=Math.min(need[ch],haveCnt[ch]||0);
      haveCnt[ch]=(haveCnt[ch]||0)-useFromInv;
      while(miss-->0 && letters.length<90){ spawnLetter(ch); worldCnt[ch]=(worldCnt[ch]||0)+1; }
    });
  });
}
/* ============================================================
   🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
   พื้นที่สีเขียวด้านข้างให้มากกว่านี้" (เตรียมรองรับเฮลิคอปเตอร์มาลงจอดเก็บบนพื้นที่สีเขียวในอนาคต)
   ของเดิม ensureCoverage() ปล่อยแค่ "พอดีคำที่ต้องใช้" (มักแค่ 1 ตัวอักษรต่อชนิด) กระจายในเมืองที่ใหญ่มาก
   จึงรู้สึกโล่ง — ฟังก์ชันนี้เพิ่มสำเนาตัวอักษรที่ต้องใช้อยู่แล้ว + เหรียญโบนัสล้วน (ไม่ผูกคำ)
   ============================================================ */
const DRIVE_LETTER_COPIES=3;      // แต่ละตัวอักษรที่ต้องใช้ ให้มีสำเนากระจายอยู่ในเมืองกี่จุด
const DRIVE_BONUS_COINS=24;       // จำนวนเหรียญโบนัสที่คงไว้ตลอดเวลาในโหมดขับรถ
function ensureDriveAmbience(){
  if(!M.drive) return;
  const need={};
  words.forEach(w=>w.en.split('').forEach(ch=>need[ch]=true));
  const worldCnt={}; let bonusCnt=0;
  letters.forEach(l=>{ if(l.bonus) bonusCnt++; else worldCnt[l.ch]=(worldCnt[l.ch]||0)+1; });
  Object.keys(need).forEach(ch=>{
    while((worldCnt[ch]||0)<DRIVE_LETTER_COPIES && letters.length<90){
      spawnLetter(ch); worldCnt[ch]=(worldCnt[ch]||0)+1;
    }
  });
  while(bonusCnt<DRIVE_BONUS_COINS && letters.length<90){ spawnLetter('🪙'); bonusCnt++; }
}
function removeLetter(i){
  const l=letters[i];
  scene.remove(l.spr); l.spr.material.dispose();
  letters.splice(i,1);
}
/* 🔠⏱️ รอบ 847 (ผู้ใช้สั่ง): ตัวอักษรที่ถูกเก็บแล้ว เกิดใหม่ "ที่จุดเดิมเป๊ะ" หลัง LETTER_RESPAWN_MS (ไม่ใช่จุดสุ่มใหม่)
   letterRespawns = คิวรอ [{ch,x,y,z,scale,room,at}] · เติมเข้าคิวตอนเก็บใน pickUpLetter() (ไม่ใช้กับ 🪙 เหรียญโบนัส — คนละระบบ ambient เดิม) */
let letterRespawns=[];
function spawnLetterAt(item){
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTex(item.ch),transparent:true}));
  spr.position.set(item.x,item.y,item.z);
  spr.scale.set(item.scale,item.scale,1);
  if(M.hotel) tintSprite(spr.material);          // ห้องมืด/ไฟดับ ต้องหม่นเท่าตัวอื่น (เหมือน spawnLetter)
  scene.add(spr);
  letters.push({ch:item.ch,spr,born:performance.now(),baseY:item.y,room:item.room,bonus:false});
}
function tickLetterRespawns(now){
  for(let i=letterRespawns.length-1;i>=0;i--){
    if(now>=letterRespawns[i].at){ spawnLetterAt(letterRespawns[i]); letterRespawns.splice(i,1); }
  }
}

/* ============================================================
   🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
   รวมขั้นตอนไว้ที่เดียว — ทุกโลก (เดิน/เฮลิฯ/โดรน/ขับรถ) เรียกฟังก์ชันนี้
   เดิมแต่ละโลกเขียนซ้ำกัน 4 ที่ ทำให้แก้ตกหล่นง่าย
   ============================================================ */
const LETTER_COIN=1;                         // เหรียญต่อตัวอักษร 1 ตัว
const BONUS_COIN_VAL=3;                      // 🪙 รอบ 811: เหรียญโบนัสข้างถนน/บนหญ้า ให้มากกว่าตัวอักษรธรรมดา (ไม่ผูกกับคำ)
function pickUpLetter(i){
  const l=letters[i], ch=l.ch;
  const at=l.spr.position.clone();            // เก็บตำแหน่งไว้ก่อนลบ (ไว้เด้งป้ายตรงจุดนั้น)
  if(l.bonus){                                // 🪙 รอบ 811: เหรียญโบนัสล้วน ๆ — ไม่เข้าคลังตัวอักษร ไม่นับคำ
    addCoins(BONUS_COIN_VAL);
    sessionCoins+=BONUS_COIN_VAL;
    removeLetter(i);
    letterPop(at,'🪙',BONUS_COIN_VAL);
    sfx.coin();
    renderHudTop();
    return;
  }
  inv[ch]=(inv[ch]||0)+1;
  addCoins(LETTER_COIN);
  sessionCoins+=LETTER_COIN;                  // ให้สรุปท้ายรอบตรงกับที่ได้จริง
  // 🔠⏱️ รอบ 847: จำจุดเดิมไว้ — อีก LETTER_RESPAWN_MS ค่อยเกิดใหม่ "ที่นี่" (ไม่ใช่จุดสุ่มใหม่)
  letterRespawns.push({ch,x:at.x,y:l.baseY,z:at.z,scale:l.spr.scale.x,room:l.room,at:performance.now()+LETTER_RESPAWN_MS});
  removeLetter(i);
  letterPop(at,ch);                           // 🅰️ ป้ายตัวอักษร +1🪙 เด้งตรงจุดที่เก็บ
  letterChime();                              // 🔔 เสียงเก็บตัวอักษร (คนละเสียงกับจบคำ)
  speakLetter(ch);                            // 🔠 อ่านชื่อตัวอักษร (เอ บี ซี)
  renderHudInv(); renderHudWords(); renderHudTop();   // renderHudTop = อัปเดตเลขเหรียญบนจอทันที
  tryCompleteWords();
}
/* ป้ายเด้ง "ตัวอักษร +1🪙" ที่ตำแหน่งตัวอักษรในโลก 3D — ch==='🪙' (เหรียญโบนัส รอบ811) โชว์แบบไม่มีตัวอักษรกำกับ */
function letterPop(worldPos,ch,amt){
  if(!coinPopEl || !camera) return;
  amt=amt||LETTER_COIN;
  const v=worldPos.clone().project(camera);
  const el=document.createElement('div');
  el.className='sc-pop letter-pop';
  el.innerHTML=ch==='🪙'?`🪙 +${amt}`:`<b>${ch.toUpperCase()}</b> +${amt}🪙`;
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
  /* 🏨 รอบ 778: โรงแรมมีตัวอักษรของ "คำที่กำลังหา" คำเดียว → ไม่ spawn ตามคำที่เพิ่งเติมท้ายคิว
     ปล่อยให้ ensureCoverage() กวาดของคำเก่าทิ้งแล้วเติมของคำใหม่ (words[0]) ให้เอง */
  else if(M.hotel){ fresh.forEach(nw=>words.push(nw)); ensureCoverage(); }
  else{ fresh.forEach(nw=>{ words.push(nw); spawnLettersForWord(nw); }); ensureCoverage(); }
  if(netUp()) sendPos(true);                  // 🤝 ดันคำเป้าหมายใหม่ให้ลูกทีมตามทันที (ไม่ต้องรอขยับตำแหน่ง)
  if(M.hotel) setTimeout(announceTarget,2800); // 🏨 ข้อ 14: ระบบบอกคำถัดไปที่ต้องประกอบ (รอ banner ฉลองคำเก่าจบก่อน)
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
        if(netUp()) sendPos(true);            // อัปเดตชื่อ+เข็มบนหัวทุกเครื่อง
      },2600);                              // รอ banner ฉลองคำจบก่อน
    }
  }
  saveState();
  if(netUp()) sendPos(true);                  // ประกาศคะแนนใหม่ขึ้นกระดานทุกเครื่องทันที
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
   👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
   กติกาเหล็ก: **ผีไม่ทำร้ายใครเลย** ไม่มีหัวใจ ไม่มีโดนจับ ไม่มีเกมโอเวอร์
   lurk   = แอบรออยู่ในห้องพัก (ข้อ 13) รอผู้เล่นเดินเข้ามาแล้วโผล่แว็บ ๆ
   peek   = โผล่ให้เห็น ~1.4 วิ แล้วจางหาย ไปรอห้องใหม่
   stalk  = โผล่ปลายทางเดิน เดินตามช้า ๆ แต่ **รักษาระยะ keepR ไว้เสมอ = ไม่มีวันตามทัน** (ข้อ 11)
   behind = วาร์ปไปยืนข้างหลังผู้เล่น + เสียง jump scare แล้วจางหายไป (ข้อ 10, 12)
   ============================================================ */
/* ============================================================
   🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
   ต้นฉบับ Tripo 54MB → ย่อด้วย `bash tools/lighten_glb.sh` เหลือ 510KB / 22.5k tris
   (ดูสูตรใน tools/lighten_glb.sh + handoff/NOTES.md "🪶 ลดขนาดโมเดล .glb")
   ⚠️ ไฟล์ผ่านขั้น unlit มาแล้ว (จำเป็นเพื่อให้ตัด NORMAL ทิ้งได้ ไม่งั้น simplify ตัน)
      → ที่นี่จึง **ทับ material เองเป็น Phong** ให้ไฟฉายส่องโดนแล้วสว่างขึ้นจริง
      + ใส่ emissive จาง ๆ ให้ยังเห็นเป็นเงาวิญญาณตอนมืดสนิท (ไม่งั้นผีหายไปเลยตอนไฟดับ)
   ไม่มีไฟล์/โหลดไม่ได้ = ถอยไปใช้ภาพ sprite ชุดเดิมอัตโนมัติ (เกมไม่พัง)
   ============================================================ */
const GHOST_GLB_URL='img/models/ghost_lite.glb';
const GHOST_MODEL_H=1.78;              // ความสูงตัวผีในโลกจริง (โมเดลสูง 1.0 หน่วย → scale ตรง ๆ)
let ghostGlbSrc=null, ghostGlbFail=false, ghostGlbCbs=[];
function ghostGlbEnsure(cb){
  if(ghostGlbSrc) return cb(ghostGlbSrc);
  if(ghostGlbFail) return cb(null);
  ghostGlbCbs.push(cb);
  if(ghostGlbCbs.length>1) return;
  const fin=g=>{ ghostGlbSrc=g||null; ghostGlbFail=!g; ghostGlbCbs.splice(0).forEach(f=>f(ghostGlbSrc)); };
  const load=()=>{ try{
    new THREE.GLTFLoader().load(GHOST_GLB_URL,gl=>{
      gl.scene.traverse(o=>{
        if(!o.isMesh) return;
        if(o.material&&o.material.map) o.material.map.encoding=THREE.LinearEncoding;
        /* 🔑 กับดักที่เสียเวลาหาอยู่นาน: ไฟล์นี้ถูก "ตัด NORMAL ทิ้ง" ตอนย่อขนาด (จำเป็น ไม่งั้น simplify ตัน)
           → พอเอามาใส่วัสดุที่ใช้แสง (Phong) ผีจะเป็นเงาดำทึบตลอด ปรับ color เท่าไรก็ไม่สว่างขึ้น
             เพราะไม่มี normal ให้คำนวณแสงเลย (เหลือแต่ ambient + emissive)
           → คำนวณ normal คืนตรงนี้ครั้งเดียว (geometry ใช้ร่วมทุกตัว) แล้วไฟฉายถึงส่องเห็นหน้าจริง */
        if(o.geometry && !o.geometry.attributes.normal) o.geometry.computeVertexNormals();
      });
      fin(gl.scene);
    },undefined,()=>fin(null));
  }catch(e){ fin(null); } };
  if(THREE.GLTFLoader) load();
  else{ const s=document.createElement('script'); s.src='js/vendor/GLTFLoader.js';
    s.onload=load; s.onerror=()=>fin(null); document.head.appendChild(s); }
}
/* ประกอบผี 1 ตัวจากโมเดลที่โหลดไว้ — geometry ใช้ร่วมกัน (clone แค่ node) แต่ material แยกตัว
   เพราะแต่ละตัวต้องจาง/ชัดคนละจังหวะ · คืน Group ที่ "เท้าอยู่ที่ y=0" วางบนพื้นได้ตรง ๆ */
function buildGhostMesh(src){
  const grp=new THREE.Group();
  const body=src.clone(true);
  body.traverse(o=>{
    if(!o.isMesh) return;
    const old=o.material;
    /* ⚠️ emissive ต้อง **ไม่ใส่ emissiveMap** — เทกซ์เจอร์ผีเป็นโทนดำเกือบทั้งตัว (ผมยาว/ชุดขาด)
       ถ้าคูณด้วยแมป แสงเรืองจะถูกกดจนมืดสนิท มองไม่เห็นอะไรเลยตอนไฟดับ
       ใส่เป็นสีเรืองล้วน = ได้ "เงาวิญญาณ" เรืองจาง ๆ ทั้งตัวตอนมืด · พอไฟฉายส่องโดน ลาย map ค่อยเด่นขึ้นมา */
    const m=new THREE.MeshPhongMaterial({
      map:(old&&old.map)||null, color:0xffffff, shininess:2, specular:0x0a0a12,
      emissive:0x9fb4d8, emissiveIntensity:.12,
      transparent:true, opacity:1, depthWrite:false, side:THREE.DoubleSide, fog:true,
    });
    /* เทกซ์เจอร์ผีมืดมาก (ผมดำ/ชุดขาดสีเทาเข้ม) — ถ้าไม่คูณสีขึ้น จะเห็นเป็นเงาดำทึบ มองไม่ออกว่าหน้าตายังไง
       three.js ยอมให้ color เกิน 1 ได้ (ไม่ได้เปิด tone mapping) = ดันความสว่างขึ้นตรง ๆ โดยไม่ต้องแก้ไฟล์ */
    m.color.setScalar(1.4);
    o.material=m; o.frustumCulled=false;    // ผีตัวใหญ่ใกล้กล้อง — กัน culling ตัดหายตอนวาร์ปมาข้างหลัง
  });
  grp.add(body);
  return grp;
}
function makeGhostSprite(){   // ผีนั่งในตู้เสื้อผ้า (hotel3d.js เรียกผ่าน opt ตอน build ตึก — โมเดลอาจยังโหลดไม่เสร็จ)
  const grp=new THREE.Group();
  grp.scale.setScalar(1);
  ghostGlbEnsure(src=>{
    if(src){
      const m=buildGhostMesh(src);
      m.scale.setScalar(GHOST_MODEL_H*.62);   // นั่งยอง ๆ ในตู้ = เตี้ยกว่ายืน (~1.1 ม.)
      /* hotel3d วางกลุ่มนี้ไว้ที่ y=0.95 ของห้อง แต่โมเดลมีเท้าอยู่ที่ y=0 ของตัวเอง
         → ต้องดันลงมาเท่ากัน ไม่งั้นผีลอยกลางตู้ */
      m.position.y=-0.95;
      grp.add(m);
    }else{                                     // ไม่มีโมเดล → ภาพ sprite ชุดเดิม (ตำแหน่งเดิมเป๊ะ)
      const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:ghostTexture(),transparent:true,opacity:1,depthWrite:false}));
      spr.scale.set(1.5,1.5,1); grp.add(spr);
    }
  });
  return grp;
}
function spawnGhost(){
  const holder=new THREE.Group();
  holder.visible=false;
  scene.add(holder);
  const g={spr:holder, st:'lurk', at:0, showAt:0, vis:0, floorY:0, baseY:0, wailAt:0, mats:[], model:false, gait:0, litT:0};
  const gen=ghostGen;      /* ⚠️ ต้องประกาศ "ก่อน" เรียก ghostGlbEnsure — ถ้าโมเดลโหลดเสร็จแล้ว
                              callback จะวิ่งทันทีแบบ sync แล้วชน TDZ ถ้าประกาศทีหลัง */
  ghostGlbEnsure(src=>{
    if(gen!==ghostGen) return;                 // เปลี่ยนด่านระหว่างรอโหลด → ทิ้ง
    if(src){
      const m=buildGhostMesh(src);
      holder.add(m); g.model=true;
      m.traverse(o=>{ if(o.isMesh) g.mats.push(o.material); });
    }else{                                     // ถอยไปใช้ sprite เดิม (เกมต้องมีผีเสมอ)
      const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:ghostTexture(),transparent:true,opacity:1,depthWrite:false}));
      spr.scale.set(2.6,2.6,1); spr.position.y=1.35; holder.add(spr);
      g.mats.push(spr.material);
    }
    applyGhostSize(g);
  });
  ghostGoLurk(g);
  monsters.push(g);
}
/* ขนาดตัว: โมเดลสูง 1.0 หน่วย → scale = ความสูงจริงที่อยากได้ · สุ่มนิดหน่อยให้แต่ละตัวไม่เท่ากันเป๊ะ
   (เท้าอยู่ y=0 ของโมเดลอยู่แล้ว → baseY=0 ลอยเหนือพื้นนิดเดียวตอน bob) */
function applyGhostSize(g){
  if(g.model){
    const h=GHOST_MODEL_H*(0.92+Math.random()*0.22);
    g.spr.scale.setScalar(h);
    g.baseY=0;
  }else{
    g.spr.scale.setScalar(1);
    g.baseY=0;                                  // sprite ที่ใส่ไว้ยกขึ้น 1.35 ในตัวมันเองแล้ว
  }
}
/* ผีต้องหันหน้าเข้าหาผู้เล่นเสมอ (โมเดล Tripo หันหน้าไปทาง +Z) */
function faceGhostToPlayer(g){
  if(!g.model) return;                          // sprite หันเองอยู่แล้ว
  const c=camera.position, mp=g.spr.position;
  g.spr.rotation.y=Math.atan2(c.x-mp.x, c.z-mp.z);
}
/* ตั้งความจาง/ความเรืองแสงของผีทั้งตัว (โมเดลมีหลาย material) */
function setGhostVis(g, vis){
  const op=vis*.95;
  for(let i=0;i<g.mats.length;i++){
    const m=g.mats[i];
    m.opacity=op;
    if(m.emissive) m.emissiveIntensity=blackedOut?(0.06+vis*0.18):(0.03+vis*0.06);   // มืดสนิท = เรืองจาง ๆ พอเห็นเป็นวิญญาณแต่ไกล (แรงกว่านี้ตัวจะขาวโพลนจนไม่เห็นลาย)
  }
  g.spr.visible=vis>.02;
}
/* ============================================================
   🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
   ① ออกมาได้ต่อเมื่อ **ไฟดับแล้ว** เท่านั้น (ไฟยังติด = ห้ามโผล่เด็ดขาด — เดิมเดินอยู่กลางล็อบบี้ตั้งแต่ไฟสว่าง)
   ② ผู้เล่นต้องขึ้นถึง **ชั้น 2** ขึ้นไป (index 1 = ป้าย "ชั้น 2" บนจอ)
   ③ โผล่ "บริเวณกลาง ๆ ทางเดิน" ของชั้นนั้น ไม่ใช่ซุ่มในห้องพักแบบเดิม
   ④ ไฟฉายผู้เล่นส่องโดน → หายตัวภายใน 2 วินาที (ล็อกลำแสง .35 วิ + จางหาย 1.2 วิ = 1.55 วิ)
   ============================================================ */
const GHOST_MIN_FLOOR=1;         // index 1 = "ชั้น 2" ที่โชว์บนจอ
const TORCH_LOCK_S=.35;          // ต้องส่องค้างเท่านี้ก่อน ผีถึงเริ่มหาย (กันสะบัดไฟฉายผ่านแล้วผีหายมั่ว)
const BANISH_S=1.2;              // เวลาจางหายหลังโดนไฟฉังจับได้
let hTorchWinAt=0;               // ครั้งล่าสุดที่ขึ้นป้ายสอน "ไฟฉายไล่ผีได้" (ไม่ให้เด้งรัว)
function ghostsAllowed(){
  return !!(hotel && blackedOut && HOTEL3D.floorOf(hFootY)>=GHOST_MIN_FLOOR
            && HOTEL3D.insideHotel(camera.position.x,camera.position.z));
}
/* จุดกลางทางเดินของชั้นที่ผู้เล่นอยู่ ห่างจากตัวผู้เล่นอย่างน้อย minD (จะได้โผล่ "แต่ไกล" ไม่ใช่จ่อหน้า) */
function hotelCorridorX(minD){
  const c=camera.position, x0=HOTEL3D.CORE_E+3.5, x1=HOTEL3D.BX-3.5;
  for(let i=0;i<14;i++){
    const x=x0+Math.random()*(x1-x0);
    if(Math.abs(x-c.x)>=minD) return x;
  }
  return (c.x>(x0+x1)/2)?x0:x1;
}
/* ลำไฟฉายจับตัวผีอยู่ไหม (กรวยรอบทิศที่กล้องมอง ~26° — ใกล้เคียง torch.angle .46 rad) */
function torchHitsGhost(g){
  const c=camera.position, mp=g.spr.position, cp=Math.cos(pitch);
  const fx=-Math.sin(yaw)*cp, fy=Math.sin(pitch), fz=-Math.cos(yaw)*cp;
  const gx=mp.x-c.x, gy=(g.floorY+.95)-c.y, gz=mp.z-c.z;
  const gl=Math.hypot(gx,gy,gz)||.001;
  return (gx*fx+gy*fy+gz*fz)/gl > .90;
}
function ghostBanish(g,now){
  g.st='gone'; g.at=now; g.litT=0;
  HSound.whoosh();
  if(now-hTorchWinAt>15000){                       // ป้ายสอนเด็ก โผล่ห่าง ๆ พอ ไม่รกจอ
    hTorchWinAt=now;
    showBanner('🔦 <b>ไฟฉายส่องโดนผี!</b><br><small>ผีที่นี่<b>กลัวแสงไฟฉาย</b> — ส่องค้างไว้แป๊บเดียวมันจะหายตัวไปเอง 👻💨</small>',2400);
  }
}
/* ผีไปรออยู่กลางทางเดินของชั้นที่ผู้เล่นอยู่ (รอบ 778 — เดิมซุ่มในห้องพักสุ่มห้อง) */
function ghostGoLurk(g){
  if(!hotel){ g.st='lurk'; g.showAt=performance.now()+4000; return; }
  applyGhostSize(g);                               // สุ่มความสูงตัวใหม่ทุกครั้งที่ย้ายที่ (ไม่ซ้ำหน้าเดิมเป๊ะ)
  const fy=HOTEL3D.floorY(HOTEL3D.floorOf(hFootY));
  g.floorY=fy;
  g.spr.position.set(hotelCorridorX(8), fy+g.baseY, (Math.random()*2-1)*.9);
  g.st='lurk'; g.vis=0; g.at=performance.now(); g.litT=0;
  g.showAt=performance.now()+800+Math.random()*4000;
}
/* ส่งผีมาเดินตาม "จากข้างหลัง" (รอบ 850 ผู้ใช้สั่ง: เน้นตามหลัง+เสียงฝีเท้า ไม่เน้นให้เห็นข้างหน้า)
   โผล่ด้านหลังทิศที่ผู้เล่นหันอยู่ ~11 ม. แล้วเดินตาม (ไม่มีวันทัน) */
function ghostGoStalk(g){
  if(!hotel || !HOTEL3D.insideHotel(camera.position.x,camera.position.z)) return;
  applyGhostSize(g);
  const fy=HOTEL3D.floorY(HOTEL3D.floorOf(hFootY));
  const c=camera.position;
  const x=Math.max(HOTEL3D.CORE_E+1.5, Math.min(HOTEL3D.BX-1.5, c.x+Math.sin(yaw)*11));
  const z=Math.max(-1.8, Math.min(1.8, c.z+Math.cos(yaw)*11));
  g.floorY=fy;
  g.spr.position.set(x, fy+g.baseY, z);
  g.st='stalk'; g.at=performance.now(); g.vis=0; g.wailAt=0; g.seenT=0; g.stepAcc=0;
  HSound.whoosh();
}
/* วาร์ปไปยืนข้างหลังผู้เล่น + jump scare แล้วจางหาย (ข้อ 10 และ 12) */
function ghostGoBehind(g){
  const c=camera.position;
  g.floorY=hFootY;
  g.spr.position.set(c.x+Math.sin(yaw)*1.9, hFootY+g.baseY, c.z+Math.cos(yaw)*1.9);
  g.st='behind'; g.at=performance.now(); g.vis=1;
  faceGhostToPlayer(g);                            // หันหน้าเข้าหาเราทันทีตอนวาร์ปมา (จังหวะ jump scare)
  hotelScare(false);
}
function tickGhosts(dt,now){
  tickSurvive();                                   // ⏱ นาฬิกา "อยู่ในโรงแรมนานสุด" (สถิติเดิม ใช้ต่อได้)
  if(!hotel) return;
  const c=camera.position;
  const fx=-Math.sin(yaw), fz=-Math.cos(yaw);      // ทิศที่ผู้เล่นหันหน้า
  const allowed=ghostsAllowed();                   // 🔦 รอบ 778: ไฟยังติด / ยังไม่ถึงชั้น 2 = ผีห้ามออก
  let stalking=false;
  for(let i=0;i<monsters.length;i++){
    const g=monsters[i], mp=g.spr.position;
    const dx=c.x-mp.x, dz=c.z-mp.z, d=Math.hypot(dx,dz)||.001;
    const sameFloor=Math.abs(g.floorY-hFootY)<1.9;
    const facing=(-dx*fx-dz*fz)/d;                 // >0 = ผีอยู่ในทิศที่เรามองอยู่
    const wasStalking=g.st==='stalk';               // เดินตามอยู่ตอนต้นเฟรมนี้ → ให้ท่า "เดิน" ไม่ใช่ "ลอยนิ่ง"
    if(!allowed){                                   // เงื่อนไขยังไม่ครบ → จางหายแล้วไปหมอบรอเงียบ ๆ
      if(g.vis>0){ g.vis=Math.max(0,g.vis-dt*3); setGhostVis(g,g.vis); }
      else if(g.st!=='lurk'){ g.st='lurk'; g.vis=0; g.spr.visible=false; }
      g.litT=0; g.showAt=now+2200;                  // ครบเงื่อนไขแล้วยังต้องรออีกหน่อย ไม่โผล่ปุ๊บปั๊บ
      continue;
    }
    /* 🔦 ไฟฉายจับตัวผีค้างไว้ครบ TORCH_LOCK_S → สั่งให้หายตัว (รวมแล้วไม่เกิน 2 วิ ตามที่ผู้ใช้สั่ง) */
    if(g.st!=='gone'){
      if(torchOn && g.vis>.05 && sameFloor && d<20 && torchHitsGhost(g)) g.litT=(g.litT||0)+dt;
      else g.litT=Math.max(0,(g.litT||0)-dt*1.5);
      if(g.litT>=TORCH_LOCK_S) ghostBanish(g,now);
    }
    switch(g.st){
      case 'lurk':                                  // ข้อ 13/18: รอในห้อง ให้เห็นแว็บ ๆ
        g.vis=Math.max(0,g.vis-dt*2.5);
        if(sameFloor && d<11 && facing>.2 && now>g.showAt){ g.st='peek'; g.at=now; HSound.whisper(); }
        else if(now-g.at>26000) ghostGoLurk(g);      // ผู้เล่นไม่มาสักที → ย้ายไปแอบห้องอื่น
        break;
      case 'peek':
        g.vis=Math.min(1,g.vis+dt*3.4);
        if(d<M.scareR){ ghostGoBehind(g); break; }   // ข้อ 12: เดินเข้าหาผี = มันวาร์ปไปข้างหลัง
        if(now-g.at>650){ g.st='fade'; g.at=now; }   // รอบ 850: เห็นข้างหน้าได้แค่ "แว็บเดียว" แล้วหาย
        break;
      case 'stalk':                                 // ข้อ 11: เดินตามแต่ไม่มีวันทัน
        if(!sameFloor){ g.st='fade'; g.at=now; break; }
        /* 👀 รอบ 850: ผีตามหลังเป็นหลัก — หันไปมองได้ "แว็บเดียว" (.6 วิ พอให้ไฟฉายไล่ทัน)
           มองค้างนานกว่านั้นมันเลือนหายจากสายตา (ยังตามอยู่ ได้ยินฝีเท้า) — คลาสสิกหนังผี */
        if(facing>.25) g.seenT=(g.seenT||0)+dt;
        else g.seenT=Math.max(0,(g.seenT||0)-dt*2);
        if(g.seenT>.6) g.vis=Math.max(0,g.vis-dt*3.5);
        else g.vis=Math.min(1,g.vis+dt*1.5);
        if(d>M.keepR){ mp.x+=dx/d*M.ghostSpeed*dt; mp.z+=dz/d*M.ghostSpeed*dt; }
        else if(d<M.keepR-.8){ mp.x-=dx/d*M.ghostSpeed*.9*dt; mp.z-=dz/d*M.ghostSpeed*.9*dt; }
        /* 👣 เสียงฝีเท้าเดินตาม (รอบ 850) — จังหวะเท้าผูกกับ gait เดียวกับท่าโยกตัว ยิ่งใกล้ยิ่งดัง */
        g.stepAcc=(g.stepAcc||0)+dt*7.5/Math.PI;      // ครบ 1 = ก้าวถัดไป (คาบเดียวกับ sin(g.gait))
        if(g.stepAcc>=1){ g.stepAcc-=Math.floor(g.stepAcc); HSound.step(Math.max(.12,1-d/22)); }
        if(now-g.wailAt>3400){ g.wailAt=now; HSound.wail(); }
        if(d<M.scareR || now-g.at>13000) ghostGoBehind(g);
        stalking=true;
        break;
      case 'behind':                                // ยืนหลอกอยู่ข้างหลัง 1.3 วิ แล้วหายไป
        g.vis=1;
        if(now-g.at>1300){ g.st='fade'; g.at=now; }
        break;
      case 'gone':                                  // 🔦 รอบ 778: โดนไฟฉายส่อง → จางหายภายใน BANISH_S
        g.vis=Math.max(0,g.vis-dt/BANISH_S);
        if(g.vis<=.01) ghostGoLurk(g);
        break;
      default:                                      // fade
        g.vis=Math.max(0,g.vis-dt*1.8);
        if(g.vis<=0.01) ghostGoLurk(g);
    }
    setGhostVis(g, g.vis);                         // จาง/ชัด + เรืองแสงตามสถานะไฟในตึก (ครอบทุก material ของโมเดล)
    faceGhostToPlayer(g);                          // โมเดล 3D ต้องหันหน้าเข้าหาเราเสมอ
    /* 🚶 ท่า "เดินตาม" ราคาถูกที่สุด — ไม่มีโครงกระดูก/คลิปแอนิเมชันในโมเดล (ตัดตอนย่อไฟล์)
       จึงปลอมท่าเดินด้วยการหมุน/โยกทั้งกลุ่มแทน: เอียงตัวส่าย (rotation.z) + ก้มหน้าเล็กน้อยตอนวิ่งไล่ (rotation.x)
       เดินหน้าเร็วขึ้นเป็นจังหวะ (stepBob) เฉพาะตอน stalk เท่านั้น — ตอนอื่น (lurk/peek/behind) กลับไปนิ่งสนิทเหมือนเดิม */
    if(wasStalking) g.gait+=dt*7.5;
    const stepBob=(wasStalking && g.model)?Math.abs(Math.sin(g.gait))*.05:0;
    if(g.model){
      g.spr.rotation.z=wasStalking?Math.sin(g.gait)*.09:0;
      g.spr.rotation.x=wasStalking?.06:0;
    }
    mp.y=g.floorY+g.baseY+Math.sin(now/300+mp.x)*.09+stepBob;   // ลอยขึ้นลงเบา ๆ + จังหวะก้าวตอนไล่ตาม
  }
  // สุ่มส่งผีออกมาเดินตามเป็นระยะ (ข้อ 9: สุ่มผี) — 🔦 รอบ 778: เฉพาะตอนเงื่อนไขครบเท่านั้น
  if(!allowed) ghostStalkAt=now+8000;
  else if(now>ghostStalkAt){
    ghostStalkAt=now+12000+Math.random()*12000;   // รอบ 850: ตามหลังบ่อยขึ้น — เป็นวิธีปรากฏตัวหลักของผี
    const cand=monsters.filter(g=>g.st==='lurk');
    if(cand.length) ghostGoStalk(cand[Math.floor(Math.random()*cand.length)]);
  }
  if(stalking && running){
    hudHuntEl.style.display='block';
    hudHuntEl.textContent='👻 มีอะไรเดินตามอยู่ข้างหลัง...';
    overlayEl.classList.add('adv-hunted');
    HSound.heartbeat(9);
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
  const txt=`⏱ อยู่ในโรงแรม ${fmtSurv(run)} · 🏆 ${fmtSurv(Math.max(best,run))}`;
  if(hudSurvEl.textContent!==txt) hudSurvEl.textContent=txt;
  if(!hauntRecordShown && best>0 && run>best){
    hauntRecordShown=true;
    sfx.levelup();
    showBanner(`🏆 <b>สถิติใหม่! กล้าอยู่ในโรงแรมผีสิงนานสุด ${fmtSurv(run)}</b><br><small>ยิ่งอยู่นานสถิติยิ่งพุ่ง — เพื่อนเห็นในการ์ดของหนูด้วยนะ</small>`);
  }
}

/* ---------- ❤️ หัวใจ: โรงแรมผีสิงไม่มีการเสียหัวใจแล้ว (ผีไม่ทำร้ายใคร) ----------
   คงฟังก์ชันไว้เพราะ start()/โลกอื่นเรียกอยู่ — ในโรงแรมแค่ซ่อนหัวใจ เหลือนาฬิกาเวลาอยู่ในโรงแรม */
function renderHearts(){
  if(!hudHeartEl) return;
  hudHeartEl.style.display='none';
  if(hudSurvEl) hudSurvEl.style.display = (mode==='haunt') ? 'block' : 'none';
}
/* 😱 jump scare แบบสั่นจอ+เสียง (ผีโผล่ข้างหลัง) · strong=true เพิ่มภาพผีเต็มจอ (เปิดตู้เสื้อผ้า/ไฟดับ) */
function hotelScare(strong){
  HSound.stinger();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(strong?[380,90,200]:[170,60,130]);
  overlayEl.classList.remove('adv-shake'); void overlayEl.offsetWidth; overlayEl.classList.add('adv-shake');
  if(strong){
    const gsrc=ghostScareSrc(), img=scareEl.querySelector('img');   // ผีไทยพุ่งเต็มจอถ้ามีภาพ ไม่มี=👻 emoji
    if(gsrc && img){ img.src=gsrc; scareEl.classList.add('has-img'); }
    else scareEl.classList.remove('has-img');
    scareEl.classList.add('on');
    HSound.scream();
  }
  setTimeout(()=>{
    overlayEl.classList.remove('adv-shake');
    if(strong) scareEl.classList.remove('on');
  }, strong?1400:650);
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
   🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
   ตัวตึกทั้งหลังอยู่ js/hotel3d.js (window.HOTEL3D) — ไฟล์นี้คุมเฉพาะ "การเล่น"
   ⏱ ไทม์ไลน์: เดินเข้าตึก → เล่นในโรงแรมสว่าง 2 นาที → ไฟกะพริบ 8 วิ → ไฟดับสนิท
                → กด F เปิดไฟฉาย (มีแค่ลำแสงไฟฉายเท่านั้นที่เห็นทาง)
   ============================================================ */
let hotel=null;                          // object จาก HOTEL3D.build (เก็บใน worlds.haunt.hotel ด้วย)
let hotelHemi=null, hotelMoonL=null, hotelAmb=null;   // แสงโลกผี — หรี่/ดับตอนไฟดับ
let hFootY=0;                            // ความสูง "พื้นใต้เท้า" ปัจจุบัน (ชั้น/ทางลาด/ลิฟต์)
let hotelInAt=0;                         // เวลาที่ก้าวเข้าตึกครั้งแรก (เริ่มนับ 2 นาที)
let blackedOut=false, hFlickerAt=0, hFlickerN=0;
let torch=null, torchSpill=null, torchOn=false;   // 🔦 ไฟฉาย (ลำแสง + แสงฟุ้งรอบตัว)
let ghostStalkAt=0, hKnockAt=0, hActEl=null, hTorchBtn=null, hTorchHintEl=null, hActNow=null;
/* 📷 รอบ 850: head bob เดินให้สมจริง — เฟสก้าวผูกกับ "ระยะที่ขยับได้จริง" (ติดกำแพง = ไม่โยก) */
let hStepPh=0, hBobAmt=0, hYawVel=0, hPrevYaw=0;
const BLACKOUT_MS=120000;                // 2 นาที (ผู้ใช้สั่งข้อ 4)
const FLICKER_MS=8000;                   // ไฟกะพริบเตือนก่อนดับ
/* 🌑 sprite ตัวอักษรเป็นวัสดุ "ไม่รับแสง" — ไฟดับแล้วจะยังสว่างจ้าผิดธรรมชาติ
   จึงคูณสีให้หม่นลงตอนมืด แต่ยังเรือง ๆ พอให้เด็กหาเจอ
   (ผีไม่ใช้ทางนี้แล้วตั้งแต่รอบ 689 — เป็นโมเดล 3D คุมความสว่างด้วย emissive ใน setGhostVis) */
const DARK_LETTER=0xb9c4e0;
function tintSprite(mat){ if(mat) mat.color.setHex(blackedOut?DARK_LETTER:0xffffff); }

/* ---------- เข้าโลกใหม่ทุกครั้ง: คืนไฟ/ล้างสถานะ ---------- */
function hotelReset(){
  hotel=(worlds.haunt&&worlds.haunt.hotel)||null;
  hFootY=0; hotelInAt=0; blackedOut=false; hFlickerAt=0; hFlickerN=0;
  ghostStalkAt=performance.now()+12000; hKnockAt=0; hActNow=null; hTorchWinAt=0;
  setTorch(false);
  if(hotel){
    HOTEL3D.setLights(hotel,true);
    hotel.lift.floor=0; hotel.lift.target=0; hotel.lift.y=0; hotel.lift.cab.position.y=0;
    hotel.wardrobes.forEach(W=>{                 // ตู้ทุกใบกลับไปปิด + สุ่มใหม่ว่าใบไหนมีผี
      W.open=false; W.done=false; W.t=0; W.haunted=Math.random()<.42;
      W.hingeL.rotation.y=0; W.hingeR.rotation.y=0;
      if(W.ghost) W.ghost.visible=false;
    });
  }
  if(hotelHemi) hotelHemi.intensity=.72;
  if(hotelMoonL) hotelMoonL.intensity=.55;
  if(hotelAmb) hotelAmb.intensity=.62;
  if(scene && scene.fog){ scene.fog.near=M.fogN; scene.fog.far=M.fogF; }
  if(hTorchHintEl) hTorchHintEl.style.display='none';
  if(hTorchBtn) hTorchBtn.classList.remove('on');
  if(hActEl) hActEl.style.display='none';
}

/* ---------- 🔦 ไฟฉาย (กด F / ปุ่ม 🔦 บนจอสัมผัส) ---------- */
function setTorch(on){
  torchOn=!!on;
  if(!torch && scene && mode==='haunt'){
    torch=new THREE.SpotLight(0xfff2d2, 0, 34, .46, .55, 1.0);
    torch.target=new THREE.Object3D();
    scene.add(torch); scene.add(torch.target);
    /* แสงฟุ้งรอบตัวจากไฟฉาย (spill) รัศมีสั้น ๆ — กันเด็กหลงทางจนเล่นไม่สนุก
       แต่ยังมืดพอ: เห็นแค่ ~4 เมตรรอบตัวเท่านั้น และหายไปทันทีที่ปิดไฟฉาย */
    torchSpill=new THREE.PointLight(0xffe9c4, 0, 5.5, 1.6);
    scene.add(torchSpill);
  }
  if(torch) torch.intensity=torchOn?2.2:0;
  if(torchSpill) torchSpill.intensity=torchOn?.42:0;
  if(hTorchBtn) hTorchBtn.classList.toggle('on',torchOn);
  if(torchOn && hTorchHintEl) hTorchHintEl.style.display='none';
}
function toggleTorch(){
  setTorch(!torchOn);
  sfx.select();
  if(!blackedOut && torchOn) showBanner('🔦 <b>เปิดไฟฉายแล้ว</b><br><small>ตอนนี้ไฟยังไม่ดับ — เก็บแรงไว้ตอนมืดสนิทนะ</small>',1800);
}
function tickTorch(){
  if(!torch || !torchOn) return;
  const c=camera.position;
  torch.position.set(c.x,c.y,c.z);
  if(torchSpill) torchSpill.position.set(c.x,c.y-.2,c.z);
  torch.target.position.set(c.x-Math.sin(yaw)*10*Math.cos(pitch), c.y+Math.sin(pitch)*10, c.z-Math.cos(yaw)*10*Math.cos(pitch));
  torch.target.updateMatrixWorld();
}

/* ---------- 💡 ไฟดับทั้งโรงแรม (ข้อ 4-6) ---------- */
function hotelBlackout(){
  if(blackedOut) return;
  blackedOut=true;
  HOTEL3D.setLights(hotel,false);
  if(hotelHemi) hotelHemi.intensity=.012;        // มืดสนิท — เหลือแค่ลำไฟฉาย
  if(hotelMoonL) hotelMoonL.intensity=.02;
  if(hotelAmb) hotelAmb.intensity=0;
  if(scene && scene.fog){ scene.fog.near=1.2; scene.fog.far=24; }
  letters.forEach(l=>tintSprite(l.spr.material));      // ตัวอักษรที่วางอยู่แล้วก็ต้องหม่นลงด้วย
  HSound.powerDown();
  hotelScare(false);
  showBanner('💡💥 <b>ไฟทั้งโรงแรมดับหมด!!</b><br><small>🔦 <b>กด F เพื่อเปิดไฟฉาย</b><br><i>Press <b>F</b> to turn on the flashlight</i></small>',6500);
  hintEl.textContent='🔦 F = เปิด/ปิดไฟฉาย (flashlight) · E = เปิดตู้เสื้อผ้า/กดลิฟต์ · WASD เดิน';
  if(hTorchHintEl) hTorchHintEl.style.display='block';
}
/* ไฟกะพริบเตือนล่วงหน้า — สร้างความลุ้นก่อนดับจริง */
function hotelFlicker(now){
  if(now<hFlickerAt) return;
  hFlickerAt=now+220+Math.random()*520;
  hFlickerN++;
  const on=(hFlickerN%2===0);
  HOTEL3D.setLights(hotel,on);
  if(hotelHemi) hotelHemi.intensity=on?.72:.06;
  if(hotelAmb) hotelAmb.intensity=on?.62:.03;
  if(on) HSound.eerie();
}

/* ---------- 🚶 เดินในโรงแรม: ชนกำแพงจริง + ขึ้นบันได/ลิฟต์ ---------- */
function tickHotelPlayer(dt,now){
  const px=camera.position.x, pz=camera.position.z;   // จำตำแหน่งก่อนขยับ — วัด "ระยะที่เดินได้จริง"
  let fw=0,sd=0;
  if(keys.KeyW||keys.ArrowUp) fw+=1;
  if(keys.KeyS||keys.ArrowDown) fw-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  const moving=!!(fw||sd);
  if(moving){
    const l=Math.hypot(fw,sd)||1;
    if(l>1){ fw/=l; sd/=l; }
    const sin=Math.sin(yaw), cos=Math.cos(yaw);
    const sp=PLAYER_SPEED*(blackedOut?.85:1)*dt;    // ไฟดับ เดินคลำทางช้าลงนิดเดียว
    let nx=camera.position.x+(-sin*fw+cos*sd)*sp;
    let nz=camera.position.z+(-cos*fw-sin*sd)*sp;
    nx=Math.max(-HALF+1.2,Math.min(HALF-1.2,nx));
    nz=Math.max(-HALF+1.2,Math.min(HALF-1.2,nz));
    for(const t of trees){                          // ต้นไม้/พุ่มในสวนหน้าโรงแรม
      const d=Math.hypot(nx-t.x,nz-t.z), min=t.r+.5;
      if(d<min && d>0){ nx=t.x+(nx-t.x)/d*min; nz=t.z+(nz-t.z)/d*min; }
    }
    if(hotel){
      const c=HOTEL3D.collide(hotel,nx,nz,hFootY); nx=c.x; nz=c.z;
      /* 🪜 กฎ "ก้าวได้แค่ระดับเข่า" — ถ้าพื้นจุดใหม่สูง/ต่ำกว่าที่ยืนเกิน STEP_MAX ให้ถือว่าเป็นกำแพง
         สำคัญมาก: ปลายทางลาดบันไดอยู่เหนือชานพักชั้นล่าง ~3 ม. ถ้าไม่กันไว้ เด็กเดินลอดใต้บันได
         แล้ว "ลอยขึ้น" ข้ามชั้นได้เลย (ไม่ต้องเดินขึ้นบันได/ลิฟต์) */
      const STEP_MAX=.75;
      const wy=HOTEL3D.surfaceY(hotel,nx,nz,hFootY);
      if(Math.abs(wy-hFootY)>STEP_MAX && !HOTEL3D.inLift(hotel,nx,nz,hFootY)){ nx=camera.position.x; nz=camera.position.z; }
    }
    camera.position.x=nx; camera.position.z=nz;
  }
  // ความสูงพื้น (ชั้น/ทางลาดบันได/พื้นลิฟต์) — ไล่ตามแบบนุ่ม ๆ ไม่กระตุก
  if(hotel){
    const want=HOTEL3D.surfaceY(hotel,camera.position.x,camera.position.z,hFootY);
    hFootY += (want-hFootY)*Math.min(1,dt*10);
    if(Math.abs(want-hFootY)<.01) hFootY=want;
  }
  /* 📷 รอบ 850 (ผู้ใช้: "เดินดูลอย ไม่เป็นธรรมชาติ"): head bob แบบผูกกับระยะจริง
     ▸ เฟสก้าวเดินหน้าเฉพาะเมื่อ "ขยับได้จริง" (ชนกำแพง = หยุดโยกทันที ไม่โยกฟรี)
     ▸ ขึ้นลง 2 จังหวะ/รอบก้าว + เอียงซ้ายขวาสลับเท้า (roll) + เอนตัวเข้าโค้งตอนหันกล้อง */
  const realSp=Math.hypot(camera.position.x-px,camera.position.z-pz)/Math.max(dt,1e-4);
  hBobAmt+=(((moving&&realSp>.4)?1:0)-hBobAmt)*Math.min(1,dt*8);      // เข้า/ออกจังหวะโยกนุ่ม ๆ
  hStepPh+=realSp*dt*3.6;                                             // rad ต่อเมตร (~3.4 ก้าว/วิ ที่ 6 m/s)
  let dyaw=yaw-hPrevYaw; hPrevYaw=yaw;
  if(dyaw>Math.PI) dyaw-=Math.PI*2; else if(dyaw<-Math.PI) dyaw+=Math.PI*2;
  hYawVel+=(dyaw/Math.max(dt,1e-4)-hYawVel)*Math.min(1,dt*9);         // ความเร็วหันกล้อง (เกลี่ยแล้ว)
  const bobY=Math.sin(hStepPh*2)*.05*hBobAmt;                         // ตัวขึ้นลง 2 ครั้ง/รอบ (ซ้าย-ขวา)
  const roll=Math.sin(hStepPh)*.014*hBobAmt                           // ไหล่เอียงสลับข้างตามเท้า
            +Math.max(-.045,Math.min(.045,-hYawVel*.055));            // เอนตัวเข้าโค้งตอนหัน
  camera.position.y=hFootY+EYE_H+bobY;
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch); camera.rotateZ(roll);

  // เก็บตัวอักษร — ต้องอยู่ชั้นเดียวกันด้วย (ไม่งั้นเก็บทะลุพื้นได้)
  for(let i=letters.length-1;i>=0;i--){
    const lp=letters[i].spr.position;
    if(Math.abs(lp.y-(hFootY+1.15))<1.8 &&
       Math.hypot(lp.x-camera.position.x,lp.z-camera.position.z)<PICK_DIST) pickUpLetter(i);
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });
}

/* ---------- ⏱ จังหวะของโลก: เข้าตึก → ไฟกะพริบ → ไฟดับ · เสียงเคาะตู้ · ป้าย "กด E" ---------- */
function tickHotelWorld(dt,now){
  tickHauntSky(dt,now);                            // 🌌 ฟ้ากลางคืน (รอบ 694) — ทำงานแม้ตอนยังไม่เข้าตึก
  if(!hotel) return;
  HOTEL3D.tick(hotel,dt,now,camera.position);      // รูปตามอง + ลิฟต์ + บานตู้
  tickTorch();
  const c=camera.position;
  const inside=HOTEL3D.insideHotel(c.x,c.z);
  if(inside && !hotelInAt){
    hotelInAt=now;
    showBanner('🏨 <b>ยินดีต้อนรับสู่โรงแรมกำมะหยี่</b><br><small>ตัวอักษรซ่อนอยู่ตามห้องพักทั้ง 5 ชั้น · ขึ้นชั้นบนด้วย 🛗 <b>ลิฟต์ (กด E)</b> หรือ 🪜 <b>บันได</b> ฝั่งซ้ายสุด</small>',5000);
    setTimeout(announceTarget,5200);
  }
  if(hotelInAt && !blackedOut){
    const left=BLACKOUT_MS-(now-hotelInAt);
    if(left<=0){ hotelBlackout(); }
    else if(left<=FLICKER_MS){
      if(!hFlickerN) showBanner('💡 <b>ไฟเริ่มกะพริบ...</b><br><small>อีกไม่กี่วินาทีไฟจะดับทั้งโรงแรม — เตรียมกด <b>F</b> เปิดไฟฉายไว้เลย!</small>',3500);
      hotelFlicker(now);
    }
  }
  // 🚪🔊 เสียงเคาะจากในตู้เสื้อผ้า (ข้อ 17) — เฉพาะห้องที่ผู้เล่นยืนอยู่ และตู้ใบนั้นมีผี
  const R=HOTEL3D.roomAt(hotel,c.x,c.z,hFootY);
  if(R && R.wardrobe && R.wardrobe.haunted && !R.wardrobe.done && now>hKnockAt){
    hKnockAt=now+3400+Math.random()*3000;
    HSound.knock();
    if(state.haptic!==false && navigator.vibrate) navigator.vibrate([30,60,30,60,30]);
  }
  // ป้ายบอกว่ากด E ได้ตรงไหน (กฎทอง #1: ห้ามให้เด็กเดาเอง)
  let act=null;
  if(HOTEL3D.inLift(hotel,c.x,c.z,hFootY)) act={t:'lift', s:`🛗 กด <b>E</b> ไปชั้นถัดไป (ตอนนี้ชั้น ${hotel.lift.floor+1})`};
  else if(HOTEL3D.atLiftDoor(hotel,c.x,c.z,hFootY)) act={t:'call', s:'🛗 กด <b>E</b> เรียกลิฟต์'};
  else{
    const W=HOTEL3D.nearWardrobe(hotel,c.x,c.z,hFootY);
    if(W && !W.open) act={t:'wardrobe', w:W, s:'🚪 กด <b>E</b> เปิดตู้เสื้อผ้า'};
  }
  hActNow=act;
  if(hActEl){
    if(act){ hActEl.style.display='block'; if(hActEl.innerHTML!==act.s) hActEl.innerHTML=act.s; }
    else hActEl.style.display='none';
  }
}

/* ---------- 🅴 ปุ่มใช้งาน: ลิฟต์ / ตู้เสื้อผ้า ---------- */
function hotelAct(){
  if(!hotel || !running || !hActNow) return;
  if(hActNow.t==='lift'){
    const L=hotel.lift;
    if(L.moving) return;
    L.target=(L.floor+1)%HOTEL3D.FLOORS;
    sfx.select();
    showBanner(`🛗 <b>ลิฟต์กำลังขึ้นไปชั้น ${L.target+1}</b><br><small>กด E ซ้ำ = ไปชั้นถัดไป (ชั้น 1→5 แล้ววนกลับชั้น 1)</small>`,2000);
  }else if(hActNow.t==='call'){
    const L=hotel.lift, f=HOTEL3D.floorOf(hFootY);
    if(L.moving || L.floor===f) return;
    L.target=f; sfx.select();
    showBanner('🛗 <b>เรียกลิฟต์แล้ว รอสักครู่...</b>',1600);
  }else if(hActNow.t==='wardrobe'){
    openWardrobe(hActNow.w);
  }
}
function openWardrobe(W){
  if(!W || W.open) return;
  W.open=true; W.done=true; sfx.select();
  if(W.haunted){
    if(W.ghost){
      /* 🧟 รอบ 689: ผีในตู้เป็นโมเดล 3D — เร่งเรืองแสงให้เห็นชัดในตู้มืด แล้วหันหน้าออกมาหาเรา */
      W.ghost.traverse(o=>{ if(o.isMesh&&o.material){ o.material.opacity=1;
        if(o.material.emissive) o.material.emissiveIntensity=blackedOut?.28:.12; } });
      /* ⚠️ ผีตัวนี้เป็นลูกของ "กลุ่มห้อง" ที่หมุนไว้แล้ว (ห้องฝั่งใต้หมุน 180°)
         → ต้องลบมุมห้องออก ไม่งั้นห้องฝั่งใต้ผีจะหันหลังให้เรา */
      const c=camera.position;
      W.ghost.rotation.y=Math.atan2(c.x-W.x, c.z-W.z)-(W.room?W.room.rot:0);
      W.ghost.visible=true;
    }
    hotelScare(true);                              // ข้อ 17: เปิดเจอผีนั่งอยู่ + jump scare
    showBanner('👻 <b>มีผีนั่งอยู่ในตู้!!</b><br><small>ใจเย็น ๆ นะ — ผีโรงแรมนี้<b>ไม่ทำร้ายใครเลย</b> มันแค่ชอบแอบหลอกให้ตกใจ 🤭</small>',3600);
    setTimeout(()=>{ if(W.ghost) W.ghost.visible=false; },4500);
  }else{
    showBanner('🚪 <b>ตู้เสื้อผ้าใบนี้ว่างเปล่า</b><br><small>...โล่งอกไปที 😮‍💨</small>',1800);
  }
}

/* ---------- 🎯 ระบบแจ้งคำเป้าหมาย (ข้อ 14) ---------- */
function announceTarget(){
  if(!running || !M.hotel) return;
  const w=words[0]; if(!w) return;
  showBanner(`🎯 <b>ภารกิจ: ประกอบคำว่า ${escapeHTML(w.en.toUpperCase().split('').join(' '))}</b><br><small>= ${escapeHTML(w.th)} · เก็บตัวอักษรให้ครบทุกตัวตามห้องพัก แล้วคำจะประกอบเองอัตโนมัติ (+${M.reward}🪙)</small>`,4200);
  speakWord(w.en);
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
  step(vol){                                 // 👣 ฝีเท้าผีเดินตาม (รอบ 850) — เสียงทุ้มหนัก ๆ บนพื้นไม้ ยิ่งใกล้ยิ่งดัง
    if(!state.sound) return;
    this.ensure();
    const t=this.ctx.currentTime, v=Math.min(.32,Math.max(.03,vol||.15));
    const o=this.ctx.createOscillator(); o.type='sine';        // ตัวกระแทกทุ้ม (ส้นเท้าลงพื้น)
    o.frequency.setValueAtTime(88+Math.random()*22,t);
    o.frequency.exponentialRampToValueAtTime(42,t+.1);
    const og=this.ctx.createGain();
    og.gain.setValueAtTime(v,t);
    og.gain.exponentialRampToValueAtTime(.001,t+.13);
    o.connect(og); og.connect(this.master);
    o.start(t); o.stop(t+.15);
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();   // เสียดสีพรม/ไม้ลั่นแผ่ว ๆ
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=420+Math.random()*260; bp.Q.value=1.4;
    const ng=this.ctx.createGain();
    ng.gain.setValueAtTime(v*.4,t);
    ng.gain.exponentialRampToValueAtTime(.001,t+.09);
    n.connect(bp); bp.connect(ng); ng.connect(this.master);
    n.start(t); n.stop(t+.1);
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
  /* 🏨 รอบ 684: เสียงเฉพาะโรงแรมผีสิง — สังเคราะห์ล้วน ไม่มีไฟล์เสียง */
  knock(){                                   // 🚪 เคาะประตูจากในตู้เสื้อผ้า (ข้อ 17) — เคาะ 3 ที
    if(!state.sound) return;
    this.ensure();
    const t0=this.ctx.currentTime;
    for(let i=0;i<3;i++){
      const t=t0+i*.24;
      const o=this.ctx.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(58,t+.11);
      const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
      const lp=this.ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=420;
      const g=this.ctx.createGain();
      g.gain.setValueAtTime(.34,t); g.gain.exponentialRampToValueAtTime(.001,t+.16);
      o.connect(g); n.connect(lp); lp.connect(g); g.connect(this.master);
      o.start(t); o.stop(t+.18); n.start(t); n.stop(t+.14);
    }
  },
  stinger(){                                 // 😱 เสียงตกใจสั้น ๆ ตอนผีโผล่ข้างหลัง
    if(!state.sound) return;
    this.ensure();
    const t=this.ctx.currentTime;
    const o=this.ctx.createOscillator(); o.type='sawtooth';
    o.frequency.setValueAtTime(1180,t); o.frequency.exponentialRampToValueAtTime(180,t+.55);
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.4;
    bp.frequency.setValueAtTime(2400,t); bp.frequency.exponentialRampToValueAtTime(300,t+.5);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.42,t); g.gain.exponentialRampToValueAtTime(.001,t+.62);
    o.connect(g); n.connect(bp); bp.connect(g); g.connect(this.master);
    o.start(t); o.stop(t+.65); n.start(t); n.stop(t+.6);
  },
  whisper(){                                 // 🤫 เสียงกระซิบเบา ๆ ตอนผีแอบโผล่ในห้อง
    if(!state.sound) return;
    this.ensure();
    const t=this.ctx.currentTime;
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=6;
    bp.frequency.setValueAtTime(900,t); bp.frequency.linearRampToValueAtTime(1700,t+1.1);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(.12,t+.35);
    g.gain.exponentialRampToValueAtTime(.0001,t+1.2);
    n.connect(bp); bp.connect(g); g.connect(this.master);
    n.start(t); n.stop(t+1.25);
  },
  powerDown(){                               // 💡 ไฟดับทั้งตึก: หม้อแปลงตก + เบรกเกอร์กระแทก
    if(!state.sound) return;
    this.ensure();
    const t=this.ctx.currentTime;
    const o=this.ctx.createOscillator(); o.type='sawtooth';
    o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(24,t+1.5);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.3,t); g.gain.exponentialRampToValueAtTime(.001,t+1.6);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t+1.65);
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();   // เบรกเกอร์ "แช็ก!"
    const hp=this.ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1200;
    const ng=this.ctx.createGain();
    ng.gain.setValueAtTime(.4,t); ng.gain.exponentialRampToValueAtTime(.001,t+.22);
    n.connect(hp); hp.connect(ng); ng.connect(this.master);
    n.start(t); n.stop(t+.25);
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
      && typeof Auth!=='undefined' && Auth.user && typeof NetRoom!=='undefined';
}
/* 🏟️ รอบ 640: เข้า-ออกสนาม/นับหัว/กันล้น/กวาดผี/ไปหาเพื่อน อยู่ใน js/netroom.js แล้ว (ใช้ร่วมทุกโลก 3D)
   ทุกโหมดในไฟล์นี้ (adv/haunt/heli/drone/drive/soccer/mecha) ได้ระบบหลายสนามเหมือนกันหมด */
function netJoin(){
  if(!netReady()) return;
  room=NetRoom.create({
    // 🚁🌳 รอบ 816: เฮลิฯ เมืองกำแพงเพชรเป็น "แผนที่คนละใบ" กับเมืองเฮลิฯ → ห้องแยก ไม่งั้นเห็นเพื่อนลอยผิดที่
    map:(heliKpp()?'helikpp':mode), sendMs:NET_SEND_MS,
    roomMax:(mode==='haunt'?2:0),     // 🏨 รอบ 684: โรงแรมผีสิงเข้าได้ทีละ 2 คน (ผู้ใช้สั่งข้อ 7) · คนที่ 3 ไปสนามถัดไปเอง
    // 🏨 รอบ 686: ป้ายสถานะบน HUD เรียก "โรงแรมหลังที่ N" แทน "สนาม N" ให้ตรงธีม (โลกอื่นยังเป็น "สนาม" เหมือนเดิม)
    roomNoun:(mode==='haunt'?'โรงแรม':undefined),
    roomIcon:(mode==='haunt'?'🏨':undefined),
    roomFmt:(mode==='haunt'?function(i){ return 'หลังที่ '+i; }:undefined),
    hotTs:true,                       // 🔴 โลกขับรถวัด "อัตราชะลอ" จาก ts ต่อแพ็กเก็ต = ไฟเบรกเพื่อน (ดู onPeerData)
    legacyOptional:['tl','hp','cw'],  // โหมดเดิม: rules /world อาจยังไม่รับ 3 ตัวนี้ → NetRoom ตัดทิ้งแล้วส่งซ้ำให้เอง
    push(){ lastSent=null; sendPos(true); },
    onPeer:onPeerData, onPeerGone:removePeer,
    onStatus(){ renderBoard(); },
    toast(html,ms){ showBanner(html,ms); },
  });
  room.join();
  Voice.join();
  podiumJoin();
}
function sendPos(force){
  if(!netUp()) return;
  const now=performance.now();
  if(!force && now-lastNetSend<room.sendGap) return;   // 🧯 คนยิ่งเยอะยิ่งส่งห่างลง (NetRoom คำนวณให้)
  // 👁️ รอบ 394: มุมมองที่ 3 กล้องลอยหลังรถ ~7m — ตำแหน่งที่ประกาศให้เพื่อนต้องเป็น "ตัวรถ" ไม่ใช่กล้อง
  const _px=(M.drive&&dCam3&&carSelfM)?carSelfM.position.x:camera.position.x,
        _pz=(M.drive&&dCam3&&carSelfM)?carSelfM.position.z:camera.position.z;
  const x=Math.round(_px*10)/10, z=Math.round(_pz*10)/10,
        y=Math.round(yaw*100)/100;
  if(!force && lastSent && lastSent.x===x && lastSent.z===z && lastSent.yaw===y) return;
  lastNetSend=now; lastSent={x,z,yaw:y};
  const payload={
    n:onlineDisplayName()+pilotEmoji(state.pilotBadge)+thunderEmoji(state.thunderBadge)+daredevilEmoji(state.daredevilBadge)+glassEmoji(state.glassBadge)+diligentEmoji(state.diligentBadge)+mechaBossEmoji(state.mechaBossBadge)+softLandEmoji(state.perfLandBadge)+airLetterEmoji(state.airLetterBadge),   // 🎖️⚡🎯🏅🪶🪂 เข็มติดท้ายชื่อ (เพื่อนเห็นทุกโลก)
    // 🧱 โลกขับรถ+โลกเดินส่งรหัสตัวบล็อก · 🚁 รอบ 355: โลกเฮลิฯ ยัดเฟสเดินเท้าลง av แทน ('h_w/r/g/p' ≤8 ผ่าน rules เดิม ไม่ต้อง publish — makePeerSprite ฝั่งรับไม่เคยใช้ av ในโหมดบินอยู่แล้ว)
    av:M.heli?('h_'+(hPhase==='pilot'?(pilotShip==='blue'?'b':'p')                      // 🔵 รอบ 392: ขับลำฟ้า='h_b' เพื่อนเห็นลำฟ้า
      :({walk:'w',lift:'w',ride:'r',wing:'g'}[hPhase]||'p')))
      :(mode==='mecha'?('m_'+String(state.mechaRobot||'robot_01').slice(-2))             // 🤖 รอบ 941: 'm_01'..'m_10' (≤8 ผ่าน rules เดิม) — เพื่อนเห็นหุ่นตัวที่เราเลือก
      :(((M.drive||mode==='adv'||mode==='haunt')&&state.blockAv)
        ?state.blockAv+(M.drive?carAvCode():'')                                          // 🚙 รอบ 393: 'blk3c07' — เพื่อนเห็นโมเดลรถสีตรงคันเรา
        :(state.playerAvatar||''))),
    x, z, yaw:y, m:Voice.mic?1:0, w:sessionWords,
    /* 🏟️ รอบ 640: ts ใส่ให้เองโดย NetRoom (hotTs:true) · ชื่อ/คะแนน/แชท ย้ายไป node เย็นแล้ว ไม่ส่งซ้ำทุกเฟรม */
  };
  if(M.heli||M.drone) payload.y=Math.round(camera.position.y*10)/10;   // ความสูงบิน (โหมดเฮลิฯ/โดรน)
  // 🚦 รอบ 132: ไฟเลี้ยว (1=ซ้าย 2=ขวา) — ปิดไม่ส่ง field หายไปเอง (set ทับทั้ง node) · rules ต้องรับ tl ก่อน (RULES.md)
  if(M.drive && netTlOk && tlSig) payload.tl=tlSig;
  // 🚁 รอบ 376: ลำแดงที่จอดทิ้งไว้ (ลงเดิน/ไปนั่งลำอื่น) — เพื่อนเห็นลำเราจอดตรงนั้นจริง
  //    ส่งเฉพาะลำย้ายพ้นลานกลาง >4m (กันลำ default ทุกคนวางซ้อนกลางลาน) · rules ยังไม่รับ hp = ตัดทิ้ง (แพตเทิร์น tl)
  if(M.heli && netHpOk && !(hPhase==='pilot'&&pilotShip==='red') && worlds.heli && worlds.heli.foot){   // 🔵 รอบ 392: ขับลำฟ้าอยู่ ลำแดงจอด=ส่ง hp ต่อ
    const hpH=worlds.heli.foot.pilotH;
    if(Math.hypot(hpH.position.x,hpH.position.z)>4)
      payload.hp=Math.round(hpH.position.x*10)/10+','+Math.round(hpH.position.z*10)/10+','
        +Math.round(hpH.position.y*10)/10+','+Math.round(hpH.rotation.y*100)/100;
  }
  // 🤝 คำเป้าหมายปัจจุบัน — ส่งเฉพาะตอนมีเพื่อนปาร์ตี้(invite กัน)อยู่ในโลกจริง
  // (คนเล่นทั่วไปไม่ส่ง → ไม่ผูกกับ rules ใหม่ ไม่มีทางทำ /world พังถ้ายังไม่ publish)
  if(words[0] && Object.keys(peers).some(uid=>tinvLinked(uid))) payload.cw=words[0].en+'|'+words[0].th;
  // แนบแชทลอยหัวระหว่างยังสด (ct = Date.now คงที่ต่อข้อความ — ฝั่งรับใช้แยกข้อความใหม่/เก่า)
  if(myChat && Date.now()-myChat.ts<BUBBLE_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  /* 🚦🚁 rules ยังไม่รับ field tl/hp → NetRoom ตัดออกแล้วส่งซ้ำให้เอง (legacyOptional) */
  room.send(payload,force);
}
/* ส่งแชทลอยหัว: กรองคำหยาบ + echo ของตัวเองมุมล่าง */
function sendChat(text){
  text=String(text||'').trim().slice(0,CHAT_MAX);
  if(!text) return;
  if(typeof nameHasBadWord==='function' && nameHasBadWord(text)){
    sfx.wrong(); toast('⚠️ ข้อความมีคำไม่สุภาพ ลองพิมพ์ใหม่นะ'); return;
  }
  myChat={text, ts:Date.now()};
  if(netUp()) sendPos(true);
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
/* 🏟️ รอบ 640: NetRoom ส่ง (uid, payload ชื่อฟิลด์เดิม) มาให้ตรง ๆ — โค้ดข้างล่างไม่ต้องแก้ */
function onPeerData(uid,d){
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  d=d||{};
  if(typeof d.x!=='number' || typeof d.z!=='number') return;
  const py=(typeof d.y==='number')?d.y:1.5;
  let p=peers[uid];
  const walkBlk=(mode==='adv'||mode==='haunt'||mode==='soccer');   // 🧱 โลกเดิน/สนามฟุตบอล: เพื่อน = หุ่นบล็อกเดินได้ (มาร่วมเตะในสนามเดียวกัน)
  const mechBlk=(mode==='mecha');                                  // 🤖 รอบ 941: โลกหุ่นยนต์: เพื่อน = หุ่นรบ 3D ตัวที่เขาเลือก (เดิมเป็น sprite รูปโปรไฟล์ — ผู้ใช้ทัก)
  if(!p){
    // 🧱 โลกขับรถ: เพื่อน = รถบล็อก+หุ่นบล็อก 3D หมุนตาม yaw · โลกเดิน = หุ่นบล็อกเดิน · เฮลิฯ/โดรนคง sprite เดิม
    /* 🎖️ รอบ 644: ระดับชั้นของเพื่อนอ่านจาก presence ที่โหลดไว้แล้ว (gradeOf) — ไม่มี field ใหม่ใน /winfo ไม่ต้องแก้ rules */
    const pg=(typeof gradeOf==='function')?gradeOf(uid,d.g):'';
    p=peers[uid]={spr:M.drive?makeBlockPeer(d.n,d.av,uid,pg):mechBlk?makeMechaPeer(d.n,d.av,uid,pg):walkBlk?makeBlockWalkPeer(d.n,d.av,uid,pg):makePeerSprite(d.n,d.av,pg),
                  grade:pg,
                  cur:{x:d.x,z:d.z,y:py}, tgt:{x:d.x,z:d.z,y:py}, n:d.n||'เพื่อน',
                  blk:!!M.drive, walk:walkBlk, mech:mechBlk, av:d.av, yawCur:d.yaw||0, yawTgt:d.yaw||0, stride:0, swing:0};
    p.spr.position.set(d.x,(p.blk||p.walk||p.mech)?0:py,d.z);
    if(p.blk||p.walk||p.mech) p.spr.rotation.y=p.yawCur;
    scene.add(p.spr);
    showBanner(`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> อยู่ในโลกนี้ด้วย!`);
    Voice.onPeer(uid);
  }else if((p.blk||p.walk||p.mech) && d.av!==p.av){
    // เพื่อนออก-เข้าใหม่ด้วยตัวบล็อก/หุ่นตัวอื่น (child_changed) → สร้างตัวใหม่ตามที่เลือก
    scene.remove(p.spr); disposeBlockPeer(p.spr);
    p.av=d.av; p.spr=p.blk?makeBlockPeer(d.n,d.av,uid,p.grade):p.mech?makeMechaPeer(d.n,d.av,uid,p.grade):makeBlockWalkPeer(d.n,d.av,uid,p.grade);
    p.spr.position.set(p.cur.x,0,p.cur.z); p.spr.rotation.y=p.yawCur;
    scene.add(p.spr);
  }else if(M.heli && d.av!==p.av){
    // 🚁 รอบ 355: เพื่อนเปลี่ยนเฟส (เดิน→นั่ง→วิงสูท→ขับ) → วาด sprite ใหม่ให้ตรงอิริยาบถ
    scene.remove(p.spr); p.spr.material.dispose();
    p.av=d.av; p.spr=makePeerSprite(d.n,d.av,p.grade);
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
  p.hp=(typeof d.hp==='string')?d.hp:null;             // 🚁 รอบ 376: ลำแดงเพื่อนจอดทิ้งไว้ "x,z,y,yaw" (tickPeers วาด)
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
  tinvCheck(uid);   // 🤝 รอบ 822: เช็กทุกครั้งที่มีอัปเดตตำแหน่งเข้ามา (ไม่ใช่แค่ตอนเจอครั้งแรก) — ต้องอยู่ด้วยกันต่อเนื่องครบเวลาถึงจ่าย
}
/* 🚁 รอบ 376: เก็บ mesh ลำเพื่อน — geometry/material สร้างต่อลำ dispose ได้ (texture ต่อ material ด้วย · ภาพต้นทางแชร์ใน imgTexCache ไม่โดนแตะ) */
function disposeHeliMesh(h){
  if(h._glbShared) return;   // 🚁 รอบ 382: ลำโมเดลจริงแชร์ geometry/material กับ cache กลาง — ห้าม dispose (ลำอื่นพัง)
  h.traverse(o=>{ if(o.isMesh){ o.geometry.dispose();
    (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ if(m.map)m.map.dispose(); m.dispose(); }); } });
}
function removePeer(uid){
  const p=peers[uid];
  if(!p) return;
  removePeerBubble(p);
  if(p.heliSpr){ scene.remove(p.heliSpr); disposeHeliMesh(p.heliSpr); p.heliSpr=null; }   // 🚁 รอบ 376
  peerRotorStop(p);                                                                        // 🔊 รอบ 386: ปิดเสียงใบพัดเพื่อน
  if(p.flySpr){ scene.remove(p.flySpr); disposeHeliMesh(p.flySpr); p.flySpr=null; }       // 🚁 รอบ 385: ลำบิน 3D
  if(p.micSpr){ scene.remove(p.micSpr); p.micSpr.material.dispose(); p.micSpr=null; }
  Voice.drop(uid);
  scene.remove(p.spr);
  if(p.blk||p.walk||p.mech) disposeBlockPeer(p.spr);              // 🧱🤖 geometry/material แชร์ — dispose เฉพาะป้ายชื่อ
  else{ p.spr.material.map.dispose(); p.spr.material.dispose(); }
  delete peers[uid];
  renderBoard();
}
function netLeave(){
  podiumLeave();
  Voice.leave();
  if(room){ room.leave(); room=null; }        // 🏟️ รอบ 640: ปิด listener + ลบตัวเองออกจากสนาม ครบในตัว
  Object.keys(peers).forEach(removePeer);
}
function tickPeers(dt,now){
  if(room) room.tick(now);                    // 🏟️ รอบ 640: หาสนาม/ลองใหม่ตอนเต็ม/กวาดผีค้าง/ตรวจที่นั่ง
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
      // 🛞 รอบ 393: ล้อหน้าโมเดล GLB หักเลี้ยวตามพวงมาลัยเพื่อน — ย้อน bicycle model จาก yaw rate จริง
      //    (steer=atan(yawRate·WB/v) สูตรเดียวกับฟิสิกส์รถเรา ไม่ต้องส่ง field ใหม่ · จอดนิ่ง=ล้อคืนตรง)
      if(p.spr.userData.steerW&&p.spr.userData.steerW.length){
        const pv=moved/Math.max(dt,.001);
        const st=pv>1.2?Math.max(-CAR_STEER_MAX,Math.min(CAR_STEER_MAX,
          Math.atan((dy*k/Math.max(dt,.001))*CAR_WB/pv))):0;
        p.steerV=(p.steerV||0)+(st-(p.steerV||0))*Math.min(1,dt*7);
        p.spr.userData.steerW.forEach(h=>{ h.rotation.y=p.steerV; });
      }
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
    }else if(p.walk||p.mech){
      // 🧱 หุ่นบล็อกเดิน: หันตาม yaw (lerp ทางสั้น) + แกว่งแขน-ขาตามระยะที่เดินจริง · หยุด=ลู่คืนท่ายืน
      // 🤖 รอบ 941: หุ่นรบเพื่อน (p.mech) ใช้ท่อนี้ด้วย — ตัวสูง ~4.7m ก้าวยาวกว่า จังหวะแกว่งช้าลง (freq 1.3 vs 3.4) + วิ่งเร็วสุด MECHA_VMAX
      const moved=Math.hypot(p.tgt.x-p.cur.x,p.tgt.z-p.cur.z)*k;
      p.stride=(p.stride||0)+moved;
      const fq=p.mech?1.3:3.4, vTop=p.mech?MECHA_VMAX:3;
      const speedN=Math.min(1,(moved/Math.max(dt,.001))/vTop);     // 0..1 ตามความเร็วจริง
      p.swing=(p.swing||0)+(speedN-(p.swing||0))*Math.min(1,dt*8);
      const a=Math.sin(p.stride*fq)*(p.mech?.5:.6)*p.swing;
      const L=p.spr.userData.limbs||[];
      if(L.length===4){ L[0].rotation.x=a; L[1].rotation.x=-a; L[2].rotation.x=-a*.8; L[3].rotation.x=a*.8; }
      p.spr.position.set(p.cur.x,Math.abs(Math.sin(p.stride*fq))*(p.mech?.1:.045)*p.swing,p.cur.z);   // เด้งก้าว (หุ่นย่ำหนักกว่า)
      let dy=p.yawTgt-p.yawCur; dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
      p.yawCur+=dy*k; p.spr.rotation.y=p.yawCur;
    }else{
      p.spr.position.set(p.cur.x,baseY+Math.sin(now/280+p.cur.x)*.05,p.cur.z);
    }
    if(p.bubble){
      if(now>p.bubble.until) removePeerBubble(p);
      else p.bubble.spr.position.set(p.cur.x,p.blk?3.65:p.mech?6.15:p.walk?2.8:baseY+1.6,p.cur.z);   // ลอยตามหัว (ตัวบล็อก/หุ่นรบ: พ้นป้ายชื่อ)
    }
    if(p.micSpr) p.micSpr.position.set(p.cur.x,(p.blk?3.35:p.mech?5.75:p.walk?2.55:baseY+1.22)+Math.sin(now/300)*.06,p.cur.z);
    // 🚁 รอบ 376: วาด/ย้าย/เก็บลำแดงที่เพื่อนจอดทิ้งไว้ (field hp) — สร้าง mesh ครั้งเดียว ขยับเฉพาะค่าเปลี่ยน
    if(M.heli){
      if(p.hp && !p.heliSpr){ p.heliSpr=heliMeshBuild(0xd8342e); scene.add(p.heliSpr); p._hpLast=null; }
      if(!p.hp && p.heliSpr){ scene.remove(p.heliSpr); disposeHeliMesh(p.heliSpr); p.heliSpr=null; }
      if(p.heliSpr && p.hp!==p._hpLast){
        p._hpLast=p.hp;
        const [hx,hz,hy,hyaw]=p.hp.split(',').map(Number);
        if([hx,hz,hy,hyaw].every(isFinite)){ p.heliSpr.position.set(hx,hy,hz); p.heliSpr.rotation.y=hyaw; }
      }
      if(p.heliSpr&&p.heliSpr._rotor) p.heliSpr._rotor.rotation.y+=dt*.6;   // ใบพัดเอื่อยๆ เหมือนลำจอดของเรา
      // 🚁 รอบ 385: เพื่อนที่กำลัง "บิน" = ลำโมเดล 3D จริงหันตาม yaw (ผู้ใช้ทัก "ยังเป็นภาพแบน")
      //    เฟส av: h_p=ขับลำแดง · h_r=นั่งลำฟ้า · เดิน/วิงสูทคง sprite เดิม — ป้ายชื่อยกขึ้นลอยเหนือใบพัด
      const flyCol=p.av==='h_p'?0xd8342e:(p.av==='h_r'||p.av==='h_b')?0x2f7fd4:0;   // 🔵 รอบ 392: h_b=เพื่อนขับลำฟ้า
      if(p.flySpr&&(!flyCol||p._flyCol!==flyCol)){ peerRotorStop(p); scene.remove(p.flySpr); disposeHeliMesh(p.flySpr); p.flySpr=null; }
      if(flyCol&&!p.flySpr){ p.flySpr=heliMeshBuild(flyCol); p._flyCol=flyCol; scene.add(p.flySpr); }
      if(p.flySpr){
        const hy=Math.max(.03,(p.cur.y||1.5)-2.2);        // y ที่ส่งมา = ระดับสายตานักบิน → ฐานลำต่ำกว่า ~2.2ม.
        p.flySpr.position.set(p.cur.x,hy,p.cur.z);
        let dyF=p.yawTgt-p.yawCur; dyF=((dyF+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
        p.yawCur+=dyF*k; p.flySpr.rotation.y=p.yawCur;    // หันหัวลำตามทิศที่เพื่อนหันจริง (lerp ทางสั้น)
        // 🛩️ รอบ 386: เอียงลำเข้าโค้งตามอัตราเลี้ยว + ก้มหัวตามความเร็ว (order YZX = roll/pitch รอบแกนลำหลัง yaw)
        if(p.flySpr.rotation.order!=='YZX') p.flySpr.rotation.order='YZX';
        const spdF=Math.hypot(p.tgt.x-p.cur.x,p.tgt.z-p.cur.z)*k/Math.max(dt,.001);
        const yawRate=dyF*k/Math.max(dt,.001);
        const bankT=Math.max(-.32,Math.min(.32,-yawRate*.55));
        p._bank=(p._bank||0)+(bankT-(p._bank||0))*Math.min(1,dt*4);
        p.flySpr.rotation.z=p._bank;
        const pitT=-Math.min(.52,spdF*.027);              // ลบ = ก้มจมูก (จมูกลำอยู่ -Z · รอบ 390: สูตรเดียวกับกล้องเรา สูงสุด ~30° ตรงกับที่เจ้าของลำเห็น)
        p._pit=(p._pit||0)+(pitT-(p._pit||0))*Math.min(1,dt*3);
        p.flySpr.rotation.x=p._pit;
        if(p.flySpr._rotor) p.flySpr._rotor.rotation.y+=dt*28;
        if(p.flySpr._trotor) p.flySpr._trotor.rotation.x+=dt*46;
        p.spr.position.y=hy+4.6;                          // ป้ายชื่อพ้นวงใบพัด
        heliNavTick(p.flySpr,now,p._ph||(p._ph=Math.random()));   // 🔦 ไฟกลางคืนลำบิน
      }
      heliNavTick(p.heliSpr,now,p._ph||(p._ph=Math.random()));    // 🔦 ลำแดงที่เพื่อนจอดทิ้งไว้ก็มีไฟ
      // 🔊 เสียงใบพัดเพื่อนดังตามระยะจริง 3 แกน (เงียบ ~85ม. · ปิดสวิตช์เสียงเกม = เงียบ)
      const d3=Math.hypot(p.cur.x-camera.position.x,(p.cur.y||1.5)-camera.position.y,p.cur.z-camera.position.z);
      peerRotorTick(p,d3);
    }
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
    if(netUp()) sendPos(true);                               // ประกาศสถานะไมค์ (ไอคอน 🎤 เหนือหัว) ทันที
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
  if(netUp()) sendPos(true);
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

/* ---------- ส่วนลดชวนเพื่อน: อยู่ด้วยกันครบ TINV_TOGETHER_MS = จบเกมด้วยกัน → เงินคืน (ครั้งเดียว/map)
   🤝 รอบ 822: ตัวจับเวลา+จ่ายเงินย้ายไปที่ tinvPartyTick (js/online.js) ใช้ร่วมกับทุกโลก 3D — เรียกทุกครั้งที่มีข้อมูลเพื่อนเข้ามา (ไม่ใช่แค่ตอนเจอครั้งแรก) */
function tinvCheck(uid){
  if(typeof tinvPartyTick !== 'function' || !tinvPartyTick(mode, uid)) return;
  sessionCoins+=TINV_CASHBACK;
  sfx.rankup();
  renderHudTop();
  const nm=peers[uid]?peers[uid].n:'เพื่อน';
  showBanner(`🎊 เล่นจบด้วยกับ <b>${escapeHTML(nm)}</b> ตามคำชวน!<br><span class="adv-ban-coin">รับเงินคืน +${fmtNum(TINV_CASHBACK)} 🪙</span>`);
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
    : `<span class="adv-inv-empty">${(M&&M.soccer)?'⚽ เตะบอลใส่ป้ายตัวอักษรเพื่อเก็บ':'เดินชนตัวอักษรเพื่อเก็บ ✨'}</span>`;   // ⚽ รอบ 399: สนามบอลไม่ได้เดินเก็บ
}
/* ระดับเข็มนักผาดโผนจาก "ชื่อที่ sync มาแล้ว" (เข็มติดท้ายชื่อ) — ไม่ต้องเพิ่ม field/rules ใหม่ */
function ddTierFromName(n){ n=n||''; if(n.indexOf('🔥')>=0) return 3; if(n.indexOf('🌀')>=0) return 2; if(n.indexOf('🎯')>=0) return 1; return 0; }
/* 🏆 กระดานคะแนนสด: ใครประกอบคำได้เยอะสุดรอบนี้ + ท็อปนักผาดโผนในสนาม (me + เพื่อนใน map) */
function renderBoard(){
  if(!hudBoardEl) return;
  const rows=[{n:(state.profileName||'หนู')+pilotEmoji(state.pilotBadge)+thunderEmoji(state.thunderBadge)+daredevilEmoji(state.daredevilBadge)+glassEmoji(state.glassBadge)+diligentEmoji(state.diligentBadge)+mechaBossEmoji(state.mechaBossBadge)+softLandEmoji(state.perfLandBadge)+airLetterEmoji(state.airLetterBadge), w:sessionWords, me:true}];
  /* 🎖️ รอบ 644: ระดับชั้นต่อท้ายชื่อในกระดาน (แถวเป็น nowrap พื้นที่จำกัด — ใต้ชื่ออยู่ที่ป้ายลอยเหนือหัวแทน) */
  rows[0].g=(state.student&&state.student.grade)||'';
  Object.keys(peers).forEach(uid=>rows.push({n:peers[uid].n||'เพื่อน', w:peers[uid].w||0,
    g:peers[uid].grade||((typeof gradeOf==='function')?gradeOf(uid):'')}));
  rows.sort((a,b)=>b.w-a.w);
  const meIdx=rows.findIndex(r=>r.me);
  const row=(r,i)=>`<div class="adv-b-row${r.me?' me':''}">
    <span class="adv-b-nm">${i===0&&r.w>0?'👑':(i+1)+'.'} ${escapeHTML(r.n)}${gradeMark(r.g)}</span><b>${r.w}</b></div>`;
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
  /* 🏟️ รอบ 640: ป้ายบอกสถานะสนาม — เด็กต้องรู้ว่าตัวเองอยู่สนามไหน มีกี่คน และมีทางไปหาเพื่อน */
  const note=room ? room.statusText(innerHeight<430) : '';
  hudBoardEl.innerHTML=`<div class="adv-b-title">🏆 ประกอบคำรอบนี้</div>`+html
    +(note?`<div class="adv-b-room" style="margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.14);font-size:.82em;line-height:1.35;opacity:.93">${note}</div>`:'');
  /* 🏨 รอบ 686: ป้ายเวลาหนีผี (#adv-survive) เดิม top:78px ตายตัว — พอกระดานมีป้ายสถานะโรงแรม (2 คน) ต่อท้าย
     กระดานสูงเกิน 78px ป้ายเวลาซ้อนทับกัน (วัดจริงที่ 812×375) → ให้ตามความสูงจริงของกระดานแทนทุกครั้งที่วาดใหม่ */
  if(mode==='haunt' && hudSurvEl) hudSurvEl.style.top=(hudBoardEl.getBoundingClientRect().bottom+8)+'px';
  if(!hudBoardEl._nrWired){    // ดักคลิกปุ่ม "ไปหาเพื่อน" ครั้งเดียวพอ (innerHTML วาดใหม่ไม่ล้าง listener ที่ตัวแม่)
    hudBoardEl._nrWired=true;
    hudBoardEl.addEventListener('click',e=>{ if(e.target.closest('.nr-go')&&room) room.openFriends(); });
  }
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
  const inKpp=M.drive||heliKpp();                           // 🚁🌳 รอบ 816: เฮลิฯ เหนือเมืองกำแพงเพชรใช้เรดาร์ชุดเดียวกับรถ
  const S=mapCv.width, sc=inKpp? S/620 : S/(HALF*2+8);      // 🚗 เมืองจริงใหญ่ → ซูมเรดาร์ออก (~310m)
  mapCtx.clearRect(0,0,S,S);
  mapCtx.fillStyle=mode==='haunt'?'rgba(18,14,34,.78)':'rgba(20,40,20,.72)';
  mapCtx.beginPath(); mapCtx.arc(S/2,S/2,S/2,0,7); mapCtx.fill();
  if(inKpp && cityMapCv){
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
  st.textContent=window.ADV3D_CSS;   // 🪓 รอบ 544: CSS ทั้งก้อนย้ายไป js/adv3d_css.js (ผ่าไฟล์เฟส 1)
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
    <!-- 🏨 รอบ 684: โรงแรมผีสิง — ป้าย "กด E", ป้ายสอนเปิดไฟฉาย 2 ภาษา, ปุ่มจอสัมผัส -->
    <div class="adv-hud" id="adv-act"></div>
    <div class="adv-hud" id="adv-torchhint">🔦 กด <b>F</b> เพื่อเปิดไฟฉาย<br><i>Press <b>F</b> to turn on the flashlight</i></div>
    <button id="adv-torch">🔦<small>ไฟฉาย</small></button>
    <button id="adv-use">✋<small>ใช้ E</small></button>
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
    <button id="adv-dismount">🚶<small>ลงจากเฮลิฯ</small></button>
    <button id="adv-wing">🪂<small>โดดวิงสูท</small></button>
    <button id="adv-tour">🛬<small>จบทัวร์</small></button>
    <button id="adv-adshop">🪧<small>เช่าป้าย</small></button>
    <button id="adv-wiper">🌧️<small>ที่ปัดน้ำ</small></button>
    <button id="adv-seat">🎚️<small>มุมนั่ง</small></button>
    <!-- ⌨️🚁 รอบ 818: ป้ายบอกปุ่ม Space/Shift ขึ้น-ลง ค้างไว้ทางขวา — เฉพาะคนเล่นด้วยคอมพิวเตอร์ (ผู้ใช้สั่ง) -->
    <div id="adv-keyhint"><b>⌨️ เล่นด้วยคอมพิวเตอร์</b>
      <div class="kh-row"><span class="kh-key" data-k="up">↑</span><span class="kh-tx">เอาเครื่อง<b>ขึ้น</b></span></div>
      <div class="kh-row"><span class="kh-key" data-k="dn">↓</span><span class="kh-tx">เอาเครื่อง<b>ลง</b></span></div>
    </div>
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
    <!-- 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง (ภาพจริงจาก adv-canvas ผ่าน scissor ใน drawCarMirrors) -->
    <div class="adv-mirror" id="adv-mirror-l"></div>
    <div class="adv-mirror" id="adv-mirror-rear"></div>
    <div class="adv-mirror" id="adv-mirror-r"></div>
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
    <!-- ⚽ โหมดสนามฟุตบอล (รอบ 398: เล็งด้วยสติ๊กมือซ้าย #adv-joy แบบ PES — ไม่มีแป้นลูกศรแล้ว) -->
    <button id="adv-kick">⚽<small>เตะ</small></button>
    <div id="adv-curl"></div>       <!-- 🌀 รอบ 400: ป้ายบอกความโค้งที่ตั้งไว้ (โผล่เมื่อปัดปุ่มเตะ) -->
    <!-- 🎱 รอบ 401: หน้าต่างซูมเลือกจุดสัมผัสบอลแบบสนุกเกอร์ (รอบ 403: เปิดค้างตลอด ไม่มีปุ่มปิดแล้ว) -->
    <div id="adv-spinpad">
      <div class="sp-ball"><div class="sp-cross"></div><div class="sp-dot"></div></div>
      <div class="sp-lbl"></div>
    </div>
    <div id="adv-power"><div id="adv-power-fill"></div></div>
    <button id="adv-scam">👁️ มุมกล้อง</button>
    <button id="adv-pk">🎯 จุดโทษ</button>
    <button id="adv-fk">🧱 ฟรีคิก</button>
    <button id="adv-aura">⚡ พลัง 100🪙</button>
    <div id="adv-aurabar"><div class="ab-fill"></div><div class="ab-txt"></div></div>
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
    <div id="adv-soccerstart"><!-- 👕 รอบ 939: ห้องแต่งตัวนักเตะเต็มจอ — พรีวิวสด + เสื้อ/กางเกง/ลาย/เบอร์ -->
      <h3>⚽ ห้องแต่งตัวนักเตะ ⚽</h3>
      <div class="ss-body">
        <div class="ss-left">
          <canvas id="ss-prev" width="300" height="380"></canvas>
          <div class="ss-patname" id="ss-patname"></div>
        </div>
        <div class="ss-right">
          <div class="ss-lab">👕 สีเสื้อ</div>
          <div class="ss-shirts" id="ss-shirts"></div>
          <div class="ss-lab">🩳 สีกางเกง</div>
          <div class="ss-shirts" id="ss-shorts"></div>
          <div class="ss-lab">✨ ลายเสื้อ (สไตล์นักเตะระดับโลก)</div>
          <div class="ss-shirts" id="ss-pats"></div>
          <div class="ss-row">
            <div class="ss-lab" style="margin:0">🔢 เบอร์</div>
            <div class="ss-num"><button id="ss-minus" type="button">−</button><span id="ss-no">10</span><button id="ss-plus" type="button">+</button></div>
            <button id="ss-go" type="button">⚽ ลงสนาม!</button>
          </div>
        </div>
      </div>
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
  holdBtn('#adv-kick',()=>sKickHeld=true,()=>sKickHeld=false);   // 🕹️ รอบ 398: เลิกใช้แป้น ▲▼◀▶ — เล็งด้วยสติ๊กมือซ้ายแบบ PES
  // 🌀 รอบ 400: กดปุ่มเตะค้างแล้ว "ปัดนิ้วซ้าย/ขวา" = ตั้งลูกโค้ง (ชาร์จพลัง+ปั่นในท่าเดียวแบบ PES)
  curlEl=overlayEl.querySelector('#adv-curl');
  const kickBtn=overlayEl.querySelector('#adv-kick');
  let kickX0=null;
  kickBtn.addEventListener('touchstart',e=>{ kickX0=e.changedTouches[0].clientX; sCurl=0; renderCurl(); },{passive:true});
  kickBtn.addEventListener('touchmove',e=>{
    if(kickX0===null) return;
    sCurl=Math.max(-1,Math.min(1,(e.changedTouches[0].clientX-kickX0)/CURL_SWIPE));
    renderCurl();
  },{passive:true});
  const kickEnd=()=>{ kickX0=null; };
  kickBtn.addEventListener('touchend',kickEnd,{passive:true});
  kickBtn.addEventListener('touchcancel',kickEnd,{passive:true});
  // 🎱 รอบ 401: หน้าต่างซูมเลือกจุดสัมผัสบอล (ลาก/แตะได้ทั้งนิ้วและเมาส์)
  spinPadEl=overlayEl.querySelector('#adv-spinpad');
  spinDotEl=overlayEl.querySelector('#adv-spinpad .sp-dot');
  spinLblEl=overlayEl.querySelector('#adv-spinpad .sp-lbl');
  const spBall=overlayEl.querySelector('#adv-spinpad .sp-ball');
  let spDrag=false;
  const spDown=e=>{ e.preventDefault(); e.stopPropagation(); spDrag=true;
    const t=e.touches?e.touches[0]:e; spinPadPick(t.clientX,t.clientY); };
  const spMove=e=>{ if(!spDrag) return; e.preventDefault(); e.stopPropagation();
    const t=e.touches?e.touches[0]:e; spinPadPick(t.clientX,t.clientY); };
  const spUp=()=>{ spDrag=false; };
  spBall.addEventListener('touchstart',spDown,{passive:false});
  spBall.addEventListener('touchmove',spMove,{passive:false});
  spBall.addEventListener('touchend',spUp,{passive:false});
  spBall.addEventListener('touchcancel',spUp,{passive:false});
  spBall.addEventListener('mousedown',spDown);
  window.addEventListener('mousemove',spMove);
  window.addEventListener('mouseup',spUp);
  overlayEl.querySelector('#adv-scam').addEventListener('click',()=>{ if(M.drive) driveCamToggle(); else soccerCam1=!soccerCam1; sfx.select(); });   // 👁️ รอบ 394: ปุ่มเดียวใช้ทั้ง soccer/drive
  overlayEl.querySelector('#adv-pk').addEventListener('click',()=>{ if(pkOn) pkEnd(true); else pkStart(); });   // 🎯 รอบ 397: โหมดจุดโทษ
  overlayEl.querySelector('#adv-fk').addEventListener('click',()=>{ if(!repOn) fkToggle(); });                 // 🧱 รอบ 402: โหมดฟรีคิก
  // ⚡ รอบ 412: ปุ่มซื้อพลังโอเวอร์ไดรฟ์ + แถบเวลา
  auraBtnEl=overlayEl.querySelector('#adv-aura');
  auraBarEl=overlayEl.querySelector('#adv-aurabar');
  auraBtnEl.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); auraBuy(); });
  overlayEl.querySelector('#ss-minus').addEventListener('click',()=>{ let n=Math.max(1,(+sKitNo||10)-1); sKitNo=String(n); overlayEl.querySelector('#ss-no').textContent=sKitNo; if(soccerStartEl&&soccerStartEl._ssPaint) soccerStartEl._ssPaint(); sfx.select(); });
  overlayEl.querySelector('#ss-plus').addEventListener('click',()=>{ let n=Math.min(99,(+sKitNo||10)+1); sKitNo=String(n); overlayEl.querySelector('#ss-no').textContent=sKitNo; if(soccerStartEl&&soccerStartEl._ssPaint) soccerStartEl._ssPaint(); sfx.select(); });
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
  // 🌧️💦 แตะ = วนโหมด (ปิด → หน่วง → ช้า → เร็ว) · กดค้าง = ฉีดน้ำล้างกระจก (รอบ 541)
  const wipBtn=overlayEl.querySelector('#adv-wiper');
  let _wipHold=0, _wipDid=false;
  const wipDown=e=>{ e.preventDefault(); _wipDid=false;
    _wipHold=setTimeout(()=>{ _wipDid=true; washStart(); },WASH_HOLD); };
  const wipUp=e=>{ e.preventDefault(); clearTimeout(_wipHold);
    if(_wipDid) return;                                   // ล้างไปแล้ว — ปล่อยมือไม่ต้องวนโหมด
    sfx.select(); setWiper((wiperMode+1)%4); };
  wipBtn.addEventListener('pointerdown',wipDown);
  wipBtn.addEventListener('pointerup',wipUp);
  wipBtn.addEventListener('pointerleave',()=>clearTimeout(_wipHold));
  wipBtn.addEventListener('click',e=>e.preventDefault());
  overlayEl.querySelector('#adv-seat').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setSeat((seatLevel+1)%3);
  });
  overlayEl.querySelector('#adv-visor').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setVisor(!visorDown);
  });
  overlayEl.querySelector('#adv-light').addEventListener('click',e=>{
    e.preventDefault(); sfx.select(); setHeliLight(!heliLightOn);
  });
  overlayEl.querySelector('#adv-adshop').addEventListener('click',adShopOpen);   // 🪧 รอบ 362: เช่าป้ายโฆษณา
  overlayEl.querySelector('#adv-dismount').addEventListener('click',e=>{   // 🚶 รอบ 375: ลงจากเฮลิฯ ตอนจอด
    e.preventDefault(); endPilot();
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
  overlayEl.querySelector('#adv-help').addEventListener('click',()=>showIntro(introKey(),true));   // รอบ 816: แผนที่ย่อย (helikpp) ได้การ์ดของตัวเอง
  // 🏨 รอบ 684: ปุ่มไฟฉาย/ใช้งาน สำหรับจอสัมผัส (คีย์บอร์ดใช้ F กับ E)
  hActEl=overlayEl.querySelector('#adv-act');
  hTorchHintEl=overlayEl.querySelector('#adv-torchhint');
  hTorchBtn=overlayEl.querySelector('#adv-torch');
  hTorchBtn.addEventListener('click',toggleTorch);
  overlayEl.querySelector('#adv-use').addEventListener('click',hotelAct);
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
/* ⌨️🚁 รอบ 818: มีเมาส์+แป้นพิมพ์จริงไหม (โน้ตบุ๊กจอสัมผัสที่ต่อเมาส์ยังนับเป็นคอม) — ใช้เปิด #adv-keyhint */
const HAS_KBD=window.matchMedia?window.matchMedia('(hover:hover) and (pointer:fine)').matches:!IS_TOUCH;
function bindInput(){
  if(HAS_KBD) overlayEl.classList.add('kbd');
  khUpEl=overlayEl.querySelector('#adv-keyhint .kh-key[data-k="up"]');
  khDnEl=overlayEl.querySelector('#adv-keyhint .kh-key[data-k="dn"]');
  document.addEventListener('keydown',e=>{
    if(!overlayEl.classList.contains('on')) return;
    if(e.target && e.target.tagName==='INPUT') return;     // กำลังพิมพ์แชท
    if(e.code==='Enter' && running){ toggleChatBox(true); e.preventDefault(); return; }
    // 🏨 รอบ 684: F = ไฟฉาย · E = เปิดตู้เสื้อผ้า/กดลิฟต์ (เฉพาะโรงแรมผีสิง)
    if(M.hotel && running && !e.repeat){
      if(e.code==='KeyF'){ toggleTorch(); e.preventDefault(); return; }
      if(e.code==='KeyE'){ hotelAct(); e.preventDefault(); return; }
    }
    if((M.soccer||M.mecha) && (e.code==='Space'||e.code.startsWith('Arrow'))) e.preventDefault();   // ⚽🤖 กันหน้าเลื่อน
    keys[e.code]=true;
  });
  document.addEventListener('keyup',e=>{ keys[e.code]=false; });

  if(!IS_TOUCH){
    canvasEl.addEventListener('click',e=>{
      if(M.soccer) return;                            // ⚽ ฟุตบอลใช้เมาส์กับปุ่ม HUD ไม่ล็อกเคอร์เซอร์
      if(document.pointerLockElement===canvasEl){ if(M.mecha) mechaFire(performance.now()); else shoot(); }
      else lockMouse3D(canvasEl,e);                   // 🖱️🚫 รอบ 833: เครื่องสัมผัสไม่ล็อก (กันกล่องดำของเบราว์เซอร์) — js/util.js
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
      // ⚽ รอบ 398: ฟุตบอลใช้ "สติ๊กมือซ้าย" แบบ PES (ครึ่งซ้าย=เล็ง) · ครึ่งขวาเป็นปุ่มยิงล้วน ไม่มีลากมองรอบ
      for(const t of e.changedTouches){
        if(t.target.closest('#adv-shoot,#adv-horn,#adv-exit,#adv-help,#adv-intro,#adv-banner,#adv-chat-btn,#adv-chat-box,.adv-vbtn,#adv-podium,#adv-reply,#adv-map,#adv-bigmap,#adv-aimpad,#adv-kick,#adv-scam,#adv-pk,#adv-fk,#adv-spinbtn,#adv-spinpad,#adv-soccerstart,.mecha-btn,#adv-wiper,#adv-seat,#adv-skipstart,#adv-visor,#adv-light,#adv-wing,#adv-tour,#adv-adshop,#adv-adshop-dlg,#adv-torch,#adv-use,#adv-act')) continue;   /* รอบ 684: +ไฟฉาย/ปุ่มใช้งานโรงแรมผีสิง */   /* รอบ 346: +ที่ปัดน้ำ/มุมนั่ง/ข้ามสตาร์ท — อยู่ครึ่งขวา ถ้าไม่กันไว้ นิ้วที่กดปุ่มจะกลายเป็นลากคันเร่ง · รอบ 350: +ม่านบังแดด(ตกหล่นจากรอบ 348!)/ไฟส่อง */  /* #adv-words เอาออก — เป็น pointer-events:none แล้ว นิ้วโดนคันบังคับได้ · รอบ 144: +map/bigmap · รอบ 196: +soccer · รอบ 199: +mecha */
        if(!M.mecha && t.clientX<window.innerWidth*.45 && joyId===null){   // 🤖 mecha ใช้ปุ่มบังคับเอง ครึ่งซ้ายไม่เป็นจอย (ลากได้แต่มองรอบครึ่งขวา)
          joyId=t.identifier; joyCx=t.clientX; joyCy=t.clientY;
          joyEl.style.left=(joyCx-55)+'px'; joyEl.style.top=(joyCy-55)+'px'; joyEl.style.bottom='auto';
          joyEl.classList.add('live');                 // รอบ 143: โหมดขับรถซ่อนวงจอยตอนพัก — โชว์เฉพาะตอนใช้จริง
          joy.on=true; joy.dx=0; joy.dy=0;
        }else if(!M.soccer && lookTouch===null){       // ⚽ ฟุตบอลไม่มีลากมองรอบ (ครึ่งขวา = ปุ่มยิงอย่างเดียว)
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
      if(netUp()) sendPos(true);
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
  if(khUpEl){ khUpEl.classList.toggle('on',!!keys.Space); khDnEl.classList.toggle('on',!!(keys.ShiftLeft||keys.ShiftRight||keys.KeyC)); }   // ⌨️ รอบ 821
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
      if(netUp()) sendPos(true);                              // อัปเดตชื่อ+เข็มบนหัวทุกเครื่อง
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
  if(netUp()) sendPos(true);
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
   🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั้งแต่รอบ 778)
   ============================================================ */
/* เส้นทางแบบ Google Maps ใช้ "กริดถนนที่ขับได้" (D.grid · แข็งแรงกว่ากราฟ polyline เพราะเชื่อมทุกแยกอัตโนมัติ) */
/* 🧭 รอบ 284: เส้นทาง GPS ใช้ ngrid (ผิวถนนจริง) — grid ฟิสิกส์ทาเผื่อกว้าง ทำ A* หาเส้น/จุดเลี้ยวนอกถนน */
function cellDrivable(D,gx,gz){ return gx>=0&&gz>=0&&gx<D.GW&&gz<D.GW && (D.ngrid||D.grid)[gz*D.GW+gx]===1; }
/* 🧭 รอบ 782: ค่าผ่านทางของช่อง (1=ผิวถนนจริง · 2=ไหล่ทาง · 4=ติดตึก) → น้ำหนักที่ A* ใช้
   ไหล่ทางแพงกว่านิดเดียว (เส้นทางเกาะถนนจริงแต่ยังลัดผ่านไหล่ทางตรงแยกได้) · ติดตึกแพงมาก (ใช้เมื่อไม่มีทางอื่นจริง ๆ) */
function cellWeight(D,gx,gz){
  if(!D.ncost) return 1;
  const c=D.ncost[gz*D.GW+gx];
  return c===4?9:(c===2?1.35:1);
}
function cellBlocked(D,gx,gz){ return !!D.ncost && D.ncost[gz*D.GW+gx]===4; }
function cellCenter(D,gx,gz){ return {x:gx*D.GS-D.GOFF+D.GS/2, z:gz*D.GS-D.GOFF+D.GS/2}; }
/* ช่องนี้อยู่ในก้อนถนนหลักที่ "ขับไปถึงได้จริง" ไหม (รอบ 782) — ใช้คัดเป้า GPS ไม่ให้ชี้ไปที่ไปไม่ถึง */
function posReachable(D,x,z){
  if(!D.ncomp) return true;
  const gx=Math.floor((x+D.GOFF)/D.GS), gz=Math.floor((z+D.GOFF)/D.GS);
  for(let r=0;r<=3;r++) for(let ox=-r;ox<=r;ox++) for(let oz=-r;oz<=r;oz++){
    if(r>0 && Math.abs(ox)!==r && Math.abs(oz)!==r) continue;
    const nx=gx+ox, nz=gz+oz;
    if(nx>=0&&nz>=0&&nx<D.GW&&nz<D.GW && D.ncomp[nz*D.GW+nx]===D.nmain) return true;
  }
  return false;
}
/* 🚗 รอบ 234: มองเห็นตรงๆบนถนนไหม (สุ่มจุดตามเส้นตรง a→b เช็กทุกช่องว่าเป็นถนน) — ใช้ string-pulling ตัด staircase ของกริด */
function losClear(D,ax,az,bx,bz){
  const dx=bx-ax, dz=bz-az, dist=Math.hypot(dx,dz);
  const steps=Math.max(1, Math.ceil(dist/(D.GS*0.5)));
  for(let i=0;i<=steps;i++){
    const t=i/steps, x=ax+dx*t, z=az+dz*t;
    const gx=Math.floor((x+D.GOFF)/D.GS), gz=Math.floor((z+D.GOFF)/D.GS);
    if(!cellDrivable(D,gx,gz)) return false;
    if(cellBlocked(D,gx,gz)) return false;         // 🧭 รอบ 782: ห้ามลัดเส้นตรงตัดมุมทะลุตึก (เดิมตัดผ่านได้ รถไปติด)
  }
  return true;
}
function nearestDrivableCell(D,x,z){
  const cx=Math.floor((x+D.GOFF)/D.GS), cz=Math.floor((z+D.GOFF)/D.GS);
  let alt=null;                                    // 🧭 รอบ 782: ช่องที่ติดตึกใช้เป็นตัวสำรอง (เลือกช่องโล่งก่อนเสมอ)
  for(let r=0;r<=12;r++) for(let ox=-r;ox<=r;ox++) for(let oz=-r;oz<=r;oz++){
    if(r>0 && Math.abs(ox)!==r && Math.abs(oz)!==r) continue;
    if(!cellDrivable(D,cx+ox,cz+oz)) continue;
    if(!cellBlocked(D,cx+ox,cz+oz)) return [cx+ox,cz+oz];
    if(!alt) alt=[cx+ox,cz+oz];
  }
  return alt;
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
      const ng=gsc[cur]+d[2]*cellWeight(D,nx,nz);   // 🧭 รอบ 782: ถ่วงน้ำหนัก — เกาะผิวถนนจริง เลี่ยงช่องที่ติดตึก
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
  const D=worlds.drive&&worlds.drive.d;
  let best=null,bestD=1e18, bn=null,bnD=1e18, any=null,anyD=1e18;
  letters.forEach(l=>{
    const d=Math.hypot(l.spr.position.x-cx,l.spr.position.z-cz);
    if(d<anyD){ anyD=d; any=l; }
    // 🧭 รอบ 782: ข้ามตัวอักษรที่ "ขับไปไม่ถึง" (นอกก้อนถนนหลัก) — เดิมเลือกมาแล้ว GPS ตก fallback เส้นตรงทะลุทุ่ง
    if(D && !posReachable(D, l.spr.position.x, l.spr.position.z)) return;
    if(d<bestD){ bestD=d; best=l; }
    if((need[l.ch]||0)>0 && d<bnD){ bnD=d; bn=l; }
  });
  gpsTarget = bn||best||any;
}
/* 🔇 รอบ 778 (ผู้ใช้สั่ง): ลบ "เสียงพูดนำทาง GPS" ออกทั้งหมด — เดิมพูดอังกฤษ (Continue straight / Turn left…)
   ผ่าน speechSynthesis ซึ่งบอกทิศผิดบ่อยเมื่อถนนขาดตอน (เช่น "continue straight" ทั้งที่ข้างหน้าไม่มีถนนแล้ว)
   ป้ายนำทางบนจอ (ลูกศร/ระยะ/เลี้ยวซ้าย-ขวา) + เส้นฟ้าบนถนน ยังอยู่ครบเหมือนเดิม */
/* 🧭 รอบ 286: เส้นนำทางสีฟ้าลอยบนถนน (แบบ Google Maps) — ribbon แบนตาม gpsRoute ที่ A* คำนวณ
   วาดใหม่ทุกเฟรม (จุดเริ่ม = ตัวรถ เลื่อนตลอด) ลง buffer จองล่วงหน้า ไม่ alloc ซ้ำ · y=0.09 เหนือเส้นประถนน (.075)
   ข้อต่อใช้ perp เฉลี่ย (miter) เส้นเลยต่อเนื่องไม่มีรอยหักตรงมุมเลี้ยว · route fallback (เชื่อมถนนไม่ถึง) ไม่วาด */
let navLineMesh=null, navLinePos=null;
const NAVLINE_W=1.15, NAVLINE_MAXP=200;                     // ครึ่งกว้าง 1.15ม. · จุดสูงสุด/เส้น
const NAVLINE_SKIP=9;                                       // 🧭 รอบ 782: เว้นหัวเส้นห่างรถ 9 ม. (ไม่งั้นบานเต็มจอ)
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
  /* 🧭 รอบ 782: เริ่มเส้น "ห่างจากรถ NAVLINE_SKIP ม." — เดิมเริ่มที่ตัวรถพอดี ริบบิ้นกว้าง 2.3 ม.
     อยู่ใต้จมูกกล้อง เพอร์สเปกทีฟถ่างเป็นลิ่มสีฟ้าบานเต็มจอ (เห็นในภาพทดสอบ) · แอปนำทางจริงก็เว้นหัวเส้นแบบนี้ */
  let skip=NAVLINE_SKIP;
  while(pts.length>1 && skip>0){
    const d=Math.hypot(pts[1].x-pts[0].x, pts[1].z-pts[0].z);
    if(d>skip){ const t=skip/d;                              // ตัดกลางท่อน — เลื่อนจุดเริ่มไปตามแนวเส้น
      pts[0]={x:pts[0].x+(pts[1].x-pts[0].x)*t, z:pts[0].z+(pts[1].z-pts[0].z)*t}; break; }
    skip-=d; pts.shift();
  }
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
  }
  const box=gpsArrowEl?gpsArrowEl.parentElement.parentElement:null;
  if(!gpsTarget){ if(box) box.style.display='none'; return; }
  if(box) box.style.display='';
  const cx=camera.position.x, cz=camera.position.z;
  const tx=gpsTarget.spr.position.x, tz=gpsTarget.spr.position.z;

  // (re)route ตามถนนจริง — เปลี่ยนเป้า / ออกนอกเส้นทาง / ครบเวลา
  const strayed = gpsRoute && gpsWpi<gpsRoute.length &&
    Math.hypot(gpsRoute[Math.min(gpsWpi,gpsRoute.length-1)].x-cx, gpsRoute[Math.min(gpsWpi,gpsRoute.length-1)].z-cz)>28;
  // 🧭 รอบ 782: ตัวอักษรย้ายที่เอง (relocTick ทุก 75 วิ) โดยยังเป็นตัวเดิม → เส้นทางเก่าค้าง ชี้ไปที่ที่ไม่มีอะไรแล้ว
  const moved = gpsRouteTo && Math.hypot(gpsRouteTo.x-tx, gpsRouteTo.z-tz)>12;
  if(!gpsRoute || gpsRouteFor!==gpsTarget || moved || (now-gpsRouteAt>1200 && strayed)){
    gpsRouteAt=now; gpsRouteFor=gpsTarget; gpsRouteTo={x:tx,z:tz};
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
    } else {                                            // fallback เส้นตรง (เชื่อมถนนไม่ถึง)
      // 🧭 รอบ 782: ติดธง fallback จริง ๆ (เดิมลืมติด → navLineUpdate วาดเส้นฟ้าพาดทุ่ง/ตึกทั้งที่ตั้งใจให้ซ่อน)
      gpsRoute=[{x:tx,z:tz}]; gpsRoute.fallback=true; gpsWpi=0;
    }
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
  // 🧭 รอบ 782 (กฎทอง #1 ป้ายบอกเหตุผล): หาเส้นทางตามถนนไม่ได้ = บอกตรง ๆ ห้ามขึ้น "ตรงไป" หลอกให้ขับชนตึก
  const turnLabel = gpsRoute.fallback ? 'ไม่มีถนนไปถึง'
    : turning ? (turnDist<16 ? {left:'เลี้ยวซ้ายเลย',right:'เลี้ยวขวาเลย'}[turnDir] : {left:'เลี้ยวซ้าย',right:'เลี้ยวขวา'}[turnDir]) : 'ตรงไป';
  if(gpsTurnEl) gpsTurnEl.textContent = turnLabel;
  // 🔇 รอบ 778: เดิมตรงนี้เป็นบล็อก "เสียงนำทางแบบ Google Maps" — ผู้ใช้สั่งลบเสียงออก เหลือนำทางด้วยภาพล้วน
  /* 🧭 รอบ 782: เรียกเส้นนำทางสีฟ้าบนถนน — navLineUpdate เขียนไว้ตั้งแต่รอบ 286 แต่ "ไม่เคยถูกเรียกเลยสักครั้ง"
     (ไล่ git ทุกคอมมิตตั้งแต่วันที่เพิ่ม เจอแค่ตัวนิยาม ไม่มีจุดเรียก) → ผู้เล่นมีแต่ลูกศร+ป้ายมาตลอด
     ตอนนี้เส้นทางเชื่อถือได้แล้ว (เกาะผิวถนน + เลี่ยงตึก) จึงวาดให้เห็นจริง ๆ
     เคส "ไม่มีถนนไปถึง" ธง fallback สั่งซ่อนเส้นเอง = ไม่มีทางวาดเส้นฟ้าพาดทุ่ง */
  navLineUpdate(cx,cz);
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
  // 👁️ รอบ 394: คีย์ V สลับมุมมอง (แบบ soccer) + คืนกล้องมายืนที่ตัวรถก่อนคิดฟิสิกส์ (ฟิสิกส์ยึด camera.position)
  if(keys.KeyV && !dPrevV) driveCamToggle();
  dPrevV=!!keys.KeyV;
  if(dCam3&&carSelfM) camera.position.set(carSelfM.position.x,CAR_EYE,carSelfM.position.z);
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
  camera.rotateX(-.008);                                           // ก้มนิดเดียว เห็นฝากระโปรง (รอบ 805: ลดจาก -.02 ให้เส้นขอบฟ้าสูงขึ้น)
  /* 🏎️ รอบ 142: ตัวถังโคลงตามแรง G ด้านข้างแบบรถจริง (แทนเอียงเข้าโค้งตาม dSteer แบบ arcade เดิม)
     เลนส์ออก "นอกโค้ง" ตามแรงเหวี่ยง · สปริงหน่วงต่ำ (ζ~0.58) → มีโยกตัวซ้าย-ขวาค้างนิดๆ ตอนหักพวง/คืนพวง */
  const latA=yrApplied*dSpeed;                                     // แรง G ด้านข้าง (rad/s × m/s ≈ m/s²)
  const rollTgt=Math.max(-.12,Math.min(.12, latA*.008));
  const sdt=Math.min(dt,.05);                                      // กันสปริงเด้งหลุดตอนเฟรมกระตุก
  dRollV+=((rollTgt-dRoll)*60 - dRollV*9)*sdt;
  dRoll+=dRollV*sdt;
  camera.rotateZ(dRoll);
  // 👁️ รอบ 394: มุมมองที่ 3 — อัปเดตรถตัวเอง (หัน/โคลง/ล้อเลี้ยว/ล้อหมุน/ไฟครบ) แล้วย้ายกล้องลอยตามหลัง
  if(dCam3&&carSelfM){
    carSelfM.position.set(p.x,0,p.z);
    carSelfM.rotation.y=yaw;
    carSelfM.rotation.z=dRoll*1.6;                                 // ตัวถังโคลงแรง G เดียวกับกล้องเดิม (ขยายให้เห็นชัด)
    (carSelfM.userData.steerW||[]).forEach(h=>{ h.rotation.y=-dSteer; });   // ล้อหน้าหักตามพวงมาลัยจริง (ทิศเดียวกับล้อเพื่อน)
    (carSelfM.userData.wheels||[]).forEach(w=>{ w.rotation.x-=dSpeed*dt/.5; });
    const phL=Math.floor(now/400)%2===0;
    (carSelfM.userData.blinkL||[]).forEach(m=>{ m.visible=tlSig===1&&phL; });
    (carSelfM.userData.blinkR||[]).forEach(m=>{ m.visible=tlSig===2&&phL; });
    (carSelfM.userData.brks||[]).forEach(m=>{ m.visible=padBr||(th<0&&dSpeed>.3); });
    (carSelfM.userData.revs||[]).forEach(m=>{ m.visible=dSpeed<-.5; });
    camera.position.set(p.x+Math.sin(dCamYaw)*7.4, 3.15, p.z+Math.cos(dCamYaw)*7.4);
    camera.rotation.set(0,0,0);
    camera.lookAt(p.x,1.65,p.z);
  }

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
  // 🛞 รอบ 394: ไถลแรงพอมีเสียงยาง = ทิ้งรอยยางดำที่ล้อหลังทั้งคู่ ทุก ~0.5m ของระยะที่ไถล
  if((slipPerp-1.6)/6>.06 && Math.abs(dSpeed)>4){
    skidAcc+=_vlen*dt;
    if(skidAcc>.5){
      skidAcc=0;
      const rrx=Math.cos(yaw), rrz=-Math.sin(yaw);                 // แกนขวางตัวรถ (ขวา)
      const bx=p.x+Math.sin(yaw)*1.35, bz=p.z+Math.cos(yaw)*1.35;  // จุดเพลาหลัง
      skidDrop(bx+rrx*.97, bz+rrz*.97, yaw, now);
      skidDrop(bx-rrx*.97, bz-rrz*.97, yaw, now);
    }
  }else skidAcc=.5;                                                // เริ่มไถลปุ๊บทิ้งรอยทันทีคู่แรก
  skidTick(now);
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
   🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
   สูตรเดียวกับ belly cam ของโลกนี้เอง (drawBellyCam ด้านบน) — คนละมุมกล้อง 3 ตัวแทน 1 · ไม่พลิกซ้าย-ขวา
   (พลิกภาพกล้อง 3D จริงต้องกลับ winding order เสี่ยงบั๊กโมเดล — แค่ "เห็นด้านหลัง/ข้างจริง" ก็พอสำหรับเกมนี้)
   #adv-overlay เต็มวิวพอร์ตพอดี (ต่างจาก moto3d.js ที่จอเล็กอยู่ในกรอบเครื่องเกม) → ใช้ window.innerWidth/Height ตรงๆ ได้เลย
   ============================================================ */
const MIRROR_REAR={l:.5,t:82,w:260,h:74,cx:true}, MIRROR_L={l:8,t:0,w:130,h:84,pctT:.38}, MIRROR_R={l:0,t:0,w:130,h:84,pctT:.38,right:8};
let mirrorRearCam=null, mirrorLCam=null, mirrorRCam=null;
function mirrorPass(rect,cam,yawOff,W,H){
  const w=Math.max(1,Math.round(rect.w)), h=Math.max(1,Math.round(rect.h));
  const x=Math.round(rect.right!=null?W-rect.right-w:(rect.cx?rect.l*W-w/2:rect.l));
  const yTop=Math.round(rect.pctT!=null?rect.pctT*H:rect.t);
  const gy=H-yTop-h;                                    // ⚠️ viewport ของ WebGL นับจาก "ล่างซ้าย"
  cam.position.copy(camera.position);
  cam.quaternion.copy(camera.quaternion);
  cam.rotateY(yawOff);
  cam.aspect=w/h; cam.updateProjectionMatrix();
  renderer.setViewport(x,gy,w,h); renderer.setScissor(x,gy,w,h);
  renderer.render(scene,cam);
}
function drawCarMirrors(){
  if(!renderer||!scene||!camera||dCam3) return;
  if(!mirrorRearCam) mirrorRearCam=new THREE.PerspectiveCamera(60,1,.1,220);
  if(!mirrorLCam) mirrorLCam=new THREE.PerspectiveCamera(60,1,.1,220);
  if(!mirrorRCam) mirrorRCam=new THREE.PerspectiveCamera(60,1,.1,220);
  const W=window.innerWidth, H=window.innerHeight;
  renderer.setScissorTest(true);
  mirrorPass(MIRROR_REAR,mirrorRearCam,Math.PI,W,H);
  mirrorPass(MIRROR_L,mirrorLCam,Math.PI*0.72,W,H);
  mirrorPass(MIRROR_R,mirrorRCam,-Math.PI*0.72,W,H);
  renderer.setScissorTest(false);
  renderer.setViewport(0,0,W,H);   // ⚠️ คืนวิวพอร์ตเต็มจอ ไม่งั้นเฟรมถัดไปกล้องหลักจะเหลือแค่มุมเดิม
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
      if(netUp()) sendPos(true);
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
/* 🚪 บานกระจกทางเข้าเทอร์มินัล (รอบ 374) — เลื่อนแยกซ้าย-ขวาเหมือนประตูสนามบิน + เสียงเดียวกับประตูเฮลิฯ */
function entLerp(E,target,k){
  if(!E) return;
  if(E.tgt===undefined) E.tgt=target;
  else if(E.tgt!==target){ E.tgt=target; doorSlideSfx(target===1); }
  E.open+=(target-E.open)*Math.min(1,k);
  E.pL.position.x=-.64-E.open*1.06;
  E.pR.position.x=.64+E.open*1.06;
}
let wSpd=12, wP=0, wBank=0, _footHintAt=0, _stridePh=0;
/* 👟 เสียงฝีเท้าสังเคราะห์ (รอบ 376) — hard=คอนกรีตดาดฟ้า/ล็อบบี้ (ก้องสั้นแหลม) · false=ถนนยางมะตอย (ทุ้มนุ่ม) */
function footStepSfx(hard){
  if(!state.sound) return;
  try{
    HeliSound.ensureCtx();
    const c=HeliSound.ctx, t=c.currentTime;
    const o=c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(hard?150:95,t);
    o.frequency.exponentialRampToValueAtTime(hard?58:40,t+.09);
    const g=c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(hard?.06:.075,t+.008);
    g.gain.exponentialRampToValueAtTime(.0001,t+(hard?.1:.14));
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.16);
    const n=c.createBufferSource(), buf=c.createBuffer(1,900,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.5);
    n.buffer=buf;
    const bp=c.createBiquadFilter(); bp.type=hard?'bandpass':'lowpass';
    bp.frequency.value=hard?3400:900; if(hard) bp.Q.value=1;
    const ng=c.createGain(); ng.gain.value=hard?.05:.03;
    n.connect(bp); bp.connect(ng); ng.connect(c.destination); n.start(t);
  }catch(e){}
}
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
// ── 🚁 รอบ 382: ใช้โมเดลจริง img/models/helicopter.glb แทนลำที่ประกอบด้วยโค้ด (ผู้ใช้สั่ง) ──
//    โหลดครั้งเดียวแล้ว cache → clone ต่อลำ (แชร์ geometry/material — disposeHeliMesh ห้าม dispose ดูธง _glbShared)
//    ลำโค้ดเดิมเก็บไว้เป็น fallback (heliMeshBuildLegacy) เผื่อไฟล์หาย/โหลดพลาด
const HELI_GLB_URL='img/models/helicopter.glb';
// 🔵 รอบ 383: ลำโดยสารใช้ลายฟ้า (texture เดิมย้อม แดง→ฟ้า ด้วย tools — geometry แชร์ลำเดียวกัน)
const HELI_GLB_TEX_BLUE='img/models/helicopter_tex_blue.jpg';
let heliMatBlue=null;
const HELI_GLB_ROTOR=['tripo_part_2','tripo_part_7','tripo_part_8'];                    // ใบพัดหลัก (ชื่อ node ใน glb)
const HELI_GLB_TROTOR=['tripo_part_9','tripo_part_10','tripo_part_19','tripo_part_24']; // ใบพัดหาง+ดุม
let heliGlbSrc=null, heliGlbFail=false; const heliGlbCbs=[];
function heliGlbEnsure(cb){
  if(heliGlbSrc) return cb(heliGlbSrc);
  if(heliGlbFail) return cb(null);
  heliGlbCbs.push(cb);
  if(heliGlbCbs.length>1) return;                    // มีคนโหลดอยู่แล้ว รอ callback เดียวกัน
  const fin=g=>{ heliGlbSrc=g||null; heliGlbFail=!g; heliGlbCbs.splice(0).forEach(f=>f(heliGlbSrc)); };
  const load=()=>{ try{
    new THREE.GLTFLoader().load(HELI_GLB_URL,gl=>{
      // texture ใน glb ถูกตั้ง sRGB แต่ renderer เกมเป็น Linear (default) → ปรับให้โทนตรงกับ texture อื่นของเกม
      gl.scene.traverse(o=>{ if(o.isMesh&&o.material&&o.material.map) o.material.map.encoding=THREE.LinearEncoding; });
      fin(gl.scene);
    },undefined,()=>fin(null));
  }catch(e){ fin(null); } };
  if(THREE.GLTFLoader) load();
  else{ const s=document.createElement('script'); s.src='js/vendor/GLTFLoader.js';
    s.onload=load; s.onerror=()=>fin(null); document.head.appendChild(s); }
}
/* material ลายฟ้า — clone จาก material กลางครั้งเดียว cache แชร์ทุกลำฟ้า (disposeHeliMesh ข้ามอยู่แล้วผ่าน _glbShared) */
function heliMatBlueGet(root){
  if(heliMatBlue) return heliMatBlue;
  let base=null; root.traverse(o=>{ if(!base&&o.isMesh) base=o.material; });
  if(!base) return null;
  heliMatBlue=base.clone();
  const tx=new THREE.TextureLoader().load(HELI_GLB_TEX_BLUE);
  tx.flipY=false;                                    // ⚠️ UV ของ glTF ไม่กลับแกน y — ต้องปิด flip ไม่งั้นลายกลับหัว
  tx.encoding=THREE.LinearEncoding;
  if(base.map){ tx.wrapS=base.map.wrapS; tx.wrapT=base.map.wrapT; }
  heliMatBlue.map=tx;
  return heliMatBlue;
}
/* ประกอบลำจากโมเดลจริงลงกลุ่ม g — จัดทิศ/ขนาด/พื้นให้แทนลำโค้ดเดิมพอดี (ระยะโต้ตอบใน tickHeliFoot ใช้ต่อได้) */
function heliGlbAssemble(g,src,blue){
  const root=src.clone(true);
  if(blue){ const m=heliMatBlueGet(root); if(m) root.traverse(o=>{ if(o.isMesh) o.material=m; }); }
  root.updateMatrixWorld(true);
  // ครอบ pivot ให้ใบพัดหมุนได้ตาม API เดิม (_rotor.rotation.y · _trotor.rotation.x)
  const mkSpin=(names,preYaw)=>{
    const parts=names.map(n=>root.getObjectByName(n)).filter(Boolean);
    if(!parts.length) return null;
    const box=new THREE.Box3(); parts.forEach(p=>box.expandByObject(p));
    const holder=new THREE.Group(); holder.position.copy(box.getCenter(new THREE.Vector3()));
    if(preYaw) holder.rotation.y=preYaw;             // หันแกน x ของ pivot ไปตามแกนใบพัดหาง (โมเดลหมุนรอบแกน z)
    const spin=new THREE.Group(); holder.add(spin); root.add(holder);
    root.updateMatrixWorld(true);
    parts.forEach(p=>spin.attach(p));                // attach คงตำแหน่งโลกเดิม แค่ย้ายไปอยู่ใต้ pivot
    return spin;
  };
  const mr=mkSpin(HELI_GLB_ROTOR,0), tr=mkSpin(HELI_GLB_TROTOR,Math.PI/2);
  // โมเดล Tripo หันหัวไปทาง -X → หมุนให้หัวชี้ -Z ตามลำเดิม แล้วปรับขนาด+วางสกีแตะพื้น+จมูกที่ z เดิม
  root.rotation.y=-Math.PI/2;
  root.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root);
  const s=7.7/(bb.max.z-bb.min.z);                   // ยาวเท่าลำโค้ดเดิม (×HELI_MESH_SCALE ข้างนอก ≈ 12.3ม.)
  root.scale.setScalar(s);
  root.position.set(0,-bb.min.y*s,-2.45-bb.min.z*s); // สกีแตะ y=0 · ปลายจมูก z=-2.45 → ตำแหน่งประตู/ที่นั่งใกล้ลำเดิม
  g.add(root);
  if(mr) g._rotor=mr;
  if(tr) g._trotor=tr;
  // 🔦 รอบ 386: ไฟเดินอากาศ (โชว์เฉพาะกลางคืน — heliNavTick คุม): nav แดงซ้าย/เขียวขวา + บีคอนแดงกะพริบบนบูม + ไฟท้ายขาว
  const nl=new THREE.Group();
  const lamp=(c,x,y,z,r)=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(r||.07,6,5),
    new THREE.MeshBasicMaterial({color:c,transparent:true,fog:false})); m.position.set(x,y,z); nl.add(m); return m; };
  lamp(0xff3b30,-.95,1.1,-1.0);                       // 🔴 nav ซ้าย
  lamp(0x2ecc55,.95,1.1,-1.0);                        // 🟢 nav ขวา
  nl._beacon=lamp(0xff2222,0,2.35,3.6,.09);           // 🔴 บีคอนกะพริบบนบูมหาง
  lamp(0xffffff,0,2.05,5.05,.06);                     // ⚪ ไฟท้าย
  nl.visible=false; g.add(nl); g._nl=nl;
  g._glbShared=true;                                  // geometry/material แชร์กับ cache — disposeHeliMesh ต้องข้าม (ไฟ nl สร้างต่อลำ เล็กมาก ปล่อยตาม GC)
}
/* 🔦 กะพริบไฟเดินอากาศตอนกลางคืน — ใช้ร่วมทั้งลำจอดของฉากและลำเพื่อน (ลำ legacy ไม่มี _nl = ข้าม) */
function heliNavTick(h,now,ph){
  const nl=h&&h._nl; if(!nl) return;
  nl.visible=heliNight>.15;
  if(nl.visible&&nl._beacon) nl._beacon.material.opacity=((now/900+ph)%1)<.16?1:.25;
}
/* 🔊 รอบ 386: เสียงใบพัดลำเพื่อน — แชร์ AudioBuffer จาก HeliSound · gain แยกต่อคน ดังตามระยะ (สไตล์ voice chat)
   ต่อตรง ctx.destination (แพตเทิร์น doorSlideSfx) — ไม่ผ่าน master ที่โดน env ของลำเราหรี่/ปิดตอนไม่ได้บิน */
function peerRotorStop(p){
  if(!p._rs) return;
  try{ p._rs.src.stop(); }catch(e){}
  try{ p._rs.g.disconnect(); }catch(e){}
  p._rs=null;
}
function peerRotorTick(p,d3){
  if(!p.flySpr){ peerRotorStop(p); return; }
  if(!p._rs){
    try{
      HeliSound.probe();                                       // idempotent — เดินเครื่องโหลด buffer ถ้ายังไม่เคย
      if(!(HeliSound.ctx&&HeliSound.files.rotor)) return;      // ยังไม่พร้อม → ลองใหม่เฟรมหน้า
      const src=HeliSound.ctx.createBufferSource();
      src.buffer=HeliSound.files.rotor; src.loop=true;
      src.playbackRate.value=.94+Math.random()*.12;            // แต่ละลำเพี้ยนพิตช์นิดๆ ไม่พร้อมเพรียงปลอม
      const g=HeliSound.ctx.createGain(); g.gain.value=0;
      src.connect(g); g.connect(HeliSound.ctx.destination);
      src.start();
      p._rs={src,g};
    }catch(e){ return; }
  }
  p._rs.g.gain.value=state.sound?Math.max(0,Math.min(.5,(1.05-d3/85)*.5)):0;   // ไกล ~85ม. = เงียบ
}
/* 🔩 รอบ 391: เสียงโลหะกระทบ (ชนตึก/กระแทกพื้นแรง/ชนลำเพื่อน) — สังเคราะห์ล้วน ต่อตรง destination
   เหตุ: thud เดิมเป็นเบสลึก 35-70Hz ลำโพงมือถือเปล่งไม่ได้ ผู้ใช้ทัก "ไม่ได้ยินเสียงตอนชน" */
function heliCrashSfx(hard){
  if(!state.sound) return;
  try{
    HeliSound.ensureCtx();
    const c=HeliSound.ctx; if(!c) return;
    const t=c.currentTime, vol=hard?1:.7;
    // 1) "คลัง!" — พาร์เชียลโลหะไม่เป็นฮาร์โมนิก ดีเคย์ไว + detune สุ่มนิดๆ (ตัวถังเหล็กกระแทก)
    [[326,.5,.28],[547,.38,.22],[831,.3,.18],[1214,.22,.14],[1780,.14,.11]].forEach(([f,g0,dur])=>{
      const o=c.createOscillator(), g=c.createGain();
      o.type='triangle'; o.frequency.setValueAtTime(f*(1+(Math.random()-.5)*.04),t);
      g.gain.setValueAtTime(g0*vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+.02);
    });
    // 2) "ครืด" — noise ผ่าน bandpass สั้นๆ (โลหะเสียดสี)
    const nd=.16, buf=c.createBuffer(1,Math.floor(c.sampleRate*nd),c.sampleRate);
    const ch=buf.getChannelData(0);
    for(let i=0;i<ch.length;i++){ const k=i/ch.length; ch[i]=(Math.random()*2-1)*Math.pow(1-k,1.8); }
    const src=c.createBufferSource(); src.buffer=buf;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2400; bp.Q.value=.8;
    const ng=c.createGain(); ng.gain.setValueAtTime(.55*vol,t); ng.gain.exponentialRampToValueAtTime(.001,t+nd);
    src.connect(bp); bp.connect(ng); ng.connect(c.destination); src.start(t);
    // 3) "ตุ้บ" กลาง 180→55Hz ให้มีน้ำหนัก (เริ่ม 180 = ลำโพงเล็กก็ได้ยิน)
    const o2=c.createOscillator(), g2=c.createGain();
    o2.type='sine'; o2.frequency.setValueAtTime(180,t); o2.frequency.exponentialRampToValueAtTime(55,t+.22);
    g2.gain.setValueAtTime(.6*vol,t); g2.gain.exponentialRampToValueAtTime(.001,t+.28);
    o2.connect(g2); g2.connect(c.destination); o2.start(t); o2.stop(t+.3);
  }catch(e){}
}
function heliMeshBuild(col,accent){
  const g=new THREE.Group();
  g._doorOpen=0;                                      // โมเดลจริงไม่มีบานประตูแยก — คงค่าไว้ให้ doorLerp/testkit อ่านได้
  g._rotor=g._trotor=new THREE.Group();               // dummy กัน tick แตะก่อนโหลดเสร็จ (แทนที่เมื่อประกอบจริง)
  // 📏 รอบ 378: ขยายทั้งลำเป็นสัดส่วนจริงเทียบคน — ระยะโต้ตอบใน tickHeliFoot ขยายตามแล้ว
  g.scale.setScalar(HELI_MESH_SCALE);
  // 🔵 รอบ 383: สีที่ขอโทนฟ้า (ช่อง b > r เช่น ลำโดยสาร 0x2f7fd4 / เทศกาลสงกรานต์) → ใช้ลายฟ้า นอกนั้นลายแดงเดิม
  const blue=((col||0)&0xff)>(((col||0)>>16)&0xff);
  heliGlbEnsure(src=>{ if(src) heliGlbAssemble(g,src,blue); else heliMeshBuildLegacy(g,col,accent); });
  return g;
}
function heliMeshBuildLegacy(g,col,accent){
  // 🚁 รอบ 371: ลำตัวโค้งมนทั้งลำ (ellipsoid) + วัสดุ Phong มีแสงสะท้อน — เลิกทรงกล่องเลโก้
  const bm=new THREE.MeshPhongMaterial({color:col,shininess:52,specular:0x565a60});          // สีตัวถังหลัก (มันเงาโลหะ)
  const dk=new THREE.MeshPhongMaterial({color:0x2a2d33,shininess:24,specular:0x33363b});     // เหล็กเข้ม (ใบพัด/สกี)
  const gl=new THREE.MeshPhongMaterial({color:0x223744,shininess:150,specular:0xaad4ee});    // กระจก highlight ฟ้าจัด
  const wt=new THREE.MeshPhongMaterial({color:accent||0xe8e6df,shininess:52,specular:0x565a60}); // ท้องทูโทน (เทศกาลเปลี่ยนสีได้)
  // 🖼️ รอบ 358: มีไฟล์ texture = แปะอัตโนมัติ (prompt เจนใน PROMPTS_HELI_TEXTURE.md + Artifact)
  //    ⚠️ ภาพต้องเป็น "โทนเทาอ่อนเกือบขาว" — applyTex ใช้ tint คูณทับ ลายเดียวย้อมได้ทุกสีลำ (แดง/ฟ้า/เทศกาล)
  applyTex(bm,'tex_heli_body',2,1,col);              // repeat 2,1 — UV ทรงกลมพันรอบลำ ลายไม่ยืด
  applyTex(wt,'tex_heli_body',2,1,accent||0xe8e6df);
  applyTex(dk,'tex_heli_metal',1,1);
  applyTex(gl,'tex_heli_glass',1,1);                 // 🪟 รอบ 364: กระจกสะท้อนฟ้า
  // ── 🚁 รอบ 380: ลากเส้นขอบข้างตามภาพ Bell 212 จริง (ผู้ใช้ทัก "ลำตัว/หางยังไม่เหมือน") ──
  //    เลิกหยดน้ำ lathe → วาด Shape ข้างลำแล้ว Extrude+bevel: จมูกสั้นมนระดับต่ำ · กระจกหน้าลาดชัน ·
  //    หลังคาแบนยาว · ท้องแบน · ท้ายลำ "ท้องกวาดขึ้น" สอบเข้าโคนบูมสูง — ตรงเส้นขอบนอกภาพอ้างอิง
  const sp=new THREE.Shape();
  sp.moveTo(-2.45,1.05);                        // ปลายจมูก (มน อยู่ระดับกลางลำแบบภาพ)
  sp.quadraticCurveTo(-2.45,.76,-2.0,.64);      // ใต้คางโค้งเข้าท้อง
  sp.lineTo(1.15,.6);                           // ท้องแบนยาวใต้ห้องโดยสาร
  sp.quadraticCurveTo(1.95,.64,2.75,1.52);      // ท้ายลำ: ท้องกวาดขึ้นหาโคนบูม (เอกลักษณ์ 212)
  sp.lineTo(2.75,2.1);                          // คอบูม
  sp.lineTo(-.85,2.08);                         // หลังคาแบนยาว
  sp.lineTo(-1.85,1.48);                        // ลาดกระจกหน้าชัน
  sp.quadraticCurveTo(-2.45,1.32,-2.45,1.05);   // โค้งปิดหน้าจมูก
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(sp,
    {depth:1.24,bevelEnabled:true,bevelThickness:.22,bevelSize:.18,bevelSegments:3,curveSegments:10}),bm);
  hull.rotation.y=-Math.PI/2; hull.position.x=.62; g.add(hull);   // แกนยาว shape → แกน z โลก · จัดกึ่งกลางความกว้าง
  // ── แถบท้องขาว (accent) คาดล่างยาว + ท่อนท้ายเอียงตามท้องกวาดขึ้น — ตามลาย 2 โทนในภาพ ──
  const bellyF=new THREE.Mesh(new THREE.BoxGeometry(1.58,.3,3.25),wt);
  bellyF.position.set(0,.62,-.45); g.add(bellyF);
  const bellyR=new THREE.Mesh(new THREE.BoxGeometry(1.28,.26,1.55),wt);
  bellyR.rotation.x=-.62; bellyR.position.set(0,1.0,1.85); g.add(bellyR);
  // ── กระจกหน้า "แนบลาด" ตามผิวลำ (รอบ 381 — เดิมมุมกลับด้าน ยื่นนูนเหมือนโดม F-16 ผู้ใช้ทัก)
  //    ลาดลำ: (-1.85,1.48)→(-.85,2.08) ชัน .6/1.0 → rotation.x=+1.03 บนพิงหลัง แบนเรียบเสมอผิว
  //    + เสากลางแบ่ง 2 บานแบบ Bell จริง ──
  const shield=new THREE.Mesh(new THREE.BoxGeometry(1.42,1.05,.05),gl);
  shield.rotation.x=1.03; shield.position.set(0,1.8,-1.37); g.add(shield);
  const wpost=new THREE.Mesh(new THREE.BoxGeometry(.07,1.05,.08),dk);
  wpost.rotation.x=1.03; wpost.position.set(0,1.8,-1.38); g.add(wpost);
  [[-.85],[.85]].forEach(([sx])=>{ const w=new THREE.Mesh(new THREE.BoxGeometry(.06,.5,.72),gl);
    w.position.set(sx,1.62,-1.3); g.add(w); });
  [[-.38],[.38]].forEach(([cx])=>{ const w=new THREE.Mesh(new THREE.BoxGeometry(.5,.34,.06),gl);
    w.rotation.x=.5; w.position.set(cx,1.05,-2.2); g.add(w); });
  // ── หน้าต่างห้องโดยสารฝั่งซ้าย (กรอบเข้ม+กระจก นูนจากผิวเล็กน้อยแบบบานจริง) ──
  const winF=new THREE.Mesh(new THREE.BoxGeometry(.05,.56,1.44),dk);
  winF.position.set(-.84,1.52,.15); g.add(winF);      // ผนัง extrude หนาถึง ±.84 (รอบ 380)
  const winL=new THREE.Mesh(new THREE.BoxGeometry(.06,.46,1.32),gl);
  winL.position.set(-.85,1.52,.15); g.add(winL);
  // ── 🚪 ประตูสไลด์จริงฝั่งขวา (รอบ 357) — บานนอกลำวิ่งบนราง 2 เส้นแบบเฮลิฯ ขนส่งจริง ──
  const door=new THREE.Group(); door.position.set(.84,0,0);            // เลื่อนแกน z ของกลุ่มนี้ = ประตูสไลด์
  const doorP=new THREE.Mesh(new THREE.BoxGeometry(.05,1.12,1.35),bm); // บานสีตัวถัง (รอบ 380 ตามภาพ)
  doorP.position.set(0,1.36,.15); door.add(doorP);
  const doorBand=new THREE.Mesh(new THREE.BoxGeometry(.052,.24,1.35),wt); // แถบขาวล่างบานรับกับแถบท้อง
  doorBand.position.set(0,.72,.15); door.add(doorBand);
  const doorW=new THREE.Mesh(new THREE.BoxGeometry(.06,.46,.92),gl);   // หน้าต่างบนบาน
  doorW.position.set(0,1.55,.15); door.add(doorW);
  const doorH=new THREE.Mesh(new THREE.BoxGeometry(.06,.05,.26),dk);   // มือจับ
  doorH.position.set(.01,1.12,-.32); door.add(doorH);
  [[1.98],[.8]].forEach(([ry])=>{ const rail=new THREE.Mesh(new THREE.BoxGeometry(.03,.05,2.6),dk);
    rail.position.set(.85,ry,.6); g.add(rail); });                     // รางบน+ล่าง
  g.add(door);
  g._door=door; g._doorOpen=0;                                         // 0=ปิดสนิท · 1=เลื่อนไปหลังสุด
  // ── ฝาครอบเครื่องยนต์ Twin-Pac แคปซูลมน (ขาวตามลำ) + ช่องรับลม 2 ข้าง + ท่อไอเสียใหญ่เดี่ยวแบบ 212 ──
  const cowl=new THREE.Mesh(new THREE.CapsuleGeometry(.4,1.5,4,12),bm);
  cowl.rotation.x=Math.PI/2; cowl.position.set(0,2.14,.55); g.add(cowl);
  [[-.3],[.3]].forEach(([ix])=>{ const sc=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),dk);
    sc.scale.set(.16,.12,.3); sc.position.set(ix,2.32,-.42); g.add(sc); });
  const exh=new THREE.Mesh(new THREE.CylinderGeometry(.15,.18,.62,12),dk);
  exh.rotation.x=Math.PI/2-.38; exh.position.set(0,2.28,1.72); g.add(exh);
  // ── เสาใบพัด + ดุม/swashplate + ใบหลัก 2 กลีบแยกชิ้น มีมุมกระดก (coning) + flybar Bell ──
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.5,10),dk); mast.position.set(0,2.52,.1); g.add(mast);
  const rotor=new THREE.Group(); rotor.position.set(0,2.74,.1);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.16,.17,.2,12),dk); rotor.add(hub);
  const swash=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,8,16),dk);
  swash.rotation.x=Math.PI/2; swash.position.y=-.11; rotor.add(swash);
  [[1],[-1]].forEach(([s])=>{
    const bl=new THREE.Mesh(new THREE.BoxGeometry(4.15,.05,.36),dk);
    bl.position.x=s*2.22; bl.rotation.z=s*.028; bl.rotation.x=.05*s; rotor.add(bl);   // กระดกปลายขึ้น+มุมพิทช์
    const grip=new THREE.Mesh(new THREE.BoxGeometry(.34,.09,.14),dk);
    grip.position.x=s*.26; rotor.add(grip);
  });
  const fly=new THREE.Mesh(new THREE.BoxGeometry(2.5,.04,.08),dk); fly.rotation.y=Math.PI/2; fly.position.y=-.15; rotor.add(fly);
  [[-1.25],[1.25]].forEach(([fz])=>{ const w=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),dk);
    w.position.set(0,-.15,fz); rotor.add(w); });
  g.add(rotor);
  // ── บูมหางยกสูงต่อแนวหลังคาแบบ 212 (ขาว) + แพนหาง endplate + ครีบตั้งสี col + แฟริ่งเกียร์หาง ──
  const boom=new THREE.Mesh(new THREE.CylinderGeometry(.13,.3,3.9,12),bm);   // บูมสีตัวถัง (รอบ 380 ตามภาพ)
  boom.rotation.x=Math.PI/2; boom.position.set(0,1.85,3.3); g.add(boom);
  const hstab=new THREE.Mesh(new THREE.BoxGeometry(1.75,.05,.44),bm); hstab.position.set(0,1.9,3.4); g.add(hstab);
  [[-.875],[.875]].forEach(([px])=>{ const ep=new THREE.Mesh(new THREE.BoxGeometry(.05,.4,.5),bm);
    ep.position.set(px,1.9,3.4); g.add(ep); });
  const fin=new THREE.Mesh(new THREE.BoxGeometry(.08,1.32,.62),bm);
  fin.position.set(0,2.42,4.95); fin.rotation.x=-.16; g.add(fin);
  const gbox=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),bm);
  gbox.scale.set(.12,.14,.3); gbox.position.set(-.1,2.6,5.0); g.add(gbox);
  const tskid=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.55,8),dk);  // กันหางกระแทก
  tskid.rotation.x=.5; tskid.position.set(0,1.52,4.72); g.add(tskid);
  // ── ใบพัดหาง 2 กลีบ "ฝั่งซ้าย" ตามลำจริง ──
  const trot=new THREE.Group(); trot.position.set(-.18,2.55,5.0);
  const thub=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.12,10),dk); thub.rotation.z=Math.PI/2; trot.add(thub);
  const tblade=new THREE.Mesh(new THREE.BoxGeometry(.05,1.66,.14),dk); trot.add(tblade);
  g.add(trot);
  // ── สกีลงจอด: ราง 2 เส้น + ขาโค้ง 4 จุด ──
  [[-.78],[.78]].forEach(([sx])=>{
    const rail=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,3.4,10),dk);
    rail.rotation.x=Math.PI/2; rail.position.set(sx,.16,-.1); g.add(rail);
    const tip=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.55,10),dk);
    tip.rotation.x=Math.PI/2-.7; tip.position.set(sx,.32,-1.95); g.add(tip);   // ปลายหน้างอนขึ้น
    [[-.95],[.95]].forEach(([lz])=>{
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.62,10),dk);
      leg.rotation.z=sx>0?.42:-.42; leg.position.set(sx*.82,.48,lz); g.add(leg);
    });
  });
  // ── รายละเอียดสมจริง: ไฟนำทางแดงซ้าย/เขียวขวา + บีคอนแดงบนหลัง + ไฟท้ายขาว + เสา pitot + เสาอากาศ ──
  const lamp=(c,x,y,z,r)=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(r||.05,6,5),
    new THREE.MeshBasicMaterial({color:c})); m.position.set(x,y,z); g.add(m); return m; };
  lamp(0xff3b30,-.87,1.3,-1.0);       // 🔴 nav ซ้าย (พ้นผนัง extrude ±.84)
  lamp(0x2ecc55,.87,1.3,-1.0);        // 🟢 nav ขวา
  lamp(0xff2222,0,2.6,1.05,.06);      // 🔴 บีคอนกันชนบนฝาเครื่อง
  lamp(0xffffff,0,3.08,5.2,.04);      // ⚪ ไฟท้ายบนครีบ (บูมยกสูงขึ้นรอบ 377)
  const pitot=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.5,6),dk);
  pitot.rotation.x=Math.PI/2; pitot.position.set(.3,1.32,-2.5); g.add(pitot);
  const ant1=new THREE.Mesh(new THREE.BoxGeometry(.03,.22,.28),dk);   // เสาอากาศครีบบนบูม
  ant1.position.set(0,2.0,2.6); g.add(ant1);
  const ant2=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.34,6),dk); // เสาใต้ท้อง
  ant2.position.set(-.2,.42,.9); g.add(ant2);
  g._rotor=rotor; g._trotor=trot;
  // (สเกล HELI_MESH_SCALE ถูกคูณให้แล้วใน heliMeshBuild — รอบ 382)
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
  // 🚪 รอบ 374: เจาะทางเข้าให้เห็นเป็นประตูจริง (ผู้ใช้แจ้ง "เป็นผนังหน้าต่าง") — ซุ้มประตูกระจก
  //    สไลด์อัตโนมัติแบบสนามบิน แปะทับ facade ตรงช่อง: ช่องมืด+วงกบ+กันสาด+บานกระจก 2 บานเลื่อนเอง
  const ent=new THREE.Group();
  ent.position.set(doorC.x,0,doorC.z); ent.rotation.y=sign.rotation.y;   // local +z = หันออกนอกตึก
  const frM=new THREE.MeshLambertMaterial({color:0x3a3f47});             // วงกบ/กันสาดโลหะเข้ม
  const hole=new THREE.Mesh(new THREE.PlaneGeometry(2.6,3.1),
    new THREE.MeshBasicMaterial({color:0x11141a}));                      // ช่องมืด = โถงข้างใน
  hole.position.set(0,1.55,.06); ent.add(hole);
  [[-1.42],[1.42]].forEach(([px])=>{ const post=new THREE.Mesh(new THREE.BoxGeometry(.22,3.3,.3),frM);
    post.position.set(px,1.65,.1); ent.add(post); });
  const lintel=new THREE.Mesh(new THREE.BoxGeometry(3.06,.3,.3),frM);
  lintel.position.set(0,3.28,.1); ent.add(lintel);
  const awn=new THREE.Mesh(new THREE.BoxGeometry(3.8,.14,1.2),frM);      // กันสาดยื่นหน้า
  awn.position.set(0,3.5,.62); ent.add(awn);
  const step=new THREE.Mesh(new THREE.BoxGeometry(3.4,.1,1.2),
    new THREE.MeshLambertMaterial({color:0x8b9096}));                    // ธรณีประตูคอนกรีต
  step.position.set(0,.05,.5); ent.add(step);
  const glM=new THREE.MeshLambertMaterial({color:0xa8d9e8,transparent:true,opacity:.45});
  const mkPanel=(px)=>{ const p=new THREE.Mesh(new THREE.BoxGeometry(1.26,2.95,.06),glM);
    p.position.set(px,1.52,.14); ent.add(p);
    const bar=new THREE.Mesh(new THREE.BoxGeometry(.08,2.95,.08),frM);   // สันขอบบานฝั่งชนกลาง มองออกว่าเป็น 2 บาน
    bar.position.set(px<0?.6:-.6,0,.01); p.add(bar); return p; };
  const entD={pL:mkPanel(-.64), pR:mkPanel(.64), open:0};
  sc.add(ent);
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
  // 🟢 รอบ 384: วงลิฟต์ "บนดาดฟ้า" แยกจากจุดในล็อบบี้ (ผู้ใช้ส่งภาพ: ลำโมเดลจริงใหญ่จนวงเดิมจ่อข้างลำ
  //    เดินเบียดแล้วเหยียบวงโดนส่งกลับชั้น 1) → เลือกมุมดาดฟ้าที่ไกลลำฟ้าสุดจาก 4 มุม (เยื้องขอบ 1.6 เท่าเดิม)
  let liftRoof={x:liftIn.x,z:liftIn.z}, _farBest=-1;
  [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([sx,sz])=>{
    const c={x:term.x+sx*(w2-1.6), z:term.z+sz*(d2-1.6)};
    const d=Math.hypot(c.x-paxPos.x,c.z-paxPos.z);
    if(d>_farBest){ _farBest=d; liftRoof=c; }
  });
  padR.position.set(liftRoof.x,term.h+.09,liftRoof.z);
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
  return {term,ax,dir,doorC,liftIn,liftRoof,padG,padR,pilotH,paxH,paxPos,rings,fest,entD};
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
  ridePos={x:F.paxH.position.x, y:F.paxH.position.y+1, z:F.paxH.position.z};
  // 🏢 รอบ 392: ทัวร์ห้ามทะลุตึก (ผู้ใช้ทัก "ระบบบินชนตึกมั่ว") — บินที่เพดานสูงกว่าตึกสูงสุด +6ม. ทุกช่วง
  //    ขึ้นตรงๆ จากจุดจอดก่อน → วนเมืองที่เพดานปลอดภัย → กลับมาตั้งลำเหนือเทอร์มินัลแล้วค่อยหย่อนลง
  const clr=Math.max(26, buildings.reduce((m,b)=>Math.max(m,b.h),0)+6);
  const sx=F.paxH.position.x, sz=F.paxH.position.z;
  rideWp=[ {x:sx,y:clr,z:sz},
           {x:0,y:clr,z:0}, {x:-30,y:clr,z:26}, {x:34,y:clr,z:20},
           {x:22,y:clr,z:-30}, {x:-26,y:clr,z:-18},
           {x:termB.x,y:clr,z:termB.z}, {x:termB.x,y:termB.h+9,z:termB.z} ];
  rideIdx=0; rideYaw=0;
  rideSpin=0; _rideDusted=false;                    // 🌪️ เริ่มจากใบพัดนิ่ง ค่อยๆ เร่งก่อนยกตัว
  dustBurst(F.paxPos.x,F.paxPos.y,F.paxPos.z,20);   // ฝุ่นฟุ้งรอบแรกตอนเครื่องติด
  yaw=rideYaw-Math.PI/2;                            // มองออกหน้าต่างขวาเป็นมุมตั้งต้น (ลากมองรอบได้)
  pitch=-.08;
  showBanner('🚁 ออกบินชมเมือง! นั่งริมหน้าต่าง ลากจอมองวิวได้ · พร้อมเมื่อไหร่กด 🪂 โดดวิงสูท');
  if(netUp()) sendPos(true);                           // 💺 เพื่อนเห็นเราเป็นผู้โดยสารทันที
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
    camera.position.set(F.paxPos.x+2.3, termB.h+FOOT_EYE, F.paxPos.z+2.3);   // 📏 ลงข้างลำใหญ่ ไม่โผล่กลางลำ
    showBanner('🛬 จบทัวร์ กลับดาดฟ้าเทอร์มินัล');
    if(netUp()) sendPos(true);
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
  if(netUp()) sendPos(true);                           // 🚁💺 เพื่อนเห็นเราเปลี่ยนเป็นร่มทันที
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
      if(netUp()) sendPos(true);
    }, 1200);
  }
  saveState();
}
/* 🔵💺 รอบ 392: กล่องเลือกบทบาทลำฟ้า (ผู้ใช้สั่ง "เลือกได้ว่าจะขับหรือโดยสาร") — เด้งตอนเดินชิดลำ
   สร้าง DOM ครั้งเดียวแบบ adShopEl · เดินออกห่าง/เปลี่ยนเฟส = ปิดเอง · ปิดแล้วเว้น 2.5วิ กันเด้งรัว */
let paxChoiceEl=null, _paxChoiceCd=0;
function paxChoiceShow(now){
  if(now<_paxChoiceCd || hPhase!=='walk') return;
  if(!paxChoiceEl){
    paxChoiceEl=document.createElement('div');
    paxChoiceEl.id='adv-paxchoice';
    paxChoiceEl.style.cssText='position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.35);z-index:60;pointer-events:auto;';
    paxChoiceEl.innerHTML='<div style="background:#101720;border:2px solid #39ffb2;border-radius:18px;padding:16px 18px;max-width:min(86vw,360px);text-align:center;color:#eaf7ff">'
      +'<div style="font-size:1.05rem;font-weight:700;margin-bottom:10px">🚁 เฮลิคอปเตอร์สีฟ้า (ฟรีทุกคน)</div>'
      +'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'
      +'<button data-act="fly" style="font:inherit;padding:10px 14px;border-radius:12px;border:0;background:#2f7fd4;color:#fff;font-weight:700">🧑‍✈️ ขับเอง</button>'
      +'<button data-act="ride" style="font:inherit;padding:10px 14px;border-radius:12px;border:0;background:#39ffb2;color:#083b2a;font-weight:700">💺 นั่งชมวิว</button>'
      +'<button data-act="x" style="font:inherit;padding:10px 14px;border-radius:12px;border:0;background:#2a313c;color:#cfd8e3">เดินต่อ</button>'
      +'</div></div>';
    overlayEl.appendChild(paxChoiceEl);
    paxChoiceEl.addEventListener('click',e=>{
      const b=e.target.closest('button'); const act=b&&b.dataset.act;
      paxChoiceEl.style.display='none'; _paxChoiceCd=performance.now()+2500;
      if(act==='fly') beginPilot('blue');
      else if(act==='ride') beginRide();
    });
  }
  if(paxChoiceEl.style.display!=='flex'){
    if(document.pointerLockElement) document.exitPointerLock();
    paxChoiceEl.style.display='flex'; sfx.select();
  }
}
function paxChoiceHide(){ if(paxChoiceEl&&paxChoiceEl.style.display==='flex') paxChoiceEl.style.display='none'; }
/* ขับเอง — เดินถึงเฮลิฯ แล้วเรียกอันนี้ · 🔵 รอบ 392: รับ ship ('red'/'blue') — ลำฟ้าทุกคนขับฟรี (ผู้ใช้สั่ง
   "ลำฟ้าให้ผู้เล่นขับ ไม่ใช่ระบบขับ") · ลำแดงขับต้องมีตั๋วเหมือนเดิม */
let _pilotDenyAt=0, pilotShip='red';
function pilotShipMesh(){ const F=worlds.heli&&worlds.heli.foot; return F?(pilotShip==='blue'?F.paxH:F.pilotH):null; }
function beginPilot(ship){
  ship=ship==='blue'?'blue':'red';
  // 🎫 รอบ 356: ขับลำแดงต้องมีตั๋ว — รอบ 392: ลำฟ้าบนดาดฟ้าขับฟรีทุกคน
  if(ship==='red'&&!state.heliTicket){
    const now=performance.now();
    if(now>_pilotDenyAt){ _pilotDenyAt=now+4000;
      sfx.wrong();
      showBanner('🎫 ลำแดงต้องมีตั๋วโลกเฮลิคอปเตอร์ (ซื้อที่หน้าตลาด) — แต่ลำสีฟ้าบนดาดฟ้าตึกป้าย 🛗 ขับฟรีนะ!');
    }
    return;
  }
  const F=worlds.heli.foot;
  pilotShip=ship;
  const M2=ship==='blue'?F.paxH:F.pilotH;
  hPhase='pilot';
  overlayEl.classList.remove('hfoot','show-adshop'); setFootBtns(false,false);
  // 🚶 รอบ 375: ขึ้นขับจากตำแหน่งลำจอดจริง (หลังลงเดิน ลำอาจจอดที่อื่น ไม่ใช่ลานกลางเสมอ)
  const P=M2?M2.position:{x:0,y:.03,z:0};
  camera.position.set(P.x,P.y-.03+HELI_SKID,P.z);
  yaw=M2?M2.rotation.y:.6; pitch=0;
  if(M2) M2.visible=false;                           // เราขึ้นไปนั่งแล้ว — ซ่อนลำที่จอดโชว์
  hVel={x:0,y:0,z:0}; hCol=0; hLanded=true; hHitAt=0; hWarnLvl=0;
  hAtcCleared=false; ATC.reset();
  HeliSound.start();
  hViewSwitched=false; setSeat(0);
  layoutCockpit();
  dustBurst(P.x,P.y+.02,P.z,18);                     // 🌪️ ฝุ่นเริ่มฟุ้งตอนเครื่องติด
  showBanner(ship==='blue'?'🚁 ขึ้นขับลำสีฟ้า (ฟรี)! สตาร์ทเครื่องยนต์...':'🚁 ขึ้นนั่งที่นักบิน! สตาร์ทเครื่องยนต์...');
  if(netUp()) sendPos(true);                           // 🚁 เพื่อนเห็นเราเปลี่ยนเป็นนักบิน (ลำสีตรงกับที่ขับ)
}
/* 🚶 รอบ 375: ลงจากเฮลิฯ ตอนจอดสนิท (ผู้ใช้ขอ) — ลำแดงย้ายมาจอดตรงจุดนี้ ผู้เล่นเดินเล่น/
   ไปนั่งลำฟ้า แล้วเดินกลับมาใกล้ลำ = ขึ้นขับต่อจากที่เดิมได้ */
function endPilot(){
  if(hPhase!=='pilot'||!hLanded) return;
  const F=worlds.heli&&worlds.heli.foot; if(!F) return;   // 🚁🌳 รอบ 816: แผนที่กำแพงเพชรไม่มีเฟสเดินเท้า/ลำจอด (worlds.heli อาจไม่เคยถูกสร้าง)
  wiperSndOff();                                     // 🔇 ลงจากเครื่อง = ปิดเสียงที่ปัดด้วย (รอบ 537)
  sunShade=1; sunBlocked=0; applyCockpitShade();     // 🏢 คืนความสว่างห้องนักบิน (ร.540)
  if(state.sound&&HeliSound.on) HeliSound.shutdown(); else HeliSound.stop();
  const hx=camera.position.x, hz=camera.position.z, fy=heliFloorAt(hx,hz);
  const M2=pilotShip==='blue'?F.paxH:F.pilotH;       // 🔵 รอบ 392: ลำที่ขับอยู่จริงมาจอดตรงนี้
  M2.position.set(hx,fy+.03,hz); M2.rotation.y=yaw; M2.visible=true;
  // หาที่ยืนข้างลำ "พื้นระดับเดียวกัน" (กันโผล่พ้นขอบดาดฟ้า/ในตึก): ประตูขวา → ซ้าย → ท้ายลำ
  const cand=[[Math.cos(yaw),-Math.sin(yaw)],[-Math.cos(yaw),Math.sin(yaw)],[Math.sin(yaw),Math.cos(yaw)]];
  const ok=(tx,tz)=>{ if(Math.abs(footFloorAt(tx,tz,fy+1)-fy)>=1) return false;
    if(fy<1 && buildings.some(b=>Math.abs(tx-b.x)<b.w/2+.5&&Math.abs(tz-b.z)<b.d/2+.5)) return false;
    return true; };
  let px=hx+cand[0][0]*3.2, pz=hz+cand[0][1]*3.2;   // 📏 รอบ 378: ลำใหญ่ขึ้น ยืนห่างออกมาพ้นลำ
  for(const [ox,oz] of cand){ const tx=hx+ox*3.2, tz=hz+oz*3.2; if(ok(tx,tz)){ px=tx; pz=tz; break; } }
  hPhase='walk';
  overlayEl.classList.add('hfoot'); overlayEl.classList.remove('show-dismount');
  setFootBtns(false,false);
  camera.position.set(px,fy+FOOT_EYE,pz); pitch=0;
  showBanner(`🚶 ลงจากเฮลิฯ แล้ว เดินเล่นได้เลย — อยากขับต่อ เดินกลับมาใกล้ลำสี${pilotShip==='blue'?'ฟ้า':'แดง'}`);
  if(netUp()) sendPos(true);                           // เพื่อนเห็นเรากลับเป็นคนเดิน
}
/* วาดกรอบหน้าต่างห้องโดยสาร (เฟส ride) บน canvas เข็ม — เจาะช่องหน้าต่างมนตรงกลาง */
function drawCabinWindow(){
  if(!gaugeCtx) return;
  const c=gaugeCtx, dpr=Math.min(window.devicePixelRatio||1,2);
  const W=window.innerWidth, H=window.innerHeight;
  // 🐛 รอบ 371: โหมดเดินเท้า cockpit ถูกซ่อน (กว้าง 0) → layoutCockpit ไม่เคยตั้งขนาด buffer
  //    ค้างที่ 620×130 แล้วถูก CSS ยืดเต็มจอ = กรอบบวมบังเกินครึ่งจอ — ตั้งเองให้ตรงจอเสมอ
  const cv=gaugeCanvasEl;
  if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){ cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); }
  c.save(); c.setTransform(dpr,0,0,dpr,0,0);
  const mx=W*.055, my=H*.065, r=Math.min(W,H)*.12;   // ขอบบางลง (เดิม .09/.1/.16 — ผู้ใช้บอกบังเยอะ)
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
  adGlowPulse(now);                                  // 📢✨ ป้ายผนังกะพริบหายใจ (รอบ 361)
  heliMusicTick();                                   // 🎬🎵 เพลงตามฉาก (รอบ 369)
  overlayEl.classList.toggle('show-adshop',hPhase==='walk');   // 🪧 ปุ่มเช่าป้ายเฉพาะตอนเดิน (รอบ 362)
  F.pilotH._rotor.rotation.y+=dt*(hPhase==='ride'?0:.6);          // ใบพัดลำจอดหมุนเอื่อยๆ มีชีวิต
  heliNavTick(F.pilotH,now,.1); heliNavTick(F.paxH,now,.55);      // 🔦 รอบ 386: ไฟเดินอากาศลำจอดตอนกลางคืน
  F.paxH.visible=!(hPhase==='ride'||(hPhase==='pilot'&&pilotShip==='blue'));   // 🐛 รอบ 371+392: นั่ง/ขับลำฟ้าอยู่=ซ่อนลำ (กล้องอยู่ในลำ)
  for(const r of F.rings) if(!r.got) r.m.rotation.y+=dt*.5;       // 💫 แหวนหมุนช้าๆ เห็นแต่ไกล
  dustTick(dt);                                                    // 🌪️ ฝุ่นตลบ (ถ้ามี) ฟุ้ง-จาง-ลบตัวเอง
  const p=camera.position;
  // ── 🛗 ลิฟต์ ──
  if(hPhase==='lift'){
    if(now>=liftUntil){
      liftEl.classList.remove('on');
      if(liftToRoof){
        // 🟢 รอบ 384: โผล่ข้างวงดาดฟ้า เยื้อง 1.6 เข้าหากลางดาดฟ้า (พ้นรัศมีวง 1.2 — ไม่โดนส่งกลับลงทันที)
        const vx=termB.x-F.liftRoof.x, vz=termB.z-F.liftRoof.z, vl=Math.hypot(vx,vz)||1;
        camera.position.set(F.liftRoof.x+vx/vl*1.6, termB.h+FOOT_EYE, F.liftRoof.z+vz/vl*1.6);
      }else camera.position.set(F.liftIn.x+1.6, FOOT_EYE, F.liftIn.z);
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
      camera.position.set(ridePos.x+rg.x*1.3, ridePos.y+.55, ridePos.z+rg.z*1.3);   // 📏 นั่งริมหน้าต่างลำใหญ่
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
    camera.position.set(ridePos.x+rgt.x*1.3, ridePos.y+.55, ridePos.z+rgt.z*1.3);   // 📏 รอบ 378: ลำใหญ่ นั่งถัดออกมาถึงแนวหน้าต่าง
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
      if(netUp()) sendPos(true);                       // 🚶 เพื่อนเห็นเรากลับเป็นคนเดิน
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
  // 👟 รอบ 376: เสียงฝีเท้าตามจังหวะก้าวจริง — ดาดฟ้า/ล็อบบี้=คอนกรีตก้อง · พื้นเมือง=ยางมะตอยทุ้ม
  _stridePh+=Math.hypot(nx-p.x,nz-p.z);
  if(_stridePh>1.55){ _stridePh=0; footStepSfx(onRoof||insideTerm(nx,nz,0)); }
  // 🔠 รอบ 376: เดินชนตัวอักษรเก็บได้เลย (เดิมต้องใช้เฮลิฯ ลงจอดเท่านั้น — เด็กไม่มีตั๋วก็เก็บคำได้)
  for(let i=letters.length-1;i>=0;i--){
    const lp=letters[i].spr.position;
    if(Math.hypot(lp.x-nx,lp.z-nz)<1.7 && Math.abs(lp.y-camera.position.y)<2.4) pickUpLetter(i);
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });
  // ── จุดโต้ตอบ ──
  const dLift=Math.hypot(nx-F.liftIn.x,nz-F.liftIn.z);
  const dLiftR=Math.hypot(nx-F.liftRoof.x,nz-F.liftRoof.z);   // 🟢 รอบ 384: วงดาดฟ้าอยู่คนละจุดกับล็อบบี้
  // 🚶 รอบ 375: วัดจากตำแหน่งลำแดงจริง (หลังลงเดิน ลำอาจจอดบนดาดฟ้า/ที่อื่น) + ต้องอยู่ระดับพื้นเดียวกัน
  const pP=F.pilotH.position;
  const dPilot=Math.hypot(nx-pP.x,nz-pP.z);
  const pLv=Math.abs(camera.position.y-pP.y-FOOT_EYE+.03)<1.8;
  // 🔵 รอบ 392: ลำฟ้า = ผู้เล่นขับเอง (ฟรี) — วัดจากตำแหน่งลำจริง+ระดับพื้นเดียวกัน แบบลำแดง (ลำอาจจอดที่อื่นหลังบิน)
  const xP=F.paxH.position;
  const dPax=Math.hypot(nx-xP.x,nz-xP.z);
  const xLv=Math.abs(camera.position.y-xP.y-FOOT_EYE+.03)<1.8;
  const glow=.35+.3*(.5+.5*Math.sin(now/300));
  F.padG.material.opacity=glow; F.padR.material.opacity=glow;
  // 🚪 ประตูสไลด์ต้อนรับ: เดินใกล้ลำไหน บานลำนั้นเลื่อนเปิดเอง (ลำแดงเปิดเฉพาะคนมีตั๋ว · ลำฟ้าเปิดทุกคน)
  //    📏 รอบ 378: ระยะขยายตาม HELI_MESH_SCALE (ลำใหญ่ขึ้น 1.6 เท่า)
  doorLerp(F.paxH,(dPax<6.4&&xLv)?1:0,dt*2.4);
  doorLerp(F.pilotH,(dPilot<5.8&&pLv&&state.heliTicket)?1:0,dt*2.4);
  // 🚪 ประตูกระจกทางเข้าเทอร์มินัลเปิดเองตอนเดินใกล้ (รอบ 374)
  const dEnt=Math.hypot(nx-F.doorC.x,nz-F.doorC.z);
  entLerp(F.entD,(dEnt<3.6&&camera.position.y<3.2)?1:0,dt*2.4);
  if(insideTerm(nx,nz,-.3)&&camera.position.y<3.2){
    if(dLift<1.2){ liftStart(true,now); return; }
    footHint('🛗 เดินไปยืนบนวงแสงเขียว = ขึ้นลิฟต์ไปดาดฟ้า');
  }else if(dPax<5.2&&xLv){
    if(dPax<3.0){ paxChoiceShow(now); }                        // 🔵💺 รอบ 392: เด้งกล่องเลือก ขับเอง/นั่งชมวิว
    else footHint('🚁 เดินชิดเฮลิฯ สีฟ้าอีกนิด = เลือกขับเอง หรือนั่งชมวิว (ฟรี)');
  }else if(onRoof&&insideTerm(nx,nz,-1)){
    if(dLiftR<1.2){ liftStart(false,now); return; }
    footHint('🚁 เฮลิฯ สีฟ้า = ขับเองได้ฟรี · วงแสงเขียว = ลิฟต์ลง · 🪂 โดดจากขอบก็ได้');
  }else if(dPilot<5.2&&pLv){
    if(dPilot<3.0&&state.heliTicket){ beginPilot(); return; }
    if(dPilot<3.0&&!state.heliTicket){ beginPilot(); }   // ไม่มีตั๋ว → เด้งป้ายบอก (คูลดาวน์ในตัว) แล้วเดินต่อได้
    footHint(state.heliTicket?'🚁 เดินชิดเฮลิฯ สีแดงอีกนิด = ขึ้นขับเอง!'
      :'🎫 ลำนี้ต้องมีตั๋วเฮลิฯ ถึงขับได้ — นั่งโดยสารฟรีที่ตึกป้าย 🛗');
  }else if(now>_footHintAt){
    _footHintAt=now+400;
    footHint(onRoof?'🚶 บนดาดฟ้า · เดินชนตัวอักษรเก็บได้เลย · กด 🪂 โดดวิงสูท!'
      :'🚶 เดินสำรวจเมือง · ตึกป้าย 🛗 = ขึ้นดาดฟ้ารอเฮลิฯ · เฮลิฯ แดงลานกลาง = ขับเอง');
  }
  if(dPax>=3.6) paxChoiceHide();                     // 🔵💺 รอบ 392: เดินออกห่างลำฟ้า = กล่องเลือกปิดเอง
  setFootBtns(onRoof&&curFloor>6,false);             // บนดาดฟ้าสูงพอ = โชว์ปุ่มโดดวิงสูท
}
/* 🏢💸 รอบ 392: กฎห้ามบินชนตึก (ผู้ใช้สั่ง) — ชนสะสมครบทุก 10 ครั้ง หัก 100 เหรียญ (นับสะสมข้ามรอบเล่น)
   🪓 รอบ 816: แยกออกมาเป็นฟังก์ชัน — ใช้ร่วมทั้งเมืองเฮลิฯ (buildings[]) และเมืองกำแพงเพชร (solidGrid) */
function heliWallPenalty(now){
  if(now-hHitAt<=1000) return;
  hHitAt=now; damagePlayer(20); HeliSound.thud(); heliCrashSfx(true); nmCrashed=true; nmCombo=0;   // 🔩 รอบ 391: เสียงเหล็กกระทบ
  state.heliWallHits=(state.heliWallHits||0)+1;
  if(state.heliWallHits%10===0){
    state.coins=Math.max(0,state.coins-100); renderHudTop(); sfx.wrong();
    showBanner(`🏢💸 ชนตึกครบ ${state.heliWallHits} ครั้ง! หักค่าซ่อมเมือง <b>100🪙</b> — บินระวังขึ้นนะกัปตัน`);
  }else if(state.heliWallHits%10>=7){
    showBanner(`⚠️ ชนตึกสะสม ${state.heliWallHits%10}/10 ครั้ง — ครบ 10 โดนหัก 100🪙`);
  }
  saveState();
}
function tickHeli(dt,now){
  // 🚶 รอบ 375: จอดสนิท = โชว์ปุ่มลงจากเฮลิฯ (บินอยู่ซ่อน)
  // 🚁🌳 รอบ 816: แผนที่กำแพงเพชรไม่มีเฟสเดินเท้า (ไม่มีตึกเทอร์มินัล/ลิฟต์/ลำจอดโชว์) → ไม่โชว์ปุ่มลงจากเครื่อง
  overlayEl.classList.toggle('show-dismount',!!hLanded && !heliKpp());
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
  if(khUpEl){ khUpEl.classList.toggle('on',!!keys.Space); khDnEl.classList.toggle('on',!!(keys.ShiftLeft||keys.ShiftRight||keys.KeyC)); }   // ⌨️ รอบ 818
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  col+=hCol;                                   // จากลากนิ้วครึ่งขวา (มือถือ)
  col=Math.max(-1,Math.min(1,col));
  yaw+=yawIn*1.5*dt;

  // ---- ฟิสิกส์ ----
  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  if(hLanded){
    if(col>.25 && HeliSound.ready){ hLanded=false; hVel.y=2.5; hAirAt=now; }  // เทคออฟได้เมื่อสตาร์ทเครื่องเสร็จ
  }else{
    // 🚁💨 รอบ 845 (ผู้ใช้สั่ง): บินไวขึ้น 2 เท่า — เดิม equilibrium ~accel/drag (13/1.4≈9.3 m/s) แม้เพดาน clamp 17 ก็แทบไม่ถึง
    //    เพิ่ม accel แนวราบ+ดิ่งเป็น 2 เท่า (drag เท่าเดิม) → equilibrium ใหม่ ~18.6 (2 เท่าเป๊ะ) แล้วขยับเพดาน clamp คู่กันกันโดนตัด
    hVel.x+=(-sin*fw+cos*sd)*26*dt;
    hVel.z+=(-cos*fw-sin*sd)*26*dt;
    hVel.y+=(col*18 - hVel.y*1.8)*dt;          // ไต่/ลดระดับนุ่มๆ auto-hover
    const drag=Math.max(0,1-1.4*dt);
    hVel.x*=drag; hVel.z*=drag;
    const hs=Math.hypot(hVel.x,hVel.z);
    if(hs>34){ hVel.x*=34/hs; hVel.z*=34/hs; }
  }
  let nx=camera.position.x+hVel.x*dt;
  let ny=camera.position.y+hVel.y*dt;
  let nz=camera.position.z+hVel.z*dt;
  if(heliKpp()){
    // 🚁🌳 รอบ 816: เมืองจริงเป็นวงกลมรัศมี D.rad (ไม่ใช่จัตุรัส HALF) → หนีบแบบรัศมีเหมือนโลกขับรถ
    const R=(worlds.drive.d.rad||600)-25, dc=Math.hypot(nx,nz);
    if(dc>R){ const f=R/dc; nx*=f; nz*=f; hVel.x*=.35; hVel.z*=.35; }
    ny=Math.min(HELI_KPP_CEIL,ny);
  }else{
    nx=Math.max(-HALF+2,Math.min(HALF-2,nx));
    nz=Math.max(-HALF+2,Math.min(HALF-2,nz));
    ny=Math.min(60,ny);
  }

  // ---- ชนตึกด้านข้าง: บินต่ำกว่ายอด + ทะลุ footprint → เด้งออก+เจ็บ ----
  if(heliKpp()){
    /* เมืองกำแพงเพชรใช้ solidGrid (ตึกจริง polygon + ตึกแถวกล่องหมุน + เกาะวงเวียน) ไม่มี buildings[]
       ชนแล้ว "คืนตำแหน่งเดิม + เด้งกลับ" (สูตรเดียวกับที่โลกขับรถกันรถลงแม่น้ำ) — ไม่ต้องคำนวณทิศดันออก
       ซึ่งกับ polygon หลายเหลี่ยมทำให้หลุดเข้าไปในตึกได้ */
    if(heliKppBlocked(nx,nz,ny)){
      nx=camera.position.x; nz=camera.position.z;
      hVel.x*=-.25; hVel.z*=-.25;
      heliWallPenalty(now);
    }
  }else for(const b of buildings){
    const inX=Math.abs(nx-b.x)<=b.w/2+.9, inZ=Math.abs(nz-b.z)<=b.d/2+.9;
    if(inX && inZ && ny<b.h-.5){
      const pushX=(nx>b.x?1:-1)*((b.w/2+1)-Math.abs(nx-b.x));
      const pushZ=(nz>b.z?1:-1)*((b.d/2+1)-Math.abs(nz-b.z));
      if(Math.abs(pushX)<Math.abs(pushZ)) nx+=pushX; else nz+=pushZ;
      hVel.x*=-.25; hVel.z*=-.25;
      heliWallPenalty(now);
      break;
    }
  }

  // ---- 💥 รอบ 389: ขับชนเฮลิฯ ผู้เล่นอื่นกลางอากาศ (ผู้ใช้สั่ง) — ฝ่ายพุ่งชนปรับ 500🪙 + เกิดใหม่ลานจอด ----
  //    ฝ่ายถูกชนบินต่อได้ปกติ (ไม่แตะอะไรฝั่งเขา) · ตัดสิน "ใครชน" ฝั่งใครฝั่งมัน: ต้องเคลื่อนที่เร็วพอ
  //    (>3.5 m/s) ตอนแตะลำเพื่อนถึงนับเป็นฝ่ายชน — ลอยนิ่งแล้วโดนเพื่อนพุ่งใส่ เครื่องเพื่อนเป็นคนจ่ายเอง
  if(!hLanded && now-_heliCrashAt>3000 && Math.hypot(hVel.x,hVel.z)>3.5){
    for(const uid in peers){
      const f=peers[uid].flySpr; if(!f) continue;
      if(Math.hypot(nx-f.position.x,nz-f.position.z)<6.2 && Math.abs(ny-(f.position.y+2.2))<3.2){
        _heliCrashAt=now;
        const fine=Math.min(HELI_CRASH_FINE,state.coins);
        state.coins=Math.max(0,state.coins-HELI_CRASH_FINE); saveState(); renderHudTop();
        HeliSound.thud(); heliCrashSfx(true); sfx.wrong();          // 🔩 รอบ 391: เสียงเหล็กกระทบ (thud เดิมเบสลึกเกิน ไม่ได้ยิน)
        dustBurst(nx,Math.max(0,ny-2),nz,26);                       // ควันตลบตรงจุดชนก่อนวาร์ป
        nmCrashed=true; nmCombo=0;
        showBanner(`💥 ชนเฮลิคอปเตอร์ของ <b>${escapeHTML(peers[uid].n)}</b>! เสียค่าปรับ ${fine}🪙 · กลับไปเริ่มใหม่ที่ลานจอด`);
        ATC.say('Midair collision! Return to base immediately, captain.');
        const rs=heliKpp()?heliKppSpawn():{x:0,z:0};                // 🐣 เกิดใหม่ลานจอดกลาง เครื่องจอดสนิท (kpp = ลานหญ้าใกล้หอนาฬิกา รอบ 816)
        nx=rs.x; nz=rs.z; ny=heliFloorAt(nx,nz)+HELI_SKID;
        hVel={x:0,y:0,z:0}; hLanded=true; hCol=0;
        if(netUp()) sendPos(true);                                    // เพื่อนเห็นลำเราวาร์ปกลับลานทันที
        break;
      }
    }
  }

  // ---- พื้น/ดาดฟ้า: แตะพื้นเบา = ลงจอด · กระแทกแรง = เจ็บ ----
  const floor=heliFloorAt(nx,nz), minY=floor+HELI_SKID;
  if(ny<=minY){
    if(hVel.y<-7 && now-hHitAt>1000){ hHitAt=now; damagePlayer(25); HeliSound.thud(); heliCrashSfx(true); ny=minY; hVel.y=2.2; }   // 🔩 รอบ 391
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
  // 🚁 รอบ 388: กดหัวตาม "ความเร็วเดินหน้าจริง" ไม่ใช่แค่คันบังคับ (ผู้ใช้ขอ "บินหน้า หัวต้องกดต่ำ")
  //    ปล่อยคันแต่ลำยังพุ่ง = หัวยังกดค้างเหมือนจริง · บินถอย = เชิดหัว · เข็มขอบฟ้าหน้าปัดขยับตามอัตโนมัติ
  const vFwd=hVel.x*-Math.sin(yaw)+hVel.z*-Math.cos(yaw);      // m/s องค์ประกอบความเร็วไปข้างหน้า
  const tiltIn=hLanded?0:Math.max(-1.2,Math.min(1.5, fw*.6+vFwd/13)), sideIn=hLanded?0:sd;
  hTiltF+=(tiltIn-hTiltF)*Math.min(1,dt*5);
  hTiltS+=(sideIn-hTiltS)*Math.min(1,dt*5);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw);
  camera.rotateX(-hTiltF*.35);                  // กดหัว/เชิดหัวตามการเอียง — รอบ 390: เพดาน 30° (1.5×.35≈.52rad) ภาพนอกเครื่องกดตามเต็มมุม
  camera.rotateZ(-hTiltS*.09);

  // ---- เก็บตัวอักษร: ต้อง "ลงจอดแล้ว" บนดาดฟ้า/พื้นใกล้ตัวอักษร ----
  // 🌳 รอบ 816: บนพื้นที่สีเขียวขยายรัศมีเป็น 5.2 ม. (ที่โล่งกว้าง ไม่มีขอบดาดฟ้าบังคับให้จอดเป๊ะ)
  if(hLanded){
    const grabR=heliKpp()?5.2:3.6;
    for(let i=letters.length-1;i>=0;i--){
      const lp=letters[i].spr.position;
      if(Math.hypot(lp.x-nx,lp.z-nz)<grabR && Math.abs((letters[i].baseY-1.3)-floor)<2) pickUpLetter(i);
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
  washTick(now,dt); grimeTick(dt);                            // 💦🌫️ ที่ฉีดน้ำล้างกระจก + คราบสะสม (รอบ 541)
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
  adGlowPulse(now);                                           // 📢✨ ป้ายผนังกะพริบหายใจ (รอบ 361)
  heliMusicTick();                                            // 🎬🎵 เพลงตามฉาก (รอบ 369)
  adFlybyTick(now);                                           // 🪧💰 โบนัสบินผ่านป้ายตัวเอง (รอบ 366)
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
/* 🕒 รอบ 540: เพิ่มโหมด "หน่วง" (INT) เป็นโหมดที่ 1 — ปัด 1 เที่ยวแล้วพักสั้น ๆ ก่อนปัดใหม่
   ฝนพรำใช้จริงกว่าปัดรัว (ปัดรัวบนกระจกเกือบแห้ง = เอี๊ยดและกวนตา) */
const WIPER_SPD=[0,1.5,1.5,3.1];                // เรเดียน/วิ ต่อโหมด (ปิด/หน่วง/ช้า/เร็ว)
const WIPER_LABEL=['ที่ปัดน้ำ','ปัดหน่วง','ปัดช้า','ปัดเร็ว'];
const INT_GAP=[3400,5200];                      // ms: โหมดหน่วงพักระหว่างเที่ยง (สุ่มในช่วงนี้)
let wiperWaitAt=0;
/* 💦 รอบ 541: ที่ฉีดน้ำล้างกระจก — "กดปุ่ม 🌧️ ค้าง" = พ่นน้ำ + ปัดเร็ว 3 ที แล้วคืนโหมดเดิม
   คราบ/ฝุ่นบนกระจก (grime) สะสมระหว่างบิน เห็นชัดตอนต้องแดด — ล้างแล้วจางลงจริง */
const WASH_MS=900, WASH_STROKES=3, WASH_HOLD=420;   // พ่นน้ำกี่ ms · ปัดกี่ที · กดค้างกี่ ms ถึงนับว่าล้าง
let washUntil=0, washLeft=0, washBackTo=0, grime=.45;
/* 🚰 รอบ 542: ถังน้ำยาล้างกระจกจำกัด — ล้าง 1 ครั้งกินน้ำ 1 หน่วย · จอดสนิทเติมเอง
   หมดถัง = กดค้างก็ไม่พ่น (มี toast บอกให้ร่อนลงเติม) → เด็กต้องวางแผนใช้ */
const WASH_TANK_MAX=5, WASH_REFILL=1.1;             // เต็มถัง 5 ครั้ง · เติม 1.1 หน่วย/วิ ตอนจอด
let washFluid=WASH_TANK_MAX, _washEmptyAt=0;
let sunDir=2.1;                                 // ทิศดวงอาทิตย์ในโลก (เรเดียน) — คำนวณใหม่ตามเวลาจริงใน sunUpdate()
let sunHi=.6, sunWarm=0;                        // ความสูงดวงอาทิตย์ 0-1 · ความอุ่นของแสง 0-1 (เช้า/เย็น=1)
let wiperMode=0, wiperPhase=0, glassCtx=null, glassCanvasEl=null;
/* 🎬 รอบ 533 — "มุมเต็มลำมีชีวิต": สถานะเสริมของชั้นกระจก
   wiperAng   = มุมใบปัดจริงตอนนี้ (ใช้ต่อเนื่องแม้ปิดสวิตช์ → กวาดกลับเข้าท่าจอดก่อนหยุด)
   wiperPark  = กำลังวิ่งกลับท่าจอด (ปิดกลางคันแล้วใบไม่ค้างกลางกระจกอีกต่อไป)
   wiperVel   = ความเร็วเชิงมุม → ใช้ให้ "ปลายใบยางลากตามหลังก้าน" (blade flex)
   smears     = รอยฟิล์มน้ำที่ใบเพิ่งรีดผ่าน จางเองใน ~0.7 วิ (เห็นชัดตอนโดนแดด/ฝน)
   glassMist  = ฝ้าไอน้ำเกาะกระจกตอนหมอกหนา — ที่ปัดรีดออกได้จริง */
let wiperAng=WIPER.rest, wiperPark=false, wiperVel=0, smears=[], glassMist=0;
const SMEAR_LIFE=.72;                           // วินาที: รอยรีดน้ำจางหมด
const CHOP_MIN=6.5, CHOP_MAX=17;                // ครั้ง/วินาที: แสงถูกใบพัดตัด (idle → รอบเต็ม)
/* 🏢🌤️ รอบ 537: แดด "วูบ" ตอนบินหลังตึก — ยิงรังสีจากกล้องไปหาดวงอาทิตย์ แล้วเช็กว่าโดนกล่องตึกบังไหม
   ไม่ต้องแม่นระดับ shadow map — ขอแค่ผ่านหลังตึกแล้วห้องมืดวูบ ผ่านพ้นแล้วสว่างคืน = รู้สึกว่ากำลังบินจริง
   ⚠️ คิดใหม่ทุก ~70ms พอ (ตึกไม่ขยับ) แล้วค่อยหน่วงให้สว่าง/มืดแบบนุ่ม — ยิงทุกเฟรมเปลืองเปล่า */
const SUN_RAY_FAR=95, SUN_RAY_STEPS=13, SUN_DARK=.78;   // ระยะไล่ · จำนวนจุดตรวจ · มืดสุดกี่ %
let sunBlocked=0, sunShade=1, _sunRayAt=0;
function sunRayBlocked(){
  if(!buildings||!buildings.length||!camera) return false;
  // ทิศไปหาดวงอาทิตย์: heading เดียวกับ yaw (หน้า = -sin,-cos) · เงยตามความสูงดวง
  // ⚠️ หนีบมุมเงยไว้ ~46° (ไม่ใช่ 65-90° ตามจริงตอนเที่ยง) — ไม่งั้นรังสีพุ่งพ้นยอดตึกทันที
  //    ผู้เล่นจะไม่มีวันเจอ "แดดวูบ" เลยตอนกลางวัน ทั้งที่กำลังบินซอกตึกอยู่
  const el=.1+Math.min(.62,Math.max(0,sunHi))*1.15;
  const ch=Math.cos(el), dx=-Math.sin(sunDir)*ch, dy=Math.sin(el), dz=-Math.cos(sunDir)*ch;
  const p=camera.position;
  for(let s=1;s<=SUN_RAY_STEPS;s++){
    const t=SUN_RAY_FAR*(s/SUN_RAY_STEPS);
    const x=p.x+dx*t, y=p.y+dy*t, z=p.z+dz*t;
    if(y>260) break;                                   // พ้นตึกสูงสุดแล้ว ไม่มีอะไรบังต่อ
    for(const b of buildings){
      if(y<=b.h && Math.abs(x-b.x)<=b.w/2 && Math.abs(z-b.z)<=b.d/2) return true;
    }
  }
  return false;
}
let _shadeAt=0, _cpFilter='';
function sunShadeTick(now){
  const dt=Math.min(.12,Math.max(0,(now-_shadeAt)/1000)); _shadeAt=now;
  if(now-_sunRayAt>70){ _sunRayAt=now; sunBlocked=sunRayBlocked()?1:0; }
  const tgt=1-SUN_DARK*sunBlocked;
  sunShade+=(tgt-sunShade)*Math.min(1,dt*9);           // วูบเข้า/คืนตัวใน ~0.11 วิ
  shadowSweepTick(dt);                                 // 🏢➡️ ขอบเงากวาดผ่านกระจก (รอบ 541)
  applyCockpitShade();
}
/* 🏢🎛️ รอบ 540: เงาตึกต้องพาดถึง "ในห้องนักบิน" ด้วย — ไม่ใช่หรี่แค่ชั้นกระจก
   หรี่ทั้งภาพกรอบค็อกพิต (z3) และ canvas เข็ม (z4) ด้วย CSS filter ชุดเดียวกัน
   ⚠️ เขียน style เฉพาะตอนค่าเปลี่ยนจริง (ปัดทศนิยม 2 ตำแหน่ง) — เขียนทุกเฟรม = เบราว์เซอร์รีคอมโพสิตฟรี ๆ */
function applyCockpitShade(){
  if(!cockpitEl) return;
  const day=Math.max(0,1-heliNight);
  const k=1-(1-sunShade)*day;                          // กลางคืนไม่มีแดดให้บัง = ไม่ต้องหรี่ซ้ำ
  const f=k>=.995?'':`brightness(${(.66+.34*k).toFixed(2)}) saturate(${(.82+.18*k).toFixed(2)})`;
  if(f===_cpFilter) return;
  _cpFilter=f;
  cockpitEl.style.filter=f;
  if(gaugeCanvasEl) gaugeCanvasEl.style.filter=f;
}
/* 🌀 แสงแดดถูก "ใบพัดตัด" เป็นจังหวะ — ลายเซ็นของการนั่งในเฮลิคอปเตอร์จริง
   คืนค่าตัวคูณความสว่าง 0.75-1 ตามรอบใบพัด (จอด/รอบต่ำ = แทบไม่กะพริบ) */
function rotorChop(now){
  const rpm=Math.max(0,Math.min(1.5,(typeof HeliSound!=='undefined'&&HeliSound.rpm)||0));
  if(rpm<.08) return 1;
  const hz=CHOP_MIN+(CHOP_MAX-CHOP_MIN)*Math.min(1,rpm);
  return 1-.24*Math.min(1,rpm)*(.5+.5*Math.sin(now/1000*hz*Math.PI*2));
}
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
  // 🚁🌳 รอบ 816: เมืองกำแพงเพชรกว้างมาก — ใช้ระยะหมอก/สีฟ้าชุดโลกขับรถ (45/150 ของเมืองเฮลิฯ จะบังทั้งเมือง)
  const fogN0=heliKpp()?MODES.drive.fogN:HELI_FOG_N0, fogF0=heliKpp()?MODES.drive.fogF:HELI_FOG_F0;
  scene.fog.near=fogN0*(1-.86*heliFog);          // 45 → ~6 (มองเห็นใกล้มาก)
  scene.fog.far =fogF0*(1-.74*heliFog);          // 150 → ~39
  _fogSky.set(heliKpp()?MODES.drive.sky:MODES.heli.sky);
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
  // 📢🌙 แสงเรืองขอบป้ายผนัง (รอบ 360) — ติดเมื่อมืดพอ หรี่ตามหมอก · เก็บ base ให้ adGlowPulse ใช้
  const G=worlds.heli&&worlds.heli.adGlows;
  if(G){
    const on=heliNight>.3, op=heliNight*.55*(1-heliFog*.4);
    G.forEach(g=>{ g.visible=on; g.userData.base=op; if(on) g.material.opacity=op; });
  }
}
/* 📢✨ รอบ 361: ป้ายผนังบางป้าย (มี userData.ph) กะพริบหายใจช้าๆ คาบ ~2.8 วิ คนละเฟส —
   เรียกทุกเฟรมคู่กับไฟกันชน (ทั้ง tickHeli+tickHeliFoot) · base opacity มาจาก fogUpdate */
function adGlowPulse(now){
  const G=worlds.heli&&worlds.heli.adGlows;
  if(!G||heliNight<=.3) return;
  for(const g of G){
    if(g.userData.ph===undefined) continue;
    g.material.opacity=(g.userData.base||0)*(.35+.65*(.5+.5*Math.sin(now/446+g.userData.ph)));
  }
}
/* 💧 หยดน้ำบนกระจก — เกิดตอนฝนตก · ถูกที่ปัดกวาดหาย · ความเร็วสูงก็ปลิวหายเอง */
const RAIN_MAX=90, RAIN_SPAWN=26;                // จำนวนหยดสูงสุด · หยด/วินาที ตอนฝนตก
const VISOR_Y=168, VISOR_CUT=.32;                // ม่านลงมาถึง y นี้ (พิกัดในภาพ) · เหลือแสงจ้าแค่ 32%
const RAIN_MIN=42000, RAIN_MAX_GAP=95000;        // ms: ฝนตกทุก ~42-95 วิ
const RAIN_DUR=[14000,26000];                    // ms: ตกนาน 14-26 วิ
let drops=[], rainOn=false, visorDown=false, rainNextAt=0, rainUntilAt=0, rainHeavy=false;
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
  const rate=RAIN_SPAWN*(rainHeavy?1:.4);        // 🌦️ ฝนพรำหยดน้อยกว่า = โหมดหน่วงเอาอยู่จริง
  if(rainOn) for(let i=0;i<rate*dt;i++) addDrop();
  if(rainOn && Math.random()<rate*dt%1) addDrop();
  const blow=Math.min(1,spd/22);                 // บินเร็ว = ลมพัดหยดน้ำหลุดไว
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i];
    // ⚠️ หยดน้ำจริงเกาะกระจกอยู่นาน ไม่ได้ร่วงทันที — ถ้าให้ไหลเร็วจะหลุดพ้นแนวที่ปัดก่อนโดนกวาด
    d.vy=Math.min(16,d.vy+(1.1+d.r*.45)*dt);     // หยดใหญ่ไหลลงเร็วกว่านิดหน่อย
    d.y+=d.vy*dt*(1+blow*2.5);
    // 🎢 รอบ 533: เอียงลำ = น้ำไหลเฉียงไปด้านที่ต่ำกว่า (หยดเล็กโดนลมพัดไวกว่า)
    d.x+=hTiltS*dt*(46+blow*70)/Math.max(1,d.r*.6);
    d.a-=dt*(.035+blow*.45);
    if(d.a<=0||d.y>360) drops.splice(i,1);
  }
}
/* 💦 ที่ฉีดน้ำล้างกระจก (รอบ 541) — กดปุ่มค้าง → พ่นน้ำเป็นละอองบนโซนที่ปัด + ปัดเร็ว 3 ที
   ระหว่างพ่น หยดเยอะ + คราบ (grime) ถูกชะออก · เสร็จแล้วคืนโหมดเดิม */
function addWashDrop(){
  if(drops.length>=RAIN_MAX) return;
  const z=DROP_ZONE[Math.random()<.5?0:1];
  drops.push({x:z[0]+Math.random()*(z[1]-z[0]),
              y:DROP_Y[0]+Math.random()*(DROP_Y[1]-DROP_Y[0]),
              r:1.4+Math.random()*2.6, a:.55+Math.random()*.45, vy:2+Math.random()*3});  // ละอองพ่นแรง ไหลลงเร็ว
}
function washStart(){
  const now=performance.now();
  if(washUntil>now) return;                             // กำลังล้างอยู่ ไม่ซ้อน
  if(washFluid<1){                                      // 🚰 หมดถัง → เตือนให้ลงเติม (คูลดาวน์ toast)
    if(now>_washEmptyAt){ _washEmptyAt=now+5000;
      ATC.say('Washer fluid empty, captain. Land to refill the tank.');
      showBanner&&showBanner('🚰 น้ำยาล้างกระจกหมด — ร่อนลงจอดเพื่อเติมถัง');
      sfx.wrong&&sfx.wrong();
    }
    return;
  }
  washFluid=Math.max(0,washFluid-1);                    // ล้าง 1 ครั้ง กินน้ำ 1 หน่วย
  sfx.select();
  washUntil=now+WASH_MS; washLeft=WASH_STROKES;
  washBackTo=wiperMode;                                 // จำโหมดเดิมไว้คืนหลังล้าง
  setWiper(3);                                          // ปัดเร็วระหว่างล้าง
  washSpraySfx();
  renderWashGauge();
}
/* 🚰 เกจน้ำยาเล็ก ๆ ข้างปุ่มที่ปัด — 5 ขีด ยิ่งเหลือน้อยยิ่งแดง */
function renderWashGauge(){
  const b=overlayEl&&overlayEl.querySelector('#adv-wiper'); if(!b) return;
  let g=b.querySelector('.wfuel');
  if(!g){ g=document.createElement('span'); g.className='wfuel'; b.appendChild(g); }
  const n=Math.round(washFluid), col=n<=1?'#ff5a5a':n<=2?'#ffcc4d':'#8fd0ff';
  g.innerHTML='';
  for(let i=0;i<WASH_TANK_MAX;i++){
    const d=document.createElement('i'); d.style.background=i<n?col:'rgba(255,255,255,.18)';
    g.appendChild(d);
  }
}
function washTick(now,dt){
  // 🚰 จอดสนิท (แตะพื้น) = เติมถังน้ำยาเอง
  if(hLanded && washFluid<WASH_TANK_MAX){
    const was=Math.round(washFluid);
    washFluid=Math.min(WASH_TANK_MAX,washFluid+dt*WASH_REFILL);
    if(Math.round(washFluid)!==was) renderWashGauge();
  }
  if(!washUntil) return;
  if(now<washUntil){                                   // ยังพ่นน้ำ
    for(let i=0;i<46*dt;i++) addWashDrop();
    grime=Math.max(0,grime-dt*1.4);                    // น้ำ+ที่ปัดชะคราบออกเร็ว
  }else if(washLeft>0 && wiperMode===3 && Math.abs(wiperAng-WIPER.rest)<.03){
    washLeft--;                                         // นับครบ 3 ที (ทุกครั้งที่ใบกลับถึงท่าจอด)
    if(washLeft<=0){ setWiper(washBackTo); washUntil=0; }  // คืนโหมดเดิม
  }
}
/* 🌫️ คราบ/ฝุ่นสะสมบนกระจกช้าๆ ระหว่างบิน (ฝนตกก็ล้างเองบางส่วน) — เห็นชัดเฉพาะตอนต้องแดด */
function grimeTick(dt){
  if(rainOn) grime=Math.max(.12,grime-dt*.05);         // ฝนล้างคราบบางส่วน (ไม่หมดเกลี้ยง)
  else grime=Math.min(1,grime+dt*.012);                // แห้ง = ฝุ่นเกาะเพิ่มช้าๆ (เต็มใน ~80 วิ)
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
/* ============================================================
   🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
   มอเตอร์หึ่งตามความเร็วกวาด · "ตุบ" ทุกครั้งที่สุดปลายทาง/กลับเข้าท่าจอด
   · "เอี๊ยด" ยางรีดกระจกแห้ง (ฝนหยุดแล้วยังเปิดที่ปัด — เหมือนที่ปัดรถจริง)
   ต่อตรง ctx.destination แบบเดียวกับ doorSlideSfx (ไม่ผ่าน master ที่โดน env ของลำเราหรี่)
   ============================================================ */
let wSnd=null, _wSideAt=0, _wSqueakAt=0, _wPrevVel=0;
function wiperSndOn(){
  if(!state.sound||wSnd) return;
  try{
    HeliSound.ensureCtx();
    const c=HeliSound.ctx; if(!c) return;
    const o=c.createOscillator(); o.type='sawtooth'; o.frequency.value=57;   // มอเตอร์เล็กใต้แผง
    const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=330; lp.Q.value=.7;
    const g=c.createGain(); g.gain.value=0;
    o.connect(lp); lp.connect(g); g.connect(c.destination); o.start();
    wSnd={c,o,lp,g};
  }catch(e){ wSnd=null; }
}
function wiperSndOff(){
  if(!wSnd) return;
  try{ wSnd.g.gain.value=0; wSnd.o.stop(); wSnd.o.disconnect(); wSnd.g.disconnect(); }catch(e){}
  wSnd=null;
}
/* "ตุบ" ตอนใบถึงสุดทาง — ก้านกระแทกสุดระยะมอเตอร์ */
function wiperThunk(vol){
  if(!state.sound||!wSnd) return;
  try{
    const c=wSnd.c, t=c.currentTime;
    const o=c.createOscillator(), g=c.createGain();
    o.type='sine'; o.frequency.setValueAtTime(128,t); o.frequency.exponentialRampToValueAtTime(58,t+.09);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0008,t+.13);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.15);
  }catch(e){}
}
/* 💦 "ฟู่~" ที่ฉีดน้ำล้างกระจก (รอบ 541) — noise ผ่าน bandpass สูง จาง ๆ ยาวเท่ากับ WASH_MS
   ต่อตรง ctx.destination แบบ doorSlideSfx (ไม่ผ่าน master) — เล่นได้แม้ไม่มี wSnd */
function washSpraySfx(){
  if(!state.sound) return;
  try{
    HeliSound.ensureCtx();
    const c=HeliSound.ctx, t=c.currentTime, dur=WASH_MS/1000;
    const nb=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate);
    const d=nb.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
    const n=c.createBufferSource(); n.buffer=nb;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=.9; bp.frequency.value=2600;
    const g=c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(.03,t+.06);
    g.gain.setValueAtTime(.03,t+dur*.6); g.gain.exponentialRampToValueAtTime(.0006,t+dur);
    n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t); n.stop(t+dur);
  }catch(e){}
}
/* "เอี๊ยด" ยางรีดกระจกแห้ง — noise ผ่าน bandpass กวาดความถี่ตามใบที่ยังเคลื่อน */
function wiperSqueak(){
  if(!state.sound||!wSnd) return;
  try{
    const c=wSnd.c, t=c.currentTime, dur=.3;
    const nb=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate);
    const d=nb.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
    const n=c.createBufferSource(); n.buffer=nb;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=14;
    bp.frequency.setValueAtTime(1250,t); bp.frequency.linearRampToValueAtTime(2050,t+dur);
    const g=c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(.035,t+.06);
    g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t); n.stop(t+dur);
  }catch(e){}
}
/* เรียกทุกเฟรมจาก tickWiper — คุมเสียงมอเตอร์/ตุบ/เอี๊ยด ตามมุมใบจริง */
function wiperSndTick(prev,ang,now){
  if(!state.sound){ wiperSndOff(); return; }
  wiperSndOn();
  if(!wSnd) return;
  // ⚠️ เฟรมที่ "เพิ่งจอดพอดี" ยังมีความเร็วค้างอยู่ — ถ้าไม่บังคับเป็น 0 แล้วลูปหยุด (แท็บพักหลัง)
  //    จะเหลือเสียงหึ่งจาง ๆ ค้างในแท็บ
  const sp=(wiperMode===0&&!wiperPark)?0:Math.abs(wiperVel);
  wSnd.g.gain.value=Math.min(.055,sp*.021);            // ยิ่งกวาดเร็วยิ่งหึ่งดัง · หยุด=เงียบสนิท
  wSnd.lp.frequency.value=300+sp*70;
  // 🔁 "สุดทาง" ของการกวาดแบบโคไซน์คือ *จุดกลับทิศ* — ใบชะลอแล้วย้อนกลับ ไม่เคยข้ามเลยจุดนั้น
  //    เคยพลาด: เช็กแบบ "ข้ามค่า" ((prev-x)*(ang-x)<=0) → ไม่เคยจริงเลยสักครั้ง ไม่มีเสียงตุบออกมา
  if(_wPrevVel*wiperVel<0 && now-_wSideAt>180){
    _wSideAt=now; wiperThunk(Math.abs(ang-WIPER.rest)<WIPER.sweep*.25?.075:.05);   // ฝั่งท่าจอดดังกว่า
  }
  _wPrevVel=wiperVel;
  // กระจกแห้ง (ฝนหยุด หยดเกือบหมด) + ใบยังกวาด = เอี๊ยดเป็นระยะ
  if(!rainOn && drops.length<10 && glassMist<.15 && sp>.5 && now-_wSqueakAt>560+Math.random()*500){
    _wSqueakAt=now; wiperSqueak();
  }
}
function setWiper(mode){
  wiperMode=mode;
  // 🅿️ ปิดกลางคัน = ใบไม่หายวับ ต้องกวาดกลับเข้าท่าจอดก่อน (เหมือนที่ปัดรถจริง)
  if(mode===0) wiperPark=Math.abs(wiperAng-WIPER.rest)>.02;
  else wiperPark=false;
  if(mode!==1) wiperWaitAt=0;                        // ออกจากโหมดหน่วง = ล้างช่วงพักค้าง
  const b=overlayEl&&overlayEl.querySelector('#adv-wiper');
  if(b){ b.classList.toggle('on',mode>0);
    b.querySelector('small').textContent=WIPER_LABEL[mode]; }
}
/* เดินมุมใบปัด 1 เฟรม → คืนมุมที่ต้องวาด (null = ไม่มีใบให้วาด)
   ⚠️ เดินมุมที่เดียวที่นี่เท่านั้น — ทั้งการกวาดหยด/รอยรีดน้ำ/ฝ้า อิงมุมชุดเดียวกัน */
function tickWiper(dt,now){
  const prev=wiperAng;
  now=now||performance.now();
  if(wiperMode>0 && !(wiperMode===1 && now<wiperWaitAt)){  // 🕒 โหมดหน่วง: ระหว่างพัก ใบนอนนิ่งที่ท่าจอด
    wiperPhase+=dt*WIPER_SPD[wiperMode];
    if(wiperMode===1 && wiperPhase>=Math.PI*2){            // ครบ 1 เที่ยว (ไป-กลับ) → นอนพัก
      wiperPhase=0; wiperAng=WIPER.rest;
      wiperWaitAt=now+INT_GAP[0]+Math.random()*(INT_GAP[1]-INT_GAP[0]);
      wiperThunk(.07);                                    // 🔊 "ตุบ" นอนเข้าท่าจอดจบเที่ยว
    }else{
      const t=(Math.cos(wiperPhase)+1)/2;                  // 1=ท่าจอด · 0=สุดปลายทาง (กลับไปกลับมานุ่ม)
      wiperAng=WIPER.rest-WIPER.sweep*(1-t);
    }
  }else if(wiperPark){
    const step=dt*WIPER_SPD[1]*1.25;                      // วิ่งกลับท่าจอดเร็วกว่าโหมดช้านิดหน่อย
    if(Math.abs(WIPER.rest-wiperAng)<=step){ wiperAng=WIPER.rest; wiperPark=false; wiperPhase=0; wiperThunk(.075); }   // 🔊 "ตุบ" เข้าท่าจอด
    else wiperAng+=Math.sign(WIPER.rest-wiperAng)*step;
  }else{ wiperVel=0; wiperSndOff(); return null; }      // 🔇 ใบนิ่งสนิท = ปิดเสียงมอเตอร์
  wiperVel=(wiperAng-prev)/Math.max(dt,1/240);
  if(wiperAng!==prev){
    wipeDrops(prev,wiperAng);
    smears.push({a0:prev,a1:wiperAng,t:SMEAR_LIFE});      // 💦 รอยฟิล์มน้ำที่เพิ่งรีดผ่าน
    if(smears.length>24) smears.shift();
    glassMist=Math.max(0,glassMist-Math.abs(wiperAng-prev)*.55);   // รีดฝ้าออกด้วย
  }
  wiperSndTick(prev,wiperAng,now||performance.now());
  return wiperAng;
}
/* 🏢➡️ รอบ 541: ขอบเงาตึก "กวาดผ่านกระจก" จริง (เดิมหรี่ทั้งบานพร้อมกัน)
   0 = ไม่มีเงา · 1 = เงาคลุมเต็มบาน · ทิศมาจากความเร็วด้านข้างของลำ (บินไปทางขวา = เงามาจากขวา)
   ⚠️ อัปเดตใน sunShadeTick (เรียกจาก drawGauges ทุกมุมมอง) แต่วาดเฉพาะมุมเต็มลำใน drawGlass */
const SH_SWEEP=.34;                                     // วินาที: ขอบเงากวาดข้ามกระจก
let shEdge=0, shDir=1;
function shadowSweepTick(dt){
  const tgt=sunBlocked?1:0;
  if(Math.abs(tgt-shEdge)<.001){ shEdge=tgt; return; }
  if((tgt>shEdge&&shEdge<=0)||(tgt<shEdge&&shEdge>=1)){  // เริ่มรอบใหม่ = จับทิศ ณ ตอนนั้น
    const lat=hVel.x*Math.cos(yaw)-hVel.z*Math.sin(yaw); // ความเร็วด้านข้าง (+ = ไถลไปทางขวา)
    shDir=lat>=0?1:-1;
  }
  shEdge+=Math.sign(tgt-shEdge)*Math.min(Math.abs(tgt-shEdge),dt/SH_SWEEP);
}
/* 🌃 แสงไฟเมืองสะท้อนบนกระจก (รอบ 542) — เห็นเฉพาะบินต่ำ + กลางคืน
   เม็ดแสงเกิดขอบล่างกระจก ลอยขึ้น (เหมือนไฟถนนไหลผ่านใต้ลำ) เลื่อนข้างตามการเลี้ยว จางตามความสูง
   สีคละส้ม(โซเดียม)/ขาว/ฟ้า = ป้ายไฟ · เบามาก ไม่กวนการมองทาง */
const REFL_MAX=26;
let cityRefl=[], _reflSeed=0;
const REFL_COL=['255,190,90','255,235,180','150,210,255','255,120,90'];
function cityGlowLevel(){
  const alt=Math.max(0,camera.position.y-HELI_SKID);
  const low=Math.max(0,1-alt/32);                        // ต่ำกว่า 32m เริ่มเห็น สูงกว่านั้น=ไม่มี
  return heliNight*low;
}
function drawCityGlow(c,dt,now){
  const lv=cityGlowLevel();
  if(lv<=.03){ if(cityRefl.length) cityRefl.length=0; return; }
  const spd=Math.hypot(hVel.x,hVel.z);
  const lat=(hVel.x*Math.cos(yaw)-hVel.z*Math.sin(yaw));  // ไถลข้าง → เม็ดแสงเลื่อนสวนทาง
  // สปอว์นเม็ดใหม่ที่ขอบล่าง (ถี่ขึ้นตามความเร็ว = บินเร็วไฟผ่านไว)
  const rate=(2+spd*.5)*lv;
  if(cityRefl.length<REFL_MAX && Math.random()<rate*dt*3){
    _reflSeed++;
    cityRefl.push({x:180+Math.random()*(CP_NAT.w-360), y:300+Math.random()*40,
                   len:14+Math.random()*30, w:1.4+Math.random()*2.2,
                   col:REFL_COL[_reflSeed%REFL_COL.length], a:.5+Math.random()*.5,
                   vy:-(40+spd*10+Math.random()*30)});
  }
  c.save(); c.globalCompositeOperation='lighter';
  for(let i=cityRefl.length-1;i>=0;i--){
    const p=cityRefl[i];
    p.y+=p.vy*dt; p.x-=lat*dt*10; p.a-=dt*.35;
    if(p.a<=0||p.y<70){ cityRefl.splice(i,1); continue; }
    const aa=p.a*lv*(1-heliFog*.5);
    const g=c.createLinearGradient(p.x,p.y,p.x,p.y+p.len);
    g.addColorStop(0,`rgba(${p.col},0)`);
    g.addColorStop(.5,`rgba(${p.col},${(aa*.5).toFixed(3)})`);
    g.addColorStop(1,`rgba(${p.col},0)`);
    c.strokeStyle=g; c.lineWidth=p.w; c.lineCap='round';
    c.beginPath(); c.moveTo(p.x,p.y); c.lineTo(p.x,p.y+p.len); c.stroke();
    // จุดหัวสว่างเล็ก ๆ (ไฟดวงจริง)
    c.fillStyle=`rgba(${p.col},${(aa*.6).toFixed(3)})`;
    c.beginPath(); c.arc(p.x,p.y+p.len,p.w*.9,0,7); c.fill();
  }
  c.restore();
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
    // 🌦️ รอบ 540: ฝนมีสองระดับ — หอบอกด้วยว่าควรใช้ที่ปัดโหมดไหน (สอนศัพท์อังกฤษไปในตัว)
    rainHeavy=Math.random()<.45;
    ATC.say(rainHeavy
      ? 'Heavy rain ahead, captain! Set your wipers to fast.'
      : 'Light drizzle ahead. Intermittent wipers are enough, captain.');
  }else if(rainOn && now>=rainUntilAt){
    rainOn=false;
    rainNextAt=now+RAIN_MIN+Math.random()*(RAIN_MAX_GAP-RAIN_MIN);
  }
}
/* วาดใบปัด 1 ใบ (mirror=true = ฝั่งขวา สะท้อนแกน x)
   รอบ 533: ใบยาง "ลากตามหลังก้าน" ตามความเร็วกวาด (flex) + สั่นตามลำเครื่อง = ไม่แข็งทื่อ */
function drawBlade(c,ang,mirror,flex,shake){
  const P=WIPER.pivot, px=mirror?CP_NAT.w-P.x:P.x;
  // ⚠️ มุมคือทิศของใบปัดตรงๆ: ang=π คือชี้ซ้าย (ท่าจอดฝั่งซ้าย) · ฝั่งขวาสะท้อนเป็น π-ang
  // เคยพลาด: ใส่ rotate(a-π) + scale(-1,1) ทำให้ใบซ้ายชี้กลับเข้ากลางจอ
  const a=mirror?Math.PI-ang:ang, f=(mirror?-1:1)*(flex||0), L=WIPER.len;
  c.save();
  c.translate(px,P.y+(shake||0)); c.rotate(a);
  c.strokeStyle='rgba(18,20,24,.92)'; c.lineCap='round';
  // ใบยาง: โค้งหน่วง — ปลายเบนไปทางตรงข้ามทิศกวาดเล็กน้อย
  c.lineWidth=5.2; c.beginPath(); c.moveTo(6,0);
  c.quadraticCurveTo(L*.6,-f*L*.055,L,-f*L*.1); c.stroke();
  c.lineWidth=2.4; c.strokeStyle='rgba(40,44,50,.95)';
  c.beginPath(); c.moveTo(0,0); c.lineTo(L*.55,0); c.stroke();                       // ก้าน
  c.lineWidth=1.4; c.strokeStyle='rgba(70,76,84,.8)';                                // ก้านย่อยจับใบ
  c.beginPath(); c.moveTo(L*.42,0); c.lineTo(L*.68,-f*L*.03); c.stroke();
  c.beginPath(); c.arc(0,0,4.5,0,7); c.fillStyle='#2a2e34'; c.fill();                // หัวหมุน
  c.restore();
}
/* 💦 รอยฟิล์มน้ำที่ใบเพิ่งรีดผ่าน — จางเองเร็ว เห็นชัดเฉพาะตอนกระจกเปียก/โดนแดด */
function drawSmears(c,dt,wet){
  const P=WIPER.pivot;
  for(let i=smears.length-1;i>=0;i--){
    const s=smears[i]; s.t-=dt;
    if(s.t<=0){ smears.splice(i,1); continue; }
    const k=(s.t/SMEAR_LIFE)*wet;
    if(k<=.01) continue;
    for(const side of [0,1]){
      const px=side?CP_NAT.w-P.x:P.x;
      const a0=side?Math.PI-s.a0:s.a0, a1=side?Math.PI-s.a1:s.a1;
      c.save();
      // ⚠️ รอยซ้อนกันได้ ~20 ชั้น (อายุ .72 วิ) — อัลฟ่าต้องเบามาก ไม่งั้นกลายเป็นวงขาวทึบกลางกระจก
      c.globalAlpha=.09*k; c.strokeStyle='#eaf4ff'; c.lineWidth=9; c.lineCap='round';
      c.beginPath(); c.arc(px,P.y,WIPER.len*.62,Math.min(a0,a1),Math.max(a0,a1)); c.stroke();
      c.globalAlpha=.055*k; c.lineWidth=14;
      c.beginPath(); c.arc(px,P.y,WIPER.len*.9,Math.min(a0,a1),Math.max(a0,a1)); c.stroke();
      c.restore();
    }
  }
}
function drawGlass(dt,now){
  if(!glassCtx||!cpMap) return;
  const c=glassCtx;
  c.setTransform(1,0,0,1,0,0);
  c.clearRect(0,0,glassCanvasEl.width,glassCanvasEl.height);
  if(seatLevel>0){ wiperSndOff(); return; }   // มุมบินไม่มีกระจก/หลังคาในภาพ → ไม่วาดที่ปัด/แดด + ปิดเสียงมอเตอร์
  c.setTransform(cpMap.s,0,0,cpMap.s,cpMap.ox,cpMap.oy);
  // ── ☀️ แสงแดดสาดผ่านกระจก: ทิศ/ความสูง/สี เปลี่ยนตามเวลาจริง (sunUpdate) ──
  let rel=sunDir-yaw;                                    // มุมสัมพัทธ์
  while(rel>Math.PI) rel-=Math.PI*2;
  while(rel<-Math.PI) rel+=Math.PI*2;
  const visorCut=visorDown?VISOR_CUT:1;                  // 🕶️ ม่านลง = แสงจ้าลดลง
  // 🌗 รอบ 533: กลางคืนต้องไม่มีแดด (เดิม k ไม่ดูเวลาเลย → เที่ยงคืนยังมีดวงส้มลอยกลางกระจก)
  //    หมอกหนา = แสงฟุ้งแต่ไม่จ้า · ใบพัดตัดแสงเป็นจังหวะตามรอบเครื่อง (rotorChop)
  const day=Math.max(0,1-heliNight), chop=rotorChop(now);
  const sunAmt=day*(.35+.65*Math.max(0,sunHi))*(1-heliFog*.45)*chop*sunShade;
  let sunK=0;
  if(Math.abs(rel)<1.15 && sunAmt>.02){                  // หันหน้าเข้าหาแดดถึงจะเห็นแสงจ้า
    const k=sunK=(1-Math.abs(rel)/1.15)*visorCut*sunAmt; // 1=ตรงหน้า 0=พ้นขอบ
    const sx=CP_NAT.w*(.5-rel*.42);
    // ⚠️ รอบ 533: หนีบให้อยู่ใน "ช่องกระจกจริง" (y 104-286) — เดิมเที่ยงวัน sy≈60 = ดวงไปซ่อนหลังหลังคา
    //    ผู้เล่นเลยไม่เคยเห็นดวง เห็นแค่หางแสงจาง ๆ
    const sy=Math.max(104,Math.min(286,210-sunHi*150-pitch*90));   // เที่ยง=สูง (y น้อย) · เช้า/เย็น=ต่ำลงมา
    // 🔆 ไอแดดอาบทั้งกระจก — ให้ห้องนักบิน "รู้สึกว่ากลางวัน" แม้ดวงจะเยื้องไปมุมไหน
    c.fillStyle=`rgba(255,${Math.round(238-sunWarm*28)},${Math.round(196-sunWarm*56)},${(.085*k).toFixed(3)})`;
    c.fillRect(0,0,CP_NAT.w,CP_NAT.h);
    const warm=Math.round(214-sunWarm*80), warm2=Math.round(150-sunWarm*70);
    const g=c.createRadialGradient(sx,sy,4,sx,sy,300);
    g.addColorStop(0,`rgba(255,246,${warm},${(.5*k).toFixed(3)})`);
    g.addColorStop(.35,`rgba(255,${Math.round(224-sunWarm*40)},${warm2},${(.18*k).toFixed(3)})`);
    g.addColorStop(1,'rgba(255,190,110,0)');
    c.fillStyle=g; c.fillRect(0,0,CP_NAT.w,CP_NAT.h);
    // ✴️ แฉกแสง + ริ้วยาวแนวนอน (แบบเลนส์กล้อง) — สั่นตามลำเครื่องนิดหน่อย
    c.save();
    c.translate(sx,sy); c.rotate(hTiltS*.6+Math.sin(now/900)*.05);
    c.globalAlpha=.5*k; c.strokeStyle='#fff3cf'; c.lineCap='round';
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3, L=(i%2?46:88)*(.85+.15*Math.sin(now/210+i));
      c.lineWidth=i%2?2:3.4;
      c.beginPath(); c.moveTo(Math.cos(a)*10,Math.sin(a)*10); c.lineTo(Math.cos(a)*L,Math.sin(a)*L); c.stroke();
    }
    const st=c.createLinearGradient(-330,0,330,0);
    st.addColorStop(0,'rgba(255,228,170,0)');
    st.addColorStop(.5,`rgba(255,242,205,${(.3*k).toFixed(3)})`);
    st.addColorStop(1,'rgba(255,228,170,0)');
    c.globalAlpha=1; c.fillStyle=st; c.fillRect(-330,-4.5,660,9);
    c.restore();
    // 🔮 เงาผี (ghost) ของแสงในแนวดวงอาทิตย์→กลางกระจก: บอกว่ามองผ่าน "กระจกหนา" จริง
    const cx0=CP_NAT.w/2, cy0=232;
    [[.42,26,'255,236,190'],[.78,15,'190,255,220'],[1.22,34,'255,205,160']].forEach(([t,rr,col])=>{
      const gx=sx+(cx0-sx)*t, gy=sy+(cy0-sy)*t;
      const gg=c.createRadialGradient(gx,gy,1,gx,gy,rr);
      gg.addColorStop(0,`rgba(${col},${(.16*k).toFixed(3)})`);
      gg.addColorStop(.7,`rgba(${col},${(.07*k).toFixed(3)})`);
      gg.addColorStop(1,`rgba(${col},0)`);
      c.fillStyle=gg; c.beginPath(); c.arc(gx,gy,rr,0,7); c.fill();
    });
    // ริ้วคราบบนกระจก — เห็นชัดเฉพาะตอนโดนแดดส่อง (เหมือนกระจกเป็นรอย) · ยิ่งคราบเยอะยิ่งชัด (รอบ 541)
    const gr=.35+grime*.65;                              // ล้างแล้ว (grime ต่ำ) = ริ้วจางลงจริง
    c.save(); c.globalAlpha=.13*k*gr; c.strokeStyle='#fff6d8'; c.lineWidth=2.2;
    for(let i=0;i<7;i++){
      const bx=180+i*112;
      c.beginPath(); c.moveTo(bx,96); c.bezierCurveTo(bx+26,150,bx-14,200,bx+18,262); c.stroke();
    }
    // ฝุ่นจับกระจกเป็นจุด ๆ วิบวับตอนต้องแสง (ตำแหน่งคงที่ = เป็นคราบจริง ไม่ใช่ noise)
    c.globalAlpha=.5*k*gr;
    for(let i=0;i<26;i++){
      const px=150+((i*997)%800), py=100+((i*613)%180);
      c.fillStyle=`rgba(255,250,225,${(.10+.09*Math.sin(now/380+i)).toFixed(3)})`;
      c.beginPath(); c.arc(px,py,.9+(i%3)*.55,0,7); c.fill();
    }
    c.restore();
  }
  // ── 🌙 แสงจันทร์นวลตอนกลางคืน (แทนแดด) — ฟ้ามืดแล้วกระจกไม่ตายสนิท ──
  if(heliNight>.35){
    let mrel=sunDir+Math.PI-yaw;
    while(mrel>Math.PI) mrel-=Math.PI*2;
    while(mrel<-Math.PI) mrel+=Math.PI*2;
    if(Math.abs(mrel)<1.0){
      const mk=(1-Math.abs(mrel)/1.0)*heliNight*visorCut*(1-heliFog*.5)*chop;
      const mx=CP_NAT.w*(.5-mrel*.42), my=150-pitch*90;
      const g=c.createRadialGradient(mx,my,2,mx,my,190);
      g.addColorStop(0,`rgba(226,240,255,${(.26*mk).toFixed(3)})`);
      g.addColorStop(.4,`rgba(170,205,255,${(.09*mk).toFixed(3)})`);
      g.addColorStop(1,'rgba(140,180,255,0)');
      c.fillStyle=g; c.fillRect(0,0,CP_NAT.w,CP_NAT.h);
    }
  }
  // ── 🌃 แสงไฟเมืองสะท้อนบนกระจกตอนบินต่ำกลางคืน (รอบ 542) ──
  //    ไฟถนน/ป้ายด้านล่างสาดขึ้นกระจก เป็นเส้นสั้น ๆ เลื่อนสวนทางการบิน (parallax) จางตามความสูง
  drawCityGlow(c,dt,now);
  // ── 🌫️ ฝ้าไอน้ำเกาะกระจกตอนหมอกหนา (รอบ 533) — ที่ปัดรีดออกได้จริง ──
  const mistTgt=Math.max(0,heliFog-.25)*1.15;
  glassMist+=(Math.min(1,mistTgt)-glassMist)*Math.min(1,dt*.22);
  if(glassMist>.02){
    const g=c.createLinearGradient(0,88,0,300);
    g.addColorStop(0,`rgba(226,236,242,${(.30*glassMist).toFixed(3)})`);
    g.addColorStop(1,`rgba(226,236,242,${(.10*glassMist).toFixed(3)})`);
    c.fillStyle=g; c.fillRect(96,88,CP_NAT.w-192,220);
  }
  // ── 💧 หยดน้ำบนกระจก (วาดก่อนใบปัด ใบปัดจะได้ดูเหมือนกวาดทับ) ──
  for(const d of drops){
    // หยดที่ไหลเร็วยืดเป็นเส้นทางน้ำ — ยิ่งบินเร็วยิ่งลาก (d.vy มาจาก tickDrops)
    const tail=Math.min(26,d.vy*1.5);
    if(tail>3){
      c.save(); c.globalAlpha=d.a*.22; c.strokeStyle='#cfe6f7';
      c.lineWidth=d.r*1.1; c.lineCap='round';
      c.beginPath(); c.moveTo(d.x,d.y-tail); c.lineTo(d.x,d.y); c.stroke(); c.restore();
    }
    const g=c.createRadialGradient(d.x-d.r*.3,d.y-d.r*.35,d.r*.15,d.x,d.y,d.r);
    g.addColorStop(0,`rgba(255,255,255,${(d.a*.55).toFixed(3)})`);
    g.addColorStop(.55,`rgba(200,225,245,${(d.a*.28).toFixed(3)})`);
    g.addColorStop(1,`rgba(120,160,195,${(d.a*.12).toFixed(3)})`);
    c.fillStyle=g; c.beginPath(); c.arc(d.x,d.y,d.r,0,7); c.fill();
    // ☀️💧 ต้องแดด = หยดน้ำเป็นเม็ดแก้ววิบวับ
    if(sunK>.05&&d.r>2){
      c.fillStyle=`rgba(255,252,232,${(Math.min(.85,d.a*sunK*1.5)).toFixed(3)})`;
      c.beginPath(); c.arc(d.x-d.r*.34,d.y-d.r*.38,Math.max(.6,d.r*.26),0,7); c.fill();
    }
  }
  // ── 🏢➡️ ขอบเงาตึกกวาดผ่านกระจก (รอบ 541) — แถบมืดไล่จากขอบด้านที่ลำกำลังไถลเข้าหา ──
  //    หรี่ทั้งห้อง (applyCockpitShade) ทำเรื่องความสว่างแล้ว · อันนี้เพิ่ม "ขอบไล่" ให้รู้สึกว่าพุ่งผ่านเงาจริง
  if(shEdge>.01 && shEdge<.99 && day>.2){
    const w=CP_NAT.w, bw=90;                              // ความกว้างของแนวไล่สี (นุ่ม)
    // shDir>0 = เงาเข้าจากขวา → บริเวณมืดคือ [ex,w] · shDir<0 = เข้าจากซ้าย → [0,ex]
    const ex=shDir>0 ? w*(1-shEdge) : w*shEdge;
    const g=c.createLinearGradient(ex-bw,0,ex+bw,0);
    const dark=`rgba(20,26,38,${(.3*day).toFixed(3)})`, clear='rgba(20,26,38,0)';
    g.addColorStop(0,shDir>0?clear:dark); g.addColorStop(1,shDir>0?dark:clear);
    c.save(); c.fillStyle=g;
    if(shDir>0) c.fillRect(ex-bw,0,w-(ex-bw),CP_NAT.h); else c.fillRect(0,0,ex+bw,CP_NAT.h);
    c.restore();
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
  //    รอบ 533: เดินมุมใน tickWiper (มีท่าจอด/ใบยางหน่วง/รอยรีดน้ำ) แล้วค่อยวาด
  const ang=tickWiper(dt,now);
  drawSmears(c,dt,Math.min(1,(rainOn?1:.45)+glassMist+sunK*.6));
  if(ang!==null){
    const flex=Math.max(-1,Math.min(1,wiperVel/2.6));
    const sh=heliShake(now);                             // 📳 ใบสั่นตามลำเครื่อง
    drawBlade(c,ang,false,flex,sh?Math.sin(now/29)*sh*1.7:0);
    drawBlade(c,ang,true ,flex,sh?Math.sin(now/29+1.1)*sh*1.7:0);
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
  sunShadeTick(now);                    // 🏢 บินหลังตึก = แดดวูบ + หรี่ทั้งห้องนักบิน (ร.537/540 · ทุกมุมมอง)
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
/* 🎯 รอบ 404 (ผู้ใช้): ป้ายโผล่ "ทีละตัว ในกรอบประตู" ตำแหน่งสุ่ม — ต้องเล็งเข้าประตูจริงถึงจะเก็บได้ สนุกกว่าลอยเกลื่อน */
function soccerLetterPos(){
  return {
    x:(Math.random()*2-1)*(GOAL_HW-0.95),          // อยู่ในกรอบเสา (เผื่อขอบป้าย)
    y:0.85+Math.random()*(GOAL_H-1.5),             // ตั้งแต่ระดับต่ำถึงใต้คาน
    z:GOAL_Z+0.55                                  // ลอยหน้าเส้นประตูนิดเดียว = อยู่ในกรอบ
  };
}
/* ตัวอักษรนี้ยัง "ต้องการ" ประกอบคำเป้าหมายอยู่ไหม (need รวมทุกคำ > ที่เก็บใน inv แล้ว) */
function letterNeeded(ch){
  let need=0; words.forEach(w=>{ for(const c of w.en) if(c===ch) need++; });
  return need > (inv[ch]||0);
}
/* multiset ตัวอักษรที่ยังต้องการ (เรียงตามลำดับคำ — คำแรกมาก่อน)
   🐛 รอบ 856 (ผู้ใช้: EDUCATION เก็บ E,D แล้ว ตัวถัดไปต้องเป็น U แต่ป้ายถอยกลับไป E):
   เดิมหัก inv แบบ "นับรวมทุกคำ" แล้วค่อยไล่ตามตัวสะกด → E ที่เก็บไปถูกเครดิตให้ E ของคำท้าย ๆ
   ตำแหน่ง E ของคำแรกเลยยังติดลำดับหัวคิวอยู่ · ใหม่: เดินตามตัวสะกดทีละตำแหน่ง (คำแรก-ตัวแรกก่อน)
   แล้วเครดิตตัวที่เก็บแล้วให้ตำแหน่งแรกสุดก่อน → คิวเดินหน้าตามการสะกดคำจริงเสมอ */
function soccerNeededSet(){
  const have={}; Object.keys(inv).forEach(c=>{ have[c]=inv[c]; });
  const arr=[];
  words.forEach(w=>{ for(const c of w.en){
    if((have[c]||0)>0) have[c]--; else arr.push(c);
  }});
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
/* 🎯 รอบ 404: ย้ายป้ายไปจุดใหม่ในกรอบประตู + เปลี่ยนเป็นตัวอักษรที่ยังต้องการตัวถัดไป
   (กันจุดซ้ำเดิม: ถ้าสุ่มได้ใกล้ที่เดิมมาก ให้สุ่มใหม่ ผู้เล่นจะได้ต้องเล็งใหม่ทุกครั้ง) */
function soccerNextTile(l){
  const need=soccerNeededSet();
  /* รอบ 856: เอา need[0] ตรง ๆ — soccerNeededSet เครดิตตัวที่เก็บแล้วให้ตำแหน่งแรกสุดแล้ว (แก้ที่ราก)
     คิวจึงเดินตามตัวสะกดของคำแรกเป๊ะ · ตัวซ้ำติดกันเกิดได้เฉพาะคำที่สะกดซ้ำจริง (apple → p,p ถูกต้อง)
     (ถอด hack รอบ 855 ที่ "ข้ามตัวซ้ำกับที่เพิ่งยิง" ทิ้ง — มันสลับลำดับสะกดของคำตัวซ้ำอย่าง apple) */
  const nextCh = need.length ? need[0] : l.ch;
  const old=l.spr.position;
  let p=soccerLetterPos(), guard=0;
  while(guard++<8 && Math.hypot(p.x-old.x,p.y-old.y)<2.2) p=soccerLetterPos();
  l.ch=nextCh;
  l.home=p; l.baseY=p.y;
  l.spr.position.set(p.x,p.y,p.z);
  l.gold=!letterNeeded(nextCh);                   // บังคับให้ soccerRefreshSkins เปลี่ยนรูปให้ตรงตัวใหม่
  soccerRefreshSkins();
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
/* ==== ⚽🎨 รอบ 396: PES-look — เทกซ์เจอร์สนาม/บอล/อัฒจันทร์ + เสียงสนาม + ฟิสิกส์จริง ==== */
/* หญ้าไทล์ซ้ำได้: ลายตัด 2 โทน (ครึ่งบนอ่อน/ครึ่งล่างเข้ม) + เม็ดหญ้า noise — repeat แล้วได้ลายตัดถี่ทั้งสนาม */
function soccerGrassTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=256;
  const c=cv.getContext('2d');
  c.fillStyle='#3f9d43'; c.fillRect(0,0,256,128);
  c.fillStyle='#37913a'; c.fillRect(0,128,256,128);
  for(let i=0;i<2600;i++){                                      // เม็ดหญ้า (ขีดสั้นแนวตั้งสุ่มโทน)
    const x=Math.random()*256, y=Math.random()*256, up=y<128;
    const v=Math.random();
    c.strokeStyle=`rgba(${v<.5?'255,255,255':'20,60,20'},${.045+Math.random()*.05})`;
    c.lineWidth=1; c.beginPath(); c.moveTo(x,y); c.lineTo(x+(Math.random()-.5)*2,y-2-Math.random()*3); c.stroke();
  }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(10,14); return t;
}
/* ==== 🌿 รอบ 410: ยกเครื่องพื้นสนามให้เหมือนภาพตัวอย่าง (PES) ====
   วิเคราะห์ว่าทำไมของเดิมไม่ผ่าน:
   ① สเกลผิด — ภาพหญ้า 1024px ถูกยืดคลุม 23×45 เมตร ใบหญ้าจึงกว้างเป็นเมตร เห็นเป็นรอยเบลอ/ด่าง
      (ภาพตัวอย่างใบหญ้าละเอียดเพราะ 1 กระเบื้อง ≈ 2-3 เมตร)
   ② แถบตัดหญ้าติดมาในภาพ — พอจะทำใบให้ละเอียดต้องปูถี่ขึ้น แถบก็ถี่ตามจนลายมั่ว (ผูกติดกันแก้ไม่ได้)
      ต้อง "แยกชั้น": ใบหญ้าปูถี่ + แถบตัดวาดต่างหากตามขนาดจริง
   ③ สีจัดเกินจริง — ภาพเป็นเขียวนีออน + ไฟฉากสว่าง 1.05 = เรืองแสง ต่างจากตัวอย่างที่เขียวหม่นสมจริง */
/* ใบหญ้าละเอียด: ดึงภาพจริงของผู้ใช้มา "รีดแถบออก" (ปรับความสว่างรายแถวให้เท่ากัน) + ลดความจัดจ้าน
   แล้วปูแบบสะท้อนขอบ (MirroredRepeat) จึงต่อไร้รอยแม้ครอปมาจากภาพถ่าย */
function soccerTurfGrade(c,S){
  const d=c.getImageData(0,0,S,S), p=d.data;
  const rowMean=new Float32Array(S); let global=0;
  for(let y=0;y<S;y++){                          // ① รีดแถบตัดหญ้าที่ติดมากับภาพออก
    let s=0;
    for(let x=0;x<S;x++){ const k=(y*S+x)*4; s+=p[k]*.299+p[k+1]*.587+p[k+2]*.114; }
    rowMean[y]=s/S; global+=rowMean[y];
  }
  global/=S;
  for(let y=0;y<S;y++){
    const f=rowMean[y]>1?global/rowMean[y]:1;
    for(let x=0;x<S;x++){ const k=(y*S+x)*4;
      p[k]=Math.min(255,p[k]*f); p[k+1]=Math.min(255,p[k+1]*f); p[k+2]=Math.min(255,p[k+2]*f); }
  }
  /* 🏟️ รอบ 935 (ผู้ใช้ชี้ 3 จุดบนสนาม: "เอาร่องรอยสีที่ไม่สม่ำเสมอออก"):
     ภาพถ่ายหญ้ามีแสง/สีเป็นหย่อม (บล็อบ) — พอปู MirroredRepeat ทั้งสนาม หย่อมพวกนี้กลายเป็นลายด่างซ้ำ ๆ
     แก้ด้วย flat-field ต่อช่องสี: เฉลี่ยเป็นบล็อก 32px → bilinear คืนต่อพิกเซล → ปรับทุกจุดเข้าค่าเฉลี่ยรวม
     (การรีดรายแถวข้างบนแก้เฉพาะแถบแนวนอน แต่บล็อบ 2 มิติยังอยู่ — นี่คือชั้นที่ขาด) */
  {
    const B=32, nb=S/B, cnt=B*B;
    const mean=[new Float32Array(nb*nb),new Float32Array(nb*nb),new Float32Array(nb*nb)], glob=[0,0,0];
    for(let by=0;by<nb;by++) for(let bx=0;bx<nb;bx++){
      let r=0,g=0,b=0;
      for(let y=0;y<B;y++){ let k=((by*B+y)*S+bx*B)*4;
        for(let x=0;x<B;x++,k+=4){ r+=p[k]; g+=p[k+1]; b+=p[k+2]; } }
      const i=by*nb+bx; mean[0][i]=r/cnt; mean[1][i]=g/cnt; mean[2][i]=b/cnt;
    }
    for(let ch=0;ch<3;ch++){ let s=0; for(let i=0;i<nb*nb;i++) s+=mean[ch][i]; glob[ch]=s/(nb*nb); }
    const at=(ch,bx,by)=>mean[ch][Math.min(nb-1,Math.max(0,by))*nb+Math.min(nb-1,Math.max(0,bx))];
    for(let y=0;y<S;y++){
      const fy=(y-B/2)/B, y0=Math.floor(fy), ty=fy-y0;
      for(let x=0;x<S;x++){
        const fx=(x-B/2)/B, x0=Math.floor(fx), tx=fx-x0, k=(y*S+x)*4;
        for(let ch=0;ch<3;ch++){
          const m=(at(ch,x0,y0)*(1-tx)+at(ch,x0+1,y0)*tx)*(1-ty)
                 +(at(ch,x0,y0+1)*(1-tx)+at(ch,x0+1,y0+1)*tx)*ty;
          const f=Math.min(1.4,Math.max(.7, glob[ch]/Math.max(1,m)));   // clamp กันขยาย noise ในโซนมืด
          p[k+ch]=Math.min(255,p[k+ch]*f);
        }
      }
    }
  }
  const SAT=.62, BRI=.74;                        // ② ลดความอิ่มสี+หรี่ลง = เขียวสนามจริง ไม่ใช่เขียวนีออน
  for(let i=0;i<p.length;i+=4){
    const l=p[i]*.299+p[i+1]*.587+p[i+2]*.114;
    p[i]  =Math.min(255,(l+(p[i]  -l)*SAT)*BRI);
    p[i+1]=Math.min(255,(l+(p[i+1]-l)*SAT)*BRI);
    p[i+2]=Math.min(255,(l+(p[i+2]-l)*SAT)*BRI);
  }
  c.putImageData(d,0,0);
}
function soccerTurfTexture(){
  const S=512, cv=document.createElement('canvas'); cv.width=cv.height=S;
  const c=cv.getContext('2d');
  c.fillStyle='#3c6b34'; c.fillRect(0,0,S,S);               // fallback: ใบหญ้าวาดเอง (ถ้าไม่มีไฟล์ภาพ)
  for(let i=0;i<9000;i++){
    const x=Math.random()*S, y=Math.random()*S, v=Math.random();
    c.strokeStyle=`rgba(${v<.5?'190,225,150':'26,58,24'},${.05+Math.random()*.09})`;
    c.lineWidth=1; c.beginPath(); c.moveTo(x,y); c.lineTo(x+(Math.random()-.5)*2.5,y-2-Math.random()*4); c.stroke();
  }
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.MirroredRepeatWrapping;             // สะท้อนขอบ = ต่อไร้รอย
  t.repeat.set(39,51);                                      // 1 กระเบื้อง ≈ 2.9×3.0 m (ใบหญ้าขนาดจริง · รอบ 928: ผืน 70×90→114×154 ปรับ repeat คงขนาดใบ)
  const img=new Image();
  img.onload=()=>{ c.clearRect(0,0,S,S); c.drawImage(img,0,0,S,S); soccerTurfGrade(c,S); t.needsUpdate=true; };
  img.src='img/tex/soccer_grass.jpg';
  return t;
}
/* 🌿 รอบ 403 (ผู้ใช้: "หญ้าดูแบนเรียบเกินไป"): normal map ใบหญ้า — ทำให้แสงจับเป็นร่องเงามีมิติ
   สร้าง height field จากขีดใบหญ้าสุ่ม → sobel → encode เป็น normal RGB */
function grassNormalTexture(){
  const S=256, cv=document.createElement('canvas'); cv.width=cv.height=S;
  const c=cv.getContext('2d'), h=new Float32Array(S*S);
  for(let i=0;i<14000;i++){                       // ขีดใบหญ้าเอียงสุ่ม (ยอดสว่าง โคนจาง)
    const x=Math.random()*S, y=Math.random()*S, len=3+Math.random()*6, a=-Math.PI/2+(Math.random()-.5)*.9;
    for(let t=0;t<len;t++){
      const px=(x+Math.cos(a)*t)|0, py=(y+Math.sin(a)*t)|0;
      if(px<0||py<0||px>=S||py>=S) continue;
      const k=py*S+px, v=1-t/len;
      if(v>h[k]) h[k]=v;
    }
  }
  const img=c.createImageData(S,S), d=img.data;
  const at=(x,y)=>h[((y+S)%S)*S+((x+S)%S)];
  for(let y=0;y<S;y++) for(let x=0;x<S;x++){
    const dx=(at(x+1,y)-at(x-1,y))*2.2, dy=(at(x,y+1)-at(x,y-1))*2.2;
    let nx=-dx, ny=-dy, nz=1;
    const l=Math.hypot(nx,ny,nz)||1; nx/=l; ny/=l; nz/=l;
    const k=(y*S+x)*4;
    d[k]=(nx*.5+.5)*255; d[k+1]=(ny*.5+.5)*255; d[k+2]=(nz*.5+.5)*255; d[k+3]=255;
  }
  c.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(42,58);   // ถี่กว่าลายตัด = เห็นเนื้อหญ้าละเอียด (รอบ 928: ปรับตามผืนใหญ่ 2 เท่า)
  return t;
}
/* 🌿 กอหญ้า 3D จริง — แผ่นไขว้กากบาทติดเทกซ์เจอร์ใบหญ้าโปร่ง รวมเป็น mesh เดียว (draw call เดียว เบามาก) */
/* เส้นสนามชั้นโปร่ง 1024² map ตรงกับ plane 44×64m (คานวณ px จากเมตรจริง) — ขอบสนาม/เส้นกลาง/วงกลมกลาง/
   เขตโทษ+เขต 6 หลา+จุดโทษ+โค้งหน้าเขตโทษ (ฝั่งประตู z=-19 และ mirror ฝั่งตรงข้าม) + โค้งมุมสนาม */
function soccerLinesTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=1024;
  const c=cv.getContext('2d');
  /* 🌿 รอบ 410: แถบตัดหญ้าย้ายมาวาดที่ชั้นนี้ (แยกจากเทกซ์เจอร์ใบหญ้า จึงคุมขนาดจริงได้อิสระ)
     วางเป็นแถบ "แนวเดียวกับทิศเตะ" (แปรตามแกน x) → มองจากหลังผู้เตะเห็นแถบพุ่งเข้าหาประตู เหมือนภาพตัวอย่าง
     ขอบแถบไล่จางแบบรอยล้อรถตัดหญ้าจริง ไม่ใช่เส้นตัดคม */
  const NB=20;                                     // 20 แถบบนความกว้างสนาม 88m = แถบละ 4.4m (มาตรฐานจริง · รอบ 928: สนาม 2 เท่า)
  for(let i=0;i<NB;i+=2){
    const x0=i*1024/NB, w=1024/NB;
    const g=c.createLinearGradient(x0,0,x0+w,0);
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(.5,'rgba(0,0,0,.085)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g; c.fillRect(x0,0,w,1024);
  }
  /* ⚽📐 รอบ 411 (ผู้ใช้ทัก 3 ข้อ): เดิมวาดสนาม "เกือบจัตุรัส" กว้าง 40 × ยาวแค่ 38m ทั้งที่สนามจริงยาว/กว้าง ≈ 1.54
     ผลคือทุกอย่างอัดกันจนโค้งเขตโทษเกือบชนวงกลมกลาง + มีเส้นเขตโทษ "ฝั่งตรงข้าม" โผล่มาพาดใกล้วงกลมกลาง
     แก้: วาดเป็น "ครึ่งสนามจริง" ย่อส่วนตามมาตรฐาน FIFA (105×68) — เล่นยิงประตูเดียวอยู่แล้ว ไม่ต้องมีฝั่งตรงข้าม */
  const W=88,L=128, PX=x=>(x+W/2)/W*1024, PY=z=>(z+L/2)/L*1024;  // เมตร→พิกเซล (แกน z: บนผืนผ้า=ฝั่งประตู -z · รอบ 928: 44×64→88×128)
  const RX=m=>m/W*1024, RY=m=>m/L*1024;
  c.strokeStyle='rgba(255,255,255,.95)'; c.fillStyle='rgba(255,255,255,.95)'; c.lineWidth=2.5;  // รอบ 928: 4→2.5px — px/เมตรลดครึ่ง เส้นเดิมจะหนาเป็น 34cm
  const PW=80, K=PW/68;                       // กว้าง 80m · ตัวคูณขยายจากสนามจริง 68m (รอบ 928: เดิม 40)
  const X0=-PW/2, X1=PW/2;
  const GL=GOAL_Z;                            // เส้นประตู (-19)
  const HALF=GL+52.5*K;                       // เส้นกลางสนาม = ครึ่งความยาวจริง 52.5m ย่อส่วน → z ≈ +11.9
  const PB_W=40.3*K/2, PB_D=16.5*K;           // เขตโทษ 40.3×16.5m ย่อส่วน
  const GB_W=18.32*K/2, GB_D=5.5*K;           // เขตประตู (6 หลา) 18.32×5.5m
  const SPOT=11*K, ARC=9.15*K, CIR=9.15*K;    // จุดโทษ 11m · โค้ง/วงกลมกลาง รัศมี 9.15m
  // ขอบสนาม: เส้นประตู + เส้นข้าง 2 เส้น + เส้นกลางสนาม (ไม่มีขอบฝั่งตรงข้าม เพราะเป็นครึ่งสนาม)
  c.beginPath();
  c.moveTo(PX(X0),PY(GL));   c.lineTo(PX(X1),PY(GL));      // เส้นประตู
  c.moveTo(PX(X0),PY(GL));   c.lineTo(PX(X0),PY(HALF));    // เส้นข้างซ้าย
  c.moveTo(PX(X1),PY(GL));   c.lineTo(PX(X1),PY(HALF));    // เส้นข้างขวา
  c.moveTo(PX(X0),PY(HALF)); c.lineTo(PX(X1),PY(HALF));    // เส้นกลางสนาม
  c.stroke();
  // วงกลมกลางสนาม: อยู่ที่เส้นกลาง เห็นเฉพาะครึ่งที่อยู่ในสนามเรา (โค้งด้านประตู)
  c.beginPath(); c.ellipse(PX(0),PY(HALF),RX(CIR),RY(CIR),0,Math.PI,Math.PI*2); c.stroke();
  c.beginPath(); c.ellipse(PX(0),PY(HALF),RX(.3),RY(.3),0,0,7); c.fill();        // จุดเขี่ยกลาง
  // เขตโทษ + เขตประตู + จุดโทษ (ฝั่งเดียว)
  c.strokeRect(PX(-PB_W),PY(GL),RX(PB_W*2),RY(PB_D));
  c.strokeRect(PX(-GB_W),PY(GL),RX(GB_W*2),RY(GB_D));
  c.beginPath(); c.ellipse(PX(0),PY(GL+SPOT),RX(.3),RY(.3),0,0,7); c.fill();
  // โค้งหน้าเขตโทษ: วาดเฉพาะส่วนที่พ้นกรอบเขตโทษออกมา (คำนวณมุมตัดจากระยะจริง)
  const cut=Math.acos(Math.max(-1,Math.min(1,(GL+PB_D-(GL+SPOT))/ARC)));         // มุมที่โค้งตัดขอบเขตโทษ
  c.beginPath(); c.ellipse(PX(0),PY(GL+SPOT),RX(ARC),RY(ARC),0,cut,Math.PI-cut); c.stroke();
  // โค้งมุมสนาม (เฉพาะ 2 มุมฝั่งประตู)
  [[X0,GL],[X1,GL]].forEach(([cx,cz])=>{
    c.beginPath(); c.ellipse(PX(cx),PY(cz),RX(1),RY(1),0,0,7); c.stroke();
  });
  return new THREE.CanvasTexture(cv);
}
function soccerNetTexture(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d'); c.clearRect(0,0,128,128);
  c.strokeStyle='rgba(255,255,255,.9)'; c.lineWidth=1.6;
  for(let i=0;i<=128;i+=10){ c.beginPath(); c.moveTo(i,0); c.lineTo(i,128); c.moveTo(0,i); c.lineTo(128,i); c.stroke(); }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(6,3); return t;
}
/* ฝูงชนแบบชั้นที่นั่ง: แถวเก้าอี้เข้ม + หัว-ไหล่คนสุ่มสี ไล่แถว (อ่านเป็นสแตนด์จริงจากไกล) */
function soccerCrowdTexture(){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=128;
  const c=cv.getContext('2d'); c.fillStyle='#232a31'; c.fillRect(0,0,512,128);
  const cols=['#ff5252','#ffd54f','#4fc3f7','#eceff1','#66bb6a','#ba68c8','#ff8a65','#274b8f','#c62828'];
  const skin=['#ffcf9e','#e8b184','#b07b4f'];
  for(let row=0;row<6;row++){
    const y0=14+row*19;
    c.fillStyle=row%2?'#2c343c':'#28303a'; c.fillRect(0,y0-8,512,19);          // แถบชั้นที่นั่ง
    for(let x=3+(row%2)*4;x<512;x+=9){
      const jx=x+(Math.random()-.5)*3, jy=y0+(Math.random()-.5)*4;
      c.fillStyle=cols[(Math.random()*cols.length)|0];                          // เสื้อ (ไหล่)
      c.fillRect(jx-3.4,jy,6.8,7);
      c.fillStyle=skin[(Math.random()*skin.length)|0];                          // หัว
      c.beginPath(); c.arc(jx,jy-1.5,2.6,0,7); c.fill();
    }
  }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(5,1); return t;
}
/* ลูกบอลลายจริง: แพตเทิร์นห้าเหลี่ยมจัดเรียงสม่ำเสมอ (แถวสลับ offset) + แสงเงานุ่ม — ห่อทรงกลมแล้วอ่านเป็นบอลแข่ง */
function soccerBallMat(){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=128;
  const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,0,128);
  g.addColorStop(0,'#ffffff'); g.addColorStop(.55,'#f2f2f2'); g.addColorStop(1,'#d8d8d8');
  c.fillStyle=g; c.fillRect(0,0,256,128);
  const pent=(x,y,r,rot)=>{ c.beginPath();
    for(let k=0;k<5;k++){ const a=rot+k/5*Math.PI*2; const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r; k?c.lineTo(px,py):c.moveTo(px,py); }
    c.closePath(); c.fill(); c.stroke(); };
  c.fillStyle='#181818'; c.strokeStyle='rgba(0,0,0,.35)'; c.lineWidth=2;
  for(let row=0;row<3;row++) for(let col=0;col<5;col++){
    const x=26+col*52+(row%2)*26, y=20+row*44;
    pent(x,y,11,row*.5+col*.3);
  }
  c.strokeStyle='rgba(0,0,0,.12)'; c.lineWidth=1.4;                             // ตะเข็บจางเชื่อมแผ่น
  for(let i=0;i<10;i++){ c.beginPath(); c.moveTo(Math.random()*256,Math.random()*128);
    c.quadraticCurveTo(Math.random()*256,Math.random()*128,Math.random()*256,Math.random()*128); c.stroke(); }
  return new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(cv)});
}
/* ประตูจริง: เสา-คานขาว + เสาค้ำหลังเอียง + ตาข่ายหลังลาดเก็บบอล (เก็บ mesh ไว้ให้กระเพื่อมตอนบอลปะทะ) */
function buildSoccerGoal(sc,z,w,h){
  const white=new THREE.MeshLambertMaterial({color:0xffffff});
  const r=SPOST_R, hw=w/2, depth=2.4;
  soccerNets=[];
  [-hw,hw].forEach(x=>{ const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,10),white); p.position.set(x,h/2,z); sc.add(p); });
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w,10),white); bar.rotation.z=Math.PI/2; bar.position.set(0,h,z); sc.add(bar);
  [-hw,hw].forEach(x=>{                                        // เสาค้ำหลัง (เอียงจากหัวเสาลงท้ายตาข่าย)
    const st=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,Math.hypot(h,depth),8),white);
    st.position.set(x,h/2,z-depth/2); st.rotation.x=Math.atan2(depth,h); sc.add(st);
  });
  const net=new THREE.MeshBasicMaterial({map:soccerNetTexture(),transparent:true,side:THREE.DoubleSide,opacity:.55,depthWrite:false});
  const back=new THREE.Mesh(new THREE.PlaneGeometry(w,Math.hypot(h*.55,depth*.4)+h*.6),net);
  back.position.set(0,h*.42,z-depth*.8); back.rotation.x=-.32; sc.add(back);    // ผืนหลังลาดเหมือนตาข่ายหย่อน
  const top=new THREE.Mesh(new THREE.PlaneGeometry(w,depth*.7),net); top.rotation.x=Math.PI/2; top.position.set(0,h*.98,z-depth*.35); sc.add(top);
  soccerNets.push(back,top);
  [-hw,hw].forEach(x=>{ const sd=new THREE.Mesh(new THREE.PlaneGeometry(depth,h),net); sd.rotation.y=Math.PI/2; sd.position.set(x,h/2,z-depth/2); sc.add(sd); soccerNets.push(sd); });
  soccerNets.forEach(m=>{ m.userData.bx=m.rotation.x; });
}
/* อัฒจันทร์ 2 ชั้นเอียง + กำแพงหน้า + หลังคายื่น + สปอตไลต์ 4 มุม */
function buildStands(sc,fw,fl){
  const crowdM=new THREE.MeshLambertMaterial({map:soccerCrowdTexture(),side:THREE.DoubleSide});
  applyTex(crowdM,'soccer_crowd',2,1);                          // 📷 ภาพฝูงชนจริง — repeat 2 ให้คนขนาดสมจริง (รอบ 397)
  const wallM=new THREE.MeshLambertMaterial({color:0x39424c});
  const roofM=new THREE.MeshLambertMaterial({color:0x222a33,side:THREE.DoubleSide});
  const hw=fw/2+5, hl=fl/2+5;
  const side=(len,px,pz,ry)=>{
    const g=new THREE.Group(); g.position.set(px,0,pz); g.rotation.y=ry;        // สร้างบนแกน local: ผนังหันเข้าสนาม (-z ใน local)
    const wall=new THREE.Mesh(new THREE.PlaneGeometry(len,1.4),wallM); wall.position.set(0,.7,0); g.add(wall);
    [[.9,4.6,1.5],[4.4,4.6,4.2]].forEach(([z0,tH,y0])=>{                        // 2 ชั้น: [ระยะถอย, สูงผืน, ฐาน y]
      const tier=new THREE.Mesh(new THREE.PlaneGeometry(len,tH),crowdM);
      tier.position.set(0,y0+tH*.34,z0+tH*.3); tier.rotation.x=-.58; g.add(tier);
    });
    const roof=new THREE.Mesh(new THREE.PlaneGeometry(len,5.4),roofM);
    roof.position.set(0,9.6,4.4); roof.rotation.x=Math.PI/2-.12; g.add(roof);
    const backW=new THREE.Mesh(new THREE.PlaneGeometry(len,9.6),wallM); backW.position.set(0,4.8,7.4); g.add(backW);
    sc.add(g);
  };
  side(fw+16,0,-hl,Math.PI); side(fw+16,0,hl,0);
  side(fl+16,-hw,0,-Math.PI/2); side(fl+16,hw,0,Math.PI/2);
  const poleM=new THREE.MeshLambertMaterial({color:0x8a97a5});
  const glowM=new THREE.MeshBasicMaterial({color:0xfffbe0});
  [[-hw-4,-hl-4],[hw+4,-hl-4],[-hw-4,hl+4],[hw+4,hl+4]].forEach(([x,z])=>{      // สปอตไลต์มุมสนาม
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.22,.3,17,8),poleM); pole.position.set(x,8.5,z); sc.add(pole);
    const head=new THREE.Group(); head.position.set(x,17.6,z); head.lookAt(0,0,0);
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2.2),new THREE.MeshLambertMaterial({color:0x2a2f36,side:THREE.DoubleSide}));
    head.add(panel);
    for(let r=0;r<2;r++) for(let k=0;k<4;k++){
      const b=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),glowM);
      b.position.set(-1.2+k*.8,-.5+r*1,0.12); head.add(b);
    }
    sc.add(head);
  });
}
/* ป้าย LED ริมสนาม (แบรนด์ในเกม) — วางเตี้ยรอบขอบสนามแบบสนามแข่งจริง · วางภาพจริง img/tex/soccer_ads.jpg ทับได้ */
function soccerLedBoards(sc,fw,fl){
  const cv=document.createElement('canvas'); cv.width=1024; cv.height=64;
  const c=cv.getContext('2d');
  const ads=[['#1450b4','VOCAB WORLD ⚽'],['#c62828','ENGLISH IS FUN!'],['#1b8a3a','PET SHOP 🐾'],['#6a1fa0','GOAL! GOAL! GOAL!']];
  ads.forEach(([bg,txt],i)=>{ c.fillStyle=bg; c.fillRect(i*256,0,256,64);
    c.fillStyle='#fff'; c.font='900 30px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(txt,i*256+128,34); });
  const baseTex=new THREE.CanvasTexture(cv);
  baseTex.wrapS=baseTex.wrapT=THREE.RepeatWrapping;
  const hw=fw/2+3.4, hl=fl/2+3.4, H=.9;
  // ⚠️ รอบ 397: ต้อง applyTex ต่อป้ายแต่ละใบ — applyTex โหลดภาพแบบ async ถ้า clone material ไว้ก่อน
  //    ป้ายจะค้างอยู่กับภาพวาด canvas ไม่มีวันได้ภาพจริง
  const add=(len,px,pz,ry,rep)=>{
    const t=baseTex.clone(); t.needsUpdate=true; t.repeat.set(rep,1);
    const m2=new THREE.MeshBasicMaterial({map:t});
    const b=new THREE.Mesh(new THREE.PlaneGeometry(len,H),m2);
    b.position.set(px,H/2+.02,pz); b.rotation.y=ry; b.rotation.x=-.1; sc.add(b);
    applyTex(m2,'soccer_ads',rep,1);
  };
  add(fw+8,0,-hl,0,2); add(fw+8,0,hl,Math.PI,2);
  add(fl+8,-hw,0,Math.PI/2,3); add(fl+8,hw,0,-Math.PI/2,3);
}
/* 🔊 เสียงสนามสังเคราะห์ (แพตเทิร์น MechaAudio · ปลอดลิขสิทธิ์) — ฮัมฝูงชนลูป + เตะ + เสา + ตาข่าย + เชียร์กระหึ่ม */
const SoccerAudio={
  ctx:null, ambNodes:null,
  ac(){ if(!this.ctx){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return this.ctx; },
  amb(){ if(!state.sound||this.ambNodes) return; const c=this.ac(); if(!c) return;
    const len=Math.floor(c.sampleRate*2), buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    let last=0; for(let i=0;i<len;i++){ last=(last+(Math.random()*2-1)*.02)*.995; d[i]=last*6; }  // เสียงฮัมทุ้มแบบฝูงชนไกลๆ
    const src=c.createBufferSource(); src.buffer=buf; src.loop=true;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=420; bp.Q.value=.5;
    const g=c.createGain(); g.gain.value=.0001;
    const lfo=c.createOscillator(); lfo.frequency.value=.13;                     // คลื่นฮัมเบาๆ ขึ้นลงช้า
    const lg=c.createGain(); lg.gain.value=.02;
    lfo.connect(lg); lg.connect(g.gain);
    src.connect(bp); bp.connect(g); g.connect(c.destination);
    src.start(); lfo.start();
    g.gain.exponentialRampToValueAtTime(.07,c.currentTime+1.6);
    this.ambNodes={src,lfo,g};
  },
  stopAmb(){ const n=this.ambNodes; if(!n) return; this.ambNodes=null;
    try{ const c=this.ctx, t=c.currentTime; n.g.gain.cancelScheduledValues(t);
      n.g.gain.setValueAtTime(Math.max(.0001,n.g.gain.value),t); n.g.gain.exponentialRampToValueAtTime(.0001,t+.4);
      n.src.stop(t+.5); n.lfo.stop(t+.5); }catch(e){}
  },
  kick(power){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime, v=.2+(power/100)*.45;
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(42,t+.12);
    const g=c.createGain(); g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.001,t+.16);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.18);
    const n=c.createBufferSource(), buf=c.createBuffer(1,900,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
    n.buffer=buf; const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1700; bp.Q.value=.7;
    const ng=c.createGain(); ng.gain.value=v*.5; n.connect(bp); bp.connect(ng); ng.connect(c.destination); n.start(t); },
  bounce(v){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(110,t); o.frequency.exponentialRampToValueAtTime(55,t+.07);
    const g=c.createGain(); g.gain.setValueAtTime(Math.min(.25,v*.02),t); g.gain.exponentialRampToValueAtTime(.001,t+.09);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.1); },
  post(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // "ปิ๊ง" โลหะโดนเสา
    [620,935,1420,2210].forEach((f,i)=>{ const o=c.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(f*(1+(Math.random()-.5)*.01),t);
      const g=c.createGain(); g.gain.setValueAtTime(.22/(i+1),t); g.gain.exponentialRampToValueAtTime(.0001,t+.5-i*.07);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.55); }); },
  net(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;    // "ฟึ่บ" บอลซุกตาข่าย
    const n=c.createBufferSource(), buf=c.createBuffer(1,Math.floor(c.sampleRate*.25),c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.5);
    n.buffer=buf; const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=3400; bp.Q.value=.6;
    const g=c.createGain(); g.gain.value=.22; n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t); },
  goal(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // ฝูงชนเชียร์กระหึ่ม ~2 วิ
    const len=Math.floor(c.sampleRate*2.2), buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    let last=0; for(let i=0;i<len;i++){ last=(last+(Math.random()*2-1)*.05)*.99; d[i]=last*4+(Math.random()*2-1)*.25; }
    const n=c.createBufferSource(); n.buffer=buf;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.setValueAtTime(700,t); bp.frequency.linearRampToValueAtTime(1300,t+.5); bp.Q.value=.4;
    const g=c.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.5,t+.28); g.gain.exponentialRampToValueAtTime(.001,t+2.1);
    n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t);
    [880,1100,1320].forEach((f,i)=>{ const o=c.createOscillator(); o.type='triangle';         // เสียงนกหวีด/โห่แหลมแทรก
      o.frequency.setValueAtTime(f,t+.15+i*.12); o.frequency.linearRampToValueAtTime(f*1.12,t+.5+i*.12);
      const og=c.createGain(); og.gain.setValueAtTime(.0001,t+.15+i*.12); og.gain.exponentialRampToValueAtTime(.05,t+.25+i*.12); og.gain.exponentialRampToValueAtTime(.0001,t+.8+i*.12);
      o.connect(og); og.connect(c.destination); o.start(t+.15+i*.12); o.stop(t+.9+i*.12); }); },
  save(){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // 🧤 ตุ้บ+ฝูงชน "โอ้ว" ผิดหวัง
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(50,t+.1);
    const g=c.createGain(); g.gain.setValueAtTime(.4,t); g.gain.exponentialRampToValueAtTime(.001,t+.14);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.15);
    const n=c.createBufferSource(), buf=c.createBuffer(1,Math.floor(c.sampleRate*.9),c.sampleRate), d=buf.getChannelData(0);
    let last=0; for(let i=0;i<d.length;i++){ last=(last+(Math.random()*2-1)*.05)*.99; d[i]=last*4; }
    n.buffer=buf; const bp=c.createBiquadFilter(); bp.type='bandpass';
    bp.frequency.setValueAtTime(900,t); bp.frequency.linearRampToValueAtTime(450,t+.8); bp.Q.value=.6;
    const ng=c.createGain(); ng.gain.setValueAtTime(.0001,t); ng.gain.exponentialRampToValueAtTime(.2,t+.12); ng.gain.exponentialRampToValueAtTime(.001,t+.85);
    n.connect(bp); bp.connect(ng); ng.connect(c.destination); n.start(t); },
  whistle(long){ if(!state.sound) return; const c=this.ac(); if(!c) return; const t=c.currentTime;   // 🎺 นกหวีดกรรมการ (long=จบเกม 3 จังหวะ)
    const blows=long?[0,.28,.56]:[0]; const dur=long?.22:.5;
    blows.forEach(dt0=>{ const o=c.createOscillator(); o.type='square'; o.frequency.value=2350;
      const vib=c.createOscillator(); vib.frequency.value=38; const vg=c.createGain(); vg.gain.value=140;
      vib.connect(vg); vg.connect(o.frequency);
      const g=c.createGain(); g.gain.setValueAtTime(.0001,t+dt0); g.gain.exponentialRampToValueAtTime(.12,t+dt0+.02); g.gain.exponentialRampToValueAtTime(.0001,t+dt0+dur);
      o.connect(g); g.connect(c.destination); o.start(t+dt0); o.stop(t+dt0+dur+.02); vib.start(t+dt0); vib.stop(t+dt0+dur+.02); }); },
};
/* ==== ⚽🧤🎯🎬 รอบ 397: น้อง GK เฝ้าประตู + โหมดจุดโทษจับเวลา + รีเพลย์สโลว์โมชัน ==== */
/* 🧤 น้อง (สัตว์เลี้ยงตัว active) ยืนเฝ้าประตู — แผ่นสไปรต์อบจาก 3D (img/anim/) เล่นเฟรมด้วย texture offset */
function soccerGKEnsure(){
  const p=(typeof activePet==='function'&&activePet())||null;
  const ty=(p&&GK_SPRITES[p.type])?p.type:'cat';
  if(gkMesh && gkType===ty) return;
  if(gkMesh&&scene){ scene.remove(gkMesh); gkMesh.material.map.dispose(); gkMesh.material.dispose(); gkMesh=null; }
  const sp=GK_SPRITES[ty];
  const t=new THREE.TextureLoader().load('img/anim/'+sp.f);
  t.minFilter=THREE.LinearFilter; t.generateMipmaps=false;         // แผ่นยาว 24 ช่อง non-POT — ปิด mipmap กันเบลอ/พัง WebGL1
  t.repeat.set(1/24,1);
  const h=ty==='dragon'?2.1:1.7, w=h*sp.fw/sp.fh;
  gkMesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),
    new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
  gkMesh.position.set(0,h/2+.02,GK_Z); gkMesh.userData={h,fps:sp.fps};
  gkType=ty; gkX=0; scene.add(gkMesh);
}
/* GK วิ่งตามบอล (มีลีลาหน่วง ไม่เก่งเกิน — ยิงเสามุม/โด่งข้ามหัวชนะได้) + ปัดบอลเมื่อเข้าระยะ */
function soccerGKTick(dt,now){
  if(!gkMesh) return;
  const b=soccerBall.position;
  const chasing=sbLive && b.z<GOAL_Z+9 && sbVel.z<0;               // รีแอคชันจริง: บอลเข้าใกล้ ~9m ค่อยพุ่ง (ลูกเร็ว/มุมเสาแซงทัน)
  const tgt=chasing? b.x*.92 : Math.sin(now/1400)*1.6;             // ว่าง=เดินวนหน้าประตู
  const mx=Math.max(-GOAL_HW+1.5,Math.min(GOAL_HW-1.5,tgt));       // วิ่งไม่ถึงเสา — ยิงเบียดเสาคือคำตอบ
  const sp=chasing?GK_SPEED:1.1;
  gkX+=Math.max(-sp*dt,Math.min(sp*dt,mx-gkX));
  gkMesh.position.x=gkX; gkMesh.position.z=GK_Z;
  const ud=gkMesh.userData;
  const fr=Math.floor(now/1000*ud.fps)%24;                         // เดินเฟรมสไปรต์
  gkMesh.material.map.offset.x=fr/24;
  if(gkSaveAt&&now-gkSaveAt<420){                                  // ท่าพุ่งปัด: เอียงตัวไปทางบอลแป๊บนึง
    const k=(now-gkSaveAt)/420; gkMesh.rotation.z=Math.sin(k*Math.PI)*.55*-Math.sign(sbVel.x||1);
  } else gkMesh.rotation.z=0;
  // ปัดบอล: บอลผ่านแนว GK ในระยะเอื้อม (ต่ำกว่าเอื้อม+ไม่ไกลเกินข้าง)
  if(sbLive && now>gkCoolAt && sbVel.z<0 && b.z<GK_Z+.7 && b.z>GK_Z-.6 &&
     Math.abs(b.x-gkX)<GK_REACH_X && b.y<GK_REACH_Y){
    sbVel.z=Math.abs(sbVel.z)*.42;                                 // ปัดสะท้อนกลับ + เฉไปข้าง + เด้งขึ้นเล็กน้อย
    sbVel.x+=(b.x-gkX)*3+(Math.random()-.5)*2;
    sbVel.y=Math.abs(sbVel.y)*.35+2.2;
    sbSpin.x*=.3; sbSpin.y*=.3;
    gkSaveAt=now; gkCoolAt=now+700;
    SoccerAudio.save();
    showBanner('🧤 <b>น้องเซฟได้!</b> ลองยิงเสามุม/โด่งข้ามหัวดูสิ');
  }
}
/* 🧱 รอบ 402: โหมดฟรีคิก — กำแพงคนยืนขวางหน้าบอล 9.15m ตามกติกาจริง
   ยิงตรงๆ ไม่ผ่าน ต้อง "ปั่นโค้งอ้อมข้าง" หรือ "เตะใต้ลูกให้ลอยข้ามหัว" = ระบบจุดสัมผัสได้ใช้เต็มที่ */
function fkBuildWall(){
  if(fkWall) return;
  fkWall=new THREE.Group(); fkMen=[];
  const cols=[0x2b6cd4,0x2b6cd4,0x2b6cd4,0x2b6cd4,0x2b6cd4];
  for(let i=0;i<FK_WALL_N;i++){
    const man=makeSoccerPlayer(cols[i%cols.length], String(2+i));
    const x=(i-(FK_WALL_N-1)/2)*0.78;
    man.position.set(x,0,0);
    man.rotation.y=Math.PI;                     // หันหน้าเข้าหาคนเตะ
    // แขนไขว้ป้องกันแบบกำแพงจริง (หมุนแขนเข้าหากลางลำตัว)
    fkWall.add(man); fkMen.push({m:man,x});
  }
  fkWall.visible=false;
  scene.add(fkWall);
}
function fkToggle(){
  fkBuildWall();
  fkOn=!fkOn;
  sBaseZ = fkOn ? FK_SPOT_Z : (pkOn ? PK_SPOT_Z : PLAYER_Z);
  sBaseX = 0;                                       // 🎲 รอบ 404: โหมดฟรีคิก/ปกติ กลับมาตั้งกลางก่อน (ปกติจะสุ่มใหม่ตอน reset)
  if(fkOn){ aimYaw=0; aimPitch=.34; }
  fkWall.visible=fkOn;
  fkWall.position.set(0,0,sBaseZ-FK_WALL_GAP);
  if(soccerPlayer) soccerPlayer.position.set(sBaseX,0,sBaseZ);
  soccerResetBall();
  const b=overlayEl.querySelector('#adv-fk');
  if(b){ b.classList.toggle('on',fkOn); b.textContent=fkOn?'⏹ เลิกฟรีคิก':'🧱 ฟรีคิก'; }
  sfx.select();
  if(fkOn) showBanner('🧱 <b>ฟรีคิก!</b><br><small>กำแพงคนขวางอยู่ — เปิด 🎱 จุดสัมผัส แล้ว<b>ปั่นอ้อมข้าง</b> หรือ<b>เตะใต้ลูกให้ข้ามหัว</b></small>');
}
/* บอลชนกำแพง = เด้งกลับ (เช็กทรงกระบอกต่อคน) */
function fkHitTest(now){
  if(!fkOn||!sbLive||!fkWall) return;
  const b=soccerBall.position, wz=fkWall.position.z;
  if(Math.abs(b.z-wz)>0.55 || sbVel.z>=0) return;          // ต้องวิ่งเข้าหากำแพงและอยู่ระนาบเดียวกัน
  if(b.y>FK_MAN_H+BALL_R) return;                          // ลอยข้ามหัวไปแล้ว = รอด
  for(const mn of fkMen){
    if(Math.abs(b.x-mn.x)<FK_MAN_R+BALL_R){
      sbVel.z=Math.abs(sbVel.z)*.42;                       // เด้งกลับ
      sbVel.x+=(b.x-mn.x)*4+(Math.random()-.5)*1.5;
      sbVel.y=Math.abs(sbVel.y)*.4+1.6;
      sbSpin.y*=.35;
      b.z=wz+0.56;
      SoccerAudio.save();
      showBanner('🧱 <b>ชนกำแพง!</b> ลองปั่นอ้อมข้าง หรือเตะใต้ลูกให้ลอยข้ามหัว');
      return;
    }
  }
}
/* 🎯 โหมดจุดโทษจับเวลา 60 วิ — ยืนจุดโทษ 7m ยิงให้ผ่านน้อง GK เก็บแต้ม (+เหรียญเล็กน้อย/ประตู) */
function pkHud(){
  if(pkHudEl) return pkHudEl;
  pkHudEl=document.createElement('div');
  pkHudEl.style.cssText='position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:7;'+
    'background:rgba(10,26,12,.72);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:12px;'+
    'padding:6px 16px;font:800 15px system-ui;display:none;pointer-events:none;white-space:nowrap';
  overlayEl.appendChild(pkHudEl);
  return pkHudEl;
}
function pkStart(){
  if(repOn) return;
  if(fkOn) fkToggle();                             // 🧱 รอบ 402: เข้าโหมดจุดโทษ = เก็บกำแพงฟรีคิกก่อน (ไม่ให้ 2 โหมดชนกัน)
  pkOn=true; pkGoals=0; pkKicks=0; pkEndAt=performance.now()+PK_TIME*1000;
  pkBest=state.soccerPKBest||0;
  sBaseZ=PK_SPOT_Z; sBaseX=0; aimYaw=0; aimPitch=.34;              // 🎲 รอบ 404: จุดโทษยืนตรงกลางเสมอ (ไม่สุ่ม)
  letters.forEach(l=>l.spr.visible=false);                         // เก็บป้ายคำไว้ก่อน โฟกัสดวลจุดโทษ
  if(soccerPlayer) soccerPlayer.position.set(sBaseX,0,sBaseZ);
  soccerResetBall();
  const btn=overlayEl.querySelector('#adv-pk'); if(btn){ btn.classList.add('on'); btn.textContent='⏹ เลิกดวล'; }
  pkHud().style.display='block';
  SoccerAudio.whistle();
  showBanner('🎯 <b>ดวลจุดโทษ 60 วินาที!</b><br><small>ยิงให้ผ่านน้อง GK — มุมเสา/โด่งเข้าคาน ได้ใจกรรมการ</small>');
}
function pkEnd(byUser){
  if(!pkOn) return;
  pkOn=false; sBaseZ=PLAYER_Z;
  letters.forEach(l=>l.spr.visible=true);
  soccerResetBall();                                               // 🎲 จบดวล = กลับไปสุ่มจุดยืนตามปกติ
  const btn=overlayEl.querySelector('#adv-pk'); if(btn){ btn.classList.remove('on'); btn.textContent='🎯 จุดโทษ'; }
  if(pkHudEl) pkHudEl.style.display='none';
  SoccerAudio.whistle(true);
  const coin=pkGoals*PK_COIN;
  if(coin>0){ addCoins(coin); sessionCoins+=coin; renderHudTop(); }
  const best=pkGoals>pkBest&&!byUser;
  if(pkGoals>(state.soccerPKBest||0)){ state.soccerPKBest=pkGoals; saveState(); }
  showBanner(`🏁 <b>จบการดวล!</b> ยิงเข้า ${pkGoals}/${pkKicks} ลูก ${coin>0?`· +${coin}🪙`:''}`+
    (best?'<br>🏆 <small>สถิติใหม่!</small>':`<br><small>สถิติดีสุด ${state.soccerPKBest||0} ประตู</small>`));
}
function pkTick(now){
  if(!pkOn) return;
  const left=Math.max(0,Math.ceil((pkEndAt-now)/1000));
  pkHud().textContent=`⏱ ${left} วิ · ⚽ ${pkGoals}/${pkKicks} · 🏆 ${Math.max(pkBest,pkGoals)}`;
  if(now>=pkEndAt) pkEnd(false);
}
/* 🎬 รีเพลย์สโลว์โมชัน — บันทึกวิถีบอลทุกเฟรม ยิงเข้ามุมสวย (ชิดเสา/ใต้คาน/โค้งจัด) = ฉายซ้ำ 0.35× มุมกล้องข้างประตู */
function repQualify(bx,by){
  return Math.abs(bx)>GOAL_HW*.5 || by>GOAL_H*.55 || Math.abs(sbSpin.y)>3.5;
}
function repEnsureEl(){
  if(repEl) return repEl;
  repEl=document.createElement('div');
  repEl.style.cssText='position:absolute;inset:0;z-index:8;display:none;pointer-events:none';
  repEl.innerHTML='<div style="position:absolute;top:0;left:0;right:0;height:11%;background:#000"></div>'+
    '<div style="position:absolute;bottom:0;left:0;right:0;height:11%;background:#000"></div>'+
    '<div id="rep-tag" style="position:absolute;top:13%;right:4%;color:#fff;font:900 18px system-ui;'+
    'letter-spacing:2px;text-shadow:0 2px 8px #000">🎬 REPLAY ●</div>';
  overlayEl.appendChild(repEl);
  return repEl;
}
function repStart(){
  if(repTrace.length<12) return;
  repOn=true; repT=0;
  repSide=(repTrace[repTrace.length-1].x>=0)?1:-1;
  repEnsureEl().style.display='block';
  if(pkOn){ repPkLeft=Math.max(0,pkEndAt-performance.now()); if(pkHudEl) pkHudEl.style.display='none'; }   // ⏸ หยุดนาฬิกาดวลระหว่างฉาย
}
function repTick(dt,now){
  if(!repTrace.length){                                            // ⚠️ กันพัง: ถ้าวิถีถูกล้างระหว่างฉาย (เตะใหม่ซ้อน) อย่าให้ทั้งโลกค้าง
    repOn=false; if(repEl) repEl.style.display='none';
    if(pkOn&&pkHudEl) pkHudEl.style.display='block';
    return;
  }
  repT+=dt*.35;                                                    // สโลว์โมชัน 0.35×
  const idx=repT/.016;
  const i0=Math.min(repTrace.length-1,Math.floor(idx)), i1=Math.min(repTrace.length-1,i0+1);
  const f=idx-i0, a=repTrace[i0], b2=repTrace[i1];
  const b=soccerBall.position;
  b.x=a.x+(b2.x-a.x)*f; b.y=a.y+(b2.y-a.y)*f; b.z=a.z+(b2.z-a.z)*f;
  soccerBall.rotateOnWorldAxis(_sbAxis.set(1,0,.3).normalize(),dt*4);
  if(sbShadow){ sbShadow.position.set(b.x,.045,b.z); const k=1/(1+b.y*.22);
    sbShadow.scale.setScalar(Math.max(.35,k)); sbShadow.material.opacity=.34*Math.max(.25,k); }
  camera.position.set(repSide*(GOAL_HW+4.5),2.3,GOAL_Z+7.5);       // มุมกล้องถ่ายข้างประตูแบบ TV
  camera.lookAt(b.x,b.y+.2,b.z);
  const tag=repEl&&repEl.querySelector('#rep-tag');
  if(tag) tag.style.opacity=(Math.floor(now/400)%2)?'1':'.35';
  if(i0>=repTrace.length-1){                                       // ฉายจบ → กลับเกมจริง
    repOn=false; repEl.style.display='none';
    if(pkOn){ pkEndAt=performance.now()+repPkLeft; if(pkHudEl) pkHudEl.style.display='block'; }   // ▶️ เดินนาฬิกาต่อ
    soccerResetBall();
  }
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
/* ==== 👕 รอบ 939: ระบบชุดแข่ง — ลายเสื้อ + โลโก้ VOCAB WORLD + กางเกงเลือกสี ==== */
const ssCss=c=>'#'+('000000'+c.toString(16)).slice(-6);
/* สีรอง (ลายริ้ว/สายสะพาย): เสื้อเข้ม→ขาว · เสื้อสว่าง→กรมท่าเข้ม (คู่สีชุดแข่งจริงส่วนใหญ่) */
function ssSec(c){
  const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
  return (r*.299+g*.587+b*.114)>150 ? 0x1d2440 : 0xf4f6fa;
}
/* วาด "ลายเสื้อ" ลงพื้นที่ w×h — ใช้ร่วมกัน 3 ที่: เทกซ์เจอร์ตัวหุ่น · พรีวิวใหญ่ · ชิปเลือกลาย */
function ssPaintPattern(c,w,h,col,pat){
  const sec=ssCss(ssSec(col));
  c.fillStyle=ssCss(col); c.fillRect(0,0,w,h);
  c.fillStyle=sec;
  if(pat==='stripes'){ const n=5,sw=w/(n*2-1); for(let i=0;i<n;i++) c.fillRect(i*2*sw,0,sw,h); }
  else if(pat==='hoops'){ const n=4,sh=h/(n*2); for(let i=0;i<n;i++) c.fillRect(0,(i*2+1)*sh,w,sh); }
  else if(pat==='sash'){ c.beginPath(); c.moveTo(0,0); c.lineTo(w*.34,0); c.lineTo(w,h*.72); c.lineTo(w,h); c.lineTo(w*.72,h); c.lineTo(0,h*.30); c.closePath(); c.fill(); }
  else if(pat==='half'){ c.fillRect(0,0,w/2,h); }
  else if(pat==='chevron'){ c.beginPath(); c.moveTo(0,h*.18); c.lineTo(w/2,h*.44); c.lineTo(w,h*.18); c.lineTo(w,h*.40); c.lineTo(w/2,h*.66); c.lineTo(0,h*.40); c.closePath(); c.fill(); }
  else if(pat==='sleeves'){ c.fillRect(0,0,w,h*.10); }           // ตัวเสื้อ: แถบบ่าบาง (แขนต่างสีไปทาที่แขนจริง)
  else if(pat==='grad'){ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,ssCss(col)); g.addColorStop(1,sec); c.fillStyle=g; c.fillRect(0,0,w,h); }
}
/* เทกซ์เจอร์หน้าอก/หลัง/ข้างลำตัว — โลโก้ "VOCAB WORLD" ทุกตัว (ผู้ใช้สั่งข้อ 4) */
function soccerShirtTex(col,pat,face){
  const S=256, cv=document.createElement('canvas'); cv.width=cv.height=S;
  const c=cv.getContext('2d');
  ssPaintPattern(c,S,S,col,pat);
  const g=c.createLinearGradient(0,0,S,0);                       // แสงเงาผ้านุ่ม ๆ ให้ดูมีมิติ
  g.addColorStop(0,'rgba(0,0,0,.16)'); g.addColorStop(.25,'rgba(255,255,255,.05)');
  g.addColorStop(.75,'rgba(255,255,255,.05)'); g.addColorStop(1,'rgba(0,0,0,.16)');
  c.fillStyle=g; c.fillRect(0,0,S,S);
  if(face!=='side'){
    const lum=((col>>16)&255)*.299+((col>>8)&255)*.587+(col&255)*.114;
    const ink=lum>150?'#1d2440':'#ffffff', edge=lum>150?'rgba(255,255,255,.6)':'rgba(0,0,0,.45)';
    c.textAlign='center'; c.lineWidth=5; c.strokeStyle=edge; c.fillStyle=ink;
    if(face==='chest'){                                          // อก: โลโก้ใหญ่ 2 บรรทัดแบบสปอนเซอร์
      c.font='900 44px Arial'; c.strokeText('VOCAB',S/2,108); c.fillText('VOCAB',S/2,108);
      c.strokeText('WORLD',S/2,158); c.fillText('WORLD',S/2,158);
    } else {                                                     // หลัง: โลโก้เหนือเบอร์ (เบอร์เป็น plane แยกทับกลาง)
      c.font='900 30px Arial'; c.strokeText('VOCAB WORLD',S/2,44); c.fillText('VOCAB WORLD',S/2,44);
    }
  }
  const t=new THREE.CanvasTexture(cv); t.anisotropy=4; return t;
}
/* หุ่นนักเตะบล็อก: เสื้อลาย+โลโก้ · กางเกงเลือกสี · เบอร์หลังเสื้อ (หัน +Z = ด้านหลัง เห็นจากกล้องหลังบอล) · ขวา = ขาเตะ */
function makeSoccerPlayer(shirtColor,no,shortColor,pat){
  shortColor=shortColor==null?0xf4f4f4:shortColor; pat=pat||'plain';
  const g=new THREE.Group();
  g.rotation.order='YXZ';   // 🧍 รอบ 852: หมุน yaw ก่อนค่อยเอนตัว (rotation.x) — การเอนจึงสัมพัทธ์กับทิศที่หันเสมอ
  const skin=blkMat(0xffcf9e), shorts=blkMat(shortColor), hairM=blkMat(0x2b2320), boot=blkMat(0x232323);
  const legs=[];
  [-0.15,0.15].forEach(x=>{
    const piv=new THREE.Group(); piv.position.set(x,.5,0);
    const thigh=new THREE.Mesh(blkGeo(.22,.34,.24),shorts); thigh.position.y=-.17; piv.add(thigh);
    const shin=new THREE.Mesh(blkGeo(.2,.3,.22),skin); shin.position.y=-.46; piv.add(shin);
    const bt=new THREE.Mesh(blkGeo(.22,.14,.34),boot); bt.position.set(0,-.62,.05); piv.add(bt);
    g.add(piv); legs.push(piv);
  });
  // 👕 รอบ 939: ลำตัว 6 หน้า — อก(-z)/หลัง(+z) มีลาย+โลโก้ · ข้างลำตัวลายล้วน · บน-ล่างสีพื้น
  const mSide=new THREE.MeshLambertMaterial({map:soccerShirtTex(shirtColor,pat,'side')});
  const mChest=new THREE.MeshLambertMaterial({map:soccerShirtTex(shirtColor,pat,'chest')});
  const mBack=new THREE.MeshLambertMaterial({map:soccerShirtTex(shirtColor,pat,'back')});
  const mPlainT=blkMat(shirtColor);
  const torso=new THREE.Mesh(new THREE.BoxGeometry(.58,.62,.34),
    [mSide,mSide,mPlainT,mPlainT,mBack,mChest]);   // [+x,-x,+y,-y,+z(หลัง),-z(อก)]
  torso.position.y=.82; g.add(torso);
  const num=new THREE.Mesh(new THREE.PlaneGeometry(.4,.4),
    new THREE.MeshBasicMaterial({map:soccerNumTex(no),transparent:true}));
  num.position.set(0,.86,.18); g.add(num);                       // ด้าน +Z (หลัง) — ขยับลงหลบโลโก้บนหลัง
  const armC = pat==='sleeves' ? ssSec(shirtColor) : shirtColor; // ✨ ลาย "แขนต่างสี"
  [-1,1].forEach(s=>{
    const arm=new THREE.Mesh(blkGeo(.15,.5,.2),blkMat(armC)); arm.position.set(s*.4,.82,0); arm.rotation.z=s*-.08; g.add(arm);
    const hand=new THREE.Mesh(blkGeo(.14,.14,.16),skin); hand.position.set(s*.44,.53,0); g.add(hand);
  });
  const head=new THREE.Mesh(blkGeo(.44,.44,.44),skin); head.position.y=1.32; g.add(head);
  const hair=new THREE.Mesh(blkGeo(.48,.16,.48),hairM); hair.position.y=1.5; g.add(hair);
  g.userData.legs=legs;
  return g;
}
/* 🎲 รอบ 404 (ผู้ใช้): สุ่มจุดยืนเตะใหม่ทุกครั้ง — มุม/ระยะต่างกันทุกลูก ต้องเล็งใหม่เสมอ
   (โหมดจุดโทษ/ฟรีคิกมีจุดตายตัวของตัวเอง ไม่สุ่ม) · หันหน้าเข้าประตูให้อัตโนมัติ ไม่งั้นเด็กงงว่าประตูอยู่ไหน */
function soccerNewSpot(){
  if(pkOn||fkOn) return;
  // 🎲 รอบ 411 (ผู้ใช้): จุดเกิดต้องอยู่ใน "ครึ่งสนามฝั่งที่ยิงประตู" เสมอ — รอบ 928 สนาม 2 เท่า: เส้นกลางอยู่ที่ z≈+23.8
  //    ช่วง z −8..+20 = พ้นเขตโทษ (จบที่ −18.6) และไม่ล้ำเส้นกลาง · ระยะยิง 30–58m (KICK_SPD_MAX 52 ลอยถึง 66m)
  sBaseX=(Math.random()*2-1)*26;                     // ซ้าย-ขวา ±26m (อยู่ในสนามกว้าง ±40)
  sBaseZ=-8+Math.random()*28;
  aimYaw=Math.atan2(-sBaseX, sBaseZ-GOAL_Z);        // เล็งไปกลางประตูเป็นค่าตั้งต้น
  // มุมยกตั้งต้นตามระยะ: ยิ่งไกลยิ่งต้องยิงราบ (รอบ 928: ระยะคูณ 2 → หารสัมประสิทธิ์ครึ่ง คงพฤติกรรมเดิม)
  const dist=Math.hypot(sBaseX, sBaseZ-GOAL_Z);
  aimPitch=Math.max(.10, Math.min(.30, .30-dist*.003));
  if(soccerPlayer) soccerPlayer.position.set(sBaseX,0,sBaseZ);
}
function soccerResetBall(){
  if(!soccerBall) return;
  soccerNewSpot();
  soccerBall.position.set(sBaseX,BALL_R,sBaseZ);
  sbVel.x=sbVel.y=sbVel.z=0; sbSpin.x=sbSpin.y=sbSpin.z=0; sbInNet=false; sbInGoal=false;
  sbLive=false; sbRestAt=0; sbGoaled=false; sChg=0; sCharging=false; sbFlame=false;   // 🔥 ดับไฟลูกเก่า (ควันที่ค้างกลางอากาศปล่อยจางเอง)
}
function soccerKick(power){
  if(repOn) return;                                  // 🎬 กำลังฉายรีเพลย์ = ห้ามเตะซ้อน (เดิมล้าง repTrace แล้วรีเพลย์พังทั้งโลก)
  // 🎱 รอบ 401: ความเร็ว/มุมยก/สปิน มาจาก "จุดสัมผัส" ผ่าน kickLaunch — สูตรเดียวกับเส้นไกด์ บอลจึงวิ่งตรงตามริบบิ้น
  const L=kickLaunch(power);
  const dx=Math.sin(aimYaw), dz=-Math.cos(aimYaw), ch=Math.cos(L.pit), sh=Math.sin(L.pit);
  sbVel.x=dx*ch*L.spd; sbVel.z=dz*ch*L.spd; sbVel.y=sh*L.spd;
  sbSpin.x=L.wx; sbSpin.z=0;                         // ωx>0 = แบ็คสปิน (ลอยค้าง) · ติดลบ = ท็อปสปิน (จิกลง)
  sbSpin.y=L.wy;                                     // 🌀 ไซด์สปิน = ลูกโค้ง (ตั้งจากจุดสัมผัส/ปัดปุ่มเตะ)
  sCurl=0; sHit=0; renderCurl(); renderSpinPad();    // ตั้งใหม่ทุกลูกแบบ PES (ไม่ค้างข้ามลูกให้งง)
  sbInNet=false; sbInGoal=false; repTrace=[];          // 🎬 เริ่มบันทึกวิถีลูกนี้
  sbFlame=auraActive()&&power>=FIRE_CHG;               // 🔥 รอบ 852: ชาร์จถึง 30% = ลูกไฟ + ควันหางมิสไซล์ · รอบ 933: เฉพาะร่างพลัง (ร่างธรรมดาไม่มีไฟ/ควัน)
  if(pkOn) pkKicks++;                                  // 🎯 นับลูกที่ดวล
  sbLive=true; sbRestAt=0; sbKickAt=performance.now(); sbGoaled=false; sLegSwing=1;
  SoccerAudio.kick(power);
  // 💥 รอบ 401: ฟีดแบ็ก "สะใจ" ตามแรงเตะ — กล้องกระตุก + สั่นยาวขึ้นเมื่อซัดเต็มแรง
  sKickPunch=Math.min(1,power/100);
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(power>75?[18,26,42]:30);
}
function soccerCheer(){ SoccerAudio.goal(); sfx.levelup(); showBanner('⚽ <b>เข้าประตู!</b> เก่งมาก!'); }
/* 🎀 รอบ 401: ริบบิ้นไกด์ — แถบแบนกว้างลอยตามวิถีบอล (แทนจุดกลมเล็ก)
   เทกซ์เจอร์: ไล่เฉดทอง-ขาวเรืองแสง + ขอบจางนุ่ม + ลายขีดวิ่งไหลไปทางประตู */
function guideTexture(){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=64;
  const c=cv.getContext('2d');
  // ⚠️ ใช้ "ขาวล้วน" แล้วย้อมสีด้วย material.color — ไม่งั้นย้อมเขียว/แดงตามพลังแล้วสีขุ่น (รอบ 402)
  const g=c.createLinearGradient(0,0,0,64);                 // แนวตั้ง = ความกว้างริบบิ้น (ขอบจาง กลางสว่าง)
  g.addColorStop(0,'rgba(255,255,255,0)');
  g.addColorStop(.22,'rgba(255,255,255,.5)');
  g.addColorStop(.5,'rgba(255,255,255,.95)');
  g.addColorStop(.78,'rgba(255,255,255,.5)');
  g.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=g; c.fillRect(0,0,256,64);
  c.globalCompositeOperation='lighter';                     // ลายขีดเฉียงวิ่งไหล (ฟีลหรู)
  for(let i=0;i<256;i+=32){
    const s=c.createLinearGradient(i,0,i+18,64);
    s.addColorStop(0,'rgba(255,255,255,0)');
    s.addColorStop(.5,'rgba(255,255,255,.4)');
    s.addColorStop(1,'rgba(255,255,255,0)');
    c.fillStyle=s; c.beginPath(); c.moveTo(i,0); c.lineTo(i+18,0); c.lineTo(i+2,64); c.lineTo(i-16,64); c.closePath(); c.fill();
  }
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.ClampToEdgeWrapping; t.repeat.set(3,1);
  return t;
}
/* ==== ⚡ รอบ 412: โหมดพลังโอเวอร์ไดรฟ์ (ออร่า + เส้นไกด์ + ลำแสงควงสว่าน) ==== */
function auraActive(){ return (state.soccerAuraUntil||0) > Date.now(); }
function auraLeftMs(){ return Math.max(0,(state.soccerAuraUntil||0)-Date.now()); }
/* ออร่าออกแบบเอง: วงแหวนพลังลอยขึ้น + แกนแสงเย็น + ประกายโคจร (โทนฟ้า-ขาว ไม่ใช่เปลวทองแบบการ์ตูนดัง) */
/* 🔵🔥 รอบ 935 (ผู้ใช้: "ปรับพลังรอบตัวให้เหมือนเปลวไฟสีน้ำเงินของจริง + คลื่นไหวธรรมชาติ"):
   อ้างอิงเปลวแก๊สจริง (Bunsen/LPG — ดู elgas.com.au, britannica.com "Bunsen burner"):
   ① กรวยใน = สว่างสุด ขาวอมฟ้า (จุดร้อนสุด ~1,500-1,960°C อยู่เหนือยอดกรวยใน)
   ② เปลวนอก = น้ำเงินอมม่วงจาง เกือบใส · โคนสีเข้มกว่าปลาย
   ③ เปลวฟ้า (เผาไหม้สมบูรณ์) "เลีย" ขึ้นเป็นคลื่น ไม่กระพือรุนแรงแบบเปลวเหลือง
   เทกซ์เจอร์ลิ้นเปลว: หยดน้ำคว่ำ โคนกว้าง-ปลายแหลม + แกนในสว่าง (คู่สีตามข้อ ①②) */
function auraFlameTex(){
  const W=64,H=128,cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const c=cv.getContext('2d');
  for(let i=0;i<=20;i++){                                  // เปลวนอก: วงไล่สีซ้อนตามแกนตั้ง
    const t=i/20, y=112-t*96, r=20*(1-t*.88)+2;
    const g=c.createRadialGradient(32,y,0,32,y,r);
    const col = t<.55 ? [(40+t/.55*60)|0,(90+t/.55*110)|0,255]        // โคน: น้ำเงินเข้ม → ฟ้าสด
                      : [(120+(t-.55)/.45*40)|0,(150-(t-.55)/.45*30)|0,255]; // ปลาย: ฟ้าอมม่วงจาง
    g.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${.3*(1-t*.45)})`);   // รอบ 941: .16→.3 — ยืดเป็นเสา 9m แล้วเนื้อน้ำเงินจางเกิน
    g.addColorStop(1,'rgba(20,40,180,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
  }
  for(let i=0;i<=10;i++){                                  // กรวยใน: สว่างสุด ขาวอมฟ้า (ครึ่งล่างของลิ้น)
    const t=i/10, y=112-t*54, r=9*(1-t*.85)+1.5;
    const g=c.createRadialGradient(32,y,0,32,y,r);
    g.addColorStop(0,`rgba(225,250,255,${.5*(1-t*.35)})`);
    g.addColorStop(.6,`rgba(120,210,255,${.28*(1-t*.4)})`);
    g.addColorStop(1,'rgba(60,140,255,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
  }
  return new THREE.CanvasTexture(cv);
}
/* 🌀 รอบ 941: ริบบิ้นเกลียวไฟส้ม — แถบเปลวต่อเนื่องทั้งเส้นพันรอบเสาไฟจากโคนถึงยอด
   เทกซ์เจอร์: แกนเหลืองขาวสว่าง ขอบส้มจางแบบเปลวจริง + ลิ้นไฟย่อยตามยาว · wrapS ซ้ำ = เลื่อนไหลได้ไม่รู้จบ */
function auraCoilTex(){
  const W=256,H=64,cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'rgba(255,60,0,0)');
  g.addColorStop(.25,'rgba(255,120,10,.55)');
  g.addColorStop(.5,'rgba(255,235,170,.95)');
  g.addColorStop(.75,'rgba(255,120,10,.55)');
  g.addColorStop(1,'rgba(255,60,0,0)');
  c.fillStyle=g; c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';
  for(let i=0;i<26;i++){                                   // ลิ้นไฟย่อยไล่ตามยาว — ให้เป็น "เปลว" ไม่ใช่แถบเรียบ
    const x=Math.random()*W, w=8+Math.random()*22, hh=H*(.3+Math.random()*.5);
    const fg=c.createRadialGradient(x,H/2,1,x,H/2,w);
    fg.addColorStop(0,'rgba(255,240,190,.5)'); fg.addColorStop(1,'rgba(255,120,0,0)');
    c.fillStyle=fg; c.beginPath(); c.ellipse(x,H/2,w,hh/2,0,0,7); c.fill();
  }
  const t=new THREE.CanvasTexture(cv); t.wrapS=THREE.RepeatWrapping; return t;
}
/* เรขาคณิต helix คงที่ (96 ช่วง × 4 รอบ สูง 8.8m โคนกว้าง-ยอดสอบ) — หมุน rotation.y + เลื่อน texture = วนไม่รู้จบ */
function auraCoilRibbon(off){
  const N=96, TURNS=4, CH=8.8, R0=.85, R1=.3, W0=.6, W1=.24;
  const pos=new Float32Array((N+1)*2*3), uv=new Float32Array((N+1)*2*2), idx=[];
  for(let i=0;i<=N;i++){
    const t=i/N, a=off + t*TURNS*Math.PI*2;
    const r=R0+(R1-R0)*t, y=.12+t*CH, w=(W0+(W1-W0)*t)/2;
    const x=Math.cos(a)*r, z=Math.sin(a)*r, o=i*6, u=i*4;
    pos[o]=x; pos[o+1]=y-w; pos[o+2]=z;
    pos[o+3]=x; pos[o+4]=y+w; pos[o+5]=z;
    uv[u]=t*TURNS; uv[u+1]=0; uv[u+2]=t*TURNS; uv[u+3]=1;
    if(i<N){ const k=i*2; idx.push(k,k+1,k+2, k+1,k+3,k+2); }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  geo.setIndex(idx);
  return new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:auraCoilTex(),transparent:true,
    side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.9}));
}
function buildAura(sc){
  auraGrp=new THREE.Group(); auraRings=[]; auraSparks=[];
  const ft=auraFlameTex();
  // 🔥 รอบ 941 (ผู้ใช้: "ไฟฟ้าไม่ใช่คนละก้อน — เป็นก้อนใหญ่ก้อนเดียว ใหญ่กว่าตัวผู้เล่น สูงท่วมหัว ×5"):
  //    เลิกวงลิ้นแยก 18 ลิ้น → สไปรต์เปลวใหญ่ 4 ชั้น "ซ้อนแกนเดียวกัน" กลางตัวผู้เล่น
  //    additive รวมแสงเป็นเนื้อไฟก้อนเดียว: เปลือกนอกกว้าง 2.6m (ตัวกว้าง .58) → แกนในสว่างแคบ
  //    สูง ~9.5m (หัวหุ่น 1.6m = ท่วมหัวหลายเท่า) · ทุกชั้นเอนไปทางเดียวกัน = ก้อนเดียวโยกทั้งก้อน
  [ {w:2.6,h:9.5,op:.5}, {w:2.1,h:8.8,op:.55}, {w:1.55,h:7.6,op:.6}, {w:1.05,h:6.2,op:.62} ]   // จูนหลังดูภาพ 2 รอบ: เนื้อน้ำเงินมาจากเทกซ์เจอร์ (alpha .3) — ชั้น op กลาง ๆ กันขาวโพลน
  .forEach((L,i)=>{
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:ft,transparent:true,depthWrite:false,
      blending:THREE.AdditiveBlending,opacity:L.op}));
    auraGrp.add(sp);
    auraRings.push({m:sp, w:L.w, h:L.h, op:L.op,
      p1:Math.random()*9, p2:Math.random()*9, f1:3.8+i*.7, f2:7.2+i*1.1});
  });
  // 🌀 รอบ 941 (ผู้ใช้: "ไม่ใช่ลูกเล็ก ๆ — เปลวยาวหมุนเป็นเกลียวจากล่างขึ้นบน วนไม่รู้จบ"):
  //    เปลี่ยนจากสไปรต์เม็ด ๆ เป็น "ริบบิ้นเกลียว" ต่อเนื่องทั้งเส้น 2 สาย (เรขาคณิต helix คงที่
  //    แล้วหมุน rotation.y ไม่หยุด + เลื่อนเทกซ์เจอร์ให้เปลวไหลขึ้นตามเกลียวตลอดเวลา = วนไม่รู้จบจริง)
  auraCoil=[];
  [0,Math.PI].forEach(off=>{ const m=auraCoilRibbon(off); auraGrp.add(m); auraCoil.push({m}); });
  auraCore=new THREE.Mesh(new THREE.CylinderGeometry(.5,.66,1.9,14,1,true),     // เปลวนอกเกือบใส (ข้อ ②)
    new THREE.MeshBasicMaterial({color:0x5548ff,transparent:true,opacity:.04,side:THREE.DoubleSide,
      depthWrite:false,blending:THREE.AdditiveBlending}));   // จูนหลังดูภาพ: .07 เห็นเป็น "กล่องแก้ว" สี่เหลี่ยม (silhouette ทรงกระบอก) — ลดจนแค่เรือง
  auraCore.position.y=.95; auraGrp.add(auraCore);
  const sparkMat=new THREE.MeshBasicMaterial({color:0xcfeaff,transparent:true,opacity:.9,
    depthWrite:false,blending:THREE.AdditiveBlending});
  for(let i=0;i<7;i++){                                     // ประกายลอยขึ้นจากเปลว (ember ฟ้า)
    const sp=new THREE.Mesh(new THREE.SphereGeometry(.05,6,5),sparkMat.clone());
    auraGrp.add(sp); auraSparks.push({m:sp,a:Math.random()*9,rr:.45+Math.random()*.3,sp:.55+Math.random()*.6});
  }
  auraGrp.visible=false; sc.add(auraGrp);
}
/* 💰 ซื้อพลัง 100 เหรียญ = 60 นาที (ซื้อซ้ำได้ = ต่อเวลาเพิ่ม) */
function auraBuy(){
  if(state.coins<AURA_COST){ sfx.wrong(); toast('🪙 เหรียญไม่พอ — พลังโอเวอร์ไดรฟ์ราคา '+fmtNum(AURA_COST)+' เหรียญ'); return; }
  state.coins-=AURA_COST;
  const base=Math.max(Date.now(), state.soccerAuraUntil||0);   // ซื้อตอนยังไม่หมด = ต่อเวลา
  state.soccerAuraUntil=base+AURA_MS;
  saveState(); renderHudTop(); auraRender();
  sfx.levelup(); SoccerAudio.goal();
  showBanner('⚡ <b>โอเวอร์ไดรฟ์!</b> พลังล้อมรอบตัว 60 นาที<br><small>เส้นไกด์สีฟ้ากลับมาแล้ว · กดชาร์จจะมีลำแสงควงสว่านพันรอบ</small>');
}
/* แถบนับถอยหลัง + สถานะปุ่ม */
function auraRender(){
  if(!auraBarEl) return;
  const ms=auraLeftMs();
  if(ms<=0){
    auraBarEl.classList.remove('on');
    if(auraBtnEl){ auraBtnEl.classList.remove('on'); auraBtnEl.innerHTML='⚡ พลัง '+AURA_COST+'🪙'; }
    return;
  }
  auraBarEl.classList.add('on');
  const m=Math.floor(ms/60000), s=Math.floor(ms%60000/1000);
  auraBarEl.querySelector('.ab-fill').style.width=(ms/AURA_MS*100)+'%';
  auraBarEl.querySelector('.ab-txt').textContent=`⚡ โอเวอร์ไดรฟ์ ${m}:${String(s).padStart(2,'0')}`;
  if(auraBtnEl){ auraBtnEl.classList.add('on'); auraBtnEl.innerHTML='⚡ ต่อเวลา '+AURA_COST+'🪙'; }
}
function auraTick(dt,now){
  if(!auraGrp) return;
  const on=auraActive();
  auraGrp.visible=on;
  if(!on) return;
  if(soccerPlayer) auraGrp.position.copy(soccerPlayer.position);   // 🧍 รอบ 852: ออร่าตามตัวนักเตะ (ตัวถอยหลังบอลแล้ว ไม่ใช่จุดบอล)
  else auraGrp.position.set(sBaseX,0,sBaseZ);
  // 🔥 รอบ 941: เปลวก้อนเดียว — sway "ร่วมกันทุกชั้น" ทั้งก้อนจึงเอนไปทางเดียวกันเหมือนไฟจริง
  //    แต่ละชั้นกระเพื่อมต่างเฟสเล็กน้อย = เนื้อไฟขยับภายในก้อน · ยืดสูง=เรียวลง
  const tS=now/1000;
  const swayX=.26*Math.sin(tS*3.4)+.14*Math.sin(tS*7.3+1.7);
  const swayZ=.20*Math.sin(tS*2.9+.8)+.12*Math.sin(tS*6.1);
  auraRings.forEach(fl=>{
    const lick=.86+.17*Math.sin(tS*fl.f1+fl.p1)+.10*Math.sin(tS*fl.f2+fl.p2);
    const h=fl.h*lick;
    fl.m.position.set(swayX*(h/9), h*.5+.05, swayZ*(h/9));   // ชั้นสูงกว่าเอนมากกว่า = ก้อนโค้งลู่ลมทั้งแท่ง
    fl.m.scale.set(fl.w*(1.1-lick*.18), h, 1);
    fl.m.material.opacity=fl.op*(.8+.25*Math.sin(tS*9+fl.p2));
  });
  // 🌀 รอบ 941: ริบบิ้นเกลียวส้ม — หมุนวนไม่รู้จบ + เทกซ์เจอร์ไหลตามเกลียว (เปลวไหลขึ้นตลอดเวลา)
  auraCoil.forEach((cl,i)=>{
    cl.m.rotation.y=tS*4.2;                                  // หมุนต่อเนื่องไม่มีหยุด (สายสองห่างครึ่งรอบใน geometry)
    cl.m.material.map.offset.x=(-tS*1.15)%1;                 // เปลวไหลขึ้นตามแนวเกลียว
    cl.m.material.opacity=.72+.2*Math.sin(tS*7+i*2.1);
    const p=1+.05*Math.sin(tS*5.3+i);                        // สูบ-พองเบา ๆ ให้มีชีวิต
    cl.m.scale.set(p,1,p);
  });
  auraSparks.forEach(s=>{                                    // ember ฟ้า: ลอยขึ้นตามเสาไฟแล้วจางหาย วนใหม่
    const t=(tS*s.sp+s.a)%1, a=s.a+tS*.7;
    s.m.position.set(Math.cos(a)*s.rr*(1-t*.35), .3+t*6.5, Math.sin(a)*s.rr*(1-t*.35));
    s.m.material.opacity=.85*(1-t)*(1-t);
    const sc2=.05*(1-t*.5); s.m.scale.setScalar(Math.max(.3,sc2/.05));
  });
  if(auraCore){ auraCore.rotation.y=now/1600; auraCore.material.opacity=.03+Math.sin(now/420)*.012; }
}
/* 🌀 ลำแสงควงสว่าน: พันรอบเส้นไกด์เดิม หมุนตลอด + มีหัวสว่างวิ่งจากต้นทางไปปลายทาง (ตอนกดชาร์จ) */
function buildDrill(sc){
  const N=GUIDE_N;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*2*3),3));
  geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(N*2*3),3));
  const idx=[]; for(let i=0;i<N-1;i++){ const a=i*2; idx.push(a,a+1,a+2, a+1,a+3,a+2); }
  geo.setIndex(idx);
  drillMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,side:THREE.DoubleSide,
    depthWrite:false,blending:THREE.AdditiveBlending,opacity:.95});
  drillMesh=new THREE.Mesh(geo,drillMat);
  drillMesh.frustumCulled=false; drillMesh.visible=false; drillMesh.renderOrder=4;
  sc.add(drillMesh);
}
function drillTick(dt,now,charging,power){
  if(!drillMesh) return;
  if(!charging || !auraActive() || _gPts.length<4){ drillMesh.visible=false; return; }
  drillPhase+=dt*7.5;                                        // ความเร็วหมุนควง
  const head=((now%900)/900);                                // หัวแสงวิ่งต้น→ปลาย ทุก 0.9 วินาที
  const pos=drillMesh.geometry.attributes.position.array;
  const col=drillMesh.geometry.attributes.color.array;
  const R=.34+ (power/100)*.30;                              // ยิ่งชาร์จแรง เกลียวยิ่งกว้าง
  const TURNS=5.5;
  const up=_dUp, rt=_dRt, tg=_dTg;
  for(let i=0;i<_gPts.length;i++){
    const p=_gPts[i], q=_gPts[Math.min(_gPts.length-1,i+1)], pv=_gPts[Math.max(0,i-1)];
    tg.set(q.x-pv.x,q.y-pv.y,q.z-pv.z);
    if(tg.lengthSq()<1e-6) tg.set(0,0,-1); else tg.normalize();
    rt.set(tg.z,0,-tg.x); if(rt.lengthSq()<1e-6) rt.set(1,0,0); else rt.normalize();
    up.crossVectors(tg,rt).normalize();
    const t=i/(_gPts.length-1);
    const a=t*TURNS*Math.PI*2 + drillPhase;
    const ox=rt.x*Math.cos(a)*R+up.x*Math.sin(a)*R;
    const oy=rt.y*Math.cos(a)*R+up.y*Math.sin(a)*R;
    const oz=rt.z*Math.cos(a)*R+up.z*Math.sin(a)*R;
    const w=.055;                                            // ความหนาริบบิ้นเกลียว
    const o=i*6;
    pos[o  ]=p.x+ox-rt.x*w; pos[o+1]=p.y+oy-rt.y*w; pos[o+2]=p.z+oz-rt.z*w;
    pos[o+3]=p.x+ox+rt.x*w; pos[o+4]=p.y+oy+rt.y*w; pos[o+5]=p.z+oz+rt.z*w;
    let d=t-head; if(d<0) d+=1;                              // ระยะจากหัวแสง (วนรอบ)
    const glow=Math.max(.18, 1-Math.min(1,d*4.2));           // หัวสว่างจ้า หางจาง
    col[o]=col[o+3]=.35*glow+.15;
    col[o+1]=col[o+4]=.85*glow+.25;
    col[o+2]=col[o+5]=glow+.4;
  }
  drillMesh.geometry.attributes.position.needsUpdate=true;
  drillMesh.geometry.attributes.color.needsUpdate=true;
  drillMesh.visible=true;
}
const _dUp=new THREE.Vector3(), _dRt=new THREE.Vector3(), _dTg=new THREE.Vector3();
/* ==== 🔥💨 รอบ 852: ลูกไฟ + ควันหางมิสไซล์ ====
   ชาร์จถึง ≥30% ของหลอด = เปลวไฟล้อมรอบบอล (สไปรต์ไฟเต้นวนรอบ additive)
   เตะออกไป (ถ้าพลัง ≥30%) = ไฟหุ้มบอลลู่ไปข้างหลัง + พ่นก้อนควันทิ้งไว้ตามวิถีแบบจรวด
   ควันแต่ละก้อนพองโต-ลอยขึ้น-จางหาย เหมือนควันจริง (pool วนใช้ซ้ำ ไม่สร้าง object ใหม่ระหว่างเล่น) */
function ballFXTex(fire){
  const cv=document.createElement('canvas'); cv.width=cv.height=64;
  const c=cv.getContext('2d');
  const g=c.createRadialGradient(32,32,2,32,32,30);
  if(fire){ g.addColorStop(0,'rgba(255,255,220,1)'); g.addColorStop(.3,'rgba(255,190,50,1)');   // รอบ 853: สีอิ่ม/ทึบขึ้น สู้แสงกลางวันได้
    g.addColorStop(.65,'rgba(255,95,10,.8)'); g.addColorStop(1,'rgba(255,50,0,0)'); }
  else { g.addColorStop(0,'rgba(235,235,235,.95)'); g.addColorStop(.5,'rgba(190,190,190,.6)');   // รอบ 853: ควันทึบชัดขึ้นมาก
    g.addColorStop(1,'rgba(150,150,150,0)'); }
  c.fillStyle=g; c.fillRect(0,0,64,64);
  return new THREE.CanvasTexture(cv);
}
function buildBallFX(sc){
  const ft=ballFXTex(true), st=ballFXTex(false);
  fireGrp=new THREE.Group(); fireFlames=[];
  for(let i=0;i<14;i++){    // รอบ 853: 8→14 ดวง — พอยืดเป็นหางยาวแล้วต้องมีดวงถี่พอไม่ให้หางขาดเป็นช่วง
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:ft,transparent:true,depthWrite:false,
      blending:THREE.AdditiveBlending,opacity:.9}));
    fireGrp.add(sp); fireFlames.push({m:sp,a:i/14*Math.PI*2,sp:3+Math.random()*3,r:BALL_R*.66,ph:Math.random()*9});
  }
  fireGrp.visible=false; sc.add(fireGrp);
  smokePool=[]; smokeIdx=0;
  for(let i=0;i<SMOKE_MAX;i++){
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:st,transparent:true,depthWrite:false,opacity:0}));
    sp.visible=false; sc.add(sp);
    smokePool.push({m:sp,life:0,max:1,vx:0,vy:0,vz:0,s0:.3});
  }
}
function smokePuff(x,y,z,vx,vy,vz){
  const p=smokePool[smokeIdx++%SMOKE_MAX]; if(!p) return;
  p.max=p.life=SMOKE_LIFE*(.8+Math.random()*.4);
  p.vx=vx; p.vy=vy; p.vz=vz;
  p.s0=.55+Math.random()*.3;   // รอบ 853: ก้อนใหญ่ขึ้น (เดิม .34 เล็กจนแทบมองไม่เห็น)
  p.m.position.set(x+(Math.random()-.5)*.14, Math.max(.12,y+(Math.random()-.5)*.14), z+(Math.random()-.5)*.14);
  p.m.visible=true;
}
function ballFXTick(dt,now){
  if(!fireGrp||!soccerBall) return;
  const b=soccerBall.position;
  // 🎬 ระหว่างรีเพลย์ซ่อนไฟ (บอลถูกฉายย้อน) · 🔥 รอบ 933 (ผู้ใช้): ไฟตอนชาร์จก็ต้องเป็นร่างพลังเท่านั้น
  const on=!repOn && ((sCharging&&!sbLive&&sChg>=FIRE_CHG&&auraActive())||(sbLive&&sbFlame));
  fireGrp.visible=on;
  if(on){
    fireGrp.position.copy(b);
    const sp=Math.hypot(sbVel.x,sbVel.y,sbVel.z);
    let tx=0,ty=.5,tz=0;                                 // ทิศ "หาง" เปลว: บอลนิ่ง=ลู่ขึ้นแบบกองไฟ · บอลพุ่ง=สวนทางความเร็ว
    if(sbLive&&sp>2){ tx=-sbVel.x/sp; ty=-sbVel.y/sp; tz=-sbVel.z/sp; }
    const N=fireFlames.length;
    fireFlames.forEach((f,i)=>{
      const a=f.a+now/1000*f.sp;
      const fl=.75+Math.sin(now/47+f.ph)*.25;            // เปลวเต้นถี่ (flicker)
      // 💨 รอบ 853: เรียงเปลวเป็น "หาง" — ดวงแรกหุ้มบอล ดวงท้ายลากยาวสวนลม (บอลพุ่ง=ยืดถึง ~2.4m · นิ่ง=กองไฟสั้น)
      const tt=i/(N-1);                                  // 0=หัว .. 1=ปลายหาง
      const tail=(sbLive&&sp>2) ? (.3+tt*2.1)*(0.6+Math.min(1,sp/30)*.6) : .25+tt*.7;
      const rr=f.r*(1-tt*.6);                            // ปลายหางวงแคบลง (โดนลมรีดเป็นทรงหยดน้ำ)
      f.m.position.set(Math.cos(a)*rr+tx*tail*fl, Math.sin(a)*rr*.4+ty*tail*fl+Math.sin(now/210+f.ph)*.08, Math.sin(a)*rr+tz*tail*fl);
      const s=BALL_R*(2.7-tt*1.5)*fl;                    // รอบ 853: หัวโตขึ้นอีก (เดิม 1.9 จมหายในแสงแดด)
      f.m.scale.set(s,s,1);
      f.m.material.opacity=(.65+fl*.35)*(1-tt*.45);
    });
  }
  // 💨 พ่นควันทิ้งท้ายระหว่างลูกไฟพุ่ง — จุดเกิดถอยไปท้ายบอลตามทิศวิ่งเหมือนท่อท้ายจรวด
  if(!repOn&&sbLive&&sbFlame&&now-_smokeAt>SMOKE_GAP){
    _smokeAt=now;
    const sp=Math.hypot(sbVel.x,sbVel.y,sbVel.z)||1;
    // รอบ 853: จุดพ่นถอยไปท้ายไกลขึ้น (พ้นหางไฟ) + ควันสืบทอดแรงถอยหลังมากขึ้น = หางลากยาวต่อจากไฟ
    smokePuff(b.x-sbVel.x/sp*BALL_R*2.2, b.y-sbVel.y/sp*BALL_R*2.2, b.z-sbVel.z/sp*BALL_R*2.2,
      -sbVel.x*.09+(Math.random()-.5)*.4, .55+Math.random()*.5, -sbVel.z*.09+(Math.random()-.5)*.4);
  }
  smokePool.forEach(p=>{
    if(p.life<=0) return;
    p.life-=dt;
    if(p.life<=0){ p.m.visible=false; p.m.material.opacity=0; return; }
    const t=1-p.life/p.max;                              // 0 เกิด → 1 สลาย
    p.m.position.x+=p.vx*dt; p.m.position.y+=p.vy*dt; p.m.position.z+=p.vz*dt;
    p.vy+=dt*.25;                                        // ควันร้อนลอยขึ้นเรื่อยๆ
    const s=p.s0*(1+t*3.0);                              // พองโตตามเวลาแบบควันจริง
    p.m.scale.set(s,s,1);
    p.m.material.opacity=.88*(1-t*t);                    // รอบ 853: เกิดมาทึบชัดเลย ค่อยจางช่วงท้าย (เดิม .5 จางไว)
  });
}
/* 🎯 รอบ 402: วงจุดตกลูก — วงแหวนเรืองแสงบนพื้นตรงจุดที่บอลจะตกกระทบครั้งแรก (เต้นเบาๆ) */
function buildLandRing(sc){
  landRing=new THREE.Group();
  const mk=(r0,r1,op)=>new THREE.Mesh(new THREE.RingGeometry(r0,r1,32),
    new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:op,side:THREE.DoubleSide,depthWrite:false}));
  const outer=mk(.52,.62,.95), inner=mk(.16,.22,.7);
  landRing.add(outer); landRing.add(inner);
  landRing.userData={outer,inner};
  landRing.rotation.x=-Math.PI/2; landRing.visible=false; landRing.renderOrder=4;
  sc.add(landRing);
}
function buildGuideRibbon(sc){
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(GUIDE_N*2*3), uv=new Float32Array(GUIDE_N*2*2), idx=[];
  const col=new Float32Array(GUIDE_N*2*3);
  // 💙 รอบ 404 (ผู้ใช้): แสงสีฟ้าไล่ "เข้ม→อ่อน" ตามระยะ — ต้นทางน้ำเงินเข้ม ปลายทางฟ้าอ่อนเกือบขาว
  //    ใช้ vertex color เพราะไล่ตามความยาวริบบิ้น (material.color เดียวทำไม่ได้)
  const near=new THREE.Color(0x0b3fd6), far=new THREE.Color(0xb6ecff), tmp=new THREE.Color();
  for(let i=0;i<GUIDE_N;i++){
    const t=i/(GUIDE_N-1);
    tmp.copy(near).lerp(far, Math.pow(t,0.7));
    const o=i*6;
    col[o]=col[o+3]=tmp.r; col[o+1]=col[o+4]=tmp.g; col[o+2]=col[o+5]=tmp.b;
  }
  for(let i=0;i<GUIDE_N-1;i++){ const a=i*2; idx.push(a,a+1,a+2, a+1,a+3,a+2); }
  geo.setIndex(idx);
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  guideMat=new THREE.MeshBasicMaterial({map:guideTexture(),transparent:true,side:THREE.DoubleSide,
    depthWrite:false,blending:THREE.AdditiveBlending,opacity:.92,vertexColors:true});
  guideRibbon=new THREE.Mesh(geo,guideMat);
  guideRibbon.frustumCulled=false; guideRibbon.visible=false; guideRibbon.renderOrder=3;
  sc.add(guideRibbon);
}
/* 🎱 วาดจุดสัมผัสบนลูกบอลซูม + อธิบายผลเป็นภาษาเด็ก (เตะจุดไหน บอลทำอะไร) */
function renderSpinPad(){
  if(!spinDotEl) return;
  const mx=-sCurl, my=sHit;                            // ตำแหน่งจุดบนลูก (mx: +ขวา · my: +บน)
  spinDotEl.style.left=(50+mx*34)+'%';
  spinDotEl.style.top =(50-my*34)+'%';
  if(spinLblEl){
    const side = sCurl>.12 ? 'โค้งขวา ▶' : sCurl<-.12 ? '◀ โค้งซ้าย' : '';
    const vert = sHit<-.12 ? 'ลอยโด่ง ⤴' : sHit>.12 ? 'พุ่งจิก ⤵' : '';
    spinLblEl.textContent=[side,vert].filter(Boolean).join(' · ') || 'เตะกลางลูก (ตรง)';
  }
}
/* รอบ 403: แพดเปิดค้างตลอด — ฟังก์ชันนี้เหลือไว้ให้ testkit/อนาคตเรียกได้ แต่ UI ไม่มีปุ่มปิดแล้ว */
function spinPadToggle(){
  spinOpen=!spinOpen;
  if(spinPadEl) spinPadEl.style.display=spinOpen?'block':'none';
  if(spinOpen) renderSpinPad();
}
/* ลาก/แตะในวงลูกบอล = เลือกจุดสัมผัส (คลิปในวงกลม รัศมี 1) */
function spinPadPick(clientX,clientY){
  const ball=spinPadEl&&spinPadEl.querySelector('.sp-ball'); if(!ball) return;
  const r=ball.getBoundingClientRect();
  if(!r.width||!r.height) return;      // ⚠️ แพดปิดอยู่ = ขนาด 0 → หารศูนย์ได้ NaN แล้วสปิน/บอลพังทั้งเกม
  let mx=(clientX-(r.left+r.width/2))/(r.width/2*.86);
  let my=-(clientY-(r.top+r.height/2))/(r.height/2*.86);
  const d=Math.hypot(mx,my); if(d>1){ mx/=d; my/=d; }   // อยู่ในลูกบอลเสมอ
  sCurl=Math.max(-1,Math.min(1,-mx));                   // ⚽ ฟิสิกส์จริง: เตะ "ขวา" ของลูก → บอลโค้ง "ซ้าย"
  sHit =Math.max(-1,Math.min(1, my));
  renderSpinPad(); renderCurl();
}
/* 🌀 ป้ายบอกความโค้งที่ตั้งไว้ (ลูกศรยิ่งเยอะ = ยิ่งโค้ง) */
function renderCurl(){
  if(!curlEl) return;
  const n=Math.round(Math.abs(sCurl)*3);
  const txt = n===0 ? '' : (sCurl<0 ? '🌀 '+'◀'.repeat(n)+' โค้งซ้าย' : 'โค้งขวา '+'▶'.repeat(n)+' 🌀');
  if(txt!==_curlShown){
    _curlShown=txt;
    curlEl.textContent=txt;
    curlEl.classList.toggle('on',!!txt);
  }
}
/* มุมยก + สปินตั้งต้นจาก "จุดสัมผัส" (ใช้ร่วมกันทั้งเส้นไกด์และตอนเตะจริง — เส้นไกด์จึงตรงกับของจริงเสมอ) */
function kickLaunch(power){
  // 🚀 รอบ 852: เติมพลังโอเวอร์ไดรฟ์แล้วบอลพุ่งเร็วขึ้น 20% (คูณที่นี่ที่เดียว เส้นไกด์จึงตรงกับของจริงเสมอ)
  const spd=(KICK_SPD_MIN+(Math.max(6,power)/100)*(KICK_SPD_MAX-KICK_SPD_MIN))*(auraActive()?AURA_SPD:1);
  const pit=Math.max(.04,Math.min(1.2, aimPitch - sHit*HIT_LIFT));   // เตะใต้ลูก (sHit<0) = ยกสูงขึ้น
  return { spd, pit,
    wx: Math.sin(pit)*(3+spd*.12) - sHit*HIT_SPIN_X,                 // แบ็คสปิน(ยกลอย) / ท็อปสปิน(จิกลง)
    wy: -sCurl*CURL_SPIN };                                          // ไซด์สปิน = ลูกโค้ง
}
/* 🎀 เส้นไกด์ริบบิ้น — จำลองฟิสิกส์จริงทุกแรงแล้วขึงแถบกว้างตามวิถี (เห็นทั้งความโค้งและความโด่งก่อนเตะ) */
function updateSoccerGuide(ready,dx,dz){
  if(!guideRibbon) return;
  // ⚡ รอบ 412 (ผู้ใช้): ร่างธรรมดา = ไม่มีเส้นไกด์ ต้องกะระยะเอาแบบดั้งเดิม · เส้นฟ้าโผล่เฉพาะตอนแปลงร่าง
  if(!ready || !auraActive()){ guideRibbon.visible=false; if(landRing) landRing.visible=false; return; }
  const power=sCharging?sChg:55;
  const L=kickLaunch(power);
  // 💙 รอบ 404: สีฟ้าไล่ตามระยะทำที่ vertex color แล้ว — พลังชาร์จจึงคุม "ความสว่าง/ทึบ" แทน (ยิ่งแรงยิ่งสว่างจ้า)
  const pw=Math.max(0,Math.min(1,power/100));
  guideMat.color.setScalar(0.72+pw*0.5);
  guideMat.opacity=0.78+pw*0.22;
  landPt=null;
  const ch=Math.cos(L.pit), sh=Math.sin(L.pit);
  let vx=dx*ch*L.spd, vy=sh*L.spd, vz=dz*ch*L.spd;
  let px=sBaseX, py=BALL_R, pz=sBaseZ;
  const h=0.016;   // ⚠️ ต้องเท่ากับ dt จริงของเกม — step ใหญ่กว่านี้ Euler คลาดสะสม (h=.035 เคยเพี้ยนถึง 1.2m)
  const pos=guideRibbon.geometry.attributes.position.array;
  const uv=guideRibbon.geometry.attributes.uv.array;
  _gPts.length=0;
  let prevX=px, prevZ=pz;
  let wx=L.wx, wy=L.wy;                              // สปินจางลงระหว่างทางเหมือนของจริง
  for(let i=0;i<GUIDE_N;i++){
    for(let k=0;k<3;k++){      // 56 จุด × 3 สเต็ป × .016 ≈ 2.7 วินาที (รอบ 928: ยาวพอเห็นถึงประตูที่ไกลขึ้น 2 เท่า)
      // ⚠️ ลอกตรรกะ tickSoccer มาทุกบรรทัด — ไม่งั้นเส้นไกด์หลอกตา (เคยคลาด .8m เพราะไม่ได้จำลองช่วงบอลติดพื้น)
      const air=py>BALL_R+.05;
      if(air){ const sp=Math.hypot(vx,vy,vz), dr=Math.max(0,1-SB_DRAG*sp*h); vx*=dr; vy*=dr; vz*=dr; }
      const mg=SB_MAGNUS*(air?1:.45)*h;
      vx+=(wy*vz)*mg;
      if(air) vy+=(-wx*vz)*mg;
      vz+=(wx*vy)*mg;
      vy-=BALL_G*h;
      px+=vx*h; py+=vy*h; pz+=vz*h;
      if(py<=BALL_R){ py=BALL_R;
        if(!landPt) landPt={x:px,z:pz};                                                          // 🎯 จุดตกกระทบครั้งแรก
        if(vy<-0.6){ vy=-vy*.55; vx*=.88; vz*=.88; vz-=wx*.05; vx+=wy*.04; wx*=.6; wy*=.65; }   // เด้งพื้น
        else { vy=0; vx*=(1-.5*h); vz*=(1-.5*h); wy*=(1-.9*h); }                                 // กลิ้งบนพื้น
      }
    }
    const ddx=px-prevX, ddz=pz-prevZ, dl=Math.hypot(ddx,ddz)||1;
    const nx=-ddz/dl, nz=ddx/dl;                        // เวกเตอร์ตั้งฉากในระนาบพื้น = ความกว้างริบบิ้น
    const w=GUIDE_W*(1-i/GUIDE_N*.55)/2;                // เรียวลงปลายทาง (ฟีลพุ่ง)
    const o=i*6, u=i*4, yy=Math.max(BALL_R*.6,py);
    pos[o  ]=px+nx*w; pos[o+1]=yy; pos[o+2]=pz+nz*w;
    pos[o+3]=px-nx*w; pos[o+4]=yy; pos[o+5]=pz-nz*w;
    const t=i/(GUIDE_N-1);
    uv[u]=t; uv[u+1]=0; uv[u+2]=t; uv[u+3]=1;
    _gPts.push({x:px,y:py,z:pz});
    prevX=px; prevZ=pz;
  }
  guideRibbon.geometry.attributes.position.needsUpdate=true;
  guideRibbon.geometry.attributes.uv.needsUpdate=true;
  guideRibbon.visible=true;
  // 🎯 วงจุดตก — สีเดียวกับริบบิ้น เต้นเบาๆ ให้สังเกตง่าย
  if(landRing){
    if(landPt){
      landRing.visible=true;
      landRing.position.set(landPt.x,.06,landPt.z);
      const s=1+Math.sin(performance.now()/220)*.07;
      landRing.scale.setScalar(s);
      const ud=landRing.userData;                    // 💙 วงจุดตกใช้โทนฟ้าปลายริบบิ้น (จุดตก=ปลายทาง)
      ud.outer.material.color.setRGB(0.62,0.90,1);
      ud.inner.material.color.setRGB(0.62,0.90,1);
    } else landRing.visible=false;
  }
}
function soccerCamera(dt,dx,dz){
  const b=soccerBall.position;
  const k=Math.min(1,dt*4);
  if(soccerCam1){
    camera.position.set(sBaseX-dx*.35,1.55,sBaseZ-dz*.35);
    camera.lookAt(sBaseX+dx*12,1.55+Math.sin(aimPitch)*7,sBaseZ+dz*12);
    return;
  }
  // 📷 รอบ 939 (ผู้ใช้): กล้องหลังนักเตะต่ำลง+ใกล้ขึ้น (ยืนเล็ง 8m/สูง 4.8 → 5.2m/สูง 3.1) · ตอนบอลพุ่งคงเดิม
  const foc = sbLive? b : {x:sBaseX,y:1.1,z:sBaseZ-1.5};
  const camD = sbLive?8:5.2, camH = sbLive?3.4:1.7;
  const cx=foc.x - dx*camD, cz=foc.z - dz*camD, cy=(sbLive?b.y:1.4)+camH;
  camera.position.x+=(cx-camera.position.x)*k;
  camera.position.y+=(cy-camera.position.y)*k;
  camera.position.z+=(cz-camera.position.z)*k;
  // 💥 รอบ 401: ซัดแรง = กล้องกระตุกถอยหลังแล้วเด้งกลับ (ฟีลกระแทกเต็มข้อ)
  if(sKickPunch>0.01){
    camera.position.x+=dx*sKickPunch*.9; camera.position.z+=dz*sKickPunch*.9;
    camera.position.y+=Math.sin(performance.now()/22)*sKickPunch*.16;
    sKickPunch*=Math.max(0,1-dt*5.5);
  }
  camera.lookAt(foc.x, foc.y+0.6, foc.z);
}
function tickSoccer(dt,now){
  if(repOn){ repTick(dt,now); ballFXTick(dt,now); return; }        // 🎬 รอบ 397: กำลังฉายรีเพลย์ — คุมบอล+กล้องเอง (ควันที่ค้างยังจางต่อ)
  if(repPendAt&&now>=repPendAt){ repPendAt=0; repTrace=repPendTrace||repTrace; repStart(); if(repOn) return; }
  soccerGKEnsure(); soccerGKTick(dt,now); pkTick(now);             // 🧤🎯 น้อง GK + นาฬิกาจุดโทษ
  if(guideMat&&guideMat.map) guideMat.map.offset.x=(guideMat.map.offset.x-dt*.55)%1;   // 🎀 ลายริบบิ้นวิ่งไหลไปทางประตู
  // เล็ง (คีย์บอร์ด + 🕹️ สติ๊กอนาล็อกมือซ้ายแบบ PES) — ปรับได้ตลอด แม้กำลังชาร์จ
  if(keys.KeyA||keys.ArrowLeft) aimYaw-=AIM_YAW_SP*dt;
  if(keys.KeyD||keys.ArrowRight) aimYaw+=AIM_YAW_SP*dt;
  if(keys.KeyW||keys.ArrowUp) aimPitch+=AIM_PITCH_SP*dt;
  if(keys.KeyS||keys.ArrowDown) aimPitch-=AIM_PITCH_SP*dt;
  if(joy.on){                                    // ดันเบา=ขยับช้า (เล็งละเอียด) · ดันสุด=หมุนไว · ปล่อยนิ้ว=ค้างมุมเดิม
    aimYaw  +=joy.dx*AIM_YAW_SP*AIM_STICK*dt;
    aimPitch-=joy.dy*AIM_PITCH_SP*AIM_STICK*dt;  // ดันขึ้น (dy ติดลบ) = เงยสูง
  }
  if(!sbLive){                                   // 🌀 รอบ 400: ตั้งลูกโค้งด้วยคีย์ Q/E (คอม · มือถือใช้ปัดปุ่มเตะ)
    if(keys.KeyQ){ sCurl=Math.max(-1,sCurl-CURL_KEY_SP*dt); renderCurl(); }
    if(keys.KeyE){ sCurl=Math.min( 1,sCurl+CURL_KEY_SP*dt); renderCurl(); }
  }
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
    /* 🧍 รอบ 852: หันลำตัวตามมุมเล็งจริง — โมเดลหันหน้าไปทาง -Z จึงต้องหมุน -aimYaw
       (เดิมใส่ +aimYaw = เล็งซ้ายตัวหันขวา สวนทางกัน) · หมุนแบบ smooth ไม่วืดทันที
       + ยืนถอยหลังบอลเยื้องซ้ายนิด ให้ "ขาขวา" (ขาเตะ) อยู่แนวบอลแบบนักเตะจริง */
    const ry=soccerPlayer.rotation.y;
    soccerPlayer.rotation.y=ry+(-aimYaw-ry)*Math.min(1,dt*9);
    soccerPlayer.position.set(sBaseX-dx*.55+dz*.13, 0, sBaseZ-dz*.55-dx*.13);
    const leanT=(sCharging&&ready)?.05+sChg/100*.10:0;               // ชาร์จ = เอนตัวไปหลังง้างเตะตามพลัง
    soccerPlayer.rotation.x+=(leanT-soccerPlayer.rotation.x)*Math.min(1,dt*7);
    const legs=soccerPlayer.userData.legs;
    if(legs){
      if(sLegSwing>0){ sLegSwing=Math.max(0,sLegSwing-dt*4);
        legs[1].rotation.x=-Math.sin((1-sLegSwing)*Math.PI)*1.25;    // เหวี่ยงขาไปหน้าตอนเตะ (ของเดิม)
      }
      else if(sCharging&&ready) legs[1].rotation.x+=((.25+sChg/100*.6)-legs[1].rotation.x)*Math.min(1,dt*8);   // ง้างขาไปหลังตามพลังชาร์จ
      else legs[1].rotation.x*=Math.max(0,1-dt*6);                   // คืนท่ายืนปกติ
    }
  }
  updateSoccerGuide(ready,dx,dz);
  auraTick(dt,now);                                  // ⚡ รอบ 412: ออร่ารอบตัว (โชว์เฉพาะตอนแปลงร่าง)
  drillTick(dt,now,sCharging&&ready,sChg);           // 🌀 ลำแสงควงสว่านตอนกดชาร์จ
  ballFXTick(dt,now);                                // 🔥💨 รอบ 852: เปลวไฟล้อมบอล + ควันหางมิสไซล์
  if(auraBarEl && now-_auraHudAt>500){ _auraHudAt=now; auraRender(); }   // อัปเดตนาฬิกาถอยหลังทุกครึ่งวินาที

  if(sbLive){
    const b=soccerBall.position;
    // 🎨 รอบ 396 ฟิสิกส์จริง: after-touch แบบ PES — A/D ระหว่างบอลลอย (1.2 วิแรก) = จับบอลโค้งกลางอากาศ
    fkHitTest(now);                               // 🧱 รอบ 402: บอลชนกำแพงฟรีคิก
    const airborne=b.y>BALL_R+.05;
    if(airborne){                                 // 🌀 รอบ 400: จับบอลโค้งได้ "ตลอดที่ลอยอยู่" (เดิมตัดที่ 1.2 วิ — สั้นจนแทบไม่ทัน)
      if(keys.KeyA||keys.ArrowLeft) sbSpin.y=Math.min(SB_SPIN_MAX,sbSpin.y+SB_TOUCH*dt);
      if(keys.KeyD||keys.ArrowRight) sbSpin.y=Math.max(-SB_SPIN_MAX,sbSpin.y-SB_TOUCH*dt);
      if(joy.on&&Math.abs(joy.dx)>.15)            // 🕹️ ดันสติ๊กระหว่างบอลลอย = จับบอลโค้งเพิ่ม (after-touch แบบ PES)
        sbSpin.y=Math.max(-SB_SPIN_MAX,Math.min(SB_SPIN_MAX,sbSpin.y-joy.dx*SB_TOUCH*dt));
    }
    {
      const sp=Math.hypot(sbVel.x,sbVel.y,sbVel.z);
      if(airborne){ const dr=Math.max(0,1-SB_DRAG*sp*dt); sbVel.x*=dr; sbVel.y*=dr; sbVel.z*=dr; }  // แรงต้านอากาศ ∝ ความเร็ว²
      // 🌀 รอบ 400: ลูกเรียดกลิ้งพื้นก็ต้องโค้ง (ลูกปั่นกินหญ้า) — เดิมคิด Magnus เฉพาะตอนลอย ยิงเรียดจึงตรงเป๊ะเสมอ
      const mg=SB_MAGNUS*(airborne?1:.45)*dt;
      // ⚠️ รอบ 400: ω×v เต็มสูตรทำให้แรงตั้งฉากกับความเร็วเสมอ → สปินสูง = บอล "วนเป็นวงกลม" กลับทิศ
      //    (วัดจริง: โค้ง 0.8 ได้ -0.55m คือเลี้ยวกลับ) เด็กเล็งไม่ถูก · ตัดพจน์ที่ไซด์สปินไปดึงแกนลึกทิ้ง
      //    เหลือแรงด้านข้างล้วน = โค้งสม่ำเสมอ คาดเดาได้ และเส้นประตรงกับของจริง
      sbVel.x+=(sbSpin.y*sbVel.z-sbSpin.z*sbVel.y)*mg;                       // แรงด้านข้าง (ลูกโค้ง)
      if(airborne) sbVel.y+=(sbSpin.z*sbVel.x-sbSpin.x*sbVel.z)*mg;          // แรงยกจากแบ็คสปิน (เฉพาะตอนลอย)
      sbVel.z+=(sbSpin.x*sbVel.y)*mg;                                        // เฉพาะผลจากแบ็คสปิน
    }
    sbVel.y-=BALL_G*dt;
    const pX=b.x, pY=b.y, pZ=b.z;                                 // ⚽ รอบ 405: ตำแหน่งก่อนขยับ — ใช้หาจุดตัดเส้นประตู
    b.x+=sbVel.x*dt; b.y+=sbVel.y*dt; b.z+=sbVel.z*dt;
    if(repTrace.length<400) repTrace.push({x:b.x,y:b.y,z:b.z});    // 🎬 บันทึกวิถีไว้ฉายรีเพลย์
    // เสา 2 ต้น + คาน: ชนแล้วสะท้อนจริง + เสียง "ปิ๊ง" (ทรงกระบอกชนทรงกลม)
    const postHit=(nx,ny,nz,dist,rr)=>{                                      // สะท้อน v รอบ normal แล้วดันบอลออก
      const dot=sbVel.x*nx+sbVel.y*ny+sbVel.z*nz;
      if(dot<0){ sbVel.x-=2*dot*nx; sbVel.y-=2*dot*ny; sbVel.z-=2*dot*nz;
        sbVel.x*=.62; sbVel.y*=.62; sbVel.z*=.62;
        b.x+=nx*(rr-dist+.01); b.y+=ny*(rr-dist+.01); b.z+=nz*(rr-dist+.01);
        SoccerAudio.post(); }
    };
    const RR=BALL_R+SPOST_R;
    if(b.y<GOAL_H+.6){ [-GOAL_HW,GOAL_HW].forEach(px=>{                      // เสาตั้ง (เช็กระยะในระนาบ xz)
      const ddx=b.x-px, ddz=b.z-GOAL_Z, d2=Math.hypot(ddx,ddz);
      if(d2<RR && b.y<GOAL_H) postHit(ddx/d2,0,ddz/d2,d2,RR);
    }); }
    if(Math.abs(b.x)<GOAL_HW+.4){                                            // คานนอน (เช็กระยะในระนาบ yz)
      const ddy=b.y-GOAL_H, ddz=b.z-GOAL_Z, d2=Math.hypot(ddy,ddz);
      if(d2<RR) postHit(0,ddy/d2,ddz/d2,d2,RR);
    }
    /* ⚽🐛 รอบ 405 (ผู้ใช้ส่งภาพ: ลูกข้ามคานแต่ขึ้น "เข้าประตู"): ตัดสินประตู "ตอนผ่านเส้นประตู" เท่านั้น
       เดิมเช็กว่าบอลอยู่ในกล่องประตูไหม "ทุกเฟรม" → ลูกที่ลอยข้ามคานไปตกหลังประตู พอ y ต่ำกว่าคานก็ถูกนับ
       ใหม่: จับจังหวะ z ตัดผ่าน GOAL_Z แล้ว interpolate หาตำแหน่ง x,y ณ จุดตัดจริง แล้วตัดสินครั้งเดียว */
    if(!sbGoaled && pZ>GOAL_Z && b.z<=GOAL_Z && sbVel.z<0){
      const t=(pZ-GOAL_Z)/((pZ-b.z)||1);
      const cx=pX+(b.x-pX)*t, cy=pY+(b.y-pY)*t;
      sbGoaled=true;                                              // ตัดสินแล้ว ไม่ตัดสินซ้ำ (เข้าก็จบ ไม่เข้าก็จบ)
      if(Math.abs(cx)<GOAL_HW && cy<GOAL_H && cy>0){
        sbInGoal=true;
        if(pkOn){ pkGoals++; SoccerAudio.goal(); sfx.coin(); showBanner(`⚽ <b>เข้า!</b> ${pkGoals} ประตูแล้ว`); }
        else soccerCheer();
        if(repQualify(cx,cy)){ repPendAt=now+750; repPendTrace=repTrace.slice(); }   // 🎬 ยิงมุมสวย → ฉายรีเพลย์
      }else{
        const overBar=cy>=GOAL_H, wide=Math.abs(cx)>=GOAL_HW;      // บอกให้รู้ว่าพลาดยังไง จะได้ปรับเป็น
        showBanner(overBar&&wide ? '😅 <b>ข้ามคานและออกข้าง</b> — ลดพลังกับเล็งเข้ากรอบอีกนิด'
                 : overBar ? '😮 <b>ข้ามคานไป!</b> ลองเตะ<b>บนลูก</b> (พุ่งจิก) หรือลดพลังลง'
                 : '😯 <b>ออกข้างเสา!</b> เล็งเข้ากรอบอีกนิดนะ');
      }
    }
    // ตาข่ายอุ้มบอล: เข้าประตูแล้วหน่วงแรง + ผนังหลัง/ข้างกันทะลุ + ตาข่ายกระเพื่อม (เฉพาะลูกที่เข้าจริง)
    if(sbInGoal && b.z<GOAL_Z && Math.abs(b.x)<GOAL_HW && b.y<GOAL_H){
      if(!sbInNet){ sbInNet=true; sbNetRipple=1; SoccerAudio.net(); }
      const damp=Math.max(0,1-6*dt); sbVel.x*=damp; sbVel.z*=damp;
      if(b.z<GOAL_Z-1.9){ b.z=GOAL_Z-1.9; sbVel.z=Math.abs(sbVel.z)*.2; sbNetRipple=1; }
      if(Math.abs(b.x)>GOAL_HW-.3) b.x=Math.sign(b.x)*(GOAL_HW-.3);
    } else sbInNet=false;
    if(b.y<=BALL_R){ b.y=BALL_R;
      if(sbVel.y<-0.6){
        SoccerAudio.bounce(-sbVel.y);
        sbVel.y=-sbVel.y*.55; sbVel.x*=.88; sbVel.z*=.88;                    // เด้งพื้น (สูญเสียแรงบ้าง)
        sbVel.z-=sbSpin.x*.05; sbVel.x+=sbSpin.y*.04;                        // สปินกัดพื้นตอนเด้ง (แบ็คสปินหน่วง/ไซด์สปินไถล)
        sbSpin.x*=.6; sbSpin.y*=.65;
      }
      else { sbVel.y=0; sbVel.x*=(1-.5*dt); sbVel.z*=(1-.5*dt); sbSpin.y*=(1-.9*dt); }  // กลิ้งบนพื้น (รอบ 397 friction .5 · รอบ 400 สปินจางช้าลง 2.2→.9 ลูกปั่นโค้งบนหญ้าได้)
    }
    for(let i=0;i<letters.length && !pkOn;i++){                        // 🎯 โหมดจุดโทษซ่อนป้าย — ข้ามชนป้าย
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
          soccerNextTile(l);                                           // 🎯 รอบ 404: เก็บได้แล้ว → ตัวถัดไปโผล่จุดใหม่ในกรอบประตู
        } else { sfx.select(); soccerNextTile(l); }                    // ตัวไม่ต้องการ = ย้ายที่ให้ตัวใหม่เหมือนกัน
      }
    }
    const spd=Math.hypot(sbVel.x,sbVel.y,sbVel.z);
    const oob=Math.abs(b.x)>60||b.z<GOAL_Z-7||b.z>Math.max(PLAYER_Z,sBaseZ)+9||b.y>28;   // 🎲 รอบ 928: สนามกว้าง ±44 เผื่อขอบเป็น ±60 · จุดยืนสุ่มไปได้ถึง z≈20
    if((b.y<=BALL_R+.02 && spd<1.1) || oob || now-sbKickAt>6500){
      if(!sbRestAt) sbRestAt=now;
      if(now-sbRestAt>350 || oob) soccerResetBall();
    } else sbRestAt=0;
    // (เพดานเวลาบินอยู่ในเงื่อนไขบน: now-sbKickAt — รอบ 928 ขยาย 4500→6500ms ลูกไกล 58m เด้ง/กลิ้งเข้าประตูใช้เวลานานขึ้น)
  }
  // 🎨 รอบ 396: บอลหมุนตามความเร็วจริง + เงาบอลตามความสูง + ตาข่ายกระเพื่อมหลังโดนบอล
  {
    const b=soccerBall.position, hs=Math.hypot(sbVel.x,sbVel.z);
    if(hs>.1){
      const ax=sbVel.z/hs, az=-sbVel.x/hs;                       // แกนหมุนกลิ้ง = ตั้งฉากกับทิศวิ่ง (ในระนาบพื้น)
      soccerBall.rotateOnWorldAxis(_sbAxis.set(ax,0,az).normalize(), hs*dt/BALL_R);
    }
    if(Math.abs(sbSpin.y)>.2) soccerBall.rotateOnWorldAxis(_sbAxis.set(0,1,0), sbSpin.y*dt);
    if(sbShadow){
      sbShadow.position.set(b.x,.045,b.z);
      const k=1/(1+b.y*.22);
      sbShadow.scale.setScalar(Math.max(.35,k));
      sbShadow.material.opacity=.34*Math.max(.25,k);
    }
    if(sbNetRipple>0){
      sbNetRipple=Math.max(0,sbNetRipple-dt*1.8);
      soccerNets.forEach((m,i)=>{ m.rotation.x=(m.userData.bx||0)+Math.sin(now/38+i*1.7)*.05*sbNetRipple; });
    }
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
/* 👕 รอบ 939: รูปทรงเสื้อ/กางเกงบน canvas (ใช้ทั้งสวอตช์เล็ก + พรีวิวใหญ่ — ที่เดียวเปลี่ยนทุกที่ตาม) */
function ssShirtPath(c,w,h){
  const px=x=>x/44*w, py=y=>y/40*h;
  c.beginPath();
  c.moveTo(px(14),py(3)); c.lineTo(px(18),py(1)); c.quadraticCurveTo(px(22),py(6),px(26),py(1));
  c.lineTo(px(30),py(3)); c.lineTo(px(42),py(9)); c.lineTo(px(38),py(17)); c.lineTo(px(31),py(14));
  c.lineTo(px(31),py(39)); c.lineTo(px(13),py(39)); c.lineTo(px(13),py(14)); c.lineTo(px(6),py(17));
  c.lineTo(px(2),py(9)); c.closePath();
}
function ssShortsPath(c,w,h){
  const px=x=>x/44*w, py=y=>y/40*h;
  c.beginPath(); c.moveTo(px(8),py(6)); c.lineTo(px(36),py(6)); c.lineTo(px(40),py(34));
  c.lineTo(px(25),py(34)); c.lineTo(px(22),py(21)); c.lineTo(px(19),py(34)); c.lineTo(px(4),py(34)); c.closePath();
}
function ssPaintSwatchShirt(cv,col,pat){
  const c=cv.getContext('2d'), w=cv.width, h=cv.height; c.clearRect(0,0,w,h);
  c.save(); ssShirtPath(c,w,h); c.clip(); ssPaintPattern(c,w,h,col,pat||'plain'); c.restore();
  ssShirtPath(c,w,h); c.lineWidth=Math.max(1.5,w*.05); c.strokeStyle='rgba(255,255,255,.8)'; c.stroke();
}
function ssPaintSwatchShorts(cv,col){
  const c=cv.getContext('2d'), w=cv.width, h=cv.height; c.clearRect(0,0,w,h);
  c.save(); ssShortsPath(c,w,h); c.clip(); c.fillStyle=ssCss(col); c.fillRect(0,0,w,h);
  c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(0,h*.15,w,h*.06); c.restore();   // ขอบเอวจาง
  ssShortsPath(c,w,h); c.lineWidth=Math.max(1.5,w*.05); c.strokeStyle='rgba(255,255,255,.8)'; c.stroke();
}
/* พรีวิวใหญ่: เสื้อลาย+โลโก้ VOCAB WORLD + กางเกง+เบอร์ที่ขา — เห็นชุดจริงก่อนลงสนาม */
function ssPreviewDraw(cv){
  const c=cv.getContext('2d'), W=cv.width, H=cv.height; c.clearRect(0,0,W,H);
  const glow=c.createRadialGradient(W/2,H*.4,20,W/2,H*.4,W*.75);       // แสงสปอตไลต์หลังชุด
  glow.addColorStop(0,'rgba(255,224,138,.28)'); glow.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=glow; c.fillRect(0,0,W,H);
  c.save(); c.translate(W*.033,H*.02);                                  // 👕 เสื้อ
  const sw=W*.934, sh=H*.55;
  c.save(); ssShirtPath(c,sw,sh); c.clip(); ssPaintPattern(c,sw,sh,sKitShirt,sKitPat);
  const lum=((sKitShirt>>16)&255)*.299+((sKitShirt>>8)&255)*.587+(sKitShirt&255)*.114;
  const ink=lum>150?'#1d2440':'#ffffff', edge=lum>150?'rgba(255,255,255,.6)':'rgba(0,0,0,.45)';
  c.textAlign='center'; c.font='900 '+(sw*.1)+'px Arial'; c.lineWidth=sw*.016; c.strokeStyle=edge; c.fillStyle=ink;
  c.strokeText('VOCAB',sw/2,sh*.5); c.fillText('VOCAB',sw/2,sh*.5);      // .14 ล้นขอบอกเสื้อ (โดน clip เหลือ OCAI)
  c.strokeText('WORLD',sw/2,sh*.66); c.fillText('WORLD',sw/2,sh*.66);
  c.restore();
  ssShirtPath(c,sw,sh); c.lineWidth=3; c.strokeStyle='rgba(255,255,255,.85)'; c.stroke();
  c.restore();
  c.save(); c.translate(W*.18,H*.58);                                   // 🩳 กางเกง
  const qw=W*.64, qh=H*.34;
  c.save(); ssShortsPath(c,qw,qh); c.clip(); c.fillStyle=ssCss(sKitShort); c.fillRect(0,0,qw,qh);
  c.fillStyle='rgba(255,255,255,.22)'; c.fillRect(0,qh*.15,qw,qh*.05);
  const slum=((sKitShort>>16)&255)*.299+((sKitShort>>8)&255)*.587+(sKitShort&255)*.114;
  c.textAlign='center'; c.font='900 '+(qh*.34)+'px Arial';
  c.lineWidth=qh*.05; c.strokeStyle=slum>150?'rgba(255,255,255,.7)':'rgba(0,0,0,.5)';
  c.fillStyle=slum>150?'#1d2440':'#fff';
  c.strokeText(sKitNo,qw*.72,qh*.62); c.fillText(sKitNo,qw*.72,qh*.62); // เบอร์ที่ขากางเกงแบบชุดจริง
  c.restore();
  ssShortsPath(c,qw,qh); c.lineWidth=3; c.strokeStyle='rgba(255,255,255,.85)'; c.stroke();
  c.restore();
}
function soccerKitShow(){
  if(!soccerStartEl) return;
  running=false;
  sKitShirt=state.soccerShirt||SOCCER_SHIRTS[0].c;
  sKitNo=String(state.soccerNo||'10');
  sKitShort=state.soccerShort==null?SOCCER_SHORTS[0].c:state.soccerShort;
  sKitPat=state.soccerPat||'plain';
  const prev=soccerStartEl.querySelector('#ss-prev');
  const gS=soccerStartEl.querySelector('#ss-shirts'), gQ=soccerStartEl.querySelector('#ss-shorts'), gP=soccerStartEl.querySelector('#ss-pats');
  const repaintPats=()=>gP.querySelectorAll('.ss-shirt').forEach(b=>ssPaintSwatchShirt(b.firstChild,sKitShirt,b.dataset.k));
  const paint=()=>{ ssPreviewDraw(prev);
    soccerStartEl.querySelector('#ss-patname').textContent='✨ '+((SOCCER_PATTERNS.find(p=>p.k===sKitPat)||{}).n||'');
    repaintPats(); };
  soccerStartEl._ssPaint=paint;                                  // ให้ปุ่ม +/- เบอร์ (handler static) เรียกวาดซ้ำได้
  gS.innerHTML=SOCCER_SHIRTS.map(s=>`<button class="ss-shirt${s.c===sKitShirt?' sel':''}" data-c="${s.c}" title="${s.n}"><canvas width="44" height="40"></canvas></button>`).join('');
  gS.querySelectorAll('.ss-shirt').forEach(b=>{ ssPaintSwatchShirt(b.firstChild,+b.dataset.c,'plain');
    b.addEventListener('click',()=>{ sKitShirt=+b.dataset.c; sfx.select();
      gS.querySelectorAll('.ss-shirt').forEach(x=>x.classList.toggle('sel',x===b)); paint(); }); });
  gQ.innerHTML=SOCCER_SHORTS.map(s=>`<button class="ss-shirt${s.c===sKitShort?' sel':''}" data-c="${s.c}" title="${s.n}"><canvas width="44" height="40"></canvas></button>`).join('');
  gQ.querySelectorAll('.ss-shirt').forEach(b=>{ ssPaintSwatchShorts(b.firstChild,+b.dataset.c);
    b.addEventListener('click',()=>{ sKitShort=+b.dataset.c; sfx.select();
      gQ.querySelectorAll('.ss-shirt').forEach(x=>x.classList.toggle('sel',x===b)); paint(); }); });
  gP.innerHTML=SOCCER_PATTERNS.map(p=>`<button class="ss-shirt${p.k===sKitPat?' sel':''}" data-k="${p.k}" title="${p.n}"><canvas width="44" height="40"></canvas></button>`).join('');
  gP.querySelectorAll('.ss-shirt').forEach(b=>{ b.addEventListener('click',()=>{ sKitPat=b.dataset.k; sfx.select();
      gP.querySelectorAll('.ss-shirt').forEach(x=>x.classList.toggle('sel',x===b)); paint(); }); });
  soccerStartEl.querySelector('#ss-no').textContent=sKitNo;
  paint();
  soccerStartEl.classList.add('on');
}
function soccerKitGo(){
  state.soccerShirt=sKitShirt; state.soccerNo=sKitNo; state.soccerShort=sKitShort; state.soccerPat=sKitPat; saveState();
  soccerStartEl.classList.remove('on');
  if(soccerPlayer && scene) scene.remove(soccerPlayer);
  soccerPlayer=makeSoccerPlayer(sKitShirt,sKitNo,sKitShort,sKitPat);
  soccerPlayer.position.set(sBaseX,0,sBaseZ); scene.add(soccerPlayer);
  SoccerAudio.amb();                                   // 🔊 รอบ 396: ฮัมฝูงชน (เริ่มหลัง gesture กดปุ่มลงสนาม)
  soccerGKEnsure();                                    // 🧤 รอบ 397: น้องตัว active มายืนเฝ้าประตู
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
  if(netUp()) sendPos(true);
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
  else if(M.hotel){                                // 🏨 โรงแรมผีสิง: เดินหลายชั้น + ระบบไฟดับ/ไฟฉาย
    tickHotelPlayer(dt,now);
    tickHotelWorld(dt,now);
    tickGhosts(dt,now);
  }
  else{
    tickPlayer(dt,now);
    if(M.ghost){ tickGhosts(dt,now); }
    else{
      tickMonsters(dt,now);
      tickShots(dt);
      if(now-lastSpawn>M.monSpawnMs){ lastSpawn=now; spawnMonster(); }
    }
  }
  if(now-lastEnsure>5000 && !M.soccer){ lastEnsure=now; ensureCoverage(); ensureDriveAmbience(); }
  tickLetterRespawns(now);
  tickPeers(dt,now);
  sendPos(false);
  drawMinimap();
  renderer.render(scene,camera);
  if(M.heli&&hPhase==='pilot') drawBellyCam();   // 📹 กล้องใต้ท้อง — เฉพาะตอนขับเอง (เฟสเดิน/นั่ง/วิงสูทไม่มี)
  if(M.drive&&!carStartOpen) drawCarMirrors();   // 🪞 รอบ 810: กระจกมองหลัง/ข้าง — เฉพาะตอนออกรถแล้วจริงๆ (ยังไม่ออกรถ = ไม่ต้องเรนเดอร์ซ้ำเปล่าๆ)
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
  letterRespawns=[];                                // 🔠⏱️ รอบ 847: ออกโลก/เปลี่ยนด่าน = ล้างคิวรอเกิดใหม่ (กันตัวอักษรโลกเก่าโผล่ในโลกใหม่)
  /* 🧟 รอบ 689: ผีโรงแรมเป็น Group ของโมเดล 3D (ไม่มี .material ของตัวเอง) — โลกอื่นยังเป็น Sprite
     geometry ใช้ร่วมกับต้นฉบับที่ cache ไว้ ห้าม dispose (เดี๋ยวตัวถัดไปโหลดมาแล้วจอขาว) ทิ้งเฉพาะ material ที่ clone */
  monsters.forEach(m=>{
    scene.remove(m.spr);
    if(m.spr.material) m.spr.material.dispose();
    if(m.mats) m.mats.forEach(mt=>mt.dispose());
  });
  monsters=[];
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
const INTRO=window.ADV3D_INTRO;   // ❓ data ย้ายไป js/adv3d_intro.js (ผ่าไฟล์เฟส 2 รอบ 545)
/* 🚁🌳 รอบ 816: การ์ดวิธีเล่นบางใบเป็น "แผนที่ย่อย" ไม่ใช่ชื่อโหมดจริง → แม็ปกลับไปโหมดที่ยืม label/emoji/reward มาใช้ */
const INTRO_MODE={helikpp:'heli'};
const introKey=()=>heliKpp()?'helikpp':mode;
function showIntro(md,reopen){
  if(!introEl) return;
  running=false;                                   // พักเกมระหว่างอ่าน (loop จะหยุดเฟรมถัดไป)
  const m=MODES[md]||MODES[INTRO_MODE[md]]||MODES.adv, info=INTRO[md]||INTRO.adv;
  const rows=IS_TOUCH?info.touch:info.keys;
  introEl.innerHTML=`
    <div class="adv-intro-card">
      <div class="adv-intro-emoji">${m.emoji}</div>
      <h2>วิธีเล่น${info.title||m.label}</h2>
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
/* 🚁🌳 รอบ 816: ป้ายเปิดฉาก — เมืองกำแพงเพชรของเฮลิฯ มีกติกาคนละแบบกับเมืองเฮลิฯ (ดาดฟ้า vs พื้นที่สีเขียว) */
const HELI_KPP_BANNER='🚁🌳 <b>บินเหนือเมืองกำแพงเพชร!</b><br><small>ตัวอักษรวางอยู่บน<b>พื้นที่สีเขียวข้างถนน</b> — ต้อง<b>ร่อนลงจอดบนหญ้า</b>ให้เครื่องจอดสนิทจึงเก็บได้<br>🎯 วงเป้าบนจอชี้จุดที่ต้องไป (ใกล้แล้วเป็นสีเขียว) · 🏆 ลงนุ่มๆ ได้เหรียญโบนัส<br>⚠️ บินให้สูงกว่ายอดตึกไว้ก่อน แล้วค่อยหย่อนลงตรงลานหญ้า</small>';
const modeIntro=()=>heliKpp()?HELI_KPP_BANNER:M.intro;
function closeIntro(md){
  markIntroSeen(md);
  introEl.classList.remove('on');
  beginPlay();
  showBanner(modeIntro());
}
function beginPlay(){ clock.getDelta(); running=true; loop(); }   // เริ่ม/เล่นต่อ — ทิ้ง dt ที่ค้างช่วงพัก

function start(md,opt){
  mode=(md==='haunt'||md==='heli'||md==='drone'||md==='drive'||md==='soccer'||md==='mecha')?md:'adv';
  M=MODES[mode];
  // 🚁🌳 รอบ 816: แผนที่ย่อยของโหมดเฮลิฯ — 'kpp' = ยืมฉากเมืองกำแพงเพชรของโลกขับรถ (ต้องมี KPP_CITY โหลดแล้ว)
  heliMap=(mode==='heli' && opt && opt.map==='kpp' && window.KPP_CITY)?'kpp':'city';
  if(mode==='adv' && !state.advTicket){ toast('🎫 ต้องมีตั๋วโลกผจญภัยก่อนนะ'); return; }
  if(mode==='haunt' && !state.hauntTicket){ toast('🏨 ต้องมีตั๋วโรงแรมผีสิงก่อนนะ'); return; }
  // 🗺️ รอบ 356: เข้าเมืองเฮลิฯ แบบ "เดินเท้า" ผ่านแผนที่โลกผจญภัยได้โดยไม่ต้องมีตั๋วเฮลิฯ
  //    (เดิน/นั่งโดยสาร/วิงสูทฟรี — ขับเองค่อยเช็กตั๋วที่ beginPilot)
  if(mode==='heli' && !state.heliTicket && !(opt&&opt.walkIn)){ toast('🚁 ต้องมีตั๋วโลกเฮลิคอปเตอร์ก่อนนะ'); return; }
  if(mode==='drone' && !state.droneTicket){ toast('🛸 ต้องมีตั๋วโลกโดรน FPV ก่อนนะ'); return; }
  if(mode==='drive' && !state.driveTicket){ toast('🚗 ต้องมีตั๋วโลกขับรถกำแพงเพชรก่อนนะ'); return; }
  if(mode==='soccer' && !state.soccerTicket){ toast('⚽ ต้องมีตั๋วโลกสนามฟุตบอลก่อนนะ'); return; }
  if(mode==='mecha' && !state.mechaTicket && !(state.robots&&state.robots.length)){ toast('🤖 ต้องจ่ายค่าเข้าโลกหุ่นรบก่อนนะ'); return; }   // 🔓 รอบ 943: ไม่มีหุ่น=ยืมระบบฟรี (จ่ายค่าเข้าแล้วเข้าได้)
  if(mode==='drive' && !window.KPP_CITY){ toast('🗺️ แผนที่เมืองยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ'); return; }
  /* รอบ 255: เลิกระบบบาดเจ็บล็อกเข้าโลก (advHurt) — โลก 3D ไม่มีตาย/เกมโอเวอร์แล้ว เข้าได้เสมอ */
  // 🧹 รอบ 941: ผ่านด่านเช็กทุกข้อ = เข้าโลกจริง → ล้าง toast เตือนค้างของล็อบบี้ (เช่น "ยังไม่มีหุ่นยนต์" ก่อนซื้อ)
  //    ป้ายพวกนี้ค้างจนกดปิดเอง — ผู้ใช้ซื้อหุ่นแล้วเข้าโลกได้ แต่ป้ายเก่ายังลอยทับ HUD ดูเหมือนเกมยังหาว่าไม่มีหุ่น
  if(typeof clearWarnToasts==='function') clearWarnToasts();
  if(typeof Music!=='undefined') Music.suspendBg();   // 🎵 รอบ 181: พักเพลงพื้นหลัง (โลก 3D มี soundscape เอง)

  if(!built){
    buildDom();
    renderer=new THREE.WebGLRenderer({canvas:canvasEl,antialias:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    // 🚑 รอบ 859: การ์ดจอหลุด (หน่วยความจำ WebView เต็ม ฯลฯ) ห้ามพังเงียบ — รายงานบนจอ (กฎทอง #1)
    canvasEl.addEventListener('webglcontextlost',ev=>{ ev.preventDefault();
      if(typeof world3DFail==='function') world3DFail('โลก 3D','การ์ดจอหลุด (webglcontextlost) — หน่วยความจำกราฟิกเต็ม'); });
    camera=new THREE.PerspectiveCamera(72,window.innerWidth/window.innerHeight,.1,220);
    clock=new THREE.Clock();
    built=true;
  }
  if(scene) clearEntities();                       // ล้างของโหมดก่อนหน้า (ถ้าเคยเข้า)
  // 🚁🌳 รอบ 816: เฮลิฯ แผนที่ 'kpp' ใช้ฉากของโลกขับรถทั้งก้อน (worlds.drive) — ไม่สร้างฉากซ้ำ
  const wk=heliKpp()?'drive':mode;
  if(!worlds[wk]) buildScene(wk);
  scene=worlds[wk].scene; trees=worlds[wk].trees||[]; buildings=worlds[wk].buildings||[];
  if(!worlds[wk]._sky){ worlds[wk]._sky=1; applySky(scene, wk); }   // 🌅 ท้องฟ้าภาพจริง (ครั้งเดียว/โลก · ไม่มีไฟล์=คงสีพื้น)
  solids=worlds[wk].solids||[];

  maxHp=100; hp=100; sessionCoins=0; sessionWords=0; sessionWordLog=[]; inv={}; keys={}; yaw=0; pitch=0;   // maxHp ปรับต่อโลกด้านล่าง
  hauntLives=HAUNT_LIVES; hurtUntil=0;                                 // 👻 รีเซ็ตหัวใจโลกผี
  hauntRunStart=performance.now(); hauntRecordShown=false;             // ⏱ รอบ 256: เริ่มจับเวลาหนีผีรอด
  nmActive=false; nmMin=99; nmCrashed=false; nmCombo=0; nmLastAt=0;    // 💨 รีเซ็ตโบนัสบินเฉียด
  if(M.heli){
    // 🚁🌳 รอบ 816: kpp = ลงจอดบนลานหญ้าใกล้หอนาฬิกา (ลานจอดกลางเมืองเฮลิฯ คือ 0,0 ซึ่งที่นี่เป็นเกาะวงเวียน)
    if(heliKpp()){ const s0=heliKppSpawn(); camera.position.set(s0.x,HELI_SKID,s0.z); yaw=s0.yaw; }
    else camera.position.set(0,HELI_SKID,0);       // เริ่มบนลานจอดกลางเมือง
    hVel={x:0,y:0,z:0}; hCol=0; hLanded=true; hHitAt=0; hWarnLvl=0;
    hAtcCleared=false; ATC.reset();
    netHpOk=true;                                  // 🚁 รอบ 376: คืนสิทธิ์ส่ง hp เผื่อผู้ใช้เพิ่ง publish rules
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
    /* 🌫️🩹 รอบ 816: โหมดเฮลิฯ แผนที่ 'kpp' ใช้ฉากเดียวกันกับโลกขับรถ และ fogUpdate ของเฮลิฯ
       ไป "เขียนทับ" หมอก/สีฟ้าของฉากนี้ตามเวลาจริง (กลางคืนมืด/หมอกเช้าใกล้) — โลกขับรถไม่มีระบบนั้น
       จึงไม่มีใครตั้งค่าคืน → เข้าโลกขับรถหลังบินเฮลิฯ จะได้หมอกค้างของเฮลิฯ ต้องคืนค่าเองที่นี่ */
    if(scene.fog){ scene.fog.near=MODES.drive.fogN; scene.fog.far=MODES.drive.fogF;
                   scene.fog.color.setHex(MODES.drive.sky); }
    if(scene.background&&scene.background.isColor) scene.background.setHex(MODES.drive.sky);
    const sp=worlds.drive.d.spawn;                 // เกิดบนถนนใหญ่ข้างวงเวียนหอนาฬิกา หันตามแนวถนน
    camera.position.set(sp.x,CAR_EYE,sp.z); yaw=sp.yaw;
    dSpeed=0; dSteer=0; dLook=0; hHitAt=0; carStreet=''; carNameAt=0;
    carGlbEnsure(()=>{});                          // 🚙 รอบ 393: พรีโหลดโมเดลรถ — เพื่อนโผล่มาเห็นเป็นรถจริงทันที
    // 👁️🛞 รอบ 394: เข้าโลกเริ่มมุมมองที่ 1 เสมอ + ล้างรอยยางเก่า
    dCam3=false; dPrevV=false; overlayEl.classList.remove('cam3');
    if(carSelfM) carSelfM.visible=false;
    skids.forEach(m=>{ m.visible=false; }); skidAcc=9;
    // 🚗 รอบ 232: ผูกสมรรถนะตามคันที่เลือกขับ (ตรงกับป้ายในโชว์รูม · คันแพง/สปอร์ต = เร็ว·เร่ง·เกาะถนนดีกว่าเบาๆ)
    (function(){ const cp=(typeof myCar==='function'&&myCar())?carInfo(myCar().id):null;
      const sp=(cp&&cp.spd)||3, ac=(cp&&cp.acc)||3, gr=(cp&&cp.grip)||3;
      drivePerf={ vmaxMul:0.82+sp*0.045, accMul:0.82+ac*0.045, steerMul:0.90+gr*0.025 }; })();
    gpsTarget=null; gpsRoute=null; gpsRouteFor=null; gpsRouteTo=null;   // 🧭 รีเซ็ต GPS
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
    soccerCam1=false; joy.on=false; joy.dx=joy.dy=0;    // 🕹️ รอบ 398: เคลียร์สติ๊กเล็ง (เลิกใช้แป้น ▲▼◀▶)
    sCurl=0; sHit=0; sKickPunch=0; renderCurl();        // 🌀 รอบ 400-401: เริ่มเกมไม่มีโค้ง/จุดสัมผัสค้าง
    fkOn=false; fkWall=null; fkMen=[]; landPt=null;     // 🧱🎯 รอบ 402: กำแพง/วงจุดตกเริ่มใหม่ทุกครั้ง (ฉากสร้างใหม่)
    auraRender();                                       // ⚡ รอบ 412: ปุ่ม/แถบพลังให้ตรงสถานะที่ค้างไว้ (ซื้อแล้วออกเกมแล้วกลับเข้ามา)
    spinOpen=true;                                      // 🎱 รอบ 403: แพดจุดสัมผัสเปิดค้างตลอด (ผู้ใช้สั่ง)
    if(spinPadEl) spinPadEl.style.display='';
    renderSpinPad();
    soccerResetBall();                                  // 🎲 สุ่มจุดยืนแรกให้เลย
    camera.position.set(sBaseX,4,sBaseZ+8); camera.lookAt(0,1.2,GOAL_Z);
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
  }else if(M.hotel){
    /* 🏨 รอบ 684: เกิด "นอกโรงแรม" หันหน้าเข้าประตูหลัก — ให้เด็กได้เห็นตึกสวย ๆ ก่อนเดินเข้าไป (ข้อ 3) */
    camera.position.set(HOTEL3D.BX+26,EYE_H,0);
    yaw=Math.PI/2; pitch=-.02;
    hotelReset();
  }else{
    camera.position.set(0,EYE_H,0);
  }
  camera.far=(M.drive||heliKpp())?800:(M.soccer?400:(M.mecha?320:220)); camera.updateProjectionMatrix();   // เมืองจริง/สนามใหญ่ต้องมองไกล (รอบ 816: เฮลิฯ เหนือเมืองจริงด้วย)
  if(!Array.isArray(state[M.doneKey])) state[M.doneKey]=[];
  words=pickWords(GUIDE_WORDS);
  if(M.soccer){ soccerBuildTargets(); }             // ⚽ ป้ายเป้าคงที่ (Plane หงายได้) แทนตัวอักษร sprite กระจาย
  else if(M.mecha){ startWave(1); }   // 🌊 รอบ 229: เริ่ม Endless Wave (เดิม spawn ALIEN_COUNT ตายตัว)
  /* 🏨 รอบ 778 (ผู้ใช้สั่งข้อ 5): โรงแรมผีสิงวางเฉพาะตัวอักษรของคำที่กำลังหาอยู่ — ไม่มีตัวหลอก ไม่มีของคำอื่น */
  else if(M.hotel){ ensureCoverage(); }
  else{
    words.forEach(spawnLettersForWord);
    for(let i=0;i<8;i++) spawnLetter('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]);
    ensureDriveAmbience();   // 🌳🪙 รอบ 811: เข้าโหมดขับรถ (M.drive) ต้องมีสำเนาตัวอักษร+เหรียญโบนัสให้เก็บตั้งแต่แรกเข้า ไม่ต้องรอ 5 วิ
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
    if(heliKpp()){
      /* 🚁🌳 รอบ 816: เมืองกำแพงเพชรไม่มีตึกเทอร์มินัล/ลิฟต์/ลำจอดโชว์ (ของพวกนั้นอยู่ใน worlds.heli.foot)
         → ข้ามเฟสเดินเท้าไปเลย ขึ้นนั่งที่นักบินพร้อมสตาร์ทเครื่องตั้งแต่เฟรมแรก */
      hPhase='pilot'; termB=null;
      overlayEl.classList.remove('hfoot','show-adshop'); setFootBtns(false,false);
      HeliSound.start();
      hAtcCleared=false; ATC.reset();
      dustBurst(camera.position.x,.05,camera.position.z,18);   // 🌪️ ฝุ่นหญ้าฟุ้งตอนใบพัดเริ่มหมุน
    }else{
      // 🚶 รอบ 354: เข้าโลกแล้ว "เริ่มเดินเท้า" — เครื่องยนต์ยังไม่สตาร์ท (beginPilot ค่อยสตาร์ทตอนเดินไปขึ้นเฮลิฯ แดง)
      hPhase='walk';
      termB=worlds.heli.foot.term;
      worlds.heli.foot.pilotH.visible=true;               // ลำที่จอดโชว์กลับมา (เผื่อรอบก่อนขับอยู่)
      endRide(false);                                     // เฮลิฯ โดยสารกลับที่จอดดาดฟ้า + ตัดเสียงค้าง
      overlayEl.classList.add('hfoot'); setFootBtns(false,false);
      camera.position.set(1.5,FOOT_EYE,9);                // เกิดริมลานกลาง มองเห็นเฮลิฯ แดง+เมือง
      HeliSound.probe();                                  // โหลดไฟล์เสียงรอไว้ (ใช้ทั้งตอนขับและเสียงห้องโดยสาร)
    }
    hViewSwitched=false;
    setSeat(0);                                           // 🎚️ ตอนสตาร์ทเครื่อง = มุมเต็มลำ (ได้อารมณ์อยู่ในห้องนักบิน)
    setWiper(0); setVisor(false); setHeliLight(false);    // 🌧️🕶️💡 เข้าโลกใหม่ = ที่ปัด/ม่าน/ไฟ ปิดเสมอ
    washFluid=WASH_TANK_MAX; washUntil=0; grime=.45; renderWashGauge();  // 🚰 เข้าโลกใหม่ = ถังน้ำยาเต็ม กระจกสะอาดพอควร (รอบ 542)
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
  }else if(introSeen(introKey())){
    beginPlay();
    showBanner(modeIntro());
  }else{
    renderer.render(scene,camera);      // แสดงฉากไว้ข้างหลังการ์ด (ยังไม่เดินลูป/พักเกม)
    showIntro(introKey(),false);        // การ์ดวิธีเล่นครั้งแรก — กด "เริ่มเล่น" แล้วค่อย beginPlay (รอบ 816: แผนที่ย่อยจำแยกใบ)
  }
}

function exitWorld(){
  hauntSurviveFinish();                            // ⏱ ออกโลกผีเอง = นับเวลารอดรอบนี้เข้าสถิติด้วย
  running=false;
  adsStop();                                       // 🪧 รอบ 363: เลิกฟัง /ads (ป้ายเช่าโลกเฮลิฯ)
  if(typeof Music!=='undefined'&&Music.sceneBg) Music.sceneBg(null);   // 🎬 คืนเพลงหมุนปกติ (รอบ 369)
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
  // 🏨 รอบ 684: ออกจากโรงแรม = ปิดไฟฉาย + คืนไฟทั้งตึก + ซ่อน HUD เฉพาะโลกนี้
  if(mode==='haunt'){
    setTorch(false);
    if(hotel) HOTEL3D.setLights(hotel,true);
    if(hotelHemi) hotelHemi.intensity=.72;
    if(hotelMoonL) hotelMoonL.intensity=.55;
    if(hotelAmb) hotelAmb.intensity=.62;
    if(hActEl) hActEl.style.display='none';
    if(hTorchHintEl) hTorchHintEl.style.display='none';
  }
  // 🛬 ออกจากโลกเฮลิฯ = ดับเครื่อง (ใบพัดค่อยๆ ช้าลงจนหยุด) แทนตัดเสียงห้วนๆ
  wiperSndOff();                                     // 🔇 ออกจากโลก = ปิดเสียงที่ปัดด้วย (รอบ 537)
  sunShade=1; sunBlocked=0; applyCockpitShade();     // 🏢 คืนความสว่างห้องนักบิน (ร.540)
  if(mode==='heli' && state.sound && HeliSound.on) HeliSound.shutdown(); else HeliSound.stop();
  try{ if(paxSnd){ paxSnd.src.stop(); paxSnd=null; } }catch(e){}   // 🚁💺 รอบ 354: ตัดเสียงห้องโดยสารถ้าออกกลางทัวร์
  DroneSound.stop();
  CarSound.stop();
  SoccerAudio.stopAmb();                           // ⚽🔊 รอบ 396: หยุดฮัมฝูงชนสนามบอล
  // ⚽🎯🎬🧱 รอบ 397-402: ล้างสถานะจุดโทษ/รีเพลย์/ฟรีคิก (ป้ายคำโดน clearEntities ลบอยู่แล้ว)
  pkOn=false; sBaseZ=PLAYER_Z; sBaseX=0; repOn=false; repPendAt=0;
  fkOn=false; fkWall=null; fkMen=[];                // ฉากถูกทิ้งทั้งก้อนตอนออก — เคลียร์อ้างอิงกัน mesh ค้างข้ามรอบ
  if(auraBarEl) auraBarEl.classList.remove('on');   // ⚡ รอบ 412: ซ่อนแถบพลังนอกสนามบอล (เวลายังเดินอยู่ใน state)
  if(drillMesh) drillMesh.visible=false;
  { const fkb=overlayEl&&overlayEl.querySelector('#adv-fk');
    if(fkb){ fkb.classList.remove('on'); fkb.textContent='🧱 ฟรีคิก'; } }
  if(pkHudEl) pkHudEl.style.display='none';
  if(repEl) repEl.style.display='none';
  { const pkb=overlayEl&&overlayEl.querySelector('#adv-pk');
    if(pkb){ pkb.classList.remove('on'); pkb.textContent='🎯 จุดโทษ'; } }
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
  // 🧹 รอบ 859: หด framebuffer คืนหน่วยความจำ GPU ตอนออกโลก (start() setSize เต็มจอใหม่ทุกครั้งอยู่แล้ว)
  //   เคสจริงบน APK: เล่นมอไซค์→เปิดข้อสอบ→หน่วยความจำ WebView ตึงจนเข้าโลก 3D ไม่ได้ทุกโลก
  if(renderer) renderer.setSize(2,2,false);
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
    camera:()=>camera, damagePlayer, spawnGhost, tinvCheck, onPeerData, exitWorld, sendChat, Voice, tinvLinked, showPodium, endRound,
    /* เดินเฟรมเอง 1 ก้าว (แท็บ preview ถูก throttle rAF แทบไม่วิ่ง · SnapLab ใช้ตัวนี้ถ่ายภาพ) */
    /* 🏨 รอบ 684: hook เทสต์โรงแรมผีสิง (ไฟดับ/ไฟฉาย/ลิฟต์/ตู้/ผี) */
    hotel:{ get h(){return hotel}, get footY(){return hFootY}, get dark(){return blackedOut},
            get torch(){return torchOn}, blackout:hotelBlackout, toggleTorch, act:hotelAct,
            openWardrobe, announceTarget, setLights:(on)=>HOTEL3D.setLights(hotel,on),
            goStalk:()=>{ const g=monsters.find(x=>x.st==='lurk'); if(g) ghostGoStalk(g); return !!g; },
            goBehind:()=>{ const g=monsters[0]; if(g) ghostGoBehind(g); return !!g; },
            teleport(f,x,z){ hFootY=HOTEL3D.floorY(f); camera.position.set(x,hFootY+EYE_H,z); },
            setYaw:(v)=>{yaw=v}, setPitch:(v)=>{pitch=v} },   // 📸 รอบ 850: หมุนกล้องตอนถ่าย Snap
    peersTick:(dt)=>tickPeers(dt||.016,performance.now()),   // 🚁 รอบ 376: เทสต์ลำเพื่อนตอนแท็บโดน throttle
    /* 🏟️ รอบ 640: ระบบหลายสนาม (โหมดไหนก็ได้ในไฟล์นี้) */
    netJoinAs(md){ if(md){ mode=md; M=MODES[md]||M; } netJoin(); }, netLeave, netUp,
    // 🚁🌳 รอบ 816: testkit แผนที่ย่อยของโหมดเฮลิฯ (บนเมืองกำแพงเพชร)
    get heliMap(){ return heliMap; }, get heliKpp(){ return heliKpp(); },
    get heliPhase(){ return hPhase; }, get landed(){ return hLanded; },
    heliKppSpawn, heliKppBlocked,
    get room(){ return room; },
    get crowd(){ return {peers:Object.keys(peers).length, roomIdx:room?room.room:-1,
      full:room?room.full:false, legacy:room?room.legacy:false, joined:room?room.joined:false,
      gap:room?room.sendGap:0}; },
    showIntro, introSeen, get introEl(){return introEl}, get wordLog(){return sessionWordLog}, knockedOut,
    give(ch,n){ inv[ch]=(inv[ch]||0)+(n||1); renderHudInv(); renderHudWords(); tryCompleteWords(); },
    get heli(){ return {vel:hVel, landed:hLanded, col:hCol, buildings, floorAt:heliFloorAt,
                        rpm:HeliSound.rpm, soundReady:HeliSound.ready, sound:HeliSound, warn:hWarnLvl,
                        ads:(worlds.heli&&worlds.heli.ads)||[], atc:ATC,
                        // 🌧️☀️🎚️💧🕶️📹 testkit: ที่ปัด / แสงแดด / มุมมอง / ฝน / ม่าน / กล้องใต้ท้อง
                        get wiper(){return wiperMode}, setWiper,
                        // 🎬 รอบ 533: สถานะชั้นกระจกที่มีชีวิต (ท่าจอด/รอยรีดน้ำ/ฝ้า/ใบพัดตัดแสง)
                        get glass(){return {ang:+wiperAng.toFixed(3), park:wiperPark, vel:+wiperVel.toFixed(2),
                                            smears:smears.length, mist:+glassMist.toFixed(3),
                                            chop:+rotorChop(performance.now()).toFixed(3),
                                            sunHi:+sunHi.toFixed(2), sunDir:+sunDir.toFixed(2),
                                            // 🏢🔊 รอบ 537: แดดวูบหลังตึก + เสียงที่ปัด
                                            blocked:sunBlocked, shade:+sunShade.toFixed(3),
                                            snd:wSnd?+wSnd.g.gain.value.toFixed(4):null,
                                            // 🕒🏢 รอบ 540: โหมดหน่วง + เงาพาดในห้องนักบิน
                                            wait:Math.max(0,Math.round(wiperWaitAt-performance.now())),
                                            heavy:rainHeavy, filter:cockpitEl?cockpitEl.style.filter:'',
                                            // 💦🏢➡️ รอบ 541: ที่ฉีดน้ำ + คราบ + ขอบเงากวาด
                                            grime:+grime.toFixed(3), washing:washUntil>performance.now(),
                                            washLeft, shEdge:+shEdge.toFixed(3), shDir,
                                            // 🚰🌃 รอบ 542: ถังน้ำยา + ไฟเมืองสะท้อน
                                            fluid:+washFluid.toFixed(2), refl:cityRefl.length,
                                            glow:+cityGlowLevel().toFixed(3)}},
                        washNow:washStart, setGrime:v=>{grime=v}, setFluid:v=>{washFluid=v; renderWashGauge();},
                        rayBlocked:()=>sunRayBlocked(),
                        setMist:v=>{glassMist=v},
                        // ⚠️ ตั้งได้ชั่วคราวเท่านั้น — fogUpdate คำนวณใหม่จากนาฬิกาจริงทุก ~0.8 วิ
                        setNight:v=>{heliNight=v}, setFog:v=>{heliFog=v},
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
                          washTick(performance.now(),dt); grimeTick(dt);
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
                        // 🪧 รอบ 362: testkit เช่าป้ายโฆษณา
                        adShop:{open:adShopOpen, buy:adRentBuy, fetchAds:adsFetch, render:adShopRender,
                                get renters(){return adRenters}, set renters(v){adRenters=v},
                                get el(){return adShopEl}, redraw:n=>_adTexDraws[n]&&_adTexDraws[n](),
                                changed:adsChanged, watch:adsWatch, stop:adsStop,
                                get watching(){return !!_adsRef},
                                flybyTick:adFlybyTick, get flybyNear(){return _adFlybyNear},
                                clearFlyby(){ _adFlybyNear={}; _adFlybyAt={}; }},
                        // 🚶🪂 รอบ 354: เฟสเดินเท้า
                        get phase(){return hPhase},
                        get foot(){const F=worlds.heli&&worlds.heli.foot;return F?{term:{x:F.term.x,z:F.term.z,h:F.term.h,w:F.term.w,d:F.term.d},door:F.doorC,lift:F.liftIn,liftRoof:F.liftRoof,pax:F.paxPos,ent:F.entD?+F.entD.open.toFixed(2):null}:null},
                        goPilot:beginPilot, goRide:beginRide, goWing:beginWing, goFoot:endPilot,
                        rideEnd:endRide, footTick:(dt)=>tickHeliFoot(dt||.016,performance.now()),
                        tick:(dt)=>tickHeli(dt||.016,performance.now()),
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
    get drive(){ return {
      // 🚙 รอบ 394: มุมมองที่ 3 / รอยยาง / บังคับรถ (testkit)
      get cam3(){return dCam3}, toggle:driveCamToggle, get selfCar(){return carSelfM}, get skids(){return skids},
      get keys(){return keys}, engineOn(){ carEngineOn=true; carStartOpen=false; },
      tick:dt=>tickDrive(dt||.016,performance.now()),          // เดินเฟรมเองตอนแท็บ hidden (rAF ไม่ยิง)
      setYaw:v=>{yaw=v}, setSpeed:v=>{dSpeed=v},
      get speed(){return dSpeed}, get steer(){return dSteer}, get street(){return carStreet},
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
                          get charge(){return sChg}, set charge(v){ sChg=v; sCharging=v>0; },   // 🎨 รอบ 402: ตั้งพลังเพื่อเทสต์สีริบบิ้น
                          kick:soccerKick, reset:soccerResetBall, kitGo:soccerKitGo,
                          get player(){return soccerPlayer},
                          get cam1(){return soccerCam1}, set cam1(v){soccerCam1=v},
                          // ⚽🎨 รอบ 396: testkit ฟิสิกส์ PES (สปิน/เงา/ตาข่าย/เสียง) + เดินเฟรมเองตอนแท็บ hidden
                          get spin(){return sbSpin}, get shadow(){return sbShadow},
                          get nets(){return soccerNets}, get ripple(){return sbNetRipple}, get inNet(){return sbInNet},
                          audio:SoccerAudio,
                          get stick(){return joy},        // 🕹️ รอบ 398: สติ๊กเล็งมือซ้าย (เทสต์: stick.on=true; stick.dx=1)
                          get curl(){return sCurl}, set curl(v){sCurl=v; renderCurl(); renderSpinPad();},   // 🌀 รอบ 400: ความโค้งที่ตั้งก่อนเตะ
                          get curlEl(){return curlEl},
                          // 🎱🎀 รอบ 401: จุดสัมผัส (สนุกเกอร์) + ริบบิ้นไกด์ + แรงกระตุกกล้อง
                          get hit(){return sHit}, set hit(v){sHit=v; renderSpinPad();},
                          pad:{toggle:spinPadToggle, pick:spinPadPick, get open(){return spinOpen},
                               get el(){return spinPadEl}, get dot(){return spinDotEl}, get lbl(){return spinLblEl}},
                          get ribbon(){return guideRibbon}, get guidePts(){return _gPts.map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2),z:+p.z.toFixed(2)}));},
                          // 🎨🎯🧱 รอบ 402: สีริบบิ้นตามพลัง · วงจุดตก · กำแพงฟรีคิก
                          get ribbonColor(){return guideMat?'#'+guideMat.color.getHexString():null},
                          // ⚡ รอบ 412: testkit พลังโอเวอร์ไดรฟ์
                          aura:{buy:auraBuy, get on(){return auraActive()}, get leftMs(){return auraLeftMs()},
                                get grp(){return auraGrp}, get bar(){return auraBarEl}, get btn(){return auraBtnEl},
                                set until(v){ state.soccerAuraUntil=v; auraRender(); }},
                          get drill(){return drillMesh},
                          get landRing(){return landRing}, get landPt(){return landPt},
                          fk:{toggle:fkToggle, get on(){return fkOn}, get wall(){return fkWall},
                              get men(){return fkMen.map(m=>+m.x.toFixed(2))}, get baseZ(){return sBaseZ}},
                          get punch(){return sKickPunch}, launch:kickLaunch,
                          // 🧤🎯🎬 รอบ 397: testkit GK / จุดโทษ / รีเพลย์
                          get gk(){return {mesh:gkMesh,x:gkX,saveAt:gkSaveAt,type:gkType,ensure:soccerGKEnsure}},
                          pk:{start:pkStart,end:pkEnd,get on(){return pkOn},get goals(){return pkGoals},
                              get kicks(){return pkKicks},get endAt(){return pkEndAt},set endAt(v){pkEndAt=v},
                              get hud(){return pkHudEl}},
                          rep:{get on(){return repOn},get trace(){return repTrace},start:repStart,
                               get pendAt(){return repPendAt},set pendAt(v){repPendAt=v},get el(){return repEl}},
                          tick:dt=>tickSoccer(dt||.016,performance.now())}; },
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
    step(dt,n){                      // เดินเกมเอง n เฟรม — rAF ไม่ fire ใน preview ที่มองไม่เห็นหน้าต่าง
      dt=dt||.016; n=n||1;
      for(let i=0;i<n;i++){
        const now=performance.now();
        if(M.heli){ if(hPhase==='pilot') tickHeli(dt,now); else tickHeliFoot(dt,now); }
        else if(M.drone){ tickDrone(dt,now); }
        else if(M.drive){ tickDrive(dt,now); }
        else if(M.soccer){ tickSoccer(dt,now); }
        else if(M.mecha){ tickMecha(dt,now); }
        else if(M.hotel){ tickHotelPlayer(dt,now); tickHotelWorld(dt,now); tickGhosts(dt,now); }   // 🏨 รอบ 684
        else{
          tickPlayer(dt,now);
          if(M.ghost) tickGhosts(dt,now); else { tickMonsters(dt,now); tickShots(dt); }
        }
        tickLetterRespawns(now);
        tickPeers(dt,now); drawMinimap(); renderer.render(scene,camera);
      }
    },
    renderNow(){ camera.updateMatrixWorld(); renderer.render(scene,camera); },   // เทสต์: เรนเดอร์เฟรมเดียวโดยไม่ขยับกล้อง
    get letters(){ return letters.map(l=>({ch:l.ch,x:l.spr.position.x,y:l.spr.position.y,z:l.spr.position.z,bonus:!!l.bonus})); },   // 🔠 เทสต์: ดูตัวอักษรบนพื้นตอนนี้
    get letterRespawns(){ return letterRespawns.map(r=>({...r})); },              // 🔠⏱️ เทสต์: ดูคิวรอเกิดใหม่
    pickUp:(i)=>pickUpLetter(i),                                                 // 🔠 เทสต์: เก็บตัวอักษรตรง ๆ ไม่ต้องเดินชน
    // ⚽ รอบ 852: testkit โลกฟุตบอล — สถานะไฟ/ควัน/ท่าตัวนักเตะ + ยิงตรง ๆ (เทสต์ overdrive/ลูกไฟ)
    get soccer(){ return { aimYaw, sChg, sCharging, sbLive, sbFlame, sbVel:{x:sbVel.x,y:sbVel.y,z:sbVel.z},
      fireOn:fireGrp?fireGrp.visible:false, smokeLive:smokePool.filter(p=>p.life>0).length,
      player:soccerPlayer?{x:+soccerPlayer.position.x.toFixed(3),z:+soccerPlayer.position.z.toFixed(3),
        ry:+soccerPlayer.rotation.y.toFixed(3),rx:+soccerPlayer.rotation.x.toFixed(3)}:null,
      base:{x:sBaseX,z:sBaseZ}, launch:kickLaunch, kick:soccerKick,
      // 🏟️ รอบ 928: ตำแหน่งบอลจริง + สถานะประตู (เทสต์ระยะเตะบนสนามใหญ่ 2 เท่า)
      ball:soccerBall?{x:+soccerBall.position.x.toFixed(2),y:+soccerBall.position.y.toFixed(2),z:+soccerBall.position.z.toFixed(2)}:null,
      sbGoaled, sbInGoal,
      setAim(y,p){ aimYaw=y; if(p!=null) aimPitch=p; }, setCharge(v){ sChg=v; sCharging=v>0; },
      // 🎯 รอบ 855: วาร์ปบอลไปชนป้ายตรง ๆ (ข้าม RNG การเล็ง — เทสต์ระบบป้ายเปลี่ยนตัวอักษร)
      teleportBall(x,y,z,vx,vy,vz){ soccerBall.position.set(x,y,z); sbVel.x=vx||0; sbVel.y=vy||0; sbVel.z=vz==null?-8:vz;
        sbLive=true; sbGoaled=true; sbKickAt=performance.now(); },
      get wordsInfo(){ return words.map(w=>({en:w.en,done:w.done})); },
      get invNow(){ return {...inv}; } }; },
  },
};
})();
