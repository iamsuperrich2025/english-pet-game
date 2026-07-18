/* 🏍️ moto3d.js — โลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293)
   ขับมอเตอร์ไซค์ third-person บนถนนจริงรอบโรงเรียนบ้านโพธิ์สวัสดิ์ รัศมี 30 กม. (js/data/moto_phosawat.js · OSM)
   เล่นบน "เครื่องเกมพกพา" เต็มจอ — จอเกมอยู่ตรงกลางเครื่อง · สไลเดอร์ส้มซ้าย=เลี้ยว · ปุ่มฟ้าขวา=เร่ง · ปุ่มแดงบน=ปิดเครื่อง
   เก็บตัวอักษรบนถนนประกอบคำศัพท์ คำละ 🪙45 · โหลดขี้เกียจผ่าน enterMoto3D (ui.js) — ไม่แตะ adventure3d.js */
(function(){
'use strict';
const REWARD=45, DONE_KEY='motoDone';
const ACCEL=10, DECEL=5.5, VMAX=32, VMAX_OFF=6.5, WHEEL_R=0.34;
const ROAD_WIDE=3.6;                       // ตัวคูณความกว้างถนน (รอบ 301: ×2 จาก 1.8 — ผู้ใช้ขอกว้างขึ้นอีก 2 เท่า)
const EDGE_M=0.55;                         // ระยะกันชนจากขอบถนน (m) — ชนขอบแล้วดันกลับ ขับออกนอกถนนไม่ได้
const ROAD_TEX_S=16, GRASS_TEX_S=10;       // รอบ 302: ขนาดโลก (m) ต่อ 1 รอบลายภาพถนน/หญ้า (UV พิกัดโลก — รอยต่อทางแยกเนียน)
const POST_N=400, POST_SP=42, POST_R=380;  // รอบ 303: หลักเขตทาง — จำนวน pool · ระยะห่างต่อหลัก (m) · รัศมีวางรอบผู้เล่น (m)
const LEAN_MAX=0.52;                       // มุมเอียงตัวรถสูงสุด (rad) ตอนเลี้ยวเต็มคัน
const COLLECT_R=2.8;                       // ระยะชนเก็บตัวอักษร
const SPAWN_MIN=110, SPAWN_MAX=430, RELOC_D=800;   // ระยะวางตัวอักษรจากรถ + ไกลเกินย้ายใหม่
const BUCKET=250;                          // ตารางแฮชถนน (เมตร/ช่อง)
const TILE_COLORS=['#ff8a65','#4fc3f7','#aed581','#ffd54f','#ba68c8','#f06292','#4dd0e1','#ff8a80'];

let built=false, running=false, rafId=0, lastT=0;
let renderer=null, scene=null, camera=null;
let wrapEl,screenEl,cvEl,knobEl,sliderEl,thrEl,wordEl,spdEl,gpsEl,gpsArr,gpsDist,coinsEl,banEl,miniCv,miniCtx,introEl,exitBox;
let segs=[], buckets=new Map();            // ถนน: เส้นย่อย + ตารางแฮช
let bikeEl=null;                           // 🏍️ ภาพมอไซค์จริง (สไปรต์ DOM ล่างกึ่งกลางจอ — รอบ 294)
let shadowEl=null;                         // 🌑 เงาวงรีใต้ล้อ (รอบ 303)
let wheelEl=null, wheelOff=0;              // 🛞 เอฟเฟกต์ล้อหมุน (รอบ 304) — offset ลายวิ่งสะสมตาม spd
let speedFxEl=null;                        // 🌪️ เส้นสปีดขอบจอ (รอบ 305)
let smokeAcc=0, smokeSide=1;               // 💨 ควันท่อ (รอบ 305) — ตัวจับจังหวะ spawn + สลับท่อซ้าย/ขวา
let postBody=null, postTop=null;           // 🚧 หลักเขตทางขาว-แดงริมถนน (รอบ 303 · instanced รีไซเคิลรอบผู้เล่น)
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
let keydownFn=null,keyupFn=null,resizeFn=null;

/* ---------- 🔊 เสียงเครื่องยนต์จริง (รอบ 306 — ตัดจากเสียงอัดมอไซค์จริงของผู้ใช้ sound/MotorbikeSound.m4a)
   sound/moto/: eng_idle 5.6s ลูปเดินเบา (248.7s ในต้นฉบับ ช่วงนิ่งสุด) · eng_cruise 5.6s ลูปวิ่งไหล (129.2s)
   eng_accel 2.6s รอบกวาดขึ้น (377.2s) · eng_decel 3.5s รอบไหลลง (393.7s) — ทุกไฟล์กรอง 60Hz-7.5kHz ตัดลม/ซ่า
   ลูป bake crossfade 80ms วนไร้รอยต่อ · idle↔cruise crossfade ตาม spd · cruise เร่ง pitch ตามความเร็ว
   accel/decel เล่น one-shot ตอนบิด/ปล่อยคันเร่ง · เริ่มหลัง gesture ปุ่มเริ่ม (นโยบาย autoplay) ---------- */
const ENG_FILES={idle:'sound/moto/eng_idle.wav',cruise:'sound/moto/eng_cruise.wav',
                 accel:'sound/moto/eng_accel.wav',decel:'sound/moto/eng_decel.wav'};
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
      else if(spd>8) this.shot('decel',.75);                       // ปล่อยตอนช้าไม่ต้องมีเสียงรอบไหลลง
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
#moto-knob{position:absolute;left:50%;top:21%;height:56%;width:62%;transform:translateX(-50%);border-radius:999px;
  background:linear-gradient(180deg,#ff7a45,#f04f16);pointer-events:none;
  box-shadow:0 3px 7px rgba(0,0,0,.5), inset 0 3px 5px rgba(255,200,160,.5);
  display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:2.1vmin;
  text-shadow:0 1px 2px rgba(120,40,0,.6)}
#moto-knob span{opacity:.5}
#moto-throttle{position:absolute;left:74.5%;top:40%;width:19.5%;height:48%;border-radius:50%;border:none;cursor:pointer;
  background:transparent;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4vmin}
#moto-throttle:active{background:radial-gradient(circle at 50% 42%,rgba(255,255,255,.22),rgba(255,255,255,0) 62%)}
#moto-throttle .m-ico{font-size:4.4vmin;opacity:.5;pointer-events:none;text-shadow:0 1px 3px rgba(0,60,70,.6)}
#moto-throttle .m-lb{font-size:2.3vmin;font-weight:900;opacity:.5;pointer-events:none;text-shadow:0 1px 2px rgba(0,60,70,.6)}
/* ---------- HUD ในจอ ---------- */
#moto-word{position:absolute;left:1.6%;top:2.5%;display:flex;gap:.45vmin;align-items:center;flex-wrap:wrap;max-width:70%}
#moto-word .m-th{color:#ffe9a8;font-size:1.9vmin;font-weight:800;margin-left:.8vmin;text-shadow:0 1px 3px #000}
.m-chip{width:3.6vmin;height:3.6vmin;border-radius:.9vmin;display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:2.3vmin;color:#fff;background:rgba(255,255,255,.16);border:.28vmin solid rgba(255,255,255,.5);
  text-shadow:0 1px 2px rgba(0,0,0,.5)}
.m-chip.got{background:#43d06c;border-color:#fff;box-shadow:0 0 1.6vmin rgba(90,255,140,.6)}
#moto-coins{position:absolute;right:2%;top:2.5%;color:#ffd54f;font-weight:900;font-size:2.3vmin;text-shadow:0 1px 3px #000}
#moto-speed{position:absolute;left:2%;bottom:3%;color:#bfeaff;font-weight:900;font-size:2.4vmin;text-shadow:0 1px 3px #000}
#moto-gps{position:absolute;left:50%;top:2%;transform:translateX(-50%);display:flex;align-items:center;gap:.8vmin;
  background:rgba(10,20,35,.55);border-radius:999px;padding:.5vmin 1.6vmin;color:#fff}
#moto-gps-arr{display:inline-block;font-size:2.8vmin;color:#5ef08a;transition:transform .12s linear;text-shadow:0 0 1.2vmin rgba(90,255,140,.8)}
#moto-gps-d{font-size:2vmin;font-weight:800}
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
      <div id="moto-gps"><span id="moto-gps-arr">➤</span><span id="moto-gps-d">--</span></div>
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
  sliderEl.addEventListener('pointerdown',e=>{ sliding=true; try{ sliderEl.setPointerCapture(e.pointerId); }catch(err){} setSteer(e); });
  sliderEl.addEventListener('pointermove',e=>{ if(sliding) setSteer(e); });
  const slEnd=()=>{ sliding=false; };               // ค้างตำแหน่งที่ปล่อย
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
function buildRoads(){
  const D=window.MOTO_MAP;
  const posMinor=[], posMajor=[], posLine=[], posEdge=[], uvMinor=[], uvMajor=[];
  D.r.forEach(rd=>{
    const w=rd[0], major=rd[1], pts=rd[3], hw=w/2*ROAD_WIDE;   // รอบ 297: ถนนกว้างขึ้น (ผู้ใช้บอกแคบไป) — คูมทั้งภาพและระยะนับ "อยู่บนถนน"
    for(let i=0;i<pts.length-2;i+=2){
      const ax=pts[i],az=pts[i+1],bx=pts[i+2],bz=pts[i+3];
      const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz); if(L<0.5) continue;
      const si=segs.length;
      segs.push({ax,az,bx,bz,hw,len:L});
      /* ลง bucket ทุกช่องที่เส้นผ่าน */
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
      /* ribbon 2 สามเหลี่ยม (⚠️ รอบ 296: ยกสูงขึ้น 0.15+ กัน z-fight พื้นหญ้าระยะไกล) */
      const nx=-dz/L*hw, nz=dx/L*hw, y=major?0.18:0.15;
      const tgt=major?posMajor:posMinor;
      tgt.push(ax+nx,y,az+nz, ax-nx,y,az-nz, bx+nx,y,bz+nz,
               ax-nx,y,az-nz, bx-nx,y,bz-nz, bx+nx,y,bz+nz);
      /* 🛣️ รอบ 302: UV พิกัดโลก (u=x/S v=z/S) — ลายยางมะตอยต่อเนื่องข้ามเส้น/ทางแยกไม่มีรอยชน */
      const uvt=major?uvMajor:uvMinor, S=ROAD_TEX_S;
      uvt.push((ax+nx)/S,(az+nz)/S, (ax-nx)/S,(az-nz)/S, (bx+nx)/S,(bz+nz)/S,
               (ax-nx)/S,(az-nz)/S, (bx-nx)/S,(bz-nz)/S, (bx+nx)/S,(bz+nz)/S);
      /* 🧱 รอบ 301: ขอบถนนขาว — ribbon กว้างกว่าถนน 1m รองใต้ (y ต่ำกว่า) โผล่เป็นเส้นขอบ 2 ฝั่งในก้อนเดียว */
      const ew=hw+1.0, exx=-dz/L*ew, ezz=dx/L*ew, ey=0.12;
      posEdge.push(ax+exx,ey,az+ezz, ax-exx,ey,az-ezz, bx+exx,ey,bz+ezz,
                   ax-exx,ey,az-ezz, bx-exx,ey,bz-ezz, bx+exx,ey,bz+ezz);
      if(major){  // เส้นกลางเหลืองถนนใหญ่
        const lw=0.35, lx=-dz/L*lw, lz=dx/L*lw;
        posLine.push(ax+lx,0.22,az+lz, ax-lx,0.22,az-lz, bx+lx,0.22,bz+lz,
                     ax-lx,0.22,az-lz, bx-lx,0.22,bz-lz, bx+lx,0.22,bz+lz);
      }
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
  mk(posLine,0xffd54f);                    // เส้นกลางเหลือง
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
    if(info.seg && info.d<40){          // ใกล้ถนน → ดึงลงกลางถนน
      const s=info.seg, dx=s.bx-s.ax, dz=s.bz-s.az, L2=dx*dx+dz*dz;
      let t=L2?((x-s.ax)*dx+(z-s.az)*dz)/L2:0; t=Math.max(.05,Math.min(.95,t));
      return {x:s.ax+dx*t, z:s.az+dz*t};
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
  word.en.split('').forEach((ch,i)=>{
    const p=randomRoadPoint(px,pz,SPAWN_MIN,SPAWN_MAX)||{x:px+30+i*20,z:pz+30};
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
    spr.scale.set(3,3,1); spr.position.set(p.x,1.7,p.z);
    scene.add(spr);
    letters.push({ch,idx:i,spr});
  });
}
function renderWordHud(){
  if(!word) return;
  wordEl.innerHTML=word.en.split('').map((ch,i)=>
    `<span class="m-chip${word.got.includes(i)?' got':''}">${ch.toUpperCase()}</span>`).join('')
    +`<span class="m-th">${escapeHTML(word.th)}</span>`;
}
function collectTick(){
  for(let i=letters.length-1;i>=0;i--){
    const l=letters[i];
    if(Math.hypot(l.spr.position.x-px,l.spr.position.z-pz)<COLLECT_R){
      word.got.push(l.idx);
      scene.remove(l.spr); letters.splice(i,1);
      if(typeof sfx!=='undefined') sfx.select();
      if(state.haptic!==false && navigator.vibrate) navigator.vibrate(30);
      renderWordHud();
      if(!letters.length) completeWord();
    }
  }
}
function completeWord(){
  const w=word;
  state[DONE_KEY].push(w.en);
  addCoins(REWARD); sessionCoins+=REWARD; sessionWords++;
  coinsEl.textContent='🪙 +'+fmtNum(sessionCoins);
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
function relocTick(now){
  if(now-relocAt<2500) return; relocAt=now;
  letters.forEach(l=>{
    if(Math.hypot(l.spr.position.x-px,l.spr.position.z-pz)>RELOC_D){
      const p=randomRoadPoint(px,pz,SPAWN_MIN,SPAWN_MAX);
      if(p) l.spr.position.set(p.x,1.7,p.z);
    }
  });
}

/* ---------- GPS ลูกศร + มินิแมพ ---------- */
function gpsTick(){
  let best=null,bd=1e18;
  letters.forEach(l=>{ const d=Math.hypot(l.spr.position.x-px,l.spr.position.z-pz); if(d<bd){bd=d;best=l;} });
  if(!best){ gpsDist.textContent='--'; return; }
  const a=Math.atan2(best.spr.position.x-px, best.spr.position.z-pz)-yaw;
  gpsArr.style.transform='rotate('+(-a*180/Math.PI)+'deg)';
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
  built=true;
}
function fit(){
  if(!renderer) return;
  const r=screenEl.getBoundingClientRect();
  const w=Math.max(64,Math.round(r.width)), h=Math.max(64,Math.round(r.height));
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
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
  /* 🏍️ เอียงเข้าโค้ง (รอบ 294) + รอบ 297: องศาเอียง = ค่าที่ผู้เล่นตั้งตรงๆ ไม่ผูกความเร็ว ไม่คืนกลางเอง
     เลี้ยวขวา (steer=+1) → มองจากท้ายรถ ตัวรถเทไปทางขวา = หมุนภาพตามเข็ม (องศาบวก) */
  const leanTgt=steer*LEAN_MAX;
  lean+=(leanTgt-lean)*(1-Math.exp(-3.5*dt)); // รอบ 301: เลิกสปริง (เด้งแบบตุ๊กตาหัวโยก ผู้ใช้ไม่เอา) → ไล่เข้าเป้าหนืดนิ่งแบบ Ride 4 ไม่ overshoot
  if(bikeEl){
    bikeEl.style.transform='translateX(-50%) rotate('+(lean*57.296).toFixed(1)+'deg)';
    /* 🟠 รอบ 300: ไฟเลี้ยวกะพริบตามทิศที่ตั้งเอียง (เกิน ±0.12 = ถือว่ากำลังเลี้ยว) */
    const sig=steerCtl<-0.12?'l':steerCtl>0.12?'r':'';
    if(sig!==_sigCur){
      _sigCur=sig;
      bikeEl.classList.toggle('sig-l',sig==='l');
      bikeEl.classList.toggle('sig-r',sig==='r');
    }
  }
  /* กล้อง third-person ตามหลังนุ่มๆ (ภาพมอไซค์เป็นสไปรต์หน้าจอ — กล้องคือสายตาคนขี่ตามหลัง) */
  const cd=6.2, ch=2.6;
  const tx=px-Math.sin(yaw)*cd, tz=pz-Math.cos(yaw)*cd;
  if(!camInit){ camX=tx; camY=ch; camZ=tz; camInit=true; }
  const k=1-Math.exp(-5.5*dt);
  camX+=(tx-camX)*k; camZ+=(tz-camZ)*k; camY+=(ch-camY)*k;
  camera.position.set(camX,camY,camZ);
  camera.lookAt(px+Math.sin(yaw)*4, 1.4, pz+Math.cos(yaw)*4);
  camera.rotateZ(lean*.3);           // ขอบฟ้าเอียงสวนเล็กน้อย เพิ่มฟีลเทโค้ง
  if(skyDome) skyDome.position.set(px,0,pz);   // โดมฟ้าตามผู้เล่น (รัศมี 1400 < far 1600)
  /* เกม */
  collectTick(); relocTick(now); gpsTick(); miniTick();
  if(now-decoAt>1000){ decoAt=now; scatterTrees(false); scatterClouds(false); postTick(); }
  /* 🌑 เงาใต้ล้อ: เอียงรถ = เงาขยับตามทิศเอียงนิด + แคบลง (เหมือนตัวรถเทออกจากจุดสัมผัส) */
  if(shadowEl) shadowEl.style.transform='translateX('+(-50+lean*14).toFixed(1)+'%) scaleX('+(1-Math.abs(lean)*.3).toFixed(2)+')';
  /* 🛞 ล้อหมุน: ลายวิ่งลงเร็วตาม spd (period 22px) · จอด=โปร่งใสเห็นดอกยางนิ่งจากภาพ */
  if(wheelEl){
    wheelOff=(wheelOff+spd*dt*90)%22;
    wheelEl.style.backgroundPosition='0 '+wheelOff.toFixed(1)+'px';
    wheelEl.style.opacity=Math.min(.8,spd*.05).toFixed(2);
  }
  /* 💨 ควันท่อ: บิดคันเร่ง = พ่นก้อนควันสลับท่อซ้าย/ขวาทุก 90ms (ลบตัวเองใน 850ms · สูงสุด ~9 ก้อน) */
  if(thr&&bikeEl){
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
function start(){
  if(!built) build();
  if(!Array.isArray(state[DONE_KEY])) state[DONE_KEY]=[];
  wrapEl.classList.add('on');
  introEl.style.display='flex';
  exitBox.classList.remove('on');
  sessionCoins=0; sessionWords=0;
  coinsEl.textContent='🪙 +0';
  px=startX; pz=startZ; yaw=startYaw; spd=0; lean=0; thr=0; padThr=0; kThr=false;
  steerCtl=0; kL=false; kR=false; knobEl.style.left='50%';
  camInit=false;
  scatterTrees(true); scatterClouds(true);
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
    toast(`🏍️ กลับจากบ้านโพธิ์สวัสดิ์ — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.MotoWorld={
  start,
  /* test hooks — ใช้เฉพาะตอนเทสต์ preview */
  _t:{
    get running(){return running}, set running(v){running=v},
    get letters(){return letters}, get word(){return word}, get segs(){return segs},
    get posts(){return postBody?postBody.count:0},
    eng:Eng,
    get pos(){return {x:px,z:pz,yaw,spd}},
    set input(v){ if('steer' in v) steerCtl=v.steer; if('thr' in v) padThr=v.thr; },
    give(){ letters.slice().forEach(l=>{ word.got.push(l.idx); scene.remove(l.spr); }); letters=[]; completeWord(); },
    step(dt,n){ for(let i=0;i<(n||1);i++) frame(dt||1/60, performance.now()); },   // เดินเฟรมเองตอนแท็บ hidden (rAF ไม่ยิง)
    exitWorld, fit, roadInfo, randomRoadPoint,
  }
};
})();
