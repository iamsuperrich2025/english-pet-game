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
    ghostMax:7, ghostLife:20000, ghostSpeed:4.3, huntR:14, seeR:9,
    ghostEmoji:['👻','👻','👻','💀','🧟'],
    intro:'👻 <b>โลกผีสิง...</b><br><small>ผีโผล่ทีละ 20 วิแล้วย้ายที่ · สู้ไม่ได้ ถ้าโผล่ใกล้ให้วิ่งหนี!<br>มีหัวใจ ❤️❤️❤️ 3 ดวง โดนผีแตะเสีย 1 ดวง (กระเด็นหนีได้) หมดเมื่อไรจบเกม</small>',
    hint:'คลิกจอ=ล็อกเมาส์ · WASD วิ่งหนี · สู้ไม่ได้!! · โดนแตะเสียหัวใจ · Esc ปลดเมาส์แล้วค่อยกดออก',
    koTitle:'💫 พลังหมดแล้ว!',
  },
  heli: {
    label:'โลกเฮลิคอปเตอร์', emoji:'🚁', reward:30, doneKey:'heliDone',
    shoot:false, ghost:false, heli:true,
    sky:0x9fd9f7, fogN:45, fogF:150, ground:0x8a8f96,
    intro:'🚁 <b>โลกเฮลิคอปเตอร์ Bell!</b><br><small>ตัวอักษรอยู่บนยอดตึก — บินลอดระหว่างตึก<br>แล้ว<b>ลงจอดบนดาดฟ้า</b>เพื่อเก็บ · ระวังชนตึก!<br>💨 บินเฉียดตึกแบบไม่ชน = ได้เหรียญโบนัสค่าความกล้า!</small>',
    hint:'W/S เอียงหน้า-หลัง · A/D สไลด์ · Q/E หันหัว · Space ขึ้น · Shift ลง · จอดเบาๆ บนดาดฟ้าเพื่อเก็บตัวอักษร',
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
};
MODES.adv.koTitle='💫 พลังหมดแล้ว!';
const SHOOT_GAP_MS = 280;
const MONSTER_REWARD = 2;       // เหรียญ/ตัว เมื่อยิง monster แตก (โหมด adv)
const AD_COUNT = 10;            // ป้ายโฆษณาบนยอดตึกในเมืองเฮลิฯ (เลขป้ายคงที่ — เมือง seed แล้ว)
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
const CAR_FINE_SIGNAL = 100;      // 🪙 ค่าปรับเลี้ยวที่ทางแยกไม่เปิดไฟเลี้ยว ม.36 (รอบ 132 · หักตอนออก · สูงสุด 5 ใบ/รอบ)
const CAR_RAM_FEE     = 10000;    // 🛠️ เจตนาชนรถผู้เล่นอื่นครบ 3 ครั้ง/รอบ = ค่าซ่อมรถ (รอบ 133 · ประกันไม่คุ้มครองเจตนาชน · ครั้งเดียว/รอบ)
const CAR_FINE_RED    = 300;      // 🚦 ค่าปรับฝ่าไฟแดง ม.22 (รอบ 133 · หักตอนออก · สูงสุด 5 ใบ/รอบ)
const CAR_VMAX_OFF = 7;           // ออกนอกถนน (ดิน/หญ้า) ช้าลงมาก
const CAR_VREV   = 6.5;           // ถอยหลังสูงสุด
const CAR_WB     = 2.6;           // ระยะฐานล้อ (bicycle model)
const CAR_STEER_MAX = .52;        // มุมเลี้ยวสูงสุด (rad) ตอนรถช้า
let dSpeed=0, dSteer=0, dLook=0;  // ความเร็ว(ลงชื่อ) · มุมพวงมาลัย(smooth) · หันหัวมองข้างชั่วคราว
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
let tlChkAt=0, tlCoolAt=0;                            // จังหวะเช็กทางแยก (ทุก 300ms) + cooldown หลังออกจากแยก
let carPeerHitAt=0;                                   // cooldown ชนรถเพื่อน (กันโดนรัวติดๆ)
let netTlOk=true;                                     // rules /world ยังไม่รับ field tl → ตัด tl ส่งซ้ำ ไม่พัง multiplayer
let carPeerHits=0;                                    // 🛠️ รอบ 133: นับ "เจตนาชน" รถเพื่อนรอบนี้ (ครบ 3 = ค่าซ่อม CAR_RAM_FEE)
let rlChkAt=0, rlCoolAt=0, rlForce=null;              // 🚦 รอบ 133: ไฟแดง — จังหวะเช็ก + cooldown ใบสั่ง + testkit บังคับเฟสไฟ
let carDashEl=null, carWheelEl=null, carHornAt=0, carNameAt=0, carStreet='';
let carGaugeCv=null, carGaugeCtx=null, carDashImg=null;   // เข็มวิ่งจริงบนคลัสเตอร์ของภาพ dash.png
let cityMapCv=null;               // แผนที่เมืองวาดครั้งเดียว → ใช้เป็นเรดาร์หมุนได้
/* ---------- เฮลิคอปเตอร์ (โหมด heli) ---------- */
const HELI_SKID=1.35;             // ความสูงตาคนขับเหนือแท่นลงจอด (คาน skid)
let hVel={x:0,y:0,z:0}, hCol=0, hLanded=true, hHitAt=0, hWarnLvl=0, hudInstEl=null, hudWarnEl=null, cockpitEl=null;
let hTiltF=0, hTiltS=0;           // การเอียงหัว/ข้าง แบบ smooth — ใช้ทั้งมุมกล้องและเข็มเส้นขอบฟ้า (รอบ 61)
let gaugeCtx=null;                // canvas หน้าปัดเข็มขยับจริง 5 ตัว
let hAtcCleared=false;            // รอบ 64: หอบังคับประกาศ "อนุญาตขึ้นบิน" ไปแล้ว (ครั้งเดียว/รอบเข้าโลก)

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
let hp=100, sessionCoins=0, sessionWords=0;
let hauntLives=HAUNT_LIVES, hurtUntil=0;   // 👻 ระบบหัวใจโลกผี + ช่วงกันโดนซ้ำ
let sessionWordLog=[];             // 📖 คำที่ประกอบสำเร็จรอบนี้ {en,th} — โชว์เป็นสมุดคำศัพท์ตอนออก (ทบทวนคำ)
let inv={};                       // ตัวอักษรในกระเป๋า {a:2,...}
let words=[];                     // guideline [{en,th}]
let letters=[];                   // ตัวอักษรในโลก [{ch,spr,born}]
let monsters=[];                  // adv: [{spr,hp,tgt,wanderAt,hitAt}] · haunt(ผี): [{spr,born,hunting,wailAt,tgt,wanderAt}]
let shots=[];                     // [{mesh,dir,life}]
let keys={}, joy={on:false,dx:0,dy:0}, lookTouch=null, lastShot=0, lastEnsure=0, lastSpawn=0;
let dmgFlashEl, hudWordsEl, hudInvEl, hudHpEl, hudCoinEl, hudHuntEl, hudHeartEl, hudBoardEl, mapCv, mapCtx, banEl, overlayEl, canvasEl, scareEl, hintEl, introEl;
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
    if(flyMode){ c.font='96px serif'; c.fillText(M.drone?'🛸':'🚁',64,105); }
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
function dAddBox(sc,mat,solids,cx,cy,cz,sx,sy,sz){
  const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);
  m.position.set(cx,cy,cz); sc.add(m);
  solids.push({x:cx,y:cy,z:cz,hx:sx/2,hy:sy/2,hz:sz/2});
}
/* ตึกร้าง 1 หลัง: เสา 4 มุม + มุลเลียนแบ่งหน้าต่าง (เว้นช่องบินลอด) + พื้นแต่ละชั้นมีปล่องกลาง + ผนังกั้นห้อง
   คืน {x,z,w,d,h,solids,rooms} — rooms = จุดวางตัวอักษรในห้องต่างๆ */
function buildAbandoned(sc,mat,cx,cz,w,d,rnd){
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
  return {x:cx,z:cz,w,d,h,solids,rooms};
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
function buildDriveCity(sc){
  const C=window.KPP_CITY;
  sc.add(new THREE.HemisphereLight(0xffffff,0x93a072,1.02));
  const sun=new THREE.DirectionalLight(0xfff2cc,.8); sun.position.set(160,320,110); sc.add(sun);
  const R=C.rad;
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(R*2+500,R*2+500),
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
  const GS=6, GW=Math.ceil((R*2+80)/GS), GOFF=(R+40);       // road grid: 0=นอกถนน 1=ถนน 2=น้ำ
  const grid=new Uint8Array(GW*GW);
  const gset=(x,z,v)=>{ const gx=Math.floor((x+GOFF)/GS), gz=Math.floor((z+GOFF)/GS);
    if(gx>=0&&gz>=0&&gx<GW&&gz<GW){ const k=gz*GW+gx; if(v===1||!grid[k]) grid[k]=v; } };
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
      for(let s2=0;s2<=st;s2++){
        const x=x1+dx*s2/st, z=z1+dz*s2/st;
        for(let ox=-rr;ox<=rr;ox++) for(let oz=-rr;oz<=rr;oz++) gset(x+ox*GS,z+oz*GS,1);
      }
      if(w>=5) for(let t=0;t<L;t+=15) roadPts.push(x1+ux*t,z1+uz*t);  // จุด spawn ตัวอักษรบนถนน
    }
  });
  sc.add(new THREE.Mesh(flatGeom(roadTris,.02),new THREE.MeshLambertMaterial({color:0x41454c})));
  sc.add(new THREE.Mesh(flatGeom(dashTris,.05),new THREE.MeshBasicMaterial({color:0xd8d8d2})));

  /* ---------- กำแพงกันชน (ตึกจริง=ขอบ polygon · ตึกแถว=กล่องหมุน) ใน spatial hash ---------- */
  const SCELL=42, solidGrid={};
  const sAdd=(cx,cz,r,o)=>{
    const x0=Math.floor((cx-r)/SCELL),x1=Math.floor((cx+r)/SCELL),z0=Math.floor((cz-r)/SCELL),z1=Math.floor((cz+r)/SCELL);
    for(let gx=x0;gx<=x1;gx++) for(let gz=z0;gz<=z1;gz++){
      const k=gx+','+gz; (solidGrid[k]=solidGrid[k]||[]).push(o);
    }
  };

  /* ---------- ตึกจริง 79 หลัง (ผัง footprint ตรงพิกัดจริง) + ป้ายชื่อสถานที่ ---------- */
  const tints=[0xcfc7b8,0xd8cfc0,0xbfc4cc,0xd9d2c2,0xc4cdc0,0xd6c9c9];
  C.b.forEach((b,bi)=>{
    const h=b[0], name=b[1], p=b[2];
    const shape=new THREE.Shape();
    shape.moveTo(p[0],-p[1]);
    for(let i=2;i<p.length;i+=2) shape.lineTo(p[i],-p[i+1]);
    const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});
    g.rotateX(-Math.PI/2);                                   // extrude → แกน y · shape.y=-z → z โลกตรงพิกัดจริง
    sc.add(new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:tints[bi%tints.length],side:THREE.DoubleSide})));
    let cx=0,cz=0; const n=p.length/2;
    for(let i=0;i<p.length;i+=2){ cx+=p[i]/n; cz+=p[i+1]/n; }
    for(let i=0;i<p.length;i+=2){                            // ขอบ polygon = กำแพง
      const x1=p[i],z1=p[i+1],x2=p[(i+2)%p.length],z2=p[(i+3)%p.length];
      sAdd((x1+x2)/2,(z1+z2)/2,Math.hypot(x2-x1,z2-z1)/2+3,{t:1,x1,z1,x2,z2});
    }
    if(name && name.length<=42){
      const spr=makeNameSprite(name); spr.position.set(cx,h+5,cz); sc.add(spr);
    }
  });

  /* ---------- ตึกแถวริมถนนจริง (InstancedMesh แยกตามจำนวนชั้น — ผัง bake seed คงที่)
     รอรับภาพ facade จริง img/city/*.png (PROMPTS_BUILDINGS_KPP.md): มีไฟล์ = ผนังเป็นภาพจริงทันที
     ไม่มี = สีล้วนตามเดิม · ภาพ 1 ไฟล์ = หน้าตึกเต็มความสูง (ชั้นล่างประตูม้วน) tile ซ้ำแนวนอน ~2.5 คูหา ---------- */
  const lots=C.p;
  const m4=new THREE.Matrix4(), q=new THREE.Quaternion(), eu=new THREE.Euler(),
        vv=new THREE.Vector3(), sv=new THREE.Vector3();
  const pal=[0xd9cfc0,0xcdd5dd,0xd8c8b4,0xc8d2c2,0xd5cbd0,0xbfc8ce,0xe0d6c4,0xccc4b6].map(c=>new THREE.Color(c));
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
  const MPX=.25, MSZ=Math.ceil(R*2*MPX)+40;
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
    d:{grid,GS,GW,GOFF,solidGrid,SCELL,roadPts,nameSegs,spawn,rad:R}};
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
    sc.add(new THREE.HemisphereLight(0xffffff,0x777a80,1.0));
    const sun=new THREE.DirectionalLight(0xfff4d6,.7); sun.position.set(40,80,30); sc.add(sun);
    // ถนนตาราง (เส้นเข้มบนพื้น)
    const roadM=new THREE.MeshLambertMaterial({color:0x50545a});
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
    // 📢 ป้ายโฆษณาบนยอดตึก (รอบ 58) — ตึกเว้นตึก สูงสุด AD_COUNT ป้าย เลขคงที่
    // พื้นหลังต่างกันทุกป้าย · วางไฟล์ img/ads/ad_<เลข>.png = โฆษณาลูกค้าขึ้นแทนทันที
    const ads=[];
    list.forEach((b,i)=>{
      if(ads.length>=AD_COUNT || i%2===1) return;
      const n=ads.length+1;
      const pw=Math.min(b.w+2,11), ph=pw*3/8;
      const panel=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),
        new THREE.MeshBasicMaterial({map:adBoardTexture(n),side:THREE.DoubleSide}));
      panel.position.set(b.x, b.h+2.2+ph/2, b.z);
      panel.lookAt(0, panel.position.y, 0);             // หันหน้าเข้ากลางเมือง มองเห็นตอนบิน
      // เสาค้ำ 2 ต้น (ลูกของ panel — หมุนตามอัตโนมัติ)
      const poleG=new THREE.CylinderGeometry(.12,.12,2.4,6);
      const poleM=new THREE.MeshLambertMaterial({color:0x37474f});
      [-pw/3,pw/3].forEach(off=>{
        const p=new THREE.Mesh(poleG,poleM);
        p.position.set(off,-ph/2-1.1,0);
        panel.add(p);
      });
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
    worlds[md]={scene:sc, trees:tr, buildings:list, ads};
    return;
  }else if(md==='drone'){
    // 🛸 เมืองตึกร้าง: ตึกกลวงมีหน้าต่าง บินลอดเข้าไปเก็บตัวอักษรในห้องต่างๆ
    sc.add(new THREE.HemisphereLight(0xcfd6dd,0x3a3d42,.95));
    const sun=new THREE.DirectionalLight(0xd8dde4,.5); sun.position.set(-30,70,40); sc.add(sun);
    const roadM=new THREE.MeshLambertMaterial({color:0x3c3f44});
    for(let i=-2;i<=2;i++){
      const r1=new THREE.Mesh(new THREE.PlaneGeometry(HALF*2+20,7),roadM); r1.rotation.x=-Math.PI/2; r1.position.set(0,.02,i*26); sc.add(r1);
      const r2=new THREE.Mesh(new THREE.PlaneGeometry(7,HALF*2+20),roadM); r2.rotation.x=-Math.PI/2; r2.position.set(i*26,.02,0); sc.add(r2);
    }
    const cMat=new THREE.MeshLambertMaterial({map:concreteTexture()});
    const rnd=seededRand(41987);
    const list=[];
    for(let gx=-2;gx<=2;gx++) for(let gz=-2;gz<=2;gz++){
      if(gx===0 && gz===0) continue;                    // ลานกลาง = จุดเกิด
      if(rnd()<.18) continue;                            // เว้นช่องให้เมืองโปร่ง บินได้สะดวก
      const x=gx*26+(rnd()*4-2), z=gz*26+(rnd()*4-2);
      const w=16+rnd()*6, d=16+rnd()*6;
      list.push(buildAbandoned(sc,cMat,x,z,w,d,rnd));
    }
    // ห่วงเรืองแสง (เกตแข่ง FPV) — ตกแต่งให้ได้ฟีล racing ไม่มีผลกับการเล่น
    const gateCol=[0xff3b6b,0x28e0ff,0xffd54f,0x6cff8a,0xb388ff];
    for(let i=0;i<6;i++){
      const g=new THREE.Mesh(new THREE.TorusGeometry(2.6,.28,8,24),
        new THREE.MeshBasicMaterial({color:gateCol[i%gateCol.length]}));
      const a=i/6*Math.PI*2, rr=20+rnd()*18;
      g.position.set(Math.cos(a)*rr, 5+rnd()*10, Math.sin(a)*rr);
      g.rotation.y=a+Math.PI/2; sc.add(g);
    }
    const basePad=new THREE.Mesh(new THREE.CircleGeometry(5,24),new THREE.MeshLambertMaterial({color:0x2f3236}));
    basePad.rotation.x=-Math.PI/2; basePad.position.set(0,.03,0); sc.add(basePad);
    const all=[]; list.forEach(b=>b.solids.forEach(s=>all.push(s)));
    worlds[md]={scene:sc, trees:tr, buildings:list, solids:all};
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
  sfx.levelup();
  setTimeout(()=>speakWord(w.en), 700);     // 🔊 อ่านคำที่ผสมสำเร็จ (รอแตรฉลองจบก่อน)
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(60);
  showBanner(`🎉 <b>${escapeHTML(w.en.toUpperCase())}</b> = ${escapeHTML(w.th)}<br><span class="adv-ban-coin">+${M.reward} 🪙</span>`);
  const fresh=pickWords(1);                 // เติมคำใหม่ให้ครบ 10 (8.4)
  fresh.forEach(nw=>{ words.push(nw); spawnLettersForWord(nw); });
  ensureCoverage();
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
   โหมด haunt: ผีโผล่ 20 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
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
  const px=camera.position.x, pz=camera.position.z;
  let hunted=null;
  monsters.forEach(g=>{
    const life=now-g.born;
    if(life>=M.ghostLife){ respawnGhost(g); return; }     // ครบ 20 วิ → หายไปเกิดที่ใหม่ (รอด!)
    // โปร่งใสตอนเกิด/ก่อนหาย (เตือนล่วงหน้า)
    const fadeIn=Math.min(1,life/600), fadeOut=Math.min(1,(M.ghostLife-life)/600);
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

/* ---------- โดนผีแตะ = เสียหัวใจ 1 ดวง (ไม่ตายทีเดียว) ---------- */
function renderHearts(){
  if(!hudHeartEl) return;
  if(mode!=='haunt'){ hudHeartEl.style.display='none'; return; }
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
  if(hauntLives<=0){ caught(); return; }         // หัวใจหมด → jump scare + จบเกมจริง
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
  showBanner(`💔 <b>โดนผีแตะ! เหลือ ${hauntLives} หัวใจ</b><br><small>รีบวิ่งหนีต่อ! หัวใจหมดเมื่อไรจบเกมนะ</small>`);
}

/* ---------- Jump scare + game over (ผู้ใช้เคาะ: เต็มที่) ---------- */
function caught(){
  if(!running) return;
  running=false;
  state.advHurt=true; saveState();
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
    banEl.innerHTML=`<div class="adv-ko">👻 โดนผีจับแล้ว!!<br>
      <small>ต้องกลับไปรักษาตัวที่ Lobby ค่ารักษา 🪙${fmtNum(CURE_COST)}<br>
      รอบนี้เก็บได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙</small>${sessionRecapHtml()}<br>
      <button class="adv-ko-btn" id="adv-ko-exit">🏠 กลับ Lobby</button></div>`;
    banEl.classList.add('show','stay');
    document.getElementById('adv-ko-exit').addEventListener('click',()=>exitWorld());
  },1500);
}

/* ---------- พลังหมดโหมด adv (8.5) ---------- */
function knockedOut(){
  running=false;
  state.advHurt=true; saveState();
  if(M.heli) HeliSound.stop();
  if(M.drive) CarSound.stop();
  banEl.innerHTML=`<div class="adv-ko">${M.koTitle||'💫 พลังหมดแล้ว!'}<br>
    <small>ต้องกลับไปรักษาตัวที่ Lobby ค่ารักษา 🪙${fmtNum(CURE_COST)}<br>
    รอบนี้เก็บได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙</small>${sessionRecapHtml()}<br>
    <button class="adv-ko-btn" id="adv-ko-exit">🏠 กลับ Lobby</button></div>`;
  banEl.classList.add('show','stay');
  document.getElementById('adv-ko-exit').addEventListener('click',()=>exitWorld());
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
    n:onlineDisplayName()+pilotEmoji(state.pilotBadge)+thunderEmoji(state.thunderBadge)+daredevilEmoji(state.daredevilBadge)+diligentEmoji(state.diligentBadge),   // 🎖️⚡🎯🏅 เข็มนักบิน+สายฟ้า+ผาดโผน+นักเล่นขยัน ติดท้ายชื่อ (เพื่อนเห็นทุกโลก)
    av:((M.drive||mode==='adv'||mode==='haunt')&&state.blockAv)?state.blockAv:(state.playerAvatar||''),   // 🧱 โลกขับรถ+โลกเดินส่งรหัสตัวบล็อก (ผ่าน validate เดิม string ≤8)
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
  const walkBlk=(mode==='adv'||mode==='haunt');   // 🧱 โลกเดิน: เพื่อน = หุ่นบล็อกเดินได้ (แทน sprite แบน)
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
  hudHpEl.style.width=hp+'%';
  hudHpEl.className='adv-hp-fill'+(hp<=30?' low':'');
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
  const rows=[{n:(state.profileName||'หนู')+pilotEmoji(state.pilotBadge)+thunderEmoji(state.thunderBadge)+daredevilEmoji(state.daredevilBadge)+diligentEmoji(state.diligentBadge), w:sessionWords, me:true}];
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
  .adv-heli #adv-cross{display:none}
  /* 🛸 โหมดโดรน FPV: OSD สีเขียวเรือง + เรติเคิลกรอบ + ขอบจอมืด (ฟีลกล้อง FPV) */
  .adv-drone #adv-inst{display:block;color:#7cff9d;font-family:'Courier New',monospace;letter-spacing:.5px;
    background:rgba(0,22,8,.4);border:1px solid rgba(124,255,157,.4);text-shadow:0 0 6px rgba(124,255,157,.75)}
  .adv-drone #adv-gauges,.adv-drone #adv-cockpit{display:none}
  .adv-drone #adv-cross{width:22px;height:22px;background:none;border:2px solid rgba(124,255,157,.85);
    border-radius:0;box-shadow:0 0 5px rgba(0,0,0,.85)}
  #adv-overlay.adv-drone:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;
    box-shadow:inset 0 0 130px 34px rgba(0,0,0,.5)}
  /* 🚗 โหมดขับรถกำแพงเพชร: แผงหน้าปัด+ฝากระโปรง (img/car/dash.png) + พวงมาลัยขวาหมุนจริง (img/car/wheel.png)
     รถพวงมาลัยขวาแบบเมืองไทย · ไม่มีภาพ → CSS จำลองทั้งคู่ (พวงมาลัยยังหมุนได้) */
  .adv-drive #adv-inst{display:block}
  .adv-drive #adv-cross{display:none}
  .adv-drive #adv-gauges,.adv-drive #adv-cockpit{display:none}
  #adv-cardash{position:absolute;left:0;right:0;bottom:0;pointer-events:none;display:none;z-index:3}
  .adv-drive #adv-cardash{display:block}
  #adv-cardash img{width:100%;display:block;max-height:42vh;object-fit:cover;object-position:50% 66%}
  /* เข็มหน้าปัดวิ่งจริง — canvas ทับตำแหน่งวงเกจของภาพ dash.png (อยู่เหนือแผง ใต้พวงมาลัย) */
  #adv-cargauges{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none;z-index:3}
  .adv-drive #adv-cargauges{display:block}
  #adv-cardash .cd-css{height:16vh;background:linear-gradient(180deg,#262a31,#101216);
    border-top:5px solid #343943;border-radius:26px 26px 0 0;margin:0 -2vw}
  /* พวงมาลัยขวาแบบไทย · จัดให้ "ช่องเปิดบนของพวงมาลัย" ตรงกับวงเกจ → มองเข็มลอดพวงมาลัยแบบรถจริง */
  #adv-carwheel{position:absolute;left:76.5%;bottom:-15vh;transform:translateX(-50%);
    width:min(44vh,50vw);aspect-ratio:1;pointer-events:none;display:none;z-index:4;will-change:transform}
  .adv-drive #adv-carwheel{display:block}
  #adv-carwheel img{width:100%;height:100%;display:block}
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
  #adv-cockpit{position:absolute;left:0;right:0;bottom:0;pointer-events:none;display:none;z-index:3}
  .adv-heli #adv-cockpit{display:block}
  #adv-cockpit img{width:100%;display:block;max-height:38vh;object-fit:cover;object-position:top}
  #adv-gauges{position:absolute;bottom:1vh;left:50%;transform:translateX(-50%);width:min(560px,72vw);
    pointer-events:none;display:none;z-index:4;filter:drop-shadow(0 3px 6px rgba(0,0,0,.55))}
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
  .adv-haunt .adv-recap-w small{color:#9fe8bf}`;
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
    <div class="adv-hud" id="adv-inst"></div>
    <div class="adv-hud" id="adv-warn"></div>
    <div id="adv-cockpit"></div>
    <div id="adv-cardash"></div>
    <canvas id="adv-cargauges"></canvas>
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
    <div class="adv-hud" id="adv-hint"></div>
    <div id="adv-intro"></div>`;
  document.body.appendChild(overlayEl);

  canvasEl=overlayEl.querySelector('#adv-canvas');
  dmgFlashEl=overlayEl.querySelector('#adv-dmg');
  hudBoardEl=overlayEl.querySelector('#adv-board');
  hudWordsEl=overlayEl.querySelector('#adv-words');
  hudInvEl=overlayEl.querySelector('#adv-inv');
  hudHpEl=overlayEl.querySelector('#adv-hp');
  hudCoinEl=overlayEl.querySelector('#adv-coin');
  hudHuntEl=overlayEl.querySelector('#adv-hunt');
  hudHeartEl=overlayEl.querySelector('#adv-hearts');
  banEl=overlayEl.querySelector('#adv-banner');
  scareEl=overlayEl.querySelector('#adv-scare');
  hintEl=overlayEl.querySelector('#adv-hint');
  introEl=overlayEl.querySelector('#adv-intro');
  mapCv=overlayEl.querySelector('#adv-map'); mapCtx=mapCv.getContext('2d');
  chatBoxEl=overlayEl.querySelector('#adv-chat-box');
  chatInputEl=overlayEl.querySelector('#adv-chat-input');
  selfMsgEl=overlayEl.querySelector('#adv-selfmsg');
  hudInstEl=overlayEl.querySelector('#adv-inst');
  hudWarnEl=overlayEl.querySelector('#adv-warn');
  nmPopEl=overlayEl.querySelector('#adv-nearmiss');
  comboFxEl=overlayEl.querySelector('#adv-combofx');
  cockpitEl=overlayEl.querySelector('#adv-cockpit');
  gaugeCtx=overlayEl.querySelector('#adv-gauges').getContext('2d');
  ATC.el=overlayEl.querySelector('#adv-radio');
  ATC.replyEl=overlayEl.querySelector('#adv-reply');
  ATC.replyEl.querySelectorAll('.adv-rp').forEach(b=>{
    b.addEventListener('click',()=>ATC.reply(+b.dataset.i));
  });
  // cockpit: ใช้ภาพ img/heli_cockpit.png ถ้าเจนแล้ว (PROMPTS_HELI.md) · ไม่มี → แผง CSS จำลอง
  // (เข็มที่ขยับจริงคือ canvas #adv-gauges วาดทับด้านหน้าเสมอ — รอบ 61)
  const cpImg=new Image();
  cpImg.onload=()=>{ cockpitEl.innerHTML=''; cockpitEl.appendChild(cpImg); };
  cpImg.onerror=()=>{ cockpitEl.innerHTML=`<div class="cp-css"></div>`; };
  cpImg.src='img/heli_cockpit.png';
  // 🚗 หน้าปัดรถ+พวงมาลัย: ใช้ภาพ img/car/dash.png + wheel.png ถ้าเจนแล้ว (PROMPTS_CAR.md) · ไม่มี → CSS จำลอง
  carDashEl=overlayEl.querySelector('#adv-cardash');
  carWheelEl=overlayEl.querySelector('#adv-carwheel');
  const cdImg=new Image();
  cdImg.onload=()=>{ carDashEl.innerHTML=''; carDashEl.appendChild(cdImg); carDashImg=cdImg; };
  cdImg.onerror=()=>{ carDashEl.innerHTML=`<div class="cd-css"></div>`; };
  cdImg.src='img/car/dash.png';
  carGaugeCv=overlayEl.querySelector('#adv-cargauges');
  carGaugeCtx=carGaugeCv.getContext('2d');
  const cwImg=new Image();
  cwImg.onload=()=>{ carWheelEl.innerHTML=''; carWheelEl.appendChild(cwImg); };
  cwImg.onerror=()=>{ carWheelEl.innerHTML=`<div class="cw-css"></div>`; };
  cwImg.src='img/car/wheel.png';
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

  overlayEl.querySelector('#adv-exit').addEventListener('click',confirmExit);
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
    keys[e.code]=true;
  });
  document.addEventListener('keyup',e=>{ keys[e.code]=false; });

  if(!IS_TOUCH){
    canvasEl.addEventListener('click',()=>{
      if(document.pointerLockElement===canvasEl) shoot();
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
      for(const t of e.changedTouches){
        if(t.target.closest('#adv-shoot,#adv-horn,#adv-exit,#adv-help,#adv-intro,#adv-banner,#adv-chat-btn,#adv-chat-box,.adv-vbtn,#adv-podium,#adv-reply,#adv-map,#adv-bigmap')) continue;  /* #adv-words เอาออก — เป็น pointer-events:none แล้ว นิ้วโดนคันบังคับได้ · รอบ 144: +map/bigmap */
        if(t.clientX<window.innerWidth*.45 && joyId===null){
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
          }else if(M.heli||M.drone){
            // โหมดบิน: ลากขวาแนวนอน = หันหัว · แนวตั้ง = ขึ้น/ลง (throttle/collective)
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
    if(Math.hypot(lp.x-camera.position.x,lp.z-camera.position.z)<PICK_DIST){
      const ch=letters[i].ch;
      inv[ch]=(inv[ch]||0)+1;
      removeLetter(i);
      sfx.coin();
      speakLetter(ch);                       // 🔠 อ่านชื่อตัวอักษร (เอ บี ซี)
      renderHudInv(); renderHudWords();
      tryCompleteWords();
    }
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
  hVel.y+=(col*DRONE_CLIMB - DRONE_GRAV)*dt;
  hVel.y*=Math.max(0,1-1.1*dt);
  const drag=Math.max(0,1-1.15*dt); hVel.x*=drag; hVel.z*=drag;
  const hs=Math.hypot(hVel.x,hVel.z);
  if(hs>DRONE_VMAX){ hVel.x*=DRONE_VMAX/hs; hVel.z*=DRONE_VMAX/hs; }

  const p={x:camera.position.x+hVel.x*dt, y:camera.position.y+hVel.y*dt, z:camera.position.z+hVel.z*dt};
  p.x=Math.max(-HALF+1.5,Math.min(HALF-1.5,p.x));
  p.z=Math.max(-HALF+1.5,Math.min(HALF-1.5,p.z));
  p.y=Math.min(62,p.y);
  if(p.y<DRONE_R){ p.y=DRONE_R; if(hVel.y<0) hVel.y*=-.2; }         // แตะพื้น = เด้งเบา
  const crashSpd=collideDrone(p);
  if(crashSpd>9 && now-hHitAt>900){ hHitAt=now; damagePlayer(14); DroneSound.thud(); nmCrashed=true; nmCombo=0; }
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
      const ch=letters[i].ch;
      inv[ch]=(inv[ch]||0)+1; removeLetter(i); sfx.coin(); speakLetter(ch);
      renderHudInv(); renderHudWords(); tryCompleteWords();
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

  if(hudInstEl){
    const spd=Math.round(Math.hypot(hVel.x,hVel.z)*3.6);
    hudInstEl.textContent=`🔴 REC · ▲ ${Math.max(0,p.y-DRONE_R).toFixed(0)}m · 🚀 ${spd} กม./ชม.`;
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
  if(now-tlChkAt<300) return;                        // เช็กทางแยกทุก 300ms พอ (sample 16 จุด/ครั้ง)
  tlChkAt=now;
  const inJ=Math.abs(dSpeed)>1.5 && driveCell(px,pz)===1 && driveArms(px,pz)>=3;
  if(inJ && !tlInJunc){
    if(now<tlCoolAt) return;                         // เพิ่งออกจากแยกก่อนหน้า — เว้นระยะกันนับซ้อน
    tlInJunc=true; tlYawEnter=yaw; tlSigSeen=tlSig!==0;
  }else if(tlInJunc){
    if(tlSig) tlSigSeen=true;
    if(!inJ){
      tlInJunc=false; tlCoolAt=now+3000;
      let dy=yaw-tlYawEnter; dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
      if(Math.abs(dy)>.79 && !tlSigSeen && carFines.filter(f=>f.t==='signal').length<5){
        carFines.push({t:'signal', fine:CAR_FINE_SIGNAL});
        sfx.wrong();
        showBanner(`🚨 เลี้ยวไม่ให้สัญญาณไฟเลี้ยว! ผิด พ.ร.บ.จราจรทางบก <b>มาตรา 36</b><br>
          <small>(กฎหมายจริง: ปรับไม่เกิน 1,000 บาท) ใบสั่ง 🪙${CAR_FINE_SIGNAL} หักตอนออกจากเกม · โดนแล้ว ${carFines.filter(f=>f.t==='signal').length} ใบ<br>คราวหน้ากดปุ่ม ⬅️ ➡️ ก่อนเลี้ยวนะ</small>`);
      }
    }
  }
}
/* ============================================================
   🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
   เฟสไฟคำนวณจากนาฬิกาเครื่อง (Date.now) — ทุกเครื่องเห็นสีเดียวกันโดยไม่ต้อง sync ผ่าน DB
   เขียว 10 วิ → เหลือง 3 วิ → แดง 11 วิ (รอบ 24 วิ · seed ต่อแยก ไฟไม่เปลี่ยนพร้อมกันทั้งเมือง)
   ============================================================ */
const TL_CYCLE=24, TL_GREEN=10, TL_YELLOW=3;
function tlightPhase(seed,nowMs){
  if(rlForce!=null) return rlForce;                        // testkit บังคับเฟส (0=เขียว 1=เหลือง 2=แดง)
  const t=((nowMs||Date.now())/1000+seed*5.31)%TL_CYCLE;
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
    tlMats={pole:new THREE.MeshLambertMaterial({color:0x37474f}),
      head:new THREE.MeshLambertMaterial({color:0x1d262c}),
      on: [B(0x35d94f),B(0xffc107),B(0xff2f26)],           // ติด: เขียว/เหลือง/แดง (index = เฟส)
      off:[B(0x0e3a19),B(0x4a3a08),B(0x3a0e0b)]};          // ดับ: สีหม่นของดวงเดียวกัน
  }
  const poleG=new THREE.CylinderGeometry(.09,.13,5.2,6);
  const headG=new THREE.BoxGeometry(.6,1.75,.45);
  const lampG=new THREE.SphereGeometry(.22,10,8);
  const LAMP_Y=[4.95,5.5,6.05];                            // เขียวล่าง-เหลืองกลาง-แดงบน (แบบไฟจริง)
  D.tlights=spots.map((s,i)=>{
    let px=s.x+8, pz=s.z+8;                                // เสาตั้งริมถนน — หาช่องนอกถนนรอบแยก
    for(let a=0;a<8;a++){
      const qx=s.x+Math.cos(a*Math.PI/4)*9, qz=s.z+Math.sin(a*Math.PI/4)*9;
      if(driveCell(qx,qz)===0){ px=qx; pz=qz; break; }
    }
    const g=new THREE.Group();
    const pole=new THREE.Mesh(poleG,tlMats.pole); pole.position.y=2.6; g.add(pole);
    const head=new THREE.Mesh(headG,tlMats.head); head.position.y=5.5; g.add(head);
    const lamps=[0,1,2].map(k=>{
      const m=new THREE.Mesh(lampG,tlMats.off[k]);
      m.position.set(0,LAMP_Y[k],0); g.add(m); return m;   // ทรงกลม — เห็นสีได้จากทุกทิศของแยก
    });
    g.position.set(px,0,pz);
    scene.add(g);
    return {x:s.x, z:s.z, seed:i, lamps, st:-1};
  });
}
/* อัปเดตสีไฟ (ทุก ~250ms สลับ material ที่แชร์กัน) + ตรวจฝ่าไฟแดง: อยู่ในโซนแยกไฟแดง + ยังวิ่ง >10 กม./ชม. */
function rlTick(px,pz,now){
  const D=worlds.drive.d;
  if(!D.tlights || !D.tlights.length) return;
  if(now-rlChkAt<250) return;
  rlChkAt=now;
  const nowMs=Date.now();
  for(const L of D.tlights){
    const ph=tlightPhase(L.seed,nowMs);
    if(L.st!==ph){ L.st=ph; L.lamps.forEach((m,k)=>{ m.material=k===ph?tlMats.on[k]:tlMats.off[k]; }); }
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
  const vmax=onRoad===1?CAR_VMAX:CAR_VMAX_OFF;
  if(th>0) dSpeed+=CAR_ACCEL*(onRoad===1?1:.55)*th*dt;
  else if(th<0){
    if(dSpeed>.3) dSpeed=Math.max(0,dSpeed-CAR_BRAKE*dt);          // เบรกก่อน
    else dSpeed=Math.max(-CAR_VREV,dSpeed+CAR_ACCEL*.7*th*dt);     // จอดแล้วกดค้าง = ถอยหลัง
  }
  if(padBr) dSpeed=dSpeed>0?Math.max(0,dSpeed-CAR_BRAKE*1.2*dt)    // 🦶 รอบ 139: ปุ่มเบรค — หน่วงเข้าหา 0 ทั้งเดินหน้า/ถอยหลัง
                           :Math.min(0,dSpeed+CAR_BRAKE*1.2*dt);
  dSpeed*=Math.max(0,1-(onRoad===1?.16:1.15)*dt);                  // แรงต้าน (รอบ 128: ลดลงให้ไต่ถึง 200 กม./ชม. ได้)
  if(dSpeed>vmax) dSpeed=Math.max(vmax,dSpeed-CAR_BRAKE*.8*dt);

  /* 🏁 พวงมาลัยฟีล R4: ไต่เข้าโค้งนุ่ม (attack ช้ากว่า release) + ลดองศาตามความเร็วพอประมาณ */
  const tgt=sd*CAR_STEER_MAX/(1+Math.abs(dSpeed)*.045);
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
        }else if(state.car && state.car.insured){
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
      const ch=letters[i].ch;
      inv[ch]=(inv[ch]||0)+1; removeLetter(i); sfx.coin(); speakLetter(ch);
      renderHudInv(); renderHudWords(); tryCompleteWords();
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.7)+Math.sin(now/380+l.spr.position.x*2)*.14; });

  // พวงมาลัยหมุนตามจริง (ภาพ img/car/wheel.png หรือวง CSS)
  if(carWheelEl) carWheelEl.style.transform='translateX(-50%) rotate('+(dSteer*440).toFixed(1)+'deg)';

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
  drawCarGauges();
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
  if(!carDashImg||!carDashImg.parentNode) return;           // ยังไม่มีภาพจริง → แผง CSS ไม่มีวงเกจ ไม่วาด
  const box=carDashImg.getBoundingClientRect();
  if(!box.width) return;
  const s=box.width/1536;                                   // cover แนวกว้างชนะเสมอ (landscape)
  const offY=Math.max(0,1024*s-box.height)*.66;             // object-position 50% 66%
  const gx=ix=>box.left+ix*s, gy=iy=>box.top+iy*s-offY;
  const kmh=Math.abs(dSpeed)*3.6;
  drawCarDial(c, gx(1096),  gy(662), 80*s, kmh/240, 240, 40, CAR_LEGAL_KMH);  // สปีด 0-240 (รอบ 128 · โซนแดง = เกิน 90 ผิดกฎหมาย)
  drawCarDial(c, gx(1258.5),gy(662), 78*s, .1+(CarSound.rpm||0)*.75, 8, 1, 6.5);  // วัดรอบ (idle ~0.8)
}
/* ============================================================
   🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
   ============================================================ */
function carStartShow(){                       // เด้งทุกครั้งที่เข้าโลกขับรถ — เครื่องดับ/ยังไม่คาดเข็มขัด
  const p=document.getElementById('adv-carstart');
  if(!p) return;
  carStartOpen=true;
  p.style.display='block';
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
    if(!this.on) return;
    try{ this.osc.stop(); this.osc2.stop(); }catch(e){}
    this.osc=this.osc2=null; this.on=false;
  },
};

function heliFloorAt(x,z){
  let f=0;
  for(const b of buildings){
    if(Math.abs(x-b.x)<=b.w/2+.4 && Math.abs(z-b.z)<=b.d/2+.4 && b.h>f) f=b.h;
  }
  return f;
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
    if(col>.25 && HeliSound.ready){ hLanded=false; hVel.y=2.5; }  // เทคออฟได้เมื่อสตาร์ทเครื่องเสร็จ
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
        hLanded=true; hVel={x:0,y:0,z:0}; sfx.select(); HeliSound.thud(.4);
        if(Math.random()<.35) ATC.say('Beautiful landing, captain. Very smooth!');   // 📻 หอชมเป็นครั้งคราว
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
      if(Math.hypot(lp.x-nx,lp.z-nz)<3.6 && Math.abs((letters[i].baseY-1.3)-floor)<2){
        const ch=letters[i].ch;
        inv[ch]=(inv[ch]||0)+1;
        removeLetter(i);
        sfx.coin();
        speakLetter(ch);                     // 🔠 อ่านชื่อตัวอักษร (เอ บี ซี)
        renderHudInv(); renderHudWords();
        tryCompleteWords();
      }
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });

  // ---- ระบบเตือนภัยใกล้ชน (proximity warning — บี๊บถี่ขึ้นตามระยะ + ไฟแดงกะพริบ) ----
  hWarnLvl=0; let warnMsg='';
  if(!hLanded && HeliSound.ready){
    let wallDist=99;
    for(const b of buildings){
      if(ny>b.h+.8) continue;                          // อยู่เหนือยอดตึกนี้แล้ว ไม่มีทางชน
      const dx=Math.max(0,Math.abs(nx-b.x)-b.w/2);
      const dz=Math.max(0,Math.abs(nz-b.z)-b.d/2);
      const dw=Math.hypot(dx,dz);
      if(dw<wallDist) wallDist=dw;
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
      hudInstEl.textContent='🔑 กำลังสตาร์ทเครื่องยนต์... รอใบพัดหมุนเต็มรอบ';
    }else{
      const spd=Math.round(Math.hypot(hVel.x,hVel.z)*3.6);
      const stk=(state.heliStreak||0)>0?` · 🎖️ สตรีค ${state.heliStreak}`:'';
      hudInstEl.textContent=`⛰️ ${Math.max(0,ny-HELI_SKID).toFixed(0)}m · 🚀 ${spd} กม./ชม.${stk} ${hLanded?'· 🛬 จอดแล้ว':''}`;
    }
  }
  HeliSound.update(col,hLanded,dt);
  drawGauges();
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
function gaugeBezel(c,cx,cy,r){
  c.beginPath(); c.arc(cx,cy,r,0,7);
  c.fillStyle='#14171d'; c.fill();
  c.lineWidth=4; c.strokeStyle='#465061'; c.stroke();
}
function gaugeTicks(c,cx,cy,r,n){
  c.strokeStyle='#8fa0b5'; c.lineWidth=2;
  for(let i=0;i<n;i++){
    const a=-Math.PI*.75 + i*(Math.PI*1.5)/(n-1);
    c.beginPath();
    c.moveTo(cx+Math.sin(a)*(r-6),cy-Math.cos(a)*(r-6));
    c.lineTo(cx+Math.sin(a)*(r-13),cy-Math.cos(a)*(r-13));
    c.stroke();
  }
}
function gaugeNeedle(c,cx,cy,r,frac,color){
  const a=-Math.PI*.75 + Math.max(0,Math.min(1,frac))*Math.PI*1.5;
  c.strokeStyle=color; c.lineWidth=3.5; c.lineCap='round';
  c.beginPath(); c.moveTo(cx-Math.sin(a)*10,cy+Math.cos(a)*10);
  c.lineTo(cx+Math.sin(a)*(r-16),cy-Math.cos(a)*(r-16)); c.stroke();
  c.beginPath(); c.arc(cx,cy,4.5,0,7); c.fillStyle='#e0e4ea'; c.fill();
}
function gaugeText(c,cx,cy,r,label,val){
  c.textAlign='center'; c.fillStyle='#9fb2c8'; c.font='700 10px Arial';
  c.fillText(label,cx,cy-r+22);
  c.fillStyle='#fff'; c.font='900 14px Arial';
  c.fillText(val,cx,cy+r-14);
}
function drawGauges(){
  if(!gaugeCtx) return;
  const c=gaugeCtx, R=56;
  c.clearRect(0,0,620,130);
  const cy=65, xs=[64,187,310,433,556];
  // SPD (0–70 กม./ชม.)
  const spd=Math.hypot(hVel.x,hVel.z)*3.6;
  gaugeBezel(c,xs[0],cy,R); gaugeTicks(c,xs[0],cy,R,8);
  gaugeNeedle(c,xs[0],cy,R,spd/70,'#ffb74d');
  gaugeText(c,xs[0],cy,R,'SPD',Math.round(spd)+'');
  // ATT เส้นขอบฟ้าเทียม — ก้มหัว = เห็นพื้นดินมากขึ้น (ขอบฟ้าเลื่อนขึ้น) · เอียงข้าง = ขอบฟ้าเอียง
  const ax=xs[1];
  c.save();
  c.beginPath(); c.arc(ax,cy,R-3,0,7); c.clip();
  c.translate(ax,cy);
  c.rotate(hTiltS*.5);
  const hy=-hTiltF*34;                          // เชิดหัว (fw<0) → ขอบฟ้าลง เห็นฟ้ามากขึ้น
  c.fillStyle='#58b6e8'; c.fillRect(-R,-R*2,R*2,R*2+hy);      // ท้องฟ้า
  c.fillStyle='#a1887f'; c.fillRect(-R,hy,R*2,R*2);           // พื้นดิน
  c.strokeStyle='#fff'; c.lineWidth=2.5;
  c.beginPath(); c.moveTo(-R,hy); c.lineTo(R,hy); c.stroke(); // เส้นขอบฟ้า
  c.lineWidth=1.5;                                            // ขีดพิตช์ ±
  [-22,22].forEach(o=>{ c.beginPath(); c.moveTo(-14,hy+o); c.lineTo(14,hy+o); c.stroke(); });
  c.restore();
  c.beginPath(); c.arc(ax,cy,R-2,0,7);          // วงขอบ
  c.lineWidth=4; c.strokeStyle='#465061'; c.stroke();
  c.strokeStyle='#ff9800'; c.lineWidth=3.5; c.lineCap='round'; // สัญลักษณ์เครื่องบิน (ตรึงกลาง)
  c.beginPath(); c.moveTo(ax-22,cy); c.lineTo(ax-8,cy); c.lineTo(ax-4,cy+5); c.stroke();
  c.beginPath(); c.moveTo(ax+22,cy); c.lineTo(ax+8,cy); c.lineTo(ax+4,cy+5); c.stroke();
  c.beginPath(); c.arc(ax,cy,2.5,0,7); c.fillStyle='#ff9800'; c.fill();
  // ALT (0–60m)
  const alt=Math.max(0,camera.position.y-HELI_SKID);
  gaugeBezel(c,xs[2],cy,R); gaugeTicks(c,xs[2],cy,R,7);
  gaugeNeedle(c,xs[2],cy,R,alt/60,'#4fc3f7');
  gaugeText(c,xs[2],cy,R,'ALT',Math.round(alt)+'m');
  // V/S อัตราไต่-ลด (±10 m/s · กลาง=0)
  gaugeBezel(c,xs[3],cy,R); gaugeTicks(c,xs[3],cy,R,9);
  gaugeNeedle(c,xs[3],cy,R,(hVel.y+10)/20, hVel.y<-5?'#ef5350':'#aed581');
  gaugeText(c,xs[3],cy,R,'V/S',(hVel.y>=0?'+':'')+hVel.y.toFixed(1));
  // RPM (0–150% · โซนเขียว/เหลือง/แดง)
  const rx=xs[4];
  gaugeBezel(c,rx,cy,R);
  [['#66bb6a',.35,1.0],['#ffd54f',1.0,1.25],['#ef5350',1.25,1.5]].forEach(([col,f1,f2])=>{
    c.beginPath();
    c.arc(rx,cy,R-9,-Math.PI*.75-Math.PI/2+(f1/1.5)*Math.PI*1.5,-Math.PI*.75-Math.PI/2+(f2/1.5)*Math.PI*1.5);
    c.strokeStyle=col; c.lineWidth=5; c.lineCap='butt'; c.stroke();
  });
  gaugeNeedle(c,rx,cy,R,HeliSound.rpm/1.5,'#ffb74d');
  gaugeText(c,rx,cy,R,'RPM',Math.round(HeliSound.rpm*100)+'%');
}

/* ---------- เสียงใบพัด Bell — สังเคราะห์ (ปลอดลิขสิทธิ์) · มีไฟล์ sound/heli_rotor.mp3 ใช้แทนอัตโนมัติ ---------- */
const HeliSound={
  ctx:null,master:null,lfo:null,whine:null,whineG:null,nodes:[],
  files:{start:null,rotor:null,high:null},probed:false,on:false,
  ready:false,rpm:0,_startTm:0,highOn:false,
  probe(){
    if(this.probed) return; this.probed=true;
    // 3 ไฟล์อัปเกรดจาก Suno (PROMPTS_HELI.md): สตาร์ทเครื่อง / ลูปบินปกติ / ลูปเร่งเครื่องเต็มกำลัง
    [['start','sound/heli_start.mp3'],['rotor','sound/heli_rotor.mp3'],['high','sound/heli_rotor_high.mp3']].forEach(([k,src])=>{
      const a=new Audio();
      a.addEventListener('canplaythrough',()=>{ this.files[k]=a; },{once:true});
      a.preload='auto'; a.src=src;
    });
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
    this.on=true; this.ready=false; this.rpm=0; this.highOn=false;
    this.probe();
    if(!state.sound){ this.ready=true; this.rpm=.55; return; }   // ปิดเสียง = ข้ามซีเควนซ์ บินได้เลย
    if(this.files.start){
      const a=this.files.start;
      a.currentTime=0; a.volume=.85; a.play().catch(()=>{});
      const durMs=Math.min(((a.duration||5)*1000)||5000, 9000);
      this._startTm=setTimeout(()=>{ this.ready=true; this.rpm=.55; this.loopStart(); },durMs);
      return;
    }
    // สังเคราะห์: เทอร์ไบน์สปูลขึ้น + ใบพัดค่อยๆ หมุนเร็วขึ้น ~3.5 วิ
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
  loopStart(){                   // จบไฟล์สตาร์ท → เข้าลูปบิน (ไฟล์ถ้ามี · ไม่มีใช้สังเคราะห์)
    if(!state.sound) return;
    if(this.files.rotor){
      this.files.rotor.loop=true; this.files.rotor.volume=.55;
      this.files.rotor.play().catch(()=>{});
      if(this.files.high){
        this.files.high.loop=true; this.files.high.volume=0;
        this.files.high.play().catch(()=>{});
      }
    }else{
      this.buildNodes();
      this.master.gain.value=.4;
      this.whine.frequency.value=380; this.whineG.gain.value=.05;
      this.lfo.frequency.value=10.5;
    }
  },
  update(col,landed,dt){
    if(!this.on) return;
    if(!state.sound){ this.stop(); this.on=true; this.ready=true; return; }  // ปิดเสียงกลางคัน: เงียบแต่ยังบินได้
    if(!this.ready) return;                       // ระหว่างสตาร์ทเครื่อง ไม่ปรับ RPM
    // โมเดล RPM มีแรงเฉื่อย: เร่ง/เบาเครื่องค่อยเป็นค่อยไป (สมจริง ไม่กระโดด)
    const target=landed?.55:(1+Math.max(0,col)*.45);
    this.rpm+=(target-this.rpm)*Math.min(1,(dt||.016)*.9);
    const r=this.rpm;
    if(this.files.rotor){
      this.files.rotor.playbackRate=.8+r*.35;
      if(this.files.high){
        const hi=Math.max(0,Math.min(1,(r-.85)/.5));   // crossfade ลูปปกติ ↔ ลูปเร่งเครื่อง
        this.files.high.playbackRate=.9+r*.2;
        this.files.high.volume=.7*hi;
        this.files.rotor.volume=.55*(1-hi*.75);
      }else{
        this.files.rotor.volume=.3+r*.3;
      }
      return;
    }
    if(this.lfo) this.lfo.frequency.value=6.5+r*6.5;
    if(this.whine){ this.whine.frequency.value=230+r*360; this.whineG.gain.value=.02+r*.05; }
    if(this.master) this.master.gain.value=.18+r*.32;
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
    clearTimeout(this._startTm);
    Object.values(this.files).forEach(f=>{ if(f) f.pause(); });
    this.nodes.forEach(n=>{ try{ n.stop(); }catch(e){} });
    this.nodes=[]; this.lfo=null; this.whine=null; this.whineG=null;
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
function loop(){
  if(!running) return;
  rafId=requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.1), now=performance.now();
  if(M.heli){ tickHeli(dt,now); }
  else if(M.drone){ tickDrone(dt,now); }
  else if(M.drive){ tickDrive(dt,now); }
  else{
    tickPlayer(dt,now);
    if(M.ghost){ tickGhosts(dt,now); }
    else{
      tickMonsters(dt,now);
      tickShots(dt);
      if(now-lastSpawn>M.monSpawnMs){ lastSpawn=now; spawnMonster(); }
    }
  }
  if(now-lastEnsure>5000){ lastEnsure=now; relocateLetters(now); ensureCoverage(); }
  tickPeers(dt,now);
  sendPos(false);
  drawMinimap();
  renderer.render(scene,camera);
}

/* ============================================================
   เข้า/ออกโลก
   ============================================================ */
function clearEntities(){
  ghostGen++;                                      // ออก/เปลี่ยนด่าน → ยกเลิก spawn ผีที่ยังรอภาพโหลดค้างอยู่
  while(letters.length) removeLetter(0);
  monsters.forEach(m=>{ scene.remove(m.spr); m.spr.material.dispose(); }); monsters=[];
  shots.forEach(s=>{ scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); }); shots=[];
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
    goal:'เก็บตัวอักษรต่อคำเหมือนโลกอื่น แต่ <b>สู้ผีไม่ได้</b>! ผีเข้าใกล้เมื่อไร <b>ต้องวิ่งหนี</b> — โดนจับ = จบเกมทันที',
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

function start(md){
  mode=(md==='haunt'||md==='heli'||md==='drone'||md==='drive')?md:'adv';
  M=MODES[mode];
  if(mode==='adv' && !state.advTicket){ toast('🎫 ต้องมีตั๋วโลกผจญภัยก่อนนะ'); return; }
  if(mode==='haunt' && !state.hauntTicket){ toast('🎃 ต้องมีตั๋วโลกผีสิงก่อนนะ'); return; }
  if(mode==='heli' && !state.heliTicket){ toast('🚁 ต้องมีตั๋วโลกเฮลิคอปเตอร์ก่อนนะ'); return; }
  if(mode==='drone' && !state.droneTicket){ toast('🛸 ต้องมีตั๋วโลกโดรน FPV ก่อนนะ'); return; }
  if(mode==='drive' && !state.driveTicket){ toast('🚗 ต้องมีตั๋วโลกขับรถกำแพงเพชรก่อนนะ'); return; }
  if(mode==='drive' && !window.KPP_CITY){ toast('🗺️ แผนที่เมืองยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ'); return; }
  if(state.advHurt){ toast('🤕 ยังบาดเจ็บอยู่ ต้องรักษาตัวก่อนเข้าโลก 3D'); return; }

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
  solids=worlds[mode].solids||[];

  hp=100; sessionCoins=0; sessionWords=0; sessionWordLog=[]; inv={}; keys={}; yaw=0; pitch=0;
  hauntLives=HAUNT_LIVES; hurtUntil=0;                                 // 👻 รีเซ็ตหัวใจโลกผี
  nmActive=false; nmMin=99; nmCrashed=false; nmCombo=0; nmLastAt=0;    // 💨 รีเซ็ตโบนัสบินเฉียด
  if(M.heli){
    camera.position.set(0,HELI_SKID,0);            // เริ่มบนลานจอดกลางเมือง
    hVel={x:0,y:0,z:0}; hCol=0; hLanded=true; hHitAt=0; hWarnLvl=0;
    hAtcCleared=false; ATC.reset();
    if(hudWarnEl) hudWarnEl.style.display='none';
  }else if(M.drone){
    camera.position.set(0,10,0);                   // เริ่มลอยเหนือลานกลาง (ลานว่าง gx=gz=0) รอบตัวเป็นตึกร้าง
    hVel={x:0,y:0,z:0}; hCol=0; hHitAt=0; hWarnLvl=0; hTiltF=0; hTiltS=0;
    if(hudWarnEl) hudWarnEl.style.display='none';
  }else if(M.drive){
    const sp=worlds.drive.d.spawn;                 // เกิดบนถนนใหญ่ข้างวงเวียนหอนาฬิกา หันตามแนวถนน
    camera.position.set(sp.x,CAR_EYE,sp.z); yaw=sp.yaw;
    dSpeed=0; dSteer=0; dLook=0; hHitAt=0; carStreet=''; carNameAt=0;
    dRoll=0; dRollV=0;                             // 🏎️ รอบ 142: ตัวถังเริ่มนิ่งตรง
    dVelX=0; dVelZ=0; dCamYaw=sp.yaw;              // 🏁 R4: ทิศไถล+กล้องหน่วง เริ่มตรงหัวรถ
    padSteer=0; padSt=false; padTh=false;          // 🎛️ รอบ 127: ล้างสถานะปุ่มคอนโซลทุกครั้งที่เข้าโลก
    padBr=false; gearR=false; if(gearSyncFn) gearSyncFn();  // 🦶⚙️ รอบ 139: ล้างเบรค + เกียร์กลับ D ทุกครั้งที่เข้าโลก
    // 🚔 รอบ 128: รีเซ็ตกฎจราจร + เด้งแผงสตาร์ทเครื่อง/คาดเข็มขัดก่อนออกรถ
    carEngineOn=false; carBelted=false; carFines=[]; carOverSpeed=false; carBeltFined=false; carLawSeen=false;
    // 🚦 รอบ 132: รีเซ็ตไฟเลี้ยว + ตัวตรวจทางแยก + ชนรถเพื่อน (netTlOk คืน true เผื่อผู้ใช้เพิ่ง publish rules)
    tlSet(0); tlInJunc=false; tlChkAt=0; tlCoolAt=0; carPeerHitAt=0; netTlOk=true;
    // 🚦 รอบ 133: รีเซ็ตตัวนับเจตนาชน + ไฟแดง แล้วปักไฟจราจรตามแยกใหญ่ (ครั้งแรกครั้งเดียว)
    carPeerHits=0; rlChkAt=0; rlCoolAt=0; rlForce=null;
    buildTrafficLights();
    carStartShow();
  }else{
    camera.position.set(0,EYE_H,0);
  }
  camera.far=M.drive?800:220; camera.updateProjectionMatrix();   // เมืองจริงต้องมองไกล
  if(!Array.isArray(state[M.doneKey])) state[M.doneKey]=[];
  words=pickWords(GUIDE_WORDS);
  words.forEach(spawnLettersForWord);
  for(let i=0;i<8;i++) spawnLetter('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]);
  if(M.ghost){
    probeGhostImages();
    const gen=ghostGen;                            // ปล่อยผีเฉพาะตอนภาพโหลดเสร็จ (ยังโหลด=ด่านว่างไว้ก่อน ไม่โผล่ emoji)
    let spawned=false;
    const spawnAll=()=>{ if(spawned||gen!==ghostGen) return; spawned=true; for(let i=0;i<M.ghostMax;i++) spawnGhost(true); };
    whenGhostsReady(spawnAll);
    setTimeout(spawnAll, 9000);                     // กันเหนียว: ภาพค้างเกิน 9 วิ (เน็ตแย่/หาย) → ปล่อยไปก่อน (ด่านต้องมีผีเสมอ)
  }
  else if(!M.heli && !M.drone && !M.drive) spawnMonster();
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  scareEl.classList.remove('on');
  overlayEl.classList.toggle('adv-haunt',mode==='haunt');
  overlayEl.classList.toggle('adv-heli',mode==='heli');
  overlayEl.classList.toggle('adv-drone',mode==='drone');
  overlayEl.classList.toggle('adv-drive',mode==='drive');
  if(mode==='heli') HeliSound.start();
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
  if(introSeen(mode)){
    beginPlay();
    showBanner(M.intro);
  }else{
    renderer.render(scene,camera);      // แสดงฉากไว้ข้างหลังการ์ด (ยังไม่เดินลูป/พักเกม)
    showIntro(mode,false);              // การ์ดวิธีเล่นครั้งแรก — กด "เริ่มเล่น" แล้วค่อย beginPlay
  }
}

function exitWorld(){
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
  netLeave();
  HSound.stopAll();
  HeliSound.stop();
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
  saveState();
  renderDashboard();
  if(sessionWords>0 || sessionCoins>0)
    toast(`${M.emoji} กลับจาก${M.label} — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
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
                        ads:(worlds.heli&&worlds.heli.ads)||[], atc:ATC}; },
    get drone(){ return {vel:hVel, col:hCol, buildings, solids, warn:hWarnLvl,
                         rpm:DroneSound.rpm, sound:DroneSound, collide:collideDrone}; },
    get drive(){ return {get speed(){return dSpeed}, get steer(){return dSteer}, get street(){return carStreet},
                         d:worlds.drive&&worlds.drive.d, cell:driveCell, collide:collideCar,
                         sound:CarSound, wheelEl:carWheelEl, dashEl:carDashEl,
                         // 🚦 รอบ 132: testkit ไฟเลี้ยว/ทางแยก/ใบสั่ง
                         get tl(){return tlSig}, setTl:tlSet, arms:driveArms,
                         get fines(){return carFines}, get inJunc(){return tlInJunc},
                         get yaw(){return yaw}, set yaw(v){yaw=v;},
                         // 🚦 รอบ 133: testkit ไฟจราจร/เจตนาชน
                         get lights(){return worlds.drive.d.tlights}, forceLight(v){rlForce=v; rlChkAt=0;},
                         get peerHits(){return carPeerHits}, phase:tlightPhase}; },
    set col(v){ hCol=v; },
    set landed(v){ hLanded=v; },
    setKeys(o){ keys=o||{}; },
    setDriveSpeed(v){ dSpeed=v; },   // 🚔 รอบ 128: testkit — inject ความเร็วตรงๆ (เทสต์ใบสั่ง/เกจ ไม่ต้องขับตามถนนจริง)
    step(dt){                        // เดินเกม 1 เฟรมเอง — rAF ไม่ fire ใน preview ที่มองไม่เห็นหน้าต่าง
      const now=performance.now(); dt=dt||.016;
      if(M.heli){ tickHeli(dt,now); }
      else if(M.drone){ tickDrone(dt,now); }
      else if(M.drive){ tickDrive(dt,now); }
      else{
        tickPlayer(dt,now);
        if(M.ghost) tickGhosts(dt,now); else { tickMonsters(dt,now); tickShots(dt); }
      }
      tickPeers(dt,now); drawMinimap(); renderer.render(scene,camera);
    },
  },
};
})();
