/* 🏍️ moto3d.js — โลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293)
   ขับมอเตอร์ไซค์ third-person บนถนนจริงรอบโรงเรียนบ้านโพธิ์สวัสดิ์ รัศมี 30 กม. (js/data/moto_phosawat.js · OSM)
   เล่นบน "เครื่องเกมพกพา" เต็มจอ — จอเกมอยู่ตรงกลางเครื่อง · สไลเดอร์ส้มซ้าย=เลี้ยว · ปุ่มฟ้าขวา=เร่ง · ปุ่มแดงบน=ปิดเครื่อง
   เก็บตัวอักษรบนถนนประกอบคำศัพท์ คำละ 🪙45 · โหลดขี้เกียจผ่าน enterMoto3D (ui.js) — ไม่แตะ adventure3d.js */
(function(){
'use strict';
const REWARD=45, DONE_KEY='motoDone';
const ACCEL=13, DECEL=5.5, VMAX=55.6, VMAX_OFF=6.5, WHEEL_R=0.34;   // รอบ 312: VMAX 32→55.6 (=200 กม./ชม.) + ACCEL 10→13 ให้ไต่ถึงได้
const DASH_LEN=4, DASH_GAP=5, DASH_W=0.28;  // 🛣️ รอบ 312: เส้นประกลางถนน — ยาวขีด/ช่องว่าง/ครึ่งกว้าง (m)
const DOG_HIT_COIN=500, DOG_SPD=11, DOG_GAP_MS=9000;   // 🐕 รอบ 312: ชนหมาปรับ 500 · ความเร็ววิ่ง · เว้นระยะ spawn
/* 🕳️⛰️ รอบ 315: หลุม/เนิน + เหิน + สปริง */
const FEAT_SP=16, FEAT_FILL=0.10, FEAT_CELL=18;        // รอบ 316: โอกาสวาง 0.9→0.10 = หลุม/เนิน ~10% ของเส้นทาง (ผู้ใช้ขอ)
const DECAL_N=48, DECAL_R=110;                         // 🖼️ รอบ 316: ภาพหลุม/เนินแปะถนน — จำนวน pool / รัศมีรอบผู้เล่น
const GRAV=22, IMPACT_MIN=3.5, LAUNCH_SPD=5, LAUNCH_VMAX=9;   // โน้มถ่วง · ลงแรงพอมีเสียง · เร็วพอเหิน · เพดานความเร็วเหิน (กันพุ่งสูงเกิน)
const SUSP_K=55, SUSP_D=9, SUSP_KICK=0.22;             // สปริงโช้ก: อ่อนลง+เตะแรงขึ้น = ยวบเห็นชัด
const ROAD_WIDE=3.6;                       // ตัวคูณความกว้างถนน (รอบ 301: ×2 จาก 1.8 — ผู้ใช้ขอกว้างขึ้นอีก 2 เท่า)
const EDGE_M=0.55;                         // ระยะกันชนจากขอบถนน (m) — ชนขอบแล้วดันกลับ ขับออกนอกถนนไม่ได้
const ROAD_TEX_S=16, GRASS_TEX_S=10;       // รอบ 302: ขนาดโลก (m) ต่อ 1 รอบลายภาพถนน/หญ้า (UV พิกัดโลก — รอยต่อทางแยกเนียน)
const POST_N=400, POST_SP=42, POST_R=380;  // รอบ 303: หลักเขตทาง — จำนวน pool · ระยะห่างต่อหลัก (m) · รัศมีวางรอบผู้เล่น (m)
const LEAN_MAX=0.52;                       // มุมเอียงตัวรถสูงสุด (rad) ตอนเลี้ยวเต็มคัน
const COLLECT_R=3.6;                       // รอบ 314: ระยะชนเก็บตัวอักษร (2.8→3.6 · ตัวอยู่เลนซ้าย+ใหญ่ขึ้น ขับในเลนซ้ายเก็บได้พอดี)
const SPAWN_MIN=110, SPAWN_MAX=430, RELOC_D=800;   // ระยะวางตัวอักษรจากรถ + ไกลเกินย้ายใหม่
const BUCKET=250;                          // ตารางแฮชถนน (เมตร/ช่อง)
const TILE_COLORS=['#ff8a65','#4fc3f7','#aed581','#ffd54f','#ba68c8','#f06292','#4dd0e1','#ff8a80'];
/* 🪙 รอบ 317: เหรียญบนถนน + โบนัสตัวอักษร (ผู้ใช้: เก็บตัวอักษรให้เหรียญด้วย + เหรียญบนถนนน้อยไป) */
const LETTER_COIN=1;                                   // เก็บตัวอักษร 1 ตัว = แถม 🪙1 ทันที (นอกเหนือจาก REWARD ตอนครบคำ)
/* 🪙 รอบ 319 (ผู้ใช้สั่ง): เลิกโปรยเหรียญสุ่มทั้งแผนที่ → เหรียญผูกกับตัวอักษรโดยตรง
   เหรียญทอง 🪙1 = "ด้านหลัง" ตัวอักษรทุกตัว (ตัวละ 1 เหรียญเท่านั้น)
   เหรียญพิเศษ (◆5 / 💎20) = "ด้านหน้า" ตัวอักษรตัวสุดท้ายที่เหลือของแต่ละคำ */
const COIN_VAL=1, COIN_PICK_R=3.6;                     // มูลค่าเหรียญพื้นฐาน · ระยะชนเก็บ
const COIN_GAP=5.2;                                    // ระยะเยื้องจากตัวอักษร (m · มากกว่า COLLECT_R เพื่อไม่ให้เก็บพร้อมกัน)
/* 🪙 รอบ 340: เหรียญหมุนวิบวับ — บีบแกน x ตาม |cos| (สไปรต์หันหน้าเข้ากล้อง → เห็นเป็นหมุนจริง) */
const COIN_SPIN_SPD=0.0045, COIN_EDGE_MIN=0.11;        // ความเร็วหมุน (rad/ms) · ความบางสุดตอนหันข้าง
/* 💎 รอบ 318: เหรียญพิเศษตามสภาพเส้นทาง — ทางตรงทอง 🪙1 · ทางโค้งฟ้า 🪙5 · หลุม/เนินเพชร 🪙20 */
/* key = ชื่อไฟล์ภาพจริงใน img/coins/<key>.png (พื้นโปร่ง) — ไม่มีไฟล์ = ใช้ลายวาดจาก hi/mid/lo/mark */
const COIN_TIERS=[
  {val:1, size:2.3, y:1.5, mark:'★', name:'',            key:'coin_gold',    hi:'#fff7cc', mid:'#ffd23f', lo:'#e08c00', ring:'rgba(180,110,0,.55)', ink:'#b06e00'},
  {val:5, size:2.9, y:1.7, mark:'◆', name:'โค้งสวย!',    key:'coin_sapphire',hi:'#e6f9ff', mid:'#4fc3f7', lo:'#0277bd', ring:'rgba(2,90,150,.5)',   ink:'#01579b'},
  {val:20,size:3.6, y:2.0, mark:'💎',name:'เหรียญเพชร!', key:'coin_diamond', hi:'#fdeaff', mid:'#ce93d8', lo:'#7b1fa2', ring:'rgba(90,20,120,.5)',  ink:'#4a148c'},
  /* 🍀 รอบ 340: เหรียญมรกต — โผล่เฉพาะตอนเก็บครบคำแบบไม่ชนอะไรเลย (ไม่โดนหมา ไม่ตกหลุมแรงๆ) */
  {val:50,size:4.2, y:2.2, mark:'🍀',name:'เหรียญมรกต!', key:'coin_emerald', hi:'#e8fff2', mid:'#2ecc71', lo:'#0b6b3a', ring:'rgba(8,90,50,.5)',   ink:'#064e2e'},
];
const EMERALD_TIER=3;
const HARD_LAND=7.5;        // แรงกระแทกตอนลงพื้นที่ถือว่า "ชน" (เหินธรรมดาไม่นับ)
const COIN_CURVE_RAD=0.19;   // มุมหักขั้นต่ำที่ถือว่า "โค้งจริง" (rad ≈ 11° = p90 ของถนนทั้งแผนที่) — ใช้เลือกชนิดเหรียญพิเศษ
/* 🚗🧑‍🤝‍🧑 รอบ 317: รถยนต์มาร่วมแผนที่นี้ได้ + เห็นยานพาหนะเพื่อนตรงกับที่เขาขับจริง */
const NET_SEND_MS=180, SPAWN_GAP=9, SPAWN_FREE_R=5.5;  // ถี่ส่งตำแหน่ง · ระยะเว้นช่องเกิด · ถือว่าช่องนี้ "มีคนแล้ว"
const PEER_COLORS=[0xef5350,0x42a5f5,0x66bb6a,0xffca28,0xab47bc,0x26c6da,0xff7043,0x8d6e63];
/* 💬 รอบ 318: แชทลอยหัว — ข้อความสำเร็จรูป (เด็กแตะส่งได้เลย ไม่ต้องพิมพ์บนมือถือ ไม่ต้องกรองคำหยาบ) */
const CHAT_MS=5000;
const CHAT_PRESETS=['สวัสดี! 👋','ตามมาเลย!','เร็วมาก! 😲','รอด้วย~','เก่งจัง! 👍','สู้ๆ 💪','ไปทางนั้น! ➡️','555 😂'];

let built=false, running=false, rafId=0, lastT=0;
let renderer=null, scene=null, camera=null;
let wrapEl,screenEl,cvEl,knobEl,sliderEl,thrEl,wordEl,spdEl,gpsEl,gpsArr,gpsDist,coinsEl,banEl,miniCv,miniCtx,introEl,exitBox;
let segs=[], buckets=new Map();            // ถนน: เส้นย่อย + ตารางแฮช
let bikeEl=null;                           // 🏍️ ภาพมอไซค์จริง (สไปรต์ DOM ล่างกึ่งกลางจอ — รอบ 294)
let shadowEl=null;                         // 🌑 เงาวงรีใต้ล้อ (รอบ 303)
let wheelEl=null, wheelOff=0;              // 🛞 เอฟเฟกต์ล้อหมุน (รอบ 304) — offset ลายวิ่งสะสมตาม spd
let speedFxEl=null;                        // 🌪️ เส้นสปีดขอบจอ (รอบ 305)
let throttleCharge=0;                      // 💡 รอบ 309: ระดับชาร์จไฟ LED เทอร์โบปุ่มเร่ง (กดค้างนาน→เต็ม)
let smokeAcc=0, smokeSide=1;               // 💨 ควันท่อ (รอบ 305) — ตัวจับจังหวะ spawn + สลับท่อซ้าย/ขวา
let postBody=null, postTop=null;           // 🚧 หลักเขตทางขาว-แดงริมถนน (รอบ 303 · instanced รีไซเคิลรอบผู้เล่น)
let dog=null, dogNextAt=0;                  // 🐕 รอบ 312: หมาวิ่งตัดถนน {grp,vx,vz,life}
let feats=[], featBuckets=new Map();        // 🕳️⛰️ รอบ 315: หลุม/เนิน {x,z,r,h} (h>0=เนิน h<0=หลุม) + แฮชค้นเร็ว
let decalPool=[], potTex=null, bumpTex=null, decalAt=0;   // 🖼️ รอบ 316: ภาพแปะถนน
let bikeY=0, bikeVY=0, airborne=false, prevFollowVY=0, suspY=0, suspV=0;   // ความสูงรถ/ความเร็วดิ่ง/สถานะเหิน/สปริงโช้ก
let yaw=0, spd=0, lean=0, px=0, pz=0;
let steer=0, thr=0, kThr=false, padThr=0;
let steerCtl=0, kL=false, kR=false;        // 🎛️ รอบ 297: เอียงแมนวล — ค่าคุมค้างตามที่ผู้เล่นตั้ง ไม่เด้งกลับเอง (คีย์ A/D = ค่อยๆ ปรับ)
let _sigCur='';                            // 🟠 รอบ 300: สถานะไฟเลี้ยวปัจจุบัน ('l'/'r'/'')
let camX=0,camY=0,camZ=0,camInit=false;
let word=null, chips=[], letters=[], relocAt=0;
let trees=null, treeTop=null, treePos=[], TREE_N=200;
let skyDome=null;                          // 🌤️ รอบ 302: โดมท้องฟ้าภาพจริง ตามผู้เล่น
let clouds=[], deco=false, decoAt=0;
let sessionCoins=0, sessionWords=0, texCache={};
let startX=0,startZ=0,startYaw=0;
let vehicle='moto';                        // 🚗 รอบ 317: 'moto' = มอเตอร์ไซค์ (ตั๋วมอไซค์) · 'car' = ผู้เล่นโลกขับรถมาร่วมแผนที่นี้
let selfCar=null;                          // โมเดลรถยนต์ของเราเอง (โหมด car — แทนสไปรต์มอไซค์)
let coins=[], coinTex=null, specialDone=false, cleanWord=true;   // 🍀 cleanWord = คำนี้ยังไม่ชนอะไรเลย (ชนหมา/ลงหลุมแรง = false)   // 🪙 เหรียญที่วางอยู่ตอนนี้ (ผูกกับตัวอักษร) + วางเหรียญพิเศษของคำนี้แล้วหรือยัง
let worldRef=null,myRef=null,peers={},lastNetSend=0,netOk=true,netAvOk=true,spawnFixAt=0;   // 🧑‍🤝‍🧑 เพื่อนในแผนที่เดียวกัน
let boardEl=null,boardSig='';              // 🏆 รอบ 318: กระดานคะแนนสด (วาดใหม่เมื่อข้อมูลเปลี่ยนจริงเท่านั้น)
let chatBtn=null,chatBarEl=null,selfMsgEl=null,myChat=null;   // 💬 รอบ 318: แชทลอยหัวข้อความสำเร็จรูป
let keydownFn=null,keyupFn=null,resizeFn=null;

/* ---------- 🔊 เสียงเครื่องยนต์จริง (รอบ 306 — ตัดจากเสียงอัดมอไซค์จริงของผู้ใช้ sound/MotorbikeSound.m4a)
   sound/moto/: eng_idle 5.6s ลูปเดินเบา (248.7s ในต้นฉบับ ช่วงนิ่งสุด) · eng_cruise 5.6s ลูปวิ่งไหล (129.2s)
   eng_accel 2.05s รอบกวาดขึ้น (รอบ 307: ย้าย 377.2s→93.65s · เดิม noise flatness 0.013 ผู้ใช้ได้ยิน → ใหม่ 0.0008 สะอาดเท่า idle) · eng_decel 3.5s รอบไหลลง (393.7s) — ทุกไฟล์กรอง 60Hz-7.5kHz ตัดลม/ซ่า
   ลูป bake crossfade 80ms วนไร้รอยต่อ · idle↔cruise crossfade ตาม spd · cruise เร่ง pitch ตามความเร็ว
   accel/decel เล่น one-shot ตอนบิด/ปล่อยคันเร่ง · เริ่มหลัง gesture ปุ่มเริ่ม (นโยบาย autoplay) ---------- */
const ENG_FILES={idle:'sound/moto/eng_idle.wav',cruise:'sound/moto/eng_cruise.wav',
                 accel:'sound/moto/eng_accel.wav?v=307',decel:'sound/moto/eng_decel.wav'};
const Eng={ctx:null,master:null,ready:false,bufs:{},iG:null,cG:null,cS:null,prevThr:false,
  start(){ if(this.ctx||!(window.AudioContext||window.webkitAudioContext)) return;
    try{
      const C=window.AudioContext||window.webkitAudioContext; this.ctx=new C();
      this.master=this.ctx.createGain(); this.master.gain.value=0; this.master.connect(this.ctx.destination);
      Promise.all(Object.entries(ENG_FILES).map(([n,u])=>
        fetch(u).then(r=>r.arrayBuffer()).then(b=>this.ctx.decodeAudioData(b)).then(bf=>{ this.bufs[n]=bf; })
      )).then(()=>{
        const mk=(n,g0)=>{ const s=this.ctx.createBufferSource(); s.buffer=this.bufs[n]; s.loop=true;
          const g=this.ctx.createGain(); g.gain.value=g0; s.connect(g); g.connect(this.master); s.start(); return {s,g}; };
        const i=mk('idle',.75), c=mk('cruise',0);
        this.iG=i.g; this.cG=c.g; this.cS=c.s; this.ready=true;
      }).catch(()=>{});
    }catch(e){ this.ctx=null; }
  },
  shot(n,v){ if(!this.bufs[n]) return;
    const s=this.ctx.createBufferSource(); s.buffer=this.bufs[n];
    const g=this.ctx.createGain(); g.gain.value=v; s.connect(g); g.connect(this.master); s.start(); },
  /* 🕳️ รอบ 315: เสียงรถกระแทกถนน (ตกหลุม/ลงจากเนิน) — thump เบสตก + เสียงกรวดสั้นๆ สังเคราะห์ */
  thud(v){ if(!this.ctx||!this.master) return;
    const c=this.ctx, t=c.currentTime;
    const o=c.createOscillator(), g=c.createGain();
    o.type='sine'; o.frequency.setValueAtTime(115,t); o.frequency.exponentialRampToValueAtTime(38,t+.16);
    g.gain.setValueAtTime(Math.min(.85,v),t); g.gain.exponentialRampToValueAtTime(.001,t+.24);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t+.26);
    const nb=c.createBuffer(1,(c.sampleRate*.1)|0,c.sampleRate), d=nb.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
    const ns=c.createBufferSource(); ns.buffer=nb;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=850; bp.Q.value=1.2;
    const ng=c.createGain(); ng.gain.value=Math.min(.5,v*.6);
    ns.connect(bp); bp.connect(ng); ng.connect(this.master); ns.start(t); },
  tick(){ if(!this.ctx) return;
    const on=(typeof state==='undefined'||state.sound!==false)&&running;
    const t=this.ctx.currentTime;
    this.master.gain.setTargetAtTime(on?.9:0,t,.1);
    if(!this.ready||!on) return;
    const mix=Math.min(1,spd/7);                                   // 0=เดินเบา → 1=วิ่ง
    this.iG.gain.setTargetAtTime((1-mix)*.75,t,.15);
    this.cG.gain.setTargetAtTime(mix*(.55+(thr?.35:0)),t,.15);
    this.cS.playbackRate.setTargetAtTime(.8+(spd/VMAX)*.55+(thr?.05:0),t,.12);
    const th=!!thr;
    if(th!==this.prevThr){
      this.prevThr=th;
      if(th) this.shot('accel',.85);
      else if(spd>8) this.shot('decel',.1);                        // รอบ 310: หรี่ .3→.1 (ผู้ใช้ขอเบาลงอีก) · ปล่อยตอนช้าไม่ต้องมีเสียงรอบไหลลง
    }
  },
  stop(){ if(this.master&&this.ctx) this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.05); }
};

/* ============================================================
   DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
   ============================================================ */
const CSS=`
#moto-wrap{position:fixed;inset:0;z-index:4000;display:none;background:#0c0e12;touch-action:none;
  user-select:none;-webkit-user-select:none;font-family:inherit;overflow:hidden}
#moto-wrap.on{display:block}
/* เครื่องเกมพกพา = ภาพจริงของผู้ใช้ (img/moterbike/console_crop.webp) ยืดเต็มจอ
   ตำแหน่งปุ่ม/จอ วัดจากพิกเซลภาพจริง (grid 10%): จอใน 25–69.6% x 18–71% · power กลาง 47% · knob ส้มซ้าย · บอลฟ้าขวา */
#moto-body{position:absolute;inset:0;background:url('img/moterbike/console_crop.webp?v=295') center/100% 100% no-repeat}
/* ⚠️ ?v=295 จำเป็น: sw.js เก็บรูปแบบ cache-first — เปลี่ยนเนื้อไฟล์ใน URL เดิม เครื่องผู้เล่นเก่าจะติดรูปเก่าตลอด
   แก้ไฟล์รูปนี้ครั้งหน้าต้องบัมพ์เลข ?v= ตามรอบเสมอ (ตำแหน่งปุ่ม CSS ผูกกับรูปเป๊ะ) */
#moto-power{position:absolute;left:45.5%;top:0.5%;width:8%;height:12.5%;border-radius:50%;
  border:none;cursor:pointer;background:transparent;color:#fff;
  display:flex;align-items:flex-end;justify-content:center}
#moto-power .m-hint{font-size:1.5vmin;font-weight:800;opacity:.5;margin-bottom:-2.2vmin;text-shadow:0 1px 2px #000}
#moto-power:active{background:rgba(255,255,255,.14)}
#moto-screen{position:absolute;left:25.2%;top:20%;width:46.4%;height:60.5%;
  background:#0e1118;border-radius:1.6vmin;overflow:hidden;
  box-shadow:inset 0 0 2vmin rgba(0,0,0,.85)}
#moto-cv{position:absolute;inset:0;width:100%;height:100%;display:block}
/* 🏍️ ภาพมอเตอร์ไซค์จริง (img/moterbike/bike.webp) — ล่างกึ่งกลางจอ เอียงเข้าโค้ง
   รอบ 300: ห่อใน wrapper เพื่อให้ไฟเลี้ยวกะพริบหมุนตามตัวรถ */
#moto-bikewrap{position:absolute;left:50%;bottom:-2%;height:56%;aspect-ratio:520/750;
  pointer-events:none;z-index:2;transform:translateX(-50%);transform-origin:50% 92%;
  filter:drop-shadow(0 1.2vmin 1vmin rgba(0,0,0,.55))}
/* 🌑 รอบ 303: เงามอไซค์ทอดบนถนน — วงรีจางใต้ล้อ อยู่นอก wrapper (เงาจริงไม่หมุนตามตัวรถ) */
#moto-shadow{position:absolute;left:50%;bottom:0.5%;width:30%;height:6%;z-index:1;pointer-events:none;
  background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,.4) 0%,rgba(0,0,0,.22) 45%,rgba(0,0,0,0) 72%);
  transform:translateX(-50%)}
#moto-bike{position:absolute;inset:0;width:100%;height:100%}
/* 🟠 ไฟเลี้ยวกะพริบ — จุดเรืองแสงซ้อนบนตำแหน่งไฟส้มในภาพ (วัดจากพิกเซล: y 63% · ซ้าย 36% ขวา 64%) */
.m-tl{position:absolute;width:13%;aspect-ratio:1;border-radius:50%;opacity:0;top:57.5%;
  background:radial-gradient(circle,#fff2b0 0%,#ffc23d 38%,rgba(255,150,30,0) 70%);
  box-shadow:0 0 1.8vmin .5vmin rgba(255,180,50,.9)}
.m-tl.l{left:29.5%} .m-tl.r{left:57.5%}
#moto-bikewrap.sig-l .m-tl.l{animation:mblink .7s steps(1,end) infinite}
#moto-bikewrap.sig-r .m-tl.r{animation:mblink .7s steps(1,end) infinite}
@keyframes mblink{0%{opacity:1}55%{opacity:0}100%{opacity:0}}
/* 🛞 รอบ 304: ล้อหมุน — แถบเบลอวิ่งลงบนหน้ายาง (พิกเซลจริง: x 37-63% y 73.5-84%) · เร็ว=ชัด จอด=หาย
   ทิศลง: มองจากท้ายรถตอนวิ่งไปหน้า ผิวยางฝั่งเรากวาดลงหาพื้น · offset+opacity อัปเดตใน frame ตาม spd */
.m-wheel{position:absolute;left:37%;top:73.5%;width:26%;height:10.5%;border-radius:50%;
  opacity:0;pointer-events:none;filter:blur(.6px);
  background:repeating-linear-gradient(180deg,
    rgba(205,210,220,.5) 0 3px, rgba(205,210,220,0) 3px 11px,
    rgba(110,116,128,.4) 11px 14px, rgba(110,116,128,0) 14px 22px)}
/* 💨 รอบ 305: ควันท่อไอเสีย — ก้อนควันจางพุ่งออกจากปลายท่อคู่ (พิกเซล: ซ้าย~20% ขวา~80% y~71%) ตอนบิดคันเร่ง */
.m-smoke{position:absolute;width:8%;aspect-ratio:1;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(205,208,214,.6) 0%,rgba(185,190,198,.35) 45%,rgba(185,190,198,0) 72%);
  transform:translate(-50%,-50%);animation:msmoke .8s ease-out forwards}
@keyframes msmoke{
  0%{transform:translate(-50%,-50%) scale(.5);opacity:.75}
  100%{transform:translate(calc(-50% + var(--dx,200%)),250%) scale(2.3);opacity:0}}
/* 🌪️ รอบ 305: เส้นสปีดขอบจอ >90 กม./ชม. — แถบเส้นวิ่งลงเร็ว 2 ฝั่ง จางเข้ากลางจอ (opacity คุมใน frame) */
#moto-speedfx{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s}
#moto-speedfx::before,#moto-speedfx::after{content:'';position:absolute;top:0;bottom:0;width:15%;
  background:repeating-linear-gradient(180deg,rgba(255,255,255,.28) 0 2px,rgba(255,255,255,0) 2px 9px,
    rgba(255,255,255,.16) 9px 10px,rgba(255,255,255,0) 10px 27px);
  animation:mspeed .14s linear infinite}
#moto-speedfx::before{left:0;-webkit-mask-image:linear-gradient(90deg,#000,transparent);mask-image:linear-gradient(90deg,#000,transparent)}
#moto-speedfx::after{right:0;-webkit-mask-image:linear-gradient(270deg,#000,transparent);mask-image:linear-gradient(270deg,#000,transparent)}
@keyframes mspeed{to{background-position:0 27px}}
#moto-slider{position:absolute;left:2.5%;top:45%;width:22%;height:24%;border-radius:999px;cursor:pointer;
  background:transparent}
#moto-slider .m-arr{display:none}
#moto-knob{position:absolute;left:50%;top:21%;height:56%;width:62%;transform:translate(-50%,0);border-radius:999px;
  background:linear-gradient(180deg,#ff7a45,#f04f16);pointer-events:none;
  box-shadow:0 3px 7px rgba(0,0,0,.5), inset 0 3px 5px rgba(255,200,160,.5);
  display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:2.1vmin;
  text-shadow:0 1px 2px rgba(120,40,0,.6);
  transition:box-shadow .14s ease,transform .14s cubic-bezier(.34,1.56,.64,1),filter .14s ease}
/* 🎛️ รอบ 309: จับลาก = knob ยกนูน (เงาลึก+สว่างขึ้น+เด้งขยายนิด) ให้ฟีลจับพวงมาลัยจริง */
#moto-knob.grab{transform:translate(-50%,-6%) scale(1.06);filter:brightness(1.12);
  box-shadow:0 .9vmin 1.8vmin rgba(0,0,0,.55), 0 0 1.4vmin rgba(255,140,60,.7), inset 0 3px 6px rgba(255,210,175,.7)}
#moto-knob span{opacity:.5}
#moto-throttle{position:absolute;left:74.5%;top:40%;width:19.5%;height:48%;border-radius:50%;border:none;cursor:pointer;
  background:transparent;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4vmin;
  transform-origin:50% 50%;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease}
/* 🔘 รอบ 308: ปุ่มเร่งยุบลงตอนกด (คลาส .pressing คุมจาก frame ตาม thr — ครอบทั้งแตะ+คีย์ W)
   กด = snap ยุบเร็ว (ease-out .08s) + เงา inset จมลง · ปล่อย = เด้งคลายตัวสปริง (bezier overshoot .2s) */
#moto-throttle.pressing{transform:scale(.84);transition:transform .08s ease-out,box-shadow .08s ease;
  background:radial-gradient(circle at 50% 44%,rgba(0,0,0,.32),rgba(0,0,0,0) 66%);
  box-shadow:inset 0 .6vmin 1.6vmin rgba(0,0,0,.45)}
#moto-throttle .m-ico{font-size:4.4vmin;opacity:.5;pointer-events:none;text-shadow:0 1px 3px rgba(0,60,70,.6);
  transition:transform .12s ease,opacity .12s ease}
#moto-throttle .m-lb{font-size:2.3vmin;font-weight:900;opacity:.5;pointer-events:none;text-shadow:0 1px 2px rgba(0,60,70,.6);
  transition:opacity .12s ease}
#moto-throttle.pressing .m-ico{opacity:.85;transform:translateY(.35vmin) scale(.94)}
#moto-throttle.pressing .m-lb{opacity:.85}
/* 💡 รอบ 309: ไฟ LED เทอร์โบ — วงแหวนเรืองรอบปุ่มเร่ง เข้มขึ้นตามเวลาที่กดค้าง (var --charge 0→1 คุมจาก frame)
   ชาร์จเต็ม (.charged) = เต้นเป็นจังหวะเหมือนเทอร์โบพร้อมพุ่ง */
#moto-throttle::after{content:'';position:absolute;inset:-7%;border-radius:50%;pointer-events:none;
  opacity:var(--charge,0);border:.45vmin solid rgba(150,235,255,.9);
  box-shadow:0 0 2.2vmin .5vmin rgba(80,210,255,.85), inset 0 0 1.4vmin rgba(130,235,255,.6);
  transition:opacity .1s linear}
#moto-throttle.charged::after{animation:mturbo .5s ease-in-out infinite}
@keyframes mturbo{0%,100%{box-shadow:0 0 2vmin .4vmin rgba(80,210,255,.75), inset 0 0 1.2vmin rgba(130,235,255,.5)}
  50%{box-shadow:0 0 3.4vmin .9vmin rgba(120,235,255,1), inset 0 0 1.8vmin rgba(160,245,255,.8)}}
/* ---------- HUD ในจอ ---------- */
/* 🔤 รอบ 309-311: คำศัพท์ป้ายบิลบอร์ดกลางบนแนวท้องฟ้า — ตัวอักษรแถวเดียวเสมอ (nowrap ไม่ตกบรรทัด)
   คำแปลไทยอยู่บรรทัดล่าง · fitWord() ย่ออัตโนมัติถ้าคำยาวเกินจอ (รองรับคำยาวในอนาคต ไม่ดันตัวตก) */
#moto-word{position:absolute;left:50%;top:8%;transform:translateX(-50%);transform-origin:top center;
  display:flex;flex-direction:column;align-items:center;gap:.35vmin;
  padding:.9vmin 1.6vmin;border-radius:1.8vmin;background:rgba(6,14,26,.32);backdrop-filter:blur(1px)}
#moto-word .m-chips{display:flex;gap:.7vmin;align-items:center;flex-wrap:nowrap}
#moto-word .m-th{color:#ffe9a8;font-size:3vmin;font-weight:800;white-space:nowrap;
  text-shadow:0 2px 5px #000,0 0 2vmin rgba(0,0,0,.6)}
.m-chip{width:5.2vmin;height:5.2vmin;flex:none;border-radius:1.2vmin;display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:3.3vmin;color:#fff;background:rgba(255,255,255,.2);border:.34vmin solid rgba(255,255,255,.7);
  text-shadow:0 1px 3px rgba(0,0,0,.7);box-shadow:0 2px 6px rgba(0,0,0,.3)}
.m-chip.got{background:#43d06c;border-color:#fff;box-shadow:0 0 1.6vmin rgba(90,255,140,.6)}
#moto-coins{position:absolute;right:2%;top:2.5%;color:#ffd54f;font-weight:900;font-size:2.3vmin;text-shadow:0 1px 3px #000;
  transform-origin:100% 50%}
/* 🪙 รอบ 317: ป้าย +เหรียญลอยขึ้นกลางจอทุกครั้งที่เก็บได้ (เห็นชัดว่าได้เงินจริง) + ตัวเลขมุมขวาเด้ง */
.m-cfx{position:absolute;bottom:24%;transform:translate(-50%,0);color:#ffd54f;font-weight:900;font-size:3.1vmin;
  white-space:nowrap;pointer-events:none;z-index:3;text-shadow:0 2px 6px #000,0 0 1.6vmin rgba(255,190,60,.8);
  animation:mcfx .9s ease-out forwards}
.m-cfx.big{font-size:4.2vmin;color:#8dffb0;text-shadow:0 2px 6px #000,0 0 2vmin rgba(90,255,150,.85)}
@keyframes mcfx{0%{opacity:0;transform:translate(-50%,12%) scale(.55)}
  22%{opacity:1;transform:translate(-50%,-8%) scale(1.18)}
  100%{opacity:0;transform:translate(-50%,-130%) scale(1)}}
#moto-coins.pop{animation:mcoinpop .42s ease-out}
@keyframes mcoinpop{0%{transform:scale(1)}38%{transform:scale(1.5);color:#fff5b0}100%{transform:scale(1)}}
/* ✨ ประกายวงกลมตรงกลางล่างจอ ตอนเก็บของได้ */
.m-cring{position:absolute;left:50%;bottom:18%;width:12vmin;height:12vmin;margin:0 0 -6vmin -6vmin;border-radius:50%;
  border:.5vmin solid rgba(255,220,120,.95);pointer-events:none;z-index:3;animation:mcring .5s ease-out forwards}
@keyframes mcring{0%{opacity:.9;transform:scale(.25)}100%{opacity:0;transform:scale(1.5)}}
#moto-speed{position:absolute;left:2%;bottom:3%;color:#bfeaff;font-weight:900;font-size:2.4vmin;text-shadow:0 1px 3px #000}
/* 🧭 รอบ 312: ป้าย GPS — บรรทัดบนบอกความหมาย + แถวล่างลูกศร(ชัด SVG)+ตัวเลข */
#moto-gps{position:absolute;left:1.6%;top:2.5%;display:flex;flex-direction:column;align-items:center;gap:.5vmin;
  background:rgba(10,20,35,.6);border-radius:1.4vmin;padding:.7vmin 1.2vmin;color:#fff;max-width:26%}
.m-gps-lb{font-size:1.5vmin;font-weight:700;line-height:1.25;text-align:center;color:#dbe8f5}
.m-gps-row{display:flex;align-items:center;gap:1.2vmin}
#moto-gps-arr{display:inline-block;width:4.4vmin;height:5.1vmin;transition:transform .12s linear;
  filter:drop-shadow(0 0 .7vmin rgba(90,255,140,.9))}
#moto-gps-arr svg{display:block;width:100%;height:100%}
#moto-gps-d{font-size:2.8vmin;font-weight:900;color:#eaffef;text-shadow:0 1px 3px #000}
/* 🏆 รอบ 318: กระดานคะแนนสด — ใครเก็บได้กี่คำในรอบนี้ (ขวาบน ใต้ตัวเลขเหรียญ) */
#moto-board{position:absolute;right:2%;top:10.5%;min-width:17vmin;max-width:30vmin;display:none;flex-direction:column;gap:.25vmin;
  background:rgba(10,20,35,.62);border-radius:1.2vmin;padding:.6vmin .9vmin;color:#fff;z-index:2}
#moto-board.on{display:flex}
.m-bd-h{font-size:1.35vmin;font-weight:800;letter-spacing:.04em;color:#cfe4ff;text-align:center;opacity:.9}
.m-bd-r{display:flex;align-items:center;gap:.6vmin;font-size:1.7vmin;font-weight:800;line-height:1.35}
.m-bd-r.me{color:#ffe082}
.m-bd-n{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.m-bd-w{font-variant-numeric:tabular-nums;color:#8dffb0}
/* 💬 รอบ 318: ปุ่มแชท + แถบข้อความสำเร็จรูป + ข้อความของเราเองมุมล่าง */
#moto-chat{position:absolute;left:2%;bottom:12%;z-index:4;border:none;cursor:pointer;border-radius:999px;
  width:6.4vmin;height:6.4vmin;font-size:3vmin;color:#fff;background:rgba(20,40,70,.72);
  box-shadow:0 2px 6px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center}
#moto-chat:active{transform:scale(.92)}
/* กว้างแบบ % ของ "จอเกม" (ไม่ใช่ vmin ของหน้าต่าง) — มินิแมพเป็น vmin จึงกินพื้นที่ต่างกันตามอัตราส่วนจอ
   วางกึ่งกลางกว้าง 50% (ขอบขวา 75% < มินิแมพซ้ายสุด 77%) = พ้นมินิแมพทุกอัตราส่วนที่ทดสอบ (1000×640 และ 812×375) */
#moto-chatbar{position:absolute;left:50%;transform:translateX(-50%);width:50%;bottom:22.5%;z-index:4;display:none;flex-wrap:wrap;gap:.7vmin;
  justify-content:center;background:rgba(8,16,28,.82);border-radius:1.4vmin;padding:.9vmin}
#moto-chatbar.on{display:flex}
#moto-chatbar button{border:none;cursor:pointer;border-radius:999px;padding:.7vmin 1.4vmin;font-size:1.9vmin;
  font-weight:800;color:#0e2136;background:linear-gradient(180deg,#e9f4ff,#bcd9f5)}
#moto-chatbar button:active{transform:scale(.95)}
#moto-selfmsg{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);z-index:3;opacity:0;
  background:rgba(255,255,255,.92);color:#123;border-radius:1.2vmin;padding:.5vmin 1.4vmin;font-size:2vmin;
  font-weight:800;white-space:nowrap;transition:opacity .2s;pointer-events:none}
#moto-selfmsg.on{opacity:1}
#moto-mini{position:absolute;right:2%;bottom:3%;width:15vmin;height:15vmin;max-width:130px;max-height:130px;
  border-radius:50%;background:rgba(8,16,28,.72);border:.35vmin solid rgba(255,255,255,.4)}
#moto-banner{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) scale(.6);opacity:0;text-align:center;
  background:linear-gradient(180deg,rgba(35,60,30,.92),rgba(20,40,18,.92));border:.4vmin solid #7bff9e;color:#fff;
  border-radius:2vmin;padding:1.6vmin 3vmin;font-size:2.6vmin;font-weight:900;pointer-events:none;transition:all .25s;white-space:nowrap}
#moto-banner.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
#moto-banner .m-coin{color:#ffd54f}
#moto-intro{position:absolute;inset:0;background:rgba(8,14,24,.86);display:flex;align-items:center;justify-content:center;z-index:5}
#moto-intro .m-card{background:linear-gradient(180deg,#fff,#eef4ff);border-radius:2.4vmin;padding:2.4vmin 3.4vmin;text-align:center;
  max-width:82%;max-height:92%;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.5)}
#moto-intro h3{margin:0 0 1vmin;font-size:3.2vmin;color:#0d47a1}
#moto-intro p{margin:0 0 1.6vmin;font-size:2.05vmin;line-height:1.55;color:#334}
#moto-go{border:none;border-radius:999px;padding:1.2vmin 4vmin;font-size:2.6vmin;font-weight:900;color:#fff;cursor:pointer;
  background:linear-gradient(180deg,#42d77d,#1fa855);box-shadow:0 4px 10px rgba(20,150,70,.45)}
#moto-exitbox{position:absolute;inset:0;background:rgba(10,15,25,.6);display:none;align-items:center;justify-content:center;z-index:6}
#moto-exitbox.on{display:flex}
#moto-exitbox .m-card{background:#fff;border-radius:2.4vmin;padding:2.6vmin 3.6vmin;text-align:center;max-width:70vmin}
#moto-exitbox h3{margin:0 0 1.2vmin;font-size:3vmin;color:#c62828}
#moto-exitbox .m-row{display:flex;gap:1.6vmin;justify-content:center}
#moto-exitbox button{border:none;border-radius:999px;padding:1.1vmin 3.6vmin;font-size:2.4vmin;font-weight:900;color:#fff;cursor:pointer}
#moto-exit-yes{background:linear-gradient(180deg,#ef5350,#d32f2f)}
#moto-exit-no{background:linear-gradient(180deg,#66bb6a,#2e7d32)}
@media (orientation:portrait){ #moto-wrap .m-deco{display:none} }
`;

function buildDom(){
  const st=document.createElement('style'); st.id='moto-style'; st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='moto-wrap';
  wrapEl.innerHTML=`
  <div id="moto-body">
    <button id="moto-power"><span class="m-hint">ออก</span></button>
    <div id="moto-screen">
      <canvas id="moto-cv"></canvas>
      <div id="moto-speedfx"></div>
      <div id="moto-shadow"></div>
      <div id="moto-bikewrap"><img id="moto-bike" src="img/moterbike/bike.webp?v=299" alt="">
        <span class="m-tl l"></span><span class="m-tl r"></span><span class="m-wheel"></span></div>
      <div id="moto-word"></div>
      <div id="moto-coins">🪙 +0</div>
      <div id="moto-gps">
        <div class="m-gps-lb">ตอนนี้คุณอยู่ห่างจากตัวอักษรที่จะต้องเก็บ เป็นระยะทาง</div>
        <div class="m-gps-row"><span id="moto-gps-arr"><svg viewBox="0 0 24 28"><path d="M12 1 L22 13 L15.5 13 L15.5 27 L8.5 27 L8.5 13 L2 13 Z" fill="#5ef08a" stroke="#083" stroke-width="1.3" stroke-linejoin="round"/></svg></span><span id="moto-gps-d">--</span></div>
      </div>
      <div id="moto-board"></div>
      <button id="moto-chat">💬</button>
      <div id="moto-chatbar"></div>
      <div id="moto-selfmsg"></div>
      <div id="moto-speed">0 กม./ชม.</div>
      <canvas id="moto-mini" width="130" height="130"></canvas>
      <div id="moto-banner"></div>
      <div id="moto-intro"><div class="m-card">
        <h3>🏍️ มอเตอร์ไซค์บ้านโพธิ์สวัสดิ์</h3>
        <p>ออกตัวหน้า<b>โรงเรียนบ้านโพธิ์สวัสดิ์</b> — ถนนจริงรอบหมู่บ้าน รัศมี 30 กม.!<br>
        🟠 สไลเดอร์ส้มซ้าย = เอียงรถเลี้ยว <b>ค้างตำแหน่งที่ตั้งไว้</b> (เลื่อนกลับกลาง = วิ่งตรง) · 🔵 ปุ่มฟ้าขวา = เร่งเครื่อง (กดค้าง)<br>
        ขับชน<b>ตัวอักษร</b>บนถนนให้ครบคำ = 🪙${REWARD} · ลูกศรเขียวชี้ทางให้<br>
        <small>⏻ ปุ่มแดงบนเครื่อง = ปิดเครื่องกลับล็อบบี้ · คีย์บอร์ด: W เร่ง · A/D เลี้ยว</small></p>
        <button id="moto-go">🏁 สตาร์ทเครื่อง!</button>
      </div></div>
    </div>
    <div id="moto-slider"><span class="m-arr">◀</span><div id="moto-knob"><span>เลี้ยว</span></div><span class="m-arr">▶</span></div>
    <button id="moto-throttle"><span class="m-ico">🏍️</span><span class="m-lb">เร่ง</span></button>
  </div>
  <div id="moto-exitbox"><div class="m-card">
    <h3>⏻ ปิดเครื่องเกม?</h3>
    <div class="m-row"><button id="moto-exit-yes">ปิดเลย</button><button id="moto-exit-no">เล่นต่อ!</button></div>
  </div></div>`;
  document.body.appendChild(wrapEl);
  screenEl=document.getElementById('moto-screen'); cvEl=document.getElementById('moto-cv');
  bikeEl=document.getElementById('moto-bikewrap');   // หมุน+ไฟเลี้ยวที่ wrapper (ภาพ+ไฟหมุนไปด้วยกัน)
  shadowEl=document.getElementById('moto-shadow');
  wheelEl=wrapEl.querySelector('.m-wheel');
  speedFxEl=document.getElementById('moto-speedfx');
  sliderEl=document.getElementById('moto-slider'); knobEl=document.getElementById('moto-knob');
  thrEl=document.getElementById('moto-throttle');
  wordEl=document.getElementById('moto-word'); spdEl=document.getElementById('moto-speed');
  gpsArr=document.getElementById('moto-gps-arr'); gpsDist=document.getElementById('moto-gps-d');
  coinsEl=document.getElementById('moto-coins'); banEl=document.getElementById('moto-banner');
  miniCv=document.getElementById('moto-mini'); miniCtx=miniCv.getContext('2d');
  introEl=document.getElementById('moto-intro'); exitBox=document.getElementById('moto-exitbox');
  /* 🏆💬 รอบ 318: กระดานคะแนน + แชทข้อความสำเร็จรูป */
  boardEl=document.getElementById('moto-board');
  chatBtn=document.getElementById('moto-chat'); chatBarEl=document.getElementById('moto-chatbar');
  selfMsgEl=document.getElementById('moto-selfmsg');
  chatBarEl.innerHTML=CHAT_PRESETS.map(t=>`<button type="button">${escapeHTML(t)}</button>`).join('');
  chatBarEl.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',e=>{
    e.preventDefault(); sendChat(CHAT_PRESETS[i]); chatBarEl.classList.remove('on');
  }));
  chatBtn.addEventListener('click',e=>{
    e.preventDefault(); chatBarEl.classList.toggle('on');
    if(typeof sfx!=='undefined') sfx.select();
  });
  /* ปุ่มเร่ง (กดค้าง) */
  const thrOn=e=>{ e.preventDefault(); padThr=1; Eng.start();
    if(introEl&&introEl.style.display!=='none') introEl.style.display='none'; };
  const thrOff=()=>{ padThr=0; };
  thrEl.addEventListener('pointerdown',thrOn);
  thrEl.addEventListener('pointerup',thrOff);
  thrEl.addEventListener('pointercancel',thrOff);
  thrEl.addEventListener('pointerleave',thrOff);
  /* สไลเดอร์เอียงรถ (รอบ 297 แมนวลเต็มตัว — ผู้ใช้สั่ง): ลากตั้งองศา -1..1
     ปล่อยนิ้ว = knob "ค้างตำแหน่งเดิม" ไม่เด้งกลับกลาง · อยากวิ่งตรงต้องเลื่อนกลับกลางเอง */
  let sliding=false;
  const setSteer=e=>{
    const r=sliderEl.getBoundingClientRect();
    let t=((e.clientX-r.left)/r.width-0.5)*2.05;  // รอบ 298: ลดความไวสไลเดอร์ (เดิม 2.4) — ต้องลากไกลขึ้นถึงเอียงเต็ม
    steerCtl=Math.max(-1,Math.min(1,t));
    knobEl.style.left=(50+steerCtl*26)+'%';
  };
  sliderEl.addEventListener('pointerdown',e=>{ sliding=true; knobEl.classList.add('grab');   // 🎛️ รอบ 309: ยกนูน+haptic ตอนจับ
    if((typeof state==='undefined'||state.haptic!==false)&&navigator.vibrate) navigator.vibrate(15);
    try{ sliderEl.setPointerCapture(e.pointerId); }catch(err){} setSteer(e); });
  sliderEl.addEventListener('pointermove',e=>{ if(sliding) setSteer(e); });
  const slEnd=()=>{ sliding=false; knobEl.classList.remove('grab'); };   // ค้างตำแหน่งที่ปล่อย
  sliderEl.addEventListener('pointerup',slEnd);
  sliderEl.addEventListener('pointercancel',slEnd);
  document.getElementById('moto-power').addEventListener('click',()=>{ exitBox.classList.add('on'); });
  document.getElementById('moto-exit-yes').addEventListener('click',exitWorld);
  document.getElementById('moto-exit-no').addEventListener('click',()=>exitBox.classList.remove('on'));
  document.getElementById('moto-go').addEventListener('click',()=>{
    introEl.style.display='none'; Eng.start();
    if(typeof sfx!=='undefined') sfx.select();
  });
}

/* ============================================================
   ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
   ============================================================ */
function segKey(bx,bz){ return bx+'_'+bz; }
/* 🛣️ รอบ 313: ลบมุมเหลี่ยม → เส้นโค้งนุ่ม (Chaikin corner-cutting · เก็บปลายทั้งสองไว้กันหลุดทางแยก)
   ถนน ≥3 จุด (มีมุม) เท่านั้น · 2 รอบ = โค้งเนียน · ถนนตรง 2 จุด คืนเดิม ไม่เพิ่ม cost */
function smoothPts(pts){
  if(pts.length<6) return pts;                    // ≤2 จุด = เส้นตรง ไม่มีมุม
  let cur=pts;
  for(let it=0; it<2; it++){
    const out=[cur[0],cur[1]];                    // คงจุดแรก (ต่อทางแยก)
    for(let i=0;i<cur.length-2;i+=2){
      const ax=cur[i],az=cur[i+1],bx=cur[i+2],bz=cur[i+3];
      out.push(ax*0.75+bx*0.25, az*0.75+bz*0.25,  // Q (ใกล้ A)
               ax*0.25+bx*0.75, az*0.25+bz*0.75); // R (ใกล้ B)
    }
    out.push(cur[cur.length-2],cur[cur.length-1]); // คงจุดสุดท้าย (ต่อทางแยก)
    cur=out;
  }
  return cur;
}
/* 🕳️⛰️ รอบ 315: ภูมิประเทศหลุม/เนิน — วางจุดตามถนน + ค้นความสูงเร็วผ่านแฮช */
function featKey(cx,cz){ return cx+'_'+cz; }
function addFeat(x,z,r,h){
  feats.push({x,z,r,h});
  const k=featKey(Math.floor(x/FEAT_CELL),Math.floor(z/FEAT_CELL));
  let a=featBuckets.get(k); if(!a){ a=[]; featBuckets.set(k,a); } a.push(feats[feats.length-1]);
}
function genFeatures(pts){
  let dist=0, next=FEAT_SP*Math.random();
  for(let i=0;i<pts.length-2;i+=2){
    const ax=pts[i],az=pts[i+1],bx=pts[i+2],bz=pts[i+3];
    const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz); if(L<0.01) continue;
    const ux=dx/L,uz=dz/L;
    while(next<=dist+L){
      if(Math.random()<FEAT_FILL){
        const t=next-dist, fx=ax+ux*t, fz=az+uz*t;
        const bump=Math.random()<0.5, r=5+Math.random()*4;
        const h=bump ? (0.55+Math.random()*Math.random()*1.3)   // เนิน 0.55–1.85 (เอียงเตี้ย · ลูกใหญ่นานๆ ที = เหินไกล)
                     : -(0.4+Math.random()*0.55);                // หลุม 0.4–0.95 ลึก
        addFeat(fx,fz,r,h);
      }
      next+=FEAT_SP;
    }
    dist+=L;
  }
}
function terrainAt(x,z){
  const cx=Math.floor(x/FEAT_CELL), cz=Math.floor(z/FEAT_CELL);
  let h=0;
  for(let ox=-1;ox<=1;ox++)for(let oz=-1;oz<=1;oz++){
    const a=featBuckets.get(featKey(cx+ox,cz+oz)); if(!a) continue;
    for(const f of a){
      const d=Math.hypot(x-f.x,z-f.z);
      if(d<f.r) h += f.h*0.5*(1+Math.cos(Math.PI*d/f.r));   // cos falloff: 1 ที่กลาง → 0 ที่ขอบ (นุ่ม)
    }
  }
  return h<-2?-2:(h>2.5?2.5:h);
}
/* ความสูงถนนใต้รถ = ยกไปที่แนวกลางถนน (ยุบ/นูนตามยาว สม่ำเสมอทั้งความกว้าง เหมือนถนนจริง) */
function roadGroundY(x,z){
  const info=roadInfo(x,z);
  if(!info.seg) return 0;
  const s=info.seg, dx=s.bx-s.ax, dz=s.bz-s.az, L2=dx*dx+dz*dz;
  let t=L2?((x-s.ax)*dx+(z-s.az)*dz)/L2:0; t=t<0?0:(t>1?1:t);
  return terrainAt(s.ax+dx*t, s.az+dz*t);
}
/* 🖼️ รอบ 316: ภาพหลุม/เนินแปะบนถนน (แบนราบ ไม่ลอย) — pool รีไซเคิลรอบผู้เล่น */
function decalTex(pot){
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const c=cv.getContext('2d');
  if(pot){                                   // หลุม: วงมืดขอบขรุขระ + ก้อนหิน
    const g=c.createRadialGradient(64,64,3,64,64,60);
    g.addColorStop(0,'rgba(12,10,8,0.94)'); g.addColorStop(0.6,'rgba(28,23,18,0.72)'); g.addColorStop(1,'rgba(40,34,26,0)');
    c.fillStyle=g; c.beginPath();
    for(let a=0,first=1;a<6.283;a+=0.32,first=0){ const rr=50+Math.random()*12, x=64+Math.cos(a)*rr, y=64+Math.sin(a)*rr; first?c.moveTo(x,y):c.lineTo(x,y); }
    c.closePath(); c.fill();
    c.fillStyle='rgba(75,64,52,0.5)'; for(let i=0;i<9;i++){ c.beginPath(); c.arc(40+Math.random()*48,40+Math.random()*48,1.4+Math.random()*2,0,7); c.fill(); }
  } else {                                    // เนิน: mound น้ำตาลอ่อน ไฮไลต์บน เงาล่าง
    const g=c.createRadialGradient(64,52,6,64,64,60);
    g.addColorStop(0,'rgba(158,128,86,0.6)'); g.addColorStop(0.7,'rgba(112,88,56,0.42)'); g.addColorStop(1,'rgba(92,72,46,0)');
    c.fillStyle=g; c.beginPath(); c.arc(64,64,58,0,7); c.fill();
    c.globalCompositeOperation='source-atop';
    const g2=c.createLinearGradient(0,58,0,122); g2.addColorStop(0,'rgba(255,240,210,0.18)'); g2.addColorStop(0.5,'rgba(0,0,0,0)'); g2.addColorStop(1,'rgba(0,0,0,0.3)');
    c.fillStyle=g2; c.fillRect(0,0,128,128); c.globalCompositeOperation='source-over';
  }
  return new THREE.CanvasTexture(cv);
}
function makeDecals(){
  potTex=decalTex(true); bumpTex=decalTex(false);
  const geo=new THREE.PlaneGeometry(2,2);
  for(let i=0;i<DECAL_N;i++){
    const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));
    m.rotation.x=-Math.PI/2; m.position.y=0.2; m.renderOrder=1; m.visible=false; m.frustumCulled=false;
    scene.add(m); decalPool.push(m);
  }
}
function decalTick(){
  if(!decalPool.length) return;
  const cx=Math.floor(px/FEAT_CELL), cz=Math.floor(pz/FEAT_CELL), rng=Math.ceil(DECAL_R/FEAT_CELL);
  let n=0;
  outer:
  for(let ox=-rng;ox<=rng;ox++)for(let oz=-rng;oz<=rng;oz++){
    const a=featBuckets.get(featKey(cx+ox,cz+oz)); if(!a) continue;
    for(const f of a){
      if(Math.hypot(f.x-px,f.z-pz)>DECAL_R) continue;
      const m=decalPool[n]; m.visible=true; m.position.set(f.x,0.2,f.z);
      const s=f.r*0.92; m.scale.set(s,s,1);
      const tex=f.h<0?potTex:bumpTex; if(m.material.map!==tex){ m.material.map=tex; m.material.needsUpdate=true; }
      if(++n>=DECAL_N) break outer;
    }
  }
  for(let i=n;i<DECAL_N;i++) decalPool[i].visible=false;
}
function buildRoads(){
  const D=window.MOTO_MAP;
  const posMinor=[], posMajor=[], posLine=[], posEdge=[], uvMinor=[], uvMajor=[];
  const roads=[];   // 🕳️ รอบ 315: pass 1 — เก็บ pts ที่ smooth แล้ว + สร้าง segs/buckets/features ก่อน แล้วค่อยสร้าง geometry (pass 2) ที่ sample ความสูง
  /* ── PASS 1: smooth + segs/buckets ชน + วางหลุม/เนิน (ต้องครบก่อน geometry จะ sample ความสูงถูก) ── */
  D.r.forEach(rd=>{
    const w=rd[0], major=rd[1], pts=smoothPts(rd[3]), hw=w/2*ROAD_WIDE;   // รอบ 313: pts ผ่าน smoothPts = เส้นโค้ง
    roads.push({pts,major,hw});
    let prevSi=-1;                                   // 💎 รอบ 318: segment ก่อนหน้าในถนนเส้นนี้ (ใช้คิดความโค้ง)
    for(let i=0;i<pts.length-2;i+=2){
      const ax=pts[i],az=pts[i+1],bx=pts[i+2],bz=pts[i+3];
      const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz); if(L<0.5) continue;
      const si=segs.length;
      segs.push({ax,az,bx,bz,hw,len:L,curv:0});
      /* 💎 รอบ 318: ความโค้งต่อ segment (มุมหักกับ segment ถัดไปในถนนเส้นเดียวกัน) — ใช้เลือกระดับเหรียญ
         คิดครั้งเดียวตอน build · ทั้งสองฝั่งของหัวโค้งได้ค่าเท่ากัน (เหรียญโค้งโผล่ทั้งก่อน/หลังหัวโค้ง) */
      if(prevSi>=0){
        const q=segs[prevSi];
        if(q.bx===ax && q.bz===az){
          const qx=q.bx-q.ax, qz=q.bz-q.az, QL=Math.hypot(qx,qz)||1;
          let dot=(qx*dx+qz*dz)/(QL*L); dot=dot>1?1:(dot<-1?-1:dot);
          const ang=Math.acos(dot);
          if(ang>q.curv) q.curv=ang;
          segs[si].curv=ang;
        }
      }
      prevSi=si;
      const steps=Math.ceil(L/BUCKET)+1;
      let pbx=null,pbz=null;
      for(let s=0;s<=steps;s++){
        const t=s/steps, cbx=Math.floor((ax+dx*t)/BUCKET), cbz=Math.floor((az+dz*t)/BUCKET);
        if(cbx===pbx&&cbz===pbz) continue; pbx=cbx; pbz=cbz;
        for(let ox=-1;ox<=1;ox++)for(let oz=-1;oz<=1;oz++){
          const k=segKey(cbx+ox,cbz+oz);
          let arr=buckets.get(k); if(!arr){ arr=[]; buckets.set(k,arr); }
          if(arr[arr.length-1]!==si) arr.push(si);
        }
      }
    }
    genFeatures(pts);   // 🕳️⛰️ วางหลุม/เนินตามถนนเส้นนี้
  });
  /* ── PASS 2: geometry — ถนนแบนราบ (รอบ 316: คืนแบน เส้นขาว+หญ้าแนบสนิท · หลุม/เนินสื่อด้วยฟิสิกส์รถ+ภาพแปะถนน) ── */
  roads.forEach(r=>{
    const pts=r.pts, major=r.major, hw=r.hw, yb=major?0.18:0.15;
    for(let i=0;i<pts.length-2;i+=2){
      const ax=pts[i],az=pts[i+1],bx=pts[i+2],bz=pts[i+3];
      const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz); if(L<0.5) continue;
      const nx=-dz/L*hw, nz=dx/L*hw;
      const tgt=major?posMajor:posMinor;
      tgt.push(ax+nx,yb,az+nz, ax-nx,yb,az-nz, bx+nx,yb,bz+nz,
               ax-nx,yb,az-nz, bx-nx,yb,bz-nz, bx+nx,yb,bz+nz);
      const uvt=major?uvMajor:uvMinor, S=ROAD_TEX_S;
      uvt.push((ax+nx)/S,(az+nz)/S, (ax-nx)/S,(az-nz)/S, (bx+nx)/S,(bz+nz)/S,
               (ax-nx)/S,(az-nz)/S, (bx-nx)/S,(bz-nz)/S, (bx+nx)/S,(bz+nz)/S);
      const ew=hw+1.0, exx=-dz/L*ew, ezz=dx/L*ew, ey=0.12;
      posEdge.push(ax+exx,ey,az+ezz, ax-exx,ey,az-ezz, bx+exx,ey,bz+ezz,
                   ax-exx,ey,az-ezz, bx-exx,ey,bz-ezz, bx+exx,ey,bz+ezz);
    }
    /* เส้นประกลางถนน (แบนราบ) */
    const period=DASH_LEN+DASH_GAP; let dashAcc=0;
    for(let i=0;i<pts.length-2;i+=2){
      const ax=pts[i],az=pts[i+1],bx=pts[i+2],bz=pts[i+3];
      const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz); if(L<0.01) continue;
      const ux=dx/L,uz=dz/L,lx=-uz*DASH_W,lz=ux*DASH_W,dy=0.21;
      let d=0;
      while(d<L){
        const phase=(dashAcc+d)%period;
        if(phase<DASH_LEN){
          const de=Math.min(L, d+(DASH_LEN-phase));
          const p0x=ax+ux*d,p0z=az+uz*d,p1x=ax+ux*de,p1z=az+uz*de;
          posLine.push(p0x+lx,dy,p0z+lz, p0x-lx,dy,p0z-lz, p1x+lx,dy,p1z+lz,
                       p0x-lx,dy,p0z-lz, p1x-lx,dy,p1z-lz, p1x+lx,dy,p1z+lz);
          d=de;
        } else { d+=(period-phase); }
      }
      dashAcc=(dashAcc+L)%period;
    }
  });
  /* ⚠️ รอบ 296 บั๊ก "ไม่เห็นถนนเลย": winding สามเหลี่ยมหันคว่ำลง + FrontSide → โดน backface culling
     มองจากบนล่องหนทั้งแผนที่ (minimap ปกติเพราะวาด 2D จากข้อมูล) → ต้อง DoubleSide เสมอ */
  /* 🛣️ รอบ 302: ภาพยางมะตอยจริงของผู้ใช้ (img/moterbike/road.webp · seamless 512) ปูตาม UV พิกัดโลก */
  const roadTex=new THREE.TextureLoader().load('img/moterbike/road.webp');
  roadTex.wrapS=roadTex.wrapT=THREE.RepeatWrapping;
  roadTex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  const mk=(arr,color,uv,map)=>{
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(arr),3));
    if(uv) g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(uv),2));
    const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,map:map||null}));
    m.frustumCulled=false; scene.add(m); return m;
  };
  mk(posEdge,0xf2f4f6);                    // ขอบถนนขาว (รองใต้ถนน โผล่ข้างละ 1m)
  mk(posMinor,0xffffff,uvMinor,roadTex);   // ถนนเล็ก — ยางมะตอยโทนตรงภาพ
  mk(posMajor,0xb4bac2,uvMajor,roadTex);   // ถนนใหญ่ — tint เข้มกว่าเล็กน้อยให้แยกจากถนนเล็ก
  mk(posLine,0xffffff);                    // เส้นประขาวกลางถนน (รอบ 312 แบ่งเลน)
}
function distToSeg(x,z,s){
  const dx=s.bx-s.ax, dz=s.bz-s.az, L2=dx*dx+dz*dz;
  let t=L2?((x-s.ax)*dx+(z-s.az)*dz)/L2:0; t=Math.max(0,Math.min(1,t));
  return Math.hypot(x-(s.ax+dx*t), z-(s.az+dz*t));
}
function roadInfo(x,z){
  const arr=buckets.get(segKey(Math.floor(x/BUCKET),Math.floor(z/BUCKET)));
  let best=1e9, bs=null;
  if(arr) for(const si of arr){ const s=segs[si], d=distToSeg(x,z,s)-s.hw; if(d<best){ best=d; bs=s; } }
  return {d:best, seg:bs};
}
function onRoad(x,z){ return roadInfo(x,z).d<=0.6; }
function randomRoadPoint(cx,cz,rMin,rMax){
  for(let i=0;i<60;i++){
    const a=Math.random()*Math.PI*2, r=rMin+Math.random()*(rMax-rMin);
    const x=cx+Math.cos(a)*r, z=cz+Math.sin(a)*r;
    const info=roadInfo(x,z);
    if(info.seg && info.d<40){          // ใกล้ถนน → ดึงลงถนน
      const s=info.seg, dx=s.bx-s.ax, dz=s.bz-s.az, L2=dx*dx+dz*dz;
      let t=L2?((x-s.ax)*dx+(z-s.az)*dz)/L2:0; t=Math.max(.05,Math.min(.95,t));
      const cxp=s.ax+dx*t, czp=s.az+dz*t;         // จุดกลางถนน
      /* 🛣️ รอบ 314: เยื้องเข้าเลนซ้าย (ผู้ใช้สั่ง — ห้ามอยู่กลาง) · ทิศหน้า = ทิศที่ผู้เล่นเข้าหา · ซ้าย=(-fz,fx) */
      let fx=dx, fz=dz; const fl=Math.hypot(fx,fz)||1; fx/=fl; fz/=fl;
      if(fx*(cxp-cx)+fz*(czp-cz)<0){ fx=-fx; fz=-fz; }   // จัดหน้าให้ชี้ออกจากผู้เล่น
      const lane=Math.min(s.hw*0.55, 3.6);        // กลางเลนซ้าย (จำกัดไม่เกิน ~1 เลน)
      /* 🪙 รอบ 319: คืนทิศถนน (fx,fz ชี้ออกจากผู้เล่น = ทิศที่ผู้เล่นวิ่งผ่านจุดนี้) ให้คนเรียกวางเหรียญหน้า/หลังได้ */
      return {x:cxp+(-fz)*lane, z:czp+fx*lane, fx, fz};
    }
  }
  return null;
}

/* ============================================================
   ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
   ============================================================ */
function makeTextSprite(text,bg,fg,emoji){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=128;
  const c=cv.getContext('2d');
  c.font='900 44px system-ui, sans-serif';
  const tw=Math.min(490,c.measureText((emoji?emoji+' ':'')+text).width+46);
  c.beginPath(); c.roundRect((512-tw)/2,14,tw,100,44);
  c.fillStyle=bg; c.fill(); c.lineWidth=7; c.strokeStyle='#ffffff'; c.stroke();
  c.fillStyle=fg; c.textAlign='center'; c.textBaseline='middle';
  c.fillText((emoji?emoji+' ':'')+text,256,68,470);
  const t=new THREE.CanvasTexture(cv);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
  return sp;
}
function letterTexture(ch){
  const key='L'+ch;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const col=TILE_COLORS[(ch.charCodeAt(0)-97)%TILE_COLORS.length];
  c.beginPath(); c.roundRect(8,8,112,112,26);
  c.fillStyle=col; c.fill();
  c.lineWidth=8; c.strokeStyle='rgba(255,255,255,.92)'; c.stroke();
  c.fillStyle='#fff'; c.font='900 84px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(ch.toUpperCase(),64,72);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
/* ---------- 🏫 โรงเรียน 3D ตามคลิปจริง (รอบ 295) ---------- */
function woodTileMat(){          // กระเบื้องลายไม้เฉียงมันวาว (บันไดในคลิป)
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.fillStyle='#a9642a'; c.fillRect(0,0,128,128);
  c.strokeStyle='rgba(255,214,160,.75)'; c.lineWidth=3;
  for(let i=-128;i<256;i+=14){ c.beginPath(); c.moveTo(i,0); c.lineTo(i+64,64); c.moveTo(i,64); c.lineTo(i+64,128); c.stroke(); }
  c.strokeStyle='#efe8dc'; c.lineWidth=4;
  c.strokeRect(0,0,64,64); c.strokeRect(64,64,64,64); c.strokeRect(64,0,64,64); c.strokeRect(0,64,64,64);
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping;
  return new THREE.MeshPhongMaterial({map:t, shininess:90, specular:0x777777});
}
function muralTexture(){         // ภาพวาดการ์ตูนบนผนังทางเดิน (จากคลิป)
  const cv=document.createElement('canvas'); cv.width=256; cv.height=96;
  const c=cv.getContext('2d');
  c.fillStyle='#fdf6e8'; c.fillRect(0,0,256,96);
  const sky=c.createLinearGradient(0,0,0,60); sky.addColorStop(0,'#9fdcf7'); sky.addColorStop(1,'#e8f7ff');
  c.fillStyle=sky; c.fillRect(6,6,244,58);
  c.fillStyle='#8fd06c'; c.fillRect(6,56,244,34);
  c.font='34px serif'; c.textBaseline='middle';
  ['🌈','🐘','🌻','🦋','🏫','🌳'].forEach((e,i)=>c.fillText(e,14+i*40,60));
  c.font='26px serif'; c.fillText('☀️',216,24); c.fillText('☁️',30,22);
  return new THREE.CanvasTexture(cv);
}
function buildSchool(cx,cz,face){
  const g=new THREE.Group();
  const lam=c=>new THREE.MeshLambertMaterial({color:c});
  const purple=lam(0x8e5fc0), purpleD=lam(0x6a4694), white=lam(0xf2f3f6),
        winMat=lam(0xcfe6ff), doorMat=lam(0x7a4b26), chrome=new THREE.MeshPhongMaterial({color:0xd9dee4,shininess:110,specular:0xaaaaaa});
  /* ลานคอนกรีตหน้าอาคาร */
  const yard=new THREE.Mesh(new THREE.BoxGeometry(76,.12,58), lam(0xd0d5da));
  yard.position.y=.06; g.add(yard);
  /* อาคารม่วง 2 ชั้น + ระเบียงทางเดินหน้า (เหมือนภาพ Google/คลิป) */
  const FH=3.4, BL=38, BD=8;
  const bld=new THREE.Mesh(new THREE.BoxGeometry(BL,FH*2,BD), purple);
  bld.position.set(0,FH,-19); g.add(bld);
  const slab=new THREE.Mesh(new THREE.BoxGeometry(BL+3,.35,BD+3.4), purpleD);   // พื้นระเบียงชั้น 2
  slab.position.set(0,FH,-19+.6); g.add(slab);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(BL+4,1,BD+4), lam(0xb0562e)); // หลังคาส้มอิฐ
  roof.position.set(0,FH*2+.6,-19); g.add(roof);
  const roofTop=new THREE.Mesh(new THREE.CylinderGeometry(0,3.4,2.2,4), lam(0x9c4826));
  roofTop.scale.set(BL/6,1,1); roofTop.rotation.y=Math.PI/4; roofTop.position.set(0,FH*2+2.1,-19); g.add(roofTop);
  /* เสาระเบียงขาว + ราวกันตกชั้น 2 */
  for(let x=-18;x<=18;x+=4.5){
    const col=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,FH*2,8), white);
    col.position.set(x,FH,-14.2); g.add(col);
  }
  const rail2=new THREE.Mesh(new THREE.BoxGeometry(BL+2,.12,.12), chrome);
  rail2.position.set(0,FH+1.05,-14.2); g.add(rail2);
  const rail2b=new THREE.Mesh(new THREE.BoxGeometry(BL+2,.55,.06), lam(0xb69ad8));
  rail2b.position.set(0,FH+.62,-14.2); g.add(rail2b);
  /* หน้าต่างฟ้า 2 ชั้น + ประตู + ภาพวาดการ์ตูนผนังชั้นล่าง */
  const winGeo=new THREE.BoxGeometry(2.6,1.7,.18);
  for(let f=0;f<2;f++) for(let i=-3;i<=3;i++){
    if(f===0&&(i===-1||i===1)) continue;                        // เว้นช่องประตู
    const w=new THREE.Mesh(winGeo,winMat); w.position.set(i*4.8,1.9+f*FH,-14.95); g.add(w);
  }
  [-1,1].forEach(i=>{
    const d=new THREE.Mesh(new THREE.BoxGeometry(1.7,2.6,.18), doorMat);
    d.position.set(i*4.8,1.3,-14.95); g.add(d);
  });
  const mural=new THREE.Mesh(new THREE.PlaneGeometry(7,2.6),
    new THREE.MeshBasicMaterial({map:muralTexture()}));
  mural.position.set(-13.5,1.7,-14.93); g.add(mural);
  /* 🪜 บันไดซิกเนเจอร์จากคลิป: กระเบื้องลายไม้มันวาว + ผนังข้างม่วง + ราวโครเมียม (ปลายอาคารขวา) */
  const tile=woodTileMat();
  const STEPS=9, SW=3.2, SD=.62, SH=FH/STEPS;
  const stairX=BL/2+2.2;
  for(let i=0;i<STEPS;i++){
    const st=new THREE.Mesh(new THREE.BoxGeometry(SW,SH,SD), tile);
    st.position.set(stairX, SH/2+i*SH, -14.5-i*SD);
    g.add(st);
  }
  const sideW=new THREE.Mesh(new THREE.BoxGeometry(.25,FH+1.2,STEPS*SD+1.4), purple);
  sideW.position.set(stairX+SW/2+.15, (FH+1.2)/2, -14.5-(STEPS*SD)/2); g.add(sideW);
  const railLen=Math.hypot(STEPS*SD,FH)+1;
  const rail=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,railLen,8), chrome);
  rail.rotation.x=Math.atan2(FH,STEPS*SD)+Math.PI/2;
  rail.position.set(stairX-SW/2-.1, FH/2+.95, -14.5-(STEPS*SD)/2); g.add(rail);
  for(let i=0;i<3;i++){
    const post=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.95,6), chrome);
    const t=i/2;
    post.position.set(stairX-SW/2-.1, t*FH+.5, -14.5-t*STEPS*SD); g.add(post);
  }
  /* 🇹🇭 เสาธงชาติไทย */
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,13,8), white);
  pole.position.set(-24,6.5,2); g.add(pole);
  const STRIPES=[[0xB5002D,.45],[0xffffff,.45],[0x2D2A4A,.9],[0xffffff,.45],[0xB5002D,.45]];
  let fy=12.3;
  STRIPES.forEach(([col,h])=>{
    const s=new THREE.Mesh(new THREE.PlaneGeometry(4,h), new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}));
    s.position.set(-21.9,fy-h/2,2); g.add(s); fy-=h;
  });
  const poleBase=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.5,.8,10), white);
  poleBase.position.set(-24,.4,2); g.add(poleBase);
  /* 🐘 รูปปั้นช้างน้ำเงิน (จากคลิป) บนแท่นขาว กลางสวนหน้าลาน */
  const ele=new THREE.Group();
  const blue=lam(0x2e6fd8);
  const ped=new THREE.Mesh(new THREE.BoxGeometry(3.4,.7,2.4), white); ped.position.y=.35; ele.add(ped);
  const body=new THREE.Mesh(new THREE.SphereGeometry(1.05,12,10), blue);
  body.scale.set(1.35,1,.95); body.position.y=1.85; ele.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.62,12,10), blue); head.position.set(1.55,2.25,0); ele.add(head);
  [-1,1].forEach(s=>{
    const ear=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.1,10), blue);
    ear.rotation.z=Math.PI/2; ear.position.set(1.35,2.35,s*.55); ele.add(ear);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.07,6,6), lam(0x111111));
    eye.position.set(2.02,2.42,s*.26); ele.add(eye);
  });
  const tr1=new THREE.Mesh(new THREE.CylinderGeometry(.16,.13,.9,8), blue);
  tr1.rotation.z=-.7; tr1.position.set(2.2,1.85,0); ele.add(tr1);
  const tr2=new THREE.Mesh(new THREE.CylinderGeometry(.13,.11,.6,8), blue);
  tr2.rotation.z=-.15; tr2.position.set(2.5,1.4,0); ele.add(tr2);
  for(const [lx,lz] of [[-.7,-.45],[-.7,.45],[.5,-.45],[.5,.45]]){
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(.22,.25,.95,8), blue);
    leg.position.set(lx,1.15,lz); ele.add(leg);
  }
  ele.position.set(-12,0,14); ele.rotation.y=.5; g.add(ele);
  /* 🌼 แปลงดอกไม้รอบช้าง + ริมลาน */
  const bed=new THREE.Mesh(new THREE.BoxGeometry(10,.3,6), lam(0x4e9b45));
  bed.position.set(-12,.15,14); g.add(bed);
  const FLW=[0xff5f8f,0xffd54f,0xff8a3d,0xb388ff,0xff4d6d,0xffffff];
  const flower=new THREE.InstancedMesh(new THREE.SphereGeometry(.22,6,6), lam(0xffffff), 46);
  const fm=new THREE.Matrix4(), fc=new THREE.Color();
  for(let i=0;i<46;i++){
    const onBed=i<22;
    const fx=onBed?(-12+(Math.random()*9-4.5)):(Math.random()*70-35);
    const fz=onBed?(14+(Math.random()*5-2.5)):(26.5+Math.random()*1.6);
    fm.makeScale(1,1,1); fm.setPosition(fx,.42,fz); flower.setMatrixAt(i,fm);
    fc.setHex(FLW[i%FLW.length]); flower.setColorAt(i,fc);
  }
  g.add(flower);
  /* 🛝 สนามเด็กเล่น: สไลเดอร์แดง + ชิงช้าเหลือง (จากคลิป) */
  const slide=new THREE.Group();
  const ramp=new THREE.Mesh(new THREE.BoxGeometry(1.1,.14,4.6), lam(0xe84d5b));
  ramp.rotation.x=-.55; ramp.position.set(0,1.25,1.05); slide.add(ramp);
  const deck=new THREE.Mesh(new THREE.BoxGeometry(1.2,.14,1.2), lam(0xf6c026));
  deck.position.set(0,2.35,-1.35); slide.add(deck);
  for(const [px2,pz2] of [[-.5,-1.9],[.5,-1.9],[-.5,-.8],[.5,-.8]]){
    const lg=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,2.35,6), lam(0x3b8fd4));
    lg.position.set(px2,1.18,pz2); slide.add(lg);
  }
  for(let i=0;i<4;i++){
    const rung=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1,6), lam(0xf2f3f6));
    rung.rotation.z=Math.PI/2; rung.position.set(0,.5+i*.55,-2.42); slide.add(rung);
  }
  slide.position.set(12,0,16); slide.rotation.y=-.7; g.add(slide);
  const swing=new THREE.Group();
  [-1.6,1.6].forEach(sx=>{
    [-1,1].forEach(sz=>{
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,2.9,6), lam(0xf6c026));
      leg.rotation.x=sz*.32; leg.position.set(sx,1.35,sz*.5); swing.add(leg);
    });
  });
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,3.6,6), lam(0xf6c026));
  beam.rotation.z=Math.PI/2; beam.position.y=2.7; swing.add(beam);
  [-0.75,0.75].forEach(sx=>{
    [-.28,.28].forEach(dx=>{
      const rope=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.9,5), lam(0xcccccc));
      rope.position.set(sx+dx,1.72,0); swing.add(rope);
    });
    const seat=new THREE.Mesh(new THREE.BoxGeometry(.75,.08,.3), lam(0xe84d5b));
    seat.position.set(sx,.75,0); swing.add(seat);
  });
  swing.position.set(21,0,13); swing.rotation.y=.4; g.add(swing);
  /* ป้ายชื่อโรงเรียนลอย */
  const sign=makeTextSprite('โรงเรียนบ้านโพธิ์สวัสดิ์','#7c4fb5','#ffffff','🏫');
  sign.scale.set(46,11.5,1); sign.position.set(0,15,-19); g.add(sign);
  g.position.set(cx,0,cz); g.rotation.y=face;
  scene.add(g);
}
function buildScenery(){
  const D=window.MOTO_MAP;
  /* พื้นหญ้า — รอบ 302: ภาพหญ้าจริงของผู้ใช้ (grass.webp seamless) ปูซ้ำทั้งผืน
     polygonOffset ดันพื้นถอยใน depth buffer ให้ถนนชนะเสมอ (กัน z-fight ระยะไกล) */
  const grassTex=new THREE.TextureLoader().load('img/moterbike/grass.webp');
  grassTex.wrapS=grassTex.wrapT=THREE.RepeatWrapping;
  grassTex.repeat.set(64000/GRASS_TEX_S,64000/GRASS_TEX_S);
  grassTex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  const g=new THREE.Mesh(new THREE.PlaneGeometry(64000,64000),
    new THREE.MeshLambertMaterial({color:0xe8e8e8, map:grassTex, polygonOffset:true, polygonOffsetFactor:2, polygonOffsetUnits:2}));
  g.rotation.x=-Math.PI/2; g.position.y=-0.05; scene.add(g);
  /* 🏫 โรงเรียนบ้านโพธิ์สวัสดิ์ — สร้างตามคลิปจริงของผู้ใช้ (รอบ 295):
     บันไดกระเบื้องลายไม้มันวาว+ผนังม่วง+ราวโครเมียม · ช้างน้ำเงินในสวน · สนามเด็กเล่น · ธงไตรรงค์
     วางข้างถนนจุดสตาร์ท ฝั่งที่ไม่ทับถนน หันหน้าเข้าถนน — ขี่เข้าไปเดินเล่นในลานได้ (นอกถนน=ช้าอัตโนมัติ) */
  const nrmX=Math.cos(startYaw), nrmZ=-Math.sin(startYaw);      // ตั้งฉากกับทิศถนน
  let scx=startX+nrmX*52, scz=startZ+nrmZ*52;
  if(roadInfo(scx,scz).d<10){ scx=startX-nrmX*52; scz=startZ-nrmZ*52; }
  buildSchool(scx, scz, Math.atan2(startX-scx, startZ-scz));
  /* 🏘️ ป้ายชื่อหมู่บ้าน (จาก OSM place) — ป้ายชมพูลอยเหนือหมู่บ้าน + บ้านหลังเล็กพาสเทล */
  const PASTEL=[0xffc9de,0xffe0a3,0xbfe6ff,0xd6f5c1,0xe6d0ff,0xfff3b0];
  const houseN=Math.min(D.pl.length*3,650);
  const wall=new THREE.InstancedMesh(new THREE.BoxGeometry(6,3.6,5),
    new THREE.MeshLambertMaterial({color:0xffffff}),houseN);
  const roofm=new THREE.InstancedMesh(new THREE.ConeGeometry(4.6,2.6,4),
    new THREE.MeshLambertMaterial({color:0xffffff}),houseN);
  const mtx=new THREE.Matrix4(), col=new THREE.Color();
  let hi=0;
  D.pl.forEach((p,pi)=>{
    const sp=makeTextSprite(p[2],'#ff7fae','#ffffff','🏘️');
    sp.scale.set(34,8.5,1); sp.position.set(p[0],13,p[1]); scene.add(sp);
    for(let i=0;i<3&&hi<houseN;i++){
      const a=Math.random()*Math.PI*2, r=22+Math.random()*45;
      const hx=p[0]+Math.cos(a)*r, hz=p[1]+Math.sin(a)*r;
      if(onRoad(hx,hz)) continue;
      const ry=Math.random()*Math.PI;
      mtx.makeRotationY(ry); mtx.setPosition(hx,1.8,hz); wall.setMatrixAt(hi,mtx);
      col.setHex(PASTEL[(pi+i)%PASTEL.length]); wall.setColorAt(hi,col);
      mtx.makeRotationY(ry+Math.PI/4); mtx.setPosition(hx,4.9,hz); roofm.setMatrixAt(hi,mtx);
      col.setHex(0xd96a4b); roofm.setColorAt(hi,col);
      hi++;
    }
  });
  wall.count=hi; roofm.count=hi;
  wall.instanceMatrix.needsUpdate=true; roofm.instanceMatrix.needsUpdate=true;
  if(wall.instanceColor) wall.instanceColor.needsUpdate=true;
  if(roofm.instanceColor) roofm.instanceColor.needsUpdate=true;
  scene.add(wall); scene.add(roofm);
  /* 🌳 ต้นไม้รีไซเคิลรอบตัวรถ (พาสเทลน่ารัก) */
  const GREENS=[0x63c76b,0x7fd77f,0x54b06a,0xffa8c9,0x8fdc9a];
  trees=new THREE.InstancedMesh(new THREE.CylinderGeometry(.35,.5,2.6,6),
    new THREE.MeshLambertMaterial({color:0x9a6a43}),TREE_N);
  treeTop=new THREE.InstancedMesh(new THREE.SphereGeometry(2.4,10,8),
    new THREE.MeshLambertMaterial({color:0xffffff}),TREE_N);
  for(let i=0;i<TREE_N;i++){
    treePos.push({x:0,z:0,s:.8+Math.random()*1});
    col.setHex(GREENS[i%GREENS.length]); treeTop.setColorAt(i,col);
  }
  scene.add(trees); scene.add(treeTop);
  scatterTrees(true);
  /* 🚧 หลักเขตทางขาว-แดงริมถนนแบบไทย (รอบ 303) — instanced 2 ก้อน (ต้นขาว+หัวแดง) วางตามขอบถนนรอบผู้เล่น */
  postBody=new THREE.InstancedMesh(new THREE.CylinderGeometry(.09,.12,1.0,6),
    new THREE.MeshLambertMaterial({color:0xf4f6f8}),POST_N);
  postTop=new THREE.InstancedMesh(new THREE.CylinderGeometry(.095,.095,.24,6),
    new THREE.MeshLambertMaterial({color:0xd63535}),POST_N);
  scene.add(postBody); scene.add(postTop);
  postTick();
  /* ☁️ เมฆน่ารักลอยสูง */
  const puff=document.createElement('canvas'); puff.width=puff.height=128;
  const pc=puff.getContext('2d');
  pc.fillStyle='#fff';
  [[64,74,34],[38,80,24],[92,80,24],[52,58,22],[78,58,22]].forEach(([x,y,r])=>{ pc.beginPath(); pc.arc(x,y,r,0,7); pc.fill(); });
  const ptex=new THREE.CanvasTexture(puff);
  for(let i=0;i<14;i++){
    const c=new THREE.Sprite(new THREE.SpriteMaterial({map:ptex,transparent:true,opacity:.9}));
    c.scale.set(46,26,1);
    clouds.push(c); scene.add(c);
  }
  scatterClouds(true);
}
function scatterTrees(all){
  const m=new THREE.Matrix4();
  let dirty=false;
  for(let i=0;i<TREE_N;i++){
    const t=treePos[i];
    if(all || Math.hypot(t.x-px,t.z-pz)>680){
      for(let k=0;k<8;k++){
        const a=Math.random()*Math.PI*2, r=all?Math.random()*620:(420+Math.random()*240);
        const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
        if(!onRoad(x,z)){ t.x=x; t.z=z; break; }
      }
      dirty=true;
    }
    m.makeScale(t.s,t.s,t.s); m.setPosition(t.x,1.3*t.s,t.z); trees.setMatrixAt(i,m);
    m.makeScale(t.s,t.s,t.s); m.setPosition(t.x,4.2*t.s,t.z); treeTop.setMatrixAt(i,m);
  }
  if(dirty||all){ trees.instanceMatrix.needsUpdate=true; treeTop.instanceMatrix.needsUpdate=true;
    if(treeTop.instanceColor) treeTop.instanceColor.needsUpdate=true; }
}
/* 🚧 วางหลักเขตทางตามขอบถนนในรัศมี POST_R — เรียกซ้ำทุก 1 วิ (ตำแหน่ง deterministic ตามเส้นถนน ไม่สุ่ม ไม่กระพริบย้ายที่) */
function postTick(){
  if(!postBody) return;
  const m=new THREE.Matrix4(); let n=0;
  const seen=new Set();
  const b0x=Math.floor((px-POST_R)/BUCKET), b1x=Math.floor((px+POST_R)/BUCKET);
  const b0z=Math.floor((pz-POST_R)/BUCKET), b1z=Math.floor((pz+POST_R)/BUCKET);
  outer:
  for(let bx=b0x;bx<=b1x;bx++)for(let bz=b0z;bz<=b1z;bz++){
    const arr=buckets.get(segKey(bx,bz)); if(!arr) continue;
    for(const si of arr){
      if(seen.has(si)) continue; seen.add(si);
      const s=segs[si], ux=(s.bx-s.ax)/s.len, uz=(s.bz-s.az)/s.len;
      for(let d=POST_SP*.5; d<s.len; d+=POST_SP){
        for(const side of [1,-1]){
          const x=s.ax+ux*d-uz*side*(s.hw+.9), z=s.az+uz*d+ux*side*(s.hw+.9);
          if(Math.hypot(x-px,z-pz)>POST_R) continue;
          if(roadInfo(x,z).d<.4) continue;       // จุดนี้ทับถนนเส้นอื่น (ทางแยก) — ข้าม
          m.setPosition(x,.5,z); postBody.setMatrixAt(n,m);
          m.setPosition(x,1.1,z); postTop.setMatrixAt(n,m);
          if(++n>=POST_N) break outer;
        }
      }
    }
  }
  postBody.count=n; postTop.count=n;
  postBody.instanceMatrix.needsUpdate=true; postTop.instanceMatrix.needsUpdate=true;
}
function scatterClouds(all){
  clouds.forEach(c=>{
    if(all || Math.hypot(c.position.x-px,c.position.z-pz)>1400){
      const a=Math.random()*Math.PI*2, r=all?200+Math.random()*900:900+Math.random()*400;
      c.position.set(px+Math.cos(a)*r, 90+Math.random()*80, pz+Math.sin(a)*r);
    }
  });
}

/* ============================================================
   🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 500 เหรียญ
   ============================================================ */
function makeDog(){
  const g=new THREE.Group();
  const brown=new THREE.MeshLambertMaterial({color:0x8a5a2b}), dark=new THREE.MeshLambertMaterial({color:0x5c3a1a});
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.4,.7,.6),brown); body.position.y=.9; g.add(body);
  const head=new THREE.Mesh(new THREE.BoxGeometry(.55,.55,.5),brown); head.position.set(.9,1.15,0); g.add(head);
  const snout=new THREE.Mesh(new THREE.BoxGeometry(.35,.3,.35),dark); snout.position.set(1.2,1.05,0); g.add(snout);
  [.35,-.35].forEach(ez=>{ const ear=new THREE.Mesh(new THREE.BoxGeometry(.15,.3,.2),dark); ear.position.set(.72,1.48,ez); g.add(ear); });
  const tail=new THREE.Mesh(new THREE.BoxGeometry(.5,.15,.15),brown); tail.rotation.z=.6; tail.position.set(-.85,1.1,0); g.add(tail);
  const legs=[];
  for(const [lx,lz] of [[.5,.22],[.5,-.22],[-.5,.22],[-.5,-.22]]){
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.18,.6,.18),dark); leg.position.set(lx,.4,lz); g.add(leg); legs.push(leg);
  }
  g.userData.legs=legs; g.visible=false; scene.add(g);
  return g;
}
function spawnDog(){
  const ahead=25+Math.random()*30;
  const cx=px+Math.sin(yaw)*ahead, cz=pz+Math.cos(yaw)*ahead;
  const info=roadInfo(cx,cz); if(!info.seg) return;          // ข้างหน้าไม่ใช่ถนน → ข้ามรอบนี้
  const side=Math.random()<.5?1:-1, rpx=Math.cos(yaw), rpz=-Math.sin(yaw), off=info.seg.hw+3.5;
  dog.grp.position.set(cx+rpx*side*off,0,cz+rpz*side*off); dog.grp.visible=true;
  dog.vx=-rpx*side*DOG_SPD; dog.vz=-rpz*side*DOG_SPD;
  dog.life=(off*2)/DOG_SPD+1; dog.hit=false;
  dog.grp.rotation.y=Math.atan2(dog.vx,dog.vz);
}
function dogHit(){
  cleanWord=false;                                   // 🍀 ชนหมา = คำนี้อดเหรียญมรกต
  const have=(typeof state!=='undefined'&&typeof state.coins==='number')?state.coins:0;
  const pen=Math.min(DOG_HIT_COIN,have);
  if(typeof addCoins==='function'&&pen>0) addCoins(-pen);
  if((typeof state==='undefined'||state.haptic!==false)&&navigator.vibrate) navigator.vibrate([50,40,50]);
  if(typeof sfx!=='undefined'&&sfx.wrong) sfx.wrong();
  banEl.innerHTML=`🐕💥 ชนหมา!<br><span class="m-coin" style="color:#ff9a9a">−${fmtNum(pen)} 🪙</span>`;
  banEl.classList.add('show'); setTimeout(()=>banEl.classList.remove('show'),1900);
  dog.grp.visible=false; if(typeof saveState==='function') saveState();
}
function dogTick(dt,now){
  if(!dog) return;
  if(!dog.grp.visible){
    if(now>=dogNextAt && spd>6){ spawnDog(); dogNextAt=now+DOG_GAP_MS+Math.random()*6000; }
    return;
  }
  dog.grp.position.x+=dog.vx*dt; dog.grp.position.z+=dog.vz*dt; dog.life-=dt;
  const t=now*.02;
  dog.grp.userData.legs.forEach((lg,i)=>{ lg.rotation.x=Math.sin(t+(i%2)*Math.PI)*.8; });
  dog.grp.position.y=Math.abs(Math.sin(t))*.14;
  if(!dog.hit && Math.hypot(dog.grp.position.x-px,dog.grp.position.z-pz)<2.7){ dog.hit=true; dogHit(); }
  if(dog.life<=0) dog.grp.visible=false;
}

/* ============================================================
   🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
   (ผู้ใช้: "เหรียญบนถนนน้อยไป" + เก็บได้ต้องมีเสียง/ภาพชัด)
   ============================================================ */
function coinTexture(tier){
  const T=COIN_TIERS[tier];
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const c=cv.getContext('2d');
  const g=c.createRadialGradient(48,42,4,64,64,60);
  g.addColorStop(0,T.hi); g.addColorStop(.45,T.mid); g.addColorStop(1,T.lo);
  c.beginPath(); c.arc(64,64,58,0,7); c.fillStyle=g; c.fill();
  c.lineWidth=7; c.strokeStyle=T.hi; c.stroke();
  c.beginPath(); c.arc(64,64,38,0,7); c.lineWidth=5; c.strokeStyle=T.ring; c.stroke();
  c.fillStyle=T.ink; c.font='900 52px Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(T.mark,64,68);
  return new THREE.CanvasTexture(cv);
}
function makeCoins(){
  coinTex=COIN_TIERS.map((t,i)=>coinTexture(i));
  COIN_TIERS.forEach((t,i)=>loadCoinImg(i,t.key));      // 🖼️ มีภาพจริงใน img/coins/ = ใช้แทนลายวาดทันที
}
/* 🖼️ รอบ 338: เหรียญภาพจริง — วางไฟล์ `img/coins/<key>.png` (พื้นโปร่ง) แล้วเกมสลับให้เอง
   ไม่มีไฟล์ = ใช้เหรียญที่วาดด้วยโค้ดเหมือนเดิม · prompt ภาพใน PROMPTS_COINS.md */
function loadCoinImg(i,key){
  if(!key) return;
  const im=new Image();
  im.onload=()=>{
    const t=new THREE.Texture(im); t.needsUpdate=true;
    if(coinTex[i] && coinTex[i].dispose) coinTex[i].dispose();
    coinTex[i]=t;
    coins.forEach(c=>{ if(c.tier===i && c.spr) c.spr.material.map=t, c.spr.material.needsUpdate=true; });
  };
  im.src='img/coins/'+key+'.png';
}
/* วางเหรียญ 1 ใบ · side: +1 = ด้านหลังตัวอักษร (ทอง) · -1 = ด้านหน้า (พิเศษ) — จำไว้เพื่อย้ายตามตอนตัวอักษรย้ายที่ */
function addCoin(l,tier,side){
  const T=COIN_TIERS[tier], p=l.spr.position;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:coinTex[tier],transparent:true}));
  s.scale.set(T.size,T.size,1);
  s.position.set(p.x+l.fx*COIN_GAP*side, T.y, p.z+l.fz*COIN_GAP*side);
  s.frustumCulled=false; scene.add(s);
  coins.push({spr:s,tier,l,side,phase:Math.random()*Math.PI*2});   // phase = เหรียญแต่ละใบหมุนไม่พร้อมกัน
}
function clearCoins(){                                  // 🍀 เหรียญ keep (มรกตรางวัล) ไม่โดนล้างตอนขึ้นคำใหม่
  coins=coins.filter(c=>{ if(c.keep) return true; scene.remove(c.spr); return false; });
}
/* 🍀 เหรียญอิสระ (ไม่ผูกกับตัวอักษร) — ใช้กับเหรียญมรกตรางวัล "เก็บครบคำโดยไม่ชนเลย" */
function addFreeCoin(tier,x,z){
  const T=COIN_TIERS[tier];
  const s2=new THREE.Sprite(new THREE.SpriteMaterial({map:coinTex[tier],transparent:true}));
  s2.scale.set(T.size,T.size,1); s2.position.set(x,T.y,z); s2.frustumCulled=false; scene.add(s2);
  coins.push({spr:s2,tier,l:null,side:0,keep:true,phase:Math.random()*Math.PI*2});
}
/* 💎 รอบ 318: เลือกระดับเหรียญจากสภาพเส้นทางตรงจุดนั้น
   ใกล้หลุม/เนิน (feats) = เหรียญเพชร 🪙20 · ทางโค้ง (ทิศถนนหักเกิน ~20°) = เหรียญฟ้า 🪙5 · ทางตรง = ทอง 🪙1 */
function coinTierAt(x,z){
  const cx=Math.floor(x/FEAT_CELL), cz=Math.floor(z/FEAT_CELL);
  for(let ox=-1;ox<=1;ox++)for(let oz=-1;oz<=1;oz++){
    const a=featBuckets.get(featKey(cx+ox,cz+oz)); if(!a) continue;
    for(const f of a) if(Math.hypot(x-f.x,z-f.z)<f.r*0.9) return 2;      // อยู่ในวงหลุม/เนิน
  }
  const s=roadInfo(x,z).seg;
  return (s && s.curv>=COIN_CURVE_RAD) ? 1 : 0;                         // ทางโค้ง (มุมหักของถนนตรงจุดนี้)
}
/* เอฟเฟกต์ "ได้เหรียญ": ป้ายลอยขึ้น + วงประกาย + ตัวเลขมุมขวาเด้ง + เสียง + สั่น */
function coinFx(txt,big){
  if(!screenEl) return;
  const el=document.createElement('div'); el.className='m-cfx'+(big?' big':''); el.textContent=txt;
  el.style.left=(44+Math.random()*12)+'%';
  screenEl.appendChild(el); setTimeout(()=>el.remove(),950);
  const rg=document.createElement('div'); rg.className='m-cring';
  screenEl.appendChild(rg); setTimeout(()=>rg.remove(),520);
  if(coinsEl){ coinsEl.classList.remove('pop'); void coinsEl.offsetWidth; coinsEl.classList.add('pop'); }
}
function grabCoin(tier){
  const T=COIN_TIERS[tier], v=T.val;
  if(typeof addCoins==='function') addCoins(v);
  sessionCoins+=v;
  if(coinsEl) coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
  coinFx((tier?T.name+' ':'')+'+'+v+' 🪙',tier>0);
  if(typeof sfx!=='undefined'){
    if(sfx.coin) sfx.coin();
    if(tier>=2&&sfx.levelup) setTimeout(()=>sfx.levelup(),90);          // 💎🍀 เพชร/มรกตมีเสียงฉลอง
    else if(tier===1&&sfx.buy) setTimeout(()=>sfx.buy(),70);
  }
  if((typeof state==='undefined'||state.haptic!==false)&&navigator.vibrate) navigator.vibrate(tier?[18,30,26]:16);
  if(tier>=2&&banEl){                                                     // ป้ายใหญ่: เพชร 💎 / มรกต 🍀
    banEl.innerHTML=`${tier===EMERALD_TIER?'🍀 เหรียญมรกต — รางวัลขับสะอาด!':'💎 เจอเหรียญเพชร!'}<br><span class="m-coin">+${v} 🪙</span>`;
    banEl.classList.add('show'); setTimeout(()=>banEl.classList.remove('show'),1500);
  }
}
function coinTick(dt,now){
  for(let i=coins.length-1;i>=0;i--){
    const c=coins[i], p=c.spr.position, T=COIN_TIERS[c.tier];
    p.y=T.y+Math.sin(now*.004+p.x*.7)*.28;      // ลอยขึ้นลงให้สะดุดตา
    // 🪙 หมุนรอบตัว: บีบแกน x ตาม |cos| (สไปรต์หันหน้าเข้ากล้องเสมอ → บีบ = เห็นเป็นเหรียญหมุนจริง)
    //    + วิบวับตอนหันหน้าเต็มใบ (ช่วงที่แสงกระทบหน้าเหรียญ)
    const a=now*COIN_SPIN_SPD+c.phase, ca=Math.abs(Math.cos(a));
    c.spr.scale.x=T.size*Math.max(COIN_EDGE_MIN,ca);
    const shine=1+.22*Math.pow(ca,8);           // ยิ่งหันหน้าตรง ยิ่งวาบ
    c.spr.material.color.setScalar(shine);
    if(Math.hypot(p.x-px,p.z-pz)<COIN_PICK_R){ scene.remove(c.spr); coins.splice(i,1); grabCoin(c.tier); }
  }
}
/* 💎 เหรียญพิเศษหน้าตัวอักษร "ตัวสุดท้ายที่เหลือ" ของคำ — อยู่บนหลุม/เนิน = เพชร 🪙20 · ไม่งั้น = โค้ง 🪙5 */
function placeSpecialCoin(){
  if(specialDone || letters.length!==1) return;
  specialDone=true;
  const l=letters[0], p=l.spr.position;
  const fx=p.x-l.fx*COIN_GAP, fz=p.z-l.fz*COIN_GAP;
  const tier=coinTierAt(fx,fz)===2?2:1;
  addCoin(l,tier,-1);
}
/* ============================================================
   🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
   หน้ารถ = แกน +z ท้องถิ่น → ตั้ง rotation.y=yaw ตรงกับ convention เกม (หน้า = sin/cos yaw)
   ============================================================ */
function makeVehicle(kind,color){
  const g=new THREE.Group();
  const lam=c=>new THREE.MeshLambertMaterial({color:c});
  const dark=lam(0x2a2f38), glass=lam(0x9fd4ff), skin=lam(0xf2c49b);
  if(kind==='car'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.9,.8,4.2),lam(color)); body.position.y=.85; g.add(body);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(1.66,.78,2.1),glass); cab.position.set(0,1.56,-.15); g.add(cab);
    for(const [wx,wz] of [[.98,1.32],[-.98,1.32],[.98,-1.32],[-.98,-1.32]]){
      const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.28,12),dark);
      w.rotation.z=Math.PI/2; w.position.set(wx,.42,wz); g.add(w);
    }
    for(const lx of [.62,-.62]){                     // ไฟหน้า
      const h=new THREE.Mesh(new THREE.BoxGeometry(.34,.2,.1),lam(0xfff3c0)); h.position.set(lx,.95,2.12); g.add(h);
      const t=new THREE.Mesh(new THREE.BoxGeometry(.34,.2,.1),lam(0xd63a2a)); t.position.set(lx,.95,-2.12); g.add(t);
    }
  }else{
    const body=new THREE.Mesh(new THREE.BoxGeometry(.52,.5,1.9),lam(color)); body.position.y=.82; g.add(body);
    const tank=new THREE.Mesh(new THREE.BoxGeometry(.46,.34,.7),lam(color)); tank.position.set(0,1.14,.15); g.add(tank);
    for(const wz of [.82,-.8]){
      const w=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.2,12),dark);
      w.rotation.z=Math.PI/2; w.position.set(0,.38,wz); g.add(w);
    }
    const rider=new THREE.Mesh(new THREE.BoxGeometry(.5,.8,.42),lam(0x37474f)); rider.position.set(0,1.62,-.28); g.add(rider);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.42,.42,.42),skin); head.position.set(0,2.2,-.28); g.add(head);
    const helm=new THREE.Mesh(new THREE.BoxGeometry(.5,.28,.5),lam(color)); helm.position.set(0,2.42,-.28); g.add(helm);
    const light=new THREE.Mesh(new THREE.BoxGeometry(.24,.24,.1),lam(0xfff3c0)); light.position.set(0,1.1,.96); g.add(light);
  }
  return g;
}
/* ============================================================
   🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
   สูตรเดียวกับโลกขับรถ (adventure3d รอบ 393) แต่ moto3d เป็นไฟล์แยก (adventure3d เป็น IIFE) จึงมี loader ของตัวเอง
   หน้ารถโมเดล = +Z ตรง convention แผนที่นี้พอดี (ไม่ต้องหมุน) · texture ย้อมตามคันจริง img/models/car_tex_NN.jpg
   av ส่ง 'carc05' (≤8 ตัว ผ่าน rules เดิม · client เก่าเทียบ av==='car' ไม่ตรง จะเห็นเป็นมอไซค์จน refresh)
   ============================================================ */
let mCarSrc=null, mCarFail=false; const mCarCbs=[], mCarMats={};
/* Tripo รวมล้อหน้าขวา+กันชนใน tripo_part_1 → ผ่า triangle แยกล้อ (ศูนย์ล้อเก็บเอง — Box3 เชื่อไม่ได้เพราะ position แชร์) */
function mCarSplitWheel(root){
  const p1=root.getObjectByName('tripo_part_1');
  if(!p1||!p1.geometry||!p1.geometry.index) return;
  const g=p1.geometry, idx=g.index.array, pos=g.attributes.position.array;
  const w=[], b=[];
  const mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9];
  for(let i=0;i<idx.length;i+=3){
    let cx=0,cz=0;
    for(let k=0;k<3;k++){ cx+=pos[idx[i+k]*3]; cz+=pos[idx[i+k]*3+2]; }
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
  g.setIndex(b);
}
function mCarEnsure(cb){
  if(mCarSrc) return cb(mCarSrc);
  if(mCarFail) return cb(null);
  mCarCbs.push(cb);
  if(mCarCbs.length>1) return;
  const fin=g=>{ mCarSrc=g||null; mCarFail=!g; mCarCbs.splice(0).forEach(f=>f(mCarSrc)); };
  const load=()=>{ try{
    new THREE.GLTFLoader().load('img/models/car_01.glb',gl=>{
      gl.scene.traverse(o=>{ if(o.isMesh&&o.material&&o.material.map) o.material.map.encoding=THREE.LinearEncoding; });
      mCarSplitWheel(gl.scene);
      fin(gl.scene);
    },undefined,()=>fin(null));
  }catch(e){ fin(null); } };
  if(THREE.GLTFLoader) load();
  else{ const s=document.createElement('script'); s.src='js/vendor/GLTFLoader.js';
    s.onload=load; s.onerror=()=>fin(null); document.head.appendChild(s); }
}
function mCarMat(cid){
  const mm=/^car_(\d\d)$/.exec(cid||''), nn=mm?mm[1]:'01';
  if(nn==='01') return null;                       // คันแดงฐานใช้ texture ฝังใน glb
  if(mCarMats[nn]) return mCarMats[nn];
  let base=null; mCarSrc.traverse(o=>{ if(!base&&o.isMesh) base=o.material; });
  if(!base) return null;
  const mat=base.clone();
  const tx=new THREE.TextureLoader().load('img/models/car_tex_'+nn+'.jpg');
  tx.flipY=false; tx.encoding=THREE.LinearEncoding;
  if(base.map){ tx.wrapS=base.map.wrapS; tx.wrapT=base.map.wrapT; }
  mat.map=tx;
  return mCarMats[nn]=mat;
}
function mCarBuild(cid){
  const g=new THREE.Group();
  g.userData.wheels=[]; g.userData.steerW=[];
  const root=mCarSrc.clone(true);
  const mat=mCarMat(cid);
  if(mat) root.traverse(o=>{ if(o.isMesh) o.material=mat; });
  root.updateMatrixWorld(true);
  const mkWheel=(name,steer)=>{
    const part=root.getObjectByName(name); if(!part) return;
    const hold=new THREE.Group();
    if(part.userData.wCtr) hold.position.copy(part.userData.wCtr);
    else hold.position.copy(new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()));
    const spin=new THREE.Group(); hold.add(spin); root.add(hold);
    root.updateMatrixWorld(true);
    spin.attach(part);
    g.userData.wheels.push(spin);
    if(steer) g.userData.steerW.push(hold);
  };
  mkWheel('tripo_part_2',true); mkWheel('car_wheel_fr',true);   // ล้อหน้า (โมเดลหน้า +Z อยู่แล้ว)
  mkWheel('tripo_part_3',false); mkWheel('tripo_part_5',false);
  const bb=new THREE.Box3().setFromObject(root);
  const s=4.4/(bb.max.z-bb.min.z);
  root.scale.setScalar(s);
  root.position.set(-(bb.min.x+bb.max.x)/2*s,-bb.min.y*s,-(bb.min.z+bb.max.z)/2*s);
  g.add(root);
  return g;
}
function mCarCode(){
  const c=(typeof myCar==='function')?myCar():null;
  const m=c&&/^car_(\d\d)$/.exec(c.id);
  return m?'c'+m[1]:'';
}

/* ============================================================
   🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
   field `av` ใช้เก็บ "ยานพาหนะที่ขับอยู่" ('moto'/'car') — เพื่อนเห็นตรงกับที่เราเลือกขับจริง
   (ยืมฟิลด์เดิมที่ rules รับอยู่แล้ว string ≤8 · เหลือแค่ต้องเพิ่ม map 'moto' ใน enum ของ rules)
   เขียนโดน deny (rules ยังไม่ publish) → ปิดการส่งเงียบๆ เกมเล่นคนเดียวต่อได้ปกติ
   ============================================================ */
function netReady(){
  return typeof Online!=='undefined' && Online.ready && Online.db
      && typeof Auth!=='undefined' && Auth.user && typeof onlineKey==='function' && typeof firebase!=='undefined';
}
function netJoin(){
  if(!netReady()) return;
  try{
    netOk=true; netAvOk=true;
    worldRef=Online.db.ref('world/moto');
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
  const payload={ n:((typeof onlineDisplayName==='function'&&onlineDisplayName())||(typeof state!=='undefined'&&state.playerName)||'ผู้เล่น'),
    x:Math.round(px*10)/10, z:Math.round(pz*10)/10, yaw:Math.round(yaw*100)/100,
    w:sessionWords, ts:firebase.database.ServerValue.TIMESTAMP };
  if(netAvOk) payload.av=vehicle==='car'?('car'+mCarCode()):vehicle;   // 🚗 รอบ 394: 'carc05' — เพื่อนเห็นรถโมเดลสีตรงคันเรา
  /* 💬 รอบ 318: แนบข้อความลอยหัวระหว่างยังสด (ct คงที่ต่อข้อความ — ฝั่งรับใช้แยกข้อความใหม่/เก่า) */
  if(myChat && Date.now()-myChat.ts<CHAT_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  myRef.set(payload).catch(()=>{
    if(payload.av!==undefined){ netAvOk=false; delete payload.av; myRef.set(payload).catch(()=>{ netOk=false; }); }
    else netOk=false;
  });
}
/* 💬 ส่งข้อความสำเร็จรูป (ไม่ใช่ช่องพิมพ์ → ไม่มีคำหยาบให้กรอง) + โชว์ของตัวเองมุมล่างจอ */
function sendChat(text){
  myChat={text:String(text).slice(0,60), ts:Date.now()};
  netSend(true);
  if(selfMsgEl){
    selfMsgEl.textContent='💬 '+myChat.text; selfMsgEl.classList.add('on');
    clearTimeout(selfMsgEl._tm); selfMsgEl._tm=setTimeout(()=>selfMsgEl.classList.remove('on'),CHAT_MS);
  }
  if(typeof sfx!=='undefined') sfx.select();
}
/* 💬 ป้ายคำพูดลอยเหนือหัวเพื่อน (สไปรต์ข้อความ ลบตัวเองใน 5 วิ) */
function showPeerBubble(p,text){
  removePeerBubble(p);
  const sp=makeTextSprite(String(text).slice(0,40),'rgba(255,255,255,.94)','#12283f','💬');
  sp.scale.set(9,2.25,1); sp.position.y=(p.kind==='car'?4.1:4.3);
  p.grp.add(sp); p.bubble=sp;
  p.bubbleTm=setTimeout(()=>removePeerBubble(p),CHAT_MS);
}
function removePeerBubble(p){
  if(p.bubbleTm){ clearTimeout(p.bubbleTm); p.bubbleTm=0; }
  if(p.bubble){ if(p.bubble.parent) p.bubble.parent.remove(p.bubble);
    if(p.bubble.material.map) p.bubble.material.map.dispose();
    p.bubble.material.dispose(); p.bubble=null; }
}
/* 🏆 กระดานคะแนนสด — เรา + เพื่อนในแผนที่ เรียงตามจำนวนคำที่ประกอบได้รอบนี้ */
function renderBoard(){
  if(!boardEl) return;
  const uids=Object.keys(peers);
  if(!uids.length){ boardEl.classList.remove('on'); boardSig=''; return; }
  const myName=(typeof onlineDisplayName==='function'&&onlineDisplayName())||(typeof state!=='undefined'&&state.playerName)||'ฉัน';
  const me={n:myName,w:sessionWords,me:true,v:vehicle};
  const rows=uids.map(u=>({n:peers[u].n,w:peers[u].w||0,me:false,v:peers[u].kind}))
    .concat([me]).sort((a,b)=>b.w-a.w).slice(0,5);
  const sig=rows.map(r=>r.n+':'+r.w+':'+r.v).join('|');
  if(sig===boardSig){ boardEl.classList.add('on'); return; }
  boardSig=sig;
  boardEl.innerHTML='<div class="m-bd-h">🏆 คำที่เก็บได้รอบนี้</div>'+rows.map((r,i)=>
    `<div class="m-bd-r${r.me?' me':''}"><span>${i===0?'🥇':i===1?'🥈':i===2?'🥉':'　'}</span>`+
    `<span class="m-bd-n">${r.v==='car'?'🚗':'🏍️'} ${escapeHTML(r.n)}</span>`+
    `<span class="m-bd-w">${r.w}</span></div>`).join('');
  boardEl.classList.add('on');
}
function peerColor(uid){
  let h=0; for(let i=0;i<uid.length;i++) h=(h*31+uid.charCodeAt(i))>>>0;
  return PEER_COLORS[h%PEER_COLORS.length];
}
function buildPeer(uid,p,kind,cid){
  if(p.grp){ scene.remove(p.grp); }
  p.grp=new THREE.Group();
  // 🚗 รอบ 394: เพื่อนขับรถยนต์ = โมเดล GLB สีตรงคันเขา (โหลดไม่ทัน → รถกล่องก่อน แล้วสลับ)
  if(kind==='car'&&mCarSrc) p.grp.add(mCarBuild(cid||'car_01'));
  else{
    p.grp.add(makeVehicle(kind,peerColor(uid)));
    if(kind==='car'){
      const grp=p.grp;
      mCarEnsure(src=>{
        if(!src||p.grp!==grp||p.kind!=='car') return;
        grp.remove(grp.children[0]);
        grp.add(mCarBuild(cid||'car_01'));
      });
    }
  }
  const nm=makeTextSprite(p.n,'rgba(16,26,44,.82)','#ffffff',kind==='car'?'🚗':'🏍️');
  nm.scale.set(8,2,1); nm.position.y=kind==='car'?3.2:3.4; p.grp.add(nm);
  p.grp.position.set(p.cur.x,0,p.cur.z); p.grp.rotation.y=p.yawCur;
  scene.add(p.grp); p.kind=kind; p.cid=cid||null;
}
function onPeer(snap){
  const uid=snap.key;
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  const d=snap.val()||{};
  if(typeof d.x!=='number'||typeof d.z!=='number') return;
  // 🚗 รอบ 394: av 'carc05' = รถยนต์+รุ่นรถ (ของเดิม 'car' เฉยๆ ก็ยังรองรับ)
  const av=String(d.av||'');
  const kind=av.slice(0,3)==='car'?'car':'moto';
  const cidm=/^carc(\d\d)$/.exec(av), cid=cidm?'car_'+cidm[1]:null;
  let p=peers[uid];
  if(!p){
    p=peers[uid]={grp:null,kind:'',cur:{x:d.x,z:d.z},tgt:{x:d.x,z:d.z},
                  yawCur:(typeof d.yaw==='number'?d.yaw:0),yawTgt:(typeof d.yaw==='number'?d.yaw:0),
                  n:String(d.n||'เพื่อน').slice(0,24)};
    buildPeer(uid,p,kind,cid);
    if(banEl){
      banEl.innerHTML=`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> มาขับ${kind==='car'?'รถยนต์ 🚗':'มอเตอร์ไซค์ 🏍️'}ด้วย!`;
      banEl.classList.add('show'); setTimeout(()=>banEl.classList.remove('show'),1900);
    }
  }else if(p.kind!==kind||p.cid!==(cid||null)){ if(p.bubble) removePeerBubble(p); buildPeer(uid,p,kind,cid); }   // สลับพาหนะ/เปลี่ยนคันกลางทาง → เปลี่ยนโมเดล
  p.tgt={x:d.x,z:d.z};
  if(typeof d.yaw==='number') p.yawTgt=d.yaw;
  /* 🏆 คะแนน (จำนวนคำรอบนี้) เปลี่ยน → วาดกระดานใหม่ */
  const w=typeof d.w==='number'?d.w:0;
  if(p.w!==w){ p.w=w; }
  renderBoard();
  /* 💬 ct เปลี่ยน = ข้อความใหม่ (ct คงที่ต่อข้อความ ฝั่งส่งแนบซ้ำได้ไม่เด้งซ้ำ) */
  if(typeof d.ct==='number' && typeof d.c==='string' && d.c && p.lastCt!==d.ct){
    p.lastCt=d.ct; showPeerBubble(p,d.c);
  }
}
function dropPeer(uid){
  const p=peers[uid]; if(!p) return;
  removePeerBubble(p);
  if(p.grp) scene.remove(p.grp);
  delete peers[uid];
  renderBoard();
}
function netLeave(){
  if(worldRef){ worldRef.off('child_added'); worldRef.off('child_changed'); worldRef.off('child_removed'); }
  if(myRef){ try{ myRef.remove().catch(()=>{}); }catch(e){} }
  Object.keys(peers).forEach(dropPeer);
  worldRef=null; myRef=null;
}
function peerTick(dt){
  const k=Math.min(1,dt*6);
  for(const uid in peers){
    const p=peers[uid]; if(!p.grp) continue;
    p.cur.x+=(p.tgt.x-p.cur.x)*k; p.cur.z+=(p.tgt.z-p.cur.z)*k;
    let dy=p.yawTgt-p.yawCur; dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;   // เลี้ยวทางสั้น กันสะบัดตอนข้าม ±π
    p.yawCur+=dy*k;
    p.grp.position.set(p.cur.x,0,p.cur.z); p.grp.rotation.y=p.yawCur;
    // 🚗 รอบ 394: รถ GLB ของเพื่อน — ล้อหมุนตามระยะจริง + ล้อหน้าหักตามการเลี้ยว (ย้อน bicycle model จาก yaw rate)
    const cu=p.grp.children[0]&&p.grp.children[0].userData;
    if(cu&&cu.steerW&&cu.steerW.length){
      const moved=Math.hypot(p.tgt.x-p.cur.x,p.tgt.z-p.cur.z)*k;
      cu.wheels.forEach(w=>{ w.rotation.x+=moved/.5; });          // หน้ารถ +Z → หมุนไปข้างหน้า = แกน x บวก
      const pv=moved/Math.max(dt,.001);
      const st=pv>1.2?Math.max(-.5,Math.min(.5,Math.atan((dy*k/Math.max(dt,.001))*2.6/pv))):0;
      p.stV=(p.stV||0)+(st-(p.stV||0))*Math.min(1,dt*7);
      cu.steerW.forEach(h=>{ h.rotation.y=p.stV; });
    }
  }
}
/* 🅿️ จุดเกิดหน้าโรงเรียน — เกิดใกล้กันแต่ห้ามซ้อนทับ (ไล่ช่องถอยหลังตามแนวถนน สลับซ้าย/ขวาเลน) */
function spawnSlot(){
  const fx=Math.sin(startYaw), fz=Math.cos(startYaw);        // ทิศถนน
  const rx=Math.cos(startYaw), rz=-Math.sin(startYaw);       // ด้านขวาของถนน
  const busy=(x,z)=>Object.keys(peers).some(u=>Math.hypot(peers[u].cur.x-x,peers[u].cur.z-z)<SPAWN_FREE_R);
  const slots=[[0,0]];
  for(let i=1;i<=8;i++) slots.push([-i*SPAWN_GAP,(i%2?1.6:-1.6)]);
  for(const [d,s] of slots){
    const x=startX+fx*d+rx*s, z=startZ+fz*d+rz*s;
    if(!busy(x,z)) return {x,z};
  }
  const d=-(SPAWN_GAP*9+Math.random()*60);
  return {x:startX+fx*d, z:startZ+fz*d};
}

/* ============================================================
   คำศัพท์ + ตัวอักษรบนถนน
   ============================================================ */
function pickWord(){
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  let pool=vocabForStudent().filter(([en])=>/^[a-z]{2,9}$/i.test(en))
    .filter(([en])=>!state[DONE_KEY].includes(en.toLowerCase()));
  if(!pool.length){ state[DONE_KEY]=[]; saveState(); pool=vocabForStudent().filter(([en])=>/^[a-z]{2,9}$/i.test(en)); }
  const [en,th]=pool[Math.floor(Math.random()*pool.length)];
  word={en:en.toLowerCase(), th, got:[]};
  spawnLetters();
  renderWordHud();
}
function spawnLetters(){
  letters.forEach(l=>{ scene.remove(l.spr); });
  letters=[];
  clearCoins(); specialDone=false; cleanWord=true;             // 🪙 รอบ 319: เหรียญคำก่อนออกหมด · 🍀 รอบ 340: เริ่มนับ "ไม่ชนเลย" ใหม่
  word.en.split('').forEach((ch,i)=>{
    const p=randomRoadPoint(px,pz,SPAWN_MIN,SPAWN_MAX)||{x:px+30+i*20,z:pz+30,fx:0,fz:1};
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
    spr.scale.set(4.6,4.6,1); spr.position.set(p.x,2.3,p.z);   // รอบ 314: ตัวใหญ่ขึ้น 3→4.6 + ยกสูงให้เห็นชัด
    scene.add(spr);
    const l={ch,idx:i,spr,fx:(p.fx||0),fz:(p.fz===undefined?1:p.fz)};
    letters.push(l);
    addCoin(l,0,+1);                                           // 🪙 เหรียญทองด้านหลังตัวอักษร ตัวละ 1 เหรียญ
  });
  placeSpecialCoin();                                          // (คำ 1 ตัวอักษร — กันไว้)
}
function renderWordHud(){
  if(!word) return;
  const chips=word.en.split('').map((ch,i)=>
    `<span class="m-chip${word.got.includes(i)?' got':''}">${ch.toUpperCase()}</span>`).join('');
  wordEl.innerHTML=`<div class="m-chips">${chips}</div><span class="m-th">${escapeHTML(word.th)}</span>`;
  fitWord();
}
/* 🔤 รอบ 311: ย่อป้ายคำอัตโนมัติถ้ากว้างเกินจอ — ตัวอักษรคงแถวเดียวเสมอ (คำยาวก็ไม่ตกบรรทัด) */
function fitWord(){
  if(!wordEl||!screenEl) return;
  wordEl.style.transform='translateX(-50%) scale(1)';
  const avail=screenEl.clientWidth*0.96, w=wordEl.offsetWidth;
  const k=w>avail?avail/w:1;
  wordEl.style.transform='translateX(-50%) scale('+k.toFixed(3)+')';
}
function collectTick(){
  for(let i=letters.length-1;i>=0;i--){
    const l=letters[i];
    if(Math.hypot(l.spr.position.x-px,l.spr.position.z-pz)<COLLECT_R){
      word.got.push(l.idx);
      scene.remove(l.spr); letters.splice(i,1);
      /* 🪙 รอบ 317: เก็บตัวอักษร = แถม 🪙1 ทันที + เสียง/ภาพชัด (ผู้ใช้ขอเพิ่มแรงจูงใจ) */
      if(typeof addCoins==='function') addCoins(LETTER_COIN);
      sessionCoins+=LETTER_COIN;
      if(coinsEl) coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
      coinFx(l.ch.toUpperCase()+'  +'+LETTER_COIN+' 🪙',true);
      if(typeof sfx!=='undefined'){ sfx.select(); if(sfx.coin) setTimeout(()=>sfx.coin(),80); }
      if(state.haptic!==false && navigator.vibrate) navigator.vibrate(30);
      renderWordHud();
      placeSpecialCoin();                       // 💎 รอบ 319: เหลือตัวสุดท้าย → วางเหรียญพิเศษไว้ "ด้านหน้า" ตัวนั้น
      if(!letters.length) completeWord();
    }
  }
}
function completeWord(){
  const w=word;
  state[DONE_KEY].push(w.en);
  addCoins(REWARD); sessionCoins+=REWARD; sessionWords++;
  coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
  renderBoard(); netSend(true);                       // 🏆 รอบ 318: คะแนนเราขึ้น → กระดานทุกเครื่องเห็นทันที
  if(typeof questEvent==='function') questEvent('word3d');
  if(typeof vbRecord==='function') vbRecord(w.en,w.th,true);
  if(typeof sfx!=='undefined') sfx.levelup();
  setTimeout(()=>{ if(typeof speakWord==='function') speakWord(w.en); },700);
  const clean=cleanWord;                              // 🍀 จำไว้ก่อน spawnLetters ของคำใหม่จะรีเซ็ต
  banEl.innerHTML=`🎉 ${escapeHTML(w.en.toUpperCase())} = ${escapeHTML(w.th)}<br><span class="m-coin">+${REWARD} 🪙</span>`
    +(clean?`<br><span class="m-coin" style="color:#7dffb0">🍀 ไม่ชนเลย! เหรียญมรกตโผล่ข้างหน้า</span>`:'');
  banEl.classList.add('show');
  setTimeout(()=>banEl.classList.remove('show'),2200);
  // 🍀 รางวัลขับสะอาด: วางเหรียญมรกตบนถนนข้างหน้าให้ไปเก็บ (รอให้คำใหม่ spawn เสร็จก่อน ไม่งั้นโดนล้าง)
  if(clean) setTimeout(()=>{
    if(!running) return;
    const p=randomRoadPoint(px,pz,28,60);
    if(p) addFreeCoin(EMERALD_TIER,p.x,p.z);
  },900);
  saveState();
  word=null;
  setTimeout(()=>{ if(running) pickWord(); },1400);
}
function relocTick(now){
  if(now-relocAt<2500) return; relocAt=now;
  letters.forEach(l=>{
    if(Math.hypot(l.spr.position.x-px,l.spr.position.z-pz)>RELOC_D){
      const p=randomRoadPoint(px,pz,SPAWN_MIN,SPAWN_MAX);
      if(!p) return;
      l.spr.position.set(p.x,2.3,p.z);
      l.fx=(p.fx||0); l.fz=(p.fz===undefined?1:p.fz);
      /* 🪙 รอบ 319: เหรียญของตัวอักษรนี้ย้ายตามไปด้วย (คงหน้า/หลังเดิม) */
      coins.forEach(c=>{ if(c.l && c.l===l) c.spr.position.set(p.x+l.fx*COIN_GAP*c.side, COIN_TIERS[c.tier].y, p.z+l.fz*COIN_GAP*c.side); });
    }
  });
}

/* ---------- GPS ลูกศร + มินิแมพ ---------- */
function gpsTick(){
  let best=null,bd=1e18;
  letters.forEach(l=>{ const d=Math.hypot(l.spr.position.x-px,l.spr.position.z-pz); if(d<bd){bd=d;best=l;} });
  if(!best){ gpsDist.textContent='--'; return; }
  /* 🧭 รอบ 312: ลูกศรชี้ทิศตัวอักษรบนจอ (SVG ชี้ขึ้น=ข้างหน้า) — rel=บ่ายเป้า−ทิศรถ · หมุนตามเข็ม */
  const rel=Math.atan2(best.spr.position.x-px, best.spr.position.z-pz)-yaw;
  gpsArr.style.transform='rotate('+(rel*180/Math.PI).toFixed(1)+'deg)';
  gpsDist.textContent=bd>=1000?(bd/1000).toFixed(1)+' กม.':Math.round(bd)+' ม.';
}
function miniTick(){
  const c=miniCtx, W=miniCv.width, R=W/2, SCALE=R/420;   // รัศมี 420ม.
  c.clearRect(0,0,W,W);
  c.save(); c.beginPath(); c.arc(R,R,R-3,0,7); c.clip();
  c.strokeStyle='rgba(190,205,225,.8)'; c.lineWidth=2.2; c.lineCap='round';
  const bx0=Math.floor((px-420)/BUCKET), bx1=Math.floor((px+420)/BUCKET);
  const bz0=Math.floor((pz-420)/BUCKET), bz1=Math.floor((pz+420)/BUCKET);
  const seen=new Set();
  c.beginPath();
  for(let bx=bx0;bx<=bx1;bx++)for(let bz=bz0;bz<=bz1;bz++){
    const arr=buckets.get(segKey(bx,bz)); if(!arr) continue;
    for(const si of arr){
      if(seen.has(si)) continue; seen.add(si);
      const s=segs[si];
      c.moveTo(R+(s.ax-px)*SCALE, R+(s.az-pz)*SCALE);
      c.lineTo(R+(s.bx-px)*SCALE, R+(s.bz-pz)*SCALE);
    }
  }
  c.stroke();
  /* ตัวอักษร = จุดทอง */
  c.fillStyle='#ffd54f';
  letters.forEach(l=>{
    const x=R+(l.spr.position.x-px)*SCALE, y=R+(l.spr.position.z-pz)*SCALE;
    if(x>4&&x<W-4&&y>4&&y<W-4){ c.beginPath(); c.arc(x,y,4,0,7); c.fill(); }
  });
  /* รถ = สามเหลี่ยมเขียวกลางจอ หมุนตาม yaw */
  c.translate(R,R); c.rotate(-yaw+Math.PI);
  c.fillStyle='#5ef08a'; c.beginPath();
  c.moveTo(0,-7); c.lineTo(5,6); c.lineTo(-5,6); c.closePath(); c.fill();
  c.restore();
}

/* ============================================================
   สร้างโลกครั้งเดียว + ลูปเกม
   ============================================================ */
function build(){
  buildDom();
  renderer=new THREE.WebGLRenderer({canvas:cvEl,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  scene=new THREE.Scene();
  /* 🌤️ รอบ 302: ท้องฟ้าภาพจริง (sky.webp) ครอบโดมครึ่งทรงกลม · fog จูนเป็นสีขอบฟ้าในภาพ (ขาวฟ้าอ่อน) ให้พื้นจางกลืนเข้าขอบฟ้า */
  scene.background=new THREE.Color(0xcfe8f8);
  scene.fog=new THREE.Fog(0xcfe8f8,220,950);
  const skyTex=new THREE.TextureLoader().load('img/moterbike/sky.webp');
  skyTex.wrapS=THREE.MirroredRepeatWrapping; skyTex.repeat.x=2;   // ขอบซ้าย-ขวาภาพไม่ seamless → mirror 2 รอบโดม เนียนไม่มีรอยชน
  skyDome=new THREE.Mesh(new THREE.SphereGeometry(1400,48,20,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide,fog:false}));
  scene.add(skyDome);
  camera=new THREE.PerspectiveCamera(62,16/9,.4,1600);   // near .4 เพิ่มความละเอียด depth ระยะไกล (กันถนนกะพริบ)
  scene.add(new THREE.AmbientLight(0xffffff,.75));
  const sun=new THREE.DirectionalLight(0xfff4d6,.85); sun.position.set(.4,1,.6); scene.add(sun);
  /* จุดสตาร์ท = จุดบนถนนที่ใกล้โรงเรียน (0,0) ที่สุด */
  buildRoads();
  let bd=1e18,bs=null;
  segs.forEach(s=>{ const d=distToSeg(0,0,s); if(d<bd){ bd=d; bs=s; } });
  if(bs){
    const dx=bs.bx-bs.ax, dz=bs.bz-bs.az, L2=dx*dx+dz*dz;
    let t=L2?((0-bs.ax)*dx+(0-bs.az)*dz)/L2:0; t=Math.max(0,Math.min(1,t));
    startX=bs.ax+dx*t; startZ=bs.az+dz*t;
    startYaw=Math.atan2(dx,dz);
  }
  buildScenery();
  dog={grp:makeDog(),vx:0,vz:0,life:0,hit:false};   // 🐕 รอบ 312: สร้างหมาครั้งเดียว รีไซเคิลตลอด
  makeDecals();                                     // 🖼️ รอบ 316: pool ภาพหลุม/เนิน
  makeCoins();                                      // 🪙 รอบ 317: pool เหรียญบนถนน
  selfCar=makeVehicle('car',0xe53935); selfCar.visible=false; scene.add(selfCar);   // 🚗 รอบ 317: รถของเราเอง (โชว์เฉพาะโหมด car)
  built=true;
}
/* 🚗🏍️ รอบ 317: สลับหน้าตาเครื่องเกมตามยานพาหนะที่เข้ามาเล่น */
function applyVehicleUi(){
  const car=vehicle==='car';
  if(bikeEl) bikeEl.style.display=car?'none':'';
  if(shadowEl) shadowEl.style.display=car?'none':'';
  if(selfCar) selfCar.visible=car;
  const ico=thrEl&&thrEl.querySelector('.m-ico'); if(ico) ico.textContent=car?'🚗':'🏍️';
  const h3=wrapEl.querySelector('#moto-intro h3'), p=wrapEl.querySelector('#moto-intro p');
  if(h3) h3.textContent=car?'🚗 ขับรถยนต์ที่บ้านโพธิ์สวัสดิ์':'🏍️ มอเตอร์ไซค์บ้านโพธิ์สวัสดิ์';
  if(p) p.innerHTML=(car
    ? `เอารถของคุณมาวิ่ง<b>ถนนจริงรอบโรงเรียนบ้านโพธิ์สวัสดิ์</b> — ออกรถหน้าโรงเรียนพร้อมเพื่อนๆ!<br>`
    : `ออกตัวหน้า<b>โรงเรียนบ้านโพธิ์สวัสดิ์</b> — ถนนจริงรอบหมู่บ้าน รัศมี 30 กม.!<br>`)
    + `🟠 สไลเดอร์ส้มซ้าย = ${car?'พวงมาลัย':'เอียงรถเลี้ยว'} <b>ค้างตำแหน่งที่ตั้งไว้</b> (เลื่อนกลับกลาง = วิ่งตรง) · 🔵 ปุ่มฟ้าขวา = เร่งเครื่อง (กดค้าง)<br>`
    + `ขับชน<b>ตัวอักษร</b>บนถนนให้ครบคำ = 🪙${REWARD} · <b>ตัวอักษรละแถม 🪙${LETTER_COIN}</b><br>`
    + `<b>★ เหรียญทอง 🪙${COIN_TIERS[0].val}</b> วางอยู่<b>ด้านหลังตัวอักษรทุกตัว</b> (ตัวละ 1 เหรียญ)<br>`
    + `<b>◆ ${COIN_TIERS[1].val} / 💎 ${COIN_TIERS[2].val} เหรียญพิเศษ</b> โผล่<b>ด้านหน้าตัวอักษรตัวสุดท้าย</b>ของคำ — เก็บให้ครบก่อนจบคำ!<br>`
    + `<small>⏻ ปุ่มแดงบนเครื่อง = ปิดเครื่องกลับล็อบบี้ · คีย์บอร์ด: W เร่ง · A/D เลี้ยว<br>`
    + `🧑‍🤝‍🧑 เห็นเพื่อนในแผนที่เดียวกันแบบสด · 🏆 กระดานคะแนนมุมขวา · 💬 ปุ่มซ้ายล่างส่งข้อความหาเพื่อน</small>`;
}
function fit(){
  if(!renderer) return;
  const r=screenEl.getBoundingClientRect();
  const w=Math.max(64,Math.round(r.width)), h=Math.max(64,Math.round(r.height));
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
  fitWord();                         // 🔤 รอบ 311: จอเปลี่ยนขนาด → ย่อป้ายคำใหม่ให้พอดี
}
function tick(){
  if(!running) return;
  rafId=requestAnimationFrame(tick);
  const now=performance.now();
  let dt=(now-lastT)/1000; lastT=now;
  if(dt>0.05) dt=0.05;
  frame(dt,now);
}
function frame(dt,now){
  /* คีย์บอร์ด A/D = ค่อยๆ ปรับองศาเอียง (ปล่อยคีย์ = ค้างองศาเดิม เหมือนสไลเดอร์) */
  if(kL!==kR){
    steerCtl=Math.max(-1,Math.min(1, steerCtl+(kR?1:-1)*1.0*dt));   // รอบ 298: คีย์ปรับช้าลง
    knobEl.style.left=(50+steerCtl*26)+'%';
  }
  steer=steerCtl;
  thr=(padThr||kThr)?1:0;
  if(thrEl){
    thrEl.classList.toggle('pressing',!!thr);           // 🔘 รอบ 308: ปุ่มเร่งยุบ/เด้งตามการกดจริง (แตะ+คีย์ W)
    throttleCharge=thr?Math.min(1,throttleCharge+dt/1.4):Math.max(0,throttleCharge-dt*3);  // 💡 รอบ 309: กดค้าง 1.4วิ เต็ม · ปล่อยคายเร็ว
    thrEl.style.setProperty('--charge',throttleCharge.toFixed(2));
    thrEl.classList.toggle('charged',throttleCharge>=1);
  }
  const road=onRoad(px,pz);
  const vmax=road?VMAX:VMAX_OFF;
  if(thr){ spd+=ACCEL*dt; } else { spd-=DECEL*dt; }
  if(spd>vmax) spd=Math.max(vmax,spd-14*dt);   // ออกนอกถนน = หน่วงแรง
  if(spd<0) spd=0;
  /* เลี้ยว: ต้องมีความเร็ว · วงเลี้ยวแคบตอนช้า (รอบ 298: ลดตัวคูณ 1.5→0.85 — ผู้ใช้บอกไวไป) */
  const yr=steer*Math.min(spd,14)/(6.5+spd*0.42);
  yaw-=yr*dt*0.85;
  px+=Math.sin(yaw)*spd*dt; pz+=Math.cos(yaw)*spd*dt;
  /* 🧱 รอบ 301: กำแพงขอบถนน — เกินขอบ (เผื่อ EDGE_M) ดันกลับเข้าถนน + ครูดขอบความเร็วลดนิดๆ */
  const info=roadInfo(px,pz);
  if(info.seg){
    const s=info.seg, sdx=s.bx-s.ax, sdz=s.bz-s.az, L2=sdx*sdx+sdz*sdz;
    let t=L2?((px-s.ax)*sdx+(pz-s.az)*sdz)/L2:0; t=Math.max(0,Math.min(1,t));
    const cx2=s.ax+sdx*t, cz2=s.az+sdz*t;
    const ex=px-cx2, ez=pz-cz2, ed=Math.hypot(ex,ez), lim=s.hw-EDGE_M;
    if(ed>lim){
      const f=lim/(ed||1e-6);
      px=cx2+ex*f; pz=cz2+ez*f;
      spd*=Math.max(0,1-1.5*dt);
    }
  }
  /* 🕳️⛰️ รอบ 315: ฟิสิกส์แนวดิ่ง — ตกหลุม/ขึ้นเนิน/เหิน/ลงพื้นสปริง
     groundY = ความสูงถนนตรงจุดรถ (แนวกลาง) · เหินเมื่อพื้นหล่นเร็วกว่าแรงโน้มถ่วง (สันเนิน/ขอบหลุม) */
  const fwdX=Math.sin(yaw), fwdZ=Math.cos(yaw);
  const groundY=roadGroundY(px,pz);
  const groundNext=roadGroundY(px+fwdX*spd*dt, pz+fwdZ*spd*dt);
  let followVY=dt>0?(groundNext-groundY)/dt:0;
  if(followVY>18) followVY=18; else if(followVY<-18) followVY=-18;   // กัน spike จาก sample เฟรมเดียว
  if(airborne){
    bikeVY-=GRAV*dt; bikeY+=bikeVY*dt;
    if(bikeY<=groundY){                        // แตะพื้น
      const impact=-bikeVY;
      bikeY=groundY; airborne=false; bikeVY=0;
      if(impact>IMPACT_MIN){
        suspV-=Math.min(impact,LAUNCH_VMAX)*SUSP_KICK;   // เตะโช้กยุบลง (สปริงยวบ)
        if(impact>HARD_LAND) cleanWord=false;            // 🍀 ลงพื้นแรงมาก = ถือว่าชน อดเหรียญมรกต
        if(typeof Eng!=='undefined'&&Eng.thud) Eng.thud(Math.min(.85,impact*0.07));
        if((typeof state==='undefined'||state.haptic!==false)&&navigator.vibrate) navigator.vibrate(Math.min(60,impact*7|0));
      }
    }
  } else {
    bikeY=groundY;
    if(spd>LAUNCH_SPD && followVY<prevFollowVY-GRAV*dt){   // พื้นหล่นเร็วเกินตามทัน → ลอย
      airborne=true; bikeVY=Math.min(prevFollowVY,LAUNCH_VMAX);   // เพดานความเร็วเหิน (สูงสุด ~1.8m)
    }
    prevFollowVY=followVY;
  }
  suspV+=(-SUSP_K*suspY - SUSP_D*suspV)*dt; suspY+=suspV*dt;   // สปริงโช้กคืนตัว (damped)
  /* 🏍️ เอียงเข้าโค้ง (รอบ 294) + รอบ 297: องศาเอียง = ค่าที่ผู้เล่นตั้งตรงๆ ไม่ผูกความเร็ว ไม่คืนกลางเอง
     เลี้ยวขวา (steer=+1) → มองจากท้ายรถ ตัวรถเทไปทางขวา = หมุนภาพตามเข็ม (องศาบวก) */
  const leanTgt=steer*(vehicle==='car'?0.16:LEAN_MAX);   // 🚗 รอบ 317: รถยนต์เอียงแค่โคลงตัวถัง ไม่เทเข้าโค้งเหมือนมอไซค์
  lean+=(leanTgt-lean)*(1-Math.exp(-3.5*dt)); // รอบ 301: เลิกสปริง (เด้งแบบตุ๊กตาหัวโยก ผู้ใช้ไม่เอา) → ไล่เข้าเป้าหนืดนิ่งแบบ Ride 4 ไม่ overshoot
  /* 🚗 รอบ 317: โหมดรถยนต์ — รถ 3D จริงวิ่งอยู่หน้ากล้อง (แทนสไปรต์มอไซค์ DOM) */
  if(vehicle==='car'&&selfCar){
    selfCar.position.set(px,bikeY+suspY*.4,pz);
    selfCar.rotation.order='YZX';
    selfCar.rotation.y=yaw; selfCar.rotation.z=-lean;
    // 🚗 รอบ 394: รถ GLB ของเรา — ล้อหน้าหักตามสไลเดอร์พวงมาลัยจริง + ล้อหมุนตามความเร็ว
    if(selfCar.userData&&selfCar.userData.steerW){
      selfCar.userData.steerW.forEach(h=>{ h.rotation.y=-steer*.42; });   // steer>0=ขวา → yaw ลด → ล้อเบนทางเดียวกับหัวรถ
      selfCar.userData.wheels.forEach(w=>{ w.rotation.x+=spd*dt/.5; });
    }
  }
  if(bikeEl&&vehicle!=='car'){
    /* สปริงยวบ: suspY<0 = ยุบ → บีบแนวตั้ง (transform-origin ล่าง ล้อติดพื้น) · airborne = ยืดเล็กน้อย */
    const sq=airborne?0.07:Math.max(-0.3,Math.min(0.07,suspY*0.26));
    bikeEl.style.transform='translateX(-50%) rotate('+(lean*57.296).toFixed(1)+'deg) scaleY('+(1+sq).toFixed(3)+')';
    /* 🟠 รอบ 300: ไฟเลี้ยวกะพริบตามทิศที่ตั้งเอียง (เกิน ±0.12 = ถือว่ากำลังเลี้ยว) */
    const sig=steerCtl<-0.12?'l':steerCtl>0.12?'r':'';
    if(sig!==_sigCur){
      _sigCur=sig;
      bikeEl.classList.toggle('sig-l',sig==='l');
      bikeEl.classList.toggle('sig-r',sig==='r');
    }
  }
  /* กล้อง third-person ตามหลังนุ่มๆ (ภาพมอไซค์เป็นสไปรต์หน้าจอ — กล้องคือสายตาคนขี่ตามหลัง)
     รอบ 315: บวก bikeY (เหิน/ตกหลุมเห็นจริง) + suspY*.5 (ยวบตอนลง) เข้ากับความสูงกล้อง */
  const cd=vehicle==='car'?8.4:6.2, ch=vehicle==='car'?3.2:2.6;   // 🚗 รถยนต์ตัวใหญ่กว่า → ถอยกล้องออก+ยกสูงนิด
  const tx=px-Math.sin(yaw)*cd, tz=pz-Math.cos(yaw)*cd;
  if(!camInit){ camX=tx; camY=ch; camZ=tz; camInit=true; }
  const k=1-Math.exp(-5.5*dt);
  camX+=(tx-camX)*k; camZ+=(tz-camZ)*k; camY+=(ch-camY)*k;
  camera.position.set(camX, camY+bikeY+suspY*0.5, camZ);
  camera.lookAt(px+Math.sin(yaw)*4, 1.4+bikeY+suspY*0.5, pz+Math.cos(yaw)*4);
  camera.rotateZ(lean*.3);           // ขอบฟ้าเอียงสวนเล็กน้อย เพิ่มฟีลเทโค้ง
  if(skyDome) skyDome.position.set(px,0,pz);   // โดมฟ้าตามผู้เล่น (รัศมี 1400 < far 1600)
  /* เกม */
  collectTick(); relocTick(now); dogTick(dt,now); coinTick(dt,now); gpsTick(); miniTick();
  peerTick(dt); netSend(false);                       // 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน
  /* 🅿️ เช็กจุดเกิดซ้ำอีกรอบหลังรู้จักเพื่อนครบ (~1.2 วิ) — ถ้ายังไม่ออกรถแล้วมีคนทับ ขยับไปช่องว่าง */
  if(spawnFixAt && now>spawnFixAt){
    spawnFixAt=0;
    if(spd<0.5){ const s=spawnSlot(); px=s.x; pz=s.z; camInit=false; }
  }
  if(now-decoAt>1000){ decoAt=now; scatterTrees(false); scatterClouds(false); postTick(); }
  if(now-decalAt>450){ decalAt=now; decalTick(); }   // 🖼️ รอบ 316: อัปเดตภาพหลุม/เนินรอบผู้เล่น
  /* 🌑 เงาใต้ล้อ: เอียงรถ = เงาขยับตามทิศเอียงนิด + แคบลง · รอบ 315: เหินสูง = เงาเล็ก+จาง */
  if(shadowEl&&vehicle!=='car'){
    const air=Math.max(0,bikeY);
    shadowEl.style.transform='translateX('+(-50+lean*14).toFixed(1)+'%) scale('+((1-Math.abs(lean)*.3)/(1+air*0.25)).toFixed(2)+')';
    shadowEl.style.opacity=(1/(1+air*0.5)).toFixed(2);
  }
  /* 🛞 ล้อหมุน: ลายวิ่งลงเร็วตาม spd (period 22px) · จอด=โปร่งใสเห็นดอกยางนิ่งจากภาพ */
  if(wheelEl&&vehicle!=='car'){
    wheelOff=(wheelOff+spd*dt*90)%22;
    wheelEl.style.backgroundPosition='0 '+wheelOff.toFixed(1)+'px';
    wheelEl.style.opacity=Math.min(.8,spd*.05).toFixed(2);
  }
  /* 💨 ควันท่อ: บิดคันเร่ง = พ่นก้อนควันสลับท่อซ้าย/ขวาทุก 90ms (ลบตัวเองใน 850ms · สูงสุด ~9 ก้อน) */
  if(thr&&bikeEl&&vehicle!=='car'){
    smokeAcc+=dt;
    if(smokeAcc>0.09 && bikeEl.querySelectorAll('.m-smoke').length<12){   // cap 12 ก้อน (กันเทสต์/แท็บกระตุกยิงรัว)
      smokeAcc=0; smokeSide=-smokeSide;
      const el=document.createElement('span'); el.className='m-smoke';
      el.style.left=((smokeSide<0?20:80)+(Math.random()*4-2))+'%';
      el.style.top=(71+Math.random()*3)+'%';
      el.style.setProperty('--dx',(smokeSide<0?-1:1)*(140+Math.random()*160)+'%');
      bikeEl.appendChild(el);
      setTimeout(()=>el.remove(),850);
    }
  }
  /* 🌪️ เส้นสปีด: โผล่เกิน 90 กม./ชม. เข้มขึ้นตามความเร็ว */
  if(speedFxEl){
    const kmh=spd*3.6;
    speedFxEl.style.opacity=kmh>90?Math.min(.8,(kmh-90)/45).toFixed(2):0;
  }
  spdEl.textContent=Math.round(spd*3.6)+' กม./ชม.';
  Eng.tick();
  renderer.render(scene,camera);
}

/* ============================================================
   เข้า/ออกโลก
   ============================================================ */
function start(opts){
  vehicle=(opts&&opts.vehicle==='car')?'car':'moto';        // 🚗 รอบ 317: ผู้เล่นโลกขับรถเลือกแผนที่นี้ = มาด้วยรถยนต์
  if(!built) build();
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  wrapEl.classList.add('on');
  // 🚗 รอบ 394: มาโหมดรถยนต์ → สลับรถกล่องเป็นโมเดล GLB สีตรงคันที่เลือกขับ (โหลดครั้งแรกครั้งเดียว)
  if(vehicle==='car') mCarEnsure(src=>{
    if(!src) return;
    const cid=(typeof myCar==='function'&&myCar())?myCar().id:'car_01';
    if(selfCar&&selfCar.userData.glbCid===cid) return;
    if(selfCar) scene.remove(selfCar);
    selfCar=mCarBuild(cid); selfCar.userData.glbCid=cid;
    selfCar.visible=(vehicle==='car'); scene.add(selfCar);
  });
  applyVehicleUi();
  introEl.style.display='flex';
  exitBox.classList.remove('on');
  sessionCoins=0; sessionWords=0;
  coinsEl.textContent='🪙 +0';
  clearCoins(); specialDone=false;                                       // 🪙 รอบ 319: ล้างเหรียญคำเก่า (วางใหม่พร้อมตัวอักษรใน pickWord)
  /* 🏆💬 รอบ 318: ล้างกระดาน/แชทจากรอบก่อน */
  myChat=null; boardSig='';
  if(boardEl){ boardEl.classList.remove('on'); boardEl.innerHTML=''; }
  if(chatBarEl) chatBarEl.classList.remove('on');
  if(selfMsgEl) selfMsgEl.classList.remove('on');
  px=startX; pz=startZ; yaw=startYaw; spd=0; lean=0; thr=0; padThr=0; kThr=false;
  steerCtl=0; kL=false; kR=false; knobEl.style.left='50%';
  camInit=false;
  bikeY=0; bikeVY=0; airborne=false; prevFollowVY=0; suspY=0; suspV=0;   // 🕳️⛰️ รอบ 315
  decalAt=0;                                                             // 🖼️ รอบ 316
  if(dog) dog.grp.visible=false; dogNextAt=performance.now()+DOG_GAP_MS;   // 🐕 รอบ 312
  scatterTrees(true); scatterClouds(true);
  /* 🧑‍🤝‍🧑🅿️ รอบ 317: เข้าห้องแผนที่ก่อน แล้วเลือกช่องเกิดว่างหน้าโรงเรียน (ห้ามซ้อนทับกัน) */
  netJoin();
  const slot=spawnSlot(); px=slot.x; pz=slot.z;
  spawnFixAt=performance.now()+1200;
  fit();
  pickWord();
  if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
  keydownFn=e=>{
    if(e.repeat) return;
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kL=true;
    else if(k==='d'||k==='arrowright') kR=true;
    else if(k==='w'||k==='arrowup'||k===' '){ kThr=true; Eng.start(); if(introEl.style.display!=='none') introEl.style.display='none'; }
    else if(k==='escape') exitBox.classList.add('on');
  };
  keyupFn=e=>{
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kL=false;
    else if(k==='d'||k==='arrowright') kR=false;
    else if(k==='w'||k==='arrowup'||k===' ') kThr=false;
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
  netLeave();                                   // 🧑‍🤝‍🧑 รอบ 317: ออกจากห้องแผนที่ + ลบตัวเองจาก DB
  clearCoins();
  myChat=null;                                  // 💬🏆 รอบ 318
  if(boardEl) boardEl.classList.remove('on');
  if(chatBarEl) chatBarEl.classList.remove('on');
  if(selfMsgEl) selfMsgEl.classList.remove('on');
  cancelAnimationFrame(rafId);
  window.removeEventListener('keydown',keydownFn);
  window.removeEventListener('keyup',keyupFn);
  window.removeEventListener('resize',resizeFn);
  Eng.stop();
  wrapEl.classList.remove('on');
  exitBox.classList.remove('on');
  if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
  saveState();
  if(typeof renderDashboard==='function') renderDashboard();
  if(sessionWords>0||sessionCoins>0)
    toast(`${vehicle==='car'?'🚗':'🏍️'} กลับจากบ้านโพธิ์สวัสดิ์ — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.MotoWorld={
  start,
  /* test hooks — ใช้เฉพาะตอนเทสต์ preview */
  _t:{
    get running(){return running}, set running(v){running=v},
    get letters(){return letters}, get word(){return word}, get segs(){return segs},
    get posts(){return postBody?postBody.count:0},
    eng:Eng,
    forceDog(){ dogNextAt=0; spd=Math.max(spd,10); dogTick(1/60,performance.now()); return dog&&dog.grp.visible; },
    get dog(){ return dog; }, dogTick, gpsTick,
    get feats(){ return feats.length; }, terrainAt, roadGroundY,
    get vert(){ return {bikeY,bikeVY,airborne,suspY}; },
    set pos(v){ if('x'in v)px=v.x; if('z'in v)pz=v.z; if('yaw'in v)yaw=v.yaw; if('spd'in v)spd=v.spd; },
    get pos(){return {x:px,z:pz,yaw,spd}},
    set input(v){ if('steer' in v) steerCtl=v.steer; if('thr' in v) padThr=v.thr; },
    give(){ letters.slice().forEach(l=>{ word.got.push(l.idx); scene.remove(l.spr); }); letters=[]; completeWord(); },
    step(dt,n){ for(let i=0;i<(n||1);i++) frame(dt||1/60, performance.now()); },   // เดินเฟรมเองตอนแท็บ hidden (rAF ไม่ยิง)
    exitWorld, fit, roadInfo, randomRoadPoint,
    /* 🪙🚗🧑‍🤝‍🧑 รอบ 317 */
    get coins(){ return coins.length; },
    get coinList(){ return coins.map(c=>({x:c.spr.position.x,z:c.spr.position.z,tier:c.tier,side:c.side,ch:c.l&&c.l.ch,sx:c.spr.scale.x,shine:c.spr.material.color.r,keep:!!c.keep})); },
    get cleanWord(){ return cleanWord; }, set cleanWord(v){ cleanWord=v; },   // 🍀 เทสต์: บังคับสถานะ "ไม่ชนเลย"
    dropEmerald(){ const p=randomRoadPoint(px,pz,20,50); if(p) addFreeCoin(EMERALD_TIER,p.x,p.z); return !!p; },
    get vehicle(){ return vehicle; },
    get peers(){ return peers; },
    get selfCar(){ return selfCar; },
    spawnSlot, coinTick, peerTick, makeVehicle, applyVehicleUi,
    /* 🏆💬💎 รอบ 318 */
    sendChat, renderBoard, coinTierAt,
    get board(){ return boardEl?boardEl.textContent:''; },
    get coinTiers(){ const n=[0,0,0,0]; coins.forEach(c=>n[c.tier]++); return n; },
    placeSpecialCoin, get specialDone(){ return specialDone; },
    get myChat(){ return myChat; },
    fakePeer(uid,x,z,kind,extra){ onPeer({key:uid,val:()=>Object.assign({n:'เทส '+uid,x,z,yaw:0,av:kind||'car'},extra||{})}); return peers[uid]; },
    get start(){ return {x:startX,z:startZ,yaw:startYaw}; },
  }
};
})();
