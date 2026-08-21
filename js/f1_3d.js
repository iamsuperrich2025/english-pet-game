/* 🏎️ f1_3d.js — โลกแข่งรถ F1 "สนามซาเคียร์" Bahrain International Circuit (รอบ 896)
   ─────────────────────────────────────────────────────────────────────
   · แทร็กจริงจาก OpenStreetMap (js/data/f1_bahrain.js — GP Circuit 5,400 ม. ครบ 15 โค้ง)
     + ผังอาคารจริง: Main Grandstand / Batelco / First Turn / Victory / University / Sakhir Tower / พิท
   · ฟิสิกส์โมเมนตัมจริง: แรงเครื่อง∝กำลัง/ความเร็ว · แรงต้านอากาศ v² · downforce เพิ่มกริปตามความเร็ว
     ยางมีลิมิตแรงเข้าโค้ง — เร็วเกิน = ไถล (understeer/drift) · ออกนอกแทร็ก = runoff → ทราย ลื่น+หน่วง
   · บรรยากาศ night race ใต้แสงไฟสปอตไลต์ (เอกลักษณ์สนามนี้) + ทะเลทราย + ต้นปาล์ม
   · เก็บตัวอักษรบนแทร็กประกอบคำ (REWARD 60🪙) + จับเวลาต่อรอบ / Best Lap (state.f1Best)
   · 🚦 ออกสตาร์ทจริง (รอบ 902): ไฟแดง 5 ดวงบนซุ้มติดทีละดวง → ดับพร้อมกัน = ออกตัว (ล็อกคันเร่งก่อนไฟดับ)
   · 👻 รถเงา (รอบ 902): บันทึกเส้นทาง Best Lap ลง localStorage แล้วปล่อยรถโปร่งแสงวิ่งซ้ำให้ไล่แข่งกับตัวเอง
   · multiplayer ผ่าน NetRoom map 'f1' (สนามละ 10 คน) — เห็นรถเพื่อน+ชื่อ+แชท+กระดานคำ
   · โมเดลรถ: โหลด img/models/f1_car.glb ถ้ามี (ผู้ใช้จะหามาวาง) — ไม่มี = รถ F1 ประกอบเอง (nose/ปีก/halo/ล้อหมุน)
   · สิ่งปลูกสร้างเป็น modular 3D + clean material; ไม่ใช้ภาพถ่าย facade/crowd/pit/tower แปะบนโมเดล
   · เข้าโลก: js/ui.js enterF1_3D (WORLD3D แถว f1) · ห้ามแตะไฟล์นี้จาก moto3d (คนละ engine)
   ───────────────────────────────────────────────────────────────────── */
(function(){
'use strict';

/* ============================================================
   ⚙️ ค่าคงที่ (TUNE ZONE)
   ============================================================ */
const REWARD       = 60;      // 🪙 ประกอบคำสำเร็จ
const LETTER_COIN  = 2;       // 🪙 เก็บตัวอักษร 1 ตัว
const COLLECT_R    = 8;       // รัศมีเก็บ (รถเร็ว ต้องกว้าง)
const DONE_KEY     = 'f1Done';
const HALF_W       = 7.5;     // ครึ่งความกว้างแทร็ก (เมตร) — F1 จริง 12-15ม.
const KERB_W       = 1.6;     // ความกว้างขอบ kerb
const RUNOFF_W     = 9;       // runoff ยางมะตอยข้างแทร็ก (สไตล์ Bahrain)
const BARRIER_LAT  = HALF_W+RUNOFF_W-.55; // จุดชนจริงอยู่ด้านในกำแพงเล็กน้อย กันรถเร็วทะลุ mesh
const BARRIER_BOUNCE=.48;     // คืนแรงด้านข้าง 48% ให้รู้สึกว่าเด้ง แต่ไม่ปิงปองรุนแรง
const SAMPLE_M     = 5;       // ระยะห่างจุด sample เส้นแทร็ก
/* 🪖 มุมมองในห้องคนขับ (รอบ 901) — ภาพหลัก first-person + ปุ่ม 📷 สลับมุมเห็นทั้งคัน */
const FP_EYE   = 1.04;   // ความสูงสายตาคนขับ (ม.)
const FP_FWD   = 0.5;    // ตำแหน่งหัวเยื้องไปหน้ารถจากจุดกลาง (ม.)
const FP_LOOK  = 17;     // จุดมองข้างหน้า (ม.)
const FP_DROP  = 2.6;    // กดสายตาลง — ยกขอบฟ้าให้เห็นแทร็กผ่านช่องมองของภาพค็อกพิท
const FP_FOV   = 70;     // FOV ฐานมุมคนขับ (มุมไล่หลังใช้ 62)
/* ✨ Realistic Circuit ใช้มุมสายตานักขับสูงขึ้นและกดกล้องลงน้อยลง — แยกจาก Battery Saver ชัดเจน */
const RFP_EYE  = 1.30;
const RFP_FWD  = 0.38;
const RFP_LOOK = 24;
const RFP_DROP = 1.35;
const RFP_FOV  = 66;
/* 🛣️ รอบ 914 — มุมที่ 3 "มุมถนน": ตำแหน่งเดียวกับคนขับ แต่ไม่มีค็อกพิท/ล้อ/รถบัง เห็นถนนล้วน
   ยกสายตาสูงขึ้น + กดลงน้อยกว่า (ไม่ต้องเล็งผ่านช่องมองของภาพแล้ว) */
const ROAD_EYE  = 1.45;
const ROAD_DROP = 1.5;
const ROAD_FOV  = 74;
/* ⏪🏜️🛞 รอบ 911 — เกียร์ถอย + เกิดใหม่เมื่อหลุดสนาม + ล้อหน้ามุมคนขับ */
const REV_A      = 7;    // ⏪ อัตราเร่งถอยหลัง (m/s²)
const REV_MAX    = 8;    // ความเร็วถอยสูงสุด (m/s ≈ 29 กม./ชม.)
const OFFTRACK_S = 2;    // 🌀 อยู่พ้นผิวถนน (runoff/ทราย) ต่อเนื่องกี่วิ = เปิดประตูมิติกลับจุดใกล้เดิม
const FPW_F      = 1.35; // 🛞 ล้อหน้ามุมคนขับ: เยื้องไปหน้ารถ (ม.) — 1.35 ให้ล้อฉาย ~44° โผล่ช่องโปร่งริมจอ (1.58 จะโดนแขนคาร์บอนของภาพบังมิด)
const FPW_S      = 0.87; //    เยื้องข้าง (ม.)
const FPW_R      = 0.34; //    รัศมีล้อ (ม.)
const FPW_H      = 0.80; //    ความสูงจุดกลางล้อ (ม.) — สูงกว่าจริง (0.34) จงใจ: ภาพอาร์ตวาดยางไว้ระดับข้างกระจก
                         //    ยกให้ตรงช่องโปร่งของภาพ (จุดสัมผัสพื้นโดนบอดี้อาร์ตทึบบัง มองไม่เห็นว่าลอย)
/* Realistic: cue ล้อหน้าเล็กที่ขอบภาพ — ดันไปข้างหน้า/ออกด้านข้างและย่อ mesh กันล้อกินถนน */
const RFPW_F     = 2.90;
const RFPW_S     = 0.63;
const RFPW_H     = -1.10;
const RFPW_SCALE = 0.25;
/* 🎡 พวงมาลัยหมุนตามการเลี้ยวจริง (รอบ 913) — ภาพแยกเป็น 2 ชั้น: cockpit_body.webp (ไม่มีพวงมาลัย) + wheel.webp */
const WHEEL_HUB_X  = 49.41;  // แกนหมุน (ปุ่มกลมกลางพวงมาลัย) คิดเป็น % ของภาพ — ได้จาก tools/f1_split_wheel.py
const WHEEL_HUB_Y  = 63.96;  // ⚠️ แก้ภาพใหม่เมื่อไหร่ ต้องเอาค่า hub pct จากสคริปต์มาใส่ตรงนี้ด้วย
const WHEEL_RATIO  = 2.2;    // อัตราทด: มุมล้อหน้าจริง (องศา) → องศาที่หมุนบนภาพ (สุดพวงมาลัย ~43°)
const WHEEL_MAX_DEG= 44;     // เพดานองศา — เกินกว่านี้ภาพถ่ายมุมเดียวเริ่มดูบิดผิดรูป
const QUALITY_HAND_MAX_DEG=14; // มุมที่วัดได้จากขอบจอในภาพมือซ้าย/ขวา; จอสดต้องเอียงตรงเฟรมมือ
/* 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย — ไฟในภาพถูก "ดับ" ไว้แล้วที่ img/f1/wheel_body.webp
   เกมวาดดวงไฟจริงทับตรงตำแหน่งเดิมของภาพ (ตำแหน่งเป็น % เจนจาก tools/f1_split_leds.py)
   ⚠️ เปลี่ยนภาพพวงมาลัยใหม่ = รันสคริปต์นั้นใหม่ แล้วเอาอาร์เรย์ F1_LEDS มาแทนของเดิม */
const LED_GREEN_N  = 6;      // ดวงที่ 1-6 = เขียว (รอบต่ำ ยังลากได้อีก)
const LED_AMBER_N  = 11;     // ดวงที่ 7-11 = เหลือง · ที่เหลือ = แดง (ใกล้เปลี่ยนเกียร์)
const LED_SHIFT_R  = 0.93;   // วิ่งมาถึง 93% ของช่วงเกียร์นั้น = ติดเต็มแถบ+กะพริบ "เปลี่ยนเกียร์!"
                             // วัดจากสัดส่วน "สด ๆ" ไม่ใช่ค่าหน่วง — ทุกเกียร์จึงเตือนเหมือนกัน (ค่าหน่วงทำให้เกียร์ต่ำ ๆ ไม่ทันกะพริบ)
const LED_FLASH_HZ = 7;      // ความถี่กะพริบ (ครั้ง/วิ)
const LED_K_LO     = 0.30;   // ⚙️ สเกลเดียวกับแถบรอบเครื่องบนจอ (รอบ 916) — ไฟดวงแรกติดตอนเริ่มมีภาระจริง
const LED_K_SPAN   = 0.66;   //    ไฟบนขอบพวงมาลัยกับตัวเลข "รอบ/นาที" บนจอจึงวิ่งพร้อมกันเสมอ
const LED_RPM_LERP = 8;      // ใช้เฉพาะกรณีจอวาดไม่ได้ (ถอยไปคิดรอบเครื่องเอง สูตรเดียวกับเสียงเครื่องยนต์)
const F1_LEDS = [   // [left%, top%, width%, height%] ของภาพพวงมาลัย 1536×1024
  [43.034,49.512,0.651,0.684],[43.750,49.316,0.521,0.879],[44.596,49.219,0.716,0.879],
  [45.378,49.219,0.781,0.781],[46.354,49.219,0.781,0.781],[47.331,49.121,0.846,0.781],
  [48.307,49.121,0.846,0.781],[49.349,49.121,0.846,0.781],[50.391,49.121,0.846,0.781],
  [51.367,49.121,0.846,0.781],[52.409,49.121,0.846,0.781],[53.451,49.121,0.781,0.879],
  [54.362,49.219,0.911,0.781],[55.208,49.121,0.781,0.977],[56.120,49.316,0.716,0.879]
];
/* 🔢 รอบ 916: จอบนพวงมาลัยเป็น "ของจริง" — วาดเกียร์/ความเร็ว/รอบเครื่องด้วย canvas ทับเลขที่ติดมาในภาพ
   พิกัดวัดจาก wheel.webp (1536×1024) ตรง ๆ แล้วแปลงเป็นสัดส่วนของกรอบภาพ → ทับตรงทุกขนาดจอ */
const WHEEL_IMG_W = 1536, WHEEL_IMG_H = 1024;   // ขนาดจริงของ wheel.webp / cockpit_body.webp (เท่ากันเสมอ)
const DASH_PX = {x:654, y:500, w:232, h:118};   // กรอบจอ (รวมแถบไฟรอบเครื่องด้านบน) เป็นพิกเซลของภาพต้นฉบับ
const DASH_LED_N = 15;       // จำนวนดวงไฟรอบเครื่องบนขอบพวงมาลัย (ภาพต้นฉบับมี ~15 ขีด)
const DASH_RPM_MIN = 3200;   // รอบเดินเบา (rpm) — ตัวเลขบนจอไล่จากนี่ถึง MAX ตามภาระเครื่องจริง
const DASH_RPM_MAX = 15000;  // รอบสูงสุด (เครื่อง F1 จริงตัดที่ ~15,000)
/* 🫨 กล้องสั่นมุมคนขับ บน kerb/ทราย (รอบ 907) */
const SHAKE_KERB_AMP = 0.026;  // แอมพลิจูดสั่น (ม.) บน kerb ที่ความเร็วอ้างอิง SHAKE_SPD_REF
const SHAKE_SAND_AMP = 0.016;  // บนทราย (พื้นนุ่มกว่า kerb แข็ง สั่นเบากว่า)
const SHAKE_SPD_REF  = 40;     // m/s ที่สั่นเต็มแอมพลิจูด — ช้ากว่าลดสัดส่วน เร็วกว่าไม่เพิ่มอีก
const SHAKE_HZ        = 23;    // ความถี่สั่นหลัก (รอบ/วิ)
/* 🫨🎡 รอบ 914: มือ (พวงมาลัย) สั่นตาม kerb/ทราย เหมือนกล้อง — ใช้จังหวะ shakeT/SHAKE_HZ ชุดเดียวกับรอบ 907 */
const WHEEL_SHAKE_KERB_PX = 3.4;  // แอมพลิจูดสั่น (px จอ) บน kerb ที่ความเร็วอ้างอิง SHAKE_SPD_REF
const WHEEL_SHAKE_SAND_PX = 2.0;  // บนทราย (เบากว่า kerb เหมือนกล้อง)
/* ฟิสิกส์ (หน่วยเมตร/วินาที — 92 m/s = 331 กม./ชม.) */
const PWR_A        = 950;     // กำลังเครื่อง: a = PWR_A / max(v,6)  (แรงมากตอนช้า ลดตามความเร็ว)
const ACC_CAP      = 14.5;    // เพดานอัตราเร่ง (ล้อหมุนฟรี)
const DRAG_K       = 0.00112; // แรงต้านอากาศ a = k·v² (จูนให้ top speed ~92 m/s)
const ROLL_A       = 0.6;     // แรงต้านการหมุน
const BRAKE_A      = 30;      // เบรกพื้นฐาน + เพิ่มตาม downforce
const BRAKE_DF     = 0.0022;  // เบรกส่วน downforce (·v²)
/* 🛑 รอบ 921: ยกมือออกจากคันเร่ง = ค่อย ๆ เบรกเองอัตโนมัติ (เด็กไม่ต้องหาปุ่มเบรกให้ทัน)
   เบากว่าเบรกจริง ~5 เท่า — ยังปล่อยไหลเข้าโค้งได้ ไม่ใช่หยุดผลึ่ง */
const COAST_A      = 5.5;     // อัตราหน่วงเพิ่มตอนไม่แตะคันเร่ง (m/s²)
const COAST_STOP   = 0.45;    // ต่ำกว่านี้ (m/s) ให้หยุดสนิท ไม่คืบต่อ
const GRIP_BASE    = 17.5;    // ลิมิตแรงเข้าโค้งพื้นฐาน (m/s² ≈ 1.8g)
const GRIP_DF      = 0.0035;  // downforce เพิ่มกริป (·v²) → 250กม./ชม. ≈ 4.5g เหมือนจริง
const GRIP_CAP     = 46;      // เพดานกริป
const WB           = 3.6;     // ระยะฐานล้อ
const STEER_MAX    = 0.34;    // มุมเลี้ยวสูงสุด (rad) ตอนช้า
const STEER_HI     = 0.052;   // มุมเลี้ยวตอนเร็วสุด (โค้งปลายตรง ~ขยับนิดเดียว)
const SURF_RUNOFF  = {grip:0.62, drag:1.6};   // สัมประสิทธิ์บน runoff
const SURF_SAND    = {grip:0.28, drag:7.0};   // บนทราย: ลื่น + หน่วงแรง
const NET_SEND_MS  = 160;
const ROOM_MAX     = 10;      // 🚦 คุมคนต่อสนาม (รถเร็ว+ไฟเยอะ — เครื่องเด็กไหว)
const CHAT_MS      = 5000;
const CHAT_PRESETS = ['เร็วจัด! 🔥','แซงสวยมาก! 🏎️','ระวังโค้งหน้านะ','สู้ๆ! 💪','ตามมาเลย!','GG 🏁','555+','เก่งมาก! ⭐'];
const PEER_COLORS  = ['#e10600','#0090ff','#00d2be','#ff8700','#52e252','#ffd12e','#b96bff','#ff5ca8'];
const GRID_N       = 20;      // ช่องกริดสตาร์ท
/* 🚦 ลำดับออกสตาร์ท (รอบ 902) — ไฟแดง 5 ดวงบนซุ้ม ติดทีละดวง แล้วดับพร้อมกัน = ออกตัว */
const LIGHT_LEAD_S = 1.4;     // หน่วงก่อนไฟดวงแรกติด (ให้ตั้งหลัก)
const LIGHT_STEP_S = 1.0;     // เว้นระยะไฟแต่ละดวง
const LIGHT_HOLD_MIN = 0.7;   // ไฟครบ 5 แล้วค้างสุ่ม 0.7-2.6 วิ (เหมือนจริง เดาไม่ได้)
const LIGHT_HOLD_MAX = 2.6;
const JUMP_PENALTY_S = 2.0;   // กดคันเร่ง "ใหม่" ตอนไฟครบ 5 = จั๊มพ์สตาร์ท โดนหน่วง
/* 👻 รถเงา Best Lap (รอบ 902) */
const GHOST_HZ     = 10;      // บันทึกเส้นทาง 10 จุด/วินาที
const GHOST_MAX    = 3000;    // เพดานจุด (5 นาที) — ยาวกว่านี้ไม่บันทึก
const GHOST_KEY    = 'vwF1Ghost';   // เก็บใน localStorage (ไม่ยัดลง state — กัน cloud save บวม)
const PIT_HALF_W   = 6;       // ครึ่งความกว้างเลนพิท (เมตร)
const SURF_PIT     = {grip:1.0, drag:0.25};   // ผิวเลนพิท: ยึดเกาะเต็ม หน่วงนิดเดียว
const PIT_LIMIT    = 22.2;    // จำกัดความเร็วในเลนพิท 80 กม./ชม. (ลิมิตเตอร์อัตโนมัติ)

/* ============================================================
   📦 สถานะโลก
   ============================================================ */
let built=false, running=false, rafId=0, lastT=0;
let scene, camera, renderer;
let envLights=null, activeGraphicsMode='battery', activeEnvironmentProfile=null;
let realisticRoot=null, legacyArchitectureRoot=null, realisticTier='off', realisticStats=null;
let wrapEl, screenEl, hudEl, wordEl, coinsEl, banEl, introEl, exitBox, boardEl, chatBarEl, selfMsgEl;
let speedEl, gearEl, lapEl, bestEl, mapCv, mapCtx, mapBase=null, wrongEl, drsEl;
let knobEl, padThr=0, padBr=false, steerCtl=0, kL=false, kR=false, kThr=false, kBack=false;
let keydownFn, keyupFn, resizeFn;
/* รถเรา */
let px=0, pz=0, yaw=0, vx=0, vz=0, spd=0, steer=0, slide=0, carGrp=null, wheels=[], steerParts=[];
let camPos=null, camInit=false, camYaw=0, shakeT=0;
let camMode='cockpit', cockpitEl=null, cockpitTurnEl=null, cockpitTurnSrc='', camBtnEl=null;   // 🪖 รอบ 901 — มุมคนขับเป็นภาพหลัก
let padRev=false, revNow=false, sandT=0, respEl=null, portalEl=null, portalActive=false, portalT=0, portalJumped=false, portalTargetIdx=0, fpWheels=null;   // ⏪🏜️🛞 รอบ 911
let wheelEl=null, qualityWheelEl=null, wheelDeg=null, wheelSy=1; // 🎡 ชั้นพวงมาลัยแยก: Battery image + Quality procedural wheel
let ledsEl=null, ledEls=[], ledN=-1, ledRpm=0, ledFlashT=0, ledFlash=false;  // 🚥 รอบ 918 — ชั้นดวงไฟ LED รอบเครื่อง
let dashEl=null, dashCtx=null, dashK=1, dashRpm=0, dashSig='';   // 🔢 รอบ 916 — จอตัวเลขจริงบนพวงมาลัย (K = พิกเซลภาพ→พิกเซล canvas)
let wheelShakeOn=false;                                  // 🫨🎡 รอบ 914 — เฟรมก่อนหน้ามีการสั่นค้างไหม (กันสั่นค้างตอนกลับเข้าแทร็กเรียบ)
/* แทร็ก */
let LINE=null, TOTAL=0, grid=null, sfIdx=0, myIdx=0, myLapDist=0, surfNow='track';
/* จับเวลา */
let lapStartAt=0, lapNow=0, lapBest=0, lapCount=0, cpFlags=[false,false,false], lastProg=0;
/* คำศัพท์ */
let word=null, letters=[], sessionCoins=0, sessionWords=0;
/* เพื่อน */
let peers={}, room=null, lastNetSend=0, myChat=null, boardSig='';
/* 🚦 ไฟสตาร์ท + 👻 รถเงา (รอบ 902) */
let startLights=[], lightPhase='wait', lightT=0, lightsLit=-1, holdS=1.5, penaltyT=0, jumped=false;
let goAt=0, reactDone=false, thrPrev=false, heldAtGo=false, lightsEl=null, lightDots=[], lightNoteEl=null;
let ghostGrp=null, ghostWheels=[], ghostRec=null, ghostBest=null, ghostAcc=0, ghostGap=0, gapCur=0, gapEl=null;
let ghostLast=null, ghostShown=false;
/* 🚧 เลนพิท — คงผิวทาง/ลิมิตความเร็วไว้ โดยไม่มีระบบยางสึกหรือพิทสต็อป */
let PITL=null, inPit=false, pitLaneNow=false, pitLimited=false, lapPitted=false;
/* เอฟเฟกต์ */
let smokes=[], sparks=[];
let glbSrc=null, glbTried=false;

const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const lerp=(a,b,t)=>a+(b-a)*t;

/* ============================================================
   🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
   เสียงยาง / kerb / ลม / DRS คงระบบเดิมและใช้ AudioContext ก้อนเดียวกัน
   ============================================================ */
const Snd=(function(){
  const ENGINE_URL='sound/racing/engineSound.mp3';
  const RPM_IDLE=4000, RPM_MAX=19000;
  let ac=null, engineMaster=null, engineTone=null, engineSrc=null, sampleGain=null;
  let synthEng=null, synthHi=null, synthGain=null, noise=null, noiseGain=null, skidGain=null, started=false;
  let engineMode='off', loadToken=0, warned=false, lastGear=1, shiftDrop=0, lastV=0, actualRpm=RPM_IDLE;
  let windLp=null;      // 🪽 รอบ 908: ฟิลเตอร์เสียงลม — เปิดปีก DRS = ลมโปร่งขึ้น (คุมความถี่ตัดจาก tick)
  function ctx(){ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return ac; }
  function noiseBuf(a){
    const b=a.createBuffer(1,a.sampleRate*1,a.sampleRate), ch=b.getChannelData(0);
    for(let i=0;i<ch.length;i++) ch[i]=Math.random()*2-1;
    return b;
  }
  function synthStart(a){
    synthGain=a.createGain(); synthGain.gain.value=1; synthGain.connect(engineTone);
    synthEng=a.createOscillator(); synthEng.type='sawtooth'; synthEng.frequency.value=70;
    synthHi=a.createOscillator(); synthHi.type='square'; synthHi.frequency.value=140;
    const hiG=a.createGain(); hiG.gain.value=0.35;
    synthEng.connect(synthGain); synthHi.connect(hiG); hiG.connect(synthGain);
    synthEng.start(); synthHi.start();
  }
  function synthStop(){
    try{ if(synthEng) synthEng.stop(); }catch(e){}
    try{ if(synthHi) synthHi.stop(); }catch(e){}
    try{ if(synthEng) synthEng.disconnect(); }catch(e){}
    try{ if(synthHi) synthHi.disconnect(); }catch(e){}
    try{ if(synthGain) synthGain.disconnect(); }catch(e){}
    synthEng=synthHi=synthGain=null;
  }
  async function sampleStart(a,token){
    try{
      const response=await fetch(ENGINE_URL,{cache:'force-cache'});
      if(!response.ok) throw new Error('HTTP '+response.status);
      const buffer=await a.decodeAudioData(await response.arrayBuffer());
      if(!started||token!==loadToken||ac!==a||a.state==='closed') return;
      const src=a.createBufferSource(), gain=a.createGain(), now=a.currentTime;
      src.buffer=buffer; src.loop=true;
      /* ตัดขอบ MP3 encoder padding สั้น ๆ ออกจากลูป ลด click โดยไม่เพิ่ม scheduler/node คู่บนมือถือ */
      const trim=Math.min(0.08,buffer.duration*0.015);
      if(buffer.duration-trim>trim+0.05){ src.loopStart=trim; src.loopEnd=buffer.duration-trim; }
      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.linearRampToValueAtTime(1,now+0.28);
      src.connect(gain); gain.connect(engineTone); src.start(now,trim);
      engineSrc=src; sampleGain=gain; engineMode='sample';
      if(synthGain){
        synthGain.gain.cancelScheduledValues(now);
        synthGain.gain.setValueAtTime(Math.max(0.0001,synthGain.gain.value),now);
        synthGain.gain.linearRampToValueAtTime(0.0001,now+0.28);
        setTimeout(()=>{ if(started&&token===loadToken&&engineMode==='sample') synthStop(); },360);
      }
    }catch(e){
      if(!started||token!==loadToken) return;
      engineMode='fallback';
      if(!warned){ warned=true; console.warn('[F1 audio] Engine sample unavailable; using synthesized fallback.'); }
    }
  }
  function start(){
    if(typeof state!=='undefined'&&state.sound===false) return;
    const a=ctx(); if(!a||started) return; started=true;
    if(a.state==='suspended') a.resume();
    engineMode='loading'; lastGear=1; shiftDrop=0; lastV=0; rpm=0; actualRpm=RPM_IDLE;
    engineMaster=a.createGain(); engineMaster.gain.value=0.075; engineMaster.connect(a.destination);
    engineTone=a.createBiquadFilter(); engineTone.type='lowpass'; engineTone.frequency.value=3600; engineTone.Q.value=0.35;
    engineTone.connect(engineMaster);
    /* synth เริ่มทันที: กันช่วง decode เงียบ และเป็น fallback ถาวรถ้า asset โหลดไม่ได้ */
    synthStart(a);
    const token=++loadToken; sampleStart(a,token);
    /* ลม+ยาง */
    noiseGain=a.createGain(); noiseGain.gain.value=0;
    const lp=a.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=WIND_LP_SHUT;
    windLp=lp;
    noise=a.createBufferSource(); noise.buffer=noiseBuf(a); noise.loop=true;
    noise.connect(lp); lp.connect(noiseGain); noiseGain.connect(a.destination);
    noise.start();
    /* สกิด */
    skidGain=a.createGain(); skidGain.gain.value=0;
    const bp=a.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2100; bp.Q.value=2.2;
    const n2=a.createBufferSource(); n2.buffer=noiseBuf(a); n2.loop=true;
    n2.connect(bp); bp.connect(skidGain); skidGain.connect(a.destination);
    n2.start();
  }
  let rpm=0;            // normalized 0..1 ระหว่าง RPM_IDLE..RPM_MAX
  /* 🪽 รอบ 908: เสียงลมตอนปีกเปิด — ปีกกางออก = อากาศไหลผ่านโปร่ง เสียง "ซู่" แหลม/ดังขึ้น
     (ปิด = ลมตีปีกทึบ ทุ้มกว่า) · ค่าเป็นความถี่ตัดของ lowpass เส้นเสียงลมเดิม ไม่ได้เพิ่ม node ใหม่ */
  const WIND_LP_SHUT=900, WIND_LP_OPEN=2050, WIND_VOL_DRS=1.45;
  function tick(v,thr,sliding,dt,drs,braking,cameraMode){
    if(!started||!ac) return;
    const soundOn=typeof state==='undefined'||state.sound!==false;
    const av=Math.abs(v), g=gearOf(av);
    /* เกียร์เสมือน 8 สปีดใช้ขอบเดียวกับฟิสิกส์/HUD: upshift จะตกรอบสั้น ๆ แล้วสร้างต่อ */
    if(g>lastGear&&av>2) shiftDrop=1;
    lastGear=g;
    const gLo=GEARS[g-1]||0, gHi=GEARS[g]||92;
    const inGear=clamp((av-gLo)/Math.max(1,gHi-gLo),0,1);
    const speedTarget=av<1?0:(0.24+inGear*0.76);
    const accel=clamp((av-lastV)/Math.max(dt,0.001)/20,-1,1); lastV=av;
    const freeRev=thr>0.02?0.08+thr*0.70:0;
    let target=Math.max(speedTarget,freeRev)+Math.max(0,accel)*0.045-Math.max(0,-accel)*0.025;
    if(braking) target-=0.055;
    target-=shiftDrop*0.12;
    target=clamp(target,0,1);
    const response=target>rpm?7.8:(braking?4.3:2.6);
    rpm=lerp(rpm,target,1-Math.exp(-Math.max(0,dt)*response));
    shiftDrop=Math.max(0,shiftDrop-dt*7.5);
    actualRpm=RPM_IDLE+(RPM_MAX-RPM_IDLE)*rpm;
    /* sample หนึ่งชั้น: pitch 0.70×..1.60× + low-pass เปิดตามคันเร่ง/รอบ และนุ่มด้วย AudioParam */
    const rate=0.70+rpm*0.90;
    if(engineSrc) engineSrc.playbackRate.setTargetAtTime(rate,ac.currentTime,0.045);
    const f=62+rpm*rpm*610+thr*26;
    if(synthEng) synthEng.frequency.setTargetAtTime(f,ac.currentTime,0.035);
    if(synthHi) synthHi.frequency.setTargetAtTime(f*2.01,ac.currentTime,0.035);
    const cockpit=cameraMode==='cockpit', cameraK=cockpit?1:0.78;
    engineMaster.gain.setTargetAtTime(soundOn?(0.075+0.055*rpm+0.018*thr)*cameraK:0,ac.currentTime,0.09);
    engineTone.frequency.setTargetAtTime((1800+rpm*9000+thr*1500)*(cockpit?1:0.78),ac.currentTime,0.08);
    noiseGain.gain.setTargetAtTime(soundOn?clamp(av/92,0,1)*0.16*(drs?WIND_VOL_DRS:1):0,ac.currentTime,0.1);
    skidGain.gain.setTargetAtTime(soundOn&&sliding?0.16:0,ac.currentTime,sliding?0.03:0.12);
    /* 🪽 รอบ 908 — ลมเปลี่ยนเนื้อเสียงตามปีก (ไล่ 0.12 วิ ให้ได้ยินว่า "เปลี่ยน" ไม่ใช่กระตุก) */
    if(windLp) windLp.frequency.setTargetAtTime(drs?WIND_LP_OPEN:WIND_LP_SHUT,ac.currentTime,0.12);
  }
  /* 🪽 รอบ 908: เสียง "ฟู่" ตอนปีกขยับ — เปิด = กวาดความถี่ขึ้น (ลมทะลุ) · ปิด = กวาดลง (ลมตีปีก)
     บอกให้เด็กรู้ทันทีว่าปีกทำงาน แม้มุมคนขับจะมองไม่เห็นปีกหลังตัวเอง (รอบ 901) */
  function wing(open){
    const a=ctx(); if(!a||!started) return;
    const t0=a.currentTime, d=open?0.34:0.26;
    const n=a.createBufferSource(); n.buffer=noiseBuf(a); n.loop=true;
    const bp=a.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=0.9;
    bp.frequency.setValueAtTime(open?420:1900,t0);
    bp.frequency.exponentialRampToValueAtTime(open?2400:380,t0+d);
    const g=a.createGain();
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.linearRampToValueAtTime(open?0.16:0.11,t0+(open?0.09:0.05));
    g.gain.exponentialRampToValueAtTime(0.0008,t0+d);
    n.connect(bp); bp.connect(g); g.connect(a.destination);
    n.start(t0); n.stop(t0+d+0.02);
  }
  function kerb(){
    const a=ctx(); if(!a||!started) return;
    const o=a.createOscillator(), g=a.createGain();
    o.type='triangle'; o.frequency.value=88;
    g.gain.setValueAtTime(0.12,a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.07);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+0.08);
  }
  /* 🚦 รอบ 902: เสียงไฟสตาร์ท — ตุ๊บทุ้มตอนไฟติดทีละดวง · ระฆังสูงคู่ตอนไฟดับ (ออกตัว) */
  function blip(go){
    const a=ctx(); if(!a||!started) return;
    const t0=a.currentTime;
    (go?[[880,0],[1320,0.09]]:[[440,0]]).forEach(([f,at])=>{
      const o=a.createOscillator(), g=a.createGain();
      o.type=go?'triangle':'sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t0+at);
      g.gain.linearRampToValueAtTime(go?0.2:0.13,t0+at+0.012);
      g.gain.exponentialRampToValueAtTime(0.001,t0+at+(go?0.4:0.18));
      o.connect(g); g.connect(a.destination); o.start(t0+at); o.stop(t0+at+(go?0.42:0.2));
    });
  }
  function stop(){
    if(!ac) return;
    loadToken++;
    try{ ac.close(); }catch(e){}
    ac=null; engineMaster=engineTone=engineSrc=sampleGain=synthGain=null; synthEng=synthHi=null;
    noise=noiseGain=skidGain=null; started=false; rpm=0; actualRpm=RPM_IDLE; windLp=null; engineMode='off';
  }
  return {start,tick,kerb,blip,wing,stop,get rpm(){return rpm;},get on(){return started;},
    get rpmActual(){return actualRpm;},get mode(){return engineMode;},get asset(){return ENGINE_URL;},
    get windHz(){return windLp?windLp.frequency.value:null;}};
})();
const GEARS=[0,13,21,30,40,52,65,79,93];      // ขอบบนความเร็วแต่ละเกียร์ (m/s)
function gearOf(v){ for(let i=1;i<GEARS.length;i++){ if(v<=GEARS[i]) return i; } return 8; }

/* ============================================================
   🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
   (แบบเดียวกับ js/images.js — new Image() ใช้ได้ทั้ง file:// และ http://)
   ============================================================ */
const TexLib={};
/* material ที่ใช้ texture ชนิด key — ภาพจริงโหลดเสร็จทีหลังจะสลับ map ให้ทุกตัว */
const TexUsers={};
function matLam(key,opts){
  const m=new THREE.MeshLambertMaterial(Object.assign({map:TexLib[key]},opts||{}));
  (TexUsers[key]||(TexUsers[key]=[])).push(m);
  return m;
}
/* วัสดุ "เปิดไฟเอง" (ไม่โดนแสงหรี่) — อัฒจันทร์/พิท/หอคอย ต้องสว่างแบบ night race จริง */
function matLit(key,opts){
  const m=new THREE.MeshBasicMaterial(Object.assign({map:TexLib[key]},opts||{}));
  (TexUsers[key]||(TexUsers[key]=[])).push(m);
  return m;
}
function applyTex(key,t){
  TexLib[key]=t;
  for(const m of (TexUsers[key]||[])){ m.map=t; m.needsUpdate=true; }
}
function texFromCanvas(draw,w,h,rx,ry){
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  if(rx) t.repeat.set(rx,ry||rx);
  return t;
}
function texProbe(file,fallbackTex,onOk){
  const im=new Image();
  im.onload=()=>{
    const t=new THREE.Texture(im); t.needsUpdate=true;
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.repeat.copy(fallbackTex.repeat);
    onOk(t);
  };
  im.src='img/f1/'+file;
  return fallbackTex;
}
function asphaltTex(){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#3a3d42'; g.fillRect(0,0,w,h);
    for(let i=0;i<2600;i++){
      const v=30+Math.random()*40|0;
      g.fillStyle='rgba('+v+','+v+','+(v+4)+',0.5)';
      g.fillRect(Math.random()*w,Math.random()*h,2,2);
    }
    /* รอยยางกลางเลน (racing groove) */
    const gr=g.createLinearGradient(0,0,w,0);
    gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(0.35,'rgba(12,12,14,0.4)');
    gr.addColorStop(0.65,'rgba(12,12,14,0.4)'); gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr; g.fillRect(0,0,w,h);
  },256,256,1,1);
}
function kerbTex(){
  return texFromCanvas((g,w,h)=>{
    for(let i=0;i<8;i++){ g.fillStyle=i%2?'#e8e8e8':'#d81a1a'; g.fillRect(i*w/8,0,w/8,h); }
    g.fillStyle='rgba(0,0,0,0.15)'; g.fillRect(0,h*0.7,w,h*0.3);
  },256,64,1,1);
}
function sandTex(){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#cdb47f'; g.fillRect(0,0,w,h);
    for(let i=0;i<1800;i++){
      g.fillStyle=Math.random()<0.5?'rgba(190,160,105,0.55)':'rgba(230,208,150,0.5)';
      g.fillRect(Math.random()*w,Math.random()*h,3,2);
    }
  },256,256,60,60);
}
function adTex(txt,fg,bg){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle=bg; g.fillRect(0,0,w,h);
    g.fillStyle=fg; g.font='bold '+(h*0.62|0)+'px Arial'; g.textAlign='center'; g.textBaseline='middle';
    g.fillText(txt,w/2,h/2+2);
  },512,64,1,1);
}
/* ============================================================
   ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
   ============================================================ */
function letterTexture(ch){
  const c=document.createElement('canvas'); c.width=c.height=128;
  const g=c.getContext('2d');
  g.beginPath(); g.arc(64,64,58,0,Math.PI*2);
  g.fillStyle='rgba(255,215,64,0.96)'; g.fill();
  g.lineWidth=7; g.strokeStyle='#a06000'; g.stroke();
  g.fillStyle='#5c3500'; g.font='bold 74px Arial'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(ch.toUpperCase(),64,70);
  const t=new THREE.CanvasTexture(c); return t;
}
function makeTextSprite(text,bg,fg,emoji,grade){
  const gm=(typeof gradeMark==='function'&&grade)?gradeMark(grade):'';
  const c=document.createElement('canvas'); c.width=512; c.height=gm?170:128;
  const g=c.getContext('2d');
  g.fillStyle=bg;
  g.beginPath(); g.roundRect(6,6,500,116,26); g.fill();
  g.fillStyle=fg; g.font='bold 58px Arial'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText((emoji?emoji+' ':'')+text,256,66);
  if(gm){ g.font='44px Arial'; g.fillStyle='#ffd12e'; g.fillText(gm.replace(/<[^>]*>/g,''),256,144); }
  const t=new THREE.CanvasTexture(c);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
  return sp;
}

/* ============================================================
   🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
   + tangent/normal/curvature + ตารางแฮชหาผิวเร็ว
   ============================================================ */
function cr(p0,p1,p2,p3,t){
  const t2=t*t,t3=t2*t;
  return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);
}
function buildLine(){
  const src=F1_MAP.track, n=src.length, pts=[];
  let sfSrc=F1_MAP.sf||0;
  for(let i=0;i<n;i++){
    const p0=src[(i-1+n)%n],p1=src[i],p2=src[(i+1)%n],p3=src[(i+2)%n];
    const L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);
    const steps=Math.max(1,Math.round(L/SAMPLE_M));
    if(i===sfSrc) sfIdx=pts.length;
    for(let s=0;s<steps;s++){
      const t=s/steps;
      pts.push([cr(p0[0],p1[0],p2[0],p3[0],t),cr(p0[1],p1[1],p2[1],p3[1],t)]);
    }
  }
  const m=pts.length;
  LINE={x:new Float32Array(m),z:new Float32Array(m),tx:new Float32Array(m),tz:new Float32Array(m),
        nx:new Float32Array(m),nz:new Float32Array(m),cum:new Float32Array(m),curv:new Float32Array(m),n:m};
  let cum=0;
  for(let i=0;i<m;i++){
    const p=pts[i],q=pts[(i+1)%m];
    LINE.x[i]=p[0]; LINE.z[i]=p[1];
    let dx=q[0]-p[0],dz=q[1]-p[1];
    const L=Math.hypot(dx,dz)||1e-6; dx/=L; dz/=L;
    LINE.tx[i]=dx; LINE.tz[i]=dz; LINE.nx[i]=-dz; LINE.nz[i]=dx;
    LINE.cum[i]=cum; cum+=L;
  }
  TOTAL=cum;
  for(let i=0;i<m;i++){
    const a=(i-2+m)%m,b=(i+2)%m;
    const cross=LINE.tx[a]*LINE.tz[b]-LINE.tz[a]*LINE.tx[b];
    const dot=clamp(LINE.tx[a]*LINE.tx[b]+LINE.tz[a]*LINE.tz[b],-1,1);
    LINE.curv[i]=Math.sign(cross)*Math.acos(dot)/(SAMPLE_M*4);   // rad/m (+=เลี้ยวขวาในระบบ x-east z-south)
  }
  /* ตารางแฮช 40 ม. → หา sample ใกล้สุดเร็ว */
  grid={cell:40,map:{}};
  for(let i=0;i<m;i++){
    const k=(LINE.x[i]/40|0)+'_'+(LINE.z[i]/40|0);
    (grid.map[k]||(grid.map[k]=[])).push(i);
  }
}
function nearIdx(x,z,hint){
  /* มี hint (index เดิม) → เดินหาแถวนั้นก่อน (เร็วมาก เพราะรถวิ่งตามเส้น) */
  if(hint!==undefined&&LINE){
    let best=hint,bd=1e18;
    for(let o=-14;o<=14;o++){
      const i=((hint+o)%LINE.n+LINE.n)%LINE.n;
      const d=(LINE.x[i]-x)**2+(LINE.z[i]-z)**2;
      if(d<bd){bd=d;best=i;}
    }
    if(bd<90*90) return best;
  }
  let best=0,bd=1e18;
  const cx=x/40|0,cz=z/40|0;
  let found=false;
  for(let ox=-2;ox<=2;ox++)for(let oz=-2;oz<=2;oz++){
    const l=grid.map[(cx+ox)+'_'+(cz+oz)];
    if(!l) continue; found=true;
    for(const i of l){
      const d=(LINE.x[i]-x)**2+(LINE.z[i]-z)**2;
      if(d<bd){bd=d;best=i;}
    }
  }
  if(!found){
    for(let i=0;i<LINE.n;i+=6){
      const d=(LINE.x[i]-x)**2+(LINE.z[i]-z)**2;
      if(d<bd){bd=d;best=i;}
    }
  }
  return best;
}
/* ผิวใต้ล้อ: track / kerb / pit / runoff / sand + ระยะเบี่ยงข้าง */
function surfAt(x,z,hint){
  const i=nearIdx(x,z,hint);
  const dx=x-LINE.x[i],dz=z-LINE.z[i];
  const lat=dx*LINE.nx[i]+dz*LINE.nz[i];
  const a=Math.abs(lat);
  let s='sand';
  if(a<=HALF_W) s='track';
  else if(a<=HALF_W+KERB_W&&Math.abs(LINE.curv[i])>0.004) s='kerb';
  else if(inPitLane(x,z,lat)) s='pit';                 // 🛞 รอบ 905 — เลนพิทมีผิวของตัวเอง
  else if(a<=HALF_W+RUNOFF_W) s='runoff';
  return {i,lat,surf:s};
}

/* ============================================================
   🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
   ============================================================ */
function ribbonGeo(halfW,off,yTop,uScale,everyCurv){
  /* สร้างริบบิ้นตามเส้น (off=เลื่อนข้าง, everyCurv=วางเฉพาะช่วงโค้ง) */
  const pos=[],uv=[],idx=[];
  let vi=0;
  const m=LINE.n;
  for(let i=0;i<=m;i++){
    const j=i%m;
    if(everyCurv&&Math.abs(LINE.curv[j])<=0.004){ continue; }
    const cx=LINE.x[j]+LINE.nx[j]*off, cz=LINE.z[j]+LINE.nz[j]*off;
    pos.push(cx-LINE.nx[j]*halfW,yTop,cz-LINE.nz[j]*halfW, cx+LINE.nx[j]*halfW,yTop,cz+LINE.nz[j]*halfW);
    const u=LINE.cum[j]/uScale;
    uv.push(u,0,u,1);
    vi+=2;
  }
  for(let i=0;i<vi/2-1;i++) idx.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2);
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function kerbStrips(){
  /* kerb เป็นท่อนๆ เฉพาะช่วงโค้ง (ทั้งสองข้าง) */
  const g=new THREE.Group(), tex=TexLib.kerb;
  const m=LINE.n;
  let run=null;
  function flush(side){
    if(!run||run.len<4){ run=null; return; }
    const pos=[],uv=[],idx=[];
    for(let k=0;k<run.idx.length;k++){
      const j=run.idx[k];
      const off=side*(HALF_W+KERB_W/2);
      const cx=LINE.x[j]+LINE.nx[j]*off, cz=LINE.z[j]+LINE.nz[j]*off;
      pos.push(cx-LINE.nx[j]*KERB_W/2,0.06,cz-LINE.nz[j]*KERB_W/2, cx+LINE.nx[j]*KERB_W/2,0.06,cz+LINE.nz[j]*KERB_W/2);
      uv.push(LINE.cum[j]/6,0,LINE.cum[j]/6,1);
    }
    for(let i=0;i<run.idx.length-1;i++) idx.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    geo.setIndex(idx); geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:tex})));
    run=null;
  }
  for(const side of [-1,1]){
    run=null;
    for(let i=0;i<m;i++){
      if(Math.abs(LINE.curv[i])>0.0042){
        if(!run) run={idx:[],len:0};
        run.idx.push(i); run.len++;
      }else flush(side);
    }
    flush(side);
  }
  return g;
}
function extrudeFootprint(pts,h,mat,y0){
  const sh=new THREE.Shape();
  sh.moveTo(pts[0][0],-pts[0][1]);
  for(let i=1;i<pts.length;i++) sh.lineTo(pts[i][0],-pts[i][1]);
  sh.closePath();
  const geo=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:false});
  geo.rotateX(-Math.PI/2);
  const mesh=new THREE.Mesh(geo,mat);
  mesh.position.y=y0||0;
  return mesh;
}
function polyCentroid(pts){
  let x=0,z=0; for(const p of pts){x+=p[0];z+=p[1];}
  return [x/pts.length,z/pts.length];
}
function pointInFootprint(x,z,pts){
  let inside=false;
  for(let i=0,j=pts.length-1;i<pts.length;j=i++){
    const a=pts[i],b=pts[j];
    if(((a[1]>z)!==(b[1]>z)) && x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]) inside=!inside;
  }
  return inside;
}
/* OSM บางก้อนคร่อม centerline/ผิว runoff จนกลายเป็นกล่องทึบบนถนน — ตัดเฉพาะ footprint ที่รุกเขตขับ */
function footprintCrossesRoad(pts){
  for(let i=0;i<LINE.n;i+=4) if(pointInFootprint(LINE.x[i],LINE.z[i],pts)) return true;
  for(const p of pts){
    const s=surfAt(p[0],p[1]);
    if(Math.abs(s.lat)<HALF_W+KERB_W+.8) return true;
  }
  return false;
}
function footprintFrame(pts){
  const c=polyCentroid(pts);
  let best=0, ax=1, az=0;
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length], dx=b[0]-a[0], dz=b[1]-a[1], d=dx*dx+dz*dz;
    if(d>best){best=d; const l=Math.sqrt(d)||1; ax=dx/l; az=dz/l;}
  }
  const bx=-az,bz=ax;
  let minA=1e9,maxA=-1e9,minB=1e9,maxB=-1e9;
  for(const p of pts){
    const dx=p[0]-c[0],dz=p[1]-c[1],a=dx*ax+dz*az,b=dx*bx+dz*bz;
    minA=Math.min(minA,a);maxA=Math.max(maxA,a);minB=Math.min(minB,b);maxB=Math.max(maxB,b);
  }
  return {c,ax,az,bx,bz,w:Math.max(4,maxA-minA),d:Math.max(4,maxB-minB),yaw:-Math.atan2(az,ax)};
}
function premiumMats(){
  return {
    concrete:new THREE.MeshStandardMaterial({color:0xb9c0c8,roughness:.78,metalness:.04}),
    panel:new THREE.MeshStandardMaterial({color:0xe8edf2,emissive:0x111820,emissiveIntensity:.34,roughness:.35,metalness:.22}),
    roof:new THREE.MeshStandardMaterial({color:0x697580,emissive:0x222d38,emissiveIntensity:.68,roughness:.38,metalness:.54}),
    charcoal:new THREE.MeshStandardMaterial({color:0x17202a,roughness:.52,metalness:.32}),
    silver:new THREE.MeshStandardMaterial({color:0x8f9eab,roughness:.28,metalness:.72}),
    seat:new THREE.MeshStandardMaterial({color:0x22384f,roughness:.64,metalness:.08}),
    accent:new THREE.MeshStandardMaterial({color:0xd81a1a,emissive:0x4c0404,emissiveIntensity:.52,roughness:.38,metalness:.28}),
    glow:new THREE.MeshBasicMaterial({color:0xe8f7ff,toneMapped:false}),
    glass:new THREE.MeshStandardMaterial({color:0x153b58,emissive:0x071824,emissiveIntensity:.58,roughness:.12,
      metalness:.36,transparent:true,opacity:.76,side:THREE.DoubleSide}),
    ao:new THREE.MeshBasicMaterial({color:0x070b10,transparent:true,opacity:.42,depthWrite:false}),
    crowd:[0xd95763,0x38a4d8,0xf3c84b,0x2eb67d,0xe8edf2,0x835ac7].map(c=>new THREE.MeshLambertMaterial({color:c}))
  };
}
function instancedParts(root,geo,mat,parts){
  if(!parts.length) return null;
  const mesh=new THREE.InstancedMesh(geo,mat,parts.length),d=new THREE.Object3D();
  parts.forEach((p,i)=>{
    d.position.set(p.x,p.y,p.z); d.rotation.set(p.rx||0,p.ry||0,p.rz||0);
    d.scale.set(p.sx||1,p.sy||1,p.sz||1); d.updateMatrix(); mesh.setMatrixAt(i,d.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true; root.add(mesh); return mesh;
}
function localPart(list,f,x,y,z,sx,sy,sz,extra){
  list.push(Object.assign({x:f.c[0]+f.ax*x+f.bx*z,y,z:f.c[1]+f.az*x+f.bz*z,ry:f.yaw,sx,sy,sz},extra||{}));
}
/* ============================================================
   🏟️ PREMIUM MODULAR CIRCUIT ARCHITECTURE — รอบ 1203
   อาคาร/อัฒจันทร์เป็น geometry + clean materials เท่านั้น ไม่มีภาพ facade/crowd แปะผนัง
   ============================================================ */
function buildBuildings(){
  const g=new THREE.Group(),m=premiumMats(),unit=new THREE.BoxGeometry(1,1,1);
  const seats=[],posts=[],beams=[],roofs=[],rails=[],lights=[],ao=[],heads=[],crowd=m.crowd.map(()=>[]),doors=[];
  let pitDone=false,bi=0,culledRoadBuildings=0;
  for(const b of (F1_MAP.bld||[])){
    if(footprintCrossesRoad(b.p)){ culledRoadBuildings++; continue; }
    const f=footprintFrame(b.p),c=f.c;
    if(b.t==='gs'){
      const near=nearIdx(c[0],c[1]),toTrackX=LINE.x[near]-c[0],toTrackZ=LINE.z[near]-c[1];
      const front=(toTrackX*f.bx+toTrackZ*f.bz)>=0?1:-1, rows=7, usableD=Math.min(28,f.d*.88), rowD=usableD/rows;
      g.add(extrudeFootprint(b.p,1.15,m.charcoal,0));
      for(let r=0;r<rows;r++){
        const z=front*(-usableD*.5+(r+.5)*rowD),y=1.25+r*.72;
        localPart(seats,f,0,y,z,f.w*.94,.48,rowD*.88);
        localPart(ao,f,0,y-.29,z-front*rowD*.43,f.w*.92,.12,.16);
        const people=Math.max(3,Math.min(10,Math.round(f.w/18)));
        for(let q=0;q<people;q++){
          const x=(-.42+(q+.5)/people*.84)*f.w, show=((q*7+r*3+bi)%5)!==0;
          if(!show) continue;
          const col=(q+r+bi)%crowd.length;
          localPart(crowd[col],f,x,y+.54,z,0.34,.62,.28);
          localPart(heads,f,x,y+1.04,z,0.23,.23,.23);
        }
      }
      for(const x of [-f.w*.46,0,f.w*.46]){
        localPart(posts,f,x,6.9,-front*usableD*.48,.24,6.9,.24);
        localPart(posts,f,x,6.9, front*usableD*.48,.24,6.9,.24);
      }
      localPart(beams,f,0,12.7,front*usableD*.45,f.w*.99,.20,.22);
      localPart(beams,f,0,12.7,-front*usableD*.45,f.w*.99,.20,.22);
      localPart(roofs,f,0,13.15,0,f.w*1.05,.38,usableD*1.16,{rz:-front*.025});
      localPart(rails,f,0,6.7,front*(usableD*.52),f.w*.96,.10,.10);
      localPart(lights,f,0,12.55,front*(usableD*.50),f.w*.88,.07,.12);
    }else if(b.t==='tw'){
      const tw=new THREE.Group();
      const core=new THREE.Mesh(new THREE.CylinderGeometry(5.3,6.6,40,16),m.glass); core.position.y=20; tw.add(core);
      for(const y of [8,17,26,35]){ const ring=new THREE.Mesh(new THREE.CylinderGeometry(6.8,6.8,.55,16),m.silver);ring.position.y=y;tw.add(ring); }
      const lounge=new THREE.Mesh(new THREE.CylinderGeometry(10.8,8.4,4.7,18),m.panel); lounge.position.y=42;tw.add(lounge);
      const loungeGlass=new THREE.Mesh(new THREE.CylinderGeometry(8.5,9.6,3.2,18),m.glass);loungeGlass.position.y=46;tw.add(loungeGlass);
      const crown=new THREE.Mesh(new THREE.CylinderGeometry(7.1,8.6,.55,18),m.glow);crown.position.y=48;tw.add(crown);
      const tip=new THREE.Mesh(new THREE.CylinderGeometry(.28,.55,10,7),m.silver);tip.position.y=53;tw.add(tip);
      const beacon=new THREE.Mesh(new THREE.SphereGeometry(.65,8,6),m.accent);beacon.position.y=58.2;tw.add(beacon);tw.userData.beacon=beacon;
      tw.position.set(c[0],0,c[1]);g.add(tw);g.userData.tower=tw;
    }else{
      const pitNear=F1_MAP.pit&&F1_MAP.pit.length?F1_MAP.pit[F1_MAP.pit.length>>1]:null;
      const isPit=!pitDone&&pitNear&&Math.hypot(c[0]-pitNear[0],c[1]-pitNear[1])<120;
      const h=isPit?11:7.2+(bi%4)*.85; if(isPit) pitDone=true;
      g.add(extrudeFootprint(b.p,h*.62,m.concrete,0));
      const upper=b.p.map(p=>[c[0]+(p[0]-c[0])*.965,c[1]+(p[1]-c[1])*.965]);
      g.add(extrudeFootprint(upper,h*.25,m.glass,h*.62));
      g.add(extrudeFootprint(b.p.map(p=>[c[0]+(p[0]-c[0])*1.018,c[1]+(p[1]-c[1])*1.018]),.36,m.panel,h*.87));
      localPart(lights,f,0,h*.88+.18,0,f.w*.88,.06,Math.min(f.d*.82,1.1));
      localPart(ao,f,0,.08,0,f.w*.96,.06,f.d*.96);
      if(isPit||f.w>34){
        const bays=Math.max(3,Math.min(12,Math.round(f.w/10))),front=1;
        for(let q=0;q<bays;q++){
          const x=(-.5+(q+.5)/bays)*f.w*.9;
          localPart(doors,f,x,2.25,front*(f.d*.5+.03),f.w*.82/bays,3.8,.16);
        }
        localPart(beams,f,0,5.0,front*(f.d*.5+1.25),f.w*.98,.18,2.7);
      }
    }
    bi++;
  }
  instancedParts(g,unit,m.seat,seats); instancedParts(g,unit,m.silver,posts);
  instancedParts(g,unit,m.charcoal,beams); instancedParts(g,unit,m.roof,roofs);
  instancedParts(g,unit,m.silver,rails); instancedParts(g,unit,m.glow,lights);
  instancedParts(g,unit,m.ao,ao); instancedParts(g,unit,m.charcoal,doors);
  crowd.forEach((p,i)=>instancedParts(g,unit,m.crowd[i],p));
  instancedParts(g,new THREE.OctahedronGeometry(1,.0),new THREE.MeshLambertMaterial({color:0xd7aa82}),heads);
  g.userData.architecture={photoTextures:0,grandstandRows:7,modular:true,glass:true,culledRoadBuildings};
  return g;
}

/* ============================================================
   ✨ F1 REALISTIC CIRCUIT — ฉากสนามมืออาชีพเฉพาะ Realistic Mode (รอบ 1125)
   Battery Saver ไม่สร้างกลุ่มนี้จนกว่าจะมีการเลือก Realistic และซ่อนทั้งกลุ่มเมื่อสลับกลับ
   ของซ้ำใช้ InstancedMesh / geometry+material ร่วมกัน; ไฟส่วนใหญ่เป็น emissive ปลอม ไม่เพิ่ม point light
   ============================================================ */
function chooseRealisticTier(){
  const mem=Number(navigator.deviceMemory)||8, cores=Number(navigator.hardwareConcurrency)||8;
  if(mem<=3||cores<=4) return 'low';
  if(mem<8||cores<=6) return 'medium';
  return 'high';
}
function seededRand(seed){
  let s=seed>>>0;
  return ()=>{ s=(Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; };
}
function realisticAsphaltTex(){
  const rnd=seededRand(1125);
  const t=texFromCanvas((g,w,h)=>{
    g.fillStyle='#30343a'; g.fillRect(0,0,w,h);
    for(let i=0;i<6400;i++){
      const v=34+(rnd()*48|0), a=.16+rnd()*.34, sz=rnd()>.83?2:1;
      g.fillStyle='rgba('+v+','+(v+1)+','+(v+4)+','+a.toFixed(2)+')';
      g.fillRect(rnd()*w,rnd()*h,sz,sz);
    }
    /* ร่องยางสองแนว + เนื้อยางสะสมกลาง racing line; ผิวด้าน ไม่ทำเป็นถนนเปียก */
    const groove=g.createLinearGradient(0,0,0,h);
    groove.addColorStop(0,'rgba(0,0,0,0)'); groove.addColorStop(.24,'rgba(0,0,0,0)');
    groove.addColorStop(.34,'rgba(9,10,12,.42)'); groove.addColorStop(.45,'rgba(8,9,11,.18)');
    groove.addColorStop(.55,'rgba(8,9,11,.18)'); groove.addColorStop(.66,'rgba(9,10,12,.42)');
    groove.addColorStop(.76,'rgba(0,0,0,0)'); groove.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=groove; g.fillRect(0,0,w,h);
    for(let i=0;i<42;i++){
      const x=rnd()*w, y=h*(.27+rnd()*.46);
      g.strokeStyle='rgba(5,6,8,'+(.05+rnd()*.08).toFixed(2)+')'; g.lineWidth=1+rnd()*2;
      g.beginPath(); g.moveTo(x,y); g.lineTo(x+20+rnd()*70,y+(rnd()-.5)*5); g.stroke();
    }
  },512,256,1,1);
  if(renderer&&renderer.capabilities) t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  return t;
}
function linePose(obj,line,i,lat,y){
  i=((i%line.n)+line.n)%line.n;
  obj.position.set(line.x[i]+line.nx[i]*lat,y,line.z[i]+line.nz[i]*lat);
  obj.rotation.set(0,Math.atan2(line.tx[i],line.tz[i]),0);
  obj.scale.set(1,1,1); obj.updateMatrix();
}
/* อาคาร skyline วางห่างจากแทร็กจุดต้นทาง แต่สนามวนกลับมาใกล้กันได้: ตรวจซ้ำกับ
   เส้นแทร็ก "ทุกช่วง" ก่อนสร้าง กันกล่องเมืองไปตกบนถนนอีกฝั่งของสนาม */
function tracksideSpotClear(i,lat,clearance){
  const x=LINE.x[i]+LINE.nx[i]*lat,z=LINE.z[i]+LINE.nz[i]*lat;
  return Math.abs(surfAt(x,z).lat)>HALF_W+RUNOFF_W+clearance;
}
function instancedFromSpots(geo,mat,spots,place){
  const mesh=new THREE.InstancedMesh(geo,mat,spots.length), d=new THREE.Object3D();
  spots.forEach((spot,i)=>{place(d,spot,i);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);});
  mesh.instanceMatrix.needsUpdate=true; mesh.frustumCulled=true;
  return mesh;
}
function buildRealisticCircuit(tier){
  const root=new THREE.Group(); root.name='F1_REALISTIC_CIRCUIT';
  const cfg=tier==='high'
    ?{barStep:3,fenceStep:6,lightStep:10,boards:48,stands:7,city:84,pit:14}
    :tier==='medium'
      ?{barStep:4,fenceStep:8,lightStep:14,boards:32,stands:5,city:54,pit:10}
      :{barStep:6,fenceStep:12,lightStep:18,boards:20,stands:3,city:30,pit:7};
  const stats={tier,instances:0,meshGroups:0,barriers:0,fencePosts:0,lightPoles:0,boards:0,
    grandstands:cfg.stands,city:0,culledRoadCity:0,pitBays:PITL?cfg.pit:0,bridges:tier==='low'?1:3,marshalPosts:8};

  /* ผิวแทร็กคุณภาพสูงทับผิวเดิมเฉพาะโหมดนี้: micro variation + roughness + racing groove */
  const roadMat=new THREE.MeshStandardMaterial({map:realisticAsphaltTex(),color:0x8f949c,roughness:.86,metalness:.025});
  root.add(new THREE.Mesh(ribbonGeo(HALF_W,0,.052,18),roadMat)); stats.meshGroups++;
  const grooveMat=new THREE.MeshBasicMaterial({color:0x080a0d,transparent:true,opacity:.16,depthWrite:false});
  root.add(new THREE.Mesh(ribbonGeo(2.15,0,.057,16),grooveMat)); stats.meshGroups++;

  /* กำแพงแข่งแบบโมดูลสองชนิด + shadow gap เห็นแนวต่อชัด */
  const barrierOff=HALF_W+RUNOFF_W+.75, barrierLen=cfg.barStep*SAMPLE_M+.35;
  const barrierSpots=[[],[]];
  for(let side=-1;side<=1;side+=2) for(let i=0;i<LINE.n;i+=cfg.barStep)
    barrierSpots[(i/cfg.barStep+(side>0?1:0))&1].push({i,side});
  const barrierGeo=new THREE.BoxGeometry(.72,1.18,barrierLen);
  const barrierMats=[
    new THREE.MeshLambertMaterial({color:0xc8ccd1}),
    new THREE.MeshLambertMaterial({color:0x244d76})
  ];
  barrierSpots.forEach((spots,k)=>{
    root.add(instancedFromSpots(barrierGeo,barrierMats[k],spots,(d,s)=>linePose(d,LINE,s.i,s.side*barrierOff,.57)));
    stats.instances+=spots.length; stats.barriers+=spots.length; stats.meshGroups++;
  });
  const seamSpots=[];
  for(let side=-1;side<=1;side+=2) for(let i=0;i<LINE.n;i+=cfg.barStep) seamSpots.push({i,side});
  const seamGeo=new THREE.BoxGeometry(.78,1.2,.09);
  root.add(instancedFromSpots(seamGeo,new THREE.MeshBasicMaterial({color:0x17202a}),seamSpots,
    (d,s)=>linePose(d,LINE,s.i,s.side*(barrierOff-.01),.58)));
  stats.instances+=seamSpots.length; stats.meshGroups++;

  /* catch fencing: เสา instanced + ลวดทั้งสนามรวมเป็น LineSegments draw call เดียว */
  const fenceOff=barrierOff+.05, postSpots=[];
  for(let side=-1;side<=1;side+=2) for(let i=0;i<LINE.n;i+=cfg.fenceStep) postSpots.push({i,side});
  root.add(instancedFromSpots(new THREE.CylinderGeometry(.07,.09,3.5,5),
    new THREE.MeshLambertMaterial({color:0x788695}),postSpots,(d,s)=>linePose(d,LINE,s.i,s.side*fenceOff,2.35)));
  stats.instances+=postSpots.length; stats.fencePosts=postSpots.length; stats.meshGroups++;
  const wire=[];
  for(let side=-1;side<=1;side+=2){
    for(let i=0;i<LINE.n;i+=cfg.fenceStep){
      const j=(i+cfg.fenceStep)%LINE.n;
      const ax=LINE.x[i]+LINE.nx[i]*side*fenceOff, az=LINE.z[i]+LINE.nz[i]*side*fenceOff;
      const bx=LINE.x[j]+LINE.nx[j]*side*fenceOff, bz=LINE.z[j]+LINE.nz[j]*side*fenceOff;
      for(const y of [1.45,2.1,2.75,3.35]) wire.push(ax,y,az,bx,y,bz);
      const atopX=ax+LINE.nx[i]*side*.55, atopZ=az+LINE.nz[i]*side*.55;
      const btopX=bx+LINE.nx[j]*side*.55, btopZ=bz+LINE.nz[j]*side*.55;
      wire.push(ax,3.35,az,atopX,3.95,atopZ,bx,3.35,bz,btopX,3.95,btopZ,atopX,3.95,atopZ,btopX,3.95,btopZ);
    }
  }
  const fenceGeo=new THREE.BufferGeometry(); fenceGeo.setAttribute('position',new THREE.Float32BufferAttribute(wire,3));
  root.add(new THREE.LineSegments(fenceGeo,new THREE.LineBasicMaterial({color:0xa9b7c5,transparent:true,opacity:.48})));
  stats.meshGroups++;

  /* ไฟสนามต่อเนื่อง: เสา+หัวไฟ instanced, ไม่มี point light รายดวง */
  const lightSpots=[];
  for(let side=-1;side<=1;side+=2) for(let i=0;i<LINE.n;i+=cfg.lightStep) lightSpots.push({i,side});
  const lightOff=barrierOff+5.7;
  root.add(instancedFromSpots(new THREE.CylinderGeometry(.12,.24,18,6),
    new THREE.MeshLambertMaterial({color:0x68727d}),lightSpots,(d,s)=>linePose(d,LINE,s.i,s.side*lightOff,9)));
  root.add(instancedFromSpots(new THREE.BoxGeometry(4.5,.65,.55),
    new THREE.MeshBasicMaterial({color:0xeef5ff,toneMapped:false}),lightSpots,(d,s)=>linePose(d,LINE,s.i,s.side*lightOff,18)));
  stats.instances+=lightSpots.length*2; stats.lightPoles=lightSpots.length; stats.meshGroups+=2;

  /* ป้าย fictional sponsor เป็น 6 batch แทน mesh แยกหลายสิบชิ้น */
  const brands=[
    ['VOCAB WORLD','#ffffff','#d81a1a'],['WORD BOOST','#071529','#67d8ff'],['LEXICON','#5b3300','#ffd12e'],
    ['XP+','#ffffff','#6b39d8'],['VOCAB GP','#ffffff','#087e62'],['LEARN • RACE • WIN','#061325','#f2f5ff']
  ];
  const boardSets=brands.map(()=>[]);
  for(let n=0;n<cfg.boards;n++){
    const i=(sfIdx+28+n*Math.floor(LINE.n/cfg.boards))%LINE.n, side=n%2?1:-1;
    boardSets[n%brands.length].push({i,side});
  }
  const boardGeo=new THREE.PlaneGeometry(12,1.65); boardGeo.rotateY(Math.PI/2);
  const boardAll=[].concat(...boardSets);
  root.add(instancedFromSpots(new THREE.BoxGeometry(.24,1.95,12.35),
    new THREE.MeshStandardMaterial({color:0x111923,roughness:.38,metalness:.58}),boardAll,
    (d,s)=>linePose(d,LINE,s.i,s.side*(barrierOff-.48),1.75)));
  stats.instances+=boardAll.length;stats.meshGroups++;
  boardSets.forEach((spots,k)=>{
    const b=brands[k], mat=new THREE.MeshBasicMaterial({map:adTex(b[0],b[1],b[2]),side:THREE.DoubleSide,toneMapped:false});
    root.add(instancedFromSpots(boardGeo,mat,spots,(d,s)=>linePose(d,LINE,s.i,s.side*(barrierOff-.43),1.75)));
    stats.instances+=spots.length; stats.boards+=spots.length; stats.meshGroups++;
  });

  /* อัฒจันทร์ modular 3D รอบ main straight และโค้งหลัก — ไม่มี billboard crowd */
  const standOffsets=[45,115,250,405,585,760,930].slice(0,cfg.stands);
  const standSpots=standOffsets.map((off,n)=>({i:(sfIdx+off)%LINE.n,side:n%3===1?-1:1}));
  const standOff=barrierOff+18,arch=premiumMats(),standRows=[],standPosts=[],standRoofs=[],standRails=[];
  const bodies=arch.crowd.map(()=>[]),heads=[];
  for(const s of standSpots){
    for(let r=0;r<7;r++){
      standRows.push({i:s.i,side:s.side,r});
      for(let q=-3;q<=3;q++) if(((q+3)*5+r*3+s.i)%6!==0){
        const p={i:(s.i+q+LINE.n)%LINE.n,side:s.side,r,q}; bodies[(q+r+7)%bodies.length].push(p);heads.push(p);
      }
    }
    for(const di of [-5,0,5]) standPosts.push({i:(s.i+di+LINE.n)%LINE.n,side:s.side});
    standRoofs.push(s);standRails.push(s);
  }
  root.add(instancedFromSpots(new THREE.BoxGeometry(1,1,1),arch.seat,standRows,(d,s)=>{
    linePose(d,LINE,s.i,s.side*(standOff-6.2+s.r*1.72),1.1+s.r*.68);d.scale.set(1.45,.48,44);
  }));
  root.add(instancedFromSpots(new THREE.BoxGeometry(1,1,1),arch.silver,standPosts,(d,s)=>{
    linePose(d,LINE,s.i,s.side*(standOff+5.4),6.7);d.scale.set(.32,13.4,.32);
  }));
  root.add(instancedFromSpots(new THREE.BoxGeometry(1,1,1),arch.roof,standRoofs,(d,s)=>{
    linePose(d,LINE,s.i,s.side*(standOff+.1),13.35);d.scale.set(16.8,.42,50);
  }));
  root.add(instancedFromSpots(new THREE.BoxGeometry(1,1,1),arch.glow,standRails,(d,s)=>{
    linePose(d,LINE,s.i,s.side*(standOff-7.5),6.45);d.scale.set(.12,.12,45);
  }));
  bodies.forEach((spots,k)=>root.add(instancedFromSpots(new THREE.BoxGeometry(.55,1.05,.55),arch.crowd[k],spots,(d,s)=>
    linePose(d,LINE,s.i,s.side*(standOff-6.2+s.r*1.72),1.75+s.r*.68))));
  root.add(instancedFromSpots(new THREE.OctahedronGeometry(.34,0),new THREE.MeshLambertMaterial({color:0xd7aa82}),heads,(d,s)=>
    linePose(d,LINE,s.i,s.side*(standOff-6.2+s.r*1.72),2.48+s.r*.68)));
  stats.instances+=standRows.length+standPosts.length+standRoofs.length+standRails.length+heads.length*2;
  stats.meshGroups+=4+bodies.length+1;

  /* pit wall + garages + overhead light strips + signage ที่อ่านได้จาก cockpit */
  if(PITL){
    const pitSpots=[];
    for(let n=0;n<cfg.pit;n++) pitSpots.push({i:Math.round((n+.5)*PITL.n/cfg.pit),n});
    const pitSide=pitAt(LINE.x[sfIdx],LINE.z[sfIdx],0);
    const laneSide=pitSide&&pitSide.lat>0?1:-1;
    const pitBayLen=Math.max(7.5,PITL.len/cfg.pit*.88);
    root.add(instancedFromSpots(new THREE.BoxGeometry(10,4.8,pitBayLen),new THREE.MeshLambertMaterial({color:0x6f7883}),pitSpots,
      (d,s)=>linePose(d,PITL,Math.min(s.i,PITL.n-1),laneSide*(PIT_HALF_W+7.2),2.4)));
    root.add(instancedFromSpots(new THREE.BoxGeometry(10,.28,pitBayLen+.1),new THREE.MeshBasicMaterial({color:0xeef6ff,toneMapped:false}),pitSpots,
      (d,s)=>linePose(d,PITL,Math.min(s.i,PITL.n-1),laneSide*(PIT_HALF_W+7.15),5.05)));
    const pitWall=[]; for(let i=0;i<PITL.n;i+=3) pitWall.push({i});
    root.add(instancedFromSpots(new THREE.BoxGeometry(.5,1.05,15),new THREE.MeshLambertMaterial({color:0xd8dce1}),pitWall,
      (d,s)=>linePose(d,PITL,s.i,-laneSide*(PIT_HALF_W-.4),.52)));
    stats.instances+=pitSpots.length*2+pitWall.length; stats.meshGroups+=3;
    for(const [idx,label] of [[2,'PIT →'],[PITL.n-3,'PIT EXIT']]){
      const i=Math.max(0,Math.min(PITL.n-1,idx)), sp=makeTextSprite(label,'rgba(8,22,38,.96)','#8fffd4','',null);
      sp.scale.set(11,2.8,1); sp.position.set(PITL.x[i],5.8,PITL.z[i]); root.add(sp);
    }
  }

  /* กริดสตาร์ท/ยางเบรกสะสม/สกิดมาร์ก — geometry รวม ลด draw call */
  const gridSpots=[];
  for(let n=0;n<GRID_N;n++) gridSpots.push({i:(sfIdx-4-n*2+LINE.n)%LINE.n,side:n%2?1:-1});
  root.add(instancedFromSpots(new THREE.BoxGeometry(4.4,.025,.16),new THREE.MeshBasicMaterial({color:0xf2f4f7}),gridSpots,
    (d,s)=>linePose(d,LINE,s.i,s.side*3.2,.074)));
  stats.instances+=gridSpots.length; stats.meshGroups++;
  const skid=[];
  for(let i=4;i<LINE.n-18;i++){
    if(Math.abs(LINE.curv[i])>.0065&&Math.abs(LINE.curv[i-4])<.0032){
      for(let k=0;k<16;k++){
        const j=(i-k+LINE.n)%LINE.n, lat=(k%2?-.9:.9);
        skid.push(LINE.x[j]+LINE.nx[j]*lat,.071,LINE.z[j]+LINE.nz[j]*lat,
                  LINE.x[(j+1)%LINE.n]+LINE.nx[(j+1)%LINE.n]*lat,.071,LINE.z[(j+1)%LINE.n]+LINE.nz[(j+1)%LINE.n]*lat);
      }
    }
  }
  const skidGeo=new THREE.BufferGeometry(); skidGeo.setAttribute('position',new THREE.Float32BufferAttribute(skid,3));
  root.add(new THREE.LineSegments(skidGeo,new THREE.LineBasicMaterial({color:0x090a0c,transparent:true,opacity:.48}))); stats.meshGroups++;

  /* สะพานคนเดิน + marshal posts + skyline ไกลแบบ instancing */
  const bridgeSpots=[{i:(sfIdx+165)%LINE.n},{i:(sfIdx+510)%LINE.n},{i:(sfIdx+820)%LINE.n}].slice(0,stats.bridges);
  root.add(instancedFromSpots(new THREE.BoxGeometry(HALF_W*2+13,2.2,3),new THREE.MeshLambertMaterial({color:0x26384c}),bridgeSpots,
    (d,s)=>linePose(d,LINE,s.i,0,8.4)));
  const marshalSpots=[]; for(let n=0;n<8;n++) marshalSpots.push({i:(sfIdx+80+n*Math.floor(LINE.n/8))%LINE.n,side:n%2?1:-1});
  root.add(instancedFromSpots(new THREE.BoxGeometry(3.4,3.1,4.2),new THREE.MeshLambertMaterial({color:0xf07822}),marshalSpots,
    (d,s)=>linePose(d,LINE,s.i,s.side*(barrierOff+4.2),1.55)));
  const rnd=seededRand(2511), citySpots=[];
  for(let n=0;n<cfg.city;n++){
    const s={i:(n*Math.floor(LINE.n/cfg.city)+13)%LINE.n,side:n%2?1:-1,
      h:8+rnd()*28,off:95+rnd()*145,w:12+rnd()*18,d:10+rnd()*22};
    const radius=Math.hypot(s.w,s.d)*.5+3;
    if(tracksideSpotClear(s.i,s.side*s.off,radius)) citySpots.push(s);
    else stats.culledRoadCity++;
  }
  stats.city=citySpots.length;
  const city=instancedFromSpots(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0x17283a}),citySpots,(d,s)=>{
    linePose(d,LINE,s.i,s.side*s.off,s.h/2); d.scale.set(s.w,s.h,s.d);
  });
  root.add(city); stats.instances+=bridgeSpots.length+marshalSpots.length+citySpots.length; stats.meshGroups+=3;

  root.userData.stats=stats;
  return root;
}
function buildTrackScene(){
  /* พื้นทะเลทราย */
  const sand=new THREE.Mesh(new THREE.PlaneGeometry(4200,4200),matLam('sand'));
  sand.rotation.x=-Math.PI/2; sand.position.y=-0.25; scene.add(sand);
  /* runoff (ยางมะตอยสีอ่อนกว่าแทร็กนิดเดียว) → วางใต้แทร็ก */
  scene.add(new THREE.Mesh(ribbonGeo(HALF_W+RUNOFF_W,0,-0.02,40),
    new THREE.MeshLambertMaterial({color:0x4d5058})));
  /* ผิวแทร็กหลัก */
  scene.add(new THREE.Mesh(ribbonGeo(HALF_W,0,0.02,26),matLam('asphalt')));
  /* เส้นขอบขาวสองข้าง */
  for(const s of [-1,1])
    scene.add(new THREE.Mesh(ribbonGeo(0.18,s*(HALF_W-0.3),0.045,10),
      new THREE.MeshBasicMaterial({color:0xe8e8e8})));
  scene.add(kerbStrips());
  /* เส้นสตาร์ท */
  const sfLine=new THREE.Mesh(new THREE.PlaneGeometry(HALF_W*2,1.6),
    new THREE.MeshBasicMaterial({map:texFromCanvas((g,w,h)=>{
      for(let x=0;x<10;x++)for(let y=0;y<3;y++){
        g.fillStyle=(x+y)%2?'#111':'#eee'; g.fillRect(x*w/10,y*h/3,w/10,h/3);
      }
    },256,64)}));
  sfLine.rotation.x=-Math.PI/2;
  sfLine.position.set(LINE.x[sfIdx],0.05,LINE.z[sfIdx]);
  sfLine.rotation.z=Math.atan2(LINE.tx[sfIdx],LINE.tz[sfIdx]);
  scene.add(sfLine);
  /* 🌉 ซุ้มสตาร์ท (gantry) + ไฟ 5 ดวง */
  const gant=new THREE.Group();
  const gantMat=new THREE.MeshLambertMaterial({color:0x2a2f3a});
  const beam=new THREE.Mesh(new THREE.BoxGeometry(HALF_W*2+8,1.6,2.4),gantMat);
  beam.position.y=8; gant.add(beam);
  for(const s of [-1,1]){
    const leg=new THREE.Mesh(new THREE.BoxGeometry(1.2,8,1.6),gantMat);
    leg.position.set(s*(HALF_W+3.6),4,0); gant.add(leg);
  }
  /* 🚦 รอบ 902: ไฟแดง 5 ดวงคุมได้จริง (ดวงเรืองซ้อนไว้ให้เห็นจากท้ายกริด ~100 ม.) */
  startLights=[];
  for(let i=0;i<5;i++){
    const lt=new THREE.Mesh(new THREE.SphereGeometry(0.42,8,6),new THREE.MeshBasicMaterial({color:0x330000}));
    lt.position.set(-3.2+i*1.6,7.0,1.1); gant.add(lt);
    const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,color:0xff2a2a,transparent:true,
      opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
    gl.position.set(-3.2+i*1.6,7.0,1.5); gl.scale.set(3.4,3.4,1); gant.add(gl);
    startLights.push({m:lt,g:gl});
  }
  const adB=new THREE.Mesh(new THREE.PlaneGeometry(HALF_W*2+6,1.3),
    new THREE.MeshBasicMaterial({map:TexLib.adGP}));
  adB.position.set(0,8,1.25); gant.add(adB);
  /* คานซุ้มต้องพาดขวางแทร็ก: แกน X ของ Box → ทิศ normal (rotation.y หมุน +X ไป (cosθ,0,-sinθ)) */
  gant.position.set(LINE.x[sfIdx],0,LINE.z[sfIdx]);
  gant.rotation.y=Math.atan2(-LINE.nz[sfIdx],LINE.nx[sfIdx]);
  scene.add(gant);
  /* ป้ายโฆษณาข้างแทร็ก (ข้อความกลางๆ ไม่มีแบรนด์จริง) + ป้ายเลขโค้ง */
  const ads=[TexLib.adGP,TexLib.adSakhir,TexLib.adVocab,TexLib.adSpeed];
  let corner=0, lastCorner=-1e9;
  for(let i=0;i<LINE.n;i+=36){
    const off=HALF_W+RUNOFF_W+2.5;
    const side=(i/36|0)%2?1:-1;
    const bb=new THREE.Mesh(new THREE.PlaneGeometry(14,1.9),
      new THREE.MeshBasicMaterial({map:ads[(i/36|0)%ads.length],side:THREE.DoubleSide}));
    bb.position.set(LINE.x[i]+LINE.nx[i]*off*side,1.1,LINE.z[i]+LINE.nz[i]*off*side);
    bb.rotation.y=Math.atan2(LINE.nx[i]*side,LINE.nz[i]*side)+Math.PI;
    const back=new THREE.Mesh(new THREE.BoxGeometry(14.5,2.25,.18),
      new THREE.MeshStandardMaterial({color:0x111923,roughness:.42,metalness:.55}));
    back.position.copy(bb.position);back.rotation.copy(bb.rotation);back.translateZ(-.12);
    scene.add(back);scene.add(bb);
  }
  /* ป้ายหมายเลขโค้ง 1-15: จุดที่ curvature พีคเป็นช่วงๆ */
  const peaks=[];
  let inC=false,st=0;
  for(let i=0;i<LINE.n;i++){
    const c=Math.abs(LINE.curv[(i+sfIdx)%LINE.n]);
    if(c>0.006&&!inC){ inC=true; st=i; }
    else if(c<=0.006&&inC){ inC=false; if(i-st>3) peaks.push(((st+i)>>1)+sfIdx); }
  }
  peaks.slice(0,15).forEach((pk,no)=>{
    const i=pk%LINE.n;
    const side=LINE.curv[i]>0?-1:1;      // ป้ายอยู่ด้านนอกโค้ง
    const off=HALF_W+RUNOFF_W+1.5;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture((()=>{
      const c=document.createElement('canvas'); c.width=c.height=96;
      const g=c.getContext('2d');
      g.fillStyle='#fff'; g.beginPath(); g.roundRect(6,6,84,84,14); g.fill();
      g.fillStyle='#d81a1a'; g.font='bold 52px Arial'; g.textAlign='center'; g.textBaseline='middle';
      g.fillText(String(no+1),48,52);
      return c;
    })()),transparent:true}));
    sp.scale.set(4,4,1);
    sp.position.set(LINE.x[i]+LINE.nx[i]*off*side,4.5,LINE.z[i]+LINE.nz[i]*off*side);
    scene.add(sp);
  });
  /* 💡 เสาไฟสปอตไลต์รอบสนาม (night race) */
  const poleMat=new THREE.MeshLambertMaterial({color:0x555c66});
  const headMat=new THREE.MeshBasicMaterial({color:0xf4f7ff});
  for(let i=0;i<LINE.n;i+=54){
    const side=(i/54|0)%2?1:-1;
    const off=HALF_W+RUNOFF_W+6;
    const grp=new THREE.Group();
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.5,22,6),poleMat);
    pole.position.y=11; grp.add(pole);
    const head=new THREE.Mesh(new THREE.BoxGeometry(5.4,1.5,0.7),headMat);
    head.position.y=22; grp.add(head);
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,transparent:true,
      blending:THREE.AdditiveBlending,depthWrite:false}));
    glow.scale.set(24,10,1); glow.position.y=22; grp.add(glow);
    grp.position.set(LINE.x[i]+LINE.nx[i]*off*side,0,LINE.z[i]+LINE.nz[i]*off*side);
    grp.lookAt(LINE.x[i],0,LINE.z[i]);
    scene.add(grp);
  }
  /* 🌴 ต้นปาล์ม + เนินทรายรอบนอก */
  const trunkMat=new THREE.MeshLambertMaterial({color:0x7a5a38});
  const leafMat=new THREE.MeshLambertMaterial({color:0x2f7a3a});
  for(let i=0;i<70;i++){
    const j=(i*97)%LINE.n;
    const side=i%2?1:-1;
    const off=HALF_W+RUNOFF_W+16+((i*53)%40);
    const x=LINE.x[j]+LINE.nx[j]*off*side, z=LINE.z[j]+LINE.nz[j]*off*side;
    if(surfAt(x,z).surf!=='sand') continue;
    const t=new THREE.Group();
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.45,7,5),trunkMat);
    trunk.position.y=3.5; t.add(trunk);
    for(let k=0;k<6;k++){
      const leaf=new THREE.Mesh(new THREE.ConeGeometry(0.5,4.6,4),leafMat);
      leaf.position.y=7.4;
      leaf.rotation.z=Math.PI/2.6;
      leaf.rotation.y=k*Math.PI/3;
      leaf.translateY(1.4);
      t.add(leaf);
    }
    t.position.set(x,0,z);
    scene.add(t);
  }
  /* pit lane */
  if(F1_MAP.pit&&F1_MAP.pit.length>2){
    const p=F1_MAP.pit,pos=[],uv=[],idx=[];
    for(let i=0;i<p.length;i++){
      const q=p[Math.min(i+1,p.length-1)],r=p[Math.max(i-1,0)];
      let dx=q[0]-r[0],dz=q[1]-r[1];
      const L=Math.hypot(dx,dz)||1e-6; dx/=L; dz/=L;
      /* 🛞 รอบ 905: กว้างเท่า PIT_HALF_W พอดี — ที่เห็น = ที่ลิมิตเตอร์จับ */
      pos.push(p[i][0]+dz*PIT_HALF_W,0.015,p[i][1]-dx*PIT_HALF_W,
               p[i][0]-dz*PIT_HALF_W,0.015,p[i][1]+dx*PIT_HALF_W);
      uv.push(i,0,i,1);
    }
    for(let i=0;i<p.length-1;i++) idx.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    geo.setIndex(idx); geo.computeVertexNormals();
    scene.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0x4a4e55})));
  }
  legacyArchitectureRoot=buildBuildings();
  legacyArchitectureRoot.name='F1_LEGACY_OSM_ARCHITECTURE';
  scene.add(legacyArchitectureRoot);
}

/* ============================================================
   🏎️ โมเดลรถ: GLB ผู้ใช้ (img/models/f1_car.glb) → ไม่มี = ประกอบเอง
   ============================================================ */
function glbEnsure(cb){
  if(glbSrc) return cb(glbSrc);
  if(glbTried||typeof THREE.GLTFLoader==='undefined') return cb(null);
  glbTried=true;
  try{
    const ld=new THREE.GLTFLoader();
    /* รอบ 898: โหลดตัว lite ก่อน (1.7MB · tex 1K — gltf-transform weld+simplify .5+resize จากไฟล์ผู้ใช้)
       ไม่มี/พัง → ตัวเต็ม f1_car.glb (3.4MB) → ไม่มีอีก = รถประกอบเอง */
    ld.load('img/models/f1_car_lite.glb',
      g=>{ glbSrc=g.scene; cb(glbSrc); }, undefined,
      ()=>ld.load('img/models/f1_car.glb',
        g=>{ glbSrc=g.scene; cb(glbSrc); }, undefined, ()=>cb(null)));
  }catch(e){ cb(null); }
}
function buildF1Car(color){
  /* รถ F1 ประกอบเอง: โมโนค็อก+จมูก+ปีกหน้า/หลัง+sidepod+halo+ล้อ — แกน +Z = หน้า */
  const g=new THREE.Group();
  const body=new THREE.MeshLambertMaterial({color});
  const dark=new THREE.MeshLambertMaterial({color:0x14161a});
  const wing=new THREE.MeshLambertMaterial({color:0x1b1e24});
  /* โมโนค็อก */
  const mono=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.55,3.4),body);
  mono.position.set(0,0.52,0.2); g.add(mono);
  /* จมูกเรียว */
  const nose=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.42,1.7,6),body);
  nose.rotation.x=Math.PI/2; nose.position.set(0,0.46,2.6); g.add(nose);
  /* ปีกหน้า */
  const fw=new THREE.Mesh(new THREE.BoxGeometry(1.95,0.09,0.62),wing);
  fw.position.set(0,0.24,3.35); g.add(fw);
  for(const s of [-1,1]){
    const ep=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.3,0.62),wing);
    ep.position.set(s*0.98,0.38,3.35); g.add(ep);
  }
  /* sidepods */
  for(const s of [-1,1]){
    const sp=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.5,1.9),body);
    sp.position.set(s*0.72,0.5,-0.25); g.add(sp);
  }
  /* ฝาครอบเครื่อง+ครีบฉลาม */
  const cover=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.5,1.7),body);
  cover.position.set(0,0.86,-1.0); g.add(cover);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.42,1.3),body);
  fin.position.set(0,1.22,-1.15); g.add(fin);
  /* halo */
  const halo=new THREE.Mesh(new THREE.TorusGeometry(0.44,0.05,6,14,Math.PI),dark);
  halo.rotation.x=Math.PI/2; halo.position.set(0,1.05,0.55); g.add(halo);
  const haloPost=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.42,5),dark);
  haloPost.position.set(0,0.9,0.97); haloPost.rotation.x=0.5; g.add(haloPost);
  /* คนขับ (หมวก) */
  const helm=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,7),new THREE.MeshLambertMaterial({color:0xffd12e}));
  helm.position.set(0,0.98,0.3); g.add(helm);
  /* ปีกหลัง + DRS (แผ่นบน = flap ที่เปิดได้ — รอบ 904) */
  const rw=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.08,0.5),wing);
  rw.position.set(0,1.02,-1.95); rw.rotation.x=DRS_FLAP_SHUT; g.add(rw);
  g.userData.drsFlap=rw;
  const rw2=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.07,0.34),wing);
  rw2.position.set(0,0.86,-1.9); g.add(rw2);
  for(const s of [-1,1]){
    const ep=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.4,0.55),wing);
    ep.position.set(s*0.75,0.86,-1.95); g.add(ep);
  }
  /* ไฟท้ายกะพริบ */
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.22,0.06),new THREE.MeshBasicMaterial({color:0xff2020}));
  tail.position.set(0,0.62,-2.15); g.add(tail); g.userData.tail=tail;
  /* พื้นรถ+ดิฟฟิวเซอร์ */
  const floor=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.07,3.6),dark);
  floor.position.set(0,0.18,-0.1); g.add(floor);
  /* ล้อ (ยาง slick + ล้อแม็ก) — เก็บอ้างอิงไว้หมุน/เลี้ยว */
  const tyreG=new THREE.CylinderGeometry(0.46,0.46,0.42,12);
  tyreG.rotateZ(Math.PI/2);
  const rimG=new THREE.CylinderGeometry(0.28,0.28,0.44,8);
  rimG.rotateZ(Math.PI/2);
  const tyreM=new THREE.MeshLambertMaterial({color:0x1a1a1c});
  const rimM=new THREE.MeshLambertMaterial({color:0x8f96a0});
  const ws=[],sp=[];
  [[-0.95,1.55,true],[0.95,1.55,true],[-0.95,-1.5,false],[0.95,-1.5,false]].forEach(([x,z,front])=>{
    const wg=new THREE.Group();
    const ty=new THREE.Mesh(tyreG,tyreM); wg.add(ty);
    const rim=new THREE.Mesh(rimG,rimM); wg.add(rim);
    wg.position.set(x,0.46,z);
    g.add(wg); ws.push(wg);
    if(front) sp.push(wg);
  });
  g.userData.wheels=ws; g.userData.front=sp;
  return g;
}
function makeCar(color,cb){
  glbEnsure(src=>{
    if(!src){ cb(buildF1Car(color)); return; }
    const g=new THREE.Group();
    const m=src.clone(true);
    /* จัดสเกล GLB อัตโนมัติ: รถ F1 ยาว ~5.6 ม. */
    const box=new THREE.Box3().setFromObject(m);
    const size=box.getSize(new THREE.Vector3());
    const L=Math.max(size.x,size.z)||1;
    const k=5.4/L; m.scale.setScalar(k);
    const b2=new THREE.Box3().setFromObject(m);
    m.position.y-=b2.min.y;
    /* ทิศหัวรถ: Tripo หันหน้า +Z ตรงกับแกนเกมอยู่แล้ว (พิสูจน์ด้วยภาพรอบ 898 — เดิมหมุน PI แล้วรถวิ่งถอยหลัง)
       โมเดลที่ยาวตามแกน X (นอน横) ค่อยหมุนตั้งให้ */
    if(size.x>size.z) m.rotation.y=Math.PI/2;
    g.add(m);
    g.userData.wheels=[]; g.userData.front=[];
    cb(g);
  });
}

/* ============================================================
   🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
   ============================================================ */
const CSS=`
#f1-wrap{position:fixed;inset:0;z-index:9500;display:none;background:#05060c;font-family:'Kanit','Segoe UI',sans-serif;
  -webkit-user-select:none;user-select:none;touch-action:none}
#f1-wrap.on{display:block}
#f1-cv{position:absolute;inset:0;width:100%;height:100%}
/* 🪖 รอบ 901: ภาพห้องคนขับทับ canvas (ช่องมองโปร่งใส — เห็นโลก 3D ทะลุ) + ปุ่มสลับมุมมอง */
#f1-cockpit{position:absolute;inset:0 0 -8% 0;z-index:5;pointer-events:none;display:none;overflow:hidden;
  background:url('img/f1/cockpit_body.webp') center bottom/cover no-repeat}   /* bottom -8% = จมูกรถจมลงใต้จอ เปิดมุมมองแทร็กกว้างขึ้น */
#f1-wrap.fp #f1-cockpit{display:block}
/* Realistic Circuit ต้องเห็น halo/จมูก/พวงมาลัย แต่ไม่ให้ภาพค็อกพิทปิดถนนเกือบทั้งจอ */
#f1-wrap.realistic.fp #f1-cockpit{inset:0;background-image:url('img/f1/cockpit_turn_center.webp');
  background-size:100% auto;background-position:center calc(100% + 1vh)}
/* Realistic uses one coherent helmet-eye plate. The legacy 1536x1024 wheel layers
   belong to Battery Saver and would otherwise create a second, misaligned photo. */
#f1-wrap.realistic.fp #f1-wheel,#f1-wrap.realistic.fp #f1-leds,#f1-wrap.realistic.fp #f1-quality-wheel{display:none!important}
/* ภาพเลี้ยวทับเฉพาะตอนมีมุมพวงมาลัย: car/halo เหมือนเฟรมกลางและ opacity ไล่ตาม steer
   ทำให้มือทั้งสองข้างหมุนตามจริงโดยใช้เพียง overlay เดียวบนมือถือ */
#f1-cockpit-turn{display:none!important;left:0!important;right:0;top:auto!important;bottom:-1vh;width:100%;height:auto;
  z-index:0;opacity:0;transform:none!important;will-change:opacity}
#f1-wrap.realistic.fp #f1-cockpit-turn{display:block!important}
/* Quality cockpit ใช้พวงมาลัยแยกชั้นแบบ procedural — บังพวงมาลัยที่ติดตายใน plate และหมุนตามฟิสิกส์จริง */
#f1-quality-wheel{position:absolute;left:40.1vw;bottom:-1.5vh;width:19.8vw;height:17.5vw;z-index:1;display:none;
  transform-origin:50% 62%;will-change:transform;clip-path:polygon(15% 10%,85% 10%,100% 34%,92% 92%,68% 100%,32% 100%,8% 92%,0 34%);
  background:linear-gradient(145deg,#657281 0 3%,#111923 4% 13%,#05080d 14% 82%,#25313d 83% 94%,#8794a0 95% 100%);
  box-shadow:0 0 0 2px rgba(199,224,242,.52),0 0 20px rgba(0,0,0,.95),inset 0 0 0 8px #05070a}
#f1-wrap.realistic.fp #f1-quality-wheel{display:none}
#f1-quality-wheel:before{content:'';position:absolute;inset:13% 16% 17%;clip-path:polygon(8% 0,92% 0,100% 30%,88% 100%,12% 100%,0 30%);
  background:linear-gradient(180deg,#1d2b37,#03070b 48%,#121b24);box-shadow:inset 0 0 0 2px rgba(103,216,255,.32)}
#f1-quality-wheel:after{content:'VOCAB GP';position:absolute;left:28%;right:28%;top:11%;height:9%;border-radius:999px;
  background:#cf161d;color:#fff;font:900 clamp(5px,.65vw,10px)/1.65 'Kanit',sans-serif;text-align:center;letter-spacing:.08em;
  box-shadow:0 0 10px rgba(255,34,48,.58)}
#f1-quality-wheel .qw-grip{position:absolute;top:27%;bottom:17%;width:18%;border-radius:42% 18% 24% 46%;
  background:repeating-linear-gradient(112deg,#050607 0 5px,#25292d 6px 8px);box-shadow:inset 0 0 0 2px #505a63}
#f1-quality-wheel .qw-grip.l{left:3%;transform:rotate(-5deg)}
#f1-quality-wheel .qw-grip.r{right:3%;transform:scaleX(-1) rotate(-5deg)}
#f1-quality-wheel .qw-led{position:absolute;left:31%;right:31%;top:19%;height:4%;border-radius:999px;
  background:linear-gradient(90deg,#28ef7b 0 32%,#ffd12e 33% 65%,#ff3548 66%);box-shadow:0 0 8px rgba(103,216,255,.6)}
/* Keep live gear/speed/RPM on the integrated wheel. Coordinates follow the new
   1672x941 landscape plate, independent of the legacy wheel-image layout. */
#f1-wrap.realistic.fp #f1-dash{display:block!important;left:44vw!important;top:calc(101vh - 14vw)!important;
  width:12vw!important;height:6.1vw!important;transform-origin:center!important}
/* 🎡 รอบ 913: ชั้นพวงมาลัยแยก — ขนาด/ตำแหน่งคำนวณจาก JS ให้ทับ "กรอบภาพจริง" ของ background ด้านบนเป๊ะ
   (overflow:hidden ข้างบน = ตัดส่วนเกินเหมือน background cover ทำ) */
#f1-cockpit img,#f1-cockpit canvas{position:absolute;left:0;top:0;display:block;will-change:transform}
/* 🚥 รอบ 918: ชั้นดวงไฟ LED บนพวงมาลัย — กรอบ/จุดหมุน/การหมุน ใช้ชุดเดียวกับ <img> พวงมาลัยเป๊ะ */
#f1-leds{position:absolute;left:0;top:0;display:block;pointer-events:none;will-change:transform}
#f1-leds i{position:absolute;border-radius:22%;opacity:0}
#f1-leds i.on{opacity:1}
#f1-leds i.g{background:#3dff72;box-shadow:0 0 5px 1px rgba(61,255,114,.9)}
#f1-leds i.y{background:#ffd12e;box-shadow:0 0 5px 1px rgba(255,209,46,.9)}
#f1-leds i.r{background:#ff3b2f;box-shadow:0 0 6px 2px rgba(255,59,47,.95)}
#f1-leds i.f{background:#fff;box-shadow:0 0 8px 3px rgba(255,70,60,.95)}
/* 🔢 รอบ 916: จอตัวเลขจริงบนพวงมาลัย — วางทับเฉพาะ "กรอบจอ" แล้วหมุนไปพร้อมพวงมาลัย (transform เดียวกัน) */
#f1-dash{z-index:1}
/* จอกว้างเตี้ย (มือถือแนวนอน) — cover จะเอาค็อกพิทบังเต็มจอ: ตรึงขอบบน (halo อยู่ครบ) + สูง 128%
   ตัดหน้าปัด/ขอบล่างทิ้งใต้จอแทน · บีบแนวตั้ง ~10% ตามองไม่ออก แต่เปิดพื้นที่เห็นแทร็กเพิ่มมาก */
@media (min-aspect-ratio: 9/5){
  #f1-wrap.fp #f1-cockpit{inset:0;background-size:100% 128%;background-position:center top}
  /* The wide plate already matches a landscape driver view; keep its sides at the
     viewport edges so bodywork never terminates as a visible rectangular cutout. */
  #f1-wrap.realistic.fp #f1-cockpit{background-size:100% auto;background-position:center calc(100% + 1vh)}
}
/* 🧭 รอบ 914: ย้ายปุ่ม "มุมกล้อง" + "ออก" ขึ้นแถวขวาบน เรียงก่อนถึงเหรียญ (เดิมอยู่ซ้ายล่าง ทับที่ของแถบเลี้ยว)
   เหรียญย้ายเข้ามาเป็นลูกของแถวนี้ด้วย จึงไม่ต้องเดาความกว้างเหรียญเวลาเลขยาว */
#f1-topright{position:absolute;right:10px;top:8px;z-index:7;display:flex;align-items:center;gap:6px}
#f1-cambtn,#f1-exitbtn{position:static;background:rgba(8,12,24,.78);
  border:1px solid rgba(255,255,255,.25);color:#fff;font-weight:800;font-size:13.5px;font-family:inherit;
  border-radius:12px;padding:6px 11px;white-space:nowrap}
#f1-exitbtn{background:rgba(216,26,26,.85);border-color:rgba(255,255,255,.25)}
#f1-topright #f1-coins{position:static;right:auto;top:auto}
#f1-word{position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;
  background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:5px 12px;white-space:nowrap;z-index:6}
#f1-word .f-chip{display:inline-block;min-width:24px;padding:2px 5px;margin:0 1px;border-radius:7px;background:#26304a;
  color:#8fa2c8;font-weight:800;font-size:17px;text-align:center;text-transform:uppercase}
#f1-word .f-chip.got{background:#ffd12e;color:#5c3500}
#f1-word .f-th{color:#cfe0ff;font-size:14px}
/* 🎛️ รอบ 921: ผู้ใช้ขอย้าย "ความเร็ว กม./ชม." มากลางล่าง (เดิมมุมขวาล่าง ซึ่งตอนนี้เป็นที่ของปุ่มเร่งที่ยกขึ้นมา) */
#f1-hud{position:absolute;left:50%;transform:translateX(-50%);bottom:6px;text-align:center;z-index:6;pointer-events:none}
#f1-speed{font-size:44px;font-weight:900;color:#fff;line-height:1;text-shadow:0 2px 10px #000}
#f1-speed small{font-size:14px;color:#9fb2d8}
#f1-gear{display:inline-block;margin-top:2px;background:#e10600;color:#fff;font-weight:900;font-size:20px;
  border-radius:8px;padding:1px 10px}
#f1-laps{position:absolute;left:10px;top:8px;background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.16);
  border-radius:12px;padding:6px 10px;color:#fff;font-size:13px;line-height:1.5;z-index:6;pointer-events:none}
#f1-laps b{color:#ffd12e}
#f1-coins{position:absolute;right:10px;top:8px;background:rgba(8,12,24,.72);border:1px solid rgba(255,209,46,.35);
  border-radius:12px;padding:6px 12px;color:#ffd12e;font-weight:800;font-size:15px;z-index:6}
#f1-map{position:absolute;left:10px;bottom:calc(var(--f1-sh) + 16px);width:130px;height:130px;z-index:6;opacity:.92;pointer-events:none}  /* 🧭 รอบ 914 — ยกพ้นแถบเลี้ยวที่ย้ายมาชิดซ้าย · 🎛️ รอบ 921 — วัดจากความสูงแถบเลี้ยวเอง */
#f1-wrong{position:absolute;top:34%;left:50%;transform:translateX(-50%);background:rgba(216,26,26,.9);color:#fff;
  font-weight:900;font-size:20px;border-radius:12px;padding:8px 18px;display:none;z-index:7}
/* 🏜️ รอบ 911: ป้ายเกิดใหม่หลังหลุดสนาม */
#f1-resp{position:absolute;top:42%;left:50%;transform:translateX(-50%);background:rgba(18,168,84,.92);color:#fff;
  font-weight:900;font-size:20px;border-radius:12px;padding:8px 18px;display:none;z-index:7}
/* 🌀 หลุดแนวถนน → ประตูมิติแบบ procedural (ไม่มีภาพเต็มจอเพิ่ม): วงแหวน/ประกายใช้ CSS GPU layer */
#f1-portal{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;opacity:0;
  background:radial-gradient(ellipse at 50% 44%,rgba(130,35,255,.18),rgba(5,2,18,0) 58%);transition:opacity .16s}
#f1-portal .gate{position:absolute;left:50%;top:44%;width:min(69vw,760px);height:min(59vh,470px);border-radius:50%;
  transform:translate(-50%,-50%) scale(.08);opacity:0;border:clamp(6px,1.2vw,15px) solid rgba(228,178,255,.94);
  box-shadow:0 0 12px #fff,0 0 34px #d83cff,0 0 76px #792cff,inset 0 0 26px #cc48ff;
  transition:transform .62s cubic-bezier(.18,.85,.25,1.2),opacity .16s;will-change:transform,opacity}
#f1-portal .gate:before,#f1-portal .gate:after{content:'';position:absolute;inset:-8%;border-radius:50%;border:4px dashed #ff70f2;
  box-shadow:0 0 22px #b52cff;animation:f1portalpulse .58s ease-in-out infinite alternate}
#f1-portal .gate:after{inset:5%;border-color:#58bfff;animation-delay:-.29s;animation-duration:.74s}
#f1-portal .core{position:absolute;inset:5%;border-radius:50%;background:radial-gradient(ellipse,rgba(14,8,45,.02) 34%,rgba(161,42,255,.16) 64%,rgba(255,112,244,.42));
  box-shadow:inset 0 0 55px rgba(117,55,255,.8)}
#f1-portal .sparks{position:absolute;inset:-14%}
#f1-portal .sparks i{--a:0deg;position:absolute;left:50%;top:50%;width:clamp(4px,.65vw,9px);height:clamp(18px,3.5vw,52px);
  border-radius:99px;background:linear-gradient(#fff,#ff55ed,transparent);transform-origin:50% 0;
  transform:rotate(var(--a)) translateY(-38vh);filter:drop-shadow(0 0 6px #d94dff);animation:f1portalspark .7s ease-in infinite}
#f1-portal .sparks i:nth-child(2){--a:40deg;animation-delay:-.1s}#f1-portal .sparks i:nth-child(3){--a:80deg;animation-delay:-.35s}
#f1-portal .sparks i:nth-child(4){--a:120deg;animation-delay:-.2s}#f1-portal .sparks i:nth-child(5){--a:160deg;animation-delay:-.5s}
#f1-portal .sparks i:nth-child(6){--a:200deg;animation-delay:-.28s}#f1-portal .sparks i:nth-child(7){--a:240deg;animation-delay:-.42s}
#f1-portal .sparks i:nth-child(8){--a:280deg;animation-delay:-.18s}#f1-portal .sparks i:nth-child(9){--a:320deg;animation-delay:-.6s}
#f1-portal.on{opacity:1}#f1-portal.on .gate{opacity:1;transform:translate(-50%,-50%) scale(1)}
#f1-portal.jump{opacity:1;background:rgba(245,225,255,.88)}#f1-portal.jump .gate{opacity:0;transform:translate(-50%,-50%) scale(1.28)}
@keyframes f1portalpulse{from{opacity:.38;transform:scale(.96)}to{opacity:1;transform:scale(1.035)}}
@keyframes f1portalspark{0%{opacity:0;scale:.2}32%{opacity:1}100%{opacity:0;scale:1.35}}
/* 🪽 ป้าย DRS (รอบ 898) — ซ่อนตอนไม่อยู่ในโซน · เทาตอนยังเปิดไม่ได้ · เขียวเรืองตอนเปิด */
#f1-drs{position:absolute;right:10px;bottom:calc(var(--f1-pedb) + 150px);z-index:6;pointer-events:none;display:none;text-align:right;
  border-radius:12px;padding:4px 11px;font-weight:900;font-size:19px;line-height:1.15;letter-spacing:.5px}
#f1-drs small{display:block;font-size:11px;font-weight:600;letter-spacing:0;opacity:.95}
#f1-drs.wait{display:block;background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.22);color:#9fb2d8}
#f1-drs.on{display:block;background:rgba(22,190,90,.92);border:1px solid #7dffb0;color:#fff;
  box-shadow:0 0 16px rgba(45,255,140,.6);animation:f1drs .5s ease-in-out infinite alternate}
@keyframes f1drs{from{box-shadow:0 0 8px rgba(45,255,140,.35)}to{box-shadow:0 0 20px rgba(45,255,140,.75)}}
/* 🚦 แถบไฟสตาร์ทบนจอ (รอบ 902) — ท้ายกริดห่างซุ้มเกือบ 100 ม. ไฟจริงเล็กมาก ต้องมีบนจอด้วย */
#f1-lights{position:absolute;top:50px;left:50%;transform:translateX(-50%);z-index:7;display:none;
  flex-direction:column;align-items:center;gap:5px;pointer-events:none}
#f1-lights.on{display:flex}
#f1-lights .row{display:flex;gap:9px;background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.18);
  border-radius:14px;padding:7px 12px}
#f1-lights i{width:20px;height:20px;border-radius:50%;background:#2a1010;border:1px solid rgba(255,255,255,.14);
  transition:background .1s,box-shadow .1s}
#f1-lights i.lit{background:radial-gradient(circle at 35% 30%,#ff8080,#e10600);box-shadow:0 0 14px rgba(225,6,0,.95)}
#f1-lights b{background:rgba(8,12,24,.78);border-radius:10px;padding:3px 12px;color:#ffd12e;font-size:13.5px;font-weight:800}
/* 👻 ป้ายต่างจากรถเงากี่วินาที (รอบ 902) */
#f1-gap{position:absolute;top:52px;left:50%;transform:translateX(-50%);z-index:6;display:none;pointer-events:none;
  border-radius:12px;padding:3px 13px;font-weight:900;font-size:17px;background:rgba(8,12,24,.74)}
#f1-gap.on{display:block}
#f1-gap.fast{color:#7dffb0;border:1px solid rgba(125,255,176,.5)}
#f1-gap.slow{color:#ff9a9a;border:1px solid rgba(255,120,120,.45)}
#f1-ban{position:absolute;top:20%;left:50%;transform:translate(-50%,0) scale(.9);background:rgba(10,16,30,.92);
  border:1px solid rgba(255,209,46,.5);border-radius:16px;padding:12px 22px;color:#fff;font-size:19px;font-weight:800;
  text-align:center;opacity:0;pointer-events:none;transition:all .25s;z-index:8}
#f1-ban.show{opacity:1;transform:translate(-50%,0) scale(1)}
#f1-ban .m-coin{color:#ffd12e}
#f1-board{position:absolute;left:10px;top:64px;background:rgba(8,12,24,.78);border:1px solid rgba(255,255,255,.14);
  border-radius:12px;padding:7px 10px;min-width:150px;color:#dfe9ff;font-size:12.5px;display:none;z-index:6}
#f1-board.on{display:block}
#f1-board .m-bd-h{font-weight:800;color:#ffd12e;margin-bottom:3px}
#f1-board .m-bd-r{display:flex;gap:5px;align-items:center;line-height:1.6;white-space:nowrap}
#f1-board .m-bd-r.me .m-bd-n{color:#7dffb0}
#f1-board .m-bd-n{overflow:hidden;text-overflow:ellipsis;max-width:130px}
#f1-board .m-bd-w{margin-left:auto;font-weight:800}
#f1-chatbar{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--f1-sh) + 16px);display:none;gap:6px;z-index:7;
  flex-wrap:wrap;justify-content:center;max-width:92vw}   /* 🎛️ รอบ 921 — ยกขึ้นเหนือแถบเลี้ยว/ปุ่มเร่งที่ใหญ่ขึ้น (เดิมโดนทับจนกดไม่ได้) */
#f1-chatbar.on{display:flex}
#f1-chatbar button{background:rgba(14,22,40,.9);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:20px;
  padding:6px 12px;font-size:13px;font-family:inherit}
#f1-chatbtn{position:absolute;right:10px;bottom:calc(var(--f1-pedb) + 98px);width:44px;height:44px;border-radius:50%;z-index:7;
  background:rgba(14,22,40,.85);border:1px solid rgba(255,255,255,.3);color:#fff;font-size:20px}
#f1-selfmsg{position:absolute;bottom:150px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.92);
  color:#12283f;border-radius:14px;padding:5px 14px;font-size:14px;font-weight:700;display:none;z-index:7}
#f1-selfmsg.on{display:block}
/* 🔄 รอบ 911: แถบเลี้ยวหนาขึ้น 2 เท่า (64→128) · 🧭 รอบ 914: ชิดซ้ายสุด (ปุ่ม 📷/🏁 ย้ายขึ้นขวาบนแล้ว)
   🎛️ รอบ 921 (ผู้ใช้ชี้จากเครื่องจริง): หนาขึ้นอีกเท่าตัว + ยกปุ่มเร่งขึ้นมาสูงเกือบครึ่งจอ
   --f1-sh = ความสูงแถบเลี้ยว (เพดาน 44vh = สูงเกือบครึ่งจอพอดีตามที่ผู้ใช้ขีดเส้นไว้)
   --f1-pedb = ระยะยกแถวคันเร่ง/เบรก ให้ "ขอบบนปุ่มเร่ง" เสมอกับขอบบนแถบเลี้ยวพอดี
   ของอื่นที่เคยตรึงเป็น px (มินิแมป/ปุ่มแชท/ป้าย DRS) วัดต่อจาก 2 ตัวนี้ จะได้ขยับตามกันเองทุกขนาดจอ */
#f1-wrap{--f1-sh:min(256px,44vh);--f1-sw:min(38vw,270px);--f1-pedb:max(8px,calc(var(--f1-sh) - 78px));
  /* ลูกบิดต้อง "เตี้ยกว่าแถบ" และ "แคบกว่าแถบพอควร" ด้วย — ไม่งั้นลูกบิดกว้างเท่าแถบจนเลื่อนแทบไม่ขยับ
     (สูตรเลื่อนใน steerTo คือ 1−ลูกบิด/แถบ · 55% ให้ระยะเลื่อน ±22.5% เห็นชัดว่าเลี้ยวมากน้อยแค่ไหน) */
  --f1-kn:min(calc(var(--f1-sh) - 14px),calc(var(--f1-sw)*0.55))}
#f1-steer{position:absolute;left:8px;bottom:8px;width:var(--f1-sw);height:var(--f1-sh);background:rgba(255,255,255,.10);
  border:1px solid rgba(255,255,255,.22);border-radius:calc(var(--f1-sh)/2);z-index:7}
#f1-knob{position:absolute;top:calc((var(--f1-sh) - var(--f1-kn))/2);left:50%;width:var(--f1-kn);height:var(--f1-kn);
  margin-left:calc(var(--f1-kn)/-2);border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#ffb054,#e07800);box-shadow:0 2px 8px rgba(0,0,0,.5);
  display:flex;align-items:center;justify-content:center;font-size:min(46px,calc(var(--f1-kn)*0.34))}
#f1-pedals{position:absolute;right:10px;bottom:var(--f1-pedb);display:flex;gap:10px;z-index:7}
.f1-pedal{width:72px;height:72px;border-radius:50%;border:none;font-size:26px;font-family:inherit;font-weight:900;
  color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.5)}
#f1-brake{background:radial-gradient(circle at 35% 30%,#ff6a6a,#b41414)}
/* ⏪ รอบ 911: ปุ่มเกียร์ถอย — เล็กกว่าเบรก วางชิดล่างเสมอกัน */
#f1-reverse{background:radial-gradient(circle at 35% 30%,#c9d2dc,#5a6470);width:56px;height:56px;
  font-size:22px;align-self:flex-end}
#f1-pedals{align-items:flex-end}
#f1-throttle{background:radial-gradient(circle at 35% 30%,#68c6ff,#0a6ac0);width:86px;height:86px}
.f1-pedal:active{transform:scale(.94)}
#f1-intro{position:absolute;inset:0;background:rgba(4,8,18,.86);display:flex;align-items:center;justify-content:center;
  z-index:9;text-align:center}
#f1-intro .box{max-width:min(640px,92vw);background:rgba(14,22,42,.96);border:1px solid rgba(255,209,46,.4);border-radius:18px;
  padding:14px 20px;color:#dfe9ff;font-size:clamp(11px,2.6vh,14px);line-height:1.55;max-height:92vh;overflow:hidden;
  display:flex;flex-direction:column}
#f1-intro h2{color:#ffd12e;font-size:clamp(15px,3.4vh,20px);margin:0 0 4px}
#f1-intro button{background:#e10600;color:#fff;border:none;border-radius:12px;padding:clamp(6px,1.6vh,10px) 26px;
  font-size:clamp(13px,2.8vh,17px);font-weight:800;font-family:inherit;margin-top:8px;align-self:center}
#f1-legalbtn{background:transparent!important;color:#b9c8e5!important;border:1px solid rgba(255,255,255,.25)!important;
  padding:clamp(3px,1vh,5px) 10px!important;margin-left:7px!important;font-size:clamp(9px,2vh,11px)!important}
/* 🏆 กระดานอันดับ Best Lap ในหน้า intro (รอบ 903) */
#f1-intro .fi-cols{display:flex;gap:14px;text-align:left;margin-top:2px;min-height:0}
/* 👥 รอบ 939: บีบระยะบรรทัดคอลัมน์กติกา (1.55→1.4) — เพิ่มข้อมูล "เล่นกับเพื่อน" แล้วต้องยังพอดีจอ ไม่มี scroll (กฎทอง #7) */
#f1-intro .fi-rules{flex:1.15;min-width:0;line-height:1.4}
#f1-intro .fi-rank{flex:1;min-width:0;background:rgba(255,255,255,.06);border-radius:12px;padding:6px 9px;
  display:flex;flex-direction:column;min-height:0}
#f1-intro .fi-rank-h{font-weight:800;color:#ffd12e;margin-bottom:3px;font-size:clamp(11px,2.4vh,13px);flex:none}
/* กริด 2 คอลัมน์ (ไม่ใช่ลิสต์แถวเดียว) — ท็อป 10 แถวสูง ๆ (อีโมจิ/ดาวดันบรรทัดสูงกว่าที่ตั้งไว้ในทุกเบราว์เซอร์ที่ทดสอบ)
   ต่อแถวเดียวแล้วสูงเกินจอเตี้ย 375px ขัดกฎทอง #7 — แบ่ง 2 คอลัมน์ลดความสูงรวมลงครึ่งหนึ่ง ยังเห็นครบ 10 ไม่ต้องเลื่อน */
.fr-list{overflow:hidden;flex:1;display:grid;grid-template-columns:1fr 1fr;column-gap:8px;row-gap:0;align-content:start}
.fr-row{display:flex;align-items:center;gap:4px;line-height:1.3;font-size:clamp(9px,1.8vh,11.5px);white-space:nowrap;min-width:0}
.fr-row.me .fr-nm{color:#7dffb0}
.fr-rk{width:14px;text-align:center;flex:none}
.fr-nm{overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.fr-tm{flex:none;font-weight:800;color:#ffd12e}
.fr-note{margin-top:3px;font-size:clamp(8.5px,1.7vh,10.5px);color:#9fb2d8;line-height:1.25;flex:none}
.fr-none{font-size:clamp(9.5px,2vh,12px);color:#9fb2d8;grid-column:1/-1}
.fr-more{font-size:clamp(9px,1.8vh,11px);color:#7c8bab;text-align:center;grid-column:1/-1}
.fr-more + .fr-row{grid-column:1/-1}
@media (max-width:620px){
  #f1-intro .fi-cols{flex-direction:column}
}
#f1-exitbox{position:absolute;inset:0;background:rgba(4,8,18,.8);display:none;align-items:center;justify-content:center;z-index:10}
#f1-exitbox.on{display:flex}
#f1-exitbox .box{background:rgba(14,22,42,.97);border:1px solid rgba(255,255,255,.25);border-radius:18px;
  padding:18px 24px;color:#fff;text-align:center}
#f1-exitbox button{border:none;border-radius:12px;padding:9px 22px;font-size:15px;font-weight:800;font-family:inherit;margin:6px}
#f1-stay{background:#2e9e4a;color:#fff}
#f1-leave{background:#d81a1a;color:#fff}
#f1-legal{position:absolute;inset:0;z-index:12;display:none;align-items:center;justify-content:center;background:rgba(4,8,18,.94);padding:8px;box-sizing:border-box}
#f1-legal.on{display:flex}
#f1-legal .box{width:min(920px,97vw);max-height:calc(100vh - 16px);overflow:hidden;background:#101a30;border:1px solid rgba(255,209,46,.45);
  border-radius:16px;padding:clamp(8px,2vh,14px);box-sizing:border-box;text-align:left}
#f1-legal h2{text-align:center;color:#ffd12e;margin:0 0 clamp(5px,1.5vh,9px);font-size:clamp(14px,3.5vh,20px)}
#f1-legal .legal-cols{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,2vw,18px)}
#f1-legal .legal-copy{font-size:clamp(9px,2.25vh,12.5px);line-height:1.35;color:#d7e2f5}
#f1-legal .legal-copy b{display:block;color:#67d8ff;margin-bottom:2px}
#f1-legal #f1-legalclose{display:block;margin:clamp(6px,1.5vh,10px) auto 0;background:#33405a;color:#fff;border:0;border-radius:10px;
  padding:clamp(5px,1.4vh,8px) 24px;font:800 clamp(11px,2.5vh,14px) inherit;cursor:pointer}
/* ============================================================
   ✨ PREMIUM RACE HUD — รอบ 1203 · brushed metal + glass + neon accent
   ============================================================ */
#f1-wrap{--f1-cyan:#67d8ff;--f1-red:#ff3145;--f1-gold:#ffd12e;--f1-glass:rgba(5,12,23,.78)}
#f1-word,#f1-laps,#f1-topright>button,#f1-topright #f1-coins,#f1-board,#f1-lights .row{
  background:linear-gradient(145deg,rgba(35,48,63,.92),rgba(4,9,18,.90) 58%,rgba(20,29,42,.92));
  border:1px solid rgba(180,221,244,.46);box-shadow:inset 0 1px 0 rgba(255,255,255,.26),inset 0 -1px 0 rgba(0,0,0,.8),0 4px 16px rgba(0,0,0,.42)}
#f1-word:before,#f1-laps:before{content:'';position:absolute;inset:2px;border:1px solid rgba(103,216,255,.16);border-radius:inherit;pointer-events:none}
#f1-word{padding:6px 15px;border-radius:17px}
#f1-word .f-chip{background:linear-gradient(180deg,#35445c,#111a2b);border:1px solid rgba(194,221,243,.18);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14);border-radius:8px}
#f1-word .f-chip.got{background:linear-gradient(180deg,#ffe85e,#e4a900);color:#1a1200;box-shadow:0 0 10px rgba(255,209,46,.38)}
#f1-exitbtn{background:linear-gradient(180deg,#e82d3d,#7e0711)!important;border-color:rgba(255,128,138,.72)!important}
#f1-cambtn{background:linear-gradient(180deg,#26364a,#07101c)!important}
#f1-topright #f1-coins{color:var(--f1-gold);border-color:rgba(255,209,46,.58)}
#f1-steer{left:10px;bottom:9px;width:min(25vw,180px);height:min(25vw,180px);max-height:43vh;max-width:43vh;
  border:1px solid rgba(160,216,244,.62);border-radius:50%;background:radial-gradient(circle,#0c1623 0 27%,#43505d 28% 31%,#07101a 32% 51%,#75818b 52% 54%,rgba(9,16,27,.66) 55% 70%,rgba(103,216,255,.12));
  box-shadow:inset 0 0 0 4px rgba(2,7,13,.72),inset 0 0 18px #000,0 0 0 1px #05080c,0 8px 26px rgba(0,0,0,.52)}
#f1-steer:before{content:'‹                                      ›';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  color:#c8e8fb;font:900 clamp(17px,3vw,29px)/1 monospace;letter-spacing:.05em;text-shadow:0 0 9px var(--f1-cyan)}
#f1-knob{--ctl-turn:0deg;top:18%;left:18%!important;width:64%;height:64%;margin:0;border-radius:38%;font-size:clamp(19px,3.5vw,34px);
  background:linear-gradient(145deg,#526170 0 5%,#101b27 6% 25%,#03070b 26% 72%,#293746 73% 94%,#8a98a3 95%);
  box-shadow:inset 0 0 0 5px #06090d,inset 0 0 0 7px rgba(103,216,255,.22),0 0 14px rgba(0,0,0,.85);
  transform:rotate(var(--ctl-turn));transition:transform .08s linear}
#f1-knob:before{content:'';position:absolute;width:118%;height:24%;left:-9%;top:38%;border-radius:14px;background:#080d13;box-shadow:inset 0 0 0 3px #37434d;z-index:-1}
#f1-pedals{right:12px;gap:8px;align-items:flex-end}
.f1-pedal{position:relative;width:70px;height:96px;border-radius:18px;border:1px solid rgba(194,226,244,.65);
  background:linear-gradient(145deg,#394957,#07101a 48%,#151f2a)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.26),inset 0 0 0 4px #060b11,0 7px 20px rgba(0,0,0,.55);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
.f1-pedal b{font-size:24px;line-height:1}.f1-pedal small{font-size:8px;letter-spacing:.08em;color:#b8cad8}
#f1-reverse{width:62px;height:82px;border-color:rgba(184,202,216,.58)}
#f1-brake{border-color:rgba(255,70,88,.85);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 0 0 4px #15070a,0 0 18px rgba(255,28,52,.3)}
#f1-brake b{color:#ff5163;text-shadow:0 0 9px rgba(255,31,54,.9)}
#f1-throttle{width:76px;height:104px;border-color:rgba(50,199,255,.92);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 0 0 4px #03121a,0 0 20px rgba(0,170,255,.34)}
#f1-throttle b{color:#67ddff;text-shadow:0 0 10px rgba(0,190,255,.95)}
#f1-hud{background:linear-gradient(180deg,rgba(21,31,44,.78),rgba(2,6,11,.82));border:1px solid rgba(179,220,243,.28);
  border-radius:16px;padding:4px 16px 6px;box-shadow:inset 0 1px rgba(255,255,255,.12),0 5px 20px rgba(0,0,0,.42)}
#f1-gear{clip-path:polygon(12% 0,88% 0,100% 25%,100% 75%,88% 100%,12% 100%,0 75%,0 25%);
  background:linear-gradient(180deg,#ff3145,#8d0712);border-radius:0;min-width:24px}
@media (max-height:430px){
  #f1-speed{font-size:30px}
  /* 🧭 รอบ 914: จอเตี้ย — แถบเลี้ยวเตี้ยลงหน่อย แล้วยกมินิแมป/ปุ่มขวาบนให้พ้นกัน
     🎛️ รอบ 921: ความสูง/ตำแหน่งย้ายไปคุมด้วย --f1-sh/--f1-pedb แล้ว (เพดาน 44vh คุมจอเตี้ยให้เอง)
     เหลือแค่ "ความกว้าง" ที่ยังต่างจากจอใหญ่ */
  #f1-wrap{--f1-sh:min(200px,44vh);--f1-sw:min(40vw,250px)}
  #f1-steer{width:min(24vw,156px);height:min(24vw,156px)}
  #f1-word{gap:4px;padding:5px 9px}
  #f1-word .f-chip{min-width:18px;padding:1px 3px;font-size:13px}
  #f1-word .f-th{font-size:11px}
  .f1-pedal{width:58px;height:78px}.f1-pedal b{font-size:19px}.f1-pedal small{font-size:7px}
  #f1-reverse{width:50px;height:65px}#f1-throttle{width:63px;height:86px}
  #f1-cambtn,#f1-exitbtn{font-size:12px;padding:4px 8px;border-radius:10px}
  #f1-map{width:96px;height:96px}
  #f1-drs{font-size:15px;padding:3px 9px}
  #f1-drs small{font-size:10px}
}`;
function buildDom(){
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='f1-wrap';
  wrapEl.innerHTML=`
    <canvas id="f1-cv"></canvas>
    <div id="f1-cockpit"><img id="f1-wheel" alt=""><div id="f1-leds"></div>
      <div id="f1-quality-wheel" aria-hidden="true"><i class="qw-grip l"></i><i class="qw-grip r"></i><i class="qw-led"></i></div>
      <img id="f1-cockpit-turn" alt="" aria-hidden="true">
      <canvas id="f1-dash"></canvas></div>
    <div id="f1-word"></div>
    <div id="f1-laps"></div>
    <div id="f1-topright">
      <button id="f1-cambtn">📷 มุมรถ</button>
      <button id="f1-exitbtn">🏁 ออก</button>
      <div id="f1-coins">🪙 +0</div>
    </div>
    <div id="f1-board"></div>
    <canvas id="f1-map" width="260" height="260"></canvas>
    <div id="f1-hud"><div id="f1-speed">0<small> กม./ชม.</small></div><span id="f1-gear">N</span></div>
    <div id="f1-drs"></div>
    <div id="f1-lights"><div class="row"><i></i><i></i><i></i><i></i><i></i></div><b>🚦 รอไฟดับก่อนออกตัว</b></div>
    <div id="f1-gap"></div>
    <div id="f1-wrong">↩️ วิ่งผิดทาง! กลับรถ</div>
    <div id="f1-portal" aria-hidden="true"><div class="gate"><div class="core"></div><div class="sparks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>
    <div id="f1-resp">🌀 กลับเข้าเส้นทางแล้ว!</div>
    <div id="f1-ban"></div>
    <div id="f1-selfmsg"></div>
    <button id="f1-chatbtn">💬</button>
    <div id="f1-chatbar"></div>
    <div id="f1-steer"><div id="f1-knob">🏎️</div></div>
    <div id="f1-pedals">
      <button class="f1-pedal" id="f1-reverse"><b>R</b><small>REVERSE</small></button>
      <button class="f1-pedal" id="f1-brake"><b>◉</b><small>BRAKE</small></button>
      <button class="f1-pedal" id="f1-throttle"><b>ϟ</b><small>BOOST</small></button>
    </div>
    <div id="f1-intro"><div class="box">
      <h2>🏎️ Vocab World Racing · Vocab Grand Circuit</h2>
      <div class="fi-cols">
        <div class="fi-rules">
          Vocab Motors VR-X1 · Open-Wheel Racing · สนามกลางทะเลทราย 5.4 กม. 15 โค้งใต้แสงไฟ!<br>
          ⚡ คันเร่ง · 🛑 เบรก · ลูกบิดส้ม = พวงมาลัย (คีย์บอร์ด W/S เร่ง-เบรก · A/D เลี้ยว)<br>
          🔤 เก็บตัวอักษรบนแทร็กประกอบคำ = <b style="color:#ffd12e">+${REWARD} 🪙</b><br>
          🏁 จับเวลาทุกรอบ — ทำ Best Lap ให้ไวสุด! 🚦 สตาร์ทจริง: ไฟแดง 5 ดวง<b style="color:#ffd12e">ดับพร้อมกัน = ออกตัว</b><br>
      👻 ทำเวลาแล้ว รอบถัดไปมี<b style="color:#67d8ff">รถเงาของตัวเอง</b>ให้ไล่แข่ง<br>
          🪽 <b style="color:#2dff8c">DRS</b> = ทางตรง 2 ช่วง (เส้นเขียว) ตามรถคันหน้าใกล้ 25 ม. ปีกหลังเปิดเอง เร็วขึ้น 8%<br>
          🚧 <b style="color:#67d8ff">เลนพิท</b> (เส้นประ) จำกัดความเร็วอัตโนมัติ 80 กม./ชม.<br>
          🪖 ปุ่มขวาบนสลับ 3 มุมกล้อง: คนขับ → รถทั้งคัน → <b style="color:#67d8ff">ถนนล้วน</b><br>
          🧑‍🤝‍🧑 <b style="color:#2dff8c">เล่นกับเพื่อนพร้อมกันได้!</b> ต่อเน็ตเข้ามา = อยู่สนามเดียวกันเอง คุยกันได้ ·
          <b style="color:#ffd12e">สนามละไม่เกิน ${ROOM_MAX} คน</b> เต็มแล้วเปิดสนามใหม่ให้เอง ·
          กด <b style="color:#67d8ff">👥 ไปหาเพื่อน</b> บนกระดาน = ไปสนามเดียวกับเพื่อน<br>
          ⚠️ ออกนอกแทร็ก ทรายลื่นและช้าลงมาก
        </div>
        <div class="fi-rank" id="f1-rankbox">
          <div class="fi-rank-h">🏆 อันดับ Best Lap</div>
          <div class="fr-list"></div>
          <div class="fr-note"></div>
        </div>
      </div>
      <button id="f1-go">สตาร์ทเครื่อง! 🏎️</button><button id="f1-legalbtn">⚖️ Legal / Third-Party Rights</button>
    </div></div>
    <div id="f1-legal" role="dialog" aria-modal="true" aria-labelledby="f1-legal-title"><div class="box">
      <h2 id="f1-legal-title">⚖️ Legal / Third-Party Rights</h2>
      <div class="legal-cols">
        <div class="legal-copy"><b>English</b>Third-party names, trademarks, vehicle names, manufacturer names, logos, and other intellectual property are the property of their respective owners. Vocab World is an independent educational game and is not affiliated with, sponsored by, endorsed by, or officially associated with any automobile manufacturer, motorsport organization, racing team, championship, or other third-party rights holder.</div>
        <div class="legal-copy"><b>ไทย</b>ชื่อ เครื่องหมายการค้า ชื่อรถ ชื่อผู้ผลิต โลโก้ และทรัพย์สินทางปัญญาของบุคคลภายนอก เป็นทรัพย์สินของเจ้าของสิทธิแต่ละราย Vocab World เป็นเกมเพื่อการศึกษาอิสระ และไม่มีความเกี่ยวข้อง การสนับสนุน การรับรอง หรือความสัมพันธ์อย่างเป็นทางการกับผู้ผลิตรถยนต์ องค์กรมอเตอร์สปอร์ต ทีมแข่ง รายการแข่งขัน หรือเจ้าของสิทธิบุคคลภายนอกใด ๆ</div>
      </div>
      <button id="f1-legalclose">ปิด / Close</button>
    </div></div>
    <div id="f1-exitbox"><div class="box">
      <div style="font-size:17px;font-weight:800;margin-bottom:4px">ออกจากสนามแข่ง?</div>
      <button id="f1-stay">🏎️ แข่งต่อ</button><button id="f1-leave">🚪 ออกเลย</button>
    </div></div>`;
  document.body.appendChild(wrapEl);
  screenEl=wrapEl;
  wordEl=wrapEl.querySelector('#f1-word');
  coinsEl=wrapEl.querySelector('#f1-coins');
  banEl=wrapEl.querySelector('#f1-ban');
  introEl=wrapEl.querySelector('#f1-intro');
  exitBox=wrapEl.querySelector('#f1-exitbox');
  boardEl=wrapEl.querySelector('#f1-board');
  /* 👥 รอบ 939: ปุ่ม "ไปหาเพื่อน" ที่ NetRoom ฝังมากับป้ายสถานะ — เดิม F1 วาดปุ่มแต่ไม่ได้ดักคลิก (กดแล้วเงียบ) */
  boardEl.addEventListener('click',e=>{ if(e.target.closest('.nr-go')&&room) room.openFriends(); });
  chatBarEl=wrapEl.querySelector('#f1-chatbar');
  selfMsgEl=wrapEl.querySelector('#f1-selfmsg');
  speedEl=wrapEl.querySelector('#f1-speed');
  gearEl=wrapEl.querySelector('#f1-gear');
  lapEl=wrapEl.querySelector('#f1-laps');
  wrongEl=wrapEl.querySelector('#f1-wrong');
  respEl=wrapEl.querySelector('#f1-resp');   // 🏜️ รอบ 911
  portalEl=wrapEl.querySelector('#f1-portal');
  drsEl=wrapEl.querySelector('#f1-drs');
  knobEl=wrapEl.querySelector('#f1-knob');
  /* 🚦👻 รอบ 902 */
  lightsEl=wrapEl.querySelector('#f1-lights');
  lightDots=[].slice.call(lightsEl.querySelectorAll('i'));
  lightNoteEl=lightsEl.querySelector('b');
  gapEl=wrapEl.querySelector('#f1-gap');
  mapCv=wrapEl.querySelector('#f1-map'); mapCtx=mapCv.getContext('2d');
  wrapEl.querySelector('#f1-go').addEventListener('click',()=>{ introEl.style.display='none'; Snd.start(); beginLights(); });
  const legalEl=wrapEl.querySelector('#f1-legal');
  wrapEl.querySelector('#f1-legalbtn').addEventListener('click',()=>legalEl.classList.add('on'));
  wrapEl.querySelector('#f1-legalclose').addEventListener('click',()=>legalEl.classList.remove('on'));
  wrapEl.querySelector('#f1-exitbtn').addEventListener('click',()=>exitBox.classList.add('on'));
  wrapEl.querySelector('#f1-stay').addEventListener('click',()=>exitBox.classList.remove('on'));
  wrapEl.querySelector('#f1-leave').addEventListener('click',exitWorld);
  /* 🪖 รอบ 901: ปุ่มสลับมุมมอง คนขับ ↔ เห็นรถทั้งคัน */
  cockpitEl=wrapEl.querySelector('#f1-cockpit');
  cockpitTurnEl=wrapEl.querySelector('#f1-cockpit-turn');
  qualityWheelEl=wrapEl.querySelector('#f1-quality-wheel');
  camBtnEl=wrapEl.querySelector('#f1-cambtn');
  /* 🎡 รอบ 913: ชั้นพวงมาลัย — โหลดไม่ได้ = ถอยไปใช้ภาพเดิมที่มีพวงมาลัยติดมาในตัว (ไม่ให้เหลือค็อกพิทไม่มีพวงมาลัย) */
  wheelEl=wrapEl.querySelector('#f1-wheel');
  wheelEl.addEventListener('error',()=>{
    /* 🚥 รอบ 918: ภาพไฟดับโหลดไม่ได้ → ถอยไป wheel.webp (ไฟติดตายในภาพ) แล้วเลิกวาดดวงไฟ */
    if(wheelEl.src.indexOf('wheel_body')>=0){ ledsOff(); wheelEl.src='img/f1/wheel.webp'; return; }
    wheelEl.style.display='none'; wheelEl=null; ledsOff();
    cockpitEl.style.backgroundImage="url('img/f1/cockpit.webp')";
  });
  wheelEl.addEventListener('load',layoutWheel);
  buildLeds();                         // 🚥 รอบ 918 — สร้างดวงไฟก่อนโหลดภาพ
  wheelEl.src='img/f1/wheel_body.webp';   // 🚥 รอบ 918 — ภาพที่ไฟดับหมด (ไฟจริงเกมวาดเอง)
  /* เฟรมเลี้ยวโหลดล่วงหน้า 2 ภาพเท่านั้น; เฟรมกลางเป็น background WebP เบา */
  for(const src of ['img/f1/cockpit_turn_left.webp','img/f1/cockpit_turn_right.webp']){ const im=new Image();im.src=src; }
  /* 🔢 รอบ 916: จอตัวเลขจริงบนพวงมาลัย — เครื่องที่ไม่มี canvas 2d ก็ปล่อยจอในภาพไปตามเดิม ไม่ให้ทั้งโลกพัง */
  dashEl=wrapEl.querySelector('#f1-dash');
  dashCtx=(dashEl&&dashEl.getContext)?dashEl.getContext('2d'):null;
  if(!dashCtx) dashEl=null;
  camBtnEl.addEventListener('click',cycleCamMode);   // 🛣️ รอบ 914 — วน 3 มุม
  /* แชท */
  chatBarEl.innerHTML=CHAT_PRESETS.map(t=>`<button>${t}</button>`).join('');
  chatBarEl.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>{
    sendChat(CHAT_PRESETS[i]); chatBarEl.classList.remove('on');
  }));
  wrapEl.querySelector('#f1-chatbtn').addEventListener('click',()=>chatBarEl.classList.toggle('on'));
  /* พวงมาลัยลาก */
  const steerBox=wrapEl.querySelector('#f1-steer');
  let sid=null;
  function steerTo(cx){
    const r=steerBox.getBoundingClientRect();
    const t=clamp((cx-r.left)/r.width*2-1,-1,1);
    steerCtl=t;
    knobEl.style.left=(50+t*50*(1-(knobEl.offsetWidth||56)/r.width))+'%';   // 🔄 รอบ 911 — knob โตขึ้น อ่านขนาดจริง
  }
  steerBox.addEventListener('pointerdown',e=>{ sid=e.pointerId; steerBox.setPointerCapture(sid); steerTo(e.clientX); });
  steerBox.addEventListener('pointermove',e=>{ if(sid===e.pointerId) steerTo(e.clientX); });
  const sEnd=e=>{ if(sid===e.pointerId){ sid=null; steerCtl=0; knobEl.style.left='50%'; } };
  steerBox.addEventListener('pointerup',sEnd); steerBox.addEventListener('pointercancel',sEnd);
  /* คันเร่ง/เบรก */
  /* ⏪ รอบ 911: ปุ่มเกียร์ถอยหลัง */
  const revB=wrapEl.querySelector('#f1-reverse');
  revB.addEventListener('pointerdown',e=>{ e.preventDefault(); padRev=true; Snd.start(); });
  revB.addEventListener('pointerup',()=>padRev=false);
  revB.addEventListener('pointercancel',()=>padRev=false);
  const thrB=wrapEl.querySelector('#f1-throttle'), brB=wrapEl.querySelector('#f1-brake');
  thrB.addEventListener('pointerdown',e=>{ e.preventDefault(); padThr=1; Snd.start();
    if(introEl.style.display!=='none') introEl.style.display='none';
    beginLights(); });
  thrB.addEventListener('pointerup',()=>padThr=0);
  thrB.addEventListener('pointercancel',()=>padThr=0);
  brB.addEventListener('pointerdown',e=>{ e.preventDefault(); padBr=true; });
  brB.addEventListener('pointerup',()=>padBr=false);
  brB.addEventListener('pointercancel',()=>padBr=false);
}

/* ============================================================
   🌍 สร้างโลกครั้งเดียว
   ============================================================ */
function build(){
  built=true;
  buildDom();
  buildLine();
  findDrsZones();          // 🪽 รอบ 904 — ต้องมาหลัง buildLine (ใช้ LINE.curv/cum)
  buildPitLine();          // 🛞 รอบ 905 — ต้องมาหลัง buildLine (ใช้ nearIdx หาฝั่งโรงรถ) และก่อน buildTrackScene
  scene=new THREE.Scene();
  /* 🌆 พลบค่ำทะเลทราย (night race) */
  scene.background=new THREE.Color(0x0d1430);
  scene.fog=new THREE.Fog(0x0d1430,340,1600);
  camera=new THREE.PerspectiveCamera(64,16/9,0.3,2100);
  renderer=new THREE.WebGLRenderer({canvas:wrapEl.querySelector('#f1-cv'),antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  /* แสงจัดแบบสนามไฟสปอตไลต์: ขาวนวลจ้าจากบน (ไฟสนาม) + อุ่นชดเชย + hemisphere หนา */
  const hemi=new THREE.HemisphereLight(0x9aabdf,0x40361f,0.72); scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xf4f7ff,1.05);
  sun.position.set(-300,500,-200); scene.add(sun);
  const warm=new THREE.DirectionalLight(0xffc98a,0.35);
  warm.position.set(200,120,300); scene.add(warm);
  envLights={hemi,sun,warm};
  /* glow texture ไฟสนาม */
  TexLib.glow=texFromCanvas((g,w,h)=>{
    const gr=g.createRadialGradient(w/2,h/2,2,w/2,h/2,w/2);
    gr.addColorStop(0,'rgba(255,250,230,0.9)'); gr.addColorStop(0.4,'rgba(255,240,200,0.25)');
    gr.addColorStop(1,'rgba(255,240,200,0)');
    g.fillStyle=gr; g.fillRect(0,0,w,h);
  },128,64);
  /* รถผู้เล่นอื่นเป็น 2.5D sprite โปร่งใส: โหลดภาพที่สร้างเฉพาะเกม และมี fallback เรขาคณิตเบามาก */
  TexLib.peerCar=texFromCanvas((g,w,h)=>{
    g.clearRect(0,0,w,h);g.translate(w/2,h/2);g.fillStyle='#e10600';
    g.beginPath();g.moveTo(-72,30);g.lineTo(-42,-18);g.lineTo(-17,-34);g.lineTo(18,-34);g.lineTo(74,25);g.closePath();g.fill();
    g.fillStyle='#111a24';g.fillRect(-88,16,176,16);g.fillRect(-58,-5,116,15);
    g.fillStyle='#07090d';for(const x of [-65,65]){g.beginPath();g.ellipse(x,24,20,28,0,0,Math.PI*2);g.fill();}
  },256,160);
  new THREE.TextureLoader().load('img/f1/peer_car_25d.webp',t=>{
    t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
    if('colorSpace' in t&&THREE.SRGBColorSpace) t.colorSpace=THREE.SRGBColorSpace;
    applyTex('peerCar',t);
  },undefined,()=>console.warn('[F1] peer_car_25d.webp unavailable; using procedural fallback'));
  /* texture หลัก — probe img/f1/*.jpg (ภาพผู้ใช้เจน) ก่อน · ไม่มี = canvas ที่วาดเอง */
  TexLib.asphalt=asphaltTex();
  texProbe('asphalt.jpg',TexLib.asphalt,t=>{ t.repeat.set(1,1); applyTex('asphalt',t);
    /* ภาพถ่ายยางมะตอยมักสว่างกว่าสนามจริงตอนกลางคืน — tint เข้มลงด้วย material.color (คูณกับ map) */
    (TexUsers.asphalt||[]).forEach(m=>m.color.setHex(0x87898d)); });
  TexLib.kerb=kerbTex();
  TexLib.sand=sandTex();
  texProbe('sand.jpg',TexLib.sand,t=>{ t.repeat.set(60,60); applyTex('sand',t); });
  /* อาคาร/อัฒจันทร์ห้าม probe ภาพ facade/crowd อีกต่อไป — buildBuildings ใช้ geometry + material ล้วน
     (คง texture เฉพาะผิวธรรมชาติของแทร็ก/ทราย ซึ่งไม่ใช่สิ่งปลูกสร้าง) */
  TexLib.adGP=adTex('VOCAB WORLD RACING','#fff','#d81a1a');
  TexLib.adSakhir=adTex('VOCAB GRAND CIRCUIT','#fff','#0a3b8c');
  TexLib.adVocab=adTex('VOCAB MOTORS','#5c3500','#ffd12e');
  TexLib.adSpeed=adTex('WORDPOWER','#0af','#0c1220');
  buildTrackScene();
  buildDrsBoards();      // 🪽 รอบ 908 — ป้ายเสา DRS (ต้องมาหลัง TexLib.glow + findDrsZones + มี scene แล้ว)
  /* รถเรา */
  carGrp=buildF1Car(0xe10600);
  scene.add(carGrp);
  attachDrsGlow(carGrp);                      // 🪽 รอบ 904 (รถเราคันเดียว — เพื่อนไม่ส่งสถานะ DRS)
  wheels=carGrp.userData.wheels||[]; steerParts=carGrp.userData.front||[];
  fpWheels=buildFpWheels(); scene.add(fpWheels);   // 🛞 รอบ 911 — ล้อหน้ามุมคนขับ
  makeCar(0xe10600,g=>{
    if(!g||g===carGrp) return;
    scene.remove(carGrp);
    carGrp=g; scene.add(carGrp);
    attachDrsGlow(carGrp);
    wheels=g.userData.wheels||[]; steerParts=g.userData.front||[];
    if(camMode==='cockpit') carGrp.visible=false;   // 🪖 รอบ 901 — GLB มาทีหลัง ต้องซ่อนตามโหมด
  });
  /* minimap พื้นหลัง */
  const mc=document.createElement('canvas'); mc.width=mc.height=260;
  const mg=mc.getContext('2d');
  const bb=mapBounds();
  mg.strokeStyle='rgba(255,255,255,0.85)'; mg.lineWidth=5; mg.lineJoin='round'; mg.beginPath();
  for(let i=0;i<=LINE.n;i+=2){
    const j=i%LINE.n;
    const [mx,my]=mapXY(LINE.x[j],LINE.z[j],bb);
    if(i===0) mg.moveTo(mx,my); else mg.lineTo(mx,my);
  }
  mg.closePath(); mg.stroke();
  /* 🪽 ระบายโซน DRS ทับเส้นสนาม (รอบ 898) */
  mg.strokeStyle='#2dff8c'; mg.lineWidth=5; mg.lineCap='round';
  for(const z of drsZones){
    const L=((z.b-z.a)%LINE.n+LINE.n)%LINE.n;
    mg.beginPath();
    for(let d=0;d<=L;d++){
      const j=(z.a+d)%LINE.n;
      const [mx,my]=mapXY(LINE.x[j],LINE.z[j],bb);
      if(d===0) mg.moveTo(mx,my); else mg.lineTo(mx,my);
    }
    mg.stroke();
  }
  /* 🪽 รอบ 908: หมุดจุด detection (ฟ้า) + ขีดหัว/ท้ายโซนบนมินิแมป — ตรงกับป้ายเสาที่ปักไว้ริมแทร็ก */
  for(const z of drsZones){
    for(const [i,col,r] of [[drsDetIdx(z),'#22d3ff',4],[z.a,'#2dff8c',3],[z.b,'#ff9a3c',3]]){
      const [mx,my]=mapXY(LINE.x[i],LINE.z[i],bb);
      mg.fillStyle=col; mg.strokeStyle='#0b1220'; mg.lineWidth=1.6;
      mg.beginPath(); mg.arc(mx,my,r,0,Math.PI*2); mg.fill(); mg.stroke();
    }
  }
  /* 🚧 เลนพิท (เส้นประเทา) */
  if(PITL){
    mg.strokeStyle='rgba(180,196,224,.85)'; mg.lineWidth=3; mg.setLineDash([7,5]);
    mg.beginPath();
    for(let i=0;i<PITL.n;i+=2){
      const [mx,my]=mapXY(PITL.x[i],PITL.z[i],bb);
      if(i===0) mg.moveTo(mx,my); else mg.lineTo(mx,my);
    }
    mg.stroke(); mg.setLineDash([]);
  }
  const [sx,sy]=mapXY(LINE.x[sfIdx],LINE.z[sfIdx],bb);
  mg.fillStyle='#ffd12e'; mg.fillRect(sx-4,sy-4,8,8);
  mapBase=mc; mapBase._bb=bb;
}
function mapBounds(){
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
  for(let i=0;i<LINE.n;i++){
    x0=Math.min(x0,LINE.x[i]); x1=Math.max(x1,LINE.x[i]);
    z0=Math.min(z0,LINE.z[i]); z1=Math.max(z1,LINE.z[i]);
  }
  return {x0,x1,z0,z1,k:236/Math.max(x1-x0,z1-z0)};
}
function mapXY(x,z,bb){
  return [12+(x-bb.x0)*bb.k+(236-(bb.x1-bb.x0)*bb.k)/2, 12+(z-bb.z0)*bb.k+(236-(bb.z1-bb.z0)*bb.k)/2];
}
function drawMap(){
  if(!mapBase) return;
  mapCtx.clearRect(0,0,260,260);
  mapCtx.globalAlpha=0.9;
  mapCtx.drawImage(mapBase,0,0);
  const bb=mapBase._bb;
  for(const uid in peers){
    const p=peers[uid];
    const [x,y]=mapXY(p.cur.x,p.cur.z,bb);
    mapCtx.fillStyle=peerColor(uid);
    mapCtx.beginPath(); mapCtx.arc(x,y,5,0,Math.PI*2); mapCtx.fill();
  }
  if(ghostShown&&ghostGrp){                     // 👻 รอบ 902 — จุดรถเงาบนแผนที่
    const [gx,gy]=mapXY(ghostGrp.position.x,ghostGrp.position.z,bb);
    mapCtx.fillStyle='rgba(103,216,255,.85)';
    mapCtx.beginPath(); mapCtx.arc(gx,gy,5,0,Math.PI*2); mapCtx.fill();
  }
  const [x,y]=mapXY(px,pz,bb);
  mapCtx.fillStyle='#7dffb0'; mapCtx.strokeStyle='#fff'; mapCtx.lineWidth=2;
  mapCtx.beginPath(); mapCtx.arc(x,y,6.5,0,Math.PI*2); mapCtx.fill(); mapCtx.stroke();
}

/* ============================================================
   🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
   · โซนหาเอง ไม่ hardcode: ช่วง index ของ LINE ที่ |curv| ต่ำติดกัน "ยาวสุด 2 ช่วง"
     = ทางตรงหน้าพิท (main straight) + ทางตรงหลัง T10 ของสนามซาเคียร์
   · เปิดได้เมื่อ (เหมือนกติกาจริง): อยู่ในโซน + วิ่งตามทาง + ไม่เบรก + มีรถเพื่อนข้างหน้าใกล้กว่า 25 ม.
   · เปิดแล้ว: แรงต้านอากาศลด → ท็อปสปีด +8% พอดี (v_top ∝ (PWR/DRAG)^⅓ → DRAG × 1/1.08³)
   · ป้าย DRS บนจอบอกเหตุผลเสมอ (อยู่ในโซนแต่ยังเปิดไม่ได้ = บอกว่าต้องตามให้ใกล้เท่าไร)
   ============================================================ */
const DRS_ZONES_N  = 2;        // จำนวนโซน (ทางตรงยาวสุด 2 ช่วง)
const DRS_CURV     = 0.0018;   // |rad/m| ต่ำกว่านี้ = นับเป็นทางตรง (kerb ใช้ 0.004)
const DRS_GAP_MAX  = 4;        // sample โค้งแทรกสั้น ๆ ไม่ตัดช่วงตรงออกจากกัน
const DRS_MIN_M    = 220;      // ทางตรงสั้นกว่านี้ไม่ตั้งเป็นโซน
const DRS_ENTRY_M  = 55;       // จุดเปิดอยู่หลังพ้นโค้งเข้ามาแล้วเท่านี้ (ไม่ให้เปิดคาโค้ง)
const DRS_NEAR_M   = 25;       // ตามเพื่อนใกล้กว่านี้ = เปิดได้
const DRS_DRAG_K   = 0.7898;   // ลดแรงต้านอากาศ → ท็อปสปีด +8% พอดี (334→360.6 กม./ชม.)
                               // (≈1/1.08³ ปรับชดเชยแรงต้านการหมุน ROLL_A ที่ไม่ขึ้นกับ v²)
const DRS_FLAP_SHUT= 0.5;      // องศา flap ตอนปิด (rad · เอียงกินลม)
const DRS_FLAP_OPEN= 0.04;     // ตอนเปิด (แบนเกือบราบ)
let drsZones=[], drsOn=false, drsInZone=false, drsGap=0, drsFlapK=0, drsBrake=false;
let drsPrev=false, drsBoards=[], drsMarkObjs=[];   // 🪽 รอบ 908: สถานะปีกรอบก่อน (ไว้ยิงเสียงตอนเปลี่ยน) + ป้ายเสาริมแทร็ก

/* ไฟ DRS ท้ายรถ — ใช้ได้กับทุกโมเดล (GLB ของผู้ใช้ไม่มี flap แยกชิ้น จึงพึ่งการหมุนปีกอย่างเดียวไม่ได้) */
function attachDrsGlow(g){
  if(!g||g.userData.drsGlow) return null;
  const bb=new THREE.Box3().setFromObject(g);          // ตอนเพิ่งสร้าง: local = world (ยังไม่ขยับ/หมุน)
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,color:0x2dff8c,transparent:true,
    opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
  sp.scale.set(0.7,0.34,1);            // เล็กพอเป็น "ไฟ" ไม่ใช่ฉาบทั้งคัน (วัดด้วยภาพจริงรอบ 904)
  sp.position.set(0,Math.max(0.75,bb.max.y*0.78),bb.min.z+0.3);   // ท้ายรถ (หน้ารถ = +Z)
  g.add(sp); g.userData.drsGlow=sp;
  return sp;
}
function findDrsZones(){
  drsZones=[];
  if(!LINE||!LINE.n) return;
  const m=LINE.n, st=i=>Math.abs(LINE.curv[i])<=DRS_CURV;
  /* เริ่มไล่จากจุดที่ "ไม่ตรง" → ช่วงที่คาบเกี่ยว index 0 ไม่ถูกตัดครึ่ง */
  let z=-1;
  for(let i=0;i<m;i++) if(!st(i)){ z=i; break; }
  if(z<0) return;
  const runs=[];
  let a=-1, gap=0;
  for(let k=0;k<m;k++){
    const i=(z+k)%m;
    if(st(i)){ if(a<0) a=i; gap=0; }
    else if(a>=0&&++gap>DRS_GAP_MAX){ runs.push([a,(z+k-gap)%m]); a=-1; gap=0; }
  }
  if(a>=0) runs.push([a,(z+m-1-gap+m)%m]);
  const lenOf=(p,q)=>((LINE.cum[q]-LINE.cum[p])%TOTAL+TOTAL)%TOTAL;
  runs.sort((p,q)=>lenOf(q[0],q[1])-lenOf(p[0],p[1]));
  for(const r of runs.slice(0,DRS_ZONES_N)){
    const b=r[1];
    if(lenOf(r[0],b)<DRS_MIN_M) continue;
    let s=r[0];
    while(lenOf(r[0],s)<DRS_ENTRY_M&&lenOf(s,b)>DRS_MIN_M*0.5) s=(s+1)%m;
    drsZones.push({a:s,b,len:lenOf(s,b)});
  }
}
/* ---------- 🪽 รอบ 908: ป้ายเสาริมแทร็ก (detection / เริ่มโซน / จบโซน) ----------
   ใช้ drsZones ที่ findDrsZones คำนวณไว้แล้ว ไม่ hardcode พิกัด
   · จุด detection = ถอยหลังจากหัวโซน DRS_DET_M เมตร (สนามจริงวัดระยะก่อนถึงโซน มักอยู่ในโค้งก่อนหน้า)
     — ในเกมเราวัดระยะเพื่อนตลอดเวลาอยู่แล้ว ป้ายนี้จึงเป็น "หมุดบอกตำแหน่ง" ให้เด็กรู้ว่าใกล้ถึงโซนแล้ว
   · แต่ละจุดมี: เสา 2 ต้น (ซ้าย+ขวา หันหน้ารับรถที่วิ่งเข้ามา) + แถบสีพาดพื้นเต็มความกว้างแทร็ก */
const DRS_DET_M    = 110;     // จุดวัดระยะอยู่ก่อนหัวโซนกี่เมตร
const DRS_SIGN_KIND={
  det  :{c:'#22d3ff', bg:'#07293a', en:'DRS DETECTION', th:'🔍 จุดวัดระยะ'},
  start:{c:'#2dff8c', bg:'#06301b', en:'DRS ZONE',      th:'🪽 เปิดปีกได้'},
  end  :{c:'#ff9a3c', bg:'#331705', en:'END OF DRS',    th:'🚫 จบโซน'}
};
/* ⚠️ ระยะจริงต่อ sample ไม่ใช่ SAMPLE_M เป๊ะ (buildLine เกลี่ยให้ลงตัวรอบสนาม — วัดได้ 4.00 ม.)
   → คิดจาก TOTAL/LINE.n เสมอ ไม่งั้นจุด detection เพี้ยนไป 20% */
function drsDetIdx(z){
  const step=Math.max(1,Math.round(DRS_DET_M/(TOTAL/LINE.n)));
  return ((z.a-step)%LINE.n+LINE.n)%LINE.n;
}
function drsSignTex(kind){
  const k=DRS_SIGN_KIND[kind];
  const c=document.createElement('canvas'); c.width=512; c.height=180;
  const g=c.getContext('2d');
  g.fillStyle=k.bg; g.beginPath(); g.roundRect(4,4,504,172,18); g.fill();
  g.lineWidth=8; g.strokeStyle=k.c; g.stroke();
  g.fillStyle=k.c; g.font='bold 58px Arial'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(k.en,256,58);
  g.fillStyle='#fff'; g.font='bold 50px Arial';
  g.fillText(k.th,256,126);
  return new THREE.CanvasTexture(c);
}
function buildDrsBoards(){
  /* เรียกซ้ำได้ — เก็บของเดิมออกจากฉากก่อน ไม่ให้ป้ายซ้อนทับกันเงียบ ๆ */
  if(scene) drsMarkObjs.forEach(o=>scene.remove(o));
  drsBoards=[]; drsMarkObjs=[];
  if(!scene||!drsZones.length) return;
  const poleMat=new THREE.MeshLambertMaterial({color:0x9aa3ad});
  for(let zi=0;zi<drsZones.length;zi++){
    const z=drsZones[zi];
    const marks=[['det',drsDetIdx(z)],['start',z.a],['end',z.b]];
    for(const [kind,i] of marks){
      const tex=drsSignTex(kind), col=DRS_SIGN_KIND[kind].c;
      /* เสา 2 ฝั่ง — หันหน้ารับรถที่วิ่งเข้ามา (ระนาบตั้งฉากกับทิศวิ่ง) เอียงเข้าหาแทร็กเล็กน้อย */
      for(const side of [-1,1]){
        const off=HALF_W+RUNOFF_W+1.2;
        const grp=new THREE.Group();
        const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.13,2.4,6),poleMat);
        pole.position.y=1.2; grp.add(pole);
        const bd=new THREE.Mesh(new THREE.PlaneGeometry(5.2,1.83),
          new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide}));
        bd.position.y=3.2; grp.add(bd);
        const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,color:new THREE.Color(col).getHex(),
          transparent:true,opacity:0.5,depthWrite:false,blending:THREE.AdditiveBlending}));
        gl.scale.set(7,3,1); gl.position.y=3.2; grp.add(gl);   // เรืองบางๆ ให้เห็นตอนกลางคืน (สนามนี้เป็น night race)
        grp.position.set(LINE.x[i]+LINE.nx[i]*off*side,0,LINE.z[i]+LINE.nz[i]*off*side);
        grp.rotation.y=Math.atan2(-LINE.tx[i],-LINE.tz[i])-0.25*side;
        scene.add(grp); drsMarkObjs.push(grp);
        drsBoards.push({kind,zone:zi,i,side,grp});
      }
      /* แถบสีพาดพื้นเต็มความกว้างแทร็ก (เหมือนเส้นทาสีของสนามจริง) */
      const nx=LINE.nx[i],nz=LINE.nz[i],tx=LINE.tx[i],tz=LINE.tz[i],hw=HALF_W+KERB_W;
      const cx=LINE.x[i],cz=LINE.z[i],hl=0.45,y=0.055;
      const p=[];
      for(const [s,t] of [[-1,-1],[1,-1],[1,1],[-1,1]]) p.push(cx+nx*hw*s+tx*hl*t,y,cz+nz*hw*s+tz*hl*t);
      const geo=new THREE.BufferGeometry();
      geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
      geo.setIndex([0,1,2,0,2,3]); geo.computeVertexNormals();
      const stripe=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:new THREE.Color(col).getHex(),
        transparent:true,opacity:0.75,side:THREE.DoubleSide}));
      scene.add(stripe); drsMarkObjs.push(stripe);
    }
  }
}
function drsZoneAt(i){
  const m=LINE.n;
  for(const z of drsZones){
    const d=((i-z.a)%m+m)%m, L=((z.b-z.a)%m+m)%m;
    if(d<=L) return z;
  }
  return null;
}
/* ระยะรถผู้เล่นที่อยู่ "ข้างหน้า" ใกล้สุด (0 = ไม่มีใครในระยะ) */
function drsPeerGap(){
  const fx=Math.sin(yaw),fz=Math.cos(yaw);
  let best=0;
  for(const uid in peers){
    const p=peers[uid];
    if(!p||!p.cur) continue;
    const dx=p.cur.x-px, dz=p.cur.z-pz;
    if(dx*fx+dz*fz<=0) continue;                    // อยู่ข้างหลัง = ไม่นับ
    const d=Math.hypot(dx,dz);
    if(d<=DRS_NEAR_M&&(!best||d<best)) best=d;
  }
  return best;
}
function drsTick(dt,braking){
  const i=myIdx;
  const fwd=vx*LINE.tx[i]+vz*LINE.tz[i];
  /* ต้องวิ่งตามทางจริง · ไม่ใช่จมทราย · ไม่ใช่ในเลนพิท (เลนพิทเลียบทางตรงหน้าพิท index เดียวกับโซน 1
     — กติกาจริงห้ามเปิด DRS ในพิท และรอบ 900 มีลิมิตเตอร์ 80 กม./ชม. อยู่แล้ว) */
  drsInZone=!!drsZoneAt(i)&&fwd>2&&surfNow!=='sand'&&surfNow!=='pit';
  drsGap=drsInZone?drsPeerGap():0;
  drsBrake=drsInZone&&drsGap>0&&braking;               // ใกล้พอแล้วแต่ยังเบรกอยู่ (ป้ายบอกเหตุผล)
  drsOn=drsInZone&&drsGap>0&&!braking;                 // แตะเบรก = ปีกปิดทันที (เหมือนจริง)
  if(drsOn!==drsPrev){ drsPrev=drsOn; Snd.wing(drsOn); }   // 🪽 รอบ 908 — เสียงลมฟู่ตอนปีกขยับ
  drsFlapK=lerp(drsFlapK,drsOn?1:0,clamp(dt*9,0,1));
  const ud=carGrp&&carGrp.userData;
  if(ud&&ud.drsFlap) ud.drsFlap.rotation.x=lerp(DRS_FLAP_SHUT,DRS_FLAP_OPEN,drsFlapK);   // รถประกอบเอง = ปีกกางจริง
  if(ud&&ud.drsGlow) ud.drsGlow.material.opacity=drsFlapK*0.85;                          // ทุกโมเดล = ไฟเขียวท้ายรถ
}
function drsHud(){
  if(!drsEl) return;
  if(drsOn) drsEl.className='on', drsEl.innerHTML='DRS ⚡<small>ปีกเปิด · เร็วขึ้น 8%</small>';
  else if(drsInZone) drsEl.className='wait', drsEl.innerHTML='DRS<small>'
    +(drsBrake?'ปล่อยเบรกก่อน แล้วปีกจะเปิด'
              :'ตามรถผู้เล่นคันหน้าให้ใกล้กว่า '+DRS_NEAR_M+' ม.'+(drsGap?'':' (ตอนนี้ไม่มีผู้เล่นอยู่ข้างหน้า)'))+'</small>';
  else drsEl.className='';
}

/* ============================================================
   🏁 ฟิสิกส์ + จับเวลา
   ============================================================ */
/* 🌀 กลับบนแทร็ก ณ จุดใกล้ที่หลุดออกไป — ใช้หลังแสงวาร์ปบังภาพแล้ว */
function respawnOnTrack(targetIdx,showMessage=true){
  sandT=0;
  const i=Number.isInteger(targetIdx)?targetIdx:nearIdx(px,pz,myIdx);
  px=LINE.x[i]; pz=LINE.z[i];
  yaw=Math.atan2(LINE.tx[i],LINE.tz[i]);
  vx=vz=0; spd=0; steer=0; slide=0; myIdx=i; camInit=false;
  if(showMessage&&respEl){
    respEl.style.display='block';
    clearTimeout(respawnOnTrack._tm);
    respawnOnTrack._tm=setTimeout(()=>{respEl.style.display='none';},1500);
  }
}
function beginPortalReturn(){
  if(portalActive) return;
  portalActive=true; portalT=0; portalJumped=false; sandT=0;
  portalTargetIdx=nearIdx(px,pz,myIdx);
  vx*=.22; vz*=.22; spd=Math.hypot(vx,vz);
  if(portalEl) portalEl.className='on';
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate([45,35,90]);
}
function portalTick(dt){
  portalT+=dt;
  vx*=Math.pow(.025,dt); vz*=Math.pow(.025,dt); spd=Math.hypot(vx,vz);
  if(!portalJumped&&portalT>=.68){
    portalJumped=true;
    respawnOnTrack(portalTargetIdx,false);
    if(portalEl) portalEl.className='on jump';
  }
  if(carGrp){carGrp.position.set(px,0,pz);carGrp.rotation.y=yaw;}
  if(portalT>=1.16){
    portalActive=false; portalT=0;
    if(portalEl) portalEl.className='';
    if(respEl){respEl.style.display='block';clearTimeout(respawnOnTrack._tm);
      respawnOnTrack._tm=setTimeout(()=>{respEl.style.display='none';},1250);}
  }
}
function barrierBounce(){
  const s=surfAt(px,pz,myIdx),side=Math.sign(s.lat)||1;
  if(Math.abs(s.lat)<=BARRIER_LAT||inPitLane(px,pz,s.lat)) return false;
  const i=s.i,nx=LINE.nx[i],nz=LINE.nz[i],tx=LINE.tx[i],tz=LINE.tz[i];
  px=LINE.x[i]+nx*side*BARRIER_LAT;
  pz=LINE.z[i]+nz*side*BARRIER_LAT;
  const outward=(vx*nx+vz*nz)*side;
  if(outward>0){ vx-=nx*side*outward*(1+BARRIER_BOUNCE); vz-=nz*side*outward*(1+BARRIER_BOUNCE); }
  const along=vx*tx+vz*tz;
  const lateral=vx*nx+vz*nz;
  vx=tx*along*.82+nx*lateral;
  vz=tz*along*.82+nz*lateral;
  myIdx=i; sandT=0;
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate(35);
  return true;
}
function physTick(dt){
  /* วาร์ปกำลังทำงาน: ล็อกแรงขับ/การเก็บรอบชั่วคราว แล้วปล่อยกลับหลังจบแสง */
  if(portalActive){portalTick(dt);return;}
  /* 🚦 รอบ 902: ก่อนไฟดับ คันเร่งไม่ทำงาน (เบรก/พวงมาลัยยังได้ — เร่งเครื่องรอได้ตามปกติ) */
  const thr=lightsLocked()?0:clamp(padThr+(kThr?1:0),0,1);
  const braking=padBr||kBack;
  const reving=padRev&&!braking&&!lightsLocked();   // ⏪ รอบ 911 — เบรกชนะเกียร์ถอย · ก่อนไฟดับห้ามถอย
  /* พวงมาลัย: นิ่ม + ลิมิตตามความเร็ว */
  const sIn=clamp(steerCtl+(kL?-1:0)+(kR?1:0),-1,1);
  const sMax=lerp(STEER_MAX,STEER_HI,clamp(spd/85,0,1));
  steer=lerp(steer,sIn*sMax,clamp(dt*7,0,1));
  /* ผิวใต้รถ */
  const s=surfAt(px,pz,myIdx);
  myIdx=s.i;
  const surf=s.surf;
  if(surf!==surfNow){
    if(surf==='kerb') Snd.kerb();
    surfNow=surf;
  }
  pitLaneNow=(surf==='pit');
  const wasInPit=inPit;
  inPit=pitLaneNow;
  if(inPit&&!wasInPit) lapPitted=true;                 // รอบที่เข้าเลนพิทยังไม่นับ Best Lap
  const sc=surf==='sand'?SURF_SAND:(surf==='runoff'?SURF_RUNOFF:(surf==='pit'?SURF_PIT:{grip:1,drag:0}));
  drsTick(dt,braking);                                 // 🪽 รอบ 904 (ก่อนคิดแรงต้าน)
  /* แกนรถ */
  const fx=Math.sin(yaw),fz=Math.cos(yaw);
  const nx2=fz,nz2=-fx;
  let vF=vx*fx+vz*fz, vL=vx*nx2+vz*nz2;
  spd=Math.hypot(vx,vz);
  /* แรงตามยาว */
  let aF=0;
  if(thr>0) aF+=Math.min(ACC_CAP,PWR_A/Math.max(spd,6))*thr*(surf==='track'?1:sc.grip);
  /* ⏪ รอบ 911: เกียร์ถอยหลัง — ยังไหลไปหน้าอยู่ให้หน่วงก่อน แล้วค่อยถอย (เร็วสุด REV_MAX) */
  if(reving) aF-=vF>0.5?BRAKE_A*0.5:REV_A*(surf==='track'?1:sc.grip);
  if(braking) aF-=(BRAKE_A+BRAKE_DF*spd*spd)
    *Math.sign(vF||1)*(surf==='track'?1:sc.grip*0.9);
  aF-=DRAG_K*(drsOn?DRS_DRAG_K:1)*spd*spd*Math.sign(vF||0);   // 🪽 DRS เปิด = แรงต้านลด
  aF-=(ROLL_A+sc.drag)*Math.sign(vF||0)*(Math.abs(vF)>0.5?1:Math.abs(vF)*2);
  /* 🛑 รอบ 921: ปล่อยคันเร่ง (ไม่เบรก ไม่ถอย) = หน่วงเพิ่มเองเบา ๆ จนหยุด — ผู้ใช้ขอ "ยกมือออกแล้วค่อย ๆ เบรก"
     คิดหลังแรงต้านอากาศ/ยาง เพื่อให้บวกกันตรง ๆ · ผิวลื่น (ทราย/runoff) หน่วงได้น้อยลงตามกริป เหมือนเบรกจริง */
  const coasting=thr===0&&!braking&&!reving;
  if(coasting&&Math.abs(vF)>COAST_STOP) aF-=COAST_A*Math.sign(vF)*(surf==='track'?1:sc.grip);
  vF+=aF*dt;
  if(braking&&Math.abs(vF)<0.6&&thr===0) vF=0;
  if(coasting&&Math.abs(vF)<=COAST_STOP) vF=0;   // 🛑 รอบ 921 — จอดสนิท ไม่คืบต่อเอง
  if(vF<-REV_MAX) vF=-REV_MAX;                         // ถอยได้ช้าๆ พอ (⏪ รอบ 911 ย้ายเป็นค่าคงที่)
  /* 🚧 รอบ 905: ลิมิตเตอร์เลนพิท 80 กม./ชม. (อัตโนมัติเหมือนของจริง — เด็กไม่ต้องกดเอง) */
  pitLimited=false;
  if(pitLaneNow&&vF>PIT_LIMIT){
    pitLimited=true;
    vF=Math.max(PIT_LIMIT,vF-Math.max(16,(vF-PIT_LIMIT)*7)*dt);
  }
  /* เลี้ยว: yaw rate จากมุมล้อ + จำกัดด้วยกริป (โมเมนตัม!) */
  const gripMax=Math.min(GRIP_CAP,(GRIP_BASE+GRIP_DF*spd*spd))*sc.grip;
  /* 🔄 รอบ 911: ใส่ลบ — แกนจอ: หันหน้า +Z แล้ว "ขวามือ" คือ −X ดังนั้น steer บวก (ปุ่มขวา) ต้องลด yaw
     (ของเดิมกดขวาแล้วรถเลี้ยวซ้าย — กลับด้านทุกมุมกล้องตั้งแต่รอบ 896) */
  let yawRate=Math.abs(vF)>0.4?-(vF*Math.tan(steer)/WB):0;
  const latNeed=Math.abs(yawRate*vF);
  slide=0;
  if(latNeed>gripMax&&Math.abs(vF)>2){
    yawRate*=gripMax/latNeed;                          // understeer: หัวไม่ไปตามที่หมุนพวงมาลัย
    slide=clamp((latNeed-gripMax)/gripMax,0,1);
  }
  yaw+=yawRate*dt;
  /* ยางดึงความเร็วข้างเข้าแนวรถ (นี่คือหัวใจโมเมนตัม: ดึงได้แค่เท่าที่กริปมี) */
  const latGrab=Math.min(Math.abs(vL)/dt,gripMax*(1.1-slide*0.55));
  vL-=Math.sign(vL)*latGrab*dt;
  if(Math.abs(vL)>2.2) slide=Math.max(slide,clamp(Math.abs(vL)/14,0,1));
  /* รวมกลับเป็นเวกเตอร์โลก: v = f·vF + n·vL โดย f=(sin,cos) n=(cos,-sin) */
  const fx2=Math.sin(yaw),fz2=Math.cos(yaw);
  vx=fx2*vF+fz2*vL;
  vz=fz2*vF+(-fx2)*vL;
  px+=vx*dt; pz+=vz*dt;
  barrierBounce();
  spd=Math.hypot(vx,vz);
  revNow=vF<-0.3;                                      // ⏪ รอบ 911 — ให้ HUD โชว์เกียร์ R
  /* วางรถ */
  carGrp.position.set(px,0,pz);
  carGrp.rotation.y=yaw;
  carGrp.rotation.z=lerp(carGrp.rotation.z,steer*spd*0.012,clamp(dt*6,0,1));   // เอียงเข้าโค้งนิดๆ (พลิกเครื่องหมายตามทิศเลี้ยวใหม่ รอบ 911)
  carGrp.rotation.x=lerp(carGrp.rotation.x,surf==='kerb'?(Math.random()-0.5)*0.03:0,0.4);
  /* ล้อหมุน+เลี้ยว */
  const roll=spd*dt/0.46;
  for(const w of wheels) w.rotation.x+=roll;
  for(const w of steerParts) w.rotation.y=-steer*2.4;   // 🔄 รอบ 911 — ล้อหน้าชี้ตามทิศเลี้ยวใหม่
  /* ไฟท้ายกะพริบตอนเก็บพลัง (เหมือน ERS) */
  if(carGrp.userData.tail) carGrp.userData.tail.material.color.setHex(
    (braking||thr<0.1)&&spd>10?((performance.now()/90|0)%2?0xff2020:0x550000):0x550000);
  /* ควันดริฟต์/ทราย */
  if((slide>0.35&&spd>14)||surf==='sand'&&spd>6) puffSmoke(surf==='sand');
  const audioThr=clamp(padThr+(kThr?1:0),0,1);     // ให้เร่งเครื่องรอไฟสตาร์ทได้ โดยไม่ส่งแรงไปที่ล้อ
  Snd.tick(spd,audioThr,slide>0.4&&spd>12,dt,drsOn,braking,camMode);   // sample RPM + เกียร์ + cockpit/chase
  /* หลุดจากผิวถนนแข่งต่อเนื่อง: runoff/ทรายเปิดประตูมิติ แล้วกลับตรง track segment ใกล้จุดที่หลุด */
  if(surf==='sand'||surf==='runoff') sandT+=dt; else sandT=0;
  if(sandT>=OFFTRACK_S) beginPortalReturn();
  /* จับเวลา + เช็คทิศ */
  progressTick(dt);
}
function progressTick(dt){
  const i=myIdx;
  const fwd=vx*LINE.tx[i]+vz*LINE.tz[i];
  wrongEl.style.display=(fwd<-6&&spd>7)?'block':'none';
  const prog=((LINE.cum[i]-LINE.cum[sfIdx])%TOTAL+TOTAL)%TOTAL;
  /* checkpoint 3 จุด (กันวิ่งย้อน/ตัดสนามแล้วได้รอบ) */
  for(let c=0;c<3;c++){
    const at=TOTAL*(c+1)/4;
    if(!cpFlags[c]&&prog>at&&prog<at+140&&lastProg<=at) cpFlags[c]=true;
  }
  if(lapStartAt&&prog<120&&lastProg>TOTAL-160&&cpFlags[0]&&cpFlags[1]&&cpFlags[2]){
    /* ครบรอบ! */
    const t=(performance.now()-lapStartAt)/1000;
    lapCount++;
    lapNow=0; lapStartAt=performance.now();
    cpFlags=[false,false,false];
    let msg='🏁 LAP '+lapCount+' — '+fmtLap(t);
    /* 🛞 รอบ 905: รอบที่แวะเลนพิท = ไม่นับสถิติ (กติกาจริง) แต่ยังได้เหรียญครบรอบ */
    if(lapPitted){
      msg+='<br><span style="color:#9fb2d8;font-size:14px">🔧 รอบเข้าพิท — ไม่นับสถิติ</span>';
    }else if(!lapBest||t<lapBest){
      lapBest=t;
      if(!state.f1Best||t<state.f1Best){ state.f1Best=t; saveState(); frSubmit(t); }
      msg+='<br><span class="m-coin">⭐ BEST LAP!</span>';
    }
    if(!lapPitted&&ghostKeep(t)) msg+='<br><span style="color:#67d8ff">👻 บันทึกรถเงาใหม่ — รอบหน้าไล่ตัวเองได้เลย</span>';
    ghostReset();
    lapPitted=inPit;                                  // ยังอยู่ในเลนพิทตอนข้ามเส้น = รอบใหม่ก็ยังไม่นับ
    const bonus=25;
    addCoins(bonus); sessionCoins+=bonus;
    coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
    msg+='<br><span class="m-coin">+'+bonus+' 🪙</span>';
    banEl.innerHTML=msg; banEl.classList.add('show');
    setTimeout(()=>banEl.classList.remove('show'),2400);
    if(typeof sfx!=='undefined') sfx.levelup();
    pickWord();                                     // หนึ่งคำต่อหนึ่งรอบ: เปลี่ยนคำเฉพาะตอนผ่านเส้น S/F
    renderBoard(); netSend(true);
  }else if(!lapStartAt&&prog<120&&spd>4){
    lapStartAt=performance.now(); cpFlags=[false,false,false];
    lapPitted=inPit;                                // 🛞 รอบ 905
    ghostReset();                                   // 👻 เริ่มบันทึกเส้นทางตอนข้ามเส้นเข้ารอบจับเวลา
  }
  lastProg=prog;
  if(lapStartAt) ghostRecord(dt,prog);
  if(lapStartAt) lapNow=(performance.now()-lapStartAt)/1000;
  lapEl.innerHTML='⏱️ <b>'+fmtLap(lapNow)+'</b> · รอบ '+lapCount
    +(lapBest?'<br>⭐ Best '+fmtLap(lapBest):'')
    +((state.f1Best&&(!lapBest||state.f1Best<lapBest))?'<br>🏆 สถิติ '+fmtLap(state.f1Best):'');
}
function fmtLap(t){
  if(!t) return '--:--.-';
  const m=t/60|0,s=t-m*60;
  return m+':'+(s<10?'0':'')+s.toFixed(2);
}
/* ควัน/ฝุ่น */
function puffSmoke(sandy){
  if(smokes.length>26) return;
  const m=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,transparent:true,
    color:sandy?0xcdb47f:0xbbbbbb,opacity:0.5,depthWrite:false}));
  m.position.set(px-Math.sin(yaw)*1.8+(Math.random()-0.5),0.5,pz-Math.cos(yaw)*1.8+(Math.random()-0.5));
  m.scale.set(1.6,1.2,1);
  scene.add(m);
  smokes.push({m,life:0.65});
}
function smokeTick(dt){
  for(let i=smokes.length-1;i>=0;i--){
    const s=smokes[i];
    s.life-=dt;
    s.m.scale.multiplyScalar(1+dt*2.4);
    s.m.material.opacity=Math.max(0,s.life*0.8);
    s.m.position.y+=dt*1.4;
    if(s.life<=0){ scene.remove(s.m); s.m.material.dispose(); smokes.splice(i,1); }
  }
}

/* ============================================================
   🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
   · เขียนจาก progressTick() เฉพาะตอนทำ Best Lap ใหม่ของตัวเอง (state.f1Best) — 1 แถวต่อคน
     rules ฝั่งเขียนบังคับว่า "ต้องดีกว่าแถวเดิม" อยู่แล้ว จึงยิง set() ทับได้เลยไม่ต้องเทียบก่อน
   · อ่าน orderByChild('sec').limitToFirst(FR_READ) — เวลาน้อยสุดมาก่อน (คนละทิศกับ examRank ที่คะแนนมากก่อน)
   · แถวของตัวเอง fallback จาก state.f1Best เสมอ (ออฟไลน์/rules ยังไม่ publish ก็ยังเห็นสถิติตัวเอง)
   · โชว์ใน #f1-rankbox ของหน้า intro (เรียก frMount() ใน start()) — ไม่มีป็อปอัปแยก
   ============================================================ */
const FR_READ=50, FR_TOP=10;
let __frCache=null, __frPend=null;
function frSubmit(sec){
  if(typeof Online==='undefined'||!Online.ready||!Online.db) return Promise.resolve(false);
  const uid=(typeof onlineKey==='function')?onlineKey():'';
  if(!uid||!(sec>0)) return Promise.resolve(false);
  if(typeof isTester==='function'&&isTester())
    return Online.db.ref('f1Rank/'+uid).remove().then(()=>false).catch(()=>false);
  const bs=(typeof badgeSuffix==='function')?badgeSuffix():'';
  const row={
    sec,
    n:(((typeof onlineDisplayName==='function'?onlineDisplayName():'')||'ผู้เล่น')+bs).slice(0,40),
    g:(state.student&&state.student.grade)||'',
    ts:Date.now(),
  };
  return Online.db.ref('f1Rank/'+uid).set(row).then(()=>{
    Online.frOk=true; __frCache=null; return true;
  }).catch(()=>{ Online.frOk=false; return false; });   // rules ยังไม่ publish / ออฟไลน์ → กระดานยังเห็นสถิติตัวเองจาก state.f1Best
}
function frMerge(rows){
  const me=(typeof onlineKey==='function')?onlineKey():'me';
  const visible=rows.filter(r=>!(typeof rankUserExcluded==='function'&&rankUserExcluded(r.uid,r.name)));
  const out=visible.filter(r=>r.uid!==me);
  let my=visible.find(r=>r.uid===me)||null;
  if(state.f1Best&&(!my||state.f1Best<my.sec)){
    my={uid:me, name:(typeof onlineDisplayName==='function'?onlineDisplayName():'')||(state.student&&state.student.name)||'หนู',
        g:(state.student&&state.student.grade)||'', sec:state.f1Best, ts:0};
  }
  if(my&&!(typeof isTester==='function'&&isTester())){ my.me=true; out.push(my); }
  return out.sort((a,b)=>a.sec-b.sec);
}
function frFetch(){
  if(__frCache) return Promise.resolve(__frCache);
  if(__frPend) return __frPend;
  const fin=rows=>{ __frCache=rows; __frPend=null; return rows; };
  if(typeof Online==='undefined'||!Online.ready||!Online.db) return Promise.resolve(fin(frMerge([])));
  const p=Online.db.ref('f1Rank').orderByChild('sec').limitToFirst(FR_READ+2).get().then(s=>{
    const v=(s&&s.val())||{}, out=[];
    Object.keys(v).forEach(u=>{
      const r=v[u];
      if(!r||typeof r.sec!=='number') return;
      out.push({uid:u, name:r.n||'เพื่อน', g:r.g||'', sec:r.sec, ts:r.ts||0});
    });
    Online.frOk=true;
    return fin(frMerge(out));
  }).catch(()=>{ Online.frOk=false; return fin(frMerge([])); });
  __frPend=p;
  return p;
}
function frRowHTML(r,i){
  const nm=(typeof splitNameBadges==='function')?splitNameBadges(r.name):{name:r.name,badges:''};
  const mark=(typeof gradeMark==='function'&&typeof gradeOf==='function')?gradeMark(gradeOf(r.uid,r.g)):'';
  return `<div class="fr-row${r.me?' me':''}">
    <span class="fr-rk">${i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)}</span>
    <span class="fr-nm">${r.me?'⭐ ':''}${escapeHTML(nm.name)}${mark}<small>${escapeHTML(nm.badges)}</small></span>
    <span class="fr-tm">${fmtLap(r.sec)}</span>
  </div>`;
}
function frBodyHTML(){
  const rows=__frCache;
  if(!rows) return `<div class="fr-none">⏳ กำลังโหลดอันดับ Best Lap…</div>`;
  if(!rows.length) return `<div class="fr-none">ยังไม่มีใครจับเวลาต่อรอบเลย — วิ่งจบรอบแรกแล้วขึ้นกระดานเลย! 🏁</div>`;
  const top=rows.slice(0,FR_TOP);
  const meAt=rows.findIndex(r=>r.me);
  return top.map(frRowHTML).join('')
    + (meAt>=top.length?`<div class="fr-more">…</div>${frRowHTML(rows[meAt],meAt)}`:'');
}
function frNote(){
  if(typeof Online==='undefined'||!Online.ready) return '📴 ออฟไลน์ — เห็นสถิติของหนูเองเท่านั้น';
  if(Online.frOk===false) return '⚠️ กระดานกลางยังไม่เปิด (รออัปเดตกฎ /f1Rank) — เห็นสถิติของหนูเองเท่านั้น';
  return '🏆 อันดับ Best Lap ตลอดกาลของทุกคน';
}
function frMount(){
  const box=wrapEl&&wrapEl.querySelector('#f1-rankbox');
  if(!box) return;
  const listEl=box.querySelector('.fr-list'), noteEl=box.querySelector('.fr-note');
  listEl.innerHTML=frBodyHTML(); noteEl.textContent=frNote();
  frFetch().then(()=>{
    if(!wrapEl||!wrapEl.classList.contains('on')) return;   // ออกจากโลกไปแล้วระหว่างรอโหลด
    listEl.innerHTML=frBodyHTML(); noteEl.textContent=frNote();
  });
}

/* ============================================================
   🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
   · ไฟบนซุ้ม (โซน 🏗️ สร้างฉาก) ติดทีละดวงทุก LIGHT_STEP_S → ครบ 5 → ค้างสุ่ม → "ดับพร้อมกัน" = ออกตัว
     ล็อกคันเร่งจนกว่าไฟจะดับ (เบรก/พวงมาลัยยังทำได้) · แถบไฟบนจอด้วย เพราะท้ายกริดห่างซุ้มถึง ~100 ม.
   · กดคันเร่ง "ใหม่" ตอนไฟครบ 5 = จั๊มพ์สตาร์ท โดนหน่วง JUMP_PENALTY_S (กดค้างมาแต่แรกไม่ผิด)
   · ไฟดับแล้วปล่อย-กดครั้งแรก = จับเวลาปฏิกิริยาโชว์ให้ดู
   · 👻 รถเงา: บันทึกตำแหน่ง GHOST_HZ จุด/วิ ตลอดรอบ · รอบไหนเร็วสุดเก็บเป็นรถเงา (localStorage)
     รอบถัดไปรถเงาโปร่งแสงวิ่งซ้ำเส้นทางนั้นตามเวลาจริง + ป้ายบอกช้า/เร็วกว่าสถิติกี่วินาที
   ============================================================ */
function resetLights(){
  lightPhase='wait'; lightT=0; lightsLit=-1; penaltyT=0; jumped=false;
  goAt=0; reactDone=false; thrPrev=false; heldAtGo=false;
  holdS=LIGHT_HOLD_MIN+Math.random()*(LIGHT_HOLD_MAX-LIGHT_HOLD_MIN);
  paintLights(0);
  if(lightsEl){ lightsEl.classList.add('on'); lightNoteEl.textContent='🚦 รอไฟดับก่อนออกตัว'; }
}
function beginLights(){ if(lightPhase==='wait'){ lightPhase='seq'; lightT=-LIGHT_LEAD_S; } }
function lightsLocked(){ return lightPhase!=='go'||penaltyT>0; }
function paintLights(n){
  if(lightsLit===n) return;
  lightsLit=n;
  for(let i=0;i<startLights.length;i++){
    const on=i<n;
    startLights[i].m.material.color.setHex(on?0xff1e1e:0x330000);
    startLights[i].g.material.opacity=on?0.9:0;
  }
  for(let i=0;i<lightDots.length;i++) lightDots[i].classList.toggle('lit',i<n);
}
function lightsTick(dt){
  const thrNow=clamp(padThr+(kThr?1:0),0,1)>0.05;
  if(lightPhase==='seq'){
    lightT+=dt;
    const lit=lightT<0?0:Math.min(5,Math.floor(lightT/LIGHT_STEP_S)+1);
    if(lit>lightsLit){ paintLights(lit); Snd.blip(false); }
    /* จั๊มพ์สตาร์ท = "กดใหม่" ตอนไฟครบ 5 เท่านั้น (เด็กที่กดค้างรอมาแต่ต้นไม่โดน) */
    if(lit>=5&&thrNow&&!thrPrev&&!jumped){
      jumped=true;
      lightNoteEl.textContent='⛔ จั๊มพ์สตาร์ท! รอเพิ่ม '+JUMP_PENALTY_S.toFixed(0)+' วิ';
      if(typeof sfx!=='undefined'&&sfx.wrong) sfx.wrong();
    }
    if(lit>=5&&lightT>=4*LIGHT_STEP_S+holdS){
      lightPhase='go'; goAt=performance.now(); heldAtGo=thrNow;
      paintLights(0); Snd.blip(true);
      if(jumped){
        penaltyT=JUMP_PENALTY_S;
      }else{
        lightsEl.classList.remove('on');
        banEl.innerHTML='🟢 <b>ไฟดับ — ออกตัว!</b>';
        banEl.classList.add('show');
        setTimeout(()=>banEl.classList.remove('show'),1100);
      }
    }
  }else if(lightPhase==='go'){
    if(penaltyT>0){
      penaltyT-=dt;
      lightNoteEl.textContent='⛔ จั๊มพ์สตาร์ท! รออีก '+Math.max(0,penaltyT).toFixed(1)+' วิ';
      if(penaltyT<=0){
        penaltyT=0; heldAtGo=thrNow; goAt=performance.now();
        lightsEl.classList.remove('on'); Snd.blip(true);
      }
    }else if(!reactDone&&goAt){
      /* เวลาปฏิกิริยา: ต้องเป็นการ "กดใหม่" หลังไฟดับ (กดค้างข้ามมาไม่นับ) */
      if(!thrNow) heldAtGo=false;
      else if(!heldAtGo&&!thrPrev){
        reactDone=true;
        const r=(performance.now()-goAt)/1000;
        banEl.innerHTML='⚡ ปฏิกิริยา <b>'+r.toFixed(3)+'</b> วิ'
          +(r<0.25?'<br><span class="m-coin">สุดยอด! เร็วระดับนักแข่งจริง</span>'
           :r<0.45?'<br><span class="m-coin">ไวมาก!</span>':'');
        banEl.classList.add('show');
        setTimeout(()=>banEl.classList.remove('show'),1800);
      }
    }
  }
  thrPrev=thrNow;
}
/* ---------- 👻 รถเงา ---------- */
function ghostEnsure(){
  if(ghostGrp) return ghostGrp;
  ghostGrp=buildF1Car(0x67d8ff);
  ghostGrp.traverse(o=>{
    if(!o.material||o.isSprite) return;
    const m=o.material.clone?o.material.clone():o.material;
    m.transparent=true; m.opacity=0.34; m.depthWrite=false;
    o.material=m;
  });
  ghostWheels=ghostGrp.userData.wheels||[];
  const tag=makeTextSprite('สถิติของหนู','rgba(20,120,190,.72)','#eaffff','👻');
  tag.scale.set(6.4,1.6,1); tag.position.set(0,3.2,0);
  ghostGrp.add(tag);
  ghostGrp.visible=false;
  scene.add(ghostGrp);
  return ghostGrp;
}
function ghostHide(){
  if(ghostGrp) ghostGrp.visible=false;
  ghostShown=false; ghostLast=null;
  if(gapEl) gapEl.classList.remove('on');
}
function ghostLoad(){
  ghostBest=null;
  try{
    const d=JSON.parse(localStorage.getItem(GHOST_KEY)||'null');
    if(!d||!d.x||!d.z||!d.y||!d.p||d.x.length<8||!d.t) return;
    if(Math.abs((d.v||0)-Math.round(TOTAL))>3) return;      // แทร็กเปลี่ยนสูตร = เส้นทางเก่าใช้ไม่ได้
    ghostBest=d;
  }catch(e){}
}
function ghostSave(){
  try{ localStorage.setItem(GHOST_KEY,JSON.stringify(ghostBest)); }catch(e){}
}
function ghostReset(){
  ghostRec={t:0,v:Math.round(TOTAL),x:[],z:[],y:[],p:[]};
  ghostAcc=1/GHOST_HZ; gapCur=0; ghostGap=0; ghostLast=null;
}
function ghostRecord(dt,prog){
  if(!ghostRec||ghostRec.x.length>=GHOST_MAX) return;
  ghostAcc+=dt;
  if(ghostAcc<1/GHOST_HZ) return;
  ghostAcc-=1/GHOST_HZ;
  ghostRec.x.push(+px.toFixed(1)); ghostRec.z.push(+pz.toFixed(1));
  ghostRec.y.push(+yaw.toFixed(3)); ghostRec.p.push(+prog.toFixed(1));
}
/* จบรอบเร็วกว่ารถเงาเดิม → เก็บเส้นทางรอบนี้เป็นรถเงาใหม่ */
function ghostKeep(t){
  if(!ghostRec||ghostRec.x.length<8||ghostRec.x.length>=GHOST_MAX) return false;
  if(ghostBest&&t>=ghostBest.t) return false;
  ghostRec.t=+t.toFixed(3); ghostBest=ghostRec; ghostSave();
  return true;
}
/* ต่างกันกี่วินาที: หาเวลาที่รถเงาอยู่ "ระยะทางเดียวกัน" กับเรา */
function ghostGapAt(prog){
  const g=ghostBest, n=g.p.length;
  while(gapCur<n-1&&g.p[gapCur+1]<=prog) gapCur++;
  if(gapCur>=n-1) return lapNow-g.t;
  const p0=g.p[gapCur],p1=g.p[gapCur+1];
  const f=p1>p0?clamp((prog-p0)/(p1-p0),0,1):0;
  return lapNow-(gapCur+f)/GHOST_HZ;
}
function ghostTick(dt){
  if(!ghostBest||!lapStartAt||lightsLocked()){ ghostHide(); return; }
  const g=ghostBest, n=g.x.length;
  const idx=lapNow*GHOST_HZ, i=Math.floor(idx);
  ghostGap=ghostGapAt(lastProg);
  gapEl.textContent='👻 '+(ghostGap>=0?'+':'−')+Math.abs(ghostGap).toFixed(2)+' วิ';
  gapEl.className=(ghostGap>=0?'slow':'fast')+' on';
  if(i<0||i>=n-1){ if(ghostGrp) ghostGrp.visible=false; ghostShown=false; ghostLast=null; return; }
  const f=idx-i;
  const gx=lerp(g.x[i],g.x[i+1],f), gz=lerp(g.z[i],g.z[i+1],f);
  let dy=g.y[i+1]-g.y[i];
  while(dy>Math.PI) dy-=Math.PI*2;
  while(dy<-Math.PI) dy+=Math.PI*2;
  const gm=ghostEnsure();
  gm.position.set(gx,0,gz);
  gm.rotation.y=g.y[i]+dy*f;
  gm.visible=true; ghostShown=true;
  if(ghostLast){                                    // ล้อหมุนตามระยะที่รถเงาเคลื่อนจริง
    const d=Math.hypot(gx-ghostLast.x,gz-ghostLast.z);
    for(const w of ghostWheels) w.rotation.x+=d/0.46;
  }
  ghostLast={x:gx,z:gz};
}

/* ============================================================
   🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
   รอบที่แวะเลนพิทยังไม่นับ Best Lap แต่ไม่มีระบบยางสึกหรือเปลี่ยนยาง
   ============================================================ */
/* ---- เส้นกึ่งกลางเลนพิท: resample ทุก SAMPLE_M เมตร ---- */
function buildPitLine(){
  PITL=null;
  const src=(typeof F1_MAP!=='undefined'&&F1_MAP.pit)||null;
  if(!src||src.length<3) return;
  const pts=[];
  for(let i=0;i<src.length-1;i++){
    const a=src[i],b=src[i+1];
    const L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    const steps=Math.max(1,Math.round(L/SAMPLE_M));
    for(let s=0;s<steps;s++){
      const t=s/steps;
      pts.push([a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]);
    }
  }
  pts.push(src[src.length-1].slice());
  const m=pts.length;
  PITL={x:new Float32Array(m),z:new Float32Array(m),tx:new Float32Array(m),tz:new Float32Array(m),
        nx:new Float32Array(m),nz:new Float32Array(m),cum:new Float32Array(m),n:m,len:0};
  let cum=0;
  for(let i=0;i<m;i++){
    const p=pts[i], q=pts[Math.min(i+1,m-1)], r=pts[Math.max(i-1,0)];
    PITL.x[i]=p[0]; PITL.z[i]=p[1];
    let dx=q[0]-r[0], dz=q[1]-r[1];
    const L=Math.hypot(dx,dz)||1e-6; dx/=L; dz/=L;
    PITL.tx[i]=dx; PITL.tz[i]=dz; PITL.nx[i]=-dz; PITL.nz[i]=dx;
    PITL.cum[i]=cum;
    if(i<m-1) cum+=Math.hypot(pts[i+1][0]-p[0],pts[i+1][1]-p[1]);
  }
  PITL.len=cum;
}
/* จุดใกล้สุดบนเลนพิท (เส้นสั้น ~155 จุด → ไล่ตรง ๆ เร็วพอ) */
function pitAt(x,z){
  if(!PITL) return null;
  let bi=0,bd=1e18;
  for(let i=0;i<PITL.n;i++){
    const d=(PITL.x[i]-x)**2+(PITL.z[i]-z)**2;
    if(d<bd){ bd=d; bi=i; }
  }
  const dx=x-PITL.x[bi], dz=z-PITL.z[bi];
  return {i:bi, lat:dx*PITL.nx[bi]+dz*PITL.nz[bi], d:Math.sqrt(bd)};
}
/* อยู่ในเลนพิทไหม — เลนพิทชนะเฉพาะตอนไม่ได้อยู่บนแทร็กจริง */
function inPitLane(x,z,lat){
  if(!PITL) return false;
  if(Math.abs(lat)<=HALF_W) return false;              // อยู่บนแทร็ก = ไม่ใช่เลนพิท (ปลายเลนซ้อนกัน)
  const pa=pitAt(x,z);
  return !!(pa&&Math.abs(pa.lat)<=PIT_HALF_W);
}
/* ============================================================
   🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
   ============================================================ */
function racingLineLat(i){
  /* ทางตรงอยู่กลางเลน; ก่อนเข้าโค้งออกด้านนอก แล้วตัดเข้า apex — ใช้ curvature ของเส้นสนามจริง */
  const c0=LINE.curv[i], c1=LINE.curv[(i+8)%LINE.n], c2=LINE.curv[(i+18)%LINE.n];
  if(Math.abs(c0)>.0048) return -Math.sign(c0)*(HALF_W*.42);
  if(Math.abs(c1)>.0048) return Math.sign(c1)*(HALF_W*.38);
  if(Math.abs(c2)>.0056) return Math.sign(c2)*(HALF_W*.26);
  return 0;
}
function trackPointAhead(minM,maxM){
  const ahead=minM+Math.random()*(maxM-minM);
  const i=(myIdx+Math.round(ahead/SAMPLE_M))%LINE.n;
  const lat=activeGraphicsMode==='quality'
    ?clamp(racingLineLat(i)+(Math.random()*2-1)*.65,-HALF_W+2.2,HALF_W-2.2)
    :(Math.random()*2-1)*(HALF_W-2.2);
  return {x:LINE.x[i]+LINE.nx[i]*lat,z:LINE.z[i]+LINE.nz[i]*lat};
}
function pickWord(){
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  let pool=vocabForStudent().filter(([en])=>/^[a-z]{2,9}$/i.test(en))
    .filter(([en])=>!state[DONE_KEY].includes(en.toLowerCase()));
  if(!pool.length){ state[DONE_KEY]=[]; saveState(); pool=vocabForStudent().filter(([en])=>/^[a-z]{2,9}$/i.test(en)); }
  const [en,th]=pool[Math.floor(Math.random()*pool.length)];
  word={en:en.toLowerCase(),th,got:[]};
  spawnLetters();
  renderWordHud();
}
function spawnLetters(){
  letters.forEach(l=>scene.remove(l.spr));
  letters=[];
  const gap=TOTAL/word.en.length;
  word.en.split('').forEach((ch,i)=>{
    /* วางกึ่งกลางแต่ละช่วง: ระยะรอบทั้งหมด / จำนวนตัวอักษร จึงห่างเท่ากันและมีเพียงชุดเดียวต่อรอบ */
    const d=(i+.5)*gap,at=(sfIdx+Math.round(d/SAMPLE_M))%LINE.n;
    const lat=activeGraphicsMode==='quality'?clamp(racingLineLat(at),-HALF_W+2.2,HALF_W-2.2):0;
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
    spr.scale.set(5,5,1); spr.position.set(LINE.x[at]+LINE.nx[at]*lat,2.6,LINE.z[at]+LINE.nz[at]*lat);
    scene.add(spr);
    letters.push({ch,idx:i,spr,lapDistance:d});
  });
}
function renderWordHud(){
  if(!word) return;
  wordEl.innerHTML='<span>'+word.en.split('').map((ch,i)=>
    `<span class="f-chip${word.got.includes(i)?' got':''}">${ch}</span>`).join('')+'</span>'
    +`<span class="f-th">${escapeHTML(word.th)}</span>`;
}
function collectTick(){
  if(!word||word.complete) return;
  /* multiplayer isolation: ตัวอักษร/word เป็น state ในเครื่องนี้ และตรวจชนกับรถเรา (px,pz) เท่านั้น
     peers ส่งมาเพื่อวาดรถ/อันดับ ห้ามใช้ตำแหน่งเพื่อนเก็บหรือลบตัวอักษรของผู้เล่นคนนี้ */
  const localX=px,localZ=pz;
  const hit=new Set();
  for(const l of letters)
    if(!hit.has(l.idx)&&Math.hypot(l.spr.position.x-localX,l.spr.position.z-localZ)<COLLECT_R) hit.add(l.idx);
  if(!hit.size) return;
  hit.forEach(idx=>{
    word.got.push(idx);
    if(typeof addCoins==='function') addCoins(LETTER_COIN);
    sessionCoins+=LETTER_COIN;
    if(typeof sfx!=='undefined'){ sfx.select(); if(sfx.coin) setTimeout(()=>sfx.coin(),70); }
    if(state.haptic!==false&&navigator.vibrate) navigator.vibrate(25);
  });
  letters=letters.filter(l=>{ if(!hit.has(l.idx)) return true; scene.remove(l.spr); return false; });
  coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
  renderWordHud();
  if(!letters.length) completeWord();
}
function completeWord(){
  const w=word;
  if(!w||w.complete) return;
  w.complete=true;
  state[DONE_KEY].push(w.en);
  addCoins(REWARD); sessionCoins+=REWARD; sessionWords++;
  coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
  renderBoard(); netSend(true);
  if(typeof questEvent==='function') questEvent('word3d');
  if(typeof vbRecord==='function') vbRecord(w.en,w.th,true);
  if(typeof sfx!=='undefined') sfx.levelup();
  setTimeout(()=>{ if(typeof speakWord==='function') speakWord(w.en); },700);
  banEl.innerHTML=`🎉 ${escapeHTML(w.en.toUpperCase())} = ${escapeHTML(w.th)}<br><span class="m-coin">+${REWARD} 🪙</span>`;
  banEl.classList.add('show');
  setTimeout(()=>banEl.classList.remove('show'),2200);
  saveState();
}
function relocTick(){
  /* คงตำแหน่งตลอดรอบ ห้ามย้ายตัวที่พลาดกลับมาข้างหน้า เพราะจะกลายเป็นมากกว่าหนึ่งชุดต่อรอบ */
}

/* ============================================================
   🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
   ============================================================ */
function netReady(){
  return typeof Online!=='undefined'&&Online.ready&&Online.db
    &&typeof Auth!=='undefined'&&Auth.user&&typeof onlineKey==='function'&&typeof firebase!=='undefined'
    &&typeof NetRoom!=='undefined';
}
function netJoin(){
  if(!netReady()) return;
  room=NetRoom.create({
    map:'f1', sendMs:NET_SEND_MS, roomMax:ROOM_MAX,
    roomNoun:'สนาม', roomIcon:'🏁',
    push(){ lastNetSend=0; netSend(true); },
    onPeer:onPeer, onPeerGone:dropPeer,
    onStatus(){ renderBoard(); },
    toast(html,ms){ banEl.innerHTML=html; banEl.classList.add('show');
      clearTimeout(banEl._nrTm); banEl._nrTm=setTimeout(()=>banEl.classList.remove('show'),ms||2200); },
  });
  room.join();
}
function netSend(force){
  if(!room||!room.online) return;
  const now=performance.now();
  if(!force&&now-lastNetSend<room.sendGap) return;
  lastNetSend=now;
  const payload={n:((typeof onlineDisplayName==='function'&&onlineDisplayName())||state.playerName||'ผู้เล่น'),
    x:Math.round(px*10)/10, z:Math.round(pz*10)/10, yaw:Math.round(yaw*100)/100, w:sessionWords,
    d:drsOn?1:0};   // 🪽 รอบ 907: สถานะ DRS — เพื่อนเห็นไฟเขียวท้ายรถตอนเราเปิดปีก
  if(myChat&&Date.now()-myChat.ts<CHAT_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  room.send(payload,force);
}
function sendChat(text){
  myChat={text:String(text).slice(0,60),ts:Date.now()};
  netSend(true);
  selfMsgEl.textContent='💬 '+myChat.text; selfMsgEl.classList.add('on');
  clearTimeout(selfMsgEl._tm); selfMsgEl._tm=setTimeout(()=>selfMsgEl.classList.remove('on'),CHAT_MS);
  if(typeof sfx!=='undefined') sfx.select();
}
function peerColor(uid){
  let h=0; for(let i=0;i<uid.length;i++) h=(h*31+uid.charCodeAt(i))>>>0;
  return PEER_COLORS[h%PEER_COLORS.length];
}
function buildPeer(uid,p){
  if(p.grp) scene.remove(p.grp);
  p.grp=new THREE.Group();
  const col=new THREE.Color(peerColor(uid)).getHex();
  const mat=new THREE.SpriteMaterial({map:TexLib.peerCar,transparent:true,alphaTest:.025,depthWrite:false});
  (TexUsers.peerCar||(TexUsers.peerCar=[])).push(mat);
  const car=new THREE.Sprite(mat);car.scale.set(6.4,3.69,1);car.position.y=1.8;car.renderOrder=5;
  car.userData.view='camera-facing-rear-three-quarter';p.grp.add(car);p.grp.userData.peerCar25d=car;
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.55,18),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.24,depthWrite:false}));
  shadow.scale.set(1,1.85,1);shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;p.grp.add(shadow);
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,color:0x2dff8c,transparent:true,
    opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
  gl.scale.set(.82,.38,1);gl.position.set(0,1.05,-.85);p.grp.add(gl);p.grp.userData.drsGlow=gl;
  const pg=(typeof gradeOf==='function')?gradeOf(uid,p.g):'';
  const nm=makeTextSprite(p.n,'rgba(16,26,44,.85)','#ffffff','🏎️',pg);
  nm.scale.set(8,2,1); nm.position.y=4.05;
  p.grp.add(nm);
  p.grade=pg;
  p.grp.position.set(p.cur.x,0,p.cur.z);
  p.grp.rotation.y=p.yawCur;
  scene.add(p.grp);
}
function onPeer(uid,d){
  if(typeof onlineKey==='function'&&uid===onlineKey()) return;
  d=d||{};
  if(typeof d.x!=='number'||typeof d.z!=='number') return;
  let p=peers[uid];
  if(!p){
    p=peers[uid]={n:d.n||'เพื่อน',cur:{x:d.x,z:d.z},tgt:{x:d.x,z:d.z},
      yawCur:d.yaw||0,yawTgt:d.yaw||0,w:d.w||0,g:d.g,lastCt:0,drsTgt:0,drsK:0};
    buildPeer(uid,p);
    renderBoard();
  }
  p.n=d.n||p.n;
  p.tgt.x=d.x; p.tgt.z=d.z; p.yawTgt=d.yaw||0;
  p.drsTgt=d.d?1:0;   // 🪽 รอบ 907 — เพื่อนที่ยังไม่อัปเดตโค้ด (d ไม่มีค่า) = ปิดเสมอ ไม่ throw
  if((d.w||0)!==p.w){ p.w=d.w||0; renderBoard(); }
  if(d.c&&d.ct&&d.ct!==p.lastCt){
    p.lastCt=d.ct;
    showPeerBubble(p,d.c);
  }
}
function showPeerBubble(p,text){
  removePeerBubble(p);
  const sp=makeTextSprite(String(text).slice(0,40),'rgba(255,255,255,.94)','#12283f','💬');
  sp.scale.set(9,2.25,1); sp.position.y=4.3;
  p.grp.add(sp); p.bubble=sp;
  p.bubbleTm=setTimeout(()=>removePeerBubble(p),CHAT_MS);
}
function removePeerBubble(p){
  if(p.bubbleTm){ clearTimeout(p.bubbleTm); p.bubbleTm=0; }
  if(p.bubble){ if(p.bubble.parent) p.bubble.parent.remove(p.bubble);
    if(p.bubble.material.map) p.bubble.material.map.dispose();
    p.bubble.material.dispose(); p.bubble=null; }
}
function dropPeer(uid){
  const p=peers[uid];
  if(!p) return;
  removePeerBubble(p);
  if(p.grp) scene.remove(p.grp);
  delete peers[uid];
  renderBoard();
}
function peerTick(dt){
  const k=clamp(dt*7,0,1);
  for(const uid in peers){
    const p=peers[uid];
    p.cur.x=lerp(p.cur.x,p.tgt.x,k);
    p.cur.z=lerp(p.cur.z,p.tgt.z,k);
    let dy=p.yawTgt-p.yawCur;
    while(dy>Math.PI) dy-=Math.PI*2;
    while(dy<-Math.PI) dy+=Math.PI*2;
    p.yawCur+=dy*k;
    if(p.grp){
      p.grp.position.set(p.cur.x,0,p.cur.z);
      p.grp.rotation.y=p.yawCur;
    }
    /* 🪽 รอบ 907 — ไล่ระดับไฟท้ายรถเพื่อนแบบเดียวกับของเรา (ไม่ใช่ตัด/เปิดแบบกระตุก) */
    p.drsK=lerp(p.drsK||0,p.drsTgt||0,clamp(dt*9,0,1));
    const gl=p.grp&&p.grp.userData&&p.grp.userData.drsGlow;
    if(gl) gl.material.opacity=p.drsK*0.85;
  }
}
function netLeave(){
  if(room){ room.leave(); room=null; }
  for(const uid in peers) dropPeer(uid);
}
function renderBoard(){
  if(!boardEl) return;
  const uids=Object.keys(peers);
  const note=room?room.statusText(innerHeight<430,uids.length):'';
  if(!uids.length&&!note){ boardEl.classList.remove('on'); boardSig=''; return; }
  const myName=(typeof onlineDisplayName==='function'&&onlineDisplayName())||state.playerName||'ฉัน';
  const me={n:myName,w:sessionWords,me:true,g:(state.student&&state.student.grade)||''};
  const rows=uids.map(u=>({n:peers[u].n,w:peers[u].w||0,me:false,
      g:peers[u].grade||((typeof gradeOf==='function')?gradeOf(u):'')}))
    .concat([me]).sort((a,b)=>b.w-a.w).slice(0,5);
  const sig=note+'|'+rows.map(r=>r.n+':'+r.w+':'+r.g).join('|');
  if(sig===boardSig){ boardEl.classList.add('on'); return; }
  boardSig=sig;
  boardEl.innerHTML='<div class="m-bd-h">🏆 คำที่เก็บได้รอบนี้</div>'+rows.map((r,i)=>
    `<div class="m-bd-r${r.me?' me':''}"><span>${i===0?'🥇':i===1?'🥈':i===2?'🥉':'　'}</span>`+
    `<span class="m-bd-n">🏎️ ${escapeHTML(r.n)}${(typeof gradeMark==='function')?gradeMark(r.g):''}</span>`+
    `<span class="m-bd-w">${r.w}</span></div>`).join('')
    +(note?`<div style="padding:4px 2px;font-size:.82em;line-height:1.35;opacity:.92">${note}</div>`:'');
  boardEl.classList.add('on');
}

/* ============================================================
   📷 กล้องไล่หลัง + ลูปเกม
   ============================================================ */
/* 🪖 รอบ 901: มุมคนขับ = ภาพหลัก (ภาพห้องคนขับทับจอ · ซ่อนรถตัวเอง) · 📷 = มุมไล่หลังเห็นทั้งคัน */
/* 🛣️ รอบ 914: วน 3 มุม — 🪖 คนขับ → 📷 เห็นรถทั้งคัน → 🛣️ ถนนล้วน (ป้ายปุ่มบอก "มุมถัดไป" เสมอ) */
const CAM_MODES=['cockpit','chase','road'];
const CAM_NEXT_LABEL={cockpit:'📷 มุมรถ',chase:'🛣️ มุมถนน',road:'🪖 มุมคนขับ'};
function cycleCamMode(){
  camMode=CAM_MODES[(CAM_MODES.indexOf(camMode)+1)%CAM_MODES.length];
  applyCamMode();
}
function applyCamMode(){
  const fp=camMode==='cockpit';
  wrapEl.classList.toggle('fp',fp);
  if(camBtnEl) camBtnEl.textContent=CAM_NEXT_LABEL[camMode]||'📷 มุมรถ';
  if(carGrp) carGrp.visible=(camMode==='chase');   // 🛣️ มุมถนนก็ซ่อนรถ (นั่งในรถเหมือนกัน)
  if(fpWheels) fpWheels.visible=fp&&activeGraphicsMode!=='quality';
  camInit=false;
  if(fp) layoutWheel();   // 🎡 รอบ 913 — ตอนซ่อนอยู่วัดขนาดไม่ได้ (0×0) ต้องวัดใหม่ทุกครั้งที่กลับมามุมคนขับ
}
/* 🛞🪖 รอบ 911: ล้อหน้าจริงในมุมคนขับ — carGrp ถูกซ่อน แต่คนขับ F1 ต้องเห็นล้อหน้าดำ ๆ หมุน/เลี้ยวข้างตัว
   (กลุ่มแยกในฉาก โชว์เฉพาะโหมด fp · ตำแหน่ง/มุมตามรถทุกเฟรม · ซี่ล้อสว่างให้ตาจับการหมุนได้) */
function buildFpWheels(){
  const g=new THREE.Group();
  g.name='F1_FP_WHEELS';
  /* 🛞 รอบ 912: เปลี่ยนเป็น MeshBasic (ไม่พึ่งแสง) — เดิม Lambert โดนไฟสนามข้างเดียว
     หน้าล้อฝั่งซ้ายมืดจนก้าน/แถบเหลืองจมหาย (ผู้ใช้เห็นจากเครื่องจริง) · Basic = สองฝั่งชัดเท่ากันเสมอ */
  const tyreM=new THREE.MeshBasicMaterial({color:0x101216});
  const rimM=new THREE.MeshBasicMaterial({color:0x33383f});
  const spokeM=new THREE.MeshBasicMaterial({color:0x99a2ac});
  const bandM=new THREE.MeshBasicMaterial({color:0xd9c400});   // แถบเหลืองแก้มยางแบบ soft
  g.userData.spin=[];
  for(const side of [-1,1]){
    const wg=new THREE.Group(), sg=new THREE.Group();
    /* ฝาทรงกระบอกเป็น "แผ่นเต็ม" — ซ้อนรัศมีลดหลั่น (กว้างขึ้นทีละนิดกัน z-fight) ให้หน้าล้ออ่านเป็น:
       ยางดำหนา → แถบเหลืองบางขอบนอก (แบบยาง soft) → แก้มดำ → ดุมเทาเข้ม + ซี่ */
    const ty=new THREE.Mesh(new THREE.CylinderGeometry(FPW_R,FPW_R,0.38,18),tyreM);
    ty.rotation.z=Math.PI/2; sg.add(ty);
    const band=new THREE.Mesh(new THREE.CylinderGeometry(0.322,0.322,0.384,18),bandM);
    band.rotation.z=Math.PI/2; sg.add(band);
    const wall=new THREE.Mesh(new THREE.CylinderGeometry(0.285,0.285,0.388,18),tyreM);
    wall.rotation.z=Math.PI/2; sg.add(wall);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.185,0.185,0.392,12),rimM);
    rim.rotation.z=Math.PI/2; sg.add(rim);
    for(let k=0;k<3;k++){                     // แท่งซี่พาดหน้าดุม 3 แนว = 6 ซี่ (สีเข้ม แค่พอให้ตาจับการหมุน)
      const sp=new THREE.Mesh(new THREE.BoxGeometry(0.40,0.34,0.04),spokeM);
      sp.rotation.x=k*Math.PI/3; sg.add(sp);
    }
    wg.add(sg); g.add(wg);
    g.userData.spin.push({wg,sg,side});
  }
  g.visible=false;
  return g;
}
function fpWheelTick(dt){
  if(!fpWheels||!fpWheels.visible) return;
  const fx=Math.sin(yaw), fz=Math.cos(yaw);              // ขวามือรถ = (-fz, fx)
  const vF=vx*fx+vz*fz, rollD=vF*dt/FPW_R, sv=-steer*1.15;
  const realistic=activeGraphicsMode==='quality';
  const wheelF=realistic?RFPW_F:FPW_F, wheelS=realistic?RFPW_S:FPW_S, wheelH=realistic?RFPW_H:FPW_H;
  for(const o of fpWheels.userData.spin){
    o.wg.position.set(px+fx*wheelF-fz*wheelS*o.side, wheelH, pz+fz*wheelF+fx*wheelS*o.side);
    o.wg.scale.setScalar(realistic?RFPW_SCALE:1);
    o.wg.rotation.y=yaw+sv;                              // ล้อหน้าหักตามพวงมาลัย
    o.sg.rotation.x+=rollD;                              // หมุนตามความเร็วจริง (ถอย = หมุนกลับ)
  }
}
/* 🎡 รอบ 913: วาง <img> พวงมาลัยให้ทับ "กรอบภาพจริง" ของ background-image ใน #f1-cockpit เป๊ะ
   — อ่าน background-size/position ที่เบราว์เซอร์คำนวณแล้วมาใช้ตรง ๆ จึงเปลี่ยนตาม @media เองโดยไม่ต้องเขียนสูตรซ้ำ
   (ทับพอดี = จุดหมุน WHEEL_HUB_* ซึ่งเป็น % ของภาพ ตรงกับแกนพวงมาลัยจริงทุกขนาดจอ) */
function cockpitBox(){
  if(!cockpitEl) return null;
  const bw=cockpitEl.clientWidth, bh=cockpitEl.clientHeight;
  const iw=WHEEL_IMG_W, ih=WHEEL_IMG_H;
  if(!bw||!bh) return null;
  const cs=getComputedStyle(cockpitEl);
  let w,h;
  const pc=cs.backgroundSize.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  if(pc){ w=bw*parseFloat(pc[1])/100; h=bh*parseFloat(pc[2])/100; }
  else { const k=Math.max(bw/iw,bh/ih); w=iw*k; h=ih*k; }        // cover
  const kw={left:0,top:0,center:50,right:100,bottom:100};
  const at=t=>t==null?50:(t in kw?kw[t]:(t.slice(-1)==='%'?parseFloat(t):50));
  const bp=cs.backgroundPosition.trim().split(/\s+/);
  return {w,h,left:(bw-w)*at(bp[0])/100,top:(bh-h)*at(bp[1])/100,sy:h/(w*ih/iw)};
}
function layoutWheel(){
  const b=cockpitBox(); if(!b) return;
  layoutDash(b);                 // 🔢 รอบ 916 — จอตัวเลขวางได้แม้ภาพพวงมาลัยแยกชั้นจะโหลดไม่ขึ้น
  if(!wheelEl||!wheelEl.naturalWidth) return;
  const w=b.w, h=b.h;
  wheelEl.style.width=w+'px';  wheelEl.style.height=h+'px';
  wheelEl.style.left=b.left+'px';
  wheelEl.style.top =b.top+'px';
  wheelEl.style.transformOrigin=WHEEL_HUB_X+'% '+WHEEL_HUB_Y+'%';
  if(ledsEl){                    // 🚥 รอบ 918 — ชั้นดวงไฟใช้กรอบ/จุดหมุนเดียวกับพวงมาลัยเป๊ะ
    ledsEl.style.width=wheelEl.style.width;  ledsEl.style.height=wheelEl.style.height;
    ledsEl.style.left =wheelEl.style.left;   ledsEl.style.top   =wheelEl.style.top;
    ledsEl.style.transformOrigin=wheelEl.style.transformOrigin;
  }
  /* จอกว้างเตี้ยยืดภาพแนวตั้ง (100% 128%) — ถ้าหมุนตรง ๆ พวงมาลัยจะบิดผิดรูประหว่างหมุน
     จึง "คลายการยืด → หมุน → ยืดกลับ" ให้หมุนในสัดส่วนจริงของภาพ (cover = 1 พอดี ไม่มีผล) */
  wheelSy=b.sy;
  wheelDeg=null;   // สั่งวาด transform ใหม่รอบหน้า (สูตรเปลี่ยนตามการยืด)
}
/* 🎡 รอบ 913: หมุนพวงมาลัยตามมุมล้อหน้าจริง (steer) — คูณอัตราทดให้เห็นชัดตอนความเร็วสูงที่ล้อขยับนิดเดียว
   🫨 รอบ 914: บวกอาการมือสั่นบน kerb/ทราย — ใช้ shakeT/SHAKE_HZ ตัวเดียวกับกล้อง (รอบ 907, อัปเดตใน camTick ก่อนหน้านี้แล้วในเฟรมเดียวกัน)
   จึงสั่นจังหวะเดียวกับที่กล้อง/โลกสั่น ไม่ใช่คนละจังหวะที่ดูหลอน */
function wheelTick(){
  if(!wheelEl||camMode!=='cockpit') return;
  const deg=clamp(steer*(180/Math.PI)*WHEEL_RATIO,-WHEEL_MAX_DEG,WHEEL_MAX_DEG);
  const shakeAmp=surfNow==='kerb'?WHEEL_SHAKE_KERB_PX:(surfNow==='sand'?WHEEL_SHAKE_SAND_PX:0);
  const shaking=shakeAmp>0;
  if(!shaking&&!wheelShakeOn&&wheelDeg!==null&&Math.abs(deg-wheelDeg)<0.05) return;
  wheelShakeOn=shaking;
  wheelDeg=deg;
  const quality=activeGraphicsMode==='quality';
  const handDeg=clamp(deg,-QUALITY_HAND_MAX_DEG,QUALITY_HAND_MAX_DEG);
  let sx=0, sy2=0;
  if(shaking){
    const a=shakeAmp*clamp(spd/SHAKE_SPD_REF,0,1);
    sx=Math.sin(shakeT*Math.PI*2*SHAKE_HZ)*a;
    sy2=Math.sin(shakeT*Math.PI*2*SHAKE_HZ*1.7+1.3)*a*0.6;
  }
  const r=(shaking?'translate('+sx.toFixed(2)+'px,'+sy2.toFixed(2)+'px) ':'')+'rotate('+deg.toFixed(2)+'deg)';
  const qr=(shaking?'translate('+sx.toFixed(2)+'px,'+sy2.toFixed(2)+'px) ':'')+'rotate('+handDeg.toFixed(2)+'deg)';
  const tr=Math.abs(wheelSy-1)<0.01?r
    :'scaleY('+wheelSy.toFixed(4)+') '+r+' scaleY('+(1/wheelSy).toFixed(4)+')';
  wheelEl.style.transform=tr;
  if(cockpitTurnEl){
    if(quality&&Math.abs(handDeg)>.05){
      const src=handDeg<0?'img/f1/cockpit_turn_left.webp':'img/f1/cockpit_turn_right.webp';
      if(src!==cockpitTurnSrc){cockpitTurnSrc=src;cockpitTurnEl.src=src;}
      cockpitTurnEl.style.opacity=String(clamp(Math.abs(handDeg)/QUALITY_HAND_MAX_DEG,0,1));
    }else cockpitTurnEl.style.opacity='0';
  }
  if(knobEl) knobEl.style.setProperty('--ctl-turn',(deg*1.25).toFixed(2)+'deg');
  if(ledsEl) ledsEl.style.transform=wheelEl.style.transform;   // 🚥 รอบ 918 — ดวงไฟหมุนไปกับพวงมาลัย
  if(dashEl) dashEl.style.transform=quality?qr:tr; // Quality ใช้องศาเดียวกับภาพมือ ±14°
}
/* ============================================================
   🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
   ภาพ wheel.webp มีจอ LCD + แถบไฟรอบเครื่องวาดตายตัวมาในตัว (เกียร์ 5 / เลข 12210 / แถบส้ม)
   → ปู <canvas> ขนาดเท่า "กรอบจอ" (DASH_PX) ทับ แล้ววาดเกียร์/ความเร็ว/รอบเครื่องจากค่าจริงในเกม
   หมุน+สั่นไปพร้อมพวงมาลัยเพราะใช้ transform และแกนหมุนชุดเดียวกัน (ดู wheelTick)
   ============================================================ */
const DASH_FONT="'Kanit','Segoe UI',sans-serif";
function layoutDash(b){
  if(!dashEl||!dashCtx) return;
  const sx=b.w/WHEEL_IMG_W, sy=b.h/WHEEL_IMG_H;     // ภาพถูกย่อ/ยืดเท่าไหร่บนจอจริง (จอกว้างเตี้ยยืดแนวตั้ง)
  const w=DASH_PX.w*sx, h=DASH_PX.h*sy;
  dashEl.style.width=w+'px';  dashEl.style.height=h+'px';
  dashEl.style.left=(b.left+DASH_PX.x*sx)+'px';
  dashEl.style.top =(b.top +DASH_PX.y*sy)+'px';
  /* หมุนรอบแกนพวงมาลัยจุดเดียวกับชั้นภาพ — origin ของ canvas นับจากมุมซ้ายบนของตัวเอง จึงลบระยะเยื้องออก */
  dashEl.style.transformOrigin=(b.w*WHEEL_HUB_X/100-DASH_PX.x*sx)+'px '+(b.h*WHEEL_HUB_Y/100-DASH_PX.y*sy)+'px';
  const k=Math.min(2.5,Math.max(1.5,window.devicePixelRatio||1))*w/DASH_PX.w;  // วาดละเอียดกว่าจอจริง 1.5 เท่าเป็นอย่างน้อย = ตัวเลขคมไม่ฟุ้ง
  const cw=Math.max(1,Math.round(DASH_PX.w*k)), ch=Math.max(1,Math.round(DASH_PX.h*k));
  if(dashEl.width!==cw||dashEl.height!==ch){ dashEl.width=cw; dashEl.height=ch; }
  dashK=k; dashSig='';        // ขนาดเปลี่ยน = ภาพในบัฟเฟอร์หาย ต้องวาดใหม่รอบหน้า
}
function dashRR(c,x,y,w,h,r){                       // สี่เหลี่ยมมุมมน (ไม่พึ่ง ctx.roundRect ที่เครื่องเก่าไม่มี)
  c.beginPath();
  c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
}
/* รอบเครื่อง: คิดจาก "เกียร์ + ความเร็วในเกียร์" สูตรเดียวกับเสียงเครื่องยนต์ (Snd.tick)
   → เลขบนจอกับเสียงที่ได้ยินตรงกันเสมอ · ไล่ค่าแบบนุ่ม ๆ ไม่ให้ตัวเลขกระตุกตอนเปลี่ยนเกียร์ */
function dashRpmTick(dt){
  let t;
  if(revNow)          t=0.22+clamp(spd/REV_MAX,0,1)*0.5;
  else if(spd<0.6)    t=(padThr>0.05||kThr)?0.72:0.10;      // จอดอยู่: เหยียบคันเร่ง = เร่งเครื่องรอออกตัว
  else{
    const g=gearOf(spd), gLo=GEARS[g-1]||0, gHi=GEARS[g]||92;
    t=0.25+clamp((spd-gLo)/Math.max(1,gHi-gLo),0,1)*0.75;
  }
  dashRpm=lerp(dashRpm,t,clamp(dt*8,0,1));
}
function dashTick(dt){
  if(!dashCtx||camMode!=='cockpit') return;
  dashRpmTick(dt);
  const kmh=Math.round(spd*3.6);
  const gear=revNow?'R':(spd<0.6?'N':String(gearOf(spd)));
  const rp=Math.round((DASH_RPM_MIN+(DASH_RPM_MAX-DASH_RPM_MIN)*clamp(dashRpm,0,1))/50)*50;
  const led=clamp((dashRpm-0.30)/0.66,0,1);                 // ไฟดวงแรกติดตอนเริ่มมีภาระจริง ไม่ใช่ตั้งแต่เดินเบา
  const nLed=Math.round(led*DASH_LED_N);
  const blink=led>=0.99?Math.floor(performance.now()/90)%2:0;   // ไฟตัดรอบกะพริบ = สัญญาณให้เปลี่ยนเกียร์
  const lap=lapStartAt?fmtLap(lapNow):'--';
  const sig=gear+'|'+kmh+'|'+rp+'|'+nLed+blink+'|'+lap+'|'+(pitLimited?1:0)+'|'+(lapBest?fmtLap(lapBest):'');
  if(sig===dashSig) return;                                 // ค่าไม่เปลี่ยน = ไม่ต้องวาดใหม่ (จอเล็กแต่วาดทุกเฟรมก็เปลืองเปล่า)
  dashSig=sig;
  drawDash({gear,kmh,rp,led,nLed,blink,lap});
}
function drawDash(d){
  const c=dashCtx, W=DASH_PX.w, H=DASH_PX.h;
  c.setTransform(dashK,0,0,dashK,0,0);
  c.clearRect(0,0,W,H);
  c.textBaseline='middle';
  /* ── 🚥 รอบ 918: แถบไฟรอบเครื่องเลิกวาดบน canvas แล้ว — ใช้ "ดวงไฟจริงของภาพ" (ledTick) แทน
        โซนนี้ต้องปล่อยโปร่งไว้เสมอ ห้ามวาดทับ ไม่งั้นบังดวงไฟที่อยู่ชั้นล่าง ── */
  /* ── ตัวจอ LCD (ทึบ = ทับเลขที่ติดมากับภาพให้หมด) ── */
  c.fillStyle='#04070c';
  dashRR(c,4,14,226,102,5); c.fill();   // 🚥 รอบ 918 — ขอบบนหลบดวงไฟจริงที่อยู่เหนือจอ
  c.strokeStyle='rgba(150,175,200,.32)'; c.lineWidth=1; c.stroke();
  /* ── ครึ่งบน: เกียร์ (ใหญ่สุด เด็กอ่านง่าย) + ความเร็ว + เวลาต่อรอบ ── */
  c.textAlign='center';
  c.fillStyle=d.gear==='R'?'#ff6a5a':(d.gear==='N'?'#8fa3b8':'#ffffff');
  c.font='900 40px '+DASH_FONT;
  c.fillText(d.gear,27,44);
  c.font='700 8px '+DASH_FONT; c.fillStyle='#6d7f92';
  c.fillText('เกียร์',27,64);
  c.textAlign='right';
  c.fillStyle=pitLimited?'#ffd12e':'#ffffff';               // 🚧 ลิมิตเตอร์เลนพิท = เหลือง (บอกว่าไม่ใช่รถเสีย)
  c.font='900 34px '+DASH_FONT;
  c.fillText(String(d.kmh),166,44);
  c.textAlign='left';
  c.font='700 10px '+DASH_FONT; c.fillStyle='#67d2ff';
  c.fillText('กม./ชม.',172,33);
  /* ยังไม่เริ่มจับเวลา = สถานะพร้อมแข่ง */
  if(d.lap!=='--'){ c.font='700 12px '+DASH_FONT; c.fillStyle='#dbe7f3'; c.fillText(d.lap,172,53); }
  else{ c.font='700 11px '+DASH_FONT; c.fillStyle='#9fb3c6'; c.fillText('READY',172,53); }
  c.strokeStyle='rgba(150,175,200,.25)'; c.beginPath(); c.moveTo(9,68); c.lineTo(225,68); c.stroke();
  /* ── ครึ่งล่าง: รอบเครื่องเป็นตัวเลข + แถบไล่ระดับ (แทนแถบส้มที่วาดติดมาในภาพ) ── */
  c.font='700 9px '+DASH_FONT; c.fillStyle='#7d8b99';
  c.fillText('รอบ/นาที',10,78);
  c.font='900 15px '+DASH_FONT; c.fillStyle=d.led>=0.99?'#ff6a5a':'#ffffff';
  c.fillText(d.rp.toLocaleString('en-US'),10,91);
  if(lapBest){
    c.textAlign='right';
    c.font='700 9px '+DASH_FONT; c.fillStyle='#7d8b99'; c.fillText('ดีที่สุด',222,78);
    c.font='900 12px '+DASH_FONT; c.fillStyle='#7cf3a4'; c.fillText(fmtLap(lapBest),222,91);
    c.textAlign='left';
  }
  const bx=10, by=100, bw=212, bh=10;
  c.fillStyle='#0b0f15'; dashRR(c,bx,by,bw,bh,3); c.fill();
  if(d.led>0){
    const g=c.createLinearGradient(bx,0,bx+bw,0);
    g.addColorStop(0,'#25d366'); g.addColorStop(0.6,'#ffd12e'); g.addColorStop(1,'#ff3b30');
    c.save(); dashRR(c,bx,by,bw,bh,3); c.clip();
    c.fillStyle=g; c.fillRect(bx,by,bw*d.led,bh);
    if(d.blink){ c.fillStyle='rgba(255,255,255,.45)'; c.fillRect(bx,by,bw,bh); }
    c.restore();
  }
  c.strokeStyle='rgba(150,175,200,.22)'; dashRR(c,bx,by,bw,bh,3); c.stroke();
}
/* ============================================================
   🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
   ภาพ img/f1/wheel_body.webp = พวงมาลัยที่ไฟดับหมด (หรี่ด้วย tools/f1_split_leds.py)
   ดวงไฟจริงเป็น <i> วางทับตำแหน่งเดิมในภาพ → หมุน/ย่อ-ขยายไปกับพวงมาลัยเสมอ (layoutWheel/wheelTick)
   ============================================================ */
function buildLeds(){
  ledsEl=wrapEl.querySelector('#f1-leds'); if(!ledsEl) return;
  ledsEl.innerHTML=F1_LEDS.map(([x,y,w,h])=>
    `<i style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></i>`).join('');
  ledEls=[...ledsEl.querySelectorAll('i')];
  ledN=-1;
}
/* ภาพ "ไฟดับ" ใช้ไม่ได้ → เลิกวาดดวงไฟ (ภาพสำรองมีไฟติดตายอยู่แล้ว วาดทับจะกลายเป็นไฟค้าง) */
function ledsOff(){
  if(ledsEl) ledsEl.style.display='none';
  ledEls=[]; ledN=-1;
}
function ledTick(dt){
  if(!ledsEl||!ledEls.length||camMode!=='cockpit') return;
  /* รอบเครื่อง: ใช้ค่าเดียวกับจอบนพวงมาลัย (dashRpm รอบ 916 — คิดเร่งเครื่องตอนจอด/เกียร์ถอยไว้ให้แล้ว)
     → ไฟบนขอบพวงมาลัยกับเลข "รอบ/นาที" บนจอ ตรงกันเสมอ ไม่มีทางเถียงกันเอง
     ไม่มีจอ (canvas วาดไม่ได้) = ถอยไปคิดเองจากเกียร์+ความเร็ว สูตรเดียวกับเสียงเครื่องยนต์ */
  if(dashCtx) ledRpm=dashRpm;
  else{
    const v=Math.abs(spd), g=gearOf(v), gLo=GEARS[g-1]||0, gHi=GEARS[g]||92;
    ledRpm=lerp(ledRpm,0.25+clamp((v-gLo)/Math.max(1,gHi-gLo),0,1)*0.75,clamp(dt*LED_RPM_LERP,0,1));
  }
  const k=clamp((ledRpm-LED_K_LO)/LED_K_SPAN,0,1);    // 0 = ยังไม่มีภาระ · 1 = ถึงจุดตัดรอบ
  /* "ใกล้เปลี่ยนเกียร์" วัดจากตำแหน่งในเกียร์แบบสด ๆ — ทุกเกียร์ต้องผ่านจุดนี้ก่อนขึ้นเกียร์เสมอ
     (ถ้าวัดจากค่าหน่วง ไฟจะไม่ทันติดในเกียร์ต่ำที่รถกระชากขึ้นเกียร์เร็ว) */
  const sv=Math.abs(spd), sg=gearOf(sv), sLo=GEARS[sg-1]||0, sHi=GEARS[sg]||92;
  const shift=!revNow&&sv>=0.6&&clamp((sv-sLo)/Math.max(1,sHi-sLo),0,1)>=LED_SHIFT_R;
  const n=shift?ledEls.length:Math.round(k*ledEls.length);
  if(shift){ ledFlashT+=dt; const half=0.5/LED_FLASH_HZ; if(ledFlashT>=half){ ledFlashT-=half; ledFlash=!ledFlash; } }   // ลบทีละครึ่งคาบ ไม่ล้างทิ้ง — จังหวะกะพริบไม่เพี้ยนตามเฟรมเรต
  else if(ledFlash||ledFlashT){ ledFlashT=0; ledFlash=false; }
  const sig=n+'|'+(shift?(ledFlash?2:1):0);
  if(sig===ledN) return;                              // ไม่มีอะไรเปลี่ยน = ไม่แตะ DOM (ทุกเฟรม)
  ledN=sig;
  for(let i=0;i<ledEls.length;i++){
    ledEls[i].className = i>=n ? ''
      : (shift ? (ledFlash?'on f':'on r')
               : 'on '+(i<LED_GREEN_N?'g':(i<LED_AMBER_N?'y':'r')));
  }
}
function camTick(dt){
  if(camMode!=='chase'){                 // 🪖 คนขับ + 🛣️ ถนนล้วน ใช้จุดกล้องเดียวกัน ต่างแค่ระดับสายตา/FOV (รอบ 914)
    const road=camMode==='road';
    const realistic=activeGraphicsMode==='quality'&&!road;
    const eyeH=road?ROAD_EYE:(realistic?RFP_EYE:FP_EYE);
    const dropH=road?ROAD_DROP:(realistic?RFP_DROP:FP_DROP);
    const fovBase=road?ROAD_FOV:(realistic?RFP_FOV:FP_FOV);
    const fwd=realistic?RFP_FWD:FP_FWD, look=realistic?RFP_LOOK:FP_LOOK;
    /* หัวคนขับตรึงกับรถ — ห้ามหน่วง ไม่งั้นโลก 3D กับภาพห้องคนขับแยกจากกัน */
    camYaw=yaw;
    const fx=Math.sin(yaw), fz=Math.cos(yaw);
    /* 🫨 รอบ 907: กล้องสั่นเบา ๆ บน kerb/ทราย ตามความเร็ว — สั่นตำแหน่ง+จุดมองพร้อมกัน (ออฟเซตเดียวกันทั้งคู่) กันหัวคนขับกับจุดมองแยกจากกัน */
    const shakeAmp=surfNow==='kerb'?SHAKE_KERB_AMP:(surfNow==='sand'?SHAKE_SAND_AMP:0);
    let ox=0, oy=0, oz=0;
    if(shakeAmp>0){
      const a=shakeAmp*clamp(spd/SHAKE_SPD_REF,0,1);
      shakeT+=dt*clamp(spd/SHAKE_SPD_REF,0.15,1);
      const sx=Math.sin(shakeT*Math.PI*2*SHAKE_HZ)*a;
      oy=Math.sin(shakeT*Math.PI*2*SHAKE_HZ*1.7+1.3)*a*0.6;
      ox=fz*sx; oz=-fx*sx;   // สั่นด้านข้างอิงทิศรถ (ตั้งฉากกับ fx,fz) ไม่ใช่แกนโลกตรง ๆ
    }
    camera.position.set(px+fx*fwd+ox,eyeH+oy,pz+fz*fwd+oz);
    camera.lookAt(px+fx*(fwd+look)+ox,eyeH-dropH+oy,pz+fz*(fwd+look)+oz);
    const fov=fovBase+clamp(spd/92,0,1)*(realistic?8:12);
    if(Math.abs(camera.fov-fov)>0.2){ camera.fov=fov; camera.updateProjectionMatrix(); }
    return;
  }
  const dist=9.5+spd*0.075, h=3.4+spd*0.012;
  const lookAhead=8+spd*0.28;
  /* กล้องหันตามทิศรถแบบหน่วง (เห็นรถไถลเวลาดริฟต์) */
  let dy=yaw-camYaw;
  while(dy>Math.PI) dy-=Math.PI*2;
  while(dy<-Math.PI) dy+=Math.PI*2;
  camYaw+=dy*clamp(dt*4.2,0,1);
  const cx=px-Math.sin(camYaw)*dist, cz=pz-Math.cos(camYaw)*dist;
  if(!camInit){ camPos=V3(cx,h,cz); camInit=true; }
  camPos.x=lerp(camPos.x,cx,clamp(dt*7,0,1));
  camPos.y=lerp(camPos.y,h,clamp(dt*5,0,1));
  camPos.z=lerp(camPos.z,cz,clamp(dt*7,0,1));
  camera.position.copy(camPos);
  camera.lookAt(px+Math.sin(yaw)*lookAhead,1.1,pz+Math.cos(yaw)*lookAhead);
  const fov=62+clamp(spd/92,0,1)*16;
  if(Math.abs(camera.fov-fov)>0.2){ camera.fov=fov; camera.updateProjectionMatrix(); }
}
function hudTick(){
  const kmh=Math.round(spd*3.6);
  speedEl.innerHTML=kmh+'<small> กม./ชม.</small>';
  const g=revNow?'R':(spd<0.6?'N':gearOf(spd));   // ⏪ รอบ 911 — ถอยอยู่โชว์เกียร์ R
  gearEl.textContent=g;
  /* 🚧 รอบ 905: ลิมิตเตอร์ทำงาน = เลขความเร็วเป็นสีเหลือง (บอกว่าไม่ใช่รถเสีย) */
  speedEl.style.color=pitLimited?'#ffd12e':'#fff';
  drsHud();
}
let mapAt=0, relocAt=0;
function frame(dt,now){
  lightsTick(dt);          // 🚦 รอบ 902 — ต้องมาก่อน physTick (ล็อกคันเร่งจนไฟดับ)
  physTick(dt);
  ghostTick(dt);           // 👻 รอบ 902
  collectTick();
  peerTick(dt);
  smokeTick(dt);
  fpWheelTick(dt);         // 🛞 รอบ 911 — ต้องมาหลัง physTick (ใช้ px/pz/yaw ล่าสุด)
  camTick(dt);
  wheelTick();             // 🎡 รอบ 913 — พวงมาลัยหมุนตาม steer
  dashTick(dt);            // 🔢 รอบ 916 — จอเกียร์/ความเร็ว/รอบเครื่องบนพวงมาลัย (ต้องมาหลัง wheelTick ให้ transform ตรงเฟรมเดียวกัน)
  ledTick(dt);             // 🚥 รอบ 918 — ไฟบนขอบพวงมาลัย (ต้องมาหลัง dashTick: ใช้ dashRpm ก้อนเดียวกัน)
  hudTick();
  netSend(false);
  if(now-mapAt>200){ mapAt=now; drawMap(); }
  if(now-relocAt>3000){ relocAt=now; relocTick(); }
  renderer.render(scene,camera);
}
function tick(now){
  if(!running) return;
  const dt=Math.min(0.05,(now-lastT)/1000)||0.016;
  lastT=now;
  frame(dt,now);
  rafId=requestAnimationFrame(tick);
}
function fit(){
  const w=innerWidth,h=innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  layoutWheel();   // 🎡 รอบ 913 — หมุนจอ/ย่อขยาย = กรอบภาพค็อกพิทเปลี่ยน ต้องวางพวงมาลัยใหม่
}

/* ============================================================
   🚪 เข้า/ออกโลก
   ============================================================ */
function applyEnvironmentProfile(profile,mode){
  if(!profile||profile.contract!=='vw.f1.environment-profile/v1') return;
  const r=profile.renderer||{}, e=profile.environment||{};
  activeGraphicsMode=mode||profile.id||'battery';
  activeEnvironmentProfile=profile;
  const realistic=activeGraphicsMode==='quality';
  if(realistic&&!realisticRoot){
    const requested=['low','medium','high'].includes(e.qualityTier)?e.qualityTier:chooseRealisticTier();
    realisticTier=requested;
    realisticRoot=buildRealisticCircuit(requested);
    realisticStats=realisticRoot.userData.stats;
    scene.add(realisticRoot);
  }
  if(realisticRoot) realisticRoot.visible=realistic;
  /* Realistic ใช้สถาปัตยกรรม modular ที่วางตาม track-space เท่านั้น; ซ่อน OSM footprint เดิม
     ทั้งกลุ่มเพื่อไม่ให้ก้อนอาคารจากผังจริงซ้อน/ขวางถนน ส่วน Battery Saver ยังเก็บของเดิมไว้ */
  if(legacyArchitectureRoot) legacyArchitectureRoot.visible=!realistic;
  if(wrapEl) wrapEl.classList.toggle('realistic',realistic);
  if(fpWheels) fpWheels.visible=camMode==='cockpit'&&!realistic;
  if(camMode==='cockpit'&&cockpitEl) requestAnimationFrame(layoutWheel);
  const tierCap=realisticTier==='low'?1.45:(realisticTier==='medium'?1.8:Number(r.pixelRatioCap)||2.35);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,realistic?tierCap:(Number(r.pixelRatioCap)||2)));
  if(typeof THREE.NoToneMapping!=='undefined'&&typeof THREE.ACESFilmicToneMapping!=='undefined')
    renderer.toneMapping=r.toneMapping==='aces'?THREE.ACESFilmicToneMapping:THREE.NoToneMapping;
  if(Number.isFinite(r.exposure)) renderer.toneMappingExposure=r.exposure;
  if(Number.isFinite(e.background)) scene.background.setHex(e.background);
  if(scene.fog){
    if(Number.isFinite(e.fogColor)) scene.fog.color.setHex(e.fogColor);
    if(Number.isFinite(e.fogNear)) scene.fog.near=e.fogNear;
    if(Number.isFinite(e.fogFar)) scene.fog.far=e.fogFar;
  }
  if(Number.isFinite(e.cameraFar)){camera.far=e.cameraFar;camera.updateProjectionMatrix();}
  camera.near=realistic?.14:.3;
  camera.updateProjectionMatrix();
  if(envLights){
    if(Number.isFinite(e.hemisphere)) envLights.hemi.intensity=e.hemisphere;
    if(Number.isFinite(e.keyLight)) envLights.sun.intensity=e.keyLight;
    if(Number.isFinite(e.warmLight)) envLights.warm.intensity=e.warmLight;
  }
}
function start(options){
  if(running) return;
  if(!built) build();
  options=options||{};
  applyEnvironmentProfile(options.environmentProfile,options.graphicsMode);
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  wrapEl.classList.add('on');
  introEl.style.display='flex';
  exitBox.classList.remove('on');
  frMount();
  sessionCoins=0; sessionWords=0;
  coinsEl.textContent='🪙 +0';
  myChat=null; boardSig='';
  boardEl.classList.remove('on'); boardEl.innerHTML='';
  chatBarEl.classList.remove('on'); selfMsgEl.classList.remove('on');
  /* เกิดบนกริดสตาร์ท: หลังเส้น S/F เยื้องซ้าย-ขวาแบบกริดจริง */
  const slot=Math.floor(Math.random()*GRID_N);
  const back=18+(slot>>1)*9, side=(slot%2?1:-1)*(HALF_W*0.45);
  const gi=((sfIdx-Math.round(back/SAMPLE_M))%LINE.n+LINE.n)%LINE.n;
  px=LINE.x[gi]+LINE.nx[gi]*side;
  pz=LINE.z[gi]+LINE.nz[gi]*side;
  yaw=Math.atan2(LINE.tx[gi],LINE.tz[gi]);
  vx=vz=spd=0; steer=0; slide=0; steerCtl=0; padThr=0; padBr=false;
  padRev=false; revNow=false; sandT=0; portalActive=false; portalT=0; portalJumped=false;
  if(portalEl) portalEl.className='';   // ⏪🏜️🌀
  kL=kR=kThr=kBack=false;
  myIdx=gi; surfNow='track';
  drsOn=false; drsInZone=false; drsGap=0; drsFlapK=0; drsBrake=false;                // 🪽 รอบ 904
  if(drsEl){ drsEl.className=''; drsEl.innerHTML=''; }
  lapStartAt=0; lapNow=0; lapBest=0; lapCount=0; cpFlags=[false,false,false]; lastProg=0;
  camInit=false; camYaw=yaw;
  camMode='cockpit'; applyCamMode();   // 🪖 รอบ 901 — เข้าสนามเริ่มที่มุมคนขับเสมอ (ภาพหลัก)
  inPit=false; pitLaneNow=false; pitLimited=false; lapPitted=false;
  resetLights();            // 🚦 รอบ 902 — ตั้งลำดับไฟใหม่ทุกครั้งที่เข้าสนาม
  ghostLoad(); ghostReset(); ghostHide();
  knobEl.style.left='50%';
  netJoin();
  fit();
  pickWord();
  if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
  keydownFn=e=>{
    if(e.repeat) return;
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kL=true;
    else if(k==='d'||k==='arrowright') kR=true;
    else if(k==='w'||k==='arrowup'||k===' '){ kThr=true; Snd.start();
      if(introEl.style.display!=='none') introEl.style.display='none';
      beginLights(); }
    else if(k==='s'||k==='arrowdown') kBack=true;
    else if(k==='r') padRev=true;                       // ⏪ รอบ 911
    else if(k==='escape') exitBox.classList.add('on');
  };
  keyupFn=e=>{
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kL=false;
    else if(k==='d'||k==='arrowright') kR=false;
    else if(k==='w'||k==='arrowup'||k===' ') kThr=false;
    else if(k==='s'||k==='arrowdown') kBack=false;
    else if(k==='r') padRev=false;                      // ⏪ รอบ 911
  };
  resizeFn=()=>fit();
  window.addEventListener('keydown',keydownFn);
  window.addEventListener('keyup',keyupFn);
  window.addEventListener('resize',resizeFn);
  running=true; lastT=performance.now();
  rafId=requestAnimationFrame(tick);
}
function exitWorld(){
  running=false;
  netLeave();
  cancelAnimationFrame(rafId);
  window.removeEventListener('keydown',keydownFn);
  window.removeEventListener('keyup',keyupFn);
  window.removeEventListener('resize',resizeFn);
  Snd.stop();
  portalActive=false; portalT=0; portalJumped=false;
  if(portalEl) portalEl.className='';
  letters.forEach(l=>scene.remove(l.spr)); letters=[]; word=null;
  smokes.forEach(s=>scene.remove(s.m)); smokes=[];
  ghostHide(); paintLights(0);
  if(lightsEl) lightsEl.classList.remove('on');
  if(renderer) renderer.setSize(2,2,false);
  wrapEl.classList.remove('on');
  exitBox.classList.remove('on');
  if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
  saveState();
  if(typeof renderDashboard==='function') renderDashboard();
  if(sessionWords>0||sessionCoins>0)
    toast(`🏎️ กลับจาก Vocab World Racing — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.F1World={
  start,
  _t:{
    get running(){return running}, set running(v){running=v},
    get pos(){return {x:px,z:pz,yaw,spd,vx,vz,slide,surf:surfNow}},
    set pos(v){ if('x'in v)px=v.x; if('z'in v)pz=v.z; if('yaw'in v)yaw=v.yaw;
      if('spd'in v){ vx=Math.sin(yaw)*v.spd; vz=Math.cos(yaw)*v.spd; } },
    set input(v){ if('steer'in v)steerCtl=v.steer; if('thr'in v)padThr=v.thr; if('br'in v)padBr=!!v.br; },
    get line(){return LINE}, get total(){return TOTAL}, get sfIdx(){return sfIdx},
    get lap(){return {now:lapNow,best:lapBest,count:lapCount,cp:cpFlags.slice(),startAt:lapStartAt}},
    get letters(){return letters},
    /* 👥 รอบ 939 — เทสต์ปุ่ม "ไปหาเพื่อน" บนกระดาน (ยัด room ปลอมได้โดยไม่ต้องต่อ Firebase จริง) */
    get room(){return room}, set room(v){room=v}, renderBoard,
    give(){ letters.slice().forEach(l=>{ word.got.push(l.idx); scene.remove(l.spr); }); letters=[]; completeWord(); },
    surfAt, nearIdx, trackPointAhead, pickWord, collectTick, physTick, barrierBounce,
    beginPortalReturn, portalTick, respawnOnTrack,
    get word(){return word?{en:word.en,got:word.got.slice(),complete:!!word.complete,
      letterCount:letters.length,distances:letters.map(l=>l.lapDistance)}:null;},
    /* 🪽 รอบ 904 */
    get drs(){return {on:drsOn,inZone:drsInZone,gap:drsGap,flapK:drsFlapK,
      zones:drsZones.map(z=>({a:z.a,b:z.b,len:z.len})),
      flapRot:(carGrp&&carGrp.userData.drsFlap)?carGrp.userData.drsFlap.rotation.x:null,
      glow:(carGrp&&carGrp.userData.drsGlow)?carGrp.userData.drsGlow.material.opacity:null,
      hud:drsEl?{cls:drsEl.className,txt:drsEl.textContent}:null,
      /* 🪽 รอบ 908 — ป้ายเสาริมแทร็ก + เสียงลม */
      boards:drsBoards.map(b=>({kind:b.kind,zone:b.zone,i:b.i,side:b.side,
        x:b.grp.position.x,z:b.grp.position.z,ry:b.grp.rotation.y})),
      det:drsZones.map(z=>drsDetIdx(z)), windHz:Snd.windHz}},
    drsDetIdx, buildDrsBoards,
    /* 🚦👻 รอบ 902 */
    get lights(){return {phase:lightPhase,lit:lightsLit,locked:lightsLocked(),t:lightT,hold:holdS,
      pen:penaltyT,jumped,react:reactDone,held:heldAtGo,
      dots:lightDots.filter(d=>d.classList.contains('lit')).length,
      mesh:startLights.map(l=>({c:l.m.material.color.getHex(),o:l.g.material.opacity})),
      note:lightNoteEl?lightNoteEl.textContent:null, on:lightsEl?lightsEl.classList.contains('on'):null}},
    beginLights, resetLights,
    setHold(v){ holdS=v; },
    get ghost(){return {has:!!ghostBest,t:ghostBest?ghostBest.t:0,n:ghostBest?ghostBest.x.length:0,
      rec:ghostRec?ghostRec.x.length:0,vis:ghostShown,gap:ghostGap,
      pos:(ghostGrp&&ghostShown)?{x:ghostGrp.position.x,z:ghostGrp.position.z,yaw:ghostGrp.rotation.y}:null,
      hud:gapEl?{cls:gapEl.className,txt:gapEl.textContent}:null}},
    setGhost(d){ ghostBest=d; if(d) ghostSave(); else { try{localStorage.removeItem(GHOST_KEY);}catch(e){} } },
    ghostLoad, ghostReset, ghostKeep, ghostTick,
    get pit(){return {inPit,limited:pitLimited,lapPitted,
      line:PITL?{n:PITL.n,len:PITL.len}:null}},
    pitAt, inPitLane,
    /* 🎡 รอบ 913 — พวงมาลัยแยกชั้น */
    get wheel(){ if(!wheelEl) return {el:null};
      const r=wheelEl.getBoundingClientRect(), c=cockpitEl.getBoundingClientRect();
      return {el:true,deg:wheelDeg,sy:wheelSy,tf:wheelEl.style.transform,org:wheelEl.style.transformOrigin,
        w:parseFloat(wheelEl.style.width),h:parseFloat(wheelEl.style.height),
        left:parseFloat(wheelEl.style.left),top:parseFloat(wheelEl.style.top),
        box:{w:cockpitEl.clientWidth,h:cockpitEl.clientHeight},rect:{x:r.x,y:r.y,w:r.width,h:r.height},
        cock:{x:c.x,y:c.y,w:c.width,h:c.height},
        quality:qualityWheelEl?{visible:getComputedStyle(qualityWheelEl).display!=='none',tf:qualityWheelEl.style.transform,
          rect:(()=>{const q=qualityWheelEl.getBoundingClientRect();return{x:q.x,y:q.y,w:q.width,h:q.height};})()}:null,
        bg:getComputedStyle(cockpitEl).backgroundImage,
        bs:getComputedStyle(cockpitEl).backgroundSize,bp:getComputedStyle(cockpitEl).backgroundPosition}; },
    layoutWheel, wheelTick,
    ledTick, buildLeds, ledsOff,                                  // 🚥 รอบ 918
    get ledSig(){return ledN;}, get ledRpm(){return ledRpm;},
    get ledCls(){return ledEls.map(e=>e.className);},
    /* 🔢 รอบ 916 — จอตัวเลขบนพวงมาลัย */
    get dash(){ if(!dashEl) return {el:null};
      const r=dashEl.getBoundingClientRect();
      return {el:true,rpm:dashRpm,sig:dashSig,k:dashK,cv:{w:dashEl.width,h:dashEl.height},
        w:parseFloat(dashEl.style.width),h:parseFloat(dashEl.style.height),
        left:parseFloat(dashEl.style.left),top:parseFloat(dashEl.style.top),
        org:dashEl.style.transformOrigin,tf:dashEl.style.transform,
        rect:{x:r.x,y:r.y,w:r.width,h:r.height}}; },
    layoutDash:()=>layoutWheel(), dashTick, dashRpmTick, setDashRpm(v){ dashRpm=clamp(v,0,1); dashSig=''; },
    get surf(){return surfNow}, setSurf(v){ surfNow=v; },   // 🫨🎡 รอบ 914 — เทสต์มือสั่นโดยไม่ต้องขับจริงไปชน kerb
    get portal(){return {active:portalActive,t:portalT,jumped:portalJumped,target:portalTargetIdx,
      cls:portalEl?portalEl.className:''};},
    get camMode(){return camMode}, setCamMode(v){ camMode=v; applyCamMode(); },
    get peers(){return peers},
    fakePeer(uid,x,z,extra){ onPeer(uid,Object.assign({n:'เทส '+uid,x,z,yaw:0},extra||{})); return peers[uid]; },
    netJoin, netLeave, renderBoard, sendChat,
    get room(){return room},
    get scene(){return scene}, get camera(){return camera}, get car(){return carGrp}, get renderer(){return renderer},
    get graphics(){return {mode:activeGraphicsMode,profile:activeEnvironmentProfile,built,running,
      scene:scene||null,renderer:renderer||null,instancePolicy:'single',realistic:{
        built:!!realisticRoot,visible:!!(realisticRoot&&realisticRoot.visible),tier:realisticTier,
        legacyArchitectureHidden:!!(legacyArchitectureRoot&&!legacyArchitectureRoot.visible),
        stats:realisticStats?Object.assign({},realisticStats):null}}},
    get hands(){return {frame:cockpitTurnSrc,opacity:cockpitTurnEl?Number(cockpitTurnEl.style.opacity||0):0,
      deg:wheelDeg===null?0:clamp(wheelDeg,-QUALITY_HAND_MAX_DEG,QUALITY_HAND_MAX_DEG)};},
    racingLineLat,
    applyEnvironmentProfile,
    snd:Snd, gearOf,
    step(dt,n){ for(let i=0;i<(n||1);i++) frame(dt||1/60,performance.now()); },
    exitWorld, fit,
  }
};
})();
