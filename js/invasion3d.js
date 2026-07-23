/* 🛸 invasion3d.js — โลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
   FPS สไตล์ Delta Force ในเมืองทะเลทรายตะวันออกกลาง — ยานแม่ลำมหึมาลอยเต็มท้องฟ้า (สไตล์ ID4)
   บนท้องยานแม่มีช่องตัวอักษรเรียงเป็น "คำศัพท์ 1 คำ" ขนาดใหญ่ · ยานลูก = จำนวนตัวอักษรของคำ
   ยิงยานลูกตกทีละลำ → ตัวอักษรประจำลำนั้นบนยานแม่กะพริบ · ครบทุกลำ → ตัวอักษรกะพริบทั้งแถว
   → เกราะยานแม่เปิด ระดมยิง/มิสไซล์ใส่จนระเบิด = ครบ 1 คำ 🪙INV_REWARD
   👥 พันธมิตร AI: หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์ ช่วยยิงอย่างเมามันส์
   🧩 โมเดลจริง (ถ้าผู้ใช้วางไฟล์ไว้ จะสลับใช้อัตโนมัติ ไม่ต้องแก้โค้ด):
      img/models/mothership.glb · img/models/alien_fighter.glb · img/models/gun_rifle.glb
      img/invasion/sky.png (ท้องฟ้า 360°) · img/invasion/sand.png · img/invasion/wall.png
   โหลดขี้เกียจผ่าน enterInvasion3D (ui.js) — ไม่แตะ adventure3d.js */
(function(){
'use strict';

/* ============================================================
   ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
   ============================================================ */
const REWARD=60, LETTER_COIN=5, DONE_KEY='invasionDone';
const WORLD=420;                       // ครึ่งความกว้างแผนที่ทะเลทราย
const EYE=1.7, WALK=7.5, RUN=11.5;     // ความสูงตา · เดิน · วิ่ง (Shift)
const FOV=68;                          // 🎯 รอบ 416: แคบลงจาก 74 → ภาพอัดแน่นเหมือนภาพอ้างอิง (ปืนดูใหญ่ ระยะดูบีบ)
const LOOK_SENS=0.0026, PAD_SENS=0.0042;
const PITCH_MIN=-0.55, PITCH_MAX=1.35; // เงยได้สูงมาก (ต้องเงยดูยานแม่)

/* 🛸 ยานแม่ — รอบ 417 (ผู้ใช้สั่ง): ขยาย 5 เท่า ใหญ่จนคลุมฟ้าทั้งผืนแบบ Independence Day
   ⚠️ กฎเหล็กของ 3 ค่านี้ (เคยพลาดมาแล้วทั้งคู่):
     · MS_Y ต้อง > MS_R*0.42 + เผื่อ ไม่งั้น "ท้องยาน+หนามจมทะลุพื้น"
     · ยานใหญ่ขนาดนี้ผู้เล่นจะอยู่ "ใต้ทรงกลมกันชน" ของมัน → เล็งยิงตัวลำไม่ได้
       จึงต้องมี "แกนพลังงาน" (msCore) เป็นจุดอ่อนแยกต่างหาก ดู CORE_* ด้านล่าง
     · หมอกฉากไกลแค่ ~650m แต่ยานอยู่ ~1,700m → ตั้ง fog:false ที่ตัวลำ ไม่งั้นยานหายกลืนไปกับฟ้า */
/* 📏 รอบ 432 (ผู้ใช้: "ตั้งอยู่นั่นคืออะไร ไม่เหมือนที่ออกแบบไว้เลย"):
   รอบ 417 ขยายลำเป็น 5,600 ม. แล้ววางห่างแค่ ~2,200 ม. → ลำกินมุมมองเกิน 100° เห็นได้แค่ "เสี้ยวเดียว"
   เป็นแถบดำทแยงจอ จำทรงยานที่ผู้ใช้ออกแบบไม่ได้เลย
   ⚖️ กฎใหม่: ต้องให้ "ความกว้างลำ ÷ ระยะห่างจากจุดเกิด" ≤ ~0.85 (ราว 45–50° ของ FOV 68°)
      = เห็นทรงเต็มลำในเฟรมเดียว แต่ยังมหึมา (1,800 ม. = ยาวกว่าสนามบิน 10 เท่า) */
/* 🔻 รอบ 435 (ผู้ใช้: "ไม่เห็นรายละเอียดของยานแม่เลย อยู่ให้ต่ำกว่านี้"):
   ลดทั้งขนาดและ "ระยะ+ความสูง" พร้อมกัน — ลำเล็กลงแต่เข้ามาใกล้ขึ้นครึ่งหนึ่ง = พื้นผิว/ลวดลายบนลำชัดขึ้นมาก
   ⚠️ ข้อจำกัดที่ต้องรักษาไว้: ท้องลำ (MS_Y − MS_R*0.30) ต้อง "สูงกว่าแกนพลังงาน" (CORE_Y=210)
      ไม่งั้นลำแสงยึดแกนจะกลับหัว/ทะลุลำ */
/* 🔻🔻 รอบ 437 (ผู้ใช้: "ยานแม่อยู่ไหนล่ะ ให้บินลงมาต่ำ เห็นชัดๆ ลำใหญ่ๆ"):
   รอบ 435 ยังลอยสูง 430 ม. ห่าง 1,150 ม. → ตัวลำอยู่ "เหนือกรอบภาพ" ตอนมองตรง ต้องแหงนหาถึงจะเจอ
   คราวนี้ลงมาเตี้ยและใกล้มาก: อยู่ในแนวสายตาปกติเลย (มุมเงยพอๆ กับ pitch เริ่มต้น 17°) */
/* 📏 รอบ 441 (ผู้ใช้: "ขยายยานแม่ให้ยาวพอๆ กับสี่เหลี่ยมนี้"): ลำกว้าง 1,040 ม.
   = กินจอกว้างพอๆ กับแผ่นตัวอักษรที่เพิ่งเอาออก (ลำจริงยาวกว่าสนามบินหลายเท่า คลุมฟ้าแบบ ID4) */
const MS_Y=360, MS_Z=-260, MS_R=520;      // ความสูงลอย · ระยะหน้า · รัศมีลำ (437: 240/-260/320)
/* ⚠️ ข้อจำกัดตอนตั้งค่า 3 ตัวนี้ (เจอมาแล้วทั้งหมด):
     · ปลายหนามใต้ท้อง ≈ MS_Y − MS_R*0.30 − MS_R*0.20 ต้องสูงกว่ายอดเนินสูงสุด (~49 ม.) ไม่งั้นเนินทะลุลำ
     · ความกว้างลำ (MS_R*2) ÷ ระยะจากจุดเกิด ≈ 1.3 → กินจอเกินครึ่ง = "ลำใหญ่คลุมฟ้า" ตามที่ผู้ใช้ต้องการ
     · เงยจากจุดเกิดถึงกลางลำ ~28° (pitch เริ่มต้น 17°) → เห็นท้องลำเต็มๆ ตั้งแต่ยังไม่แหงนหน้า */
const MS_HP=100;                          // พลังเกราะยานแม่ (นับเป็น %)
const MS_DMG_GUN=0.55, MS_DMG_MISSILE=7;
/* 🔠 แผงตัวอักษร + แกนพลังงาน — "แยกขนาดจากตัวลำ" เพราะถ้าผูกกับ MS_R ตัวอักษรจะโตตาม 5 เท่าจนล้นจอ
   ค่าพวกนี้เลือกจากมุมมองจริง: ยืนที่ z≈176 เงย ~17° แล้วเห็นแถวตัวอักษรกลางจอพอดี อ่านออกชัด */
/* 🪟 รอบ 477: ย้ายแถวตัวอักษรจาก "ห้อยใต้ท้องยาน" (y 150) ขึ้นไปแนบ "ลำหน้า" ให้อ่านเป็นหน้าต่างของยาน
   ลำจริง (โมเดล) สูง 338 ม. หนา 304 ม. → หน้าลำอยู่ราว z −108 · ท้องลำ y ≈ 191 · กลางลำ y ≈ 360 */
/* ⚠️ เพดานความสูง: ยกเกิน ~210 แถวหน้าต่างจะไปมุดใต้ "แผงคำ HUD" (#inv-word) กลางจอบน
   จอเตี้ย 812×375 คือกรณีคับสุด (ขอบล่างแผง 66px) — 198 เหลือช่องว่าง ~8px */
const BOARD_Y=198, BOARD_Z=-100, BOARD_CELL=42;   // ความสูง · ระยะ · ขนาดช่องต่อ 1 บานหน้าต่าง
/* 🎯 รอบ 437: ย้ายแกนพลังงานไป "ห้อยใต้จมูกยานแม่" (เดิมลอยแยกคนละมุมฟ้ากับลำ เด็กงงว่าอะไรคืออะไร) */
const CORE_Y=150, CORE_Z=-170, CORE_R=45;         // แกนพลังงาน (จุดที่ยิงโดน) — ใต้จมูกลำ มองเห็นพร้อมกัน

/* 👾 ยานลูก */
const F_HP=3, F_SPEED=17, F_Y_MIN=26, F_Y_MAX=80, F_R=190;   // 441: เพดานบินต่ำลงนิด กันชนหนามใต้ท้องยานที่ใหญ่ขึ้น
const FIGHTER_SIZE=11.5;               // 📏 รอบ 432: ขนาดยานลูก = เท่าเฮลิคอปเตอร์ (เดิม 7 ม. เล็กจนมองไม่เห็น)
const F_SHOT_GAP=2600, F_SHOT_SPD=52, F_SHOT_DMG=9;
const MS_BEAM_GAP=5200, MS_BEAM_DMG=14;   // ยานแม่ยิงลำแสงหนักเป็นระยะ

/* 🔫 อาวุธผู้เล่น */
const GUN_GAP=95, GUN_DMG=1, GUN_SPREAD=0.006, GUN_HEAT=3.2, GUN_COOL=42;
/* ============================================================
   🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
   แปลงสเปกจริงเป็นค่าในเกม:
     ยิงทีละนัด 50 RPM → หน่วงลูกเลื่อน 1,200ms · แม็ก 10 นัด · ดาเมจ 55 (สูงกว่าไรเฟิลมาก → ยานลูกดับนัดเดียว)
     Accuracy 28 = ส่ายน้อยมากตอนส่องกล้อง แต่ยิงสะโพก (ไม่ส่อง) จะเป๋ · ความเร็วกระสุน 550 m/s
   ============================================================ */
const WEAPONS={
  rifle:{ key:'rifle', name:'KSR-77 จู่โจม', icon:'🔫', auto:true,  gap:GUN_GAP, dmg:GUN_DMG, msDmg:0.55,   /* 🏷️ รอบ 520: เปลี่ยนชื่อโชว์ 'ไรเฟิลจู่โจม'→'KSR-77' (ผู้ใช้เลือก · key ยังเป็น 'rifle' คงค่าล็อก) */
          spread:GUN_SPREAD, hipSpread:GUN_SPREAD, heat:GUN_HEAT, mag:0, scope:true,   /* รอบ 463: ศูนย์เล็ง 2× */ tracer:0xffe08a, recoil:1 },
  r93:  { key:'r93',   name:'R93 สไนเปอร์',  icon:'🎯', auto:false, gap:1200,    dmg:3.2,     msDmg:3.3,
          spread:0.0006, hipSpread:0.016, heat:0, mag:10, reload:2600, scope:true,   /* กำลังขยายเลือกได้ 3 ระดับ ดู SCOPE_MAGS */
          tracer:0xbfe6ff, recoil:2.6 },
};
const SNIPER_SENS=0.34;                 // ส่องกล้องแล้วเล็งช้าลง (ไม่งั้นสะบัดจนเล็งไม่ได้)
/* 🔭 รอบ 420: กล้องแบบ Picture-in-Picture (ผู้ใช้สั่ง) — "ในเลนส์ขยาย · นอกเลนส์เห็นปกติ"
   ทำโดยเรนเดอร์ฉาก 2 รอบต่อเฟรม: รอบแรกมุมมองปกติเต็มจอ → รอบสองมุมแคบเฉพาะวงกลมกลางจอ
   (ต่างจากเกมทั่วไปที่ซูมทั้งหน้าจอ — แบบนี้ยังเห็นภัยรอบตัวได้) */
const SCOPE_R=0.30;                     // รัศมีเลนส์ = สัดส่วนของด้านสั้นของจอ
/* 🔎 รอบ 421: กำลังขยาย 3 ระดับ (ตามสไตล์ที่ผู้เล่นจริงนิยม — ผู้ใช้สั่ง)
   สลับด้วยปุ่ม "4×/6×/8×" ข้างปุ่มกล้อง หรือคีย์ Z */
/* 🔭 รอบ 462: `r` = ตัวคูณขนาดวงเลนส์ตามกำลังขยาย — ยิ่งซูมแรง วงยิ่งกว้าง (เห็นรายละเอียดคุ้มการซูม)
   เหมือนกล้องจริงที่กำลังขยายสูงใช้เลนส์หน้าใหญ่กว่า · ถูกจำกัดด้วยขอบจออีกชั้นใน scopeRadius() */
const SCOPE_MAGS=[
  {m:4, r:0.86, label:'4×', name:'สายบุก (Aggressive)', hint:'ขยับตลอด ยิงระยะใกล้-กลาง เห็นภาพกว้าง หาเป้าไว'},
  {m:6, r:1.00, label:'6×', name:'ระยะมาตรฐาน',        hint:'ยิงระยะ 100–200 เมตร สมดุลที่สุด'},
  {m:8, r:1.18, label:'8×', name:'ระยะไกล',            hint:'แผนที่เปิดโล่ง จ่อเป้าไกลๆ ได้นิ่ง · วงเลนส์กว้างสุด'},
];
/* 🔭 รอบ 463 (ผู้ใช้: "ปืนอื่นซูมได้น้อยกว่า R93"): ไรเฟิลได้ศูนย์เล็งจุดแดง 2× ระดับเดียว
   วงเลนส์เล็กกว่า (r 0.55) = เห็นภาพรอบข้างเยอะ เหมาะกับการยิงรัวระยะใกล้ */
const RIFLE_MAGS=[
  {m:2, r:0.55, label:'2×', name:'ศูนย์เล็งจุดแดง', hint:'ซูมเบา ๆ ยิงรัวได้ เห็นภาพกว้าง เหมาะระยะใกล้-กลาง'},
];
function magList(){ return (weapon==='r93')?SCOPE_MAGS:RIFLE_MAGS; }
function curMag(){ const L=magList(); return L[Math.min(scopeMagIdx,L.length-1)]||L[0]; }
let scopeMagIdx=1;                      // เริ่มที่ 6× (ค่ากลาง) — ไรเฟิลมีระดับเดียวจึงถูก clamp เอง
/* ============================================================
   🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
   ลำดับ: ยกปืนเข้าแนวสายตา → กล้องเคลื่อนเข้าหาตา → ขอบเลนส์ค่อยๆ ขยายเข้ามา
          → ภาพในเลนส์ขยาย → เรติเคิลคมชัด → ปืนแกว่งตามจังหวะหายใจ → ออกจากซูมแบบถอยนุ่มๆ
   หัวใจคือ "ต่อเนื่อง ไม่ตัดภาพ" ทุกอย่างวิ่งด้วยค่าเดียวคือ adsT (0=ท่าพร้อมยิง · 1=แนบตาเต็มที่)
   ============================================================ */
const ADS_IN=0.30, ADS_OUT=0.22;        // เวลายกปืนเข้าเล็ง / ถอยออก (วินาที)
const ADS_POS=[0,-0.09,-0.56];          // ท่าแนบไหล่ "ค่ากลาง" — ใช้เฉพาะปืนที่ยังไม่มีค่าแยกใน ADS_BY_GUN
const ADS_ROT=[0.02,0,0];               // เลิกเอียงทแยง จัดลำกล้องให้ตรงแนวสายตา
const ADS_SCALE=.72;                    // ขยับเข้าใกล้ตาอีกนิด (ให้รู้สึกมีมวล) — ต้องมากกว่า GUN_SCALE เสมอ ไม่งั้นยกปืนแล้วปืนหดเล็กลง
/* 🎯 รอบ 499: ท่าเล็ง (ADS) "แยกตามกระบอก" — โครงเดียวกับ AIM_BY_GUN/GUN_VIEW
   เหตุผล: ท่าถือถูกจูนใหม่ยกชุดรอบ 482–497 (ปืนใหญ่ขึ้นมาก s 1.014/1.485) แต่ ADS ยังเป็นค่ากลางชุดรอบ 450
   (s .72) → พอยกเล็ง "ปืนหดเล็กลงครึ่งหนึ่ง" และไรเฟิลยังชี้ขึ้นทั้งที่จุดเล็งอยู่ล่างจอ 73%
   ค่าชุดนี้จูนด้วยเงื่อนไข 4 ข้อ (วัดจากในเกมจริง ดู handoff/TASKS.md รอบ 499):
     ① แนวปืน (PCA 3 มิติของจุดยอด) ขนานกับ "แนวเล็ง" ของกระบอกนั้น → dPitch/dYaw = 0.00°
        (ไรเฟิลจุดเล็งอยู่ 73% ของจอ → ท่าเล็งต้องก้มลง ~21° ไม่ใช่เงยขึ้นแบบค่ากลางเดิม)
     ② ปลายลำกล้องตกใต้จุดเล็ง 3.9% ของจอ ตรงแกน x เดียวกัน (ชี้เข้าเป้าแต่ไม่บังกากบาท/วงเลนส์)
     ③ s = เท่าท่าถือของกระบอกนั้นเป๊ะ → ยกเล็งแล้ว "ปืนไม่หด" (ค่ากลางเดิม .72 ทำให้ R93 หดครึ่งหนึ่ง)
     ④ roll = 0 (ปืนตั้งตรง) · z ถูกเลือกให้เงาปืนบนจอกว้าง ~12–16% และไม่โดน near plane ตัด
   ⚠️ ปืนถูกจัดให้ขนานแนวเล็ง = มองจากท้ายปืน ส่วนที่ใกล้ตาจะบานออกเร็วมาก
      → ขยาย s หรือดึง z เข้าใกล้อีกนิดเดียว ตัวปืนจะพุ่งจนเต็มจอ (วัดได้: z −0.62 s .85 → เงากว้าง 31% ของจอ)
      ถ้าอยากให้ "ปืนใหญ่ขึ้นตอนเล็ง" ต้อง **เพิ่ม s พร้อมดัน z ออกไปข้างหน้า** คู่กันเสมอ
   🔍 รอบ 503: ผู้ใช้สั่งให้ตอนเล็ง "ปืนอัดเข้ามาใกล้ตา + ใหญ่ขึ้น 15–20%" → ปรับตามสูตรนี้
      • ภาพบนจอขึ้นกับ **อัตราส่วน s/|p| เท่านั้น** — คูณ p กับ s ด้วยตัวเลขเดียวกัน ภาพ "เท่าเดิมเป๊ะ"
        (วัดยืนยันแล้ว: s1.550@z−1.300 กับ s1.643@z−1.378 ได้เงากว้าง 14.30 vs 14.31%)
        → ใช้ตัวคูณนี้ "ดัน z ออกหน้า" เพื่อกันท้ายปืนชน near plane ได้ฟรี ไม่เปลี่ยนภาพ
      • ความกว้างเงาปืนโตเร็วกว่า s มาก (ท้ายปืนอยู่ใกล้ตา): r93 s +4.4% → เงากว้าง +18% · rifle s +4.2% → +16%
      • เพิ่ม s แล้วปลายลำกล้องจะขยับขึ้น ต้องดึง y ลงชดเชยให้ปลายกลับไปอยู่ใต้จุดเล็งเท่าเดิม
   ⛔ ค่าท่าถือ (GUN_VIEW) และจุดเล็ง (AIM_OFF/AIM_BY_GUN) ถูกล็อก — ห้ามแตะ แก้ได้แค่ตารางนี้
   🔧 จูนสด: InvasionWorld._t.setAdsPose({x,y,z,rx,ry,rz,s}) → คืนบรรทัดพร้อมวางทับตารางนี้ */
const ADS_BY_GUN={
  r93:   {p:[0.012,-0.221,-1.378], r:[-0.415,-0.009,0], s:1.643},   /* 🔍 รอบ 503: ใหญ่ขึ้น +18% */
  rifle: {p:[0.006,-0.144,-0.713], r:[-0.374,0,0],      s:1.215},   /* 🔍 รอบ 503: ใหญ่ขึ้น +16% */
};
function adsView(){ return ADS_BY_GUN[weapon] || {p:ADS_POS, r:ADS_ROT, s:ADS_SCALE}; }
/* ============================================================
   🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
   ⛔ เป็นออฟเซ็ตล้วน ๆ เหมือน SWAY รอบ 501 — **ไม่แก้ตัวเลขใน ADS_BY_GUN / GUN_VIEW / AIM_OFF**
   วิธีคิด (ต่อยอดสูตรรอบ 503):
     • ภาพบนจอขึ้นกับอัตราส่วน s/|p| → เพิ่ม s อย่างเดียว = ปืนโตขึ้น/ดูใกล้ตาขึ้น (p เท่าเดิม
       จึงไม่กระทบ adsPosNow() ที่ผูกกับจุดเล็ง และท้ายปืนถอยห่าง near plane ด้วยซ้ำ)
     • เงาปืนกว้างโตเร็วกว่า s ~4 เท่า (วัดรอบ 503: s +4.4% → เงา +18%) → ตัวเลข mag/breath จึงเล็กมาก
     • เพิ่ม s แล้วปลายลำกล้องลอยขึ้น → ต้องดึง y ลงชดเชยด้วย yFix (หน่วย = ดึงลงกี่หน่วยต่อ gain 1.0)
       วัดค่า yFix จากในเกมจริง (รอบ 504) ให้ปลายลำกล้องอยู่ใต้จุดเล็งเท่าค่าฐานทุกระดับซูม
     • ทุกค่าถูกไล่แบบ lerp ต่อเฟรม → สลับกำลังขยาย/กลั้นหายใจแล้วไม่กระตุก
   🔧 จูนสด: InvasionWorld._t.setAdsBoost({m6,m8,breath,yFix,lerp,breathIn,breathOut}) · ดูค่า: _t.adsBoost
   ============================================================ */
const ADS_BOOST={
  mag:{4:0, 6:0.0117, 8:0.0226},   // s เพิ่มกี่ส่วนตามกำลังขยาย (วัดแล้ว: เงากว้าง +0.0/+5.0/+10.0%) — ใช้เฉพาะกระบอกที่ซูมได้หลายระดับ
  breath:0.0082,                   // 🫁 ประทับแก้มตอนกลั้นหายใจ (วัดแล้ว: เงากว้าง +3.4–3.6% ทั้ง 2 กระบอก)
  yFix:{ r93:0.148, rifle:0.108 }, // ดึง y ลงกี่หน่วยต่อ gain 1.0 (ชดเชยปลายลำกล้องลอยขึ้น) — วัดจากเกมจริงรอบ 504
  lerp:6.5,                        // ความเร็วไล่ค่าตอนสลับกำลังขยาย
  breathIn:3.2, breathOut:5.0      // เข้าท่าประทับแก้มช้ากว่าคืนท่านิดหน่อย (คืนไว = ปล่อยปุ่มแล้วรู้สึกทันที)
};
let adsZoomG=0, adsBreathG=0, adsBoostG=0;
/* ไล่ค่า gain ทุกเฟรม (เรียกจาก tickAds หลังคำนวณ adsT) — คืน gain รวม */
function tickAdsBoost(dt){
  const magT=(magList().length>1)?(ADS_BOOST.mag[curMag().m]||0):0;   // ไรเฟิลมีระดับเดียว → ไม่ขยับขนาด
  adsZoomG+=(magT-adsZoomG)*Math.min(1, dt*ADS_BOOST.lerp);
  const bT=(holdBreath && breathLeft>0 && adsT>0.5)?ADS_BOOST.breath:0;
  adsBreathG+=(bT-adsBreathG)*Math.min(1, dt*(bT>adsBreathG?ADS_BOOST.breathIn:ADS_BOOST.breathOut));
  adsBoostG=adsZoomG+adsBreathG;
  return adsBoostG;
}
/* ============================================================
   🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
   เป้าหมาย: เด็กรู้จังหวะเล็ง "โดยไม่ต้องอ่านตัวเลข" — ได้ยินว่ากลั้นอยู่ เห็นว่าลมใกล้หมด
   ⛔ เป็นชั้นสัญญาณล้วน — ไม่แตะ GUN_VIEW / AIM_OFF / AIM_BY_GUN / ADS_BY_GUN และไม่ยุ่งกับสูตรแกว่ง
   ต่อยอดของเดิม ไม่สร้างระบบซ้อน:
     • เสียง → เมธอดใหม่ในกลุ่ม Snd เดิม (breathIn/breathOut/breathStrain · สังเคราะห์ล้วน ไม่มีไฟล์เสียง)
     • ภาพ → บวกทับค่า dark เดิมใน layoutScope() + เพิ่มเลเยอร์ไล่สีที่ .so-mask ใบเดิม
       (เลเยอร์ขอบจอเริ่มมืด "นอกวงเลนส์เสมอ" R+gap → ไม่มีทางบังกากบาท/เป้า)
     • ปุ่ม 🫁 ใช้ opacity เดิม เพิ่มแค่ brightness ตอนอึดอัด
   ============================================================ */
const BREATH_FX={
  strainAt:0.25,        // breathLeft ต่ำกว่านี้ = เริ่มเสียงสั่น/อึดอัด (เกณฑ์เดียวกับ tired ใน layoutScope)
  gapHi:900, gapLo:380, // ระยะห่างเสียงสั่น (ms) ตอนเพิ่งเริ่มอึดอัด → ตอนแทบหมดลม
  vig:0.62,             // ขอบจอมืดสุดกี่ alpha ตอนลมหมดเกลี้ยง
  vigIn:0.60,           // เริ่มมืดที่รัศมี = กี่เท่าของครึ่งด้านยาวจอ (ยังบังคับ ≥ วงเลนส์+gap เสมอ)
  vigGap:34,            // ระยะกันชนขั้นต่ำจากขอบเลนส์ถึงจุดเริ่มมืด (px)
  darkAdd:0.05,         // ขอบเลนส์เข้มเพิ่มสูงสุดตอนลมหมด (บวกทับ dark เดิม)
  lerp:5.0              // ความเร็วไล่ค่า — ปล่อยแล้วคืนสภาพนุ่ม ๆ ไม่วูบ
};
let breathHeld=false, breathStrainAt=0, breathVig=0;
/* เรียกจาก tickAds() ทุกเฟรม หลังอัปเดต breathLeft แล้ว */
function tickBreathFx(dt,now){
  const holding=holdBreath && adsT>0.5 && breathLeft>0;
  if(holding!==breathHeld){
    if(holding){ Snd.breathIn(); breathStrainAt=now+BREATH_FX.gapHi; }
    else Snd.breathOut();                       // ปล่อยปุ่ม/เลิกส่อง/ลมหมด → ผ่อนลมออกเสมอ
    breathHeld=holding;
  }
  if(holding && breathLeft<BREATH_FX.strainAt && now>=breathStrainAt){
    const k=1-breathLeft/BREATH_FX.strainAt;    // 0 = เพิ่งเริ่มอึดอัด · 1 = แทบหมดลม
    Snd.breathStrain(k);
    breathStrainAt=now+(BREATH_FX.gapHi+(BREATH_FX.gapLo-BREATH_FX.gapHi)*k);
  }
  const want=holding?Math.pow(1-breathLeft,1.6)*Math.min(1,adsT):0;
  breathVig+=(want-breathVig)*Math.min(1,dt*BREATH_FX.lerp);
  if(breathVig<0.002) breathVig=0;
}
const ADS_BREATH=0.0060;                // แอมพลิจูดการแกว่งจากการหายใจ (เรเดียน)
/* ============================================================
   🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
   ⛔ เป็นตัวคูณบวกทับล้วน ๆ เหมือน SWAY (รอบ 501) / ADS_BOOST (รอบ 504)
      **ไม่แก้ตัวเลขใน ADS_BY_GUN / GUN_VIEW / AIM_OFF / AIM_BY_GUN** และไม่แตะ ADS_BREATH/SWAY ค่าฐาน
   ปัญหาเดิม: มุมแกว่งเท่ากันทุกระดับซูม แต่ในเลนส์ภาพถูกขยาย m เท่า → "ที่ตาเห็น" โตตาม m ตรง ๆ
      (8× สั่นเป็น 2 เท่าของ 4× — เล็งเป้าไกลไม่ได้เลย) · แต่ถ้าหักล้างจนเท่ากันหมด ซูมก็ไม่มีราคาต้องจ่าย
   ✅ ทางออก: กำหนดเป็น "การแกว่งที่อ่านได้ในเลนส์" (มุมจริง × กำลังขยาย) เทียบฐาน 4× แล้วถอยกลับเป็นมุมจริง
        มุมจริง k(m) = read[m] × baseMag / m     (4× → k=1 = ค่าเดิมเป๊ะ)
      กลั้นหายใจ: อยากได้ "ระดับที่อ่านได้" เท่ากันทุกซูม → steady(m) = hold / read[m]
        (4× = 0.12 เท่าค่าเดิม · ซูมแรงกว่าได้ steady เล็กลงพอดีกับที่ภาพถูกขยาย)
   🔧 จูนสด: InvasionWorld._t.setSwayMag({r6,r8,hold,gun,lerp}) · ดูค่า: _t.swayMag · ข้ามการไล่นุ่ม: _t.snapSwayMag()
   ============================================================ */
const SWAY_MAG={
  read:{4:1.00, 6:1.12, 8:1.25},  // การแกว่งที่ "ตาเห็นในเลนส์" เทียบ 4× (มุมจริง × กำลังขยาย) — ซูมแรงสั่นมากขึ้นแต่ไม่ถึงกับเล็งไม่ได้
  hold:0.12,                      // กลั้นหายใจแล้วเหลือกี่ส่วนของ "ที่ตาเห็นตอน 4× ไม่กลั้น" (= ค่า steady เดิม → 4× ไม่เปลี่ยนเลย)
  gun:1,                          // ให้ตัวโมเดลปืนโยกตามตัวคูณเดียวกันกี่ % (0=ปืนโยกเท่าเดิม · 1=ตามเต็ม)
  lerp:6.5                        // ความเร็วไล่ค่าตอนสลับกำลังขยาย (สลับแล้วต้องไม่กระตุก)
};
let swMagG=1, swHoldG=SWAY_MAG.hold;
/* ไล่ตัวคูณทุกเฟรม (เรียกจาก tickAds) — คืนตัวคูณ "มุมแกว่งจริง" ปัจจุบัน
   ปืนที่มีกำลังขยายระดับเดียว (ไรเฟิล 2×) ไม่มีอะไรให้เทียบ → คงค่าเดิมทั้งคู่ */
function tickSwayMag(dt){
  const L=magList(), multi=L.length>1;
  const rd = multi ? (SWAY_MAG.read[curMag().m]||1) : 1;
  const angT = multi ? rd*L[0].m/curMag().m : 1;
  const a=Math.min(1, dt*SWAY_MAG.lerp);
  swMagG+=(angT-swMagG)*a;
  swHoldG+=((SWAY_MAG.hold/rd)-swHoldG)*a;
  return swMagG;
}
/* ============================================================
   🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
   บทเรียนที่อยากให้เด็กได้: **เล็งให้จบก่อนลมหมด** — ปล่อยปุ่มเองก่อนหมดลม = ไม่มีโทษนี้เลย
   ⛔ เป็นออฟเซ็ตบวกทับล้วน ๆ เหมือน SWAY (501) / ADS_BOOST (504) / SWAY_MAG (506)
      **ไม่แก้ตัวเลขใน ADS_BY_GUN / GUN_VIEW / AIM_OFF / AIM_BY_GUN / ADS_BREATH / SWAY**
   วิธีคิด:
     • "ตกกี่ % ของจอ" ต้องเท่ากันทุกกำลังขยาย → แปลงจากสัดส่วนจอกลับเป็นมุมด้วย fov ปัจจุบันทุกเฟรม
       θ = atan(2 × frac × tan(fov/2))   (8× fov แคบ → มุมเล็กลงเอง แต่ตาเห็นตกเท่ากัน)
     • ใส่ที่ "กล้อง" เหมือนแรงถอย → ตัวปืนตกตามไปด้วยทั้งภาพ (ทิศกระสุนเทียบกากบาทไม่เปลี่ยน)
       แล้วเติมให้ตัวปืนจิ้มลงอีกนิด (gunY/gunPitch) ให้รู้สึกว่า "แขนหมดแรง" ไม่ใช่แค่จอเลื่อน
     • ช่วงหอบ = **ต่อยอด fatigue ตัวเดิม** (บวกเข้าเทอมเดียวกันใน tickSway) + คูณแอมป์ใน applyBreath
       จึงไม่มีคลื่นหายใจชุดที่ 2 ซ้อนเข้ามา
   🔧 จูนสด: InvasionWorld._t.setGasp({drop,dropIn,dropOut,mul,hold,ease,fat,gunY,gunPitch})
             ดูค่า: _t.gasp · ยิงจังหวะหอบเองตอนวัด: _t.fireGasp() · เคลียร์: _t.clearGasp()
   ============================================================ */
const GASP={
  drop:0.008,      // ตกลงกี่ส่วนของความสูงจอ (0.8% — อยู่กลางกรอบ 0.6–1.0% ที่ผู้ใช้ขอ)
  dropIn:0.25,     // เวลาตกลง (วินาที) — วูบเร็วพอให้ตกใจ
  dropOut:0.80,    // เวลาคืนขึ้นนุ่ม ๆ (วินาที)
  mul:1.8,         // แกว่งของภาพในเลนส์แรงขึ้นกี่เท่าตอนหอบ (1.5–2)
  hold:1.00,       // หอบเต็มแรงกี่วินาที
  ease:0.70,       // แล้วค่อยคลายลงภายในกี่วินาที
  fat:0.60,        // บวกเข้า fatigue เดิมเท่าไร (ทำให้ "ตัวโมเดลปืน" โยกแรงขึ้นด้วย)
  gunY:0.012,      // ตัวปืนจิ้มลงเพิ่ม (หน่วยโลก) ตอนตกสุด
  gunPitch:0.010   // ตัวปืนก้มปลายลงเพิ่ม (เรเดียน) ตอนตกสุด
};
let gaspTime=-1, gaspDrop=0, gaspShake=0;   // gaspTime<0 = ไม่มีจังหวะหอบอยู่
function fireGasp(){ gaspTime=0; }
function clearGasp(){ gaspTime=-1; gaspDrop=0; gaspShake=0; }
/* ไล่ซองจังหวะทุกเฟรม (เรียกจาก tickAds) — จบแล้วรีเซ็ตกลับเป็น 0 สนิท */
function tickGasp(dt){
  if(gaspTime<0) return;
  gaspTime+=dt;
  const t=gaspTime;
  gaspDrop = t<GASP.dropIn ? smoothstep(t/GASP.dropIn) : 1-smoothstep((t-GASP.dropIn)/GASP.dropOut);
  gaspShake = t<GASP.hold ? 1 : 1-smoothstep((t-GASP.hold)/GASP.ease);
  if(gaspDrop<0) gaspDrop=0;
  if(gaspShake<0) gaspShake=0;
  if(gaspDrop<=0 && gaspShake<=0) clearGasp();
}
/* ตัวคูณแอมป์การแกว่ง (1 = ปกติ) — ใช้ทั้งใน applyBreath และ tickSway */
function gaspMul(){ return 1+(GASP.mul-1)*gaspShake; }
/* มุมกดกล้องลงตอนนี้ (เรเดียน) — คิดจาก fov ปัจจุบัน ให้ "ตกกี่ % ของจอ" เท่ากันทุกกำลังขยาย */
function gaspPitchNow(){
  if(gaspDrop<=0 || !camera) return 0;
  const half=Math.tan((camera.fov||60)*Math.PI/360);
  return Math.atan(2*GASP.drop*gaspDrop*half);
}
/* ใส่ที่กล้องหลัง applyBreath (แนวเดียวกับแรงถอย — ทิศกระสุนเทียบกากบาทไม่ขยับ) */
function applyGasp(){
  const p=gaspPitchNow();
  if(p) camera.rotateX(-p);
}
/* 💥 รอบ 423: แรงถอยตอนยิง — ปืนเด้งขึ้นแล้วค่อยๆ กลับเข้าเป้า (ภาพในเลนส์สะบัดตามด้วย
   เพราะแรงถอยใส่ที่ "กล้อง" ไม่ใช่แค่โมเดลปืน) · R93 เด้งแรงกว่าไรเฟิลมาก ต้องเล็งใหม่ทุกนัด
   💥 รอบ 500: แยกค่าตามกระบอก (โครงเดียวกับ GUN_VIEW / AIM_BY_GUN / ADS_BY_GUN) หลังปืนโตขึ้น ~20%
   | ช่อง     | ความหมาย                                                            |
   | up       | มุมเด้งขึ้นต่อนัด (เรเดียน)                                          |
   | side     | ส่ายซ้าย-ขวา (คูณกับ RECOIL_PAT — แพตเทิร์นชุดยิง)                    |
   | recover  | ความเร็วดึงกล้องกลับเข้าเป้า (ยิ่งน้อย = คืนช้า ต้องเล็งใหม่)          |
   | climb    | ยิงรัวติดกันเด้งเพิ่มต่อนัด · climbMax = เพดานตัวคูณ                  |
   | ads      | ตัวคูณตอนส่องกล้อง (adsT=1) — <1 เสมอ เพราะ "ในเลนส์ขยาย 2–8 เท่า"
                มุมเท่ากันจึงอ่านออกชัดกว่าตอนถือปกติหลายเท่าอยู่แล้ว (ดูบันทึกรอบ 500)      |
   | gun      | ตัวคูณแรงสะบัดของ "ตัวโมเดลปืน" (คูณกับ WEAPONS[..].recoil)           |
   | gunBack  | ความเร็วที่ตัวปืนคืนท่า (ยิ่งน้อย = ค้างนาน ดูหนัก)                    | */
const REC_BY_GUN={
  /* ไรเฟิล: ถี่ เบา ส่ายเล็กน้อย คืนตัวไว → ยิงรัวแล้วยังกดสวนคุมได้ */
  rifle:{ up:0.0088, side:0.0062, recover:9.0, climb:0.12, climbMax:1.80, ads:0.72, gun:0.95, gunBack:10.0 },
  /* R93: กระชากแรง ดีดสูง คืนตัวช้า → ต้องเล็งใหม่ทุกนัด (ยิงทีละนัด gap 1.2 วิ อยู่แล้ว) */
  r93:  { up:0.1150, side:0.0260, recover:2.5, climb:0.00, climbMax:1.00, ads:0.55, gun:1.30, gunBack:4.5 },
};
const REC_DEFAULT={ up:0.0115, side:0.0045, recover:5.2, climb:0.11, climbMax:1.60, ads:0.65, gun:1, gunBack:7 };
/* ⚠️ นั่งปืนประจำประตู (riding) ใช้ค่ากลางเสมอ — ไม่ใช่ปืนที่ถืออยู่ */
function recCfg(){ return riding ? REC_DEFAULT : (REC_BY_GUN[weapon] || REC_DEFAULT); }
const BOLT_MS=1200;                     // เวลาชักลูกเลื่อน R93 (ตรงกับ WEAPONS.r93.gap)
const BREATH_MAX=5.0, BREATH_RECOVER=4.0;   // กลั้นหายใจได้กี่วินาที / เวลาฟื้นเต็ม
let adsRaw=0, adsT=0, holdBreath=false, breathLeft=1;
/* 🏃 รอบ 448: ท่าลดปืนตอนวิ่ง (sprint) — วิ่ง = ปืนก้มลงข้างตัว ยิงไม่ได้จนกว่าจะยกกลับ
   sprintT 0=ท่าพร้อมยิง · 1=ลดปืนสุด · sprintHold = เวลาที่ "ห้ามลดปืน" (เพิ่งยิง/เพิ่งเล็ง) */
const SPRINT_IN=0.22, SPRINT_OUT=0.14;
const SPRINT_POS=[.16,-.20,.10], SPRINT_ROT=[-.62,.42,-.30];   // เลื่อนลง-เข้าใน · ก้มปากกระบอกลง
let sprintRaw=0, sprintT=0, sprintHold=0, moveLen=0;
/* 🌀 รอบ 464: ปืนตามการหันจอแบบมีมวล (weapon sway) — เก็บ yaw/pitch เฟรมก่อน แล้วให้ปืน
   "ตามไม่ทัน" นิดหน่อย ค่อย ๆ ไหลกลับเข้าที่ (สปริง) · ยิ่งหันเร็ว ยิ่งเอียงตามแรง
   ตอนส่องกล้องลดเหลือ 25% (เล็งอยู่ต้องนิ่ง) */
let lagYaw=0, lagPitch=0, lastYaw=0, lastPitch=0;
const LAG_GAIN=0.72, LAG_MAX=0.17, LAG_BACK=6.2;   // แรงตาม · เพดานองศา · ความเร็วไหลกลับ
/* 🤝🔧 รอบ 501: WEAPON SWAY/BOB — แก้อาการ "ปืนลอย" (มุมมองนี้ไม่โชว์มือตามคำสั่งผู้ใช้รอบ 438)
   สมองอ่านว่า "มีคนถือ" จากจังหวะ ไม่ใช่จากรูปมือ → ปืนต้องโยกตามก้าวเดิน + หายใจตอนยืนนิ่ง
   ⚠️ ทุกค่าที่นี่เป็น **ออฟเซ็ตบวกทับท่าถือ** เท่านั้น — ไม่แตะ GUN_VIEW / AIM_OFF / AIM_BY_GUN ที่ถูกล็อก
   หยุดเดิน → swAmp ไหลกลับ 0 (สแนปเมื่อ <0.0015) ปืนคืนเข้าท่าเดิมเป๊ะ · กระสุนใช้ aimDir() จึงไม่กระทบจุดเล็ง
   🔧 จูนสด: InvasionWorld._t.setSway({...}) · ดูค่า/สถานะ: _t.sway */
const SWAY={
  walkHz:1.45, runHz:2.25,          // จำนวนรอบก้าว/วินาที (เดิน/วิ่ง)
  x:.020, y:.014, z:.009,           // ระยะโยก ซ้ายขวา / ขึ้นลง / เข้าออก
  roll:.045, pitch:.024, yaw:.018,  // องศาสะบัดตามก้าว
  breathHz:.26, breathY:.005, breathPitch:.009, breathRoll:.006,   // ยืนนิ่ง = ยังหายใจอยู่
  ampIn:5.5, ampOut:3.4,            // ความไวเร่งแอมป์ / คลายกลับเข้าท่าเดิม
  ads:.18                           // ส่องกล้องเหลือแรงโยกกี่ % (เล็งต้องนิ่ง)
};
let swPhase=0, swAmp=0, swLast={x:0,y:0,z:0,rx:0,ry:0,rz:0};
/* 🔁 รอบ 464: ท่าเปลี่ยนปืน — ลดปืนลงแล้วยกกระบอกใหม่ขึ้นมา (สลับโมเดลตอนต่ำสุด) */
let swapAt=0, swapTo=null, swapSnd=0; const SWAP_MS=420;
/* 🫁 รอบ 449: วิ่งนาน = เหนื่อย — จอโยกเบาๆ + เสียงหายใจแรงเป็นจังหวะ (ฟื้นเองเมื่อหยุดวิ่ง)
   เริ่มรู้สึกเหนื่อยหลังวิ่งต่อเนื่อง ~PANT_FROM วินาที · เต็มที่ที่ ~PANT_FULL */
const PANT_FROM=2.6, PANT_FULL=6.5, PANT_GAP=980;
let sprintTime=0, fatigue=0, pantAt=0;
let recPitch=0, recYaw=0, boltAt=0;   // 💥 แรงถอยค้างอยู่ + เวลาที่เริ่มชักลูกเลื่อน
const MIS_MAX=6, MIS_RELOAD=9000, MIS_SPD=95, MIS_DMG=3;
const PLAYER_HP=120, HURT_IFRAME=700, SHIELD_REGEN=4.5;   // ฟื้นพลังเองเมื่อไม่โดนยิง (โลก 3D ไม่มีเกมโอเวอร์)

/* 👥 พันธมิตร */
const SQUAD_N=10;
const SQUAD_GAP=520, HELI_GAP=2600;    // จังหวะยิงของ AI (ms)

/* 🚁 เฮลิคอปเตอร์ (รอบ 417 ผู้ใช้สั่ง 3 ข้อ):
   · ทั้งโลกมีได้สูงสุด HELI_MAX ลำ (นับรวมผู้เล่นทุกคน + บอท)
   · ปกติ "ผู้เล่นขับเท่านั้น" ไม่มีบอท — ยกเว้นในแมพมีคนน้อยกว่า 2 คน จึงปล่อยบอท 1 ลำเป็นเพื่อน
   · การบังคับ "เหมือนโลกเฮลิคอปเตอร์ทุกประการ" → ค่าพวกนี้ก๊อปตรงจาก tickHeli ใน adventure3d.js */
const HELI_MAX=5;                      // เพดานจำนวนเฮลิทั้งโลก
const HELI_ACCEL=13, HELI_VMAX=17, HELI_CLIMB=9, HELI_DAMP=1.8, HELI_DRAG=1.4, HELI_YAWSP=1.5;
const HELI_SKID=1.35, HELI_CEIL=95;    // ความสูงตาคนขับเหนือคานลงจอด · เพดานบิน
const PH_GUN_GAP=70, PH_GUN_DMG=1.1;                 // ปืนกลติดเฮลิ (รัวกว่าปืนมือ ไม่มีโอเวอร์ฮีต)
const PH_MIS_MAX=12, PH_MIS_RELOAD=6000, PH_MIS_DMG=3.2;   // จรวดเฮลิ: ยิงเป็นชุดคู่ เติมเร็ว

/* 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414 — ผู้ใช้สั่ง) — สไตล์ Roblox ผ่าน Firebase /world/invasion */
const NET_SEND_MS=170;
const CHAT_MS=5000;
const CHAT_PRESETS=['ระวังด้านบน! ⚠️','ยิงยานลูกก่อน!','ตรงนี้เยอะ! 👇','สู้ๆ 💪','เก่งมาก! 👍','ขึ้นเฮลิเลย 🚁','ระดมยิงยานแม่! 🎯','ฮ่าๆ 😂'];
const PEER_COLORS=[0xef5350,0x42a5f5,0x66bb6a,0xffca28,0xab47bc,0x26c6da,0xff7043,0x8d6e63];

const TAU=Math.PI*2;
const rnd=(a,b)=>a+Math.random()*(b-a);
/* สุ่มแบบมีเมล็ด (เลขเดิม→ผลเดิมทุกเครื่อง) — ใช้ให้ยานลูกเกิดตำแหน่งเดียวกันทั้งห้อง */
const srnd=(seed)=>{ const x=Math.sin(seed*127.1+311.7)*43758.5453; return x-Math.floor(x); };
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);

/* ============================================================
   🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
   ============================================================ */
const CSS=`
#inv-wrap{position:fixed;inset:0;z-index:60;display:none;background:#0a0c12;
  font-family:'Prompt',system-ui,sans-serif;overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:none}
#inv-wrap.on{display:block}
#inv-cv{position:absolute;inset:0;width:100%;height:100%;display:block}
/* ---- กรอบ HUD ทหาร ---- */
/* 🎞️ รอบ 416: เกรดสีแบบภาพอ้างอิง — ฟิล์มอุ่นจับฝุ่น + แดดสาดมุมบนขวา + ขอบจอมืด
   (ซ้อน 3 ชั้นบางๆ ไม่กินเฟรมเรต เพราะเป็น CSS gradient ไม่ใช่ post-processing) */
#inv-vig{position:absolute;inset:0;pointer-events:none;z-index:2;
  background:
    radial-gradient(circle at 78% 12%, rgba(255,236,190,.34) 0%, rgba(255,225,170,.13) 22%, rgba(255,255,255,0) 46%),
    linear-gradient(180deg, rgba(255,214,150,.13) 0%, rgba(255,255,255,0) 38%, rgba(120,92,58,.16) 100%),
    radial-gradient(ellipse at center, rgba(0,0,0,0) 44%, rgba(28,20,10,.66) 100%)}
#inv-hurt{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:0;transition:opacity .18s;
  background:radial-gradient(ellipse at center,rgba(255,0,0,0) 42%,rgba(255,20,20,.55) 100%)}
#inv-hurt.on{opacity:1}
#inv-flash{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:0;background:#fff}
#inv-flash.on{opacity:.55;transition:opacity .5s}
/* ---- เป้าเล็ง ---- */
#inv-cross{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;pointer-events:none;
  width:38px;height:38px}
#inv-cross i{position:absolute;background:#7dffb0;box-shadow:0 0 6px rgba(0,255,140,.9);opacity:.92}
#inv-cross i.t{left:50%;top:0;width:2px;height:11px;margin-left:-1px}
#inv-cross i.b{left:50%;bottom:0;width:2px;height:11px;margin-left:-1px}
#inv-cross i.l{top:50%;left:0;height:2px;width:11px;margin-top:-1px}
#inv-cross i.r{top:50%;right:0;height:2px;width:11px;margin-top:-1px}
#inv-cross.hot i{background:#ff5a4d;box-shadow:0 0 8px rgba(255,60,40,.95)}
#inv-cross .dot{position:absolute;left:50%;top:50%;width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:50%;background:#eaffef}
/* ---- แถบคำศัพท์บนสุด ---- */
#inv-word{position:absolute;left:50%;top:8px;transform:translateX(-50%);z-index:5;text-align:center;pointer-events:none;
  background:linear-gradient(180deg,rgba(6,14,26,.86),rgba(6,14,26,.6));border:1px solid rgba(120,220,255,.35);
  border-radius:12px;padding:5px 14px 7px;box-shadow:0 4px 18px rgba(0,0,0,.5)}
#inv-word .iw-chips{display:flex;gap:5px;justify-content:center}
#inv-word .ic{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:32px;padding:0 6px;
  border-radius:7px;font-weight:900;font-size:20px;color:#ff8b7a;background:rgba(255,60,40,.14);
  border:1px solid rgba(255,90,70,.55);text-shadow:0 0 8px rgba(255,80,60,.8)}
#inv-word .ic.down{color:#8effc0;background:rgba(60,255,150,.16);border-color:rgba(90,255,170,.7);
  text-shadow:0 0 10px rgba(80,255,160,.9);animation:invblink .5s ease-in-out 3}
@keyframes invblink{50%{opacity:.25}}
#inv-word .iw-th{display:block;margin-top:2px;font-size:12px;color:#cfe4ff;opacity:.9}
#inv-word .iw-tip{display:block;font-size:11px;color:#ffd98a;margin-top:1px}
/* ---- แถบสถานะซ้ายล่าง ---- */
/* ⚠️ แถบสถานะอยู่ "ซ้ายบนใต้ปุ่มออก" ไม่ใช่ซ้ายล่าง — ซ้ายล่างเป็นที่ของจอยเดิน จะทับกันทุกขนาดจอ */
#inv-stat{position:absolute;left:12px;top:50px;z-index:5;pointer-events:none;min-width:168px}
.inv-bar{height:11px;border-radius:6px;background:rgba(255,255,255,.14);overflow:hidden;margin-top:3px;
  border:1px solid rgba(255,255,255,.22)}
.inv-bar span{display:block;height:100%;width:100%;transition:width .18s}
#inv-hp span{background:linear-gradient(90deg,#38e08a,#b6ff6a)}
#inv-hp.low span{background:linear-gradient(90deg,#ff5252,#ff9d4d)}
#inv-heat span{background:linear-gradient(90deg,#4fc3f7,#ffd24d);width:0%}
#inv-heat.over span{background:linear-gradient(90deg,#ff6b3d,#ff2a2a)}
.inv-lb{font-size:11px;color:#cfe4ff;font-weight:800;letter-spacing:.4px;text-shadow:0 1px 3px #000}
#inv-mis{margin-top:6px;display:flex;flex-wrap:wrap;gap:3px;max-width:150px}
#inv-mis i{width:13px;height:20px;border-radius:3px 3px 1px 1px;background:linear-gradient(180deg,#ffd24d,#ff8a3a);
  box-shadow:0 0 6px rgba(255,170,60,.7)}
#inv-mis i.spent{background:rgba(255,255,255,.16);box-shadow:none}
/* ---- ตัวนับยานลูก / เกราะยานแม่ ขวาบน ---- */
#inv-target{position:absolute;right:12px;top:10px;z-index:5;pointer-events:none;text-align:right;
  background:rgba(6,14,26,.72);border:1px solid rgba(120,220,255,.3);border-radius:10px;padding:6px 10px}
#inv-target b{font-size:19px;color:#ffd24d;text-shadow:0 0 8px rgba(255,190,60,.7)}
#inv-target .inv-bar{width:132px}
#inv-msbar span{background:linear-gradient(90deg,#ff3b3b,#ff9a3b)}
#inv-coins{position:absolute;right:12px;top:84px;z-index:5;pointer-events:none;font-weight:900;font-size:15px;
  color:#ffd54f;text-shadow:0 2px 6px #000}
/* 🏠 รอบ 431: ป้าย "อยู่ในที่กำบัง" (โผล่เฉพาะตอนอยู่ในบ้าน) */
#inv-cover{position:absolute;left:50%;top:52px;transform:translateX(-50%);z-index:6;display:none;
  background:rgba(10,32,20,.82);border:2px solid #55d98a;border-radius:999px;padding:4px 14px;
  color:#b6ffd2;font-weight:900;font-size:13px;text-shadow:0 2px 6px #000;pointer-events:none}
#inv-cover.on{display:block}
@media (max-height:400px){ #inv-cover{top:34px;font-size:11px;padding:3px 10px} }
/* 🔎 รอบ 473: แถบโจทย์ "ยิงเป้าที่แปลว่า …" (ซ้ายบน ใต้ปุ่มออก — ไม่ทับแถบพลังชีวิต) */
/* ⚠️ max-width 28vw + ellipsis = คำแปลไทยยาว ๆ ก็ยังไม่ชน "แผงคำของยานแม่" (#inv-word) กลางจอบน
   วัดที่ 812×375: ขอบขวาแถบ 315 · #inv-word เริ่ม 327 */
#inv-quiz{position:absolute;left:96px;top:12px;z-index:6;display:none;max-width:28vw;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  background:rgba(24,12,40,.82);border:2px solid #c39bff;border-radius:999px;padding:4px 14px;
  color:#efe2ff;font-weight:900;font-size:14px;text-shadow:0 2px 6px #000;pointer-events:none}
#inv-quiz.on{display:block}
#inv-quiz b{color:#ffd54f;font-size:16px}
@media (max-height:400px){ #inv-quiz{left:88px;top:8px;font-size:12px;padding:3px 10px}
  #inv-quiz b{font-size:13px} }
/* ---- ปุ่มมือถือ ---- */
#inv-joy{position:absolute;left:16px;bottom:74px;width:118px;height:118px;border-radius:50%;z-index:6;
  background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.22)}
#inv-joy i{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#eaf6ff,#8fb6d6);box-shadow:0 3px 10px rgba(0,0,0,.5)}
#inv-fire,#inv-fire2,#inv-rocket,#inv-run{position:absolute;z-index:6;border:none;border-radius:50%;color:#fff;font-weight:900;
  box-shadow:0 5px 14px rgba(0,0,0,.55);cursor:pointer;-webkit-tap-highlight-color:transparent}
#inv-fire{right:18px;bottom:74px;width:104px;height:104px;font-size:34px;
  background:radial-gradient(circle at 34% 28%,#ff8a7a,#c62828)}
/* 🔫 รอบ 433 (ผู้ใช้สั่ง): ปุ่มยิงใบที่ 2 "เหนือจอยบังคับ" — นิ้วซ้ายเดิน+ยิงได้โดยไม่ต้องย้ายมือ
   ⚠️ วางกึ่งกลางตรงกับจอยเสมอ (จอย left16 กว้าง118 → กึ่งกลาง 75) และต้องไม่ทับจอย */
#inv-fire2{left:37px;bottom:204px;width:76px;height:76px;font-size:26px;
  background:radial-gradient(circle at 34% 28%,#ffb08a,#b34a1e)}
#inv-fire2:active{transform:scale(.94)}
#inv-rocket{right:132px;bottom:104px;width:74px;height:74px;font-size:26px;
  background:radial-gradient(circle at 34% 28%,#ffd88a,#e07a10)}
#inv-rocket:disabled{filter:grayscale(.8) brightness(.6)}
#inv-run{right:132px;bottom:18px;width:64px;height:64px;font-size:22px;
  background:radial-gradient(circle at 34% 28%,#9ad6ff,#1976d2)}
#inv-run.on{background:radial-gradient(circle at 34% 28%,#b6ffb0,#2e7d32)}
#inv-fire:active,#inv-rocket:active,#inv-run:active{transform:scale(.94)}
#inv-exit{position:absolute;left:12px;top:10px;z-index:7;border:none;border-radius:999px;cursor:pointer;
  background:rgba(200,40,40,.9);color:#fff;font-weight:900;font-size:13px;padding:7px 14px;box-shadow:0 3px 10px rgba(0,0,0,.5)}
/* 🚁 ปุ่มขึ้น/ลงเฮลิ + ปุ่มไต่ระดับ (โผล่เฉพาะตอนบิน) */
#inv-heli{position:absolute;right:18px;bottom:190px;width:64px;height:64px;font-size:26px;z-index:6;border:none;border-radius:50%;
  color:#fff;font-weight:900;cursor:pointer;box-shadow:0 5px 14px rgba(0,0,0,.55);-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 34% 28%,#b0e6c0,#2e8b57)}
#inv-heli.flying{background:radial-gradient(circle at 34% 28%,#ffd0d0,#c0392b)}
#inv-up,#inv-down{position:absolute;z-index:6;border:none;border-radius:14px;color:#0e2136;font-weight:900;font-size:22px;cursor:pointer;
  width:56px;height:50px;box-shadow:0 4px 10px rgba(0,0,0,.5);background:linear-gradient(180deg,#eaf6ff,#a9d3f2);display:none}
#inv-wrap.fly #inv-up,#inv-wrap.fly #inv-down{display:block}
#inv-wrap.fly #inv-run{display:none}
#inv-up{right:214px;bottom:150px}#inv-down{right:214px;bottom:94px}
/* 🎯 ปุ่มสลับปืน + ปุ่มส่องกล้อง (R93) */
#inv-swap{position:absolute;left:120px;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;
  font-size:20px;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.5);
  background:radial-gradient(circle at 34% 28%,#ffe9c0,#a9762a)}
#inv-scope{position:absolute;right:214px;bottom:150px;z-index:6;border:none;border-radius:50%;width:56px;height:56px;
  font-size:22px;cursor:pointer;display:none;box-shadow:0 4px 12px rgba(0,0,0,.5);
  background:radial-gradient(circle at 34% 28%,#dff0ff,#3a6d96)}
#inv-scope.on{background:radial-gradient(circle at 34% 28%,#c8ffd8,#2f8f52)}
/* 🔎 ปุ่มสลับกำลังขยาย (โชว์คู่กับปุ่มกล้อง — ช่องนี้ว่างตอนเดินเท้า เพราะ ▼ ใช้เฉพาะตอนขับเฮลิ) */
#inv-mag{position:absolute;right:214px;bottom:94px;z-index:6;border:none;border-radius:14px;width:52px;height:40px;
  font-size:16px;font-weight:900;color:#0e2136;cursor:pointer;display:none;
  box-shadow:0 4px 10px rgba(0,0,0,.5);background:linear-gradient(180deg,#eaf6ff,#a9d3f2)}
#inv-mag:active{transform:scale(.94)}
#inv-wrap.fly #inv-mag,#inv-wrap.gunner #inv-mag{display:none!important}
/* 🫁 ปุ่มกลั้นหายใจ — โผล่แทนปุ่มสลับปืนตอนเล็งอยู่ (ตอนเล็งไม่ต้องเปลี่ยนปืน) */
#inv-breath{position:absolute;left:120px;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;
  font-size:20px;cursor:pointer;display:none;box-shadow:0 4px 10px rgba(0,0,0,.5);
  background:radial-gradient(circle at 34% 28%,#dff6ff,#3f7fa8)}
#inv-breath:active{transform:scale(.94)}
#inv-wrap.scoped #inv-swap{display:none}
#inv-wrap.scoped #inv-breath{display:block}
#inv-wrap.fly #inv-breath,#inv-wrap.gunner #inv-breath{display:none!important}
#inv-swap:active,#inv-scope:active{transform:scale(.94)}
#inv-wrap.fly #inv-swap,#inv-wrap.fly #inv-scope,#inv-wrap.gunner #inv-swap,#inv-wrap.gunner #inv-scope{display:none!important}
/* กระสุนในแม็ก */
/* 🎯 รอบ 433 (ผู้ใช้สั่ง): ย้ายช่องกระสุนมาอยู่ "ถัดจากปุ่มออก" มุมบนซ้าย
   (เดิมอยู่ท้ายแผงสถานะ ทำให้แผงสูงจนชนปุ่ม/กระดานคะแนนบนจอเตี้ย) */
#inv-ammo{position:absolute;left:104px;top:11px;z-index:7;font-size:13px;font-weight:900;color:#ffe6a8;
  text-shadow:0 1px 3px #000;display:none;background:rgba(10,22,38,.72);border:1.5px solid rgba(255,214,138,.5);
  border-radius:999px;padding:5px 12px;pointer-events:none;white-space:nowrap}
#inv-ammo .am-ic{margin-right:4px}
#inv-ammo .am-max{font-size:11px;color:#bcd0e4;font-weight:700}
#inv-ammo .am-rl{color:#ffb45a;font-size:12px}
/* 🔭 ภาพในกล้องส่อง — ขอบดำวงกลม + เส้นเล็งกากบาท (ซ่อนเป้าเล็งปกติ) */
/* 🔭 หน้ากากกล้อง PiP — ดำนอกวงเลนส์ (ขนาดตั้งด้วย JS ให้ตรงกับ viewport ที่เรนเดอร์จริง)
   ⚠️ ห้ามใส่พื้นหลังทึบในวง! ภาพขยายอยู่ "บน canvas" ใต้ชั้นนี้ ถ้าทึบจะบังภาพในเลนส์ทั้งหมด */
#inv-scopeov{position:absolute;inset:0;z-index:4;pointer-events:none;display:none}
#inv-wrap.scoped #inv-scopeov{display:block}
#inv-wrap.scoped #inv-cross{display:none}
#inv-scopeov .so-mask{position:absolute;inset:0}
#inv-scopeov .so-ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius:50%;overflow:hidden;box-shadow:0 0 0 3px rgba(12,16,20,.95),0 0 26px 8px rgba(0,0,0,.55) inset}
#inv-scopeov i{position:absolute;background:rgba(16,26,20,.92)}
#inv-scopeov i.h{left:6%;right:6%;top:50%;height:1.5px;margin-top:-.75px}
#inv-scopeov i.v{top:6%;bottom:6%;left:50%;width:1.5px;margin-left:-.75px}
#inv-scopeov i.m{left:50%;width:1.5px;height:7px;margin-left:-.75px;background:rgba(16,26,20,.8)}
/* 📏 รอบ 464: จุดวัดระยะ + ตัวเลขกำกับ + ป้ายบอกระยะจริงใต้เรติเคิล */
#inv-scopeov b.md{position:absolute;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;
  background:rgba(16,26,20,.85)}
#inv-scopeov u.mdl{position:absolute;left:50%;margin-left:7px;font:700 9px/1 system-ui,sans-serif;
  color:rgba(16,26,20,.8);text-decoration:none}
#inv-scopeov .rng{position:absolute;left:50%;top:88%;transform:translateX(-50%);white-space:nowrap;
  font:800 11px/1 system-ui,sans-serif;color:#0f3b22;background:rgba(190,255,214,.55);
  border-radius:6px;padding:2px 7px;letter-spacing:.02em}
#inv-scopeov .dot{position:absolute;left:50%;top:50%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;
  background:#e63b2a;box-shadow:0 0 5px rgba(230,60,40,.9)}
/* 🎖️ ปุ่มขึ้นเป็นพลปืนประจำประตู — โผล่เฉพาะตอนมีเฮลิบินอยู่ใกล้ (คุมด้วย JS) */
#inv-gunner{position:absolute;right:96px;bottom:190px;width:60px;height:60px;font-size:24px;z-index:6;border:none;
  border-radius:50%;color:#fff;font-weight:900;cursor:pointer;display:none;
  box-shadow:0 5px 14px rgba(0,0,0,.55);-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 34% 28%,#ffe6a8,#c8901a)}
#inv-gunner:active{transform:scale(.94)}
/* พลปืนไม่ได้บังคับลำ → ซ่อนปุ่มไต่ระดับ/วิ่ง และไม่ต้องมีจอย */
#inv-wrap.gunner #inv-up,#inv-wrap.gunner #inv-down,#inv-wrap.gunner #inv-run,#inv-wrap.gunner #inv-joy{display:none}
#inv-wrap.gunner #inv-gunner{display:none!important}
#inv-heli:active,#inv-up:active,#inv-down:active{transform:scale(.94)}
/* 🚁 กรอบห้องนักบิน (canopy) — โผล่เฉพาะตอนบิน */
#inv-canopy{position:absolute;inset:0;z-index:2;pointer-events:none;display:none}
#inv-wrap.fly #inv-canopy{display:block}
#inv-canopy::before,#inv-canopy::after{content:"";position:absolute;background:rgba(20,26,34,.55)}
#inv-canopy::before{left:0;right:0;top:0;height:8%;box-shadow:0 6px 14px rgba(0,0,0,.4)}
#inv-canopy .strut{position:absolute;top:0;bottom:38%;width:10px;background:rgba(24,30,40,.6);transform-origin:top}
#inv-canopy .sl{left:16%;transform:rotate(11deg)}#inv-canopy .sr{right:16%;transform:rotate(-11deg)}
/* 🚁 รอบ 434: มุมมองในห้องนักบิน 3 ระดับ — กรอบกระจก/แผงหน้าปัดขยับตามเบาะ (เหมือนโลกเฮลิฯ) */
#inv-wrap.seat0 #inv-canopy::before{height:15%}
#inv-wrap.seat0 #inv-canopy .strut{bottom:22%;width:14px}
#inv-wrap.seat2 #inv-canopy::before{height:4%}
#inv-wrap.seat2 #inv-canopy .strut{bottom:52%;width:7px;opacity:.7}
#inv-canopy .dash{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(180deg,#2b3240,#151b25);
  border-top:2px solid rgba(255,255,255,.12);transition:height .18s}
#inv-wrap.seat0 #inv-canopy .dash{height:26%}
#inv-wrap.seat1 #inv-canopy .dash{height:13%}
#inv-wrap.seat2 #inv-canopy .dash{height:6%}
#inv-seat{position:absolute;right:88px;bottom:190px;z-index:6;border:none;border-radius:14px;width:62px;height:50px;
  font-size:19px;font-weight:900;color:#0e2136;cursor:pointer;display:none;line-height:1;
  box-shadow:0 4px 10px rgba(0,0,0,.5);background:linear-gradient(180deg,#eaf6ff,#a9d3f2)}
#inv-seat small{display:block;font-size:9.5px;margin-top:1px}
#inv-seat:active{transform:scale(.94)}
/* 🌀 ป้ายขั้นตอนสตาร์ทเครื่อง */
#inv-start{position:absolute;left:50%;top:44%;transform:translateX(-50%);z-index:8;display:none;text-align:center;
  background:rgba(6,16,28,.86);border:2px solid #7fe3ff;border-radius:14px;padding:9px 18px;
  color:#dff4ff;font-weight:900;font-size:15px;text-shadow:0 2px 6px #000;pointer-events:none;white-space:nowrap}
#inv-start.on{display:block}
@media (max-height:400px){ #inv-start{font-size:12px;padding:6px 12px;top:40%} #inv-seat{width:54px;height:44px;font-size:16px;right:70px;bottom:150px} }
/* 🏆 กระดานคะแนนสด (ผู้เล่นออนไลน์) */
#inv-board{position:absolute;right:12px;top:120px;z-index:5;pointer-events:none;min-width:118px;
  background:rgba(6,14,26,.7);border:1px solid rgba(120,220,255,.28);border-radius:10px;padding:5px 8px;display:none}
#inv-board.on{display:block}
#inv-board .bd-h{font-size:10px;color:#ffd98a;font-weight:800;margin-bottom:2px}
#inv-board .bd-r{display:flex;gap:5px;font-size:11px;color:#dbeaff;line-height:1.5;white-space:nowrap}
#inv-board .bd-r.me{color:#8fffb0;font-weight:800}
#inv-board .bd-r span:last-child{margin-left:auto;font-weight:800}
/* 💬 แชทสำเร็จรูป */
#inv-chat,#inv-map{position:absolute;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;font-size:20px;cursor:pointer;
  background:radial-gradient(circle at 34% 28%,#eaf6ff,#8fb6d6);box-shadow:0 4px 10px rgba(0,0,0,.5)}
#inv-chat{left:12px}
#inv-map{left:66px;background:radial-gradient(circle at 34% 28%,#d8ffd0,#4a9a52)}
#inv-map:active,#inv-chat:active{transform:scale(.94)}
/* 🌙 รอบ 471: ปุ่มสลับกลางวัน/กลางคืน — ต่อท้ายแถว 💬🗺️🎯 (12/66/120) จึงอยู่ที่ 174 ไม่ทับใคร */
#inv-night{position:absolute;left:174px;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;
  font-size:20px;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.5);-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 34% 28%,#ffeec0,#d09a2a)}
#inv-night.night{background:radial-gradient(circle at 34% 28%,#cfe0ff,#2b3f7a)}
#inv-night:active{transform:scale(.94)}
/* 🔦 รอบ 477: ปุ่มเปิด/ปิดไฟฉาย — **โผล่เฉพาะตอนฟ้ามืด** (กลางวันแถวปุ่มเท่าเดิม ไม่รกขึ้นเลย) */
#inv-torch{position:absolute;left:228px;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;
  font-size:20px;cursor:pointer;display:none;box-shadow:0 4px 10px rgba(0,0,0,.5);-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 34% 28%,#fff3c8,#c9a12a)}
#inv-torch.off{background:radial-gradient(circle at 34% 28%,#c9ccd2,#4a5058);filter:grayscale(.5)}
#inv-torch:active{transform:scale(.94)}
/* 🏮 รอบ 479: ปุ่มวางแท่งไฟเรืองแสง — โผล่เฉพาะตอนฟ้ามืดเหมือนปุ่มไฟฉาย */
#inv-glow{position:absolute;left:282px;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;
  font-size:20px;cursor:pointer;display:none;box-shadow:0 4px 10px rgba(0,0,0,.5);-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 34% 28%,#d6ffe6,#2f9a63)}
#inv-glow:active{transform:scale(.94)}
#inv-glow b{position:absolute;right:-2px;top:-2px;font-size:10px;background:#0e2136;color:#b6ffd2;
  border-radius:999px;padding:1px 4px;font-weight:900}
/* 🔭 รอบ 479: ขอบเลนส์ตอนเปิดกล้องมองกลางคืน (เขียวเรืองแบบ NV จริง) */
#inv-scopeov.nv .so-ring{box-shadow:inset 0 0 70px rgba(60,255,140,.30),0 0 0 2px rgba(80,255,150,.55)}
/* 👤 ป้าย "กำลังย่อง" — บอกเด็กว่ากลยุทธ์ดับไฟได้ผลจริง */
#inv-sneak{position:absolute;left:50%;top:78px;transform:translateX(-50%);z-index:6;display:none;white-space:nowrap;
  background:rgba(10,26,20,.72);border:1.5px solid rgba(140,255,190,.55);border-radius:999px;padding:3px 12px;
  color:#b6ffd2;font-weight:800;font-size:12.5px;text-shadow:0 1px 3px #000;pointer-events:none}
#inv-sneak.on{display:block}
#inv-chatbar{position:absolute;left:336px;bottom:14px;z-index:7;display:none;flex-wrap:wrap;gap:5px;max-width:60vw}
#inv-chatbar.on{display:flex}
#inv-chatbar button{border:none;border-radius:999px;padding:6px 11px;font-size:12.5px;font-weight:800;cursor:pointer;
  color:#0e2136;background:linear-gradient(180deg,#e9f4ff,#bcd9f5)}
#inv-selfmsg{position:absolute;left:50%;bottom:66px;transform:translateX(-50%);z-index:5;opacity:0;transition:opacity .2s;pointer-events:none;
  background:rgba(255,255,255,.92);color:#123;border-radius:10px;padding:4px 12px;font-size:13px;font-weight:800;white-space:nowrap}
#inv-selfmsg.on{opacity:1}
/* ---- แบนเนอร์กลางจอ ---- */
#inv-ban{position:absolute;left:50%;top:34%;transform:translate(-50%,-50%) scale(.7);opacity:0;z-index:8;
  text-align:center;pointer-events:none;transition:all .25s;white-space:nowrap;
  background:linear-gradient(180deg,rgba(10,26,44,.94),rgba(6,16,30,.94));border:2px solid #6fe0ff;color:#fff;
  border-radius:16px;padding:12px 26px;font-size:22px;font-weight:900;box-shadow:0 10px 34px rgba(0,0,0,.6)}
#inv-ban.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
#inv-ban .ib-coin{color:#ffd54f;font-size:19px}
#inv-ban .ib-sub{display:block;font-size:14px;color:#bfe4ff;font-weight:700;margin-top:3px}
/* ---- การ์ดวิธีเล่น / ยืนยันออก ---- */
#inv-intro,#inv-exitbox,#inv-mapbox{position:absolute;inset:0;z-index:9;background:rgba(4,8,16,.9);
  display:none;align-items:center;justify-content:center;padding:12px}
#inv-intro.on,#inv-exitbox.on,#inv-mapbox.on{display:flex}
/* 📖 การ์ดวิธีเล่น — เนื้อหายาว จัด 2 คอลัมน์บนจอกว้าง + ย่อบนจอเตี้ย
   (กฎ #7: ต้องเห็นครบทั้งใบ ไม่มีแถบเลื่อน · รอบ 431 เพิ่มบรรทัดบ้าน/เนินเขาแล้วเคยล้นจอ 812×375) */
@media (min-width:900px){
  #inv-intro p{columns:2;column-gap:26px;text-align:left}
  #inv-intro small{display:block;margin-top:6px}
}
@media (max-height:430px){
  #inv-intro .inv-card{padding:8px 14px}
  #inv-intro h3{font-size:15px;margin-bottom:3px}
  #inv-intro p{font-size:10.5px;line-height:1.42;margin-bottom:7px}
  #inv-intro small{font-size:9.5px;line-height:1.35}
  #inv-intro .inv-btn{padding:7px 20px;font-size:14px}
}
/* 🗺️ แผนที่เลือกจุดเกิด — รอบ 430: กางออกด้านข้างเกือบเต็มจอ + แยกเป็น 2 คอลัมน์
   (แผนที่ซ้าย · คำแนะนำ/ปุ่มขวา) → แผนที่ใหญ่ขึ้นมาก และกล่องเตี้ยลง ไม่มีแถบเลื่อน */
#inv-mapbox .inv-card{max-width:min(1400px,97vw);width:min(1400px,97vw);padding:12px 18px}
#inv-mapgrid{display:flex;gap:18px;align-items:center;justify-content:center}
#inv-mapside{flex:1 1 0;min-width:0;max-width:360px;text-align:left}
#inv-mapside p{margin:0 0 8px}
#inv-maplegend{font-size:12px;line-height:1.7;color:#bcd3ea;background:rgba(255,255,255,.05);
  border-radius:10px;padding:7px 10px;margin-bottom:10px}
#inv-mapwrap{position:relative;display:inline-block;line-height:0;margin:2px 0}
/* ⚠️ ขนาดผืนแผนที่ "คำนวณด้วย JS" ใน fitSpawnMap() ไม่ใช่ CSS —
   canvas ไม่รักษาสัดส่วนเองเหมือน <img> ถ้าใช้ max-height คู่ max-width ภาพจะยืดผิดส่วน
   และกล่องจะเกินจอจนมี scrollbar (ผิดกฎ "ทุกหน้าต่างต้องเห็นครบทั้งใบ") */
#inv-mapcv{border-radius:12px;border:2px solid #4fb9e8;cursor:crosshair;
  touch-action:manipulation;background:#d8c0a0;display:block}
#inv-mapname{font-size:13px;color:#ffd98a;font-weight:800;min-height:18px;margin-bottom:4px}
#inv-maphint{font-size:12px;color:#9fb6cf;margin-top:6px}
/* จอกลาง — บีบคอลัมน์คำแนะนำให้แคบลง เพื่อให้แผนที่ได้ที่มากที่สุด */
@media (max-width:1000px){
  #inv-mapgrid{gap:12px}
  #inv-mapside{max-width:270px}
  #inv-maplegend{font-size:11px;line-height:1.55;padding:5px 8px;margin-bottom:7px}
  #inv-mapside .inv-btn{padding:9px 18px;font-size:15px}
  #inv-maphint{font-size:10.5px}
}
/* ⚠️ เกมนี้บังคับเล่นแนวนอนอยู่แล้ว → คอลัมน์คู่แทบตลอด
   (เคยตั้ง breakpoint 900px แล้วจอ 812×375 กลับไปเรียงบนล่าง = แผนที่เหลือนิดเดียว + กล่องล้นจอ)
   เรียงบนล่างเฉพาะจอแคบจริงๆ เท่านั้น */
@media (max-width:640px){
  #inv-mapgrid{flex-direction:column;gap:8px}
  #inv-mapside{max-width:none;text-align:center;width:100%}
  #inv-maplegend{font-size:11px;line-height:1.5;padding:5px 8px;margin-bottom:6px}
}
@media (max-height:400px){
  #inv-maplegend{display:none}
  #inv-mapbox .inv-card{padding:8px 12px}
  #inv-mapbox h3{font-size:16px;margin-bottom:3px}
  #inv-mapbox p{font-size:11.5px;margin-bottom:5px}
  #inv-mapname{font-size:11px;min-height:14px}
  #inv-maphint{font-size:10.5px}
}
.inv-card{background:linear-gradient(180deg,#0f2136,#0a1626);border:2px solid #4fb9e8;border-radius:18px;
  padding:16px 22px;max-width:min(1040px,96vw);max-height:94vh;overflow:auto;text-align:center;color:#e8f4ff;
  box-shadow:0 14px 40px rgba(0,0,0,.7)}
.inv-card h3{margin:0 0 8px;font-size:22px;color:#7fe3ff}
.inv-card p{margin:0 0 12px;font-size:14px;line-height:1.6;color:#cfe0f2}
.inv-card b{color:#ffd98a}
.inv-btn{border:none;border-radius:999px;padding:11px 30px;font-size:17px;font-weight:900;color:#fff;cursor:pointer;
  background:linear-gradient(180deg,#3ad07f,#1c8f4e);box-shadow:0 5px 14px rgba(20,150,80,.5)}
.inv-btn.red{background:linear-gradient(180deg,#ef5350,#c62828);box-shadow:0 5px 14px rgba(160,30,30,.5)}
.inv-btn.amber{background:linear-gradient(180deg,#ffb74d,#ef8a1b);box-shadow:0 5px 14px rgba(170,110,20,.5);color:#26180a}
.inv-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
@media (max-width:820px){
  #inv-word .ic{min-width:22px;height:28px;font-size:17px}
  #inv-joy{width:96px;height:96px;bottom:62px}
  #inv-fire{width:86px;height:86px;font-size:28px;bottom:62px}
  #inv-fire2{width:66px;height:66px;font-size:23px;left:31px;bottom:170px}   /* กึ่งกลางตรงจอย (16+48) */
  #inv-rocket{width:62px;height:62px;font-size:22px;right:112px;bottom:88px}
  #inv-run{width:54px;height:54px;font-size:18px;right:112px;bottom:14px}
  #inv-heli{width:56px;height:56px;font-size:23px;bottom:174px;right:16px}
  #inv-gunner{width:54px;height:54px;font-size:21px;right:88px;bottom:174px}
  #inv-swap{width:42px;height:42px;font-size:18px;left:110px}
  #inv-night{width:42px;height:42px;font-size:18px;left:158px}
  #inv-torch{width:42px;height:42px;font-size:18px;left:206px}
  #inv-glow{width:42px;height:42px;font-size:18px;left:254px}
  #inv-breath{width:42px;height:42px;font-size:18px;left:110px}
  #inv-scope{width:52px;height:52px;font-size:20px;right:184px;bottom:136px}
  #inv-mag{width:48px;height:36px;font-size:14px;right:184px;bottom:88px}
  #inv-chatbar{left:302px}
  #inv-up,#inv-down{width:50px;height:44px;font-size:19px}
  #inv-up{right:184px;bottom:136px}#inv-down{right:184px;bottom:84px}
  .inv-card{padding:12px 16px}.inv-card h3{font-size:18px}.inv-card p{font-size:12.5px}
}
/* จอเตี้ย (มือถือ landscape) — จัดปุ่มให้กระชับ · ปุ่มไม่ทับกัน */
@media (max-height:400px){
  #inv-word{top:2px;padding:3px 10px 4px}
  #inv-word .ic{height:24px;font-size:15px;min-width:19px}
  #inv-word .iw-th,#inv-word .iw-tip{font-size:10px}
  #inv-joy{width:84px;height:84px;bottom:54px;left:10px}
  #inv-fire{width:76px;height:76px;font-size:24px;bottom:54px;right:12px}
  /* ⚠️ จอเตี้ย: กระดานคะแนนย้ายมาคอลัมน์ซ้าย (รอบ 418) → ปุ่มยิงซ้ายต้องเยื้องขวาพ้นกระดาน ไม่งั้นทับกัน */
  #inv-fire2{width:58px;height:58px;font-size:21px;left:136px;bottom:150px}
  #inv-ammo{left:90px;top:8px;font-size:11.5px;padding:4px 10px}
  #inv-rocket{width:54px;height:54px;font-size:19px;right:96px;bottom:76px}
  #inv-run{width:48px;height:48px;font-size:16px;right:96px;bottom:10px}
  #inv-stat{top:40px;min-width:120px}
  #inv-stat .inv-lb{font-size:10px}
  #inv-exit{font-size:11px;padding:5px 10px}
  /* ⚠️ กล่องเป้าหมายสูงไม่เท่ากัน: ตอนโชว์ "เกราะยานแม่" มีแถบพลังเพิ่ม สูงกว่าตอนโชว์ "ยานลูกเหลือ" ~15px
     → เว้นที่ให้เผื่อกรณีสูงสุด ไม่งั้นเหรียญโดนทับตอนเกราะเปิด (เจอจริงตอนเทสต์) */
  #inv-coins{top:84px}
  /* ⚠️ จอเตี้ย: คอลัมน์ขวาแน่นมาก (เป้าหมาย+เหรียญ+ปุ่มเฮลิ/พลปืน) กระดานคะแนนโตตามจำนวนคน
     จนชนปุ่ม → ย้ายกระดานไปคอลัมน์ซ้าย ใต้แถบสถานะ (ช่องว่างระหว่างแถบสถานะกับจอย) */
  #inv-board{left:12px;right:auto;top:152px;min-width:92px;max-width:120px;overflow:hidden}   /* คุมความกว้าง กันโตไปชนปุ่มยิงซ้าย (รอบ 434) */
  #inv-board .bd-r{font-size:10.5px;line-height:1.4}
  #inv-board .bd-h{font-size:9.5px}
  #inv-heli{width:48px;height:48px;font-size:19px;bottom:150px;right:12px}
  #inv-gunner{width:46px;height:46px;font-size:18px;right:70px;bottom:150px}
  #inv-swap{width:38px;height:38px;font-size:16px;left:100px;bottom:10px}
  #inv-night{width:38px;height:38px;font-size:15px;left:144px;bottom:10px}
  #inv-torch{width:38px;height:38px;font-size:15px;left:188px;bottom:10px}
  #inv-glow{width:38px;height:38px;font-size:15px;left:232px;bottom:10px}
  #inv-breath{width:38px;height:38px;font-size:16px;left:100px;bottom:10px}
  #inv-scope{width:46px;height:46px;font-size:18px;right:160px;bottom:104px}
  #inv-mag{width:44px;height:32px;font-size:13px;right:160px;bottom:64px}
  #inv-chatbar{left:276px}
  #inv-up,#inv-down{width:46px;height:40px;font-size:17px}
  #inv-up{right:160px;bottom:110px}#inv-down{right:160px;bottom:64px}
  #inv-chat,#inv-map{width:38px;height:38px;font-size:15px;bottom:10px}
  #inv-map{left:56px}
  #inv-chatbar{left:276px;bottom:10px}#inv-chatbar button{padding:5px 8px;font-size:11px}
}
/* จอเตี้ยพิเศษ (≤330px · จอสี่เหลี่ยมยาวมาก) — พื้นที่ขวาไม่พอวางกระดานคะแนน+ปุ่มเฮลิพร้อมกัน
   → ซ่อนกระดานคะแนนมุมขวา (multiplayer ยังทำงานเต็ม เห็นเพื่อนในฉาก+ป้ายชื่อ+แชท) */
@media (max-height:330px){
  #inv-intro h3{font-size:13px;margin-bottom:2px}
  #inv-intro p{font-size:9.5px;line-height:1.34;margin-bottom:5px}
  #inv-intro small{font-size:8.8px;line-height:1.3}
  #inv-board,#inv-board.on{display:none}
  /* 🔫 จอเตี้ยมาก: เหนือจอยไม่เหลือที่ (ชนแผงพลังชีวิต) → เยื้องไปมุมบนขวาของจอยแทน ยังอยู่ในระยะนิ้วซ้าย */
  /* จอเตี้ยมาก: เหนือจอยเป็นที่ของแผงสถานะ (สูงขึ้นอีกตอนอยู่ในเฮลิ) → วางชิดขวาจอยแทน นิ้วซ้ายยังถึง */
  #inv-fire2{width:50px;height:50px;font-size:19px;left:100px;bottom:56px}
  #inv-maphint{display:none}
  #inv-mapbox h3{font-size:14px;margin-bottom:2px}
  #inv-mapbox p{font-size:10.5px;margin-bottom:3px}   /* .on มี specificity สูงกว่า ต้องระบุคู่ ไม่งั้นไม่ยอมซ่อน */
  #inv-stat{min-width:108px}
  #inv-stat .inv-lb{font-size:9px}
}
`;

let wrapEl,cvEl,wordEl,hpEl,heatEl,misEl,tgtEl,msBarEl,coinsEl,banEl,introEl,exitBox,crossEl,hurtEl,flashEl,joyEl,joyKnob,fireBtn,fire2Btn,rocketBtn,runBtn;

function buildDom(){
  const st=document.createElement('style'); st.id='inv-style'; st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='inv-wrap';
  wrapEl.innerHTML=`
    <canvas id="inv-cv"></canvas>
    <div id="inv-vig"></div><div id="inv-hurt"></div><div id="inv-flash"></div>
    <div id="inv-scopeov">
      <div class="so-mask"></div>
      <div class="so-ring"><i class="h"></i><i class="v"></i><i class="m" style="top:32%"></i><i class="m" style="top:40%"></i><i class="m" style="top:60%"></i><i class="m" style="top:68%"></i><span class="dot"></span>
        <!-- 📏 รอบ 464: ขีดวัดระยะ (mil-dot) ใต้จุดกึ่งกลาง + ตัวเลขกำกับ -->
        <b class="md" style="top:58%"></b><b class="md" style="top:66%"></b><b class="md" style="top:74%"></b><b class="md" style="top:82%"></b>
        <u class="mdl" style="top:56.5%">1</u><u class="mdl" style="top:64.5%">2</u><u class="mdl" style="top:72.5%">3</u><u class="mdl" style="top:80.5%">4</u>
        <span class="rng"></span></div>
    </div>
    <div id="inv-cross"><i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><span class="dot"></span></div>
    <div id="inv-word"></div>
    <div id="inv-target"></div>
    <div id="inv-coins">🪙 +0</div>
    <div id="inv-cover">🏠 อยู่ในที่กำบัง — โดนยิงเบาลง</div>
    <div id="inv-sneak">👤 กำลังย่อง — ศัตรูมองแทบไม่เห็นเรา</div>
    <div id="inv-quiz"></div>
    <div id="inv-stat">
      <div class="inv-lb">❤️ พลังชีวิต</div><div class="inv-bar" id="inv-hp"><span></span></div>
      <div class="inv-lb" style="margin-top:5px">🔥 ความร้อนปืน</div><div class="inv-bar" id="inv-heat"><span></span></div>
      <div id="inv-mis"></div>
    </div>
    <div id="inv-ammo"></div>
    <div id="inv-canopy"><span class="strut sl"></span><span class="strut sr"></span><span class="dash"></span></div>
    <div id="inv-start"></div>
    <div id="inv-board"></div>
    <div id="inv-joy"><i></i></div>
    <button id="inv-fire">🔫</button>
    <button id="inv-fire2">🔫</button>
    <button id="inv-rocket">🚀</button>
    <button id="inv-run">🏃</button>
    <button id="inv-heli">🚁</button>
    <button id="inv-up">▲</button>
    <button id="inv-down">▼</button>
    <button id="inv-swap">🎯</button>
    <button id="inv-scope">🔭</button>
    <button id="inv-mag">6×</button>
    <button id="inv-breath">🫁</button>
    <button id="inv-gunner">🎖️</button>
    <button id="inv-seat">👁️<small>มุมบิน</small></button>
    <button id="inv-map">🗺️</button>
    <button id="inv-night">🌙</button>
    <button id="inv-torch">🔦</button>
    <button id="inv-glow">🏮<b>12</b></button>
    <button id="inv-chat">💬</button>
    <div id="inv-chatbar"></div>
    <div id="inv-selfmsg"></div>
    <button id="inv-exit">⬅️ ออก</button>
    <div id="inv-ban"></div>
    <div id="inv-intro"><div class="inv-card">
      <h3>🛸 ยานแม่บุกโลก!</h3>
      <p>ยานแม่ลำมหึมาลอยคลุมท้องฟ้าเมืองทะเลทราย — บนท้องยานมี<b>ช่องตัวอักษร</b>เรียงเป็นคำศัพท์ 1 คำ<br>
      👾 <b>ยานลูกบินออกมาเท่ากับจำนวนตัวอักษร</b> — ยิงตกทีละลำ ตัวอักษรของลำนั้นจะ<b>กะพริบ</b><br>
      ✨ ยิงครบทุกลำ = ตัวอักษรกะพริบทั้งแถว <b>เกราะยานแม่เปิด</b> → ระดมยิง/ยิงมิสไซล์จนระเบิด = 🪙${REWARD}<br>
      👥 <b>คุณไม่ได้สู้คนเดียว!</b> หน่วยรบภาคพื้น + ฝูงเฮลิคอปเตอร์ + <b>เพื่อนออนไลน์</b>ที่อยู่ในสมรภูมิเดียวกัน ช่วยกันสู้!<br>
      🚁 <b>เฮลิคอปเตอร์จอดจริง 5 ลำ!</b> เดินไปที่ลำ (จุด 🚁 ในแผนที่) → กดปุ่ม 🚁 ขึ้นเครื่อง →
      <b>รอสตาร์ทเครื่องครบขั้น</b> → ดันคันเร่งขึ้นบินยิงจรวดจากฟ้า! · กด 👁️ ปรับมุมมองในห้องนักบินได้ 3 ระดับ<br>
      🎯 <b>ปืน 2 กระบอก!</b> กดปุ่ม 🎯/🔫 สลับได้ — <b>ไรเฟิลจู่โจม</b> ยิงรัวเป้าใกล้ · <b>R93 สไนเปอร์</b> ยิงทีละนัดแรงมาก (ยานลูกดับนัดเดียว) แม็ก 10 นัด · กด 🔭 ส่องกล้อง (ในเลนส์ขยาย นอกเลนส์ยังเห็นรอบตัว) · ปุ่ม <b>4×/6×/8×</b> เลือกกำลังขยาย<br>
      🏠 <b>วิ่งเข้าไปหลบในบ้านได้!</b> บ้านร้างริมถนน (🏠 บนแผนที่) เข้าไปซุ่มยิงในนั้น <b>โดนยิงเบาลงมาก</b> ·
      ⛰️ <b>ยืนบนเนินสูง (🎯 จุดสูงข่ม) มองไกลกว่า</b> — วิ่งขึ้นเนินช้าลง ลงเนินไหลเร็วขึ้นนะ<br>
      🎖️ <b>ทีมเวิร์ก!</b> เดินเข้าใกล้เฮลิที่กำลังบิน แล้วกดปุ่ม 🎖️ = <b>ขึ้นเป็นพลปืนประจำประตู</b> —
      เพื่อนขับ เรายิงคุ้มกันรอบทิศจากบนฟ้า (คนละลำเดียวกันได้เลย)<br>
      🌙 <b>กลางวัน/กลางคืน!</b> ปุ่มมุมซ้ายล่าง (หรือคีย์ <b>N</b>) กดวน ☀️ กลางวัน → 🌙 กลางคืน → 🔄 <b>เวลาเดินเอง</b> (ตะวันตกดินรอบละ 4 นาที) — ฟ้าเต็มไปด้วยดาว 💡 ไฟถนนติดเอง ยานแม่เรืองแสงเด่น
      <b>ไฟฉายติดปืน</b>เปิดเองส่องทางให้ และทุกนัดที่ยิง <b>แสงปากลำกล้องจะสาดทั้งฉากวาบ</b>!<br>
      <small>📱 มือถือ: วงกลมซ้าย = เดิน/บิน · ลากครึ่งขวาของจอ = เล็ง · 🔫 ยิง (กดค้างได้) · 🚀 มิสไซล์ · 🏃 วิ่ง · 🚁 ขึ้นเฮลิ (▲▼ ไต่ระดับ) · 💬 คุยกับเพื่อน<br>
      💻 คอม: คลิกจอล็อกเมาส์ · WASD เดิน · Shift วิ่ง · คลิกซ้ายยิง · R มิสไซล์ · <b>F สลับปืน · G/คลิกขวา ส่องกล้อง</b> · H ขึ้นเฮลิ · Esc ปลดเมาส์<br>
      ⚠️ ระวังลำแสงจากยานลูกและยานแม่ — โดนแล้วพลังลด แต่<b>ไม่มีตาย</b> หลบสักพักพลังฟื้นเอง</small></p>
      <button class="inv-btn" id="inv-go">⚔️ เข้าสมรภูมิ!</button>
    </div></div>
    <div id="inv-mapbox"><div class="inv-card">
      <h3>🗺️ เลือกจุดลงสนาม</h3>
      <div id="inv-mapgrid">
        <div id="inv-mapwrap"><canvas id="inv-mapcv" width="860" height="530"></canvas></div>
        <div id="inv-mapside">
          <p>แตะบนแผนที่เพื่อเลือกว่าจะ<b>ลงตรงไหน</b><br><span id="inv-mapname"></span></p>
          <div id="inv-maplegend">
            🚁 วงฟ้า = เฮลิคอปเตอร์จอดอยู่ (เกิดตรงนั้นได้)<br>
            🟢 จุดเขียว = แนวกำบังที่มีหน่วยรบ<br>
            🟡 จุดเหลือง/ฟ้า = เพื่อนที่กำลังเล่นอยู่<br>
            ⛰️ <b>พื้นสว่าง = เนินเขาสูง</b> · พื้นเข้ม = ที่ต่ำ/แอ่ง<br>
            〰️ เส้นถี่ = <b>ลาดชัน</b> · เส้นห่าง = ที่ราบ<br>
            🎯 วงแดง = แกนพลังงานยานแม่ (เป้าหมาย)
          </div>
          <div class="inv-row">
            <button class="inv-btn" id="inv-mapgo">🪂 ลงตรงนี้!</button>
            <button class="inv-btn amber" id="inv-mapsnipe">🎯 จุดซุ่มยิง</button>
            <button class="inv-btn red" id="inv-maprand">🎲 สุ่มจุด</button>
          </div>
          <div id="inv-maphint">💡 ยืนบนเนินสูงจะเห็นสนามรบไกลกว่า — เหมาะกับ R93<br>เข้าเกมแล้วกดปุ่ม 🗺️ ย้ายจุดลงใหม่ได้ทุกเมื่อ</div>
        </div>
      </div>
    </div></div>
    <div id="inv-exitbox"><div class="inv-card">
      <h3>⬅️ ออกจากสมรภูมิ?</h3>
      <p>เหรียญที่เก็บได้จะถูกบันทึกไว้เรียบร้อยแล้วนะ</p>
      <div class="inv-row"><button class="inv-btn red" id="inv-exit-yes">ออกเลย</button>
      <button class="inv-btn" id="inv-exit-no">สู้ต่อ!</button></div>
    </div></div>`;
  document.body.appendChild(wrapEl);
  cvEl=document.getElementById('inv-cv');
  wordEl=document.getElementById('inv-word'); hpEl=document.getElementById('inv-hp');
  heatEl=document.getElementById('inv-heat'); misEl=document.getElementById('inv-mis');
  tgtEl=document.getElementById('inv-target'); coinsEl=document.getElementById('inv-coins');
  coverEl=document.getElementById('inv-cover');
  quizEl=document.getElementById('inv-quiz');
  banEl=document.getElementById('inv-ban'); introEl=document.getElementById('inv-intro');
  exitBox=document.getElementById('inv-exitbox'); crossEl=document.getElementById('inv-cross');
  layoutCross();                                   // 🎯 รอบ 458: วางจุดเล็งตาม AIM_OFF (ไม่ใช่กลางจอแล้ว)
  hurtEl=document.getElementById('inv-hurt'); flashEl=document.getElementById('inv-flash');
  joyEl=document.getElementById('inv-joy'); joyKnob=joyEl.querySelector('i');
  fireBtn=document.getElementById('inv-fire'); fire2Btn=document.getElementById('inv-fire2');
  rocketBtn=document.getElementById('inv-rocket');
  runBtn=document.getElementById('inv-run');
  heliBtn=document.getElementById('inv-heli'); upBtn=document.getElementById('inv-up'); downBtn=document.getElementById('inv-down');
  boardEl=document.getElementById('inv-board'); canopyEl=document.getElementById('inv-canopy');
  seatBtn=document.getElementById('inv-seat'); startEl=document.getElementById('inv-start');
  seatBtn.addEventListener('click',()=>{ setSeatView(seatLv+1);
    if(heliReady){ state.heliSeat=seatLv; if(typeof saveState==='function') saveState(); } });
  chatBtn=document.getElementById('inv-chat'); chatBarEl=document.getElementById('inv-chatbar'); selfMsgEl=document.getElementById('inv-selfmsg');
  gunnerBtn=document.getElementById('inv-gunner');
  swapBtn=document.getElementById('inv-swap'); scopeBtn=document.getElementById('inv-scope');
  magBtn=document.getElementById('inv-mag');
  breathBtn=document.getElementById('inv-breath');
  ammoEl=document.getElementById('inv-ammo');
  scopeMaskEl=wrapEl.querySelector('#inv-scopeov .so-mask');
  scopeRingEl=wrapEl.querySelector('#inv-scopeov .so-ring');
  scopeRngEl=wrapEl.querySelector('#inv-scopeov .rng');            // 📏 รอบ 464
  glowBtn=document.getElementById('inv-glow');                     // 🏮 รอบ 479
  glowBtn.addEventListener('click',dropGlowStick);
  torchBtn=document.getElementById('inv-torch');                   // 🔦 รอบ 477
  sneakEl=document.getElementById('inv-sneak');
  torchBtn.addEventListener('click',()=>{ flashOn=!flashOn;
    torchBtn.classList.toggle('off',!flashOn);
    toastBan(flashOn?'🔦 เปิดไฟฉาย<span class="ib-sub">มองเห็นทางชัด แต่ศัตรูก็เห็นเราชัดด้วย</span>'
                    :'🌑 ดับไฟฉาย<span class="ib-sub">มืดลงมาก แต่ย่องเข้าหาศัตรูได้!</span>',1500); });
  nightBtn=document.getElementById('inv-night');                   // 🌙 รอบ 471
  nightBtn.addEventListener('click',()=>setDayMode(dayMode==='day'?'night':dayMode==='night'?'auto':'day'));
  mapBtn=document.getElementById('inv-map'); mapBoxEl=document.getElementById('inv-mapbox');
  mapCv=document.getElementById('inv-mapcv'); mapNameEl=document.getElementById('inv-mapname');
  document.getElementById('inv-go').addEventListener('click',()=>{
    introEl.classList.remove('on'); resumeAudio();
    openSpawnMap();                                   // 🗺️ อ่านวิธีเล่นจบ → เลือกจุดลงสนามก่อนเริ่ม
  });
  document.getElementById('inv-exit').addEventListener('click',()=>{ exitBox.classList.add('on'); unlockMouse(); });
  document.getElementById('inv-exit-yes').addEventListener('click',exitWorld);
  document.getElementById('inv-exit-no').addEventListener('click',()=>exitBox.classList.remove('on'));
  bindInput();
}

/* ============================================================
   🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
   ============================================================ */
const Snd={
  ctx:null, hum:null, humGain:null,
  ac(){ if(!this.ctx){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return this.ctx; },
  on(){ return typeof state!=='undefined' && state.sound!==false; },
  /* 🔫 ปืนไรเฟิลพลังงาน — คลิกแหลม + เนื้อเสียงต่ำ */
  gun(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(880,t);
    o.frequency.exponentialRampToValueAtTime(120,t+.09);
    const g=c.createGain(); g.gain.setValueAtTime(.16,t); g.gain.exponentialRampToValueAtTime(.001,t+.10);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.11);
    this.noise(t,.09,2200,.10); },
  /* 🚀 มิสไซล์ออกตัว */
  missile(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.noise(t,.5,900,.22);
    const o=c.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(180,t);
    o.frequency.exponentialRampToValueAtTime(900,t+.45);
    const g=c.createGain(); g.gain.setValueAtTime(.10,t); g.gain.exponentialRampToValueAtTime(.001,t+.5);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.5); },
  /* 💥 ระเบิด (sc = สเกลความใหญ่ 1 = ยานลูก, 2.4 = ยานแม่) */
  boom(sc){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime; sc=sc||1;
    const dur=Math.min(2.4,.55*sc);
    const n=c.createBufferSource(), buf=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.7);
    n.buffer=buf; const lp=c.createBiquadFilter(); lp.type='lowpass';
    lp.frequency.setValueAtTime(2000,t); lp.frequency.exponentialRampToValueAtTime(70,t+dur);
    const g=c.createGain(); g.gain.setValueAtTime(Math.min(.85,.45*sc),t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
    n.connect(lp); lp.connect(g); g.connect(c.destination); n.start(t);
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(90*Math.max(.5,1/sc),t);
    o.frequency.exponentialRampToValueAtTime(24,t+dur*.8);
    const g2=c.createGain(); g2.gain.setValueAtTime(.45*Math.min(1.6,sc),t); g2.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(g2); g2.connect(c.destination); o.start(t); o.stop(t+dur); },
  /* 👾 ลำแสงเอเลี่ยน (เสียงกลวงหลอน) */
  beam(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(1400,t);
    o.frequency.exponentialRampToValueAtTime(180,t+.34);
    const g=c.createGain(); g.gain.setValueAtTime(.11,t); g.gain.exponentialRampToValueAtTime(.001,t+.36);
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1100; bp.Q.value=3;
    o.connect(bp); bp.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.37); },
  hit(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.noise(t,.18,600,.24); },
  /* ✅ ยิงโดน (ติ๊กสั้นให้รู้ว่าเข้าเป้า) */
  /* 🎯 R93: เสียงแตกดังก้อง + หางเสียงสะท้อน (ต่างจากปืนกลชัดเจน) */
  sniper(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(420,t);
    o.frequency.exponentialRampToValueAtTime(48,t+.22);
    const g=c.createGain(); g.gain.setValueAtTime(.30,t); g.gain.exponentialRampToValueAtTime(.001,t+.34);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.35);
    this.noise(t,.30,1500,.26);
    /* 🔊 รอบ 448 (ผู้ใช้ขอ "เสียงยิงก้องไกล" แบบคลิป): หางเสียงสะท้อนหลายชั้น
       ยิ่งชั้นหลังยิ่งเบา-ทึบ (ตัดความถี่สูงลง) = เสียงวิ่งไปกระทบตึกไกลๆ แล้วกลับมา */
    this.noise(t+.13,.50,900,.13);                    // สะท้อนตึกใกล้
    this.noise(t+.34,.70,520,.085);                   // สะท้อนตึกไกล
    this.noise(t+.62,.95,320,.05);                    // ก้องทุ่งกว้าง
    this.noise(t+1.05,1.2,210,.028);                  // หางสุดท้าย จางหายไปกับลม
  },
  /* 🔩 เสียงชักลูกเลื่อน/บรรจุกระสุน */
  bolt(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    [0,.13].forEach((dt,i)=>{
      const o=c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(i?260:340,t+dt);
      o.frequency.exponentialRampToValueAtTime(i?120:150,t+dt+.05);
      const g=c.createGain(); g.gain.setValueAtTime(.10,t+dt); g.gain.exponentialRampToValueAtTime(.001,t+dt+.07);
      o.connect(g); g.connect(c.destination); o.start(t+dt); o.stop(t+dt+.08);
      this.noise(t+dt,.06,3200,.07);
    }); },
  /* 🔩 รอบ 449: เสียงลูกเลื่อนแยก 2 จังหวะ ให้ตรงกับแอนิเมชันเป๊ะ
     boltPull = ดึงถอยหลัง "แชะ" (โลหะครูดแล้วกระแทกสุด) · boltPush = ดันกลับ+ล็อก "คลิก" (สั้น คม) */
  boltPull(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.noise(t,.10,2600,.075);                         // เสียงครูดตอนเริ่มดึง
    const o=c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(300,t);
    o.frequency.exponentialRampToValueAtTime(130,t+.07);
    const g=c.createGain(); g.gain.setValueAtTime(.09,t); g.gain.exponentialRampToValueAtTime(.001,t+.10);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.11);
    this.noise(t+.11,.05,1500,.06); },                   // กระแทกสุดระยะ
  boltPush(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(240,t);
    o.frequency.exponentialRampToValueAtTime(105,t+.05);
    const g=c.createGain(); g.gain.setValueAtTime(.10,t); g.gain.exponentialRampToValueAtTime(.001,t+.07);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.08);
    this.noise(t+.02,.05,3000,.08); },                   // เสียงล็อกคม
  /* 🎯 รอบ 469: เสียงกระสุนกระทบ "ตามวัสดุ" — ทราย(ตุบนุ่ม) · ปูน/หิน(แคร็กแหลม+เศษ) · โลหะยาน(ปิ๊ง)
     ดังตามระยะเช่นเดียวกับปลอกกระสุน (ไกล = เบาลง) */
  hitSand(dist){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const near=Math.max(0,1-(dist||0)/60); if(near<=.02) return;
    this.noise(t,.13,420,.075*near);
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(150,t);
    o.frequency.exponentialRampToValueAtTime(60,t+.12);
    const g=c.createGain(); g.gain.setValueAtTime(.05*near,t); g.gain.exponentialRampToValueAtTime(.001,t+.14);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.15); },
  hitWall(dist){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const near=Math.max(0,1-(dist||0)/60); if(near<=.02) return;
    this.noise(t,.05,5200,.10*near);                       // แคร็กแหลมตอนกระทบ
    this.noise(t+.05,.10,1600,.05*near);                   // เศษปูนร่วง
    const o=c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(520,t);
    o.frequency.exponentialRampToValueAtTime(180,t+.07);
    const g=c.createGain(); g.gain.setValueAtTime(.05*near,t); g.gain.exponentialRampToValueAtTime(.001,t+.09);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.10); },
  /* 🎯 รอบ 471: โดนเป้าฝึกยิง — ต้อง "แยกออกจาก hitWall/hitSand ให้ชัด" เด็กจะได้รู้ทันทีว่าเข้าเป้า
     ไม้ "ป๊อก" + กระดาษฉีก + กระดิ่งใสสองโน้ต (ได้ยินไกลกว่าเสียงกระทบวัสดุ: หาร 90 ไม่ใช่ 60) */
  hitTarget(dist){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const near=Math.max(0,1-(dist||0)/90); if(near<=.02) return;
    this.noise(t,.04,2400,.05*near);                       // กระดาษขาด
    const o=c.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(300,t);
    o.frequency.exponentialRampToValueAtTime(120,t+.10);   // ไม้ "ป๊อก"
    const g=c.createGain(); g.gain.setValueAtTime(.075*near,t); g.gain.exponentialRampToValueAtTime(.001,t+.12);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.13);
    [1320,1760].forEach((f,i)=>{                           // กระดิ่ง 2 โน้ต = "ได้แต้ม"
      const st=t+.02+i*.06;
      const b=c.createOscillator(); b.type='sine'; b.frequency.setValueAtTime(f,st);
      const bg=c.createGain(); bg.gain.setValueAtTime(.05*near,st); bg.gain.exponentialRampToValueAtTime(.0008,st+.32);
      b.connect(bg); bg.connect(c.destination); b.start(st); b.stop(st+.34);
    }); },
  /* 🔔 รอบ 466: ปลอกกระสุนกระทบพื้น "กริ๊ง" — ดังตามระยะจากตัวเรา (ไกล = เบา+ทึบ) */
  shell(dist){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const near=Math.max(0,1-(dist||0)/9);                 // เกิน 9 เมตรแทบไม่ได้ยิน
    if(near<=0.02) return;
    const f0=1500+Math.random()*900;
    [0,.045].forEach((dt,i)=>{
      const o=c.createOscillator(); o.type='triangle';
      o.frequency.setValueAtTime(f0*(i?1.34:1),t+dt);
      o.frequency.exponentialRampToValueAtTime(f0*(i?.9:.72),t+dt+.12);
      const g=c.createGain(); g.gain.setValueAtTime(.055*near*(i?.55:1),t+dt);
      g.gain.exponentialRampToValueAtTime(.0008,t+dt+(i?.10:.16));
      o.connect(g); g.connect(c.destination); o.start(t+dt); o.stop(t+dt+.18);
    });
    this.noise(t,.03,2600,.02*near); },
  /* 🔁 รอบ 465: เสียงเปลี่ยนปืน 2 จังหวะ ให้ตรงท่าใหม่
     swapDown = ตอนลดปืน (ผ้าเสียดสี + โลหะหน่วง) · swapUp = ตอนยกขึ้นล็อกเข้าที่ ("คลิก" คม) */
  swapDown(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.noise(t,.14,760,.06);
    const o=c.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(220,t);
    o.frequency.exponentialRampToValueAtTime(120,t+.13);
    const g=c.createGain(); g.gain.setValueAtTime(.07,t); g.gain.exponentialRampToValueAtTime(.001,t+.15);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.16); },
  swapUp(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(300,t);
    o.frequency.exponentialRampToValueAtTime(140,t+.05);
    const g=c.createGain(); g.gain.setValueAtTime(.09,t); g.gain.exponentialRampToValueAtTime(.001,t+.07);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.08);
    this.noise(t+.03,.05,3400,.075); },                 // คลิกล็อกแม็กเข้าที่
  /* 📣 รอบ 471: ทหารตะโกน — สังเคราะห์ให้ "เหมือนเสียงคน" ด้วยฟอร์แมนต์ 2 ชั้น
     (ไม่ใช่คำพูดจริง แต่จำนวนพยางค์/จังหวะตรงกับข้อความที่ลอยเหนือหัว) · ดังตามระยะ */
  shout(dist,syl){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const near=Math.max(0,1-(dist||0)/55); if(near<=.03) return;
    const n=Math.max(1,Math.min(5,syl||2));
    const base=132+Math.random()*46;                     // โทนเสียงผู้ชายตะโกน (สุ่มให้ทหารไม่เสียงเดียวกันหมด)
    this.noise(t,.05,1900,.014*near);                    // ลมหายใจนำหน้าคำ
    for(let i=0;i<n;i++){
      const st=t+i*.185, dur=(i===n-1)?.22:.15;          // พยางค์ท้ายลากยาว = สำเนียงตะโกน
      const f0=base*(i===n-1?1.16:1)*(1+i*.03);
      const o=c.createOscillator(); o.type='sawtooth';
      o.frequency.setValueAtTime(f0*.9,st);
      o.frequency.linearRampToValueAtTime(f0*1.14,st+dur*.35);
      o.frequency.linearRampToValueAtTime(f0*.86,st+dur);
      const fa=c.createBiquadFilter(); fa.type='bandpass'; fa.frequency.value=600+Math.random()*190; fa.Q.value=6;
      const fb=c.createBiquadFilter(); fb.type='bandpass'; fb.frequency.value=1160+Math.random()*280; fb.Q.value=8;
      const g=c.createGain(); g.gain.setValueAtTime(.0008,st);
      g.gain.exponentialRampToValueAtTime(.095*near,st+.035);
      g.gain.exponentialRampToValueAtTime(.0008,st+dur);
      const gb=c.createGain(); gb.gain.value=.55;
      o.connect(fa); fa.connect(g); o.connect(fb); fb.connect(gb); gb.connect(g);
      g.connect(c.destination); o.start(st); o.stop(st+dur+.03);
    } },
  /* 🫁 รอบ 449: หายใจแรงตอนวิ่งนาน (หายใจออก 1 ครั้ง) */
  pant(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.noise(t,.22,520,.075); this.noise(t+.26,.18,340,.045); },
  /* 🫁 รอบ 505: ลมหายใจตอนกลั้น (ดูโซน BREATH_FX) — ลมผ่านคอ = noise ผ่าน bandpass ที่กวาดความถี่
     ต่างจาก noise() เดิมตรง "คุมซองเสียงเองได้" (สูดเข้า = ค่อยดังขึ้นแล้วตัด · ผ่อนออก = ดังทันทีแล้วจางยาว)
     นับจำนวนที่สร้างจริงไว้ที่ Snd.breathN (ใช้ตรวจตอนเทสต์: _t.breathFx.n) */
  breathN:{in:0,out:0,strain:0},
  breathAir(t,dur,f0,f1,vol,rise,q){ const c=this.ctx; if(!c) return;
    const len=Math.max(1,Math.floor(c.sampleRate*dur));
    const n=c.createBufferSource(), buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    n.buffer=buf;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=q||1.2;
    bp.frequency.setValueAtTime(f0,t); bp.frequency.exponentialRampToValueAtTime(f1,t+dur);
    const g=c.createGain(); g.gain.setValueAtTime(.0008,t);
    g.gain.exponentialRampToValueAtTime(vol,t+dur*(rise?.70:.12));
    g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t); n.stop(t+dur+.02); },
  /* 🫁 สูดลมเข้าลึกสั้น ๆ ครั้งเดียว (กดปุ่มกลั้นหายใจ) — ลมกวาดจากต่ำขึ้นสูงแล้วตัดจบ = "ฮึบ" */
  breathIn(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.breathAir(t,.36,300,1450,.085,1,1.4);
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(120,t);
    o.frequency.linearRampToValueAtTime(178,t+.30);                 // เนื้อเสียงอก ให้รู้สึกว่าอัดลมเต็มปอด
    const g=c.createGain(); g.gain.setValueAtTime(.001,t); g.gain.exponentialRampToValueAtTime(.030,t+.24);
    g.gain.exponentialRampToValueAtTime(.001,t+.36);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.37);
    this.breathN.in++; },
  /* 🫁 ผ่อนลมออก (ปล่อยปุ่ม หรือ ลมหมด) — ดังทันทีแล้วจางยาวกว่าตอนสูด */
  breathOut(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.breathAir(t,.55,1100,240,.072,0,1.0);
    this.breathAir(t+.30,.34,420,180,.030,0,.9);                    // หางลมสุดท้าย
    this.breathN.out++; },
  /* 🫁 สั่น/อึดอัดตอนลมใกล้หมด (k 0→1 ยิ่งมากยิ่งอั้นไม่ไหว) — ลมสั่นเป็นห้วงถี่ ๆ เบา ๆ */
  breathStrain(k){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    k=Math.max(0,Math.min(1,k||0));
    const n=2+Math.round(k*2);                                      // ยิ่งอั้นไม่ไหว ห้วงยิ่งถี่
    for(let i=0;i<n;i++) this.breathAir(t+i*.085,.075,520+i*70,300,(.020+.026*k),0,2.2);
    const o=c.createOscillator(); o.type='triangle';
    o.frequency.setValueAtTime(96+18*k,t);
    o.frequency.linearRampToValueAtTime(72,t+.26);                  // เสียงคอสั่นต่ำ ๆ
    const g=c.createGain(); g.gain.setValueAtTime(.001,t);
    g.gain.exponentialRampToValueAtTime(.010+.016*k,t+.06); g.gain.exponentialRampToValueAtTime(.001,t+.28);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.29);
    this.breathN.strain++; },
  /* 🎬 เสียงยกปืนเข้าเล็ง / ลดปืนลง (ผ้า+โลหะเบาๆ ให้รู้สึกมีมวล) */
  ads(inOn){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    this.noise(t,.13,inOn?900:620,.055);
    const o=c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(inOn?190:250,t); o.frequency.exponentialRampToValueAtTime(inOn?250:170,t+.12);
    const g=c.createGain(); g.gain.setValueAtTime(.001,t); g.gain.exponentialRampToValueAtTime(.055,t+.03);
    g.gain.exponentialRampToValueAtTime(.001,t+.14);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.15); },
  ping(){ if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
    const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(1500,t);
    const g=c.createGain(); g.gain.setValueAtTime(.09,t); g.gain.exponentialRampToValueAtTime(.001,t+.07);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.08); },
  noise(t,dur,freq,vol){ const c=this.ctx; if(!c) return;
    const n=c.createBufferSource(), buf=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
    n.buffer=buf; const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=freq; bp.Q.value=.8;
    const g=c.createGain(); g.gain.value=vol; n.connect(bp); bp.connect(g); g.connect(c.destination); n.start(t); },
  /* 🛸 เสียงหึ่งของยานแม่ (ลูปเบาๆ ตลอดฉาก — ให้รู้สึกว่ามีอะไรใหญ่มากอยู่เหนือหัว) */
  startHum(){ if(!this.on()) return; const c=this.ac(); if(!c||this.hum) return;
    const o=c.createOscillator(); o.type='sawtooth'; o.frequency.value=41;
    const o2=c.createOscillator(); o2.type='sine'; o2.frequency.value=27;
    const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=140;
    const g=c.createGain(); g.gain.value=.05;
    o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(c.destination);
    o.start(); o2.start(); this.hum=[o,o2]; this.humGain=g; },
  stopHum(){ if(this.hum){ this.hum.forEach(o=>{ try{o.stop()}catch(e){} }); this.hum=null; this.humGain=null; } },
  /* 🚁 เสียงใบพัดเฮลิ (ลูป — สตาร์ทตอนขึ้นเฮลิ หยุดตอนลง/ออกโลก) */
  rotor:null, rotorG:null,
  startRotor(){ if(!this.on()) return; const c=this.ac(); if(!c||this.rotor) return;
    const buf=c.createBuffer(1,c.sampleRate,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const n=c.createBufferSource(); n.buffer=buf; n.loop=true;
    const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=260;
    const g=c.createGain(); g.gain.value=.09;
    /* จังหวะ "ฟับๆ" ของใบพัด — LFO คุม gain */
    const lfo=c.createOscillator(); lfo.type='sine'; lfo.frequency.value=13;
    const lg=c.createGain(); lg.gain.value=.06; lfo.connect(lg); lg.connect(g.gain);
    n.connect(lp); lp.connect(g); g.connect(c.destination); n.start(); lfo.start();
    this.rotor=[n,lfo]; this.rotorG=g; },
  stopRotor(){ if(this.rotor){ this.rotor.forEach(o=>{ try{o.stop()}catch(e){} }); this.rotor=null; this.rotorG=null; } },
};
function resumeAudio(){ const c=Snd.ac(); if(c&&c.state==='suspended') c.resume(); Snd.startHum();
  if(Snd.startNightAir) Snd.startNightAir(); }        // 🔇 รอบ 477: ลมกลางคืน (ดังตาม nightK)

/* ============================================================
   🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
   ============================================================ */
const texCache={};
/* แปะภาพจริงถ้ามีไฟล์ (ไม่มี = เงียบๆ ใช้สีเดิม) — แพตเทิร์นเดียวกับ applyTex ใน adventure3d */
function tryTex(mat,path,rx,ry){
  const img=new Image();
  img.onload=()=>{ const t=new THREE.Texture(img); t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.repeat.set(rx||1,ry||1); t.needsUpdate=true; mat.map=t; mat.needsUpdate=true; };
  img.onerror=()=>{};
  img.src=path;
}
/* 🔠 ป้ายตัวอักษรบนยานแม่ — ช่องโลหะมืด + ตัวอักษรเรืองแสง */
function letterPanelTex(ch,lit){
  const cv=document.createElement('canvas'); cv.width=cv.height=256;
  const x=cv.getContext('2d');
  x.fillStyle=lit?'#2a0a08':'#140f12'; x.fillRect(0,0,256,256);
  // ขอบช่องโลหะ
  x.strokeStyle=lit?'#ff7a5a':'#3a3f4a'; x.lineWidth=12; x.strokeRect(9,9,238,238);
  x.strokeStyle='#1b2029'; x.lineWidth=4; x.strokeRect(24,24,208,208);
  // ตัวอักษร
  x.font='bold 176px system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
  x.shadowColor=lit?'#fff2a0':'#ff2a1a'; x.shadowBlur=lit?46:26;
  x.fillStyle=lit?'#fff6c8':'#ff3b28';
  x.fillText(ch.toUpperCase(),128,140);
  x.shadowBlur=0;
  const t=new THREE.CanvasTexture(cv); return t;
}
/* 🔤 ตัวอักษรลอยเหนือยานลูก (ให้เด็กรู้ว่าลำไหนคือตัวไหน) */
function letterSpriteTex(ch){
  const k='ls_'+ch; if(texCache[k]) return texCache[k];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const x=cv.getContext('2d');
  x.font='bold 96px system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
  x.lineWidth=10; x.strokeStyle='#06121f'; x.strokeText(ch.toUpperCase(),64,68);
  x.fillStyle='#8ff0ff'; x.shadowColor='#3fd0ff'; x.shadowBlur=18; x.fillText(ch.toUpperCase(),64,68);
  return texCache[k]=new THREE.CanvasTexture(cv);
}
/* 🏜️ ทรายเมล็ดหยาบ (โทนอุ่นตะวันออกกลาง) */
function sandTex(){
  if(texCache.sand) return texCache.sand;
  const cv=document.createElement('canvas'); cv.width=cv.height=256;
  const x=cv.getContext('2d');
  x.fillStyle='#d9b98a'; x.fillRect(0,0,256,256);
  for(let i=0;i<16000;i++){
    const v=Math.random();
    x.fillStyle=v<.5?'rgba(180,146,100,.5)':(v<.85?'rgba(240,216,176,.45)':'rgba(120,96,64,.28)');
    x.fillRect(Math.random()*256,Math.random()*256,1.6,1.6);
  }
  // ริ้วลมทะเลทราย
  x.globalAlpha=.10; x.strokeStyle='#8a6b44'; x.lineWidth=2;
  for(let i=0;i<26;i++){ x.beginPath();
    const y=Math.random()*256; x.moveTo(0,y);
    for(let px=0;px<=256;px+=16) x.lineTo(px,y+Math.sin(px*.06+i)*3.5);
    x.stroke(); }
  x.globalAlpha=1;
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(70,70);
  return texCache.sand=t;
}
/* 🧱 ผนังดินเผา/ปูนฉาบ แบบบ้านตะวันออกกลาง */
function wallTex(tone){
  const k='wall'+tone; if(texCache[k]) return texCache[k];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const x=cv.getContext('2d');
  x.fillStyle=tone; x.fillRect(0,0,128,128);
  for(let i=0;i<2200;i++){ x.fillStyle=Math.random()<.5?'rgba(0,0,0,.06)':'rgba(255,255,255,.06)';
    x.fillRect(Math.random()*128,Math.random()*128,2,2); }
  // รอยแตก/คราบ
  x.strokeStyle='rgba(90,70,50,.22)'; x.lineWidth=1;
  for(let i=0;i<7;i++){ x.beginPath(); let px=Math.random()*128, py=Math.random()*128; x.moveTo(px,py);
    for(let s=0;s<5;s++){ px+=rnd(-14,14); py+=rnd(4,16); x.lineTo(px,py); } x.stroke(); }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping;
  return texCache[k]=t;
}

/* ============================================================
   🌍 สถานะฉาก
   ============================================================ */
let built=false, running=false, rafId=0, lastT=0;
let renderer,scene,camera;
let px=0, pz=90, py=EYE, yaw=0, pitch=0.35;
let word=null, letters=[];            // letters = ช่องตัวอักษรบนยานแม่ [{ch,mesh,down}]
let mother=null, msArmor=MS_HP, msOpen=false, msDead=false, msBeamAt=0, msRecover=false;
let fighters=[], fShots=[], myShots=[], missiles=[], fx=[], squad=[], helis=[];
/* 🚀 รอบ 467: กระสุนมีเวลาเดินทาง — ความเร็ว (ม./วิ) + คิวกระสุนที่ยังลอยอยู่ */
const BULLET_SPD_R93=760, BULLET_SPD_RIFLE=420;
let bullets=[];
let hp=PLAYER_HP, lastHurt=0;
let heat=0, overheat=false, lastFire=0, firing=false, misLeft=MIS_MAX, misReloadAt=0;
let sessionCoins=0, sessionWords=0, shake=0;
let gunGrp=null, gunArms=null, gunRecoil=0, muzzle=null, muzzleUntil=0;
let vmScene=null, vmCam=null, muzzleLight=null, worldFlash=null;      // 🎥 รอบ 451: ฉาก+กล้องเฉพาะของ view model (ปืนในมือ)
/* 🎯 รอบ 419: ระบบ 2 กระบอก (ไรเฟิล / R93 สไนเปอร์) */
let weapon='rifle', gunModels={}, r93Ammo=WEAPONS.r93.mag, reloadAt=0, scoped=false, firedThisPress=false;
let swapBtn=null, scopeBtn=null, magBtn=null, breathBtn=null, ammoEl=null, scopeMaskEl=null, scopeRingEl=null, scopeRngEl=null;
let keys={}, joy={id:null,cx:0,cy:0,dx:0,dy:0}, lookId=null, lookX=0, lookY=0, isRun=false;
let keydownFn,keyupFn,resizeFn;
/* 🚁 สถานะขับเฮลิเอง */
let inHeli=false, phVel={x:0,y:0,z:0}, phClimb=0, hLanded=false, phMisLeft=PH_MIS_MAX, phMisReloadAt=0;
/* 🌐 ผู้เล่นออนไลน์ */
let peers={}, worldRef=null, myRef=null, netOk=false, lastNetSend=0, myChat=null;
/* 🤝 รอบ 417: สมรภูมิร่วม — ทุกคนสู้ "ยานแม่ลำเดียวกัน" เห็นตรงกันทุกเครื่อง
   วิธี (ไม่ต้องแก้ rules เลย ใช้ field เดิม cw/hp ที่อนุญาตอยู่แล้ว):
     · หัวหน้าห้อง (uid น้อยสุด) ประกาศคำ+เลขรอบใน `cw` = "en|th|round"
     · ทุกคนประกาศผลงานตัวเองใน `hp` = "round|บิตยานลูกที่ตัวเองยิงตก|ดาเมจที่ทำกับยานแม่"
     · ทุกเครื่องรวม (OR บิต / บวกดาเมจ) เอง = สถานะตรงกันโดยไม่ต้องมีเซิร์ฟเวอร์ */
let battleRound=0, myKill=0, myArmorDmg=0;
let boardEl=null, chatBtn=null, chatBarEl=null, selfMsgEl=null, heliBtn=null, upBtn=null, downBtn=null, canopyEl=null;
let mapBtn=null, mapBoxEl=null, mapCv=null, mapNameEl=null, mapPick=null;   // 🗺️ เลือกจุดลงสนาม
let coverEl=null, snipeIdx=-1;         // 🏠🎯 ป้ายที่กำบัง + จุดสูงข่มที่เลือกอยู่ (รอบ 431)
let quizEl=null;                       // 🔎 รอบ 473: แถบโจทย์ "ยิงเป้าที่แปลว่า …"
let seatBtn=null, startEl=null;        // 🚁 ปุ่มปรับมุมมองห้องนักบิน + ป้ายขั้นตอนสตาร์ท (รอบ 434)
let gunnerBtn=null, riding=null;   // 🎖️ พลปืนประจำประตู: riding = key ของลำที่นั่งอยู่ (uid เพื่อน หรือ 'botN')
let terrainH=null;                     // ฟังก์ชันความสูงพื้นทราย
let solids=[];                         // กันชนตึก {x,z,r}
let msLamps=[], msCore=null, msGlow=null, msBoard=null, msPlate=null;

/* ============================================================
   📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
   ไม่มีไฟล์ = เงียบๆ ใช้ทรงที่โค้ดสร้างไว้ต่อไป
   ⚡ cache ต่อ path แล้ว clone ให้ทุกครั้ง — ยานลูก 1 คำมีหลายลำ ต้องโหลดไฟล์ครั้งเดียวพอ (ไม่งั้นโหลด 2.5MB ซ้ำทุกลำ)
   GLTFLoader ไม่ได้อยู่ใน three.min.js → ui.js โหลด js/vendor/GLTFLoader.js มาก่อนแล้ว (มี fallback เผื่อ)
   ============================================================ */
const glbCache={};                 // path -> gltf.scene ต้นฉบับ (clone ได้)
let glbLoaderPending=[];           // คิว callback ที่รอ GLTFLoader โหลดเสร็จ
const glbWait={};                  // 🐛 รอบ 436: คิว callback ต่อ path — กัน "โหลดไฟล์เดียวกันพร้อมกันหลายรอบ"
function loadGlb(path,cb){
  if(glbCache[path]){ cb(glbCache[path].clone(true)); return; }
  if(!THREE.GLTFLoader){           // ยังไม่มี loader → โหลด script แล้วค่อยลองใหม่ (โหลดครั้งเดียว)
    glbLoaderPending.push(()=>loadGlb(path,cb));
    if(glbLoaderPending.length===1){
      const s=document.createElement('script'); s.src='js/vendor/GLTFLoader.js';
      s.onload=()=>{ const q=glbLoaderPending; glbLoaderPending=[]; q.forEach(fn=>fn()); };
      s.onerror=()=>{ glbLoaderPending=[]; };
      document.head.appendChild(s);
    }
    return;
  }
  /* ⚠️ รอบ 436: ของเดิม ทหาร 18 คนเรียกพร้อมกัน = ยิง GLTFLoader 18 ครั้ง ได้ "ต้นฉบับคนละก้อน"
     (glbCache โดนเขียนทับไปมา) → โหลดไฟล์เดียวซ้ำ 18 รอบเปลืองเน็ตมาก และการแก้ต้นฉบับ
     (เช่นอบทิศให้หันหน้าถูก) มีผลแค่ก้อนเดียว ที่เหลือหันหลังหมด — ต้นตอ "บอทหันหลังยิง"
     → เข้าคิวต่อ path: โหลดจริงครั้งเดียว แล้วแจก clone จาก cache ให้ทุกคน */
  if(glbWait[path]){ glbWait[path].push(cb); return; }
  glbWait[path]=[cb];
  const flush=()=>{ const q=glbWait[path]||[]; delete glbWait[path];
    if(glbCache[path]) q.forEach(f=>f(glbCache[path].clone(true))); };
  try{
    new THREE.GLTFLoader().load(path,g=>{
      if(g&&g.scene){ tameGlbMaterials(g.scene); glbCache[path]=g.scene; }
      flush();
    },undefined,()=>{ delete glbWait[path]; });
  }catch(e){ delete glbWait[path]; }
}
/* ⚠️ โมเดลที่เจนจาก AI มักตั้ง metalness สูง (เหล็ก/ปืน) — ฉากนี้ไม่มี environment map
   ผิวโลหะจึงเรนเดอร์ออกมา "ดำสนิท" (เจอจริง: ปืนกลายเป็นก้อนดำบังจอ)
   → ดึง metalness ลง + ยก roughness ขึ้น + กันสีดำสนิท ให้ไฟธรรมดาส่องติด */
function tameGlbMaterials(root){
  root.traverse(c=>{
    if(!c.isMesh||!c.material) return;
    (Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{
      if(typeof m.metalness==='number') m.metalness=Math.min(m.metalness,.28);
      if(typeof m.roughness==='number') m.roughness=Math.max(m.roughness,.45);
      if(m.color && (m.color.r+m.color.g+m.color.b)<.28) m.color.setRGB(.17,.17,.19);
      m.needsUpdate=true;
    });
  });
}
/* ย่อ/ขยายโมเดลให้ด้านกว้างสุดเท่ากับ size แล้วจัดให้ศูนย์กลางอยู่ที่ origin */
function fitInto(obj,size){
  const box=new THREE.Box3().setFromObject(obj);
  const s=new THREE.Vector3(); box.getSize(s);
  const k=size/Math.max(s.x,s.y,s.z||1);
  obj.scale.setScalar(k);
  const c=new THREE.Vector3(); box.getCenter(c);
  obj.position.sub(c.multiplyScalar(k));
}

/* ============================================================
   🏜️ สร้างฉากทะเลทราย + เมือง
   ============================================================ */
/* ⛰️ รอบ 430: เนินเขาลูกใหญ่ประจำแผนที่ (ผู้ใช้สั่ง "อย่ามีแต่พื้นราบ")
   ⚠️ ต้องเป็น "ค่าตายตัว" ห้ามสุ่ม — ผู้เล่นออนไลน์ทุกเครื่องต้องเห็นภูมิประเทศเดียวกันเป๊ะ
   (ถ้าสุ่ม เพื่อนจะจมดิน/ลอยฟ้าในสายตาอีกเครื่องทันที) */
const HILLS=[
  {x:-215,z:-165,r:135,h:30},   // เนินสูงฝั่งซ้ายหน้า (ที่มั่นมองยานแม่)
  {x: 250,z:-105,r:160,h:38},   // เนินใหญ่สุดฝั่งขวา
  {x: 135,z: 215,r:120,h:22},   // เนินหลังแนวหลัง
  {x:-265,z: 195,r:140,h:26},
  {x: -55,z:-320,r:180,h:34},   // สันเขาไกลใต้เงายานแม่
  {x: 330,z: 300,r:150,h:28},
  {x:-350,z: -60,r:120,h:20},
];
function buildTerrain(){
  /* พื้นทราย: คลื่นเบาๆ + เนินเขา/สันเขา/ร่องน้ำแห้ง (ใช้ฟังก์ชันเดียวกับตอนผู้เล่นเดิน = ไม่ลอย/ไม่จม) */
  const H=(x,z)=>{
    /* ① คลื่นทรายพื้นฐาน (ของเดิม) */
    let h = Math.sin(x*0.0075)*2.6 + Math.cos(z*0.0091)*2.2 + Math.sin((x+z)*0.0031)*3.4;
    /* ② ลูกคลื่นเล็ก — กันไม่ให้พื้นเรียบเป็นกระดาน */
    h += Math.sin(x*0.031+z*0.017)*0.55 + Math.cos(z*0.028-x*0.013)*0.45;
    /* ③ เนินเขาลูกใหญ่ + สันเขายาว + ร่องน้ำแห้ง (ส่วนที่ "ปรับให้ราบ" ได้ตรงถนน) */
    let hill=0;
    for(const k of HILLS){
      const d=Math.hypot(x-k.x,z-k.z);
      if(d<k.r){ const t=1-d/k.r; hill += k.h*t*t*(3-2*t); }   // smoothstep = เชิงเนินลาดนุ่ม ไม่เป็นกรวย
    }
    hill += Math.sin(x*0.0042+1.1)*Math.cos(z*0.0037-0.6)*7.5;  // สันเขา/แอ่งกว้างสลับกันทั้งแผนที่
    hill += Math.sin((x*0.6+z*0.8)*0.0090)*3.2;                 // ลอนเฉียงซ้อนอีกชั้น
    /* ④ ถนนสมรภูมิต้องเดินรบได้ → รีดเนินออกเฉพาะในแนวถนน (ยังลาดตามยาวนิดๆ ไม่แบนสนิท) */
    const wx=Math.max(0, 1-Math.max(0,Math.abs(x)-STREET_HW-8)/38);
    const z0=STREET_Z0-STREET_LEN-25, z1=STREET_Z0+55;
    const wz=Math.max(0, Math.min(1, Math.min(z-z0, z1-z)/45));
    return h + hill*(1 - wx*wz*0.92);
  };
  terrainH=H;
  /* 🔺 seg 80→120: เนินเขาไม่เป็นเหลี่ยม แต่ยังคุมงบสามเหลี่ยมมือถือ (120 = 28,800 tris · 150 = 45,000 หนักไป) */
  const seg=120, g=new THREE.PlaneGeometry(WORLD*2,WORLD*2,seg,seg);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++) p.setZ(i,H(p.getX(i),-p.getY(i)));   // ยังไม่หมุน: y ของ plane = -z ของโลก
  g.computeVertexNormals();
  /* สีวัสดุ = ขาวล้วน ปล่อยให้ภาพทรายคุมโทนเอง (เคยใส่สีอุ่นทับ + ไฟแรง = พื้นสว่างจ้าจนแสบตา) */
  const m=new THREE.MeshLambertMaterial({color:0xffffff,map:sandTex()});
  tryTex(m,'img/invasion/sand.png',70,70);
  const ground=new THREE.Mesh(g,m); ground.rotation.x=-Math.PI/2; scene.add(ground);
}
/* 🏗️ รอบ 430: ระดับฐานของสิ่งปลูกสร้างบนพื้นลาด — ใช้ "มุมที่ต่ำที่สุด" ของฐาน
   (พื้นเป็นเนินแล้ว ถ้ายังวางที่ความสูงจุดกึ่งกลาง มุมตึกด้านลาดลงจะลอยเห็นใต้ท้อง) */
function baseLow(x,z,r){
  let m=terrainH(x,z);
  for(const [ox,oz] of [[-r,-r],[r,-r],[-r,r],[r,r]]) m=Math.min(m,terrainH(x+ox,z+oz));
  return m;
}
/* 🏘️ บ้านดินเผาหลังคาแบน + โดม + หอมินาเรต + ต้นอินทผลัม */
function buildTown(){
  const tones=['#d8bc93','#c9a87c','#e2cda9','#bfa07a','#d2b489'];
  const mats=tones.map(t=>{ const m=new THREE.MeshLambertMaterial({color:0xffffff,map:wallTex(t)});
    tryTex(m,'img/invasion/wall.png',1,1); return m; });
  const winMat=new THREE.MeshBasicMaterial({color:0x24303f});
  const domeMat=new THREE.MeshLambertMaterial({color:0xd8d2c4});
  const Twin=[], Tleaf=[], Trock=[];      // ⚡ คิวของซ้ำ → InstancedMesh ตอนท้าย (ลด draw call บนมือถือ)
  /* 💡 จำนวนพวกนี้คุม draw call โดยตรง (มือถือเด็กเป็นหลัก) — บ้าน 1 หลัง ≈ 4 ชิ้น, ต้นอินทผลัม 1 ต้น ≈ 7 ชิ้น
     กระตุกบนมือถือจริงเมื่อไหร่ ลดเลข 80 / 34 / 45 ตรงนี้ก่อนเป็นอันดับแรก */
  for(let i=0;i<80;i++){
    const a=rnd(0,TAU), r=rnd(26,WORLD*0.84);
    const x=Math.cos(a)*r, z=Math.sin(a)*r;
    if(Math.hypot(x,z-pz)<18) continue;                     // เว้นที่ยืนของผู้เล่น
    const w=rnd(6,14), d=rnd(6,14), h=rnd(4,13);
    const base=baseLow(x,z,Math.max(w,d)*0.5);
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mats[(Math.random()*mats.length)|0]);
    b.position.set(x,base+h/2,z); b.rotation.y=rnd(0,TAU); scene.add(b);
    solids.push({x,z,r:Math.max(w,d)*0.55});
    const par=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.7,d+.6),b.material);   // ขอบดาดฟ้า
    par.position.set(x,base+h+.35,z); par.rotation.y=b.rotation.y; scene.add(par);
    for(let k=0;k<2;k++){                                    // หน้าต่างเล็กด้านหน้า (เก็บเข้าคิว instance)
      const ang=b.rotation.y;
      Twin.push({p:[x+Math.sin(ang)*(d/2+.06)+Math.cos(ang)*(k?1.9:-1.9),
                    base+h*0.55, z+Math.cos(ang)*(d/2+.06)-Math.sin(ang)*(k?1.9:-1.9)],
                 r:[0,ang,0]});
    }
    if(Math.random()<0.22){                                  // บางหลังมีโดม
      const dm=new THREE.Mesh(new THREE.SphereGeometry(Math.min(w,d)*0.42,12,8,0,TAU,0,Math.PI/2),domeMat);
      dm.position.set(x,base+h+.6,z); scene.add(dm);
    }
  }
  [[-70,-40],[95,10],[-30,-150]].forEach(([x,z])=>{          // 🕌 หอมินาเรต = หมุดสายตาให้เด็กจำทิศ
    const base=baseLow(x,z,3.2);
    const tw=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.9,30,12),mats[2]);
    tw.position.set(x,base+15,z); scene.add(tw);
    const bal=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.4,1.2,12),mats[1]);
    bal.position.set(x,base+24,z); scene.add(bal);
    const cap=new THREE.Mesh(new THREE.ConeGeometry(2.6,5,12),domeMat);
    cap.position.set(x,base+32.5,z); scene.add(cap);
    solids.push({x,z,r:3.4});
  });
  const trunkM=new THREE.MeshLambertMaterial({color:0x8a6a45});
  const leafM=new THREE.MeshLambertMaterial({color:0x5f8a3a,side:THREE.DoubleSide});
  for(let i=0;i<34;i++){                                     // 🌴 ต้นอินทผลัม
    const a=rnd(0,TAU), r=rnd(30,WORLD*0.8);
    const x=Math.cos(a)*r, z=Math.sin(a)*r, base=terrainH(x,z), h=rnd(6,11);
    const tr=new THREE.Mesh(new THREE.CylinderGeometry(.28,.45,h,6),trunkM);
    tr.position.set(x,base+h/2,z); tr.rotation.z=rnd(-.09,.09); scene.add(tr);
    for(let k=0;k<6;k++){
      const ang=k/6*TAU;
      Tleaf.push({p:[x+Math.cos(ang)*1.9, base+h+.5, z+Math.sin(ang)*1.9], r:[-1.05,ang,0]});
    }
  }
  const rockM=new THREE.MeshLambertMaterial({color:0xa89478});
  for(let i=0;i<45;i++){                                     // 🪨 ก้อนหิน
    const a=rnd(0,TAU), r=rnd(18,WORLD*0.9);
    const x=Math.cos(a)*r, z=Math.sin(a)*r, s=rnd(.7,2.6);
    Trock.push({p:[x,terrainH(x,z)+s*.5,z], r:[rnd(0,3),rnd(0,3),rnd(0,3)], s});
  }
  /* ⚡ รวมของซ้ำในเมือง (หน้าต่าง ~240 · ใบอินทผลัม ~204 · ก้อนหิน 45) → 3 draw call */
  instancer(new THREE.PlaneGeometry(1,1.6), winMat, Twin);
  instancer(new THREE.PlaneGeometry(1.5,5.4), leafM, Tleaf);
  instancer(new THREE.DodecahedronGeometry(1,0), rockM, Trock);
}

/* ============================================================
   🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
   ตึกเรียง 2 ฝั่งเป็น "ถนน" + แนวกระสอบทราย + ซากรถไหม้ + เศษปูน + เสาไฟสายห้อย
   จุดเกิดผู้เล่นอยู่ปลายถนน หันหน้าเข้าเมือง → เปิดเกมมาเห็นภาพแบบในรูปทันที
   ============================================================ */
const STREET_Z0=WORLD*0.42, STREET_LEN=150, STREET_HW=11;   // ปลายถนน(จุดเกิด) · ความยาว · ครึ่งความกว้าง
/* ⚡ ตัวช่วยรวมชิ้นซ้ำๆ เป็น InstancedMesh ก้อนเดียว = 1 draw call
   ⚠️ สำคัญมากบนมือถือ: ครั้งแรกที่ทำถนนนี้แบบ Mesh แยกชิ้น วัดได้ 976 draw call (หนักเกินไป)
   หน้าต่าง/เศษปูน/กระสอบทราย/ถังน้ำมัน เป็นของซ้ำรูปทรงเดียวกัน → ยัดเป็น instance ทั้งหมด */
function instancer(geo,mat,list){
  if(!list.length) return null;
  const im=new THREE.InstancedMesh(geo,mat,list.length);
  const d=new THREE.Object3D();
  list.forEach((t,i)=>{
    d.position.set(t.p[0],t.p[1],t.p[2]);
    d.rotation.set(t.r?t.r[0]:0, t.r?t.r[1]:0, t.r?t.r[2]:0);
    d.scale.setScalar(t.s||1);
    d.updateMatrix(); im.setMatrixAt(i,d.matrix);
  });
  im.instanceMatrix.needsUpdate=true;
  scene.add(im);
  return im;
}
function buildWarStreet(){
  /* คิวสะสมของซ้ำ — สร้างทีเดียวตอนท้ายเป็น InstancedMesh */
  const Qwin=[], Qrub=[], Qsack=[], Qplank=[], Qdrum=[];
  const wallM=[0xd0b38c,0xc0a075,0xdcc7a4].map(c=>{
    const m=new THREE.MeshLambertMaterial({color:0xffffff,map:wallTex('#'+c.toString(16))});
    tryTex(m,'img/invasion/wall.png',1,1); return m; });
  const concM=new THREE.MeshLambertMaterial({color:0xb9ab97});
  const rubbleM=new THREE.MeshLambertMaterial({color:0x9d9080});
  const sackM=new THREE.MeshLambertMaterial({color:0xa8946e});
  const burnM=new THREE.MeshLambertMaterial({color:0x3b352f});
  const rustM=new THREE.MeshLambertMaterial({color:0x6b4a34});

  /* 🏢 ตึกเรียง 2 ฝั่งถนน (บางหลังพังครึ่ง = ซากสงคราม) */
  for(let side=-1;side<=1;side+=2){
    for(let i=0;i<9;i++){
      const z=STREET_Z0-8-i*(STREET_LEN/9)*0.94;
      const w=rnd(9,15), d=rnd(10,16), h=rnd(7,17);
      const x=side*(STREET_HW+w/2+rnd(0,3));
      const base=baseLow(x,z,Math.max(w,d)*0.5);
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wallM[i%3]);
      b.position.set(x,base+h/2,z); scene.add(b);
      solids.push({x,z,r:Math.max(w,d)*0.5});
      /* ขอบดาดฟ้า */
      const par=new THREE.Mesh(new THREE.BoxGeometry(w+.7,.8,d+.7),wallM[i%3]);
      par.position.set(x,base+h+.4,z); scene.add(par);
      /* ช่องหน้าต่างมืด เรียงเป็นชั้นๆ หันเข้าถนน */
      const rows=Math.max(1,Math.floor(h/3.6));
      for(let r=0;r<rows;r++)for(let c=-1;c<=1;c++){
        if(Math.random()<0.18) continue;                     // บางช่องพังหาย
        Qwin.push({p:[x-side*(w/2+.05), base+2.2+r*3.4, z+c*(d*0.27)],
                   r:[0, side>0?-Math.PI/2:Math.PI/2, 0]});
      }
      /* กันสาด/ระเบียงยื่น (เงาตัดขวางแบบภาพอ้างอิง) */
      if(Math.random()<.6){
        const aw=new THREE.Mesh(new THREE.BoxGeometry(1.8,.22,d*0.7),concM);
        aw.position.set(x-side*(w/2+.9), base+rnd(3,6), z); scene.add(aw);
      }
      /* บางหลังพังครึ่ง → กองเศษปูนเชิงตึก */
      if(Math.random()<.45){
        for(let k=0;k<7;k++){
          const s=rnd(.5,1.7);
          Qrub.push({p:[x-side*(w/2+rnd(.5,4)), base+s*.4, z+rnd(-d/2,d/2)],
                     r:[rnd(0,3),rnd(0,3),rnd(0,3)], s});
        }
      }
    }
  }
  /* 🧱 แนวกระสอบทราย 3 จุด (ที่กำบังของหน่วยรบ — วางขวางถนนใกล้จุดเกิด) */
  sandbagWalls().forEach(w=>{
    for(let r=0;r<3;r++){                                     // ซ้อน 3 ชั้น เยื้องกันเหมือนกองจริง
      const n=6-r;
      for(let i=0;i<n;i++){
        const off=(i-(n-1)/2)*1.05;
        Qsack.push({p:[w.x+Math.cos(w.rot)*off, terrainH(w.x,w.z)+.28+r*.5, w.z+Math.sin(w.rot)*off+(r%2?.12:0)],
                    r:[0, w.rot+rnd(-.08,.08), Math.PI/2]});
      }
    }
    solids.push({x:w.x,z:w.z,r:2.6});
  });
  /* 🚗 ซากรถไหม้ 4 คัน จอดเอียงกลางถนน */
  [[-6,STREET_Z0-34,.5],[7,STREET_Z0-58,-.35],[-8,STREET_Z0-86,.9],[6.5,STREET_Z0-118,-.8]].forEach(([x,z,rot])=>{
    const base=terrainH(x,z);
    const g=new THREE.Group(); g.position.set(x,base,z); g.rotation.y=rot;
    const body=new THREE.Mesh(new THREE.BoxGeometry(2.0,.95,4.4),burnM); body.position.y=.85; g.add(body);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(1.85,.85,2.0),burnM); cab.position.set(0,1.6,-.2); g.add(cab);
    [-1,1].forEach(s=>[-1.4,1.4].forEach(zz=>{
      const wh=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.3,8),rustM);
      wh.rotation.z=Math.PI/2; wh.position.set(s*.95,.42,zz); g.add(wh);
    }));
    scene.add(g); solids.push({x,z,r:2.4});
  });
  /* ⚡ เสาไฟ + สายห้อยพาดข้ามถนน (เส้นโค้งหย่อนแบบภาพอ้างอิง) */
  const poleM=new THREE.MeshLambertMaterial({color:0x6d6252});
  const wireM=new THREE.LineBasicMaterial({color:0x2a2622});
  for(let i=0;i<6;i++){
    const z=STREET_Z0-18-i*24, side=(i%2?1:-1);
    const x=side*(STREET_HW+1.2), base=terrainH(x,z), h=9.5;
    const p=new THREE.Mesh(new THREE.CylinderGeometry(.16,.24,h,6),poleM);
    p.position.set(x,base+h/2,z); scene.add(p);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(2.2,.14,.14),poleM);
    arm.position.set(x-side*1.0,base+h-.7,z); scene.add(arm);
    /* สายไฟหย่อนข้ามถนนไปอีกฝั่ง */
    const pts=[];
    for(let t=0;t<=10;t++){
      const k=t/10;
      pts.push(new THREE.Vector3(x+(-side*(STREET_HW*2+2.4))*k, base+h-.8-Math.sin(k*Math.PI)*1.5, z+rnd(-.05,.05)));
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),wireM));
  }
  /* 🪵 เศษซากบนถนน — แผ่นไม้/ถังน้ำมัน/กองอิฐ กระจายตามแนวถนน */
  for(let i=0;i<70;i++){
    const z=STREET_Z0-rnd(4,STREET_LEN), x=rnd(-STREET_HW,STREET_HW);
    const base=terrainH(x,z), r=Math.random();
    if(r<.45)      Qrub.push({p:[x,base+.3,z], r:[rnd(0,3),rnd(0,3),rnd(0,3)], s:rnd(.25,.9)});
    else if(r<.75) Qplank.push({p:[x,base+.05,z], r:[0,rnd(0,TAU),0], s:rnd(.7,1.5)});
    else           Qdrum.push({p:[x,base+.47,z], r:[0,0,Math.random()<.3?1.55:0]});
  }
  /* ⚡ สร้างของซ้ำทั้งหมดเป็น InstancedMesh — จาก ~400 draw call เหลือ 5 */
  instancer(new THREE.PlaneGeometry(1.25,1.8), new THREE.MeshBasicMaterial({color:0x22292f}), Qwin);
  instancer(new THREE.DodecahedronGeometry(1,0), rubbleM, Qrub);
  instancer(THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.28,.62,3,6):new THREE.CylinderGeometry(.3,.3,1.1,7), sackM, Qsack);
  instancer(new THREE.BoxGeometry(1.5,.09,.3), rustM, Qplank);
  instancer(new THREE.CylinderGeometry(.36,.36,.95,10), burnM, Qdrum);
}
/* จุดวางแนวกระสอบทราย (ใช้ร่วมกับตำแหน่งหมอบของหน่วยรบ) */
function sandbagWalls(){
  return [
    {x:-7.5, z:STREET_Z0-12, rot:0},
    {x: 7.0, z:STREET_Z0-20, rot:0},
    {x:-5.5, z:STREET_Z0-40, rot:.25},
  ];
}
/* ทหารหมอบยิงหลังกระสอบทราย (หันหน้าเข้าเมือง) */
function squadCoverSpots(){
  const out=[];
  sandbagWalls().forEach(w=>{
    for(let i=0;i<2;i++)
      out.push({x:w.x+(i?1.5:-1.5), z:w.z+1.5, crouch:true});
  });
  return out;
}
/* 🌫️ ฝุ่นฟุ้งลอยในอากาศ — จุดเล็กๆ รับแสงแดด (ก้อนเดียว 1 draw call) */
let dustPts=null;
function buildDustMotes(){
  const N=420, g=new THREE.BufferGeometry(), pos=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    pos[i*3]=rnd(-60,60); pos[i*3+1]=rnd(.5,16); pos[i*3+2]=STREET_Z0-rnd(-10,150);
  }
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  dustPts=new THREE.Points(g,new THREE.PointsMaterial({color:0xffe6bd,size:.13,transparent:true,
    opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));
  scene.add(dustPts);
}
/* ฝุ่นลอยตามลมช้าๆ แล้ววนกลับ (ยึดรอบตัวผู้เล่นเสมอ = เห็นฝุ่นทุกที่ที่ไป โดยไม่ต้องเพิ่มจำนวนจุด) */
function tickDust(dt,now){
  if(!dustPts) return;
  const p=dustPts.geometry.attributes.position, a=p.array;
  for(let i=0;i<a.length;i+=3){
    a[i]  += (1.6+Math.sin(now*.0003+i)*0.8)*dt;      // ลมพัดไปทาง +x
    a[i+1]+= Math.sin(now*.0007+i)*0.22*dt;           // ลอยขึ้น-ลงเบาๆ
    if(a[i]-px> 60) a[i]-=120;                        // วนขอบกล่องรอบผู้เล่น
    if(a[i]-px<-60) a[i]+=120;
    if(a[i+2]-pz> 60) a[i+2]-=120;
    if(a[i+2]-pz<-60) a[i+2]+=120;
  }
  p.needsUpdate=true;
}

/* ============================================================
   🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
   · วิ่งเข้าไปในบ้านได้จริง — กันชนสร้าง "อัตโนมัติจากตัวโมเดล" (ไม่ต้องวัดผนังเอง)
     วิธี: ไล่สามเหลี่ยมทุกอันของโมเดล เอาเฉพาะที่อยู่ช่วง "ความสูงระดับตัวคน" มาปั๊มลงตารางช่อง
     → ประตู/หน้าต่าง/ช่องว่างกลายเป็นทางเดินเอง · ใช้ซ้ำได้กับโมเดลอาคารอื่นในอนาคต
   · อยู่ในบ้าน = ที่กำบัง ลดดาเมจ (HOUSE_COVER)
   ⚠️ โมเดลจริงหนัก (285k tris) → ใช้ LOD: ใกล้กว่า HOUSE_LOD เมตรค่อยโชว์ของจริง
     ไกลกว่านั้นโชว์กล่องแทน (เห็นเป็นอาคารเหมือนเดิม แต่แทบไม่กินเครื่อง)
   ============================================================ */
const HOUSE_SIZE=18;            // ด้านยาวสุดของบ้าน (เมตร)
const HOUSE_LOD=115;            // ระยะสลับโมเดลจริง ↔ กล่องแทน
const HOUSE_COVER=0.35;         // อยู่ในบ้าน โดนดาเมจเหลือ 35%
const HOUSE_CELL=0.45;          // ความละเอียดตารางกันชน (เมตร)
const HOUSE_SPOTS=[             // ริมถนนสมรภูมิ — ระยะห่างกันพอที่จะไม่โชว์ของจริงพร้อมกัน
  {x:-34, z:STREET_Z0-46,  rot: Math.PI*0.52},
  {x: 36, z:STREET_Z0-104, rot:-Math.PI*0.48},
];
let houses=[];                  // {grp,detail,proxy,blk,box,inside}
let inCover=false;
function buildHouses(){
  HOUSE_SPOTS.forEach(sp=>{
    const base=terrainH(sp.x,sp.z);
    const grp=new THREE.Group(); grp.position.set(sp.x,base,sp.z); grp.rotation.y=sp.rot;
    scene.add(grp);
    /* กล่องแทนตอนอยู่ไกล (สร้างก่อน เห็นอาคารทันทีแม้โมเดลยังโหลดไม่เสร็จ) */
    const pm=new THREE.MeshLambertMaterial({color:0xffffff,map:wallTex('#cbb08c')});
    tryTex(pm,'img/invasion/wall.png',1,1);
    const proxy=new THREE.Mesh(new THREE.BoxGeometry(HOUSE_SIZE*0.82,HOUSE_SIZE*0.56,HOUSE_SIZE),pm);
    proxy.position.y=HOUSE_SIZE*0.28; grp.add(proxy);
    const h={grp,detail:null,proxy,blk:null,box:null};
    houses.push(h);
    loadGlb('img/models/house_01_lite.glb',obj=>{
      fitInto(obj,HOUSE_SIZE);
      const b=new THREE.Box3().setFromObject(obj);
      obj.position.y-=b.min.y;                        // วางให้พื้นบ้านแตะดิน
      obj.visible=false; grp.add(obj); h.detail=obj;
      grp.updateMatrixWorld(true);
      h.box=new THREE.Box3().setFromObject(obj);
      h.blk=buildBlockGrid(obj,HOUSE_CELL,h.box.min.y+0.4,h.box.min.y+2.1);
      /* กันชนวงกลมของ solids จะทำให้เข้าบ้านไม่ได้ → บ้านไม่ลง solids เด็ดขาด (ใช้ตารางช่องแทน) */
    });
  });
}
/* 🧱 ตารางกันชนจากตัวโมเดล — เอาเฉพาะสามเหลี่ยมช่วงความสูง yLo..yHi (ระดับลำตัวคน)
   พื้น/หลังคา/ขอบประตูด้านบน จึงไม่กลายเป็นกำแพงขวางทาง */
function buildBlockGrid(root,cell,yLo,yHi){
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root);
  const x0=box.min.x-cell, z0=box.min.z-cell;
  const n=Math.ceil((box.max.x-x0)/cell)+2, m=Math.ceil((box.max.z-z0)/cell)+2;
  const g=new Uint8Array(n*m);
  const A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();
  root.traverse(o=>{
    if(!o.isMesh||!o.geometry||!o.geometry.attributes.position) return;
    const pos=o.geometry.attributes.position, idx=o.geometry.index, cnt=idx?idx.count:pos.count;
    for(let i=0;i<cnt;i+=3){
      const ia=idx?idx.getX(i):i, ib=idx?idx.getX(i+1):i+1, ic=idx?idx.getX(i+2):i+2;
      A.fromBufferAttribute(pos,ia).applyMatrix4(o.matrixWorld);
      B.fromBufferAttribute(pos,ib).applyMatrix4(o.matrixWorld);
      C.fromBufferAttribute(pos,ic).applyMatrix4(o.matrixWorld);
      if(Math.max(A.y,B.y,C.y)<yLo || Math.min(A.y,B.y,C.y)>yHi) continue;
      /* ⚠️ บทเรียน: ครั้งแรกปั๊มทั้ง "กรอบสี่เหลี่ยม" ของสามเหลี่ยม → บ้านตันทั้งหลัง เดินเข้าไม่ได้เลย
         (โมเดลลดโพลีแล้วมีสามเหลี่ยมใหญ่ทแยง กรอบมันกินพื้นที่ทั้งห้อง)
         แก้เป็น: ① ข้ามสามเหลี่ยมที่หงายขึ้น/คว่ำลง (พื้น/เพดาน/บันได ไม่ใช่กำแพง)
                  ② ปั๊มตาม "ขอบ" ของสามเหลี่ยมเท่านั้น — กำแพงตั้งฉากฉายลงพื้นเป็นเส้น ขอบจึงคลุมครบพอดี */
      const nx1=B.x-A.x, ny1=B.y-A.y, nz1=B.z-A.z, nx2=C.x-A.x, ny2=C.y-A.y, nz2=C.z-A.z;
      const cy=nz1*nx2-nx1*nz2;                                   // องค์ประกอบ y ของ normal
      const nlen=Math.hypot(ny1*nz2-nz1*ny2, cy, nx1*ny2-ny1*nx2)||1;
      if(Math.abs(cy/nlen)>0.7) continue;                          // เกือบราบ = พื้น/เพดาน ไม่กั้นทางเดิน
      const mark=(ax,az,bx,bz)=>{
        const steps=Math.ceil(Math.hypot(bx-ax,bz-az)/(cell*0.5))||1;
        for(let k=0;k<=steps;k++){
          const gx=Math.floor((ax+(bx-ax)*k/steps-x0)/cell), gz=Math.floor((az+(bz-az)*k/steps-z0)/cell);
          if(gx>=0&&gz>=0&&gx<n&&gz<m) g[gz*n+gx]=1;
        }
      };
      mark(A.x,A.z,B.x,B.z); mark(B.x,B.z,C.x,C.z); mark(C.x,C.z,A.x,A.z);
    }
  });
  return {x0,z0,n,m,cell,g};
}
function gridBlocked(blk,x,z){
  if(!blk) return false;
  const gx=Math.floor((x-blk.x0)/blk.cell), gz=Math.floor((z-blk.z0)/blk.cell);
  if(gx<0||gz<0||gx>=blk.n||gz>=blk.m) return false;
  return !!blk.g[gz*blk.n+gx];
}
/* ชนผนังบ้านไหม (เช็ก 4 มุมรอบตัวผู้เล่น กันหน้าจอทะลุผนัง) */
function houseBlocked(x,z){
  const R=0.42;
  for(const h of houses){
    if(!h.blk) continue;
    for(const [ox,oz] of [[R,0],[-R,0],[0,R],[0,-R]]) if(gridBlocked(h.blk,x+ox,z+oz)) return true;
  }
  return false;
}
/* อยู่ในบ้านหลังไหนอยู่หรือเปล่า (ใช้เป็น "ที่กำบัง") */
function houseCover(x,z){
  for(const h of houses){
    if(!h.box) continue;
    if(x>h.box.min.x&&x<h.box.max.x&&z>h.box.min.z&&z<h.box.max.z && !houseBlocked(x,z)) return true;
  }
  return false;
}
/* สลับโมเดลจริง ↔ กล่องแทน ตามระยะ (เรียกทุกเฟรม แต่เปลี่ยนค่าเฉพาะตอนข้ามเส้น) */
function tickHouseLod(){
  for(const h of houses){
    if(!h.detail) continue;
    const near=Math.hypot(px-h.grp.position.x,pz-h.grp.position.z)<HOUSE_LOD;
    if(h.detail.visible!==near){ h.detail.visible=near; h.proxy.visible=!near; }
  }
}
/* 🎯 จุดสูงข่ม — ยอดเนินที่ยืนแล้วมองเห็นสนามรบกว้าง (คำนวณจากภูมิประเทศจริงตอนสร้างฉาก) */
let sniperSpots=[];
function findSniperSpots(){
  const cand=[];
  for(let x=-WORLD*0.86;x<=WORLD*0.86;x+=28)
    for(let z=-WORLD*0.86;z<=WORLD*0.86;z+=28){
      const e=terrainH(x,z);
      let hi=true, sum=0, n=0;
      for(let a=0;a<8;a++){                              // ต้องสูงกว่ารอบตัวทุกทิศ = ยอดเนินจริง
        const ax=x+Math.cos(a/8*TAU)*26, az=z+Math.sin(a/8*TAU)*26, ne=terrainH(ax,az);
        if(ne>e){ hi=false; break; }
        sum+=e-ne; n++;
      }
      if(!hi) continue;
      const toCore=Math.hypot(x-0,z-CORE_Z);
      if(toCore>620) continue;                           // ไกลเกินจนยิงไม่ถึง = ไม่แนะนำ
      cand.push({x,z,e,score:e*2+sum/n*6-toCore*0.012});
    }
  cand.sort((a,b)=>b.score-a.score);
  sniperSpots=[];
  for(const c of cand){                                  // เก็บ 4 จุด ห่างกันอย่างน้อย 120 ม.
    if(sniperSpots.every(s=>Math.hypot(s.x-c.x,s.z-c.z)>120)) sniperSpots.push(c);
    if(sniperSpots.length>=4) break;
  }
}

/* ============================================================
   🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
   มี img/models/mothership.glb เมื่อไหร่ → สลับใช้โมเดลจริงอัตโนมัติ
   ============================================================ */
function buildMothership(){
  const grp=new THREE.Group();
  grp.position.set(0,MS_Y,MS_Z);
  const hullM=new THREE.MeshPhongMaterial({color:0x1c1f26,emissive:0x05070b,shininess:26,flatShading:true});
  const darkM=new THREE.MeshPhongMaterial({color:0x101318,emissive:0x02040a,shininess:14,flatShading:true});

  const top=new THREE.Mesh(new THREE.ConeGeometry(MS_R,MS_R*0.30,16,1),hullM);
  top.position.y=MS_R*0.15; grp.add(top);
  const bot=new THREE.Mesh(new THREE.ConeGeometry(MS_R,MS_R*0.42,16,1),darkM);
  bot.rotation.z=Math.PI; bot.position.y=-MS_R*0.21; grp.add(bot);
  for(let i=0;i<4;i++){                                      // วงแหวนโครงสร้างซ้อนชั้น
    const r=MS_R*(0.94-i*0.17);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,MS_R*0.016,4,20),hullM);
    ring.rotation.x=Math.PI/2; ring.position.y=MS_R*(0.045-i*0.05); grp.add(ring);
  }
  for(let i=0;i<9;i++){                                      // หนามแหลมบนสันยาน
    const a=(i/9)*TAU, r=MS_R*rnd(0.16,0.52), hgt=MS_R*rnd(0.12,0.30);
    const sp=new THREE.Mesh(new THREE.ConeGeometry(MS_R*0.05,hgt,5),hullM);
    sp.position.set(Math.cos(a)*r, MS_R*0.17+hgt/2, Math.sin(a)*r);
    sp.rotation.z=rnd(-.12,.12); grp.add(sp);
  }
  for(let i=0;i<14;i++){                                     // หนามใต้ท้องชี้ลงหาเมือง (ยาวเกิน = ทิ่มทะลุพื้นทราย)
    const a=(i/14)*TAU+0.2, r=MS_R*rnd(0.20,0.75), hgt=MS_R*rnd(0.10,0.20);
    const sp=new THREE.Mesh(new THREE.ConeGeometry(MS_R*0.045,hgt,5),darkM);
    sp.rotation.z=Math.PI; sp.position.set(Math.cos(a)*r, -MS_R*0.30-hgt/2, Math.sin(a)*r); grp.add(sp);
  }
  const lampG=new THREE.SphereGeometry(MS_R*0.014,6,5);
  msLamps=[];
  for(let i=0;i<26;i++){                                     // ไฟสัญญาณเขียว/ส้ม/ฟ้า ตามขอบลำ
    const a=(i/26)*TAU, col=i%3===0?0x3affa0:(i%3===1?0xffa63a:0x3ad4ff);
    const lp=new THREE.Mesh(lampG,new THREE.MeshBasicMaterial({color:col}));
    lp.position.set(Math.cos(a)*MS_R*0.93,-MS_R*0.06,Math.sin(a)*MS_R*0.93);
    lp.userData.ph=Math.random()*TAU; grp.add(lp); msLamps.push(lp);
  }
  /* 🔴 แกนพลังงาน = "จุดอ่อนที่ยิงโดน" — อยู่ในฉาก ไม่ใช่ลูกของลำ (ลำใหญ่/หมุน เล็งไม่ได้)
     ห้อยต่ำลงมาใกล้ผู้เล่น เพื่อให้เล็งยิงได้จริงทั้งจากพื้นและจากเฮลิ */
  const core=new THREE.Mesh(new THREE.SphereGeometry(CORE_R,20,16),
    new THREE.MeshBasicMaterial({color:0x3a0d0d,fog:false}));
  core.position.set(0,CORE_Y,CORE_Z); scene.add(core); msCore=core;
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({color:0xff3a2a,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  /* ⚠️ รอบ 432: ออร่าเดิมกว้าง CORE_R*7 = 315 ม. → ล้างจอเป็นสีชมพูทั้งครึ่งซ้าย (เห็นในภาพผู้ใช้) */
  glow.scale.setScalar(CORE_R*3.4); glow.position.set(0,CORE_Y,CORE_Z); scene.add(glow); msGlow=glow;
  /* ❌ รอบ 439: เอา "ลำแสงยึดแกน" ออกถาวร — ผู้ใช้เห็นเป็นกรวยใหญ่กลางฟ้า 2 รอบติดแล้วนึกว่าเป็นยานแม่
     (ตอนนี้แกนพลังงานอยู่ใต้จมูกลำอยู่แล้ว มองปุ๊บก็รู้ว่าเป็นของยานแม่ ไม่ต้องมีเส้นโยง) */

  /* 🧩 แผงช่องตัวอักษร — ห้อยใต้ขอบหน้าลำ
     ⚠️ ต้องเป็นลูกของ "ฉาก" ไม่ใช่ลูกของลำยาน! ลำยานหมุนช้าๆ ตลอดเวลา ถ้าแผงเป็นลูกของลำยาน
        แผงจะโคจรตามไปอยู่ด้านหลัง/ด้านข้างจนอ่านไม่ได้ (เจอมาแล้วตอนเทสต์) → ตามตำแหน่งเองใน tickMother
     ตำแหน่งนี้ทำให้ผู้เล่นเงยหน้า ~30° (พอดีมุมเริ่มต้น) แล้วเห็นแถวตัวอักษรกลางจอ
     ย้ายแผง "เข้าใกล้ผู้เล่น" (z มากขึ้น) = มุมเงยชันขึ้น ตัวอักษรจะหลุดขอบจอบน */
  const board=new THREE.Group();
  board.position.set(0,BOARD_Y,BOARD_Z);      // ⚠️ แยกจากขนาดลำ ไม่งั้นตัวอักษรโต 5 เท่าจนล้นจอ
  /* ⚠️ เครื่องหมายสำคัญ: rotation.x เป็น "บวก" = หน้าแผงก้มลงหาผู้เล่นที่ยืนอยู่ข้างล่าง
     ใส่ลบจะเงยขึ้นฟ้า ตัวอักษรถูกมองเฉียงจนแบน อ่านยาก (พลาดมาแล้ว วัดด้วย dot ได้ 0.50) */
  board.rotation.x=0.52;
  scene.add(board); msBoard=board;
  buildWindowBar();                 // 🪟 รอบ 477: แถวบานหน้าต่าง 8 ช่อง (ตัวอักษรไปนั่งในบาน)
  /* ❌ รอบ 441 (ผู้ใช้: "เอาสี่เหลี่ยมผืนผ้านี้ออกไปเลย เพราะขวางยานแม่"):
     แผ่นหลังตัวอักษร (BoxGeometry 480×78×30 ม. สีเกือบดำ ลอยห่างแค่ ~220 ม.) กินจอเป็นแถบดำยาว
     บังตัวยานแม่ที่อยู่ไกลกว่า → เอาแผ่นออกถาวร เหลือเฉพาะ "ตัวอักษรเรืองแสง" ลอยเป็นแถว */

  scene.add(grp); mother=grp;
  collectMsMats(grp);              // 🌙 รอบ 471: เก็บวัสดุลำไว้ดัน emissive ตอนกลางคืน
  /* 🌫️ ยานอยู่ไกลกว่าระยะหมอกมาก → ปิด fog ที่ตัวลำ ไม่งั้นกลืนหายไปกับสีฟ้าทั้งลำ */
  grp.traverse(o=>{ if(o.material){ (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.fog=false;m.needsUpdate=true;}); } });
  loadGlb('img/models/mothership.glb',(obj)=>{
    fitInto(obj,MS_R*2);
    obj.traverse(o=>{ if(o.material){ (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.fog=false;m.needsUpdate=true;}); } });
    grp.children.slice().forEach(c=>grp.remove(c));
    grp.add(obj); msLamps=[]; collectMsMats(grp);      // 🌙 รอบ 471: โมเดลจริงมาแทน → เก็บวัสดุใหม่
  });
}
/* 🪟 รอบ 477 (ผู้ใช้: "ย้ายตัวอักษรจากใต้ท้องยาน ไปอยู่ตรงหน้าต่างยานแม่ บานละตัว
   ถ้าใส่ครบแล้วบานไหนไม่มีก็ปล่อยว่าง") — สร้าง "แถวหน้าต่าง" ของยานเองเป็น WIN_N ช่องตายตัว
   ⚠️ ทำไมต้องสร้างเอง: ยานแม่เป็นโมเดล Tripo **เมชเดียว 21,129 สามเหลี่ยม หน้าต่างเป็นลายในเทกซ์เจอร์**
      ไม่มีวัตถุ "บานหน้าต่าง" ให้เกาะ → วางแถวช่องของเราแนบผิวลำหน้า ให้อ่านเป็นหน้าต่างของยาน
   ⚠️ แถวนี้ยัง "ไม่หมุนตามลำ" เหมือนแผงเดิม (ลำหมุน dt*.02 ตลอด — ถ้าหมุนตาม เด็กจะอ่านไม่ออก)
   คำในเกมยาวสุด 8 ตัว (pickWord กรอง [a-z]{3,8}) → WIN_N=8 พอดีทุกคำ */
const WIN_N=8;
let winPanes=[];                       // ช่องหน้าต่างถาวร (สร้างครั้งเดียว ใช้ซ้ำทุกคำ)
function buildWindowBar(){
  const cell=BOARD_CELL, gap=cell*0.22, total=WIN_N*cell+(WIN_N-1)*gap;
  const frameM=new THREE.MeshBasicMaterial({color:0x0a0f16,fog:false});          // ขอบบานสีเหล็กมืด
  const glassM=new THREE.MeshBasicMaterial({color:0x0e2233,fog:false});          // กระจกบานที่ยังว่าง
  for(let i=0;i<WIN_N;i++){
    const x=-total/2+cell/2+i*(cell+gap);
    const fr=new THREE.Mesh(new THREE.PlaneGeometry(cell*1.12,cell*1.12),frameM);
    fr.position.set(x,0,MS_R*0.020); msBoard.add(fr);
    const gl=new THREE.Mesh(new THREE.PlaneGeometry(cell*0.94,cell*0.94),glassM);
    gl.position.set(x,0,MS_R*0.024); msBoard.add(gl);
    /* ตัวอักษรของบานนี้ — ซ่อนไว้ก่อน เปิดเฉพาะบานที่มีตัวอักษรของคำปัจจุบัน */
    const lt=new THREE.Mesh(new THREE.PlaneGeometry(cell,cell),
      new THREE.MeshBasicMaterial({map:letterPanelTex('A',false),transparent:true,fog:false}));
    lt.position.set(x,0,MS_R*0.028); lt.visible=false; msBoard.add(lt);
    winPanes.push({x,frame:fr,glass:gl,mesh:lt});
  }
}
/* ใส่ตัวอักษรลงบานหน้าต่าง — บานที่เหลือปล่อยว่าง (กระจกเปล่า) */
function layoutLetterPanels(){
  letters=[];
  winPanes.forEach((p,i)=>{
    const ch=word.en[i];
    if(!ch){ p.mesh.visible=false; p.glass.visible=true; return; }   // บานว่าง
    p.mesh.visible=true; p.glass.visible=true;
    const old=p.mesh.material.map;
    p.mesh.material.map=letterPanelTex(ch,false);
    p.mesh.material.opacity=1; p.mesh.material.needsUpdate=true;
    if(old) old.dispose();
    letters.push({ch,idx:i,mesh:p.mesh,down:false,blinkUntil:0});
  });
}
function setLetterLit(l,lit){
  const old=l.mesh.material.map;
  l.mesh.material.map=letterPanelTex(l.ch,lit);
  l.mesh.material.needsUpdate=true;
  if(old) old.dispose();
}

/* ============================================================
   👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ปล่อยลำแสงใส่ผู้เล่น)
   ============================================================ */
function makeFighter(letterIdx){
  const grp=new THREE.Group();
  const bodyM=new THREE.MeshPhongMaterial({color:0x23262e,emissive:0x06080d,shininess:32,flatShading:true});
  /* 📏 รอบ 432 (ผู้ใช้: "มองไม่เห็นยานลูกเลย"): ขยายจาก 7 ม. → เท่าเฮลิคอปเตอร์ (วัดจริง 11.5 ม.)
     ทรงที่โค้ดวาดอยู่ในกลุ่มย่อยที่สเกลได้ทีเดียว — โมเดลจริง .glb ใช้ FIGHTER_SIZE ตัวเดียวกัน */
  const body=new THREE.Group(); body.scale.setScalar(FIGHTER_SIZE/7); grp.add(body);
  const hull=new THREE.Mesh(new THREE.ConeGeometry(2.5,1.5,7),bodyM); hull.position.y=.4; body.add(hull);
  const hull2=new THREE.Mesh(new THREE.ConeGeometry(2.5,2.2,7),bodyM); hull2.rotation.z=Math.PI; hull2.position.y=-.7; body.add(hull2);
  [-1,1].forEach(s=>{                                        // ปีกลิ่ม 2 ข้าง
    const w=new THREE.Mesh(new THREE.ConeGeometry(.9,4.2,4),bodyM);
    w.rotation.z=s*Math.PI/2; w.position.set(s*3.0,0,0); body.add(w);
  });
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.52,10,8),new THREE.MeshBasicMaterial({color:0x59ff9d}));
  eye.position.set(0,.1,-2.1); body.add(eye);
  const eng=new THREE.Sprite(new THREE.SpriteMaterial({color:0x66e0ff,transparent:true,opacity:.8,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  eng.scale.setScalar(4.2*FIGHTER_SIZE/7); eng.position.set(0,0,2.4*FIGHTER_SIZE/7); grp.add(eng);
  const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:letterSpriteTex(word.en[letterIdx]),transparent:true,depthTest:false}));
  lb.scale.setScalar(7.0); lb.position.y=FIGHTER_SIZE*0.78; grp.add(lb);   // ป้ายตัวอักษรลอยเหนือลำ อ่านออกแต่ไกล

  /* 🤝 ตำแหน่งเกิดคำนวณจาก (เลขรอบ, ลำดับตัวอักษร) แบบสุ่มมีเมล็ด
     → ทุกเครื่องในห้องเห็นยานลูกอยู่ตำแหน่งเดียวกัน ไม่ใช่ต่างคนต่างสุ่ม */
  const sd=battleRound*97+letterIdx*13;
  const a=srnd(sd)*TAU, r=F_R*(0.45+srnd(sd+1)*0.55);
  grp.position.set(Math.cos(a)*r, F_Y_MIN+srnd(sd+2)*(F_Y_MAX-F_Y_MIN), Math.sin(a)*r);
  scene.add(grp);
  const f={grp,eye,eng,label:lb,letterIdx,hp:F_HP,
           ang:a, rad:r, spin:(srnd(sd+3)<.5?-1:1)*(.16+srnd(sd+4)*.16),
           tgtY:rnd(F_Y_MIN,F_Y_MAX), yAt:0, shotAt:performance.now()+rnd(1200,4200), hitAt:0};
  fighters.push(f);
  /* ⚡ รอบ 432: ใช้ตัวลดโพลี (8.2k tris จากต้นฉบับ 16.4k) — ยานลูกมีได้ถึง 8 ลำพร้อมกัน
     ต้นฉบับ `alien_fighter.glb` ยังอยู่ครบ ไม่ได้แตะ (สูตรลดอยู่ใน handoff/NOTES.md) */
  loadGlb('img/models/alien_fighter_lite.glb',(obj)=>{
    fitInto(obj,FIGHTER_SIZE);
    grp.children.slice().forEach(c=>{ if(c!==lb&&c!==eng) grp.remove(c); });
    grp.add(obj);
  });
  return f;
}

/* ============================================================
   👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
   (ช่วยยิงจริง ทำดาเมจจริง — เด็กจะรู้สึกว่า "ไม่ได้สู้คนเดียว")
   ============================================================ */
/* ============================================================
   🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
   ออกแบบให้ "โครงเดียวใช้ได้ทั้งทรงที่โค้ดวาดเอง และโมเดลจริงที่แยกชิ้นส่วนมา"
   ข้อต่อมาตรฐาน 11 จุด: hips · torso · head · แขนบน/ล่าง ซ้าย-ขวา · ขาบน/ล่าง ซ้าย-ขวา
   ▶ มีไฟล์ img/models/soldier_a.glb / soldier_b.glb (แยกชิ้น ตั้งชื่อตาม SOLDIER_PARTS)
     เมื่อไหร่ ระบบสลับไปใช้โมเดลจริงเอง แล้วขยับด้วยโค้ดชุดเดียวกันนี้
   ============================================================ */
const SOLDIER_PARTS={           /* ชื่อข้อต่อ → คำที่ยอมรับได้ในชื่อ node ของไฟล์ glb */
  hips:  ['hips','pelvis','waist'],
  torso: ['torso','chest','spine','body'],
  head:  ['head','helmet'],
  armUL:['upperarm_l','arm_l_upper','l_upperarm','shoulder_l','armul'],
  armLL:['forearm_l','arm_l_lower','l_forearm','armll'],
  armUR:['upperarm_r','arm_r_upper','r_upperarm','shoulder_r','armur'],
  armLR:['forearm_r','arm_r_lower','r_forearm','armlr'],
  legUL:['thigh_l','leg_l_upper','l_thigh','upleg_l','legul'],
  legLL:['calf_l','shin_l','leg_l_lower','l_calf','legll'],
  legUR:['thigh_r','leg_r_upper','r_thigh','upleg_r','legur'],
  legLR:['calf_r','shin_r','leg_r_lower','r_calf','leglr'],
};
/* สร้างข้อต่อเปล่า (Group) ที่จุดหมุน แล้วเอา mesh ไปห้อยใต้ข้อต่อ */
function joint(parent,x,y,z){
  const j=new THREE.Group(); j.position.set(x,y,z); parent.add(j); return j;
}
/* ทรงทหารที่โค้ดวาดเอง — ผูกเข้าโครงข้อต่อชุดเดียวกับโมเดลจริง */
function buildSoldierRig(){
  const uni=new THREE.MeshLambertMaterial({color:0x6b6f4a});      /* ชุดลายทะเลทราย */
  const gear=new THREE.MeshLambertMaterial({color:0x3a3d33});
  const skin=new THREE.MeshLambertMaterial({color:0xc79a72});
  const grp=new THREE.Group();
  /* ชั้นในไว้ "ยกทั้งตัวให้เท้าแตะพื้น" — แยกจาก grp ที่เกมใช้วางตำแหน่งบนภูมิประเทศ */
  const inner=new THREE.Group(); grp.add(inner);
  const J={};
  J.hips=joint(inner,0,0.92,0);
  J.torso=joint(J.hips,0,0,0);
  const body=new THREE.Mesh(new THREE.BoxGeometry(.62,.86,.36),uni); body.position.y=.23; J.torso.add(body);
  const vest=new THREE.Mesh(new THREE.BoxGeometry(.68,.5,.44),gear); vest.position.y=.30; J.torso.add(vest);
  J.head=joint(J.torso,0,.72,0);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.21,8,6),skin); head.position.y=.12; J.head.add(head);
  const helm=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6,0,TAU,0,Math.PI/2),gear); helm.position.y=.14; J.head.add(helm);
  [['L',-1],['R',1]].forEach(function(pair){
    var side=pair[0], sx=pair[1];
    /* แขน: ไหล่ → ข้อศอก (ชิ้นห้อยลงจากข้อต่อ จึงหมุนถูกจุด) */
    const up=joint(J.torso,sx*.42,.50,0);
    const uMesh=new THREE.Mesh(new THREE.BoxGeometry(.17,.34,.19),uni); uMesh.position.y=-.17; up.add(uMesh);
    const lo=joint(up,0,-.34,0);
    const lMesh=new THREE.Mesh(new THREE.BoxGeometry(.155,.32,.175),uni); lMesh.position.y=-.16; lo.add(lMesh);
    J['armU'+side]=up; J['armL'+side]=lo;
    /* ขา: สะโพก → เข่า */
    const th=joint(J.hips,sx*.16,-.02,0);
    const tMesh=new THREE.Mesh(new THREE.BoxGeometry(.22,.44,.24),uni); tMesh.position.y=-.22; th.add(tMesh);
    const sh=joint(th,0,-.44,0);
    const sMesh=new THREE.Mesh(new THREE.BoxGeometry(.20,.46,.22),uni); sMesh.position.y=-.23; sh.add(sMesh);
    J['legU'+side]=th; J['legL'+side]=sh;
  });
  /* ปืนอยู่ในมือขวา (ห้อยใต้แขนล่างขวา → ยกแขนแล้วปืนตามไปเอง) */
  const rifle=new THREE.Mesh(new THREE.BoxGeometry(.11,.13,1.15),new THREE.MeshLambertMaterial({color:0x22242a}));
  rifle.position.set(0,-.28,-.42); J.armLR.add(rifle);
  return {grp:grp,inner:inner,J:J,rifle:rifle};
}
/* 🧩 เสียบโมเดลจริงเข้าโครง: หา node ตามชื่อใน SOLDIER_PARTS แล้วย้ายไปห้อยใต้ข้อต่อเดิม
   แยกชิ้นไม่ได้ (โมเดลชิ้นเดียว) → แปะทั้งตัวที่สะโพก ยังเห็นเป็นทหาร แค่ไม่ขยับแขนขา */
/* 🧭 รอบ 436 (ผู้ใช้: "บอทหันหลังยิง") — ต้นตอที่ 2 ของอาการหันหลัง:
   `faceModelForward` หมุน "ตัว obj" 180° แต่ตอนแยกชิ้นเข้าข้อต่อ เราใช้ `j.add(mesh)`
   = ย้าย mesh ไปอยู่ใต้ข้อต่อโดยไม่พาการหมุนของ obj ไปด้วย → **การกลับหลังหายทั้งหมด**
   (วัดจากในเกมจริง: ในพิกัดตัวทหารเอง ปลายเท้ายังชี้ +Z = ยืนหันหลังให้เป้า)
   แก้ที่ต้นทาง: ตัดสินใจกลับหลัง "ครั้งเดียวจากไฟล์ต้นฉบับใน cache" แล้ว **อบ 180° ลงใน geometry**
   → ทุกสำเนาหลังจากนั้นหันหน้า −Z มาแต่เกิด ไม่มี transform ให้หายอีก (ใช้ได้ทั้ง rig ตามชื่อและ auto-rig) */
function loadSoldierGlb(path,cb){ loadGlb(path,cb); }
function applySoldierGlb(s,obj){
  s.flipped=faceModelForward(obj);      /* 🧭 จัดให้หันหน้าไป −Z ก่อนเสมอ */
  const found={};
  obj.traverse(function(o){
    if(!o.isMesh) return;
    const n=(o.name||'').toLowerCase().replace(/[\s.\-]/g,'_');
    for(const key in SOLDIER_PARTS){
      if(found[key]) continue;
      if(SOLDIER_PARTS[key].some(function(w){ return n.indexOf(w)>=0; })){ found[key]=o; break; }
    }
  });
  const keys=Object.keys(found);
  if(keys.length<4){
    /* 🤖 ชื่อชิ้นไม่สื่อ (เช่น tripo_part_1..109) → จับเข้าข้อต่อจาก "ตำแหน่งในร่างกาย" แทน */
    if(autoRigSoldier(s,obj)) return true;
    Object.keys(s.J).forEach(function(k){ s.J[k].children.slice().forEach(function(c){ if(c.isMesh) s.J[k].remove(c); }); });
    obj.position.y=-0.92; s.J.hips.add(obj); s.static=true; return false;
  }
  Object.keys(s.J).forEach(function(k){ s.J[k].children.slice().forEach(function(c){ if(c.isMesh) s.J[k].remove(c); }); });
  keys.forEach(function(k){
    const m=found[k], j=s.J[k]; if(!j) return;
    const box=new THREE.Box3().setFromObject(m), c=new THREE.Vector3(); box.getCenter(c);
    /* 🐛 รอบ 436: เดิมใช้ j.add(m) เฉยๆ → ชิ้นหลุดจากการหมุนของ obj = "การกลับหลัง 180° หายไป"
       (ต้นตอบอทหันหลังยิง) → แบนเป็นพิกัดโลกก่อน (เก็บทิศไว้) แล้วค่อยเลื่อนเข้าข้อต่อ
       วิธีเดียวกับที่ autoRigSoldier ทำอยู่แล้ว จึงไม่พังกับโมเดลที่ชิ้นมี transform ของตัวเอง */
    m.updateWorldMatrix(true,false);
    const wm=m.matrixWorld.clone();
    if(m.parent) m.parent.remove(m);
    wm.decompose(m.position,m.quaternion,m.scale);
    /* ให้ "ปลายบนของชิ้น" อยู่ที่ข้อต่อพอดี → หมุนแล้วดูเป็นธรรมชาติเหมือนข้อต่อจริง */
    m.position.x-=c.x; m.position.z-=c.z;
    m.position.y-=(k==='hips'||k==='torso'||k==='head')?0:box.max.y;
    j.add(m);
  });
  s.glb=true; return true;
}
/* ============================================================
   🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
   Tripo Smart Segment แตกออกมาเป็น tripo_part_1..109 → ชื่อไม่สื่ออะไรเลย
   วิธีแก้: ดูว่าแต่ละชิ้น "อยู่ตรงไหนของร่างกาย" แล้วจับเข้าข้อต่อที่ใกล้ที่สุด
     1) หากรอบทั้งตัว → แปลงตำแหน่งทุกชิ้นเป็นสัดส่วน (สูง 0=พื้น 1=หัว · กว้าง -1..1)
     2) เทียบกับ "แผนผังร่างกายมาตรฐาน" (BODY_MAP) หาข้อต่อที่ใกล้สุด
     3) จุดหมุนของข้อต่อคำนวณจากชิ้นจริง (ไหล่=ขอบบนของกลุ่มแขนบน · เข่า=ขอบบนของกลุ่มแข้ง ฯลฯ)
   ============================================================ */
const BODY_MAP={            /* [x สัดส่วนความกว้าง, y สัดส่วนความสูง] ของข้อต่อในร่างคนยืน A-pose */
  hips:[0,.50], torso:[0,.70], head:[0,.90],
  armUL:[-.62,.72], armLL:[-.72,.52],
  armUR:[ .62,.72], armLR:[ .72,.52],
  legUL:[-.22,.36], legLL:[-.24,.13],
  legUR:[ .22,.36], legLR:[ .24,.13],
};
/* ⚡ รอบ 425: รวมหลายชิ้นเป็นก้อนเดียวต่อข้อต่อ — "ตัวเลขที่สำคัญกว่าจำนวนโพลี"
   Tripo Smart Segment แตกเป็น ~110 ชิ้น = 110 draw call ต่อทหาร 1 คน
   มีทหาร 20 คนในแมพ = 2,200 draw call → มือถือเด็กเอาไม่อยู่แน่นอน
   รวมแล้วเหลือ 11 ก้อน (ข้อต่อละ 1) = ลดลงราว 10 เท่า โดยหน้าตาเหมือนเดิมทุกประการ
   (three.min.js ที่ใช้ไม่มี BufferGeometryUtils จึงเขียนรวมเองแบบตรงไปตรงมา) */
function mergeMeshList(meshes){
  const byMat={};
  meshes.forEach(function(m){
    const key=(m.material&&m.material.uuid)||'x';
    if(!byMat[key]) byMat[key]={mat:m.material,list:[]};
    byMat[key].list.push(m);
  });
  const out=[];
  Object.keys(byMat).forEach(function(k){
    const mat=byMat[k].mat, list=byMat[k].list;
    const pos=[], nor=[], uv=[];
    const v=new THREE.Vector3();
    list.forEach(function(m){
      let g=m.geometry; if(!g||!g.attributes||!g.attributes.position) return;
      if(g.index) g=g.toNonIndexed();
      const P=g.attributes.position, N=g.attributes.normal, T=g.attributes.uv;
      m.updateMatrix();
      const mtx=m.matrix, nm=new THREE.Matrix3().getNormalMatrix(mtx);
      for(let i=0;i<P.count;i++){
        v.fromBufferAttribute(P,i).applyMatrix4(mtx); pos.push(v.x,v.y,v.z);
        if(N){ v.fromBufferAttribute(N,i).applyMatrix3(nm).normalize(); nor.push(v.x,v.y,v.z); }
        if(T) uv.push(T.getX(i),T.getY(i));
      }
    });
    if(!pos.length) return;
    const g2=new THREE.BufferGeometry();
    g2.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    if(nor.length===pos.length) g2.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
    else g2.computeVertexNormals();
    if(uv.length===pos.length/3*2) g2.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    out.push(new THREE.Mesh(g2,mat));
  });
  return out;
}
/* 🧭 รอบ 426: หา "ทิศที่ตัวละครหันหน้า" เองจากรูปร่าง แล้วหมุนให้ถูกอัตโนมัติ
   เหตุผล: Tripo ไม่มีปุ่มตั้งแกนให้ผู้ใช้ — บังคับให้ผู้ใช้จัดทิศเองไม่ได้จริง
   วิธีดู (2 สัญญาณที่ตรงกันเสมอในคนยืน):
     · ปลายเท้ายื่นไป "ข้างหน้า" มากกว่าส้นเท้า
     · เป้สะพายหลัง/ของหลังตัวดันจุดกึ่งกลางลำตัวไป "ข้างหลัง"
   → เอา z ของกลุ่มเท้า เทียบกับ z กึ่งกลางตัว ถ้าเท้าอยู่หน้ากว่า = โมเดลหันหน้าไป +Z ต้องหมุน 180°
   (เกมกำหนดให้ตัวละครหันหน้าไป −Z เหมือนกล้องผู้เล่น) */
function faceModelForward(obj){
  obj.updateWorldMatrix(true,true);
  const boxes=[];
  obj.traverse(function(o){
    if(!o.isMesh) return;
    const b=new THREE.Box3().setFromObject(o);
    if(b.isEmpty()) return;
    boxes.push({b:b,c:b.getCenter(new THREE.Vector3())});
  });
  if(boxes.length<3) return false;
  const all=new THREE.Box3(); boxes.forEach(function(o){ all.union(o.b); });
  const H=all.max.y-all.min.y; if(H<=0.001) return false;
  /* 🦶 รอบ 435 (ผู้ใช้เจอ: เพื่อนหันหลังให้กันทั้งที่หันหน้าเข้าหากัน):
     เกณฑ์เดิมใช้ "จุดกึ่งกลางกล่องของชิ้นเท้า เทียบกับกึ่งกลางลำตัว" — ต่างกันแค่ ~0.01 ของความสูง
     = อยู่ในระดับ noise → soldier_a เดาถูก แต่ soldier_b เดาผิด (กลับหลังคนละทาง)
     เกณฑ์ใหม่วัดจาก "รูปทรงเท้าจริง": ปลายเท้ายื่นจากข้อเท้าไปข้างหน้า "ไกลกว่า" ส้นเท้าเสมอ
     → เทียบระยะยื่น 2 ฝั่งของสไลซ์เท้า (วัดระดับจุดยอด ไม่ใช่กล่องรวม) ชัดกว่ามาก */
  const V=new THREE.Vector3();
  let ankZ=0,ankN=0, toeMin=Infinity, toeMax=-Infinity;
  obj.traverse(function(o){
    if(!o.isMesh||!o.geometry||!o.geometry.attributes.position) return;
    const p=o.geometry.attributes.position;
    for(let i=0;i<p.count;i+=3){
      V.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);
      const h=(V.y-all.min.y)/H;
      if(h<0.05){ if(V.z<toeMin) toeMin=V.z; if(V.z>toeMax) toeMax=V.z; }
      else if(h>=0.06&&h<0.11){ ankZ+=V.z; ankN++; }
    }
  });
  if(ankN>8 && toeMin<Infinity){
    const ank=ankZ/ankN, back=ank-toeMin, front=toeMax-ank;
    if(Math.abs(front-back)>H*0.008){                /* ต่างกันชัดพอ = เชื่อได้ */
      if(front>back){ obj.rotation.y+=Math.PI; obj.updateWorldMatrix(true,true); return true; }
      return false;
    }
  }
  /* สำรอง: เกณฑ์เดิม (ใช้เมื่อโมเดลไม่มีเท้าชัด เช่น หุ่นครึ่งตัว) */
  const bodyZ=(all.min.z+all.max.z)/2;
  const footY=all.min.y+H*0.15;
  let fz=0,fn=0;
  boxes.forEach(function(o){ if(o.c.y<footY){ fz+=o.c.z; fn++; } });
  if(!fn) return false;
  const feetZ=fz/fn;
  if(feetZ>bodyZ+H*0.004){        /* เท้าอยู่ทาง +Z = โมเดลหันหน้าไป +Z → ต้องกลับหลัง */
    obj.rotation.y+=Math.PI;
    obj.updateWorldMatrix(true,true);
    return true;
  }
  return false;
}
function autoRigSoldier(s,obj){
  obj.updateWorldMatrix(true,true);
  /* 1) เก็บทุกชิ้น + กรอบของมัน (ทำให้เป็นพิกัดโลกก่อน จะได้ไม่ต้องสนใจ transform ซ้อนกัน) */
  const parts=[];
  obj.traverse(function(o){
    if(!o.isMesh) return;
    const b=new THREE.Box3().setFromObject(o);
    if(!isFinite(b.min.y)||b.isEmpty()) return;
    parts.push({o:o,b:b,c:b.getCenter(new THREE.Vector3())});
  });
  if(parts.length<2) return false;
  const all=new THREE.Box3(); parts.forEach(function(p){ all.union(p.b); });
  const H=all.max.y-all.min.y, W=Math.max(0.001,all.max.x-all.min.x);
  const cx=(all.min.x+all.max.x)/2;
  if(H<=0.001) return false;
  /* 🔫 รอบ 519: R93 อบมาในตัว soldier_c (ปากกระบอกยื่นซ้าย) → ดัน bbox รวมไปซ้าย
     ทำให้ cx/W รวมเพี้ยน → เท้าซ้ายถูก bin ไปขาขวา ขาทั้งคู่รวมเป็นข้างเดียว (หุ่นก้าวขาไม่ออก)
     แก้: หา "แกนกลางลำตัวจริง" จากกลุ่มชิ้นระดับขา (ny ต่ำ = เท้าซ้าย/ขวา ไม่ได้ถือปืน จึงสมมาตร)
     แล้วใช้แกนนี้แยกซ้าย-ขวาของขาโดยเฉพาะ · ปืน bin เข้าท่อนบน = โอเค เพราะโหมด legOnly แช่แข็งท่อนบน
     (โมเดลไม่มีปืนยื่น เช่น soldier_a → legCx≈cx ผลเท่าเดิม backward-safe) */
  const LEG_BAND=0.42, KNEE_BAND=0.24;               /* ny: <0.42 = ระดับขา · <0.24 = ท่อนล่าง(แข้ง/เท้า) */
  let legCx=cx, legHalf=Math.max(0.001,W/2);
  const legPc=parts.filter(function(p){ return (p.c.y-all.min.y)/H < LEG_BAND; });
  if(legPc.length>=2){
    let lmin=1e9,lmax=-1e9;
    legPc.forEach(function(p){ if(p.c.x<lmin)lmin=p.c.x; if(p.c.x>lmax)lmax=p.c.x; });
    legCx=(lmin+lmax)/2; legHalf=Math.max(0.001,(lmax-lmin)/2);   /* กึ่งกลางเท้าซ้าย-ขวา = แกนจริง */
  }
  /* 2) จับแต่ละชิ้นเข้าข้อต่อ: ระดับขาแยกซ้าย-ขวาจากแกนขาจริง · ที่เหลือหาเพื่อนบ้านใกล้สุด (ไม่รวมข้อต่อขา)
        ถ่วงน้ำหนักแกน Y มากกว่า X เล็กน้อย เพราะความสูงบอกส่วนของร่างกายได้ชัดกว่า */
  const bucket={}; Object.keys(BODY_MAP).forEach(function(k){ bucket[k]=[]; });
  const UPPER=['hips','torso','head','armUL','armLL','armUR','armLR'];
  parts.forEach(function(p){
    const ny=(p.c.y-all.min.y)/H;
    let best;
    if(ny<LEG_BAND){                                  /* ระดับขา → แยกซ้าย-ขวาจาก legCx (ไม่ใช่ cx รวมที่โดนปืนดึง) */
      const left=(p.c.x<legCx);
      best=(ny<KNEE_BAND)?(left?'legLL':'legLR'):(left?'legUL':'legUR');
    }else{                                            /* ท่อนบน (torso/head/แขน) → เพื่อนบ้านใกล้สุด ใช้ legCx เป็นแกนกลาง */
      const nx=(p.c.x-legCx)/(W/2);
      let bd=1e9;
      for(let i=0;i<UPPER.length;i++){ const k=UPPER[i], t=BODY_MAP[k];
        const dx=(nx-t[0])*0.85, dy=(ny-t[1])*1.15, d=dx*dx+dy*dy;
        if(d<bd){ bd=d; best=k; } }
    }
    p.key=best; bucket[best].push(p);
  });
  /* ต้องกระจายพอสมควรถึงจะถือว่าแยกร่างได้จริง (ไม่งั้นตกไปโหมดนิ่ง) */
  const used=Object.keys(bucket).filter(function(k){ return bucket[k].length>0; });
  if(used.length<6) return false;
  /* 3) จุดหมุนของข้อต่อ — คำนวณจากชิ้นจริงในกลุ่ม ไม่ใช่ค่าคงที่ */
  const box={}, piv={};
  used.forEach(function(k){
    const bb=new THREE.Box3(); bucket[k].forEach(function(p){ bb.union(p.b); });
    box[k]=bb;
    const c=bb.getCenter(new THREE.Vector3());
    if(k==='head')      piv[k]=new THREE.Vector3(cx, bb.min.y, c.z);          /* คอ */
    else if(k==='hips') piv[k]=new THREE.Vector3(cx, c.y, c.z);
    else if(k==='torso')piv[k]=new THREE.Vector3(cx, bb.min.y, c.z);          /* เอว */
    else                piv[k]=new THREE.Vector3(c.x, bb.max.y, c.z);         /* ไหล่/ศอก/สะโพก/เข่า = ขอบบนของชิ้น */
  });
  /* ข้อต่อที่ไม่มีชิ้นเลย → เดาจากแผนผัง (กันโครงขาด) */
  Object.keys(BODY_MAP).forEach(function(k){
    if(piv[k]) return;
    piv[k]=new THREE.Vector3(cx+BODY_MAP[k][0]*(W/2), all.min.y+BODY_MAP[k][1]*H, 0);
  });
  /* 4) ประกอบลำดับชั้นข้อต่อ (ตำแหน่งลูก = ตำแหน่งโลกของลูก − ของแม่) */
  const J=s.J;
  const link=[['hips',null],['torso','hips'],['head','torso'],
              ['armUL','torso'],['armLL','armUL'],['armUR','torso'],['armLR','armUR'],
              ['legUL','hips'],['legLL','legUL'],['legUR','hips'],['legLR','legUR']];
  link.forEach(function(pair){
    const k=pair[0], par=pair[1];
    const j=J[k]; if(!j) return;
    j.children.slice().forEach(function(c){ if(c.isMesh) j.remove(c); });   /* ลบทรงชั่วคราว */
    j.rotation.set(0,0,0);
    const w=piv[k], pw=par?piv[par]:new THREE.Vector3(0,0,0);
    j.position.set(w.x-pw.x, w.y-pw.y, w.z-pw.z);
  });
  /* 5) ย้ายชิ้นจริงไปห้อยใต้ข้อต่อ (แบนพิกัดเป็นโลกก่อน แล้วลบตำแหน่งข้อต่อออก) */
  let merged=0;
  used.forEach(function(k){
    const j=J[k]; if(!j) return;
    const list=[];
    bucket[k].forEach(function(p){
      const m=p.o;
      m.updateWorldMatrix(true,false);
      const wm=m.matrixWorld.clone();
      if(m.parent) m.parent.remove(m);
      wm.decompose(m.position,m.quaternion,m.scale);
      m.position.sub(piv[k]);
      list.push(m);
    });
    /* ⚡ รวมทุกชิ้นในข้อต่อนี้เป็นก้อนเดียว (ลด draw call ~10 เท่า) */
    const one=mergeMeshList(list);
    if(one.length){ one.forEach(function(m){ j.add(m); merged++; }); }
    else list.forEach(function(m){ j.add(m); merged++; });
  });
  /* 6) ยกทั้งตัวให้เท้าแตะพื้น (ข้อต่อ hips ของโครงอยู่ที่ y=0.92 อยู่แล้ว) */
  J.hips.position.y=(piv.hips.y-all.min.y);
  s.glb=true; s.autoRig=true; s.rigInfo={parts:parts.length,joints:used.length,meshes:merged};
  return true;
}
/* 🎞️ ท่าทางทหาร — ขยับด้วยโค้ดตามสถานการณ์จริงในเกม (เนียนกว่าคลิปสำเร็จรูป)
   mode: 'idle' | 'walk' | 'aim' | 'crouch' */
/* 🦶 ยกทั้งตัวให้ "เท้าแตะพื้นพอดี" ในทุกท่า
   จำเป็นเพราะสัดส่วนขาของโมเดลจริงไม่เท่าทรงที่โค้ดวาดไว้ → ท่าหมอบ/เดินอาจจมพื้นหรือลอย
   วัดกรอบจริงครั้งเดียวตอน "เปลี่ยนท่า" (ไม่ได้วัดทุกเฟรม จึงไม่กินแรง) */
function fitSoldierGround(s){
  const inner=s.J.hips.parent; if(!inner) return;
  inner.position.y=0;
  inner.updateWorldMatrix(true,true);
  const b=new THREE.Box3().setFromObject(inner);
  if(!isFinite(b.min.y)) return;
  const root=inner.parent;
  const rootY=root?root.getWorldPosition(new THREE.Vector3()).y:0;
  inner.position.y=-(b.min.y-rootY);
}
function poseSoldier(s,now){
  const J=s.J; if(!J||s.static) return;
  const t=now*0.001+s.phase, m=s.mode||'idle';
  /* 🔫 รอบ 519: soldier_c ถือ R93 อบมาในตัว → "ขยับเฉพาะขา" ท่อนบน(แขน/ปืน/หัว)แช่แข็งคงท่าเล็งที่อบมา
     (ท่าถือปืนอยู่ใน geometry แล้ว ถ้าไปหมุนแขนปืนจะหลุด — ปัญหาเดิมรอบ 518) */
  if(s.legOnly){
    const moving=(m==='walk'||m==='run'), run=(m==='run');
    if(moving){
      const sp=run?1.5:1.0, w=Math.sin(t*6.2*sp), w2=Math.cos(t*6.2*sp);
      /* วิ่ง = ก้าวถี่กว่า (1.5×) + ยกเข่าสูงกว่า · amp สะโพกคุมไว้ 0.55 ไม่ให้ขาแยกกว้างจนเห็นช่องหว่างขา
         (รอบ 519: amp 0.85 เดิมทำ "เป้า" โหว่ตอนก้าวกว้าง — ผู้ใช้เจอ) */
      const amp=0.55, knee=run?0.9:0.7;
      J.legUL.rotation.x= w*amp;  J.legUR.rotation.x=-w*amp;
      J.legLL.rotation.x=Math.max(0,-w2*knee);  J.legLR.rotation.x=Math.max(0, w2*knee);
      J.hips.position.y=0.92+Math.abs(w)*(run?0.05:0.03);   /* เด้งตามจังหวะก้าว */
    }else{                                            /* ยืนนิ่งถือปืน — ขาตรง */
      J.legUL.rotation.x=J.legUR.rotation.x=0;
      J.legLL.rotation.x=J.legLR.rotation.x=0;
      J.hips.position.y=0.92;
    }
    /* 🎯 รอบ 524: ก้มเงยที่ "เอว" ให้ปากกระบอกเล็งตามทิศเป้า (ยานแม่/ยานลูกยิงมาจากบนฟ้า)
       - จุดหมุน = J.torso ซึ่ง pivot อยู่ที่ขอบล่างกล่องลำตัว = "เอว" (เส้นเขียว) พอดีอยู่แล้ว (autoRigSoldier บรรทัด piv.torso)
       - torso เป็นแม่ของ head/arm/ปืน(baked) ทั้งชุด → หมุน torso จุดเดียว ท่อนบนเอียงเป็นก้อนแข็ง "ปืนไม่หลุด"
       - ขาเป็นลูกของ hips (ไม่ใช่ torso) → หมุน torso ขาไม่ขยับตาม ยังยืน/วิ่งบนพื้นปกติ
       - sign: โมเดล baked หันหน้า −Z → torso.rotation.x "บวก" = ปากกระบอก "เชิดขึ้น" (ยืนยันด้วย strip รอบ 524
         · ทิศตรงข้าม rig วาดเองที่ path ปกติใช้ −up เพราะคนละการวางแกน) → lookUp>0(เป้าสูง) = +pitch = เงยขึ้น
       - clamp องศาก้ม/เงยให้สมจริง (ไม่หักเอวเกินคน) แต่พอเล็งตามยานที่โจมตีจากมุมสูงได้ */
    const up=s.lookUp||0;
    const pitch=Math.max(-0.55, Math.min(0.85, up));  /* เงยขึ้นได้ ~49° · ก้มลงได้ ~32° (เฮลิ/ยานไม่เคยเหนือหัว 60° · เกินนี้เอวหักดูแข็ง) */
    J.torso.rotation.x=pitch;                          /* เอียงท่อนบน+ปืนทั้งชุดที่เอว (บวก=เชิดขึ้น) */
    if(s.fireT>0){ J.torso.rotation.x+=s.fireT*0.05; s.fireT=Math.max(0,s.fireT-0.06); }  /* สะบัดปากปืนเด้งขึ้นตอนยิง */
    /* 🩹 รอบ 525: กลบ "รอยตัดที่ท้อง" ตอนก้มเงย — โมเดล baked เป็นก้อนแข็ง "ไม่ยืด"
       หมุน torso ที่เอว → ฐานลำตัวเผยอห่างจากสะโพก เห็นเป็นช่องโหว่/รอยตัด
       แก้: จม torso ลง (กลบตามแนวดิ่ง) + เลื่อนฐานไปด้านที่รอยเปิด (อ้าหน้าเวลาเงย/อ้าหลังเวลาก้ม)
       → ฐานลำตัวเหลื่อมซ้อนสะโพกปิดรอยต่อ (เก็บฐานเดิมครั้งเดียวกัน error สะสม) */
    if(s._torsoY0==null){ s._torsoY0=J.torso.position.y; s._torsoZ0=J.torso.position.z; }
    const ap=Math.abs(pitch);
    J.torso.position.y=s._torsoY0-0.11*ap;             /* จมลงกลบรอยต่อแนวดิ่ง (จูน strip รอบ 525) */
    J.torso.position.z=s._torsoZ0-0.09*pitch;          /* เงย(+)ดันฐานไปหน้า(−Z) · ก้ม(−)ดันไปหลัง ปิดฝั่งที่อ้า */
    if(s._lastMode!==m){ s._lastMode=m; fitSoldierGround(s); }
    return;                                           /* ⛔ ไม่แตะ head/arm/ปืน local → ปืนไม่มีทางหลุด (เอียงตาม torso เท่านั้น) */
  }
  const br=Math.sin(t*1.6)*0.02;                     /* หายใจ */
  if(m==='walk'){
    const w=Math.sin(t*6.5), w2=Math.cos(t*6.5);
    J.legUL.rotation.x= w*0.62;  J.legUR.rotation.x=-w*0.62;
    J.legLL.rotation.x=Math.max(0,-w2*0.5);  J.legLR.rotation.x=Math.max(0,w2*0.5);
    J.armUL.rotation.x=-w*0.42;  J.armUR.rotation.x= w*0.30;
    J.armLR.rotation.x=-0.55;                        /* ประคองปืนไว้เสมอ */
    J.torso.rotation.y=w*0.06;
    J.hips.position.y=0.92+Math.abs(w)*0.03;
    J.torso.rotation.x=0;
  }else{
    const crouch=(m==='crouch');
    J.legUL.rotation.x=J.legUR.rotation.x=crouch?-0.95:0;
    J.legLL.rotation.x=J.legLR.rotation.x=crouch? 1.35:0;
    J.hips.position.y=crouch?0.58:0.92;
    J.torso.rotation.x=crouch?0.18:br;
    J.torso.rotation.y=0;
    /* ยกปืนเล็ง: แขนขวาแนบแก้ม แขนซ้ายประคองลำกล้อง */
    const aim=(m==='aim'||crouch)?1:0.25;
    J.armUR.rotation.x=-1.32*aim+br;
    J.armLR.rotation.x=-0.42*aim;
    J.armUL.rotation.x=-1.18*aim;
    J.armUL.rotation.z= 0.42*aim;
    J.armLL.rotation.x=-0.62*aim;
    J.armLL.rotation.z=-0.30*aim;
  }
  /* เงยหน้าตามเป้า (ยานลูกอยู่บนฟ้า) */
  const up=s.lookUp||0;
  J.head.rotation.x=-up*0.55;
  J.torso.rotation.x=J.torso.rotation.x-up*0.30;
  /* สะบัดตอนยิง */
  if(s.fireT>0){
    J.armUR.rotation.x-=s.fireT*0.16;
    J.torso.rotation.x-=s.fireT*0.05;
    s.fireT=Math.max(0,s.fireT-0.06);
  }
  /* เปลี่ยนท่าเมื่อไหร่ ปรับความสูงให้เท้าแตะพื้นใหม่ (ท่าเดินวัดตอนจังหวะกลางก้าว) */
  if(s._lastMode!==m){ s._lastMode=m; fitSoldierGround(s); }
}
/* 🔥 รอบ 521: ไฟปากลำกล้องสำหรับโมเดล baked (ปืนอบในตัว ไม่มี flash sprite ในตัว)
   วางที่ "ปลายปืนโดยประมาณ" ใน local ของกลุ่มทหาร (หันหน้า −Z) แยกตามปืน · ค่าจูนจาก strip รอบ 521 */
const MUZZLE_BY_WEAPON={ r93:[1.398,1.317,-0.520], rifle:[0.705,1.281,-0.449] };   /* วัดปลายลำกล้องจริงจาก geometry รอบ 521 (grp-local · ยืนยัน strip) */
/* 🎨 รอบ 522: สีไฟปากลำกล้องแยกตามปืน — KSR-77 = ฟ้าพลังงาน (เข้าธีมแถบเรืองแสง) · R93 = ส้ม-เหลืองปกติ */
const FLASH_COLOR={ r93:0xffe0a0, rifle:0x7fe6ff };
function makeSoldierFlash(weapon){
  const f=new THREE.Sprite(new THREE.SpriteMaterial({color:FLASH_COLOR[weapon]||FLASH_COLOR.rifle,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  const m=MUZZLE_BY_WEAPON[weapon]||MUZZLE_BY_WEAPON.rifle;
  f.scale.setScalar(weapon==='r93'?0.55:0.45); f.position.set(m[0],m[1],m[2]);
  return f;
}
function makeSoldier(x,z,crouch,kind,weapon){
  kind=kind||'a';
  weapon=weapon||'r93';                                /* 🔫 รอบ 521: ปืนที่ทหารคนนี้ถือ (kind 'c' เท่านั้น) */
  const rig=buildSoldierRig();
  const s={grp:rig.grp, J:rig.J, rifle:rig.rifle, crouch:!!crouch, kind:kind, weapon:weapon,
           legOnly:(kind==='c'),                     /* 🔫 รอบ 519: soldier_c ถือ R93 อบมาในตัว → ขยับเฉพาะขา */
           mode:crouch?'crouch':'idle', phase:rnd(0,10), lookUp:0, fireT:0,
           coreBias:(Math.random()<0.3),             /* 🎯 รอบ 526/527: สายรุมยานแม่ (~30% ผู้ใช้เลือก) เมื่อเกราะเปิด — ดู tickSquad */
           shotAt:performance.now()+rnd(0,SQUAD_GAP)};
  s.grp.position.set(x,terrainH(x,z),z);
  poseSoldier(s,performance.now());        /* จัดท่าเริ่มต้นทันที ไม่ให้ยืนตรงแข็งๆ 1 เฟรม */
  scene.add(s.grp);
  if(kind==='c'){ s.flash=makeSoldierFlash(weapon); s.grp.add(s.flash); }   /* 🔥 รอบ 521: ไฟปากลำกล้อง (โมเดล baked ไม่มีในตัว) */
  /* 🧩 มีโมเดลจริงก็สลับให้เอง (ไม่มีไฟล์ = ใช้ทรงที่วาดไว้ ไม่พัง)
     🔫 รอบ 521: kind 'c' = โมเดล baked เลือกไฟล์ตามปืน (r93→soldier_c · rifle/KSR-77→soldier_c_KSR-77) · kind อื่นใช้ชื่อ kind */
  const path=(kind==='c')?bakedSoldierGlb(weapon):('img/models/soldier_'+kind+'.glb');
  loadSoldierGlb(path,function(obj){
    fitInto(obj,1.8);                       /* สูงราว 1.8 ม. เท่าคนจริง */
    obj.position.y=0;
    applySoldierGlb(s,obj);
    /* 🎯 รอบ 524: ย้ายไฟปากลำกล้องไปห้อยใต้ข้อต่อ "ลำตัว(torso)" ที่ก้มเงยได้
       → ทหารเงยเล็งยานบนฟ้า flash เอียงตามปลายปืนจริง ไม่ค้างที่ระดับเดิม (เดิมผูก grp นิ่ง)
       คงค่า MUZZLE_BY_WEAPON เดิม (วัด grp-local ตอนนิ่ง) แปลงเป็น torso-local ครั้งเดียวตอนท่าพัก */
    if(s.flash && !s.static && s.J && s.J.torso){
      s.grp.updateWorldMatrix(true,true);
      const wp=s.flash.getWorldPosition(new THREE.Vector3());
      s.J.torso.add(s.flash);
      s.flash.position.copy(s.J.torso.worldToLocal(wp));
    }
  });
  return s;
}
function makeHeli(i){
  const grp=new THREE.Group();
  const bodyM=new THREE.MeshPhongMaterial({color:0x4a5140,shininess:18,flatShading:true});
  const glassM=new THREE.MeshPhongMaterial({color:0x1b2733,shininess:90});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.35,5.0,8),bodyM);
  body.rotation.x=Math.PI/2; grp.add(body);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(1.42,10,8),glassM); nose.position.z=-2.5; grp.add(nose);
  const tail=new THREE.Mesh(new THREE.CylinderGeometry(.34,.2,5.4,7),bodyM);
  tail.rotation.x=Math.PI/2; tail.position.z=4.2; grp.add(tail);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(.16,1.5,1.1),bodyM); fin.position.set(0,.8,6.3); grp.add(fin);
  const rotor=new THREE.Group();                             // ใบพัดหลัก (หมุนจริงทุกเฟรม)
  for(let k=0;k<4;k++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(.28,.07,9.4),bodyM);
    bl.rotation.y=k*Math.PI/4; rotor.add(bl); }
  rotor.position.y=1.7; grp.add(rotor);
  const trotor=new THREE.Group();
  for(let k=0;k<2;k++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(.14,2.4,.06),bodyM);
    bl.rotation.z=k*Math.PI/2; trotor.add(bl); }
  trotor.position.set(.42,.8,6.3); grp.add(trotor);
  [-1,1].forEach(s=>{                                        // แท่นมิสไซล์ 2 ข้าง
    const pod=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,1.7,8),new THREE.MeshLambertMaterial({color:0x33372c}));
    pod.rotation.x=Math.PI/2; pod.position.set(s*2.0,-.5,-.4); grp.add(pod);
    const wing=new THREE.Mesh(new THREE.BoxGeometry(1.6,.16,1.0),bodyM); wing.position.set(s*1.2,-.2,-.4); grp.add(wing);
  });
  const a=(i/HELI_MAX)*TAU;
  grp.position.set(Math.cos(a)*130, rnd(48,72), Math.sin(a)*130);
  scene.add(grp);
  const h={grp,rotor,trotor,ang:a,rad:rnd(110,165),y:grp.position.y,
           spin:(i%2?-1:1)*rnd(.10,.17), shotAt:performance.now()+rnd(0,HELI_GAP)};
  /* 🚁 รอบ 434: บอทก็ใช้โมเดลจริงลำเดียวกับผู้เล่น — ทุกคนเห็นเฮลิแบบเดียวกันทั้งสนาม */
  heliModel(m=>{ if(!m) return;
    grp.children.slice().forEach(c=>grp.remove(c));
    grp.add(m); h.rotor=m._rotor||rotor; h.trotor=m._trotor||trotor; });
  return h;
}

/* ============================================================
   🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
   ใช้งาน "เหมือนโลกเฮลิฯ ทุกอย่าง": เดินเข้าไปหาลำ → กด 🚁 ขึ้นเครื่อง → รอสตาร์ทเครื่องครบขั้น → บิน
   · ปรับมุมมองในห้องนักบินได้ 3 ระดับ (เต็มลำ / มุมบิน / บินต่ำ) เหมือนปุ่มเบาะของโลกเฮลิฯ
   · ลงจากเครื่องแล้ว "ลำจอดอยู่ตรงนั้น" (ไม่หายไป) เดินกลับขึ้นใหม่ได้
   · จุดจอดทุกลำโชว์บนแผนที่เลือกจุดลงสนาม (เลือกเกิดข้างเฮลิได้เลย)
   ⚠️ ตำแหน่งจอดเป็นค่าตายตัว — ผู้เล่นออนไลน์ทุกเครื่องต้องเห็นลำจอดที่เดียวกัน
   ============================================================ */
const HELI_ROTOR_NODES=['tripo_part_2','tripo_part_7','tripo_part_8'];                    // ชื่อ node ใบพัดหลักใน .glb
const HELI_TROTOR_NODES=['tripo_part_9','tripo_part_10','tripo_part_19','tripo_part_24']; // ใบพัดหาง+ดุม
const HELI_LEN=12.3;                    // ความยาวลำ (เท่าโลกเฮลิฯ)
const HELI_DESERT=0xb6a678;             // 🎨 ย้อมสีลำให้กลืนกับทะเลทราย/สนามรบ (ของเดิมลายแดงสด)
const BOARD_DIST=10;                    // เดินเข้าใกล้เท่านี้ถึงขึ้นเครื่องได้
const START_MS=9500;                    // เวลาสตาร์ทเครื่องก่อนบินได้
const START_PHASES=[
  [0  ,'🌀 กดปุ่มสตาร์ท · เทอร์ไบน์เริ่มหมุน'],
  [2.2,'⛽ จ่ายเชื้อเพลิง · รอจังหวะจุดระเบิด'],
  [4.2,'🔥 จุดระเบิด! เครื่องยนต์ติดแล้ว'],
  [6.2,'🚁 ใบพัดเริ่มหมุน · รอบกำลังไต่ขึ้น'],
  [8.0,'📈 ใบพัดใกล้รอบเต็ม... เตรียมขึ้นบิน'],
];
const HELI_PADS=[                       // จุดจอดหลังแนวรบ (เดินถึงง่าย ไม่กีดขวางถนน)
  {x:-30, z:STREET_Z0+26, rot: 0.15},
  {x: 30, z:STREET_Z0+26, rot:-0.15},
  {x:-72, z:STREET_Z0+52, rot: 0.55},
  {x: 72, z:STREET_Z0+52, rot:-0.55},
  {x:  0, z:STREET_Z0+72, rot: Math.PI},
];
let pads=[], myPad=null, heliReady=false, heliStartAt=0, seatLv=1, padRotorSpin=0;
const SEAT_VIEWS=[                      // มุมมองในห้องนักบิน (เหมือนปุ่มเบาะโลกเฮลิฯ)
  {label:'เต็มลำ', dy:-0.30, dz: 0.85},
  {label:'มุมบิน', dy: 0.00, dz: 0.00},
  {label:'บินต่ำ', dy: 0.32, dz:-0.70},
];
/* โหลด+ประกอบโมเดลลำจริง 1 ลำ (geometry/material แชร์กันทุกลำ = เพิ่มลำแทบไม่กินเครื่อง) */
let heliDesertMat=null;
function heliModel(cb){
  /* ⚡ ใช้ตัวลดโพลี 9.6k tris (ต้นฉบับ 48k) — สนามรบมีได้ถึง 5 ลำพร้อมกัน + ลำเพื่อน
     ต้นฉบับ helicopter.glb ยังใช้ในโลกเฮลิฯ ตามเดิม ไม่ถูกแตะ (สูตรลดอยู่ใน handoff/NOTES.md) */
  loadGlb('img/models/helicopter_lite.glb',src=>{
    if(!src) return cb(null);
    const grp=new THREE.Group();
    /* ครอบ pivot ให้ใบพัดหมุนได้ (โมเดลไม่มี pivot มาให้) */
    const mkSpin=(names,preYaw)=>{
      const parts=names.map(n=>src.getObjectByName(n)).filter(Boolean);
      if(!parts.length) return null;
      const box=new THREE.Box3(); parts.forEach(p=>box.expandByObject(p));
      const holder=new THREE.Group(); holder.position.copy(box.getCenter(new THREE.Vector3()));
      if(preYaw) holder.rotation.y=preYaw;
      const spin=new THREE.Group(); holder.add(spin); src.add(holder);
      src.updateMatrixWorld(true);
      parts.forEach(p=>spin.attach(p));
      return spin;
    };
    const mr=mkSpin(HELI_ROTOR_NODES,0), tr=mkSpin(HELI_TROTOR_NODES,Math.PI/2);
    /* 🧭 โมเดล Tripo หันหัวไป −X → หมุนให้ "หัวชี้ −Z" ตรงกับทิศหน้าของผู้เล่น (สูตรเดียวกับโลกเฮลิฯ) */
    src.rotation.y=-Math.PI/2;
    src.updateMatrixWorld(true);
    const bb=new THREE.Box3().setFromObject(src);
    const s=HELI_LEN/(bb.max.z-bb.min.z);
    src.scale.setScalar(s);
    src.position.set(0,-bb.min.y*s,-3.9-bb.min.z*s);      // สกีแตะพื้น y=0 · จมูกอยู่หน้าที่นั่งนักบิน
    if(!heliDesertMat){ let base=null; src.traverse(o=>{ if(!base&&o.isMesh) base=o.material; });
      if(base){ heliDesertMat=base.clone(); heliDesertMat.color=new THREE.Color(HELI_DESERT); } }
    if(heliDesertMat) src.traverse(o=>{ if(o.isMesh) o.material=heliDesertMat; });
    grp.add(src); grp._rotor=mr; grp._trotor=tr;
    cb(grp);
  });
}
function buildHeliPads(){
  HELI_PADS.forEach((sp,i)=>{
    const p={x:sp.x, z:sp.z, rot:sp.rot, grp:new THREE.Group(), model:null, idx:i};
    p.grp.position.set(p.x,terrainH(p.x,p.z),p.z); p.grp.rotation.y=p.rot;
    scene.add(p.grp);
    heliModel(m=>{ if(m){ p.grp.add(m); p.model=m; } });
    pads.push(p);
  });
}
function padAt(x,z){                                     // ลำจอดที่ใกล้พอจะขึ้นได้
  let best=null,bd=BOARD_DIST;
  for(const p of pads){ if(p===myPad&&inHeli) continue;
    const d=Math.hypot(x-p.x,z-p.z); if(d<bd){ bd=d; best=p; } }
  return best;
}
function movePad(p,x,z,rot){                             // ย้ายลำไปจอดที่ใหม่ (ตอนลงจากเครื่อง)
  p.x=x; p.z=z; p.rot=rot;
  p.grp.position.set(x,terrainH(x,z),z); p.grp.rotation.y=rot;
  p.grp.visible=true;
}
function startPhaseText(now){
  const t=(now-heliStartAt)/1000;
  let txt=START_PHASES[0][1];
  for(const [at,s] of START_PHASES) if(t>=at) txt=s;
  const left=Math.max(0,Math.ceil(START_MS/1000-t));
  return txt+(left?` · ⏱️ ${left} วิ`:'');
}
function setSeatView(lv){
  seatLv=((lv%SEAT_VIEWS.length)+SEAT_VIEWS.length)%SEAT_VIEWS.length;
  if(wrapEl){ wrapEl.classList.remove('seat0','seat1','seat2'); wrapEl.classList.add('seat'+seatLv); }
  if(seatBtn) seatBtn.innerHTML='👁️<small>'+SEAT_VIEWS[seatLv].label+'</small>';
}
/* ใบพัดลำที่จอด: หมุนเฉพาะลำที่กำลังสตาร์ท/ที่เราขับอยู่ (ลำอื่นจอดนิ่ง) */
function tickPads(dt,now){
  padRotorSpin+=dt;
  for(const p of pads){
    if(!p.model) continue;
    const mine=(p===myPad&&inHeli);
    const spd=mine? (heliReady?42:Math.min(42,((now-heliStartAt)/START_MS)*42)) : 0;
    if(p.model._rotor) p.model._rotor.rotation.y+=spd*dt;
    if(p.model._trotor) p.model._trotor.rotation.x+=spd*1.2*dt;
  }
}

/* ============================================================
   🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
   มี img/models/gun_rifle.glb เมื่อไหร่ → สลับใช้โมเดลจริงอัตโนมัติ
   🎯 รอบ 416 (ผู้ใช้ส่งภาพอ้างอิง Delta Force/CoD): ปืน "เอียงทแยง" อยู่มุมขวาล่าง ใหญ่เต็มมือ
      + เห็น "แขนเสื้อลายพราง 2 ข้าง" จับปืน — ค่าจูนอยู่ใน GUN_POS/GUN_ROT/GUN_SCALE ด้านล่าง
   ============================================================ */
/* ⚠️ กฎที่ต้องรู้ก่อนจูน 3 ค่านี้ (เคยพลาดจนปืนบังจอดำทั้งใบ):
   ที่ระยะ d เมตรจากกล้อง จอกว้างจริง = 2·d·tan(FOV/2)·aspect
   FOV 68 · จอ 16:9 → กว้าง ≈ 2.40·d เมตร · สูง ≈ 1.35·d เมตร
   ปืนโมเดลจริงกว้างประมาณ 1.09 × (fitInto × GUN_SCALE) → อยากให้กินจอ ~48% ต้องได้ ~0.88m ที่ d=0.75
   ⛔ อย่าลด z เข้าใกล้กล้องเพื่อ "ให้ปืนใหญ่ขึ้น" โดยไม่ลด scale ตาม — จอจะโดนบังหมด */
/* 🔫 รอบ 440 (ผู้ใช้ส่งภาพอ้างอิงเกมจริง: "ปืนไม่ตั้งอย่างนี้ ให้เอียงและเห็นชัดๆ"):
   ท่าเดิมเล็งปืนขนานแกนกล้องเป๊ะ → มองจากท้ายปืน เห็นเป็น "ท่อตั้งกลางจอ" จำไม่ได้ว่าปืนอะไร
   ท่าใหม่แบบภาพอ้างอิง: ปืนอยู่ล่าง-ขวา · **หันปากกระบอกเฉียงเข้ากลางจอ** (เห็นด้านข้างลำ+กล้อง)
   · เอียงตัวปืน (roll) ให้ดูเป็นแนวทแยง · ขยายอีกนิดให้เห็นรายละเอียด */
/* 🎯 รอบ 445 — เทียบภาพเกมจริง (CoD Mobile) กับของเรา แล้ววัดในเกม เจอต้นตอที่ทำให้ "ต่างกันลิบลับ":
   **ครึ่งท้ายปืนอยู่หลังกล้อง** (วัดได้ระยะติดลบ −0.10 ถึง −0.45 ม.) → โครงปืน/กล้อง/พานท้าย
   ซึ่งเป็นส่วนที่สวยที่สุดถูกตัดทิ้งไปหมด เหลือให้เห็นแค่ "ลำกล้องเรียวๆ" พาดจอ
   เกมจริงวาง view model ให้ **ทั้งกระบอกอยู่หน้ากล้อง** (ท้ายปืนห่างตา ~0.2 ม. ปากกระบอก ~1 ม.)
   → ปืนต้อง "ย่อลง + ดึงเข้ามาใกล้" ไม่ใช่ "ขยายให้ใหญ่" (ยิ่งขยายยิ่งดันท้ายปืนไปหลังกล้อง)
   ผลลัพธ์: เห็นโครงปืนเต็มตัวแบบ 3/4 จากด้านหลัง-ขวา · พานท้ายไหลออกมุมขวาล่าง · เป้าเล็งโล่ง */
/* 🎯 รอบ 450 (ผู้ใช้เทียบภาพ CoD: "ปลายกระบอกของเราเงยมาก ของเค้ากดลง · เค้าดึงปืนแทบประทับไหล่"):
   วัดในเกมได้ว่าของเดิม **ลำกล้องเงยขึ้น 1.1°** และปืนอยู่ห่างตา 0.21–1.03 ม. (ยื่นออกห่างตัว)
   ค่าที่ใช้ตอนนี้ = **กดปากกระบอกลง 12.6°** + ดึงเข้ามาจนท้ายปืนอยู่ที่ 0.10 ม. (ระดับ "ประทับไหล่")
   ⚠️ near plane = 0.1 ม. → ห้ามดึงใกล้กว่านี้ ไม่งั้นพานท้ายจะโดนตัดทะลุกลางลำ */
/* ============================================================
   🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
   จูนแบบไม่ต้องเดา: เปิด preview แล้วรัน (โหลดชุดเครื่องมือ dev จาก tools/gunlab.js)
     await GunLab.boot();  GunLab.tune({deg:5, s:1.35});  GunLab.shot('g.jpg');
   `deg` = มุมแนวปืนบนจอ (0 = นอนขนานพื้น · เลขมาก = ตั้งชัน) — ระบบไล่หา pitch ให้เอง
   แล้วก๊อปเลข 3 บรรทัดที่ GunLab คืนมาวางทับด้านล่าง = จบงาน
   📚 เหตุผล/ประวัติการจูนรอบ 450–456 อยู่ใน handoff/TASKS.md (อย่าเขียนซ้ำในไฟล์นี้)
   ⚖️ 3 กฎที่พิสูจน์มาแล้ว:
     1) ดึงปืนเข้าใกล้ตา = เห็นปืนน้อยลง (ส่วนใกล้บานหลุดขอบ) → อยากเห็นชิ้นที่ตกขอบ
        ต้อง "เพิ่มระยะ z + ขยาย scale" พร้อมกัน
     2) roll ไม่กระทบทิศลำกล้อง แต่ pitch/yaw กระทบ (ปืนจะเล็งผิดทาง — ยอมรับไว้ตั้งแต่รอบ 454
        เพราะผู้ใช้ขอท่าปืนนอน · กระสุนยิงตามกากบาทเสมอ ไม่ได้ยิงตามทิศโมเดล)
     3) ท่าเล็ง (ADS) แยกคนละชุดค่า ดู ADS_POS/ADS_ROT/ADS_SCALE หัวไฟล์
   ============================================================ */
const ZERO_DIST=50;                 // ระยะ zero ลำกล้อง (ม.) — ใช้ตอนอยากให้ปืนเล็งเข้ากากบาทจริง
/* 🔫 รอบ 463: ค่าท่าถือ "แยกตามปืนแต่ละกระบอก" (โมเดลคนละขนาด/คนละจุดหมุน ใช้ค่าร่วมกันไม่ได้)
   ทุกกระบอกถูกจูนให้ได้ภาพแบบเดียวกับ R93: เงาปืนบนจอ ~5.5° · แนวปืนพาดผ่านจุดเล็ง · ขนาดใกล้เคียงกัน

   ╔══════════════════════════════════════════════════════════════════════════╗
   ║ 🔒 LOCKED — ผู้ใช้ตรวจแล้วบอกว่า "สมบูรณ์แบบ" และสั่งล็อกไว้ (22 ก.ค. 2026 · รอบ 498) ║
   ╚══════════════════════════════════════════════════════════════════════════╝
   ค่าที่ล็อก = **ท่าถือทั้ง 2 กระบอกใน GUN_VIEW ด้านล่าง + จุดเล็ง AIM_BY_GUN/AIM_OFF**
     rifle  {p:[0.313,−0.330,−0.707], r:[−0.254,0.139,−0.058], s:1.014}  · จุดเล็ง [0,−0.46]      (50%,73% ของจอ)
     r93    {p:[0.256,−0.118,−0.971], r:[−0.562,−0.124,0.002], s:1.485}  · จุดเล็ง [−0.016,−0.018] (49.2%,50.9%)
   ⛔ **ห้ามแก้ตัวเลขชุดนี้เอง** ไม่ว่าจะเพื่อจัดองค์ประกอบภาพ ปรับ ADS เพิ่มปืนใหม่ หรือ refactor
      แก้ได้เฉพาะเมื่อ **ผู้ใช้สั่งตรง ๆ ในรอบนั้น** (เช่น "เบนขวา 5°" / "ขยาย 10%") เท่านั้น
   ⛔ ปืนกระบอกใหม่ในอนาคต → **เพิ่ม key ใหม่** ใน GUN_VIEW/AIM_BY_GUN · ห้ามยืมหรือขยับค่าของ 2 กระบอกนี้
   📝 ประวัติการจูนที่ได้ค่านี้มา: รอบ 482–497 (Grep `รอบ 49` ใน handoff/archive/TASKS_STATUS.md) */
const GUN_VIEW={
  /* รอบ 487 (ผู้ใช้: "เฉพาะ R93 — ใหญ่ขึ้น 10% + เงยปากกระบอกอีก 5°"): s 1.35 → 1.485
     มุมลำกล้องจริง 3D −9.16° → −4.16° (เงย 5.00° เป๊ะ) · ปากกระบอก y 77.7% → 72.6% ของจอ
     ⚠️ วัดปลายปืน R93 ด้วยการฉายลงจอ **ไม่ได้** — พานท้ายอยู่ *หลังระนาบกล้อง* (z +0.14)
        ค่าที่ฉายออกมาจะเพี้ยนหลักพัน% → ต้องหาแนวลำกล้องด้วย PCA 3 มิติของจุดยอด แล้วค่อยฉายเฉพาะปลายที่อยู่หน้ากล้อง */
  /* รอบ 491 (ผู้ใช้: "เฉพาะ R93 เบนกระบอกปืนไปทางขวาอีก 5° = ท้ายปืนมาทางซ้าย 5°"):
     หมุนรอบ **แกนตั้งที่ผ่านจุดศูนย์กลางปืน** −5° (สูตรเดียวกับไรเฟิลรอบ 482 · ห้ามบวก yaw ตรง ๆ)
     ทิศลำกล้องในแนวราบ +4.41° (เบนซ้าย) → **−0.59°** = เบนขวา 5.00° เป๊ะ · มุมก้ม-เงยคงที่ −4.16°
     ปากกระบอกบนจอ x 55.7% → 58.8% · จุดศูนย์กลางปืนอยู่ที่เดิม
     รอบ 492 (ผู้ใช้: "เบนขวาเพิ่มอีก 5°"): แนวราบ −0.58° → **−5.58°** · ปากกระบอก x 58.7% → 61.8%
       (มุมก้ม-เงยคงที่ −4.14° · จุดศูนย์กลางอยู่ที่เดิม)
     รอบ 493 (ผู้ใช้: "หันคืนซ้าย 3° แล้วกดปลายกระบอกลง 3°") — ทำ 2 จังหวะรอบจุดศูนย์กลางเดียวกัน:
       ① หมุนรอบแกนตั้ง +3° → แนวราบ −5.60° → −2.60°  ② หมุนรอบแกนนอนตั้งฉากลำกล้อง −3° → มุมก้ม −4.15° → −7.15°
       ปากกระบอกบนจอ 61.8%,72.9% → 59.9%,75.1%
     รอบ 494 (ผู้ใช้: "เบนขวาเพิ่มอีก 2°"): แนวราบ −2.58° → **−4.58°** · ปากกระบอก x 59.9% → 61.1%
       (มุมก้ม-เงยคงที่ −7.14°)
     รอบ 496 (ผู้ใช้: "ปรับปลายปืนขึ้น 3°"): มุมก้ม −7.13° → **−4.13°** · ทิศแนวราบคงที่ −4.55°
       ปากกระบอกบนจอ y 75.1% → 72.3% (วัดที่ 1512×717) */
  r93:   {p:[0.256,-0.118,-0.971],  r:[-0.562,-0.124,0.002], s:1.485},
  /* รอบ 470 (ผู้ใช้: "สลับมุมก้ม/เงย ของปลายปืนกับพานท้าย" — เฉพาะไรเฟิล R93 ดีแล้ว):
     เดิมปากกระบอกต่ำกว่าพานท้าย 0.42 หน่วยจอ → ตอนนี้ปากกระบอก **สูงกว่า** พานท้าย 0.16
     ทำได้โดยลดมุมก้ม (−.504→−.44) + หันเข้าใน (yaw .46) + ลดตัวปืนลง (y −.46)
     ยังคงแนวปืนแบน 5° และเห็นตัวปืนในเฟรม 91% */
  /* รอบ 472 (ผู้ใช้ขีดเส้นแดงบนภาพ: "จุดกึ่งกลางของปลายปืน ขึ้นไปอยู่ตามแนวเส้นแดง")
     เส้นที่ขีดพาดผ่าน "จุดเล็ง" พอดี (73% ความสูงจอ = AIM_OFF) → เป้าหมายคือยกให้
     ปลายลำกล้องอยู่ระดับเดียวกับจุดเล็ง · วัดแล้ว pitch ยกไม่ได้ (จุดหมุนของโมเดลอยู่ใกล้ปากกระบอก
     ลากแขนสั้นมาก) จึงยกทั้งกระบอกด้วยแกน y: −0.46 → −0.245 (ปลายลำกล้อง 84.9% → 73.0%)
     รอบ 475 (ผู้ใช้: "ต่ำลงมา 5%"): −0.245 → −0.339 = ปลายลำกล้อง 73.1% → 78.1% ของจอ (ต่ำลง 5.0 จุด)
     รอบ 476 (ผู้ใช้สั่ง 3 อย่างพร้อมกัน): ลงทั้งกระบอก 3% + กดท้ายปืนลงอีก 3% + ขยาย 2%
       → ปลายลำกล้อง 78.2% → 81.2% · ท้ายปืน 83.8% → 89.8% · s 1.146 → 1.169
       ⚠️ "เลื่อนลงเฉย ๆ" ทำให้ท้ายปืนตกเร็วกว่าปลายลำกล้องเกือบ 3 เท่า (perspective — ท้ายปืนอยู่ใกล้ตา)
          จึงต้องแก้ 2 ค่าคู่กัน (y + pitch) ถึงจะได้ "ลงเท่ากันทั้งกระบอก" แล้วค่อยกดท้ายเพิ่ม
     รอบ 479 (ผู้ใช้: "ท้ายปืนลง 2% · ปลายกระบอกขึ้น 2% · ใหญ่อีก 3%"):
       ปลายลำกล้อง 81.2% → 79.2% · ท้ายปืน 89.9% → 91.9% · s 1.169 → 1.204 (แก้ y+pitch คู่กันเหมือนรอบ 476)
     รอบ 479 (ผู้ใช้: "ปลายกระบอกขึ้น 3%"): ปลายลำกล้อง 79.2% → 76.2% · ท้ายปืนคงที่ 91.9% (มุมเงาปืน 4.8° → 7.7°)
     รอบ 480 (ผู้ใช้: "ดึงปืนถอยหลัง 10%"): เลื่อนถอยตาม "แนวลำกล้องของตัวเอง" 10% ของความยาวปืน
       → ปากกระบอกถอยจาก x 49.2% → 52.9% ของจอ (ตามแนวปืน) · ขนาดบนจอเท่าเดิม (len 1.785 → 1.788)
       ⚠️ ถอยแล้วปืนเข้าใกล้ตา (z −.95 → −.815) ภาพจะโตขึ้นเอง → ต้องหด s ชดเชย (1.204 → 0.946)
          ทำพร้อมกัน 2 ค่า (ระยะถอย + scale) ไม่งั้นได้ "ปืนโตขึ้น" แทน "ปืนถอย"
     รอบ 481 (ผู้ใช้: "ขยับลงทั้งกระบอก 3%"): ปลายลำกล้อง 77.1% → 80.0% · ท้ายปืน 92.2% → 95.1%
       (แก้ y คู่กับ pitch เหมือนรอบ 476 — เลื่อน y เฉย ๆ ท้ายปืนจะตกเร็วกว่าปลายลำกล้อง)
     รอบ 482 (ผู้ใช้ขีดแกนบนภาพ: "หมุนรอบแกนตั้งกลางปืน 20° ให้ปากกระบอกไปขวา ท้ายปืนมาซ้าย"):
       หมุนจริงรอบแกน Y ที่ลากผ่าน **จุดศูนย์กลางมวลของโมเดล** (view space) −20° แล้วถอด Euler XYZ ใหม่
       → ปากกระบอก x 53.5% → 57.3% ของจอ · ท้ายปืน 98.2% → 88.3% · ศูนย์กลางอยู่ที่เดิม (0.278,−0.353,−0.846)
       ⚠️ ห้ามแก้ค่า yaw ตรง ๆ — Euler เรียง XYZ (pitch มาก่อน) การบวก yaw จะได้แกนหมุนผิด (เอียงตาม pitch)
          ต้องคูณเมทริกซ์ T(C)·Ry(a)·T(−C) ทับของเดิมแล้ว decompose ใหม่ (จึงมีทั้ง p/r เปลี่ยนพร้อมกัน)
     รอบ 483 (ผู้ใช้: "ขยายใหญ่ขึ้น 10% + ยกปากกระบอกขึ้นอีก 10 องศา"):
       ขยายรอบจุดศูนย์กลางปืน (โตอยู่กับที่ ไม่ไถลออกนอกจอ) s 0.946 → 1.041
       เงยลำกล้อง **10.00° เป๊ะในโลกจริง 3D** (−14.76° → −4.76° เทียบระนาบพื้น)
       ⚠️ แกนที่ใช้เงย = แกนนอนที่ **ตั้งฉากกับแนวลำกล้อง** (u = (dz,0,−dx) ของทิศท้าย→ปาก)
          ไม่ใช่แกน X ของจอ — เพราะปืนถูก yaw ไว้แล้ว หมุนรอบแกน X จอจะได้ไม่ครบ 10° (วัดได้ 9.0°)
       ผลบนจอ: ปากกระบอก y 79.1% → 74.5% · ท้ายปืนเลื่อนลงพ้นขอบล่าง (เห็นตัวปืน 93% → 84%)
     รอบ 484 (ผู้ใช้: "กดปากกระบอกลง 5 องศา"): หมุนรอบแกน u เดิม −5° → มุมลำกล้อง −4.76° → −9.75°
       ปากกระบอก y 74.3% → 76.9% · ท้ายปืนกลับขึ้นมาในเฟรมมากขึ้น (เห็นตัวปืน 84% → 89%)
     รอบ 485 (ผู้ใช้: "ขยายใหญ่ขึ้น 10%" อีกครั้ง): s 1.041 → 1.145 (ขยายรอบจุดศูนย์กลางปืนเหมือนเดิม)
       ปากกระบอกอยู่จุดเดิม (57.1%,76.9% → 56.7%,76.7%) · มุมลำกล้องคงที่ −9.7° · ท้ายปืนยาวพ้นขอบขวา-ล่างมากขึ้น
     รอบ 486 (ผู้ใช้: "ดึงถอยหลังเล็กน้อย จะได้ไม่เห็นว่าปืนลอย เพราะไม่มีมือจับ"):
       ถอยตามแนวลำกล้องตัวเอง 10% ของความยาวปืน + หด s ชดเชย (1.145 → 1.014) ขนาดบนจอเท่าเดิม
       → ปากกระบอกไถลลงมาตามแนวปืน (56.6%,76.6% → 58.6%,78.1%) · ท้ายปืนพ้นขอบมากขึ้น เห็นตัวปืน 86% → 81%
          = พานท้ายวิ่งออกนอกเฟรม ไม่เห็นปลายลอยกลางอากาศอีก
       🪤 **กับดัก (เสียเวลาไป 1 รอบ):** ห้ามใช้ `gunSil().len` คุมขนาดตอนถอย — มันวัดเฉพาะจุดที่ *อยู่ในเฟรม*
          พอท้ายปืนหลุดขอบ len จะสั้นลงเอง ลูปชดเชยเลยขยายปืนไม่หยุด (s พุ่ง 1.38 · ท้ายปืนไป 304% ของจอ)
          → ต้องชดเชยด้วย **อัตราส่วนระยะลึกของจุดศูนย์กลาง** (s_ใหม่ = s × depth_ใหม่/depth_เดิม) */
  rifle: {p:[0.312,-0.330,-0.707], r:[-0.254,0.139,-0.058], s:1.014},
};
const GUN_POS=[.22,-.17,-.95];      // ← ค่าที่ "กำลังใช้อยู่" (คัดมาจาก GUN_VIEW ตอนสลับปืน)
const GUN_ROT=[-.645,.004,.09];
let   GUN_SCALE=1.35;
/* คัดค่าของปืนที่ถืออยู่มาใส่ตัวแปรที่ระบบวาดใช้จริง */
function useGunView(){
  const v=GUN_VIEW[weapon]||GUN_VIEW.r93;
  GUN_POS[0]=v.p[0]; GUN_POS[1]=v.p[1]; GUN_POS[2]=v.p[2];
  GUN_ROT[0]=v.r[0]; GUN_ROT[1]=v.r[1]; GUN_ROT[2]=v.r[2];
  GUN_SCALE=v.s;
}
const MUZZLE_Y=.012;                // แกนลำกล้องมาตรฐาน (ทุกโมเดลถูกเลื่อนมาที่ระดับนี้)
/* 📐 ท่านี้วัดจากในเกมจริง (จุดปลายลำกล้อง/พานท้ายฉายลงจอ): ปากกระบอกอยู่ (0.13,−0.32) เฉียงเข้ากลางจอ 17°
   · ยอดกล้องส่องอยู่ (0.28,−0.05) เห็นเต็มๆ · พานท้ายไหลออกมุมขวาล่าง = องค์ประกอบเดียวกับภาพอ้างอิง */
/* 💪 แขนเสื้อลายพรางจับปืน — สร้างเองเสมอ (ไม่ถูกแทนตอนโหลด .glb ปืน) */
/* ============================================================
   💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
   วัสดุ/สัดส่วน "ชุดเดียวกับทหารฝ่ายเรา" (ดู buildSoldierRig / SOLDIER_PARTS)
   → ผู้เล่นรู้สึกเป็นทหารคนเดียวกับหมู่ · gunArms เป็น "ลูกของ gunGrp"
   ⇒ sway(501)/recoil(500)/ADS(499)/lag(464)/sprint(448)/gasp(508)/เดิน ตามอัตโนมัติ
   ⛔ เป็นออฟเซ็ตทับล้วน — ไม่แตะค่าปืนที่ล็อก (GUN_VIEW/AIM/ADS/SWAY กล่อง LOCKED)
   จุดยึด (พิกัด gunGrp ก่อน scale): ด้ามปืน≈(0,-.13,.11) · การ์ดมือหน้า rifle≈z-.32 / r93≈z-.54
   ============================================================ */
/* สร้าง "มือกำ" หันฝ่ามือเข้าหาปืน — สันนิ้ว 4 นิ้วพาดคร่อมด้านบน + ปลายนิ้วงุ้ม + นิ้วโป้งอีกฝั่ง */
function buildFist(glove,skin,trigger){
  const h=new THREE.Group();
  const wrist=new THREE.Mesh(new THREE.CylinderGeometry(.052,.05,.05,8),skin);
  wrist.rotation.x=Math.PI/2; wrist.position.set(0,-.005,.075); h.add(wrist);   // ผิวโผล่ที่ข้อมือ
  const palm=new THREE.Mesh(new THREE.BoxGeometry(.088,.072,.12),glove); h.add(palm);
  const knuck=new THREE.Mesh(new THREE.BoxGeometry(.09,.03,.052),glove);
  knuck.position.set(0,.036,-.05); h.add(knuck);                                // สันนิ้ว
  for(let i=0;i<4;i++){                                                         // นิ้ว 4 (ปล้องบน)
    const proximal=(trigger&&i===0);                                            // นิ้วชี้เหยียดแตะไก
    const f=new THREE.Mesh(new THREE.BoxGeometry(.021,.052,.05),glove);
    f.position.set(-.031+i*.021,.012,-.066); f.rotation.x=proximal?-.15:-.55; h.add(f);
    const tip=new THREE.Mesh(new THREE.BoxGeometry(.019,.044,.03),glove);       // ปลายนิ้วงุ้มลง
    if(proximal){ tip.position.set(-.031,-.006,-.11); tip.rotation.x=-.5; }
    else{ tip.position.set(-.031+i*.021,-.03,-.086); tip.rotation.x=-1.2; }
    h.add(tip);
  }
  const thumb=new THREE.Mesh(new THREE.BoxGeometry(.026,.028,.072),glove);      // นิ้วโป้งพาดอีกฝั่ง
  thumb.position.set(.05,-.004,-.018); thumb.rotation.set(-.35,0,.55); h.add(thumb);
  return h;
}
function buildArms(){
  const uni  =new THREE.MeshLambertMaterial({color:0x6b6f4a});   // แขนเสื้อลายพราง (=soldier uni)
  const cuffM=new THREE.MeshLambertMaterial({color:0x54583a});   // ขอบแขนเสื้อเข้มคั่น
  const skin =new THREE.MeshLambertMaterial({color:0xc79a72});   // ผิว (=soldier skin) โผล่ที่ข้อมือ
  const glove=new THREE.MeshLambertMaterial({color:0x39352b});   // ถุงมือยุทธวิธี
  const arms=new THREE.Group();

  /* ── ขวา: มือลั่นไก (กำด้ามปืน) ทอดจากมุมขวาล่างเข้าหาด้าม ── */
  const rSide=new THREE.Group(); arms.add(rSide);
  const rArm=new THREE.Mesh(new THREE.CylinderGeometry(.056,.082,.56,10),uni);
  rArm.position.set(.17,-.27,.24); rArm.rotation.set(1.12,0,-.28); rSide.add(rArm);
  const rCuff=new THREE.Mesh(new THREE.CylinderGeometry(.078,.086,.06,10),cuffM);
  rCuff.position.set(.075,-.155,.075); rCuff.rotation.set(1.12,0,-.28); rSide.add(rCuff);
  const rHand=buildFist(glove,skin,true);
  rHand.position.set(.012,-.115,.085); rHand.rotation.set(.28,-.06,-.20); rSide.add(rHand);

  /* ── ซ้าย: มือประคองการ์ดมือ พาดเฉียงข้ามจอ (lSide เลื่อน z ตามความยาวลำกล้องแต่ละกระบอก) ── */
  const lSide=new THREE.Group(); arms.add(lSide); arms.userData.lSide=lSide;
  const lArm=new THREE.Mesh(new THREE.CylinderGeometry(.054,.08,.66,10),uni);
  lArm.position.set(-.16,-.28,-.02); lArm.rotation.set(1.02,0,.5); lSide.add(lArm);
  const lCuff=new THREE.Mesh(new THREE.CylinderGeometry(.076,.084,.06,10),cuffM);
  lCuff.position.set(-.06,-.155,-.145); lCuff.rotation.set(1.02,0,.5); lSide.add(lCuff);
  const lHand=buildFist(glove,skin,false);
  lHand.position.set(-.008,-.075,-.30); lHand.rotation.set(.12,.16,.28); lSide.add(lHand);

  return arms;
}
/* ============================================================
   🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
   โมเดล: หมัดกำ+แขนเสื้อลายพราง · แกนแขน=X (หมัด −X · ข้อศอก/แขนเสื้อ +X) · ข้อนิ้ว +Y
   ทำเป็น "มือขวา 1 ตัว + mirror(scale.x=−1) เป็นมือซ้าย" วาง 2 จุด (ด้าม/การ์ดมือ)
   ⚠️ draw-on-top (depthTest=false): ปืนล็อกไว้สูง+ลำกล้องหนา ถ้า depth ปกติมือจะจมในตัวปืน
      view-model วาดมือทับตัวเองเป็นเทคนิคมาตรฐาน FPS · ในเลนส์ ADS ซ่อน gunGrp อยู่แล้ว มือไม่โผล่
   🔧 จูนค่าใน HAND_POSE แล้วอัปเดตที่นี่ (เป็นออฟเซ็ตทับล้วน ไม่แตะค่าปืนที่ล็อก) */
/* ท่ามือ "แยกต่อกระบอก" (เหมือน GUN_VIEW) — จำเป็นเพราะมือเป็นลูก gunGrp จึงโดน GUN_SCALE
   ของแต่ละปืนคูณ (rifle 1.014 · r93 1.485) → ต้องตั้ง scale/ตำแหน่งของมือแยกกันให้ขนาดบนจอเท่ากัน
   p=ตำแหน่ง (พิกัด gunGrp local) · r=องศา(x,y,z) · scale=ย่อคอนเทนเนอร์ (มือซ้าย mirror x อัตโนมัติ) */
const HAND_POSE={
  size:0.46,                                   // fitInto ความยาวแขน-หมัดทั้งท่อนตอนโหลด
  rifle:{ scale:0.57,
    right:{ p:[0.07,-0.15,0.05],  r:[0.15,-0.20,-1.25] },   // มือขวา = จับด้าม/ไก
    left: { p:[-0.04,-0.15,-0.34], r:[0.10,0.20,1.20] } },  // มือซ้าย = ประคองการ์ดมือ
  r93:{ scale:0.39,
    right:{ p:[0.05,-0.22,0.06],  r:[0.15,-0.20,-1.25] },
    left: { p:[-0.01,-0.19,-0.62], r:[0.10,0.20,1.20] } },  // สไนเปอร์ลำกล้องยาว มือหน้าเลื่อนไปหน้า
};
function makeHandTopMat(src){                   // ใช้ texture เดิมของโมเดล แต่วาดทับ (ไม่จมปืน)
  const m=src.clone(); m.depthTest=false; m.depthWrite=false; return m;
}
/* 🦾 ท่อนแขนต่อ — โมเดล GLB มีแค่หมัด+ปลอกแขนสั้น ดูเหมือน "แขนขาด" ลอย
   ต่อทรงกระบอกลายพรางจากปลายปลอกแขน (แกนแขน=+X ของโมเดลที่ fitInto แล้ว) ยื่นออกมา
   ตามทิศเดียวกับที่ปลอกแขนชี้ (หลังหมุนคอนเทนเนอร์ = พุ่งลงเข้าหากล้อง) จนตกขอบล่างจอ */
const FOREARM={ x0:0.10, len:1.45, r1:0.175, r2:0.225, y:0.0, z:0.0, color:0xa88951 };
function addForearm(container){
  const m=new THREE.MeshLambertMaterial({color:FOREARM.color,depthTest:false,depthWrite:false});
  const arm=new THREE.Mesh(new THREE.CylinderGeometry(FOREARM.r2,FOREARM.r1,FOREARM.len,14),m);
  arm.rotation.z=Math.PI/2;                      // วางตามแกน X (แกนแขน)
  arm.position.set(FOREARM.x0+FOREARM.len/2, FOREARM.y, FOREARM.z);
  arm.renderOrder=13;                            // อยู่หลังหมัด(14) หน้าตัวปืน
  container.add(arm); container.userData.forearm=arm;
}
function loadHandModel(){
  loadGlb('img/models/hand_grip.glb',(model)=>{
    if(!gunArms) return;
    fitInto(model,HAND_POSE.size);             // ย่อ+จัดศูนย์กลางที่ origin
    model.traverse(o=>{ if(o.isMesh&&o.material){
      o.material=Array.isArray(o.material)?o.material.map(makeHandTopMat):makeHandTopMat(o.material);
      o.renderOrder=14;                         // วาดหลังตัวปืน
    }});
    /* มือขวา (ต้นฉบับ) + มือซ้าย (mirror แกน X) — ห่อในคอนเทนเนอร์เพื่อจูนตำแหน่ง/องศาแยกกัน */
    const rHandC=new THREE.Group(); rHandC.add(model); addForearm(rHandC);
    const lHandC=new THREE.Group(); const lm=model.clone(true);
    lm.traverse(o=>{ if(o.isMesh&&o.material) o.material=Array.isArray(o.material)?o.material.map(makeHandTopMat):makeHandTopMat(o.material); });
    lHandC.add(lm); addForearm(lHandC); lHandC.scale.x=-1;          // mirror → มือซ้าย
    gunArms.userData.rHandC=rHandC; gunArms.userData.lHandC=lHandC;
    /* เอาทรง fallback (กล่อง) ออก เหลือมือ GLB จริง */
    gunArms.children.slice().forEach(c=>gunArms.remove(c));
    gunArms.add(rHandC); gunArms.add(lHandC);
    gunArms.userData.glb=true;
    fitArmsToWeapon(weapon);
    gunArms.visible=true;
  });
}
function applyHandPose(w){
  const u=gunArms&&gunArms.userData; if(!u||!u.rHandC) return;
  const P=HAND_POSE[w]||HAND_POSE.rifle, s=P.scale, R=P.right, L=P.left;
  u.rHandC.scale.set(s,s,s);
  u.rHandC.position.set(R.p[0],R.p[1],R.p[2]); u.rHandC.rotation.set(R.r[0],R.r[1],R.r[2]);
  u.lHandC.scale.set(-s,s,s);                  // มือซ้าย mirror แกน X
  u.lHandC.position.set(L.p[0],L.p[1],L.p[2]); u.lHandC.rotation.set(L.r[0],L.r[1],L.r[2]);
}
/* 🎯 จัดท่ามือให้เข้ากับกระบอกที่ถือ (GLB=ท่าแยกต่อกระบอก · fallback กล่อง=เลื่อน z มือหน้า) */
function fitArmsToWeapon(w){
  if(!gunArms) return;
  if(gunArms.userData.rHandC) applyHandPose(w);                                   // GLB
  else if(gunArms.userData.lSide) gunArms.userData.lSide.position.z=(w==='r93')?-0.22:0;  // fallback กล่อง
}
/* 🔫 ทรงไรเฟิลจู่โจม (ของเดิม) */
function buildRifleModel(){
  const g=new THREE.Group();
  const met=new THREE.MeshPhongMaterial({color:0x2b2f36,shininess:48,flatShading:true});
  const dark=new THREE.MeshPhongMaterial({color:0x16181d,shininess:20});
  const accent=new THREE.MeshBasicMaterial({color:0x3ad4ff});
  const rec=new THREE.Mesh(new THREE.BoxGeometry(.10,.13,.42),met); g.add(rec);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.024,.028,.52,8),dark);
  bar.rotation.x=Math.PI/2; bar.position.set(0,.012,-.44); g.add(bar);
  const shr=new THREE.Mesh(new THREE.BoxGeometry(.075,.085,.30),met); shr.position.set(0,.012,-.34); g.add(shr);
  const grip=new THREE.Mesh(new THREE.BoxGeometry(.065,.19,.08),dark);
  grip.position.set(0,-.13,.10); grip.rotation.x=-.22; g.add(grip);
  const mag=new THREE.Mesh(new THREE.BoxGeometry(.062,.20,.10),dark);
  mag.position.set(0,-.14,-.06); mag.rotation.x=.10; g.add(mag);
  const stock=new THREE.Mesh(new THREE.BoxGeometry(.07,.10,.26),met); stock.position.set(0,-.02,.32); g.add(stock);
  const sc=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,.20,8),dark);
  sc.rotation.x=Math.PI/2; sc.position.set(0,.10,-.12); g.add(sc);
  const led=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.10),accent); led.position.set(.055,.05,-.20); g.add(led);
  const led2=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.10),accent); led2.position.set(-.055,.05,-.20); g.add(led2);
  return g;
}
/* 🎯 ทรง R93 สไนเปอร์ — ลำกล้องยาว · กล้องเล็งใหญ่ · คันรั้งลูกเลื่อนดึงตรงด้านขวา · ขาทราย */
function buildR93Model(){
  const g=new THREE.Group();
  const met=new THREE.MeshPhongMaterial({color:0x33383f,shininess:54,flatShading:true});
  const dark=new THREE.MeshPhongMaterial({color:0x14161a,shininess:26});
  const wood=new THREE.MeshPhongMaterial({color:0x4a3a2a,shininess:18});
  const glass=new THREE.MeshBasicMaterial({color:0x8fd8ff});
  const rec=new THREE.Mesh(new THREE.BoxGeometry(.10,.14,.50),met); g.add(rec);
  /* ลำกล้องยาว (ยาวกว่าไรเฟิลเกือบเท่าตัว) + ปลอกลดแรงถอย */
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.020,.023,.92,10),dark);
  bar.rotation.x=Math.PI/2; bar.position.set(0,.015,-.70); g.add(bar);
  const brake=new THREE.Mesh(new THREE.CylinderGeometry(.036,.036,.13,10),met);
  brake.rotation.x=Math.PI/2; brake.position.set(0,.015,-1.12); g.add(brake);
  /* กล้องเล็งใหญ่ + เลนส์ 2 ฝั่ง */
  const scope=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.44,12),dark);
  scope.rotation.x=Math.PI/2; scope.position.set(0,.135,-.16); g.add(scope);
  [-.38,.06].forEach((z,i)=>{
    const bell=new THREE.Mesh(new THREE.CylinderGeometry(.066,.052,.10,12),met);
    bell.rotation.x=Math.PI/2; bell.position.set(0,.135,z); g.add(bell);
    const lens=new THREE.Mesh(new THREE.CircleGeometry(.058,14),glass);
    lens.position.set(0,.135,z+(i?.052:-.052)); lens.rotation.y=i?0:Math.PI; g.add(lens);
  });
  [-.10,.10].forEach(z=>{                                   // ห่วงยึดกล้อง
    const ring=new THREE.Mesh(new THREE.BoxGeometry(.07,.09,.05),met);
    ring.position.set(0,.085,z); g.add(ring);
  });
  /* คันรั้งลูกเลื่อน "ดึงตรง" ยื่นออกขวา (เอกลักษณ์ R93) */
  const boltArm=new THREE.Mesh(new THREE.CylinderGeometry(.016,.016,.17,8),met);
  boltArm.rotation.z=Math.PI/2; boltArm.position.set(.10,.035,.14); g.add(boltArm);
  const boltKnob=new THREE.Mesh(new THREE.SphereGeometry(.032,10,8),dark);
  boltKnob.position.set(.19,.035,.14); g.add(boltKnob); g.userData.bolt=boltKnob;
  /* ด้ามจับ + แม็ก 10 นัด + พานท้ายไม้ */
  const grip=new THREE.Mesh(new THREE.BoxGeometry(.062,.20,.085),dark);
  grip.position.set(0,-.15,.14); grip.rotation.x=-.20; g.add(grip);
  const mag=new THREE.Mesh(new THREE.BoxGeometry(.058,.17,.13),dark);
  mag.position.set(0,-.15,-.04); g.add(mag);
  const stock=new THREE.Mesh(new THREE.BoxGeometry(.072,.155,.40),wood);
  stock.position.set(0,-.045,.42); g.add(stock);
  const cheek=new THREE.Mesh(new THREE.BoxGeometry(.076,.05,.22),wood);
  cheek.position.set(0,.055,.36); g.add(cheek);
  /* ขาทราย (bipod) พับอยู่ใต้ลำกล้องหน้า */
  [-1,1].forEach(s=>{
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(.011,.011,.26,6),met);
    leg.position.set(s*.045,-.10,-.92); leg.rotation.set(.32,0,s*.22); g.add(leg);
  });
  return g;
}
/* ============================================================
   🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
   ทำไมยืดในโค้ดแล้วไม่เพี้ยน: ลำกล้องเป็น "ทรงกระบอกตรง" ยืดตามแกนของมันเอง
   รูปทรงหน้าตัดไม่เปลี่ยน เห็นเป็นลำกล้องยาวขึ้นเฉยๆ (ต่างจากการขยายทั้งกระบอกที่จะอ้วนตาม)
   วิธี: ตัดปืนเป็น 2 ส่วนที่ระนาบ GUN_CUT
     · ชิ้น "ยาวเรียว" ฝั่งหน้า (ลำกล้อง) → ยืดตามแกน Z อย่างเดียว โดยตรึงปลายท้ายไว้
     · ชิ้นอื่นฝั่งหน้า (ปากลำกล้อง/ศูนย์หน้า/ขาทราย) → เลื่อนไปข้างหน้าเท่าที่ลำกล้องยาวขึ้น
     · ฝั่งท้าย (โครง/กล้อง/ด้าม/พานท้าย) → ไม่แตะเลย
   ============================================================ */
const GUN_CUT=0.46;      /* ระนาบตัด: สัดส่วนความยาวปืนวัดจากท้าย (0=ท้ายสุด 1=ปากกระบอก) */
const GUN_STRETCH=1.7;   /* ยืดลำกล้องกี่เท่า — ปรับค่านี้ค่าเดียวถ้าอยากยาว/สั้นกว่านี้ */
/* 🧭 รอบ 429: จัดแกนปืนอัตโนมัติ — โมเดลที่เจนมามักวางตามแกน X (ลำกล้องชี้ข้าง)
   เกมต้องการให้ "ลำกล้องชี้ −Z" ทั้งเพื่อการถือ และเพื่อให้ stretchGunBarrel ทำงานถูก
   วิธี: ① หมุนให้แกนที่ยาวที่สุดมาเป็น Z ② ดูปลายไหน "เรียวกว่า" = ปากกระบอก แล้วให้ชี้ −Z
        (ปลายพานท้ายจะอ้วนกว่าปลายลำกล้องเสมอ) */
function orientGunModel(obj){
  obj.updateWorldMatrix(true,true);
  const b=new THREE.Box3().setFromObject(obj), sz=b.getSize(new THREE.Vector3());
  if(sz.x>=sz.y && sz.x>=sz.z)      obj.rotation.y+=Math.PI/2;   /* ยาวตาม X → หมุนมาเป็น Z */
  else if(sz.y>sz.x && sz.y>sz.z)   obj.rotation.x+=Math.PI/2;   /* ยาวตาม Y → หมุนมาเป็น Z */
  obj.updateWorldMatrix(true,true);
  const b2=new THREE.Box3().setFromObject(obj);
  const zMin=b2.min.z, zMax=b2.max.z, L=zMax-zMin;
  if(L<=0.0001) return false;
  /* ⚠️ อย่าใช้ "ความอ้วนเฉลี่ยของปลาย" ตัดสิน — ขาทราย/ปากลำกล้อง/ศูนย์หน้า อ้วนพอกับพานท้าย
     ใช้ "จุดศูนย์กลางมวล" แทน: ปืนหนักทางท้ายเสมอ (พานท้าย+โครง+กล้อง+แม็ก+ด้าม)
     ส่วนลำกล้องผอมและเบา → มวลอยู่ฝั่งไหน ฝั่งนั้นคือท้ายปืน */
  let mz=0, mn=0;
  obj.traverse(function(o){
    if(!o.isMesh||!o.geometry.attributes.position) return;
    const bb=new THREE.Box3().setFromObject(o), c=bb.getCenter(new THREE.Vector3());
    const w=o.geometry.attributes.position.count;
    mz+=c.z*w; mn+=w;
  });
  let flipped=false;
  if(mn){
    const cz=mz/mn, mid=(zMin+zMax)/2;
    if(cz<mid){ obj.rotation.y+=Math.PI; obj.updateWorldMatrix(true,true); flipped=true; }  /* มวลอยู่ทาง −Z = ท้ายปืนหันไปหน้า → กลับ */
  }
  return flipped;
}
function stretchGunBarrel(obj,cut,k){
  cut=(cut===undefined)?GUN_CUT:cut; k=(k===undefined)?GUN_STRETCH:k;
  if(k===1) return 0;
  obj.updateWorldMatrix(true,true);
  const meshes=[];
  obj.traverse(function(o){ if(o.isMesh) meshes.push(o); });
  if(!meshes.length) return 0;
  /* แบนพิกัดเป็นโลกก่อน จะได้คิดง่าย ไม่ต้องตาม transform ซ้อนกัน */
  meshes.forEach(function(m){
    m.updateWorldMatrix(true,false);
    const wm=m.matrixWorld.clone();
    if(m.parent) m.parent.remove(m);
    wm.decompose(m.position,m.quaternion,m.scale);
    obj.add(m);
  });
  obj.position.set(0,0,0); obj.rotation.set(0,0,0); obj.scale.set(1,1,1);
  obj.updateWorldMatrix(true,true);
  const all=new THREE.Box3().setFromObject(obj);
  /* ปืนวางตามแกน Z โดยปากกระบอกอยู่ทาง −Z (ตามที่เกมกำหนด) */
  const zBack=all.max.z, zFront=all.min.z, L=zBack-zFront;
  if(L<=0.0001) return 0;
  const zCut=zBack-L*cut;
  let grew=0;
  const info=[];
  meshes.forEach(function(m){
    const b=new THREE.Box3().setFromObject(m);
    const c=b.getCenter(new THREE.Vector3());
    if(c.z>=zCut) return;                       /* ฝั่งท้าย = ไม่แตะ */
    const sz=b.getSize(new THREE.Vector3());
    /* ⚠️ เกณฑ์ต้องเข้มพอ ไม่งั้น "ปากลำกล้อง" (สั้นแต่ก็เรียว) จะโดนยืดตามไปด้วย
       จนลอยอยู่กลางลำกล้อง (เจอจริงตอนเทสต์) → ต้องเรียวมาก และยาวเทียบกับทั้งกระบอกด้วย */
    const thin=sz.z>Math.max(sz.x,sz.y)*2.6 && sz.z>L*0.18;
    if(thin){
      /* ยืดตามแกน Z โดยตรึง "ปลายท้าย" (ด้านที่ต่อกับโครงปืน) ไว้ */
      const rear=b.max.z;
      m.scale.z*=k;
      m.position.z=rear-(rear-m.position.z)*k;
      grew=Math.max(grew,sz.z*(k-1));
      info.push({thin:true});
    }else info.push({thin:false});
  });
  /* ชิ้นที่ไม่ใช่ลำกล้องแต่อยู่ปลายกระบอก (ปากลำกล้อง/ศูนย์หน้า/ขาทราย) เลื่อนตามไปข้างหน้า */
  if(grew>0){
    meshes.forEach(function(m){
      const b=new THREE.Box3().setFromObject(m);
      const c=b.getCenter(new THREE.Vector3());
      if(c.z>=zCut) return;
      const sz=b.getSize(new THREE.Vector3());
      const thin=sz.z>Math.max(sz.x,sz.y)*2.6 && sz.z>L*0.18;
      if(!thin) m.position.z-=grew;
    });
  }
  return grew;
}
/* ⚡ รอบ 428: รวมชิ้นส่วนปืนเป็นก้อนเดียว
   ปืนเป็น view model ที่ "วาดทุกเฟรม" และอยู่ใกล้กล้องที่สุด — ถ้า Smart Segment แตก 100 ชิ้น
   = +100 draw call ทุกเฟรมตลอดเกม · ปืนไม่ต้องขยับข้อต่อ (ต่างจากทหาร) จึงรวมทั้งกระบอกได้เลย
   ⚠️ ต้องเรียก "หลัง" stretchGunBarrel เสมอ (ยืดตอนยังแยกชิ้นอยู่ ไม่งั้นยืดทั้งกระบอก) */
function mergeGunParts(obj){
  const meshes=[];
  obj.traverse(function(o){ if(o.isMesh) meshes.push(o); });
  if(meshes.length<2) return meshes.length;
  meshes.forEach(function(m){
    m.updateWorldMatrix(true,false);
    const wm=m.matrixWorld.clone();
    if(m.parent) m.parent.remove(m);
    wm.decompose(m.position,m.quaternion,m.scale);
  });
  const merged=mergeMeshList(meshes);
  obj.children.slice().forEach(function(c){ obj.remove(c); });
  /* ⚠️ ต้องล้าง transform ของตัว obj ด้วย — เพราะเพิ่ง bake world matrix ลงในลูกไปแล้ว
     ถ้าไม่ล้าง จะโดนหมุน/ย่อซ้ำอีกรอบ (เจอจริง: ปืนไรเฟิลหมุน 2 เท่า แกนเพี้ยน) */
  obj.position.set(0,0,0); obj.rotation.set(0,0,0); obj.scale.set(1,1,1);
  merged.forEach(function(m){ obj.add(m); });
  obj.updateWorldMatrix(true,true);
  return merged.length;
}
/* 🧭 รอบ 440 (ผู้ใช้: "ปืนไม่ตั้งอย่างนี้ ให้เอียงและเห็นชัดๆ"):
   ด่านสุดท้ายกันปืนวางผิดแกน — วัดจากตัวโมเดลจริงหลังประกอบเสร็จแล้วบังคับให้
     · แกนที่ยาวที่สุด = ลำกล้อง → ชี้ไป −Z (หน้ากล้อง)
     · ปลายที่ "เบากว่า" = ปากกระบอก (ปืนหนักทางท้ายเสมอ)
   ⚠️ ทำไมต้องมี ทั้งที่มี orientGunModel อยู่แล้ว: โมเดล new_gun_r93 เข้ามาเป็นก้อนเดียว
   ตัวเดิมเลยไม่หมุนให้ → วัดในเกมได้ว่าแกนยาวชี้ไปทางขวาจอ (0.96,0.19,0.20) = ปืนขวางจอ */
function forceGunForward(obj){
  /* ⚠️ รอบ 445: เวอร์ชันแรกวัดใน "พิกัดของ obj เอง" ซึ่ง **ไม่รวมการหมุนของ obj**
     → โมเดลที่ orientGunModel หมุนให้ถูกแล้ว จะโดนหมุนซ้ำอีก 90° (ไรเฟิลเลยวางขวางจอ)
     ต้องวัดในพิกัด "พ่อ" (คือกลุ่มปืน) = รวมการหมุนของ obj เข้าไปด้วย แล้ววัดซ้ำหลังหมุนทุกครั้ง */
  const measure=()=>{
    obj.updateMatrixWorld(true);
    const box=new THREE.Box3(), v=new THREE.Vector3(); let cz=0,n=0;
    obj.traverse(o=>{
      if(!o.isMesh||!o.geometry||!o.geometry.attributes.position) return;
      const p=o.geometry.attributes.position;
      for(let i=0;i<p.count;i+=7){ v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld); box.expandByPoint(v); cz+=v.z; n++; }
    });
    if(!n) return null;
    const s=new THREE.Vector3(); box.getSize(s);
    return {s, c:box.getCenter(new THREE.Vector3()), mz:cz/n};
  };
  let m=measure(); if(!m) return;
  if(m.s.x>m.s.z){ obj.rotation.y+=Math.PI/2; m=measure(); }       // แกนยาวขวางจอ → หมุนมาชี้หน้า
  if(m && m.mz-m.c.z<0){ obj.rotation.y+=Math.PI; measure(); }     // มวลอยู่ฝั่งหน้า = ท้ายปืนชี้ออก → กลับหลัง
}
/* ❌ รอบ 446 (ผู้ใช้: "เอาสิ่งที่อยู่ใต้ปืนออก มันไม่มีประโยชน์"):
   ถอด "มือซ้ายประคองลำกล้อง" (รอบ 443–444) ออกทั้งหมด — ลองมา 2 รอบแล้วยังอ่านเป็นก้อนเขียวใต้ปืน
   ไม่ใช่มือ · โมเดลปืนจริงมีด้ามจับ/การ์ดมือครบอยู่แล้ว ปล่อยให้เห็นตัวปืนล้วนๆ สะอาดกว่า
   ⚠️ session หน้า: ถ้าจะทำมืออีก อย่าประกอบจากกล่อง/ทรงกระบอกอีก — ต้องเป็นโมเดล .glb มือที่ rig
   มาพร้อมปืน (แบบที่เกมจริงทำ) ไม่งั้นผลลัพธ์จะวนกลับมาที่เดิม */
/* ============================================================
   🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
   ลำดับที่เห็นในเกมจริง: เอียงปืนเข้าหาตัว → ยกคันรั้งขึ้น (ปลดล็อก) → ดึงถอยหลังสุด
     → ปลอกกระสุนดีดออก → ดันกลับไปข้างหน้า → กดคันรั้งลง (ล็อก) → ปืนคืนท่าเดิม
   ⚠️ โมเดล .glb ใหม่เป็น "ก้อนเดียว" ไม่มีชิ้นคันรั้งให้ขยับ → สร้างคันรั้งเสริมเองแล้ววาง
      จากกรอบโมเดล (ด้านขวาของโครงปืน ค่อนไปทางท้าย) = ใช้ได้กับปืนโมเดลไหนก็ได้
   ============================================================ */
function attachBoltHandle(gunObj){
  if(!gunObj) return;
  if(gunObj.userData.boltRig&&gunObj.userData.boltRig.pivot.parent)
    gunObj.userData.boltRig.pivot.parent.remove(gunObj.userData.boltRig.pivot);
  gunObj.updateMatrixWorld(true);
  /* ⚠️ รอบ 451: ต้องวัดกรอบใน "พิกัดของตัวโมเดลเอง" (pivot เป็นลูกของโมเดล)
     ของเดิมใช้ matrixWorld ตรง ๆ → พอปืนย้ายไป vmScene คันรั้งไปโผล่ใต้ปืน/หน้าปากกระบอก */
  const box=new THREE.Box3(), v=new THREE.Vector3();
  const invG=new THREE.Matrix4().copy(gunObj.matrixWorld).invert();
  gunObj.traverse(o=>{ if(!o.isMesh||!o.geometry||!o.geometry.attributes.position) return;
    const rel=new THREE.Matrix4().multiplyMatrices(invG,o.matrixWorld);
    const p=o.geometry.attributes.position;
    for(let i=0;i<p.count;i+=9){ v.fromBufferAttribute(p,i).applyMatrix4(rel); box.expandByPoint(v); } });
  if(box.isEmpty()) return;
  const c=box.getCenter(new THREE.Vector3()), s=box.getSize(new THREE.Vector3());
  const L=Math.max(s.x,s.y,s.z);
  const met=new THREE.MeshLambertMaterial({color:0x2a2d33});
  const dark=new THREE.MeshLambertMaterial({color:0x15171b});
  const pivot=new THREE.Group();
  pivot.position.set(c.x+s.x*0.30, c.y+s.y*0.10, c.z+s.z*0.12);   // ขวาของโครงปืน ค่อนไปทางท้าย
  const arm=new THREE.Mesh(new THREE.CylinderGeometry(L*.014,L*.014,L*.10,8),met);
  arm.rotation.z=Math.PI/2; arm.position.x=L*.05; pivot.add(arm);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(L*.026,10,8),dark);
  knob.position.x=L*.10; pivot.add(knob);
  gunObj.add(pivot);
  gunObj.userData.boltRig={pivot, z0:pivot.position.z, L, ejected:false};
}
/* 🔩 อัปเดตท่าชักลูกเลื่อน + ดีดปลอกกระสุน (เรียกทุกเฟรมจาก tickAds) */
function tickBolt(now){
  const rig=gunModels.r93&&gunModels.r93.userData?gunModels.r93.userData.boltRig:null;
  if(!rig) return 0;
  /* 🔓 รอบ 467: "ลูกเลื่อนค้างเปิด" ตอนกระสุนหมด — เห็นได้ทันทีว่าต้องบรรจุใหม่
     (ปืนจริงเป็นแบบนี้ · ค้างจนกว่าจะบรรจุเสร็จ แล้วดันกลับพร้อมเสียงล็อก) */
  if(!boltAt && weapon==='r93' && r93Ammo<=0 && reloadAt){
    rig.pivot.rotation.z=-1.05; rig.pivot.position.z=rig.z0-rig.L*0.15;
    rig.ejected=rig.sndPull=rig.sndPush=false; rig.held=true; return -0.06;
  }
  if(rig.held && (r93Ammo>0||weapon!=='r93')){ rig.held=false; Snd.boltPush(); }   // ดันกลับตอนบรรจุเสร็จ
  if(!boltAt||weapon!=='r93'){ rig.pivot.rotation.z=0; rig.pivot.position.z=rig.z0; rig.ejected=rig.sndPull=rig.sndPush=false; return 0; }
  const p=(now-boltAt)/BOLT_MS;
  if(p>=1){ rig.pivot.rotation.z=0; rig.pivot.position.z=rig.z0; rig.ejected=rig.sndPull=rig.sndPush=false; return 0; }
  const seg=(a,b)=>Math.max(0,Math.min(1,(p-a)/(b-a)));
  /* ⏱️ รอบ 448 (ผู้ใช้ขอจังหวะแบบคลิป): เริ่มไวขึ้น–กระชากแรงขึ้น–ค้างสั้นๆ ตอนถอยสุด
     (ของเดิมนิ่ง 0.3 วิแรกก่อนค่อยยก ดูเฉื่อย) */
  const lift = seg(.04,.16)-seg(.74,.88);                 // ยกคันรั้งขึ้น แล้วกดลงตอนจบ
  const pull = seg(.16,.38)-seg(.50,.72);                 // ดึงถอยหลัง (เร็ว) → ค้าง → ดันกลับ
  const cant = seg(.00,.12)-seg(.78,.96);                 // เอียงปืนเข้าหาตัวให้เห็นคันรั้ง
  rig.pivot.rotation.z=-1.15*lift;
  rig.pivot.position.z=rig.z0+rig.L*0.15*pull;
  /* 🔊 รอบ 449: เสียงลูกเลื่อน 2 จังหวะ ยิงตรงกับภาพ (ดึงตอนเริ่มถอย · ล็อกตอนดันกลับสุด) */
  if(!rig.sndPull && p>.16){ rig.sndPull=true; Snd.boltPull(); }
  if(!rig.sndPush && p>.70){ rig.sndPush=true; Snd.boltPush(); }
  /* 🟡 ปลอกกระสุนดีดออกตอนดึงสุด — ยิงออกทางขวา-บน แล้วตกลงพื้นตามแรงโน้มถ่วง */
  if(!rig.ejected && p>.36){
    rig.ejected=true;
    const shell=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.075,7),
      new THREE.MeshLambertMaterial({color:0xc9a13c}));
    const wp=vmToWorld(rig.pivot);        // 🎥 รอบ 451: ปืนอยู่ vmScene → ต้องแปลงเป็นพิกัดโลกก่อน
    shell.position.copy(wp); scene.add(shell);
    const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
    const up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
    const back=new THREE.Vector3(0,0,1).applyQuaternion(camera.quaternion);
    const vel=right.multiplyScalar(rnd(2.2,3.4)).add(up.multiplyScalar(rnd(1.6,2.6))).add(back.multiplyScalar(rnd(.2,1.0)));
    fx.push({o:shell,kind:'bit',t:0,life:2.6,v:vel,metal:true,     // 🔔 รอบ 466: ปลอกกระสุน = มีเสียงตกพื้น
             rv:new THREE.Vector3(rnd(-9,9),rnd(-9,9),0)});
  }
  return cant;
}
/* 🔥 รอบ 467: ปืนร้อนจัด (heat สูง) = ควันบาง ๆ ลอยจากลำกล้องเป็นระยะ จนกว่าจะเย็นลง
   เตือนสายตาว่า "ใกล้โอเวอร์ฮีตแล้ว" โดยไม่ต้องอ่านแถบ (เด็กเล็กดูแถบไม่ทันตอนยิง) */
let barrelSmokeAt=0;
function tickBarrelHeat(now){
  if(inHeli||riding) return;
  const hot=heat/100;
  if(hot<.55 || now<barrelSmokeAt) return;
  barrelSmokeAt=now + (overheat? 260 : 620-hot*300);
  muzzleSmoke(overheat?2:1);
}
/* 💨 รอบ 449: ควันปากลำกล้องหลังยิง — สไปรต์จางๆ 2–4 ก้อน ลอยขึ้นตามทิศเล็ง แล้วบานจางหาย
   วางในพิกัดโลกที่ "ปากลำกล้องจริง" (อ่านจากไฟล์ flash ที่ติดอยู่บนกลุ่มปืน) */
function muzzleSmoke(n){
  if(!muzzle||!camera) return;
  const wp=vmToWorld(muzzle);             // 🎥 รอบ 451: แปลงพิกัด vmScene → โลกจริง
  const fwd=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
  const up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
  const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  for(let i=0;i<n;i++){
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({color:0xd9d3c6,transparent:true,
      opacity:.30,depthWrite:false,fog:false}));
    sp.position.copy(wp).addScaledVector(fwd,rnd(.05,.35)).addScaledVector(right,rnd(-.06,.06));
    const sc=rnd(.10,.18); sp.scale.setScalar(sc); scene.add(sp);
    const v=up.clone().multiplyScalar(rnd(.35,.7))
      .addScaledVector(fwd,rnd(.25,.8)).addScaledVector(right,rnd(-.22,.22));
    fx.push({o:sp,kind:'smoke',t:0,life:rnd(.75,1.25),v,sc,a0:rnd(.20,.34)});
  }
}
/* 🎯 รอบ 451: จัดโมเดลปืนให้ "แกนลำกล้อง" ตรงกับจุดอ้างอิงเดียวกันทุกกระบอก
   หาปากกระบอก = จุดศูนย์กลางของกลุ่มจุดยอดที่อยู่หน้าสุด (สแลบหนา 6 ซม.)
   แล้วเลื่อนโมเดลให้ปากกระบอกมาอยู่ที่ (x=0, y=MUZZLE_Y) — z ไม่ยุ่ง (ความยาวปืนคงเดิม)
   ⚠️ ต้องเรียก "หลัง" g.add(obj) แล้ว (ใช้ matrixWorld เทียบกับ obj เอง) */
function alignGunMuzzle(obj){
  if(!obj) return;
  if(!obj.parent) return;
  obj.parent.updateMatrixWorld(true);
  /* ⚠️ ต้องวัดใน "พิกัดกลุ่มปืน" เท่านั้น — โมเดลบางตัวถูกหมุน 180° (forceGunForward)
     ถ้าวัดในพิกัดของโมเดลเอง จุด z น้อยสุดจะกลายเป็น "ท้ายปืน" ไม่ใช่ปากกระบอก */
  const inv=new THREE.Matrix4().copy(obj.parent.matrixWorld).invert();
  let mz=Infinity; const pts=[]; const v=new THREE.Vector3();
  obj.traverse(o=>{ if(!o.isMesh||!o.geometry||!o.geometry.attributes.position) return;
    const m=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld);
    const p=o.geometry.attributes.position;
    for(let i=0;i<p.count;i+=3){ v.fromBufferAttribute(p,i).applyMatrix4(m); pts.push(v.clone()); if(v.z<mz) mz=v.z; } });
  if(!pts.length) return;
  /* 🔄 รอบ 468 (ผู้ใช้ทัก: "ปืนนี้หันปลายกระบอกเข้าหาตัวเอง") — เช็กว่าปลายไหนคือปากกระบอกจริง
     หลักการที่ใช้ได้กับปืนทุกกระบอก: **ปลายลำกล้องเรียวเสมอ · ท้ายปืน (พานท้าย/แม็ก) อ้วนกว่า**
     วัดรัศมีเฉลี่ยของสแลบหัว-ท้าย ถ้าฝั่งหน้าอ้วนกว่า = โมเดลกลับหลัง → หมุน 180° แล้ววัดใหม่ */
  let Mz=-Infinity; pts.forEach(p=>{ if(p.z>Mz) Mz=p.z; });
  const rad=(arr)=>{ if(arr.length<6) return 1e9; const c=new THREE.Vector3();
    arr.forEach(p=>c.add(p)); c.divideScalar(arr.length);
    let r=0; arr.forEach(p=>{ r+=Math.hypot(p.x-c.x,p.y-c.y); }); return r/arr.length; };
  const frontR=rad(pts.filter(p=>p.z<mz+.10)), backR=rad(pts.filter(p=>p.z>Mz-.10));
  if(frontR>backR*1.35){                       // หน้าอ้วนกว่าท้ายชัดเจน = กลับหลังแน่นอน
    obj.rotateY(Math.PI); obj.updateMatrixWorld(true);
    obj.userData.flipped=!obj.userData.flipped;
    return alignGunMuzzle(obj);                // วัดใหม่หลังหมุน
  }
  const slab=pts.filter(p=>p.z<mz+.06);
  const c=new THREE.Vector3(); slab.forEach(p=>c.add(p)); c.divideScalar(slab.length);
  const dx=-c.x, dy=MUZZLE_Y-c.y;
  const base={x:obj.position.x,y:obj.position.y};
  obj.position.x+=dx; obj.position.y+=dy;
  obj.userData.align={x:dx,y:dy,bx:base.x,by:base.y};
  obj.userData.tipZ=c.z;                            // z ของปากกระบอกในกลุ่มปืน (ใช้วางไฟ/ควัน)
  return obj.userData.align;
}
/* 🔥 ย้ายไฟปากลำกล้องไปที่ปากกระบอกของ "ปืนที่ถืออยู่" (แต่ละกระบอกยาวไม่เท่ากัน) */
function syncMuzzleAnchor(){
  const m=gunModels[weapon];
  if(muzzle&&m&&typeof m.userData.tipZ==='number') muzzle.position.set(0,MUZZLE_Y,m.userData.tipZ+.02);
}
/* 🌤️ รอบ 466: เงาตัวเรา+ปืนทอดลงพื้น — แดดทะเลทรายจัด ควรมีเงาให้รู้สึกว่า "เรามีตัวตน"
   ทำเป็นแผ่นเงานุ่ม (texture ไล่สี) วางบนพื้นตามความสูงภูมิประเทศ เอียงตามทิศแดดจริง
   ถูกกว่า shadow map มาก และไม่กระทบเฟรมบนมือถือเด็ก (1 mesh · ไม่รับแสง) */
let selfShadow=null;
function buildSelfShadow(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const g=cv.getContext('2d');
  const grd=g.createRadialGradient(64,64,4,64,64,62);
  grd.addColorStop(0,'rgba(0,0,0,.55)'); grd.addColorStop(.55,'rgba(0,0,0,.28)'); grd.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=grd; g.fillRect(0,0,128,128);
  const tex=new THREE.Texture(cv); tex.needsUpdate=true;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,fog:true}));
  m.rotation.x=-Math.PI/2; m.renderOrder=-1;
  scene.add(m); selfShadow=m;
}
/* ทิศแดดใน build(): sun.position (70,90,120) → เงาทอดไปทางตรงข้าม */
const SUN_DIR=new THREE.Vector3(70,90,120).normalize();
function tickSelfShadow(){
  if(!selfShadow) return;
  const vis=(!inHeli && running);
  selfShadow.visible=vis; if(!vis) return;
  const drop=Math.max(.2, EYE);                       // เงาทอดจากตัวเราลงพื้น ตามมุมแดด
  const ox=-SUN_DIR.x/SUN_DIR.y*drop, oz=-SUN_DIR.z/SUN_DIR.y*drop;
  const x=px+ox, z=pz+oz;
  selfShadow.position.set(x, terrainH(x,z)+0.03, z);
  /* เงายืดไปตาม "ทิศที่แดดสาด" จริง ๆ (ไม่ใช่ทิศที่เรามอง) — หันตัวไปทางไหนเงาก็อยู่ที่เดิม */
  selfShadow.scale.set(1.6, 3.2, 1);
  selfShadow.rotation.z=-Math.atan2(-ox,-oz);
  selfShadow.material.opacity=.85;
}
/* 🎥 รอบ 451: รอบเรนเดอร์ของ view model — วาดปืนทับภาพฉากด้วยกล้อง near .01
   (ล้างเฉพาะ depth ไม่ล้างสี → ปืนอยู่หน้าสุดเสมอ ไม่โดนกำแพง/พื้นทะลุ และดึงเข้ามาชิดตาได้) */
function renderViewModel(){
  if(!vmScene||!vmCam||!gunGrp||!gunGrp.visible) return;
  /* 🔥 รอบ 465: ความสว่างไฟแฟลชตามจังหวะยิง (วางตำแหน่งตามปากกระบอกของกระบอกที่ถือ) */
  if(muzzleLight){
    const now=performance.now();
    const k=Math.max(0,(muzzleUntil-now)/90);
    muzzleLight.intensity=k*9;
    if(muzzle) muzzle.getWorldPosition(muzzleLight.position);
  }
  vmCam.fov=camera.fov; vmCam.aspect=camera.aspect; vmCam.updateProjectionMatrix();
  renderer.autoClear=false;
  renderer.clearDepth();
  renderer.render(vmScene,vmCam);
  renderer.autoClear=true;
}
/* กลุ่มปืนอยู่ใน vmScene (พิกัดเดียวกับ "ระบบพิกัดกล้อง") → แปลงเป็นพิกัดโลกด้วยกล้องหลัก */
function vmToWorld(o){ const v=new THREE.Vector3(); o.getWorldPosition(v); return camera.localToWorld(v); }
/* 🔧 รอบ 457: ชุดวัด/จูนท่าปืน — อยู่ในเกมเพื่อให้ "สั่งจูนด้วยคำสั่งสั้น ๆ" ได้ ไม่ต้องส่งสูตรยาวเข้ามาใหม่ทุกครั้ง
   gunSil() = วัด "มุมแนวปืนบนจอ" จริง (แกนหลัก/PCA ของจุดบนตัวปืนที่อยู่ในเฟรม) + สัดส่วนที่เห็น */
function gunSil(){
  if(!gunGrp||!camera) return null;
  const m=gunModels[weapon]; if(!m) return null;
  const P=vmCam?vmCam.projectionMatrix:camera.projectionMatrix, asp=camera.aspect;
  const rig=m.userData.boltRig, skip=new Set(); if(rig) rig.pivot.traverse(o=>skip.add(o));
  gunGrp.updateMatrixWorld(true);
  const v=new THREE.Vector3(), pts=[]; let tot=0;
  m.traverse(o=>{ if(!o.isMesh||skip.has(o)||!o.geometry.attributes.position) return;
    const pa=o.geometry.attributes.position;
    for(let i=0;i<pa.count;i+=6){ tot++;
      v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld); if(v.z>-0.02) continue;
      const c=v.clone().applyMatrix4(P);
      if(c.x>=-1&&c.x<=1&&c.y>=-1&&c.y<=1) pts.push([c.x*asp,c.y]); } });
  if(pts.length<40) return {deg:null,vis:0};
  let mx=0,my=0; pts.forEach(p=>{mx+=p[0];my+=p[1]}); mx/=pts.length; my/=pts.length;
  let sxx=0,syy=0,sxy=0; pts.forEach(p=>{const dx=p[0]-mx,dy=p[1]-my;sxx+=dx*dx;syy+=dy*dy;sxy+=dx*dy});
  const th=Math.atan2(2*sxy,sxx-syy)/2, ca=Math.cos(th), sa=Math.sin(th);
  let lo=1e9,hi=-1e9; pts.forEach(p=>{const u=(p[0]-mx)*ca+(p[1]-my)*sa; if(u<lo)lo=u; if(u>hi)hi=u;});
  const slope=sxy/sxx;                                  // แนวกึ่งกลางปืน (หน่วย NDC ต่อ NDC-x)
  return {deg:+Math.abs(th*180/Math.PI).toFixed(1), vis:+(pts.length/tot).toFixed(2),
          len:+(hi-lo).toFixed(3),                      // ความยาวเงาปืนบนจอ (ใช้เทียบ "ขนาดเท่ากัน")
          yAtX0:+(my/asp+slope/asp*(0-mx)).toFixed(3)}; // แนวปืนตัดแกนกลางจอที่ y เท่าไร
}
/* ตั้งท่าปืนสด ๆ · {x,y,z,s,roll,deg} — ใส่ `deg` = ให้ระบบไล่หามุมก้ม-เงยที่ทำให้เงาปืนได้องศานั้นเอง
   คืนค่าเป็นบรรทัดพร้อมก๊อปไปวางทับใน TUNE ZONE */
function setGunPose(o){
  o=o||{};
  if(typeof o.x==='number') GUN_POS[0]=o.x;
  if(typeof o.y==='number') GUN_POS[1]=o.y;
  if(typeof o.z==='number') GUN_POS[2]=o.z;
  if(typeof o.s==='number') GUN_SCALE=o.s;
  if(typeof o.roll==='number') GUN_ROT[2]=o.roll;
  if(typeof o.pitch==='number') GUN_ROT[0]=o.pitch;
  if(typeof o.yaw==='number') GUN_ROT[1]=o.yaw;
  if(typeof o.deg==='number'){
    /* ⚠️ มุมเงาปืน "ไม่ใช่ฟังก์ชันขาเดียว" กับ pitch — กดลงเรื่อย ๆ มุมจะลดลงถึงจุดต่ำสุดแล้ว
       ตั้งชันกลับขึ้นอีก (bisection จึงหลุดไปปลายช่วง) → ใช้วิธีกวาดหาแล้วค่อยละเอียดรอบจุดที่ดีที่สุด */
    const test=p=>{ GUN_ROT[0]=p;
      gunGrp.position.set(GUN_POS[0],GUN_POS[1],GUN_POS[2]);
      gunGrp.rotation.set(GUN_ROT[0],GUN_ROT[1],GUN_ROT[2]); gunGrp.scale.setScalar(GUN_SCALE);
      const r=gunSil(); return (r&&r.deg!==null)?Math.abs(r.deg-o.deg):999; };
    let best=GUN_ROT[0], bestE=999;
    for(let p=.30;p>=-1.50;p-=.02){ const e=test(p); if(e<bestE){bestE=e;best=p;} }   // กวาดหยาบ
    for(let p=best-.02;p<=best+.02;p+=.002){ const e=test(p); if(e<bestE){bestE=e;best=p;} } // ละเอียด
    GUN_ROT[0]=best;
  }
  gunGrp.position.set(GUN_POS[0],GUN_POS[1],GUN_POS[2]);
  gunGrp.rotation.set(GUN_ROT[0],GUN_ROT[1],GUN_ROT[2]); gunGrp.scale.setScalar(GUN_SCALE);
  const v=GUN_VIEW[weapon]; if(v){ v.p=GUN_POS.slice(); v.r=GUN_ROT.slice(); v.s=GUN_SCALE; }
  const r=gunSil(), f=n=>(+n).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
  return {weapon, deg:r&&r.deg, vis:r&&r.vis, len:r&&r.len, yAtX0:r&&r.yAtX0,
    line:`  ${weapon}: {p:[${GUN_POS.map(f).join(',')}], r:[${GUN_ROT.map(f).join(',')}], s:${f(GUN_SCALE)}},`};
}
function buildGun(){
  const g=new THREE.Group();
  /* ทรงปืนทั้ง 2 กระบอกอยู่ในกลุ่มเดียวกัน สลับด้วย visible (ไม่ต้องสร้างใหม่ตอนเปลี่ยนปืน) */
  gunModels.rifle=buildRifleModel(); g.add(gunModels.rifle);
  gunModels.r93=buildR93Model();     g.add(gunModels.r93); gunModels.r93.visible=false;
  /* ไฟปากลำกล้อง (โผล่ตอนยิง) */
  muzzle=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffd27a,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthTest:false,depthWrite:false}));
  muzzle.scale.setScalar(.42); muzzle.position.set(0,MUZZLE_Y,-.72); g.add(muzzle);
  alignGunMuzzle(gunModels.rifle); alignGunMuzzle(gunModels.r93);   // 🎯 รอบ 451: ทรงสำรองก็จัดแกนเหมือนกัน

  /* 💪 แขนถือปืน — มุมมองที่ 1 "เห็นแค่ปืน" (ผู้ใช้ยืนยัน 23 ก.ค. 2026 รอบ 519: มือ FP พักไว้ก่อน)
     โค้ดมือ GLB (buildArms/loadHandModel/HAND_POSE/FOREARM) ยังอยู่ครบ เผื่อกลับมาใช้ แค่ไม่เรียก
     ⛔ อย่าลบ — ผู้ใช้แค่ "พักไว้ก่อน" ไปโฟกัสท่าทหารมุมมองที่ 3 */
  gunArms=buildArms(); gunArms.visible=false; g.add(gunArms);

  g.position.set(GUN_POS[0],GUN_POS[1],GUN_POS[2]);
  g.rotation.set(GUN_ROT[0],GUN_ROT[1],GUN_ROT[2]);   // เอียงทแยงแบบภาพอ้างอิง
  g.scale.setScalar(GUN_SCALE);
  g.userData.swayX=0; g.userData.swayY=0;
  /* 🎥 รอบ 451: ปืนไม่ได้แขวนใต้กล้องหลักแล้ว — อยู่ใน vmScene ที่มีพิกัดเดียวกับกล้อง
     (กลุ่มปืนวางที่พิกัดกล้องเป๊ะ ๆ เหมือนเดิม จึงเห็นตำแหน่งเท่าเดิม แต่ near .01 ไม่โดนตัด) */
  vmScene=new THREE.Scene();
  vmCam=new THREE.PerspectiveCamera(FOV,innerWidth/innerHeight,.01,12);
  vmScene.add(vmCam); vmScene.add(g); gunGrp=g;
  /* 💡 ไฟส่อง view model โดยเฉพาะ (ติดกล้อง เคลื่อนตามตลอด)
     ⚠️ จำเป็น! ไฟฉากส่องปืนไม่ถึง — ไม่มีไฟนี้ปืนจะดำสนิทเป็นก้อนบังจอ (เจอจริงตอนเทสต์)
     ใช้ PointLight ระยะสั้น (5m) จึงไม่รบกวนแสงของฉากรอบตัว */
  const vLight=new THREE.PointLight(0xffeccd,3.4,5);
  vLight.position.set(.55,.42,.30); vmScene.add(vLight);
  /* 🔥 รอบ 465: ไฟแฟลชปากลำกล้อง — ตอนยิงจะสาดแสงส้มบนตัวปืนจริง ๆ (เห็นชัดมากตอนกลางคืน/ในเงา) */
  muzzleLight=new THREE.PointLight(0xffb45a,0,2.2); muzzleLight.position.set(0,MUZZLE_Y,-.7);
  vmScene.add(muzzleLight);
  const vFill=new THREE.PointLight(0x9fb6d8,.85,4);   // ไฟเสริมฝั่งเงา ให้เห็นรูปทรงไม่ตันดำ
  vFill.position.set(-.5,-.15,.1); vmScene.add(vFill);
  /* 🌤️ รอบ 451: ปืนย้ายออกจากฉากหลัก จึงไม่ได้รับแดด/ฟ้าของฉากอีก — ใส่ชุดเดียวกันใน vmScene
     (ค่าเท่ากับฉากจริงเป๊ะ ๆ ปืนจึงยังดูกลืนกับสภาพแสงทะเลทรายเหมือนเดิม) */
  vmHemi=new THREE.HemisphereLight(0xffe9c8,0x6b5a42,.52); vmScene.add(vmHemi);
  const vSun=new THREE.DirectionalLight(0xfff0cc,.95); vSun.position.set(.7,.9,1.2); vmScene.add(vSun);
  const vRim=new THREE.DirectionalLight(0x8aa4c8,.30); vRim.position.set(-.6,.5,-.9); vmScene.add(vRim);
  vmSun=vSun; vmRim=vRim;            // 🌙 รอบ 471: ปืนในมือต้องมืดตามฉาก ไม่งั้นลอยเป็นของกลางวันกลางคืนดึก
  loadGlb('img/models/gun_rifle.glb',(obj)=>{
    orientGunModel(obj);                                  // 🧭 จัดลำกล้องให้ชี้ −Z
    mergeGunParts(obj);                                   // ⚡ รวมชิ้นเป็นก้อนเดียว
    fitInto(obj,.95);
    /* 🔦 ยกเงาเฉพาะปืนที่ถืออยู่ (view model) — texture ปืนเป็นสีดำ + roughness 1
       ทำให้ไม่จับแสงเลย เห็นเป็นเงาดำตัน · ใช้ texture ตัวเดิมเป็น emissiveMap อ่อนๆ
       = รายละเอียดลายปืนโผล่ขึ้นมาโดยไม่ต้องเร่งไฟจนฉากเพี้ยน (ยานแม่ไม่โดน ยังดำทะมึนเหมือนเดิม) */
    obj.traverse(c=>{
      if(!c.isMesh||!c.material) return;
      (Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{
        if(typeof m.roughness==='number') m.roughness=Math.min(m.roughness,.5);    // ให้เกิดไฮไลต์โลหะ
        /* ⚠️ ห้ามใช้ emissiveMap ที่นี่: texture ปืนดำเกือบสนิท (emissive = สี×texture ≈ 0 ไม่ช่วยอะไร)
           ต้องยกเป็น "พื้นสีคงที่" ถึงจะเห็นรูปทรง */
        if(m.emissive) m.emissive.setRGB(.13,.125,.12);
        m.needsUpdate=true;
      });
    });
    forceGunForward(obj);                                 // 🧭 รอบ 440: ไรเฟิลก็ผ่านด่านเดียวกัน
    g.remove(gunModels.rifle); gunModels.rifle=obj; obj.visible=(weapon==='rifle');
    g.add(obj); alignGunMuzzle(obj); syncMuzzleAnchor();   // 🎯 รอบ 451: แกนลำกล้องเข้าที่มาตรฐาน
  });
  /* 🎯 รอบ 438 (ผู้ใช้สั่ง): เปลี่ยนมาใช้โมเดลใหม่ `new_gun_r93`
     ต้นฉบับ 98,327 tris / 8.6MB → ใช้ตัวลดโพลี **24,581 tris / 2.3MB** (สูตรใน handoff/NOTES.md)
     ปืนเป็น view model วาดทุกเฟรมและอยู่ใกล้จอที่สุด งบสามเหลี่ยมจึงต้องคุม · ต้นฉบับไม่ถูกแตะ */
  loadGlb('img/models/new_gun_r93_lite.glb',(obj)=>{
    orientGunModel(obj);                                  // 🧭 จัดลำกล้องให้ชี้ −Z ก่อน
    stretchGunBarrel(obj);                                // 🔧 ยืดลำกล้องให้ได้สัดส่วนสไนเปอร์จริง
    mergeGunParts(obj);                                   // ⚡ รวมชิ้นเป็นก้อนเดียว (ปืนวาดทุกเฟรม)
    fitInto(obj,1.25);                                    // สไนเปอร์ยาวกว่าไรเฟิล
    forceGunForward(obj);                                 // 🧭 รอบ 440: ด่านสุดท้าย บังคับลำกล้องชี้หน้าจริงๆ
    obj.traverse(c=>{
      if(!c.isMesh||!c.material) return;
      (Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{
        if(typeof m.roughness==='number') m.roughness=Math.min(m.roughness,.5);
        if(m.emissive) m.emissive.setRGB(.13,.125,.12);
        m.needsUpdate=true;
      });
    });
    g.remove(gunModels.r93); gunModels.r93=obj; obj.visible=(weapon==='r93');
    g.add(obj); alignGunMuzzle(obj); syncMuzzleAnchor();   // 🎯 รอบ 451: แกนลำกล้องเข้าที่มาตรฐาน
    attachBoltHandle(obj);                                 // 🔩 รอบ 447: คันรั้งลูกเลื่อนที่ขยับได้
  });
}
/* สลับปืน (เฉพาะตอนเดินเท้า — บนเฮลิใช้ปืนกลติดลำ) */
/* 🔁 รอบ 464: ความลึกของท่าเปลี่ยนปืน 0→1→0 · สลับโมเดลจริงตอนปืนลงต่ำสุด (กลางทาง) */
function tickSwap(now){
  if(!swapAt) return 0;
  const p=(now-swapAt)/SWAP_MS;
  if(p>=1){ swapAt=0; swapTo=null; swapSnd=0; return 0; }
  if(swapSnd<1 && p>=0.02){ swapSnd=1; Snd.swapDown(); }          // 🔊 รอบ 465: ตอนเริ่มลดปืน
  if(swapTo && p>=0.5){ applyWeapon(swapTo); swapTo=null; }
  if(swapSnd<2 && p>=0.72){ swapSnd=2; Snd.swapUp(); }            // 🔊 ตอนยกกระบอกใหม่ล็อกเข้าที่
  return Math.sin(Math.min(1,Math.max(0,p))*Math.PI);          // ระฆังคว่ำ
}
/* เปลี่ยนกระบอกจริง (โมเดล/ค่าท่าถือ/กระสุน/ปุ่ม) — แยกจากอนิเมชันเพื่อเรียกกลางทางได้ */
function applyWeapon(w){
  weapon=w;
  if(gunModels.rifle) gunModels.rifle.visible=(weapon==='rifle');
  if(gunModels.r93)   gunModels.r93.visible=(weapon==='r93');
  useGunView();
  fitArmsToWeapon(weapon);           // 💪 รอบ 518: เลื่อนมือหน้าให้เกาะการ์ดมือของกระบอกที่ถือ
  syncMuzzleAnchor();
  reloadAt=0; heat=0; overheat=false;
  renderHeat(); renderAmmo(); syncWeaponBtns();
}
function swapWeapon(){
  if(inHeli) return;
  if(swapAt) return;                                   // 🔁 กันกดรัวระหว่างเปลี่ยนปืน
  setScoped(false);
  const next=(weapon==='rifle')?'r93':'rifle';
  /* 🔁 รอบ 464: เริ่มท่าลดปืน แล้วสลับกระบอกจริงตอนต่ำสุด (tickSwap) ไม่สลับวาบทันทีแล้ว */
  swapAt=performance.now(); swapTo=next; swapSnd=0;
  const W=WEAPONS[next];
  toastBan(`${W.icon} <b>${W.name}</b><br><span class="ib-sub">${next==='r93'
    ? 'ยิงทีละนัด แรงมาก — กด 🔭 ส่องกล้องก่อนยิงจะแม่นสุด · แม็ก 10 นัด'
    : 'ยิงรัวต่อเนื่อง เหมาะกับเป้าใกล้ๆ'}</span>`,2200);
  if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
}
/* เปิด/ปิดกล้องส่อง (ADS) — ซูมด้วยการลด FOV + ลดความไวการเล็ง */
function setScoped(on){
  const W=WEAPONS[weapon];
  const want=!!on && !!W.scope && !inHeli && !riding;
  if(want===scoped) return;
  scoped=want;
  /* ⚠️ ไม่แตะ camera.fov แล้ว — การขยายเกิดใน "รอบเรนเดอร์ที่ 2" เฉพาะในวงเลนส์ (renderScopePass)
     ถ้าไปเปลี่ยน fov หลักจะกลายเป็นซูมทั้งจอ = ไม่ใช่ PiP
     🎬 ตัวแปร scoped เป็นแค่ "เจตนา" — ภาพจริงวิ่งตาม adsT ใน tickAds() แบบต่อเนื่อง ไม่ตัดภาพ */
  if(scopeBtn) scopeBtn.classList.toggle('on',scoped);
  if(!scoped) holdBreath=false;
  Snd.ads(scoped);
  syncWeaponBtns();
}
/* เส้นโค้งนุ่ม (ease-in-out) — ทำให้การยกปืน/ถอยกล้องมีน้ำหนัก ไม่กระตุก */
function smoothstep(t){ t=clamp(t,0,1); return t*t*(3-2*t); }
/* 🤝 รอบ 501: คำนวณ "ออฟเซ็ตปืนโยกตามจังหวะก้าว + หายใจ" (ดู SWAY ในโซนค่ากติกา)
   คืนเป็นออฟเซ็ตล้วน ๆ ให้ tickAds บวกทับท่าถือ — ไม่แก้ค่าฐานใด ๆ
   ก้าวเดิน = เลข 8 นอน: แกนซ้ายขวาความถี่ 1 รอบ/ก้าวคู่ · แกนขึ้นลง 2 เท่า (เท้าแตะพื้น 2 ครั้ง) */
function tickSway(dt,now){
  const moving=moveLen>.05, run=moving&&(isRun||keys.shift);
  const spd=clamp(moveLen,0,1);
  const tgt=moving? spd*(run?1.30:1) : 0;
  swAmp+=(tgt-swAmp)*Math.min(1, dt*(tgt>swAmp?SWAY.ampIn:SWAY.ampOut));
  if(!moving && swAmp<.0015){ swAmp=0; swPhase=0; }        // หยุดนิ่ง = คืนเข้าท่าเดิมสนิท
  if(swAmp>0) swPhase+=dt*Math.PI*2*(run?SWAY.runHz:SWAY.walkHz)*Math.max(spd,.35);
  /* 🔭 รอบ 506: ตอนเล็ง ตัวปืนโยกตามตัวคูณกำลังขยายเดียวกับกล้อง (ซูมแรง = มุมจริงเล็กลง ภาพจึงสั่นพอ ๆ กัน) */
  const adsK=SWAY.ads*(1+(swMagG-1)*SWAY_MAG.gun);
  const damp=1-(1-adsK)*adsT;                              // เล็งอยู่ = แทบไม่โยก
  const a=swAmp*damp, s=Math.sin(swPhase), c=Math.cos(swPhase*2);
  /* 🫁 หายใจ: เด่นตอนยืนนิ่ง (ตอนเดินถูกจังหวะก้าวกลบ) · เหนื่อยจากการวิ่ง = ชัดขึ้น */
  /* 🫁💨 รอบ 508: ช่วงหอบหลังลมหมด = บวกเข้า "fatigue ตัวเดิม" ไม่สร้างคลื่นชุดที่ 2 ซ้อน */
  const bt=now*.001*Math.PI*2*SWAY.breathHz, bA=(1-Math.min(1,swAmp))*(1+(fatigue+gaspShake*GASP.fat)*1.1)*damp;
  swLast={
    x: s*SWAY.x*a,
    y: (c*SWAY.y - Math.abs(s)*SWAY.y*.30)*a + Math.sin(bt)*SWAY.breathY*bA,
    z: Math.abs(s)*SWAY.z*a,
    rx: c*SWAY.pitch*a + Math.sin(bt+.9)*SWAY.breathPitch*bA,
    ry: s*SWAY.yaw*a,
    rz: -s*SWAY.roll*a + Math.sin(bt*.7)*SWAY.breathRoll*bA
  };
  return swLast;
}
/* 🎬 หัวใจของแอนิเมชัน ADS — เรียกทุกเฟรมตอนเดินเท้า */
function tickAds(dt,now){
  const W=WEAPONS[weapon];
  const target=(scoped && W.scope)?1:0;
  adsRaw=clamp(adsRaw + (target? dt/ADS_IN : -dt/ADS_OUT), 0, 1);
  adsT=smoothstep(adsRaw);
  tickSwayMag(dt);        /* 🔭 รอบ 506: ไล่ตัวคูณความนิ่งตามกำลังขยาย (ต้องเดินทุกเฟรม ไม่ขึ้นกับ gunGrp) */
  tickGasp(dt);           /* 🫁💨 รอบ 508: ซองจังหวะ "ลมหมดคาปุ่ม" (ตกวูบ + หอบ) */
  /* 🌀 รอบ 464: อัปเดตแรงเฉื่อยจากการหันจอ (ทำก่อนตั้งท่าปืน) */
  if(gunGrp){
    let dY=yaw-lastYaw, dP=pitch-lastPitch;
    if(dY>Math.PI) dY-=Math.PI*2; if(dY<-Math.PI) dY+=Math.PI*2;
    lastYaw=yaw; lastPitch=pitch;
    const k=(scoped?0.25:1)*LAG_GAIN;
    lagYaw  =clamp(lagYaw  - dY*k, -LAG_MAX, LAG_MAX);
    lagPitch=clamp(lagPitch- dP*k, -LAG_MAX, LAG_MAX);
    const back=Math.min(1, dt*LAG_BACK);
    lagYaw-=lagYaw*back; lagPitch-=lagPitch*back;
  }
  /* ① ปืนถูกยกจากท่าพร้อมยิง → แนบไหล่เข้าแนวสายตา (lerp ทุกแกนพร้อมกัน) */
  if(gunGrp){
    const k=adsT;
    /* 🎯 รอบ 463: จุดเล็งไม่ได้อยู่กลางจอแล้ว → ท่าแนบไหล่ต้องเลื่อนตามไปนั่งตรงจุดเล็งด้วย
       (ไม่งั้นพอส่องกล้อง ตัวปืนจะลอยอยู่เหนือวงเลนส์) — คำนวณจาก AIM_OFF ทุกเฟรม ใช้ได้ทุกกระบอก */
    const AP=adsPosNow(), AV=adsView();          /* 🎯 รอบ 499: ท่าเล็งแยกตามกระบอก */
    gunGrp.position.set(
      GUN_POS[0]+(AP[0]-GUN_POS[0])*k + gunGrp.userData.swayX*(1-k),
      GUN_POS[1]+(AP[1]-GUN_POS[1])*k + gunGrp.userData.swayY*(1-k) - gunRecoil*.03,
      GUN_POS[2]+(AP[2]-GUN_POS[2])*k + gunRecoil*.10);
    gunGrp.rotation.set(
      GUN_ROT[0]+(AV.r[0]-GUN_ROT[0])*k + gunRecoil*.22,
      GUN_ROT[1]+(AV.r[1]-GUN_ROT[1])*k,
      GUN_ROT[2]+(AV.r[2]-GUN_ROT[2])*k - gunRecoil*.05);
    gunGrp.scale.setScalar(GUN_SCALE+(AV.s-GUN_SCALE)*k);
    /* 🔍🫁 รอบ 504: ตัวคูณบวกทับ (ซูมแรง=แนบตา · กลั้นหายใจ=ประทับแก้ม) — มีผลเฉพาะตอนเล็ง (คูณ k)
       ขยาย s อย่างเดียว แล้วดึง y ลงชดเชยให้ปลายลำกล้องอยู่ใต้จุดเล็งเท่าค่าฐาน */
    const BG=tickAdsBoost(dt)*k;
    if(BG>0.00002){
      gunGrp.scale.setScalar(gunGrp.scale.x + AV.s*BG);
      gunGrp.position.y-=(ADS_BOOST.yFix[weapon]||0)*BG;
    }
    /* 🌀 รอบ 464: ปืนตามการหันจอ (ตำแหน่งไถลนิดหน่อย + เอียงตาม) */
    gunGrp.position.x+=lagYaw*0.42;
    gunGrp.position.y+=lagPitch*0.34;
    gunGrp.rotation.y+=lagYaw*0.85;
    gunGrp.rotation.x+=lagPitch*0.75;
    gunGrp.rotation.z+=lagYaw*0.55;
    /* 🤝 รอบ 501: จังหวะก้าวเดิน/หายใจ — บวกทับท่าถือล้วน ๆ (หยุดนิ่งค่าเป็น 0 ปืนกลับท่าเดิม) */
    const SW=tickSway(dt,now);
    gunGrp.position.x+=SW.x; gunGrp.position.y+=SW.y; gunGrp.position.z+=SW.z;
    gunGrp.rotation.x+=SW.rx; gunGrp.rotation.y+=SW.ry; gunGrp.rotation.z+=SW.rz;
    /* 🫁💨 รอบ 508: ลมหมดคาปุ่ม — ตัวปืนจิ้มลงเพิ่มจากที่กล้องตกไปแล้ว (แขนหมดแรง) · จบซองแล้วเป็น 0 สนิท */
    if(gaspDrop>0){ gunGrp.position.y-=GASP.gunY*gaspDrop; gunGrp.rotation.x-=GASP.gunPitch*gaspDrop; }
    /* 🔁 รอบ 464: ท่าเปลี่ยนปืน — ลดลง-ยกขึ้นเป็นรูประฆังคว่ำ (0→1→0) */
    const sw2=tickSwap(now);
    if(sw2>0){ gunGrp.position.y-=0.30*sw2; gunGrp.position.z+=0.06*sw2;
               gunGrp.rotation.x-=0.55*sw2; gunGrp.rotation.z+=0.20*sw2; }
    /* 🎯 รอบ 451: การเลื่อนแกนลำกล้อง (alignGunMuzzle) ใช้เฉพาะ "ท่าถือ" — ตอนแนบไหล่เล็ง
       ต้องคลายกลับเป็นตำแหน่งเดิม ค่า ADS_POS/ADS_ROT ที่จูนไว้เดิมจึงยังตรงเป๊ะ */
    const am=gunModels[weapon], al=am&&am.userData.align;
    if(al){ am.position.x=al.bx+al.x*(1-k); am.position.y=al.by+al.y*(1-k); }
    /* 🏃 รอบ 448: ท่าวิ่ง — วิ่งอยู่ (ไม่เล็ง ไม่ชักลูกเลื่อน) ปืนก้มลงข้างตัว แล้วยกกลับนุ่มๆ ตอนหยุด/ยิง */
    const wantSprint=(isRun||keys.shift) && moveLen>.05 && !scoped && !inHeli && !riding
                     && now>sprintHold && !boltAt ? 1 : 0;
    sprintRaw=clamp(sprintRaw + (wantSprint? dt/SPRINT_IN : -dt/SPRINT_OUT), 0, 1);
    sprintT=smoothstep(sprintRaw)*(1-adsT);          // เล็งอยู่ = ไม่ลดปืน
    /* 🫁 รอบ 449: สะสมความเหนื่อยตอนวิ่ง — หยุดวิ่งแล้วฟื้นเร็วกว่าที่สะสม (ไม่ทรมานเด็ก) */
    sprintTime=Math.max(0, sprintTime + (wantSprint? dt : -dt*1.7));
    fatigue=clamp((sprintTime-PANT_FROM)/(PANT_FULL-PANT_FROM),0,1);
    if(fatigue>.12 && now>pantAt){ pantAt=now+PANT_GAP*(1.5-fatigue*.6); Snd.pant(); }
    if(sprintT>0.001){
      gunGrp.position.x+=SPRINT_POS[0]*sprintT;
      gunGrp.position.y+=SPRINT_POS[1]*sprintT;
      gunGrp.position.z+=SPRINT_POS[2]*sprintT;
      gunGrp.rotation.x+=SPRINT_ROT[0]*sprintT;
      gunGrp.rotation.y+=SPRINT_ROT[1]*sprintT;
      gunGrp.rotation.z+=SPRINT_ROT[2]*sprintT;
      /* ปืนโยกตามจังหวะวิ่ง (แรงกว่าตอนเดินปกติ) */
      gunGrp.position.y+=Math.sin(now*.018)*.022*sprintT;
      gunGrp.rotation.z+=Math.sin(now*.009)*.05*sprintT;
    }
  }
  /* 🔩 ชักลูกเลื่อนหลังยิง (R93) — คันรั้งถอยหลัง-ดันกลับ + ปืนสะบัดตามจังหวะ
     ทำให้ "ยิงทีละนัด" รู้สึกมีน้ำหนัก ไม่ใช่แค่หน่วงเวลาเปล่าๆ */
  if(boltAt && weapon==='r93'){
    const bt=(now-boltAt)/BOLT_MS;
    if(bt>=1){ boltAt=0; tickBolt(now); }
    else{
      /* 🔩 รอบ 447: คันรั้งของโมเดลจริง (ยก-ดึง-ดัน-กด) + ปลอกกระสุนดีด */
      const cant=tickBolt(now);
      /* เอียงปืนเข้าหาตัว + ยกขึ้นนิด ระหว่างชักลูกเลื่อน (เหมือนคลิป SV-98 ที่ผู้ใช้ส่งมา) */
      gunGrp.rotation.z+=cant*.30;
      gunGrp.rotation.y+=cant*.16;
      gunGrp.rotation.x+=cant*.05;
      gunGrp.position.y+=cant*.035;
      /* ทรงปืนที่โค้ดวาดเอง (ตอนโมเดลจริงยังโหลดไม่เสร็จ) ใช้ลูกบิดเดิม */
      const knob=gunModels.r93 && gunModels.r93.userData ? gunModels.r93.userData.bolt : null;
      if(knob){ const pull=bt<.35?(bt/.35):(bt<.7?1-((bt-.35)/.35):0); knob.position.z=.14+pull*.16; }
    }
  }else if(gunModels.r93&&gunModels.r93.userData&&gunModels.r93.userData.boltRig&&!boltAt) tickBolt(now);
  /* ③ ขอบเลนส์ค่อยๆ ขยายเข้ามา + ⑤ เรติเคิลชัดขึ้นตามจังหวะ */
  const on=adsT>0.02;
  wrapEl.classList.toggle('scoped',on);
  if(on) layoutScope();
  /* ⑥ กลั้นหายใจ: แกว่งน้อยลงมาก แต่มีลิมิต หมดแล้วต้องผ่อน */
  const drain=(holdBreath && adsT>.5 && breathLeft>0);
  if(drain) breathLeft=Math.max(0,breathLeft-dt/BREATH_MAX);
  else breathLeft=Math.min(1,breathLeft+dt/BREATH_RECOVER);
  /* 🫁💨 รอบ 508: หมดลม "ขณะยังกดค้างอยู่" เท่านั้นจึงโดนตกวูบ+หอบ
     — ปล่อยปุ่มเองก่อนลมหมด drain เป็น false ตั้งแต่เฟรมนั้น จึงไม่มีทางเข้าเงื่อนไขนี้ (รางวัลคนจับจังหวะเป็น) */
  if(drain && breathLeft<=0) fireGasp();
  if(breathLeft<=0) holdBreath=false;
  if(breathBtn){
    breathBtn.style.opacity=(0.45+0.55*breathLeft).toFixed(2);
    /* 🫁 รอบ 505: ลมใกล้หมด = ปุ่มวูบสว่างตามจังหวะสั่น (ต่อยอด opacity เดิม ไม่ใช่ระบบใหม่) */
    breathBtn.style.filter = breathLeft<BREATH_FX.strainAt
      ? `brightness(${(1+0.5*(1-breathLeft/BREATH_FX.strainAt)*(0.5+0.5*Math.sin(now*0.018))).toFixed(2)})` : '';
  }
  tickBreathFx(dt,now);
}
/* ⑥ การแกว่งจากการหายใจ — ใส่ที่กล้องหลังหมุน yaw/pitch แล้ว (ภาพในเลนส์แกว่งตามด้วย) */
/* 💥 คลายแรงถอยกลับเข้าเป้าแบบสปริง + ใส่ที่กล้อง (ภาพในเลนส์สะบัดตามไปด้วย) */
function applyRecoil(dt){
  if(Math.abs(recPitch)<1e-5 && Math.abs(recYaw)<1e-5){ recPitch=0; recYaw=0; return; }
  camera.rotateX(recPitch); camera.rotateY(recYaw);
  const k=Math.min(1,dt*recCfg().recover);   /* 💥 รอบ 500: ความเร็วคืนตัวแยกตามกระบอก */
  recPitch-=recPitch*k; recYaw-=recYaw*k;
}
function applyBreath(now){
  if(adsT<=0.02) return;
  /* 🔭 รอบ 506: มุมแกว่งจริงถูกคูณด้วย swMagG (ตามกำลังขยาย) · กลั้นหายใจใช้ swHoldG แทนค่าคงที่ 0.12
     → "ที่ตาเห็นในเลนส์" = 4× ค่าเดิม · 6× +12% · 8× +25% และกลั้นหายใจแล้วนิ่งเท่ากันทุกซูม */
  const steady=(holdBreath&&breathLeft>0)?swHoldG:1;
  /* 🫁💨 รอบ 508: ตอนหอบ (ลมหมดคาปุ่ม) แอมป์แรงขึ้นชั่วครู่แล้วคลายเอง */
  const amp=ADS_BREATH*adsT*steady*swMagG*gaspMul();
  camera.rotateX(Math.sin(now*0.0016)*amp);
  camera.rotateY(Math.cos(now*0.0011)*amp*0.8);
}
/* 🔭 ขนาดวงเลนส์เป็นพิกเซล (อิงด้านสั้นของจอ — จอเตี้ยก็ยังเป็นวงกลมพอดี ไม่ล้น) */
/* 🔭 รอบ 461: จุดเล็งย้ายลงมา 73% ของจอ → วงเลนส์ต้องไม่ล้นขอบล่าง
   จำกัดรัศมีไม่ให้เกินระยะจากจุดเล็งถึงขอบจอที่ใกล้ที่สุด (เว้นขอบ 8px) */
function scopeRadius(){
  /* 🔭 รอบ 462: วงโตตามกำลังขยาย — แต่จุดเล็งอยู่ค่อนล่าง พื้นที่ว่างถึงขอบจอจึงเป็นตัวจำกัดจริง
     จึงคิดเป็น "สัดส่วนของพื้นที่ที่มี": 8× = เต็มที่ · 6× = 85% · 4× = 73% (เห็นต่างชัดทุกจอ) */
  const mag=curMag()||{r:1};
  const rel=(mag.r||1)/1.18;
  const base=Math.min(innerWidth,innerHeight)*SCOPE_R*1.18;
  const o=(typeof aimOffNow==='function')?aimOffNow():[0,0];
  const cx=innerWidth*(.5+o[0]*.5), cy=innerHeight*(.5-o[1]*.5);
  const room=Math.min(cx,innerWidth-cx,cy,innerHeight-cy)-8;
  return Math.round(Math.max(40,Math.min(base,room)*rel));
}
/* ③ รัศมีเลนส์ "ขณะนี้" — โตจาก 0 → เต็มวง ตามจังหวะยกปืน (ทำให้ขอบเลนส์ค่อยๆ ขยายเข้ามา) */
function scopeRadiusNow(){ return Math.max(1,Math.round(scopeRadius()*(0.35+0.65*adsT))); }
/* จัดขนาดหน้ากากดำ + วงเรติเคิลให้ตรงกับวงเลนส์ที่จะเรนเดอร์จริง */
/* 📏 รอบ 464: บอก "ระยะถึงเป้าที่เล็งอยู่" ใต้เรติเคิล — ช่วยเด็กเลือกกำลังขยาย/เล็งเป้าไกล
   ยิงเรย์เบา ๆ ทุก 6 เฟรมพอ (ไม่กินเฟรม) · ไม่โดนอะไร = ขีดกลาง */
let rngTick=0, rngTxt='';
function tickRange(){
  if(!scopeRngEl||adsT<0.35) return;
  if((rngTick++ % 6)!==0) return;
  const dir=aimDir(), org=camera.position.clone();
  const hit=rayTarget(org.clone(), dir, 900);
  let t = hit ? camera.position.distanceTo(hit.point) : 0;
  if(!t){                                   /* ไม่โดนยาน/ยานแม่ → วัดระยะถึง "พื้นดิน" แทน */
    const P=new THREE.Vector3();
    for(let d=6; d<=900; d+=6){
      P.copy(org).addScaledVector(dir,d);
      if(P.y<=terrainH(P.x,P.z)){ let lo=d-6, hi=d;
        for(let i=0;i<6;i++){ const m=(lo+hi)/2; P.copy(org).addScaledVector(dir,m);
          if(P.y<=terrainH(P.x,P.z)) hi=m; else lo=m; }
        t=hi; break; }
    }
  }
  t=Math.round(t);
  const txt = t ? `📏 ${t} ม.` : '📏 —';
  if(txt!==rngTxt){ rngTxt=txt; scopeRngEl.textContent=txt; }
}
function layoutScope(now){
  const R=scopeRadiusNow();
  /* 🫁 รอบ 462: ขอบเลนส์ "หายใจ" — วงขยับเข้า-ออกนิดเดียวตามจังหวะหายใจเดียวกับที่กล้องแกว่ง
     กลั้นหายใจ (ปุ่ม 🫁) = แทบนิ่งสนิท + ขอบเข้มขึ้น · ลมหมด = แกว่งแรงและถี่ขึ้น (เหนื่อย) */
  const t=(typeof now==='number')?now:performance.now();
  const tired=(breathLeft<0.25)?(1+(0.25-breathLeft)*4):1;              // ลมใกล้หมด = แรงขึ้นถึง ~2 เท่า
  const steady=(holdBreath&&breathLeft>0)?0.10:1;
  const wob=Math.sin(t*0.0016*tired)*3.2*adsT*steady*tired;             // ±3 px (นิ่งตอนกลั้นหายใจ)
  /* 🫁 รอบ 505: ยิ่งลมใกล้หมด ขอบเลนส์ยิ่งเข้ม (บวกทับสูตรเดิม · เพดาน .99 กันดำสนิท) */
  const dark=Math.min(0.99,((holdBreath&&breathLeft>0)?0.94:0.88)-0.03*Math.cos(t*0.0016*tired)*steady
    +BREATH_FX.darkAdd*breathVig);
  if(scopeRingEl) scopeRingEl.style.opacity=Math.max(0,(adsT-0.25)/0.75).toFixed(2);   // ⑤ เรติเคิลชัดขึ้นตอนเข้าที่
  /* ⚠️ หัวใจของ PiP: "นอกเลนส์ต้องยังเห็นภาพปกติ" — ห้ามถมดำทั้งรอบนอก
     (ถ้าถมดำจะกลายเป็นกล้องเต็มจอแบบเกมทั่วไป ผู้เล่นมองไม่เห็นภัยด้านข้าง = ผิดสเปก)
     ใส่แค่ "ขอบกระบอกเลนส์" เป็นเงามืดบางๆ วงแคบๆ แล้วจางหายไป */
  const ap=aimPct();                                    // 🔭 รอบ 461: วงเลนส์ครอบ "จุดเล็ง" ไม่ใช่กลางจอ
  /* 👁️ รอบ 465: eye-relief — หันเร็ว ๆ ตาไม่ตรงเลนส์ ขอบดำจะเลื่อนบังมาข้างหนึ่งชั่วครู่
     (ใช้ค่าแรงเฉื่อยการหันชุดเดียวกับที่ปืนโยก จึงตรงจังหวะกันเป๊ะ) */
  const eyeX=clamp(-lagYaw*260,-9,9), eyeY=clamp(lagPitch*220,-8,8);
  ap.x+=eyeX/innerWidth*100; ap.y+=eyeY/innerHeight*100;
  /* 🫁🌑 รอบ 505: "ขอบจอมืดเข้าเป็นวง" ตามลมที่เหลือ — เลเยอร์ที่ 2 ของหน้ากากใบเดิม
     จุดเริ่มมืดถูกบังคับให้อยู่ "นอกวงเลนส์" อย่างน้อย vigGap px เสมอ → ไม่มีทางบังกากบาท/ภาพในเลนส์
     ยังคงสเปก PiP: นอกวงไม่ได้ถมทึบ ยังเห็นภัยด้านข้างได้ (alpha สูงสุด .62 เฉพาะมุมจอตอนลมหมด) */
  let vigLayer='';
  if(breathVig>0){
    /* จุดเริ่มมืดอิง "ด้านสั้นของจอ" (จอเตี้ย 812×375 ขอบบน-ล่างจึงมืดจริง ไม่ใช่มืดแค่ซ้าย-ขวา)
       ปลายไล่สีอิงด้านยาว → มุมจอมืดสุด · ทั้งคู่ยังถูกบังคับ ≥ R+vigGap เสมอ */
    const hMin=Math.min(innerWidth,innerHeight)*0.5, hMax=Math.max(innerWidth,innerHeight)*0.5;
    const r0=Math.max(R+wob+BREATH_FX.vigGap, hMin*BREATH_FX.vigIn*(1-0.22*breathVig));
    const r1=Math.max(r0+40,hMax*1.45), rm=r0+(r1-r0)*0.55;
    const a=(BREATH_FX.vig*breathVig);
    vigLayer=`, radial-gradient(circle at ${ap.x}% ${ap.y}%,`+
      ` rgba(0,0,0,0) ${Math.round(r0)}px,`+
      ` rgba(2,4,6,${(a*0.42).toFixed(3)}) ${Math.round(rm)}px,`+
      ` rgba(2,4,6,${a.toFixed(3)}) ${Math.round(r1)}px)`;
  }
  if(scopeMaskEl) scopeMaskEl.style.background=
    `radial-gradient(circle at ${ap.x}% ${ap.y}%,`+
    ` rgba(0,0,0,0) ${R+wob-2}px,`+
    ` rgba(6,9,12,${dark.toFixed(2)}) ${R+wob}px,`+
    ` rgba(6,9,12,.55) ${R+wob+7}px,`+
    ` rgba(6,9,12,.18) ${R+wob+13}px,`+
    ` rgba(0,0,0,0) ${R+wob+20}px)`+vigLayer;
  if(scopeRingEl){ scopeRingEl.style.width=scopeRingEl.style.height=((R+wob)*2)+'px';
    scopeRingEl.style.left=ap.x+'%'; scopeRingEl.style.top=ap.y+'%'; }
}
/* มุมกล้องของภาพในเลนส์ (องศา) ตามกำลังขยายที่เลือก
   กำลังขยายจริง = ขนาดเชิงมุมต่อพิกเซลของภาพหลัก ÷ ของภาพในเลนส์
   → tan(fovเลนส์/2) = tan(fovหลัก/2) × (R ÷ ครึ่งความสูงจอ) ÷ กำลังขยาย
   ⚠️ ห้ามใช้ FOV/กำลังขยาย ตรงๆ — จะได้กำลังขยายไม่ตรงจริง เพราะวงเลนส์เล็กกว่าจอ */
function scopeFovDeg(){
  const R=scopeRadiusNow();
  const t=Math.tan(FOV*Math.PI/360) * (R/(innerHeight/2)) / curMag().m;
  return Math.atan(t)*360/Math.PI;
}
/* 🔭 รอบเรนเดอร์ที่ 2 — ภาพขยายเฉพาะ "ในเลนส์"
   ใช้ scissor+viewport เป็นสี่เหลี่ยมจัตุรัสกลางจอ แล้วให้หน้ากากดำ (CSS) บังมุมนอกวงกลม
   ⚠️ ต้องตั้ง aspect=1 ด้วย ไม่งั้นภาพในเลนส์จะยืดผิดสัดส่วน (viewport เป็นจัตุรัสแต่ aspect ยังเป็นของจอ) */
function renderScopePass(){
  const W=innerWidth, H=innerHeight, R=scopeRadiusNow();
  const sf=scopeFovDeg();
  const oldFov=camera.fov, oldAspect=camera.aspect;
  const gunWas=gunGrp?gunGrp.visible:false;
  if(gunGrp) gunGrp.visible=false;              // ในเลนส์ไม่ควรเห็นตัวปืนตัวเอง
  /* 🔭 รอบ 461: ภาพในเลนส์ต้องเป็น "จุดที่เล็งอยู่" → หมุนกล้องไปตาม AIM_OFF ก่อนเรนเดอร์
     (คำนวณมุมจาก FOV เดิม ก่อนเปลี่ยนเป็น fov ของเลนส์) แล้วคืนค่าเดิมท้ายฟังก์ชัน */
  const ao=aimOffNow(), tn=Math.tan(oldFov*Math.PI/360);
  const oldQuat=camera.quaternion.clone();
  if(ao[0]||ao[1]){
    camera.rotateY(-Math.atan(ao[0]*tn*oldAspect));
    camera.rotateX( Math.atan(ao[1]*tn));
    camera.updateMatrixWorld(true);
  }
  camera.fov=sf; camera.aspect=1; camera.updateProjectionMatrix();
  const x=W*(.5+ao[0]*.5)-R, y=H*(.5+ao[1]*.5)-R;   // มุมล่างซ้ายของกรอบเลนส์ (viewport นับ y จากล่าง)
  renderer.setScissorTest(true);
  renderer.setViewport(x,y,R*2,R*2);
  renderer.setScissor(x,y,R*2,R*2);
  renderer.render(scene,camera);                // autoClear=true → ล้างเฉพาะในกรอบนี้แล้ววาดใหม่
  renderer.setScissorTest(false);
  renderer.setViewport(0,0,W,H);
  camera.fov=oldFov; camera.aspect=oldAspect; camera.updateProjectionMatrix();
  camera.quaternion.copy(oldQuat); camera.updateMatrixWorld(true);   // 🔭 คืนมุมกล้องเดิม
  if(gunGrp) gunGrp.visible=gunWas;
}
/* 🔎 สลับกำลังขยาย 4× → 6× → 8× → 4× */
function cycleScopeMag(){
  if(!WEAPONS[weapon].scope) return;
  scopeMagIdx=(scopeMagIdx+1)%magList().length;
  const z=curMag();
  syncWeaponBtns();
  toastBan(`🔎 <b>กล้อง ${z.label} — ${z.name}</b><br><span class="ib-sub">${z.hint}</span>`,2000);
  if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
}
function renderAmmo(){
  if(!ammoEl) return;
  const W=WEAPONS[weapon];
  /* บนเฮลิ/เป็นพลปืนใช้ปืนกลติดลำ ไม่มีแม็ก → ซ่อนช่องกระสุน
     (ถ้าปล่อยโชว์ แถบสถานะจะสูงขึ้นจนไปชนกระดานคะแนนบนจอเตี้ย — เจอจริงตอนเทสต์) */
  if(!W.mag || inHeli || riding){ ammoEl.style.display='none'; return; }
  ammoEl.style.display='block';
  const reloading=reloadAt>0;
  ammoEl.innerHTML=`<span class="am-ic">${W.icon}</span>`+
    (reloading?'<b class="am-rl">กำลังบรรจุ…</b>':`<b>${r93Ammo}</b><span class="am-max">/${W.mag}</span>`);
}
function syncWeaponBtns(){
  const W=WEAPONS[weapon];
  if(swapBtn) swapBtn.textContent=(weapon==='rifle')?'🎯':'🔫';   // โชว์ปืนที่ "จะสลับไป"
  const show=(W.scope && !inHeli && !riding);
  if(scopeBtn) scopeBtn.style.display=show?'block':'none';
  /* ปุ่มเลือกกำลังขยายโชว์เฉพาะปืนที่มีหลายระดับ (ไรเฟิลมี 2× ระดับเดียว) */
  if(magBtn){ magBtn.style.display=(show&&magList().length>1)?'block':'none'; magBtn.textContent=curMag().label; }
}

/* ============================================================
   💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
   ============================================================ */
function boom(pos,scale,color){
  const sc=scale||1;
  /* ลูกไฟกลาง */
  const ball=new THREE.Sprite(new THREE.SpriteMaterial({color:color||0xffb347,transparent:true,opacity:1,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  ball.position.copy(pos); ball.scale.setScalar(4*sc); scene.add(ball);
  fx.push({o:ball,t:0,life:.65,kind:'ball',sc});
  /* วงคลื่นกระแทก */
  const ring=new THREE.Mesh(new THREE.RingGeometry(1,1.25,26),
    new THREE.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false}));
  ring.position.copy(pos); ring.lookAt(camera.position); scene.add(ring);
  fx.push({o:ring,t:0,life:.85,kind:'ring',sc});
  /* สะเก็ด */
  const n=Math.min(26,10+Math.round(8*sc));
  for(let i=0;i<n;i++){
    const s=new THREE.Mesh(new THREE.TetrahedronGeometry(rnd(.25,.7)*sc,0),
      new THREE.MeshBasicMaterial({color:i%3?0xff8a3a:0x3a3f47}));
    s.position.copy(pos); scene.add(s);
    fx.push({o:s,t:0,life:rnd(1.0,1.9),kind:'bit',
      v:new THREE.Vector3(rnd(-1,1),rnd(-.2,1.2),rnd(-1,1)).normalize().multiplyScalar(rnd(9,26)*Math.sqrt(sc)),
      rv:new THREE.Vector3(rnd(-6,6),rnd(-6,6),rnd(-6,6))});
  }
  Snd.boom(sc);
  shake=Math.min(1.6, shake + .32*sc);
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate(Math.min(220,60*sc));
}
/* 💨 รอบ 469: ฝุ่นฟุ้งเล็ก ๆ ตรงจุดกระสุนลง (ทราย/ปูน) */
function dustPuff(pos){
  for(let i=0;i<2;i++){
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({color:0xcdbb98,transparent:true,opacity:.5,
      depthWrite:false,fog:true}));
    sp.position.copy(pos); sp.scale.setScalar(.18); scene.add(sp);
    fx.push({o:sp,kind:'smoke',t:0,life:rnd(.45,.8),sc:.18,a0:.45,
             v:new THREE.Vector3(rnd(-.5,.5),rnd(.7,1.5),rnd(-.5,.5))});
  }
}
function sparkAt(pos){
  const s=new THREE.Sprite(new THREE.SpriteMaterial({color:0xfff0a0,transparent:true,opacity:1,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  s.position.copy(pos); s.scale.setScalar(1.6); scene.add(s);
  fx.push({o:s,t:0,life:.22,kind:'ball',sc:.5});
}
/* เส้นกระสุนวิ่ง (ใช้ทั้งของผู้เล่นและพันธมิตร) */
function tracer(from,to,color,width,fly){
  const dir=new THREE.Vector3().subVectors(to,from);
  const len=dir.length();
  /* 🚀 รอบ 467: มีเวลาเดินทาง = วาด "ขีดสั้น" วิ่งไปตามวิถี (เห็นกระสุนพุ่งจริง)
     ไม่มี = ลำแสงเต็มเส้นแบบเดิม (ปืนกลติดเฮลิ ฯลฯ) */
  const seg = fly ? Math.min(len, Math.max(6, len*0.10)) : len;
  const m=new THREE.Mesh(new THREE.CylinderGeometry(width||.06,width||.06,seg,5),
    new THREE.MeshBasicMaterial({color:color||0xffe08a,transparent:true,opacity:.95,
      blending:THREE.AdditiveBlending,depthWrite:false}));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
  scene.add(m);
  if(fly){ m.position.copy(from).addScaledVector(dir,seg/len*.5);
           fx.push({o:m,t:0,life:fly,kind:'trace',from:from.clone(),dir:dir.clone(),len,seg}); }
  else   { m.position.copy(from).addScaledVector(dir,.5);
           fx.push({o:m,t:0,life:.10,kind:'fade'}); }
}
function tickFx(dt){
  for(let i=fx.length-1;i>=0;i--){
    const f=fx[i]; f.t+=dt;
    const k=f.t/f.life;
    if(k>=1){ scene.remove(f.o);
      if(f.o.material){ f.o.material.dispose&&f.o.material.dispose(); }
      if(f.o.geometry) f.o.geometry.dispose&&f.o.geometry.dispose();
      fx.splice(i,1); continue; }
    if(f.kind==='ball'){ f.o.scale.setScalar(4*f.sc*(1+k*2.2)); f.o.material.opacity=1-k; }
    else if(f.kind==='ring'){ const s=(1+k*16)*f.sc; f.o.scale.setScalar(s); f.o.material.opacity=.9*(1-k);
      f.o.lookAt(camera.position); }
    else if(f.kind==='bit'){ f.o.position.addScaledVector(f.v,dt); f.v.y-=26*dt;
      f.o.rotation.x+=f.rv.x*dt; f.o.rotation.y+=f.rv.y*dt;
      const gy=terrainH(f.o.position.x,f.o.position.z);
      if(f.o.position.y<gy){
        /* 🔔 รอบ 466: กระทบพื้นครั้งแรก = เสียงกริ๊ง + เด้งเบา ๆ อีกที (ให้รู้สึกเป็นโลหะจริง) */
        if(!f.landed){ f.landed=true;
          if(f.metal){ const d=camera?camera.position.distanceTo(f.o.position):99;
                       if(d<12) Snd.shell(d); }
          if(Math.abs(f.v.y)>2.2){ f.v.y=-f.v.y*0.28; f.v.x*=.4; f.v.z*=.4; f.o.position.y=gy+0.01;
                                   f.landed=false; f.bounced=(f.bounced||0)+1;
                                   if(f.bounced>1){ f.landed=true; f.v.set(0,0,0); f.o.position.y=gy; } }
          else { f.v.set(0,0,0); f.o.position.y=gy; }
        } else { f.o.position.y=gy; f.v.set(0,0,0); }
      } }
    else if(f.kind==='fade'){ f.o.material.opacity=.95*(1-k); }
    /* 🚀 รอบ 467: ขีดกระสุนวิ่งไปตามวิถีจนถึงเป้า */
    else if(f.kind==='trace'){
      const u=Math.min(1,k), d=f.len*u;
      f.o.position.copy(f.from).addScaledVector(f.dir, Math.min(1,(d+f.seg*.5)/f.len));
      f.o.material.opacity=.95*(1-u*u*.55);
    }
    /* 💨 รอบ 449: ควันปากลำกล้อง — ลอยขึ้น บานออก จางหาย (ติดกล้องเพราะเป็นลูกของกล้อง) */
    else if(f.kind==='smoke'){
      f.o.position.addScaledVector(f.v,dt);
      f.o.scale.setScalar(f.sc*(1+k*2.6));
      f.o.material.opacity=f.a0*(1-k)*(1-k);
    }
  }
}

/* ============================================================
   🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
   เป้ากระดาษบนเสาไม้ ตั้งตามปากตรอกริมถนน + ริมกำแพงในเมือง
   ยิงโดน = เหรียญ + โผล่คำศัพท์อังกฤษ 1 คำพร้อมคำแปลไทย (ดึงจากคลังคำเดียวกับ pickWord)
   เป้าล้มแล้วตั้งใหม่เองใน TRG_BACK ms · เสียงโดนเป้าแยกจาก hitWall/hitSand
   ⚡ งบมือถือ: 12 เป้า × 2 ชิ้น = 24 draw call แต่ซ่อนตัวที่ไกลเกิน TRG_LOD (เหมือน tickHouseLod)
      geometry/material ใช้ร่วมกันทุกตัว → เพิ่มเป้าอีกก็ไม่บวมเท่าไหร่
   ============================================================ */
const TRG_COIN=3, TRG_BACK=7000, TRG_LOD=130, TRG_R=0.95;
const QUIZ_COIN=12, QUIZ_GAP=1400, QUIZ_RANGE=110;   // 🔎 รอบ 473: โบนัสตอบถูก · หน่วงก่อนโจทย์ใหม่ · ระยะที่นับว่า "เห็นเป้า"
let targets=[], trgTex=null, trgGeo=null, trgMat=null, trgPostGeo=null, trgPostMat=null;
let quizT=null, quizAt=0, trgShots=0, trgHits=0;
/* กระดาษเป้า: วงแหวนแดง-ขาว + จุดดำกลาง + **คำอังกฤษบนหัวกระดาษ** (รอบ 473)
   วาดใหม่ต่อคำ = 1 แคนวาส 128px ต่อเป้า (12 ใบ) — เบามาก และเปลี่ยนคำได้ตอนเป้าตั้งใหม่ */
function targetTexture(word){
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const g=cv.getContext('2d');
  g.fillStyle='#f4efe2'; g.fillRect(0,0,128,128);                 // กระดาษสีนวล
  g.strokeStyle='#c9bfa8'; g.lineWidth=3; g.strokeRect(2,2,124,124);
  [[46,'#d8503c'],[35,'#f4efe2'],[24,'#d8503c'],[13,'#f4efe2']].forEach(([r,c])=>{
    g.fillStyle=c; g.beginPath(); g.arc(64,72,r,0,7); g.fill();
  });
  g.fillStyle='#26221c'; g.beginPath(); g.arc(64,72,6,0,7); g.fill();   // จุดกลาง
  if(word){                                                        // 📝 คำศัพท์บนหัวกระดาษ
    const s=word.toUpperCase();
    let px=22; g.font='900 '+px+'px system-ui,sans-serif';
    while(g.measureText(s).width>116 && px>9){ px--; g.font='900 '+px+'px system-ui,sans-serif'; }
    g.textAlign='center'; g.fillStyle='#1d1a15'; g.fillText(s,64,26);
    g.strokeStyle='#b9ad94'; g.lineWidth=2; g.beginPath(); g.moveTo(12,32); g.lineTo(116,32); g.stroke();
  }
  const t=new THREE.Texture(cv); t.needsUpdate=true; return t;
}
/* ตั้งคำใหม่ให้เป้า 1 ตัว (เลี่ยงคำซ้ำกับเป้าตัวอื่น ไม่งั้นโจทย์แปลไทยจะมีคำตอบถูก 2 ใบ) */
function setTargetWord(t){
  const used=targets.filter(o=>o!==t&&o.w).map(o=>o.w[0]);
  let w=targetWord();
  for(let i=0;i<8 && used.includes(w[0]);i++) w=targetWord();
  t.w=w;
  const old=t.board.material;
  t.board.material=new THREE.MeshLambertMaterial({map:targetTexture(w[0]),side:THREE.DoubleSide});
  if(old && old!==trgMat){ if(old.map) old.map.dispose(); old.dispose(); }
}
/* จุดวางเป้า — "ค่าตายตัว" เหมือน HILLS: ผู้เล่นออนไลน์ทุกเครื่องต้องเห็นเป้าตำแหน่งเดียวกัน */
function targetSpots(){
  const out=[], gap=(STREET_LEN/9)*0.94;
  for(let i=0;i<8;i++){                                  // ปากตรอกระหว่างตึกริมถนน สลับซ้าย-ขวา
    const side=(i%2)?1:-1;
    const z=STREET_Z0-8-(i+0.5)*gap;
    const x=side*(STREET_HW+1.6);
    out.push({x,z,look:[0,z]});                          // หันหน้าเข้าถนน
  }
  [[-64,-40],[89,10],[-30,-144],[34,74]].forEach(([x,z])=>{   // ริมกำแพง/หอมินาเรตในเมือง
    out.push({x,z,look:[0,STREET_Z0-70]});
  });
  return out;
}
function buildTargets(){
  trgTex=targetTexture(null);
  trgGeo=new THREE.PlaneGeometry(1.15,1.5);
  trgMat=new THREE.MeshLambertMaterial({map:trgTex,side:THREE.DoubleSide});
  trgPostGeo=new THREE.CylinderGeometry(.07,.10,1.5,5);
  trgPostMat=new THREE.MeshLambertMaterial({color:0x8a6a45});
  targetSpots().forEach(s=>{
    /* ⚠️ ตึกในเมือง (buildTown) สุ่มตำแหน่ง → เป้าอาจไปโผล่กลางตึก
       ดันออกนอกกำแพงให้พ้นก่อน (เรียกหลัง buildTown/buildWarStreet แล้ว solids จึงครบ) */
    for(const o of solids){
      const dx=s.x-o.x, dz=s.z-o.z, d=Math.hypot(dx,dz);
      if(d<o.r+1.2){ const k=(o.r+1.6)/(d||0.01); s.x=o.x+dx*k; s.z=o.z+dz*k; }
    }
    const base=terrainH(s.x,s.z);
    const grp=new THREE.Group();
    grp.position.set(s.x,base,s.z);
    grp.rotation.y=Math.atan2(s.look[0]-s.x, s.look[1]-s.z);
    const post=new THREE.Mesh(trgPostGeo,trgPostMat); post.position.y=.75; grp.add(post);
    const board=new THREE.Mesh(trgGeo,trgMat); board.position.y=2.05; grp.add(board);
    scene.add(grp);
    const t={grp, board, up:true, fallAt:0, backAt:0, w:null,
             c:new THREE.Vector3(s.x, base+2.05, s.z)};          // จุดกึ่งกลางเป้า (ใช้ตรวจกระสุน)
    targets.push(t);
    setTargetWord(t);                                            // 📝 รอบ 473: แปะคำอังกฤษบนหน้าเป้า
  });
  quizT=null; quizAt=0; trgShots=0; trgHits=0;
}
/* ล้ม → ตั้งใหม่ · ซ่อนตัวที่ไกลเกินระยะ (เช็กทุก 12 เฟรม พอสำหรับ LOD) */
let trgLodTick=0;
function tickTargets(now){
  if(++trgLodTick%12===0){
    for(const t of targets){
      const near=Math.hypot(px-t.c.x,pz-t.c.z)<TRG_LOD;
      if(t.grp.visible!==near) t.grp.visible=near;
    }
  }
  for(const t of targets){
    if(t.up){
      if(t.backAt && now<t.backAt+240){                  // เด้งกลับตอนเพิ่งตั้งขึ้น
        const e=(now-t.backAt)/240;
        t.grp.rotation.x=-0.30*Math.sin(e*Math.PI*2)*(1-e);
      }else if(t.grp.rotation.x) t.grp.rotation.x=0;
      continue;
    }
    const e=(now-t.fallAt)/380;
    if(e<1) t.grp.rotation.x=1.35*(1-(1-e)*(1-e));       // ล้มหงายไปข้างหลัง (ชะลอปลายทาง)
    else if(now-t.fallAt>TRG_BACK){ t.up=true; t.backAt=now; setTargetWord(t); }   // ตั้งใหม่ = คำใหม่
    else t.grp.rotation.x=1.35;
  }
  tickQuiz(now);
}
/* ============================================================
   🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
   เลือกเป้าที่ผู้เล่นเห็นอยู่จริง 1 ใบเป็นคำตอบ แล้วโชว์ "คำแปลไทย" บนแถบ HUD
   ยิงถูกใบ = โบนัส QUIZ_COIN · ยิงผิดใบ = ได้เหรียญปกติ + บอกใบ้ให้ลองใหม่ (ไม่ดุ ไม่หักคะแนน)
   โจทย์เปลี่ยนเองเมื่อ: ตอบถูก · เป้าคำตอบล้ม/ไกลเกิน QUIZ_RANGE · หรือยังไม่มีโจทย์
   ============================================================ */
function quizPool(){
  return targets.filter(t=>t.up && t.w && Math.hypot(px-t.c.x,pz-t.c.z)<QUIZ_RANGE);
}
function newQuiz(now){
  const pool=quizPool();
  if(pool.length<2){ quizT=null; renderQuiz(); return; }        // ต้องมีให้เลือกอย่างน้อย 2 ใบถึงจะเป็นโจทย์
  quizT=pool[(Math.random()*pool.length)|0];
  renderQuiz();
}
function tickQuiz(now){
  if(now<quizAt) return;
  if(!quizT || !quizT.up || Math.hypot(px-quizT.c.x,pz-quizT.c.z)>QUIZ_RANGE){
    newQuiz(now); quizAt=now+600;                               // เว้นจังหวะ ไม่ให้คำนวณทุกเฟรม
  }
}
function renderQuiz(){
  if(!quizEl) return;
  if(!quizT){ quizEl.classList.remove('on'); return; }
  quizEl.classList.add('on');
  quizEl.innerHTML=`🔎 ยิงเป้าที่แปลว่า <b>${escapeHTML(quizT.w[1]||'')}</b>`;
}
/* 📖 คำศัพท์สำหรับเป้า — คลังเดียวกับรอบเล่น แต่ไม่ยุ่งกับคำของยานแม่/DONE_KEY */
function targetWord(){
  const pool=(typeof vocabForStudent==='function'?vocabForStudent():[])
    .filter(([en])=>/^[a-z]{3,10}$/i.test(en));
  if(!pool.length) return ['target','เป้า'];
  return pool[(Math.random()*pool.length)|0];
}
function hitTarget(t,point){
  if(!t.up) return;
  const now=performance.now();
  t.up=false; t.fallAt=now; trgHits++;                    // 📊 รอบ 473: นับไว้สรุปความแม่นยำตอนออก
  const d=camera.position.distanceTo(t.c);
  Snd.hitTarget(d);
  dustPuff(point||t.c);
  const [en,th]=t.w||targetWord();
  /* 🔎 ตอบโจทย์ถูก = โบนัส (เด็กต้องอ่านคำอังกฤษบนหน้าเป้าให้ตรงกับคำแปลไทยบนแถบ HUD) */
  const right=(quizT===t);
  const coin=right?QUIZ_COIN:TRG_COIN;
  if(typeof addCoins==='function') addCoins(coin);
  sessionCoins+=coin; renderCoins();
  if(typeof vbRecord==='function') vbRecord(en,th,true);
  if(right){
    quizT=null; quizAt=now+QUIZ_GAP; renderQuiz();
    if(typeof sfx!=='undefined'&&sfx.levelup) sfx.levelup();
    toastBan(`✅ <b>ถูกต้อง!</b> <span class="ib-coin">+${QUIZ_COIN} 🪙</span><br>`+
             `<span class="ib-sub">${escapeHTML(en.toUpperCase())} = ${escapeHTML(th||'')}</span>`,2400);
  }else{
    toastBan(`🎯 <b>เข้าเป้า!</b> <span class="ib-coin">+${TRG_COIN} 🪙</span><br>`+
             `<span class="ib-sub">${escapeHTML(en.toUpperCase())} = ${escapeHTML(th||'')}`+
             `${quizT?` · โจทย์ยังเป็น <b>${escapeHTML(quizT.w[1]||'')}</b> นะ`:''}</span>`,2200);
  }
  if(typeof speakWord==='function') setTimeout(()=>speakWord(en),260);
}

/* ============================================================
   🎯 ระบบยิงของผู้เล่น
   ============================================================ */
/* 🎯 รอบ 458 (ผู้ใช้ขีดเส้นบนภาพ: ให้จุดเล็งไปอยู่บน "แนวลำกล้อง" ที่ตัดกับแกนกลางจอ)
   จุดเล็งไม่ได้อยู่กลางจอแล้ว — เลื่อนลงตาม AIM_OFF (หน่วย NDC: 0=กลางจอ · −1=ขอบล่าง)
   ⚠️ กระสุน/เรดาร์/ล็อกเป้า อ่านทิศจาก aimDir() ที่เดียว → เลื่อนที่นี่แล้วทุกอย่างตรงกันหมด
   ตอนส่องกล้อง (ADS) ค่อย ๆ กลับไปกลางเลนส์ตาม adsT (ไม่งั้นยิงผ่านกล้องแล้วต่ำกว่าที่เล็ง)
   จูนสั้น ๆ ตอน preview: GunLab.aim(-0.39) */
const AIM_OFF=[0,-.46];   /* รอบ 460: ผู้ใช้ขีดเส้นแดงรอบสาม — สูงขึ้นจาก 80% เป็น **73% ของจอ**
   🚨 รอบ 489 (ย้อนคืนรอบ 488): ค่านี้ **ใช้ร่วมกันทุกกระบอก** — รอบ 488 แก้เป็น −0.274 เพื่อ R93
      ผลคือ **การเล็งของไรเฟิลเสียไปด้วย** ทั้งที่ผู้ใช้สั่งว่า "เฉพาะ R93"
      ⛔ ห้ามแก้ค่านี้เพื่อปืนกระบอกเดียวเด็ดขาด — ถ้าต้องการจุดเล็งเฉพาะกระบอก ให้ทำเป็นค่าแยกตาม weapon */
/* ใช้เฉพาะตอนเดินเท้าถือปืนเอง — บนเฮลิ/พลปืนประจำประตู ยังเล็งกลางจอเหมือนเดิม
   🔭 รอบ 461: ตอนส่องกล้อง "ไม่คืนกลับกลางจอ" แล้ว — วงเลนส์ย้ายมาครอบจุดเล็งแทน
   (ของเดิมจางกลับเป็น 0 ทำให้กล้องขยายจุดกลางจอ ซึ่งไม่ใช่จุดที่กระสุนไป) */
/* 🎯 รอบ 490: **จุดเล็งแยกตามกระบอก** (ผู้ใช้สั่ง "R93 เท่านั้น" — รอบ 488 เคยพลาดไปแก้ค่ากลางจนไรเฟิลเสีย)
   กระบอกที่ไม่มีชื่อในตารางนี้ → ใช้ AIM_OFF ค่ากลางเหมือนเดิมทุกประการ (ไรเฟิล = [0,−.46] ไม่เปลี่ยน)
   R93: ผู้ใช้ขีดเส้นแดง 2 เส้นตัดกัน — จุดตัดอยู่ "สูงเท่ายอดกล้องส่อง · เยื้องซ้ายจากกากบาท"
        วัดเทียบยอดปืน (58.9% ของจอ) และระยะกากบาท→ปากกระบอก ได้ ≈ (42.3%, 58.9%) ของจอ */
/* รอบ 495 (ผู้ใช้ขีดเส้นตัดบนภาพเฟรมเต็ม 1512×717): ย้ายจุดเล็ง R93 ขึ้น-ขวา
   วัดจากภาพ: กากบาทเดิม (641,433) → จุดตัดแดง (685,394) = Δ(+44,−39) px
   [−0.154,−0.178] (42.3%,58.9%) → [−0.096,−0.069] (45.2%,53.4% ของจอ) · ไรเฟิลไม่กระทบ
   รอบ 497 (ผู้ใช้ขีดเส้นตัดใหม่ · ภาพเฟรมเต็ม 1520×725 หลังปรับปลายปืนขึ้นรอบ 496):
   กากบาทเดิม (690,396) → จุดตัดแดง (751,377) = Δ(+61,−19) px
   → **[−0.016,−0.018] = 49.2%, 50.9% ของจอ** (เกือบกลางจอพอดี)
   🔒 **LOCKED รอบ 498** — ผู้ใช้สั่งล็อกจุดเล็งทั้ง 2 กระบอกแล้ว (ดูกล่อง LOCKED เหนือ GUN_VIEW)
      แก้ได้เฉพาะเมื่อผู้ใช้สั่งตรง ๆ · ปืนใหม่ให้เพิ่ม key ใหม่ ห้ามขยับของเดิม */
const AIM_BY_GUN={ r93:[-0.016,-0.018] };
function aimOffNow(){ if(inHeli||riding) return [0,0];
  const a=AIM_BY_GUN[weapon]||AIM_OFF; return [a[0], a[1]]; }
/* จุดเล็งในหน่วย % ของจอ (ใช้วางวงเลนส์/หน้ากาก CSS) */
/* ตำแหน่งท่าแนบไหล่ที่ "เลื่อนไปตรงจุดเล็ง" แล้ว (ADS_POS เก็บค่าเทียบแกนเล็ง ไม่ใช่เทียบกลางจอ) */
function adsPosNow(){
  const P=adsView().p;                                   /* 🎯 รอบ 499: ตำแหน่งท่าเล็งแยกตามกระบอก */
  const o=aimOffNow(), tn=Math.tan((camera?camera.fov:FOV)*Math.PI/360), d=Math.abs(P[2]);
  return [P[0]+o[0]*tn*(camera?camera.aspect:1.78)*d, P[1]+o[1]*tn*d, P[2]];
}
function aimPct(){ const o=aimOffNow(); return {x:50+o[0]*50, y:50-o[1]*50}; }
let crossAt=null;
function layoutCross(){ if(!crossEl) return;
  const o=aimOffNow(), key=o[0]+','+o[1]; if(key===crossAt) return; crossAt=key;
  crossEl.style.left=(50+o[0]*50)+'%'; crossEl.style.top=(50-o[1]*50)+'%'; }
function aimDir(){
  const o=aimOffNow(), t=Math.tan(camera.fov*Math.PI/360);
  const d=new THREE.Vector3(o[0]*t*camera.aspect, o[1]*t, -1).normalize();
  d.applyQuaternion(camera.quaternion);
  return d;
}
/* ยิงปืนกล: hitscan + กระจายเล็กน้อย · โดนยานลูก/ยานแม่ = ดาเมจ
   🚁 ตอนขับเฮลิ: ปืนกลติดลำ รัวกว่า ไม่มีโอเวอร์ฮีต tracer สีฟ้า */
function fireGun(now){
  if(inHeli){
    if(now-lastFire<PH_GUN_GAP) return;
    lastFire=now; gunRecoil=.5; muzzleUntil=now+40; Snd.gun();
    const origin=camera.position.clone(), dir=aimDir();
    dir.x+=rnd(-GUN_SPREAD,GUN_SPREAD); dir.y+=rnd(-GUN_SPREAD,GUN_SPREAD); dir.normalize();
    let hit=rayTarget(origin,dir,900);
    if(hit && hit.type==='trg'){ const blk=envHit(origin,dir,hit.t);
      if(blk&&blk.kind==='sand'&&blk.dist<hit.t-0.25) hit=null; }   // เนินบังอยู่ (ดูเหตุผลที่ fireGun)
    tracer(origin.clone().addScaledVector(dir,4),hit?hit.point:origin.clone().addScaledVector(dir,700),0x9fe0ff,.07);
    if(hit){
      if(hit.type==='trg') hitTarget(hit.obj,hit.point);        // 🎯 รอบ 471: ยิงเป้าจากบนเฮลิก็นับ
      else{ sparkAt(hit.point);
        if(hit.type==='fighter'){ damageFighter(hit.obj,PH_GUN_DMG,now); Snd.ping(); }
        else if(hit.type==='mother'){ damageMother(MS_DMG_GUN*1.2); } } }
    recPitch+=REC_DEFAULT.up*.45; recYaw+=rnd(-1,1)*REC_DEFAULT.side*.45;   // ปืนกลติดลำเด้งเบาๆ
    return;
  }
  const W=WEAPONS[weapon];
  /* 🎯 R93: ยิงทีละนัด · ต้องรอลูกเลื่อน · มีแม็ก 10 นัด · หมดแม็กบรรจุใหม่อัตโนมัติ */
  if(W.mag){
    if(reloadAt) return;                                   // กำลังบรรจุอยู่
    if(now-lastFire<W.gap) return;                         // ยังชักลูกเลื่อนไม่เสร็จ
    if(r93Ammo<=0){ startReload(now); return; }
    if(!W.auto && firedThisPress) return;                  // ยิงทีละนัด: ต้องปล่อยนิ้วก่อนถึงยิงใหม่
    firedThisPress=true;
    r93Ammo--; renderAmmo();
    if(r93Ammo<=0) startReload(now);
  }else{
    if(overheat || now-lastFire<W.gap) return;
    heat=Math.min(100,heat+W.heat);
    if(heat>=100){ overheat=true; toastBan('🔥 ปืนร้อนจัด! รอสักครู่',700); }
  }
  lastFire=now;
  trgShots++;                                                  // 📊 รอบ 473: นับนัดที่ยิงจริง (เดินเท้าเท่านั้น)
  gunRecoil=W.recoil*recCfg().gun; muzzleUntil=now+(W.mag?90:55);   /* 💥 รอบ 500: สะบัดตัวปืนแยกตามกระบอก */
  /* 💥 รอบ 448 (ผู้ใช้ขอฟีลแบบคลิป): สไนเปอร์ = "กระแทก" ไม่ใช่แค่เด้ง
     → สั่นจอ + ปืนกระชากแรงกว่าปกติ + ยกปืนขึ้นจากท่าวิ่งทันทีถ้ากำลังวิ่งอยู่ */
  if(W.mag){ shake=Math.min(1.2,shake+.34); sprintHold=now+520; }   /* 💥 รอบ 500: ตัวคูณย้ายไป REC_BY_GUN.gun */
  if(W.mag){ Snd.sniper(); boltAt=now; } else Snd.gun();
  muzzleSmoke(W.mag?4:2);                                      // 💨 รอบ 449: ควันลอยจากปากลำกล้อง
  const origin=camera.position.clone();
  const dir=aimDir();
  const sp=W.mag ? (scoped?W.spread:W.hipSpread) : W.spread;   // ไม่ส่องกล้อง = เป๋มาก (ตาม Accuracy ต่ำ)
  dir.x+=rnd(-sp,sp); dir.y+=rnd(-sp,sp); dir.normalize();
  addRecoil();                                                 // 💥 เด้งหลังคำนวณวิถีแล้ว
  let hit=rayTarget(origin,dir,W.mag?4000:900);                // สไนเปอร์ยิงได้ไกลกว่ามาก
  /* 🎯 รอบ 471: เป้าฝึกยิงอยู่ "ติดพื้น" จึงมีเนินเขาบังได้ (ยานอยู่บนฟ้าไม่มีปัญหานี้)
     ⚠️ กันเฉพาะ 'sand' (พื้น/เนิน) เท่านั้น — วัดจริงแล้วเช็กกำแพงด้วยไม่ได้:
     `solids` เก็บตึกเป็น "วงกลม r=ด้านยาว/2" ซึ่งล้นออกมาคลุมผิวถนน → ยิงเป้าปากตรอกจากกลางถนน
     โดนตีว่ามีกำแพงบังทั้งที่มองเห็นเป้าเต็มตา (วัดได้ 9 ใน 12 เป้า) */
  if(hit && hit.type==='trg'){
    const blk=envHit(origin,dir,hit.t);
    if(blk && blk.kind==='sand' && blk.dist<hit.t-0.25) hit=null;   // เนิน/พื้นบังอยู่ = ไม่โดน
  }
  const end=hit? hit.point : origin.clone().addScaledVector(dir,W.mag?2500:700);
  /* 🚀 รอบ 467: กระสุนไม่ถึงเป้าทันทีอีกแล้ว — วิถีถูกคำนวณตอนยิง (เล็งง่ายเหมือนเดิม)
     แต่ "ประกายโดน/ดาเมจ/เสียงโดน" มาถึงตามเวลาเดินทางจริง (ระยะ ÷ ความเร็วกระสุน)
     ยิงยานไกล 800 ม. ด้วย R93 = รอราว 1 วินาที → ได้ฟีลสไนเปอร์จริง โดยไม่ทำให้เด็กเล็งยากขึ้น */
  const dist=origin.distanceTo(end);
  const spd=W.mag?BULLET_SPD_R93:BULLET_SPD_RIFLE;
  const fly=Math.min(2.2, dist/spd);
  tracer(origin.clone().addScaledVector(dir,3),end,W.tracer,W.mag?.09:.05,fly);
  if(!hit){
    /* 🌍 รอบ 469: ไม่โดนยาน — ไปลงพื้น/กำแพง (มีเสียงตามวัสดุ + รอยกระสุนค้างไว้) */
    const e=envHit(origin,dir,W.mag?900:500);
    if(e) bullets.push({at:now+Math.min(2.2,e.dist/spd)*1000, env:e});
    return;
  }
  bullets.push({at:now+fly*1000, hit, dmg:W.dmg, msDmg:W.msDmg});
}
/* 🌍 รอบ 469: หาจุดที่กระสุนไปลงบน "สิ่งแวดล้อม" (ไม่ได้โดนยาน) — เดินตามวิถีทีละช่วง
   เจอกำแพงตึกก่อน = 'wall' · ต่ำกว่าพื้น = 'sand' · ไม่เจอเลย = null */
function envHit(origin,dir,maxD){
  /* ⚡ คัดเฉพาะตึกที่ "อยู่ใกล้แนวยิง" ก่อน (คำนวณครั้งเดียวต่อนัด) แล้วค่อยเดินตามวิถี
     ไม่งั้นต้องวน solids ทั้งแมพทุกช่วง 1.2 ม. = หนักเกินไปบนมือถือ */
  const cand=[]; const hx=dir.x, hz=dir.z;
  for(const o of solids){
    const vx=o.x-origin.x, vz=o.z-origin.z;
    const t=vx*hx+vz*hz; if(t<0||t>maxD) continue;
    const px=vx-hx*t, pz=vz-hz*t;
    if(px*px+pz*pz < (o.r+1)*(o.r+1)) cand.push(o);
  }
  const P=new THREE.Vector3(); const step=1.2;
  for(let d=step; d<=maxD; d+=step){
    P.copy(origin).addScaledVector(dir,d);
    for(const o of cand){
      if(P.y>26) continue;                                   // สูงเกินตึกแล้ว
      const dx=P.x-o.x, dz=P.z-o.z;
      if(dx*dx+dz*dz < o.r*o.r){
        const n=new THREE.Vector3(dx,0,dz).normalize();
        return {point:P.clone(), normal:n, kind:'wall', dist:d};
      }
    }
    if(P.y<=terrainH(P.x,P.z)){
      let lo=d-step, hi=d;
      for(let i=0;i<6;i++){ const m=(lo+hi)/2; P.copy(origin).addScaledVector(dir,m);
        if(P.y<=terrainH(P.x,P.z)) hi=m; else lo=m; }
      P.copy(origin).addScaledVector(dir,hi);
      return {point:P.clone(), normal:new THREE.Vector3(0,1,0), kind:'sand', dist:hi};
    }
  }
  return null;
}
/* 🕳️ รอบ 469: รอยกระสุนค้างบนพื้นผิว — เก็บได้สูงสุด HOLE_MAX รอย (เก่าสุดหลุดออกก่อน)
   ใช้ sprite แผ่นเดียวต่อรอย = เบามาก · ทรายเป็นหลุมฟุ้ง · ปูนเป็นรูเข้ม ๆ ขอบสว่าง */
const HOLE_MAX=44; let holes=[], holeTex={};
function holeTexture(kind){
  if(holeTex[kind]) return holeTex[kind];
  const cv=document.createElement('canvas'); cv.width=cv.height=64; const g=cv.getContext('2d');
  if(kind==='sand'){
    const grd=g.createRadialGradient(32,32,2,32,32,30);
    grd.addColorStop(0,'rgba(58,44,28,.85)'); grd.addColorStop(.5,'rgba(96,76,48,.45)'); grd.addColorStop(1,'rgba(120,96,60,0)');
    g.fillStyle=grd; g.beginPath(); g.arc(32,32,30,0,7); g.fill();
  }else{
    const grd=g.createRadialGradient(32,32,1,32,32,26);
    grd.addColorStop(0,'rgba(12,12,14,.95)'); grd.addColorStop(.42,'rgba(20,20,22,.75)');
    grd.addColorStop(.62,'rgba(215,205,190,.55)'); grd.addColorStop(1,'rgba(210,200,185,0)');
    g.fillStyle=grd; g.beginPath(); g.arc(32,32,26,0,7); g.fill();
  }
  const t=new THREE.Texture(cv); t.needsUpdate=true; return (holeTex[kind]=t);
}
function bulletHole(point,normal,kind){
  const size=(kind==='sand')?0.42:0.28;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(size,size),
    new THREE.MeshBasicMaterial({map:holeTexture(kind),transparent:true,depthWrite:false,fog:true}));
  m.position.copy(point).addScaledVector(normal,0.03);
  m.lookAt(point.clone().addScaledVector(normal,1));
  m.rotation.z=Math.random()*6.28;                       // หมุนสุ่ม ไม่ให้ดูซ้ำแบบ
  scene.add(m); holes.push(m);
  while(holes.length>HOLE_MAX){ const old=holes.shift(); scene.remove(old); old.geometry.dispose(); }
}
/* 🚀 รอบ 467: คิวกระสุนที่กำลังเดินทาง — ถึงเวลาแล้วค่อยเกิดผล */
function tickBullets(now){
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i]; if(now<b.at) continue;
    bullets.splice(i,1);
    if(b.env){                                    // 🌍 กระสุนลงพื้น/กำแพง
      const e=b.env, d=camera.position.distanceTo(e.point);
      bulletHole(e.point,e.normal,e.kind);
      if(e.kind==='sand'){ Snd.hitSand(d); dustPuff(e.point); }
      else { Snd.hitWall(d); sparkAt(e.point); dustPuff(e.point); }
      continue;
    }
    const h=b.hit;
    if(h.type==='trg'){ hitTarget(h.obj,h.point); continue; }   // 🎯 รอบ 471: เป้ากระดาษ ไม่มีประกายไฟโลหะ
    sparkAt(h.point);
    if(h.type==='fighter'){ damageFighter(h.obj,b.dmg,now); Snd.ping(); }
    else if(h.type==='mother'){ damageMother(b.msDmg); }
  }
}
/* 💥 ใส่แรงถอย — เรียก "หลัง" คำนวณวิถีกระสุนแล้ว กระสุนจึงไปตรงที่เล็งไว้ตอนลั่นไก
   เล็งผ่านกล้องอยู่ = เด้งน้อยลง (พานท้ายชิดไหล่) · กลั้นหายใจช่วยอีกนิด */
/* 💥 รอบ 466: "แพตเทิร์นแรงถอย" แบบเกมยิงจริง — ยิงรัวติดกันจะเด้งขึ้นตามแบบเดิมทุกครั้ง
   (นัดแรก ๆ ขึ้นตรง → กลางชุดเอียงขวา → ท้ายชุดสะบัดซ้าย) เด็กจึงฝึก "กดสวน" ได้จริง
   เว้นยิงเกิน RECOIL_RESET ms = เริ่มนับชุดใหม่ · สุ่มผสมนิดเดียวเพื่อไม่ให้แข็งเกินไป */
const RECOIL_PAT=[0,.15,.35,.62,.85,.70,.30,-.20,-.62,-.85,-.55,-.10,.35,.70,.55];
const RECOIL_RESET=420;
let shotIdx=0, lastShotAt=0;
function addRecoil(){
  const C=recCfg(), up=C.up, side=C.side;                  /* 💥 รอบ 500: ค่าแยกตามกระบอก */
  const now=performance.now();
  if(now-lastShotAt>RECOIL_RESET) shotIdx=0;
  lastShotAt=now;
  /* ส่องกล้อง = พานท้ายชิดไหล่ + ภาพในเลนส์ขยาย → ลดมุมจริงลงตาม C.ads แต่ "อ่านออก" ชัดกว่าถือปกติ */
  const steady=(1-(1-C.ads)*adsT)*((holdBreath&&breathLeft>0)?0.85:1);
  const climb=Math.min(C.climbMax, 1+shotIdx*C.climb);     // ยิงยิ่งรัว ยิ่งดีดแรงขึ้น
  recPitch+=up*steady*climb;
  const pat=RECOIL_PAT[shotIdx%RECOIL_PAT.length];
  recYaw+=(pat*side*1.45 + rnd(-side,side)*0.15)*steady;
  shotIdx++;
}
/* 🎯 บรรจุกระสุนใหม่ (R93) — เล่นเสียงลูกเลื่อนแล้วเติมเต็มแม็ก */
function startReload(now){
  const W=WEAPONS[weapon];
  if(!W.mag || reloadAt) return;
  reloadAt=now+W.reload;
  renderAmmo();
  Snd.bolt();
  toastBan('🎯 <b>บรรจุกระสุนใหม่…</b>',900);
}
function tickReload(now){
  if(!reloadAt || now<reloadAt) return;
  reloadAt=0; r93Ammo=WEAPONS[weapon].mag||0; renderAmmo(); Snd.bolt();
}
/* สร้างมิสไซล์นำวิถี 1 ลูก (side = เยื้องซ้าย/ขวาจากปากกระบอก · heli = ดาเมจแรงกว่า) */
function launchMissile(now,side,heli){
  const dir=aimDir();
  const right=new THREE.Vector3().crossVectors(dir,new THREE.Vector3(0,1,0)).normalize();
  const start=camera.position.clone().addScaledVector(dir,1.8).addScaledVector(right,side||0).add(new THREE.Vector3(0,-.3,0));
  const m=new THREE.Mesh(new THREE.CylinderGeometry(.13,.20,1.5,7),
    new THREE.MeshPhongMaterial({color:0xd8d8d8,emissive:0x221100,shininess:40}));
  m.position.copy(start); scene.add(m);
  const trail=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffb347,transparent:true,opacity:.9,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  trail.scale.setScalar(2.0); scene.add(trail);
  missiles.push({mesh:m,trail,v:dir.clone().multiplyScalar(MIS_SPD*.55),
                 lock:lockTarget(), born:now, dmg:heli?PH_MIS_DMG:MIS_DMG});
}
/* 🚀 มิสไซล์นำวิถี — ล็อกยานลูกที่อยู่ใกล้กลางจอสุด (ไม่มีก็พุ่งใส่ยานแม่)
   🚁 ตอนขับเฮลิ: ยิงเป็นชุดคู่ (2 ลูก) เติมเร็วกว่า */
function fireMissile(now){
  if(inHeli){
    if(phMisLeft<=0) return;
    const salvo=Math.min(2,phMisLeft);
    for(let k=0;k<salvo;k++){ phMisLeft--; launchMissile(now, k?0.55:-0.55, true); }
    if(phMisLeft<=0) phMisReloadAt=now+PH_MIS_RELOAD;
    renderMissiles(); Snd.missile(); gunRecoil=1.2;
    return;
  }
  if(misLeft<=0) return;
  misLeft--; renderMissiles();
  if(misLeft===0) misReloadAt=now+MIS_RELOAD;
  Snd.missile(); gunRecoil=1.6;
  launchMissile(now,0,false);
}
/* หายานลูกที่ใกล้กลางเป้าเล็งที่สุด (มุมไม่เกิน ~28°) */
function lockTarget(){
  const dir=aimDir(); let best=null, bestDot=Math.cos(0.48);
  fighters.forEach(f=>{
    const to=f.grp.position.clone().sub(camera.position).normalize();
    const d=to.dot(dir);
    if(d>bestDot){ bestDot=d; best=f; }
  });
  return best;
}
/* ตรวจเส้นยิงว่าชนอะไร (ทดสอบทรงกลม = เร็วพอสำหรับมือถือ) */
function rayTarget(origin,dir,maxD){
  let best=null, bestT=maxD;
  fighters.forEach(f=>{
    const t=raySphere(origin,dir,f.grp.position,FIGHTER_SIZE*0.66);   // 📏 รอบ 432: กันชนโตตามลำ (เดิม 4.6 = ลำ 7 ม.)
    if(t!==null && t<bestT){ bestT=t; best={type:'fighter',obj:f,t}; }
  });
  if(msOpen && !msDead && mother){
    /* 🎯 เล็งที่ "แกนพลังงาน" ไม่ใช่ตัวลำ — ลำใหญ่ 2,800m ผู้เล่นจะอยู่ในทรงกลมกันชนของมันเอง
       ทำให้ raySphere คืน null ตลอด (ยิงยานแม่ไม่โดนเลย) */
    const t=raySphere(origin,dir,msCore.position,CORE_R*1.35);
    if(t!==null && t<bestT){ bestT=t; best={type:'mother',obj:mother,t}; }
  }
  /* 🎯 รอบ 471: เป้าฝึกยิง — เช็กเฉพาะตัวที่ "ยังตั้งอยู่ + อยู่ในระยะมองเห็น"
     (12 ตัว ทดสอบทรงกลมอย่างละ 1 ครั้ง = ถูกกว่าการวน solids มาก) */
  for(const t of targets){
    if(!t.up || !t.grp.visible) continue;
    const tt=raySphere(origin,dir,t.c,TRG_R);
    if(tt!==null && tt<bestT){ bestT=tt; best={type:'trg',obj:t,t:tt}; }
  }
  if(best) best.point=origin.clone().addScaledVector(dir,bestT);
  return best;
}
function raySphere(o,d,c,r){
  const oc=new THREE.Vector3().subVectors(o,c);
  const b=oc.dot(d), cc=oc.dot(oc)-r*r, disc=b*b-cc;
  if(disc<0) return null;
  const t=-b-Math.sqrt(disc);
  return t>0?t:null;
}

/* ============================================================
   ⚔️ ดาเมจ / เงื่อนไขชนะ
   ============================================================ */
/* byMe=false → เป็นผลจากการยิงของเพื่อน (sync มาจาก DB) ไม่ให้เหรียญเรา ไม่บันทึกเป็นผลงานเรา */
function damageFighter(f,dmg,now,byMe){
  if(f.dead) return;
  f.hp-=dmg; f.hitAt=now||performance.now();
  if(f.hp>0) return;
  dropFighter(f, byMe!==false);
}
function dropFighter(f,mine){
  if(f.dead) return;
  f.dead=true;
  boom(f.grp.position,1.35,0x8affc0);
  scene.remove(f.grp);
  const i=fighters.indexOf(f); if(i>=0) fighters.splice(i,1);
  if(mine) myKill|=(1<<f.letterIdx);              // 🤝 บันทึกว่าเรายิงลำนี้ → ส่งให้เพื่อนเห็นตรงกัน
  /* 🔴 ตัวอักษรประจำลำนี้บนยานแม่กะพริบ */
  const l=letters[f.letterIdx];
  if(l && !l.down){
    l.down=true; l.blinkUntil=performance.now()+2600;
    setLetterLit(l,true);
    if(mine){
      if(typeof addCoins==='function') addCoins(LETTER_COIN);
      sessionCoins+=LETTER_COIN; renderCoins();
      if(typeof sfx!=='undefined'&&sfx.coin) sfx.coin();
      toastBan(`💥 ยิงตก! ตัวอักษร <b>${l.ch.toUpperCase()}</b> กะพริบแล้ว<br><span class="ib-coin">+${LETTER_COIN} 🪙</span>`,1200);
    }else{
      toastBan(`🤝 เพื่อนยิงตก! ตัวอักษร <b>${l.ch.toUpperCase()}</b> กะพริบแล้ว`,1100);
    }
    renderWord();
  }
  if(!fighters.length && !msOpen) openMothership();
}
/* ✨ ยานลูกหมด → ตัวอักษรกะพริบทั้งแถว + เกราะยานแม่เปิด */
function openMothership(){
  msOpen=true; msArmor=MS_HP;
  letters.forEach(l=>{ l.blinkUntil=performance.now()+4200; });
  if(msGlow) msGlow.material.opacity=.55;
  if(msCore) msCore.material.color.setHex(0xff5a2a);
  toastBan('✨ <b>ยานลูกหมดแล้ว!</b> ตัวอักษรกะพริบทั้งแถว<br><span class="ib-sub">เกราะยานแม่เปิด — ระดมยิง 🔫 และมิสไซล์ 🚀 ใส่แกนสีแดงเลย!</span>',2600);
  renderTarget();
  if(typeof sfx!=='undefined'&&sfx.levelup) sfx.levelup();
}
function damageMother(dmg){
  if(!msOpen||msDead) return;
  myArmorDmg+=dmg;                      // 🤝 สะสมดาเมจ "ของเรา" — เกราะจริงคำนวณรวมกับของเพื่อนใน applyShared
  applyShared();
}
function killMother(){
  msDead=true;
  /* ระเบิดเป็นชุด — ระเบิดที่ "แกนพลังงาน" (ใกล้ผู้เล่น เห็นชัด) แล้วลามขึ้นไปทั้งลำ */
  const c=msCore.position.clone();
  for(let i=0;i<12;i++){
    setTimeout(()=>{ if(!running) return;
      const up=i/11;                                   // ไล่จากแกนขึ้นไปหาท้องยาน
      boom(c.clone().add(new THREE.Vector3(rnd(-90,90)*(1+up*6), up*(MS_Y-MS_R*0.30-CORE_Y), rnd(-70,70)*(1+up*6))),
           2.2+i*.55, i%2?0xff8a3a:0xfff0a0);
    }, i*210);
  }
  setTimeout(()=>{ if(running) flashScreen(); },1900);
  setTimeout(()=>{ if(running) completeWord(); },2500);
}
function flashScreen(){
  if(!flashEl) return;
  flashEl.classList.add('on');
  setTimeout(()=>flashEl&&flashEl.classList.remove('on'),120);
}

/* ============================================================
   📖 คำศัพท์ + รอบเล่น
   ============================================================ */
/* 🤝 หัวหน้าห้อง = uid น้อยสุดในแมพ (คนเดียวก็เป็นหัวหน้าเอง) — มีสิทธิ์ "เลือกคำ" ให้ทั้งห้อง */
function myUid(){ return (typeof onlineKey==='function')?onlineKey():'me'; }
function leaderUid(){
  let lead=myUid();
  for(const uid in peers) if(uid<lead) lead=uid;
  return lead;
}
function isLeader(){ return leaderUid()===myUid(); }
function pickWord(){
  if(!isLeader()) return;                       // ลูกทีมรอรับคำจากหัวหน้าผ่าน DB (adoptWord)
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  let pool=vocabForStudent().filter(([en])=>/^[a-z]{3,8}$/i.test(en))
    .filter(([en])=>!state[DONE_KEY].includes(en.toLowerCase()));
  if(!pool.length){ state[DONE_KEY]=[]; saveState();
    pool=vocabForStudent().filter(([en])=>/^[a-z]{3,8}$/i.test(en)); }
  if(!pool.length) pool=[['alien','มนุษย์ต่างดาว']];
  const [en,th]=pool[(Math.random()*pool.length)|0];
  setWord(en.toLowerCase(), th, battleRound+1);
  netSend(true);                                // ประกาศคำใหม่ให้ทั้งห้องทันที
}
/* ตั้งคำ+เลขรอบ แล้วเริ่มเวฟ (ใช้ทั้งหัวหน้าและลูกทีม) */
function setWord(en,th,round){
  battleRound=round;
  myKill=0; myArmorDmg=0;                       // ผลงานรอบใหม่เริ่มจากศูนย์
  word={en,th};
  layoutLetterPanels();
  renderWord();
  startWave();
}
/* ลูกทีมรับคำจากหัวหน้า */
function adoptWord(cw){
  if(!cw) return;
  const [en,th,r]=String(cw).split('|');
  const round=parseInt(r||'0',10)||0;
  if(!en || round===battleRound) return;
  setWord(en,th||'',round);
  toastBan(`🤝 <b>เข้าร่วมสมรภูมิเดียวกับเพื่อน!</b><br><span class="ib-sub">เป้าหมายร่วม: ${en.toUpperCase()}</span>`,2200);
}
/* 🤝 รวมผลงานทุกคน → สถานะยานลูก/เกราะยานแม่ตรงกันทุกเครื่อง (เรียกทุกเฟรม ราคาถูก) */
function applyShared(){
  /* ลูกทีม: ตามคำของหัวหน้า */
  if(!isLeader()){
    const p=peers[leaderUid()];
    if(p&&p.cw) adoptWord(p.cw);
  }
  /* รวมบิตยานลูกที่ถูกยิงตก + ดาเมจยานแม่ (เฉพาะรอบปัจจุบัน) */
  let mask=myKill, dmg=myArmorDmg;
  for(const uid in peers){
    const p=peers[uid];
    if(p.round===battleRound){ mask|=(p.kill||0); dmg+=(p.armor||0); }
  }
  /* ยานลูกที่เพื่อนยิงตกแล้ว แต่เครื่องเรายังมีอยู่ → เอาออกให้ตรงกัน */
  if(mask) fighters.slice().forEach(f=>{ if(mask&(1<<f.letterIdx)) dropFighter(f,false); });
  /* เกราะยานแม่ = พลังเต็ม ลบดาเมจรวมของทุกคน */
  if(msOpen&&!msDead){
    const a=Math.max(0,MS_HP-dmg);
    if(Math.abs(a-msArmor)>0.01){ msArmor=a; renderTarget(); }
    if(a<=0) killMother();
  }
}
function startWave(){
  fighters.slice().forEach(f=>scene.remove(f.grp)); fighters=[];
  msOpen=false; msDead=false; msArmor=MS_HP; msRecover=false;
  if(msGlow) msGlow.material.opacity=0;
  if(msCore) msCore.material.color.setHex(0x3a0d0d);
  if(mother){ mother.visible=true; mother.scale.setScalar(1); mother.position.y=MS_Y; }
  if(msBoard) msBoard.visible=true;                          // แผง/แกน แยกจากลำยานแล้ว ต้องสั่งโชว์/ซ่อนเอง
  if(msCore) msCore.visible=true;
  if(msGlow) msGlow.visible=true;
  letters.forEach(l=>{ l.down=false; l.blinkUntil=0; setLetterLit(l,false); l.mesh.material.opacity=1; });
  word.en.split('').forEach((ch,i)=>makeFighter(i));
  renderTarget();
  toastBan(`🛸 <b>ยานแม่แสดงคำว่า ${word.en.toUpperCase()}</b><br><span class="ib-sub">ยานลูก ${word.en.length} ลำบินออกมาแล้ว — ยิงให้ตกทุกลำ!</span>`,2600);
}
function completeWord(){
  const w=word;
  state[DONE_KEY].push(w.en);
  if(typeof addCoins==='function') addCoins(REWARD);
  sessionCoins+=REWARD; sessionWords++; renderCoins();
  if(typeof questEvent==='function') questEvent('word3d');
  if(typeof vbRecord==='function') vbRecord(w.en,w.th,true);
  if(typeof sfx!=='undefined'&&sfx.levelup) sfx.levelup();
  setTimeout(()=>{ if(typeof speakWord==='function') speakWord(w.en); },600);
  if((state.invasionBest||0)<sessionWords){ state.invasionBest=sessionWords; }
  toastBan(`🎉 <b>${escapeHTML(w.en.toUpperCase())} = ${escapeHTML(w.th)}</b><br><span class="ib-coin">+${REWARD} 🪙</span><span class="ib-sub">ยานแม่ลำใหม่กำลังเคลื่อนเข้ามา…</span>`,3000);
  saveState();
  /* 🛸 รอบ 439 (ผู้ใช้: "ยานแม่ลอยใหญ่ๆ ต่ำๆ ค้างไว้ เหมือน ID4 — ตอนนี้ไปไหนอีกแล้ว"):
     ต้นตอที่ลำหายคือบรรทัดนี้เอง — ยิงสำเร็จแล้วเคย `mother.visible=false` รอลำใหม่ 3.2 วิ
     (และถ้าหัวหน้าห้องยังไม่ประกาศคำใหม่ ลำจะหายยาวกว่านั้นอีก) → **ลำอยู่ค้างฟ้าเสมอ ไม่หายไปไหน**
     แค่ "ดับไฟ/มืดลงชั่วคราว" แล้วสว่างกลับตอนคำใหม่มา */
  msRecover=true;
  if(msBoard) msBoard.visible=true;
  letters.forEach(l=>setLetterLit(l,false));
  if(msCore) msCore.visible=false;                           // แกนพลังงานระเบิดไปแล้ว (โผล่ใหม่พร้อมคำถัดไป)
  if(msGlow) msGlow.visible=false;
  /* 🤝 หัวหน้าห้องเป็นคนเปิดยานแม่ลำใหม่ให้ทั้งห้อง · ลูกทีมรอรับคำผ่าน DB */
  setTimeout(()=>{ if(running && isLeader()) pickWord(); },3200);
}

/* ============================================================
   🖥️ HUD
   ============================================================ */
function renderWord(){
  if(!word||!wordEl) return;
  const chips=word.en.split('').map((ch,i)=>
    `<span class="ic${letters[i]&&letters[i].down?' down':''}">${ch.toUpperCase()}</span>`).join('');
  const left=fighters.length;
  wordEl.innerHTML=`<div class="iw-chips">${chips}</div>`
    +`<span class="iw-th">${escapeHTML(word.th)}</span>`
    +`<span class="iw-tip">${msOpen?'🎯 เกราะเปิดแล้ว — ระดมยิงยานแม่!':`👾 เหลือยานลูก ${left} ลำ`}</span>`;
}
function renderTarget(){
  if(!tgtEl) return;
  if(msOpen&&!msDead){
    tgtEl.innerHTML=`<div class="inv-lb">🛸 เกราะยานแม่</div>
      <b>${Math.ceil(msArmor)}%</b>
      <div class="inv-bar" id="inv-msbar"><span style="width:${msArmor}%"></span></div>`;
  }else{
    tgtEl.innerHTML=`<div class="inv-lb">👾 ยานลูกที่เหลือ</div><b>${fighters.length} ลำ</b>`;
  }
  renderWord();
}
function renderCoins(){ if(coinsEl) coinsEl.textContent='🪙 +'+(typeof fmtNum==='function'?fmtNum(sessionCoins):sessionCoins); }
function renderHp(){
  if(!hpEl) return;
  const k=Math.max(0,hp)/PLAYER_HP;
  hpEl.firstElementChild.style.width=(k*100).toFixed(0)+'%';
  hpEl.classList.toggle('low',k<0.35);
}
function renderHeat(){
  if(!heatEl) return;
  heatEl.firstElementChild.style.width=heat.toFixed(0)+'%';
  heatEl.classList.toggle('over',overheat);
  if(crossEl) crossEl.classList.toggle('hot',overheat);
}
function renderMissiles(){
  if(!misEl) return;
  const max=inHeli?PH_MIS_MAX:MIS_MAX, left=inHeli?phMisLeft:misLeft;   // เฮลิพกจรวดเยอะกว่า
  let h='';
  for(let i=0;i<max;i++) h+=`<i class="${i<left?'':'spent'}"></i>`;
  misEl.innerHTML=h;
  if(rocketBtn) rocketBtn.disabled=left<=0;
}
let banTimer=0;
function toastBan(html,ms){
  if(!banEl) return;
  banEl.innerHTML=html; banEl.classList.add('show');
  clearTimeout(banTimer);
  banTimer=setTimeout(()=>banEl&&banEl.classList.remove('show'),ms||1600);
}

/* ============================================================
   🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
   ============================================================ */
function bindInput(){
  /* จอยเดินซ้าย */
  joyEl.addEventListener('touchstart',e=>{ const t=e.changedTouches[0];
    joy.id=t.identifier; const r=joyEl.getBoundingClientRect();
    joy.cx=r.left+r.width/2; joy.cy=r.top+r.height/2; moveJoy(t); e.preventDefault(); },{passive:false});
  /* ลากครึ่งขวาของจอ = เล็ง */
  wrapEl.addEventListener('touchstart',e=>{
    for(const t of e.changedTouches){
      if(t.identifier===joy.id) continue;
      if(t.target.closest('button')) continue;
      if(t.clientX>window.innerWidth*0.4 && lookId===null){
        lookId=t.identifier; lookX=t.clientX; lookY=t.clientY;
      }
    }
    resumeAudio();
  },{passive:true});
  wrapEl.addEventListener('touchmove',e=>{
    for(const t of e.changedTouches){
      if(t.identifier===joy.id){ moveJoy(t); e.preventDefault(); }
      else if(t.identifier===lookId){
        const sc=1-(1-SNIPER_SENS)*adsT;
        yaw-=(t.clientX-lookX)*PAD_SENS*sc; pitch-=(t.clientY-lookY)*PAD_SENS*sc;
        pitch=clamp(pitch,PITCH_MIN,PITCH_MAX);
        lookX=t.clientX; lookY=t.clientY; e.preventDefault();
      }
    }
  },{passive:false});
  const endTouch=e=>{
    for(const t of e.changedTouches){
      if(t.identifier===joy.id){ joy.id=null; joy.dx=joy.dy=0; joyKnob.style.transform=''; }
      if(t.identifier===lookId) lookId=null;
    }
  };
  wrapEl.addEventListener('touchend',endTouch); wrapEl.addEventListener('touchcancel',endTouch);
  /* ปุ่มยิง (กดค้าง = ยิงรัว) */
  const hold=(el,on,off)=>{
    el.addEventListener('touchstart',e=>{ on(); e.preventDefault(); },{passive:false});
    el.addEventListener('touchend',e=>{ off&&off(); e.preventDefault(); },{passive:false});
    el.addEventListener('mousedown',()=>on());
    el.addEventListener('mouseup',()=>off&&off());
    el.addEventListener('mouseleave',()=>off&&off());
  };
  hold(fireBtn,()=>{ firing=true; resumeAudio(); },()=>{ firing=false; firedThisPress=false; });
  hold(fire2Btn,()=>{ firing=true; resumeAudio(); },()=>{ firing=false; firedThisPress=false; });   // 🔫 ปุ่มยิงเหนือจอย (รอบ 433)
  rocketBtn.addEventListener('click',()=>fireMissile(performance.now()));
  runBtn.addEventListener('click',()=>{ isRun=!isRun; runBtn.classList.toggle('on',isRun); });
  /* 🚁 ขึ้น/ลงเฮลิ + ไต่ระดับ (กดค้าง) */
  heliBtn.addEventListener('click',()=>{ resumeAudio();
    if(riding) dismountGunner();            // 🎖️ นั่งเป็นพลปืนอยู่ → ปุ่มนี้ = กระโดดลง
    else if(inHeli) exitHeli(); else enterHeli(); });
  /* ปุ่ม 🚁 เปลี่ยนหน้าตาตามสถานะ: 🚁 ขึ้นขับ / 🪂 ลงจากเครื่อง (ทั้งนักบินและพลปืน) */
  const syncHeliBtn=()=>{ const fly=inHeli||riding;
    heliBtn.textContent=fly?'🪂':'🚁'; heliBtn.classList.toggle('flying',!!fly); };
  ['click'].forEach(()=>0);
  heliBtn.addEventListener('click',()=>setTimeout(syncHeliBtn,0));
  gunnerBtn.addEventListener('click',()=>setTimeout(syncHeliBtn,0));
  gunnerBtn.addEventListener('click',()=>{ resumeAudio(); boardGunner(); });
  /* 🎯 สลับปืน + ส่องกล้อง */
  swapBtn.addEventListener('click',()=>{ resumeAudio(); swapWeapon(); });
  scopeBtn.addEventListener('click',()=>{ resumeAudio(); setScoped(!scoped); });
  magBtn.addEventListener('click',()=>{ resumeAudio(); cycleScopeMag(); });
  /* 🫁 กลั้นหายใจ: กดค้าง = ปืนนิ่ง (มีลิมิต หมดแล้วต้องผ่อน) */
  hold(breathBtn,()=>{ if(breathLeft>0) holdBreath=true; },()=>{ holdBreath=false; });
  hold(upBtn,()=>{ phClimb=1; },()=>{ phClimb=0; });
  hold(downBtn,()=>{ phClimb=-1; },()=>{ phClimb=0; });
  /* 💬 แชทสำเร็จรูป */
  /* 🗺️ แผนที่เลือกจุดลงสนาม */
  mapBtn.addEventListener('click',()=>{ resumeAudio(); openSpawnMap(); });
  const pickAt=(clientX,clientY)=>{
    const r=mapCv.getBoundingClientRect();
    const mx=(clientX-r.left)/r.width*mapCv.width, my=(clientY-r.top)/r.height*mapCv.height;
    mapPick=mapToWorld(mx,my,mapCv.width,mapCv.height);
    if(mapNameEl) mapNameEl.textContent=zoneName(mapPick.x,mapPick.z);
    drawSpawnMap();
  };
  mapCv.addEventListener('click',e=>pickAt(e.clientX,e.clientY));
  mapCv.addEventListener('touchstart',e=>{ const t=e.changedTouches[0]; pickAt(t.clientX,t.clientY); e.preventDefault(); },{passive:false});
  document.getElementById('inv-mapgo').addEventListener('click',applySpawnPick);
  /* 🎯 รอบ 431: วนเลือก "จุดสูงข่ม" ที่คำนวณจากเนินเขาจริง (กดซ้ำ = จุดถัดไป) */
  document.getElementById('inv-mapsnipe').addEventListener('click',()=>{
    if(!sniperSpots.length) return;
    snipeIdx=(snipeIdx+1)%sniperSpots.length;
    const s=sniperSpots[snipeIdx];
    mapPick={x:s.x,z:s.z};
    if(mapNameEl) mapNameEl.textContent=zoneName(s.x,s.z);
    drawSpawnMap();
  });
  document.getElementById('inv-maprand').addEventListener('click',()=>{
    const a=rnd(0,TAU), r=rnd(20,WORLD*0.7);
    mapPick={x:Math.cos(a)*r, z:Math.sin(a)*r};
    if(mapNameEl) mapNameEl.textContent=zoneName(mapPick.x,mapPick.z);
    drawSpawnMap();
  });
  chatBtn.addEventListener('click',()=>{
    if(!chatBarEl.childElementCount){
      CHAT_PRESETS.forEach(t=>{ const b=document.createElement('button'); b.textContent=t;
        b.addEventListener('click',()=>{ sendChat(t); chatBarEl.classList.remove('on'); }); chatBarEl.appendChild(b); });
    }
    chatBarEl.classList.toggle('on');
  });
  /* คอม: คลิกจอ = ล็อกเมาส์ */
  cvEl.addEventListener('mousedown',e=>{
    resumeAudio();
    if(document.pointerLockElement!==cvEl){ cvEl.requestPointerLock&&cvEl.requestPointerLock(); return; }
    if(e.button===0) firing=true;
    else if(e.button===2){ if(WEAPONS[weapon].scope && !inHeli && !riding) setScoped(!scoped); else fireMissile(performance.now()); }
  });
  window.addEventListener('mouseup',()=>{ firing=false; firedThisPress=false; });
  cvEl.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('mousemove',e=>{
    if(!running||document.pointerLockElement!==cvEl) return;
    const sc=1-(1-SNIPER_SENS)*adsT;      // ยิ่งแนบตา ยิ่งเล็งละเอียดขึ้นแบบไล่ระดับ
    yaw-=e.movementX*LOOK_SENS*sc; pitch-=e.movementY*LOOK_SENS*sc;
    pitch=clamp(pitch,PITCH_MIN,PITCH_MAX);
  });
}
function moveJoy(t){
  const r=joyEl.getBoundingClientRect(), R=r.width/2;
  let dx=t.clientX-(r.left+R), dy=t.clientY-(r.top+R);
  const d=Math.hypot(dx,dy);
  if(d>R){ dx*=R/d; dy*=R/d; }
  joy.dx=dx/R; joy.dy=dy/R;
  joyKnob.style.transform=`translate(${dx}px,${dy}px)`;
}
function unlockMouse(){ if(document.pointerLockElement) document.exitPointerLock&&document.exitPointerLock(); }

/* ============================================================
   🚶 ผู้เล่น + AI + ลูป
   ============================================================ */
function tickPlayer(dt,now){
  let f=0,s=0;
  if(keys.w) f+=1; if(keys.s) f-=1;
  if(keys.a) s-=1; if(keys.d) s+=1;
  f-=joy.dy; s+=joy.dx;
  const run=isRun||keys.shift;
  let spd=(run?RUN:WALK);
  const len=Math.hypot(f,s);
  moveLen=len;                                   // 🏃 รอบ 448: ท่าวิ่งต้องรู้ว่ากำลังขยับอยู่ไหม
  if(len>1){ f/=len; s/=len; }
  const sinY=Math.sin(yaw), cosY=Math.cos(yaw);
  const dirX=(-sinY*f + cosY*s), dirZ=(-cosY*f - sinY*s);
  /* ⛰️ รอบ 431: ความชันมีผลจริง — วิ่งขึ้นเนินช้าลง ลงเนินไหลเร็วขึ้น
     (วัดความชันข้างหน้า 2 เมตรตามทิศที่กำลังไป) */
  if(len>.05){
    const ahead=2.0/Math.max(.001,Math.hypot(dirX,dirZ));
    const slope=(terrainH(px+dirX*ahead,pz+dirZ*ahead)-terrainH(px,pz))/2.0;
    spd*=clamp(1-slope*1.35, 0.52, 1.22);
  }
  let nx=px+dirX*spd*dt;
  let nz=pz+dirZ*spd*dt;
  /* กันทะลุตึก */
  for(const o of solids){
    const dx=nx-o.x, dz=nz-o.z, d=Math.hypot(dx,dz);
    if(d<o.r+.6){ const k=(o.r+.6)/(d||.001); nx=o.x+dx*k; nz=o.z+dz*k; }
  }
  /* 🏠 ผนังบ้าน: ชนแล้ว "ไถลตามผนัง" (ลองแยกแกน) — ประตู/ช่องว่างเดินผ่านได้ตามปกติ */
  if(houses.length && houseBlocked(nx,nz)){
    if(!houseBlocked(nx,pz)) nz=pz;
    else if(!houseBlocked(px,nz)) nx=px;
    else { nx=px; nz=pz; }
  }
  const lim=WORLD*0.94;
  px=clamp(nx,-lim,lim); pz=clamp(nz,-lim,lim);
  /* 🛡️ อยู่ในบ้าน = ที่กำบัง (ลดดาเมจ + ขึ้นป้ายบอกเด็ก) */
  const cov=!inHeli&&!riding&&houseCover(px,pz);
  if(cov!==inCover){ inCover=cov; if(coverEl) coverEl.classList.toggle('on',cov); }
  py=terrainH(px,pz)+EYE;
  /* หัวโยกตอนเดิน (ให้รู้สึกเป็นทหารเดินจริง) */
  const bob=(len>.05? Math.sin(now*(run?.016:.011))*(run?.09:.055) : 0);
  camera.position.set(px,py+bob,pz);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);
  /* 🫁 รอบ 449: วิ่งนานแล้วเหนื่อย — จอโยกช้าๆ ตามจังหวะหายใจ (ยิ่งเหนื่อยยิ่งโยก) */
  if(fatigue>0.02){
    camera.position.y+=Math.sin(now*.0052)*.045*fatigue;
    camera.rotateZ(Math.sin(now*.0041)*.012*fatigue);
    camera.rotateX(Math.sin(now*.0063)*.009*fatigue);
  }
  /* สั่นจอตอนระเบิด */
  if(shake>0.001){
    camera.position.x+=rnd(-1,1)*shake*.35;
    camera.position.y+=rnd(-1,1)*shake*.35;
    shake=Math.max(0,shake-dt*2.2);
  }
  /* ปืน: รีคอยล์ + แกว่งตามการเดิน
     🎬 แกว่งเก็บไว้ใน userData แล้วให้ tickAds() เป็นคนประกอบท่าจริง (ยิ่งเล็งยิ่งแกว่งน้อย) */
  if(gunGrp){
    gunRecoil=Math.max(0,gunRecoil-dt*recCfg().gunBack);   /* 💥 รอบ 500: R93 คืนช้า/ไรเฟิลคืนไว */
    /* 🤝 รอบ 501: การแกว่งย้ายไปที่ tickSway() ทั้งหมด (จังหวะก้าว+หายใจ+เหนื่อย) แล้ว
       ช่องนี้เหลือไว้ให้ระบบอื่นยืมใส่ออฟเซ็ตชั่วคราวได้ — ปกติเป็น 0 ไม่มีคลื่นซ้อน */
    gunGrp.userData.swayX=0;
    gunGrp.userData.swayY=0;
  }
  tickAds(dt,now);                                // 🎬 ยกปืนเล็ง/ถอยออก + ขอบเลนส์ + หายใจ
  applyBreath(now);
  applyGasp();                                    // 🫁💨 รอบ 508: กล้องตกตอนลมหมดคาปุ่ม
  applyRecoil(dt);
  if(muzzle) muzzle.material.opacity = now<muzzleUntil?1:0;
  /* ความร้อนปืน */
  if(!firing||overheat) heat=Math.max(0,heat-GUN_COOL*dt);
  if(overheat&&heat<=2) overheat=false;
  renderHeat();
  /* เติมมิสไซล์ */
  if(misLeft<=0&&misReloadAt&&now>misReloadAt){ misLeft=MIS_MAX; misReloadAt=0; renderMissiles();
    toastBan('🚀 <b>เติมมิสไซล์เต็มแล้ว!</b>',900); }
  /* ฟื้นพลังเมื่อไม่โดนยิงสักพัก (โลก 3D ไม่มีเกมโอเวอร์) */
  if(now-lastHurt>3500&&hp<PLAYER_HP){ hp=Math.min(PLAYER_HP,hp+SHIELD_REGEN*dt*10); renderHp(); }
  if(firing) fireGun(now);
}
function hurtPlayer(dmg,now){
  if(now-lastHurt<HURT_IFRAME) return;
  if(inCover) dmg*=HOUSE_COVER;                   // 🏠 รอบ 431: หลบอยู่ในบ้าน = โดนเบาลงมาก
  lastHurt=now; hp-=dmg;
  Snd.hit();
  if(hurtEl){ hurtEl.classList.add('on'); setTimeout(()=>hurtEl&&hurtEl.classList.remove('on'),260); }
  shake=Math.min(1.2,shake+.30);
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate(70);
  if(hp<=0){
    /* ไม่มีตาย — ถอยกลับแนวหลังไปตั้งหลัก แล้วพลังฟื้นเต็ม */
    hp=PLAYER_HP;
    if(riding) dismountGunner(true);              // 🎖️ พลปืนพลังหมด = ร่วงลงพื้นแล้วตั้งหลักใหม่
    px=rnd(-20,20); pz=WORLD*0.55; py=terrainH(px,pz)+(inHeli?40:EYE);
    if(inHeli) phVel={x:0,y:0,z:0};
    toastBan('🛡️ <b>ถอยไปตั้งหลัก!</b><br><span class="ib-sub">หน่วยแพทย์ฟื้นพลังให้เต็มแล้ว — กลับเข้าไปสู้ต่อได้เลย</span>',2200);
  }
  renderHp();
}

/* ============================================================
   🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
   กด 🚁 = พุ่งขึ้นฟ้าเป็นเฮลิ · บินยิงปืนกล+จรวดชุดคู่จากมุมสูง · กด 🪂 = ลงพื้นเป็นทหารราบ
   มุมมองจากในห้องนักบิน (กรอบ canopy DOM) — ไม่ต้องมีโมเดลลำ (เราคือลำ)
   ============================================================ */
/* ============================================================
   🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
   วาดมุมมองจากด้านบน: ถนนสมรภูมิ · ตึก (จาก solids) · แนวกำบัง · ตำแหน่งเพื่อน · เงายานแม่
   แตะที่ไหนก็ได้ = ลงตรงนั้น (กันไม่ให้ทับตึก)
   ============================================================ */
const MAP_VIEW=WORLD*0.98;                      // ครึ่งความกว้างโลกที่แผนที่ครอบคลุม
function mapToWorld(mx,my,w,h){ return {x:(mx/w-.5)*2*MAP_VIEW, z:(my/h-.5)*2*MAP_VIEW}; }
function worldToMap(x,z,w,h){ return {mx:(x/(2*MAP_VIEW)+.5)*w, my:(z/(2*MAP_VIEW)+.5)*h}; }
function zoneName(x,z){
  for(const pd of pads) if(Math.hypot(x-pd.x,z-pd.z)<18) return '🚁 ลานจอดเฮลิคอปเตอร์ (เดินขึ้นเครื่องได้)';
  for(const hs of houses) if(Math.hypot(x-hs.grp.position.x,z-hs.grp.position.z)<HOUSE_SIZE*0.8)
    return '🏠 บ้านร้าง (วิ่งเข้าไปหลบยิงได้)';
  for(const s of sniperSpots) if(Math.hypot(x-s.x,z-s.z)<45)
    return `🎯 จุดสูงข่ม (สูง ${Math.round(s.e)} ม. — ซุ่มยิงชั้นดี)`;
  if(Math.abs(x)<STREET_HW+6 && z<STREET_Z0+6 && z>STREET_Z0-STREET_LEN) return '🏚️ ถนนสมรภูมิ (ใจกลางการรบ)';
  if(z>STREET_Z0) return '🛡️ แนวหลัง (ปลอดภัย เริ่มใหม่ได้)';
  if(Math.hypot(x,z)<120) return '🎯 ใกล้แกนพลังงานยานแม่';
  return '🏜️ ทะเลทรายรอบเมือง';
}
/* ⛰️ รอบ 430: ชั้นภูมิประเทศ (เนินเขา/ลาดชัน) — คำนวณหนักอยู่บ้าง จึงวาดลง canvas ซ่อนไว้ "ครั้งเดียว"
   แล้วเอาไป blit ทุกครั้งที่ redraw (ผู้เล่นแตะเลือกจุดถี่ๆ ต้องไม่หน่วง) */
let mapShade=null;
function buildMapShade(w,h){
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  const g=c.getContext('2d'), STEP=4, D=9;      // D = ระยะวัดความชัน (เมตร)
  for(let py=0;py<h;py+=STEP)for(let pxx=0;pxx<w;pxx+=STEP){
    const p=mapToWorld(pxx+STEP/2,py+STEP/2,w,h);
    const e=terrainH(p.x,p.z);
    const gx=terrainH(p.x+D,p.z)-terrainH(p.x-D,p.z);
    const gz=terrainH(p.x,p.z+D)-terrainH(p.x,p.z-D);
    const lit=Math.max(-1,Math.min(1,-(gx+gz)/7));             // แสงส่องจากทิศเหนือ-ตะวันตก
    const t=Math.max(0,Math.min(1,(e+10)/48));                 // ต่ำ→สูง
    /* เส้นชั้นความสูงทุก 6 เมตร: ที่ลาดชันเส้นจะถี่เอง = อ่านความชันได้ทันที */
    const band=((e/6)%1+1)%1, cont=band<0.13?1:0;
    let r=172+t*74+lit*28, gg=146+t*70+lit*25, b=112+t*58+lit*20;
    if(cont){ r-=24; gg-=22; b-=17; }
    g.fillStyle=`rgb(${r|0},${gg|0},${b|0})`;
    g.fillRect(pxx,py,STEP,STEP);
  }
  return c;
}
function drawSpawnMap(){
  if(!mapCv) return;
  const w=mapCv.width, h=mapCv.height, g=mapCv.getContext('2d');
  if(terrainH){
    if(!mapShade || mapShade.width!==w) mapShade=buildMapShade(w,h);
    g.drawImage(mapShade,0,0);
  } else { g.fillStyle='#cbb08c'; g.fillRect(0,0,w,h); }
  /* เงายานแม่คลุมฟ้า (วงใหญ่จางๆ) */
  const ms=worldToMap(0,MS_Z,w,h), msr=MS_R/(2*MAP_VIEW)*w;
  const grd=g.createRadialGradient(ms.mx,ms.my,0,ms.mx,ms.my,msr);
  grd.addColorStop(0,'rgba(20,24,34,.55)'); grd.addColorStop(1,'rgba(20,24,34,0)');
  g.fillStyle=grd; g.beginPath(); g.arc(ms.mx,ms.my,msr,0,TAU); g.fill();
  /* ถนนสมรภูมิ */
  const a=worldToMap(-STREET_HW,STREET_Z0-STREET_LEN,w,h), b=worldToMap(STREET_HW,STREET_Z0,w,h);
  g.fillStyle='#a8926e'; g.fillRect(a.mx,a.my,b.mx-a.mx,b.my-a.my);
  /* ตึก */
  g.fillStyle='#8d7f6b';
  solids.forEach(o=>{ const p=worldToMap(o.x,o.z,w,h), r=Math.max(1.5,o.r/(2*MAP_VIEW)*w);
    g.fillRect(p.mx-r,p.my-r,r*2,r*2); });
  /* แนวกำบัง (จุดเขียว) */
  g.fillStyle='#3fbf62';
  sandbagWalls().forEach(s=>{ const p=worldToMap(s.x,s.z,w,h);
    g.beginPath(); g.arc(p.mx,p.my,5,0,TAU); g.fill(); });
  /* 🏠 รอบ 431: บ้านที่วิ่งเข้าไปหลบได้ */
  houses.forEach(hs=>{
    const p=worldToMap(hs.grp.position.x,hs.grp.position.z,w,h), r=HOUSE_SIZE/(2*MAP_VIEW)*w*0.6;
    g.fillStyle='#6f5a3f'; g.fillRect(p.mx-r,p.my-r,r*2,r*2);
    g.strokeStyle='#ffd98a'; g.lineWidth=2; g.strokeRect(p.mx-r,p.my-r,r*2,r*2);
    g.fillStyle='#ffd98a'; g.font='bold 13px system-ui'; g.textAlign='center';
    g.fillText('🏠',p.mx,p.my+5);
  });
  /* 🚁 รอบ 434: จุดจอดเฮลิคอปเตอร์ (เลือกเกิดข้างลำได้เลย) */
  pads.forEach(pd=>{
    const p=worldToMap(pd.x,pd.z,w,h);
    g.fillStyle='rgba(20,60,90,.85)'; g.strokeStyle='#7fe3ff'; g.lineWidth=2;
    g.beginPath(); g.arc(p.mx,p.my,10,0,TAU); g.fill(); g.stroke();
    g.font='bold 12px system-ui'; g.textAlign='center'; g.fillStyle='#eaffff';
    g.fillText('🚁',p.mx,p.my+4.5);
  });
  /* 🎯 รอบ 431: จุดสูงข่มบนเนินเขา (ที่ซุ่มยิงชั้นดี) */
  sniperSpots.forEach(s=>{
    const p=worldToMap(s.x,s.z,w,h);
    g.strokeStyle='#7dffb0'; g.lineWidth=2;
    g.beginPath(); g.arc(p.mx,p.my,9,0,TAU); g.stroke();
    g.font='bold 13px system-ui'; g.textAlign='center';
    g.fillStyle='#0e1a28'; g.fillText('🎯',p.mx+.5,p.my+5.5);
    g.fillStyle='#eaffef'; g.fillText('🎯',p.mx,p.my+5);
  });
  /* แกนพลังงานยานแม่ (เป้าหมาย) */
  const cp=worldToMap(0,CORE_Z,w,h);
  g.strokeStyle='#ff4a3a'; g.lineWidth=2.5;
  g.beginPath(); g.arc(cp.mx,cp.my,9,0,TAU); g.stroke();
  g.beginPath(); g.moveTo(cp.mx-13,cp.my); g.lineTo(cp.mx+13,cp.my);
  g.moveTo(cp.mx,cp.my-13); g.lineTo(cp.mx,cp.my+13); g.stroke();
  /* เพื่อนออนไลน์ */
  for(const uid in peers){
    const p=peers[uid], q=worldToMap(p.cur.x,p.cur.z,w,h);
    g.fillStyle=p.kind==='heli'?'#4fc3f7':'#ffd54f';
    g.beginPath(); g.arc(q.mx,q.my,5,0,TAU); g.fill();
    g.strokeStyle='#0e1a28'; g.lineWidth=1.5; g.stroke();
  }
  /* ตำแหน่งที่เลือก */
  if(mapPick){
    const q=worldToMap(mapPick.x,mapPick.z,w,h);
    g.strokeStyle='#fff'; g.lineWidth=3;
    g.beginPath(); g.arc(q.mx,q.my,11,0,TAU); g.stroke();
    g.fillStyle='#7dffb0'; g.beginPath(); g.arc(q.mx,q.my,5,0,TAU); g.fill();
  }
  /* กรอบ + ทิศ */
  g.strokeStyle='rgba(20,30,45,.8)'; g.lineWidth=2; g.strokeRect(1,1,w-2,h-2);
  g.fillStyle='#3d3527'; g.font='bold 13px system-ui'; g.textAlign='center';
  g.fillText('🛸 ยานแม่อยู่ทางนี้',w/2,16);
  g.fillText('🛡️ แนวหลัง',w/2,h-7);
}
/* หาจุดลงที่ไม่ทับตึก */
function safeSpawn(x,z){
  for(let tries=0;tries<24;tries++){
    let ok=!houseBlocked(x,z);                     // 🏠 ไม่ลงกลางผนังบ้าน (ลงในห้องได้ปกติ)
    if(ok) for(const o of solids){ if(Math.hypot(x-o.x,z-o.z)<o.r+2.2){ ok=false; break; } }
    if(ok) return {x,z};
    x+=rnd(-6,6); z+=rnd(-6,6);
  }
  return {x,z};
}
/* ย่อผืนแผนที่ให้พอดีจอเสมอ (รักษาสัดส่วน) — จอเตี้ยมากก็ต้องเห็นครบทั้งใบ ไม่มีแถบเลื่อน */
function fitSpawnMap(){
  if(!mapCv) return;
  /* จอกว้าง = ผังคอลัมน์คู่ (แผนที่ซ้าย · คำแนะนำขวากว้างสุด 360 + ช่องไฟ) → หักส่วนนั้นออกก่อน */
  const wide=innerWidth>640;                                   // >640 = ผังคอลัมน์คู่ (ตรงกับ CSS)
  const side=innerWidth>1000?420:330;                          // ที่ที่คอลัมน์คำแนะนำกิน (กว้าง+ช่องไฟ+padding)
  const availW=wide? innerWidth*0.97-side : innerWidth*0.88;
  const availH=innerHeight*(wide?0.78:(innerHeight<340?0.44:0.50));
  const k=Math.min(availW/mapCv.width, availH/mapCv.height, 1);
  mapCv.style.width=Math.round(mapCv.width*k)+'px';
  mapCv.style.height=Math.round(mapCv.height*k)+'px';
}
function openSpawnMap(){
  if(!mapBoxEl) return;
  mapPick=mapPick||{x:px,z:pz};
  if(mapNameEl) mapNameEl.textContent=zoneName(mapPick.x,mapPick.z);
  fitSpawnMap();
  drawSpawnMap();
  mapBoxEl.classList.add('on');
  unlockMouse();
}
function applySpawnPick(){
  if(!mapPick) return;
  const s=safeSpawn(mapPick.x,mapPick.z);
  px=s.x; pz=s.z;
  py=terrainH(px,pz)+(inHeli?HELI_SKID+16:EYE);
  if(inHeli){ phVel={x:0,y:0,z:0}; hLanded=false; }
  /* หันหน้าเข้าหาแกนพลังงานยานแม่เสมอ — เด็กจะได้ไม่งงว่าเป้าอยู่ไหน */
  yaw=Math.atan2(-(0-px), -(CORE_Z-pz)); pitch=.30;
  mapBoxEl.classList.remove('on');
  toastBan(`🪂 <b>ลงสนามแล้ว!</b><br><span class="ib-sub">${zoneName(px,pz)}</span>`,2000);
  netSend(true);
}

/* ============================================================
   🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
   · เดินเข้าใกล้เฮลิที่กำลังบิน (ของเพื่อนหรือของบอท) ในระยะ RIDE_DIST → ปุ่ม 🎖️ โผล่
   · ขึ้นเป็นพลปืน = เกาะอยู่ "ข้างประตู" ของลำนั้น เล็ง/ยิงอิสระ 360° ขณะนักบินพาบิน
   · ไม่นับเป็นเฮลิเพิ่ม (เพดาน 5 ลำนับเฉพาะ "ลำ" ไม่ใช่ "คน")
   🌐 ส่งผ่าน field `av='gun'` (เดิมมี foot/heli) — ตำแหน่งที่ส่งคือจุดประตูอยู่แล้ว
      เพื่อนเครื่องอื่นจึงเห็นเราเป็นทหารเกาะอยู่ข้างลำโดยไม่ต้องรู้ว่าเรานั่งลำใคร (ไม่ต้องแก้ rules)
   ============================================================ */
/* ⚠️ วัด "ระยะแนวราบ" แยกจาก "ความสูง" — ถ้าวัดระยะ 3 มิติรวมกัน ผู้เล่นบนพื้นจะเอื้อมไม่ถึงเลย
   (เฮลิลอยอยู่ 50m ระยะตรงจะ >40m ทันทีแม้ยืนใต้ลำพอดี) → นักบินต้องบินมาลอยเหนือหัวถึงจะขึ้นได้ */
const RIDE_DIST=30;                       // ระยะแนวราบที่กดขึ้นเป็นพลปืนได้
const RIDE_UP=70;                         // ความสูงของลำที่ยังเกาะขึ้นไปได้ (โรยตัวขึ้น)
const RIDE_OFF=[2.35,-0.35,0.5];          // ตำแหน่งเกาะข้างประตู (เทียบลำ: ขวา, ต่ำลงเล็กน้อย, ค่อนไปหน้า)
function rideableHelis(){
  const out=[];
  helis.forEach((h,i)=>out.push({key:'bot'+i, obj:h.grp, bot:true}));
  for(const uid in peers) if(peers[uid].kind==='heli' && peers[uid].grp) out.push({key:uid, obj:peers[uid].grp, bot:false});
  return out;
}
function findRide(key){ return rideableHelis().find(r=>r.key===key)||null; }
function nearestRideable(){
  let best=null,bd=RIDE_DIST;
  rideableHelis().forEach(r=>{
    const p=r.obj.position;
    const dxz=Math.hypot(p.x-px,p.z-pz), dy=Math.abs(p.y-py);
    if(dxz<bd && dy<RIDE_UP){ bd=dxz; best=r; }
  });
  return best;
}
/* จุดประตูของลำที่นั่งอยู่ (หมุนตามหัวลำ) */
function ridePos(host){
  const o=host.obj, a=o.rotation.y;
  const ox=RIDE_OFF[0], oy=RIDE_OFF[1], oz=RIDE_OFF[2];
  return {x:o.position.x+Math.cos(a)*ox+Math.sin(a)*oz,
          y:o.position.y+oy,
          z:o.position.z-Math.sin(a)*ox+Math.cos(a)*oz};
}
function boardGunner(){
  if(inHeli||riding) return;
  const r=nearestRideable();
  if(!r){ toastBan('🎖️ <b>ไม่มีเฮลิใกล้ๆ</b><br><span class="ib-sub">เดินเข้าไปใกล้ลำที่กำลังบินก่อนนะ</span>',1800); return; }
  riding=r.key; setScoped(false);
  const p=ridePos(r); px=p.x; py=p.y; pz=p.z;
  wrapEl.classList.add('fly','gunner');
  if(gunGrp) gunGrp.visible=true;                    // พลปืนถือปืนอยู่ในมือ (ต่างจากนักบินที่ไม่เห็นปืน)
  firing=false; heat=0; overheat=false; renderHeat(); renderMissiles(); renderAmmo(); syncWeaponBtns();
  Snd.startRotor();
  toastBan(`🎖️ <b>ขึ้นเป็นพลปืนประจำประตูแล้ว!</b><br><span class="ib-sub">${r.bot?'ลำของหน่วยพันธมิตร':'ลำของเพื่อน'} — เล็งยิงได้รอบทิศขณะนักบินพาบิน · กด 🪂 เพื่อกระโดดลง</span>`,3000);
  if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
  netSend(true);
}
function dismountGunner(silent){
  if(!riding) return;
  riding=null;
  wrapEl.classList.remove('fly','gunner');
  py=terrainH(px,pz)+EYE;                            // กระโดดลงถึงพื้นตรงนั้น
  misLeft=MIS_MAX; misReloadAt=0; renderMissiles();
  Snd.stopRotor();
  syncWeaponBtns(); renderAmmo();
  if(!silent) toastBan('🪂 <b>กระโดดลงจากเฮลิแล้ว</b>',1500);
  netSend(true);
}
/* พลปืน: เกาะไปกับลำ เล็ง/ยิงอิสระ (ไม่ได้บังคับทิศทางบิน — นักบินเป็นคนพา) */
function tickGunner(dt,now){
  const host=findRide(riding);
  if(!host){                                          // นักบินลงจอด/ออกจากเกม → ปล่อยลงพื้น
    dismountGunner(true);
    toastBan('🪂 <b>ลำที่นั่งอยู่ไปแล้ว</b> — ลงถึงพื้นปลอดภัย',2000);
    return;
  }
  const p=ridePos(host);
  px=p.x; py=p.y; pz=p.z;
  camera.position.set(px,py+Math.sin(now*.013)*.10,pz);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);
  camera.rotateZ(-clamp(host.obj.rotation.z*.6,-.25,.25));   // เอียงตามลำที่นักบินเลี้ยว
  applyRecoil(dt);
  if(shake>0.001){ camera.position.x+=rnd(-1,1)*shake*.3; camera.position.y+=rnd(-1,1)*shake*.3; shake=Math.max(0,shake-dt*2.2); }
  /* ปืนประจำประตู: รัวเหมือนปืนกลติดลำ ไม่โอเวอร์ฮีต */
  if(gunGrp){
    gunRecoil=Math.max(0,gunRecoil-dt*7);
    gunGrp.position.set(GUN_POS[0],GUN_POS[1]-gunRecoil*.03,GUN_POS[2]+gunRecoil*.10);
    gunGrp.rotation.set(GUN_ROT[0]+gunRecoil*.22,GUN_ROT[1],GUN_ROT[2]-gunRecoil*.05);
  }
  if(muzzle) muzzle.material.opacity=now<muzzleUntil?1:0;
  if(misLeft<=0&&misReloadAt&&now>misReloadAt){ misLeft=MIS_MAX; misReloadAt=0; renderMissiles(); }
  if(now-lastHurt>3500&&hp<PLAYER_HP){ hp=Math.min(PLAYER_HP,hp+SHIELD_REGEN*dt*10); renderHp(); }
  if(firing) fireGun(now);
}
/* โชว์/ซ่อนปุ่มขึ้นเป็นพลปืน ตามว่ามีลำอยู่ใกล้ไหม (เช็กวินาทีละครั้งพอ) */
let gunnerBtnAt=0;
function updateGunnerBtn(now){
  if(!gunnerBtn || now-gunnerBtnAt<400) return;
  gunnerBtnAt=now;
  const show=!inHeli && !riding && !!nearestRideable();
  gunnerBtn.style.display=show?'block':'none';
  /* 🚁 รอบ 434: ปุ่มเฮลิโผล่เฉพาะตอน "ยืนอยู่ข้างลำจริง" (หรือกำลังบิน/นั่งเป็นพลปืน = ใช้ลง) */
  if(heliBtn) heliBtn.style.display=(inHeli||riding||padAt(px,pz))?'block':'none';
}

/* นับเฮลิที่บินอยู่ทั้งโลกตอนนี้ = ของเรา + ของเพื่อนที่กำลังบิน + บอท (พลปืนไม่นับ — นั่งลำที่มีอยู่แล้ว) */
function heliCount(){
  let n=inHeli?1:0;
  for(const uid in peers) if(peers[uid].kind==='heli') n++;
  return n+helis.length;
}
function enterHeli(){
  if(inHeli||riding) return;      // นั่งเป็นพลปืนอยู่ ต้องกระโดดลงก่อน
  /* 🚁 รอบ 434: ขึ้นเครื่องได้เฉพาะตอน "เดินไปถึงลำจริง" เหมือนโลกเฮลิฯ (เดิมกดที่ไหนก็ขึ้นได้) */
  const pad=padAt(px,pz);
  if(!pad){
    toastBan('🚁 <b>ต้องเดินไปที่เฮลิคอปเตอร์ก่อน</b><br><span class="ib-sub">กด 🗺️ ดูแผนที่ — จุด 🚁 คือลำที่จอดอยู่ (มี 5 ลำ)</span>',2400);
    if(typeof sfx!=='undefined'&&sfx.wrong) sfx.wrong();
    return;
  }
  if(heliCount()>=HELI_MAX){                    // 🚁 เพดาน 5 ลำทั้งโลก (ผู้ใช้สั่ง)
    toastBan(`🚁 <b>เฮลิคอปเตอร์เต็มแล้ว (${HELI_MAX} ลำ)</b><br><span class="ib-sub">รอเพื่อนลงจากเครื่องก่อนนะ</span>`,2200);
    if(typeof sfx!=='undefined'&&sfx.wrong) sfx.wrong();
    return;
  }
  myPad=pad; heliReady=false; heliStartAt=performance.now();
  px=pad.x; pz=pad.z; yaw=pad.rot;              // นั่งประจำที่นักบิน หันตามลำ
  setSeatView(0);                                // ตอนสตาร์ทใช้มุม "เต็มลำ" ได้อารมณ์ (เหมือนโลกเฮลิฯ)
  if(seatBtn) seatBtn.style.display='block';
  inHeli=true; setScoped(false);
  wrapEl.classList.add('fly'); heliBtn.classList.add('flying'); heliBtn.textContent='🪂';
  phVel={x:0,y:0,z:0}; phClimb=0; hLanded=false;
  phMisLeft=PH_MIS_MAX; phMisReloadAt=0;
  py=terrainH(px,pz)+HELI_SKID+1.8;                        // นั่งอยู่ในลำที่ยังจอดอยู่ (ยังไม่ลอย)
  hLanded=true;                                            // ต้องดันคันเร่งขึ้นเองหลังสตาร์ทเสร็จ
  if(gunGrp) gunGrp.visible=false;                         // ในเฮลิไม่เห็นปืนมือ
  firing=false; heat=0; overheat=false; renderHeat();
  renderMissiles(); renderAmmo(); syncWeaponBtns(); syncBotHelis();
  Snd.startRotor();
  toastBan('🚁 <b>ขึ้นเครื่องแล้ว — กำลังสตาร์ท!</b><br><span class="ib-sub">รอเครื่องติดครบขั้นก่อนนะ (ประมาณ 10 วิ) · กด 👁️ ปรับมุมมองในห้องนักบินได้</span>',3000);
  if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
}
function exitHeli(){
  if(!inHeli) return;
  /* 🅿️ รอบ 434: ลงจากเครื่องแล้ว "ลำจอดค้างไว้ตรงนั้น" — เดินกลับมาขึ้นใหม่ได้ */
  if(myPad){ movePad(myPad,px,pz,yaw); myPad=null; }
  heliReady=false;
  if(seatBtn) seatBtn.style.display='none';
  if(startEl) startEl.classList.remove('on');
  if(wrapEl) wrapEl.classList.remove('seat0','seat1','seat2');
  inHeli=false; hLanded=false;
  wrapEl.classList.remove('fly'); heliBtn.classList.remove('flying'); heliBtn.textContent='🚁';
  if(gunGrp) gunGrp.visible=true;
  py=terrainH(px,pz)+EYE; phClimb=0;
  misLeft=MIS_MAX; misReloadAt=0; renderMissiles(); syncBotHelis();
  syncWeaponBtns(); renderAmmo();
  Snd.stopRotor();
  toastBan('🪂 <b>ลงพื้นแล้ว</b> — กลับมาเป็นทหารราบ',1500);
}
/* 🚁 การบิน "เหมือนโลกเฮลิคอปเตอร์ทุกประการ" (ผู้ใช้สั่ง)
   ค่าและสมการทั้งหมดยกมาจาก tickHeli ใน adventure3d.js: เร่ง 13 · เพดานเร็ว 17 · ไต่ 9 หน่วง 1.8
   · drag 1.4 · หันลำ Q/E 1.5 rad/s · auto-hover · แตะพื้นเบา = ลงจอด · ดันคันเร่งขึ้น = เทคออฟ */
/* 🎥 กล้องที่นั่งนักบิน — ยกตามระดับเบาะที่เลือก (เหมือนปุ่มเบาะโลกเฮลิฯ) + ลากลำจริงมาไว้รอบตัว */
function seatCamera(now,rollZ){
  const v=SEAT_VIEWS[seatLv];
  const sin=Math.sin(yaw), cos=Math.cos(yaw);              // ทิศหน้าลำ = (−sin, −cos)
  camera.position.set(px + (-sin)*v.dz, py+v.dy+Math.sin(now*.012)*.12, pz + (-cos)*v.dz);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);
  if(rollZ) camera.rotateZ(rollZ);
  /* ลำที่เราขับ = ลำจริงที่ขึ้นมา ตามตัวไปด้วย (เพื่อน/ตัวเราเห็นลำเดียวกัน หันหน้าถูกทิศ) */
  if(myPad&&myPad.grp){ myPad.grp.position.set(px,py-1.8,pz); myPad.grp.rotation.y=yaw; myPad.grp.visible=true; }
}
function tickHeliFlight(dt,now){
  /* 🌀 รอบ 434: ช่วง "สตาร์ทเครื่อง" — ยังบินไม่ได้ มองรอบตัว/ปรับเบาะได้ ใบพัดค่อยๆ ไต่รอบ */
  if(!heliReady){
    const done=now-heliStartAt>=START_MS;
    if(startEl){ startEl.classList.add('on'); startEl.innerHTML=startPhaseText(now); }
    if(done){
      heliReady=true; setSeatView(state.heliSeat||1);
      if(startEl) startEl.classList.remove('on');
      toastBan('✅ <b>เครื่องพร้อมบิน!</b><br><span class="ib-sub">ดันคันเร่งขึ้น (▲/Space) เพื่อทะยานขึ้นฟ้า · 👁️ ปรับมุมมอง · 🪂 ลงจากเครื่อง</span>',2600);
      if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
    }
    py=terrainH(px,pz)+HELI_SKID+1.8;
    const shk=Math.min(1,(now-heliStartAt)/START_MS)*.05;   // เครื่องสั่นแรงขึ้นเรื่อยๆ ตามรอบใบพัด
    seatCamera(now,0);
    camera.position.y+=Math.sin(now*.05)*shk;
    camera.position.x+=Math.sin(now*.043)*shk*.6;
    if(now-lastHurt>3500&&hp<PLAYER_HP){ hp=Math.min(PLAYER_HP,hp+SHIELD_REGEN*dt*10); renderHp(); }
    return;
  }
  let fw=0,sd=0,yawIn=0,col=0;
  if(keys.w) fw+=1; if(keys.s) fw-=1;
  if(keys.a) sd-=1; if(keys.d) sd+=1;
  if(keys.q) yawIn+=1; if(keys.e) yawIn-=1;
  if(keys.space) col+=1; if(keys.shift||keys.ctrl) col-=1;
  if(joy.id!==null){ fw=-joy.dy; sd=joy.dx; }              // จอยมือถือ = เดินหน้า/สไลด์ เหมือนโลกเฮลิฯ
  col+=phClimb; col=clamp(col,-1,1);
  yaw+=yawIn*HELI_YAWSP*dt;

  const sin=Math.sin(yaw), cos=Math.cos(yaw);
  if(hLanded){
    if(col>.25){ hLanded=false; phVel.y=2.5; }             // ดันคันเร่งขึ้น = เทคออฟ
  }else{
    phVel.x+=(-sin*fw+cos*sd)*HELI_ACCEL*dt;
    phVel.z+=(-cos*fw-sin*sd)*HELI_ACCEL*dt;
    phVel.y+=(col*HELI_CLIMB - phVel.y*HELI_DAMP)*dt;      // ไต่/ลดระดับนุ่มๆ auto-hover
    const drag=Math.max(0,1-HELI_DRAG*dt);
    phVel.x*=drag; phVel.z*=drag;
    const hs=Math.hypot(phVel.x,phVel.z);
    if(hs>HELI_VMAX){ phVel.x*=HELI_VMAX/hs; phVel.z*=HELI_VMAX/hs; }
  }
  const lim=WORLD*0.94;
  let nx=clamp(px+phVel.x*dt,-lim,lim);
  let nz=clamp(pz+phVel.z*dt,-lim,lim);
  let ny=Math.min(HELI_CEIL,py+phVel.y*dt);
  /* ชนตึก: บินต่ำกว่ายอดแล้วทะลุ footprint → เด้งออก + เจ็บ (เหมือนโลกเฮลิฯ) */
  for(const o of solids){
    if(Math.hypot(nx-o.x,nz-o.z)<o.r+1.4 && ny<terrainH(o.x,o.z)+14){
      const dx=nx-o.x, dz=nz-o.z, d=Math.hypot(dx,dz)||.001, k=(o.r+1.5)/d;
      nx=o.x+dx*k; nz=o.z+dz*k; phVel.x*=-.25; phVel.z*=-.25;
      if(now-lastHurt>1000) hurtPlayer(12,now);
      break;
    }
  }
  /* พื้น: แตะเบา = ลงจอด · กระแทกแรง = เจ็บแล้วเด้ง */
  const minY=terrainH(nx,nz)+HELI_SKID;
  if(ny<=minY){
    if(phVel.y<-7 && now-lastHurt>1000){ hurtPlayer(18,now); ny=minY; phVel.y=2.2; }
    else{
      ny=minY;
      if(!hLanded && Math.abs(phVel.y)<=7 && col<=.1){
        hLanded=true; phVel={x:0,y:0,z:0};
        toastBan('🛬 <b>ลงจอดแล้ว</b> — ดันคันเร่งขึ้น (▲/Space) เพื่อบินต่อ · 🪂 ลงจากเครื่อง',1800);
        if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
      }
      phVel.y=Math.max(0,phVel.y);
    }
  }
  px=nx; pz=nz; py=ny;
  /* กล้อง = ที่นั่งนักบิน (ตามระดับเบาะ) + โยกเบาๆ + เอียงลำเข้าโค้ง */
  seatCamera(now, -clamp(sd*.20 + (phVel.x*cos-phVel.z*sin)*.006, -.30,.30));
  applyRecoil(dt);
  if(shake>0.001){ camera.position.x+=rnd(-1,1)*shake*.35; camera.position.y+=rnd(-1,1)*shake*.35; shake=Math.max(0,shake-dt*2.2); }
  if(muzzle) muzzle.material.opacity=now<muzzleUntil?1:0;
  if(phMisLeft<=0&&phMisReloadAt&&now>phMisReloadAt){ phMisLeft=PH_MIS_MAX; phMisReloadAt=0; renderMissiles();
    toastBan('🚀 <b>เติมจรวดเฮลิเต็มแล้ว!</b>',900); }
  if(now-lastHurt>3500&&hp<PLAYER_HP){ hp=Math.min(PLAYER_HP,hp+SHIELD_REGEN*dt*10); renderHp(); }
  if(firing) fireGun(now);
}
/* 🤖 บอทขับเฮลิ: ปกติไม่มีเลย (ผู้เล่นขับเท่านั้น) — ยกเว้นในแมพมีคนน้อยกว่า 2 คน ให้มี 1 ลำเป็นเพื่อน
   เรียกทุกครั้งที่จำนวนผู้เล่น/สถานะการบินเปลี่ยน */
function syncBotHelis(){
  const players=1+Object.keys(peers).length;
  let want=(players<2)?1:0;
  const flyers=(inHeli?1:0)+Object.keys(peers).filter(u=>peers[u].kind==='heli').length;
  want=Math.min(want, Math.max(0,HELI_MAX-flyers));        // ไม่ให้รวมแล้วเกินเพดาน 5 ลำ
  if(riding && String(riding).slice(0,3)==='bot') want=Math.max(want,1);   // 🎖️ กำลังนั่งลำบอทอยู่ ห้ามลบทิ้ง
  while(helis.length>want){ const h=helis.pop(); scene.remove(h.grp); }
  while(helis.length<want) helis.push(makeHeli(helis.length));
}

/* ============================================================
   🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
   เห็นเพื่อนเป็นทหารราบ (av:'foot') หรือเฮลิคอปเตอร์ (av:'heli') · ป้ายชื่อ + กระดานคะแนน + แชท
   rules ใช้ field เดิมทั้งหมด (n,x,z,y,yaw,w,av,c,ct) — ต้องเพิ่มแค่ $map==='invasion' ใน enum
   ============================================================ */
function netReady(){
  return typeof Online!=='undefined' && Online.ready && Online.db
      && typeof onlineKey==='function' && typeof firebase!=='undefined';
}
function netJoin(){
  if(!netReady()) return;
  try{
    netOk=true;
    worldRef=Online.db.ref('world/invasion');
    myRef=worldRef.child(onlineKey());
    myRef.onDisconnect().remove();
    lastNetSend=0; netSend(true);
    worldRef.on('child_added',onPeer);
    worldRef.on('child_changed',onPeer);
    worldRef.on('child_removed',s=>dropPeer(s.key));
  }catch(e){ worldRef=null; myRef=null; }
}
function netSend(force){
  if(!myRef||!netOk) return;
  const now=performance.now();
  if(!force && now-lastNetSend<NET_SEND_MS) return;
  lastNetSend=now;
  const payload={ n:((typeof onlineDisplayName==='function'&&onlineDisplayName())||'ผู้เล่น'),
    x:Math.round(px*10)/10, z:Math.round(pz*10)/10, y:Math.round(py*10)/10,
    /* 🔫 รอบ 439: ยัด "ปืนที่ถือ + กำลังยิงอยู่ไหม" ลงในช่อง av (rules อนุญาต string ≤8 ตัวอักษร)
       → เพื่อนเห็นปืนถูกกระบอกและเห็นไฟปากลำกล้องตอนเรายิง **โดยไม่ต้องแก้ rules เลย**
       รูปแบบ: foot|gun|heli + '-' + (r=ไรเฟิล / s=สไนเปอร์) + (f=กำลังยิง / .=ไม่ยิง)
       เครื่องรุ่นเก่าที่ยังไม่อัปเดตจะอ่านไม่ออก → ตกไปเป็น 'foot' ตามเดิม ไม่พัง */
    yaw:Math.round(yaw*100)/100, w:sessionWords,
    av:(riding?'gun':(inHeli?'heli':'foot'))+'-'+(weapon==='r93'?'s':'r')+((firing||performance.now()-lastFire<180)?'f':'.'),
    ts:firebase.database.ServerValue.TIMESTAMP };
  if(myChat && Date.now()-myChat.ts<CHAT_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  /* 🤝 สมรภูมิร่วม — ใช้ field เดิมที่ rules อนุญาตอยู่แล้ว (ไม่ต้อง publish rules ใหม่)
     cw = คำ+เลขรอบ (เฉพาะหัวหน้าห้องประกาศ) · hp = ผลงานเรา "รอบ|บิตยานลูก|ดาเมจยานแม่" (≤28 ตัวอักษร) */
  if(word && isLeader()) payload.cw=`${word.en}|${word.th}|${battleRound}`.slice(0,60);
  payload.hp=`${battleRound}|${myKill}|${Math.round(myArmorDmg)}`.slice(0,28);
  myRef.set(payload).catch(()=>{ netOk=false; });
}
function peerColor(uid){ let h=0; for(let i=0;i<uid.length;i++) h=(h*31+uid.charCodeAt(i))>>>0; return PEER_COLORS[h%PEER_COLORS.length]; }
/* ป้ายชื่อลอยหัว */
function nameSprite(name){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=64;
  const x=cv.getContext('2d');
  x.fillStyle='rgba(8,16,28,.82)'; x.beginPath();
  if(x.roundRect) x.roundRect(6,10,244,44,10); else x.rect(6,10,244,44);
  x.fill();
  x.font='bold 30px system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
  x.fillStyle='#fff'; x.fillText(String(name).slice(0,14),128,34);
  return new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false}));
}
/* ตัวเพื่อน: ทหารราบ (foot) หรือเฮลิคอปเตอร์ (heli) */
/* 🔫 รอบ 520/521: โมเดลทหาร baked "ถือปืนมาในตัว" (สูตรรอบ 519) — ใช้ทั้ง peer (มุมมองที่3) และ squad (หน่วยเรา)
   เลือกไฟล์ตามปืนที่ถือ: R93→soldier_c · KSR-77(key 'rifle')→soldier_c_KSR-77
   ท่อนบน+ปืนอบในตัว (แช่แข็งท่าเล็ง) · ขยับเฉพาะขา (legOnly ใน poseSoldier) */
function bakedSoldierGlb(weapon){ return (weapon==='r93')?'img/models/soldier_c.glb':'img/models/soldier_c_KSR-77.glb'; }
function loadPeerSoldier(rig,weapon){
  if(!rig||!rig.J) return;
  loadSoldierGlb(bakedSoldierGlb(weapon),function(obj){
    fitInto(obj,1.8); obj.position.y=0;
    applySoldierGlb({J:rig.J},obj);            /* ชื่อชิ้นแบบ tripo → autoRigSoldier bin ชิ้น (แยกขาซ้าย-ขวา) */
  });
}
function peerRig(p){
  const b=p.grp&&p.grp.children[0];
  return (b&&b.userData)?b.userData.rig:null;
}
/* 🔫 รอบ 520: ปืนเปลี่ยน = โหลดโมเดล baked ใหม่ (ปืนอบในตัวโมเดล ไม่ใช่ปืนแยกแล้ว) + ขยับ flash ตามปลายปืนใหม่ */
function setPeerWeapon(p,weapon){
  p.wantWeapon=weapon; const rig=peerRig(p); if(rig) loadPeerSoldier(rig,weapon);
  const g=p.grp&&p.grp.children[0], fl=g&&g.userData.flash;
  if(fl){ const m=MUZZLE_BY_WEAPON[weapon]||MUZZLE_BY_WEAPON.rifle; fl.position.set(m[0],m[1],m[2]); fl.scale.setScalar(weapon==='r93'?0.55:0.45); }
}
function peerBody(kind,color,weapon){
  const g=new THREE.Group();
  if(kind==='heli'){
    /* 🚁 รอบ 434: เพื่อนที่บินอยู่ = โมเดลลำจริงลำเดียวกับของเรา (ทุกคนเห็นเฮลิเหมือนกันทั้งสนาม)
       โหลดเสร็จค่อยสลับ — ระหว่างรอใช้ทรงโค้ดเดิมไปก่อน จะได้ไม่มีลำล่องหน */
    heliModel(m=>{ if(!m) return;
      g.children.slice().forEach(c=>g.remove(c));
      g.add(m); g.userData.rotor=m._rotor||null; g.userData.trotor=m._trotor||null;
    });
    const bodyM=new THREE.MeshPhongMaterial({color,shininess:24,flatShading:true});
    const body=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.25,4.6,8),bodyM); body.rotation.x=Math.PI/2; g.add(body);
    const nose=new THREE.Mesh(new THREE.SphereGeometry(1.3,10,8),new THREE.MeshPhongMaterial({color:0x1b2733,shininess:90})); nose.position.z=-2.3; g.add(nose);
    const tail=new THREE.Mesh(new THREE.CylinderGeometry(.3,.18,5,7),bodyM); tail.rotation.x=Math.PI/2; tail.position.z=3.9; g.add(tail);
    const rotor=new THREE.Group();
    for(let k=0;k<4;k++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(.26,.06,8.6),bodyM); bl.rotation.y=k*Math.PI/4; rotor.add(bl); }
    rotor.position.y=1.6; g.add(rotor); g.userData.rotor=rotor;
  }else{
    /* 🪖 รอบ 423: เพื่อนบนพื้นใช้ "โครงข้อต่อ" ชุดเดียวกับหน่วยรบ → เดิน/เล็งได้เหมือนกัน
       และรองรับโมเดล .glb ของผู้ใช้ด้วย (soldier_b = ชุดของผู้เล่นออนไลน์) */
    const rig=buildSoldierRig();
    rig.J.torso.children.forEach(c=>{ if(c.isMesh&&c.material&&c.material.color) c.material=new THREE.MeshLambertMaterial({color}); });
    g.add(rig.grp); g.userData.rig=rig; g.userData.legOnly=true;
    /* 🔫 รอบ 520: โมเดล baked ถือปืนมาในตัว เลือกตามปืนที่เพื่อนถือ (soldier_c=R93 · soldier_c_KSR-77=rifle)
       ปืนอบในตัว → ไม่ต้อง attachPeerGun · poseSoldier legOnly ขยับเฉพาะขา ท่อนบน+ปืนแช่แข็งท่าเล็ง */
    loadPeerSoldier(rig, weapon||'rifle');
    const flash=makeSoldierFlash(weapon||'rifle'); g.add(flash); g.userData.flash=flash;   /* 🔥 รอบ 521: ไฟปากลำกล้องตอนเพื่อนยิง */
  }
  return g;
}
function buildPeer(uid,p,kind){
  if(p.grp) scene.remove(p.grp);
  p.grp=new THREE.Group();
  p.grp.add(peerBody(kind,peerColor(uid),p.weapon));   /* 🔫 รอบ 520: เลือกโมเดล baked ตามปืนที่ถือ */
  const nm=nameSprite(p.n); nm.scale.set(7,1.75,1); nm.position.y=kind==='heli'?4.2:2.9; p.grp.add(nm);
  if(kind==='gun') p.grp.rotation.x=-.12;      // 🎖️ พลปืนโน้มตัวออกนอกประตูเล็กน้อย
  p.grp.position.set(p.cur.x,p.cur.y,p.cur.z); p.grp.rotation.y=p.yawCur;
  scene.add(p.grp); p.kind=kind;
}
function onPeer(snap){
  const uid=snap.key;
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  const d=snap.val()||{};
  if(typeof d.x!=='number'||typeof d.z!=='number') return;
  /* 🔫 รอบ 439: av = "kind-<r|s><f|.>" (เครื่องเก่าส่งมาแค่ 'foot'/'gun'/'heli' ก็ยังอ่านได้) */
  const av=String(d.av||'foot');
  const kind=av.indexOf('heli')===0?'heli':(av.indexOf('gun')===0?'gun':'foot');
  const peerWeapon=(av.indexOf('-s')>=0)?'r93':'rifle';
  const peerFiring=av.charAt(av.length-1)==='f';
  let p=peers[uid];
  if(!p){
    p=peers[uid]={grp:null,kind:'',weapon:peerWeapon,cur:{x:d.x,y:(d.y||0),z:d.z},tgt:{x:d.x,y:(d.y||0),z:d.z},   /* 🔫 รอบ 520: รู้ปืนก่อนสร้าง → เลือกโมเดล baked ถูกทันที */
                  yawCur:(d.yaw||0),yawTgt:(d.yaw||0),n:String(d.n||'เพื่อน').slice(0,24),w:0};
    buildPeer(uid,p,kind);
    toastBan(`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> เข้าร่วมสมรภูมิ${kind==='heli'?'ด้วยเฮลิคอปเตอร์ 🚁':' 🔫'}!`,1900);
    syncBotHelis();                                   // 🚁 มีคนเข้ามา → เลิกใช้บอท
  }else if(p.kind!==kind){ if(p.bubble) removePeerBubble(p); buildPeer(uid,p,kind); syncBotHelis(); }
  p.tgt={x:d.x,y:(typeof d.y==='number'?d.y:p.tgt.y),z:d.z};
  if(typeof d.yaw==='number') p.yawTgt=d.yaw;
  /* 🔫 ปืนที่เพื่อนถือเปลี่ยน → สลับทรงปืนในมือให้ตรง · กำลังยิง → จุดไฟปากลำกล้อง */
  if(p.weapon!==peerWeapon){ p.weapon=peerWeapon; setPeerWeapon(p,peerWeapon); }
  if(peerFiring) p.shotUntil=performance.now()+180;
  const w=typeof d.w==='number'?d.w:0; if(p.w!==w) p.w=w;
  /* 🤝 อ่านสถานะสมรภูมิของเพื่อน */
  p.cw=(typeof d.cw==='string')?d.cw:p.cw;
  if(typeof d.hp==='string'){
    const m=d.hp.split('|');
    p.round=parseInt(m[0],10)||0; p.kill=parseInt(m[1],10)||0; p.armor=parseFloat(m[2])||0;
  }
  renderBoard();
  if(typeof d.ct==='number' && typeof d.c==='string' && d.c && p.lastCt!==d.ct){ p.lastCt=d.ct; showPeerBubble(p,d.c); }
}
function dropPeer(uid){
  const p=peers[uid]; if(!p) return;
  removePeerBubble(p);
  if(p.grp) scene.remove(p.grp);
  delete peers[uid]; renderBoard();
  syncBotHelis();                                     // 🚁 เหลือคนเดียว → ปล่อยบอท 1 ลำเป็นเพื่อน
}
function netLeave(){
  if(worldRef){ worldRef.off('child_added'); worldRef.off('child_changed'); worldRef.off('child_removed'); }
  if(myRef){ try{ myRef.remove().catch(()=>{}); }catch(e){} }
  Object.keys(peers).forEach(dropPeer);
  worldRef=null; myRef=null;
}
function peerTick(dt,now){
  const k=Math.min(1,dt*6);
  for(const uid in peers){
    const p=peers[uid]; if(!p.grp) continue;
    p.cur.x+=(p.tgt.x-p.cur.x)*k; p.cur.y+=(p.tgt.y-p.cur.y)*k; p.cur.z+=(p.tgt.z-p.cur.z)*k;
    let dy=p.yawTgt-p.yawCur; dy=((dy+Math.PI)%TAU+TAU)%TAU-Math.PI; p.yawCur+=dy*k;
    const moved=Math.hypot(p.tgt.x-p.cur.x,p.tgt.z-p.cur.z);
    /* 🦶 รอบ 437 (ผู้ใช้: "เท้าตัวละครลอย"): ค่า y ที่เพื่อนส่งมาคือ "ระดับตา" (พื้น+1.7)
       เอามาวางตัวโมเดลตรงๆ = ทั้งตัวลอยสูงจากพื้น 1.7 ม. → เพื่อนที่เดินเท้าให้ยืนบนพื้นของเราเอง
       (ภูมิประเทศเป็นสูตรตายตัว ทุกเครื่องได้ความสูงเท่ากันเป๊ะ จึงไม่หลุดตำแหน่ง) */
    const gy=(p.kind==='foot')?terrainH(p.cur.x,p.cur.z):p.cur.y;
    p.grp.position.set(p.cur.x,gy,p.cur.z); p.grp.rotation.y=p.yawCur;
    const ro=p.grp.children[0]&&p.grp.children[0].userData.rotor;
    if(ro) ro.rotation.y+=dt*40;
    /* 🪖 รอบ 423: เพื่อนบนพื้นขยับแขนขาจริง — เดินอยู่=ท่าเดิน · หยุด=ท่าเล็ง */
    const rig=p.grp.children[0]&&p.grp.children[0].userData?p.grp.children[0].userData.rig:null;
    if(rig){
      if(!p.anim) p.anim={J:rig.J,phase:0,lookUp:0,fireT:0,mode:'idle',legOnly:true};
      /* 🔫 รอบ 520: peer ใช้โมเดล baked ถือปืนมาในตัว (legOnly) → ท่อนบน+ปืนแช่แข็งท่าเล็งที่อบมา
         ขยับเฉพาะขาตามการเคลื่อนที่จริง: ไกล=วิ่ง (ก้าวถี่/เข่าสูง) · ใกล้=เดิน · หยุด=ยืนถือปืน
         (poseSoldier legOnly ไม่แตะ arm/head/lookUp/fireT → ไม่ต้องจำลองเล็ง/ยิงต่อ peer ทุกเฟรมอีก) */
      p.anim.mode=(moved>0.4)?'run':(moved>0.12?'walk':'idle');
      /* 🔥 รอบ 521: ไฟปากลำกล้องตอนเพื่อนยิง (สถานะ p.shotUntil ซิงก์จาก av) */
      const fl=p.grp.children[0]&&p.grp.children[0].userData.flash;
      if(fl) fl.material.opacity=(now<(p.shotUntil||0))?1:0;
      poseSoldier(p.anim,now);
    }
  }
}
/* 🏆 กระดานคะแนนสด — เรา + เพื่อน เรียงตามจำนวนคำที่พิชิตรอบนี้ */
let boardSig='';
function renderBoard(){
  if(!boardEl) return;
  const uids=Object.keys(peers);
  if(!uids.length){ boardEl.classList.remove('on'); boardSig=''; return; }
  const myName=(typeof onlineDisplayName==='function'&&onlineDisplayName())||'ฉัน';
  /* จอเตี้ยพื้นที่คอลัมน์ซ้ายจำกัด (อยู่ระหว่างแถบสถานะกับจอย) → โชว์แค่ 3 อันดับ */
  const maxRows=(innerHeight<430)?3:5;
  const rows=uids.map(u=>({n:peers[u].n,w:peers[u].w||0,me:false,h:peers[u].kind}))
    .concat([{n:myName,w:sessionWords,me:true,h:riding?'gun':(inHeli?'heli':'foot')}]).sort((a,b)=>b.w-a.w).slice(0,maxRows);
  const sig=maxRows+'|'+rows.map(r=>r.n+':'+r.w+':'+r.h+':'+r.me).join('|');
  if(sig===boardSig){ boardEl.classList.add('on'); return; }
  boardSig=sig;
  boardEl.innerHTML='<div class="bd-h">🏆 ปราบยานแม่รอบนี้</div>'+rows.map((r,i)=>
    `<div class="bd-r${r.me?' me':''}"><span>${['🥇','🥈','🥉','　','　'][i]}${r.h==='heli'?'🚁':(r.h==='gun'?'🎖️':'🔫')}</span>`+
    `<span>${escapeHTML(r.n)}</span><span>${r.w}</span></div>`).join('');
  boardEl.classList.add('on');
}
function sendChat(text){
  myChat={text:String(text).slice(0,60), ts:Date.now()};
  netSend(true);
  if(selfMsgEl){ selfMsgEl.textContent='💬 '+myChat.text; selfMsgEl.classList.add('on');
    clearTimeout(selfMsgEl._tm); selfMsgEl._tm=setTimeout(()=>selfMsgEl.classList.remove('on'),CHAT_MS); }
  if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
}
function showPeerBubble(p,text){
  removePeerBubble(p);
  const sp=nameSprite('💬 '+text); sp.scale.set(8,2,1); sp.position.y=(p.kind==='heli'?5.4:4.0);
  p.grp.add(sp); p.bubble=sp;
  p.bubbleTm=setTimeout(()=>removePeerBubble(p),CHAT_MS);
}
function removePeerBubble(p){
  if(p.bubbleTm){ clearTimeout(p.bubbleTm); p.bubbleTm=0; }
  if(p.bubble){ if(p.bubble.parent) p.bubble.parent.remove(p.bubble);
    if(p.bubble.material.map) p.bubble.material.map.dispose(); p.bubble.material.dispose(); p.bubble=null; }
}
/* 👾 ยานลูก: บินวน + สุ่มดิ่ง + ยิงลำแสงนำหน้าผู้เล่นเล็กน้อย (หลบได้) */
function tickFighters(dt,now){
  fighters.forEach(f=>{
    f.ang+=f.spin*dt;
    f.rad+=Math.sin(now*.0004+f.ang)*8*dt;
    f.rad=clamp(f.rad,45,F_R);
    /* ⛰️ รอบ 431: บางช่วง "โฉบต่ำเลียดสันเขา" (หลบยาก ต้องไล่ยิงจริงจัง) สลับกับบินสูงตามเดิม */
    if(now>f.yAt){
      f.hug=Math.random()<.45;
      f.tgtY=f.hug? rnd(9,17) : rnd(F_Y_MIN,F_Y_MAX);
      f.yAt=now+rnd(2600,5200);
    }
    const tx=Math.cos(f.ang)*f.rad, tz=Math.sin(f.ang)*f.rad;
    const p=f.grp.position;
    p.x+=(tx-p.x)*Math.min(1,dt*1.6);
    p.z+=(tz-p.z)*Math.min(1,dt*1.6);
    /* บินอิงพื้นเสมอ — ผ่านเนินสูงก็ไต่ขึ้นตาม ไม่มุดทะลุภูเขา (ยกเร็วกว่าลดเพื่อกันชนยอดเนิน) */
    const gnd=terrainH(p.x,p.z), wantY=gnd+f.tgtY;
    p.y+=(wantY-p.y)*Math.min(1, dt*(wantY>p.y?2.6:.9));
    /* หันหัวไปทางที่บิน + เอียงตัวเข้าโค้ง */
    f.grp.rotation.y=Math.atan2(tx-p.x,tz-p.z)+Math.PI;
    f.grp.rotation.z=-f.spin*2.4;
    if(f.label) f.label.material.opacity=1;
    /* ไฟกะพริบตอนเพิ่งโดนยิง */
    const hitK=Math.max(0,1-(now-f.hitAt)/220);
    f.eye.material.color.setHex(hitK>0?0xff5a3a:0x59ff9d);
    f.eng.scale.setScalar(4.2+Math.sin(now*.02+f.ang)*.6);
    /* ยิงใส่ผู้เล่น */
    if(now>f.shotAt){
      /* 👤 รอบ 477: เราย่องอยู่ (ดับไฟฉาย+ไม่ยิง) = ลำนี้เว้นช่วงยิงนานขึ้นมาก และบางทีไม่ยิงเลย */
      f.shotAt=now+F_SHOT_GAP*rnd(.7,1.5)*(sneaking?2.8:1);
      if(!sneaking || Math.random()<.35) spawnAlienShot(p.clone(),0x7dff9d,F_SHOT_DMG,F_SHOT_SPD);
    }
  });
}
/* ยานแม่ยิงลำแสงหนักเป็นระยะ (ลำใหญ่ ช้ากว่า เห็นแล้วหลบทัน) */
function tickMother(dt,now){
  if(!mother) return;
  /* 🛸 รอบ 439: ลำลอยค้างฟ้าตลอดเวลา แม้ช่วงที่เพิ่งถูกทำลาย (เดิม return ทิ้งทั้งก้อน = ลำนิ่งสนิท/หายไป)
     ช่วงซ่อมตัว: ยังหมุน+ลอยหายใจ แต่ไฟดับๆ ติดๆ และไม่ยิงลำแสง */
  mother.rotation.y+=dt*.02;
  /* ⚠️ ลำยานหมุนช้าๆ ให้ดูมีชีวิต แต่ "แผงตัวอักษรต้องหันหน้าเข้าเมืองตลอด"
     ไม่งั้นเล่นไปสักพักตัวอักษรจะหันข้าง/หันหลังจนอ่านไม่ออก → หักล้างการหมุนคืนทุกเฟรม */
  mother.position.y=MS_Y+Math.sin(now*.0004)*18;
  /* แผงตัวอักษร+แกน "ไม่หมุนตามลำ" และอยู่ตำแหน่งของตัวเอง — ขยับขึ้นลงตามยานหายใจนิดเดียว */
  const breathe=Math.sin(now*.0004)*3;
  if(msBoard) msBoard.position.y=BOARD_Y+breathe;
  if(msCore){ msCore.position.y=CORE_Y+breathe; }
  if(msGlow){ msGlow.position.y=CORE_Y+breathe; }
  if(msDead||msRecover){ msLamps.forEach(lp=>{ lp.visible=Math.sin(now*.0016+lp.userData.ph)>.72; }); return; }
  msLamps.forEach((lp,i)=>{ lp.visible=Math.sin(now*.004+lp.userData.ph)>-.2; });
  if(msGlow&&msOpen) msGlow.material.opacity=.4+Math.sin(now*.006)*.18;
  /* ตัวอักษรกะพริบ */
  letters.forEach(l=>{
    if(now<l.blinkUntil) l.mesh.material.opacity=(Math.sin(now*.022)>0)?1:.15;
    else l.mesh.material.opacity=1;
  });
  if(now>msBeamAt){
    msBeamAt=now+MS_BEAM_GAP*rnd(.8,1.3);
    /* ลำแสงหนักยิงลงมาจาก "ท้องยานฝั่งที่มองเห็น" (ไม่ใช่กลางลำที่อยู่ไกลลิบ) */
    const from=new THREE.Vector3(px+rnd(-260,260), MS_Y-MS_R*0.30, pz+rnd(-500,-160));
    spawnAlienShot(from,0xff5a8a,MS_BEAM_DMG,F_SHOT_SPD*.72,1.9);
  }
}
function spawnAlienShot(from,color,dmg,spd,scale){
  const to=new THREE.Vector3(px+rnd(-6,6),py+rnd(-1,1),pz+rnd(-6,6));
  const dir=to.sub(from).normalize();
  const sc=scale||1;
  const m=new THREE.Mesh(new THREE.CylinderGeometry(.30*sc,.30*sc,5.5*sc,6),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));
  m.position.copy(from);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
  scene.add(m);
  fShots.push({mesh:m,dir,spd,dmg,life:0,r:1.5*sc});
  Snd.beam();
}
function tickAlienShots(dt,now){
  for(let i=fShots.length-1;i>=0;i--){
    const s=fShots[i]; s.life+=dt;
    s.mesh.position.addScaledVector(s.dir,s.spd*dt);
    const p=s.mesh.position;
    const hitPlayer=Math.hypot(p.x-px,p.y-py,p.z-pz)<s.r+1.1;
    const hitGround=p.y<terrainH(p.x,p.z);
    if(hitPlayer||hitGround||s.life>6){
      if(hitPlayer) hurtPlayer(s.dmg,now);
      if(hitGround) boom(p.clone(),.7,0xffd08a);
      scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose();
      fShots.splice(i,1);
    }
  }
}
function tickMissiles(dt,now){
  for(let i=missiles.length-1;i>=0;i--){
    const m=missiles[i];
    /* นำวิถี: ค่อยๆ เบนเข้าหาเป้า (ยานลูกที่ล็อกไว้ ไม่มีก็ยานแม่ตอนเกราะเปิด) */
    let tgt=null;
    if(m.lock && fighters.indexOf(m.lock)>=0) tgt=m.lock.grp.position;
    else if(msOpen&&!msDead&&mother) tgt=mother.position;
    if(tgt){
      const want=new THREE.Vector3().subVectors(tgt,m.mesh.position).normalize().multiplyScalar(MIS_SPD);
      m.v.lerp(want,Math.min(1,dt*2.6));
    }
    if(m.v.length()<MIS_SPD) m.v.setLength(Math.min(MIS_SPD,m.v.length()+MIS_SPD*dt*1.6));
    m.mesh.position.addScaledVector(m.v,dt);
    m.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),m.v.clone().normalize());
    m.trail.position.copy(m.mesh.position).addScaledVector(m.v.clone().normalize(),-1.2);
    m.trail.material.opacity=.9;
    /* ชนอะไรไหม */
    let hit=null;
    for(const f of fighters){ if(m.mesh.position.distanceTo(f.grp.position)<5.4){ hit=f; break; } }
    const hitMs=(!hit && msOpen && !msDead && msCore && m.mesh.position.distanceTo(msCore.position)<CORE_R*1.35);
    const old=(now-m.born>6500) || m.mesh.position.y<terrainH(m.mesh.position.x,m.mesh.position.z);
    if(hit||hitMs||old){
      boom(m.mesh.position.clone(), hitMs?1.5:1.0, 0xffb347);
      if(hit) damageFighter(hit,m.dmg||MIS_DMG,now);
      if(hitMs) damageMother((m.dmg?m.dmg*2.2:MS_DMG_MISSILE));   // จรวดเฮลิแรงกว่าเล็กน้อยเมื่อเข้ายานแม่
      scene.remove(m.mesh); scene.remove(m.trail);
      m.mesh.geometry.dispose(); m.mesh.material.dispose(); m.trail.material.dispose();
      missiles.splice(i,1);
    }
  }
}
/* 👥 พันธมิตรภาคพื้น: ยิงกราดขึ้นฟ้าใส่ยานลูก (ทำดาเมจจริงแต่เบา — ผู้เล่นยังเป็นพระเอก) */
function tickSquad(dt,now){
  squad.forEach(s=>{
    /* 🎯 รอบ 526 (ผู้ใช้: "ให้บางส่วนรุมแกนแดง"): เกราะยานแม่เปิด (msOpen) → ทหารสาย coreBias (~ครึ่งหมู่)
       หันไป "ระดมยิงแกนแดง(ยานแม่)" ตามป้าย · ที่เหลือยังจัดการ fighter · ไม่มี fighter เหลือ = ทุกคนยิงแกน
       (เดิมยิงแกนเฉพาะตอนไม่มี fighter เลย → ช่วงระดมยิงยานแม่ทหารมัวยิงยานลูกบินต่ำ ดูไม่เล็งยานแม่) */
    const coreOpen=(msOpen&&msCore&&!msDead);
    let tgt=null, aim=null;
    if(coreOpen && s.coreBias){        aim=msCore.position; }              /* สายรุมยานแม่ */
    else if(fighters.length){          tgt=fighters[(Math.random()*fighters.length)|0]; aim=tgt.grp.position; }
    else if(coreOpen){                 aim=msCore.position; }              /* ไม่มี fighter → ยิงแกน */
    if(aim){
      const d=new THREE.Vector3().subVectors(aim,s.grp.position);
      /* 🧭 รอบ 436 (ผู้ใช้: "บอทหันหลังยิง"): ทหารหันหน้าไป −Z ตอน rotation=0
         → ต้องใช้ atan2(−x,−z) ไม่ใช่ atan2(x,z) (ของเดิมหันก้นใส่เป้าเป๊ะ 180°) */
      s.grp.rotation.y=Math.atan2(-d.x,-d.z);
      /* 🪖 รอบ 423: หันตัว+เงยหน้าตามเป้า แล้วให้ poseSoldier จัดท่าแขน/ลำตัวเอง
         (เดิมหมุนเฉพาะ "ปืน" ทำให้ปืนลอยแยกจากตัว) */
      s.lookUp=Math.atan2(d.y,Math.hypot(d.x,d.z));
      s.mode=s.crouch?'crouch':'aim';
    }else{
      s.lookUp=0; s.mode=s.crouch?'crouch':'idle';
    }
    if(now>s.shotAt&&aim){
      s.shotAt=now+SQUAD_GAP*rnd(.6,1.7);
      s.fireT=1;                                   // 🪖 สะบัดไหล่ตอนลั่นไก
      s.flashUntil=now+55;                         // 🔥 รอบ 521: ไฟปากลำกล้องแวบสั้น
      const from=s.grp.position.clone().add(new THREE.Vector3(0,s.crouch?1.0:1.4,0));
      tracer(from,aim.clone().add(new THREE.Vector3(rnd(-3,3),rnd(-3,3),rnd(-3,3))),0xfff0b0,.05);
      if(Math.random()<0.35){
        if(tgt) damageFighter(tgt,0.5,now);
        else if(msOpen) damageMother(MS_DMG_GUN*0.5);
      }
    }
    if(s.flash) s.flash.material.opacity=(now<(s.flashUntil||0))?1:0;   // 🔥 รอบ 521
    poseSoldier(s,now);
  });
  tickSquadCalls(now);                            // 📣 รอบ 471: ตะโกนบอกทิศศัตรู
  tickSquadChatter(now);                          // 💬 รอบ 522: ตะโกนชนิดปืน/สถานะรบ
}

/* ============================================================
   📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
   ยานลูกเข้าใกล้ → ทหารในหมู่ที่อยู่ใกล้เราตะโกนทิศ "จริง" เทียบ yaw ของผู้เล่น
   ("ทางขวา!" / "ระวังหลัง 6 นาฬิกา!") พร้อมป้ายลอยเหนือหัว (ใช้ nameSprite ชุดเดียวกับแชท)
   คุมความถี่ 3 ชั้นไม่ให้รก: ทั้งหมู่ / ต่อทหาร 1 คน / ต่อทิศ · อยู่บนเฮลิ = เห็นป้ายแต่ไม่มีเสียง
   ============================================================ */
const CALL_DIST=170;        // ยานลูกใกล้กว่านี้ = ควรเตือน
const CALL_NEAR=46;         // ทหารต้องอยู่ในรัศมีนี้จากเรา ถึงจะได้ยิน/มองเห็นป้าย (ม.)
const CALL_GAP_ALL=2600;    // เว้นระหว่างเสียงตะโกนของทั้งหมู่
const CALL_GAP_ONE=7000;    // ทหารคนเดิมพูดซ้ำได้ทุกกี่ ms
const CALL_GAP_DIR=5200;    // ทิศเดิมพูดซ้ำได้ทุกกี่ ms
const CALL_MS=1900;         // ป้ายลอยหัวอยู่นานเท่าไร
const CALL_LINES={
  f :['ด้านหน้า 12 นาฬิกา!','ตรงหน้าเรา!'],
  fr:['ขวาหน้า 1 นาฬิกา!','เฉียงขวาหน้า!'],
  r :['ทางขวา!','ขวา 3 นาฬิกา!'],
  br:['ขวาหลัง 5 นาฬิกา!','เฉียงขวาหลัง!'],
  b :['ข้างหลัง!','ระวังหลัง 6 นาฬิกา!'],
  bl:['ซ้ายหลัง 7 นาฬิกา!','เฉียงซ้ายหลัง!'],
  l :['ทางซ้าย!','ซ้าย 9 นาฬิกา!'],
  fl:['ซ้ายหน้า 11 นาฬิกา!','เฉียงซ้ายหน้า!'],
  up:['บนหัวเรา!','มันดิ่งลงมา!'],
};
const CALL_SECTORS=['f','fr','r','br','b','bl','l','fl'];
let callAllAt=0, callDirAt={};
/* ทิศของเป้าเทียบ "หน้าเรา" — ผู้เล่นหันหน้าไป −Z ตอน yaw=0 (สูตรเดียวกับที่ทหารหันตัว) */
function bearingKey(x,y,z){
  const dx=x-px, dz=z-pz, flat=Math.hypot(dx,dz);
  if(Math.atan2(y-py,Math.max(1,flat))>0.96) return 'up';     // เกิน ~55° = อยู่บนหัว บอกซ้าย/ขวาไม่ช่วย
  let rel=Math.atan2(-dx,-dz)-yaw;                            // มุมที่ต้องหันเพิ่ม (บวก = หันซ้าย)
  rel=Math.atan2(Math.sin(rel),Math.cos(rel));                // wrap −π..π
  const cw=((-rel*180/Math.PI)%360+360)%360;                  // องศาตามเข็มนาฬิกาจากด้านหน้า
  return CALL_SECTORS[Math.round(cw/45)%8];
}
function clearSquadBubble(s){
  if(s.bubbleTm){ clearTimeout(s.bubbleTm); s.bubbleTm=0; }
  if(s.bubble){ if(s.bubble.parent) s.bubble.parent.remove(s.bubble);
    if(s.bubble.material.map) s.bubble.material.map.dispose(); s.bubble.material.dispose(); s.bubble=null; }
}
/* ป้ายคำตะโกน — ทำเอง ไม่ใช้ nameSprite เพราะอันนั้นตัดข้อความที่ 14 ตัวอักษร (ไทยยาวกว่านั้น) */
function callSprite(text){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=96;
  const x=cv.getContext('2d');
  x.fillStyle='rgba(10,20,34,.86)'; x.beginPath();
  if(x.roundRect) x.roundRect(6,14,500,68,14); else x.rect(6,14,500,68);
  x.fill();
  x.strokeStyle='rgba(255,214,120,.9)'; x.lineWidth=3; x.stroke();
  x.font='bold 46px system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
  let f=46; while(x.measureText(text).width>478 && f>22){ f-=2; x.font='bold '+f+'px system-ui,sans-serif'; }
  x.fillStyle='#ffe9a8'; x.fillText(text,256,50);
  return new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false}));
}
function squadShout(s,text,now){
  clearSquadBubble(s);
  const sp=callSprite(text); sp.scale.set(8,1.5,1); sp.userData.txt=text;
  sp.position.y=s.crouch?1.6:2.4;                            // เหนือหัวทหาร (หมอบ = เตี้ยลง)
  s.grp.add(sp); s.bubble=sp;
  s.bubbleTm=setTimeout(()=>clearSquadBubble(s),CALL_MS);
  s.callAt=now;
  /* 🚁 อยู่บนเฮลิ/เป็นพลปืน = ใบพัดกลบ + ไม่ได้อยู่กับหมู่แล้ว → เงียบเสียง เหลือแต่ป้าย */
  if(!inHeli&&!riding){
    const d=Math.hypot(s.grp.position.x-px, s.grp.position.z-pz);
    Snd.shout(d, Math.min(5,Math.max(2,Math.round(text.replace(/[!\s]/g,'').length/3))));
  }
}
function tickSquadCalls(now){
  if(!squad.length||!fighters.length||now<callAllAt) return;
  /* เตือนเฉพาะลำที่ใกล้ตัวเราสุด (ลำไกลลิบไม่ใช่ภัย = ไม่ต้องพูดถึง) */
  let best=null, bd=CALL_DIST;
  for(const f of fighters){
    const p=f.grp.position, d=Math.hypot(p.x-px,p.z-pz);
    if(d<bd){ bd=d; best=f; }
  }
  if(!best) return;
  const bp=best.grp.position, key=bearingKey(bp.x,bp.y,bp.z);
  if(now<(callDirAt[key]||0)) return;
  /* คนที่จะพูด = ทหารที่อยู่ใกล้เราพอได้ยิน และเพิ่งไม่ได้พูดไป */
  let who=null, wd=CALL_NEAR*CALL_NEAR;
  for(const s of squad){
    if(now-(s.callAt||0)<CALL_GAP_ONE) continue;
    const g=s.grp.position, d=(g.x-px)*(g.x-px)+(g.z-pz)*(g.z-pz);
    if(d<wd){ wd=d; who=s; }
  }
  if(!who) return;
  const lines=CALL_LINES[key];
  squadShout(who, lines[(Math.random()*lines.length)|0], now);
  callAllAt=now+CALL_GAP_ALL*rnd(.85,1.4);
  callDirAt[key]=now+CALL_GAP_DIR;
}
/* 💬 รอบ 522: ทหารตะโกน "ชนิดปืน/สถานะรบ" ให้สนามดูมีชีวิต (ผู้ใช้สั่ง)
   ต่างจากเตือนทิศ (tickSquadCalls) — อันนี้เป็นบทพูดปลุกใจ/ประจำปืน · ใช้ bubble+เสียงชุดเดียวกัน
   ใช้ callAllAt ร่วม (ไม่ตะโกนซ้อนกับเตือนทิศ) + chatAllAt คุมความถี่ตัวเอง (นาน ๆ ที) */
const CHAT_GAP_ALL=7000;
const CHAT_LINES={
  r93 :['สไนเปอร์เข้าที่!','เล็งนิ่ง ๆ รอจังหวะ','จัดหัวมันเอง!','นัดเดียวจอด!'],
  rifle:['KSR-77 พร้อมรบ!','ยิงคุ้มกัน เดินหน้า!','กราดให้เละเลย!','ลุยไม่ถอย!'],
  any :['ระวังตัวด้วยเพื่อน!','เราหนุนอยู่ข้างหลัง!','สู้ ๆ อย่าถอย!','เพื่อนสู้ ๆ!'],
};
let chatAllAt=0;
function tickSquadChatter(now){
  if(!squad.length||!fighters.length||now<callAllAt||now<chatAllAt) return;
  let who=null, wd=CALL_NEAR*CALL_NEAR;
  for(const s of squad){
    if(now-(s.callAt||0)<CALL_GAP_ONE) continue;
    const g=s.grp.position, d=(g.x-px)*(g.x-px)+(g.z-pz)*(g.z-pz);
    if(d<wd){ wd=d; who=s; }
  }
  if(!who) return;
  chatAllAt=now+CHAT_GAP_ALL*rnd(.8,1.5);
  callAllAt=now+CALL_GAP_ALL*rnd(.85,1.4);                 // กันเตือนทิศตามมาติด ๆ
  const byGun=CHAT_LINES[who.weapon]||CHAT_LINES.rifle;
  const pool=(Math.random()<0.6)?byGun:CHAT_LINES.any;    // ส่วนใหญ่บทประจำปืน บางทีปลุกใจทั่วไป
  squadShout(who, pool[(Math.random()*pool.length)|0], now);
}
/* 🚁 ฝูงเฮลิคอปเตอร์: บินวนแล้วยิงมิสไซล์ใส่เป้าอย่างเมามันส์ */
function tickHelis(dt,now){
  helis.forEach(h=>{
    h.ang+=h.spin*dt;
    const p=h.grp.position;
    const tx=Math.cos(h.ang)*h.rad, tz=Math.sin(h.ang)*h.rad;
    p.x+=(tx-p.x)*Math.min(1,dt*1.2); p.z+=(tz-p.z)*Math.min(1,dt*1.2);
    p.y+=(h.y-p.y)*Math.min(1,dt*.8);
    h.grp.rotation.y=Math.atan2(tx-p.x,tz-p.z)+Math.PI;
    h.grp.rotation.z=-h.spin*3.2;      // เอียงเข้าโค้ง
    h.grp.rotation.x=0.10;             // ก้มหัวแบบเฮลิฯ บินเดินหน้า
    h.rotor.rotation.y+=dt*38;
    h.trotor.rotation.x+=dt*46;
    if(now>h.shotAt){
      h.shotAt=now+HELI_GAP*rnd(.7,1.5);
      const tgt=fighters.length?fighters[(Math.random()*fighters.length)|0]:null;
      const aim=tgt?tgt.grp.position:((msOpen&&!msDead&&mother)?mother.position:null);
      if(!aim) return;
      const from=p.clone().add(new THREE.Vector3(0,-.6,0));
      const dir=new THREE.Vector3().subVectors(aim,from).normalize();
      const m=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,1.2,6),
        new THREE.MeshBasicMaterial({color:0xdddddd}));
      m.position.copy(from); scene.add(m);
      const tr=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffc46a,transparent:true,opacity:.85,
        blending:THREE.AdditiveBlending,depthWrite:false}));
      tr.scale.setScalar(1.6); scene.add(tr);
      missiles.push({mesh:m,trail:tr,v:dir.multiplyScalar(MIS_SPD*.5),lock:tgt,born:now,ally:true});
      Snd.missile();
    }
  });
}

/* ============================================================
   🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
   ผู้ใช้สั่ง: ให้ worldFlash (แฟลชปากลำกล้อง รอบ 469) กับไฟฉายมีบทบาทจริง
   ⚠️ กติกาความสนุก (ห้ามลืม): มืดได้ แต่ต้อง "ยังเห็นทางเดิน/ศัตรู" —
      hemi ต่ำสุด .34 + ฟ้าอมน้ำเงิน (ไม่ใช่ดำสนิท) · ยานลูกมีตาเขียว/ไอพ่น/ป้ายตัวอักษร
      เป็น MeshBasic/Sprite อยู่แล้ว จึงยังเห็นชัดกลางคืน (เช็กแล้วตอนทำ)
   ============================================================ */
const DAY  ={sky:0xd8c0a0,hemiSky:0xffe9c8,hemiGnd:0x6b5a42,hemi:.52,sun:.95,sunCol:0xfff0cc,
             rim:.30,rimCol:0x8aa4c8,fogN:55,fogF:WORLD*1.55,dome:1};
const NIGHT={sky:0x0a1224,hemiSky:0x2e4470,hemiGnd:0x11151f,hemi:.34,sun:.30,sunCol:0x9fc0ff,
             rim:.16,rimCol:0x46689c,fogN:38,fogF:WORLD*1.10,dome:.17,msEm:0x2a3f6e};
/* เก็บวัสดุลำยานไว้ดัน emissive ตอนกลางคืน — เก็บสี "ตอนกลางวัน" ของแต่ละชิ้นไว้ด้วย
   (โมเดล .glb ของผู้ใช้มี emissive เดิมไม่เท่ากัน ถ้า hard-code จะเพี้ยนตอนกลางวัน) */
function collectMsMats(root){
  msHullMats=[];
  root.traverse(o=>{ if(!o.material) return;
    (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{
      if(m&&m.emissive) msHullMats.push({m,base:m.emissive.getHex()}); });
  });
  applyNightLook(nightK);
}
let night=false, nightK=0;                    // nightK = ระดับความมืดจริง (ไล่นุ่ม ๆ ไม่กระตุก)
/* 🔄 รอบ 474: โหมดเวลา 3 ทาง — ปุ่มเดิมกดวน ☀️ → 🌙 → 🔄 (ไม่เพิ่มปุ่มใหม่ จอเด็กไม่รก)
   auto = ไล่เองรอบละ 4 นาที (กลางวัน ~2 นาที / กลางคืน ~2 นาที) เด็กเล่นรอบนึงเจอครบทั้งสองแบบ */
const CYCLE_MS=240000;
let dayMode='day', cycT=0, lastPhase=0;
const MODE_ICON={day:'☀️',night:'🌙',auto:'🔄'};
let streetLamps=[];                           // 💡 ไฟถนนติดเองตอนมืด (ดูหมายเหตุใน buildStreetLamps)
/* 🔦👾🔥🌠 รอบ 475: ของเล่นกลางคืนอีก 3 อย่าง — ไฟค้นหายานลูก · ถังไฟตามตรอก · ดาวตก */
let beams=[], barrels=[], starShot=null, starAt=0, caughtAt=0, caughtBanAt=0;
/* 🌫️🔇👤 รอบ 477: หมอกดึก · เสียงกลางคืน · ระบบย่อง (ดับไฟฉายแล้วศัตรูมองไม่ค่อยเห็น) */
let mists=[], flashOn=true, sneaking=false, sneakBanAt=0, torchBtn=null, sneakEl=null, cricketAt=0;
/* 🌪️🔭🏮 รอบ 479: พายุทราย · กล้องมองกลางคืน (ปลดล็อกด้วยการยิงเป้า) · แท่งไฟเรืองแสง */
const STORM_MS=32000, NV_NEED=5, GLOW_MAX=12;
let stormK=0, stormOn=false, stormAt=0, glowSticks=[], glowLeft=GLOW_MAX, glowBtn=null, nvBanAt=0;
let hemiL=null, sunL=null, rimL=null, skyDome=null, starPts=null, moonSpr=null;
let flashLight=null, nightBtn=null, msHullMats=[];
let vmHemi=null, vmSun=null, vmRim=null;      // ไฟใน vmScene (ปืนในมือ) — หรี่พร้อมฉาก

/* ⭐ โดมดาว + ดวงจันทร์ — ใช้ Points ก้อนเดียว (1 draw call) fog:false ไม่โดนหมอกกลืน */
function buildStars(){
  const N=620, R=WORLD*1.82, pos=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const a=rnd(0,TAU), h=Math.pow(Math.random(),.65);      // เกาะครึ่งบนฟ้าเป็นหลัก
    const y=h, r=Math.sqrt(Math.max(0,1-y*y));
    pos[i*3]=Math.cos(a)*r*R; pos[i*3+1]=y*R*.9+R*.06; pos[i*3+2]=Math.sin(a)*r*R;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  starPts=new THREE.Points(g,new THREE.PointsMaterial({color:0xdfe9ff,size:R*.006,
    transparent:true,opacity:0,depthWrite:false,fog:false,sizeAttenuation:true}));
  starPts.visible=false; scene.add(starPts);
  moonSpr=new THREE.Sprite(new THREE.SpriteMaterial({color:0xe8f0ff,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  moonSpr.scale.setScalar(R*.10);
  /* วางไว้ทางเดียวกับ "ดวงอาทิตย์" (70,90,120) เงาทุกอย่างในฉากจึงยังทอดทางเดิม ไม่ต้องคิดใหม่ */
  moonSpr.position.set(70,90,120).normalize().multiplyScalar(R*.86);
  moonSpr.visible=false; scene.add(moonSpr);
}
/* 💡 รอบ 474: ไฟถนนติดเองตอนมืด — แขวนบนแขนเสาไฟ 6 ต้นที่ buildWarStreet ทำไว้แล้ว
   ⚠️ ตั้งใจ "ไม่ใช้ PointLight จริง" — ไฟ 6 ดวงบังคับ three.js คอมไพล์เชเดอร์ใหม่ทุกวัสดุ มือถือตก FPS
      ใช้ดวงไฟเรืองแสง (Sprite additive) + วงแสงบนพื้น (แผ่นกลม additive) แทน = ไม่มีต้นทุนแสงเลย
   ตำแหน่งต้องตรงกับลูปเสาไฟใน buildWarStreet เป๊ะ (z=STREET_Z0-18-i*24 · สลับซ้ายขวา) */
function buildStreetLamps(){
  streetLamps=[];
  const poolTex=glowTex();
  for(let i=0;i<6;i++){
    const z=STREET_Z0-18-i*24, side=(i%2?1:-1);
    const x=side*(STREET_HW+1.2), base=terrainH(x,z), h=9.5;
    const lx=x-side*1.9, ly=base+h-.95;                       // ปลายแขนเสา
    const bulb=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffd9a0,transparent:true,opacity:0,
      blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    bulb.scale.setScalar(3.2); bulb.position.set(lx,ly,z); scene.add(bulb);
    const pool=new THREE.Mesh(new THREE.PlaneGeometry(11,11),
      new THREE.MeshBasicMaterial({map:poolTex,color:0xffca82,transparent:true,opacity:0,
        blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    pool.rotation.x=-Math.PI/2; pool.position.set(lx,terrainH(lx,z)+.06,z); scene.add(pool);
    streetLamps.push({bulb,pool,ph:Math.random()*TAU,flick:i===2?.55:1});   // ต้นที่ 3 = หลอดใกล้เสีย กะพริบ
  }
}
/* วงแสงนุ่ม ๆ วาดเอง (ไม่ต้องโหลดไฟล์ภาพ) */
function glowTex(){
  const c=document.createElement('canvas'); c.width=c.height=64;
  const g=c.getContext('2d'), rg=g.createRadialGradient(32,32,1,32,32,32);
  rg.addColorStop(0,'rgba(255,255,255,1)'); rg.addColorStop(.45,'rgba(255,255,255,.35)');
  rg.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=rg; g.fillRect(0,0,64,64);
  const t=new THREE.Texture(c); t.needsUpdate=true; return t;
}
function tickStreetLamps(now){
  if(!streetLamps.length) return;
  streetLamps.forEach(l=>{
    /* ⚠️ ห้ามทำหลอดเสียกะพริบถี่ (เคยลอง 2 ครั้ง/วิ = จอวูบตลอดเวลา ไม่เหมาะกับเด็ก)
       ใช้จังหวะช้า ~13 วิ วูบครั้งนึง สั้น ๆ พอให้ฉากมีชีวิต */
    const fl=l.flick<1 ? (Math.sin(now/2100+l.ph)>-.88 ? 1 : .28)
                       : .88+.12*Math.sin(now/430+l.ph);
    const a=nightK*fl;
    l.bulb.material.opacity=a*.95; l.bulb.visible=a>.02;
    l.pool.material.opacity=a*.42; l.pool.visible=a>.02;
  });
}
/* 👾🔦 รอบ 475: ยานลูกเปิดไฟค้นหากวาดพื้นตอนกลางคืน
   กติกาความสนุก (คิดเผื่อเด็กแล้ว): โดนไฟจับ = ลำนั้น "เร่งยิงเร็วขึ้น" + เตือนด้วยป้าย
   ❌ ไม่หักพลังเพิ่ม ไม่ล็อกตัว — แค่บีบให้ขยับหนี ไม่ใช่ลงโทษจนเล่นไม่สนุก
   ⚠️ ลำแสงต้องอยู่ใน scene (ไม่ใช่ลูกของ f.grp) เพราะตอนโมเดล .glb โหลดเสร็จ
      makeFighter จะล้างลูกทั้งหมดของ grp ทิ้ง ลำแสงจะหายไปด้วย */
function beamPair(){
  const cone=new THREE.Mesh(new THREE.ConeGeometry(1,1,14,1,true),
    new THREE.MeshBasicMaterial({color:0xbfe6ff,transparent:true,opacity:0,side:THREE.DoubleSide,
      blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  const pool=new THREE.Mesh(new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({map:glowTex(),color:0xcfeeff,transparent:true,opacity:0,
      blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  pool.rotation.x=-Math.PI/2;
  scene.add(cone); scene.add(pool);
  return {cone,pool};
}
function tickSearchBeams(now){
  const on=nightK>.06;
  fighters.forEach((f,i)=>{
    if(!beams[i]) beams[i]=beamPair();
    const b=beams[i];
    if(!on){ b.cone.visible=b.pool.visible=false; return; }
    const p=f.grp.position;
    /* จุดที่ลำแสงตกบนพื้น — กวาดเป็นวงรอบตัวลำ (แต่ละลำเฟสต่างกัน ไม่กวาดพร้อมกันเป็นแถว) */
    const a=now*.0006+i*2.1, sw=14+Math.sin(now*.00027+i)*7;
    const bx=p.x+Math.cos(a)*sw, bz=p.z+Math.sin(a)*sw;
    const gy=terrainH(bx,bz), h=Math.max(4,p.y-gy), r=Math.max(5,h*.30);
    b.cone.visible=b.pool.visible=true;
    b.cone.position.set((p.x+bx)/2,(p.y+gy)/2,(p.z+bz)/2);
    b.cone.scale.set(r,h,r);
    /* หันกรวยให้ปลายแหลมอยู่ที่ตัวลำ ฐานแผ่ลงพื้นตรงจุดที่ส่อง */
    b.cone.up.set(0,1,0);
    b.cone.lookAt(p.x,p.y,p.z);
    b.cone.rotateX(Math.PI/2);
    b.pool.position.set(bx,gy+.08,bz); b.pool.scale.set(r*2.6,r*2.6,1);
    /* 🚨 จับผู้เล่นได้ไหม */
    const hit=Math.hypot(px-bx,pz-bz)<r*.85;
    const col=hit?0xff6a4a:0xbfe6ff;
    b.cone.material.color.setHex(col); b.pool.material.color.setHex(hit?0xff8a5a:0xcfeeff);
    b.cone.material.opacity=nightK*(hit?.20:.11);
    b.pool.material.opacity=nightK*(hit?.62:.40);
    if(hit && !inHeli && !riding){
      caughtAt=now;
      f.shotAt=Math.min(f.shotAt,now+700);          // เร่งยิง แต่ยังทันหลบ
      if(now-caughtBanAt>5000){ caughtBanAt=now;
        toastBan('🚨 ไฟค้นหาจับเราได้!<span class="ib-sub">วิ่งออกจากวงแสง หรือหลบเข้าที่กำบังเร็ว!</span>',1500); }
    }
  });
  for(let i=fighters.length;i<beams.length;i++){ beams[i].cone.visible=beams[i].pool.visible=false; }
}

/* 🔥 รอบ 475: ถังไฟตามตรอก — หมุดนำทางกลางคืน (เห็นแต่ไกลว่าถนนไปทางไหน)
   ไฟลุกทั้งวันทั้งคืน (สมรภูมิจริงก็มีควันไฟ) แต่ "วงแสงบนพื้น" โผล่เฉพาะตอนมืด */
function buildBarrelFires(){
  barrels=[];
  const drumM=new THREE.MeshLambertMaterial({color:0x53433a});
  const tex=glowTex();
  [[-9.5,30],[8.5,66],[-8,104],[9.5,132],[-10,156]].forEach(([x,dz],i)=>{
    const z=STREET_Z0-dz, gy=terrainH(x,z);
    const drum=new THREE.Mesh(new THREE.CylinderGeometry(.52,.52,1.15,10,1,true),drumM);
    drum.position.set(x,gy+.58,z); scene.add(drum);
    const fire=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:0xff9a3a,transparent:true,opacity:.85,
      blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    fire.scale.setScalar(2.2); fire.position.set(x,gy+1.5,z); scene.add(fire);
    const pool=new THREE.Mesh(new THREE.PlaneGeometry(7,7),
      new THREE.MeshBasicMaterial({map:tex,color:0xff8a3a,transparent:true,opacity:0,
        blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    pool.rotation.x=-Math.PI/2; pool.position.set(x,gy+.07,z); scene.add(pool);
    barrels.push({fire,pool,ph:i*1.7});
  });
}
function tickBarrels(now){
  barrels.forEach(b=>{
    const f=.82+.18*Math.sin(now/95+b.ph)+.08*Math.sin(now/47+b.ph*2);   // เปลวไหว
    b.fire.scale.setScalar(2.2*f);
    b.fire.material.opacity=(.55+.35*nightK)*f;                          // กลางคืนเปลวเด่นขึ้น
    b.pool.material.opacity=nightK*.5*f; b.pool.visible=nightK>.03;
  });
}

/* 🌠 รอบ 475: ดาวตกพาดฟ้า — โผล่เฉพาะกลางคืน ทุก 9–22 วิ (ให้คืนไม่นิ่งเกินไป ไม่ถี่จนกวนสายตา) */
function tickShootingStar(now){
  if(!starShot){
    starShot=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:0xffffff,transparent:true,opacity:0,
      blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    starShot.visible=false; scene.add(starShot);
  }
  if(nightK<.55){ starShot.visible=false; starAt=0; return; }
  if(!starAt){ starAt=now+rnd(1500,8000); return; }
  const t=(now-starAt)/1200;                       // ช่วงวิ่ง 1.2 วิ
  if(t<0) return;
  if(t>1){ starAt=now+rnd(9000,22000); starShot.visible=false; return; }
  if(t<.02){                                       // สุ่มเส้นทางใหม่ตอนเริ่ม
    const a=rnd(0,TAU), R=WORLD*1.2;
    starShot.userData.a=a; starShot.userData.R=R; starShot.userData.h=rnd(120,300);
  }
  const u=starShot.userData, a=u.a, R=u.R;
  const x=Math.cos(a)*R*(1-2*t)+Math.sin(a)*R*.35, z=Math.sin(a)*R*(1-2*t)-Math.cos(a)*R*.35;
  starShot.visible=true;
  starShot.position.set(x,u.h-t*40,z);
  starShot.scale.set(30,30,1);
  starShot.material.opacity=Math.sin(t*Math.PI)*.9;
}
/* 🌫️ รอบ 477: หมอกลอยระดับพื้นตอนดึก — ทำให้ลำไฟฉาย/ไฟถนน "เห็นเป็นลำ" เด่นขึ้น
   ⚠️ ไม่ใช้ fog เพิ่ม (fog แน่นขึ้นแล้วยานแม่กับตัวอักษรจะจมหาย เคยพลาดมาแล้วรอบก่อน ๆ)
      ใช้แผ่นหมอกนุ่ม 10 แผ่น "เกาะรอบตัวผู้เล่น" แทน — ย้ายตามเราทุกเฟรม เลยใช้แค่ 10 ชิ้นก็พอทั้งแมป */
function buildMist(){
  mists=[]; const tex=glowTex();
  for(let i=0;i<10;i++){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),
      new THREE.MeshBasicMaterial({map:tex,color:0x9fb8d8,transparent:true,opacity:0,
        blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    m.rotation.x=-Math.PI/2; m.visible=false; scene.add(m);
    mists.push({m,a:(i/10)*TAU,r:14+Math.random()*30,sp:.03+Math.random()*.05,sc:26+Math.random()*22});
  }
}
function tickMist(now){
  /* 🌪️ รอบ 479: ตอนพายุใช้แผ่นหมอกชุดเดิมทำเป็น "ม่านทราย" (สีเปลี่ยน+เข้มขึ้น) ไม่ต้องสร้างของใหม่ */
  const k=Math.max(Math.max(0,(nightK-.45)/.55), stormK*.9);
  mists.forEach(o=>{
    if(k<=.02){ o.m.visible=false; return; }
    o.a+=o.sp*.016;
    const x=px+Math.cos(o.a)*o.r, z=pz+Math.sin(o.a)*o.r;
    o.m.visible=true;
    o.m.position.set(x,terrainH(x,z)+1.1+Math.sin(now/2600+o.a)*.35,z);
    o.m.scale.set(o.sc*(1+stormK*.5),o.sc*(1+stormK*.5),1);
    o.m.material.color.setHex(stormK>.3?0xc8a878:0x9fb8d8);
    o.m.material.opacity=k*(.10+stormK*.10);
  });
}

/* 🔇 รอบ 477: เสียงกลางคืน — ลมแผ่วลูปตลอด + จิ้งหรีดร้องเป็นระยะ
   ⚠️ ต้องหยุดตอนออกจากโลก (exitWorld เรียก stopNightAir) ไม่งั้นเสียงค้างในแท็บ */
Snd.nightAir=null; Snd.nightGain=null;
Snd.startNightAir=function(){
  if(!this.on()) return; const c=this.ac(); if(!c||this.nightAir) return;
  const buf=c.createBuffer(1,c.sampleRate*2,c.sampleRate), d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*.6;
  const n=c.createBufferSource(); n.buffer=buf; n.loop=true;
  const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=330;
  const g=c.createGain(); g.gain.value=0;
  n.connect(lp); lp.connect(g); g.connect(c.destination); n.start();
  this.nightAir=n; this.nightGain=g;
};
Snd.stopNightAir=function(){
  if(this.nightAir){ try{this.nightAir.stop()}catch(e){} this.nightAir=null; this.nightGain=null; }
};
Snd.cricket=function(v){
  if(!this.on()) return; const c=this.ac(); if(!c) return; const t=c.currentTime;
  const o=c.createOscillator(); o.type='triangle'; o.frequency.value=4300+Math.random()*900;
  const g=c.createGain(); g.gain.value=0;
  for(let i=0;i<3;i++){                                  // ริ่ว ๆ 3 พยางค์ เหมือนจิ้งหรีดจริง
    const st=t+i*.075;
    g.gain.setValueAtTime(0,st);
    g.gain.linearRampToValueAtTime(v,st+.012);
    g.gain.exponentialRampToValueAtTime(.0008,st+.055);
  }
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.26);
};
function tickNightSound(now){
  if(Snd.nightGain) Snd.nightGain.gain.value=.045*nightK+.075*stormK;   // ลมดังตามความมืด + แรงมากตอนพายุ
  if(nightK<.55 || !Snd.on()) return;
  if(!cricketAt){ cricketAt=now+900; return; }
  if(now>cricketAt){ cricketAt=now+rnd(1400,4200); Snd.cricket(.012+Math.random()*.012); }
}

/* 👤 รอบ 477: ระบบย่อง — ดับไฟฉาย + ไม่ยิงสักพัก = ศัตรูมองแทบไม่เห็นเรา
   (ให้เด็กมีทางเลือก "มืดแต่ปลอดภัย" คู่กับ "สว่างแต่โดนเล็ง" — ไม่ใช่แค่มืดแล้วลำบากอย่างเดียว) */
function tickSneak(now){
  const was=sneaking;
  sneaking = nightK>.55 && !flashOn && !inHeli && !riding && (now-lastFire>2200);
  if(sneakEl) sneakEl.classList.toggle('on',sneaking);
  if(sneaking && !was && now-sneakBanAt>20000){ sneakBanAt=now;
    toastBan('👤 กำลังย่อง!<span class="ib-sub">ดับไฟฉาย+ไม่ยิง = ศัตรูเล็งเราแทบไม่โดน · ยิงเมื่อไหร่ตำแหน่งแตกทันที</span>',2200); }
  if(torchBtn) torchBtn.style.display = nightK>.25 ? 'block' : 'none';   // กลางวันซ่อนปุ่ม
}
/* 🌪️ รอบ 479: พายุทรายพัดผ่านเป็นระยะ — ทัศนวิสัยลดชั่วคราว + ลมแรงขึ้น
   ⚠️ คุมไม่ให้เล่นไม่ได้: หมอกใกล้สุดยังเหลือ ~45% ของปกติ (เห็นตัวเอง/ทางเดิน/ศัตรูใกล้ได้อยู่)
      และพายุอยู่แค่ 32 วิ เว้นห่างกัน 2.5–4.5 นาที */
function tickStorm(dt,now){
  if(!stormAt){ stormAt=now+rnd(60000,120000); return; }
  if(!stormOn && now>stormAt){ stormOn=true; stormAt=now+STORM_MS;
    toastBan('🌪️ พายุทรายพัดมา!<span class="ib-sub">มองไกลไม่ค่อยเห็นสักพัก — ระวังยานลูกเข้าใกล้</span>',2400); }
  else if(stormOn && now>stormAt){ stormOn=false; stormAt=now+rnd(150000,270000);
    toastBan('🌤️ พายุผ่านไปแล้ว<span class="ib-sub">มองเห็นไกลเหมือนเดิม</span>',1800); }
  const tgt=stormOn?1:0;
  if(stormK!==tgt){                       // ไล่เข้า-ออก 3 วิ (ไม่ให้จอเปลี่ยนวูบ)
    stormK+=Math.min(dt/3,Math.abs(tgt-stormK))*(tgt>stormK?1:-1);
    applyNightLook(nightK);               // สีฟ้า/หมอกคิดรวมพายุอยู่ในฟังก์ชันเดียว
  }
}

/* 🔭 รอบ 479: กล้องมองกลางคืน — ปลดล็อกเมื่อยิงเป้าฝึกโดนครบ 5 ครั้ง (ต่อยอดระบบเป้ารอบ 473)
   ทำงานเฉพาะ "ตอนเรนเดอร์ภาพในเลนส์" — ดันแสงขึ้น + ย้อมเขียว แล้วคืนค่าทันทีหลังเรนเดอร์
   (จึงเห็นสว่างเฉพาะในวงเลนส์ ส่วนภาพนอกเลนส์ยังมืดตามจริง = เหมือน NV ของจริง) */
function nvReady(){ return nightK>.35 && trgHits>=NV_NEED; }
function nvEnter(){
  hemiL.intensity=1.45; hemiL.color.setHex(0x8effc0); hemiL.groundColor.setHex(0x1b3a26);
  sunL.intensity=.75; sunL.color.setHex(0x7dffb0);
  rimL.intensity=.35; rimL.color.setHex(0x4fe08a);
  scene.fog.color.setHex(0x08301c);
}
function nvExit(){ applyNightLook(nightK); }        // คืนค่าจากแหล่งเดียว ไม่ต้องจำค่าเก่าเอง
function tickNvHint(now){
  const ov=scopeRingEl&&scopeRingEl.parentElement;
  if(ov) ov.classList.toggle('nv', nvReady()&&adsT>0.12);
  if(nvReady() && now-nvBanAt>90000 && adsT<0.05){ nvBanAt=now;
    toastBan('🔭 ปลดล็อก "กล้องมองกลางคืน"!<span class="ib-sub">ยิงเป้าฝึกครบแล้ว — ส่องกล้องตอนมืดจะเห็นเป็นภาพเขียวสว่าง</span>',2600); }
}

/* 🏮 รอบ 479: แท่งไฟเรืองแสง — เด็กวางเองเป็น "ทางกลับบ้าน" / หมายจุดที่เคลียร์แล้ว
   วางได้ 12 แท่ง วางครบแล้วแท่งเก่าสุดจะดับไปให้เอง (ไม่บวมเป็นขยะในฉาก) */
function dropGlowStick(){
  if(!scene) return;
  const y=terrainH(px,pz);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:0x7dff9d,transparent:true,opacity:.9,
    blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  spr.scale.setScalar(2.0); spr.position.set(px,y+.5,pz); scene.add(spr);
  const pool=new THREE.Mesh(new THREE.PlaneGeometry(6,6),
    new THREE.MeshBasicMaterial({map:glowTex(),color:0x6cff9a,transparent:true,opacity:0,
      blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  pool.rotation.x=-Math.PI/2; pool.position.set(px,y+.05,pz); scene.add(pool);
  glowSticks.push({spr,pool,ph:Math.random()*TAU});
  if(glowSticks.length>GLOW_MAX){ const o=glowSticks.shift(); scene.remove(o.spr); scene.remove(o.pool); }
  glowLeft=Math.max(0,GLOW_MAX-glowSticks.length);
  if(glowBtn) glowBtn.querySelector('b').textContent=glowLeft;
  Snd.shell&&Snd.shell(1.2);          // เสียง "กริ๊ง" เบา ๆ ตอนวาง (ใช้เสียงปลอกกระสุนที่มีอยู่แล้ว)
  if(glowSticks.length===1) toastBan('🏮 วางแท่งไฟแล้ว!<span class="ib-sub">ใช้หมายทางกลับ หรือจุดที่เคลียร์แล้ว — วางได้ 12 แท่ง</span>',2000);
}
function tickGlowSticks(now){
  glowSticks.forEach(g=>{
    const f=.85+.15*Math.sin(now/520+g.ph);
    g.spr.material.opacity=(.45+.5*nightK)*f;
    g.pool.material.opacity=nightK*.45*f; g.pool.visible=nightK>.03;
  });
  if(glowBtn) glowBtn.style.display = nightK>.25 ? 'block' : 'none';
}
/* 🔦 ไฟฉายติดปืน — ต้องอยู่ใน scene หลัก (ตัวปืนอยู่ vmScene คนละฉาก ส่องออกมาไม่ถึงพื้น) */
function buildFlashlight(){
  flashLight=new THREE.SpotLight(0xfff0d2,0,72,.44,.55,1.2);
  flashLight.position.set(0,0,0);
  scene.add(flashLight); scene.add(flashLight.target);
}
function setNight(on,quiet){ setDayMode(on?'night':'day',quiet); }     // (ของเดิม — เผื่อโค้ด/เทสต์เก่าเรียก)
function setDayMode(m,quiet){
  dayMode=(m==='night'||m==='auto')?m:'day';
  night=(dayMode==='night');
  if(dayMode==='auto') cycT=nightK<.5?0:CYCLE_MS/2;         // เริ่มหมุนจาก "ตอนนี้" ไม่กระโดดแสง
  lastPhase=nightK<.5?0:1;
  if(nightBtn){ nightBtn.textContent=MODE_ICON[dayMode];
    nightBtn.classList.toggle('night',dayMode!=='day'); }
  state.invDayMode=dayMode; state.invNight=night;           // (invNight เก็บไว้ให้เซฟเก่าอ่านได้)
  if(typeof saveState==='function') saveState();
  if(quiet) return;
  toastBan(dayMode==='night'?'🌙 กลางคืน<span class="ib-sub">🔦 ไฟฉายติดปืนเปิดเอง · 💡 ไฟถนนติดแล้ว</span>'
          :dayMode==='auto' ?'🔄 เวลาเดินเอง<span class="ib-sub">กลางวัน→ตะวันตกดิน→กลางคืน วนรอบละ 4 นาที</span>'
                            :'☀️ กลางวัน<span class="ib-sub">กลับสู่ทะเลทรายแดดจ้า</span>',1900);
}
function tickNight(dt,now){
  if(dayMode==='auto'){
    cycT=(cycT+dt*1000)%CYCLE_MS;
    const ph=cycT/CYCLE_MS, raw=.5-.5*Math.cos(TAU*ph);
    nightK=raw*raw*(3-2*raw);                        // แต่งให้ "ค้างสว่าง/ค้างมืด" นานขึ้น ช่วงเปลี่ยนสั้นลง
    night=nightK>.5;
    applyNightLook(nightK);
    const phase=nightK>.5?1:0;                       // 🌇 บอกเด็กตอนข้ามช่วง (รอบละ 2 ครั้ง ไม่รก)
    if(phase!==lastPhase){ lastPhase=phase;
      toastBan(phase?'🌇 ตะวันกำลังตกดิน…<span class="ib-sub">เดี๋ยวไฟถนนกับไฟฉายจะติดเอง</span>'
                    :'🌅 ฟ้าสางแล้ว!<span class="ib-sub">มองเห็นสมรภูมิชัดขึ้นแล้วนะ</span>',2200); }
  }else{
    const tgt=night?1:0;
    if(nightK!==tgt){                                // ไล่ 2 วิ เต็มช่วง (ตาเด็กปรับตามทัน)
      const step=dt/2.0;
      nightK += Math.min(step,Math.abs(tgt-nightK))*(tgt>nightK?1:-1);
      applyNightLook(nightK);
    }
  }
  const nw=now||performance.now();
  tickStreetLamps(nw);
  tickSearchBeams(nw);              // 👾🔦 รอบ 475: ไฟค้นหาจากยานลูก
  tickBarrels(nw);                  // 🔥 รอบ 475: ถังไฟตามตรอก
  tickShootingStar(nw);             // 🌠 รอบ 475: ดาวตก
  tickMist(nw);                     // 🌫️ รอบ 477: หมอกระดับพื้นตอนดึก
  tickNightSound(nw);               // 🔇 รอบ 477: ลม + จิ้งหรีด
  tickSneak(nw);                    // 👤 รอบ 477: ย่องตอนดับไฟฉาย
  tickStorm(dt,nw);                 // 🌪️ รอบ 479: พายุทราย
  tickGlowSticks(nw);               // 🏮 รอบ 479: แท่งไฟที่วางไว้
  tickNvHint(nw);                   // 🔭 รอบ 479: ป้าย/ขอบเลนส์โหมดมองกลางคืน
  tickFlashlight();
}
function applyNightLook(k){
  if(!scene||!hemiL) return;
  const L=(a,b)=>a+(b-a)*k, C=(a,b)=>new THREE.Color(a).lerp(new THREE.Color(b),k);
  /* 🌇 รอบ 474: ช่วงกลางทาง (k≈.5) = ตะวันตกดิน/ฟ้าสาง → ผสมสีส้มเข้าไป
     ทำที่นี่ที่เดียว จึงได้ทั้งโหมดอัตโนมัติและตอนกดปุ่มสลับ (2 วินาทีนั้นจะกวาดสีส้มผ่านพอดี) */
  const dusk=1-Math.abs(2*k-1);
  const sky=C(DAY.sky,NIGHT.sky);
  if(dusk>.01) sky.lerp(new THREE.Color(0xff7a3c),dusk*.5);
  scene.background.copy(sky); scene.fog.color.copy(sky);
  scene.fog.near=L(DAY.fogN,NIGHT.fogN); scene.fog.far=L(DAY.fogF,NIGHT.fogF);
  hemiL.intensity=L(DAY.hemi,NIGHT.hemi);
  hemiL.color.copy(C(DAY.hemiSky,NIGHT.hemiSky)); hemiL.groundColor.copy(C(DAY.hemiGnd,NIGHT.hemiGnd));
  sunL.intensity=L(DAY.sun,NIGHT.sun); sunL.color.copy(C(DAY.sunCol,NIGHT.sunCol));
  rimL.intensity=L(DAY.rim,NIGHT.rim); rimL.color.copy(C(DAY.rimCol,NIGHT.rimCol));
  if(dusk>.01){                        // ⚠️ ต้องทำ "หลัง" ตั้งสีไฟข้างบน ไม่งั้นโดนเขียนทับ
    sunL.color.lerp(new THREE.Color(0xff9a48),dusk*.85);
    hemiL.color.lerp(new THREE.Color(0xffb070),dusk*.6);
  }
  /* ปืนในมืออยู่คนละฉาก (vmScene) — ต้องหรี่คู่กัน ไม่งั้นกลางคืนแล้วปืนยังโดนแดดเต็ม ๆ
     ⚠️ vm หรี่ "ไม่สุด" เท่าฉาก (คูณ .55 ของช่วงที่ลด) เพราะปืนคือของที่เด็กต้องเห็นตลอด */
  if(vmHemi){ const q=k*.55;
    vmHemi.intensity=.52+(NIGHT.hemi-.52)*q; vmHemi.color.copy(C(DAY.hemiSky,NIGHT.hemiSky));
    vmHemi.groundColor.copy(C(DAY.hemiGnd,NIGHT.hemiGnd));
    vmSun.intensity=.95+(NIGHT.sun-.95)*q; vmSun.color.copy(C(DAY.sunCol,NIGHT.sunCol));
    vmRim.intensity=.30+(NIGHT.rim-.30)*q; vmRim.color.copy(C(DAY.rimCol,NIGHT.rimCol));
  }
  /* 🌪️ รอบ 479: พายุทราย — ฟ้าขุ่นเป็นสีทราย + มองไกลไม่เห็น (คิดต่อจากค่ากลางวัน/กลางคืนด้านบน) */
  if(stormK>.005){
    scene.background.lerp(new THREE.Color(0xb08a5e),stormK*.55);
    scene.fog.color.copy(scene.background);
    scene.fog.far*=(1-.55*stormK); scene.fog.near*=(1-.35*stormK);
    hemiL.intensity*=(1-.22*stormK); sunL.intensity*=(1-.45*stormK);
  }
  if(skyDome) skyDome.material.color.setScalar(L(1,NIGHT.dome)*(1-.45*stormK));   // ภาพฟ้าหรี่ลงตอนคืน/พายุ
  if(starPts){ starPts.material.opacity=k*.95; starPts.visible=k>.03; }
  if(moonSpr){ moonSpr.material.opacity=k*.75; moonSpr.visible=k>.03; }
  /* 🛸 ยานแม่เรืองแสงเด่นขึ้น — ตัวลำเป็น Phong จะจมมืด ถ้าไม่ดัน emissive ขึ้น
     (ไฟสัญญาณ msLamps เป็น MeshBasic อยู่แล้ว = สว่างเท่าเดิม เลยยิ่งเด่นตัดกับฟ้ามืด) */
  msHullMats.forEach(e=>{ if(e.m&&e.m.emissive) e.m.emissive.copy(new THREE.Color(e.base).lerp(new THREE.Color(NIGHT.msEm),k)); });
}
function tickFlashlight(){
  if(!flashLight) return;
  const on = nightK>.04 && flashOn && !inHeli && !riding && adsT<.35;   // ส่องกล้อง/ปิดสวิตช์ = ดับ
  if(!on){ flashLight.intensity=0; return; }
  flashLight.intensity=2.9*nightK;
  const d=aimDir();
  const p=(muzzle&&gunGrp&&gunGrp.visible)?vmToWorld(muzzle):camera.position.clone();
  flashLight.position.copy(p);
  flashLight.target.position.copy(p).addScaledVector(d,45);
  flashLight.target.updateMatrixWorld();
}

/* ============================================================
   🔁 ลูปหลัก
   ============================================================ */
function fit(){
  if(!renderer) return;
  const w=window.innerWidth,h=window.innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
}
function tick(){
  if(!running) return;
  rafId=requestAnimationFrame(tick);
  const now=performance.now();
  let dt=(now-lastT)/1000; lastT=now;
  if(dt>.05) dt=.05;
  frame(dt,now);
}
function frame(dt,now){
  if(riding) tickGunner(dt,now); else if(inHeli) tickHeliFlight(dt,now); else tickPlayer(dt,now);
  updateGunnerBtn(now);           // 🎖️ ปุ่มขึ้นเป็นพลปืนโผล่เมื่อมีลำอยู่ใกล้
  tickFighters(dt,now);
  tickMother(dt,now);
  tickAlienShots(dt,now);
  tickMissiles(dt,now);
  tickSquad(dt,now);
  tickHelis(dt,now);
  peerTick(dt,now);                 // 🌐 ขยับตัวเพื่อนออนไลน์ให้ลื่น
  applyShared();                    // 🤝 รวมผลงานทุกคน → สู้ยานแม่ลำเดียวกัน
  netSend(false);                   // 🌐 ส่งตำแหน่งเราขึ้น DB
  tickReload(now);                  // 🎯 บรรจุกระสุน R93
  tickBarrelHeat(now);              // 🔥 รอบ 467: ปืนร้อน = ควันลอยจากลำกล้อง
  tickDust(dt,now);                 // 🌫️ ฝุ่นลอยตามลม
  tickHouseLod();                   // 🏠 บ้าน: ใกล้=โมเดลจริง · ไกล=กล่องแทน (คุมงบสามเหลี่ยม)
  tickPads(dt,now);                 // 🚁 ใบพัดลำที่จอด/ที่กำลังสตาร์ท
  tickBullets(now);                 // 🚀 รอบ 467: กระสุนที่กำลังเดินทางถึงเป้า
  tickTargets(now);                 // 🎯 รอบ 471: เป้าฝึกยิง (ล้ม/ตั้งใหม่/ซ่อนตัวไกล)
  tickNight(dt,now);                // 🌙 รอบ 471/474: ไล่แสงกลางวัน↔กลางคืน + ไฟถนน + ไฟฉายติดปืน
  if(worldFlash){                   // 🔥 รอบ 469: แสงแฟลชสาดฉากรอบตัว
    const k=Math.max(0,(muzzleUntil-now)/90);
    /* 🌙 กลางคืนดันให้แรง+ไกลขึ้น = ยิงทีนึงฉากทั้งซอยวาบ (บทบาทจริงตามที่ผู้ใช้สั่ง) */
    /* ⚠️ วัดจริงแล้วกลางคืนแฟลชแรงมาก (ความสว่างจอ 41→164) — คุมไว้ที่ +70% พอให้ตื่นเต้น
       แต่ไม่แสบตาเด็กตอนยิงรัว (ไฟติดแค่ ~2 เฟรม แล้วดับ) */
    worldFlash.intensity=k*k*13*(1+nightK*.70);
    worldFlash.distance=26+nightK*30;
    if(k>0 && muzzle) worldFlash.position.copy(vmToWorld(muzzle));
  }
  tickFx(dt);
  tickSelfShadow();                 // 🌤️ รอบ 466: เงาตัวเรา+ปืนทอดลงพื้น
  layoutCross();                  // 🎯 รอบ 458: จุดเล็งเลื่อนตามโหมด (เดินเท้า/ส่องกล้อง/เฮลิ)
  if(adsT>0.02){ layoutScope(now); tickRange(); }   // 🫁 ขอบเลนส์หายใจ · 📏 ระยะถึงเป้า
  renderer.render(scene,camera);
  renderViewModel();              // 🎥 รอบ 451: วาดปืนในมือทับภาพฉาก (กล้องแยก near .01)
  if(adsT>0.12){                    // 🔭 วาดภาพขยายในวงเลนส์ (โผล่ตามจังหวะยกปืน ไม่ตัดภาพ)
    const nv=nvReady();              // 🔭 รอบ 479: ดันแสง+ย้อมเขียวเฉพาะพาสนี้ แล้วคืนค่าทันที
    if(nv) nvEnter();
    renderScopePass();
    if(nv) nvExit();
  }
}

/* ============================================================
   ▶️ เข้า/ออกโลก
   ============================================================ */
function build(){
  buildDom();
  renderer=new THREE.WebGLRenderer({canvas:cvEl,antialias:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
  scene=new THREE.Scene();
  /* ☀️ ท้องฟ้าทะเลทรายอบอ้าว + หมอกฝุ่นหนาแบบภาพอ้างอิง (ตึกไกลจมฝุ่น เห็นเป็นเงาซีด) */
  const SKY=0xd8c0a0;
  scene.background=new THREE.Color(SKY);
  /* ⚠️ หมอกแน่นเกินไปกลืน "ตัวอักษรบนยานแม่" (อยู่ไกล ~259m) จนอ่านไม่ออก — เคยพลาดมาแล้ว
     คุมให้ตึกไกลยังจมฝุ่นสวย แต่ยานแม่ยังอ่านได้ (ตัวอักษรตั้ง fog:false เพิ่มอีกชั้นกันเหนียว) */
  scene.fog=new THREE.Fog(SKY,55,WORLD*1.55);
  const skyTex=new Image();
  skyTex.onload=()=>{ const t=new THREE.Texture(skyTex); t.needsUpdate=true;
    const dome=new THREE.Mesh(new THREE.SphereGeometry(WORLD*1.9,32,16),
      new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false}));
    scene.add(dome); skyDome=dome; applyNightLook(nightK); };   // 🌙 รอบ 471: โดมมาทีหลัง ต้องหรี่ตามทันที
  skyTex.onerror=()=>{};
  skyTex.src='img/invasion/sky.png';
  /* far ต้องไกลพอเห็นยานแม่ (อยู่ ~1,700-4,300m หลังขยาย 5 เท่า) ไม่งั้นลำถูกตัดหาย */
  camera=new THREE.PerspectiveCamera(FOV,innerWidth/innerHeight,.1,9000);
  scene.add(camera);
  /* 💡 แสงแบบภาพอ้างอิง: แดดแรงเฉียงจากด้านหลัง-ขวา + เงาฟ้าอมเทา + ฝุ่นฟุ้งรับแสง */
  hemiL=new THREE.HemisphereLight(0xffe9c8,0x6b5a42,.52); scene.add(hemiL);
  const sun=new THREE.DirectionalLight(0xfff0cc,.95); sun.position.set(70,90,120); scene.add(sun);
  const rim=new THREE.DirectionalLight(0x8aa4c8,.30); rim.position.set(-60,50,-90); scene.add(rim);
  sunL=sun; rimL=rim;                 // 🌙 รอบ 471: เก็บอ้างอิงไว้หรี่ตอนกลางคืน
  buildStars(); buildFlashlight();    // 🌙 ⭐ โดมดาว + 🔦 ไฟฉายติดปืน (อยู่ scene หลัก)
  buildTerrain();
  buildSelfShadow();                // 🌤️ รอบ 466
  /* 🔥 รอบ 469: ไฟแฟลชปากลำกล้อง "ส่องฉากจริง" — พื้นทราย/กำแพงรอบตัวสว่างวาบตอนยิง
     (คนละดวงกับ muzzleLight ที่อยู่ใน vmScene ซึ่งส่องเฉพาะตัวปืน) */
  worldFlash=new THREE.PointLight(0xffc070,0,26,1.7); scene.add(worldFlash);
  buildTown();
  buildWarStreet();                 // 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (กระสอบทราย/ซากรถ/เศษปูน/สายไฟ)
  buildStreetLamps();               // 💡 รอบ 474: ดวงไฟบนเสาถนน (ติดเองตอนมืด)
  buildBarrelFires();               // 🔥 รอบ 475: ถังไฟตามตรอก (หมุดนำทางกลางคืน)
  buildMist();                      // 🌫️ รอบ 477: แผ่นหมอกเกาะรอบตัวผู้เล่น
  buildTargets();                   // 🎯 รอบ 471: เป้าฝึกยิงตามปากตรอก/ริมกำแพง
  buildHouses();                    // 🏠 รอบ 431: บ้านที่วิ่งเข้าไปหลบซุ่มยิงได้
  buildHeliPads();                  // 🚁 รอบ 434: เฮลิคอปเตอร์จอด 5 ลำ (เดินไปขึ้นได้)
  findSniperSpots();                // 🎯 รอบ 431: หา "จุดสูงข่ม" บนเนินเขาไว้แนะนำในแผนที่
  buildDustMotes();                 // 🌫️ ฝุ่นฟุ้งในอากาศ
  buildMothership();
  buildGun();
  /* 👥 หน่วยรบภาคพื้น — ส่วนใหญ่หมอบยิงหลังแนวกระสอบทราย (เหมือนภาพอ้างอิง) ที่เหลือกระจายรอบ
     🔫 รอบ 519/521: โมเดล baked ถือปืนอบในตัว (ขยับเฉพาะขา) · รอบ 521 ผสม R93/KSR-77 ~ครึ่งต่อครึ่งให้ดูหลากหลาย */
  squadCoverSpots().forEach(s=>squad.push(makeSoldier(s.x,s.z,s.crouch,'c', rnd(0,1)<0.5?'rifle':'r93')));
  for(let i=squad.length;i<SQUAD_N;i++){
    const a=rnd(0,TAU), r=rnd(14,42);
    squad.push(makeSoldier(px+Math.cos(a)*r, pz+Math.sin(a)*r,false,'c', rnd(0,1)<0.5?'rifle':'r93'));
  }
  syncBotHelis();                   // 🚁 บอทขับเฮลิเฉพาะตอนเล่นคนเดียว (ผู้ใช้สั่ง)
  built=true;
}
function start(){
  if(typeof THREE==='undefined'){ if(typeof toast==='function') toast('⚠️ โหลดเอนจิน 3D ไม่สำเร็จ'); return; }
  if(!built) build();
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  wrapEl.classList.add('on');
  introEl.classList.add('on');
  exitBox.classList.remove('on');
  sessionCoins=0; sessionWords=0; renderCoins();
  hp=PLAYER_HP; heat=0; overheat=false; misLeft=MIS_MAX; misReloadAt=0;
  firing=false; isRun=false; runBtn.classList.remove('on');
  inHeli=false; wrapEl.classList.remove('fly'); heliBtn.classList.remove('flying'); heliBtn.textContent='🚁';
  phVel={x:0,y:0,z:0}; phClimb=0; phMisLeft=PH_MIS_MAX; phMisReloadAt=0; if(gunGrp) gunGrp.visible=true;
  Object.keys(peers).forEach(dropPeer); myChat=null; boardSig='';
  battleRound=0; myKill=0; myArmorDmg=0;                // 🤝 ล้างสถานะสมรภูมิร่วม
  callAllAt=0; callDirAt={}; squad.forEach(clearSquadBubble);   // 📣 รอบ 471: ล้างคูลดาวน์/ป้ายตะโกนค้าง
  riding=null; if(gunnerBtn) gunnerBtn.style.display='none';    // 🎖️ ล้างสถานะพลปืน
  weapon='rifle'; r93Ammo=WEAPONS.r93.mag; reloadAt=0; firedThisPress=false;   // 🎯 เริ่มด้วยไรเฟิลเสมอ
  useGunView();                                                                // 🔫 รอบ 463
  scopeMagIdx=1;                                                               // 🔎 เริ่มที่ 6×
  adsRaw=0; adsT=0; holdBreath=false; breathLeft=1;                             // 🎬 ล้างสถานะเล็ง
  breathHeld=false; breathStrainAt=0; breathVig=0;                              // 🫁 รอบ 505: ล้างสัญญาณลมหายใจ
  if(breathBtn) breathBtn.style.filter='';
  adsZoomG=0; adsBreathG=0; adsBoostG=0;                                        // 🔍🫁 รอบ 504: ล้างตัวคูณท่าเล็ง
  recPitch=0; recYaw=0; boltAt=0;                                               // 💥 ล้างแรงถอย
  setScoped(false); if(gunModels.rifle) gunModels.rifle.visible=true; if(gunModels.r93) gunModels.r93.visible=false;
  renderAmmo(); syncWeaponBtns();
  setDayMode(state.invDayMode||(state.invNight?'night':'day'),true);          // 🌙 รอบ 471/474: จำโหมดที่เลือกไว้
  if(dayMode!=='auto') nightK=night?1:0;
  cycT=0; applyNightLook(nightK);
  flashOn=true; sneaking=false; if(torchBtn) torchBtn.classList.remove('off');
  stormK=0; stormOn=false; stormAt=0;                                   // 🌪️ รอบ 479
  glowSticks.forEach(g=>{ scene.remove(g.spr); scene.remove(g.pool); });  // 🏮 ล้างแท่งไฟรอบก่อน
  glowSticks=[]; glowLeft=GLOW_MAX; if(glowBtn) glowBtn.querySelector('b').textContent=GLOW_MAX;
  if(sneakEl) sneakEl.classList.remove('on');
  mapPick=null; if(mapBoxEl) mapBoxEl.classList.remove('on');   // 🗺️ ล้างจุดที่เลือกไว้รอบก่อน
  if(chatBarEl) chatBarEl.classList.remove('on'); if(selfMsgEl) selfMsgEl.classList.remove('on');
  shake=0; fShots.forEach(s=>scene.remove(s.mesh)); fShots=[];
  missiles.forEach(m=>{ scene.remove(m.mesh); scene.remove(m.trail); }); missiles=[];
  fx.forEach(f=>scene.remove(f.o)); fx=[]; bullets=[];
  /* 🎯 รอบ 416: เกิดที่ "ปากถนน" หันหน้าเข้าเมือง — เปิดเกมมาเห็นถนนสมรภูมิ+ยานแม่เหนือปลายถนน */
  px=0; pz=STREET_Z0; py=terrainH(px,pz)+EYE; yaw=0; pitch=.30;
  lastYaw=yaw; lastPitch=pitch; lagYaw=0; lagPitch=0;      // 🌀 รอบ 464: กันปืนสะบัดตอนเข้าโลก
  swAmp=0; swPhase=0;                                      // 🤝 รอบ 501: เข้าโลกด้วยท่าถือนิ่ง ๆ
  swapAt=0; swapTo=null; swapSnd=0;
  msBeamAt=performance.now()+6000;
  renderHp(); renderHeat(); renderMissiles();
  fit();
  pickWord();
  netJoin();                                            // 🌐 เข้าห้องสมรภูมิออนไลน์ (เห็นเพื่อน map เดียวกัน)
  if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
  /* ⌨️ รอบ 436 (ผู้ใช้: "WASD ไม่ทำงาน ต้องใช้ลูกศร"):
     ต้นตอ = โค้ดเดิมอ่าน `e.key` ซึ่งเป็น "ตัวอักษรที่พิมพ์ออกมา" → สลับแป้นเป็นภาษาไทยแล้ว
     W กลายเป็น "ไ" · A="ฟ" · S="ห" · D="ก" → เทียบไม่ตรงเลย (ลูกศรไม่มีตัวอักษรจึงยังใช้ได้)
     แก้: อ่าน `e.code` = "ปุ่มตัวไหนบนแป้น" ไม่ขึ้นกับภาษา (โลก 3D อื่นใช้ e.code อยู่แล้ว)
     ยังรับ e.key ไว้เป็นตัวสำรอง เผื่อเบราว์เซอร์เก่าไม่มี e.code */
  const codeOf=e=>{
    const c=e.code||'';
    if(c) return c;
    const k=(e.key||'').toLowerCase();
    const map={w:'KeyW',a:'KeyA',s:'KeyS',d:'KeyD',q:'KeyQ',e:'KeyE',r:'KeyR',h:'KeyH',
               f:'KeyF',g:'KeyG',z:'KeyZ',b:'KeyB',n:'KeyN',' ':'Space',shift:'ShiftLeft',
               control:'ControlLeft',escape:'Escape',arrowup:'ArrowUp',arrowdown:'ArrowDown',
               arrowleft:'ArrowLeft',arrowright:'ArrowRight'};
    return map[k]||'';
  };
  keydownFn=e=>{
    const c=codeOf(e);
    if(c==='KeyW'||c==='ArrowUp') keys.w=true;
    else if(c==='KeyS'||c==='ArrowDown') keys.s=true;
    else if(c==='KeyA'||c==='ArrowLeft') keys.a=true;
    else if(c==='KeyD'||c==='ArrowRight') keys.d=true;
    else if(c==='ShiftLeft'||c==='ShiftRight') keys.shift=true;
    else if(c==='Space') keys.space=true;
    else if(c==='ControlLeft'||c==='ControlRight') keys.ctrl=true;
    else if(c==='KeyQ') keys.q=true;      // 🚁 หันลำซ้าย (เหมือนโลกเฮลิฯ)
    else if(c==='KeyE') keys.e=true;      // 🚁 หันลำขวา
    else if(c==='KeyR'&&!e.repeat) fireMissile(performance.now());
    else if(c==='KeyH'&&!e.repeat){ resumeAudio(); inHeli?exitHeli():enterHeli(); }
    else if(c==='KeyF'&&!e.repeat){ swapWeapon(); }          // 🎯 สลับปืน
    else if(c==='KeyG'&&!e.repeat){ setScoped(!scoped); }    // 🔭 ส่องกล้อง
    else if(c==='KeyZ'&&!e.repeat){ cycleScopeMag(); }       // 🔎 สลับกำลังขยาย
    else if(c==='KeyB'){ if(breathLeft>0) holdBreath=true; }  // 🫁 กลั้นหายใจ
    else if(c==='KeyN'&&!e.repeat){ setDayMode(dayMode==='day'?'night':dayMode==='night'?'auto':'day'); }  // 🌙 วนกลางวัน/คืน/อัตโนมัติ
    else if(c==='Escape'){ unlockMouse(); exitBox.classList.add('on'); }
    if(['KeyW','KeyA','KeyS','KeyD','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(c)) e.preventDefault();
  };
  keyupFn=e=>{
    const c=codeOf(e);
    if(c==='KeyW'||c==='ArrowUp') keys.w=false;
    else if(c==='KeyS'||c==='ArrowDown') keys.s=false;
    else if(c==='KeyA'||c==='ArrowLeft') keys.a=false;
    else if(c==='KeyD'||c==='ArrowRight') keys.d=false;
    else if(c==='ShiftLeft'||c==='ShiftRight') keys.shift=false;
    else if(c==='Space') keys.space=false;
    else if(c==='ControlLeft'||c==='ControlRight') keys.ctrl=false;
    else if(c==='KeyB') holdBreath=false;
    else if(c==='KeyQ') keys.q=false;
    else if(c==='KeyE') keys.e=false;
  };
  resizeFn=()=>{ fit(); fitSpawnMap(); layoutScope(); };
  window.addEventListener('keydown',keydownFn);
  window.addEventListener('keyup',keyupFn);
  window.addEventListener('resize',resizeFn);
  running=true; lastT=performance.now();
  rafId=requestAnimationFrame(tick);
}
function exitWorld(){
  running=false;
  cancelAnimationFrame(rafId);
  unlockMouse();
  window.removeEventListener('keydown',keydownFn);
  window.removeEventListener('keyup',keyupFn);
  window.removeEventListener('resize',resizeFn);
  Snd.stopHum(); Snd.stopRotor(); Snd.stopNightAir();   // 🔇 รอบ 477: กันเสียงลมค้างหลังออกจากโลก
  squad.forEach(clearSquadBubble);                      // 📣 รอบ 471: ป้ายตะโกนไม่ค้างข้ามรอบ
  netLeave();                                         // 🌐 ออกห้องสมรภูมิ + ลบตัวเองจาก DB
  keys={}; firing=false; joy.id=null; joy.dx=joy.dy=0; lookId=null;
  inHeli=false; riding=null; setScoped(false); wrapEl.classList.remove('on','fly','gunner','scoped');
  if(camera){ camera.fov=FOV; camera.updateProjectionMatrix(); }
  exitBox.classList.remove('on');
  if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
  saveState();
  if(typeof renderDashboard==='function') renderDashboard();
  if(sessionWords>0||sessionCoins>0){
    /* 📊 รอบ 473: ความแม่นยำจากการยิงเป้าฝึกซ้อม (โชว์เฉพาะตอนที่ได้ยิงจริง) */
    const acc=trgShots>0?Math.round(trgHits/trgShots*100):0;
    toast(`🛸 กลับจากสมรภูมิ — ปราบยานแม่ ${sessionWords} ลำ · +${fmtNum(sessionCoins)} 🪙`+
          (trgHits>0?` · 🎯 เข้าเป้า ${trgHits}/${trgShots} นัด (${acc}%)`:''));
  }
  if(quizEl) quizEl.classList.remove('on');
}

window.InvasionWorld={
  start,
  /* test hooks — ใช้เฉพาะตอนเทสต์ preview */
  _t:{
    get running(){return running}, set running(v){running=v},
    get word(){return word}, get letters(){return letters.map(l=>({ch:l.ch,down:l.down,op:l.mesh.material.opacity}))},
    get fighters(){return fighters.length},
    /* ⛰️ รอบ 431: ตรวจว่ายานลูกบินเลียดเนินจริง (ระยะห่างจากพื้นของแต่ละลำ) */
    get fighterClear(){return fighters.map(f=>+(f.grp.position.y-terrainH(f.grp.position.x,f.grp.position.z)).toFixed(1))},
    get msOpen(){return msOpen}, get msArmor(){return msArmor},
    get msDead(){return msDead}, get hp(){return hp}, get heat(){return heat}, set heat(v){heat=v}, get mis(){return misLeft},
    get coins(){return sessionCoins}, get words(){return sessionWords},
    get pos(){return {x:px,y:py,z:pz,yaw,pitch}},
    set pos(v){ if('x'in v)px=v.x; if('z'in v)pz=v.z; if('yaw'in v)yaw=v.yaw; if('pitch'in v)pitch=v.pitch; },
    get squad(){return squad.length}, get helis(){return helis.length},
    get squad0(){return squad[0]||null},   /* 🔧 debug รอบ 519: ดึงทหารในหมู่ตัวแรกมา render ดูท่า */
    /* 🎯 รอบ 471: เป้าฝึกยิง */
    get targets(){return targets.map(t=>({x:+t.c.x.toFixed(1),z:+t.c.z.toFixed(1),up:t.up,
      vis:t.grp.visible, rx:+t.grp.rotation.x.toFixed(2),
      d:+Math.hypot(px-t.c.x,pz-t.c.z).toFixed(1)}))},
    hitTarget:(i,p)=>hitTarget(targets[i||0],p), tickTargets, targetWord,
    rayTarget, envHit, get solids(){return solids.length},
    /* 🔎📊 รอบ 473: โจทย์แปลไทย + สถิติความแม่นยำ */
    get trgWords(){return targets.map(t=>t.w?t.w[0]:null)},
    get quiz(){return quizT?{th:quizT.w[1],en:quizT.w[0],i:targets.indexOf(quizT),
      shown:quizEl&&quizEl.classList.contains('on'),text:quizEl?quizEl.innerText:''}:null},
    newQuiz:()=>{ newQuiz(performance.now()); return quizT?quizT.w:null; },
    get trgStat(){return {shots:trgShots,hits:trgHits}},
    /* 🪖 รอบ 423: ตรวจข้อต่อทหาร */
    get squadRig(){ const s=squad[0]; if(!s) return null;
      const r={mode:s.mode,lookUp:+(s.lookUp||0).toFixed(3),static:!!s.static,glb:!!s.glb,joints:Object.keys(s.J).length};
      r.pose={}; Object.keys(s.J).forEach(k=>{ r.pose[k]=[+s.J[k].rotation.x.toFixed(3),+s.J[k].rotation.z.toFixed(3)]; });
      r.hipsY=+s.J.hips.position.y.toFixed(3); return r; },
    squadPose(i,mode){ const s=squad[i||0]; if(s){ s.mode=mode; poseSoldier(s,performance.now()); } return s?s.mode:null; },
    poseSoldier, buildSoldierRig, applySoldierGlb, SOLDIER_PARTS, autoRigSoldier, BODY_MAP, mergeMeshList, faceModelForward,
    get shots(){return fShots.length}, get missiles(){return missiles.length}, get fx(){return fx.length},
    get mother(){return mother}, get camera(){return camera}, get scene(){return scene},
    get renderInfo(){ return {calls:renderer.info.render.calls, tris:renderer.info.render.triangles,
                              geo:renderer.info.memory.geometries, tex:renderer.info.memory.textures}; },
    killOne(){ if(fighters.length) damageFighter(fighters[0],99,performance.now()); return fighters.length; },
    killAll(){ while(fighters.length) damageFighter(fighters[0],99,performance.now()); },
    hitMother(d){ damageMother(d||MS_HP); },
    fire(){ lastFire=0; fireGun(performance.now()); },
    missile(){ fireMissile(performance.now()); },
    hurt(d){ lastHurt=0; hurtPlayer(d||10,performance.now()); },
    step(dt,n){ for(let i=0;i<(n||1);i++) frame(dt||1/60,performance.now()); },
    pickWord, startWave, completeWord, exitWorld, fit, terrainAt:(x,z)=>terrainH(x,z),
    lockTarget, rayTarget, aimDir,
    /* 🚁🌐 รอบ 414 */
    get inHeli(){return inHeli}, enterHeli, exitHeli, get phMis(){return phMisLeft}, get phVel(){return {...phVel}},
    /* 🤝🗺️🚁 รอบ 417 */
    get round(){return battleRound}, get myKill(){return myKill}, get myArmorDmg(){return myArmorDmg},
    get isLeader(){return isLeader()}, get leader(){return leaderUid()}, get uid(){return myUid()},
    applyShared, adoptWord, setWord, dropFighter,
    get heliCount(){return heliCount()}, get bots(){return helis.length}, syncBotHelis,
    get landed(){return hLanded}, set landed(v){hLanded=v},
    openSpawnMap, applySpawnPick, drawSpawnMap, safeSpawn, zoneName,
    /* 🏠🎯 รอบ 431 */
    get houses(){return houses.map(h=>({x:h.grp.position.x,z:h.grp.position.z,ready:!!h.blk,
      detail:!!(h.detail&&h.detail.visible),proxy:h.proxy.visible}))},
    get sniperSpots(){return sniperSpots.map(s=>({x:+s.x.toFixed(0),z:+s.z.toFixed(0),e:+s.e.toFixed(1)}))},
    houseBlocked, houseCover, tickHouseLod, get inCover(){return inCover},
    get glbCache(){return glbCache}, loadSoldierGlb, faceModelForward,
    /* 🚁 รอบ 434: เฮลิจอด */
    get pads(){return pads.map(p=>({x:+p.x.toFixed(1),z:+p.z.toFixed(1),rot:+p.rot.toFixed(2),ready:!!p.model,vis:p.grp.visible}))},
    get heliReady(){return heliReady}, get seat(){return seatLv}, setSeatView, padAt, get myPad(){return myPad?myPad.idx:null},
    get startText(){return startEl?startEl.textContent:''}, get heliBtnShown(){return heliBtn&&heliBtn.style.display==='block'},
    get coverShown(){return coverEl&&coverEl.classList.contains('on')},
    /* 🎖️ รอบ 418: พลปืนประจำประตู */
    get riding(){return riding}, boardGunner, dismountGunner, nearestRideable, rideableHelis, ridePos, findRide,
    /* 🎯 รอบ 419: R93 */
    get weapon(){return weapon}, swapWeapon, applyWeapon, tickSwap, get swapping(){return !!swapAt},
    Snd, get swapSnd(){return swapSnd}, get muzzleLight(){return muzzleLight},
    /* 🚀🔥🔓 รอบ 467 */
    get bullets(){return bullets.length}, tickBullets, tickBarrelHeat, envHit, bulletHole, get holes(){return holes.length},
    get boltHeld(){const r=gunModels.r93&&gunModels.r93.userData.boltRig; return !!(r&&r.held)}, setScoped, get scoped(){return scoped},
    get ammo(){return r93Ammo}, get reloading(){return reloadAt>0}, startReload, tickReload,
    get fov(){return camera.fov}, scopeRadius, layoutScope, renderScopePass, stretchGunBarrel, mergeGunParts, orientGunModel,
    get magnify(){return curMag().m}, cycleScopeMag, scopeFovDeg,
    /* 🎬 รอบ 422: แอนิเมชัน ADS */
    get adsT(){return adsT}, get adsRaw(){return adsRaw}, scopeRadiusNow, tickAds,
    /* 🏃 รอบ 448: ท่าลดปืนตอนวิ่ง */
    get sprintT(){return +sprintT.toFixed(3)}, set moveLen(v){moveLen=v}, get moveLen(){return moveLen},
    /* 🫁💨 รอบ 449 */
    get fatigue(){return +fatigue.toFixed(3)}, get sprintTime(){return +sprintTime.toFixed(2)},
    get smokeCount(){return fx.filter(f=>f.kind==='smoke').length}, muzzleSmoke,
    get recoil(){return {pitch:+recPitch.toFixed(5), yaw:+recYaw.toFixed(5)}}, addRecoil, applyRecoil,
    /* 💥 รอบ 500: ค่าแรงถอยของกระบอกที่ถืออยู่ + จูนสด (คืนบรรทัดพร้อมวางทับ REC_BY_GUN) */
    get recCfg(){ return Object.assign({weapon, own:!!REC_BY_GUN[weapon]}, recCfg()); },
    get gunRecoil(){ return +gunRecoil.toFixed(3); },
    setRecoil(o){ o=o||{};
      const c=REC_BY_GUN[weapon]||(REC_BY_GUN[weapon]=Object.assign({},REC_DEFAULT));
      Object.keys(o).forEach(k=>{ if(k in c && typeof o[k]==='number') c[k]=o[k]; });
      return {weapon, cfg:Object.assign({},c),
        line:`  ${weapon}: { up:${c.up}, side:${c.side}, recover:${c.recover}, climb:${c.climb}, climbMax:${c.climbMax}, ads:${c.ads}, gun:${c.gun}, gunBack:${c.gunBack} },`}; },
    resetRecoil(){ recPitch=0; recYaw=0; shotIdx=0; lastShotAt=0; gunRecoil=0; },
    /* 🤝 รอบ 501: weapon sway — ดูสถานะ/ออฟเซ็ตล่าสุด + จูนสด (คืนบรรทัดพร้อมวางทับ SWAY) */
    get sway(){ const f=n=>+n.toFixed(4);
      return {amp:f(swAmp), phase:f(swPhase), moveLen:f(moveLen), adsT:f(adsT),
        off:{x:f(swLast.x),y:f(swLast.y),z:f(swLast.z),rx:f(swLast.rx),ry:f(swLast.ry),rz:f(swLast.rz)},
        cfg:Object.assign({},SWAY)}; },
    setSway(o){ o=o||{};
      Object.keys(o).forEach(k=>{ if(k in SWAY && typeof o[k]==='number') SWAY[k]=o[k]; });
      return {cfg:Object.assign({},SWAY)}; },
    tickSway,
    get boltActive(){return !!boltAt}, get boltKnobZ(){return (gunModels.r93&&gunModels.r93.userData.bolt)?+gunModels.r93.userData.bolt.position.z.toFixed(3):null},
    /* 🔩 รอบ 447: ตรวจคันรั้งลูกเลื่อนของโมเดลจริง */
    get boltRig(){ const r=gunModels.r93&&gunModels.r93.userData?gunModels.r93.userData.boltRig:null;
      return r?{lift:+r.pivot.rotation.z.toFixed(3), back:+(r.pivot.position.z-r.z0).toFixed(3), ejected:r.ejected}:null; },
    tickBolt, attachBoltHandle,
    get breath(){return {hold:holdBreath,left:+breathLeft.toFixed(3)}}, set hold(v){holdBreath=!!v},
    /* 🫁🌑 รอบ 505: สัญญาณลมหายใจ — ดูสถานะ/นับเสียงที่สร้างจริง + จูนสด */
    get breathFx(){ return {hold:breathHeld, left:+breathLeft.toFixed(3), vig:+breathVig.toFixed(4),
      n:Object.assign({},Snd.breathN), cfg:Object.assign({},BREATH_FX)}; },
    setBreathFx(o){ o=o||{};
      Object.keys(o).forEach(k=>{ if(k in BREATH_FX && typeof o[k]==='number') BREATH_FX[k]=o[k]; });
      return {cfg:Object.assign({},BREATH_FX)}; },
    /* ข้ามการไล่นุ่ม — ให้ความมืดเข้าที่ทันทีตอนวัด */
    snapBreathFx(){ breathVig=(breathHeld?Math.pow(1-breathLeft,1.6)*Math.min(1,adsT):0); return +breathVig.toFixed(4); },
    tickBreathFx,
    /* 🔧 รอบ 457: จูนท่าปืนด้วยคำสั่งสั้น (ดู TUNE ZONE + tools/gunlab.js) */
    gunSil, setGunPose,
    /* 🎯 รอบ 499: จูน "ท่าเล็ง ADS" ของกระบอกที่ถืออยู่ — {x,y,z,rx,ry,rz,s} (คืนบรรทัดพร้อมวางทับ ADS_BY_GUN) */
    get adsView(){ const v=adsView(); return {weapon, p:v.p.slice(), r:v.r.slice(), s:v.s, own:!!ADS_BY_GUN[weapon]}; },
    setAdsPose(o){ o=o||{};
      const v=ADS_BY_GUN[weapon]||(ADS_BY_GUN[weapon]={p:ADS_POS.slice(), r:ADS_ROT.slice(), s:ADS_SCALE});
      if(typeof o.x==='number')v.p[0]=o.x; if(typeof o.y==='number')v.p[1]=o.y; if(typeof o.z==='number')v.p[2]=o.z;
      if(typeof o.rx==='number')v.r[0]=o.rx; if(typeof o.ry==='number')v.r[1]=o.ry; if(typeof o.rz==='number')v.r[2]=o.rz;
      if(typeof o.s==='number')v.s=o.s;
      const f=n=>(+n).toFixed(3);
      return {weapon, p:v.p.slice(), r:v.r.slice(), s:v.s,
        line:`  ${weapon}: {p:[${v.p.map(f).join(',')}], r:[${v.r.map(f).join(',')}], s:${f(v.s)}},`}; },
    /* 🔍🫁 รอบ 504: ตัวคูณบวกทับท่าเล็ง (ซูม/ประทับแก้ม) — ดูสถานะ + จูนสด */
    get adsBoost(){ const f=n=>+n.toFixed(5);
      return {weapon, mag:curMag().m, zoom:f(adsZoomG), breath:f(adsBreathG), total:f(adsBoostG),
        yFix:ADS_BOOST.yFix[weapon]||0, cfg:JSON.parse(JSON.stringify(ADS_BOOST))}; },
    setAdsBoost(o){ o=o||{};
      if(typeof o.m4==='number')ADS_BOOST.mag[4]=o.m4;
      if(typeof o.m6==='number')ADS_BOOST.mag[6]=o.m6;
      if(typeof o.m8==='number')ADS_BOOST.mag[8]=o.m8;
      if(typeof o.breath==='number')ADS_BOOST.breath=o.breath;
      if(typeof o.yFix==='number')ADS_BOOST.yFix[weapon]=o.yFix;
      ['lerp','breathIn','breathOut'].forEach(k=>{ if(typeof o[k]==='number')ADS_BOOST[k]=o[k]; });
      return {cfg:JSON.parse(JSON.stringify(ADS_BOOST))}; },
    /* ข้ามการไล่นุ่ม — ใช้ตอนวัด (ให้ค่าเข้าที่ทันทีไม่ต้องรอ lerp) */
    snapAdsBoost(){ const magT=(magList().length>1)?(ADS_BOOST.mag[curMag().m]||0):0;
      adsZoomG=magT; adsBreathG=(holdBreath&&breathLeft>0&&adsT>0.5)?ADS_BOOST.breath:0;
      adsBoostG=adsZoomG+adsBreathG; return adsBoostG; },
    /* 🔭🫨 รอบ 506: ความนิ่งตามกำลังขยาย — ดูสถานะ + จูนสด
       ang = ตัวคูณ "มุมแกว่งจริง" · hold = steady ตอนกลั้นหายใจ · read = ที่ตาเห็นในเลนส์ (ang×m/baseMag) */
    get swayMag(){ const L=magList(), m=curMag().m, f=n=>+n.toFixed(5);
      return {weapon, mag:m, ang:f(swMagG), hold:f(swHoldG),
        read:f(swMagG*m/L[0].m), readHold:f(swMagG*swHoldG*m/L[0].m),
        cfg:JSON.parse(JSON.stringify(SWAY_MAG))}; },
    setSwayMag(o){ o=o||{};
      if(typeof o.r4==='number')SWAY_MAG.read[4]=o.r4;
      if(typeof o.r6==='number')SWAY_MAG.read[6]=o.r6;
      if(typeof o.r8==='number')SWAY_MAG.read[8]=o.r8;
      ['hold','gun','lerp'].forEach(k=>{ if(typeof o[k]==='number')SWAY_MAG[k]=o[k]; });
      return {cfg:JSON.parse(JSON.stringify(SWAY_MAG))}; },
    /* ข้ามการไล่นุ่ม — ใช้ตอนวัด */
    snapSwayMag(){ const L=magList(), multi=L.length>1;
      const rd=multi?(SWAY_MAG.read[curMag().m]||1):1;
      swMagG=multi? rd*L[0].m/curMag().m : 1; swHoldG=SWAY_MAG.hold/rd;
      return {ang:swMagG, hold:swHoldG}; },
    tickSwayMag,
    /* 🫁💨 รอบ 508: จังหวะ "ลมหมดคาปุ่ม" — ดูสถานะ + จูนสด + ยิงเองตอนวัด
       t = วินาทีตั้งแต่ลมหมด (<0 = ไม่มี) · drop = ซองการตก 0..1 · shake = ซองการหอบ 0..1
       dropDeg = มุมที่กดกล้องลงตอนนี้ (องศา) · dropPct = ตกกี่ % ของความสูงจอตอนนี้ */
    get gasp(){ const f=n=>+n.toFixed(5);
      return {t:f(gaspTime), drop:f(gaspDrop), shake:f(gaspShake), mul:f(gaspMul()),
        dropDeg:f(gaspPitchNow()*180/Math.PI), dropPct:f(GASP.drop*gaspDrop*100),
        fov:camera?+camera.fov.toFixed(3):null, cfg:JSON.parse(JSON.stringify(GASP))}; },
    setGasp(o){ o=o||{};
      ['drop','dropIn','dropOut','mul','hold','ease','fat','gunY','gunPitch']
        .forEach(k=>{ if(typeof o[k]==='number')GASP[k]=o[k]; });
      return {cfg:JSON.parse(JSON.stringify(GASP))}; },
    fireGasp, clearGasp, tickGasp,
    /* 🎯 รอบ 458: ตำแหน่งจุดเล็งบนจอ */
    get aimOff(){return aimOffNow()},
    /* 🎯 รอบ 490: จูน "เฉพาะกระบอกที่ถืออยู่" — กระบอกที่มีค่าแยก (AIM_BY_GUN) จะไม่ไปแตะค่ากลาง
       ⛔ อย่าแก้ AIM_OFF เพื่อปืนกระบอกเดียว (รอบ 488 ทำแล้วไรเฟิลเล็งเสีย) */
    setAimOff(y,x){ const own=!!AIM_BY_GUN[weapon], a=own?AIM_BY_GUN[weapon]:AIM_OFF;
      if(typeof y==='number')a[1]=y; if(typeof x==='number')a[0]=x; layoutCross();
      return {weapon, aimOff:a.slice(), shared:!own,
        line: own?`AIM_BY_GUN={ ${weapon}:[${a[0]},${a[1]}] };`:`const AIM_OFF=[${a[0]},${a[1]}];`}; },
    aimDir, layoutCross,
    /* 🎥🎯 รอบ 451 */
    get gunGrp(){return gunGrp}, get vmScene(){return vmScene}, get vmCam(){return vmCam},
    get gunModels(){return gunModels}, alignGunMuzzle, syncMuzzleAnchor, vmToWorld,
    get muzzleAnchor(){return muzzle?muzzle.position.toArray().map(n=>+n.toFixed(3)):null},
    get gunPose(){return gunGrp?{p:gunGrp.position.toArray().map(n=>+n.toFixed(3)),
      r:gunGrp.rotation.toArray().slice(0,3).map(n=>+n.toFixed(3)), s:+gunGrp.scale.x.toFixed(3)}:null},
    get magLabel(){return curMag().label}, get magBtnShown(){return magBtn.style.display==='block'},
    get weaponBtns(){return {swap:swapBtn.textContent,
      scopeShown:scopeBtn.style.display==='block', ammoText:ammoEl.innerText.replace(/\s+/g,' ')}},
    get gunnerBtnShown(){return gunnerBtn && gunnerBtn.style.display==='block'},
    get gunnerClass(){return wrapEl.classList.contains('gunner')},
    get mapPick(){return mapPick}, set mapPick(v){mapPick=v},
    get mapOpen(){return mapBoxEl.classList.contains('on')},
    get core(){return msCore}, get letterBoard(){return msBoard},
    get peerCount(){return Object.keys(peers).length}, get peers(){return Object.keys(peers).map(u=>({n:peers[u].n,kind:peers[u].kind,w:peers[u].w,pos:{...peers[u].cur}}))},
    fakePeer(uid,d){ onPeer({key:uid,val:()=>Object.assign({n:'เทส '+uid,x:0,z:60,y:0,yaw:0,av:'foot',w:0},d||{})}); return peers[uid]; },
    /* 📣 รอบ 471: ทหารตะโกนบอกทิศ */
    bearingKey, tickSquadCalls, squadShout, CALL_LINES,
    get threats(){ return fighters.map(f=>{ const p=f.grp.position, flat=Math.hypot(p.x-px,p.z-pz);
      return {flat:+flat.toFixed(1), up:+(Math.atan2(p.y-py,Math.max(1,flat))*180/Math.PI).toFixed(0),
              key:bearingKey(p.x,p.y,p.z)}; }).sort((a,b)=>a.flat-b.flat); },
    get shouts(){ return squad.map((s,i)=>({i,txt:s.bubble?s.bubble.userData.txt:null,
      d:+Math.hypot(s.grp.position.x-px,s.grp.position.z-pz).toFixed(1)})).filter(r=>r.txt); },
    resetCalls(){ callAllAt=0; callDirAt={}; squad.forEach(s=>{ clearSquadBubble(s); s.callAt=0; }); },
    /* 🌙 รอบ 471: โหมดกลางคืน */
    setNight, setDayMode, applyNightLook, tickNight, tickFlashlight,
    get dayMode(){return dayMode}, set cycT(v){cycT=v},
    get lampInfo(){ return streetLamps.map(l=>({b:+l.bulb.material.opacity.toFixed(2),
      p:+l.pool.material.opacity.toFixed(2), vis:l.bulb.visible})); },
    /* 🔦🔥🌠 รอบ 475 */
    get beamInfo(){ return beams.filter(b=>b.cone.visible).map(b=>({
      x:+b.pool.position.x.toFixed(1), z:+b.pool.position.z.toFixed(1),
      r:+(b.pool.scale.x/2.6/2).toFixed(1), o:+b.cone.material.opacity.toFixed(3),
      red:b.cone.material.color.getHexString()==='ff6a4a'})); },
    get caught(){ return performance.now()-caughtAt<200; },
    get barrelInfo(){ return barrels.map(b=>({f:+b.fire.material.opacity.toFixed(2),
      p:+b.pool.material.opacity.toFixed(2)})); },
    get starInfo(){ return starShot?{vis:starShot.visible,o:+starShot.material.opacity.toFixed(2),
      y:+starShot.position.y.toFixed(0)}:null; },
    set starAt(v){ starAt=v; },
    /* 🌫️🔇👤 รอบ 477 */
    get flashOn(){return flashOn}, set flashOn(v){flashOn=v; if(torchBtn) torchBtn.classList.toggle('off',!v);},
    get sneaking(){return sneaking},
    get mistInfo(){ return {n:mists.filter(o=>o.m.visible).length,
      o:mists[0]?+mists[0].m.material.opacity.toFixed(3):null}; },
    get torchShown(){ return torchBtn && torchBtn.style.display==='block'; },
    get nightAirGain(){ return Snd.nightGain?+Snd.nightGain.gain.value.toFixed(4):null; },
    /* 🌪️🔭🏮 รอบ 479 */
    get stormK(){return +stormK.toFixed(3)}, set stormAt(v){stormAt=v},
    startStorm(){ stormOn=true; stormAt=performance.now()+STORM_MS; },
    get fogNow(){ return {near:Math.round(scene.fog.near),far:Math.round(scene.fog.far),
      sky:'#'+scene.background.getHexString()}; },
    nvReady, nvEnter, nvExit, get nvClass(){ return scopeRingEl.parentElement.classList.contains('nv'); },
    dropGlowStick, get glowInfo(){ return {n:glowSticks.length,left:glowLeft,
      o:glowSticks[0]?+glowSticks[0].spr.material.opacity.toFixed(2):null,
      shown:glowBtn&&glowBtn.style.display==='block'}; },
    /* 🧪 เดินเฟรมเองทีละก้าว — แท็บ preview ที่ไม่ได้อยู่หน้าจอ rAF ไม่วิ่ง (document.hidden) */
    stepFrame(dt){ frame(dt||1/60, performance.now()); },
    get night(){return night}, get nightK(){return nightK},
    set nightK(v){ nightK=v; applyNightLook(v); },
    get lightInfo(){ return {hemi:+hemiL.intensity.toFixed(3), sun:+sunL.intensity.toFixed(3),
      sky:'#'+scene.background.getHexString(), fogFar:Math.round(scene.fog.far),
      dome:skyDome?+skyDome.material.color.r.toFixed(2):null,
      stars:starPts?+starPts.material.opacity.toFixed(2):null, starsVis:!!(starPts&&starPts.visible),
      vmHemi:+vmHemi.intensity.toFixed(3)}; },
    get flashInfo(){ return {on:flashLight.intensity>0, i:+flashLight.intensity.toFixed(2),
      p:flashLight.position.toArray().map(n=>+n.toFixed(1)),
      t:flashLight.target.position.toArray().map(n=>+n.toFixed(1))}; },
    get worldFlashInfo(){ return {i:+worldFlash.intensity.toFixed(2), d:+worldFlash.distance.toFixed(1)}; },
    dropPeer, netReady, sendChat, get board(){return boardEl?boardEl.innerText.replace(/\s+/g,' '):''},
    get flyClass(){return wrapEl.classList.contains('fly')},
  }
};
})();
