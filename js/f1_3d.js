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
   · รถผู้เล่น/รถออนไลน์: VR-X1 faceted รุ่นรอบ 1210/1216 สีตรง cockpit; ไม่ใช้ GLB เก่ารอบ 898
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
const RECENT_KEY   = 'f1Recent';
const HALF_W       = 7.5;     // ครึ่งความกว้างแทร็ก (เมตร) — F1 จริง 12-15ม.
const KERB_W       = 1.6;     // ความกว้างขอบ kerb
const RUNOFF_W     = 9;       // runoff ยางมะตอยข้างแทร็ก (สไตล์ Bahrain)
const BARRIER_LAT  = HALF_W+RUNOFF_W+.75; // รอบ 1218: เลย paved runoff ทั้งแถบ ประตูมิติทำงานก่อนถึงแนวชนนี้
const BARRIER_BOUNCE=.48;     // คืนแรงด้านข้าง 48% ให้รู้สึกว่าเด้ง แต่ไม่ปิงปองรุนแรง
/* 🏎️💥 รอบ 1208 — กล่องชนรถ F1 จริง (แกนตาม yaw) + impulse/แรงเสียดทานตอนเบียด */
/* รอบ 1210: footprint ตามชิ้นโมเดลจริง ไม่ใช้กล่องใหญ่ครอบอากาศรอบรถ
   [x,z,halfWidth,halfLength] — ปีก, chassis และยางตรงกับ buildPeerF1Car */
const CAR_HIT_PARTS=[
  [0,3.34,1.00,.25],            // front wing
  [0,2.18,.29,.92],             // nose
  [0,.48,.76,1.14],             // monocoque + sidepods
  [0,-1.24,.52,.64],            // engine/rear body
  [0,-1.98,.76,.28],            // rear wing/diffuser
  [-.96,1.52,.22,.45],[.96,1.52,.22,.45],       // front tyres
  [-.96,-1.47,.22,.45],[.96,-1.47,.22,.45]      // rear tyres
];
const CAR_HIT_RADIUS=3.75;      // broad-phase เท่านั้น — ไม่สร้าง contact
const CAR_RESTITUTION=.34;    // คืนความเร็วตามแนวชน 34% — เด้งแต่ไม่ปิงปอง
const CAR_SIDE_FRICTION=.38;  // กินความเร็วสัมพัทธ์ตามแนวที่รถเบียดกัน
const CAR_RUB_DRAG = 4.2;     // แรงต้านต่อวินาทีขณะสีข้างต่อเนื่อง
const CAR_SEP_EPS  = .025;    // เว้นผิวเล็กน้อยหลังแยก กันเลข floating-point สั่น
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
/* ⏪🏜️ รอบ 911 — เกียร์ถอย + เกิดใหม่เมื่อหลุดสนาม */
const REV_A      = 7;    // ⏪ อัตราเร่งถอยหลัง (m/s²)
const REV_MAX    = 8;    // ความเร็วถอยสูงสุด (m/s ≈ 29 กม./ชม.)
const OFFTRACK_S = 0;    // 🌀 รอบ 1210: พ้นผิวถนน = เปิดประตูมิติทันทีในเฟรมนั้น ไม่หน่วงเวลา
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
/* Realistic cockpit is a separate 1672×941 plate. These three poses were measured
   from the actual center/left/right WebP frames (not guessed from steering angle),
   so the live canvas stays inside the photographed wheel display while it turns. */
const QUALITY_PLATE_W=1672, QUALITY_PLATE_H=941;
const QUALITY_DASH_SCALE=.82; // รอบ 1214: ให้จอสดอยู่ในขอบ LCD จริง ไม่ทับปุ่ม/กรอบพวงมาลัย
const QUALITY_DASH_POSE={
  center:{cx:836.5,cy:767,w:201,h:102,deg:0},
  left:  {cx:798.5,cy:758,w:200,h:100,deg:-23},
  right: {cx:899.5,cy:771.5,w:200,h:101,deg:21.8}
};
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
const SURF_RUNOFF  = {grip:0.78, drag:0.8};   // paved runoff สีเทาอ่อนยังขับกลับได้ แต่ช้า/กริปน้อยกว่าทางหลัก
const SURF_SAND    = {grip:0.28, drag:7.0};   // บนทราย: ลื่น + หน่วงแรง
/* 🪽🏎️ รอบ 1217 — ทางกระโดดอยู่กึ่งกลางทางหลัก; ยังมีช่องราบริมแทร็กให้เลือกหลบได้ */
const JUMP_GRAVITY = 9.81;    // m/s² — แกนดิ่งใช้แรงโน้มถ่วงจริง แยกจากฟิสิกส์ยาง X/Z
const JUMP_LANE_LAT= 0;       // centerline ทางหลัก — ไม่เหยียบ runoff จึงไม่ถูก portal ก่อนถึงเนิน
const JUMP_ENTRY_M = 30;
const JUMP_RISE_M  = 60;
const JUMP_GAP_M   = 25;
const JUMP_LAND_M  = 105;
const JUMP_EXIT_M  = 45;
const JUMP_RECOVER_M=70;      // เผื่อรถเร็วสุดลงเลย landing deck ก่อนตัดสินว่าพลาด
const JUMP_HEIGHT  = 3.8;
const JUMP_LAND_H  = 2.75;
const JUMP_MAX_PITCH=.22;     // ล็อกท่ารถไม่ให้ตีลังกา/คว่ำจากตัวเลขเฟรมกระชาก
const RAMP_ROLL_TRACK=1.68;    // ระยะซ้าย↔ขวาที่ใช้คำนวณความต่างระดับใต้ล้อ
const RAMP_ROLL_MAX=.28;       // 16° — เห็นล้อยกชัด แต่ระบบช่วยไม่ยอมให้รถคว่ำ
const RAMP_ROLL_EDGE=.34;      // ขอบเนินนุ่ม 34 ซม. ไม่กระชากเมื่อยางเพิ่งแตะ
const RAMP_ROLL_RESPONSE=8.5;  // สปริงตัวถังตามเนิน
const RAMP_ROLL_RETURN=6.5;    // คืนรถตั้งตรงเมื่อพ้นขอบ/ลอยกลางอากาศ
const JUMP_PEER_Y_SEP=1.25;   // รถต่างระดับไม่สร้าง compound contact ล่องหน
const JUMP_FRACTIONS=[.16,.47,.76];
const JUMP_COLORS=[0x22e7ff,0xff42d0,0xffd84a];
const NET_SEND_MS  = 160;
const ROOM_MAX     = 10;      // 🚦 คุมคนต่อสนาม (รถเร็ว+ไฟเยอะ — เครื่องเด็กไหว)
const CHAT_MS      = 5000;
const CHAT_PRESETS = ['เร็วจัด! 🔥','แซงสวยมาก! 🏎️','ระวังโค้งหน้านะ','สู้ๆ! 💪','ตามมาเลย!','GG 🏁','555+','เก่งมาก! ⭐'];
/* 🛡️ รอบ 1224: NetRoom แปลง av→a และ Rules กำหนด a เป็น string (avatar wire)
   จึงห่อ body roll เป็น marker สั้นแทนตัวเลข เพื่อไม่ให้ hot position packet ถูกปฏิเสธทั้งก้อน */
const F1_ROLL_WIRE='F1R:';
/* 🎨 รอบ 1216: สีรถชุดเดียวกันทั้ง cockpit, รถเรา และรถที่เพื่อนเห็น
   จำกัดไว้เฉพาะสีที่มี cockpit ครบ 3 เฟรม เพื่อไม่ให้ภาพคนขับกับโมเดลสลับสี */
const CAR_COLOR_KEY='vwF1CarColor';
/* NetRoom ส่งเฉพาะชื่อฟิลด์กลางที่ประกาศไว้: cw จะถูกบีบเป็น q แล้วประกอบคืนครบ
   และผ่าน rules ของ legacy /world ด้วย; ตัวรับยังอ่าน cl เพื่อรองรับ packet ช่วงเปลี่ยนผ่าน */
const F1_COLOR_WIRE='f1c:';
const CAR_STYLES=Object.freeze([
  {key:'red',   label:'แดง เรซซิง', hex:'#e10600', value:0xe10600},
  {key:'blue',  label:'น้ำเงิน อิเล็กทริก',hex:'#0090ff',value:0x0090ff},
  {key:'green', label:'เขียว นีออน',hex:'#52e252',value:0x52e252},
  {key:'yellow',label:'เหลือง โกลด์',hex:'#ffd12e',value:0xffd12e},
  {key:'orange',label:'ส้ม เทอร์โบ',hex:'#ff8700',value:0xff8700},
]);
const COCKPIT_ASSETS=Object.freeze({
  red:{center:'img/f1/cockpit_turn_center.webp',left:'img/f1/cockpit_turn_left.webp',right:'img/f1/cockpit_turn_right.webp'},
  blue:{center:'img/f1/cockpit_turn_center_blue.webp',left:'img/f1/cockpit_turn_left_blue.webp',right:'img/f1/cockpit_turn_right_blue.webp'},
  green:{center:'img/f1/cockpit_turn_center_green.webp',left:'img/f1/cockpit_turn_left_green.webp',right:'img/f1/cockpit_turn_right_green.webp'},
  yellow:{center:'img/f1/cockpit_turn_center_yellow.webp',left:'img/f1/cockpit_turn_left_yellow.webp',right:'img/f1/cockpit_turn_right_yellow.webp'},
  orange:{center:'img/f1/cockpit_turn_center_orange.webp',left:'img/f1/cockpit_turn_left_orange.webp',right:'img/f1/cockpit_turn_right_orange.webp'},
});
const PEER_COLORS=CAR_STYLES.map(s=>s.hex);
const GRID_N       = 20;      // ช่องกริดสตาร์ท
/* 🏁 รอบ 1219 — เว้นรถให้เห็นช่องว่างชัด และกัน client เก่าที่ไม่รายงาน slot */
const GRID_FRONT_M = 18;
const GRID_GAP_M   = 18;
const GRID_SIDE_M  = 3.2;
const GRID_SAFE_M  = 15;
const F1_GRID_WIRE = 'F1G:'; // ใช้ c เฉพาะตอนไม่มีแชท; client เก่าอ่านข้ามได้อย่างปลอดภัย
/* 🚦 ลำดับออกสตาร์ท (รอบ 902) — ไฟแดง 5 ดวงบนซุ้ม ติดทีละดวง แล้วดับพร้อมกัน = ออกตัว */
const LIGHT_LEAD_S = 1.4;     // หน่วงก่อนไฟดวงแรกติด (ให้ตั้งหลัก)
const LIGHT_STEP_S = 1.0;     // เว้นระยะไฟแต่ละดวง
const LIGHT_HOLD_MIN = 0.7;   // ไฟครบ 5 แล้วค้างสุ่ม 0.7-2.6 วิ (เหมือนจริง เดาไม่ได้)
const LIGHT_HOLD_MAX = 2.6;
const JUMP_PENALTY_S = 2.0;   // กดคันเร่ง "ใหม่" ตอนไฟครบ 5 = จั๊มพ์สตาร์ท โดนหน่วง
/* 🎵 เพลงประจำ Vocab World Racing: build จะแทน token ด้วย URL แบบ content hash
   HTMLAudioElement + preload=metadata ทำให้โหลดแบบ stream เมื่อเข้าโลก ไม่ดึง 3.9 MB ตอนเปิดเว็บ */
const RACE_BGM_BUILD_URL='__VW_F1_RACE_BGM_URL__';
const RACE_BGM_URL=RACE_BGM_BUILD_URL.startsWith('__VW_')?'sound/racing/Velocity_Vocabulary.mp3':RACE_BGM_BUILD_URL;
const RACE_BGM_VOLUME=.42;
const RACE_BGM_EXIT_FADE_MS=1100;
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
let racingSkyTex=null,racingSkyLoading=false;
let envLights=null, activeGraphicsMode='battery', activeEnvironmentProfile=null;
let realisticRoot=null, legacyArchitectureRoot=null, realisticTier='off', realisticStats=null;
let wrapEl, screenEl, hudEl, wordEl, coinsEl, banEl, introEl, garageEl, exitBox, boardEl, chatBarEl, selfMsgEl, carProofEl;
let speedEl, gearEl, lapEl, bestEl, mapCv, mapCtx, mapBase=null, wrongEl, drsEl;
let knobEl, padThr=0, padBr=false, steerCtl=0, kL=false, kR=false, kThr=false, kBack=false;
let keydownFn, keyupFn, resizeFn;
/* รถเรา */
let px=0, py=0, pz=0, yaw=0, pitch=0, bodyRoll=0, vx=0, vy=0, vz=0, spd=0, steer=0, slide=0, carGrp=null, wheels=[], steerParts=[];
let playerCarStyle=CAR_STYLES[0];
let airborne=false,activeJump=null,jumpPrevD=-1,jumpImpact=0,jumpLandKickT=0,jumpMissed=false;
let camPos=null, camInit=false, camYaw=0, shakeT=0;
let camMode='cockpit', cockpitEl=null, cockpitTurnEl=null, cockpitTurnSrc='', camBtnEl=null;   // 🪖 รอบ 901 — มุมคนขับเป็นภาพหลัก
let raceBgm=null,raceBgmBtn=null,raceBgmFadeTimer=0,raceBgmFadeToken=0,raceBgmPlayToken=0,raceBgmBlocked=false,raceMusicEnabled=true;
let padRev=false, revNow=false, sandT=0, portalEl=null, portalViewCv=null, portalActive=false, portalT=0, portalJumped=false, portalTargetIdx=0, portalResumeSpeed=0;   // ⏪🏜️ รอบ 911
let wheelEl=null, qualityWheelEl=null, wheelDeg=null, wheelSy=1; // 🎡 ชั้นพวงมาลัยแยก: Battery image + Quality procedural wheel
let ledsEl=null, ledEls=[], ledN=-1, ledRpm=0, ledFlashT=0, ledFlash=false;  // 🚥 รอบ 918 — ชั้นดวงไฟ LED รอบเครื่อง
let dashEl=null, dashCtx=null, dashK=1, dashRpm=0, dashSig='';   // 🔢 รอบ 916 — จอตัวเลขจริงบนพวงมาลัย (K = พิกเซลภาพ→พิกเซล canvas)
let wheelShakeOn=false;                                  // 🫨🎡 รอบ 914 — เฟรมก่อนหน้ามีการสั่นค้างไหม (กันสั่นค้างตอนกลับเข้าแทร็กเรียบ)
/* แทร็ก */
let LINE=null, TOTAL=0, grid=null, sfIdx=0, myIdx=0, myLapDist=0, surfNow='track';
let JUMPS=[],fantasyRoot=null,fantasyStats=null;
/* จับเวลา */
let lapStartAt=0, lapNow=0, lapBest=0, lapCount=0, cpFlags=[false,false,false], lastProg=0;
/* คำศัพท์ */
let word=null, letters=[], sessionCoins=0, sessionWords=0;
/* เพื่อน */
let peers={}, room=null, lastNetSend=0, myChat=null, boardSig='', positionSig='', positionEl=null;
let gridSlot=0,gridRosterSig='';
/* 🚦 ไฟสตาร์ท + 👻 รถเงา (รอบ 902) */
let startLights=[], lightPhase='wait', lightT=0, lightsLit=-1, holdS=1.5, penaltyT=0, jumped=false;
let goAt=0, reactDone=false, thrPrev=false, heldAtGo=false, lightsEl=null, lightDots=[], lightNoteEl=null;
let ghostGrp=null, ghostWheels=[], ghostRec=null, ghostBest=null, ghostAcc=0, ghostGap=0, gapCur=0, gapEl=null;
let ghostLast=null, ghostShown=false;
/* 🚧 เลนพิท — คงผิวทาง/ลิมิตความเร็วไว้ โดยไม่มีระบบยางสึกหรือพิทสต็อป */
let PITL=null, inPit=false, pitLaneNow=false, pitLimited=false, lapPitted=false;
/* เอฟเฟกต์ */
let smokes=[], sparks=[];
/* 🌡️ รอบ 1210: mobile thermal governor — ฟิสิกส์/เน็ตยัง tick ตาม RAF แต่ GPU render ตามความจำเป็น */
let thermalMobile=false,thermalLevel=0,thermalAvgMs=16.7,thermalSlowT=0,thermalCoolT=0;
let thermalBasePR=1,thermalTargetFps=60,thermalRenderAt=0,thermalRendered=0,thermalSkipped=0;

const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
/* ============================================================
   🏁 รอบ 1219 — MULTIPLAYER SAFE-DISTANCE START GRID
   ============================================================ */
function gridPose(slot){
  slot=clamp(slot|0,0,GRID_N-1);
  const q=(GRID_FRONT_M+slot*GRID_GAP_M)/SAMPLE_M,whole=Math.floor(q),t=q-whole;
  const i0=(sfIdx-whole+LINE.n)%LINE.n,i1=(i0-1+LINE.n)%LINE.n;
  let tx=lerp(LINE.tx[i0],LINE.tx[i1],t),tz=lerp(LINE.tz[i0],LINE.tz[i1],t);
  const tl=Math.hypot(tx,tz)||1;tx/=tl;tz/=tl;
  const nx=tz,nz=-tx,side=(slot%2?1:-1)*GRID_SIDE_M;
  return {slot,i:i0,back:GRID_FRONT_M+slot*GRID_GAP_M,side,
    x:lerp(LINE.x[i0],LINE.x[i1],t)+nx*side,
    z:lerp(LINE.z[i0],LINE.z[i1],t)+nz*side,
    yaw:Math.atan2(tx,tz)};
}
function startGridUid(){
  try{const u=typeof onlineKey==='function'&&onlineKey();if(u)return String(u);}catch(e){}
  return 'offline';
}
function startGridUids(){
  return Array.from(new Set([startGridUid()].concat(Object.keys(peers)))).sort();
}
function startGridSlotFor(uid,uids){
  const ordered=(uids||startGridUids()).slice().sort();
  const at=ordered.indexOf(String(uid));
  return clamp(at<0?0:at,0,GRID_N-1);
}
function gridFormationActive(){return lightPhase!=='go';}
function gridSlotClear(slot){
  const pose=gridPose(slot);
  for(const uid in peers){
    const peer=peers[uid];
    if(peer.gridSlot===slot)return false;
    if(peer.gridSlot!==null&&peer.gridSlot!==undefined)continue;
    const at=peer.tgt||peer.cur;
    if(at&&Math.hypot(pose.x-at.x,pose.z-at.z)<GRID_SAFE_M)return false;
  }
  return true;
}
function safeStartGridSlot(desired){
  desired=clamp(desired|0,0,GRID_N-1);
  for(let slot=desired;slot<GRID_N;slot++)if(gridSlotClear(slot))return slot;
  for(let slot=0;slot<desired;slot++)if(gridSlotClear(slot))return slot;
  return desired;
}
function placeAtGridSlot(slot){
  const p=gridPose(slot);gridSlot=p.slot;
  px=p.x;py=0;pz=p.z;yaw=p.yaw;pitch=bodyRoll=0;vx=vy=vz=spd=0;steer=0;slide=0;myIdx=p.i;camInit=false;
  airborne=false;activeJump=null;jumpPrevD=-1;jumpMissed=false;jumpImpact=0;jumpLandKickT=0;
  sandT=0;portalActive=false;portalT=0;portalJumped=false;portalResumeSpeed=0;
  if(portalEl)portalEl.className='';
  if(carGrp){carGrp.position.set(px,0,pz);carGrp.rotation.set(0,yaw,0);}
  return p;
}
function settleStartGrid(force){
  if(!LINE||!gridFormationActive())return false;
  const uids=startGridUids(),sig=uids.join('|');
  const next=safeStartGridSlot(startGridSlotFor(startGridUid(),uids));
  if(!force&&sig===gridRosterSig&&next===gridSlot)return false;
  gridRosterSig=sig;placeAtGridSlot(next);netSend(true);return true;
}
function packetGridSlot(d){
  const wire=d&&typeof d.c==='string'?d.c:'';
  if(!wire.startsWith(F1_GRID_WIRE))return null;
  const n=Number(wire.slice(F1_GRID_WIRE.length));
  return Number.isInteger(n)&&n>=0&&n<GRID_N?n:null;
}
function packetBodyRoll(d){
  const raw=d&&d.av;
  if(typeof raw==='number')return clamp(raw,-RAMP_ROLL_MAX,RAMP_ROLL_MAX); // test/ช่วงเปลี่ยนผ่าน
  if(typeof raw!=='string'||!raw.startsWith(F1_ROLL_WIRE))return 0;
  const n=Number(raw.slice(F1_ROLL_WIRE.length));
  return Number.isFinite(n)?clamp(n,-RAMP_ROLL_MAX,RAMP_ROLL_MAX):0;
}
const lerp=(a,b,t)=>a+(b-a)*t;
const carStyleByKey=key=>CAR_STYLES.find(s=>s.key===key)||CAR_STYLES[0];
function storedCarStyle(){
  try{return carStyleByKey(localStorage.getItem(CAR_COLOR_KEY)||'red');}catch(_){return CAR_STYLES[0];}
}
function saveCarStyle(){try{localStorage.setItem(CAR_COLOR_KEY,playerCarStyle.key);}catch(_){}}
function cockpitAsset(pose,style=playerCarStyle){
  const set=COCKPIT_ASSETS[style.key]||COCKPIT_ASSETS.red;
  return set[pose]||set.center;
}

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
/* ============================================================
   🎵 RACING BACKGROUND MUSIC — lazy stream + browser disk cache + fade on exit
   ============================================================ */
function raceMusicPreferenceOn(){return raceMusicEnabled;}
function raceMusicCanPlay(){
  return raceMusicEnabled&&!(typeof state!=='undefined'&&state.sound===false);
}
function raceMusicUnlocked(){return running&&lightPhase==='go'&&penaltyT<=0;}
function raceMusicSyncButton(){
  if(!raceBgmBtn)return;
  const on=raceMusicPreferenceOn(),masterOff=typeof state!=='undefined'&&state.sound===false;
  raceBgmBtn.setAttribute('aria-pressed',on?'true':'false');
  raceBgmBtn.classList.toggle('blocked',raceBgmBlocked);
  raceBgmBtn.textContent=raceBgmBlocked?'⚠️ แตะเปิดเพลง':(on&&!masterOff?'🎵 เพลง เปิด':'🔇 เพลง ปิด');
  raceBgmBtn.title=masterOff?'เสียงหลักของเกมถูกปิดอยู่':'Velocity Vocabulary — เปิด/ปิดเพลง Racing';
}
function raceMusicEnsure(){
  if(raceBgm)return raceBgm;
  const a=new Audio();
  a.preload='metadata';
  a.loop=true;
  a.volume=RACE_BGM_VOLUME;
  a.src=RACE_BGM_URL;
  a.addEventListener('error',()=>{raceBgmBlocked=true;raceMusicSyncButton();});
  raceBgm=a;
  return a;
}
function raceMusicCancelFade(){
  raceBgmFadeToken++;
  if(raceBgmFadeTimer){clearTimeout(raceBgmFadeTimer);raceBgmFadeTimer=0;}
}
function raceMusicStart(){
  raceMusicCancelFade();
  raceBgmBlocked=false;
  raceMusicSyncButton();
  if(!raceMusicCanPlay()||!raceMusicUnlocked())return Promise.resolve(false);
  const a=raceMusicEnsure(),token=++raceBgmPlayToken;
  a.volume=RACE_BGM_VOLUME;
  const p=a.play();
  if(!p||!p.then)return Promise.resolve(true);
  return p.then(()=>{
    if(token!==raceBgmPlayToken||!running){a.pause();return false;}
    raceBgmBlocked=false;raceMusicSyncButton();return true;
  }).catch(()=>{
    if(token===raceBgmPlayToken){raceBgmBlocked=true;raceMusicSyncButton();}
    return false;
  });
}
function raceMusicStop(fadeMs=0,reset=false,done){
  raceMusicCancelFade();
  raceBgmPlayToken++;
  const a=raceBgm;
  const finish=()=>{
    if(a){a.pause();a.volume=RACE_BGM_VOLUME;if(reset){try{a.currentTime=0;}catch(_){}}}
    raceBgmFadeTimer=0;
    if(done)done();
  };
  if(!a||a.paused||fadeMs<=0){finish();return;}
  const startAt=performance.now(),startVol=a.volume,fadeToken=++raceBgmFadeToken;
  const step=()=>{
    if(fadeToken!==raceBgmFadeToken)return;
    const k=Math.min(1,(performance.now()-startAt)/fadeMs);
    a.volume=Math.max(0,startVol*(1-k));
    if(k>=1)finish();else raceBgmFadeTimer=setTimeout(step,40);
  };
  step();
}
function raceMusicToggle(){
  raceMusicEnabled=!raceMusicEnabled;
  raceBgmBlocked=false;raceMusicSyncButton();
  if(raceMusicEnabled)raceMusicStart();else raceMusicStop(320,false);
}
function raceMusicVisibilityChange(){
  if(document.hidden)raceMusicStop(0,false);
  else if(raceMusicUnlocked())raceMusicStart();
}
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

/* ============================================================
   🌌🪽 รอบ 1217 — FANTASY MAIN-LINE AIR ROUTES (GPU COOL)
   สามเนินอยู่กลางทางหลัก (ริมถนนยังราบให้หลบ): geometry/material ใช้ร่วม, ของซ้ำเป็น instancing,
   beacon ใช้ LOD; ไม่มี texture/PBR/reflection/dynamic light/shadow/particle ใหม่
   ============================================================ */
function jumpDeltaD(i,j){
  return ((LINE.cum[i]-LINE.cum[j.startIdx])%TOTAL+TOTAL)%TOTAL;
}
function jumpHalfAtD(j,d){
  if(d<0||d>j.recoverD) return 0;
  if(d<=j.entryM) return lerp(3.95,3.15,d/j.entryM); // ปากเลนแตะ track แล้วค่อยบีบเข้าเนิน
  if(d<=j.takeoffD) return 3.15;
  if(d<=j.landStartD) return 3.45;
  if(d<=j.landEndD) return 3.80;                     // landing กว้างกว่าทางไต่
  return 3.95;
}
function jumpPhaseAtD(j,d){
  if(d<0||d>j.recoverD) return 'none';
  if(d<=j.entryM) return 'entry';
  if(d<=j.takeoffD) return 'rise';
  if(d<j.landStartD) return 'gap';
  if(d<=j.landEndD) return 'landing';
  if(d<=j.endD) return 'exit';
  return 'recovery';
}
function jumpHeightAtD(j,d){
  const phase=jumpPhaseAtD(j,d);
  if(phase==='entry'||phase==='exit'||phase==='recovery') return 0;
  if(phase==='rise'){
    const t=clamp((d-j.entryM)/j.riseM,0,1);
    return j.height*t*t;                              // derivative ที่ปลาย = มุมปล่อยจริง
  }
  if(phase==='landing'){
    const t=clamp((d-j.landStartD)/j.landM,0,1);
    return j.landH*(1-t)*(1-t);                       // พื้นลงกว้างและค่อย ๆ ราบ
  }
  return null;                                        // gap คืออากาศจริง ไม่ใช่พื้นล่องหน
}
function jumpPitchAtD(j,d){
  const phase=jumpPhaseAtD(j,d);
  if(phase==='rise'){
    const t=clamp((d-j.entryM)/j.riseM,0,1);
    return Math.atan((2*j.height*t)/j.riseM);
  }
  if(phase==='landing'){
    const t=clamp((d-j.landStartD)/j.landM,0,1);
    return Math.atan((-2*j.landH*(1-t))/j.landM);
  }
  return 0;
}
function jumpProbeAtSample(i,lat){
  if(!JUMPS.length) return null;
  for(const j of JUMPS){
    const d=jumpDeltaD(i,j),half=jumpHalfAtD(j,d);
    if(half&&Math.abs(lat-j.lat)<=half+.18){
      return {jump:j,d,half,phase:jumpPhaseAtD(j,d),height:jumpHeightAtD(j,d),pitch:jumpPitchAtD(j,d)};
    }
  }
  return null;
}
function jumpProbe(x,z,hint){
  if(!JUMPS.length) return null;
  const i=nearIdx(x,z,hint),dx=x-LINE.x[i],dz=z-LINE.z[i],lat=dx*LINE.nx[i]+dz*LINE.nz[i];
  const p=jumpProbeAtSample(i,lat);
  if(p){p.i=i;p.lat=lat;}
  return p;
}
/* รถคร่อมขอบเนิน: วัดพื้นใต้ล้อซ้าย/ขวาแยกกัน แล้วจำกัด roll ด้วย anti-roll assist */
function jumpWheelGround(i,lat){
  for(const j of JUMPS){
    const d=jumpDeltaD(i,j),half=jumpHalfAtD(j,d),height=jumpHeightAtD(j,d);
    if(!half||height===null)continue;
    const edge=half-Math.abs(lat-j.lat);
    if(edge<=-RAMP_ROLL_EDGE)continue;
    const t=clamp((edge+RAMP_ROLL_EDGE)/(RAMP_ROLL_EDGE*2),0,1),soft=t*t*(3-2*t);
    return (height||0)*soft;
  }
  return 0;
}
function jumpTerrainRoll(x,z,hint){
  if(!JUMPS.length)return 0;
  const i=nearIdx(x,z,hint),dx=x-LINE.x[i],dz=z-LINE.z[i],lat=dx*LINE.nx[i]+dz*LINE.nz[i],halfTrack=RAMP_ROLL_TRACK*.5;
  const leftH=jumpWheelGround(i,lat-halfTrack),rightH=jumpWheelGround(i,lat+halfTrack);
  return clamp(Math.atan2(rightH-leftH,RAMP_ROLL_TRACK),-RAMP_ROLL_MAX,RAMP_ROLL_MAX);
}
function chooseJumpStart(frac){
  const desired=(sfIdx+Math.round(frac*LINE.n))%LINE.n;
  const span=Math.ceil((JUMP_ENTRY_M+JUMP_RISE_M+JUMP_GAP_M+JUMP_LAND_M+JUMP_EXIT_M)/SAMPLE_M);
  let best=desired,bestScore=Infinity,bestMax=Infinity;
  for(let o=-72;o<=72;o++){
    const st=(desired+o+LINE.n)%LINE.n;
    let sum=0,maxC=0,pitPenalty=0;
    for(let k=0;k<=span;k+=2){
      const i=(st+k)%LINE.n,c=Math.abs(LINE.curv[i]);sum+=c;maxC=Math.max(maxC,c);
      if(PITL&&k%8===0){
        const x=LINE.x[i],z=LINE.z[i];
        const pa=pitAt(x,z);if(pa&&pa.d<PIT_HALF_W+4) pitPenalty+=4;
      }
    }
    const sfD=Math.min(((st-sfIdx+LINE.n)%LINE.n)*SAMPLE_M,((sfIdx-st+LINE.n)%LINE.n)*SAMPLE_M);
    const score=maxC*1800+sum*45+Math.abs(o)*.0004+pitPenalty+(sfD<360?20:0);
    if(score<bestScore){bestScore=score;best=st;bestMax=maxC;}
  }
  return {i:best,maxCurvature:bestMax};
}
function prepareFantasyJumps(){
  if(JUMPS.length) return JUMPS;
  JUMPS=JUMP_FRACTIONS.map((frac,n)=>{
    const pick=chooseJumpStart(frac),takeoffD=JUMP_ENTRY_M+JUMP_RISE_M;
    const landStartD=takeoffD+JUMP_GAP_M,landEndD=landStartD+JUMP_LAND_M;
    return {id:n+1,label:['AURORA','NEBULA','SOLAR'][n],color:JUMP_COLORS[n],side:0,
      lat:JUMP_LANE_LAT,startIdx:pick.i,maxCurvature:pick.maxCurvature,
      entryM:JUMP_ENTRY_M,riseM:JUMP_RISE_M,gapM:JUMP_GAP_M,landM:JUMP_LAND_M,
      exitM:JUMP_EXIT_M,recoverM:JUMP_RECOVER_M,height:JUMP_HEIGHT,landH:JUMP_LAND_H,
      takeoffD,landStartD,landEndD,endD:landEndD+JUMP_EXIT_M,recoverD:landEndD+JUMP_EXIT_M+JUMP_RECOVER_M,
      launchPitch:Math.atan(2*JUMP_HEIGHT/JUMP_RISE_M)};
  });
  return JUMPS;
}
function jumpPose(j,d,lat,y){
  const i=(j.startIdx+Math.round(d/SAMPLE_M))%LINE.n;
  return {i,x:LINE.x[i]+LINE.nx[i]*lat,z:LINE.z[i]+LINE.nz[i]*lat,y:y||0,
    yaw:Math.atan2(LINE.tx[i],LINE.tz[i])};
}
function fantasyRampGeometry(){
  const pos=[],idx=[];
  const vert=(x,y,z)=>{pos.push(x,y,z);return pos.length/3-1;};
  const quad=(a,b,c,d)=>idx.push(a,b,c,b,d,c);
  function strip(j,d0,d1){
    for(let d=d0;d<d1-.01;d+=SAMPLE_M){
      const e=Math.min(d1,d+SAMPLE_M),h0=jumpHeightAtD(j,d)||0,h1=jumpHeightAtD(j,e)||0;
      const w0=jumpHalfAtD(j,d)-.12,w1=jumpHalfAtD(j,e)-.12;
      const a=jumpPose(j,d,j.lat-w0,h0+.07),b=jumpPose(j,d,j.lat+w0,h0+.07);
      const c=jumpPose(j,e,j.lat-w1,h1+.07),q=jumpPose(j,e,j.lat+w1,h1+.07);
      const ia=vert(a.x,a.y,a.z),ib=vert(b.x,b.y,b.z),ic=vert(c.x,c.y,c.z),iq=vert(q.x,q.y,q.z);
      quad(ia,ib,ic,iq);
      if(h0>.05||h1>.05){
        const al=vert(a.x,.03,a.z),cl=vert(c.x,.03,c.z),br=vert(b.x,.03,b.z),qr=vert(q.x,.03,q.z);
        quad(al,ia,cl,ic);quad(ib,br,iq,qr);
      }
    }
  }
  for(const j of JUMPS){strip(j,0,j.takeoffD);strip(j,j.landStartD,j.endD);}
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  return g;
}
function buildFantasyCircuit(){
  prepareFantasyJumps();
  const root=new THREE.Group();root.name='F1_FANTASY_MAIN_AIR_ROUTES';
  const rampMat=new THREE.MeshLambertMaterial({color:0x263755,emissive:0x07152a,emissiveIntensity:.62,side:THREE.DoubleSide});
  const ramp=new THREE.Mesh(fantasyRampGeometry(),rampMat);ramp.name='F1_FANTASY_SHARED_RAMP_SURFACE';root.add(ramp);
  const edgeGeo=new THREE.BoxGeometry(.18,.11,1),edgeMat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const edgeSpecs=[];
  for(const j of JUMPS) for(const range of [[0,j.takeoffD],[j.landStartD,j.endD]]){
    for(let d=range[0];d<range[1]-.01;d+=SAMPLE_M) for(const side of [-1,1]) edgeSpecs.push({j,d,side});
  }
  const edges=new THREE.InstancedMesh(edgeGeo,edgeMat,edgeSpecs.length),dummy=new THREE.Object3D();dummy.rotation.order='YXZ';
  edgeSpecs.forEach((s,n)=>{
    const e=Math.min(s.j.endD,s.d+SAMPLE_M),mid=(s.d+e)*.5,h=jumpHeightAtD(s.j,mid)||0;
    const p=jumpPose(s.j,mid,s.j.lat+s.side*(jumpHalfAtD(s.j,mid)-.22),h+.15);
    dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(-jumpPitchAtD(s.j,mid),p.yaw,0);
    dummy.scale.set(1,1,Math.max(1,e-s.d+.35));dummy.updateMatrix();edges.setMatrixAt(n,dummy.matrix);
    if(edges.setColorAt) edges.setColorAt(n,new THREE.Color(s.j.color));
  });
  edges.instanceMatrix.needsUpdate=true;if(edges.instanceColor)edges.instanceColor.needsUpdate=true;
  edges.name='F1_FANTASY_INSTANCED_EMISSIVE_EDGES';root.add(edges);
  const pierGeo=new THREE.BoxGeometry(1,1,1),pierMat=new THREE.MeshLambertMaterial({color:0x17223b,emissive:0x030711});
  const pierSpecs=[];
  for(const j of JUMPS) for(const d of [j.entryM+j.riseM*.42,j.entryM+j.riseM*.76,j.landStartD+j.landM*.20,j.landStartD+j.landM*.52])
    for(const side of [-1,1]) pierSpecs.push({j,d,side});
  const piers=new THREE.InstancedMesh(pierGeo,pierMat,pierSpecs.length);
  pierSpecs.forEach((s,n)=>{
    const h=jumpHeightAtD(s.j,s.d)||0,p=jumpPose(s.j,s.d,s.j.lat+s.side*(jumpHalfAtD(s.j,s.d)-.5),h*.5);
    dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.yaw,0);dummy.scale.set(.34,Math.max(.08,h),.34);dummy.updateMatrix();piers.setMatrixAt(n,dummy.matrix);
  });
  piers.instanceMatrix.needsUpdate=true;piers.name='F1_FANTASY_INSTANCED_SUPPORTS';root.add(piers);
  const finGeo=new THREE.OctahedronGeometry(.48,0),finMat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const finSpecs=[];
  for(const j of JUMPS) for(const d of [6,18,j.entryM+18,j.entryM+40,j.landStartD+12,j.landStartD+42,j.landEndD+12])
    finSpecs.push({j,d,side:(Math.round(d/SAMPLE_M)&1)?-1:1});
  const fins=new THREE.InstancedMesh(finGeo,finMat,finSpecs.length);
  finSpecs.forEach((s,n)=>{
    const h=jumpHeightAtD(s.j,s.d)||0,p=jumpPose(s.j,s.d,s.j.lat+s.side*(jumpHalfAtD(s.j,s.d)-.38),h+1.0);
    dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.yaw+s.d*.09,0);dummy.scale.set(.7,1.6,.7);dummy.updateMatrix();fins.setMatrixAt(n,dummy.matrix);
    if(fins.setColorAt)fins.setColorAt(n,new THREE.Color(s.j.color));
  });
  fins.instanceMatrix.needsUpdate=true;if(fins.instanceColor)fins.instanceColor.needsUpdate=true;
  fins.name='F1_FANTASY_INSTANCED_LOW_POLY_FINS';root.add(fins);
  const gateGeo=new THREE.TorusGeometry(4.35,.20,4,12),farGeo=new THREE.OctahedronGeometry(1.35,0);
  for(const j of JUMPS){
    const mat=new THREE.MeshBasicMaterial({color:j.color,toneMapped:false}),lod=new THREE.LOD();
    const near=new THREE.Mesh(gateGeo,mat),far=new THREE.Mesh(farGeo,mat);
    near.name='F1_FANTASY_GATE_NEAR';far.name='F1_FANTASY_GATE_FAR';lod.addLevel(near,0);lod.addLevel(far,220);
    const p=jumpPose(j,j.takeoffD,j.lat,j.height+4.25);lod.position.set(p.x,p.y,p.z);lod.rotation.y=p.yaw;
    lod.userData={jumpId:j.id,lodDistances:[0,220]};root.add(lod);
  }
  root.userData.stats={jumps:JUMPS.length,optionalLane:true,mainRacingLineRaised:true,flatBypassEdges:true,sharedRampGeometry:1,
    instancedGroups:3,lodBeacons:JUMPS.length,textures:0,pbr:0,reflections:0,dynamicLights:0,dynamicShadows:0,particles:0,
    rampTriangles:ramp.geometry.index.count/3,edgeInstances:edgeSpecs.length,supportInstances:pierSpecs.length,finInstances:finSpecs.length};
  fantasyStats=root.userData.stats;
  return root;
}
/* ผิวใต้ล้อ: track / kerb / pit / runoff / sand + ระยะเบี่ยงข้าง */
function surfAt(x,z,hint){
  const i=nearIdx(x,z,hint);
  const dx=x-LINE.x[i],dz=z-LINE.z[i];
  const lat=dx*LINE.nx[i]+dz*LINE.nz[i];
  const a=Math.abs(lat);
  const jump=jumpProbeAtSample(i,lat);
  let s='sand';
  if(a<=HALF_W) s='track';
  else if(jump) s='jump';
  else if(a<=HALF_W+KERB_W&&Math.abs(LINE.curv[i])>0.004) s='kerb';
  else if(inPitLane(x,z,lat)) s='pit';                 // 🛞 รอบ 905 — เลนพิทมีผิวของตัวเอง
  else if(a<=HALF_W+RUNOFF_W) s='runoff';
  return {i,lat,surf:s,jump};
}

/* ============================================================
   🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
   ============================================================ */
function ribbonGeo(halfW,off,yTop,uScale,everyCurv,vScale){
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
    uv.push(u,0,u,vScale?(halfW*2/vScale):1);
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
  if(isThermalMobile()) return 'low';
  if(mem<=3||cores<=4) return 'low';
  if(mem<8||cores<=6) return 'medium';
  return 'high';
}
function isThermalMobile(){
  const coarse=typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches;
  return coarse||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'');
}
function useRacingSky(){
  if(racingSkyTex){scene.background=racingSkyTex;return;}
  if(racingSkyLoading)return;
  racingSkyLoading=true;
  new THREE.TextureLoader().load('img/f1/sky_racing_1024.webp',t=>{
    t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
    t.minFilter=t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;
    if('colorSpace'in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;
    t.needsUpdate=true;racingSkyTex=t;racingSkyLoading=false;
    if(activeGraphicsMode==='quality'&&scene)scene.background=t;
  },undefined,()=>{racingSkyLoading=false;});
}
function seededRand(seed){
  let s=seed>>>0;
  return ()=>{ s=(Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; };
}
function realisticAsphaltMaps(){
  const rnd=seededRand(1125);
  const map=texFromCanvas((g,w,h)=>{
    /* เม็ดหินหลายระดับ + คราบยางจาง ๆ ช่วยให้พื้นไม่เป็นแผ่นเทาเรียบจากมุมคนขับ
       ทุกอย่างยังอยู่ใน texture 256² เดิม จึงไม่เพิ่ม draw call/ไฟล์ภาพ/RAM มือถือ */
    g.fillStyle='#292d32'; g.fillRect(0,0,w,h);
    for(let i=0;i<5200;i++){
      const v=24+(rnd()*74|0), a=.20+rnd()*.42, sz=rnd()>.88?2:1;
      g.fillStyle='rgba('+v+','+(v+1)+','+(v+4)+','+a.toFixed(2)+')';
      g.fillRect(rnd()*w,rnd()*h,sz,sz);
    }
    for(let i=0;i<58;i++){
      const x=rnd()*w,y=rnd()*h,r=2+rnd()*7;
      g.fillStyle=rnd()>.5?'rgba(139,144,150,.075)':'rgba(3,5,8,.11)';
      g.beginPath();g.ellipse(x,y,r,r*(.45+rnd()*.55),rnd()*Math.PI,0,Math.PI*2);g.fill();
    }
    /* รอยซ่อม/รอยต่ออยู่ใน tile เดียว จึงไม่เพิ่ม geometry หรือ draw call */
    g.fillStyle='rgba(11,13,16,.18)';g.fillRect(0,h*.73,w,2);
    g.fillStyle='rgba(126,132,138,.08)';g.fillRect(0,h*.73+2,w,1);
    for(let i=0;i<15;i++){
      const x=rnd()*w,y=rnd()*h;
      g.strokeStyle='rgba(4,5,7,'+(.10+rnd()*.10).toFixed(2)+')';g.lineWidth=.65+rnd()*.7;
      g.beginPath();g.moveTo(x,y);
      g.bezierCurveTo(x+8+rnd()*10,y+(rnd()-.5)*5,x+18+rnd()*20,y+(rnd()-.5)*7,x+28+rnd()*48,y+(rnd()-.5)*5);
      g.stroke();
    }
  },256,256,1,1);
  const normalMap=texFromCanvas((g,w,h)=>{
    g.fillStyle='rgb(128,128,255)';g.fillRect(0,0,w,h);
    for(let i=0;i<2400;i++){
      const nx=111+(rnd()*35|0),ny=111+(rnd()*35|0),b=236+(rnd()*19|0);
      g.fillStyle='rgb('+nx+','+ny+','+b+')';g.fillRect(rnd()*w,rnd()*h,rnd()>.88?2:1,rnd()>.88?2:1);
    }
  },128,128,1,1);
  const roughnessMap=texFromCanvas((g,w,h)=>{
    g.fillStyle='rgb(211,211,211)';g.fillRect(0,0,w,h);
    for(let i=0;i<1700;i++){
      const v=160+(rnd()*88|0);g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(rnd()*w,rnd()*h,1,1);
    }
    g.fillStyle='rgb(196,196,196)';g.fillRect(0,h*.73,w,2);
  },128,128,1,1);
  const maxAniso=renderer&&renderer.capabilities?renderer.capabilities.getMaxAnisotropy():1;
  map.anisotropy=Math.min(isThermalMobile()?2:4,maxAniso);
  normalMap.anisotropy=roughnessMap.anisotropy=Math.min(2,maxAniso);
  return {map,normalMap,roughnessMap};
}
function realisticRunoffTex(){
  const rnd=seededRand(4821);
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#51565e';g.fillRect(0,0,w,h);
    for(let i=0;i<2600;i++){
      const v=55+(rnd()*38|0);g.fillStyle='rgba('+v+','+(v+2)+','+(v+5)+','+(.16+rnd()*.22).toFixed(2)+')';
      g.fillRect(rnd()*w,rnd()*h,rnd()>.9?2:1,1);
    }
    for(let i=0;i<16;i++){
      const x=rnd()*w,y=rnd()*h;g.strokeStyle='rgba(25,28,33,.18)';g.lineWidth=.7+rnd();
      g.beginPath();g.moveTo(x,y);g.lineTo(x+8+rnd()*30,y+(rnd()-.5)*9);g.stroke();
    }
    g.fillStyle='rgba(25,28,33,.24)';g.fillRect(0,h*.48,w,2);
    g.fillStyle='rgba(175,180,184,.08)';g.fillRect(0,h*.48+2,w,1);
  },256,256,1,1);
}
function realisticSandTex(){
  const rnd=seededRand(9017);
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#bda875';g.fillRect(0,0,w,h);
    for(let i=0;i<22;i++){
      const x=rnd()*w,y=rnd()*h,rx=12+rnd()*34,ry=5+rnd()*14;
      g.fillStyle=rnd()>.5?'rgba(235,215,164,.075)':'rgba(93,77,47,.065)';
      g.beginPath();g.ellipse(x,y,rx,ry,rnd()*Math.PI,0,Math.PI*2);g.fill();
    }
    for(let i=0;i<2100;i++){
      g.fillStyle=rnd()>.5?'rgba(226,204,146,.24)':'rgba(116,98,62,.20)';
      g.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1);
    }
    for(let i=0;i<7;i++){
      const y=rnd()*h;g.strokeStyle='rgba(101,85,55,.10)';g.beginPath();g.moveTo(0,y);g.bezierCurveTo(w*.3,y+5,w*.7,y-5,w,y+2);g.stroke();
    }
  },256,256,120,120);
}
function racingLineRibbonGeo(halfW,yTop,uScale){
  const pos=[],uv=[],idx=[];
  for(let i=0;i<=LINE.n;i++){
    const j=i%LINE.n,off=racingLineLat(j),cx=LINE.x[j]+LINE.nx[j]*off,cz=LINE.z[j]+LINE.nz[j]*off;
    pos.push(cx-LINE.nx[j]*halfW,yTop,cz-LINE.nz[j]*halfW,cx+LINE.nx[j]*halfW,yTop,cz+LINE.nz[j]*halfW);
    const u=LINE.cum[j]/uScale;uv.push(u,0,u,1);
  }
  for(let i=0;i<LINE.n;i++)idx.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
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
    ?{barStep:3,fenceStep:6,boards:48,stands:7,city:84,pit:14}
    :tier==='medium'
      ?{barStep:4,fenceStep:8,boards:32,stands:5,city:54,pit:10}
      :{barStep:6,fenceStep:24,boards:12,stands:1,city:12,pit:5};
  const stats={tier,instances:0,meshGroups:0,barriers:0,fencePosts:0,fenceSegments:0,culledRoadFence:0,lightPoles:0,boards:0,
    grandstands:cfg.stands,city:0,culledRoadCity:0,pitBays:PITL?cfg.pit:0,bridges:tier==='low'?1:3,marshalPosts:8};

  /* ผิวคุณภาพสูง: square tiled UV จริง + map เล็ก 256² / normal+roughness 128² ที่แชร์ทั้งสนาม */
  const asphalt=realisticAsphaltMaps();
  const roadMat=new THREE.MeshStandardMaterial({map:asphalt.map,normalMap:asphalt.normalMap,roughnessMap:asphalt.roughnessMap,
    color:0xb8bcc1,roughness:.87,metalness:.012,normalScale:new THREE.Vector2(.22,.22)});
  root.add(new THREE.Mesh(ribbonGeo(HALF_W,0,.052,4,null,4),roadMat));stats.meshGroups++;
  root.add(new THREE.Mesh(ribbonGeo(HALF_W+RUNOFF_W,0,.012,5,null,5),
    new THREE.MeshLambertMaterial({map:realisticRunoffTex(),color:0xaeb2b7})));stats.meshGroups++;
  const qualitySand=new THREE.Mesh(new THREE.PlaneGeometry(4200,4200),new THREE.MeshLambertMaterial({map:realisticSandTex(),color:0xc4b184}));
  qualitySand.rotation.x=-Math.PI/2;qualitySand.position.y=-.24;root.add(qualitySand);stats.meshGroups++;
  /* racing groove follows the computed racing line instead of sitting as one straight center strip */
  const grooveMat=new THREE.MeshBasicMaterial({color:0x050609,transparent:true,opacity:.24,depthWrite:false});
  root.add(new THREE.Mesh(racingLineRibbonGeo(1.7,.058,12),grooveMat));stats.meshGroups++;
  /* รอยต่อ asphalt ตามระยะจริง: geometry เส้นชุดเดียว/หนึ่ง draw call ไม่มี polygon mesh เพิ่มเป็นร้อยชิ้น */
  const surfaceSeams=[];
  for(let i=10;i<LINE.n;i+=8){
    surfaceSeams.push(LINE.x[i]-LINE.nx[i]*(HALF_W-.35),.060,LINE.z[i]-LINE.nz[i]*(HALF_W-.35),
      LINE.x[i]+LINE.nx[i]*(HALF_W-.35),.060,LINE.z[i]+LINE.nz[i]*(HALF_W-.35));
  }
  const surfaceSeamGeo=new THREE.BufferGeometry();surfaceSeamGeo.setAttribute('position',new THREE.Float32BufferAttribute(surfaceSeams,3));
  root.add(new THREE.LineSegments(surfaceSeamGeo,new THREE.LineBasicMaterial({color:0x171a1e,transparent:true,opacity:.24})));stats.meshGroups++;
  stats.surface={drawCalls:6,colorMap:256,normalMap:128,roughnessMap:128,tileMeters:4,dynamicShadows:0};

  /* กำแพงแข่งแบบโมดูลสองชนิด + shadow gap เห็นแนวต่อชัด */
  const barrierOff=HALF_W+RUNOFF_W+.75, barrierSpots=[[],[]],allBarrierSpots=[];
  const barrierChord=s=>{
    const j=(s.i+s.step)%LINE.n;
    const ax=LINE.x[s.i]+LINE.nx[s.i]*s.side*barrierOff,az=LINE.z[s.i]+LINE.nz[s.i]*s.side*barrierOff;
    const bx=LINE.x[j]+LINE.nx[j]*s.side*barrierOff,bz=LINE.z[j]+LINE.nz[j]*s.side*barrierOff;
    return {ax,az,bx,bz};
  };
  const barrierSpotClear=s=>{
    const {ax,az,bx,bz}=barrierChord(s),dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz)||1,nx=dz/len,nz=-dx/len;
    for(const k of [0,.25,.5,.75,1]) for(const side of [-.38,.38]){
      const x=ax+dx*k+nx*side,z=az+dz*k+nz*side;
      if(Math.abs(surfAt(x,z).lat)<=HALF_W+KERB_W+.25) return false;
    }
    return true;
  };
  /* รอบ 1210: ช่วงโค้งใช้กำแพงสั้น 5 ม. และหันตาม chord จริง
     กันกล่องยาวที่อิง tangent เพียงจุดเดียวเหวี่ยงปลายเข้ามาบนผิวสนาม */
  for(let side=-1;side<=1;side+=2) for(let i=0,n=0;i<LINE.n;n++){
    const step=Math.min(Math.abs(LINE.curv[i])>.0045?1:cfg.barStep,LINE.n-i),s={i,side,step};
    if(barrierSpotClear(s)){barrierSpots[(n+(side>0?1:0))&1].push(s);allBarrierSpots.push(s);}i+=step;
  }
  const barrierGeo=new THREE.BoxGeometry(.72,1.18,1);
  const barrierPose=(d,s,y=.57)=>{
    const {ax,az,bx,bz}=barrierChord(s);
    d.position.set((ax+bx)*.5,y,(az+bz)*.5);d.rotation.set(0,Math.atan2(bx-ax,bz-az),0);
    d.scale.set(1,1,Math.hypot(bx-ax,bz-az)+.18);
  };
  const barrierMats=[
    new THREE.MeshLambertMaterial({color:0xc8ccd1}),
    new THREE.MeshLambertMaterial({color:0x244d76})
  ];
  barrierSpots.forEach((spots,k)=>{
    const mesh=instancedFromSpots(barrierGeo,barrierMats[k],spots,(d,s)=>barrierPose(d,s));
    mesh.name='F1_REALISTIC_BARRIERS';root.add(mesh);
    stats.instances+=spots.length; stats.barriers+=spots.length; stats.meshGroups++;
  });
  const seamSpots=allBarrierSpots;
  const seamGeo=new THREE.BoxGeometry(.78,1.2,.09);
  root.add(instancedFromSpots(seamGeo,new THREE.MeshBasicMaterial({color:0x17202a}),seamSpots,
    (d,s)=>linePose(d,LINE,s.i,s.side*(barrierOff-.01),.58)));
  stats.instances+=seamSpots.length; stats.meshGroups++;

  /* catch fencing: เสา instanced + ลวดทั้งสนามรวมเป็น LineSegments draw call เดียว
     รอบ 1216: ใช้ chord สั้นตามความโค้ง + ตรวจ clearance ทุกช่วง ห้ามสายยาวตัดผ่านผิวถนน */
  const fenceOff=barrierOff+.05,fenceSpots=[],postSpots=[];
  const fenceChord=s=>{
    const j=(s.i+s.step)%LINE.n;
    const ax=LINE.x[s.i]+LINE.nx[s.i]*s.side*fenceOff,az=LINE.z[s.i]+LINE.nz[s.i]*s.side*fenceOff;
    const bx=LINE.x[j]+LINE.nx[j]*s.side*fenceOff,bz=LINE.z[j]+LINE.nz[j]*s.side*fenceOff;
    return {ax,az,bx,bz,j};
  };
  const fenceSpotClear=s=>{
    const {ax,az,bx,bz}=fenceChord(s),dx=bx-ax,dz=bz-az;
    for(const k of [0,.2,.4,.6,.8,1]){
      const x=ax+dx*k,z=az+dz*k;
      if(Math.abs(surfAt(x,z).lat)<=HALF_W+KERB_W+.35) return false;
    }
    return true;
  };
  for(let side=-1;side<=1;side+=2) for(let i=0;i<LINE.n;){
    const step=Math.min(Math.abs(LINE.curv[i])>.0032?1:cfg.fenceStep,LINE.n-i),s={i,side,step};
    if(fenceSpotClear(s)){fenceSpots.push(s);postSpots.push({i,side});}else stats.culledRoadFence++;
    i+=step;
  }
  root.add(instancedFromSpots(new THREE.CylinderGeometry(.07,.09,3.5,5),
    new THREE.MeshLambertMaterial({color:0x788695}),postSpots,(d,s)=>linePose(d,LINE,s.i,s.side*fenceOff,2.35)));
  stats.instances+=postSpots.length; stats.fencePosts=postSpots.length; stats.meshGroups++;
  const wire=[];
  for(const s of fenceSpots){
      const {ax,az,bx,bz,j}=fenceChord(s),i=s.i,side=s.side;
      for(const y of [1.45,2.1,2.75,3.35]) wire.push(ax,y,az,bx,y,bz);
      const atopX=ax+LINE.nx[i]*side*.55, atopZ=az+LINE.nz[i]*side*.55;
      const btopX=bx+LINE.nx[j]*side*.55, btopZ=bz+LINE.nz[j]*side*.55;
      wire.push(ax,3.35,az,atopX,3.95,atopZ,bx,3.35,bz,btopX,3.95,btopZ,atopX,3.95,atopZ,btopX,3.95,btopZ);
  }
  const fenceGeo=new THREE.BufferGeometry(); fenceGeo.setAttribute('position',new THREE.Float32BufferAttribute(wire,3));
  const fenceLines=new THREE.LineSegments(fenceGeo,new THREE.LineBasicMaterial({color:0xa9b7c5,transparent:true,opacity:.48}));
  fenceLines.name='F1_REALISTIC_CATCH_FENCE_SAFE_CHORDS';root.add(fenceLines);
  stats.fenceSegments=fenceSpots.length;
  stats.meshGroups++;

  /* รอบ 1210: ตัดเสา+หัวไฟตกแต่งทั้งสนาม — ambient/key light ทำให้ถนนอ่านได้อยู่แล้ว
     ประหยัด 2 draw calls และ instance หลายร้อยชิ้นทุกเฟรม; ไฟสตาร์ท/ป้าย gameplay ยังอยู่ */

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
    const pitSide=pitAt(LINE.x[sfIdx],LINE.z[sfIdx],0);
    const laneSide=pitSide&&pitSide.lat>0?1:-1;
    const pitBayLen=Math.max(7.5,PITL.len/cfg.pit*.88);
    /* เลือกด้านของพิทที่ไกลจากถนนหลักเป็นราย bay — ใช้ sign เดียวทั้งพิทไม่ได้ตรงจุดโค้ง/รวมเลน */
    const pitSpots=[],pitBayOff=PIT_HALF_W+12.5;
    const pitBayClearance=(s,lat)=>{
      const i=Math.min(s.i,PITL.n-1),cx=PITL.x[i]+PITL.nx[i]*lat,cz=PITL.z[i]+PITL.nz[i]*lat;let clear=Infinity;
      for(const u of [-5,0,5]) for(const v of [-pitBayLen*.5,0,pitBayLen*.5]){
        const x=cx+PITL.nx[i]*u+PITL.tx[i]*v,z=cz+PITL.nz[i]*u+PITL.tz[i]*v;
        clear=Math.min(clear,Math.abs(surfAt(x,z).lat));
      }
      return clear;
    };
    for(let n=0;n<cfg.pit;n++){
      const s={i:Math.round((n+.5)*PITL.n/cfg.pit),n},a=pitBayOff,b=-pitBayOff,ca=pitBayClearance(s,a),cb=pitBayClearance(s,b);
      s.lat=ca>=cb?a:b;if(Math.max(ca,cb)>HALF_W+KERB_W+.25)pitSpots.push(s);
    }
    const pitGarages=instancedFromSpots(new THREE.BoxGeometry(10,4.8,pitBayLen),new THREE.MeshLambertMaterial({color:0x6f7883}),pitSpots,
      (d,s)=>linePose(d,PITL,Math.min(s.i,PITL.n-1),s.lat,2.4));
    pitGarages.name='F1_REALISTIC_PIT_GARAGES';root.add(pitGarages);
    const pitRoofLights=instancedFromSpots(new THREE.BoxGeometry(10,.28,pitBayLen+.1),new THREE.MeshBasicMaterial({color:0xeef6ff,toneMapped:false}),pitSpots,
      (d,s)=>linePose(d,PITL,Math.min(s.i,PITL.n-1),s.lat-Math.sign(s.lat)*.05,5.05));
    pitRoofLights.name='F1_REALISTIC_PIT_ROOF_LIGHTS';root.add(pitRoofLights);
    const pitWall=[],pitLat=-laneSide*(PIT_HALF_W-.4);
    const pitWallChord=s=>{
      const j=s.i+s.step;
      return {ax:PITL.x[s.i]+PITL.nx[s.i]*pitLat,az:PITL.z[s.i]+PITL.nz[s.i]*pitLat,
        bx:PITL.x[j]+PITL.nx[j]*pitLat,bz:PITL.z[j]+PITL.nz[j]*pitLat};
    };
    const pitWallSpotClear=s=>{
      const {ax,az,bx,bz}=pitWallChord(s),dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz)||1,nx=dz/len,nz=-dx/len;
      for(const k of [0,.25,.5,.75,1]) for(const side of [-.27,.27]){
        const x=ax+dx*k+nx*side,z=az+dz*k+nz*side;
        if(Math.abs(surfAt(x,z).lat)<=HALF_W+KERB_W+.25) return false;
      }
      return true;
    };
    for(let i=0;i<PITL.n-1;){const step=Math.min(Math.abs(PITL.curv?.[i]||0)>.0045?1:3,PITL.n-1-i),s={i,step};
      if(pitWallSpotClear(s))pitWall.push(s);i+=step;}
    const pitWallMesh=instancedFromSpots(new THREE.BoxGeometry(.5,1.05,1),new THREE.MeshLambertMaterial({color:0xd8dce1}),pitWall,
      (d,s)=>{
        const {ax,az,bx,bz}=pitWallChord(s);
        d.position.set((ax+bx)*.5,.52,(az+bz)*.5);d.rotation.set(0,Math.atan2(bx-ax,bz-az),0);
        d.scale.set(1,1,Math.hypot(bx-ax,bz-az)+.12);
      });
    pitWallMesh.name='F1_REALISTIC_PIT_WALL';root.add(pitWallMesh);
    stats.pitBays=pitSpots.length;stats.instances+=pitSpots.length*2+pitWall.length; stats.meshGroups+=3;
    for(const [idx,label] of [[2,'PIT →'],[PITL.n-3,'PIT EXIT']]){
      const i=Math.max(0,Math.min(PITL.n-1,idx)), sp=makeTextSprite(label,'rgba(8,22,38,.96)','#8fffd4','',null);
      sp.scale.set(11,2.8,1); sp.position.set(PITL.x[i],5.8,PITL.z[i]); root.add(sp);
    }
  }

  /* กริดสตาร์ท/ยางเบรกสะสม/สกิดมาร์ก — geometry รวม ลด draw call */
  const gridSpots=[];
  for(let n=0;n<GRID_N;n++) gridSpots.push(gridPose(n));
  root.add(instancedFromSpots(new THREE.BoxGeometry(4.4,.025,.16),new THREE.MeshBasicMaterial({color:0xf2f4f7}),gridSpots,
    (d,s)=>{d.position.set(s.x,.074,s.z);d.rotation.set(0,s.yaw,0);d.scale.set(1,1,1);}));
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
  prepareFantasyJumps();
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
  /* รอบ 1210: ลบเสาไฟ legacy ทั้งชุด (~20 กลุ่ม / ~60 draw calls: pole+head+additive glow)
     ฉากยังอ่านทางด้วย hemisphere+key light; ไม่คุ้มเผา GPU เพื่อวัตถุตกแต่งซ้ำกับระบบ Realistic */
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
  fantasyRoot=buildFantasyCircuit();
  scene.add(fantasyRoot);
  legacyArchitectureRoot=buildBuildings();
  legacyArchitectureRoot.name='F1_LEGACY_OSM_ARCHITECTURE';
  scene.add(legacyArchitectureRoot);
}

/* ============================================================
   🏎️ รถประกอบ procedural สำหรับ Best-Lap ghost/fallback (รถผู้เล่นจริงใช้ VR-X1 ด้านล่าง)
   ============================================================ */
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
let playerContactShadowGeo=null,playerContactShadowMat=null;
function addPlayerContactShadow(g){
  if(!g||g.getObjectByName('F1_PLAYER_CONTACT_SHADOW'))return;
  playerContactShadowGeo=playerContactShadowGeo||new THREE.CircleGeometry(1.52,12);
  playerContactShadowMat=playerContactShadowMat||new THREE.MeshBasicMaterial({color:0x050608,transparent:true,opacity:.24,depthWrite:false});
  const shadow=new THREE.Mesh(playerContactShadowGeo,playerContactShadowMat);
  shadow.name='F1_PLAYER_CONTACT_SHADOW';shadow.scale.set(1,1.8,1);shadow.rotation.x=-Math.PI/2;shadow.position.y=.024;g.add(shadow);
}

/* ============================================================
   🏎️📱 รอบ 1210 — SEMI-REALISTIC LOW-POLY PEER F1 (GPU COOL)
   geometry ใช้ร่วมกันทุกคัน · รวมชิ้นสีเดียว · ล้อ 4 วงเป็น InstancedMesh
   ไม่มี texture/PBR/reflection/dynamic shadow — รถผู้เล่น/ภาพ cockpit ไม่แตะ
   ============================================================ */
let peerF1Kit=null;
function peerF1MergedGeometry(parts){
  const pos=[],idx=[];
  function wedge(p){
    const x=p.x||0,z0=-p.l*.5,z1=p.l*.5,y0=p.y,y1=p.y+p.h,ry=p.ry||0,c=Math.cos(ry),s=Math.sin(ry);
    const wb=p.wb*.5,wf=p.wf*.5,b=pos.length/3;
    const put=(lx,y,lz)=>pos.push(x+lx*c+lz*s,y,p.z-lx*s+lz*c);
    put(-wb,y0,z0);put(wb,y0,z0);put(wb,y1,z0);put(-wb,y1,z0);
    put(-wf,y0,z1);put(wf,y0,z1);put(wf,y1,z1);put(-wf,y1,z1);
    idx.push(b,b+2,b+1,b,b+3,b+2, b+4,b+5,b+6,b+4,b+6,b+7,
      b,b+1,b+5,b,b+5,b+4, b+3,b+7,b+6,b+3,b+6,b+2,
      b,b+4,b+7,b,b+7,b+3, b+1,b+2,b+6,b+1,b+6,b+5);
  }
  parts.forEach(wedge);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setIndex(idx);geo.computeVertexNormals();geo.computeBoundingSphere();
  return geo;
}
function peerF1LoftGeometry(shells,sides=8){
  const pos=[],idx=[];
  for(const rings of shells){
    const base=pos.length/3;
    rings.forEach(r=>{
      for(let i=0;i<sides;i++){
        const a=i/sides*Math.PI*2;
        pos.push((r.x||0)+Math.cos(a)*r.w,r.y+Math.sin(a)*r.h,r.z);
      }
    });
    for(let q=0;q<rings.length-1;q++) for(let i=0;i<sides;i++){
      const a=base+q*sides+i,b=base+q*sides+(i+1)%sides,c=base+(q+1)*sides+(i+1)%sides,d=base+(q+1)*sides+i;
      idx.push(a,b,c,a,c,d);
    }
    /* ปิดหัว/ท้ายโดยใช้ fan รอบจุดกึ่งกลาง — ยังเป็น geometry ก้อนเดียว */
    const z0=rings[0],zn=rings[rings.length-1],c0=pos.length/3;
    pos.push(z0.x||0,z0.y,z0.z,zn.x||0,zn.y,zn.z);
    for(let i=0;i<sides;i++){
      idx.push(c0,base+(i+1)%sides,base+i);
      const e=base+(rings.length-1)*sides;idx.push(c0+1,e+i,e+(i+1)%sides);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setIndex(idx);geo.computeVertexNormals();geo.computeBoundingSphere();
  return geo;
}
function peerF1CombineGeometry(geos){
  const pos=[],idx=[];
  geos.forEach(g=>{
    const off=pos.length/3,a=g.attributes.position.array;
    for(let i=0;i<a.length;i++) pos.push(a[i]);
    if(g.index) for(let i=0;i<g.index.count;i++) idx.push(off+g.index.getX(i));
    else for(let i=0;i<g.attributes.position.count;i++) idx.push(off+i);
  });
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);
  geo.computeVertexNormals();geo.computeBoundingSphere();geos.forEach(g=>g.dispose());
  return geo;
}
function peerF1KitGet(){
  if(peerF1Kit) return peerF1Kit;
  /* เปลือกทรงรีหลายหน้าตัด: silhouette ต่อเนื่อง ไม่ใช่กองกล่องแบบรอบ 1209 รุ่นแรก */
  const bodyShell=peerF1LoftGeometry([
    [
      {x:0,y:.31,z:3.58,w:.055,h:.045},{x:0,y:.35,z:2.82,w:.13,h:.09},
      {x:0,y:.40,z:1.82,w:.27,h:.15},{x:0,y:.49,z:.82,w:.39,h:.24},
      {x:0,y:.58,z:.05,w:.46,h:.30},{x:0,y:.64,z:-.82,w:.42,h:.33},
      {x:0,y:.61,z:-1.72,w:.24,h:.21}
    ],
    [
      {x:-.57,y:.35,z:.92,w:.20,h:.12},{x:-.69,y:.40,z:.28,w:.34,h:.20},
      {x:-.69,y:.41,z:-.62,w:.35,h:.22},{x:-.48,y:.43,z:-1.35,w:.19,h:.16}
    ],
    [
      {x:.57,y:.35,z:.92,w:.20,h:.12},{x:.69,y:.40,z:.28,w:.34,h:.20},
      {x:.69,y:.41,z:-.62,w:.35,h:.22},{x:.48,y:.43,z:-1.35,w:.19,h:.16}
    ]
  ],8);
  /* cockpit surround เป็นสีเดียวกับตัวรถ — halo/พื้น/aero เท่านั้นที่เป็นคาร์บอนเข้ม */
  const cockpitCowl=peerF1LoftGeometry([[
    {x:0,y:.77,z:.88,w:.19,h:.055},{x:0,y:.83,z:.34,w:.31,h:.10},
    {x:0,y:.82,z:-.22,w:.28,h:.09},{x:0,y:.75,z:-.55,w:.14,h:.045}
  ]],8);
  const body=peerF1CombineGeometry([bodyShell,cockpitCowl]);
  /* aero สีเข้มรวมชิ้นคงที่ไว้ draw call เดียว */
  const aeroParts=[
    {x:0,y:.16,z:0,l:3.75,wb:1.92,wf:1.92,h:.07},
    {x:0,y:.19,z:3.38,l:.48,wb:1.98,wf:1.90,h:.055},
    {x:0,y:.25,z:3.10,l:.30,wb:1.48,wf:1.68,h:.045},
    {x:-.96,y:.19,z:3.36,l:.50,wb:.055,wf:.055,h:.27},
    {x:.96,y:.19,z:3.36,l:.50,wb:.055,wf:.055,h:.27},
    {x:0,y:.78,z:-1.93,l:.29,wb:1.38,wf:1.38,h:.055},
    {x:-.69,y:.76,z:-1.94,l:.46,wb:.055,wf:.055,h:.31},
    {x:.69,y:.76,z:-1.94,l:.46,wb:.055,wf:.055,h:.31},
    {x:0,y:.49,z:-2.08,l:.34,wb:1.18,wf:1.40,h:.13},
    {x:0,y:.70,z:.82,l:.10,wb:.08,wf:.08,h:.48}
  ];
  /* ปีกนกช่วงล่าง: คานบางเชื่อมล้อกับตัวรถ ทำให้ล้อไม่ดูหลุดลอย */
  const arm=(x1,z1,x2,z2,y)=>{const dx=x2-x1,dz=z2-z1;aeroParts.push({x:(x1+x2)/2,y,z:(z1+z2)/2,
    l:Math.hypot(dx,dz),wb:.055,wf:.055,h:.045,ry:Math.atan2(dx,dz)});};
  for(const s of [-1,1]){
    arm(s*.31,1.24,s*.91,1.50,.31);arm(s*.34,1.77,s*.91,1.55,.38);
    arm(s*.34,-1.18,s*.91,-1.46,.31);arm(s*.32,-1.70,s*.91,-1.48,.39);
  }
  const aero=peerF1MergedGeometry(aeroParts);
  const tyre=new THREE.CylinderGeometry(.45,.45,.40,10,1,false);tyre.rotateZ(Math.PI/2);
  const rim=new THREE.CylinderGeometry(.255,.255,.415,8,1,false);rim.rotateZ(Math.PI/2);
  tyre.computeBoundingSphere();rim.computeBoundingSphere();
  tyre.boundingSphere.radius=rim.boundingSphere.radius=3.8;
  peerF1Kit={body,aero,tyre,rim,
    halo:new THREE.TorusGeometry(.43,.045,4,10,Math.PI),
    helmet:new THREE.SphereGeometry(.22,7,5),
    flap:new THREE.BoxGeometry(1.52,.075,.48),
    tail:new THREE.BoxGeometry(.10,.19,.055),
    shadow:new THREE.CircleGeometry(1.55,12),
    aeroMat:new THREE.MeshLambertMaterial({color:0x15191f,flatShading:true}),
    tyreMat:new THREE.MeshLambertMaterial({color:0x111216,flatShading:true}),
    rimMat:new THREE.MeshLambertMaterial({color:0x8b929b,flatShading:true}),
    helmetMat:new THREE.MeshLambertMaterial({color:0xffcf32,flatShading:true}),
    tailMat:new THREE.MeshBasicMaterial({color:0xff2525})};
  return peerF1Kit;
}
function buildPeerF1Car(color){
  const k=peerF1KitGet(),g=new THREE.Group();
  const bodyMat=new THREE.MeshLambertMaterial({color,flatShading:true});
  const body=new THREE.Mesh(k.body,bodyMat);g.add(body);
  const aero=new THREE.Mesh(k.aero,k.aeroMat);g.add(aero);
  /* halo 10 เหลี่ยม + cockpit/หมวกทรงต่ำ อ่านรูปทรงได้แต่ polygon น้อย */
  const halo=new THREE.Mesh(k.halo,k.aeroMat);
  halo.rotation.x=Math.PI/2;halo.position.set(0,1.02,.53);g.add(halo);
  const helm=new THREE.Mesh(k.helmet,k.helmetMat);
  helm.scale.y=.88;helm.position.set(0,.96,.25);g.add(helm);
  /* ล้อทั้ง 4 = draw call เดียวต่อ material แทน 8 meshes */
  const tyres=new THREE.InstancedMesh(k.tyre,k.tyreMat,4);
  const rims=new THREE.InstancedMesh(k.rim,k.rimMat,4);
  const m=new THREE.Matrix4(),wheelPos=[[-.96,.45,1.52],[.96,.45,1.52],[-.96,.45,-1.47],[.96,.45,-1.47]];
  wheelPos.forEach((v,i)=>{m.makeTranslation(v[0],v[1],v[2]);tyres.setMatrixAt(i,m);rims.setMatrixAt(i,m);});
  tyres.instanceMatrix.needsUpdate=true;rims.instanceMatrix.needsUpdate=true;g.add(tyres,rims);
  /* DRS แยกเพียงชิ้นเดียวเพื่อให้ multiplayer ยังเปิดปีกได้ */
  const flap=new THREE.Mesh(k.flap,k.aeroMat);
  flap.position.set(0,1.04,-1.97);flap.rotation.x=DRS_FLAP_SHUT;g.add(flap);g.userData.drsFlap=flap;
  const tail=new THREE.Mesh(k.tail,k.tailMat);
  tail.position.set(0,.58,-2.2);g.add(tail);g.userData.tail=tail;
  g.userData.wheels=[];g.userData.front=[];
  g.userData.peerGpu={drawCalls:8,textures:0,pbr:0,dynamicShadows:0,
    bodyTriangles:k.body.index.count/3,aeroTriangles:k.aero.index.count/3,
    tyreSegments:10,rimSegments:8,sharedGeometry:true};
  g.userData.disposePeer=()=>bodyMat.dispose();
  return g;
}
/* VR-X1 รุ่นใหม่รอบ 1210/1216 = faceted low-poly ที่สี cockpit/รถเรา/รถเพื่อนตรงกัน
   ห้ามย้อนกลับไปใช้ GLB รอบ 898: texture เก่าล็อกสีแดงและเป็นรถรุ่นที่ผู้ใช้ยกเลิกแล้ว */
function replacePlayerCar(){
  if(!scene) return;
  const old=carGrp,oldVisible=old?old.visible:(camMode==='chase');
  const g=buildPeerF1Car(playerCarStyle.value);
  g.userData.modelKind='vrx1-faceted-low-poly';g.userData.playerStyle=playerCarStyle.key;
  addPlayerContactShadow(g);attachDrsGlow(g);
  g.position.set(px,py,pz);g.rotation.set(old?old.rotation.x:0,yaw,old?old.rotation.z:0);
  g.visible=oldVisible;scene.add(g);carGrp=g;
  wheels=g.userData.wheels||[];steerParts=g.userData.front||[];
  if(old){
    scene.remove(old);
    if(old.userData&&old.userData.drsGlow&&old.userData.drsGlow.material)old.userData.drsGlow.material.dispose();
    if(old.userData&&old.userData.disposePeer)old.userData.disposePeer();
  }
}
function paintPlayerStyle(key){
  playerCarStyle=carStyleByKey(key);
  /* บันทึกทันทีที่แตะสี ไม่รอปุ่มยืนยัน—กัน touch/webview ปิดหรือสลับหน้าก่อน click ยืนยัน */
  saveCarStyle();
  if(wrapEl){
    wrapEl.style.setProperty('--f1-cockpit-center',"url('"+cockpitAsset('center')+"')");
    wrapEl.style.setProperty('--f1-car-color',playerCarStyle.hex);
    wrapEl.querySelectorAll('[data-car-color]').forEach(b=>{
      const on=b.dataset.carColor===playerCarStyle.key;b.classList.toggle('sel',on);
      b.setAttribute('aria-checked',on?'true':'false');
    });
    const name=wrapEl.querySelector('#f1-garage-color-name');if(name)name.textContent='VR-X1 รุ่นใหม่ · '+playerCarStyle.label;
    if(carProofEl){
      carProofEl.textContent='🏎️ VR-X1 รุ่นใหม่ · '+playerCarStyle.label;
      carProofEl.title=cockpitAsset('center');
    }
    cockpitTurnSrc='';if(cockpitTurnEl){cockpitTurnEl.src='';cockpitTurnEl.style.opacity='0';}
  }
  replacePlayerCar();
  if(room&&room.online)netSend(true);
}
function primePlayerCockpit(){
  for(const pose of ['left','right']){const im=new Image();im.src=cockpitAsset(pose);}
}

/* ============================================================
   🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
   ============================================================ */
const CSS=`
#f1-wrap{position:fixed;inset:0;z-index:9500;display:none;background:#05060c;font-family:'Kanit','Segoe UI',sans-serif;
  -webkit-user-select:none;user-select:none;touch-action:none}
#f1-wrap.on{display:block}
#f1-cv{position:absolute;inset:0;width:100%;height:100%}
/* 🪖 รอบ 1332: ทุกโหมดใช้ cockpit WebP รุ่นใหม่ตามสีโดยตรง ห้ามฐาน/fallback รถแดงรุ่นเก่าทับ */
#f1-cockpit{position:absolute;inset:0;z-index:5;pointer-events:none;display:none;overflow:hidden;
  background-image:var(--f1-cockpit-center);background-size:100% auto;
  background-position:center calc(100% + 1vh);background-repeat:no-repeat}
#f1-wrap.fp #f1-cockpit{display:block}
/* Realistic Circuit ต้องเห็น halo/จมูก/พวงมาลัย แต่ไม่ให้ภาพค็อกพิทปิดถนนเกือบทั้งจอ */
#f1-wrap.realistic.fp #f1-cockpit{inset:0}
/* ชุดสีใหม่เป็นภาพ cockpit+มือ+พวงมาลัยที่สมบูรณ์ในตัว จึงห้ามชั้นภาพรถรุ่นเก่าซ้อนทุกโหมด */
#f1-wrap.fp #f1-wheel,#f1-wrap.fp #f1-leds,#f1-wrap.fp #f1-quality-wheel{display:none!important}
/* ภาพเลี้ยวทับเฉพาะตอนมีมุมพวงมาลัย: car/halo เหมือนเฟรมกลางและ opacity ไล่ตาม steer
   ทำให้มือทั้งสองข้างหมุนตามจริงโดยใช้เพียง overlay เดียวบนมือถือ */
#f1-cockpit-turn{display:none!important;left:0!important;right:0;top:auto!important;bottom:-1vh;width:100%;height:auto;
  z-index:0;opacity:0;transform:none!important;will-change:opacity}
#f1-wrap.fp #f1-cockpit-turn{display:block!important}
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
/* JS anchors the live display to measured locations in all three steering plates. */
#f1-wrap.fp #f1-dash{display:block!important}
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
  #f1-wrap.fp #f1-cockpit{inset:0;background-size:100% auto;background-position:center calc(100% + 1vh)}
  /* The wide plate already matches a landscape driver view; keep its sides at the
     viewport edges so bodywork never terminates as a visible rectangular cutout. */
  #f1-wrap.realistic.fp #f1-cockpit{background-size:100% auto;background-position:center calc(100% + 1vh)}
}
/* ป้ายหลักฐานจาก runtime: ถ้าเครื่องใดเห็นสีไม่ตรง ภาพหน้าจอจะบอก model/style ที่เลือกจริงทันที */
#f1-car-proof{position:absolute;left:50%;bottom:6px;z-index:6;transform:translateX(-50%);pointer-events:none;
  padding:3px 9px;border:1px solid rgba(97,213,255,.42);border-radius:999px;background:rgba(4,12,24,.68);
  color:#dff8ff;font:800 10px/1.2 'Kanit','Segoe UI',sans-serif;letter-spacing:.02em;white-space:nowrap}
/* 🧭 รอบ 914: ย้ายปุ่ม "มุมกล้อง" + "ออก" ขึ้นแถวขวาบน เรียงก่อนถึงเหรียญ (เดิมอยู่ซ้ายล่าง ทับที่ของแถบเลี้ยว)
   เหรียญย้ายเข้ามาเป็นลูกของแถวนี้ด้วย จึงไม่ต้องเดาความกว้างเหรียญเวลาเลขยาว */
#f1-topright{position:absolute;right:10px;top:8px;z-index:7;display:flex;align-items:flex-start;gap:6px}
#f1-cambtn,#f1-exitbtn{position:static;background:rgba(8,12,24,.78);
  border:1px solid rgba(255,255,255,.25);color:#fff;font-weight:800;font-size:13.5px;font-family:inherit;
  border-radius:12px;padding:6px 11px;white-space:nowrap}
#f1-exitbtn{background:rgba(216,26,26,.85);border-color:rgba(255,255,255,.25)}
#f1-statusright{display:flex;flex-direction:column;align-items:stretch;gap:6px}
#f1-topright #f1-coins{position:static;right:auto;top:auto;text-align:center}
#f1-musicbtn{position:static;min-height:34px;padding:5px 9px;border-radius:11px;white-space:nowrap;cursor:pointer;
  color:#dff9ff;font:800 12px/1.2 'Kanit','Segoe UI',sans-serif;background:linear-gradient(180deg,#194660,#07131f);
  border:1px solid rgba(103,216,255,.68);box-shadow:inset 0 1px rgba(255,255,255,.18),0 3px 12px rgba(0,0,0,.38)}
#f1-musicbtn[aria-pressed="false"]{color:#c7d1da;background:linear-gradient(180deg,#303942,#0b1015);border-color:rgba(190,205,216,.38)}
#f1-musicbtn.blocked{color:#ffe39a;border-color:rgba(255,209,46,.72)}
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
#f1-laps{position:relative;background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.16);
  border-radius:12px;padding:6px 10px;color:#fff;font-size:13px;line-height:1.5;z-index:6;pointer-events:none}
#f1-laps b{color:#ffd12e}
#f1-coins{position:absolute;right:10px;top:8px;background:rgba(8,12,24,.72);border:1px solid rgba(255,209,46,.35);
  border-radius:12px;padding:6px 12px;color:#ffd12e;font-weight:800;font-size:15px;z-index:6}
#f1-map{position:absolute;left:8px;top:96px;width:min(48vh,32vw);height:min(48vh,32vw);z-index:6;opacity:.98;pointer-events:none;
  filter:drop-shadow(0 5px 12px rgba(0,0,0,.62))}  /* 🧭 รอบ 1228 — ใหญ่ราวครึ่งจอมือถือแนวนอน + ขึ้นแทนขอบเดิมของกล่องเวลา */
/* 🏁 รอบ 1324 — R4 LIVE POSITION: timing tower ตัวเลขใหญ่ อ่านได้ด้วยการเหลือบมองระหว่างขับ */
#f1-position{position:absolute;left:10px;top:8px;z-index:7;min-width:142px;height:82px;box-sizing:border-box;
  display:grid;grid-template-columns:auto auto 1fr;grid-template-rows:22px 1fr;align-items:end;column-gap:4px;
  padding:7px 18px 8px 14px;color:#fff;overflow:hidden;pointer-events:none;
  clip-path:polygon(0 0,88% 0,100% 18%,100% 100%,12% 100%,0 82%);
  background:linear-gradient(112deg,rgba(5,9,15,.97),rgba(17,25,36,.94) 68%,rgba(43,50,59,.92));
  border-left:4px solid #ff263f;filter:drop-shadow(0 7px 15px rgba(0,0,0,.68))}
#f1-position:before{content:'';position:absolute;left:0;right:0;top:0;height:6px;opacity:.9;
  background:repeating-conic-gradient(#f5f7fa 0 25%,#15191f 0 50%) 0/12px 12px}
#f1-position:after{content:'';position:absolute;inset:6px 0 auto;height:2px;background:linear-gradient(90deg,#ff263f,#ffd12e 58%,transparent)}
.f1-pos-label{grid-column:1/4;align-self:center;font:800 10px/1 'Kanit',sans-serif;letter-spacing:.18em;color:#b8c7d8;white-space:nowrap}
.f1-pos-live{display:inline-block;width:6px;height:6px;margin-right:5px;border-radius:50%;background:#37f58a;box-shadow:0 0 8px #37f58a;vertical-align:1px}
#f1-position.solo .f1-pos-live{background:#ffd12e;box-shadow:0 0 8px #ffd12e}
.f1-pos-current{font:italic 950 52px/.82 'Arial Narrow','Kanit',sans-serif;letter-spacing:-.07em;
  text-shadow:2px 2px 0 #ad1022,0 0 16px rgba(255,38,63,.42)}
.f1-pos-slash{font:900 21px/1 'Arial Narrow','Kanit',sans-serif;color:#738397;padding-bottom:5px}
.f1-pos-total{font:900 23px/1 'Arial Narrow','Kanit',sans-serif;color:#eef5ff;padding-bottom:4px}
#f1-wrong{position:absolute;top:34%;left:50%;transform:translateX(-50%);background:rgba(216,26,26,.9);color:#fff;
  font-weight:900;font-size:20px;border-radius:12px;padding:8px 18px;display:none;z-index:7}
/* 🌀 PORTAL DESTINATION VIEW — วง plasma 3D + ภาพโค้งจริงที่จุดกลับ (รอบ 1222) */
#f1-portal{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden;opacity:0;
  background:radial-gradient(ellipse at 50% 42%,transparent 0 30%,rgba(255,255,255,.07) 38%,rgba(255,36,221,.18) 48%,rgba(105,25,229,.16) 59%,transparent 76%);
  filter:saturate(1.34) contrast(1.06);transition:opacity .1s}
#f1-portal .nebula{position:absolute;inset:-18%;opacity:.82;mix-blend-mode:screen;
  background:repeating-conic-gradient(from 5deg at 50% 42%,transparent 0 5deg,rgba(255,72,236,.24) 5.3deg 5.9deg,transparent 6.3deg 15deg),
    radial-gradient(ellipse at 50% 42%,transparent 0 31%,rgba(255,31,218,.14) 44%,rgba(105,26,234,.20) 58%,transparent 74%);
  -webkit-mask:radial-gradient(ellipse at 50% 42%,transparent 0 30%,#000 38% 67%,transparent 82%);
  mask:radial-gradient(ellipse at 50% 42%,transparent 0 30%,#000 38% 67%,transparent 82%);
  animation:f1portalnebula 3.4s linear infinite;will-change:transform}
#f1-portal .gate{position:absolute;left:50%;top:42%;width:min(72vw,960px);height:min(60vh,540px);border-radius:50%;isolation:isolate;
  transform:translate(-50%,-50%) perspective(900px) rotateX(-2deg) scale(.12);opacity:0;
  background:radial-gradient(ellipse,transparent 0 45%,rgba(255,255,255,.18) 47%,#fff 49%,#ff8af2 51%,#ff22db 55%,#9f25ff 60%,rgba(61,13,151,.38) 65%,transparent 70%);
  filter:drop-shadow(0 0 8px #fff) drop-shadow(0 0 28px #ff2bdf) drop-shadow(0 0 70px #7b22ef);
  transition:transform .48s cubic-bezier(.18,.85,.25,1.18),opacity .08s;will-change:transform,opacity}
/* canvas วาดเส้นสนามจริงที่ target เพียงครั้งเดียวตอนเปิด portal — ไม่มี render target หรือ shader เพิ่ม */
#f1-portal .destination{position:absolute;left:9%;top:10%;width:82%;height:80%;z-index:-2;border-radius:50%;
  clip-path:ellipse(45% 43% at 50% 50%);object-fit:cover;opacity:.98;filter:saturate(1.28) contrast(1.12) brightness(.88);
  box-shadow:inset 0 0 34px #08011d,inset 0 0 58px rgba(197,35,255,.72);transition:opacity .28s,transform .42s}
#f1-portal .frame{position:absolute;inset:-4%;z-index:-1;border:clamp(2px,.42vw,6px) solid rgba(192,80,255,.72);
  border-radius:36%;clip-path:polygon(14% 0,86% 0,100% 18%,100% 82%,86% 100%,14% 100%,0 82%,0 18%);
  background:repeating-conic-gradient(from 11deg,rgba(30,5,62,.82) 0 7deg,rgba(234,60,255,.74) 8deg 10deg,rgba(19,3,48,.82) 11deg 21deg);
  -webkit-mask:radial-gradient(ellipse,transparent 0 57%,#000 58% 65%,transparent 66%);mask:radial-gradient(ellipse,transparent 0 57%,#000 58% 65%,transparent 66%);
  box-shadow:inset 0 0 0 2px rgba(255,184,255,.46),0 0 18px #a21eff,0 0 42px rgba(255,31,221,.55)}
/* plasma แตกแขนงสองวง: ใช้ mask เจาะกลางให้เห็น canvas สนามปลายทาง */
#f1-portal .gate:before,#f1-portal .gate:after,#f1-portal .filaments{content:'';position:absolute;border-radius:50%;mix-blend-mode:screen}
#f1-portal .gate:before{inset:-5%;background:repeating-conic-gradient(from 13deg,#fff 0 1.2deg,#ff34df 1.8deg 4deg,transparent 5deg 9deg,#b82cff 10deg 12deg,transparent 13deg 18deg);
  -webkit-mask:radial-gradient(ellipse,transparent 0 51%,#000 53% 62%,transparent 65%);mask:radial-gradient(ellipse,transparent 0 51%,#000 53% 62%,transparent 65%);
  filter:drop-shadow(0 0 7px #fff) drop-shadow(0 0 18px #ff31df);animation:f1portalpulse .34s ease-in-out infinite alternate}
#f1-portal .gate:after{inset:-13%;background:repeating-conic-gradient(from -9deg,transparent 0 5deg,rgba(220,77,255,.92) 5.5deg 6.5deg,transparent 7deg 14deg);
  -webkit-mask:radial-gradient(ellipse,transparent 0 55%,#000 57% 62%,transparent 65%);mask:radial-gradient(ellipse,transparent 0 55%,#000 57% 62%,transparent 65%);
  filter:drop-shadow(0 0 10px #a92cff);animation:f1portalorbit 2.4s linear infinite}
#f1-portal .filaments{inset:2%;background:repeating-conic-gradient(from 31deg,transparent 0 7deg,#fff 7.3deg 7.8deg,transparent 8.2deg 15deg,#ff44e7 15.4deg 16.6deg,transparent 17deg 23deg);
  -webkit-mask:radial-gradient(ellipse,transparent 0 46%,#000 48% 55%,transparent 58%);mask:radial-gradient(ellipse,transparent 0 46%,#000 48% 55%,transparent 58%);
  filter:drop-shadow(0 0 6px #fff);animation:f1portalorbit 1.35s linear infinite reverse}
#f1-portal .core{position:absolute;inset:4%;border-radius:50%;background:radial-gradient(ellipse,
  transparent 0 45%,rgba(255,255,255,.12) 47%,rgba(255,255,255,.94) 49%,rgba(255,47,224,.60) 53%,rgba(121,31,255,.40) 60%,transparent 69%);
  box-shadow:inset 0 0 18px rgba(255,255,255,.85),inset 0 0 54px rgba(255,34,223,.72),0 0 54px rgba(132,34,255,.55)}
#f1-portal .core:before,#f1-portal .core:after{content:'';position:absolute;inset:7%;border-radius:50%;border:2px solid rgba(255,255,255,.74);
  filter:drop-shadow(0 0 8px #ff42e6);animation:f1portalpulse .28s ease-in-out infinite alternate-reverse}
#f1-portal .core:after{inset:-2%;border:1px dashed #d95cff;animation-duration:.55s}
#f1-portal .sparks{position:absolute;inset:-32%;filter:drop-shadow(0 0 7px #fff) drop-shadow(0 0 14px #ec46ff)}
#f1-portal .sparks i{--a:0deg;position:absolute;left:50%;top:50%;width:clamp(2px,.28vw,5px);height:clamp(54px,9vw,150px);
  border-radius:99px;background:linear-gradient(transparent,#6f28ff 18%,#ff3fe7 54%,#fff 86% 94%,transparent);
  transform-origin:50% 0;transform:rotate(var(--a)) translateY(-31vh);animation:f1portalspark .66s ease-in-out infinite}
#f1-portal .sparks i:nth-child(3n){height:clamp(85px,13vw,205px);width:2px}#f1-portal .sparks i:nth-child(4n){height:clamp(38px,6vw,92px)}
#f1-portal .sparks i:nth-child(2){--a:20deg;animation-delay:-.12s}#f1-portal .sparks i:nth-child(3){--a:40deg;animation-delay:-.36s}
#f1-portal .sparks i:nth-child(4){--a:60deg;animation-delay:-.21s}#f1-portal .sparks i:nth-child(5){--a:80deg;animation-delay:-.53s}
#f1-portal .sparks i:nth-child(6){--a:100deg;animation-delay:-.29s}#f1-portal .sparks i:nth-child(7){--a:120deg;animation-delay:-.44s}
#f1-portal .sparks i:nth-child(8){--a:140deg;animation-delay:-.18s}#f1-portal .sparks i:nth-child(9){--a:160deg;animation-delay:-.61s}
#f1-portal .sparks i:nth-child(10){--a:180deg;animation-delay:-.08s}#f1-portal .sparks i:nth-child(11){--a:200deg;animation-delay:-.47s}
#f1-portal .sparks i:nth-child(12){--a:220deg;animation-delay:-.24s}#f1-portal .sparks i:nth-child(13){--a:240deg;animation-delay:-.58s}
#f1-portal .sparks i:nth-child(14){--a:260deg;animation-delay:-.16s}#f1-portal .sparks i:nth-child(15){--a:280deg;animation-delay:-.39s}
#f1-portal .sparks i:nth-child(16){--a:300deg;animation-delay:-.67s}#f1-portal .sparks i:nth-child(17){--a:320deg;animation-delay:-.31s}
#f1-portal .sparks i:nth-child(18){--a:340deg;animation-delay:-.5s}
#f1-portal.on{opacity:1}#f1-portal.on .gate{opacity:1;transform:translate(-50%,-50%) perspective(900px) rotateX(-2deg) scale(1)}
/* หลังย้ายรถ ฉาก WebGL ด้านหลังกลายเป็นสนามปลายทางจริง แต่วง portal ยังอยู่และหุบผ่านภาพนั้น */
#f1-portal.jump{opacity:1;background:radial-gradient(ellipse at 50% 42%,transparent 0 31%,rgba(255,226,253,.14) 42%,rgba(171,66,255,.20) 58%,transparent 78%)}
#f1-portal.jump .gate{opacity:.82;transform:translate(-50%,-50%) perspective(900px) rotateX(-2deg) scale(1.14)}
#f1-portal.jump .destination{opacity:.16;transform:scale(1.08)}
@keyframes f1portalpulse{from{opacity:.38;transform:scale(.96)}to{opacity:1;transform:scale(1.035)}}
@keyframes f1portalorbit{to{transform:rotate(360deg)}}
@keyframes f1portalnebula{to{transform:rotate(360deg) scale(1.04)}}
@keyframes f1portalspark{0%{opacity:0;scale:.18}32%{opacity:1}68%{opacity:.78}100%{opacity:0;scale:1.35}}
@media(max-width:700px){#f1-portal .gate{width:62vw;height:52vh;top:42%}#f1-portal .sparks i{transform:rotate(var(--a)) translateY(-27vh)}
  #f1-portal .sparks i:nth-child(even){display:none}#f1-portal .nebula{animation-duration:5.2s;opacity:.68}#f1-portal .frame{box-shadow:0 0 14px #a21eff}}
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
/* 🏆 รอบ 1222: scoreboard เหลือบรรทัดเดียว เลื่อนขวา→ซ้าย ไม่บังทางขับ */
#f1-board{position:absolute;left:164px;top:8px;width:min(400px,calc(100% - 174px));height:38px;box-sizing:border-box;
  background:rgba(8,12,24,.78);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:0 6px;
  color:#dfe9ff;font-size:12.5px;display:none;align-items:center;gap:6px;overflow:hidden;z-index:6}
#f1-board.on{display:flex}
#f1-board .m-bd-icon{flex:none;color:#ffd12e;font-size:15px;line-height:1}
#f1-board .m-bd-window{flex:1;min-width:0;height:100%;overflow:hidden;position:relative;white-space:nowrap}
#f1-board .m-bd-track{display:inline-flex;align-items:center;height:100%;width:max-content;padding-left:100%;
  animation:f1boardticker var(--f1-ticker-s,18s) linear infinite;will-change:transform}
#f1-board .m-bd-text{display:inline-block;padding-right:42px;white-space:nowrap;font-weight:750;line-height:38px}
#f1-board .m-bd-me{color:#7dffb0}
#f1-board .nr-go{flex:none!important;margin:0!important;padding:2px 7px!important;font-size:11px;line-height:20px!important}
@keyframes f1boardticker{from{transform:translateX(0)}to{transform:translateX(-100%)}}
@media(max-width:700px){#f1-board{height:34px;font-size:11.5px;border-radius:10px;padding:0 4px;gap:4px}
  #f1-board .m-bd-text{line-height:34px;padding-right:30px}#f1-board .nr-go{font-size:0;padding:2px 6px!important}
  #f1-board .nr-go:after{content:'👥';font-size:13px}}
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
/* 🎨 VIP PIT GARAGE — หน้าต่างเลือกสีก่อนลงสนาม; ซ่อนทั้งก้อนระหว่างแข่งจึงไม่มี render cost */
#f1-garage{position:absolute;inset:0;z-index:11;display:none;align-items:center;justify-content:center;
  padding:10px;box-sizing:border-box;background:radial-gradient(circle at 50% 42%,rgba(22,38,65,.70),rgba(2,5,11,.96) 70%)}
#f1-garage.on{display:flex}
#f1-garage .garage-card{--metal:#e7c770;position:relative;width:min(580px,95vw);max-height:94vh;overflow:hidden;
  box-sizing:border-box;padding:clamp(13px,3vh,22px);border:1px solid rgba(255,225,147,.78);border-radius:24px;
  color:#eef5ff;text-align:center;background:
    linear-gradient(135deg,rgba(255,255,255,.09),transparent 22%),
    repeating-linear-gradient(135deg,rgba(255,255,255,.018) 0 2px,transparent 2px 7px),
    linear-gradient(155deg,#1b2636 0,#070c14 48%,#111c2a 100%);
  box-shadow:0 24px 70px rgba(0,0,0,.72),inset 0 1px 0 rgba(255,255,255,.22),inset 0 0 42px rgba(231,199,112,.06)}
#f1-garage .garage-card:before{content:'';position:absolute;inset:5px;border:1px solid rgba(231,199,112,.20);border-radius:19px;pointer-events:none}
.garage-kicker{color:#d9bd70;font:700 clamp(9px,1.9vh,11px)/1 'Kanit',sans-serif;letter-spacing:.30em;text-transform:uppercase}
#f1-garage h2{margin:5px 0 1px;font-size:clamp(20px,5vh,30px);letter-spacing:.04em;color:#fff;
  text-shadow:0 0 22px rgba(231,199,112,.28)}
.garage-sub{font-size:clamp(10px,2.2vh,13px);color:#9fb0c7}
.garage-stage{position:relative;height:clamp(92px,25vh,142px);margin:8px 0 5px;border-radius:17px;overflow:hidden;
  border:1px solid rgba(195,222,244,.22);background:radial-gradient(ellipse at 50% 105%,var(--f1-car-color),transparent 48%),linear-gradient(#07101a,#03070b)}
.garage-stage:before{content:'';position:absolute;left:8%;right:8%;bottom:19%;height:1px;background:linear-gradient(90deg,transparent,#65788b,transparent);box-shadow:0 10px 20px #000}
.garage-car{position:absolute;left:50%;bottom:18%;width:min(390px,78vw);height:78px;transform:translateX(-50%);filter:drop-shadow(0 9px 10px #000)}
.garage-car .body{position:absolute;left:17%;right:17%;bottom:18px;height:36px;background:linear-gradient(180deg,rgba(255,255,255,.52),var(--f1-car-color) 34%,#090b0f 145%);
  clip-path:polygon(0 72%,13% 44%,34% 35%,42% 5%,58% 5%,66% 35%,87% 44%,100% 72%,92% 100%,8% 100%);box-shadow:inset 0 2px rgba(255,255,255,.34)}
.garage-car .nose{position:absolute;left:46%;bottom:9px;width:8%;height:55px;background:linear-gradient(90deg,#090b0f,var(--f1-car-color),#090b0f);clip-path:polygon(34% 0,66% 0,100% 100%,0 100%)}
.garage-car .wing{position:absolute;left:4%;right:4%;bottom:7px;height:8px;border-radius:2px;background:linear-gradient(#46525e,#090c10 55%);box-shadow:0 4px #050608}
.garage-car .halo{position:absolute;left:41%;bottom:48px;width:18%;height:23px;border:5px solid #111820;border-bottom:0;border-radius:28px 28px 0 0;box-sizing:border-box}
.garage-car .wheel{position:absolute;bottom:0;width:39px;height:39px;border-radius:50%;background:radial-gradient(circle,#303740 0 20%,#080a0d 22% 67%,#2b3137 69% 75%,#050608 77%);box-shadow:inset 0 0 0 2px #000}
.garage-car .wheel.l{left:14%}.garage-car .wheel.r{right:14%}
.garage-color-name{font-weight:800;color:var(--f1-car-color);font-size:clamp(13px,3vh,17px);text-shadow:0 0 12px var(--f1-car-color)}
.garage-swatches{display:flex;justify-content:center;gap:clamp(8px,2.6vw,15px);margin:8px 0 10px}
.garage-swatch{position:relative;width:42px;height:42px;margin:0;padding:0;border:1px solid rgba(255,255,255,.30);border-radius:50%;background:#07101a;cursor:pointer;
  box-shadow:inset 0 0 0 5px #0b111a,0 4px 12px #000;transition:transform .16s,border-color .16s}
.garage-swatch:before{content:'';position:absolute;inset:7px;border-radius:50%;background:var(--swatch);box-shadow:inset 0 2px 4px rgba(255,255,255,.45),0 0 12px var(--swatch)}
.garage-swatch.sel{transform:translateY(-3px) scale(1.08);border-color:#ffe39a;box-shadow:inset 0 0 0 4px #111a26,0 0 0 2px rgba(231,199,112,.42),0 7px 18px #000}
.garage-actions{display:flex;justify-content:center;align-items:center;gap:10px}
.garage-actions button{border-radius:12px;font:800 clamp(11px,2.5vh,14px) 'Kanit',sans-serif;cursor:pointer}
#f1-garage-back{padding:8px 13px;border:1px solid rgba(255,255,255,.24);color:#aebbd0;background:transparent}
#f1-garage-confirm{padding:9px 24px;border:1px solid #f6dc92;color:#171005;background:linear-gradient(180deg,#ffe9a9,#bd8e2d);box-shadow:inset 0 1px #fff7d3,0 7px 18px rgba(0,0,0,.46)}
@media (max-height:430px){
  #f1-garage .garage-card{width:min(620px,96vw);padding:10px 18px;border-radius:19px}
  #f1-garage h2{margin:2px 0;font-size:19px}.garage-stage{height:92px;margin:5px 0 2px}
  .garage-car{height:70px}.garage-swatches{margin:5px 0 7px}.garage-swatch{width:34px;height:34px}
  .garage-swatch:before{inset:6px}.garage-actions button{padding-top:6px!important;padding-bottom:6px!important}
}
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
  box-shadow:inset 0 0 0 4px rgba(2,7,13,.72),inset 0 0 18px #000,0 0 0 1px #05080c,0 8px 26px rgba(0,0,0,.52);
  pointer-events:none;will-change:left,top}
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
/* Cockpit already has the same live data on its steering wheel; avoid a duplicate
   floating box. Chase/road views keep the HUD because they have no wheel display. */
#f1-wrap.fp #f1-hud{display:none}
#f1-gear{clip-path:polygon(12% 0,88% 0,100% 25%,100% 75%,88% 100%,12% 100%,0 75%,0 25%);
  background:linear-gradient(180deg,#ff3145,#8d0712);border-radius:0;min-width:24px}
@media (max-height:430px){
  #f1-position{min-width:122px;height:68px;padding:7px 15px 7px 11px;grid-template-rows:18px 1fr}
  .f1-pos-label{font-size:8px}.f1-pos-current{font-size:43px}.f1-pos-slash{font-size:18px}.f1-pos-total{font-size:20px}
  #f1-map{top:80px;width:min(33vh,26vw);height:min(33vh,26vw)}
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
  #f1-musicbtn{min-height:29px;padding:4px 7px;font-size:10.5px;border-radius:9px}
  #f1-map{width:min(48vh,32vw);height:min(48vh,32vw)}
  #f1-drs{font-size:15px;padding:3px 9px}
  #f1-drs small{font-size:10px}
}`;
function buildDom(){
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='f1-wrap';
  wrapEl.style.setProperty('--f1-cockpit-center',"url('"+cockpitAsset('center')+"')");
  wrapEl.style.setProperty('--f1-car-color',playerCarStyle.hex);
  wrapEl.innerHTML=`
    <canvas id="f1-cv"></canvas>
    <div id="f1-cockpit"><img id="f1-wheel" alt=""><div id="f1-leds"></div>
      <div id="f1-quality-wheel" aria-hidden="true"><i class="qw-grip l"></i><i class="qw-grip r"></i><i class="qw-led"></i></div>
      <img id="f1-cockpit-turn" alt="" aria-hidden="true">
      <canvas id="f1-dash"></canvas></div>
    <div id="f1-position" class="solo" aria-live="polite"><span class="f1-pos-label"><i class="f1-pos-live"></i>อันดับสด</span><strong class="f1-pos-current">1</strong><span class="f1-pos-slash">/</span><span class="f1-pos-total">1</span></div>
    <div id="f1-word"></div>
    <div id="f1-topright">
      <button id="f1-cambtn">📷 มุมรถ</button>
      <button id="f1-exitbtn">🏁 ออก</button>
      <div id="f1-statusright"><div id="f1-coins">🪙 +0</div><div id="f1-laps"></div><button id="f1-musicbtn" type="button" aria-pressed="true">🎵 เพลง เปิด</button></div>
    </div>
    <div id="f1-board"></div>
    <div id="f1-car-proof" aria-live="polite"></div>
    <canvas id="f1-map" width="260" height="260"></canvas>
    <div id="f1-hud"><div id="f1-speed">0<small> กม./ชม.</small></div><span id="f1-gear">N</span></div>
    <div id="f1-drs"></div>
    <div id="f1-lights"><div class="row"><i></i><i></i><i></i><i></i><i></i></div><b>🚦 รอไฟดับก่อนออกตัว</b></div>
    <div id="f1-gap"></div>
    <div id="f1-wrong">↩️ วิ่งผิดทาง! กลับรถ</div>
    <div id="f1-portal" aria-hidden="true"><div class="nebula"></div><div class="gate"><canvas class="destination" width="480" height="270"></canvas><div class="frame"></div><div class="filaments"></div><div class="core"></div><div class="sparks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>
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
    <div id="f1-garage" role="dialog" aria-modal="true" aria-labelledby="f1-garage-title"><div class="garage-card">
      <div class="garage-kicker">Vocab Motors · Private Selection</div>
      <h2 id="f1-garage-title">VIP PIT GARAGE</h2>
      <div class="garage-sub">VR-X1 รุ่นใหม่ · เลือกสีประจำรถก่อนลงสนาม · ภายนอก ภายใน และรถออนไลน์ใช้สีเดียวกัน</div>
      <div class="garage-stage" aria-hidden="true"><div class="garage-car">
        <i class="body"></i><i class="nose"></i><i class="wing"></i><i class="halo"></i><i class="wheel l"></i><i class="wheel r"></i>
      </div></div>
      <div class="garage-color-name" id="f1-garage-color-name"></div>
      <div class="garage-swatches" role="radiogroup" aria-label="เลือกสีรถ">
        ${CAR_STYLES.map(s=>`<button type="button" class="garage-swatch" data-car-color="${s.key}" style="--swatch:${s.hex}" role="radio" aria-label="${s.label}" aria-checked="false"></button>`).join('')}
      </div>
      <div class="garage-actions"><button type="button" id="f1-garage-back">← กลับเมือง</button><button type="button" id="f1-garage-confirm">ยืนยันรถคันนี้ ✦</button></div>
    </div></div>
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
  garageEl=wrapEl.querySelector('#f1-garage');
  exitBox=wrapEl.querySelector('#f1-exitbox');
  boardEl=wrapEl.querySelector('#f1-board');
  carProofEl=wrapEl.querySelector('#f1-car-proof');
  positionEl=wrapEl.querySelector('#f1-position');
  /* 👥 รอบ 939: ปุ่ม "ไปหาเพื่อน" ที่ NetRoom ฝังมากับป้ายสถานะ — เดิม F1 วาดปุ่มแต่ไม่ได้ดักคลิก (กดแล้วเงียบ) */
  boardEl.addEventListener('click',e=>{ if(e.target.closest('.nr-go')&&room) room.openFriends(); });
  chatBarEl=wrapEl.querySelector('#f1-chatbar');
  selfMsgEl=wrapEl.querySelector('#f1-selfmsg');
  speedEl=wrapEl.querySelector('#f1-speed');
  gearEl=wrapEl.querySelector('#f1-gear');
  lapEl=wrapEl.querySelector('#f1-laps');
  raceBgmBtn=wrapEl.querySelector('#f1-musicbtn');
  raceBgmBtn.addEventListener('click',raceMusicToggle);
  raceMusicSyncButton();
  wrongEl=wrapEl.querySelector('#f1-wrong');
  portalEl=wrapEl.querySelector('#f1-portal');
  portalViewCv=portalEl.querySelector('.destination');
  drsEl=wrapEl.querySelector('#f1-drs');
  knobEl=wrapEl.querySelector('#f1-knob');
  /* 🚦👻 รอบ 902 */
  lightsEl=wrapEl.querySelector('#f1-lights');
  lightDots=[].slice.call(lightsEl.querySelectorAll('i'));
  lightNoteEl=lightsEl.querySelector('b');
  gapEl=wrapEl.querySelector('#f1-gap');
  mapCv=wrapEl.querySelector('#f1-map'); mapCtx=mapCv.getContext('2d');
  garageEl.querySelectorAll('[data-car-color]').forEach(b=>b.addEventListener('click',()=>paintPlayerStyle(b.dataset.carColor)));
  wrapEl.querySelector('#f1-garage-confirm').addEventListener('click',()=>{
    saveCarStyle();primePlayerCockpit();garageEl.classList.remove('on');introEl.style.display='flex';netSend(true);
  });
  wrapEl.querySelector('#f1-garage-back').addEventListener('click',exitWorld);
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
  /* รอบ 1332: ชุด cockpit สีใหม่มีพวงมาลัย/มือครบแล้ว ไม่โหลดหรือ fallback ภาพแดงรุ่นเก่าอีก */
  wheelEl=wrapEl.querySelector('#f1-wheel');
  wheelEl.style.display='none';
  buildLeds(); ledsOff();
  /* โหลดซ้าย/ขวาเฉพาะสีที่ยืนยัน ไม่ preload รถทุกสีเข้า RAM มือถือ */
  paintPlayerStyle(playerCarStyle.key);
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
  /* 🎮 รอบ 1217: floating steering pad — แตะ/ลากตรงไหนก็ได้ในครึ่งจอซ้าย
     ศูนย์พวงมาลัยย้ายใต้จุดแตะ, pointer capture ทำให้ลากออกนอกวงแล้วยังคุมต่อเนื่อง */
  const steerBox=wrapEl.querySelector('#f1-steer');
  let sid=null,steerAnchorX=0,steerRadius=60;
  const steerBlock='button,#f1-board,#f1-map,#f1-word,#f1-laps,#f1-garage,#f1-intro,#f1-exitbox,#f1-legal,#f1-chatbar';
  function placeSteer(cx,cy){
    const wr=wrapEl.getBoundingClientRect(),r=steerBox.getBoundingClientRect();
    const hx=r.width*.5,hy=r.height*.5,pad=6;
    const minX=hx+pad,maxX=Math.max(minX,wr.width*.5-hx-pad);
    const minY=hy+pad,maxY=Math.max(minY,wr.height-hy-pad);
    const x=clamp(cx-wr.left,minX,maxX),y=clamp(cy-wr.top,minY,maxY);
    steerBox.style.left=x+'px';steerBox.style.top=y+'px';steerBox.style.bottom='auto';
    steerBox.style.transform='translate(-50%,-50%)';
    steerBox.dataset.centerX=x.toFixed(1);steerBox.dataset.centerY=y.toFixed(1);
    steerRadius=Math.max(32,r.width*.42);
  }
  function steerTo(cx){
    steerCtl=clamp((cx-steerAnchorX)/steerRadius,-1,1);
    steerBox.dataset.value=steerCtl.toFixed(3);
  }
  function resetSteer(rehome){
    sid=null;steerCtl=0;steerBox.dataset.active='0';steerBox.dataset.value='0.000';
    if(rehome){steerBox.style.removeProperty('left');steerBox.style.removeProperty('top');
      steerBox.style.removeProperty('bottom');steerBox.style.removeProperty('transform');}
  }
  wrapEl.addEventListener('pointerdown',e=>{
    const wr=wrapEl.getBoundingClientRect(),blocked=e.target.closest&&e.target.closest(steerBlock);
    if(sid!==null||e.clientX>wr.left+wr.width*.5||blocked||(e.pointerType==='mouse'&&e.button!==0))return;
    e.preventDefault();sid=e.pointerId;steerAnchorX=e.clientX;placeSteer(e.clientX,e.clientY);
    steerBox.dataset.active='1';steerTo(e.clientX);wrapEl.setPointerCapture(sid);
  });
  wrapEl.addEventListener('pointermove',e=>{if(sid===e.pointerId){e.preventDefault();steerTo(e.clientX);}});
  const sEnd=e=>{if(sid===e.pointerId)resetSteer(false);};
  wrapEl.addEventListener('pointerup',sEnd);wrapEl.addEventListener('pointercancel',sEnd);
  wrapEl.addEventListener('lostpointercapture',e=>{if(sid===e.pointerId)resetSteer(false);});
  steerBox._f1Reset=()=>resetSteer(true);
  /* คันเร่ง/เบรก */
  /* ⏪ รอบ 911: ปุ่มเกียร์ถอยหลัง */
  const revB=wrapEl.querySelector('#f1-reverse');
  revB.addEventListener('pointerdown',e=>{ e.preventDefault(); padRev=true; Snd.start(); });
  revB.addEventListener('pointerup',()=>padRev=false);
  revB.addEventListener('pointercancel',()=>padRev=false);
  const thrB=wrapEl.querySelector('#f1-throttle'), brB=wrapEl.querySelector('#f1-brake');
  thrB.addEventListener('pointerdown',e=>{ e.preventDefault(); padThr=1; Snd.start();
    if(garageEl.classList.contains('on')){padThr=0;return;}
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
  playerCarStyle=storedCarStyle();
  built=true;
  buildDom();
  document.addEventListener('visibilitychange',raceMusicVisibilityChange);
  buildLine();
  findDrsZones();          // 🪽 รอบ 904 — ต้องมาหลัง buildLine (ใช้ LINE.curv/cum)
  buildPitLine();          // 🛞 รอบ 905 — ต้องมาหลัง buildLine (ใช้ nearIdx หาฝั่งโรงรถ) และก่อน buildTrackScene
  scene=new THREE.Scene();
  /* 🌆 พลบค่ำทะเลทราย (night race) */
  scene.background=new THREE.Color(0x0d1430);
  scene.fog=new THREE.Fog(0x0d1430,340,1600);
  camera=new THREE.PerspectiveCamera(64,16/9,0.3,2100);
  thermalMobile=isThermalMobile();
  /* MSAA คิดทุกพิกเซลทุกเฟรมและเครื่องมือถือมี DPR สูงอยู่แล้ว — ปิดเฉพาะมือถือเพื่อลดความร้อน */
  renderer=new THREE.WebGLRenderer({canvas:wrapEl.querySelector('#f1-cv'),antialias:!thermalMobile});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,thermalMobile?1.25:2));
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
  /* รถเรา: VR-X1 faceted รุ่นใหม่ชุดเดียวกับระบบเลือกสีรอบ 1216 */
  replacePlayerCar();
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
  /* ทางกระโดดเป็นเพชรสีเล็ก ๆ ข้างเส้นสนาม ไม่เพิ่ม DOM/HUD มาบังถนน */
  for(const j of JUMPS){
    const i=(j.startIdx+Math.round(j.takeoffD/SAMPLE_M))%LINE.n;
    const [mx,my]=mapXY(LINE.x[i]+LINE.nx[i]*j.lat,LINE.z[i]+LINE.nz[i]*j.lat,bb);
    mg.fillStyle='#'+j.color.toString(16).padStart(6,'0');mg.beginPath();
    mg.moveTo(mx,my-5);mg.lineTo(mx+5,my);mg.lineTo(mx,my+5);mg.lineTo(mx-5,my);mg.closePath();mg.fill();
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
    mapCtx.fillStyle=peerColor(uid,p.colorIdx);
    mapCtx.beginPath(); mapCtx.arc(x,y,6,0,Math.PI*2); mapCtx.fill();
  }
  const [x,y]=mapXY(px,pz,bb);
  /* จุดรถเราใช้สีรถที่เลือกและ pulse ต่อเนื่อง; minimap แสดงเฉพาะ self + peer จริง ไม่วาด Best-Lap ghost */
  const pulse=(Math.sin(performance.now()*.0105)+1)*.5;
  mapCtx.globalAlpha=.22+pulse*.30;
  mapCtx.fillStyle=playerCarStyle.hex;
  mapCtx.beginPath(); mapCtx.arc(x,y,9+pulse*4,0,Math.PI*2); mapCtx.fill();
  mapCtx.globalAlpha=1;
  mapCtx.fillStyle=playerCarStyle.hex; mapCtx.strokeStyle='#fff'; mapCtx.lineWidth=2;
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
  px=LINE.x[i]; py=0; pz=LINE.z[i];
  yaw=Math.atan2(LINE.tx[i],LINE.tz[i]);
  pitch=bodyRoll=0;vx=vy=vz=0;spd=0;steer=0;slide=0;myIdx=i;camInit=false;
  airborne=false;activeJump=null;jumpPrevD=-1;jumpMissed=false;jumpImpact=0;jumpLandKickT=0;
}
/* ============================================================
   🌀 PORTAL DESTINATION PREVIEW — actual target curve / Canvas2D (รอบ 1222)
   ============================================================ */
function drawPortalDestination(targetIdx){
  if(!portalViewCv||!LINE)return false;
  const c=portalViewCv,x=c.getContext('2d'),w=c.width,h=c.height,idx=(targetIdx+LINE.n)%LINE.n;
  const sky=x.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#080b2b');sky.addColorStop(.48,'#152b62');sky.addColorStop(.49,'#b75cf4');sky.addColorStop(.51,'#c6a367');sky.addColorStop(1,'#4b3c31');
  x.fillStyle=sky;x.fillRect(0,0,w,h);
  /* อัฒจันทร์ + ไฟสนามที่ขอบฟ้า */
  x.fillStyle='#12182b';x.beginPath();x.moveTo(0,h*.54);x.lineTo(w*.18,h*.39);x.lineTo(w*.36,h*.47);x.lineTo(w*.68,h*.43);x.lineTo(w,h*.52);x.lineTo(w,h*.62);x.lineTo(0,h*.62);x.fill();
  x.fillStyle='rgba(255,228,196,.72)';for(let n=0;n<44;n++){const px2=(n*83%w),py2=h*(.43+(n%5)*.017);x.fillRect(px2,py2,2,1);}
  const tx=LINE.tx[idx],tz=LINE.tz[idx],nx=tz,nz=-tx,steps=28,left=[],right=[],center=[];
  for(let s=0;s<steps;s++){
    const j=(idx+s+LINE.n)%LINE.n,dx=LINE.x[j]-LINE.x[idx],dz=LINE.z[j]-LINE.z[idx],lat=dx*nx+dz*nz,q=s/(steps-1);
    const cy=h*1.06-Math.pow(q,.58)*h*.62,cx=w*.5+lat*w*.0065*(1-q*.68),half=w*(.40*(1-q)+.045*q);
    center.push({x:cx,y:cy,half});left.push({x:cx-half,y:cy});right.push({x:cx+half,y:cy});
  }
  x.fillStyle='#222936';x.beginPath();x.moveTo(left[0].x,left[0].y);for(const p of left)x.lineTo(p.x,p.y);for(let s=right.length-1;s>=0;s--)x.lineTo(right[s].x,right[s].y);x.closePath();x.fill();
  x.strokeStyle='#667080';x.lineWidth=2;x.beginPath();left.forEach((p,n)=>n?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();x.beginPath();right.forEach((p,n)=>n?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();
  /* kerb ม่วง/ขาวและ racing line ช่วยให้รู้ทันทีว่าเป็นสนามปลายทาง */
  for(let s=2;s<steps-1;s+=3){x.strokeStyle=(s/3)%2?'#f7f4ff':'#d51f6f';x.lineWidth=Math.max(1,8*(1-s/steps));x.beginPath();x.moveTo(left[s-1].x,left[s-1].y);x.lineTo(left[s+1].x,left[s+1].y);x.stroke();x.beginPath();x.moveTo(right[s-1].x,right[s-1].y);x.lineTo(right[s+1].x,right[s+1].y);x.stroke();}
  x.strokeStyle='rgba(85,239,216,.55)';x.lineWidth=2;x.beginPath();center.forEach((p,n)=>n?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();
  for(let s=6;s<steps;s+=5){const p=center[s],pole=Math.max(7,p.half*.55);for(const side of [-1,1]){const px2=p.x+side*p.half*1.38;x.strokeStyle='#bac9df';x.lineWidth=1;x.beginPath();x.moveTo(px2,p.y);x.lineTo(px2,p.y-pole);x.stroke();x.fillStyle='#fff6db';x.shadowColor='#fff';x.shadowBlur=6;x.fillRect(px2-3,p.y-pole-1,6,2);x.shadowBlur=0;}}
  /* vignette ภายในวงให้ภาพดูเป็นช่องลึก ไม่ใช่สี่เหลี่ยมแบน */
  const v=x.createRadialGradient(w*.5,h*.53,w*.16,w*.5,h*.53,w*.55);v.addColorStop(.45,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(5,0,22,.86)');x.fillStyle=v;x.fillRect(0,0,w,h);
  return true;
}
function beginPortalReturn(){
  if(portalActive) return;
  portalActive=true; portalT=0; portalJumped=false; sandT=0;
  portalTargetIdx=nearIdx(px,pz,myIdx);
  drawPortalDestination(portalTargetIdx);
  portalResumeSpeed=Math.hypot(vx,vz);
  spd=portalResumeSpeed; // 🚫 รอบ 1226: ห้ามหน่วงความเร็วทั้งก่อน/ระหว่าง/หลังข้ามมิติ
  py=Math.max(0,py);vy=0;pitch=bodyRoll=0;airborne=false;activeJump=null;jumpPrevD=-1;
  if(portalEl) portalEl.className='on';
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate([45,35,90]);
}
function portalTick(dt){
  portalT+=dt;
  if(!portalJumped)spd=portalResumeSpeed;
  if(!portalJumped&&portalT>=.68){
    portalJumped=true;
    respawnOnTrack(portalTargetIdx,false);
    vx=LINE.tx[myIdx]*portalResumeSpeed;vz=LINE.tz[myIdx]*portalResumeSpeed;spd=portalResumeSpeed;
    if(portalEl) portalEl.className='on jump';
  }
  /* ประตูกำลังหุบแต่รถออกมาแล้ว: เดินหน้าต่อด้วยความเร็วเดิมและค่อยหันตาม tangent
     ของสนาม เพื่อไม่ให้ภาพดูหยุดค้างหรือพุ่งตัดโค้งระหว่าง 0.48 วิสุดท้าย */
  if(portalJumped&&portalResumeSpeed>0){
    myIdx=nearIdx(px,pz,myIdx);yaw=Math.atan2(LINE.tx[myIdx],LINE.tz[myIdx]);
    vx=LINE.tx[myIdx]*portalResumeSpeed;vz=LINE.tz[myIdx]*portalResumeSpeed;spd=portalResumeSpeed;
    px+=vx*dt;pz+=vz*dt;
  }
  if(carGrp){carGrp.position.set(px,py,pz);carGrp.rotation.set(0,yaw,0);}
  if(portalT>=1.16){
    portalActive=false; portalT=0;
    if(portalEl) portalEl.className='';
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
/* OBB ย่อยหนึ่งคู่ — คืน normal จาก B มาหา A */
function carPartContact(ax,az,ay,ap,bx,bz,by,bp){
  const afx=Math.sin(ay),afz=Math.cos(ay),arx=afz,arz=-afx;
  const bfx=Math.sin(by),bfz=Math.cos(by),brx=bfz,brz=-bfx;
  const acx=ax+arx*ap[0]+afx*ap[1],acz=az+arz*ap[0]+afz*ap[1];
  const bcx=bx+brx*bp[0]+bfx*bp[1],bcz=bz+brz*bp[0]+bfz*bp[1];
  const dx=bcx-acx,dz=bcz-acz;
  const axes=[[arx,arz],[afx,afz],[brx,brz],[bfx,bfz]];
  let best=Infinity,bnx=0,bnz=0;
  for(const a of axes){
    const nx=a[0],nz=a[1],proj=dx*nx+dz*nz;
    const ra=ap[2]*Math.abs(nx*arx+nz*arz)+ap[3]*Math.abs(nx*afx+nz*afz);
    const rb=bp[2]*Math.abs(nx*brx+nz*brz)+bp[3]*Math.abs(nx*bfx+nz*bfz);
    const over=ra+rb-Math.abs(proj);
    if(over<=0) return null;
    if(over<best){
      const side=proj>=0?1:-1;
      best=over;bnx=-nx*side;bnz=-nz*side;   // B → A
    }
  }
  return {nx:bnx,nz:bnz,depth:best};
}
/* compound Formula footprint: broad phase แค่ตัดคันไกล; contact ต้องมาจากชิ้นโมเดลชนกันจริง */
function carContact(ax,az,ay,bx,bz,by){
  const dx=bx-ax,dz=bz-az;
  if(dx*dx+dz*dz>(CAR_HIT_RADIUS*2)*(CAR_HIT_RADIUS*2)) return null;
  let hit=null;
  for(const ap of CAR_HIT_PARTS) for(const bp of CAR_HIT_PARTS){
    const c=carPartContact(ax,az,ay,ap,bx,bz,by,bp);
    if(c&&(!hit||c.depth>hit.depth)) hit=c;
  }
  return hit;
}
function resolvePeerCars(dt){
  if(gridFormationActive())return false; // รอ roster จัดกริดให้ครบก่อนไฟดับ ห้าม impulse ดันกันออกนอกสนาม
  let hit=false;
  for(const uid in peers){
    const p=peers[uid];
    if(!p||!p.cur) continue;
    if(Math.abs(py-(p.yCur||0))>JUMP_PEER_Y_SEP) continue; // รถบนเนิน/กลางอากาศไม่ชนรถที่วิ่งด้านล่าง
    const c=carContact(px,pz,yaw,p.cur.x,p.cur.z,p.yawCur||0);
    if(!c) continue;
    hit=true;
    /* แยกรถออกตามแกนสั้นสุดก่อนเสมอ จึงไม่มีเฟรมไหนที่รถสองคันทับ/วิ่งทะลุกัน */
    px+=c.nx*(c.depth+CAR_SEP_EPS);
    pz+=c.nz*(c.depth+CAR_SEP_EPS);
    const pvx=p.vxCur||0,pvz=p.vzCur||0;
    const rvx=vx-pvx,rvz=vz-pvz;
    const vn=rvx*c.nx+rvz*c.nz;
    const tx=-c.nz,tz=c.nx,vt=rvx*tx+rvz*tz;
    if(vn<0){
      /* impulse ของมวลเท่ากันในมุมมอง local: สะท้อนแนวชน + ลดแนวไถลด้วยแรงเสียดทาน */
      const out=-vn*CAR_RESTITUTION;
      vx=pvx+c.nx*out+tx*vt*(1-CAR_SIDE_FRICTION);
      vz=pvz+c.nz*out+tz*vt*(1-CAR_SIDE_FRICTION);
      const now=performance.now();
      if(now>p.hitUntil){
        p.hitUntil=now+180;
        if(state.haptic!==false&&navigator.vibrate) navigator.vibrate(Math.min(55,18+Math.round(-vn*1.4)));
      }
    }else{
      /* รถที่แนบสีข้างกันอยู่แล้วมีแรงต้านจริง ไม่ลื่นผ่านกันเหมือนไม่มีมวล */
      const rub=Math.max(0,1-CAR_RUB_DRAG*dt);
      vx=pvx+c.nx*Math.max(0,vn)+tx*vt*rub;
      vz=pvz+c.nz*Math.max(0,vn)+tz*vt*rub;
    }
  }
  if(hit) spd=Math.hypot(vx,vz);
  return hit;
}
function landFromJump(groundY,groundPitch,validLanding){
  const impact=Math.max(0,-vy);
  py=groundY;vy=0;airborne=false;pitch=clamp(groundPitch||0,-JUMP_MAX_PITCH,JUMP_MAX_PITCH);
  jumpImpact=impact;jumpLandKickT=.28;
  const keep=clamp(1-impact*.006,.90,1);vx*=keep;vz*=keep;spd=Math.hypot(vx,vz);
  if(state.haptic!==false&&navigator.vibrate&&impact>2.2)
    navigator.vibrate(Math.min(90,24+Math.round(impact*4.2)));
  jumpMissed=!validLanding;
  if(!validLanding){activeJump=null;jumpPrevD=-1;}
}
function jumpPhysicsTick(dt,forwardSpeed,preProbe){
  const post=jumpProbe(px,pz,myIdx);
  jumpMissed=false;
  if(airborne){
    vy-=JUMP_GRAVITY*dt;
    py+=vy*dt;
    pitch=lerp(pitch,clamp(Math.atan2(vy,Math.max(7,Math.abs(forwardSpeed))),-JUMP_MAX_PITCH,JUMP_MAX_PITCH),clamp(dt*3.2,0,1));
    const valid=!!(post&&(post.phase==='landing'||post.phase==='exit'||post.phase==='recovery'));
    const groundY=valid?(post.height||0):0;
    if(vy<=0&&py<=groundY){
      landFromJump(groundY,valid?post.pitch:0,valid);
    }else if(py<-1.25){
      landFromJump(0,0,false);
    }
    return jumpMissed;
  }
  /* ข้ามขอบ takeoff ด้วยโมเมนตัมจริง: vy = ความเร็วตามทาง × sin(มุมเนิน), จากนั้นมีแต่ gravity */
  if(preProbe&&preProbe.phase==='rise'&&post&&post.jump===preProbe.jump&&post.phase==='gap'&&forwardSpeed>2){
    const j=preProbe.jump;
    py=j.height;vy=Math.max(0,forwardSpeed*Math.sin(j.launchPitch));
    pitch=j.launchPitch;airborne=true;activeJump=j;jumpPrevD=post.d;
    return false;
  }
  if(post&&post.height!==null){
    const canMount=activeJump===post.jump||post.phase==='entry'||post.height<=py+.48;
    if(canMount){
      activeJump=post.jump;jumpPrevD=post.d;py=post.height;
      pitch=clamp(post.pitch,-JUMP_MAX_PITCH,JUMP_MAX_PITCH);vy=0;
    }else{
      /* เข้าชนด้านข้างเนินสูงแทนการ snap รถทะลุ geometry — ใช้ portal เดิมพากลับอย่างปลอดภัย */
      jumpMissed=true;
    }
  }else{
    py=0;vy=0;pitch=lerp(pitch,0,clamp(dt*7,0,1));
    if(!post){activeJump=null;jumpPrevD=-1;}
  }
  return jumpMissed;
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
  const surf=s.surf,preJump=s.jump;
  if(surf!==surfNow){
    if(surf==='kerb') Snd.kerb();
    surfNow=surf;
  }
  pitLaneNow=(surf==='pit');
  const wasInPit=inPit;
  inPit=pitLaneNow;
  if(inPit&&!wasInPit) lapPitted=true;                 // รอบที่เข้าเลนพิทยังไม่นับ Best Lap
  const sc=surf==='sand'?SURF_SAND:(surf==='runoff'?SURF_RUNOFF:(surf==='pit'?SURF_PIT:(surf==='jump'?{grip:1,drag:.08}:{grip:1,drag:0})));
  drsTick(dt,braking);                                 // 🪽 รอบ 904 (ก่อนคิดแรงต้าน)
  /* แกนรถ */
  const fx=Math.sin(yaw),fz=Math.cos(yaw);
  const nx2=fz,nz2=-fx;
  let vF=vx*fx+vz*fz, vL=vx*nx2+vz*nz2;
  spd=Math.hypot(vx,vz);
  /* แรงตามยาว */
  let aF=0;
  if(thr>0) aF+=Math.min(ACC_CAP,PWR_A/Math.max(spd,6))*thr*(surf==='track'||surf==='jump'?1:sc.grip)*(airborne?.06:1);
  /* ⏪ รอบ 911: เกียร์ถอยหลัง — ยังไหลไปหน้าอยู่ให้หน่วงก่อน แล้วค่อยถอย (เร็วสุด REV_MAX) */
  if(reving) aF-=vF>0.5?BRAKE_A*0.5:REV_A*(surf==='track'||surf==='jump'?1:sc.grip)*(airborne?.08:1);
  if(braking) aF-=(BRAKE_A+BRAKE_DF*spd*spd)
    *Math.sign(vF||1)*(surf==='track'||surf==='jump'?1:sc.grip*0.9)*(airborne?.12:1);
  aF-=DRAG_K*(drsOn?DRS_DRAG_K:1)*spd*spd*Math.sign(vF||0);   // 🪽 DRS เปิด = แรงต้านลด
  aF-=(ROLL_A+sc.drag)*Math.sign(vF||0)*(Math.abs(vF)>0.5?1:Math.abs(vF)*2);
  /* 🛑 รอบ 921: ปล่อยคันเร่ง (ไม่เบรก ไม่ถอย) = หน่วงเพิ่มเองเบา ๆ จนหยุด — ผู้ใช้ขอ "ยกมือออกแล้วค่อย ๆ เบรก"
     คิดหลังแรงต้านอากาศ/ยาง เพื่อให้บวกกันตรง ๆ · ผิวลื่น (ทราย/runoff) หน่วงได้น้อยลงตามกริป เหมือนเบรกจริง */
  const coasting=thr===0&&!braking&&!reving;
  if(coasting&&Math.abs(vF)>COAST_STOP) aF-=COAST_A*Math.sign(vF)*(surf==='track'||surf==='jump'?1:sc.grip)*(airborne?.12:1);
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
  const gripMax=Math.min(GRIP_CAP,(GRIP_BASE+GRIP_DF*spd*spd))*sc.grip*(airborne?.08:1);
  /* 🔄 รอบ 911: ใส่ลบ — แกนจอ: หันหน้า +Z แล้ว "ขวามือ" คือ −X ดังนั้น steer บวก (ปุ่มขวา) ต้องลด yaw
     (ของเดิมกดขวาแล้วรถเลี้ยวซ้าย — กลับด้านทุกมุมกล้องตั้งแต่รอบ 896) */
  let yawRate=Math.abs(vF)>0.4?-(vF*Math.tan(steer)/WB):0;
  if(airborne) yawRate*=.12;                           // กลางอากาศหมุนหัวได้เพียงเล็กน้อย ไม่หักฉับเหมือนยางแตะพื้น
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
  resolvePeerCars(dt);
  /* รอบ 1218: แถบเทา paved runoff ขับได้ถึงขอบนอก; ถ้าข้ามเข้าทรายให้ portal ชนะ barrier */
  const postMoveSurf=surfAt(px,pz,myIdx);
  const crossedRunoffOuter=!airborne&&postMoveSurf.surf==='sand';
  if(!crossedRunoffOuter)barrierBounce();
  const missedJump=jumpPhysicsTick(dt,vF,preJump);
  const terrainRoll=airborne?0:jumpTerrainRoll(px,pz,myIdx);
  bodyRoll=lerp(bodyRoll,terrainRoll,clamp(dt*(Math.abs(terrainRoll)>.001?RAMP_ROLL_RESPONSE:RAMP_ROLL_RETURN),0,1));
  spd=Math.hypot(vx,vz);
  revNow=vF<-0.3;                                      // ⏪ รอบ 911 — ให้ HUD โชว์เกียร์ R
  /* วางรถ */
  carGrp.position.set(px,py,pz);
  carGrp.rotation.y=yaw;
  carGrp.rotation.z=lerp(carGrp.rotation.z,bodyRoll+steer*spd*0.012,clamp(dt*7,0,1)); // เนินยกล้อ + body roll เข้าโค้ง; anti-roll จำกัดที่ 16°
  carGrp.rotation.x=lerp(carGrp.rotation.x,-pitch+(surf==='kerb'?(Math.random()-0.5)*0.03:0),airborne?clamp(dt*5,0,1):.4);
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
  if(!gridFormationActive()&&(missedJump||crossedRunoffOuter)){sandT=OFFTRACK_S;beginPortalReturn();}else sandT=0;
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
    /* 🛞 รอบ 905: รอบที่แวะเลนพิท = ไม่นับสถิติ (กติกาจริง) แต่ยังได้เหรียญครบรอบ */
    if(!lapPitted&&(!lapBest||t<lapBest)){
      lapBest=t;
      if(!state.f1Best||t<state.f1Best){ state.f1Best=t; saveState(); frSubmit(t); }
      /* รอบ 1216: สถิติยังบันทึก/อยู่ใน HUD แต่ไม่ขึ้น BEST LAP กลางจอ เพราะบังถนน */
    }
    if(!lapPitted)ghostKeep(t);
    ghostReset();
    lapPitted=inPit;                                  // ยังอยู่ในเลนพิทตอนข้ามเส้น = รอบใหม่ก็ยังไม่นับ
    const bonus=25;
    addCoins(bonus); sessionCoins+=bonus;
    coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
    /* 🚫 รอบ 1226: ผู้ใช้สั่งไม่ให้มีป้าย LAP/เวลา/เหรียญเด้งกลางจอ เพราะบังเส้นทาง
       ผลรอบทั้งหมดอยู่ใน HUD อยู่แล้ว — คงสถิติ รถเงา และรางวัล แต่ไม่แตะ #f1-ban */
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
  /* มือถือไม่ต้องสะสม particle ที่ลับตา/ซ้อนกันหลายสิบก้อน — gameplay ไม่ได้ใช้ควันคำนวณ */
  const cap=thermalMobile?(thermalLevel?4:8):26;
  if(smokes.length>=cap) return;
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
function setStartLights(on){
  if(lightsEl) lightsEl.classList.toggle('on',!!on);
  /* ไฟสตาร์ทคือ HUD เร่งด่วน: ซ่อน ticker ชั่วคราว ป้องกันสองแผงซ้อนกันบนจอเตี้ย */
  if(boardEl) boardEl.style.visibility=on?'hidden':'';
}
function resetLights(){
  lightPhase='wait'; lightT=0; lightsLit=-1; penaltyT=0; jumped=false;
  goAt=0; reactDone=false; thrPrev=false; heldAtGo=false;
  holdS=LIGHT_HOLD_MIN+Math.random()*(LIGHT_HOLD_MAX-LIGHT_HOLD_MIN);
  paintLights(0);
  setStartLights(true);
  if(lightNoteEl) lightNoteEl.textContent='🚦 รอไฟดับก่อนออกตัว';
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
        setStartLights(false); raceMusicStart();
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
        setStartLights(false); Snd.blip(true); raceMusicStart();
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
  if(!Array.isArray(state[RECENT_KEY])) state[RECENT_KEY]=[];
  const pool=f1VocabForStudent().filter(([en])=>/^[a-z]{2,9}$/i.test(en));
  const picked=f1ChooseVocabWord(pool,state[DONE_KEY],state[RECENT_KEY],Math.random);
  if(picked.resetDone) state[DONE_KEY]=[];
  if(!picked.entry) return;
  const [en,th]=picked.entry;
  state[RECENT_KEY].push(en.toLowerCase());
  state[RECENT_KEY]=state[RECENT_KEY].slice(-F1_RECENT_LIMIT);
  saveState();
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
   🏁 รอบ 1324 — R4 LIVE RACE POSITION (lap + track progress)
   ============================================================ */
function packetRaceLap(d,p){
  const n=Number(d&&d.l);
  return Number.isInteger(n)&&n>=0?n:Math.max(0,(p&&p.raceLap)||0);
}
function packetRaceProgress(d,p){
  const q=Number(d&&d.q);
  if(Number.isFinite(q))return clamp(q,0,TOTAL||q);
  if(!LINE||!TOTAL||!d||typeof d.x!=='number'||typeof d.z!=='number')return Math.max(0,(p&&p.raceProg)||0);
  const hint=p&&Number.isInteger(p.trackIdx)?p.trackIdx:undefined;
  const idx=nearIdx(d.x,d.z,hint);
  if(p)p.trackIdx=idx;
  return ((LINE.cum[idx]-LINE.cum[sfIdx])%TOTAL+TOTAL)%TOTAL;
}
function racePositionSnapshot(){
  const rows=[{uid:startGridUid(),me:true,lap:lapCount,prog:lastProg,slot:gridSlot}];
  for(const uid in peers){
    const p=peers[uid];
    rows.push({uid,me:false,lap:p.raceLap||0,prog:p.raceProg||0,
      slot:Number.isInteger(p.gridSlot)?p.gridSlot:GRID_N});
  }
  if(gridFormationActive())rows.sort((a,b)=>a.slot-b.slot||String(a.uid).localeCompare(String(b.uid)));
  else rows.sort((a,b)=>{
    const as=a.lap*TOTAL+a.prog,bs=b.lap*TOTAL+b.prog;
    return bs-as||String(a.uid).localeCompare(String(b.uid));
  });
  return {position:Math.max(1,rows.findIndex(r=>r.me)+1),total:rows.length,rows};
}
function updateRacePosition(force){
  if(!positionEl)return;
  const snap=racePositionSnapshot(),solo=snap.total===1;
  const sig=snap.position+'/'+snap.total+'/'+(solo?'solo':'live');
  if(!force&&sig===positionSig)return;
  positionSig=sig;
  positionEl.classList.toggle('solo',solo);
  positionEl.innerHTML='<span class="f1-pos-label"><i class="f1-pos-live"></i>'+
    'อันดับสด</span><strong class="f1-pos-current">'+snap.position+
    '</strong><span class="f1-pos-slash">/</span><span class="f1-pos-total">'+snap.total+'</span>';
  positionEl.setAttribute('aria-label','อันดับสด '+snap.position+' จากผู้เล่น '+snap.total+' คน');
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
    onStatus(){ renderBoard(); updateRacePosition(true); },
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
    x:Math.round(px*10)/10, y:Math.round(py*20)/20, z:Math.round(pz*10)/10,
    yaw:Math.round(yaw*100)/100, p:Math.round(pitch*100)/100, av:F1_ROLL_WIRE+(Math.round(bodyRoll*1000)/1000), a:airborne?1:0, w:sessionWords,
    cw:F1_COLOR_WIRE+playerCarStyle.key,
    vx:Math.round(vx*10)/10, vz:Math.round(vz*10)/10,
    vy:Math.round(vy*10)/10,
    d:drsOn?1:0,
    l:lapCount,q:Math.round(lastProg)}; // 🏁 รอบ 1324: อันดับสด = รอบที่จบ + ระยะปัจจุบันบนแทร็ก
  if(myChat&&Date.now()-myChat.ts<CHAT_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  else payload.c=F1_GRID_WIRE+gridSlot;
  room.send(payload,force);
}
function sendChat(text){
  myChat={text:String(text).slice(0,60),ts:Date.now()};
  netSend(true);
  selfMsgEl.textContent='💬 '+myChat.text; selfMsgEl.classList.add('on');
  clearTimeout(selfMsgEl._tm); selfMsgEl._tm=setTimeout(()=>selfMsgEl.classList.remove('on'),CHAT_MS);
  if(typeof sfx!=='undefined') sfx.select();
}
function peerColorIndex(uid,requested){
  if(Number.isInteger(requested)&&requested>=0&&requested<CAR_STYLES.length)return requested;
  let h=0; for(let i=0;i<uid.length;i++) h=(h*31+uid.charCodeAt(i))>>>0;
  return h%PEER_COLORS.length;
}
function packetCarColorIndex(uid,d){
  const direct=d&&d.cl;
  if(Number.isInteger(direct)&&direct>=0&&direct<CAR_STYLES.length)return direct;
  const wire=d&&typeof d.cw==='string'?d.cw:'';
  if(wire.startsWith(F1_COLOR_WIRE)){
    const key=wire.slice(F1_COLOR_WIRE.length),idx=CAR_STYLES.findIndex(s=>s.key===key);
    if(idx>=0)return idx;
  }
  return peerColorIndex(uid);
}
function peerColor(uid,requested){
  return PEER_COLORS[peerColorIndex(uid,requested)];
}
function buildPeer(uid,p){
  if(p.grp){
    removePeerBubble(p);
    const oldCar=p.grp.userData&&p.grp.userData.peerCar3d;
    if(oldCar&&oldCar.userData&&oldCar.userData.disposePeer)oldCar.userData.disposePeer();
    const oldGlow=p.grp.userData&&p.grp.userData.drsGlow;
    if(oldGlow&&oldGlow.material)oldGlow.material.dispose();
    if(p.shadow&&p.shadow.material)p.shadow.material.dispose();
    if(p.nameSprite&&p.nameSprite.material){if(p.nameSprite.material.map)p.nameSprite.material.map.dispose();p.nameSprite.material.dispose();}
    scene.remove(p.grp);
  }
  p.grp=new THREE.Group();
  const col=new THREE.Color(peerColor(uid,p.colorIdx)).getHex();
  /* 🏎️ รอบ 1208: รถเพื่อนต้องเป็นวัตถุ 3D ที่วางบนพื้นและหันตาม yaw จริง
     ภาพ 2.5D เดิมหันเข้าหากล้องตลอด จึงดูเหมือนรถลอย/บิดขวางแทร็กจากมุม cockpit */
  const car=buildPeerF1Car(col);
  p.grp.add(car);p.grp.userData.peerCar3d=car;
  const shadow=new THREE.Mesh(peerF1KitGet().shadow,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.24,depthWrite:false}));
  shadow.scale.set(1,1.85,1);shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;p.grp.add(shadow);
  p.shadow=shadow;
  p.grp.userData.drsGlow=attachDrsGlow(car);
  p.grp.userData.drsFlap=car.userData.drsFlap||null;
  const pg=(typeof gradeOf==='function')?gradeOf(uid,p.g):'';
  const nm=makeTextSprite(p.n,'rgba(16,26,44,.85)','#ffffff','🏎️',pg);
  nm.scale.set(8,2,1); nm.position.y=4.05;
  p.grp.add(nm);
  p.nameSprite=nm;
  p.grade=pg;
  p.grp.position.set(p.cur.x,p.yCur||0,p.cur.z);
  p.grp.rotation.x=-(p.pitchCur||0);
  p.grp.rotation.y=p.yawCur;
  p.grp.rotation.z=p.rollCur||0;
  scene.add(p.grp);
}
function onPeer(uid,d){
  if(typeof onlineKey==='function'&&uid===onlineKey()) return;
  d=d||{};
  if(typeof d.x!=='number'||typeof d.z!=='number') return;
  let p=peers[uid];
  if(!p){
    p=peers[uid]={n:d.n||'เพื่อน',cur:{x:d.x,z:d.z},tgt:{x:d.x,z:d.z},
      yawCur:d.yaw||0,yawTgt:d.yaw||0,vxCur:d.vx||0,vzCur:d.vz||0,
      vxTgt:d.vx||0,vzTgt:d.vz||0,yCur:d.y||0,yTgt:d.y||0,vyCur:d.vy||0,vyTgt:d.vy||0,
      pitchCur:d.p||0,pitchTgt:d.p||0,rollCur:packetBodyRoll(d),rollTgt:packetBodyRoll(d),airborne:!!d.a,w:d.w||0,g:d.g,colorIdx:packetCarColorIndex(uid,d),gridSlot:packetGridSlot(d),lastCt:0,drsTgt:0,drsK:0,hitUntil:0};
    buildPeer(uid,p);
    p.raceLap=0;p.raceProg=packetRaceProgress(d,p);
    renderBoard();
  }
  p.n=d.n||p.n;
  const reportedGrid=packetGridSlot(d);if(reportedGrid!==null)p.gridSlot=reportedGrid;
  const colorIdx=packetCarColorIndex(uid,d);
  if(colorIdx!==p.colorIdx){p.colorIdx=colorIdx;buildPeer(uid,p);}
  p.tgt.x=d.x; p.tgt.z=d.z; p.yawTgt=d.yaw||0;
  if(typeof d.y==='number')p.yTgt=d.y;
  if(typeof d.vy==='number')p.vyTgt=d.vy;
  if(typeof d.p==='number')p.pitchTgt=d.p;
  p.rollTgt=packetBodyRoll(d);
  p.airborne=!!d.a;
  if(typeof d.vx==='number') p.vxTgt=d.vx;
  if(typeof d.vz==='number') p.vzTgt=d.vz;
  p.drsTgt=d.d?1:0;   // 🪽 รอบ 907 — เพื่อนที่ยังไม่อัปเดตโค้ด (d ไม่มีค่า) = ปิดเสมอ ไม่ throw
  p.raceLap=packetRaceLap(d,p);
  p.raceProg=packetRaceProgress(d,p);
  updateRacePosition();
  if((d.w||0)!==p.w){ p.w=d.w||0; renderBoard(); }
  if(d.c&&d.ct&&d.ct!==p.lastCt){
    p.lastCt=d.ct;
    showPeerBubble(p,d.c);
  }
  settleStartGrid(false);
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
  if(p.grp){
    const car=p.grp.userData&&p.grp.userData.peerCar3d;
    if(car&&car.userData&&car.userData.disposePeer) car.userData.disposePeer();
    const gl=p.grp.userData&&p.grp.userData.drsGlow;
    if(gl&&gl.material) gl.material.dispose();
    if(p.shadow&&p.shadow.material) p.shadow.material.dispose();
    if(p.nameSprite&&p.nameSprite.material){
      if(p.nameSprite.material.map) p.nameSprite.material.map.dispose();
      p.nameSprite.material.dispose();
    }
    scene.remove(p.grp);
  }
  delete peers[uid];
  settleStartGrid(false);
  renderBoard();
  updateRacePosition(true);
}
function peerTick(dt){
  const k=clamp(dt*7,0,1);
  for(const uid in peers){
    const p=peers[uid];
    p.cur.x=lerp(p.cur.x,p.tgt.x,k);
    p.cur.z=lerp(p.cur.z,p.tgt.z,k);
    p.vxCur=lerp(p.vxCur||0,p.vxTgt||0,k);
    p.vzCur=lerp(p.vzCur||0,p.vzTgt||0,k);
    p.yCur=lerp(p.yCur||0,p.yTgt||0,k);
    p.vyCur=lerp(p.vyCur||0,p.vyTgt||0,k);
    p.pitchCur=lerp(p.pitchCur||0,p.pitchTgt||0,k);
    p.rollCur=lerp(p.rollCur||0,p.rollTgt||0,k);
    let dy=p.yawTgt-p.yawCur;
    while(dy>Math.PI) dy-=Math.PI*2;
    while(dy<-Math.PI) dy+=Math.PI*2;
    p.yawCur+=dy*k;
    if(p.grp){
      p.grp.position.set(p.cur.x,p.yCur,p.cur.z);
      p.grp.rotation.x=-p.pitchCur;
      p.grp.rotation.y=p.yawCur;
      p.grp.rotation.z=p.rollCur;
    }
    /* 🪽 รอบ 907 — ไล่ระดับไฟท้ายรถเพื่อนแบบเดียวกับของเรา (ไม่ใช่ตัด/เปิดแบบกระตุก) */
    p.drsK=lerp(p.drsK||0,p.drsTgt||0,clamp(dt*9,0,1));
    const gl=p.grp&&p.grp.userData&&p.grp.userData.drsGlow;
    if(gl) gl.material.opacity=p.drsK*0.85;
    const flap=p.grp&&p.grp.userData&&p.grp.userData.drsFlap;
    if(flap) flap.rotation.x=lerp(DRS_FLAP_SHUT,DRS_FLAP_OPEN,p.drsK);
  }
}
function netLeave(){
  if(room){ room.leave(); room=null; }
  for(const uid in peers) dropPeer(uid);
}
/* 🏆 รอบ 1334: แผงอันดับอยู่ในช่องบนระหว่างการ์ดอันดับสดกับกล่องคำศัพท์
   จอแคบที่ช่องนี้ไม่พอจึงค่อยย้ายลงใต้ HUD ด้านบน โดยยังหลบ minimap ทางซ้าย */
function layoutBoard(){
  if(!wrapEl||!positionEl||!wordEl||!boardEl||!boardEl.classList.contains('on')) return;
  const wrap=wrapEl.getBoundingClientRect(),pos=positionEl.getBoundingClientRect();
  const word=wordEl.getBoundingClientRect(),lap=lapEl&&lapEl.getBoundingClientRect();
  if(!wrap.width||!pos.width||!word.width) return;
  const edge=8,gap=8,laneLeft=pos.right-wrap.left+gap,laneRight=word.left-wrap.left-gap;
  const laneWidth=Math.floor(laneRight-laneLeft),minLane=Math.min(120,wrap.width*.18);
  let x,y,width;
  if(laneWidth>=minLane){
    x=laneLeft;
    y=Math.max(edge,pos.top-wrap.top);
    width=Math.min(560,laneWidth);
  }else{
    x=Math.min(wrap.width-edge,pos.right-wrap.left+gap);
    y=Math.max(pos.bottom,word.bottom,lap&&lap.height?lap.bottom:wrap.top)-wrap.top+gap;
    width=Math.max(120,Math.min(560,wrap.width-x-edge));
  }
  boardEl.style.left=Math.round(x)+'px';
  boardEl.style.top=Math.round(y)+'px';
  boardEl.style.width=Math.round(width)+'px';
  const board=boardEl.getBoundingClientRect();
  if(!board.width||!board.height) return;
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
    .concat([me]).sort((a,b)=>b.w-a.w); // แสดงทุกคนในรอบ ห้ามตัดเหลือ 5 คนแบบแผงเดิม
  const sig=note+'|'+rows.map(r=>r.n+':'+r.w+':'+r.g).join('|');
  if(sig===boardSig){ boardEl.classList.add('on'); layoutBoard(); return; }
  boardSig=sig;
  /* statusText อาจมี <br> และปุ่มเพื่อน: แยกปุ่มตรึงท้ายแถบ ให้เฉพาะรายงานผู้เล่นเลื่อน */
  const noteBox=document.createElement('div'); noteBox.innerHTML=note||'';
  const go=noteBox.querySelector('.nr-go'),goHtml=go?go.outerHTML:'';
  if(go) go.remove();
  const status=noteBox.textContent.replace(/\s+/g,' ').trim();
  const playerHtml=rows.map((r,i)=>{
    const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'.';
    const grade=(typeof gradeMark==='function')?gradeMark(r.g):'';
    return `<span class="${r.me?'m-bd-me':''}">${medal} 🏎️ ${escapeHTML(r.n)}${grade} · ${r.w} คำ</span>`;
  }).join('　•　');
  const report=playerHtml+(status?`　•　<span>🏁 ${escapeHTML(status)}</span>`:'');
  const plain=rows.map((r,i)=>(i+1)+'. '+r.n+' '+r.w+' คำ').join(', ')+(status?' '+status:'');
  boardEl.style.setProperty('--f1-ticker-s',clamp(Math.round(plain.length/7),14,48)+'s');
  boardEl.setAttribute('aria-label','ผู้เล่นในรอบนี้: '+plain);
  boardEl.innerHTML='<span class="m-bd-icon" aria-hidden="true">🏆</span>'+
    `<div class="m-bd-window"><div class="m-bd-track"><span class="m-bd-text">${report}</span></div></div>`+goHtml;
  boardEl.classList.add('on');
  layoutBoard();
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
  camInit=false;
  if(fp) layoutWheel();   // 🎡 รอบ 913 — ตอนซ่อนอยู่วัดขนาดไม่ได้ (0×0) ต้องวัดใหม่ทุกครั้งที่กลับมามุมคนขับ
}
/* 🎡 รอบ 913: วาง <img> พวงมาลัยให้ทับ "กรอบภาพจริง" ของ background-image ใน #f1-cockpit เป๊ะ
   — อ่าน background-size/position ที่เบราว์เซอร์คำนวณแล้วมาใช้ตรง ๆ จึงเปลี่ยนตาม @media เองโดยไม่ต้องเขียนสูตรซ้ำ
   (ทับพอดี = จุดหมุน WHEEL_HUB_* ซึ่งเป็น % ของภาพ ตรงกับแกนพวงมาลัยจริงทุกขนาดจอ) */
function cockpitBox(){
  if(!cockpitEl) return null;
  const bw=cockpitEl.clientWidth, bh=cockpitEl.clientHeight;
  const iw=QUALITY_PLATE_W, ih=QUALITY_PLATE_H;
  if(!bw||!bh) return null;
  /* รถสีใหม่ทุกโหมดใช้ plate 1672×941 และตรึงขอบล่างแบบเดียวกัน */
  const w=bw,h=bw*ih/iw;
  return {w,h,left:0,top:bh+bh*.01-h,sy:1};
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
  if(camMode!=='cockpit') return;
  const deg=clamp(steer*(180/Math.PI)*WHEEL_RATIO,-WHEEL_MAX_DEG,WHEEL_MAX_DEG);
  const shakeAmp=surfNow==='kerb'?WHEEL_SHAKE_KERB_PX:(surfNow==='sand'?WHEEL_SHAKE_SAND_PX:0);
  const shaking=shakeAmp>0;
  if(!shaking&&!wheelShakeOn&&wheelDeg!==null&&Math.abs(deg-wheelDeg)<0.05) return;
  wheelShakeOn=shaking;
  wheelDeg=deg;
  const quality=true; // cockpit WebP รุ่นใหม่ใช้เฟรมมือซ้าย/กลาง/ขวาในทุก graphics mode
  const handDeg=clamp(deg,-QUALITY_HAND_MAX_DEG,QUALITY_HAND_MAX_DEG);
  let sx=0, sy2=0;
  if(shaking){
    const a=shakeAmp*clamp(spd/SHAKE_SPD_REF,0,1);
    sx=Math.sin(shakeT*Math.PI*2*SHAKE_HZ)*a;
    sy2=Math.sin(shakeT*Math.PI*2*SHAKE_HZ*1.7+1.3)*a*0.6;
  }
  const r=(shaking?'translate('+sx.toFixed(2)+'px,'+sy2.toFixed(2)+'px) ':'')+'rotate('+deg.toFixed(2)+'deg)';
  const tr=Math.abs(wheelSy-1)<0.01?r
    :'scaleY('+wheelSy.toFixed(4)+') '+r+' scaleY('+(1/wheelSy).toFixed(4)+')';
  if(wheelEl) wheelEl.style.transform=tr;
  if(cockpitTurnEl){
    if(quality&&Math.abs(handDeg)>.05){
      const src=cockpitAsset(handDeg<0?'left':'right');
      if(src!==cockpitTurnSrc){cockpitTurnSrc=src;cockpitTurnEl.src=src;}
      cockpitTurnEl.style.opacity=String(clamp(Math.abs(handDeg)/QUALITY_HAND_MAX_DEG,0,1));
    }else cockpitTurnEl.style.opacity='0';
  }
  if(knobEl) knobEl.style.setProperty('--ctl-turn',(deg*1.25).toFixed(2)+'deg');
  if(ledsEl) ledsEl.style.transform=wheelEl.style.transform;   // 🚥 รอบ 918 — ดวงไฟหมุนไปกับพวงมาลัย
  if(dashEl){
    if(quality) positionQualityDash(handDeg,sx,sy2);
    else dashEl.style.transform=tr;
  }
}
/* ============================================================
   🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
   ภาพ wheel.webp มีจอ LCD + แถบไฟรอบเครื่องวาดตายตัวมาในตัว (เกียร์ 5 / เลข 12210 / แถบส้ม)
   → ปู <canvas> ขนาดเท่า "กรอบจอ" (DASH_PX) ทับ แล้ววาดเกียร์/ความเร็ว/รอบเครื่องจากค่าจริงในเกม
   หมุน+สั่นไปพร้อมพวงมาลัยเพราะใช้ transform และแกนหมุนชุดเดียวกัน (ดู wheelTick)
   ============================================================ */
const DASH_FONT="'Kanit','Segoe UI',sans-serif";
let qualityDashBox=null;
function positionQualityDash(handDeg,shakeX=0,shakeY=0){
  if(!dashEl||!qualityDashBox) return;
  const b=qualityDashBox, center=QUALITY_DASH_POSE.center;
  const t=clamp(Math.abs(handDeg)/QUALITY_HAND_MAX_DEG,0,1);
  const edge=handDeg<0?QUALITY_DASH_POSE.left:QUALITY_DASH_POSE.right;
  const p={
    cx:lerp(center.cx,edge.cx,t),cy:lerp(center.cy,edge.cy,t),
    w:lerp(center.w,edge.w,t),h:lerp(center.h,edge.h,t),deg:lerp(0,edge.deg,t)
  };
  const sx=b.w/QUALITY_PLATE_W,sy=b.h/QUALITY_PLATE_H,w=p.w*sx*QUALITY_DASH_SCALE,h=p.h*sy*QUALITY_DASH_SCALE;
  dashEl.style.width=w+'px'; dashEl.style.height=h+'px';
  dashEl.style.left=(b.left+p.cx*sx-w/2)+'px';
  dashEl.style.top=(b.top+p.cy*sy-h/2)+'px';
  dashEl.style.transformOrigin='50% 50%';
  dashEl.style.transform=(shakeX||shakeY?'translate('+shakeX.toFixed(2)+'px,'+shakeY.toFixed(2)+'px) ':'')+'rotate('+p.deg.toFixed(2)+'deg)';
}
function layoutDash(b){
  if(!dashEl||!dashCtx) return;
  qualityDashBox=b;
  positionQualityDash(0);
  const w=QUALITY_DASH_POSE.center.w*b.w/QUALITY_PLATE_W*QUALITY_DASH_SCALE;
  const k=Math.min(2.5,Math.max(1.5,window.devicePixelRatio||1))*w/DASH_PX.w;  // วาดละเอียดกว่าจอจริง 1.5 เท่าเป็นอย่างน้อย = ตัวเลขคมไม่ฟุ้ง
  const cw=Math.max(1,Math.round(DASH_PX.w*k)),ch=Math.max(1,Math.round(DASH_PX.h*k));
  if(dashEl.width!==cw||dashEl.height!==ch){dashEl.width=cw;dashEl.height=ch;}
  dashK=k;dashSig='';
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
  let landingOy=0;
  if(jumpLandKickT>0){
    const t=1-jumpLandKickT/.28;
    landingOy=-Math.sin(clamp(t,0,1)*Math.PI)*clamp(jumpImpact/14,0,1)*.16;
    jumpLandKickT=Math.max(0,jumpLandKickT-dt);
  }
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
    camera.position.set(px+fx*fwd+ox,py+eyeH+oy+landingOy,pz+fz*fwd+oz);
    camera.lookAt(px+fx*(fwd+look)+ox,py+eyeH-dropH+Math.sin(pitch)*look+oy+landingOy,pz+fz*(fwd+look)+oz);
    camera.rotateZ(bodyRoll*.52); // cockpit รับรู้ว่าล้อข้างหนึ่งขึ้นเนิน แต่ลดครึ่งหนึ่งกันเวียนหัว
    const fov=fovBase+clamp(spd/92,0,1)*(realistic?8:12);
    if(Math.abs(camera.fov-fov)>0.2){ camera.fov=fov; camera.updateProjectionMatrix(); }
    return;
  }
  const dist=9.5+spd*0.075, h=py+3.4+spd*0.012+landingOy;
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
  camera.lookAt(px+Math.sin(yaw)*lookAhead,py+1.1+Math.sin(pitch)*lookAhead*.35,pz+Math.cos(yaw)*lookAhead);
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
  updateRacePosition();
  drsHud();
}
let mapAt=0, relocAt=0;
function applyThermalPixelRatio(){
  if(!renderer) return;
  const k=thermalLevel>=2?0.72:(thermalLevel===1?0.86:1);
  const next=thermalMobile?Math.max(.9,thermalBasePR*k):thermalBasePR;
  if(Math.abs(renderer.getPixelRatio()-next)>.02) renderer.setPixelRatio(next);
}
function thermalGovernorTick(dt){
  if(!thermalMobile) return;
  thermalAvgMs=lerp(thermalAvgMs,dt*1000,.035);
  const moving=spd>.8||padThr>.02||padBr||kThr||kBack||portalActive;
  if(moving&&thermalAvgMs>25){thermalSlowT+=dt;thermalCoolT=0;}else if(thermalAvgMs<20){thermalCoolT+=dt;thermalSlowT=Math.max(0,thermalSlowT-dt*.5);}
  else{thermalSlowT=Math.max(0,thermalSlowT-dt*.15);thermalCoolT=0;}
  let next=thermalLevel;
  if(thermalSlowT>7&&thermalAvgMs>31) next=2;
  else if(thermalSlowT>3) next=Math.max(next,1);
  else if(thermalCoolT>12) next=Math.max(0,next-1);
  if(next!==thermalLevel){thermalLevel=next;thermalSlowT=0;thermalCoolT=0;applyThermalPixelRatio();}
}
function thermalRenderDue(now){
  if(!thermalMobile){thermalTargetFps=60;thermalRendered++;return true;}
  const important=portalActive||slide>.34;
  const active=important||spd>.8||padThr>.02||padBr||kThr||kBack;
  thermalTargetFps=important?45:(active?(thermalLevel>=2?30:(thermalLevel===1?36:45)):20);
  const interval=1000/thermalTargetFps;
  if(thermalRenderAt&&now-thermalRenderAt<interval-.5){thermalSkipped++;return false;}
  /* เดิน deadline ต่อด้วย interval แทนตั้งเป็น now ทุกครั้ง: ได้ pattern 45/36/30 FPS บนจอ 60Hz จริง */
  thermalRenderAt=thermalRenderAt?Math.max(now-interval,thermalRenderAt+interval):now;thermalRendered++;return true;
}
function frame(dt,now){
  thermalGovernorTick(dt);
  const visualDue=thermalRenderDue(now);
  lightsTick(dt);          // 🚦 รอบ 902 — ต้องมาก่อน physTick (ล็อกคันเร่งจนไฟดับ)
  peerTick(dt);            // 🏎️💥 รอบ 1208 — อัปเดตรถเพื่อนก่อนแก้การชน ให้ภาพ/ฟิสิกส์ใช้ตำแหน่งเฟรมเดียวกัน
  physTick(dt);
  ghostTick(dt);           // 👻 รอบ 902
  collectTick();
  smokeTick(dt);
  camTick(dt);
  if(visualDue){
    wheelTick();           // 🎡 รอบ 913 — พวงมาลัยหมุนตาม steer
    dashTick(dt);          // 🔢 จอ canvas วาดเฉพาะเฟรมที่จะขึ้นจอ ลด CPU/GPU upload ตอน idle
    ledTick(dt);
    hudTick();
  }
  if(room)room.tick(now);    // 🏟️ รอบ 1224: retry/verify/ตามหาเพื่อน/กวาดผี ต้องเดินเหมือนโลก 3D อื่น
  netSend(false);
  if(visualDue&&now-mapAt>100){ mapAt=now; drawMap(); }
  if(now-relocAt>3000){ relocAt=now; relocTick(); }
  if(visualDue) renderer.render(scene,camera);
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
  layoutBoard();   // 📱 รอบ 1217 — หมุนจอแล้วยังต้องอยู่ถัด HUD โดยไม่ซ้อนกลับมา
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
  if(camMode==='cockpit'&&cockpitEl) requestAnimationFrame(layoutWheel);
  const tierCap=realisticTier==='low'?1.35:(realisticTier==='medium'?1.65:Number(r.pixelRatioCap)||2.35);
  thermalMobile=isThermalMobile();
  thermalBasePR=Math.min(devicePixelRatio||1,realistic?tierCap:(Number(r.pixelRatioCap)||2),thermalMobile?(realistic?1.25:1.35):99);
  thermalLevel=0;thermalAvgMs=16.7;thermalSlowT=thermalCoolT=0;applyThermalPixelRatio();
  if(typeof THREE.NoToneMapping!=='undefined'&&typeof THREE.ACESFilmicToneMapping!=='undefined')
    renderer.toneMapping=r.toneMapping==='aces'?THREE.ACESFilmicToneMapping:THREE.NoToneMapping;
  if(Number.isFinite(r.exposure)) renderer.toneMappingExposure=r.exposure;
  const backgroundColor=Number.isFinite(e.background)?e.background:0x0d1430;
  if(realistic)useRacingSky();
  else scene.background=new THREE.Color(backgroundColor);
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
    envLights.warm.visible=!thermalMobile; // มือถือใช้ hemisphere+key ก็พอ ตัด directional-light evaluation รองทุก fragment
  }
}
function start(options){
  if(running) return;
  if(!built) build();
  options=options||{};
  paintPlayerStyle(storedCarStyle().key);
  applyEnvironmentProfile(options.environmentProfile,options.graphicsMode);
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  thermalRenderAt=0;thermalRendered=0;thermalSkipped=0;
  wrapEl.classList.add('on');
  introEl.style.display='none';
  garageEl.classList.add('on');
  exitBox.classList.remove('on');
  frMount();
  sessionCoins=0; sessionWords=0;
  coinsEl.textContent='🪙 +0';
  myChat=null; boardSig='';positionSig='';
  boardEl.classList.remove('on'); boardEl.innerHTML='';
  updateRacePosition(true);
  chatBarEl.classList.remove('on'); selfMsgEl.classList.remove('on');
  /* เกิดบนกริด F1 แบบเหลื่อม: slot 0 ก่อน แล้ว roster multiplayer จัดเรียง UID ให้ไม่ซ้ำ */
  gridSlot=0;gridRosterSig='';
  pitch=bodyRoll=0;vx=vy=vz=spd=0;steer=0;slide=0;steerCtl=0;padThr=0;padBr=false;
  airborne=false;activeJump=null;jumpPrevD=-1;jumpImpact=0;jumpLandKickT=0;jumpMissed=false;
  padRev=false; revNow=false; sandT=0; portalActive=false; portalT=0; portalJumped=false;portalResumeSpeed=0;
  if(portalEl) portalEl.className='';   // ⏪🏜️🌀
  kL=kR=kThr=kBack=false;
  placeAtGridSlot(0);surfNow='track';
  drsOn=false; drsInZone=false; drsGap=0; drsFlapK=0; drsBrake=false;                // 🪽 รอบ 904
  if(drsEl){ drsEl.className=''; drsEl.innerHTML=''; }
  lapStartAt=0; lapNow=0; lapBest=0; lapCount=0; cpFlags=[false,false,false]; lastProg=0;
  camInit=false; camYaw=yaw;
  camMode='cockpit'; applyCamMode();   // 🪖 รอบ 901 — เข้าสนามเริ่มที่มุมคนขับเสมอ (ภาพหลัก)
  inPit=false; pitLaneNow=false; pitLimited=false; lapPitted=false;
  resetLights();            // 🚦 รอบ 902 — ตั้งลำดับไฟใหม่ทุกครั้งที่เข้าสนาม
  ghostLoad(); ghostReset(); ghostHide();
  const steerBox=wrapEl.querySelector('#f1-steer');
  if(steerBox&&steerBox._f1Reset)steerBox._f1Reset();
  netJoin();
  settleStartGrid(true);
  fit();
  pickWord();
  if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
  /* ค่าเริ่มต้นทุก session = เปิด แต่เตรียมเพียง metadata; play จริงเมื่อไฟดับและรถปลดล็อก */
  raceMusicEnabled=true; raceBgmBlocked=false;
  raceMusicEnsure(); raceMusicStop(0,true); raceMusicSyncButton();
  keydownFn=e=>{
    if(e.repeat) return;
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kL=true;
    else if(k==='d'||k==='arrowright') kR=true;
    else if(k==='w'||k==='arrowup'||k===' '){
      if(garageEl.classList.contains('on'))return;
      kThr=true; Snd.start();
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
  running=true;
  lastT=performance.now();
  rafId=requestAnimationFrame(tick);
}
function exitWorld(){
  running=false;
  raceMusicStop(RACE_BGM_EXIT_FADE_MS,true,()=>{
    if(!running&&typeof Music!=='undefined'&&Music.resumeBg)Music.resumeBg();
  });
  netLeave();
  cancelAnimationFrame(rafId);
  window.removeEventListener('keydown',keydownFn);
  window.removeEventListener('keyup',keyupFn);
  window.removeEventListener('resize',resizeFn);
  Snd.stop();
  portalActive=false; portalT=0; portalJumped=false;portalResumeSpeed=0;
  py=0;vy=0;pitch=bodyRoll=0;airborne=false;activeJump=null;jumpPrevD=-1;
  if(portalEl) portalEl.className='';
  letters.forEach(l=>scene.remove(l.spr)); letters=[]; word=null;
  smokes.forEach(s=>scene.remove(s.m)); smokes=[];
  ghostHide(); paintLights(0);
  setStartLights(false);
  if(renderer) renderer.setSize(2,2,false);
  wrapEl.classList.remove('on');
  if(garageEl)garageEl.classList.remove('on');
  exitBox.classList.remove('on');
  saveState();
  if(typeof renderDashboard==='function') renderDashboard();
  if(sessionWords>0||sessionCoins>0)
    toast(`🏎️ กลับจาก Vocab World Racing — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.F1World={
  start,
  _t:{
    get running(){return running}, set running(v){running=v},
    get pos(){return {x:px,y:py,z:pz,yaw,pitch,roll:bodyRoll,spd,vx,vy,vz,airborne,slide,surf:surfNow}},
    set pos(v){ if('x'in v)px=v.x; if('z'in v)pz=v.z; if('yaw'in v)yaw=v.yaw;
      if('y'in v)py=v.y;if('pitch'in v)pitch=v.pitch;if('vy'in v)vy=v.vy;
      if('airborne'in v)airborne=!!v.airborne;
      if('spd'in v){ vx=Math.sin(yaw)*v.spd; vz=Math.cos(yaw)*v.spd;spd=Math.abs(v.spd); } },
    set input(v){ if('steer'in v)steerCtl=v.steer; if('thr'in v)padThr=v.thr; if('br'in v)padBr=!!v.br; },
    get line(){return LINE}, get total(){return TOTAL}, get sfIdx(){return sfIdx},
    get lap(){return {now:lapNow,best:lapBest,count:lapCount,cp:cpFlags.slice(),startAt:lapStartAt}},
    get letters(){return letters},
    get carVisual(){return {kind:carGrp&&carGrp.userData.modelKind||'unknown',style:playerCarStyle.key,
      cockpit:cockpitAsset('center'),loading:false}},
    get racePosition(){return racePositionSnapshot()},
    get raceMusic(){return {url:RACE_BGM_URL,preload:raceBgm?raceBgm.preload:null,loop:raceBgm?raceBgm.loop:null,
      paused:raceBgm?raceBgm.paused:true,volume:raceBgm?raceBgm.volume:0,enabled:raceMusicPreferenceOn(),blocked:raceBgmBlocked}},
    raceMusicStart,raceMusicStop,raceMusicToggle,
    /* 👥 รอบ 939 — เทสต์ปุ่ม "ไปหาเพื่อน" บนกระดาน (ยัด room ปลอมได้โดยไม่ต้องต่อ Firebase จริง) */
    get room(){return room}, set room(v){room=v}, renderBoard,
    /* 🏎️ รอบ 1208 — hook สำหรับยืนยันรถเพื่อน 3D จากมุม cockpit โดยไม่แตะ Firebase */
    get peers(){return peers}, onPeer, peerTick,
    carContact, resolvePeerCars,
    give(){ letters.slice().forEach(l=>{ word.got.push(l.idx); scene.remove(l.spr); }); letters=[]; completeWord(); },
    surfAt, nearIdx, trackPointAhead, pickWord, collectTick, physTick, barrierBounce,jumpWheelGround,jumpTerrainRoll,
    jumpProbe,jumpPhysicsTick,
    get jumps(){return JUMPS.map(j=>({id:j.id,label:j.label,color:j.color,side:j.side,lat:j.lat,startIdx:j.startIdx,
      maxCurvature:j.maxCurvature,entryM:j.entryM,riseM:j.riseM,gapM:j.gapM,landM:j.landM,
      takeoffD:j.takeoffD,landStartD:j.landStartD,landEndD:j.landEndD,endD:j.endD,recoverD:j.recoverD,
      height:j.height,landH:j.landH,launchPitch:j.launchPitch,
      start:jumpPose(j,0,j.lat,0),takeoff:jumpPose(j,j.takeoffD,j.lat,j.height),
      landing:jumpPose(j,j.landStartD,j.lat,j.landH)}));},
    placeOnJump(id,d,speed,latOffset=0){const j=JUMPS.find(q=>q.id===id)||JUMPS[0];if(!j)return null;
      d=clamp(Number(d)||0,0,j.recoverD);const h=jumpHeightAtD(j,d),p=jumpPose(j,d,j.lat+(Number(latOffset)||0),h||0);
      px=p.x;py=h||0;pz=p.z;yaw=p.yaw;pitch=jumpPitchAtD(j,d);vy=0;airborne=false;activeJump=j;jumpPrevD=d;myIdx=p.i;
      bodyRoll=jumpTerrainRoll(px,pz,myIdx);if(carGrp){carGrp.position.set(px,py,pz);carGrp.rotation.set(-pitch,yaw,bodyRoll);}
      vx=Math.sin(yaw)*(Number(speed)||0);vz=Math.cos(yaw)*(Number(speed)||0);spd=Math.abs(Number(speed)||0);myIdx=p.i;camInit=false;
      return {x:px,y:py,z:pz,yaw,pitch,roll:bodyRoll,spd};},
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
    /* 🎨 รอบ 1216 — สีรถ/cockpit/packet ต้องอ้าง style เดียวกัน */
    get carStyle(){return {key:playerCarStyle.key,label:playerCarStyle.label,hex:playerCarStyle.hex,
      index:CAR_STYLES.indexOf(playerCarStyle),center:cockpitAsset('center'),left:cockpitAsset('left'),right:cockpitAsset('right')};},
    paintPlayerStyle, cockpitAsset, peerColor, packetCarColorIndex,
    get startGrid(){return {slot:gridSlot,pose:LINE?gridPose(gridSlot):null,uids:startGridUids(),formation:gridFormationActive(),
      peers:Object.fromEntries(Object.entries(peers).map(([uid,p])=>[uid,p.gridSlot]))};},
    gridPose,startGridSlotFor,gridSlotClear,safeStartGridSlot,settleStartGrid,packetGridSlot,
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
    get portal(){return {active:portalActive,t:portalT,jumped:portalJumped,target:portalTargetIdx,resumeSpeed:portalResumeSpeed,
      cls:portalEl?portalEl.className:''};},
    get thermal(){return {mobile:thermalMobile,level:thermalLevel,avgMs:thermalAvgMs,targetFps:thermalTargetFps,
      pixelRatio:renderer?renderer.getPixelRatio():0,rendered:thermalRendered,skipped:thermalSkipped,
      smokeCap:thermalMobile?(thermalLevel?4:8):26};},
    setThermal(v){v=v||{};if('mobile'in v)thermalMobile=!!v.mobile;if('level'in v)thermalLevel=clamp(v.level|0,0,2);
      thermalRenderAt=0;thermalRendered=thermalSkipped=0;applyThermalPixelRatio();},
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
        stats:realisticStats?Object.assign({},realisticStats):null},fantasy:{
        built:!!fantasyRoot,visible:!!(fantasyRoot&&fantasyRoot.visible),stats:fantasyStats?Object.assign({},fantasyStats):null}}},
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
