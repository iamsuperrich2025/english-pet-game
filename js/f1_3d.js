/* 🏎️ f1_3d.js — โลกแข่งรถ F1 "สนามซาเคียร์" Bahrain International Circuit (รอบ 896)
   ─────────────────────────────────────────────────────────────────────
   · แทร็กจริงจาก OpenStreetMap (js/data/f1_bahrain.js — GP Circuit 5,400 ม. ครบ 15 โค้ง)
     + ผังอาคารจริง: Main Grandstand / Batelco / First Turn / Victory / University / Sakhir Tower / พิท
   · ฟิสิกส์โมเมนตัมจริง: แรงเครื่อง∝กำลัง/ความเร็ว · แรงต้านอากาศ v² · downforce เพิ่มกริปตามความเร็ว
     ยางมีลิมิตแรงเข้าโค้ง — เร็วเกิน = ไถล (understeer/drift) · ออกนอกแทร็ก = runoff → ทราย ลื่น+หน่วง
   · บรรยากาศ night race ใต้แสงไฟสปอตไลต์ (เอกลักษณ์สนามนี้) + ทะเลทราย + ต้นปาล์ม
   · เก็บตัวอักษรบนแทร็กประกอบคำ (REWARD 60🪙) + จับเวลาต่อรอบ / Best Lap (state.f1Best)
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

/* ============================================================
   📦 สถานะโลก
   ============================================================ */
let built=false, running=false, rafId=0, lastT=0;
let scene, camera, renderer;
let wrapEl, screenEl, hudEl, wordEl, coinsEl, banEl, introEl, exitBox, boardEl, chatBarEl, selfMsgEl;
let speedEl, gearEl, lapEl, bestEl, mapCv, mapCtx, mapBase=null, wrongEl;
let knobEl, padThr=0, padBr=false, steerCtl=0, kL=false, kR=false, kThr=false, kBack=false;
let keydownFn, keyupFn, resizeFn;
/* รถเรา */
let px=0, pz=0, yaw=0, vx=0, vz=0, spd=0, steer=0, slide=0, carGrp=null, wheels=[], steerParts=[];
let camPos=null, camInit=false, camYaw=0;
/* แทร็ก */
let LINE=null, TOTAL=0, grid=null, sfIdx=0, myIdx=0, myLapDist=0, surfNow='track';
/* จับเวลา */
let lapStartAt=0, lapNow=0, lapBest=0, lapCount=0, cpFlags=[false,false,false], lastProg=0;
/* คำศัพท์ */
let word=null, letters=[], sessionCoins=0, sessionWords=0;
/* เพื่อน */
let peers={}, room=null, lastNetSend=0, myChat=null, boardSig='';
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
    const lp=a.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900;
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
  function tick(v,thr,sliding,dt){
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
    noiseGain.gain.setTargetAtTime(clamp(v/92,0,1)*0.16,ac.currentTime,0.1);
    skidGain.gain.setTargetAtTime(sliding?0.16:0,ac.currentTime,sliding?0.03:0.12);
  }
  function kerb(){
    const a=ctx(); if(!a||!started) return;
    const o=a.createOscillator(), g=a.createGain();
    o.type='triangle'; o.frequency.value=88;
    g.gain.setValueAtTime(0.12,a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.07);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+0.08);
  }
  function stop(){
    if(!ac) return;
    try{ ac.close(); }catch(e){}
    ac=null; started=false; rpm=0;
  }
  return {start,tick,kerb,stop,get rpm(){return rpm;},get on(){return started;}};
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
/* ผิวใต้ล้อ: track / kerb / runoff / sand + ระยะเบี่ยงข้าง */
function surfAt(x,z,hint){
  const i=nearIdx(x,z,hint);
  const dx=x-LINE.x[i],dz=z-LINE.z[i];
  const lat=dx*LINE.nx[i]+dz*LINE.nz[i];
  const a=Math.abs(lat);
  let s='sand';
  if(a<=HALF_W) s='track';
  else if(a<=HALF_W+KERB_W&&Math.abs(LINE.curv[i])>0.004) s='kerb';
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
  for(let i=0;i<5;i++){
    const lt=new THREE.Mesh(new THREE.SphereGeometry(0.42,8,6),new THREE.MeshBasicMaterial({color:0x330000}));
    lt.position.set(-3.2+i*1.6,7.0,1.1); gant.add(lt);
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
      pos.push(p[i][0]+dz*5,0.015,p[i][1]-dx*5, p[i][0]-dz*5,0.015,p[i][1]+dx*5);
      uv.push(i,0,i,1);
    }
    for(let i=0;i<p.length-1;i++) idx.push(i*2,i*2+1,i*2+2, i*2+1,i*2+3,i*2+2);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    geo.setIndex(idx); geo.computeVertexNormals();
    scene.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0x4a4e55})));
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
    new THREE.GLTFLoader().load('img/models/f1_car.glb',
      g=>{ glbSrc=g.scene; cb(glbSrc); }, undefined, ()=>cb(null));
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
  /* ปีกหลัง + DRS */
  const rw=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.08,0.5),wing);
  rw.position.set(0,1.02,-1.95); g.add(rw);
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
    /* หันหน้า +Z (GLB ส่วนใหญ่หน้าคือ -Z → หมุนถ้ายาวตามแกน Z) */
    if(size.z>=size.x) m.rotation.y=Math.PI;
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
#f1-intro .box{max-width:460px;background:rgba(14,22,42,.96);border:1px solid rgba(255,209,46,.4);border-radius:18px;
  padding:16px 20px;color:#dfe9ff;font-size:14px;line-height:1.65;max-height:92vh;overflow:hidden}
#f1-intro h2{color:#ffd12e;font-size:20px;margin:0 0 6px}
#f1-intro button{background:#e10600;color:#fff;border:none;border-radius:12px;padding:10px 26px;font-size:17px;
  font-weight:800;font-family:inherit;margin-top:8px}
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
}`;
function buildDom(){
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  wrapEl=document.createElement('div'); wrapEl.id='f1-wrap';
  wrapEl.innerHTML=`
    <canvas id="f1-cv"></canvas>
    <div id="f1-word"></div>
    <div id="f1-laps"></div>
    <div id="f1-coins">🪙 +0</div>
    <div id="f1-board"></div>
    <canvas id="f1-map" width="260" height="260"></canvas>
    <div id="f1-hud"><div id="f1-speed">0<small> กม./ชม.</small></div><span id="f1-gear">N</span></div>
    <div id="f1-wrong">↩️ วิ่งผิดทาง! กลับรถ</div>
    <div id="f1-ban"></div>
    <div id="f1-selfmsg"></div>
    <button id="f1-chatbtn">💬</button>
    <div id="f1-chatbar"></div>
    <button id="f1-exitbtn">🏁 ออก</button>
    <div id="f1-steer"><div id="f1-knob">🏎️</div></div>
    <div id="f1-pedals">
      <button class="f1-pedal" id="f1-brake">🛑</button>
      <button class="f1-pedal" id="f1-throttle">⚡</button>
    </div>
    <div id="f1-intro"><div class="box">
      <h2>🏎️ สนามซาเคียร์ · บาห์เรน กรังด์ปรีซ์</h2>
      สนามจริง 5.4 กม. 15 โค้ง แข่งกลางทะเลทรายใต้แสงไฟ!<br>
      ⚡ = คันเร่ง · 🛑 = เบรก · ลูกบิดส้ม = พวงมาลัย<br>
      (คีย์บอร์ด: W เร่ง · S เบรก · A/D เลี้ยว)<br>
      🔤 เก็บตัวอักษรบนแทร็กประกอบคำ = <b style="color:#ffd12e">+${REWARD} 🪙</b><br>
      🏁 วิ่งครบรอบมีจับเวลา — ทำ Best Lap ให้ไวสุด!<br>
      ⚠️ ออกนอกแทร็กระวังทราย รถจะลื่นและช้าลงมาก
      <br><button id="f1-go">สตาร์ทเครื่อง! 🏎️</button>
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
  knobEl=wrapEl.querySelector('#f1-knob');
  mapCv=wrapEl.querySelector('#f1-map'); mapCtx=mapCv.getContext('2d');
  wrapEl.querySelector('#f1-go').addEventListener('click',()=>{ introEl.style.display='none'; Snd.start(); });
  wrapEl.querySelector('#f1-exitbtn').addEventListener('click',()=>exitBox.classList.add('on'));
  wrapEl.querySelector('#f1-stay').addEventListener('click',()=>exitBox.classList.remove('on'));
  wrapEl.querySelector('#f1-leave').addEventListener('click',exitWorld);
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
    if(introEl.style.display!=='none') introEl.style.display='none'; });
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
  texProbe('asphalt.jpg',TexLib.asphalt,t=>{ t.repeat.set(1,1); applyTex('asphalt',t); });
  TexLib.kerb=kerbTex();
  TexLib.sand=sandTex();
  texProbe('sand.jpg',TexLib.sand,t=>{ t.repeat.set(60,60); applyTex('sand',t); });
  TexLib.crowd=crowdTex();
  texProbe('crowd.jpg',TexLib.crowd,t=>{ t.repeat.set(1,1); applyTex('crowd',t); });
  TexLib.garage=garageTex();
  texProbe('pit.jpg',TexLib.garage,t=>{ t.repeat.set(1,1); applyTex('garage',t); });
  TexLib.tower=towerTex();
  texProbe('tower.jpg',TexLib.tower,t=>{ t.repeat.set(3,1); applyTex('tower',t); });
  TexLib.tent=tentTex();
  texProbe('tent.jpg',TexLib.tent,t=>{ t.repeat.set(1,1); applyTex('tent',t); });
  TexLib.adGP=adTex('SAKHIR GRAND PRIX','#fff','#d81a1a');
  TexLib.adSakhir=adTex('BAHRAIN','#fff','#0a3b8c');
  TexLib.adVocab=adTex('VOCAB WORLD','#5c3500','#ffd12e');
  TexLib.adSpeed=adTex('DESERT SPEED','#0af','#0c1220');
  buildTrackScene();
  /* รถเรา */
  carGrp=buildF1Car(0xe10600);
  scene.add(carGrp);
  wheels=carGrp.userData.wheels||[]; steerParts=carGrp.userData.front||[];
  makeCar(0xe10600,g=>{
    if(!g||g===carGrp) return;
    scene.remove(carGrp);
    carGrp=g; scene.add(carGrp);
    wheels=g.userData.wheels||[]; steerParts=g.userData.front||[];
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
  const [x,y]=mapXY(px,pz,bb);
  mapCtx.fillStyle='#7dffb0'; mapCtx.strokeStyle='#fff'; mapCtx.lineWidth=2;
  mapCtx.beginPath(); mapCtx.arc(x,y,6.5,0,Math.PI*2); mapCtx.fill(); mapCtx.stroke();
}

/* ============================================================
   🏁 ฟิสิกส์ + จับเวลา
   ============================================================ */
function physTick(dt){
  const thr=clamp(padThr+(kThr?1:0),0,1);
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
  const sc=surf==='sand'?SURF_SAND:(surf==='runoff'?SURF_RUNOFF:{grip:1,drag:0});
  /* แกนรถ */
  const fx=Math.sin(yaw),fz=Math.cos(yaw);
  const nx2=fz,nz2=-fx;
  let vF=vx*fx+vz*fz, vL=vx*nx2+vz*nz2;
  spd=Math.hypot(vx,vz);
  /* แรงตามยาว */
  let aF=0;
  if(thr>0) aF+=Math.min(ACC_CAP,PWR_A/Math.max(spd,6))*thr*(surf==='track'?1:sc.grip);
  if(braking) aF-=(BRAKE_A+BRAKE_DF*spd*spd)*Math.sign(vF||1)*(surf==='track'?1:sc.grip*0.9);
  aF-=DRAG_K*spd*spd*Math.sign(vF||0);
  aF-=(ROLL_A+sc.drag)*Math.sign(vF||0)*(Math.abs(vF)>0.5?1:Math.abs(vF)*2);
  vF+=aF*dt;
  if(braking&&Math.abs(vF)<0.6&&thr===0) vF=0;
  if(vF<-8) vF=-8;                                     // ถอยได้ช้าๆ พอ
  /* เลี้ยว: yaw rate จากมุมล้อ + จำกัดด้วยกริป (โมเมนตัม!) */
  const gripMax=Math.min(GRIP_CAP,(GRIP_BASE+GRIP_DF*spd*spd))*sc.grip;
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
  Snd.tick(spd,thr,slide>0.4&&spd>12,dt);
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
    if(!lapBest||t<lapBest){
      lapBest=t;
      if(!state.f1Best||t<state.f1Best){ state.f1Best=t; saveState(); }
      msg+='<br><span class="m-coin">⭐ BEST LAP!</span>';
    }
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
  }
  lastProg=prog;
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
    x:Math.round(px*10)/10, z:Math.round(pz*10)/10, yaw:Math.round(yaw*100)/100, w:sessionWords};
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
      yawCur:d.yaw||0,yawTgt:d.yaw||0,w:d.w||0,g:d.g,lastCt:0};
    buildPeer(uid,p);
    renderBoard();
  }
  p.n=d.n||p.n;
  p.tgt.x=d.x; p.tgt.z=d.z; p.yawTgt=d.yaw||0;
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
function camTick(dt){
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
}
let mapAt=0, relocAt=0;
function frame(dt,now){
  physTick(dt);
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
  lapStartAt=0; lapNow=0; lapBest=0; lapCount=0; cpFlags=[false,false,false]; lastProg=0;
  camInit=false; camYaw=yaw;
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
    else if(k==='w'||k==='arrowup'||k===' '){ kThr=true; Snd.start(); if(introEl.style.display!=='none') introEl.style.display='none'; }
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
