/* 🛸 invasion3d.js — โลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
   FPS สไตล์ Delta Force ในเมืองทะเลทรายตะวันออกกลาง — ยานแม่ลำมหึมาลอยเต็มท้องฟ้า (สไตล์ ID4)
   บนท้องยานแม่มีช่องตัวอักษรเรียงเป็น "คำศัพท์ 1 คำ" ขนาดใหญ่ · ยานลูก = จำนวนตัวอักษรของคำ
   ยิงยานลูกตกทีละลำ → ตัวอักษรประจำลำนั้นบนยานแม่กะพริบ · ครบทุกลำ → ตัวอักษรกะพริบทั้งแถว
   → เกราะยานแม่เปิด ระดมยิง/มิสไซล์ใส่จนระเบิด = ครบ 1 คำ 🪙INV_REWARD
   👥 พันธมิตร AI: หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์ ช่วยยิงอย่างเมามันส์
   🧩 โมเดลจริง (ถ้าผู้ใช้วางไฟล์ไว้ จะสลับใช้อัตโนมัติ ไม่ต้องแก้โค้ด):
      img/models/mothership.glb · img/models/alien_fighter.glb · img/models/gun_rifle.glb
      img/invasion/sky.webp (ท้องฟ้า 360°) · img/invasion/sand.jpg · img/invasion/wall.jpg
   โหลดขี้เกียจผ่าน enterInvasion3D (ui.js) — ไม่แตะ adventure3d.js */
(function(){
'use strict';

/* ============================================================
   ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
   ============================================================ */
const REWARD=60, LETTER_COIN=5, DONE_KEY='invasionDone';
const WORLD=420;                       // ครึ่งความกว้างแผนที่ทะเลทราย
const EYE=1.7, WALK=7.5, RUN=11.5;     // ความสูงตา · เดิน · วิ่ง (Shift)
const LOOK_SENS=0.0026, PAD_SENS=0.0042;
const PITCH_MIN=-0.55, PITCH_MAX=1.35; // เงยได้สูงมาก (ต้องเงยดูยานแม่)

/* 🛸 ยานแม่ — ใหญ่จนเกือบเต็มท้องฟ้า (สไตล์ Independence Day) */
/* ⚠️ 3 ค่านี้สัมพันธ์กัน อย่าแก้ทีละตัว — จูนแล้วต้องวัดซ้ำ (ดูวิธีวัดใน handoff/TASKS.md รอบ 413)
   MS_Y ต่ำไป = ท้องยาน+หนามจมพื้น · MS_Z ใกล้ไป = ยานอยู่เหนือหัวจนแผงตัวอักษรหลุดขอบจอบน
   ค่าปัจจุบัน: ยืนที่ z≈176 เงยหน้า ~17° เห็นยานกินจอ 100% กว้าง / ~70% สูง · แผงตัวอักษรอยู่กลางจอพอดี */
const MS_Y=340, MS_Z=-300, MS_R=560;   // ความสูงลอย · ระยะหน้า · รัศมีลำ
const MS_HP=100;                       // พลังเกราะยานแม่ (นับเป็น %)
const MS_DMG_GUN=0.55, MS_DMG_MISSILE=7;

/* 👾 ยานลูก */
const F_HP=3, F_SPEED=17, F_Y_MIN=26, F_Y_MAX=95, F_R=190;
const F_SHOT_GAP=2600, F_SHOT_SPD=52, F_SHOT_DMG=9;
const MS_BEAM_GAP=5200, MS_BEAM_DMG=14;   // ยานแม่ยิงลำแสงหนักเป็นระยะ

/* 🔫 อาวุธผู้เล่น */
const GUN_GAP=95, GUN_DMG=1, GUN_SPREAD=0.006, GUN_HEAT=3.2, GUN_COOL=42;
const MIS_MAX=6, MIS_RELOAD=9000, MIS_SPD=95, MIS_DMG=3;
const PLAYER_HP=120, HURT_IFRAME=700, SHIELD_REGEN=4.5;   // ฟื้นพลังเองเมื่อไม่โดนยิง (โลก 3D ไม่มีเกมโอเวอร์)

/* 👥 พันธมิตร */
const SQUAD_N=10, HELI_N=3;
const SQUAD_GAP=520, HELI_GAP=2600;    // จังหวะยิงของ AI (ms)

/* 🚁 เฮลิคอปเตอร์ที่ผู้เล่นขับเอง (รอบ 414 — ผู้ใช้สั่ง) */
const PH_ACCEL=26, PH_VMAX=34, PH_CLIMB=20, PH_Y_MIN=14, PH_Y_MAX=95, PH_DRAG=1.4;
const PH_GUN_GAP=70, PH_GUN_DMG=1.1;                 // ปืนกลติดเฮลิ (รัวกว่าปืนมือ ไม่มีโอเวอร์ฮีต)
const PH_MIS_MAX=12, PH_MIS_RELOAD=6000, PH_MIS_DMG=3.2;   // จรวดเฮลิ: ยิงเป็นชุดคู่ เติมเร็ว

/* 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414 — ผู้ใช้สั่ง) — สไตล์ Roblox ผ่าน Firebase /world/invasion */
const NET_SEND_MS=170;
const CHAT_MS=5000;
const CHAT_PRESETS=['ระวังด้านบน! ⚠️','ยิงยานลูกก่อน!','ตรงนี้เยอะ! 👇','สู้ๆ 💪','เก่งมาก! 👍','ขึ้นเฮลิเลย 🚁','ระดมยิงยานแม่! 🎯','ฮ่าๆ 😂'];
const PEER_COLORS=[0xef5350,0x42a5f5,0x66bb6a,0xffca28,0xab47bc,0x26c6da,0xff7043,0x8d6e63];

const TAU=Math.PI*2;
const rnd=(a,b)=>a+Math.random()*(b-a);
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
#inv-vig{position:absolute;inset:0;pointer-events:none;z-index:2;
  background:radial-gradient(ellipse at center,rgba(0,0,0,0) 48%,rgba(0,0,0,.62) 100%)}
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
/* ---- ปุ่มมือถือ ---- */
#inv-joy{position:absolute;left:16px;bottom:74px;width:118px;height:118px;border-radius:50%;z-index:6;
  background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.22)}
#inv-joy i{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#eaf6ff,#8fb6d6);box-shadow:0 3px 10px rgba(0,0,0,.5)}
#inv-fire,#inv-rocket,#inv-run{position:absolute;z-index:6;border:none;border-radius:50%;color:#fff;font-weight:900;
  box-shadow:0 5px 14px rgba(0,0,0,.55);cursor:pointer;-webkit-tap-highlight-color:transparent}
#inv-fire{right:18px;bottom:74px;width:104px;height:104px;font-size:34px;
  background:radial-gradient(circle at 34% 28%,#ff8a7a,#c62828)}
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
#inv-heli:active,#inv-up:active,#inv-down:active{transform:scale(.94)}
/* 🚁 กรอบห้องนักบิน (canopy) — โผล่เฉพาะตอนบิน */
#inv-canopy{position:absolute;inset:0;z-index:2;pointer-events:none;display:none}
#inv-wrap.fly #inv-canopy{display:block}
#inv-canopy::before,#inv-canopy::after{content:"";position:absolute;background:rgba(20,26,34,.55)}
#inv-canopy::before{left:0;right:0;top:0;height:8%;box-shadow:0 6px 14px rgba(0,0,0,.4)}
#inv-canopy .strut{position:absolute;top:0;bottom:38%;width:10px;background:rgba(24,30,40,.6);transform-origin:top}
#inv-canopy .sl{left:16%;transform:rotate(11deg)}#inv-canopy .sr{right:16%;transform:rotate(-11deg)}
/* 🏆 กระดานคะแนนสด (ผู้เล่นออนไลน์) */
#inv-board{position:absolute;right:12px;top:120px;z-index:5;pointer-events:none;min-width:118px;
  background:rgba(6,14,26,.7);border:1px solid rgba(120,220,255,.28);border-radius:10px;padding:5px 8px;display:none}
#inv-board.on{display:block}
#inv-board .bd-h{font-size:10px;color:#ffd98a;font-weight:800;margin-bottom:2px}
#inv-board .bd-r{display:flex;gap:5px;font-size:11px;color:#dbeaff;line-height:1.5;white-space:nowrap}
#inv-board .bd-r.me{color:#8fffb0;font-weight:800}
#inv-board .bd-r span:last-child{margin-left:auto;font-weight:800}
/* 💬 แชทสำเร็จรูป */
#inv-chat{position:absolute;left:12px;bottom:14px;z-index:6;border:none;border-radius:50%;width:46px;height:46px;font-size:20px;cursor:pointer;
  background:radial-gradient(circle at 34% 28%,#eaf6ff,#8fb6d6);box-shadow:0 4px 10px rgba(0,0,0,.5)}
#inv-chatbar{position:absolute;left:66px;bottom:14px;z-index:7;display:none;flex-wrap:wrap;gap:5px;max-width:60vw}
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
#inv-intro,#inv-exitbox{position:absolute;inset:0;z-index:9;background:rgba(4,8,16,.9);
  display:none;align-items:center;justify-content:center;padding:12px}
#inv-intro.on,#inv-exitbox.on{display:flex}
.inv-card{background:linear-gradient(180deg,#0f2136,#0a1626);border:2px solid #4fb9e8;border-radius:18px;
  padding:16px 22px;max-width:min(680px,94vw);max-height:94vh;overflow:auto;text-align:center;color:#e8f4ff;
  box-shadow:0 14px 40px rgba(0,0,0,.7)}
.inv-card h3{margin:0 0 8px;font-size:22px;color:#7fe3ff}
.inv-card p{margin:0 0 12px;font-size:14px;line-height:1.6;color:#cfe0f2}
.inv-card b{color:#ffd98a}
.inv-btn{border:none;border-radius:999px;padding:11px 30px;font-size:17px;font-weight:900;color:#fff;cursor:pointer;
  background:linear-gradient(180deg,#3ad07f,#1c8f4e);box-shadow:0 5px 14px rgba(20,150,80,.5)}
.inv-btn.red{background:linear-gradient(180deg,#ef5350,#c62828);box-shadow:0 5px 14px rgba(160,30,30,.5)}
.inv-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
@media (max-width:820px){
  #inv-word .ic{min-width:22px;height:28px;font-size:17px}
  #inv-joy{width:96px;height:96px;bottom:62px}
  #inv-fire{width:86px;height:86px;font-size:28px;bottom:62px}
  #inv-rocket{width:62px;height:62px;font-size:22px;right:112px;bottom:88px}
  #inv-run{width:54px;height:54px;font-size:18px;right:112px;bottom:14px}
  #inv-heli{width:56px;height:56px;font-size:23px;bottom:174px;right:16px}
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
  #inv-rocket{width:54px;height:54px;font-size:19px;right:96px;bottom:76px}
  #inv-run{width:48px;height:48px;font-size:16px;right:96px;bottom:10px}
  #inv-stat{top:40px;min-width:120px}
  #inv-stat .inv-lb{font-size:10px}
  #inv-exit{font-size:11px;padding:5px 10px}
  #inv-coins{top:66px}
  #inv-board{top:90px;min-width:96px}
  #inv-heli{width:48px;height:48px;font-size:19px;bottom:150px;right:12px}
  #inv-up,#inv-down{width:46px;height:40px;font-size:17px}
  #inv-up{right:160px;bottom:110px}#inv-down{right:160px;bottom:64px}
  #inv-chat{width:38px;height:38px;font-size:15px;bottom:10px}
  #inv-chatbar{left:54px;bottom:10px}#inv-chatbar button{padding:5px 8px;font-size:11px}
}
/* จอเตี้ยพิเศษ (≤330px · จอสี่เหลี่ยมยาวมาก) — พื้นที่ขวาไม่พอวางกระดานคะแนน+ปุ่มเฮลิพร้อมกัน
   → ซ่อนกระดานคะแนนมุมขวา (multiplayer ยังทำงานเต็ม เห็นเพื่อนในฉาก+ป้ายชื่อ+แชท) */
@media (max-height:330px){
  #inv-board,#inv-board.on{display:none}   /* .on มี specificity สูงกว่า ต้องระบุคู่ ไม่งั้นไม่ยอมซ่อน */
  #inv-stat{min-width:108px}
  #inv-stat .inv-lb{font-size:9px}
}
`;

let wrapEl,cvEl,wordEl,hpEl,heatEl,misEl,tgtEl,msBarEl,coinsEl,banEl,introEl,exitBox,crossEl,hurtEl,flashEl,joyEl,joyKnob,fireBtn,rocketBtn,runBtn;

function buildDom(){
  const st=document.createElement('style'); st.id='inv-style'; st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='inv-wrap';
  wrapEl.innerHTML=`
    <canvas id="inv-cv"></canvas>
    <div id="inv-vig"></div><div id="inv-hurt"></div><div id="inv-flash"></div>
    <div id="inv-cross"><i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><span class="dot"></span></div>
    <div id="inv-word"></div>
    <div id="inv-target"></div>
    <div id="inv-coins">🪙 +0</div>
    <div id="inv-stat">
      <div class="inv-lb">❤️ พลังชีวิต</div><div class="inv-bar" id="inv-hp"><span></span></div>
      <div class="inv-lb" style="margin-top:5px">🔥 ความร้อนปืน</div><div class="inv-bar" id="inv-heat"><span></span></div>
      <div id="inv-mis"></div>
    </div>
    <div id="inv-canopy"><span class="strut sl"></span><span class="strut sr"></span></div>
    <div id="inv-board"></div>
    <div id="inv-joy"><i></i></div>
    <button id="inv-fire">🔫</button>
    <button id="inv-rocket">🚀</button>
    <button id="inv-run">🏃</button>
    <button id="inv-heli">🚁</button>
    <button id="inv-up">▲</button>
    <button id="inv-down">▼</button>
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
      🚁 <b>กดปุ่มเฮลิ = กระโดดขึ้นเฮลิคอปเตอร์ขับเอง</b> บินยิงจรวดจากฟ้า! (กดอีกทีเพื่อลงพื้น)<br>
      <small>📱 มือถือ: วงกลมซ้าย = เดิน/บิน · ลากครึ่งขวาของจอ = เล็ง · 🔫 ยิง (กดค้างได้) · 🚀 มิสไซล์ · 🏃 วิ่ง · 🚁 ขึ้นเฮลิ (▲▼ ไต่ระดับ) · 💬 คุยกับเพื่อน<br>
      💻 คอม: คลิกจอล็อกเมาส์ · WASD เดิน · Shift วิ่ง · คลิกซ้ายยิง · R หรือคลิกขวา = มิสไซล์ · Esc ปลดเมาส์<br>
      ⚠️ ระวังลำแสงจากยานลูกและยานแม่ — โดนแล้วพลังลด แต่<b>ไม่มีตาย</b> หลบสักพักพลังฟื้นเอง</small></p>
      <button class="inv-btn" id="inv-go">⚔️ เข้าสมรภูมิ!</button>
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
  banEl=document.getElementById('inv-ban'); introEl=document.getElementById('inv-intro');
  exitBox=document.getElementById('inv-exitbox'); crossEl=document.getElementById('inv-cross');
  hurtEl=document.getElementById('inv-hurt'); flashEl=document.getElementById('inv-flash');
  joyEl=document.getElementById('inv-joy'); joyKnob=joyEl.querySelector('i');
  fireBtn=document.getElementById('inv-fire'); rocketBtn=document.getElementById('inv-rocket');
  runBtn=document.getElementById('inv-run');
  heliBtn=document.getElementById('inv-heli'); upBtn=document.getElementById('inv-up'); downBtn=document.getElementById('inv-down');
  boardEl=document.getElementById('inv-board'); canopyEl=document.getElementById('inv-canopy');
  chatBtn=document.getElementById('inv-chat'); chatBarEl=document.getElementById('inv-chatbar'); selfMsgEl=document.getElementById('inv-selfmsg');
  document.getElementById('inv-go').addEventListener('click',()=>{ introEl.classList.remove('on'); resumeAudio(); });
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
function resumeAudio(){ const c=Snd.ac(); if(c&&c.state==='suspended') c.resume(); Snd.startHum(); }

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
let mother=null, msArmor=MS_HP, msOpen=false, msDead=false, msBeamAt=0;
let fighters=[], fShots=[], myShots=[], missiles=[], fx=[], squad=[], helis=[];
let hp=PLAYER_HP, lastHurt=0;
let heat=0, overheat=false, lastFire=0, firing=false, misLeft=MIS_MAX, misReloadAt=0;
let sessionCoins=0, sessionWords=0, shake=0;
let gunGrp=null, gunRecoil=0, muzzle=null, muzzleUntil=0;
let keys={}, joy={id:null,cx:0,cy:0,dx:0,dy:0}, lookId=null, lookX=0, lookY=0, isRun=false;
let keydownFn,keyupFn,resizeFn;
/* 🚁 สถานะขับเฮลิเอง */
let inHeli=false, phVel={x:0,y:0,z:0}, phClimb=0, phRotorAt=0, phMisLeft=PH_MIS_MAX, phMisReloadAt=0, playerHeli=null;
/* 🌐 ผู้เล่นออนไลน์ */
let peers={}, worldRef=null, myRef=null, netOk=false, lastNetSend=0, myChat=null;
let boardEl=null, chatBtn=null, chatBarEl=null, selfMsgEl=null, heliBtn=null, upBtn=null, downBtn=null, canopyEl=null;
let terrainH=null;                     // ฟังก์ชันความสูงพื้นทราย
let solids=[];                         // กันชนตึก {x,z,r}
let msLamps=[], msCore=null, msGlow=null, msBoard=null, msPlate=null;

/* ============================================================
   📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้จะเอาของจริงมาใส่ทีหลัง)
   ไม่มีไฟล์/ไม่มี GLTFLoader = เงียบๆ ใช้ทรงที่โค้ดสร้างไว้ต่อไป
   ============================================================ */
function loadGlb(path,cb){
  if(!THREE.GLTFLoader) return;
  try{
    new THREE.GLTFLoader().load(path,g=>{ if(g&&g.scene) cb(g.scene); },undefined,()=>{});
  }catch(e){}
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
function buildTerrain(){
  /* พื้นทรายเป็นเนินคลื่นเบาๆ (ใช้ฟังก์ชันเดียวกับตอนผู้เล่นเดิน = ไม่ลอย/ไม่จม) */
  const H=(x,z)=> Math.sin(x*0.0075)*2.6 + Math.cos(z*0.0091)*2.2 + Math.sin((x+z)*0.0031)*3.4;
  terrainH=H;
  const seg=80, g=new THREE.PlaneGeometry(WORLD*2,WORLD*2,seg,seg);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++) p.setZ(i,H(p.getX(i),-p.getY(i)));   // ยังไม่หมุน: y ของ plane = -z ของโลก
  g.computeVertexNormals();
  /* สีวัสดุ = ขาวล้วน ปล่อยให้ภาพทรายคุมโทนเอง (เคยใส่สีอุ่นทับ + ไฟแรง = พื้นสว่างจ้าจนแสบตา) */
  const m=new THREE.MeshLambertMaterial({color:0xffffff,map:sandTex()});
  tryTex(m,'img/invasion/sand.jpg',70,70);
  const ground=new THREE.Mesh(g,m); ground.rotation.x=-Math.PI/2; scene.add(ground);
}
/* 🏘️ บ้านดินเผาหลังคาแบน + โดม + หอมินาเรต + ต้นอินทผลัม */
function buildTown(){
  const tones=['#d8bc93','#c9a87c','#e2cda9','#bfa07a','#d2b489'];
  const mats=tones.map(t=>{ const m=new THREE.MeshLambertMaterial({color:0xffffff,map:wallTex(t)});
    tryTex(m,'img/invasion/wall.jpg',1,1); return m; });
  const winMat=new THREE.MeshBasicMaterial({color:0x24303f});
  const domeMat=new THREE.MeshLambertMaterial({color:0xd8d2c4});
  /* 💡 จำนวนพวกนี้คุม draw call โดยตรง (มือถือเด็กเป็นหลัก) — บ้าน 1 หลัง ≈ 4 ชิ้น, ต้นอินทผลัม 1 ต้น ≈ 7 ชิ้น
     กระตุกบนมือถือจริงเมื่อไหร่ ลดเลข 80 / 34 / 45 ตรงนี้ก่อนเป็นอันดับแรก */
  for(let i=0;i<80;i++){
    const a=rnd(0,TAU), r=rnd(26,WORLD*0.84);
    const x=Math.cos(a)*r, z=Math.sin(a)*r;
    if(Math.hypot(x,z-pz)<18) continue;                     // เว้นที่ยืนของผู้เล่น
    const w=rnd(6,14), d=rnd(6,14), h=rnd(4,13);
    const base=terrainH(x,z);
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mats[(Math.random()*mats.length)|0]);
    b.position.set(x,base+h/2,z); b.rotation.y=rnd(0,TAU); scene.add(b);
    solids.push({x,z,r:Math.max(w,d)*0.55});
    const par=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.7,d+.6),b.material);   // ขอบดาดฟ้า
    par.position.set(x,base+h+.35,z); par.rotation.y=b.rotation.y; scene.add(par);
    for(let k=0;k<2;k++){                                    // หน้าต่างเล็กด้านหน้า
      const wd=new THREE.Mesh(new THREE.PlaneGeometry(1,1.6),winMat);
      const ang=b.rotation.y;
      wd.position.set(x+Math.sin(ang)*(d/2+.06)+Math.cos(ang)*(k?1.9:-1.9),
                      base+h*0.55, z+Math.cos(ang)*(d/2+.06)-Math.sin(ang)*(k?1.9:-1.9));
      wd.rotation.y=ang; scene.add(wd);
    }
    if(Math.random()<0.22){                                  // บางหลังมีโดม
      const dm=new THREE.Mesh(new THREE.SphereGeometry(Math.min(w,d)*0.42,12,8,0,TAU,0,Math.PI/2),domeMat);
      dm.position.set(x,base+h+.6,z); scene.add(dm);
    }
  }
  [[-70,-40],[95,10],[-30,-150]].forEach(([x,z])=>{          // 🕌 หอมินาเรต = หมุดสายตาให้เด็กจำทิศ
    const base=terrainH(x,z);
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
      const lf=new THREE.Mesh(new THREE.PlaneGeometry(1.5,5.4),leafM);
      const ang=k/6*TAU;
      lf.position.set(x+Math.cos(ang)*1.9, base+h+.5, z+Math.sin(ang)*1.9);
      lf.rotation.set(-1.05,ang,0); scene.add(lf);
    }
  }
  const rockM=new THREE.MeshLambertMaterial({color:0xa89478});
  for(let i=0;i<45;i++){                                     // 🪨 ก้อนหิน
    const a=rnd(0,TAU), r=rnd(18,WORLD*0.9);
    const x=Math.cos(a)*r, z=Math.sin(a)*r, s=rnd(.7,2.6);
    const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),rockM);
    rk.position.set(x,terrainH(x,z)+s*.5,z); rk.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3)); scene.add(rk);
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
  const core=new THREE.Mesh(new THREE.SphereGeometry(MS_R*0.11,18,14),
    new THREE.MeshBasicMaterial({color:0x3a0d0d}));
  core.position.y=-MS_R*0.30; grp.add(core); msCore=core;
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({color:0xff3a2a,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  glow.scale.setScalar(MS_R*0.9); glow.position.y=-MS_R*0.30; grp.add(glow); msGlow=glow;

  /* 🧩 แผงช่องตัวอักษร — ห้อยใต้ขอบหน้าลำ
     ⚠️ ต้องเป็นลูกของ "ฉาก" ไม่ใช่ลูกของลำยาน! ลำยานหมุนช้าๆ ตลอดเวลา ถ้าแผงเป็นลูกของลำยาน
        แผงจะโคจรตามไปอยู่ด้านหลัง/ด้านข้างจนอ่านไม่ได้ (เจอมาแล้วตอนเทสต์) → ตามตำแหน่งเองใน tickMother
     ตำแหน่งนี้ทำให้ผู้เล่นเงยหน้า ~30° (พอดีมุมเริ่มต้น) แล้วเห็นแถวตัวอักษรกลางจอ
     ย้ายแผง "เข้าใกล้ผู้เล่น" (z มากขึ้น) = มุมเงยชันขึ้น ตัวอักษรจะหลุดขอบจอบน */
  const board=new THREE.Group();
  board.position.set(0,MS_Y-MS_R*0.37,MS_Z+MS_R*0.45);
  /* ⚠️ เครื่องหมายสำคัญ: rotation.x เป็น "บวก" = หน้าแผงก้มลงหาผู้เล่นที่ยืนอยู่ข้างล่าง
     ใส่ลบจะเงยขึ้นฟ้า ตัวอักษรถูกมองเฉียงจนแบน อ่านยาก (พลาดมาแล้ว วัดด้วย dot ได้ 0.50) */
  board.rotation.x=0.52;
  scene.add(board); msBoard=board;
  const plate=new THREE.Mesh(new THREE.BoxGeometry(MS_R,MS_R*0.22,MS_R*0.04),darkM);
  board.add(plate); msPlate=plate;

  scene.add(grp); mother=grp;
  loadGlb('img/models/mothership.glb',(obj)=>{
    fitInto(obj,MS_R*2);
    grp.children.slice().forEach(c=>{ if(c!==core&&c!==glow) grp.remove(c); });
    grp.add(obj); msLamps=[];
  });
}
/* วางช่องตัวอักษรตามความยาวคำ (คำยาว = ช่องเล็กลงพอดีแผง) */
function layoutLetterPanels(){
  letters.forEach(l=>{ msBoard.remove(l.mesh);
    if(l.mesh.material.map) l.mesh.material.map.dispose();
    l.mesh.material.dispose(); l.mesh.geometry.dispose(); });
  letters=[];
  const n=word.en.length;
  const cell=Math.min(MS_R*0.11, MS_R*0.55/n);   // คำยาว = ช่องเล็กลง ไม่ให้แถวกว้างเกินมุมมอง
  const gap=cell*0.16, total=n*cell+(n-1)*gap;
  if(msPlate){ msPlate.geometry.dispose(); msPlate.geometry=new THREE.BoxGeometry(total+cell*0.5,cell*1.3,MS_R*0.04); }
  word.en.split('').forEach((ch,i)=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(cell,cell),
      new THREE.MeshBasicMaterial({map:letterPanelTex(ch,false),transparent:true}));
    m.position.set(-total/2+cell/2+i*(cell+gap), 0, MS_R*0.028);
    msBoard.add(m);
    letters.push({ch,idx:i,mesh:m,down:false,blinkUntil:0});
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
  const hull=new THREE.Mesh(new THREE.ConeGeometry(2.5,1.5,7),bodyM); hull.position.y=.4; grp.add(hull);
  const hull2=new THREE.Mesh(new THREE.ConeGeometry(2.5,2.2,7),bodyM); hull2.rotation.z=Math.PI; hull2.position.y=-.7; grp.add(hull2);
  [-1,1].forEach(s=>{                                        // ปีกลิ่ม 2 ข้าง
    const w=new THREE.Mesh(new THREE.ConeGeometry(.9,4.2,4),bodyM);
    w.rotation.z=s*Math.PI/2; w.position.set(s*3.0,0,0); grp.add(w);
  });
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.52,10,8),new THREE.MeshBasicMaterial({color:0x59ff9d}));
  eye.position.set(0,.1,-2.1); grp.add(eye);
  const eng=new THREE.Sprite(new THREE.SpriteMaterial({color:0x66e0ff,transparent:true,opacity:.8,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  eng.scale.setScalar(4.2); eng.position.set(0,0,2.4); grp.add(eng);
  const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:letterSpriteTex(word.en[letterIdx]),transparent:true,depthTest:false}));
  lb.scale.setScalar(5.2); lb.position.y=4.8; grp.add(lb);

  const a=rnd(0,TAU), r=rnd(F_R*0.45,F_R);
  grp.position.set(Math.cos(a)*r, rnd(F_Y_MIN,F_Y_MAX), Math.sin(a)*r);
  scene.add(grp);
  const f={grp,eye,eng,label:lb,letterIdx,hp:F_HP,
           ang:a, rad:r, spin:(Math.random()<.5?-1:1)*rnd(.16,.32),
           tgtY:rnd(F_Y_MIN,F_Y_MAX), yAt:0, shotAt:performance.now()+rnd(1200,4200), hitAt:0};
  fighters.push(f);
  loadGlb('img/models/alien_fighter.glb',(obj)=>{
    fitInto(obj,7);
    grp.children.slice().forEach(c=>{ if(c!==lb&&c!==eng) grp.remove(c); });
    grp.add(obj);
  });
  return f;
}

/* ============================================================
   👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
   (ช่วยยิงจริง ทำดาเมจจริง — เด็กจะรู้สึกว่า "ไม่ได้สู้คนเดียว")
   ============================================================ */
function makeSoldier(x,z){
  const grp=new THREE.Group();
  const uni=new THREE.MeshLambertMaterial({color:0x6b6f4a});      // ชุดลายทะเลทราย
  const gear=new THREE.MeshLambertMaterial({color:0x3a3d33});
  const skin=new THREE.MeshLambertMaterial({color:0xc79a72});
  const body=new THREE.Mesh(new THREE.BoxGeometry(.62,.86,.36),uni); body.position.y=1.15; grp.add(body);
  const vest=new THREE.Mesh(new THREE.BoxGeometry(.68,.5,.44),gear); vest.position.y=1.22; grp.add(vest);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.21,8,6),skin); head.position.y=1.76; grp.add(head);
  const helm=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6,0,TAU,0,Math.PI/2),gear); helm.position.y=1.78; grp.add(helm);
  [-1,1].forEach(s=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.22,.76,.24),uni); leg.position.set(s*.16,.38,0); grp.add(leg);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(.18,.62,.2),uni); arm.position.set(s*.42,1.2,0); grp.add(arm);
  });
  const rifle=new THREE.Mesh(new THREE.BoxGeometry(.11,.13,1.15),new THREE.MeshLambertMaterial({color:0x22242a}));
  rifle.position.set(.34,1.34,-.5); grp.add(rifle);
  grp.position.set(x,terrainH(x,z),z);
  scene.add(grp);
  return {grp,rifle,shotAt:performance.now()+rnd(0,SQUAD_GAP)};
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
  const a=(i/HELI_N)*TAU;
  grp.position.set(Math.cos(a)*130, rnd(48,72), Math.sin(a)*130);
  scene.add(grp);
  return {grp,rotor,trotor,ang:a,rad:rnd(110,165),y:grp.position.y,
          spin:(i%2?-1:1)*rnd(.10,.17), shotAt:performance.now()+rnd(0,HELI_GAP)};
}

/* ============================================================
   🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
   มี img/models/gun_rifle.glb เมื่อไหร่ → สลับใช้โมเดลจริงอัตโนมัติ
   ============================================================ */
function buildGun(){
  const g=new THREE.Group();
  const met=new THREE.MeshPhongMaterial({color:0x2b2f36,shininess:48,flatShading:true});
  const dark=new THREE.MeshPhongMaterial({color:0x16181d,shininess:20});
  const accent=new THREE.MeshBasicMaterial({color:0x3ad4ff});
  const rec=new THREE.Mesh(new THREE.BoxGeometry(.10,.13,.42),met); rec.position.set(0,0,0); g.add(rec);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.024,.028,.52,8),dark);
  bar.rotation.x=Math.PI/2; bar.position.set(0,.012,-.44); g.add(bar);
  const shr=new THREE.Mesh(new THREE.BoxGeometry(.075,.085,.30),met); shr.position.set(0,.012,-.34); g.add(shr);
  const grip=new THREE.Mesh(new THREE.BoxGeometry(.065,.19,.08),dark);
  grip.position.set(0,-.13,.10); grip.rotation.x=-.22; g.add(grip);
  const mag=new THREE.Mesh(new THREE.BoxGeometry(.062,.20,.10),dark);
  mag.position.set(0,-.14,-.06); mag.rotation.x=.10; g.add(mag);
  const stock=new THREE.Mesh(new THREE.BoxGeometry(.07,.10,.26),met); stock.position.set(0,-.02,.32); g.add(stock);
  const scope=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,.20,8),dark);
  scope.rotation.x=Math.PI/2; scope.position.set(0,.10,-.12); g.add(scope);
  const led=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.10),accent); led.position.set(.055,.05,-.20); g.add(led);
  const led2=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.10),accent); led2.position.set(-.055,.05,-.20); g.add(led2);
  /* ไฟปากลำกล้อง (โผล่ตอนยิง) */
  muzzle=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffd27a,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthTest:false,depthWrite:false}));
  muzzle.scale.setScalar(.42); muzzle.position.set(0,.012,-.72); g.add(muzzle);

  g.position.set(.20,-.20,-.52);       // มือขวาถือ เอียงเข้ากลางจอเล็กน้อย
  g.rotation.set(.03,.06,0);
  camera.add(g); gunGrp=g;
  loadGlb('img/models/gun_rifle.glb',(obj)=>{
    fitInto(obj,.9);
    g.children.slice().forEach(c=>{ if(c!==muzzle) g.remove(c); });
    g.add(obj);
  });
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
function sparkAt(pos){
  const s=new THREE.Sprite(new THREE.SpriteMaterial({color:0xfff0a0,transparent:true,opacity:1,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  s.position.copy(pos); s.scale.setScalar(1.6); scene.add(s);
  fx.push({o:s,t:0,life:.22,kind:'ball',sc:.5});
}
/* เส้นกระสุนวิ่ง (ใช้ทั้งของผู้เล่นและพันธมิตร) */
function tracer(from,to,color,width){
  const dir=new THREE.Vector3().subVectors(to,from);
  const len=dir.length();
  const m=new THREE.Mesh(new THREE.CylinderGeometry(width||.06,width||.06,len,5),
    new THREE.MeshBasicMaterial({color:color||0xffe08a,transparent:true,opacity:.95,
      blending:THREE.AdditiveBlending,depthWrite:false}));
  m.position.copy(from).addScaledVector(dir,.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
  scene.add(m);
  fx.push({o:m,t:0,life:.10,kind:'fade'});
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
      if(f.o.position.y<gy){ f.o.position.y=gy; f.v.set(0,0,0); } }
    else if(f.kind==='fade'){ f.o.material.opacity=.95*(1-k); }
  }
}

/* ============================================================
   🎯 ระบบยิงของผู้เล่น
   ============================================================ */
function aimDir(){
  const d=new THREE.Vector3(0,0,-1);
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
    const hit=rayTarget(origin,dir,900);
    tracer(origin.clone().addScaledVector(dir,4),hit?hit.point:origin.clone().addScaledVector(dir,700),0x9fe0ff,.07);
    if(hit){ sparkAt(hit.point);
      if(hit.type==='fighter'){ damageFighter(hit.obj,PH_GUN_DMG,now); Snd.ping(); }
      else if(hit.type==='mother'){ damageMother(GUN_DMG_GUN*1.2); } }
    return;
  }
  if(overheat || now-lastFire<GUN_GAP) return;
  lastFire=now;
  heat=Math.min(100,heat+GUN_HEAT);
  if(heat>=100){ overheat=true; toastBan('🔥 ปืนร้อนจัด! รอสักครู่',700); }
  gunRecoil=1; muzzleUntil=now+55;
  Snd.gun();
  const origin=camera.position.clone();
  const dir=aimDir();
  dir.x+=rnd(-GUN_SPREAD,GUN_SPREAD); dir.y+=rnd(-GUN_SPREAD,GUN_SPREAD); dir.normalize();
  const hit=rayTarget(origin,dir,900);
  const end=hit? hit.point : origin.clone().addScaledVector(dir,700);
  tracer(origin.clone().addScaledVector(dir,3),end,0xffe08a,.05);
  if(!hit) return;
  sparkAt(hit.point);
  if(hit.type==='fighter'){ damageFighter(hit.obj,GUN_DMG,now); Snd.ping(); }
  else if(hit.type==='mother'){ damageMother(GUN_DMG_GUN); }
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
    const t=raySphere(origin,dir,f.grp.position,4.6);
    if(t!==null && t<bestT){ bestT=t; best={type:'fighter',obj:f,t}; }
  });
  if(msOpen && !msDead && mother){
    const t=raySphere(origin,dir,mother.position,MS_R*0.62);
    if(t!==null && t<bestT){ bestT=t; best={type:'mother',obj:mother,t}; }
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
function damageFighter(f,dmg,now){
  if(f.dead) return;
  f.hp-=dmg; f.hitAt=now||performance.now();
  if(f.hp>0) return;
  f.dead=true;
  boom(f.grp.position,1.35,0x8affc0);
  scene.remove(f.grp);
  const i=fighters.indexOf(f); if(i>=0) fighters.splice(i,1);
  /* 🔴 ตัวอักษรประจำลำนี้บนยานแม่กะพริบ */
  const l=letters[f.letterIdx];
  if(l && !l.down){
    l.down=true; l.blinkUntil=performance.now()+2600;
    setLetterLit(l,true);
    if(typeof addCoins==='function') addCoins(LETTER_COIN);
    sessionCoins+=LETTER_COIN; renderCoins();
    if(typeof sfx!=='undefined'&&sfx.coin) sfx.coin();
    renderWord();
    toastBan(`💥 ยิงตก! ตัวอักษร <b>${l.ch.toUpperCase()}</b> กะพริบแล้ว<br><span class="ib-coin">+${LETTER_COIN} 🪙</span>`,1200);
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
  msArmor=Math.max(0,msArmor-dmg);
  renderTarget();
  if(msArmor<=0) killMother();
}
function killMother(){
  msDead=true;
  /* ระเบิดเป็นชุด ลูกใหญ่ขึ้นเรื่อยๆ แล้วยานแม่ค่อยๆ ทรุดหายไป */
  const p=mother.position.clone();
  for(let i=0;i<9;i++){
    setTimeout(()=>{ if(!running) return;
      boom(p.clone().add(new THREE.Vector3(rnd(-MS_R*.7,MS_R*.7),rnd(-MS_R*.3,MS_R*.2),rnd(-MS_R*.5,MS_R*.5))),
           1.6+i*.35, i%2?0xff8a3a:0xfff0a0);
    }, i*230);
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
function pickWord(){
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  let pool=vocabForStudent().filter(([en])=>/^[a-z]{3,8}$/i.test(en))
    .filter(([en])=>!state[DONE_KEY].includes(en.toLowerCase()));
  if(!pool.length){ state[DONE_KEY]=[]; saveState();
    pool=vocabForStudent().filter(([en])=>/^[a-z]{3,8}$/i.test(en)); }
  if(!pool.length) pool=[['alien','มนุษย์ต่างดาว']];
  const [en,th]=pool[(Math.random()*pool.length)|0];
  word={en:en.toLowerCase(), th};
  layoutLetterPanels();
  renderWord();
  startWave();
}
function startWave(){
  fighters.slice().forEach(f=>scene.remove(f.grp)); fighters=[];
  msOpen=false; msDead=false; msArmor=MS_HP;
  if(msGlow) msGlow.material.opacity=0;
  if(msCore) msCore.material.color.setHex(0x3a0d0d);
  if(mother){ mother.visible=true; mother.scale.setScalar(1); }
  if(msBoard) msBoard.visible=true;                          // แผงแยกจากลำยานแล้ว ต้องสั่งโชว์/ซ่อนเอง
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
  if(mother) mother.visible=false;
  if(msBoard) msBoard.visible=false;                         // ยานแม่ระเบิดแล้ว แผงต้องหายไปด้วย
  setTimeout(()=>{ if(running) pickWord(); },3200);
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
        yaw-=(t.clientX-lookX)*PAD_SENS; pitch-=(t.clientY-lookY)*PAD_SENS;
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
  hold(fireBtn,()=>{ firing=true; resumeAudio(); },()=>{ firing=false; });
  rocketBtn.addEventListener('click',()=>fireMissile(performance.now()));
  runBtn.addEventListener('click',()=>{ isRun=!isRun; runBtn.classList.toggle('on',isRun); });
  /* 🚁 ขึ้น/ลงเฮลิ + ไต่ระดับ (กดค้าง) */
  heliBtn.addEventListener('click',()=>{ resumeAudio(); inHeli?exitHeli():enterHeli(); });
  hold(upBtn,()=>{ phClimb=1; },()=>{ phClimb=0; });
  hold(downBtn,()=>{ phClimb=-1; },()=>{ phClimb=0; });
  /* 💬 แชทสำเร็จรูป */
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
    else if(e.button===2) fireMissile(performance.now());
  });
  window.addEventListener('mouseup',()=>{ firing=false; });
  cvEl.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('mousemove',e=>{
    if(!running||document.pointerLockElement!==cvEl) return;
    yaw-=e.movementX*LOOK_SENS; pitch-=e.movementY*LOOK_SENS;
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
  const spd=(run?RUN:WALK);
  const len=Math.hypot(f,s);
  if(len>1){ f/=len; s/=len; }
  const sinY=Math.sin(yaw), cosY=Math.cos(yaw);
  let nx=px+(-sinY*f + cosY*s)*spd*dt;
  let nz=pz+(-cosY*f - sinY*s)*spd*dt;
  /* กันทะลุตึก */
  for(const o of solids){
    const dx=nx-o.x, dz=nz-o.z, d=Math.hypot(dx,dz);
    if(d<o.r+.6){ const k=(o.r+.6)/(d||.001); nx=o.x+dx*k; nz=o.z+dz*k; }
  }
  const lim=WORLD*0.94;
  px=clamp(nx,-lim,lim); pz=clamp(nz,-lim,lim);
  py=terrainH(px,pz)+EYE;
  /* หัวโยกตอนเดิน (ให้รู้สึกเป็นทหารเดินจริง) */
  const bob=(len>.05? Math.sin(now*(run?.016:.011))*(run?.09:.055) : 0);
  camera.position.set(px,py+bob,pz);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);
  /* สั่นจอตอนระเบิด */
  if(shake>0.001){
    camera.position.x+=rnd(-1,1)*shake*.35;
    camera.position.y+=rnd(-1,1)*shake*.35;
    shake=Math.max(0,shake-dt*2.2);
  }
  /* ปืน: รีคอยล์ + แกว่งตามการเดิน */
  if(gunGrp){
    gunRecoil=Math.max(0,gunRecoil-dt*7);
    gunGrp.position.set(.20+Math.sin(now*.011)*(len>.05?.008:.002),
                        -.20+Math.cos(now*.022)*(len>.05?.007:.002)-gunRecoil*.03,
                        -.52+gunRecoil*.10);
    gunGrp.rotation.x=.03+gunRecoil*.22;
  }
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
  lastHurt=now; hp-=dmg;
  Snd.hit();
  if(hurtEl){ hurtEl.classList.add('on'); setTimeout(()=>hurtEl&&hurtEl.classList.remove('on'),260); }
  shake=Math.min(1.2,shake+.30);
  if(state.haptic!==false&&navigator.vibrate) navigator.vibrate(70);
  if(hp<=0){
    /* ไม่มีตาย — ถอยกลับแนวหลังไปตั้งหลัก แล้วพลังฟื้นเต็ม */
    hp=PLAYER_HP;
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
function enterHeli(){
  if(inHeli) return;
  inHeli=true;
  wrapEl.classList.add('fly'); heliBtn.classList.add('flying'); heliBtn.textContent='🪂';
  phVel={x:0,y:0,z:0}; phClimb=0;
  phMisLeft=PH_MIS_MAX; phMisReloadAt=0;
  py=Math.max(py+28, terrainH(px,pz)+40);                 // พุ่งขึ้นฟ้าทันที
  if(gunGrp) gunGrp.visible=false;                        // ในเฮลิไม่เห็นปืนมือ
  firing=false; heat=0; overheat=false; renderHeat();
  renderMissiles();
  Snd.startRotor();
  toastBan('🚁 <b>ขึ้นเฮลิคอปเตอร์แล้ว!</b><br><span class="ib-sub">▲▼ ไต่ระดับ · 🔫 ปืนกลรัว · 🚀 จรวดชุดคู่ · กด 🪂 เพื่อลงพื้น</span>',2400);
  if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
}
function exitHeli(){
  if(!inHeli) return;
  inHeli=false;
  wrapEl.classList.remove('fly'); heliBtn.classList.remove('flying'); heliBtn.textContent='🚁';
  if(gunGrp) gunGrp.visible=true;
  py=terrainH(px,pz)+EYE; phClimb=0;
  misLeft=MIS_MAX; misReloadAt=0; renderMissiles();       // กลับพื้น = มิสไซล์ทหารราบเต็ม
  Snd.stopRotor();
  toastBan('🪂 <b>ลงพื้นแล้ว</b> — กลับมาเป็นทหารราบ',1500);
}
function tickHeliFlight(dt,now){
  /* เคลื่อนที่แนวราบตามทิศเล็ง (yaw) */
  let f=0,s=0;
  if(keys.w) f+=1; if(keys.s) f-=1; if(keys.a) s-=1; if(keys.d) s+=1;
  f-=joy.dy; s+=joy.dx;
  const len=Math.hypot(f,s); if(len>1){ f/=len; s/=len; }
  const sinY=Math.sin(yaw), cosY=Math.cos(yaw);
  const wantX=(-sinY*f + cosY*s)*PH_VMAX;
  const wantZ=(-cosY*f - sinY*s)*PH_VMAX;
  phVel.x+=(wantX-phVel.x)*Math.min(1,dt*PH_ACCEL/PH_VMAX);
  phVel.z+=(wantZ-phVel.z)*Math.min(1,dt*PH_ACCEL/PH_VMAX);
  /* ไต่ระดับ: ปุ่ม ▲▼ (phClimb) หรือ Space/Shift */
  let cl=phClimb; if(keys.space) cl+=1; if(keys.ctrl||keys.shift) cl-=1;
  phVel.y+=(cl*PH_CLIMB-phVel.y)*Math.min(1,dt*4);
  /* integrate */
  const lim=WORLD*0.94;
  px=clamp(px+phVel.x*dt,-lim,lim);
  pz=clamp(pz+phVel.z*dt,-lim,lim);
  const gy=terrainH(px,pz);
  py=clamp(py+phVel.y*dt, gy+PH_Y_MIN, gy+PH_Y_MAX);
  if(py<=gy+PH_Y_MIN+0.01) phVel.y=Math.max(0,phVel.y);   // แตะเพดานล่าง = ไม่ดิ่งต่อ
  /* กล้อง = ตำแหน่งเฮลิ + โยกเบาๆ + เอียงลำตามการสไลด์ (bank) */
  camera.position.set(px, py+Math.sin(now*.012)*.14, pz);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);
  camera.rotateZ(-clamp(s*.22 + (phVel.x*cosY-phVel.z*sinY)*.004, -.32,.32));
  if(shake>0.001){ camera.position.x+=rnd(-1,1)*shake*.35; camera.position.y+=rnd(-1,1)*shake*.35; shake=Math.max(0,shake-dt*2.2); }
  if(muzzle) muzzle.material.opacity=now<muzzleUntil?1:0;
  /* เติมจรวดเฮลิ + ฟื้นพลัง */
  if(phMisLeft<=0&&phMisReloadAt&&now>phMisReloadAt){ phMisLeft=PH_MIS_MAX; phMisReloadAt=0; renderMissiles();
    toastBan('🚀 <b>เติมจรวดเฮลิเต็มแล้ว!</b>',900); }
  if(now-lastHurt>3500&&hp<PLAYER_HP){ hp=Math.min(PLAYER_HP,hp+SHIELD_REGEN*dt*10); renderHp(); }
  if(firing) fireGun(now);
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
    yaw:Math.round(yaw*100)/100, av:inHeli?'heli':'foot', w:sessionWords,
    ts:firebase.database.ServerValue.TIMESTAMP };
  if(myChat && Date.now()-myChat.ts<CHAT_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
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
function peerBody(kind,color){
  const g=new THREE.Group();
  if(kind==='heli'){
    const bodyM=new THREE.MeshPhongMaterial({color,shininess:24,flatShading:true});
    const body=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.25,4.6,8),bodyM); body.rotation.x=Math.PI/2; g.add(body);
    const nose=new THREE.Mesh(new THREE.SphereGeometry(1.3,10,8),new THREE.MeshPhongMaterial({color:0x1b2733,shininess:90})); nose.position.z=-2.3; g.add(nose);
    const tail=new THREE.Mesh(new THREE.CylinderGeometry(.3,.18,5,7),bodyM); tail.rotation.x=Math.PI/2; tail.position.z=3.9; g.add(tail);
    const rotor=new THREE.Group();
    for(let k=0;k<4;k++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(.26,.06,8.6),bodyM); bl.rotation.y=k*Math.PI/4; rotor.add(bl); }
    rotor.position.y=1.6; g.add(rotor); g.userData.rotor=rotor;
  }else{
    const uni=new THREE.MeshLambertMaterial({color});
    const gear=new THREE.MeshLambertMaterial({color:0x3a3d33});
    const body=new THREE.Mesh(new THREE.BoxGeometry(.62,.86,.36),uni); body.position.y=1.15; g.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.21,8,6),new THREE.MeshLambertMaterial({color:0xc79a72})); head.position.y=1.76; g.add(head);
    const helm=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6,0,TAU,0,Math.PI/2),gear); helm.position.y=1.78; g.add(helm);
    [-1,1].forEach(sd=>{ const leg=new THREE.Mesh(new THREE.BoxGeometry(.22,.76,.24),uni); leg.position.set(sd*.16,.38,0); g.add(leg); });
    const rifle=new THREE.Mesh(new THREE.BoxGeometry(.1,.12,1.0),new THREE.MeshLambertMaterial({color:0x22242a})); rifle.position.set(.32,1.3,-.4); g.add(rifle);
  }
  return g;
}
function buildPeer(uid,p,kind){
  if(p.grp) scene.remove(p.grp);
  p.grp=new THREE.Group();
  p.grp.add(peerBody(kind,peerColor(uid)));
  const nm=nameSprite(p.n); nm.scale.set(7,1.75,1); nm.position.y=kind==='heli'?4.2:2.9; p.grp.add(nm);
  p.grp.position.set(p.cur.x,p.cur.y,p.cur.z); p.grp.rotation.y=p.yawCur;
  scene.add(p.grp); p.kind=kind;
}
function onPeer(snap){
  const uid=snap.key;
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  const d=snap.val()||{};
  if(typeof d.x!=='number'||typeof d.z!=='number') return;
  const kind=(d.av==='heli')?'heli':'foot';
  let p=peers[uid];
  if(!p){
    p=peers[uid]={grp:null,kind:'',cur:{x:d.x,y:(d.y||0),z:d.z},tgt:{x:d.x,y:(d.y||0),z:d.z},
                  yawCur:(d.yaw||0),yawTgt:(d.yaw||0),n:String(d.n||'เพื่อน').slice(0,24),w:0};
    buildPeer(uid,p,kind);
    toastBan(`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> เข้าร่วมสมรภูมิ${kind==='heli'?'ด้วยเฮลิคอปเตอร์ 🚁':' 🔫'}!`,1900);
  }else if(p.kind!==kind){ if(p.bubble) removePeerBubble(p); buildPeer(uid,p,kind); }
  p.tgt={x:d.x,y:(typeof d.y==='number'?d.y:p.tgt.y),z:d.z};
  if(typeof d.yaw==='number') p.yawTgt=d.yaw;
  const w=typeof d.w==='number'?d.w:0; if(p.w!==w) p.w=w;
  renderBoard();
  if(typeof d.ct==='number' && typeof d.c==='string' && d.c && p.lastCt!==d.ct){ p.lastCt=d.ct; showPeerBubble(p,d.c); }
}
function dropPeer(uid){
  const p=peers[uid]; if(!p) return;
  removePeerBubble(p);
  if(p.grp) scene.remove(p.grp);
  delete peers[uid]; renderBoard();
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
    p.grp.position.set(p.cur.x,p.cur.y,p.cur.z); p.grp.rotation.y=p.yawCur;
    const ro=p.grp.children[0]&&p.grp.children[0].userData.rotor;
    if(ro) ro.rotation.y+=dt*40;
  }
}
/* 🏆 กระดานคะแนนสด — เรา + เพื่อน เรียงตามจำนวนคำที่พิชิตรอบนี้ */
let boardSig='';
function renderBoard(){
  if(!boardEl) return;
  const uids=Object.keys(peers);
  if(!uids.length){ boardEl.classList.remove('on'); boardSig=''; return; }
  const myName=(typeof onlineDisplayName==='function'&&onlineDisplayName())||'ฉัน';
  const rows=uids.map(u=>({n:peers[u].n,w:peers[u].w||0,me:false,h:peers[u].kind==='heli'}))
    .concat([{n:myName,w:sessionWords,me:true,h:inHeli}]).sort((a,b)=>b.w-a.w).slice(0,5);
  const sig=rows.map(r=>r.n+':'+r.w+':'+r.h+':'+r.me).join('|');
  if(sig===boardSig){ boardEl.classList.add('on'); return; }
  boardSig=sig;
  boardEl.innerHTML='<div class="bd-h">🏆 ปราบยานแม่รอบนี้</div>'+rows.map((r,i)=>
    `<div class="bd-r${r.me?' me':''}"><span>${['🥇','🥈','🥉','　','　'][i]}${r.h?'🚁':'🔫'}</span>`+
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
    if(now>f.yAt){ f.tgtY=rnd(F_Y_MIN,F_Y_MAX); f.yAt=now+rnd(2600,5200); }
    const tx=Math.cos(f.ang)*f.rad, tz=Math.sin(f.ang)*f.rad;
    const p=f.grp.position;
    p.x+=(tx-p.x)*Math.min(1,dt*1.6);
    p.z+=(tz-p.z)*Math.min(1,dt*1.6);
    p.y+=(f.tgtY-p.y)*Math.min(1,dt*.9);
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
      f.shotAt=now+F_SHOT_GAP*rnd(.7,1.5);
      spawnAlienShot(p.clone(),0x7dff9d,F_SHOT_DMG,F_SHOT_SPD);
    }
  });
}
/* ยานแม่ยิงลำแสงหนักเป็นระยะ (ลำใหญ่ ช้ากว่า เห็นแล้วหลบทัน) */
function tickMother(dt,now){
  if(!mother||msDead) return;
  mother.rotation.y+=dt*.02;
  /* ⚠️ ลำยานหมุนช้าๆ ให้ดูมีชีวิต แต่ "แผงตัวอักษรต้องหันหน้าเข้าเมืองตลอด"
     ไม่งั้นเล่นไปสักพักตัวอักษรจะหันข้าง/หันหลังจนอ่านไม่ออก → หักล้างการหมุนคืนทุกเฟรม */
  mother.position.y=MS_Y+Math.sin(now*.0004)*6;
  /* แผงตัวอักษรลอยตามลำยานเฉพาะแกน Y (ขึ้น-ลงตามที่ยานหายใจ) แต่ "ไม่หมุนตาม" — หันหน้าเข้าเมืองตลอด */
  if(msBoard) msBoard.position.y=mother.position.y-MS_R*0.37;
  msLamps.forEach((lp,i)=>{ lp.visible=Math.sin(now*.004+lp.userData.ph)>-.2; });
  if(msGlow&&msOpen) msGlow.material.opacity=.4+Math.sin(now*.006)*.18;
  /* ตัวอักษรกะพริบ */
  letters.forEach(l=>{
    if(now<l.blinkUntil) l.mesh.material.opacity=(Math.sin(now*.022)>0)?1:.15;
    else l.mesh.material.opacity=1;
  });
  if(now>msBeamAt){
    msBeamAt=now+MS_BEAM_GAP*rnd(.8,1.3);
    const from=mother.position.clone().add(new THREE.Vector3(rnd(-MS_R*.5,MS_R*.5),-MS_R*.3,rnd(-MS_R*.3,MS_R*.4)));
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
    const hitMs=(!hit && msOpen && !msDead && mother && m.mesh.position.distanceTo(mother.position)<MS_R*0.62);
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
    const tgt=fighters.length?fighters[(Math.random()*fighters.length)|0]:null;
    const aim=tgt?tgt.grp.position:(msOpen&&mother?mother.position:null);
    if(aim){
      const d=new THREE.Vector3().subVectors(aim,s.grp.position);
      s.grp.rotation.y=Math.atan2(d.x,d.z);
      s.rifle.rotation.x=-Math.atan2(d.y,Math.hypot(d.x,d.z));
    }
    if(now>s.shotAt&&aim){
      s.shotAt=now+SQUAD_GAP*rnd(.6,1.7);
      const from=s.grp.position.clone().add(new THREE.Vector3(0,1.4,0));
      tracer(from,aim.clone().add(new THREE.Vector3(rnd(-3,3),rnd(-3,3),rnd(-3,3))),0xfff0b0,.05);
      if(Math.random()<0.35){
        if(tgt) damageFighter(tgt,0.5,now);
        else if(msOpen) damageMother(MS_DMG_GUN*0.5);
      }
    }
  });
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
  if(inHeli) tickHeliFlight(dt,now); else tickPlayer(dt,now);
  tickFighters(dt,now);
  tickMother(dt,now);
  tickAlienShots(dt,now);
  tickMissiles(dt,now);
  tickSquad(dt,now);
  tickHelis(dt,now);
  peerTick(dt,now);                 // 🌐 ขยับตัวเพื่อนออนไลน์ให้ลื่น
  netSend(false);                   // 🌐 ส่งตำแหน่งเราขึ้น DB
  tickFx(dt);
  renderer.render(scene,camera);
}

/* ============================================================
   ▶️ เข้า/ออกโลก
   ============================================================ */
function build(){
  buildDom();
  renderer=new THREE.WebGLRenderer({canvas:cvEl,antialias:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
  scene=new THREE.Scene();
  /* ☀️ ท้องฟ้าทะเลทรายอบอ้าว + หมอกฝุ่น (ยานแม่บังแดดจนฟ้าหม่น) */
  const SKY=0xc9a878;
  scene.background=new THREE.Color(SKY);
  scene.fog=new THREE.Fog(SKY,90,WORLD*1.5);
  const skyTex=new Image();
  skyTex.onload=()=>{ const t=new THREE.Texture(skyTex); t.needsUpdate=true;
    const dome=new THREE.Mesh(new THREE.SphereGeometry(WORLD*1.9,32,16),
      new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false}));
    scene.add(dome); };
  skyTex.onerror=()=>{};
  skyTex.src='img/invasion/sky.webp';
  camera=new THREE.PerspectiveCamera(74,innerWidth/innerHeight,.1,WORLD*2.6);
  scene.add(camera);
  scene.add(new THREE.HemisphereLight(0xffe3b8,0x8a6a45,.48));
  const sun=new THREE.DirectionalLight(0xffdca8,.62); sun.position.set(60,120,40); scene.add(sun);
  const rim=new THREE.DirectionalLight(0x6a86b8,.35); rim.position.set(-50,60,-80); scene.add(rim);
  buildTerrain();
  buildTown();
  buildMothership();
  buildGun();
  /* 👥 หน่วยรบภาคพื้น กระจายรอบผู้เล่น + ฝูงเฮลิคอปเตอร์ */
  for(let i=0;i<SQUAD_N;i++){
    const a=rnd(0,TAU), r=rnd(10,42);
    squad.push(makeSoldier(px+Math.cos(a)*r, pz+Math.sin(a)*r));
  }
  for(let i=0;i<HELI_N;i++) helis.push(makeHeli(i));
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
  if(chatBarEl) chatBarEl.classList.remove('on'); if(selfMsgEl) selfMsgEl.classList.remove('on');
  shake=0; fShots.forEach(s=>scene.remove(s.mesh)); fShots=[];
  missiles.forEach(m=>{ scene.remove(m.mesh); scene.remove(m.trail); }); missiles=[];
  fx.forEach(f=>scene.remove(f.o)); fx=[];
  px=0; pz=WORLD*0.42; py=terrainH(px,pz)+EYE; yaw=0; pitch=.42;
  msBeamAt=performance.now()+6000;
  renderHp(); renderHeat(); renderMissiles();
  fit();
  pickWord();
  netJoin();                                            // 🌐 เข้าห้องสมรภูมิออนไลน์ (เห็นเพื่อน map เดียวกัน)
  if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
  keydownFn=e=>{
    const k=e.key.toLowerCase();
    if(k==='w'||k==='arrowup') keys.w=true;
    else if(k==='s'||k==='arrowdown') keys.s=true;
    else if(k==='a'||k==='arrowleft') keys.a=true;
    else if(k==='d'||k==='arrowright') keys.d=true;
    else if(k==='shift') keys.shift=true;
    else if(k===' ') keys.space=true;
    else if(k==='control') keys.ctrl=true;
    else if(k==='r'&&!e.repeat) fireMissile(performance.now());
    else if(k==='h'&&!e.repeat){ resumeAudio(); inHeli?exitHeli():enterHeli(); }
    else if(k==='escape'){ unlockMouse(); exitBox.classList.add('on'); }
    if(['w','a','s','d',' '].includes(k)) e.preventDefault();
  };
  keyupFn=e=>{
    const k=e.key.toLowerCase();
    if(k==='w'||k==='arrowup') keys.w=false;
    else if(k==='s'||k==='arrowdown') keys.s=false;
    else if(k==='a'||k==='arrowleft') keys.a=false;
    else if(k==='d'||k==='arrowright') keys.d=false;
    else if(k==='shift') keys.shift=false;
    else if(k===' ') keys.space=false;
    else if(k==='control') keys.ctrl=false;
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
  cancelAnimationFrame(rafId);
  unlockMouse();
  window.removeEventListener('keydown',keydownFn);
  window.removeEventListener('keyup',keyupFn);
  window.removeEventListener('resize',resizeFn);
  Snd.stopHum(); Snd.stopRotor();
  netLeave();                                           // 🌐 ออกห้องสมรภูมิ + ลบตัวเองจาก DB
  keys={}; firing=false; joy.id=null; joy.dx=joy.dy=0; lookId=null;
  inHeli=false; wrapEl.classList.remove('on','fly');
  exitBox.classList.remove('on');
  if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
  saveState();
  if(typeof renderDashboard==='function') renderDashboard();
  if(sessionWords>0||sessionCoins>0)
    toast(`🛸 กลับจากสมรภูมิ — ปราบยานแม่ ${sessionWords} ลำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.InvasionWorld={
  start,
  /* test hooks — ใช้เฉพาะตอนเทสต์ preview */
  _t:{
    get running(){return running}, set running(v){running=v},
    get word(){return word}, get letters(){return letters.map(l=>({ch:l.ch,down:l.down,op:l.mesh.material.opacity}))},
    get fighters(){return fighters.length}, get msOpen(){return msOpen}, get msArmor(){return msArmor},
    get msDead(){return msDead}, get hp(){return hp}, get heat(){return heat}, get mis(){return misLeft},
    get coins(){return sessionCoins}, get words(){return sessionWords},
    get pos(){return {x:px,y:py,z:pz,yaw,pitch}},
    set pos(v){ if('x'in v)px=v.x; if('z'in v)pz=v.z; if('yaw'in v)yaw=v.yaw; if('pitch'in v)pitch=v.pitch; },
    get squad(){return squad.length}, get helis(){return helis.length},
    get shots(){return fShots.length}, get missiles(){return missiles.length}, get fx(){return fx.length},
    get mother(){return mother}, get camera(){return camera}, get scene(){return scene},
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
    get peerCount(){return Object.keys(peers).length}, get peers(){return Object.keys(peers).map(u=>({n:peers[u].n,kind:peers[u].kind,w:peers[u].w,pos:{...peers[u].cur}}))},
    fakePeer(uid,d){ onPeer({key:uid,val:()=>Object.assign({n:'เทส '+uid,x:0,z:60,y:0,yaw:0,av:'foot',w:0},d||{})}); return peers[uid]; },
    dropPeer, netReady, sendChat, get board(){return boardEl?boardEl.innerText.replace(/\s+/g,' '):''},
    get flyClass(){return wrapEl.classList.contains('fly')},
  }
};
})();
