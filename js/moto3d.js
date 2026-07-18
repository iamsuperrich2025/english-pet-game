/* 🏍️ moto3d.js — โลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293)
   ขับมอเตอร์ไซค์ third-person บนถนนจริงรอบโรงเรียนบ้านโพธิ์สวัสดิ์ รัศมี 30 กม. (js/data/moto_phosawat.js · OSM)
   เล่นบน "เครื่องเกมพกพา" เต็มจอ — จอเกมอยู่ตรงกลางเครื่อง · สไลเดอร์ส้มซ้าย=เลี้ยว · ปุ่มฟ้าขวา=เร่ง · ปุ่มแดงบน=ปิดเครื่อง
   เก็บตัวอักษรบนถนนประกอบคำศัพท์ คำละ 🪙45 · โหลดขี้เกียจผ่าน enterMoto3D (ui.js) — ไม่แตะ adventure3d.js */
(function(){
'use strict';
const REWARD=45, DONE_KEY='motoDone';
const ACCEL=10, DECEL=5.5, VMAX=32, VMAX_OFF=6.5, WHEEL_R=0.34;
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
let yaw=0, spd=0, lean=0, leanV=0, px=0, pz=0;
let steer=0, thr=0, kSteer=0, kThr=false, padSteer=0, padThr=0;
let camX=0,camY=0,camZ=0,camInit=false;
let word=null, chips=[], letters=[], relocAt=0;
let trees=null, treeTop=null, treePos=[], TREE_N=200;
let clouds=[], deco=false, decoAt=0;
let sessionCoins=0, sessionWords=0, texCache={};
let startX=0,startZ=0,startYaw=0;
let keydownFn=null,keyupFn=null,resizeFn=null;

/* ---------- เสียงเครื่องยนต์ (WebAudio สังเคราะห์ · เริ่มหลัง gesture ปุ่มเริ่ม) ---------- */
const Eng={ctx:null,o1:null,o2:null,g:null,
  start(){ if(this.ctx||!window.AudioContext&&!window.webkitAudioContext) return;
    try{
      const C=window.AudioContext||window.webkitAudioContext; this.ctx=new C();
      this.o1=this.ctx.createOscillator(); this.o1.type='sawtooth';
      this.o2=this.ctx.createOscillator(); this.o2.type='square';
      const f=this.ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=480;
      this.g=this.ctx.createGain(); this.g.gain.value=0;
      this.o1.connect(f); this.o2.connect(f); f.connect(this.g); this.g.connect(this.ctx.destination);
      this.o1.start(); this.o2.start();
    }catch(e){ this.ctx=null; }
  },
  tick(){ if(!this.ctx) return;
    const on=(typeof state!=='undefined'&&state.sound!==false)&&running;
    const rev=55+spd*3.4+(thr?26:0);
    this.o1.frequency.setTargetAtTime(rev,this.ctx.currentTime,.06);
    this.o2.frequency.setTargetAtTime(rev/2,this.ctx.currentTime,.06);
    this.g.gain.setTargetAtTime(on?(.028+Math.min(.03,spd*.0012)):0,this.ctx.currentTime,.1);
  },
  stop(){ if(this.g&&this.ctx) this.g.gain.setTargetAtTime(0,this.ctx.currentTime,.05); }
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
#moto-body{position:absolute;inset:0;background:url('img/moterbike/console_crop.webp') center/100% 100% no-repeat}
#moto-power{position:absolute;left:43.3%;top:0.5%;width:8.2%;height:13.6%;border-radius:50%;
  border:none;cursor:pointer;background:transparent;color:#fff;
  display:flex;align-items:flex-end;justify-content:center}
#moto-power .m-hint{font-size:1.5vmin;font-weight:800;opacity:.5;margin-bottom:-2.2vmin;text-shadow:0 1px 2px #000}
#moto-power:active{background:rgba(255,255,255,.14)}
#moto-screen{position:absolute;left:25.1%;top:18%;width:44.4%;height:53%;
  background:#0e1118;border-radius:1.6vmin;overflow:hidden;
  box-shadow:inset 0 0 2vmin rgba(0,0,0,.85)}
#moto-cv{position:absolute;inset:0;width:100%;height:100%;display:block}
/* 🏍️ ภาพมอเตอร์ไซค์จริง (img/moterbike/bike.webp) — ล่างกึ่งกลางจอ เอียงเข้าโค้ง */
#moto-bike{position:absolute;left:50%;bottom:-2%;height:56%;pointer-events:none;z-index:2;
  transform:translateX(-50%);transform-origin:50% 92%;
  filter:drop-shadow(0 1.2vmin 1vmin rgba(0,0,0,.55))}
#moto-slider{position:absolute;left:2%;top:41%;width:22.5%;height:24%;border-radius:999px;cursor:pointer;
  background:transparent}
#moto-slider .m-arr{display:none}
#moto-knob{position:absolute;left:50%;top:21%;height:56%;width:62%;transform:translateX(-50%);border-radius:999px;
  background:linear-gradient(180deg,#ff7a45,#f04f16);pointer-events:none;
  box-shadow:0 3px 7px rgba(0,0,0,.5), inset 0 3px 5px rgba(255,200,160,.5);
  display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:2.1vmin;
  text-shadow:0 1px 2px rgba(120,40,0,.6)}
#moto-knob span{opacity:.5}
#moto-throttle{position:absolute;left:72%;top:32.5%;width:19.5%;height:48%;border-radius:50%;border:none;cursor:pointer;
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
      <img id="moto-bike" src="img/moterbike/bike.webp" alt="">
      <div id="moto-word"></div>
      <div id="moto-coins">🪙 +0</div>
      <div id="moto-gps"><span id="moto-gps-arr">➤</span><span id="moto-gps-d">--</span></div>
      <div id="moto-speed">0 กม./ชม.</div>
      <canvas id="moto-mini" width="130" height="130"></canvas>
      <div id="moto-banner"></div>
      <div id="moto-intro"><div class="m-card">
        <h3>🏍️ มอเตอร์ไซค์บ้านโพธิ์สวัสดิ์</h3>
        <p>ออกตัวหน้า<b>โรงเรียนบ้านโพธิ์สวัสดิ์</b> — ถนนจริงรอบหมู่บ้าน รัศมี 30 กม.!<br>
        🟠 สไลเดอร์ส้มซ้าย = เลี้ยว · 🔵 ปุ่มฟ้าขวา = เร่งเครื่อง (กดค้าง)<br>
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
  bikeEl=document.getElementById('moto-bike');
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
  /* สไลเดอร์เลี้ยว: ลากต่อเนื่อง -1..1 · ปล่อย = คืนกลาง */
  let sliding=false;
  const setSteer=e=>{
    const r=sliderEl.getBoundingClientRect();
    let t=((e.clientX-r.left)/r.width-0.5)*2.4;   // ขยับสุดขอบ = เกิน 1 เล็กน้อย → เต็มคันง่าย
    padSteer=Math.max(-1,Math.min(1,t));
    knobEl.style.left=(50+padSteer*26)+'%';
  };
  sliderEl.addEventListener('pointerdown',e=>{ sliding=true; try{ sliderEl.setPointerCapture(e.pointerId); }catch(err){} setSteer(e); });
  sliderEl.addEventListener('pointermove',e=>{ if(sliding) setSteer(e); });
  const slEnd=()=>{ sliding=false; padSteer=0; knobEl.style.left='50%'; };
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
  const posMinor=[], posMajor=[], posLine=[];
  D.r.forEach(rd=>{
    const w=rd[0], major=rd[1], pts=rd[3], hw=w/2;
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
      /* ribbon 2 สามเหลี่ยม */
      const nx=-dz/L*hw, nz=dx/L*hw, y=major?0.06:0.04;
      const tgt=major?posMajor:posMinor;
      tgt.push(ax+nx,y,az+nz, ax-nx,y,az-nz, bx+nx,y,bz+nz,
               ax-nx,y,az-nz, bx-nx,y,bz-nz, bx+nx,y,bz+nz);
      if(major){  // เส้นกลางเหลืองถนนใหญ่
        const lw=0.35, lx=-dz/L*lw, lz=dx/L*lw;
        posLine.push(ax+lx,0.08,az+lz, ax-lx,0.08,az-lz, bx+lx,0.08,bz+lz,
                     ax-lx,0.08,az-lz, bx-lx,0.08,bz-lz, bx+lx,0.08,bz+lz);
      }
    }
  });
  const mk=(arr,color)=>{
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(arr),3));
    const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color}));
    m.frustumCulled=false; scene.add(m); return m;
  };
  mk(posMinor,0x9aa3ad);          // ถนนเล็ก — เทาอ่อน
  mk(posMajor,0x6f7884);          // ถนนใหญ่ — เทาเข้ม
  mk(posLine,0xffd54f);           // เส้นกลางเหลือง
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
function buildScenery(){
  const D=window.MOTO_MAP;
  /* พื้นหญ้าสดใส */
  const g=new THREE.Mesh(new THREE.PlaneGeometry(64000,64000),
    new THREE.MeshLambertMaterial({color:0x8fd06c}));
  g.rotation.x=-Math.PI/2; g.position.y=-0.05; scene.add(g);
  /* 🏫 โรงเรียนบ้านโพธิ์สวัสดิ์ (0,0) — อาคารม่วงเหมือนจริง + ป้าย + เสาธง */
  const sch=new THREE.Group();
  const bld=new THREE.Mesh(new THREE.BoxGeometry(26,8,10), new THREE.MeshLambertMaterial({color:0x9b6fc9}));
  bld.position.y=4; sch.add(bld);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(28,1.2,12), new THREE.MeshLambertMaterial({color:0x6a4b8f}));
  roof.position.y=8.6; sch.add(roof);
  for(let i=-2;i<=2;i++){
    const win=new THREE.Mesh(new THREE.BoxGeometry(3,2.2,.3), new THREE.MeshLambertMaterial({color:0xdcecff}));
    win.position.set(i*5,4.6,5.02); sch.add(win);
  }
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,12,8), new THREE.MeshLambertMaterial({color:0xe8ecf2}));
  pole.position.set(-16,6,6); sch.add(pole);
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(3,1.8), new THREE.MeshBasicMaterial({color:0xe53935,side:THREE.DoubleSide}));
  flag.position.set(-14.4,11,6); sch.add(flag);
  const sign=makeTextSprite('โรงเรียนบ้านโพธิ์สวัสดิ์','#7c4fb5','#ffffff','🏫');
  sign.scale.set(46,11.5,1); sign.position.set(0,15,0); sch.add(sign);
  sch.position.set(startX-28,0,startZ-20);   // ถอยจากริมถนนจุดสตาร์ท
  scene.add(sch);
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
  scene.background=new THREE.Color(0x9fdcf7);
  scene.fog=new THREE.Fog(0x9fdcf7,220,950);
  camera=new THREE.PerspectiveCamera(62,16/9,.1,1600);
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
  steer=padSteer||kSteer;
  thr=(padThr||kThr)?1:0;
  const road=onRoad(px,pz);
  const vmax=road?VMAX:VMAX_OFF;
  if(thr){ spd+=ACCEL*dt; } else { spd-=DECEL*dt; }
  if(spd>vmax) spd=Math.max(vmax,spd-14*dt);   // ออกนอกถนน = หน่วงแรง
  if(spd<0) spd=0;
  /* เลี้ยว: ต้องมีความเร็ว · วงเลี้ยวแคบตอนช้า */
  const yr=steer*Math.min(spd,14)/(6.5+spd*0.42);
  yaw-=yr*dt*1.5;
  px+=Math.sin(yaw)*spd*dt; pz+=Math.cos(yaw)*spd*dt;
  /* 🏍️ เอียงเข้าโค้ง (รอบ 294 ผู้ใช้สั่ง: มอไซค์ต้องเอียง "เข้า" โค้งต้านแรงเหวี่ยง ไม่ใช่โคลงออกแบบรถยนต์)
     เลี้ยวขวา (steer=+1) → มองจากท้ายรถ ตัวรถเทไปทางขวา = หมุนภาพตามเข็ม (องศาบวก) */
  const leanTgt=steer*Math.min(1,spd/11)*LEAN_MAX;
  leanV+=(leanTgt-lean)*10*dt; leanV*=Math.exp(-6*dt); lean+=leanV;
  if(bikeEl) bikeEl.style.transform='translateX(-50%) rotate('+(lean*57.296).toFixed(1)+'deg)';
  /* กล้อง third-person ตามหลังนุ่มๆ (ภาพมอไซค์เป็นสไปรต์หน้าจอ — กล้องคือสายตาคนขี่ตามหลัง) */
  const cd=6.2, ch=2.6;
  const tx=px-Math.sin(yaw)*cd, tz=pz-Math.cos(yaw)*cd;
  if(!camInit){ camX=tx; camY=ch; camZ=tz; camInit=true; }
  const k=1-Math.exp(-5.5*dt);
  camX+=(tx-camX)*k; camZ+=(tz-camZ)*k; camY+=(ch-camY)*k;
  camera.position.set(camX,camY,camZ);
  camera.lookAt(px+Math.sin(yaw)*4, 1.4, pz+Math.cos(yaw)*4);
  camera.rotateZ(lean*.3);           // ขอบฟ้าเอียงสวนเล็กน้อย เพิ่มฟีลเทโค้ง
  /* เกม */
  collectTick(); relocTick(now); gpsTick(); miniTick();
  if(now-decoAt>1000){ decoAt=now; scatterTrees(false); scatterClouds(false); }
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
  px=startX; pz=startZ; yaw=startYaw; spd=0; lean=0; leanV=0; thr=0; padSteer=0; kSteer=0; kThr=false;
  camInit=false;
  scatterTrees(true); scatterClouds(true);
  fit();
  pickWord();
  if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
  keydownFn=e=>{
    if(e.repeat) return;
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft') kSteer=-1;
    else if(k==='d'||k==='arrowright') kSteer=1;
    else if(k==='w'||k==='arrowup'||k===' '){ kThr=true; Eng.start(); if(introEl.style.display!=='none') introEl.style.display='none'; }
    else if(k==='escape') exitBox.classList.add('on');
  };
  keyupFn=e=>{
    const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft'){ if(kSteer<0) kSteer=0; }
    else if(k==='d'||k==='arrowright'){ if(kSteer>0) kSteer=0; }
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
    get pos(){return {x:px,z:pz,yaw,spd}},
    set input(v){ if('steer' in v) padSteer=v.steer; if('thr' in v) padThr=v.thr; },
    give(){ letters.slice().forEach(l=>{ word.got.push(l.idx); scene.remove(l.spr); }); letters=[]; completeWord(); },
    step(dt,n){ for(let i=0;i<(n||1);i++) frame(dt||1/60, performance.now()); },   // เดินเฟรมเองตอนแท็บ hidden (rAF ไม่ยิง)
    exitWorld, fit, roadInfo, randomRoadPoint,
  }
};
})();
