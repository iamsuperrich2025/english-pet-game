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
   · texture จริง: probe img/f1/*.jpg (ผู้ใช้เจนภาพมาวางตาม PROMPTS_F1.md) — ไม่มี = canvas วาดเองทุกแผ่น
   · เข้าโลก: js/ui.js enterF1_3D (WORLD3D แถว f1) · ห้ามแตะไฟล์นี้จาก moto3d (คนละ engine)
   ───────────────────────────────────────────────────────────────────── */
(function(){
'use strict';

/* ============================================================
   ⚙️ ค่าคงที่ (TUNE ZONE)
   ============================================================ */
const REWARD       = 60;      // 🪙 ประกอบคำสำเร็จ
const LETTER_COIN  = 2;       // 🪙 เก็บตัวอักษร 1 ตัว
const LETTER_COPIES= 3;       // ตัวอักษรเดียวกันวางกี่จุด
const COLLECT_R    = 8;       // รัศมีเก็บ (รถเร็ว ต้องกว้าง)
const DONE_KEY     = 'f1Done';
const HALF_W       = 7.5;     // ครึ่งความกว้างแทร็ก (เมตร) — F1 จริง 12-15ม.
const KERB_W       = 1.6;     // ความกว้างขอบ kerb
const RUNOFF_W     = 9;       // runoff ยางมะตอยข้างแทร็ก (สไตล์ Bahrain)
const SAMPLE_M     = 5;       // ระยะห่างจุด sample เส้นแทร็ก
/* 🪖 มุมมองในห้องคนขับ (รอบ 901) — ภาพหลัก first-person + ปุ่ม 📷 สลับมุมเห็นทั้งคัน */
const FP_EYE   = 1.04;   // ความสูงสายตาคนขับ (ม.)
const FP_FWD   = 0.5;    // ตำแหน่งหัวเยื้องไปหน้ารถจากจุดกลาง (ม.)
const FP_LOOK  = 17;     // จุดมองข้างหน้า (ม.)
const FP_DROP  = 2.6;    // กดสายตาลง — ยกขอบฟ้าให้เห็นแทร็กผ่านช่องมองของภาพค็อกพิท
const FP_FOV   = 70;     // FOV ฐานมุมคนขับ (มุมไล่หลังใช้ 62)
/* 🫨 กล้องสั่นมุมคนขับ บน kerb/ทราย (รอบ 907) */
const SHAKE_KERB_AMP = 0.026;  // แอมพลิจูดสั่น (ม.) บน kerb ที่ความเร็วอ้างอิง SHAKE_SPD_REF
const SHAKE_SAND_AMP = 0.016;  // บนทราย (พื้นนุ่มกว่า kerb แข็ง สั่นเบากว่า)
const SHAKE_SPD_REF  = 40;     // m/s ที่สั่นเต็มแอมพลิจูด — ช้ากว่าลดสัดส่วน เร็วกว่าไม่เพิ่มอีก
const SHAKE_HZ        = 23;    // ความถี่สั่นหลัก (รอบ/วิ)
/* ฟิสิกส์ (หน่วยเมตร/วินาที — 92 m/s = 331 กม./ชม.) */
const PWR_A        = 950;     // กำลังเครื่อง: a = PWR_A / max(v,6)  (แรงมากตอนช้า ลดตามความเร็ว)
const ACC_CAP      = 14.5;    // เพดานอัตราเร่ง (ล้อหมุนฟรี)
const DRAG_K       = 0.00112; // แรงต้านอากาศ a = k·v² (จูนให้ top speed ~92 m/s)
const ROLL_A       = 0.6;     // แรงต้านการหมุน
const BRAKE_A      = 30;      // เบรกพื้นฐาน + เพิ่มตาม downforce
const BRAKE_DF     = 0.0022;  // เบรกส่วน downforce (·v²)
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
/* 🛞 ยางสึก + พิทสต็อป (รอบ 905) — จูนที่นี่ที่เดียว */
const TYRE_W_SLIDE = 0.022;   // สึกต่อวินาที ตอนไถลเต็มที่ (slide=1) ที่ความเร็วสูง
const TYRE_W_ROLL  = 0.000019;// สึกต่อเมตรที่วิ่ง (ขับสวย ๆ ก็สึก แต่ช้ามาก ~0.1/รอบ)
const TYRE_W_KERB  = 0.010;   // สึกเพิ่มต่อวินาที ตอนขี่ kerb
const TYRE_W_SAND  = 0.030;   // สึกเพิ่มต่อวินาที ตอนลงทราย/runoff (ทรายกัดยาง)
const TYRE_GRIP_MIN= 0.62;    // ยางหมดสภาพ = กริปเหลือ 62% (ยังขับได้ แต่ไถลง่ายมาก)
const TYRE_WARN    = 0.30;    // ต่ำกว่านี้ = เกจแดง + เตือนให้เข้าพิท
const PIT_HALF_W   = 6;       // ครึ่งความกว้างเลนพิท (เมตร)
const SURF_PIT     = {grip:1.0, drag:0.25};   // ผิวเลนพิท: ยึดเกาะเต็ม หน่วงนิดเดียว
const PIT_LIMIT    = 22.2;    // จำกัดความเร็วในเลนพิท 80 กม./ชม. (ลิมิตเตอร์อัตโนมัติ)
const PIT_BOX_AT   = 0.5;     // ตำแหน่งช่องจอด = สัดส่วนความยาวเลนพิท
const PIT_BOX_R    = 6;       // รัศมีช่องจอด (กว้างหน่อย เด็กจอดง่าย)
const PIT_STOP_V   = 1.6;     // ต้องช้ากว่านี้ถึงเริ่มนับ (m/s)
const PIT_CANCEL_V = 3.0;     // ขยับเร็วกว่านี้ = ยกเลิก
const PIT_STOP_S   = 3.0;     // เปลี่ยนยางกี่วินาที

/* ============================================================
   📦 สถานะโลก
   ============================================================ */
let built=false, running=false, rafId=0, lastT=0;
let scene, camera, renderer;
let wrapEl, screenEl, hudEl, wordEl, coinsEl, banEl, introEl, exitBox, boardEl, chatBarEl, selfMsgEl;
let speedEl, gearEl, lapEl, bestEl, mapCv, mapCtx, mapBase=null, wrongEl, drsEl;
let knobEl, padThr=0, padBr=false, steerCtl=0, kL=false, kR=false, kThr=false, kBack=false;
let keydownFn, keyupFn, resizeFn;
/* รถเรา */
let px=0, pz=0, yaw=0, vx=0, vz=0, spd=0, steer=0, slide=0, carGrp=null, wheels=[], steerParts=[];
let camPos=null, camInit=false, camYaw=0, shakeT=0;
let camMode='cockpit', cockpitEl=null, camBtnEl=null;   // 🪖 รอบ 901 — มุมคนขับเป็นภาพหลัก
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
/* 🛞🔧 ยางสึก + พิทสต็อป (รอบ 905) */
let tyre=1, tyreEl=null, tyreBarEl=null, tyrePcEl=null, pitEl=null;
let PITL=null, pitBox=null, pitBoxMesh=null, pitSign=null, pitGlow=null;
let inPit=false, pitLaneNow=false, pitLimited=false, pitT=0, pitDoneAt=0, pitStops=0;
let lapPitted=false, pitWrenchAt=-1;
/* เอฟเฟกต์ */
let smokes=[], sparks=[];
let glbSrc=null, glbTried=false;

const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const lerp=(a,b,t)=>a+(b-a)*t;

/* ============================================================
   🔊 เสียงสังเคราะห์ (เครื่องยนต์ V6 hybrid / สกิด / kerb / ลม)
   ============================================================ */
const Snd=(function(){
  let ac=null, eng=null, engHi=null, engGain=null, noise=null, noiseGain=null, skidGain=null, started=false;
  let windLp=null;      // 🪽 รอบ 908: ฟิลเตอร์เสียงลม — เปิดปีก DRS = ลมโปร่งขึ้น (คุมความถี่ตัดจาก tick)
  function ctx(){ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return ac; }
  function noiseBuf(a){
    const b=a.createBuffer(1,a.sampleRate*1,a.sampleRate), ch=b.getChannelData(0);
    for(let i=0;i<ch.length;i++) ch[i]=Math.random()*2-1;
    return b;
  }
  function start(){
    const a=ctx(); if(!a||started) return; started=true;
    if(a.state==='suspended') a.resume();
    engGain=a.createGain(); engGain.gain.value=0; engGain.connect(a.destination);
    eng=a.createOscillator(); eng.type='sawtooth'; eng.frequency.value=70;
    engHi=a.createOscillator(); engHi.type='square'; engHi.frequency.value=140;
    const hiG=a.createGain(); hiG.gain.value=0.35;
    eng.connect(engGain); engHi.connect(hiG); hiG.connect(engGain);
    eng.start(); engHi.start();
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
  let rpm=0;
  /* 🪽 รอบ 908: เสียงลมตอนปีกเปิด — ปีกกางออก = อากาศไหลผ่านโปร่ง เสียง "ซู่" แหลม/ดังขึ้น
     (ปิด = ลมตีปีกทึบ ทุ้มกว่า) · ค่าเป็นความถี่ตัดของ lowpass เส้นเสียงลมเดิม ไม่ได้เพิ่ม node ใหม่ */
  const WIND_LP_SHUT=900, WIND_LP_OPEN=2050, WIND_VOL_DRS=1.45;
  function tick(v,thr,sliding,dt,drs){
    if(!started||!ac) return;
    /* เกียร์ 8 สปีด — rpm ไต่ในเกียร์ แล้วตกตอนเปลี่ยน */
    const g=gearOf(v);
    const gLo=GEARS[g-1]||0, gHi=GEARS[g]||92;
    const inGear=clamp((v-gLo)/Math.max(1,gHi-gLo),0,1);
    const target=0.25+inGear*0.75;
    rpm=lerp(rpm,target,clamp(dt*8,0,1));
    const f=55+rpm*rpm*560+(thr>0.05?30:0);
    eng.frequency.setTargetAtTime(f,ac.currentTime,0.03);
    engHi.frequency.setTargetAtTime(f*2.01,ac.currentTime,0.03);
    engGain.gain.setTargetAtTime(0.05+0.10*rpm+(thr>0.05?0.035:0),ac.currentTime,0.05);
    noiseGain.gain.setTargetAtTime(clamp(v/92,0,1)*0.16*(drs?WIND_VOL_DRS:1),ac.currentTime,0.1);
    skidGain.gain.setTargetAtTime(sliding?0.16:0,ac.currentTime,sliding?0.03:0.12);
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
  /* 🔧 รอบ 898: ปืนลมขันน็อตล้อ (wheel gun) — noise สั่นเป็นพัลส์ผ่าน bandpass สูง + เนื้อโลหะ */
  function wrench(dur){
    const a=ctx(); if(!a||!started) return;
    const t0=a.currentTime, d=dur||0.42;
    const n=a.createBufferSource(); n.buffer=noiseBuf(a); n.loop=true;
    const bp=a.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2600; bp.Q.value=1.4;
    const g=a.createGain(); g.gain.value=0;
    n.connect(bp); bp.connect(g); g.connect(a.destination);
    /* พัลส์ 22 ครั้ง/วิ = เสียงรัวของปืนลม */
    for(let t=0;t<d;t+=1/22){
      g.gain.setValueAtTime(0.001,t0+t);
      g.gain.linearRampToValueAtTime(0.14,t0+t+0.008);
      g.gain.exponentialRampToValueAtTime(0.004,t0+t+1/26);
    }
    g.gain.setValueAtTime(0.0001,t0+d);
    n.start(t0); n.stop(t0+d+0.02);
    /* เนื้อโลหะเบา ๆ ซ้อน */
    const o=a.createOscillator(), og=a.createGain();
    o.type='square'; o.frequency.setValueAtTime(150,t0);
    o.frequency.linearRampToValueAtTime(210,t0+d);
    og.gain.setValueAtTime(0.03,t0); og.gain.exponentialRampToValueAtTime(0.001,t0+d);
    o.connect(og); og.connect(a.destination); o.start(t0); o.stop(t0+d);
  }
  /* 🛞 ยางใหม่พร้อม — ลมปล่อยแม่แรง + ระฆังสองโน้ต */
  function tyreDone(){
    const a=ctx(); if(!a||!started) return;
    const t0=a.currentTime;
    const n=a.createBufferSource(); n.buffer=noiseBuf(a);
    const hp=a.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1800;
    const g=a.createGain();
    g.gain.setValueAtTime(0.16,t0); g.gain.exponentialRampToValueAtTime(0.001,t0+0.3);
    n.connect(hp); hp.connect(g); g.connect(a.destination); n.start(t0); n.stop(t0+0.32);
    [[660,0.05],[990,0.19]].forEach(([f,at])=>{
      const o=a.createOscillator(), og=a.createGain();
      o.type='triangle'; o.frequency.value=f;
      og.gain.setValueAtTime(0.0001,t0+at);
      og.gain.linearRampToValueAtTime(0.1,t0+at+0.02);
      og.gain.exponentialRampToValueAtTime(0.001,t0+at+0.36);
      o.connect(og); og.connect(a.destination); o.start(t0+at); o.stop(t0+at+0.38);
    });
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
    try{ ac.close(); }catch(e){}
    ac=null; started=false; rpm=0; windLp=null;
  }
  return {start,tick,kerb,wrench,tyreDone,blip,wing,stop,get rpm(){return rpm;},get on(){return started;},
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
function crowdTex(){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#20242e'; g.fillRect(0,0,w,h);
    for(let r=0;r<10;r++)for(let i=0;i<46;i++){
      g.fillStyle=['#e8c08c','#c98d5a','#f2d6a8'][i%3];
      g.fillRect(i*w/46+(r%2?3:0), r*h/10+2, 3, 3);
      g.fillStyle=['#d33','#36c','#eee','#fc2','#3c9','#c3e','#f80','#0af'][(i*7+r)%8];
      g.fillRect(i*w/46+(r%2?3:0)-1, r*h/10+5, 5, 5);
    }
  },512,128,1,1);
}
function garageTex(){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#8e959e'; g.fillRect(0,0,w,h);
    for(let i=0;i<8;i++){
      g.fillStyle='#2a2e34'; g.fillRect(i*w/8+4,h*0.28,w/8-8,h*0.7);
      g.fillStyle='#4a5058';
      for(let r=0;r<5;r++) g.fillRect(i*w/8+4,h*0.28+r*h*0.14,w/8-8,2);
    }
    g.fillStyle='#c8ced6'; g.fillRect(0,0,w,h*0.1);
  },512,128,1,1);
}
function towerTex(){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle='#1c2f45'; g.fillRect(0,0,w,h);
    for(let r=0;r<14;r++)for(let i=0;i<24;i++){
      g.fillStyle=Math.random()<0.55?'#ffdf8a':'#0e1a28';
      g.fillRect(i*w/24+2,r*h/14+2,w/24-4,h/14-4);
    }
  },256,256,3,1);
}
function adTex(txt,fg,bg){
  return texFromCanvas((g,w,h)=>{
    g.fillStyle=bg; g.fillRect(0,0,w,h);
    g.fillStyle=fg; g.font='bold '+(h*0.62|0)+'px Arial'; g.textAlign='center'; g.textBaseline='middle';
    g.fillText(txt,w/2,h/2+2);
  },512,64,1,1);
}
function tentTex(){
  return texFromCanvas((g,w,h)=>{
    const gr=g.createLinearGradient(0,0,0,h);
    gr.addColorStop(0,'#ffffff'); gr.addColorStop(1,'#c9d2dd');
    g.fillStyle=gr; g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(120,130,150,0.5)';
    for(let i=0;i<8;i++){ g.beginPath(); g.moveTo(i*w/8,0); g.lineTo(w/2,h); g.stroke(); }
  },256,128,1,1);
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
function buildBuildings(){
  const g=new THREE.Group();
  const crowdMat=matLit('crowd');
  const bldMat=new THREE.MeshLambertMaterial({color:0x9aa3ad});
  const glassMat=matLit('tower');
  const tentMat=matLam('tent',{side:THREE.DoubleSide});
  let pitDone=false;
  for(const b of (F1_MAP.bld||[])){
    const c=polyCentroid(b.p);
    if(b.t==='gs'){
      /* อัฒจันทร์จริง: ฐานทึบ + ผนังคนดู + หลังคาผ้าใบขาว (เอกลักษณ์ Bahrain) */
      g.add(extrudeFootprint(b.p,3.2,bldMat,0));
      g.add(extrudeFootprint(b.p.map(p=>[c[0]+(p[0]-c[0])*0.94,c[1]+(p[1]-c[1])*0.94]),8.5,crowdMat,3.2));
      const roof=extrudeFootprint(b.p.map(p=>[c[0]+(p[0]-c[0])*1.05,c[1]+(p[1]-c[1])*1.05]),0.7,tentMat,13.4);
      g.add(roof);
      /* เสาหลังคา */
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,13.5,6),new THREE.MeshLambertMaterial({color:0xdde3ea}));
      for(let k=0;k<b.p.length;k+=Math.max(1,b.p.length/6|0)){
        const m2=post.clone(); m2.position.set(b.p[k][0],6.7,b.p[k][1]); g.add(m2);
      }
    }else if(b.t==='tw'){
      /* 🗼 Sakhir Tower — ทรงกระบอกแก้ว + จานชมวิว 2 ชั้น + ยอดเสา (ตามภาพจริง) */
      const tw=new THREE.Group();
      tw.add(new THREE.Mesh(new THREE.CylinderGeometry(5.2,6.5,40,14),glassMat));
      tw.children[0].position.y=20;
      const disc=new THREE.Mesh(new THREE.CylinderGeometry(10.5,8.5,5,16),new THREE.MeshLambertMaterial({color:0xe8ecf2}));
      disc.position.y=42; tw.add(disc);
      const disc2=new THREE.Mesh(new THREE.CylinderGeometry(7,9.5,3.4,16),glassMat);
      disc2.position.y=46; tw.add(disc2);
      const tip=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.6,10,6),new THREE.MeshLambertMaterial({color:0xb8bfc9}));
      tip.position.y=52; tw.add(tip);
      /* ไฟวิบวับยอดเสา */
      const beacon=new THREE.Mesh(new THREE.SphereGeometry(0.7,8,6),new THREE.MeshBasicMaterial({color:0xff3030}));
      beacon.position.y=57.4; tw.add(beacon); tw.userData.beacon=beacon;
      tw.position.set(c[0],0,c[1]);
      g.add(tw); g.userData.tower=tw;
    }else{
      /* อาคารพิท/ทีม: หลังที่ใกล้ pit lane สุด = พิทหลัก (facade โรงรถ) */
      let mat=bldMat,h=7+Math.random()*3;
      if(!pitDone&&F1_MAP.pit&&F1_MAP.pit.length){
        const pc=F1_MAP.pit[F1_MAP.pit.length>>1];
        if(Math.hypot(c[0]-pc[0],c[1]-pc[1])<120){
          mat=matLit('garage'); h=11; pitDone=true;
        }
      }
      g.add(extrudeFootprint(b.p,h,mat,0));
    }
  }
  return g;
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
    scene.add(bb);
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
    buildPitBox();                                     // 🛞 รอบ 905 — ช่องจอดเปลี่ยนยาง + เสาป้าย
  }
  scene.add(buildBuildings());
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
#f1-cockpit{position:absolute;inset:0 0 -8% 0;z-index:5;pointer-events:none;display:none;
  background:url('img/f1/cockpit.webp') center bottom/cover no-repeat}   /* bottom -8% = จมูกรถจมลงใต้จอ เปิดมุมมองแทร็กกว้างขึ้น */
#f1-wrap.fp #f1-cockpit{display:block}
/* จอกว้างเตี้ย (มือถือแนวนอน) — cover จะเอาค็อกพิทบังเต็มจอ: ตรึงขอบบน (halo อยู่ครบ) + สูง 128%
   ตัดหน้าปัด/ขอบล่างทิ้งใต้จอแทน · บีบแนวตั้ง ~10% ตามองไม่ออก แต่เปิดพื้นที่เห็นแทร็กเพิ่มมาก */
@media (min-aspect-ratio: 9/5){
  #f1-wrap.fp #f1-cockpit{inset:0;background-size:100% 128%;background-position:center top}
}
#f1-cambtn{position:absolute;left:10px;bottom:50px;z-index:7;background:rgba(8,12,24,.78);
  border:1px solid rgba(255,255,255,.25);color:#fff;font-weight:800;font-size:13.5px;font-family:inherit;
  border-radius:12px;padding:6px 11px}
#f1-word{position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;
  background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:5px 12px;white-space:nowrap;z-index:6}
#f1-word .f-chip{display:inline-block;min-width:24px;padding:2px 5px;margin:0 1px;border-radius:7px;background:#26304a;
  color:#8fa2c8;font-weight:800;font-size:17px;text-align:center;text-transform:uppercase}
#f1-word .f-chip.got{background:#ffd12e;color:#5c3500}
#f1-word .f-th{color:#cfe0ff;font-size:14px}
#f1-hud{position:absolute;right:10px;bottom:88px;text-align:right;z-index:6;pointer-events:none}
#f1-speed{font-size:44px;font-weight:900;color:#fff;line-height:1;text-shadow:0 2px 10px #000}
#f1-speed small{font-size:14px;color:#9fb2d8}
#f1-gear{display:inline-block;margin-top:2px;background:#e10600;color:#fff;font-weight:900;font-size:20px;
  border-radius:8px;padding:1px 10px}
#f1-laps{position:absolute;left:10px;top:8px;background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.16);
  border-radius:12px;padding:6px 10px;color:#fff;font-size:13px;line-height:1.5;z-index:6;pointer-events:none}
#f1-laps b{color:#ffd12e}
#f1-coins{position:absolute;right:10px;top:8px;background:rgba(8,12,24,.72);border:1px solid rgba(255,209,46,.35);
  border-radius:12px;padding:6px 12px;color:#ffd12e;font-weight:800;font-size:15px;z-index:6}
#f1-map{position:absolute;left:10px;bottom:88px;width:130px;height:130px;z-index:6;opacity:.92;pointer-events:none}
#f1-wrong{position:absolute;top:34%;left:50%;transform:translateX(-50%);background:rgba(216,26,26,.9);color:#fff;
  font-weight:900;font-size:20px;border-radius:12px;padding:8px 18px;display:none;z-index:7}
/* 🪽 ป้าย DRS (รอบ 898) — ซ่อนตอนไม่อยู่ในโซน · เทาตอนยังเปิดไม่ได้ · เขียวเรืองตอนเปิด */
#f1-drs{position:absolute;right:10px;bottom:240px;z-index:6;pointer-events:none;display:none;text-align:right;
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
/* 🛞 เกจยาง + ป้ายพิท (รอบ 905) */
#f1-tyre{position:absolute;right:10px;top:46px;z-index:6;pointer-events:none;display:flex;align-items:center;gap:6px;
  background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:4px 10px}
#f1-tyre .t-lab{font-size:15px}
#f1-tyre .t-bar{display:block;width:78px;height:9px;border-radius:5px;background:rgba(255,255,255,.14);overflow:hidden}
#f1-tyre .t-bar i{display:block;height:100%;width:100%;background:#2ecc55;border-radius:5px;transition:width .2s,background .3s}
#f1-tyre .t-pc{font-size:13px;font-weight:800;color:#2ecc55;min-width:38px;text-align:right}
#f1-tyre.low{animation:f1tyre .6s ease-in-out infinite alternate}
@keyframes f1tyre{from{border-color:rgba(255,59,48,.35)}to{border-color:rgba(255,59,48,1);box-shadow:0 0 14px rgba(255,59,48,.6)}}
#f1-pit{position:absolute;top:96px;left:50%;transform:translateX(-50%);z-index:7;display:none;pointer-events:none;
  background:rgba(8,12,24,.82);border:1px solid rgba(255,209,46,.45);border-radius:12px;padding:5px 14px;
  color:#ffd12e;font-weight:800;font-size:15px;text-align:center;max-width:90vw}
#f1-pit.on{display:block}
#f1-pit .pit-hd.warn{color:#ff9a9a}
#f1-pit .pit-sub{color:#cfe0ff;font-weight:600;font-size:12.5px}
#f1-pit .pit-bar{margin-top:4px;width:190px;height:8px;border-radius:5px;background:rgba(255,255,255,.16);overflow:hidden}
#f1-pit .pit-bar i{display:block;height:100%;background:#2ecc55;border-radius:5px}
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
#f1-chatbar{position:absolute;left:50%;transform:translateX(-50%);bottom:88px;display:none;gap:6px;z-index:7;
  flex-wrap:wrap;justify-content:center;max-width:92vw}
#f1-chatbar.on{display:flex}
#f1-chatbar button{background:rgba(14,22,40,.9);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:20px;
  padding:6px 12px;font-size:13px;font-family:inherit}
#f1-chatbtn{position:absolute;right:10px;bottom:190px;width:44px;height:44px;border-radius:50%;z-index:7;
  background:rgba(14,22,40,.85);border:1px solid rgba(255,255,255,.3);color:#fff;font-size:20px}
#f1-selfmsg{position:absolute;bottom:150px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.92);
  color:#12283f;border-radius:14px;padding:5px 14px;font-size:14px;font-weight:700;display:none;z-index:7}
#f1-selfmsg.on{display:block}
#f1-exitbtn{position:absolute;left:10px;bottom:8px;z-index:7;background:rgba(216,26,26,.85);border:none;color:#fff;
  border-radius:12px;padding:8px 14px;font-size:14px;font-weight:800;font-family:inherit}
#f1-steer{position:absolute;left:66px;bottom:8px;width:min(34vw,240px);height:64px;background:rgba(255,255,255,.10);
  border:1px solid rgba(255,255,255,.22);border-radius:32px;z-index:7}
#f1-knob{position:absolute;top:4px;left:50%;width:56px;height:56px;margin-left:-28px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#ffb054,#e07800);box-shadow:0 2px 8px rgba(0,0,0,.5);
  display:flex;align-items:center;justify-content:center;font-size:24px}
#f1-pedals{position:absolute;right:10px;bottom:8px;display:flex;gap:10px;z-index:7}
.f1-pedal{width:72px;height:72px;border-radius:50%;border:none;font-size:26px;font-family:inherit;font-weight:900;
  color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.5)}
#f1-brake{background:radial-gradient(circle at 35% 30%,#ff6a6a,#b41414)}
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
/* 🏆 กระดานอันดับ Best Lap ในหน้า intro (รอบ 903) */
#f1-intro .fi-cols{display:flex;gap:14px;text-align:left;margin-top:2px;min-height:0}
#f1-intro .fi-rules{flex:1.15;min-width:0}
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
@media (max-height:430px){
  #f1-speed{font-size:30px}
  #f1-map{width:96px;height:96px;bottom:104px}
  #f1-hud{bottom:104px}
  #f1-chatbtn{bottom:196px}
  #f1-drs{bottom:246px;font-size:15px;padding:3px 9px}
  #f1-drs small{font-size:10px}
  /* จอเตี้ย: ต้องไม่ชนเหรียญ (สูงถึง y=44) และไม่ชนป้ายรถเงา (ถึง y=84) */
  #f1-tyre{top:48px;padding:3px 8px}
  #f1-tyre .t-bar{width:58px}
  #f1-pit{top:90px;font-size:13.5px;padding:4px 11px}
  #f1-pit .pit-bar{width:150px}
}`;
function buildDom(){
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='f1-wrap';
  wrapEl.innerHTML=`
    <canvas id="f1-cv"></canvas>
    <div id="f1-cockpit"></div>
    <div id="f1-word"></div>
    <div id="f1-laps"></div>
    <div id="f1-coins">🪙 +0</div>
    <div id="f1-board"></div>
    <canvas id="f1-map" width="260" height="260"></canvas>
    <div id="f1-hud"><div id="f1-speed">0<small> กม./ชม.</small></div><span id="f1-gear">N</span></div>
    <div id="f1-drs"></div>
    <div id="f1-tyre"><span class="t-lab">🛞</span><span class="t-bar"><i></i></span><span class="t-pc">100%</span></div>
    <div id="f1-pit"></div>
    <div id="f1-lights"><div class="row"><i></i><i></i><i></i><i></i><i></i></div><b>🚦 รอไฟดับก่อนออกตัว</b></div>
    <div id="f1-gap"></div>
    <div id="f1-wrong">↩️ วิ่งผิดทาง! กลับรถ</div>
    <div id="f1-ban"></div>
    <div id="f1-selfmsg"></div>
    <button id="f1-chatbtn">💬</button>
    <div id="f1-chatbar"></div>
    <button id="f1-cambtn">📷 มุมรถ</button>
    <button id="f1-exitbtn">🏁 ออก</button>
    <div id="f1-steer"><div id="f1-knob">🏎️</div></div>
    <div id="f1-pedals">
      <button class="f1-pedal" id="f1-brake">🛑</button>
      <button class="f1-pedal" id="f1-throttle">⚡</button>
    </div>
    <div id="f1-intro"><div class="box">
      <h2>🏎️ สนามซาเคียร์ · บาห์เรน กรังด์ปรีซ์</h2>
      <div class="fi-cols">
        <div class="fi-rules">
          สนามจริง 5.4 กม. 15 โค้ง แข่งกลางทะเลทรายใต้แสงไฟ!<br>
          ⚡ = คันเร่ง · 🛑 = เบรก · ลูกบิดส้ม = พวงมาลัย<br>
          (คีย์บอร์ด: W เร่ง · S เบรก · A/D เลี้ยว)<br>
          🔤 เก็บตัวอักษรบนแทร็กประกอบคำ = <b style="color:#ffd12e">+${REWARD} 🪙</b><br>
          🏁 วิ่งครบรอบมีจับเวลา — ทำ Best Lap ให้ไวสุด!<br>
      🚦 ออกสตาร์ทจริง: ไฟแดงติดทีละดวงจนครบ 5 แล้ว<b style="color:#ffd12e">ดับพร้อมกัน = ออกตัว</b> (คันเร่งล็อกก่อนไฟดับ)<br>
      👻 ทำเวลาได้แล้วรอบถัดไปจะมี<b style="color:#67d8ff">รถเงาของตัวเอง</b>วิ่งให้ไล่แข่ง<br>
          🪽 <b style="color:#2dff8c">DRS</b> = ทางตรง 2 ช่วง (เส้นเขียวบนแผนที่) ถ้าตามรถเพื่อนใกล้กว่า 25 ม.
          ปีกหลังจะเปิดเอง วิ่งเร็วขึ้น 8% ไว้แซง!<br>
          🛞 <b style="color:#ffd12e">ยางสึกได้!</b> ยิ่งไถล/ดริฟต์ ยางยิ่งหมดไว (ดูเกจ 🛞 มุมขวาบน)
          — ยางโทรม = รถลื่นขึ้น เข้า<b style="color:#67d8ff">เลนพิท</b> (เส้นประบนแผนที่) จอดนิ่งในช่อง 3 วิ = ยางใหม่<br>
          🪖 เริ่มที่<b style="color:#67d8ff">มุมคนขับในค็อกพิท</b> — ปุ่ม 📷 มุมซ้ายล่างสลับเป็นมุมเห็นรถทั้งคัน<br>
          ⚠️ ออกนอกแทร็กระวังทราย รถจะลื่นและช้าลงมาก
        </div>
        <div class="fi-rank" id="f1-rankbox">
          <div class="fi-rank-h">🏆 อันดับ Best Lap</div>
          <div class="fr-list"></div>
          <div class="fr-note"></div>
        </div>
      </div>
      <button id="f1-go">สตาร์ทเครื่อง! 🏎️</button>
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
  chatBarEl=wrapEl.querySelector('#f1-chatbar');
  selfMsgEl=wrapEl.querySelector('#f1-selfmsg');
  speedEl=wrapEl.querySelector('#f1-speed');
  gearEl=wrapEl.querySelector('#f1-gear');
  lapEl=wrapEl.querySelector('#f1-laps');
  wrongEl=wrapEl.querySelector('#f1-wrong');
  drsEl=wrapEl.querySelector('#f1-drs');
  /* 🛞 รอบ 905 */
  tyreEl=wrapEl.querySelector('#f1-tyre');
  tyreBarEl=tyreEl.querySelector('.t-bar i');
  tyrePcEl=tyreEl.querySelector('.t-pc');
  pitEl=wrapEl.querySelector('#f1-pit');
  knobEl=wrapEl.querySelector('#f1-knob');
  /* 🚦👻 รอบ 902 */
  lightsEl=wrapEl.querySelector('#f1-lights');
  lightDots=[].slice.call(lightsEl.querySelectorAll('i'));
  lightNoteEl=lightsEl.querySelector('b');
  gapEl=wrapEl.querySelector('#f1-gap');
  mapCv=wrapEl.querySelector('#f1-map'); mapCtx=mapCv.getContext('2d');
  wrapEl.querySelector('#f1-go').addEventListener('click',()=>{ introEl.style.display='none'; Snd.start(); beginLights(); });
  wrapEl.querySelector('#f1-exitbtn').addEventListener('click',()=>exitBox.classList.add('on'));
  wrapEl.querySelector('#f1-stay').addEventListener('click',()=>exitBox.classList.remove('on'));
  wrapEl.querySelector('#f1-leave').addEventListener('click',exitWorld);
  /* 🪖 รอบ 901: ปุ่มสลับมุมมอง คนขับ ↔ เห็นรถทั้งคัน */
  cockpitEl=wrapEl.querySelector('#f1-cockpit');
  camBtnEl=wrapEl.querySelector('#f1-cambtn');
  camBtnEl.addEventListener('click',()=>{ camMode=camMode==='cockpit'?'chase':'cockpit'; applyCamMode(); });
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
    knobEl.style.left=(50+t*50*(1-56/r.width))+'%';
  }
  steerBox.addEventListener('pointerdown',e=>{ sid=e.pointerId; steerBox.setPointerCapture(sid); steerTo(e.clientX); });
  steerBox.addEventListener('pointermove',e=>{ if(sid===e.pointerId) steerTo(e.clientX); });
  const sEnd=e=>{ if(sid===e.pointerId){ sid=null; steerCtl=0; knobEl.style.left='50%'; } };
  steerBox.addEventListener('pointerup',sEnd); steerBox.addEventListener('pointercancel',sEnd);
  /* คันเร่ง/เบรก */
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
  scene.add(new THREE.HemisphereLight(0x9aabdf,0x40361f,0.72));
  const sun=new THREE.DirectionalLight(0xf4f7ff,1.05);
  sun.position.set(-300,500,-200); scene.add(sun);
  const warm=new THREE.DirectionalLight(0xffc98a,0.35);
  warm.position.set(200,120,300); scene.add(warm);
  /* glow texture ไฟสนาม */
  TexLib.glow=texFromCanvas((g,w,h)=>{
    const gr=g.createRadialGradient(w/2,h/2,2,w/2,h/2,w/2);
    gr.addColorStop(0,'rgba(255,250,230,0.9)'); gr.addColorStop(0.4,'rgba(255,240,200,0.25)');
    gr.addColorStop(1,'rgba(255,240,200,0)');
    g.fillStyle=gr; g.fillRect(0,0,w,h);
  },128,64);
  /* texture หลัก — probe img/f1/*.jpg (ภาพผู้ใช้เจน) ก่อน · ไม่มี = canvas ที่วาดเอง */
  TexLib.asphalt=asphaltTex();
  texProbe('asphalt.jpg',TexLib.asphalt,t=>{ t.repeat.set(1,1); applyTex('asphalt',t);
    /* ภาพถ่ายยางมะตอยมักสว่างกว่าสนามจริงตอนกลางคืน — tint เข้มลงด้วย material.color (คูณกับ map) */
    (TexUsers.asphalt||[]).forEach(m=>m.color.setHex(0x87898d)); });
  TexLib.kerb=kerbTex();
  TexLib.sand=sandTex();
  texProbe('sand.jpg',TexLib.sand,t=>{ t.repeat.set(60,60); applyTex('sand',t); });
  /* ⚠️ UV ของ ExtrudeGeometry (อัฒจันทร์/พิท/หลังคา) เป็น "หน่วยเมตร" — repeat ต้องเป็นเศษส่วน
     ไม่งั้นภาพถ่ายจะถูกปูซ้ำทุก 1 เมตร กลายเป็นลายจุด (canvas fallback จงใจปูถี่ ไม่ต้องแก้) */
  TexLib.crowd=crowdTex();
  texProbe('crowd.jpg',TexLib.crowd,t=>{ t.repeat.set(1/35,1/8.5); applyTex('crowd',t); });
  TexLib.garage=garageTex();
  texProbe('pit.jpg',TexLib.garage,t=>{ t.repeat.set(1/22,1/11); applyTex('garage',t); });
  TexLib.tower=towerTex();
  texProbe('tower.jpg',TexLib.tower,t=>{ t.repeat.set(3,1); applyTex('tower',t); });
  TexLib.tent=tentTex();
  texProbe('tent.jpg',TexLib.tent,t=>{ t.repeat.set(1/18,1/18); applyTex('tent',t); });
  TexLib.adGP=adTex('SAKHIR GRAND PRIX','#fff','#d81a1a');
  TexLib.adSakhir=adTex('BAHRAIN','#fff','#0a3b8c');
  TexLib.adVocab=adTex('VOCAB WORLD','#5c3500','#ffd12e');
  TexLib.adSpeed=adTex('DESERT SPEED','#0af','#0c1220');
  buildTrackScene();
  buildDrsBoards();      // 🪽 รอบ 908 — ป้ายเสา DRS (ต้องมาหลัง TexLib.glow + findDrsZones + มี scene แล้ว)
  /* รถเรา */
  carGrp=buildF1Car(0xe10600);
  scene.add(carGrp);
  attachDrsGlow(carGrp);                      // 🪽 รอบ 904 (รถเราคันเดียว — เพื่อนไม่ส่งสถานะ DRS)
  wheels=carGrp.userData.wheels||[]; steerParts=carGrp.userData.front||[];
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
  /* 🛞 รอบ 905: เลนพิท (เส้นประเทา) + ช่องเปลี่ยนยาง (จุดฟ้า) */
  if(PITL){
    mg.strokeStyle='rgba(180,196,224,.85)'; mg.lineWidth=3; mg.setLineDash([7,5]);
    mg.beginPath();
    for(let i=0;i<PITL.n;i+=2){
      const [mx,my]=mapXY(PITL.x[i],PITL.z[i],bb);
      if(i===0) mg.moveTo(mx,my); else mg.lineTo(mx,my);
    }
    mg.stroke(); mg.setLineDash([]);
    if(pitBox){
      const [bx,by]=mapXY(pitBox.x,pitBox.z,bb);
      mg.fillStyle='#67d8ff'; mg.strokeStyle='#0b1220'; mg.lineWidth=2;
      mg.beginPath(); mg.arc(bx,by,6,0,Math.PI*2); mg.fill(); mg.stroke();
      mg.fillStyle='#0b1220'; mg.font='bold 9px sans-serif'; mg.textAlign='center';
      mg.fillText('P',bx,by+3.2);
    }
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
  for(const b of bots){                         // 🤖 รอบ 909 — จุดรถบอตบนแผนที่ (สีเดียวกับตัวรถ)
    if(!b.grp||!b.grp.visible) continue;
    const [bx,by]=mapXY(b.x,b.z,bb);
    mapCtx.fillStyle='#'+b.col.toString(16).padStart(6,'0');
    mapCtx.beginPath(); mapCtx.arc(bx,by,4.5,0,Math.PI*2); mapCtx.fill();
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
/* ระยะรถที่อยู่ "ข้างหน้า" ใกล้สุด (0 = ไม่มีใครในระยะ) — นับทั้งเพื่อนจริงและรถบอต (รอบ 907) */
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
  /* 🤖 รอบ 909: รถบอตนับเป็น "รถข้างหน้า" ด้วย → เล่นคนเดียวก็เปิด DRS ได้ (เดิมต้องมีเพื่อนออนไลน์) */
  for(const b of bots){
    if(!b.grp||!b.grp.visible) continue;
    const dx=b.x-px, dz=b.z-pz;
    if(dx*fx+dz*fz<=0) continue;
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
              :'ตามรถคันหน้าให้ใกล้กว่า '+DRS_NEAR_M+' ม.'+(drsGap?'':' (ตอนนี้ไม่มีใครอยู่ข้างหน้า)'))+'</small>';
              /* 🤖 รอบ 909: "รถคันหน้า" = เพื่อนออนไลน์ หรือรถบอต (เดิมเขียนว่า "รถเพื่อน" อย่างเดียว) */
  else drsEl.className='';
}

/* ============================================================
   🤖🏎️ รอบ 909: รถบอต 4 คันวิ่งตามเส้น LINE — ให้ผู้เล่นไล่แซง + นับเป็น "รถข้างหน้า" ของ DRS (รอบ 904)
   · ฟิสิกส์ง่าย ๆ แต่ได้จังหวะจริง: ไม่จำลองล้อ/พวงมาลัยรายคัน แต่คิด "โปรไฟล์ความเร็วของแทร็ก"
     ไว้ล่วงหน้าครั้งเดียว = ลิมิตโค้งจาก |LINE.curv| (สูตร downforce ชุดเดียวกับรถผู้เล่น)
     → ไล่ถอยหลังใส่ระยะเบรก → ไล่หน้าใส่อัตราเร่ง  (บอทจึงเบรกก่อนโค้งและออกโค้งเหมือนคนขับจริง)
   · เร็วต่างกันด้วยตัวคูณ BOT_SKILL คันละค่า → ขบวนยืดออก ผู้เล่นไล่แซงได้ทีละคัน
   · ตำแหน่ง = ระยะทางบนเส้น s (เมตร) → หา index จาก LINE.cum แล้วเยื้องข้างตามเลนของตัวเอง
   · ล็อกจนไฟแดงดับเหมือนผู้เล่น (รอบ 902) + มีเวลาปฏิกิริยาของตัวเองคันละค่า
   · ไม่มีการชน (เหมือนรถเพื่อน/รถเงา) — เด็กขับทะลุได้ ไม่หมุนออกนอกแทร็กเพราะบอท
   ============================================================ */
const BOT_N        = 4;                                    // จำนวนรถบอตในสนาม
const BOT_SKILL    = [1.00,0.96,0.92,0.88];                // ตัวคูณความเร็ว (คันแรกเร็วสุด อยู่หน้าสุด)
const BOT_NAMES    = ['บอทแดง','บอทฟ้า','บอทเขียว','บอทส้ม'];
const BOT_COLORS   = [0xe10600,0x0090ff,0x00d2be,0xff8700];
const BOT_LANE     = [-0.46,0.44,-0.16,0.18];              // เลนวิ่ง (สัดส่วนของ HALF_W — ห่างพอไม่ซ้อนกันตอนโดนล็อกรอบ)
const BOT_VMAX     = 90;                                   // ท็อปสปีดบอทเก่งสุด (m/s ≈ 324 กม./ชม. · ผู้เล่น 92.8)
const BOT_GRIP     = 0.92;                                 // บอทวิ่งต่ำกว่าลิมิตกริปจริงนิดหน่อย (คนขับเก่งกว่าได้)
const BOT_ACC_K    = 0.92;                                 // ตัวคูณอัตราเร่ง (ใช้สูตร PWR_A/v ของรถผู้เล่น)
const BOT_BRAKE    = 26;                                   // อัตราเบรกบอท (m/s² · ผู้เล่น BRAKE_A=30 + downforce)
const BOT_START_GAP= 9;                                    // ระยะห่างระหว่างบอทตอนตั้งกริด (ม.)
const BOT_REACT    = [0.20,0.34,0.48,0.62];                // เวลาปฏิกิริยาหลังไฟดับ (วิ)
const BOT_WOB      = 0.02;                                 // ความเร็วแกว่งเล็กน้อย ±2% (ช่องว่างขยับ ไม่ใช่ขบวนแข็งทื่อ)
const BOT_PASS_R   = 30;                                   // ระยะที่นับว่า "แซงกัน" (ม.) — ไกลกว่านี้ไม่ขึ้นป้าย
let bots=[], botProf=null, botProfLen=0, botBanAt=0;

/* โปรไฟล์ความเร็วของแทร็ก (คิดครั้งเดียวต่อสนาม · ~1,080 จุด) */
function botProfileBuild(){
  if(botProf&&botProfLen===LINE.n) return botProf;
  const m=LINE.n, v=new Float32Array(m);
  const dsOf=i=>(i+1<m?LINE.cum[i+1]-LINE.cum[i]:TOTAL-LINE.cum[m-1])||SAMPLE_M;
  /* ① ลิมิตโค้ง: v²·c ≤ (GRIP_BASE+GRIP_DF·v²)·BOT_GRIP  (สูตร downforce เดียวกับรถผู้เล่น) */
  for(let i=0;i<m;i++){
    const c=Math.abs(LINE.curv[i]);
    const den=c-GRIP_DF*BOT_GRIP;
    let lim=BOT_VMAX;
    if(den>1e-5) lim=Math.min(lim,Math.sqrt(GRIP_BASE*BOT_GRIP/den));
    if(c>1e-5)   lim=Math.min(lim,Math.sqrt(GRIP_CAP*BOT_GRIP/c));    // เพดานกริป
    v[i]=lim;
  }
  /* ② ไล่ถอยหลัง: ต้องเบรกทันโค้งข้างหน้า (วนรอบสนาม 2 รอบให้ลู่เข้าที่) */
  for(let k=m*2;k>=0;k--){
    const i=k%m, j=(i+1)%m;
    const cap=Math.sqrt(v[j]*v[j]+2*BOT_BRAKE*dsOf(i));
    if(v[i]>cap) v[i]=cap;
  }
  /* ③ ไล่หน้า: ออกจากโค้งเร่งได้เท่าที่เครื่องมี */
  for(let k=0;k<=m*2;k++){
    const i=k%m, j=(i+1)%m;
    const acc=Math.min(ACC_CAP,PWR_A/Math.max(v[i],6))*BOT_ACC_K;
    const cap=Math.sqrt(v[i]*v[i]+2*acc*dsOf(i));
    if(v[j]>cap) v[j]=cap;
  }
  botProf=v; botProfLen=m;
  return v;
}
function botEnsure(b,i){
  if(b.grp) return b.grp;
  const g=new THREE.Group();
  const car=buildF1Car(b.col);
  g.add(car);
  b.wheels=car.userData.wheels||[];
  attachDrsGlow(g);                    // 🪽 เผื่อโมเดลถูกสลับเป็น GLB ทีหลัง (ติดกับกลุ่ม ไม่ใช่ตัวรถ)
  makeCar(b.col,m=>{                   // มี GLB ของผู้ใช้ = สลับให้เหมือนรถเพื่อน
    if(!g.children.length||!m||!glbSrc) return;
    g.remove(g.children[0]); g.add(m);
    b.wheels=m.userData.wheels||[];
  });
  const tag=makeTextSprite(b.name,'rgba(24,18,40,.85)','#ffffff','🤖');
  tag.scale.set(7,1.8,1); tag.position.y=3.0;
  g.add(tag);
  scene.add(g);
  b.grp=g;
  return g;
}
/* ระยะทาง s → index บนเส้น (บอทวิ่งไปข้างหน้าอย่างเดียว จึงเดินหน้าหาแบบวนได้เลย) */
function botIdxAt(s,i){
  const m=LINE.n;
  for(let k=0;k<=m;k++){
    const e=(i+1<m)?LINE.cum[i+1]:TOTAL;
    if(s>=LINE.cum[i]&&s<e) return i;
    i=(i+1)%m;
  }
  return i;
}
function botPlace(b){
  const m=LINE.n;
  b.i=botIdxAt(b.s,b.i);
  const i=b.i, j=(i+1)%m;
  const c0=LINE.cum[i], c1=(i+1<m)?LINE.cum[i+1]:TOTAL;
  const f=c1>c0?clamp((b.s-c0)/(c1-c0),0,1):0;
  b.x=lerp(LINE.x[i],LINE.x[j],f)+LINE.nx[i]*b.lane;
  b.z=lerp(LINE.z[i],LINE.z[j],f)+LINE.nz[i]*b.lane;
  const y0=Math.atan2(LINE.tx[i],LINE.tz[i]), y1=Math.atan2(LINE.tx[j],LINE.tz[j]);
  let dy=y1-y0;
  while(dy>Math.PI) dy-=Math.PI*2;
  while(dy<-Math.PI) dy+=Math.PI*2;
  b.yaw=y0+dy*f;
  const g=botEnsure(b);
  g.position.set(b.x,0,b.z);
  g.rotation.y=b.yaw;
  g.visible=true;
}
/* ระยะบนเส้นเทียบผู้เล่น (+ = บอทอยู่ข้างหน้าเรา · เลือกทางที่สั้นกว่าเสมอ กันสับสนตอนวนครบรอบ) */
function botRel(b){
  const d=((b.s-LINE.cum[myIdx])%TOTAL+TOTAL)%TOTAL;
  return d>TOTAL/2?d-TOTAL:d;
}
function botBanner(html){
  if(!banEl||performance.now()-botBanAt<1800) return;      // กันป้ายรัวตอนขับคู่กันเบียด ๆ
  if(banEl.classList.contains('show')) return;             // ป้ายครบรอบ/พิท สำคัญกว่า ไม่แย่งที่
  botBanAt=performance.now();
  banEl.innerHTML=html; banEl.classList.add('show');
  clearTimeout(banEl._botTm);
  banEl._botTm=setTimeout(()=>banEl.classList.remove('show'),1600);
}
function botReset(){
  if(!LINE) return;
  botProfileBuild();
  const s0=LINE.cum[myIdx];
  for(let i=0;i<BOT_N;i++){
    const b=bots[i]||(bots[i]={});
    b.name=BOT_NAMES[i]; b.col=BOT_COLORS[i]; b.k=BOT_SKILL[i];
    b.lane=BOT_LANE[i]*HALF_W;
    b.s=(s0+BOT_START_GAP*(BOT_N-i))%TOTAL;               // คันเร็วสุดอยู่หน้าสุด ผู้เล่นไล่จากคันช้าก่อน
    b.i=myIdx; b.v=0; b.wait0=BOT_REACT[i]; b.wait=b.wait0;
    b.wob=i*1.7; b.rel=undefined;
    botPlace(b);
  }
}
function botHide(){
  for(const b of bots) if(b.grp) b.grp.visible=false;
}
function botTick(dt){
  if(!LINE||!botProf) return;
  const locked=lightsLocked();
  for(const b of bots){
    if(!b.grp) botPlace(b);
    if(locked){ b.v=0; b.wait=b.wait0; continue; }         // 🚦 รอบ 902 — บอทก็ออกตัวไม่ได้จนไฟดับ
    if(b.wait>0){ b.wait-=dt; continue; }                  // เวลาปฏิกิริยาของบอทคันนั้น
    b.wob+=dt*0.55;
    const tgt=botProf[b.i]*b.k*(1+BOT_WOB*Math.sin(b.wob));
    if(b.v<tgt) b.v=Math.min(tgt,b.v+Math.min(ACC_CAP,PWR_A/Math.max(b.v,6))*BOT_ACC_K*dt);
    else        b.v=Math.max(tgt,b.v-BOT_BRAKE*dt);
    b.s=(b.s+b.v*dt)%TOTAL;
    botPlace(b);
    for(const w of b.wheels) w.rotation.x+=b.v*dt/0.46;
    /* แซงกันหรือยัง — เทียบระยะบนเส้น (ทั้งคู่ต้องอยู่ใกล้กันจริง ไม่ใช่ห่างกันครึ่งสนาม) */
    const rel=botRel(b);
    if(b.rel!==undefined&&Math.abs(rel)<BOT_PASS_R&&Math.abs(b.rel)<BOT_PASS_R&&lapStartAt){
      if(b.rel>0&&rel<=0) botBanner('<span style="color:#7dffb0">🏎️ แซง '+b.name+' ได้แล้ว!</span>');
      else if(b.rel<0&&rel>=0) botBanner('<span style="color:#ffd12e">😮 โดน '+b.name+' แซง — ตามไปเลย!</span>');
    }
    b.rel=rel;
  }
}

/* ============================================================
   🏁 ฟิสิกส์ + จับเวลา
   ============================================================ */
function physTick(dt){
  /* 🚦 รอบ 902: ก่อนไฟดับ คันเร่งไม่ทำงาน (เบรก/พวงมาลัยยังได้ — เร่งเครื่องรอได้ตามปกติ) */
  const thr=lightsLocked()?0:clamp(padThr+(kThr?1:0),0,1);
  const braking=padBr||kBack;
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
  pitLaneNow=(surf==='pit');                           // 🛞 รอบ 905 (surfAt คำนวณให้แล้ว ไม่ต้องหาซ้ำ)
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
  if(braking) aF-=(BRAKE_A+BRAKE_DF*spd*spd)*(0.8+0.2*tyre)   // 🛞 ยางโทรม = เบรกจับน้อยลงนิด
    *Math.sign(vF||1)*(surf==='track'?1:sc.grip*0.9);
  aF-=DRAG_K*(drsOn?DRS_DRAG_K:1)*spd*spd*Math.sign(vF||0);   // 🪽 DRS เปิด = แรงต้านลด
  aF-=(ROLL_A+sc.drag)*Math.sign(vF||0)*(Math.abs(vF)>0.5?1:Math.abs(vF)*2);
  vF+=aF*dt;
  if(braking&&Math.abs(vF)<0.6&&thr===0) vF=0;
  if(vF<-8) vF=-8;                                     // ถอยได้ช้าๆ พอ
  /* 🚧 รอบ 905: ลิมิตเตอร์เลนพิท 80 กม./ชม. (อัตโนมัติเหมือนของจริง — เด็กไม่ต้องกดเอง) */
  pitLimited=false;
  if(pitLaneNow&&vF>PIT_LIMIT){
    pitLimited=true;
    vF=Math.max(PIT_LIMIT,vF-Math.max(16,(vF-PIT_LIMIT)*7)*dt);
  }
  /* เลี้ยว: yaw rate จากมุมล้อ + จำกัดด้วยกริป (โมเมนตัม!) */
  const gripMax=Math.min(GRIP_CAP,(GRIP_BASE+GRIP_DF*spd*spd))*sc.grip*tyreGrip();   // 🛞 ยางสึก = กริปหด
  let yawRate=Math.abs(vF)>0.4?(vF*Math.tan(steer)/WB):0;
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
  spd=Math.hypot(vx,vz);
  /* วางรถ */
  carGrp.position.set(px,0,pz);
  carGrp.rotation.y=yaw;
  carGrp.rotation.z=lerp(carGrp.rotation.z,-steer*spd*0.012,clamp(dt*6,0,1));   // เอียงเข้าโค้งนิดๆ
  carGrp.rotation.x=lerp(carGrp.rotation.x,surf==='kerb'?(Math.random()-0.5)*0.03:0,0.4);
  /* ล้อหมุน+เลี้ยว */
  const roll=spd*dt/0.46;
  for(const w of wheels) w.rotation.x+=roll;
  for(const w of steerParts) w.rotation.y=steer*2.4;
  /* ไฟท้ายกะพริบตอนเก็บพลัง (เหมือน ERS) */
  if(carGrp.userData.tail) carGrp.userData.tail.material.color.setHex(
    (braking||thr<0.1)&&spd>10?((performance.now()/90|0)%2?0xff2020:0x550000):0x550000);
  /* ควันดริฟต์/ทราย */
  if((slide>0.35&&spd>14)||surf==='sand'&&spd>6) puffSmoke(surf==='sand');
  Snd.tick(spd,thr,slide>0.4&&spd>12,dt,drsOn);   // 🪽 รอบ 908 — ส่งสถานะปีกไปเปลี่ยนเนื้อเสียงลม
  /* 🛞 รอบ 905: ยางสึก + ลูปพิท */
  tyreWear(dt,surf);
  pitTick(dt);
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
  const out=rows.filter(r=>r.uid!==me);
  let my=rows.find(r=>r.uid===me)||null;
  if(state.f1Best&&(!my||state.f1Best<my.sec)){
    my={uid:me, name:(typeof onlineDisplayName==='function'?onlineDisplayName():'')||(state.student&&state.student.name)||'หนู',
        g:(state.student&&state.student.grade)||'', sec:state.f1Best, ts:0};
  }
  if(my){ my.me=true; out.push(my); }
  return out.sort((a,b)=>a.sec-b.sec);
}
function frFetch(){
  if(__frCache) return Promise.resolve(__frCache);
  if(__frPend) return __frPend;
  const fin=rows=>{ __frCache=rows; __frPend=null; return rows; };
  if(typeof Online==='undefined'||!Online.ready||!Online.db) return Promise.resolve(fin(frMerge([])));
  const p=Online.db.ref('f1Rank').orderByChild('sec').limitToFirst(FR_READ).get().then(s=>{
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
   🛞🔧 รอบ 905: ยางสึก + พิทสต็อปเปลี่ยนยาง
   ─────────────────────────────────────────────
   · ยางสึกจาก "การไถล" เป็นหลัก (สไลด์แรง+เร็ว = สึกไว) + สึกช้า ๆ ตามระยะทาง
     + สึกเพิ่มบน kerb/ทราย · กริปลดตามยางที่เหลือ → ท้ายสตินต์รถลื่นขึ้นชัดเจน
   · เลนพิท (F1_MAP.pit) กลายเป็น "ผิวที่ 5" — เดิมเลนพิทอยู่นอกแทร็กจึงถูกนับเป็น runoff
     (ลื่น+หน่วง ขับไม่ได้จริง) ตอนนี้กริปเต็ม แต่มีลิมิตเตอร์ 80 กม./ชม. เหมือนของจริง
   · จอดนิ่งในช่องพิท 3 วิ = ยางใหม่เต็ม (มีเสียงปืนลมขันน็อต + ป้ายเปลี่ยนสี)
   · รอบที่แวะเลนพิท = ไม่นับสถิติ Best Lap (กติกาจริง) แต่ยังได้เหรียญครบรอบตามปกติ
   ============================================================ */
/* ---- เส้นกึ่งกลางเลนพิท: resample ทุก SAMPLE_M เมตร ---- */
function buildPitLine(){
  PITL=null; pitBox=null;
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
  /* ช่องจอด: กึ่งกลางเลนพิท เยื้องไป "ฝั่งตรงข้ามแทร็ก" (ฝั่งโรงรถ) */
  const bi=Math.max(2,Math.min(m-3,Math.round(m*PIT_BOX_AT)));
  const ti=nearIdx(PITL.x[bi],PITL.z[bi]);
  let ax=PITL.x[bi]-LINE.x[ti], az=PITL.z[bi]-LINE.z[ti];
  const aL=Math.hypot(ax,az)||1e-6; ax/=aL; az/=aL;
  const side=(ax*PITL.nx[bi]+az*PITL.nz[bi])>=0?1:-1;   // ด้านไหนของเลนพิทคือฝั่งไกลแทร็ก
  pitBox={i:bi, side,
    x:PITL.x[bi]+PITL.nx[bi]*2.0*side, z:PITL.z[bi]+PITL.nz[bi]*2.0*side,
    yaw:Math.atan2(PITL.tx[bi],PITL.tz[bi])};
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
/* อยู่ในเลนพิทไหม (ใช้ทั้ง surfAt และ pitTick — เลนพิทชนะเฉพาะตอนไม่ได้อยู่บนแทร็กจริง) */
function inPitLane(x,z,lat){
  if(!PITL) return false;
  if(Math.abs(lat)<=HALF_W) return false;              // อยู่บนแทร็ก = ไม่ใช่เลนพิท (ปลายเลนซ้อนกัน)
  const pa=pitAt(x,z);
  return !!(pa&&Math.abs(pa.lat)<=PIT_HALF_W);
}
/* ---- ป้าย/พื้นช่องจอด (เรียกจาก buildTrackScene) ---- */
function pitBoxTex(){
  return texFromCanvas((g,w,h)=>{
    /* แถบเตือนเฉียงรอบขอบ */
    g.save(); g.beginPath(); g.rect(0,0,w,h); g.clip();
    for(let i=-h;i<w;i+=26){
      g.fillStyle=(((i+h)/26|0)%2)?'#ffd12e':'#171a1f';
      g.beginPath(); g.moveTo(i,0); g.lineTo(i+13,0); g.lineTo(i+13+h,h); g.lineTo(i+h,h); g.fill();
    }
    g.restore();
    /* พื้นในกรอบ */
    g.fillStyle='#2a2e34'; g.fillRect(16,16,w-32,h-32);
    g.strokeStyle='#ffffff'; g.lineWidth=5; g.strokeRect(16,16,w-32,h-32);
    /* กากบาทจุดจอด + ข้อความ */
    g.strokeStyle='rgba(255,255,255,.6)'; g.lineWidth=4;
    g.beginPath(); g.moveTo(w/2,h*0.36); g.lineTo(w/2,h*0.64);
    g.moveTo(w*0.37,h/2); g.lineTo(w*0.63,h/2); g.stroke();
    g.textAlign='center';
    g.fillStyle='#ffd12e'; g.font='bold 52px Kanit,sans-serif';
    g.fillText('PIT',w/2,h*0.27);
    g.fillStyle='#cfe0ff'; g.font='bold 26px Kanit,sans-serif';
    g.fillText('จอดนิ่ง 3 วิ = ยางใหม่',w/2,h*0.87);
  },256,256,1,1);
}
function buildPitBox(){
  if(!pitBox) return;
  /* พื้นช่องจอด */
  pitBoxMesh=new THREE.Mesh(new THREE.PlaneGeometry(6.6,9.6),
    new THREE.MeshBasicMaterial({map:pitBoxTex(),transparent:true}));
  pitBoxMesh.rotation.x=-Math.PI/2;
  pitBoxMesh.rotation.z=-pitBox.yaw;
  pitBoxMesh.position.set(pitBox.x,0.035,pitBox.z);
  scene.add(pitBoxMesh);
  /* เสาป้ายข้างช่อง (lollipop) — จานเปลี่ยนสีตามสถานะ */
  const grp=new THREE.Group();
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,3.4,6),
    new THREE.MeshLambertMaterial({color:0xdedede}));
  pole.position.y=1.7; grp.add(pole);
  pitSign=new THREE.Mesh(new THREE.CircleGeometry(0.95,20),
    new THREE.MeshBasicMaterial({color:0x2ecc55,side:THREE.DoubleSide}));
  pitSign.position.y=3.5; grp.add(pitSign);
  const lab=makeTextSprite('🛞 PIT','#ffffff','rgba(10,16,30,.85)');
  lab.scale.set(6,2.2,1); lab.position.y=5.3; grp.add(lab);
  pitGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:TexLib.glow,transparent:true,
    color:0x2ecc55,opacity:0.5,depthWrite:false,blending:THREE.AdditiveBlending}));
  pitGlow.scale.set(7,4.2,1); pitGlow.position.y=3.5; grp.add(pitGlow);
  const s=pitBox.side;
  grp.position.set(pitBox.x+PITL.nx[pitBox.i]*3.6*s, 0, pitBox.z+PITL.nz[pitBox.i]*3.6*s);
  scene.add(grp);
}
function setPitSign(hex){
  if(pitSign) pitSign.material.color.setHex(hex);
  if(pitGlow) pitGlow.material.color.setHex(hex);
}
/* ---- ยางสึก ---- */
function tyreWear(dt,surf){
  const fast=clamp(spd/38,0,1.35);
  let w=TYRE_W_ROLL*spd*dt;                            // ตามระยะทาง
  w+=TYRE_W_SLIDE*slide*fast*dt;                       // ไถล = ตัวการหลัก
  if(surf==='kerb') w+=TYRE_W_KERB*fast*dt;
  else if(surf==='sand') w+=TYRE_W_SAND*fast*dt;
  else if(surf==='runoff') w+=TYRE_W_SAND*0.5*fast*dt;
  if(w>0) tyre=clamp(tyre-w,0,1);
}
function tyreGrip(){ return TYRE_GRIP_MIN+(1-TYRE_GRIP_MIN)*tyre; }
/* ---- ลูปพิท (เรียกท้าย physTick) ---- */
function pitTick(dt){
  const was=inPit;
  inPit=pitLaneNow;
  if(inPit&&!was) lapPitted=true;                      // แตะเลนพิท = รอบนี้ไม่นับสถิติ
  let d=1e9;
  if(pitBox) d=Math.hypot(px-pitBox.x,pz-pitBox.z);
  const inBox=inPit&&d<PIT_BOX_R;
  const cooling=performance.now()-pitDoneAt<1500;
  if(inBox&&!cooling&&spd<PIT_STOP_V&&tyre<0.999){
    if(pitT===0) pitWrenchAt=-1;
    pitT+=dt;
    if(pitT-pitWrenchAt>0.62){ pitWrenchAt=pitT; Snd.wrench(0.42); }   // ปืนลมรัวเป็นช่วง
    setPitSign(0xff3b30);
    if(pitT>=PIT_STOP_S){
      tyre=1; pitT=0; pitStops++; pitDoneAt=performance.now();
      Snd.tyreDone();
      banEl.innerHTML='🛞 <b>ยางใหม่! กริปเต็ม 100%</b>'
        +'<br><span class="m-coin">พิทสต็อปที่ '+pitStops+' — ออกได้เลย!</span>';
      banEl.classList.add('show');
      setTimeout(()=>banEl.classList.remove('show'),1900);
      setPitSign(0x2ecc55);
    }
  }else{
    pitT=0;
    /* เหลือง = "จอดตรงนี้แล้วเปลี่ยนยางได้" เท่านั้น · ยางเต็ม/เพิ่งเปลี่ยนเสร็จ = เขียว */
    setPitSign((inBox&&tyre<0.999&&!cooling)?0xffd12e:0x2ecc55);
  }
  /* คิด cooling ใหม่ตรงนี้ — เปลี่ยนยางเสร็จในเฟรมนี้ก็ต้องขึ้น "ออกได้เลย" ทันที ไม่แวบข้อความผิด */
  pitHud(d,inBox,performance.now()-pitDoneAt<1500);
}
function pitHud(d,inBox,cooling){
  if(!pitEl) return;
  let html='';
  if(pitT>0){
    const left=Math.max(0,PIT_STOP_S-pitT);
    const pc=Math.round(clamp(pitT/PIT_STOP_S,0,1)*100);
    html='<div class="pit-hd">🔧 กำลังเปลี่ยนยาง… '+left.toFixed(1)+' วิ</div>'
      +'<div class="pit-bar"><i style="width:'+pc+'%"></i></div>';
  }else if(inBox){
    html='<div class="pit-hd">'+(cooling?'🛞 ยางใหม่แล้ว — ออกได้เลย!'
      :(tyre>0.999?'🛞 ยางยังใหม่อยู่ ไม่ต้องเปลี่ยน':'🅿️ จอดให้นิ่งในช่อง แล้วรอ 3 วิ'))+'</div>';
  }else if(inPit){
    html='<div class="pit-hd">🚧 เลนพิท · จำกัด 80 กม./ชม.</div>'
      +'<div class="pit-sub">ช่องเปลี่ยนยางอีก '+Math.round(d)+' ม.</div>';
  }else if(tyre<TYRE_WARN){
    html='<div class="pit-hd warn">⚠️ ยางใกล้หมดสภาพ — แวะพิทเปลี่ยนยาง</div>';
  }
  if(html!==pitEl.innerHTML) pitEl.innerHTML=html;
  pitEl.classList.toggle('on',!!html);
}
/* ---- เกจยางบน HUD ---- */
function tyreHud(){
  if(!tyreBarEl) return;
  const pc=Math.round(tyre*100);
  const col=tyre>0.55?'#2ecc55':(tyre>TYRE_WARN?'#ffd12e':'#ff3b30');
  tyreBarEl.style.width=pc+'%';
  tyreBarEl.style.background=col;
  tyrePcEl.textContent=pc+'%';
  tyrePcEl.style.color=col;
  tyreEl.classList.toggle('low',tyre<0.15);
}
function tyreReset(){
  tyre=1; pitT=0; pitStops=0; pitDoneAt=0; inPit=false; pitLaneNow=false;
  pitLimited=false; lapPitted=false; pitWrenchAt=-1;
  setPitSign(0x2ecc55);
  if(pitEl){ pitEl.innerHTML=''; pitEl.classList.remove('on'); }
  tyreHud();
}

/* ============================================================
   🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
   ============================================================ */
function trackPointAhead(minM,maxM){
  const ahead=minM+Math.random()*(maxM-minM);
  const i=(myIdx+Math.round(ahead/SAMPLE_M))%LINE.n;
  const lat=(Math.random()*2-1)*(HALF_W-2.2);
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
  word.en.split('').forEach((ch,i)=>{
    for(let c=0;c<LETTER_COPIES;c++){
      const p=trackPointAhead(150+i*60+c*40,900+i*120);
      const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
      spr.scale.set(5,5,1); spr.position.set(p.x,2.6,p.z);
      scene.add(spr);
      letters.push({ch,idx:i,spr});
    }
  });
}
function renderWordHud(){
  if(!word) return;
  wordEl.innerHTML='<span>'+word.en.split('').map((ch,i)=>
    `<span class="f-chip${word.got.includes(i)?' got':''}">${ch}</span>`).join('')+'</span>'
    +`<span class="f-th">${escapeHTML(word.th)}</span>`;
}
function collectTick(){
  if(!word) return;
  const hit=new Set();
  for(const l of letters)
    if(!hit.has(l.idx)&&Math.hypot(l.spr.position.x-px,l.spr.position.z-pz)<COLLECT_R) hit.add(l.idx);
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
  word=null;
  setTimeout(()=>{ if(running) pickWord(); },1400);
}
function relocTick(){
  /* ตัวอักษรหลุดหลังไกล → ย้ายมาข้างหน้า */
  for(const l of letters){
    const i=nearIdx(l.spr.position.x,l.spr.position.z,myIdx);
    const back=((LINE.cum[myIdx]-LINE.cum[i])%TOTAL+TOTAL)%TOTAL;
    if(back>60&&back<TOTAL-1100){
      const p=trackPointAhead(180,900);
      l.spr.position.set(p.x,2.6,p.z);
    }
  }
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
  p.grp.add(buildF1Car(col));
  attachDrsGlow(p.grp);   // 🪽 รอบ 907 — ติดกับกลุ่มรถเพื่อน (ไม่ใช่ตัวโมเดลที่อาจถูกสลับเป็น GLB ทีหลัง)
  makeCar(col,g=>{
    if(!p.grp||p.grp.children.length===0) return;
    if(g&&g.userData&&g.userData.wheels&&glbSrc){
      p.grp.remove(p.grp.children[0]); p.grp.add(g);
    }
  });
  const pg=(typeof gradeOf==='function')?gradeOf(uid,p.g):'';
  const nm=makeTextSprite(p.n,'rgba(16,26,44,.85)','#ffffff','🏎️',pg);
  nm.scale.set(8,2,1); nm.position.y=3.1;
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
function applyCamMode(){
  const fp=camMode==='cockpit';
  wrapEl.classList.toggle('fp',fp);
  if(camBtnEl) camBtnEl.textContent=fp?'📷 มุมรถ':'🪖 มุมคนขับ';
  if(carGrp) carGrp.visible=!fp;
  camInit=false;
}
function camTick(dt){
  if(camMode==='cockpit'){
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
    camera.position.set(px+fx*FP_FWD+ox,FP_EYE+oy,pz+fz*FP_FWD+oz);
    camera.lookAt(px+fx*(FP_FWD+FP_LOOK)+ox,FP_EYE-FP_DROP+oy,pz+fz*(FP_FWD+FP_LOOK)+oz);
    const fov=FP_FOV+clamp(spd/92,0,1)*12;
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
  const g=spd<0.6?'N':gearOf(spd);
  gearEl.textContent=g;
  /* 🚧 รอบ 905: ลิมิตเตอร์ทำงาน = เลขความเร็วเป็นสีเหลือง (บอกว่าไม่ใช่รถเสีย) */
  speedEl.style.color=pitLimited?'#ffd12e':'#fff';
  drsHud();
  tyreHud();
}
let mapAt=0, relocAt=0;
function frame(dt,now){
  lightsTick(dt);          // 🚦 รอบ 902 — ต้องมาก่อน physTick (ล็อกคันเร่งจนไฟดับ)
  botTick(dt);             // 🤖 รอบ 909 — ต้องมาก่อน physTick ด้วย (DRS ในนั้นวัดระยะรถบอตคันหน้า)
  physTick(dt);
  ghostTick(dt);           // 👻 รอบ 902
  collectTick();
  peerTick(dt);
  smokeTick(dt);
  camTick(dt);
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
}

/* ============================================================
   🚪 เข้า/ออกโลก
   ============================================================ */
function start(){
  if(!built) build();
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
  kL=kR=kThr=kBack=false;
  myIdx=gi; surfNow='track';
  drsOn=false; drsInZone=false; drsGap=0; drsFlapK=0; drsBrake=false;                // 🪽 รอบ 904
  if(drsEl){ drsEl.className=''; drsEl.innerHTML=''; }
  lapStartAt=0; lapNow=0; lapBest=0; lapCount=0; cpFlags=[false,false,false]; lastProg=0;
  camInit=false; camYaw=yaw;
  camMode='cockpit'; applyCamMode();   // 🪖 รอบ 901 — เข้าสนามเริ่มที่มุมคนขับเสมอ (ภาพหลัก)
  tyreReset();              // 🛞 รอบ 905 — ยางใหม่ทุกครั้งที่เข้าสนาม
  resetLights();            // 🚦 รอบ 902 — ตั้งลำดับไฟใหม่ทุกครั้งที่เข้าสนาม
  ghostLoad(); ghostReset(); ghostHide();
  botReset();               // 🤖 รอบ 909 — ตั้งรถบอต 4 คันบนกริดข้างหน้าเราใหม่ทุกครั้ง
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
    else if(k==='escape') exitBox.classList.add('on');
  };
  keyupFn=e=>{
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kL=false;
    else if(k==='d'||k==='arrowright') kR=false;
    else if(k==='w'||k==='arrowup'||k===' ') kThr=false;
    else if(k==='s'||k==='arrowdown') kBack=false;
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
  letters.forEach(l=>scene.remove(l.spr)); letters=[]; word=null;
  smokes.forEach(s=>scene.remove(s.m)); smokes=[];
  ghostHide(); botHide(); paintLights(0);   // 🤖 รอบ 909 — เก็บรถบอตออกจากจอตอนออกจากสนาม
  if(lightsEl) lightsEl.classList.remove('on');
  if(renderer) renderer.setSize(2,2,false);
  wrapEl.classList.remove('on');
  exitBox.classList.remove('on');
  if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
  saveState();
  if(typeof renderDashboard==='function') renderDashboard();
  if(sessionWords>0||sessionCoins>0)
    toast(`🏎️ กลับจากสนามซาเคียร์ — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
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
    get word(){return word}, get letters(){return letters},
    give(){ letters.slice().forEach(l=>{ word.got.push(l.idx); scene.remove(l.spr); }); letters=[]; completeWord(); },
    surfAt, nearIdx, trackPointAhead, pickWord, collectTick, physTick,
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
    /* 🤖 รอบ 909 — รถบอต */
    get bots(){return bots.map((b,i)=>({i,name:b.name,k:b.k,lane:b.lane,s:b.s,v:b.v,idx:b.i,
      wait:b.wait,rel:b.rel,x:b.x,z:b.z,yaw:b.yaw,vis:!!(b.grp&&b.grp.visible)}))},
    get botProf(){return botProf?{n:botProf.length,min:Math.min.apply(null,botProf),
      max:Math.max.apply(null,botProf),at:i=>botProf[((i%botProf.length)+botProf.length)%botProf.length]}:null},
    setBot(i,v){ const b=bots[i]; if(!b) return null;
      if('s'in v){ b.s=((v.s%TOTAL)+TOTAL)%TOTAL; b.i=0; }
      if('v'in v) b.v=v.v;
      if('wait'in v) b.wait=v.wait;
      if('rel'in v) b.rel=v.rel;
      botPlace(b); return b; },
    botReset, botTick, botHide, botRel, botProfileBuild,
    /* 🛞🔧 รอบ 905 */
    get tyre(){return {k:tyre,grip:tyreGrip(),
      hud:tyreEl?{w:tyreBarEl.style.width,col:tyreBarEl.style.background,txt:tyrePcEl.textContent,
        low:tyreEl.classList.contains('low')}:null}},
    setTyre(v){ tyre=clamp(v,0,1); tyreHud(); },
    get pit(){return {inPit,limited:pitLimited,t:pitT,stops:pitStops,lapPitted,
      box:pitBox?{x:pitBox.x,z:pitBox.z,i:pitBox.i,side:pitBox.side}:null,
      d:pitBox?Math.hypot(px-pitBox.x,pz-pitBox.z):null,
      sign:pitSign?pitSign.material.color.getHex():null,
      line:PITL?{n:PITL.n,len:PITL.len}:null,
      hud:pitEl?{on:pitEl.classList.contains('on'),txt:pitEl.textContent}:null}},
    pitAt, inPitLane, tyreWear, tyreGrip, pitTick, tyreReset,
    get peers(){return peers},
    fakePeer(uid,x,z,extra){ onPeer(uid,Object.assign({n:'เทส '+uid,x,z,yaw:0},extra||{})); return peers[uid]; },
    netJoin, netLeave, renderBoard, sendChat,
    get room(){return room},
    get scene(){return scene}, get camera(){return camera}, get car(){return carGrp}, get renderer(){return renderer},
    snd:Snd, gearOf,
    step(dt,n){ for(let i=0;i<(n||1);i++) frame(dt||1/60,performance.now()); },
    exitWorld, fit,
  }
};
})();
