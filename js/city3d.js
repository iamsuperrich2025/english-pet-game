"use strict";
/* ============================================================
   city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 863)
   ------------------------------------------------------------
   · เมือง toy-town พาสเทลบนเกาะลอยฟ้า (ออกแบบเอง ไม่อิงเกม city-builder ใด — กันลิขสิทธิ์)
   · กล้อง: 1 นิ้วลาก = เลื่อนแผนที่ · 2 นิ้ว = หมุน(บิด)/เอียง(ลากแนวตั้ง)/ซูม(ถ่าง-หนีบ)
     เมาส์: ลากซ้าย=เลื่อน · ลากขวา=หมุน/เอียง · ล้อ=ซูม
   · อาคาร 28 หลังผูกลิงก์จริงของเกม → แตะแล้วเด้งไป index_classic.html?go=<key>
     (ตัวรับอยู่ท้าย js/main.js — เปิดแผง/หน้า/โลก 3D ให้เองหลังบูต)
   · ผู้เล่นจริง: /presence = ใครออนไลน์+ทำอะไร → ยืนหน้าอาคารนั้น
     /world/<map> + /wroom/<map> = ใครอยู่โลกขับรถ/มอไซค์/เฮลิฯ/โดรน → รถวิ่ง/บินจริงในเมือง
     ตัวละคร = blk1..blk88 (จาก /leaderboard/<uid>.ba · blk1-8 หุ่นบล็อก 3D · blk9+ ภาพ 2D)
   · แตะตัวละคร/ยานพาหนะ = การ์ดโปรไฟล์ (ชื่อ+สัญลักษณ์ชั้น — กฎคุ้มครองเด็ก · เหรียญ/ทรัพย์สิน)
   · โหลดเอง: Firebase compat SDK (อ่านอย่างเดียว ไม่เขียน DB) — ล้มเหลว = โหมดชมเมืองเฉยๆ ไม่พัง
   deps: THREE (js/vendor/three.min.js) + FIREBASE_CONFIG (js/data/firebase-config.js)
   ============================================================ */
(function(){

/* ============================================================
   ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
   ============================================================ */
const ISLAND_R = 95;              // รัศมีเกาะ
const RING_IN  = 21,  RING_OUT = 48;   // รัศมีกลางถนนวงใน/วงนอก
const BAND1_R  = 34,  BAND2_R  = 63;   // รัศมีแถวอาคารชั้นใน/ชั้นนอก
const GROUND_TEX_PX = 2048, GROUND_SPAN = 200;   // canvas พื้น ↔ หน่วยโลก
const NIGHT = (()=>{ // 🌙 รอบ 891: อ่านสวิตช์เดียวกับล็อบบี้เดิม — ตรรกะ readMode() ของ NightUI ใน index_classic.html เป๊ะ
  // 'vwNightMode' = ตัวตัดสินจริง ('day'/'night' · ไม่มีคีย์/ค่าอื่น = อัตโนมัติ 19:00-06:00)
  // 'vwNightUi' ('1'/'0' คีย์เดิมรอบ 882) = ใช้เฉพาะผู้ใช้เก่าที่ยังไม่มีคีย์ใหม่
  // ⛔ ห้ามเขียน/ล้าง localStorage ที่นี่ — กฎล้างค่าของรอบ 882 ทำให้การปักโหมดจากหน้า ⚙️ ตั้งค่า (รอบ 889)
  //    หายเงียบ ๆ ทันทีที่เดินเข้าเมือง 3D (ปัก "กลางคืน" ตอน 2 ทุ่ม = ตรงกับอัตโนมัติพอดี → โดนล้าง)
  // · override ?day / ?night (ไว้เทสต์+เล่นสนุก)
  try{ const q=new URLSearchParams(location.search);
       if(q.has('day')) return false; if(q.has('night')) return true; }catch(e){}
  // 🇹🇭 รอบ 988: อ่านเวลาไทย (thaitime.js) ไม่ใช่นาฬิกาเครื่อง — เครื่องตั้งโซนต่างประเทศเคยได้กลางคืนกลางวันแสก ๆ
  const autoNight = ()=>{ const h = (typeof thHour==='function' ? thHour() : new Date().getHours()); return h>=19 || h<6; };
  try{
    const m = localStorage.getItem('vwNightMode');
    if(m==='day')   return false;
    if(m==='night') return true;
    if(m) return autoNight();                       // ค่าแปลก/'auto' = อัตโนมัติ (ไม่ตกไปอ่านคีย์เดิม)
    const s = localStorage.getItem('vwNightUi');    // ผู้ใช้เก่า (มีแต่คีย์รอบ 882) → อ่านเป็นโหมดปักตามเดิม
    return s==='1' ? true : s==='0' ? false : autoNight();
  }catch(e){ return autoNight(); }
})();

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function hash(s){ let h=0; s=String(s||''); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
function rnd(a,b){ return a+Math.random()*(b-a); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
const TAU = Math.PI*2;

/* 🧱 ตัวละครบล็อก 8 ตัวแรก — ค่าสีชุดเดียวกับ BLOCK_AVATARS ใน js/adventure3d.js (คัดลอกเฉพาะ data
   เพราะไฟล์นั้น 12K บรรทัดโหลดในหน้าเมืองไม่คุ้ม) · blk9-88 ใช้ภาพ img/blocks/ เป็นป้าย 3 มิติ */
const BLK8 = {
  blk1:{shirt:0xe53935, pants:0x1e58c8, skin:0xffcf9e, hair:0x2b2320, style:'flat'},
  blk2:{shirt:0x29b6f6, pants:0x274a8f, skin:0xffd9ae, hair:0x6d4c2f, style:'tall'},
  blk3:{shirt:0x43a047, pants:0x7a6a4f, skin:0xf2b98a, hair:0xef6c00, style:'cap'},
  blk4:{shirt:0xfb8c00, pants:0x5d4037, skin:0xffcf9e, hair:0x232323, style:'pony', blush:true},
  blk5:{shirt:0x8e24aa, pants:0x4e5a63, skin:0xffd9ae, hair:0xffca28, style:'flat'},
  blk6:{shirt:0xf06292, pants:0xfafafa, skin:0xffe0bd, hair:0x8d5a3b, style:'pony', blush:true},
  blk7:{shirt:0xfdd835, pants:0x33691e, skin:0xf2b98a, hair:0x232323, style:'cap'},
  blk8:{shirt:0x4db6ac, pants:0x37474f, skin:0xffd9ae, hair:0xf5f5f5, style:'tall', blush:true},
};
/* 🚗 สีรถตามรหัส 'cNN' ท้าย av (car_01..10 — เทียบโทนจาก texture จริงแบบคร่าว) */
const CAR_COL = {c01:0xd32f2f,c02:0x1976d2,c03:0x43a047,c04:0xf9a825,c05:0x8e24aa,
                 c06:0x00897b,c07:0xef6c00,c08:0x546e7a,c09:0xec407a,c10:0x5d4037};

/* 🎖️ สัญลักษณ์ระดับชั้น — ตรรกะเดียวกับ gradeSymbol ใน js/util.js (กฎคุ้มครองเด็ก 28 ก.ค. 2026:
   ทุกที่ที่มีชื่อ ต้องเห็นระดับชั้น) — ที่นี่วาดลง canvas จึงถือชุดย่อของตัวเอง */
function gradeStars(grade){
  const g = String(grade==null?'':grade).trim();
  if(!g) return null;
  let m = /^ป\.([1-6])$/.exec(g);
  if(m) return {sym:'★'.repeat(+m[1]), col:'#e8eef6', glow:'rgba(130,175,225,.95)'};
  m = /^ม\.([1-6])$/.exec(g);
  if(m) return {sym:'★'.repeat(+m[1]), col:'#ffd451', glow:'rgba(255,170,30,.95)'};
  if(g==='ปริญญาตรี')        return {sym:'💎',  col:'#9fe8ff', glow:'rgba(120,225,255,.95)'};
  if(g==='สูงกว่าปริญญาตรี') return {sym:'💎💎', col:'#9fe8ff', glow:'rgba(120,225,255,.95)'};
  return {sym:'☆', col:'#e8eef6', glow:'rgba(130,175,225,.95)'};
}

/* ---------- three.js พื้นฐาน ---------- */
let scene, camera, renderer, rayc, clock;
const clickables = [];        // mesh ที่กดได้ (อาคาร) — userData.bld
const actorPick  = [];        // mesh ที่กดได้ (ตัวละคร/ยาน) — userData.actor
const tickers    = [];        // fn(dt,t) เรียกทุกเฟรม

const MAT = {};               // material cache สีล้วน
function mat(color, opt){
  if(opt) return new THREE.MeshLambertMaterial(Object.assign({color}, opt));
  return MAT[color] || (MAT[color] = new THREE.MeshLambertMaterial({color}));
}
const GEO = {};
function box(w,h,d){ const k='b'+w+'_'+h+'_'+d; return GEO[k]||(GEO[k]=new THREE.BoxGeometry(w,h,d)); }
function cyl(rt,rb,h,seg){ const k='c'+rt+'_'+rb+'_'+h+'_'+seg; return GEO[k]||(GEO[k]=new THREE.CylinderGeometry(rt,rb,h,seg||12)); }
function M(geo, m, x,y,z, ry){
  const o = new THREE.Mesh(geo, m);
  o.position.set(x||0, y||0, z||0);
  if(ry) o.rotation.y = ry;
  return o;
}

/* ============================================================
   📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
   pitch = มุมเงยจากพื้น (1.55 ≈ bird-eye 90° ตรงหัว · ต่ำสุด 0.32)
   ============================================================ */
const rig = {
  tx:0, tz:6, yaw:0.0, pitch:0.95, dist:88,
  vx:0, vz:0, vyaw:0,                 // ความเร็วคงค้าง (เฉื่อย)
  PITCH_MIN:0.32, PITCH_MAX:1.55, DIST_MIN:26, DIST_MAX:150, PAN_MAX:100,
  apply(){
    this.tx = clamp(this.tx, -this.PAN_MAX, this.PAN_MAX);
    this.tz = clamp(this.tz, -this.PAN_MAX, this.PAN_MAX);
    this.pitch = clamp(this.pitch, this.PITCH_MIN, this.PITCH_MAX);
    this.dist  = clamp(this.dist,  this.DIST_MIN,  this.DIST_MAX);
    const r = this.dist * Math.cos(this.pitch);
    camera.position.set(this.tx + r*Math.sin(this.yaw),
                        Math.max(3, this.dist*Math.sin(this.pitch)),
                        this.tz + r*Math.cos(this.yaw));
    camera.lookAt(this.tx, 0, this.tz);
  }
};

/* จุดบนพื้น (y=0) ใต้ pointer — ใช้ทำ "ลากแล้วแผนที่ตามนิ้ว" เป๊ะๆ */
const _plane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
const _v3 = new THREE.Vector3();
function groundAt(cx, cy){
  const nx = (cx/renderer.domElement.clientWidth)*2-1,
        ny = -(cy/renderer.domElement.clientHeight)*2+1;
  rayc.setFromCamera({x:nx,y:ny}, camera);
  return rayc.ray.intersectPlane(_plane, _v3) ? {x:_v3.x, z:_v3.z} : null;
}

const ptr = new Map();        // pointerId → {x,y}
let panAnchor=null, twoStart=null, downInfo=null;
function setupInput(el){
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', e=>{
    try{ el.setPointerCapture(e.pointerId); }catch(err){}   // synthetic/ปากกาบางรุ่นไม่มี pointer จริง
    ptr.set(e.pointerId, {x:e.clientX, y:e.clientY, b:e.button});
    rig.vx=rig.vz=rig.vyaw=0;
    if(ptr.size===1){
      panAnchor = groundAt(e.clientX, e.clientY);
      downInfo = {x:e.clientX, y:e.clientY, t:performance.now(), id:e.pointerId, b:e.button};
    }else if(ptr.size===2){
      panAnchor=null; downInfo=null;
      twoStart = twoState();
    }
  });
  el.addEventListener('pointermove', e=>{
    if(!ptr.has(e.pointerId)) return;
    const p = ptr.get(e.pointerId);
    const dx = e.clientX-p.x, dy = e.clientY-p.y;
    p.x=e.clientX; p.y=e.clientY;
    if(ptr.size===1){
      if(p.b===2){                       // เมาส์ปุ่มขวา = หมุน/เอียง
        rig.yaw   -= dx*0.005;
        rig.pitch += dy*0.005;
        rig.apply();
      }else if(panAnchor){               // 1 นิ้ว/ปุ่มซ้าย = เลื่อนแผนที่ (จุดพื้นเดิมอยู่ใต้นิ้วตลอด)
        const g = groundAt(e.clientX, e.clientY);
        if(g){
          rig.vx = panAnchor.x-g.x; rig.vz = panAnchor.z-g.z;
          rig.tx += rig.vx; rig.tz += rig.vz;
          rig.apply();
        }
      }
    }else if(ptr.size===2 && twoStart){  // ✌️ 2 นิ้ว = บิดหมุน + หนีบซูม + ลากตั้งเอียง
      const s = twoState();
      /* 🔄 รอบ 873: นิ้วบิดตามเข็ม = เมืองหมุนตามเข็ม (แบบ SimCity — เดิมกลับทิศ ผู้ใช้สั่งแก้)
         + normalize มุมเข้า (-π,π] กันมุมนิ้ว atan2 ข้าม ±180° แล้วเมืองหมุนวูบเต็มรอบ (บั๊กแฝงเดิม) */
      const dAng = s.ang - twoStart.ang;
      rig.yaw   = twoStart.yaw   + Math.atan2(Math.sin(dAng), Math.cos(dAng));
      rig.dist  = clamp(twoStart.dist0 * (twoStart.len/Math.max(20,s.len)), rig.DIST_MIN, rig.DIST_MAX);
      rig.pitch = twoStart.pitch + (s.midY - twoStart.midY)*0.006;
      rig.apply();
    }
  });
  const up = e=>{
    if(ptr.size===1 && downInfo && e.pointerId===downInfo.id){
      const dt = performance.now()-downInfo.t,
            mv = Math.hypot(e.clientX-downInfo.x, e.clientY-downInfo.y);
      if(dt<450 && mv<9 && downInfo.b!==2) onTap(e.clientX, e.clientY);   // แตะสั้นไม่ลาก = คลิก
    }
    ptr.delete(e.pointerId);
    if(ptr.size===1){ const f=[...ptr.values()][0]; panAnchor=groundAt(f.x,f.y); twoStart=null; }
    if(ptr.size===0){ panAnchor=null; twoStart=null; downInfo=null; }
  };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('wheel', e=>{
    e.preventDefault();
    rig.dist *= (e.deltaY>0 ? 1.09 : 0.92);
    rig.apply();
  }, {passive:false});
  el.addEventListener('contextmenu', e=>e.preventDefault());
}
function twoState(){
  const a=[...ptr.values()];
  return { len:Math.hypot(a[1].x-a[0].x, a[1].y-a[0].y),
           ang:Math.atan2(a[1].y-a[0].y, a[1].x-a[0].x),
           midY:(a[0].y+a[1].y)/2,
           yaw:rig.yaw, pitch:rig.pitch, dist0:rig.dist };
}

/* ============================================================
   🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
   ============================================================ */
function cvs(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
function ctex(canvas){
  const t = new THREE.CanvasTexture(canvas);
  t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return t;
}

/* 🏝️ พื้นเกาะทั้งใบวาดใน canvas เดียว: หญ้า + ถนนวงแหวน 2 ชั้น + ถนนแฉก 4 ทิศ + ลานพลาซ่า */
function groundTexture(){
  const c = cvs(GROUND_TEX_PX, GROUND_TEX_PX), g = c.getContext('2d');
  const S = GROUND_TEX_PX/GROUND_SPAN;              // px ต่อหน่วยโลก
  const cx = GROUND_TEX_PX/2, cz = GROUND_TEX_PX/2;
  // หญ้า 2 โทน + จุดสุ่มให้มีชีวิต
  g.fillStyle = NIGHT ? '#3c7a44' : '#7ec857';
  g.fillRect(0,0,c.width,c.height);
  const R=(seed=>()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;})(42);
  g.fillStyle = NIGHT ? 'rgba(52,110,60,.55)' : 'rgba(108,190,66,.55)';
  for(let i=0;i<420;i++){ const r=6+R()*22; g.beginPath(); g.arc(R()*c.width, R()*c.height, r, 0, TAU); g.fill(); }
  g.fillStyle = NIGHT ? 'rgba(255,244,180,.05)' : 'rgba(255,255,255,.10)';
  for(let i=0;i<240;i++){ g.beginPath(); g.arc(R()*c.width, R()*c.height, 1.6+R()*2.4, 0, TAU); g.fill(); }

  const ring = (r, w, col)=>{ g.strokeStyle=col; g.lineWidth=w*S; g.beginPath(); g.arc(cx,cz,r*S,0,TAU); g.stroke(); };
  const SIDE = NIGHT ? '#9aa3ad' : '#cfd6dd', ROAD = NIGHT ? '#454c58' : '#5a6270';
  // ทางเท้า (กว้างกว่าถนน) → ถนน → เส้นแบ่งเลน
  ring(RING_IN, 11, SIDE);   ring(RING_OUT, 12.5, SIDE);
  ring(RING_IN, 7.5, ROAD);  ring(RING_OUT, 9, ROAD);
  g.setLineDash([10,12]); g.lineCap='butt';
  ring(RING_IN, 0.45, '#f4f6f8'); ring(RING_OUT, 0.45, '#f4f6f8');
  g.setLineDash([]);
  // ถนนแฉก N/E/S/W เชื่อมสองวง + ทางม้าลาย
  const spoke=(ang)=>{
    g.save(); g.translate(cx,cz); g.rotate(ang);
    g.fillStyle=SIDE; g.fillRect((RING_IN-2)*S, -5.5*S, (RING_OUT-RING_IN+4)*S, 11*S);
    g.fillStyle=ROAD; g.fillRect((RING_IN-2)*S, -3.75*S, (RING_OUT-RING_IN+4)*S, 7.5*S);
    g.fillStyle='#f4f6f8';
    for(let x=RING_IN+4; x<RING_OUT-4; x+=5) g.fillRect(x*S, -0.22*S, 2.4*S, 0.44*S);
    for(let i=-3;i<=3;i++) g.fillRect((RING_IN+0.6)*S, (i*1.5-0.55)*S, 1.7*S, 1.1*S);   // ทางม้าลาย
    g.restore();
  };
  [0, Math.PI/2, Math.PI, -Math.PI/2].forEach(spoke);
  // 🏛️ ลานพลาซ่ากลาง: กระเบื้องตาราง 2 ครีม + ขอบวงทอง
  g.save(); g.beginPath(); g.arc(cx,cz,16.5*S,0,TAU); g.clip();
  g.fillStyle = NIGHT ? '#c9b98f' : '#ecd9a8'; g.fillRect(cx-17*S, cz-17*S, 34*S, 34*S);
  g.fillStyle = NIGHT ? '#b8a87f' : '#dcc48d';
  const T=3.4*S;
  for(let i=-6;i<6;i++) for(let j=-6;j<6;j++) if((i+j)&1) g.fillRect(cx+i*T, cz+j*T, T, T);
  g.restore();
  g.strokeStyle = '#e8b64c'; g.lineWidth = 1.1*S;
  g.beginPath(); g.arc(cx,cz,16*S,0,TAU); g.stroke();
  // ทางเดินดินไปแถวอาคารชั้นนอก
  g.strokeStyle = NIGHT ? '#7d6f52' : '#d9c390'; g.lineWidth=2.6*S; g.lineCap='round';
  for(let a=0;a<TAU;a+=TAU/24){
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*(RING_OUT+4)*S, cz+Math.sin(a)*(RING_OUT+4)*S);
    g.lineTo(cx+Math.cos(a)*(BAND2_R-4)*S,  cz+Math.sin(a)*(BAND2_R-4)*S);
    g.stroke();
  }
  return ctex(c);
}

/* 🪟 ผิวตึกมีหน้าต่างจริง (สุ่มดวงไฟตอนกลางคืน) — คืน texture ใช้ซ้ำตาม key */
const _wallTex = {};
function wallTex(base, win, rows, cols, lit){
  const key = base+'_'+win+'_'+rows+'_'+cols+'_'+(lit?1:0);
  if(_wallTex[key]) return _wallTex[key];
  const c = cvs(256,256), g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0,0,256,256);
  g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(0,246,256,10);      // เงาโคนตึก
  const R=(seed=>()=>{seed=(seed*48271)%2147483647;return seed/2147483647;})(hash(key)%1000+7);
  const cw=256/cols, ch=256/rows;
  for(let r=0;r<rows;r++) for(let q=0;q<cols;q++){
    const x=q*cw+cw*0.22, y=r*ch+ch*0.2, w=cw*0.56, h=ch*0.58;
    const on = lit && R()<0.55;
    g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x-1.5, y-1.5, w+3, h+3);   // กรอบหน้าต่างลึก
    g.fillStyle = on ? (R()<0.5?'#ffd978':'#ffe9a8') : win;
    g.fillRect(x, y, w, h);
    if(!on){ g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(x, y, w, h*0.32); }   // เงาสะท้อนกระจก
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x, y+h, w, 2.2);                    // ขอบหน้าต่างล่าง
  }
  return _wallTex[key] = ctex(c);
}
function wallMat(base, win, rows, cols){
  return new THREE.MeshLambertMaterial({map:wallTex(base,win,rows,cols,NIGHT)});
}

/* 🏷️ ป้ายชื่อร้านติดหน้าตึก (canvas → plane) */
function shopSign(text, bg, fg){
  const c = cvs(512,128), g = c.getContext('2d');
  g.fillStyle = bg||'#ffffff'; roundRect(g, 4, 8, 504, 112, 26); g.fill();
  g.strokeStyle='rgba(0,0,0,.18)'; g.lineWidth=5; roundRect(g, 4, 8, 504, 112, 26); g.stroke();
  g.fillStyle = fg||'#40444c';
  g.font = '700 58px system-ui, sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(text, 256, 68);
  const m = new THREE.MeshBasicMaterial({map:ctex(c), transparent:true});
  return new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.15), m);
}
function roundRect(g,x,y,w,h,r){
  g.beginPath();
  g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r);
  g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath();
}

/* 🎈 ไอคอนลอยหัวตึก (emoji ใหญ่ + ป้ายไทย) — sprite เด้งดึ๋งเรียกให้กด */
function iconSprite(ico, label){
  const c = cvs(256,300), g = c.getContext('2d');
  g.beginPath(); g.arc(128,110,92,0,TAU);
  g.fillStyle='rgba(255,255,255,.96)'; g.fill();
  g.lineWidth=10; g.strokeStyle='#ffb300'; g.stroke();
  g.font='120px system-ui, sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(ico, 128, 118);
  g.font='700 44px system-ui, sans-serif';
  g.lineWidth=12; g.strokeStyle='rgba(30,40,70,.85)'; g.lineJoin='round';
  g.strokeText(label, 128, 262); g.fillStyle='#fff'; g.fillText(label, 128, 262);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:ctex(c), transparent:true, depthTest:true}));
  sp.scale.set(5.6, 6.55, 1);
  return sp;
}

/* 🔖 ป้ายชื่อผู้เล่น: ชื่อ + สัญลักษณ์ชั้นใต้ชื่อ (ดาวเงิน/ทอง/เพชร — ห้ามตัดออก) */
function nameSprite(name, grade, tint){
  const c = cvs(512,168), g = c.getContext('2d');
  const nm = String(name||'ผู้เล่น').slice(0,16);
  g.fillStyle='rgba(16,26,48,.72)'; roundRect(g, 20, 10, 472, 96, 30); g.fill();
  g.strokeStyle = tint||'rgba(120,200,255,.85)'; g.lineWidth=4; roundRect(g, 20, 10, 472, 96, 30); g.stroke();
  g.font='700 52px system-ui, sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  g.fillStyle='#ffffff'; g.fillText(nm, 256, 56, 440);
  const gs = gradeStars(grade);
  if(gs){
    g.font='700 46px system-ui, sans-serif';
    g.shadowColor=gs.glow; g.shadowBlur=16; g.fillStyle=gs.col;
    g.fillText(gs.sym, 256, 138, 460);
    g.shadowBlur=0;
  }
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:ctex(c), transparent:true, depthTest:false}));
  sp.scale.set(6.6, 2.17, 1);
  sp.renderOrder = 20;
  return sp;
}

/* เงากลมจางใต้ตัว (ไม่ใช้ shadow map — มือถือลื่นกว่า) */
let _blobTex=null;
function blobShadow(r){
  if(!_blobTex){
    const c=cvs(128,128), g=c.getContext('2d');
    const gr=g.createRadialGradient(64,64,8,64,64,60);
    gr.addColorStop(0,'rgba(0,0,0,.34)'); gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr; g.fillRect(0,0,128,128);
    _blobTex=ctex(c);
  }
  const m=new THREE.Mesh(new THREE.PlaneGeometry(r*2,r*2),
    new THREE.MeshBasicMaterial({map:_blobTex, transparent:true, depthWrite:false}));
  m.rotation.x=-Math.PI/2; m.position.y=0.06;
  return m;
}

/* ============================================================
   🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
   ทุกตัวคืน Group หันหน้า +Z · ใส่ userData.h = ความสูง (จุดแขวนไอคอน)
   ============================================================ */
const P = {   // จานสีพาสเทล toy-town
  cream:'#fff4dc', peach:'#ffd9b0', pink:'#ffc7d8', mint:'#c9f0d8', sky:'#cfeaff',
  lav:'#e3d4ff', lemon:'#fff3a6', coral:'#ffb4a2', teal:'#bfe8e2, ',
};
function parapet(g, w, d, y, col){
  const t=0.34, m2=mat(col);
  g.add(M(box(w+0.2,0.55,t), m2, 0, y, d/2), M(box(w+0.2,0.55,t), m2, 0, y, -d/2),
        M(box(t,0.55,d+0.2), m2, w/2, y, 0), M(box(t,0.55,d+0.2), m2, -w/2, y, 0));
}
function roofProps(g, w, d, y, seed){
  const R=(s=>()=>{s=(s*48271)%2147483647;return s/2147483647;})(seed||7);
  const ac=M(box(1.3,0.8,1.0), mat(0xb8c4cc), -w*0.28, y+0.4, -d*0.2); g.add(ac);
  ac.add(M(cyl(0.34,0.34,0.1,10), mat(0x8a969e), 0,0.45,0));
  if(R()>0.4){ const tk=M(cyl(0.75,0.75,1.5,10), mat(0x90a4ae), w*0.26, y+0.75, d*0.18); g.add(tk);
               tk.add(M(cyl(0.85,0.85,0.18,10), mat(0x78909c), 0,0.8,0)); }
  if(R()>0.5){ g.add(M(cyl(0.05,0.05,2.6,6), mat(0x616e78), w*0.05, y+1.3, -d*0.3));
               g.add(M(new THREE.SphereGeometry(0.16,8,6), mat(0xff5252), w*0.05, y+2.6, -d*0.3)); }
}
/* 🚪 รอบ 890: บานประตูแขวนบน "บานพับ" หมุนเปิดได้จริง (ตัวขับ+เสียงอยู่โซน 🚪🔊 รอบ 890)
   ขนาด/ตำแหน่งบานคงเดิมเป๊ะ → ตอนปิดตึกทุกหลังหน้าตาเหมือนก่อนรอบนี้ทุกประการ
   หมุนตัวบานเองไม่ได้ (จุดหมุนอยู่กลางบาน = บานจมทะลุผนัง) จึงต้องมี Group ที่ขอบซ้ายเป็นบานพับ */
const DOOR_W = 1.8, DOOR_H = 2.5;
/* 🔦 รอบ 892/897: ของกลางคืนหน้าประตู — ลำแสงทาบพื้น + ดวงเรืองที่ช่องประตู
   แยกออกมาเป็นตัวเดียวใช้ร่วมกันทั้ง "บานหมุน" (doorAt) และ "ประตูม้วน" (rollAt)
   กลางวันไม่สร้างวัตถุอะไรเลย · ความเข้ม/ขนาดถูกไถตามองศาที่บานเปิดใน applyDoorPose */
function doorNightFx(g, x, y, z, w, reach){
  if(!NIGHT) return;
  /* ระนาบนอนกับพื้น หมุน −90° รอบ X → ขอบ "สว่างสุด" (แถวบนของ canvas) ไปอยู่ฝั่งติดธรณีประตูพอดี */
  const sp = new THREE.Mesh(new THREE.PlaneGeometry(w*2.2, reach),
    new THREE.MeshBasicMaterial({map:doorSpillTexture(), transparent:true, opacity:0,
                                 depthWrite:false, blending:THREE.AdditiveBlending}));
  sp.rotation.x = -Math.PI/2;
  sp.position.set(x, 0.05, z+reach/2);
  g.add(sp); _lastSpill.push(sp);
  /* ดวงเรืองรอบช่องประตู — ตัวนี้แหละที่ทำให้ "ตึกที่มีคนอยู่" ดูออกตั้งแต่มุมมองทั้งเมือง
     (แบบเดียวกับโคมไฟถนน · ลำแสงพื้นอย่างเดียวจางเกินไปเมื่อมองไกล) */
  const gl = new THREE.Sprite(new THREE.SpriteMaterial({map:_glowTex(), transparent:true, opacity:0,
                                                        depthWrite:false, blending:THREE.AdditiveBlending}));
  gl.position.set(x, y, z+0.4);
  gl.userData.gs = clamp(w/DOOR_W, 0.7, 1.6);     // ช่องกว้าง = ดวงไฟใหญ่ตาม (โรงรถ/hangar ไม่ใช่ประตูบ้าน)
  g.add(gl); _lastGlow.push(gl);
}
function doorAt(g, z, col){
  const hinge = new THREE.Group();
  hinge.position.set(-DOOR_W/2, 0, z+0.12);                     // บานพับ = ขอบซ้ายของช่องประตู
  hinge.add(M(box(DOOR_W,DOOR_H,0.18), mat(col||0x7a5230), DOOR_W/2, 1.25, 0));
  hinge.add(M(new THREE.SphereGeometry(0.1,8,6), mat(0xf5d97a), DOOR_W-0.26, 1.22, 0.13));  // ลูกบิดริมบาน (ดูออกว่าบานพับอยู่ฝั่งไหน)
  g.add(hinge);
  /* ช่องประตูหลังบาน — เปิดแล้วเห็น "ทางเข้า" ไม่ใช่ผนังทึบ (เล็กกว่าบานเล็กน้อย ตอนปิดจึงถูกบานบังมิด)
     🌙 รอบ 892: กลางคืนเปลี่ยนเป็นแผ่นเรืองแสงอุ่น (MeshBasic = ไม่กินแสงฉาก สว่างเสมอ) = ไฟในตึกเปิดอยู่ */
  g.add(M(box(DOOR_W-0.14, DOOR_H-0.14, 0.05),
          NIGHT ? new THREE.MeshBasicMaterial({color:0xffc978}) : mat(0x1e150d), 0, 1.25, z+0.03));
  g.add(M(box(2.3,0.3,0.7), mat(0xffffff), 0, 0.15, z+0.25));   // ธรณีประตู
  _lastDoor = hinge; _lastKind = 'swing';                       // buildCity หยิบไปผูกกับ key ตึก
  doorNightFx(g, 0, 1.35, z, DOOR_W, 4.6);                      // 🌙 รอบ 892: ไฟลอด/ลำแสงพื้น (กลางวันไม่สร้างอะไรเลย)
  return hinge;
}
/* ============================================================
   🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
   บาน = แผ่นสแลตเหล็กแขวนอยู่ "ใต้คานม้วน" ที่ขอบบนช่องประตู · เปิด = ย่อ scale.y ของกลุ่ม
   ที่จุดยึดอยู่ขอบบน → บานหดขึ้นไปม้วนเก็บในคาน (ถ้าเลื่อนขึ้นเฉย ๆ บานจะโผล่ทะลุหลังคา)
   o = {bays:[x ของแต่ละช่อง], w, h, z, hw:กว้างคานม้วน, col, rails:ราง 2 ข้าง, reach:ลำแสงพื้น}
   ⚠️ z = "ระนาบผิวหน้าตึก" (ไม่ใช่ตำแหน่งบาน) — ทุกชิ้นถูกยกออกมา "หน้าผนัง" ตาม Z_* ข้างล่าง
      เคยพลาด: วางช่องมืดไว้หลังบาน (z−0.07) = จมอยู่ในกล่องผนัง เปิดประตูแล้วเห็นผนังทึบเหมือนเดิม
      (ยิง raycast ยืนยัน: โดนกล่องผนัง 9×3.6×7 ก่อนช่องมืด 0.03 หน่วยเสมอ) · โรงเก็บหุ่นหนักกว่านั้น
      เพราะ CylinderGeometry(...,openEnded=false) ปิดหัวท้ายด้วยฝาครึ่งวงกลม = หน้า hangar เป็นผนังทึบ */
const ROLL_Z_HOLE = 0.03, ROLL_Z_DOOR = 0.12, ROLL_Z_RAIL = 0.10, ROLL_Z_SILL = 0.20;

let _slatT = null;
function slatTexture(){
  if(_slatT) return _slatT;
  const c = cvs(64,64), x = c.getContext('2d');
  x.fillStyle='#9aa7b0'; x.fillRect(0,0,64,64);
  for(let y=0;y<64;y+=10){                       // สแลตแนวนอน: ร่องเงาบน + ไฮไลต์ล่าง = เห็นเป็นซี่ ๆ
    x.fillStyle='#7c8a94'; x.fillRect(0,y,64,4);
    x.fillStyle='#b8c4cc'; x.fillRect(0,y+4,64,2);
  }
  return _slatT = ctex(c);
}
function rollAt(g, o){
  const bays = o.bays || [0], w = o.w || 3.0, h = o.h || 2.6, z = o.z || 0;
  const hw = o.hw || (w+0.3);
  const cont = new THREE.Group();
  const slatMat = new THREE.MeshLambertMaterial({map:slatTexture(), color:o.col||0xffffff});
  bays.forEach(x=>{
    /* ช่องมืด "หน้าผนัง" (ไม่ใช่หลังผนัง) — ยกบานขึ้นแล้วเห็นเป็นทางเข้ามืด ๆ ไม่ใช่ผนังทึบ
       เล็กกว่าบานทุกด้าน ตอนปิดจึงถูกบานบังมิด · 🌙 กลางคืนเป็นแผ่นเรืองแสงอุ่น (MeshBasic = ไม่กินแสงฉาก) */
    g.add(M(box(w-0.12, h-0.06, 0.05),
            NIGHT ? new THREE.MeshBasicMaterial({color:0xffc978}) : mat(0x18130d), x, (h-0.06)/2, z+ROLL_Z_HOLE));
    g.add(M(box(hw, 0.36, 0.42), mat(o.house||0x8b98a2), x, h+0.10, z+ROLL_Z_RAIL));   // คานม้วน (บานหดหายเข้าไปในนี้)
    if(o.rails !== false) [-1,1].forEach(s=>
      g.add(M(box(0.12, h+0.06, 0.2), mat(0x78868f), x+s*(w/2+0.07), (h+0.06)/2, z+ROLL_Z_RAIL)));
    g.add(M(box(w+0.3, 0.14, 0.5), mat(0xcfd8dc), x, 0.07, z+ROLL_Z_SILL));            // ธรณี/รางล่าง
    const p = new THREE.Group();
    p.position.set(x, h, z+ROLL_Z_DOOR);                                        // จุดยึด = ขอบบน → ย่อ scale.y แล้วบานหดขึ้น
    p.add(M(new THREE.BoxGeometry(w, h, 0.1), slatMat, 0, -h/2, 0));
    cont.add(p);
    doorNightFx(g, x, h*0.55, z, w, o.reach || 4.2);
  });
  g.add(cont);
  _lastDoor = cont; _lastKind = 'roll';
  return cont;
}
function awning(g, w, y, z, col1, col2){
  const geo = new THREE.CylinderGeometry(1.1, 1.1, w, 12, 1, false, 0, Math.PI);
  const c = cvs(64,64), x = c.getContext('2d');
  for(let i=0;i<8;i++){ x.fillStyle = i&1?col1:col2; x.fillRect(i*8,0,8,64); }
  const m = new THREE.MeshLambertMaterial({map:ctex(c)});
  const aw = new THREE.Mesh(geo, m);
  aw.rotation.z = Math.PI/2; aw.rotation.y = Math.PI/2;
  aw.scale.set(1, 1, 0.55);
  aw.position.set(0, y, z);
  g.add(aw);
}
/* 🏬 ตึกหลัก 2-3 ชั้นถอยหลั่น + เสามุม + หน้าต่างจริง */
function bTower(o){
  const g = new THREE.Group();
  const w=o.w||8, d=o.d||8, floors=o.f||3, fh=2.6;
  let y=0, ww=w, dd=d;
  for(let i=0;i<floors;i++){
    const h = fh + (i===0?0.6:0);
    const bm = new THREE.MeshLambertMaterial({map:wallTex(o.col, '#bfe3f2', 2, Math.max(3,Math.round(ww)), NIGHT)});
    g.add(M(new THREE.BoxGeometry(ww,h,dd), bm, 0, y+h/2, 0));
    g.add(M(box(ww+0.5, 0.34, dd+0.5), mat(o.trim||0xffffff), 0, y+h, 0));   // คิ้วคั่นชั้น
    if(i===0){ [-1,1].forEach(s=>g.add(M(box(0.55,h,0.55), mat(o.trim||0xffffff), s*(ww/2-0.2), h/2, dd/2-0.2))); }
    y += h; ww *= (o.setback||0.86); dd *= (o.setback||0.86);
  }
  parapet(g, ww, dd, y+0.2, o.trim||0xffffff);
  roofProps(g, ww, dd, y, hash(o.col));
  doorAt(g, d/2+0.02, o.door);
  if(o.sign){ const s=shopSign(o.sign, o.signBg, o.signFg); s.position.set(0, 3.6, d/2+0.12); g.add(s); }
  g.userData.h = y+2.2;
  return g;
}
/* 🏪 ร้านค้าชั้นเดียว+กันสาดลาย + ของหน้าร้าน */
function bShop(o){
  const g = new THREE.Group();
  const w=o.w||7.5, d=o.d||6.5;
  g.add(M(new THREE.BoxGeometry(w,3.4,d), wallMat(o.col, '#d4ecf7', 1, 4), 0, 1.7, 0));
  g.add(M(box(w+0.6,0.5,d+0.6), mat(o.trim||0xffffff), 0, 3.6, 0));
  const roof = M(cyl(0.01, w*0.62, 1.7, 4), mat(o.roof||0xe57373), 0, 4.55, 0, Math.PI/4);   // หลังคาปิรามิดป้าน
  roof.scale.z = d/w; g.add(roof);
  awning(g, w*0.8, 2.6, d/2+0.5, o.aw1||'#ff7043', o.aw2||'#fff3e0');
  doorAt(g, d/2+0.02, o.door);
  [-1,1].forEach(s=>{     // กระถางต้นไม้หน้าร้าน
    g.add(M(box(0.7,0.55,0.7), mat(0xa1887f), s*(w/2-0.9), 0.27, d/2+1.1));
    g.add(M(new THREE.SphereGeometry(0.5,8,6), mat(0x66bb6a), s*(w/2-0.9), 0.95, d/2+1.1));
  });
  if(o.sign){ const s=shopSign(o.sign, o.signBg, o.signFg); s.position.set(0, 4.1, d/2+0.45); g.add(s); }
  g.userData.h = 6.4;
  return g;
}
/* 🏠 บ้านหลังคาจั่ว + ปล่องไฟ + รั้ว */
function bHouse(o){
  const g = new THREE.Group();
  const w=o.w||7, d=o.d||6;
  g.add(M(new THREE.BoxGeometry(w,3,d), wallMat(o.col||'#fff4dc', '#cfe8f5', 1, 3), 0, 1.5, 0));
  const roof = new THREE.Mesh(cyl(1.6, 1.6, w+1.2, 3), mat(o.roof||0xef6c60));
  roof.rotation.z = Math.PI/2; roof.rotation.x = Math.PI; roof.scale.y = 1;
  roof.scale.set(1, 1, (d+1)/2.2); roof.position.y = 3.85; g.add(roof);
  g.add(M(box(0.8,1.6,0.8), mat(0xb0776a), w*0.26, 4.3, -d*0.14));         // ปล่องไฟ
  doorAt(g, d/2+0.02, 0x8d6e63);
  awning(g, 2.4, 2.5, d/2+0.35, o.aw1||'#90caf9', '#ffffff');
  for(let i=-2;i<=2;i++){ g.add(M(box(0.14,0.7,0.14), mat(0xffffff), i*1.3, 0.35, d/2+2.2)); }
  g.add(M(box(5.6,0.12,0.14), mat(0xffffff), 0, 0.66, d/2+2.2));           // รั้วไม้
  g.userData.h = 6.2;
  return g;
}
/* 🏛️ หอสมุด/พิพิธภัณฑ์: บันไดหน้า + เสาโรมัน + โดม */
function bLibrary(o){
  const g = new THREE.Group();
  const w=o.w||12, d=o.d||9;
  g.add(M(box(w+3,0.7,d+3), mat(0xe8e2d0), 0, 0.35, 0));
  g.add(M(box(w+1.6,0.5,d+1.6), mat(0xf2ecd9), 0, 0.9, 0));
  g.add(M(new THREE.BoxGeometry(w,4.6,d), wallMat(o.col||'#f6efdd', '#cfd8dc', 2, 5), 0, 3.4, 0));
  for(let i=0;i<5;i++) g.add(M(cyl(0.38,0.42,4.4,10), mat(0xfffbef), -w/2+1.2+i*(w-2.4)/4, 3.3, d/2+0.9));
  g.add(M(box(w+1.8,0.8,d+2.4), mat(o.trim||0xd9c9a3), 0, 6.0, 0));
  const ped = M(box(4.5,1.0,4.5), mat(0xf2ecd9), 0, 6.9, 0); g.add(ped);
  if(o.dome!==false){
    g.add(M(new THREE.SphereGeometry(2.5, 14, 10, 0, TAU, 0, Math.PI/2), mat(o.domeCol||0x64b5f6), 0, 7.4, 0));
    g.add(M(cyl(0.06,0.06,1.6,6), mat(0xd9a944), 0, 10.4, 0));
  }
  doorAt(g, d/2+0.02, 0x6d4c41);
  g.userData.h = 11.6;
  return g;
}
/* 🏭 โรงงาน: โถงจั่ว 2 หลัง + ปล่องลาย + ถังไซโล */
function bFactory(o){
  const g = new THREE.Group();
  [-2.6, 2.6].forEach((x,i)=>{
    g.add(M(new THREE.BoxGeometry(5,3.4,9), wallMat(i?'#ffe1b8':'#ffd8ad', '#bcd9e8', 1, 4), x, 1.7, 0));
    const r = new THREE.Mesh(cyl(1.45,1.45,5.4,3), mat(0xef8a65));
    r.rotation.z=Math.PI/2; r.rotation.x=Math.PI; r.scale.z=1.4; r.position.set(x,4.05,0); g.add(r);
  });
  const chim = M(cyl(0.65,0.75,6.5,10), mat(0xcfd8dc), -4.6, 3.2, -2.6); g.add(chim);
  chim.add(M(cyl(0.7,0.7,0.8,10), mat(0xe57373), 0, 3.0, 0));
  g.add(M(cyl(1.05,1.05,4.2,12), mat(0xb0bec5), 5.2, 2.1, -2.8));
  g.add(M(new THREE.SphereGeometry(1.05,10,8,0,TAU,0,Math.PI/2), mat(0x90a4ae), 5.2, 4.2, -2.8));
  doorAt(g, 4.52, 0x616161);
  /* 💨 ควันปุยลอยจากปล่อง */
  const puffs=[];
  for(let i=0;i<3;i++){
    const p = M(new THREE.SphereGeometry(0.55,8,6), mat(0xffffff, {transparent:true, opacity:0.75}), -4.6, 6.8+i*1.3, -2.6);
    p.userData.ph = i*2.1; g.add(p); puffs.push(p);
  }
  tickers.push((dt,t)=>puffs.forEach(p=>{
    const k=((t*0.5+p.userData.ph)%4)/4;
    p.position.y = 6.8+k*4.2; p.material.opacity = 0.7*(1-k);
    p.scale.setScalar(0.7+k*1.8);
  }));
  g.userData.h = 9.4;
  return g;
}
/* 🎪 อาร์เคด/สนุก: ตึกสีจัด + เต็นท์ลายทาง + ดาวหมุน */
function bArcade(o){
  const g = new THREE.Group();
  g.add(M(new THREE.BoxGeometry(9,4.2,8), wallMat(o.col||'#ffd1e8', '#fff3ba', 2, 5), 0, 2.1, 0));
  g.add(M(box(9.6,0.5,8.6), mat(0xffffff), 0, 4.4, 0));
  const tentC = cvs(64,64), tg=tentC.getContext('2d');
  for(let i=0;i<8;i++){ tg.fillStyle=i&1?'#ff5f7e':'#fff'; tg.fillRect(i*8,0,8,64); }
  const tent = new THREE.Mesh(cyl(0.03, 4.6, 3.0, 12), new THREE.MeshLambertMaterial({map:ctex(tentC)}));
  tent.position.y=6.1; g.add(tent);
  const star = M(new THREE.SphereGeometry(0.62,6,5), mat(0xffe14d, {emissive:0xaa8a00}), 0, 8.2, 0);
  g.add(star);
  tickers.push((dt,t)=>{ star.rotation.y=t*2.2; star.position.y=8.2+Math.sin(t*2.6)*0.22; });
  doorAt(g, 4.02, 0xad1457);
  awning(g, 6.4, 2.7, 4.4, '#ff5f7e', '#ffffff');
  g.userData.h = 9.8;
  return g;
}
/* 🔭 หอดูดาว (สถิติ): ฐานกลม + โดมมีร่อง + กล้อง */
function bObservatory(){
  const g = new THREE.Group();
  g.add(M(cyl(3.4,3.9,5.2,14), new THREE.MeshLambertMaterial({map:wallTex('#e6e9f2','#c5d5e8',3,8,NIGHT)}), 0, 2.6, 0));
  g.add(M(cyl(3.7,3.7,0.5,14), mat(0xffffff), 0, 5.3, 0));
  const dome = M(new THREE.SphereGeometry(3.1, 14, 10, 0, TAU, 0, Math.PI/2), mat(0x7986cb), 0, 5.5, 0);
  g.add(dome);
  dome.add(M(box(0.7, 3.15, 0.4), mat(0x3949ab), 0, 1.6, 0));
  const scope = M(cyl(0.35,0.5,3.2,10), mat(0x37474f), 0, 7.6, 0.6);
  scope.rotation.x = -0.7; g.add(scope);
  doorAt(g, 3.85, 0x455a64);
  g.userData.h = 10.2;
  return g;
}
/* 🥇 หอเกียรติยศ: แท่นสูง + ถ้วยทองยักษ์เปล่งแสง */
function bHallOfFame(){
  const g = new THREE.Group();
  g.add(M(box(8.5,1.0,8.5), mat(0xf4e9cf), 0, 0.5, 0));
  g.add(M(new THREE.BoxGeometry(6.6,4.6,6.6), wallMat('#fdf3da','#e8d9b0',2,4), 0, 3.3, 0));
  for(let i=0;i<4;i++){ const a=i*Math.PI/2+Math.PI/4;
    g.add(M(cyl(0.3,0.34,4.6,8), mat(0xfff6e0), Math.cos(a)*4.35, 3.3, Math.sin(a)*4.35)); }
  g.add(M(box(7.6,0.7,7.6), mat(0xe8b64c), 0, 5.9, 0));
  const cupM = mat(0xffc93c, {emissive: NIGHT?0x7a5500:0x3a2800});
  const cup = new THREE.Group();
  cup.add(M(cyl(1.15,0.55,1.5,12), cupM, 0, 1.1, 0));
  cup.add(M(cyl(0.18,0.42,0.8,10), cupM, 0, 0.25, 0));
  cup.add(M(box(1.3,0.28,1.3), cupM, 0, -0.05, 0));
  [-1,1].forEach(s=>{ const h=M(new THREE.TorusGeometry(0.5,0.11,8,14), cupM, s*1.28, 1.15, 0);
                      h.rotation.y=Math.PI/2*0; cup.add(h); });
  cup.position.y=6.3; g.add(cup);
  tickers.push((dt,t)=>{ cup.rotation.y = t*0.8; });
  doorAt(g, 3.32, 0x8d6e63);
  g.userData.h = 10.4;
  return g;
}
/* 👻 โรงแรมผีสิง: ตึกม่วงเข้มเอียงนิดๆ + หลังคาแหลม + หน้าต่างไฟส้มวูบวาบ */
function bHaunted(){
  const g = new THREE.Group();
  const body = M(new THREE.BoxGeometry(7,7.5,6), new THREE.MeshLambertMaterial({map:wallTex('#4a3b63','#2c2440',4,4,true)}), 0, 3.75, 0);
  body.rotation.z = 0.045; g.add(body);
  g.add(M(box(7.8,0.5,6.8), mat(0x352a49), 0, 7.6, 0));
  const spike=(x,z,h,r)=>{ g.add(M(cyl(0.02, r, h, 5), mat(0x241b36), x, 7.85+h/2, z)); };
  spike(0,0,3.4,2.6); spike(-2.9,-2.2,2.2,1.1); spike(2.9,2.0,2.0,1.0);
  g.add(M(box(2.6,1.4,0.2), mat(0x241b36), 0, 8.6, 3.05));
  const ghost = M(new THREE.SphereGeometry(0.5,10,8), mat(0xf4f6ff, {transparent:true, opacity:0.85, emissive:0x3a3f66}), 2.2, 6.4, 3.6);
  g.add(ghost);
  tickers.push((dt,t)=>{ ghost.position.y = 6.4+Math.sin(t*1.7)*0.5;
                         ghost.position.x = 2.2+Math.sin(t*0.9)*0.9;
                         ghost.material.opacity = 0.55+Math.sin(t*2.3)*0.3; });
  doorAt(g, 3.02, 0x1c1430);
  g.userData.h = 12.6;
  return g;
}
/* 🚁 ลานเฮลิคอปเตอร์: อาคารเตี้ย + หอบังคับ + วง H + ฮ.จอด */
function bHeliport(){
  const g = new THREE.Group();
  g.add(M(new THREE.BoxGeometry(6,2.8,5), wallMat('#dceefb','#9fc5dd',1,3), -2.5, 1.4, 0));
  const tower = M(cyl(0.5,0.6,5.2,8), mat(0xb0bec5), -4.6, 2.6, -1.6); g.add(tower);
  g.add(M(box(1.7,1.1,1.7), mat(0x546e7a), -4.6, 5.6, -1.6));
  const pad = M(cyl(3.4,3.4,0.35,20), mat(0x455a64), 2.8, 0.18, 0); g.add(pad);
  const c = cvs(128,128), x=c.getContext('2d');
  x.fillStyle='#455a64'; x.fillRect(0,0,128,128);
  x.strokeStyle='#fff'; x.lineWidth=7; x.beginPath(); x.arc(64,64,48,0,TAU); x.stroke();
  x.font='900 64px system-ui'; x.fillStyle='#fff'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('H',64,66);
  pad.material = new THREE.MeshLambertMaterial({map:ctex(c)});
  const heli = miniHeli(0x90a4ae); heli.scale.setScalar(0.8); heli.position.set(2.8, 0.4, 0); g.add(heli);
  tickers.push((dt,t)=>{ heli.userData.rot.rotation.y = t*3; });   // ใบพัดหมุนช้าๆ อุ่นเครื่อง
  g.userData.h = 8.0;
  return g;
}
/* 🚗 อู่รถ: ประตูม้วน 2 ช่อง + ยางกอง + ป้ายไฟ */
function bGarage(){
  const g = new THREE.Group();
  g.add(M(new THREE.BoxGeometry(9,3.6,7), wallMat('#ffe0b2','#c9dbe8',1,4), 0, 1.8, 0));
  g.add(M(box(9.6,0.5,7.6), mat(0xff8f00), 0, 3.85, 0));
  /* 🚪🌀 รอบ 897: 2 ช่องนี้เดิมเป็นแผ่นลายสแลตแปะผนังนิ่ง ๆ → เปลี่ยนเป็นประตูม้วนเลื่อนขึ้นจริง */
  rollAt(g, {bays:[-2.2, 2.2], w:3.1, h:2.7, z:3.5, house:0xff8f00, reach:4.6});   // z = ผิวหน้ากล่องผนัง (d/2)
  [[-3.9,0.35],[-3.9,1.0]].forEach(([x,y])=>{
    const t = M(new THREE.TorusGeometry(0.55,0.22,8,14), mat(0x33383d), x, y, 3.2);
    t.rotation.x=Math.PI/2*0; g.add(t);
  });
  const wrench = M(box(0.5,2.0,0.2), mat(0x546e7a), 4.0, 5.0, 0); g.add(wrench);
  g.userData.h = 7.4;
  return g;
}
/* ⚽ สนามบอลจิ๋ว: อัฒจันทร์โค้ง + เสาไฟ + สนามเขียว */
function bStadium(){
  const g = new THREE.Group();
  const field = M(box(9,0.3,6.4), mat(0x57bb63), 0, 0.15, 0); g.add(field);
  const c=cvs(256,160), q=c.getContext('2d');
  q.fillStyle='#57bb63'; q.fillRect(0,0,256,160);
  q.strokeStyle='rgba(255,255,255,.9)'; q.lineWidth=4;
  q.strokeRect(12,10,232,140); q.beginPath(); q.arc(128,80,28,0,TAU); q.stroke();
  q.beginPath(); q.moveTo(128,10); q.lineTo(128,150); q.stroke();
  field.material = new THREE.MeshLambertMaterial({map:ctex(c)});
  const stand = M(cyl(6.2, 6.9, 2.2, 18, 1, false), mat(0xff8a65), 0, 1.1, -1.2);
  // อัฒจันทร์ = ครึ่งวง (สร้างจาก cylinder ผ่าครึ่งด้วย thetaLength)
  stand.geometry = new THREE.CylinderGeometry(6.2, 6.9, 2.2, 18, 1, false, -Math.PI*0.1, Math.PI*1.2);
  g.add(stand);
  g.add(M(new THREE.CylinderGeometry(5.4, 5.9, 1.3, 18, 1, false, -Math.PI*0.1, Math.PI*1.2), mat(0xffab91), 0, 2.4, -1.2));
  [-4.4,4.4].forEach(x=>{
    g.add(M(cyl(0.09,0.09,5.2,6), mat(0x90a4ae), x, 2.6, 2.9));
    g.add(M(box(1.1,0.55,0.16), mat(0xfff59d, {emissive:NIGHT?0x887700:0x222200}), x, 5.3, 2.9));
  });
  g.userData.h = 7.6;
  return g;
}
/* 🏍️ สนามมอไซค์: ทางโค้งดิน + ธงหมากรุก */
function bMotoTrack(){
  const g = new THREE.Group();
  const c=cvs(256,256), q=c.getContext('2d');
  q.fillStyle='#8bc34a'; q.fillRect(0,0,256,256);
  q.strokeStyle='#a1785c'; q.lineWidth=34; q.beginPath();
  q.ellipse(128,128,86,60,0.4,0,TAU); q.stroke();
  q.strokeStyle='#fff'; q.setLineDash([10,14]); q.lineWidth=3; q.beginPath();
  q.ellipse(128,128,86,60,0.4,0,TAU); q.stroke();
  const padM = new THREE.Mesh(new THREE.CylinderGeometry(5.6,5.6,0.3,20), new THREE.MeshLambertMaterial({map:ctex(c)}));
  padM.position.y=0.15; g.add(padM);
  g.add(M(box(3.2,2.2,2.6), wallMat('#ffecb3','#cfe0ea',1,2), -0.2, 1.1, -0.4));
  const fc=cvs(64,64), fq=fc.getContext('2d');
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){ fq.fillStyle=(i+j)&1?'#111':'#fff'; fq.fillRect(i*8,j*8,8,8); }
  g.add(M(cyl(0.06,0.06,4.4,6), mat(0x8d6e63), 3.4, 2.2, 2.4));
  const flag = M(new THREE.PlaneGeometry(1.6,1.0), new THREE.MeshBasicMaterial({map:ctex(fc), side:THREE.DoubleSide}), 4.25, 3.9, 2.4);
  g.add(flag);
  tickers.push((dt,t)=>{ flag.rotation.y = Math.sin(t*3)*0.35; });
  g.userData.h = 6.6;
  return g;
}
/* 🛸 หอสัญญาณยานแม่: จานบินจอดบนเสา + ไฟวิ่ง */
function bUfo(){
  const g = new THREE.Group();
  g.add(M(cyl(1.6,2.2,1.2,10), mat(0x8d97a3), 0, 0.6, 0));
  g.add(M(cyl(0.35,0.5,4.6,8), mat(0xaab4bd), 0, 3.4, 0));
  const disc = new THREE.Group();
  const d1 = M(new THREE.SphereGeometry(2.9,16,10), mat(0xb0bec5), 0,0,0); d1.scale.y=0.32; disc.add(d1);
  disc.add(M(new THREE.SphereGeometry(1.15,12,8,0,TAU,0,Math.PI/2), mat(0x80deea, {transparent:true, opacity:0.8, emissive:0x1f5560}), 0, 0.35, 0));
  const lights=[];
  for(let i=0;i<8;i++){ const a=i/8*TAU;
    const L=M(new THREE.SphereGeometry(0.16,6,5), mat(0xffee58,{emissive:0x776600}), Math.cos(a)*2.55, 0.12, Math.sin(a)*2.55);
    disc.add(L); lights.push(L); }
  disc.position.y=6.2; g.add(disc);
  tickers.push((dt,t)=>{
    disc.rotation.y = t*0.7; disc.position.y = 6.2+Math.sin(t*1.4)*0.25;
    lights.forEach((L,i)=>{ L.material = ((t*4|0)+i)%8<4 ? mat(0xffee58,{emissive:0x776600}) : mat(0x8d6e63); });
  });
  g.userData.h = 9.8;
  return g;
}
/* 🤖 โรงเก็บหุ่น: hangar โค้ง + หุ่นยักษ์โผล่ครึ่งตัว */
function bHangar(){
  const g = new THREE.Group();
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.4,8,14,1,false,0,Math.PI),
                              new THREE.MeshLambertMaterial({map:wallTex('#cfd8dc','#90a4ae',2,6,NIGHT)}));
  arch.rotation.z=Math.PI/2; arch.rotation.y=Math.PI/2; arch.position.y=0; arch.scale.y=1;
  arch.position.y=0.0; g.add(arch);
  g.add(M(box(8,0.4,7), mat(0x90a4ae), 0, 0.2, 0));
  const robot = new THREE.Group();
  robot.add(M(box(1.7,1.7,1.2), mat(0x5c6bc0), 0, 4.6, 0));
  robot.add(M(box(1.05,0.95,0.95), mat(0x7986cb), 0, 5.95, 0));
  robot.add(M(new THREE.SphereGeometry(0.13,6,5), mat(0x00e5ff,{emissive:0x006677}), -0.25, 6.0, 0.5));
  robot.add(M(new THREE.SphereGeometry(0.13,6,5), mat(0x00e5ff,{emissive:0x006677}), 0.25, 6.0, 0.5));
  [-1,1].forEach(s=>robot.add(M(box(0.5,1.6,0.6), mat(0x3f51b5), s*1.2, 4.5, 0)));
  robot.position.set(0, -1.4, -0.5); g.add(robot);
  tickers.push((dt,t)=>{ robot.position.y = -1.4+Math.sin(t*0.8)*0.15; });
  /* 🚪🌀 รอบ 897: ประตูม้วนปิดหน้า hangar (ยกขึ้นแล้วหุ่นเดินออกได้)
     กว้าง 4.4 × สูง 2.2 + คานม้วนกว้าง 4.6 → มุมทั้งหมดยังอยู่ในวงโค้ง r=3.4 ไม่โผล่พ้นซุ้ม
     z=4 = ฝาครึ่งวงกลมด้านหน้าของ arch (CylinderGeometry ปิดหัวท้าย) — ประตูจึงติดบนผนังนั้น */
  rollAt(g, {bays:[0], w:4.4, h:2.2, z:4.0, hw:4.6, house:0x78909c, reach:5.0});
  g.userData.h = 8.6;
  return g;
}
/* 🌍 ประตูป่าผจญภัย: ซุ้มหินโค้ง + เถาวัลย์ + คบไฟ */
function bJungleGate(){
  const g = new THREE.Group();
  [-1,1].forEach(s=>{
    g.add(M(cyl(1.0,1.3,5.6,8), mat(0x8d8468), s*3.0, 2.8, 0));
    g.add(M(new THREE.SphereGeometry(1.35,8,6), mat(0x66bb6a), s*3.0, 6.0, 0));
  });
  const top = M(box(7.6,1.2,1.6), mat(0x9c937a), 0, 6.0, 0); g.add(top);
  top.add(M(box(7.8,0.4,1.8), mat(0x66bb6a), 0, 0.8, 0));
  const c=cvs(256,64), q=c.getContext('2d');
  q.fillStyle='#5d4037'; roundRect(q,4,4,248,56,14); q.fill();
  q.font='700 34px system-ui'; q.fillStyle='#ffe082'; q.textAlign='center'; q.textBaseline='middle';
  q.fillText('ADVENTURE', 128, 34);
  g.add(M(new THREE.PlaneGeometry(4.6,1.15), new THREE.MeshBasicMaterial({map:ctex(c), transparent:true}), 0, 6.05, 0.95));
  [-1,1].forEach(s=>{
    const fl = M(new THREE.SphereGeometry(0.28,6,5), mat(0xffa726,{emissive:0xbb5500}), s*3.0, 4.6, 0.95);
    g.add(fl);
    tickers.push((dt,t)=>{ fl.scale.setScalar(1+Math.sin(t*7+s)*0.22); });
  });
  g.userData.h = 8.8;
  return g;
}
/* 🛸 ลานโดรน: แท่นชาร์จ + โดรนสาธิตบินวน */
function bDronePad(){
  const g = new THREE.Group();
  g.add(M(box(6,0.4,6), mat(0x546e7a), 0, 0.2, 0));
  const c=cvs(128,128), q=c.getContext('2d');
  q.fillStyle='#546e7a'; q.fillRect(0,0,128,128);
  q.strokeStyle='#ffca28'; q.lineWidth=6; q.strokeRect(14,14,100,100);
  q.beginPath(); q.moveTo(64,20); q.lineTo(64,108); q.moveTo(20,64); q.lineTo(108,64); q.stroke();
  g.children[0].material = new THREE.MeshLambertMaterial({map:ctex(c)});
  g.add(M(box(2.4,2.0,2.0), wallMat('#eceff1','#b0bec5',1,2), -2.6, 1.0, -2.4));
  /* 🚪🌀 รอบ 897: โรงเก็บโดรนหลังเล็ก — ประตูม้วนช่องเดียวหันออกลานจอด */
  rollAt(g, {bays:[-2.6], w:1.7, h:1.5, z:-1.4, house:0xffca28, reach:3.4});   // z = ผิวหน้ากล่องโรงเก็บ (-2.4+2/2)
  const dr = miniDrone(0x26c6da); dr.position.set(0.8, 2.6, 0.6); g.add(dr);
  tickers.push((dt,t)=>{
    dr.position.y = 2.6+Math.sin(t*1.9)*0.5;
    dr.position.x = 0.8+Math.cos(t*0.8)*1.3;
    dr.position.z = 0.6+Math.sin(t*0.8)*1.3;
    dr.userData.props.forEach(p=>p.rotation.y = t*22);
  });
  g.userData.h = 6.4;
  return g;
}

/* ============================================================
   🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
   ============================================================ */
function miniCar(color){
  const g = new THREE.Group();
  g.add(M(box(2.4,0.62,1.2), mat(color), 0, 0.62, 0));
  const cab = M(box(1.35,0.55,1.05), mat(0xe3f2fd), -0.12, 1.18, 0); g.add(cab);
  g.add(M(box(2.5,0.16,1.26), mat(0x2d3238), 0, 0.34, 0));
  const wheels = [];
  [[-0.8,0.55],[0.8,0.55],[-0.8,-0.55],[0.8,-0.55]].forEach(([x,z])=>{
    const w = M(cyl(0.3,0.3,0.22,10), mat(0x25292e), x, 0.3, z);
    w.rotation.x = Math.PI/2; g.add(w); wheels.push(w);
    w.add(M(cyl(0.14,0.14,0.24,8), mat(0xcfd8dc), 0, 0, 0));
  });
  g.userData.wheels = wheels;   // 🚗 รอบ 900: ล้อหมุนตอนแล่นออกจากโรงรถ (rotation.y = แกนเพลา เพราะ rotation.x=90° ถูกใส่ทีหลัง)
  g.add(M(box(0.1,0.18,0.28), mat(0xfff59d,{emissive:0x666600}), 1.22, 0.68, 0.36));
  g.add(M(box(0.1,0.18,0.28), mat(0xfff59d,{emissive:0x666600}), 1.22, 0.68, -0.36));
  g.add(M(box(0.08,0.16,0.24), mat(0xef5350,{emissive:0x550000}), -1.22, 0.68, 0.34));
  g.add(M(box(0.08,0.16,0.24), mat(0xef5350,{emissive:0x550000}), -1.22, 0.68, -0.34));
  g.add(blobShadow(1.5));
  return g;   // หันหน้า +X
}
function miniMoto(color, riderId){
  const g = new THREE.Group();
  [0.62,-0.62].forEach(x=>{
    const w = M(cyl(0.3,0.3,0.16,10), mat(0x25292e), x, 0.3, 0);
    w.rotation.x = Math.PI/2; g.add(w);
  });
  g.add(M(box(1.15,0.3,0.3), mat(color), 0, 0.62, 0));
  g.add(M(box(0.36,0.3,0.3), mat(0x37474f), -0.28, 0.86, 0));
  const bar = M(box(0.06,0.4,0.62), mat(0x616e78), 0.52, 0.9, 0); g.add(bar);
  // คนขี่ตัวจิ๋ว (สีเสื้อจาก blk)
  const a = BLK8[riderId] || BLK8['blk'+(1+hash(riderId||'x')%8)] || BLK8.blk1;
  const rider = new THREE.Group();
  rider.add(M(box(0.42,0.5,0.3), mat(a.shirt), 0, 0.25, 0));
  rider.add(M(box(0.3,0.3,0.3), mat(a.skin), 0, 0.66, 0));
  rider.add(M(new THREE.SphereGeometry(0.19,8,6), mat(0xef5350), 0, 0.72, 0));   // หมวกกันน็อก
  rider.position.set(-0.1, 0.86, 0); rider.rotation.z = -0.15;
  g.add(rider);
  g.add(blobShadow(0.9));
  return g;   // หันหน้า +X
}
function miniHeli(color){
  const g = new THREE.Group();
  const body = M(new THREE.SphereGeometry(0.9,12,9), mat(color), 0, 1.0, 0);
  body.scale.set(1.5,0.9,0.9); g.add(body);
  g.add(M(new THREE.SphereGeometry(0.5,10,8,0,TAU,0,Math.PI/1.6), mat(0xb3e5fc,{transparent:true,opacity:0.85}), 0.8, 1.15, 0));
  g.add(M(box(1.7,0.22,0.22), mat(color), -1.7, 1.25, 0));
  g.add(M(box(0.22,0.7,0.1), mat(color), -2.5, 1.5, 0));
  [-0.5,0.5].forEach(z=>{
    g.add(M(box(1.6,0.08,0.12), mat(0x616e78), 0, 0.25, z));
    g.add(M(box(0.08,0.35,0.08), mat(0x616e78), -0.5, 0.45, z));
    g.add(M(box(0.08,0.35,0.08), mat(0x616e78), 0.5, 0.45, z));
  });
  const rot = new THREE.Group();
  rot.add(M(box(3.4,0.06,0.26), mat(0x37474f), 0,0,0));
  rot.add(M(box(0.26,0.06,3.4), mat(0x37474f), 0,0,0));
  rot.position.y = 1.75; g.add(rot);
  const trot = M(box(0.06,0.8,0.1), mat(0x37474f), -2.55, 1.5, 0.08); g.add(trot);
  g.userData.rot = rot; g.userData.trot = trot;
  return g;   // หันหน้า +X
}
function miniDrone(color){
  const g = new THREE.Group();
  g.add(M(box(0.6,0.24,0.6), mat(color), 0, 0, 0));
  g.add(M(new THREE.SphereGeometry(0.14,8,6), mat(0x263238), 0.28, -0.06, 0));
  const props=[];
  [[0.55,0.55],[0.55,-0.55],[-0.55,0.55],[-0.55,-0.55]].forEach(([x,z])=>{
    g.add(M(box(0.5,0.06,0.08), mat(0x455a64), x*0.6, 0.02, z*0.6));
    const p = M(box(0.55,0.03,0.1), mat(0x90a4ae), x, 0.12, z);
    g.add(p); props.push(p);
  });
  g.userData.props = props;
  return g;
}
/* 🤖 รอบ 900: หุ่นรบตัวเดินได้ — สัดส่วน/สีชุดเดียวกับหุ่นโชว์บนโรงเก็บ (bHangar) แต่ย่อให้ลอดประตูม้วนสูง 2.2 ม. ได้
   ขาแขวนบน "กลุ่มสะโพก" (จุดหมุนอยู่ข้อสะโพก) → แกว่ง rotation.x แล้วเป็นท่าเดินจริง ไม่ใช่กล่องไถ */
function miniMecha(color){
  const g = new THREE.Group();
  const legs = [];
  [-0.3, 0.3].forEach(z=>{
    const hip = new THREE.Group();
    hip.position.set(0, 0.86, z);
    hip.add(M(box(0.34,0.8,0.34), mat(0x37474f), 0, -0.4, 0));
    hip.add(M(box(0.44,0.14,0.5), mat(0x546e7a), 0.04, -0.79, 0));   // ฝ่าเท้า
    g.add(hip); legs.push(hip);
  });
  g.add(M(box(0.72,0.78,1.0), mat(color), 0, 1.26, 0));
  [-1,1].forEach(s=>g.add(M(box(0.26,0.74,0.26), mat(0x3f51b5), 0, 1.22, s*0.63)));
  g.add(M(box(0.46,0.36,0.5), mat(0x7986cb), 0.02, 1.83, 0));
  [-1,1].forEach(s=>g.add(M(new THREE.SphereGeometry(0.07,6,5), mat(0x00e5ff,{emissive:0x006677}), 0.24, 1.86, s*0.13)));
  g.add(M(box(0.2,0.2,0.5), mat(0x455a64), -0.2, 1.72, 0));          // เครื่องยนต์หลัง
  g.add(blobShadow(0.8));
  g.userData.legs = legs;
  return g;   // หันหน้า +X (เหมือนยานคันอื่นในโซนนี้)
}

/* ============================================================
   🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
   ============================================================ */
const _texLoader = new THREE.TextureLoader();
function makeBlockFigure(id){
  const a = BLK8[id] || BLK8.blk1;
  const g = new THREE.Group();
  const skin=mat(a.skin), shirt=mat(a.shirt), pants=mat(a.pants), hair=mat(a.hair);
  g.userData.limbs=[];
  [-0.15,0.15].forEach(x=>{
    const piv=new THREE.Group(); piv.position.set(x,.5,0);
    piv.add(M(box(.24,.5,.28), pants, 0,-.25,0));
    g.add(piv); g.userData.limbs.push(piv);
  });
  g.add(M(box(.6,.6,.36), shirt, 0,.8,0));
  [-1,1].forEach(s=>{
    const piv=new THREE.Group(); piv.position.set(s*.41,1.04,0);
    const arm=M(box(.17,.5,.22), shirt, 0,-.22,0); piv.add(arm);
    arm.add(M(box(.16,.14,.18), skin, 0,-.3,0));
    g.add(piv); g.userData.limbs.push(piv);
  });
  const head=M(box(.52,.46,.46), skin, 0,1.38,0); g.add(head);
  // หน้ายิ้ม
  const fc=cvs(64,64), q=fc.getContext('2d');
  q.fillStyle='#'+('000000'+a.skin.toString(16)).slice(-6); q.fillRect(0,0,64,64);
  q.fillStyle='#1c1c1c';
  [[21,26],[43,26]].forEach(([x,y])=>{ q.beginPath(); q.arc(x,y,5.5,0,TAU); q.fill(); });
  if(a.blush){ q.fillStyle='rgba(255,120,130,.5)'; [[12,40],[52,40]].forEach(([x,y])=>{q.beginPath();q.arc(x,y,5,0,TAU);q.fill();}); }
  q.strokeStyle='#8d4a35'; q.lineWidth=3; q.lineCap='round';
  q.beginPath(); q.arc(32,36,9,Math.PI*.2,Math.PI*.8); q.stroke();
  head.add(M(new THREE.PlaneGeometry(.5,.44), new THREE.MeshLambertMaterial({map:ctex(fc)}), 0,0,.235));
  // ทรงผม
  if(a.style==='tall')      head.add(M(box(.54,.3,.48), hair, 0,.34,0));
  else if(a.style==='cap'){ head.add(M(box(.56,.16,.5), hair, 0,.28,0)); head.add(M(box(.3,.08,.3), hair, 0,.3,.36)); }
  else if(a.style==='pony'){head.add(M(box(.54,.18,.48), hair, 0,.3,0)); head.add(M(box(.16,.42,.16), hair, 0,-.02,-.32)); }
  else                      head.add(M(box(.54,.18,.48), hair, 0,.3,0));
  g.add(blobShadow(0.75));
  g.userData.isBlock = true;
  return g;   // สูง ~1.6 หันหน้า +Z
}
function makeSpriteFigure(id){
  const g = new THREE.Group();
  const m = new THREE.SpriteMaterial({transparent:true, depthTest:true});
  _texLoader.load('img/blocks/'+id+'.png', t=>{ m.map=t; m.needsUpdate=true; });
  const sp = new THREE.Sprite(m);
  sp.scale.set(2.3, 2.9, 1); sp.position.y = 1.45;
  g.add(sp); g.add(blobShadow(0.75));
  return g;
}
function makeFigure(id){
  return BLK8[id] ? makeBlockFigure(id) : makeSpriteFigure(/^blk(\d+)$/.test(id||'')?id:'blk1');
}
function pickBlk(ba, uid){
  if(/^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(ba||'')) return ba;
  return 'blk'+(1+hash(uid)%88);
}

/* ============================================================
   🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
   ============================================================ */
function bld(key, ico, label, go, deg, r, build){ return {key, ico, label, go, deg, r, build}; }
const BUILDINGS = [
  // ── วงใน r=34: การเรียน (เหนือ) + เมือง (ใต้) ──
  bld('library',   '📚','หมวดคำศัพท์','cats',      90, BAND1_R, ()=>bLibrary({})),
  bld('academy',   '📝','สอบเลื่อนขั้น','bandexam', 64, BAND1_R, ()=>bTower({col:'#d9ecff', f:3, trim:0x90caf9, sign:'📝 ACADEMY', signBg:'#e3f2fd'})),
  bld('examstd',   '📋','ข้อสอบจริง','examstd',    38, BAND1_R, ()=>{
    const g = bTower({col:'#ffe9c9', f:4, trim:0xffb74d, setback:0.8});
    [['#1565c0','IELTS'],['#2e7d32','TOEIC'],['#c62828','TOEFL']].forEach((f,i)=>{   // ธง 3 สนามสอบ
      const pole = M(cyl(0.05,0.05,3.4,6), mat(0xeceff1), -2.4+i*2.4, 1.7, 5.2);
      const c=cvs(128,64), q=c.getContext('2d');
      q.fillStyle=f[0]; q.fillRect(0,0,128,64);
      q.font='700 30px system-ui'; q.fillStyle='#fff'; q.textAlign='center'; q.textBaseline='middle'; q.fillText(f[1],64,34);
      const fl=M(new THREE.PlaneGeometry(1.5,0.75), new THREE.MeshBasicMaterial({map:ctex(c), side:THREE.DoubleSide}), 0.8, 1.25, 0);
      pole.add(fl); g.add(pole);
      tickers.push((dt,t)=>{ fl.rotation.y = Math.sin(t*2.4+i)*0.3; });
    });
    return g;
  }),
  bld('typing',    '⌨️','พิมพ์คำ','typing',       116, BAND1_R, ()=>bShop({col:'#e5dbff', roof:0x9575cd, aw1:'#b39ddb', sign:'⌨️ TYPING', signBg:'#ede7f6'})),
  bld('wordsearch','🔎','ค้นหาคำ','wordsearch',   141, BAND1_R, ()=>bShop({col:'#d4f2ff', roof:0x4fc3f7, aw1:'#4fc3f7', sign:'🔎 WORD HUNT', signBg:'#e1f5fe'})),
  bld('book',      '📒','สมุดคำศัพท์','book',     167, BAND1_R, ()=>bShop({col:'#ffe9c9', roof:0xffb74d, aw1:'#ffcc80', sign:'📒 MY BOOK', signBg:'#fff3e0'})),
  bld('home',      '🏠','บ้าน','home',            193, BAND1_R, ()=>bHouse({col:'#fff4dc', roof:0xef6c60})),
  bld('market',    '🏪','ตลาด','market',          219, BAND1_R, ()=>bShop({w:9, d:7.5, col:'#ffd9d9', roof:0xef5350, aw1:'#ef5350', sign:'🏪 MARKET', signBg:'#ffebee'})),
  bld('gifts',     '🎁','ของขวัญ','gifts',        244, BAND1_R, ()=>{
    const g = bShop({col:'#ffd1e8', roof:0xec407a, aw1:'#f48fb1', sign:'🎁 GIFTS', signBg:'#fce4ec'});
    const bow = new THREE.Group();     // โบว์ยักษ์บนหลังคา
    bow.add(M(new THREE.SphereGeometry(0.45,8,6), mat(0xec407a), -0.5, 0, 0));
    bow.add(M(new THREE.SphereGeometry(0.45,8,6), mat(0xec407a), 0.5, 0, 0));
    bow.add(M(new THREE.SphereGeometry(0.22,8,6), mat(0xad1457), 0, 0, 0.1));
    bow.position.set(0, 5.6, 0); g.add(bow);
    return g;
  }),
  bld('friends',   '👥','เพื่อน','friends',       270, BAND1_R, ()=>bShop({w:8.5, col:'#d8f4de', roof:0x66bb6a, aw1:'#81c784', sign:'👥 FRIENDS CAFE', signBg:'#e8f5e9'})),
  bld('chat',      '💬','แชท','chat',             296, BAND1_R, ()=>{
    const g = bShop({col:'#cfeaff', roof:0x42a5f5, aw1:'#64b5f6', sign:'💬 POST', signBg:'#e3f2fd'});
    const bub = M(new THREE.SphereGeometry(0.75,10,8), mat(0xffffff,{emissive:NIGHT?0x333333:0x000000}), 0, 6.3, 0);
    bub.scale.set(1.3,1,1); g.add(bub);
    tickers.push((dt,t)=>{ bub.position.y = 6.3+Math.sin(t*2)*0.2; });
    return g;
  }),
  bld('petshop',   '🐾','ร้านสัตว์เลี้ยง','petshop',321, BAND1_R, ()=>{
    const g = bShop({col:'#ffe4c4', roof:0x8d6e63, aw1:'#ffab91', sign:'🐾 PET SHOP', signBg:'#fbe9e7'});
    g.add(M(new THREE.SphereGeometry(0.45,8,6), mat(0xffcc80), 2.8, 0.45, 4.6));   // ลูกบอลเล่นหน้าร้าน
    return g;
  }),
  bld('farm',      '📈','ลงทุน','farm',           347, BAND1_R, ()=>bTower({col:'#d8f4de', f:4, trim:0x2e9e4a, setback:0.82, sign:'📈 BANK', signBg:'#e8f5e9'})),
  bld('factory',   '🏭','โรงงาน','factory',        12, BAND1_R, ()=>bFactory({})),
  // ── วงนอก r=63: หอ/สนาม/โลก 3D ──
  bld('stats',     '📊','สถิติ','stats',           78, BAND2_R, ()=>bObservatory()),
  bld('rank',      '🥇','อันดับ','rank',           55, BAND2_R, ()=>bHallOfFame()),
  bld('trophy',    '🏆','ตู้เข็ม','trophy',       103, BAND2_R, ()=>bLibrary({w:9, d:7, col:'#fdf3da', domeCol:0xe8b64c, trim:0xd9a944})),
  bld('play',      '🎮','เกมจับคู่','play',       128, BAND2_R, ()=>bArcade({})),
  /* 🖼️ รอบ 977: หอศิลป์ "จับคู่ภาพ" (เกมใหม่ js/picmatch.js) — ช่องว่างกว้างสุดของวงนอก
     ระหว่างซุ้มควิซอาหาร (153°) กับประตูโลกผจญภัย (186°) */
  bld('picmatch',  '🖼️','จับคู่ภาพ','picmatch',   169, BAND2_R, ()=>{
    const g = bShop({col:'#ffe6f0', roof:0xba68c8, aw1:'#ce93d8', sign:'🖼️ PIC MATCH', signBg:'#f3e5f5'});
    const c = cvs(128,64), q = c.getContext('2d');           // ป้ายภาพ 2 ใบเท่ากันบนหลังคา (โยกช้า ๆ)
    q.fillStyle='#fff'; q.fillRect(0,0,128,64);
    [[10,'#ffb74d'],[76,'#4fc3f7']].forEach(([x,col])=>{
      q.fillStyle='#f3e5f5'; q.fillRect(x,8,42,48);
      q.strokeStyle='#8e24aa'; q.lineWidth=3; q.strokeRect(x,8,42,48);
      q.fillStyle=col; q.beginPath(); q.arc(x+21,34,13,0,7); q.fill();
    });
    q.fillStyle='#8e24aa'; q.font='700 24px system-ui'; q.textAlign='center'; q.textBaseline='middle';
    q.fillText('=',64,33);
    const bd = M(new THREE.PlaneGeometry(2.6,1.3),
      new THREE.MeshBasicMaterial({map:ctex(c), side:THREE.DoubleSide, transparent:true}), 0, 6.4, 0);
    g.add(bd);
    tickers.push((dt,t)=>{ bd.rotation.y = Math.sin(t*0.9)*0.5; bd.position.y = 6.4+Math.sin(t*1.6)*0.12; });
    return g;
  }),
  bld('foodquiz',  '🛡️','ควิซอาหาร','foodquiz',  153, BAND2_R, ()=>{
    const g = bShop({col:'#fff3a6', roof:0xfbc02d, aw1:'#ffd54f', sign:'🛡️ FOOD SAFE', signBg:'#fffde7'});
    const ap = M(new THREE.SphereGeometry(0.6,10,8), mat(0xef5350), 0, 6.0, 0); g.add(ap);
    ap.add(M(box(0.08,0.3,0.08), mat(0x6d4c41), 0, 0.65, 0));
    return g;
  }),
  bld('w3d_adv',   '🌍','โลกผจญภัย','w3d_adv',    186, BAND2_R, ()=>bJungleGate()),
  bld('w3d_haunt', '👻','โลกผีสิง','w3d_haunt',   207, BAND2_R, ()=>bHaunted()),
  bld('w3d_heli',  '🚁','โลกเฮลิฯ','w3d_heli',    228, BAND2_R, ()=>bHeliport()),
  bld('w3d_drone', '🛸','โลกโดรน','w3d_drone',    249, BAND2_R, ()=>bDronePad()),
  bld('w3d_drive', '🚗','โลกขับรถ','w3d_drive',   270, BAND2_R+6, ()=>bGarage()),
  bld('w3d_soccer','⚽','โลกฟุตบอล','w3d_soccer', 291, BAND2_R, ()=>bStadium()),
  bld('w3d_moto',  '🏍️','โลกมอไซค์','w3d_moto',  312, BAND2_R, ()=>bMotoTrack()),
  bld('w3d_invasion','🛸','โลกยานแม่','w3d_invasion',333, BAND2_R, ()=>bUfo()),
  bld('w3d_mecha', '🤖','โลกหุ่นรบ','w3d_mecha',  354, BAND2_R, ()=>bHangar()),
  // 🎯 รอบ 917: ซุ้มยิงเป้าคำศัพท์ (เกม 3D สวนสนุก) — ช่องว่างโค้งระหว่างโรงหุ่น (354°) กับหอเกียรติยศ (55°)
  /* 📖 รอบ 992: ร้านหนังสือ "Picture Dictionary" — ช่องว่างวงนอกระหว่าง
     ยิงเป้าคำ (20°) กับหออันดับ (55°) · แตะ → ?go=picdict → เปิดหนังสือในล็อบบี้เดิม */
  bld('picdict',   '📖','พจนานุกรมภาพ','picdict',  37, BAND2_R, ()=>
    bShop({col:'#fff3d6', roof:0xd9a944, aw1:'#ffd54f', sign:'📖 PICTURE DICT', signBg:'#fff8e1'})),
  /* 🎧 รอบ 994: "ห้องเรียนครูถามศัพท์" — เข้าแล้วหนังสือเปิดโหมดครูถามให้เลย
     วางคู่กับร้านหนังสือ (37°) เป็นย่านเดียวกัน · วงนอกช่องละ ~18-25° เต็มหมดแล้ว
     จึงแทรกที่ 46° แล้วดันออกนอกวง (+16 = r 79 · เกาะรัศมี 95 ยังอยู่บนบกสบาย)
     ให้ห่างเพื่อนบ้านที่ใกล้สุด (📖 37° · 🥇 55°) ข้างละ ~19 หน่วย — พอ ๆ กับระยะปกติของวงนอก */
  bld('picquiz',   '🎧','ครูถามศัพท์','picquiz',   46, BAND2_R+16, ()=>
    bShop({col:'#e3f6e5', roof:0x2e7d32, aw1:'#81c784', sign:'🎧 LISTEN & TAP', signBg:'#e8f5e9'})),
  bld('shootword', '🎯','ยิงเป้าคำ','shootword',   20, BAND2_R, ()=>{
    const g = bShop({col:'#fff3e0', roof:0xff7043, aw1:'#ff8a65', sign:'🎯 SHOOT WORD', signBg:'#fff3e0'});
    const c = cvs(128,128), q = c.getContext('2d');           // เป้าวงกลมหมุนบนหลังคา
    [['#ef5350',60],['#fff',47],['#ef5350',33],['#fff',19],['#ffb300',9]].forEach(([col,r])=>{
      q.fillStyle=col; q.beginPath(); q.arc(64,64,r,0,7); q.fill(); });
    const t = M(new THREE.PlaneGeometry(2.3,2.3),
      new THREE.MeshBasicMaterial({map:ctex(c), side:THREE.DoubleSide, transparent:true}), 0, 6.4, 0);
    g.add(t);
    tickers.push((dt,tm)=>{ t.rotation.z = tm*0.8; });
    return g;
  }),
];
const BLD_AT = {};   // key → {x,z,ry}

function buildCity(){
  // 🏝️ ตัวเกาะ
  const top = new THREE.Mesh(new THREE.CircleGeometry(ISLAND_R, 64),
    new THREE.MeshLambertMaterial({map:groundTexture()}));
  top.rotation.x = -Math.PI/2; top.position.y = 0.01; scene.add(top);
  const side = new THREE.Mesh(new THREE.CylinderGeometry(ISLAND_R, ISLAND_R*0.72, 16, 48, 3),
    mat(NIGHT?0x4a3b2e:0x8d6748));
  side.position.y = -8; scene.add(side);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(ISLAND_R*0.72, 6, 22, 32),
    mat(NIGHT?0x3c2f24:0x7a583c));
  tip.position.y = -27; scene.add(tip);

  // อาคารทุกหลัง + ไอคอนลอย + hitbox
  BUILDINGS.forEach(b=>{
    const a = b.deg*Math.PI/180;
    const x = Math.cos(a)*b.r, z = -Math.sin(a)*b.r;
    _lastDoor = null; _lastKind = 'swing'; _lastSpill = []; _lastGlow = [];   // 🚪 รอบ 890/897: ล้างค้างจากตึกก่อนหน้าเสมอ
    const g = b.build();
    registerDoor(b.key);                    // 🚪 รอบ 890: ตึกไหนมีบานประตู = จดทะเบียนไว้สั่งเปิด-ปิด
    g.position.set(x, 0, z);
    g.rotation.y = Math.atan2(-x, -z);      // หันหน้าเข้าลานกลาง
    scene.add(g);
    BLD_AT[b.key] = {x, z, ry:g.rotation.y, h:g.userData.h||8};
    const ic = iconSprite(b.ico, b.label);
    ic.position.set(x, (g.userData.h||8)+1.8, z);
    ic.userData.baseY = ic.position.y;
    ic.userData.ph = rnd(0, TAU);
    scene.add(ic);
    tickers.push((dt,t)=>{
      ic.position.y = ic.userData.baseY + Math.sin(t*1.8+ic.userData.ph)*0.45;
      /* 🔍 รอบ 873: ซูมออกป้ายขยายตาม (ตัวหนังสือใหญ่อ่านง่ายเสมอ — เดิมไกลแล้วเล็กจนอ่านไม่ออก)
         dist≤34 = ขนาดเดิม · ไกลกว่านั้นขยายเชิงเส้นถึง ~×2.9 ที่ dist 150 (ขนาดบนจอเกือบคงที่) */
      const k = Math.max(1, rig.dist/52);
      ic.scale.set(5.6*k, 6.55*k, 1);
    });
    // hitbox ใหญ่กดง่าย (โปร่งใส)
    const hb = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, (g.userData.h||8)+4, 8),
      new THREE.MeshBasicMaterial({visible:false}));
    hb.position.set(x, ((g.userData.h||8)+4)/2, z);
    hb.userData.bld = b;
    scene.add(hb); clickables.push(hb);
  });

  buildPlaza();
  buildGreens();
  buildSky();
  buildAmbientTraffic();
  buildFestival();
}

/* ⛲ ลานกลาง: น้ำพุ + ป้ายเมือง + ป้ายคำศัพท์วันนี้ */
function buildPlaza(){
  const f = new THREE.Group();
  f.add(M(cyl(4.6,5.0,0.7,20), mat(0xcbb98d), 0, 0.35, 0));
  f.add(M(cyl(3.9,3.9,0.5,20), mat(0x4db3e6,{transparent:true,opacity:0.9}), 0, 0.75, 0));
  f.add(M(cyl(0.7,0.9,2.4,10), mat(0xbfa87a), 0, 1.6, 0));
  f.add(M(cyl(1.7,1.7,0.3,14), mat(0xcbb98d), 0, 2.9, 0));
  const jet = M(cyl(0.4,0.12,1.6,8), mat(0xbfe8ff,{transparent:true,opacity:0.8}), 0, 3.9, 0);
  f.add(jet);
  const drops=[];
  for(let i=0;i<6;i++){
    const d = M(new THREE.SphereGeometry(0.14,6,5), mat(0xd4f2ff,{transparent:true,opacity:0.9}), 0, 0, 0);
    d.userData.ph = i/6*TAU; f.add(d); drops.push(d);
  }
  tickers.push((dt,t)=>{
    jet.scale.y = 1+Math.sin(t*3)*0.12;
    drops.forEach(d=>{
      const k = ((t*0.9 + d.userData.ph)%TAU)/TAU;
      const r = 0.4+k*2.6;
      d.position.set(Math.cos(d.userData.ph+t*0.4)*r, 4.4-4.5*k*k+1.2*k, Math.sin(d.userData.ph+t*0.4)*r);
      d.material.opacity = 0.9*(1-k);
    });
  });
  scene.add(f);

  // 🪧 ป้าย VOCAB WORLD โค้งทอง (billboard เสาคู่ที่ทางเข้าเหนือ)
  const sign = new THREE.Group();
  const c = cvs(1024,256), g = c.getContext('2d');
  const gr = g.createLinearGradient(0,0,0,256);
  gr.addColorStop(0,'#12306b'); gr.addColorStop(1,'#0a1f3c');
  g.fillStyle=gr; roundRect(g, 8, 8, 1008, 240, 48); g.fill();
  g.strokeStyle='#e8b64c'; g.lineWidth=10; roundRect(g, 8, 8, 1008, 240, 48); g.stroke();
  g.font='900 118px system-ui'; g.textAlign='center'; g.textBaseline='middle';
  const gg = g.createLinearGradient(0,60,0,200);
  gg.addColorStop(0,'#ffe9a8'); gg.addColorStop(0.5,'#e8b64c'); gg.addColorStop(1,'#c98f2c');
  g.fillStyle=gg; g.fillText('VOCAB WORLD', 512, 118);
  g.font='700 54px system-ui'; g.fillStyle='#bfe0ff'; g.fillText('🏙️ ยินดีต้อนรับสู่เมืองคำศัพท์', 512, 204);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.25),
    new THREE.MeshBasicMaterial({map:ctex(c), transparent:true, side:THREE.DoubleSide}));
  board.position.y = 4.6;
  sign.add(board);
  [-6.2, 6.2].forEach(x=>sign.add(M(cyl(0.16,0.2,4.6,8), mat(0x8d97a3), x, 2.3, 0)));
  sign.position.set(0, 0, -13.2);
  scene.add(sign);
}

/* 🌳 ต้นไม้/โคมไฟ/ม้านั่ง โปรยรอบเมือง */
function buildGreens(){
  const R=(s=>()=>{s=(s*48271)%2147483647;return s/2147483647;})(99);
  const tree = (x,z,s)=>{
    const g = new THREE.Group();
    g.add(M(cyl(0.16*s,0.22*s,1.1*s,7), mat(0x8d6e63), 0, 0.55*s, 0));
    const leaf = mat([0x66bb6a,0x81c784,0x4caf50][ (x*7+z*13|0)%3 & 2 ] || 0x66bb6a);
    g.add(M(new THREE.SphereGeometry(0.95*s,8,7), leaf, 0, 1.75*s, 0));
    g.add(M(new THREE.SphereGeometry(0.6*s,8,7), leaf, 0.55*s, 1.3*s, 0.15*s));
    g.add(M(new THREE.SphereGeometry(0.55*s,8,7), leaf, -0.5*s, 1.45*s, -0.2*s));
    g.position.set(x,0,z);
    scene.add(g);
  };
  const lamp = (x,z)=>{
    const g = new THREE.Group();
    g.add(M(cyl(0.07,0.1,3.1,6), mat(0x546e7a), 0, 1.55, 0));
    g.add(M(new THREE.SphereGeometry(0.24,8,6), mat(0xfff59d, NIGHT?{emissive:0xcc9900}:{}), 0, 3.25, 0));
    if(NIGHT){
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:_glowTex(), transparent:true, opacity:0.55, depthWrite:false}));
      glow.scale.set(3.4,3.4,1); glow.position.y=3.25; g.add(glow);
    }
    g.position.set(x,0,z); scene.add(g);
  };
  // โคมรอบวงในทุก 45° + วงนอกทุก 30°
  for(let i=0;i<8;i++){ const a=i/8*TAU+0.39; lamp(Math.cos(a)*(RING_IN+6.5), Math.sin(a)*(RING_IN+6.5)); }
  for(let i=0;i<12;i++){ const a=i/12*TAU+0.26; lamp(Math.cos(a)*(RING_OUT-6.8), Math.sin(a)*(RING_OUT-6.8)); }
  // ต้นไม้สุ่มในแนวหญ้า (เลี่ยงถนน/อาคาร)
  for(let i=0;i<64;i++){
    const a=R()*TAU;
    const band = R();
    const r = band<0.35 ? 26+R()*4 : (band<0.7 ? 40+R()*4.5 : 52+R()*5.5);
    const x=Math.cos(a)*r, z=Math.sin(a)*r;
    if(Object.values(BLD_AT).some(p=>Math.hypot(p.x-x,p.z-z)<8.5)) continue;
    tree(x,z, 0.85+R()*0.7);
  }
  for(let i=0;i<10;i++){ const a=i/10*TAU+0.31;   // ม้านั่งรอบพลาซ่า
    const x=Math.cos(a)*13.4, z=Math.sin(a)*13.4;
    const b=new THREE.Group();
    b.add(M(box(1.7,0.12,0.5), mat(0xa1887f), 0, 0.5, 0));
    b.add(M(box(1.7,0.4,0.1), mat(0xa1887f), 0, 0.78, -0.22));
    [-0.7,0.7].forEach(xx=>b.add(M(box(0.12,0.5,0.44), mat(0x6d4c41), xx, 0.25, 0)));
    b.position.set(x,0,z); b.rotation.y = -a+Math.PI/2;
    scene.add(b);
  }
}
let _glowT=null;
function _glowTex(){
  if(_glowT) return _glowT;
  const c=cvs(128,128), g=c.getContext('2d');
  const gr=g.createRadialGradient(64,64,4,64,64,62);
  gr.addColorStop(0,'rgba(255,235,150,.9)'); gr.addColorStop(1,'rgba(255,235,150,0)');
  g.fillStyle=gr; g.fillRect(0,0,128,128);
  return _glowT=ctex(c);
}

/* ☁️ ท้องฟ้า: เมฆ/ดาว + เรือเหาะป้ายเมือง + เกาะจิ๋วลอยรอบ */
function buildSky(){
  const cldTex = (()=>{
    const c=cvs(256,128), g=c.getContext('2d');
    g.fillStyle='rgba(255,255,255,.92)';
    [[70,80,34],[110,70,42],[155,80,36],[190,88,26],[95,95,30],[140,98,30]].forEach(([x,y,r])=>{
      g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
    });
    return ctex(c);
  })();
  for(let i=0;i<10;i++){
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:cldTex, transparent:true,
      opacity: NIGHT?0.28:0.85, depthWrite:false}));
    const s = rnd(14,30);
    sp.scale.set(s, s*0.44, 1);
    sp.position.set(rnd(-160,160), rnd(26,60), rnd(-160,160));
    sp.userData.v = rnd(0.6,1.6);
    scene.add(sp);
    tickers.push(dt=>{ sp.position.x += sp.userData.v*dt; if(sp.position.x>170) sp.position.x=-170; });
  }
  if(NIGHT){   // ⭐ ดาวระยิบ
    const starGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(300*3);
    for(let i=0;i<300;i++){
      const a=rnd(0,TAU), r=rnd(120,260), y=rnd(20,150);
      pos[i*3]=Math.cos(a)*r; pos[i*3+1]=y; pos[i*3+2]=Math.sin(a)*r;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xfffde7, size:0.9, sizeAttenuation:true})));
  }
  // 🎈 เรือเหาะแบนเนอร์
  const bl = new THREE.Group();
  const hull = M(new THREE.SphereGeometry(3.2,14,10), mat(0xffab91), 0,0,0);
  hull.scale.set(2.1,0.85,0.85); bl.add(hull);
  bl.add(M(box(1.6,0.7,0.9), mat(0xfff3e0), 0, -2.6+0.6, 0));
  bl.add(M(box(0.16,1.6,1.1), mat(0xef6c60), -6.4, 0.3, 0));
  const bc = cvs(512,96), bg = bc.getContext('2d');
  bg.fillStyle='#fff'; roundRect(bg,4,4,504,88,26); bg.fill();
  bg.font='700 56px system-ui'; bg.textAlign='center'; bg.textBaseline='middle';
  bg.fillStyle='#1e58c8'; bg.fillText('🏙️ VOCAB CITY', 256, 52);
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(9,1.7),
    new THREE.MeshBasicMaterial({map:ctex(bc), transparent:true, side:THREE.DoubleSide}));
  ban.position.set(-12, -0.4, 0); bl.add(ban);
  scene.add(bl);
  tickers.push((dt,t)=>{
    const a = t*0.055;
    bl.position.set(Math.cos(a)*82, 42+Math.sin(t*0.5)*1.6, Math.sin(a)*82);
    bl.rotation.y = -a - Math.PI/2;
  });
  // 🏝️ เกาะจิ๋วลอยรอบๆ
  [[130,-18,-60,5],[-140,-26,40,6.5],[80,-30,130,4.5],[-90,-16,-120,5.5]].forEach(([x,y,z,s])=>{
    const g = new THREE.Group();
    g.add(M(new THREE.CylinderGeometry(s, s*0.25, s*0.9, 10), mat(0x8d6748), 0, -s*0.45, 0));
    g.add(M(new THREE.CylinderGeometry(s, s, 0.5, 10), mat(NIGHT?0x3c7a44:0x7ec857), 0, 0.25, 0));
    g.add(M(cyl(0.14,0.2,1.4,6), mat(0x8d6e63), 0, 1.2, 0));
    g.add(M(new THREE.SphereGeometry(1.1,8,7), mat(0x66bb6a), 0, 2.3, 0));
    g.position.set(x,y,z);
    scene.add(g);
    tickers.push((dt,t)=>{ g.position.y = y+Math.sin(t*0.4+x)*1.2; g.rotation.y = t*0.03; });
  });
}

/* 🚙 รถ NPC ไร้ชื่อ 3 คันวิ่งให้เมืองมีชีวิต (คนจริงมีป้ายชื่อ — แยกกันชัด) */
function buildAmbientTraffic(){
  [[RING_OUT-1.9, 0.10, 0xffca28], [RING_OUT+1.9, -0.085, 0x66bb6a], [RING_IN-1.6, 0.14, 0x4fc3f7]].forEach(([r, w, col], i)=>{
    const car = miniCar(col);
    car.userData.ang = i*2.1; scene.add(car);
    tickers.push(dt=>{
      car.userData.ang += w*dt;
      const a = car.userData.ang;
      car.position.set(Math.cos(a)*r, 0, Math.sin(a)*r);
      car.rotation.y = -a + (w>0 ? -Math.PI/2 : Math.PI/2);
    });
  });
}

/* ============================================================
   🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
   โซนตกแต่งล้วน ไม่แตะกล้อง/ผังเมือง/ระบบผู้เล่น — ปิดเงียบถ้าไม่ตรงช่วงเทศกาล
   ============================================================ */
const FESTIVAL = (()=>{
  try{
    const q = new URLSearchParams(location.search);
    if(q.has('festival')) return q.get('festival');   // เทสต์: ?festival=newyear|songkran|loikrathong|none
  }catch(e){}
  const d = thDate(), mm = d.getMonth()+1, dd = d.getDate();   // 🇹🇭 รอบ 988: วันไทย
  if((mm===12 && dd>=28) || (mm===1 && dd<=3)) return 'newyear';      // 🎆 ส่งท้ายปีเก่า-ต้อนรับปีใหม่
  if(mm===4 && dd>=12 && dd<=16) return 'songkran';                   // 💦 สงกรานต์ (13-15 เม.ย. + วันก่อน-หลัง)
  if(mm===11 && dd>=22 && dd<=26) return 'loikrathong';               // 🏮 ลอยกระทง (เต็มดวง 24 พ.ย. 2569)
  return 'none';
})();

function buildFestival(){
  if(FESTIVAL==='newyear') buildFireworks();
  else if(FESTIVAL==='songkran') buildSongkranDeco();
  else if(FESTIVAL==='loikrathong') buildLoiKrathongDeco();
}

/* 🎆 พลุปีใหม่ — ระเบิดสีสุ่มกลางฟ้า วนซ้ำเป็นจังหวะ */
function buildFireworks(){
  const SHELLS=4, PARTS=42, PERIOD=3.4;
  for(let s=0; s<SHELLS; s++){
    const pos = new Float32Array(PARTS*3), col = new Float32Array(PARTS*3);
    const dirs = [];
    for(let i=0;i<PARTS;i++){
      const th=rnd(0,TAU), ph=Math.acos(rnd(-1,1));
      dirs.push([Math.sin(ph)*Math.cos(th), Math.abs(Math.cos(ph))*0.85+0.35, Math.sin(ph)*Math.sin(th)]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    const pm = new THREE.PointsMaterial({size:1.7, vertexColors:true, transparent:true, opacity:1, depthWrite:false, sizeAttenuation:true});
    const pts = new THREE.Points(geo, pm);
    pts.visible = false;
    scene.add(pts);
    const offset = s*(PERIOD/SHELLS) + rnd(0,0.5);
    let lastCycle = -1;
    tickers.push((dt,t)=>{
      const tt = t+offset, cycleIdx = Math.floor(tt/PERIOD), ph2 = tt/PERIOD - cycleIdx;
      if(cycleIdx !== lastCycle){
        lastCycle = cycleIdx;
        const c = new THREE.Color().setHSL(rnd(0,1), 0.85, 0.62);
        for(let i=0;i<PARTS;i++){ col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b; }
        geo.attributes.color.needsUpdate = true;
        pts.position.set(rnd(-55,55), rnd(34,54), rnd(-55,55));
      }
      const burst = ph2 < 0.6;
      pts.visible = burst;
      if(!burst) return;
      const bt = ph2/0.6, arr = geo.attributes.position.array;
      for(let i=0;i<PARTS;i++){
        const dxr=dirs[i], r=bt*7.5;
        arr[i*3]=dxr[0]*r; arr[i*3+1]=dxr[1]*r-bt*bt*4.5; arr[i*3+2]=dxr[2]*r;
      }
      geo.attributes.position.needsUpdate = true;
      pm.opacity = 1-bt*bt;
    });
  }
}

/* 💦 สงกรานต์ — พวงธงหลากสีรอบลานกลาง + จุดสาดน้ำเป็นจังหวะ */
function buildSongkranDeco(){
  const FLAG_COLS=[0xff5252,0xffca28,0x4fc3f7,0x66bb6a,0xff8a65,0xba68c8], N=20, R=15.5;
  const garland = new THREE.Group();
  for(let i=0;i<N;i++){
    const a = i/N*TAU;
    const flag = M(new THREE.ConeGeometry(0.34,0.55,3), mat(FLAG_COLS[i%FLAG_COLS.length]),
      Math.cos(a)*R, 5.3+Math.sin(a*4)*0.2, Math.sin(a)*R);
    flag.rotation.x = Math.PI; flag.rotation.y = -a; flag.userData.ph = i*0.7;
    garland.add(flag);
  }
  scene.add(garland);
  tickers.push((dt,t)=>garland.children.forEach(f=>{ f.rotation.z = Math.sin(t*2.6+f.userData.ph)*0.3; }));

  for(let i=0;i<8;i++){
    const a = i/8*TAU + 0.35, bx=Math.cos(a)*9.6, bz=Math.sin(a)*9.6;
    const g = new THREE.Group(), drops=[];
    for(let k=0;k<6;k++){
      const d = M(new THREE.SphereGeometry(0.11,6,5), mat(0x40c4ff,{transparent:true,opacity:0.85}));
      d.userData.ph = k/6; d.userData.dx = rnd(-0.9,0.9); d.userData.dz = rnd(-0.9,0.9);
      g.add(d); drops.push(d);
    }
    g.position.set(bx,0,bz); scene.add(g);
    const off = rnd(0,1);
    tickers.push((dt,t)=>drops.forEach(d=>{
      const k = (t*0.9+off+d.userData.ph)%1;
      d.position.set(d.userData.dx*k*2.2, 0.25+2.4*k-2.6*k*k, d.userData.dz*k*2.2);
      d.material.opacity = 0.85*(1-k);
    }));
  }
}

/* 🏮 ลอยกระทง — กระทงลอยรอบสระน้ำพุกลางลาน + โคมลอยขึ้นฟ้าทั่วเมือง */
function buildLoiKrathongDeco(){
  const N=8, R=2.6, petal = mat(0xffb74d);
  for(let i=0;i<N;i++){
    const a = i/N*TAU + rnd(-0.08,0.08);
    const k = new THREE.Group();
    k.add(M(new THREE.CylinderGeometry(0.32,0.28,0.09,10), mat(0x8d6e4a)));
    for(let p=0;p<6;p++){
      const pa = p/6*TAU;
      const leaf = M(new THREE.ConeGeometry(0.14,0.22,4), petal, Math.cos(pa)*0.22, 0.06, Math.sin(pa)*0.22);
      leaf.rotation.x = Math.PI*0.42; leaf.rotation.y = -pa;
      k.add(leaf);
    }
    k.add(M(cyl(0.02,0.02,0.14,5), mat(0xfff3c4), 0, 0.14, 0));
    const flame = M(new THREE.SphereGeometry(0.045,6,5), mat(0xffca28,{emissive:0xcc7700}), 0, 0.22, 0);
    k.add(flame);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:_glowTex(), transparent:true, opacity:0.5, depthWrite:false}));
    glow.scale.set(0.9,0.9,1); glow.position.y = 0.2; k.add(glow);
    const rr = R + rnd(-0.3,0.3);
    k.position.set(Math.cos(a)*rr, 0.78, Math.sin(a)*rr);
    scene.add(k);
    const ph = rnd(0,TAU);
    tickers.push((dt,t)=>{
      k.position.y = 0.78 + Math.sin(t*1.1+ph)*0.03;
      k.rotation.y = Math.sin(t*0.4+ph)*0.15;
      flame.scale.setScalar(1+Math.sin(t*9+ph)*0.25);
    });
  }

  const LANT_N=14;
  for(let i=0;i<LANT_N;i++){
    const lant = new THREE.Group();
    const body = M(new THREE.SphereGeometry(0.42,8,7), mat(0xffe0a3,{transparent:true,opacity:0.92,emissive:0xaa6a00}));
    lant.add(body);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:_glowTex(), transparent:true, opacity:0.6, depthWrite:false}));
    glow.scale.set(2.2,2.2,1); lant.add(glow);
    const x=rnd(-70,70), z=rnd(-70,70), y0=rnd(2,8), speed=rnd(2.4,3.4), drift=rnd(-0.3,0.3), ph=rnd(0,TAU);
    lant.position.set(x,y0,z);
    scene.add(lant);
    tickers.push((dt,t)=>{
      const cyc=16, tt=(t*speed*0.06+i*1.7)%cyc, k=tt/cyc;
      lant.position.y = y0 + k*55;
      lant.position.x = x + Math.sin(t*0.3+ph)*1.4 + drift*k*20;
      lant.position.z = z + Math.cos(t*0.26+ph)*1.4;
      body.material.opacity = k<0.85 ? 0.92 : 0.92*(1-(k-0.85)/0.15);
    });
  }
}

/* ============================================================
   🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
   ============================================================ */
const Live = {
  fb:null, db:null, uid:null,
  actors:{},          // uid → {g:Group, kind, data, label, bubY}
  lbCache:{},         // uid → leaderboard node (โปรไฟล์+ตัวละคร)
  count:0,
  self:null,          // 🙋 ตัวเรา {g, bubY, walk} — ใช้เดินไปหน้าตึก + รับบับเบิลแชทของเราเอง
  bubPend:{},         // uid → {text, ts} ข้อความที่มาถึงก่อนตัวละครจะ spawn เสร็จ
  bubSeen:{},         // uid → กันเด้งข้อความเดิมซ้ำ
  chatWatch:{},       // uid เพื่อนที่ติดตั้ง listener แชทแล้ว
  /* 🖊️ รอบ 868: ตอบแชทจากในเมือง */
  friends:{},         // uid เพื่อน → {n,g,ts} จาก /friends/<me> (ชื่อ+ชั้นสำหรับหัวกล่อง + สิทธิ์ตอบ)
  lastMsg:{},         // uid เพื่อน → ข้อความล่าสุดในคู่แชทนั้น {f,t,ts} (โชว์เป็นบริบทในกล่อง)
  bubList:[],         // บับเบิลที่ลอยอยู่ตอนนี้ [{A}] เก่า→ใหม่ (เกิน BUB_MAX = ใบเก่าสุดหายก่อน)
  chatWith:null,      // uid ที่กล่องพิมพ์กำลังเปิดคุยอยู่
  unread:{},          // 💬🔴 รอบ 873: uid เพื่อน → ข้อความล่าสุดที่ยังไม่ได้อ่าน (ป้ายค้างเหนือหัว)
  onlineN:0,          // จำนวนคนออนไลน์ล่าสุด (ไว้ประกอบข้อความบนชิปคู่กับจำนวนที่ค้างอ่าน)
  off:[],             // ฟังก์ชันเลิกฟัง RTDB ทุกตัว (เรียกตอนออกจากหน้า — ไม่อ่านค้าง)
  pollT:0,            // setInterval ของ pollWorlds
};
/* act (emoji ท้ายข้อความ) → อาคารที่ไปยืน */
function actBuilding(act){
  const s = String(act||'');
  if(s.includes('🎮')) return 'play';
  if(s.includes('🖼️')) return 'picmatch';   // 🖼️ รอบ 977: เพื่อนที่กำลังจับคู่ภาพ ไปยืนหน้าหอศิลป์
  if(s.includes('📖')) return 'picdict';    // 📖 รอบ 992: เพื่อนที่กำลังอ่านพจนานุกรมภาพ ไปยืนหน้าร้านหนังสือ
  if(s.includes('📝')) return 'academy';
  if(s.includes('📚')) return 'library';
  if(s.includes('📊')) return 'stats';
  if(s.includes('🐾')) return 'petshop';
  return 'home';
}
function loadFirebase(){
  const base='https://www.gstatic.com/firebasejs/10.14.1/';
  const files=['firebase-app-compat.js','firebase-auth-compat.js','firebase-database-compat.js'];
  return files.reduce((p,f)=>p.then(()=>new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src=base+f; s.onload=res; s.onerror=rej; document.head.appendChild(s);
  })), Promise.resolve());
}
function liveStart(){
  if(typeof FIREBASE_CONFIG==='undefined') return setChip('📴 โหมดชมเมือง');
  loadFirebase().then(()=>{
    firebase.initializeApp(FIREBASE_CONFIG);
    Live.fb=firebase; Live.db=firebase.database();
    firebase.auth().onAuthStateChanged(u=>{
      Live.uid = u ? u.uid : null;
      if(!u){ setChip('🔑 ล็อกอินในเกมก่อน แล้วจะเห็นเพื่อนในเมือง'); return; }
      watchPresence();
      watchFriendChats();          // 💬 บับเบิลแชทสดของเพื่อนที่ยืนอยู่ในเมือง
      pollWorlds();
      Live.pollT = setInterval(pollWorlds, 10000);   // โลก 3D poll ทุก 10 วิ (on() จะโดนสแปมตำแหน่งถี่เกิน)
    });
  }).catch(()=>setChip('📴 โหมดชมเมือง (ออฟไลน์)'));
}
function lbGet(uid){
  if(Live.lbCache[uid]) return Promise.resolve(Live.lbCache[uid]);
  if(!Live.db) return Promise.resolve(null);
  return Live.db.ref('leaderboard/'+uid).get().then(s=>{
    const v = s && s.val() || null;
    if(v) Live.lbCache[uid]=v;
    return v;
  }).catch(()=>null);
}
/* 🧍 presence: ใครออนไลน์ กำลังทำอะไร → ยืนหน้าอาคารนั้น */
function watchPresence(){
  const pref = Live.db.ref('presence');
  const ph = pref.on('value', snap=>{
    const now=Date.now(), seen={};
    let n=0;
    snap.forEach(ch=>{
      const v=ch.val()||{};
      if(!v.n || !v.at || now-v.at > 10*60*1000) return;   // ผีค้าง 10 นาทีตัดทิ้ง (กติกาเดียวกับ online.js)
      n++;
      if(ch.key===Live.uid) return;                        // ตัวเรายืนที่พลาซ่าอยู่แล้ว
      seen[ch.key]=true;
      spawnStander(ch.key, v);
    });
    Live.count=n; Live.onlineN=n;
    refreshChip();
    // คนหลุด → เก็บตัวละครออก (เฉพาะพวกยืน — ยานพาหนะจัดการใน pollWorlds)
    Object.keys(Live.actors).forEach(uid=>{
      const a=Live.actors[uid];
      if(a.kind==='stand' && !seen[uid]) removeActor(uid);
    });
    refreshDoorRest();     // 🚪👥 รอบ 892: ตึกไหนมีคนยืนอยู่ = แง้มประตูไว้ (ตัวที่เพิ่ง spawn ยังไม่เสร็จจะเรียกซ้ำเอง)
  }, ()=>setChip('🟢 เมืองพร้อม (อ่านเพื่อนไม่ได้)'));
  Live.off.push(()=>pref.off('value', ph));      // 🧹 รอบ 868: ออกจากหน้าแล้วเลิกอ่าน
}
function spawnStander(uid, v){
  const cur = Live.actors[uid];
  const bkey = actBuilding(v.act);
  if(cur && cur.kind==='stand' && cur.bkey===bkey){ cur.data=v; return; }
  if(cur) removeActor(uid);
  lbGet(uid).then(lb=>{
    if(Live.actors[uid]) return;                    // กันซ้อน (โดน spawn เป็นยานไปแล้ว)
    const blk = pickBlk(lb && lb.ba, uid);
    const g = makeFigure(blk);
    /* ยืน "หน้าตึก" = ถอยจากตึกเข้าหาศูนย์กลางเมือง 7-9.5 หน่วย + กระจายซ้ายขวากันทับกัน */
    const spot = BLD_AT[bkey] || {x:10,z:10};
    const rr = Math.hypot(spot.x, spot.z) || 10;
    const toC  = 7 + (hash(uid+'d')%25)/10;
    const tang = (hash(uid)%56)/10 - 2.8;
    const k = Math.max(0.1, (rr-toC)/rr);
    g.position.set(spot.x*k + (-spot.z/rr)*tang, 0, spot.z*k + (spot.x/rr)*tang);
    g.rotation.y = rnd(0,TAU);
    const label = nameSprite(v.n, v.g);
    label.position.y = 3.4;
    g.add(label);
    scene.add(g);
    markPickable(g, {uid, name:v.n, grade:v.g, act:v.act, blk});
    const ph = rnd(0,TAU);
    const tick = (dt,t)=>{                       // เด้งตัวเบาๆ + หมุนซ้ายขวา
      g.position.y = Math.abs(Math.sin(t*2.2+ph))*0.08;
      g.rotation.y += Math.sin(t*0.35+ph)*0.0015;
    };
    tickers.push(tick);
    Live.actors[uid] = {g, kind:'stand', bkey, data:v, tick, blk, bubY:4.9};
    refreshDoorRest();                           // 🚪👥 รอบ 892: lbGet เป็น async — ตัวจริงเพิ่งลงจอตอนนี้ ประตูค่อยแง้มตาม
    flushBubble(uid);                          // มีข้อความรออยู่ตั้งแต่ก่อน spawn เสร็จ
    applyUnread(uid);                            // 💬🔴 รอบ 873: มีข้อความค้างอ่าน = ติดป้ายย้อนหลัง
  });
}
/* 🚗🏍️🚁🛸 โลก 3D: /world/<map> + /wroom/<map>/<room> → ยานวิ่ง/บินในเมือง */
const WORLD_MAPS = [
  {map:'drive',   kind:'car'},
  {map:'moto',    kind:'moto'},
  {map:'heli',    kind:'heli'},
  {map:'helikpp', kind:'heli'},
  {map:'drone',   kind:'drone'},
];
function pollWorlds(){
  if(!Live.db) return Promise.resolve();
  const fresh = {};    // uid → {kind, n, av, c, ct}
  return Promise.all(WORLD_MAPS.map(w=>
    Promise.all([
      Live.db.ref('world/'+w.map).get().catch(()=>null),
      Live.db.ref('wroom/'+w.map).get().catch(()=>null),
      /* node "เย็น" ของ js/netroom.js — ชื่อ(n) + แชทลอยหัว(c) + เวลาแชท(k) ของคนในสนามย่อย
         (node ร้อน /wroom ส่งแค่พิกัด ไม่มีชื่อ/ข้อความ) */
      Live.db.ref('winfo/'+w.map).get().catch(()=>null),
    ]).then(([legacy, rooms, info])=>{
      const now=Date.now();
      const eat=(uid,v)=>{
        if(!v || uid===Live.uid) return;
        if(v.ts && now-v.ts > 60*1000) return;        // ค้างเกิน 1 นาที = ออกไปแล้ว
        fresh[uid] = {kind:w.kind, n:v.n||'ผู้เล่น', av:v.av||'', c:v.c||'', ct:v.ct||0};
      };
      if(legacy && legacy.val()){ const o=legacy.val(); Object.keys(o).forEach(k=>eat(k,o[k])); }
      if(rooms && rooms.val()){
        const rs=rooms.val();
        Object.keys(rs).forEach(rk=>{ const r=rs[rk]||{}; Object.keys(r).forEach(k=>eat(k,r[k])); });
      }
      if(info && info.val()){                          // เติมชื่อ/ข้อความให้คนที่มาจาก /wroom
        const rs=info.val();
        Object.keys(rs).forEach(rk=>{
          const r=rs[rk]||{};
          Object.keys(r).forEach(uid=>{
            const cd=r[uid]||{}, f=fresh[uid];
            if(!f) return;
            if(cd.n) f.n = cd.n;
            if(cd.c){ f.c = cd.c; f.ct = cd.k || f.ct; }
          });
        });
      }
    })
  )).then(()=>{
    // สร้าง/อัปเดตยานของทุกคนที่อยู่ในโลก 3D
    Object.keys(fresh).forEach(uid=>{
      const f=fresh[uid], cur=Live.actors[uid];
      if(f.c) showBubble(uid, f.c, f.ct);              // 💬 ข้อความที่เขาพิมพ์ในโลก 3D ลอยมาถึงเมืองด้วย
      if(cur && cur.kind===f.kind) return;
      if(cur) removeActor(uid);
      spawnVehicle(uid, f);
    });
    // คนออกจากโลก → ถอดยาน (presence จะพากลับมายืนเองรอบหน้า)
    Object.keys(Live.actors).forEach(uid=>{
      const a=Live.actors[uid];
      if(a.kind!=='stand' && !fresh[uid]) removeActor(uid);
    });
  });
}
function spawnVehicle(uid, f){
  lbGet(uid).then(lb=>{
    if(Live.actors[uid]) return;
    const blkRaw = String(f.av||'');
    const blkId = (blkRaw.match(/^blk\d+/)||[])[0] || pickBlk(lb && lb.ba, uid);
    const carCode = (blkRaw.match(/c\d\d$/)||[])[0];
    let g, tick;
    const label = nameSprite(f.n, lb && lb.g, 'rgba(255,200,90,.9)');
    const H = hash(uid);
    if(f.kind==='car' || f.kind==='moto'){
      const isCar = f.kind==='car';
      g = isCar ? miniCar(CAR_COL[carCode] || [0xd32f2f,0x1976d2,0xf9a825,0x8e24aa,0x00897b][H%5])
                : miniMoto([0xef5350,0x42a5f5,0xffca28,0xab47bc,0x26a69a][H%5], blkId);
      label.position.y = isCar?2.6:2.4; g.add(label);
      const lane = isCar ? (H%2 ? RING_OUT-1.9 : RING_OUT+1.9) : RING_IN+ (H%2? -1.6:1.6);
      const w = (H%2?1:-1) * (isCar? rnd(0.09,0.13) : rnd(0.13,0.18));
      let ang = (H%628)/100;
      tick = dt=>{
        ang += w*dt;
        g.position.set(Math.cos(ang)*lane, 0, Math.sin(ang)*lane);
        g.rotation.y = -ang + (w>0?-Math.PI/2:Math.PI/2);
      };
    }else if(f.kind==='heli'){
      g = miniHeli([0xe53935,0x1e88e5,0x8d6e63,0x00897b][H%4]);
      label.position.y = 3.2; g.add(label);
      const r = 30+(H%40), h = 26+(H%14), w = (H%2?1:-1)*rnd(0.10,0.16);
      let ang=(H%628)/100;
      tick = (dt,t)=>{
        ang += w*dt;
        g.position.set(Math.cos(ang)*r, h+Math.sin(t*0.9+H)*1.6, Math.sin(ang)*r);
        g.rotation.y = -ang + (w>0?-Math.PI/2:Math.PI/2);
        g.rotation.z = (w>0?-1:1)*0.10;
        g.userData.rot.rotation.y = t*20;
        g.userData.trot.rotation.z = t*24;
      };
    }else{  // drone
      g = miniDrone([0x26c6da,0xff7043,0x9ccc65,0xba68c8][H%4]);
      g.scale.setScalar(1.5);
      label.position.y = 1.9; label.scale.set(4.4,1.45,1); g.add(label);
      const keys = Object.keys(BLD_AT), home = BLD_AT[keys[H%keys.length]];
      const r = 8+(H%10), h = 15+(H%8), w=(H%2?1:-1)*rnd(0.3,0.5);
      let ang=(H%628)/100;
      tick = (dt,t)=>{
        ang += w*dt;
        g.position.set(home.x+Math.cos(ang)*r, h+Math.sin(t*1.3+H)*1.2, home.z+Math.sin(ang)*r);
        g.rotation.y = -ang;
        g.userData.props.forEach(p=>p.rotation.y = t*26);
      };
    }
    scene.add(g);
    const kindTh = {car:'กำลังขับรถในโลกขับรถ 🚗', moto:'กำลังซิ่งมอเตอร์ไซค์ 🏍️',
                    heli:'กำลังบินเฮลิคอปเตอร์ 🚁', drone:'กำลังบังคับโดรน 🛸'}[f.kind];
    markPickable(g, {uid, name:f.n, grade:lb && lb.g, act:kindTh, blk:blkId});
    tickers.push(tick);
    Live.actors[uid] = {g, kind:f.kind, tick, blk:blkId, bubY:label.position.y+1.9,
                        data:{n:f.n, g:lb && lb.g, act:kindTh}};   // 🖊️ รอบ 868: ชื่อ+ชั้นไว้ทำหัวกล่องพิมพ์ตอบ
    flushBubble(uid);
    applyUnread(uid);                            // 💬🔴 รอบ 873: ป้ายค้างอ่านตามไปกับยานพาหนะด้วย
  });
}
function removeActor(uid){
  const a = Live.actors[uid];
  if(!a) return;
  scene.remove(a.g);
  const i = tickers.indexOf(a.tick); if(i>=0) tickers.splice(i,1);
  killBubble(a);                       // 💬 บับเบิลค้างต้องถอดด้วย (รอบ 868: คืน texture + ถอดจุดแตะ + ออกจากคิว)
  removeUnreadBadge(uid);              // 💬🔴 รอบ 873: ป้ายค้างอ่านถอดด้วย (ข้อมูลยังอยู่ใน Live.unread — กลับมาก็ติดใหม่)
  delete Live.bubSeen[uid];
  if(Live.chatWith===uid) closeChatBox();   // 🖊️ รอบ 868: คนที่เรากำลังพิมพ์คุยด้วยออกจากเมืองไปแล้ว
  a.g.traverse(o=>{ const j=actorPick.indexOf(o); if(j>=0) actorPick.splice(j,1); });
  delete Live.actors[uid];
  if(a.kind==='stand') refreshDoorRest();   // 🚪👥 รอบ 892: คนสุดท้ายออกจากตึกนั้น = ปิดประตูตาม
}
function markPickable(g, info){
  g.traverse(o=>{ if(o.isMesh||o.isSprite){ o.userData.actor=info; actorPick.push(o); } });
}

/* ============================================================
   💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
   2 ท่อ (ทั้งคู่เป็นของจริงจาก RTDB · อ่านอย่างเดียว ไม่เขียนอะไรเลย):
     ① เพื่อนที่อยู่ในโลก 3D → `winfo/<map>/<room>/<uid>` field `c`(ข้อความ) + `k`(เวลา)
        = ข้อความลอยหัวชุดเดียวกับที่เขาพิมพ์ในโลกนั้น (โลกเขียนผ่าน js/netroom.js)
     ② เพื่อนที่ยืนอยู่ในเมือง (presence) → `chats/<pairId>` ข้อความล่าสุดของคู่เรา-เขา
        (rules อ่านได้เฉพาะคู่สนทนา → เห็นเฉพาะแชทของเราเอง ไม่ใช่ของคนอื่น)
   ข้อความเก่ากว่า BUB_FRESH ไม่เด้ง · ตัวละครยังไม่ spawn เก็บเข้า Live.bubPend รอ
   ============================================================ */
const BUB_MS    = 9000;          // บับเบิลลอยอยู่กี่มิลลิวินาที
const BUB_FRESH = 3*60*1000;     // ข้อความสดกว่านี้ถึงเด้ง (กันข้อความค้างเมื่อวานโผล่)
const BUB_MAXCH = 90;
const BUB_MAX      = 5;          // 🖊️ รอบ 868: ลอยพร้อมกันได้ไม่เกินกี่ใบ (เกิน = ใบเก่าสุดหายก่อน) — กันเมืองรก/กระตุก
const BUB_TEX_KEEP = 14;         // 🖊️ รอบ 868: เก็บ texture ไว้ใช้ซ้ำกี่ข้อความ (ข้อความเดิม = ไม่วาด canvas ใหม่)

/* 🖊️ รอบ 868: คลัง texture ตามข้อความ (Map = LRU ในตัว — คีย์ที่แตะล่าสุดอยู่ท้ายเสมอ)
   วาด canvas 512×268 ใหม่ทุกใบทำให้เมืองสะดุดตอนคุยกันรัว ๆ → ข้อความซ้ำ (เช่น "เข้า ตลาด 🏪",
   "สวัสดี") ใช้ texture เดิมได้เลย · ใบที่ถูกไล่ออกจากคลังแต่ยังลอยอยู่ ค่อย dispose ตอนใบนั้นหาย */
const bubTexCache = new Map();
function bubTexture(text){
  const hit = bubTexCache.get(text);
  if(hit){ bubTexCache.delete(text); bubTexCache.set(text, hit); return hit; }   // แตะแล้วเลื่อนไปท้าย = ใหม่สุด
  const tex = bubDraw(text);
  bubTexCache.set(text, tex);
  if(bubTexCache.size > BUB_TEX_KEEP){
    const k = bubTexCache.keys().next().value, old = bubTexCache.get(k);
    bubTexCache.delete(k);
    if(old){ if(old.__use > 0) old.__dead = true; else old.dispose(); }          // ยังลอยอยู่ = ทิ้งทีหลัง
  }
  return tex;
}
function bubTexRelease(tex){
  if(!tex) return;
  tex.__use = Math.max(0, (tex.__use||1) - 1);
  if(tex.__dead && tex.__use === 0) tex.dispose();      // คืน GPU memory จริงเมื่อไม่มีใครใช้แล้ว
}
function bubbleSprite(text){
  const tex = bubTexture(text);
  tex.__use = (tex.__use||0) + 1;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthTest:false}));
  sp.scale.set(7.2, 3.77, 1);
  sp.renderOrder = 22;
  sp.userData.tex = tex;
  return sp;
}
function bubDraw(text){
  const c = cvs(512, 268), g = c.getContext('2d');
  g.font = '600 42px system-ui, sans-serif';
  /* ตัดบรรทัดเอง (ไทยไม่มีเว้นวรรค → ตัดตามความกว้างทีละตัว) */
  const lines=[], MAXW=396;              // เว้นขอบซ้าย-ขวาในกล่อง ~32px
  let cur='';
  String(text).slice(0,BUB_MAXCH).split(/(\s+)/).forEach(w=>{
    for(const ch of w){
      if(g.measureText(cur+ch).width > MAXW){ lines.push(cur); cur=''; }
      cur += ch;
    }
  });
  if(cur.trim()) lines.push(cur);
  const L = Math.min(3, lines.length||1);
  const bh = 30 + L*54, top = 200-bh;      // แถวสูง 54 = ไทยมีสระบน/ล่างไม่ชนกัน
  g.fillStyle='rgba(255,255,255,.96)'; roundRect(g, 26, top, 460, bh, 26); g.fill();
  g.strokeStyle='rgba(66,120,190,.9)'; g.lineWidth=5; roundRect(g, 26, top, 460, bh, 26); g.stroke();
  g.beginPath();                                   // หางบับเบิลชี้ลงหัวเจ้าของ
  g.moveTo(232, 200-2); g.lineTo(256, 236); g.lineTo(288, 200-2); g.closePath();
  g.fillStyle='rgba(255,255,255,.96)'; g.fill();
  g.strokeStyle='rgba(66,120,190,.9)'; g.lineWidth=5;
  g.beginPath(); g.moveTo(232, 200); g.lineTo(256, 236); g.lineTo(288, 200); g.stroke();
  g.fillStyle='#16233d'; g.textAlign='center'; g.textBaseline='middle';
  for(let i=0;i<L;i++) g.fillText(lines[i].trim(), 256, top+42+i*54, 416);
  return ctex(c);
}
/* 🖊️ รอบ 868: เก็บบับเบิลของคนนี้ทิ้งให้เกลี้ยง (sprite + ticker + จุดที่แตะได้ + คืน texture) */
function killBubble(A){
  if(!A || !A.bub) return;
  const sp = A.bub;
  A.g.remove(sp);
  const i = tickers.indexOf(A.bubTick);   if(i>=0) tickers.splice(i,1);
  const j = actorPick.indexOf(sp);        if(j>=0) actorPick.splice(j,1);
  const b = Live.bubList.indexOf(A);      if(b>=0) Live.bubList.splice(b,1);
  if(sp.material) sp.material.dispose();
  bubTexRelease(sp.userData.tex);
  if(A.badge) A.badge.visible = true;              // 💬🔴 รอบ 873: บับเบิลหายแล้ว ป้ายค้างอ่านโผล่คืน
  A.bub = null; A.bubTick = null; A.bubTxt = '';
}
/* uid: uid จริง หรือ '__self' (ตัวเรา) */
function showBubble(uid, text, ts){
  const raw = String(text||'').trim();
  if(!raw) return;
  if(ts && Date.now()-ts > BUB_FRESH) return;
  const sig = raw+'|'+(ts||0);
  if(Live.bubSeen[uid]===sig) return;              // ข้อความเดิม (poll ซ้ำ/on ยิงซ้ำ) ไม่เด้งใหม่
  const A = (uid==='__self') ? Live.self : Live.actors[uid];
  if(!A || !A.g){ Live.bubPend[uid] = {text:raw, ts:ts||Date.now()}; return; }
  Live.bubSeen[uid] = sig;
  /* 🖊️ รอบ 868: ข้อความเดียวกันมาจาก 2 ท่อ (winfo + chats) หรือของเราที่เด้งเองตอนกดส่งแล้ว
     server ตอบ ts จริงกลับมาทีหลัง → อย่าเริ่มใบใหม่ทับ ปล่อยใบเดิมลอยต่อ */
  if(A.bub && A.bubTxt===raw && performance.now()-A.bubAt < BUB_MS) return;
  const msg = bubSafeText(raw);                    // 🙊 รอบ 868: กรองคำหยาบ "ก่อนแสดง" ด้วยตัวกรองเดิมของเกม
  killBubble(A);                                   // ใบเดิมของคนนี้หายก่อน
  while(Live.bubList.length >= BUB_MAX) killBubble(Live.bubList[0]);   // เต็มโควตา = ใบเก่าสุดหายก่อน
  const sp = bubbleSprite(msg);
  const y0 = (A.bubY || 4.6);
  sp.position.y = y0;
  A.g.add(sp);
  /* 👆 รอบ 868: บับเบิลเองแตะได้ → เปิดกล่องพิมพ์ตอบคนนี้ทันที (ไม่ต้องเล็งตัวเล็ก ๆ) */
  sp.userData.actor = Object.assign(actorInfo(uid), {bubble:true});
  actorPick.push(sp);
  const t0 = performance.now();
  const tick = ()=>{
    const el = performance.now()-t0;
    if(el >= BUB_MS){ killBubble(A); return; }     // หมดเวลา → เก็บทิ้ง
    sp.position.y = y0 + Math.min(0.45, el/900*0.45) + Math.sin(el/420)*0.06;
    sp.material.opacity = el<220 ? el/220 : (el>BUB_MS-900 ? (BUB_MS-el)/900 : 1);
    /* 🔍 รอบ 868: ซูมออกไกลแล้วยังอ่านออก — ขยายใบตามระยะกล้อง (คุมเพดานไว้ ไม่ให้บังเมือง) */
    const k = clamp(rig.dist/88, 1, 2.1);
    sp.scale.set(7.2*k, 3.77*k, 1);
  };
  if(A.badge) A.badge.visible = false;             // 💬🔴 รอบ 873: บับเบิลลอยอยู่ = ซ่อนป้ายค้างอ่านไว้ก่อน
  A.bub = sp; A.bubTick = tick; A.bubTxt = raw; A.bubAt = performance.now();
  Live.bubList.push(A);
  tickers.push(tick);
}
/* ตัวละครเพิ่ง spawn เสร็จ → ถ้ามีข้อความค้างรออยู่ เด้งเลย */
function flushBubble(uid){
  const p = Live.bubPend[uid];
  if(!p) return;
  delete Live.bubPend[uid];
  if(Date.now()-p.ts > BUB_FRESH) return;
  showBubble(uid, p.text, p.ts);
}
/* 💬 ท่อ ②: ข้อความล่าสุดของแชทเรา-เพื่อนแต่ละคน (rules: อ่านได้เฉพาะคู่ตัวเอง) */
function watchFriendChats(){
  if(!Live.db || !Live.uid) return;
  const fref = Live.db.ref('friends/'+Live.uid);
  const fh = fref.on('value', snap=>{
    const v = snap.val() || {};
    Object.keys(v).forEach(fu=>{
      Live.friends[fu] = v[fu] || {};        // 🖊️ รอบ 868: จำชื่อ+ชั้นเพื่อน (หัวกล่องแชท + สิทธิ์พิมพ์ตอบ)
      if(Live.chatWatch[fu]) return;
      Live.chatWatch[fu] = true;
      const pid = [Live.uid, fu].sort().join('_');
      const q = Live.db.ref('chats/'+pid).orderByKey().limitToLast(1);
      const h = q.on('value', s=>{
        let last=null; s.forEach(ch=>{ last=ch.val(); });
        if(!last || !last.t || !last.ts) return;
        Live.lastMsg[fu] = last;             // 🖊️ รอบ 868: ข้อความล่าสุด — โชว์เป็นบริบทในกล่องพิมพ์ตอบ
        showBubble(last.f===Live.uid ? '__self' : fu, last.t, last.ts);
        if(Live.chatWith===fu){ chatBoxRefresh(); markReadCity(fu); }   // เปิดกล่องคุยอยู่ = อ่านทันที
        else setUnread(fu, last);            // 💬🔴 รอบ 873: ค้างอ่านไหม → ป้ายเหนือหัว
        refreshChip();
      }, ()=>{});
      Live.off.push(()=>q.off('value', h));
    });
  }, ()=>{});
  Live.off.push(()=>fref.off('value', fh));
}

/* ============================================================
   🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
   ------------------------------------------------------------
   ต่อระบบแชทเดิมของเกมตรง ๆ ไม่มีระบบใหม่ซ้อน:
     · path เดียวกับ js/online.js → /chats/<pairId>/<push> = {f:uid ผู้ส่ง, t:ข้อความ, ts:เวลา}
     · pairId = [เรา, เขา].sort().join('_')  (สูตรเดียวกับ chatPairId())
     · กติกาเดียวกับ chatSend(): ยุบช่องว่าง → ไม่เกิน 200 ตัว → ผ่าน nameHasBadWord()
       (โหลด js/data/badwords.js ในหน้า index.html แล้ว — ไฟล์ standalone ไม่พึ่ง state/ui)
     · ข้อความที่ส่งจากที่นี่ไปโผล่ในห้องแชทเดิมของ index_classic.html ทันที (คนละหน้า DB เดียวกัน)
   ไม่ต้องแก้ Firebase rules: โซน /chats เดิมให้ทั้งคู่ใน pairId อ่าน/เขียนได้อยู่แล้ว
   กันพังเมื่อยังไม่ล็อกอิน: ไม่มี Live.uid = กล่องยังเปิดดูได้ แต่ขึ้นป้ายบอกเหตุผล ไม่มีช่องพิมพ์
   กฎคุ้มครองเด็ก: หัวกล่องโชว์เฉพาะ "ชื่อเล่น + สัญลักษณ์ระดับชั้น" (gradeStars ชุดเดียวกับป้ายในเมือง)
   ============================================================ */
const CITY_CHAT_MAX = 200;       // เท่า CHAT_MAX_LEN ใน js/online.js (rules ก็จำกัด 200 ตัวเหมือนกัน)
/* 🖊️💬 รอบ 872 ต่อยอด (2 ส.ค.): ปุ่มตอบด่วน — กดแล้วส่งทันทีผ่านกติกาเดียวกับพิมพ์เอง */
const CITY_QUICK_REPLIES = ['👋 สวัสดี!','😄 เก่งมากเลย!','🎮 ไปเล่นด้วยกันไหม?','🙏 ขอบคุณนะ','👋 เจอกันพรุ่งนี้!'];

/* 🙊 กรองก่อนแสดง: ข้อความหยาบ (เช่นส่งมาจากไคลเอนต์เก่า/แก้ DB ตรง) ไม่ขึ้นจอเด็ก */
function bubSafeText(s){
  const t = String(s||'');
  return (typeof nameHasBadWord === 'function' && nameHasBadWord(t))
       ? '🙊 ข้อความไม่สุภาพ ถูกซ่อนไว้' : t;
}
/* ชื่อ/ชั้น/ตัวละครของ uid หนึ่ง ๆ จากที่ไหนก็ได้ที่มีอยู่แล้ว (presence → /friends → leaderboard) */
function actorInfo(uid){
  if(uid === '__self') return {uid:'__self', name:'ตัวหนูเอง', self:true, blk:'blk1'};
  const A  = Live.actors[uid], fr = Live.friends[uid], lb = Live.lbCache[uid];
  const d  = (A && A.data) || {};
  return {uid,
    name : d.n || (fr && fr.n) || (lb && lb.n) || 'เพื่อน',
    grade: d.g || (fr && fr.g) || (lb && lb.g) || '',
    act  : d.act || '',
    blk  : (A && A.blk) || 'blk1'};
}
function chatBoxCanSend(){
  return !!(Live.uid && Live.db && Live.chatWith && Live.chatWith !== '__self' && Live.friends[Live.chatWith]);
}
/* ป้ายบอกเหตุผลบนจอจริง (กฎทอง #1) — ปิดฟีเจอร์เงียบ ๆ ไม่ได้ ต้องบอกว่าทำไม */
function chatBoxWhy(){
  if(!Live.uid)  return '🔑 ล็อกอินในเกมก่อน ถึงจะพิมพ์คุยกับเพื่อนได้นะ';
  if(!Live.db)   return '📡 ยังต่ออินเทอร์เน็ตไม่ได้ ลองใหม่อีกครั้งนะ';
  if(Live.chatWith && !Live.friends[Live.chatWith]) return '👋 ต้องเป็นเพื่อนกันก่อนถึงจะคุยกันได้นะ';
  return '';
}
function chatBoxRefresh(){
  const el = document.getElementById('chat-box');
  if(!el || !Live.chatWith) return;
  const info = actorInfo(Live.chatWith);
  const gs   = gradeStars(info.grade);
  const ok   = chatBoxCanSend();
  const why  = ok ? '' : chatBoxWhy();
  const lm   = Live.lastMsg[Live.chatWith];
  const lastTxt = lm && lm.t
    ? (lm.f === Live.uid ? 'หนู: ' : esc(info.name)+': ') + esc(bubSafeText(lm.t))
    : 'ยังไม่มีข้อความในห้องนี้ — ทักก่อนได้เลย 😊';
  el.innerHTML =
    '<div class="cb-card">'
    +'<button class="cb-x" id="cb-x">✕</button>'
    +'<span class="cb-who">💬 คุยกับ '+esc(info.name)
      +(gs ? ' <span style="color:'+gs.col+'">'+gs.sym+'</span>' : '')+'</span>'
    +'<div class="cb-last">'+lastTxt+'</div>'
    +(ok
      ? '<div class="cb-quick" id="cb-quick">'
          +CITY_QUICK_REPLIES.map((q,i)=>'<button class="cb-qchip" type="button" data-i="'+i+'">'+esc(q)+'</button>').join('')
        +'</div>'
        +'<div class="cb-row"><input id="cb-input" type="text" maxlength="'+CITY_CHAT_MAX+'" '
        +'placeholder="พิมพ์ตอบเพื่อน…" autocomplete="off"><button id="cb-send">ส่ง</button></div>'
      : '<a class="cb-go" href="index_classic.html?go=friends">🚪 ไปหน้าเพื่อนในล็อบบี้เดิม</a>')
    +'<div class="cb-note" id="cb-note">'+esc(why)+'</div>'
    +'</div>';
  document.getElementById('cb-x').onclick = closeChatBox;
  const send = document.getElementById('cb-send'), inp = document.getElementById('cb-input');
  if(send) send.onclick = sendCityChat;
  if(inp)  inp.onkeydown = e=>{ if(e.key === 'Enter'){ e.preventDefault(); sendCityChat(); } };
  /* 🖊️💬 รอบ 872 ต่อยอด: ชิปตอบด่วน — กดแล้วส่งข้อความสำเร็จรูปทันทีผ่านกติกาเดียวกับพิมพ์เอง */
  const quick = document.getElementById('cb-quick');
  if(quick) quick.onclick = e=>{
    const b = e.target.closest('.cb-qchip');
    if(b && !b.disabled) sendCityChatText(CITY_QUICK_REPLIES[+b.dataset.i]);
  };
}
function openChatBox(uid){
  const el = document.getElementById('chat-box');
  if(!el || !uid) return;
  if(uid === '__self'){ setChip('⭐ นี่คือตัวหนูเอง — แตะบับเบิลของเพื่อนเพื่อตอบกลับนะ'); return; }
  Live.chatWith = uid;
  markReadCity(uid);                               // 💬🔴 รอบ 873: เปิดกล่องคุย = อ่านแล้ว (ป้ายหาย ล็อบบี้เดิมก็หายตาม)
  refreshChip();
  chatBoxRefresh();
  el.style.display = 'flex';
  const inp = document.getElementById('cb-input');
  if(inp) setTimeout(()=>{ try{ inp.focus(); }catch(e){} }, 60);
}
function closeChatBox(){
  const el = document.getElementById('chat-box');
  if(el){ el.style.display = 'none'; el.innerHTML = ''; }
  Live.chatWith = null;
}
function cbNote(msg){
  const n = document.getElementById('cb-note');
  if(n) n.textContent = msg;
}
/* ✉️ ส่งเข้าระบบแชทเดิม — ตรวจชุดเดียวกับ chatSend() ใน js/online.js ทุกข้อ
   ใช้ร่วมกันทั้งช่องพิมพ์เอง (sendCityChat) และชิปตอบด่วน (sendCityChatText โดยตรง) */
function sendCityChatText(text){
  const uid = Live.chatWith;
  if(!uid) return;
  text = String(text||'').replace(/\s+/g, ' ').trim();
  if(!text)                     return cbNote('ยังไม่ได้พิมพ์ข้อความเลยนะ');
  if(text.length > CITY_CHAT_MAX) return cbNote('ข้อความยาวเกินไป (ไม่เกิน '+CITY_CHAT_MAX+' ตัว)');
  if(typeof nameHasBadWord === 'function' && nameHasBadWord(text))
                                return cbNote('ข้อความมีคำไม่สุภาพอยู่ พิมพ์ใหม่นะ 😊');
  if(!chatBoxCanSend())         return cbNote(chatBoxWhy());
  const pid = [Live.uid, uid].sort().join('_');      // = chatPairId(uid)
  const btn = document.getElementById('cb-send'), quick = document.getElementById('cb-quick');
  if(btn) btn.disabled = true;
  if(quick) quick.querySelectorAll('button').forEach(b=>{ b.disabled = true; });
  cbNote('กำลังส่ง…');
  Live.db.ref('chats/'+pid).push({
    f : Live.uid,
    t : text,
    ts: Live.fb.database.ServerValue.TIMESTAMP,
  }).then(()=>{
    const inp = document.getElementById('cb-input');
    if(inp) inp.value = '';
    cbNote('ส่งแล้ว ✓ (อยู่ในห้องแชทเดิมของเพื่อนด้วย)');
    showBubble('__self', text, Date.now());          // 💬 บับเบิลของตัวเราเองเด้งเหนือหัวทันที
  }).catch(()=>{
    cbNote('ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะ 📡');
  }).then(()=>{
    if(btn) btn.disabled = false;
    if(quick) quick.querySelectorAll('button').forEach(b=>{ b.disabled = false; });
  });
}
function sendCityChat(){
  const inp = document.getElementById('cb-input');
  if(inp) sendCityChatText(inp.value);
}
/* 🧹 ออกจากหน้า/พับแท็บ = เลิกอ่าน RTDB ทุกท่อ + หยุด poll (ไม่กินเน็ต/แบตค้างเบื้องหลัง) */
function cityStopLive(){
  Live.off.splice(0).forEach(f=>{ try{ f(); }catch(e){} });
  if(Live.pollT){ clearInterval(Live.pollT); Live.pollT = 0; }
  Live.chatWatch = {};
  closeChatBox();
}
addEventListener('pagehide', cityStopLive);
/* กลับเข้าหน้านี้จากแคชย้อนกลับ (กดปุ่ม Back จากล็อบบี้เดิม) → ต่อท่อคืน ไม่งั้นเมืองค้างข้อมูลเก่า */
addEventListener('pageshow', e=>{
  if(!e.persisted || !Live.db || !Live.uid || Live.off.length) return;
  watchPresence(); watchFriendChats(); pollWorlds();
  Live.pollT = setInterval(pollWorlds, 10000);
});
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){ if(Live.pollT){ clearInterval(Live.pollT); Live.pollT = 0; } }
  else if(Live.db && Live.uid && !Live.pollT){ pollWorlds(); Live.pollT = setInterval(pollWorlds, 10000); }
});

/* ============================================================
   💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
   ------------------------------------------------------------
   บับเบิล (รอบ 872) เด้งเฉพาะข้อความสด ≤3 นาที → เข้าเมืองช้ากว่านั้นไม่รู้เลยว่าเพื่อนทัก
   ป้ายนี้จึง "ค้างอยู่จนกว่าจะอ่าน" ต่างจากบับเบิลที่จางหายเอง
   ใช้ตัวชี้วัดเดียวกับล็อบบี้เดิม: `state.chatSeen[<pairId>]` ในเซฟ (js/online.js chatSeenTs/chatMarkSeen)
     · ยังไม่อ่าน = ข้อความล่าสุดเป็นของเพื่อน และ ts ใหม่กว่าที่จำไว้
     · เปิดกล่องคุยในเมือง = จำว่าอ่านแล้ว (เขียนกลับเซฟแบบ read-modify-write เฉพาะคีย์ chatSeen)
       → ป้ายในล็อบบี้เดิมก็หายตามกัน ไม่ต้องอ่านซ้ำสองที่
   texture ใบเดียวใช้ร่วมทุกคน (ไม่วาด canvas ใหม่ต่อคน) · ป้ายซ่อนตัวเองตอนบับเบิลของคนนั้นกำลังลอย
   ============================================================ */
const SAVE_KEY = 'petVocabAdventure_v1';
let _unreadTex = null;

function saveRead(){
  try{ return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); }catch(e){ return null; }
}
function pairIdOf(uid){ return [Live.uid, uid].sort().join('_'); }
/* อ่านถึง ts ไหนแล้ว (0 = ยังไม่เคยอ่าน) — คีย์เดียวกับล็อบบี้เดิมเป๊ะ */
function chatSeenTsCity(uid){
  const sv = saveRead();
  const v = sv && sv.chatSeen && sv.chatSeen[pairIdOf(uid)];
  return typeof v === 'number' ? v : 0;
}
/* จำว่าอ่านแล้ว — อ่านเซฟสด ๆ ก่อนเขียนเสมอ (session/แท็บอื่นอาจเพิ่งเซฟ) แตะแค่ chatSeen */
function chatMarkSeenCity(uid, ts){
  if(!Live.uid || !uid || uid === '__self') return;
  const t = typeof ts === 'number' ? ts : Date.now();
  try{
    const sv = saveRead();
    if(!sv) return;                                  // ยังไม่มีเซฟในเครื่อง = ไม่มีอะไรให้จำ
    const pid = pairIdOf(uid);
    if(!sv.chatSeen || typeof sv.chatSeen !== 'object') sv.chatSeen = {};
    if((sv.chatSeen[pid] || 0) >= t) return;
    sv.chatSeen[pid] = t;
    localStorage.setItem(SAVE_KEY, JSON.stringify(sv));
  }catch(e){}                                        // โควตาเต็ม/โหมดส่วนตัว = ข้ามไป ป้ายแค่ขึ้นซ้ำ ไม่พัง
}
function unreadTexture(){
  if(_unreadTex) return _unreadTex;
  const c = cvs(128, 128), g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,.97)';
  g.strokeStyle = 'rgba(66,120,190,.95)'; g.lineWidth = 7;
  roundRect(g, 12, 14, 104, 78, 24); g.fill(); roundRect(g, 12, 14, 104, 78, 24); g.stroke();
  g.beginPath(); g.moveTo(50, 90); g.lineTo(62, 116); g.lineTo(78, 90); g.closePath();   // หางชี้ลงหัว
  g.fillStyle = 'rgba(255,255,255,.97)'; g.fill();
  g.beginPath(); g.moveTo(50, 92); g.lineTo(62, 116); g.lineTo(78, 92); g.stroke();
  g.fillStyle = '#2a3f66';                                                               // จุดสามจุด = ข้อความ
  [40, 64, 88].forEach(x=>{ g.beginPath(); g.arc(x, 53, 8, 0, TAU); g.fill(); });
  g.fillStyle = '#e53935';                                                               // จุดแดง = ยังไม่ได้อ่าน
  g.beginPath(); g.arc(104, 24, 17, 0, TAU); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.arc(104, 24, 17, 0, TAU); g.stroke();
  _unreadTex = ctex(c);
  return _unreadTex;
}
/* ติดป้ายให้ตัวละครคนนี้ (ถ้ายังไม่มี) */
function addUnreadBadge(uid){
  const A = Live.actors[uid];
  if(!A || !A.g || A.badge) return;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:unreadTexture(), transparent:true, depthTest:false}));
  sp.scale.set(1.9, 1.9, 1);
  sp.renderOrder = 21;
  sp.position.y = (A.bubY || 4.6) + 0.5;             // เหนือป้ายชื่อพอดี ไม่ทับ (ป้ายชื่ออยู่ y 3.4 สูง ~2.2)
  sp.visible = !A.bub;                                // มีบับเบิลลอยอยู่ = ซ่อนไว้ก่อน ไม่ซ้อนกัน
  sp.userData.actor = Object.assign(actorInfo(uid), {badge:true});   // 👆 แตะป้าย = เปิดกล่องคุยเลย
  A.g.add(sp);
  actorPick.push(sp);
  const y0 = sp.position.y, ph = hash(uid) % 100 / 100 * TAU;
  const tick = (dt, t)=>{
    sp.position.y = y0 + Math.sin(t*2.2 + ph) * 0.16;               // เด้งเบา ๆ เรียกสายตา
    const k = clamp(rig.dist/88, 1, 2.1);                           // ซูมออกไกลก็ยังเห็น (สูตรเดียวกับบับเบิล)
    sp.scale.set(1.9*k, 1.9*k, 1);
    sp.material.opacity = 0.82 + Math.sin(t*3.1 + ph) * 0.18;
  };
  A.badge = sp; A.badgeTick = tick;
  tickers.push(tick);
}
function removeUnreadBadge(uid){
  const A = Live.actors[uid];
  if(!A || !A.badge) return;
  A.g.remove(A.badge);
  const i = tickers.indexOf(A.badgeTick); if(i>=0) tickers.splice(i,1);
  const j = actorPick.indexOf(A.badge);   if(j>=0) actorPick.splice(j,1);
  if(A.badge.material) A.badge.material.dispose();   // texture ใช้ร่วมกัน ไม่ dispose
  A.badge = null; A.badgeTick = null;
}
/* ข้อความล่าสุดของคู่นี้เปลี่ยน → ตัดสินว่ายังค้างอ่านไหม (เก็บไว้แม้ตัวละครยังไม่ spawn) */
function setUnread(uid, last){
  const un = !!(last && last.f !== Live.uid && (last.ts || 0) > chatSeenTsCity(uid));
  if(un) Live.unread[uid] = last; else delete Live.unread[uid];
  if(un) addUnreadBadge(uid); else removeUnreadBadge(uid);
}
/* ตัวละครเพิ่ง spawn → ติดป้ายย้อนหลังถ้ามีข้อความค้าง */
function applyUnread(uid){ if(Live.unread[uid]) addUnreadBadge(uid); }
/* อ่านแล้ว (เปิดกล่องคุย) → จำลง chatSeen + ถอดป้าย */
function markReadCity(uid){
  const last = Live.unread[uid] || Live.lastMsg[uid];
  if(!Live.unread[uid]) return;
  chatMarkSeenCity(uid, (last && last.ts) || Date.now());
  delete Live.unread[uid];
  removeUnreadBadge(uid);
}
/* กี่คนที่ยังค้างอ่าน — โชว์บนชิปมุมขวาบนคู่กับจำนวนคนออนไลน์ */
function unreadCount(){ return Object.keys(Live.unread).length; }

/* 🙋 ตัวเราเอง: อ่านจากเซฟในเครื่อง (localStorage — โดเมนเดียวกับเกม) ยืนกลางพลาซ่า
   🚶 รอบ 867: "ยังไม่มีเซฟในเครื่องนี้" ก็ต้องมีตัวเรา — ไม่งั้นแตะตึกแล้ว walkSelfTo() คืน false
   เงียบ ๆ กลายเป็นเด้งเข้าหน้าเมนูทันที (เคสจริง: เปิดแอป/เครื่องใหม่ครั้งแรก ยังไม่เคยเข้าล็อบบี้)
   ตัวแทนจะไม่มีป้ายชื่อ + ไม่มีการ์ดโปรไฟล์ (กฎคุ้มครองเด็ก: ไม่โชว์ชื่อ/ชั้นที่ไม่รู้จริง) */
function spawnSelf(){
  let sv=null;
  try{ sv = JSON.parse(localStorage.getItem('petVocabAdventure_v1')||'null'); }catch(e){}
  const named = !!(sv && sv.profileName);            // มีเซฟ = รู้ว่าเราเป็นใคร (มีป้าย+การ์ด)
  let blk = 'blk1';                                  // ตัวแทนใช้หุ่นบล็อก แขนขาแกว่งตอนเดินจริง
  if(named){
    blk = /^blk\d+$/.test(sv.profAv||'') ? sv.profAv
        : (/^blk\d+$/.test(sv.blockAv||'') ? sv.blockAv : pickBlk(null, sv.onlineId||sv.profileName));
  }
  const g = makeFigure(blk);
  /* 🚪 รอบ 870: เพิ่งกลับจากล็อบบี้เดิม → ยืนหน้าประตูตึกนั้น (ไม่ใช่กลางลานน้ำพุ) */
  const back = lastDoorKey(), bs = back ? doorSpotOf(back) : null;
  const backBld = back ? BUILDINGS.filter(b=>b.key===back)[0] : null;
  if(bs){
    g.position.set(bs.x, 0, bs.z);
    g.rotation.y = Math.atan2(bs.x-bs.bx, bs.z-bs.bz);   // หันหน้าออกจากตึก = เพิ่งเดินออกมาจากประตู
    rig.tx = bs.x; rig.tz = bs.z;                        // กล้องเล็งมาที่ตัวเรา (intro ปรับแค่ระยะ/มุมก้ม)
    /* 🚪🚶 รอบ 886: ไม่ยืนนิ่งรอแล้ว — ถอยไปตั้งต้น "ในประตู" รอเดินออกมาตอนจอเปิดจาง (walkSelfOut)
       ตาข่ายทุกทางพาตัวเรากลับมาจบที่ bs จุดเดิมเสมอ (กล้องรอบ 880 เล็งจุดนี้ไว้แล้ว) */
    stageExitWalk(g, back, backBld, bs);
    if(backBld) setChip('🚪 กำลังออกมาจาก '+backBld.ico+' '+backBld.label+' …');
  }else{
    g.position.set(3.2, 0, 8.6);
    g.rotation.y = Math.PI;
  }
  if(named){
    const label = nameSprite('⭐ '+sv.profileName, sv.student && sv.student.grade, 'rgba(255,215,90,.95)');
    label.position.y = 3.4; g.add(label);
    markPickable(g, {uid:'__self', name:sv.profileName, grade:sv.student && sv.student.grade,
                     act:'กำลังชมเมือง Vocab City 🏙️', blk, self:true,
                     coins:Math.round(sv.coins||0)});
  }
  scene.add(g);
  Live.self = {g, bubY:4.9, walk:false, named};        // 🚶 ตัวเดินไปหน้าตึก + 💬 รับบับเบิลแชทของเราเอง · named=false → ยังไม่ล็อกอิน (รอบ 869)
  tickers.push((dt,t)=>{ if(!Live.self.walk) g.position.y = Math.abs(Math.sin(t*2.1))*0.07; });
  flushBubble('__self');
  /* 🚪 รอบ 870: ป้ายบนหัวบอกว่าเพิ่งออกมาจากตึกไหน (แถบชิปโดนสถานะออนไลน์เขียนทับใน 1-2 วิ)
     🚶 รอบ 886: มีตัวเดินออกจากประตู → ย้ายไปขึ้นตอน "เดินออกมาถึงหน้าประตูแล้ว" (ไม่งั้นป้ายลอยอยู่หลังผนังตึก) */
  if(backBld && !ExitWalk.spot) showBubble('__self', '🚪 กลับมาจาก'+backBld.label+'แล้ว '+backBld.ico, Date.now());
}

/* ============================================================
   🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
   ------------------------------------------------------------
   เดิม: กลับจาก index_classic.html ทีไร ตัวเราก็เกิดกลางลานน้ำพุเสมอ (เหมือนวาร์ปกลับจุดเกิด)
        ทั้งที่เพิ่งเดินเข้าตึกไปเมื่อกี้ — เด็กต้องมองหาตัวเองใหม่ แล้วเดินย้อนกลับไปตึกเดิมอีกรอบ
   ทำ: จำ key ตึกไว้ตอนกดเข้า → ตอน spawnSelf() วางตัวเราที่ doorSpotOf(key) หันหน้าออกจากตึก
        (เหมือนเพิ่งเดินออกมาจากประตู) + เล็งกล้องมาที่จุดนั้นเลย
        ไม่เล็งกล้อง = ตึกวงนอก (r=63) จะอยู่ริมจอ หาตัวเองไม่เจอเหมือนเดิม
   เก็บใน sessionStorage = จำเฉพาะแท็บนี้ · ปิดแท็บ/เปิดแอปใหม่ = ลืม กลับไปเกิดกลางลานตามเดิม
   ============================================================ */
const DOOR_MEM = 'vwCityLastDoor';
function rememberDoor(key){ try{ sessionStorage.setItem(DOOR_MEM, key); }catch(e){} }  // โหมดส่วนตัวบางรุ่นเขียนไม่ได้ = ข้ามไป ไม่พัง
function lastDoorKey(){
  let k = '';
  try{ k = sessionStorage.getItem(DOOR_MEM) || ''; }catch(e){}
  return BLD_AT[k] ? k : '';        // ตึกที่ไม่มีอยู่จริง (ผังเปลี่ยน/ค่าเพี้ยน) = ไม่ใช้ ปล่อยเกิดกลางลาน
}

/* ============================================================
   🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
   ------------------------------------------------------------
   เดิม: เดินถึงหน้าประตู (รอบ 866) แล้วจอตัดไปหน้าอื่นทันที ประตูเป็นแผ่นไม้แปะผนังนิ่ง ๆ
        ขากลับ (รอบ 886) ก็ "ก้าวออกมาจากผนังทึบ" — เด็กไม่เห็นว่ามันคือทางเข้า-ออกจริง
   ทำ: doorAt() แขวนบานบนบานพับ (ดูโซน 🏗️ BUILDERS) · buildCity จดทะเบียน key ตึก → บานพับ
        ตัวขับข้างล่างไถองศาเข้าหาเป้าทุกเฟรม (ไม่ใช่กระโดดทันที) พร้อมเสียงตามจังหวะจริง
   จังหวะที่ใช้: ① ขาไป walkSelfTo เดินได้ 62% ของทาง = เริ่มผลักบาน → ถึงหน้าประตูบานเปิดสุดพอดี
        ② ขากลับ stageExitWalk ตั้งบาน "เปิดค้าง" ทันที (ต่อเนื่องกับภาพจอเปิดรอบ 880 ที่แคปตอนบานเปิด
        — สแนปไม่มีเสียง ไม่งั้นภาพจางมาแล้วบานกระตุกปิด) → walkSelfOut ก้าวพ้นผนัง ค่อยปิดตามหลัง
   เสียง: สังเคราะห์เอง (ไฟล์นี้ standalone ไม่มี state.sound ให้พึ่ง — ใช้ AudioContext ตัวเดียวกับ
        เสียงฝีเท้ารอบ 871) เอี๊ยด = sawtooth ไล่ความถี่ผ่าน bandpass Q สูง · ตึบ+กลอนคลิก = ยิงตอน
        บาน "ถึงวงกบจริง" (ตัวขับเป็นคนยิง) ไม่ใช่ตอนสั่งปิด ไม่งั้นเสียงมาก่อนภาพครึ่งวินาที
   🌀 รอบ 897: เพิ่มชนิดที่ 2 "ประตูม้วนเลื่อนขึ้น" (rollAt) ให้อู่รถ/โรงเก็บหุ่น/โรงเก็บโดรน — ทะเบียนเดียวกัน
   ตึกที่ builder ไม่เรียก doorAt/rollAt (สนามบอล/สนามมอไซค์/ลานยาน/ประตูป่า ฯลฯ) = ไม่มีทะเบียน สั่งแล้วเงียบ ไม่พัง
   ============================================================ */
const DOOR_SWING  = -1.85;   // เรเดียน (~106°) — ลบ = ผลักบานออกนอกตึก (ตึกหันหน้า +Z)
const DOOR_OPEN_S = 0.42;    // วินาทีที่ใช้เปิดจนสุด
const DOOR_SHUT_S = 0.62;    // ปิดช้ากว่าเปิด (บานหนัก ค่อย ๆ กลับเข้าวงกบ)
/* 🚪👥 รอบ 892: "ประตูแง้ม" = ท่าพักของบาน เมื่อมีเพื่อนออนไลน์ยืนอยู่หน้าตึกนั้น
   (ร้านเปิดอยู่ มีคนอยู่ข้างใน) · ปิดจากการเดินออกมาจึงกลับไปหยุดที่ท่าพัก ไม่ใช่ปิดสนิทเสมอ
   🌙 กลางคืน: ช่องประตูเรืองแสง + ลำแสงทาบพื้น (doorAt) → แง้มไว้ก็เห็นไฟลอดออกมาแต่ไกล */
const DOOR_AJAR = 0.13;      // ท่าพักตอนมีคนอยู่ — องศาจริงผ่าน ease แล้ว ≈ 25° (ไม่ใช่ 0.13×106° · แง้มพอเห็นแสงลอด ไม่ใช่เปิดอ้า)
const AJAR_QUIET_MS = 4000;  // เงียบช่วงบูตแรก — presence ก้อนแรกมาทีเดียวหลายตึก ไม่งั้นเอี๊ยดรัวทั้งเมือง
/* 🚪🌀 รอบ 897: ประตูชนิดที่ 2 = "ม้วนเลื่อนขึ้น" (โรงรถ/โรงเก็บยาน · ตัวบานสร้างที่ rollAt ในโซน 🏗️ BUILDERS)
   ทะเบียน/ตัวสั่ง/ตัวขับ/ท่าพัก ใช้ตัวเดียวกับบานหมุนทั้งหมด — ต่างกันแค่ 3 อย่าง:
   ① applyDoorPose ย่อ scale.y แทนหมุน rotation.y  ② เสียงเป็นครืดเหล็กยาว+กึกแทนเอี๊ยดไม้+กลอน
   ③ ช้ากว่า (บานหนัก) จึงเริ่มเปิดตาม "เวลาที่เหลือของการเดิน" ไม่ใช่ % คงที่แบบบานหมุน */
const ROLL_OPEN_S   = 0.85;  // ม้วนขึ้นจนสุด (ยาวกว่าบานหมุนเท่าตัว = เห็นเป็นประตูหนัก)
const ROLL_SHUT_S   = 1.15;  // ลงช้ากว่าขึ้นอีก แล้วกึกตอนแตะพื้น
const ROLL_LIFT     = 0.94;  // เปิดสุดเหลือบานโผล่ 6% = ขอบที่ม้วนอยู่ในคาน (0 = บานหายไปเฉย ๆ ดูปลอม)
const ROLL_AJAR     = 0.15;  // ท่าแง้มของประตูม้วน — ผ่าน ease แล้วยกขึ้น ≈ 25% ของช่อง (ตรงสเปกรอบนี้)
const CityDoors = {};        // key ตึก → {h:บานพับ/กลุ่มบานม้วน, kind:'swing'|'roll', sp:[ลำแสงพื้น], gl:[ดวงเรือง], k:0..1 (ตอนนี้), tgt:เป้า, rest:ท่าพัก, held:ถูกสั่งเปิดค้างอยู่}
let _lastDoor = null, _lastKind = 'swing', _lastSpill = [], _lastGlow = [];   // ของที่ doorAt/rollAt เพิ่งสร้าง — buildCity หยิบไปผูก key แล้วล้าง
function registerDoor(key){
  if(!_lastDoor){ _lastSpill = []; _lastGlow = []; return false; }   // ตึกแบบไม่มีประตู
  const roll = _lastKind === 'roll';
  CityDoors[key] = {h:_lastDoor, kind:_lastKind, sp:_lastSpill, gl:_lastGlow,
                    k:0, tgt:0, rest:0, held:false,
                    ajar: roll ? ROLL_AJAR   : DOOR_AJAR,
                    os:   roll ? ROLL_OPEN_S : DOOR_OPEN_S,
                    cs:   roll ? ROLL_SHUT_S : DOOR_SHUT_S};
  _lastDoor = null; _lastKind = 'swing'; _lastSpill = []; _lastGlow = [];
  return true;
}
/* เวลาที่ประตูใช้เปิดจนสุด (วินาที) — walkSelfTo เอาไปเผื่อระยะให้ประตูม้วนที่ช้ากว่าบานหมุน · 0 = ไม่มีบาน/บานหมุน (ใช้ % เดิมรอบ 890)
   🚗 รอบ 900: ตึกที่มียานแล่นออกมา ต้องเผื่อเวลาของยานด้วย (บานยกเร็วขึ้นเท่านั้น — เดินถึงพอดีตอนยานจอดนิ่ง) */
function doorLeadS(key){
  const d = CityDoors[key];
  return Math.max((d && d.kind==='roll') ? d.os : 0, rideLeadS(key));
}
/* 🔦 ลำแสงลอดประตู: เรเดียลจากกึ่งกลาง "ขอบบน" ของ canvas = ฐานแสงอยู่ที่ธรณีประตู แล้วบานออกไปข้างหน้า */
let _spillTex = null;
function doorSpillTexture(){
  if(_spillTex) return _spillTex;
  const c = cvs(128,128), x = c.getContext('2d');
  const gr = x.createRadialGradient(64,0,6, 64,0,124);
  gr.addColorStop(0,'rgba(255,214,150,.85)');
  gr.addColorStop(.45,'rgba(255,198,120,.34)');
  gr.addColorStop(1,'rgba(255,190,110,0)');
  x.fillStyle=gr; x.fillRect(0,0,128,128);
  return _spillTex = ctex(c);
}
/* 🔊 บานพับเอี๊ยด — เปิด = ไล่ความถี่ขึ้น · ปิด = ไล่ลง (เบา ๆ ไม่แย่งเพลงประกอบ) */
function doorCreakSfx(open, vol){
  const c = footCtx(); if(!c) return;
  try{
    if(c.state==='suspended') c.resume();
    const t = c.currentTime, dur = open ? .40 : .52, v = vol==null ? 1 : vol;
    const o = c.createOscillator(); o.type='sawtooth';
    o.frequency.setValueAtTime(open?150:246, t);
    o.frequency.linearRampToValueAtTime(open?246:142, t+dur);
    const bp = c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=820; bp.Q.value=7.5;
    const g = c.createGain();
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(.05*v,t+.09);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(bp); bp.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t+dur+.02);
  }catch(e){}
}
/* 🔊 บานกระทบวงกบ: ตึบ (sine ดิ่ง) + กลอนคลิก (noise สั้นผ่าน highpass) */
function doorLatchSfx(){
  const c = footCtx(); if(!c) return;
  try{
    if(c.state==='suspended') c.resume();
    const t = c.currentTime;
    const o = c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(176,t); o.frequency.exponentialRampToValueAtTime(56,t+.12);
    const g = c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.07,t+.01);
    g.gain.exponentialRampToValueAtTime(.0001,t+.18);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.2);
    const n = c.createBufferSource(), buf = c.createBuffer(1,1100,c.sampleRate), d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,6);
    n.buffer = buf;
    const hp = c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=2200;
    const ng = c.createGain(); ng.gain.value=.045;
    n.connect(hp); hp.connect(ng); ng.connect(c.destination); n.start(t);
  }catch(e){}
}
/* 🔊🌀 รอบ 897: ประตูม้วนเหล็ก = "ครืด…" ยาว ไม่ใช่ "เอี๊ยด" ของบานไม้
   noise ขาว × พัลส์ 26 ครั้ง/วินาที (ซี่สแลตวิ่งผ่านราง = เม็ดกึกกัก) แล้วส่งผ่าน bandpass ที่ "กวาดความถี่"
   ตามทิศทางที่บานวิ่ง (ขึ้น=ไล่สูง · ลง=ไล่ต่ำ) → หูได้ยินเป็นม้วนไหลไปทางเดียวจริง ๆ ไม่ใช่ซ่าอยู่กับที่
   dur ผูกกับ "ระยะที่บานจะวิ่งจริง" → แค่ขยับไปท่าแง้มก็ครืดสั้น ๆ ไม่ใช่ยาวเท่าเปิดสุด */
function shutterRollSfx(open, dur, vol){
  const c = footCtx(); if(!c) return;
  try{
    if(c.state==='suspended') c.resume();
    const t = c.currentTime, D = Math.max(0.18, dur||ROLL_OPEN_S), v = vol==null ? 1 : vol;
    const len = Math.max(64, Math.ceil(c.sampleRate*D));
    const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for(let i=0;i<len;i++){
      const s = i/c.sampleRate;
      const slat = 0.55 + 0.45*Math.pow(Math.abs(Math.sin(Math.PI*s*26)), 0.35);
      d[i] = (Math.random()*2-1)*slat;
    }
    const n = c.createBufferSource(); n.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.35;
    bp.frequency.setValueAtTime(open?520:1250, t);
    bp.frequency.exponentialRampToValueAtTime(open?1250:520, t+D);
    const hp = c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=240;   // ตัดตูมเบสออก เหลือเนื้อโลหะ
    const g = c.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(.055*v, t+.10);
    g.gain.setValueAtTime(.055*v, t+D*0.75);
    g.gain.exponentialRampToValueAtTime(.0001, t+D);
    n.connect(bp); bp.connect(hp); hp.connect(g); g.connect(c.destination);
    n.start(t); n.stop(t+D+.02);
  }catch(e){}
}
/* 🔊🌀 บานม้วนถึงสุดทาง: กึก (ตึบต่ำ) + แผ่นเหล็กสั่นค้าง 2 ระดับ — ยิงจากตัวขับตอนถึงจริง ไม่ใช่ตอนสั่ง */
function shutterClunkSfx(vol){
  const c = footCtx(); if(!c) return;
  try{
    if(c.state==='suspended') c.resume();
    const t = c.currentTime, v = vol==null ? 1 : vol;
    const o = c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(132,t); o.frequency.exponentialRampToValueAtTime(44,t+.13);
    const g = c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.08*v,t+.008);
    g.gain.exponentialRampToValueAtTime(.0001,t+.2);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.22);
    const rg = c.createGain();
    rg.gain.setValueAtTime(.0001,t); rg.gain.exponentialRampToValueAtTime(.03*v,t+.012);
    rg.gain.exponentialRampToValueAtTime(.0001,t+.3);
    const rb = c.createBiquadFilter(); rb.type='bandpass'; rb.frequency.value=900; rb.Q.value=4;
    rb.connect(rg); rg.connect(c.destination);
    [332, 487].forEach(f=>{
      const s = c.createOscillator(); s.type='triangle'; s.frequency.value=f;
      s.connect(rb); s.start(t); s.stop(t+.32);
    });
  }catch(e){}
}
/* เลือกเสียงตามชนิดประตู — บานไม้เอี๊ยด · บานเหล็กครืด */
function doorMoveSfx(d, open, span, vol){
  if(d.kind === 'roll') shutterRollSfx(open, (open?d.os:d.cs)*Math.max(0.12, span), vol);
  else doorCreakSfx(open, vol);
}
/* สั่งบาน: open=true เปิด/false "ปล่อยกลับท่าพัก" (rest — ปิดสนิท หรือแง้มถ้ามีคนอยู่)
   snap=true สแนปทันทีแบบเงียบ (ใช้ตอนตั้งฉากขากลับ)
   สั่งซ้ำเป้าเดิม = คืน false ไม่เล่นเสียงซ้ำ (walkSelfTo เรียกทุกเฟรมช่วงท้ายทาง) */
function setCityDoor(key, open, snap){
  const d = CityDoors[key]; if(!d) return false;
  const tgt = open ? 1 : d.rest;
  d.held = !!open;
  if(!open) releaseRide(key);          // 🚗 รอบ 900: บานกำลังกลับท่าพัก = ยานถอยกลับเข้าโรงก่อน ไม่ทิ้งค้างหน้าประตูปิด
  if(snap){ d.tgt = d.k = tgt; applyDoorPose(d); return true; }
  if(d.tgt === tgt) return false;
  d.tgt = tgt;
  doorMoveSfx(d, open, Math.abs(tgt-d.k));
  return true;
}
function openCityDoor(key){ return setCityDoor(key, true); }
function closeCityDoor(key){ return setCityDoor(key, false); }
/* 🚪👥 ตั้งท่าพักของบาน (0 = ปิดสนิท · DOOR_AJAR = แง้ม) — บานที่ถูกสั่งเปิดค้างอยู่ไม่โดนแย่ง */
function setDoorRest(key, ajar, quiet){
  const d = CityDoors[key]; if(!d) return false;
  const rest = ajar ? d.ajar : 0;               // 🌀 รอบ 897: ท่าแง้มของประตูม้วน = ยกขึ้น ~25% (คนละค่ากับบานหมุน)
  if(d.rest === rest) return false;
  d.rest = rest;
  if(d.held) return true;                       // กำลังเปิดรับเราเดินเข้าอยู่ — ค่อยไปใช้ตอนปล่อย
  const span = Math.abs(rest-d.tgt);
  d.tgt = rest;
  if(!quiet) doorMoveSfx(d, ajar, span, .45);   // เพื่อนเพิ่งเข้า/ออกตึกนั้น = เอี๊ยด/ครืดเบา ๆ พอรู้
  return true;
}
/* นับคนออนไลน์ที่ยืนอยู่หน้าตึกแต่ละหลัง → ตึกไหนมีคน บานแง้มไว้ */
function refreshDoorRest(){
  const cnt = {};
  for(const uid in Live.actors){
    const a = Live.actors[uid];
    if(a.kind==='stand' && a.bkey) cnt[a.bkey] = (cnt[a.bkey]||0)+1;
  }
  const quiet = performance.now() < AJAR_QUIET_MS;   // ก้อน presence แรกตอนบูต = เงียบ
  for(const key in CityDoors) setDoorRest(key, !!cnt[key], quiet);
  return cnt;
}
function applyDoorPose(d){
  const e = 1-(1-d.k)*(1-d.k);
  /* องศาจริง = ไถแบบ ease-out ทั้งสองทาง → เปิด: ผลักแรงแล้วผ่อนตอนบานกางสุด
     ปิด: ออกตัวช้า (บานหนัก) แล้วเร่งเข้าวงกบ = ตรงกับเสียงตึบตอนจบพอดี */
  if(d.kind === 'roll'){
    /* 🌀 รอบ 897: จุดยึดของทุกบานอยู่ "ขอบบน" → ย่อ scale.y = บานหดขึ้นไปม้วนเก็บในคาน
       (โรงรถมี 2 ช่อง จึงไถทุกบานในกลุ่มพร้อมกัน) */
    const s = 1 - e*ROLL_LIFT;
    for(let i=0;i<d.h.children.length;i++) d.h.children[i].scale.y = s;
  }else{
    d.h.rotation.y = e*DOOR_SWING;
  }
  /* 🔦 รอบ 892: แสงลอดออกมาตามช่องที่เปิด — แง้มนิดเดียวก็เห็นลำแสง แต่จาง (ปิดสนิท = ดับสนิท) */
  for(let i=0;i<d.sp.length;i++) d.sp[i].material.opacity = d.k<=0 ? 0 : (0.45+0.55*d.k)*0.9;
  for(let i=0;i<d.gl.length;i++){
    const gl = d.gl[i];
    gl.material.opacity = d.k<=0 ? 0 : (0.4+0.6*d.k)*0.8;
    const s = (2.4+2.6*d.k)*(gl.userData.gs||1); gl.scale.set(s, s, 1);   // เปิดกว้าง = ดวงไฟโตตาม
  }
}
tickers.push((dt)=>{
  for(const key in CityDoors){
    const d = CityDoors[key];
    if(d.k === d.tgt) continue;
    const up = d.tgt > d.k;
    const step = dt/(up ? d.os : d.cs);
    d.k = up ? Math.min(d.tgt, d.k+step) : Math.max(d.tgt, d.k-step);
    applyDoorPose(d);
    /* ยิงตอนบานถึงสุดทางจริง ไม่ใช่ตอนสั่งปิด (หยุดที่ท่าแง้ม = ไม่มีเสียงกลอน/กึก)
       🌀 ประตูม้วนกึกทั้งสองปลาย (ลงสุดกระแทกพื้น · ขึ้นสุดชนตัวหยุดในคาน — เบากว่า) */
    if(d.kind === 'roll'){
      if(!up && d.k === 0) shutterClunkSfx(1);
      else if(up && d.k === 1) shutterClunkSfx(.5);
    }else if(!up && d.k === 0) doorLatchSfx();
  }
});

/* ============================================================
   🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
   ------------------------------------------------------------
   ต่อยอดรอบ 897: เดินเข้าโลกขับรถ/โลกหุ่นรบ/โลกโดรน แล้วประตูม้วนยกขึ้นเฉย ๆ ยังไม่รู้ว่า
   ข้างในเก็บอะไร · ตอนนี้พอบานยกพ้นหัวยาน "ของข้างใน" แล่นออกมาจากช่องนั้นจริง ๆ
   (รถออกจากอู่ · หุ่นเดินออกจากโรงเก็บ · โดรนบินออกจากตู้ชาร์จ) แล้วเลี้ยวไปจอดรอข้างทาง
   ยืมของเดิมล้วน ไม่มีระบบใหม่:
     · ทะเบียน CityDoors (รอบ 890/897) = ตัวบอกว่าบานยกไปถึงไหน (d.k) + ตัวสั่งเปิด/ปล่อย
     · ตัวขับ = ticker ตัวเดียวของไฟล์ (เหมือนฝุ่นฝีเท้า/ประตู) · โมเดล miniCar/miniDrone/miniMecha (โซน 🚗🏍️🚁🛸)
     · เสียงย่ำของหุ่น = footStepSfx ของรอบ 871 ตัวเดิม
   🔑 พิกัดในตารางเป็น "ระบบพิกัดของตึกหลังนั้น" เพราะยานถูกใส่เป็นลูกของกลุ่มตึก (d.h.parent)
      → +z = หันออกหาลานกลางเสมอ ไม่ต้องแปลงมุมเมืองเอง และย้ายตึกเมื่อไหร่ยานตามไปเอง
   ⏱️ จังหวะ: doorLeadS() บวกเวลาที่ยานใช้เข้าไปด้วย (rideLeadS) → บานเริ่มยกเร็วขึ้นเท่านั้น
      เราเดินถึงหน้าประตูพอดีตอนยานจอดนิ่ง = ภาพจอเปิดขากลับ (รอบ 880 แคปตอนถึง) ติดยานจอดรอด้วย
   ============================================================ */
const RIDE_GATE   = 0.5;    // บานม้วนยกได้กี่ส่วนถึงเริ่มออกตัว (ครึ่งช่อง — ถึงปากประตูตอนบานยกสุดพอดี)
const RIDE_OUT_S  = 0.45;   // วินาที: ออกตัวตรง ๆ ลอดช่องประตูออกมา
const RIDE_PARK_S = 0.55;   // วินาที: เลี้ยวออกข้างทางแล้วผ่อนเข้าจอด
/* ยาน: x0,y0,z0 = จุดจอดในโรง (หลังบาน ผนังบังอยู่) · y1,z1 = พ้นปากประตู · px,py,pz = ที่จอดรอ
   turn = องศาที่เลี้ยวตอนเข้าจอด (ลบ = ปาดไปทางซ้ายของตึก) · yaw = แก้หน้าโมเดล (ทุกตัวในไฟล์นี้หันหน้า +X) */
const DOOR_RIDES = {
  w3d_drive:{ make:()=>miniCar(0xd32f2f), yaw:-Math.PI/2, sfx:'engine', wheel:9,     // อู่รถ: ช่องซ้าย (bays[-2.2]) · z=3.5 คือผิวหน้าตึก
              x0:-2.2, y0:0,    z0:1.4,  y1:0,    z1:5.2,  px:-3.7, py:0,   pz:6.5, turn:-0.55 },
  w3d_mecha:{ make:()=>miniMecha(0x5c6bc0), yaw:-Math.PI/2, sfx:'step', step:6.6,    // โรงเก็บหุ่น: ช่องเดียวกลางซุ้ม · ฝาหน้า z=4.0
              x0:0,    y0:0,    z0:2.0,  y1:0,    z1:5.9,  px:-2.8, py:0,   pz:6.6, turn:-0.5 },
  w3d_drone:{ make:()=>miniDrone(0x26c6da), yaw:-Math.PI/2, sfx:'rotor', prop:26, sc:1.2, bob:0.09,
              x0:-2.6, y0:0.74, z0:-2.5, y1:0.86, z1:0.4,  px:-1.9, py:1.9, pz:3.1, turn:-0.4 },
};
const Rides = {};           // key ตึก → {g, s:สเปก, u:0..2 (0-1 ออกจากประตู · 1-2 เข้าจอด), dir:1 ออก/-1 ถอยกลับ, ph:เฟสล้อ-ขา, go:ออกตัวแล้ว}
/* เวลาที่ยานใช้ตั้งแต่ "บานเริ่มยก" จนจอดนิ่ง — walkSelfTo เอาไปเผื่อระยะเดิน (0 = ตึกนี้ไม่มียาน) */
function rideLeadS(key){
  return DOOR_RIDES[key] ? ROLL_OPEN_S*RIDE_GATE + RIDE_OUT_S + RIDE_PARK_S : 0;
}
/* 🔊 เสียงยานออกจากโรง — สังเคราะห์เองด้วย AudioContext ตัวเดียวกับเสียงฝีเท้า/ประตู
   เครื่องยนต์ = ฟันเลื่อยเบส 2 ชั้นไล่รอบขึ้น (ติดเครื่อง→ออกตัว) · ใบพัด = คลื่นสามเหลี่ยมสูงหวีดขึ้นแล้วคงที่ */
function rideSfx(kind, dur){
  const c = footCtx(); if(!c || !kind || kind==='step') return;
  try{
    if(c.state==='suspended') c.resume();
    const t = c.currentTime, D = Math.max(0.3, dur||1);
    const g = c.createGain();
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(kind==='rotor'?.030:.042, t+.18);
    g.gain.setValueAtTime(kind==='rotor'?.030:.042, t+D*0.72);
    g.gain.exponentialRampToValueAtTime(.0001, t+D);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = kind==='rotor' ? 2600 : 340;
    lp.connect(g); g.connect(c.destination);
    const f0 = kind==='rotor' ? 190 : 58, f1 = kind==='rotor' ? 320 : 116;
    (kind==='rotor' ? [1, 2.02] : [1, 1.51]).forEach((m,i)=>{
      const o = c.createOscillator();
      o.type = kind==='rotor' ? 'triangle' : 'sawtooth';
      o.frequency.setValueAtTime(f0*m, t);
      o.frequency.exponentialRampToValueAtTime(f1*m, t+D*0.55);
      const og = c.createGain(); og.gain.value = i ? .45 : 1;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t+D+.05);
    });
  }catch(e){}
}
/* วางยานตามความคืบหน้า u (0 = ในโรง · 1 = พ้นปากประตู · 2 = จอดนิ่ง) */
function ridePose(r, u){
  const s = r.s;
  let x, y, z, hd;
  if(u <= 1){
    const e = u*u;                                  // ออกตัวจากหยุดนิ่ง (ค่อย ๆ เร่ง)
    x = s.x0; y = s.y0+(s.y1-s.y0)*e; z = s.z0+(s.z1-s.z0)*e; hd = 0;
  }else{
    const v = u-1, e = 1-(1-v)*(1-v);               // เข้าจอดแบบผ่อนความเร็ว
    x = s.x0+(s.px-s.x0)*e; y = s.y1+(s.py-s.y1)*e; z = s.z1+(s.pz-s.z1)*e;
    hd = s.turn*Math.sin(Math.PI*e);                // ปาดออกข้างแล้วคืนหน้าตรงตอนจอดนิ่ง
  }
  r.g.position.set(x, y, z);
  r.g.rotation.y = (s.yaw||0) + hd;
}
/* เรียกตอนสั่งเปิดประตูรับเรา (walkSelfTo) — ตึกไม่มียาน/มีคันแล่นอยู่แล้ว = คืน false เงียบ ๆ
   snap=true: โผล่มาจอดอยู่แล้วตั้งแต่เฟรมแรกแบบเงียบ (ขากลับ — ภาพจอเปิดรอบ 880 แคปตอนยานจอดรออยู่
   ถ้าไม่ตั้งให้ตรงกัน ภาพจางมาแล้วยานจะหายวับต่อหน้า) */
function launchRide(key, snap){
  const s = DOOR_RIDES[key], d = CityDoors[key];
  if(!s || !d || !d.h || !d.h.parent || Rides[key]) return false;
  const g = s.make();
  if(s.sc) g.scale.setScalar(s.sc);
  const r = {g, s, u:snap?2:0, dir:1, ph:0, go:!!snap, key};
  ridePose(r, r.u);
  d.h.parent.add(g);                                 // ลูกของกลุ่มตึก → พิกัดในตารางเป็นของตึกตรง ๆ
  Rides[key] = r;
  return true;
}
/* ประตูกลับท่าพัก = ยานถอยกลับเข้าโรง แล้วเก็บทิ้งตอนถึงที่เดิม (geometry/material เป็น cache รวม ห้าม dispose) */
function releaseRide(key){
  const r = Rides[key];
  if(!r || r.dir < 0) return false;
  r.dir = -1;
  if(r.go) rideSfx(r.s.sfx, (RIDE_OUT_S+RIDE_PARK_S)*Math.max(0.3, r.u/2));
  return true;
}
tickers.push((dt)=>{
  for(const key in Rides){
    const r = Rides[key], s = r.s, d = CityDoors[key];
    if(r.dir < 0 && r.u <= 0){                       // ถอยกลับถึงในโรงแล้ว (หรือถูกยกเลิกก่อนออกตัว) = เก็บทิ้ง
      if(r.g.parent) r.g.parent.remove(r.g);
      delete Rides[key];
      continue;
    }
    if(!r.go){                                       // รอบานม้วนยกพ้นหัวยานก่อนค่อยออกตัว
      if(r.dir > 0 && (!d || d.k < RIDE_GATE)) continue;
      r.go = true;
      if(r.dir > 0) rideSfx(s.sfx, RIDE_OUT_S+RIDE_PARK_S);
    }
    const moving = r.dir > 0 ? r.u < 2 : r.u > 0;
    if(moving){
      r.u = clamp(r.u + r.dir*dt/(r.u < 1 ? RIDE_OUT_S : RIDE_PARK_S), 0, 2);
      ridePose(r, r.u);
      r.ph += dt*(s.wheel || s.prop || s.step || 0);
      if(s.wheel) for(let i=0;i<r.g.userData.wheels.length;i++) r.g.userData.wheels[i].rotation.y = r.ph;
      if(s.prop)  r.g.userData.props.forEach(p=>p.rotation.y = r.ph);
      if(s.step){                                    // 🦿 ขาแกว่งจริง + ย่ำหนึ่งครั้งต่อครึ่งรอบ (ใช้เสียงฝีเท้ารอบ 871)
        const sw = (r.u>=2 || r.u<=0) ? 0 : Math.sin(r.ph)*0.55;   // ถึงที่จอด = ยืนตรงเท้าชิดพื้น ไม่ค้างท่าก้าว
        r.g.userData.legs[0].rotation.x =  sw;
        r.g.userData.legs[1].rotation.x = -sw;
        r.g.position.y += Math.abs(sw)*0.09;         // ตัวเด้งตามจังหวะขา (ก้าวสุด = ตัวยกสุด)
        const n = Math.floor(r.ph/Math.PI);
        if(n !== r.stepN){ if(r.stepN != null) footStepSfx(1); r.stepN = n; }
      }
    }else if(s.bob){                                 // จอดนิ่งแล้ว: โดรนลอยตัวเบา ๆ + ใบพัดหมุนต่อ
      r.ph += dt*(s.prop||0)*0.55;
      r.g.userData.props.forEach(p=>p.rotation.y = r.ph);
      r.g.position.y = s.py + Math.sin(r.ph*0.11)*s.bob;
    }
  }
});

/* ============================================================
   🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
   เส้นทาง = พิกัดเชิงขั้ว (มุมก่อน-รัศมีทีหลัง) → ออกจากลานน้ำพุ เลี้ยวรอบวง แล้ววิ่งตรงเข้าประตู
   (ไม่ตัดผ่านกลางลาน/น้ำพุ เพราะรัศมีโตทีหลัง) · แตะซ้ำระหว่างเดิน = ข้ามไปเลย
   ไม่มีตัวละคร (ยังไม่เคยเซฟในเครื่องนี้) → ใช้ท่าเดิม: กล้องซูมลงตึกแล้วไป
   ============================================================ */
const WALK_SPD  = 22;      // หน่วย/วินาที (วิ่งเหยาะ ๆ — เด็กกดแล้วต้องได้เข้าหน้านั้นไว)
const WALK_MIN  = 0.9;     // เวลาเดินอย่างน้อย (วินาที) — ตึกใกล้ก็ยังเห็นว่าเดิน
const WALK_MAX  = 2.4;     // เพดานเวลาเดิน (ตึกไกลสุดถึงหน้าประตูภายในเวลานี้)
const DOOR_GAP  = 7.0;     // ยืนห่างจากใจกลางตึกเท่าไหร่ถึงเรียกว่า "หน้าประตู"

/* 🔑 รอบ 869: ตัวแทน (ยังไม่ล็อกอิน/ไม่มีเซฟ) แตะตึกไหนก็เดินมาจุดนี้แทนเสมอ — จุดเดียวกันทุกครั้ง
   กันสับสน "เดินไปตึกฟุตบอลแต่จอดันโผล่ล็อกอิน" ไม่เกี่ยวกับตึกที่แตะเลย */
const RECEPTION_SPOT = {x:3.2, z:22};
function doorSpotOf(key){
  if(key==='__reception'){
    const s = RECEPTION_SPOT;
    return {x:s.x, z:s.z, bx:s.x, bz:s.z+5};
  }
  const s = BLD_AT[key] || {x:0, z:0};
  const r = Math.hypot(s.x, s.z) || 1;
  const k = Math.max(0, (r-DOOR_GAP)/r);
  return {x:s.x*k, z:s.z*k, bx:s.x, bz:s.z};
}
/* ท่าเดิน: หุ่นบล็อก (blk1-8) แกว่งแขนขาจริง · ตัวป้ายภาพ (blk9-88) เด้ง+เอียงตัวแทน */
function walkPose(g, ph, amp){
  const limbs = g.userData.limbs;
  if(limbs && limbs.length>=4){
    const sw = Math.sin(ph)*0.78*amp;
    limbs[0].rotation.x =  sw;  limbs[1].rotation.x = -sw;
    limbs[2].rotation.x = -sw*0.85; limbs[3].rotation.x = sw*0.85;
  }else{
    g.rotation.z = Math.sin(ph)*0.07*amp;
  }
  g.position.y = Math.abs(Math.sin(ph))*0.11*amp;
}
/* 👟🌫️ รอบ 870: เสียงฝีเท้า + ฝุ่นฟุ้งใต้เท้าตอน walkSelfTo() — ให้ตัวละครรู้สึกมีน้ำหนักเวลาเดิน
   เสียง = สังเคราะห์เอง (city3d.js เป็นไฟล์ standalone ไม่มี state.sound/HeliSound ให้พึ่ง)
   จังหวะเร่ง-ช้า = ยิงตามระยะทางที่เดินจริงต่อเฟรม (ไม่ใช่ตามเวลา) → ช่วงกลางเดินเร็ว(easing)ก้าวถี่ ต้น-ท้ายเดินช้าก้าวห่าง ตรงจังหวะเดินจริง */
let _footCtx = null;
function footCtx(){
  if(_footCtx) return _footCtx;
  try{ _footCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ _footCtx=null; }
  return _footCtx;
}
function footStepSfx(vol){
  const c = footCtx(); if(!c) return;
  try{
    if(c.state==='suspended') c.resume();
    const t=c.currentTime, v=Math.max(.25, Math.min(1, vol==null?1:vol));
    const o=c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(105,t);
    o.frequency.exponentialRampToValueAtTime(42,t+.09);
    const g=c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.065*v,t+.008);
    g.gain.exponentialRampToValueAtTime(.0001,t+.13);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.15);
    const n=c.createBufferSource(), buf=c.createBuffer(1,800,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.5);
    n.buffer=buf;
    const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=850;
    const ng=c.createGain(); ng.gain.value=.028*v;
    n.connect(lp); lp.connect(ng); ng.connect(c.destination); n.start(t);
  }catch(e){}
}
let footDusts=[], _footDustTex=null;
function footDustTexture(){
  if(_footDustTex) return _footDustTex;
  const cv=document.createElement('canvas'); cv.width=cv.height=32;
  const c=cv.getContext('2d');
  const gr=c.createRadialGradient(16,16,2,16,16,15);
  gr.addColorStop(0,'rgba(214,204,186,.7)'); gr.addColorStop(.6,'rgba(196,186,168,.32)'); gr.addColorStop(1,'rgba(180,172,156,0)');
  c.fillStyle=gr; c.fillRect(0,0,32,32);
  return _footDustTex=new THREE.CanvasTexture(cv);
}
function footDustPuff(x,z){
  if(!scene) return;
  for(let i=0;i<4;i++){
    const a=Math.random()*Math.PI*2, r=.14+Math.random()*.34;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:footDustTexture(),transparent:true,
      opacity:.4+Math.random()*.2,depthWrite:false}));
    const sc0=.35+Math.random()*.28;
    s.scale.set(sc0,sc0,1);
    s.position.set(x+Math.cos(a)*r, .06+Math.random()*.08, z+Math.sin(a)*r);
    scene.add(s);
    footDusts.push({s, vx:Math.cos(a)*(.5+Math.random()*.55), vz:Math.sin(a)*(.5+Math.random()*.55),
                vy:.32+Math.random()*.28, life:.45+Math.random()*.22, t:0});
  }
}
function footDustTick(dt){
  for(let i=footDusts.length-1;i>=0;i--){
    const d=footDusts[i];
    d.t+=dt;
    d.s.position.x+=d.vx*dt; d.s.position.z+=d.vz*dt; d.s.position.y+=d.vy*dt;
    d.vx*=1-2*dt; d.vz*=1-2*dt;
    d.s.scale.multiplyScalar(1+0.8*dt);
    d.s.material.opacity*=1-(d.t/d.life)*dt*3.6;
    if(d.t>=d.life||d.s.material.opacity<.03){
      scene.remove(d.s); d.s.material.dispose();     // texture แชร์ cache ห้าม dispose map
      footDusts.splice(i,1);
    }
  }
}
tickers.push((dt)=>footDustTick(dt));                // ระบบฝุ่นฝีเท้า ทำงานทุกเฟรมตลอด (ว่างเปล่า = ไม่มีอะไรให้ทำ)
const FOOT_STEP_DIST = 3.3;    // ระยะเดินต่อก้าว (หน่วยโลก) — ยิงเสียง+ฝุ่นทุก ๆ ระยะนี้ ไม่ใช่ทุก ๆ เวลา
const DOOR_OPEN_AT   = 0.62;   // 🚪 รอบ 890: เดินได้กี่ส่วนของทางถึงเริ่มผลักประตู (0.62 + เปิด .42 วิ ≈ บานกางสุดพอดีตอนถึงหน้าประตู)
/* เดินไปหน้าตึก b แล้วเรียก done() — คืน false ถ้าเดินไม่ได้ (ไม่มีตัวละคร) */
function walkSelfTo(b, done){
  const S = Live.self;
  if(!S || !S.g || S.walk) return false;
  const g = S.g, d = doorSpotOf(b.key);
  const x0 = g.position.x, z0 = g.position.z;
  const r0 = Math.max(2, Math.hypot(x0, z0)), r1 = Math.hypot(d.x, d.z) || 1;
  let a0 = Math.atan2(z0, x0), a1 = Math.atan2(d.z, d.x);
  while(a1-a0 >  Math.PI) a1 -= TAU;                 // เลี้ยวทางที่ใกล้กว่าเสมอ
  while(a0-a1 >  Math.PI) a1 += TAU;
  const path = Math.abs(a1-a0)*r0 + Math.abs(r1-r0);
  const dur  = clamp(path/WALK_SPD, WALK_MIN, WALK_MAX);
  S.walk = true;
  footCtx();                                          // สร้าง/ปลุก AudioContext ตอนนี้เลย (ยังอยู่ใน call stack ของการแตะจริง)
  setChip('🚶 กำลังเดินไป '+b.label+' …');
  const d0cam = rig.dist, p0cam = rig.pitch;
  const lead = doorLeadS(b.key);                      // 🚪🌀 รอบ 897: ประตูม้วนช้ากว่าบานหมุน → เริ่มยกตาม "เวลาที่เหลือของทาง" (0 = บานหมุน ใช้ % เดิม)
  const t0 = performance.now();
  let ph = 0, fired = false, footDist = 0;
  const finish = ()=>{
    if(fired) return; fired = true;
    const i = tickers.indexOf(tick); if(i>=0) tickers.splice(i,1);
    walkPose(g, 0, 0);
    g.position.set(d.x, 0, d.z);
    g.rotation.y = Math.atan2(d.bx-d.x, d.bz-d.z);   // หันหน้าเข้าตึก (โมเดลหันหน้า +Z)
    S.walk = false;
    if(openCityDoor(b.key)) launchRide(b.key);       // 🚪 รอบ 890: มาทางตาข่าย setTimeout (rAF สะดุด) ก็ต้องเจอประตูเปิดรับ (🚗 รอบ 900: ยานตามออกมาด้วย)
    done();
  };
  const tick = (dt)=>{
    const k = clamp((performance.now()-t0)/(dur*1000), 0, 1);
    const ea = 1-Math.pow(1-k, 2);                   // มุม: เลี้ยวเร็วตอนต้น
    const er = k*k;                                  // รัศมี: ยืดออกทีหลัง (พ้นลานก่อนค่อยพุ่งเข้าตึก)
    const a = a0 + (a1-a0)*ea, r = r0 + (r1-r0)*er;
    const nx = Math.cos(a)*r, nz = Math.sin(a)*r;
    const dx = nx-g.position.x, dz = nz-g.position.z;
    if(dx*dx+dz*dz > 1e-6) g.rotation.y = Math.atan2(dx, dz);
    const moved = Math.hypot(dx, dz);
    g.position.x = nx; g.position.z = nz;
    /* 👟🌫️ ยิงตามระยะทางที่เดินจริง ไม่ใช่ตามเวลา → ช่วงกลาง(เดินไวตาม easing)ก้าวถี่ ต้น-ท้าย(เดินช้า)ก้าวห่าง = จังหวะเร่ง-ช้าตามการเดินจริง */
    footDist += moved;
    if(footDist >= FOOT_STEP_DIST){
      footDist -= FOOT_STEP_DIST;
      footStepSfx(clamp(moved/dt/WALK_SPD, .3, 1));
      footDustPuff(nx, nz);
    }
    /* 🚪 รอบ 890/897: ใกล้ถึงแล้ว ประตูเปิดรับ (สั่งซ้ำทุกเฟรมได้ ตัวสั่งกันเสียงซ้ำเอง)
       🚗 รอบ 900: เฟรมที่บานเริ่มยกจริง ๆ = ปล่อยยานในโรงด้วย (ตัวมันรอบานยกครึ่งช่องก่อนค่อยออกตัวเอง) */
    if(lead ? (1-k)*dur <= lead : k >= DOOR_OPEN_AT){ if(openCityDoor(b.key)) launchRide(b.key); }
    ph += dt*11;
    walkPose(g, ph, k>0.94 ? (1-k)/0.06 : 1);        // ใกล้ถึงค่อย ๆ หยุดขา
    rig.tx += (nx-rig.tx)*0.12; rig.tz += (nz-rig.tz)*0.12;   // กล้องตามหลังแบบนุ่ม
    rig.dist  = d0cam + (40-d0cam)*ea;
    rig.pitch = p0cam + (0.80-p0cam)*ea;
    rig.apply();
    if(k>=1) finish();
  };
  tickers.push(tick);
  setTimeout(finish, dur*1000+900);                  // กันเหนียว: rAF สะดุด (แท็บพื้นหลัง) ก็ยังไปต่อ
  return true;
}

/* ============================================================
   🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
   ------------------------------------------------------------
   เดิม (รอบ 870/880): ขาไปเห็นตัวเราเดินเข้าประตูสวยงาม แต่ขากลับ "โผล่" ยืนนิ่งหน้าประตูทันที
        เหมือนวาร์ปออกมา ไม่ต่อเนื่องกับภาพจอเปิด (รอบ 880) ที่เพิ่งจางไป
   ทำ: spawnSelf() ตั้งต้นตัวเราไว้ในประตู (ถอยเข้าหาใจกลางตึก = ถูกผนังบัง) → พอจอเปิดจาง
        ค่อยเดินออกมาหยุดที่จุดเดิม หันหน้าออกจากตึก ด้วยท่าเดิน+เสียงฝีเท้า+ฝุ่นชุดเดียวกับรอบ 871
        (ก้าวถี่/เบา/ช้ากว่าขาไป — ระยะสั้นและเป็นการ "ก้าวออกมา" ไม่ใช่วิ่งข้ามเมือง)
   ไม่แตะกล้องเลย: ปลายทางคือจุดที่ intro รอบ 880 เล็งไว้อยู่แล้ว (ไม่แย่งคุมกล้องกัน)
   ตาข่าย: ทุกทางที่เดินไม่ได้ (ไม่มีตัวละคร/rAF ไม่วิ่ง/เด็กแตะตึกก่อน) = จบที่หน้าประตูเหมือนรอบ 870
   ============================================================ */
const EXIT_BACK  = 4.0;    // ตั้งต้นถอยเข้าไปในตึกกี่หน่วย (อยู่หลังผนัง แล้วก้าวออกมาทางประตู)
const EXIT_DUR   = 1.35;   // วินาที — ออกมาช้า ๆ ให้เด็กเห็นชัดว่าเดินออกมาเอง
const EXIT_STEP  = 1.3;    // ระยะต่อก้าว (สั้นกว่า FOOT_STEP_DIST = ก้าวเนิบ ๆ ตอนออกจากประตู · วัดแล้วได้ 3 ก้าวพอดีกับจังหวะขาแกว่ง)
const EXIT_CLEAR = 4.3;    // ห่างใจกลางตึกเกินนี้ถึงเริ่มมีเสียง/ฝุ่น (ก่อนหน้านี้ยังอยู่หลังผนัง)
const EXIT_SHUT  = 5.6;    // 🚪 รอบ 890: ก้าวพ้นบานไปเท่านี้ ประตูค่อยปิดตามหลัง (ไม่ปิดหนีบตัวเราตอนยังอยู่ในกรอบประตู)
const ExitWalk = {key:'', bld:null, spot:null, u:null, done:false};
/* ตั้งต้น (เรียกจาก spawnSelf): วางตัวเราไว้ในประตู หันหน้าออก */
function stageExitWalk(g, key, bld, spot){
  const ux = spot.x-spot.bx, uz = spot.z-spot.bz, m = Math.hypot(ux,uz)||1;
  ExitWalk.key = key; ExitWalk.bld = bld; ExitWalk.spot = spot;
  ExitWalk.u = {x:ux/m, z:uz/m};
  g.position.set(spot.x-ExitWalk.u.x*EXIT_BACK, 0, spot.z-ExitWalk.u.z*EXIT_BACK);
  g.rotation.y = Math.atan2(ExitWalk.u.x, ExitWalk.u.z);
  /* 🚪 รอบ 890: ตั้งบานให้ "เปิดค้าง" ตั้งแต่เฟรมแรกแบบสแนป-เงียบ — ภาพจอเปิด (รอบ 880) แคปตอนบานเปิดอยู่
     ถ้าปล่อยบานปิด ภาพจางมาแล้วประตูจะกระตุกปิดทันตา · ตัวเราก็จะเดินทะลุบานออกมา */
  setCityDoor(key, true, true);
  launchRide(key, true);   // 🚗 รอบ 900: ยานที่ขาไปแล่นออกมาจอดรอ ยังจอดอยู่ที่เดิมตอนเรากลับออกมา (ตรงกับภาพจอเปิด) — ปิดประตูตอนเดินพ้นแล้วมันค่อยถอยกลับเข้าโรงเอง
}
/* เดินออกมา — ทำงานครั้งเดียวเสมอ (ตัวเรียก: จอเปิดเริ่มจาง + ตาข่ายเวลาใน BOOT) */
function walkSelfOut(){
  if(ExitWalk.done) return false;
  ExitWalk.done = true;                              // กันเรียกซ้ำจากทั้ง 2 ทาง
  const S = Live.self, spot = ExitWalk.spot, u = ExitWalk.u;
  if(!S || !S.g || !spot) return false;              // ไม่ได้กลับมาจากตึก (เกิดกลางลาน) = ไม่มีอะไรต้องทำ
  const g = S.g, face = Math.atan2(u.x, u.z);
  const arrive = ()=>{
    walkPose(g, 0, 0);
    g.position.set(spot.x, 0, spot.z);
    g.rotation.y = face;
    S.walk = false;
    closeCityDoor(ExitWalk.key);                     // 🚪 รอบ 890: ยืนพ้นบานแล้วแน่นอน — ปิดตามหลัง (มาทางตาข่ายเวลาก็ไม่ทิ้งประตูเปิดค้าง)
    if(ExitWalk.bld){
      setChip('🚪 กลับมาจาก '+ExitWalk.bld.ico+' '+ExitWalk.bld.label+' แล้ว — ยืนอยู่หน้าประตู');
      showBubble('__self', '🚪 กลับมาจาก'+ExitWalk.bld.label+'แล้ว '+ExitWalk.bld.ico, Date.now());
    }
  };
  if(S.walk){ closeCityDoor(ExitWalk.key); return false; }   // เด็กแตะตึกอื่นไปก่อนแล้ว = ปล่อยให้ walkSelfTo คุมต่อ ไม่กระตุก (แต่ต้องปิดประตูที่ตั้งเปิดค้างไว้ ไม่ทิ้งอ้าทั้งเมือง)
  const x0 = g.position.x, z0 = g.position.z;
  S.walk = true;
  footCtx();                                          // เตรียม AudioContext ไว้ล่วงหน้า (ยังไม่มี gesture ก็ไม่พัง แค่เงียบ)
  const t0 = performance.now();
  let ph = 0, footDist = 0, fired = false;
  const finish = ()=>{
    if(fired) return; fired = true;
    const i = tickers.indexOf(tick); if(i>=0) tickers.splice(i,1);
    arrive();
  };
  const tick = (dt)=>{
    const k = clamp((performance.now()-t0)/(EXIT_DUR*1000), 0, 1);
    const e = k*k*(3-2*k);                            // ออกตัวช้า (ดันประตู) → เร่ง → ผ่อนลงตอนถึงที่
    const nx = x0+(spot.x-x0)*e, nz = z0+(spot.z-z0)*e;
    const moved = Math.hypot(nx-g.position.x, nz-g.position.z);
    g.position.x = nx; g.position.z = nz;
    g.rotation.y = face;                              // เดินตรงออกจากประตู ไม่ต้องเลี้ยว
    /* 👟🌫️ รอบ 871: ยิงตามระยะทางที่เดินจริง — แต่รอให้พ้นผนังก่อน ไม่งั้นเสียง/ฝุ่นดังอยู่ในตึก */
    footDist += moved;
    if(footDist >= EXIT_STEP){
      footDist -= EXIT_STEP;
      if(Math.hypot(nx-spot.bx, nz-spot.bz) > EXIT_CLEAR){
        footStepSfx(clamp(moved/dt/WALK_SPD*2.2, .3, .8));   // เบากว่าขาไป (เดินออกมาเฉย ๆ ไม่ได้วิ่ง)
        footDustPuff(nx, nz);
      }
    }
    /* 🚪 รอบ 890: ก้าวพ้นบานแล้วค่อยปิดตามหลัง (เสียงตึบ+กลอนดังตอนบานถึงวงกบ = ตอนเรายืนหน้าประตูพอดี) */
    if(Math.hypot(nx-spot.bx, nz-spot.bz) > EXIT_SHUT) closeCityDoor(ExitWalk.key);
    ph += dt*7.5;                                     // ขาแกว่งช้ากว่าเดินไกล
    walkPose(g, ph, k>0.86 ? (1-k)/0.14 : 1);         // ใกล้ถึงค่อย ๆ หยุดขา
    if(k>=1) finish();
  };
  tickers.push(tick);
  setTimeout(finish, EXIT_DUR*1000+900);              // กันเหนียว: rAF สะดุด (แท็บพื้นหลัง) ก็ต้องมายืนหน้าประตู
  return true;
}

/* ============================================================
   👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
   ============================================================ */
function onTap(cx, cy){
  const nx=(cx/renderer.domElement.clientWidth)*2-1, ny=-(cy/renderer.domElement.clientHeight)*2+1;
  rayc.setFromCamera({x:nx,y:ny}, camera);
  /* 💬🔴 รอบ 873: ข้ามชิ้นที่ซ่อนอยู่ (ป้ายค้างอ่านตอนมีบับเบิลทับ) — three raycast ไม่เช็ก visible ให้ */
  const hitA = rayc.intersectObjects(actorPick, false).find(h=>h.object.visible !== false);
  if(hitA){
    const inf = hitA.object.userData.actor;
    /* 🖊️ รอบ 868: แตะ "บับเบิล" = พิมพ์ตอบคนนั้นเลย · แตะ "ตัวละคร" = การ์ดโปรไฟล์ (มีปุ่มคุยด้วย) */
    if(inf && (inf.bubble || inf.badge)) openChatBox(inf.uid);
    else openProfile(inf);
    return;
  }
  const hitB = rayc.intersectObjects(clickables, false)[0];
  if(hitB){ travelTo(hitB.object.userData.bld); return; }
  const g = groundAt(cx, cy);
  if(g && Math.hypot(g.x,g.z)<ISLAND_R) sparkleAt(g.x, g.z);
}
/* 🖼️ รอบ 877: เก็บภาพตึกที่กำลังจะเข้า ฝากไว้ให้ล็อบบี้เดิมใช้เป็นฉากหลังตอนเปิดหัวข้อ (ตัวใช้ = ?go= handler ท้าย js/main.js)
   วาดสด 1 เฟรมก่อนอ่าน (renderer ไม่ได้เปิด preserveDrawingBuffer — อ่านข้ามเฟรมได้บัฟเฟอร์เปล่า) */
function captureCityShot(goKey, bldKey){
  if(captureCityShot.done) return;
  captureCityShot.done = true;
  try{
    /* 🎥 รอบ 877: ดันกล้องชิดตึกหันเข้าประตูแค่เฟรมที่แคป (กันภาพไกล/มุมเพี้ยนตอนเครื่องช้าหรือกำลังเดินอยู่) แล้วคืนค่าเดิมทันที */
    const save = {tx:rig.tx, tz:rig.tz, yaw:rig.yaw, dist:rig.dist};
    const d = doorSpotOf(goKey);
    if(d){
      const dx = d.x-d.bx, dz = d.z-d.bz, m = Math.hypot(dx,dz)||1;
      rig.tx = d.bx; rig.tz = d.bz;
      rig.yaw = Math.atan2(dx/m, dz/m);
      rig.dist = 30;
      rig.apply();
    }
    renderer.render(scene, camera);
    const src = renderer.domElement;
    const w = 960, h = Math.max(1, Math.round(w*src.height/src.width));
    const c = document.createElement('canvas'); c.width=w; c.height=h;
    c.getContext('2d').drawImage(src, 0, 0, w, h);
    const img = c.toDataURL('image/jpeg',0.62);
    sessionStorage.setItem('vwCityShot', JSON.stringify({k:goKey, ts:Date.now(), img}));
    /* 🎬 รอบ 880: ฝากภาพใบเดียวกันไว้อีกใบ ให้ "ขากลับ" ใช้เป็นจอเปิดของเมือง
       (ใบบนถูกล็อบบี้เดิมลบทิ้งทันทีหลังใช้ — ดู ?go= handler ท้าย js/main.js จึงต้องแยกใบ)
       เก็บมุมกล้อง "ของเฟรมที่แคปจริง" ไปด้วย (ตอนนี้ rig ยังเป็นมุมที่ดันชิดประตูอยู่)
       → ขากลับตั้งกล้องตามค่านี้ ภาพกับฉาก 3D จะซ้อนกันพอดี จางแล้วไม่กระตุก */
    sessionStorage.setItem('vwCityBack', JSON.stringify({
      k:goKey, bk:bldKey||goKey, ts:Date.now(), img,
      cam:{tx:rig.tx, tz:rig.tz, yaw:rig.yaw, pitch:rig.pitch, dist:rig.dist}
    }));
    Object.assign(rig, save); rig.apply();
    renderer.render(scene, camera);
  }catch(e){}
}
function travelTo(b){
  const dest = 'index_classic.html?go='+encodeURIComponent(b.go);   // รอบ 863: ล็อบบี้เดิมย้ายชื่อไฟล์ (หน้านี้กลายเป็น index.html)
  if(travelTo.busy){ captureCityShot(b.go, b.key); location.href=dest; return; }   // แตะซ้ำระหว่างเดิน = ขอข้ามไปเลย
  travelTo.busy = true;
  /* 🔑 รอบ 869: ยังไม่ล็อกอิน (ไม่มีเซฟ) → แตะตึกไหนก็เดินไปจุดลงทะเบียนจุดเดียวกันเสมอ + ขึ้นป้ายบอกเหตุผล
     แทนที่จะเดินไปตึกที่แตะจริง ๆ แล้วโผล่หน้าล็อกอินเงียบ ๆ (งง — ทำไมแตะฟุตบอลแล้วไม่ได้เข้า) */
  if(Live.self && Live.self.g && !Live.self.named){
    walkSelfTo({key:'__reception', label:'จุดลงทะเบียน'}, ()=>{
      setChip('🔑 เข้าสู่ระบบก่อนเล่นนะ');
      showBubble('__self', '🔑 เข้าสู่ระบบก่อนนะ', Date.now());
      setTimeout(()=>{ location.href='index_classic.html'; }, 1600);   // ให้เวลาเด็กอ่านป้ายก่อนเปลี่ยนหน้า
    });
    return;
  }
  rememberDoor(b.key);   // 🚪 รอบ 870: กลับมาจากล็อบบี้เดิมเมื่อไหร่ ให้โผล่หน้าประตูตึกนี้
  /* 🚶 มีตัวละครของเรา (ล็อกอินแล้ว) → เดินไปหน้าประตูตึกที่แตะก่อน แล้วค่อยเข้า (รอบ 866) */
  if(walkSelfTo(b, ()=>{
        captureCityShot(b.go, b.key);   // 🖼️ รอบ 877: ยืนหน้าประตูพอดี = มุมภาพตึกสวยสุด เก็บก่อนบับเบิลขึ้น
        setChip('🚪 เข้า '+b.label+' …');
        if(Live.self && Live.self.g) showBubble('__self', 'เข้า '+b.label+' '+b.ico, Date.now());
        setTimeout(()=>{ location.href=dest; }, 520);   // ให้เห็นตัวยืนหน้าประตูแป๊บนึงก่อนเปลี่ยนหน้า
     })) return;
  /* ไม่มีตัวละคร (ยังไม่เคยเซฟในเครื่องนี้) → ท่าเดิม: กล้องซูมลงตึกแล้วไป */
  openCityDoor(b.key);        // 🚪 รอบ 890: ไม่มีตัวเดินก็ยังเห็นประตูตึกเปิดรับตอนกล้องซูมลง
  const spot = BLD_AT[b.key];
  const t0=performance.now(), d0=rig.dist, x0=rig.tx, z0=rig.tz;
  const anim=()=>{
    const k=Math.min(1,(performance.now()-t0)/520), e=1-Math.pow(1-k,3);
    rig.tx=x0+(spot.x-x0)*e; rig.tz=z0+(spot.z-z0)*e; rig.dist=d0+(34-d0)*e;
    rig.apply();
    if(k<1) requestAnimationFrame(anim);
    else { captureCityShot(b.go, b.key); location.href=dest; }
  };
  anim();
  setTimeout(()=>{ captureCityShot(b.go, b.key); location.href=dest; }, 950);   // ตาข่ายกันเหนียว: rAF สะดุด (แท็บพื้นหลัง/จอค้าง) ก็ยังเดินทางแน่นอน
}
function sparkleAt(x,z){
  const g=new THREE.Group();
  for(let i=0;i<8;i++){
    const s=M(new THREE.SphereGeometry(0.12,5,4), mat(0xfff176,{transparent:true,opacity:1}), 0,0.2,0);
    s.userData={a:i/8*TAU, v:rnd(2,4.5)};
    g.add(s);
  }
  g.position.set(x,0,z); scene.add(g);
  const t0=performance.now();
  const tick=()=>{
    const k=(performance.now()-t0)/700;
    if(k>=1){ scene.remove(g); return; }
    g.children.forEach(s=>{
      s.position.x=Math.cos(s.userData.a)*s.userData.v*k;
      s.position.z=Math.sin(s.userData.a)*s.userData.v*k;
      s.position.y=0.2+3.2*k-4.4*k*k;
      s.material.opacity=1-k;
    });
    requestAnimationFrame(tick);
  };
  tick();
}

/* 🪪 การ์ดโปรไฟล์ผู้เล่น (DOM) — ชื่อ+ชั้น+ตัวละคร+เหรียญ/ทรัพย์สินจาก leaderboard */
function openProfile(info){
  if(!info) return;
  const el = document.getElementById('profile-card');
  if(!el) return;
  const gs = gradeStars(info.grade);
  const fill = (lb)=>{
    const rows=[];
    if(info.self && info.coins!=null) rows.push(['🪙 เหรียญ', info.coins.toLocaleString()]);
    if(lb){
      if(lb.coins!=null) rows.push(['🪙 เหรียญ', Math.round(lb.coins).toLocaleString()]);
      if(lb.av!=null)    rows.push(['💼 ทรัพย์สินรวม', Math.round(lb.av).toLocaleString()]);
      if(lb.ni!=null)    rows.push(['📦 ของสะสม', lb.ni+' ชิ้น']);
      if(lb.hs)          rows.push(['👻 หนีผีนานสุด', lb.hs+' วิ']);
      if(lb.ws)          rows.push(['🔎 แต้มค้นหาคำ', Math.round(lb.ws).toLocaleString()]);
      if(lb.tw)          rows.push(['⌨️ พิมพ์สำเร็จ', Math.round(lb.tw).toLocaleString()+' คำ']);
    }
    el.innerHTML =
      '<div class="pc-box">'
      +'<button class="pc-x" onclick="document.getElementById(\'profile-card\').style.display=\'none\'">✕</button>'
      +'<img class="pc-img" src="img/blocks/'+esc(info.blk||'blk1')+'.png" alt="" onerror="this.style.display=\'none\'">'
      +'<div class="pc-name">'+esc(info.name||'ผู้เล่น')+'</div>'
      +(gs?'<div class="pc-grade" style="color:'+gs.col+';text-shadow:0 0 8px '+gs.glow+'">'+gs.sym+'</div>':'')
      +'<div class="pc-act">'+esc(info.act||'กำลังเล่นอยู่ 🎮')+'</div>'
      +(rows.length? '<div class="pc-rows">'+rows.map(r=>'<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join('')+'</div>' : '')
      +(info.self?'<div class="pc-me">⭐ นี่คือตัวหนูเอง</div>':'')
      /* 🖊️ รอบ 868: คุยกับเพื่อนได้จากในเมืองเลย (ปุ่มขึ้นทุกคนที่ไม่ใช่ตัวเรา — ถ้ายังไม่ใช่เพื่อน/ยังไม่ล็อกอิน
         กล่องจะขึ้นป้ายบอกเหตุผล + ทางไปเพิ่มเพื่อน แทนที่จะเงียบหาย) */
      +((!info.self && info.uid) ? '<button class="pc-chat" id="pc-chat">💬 พิมพ์คุยด้วย</button>' : '')
      +'</div>';
    el.style.display='flex';
    const cb = document.getElementById('pc-chat');
    if(cb) cb.onclick = ()=>{ el.style.display='none'; openChatBox(info.uid); };
  };
  fill(null);
  if(!info.self && info.uid) lbGet(info.uid).then(lb=>{ if(el.style.display!=='none') fill(lb); });
}

/* ---------- HUD ---------- */
/* 💬🔴 รอบ 873: ชิปมุมขวาบน = จำนวนคนออนไลน์ + จำนวนเพื่อนที่ยังค้างอ่าน */
function refreshChip(){
  const n = unreadCount();
  setChip('🟢 ออนไลน์ '+Live.onlineN+' คน' + (n ? ' · 💬 '+n : ''));
}
function setChip(txt){
  const el=document.getElementById('online-chip');
  if(el) el.textContent = txt;
}

/* ============================================================
   🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
   ค่าตั้งต้น = เปิดอัตโนมัติ · volume 0.6 (ลดจากความดังเดิม 40% — ผู้ใช้สั่ง)
   browser บล็อก autoplay ก่อนมี gesture → ลองเล่นทันที + ซ้ำตอนแตะจอครั้งแรก
   จำสถานะเปิด/ปิดใน localStorage (vwCityBgm) · ซ่อนแท็บ = หยุด กลับมา = เล่นต่อ
   ============================================================ */
const BGM_KEY='vwCityBgm', BGM_VOL=0.6, BGM_SRC='sound/bgm/bgm_01.mp3';
let bgmAudio=null, bgmBtn=null;
function bgmWant(){ try{ return localStorage.getItem(BGM_KEY)!=='0'; }catch(e){ return true; } }
function bgmEnsure(){
  if(!bgmAudio){
    bgmAudio = new Audio(BGM_SRC);
    bgmAudio.loop = true; bgmAudio.volume = BGM_VOL; bgmAudio.preload = 'auto';
  }
  return bgmAudio;
}
/* 🔇 รอบ 876: บนเครื่อง dev (localhost) ไม่ autoplay — session ทดสอบหลายตัวเปิดพร้อมกันแล้วเพลงดังซ้อนกัน
   รบกวนผู้ใช้จริง (เจอ 2 ส.ค.) · ผู้เล่นจริงบน vocabworld.web.app ไม่กระทบ ยังเล่นอัตโนมัติ · ปุ่ม 🎵 กดเล่นเองได้เสมอ */
const BGM_DEV = /^(localhost|127\.)/.test(location.hostname);
function bgmPlay(force){ if(bgmWant() && (!BGM_DEV || force)) bgmEnsure().play().catch(()=>{}); }   // โดนบล็อก = เงียบไว้ รอ gesture
function bgmRefreshBtn(){
  if(!bgmBtn) return;
  const on = bgmWant();
  bgmBtn.textContent = on ? '🎵' : '🔇';
  bgmBtn.classList.toggle('off', !on);
  bgmBtn.setAttribute('aria-label', on ? 'ปิดเพลง' : 'เปิดเพลง');
}
function bgmToggle(){
  try{ localStorage.setItem(BGM_KEY, bgmWant()?'0':'1'); }catch(e){}
  if(bgmWant()) bgmPlay(true); else if(bgmAudio) bgmAudio.pause();   // กดปุ่มเอง = เจตนาชัด เล่นได้แม้บน dev
  bgmRefreshBtn();
}
function bgmSetup(){
  bgmBtn = document.createElement('button');
  bgmBtn.id = 'bgm-btn'; bgmBtn.type = 'button';
  bgmBtn.addEventListener('click', bgmToggle);
  document.body.appendChild(bgmBtn);
  bgmRefreshBtn();
  bgmPlay();
  const kick = ()=>{ bgmPlay(); removeEventListener('pointerdown', kick); };
  addEventListener('pointerdown', kick);
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ if(bgmAudio) bgmAudio.pause(); }
    else bgmPlay();
  });
}

/* ============================================================
   🚀 BOOT
   ============================================================ */
function boot(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT ? 0x0c1734 : 0x9ed7ff);
  scene.fog = new THREE.Fog(NIGHT ? 0x0c1734 : 0x9ed7ff, 160, 340);
  camera = new THREE.PerspectiveCamera(52, innerWidth/innerHeight, 0.5, 600);
  renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1, 2));
  renderer.setSize(innerWidth, innerHeight);
  if(THREE.sRGBEncoding!==undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
  rayc = new THREE.Raycaster();
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(NIGHT?0x33406b:0xcfe8ff, NIGHT?0x1a2033:0x7a9455, NIGHT?0.75:0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(NIGHT?0x8aa0ff:0xfff2d0, NIGHT?0.35:0.85);
  sun.position.set(60, 90, 30);
  scene.add(sun);

  buildCity();
  spawnSelf();
  setupInput(renderer.domElement);
  rig.apply();
  liveStart();
  bgmSetup();   // 🎵 รอบ 873: เพลงประกอบ + ปุ่มเปิด/ปิด

  addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    rig.apply();
  });

  /* ============================================================
     🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
     ------------------------------------------------------------
     เดิม: กดปุ่ม "🏙️ เมือง 3D" แล้วเจอจอน้ำเงินเปล่า ๆ ค้างจนกว่าเมืองจะสร้างเสร็จ
          (โหลด three + ปั้นตึกทั้งเมือง) — เด็กเห็นจอว่างนานเหมือนเกมค้าง
     ทำ: เอาภาพที่ captureCityShot() ถ่ายไว้ตอนเดินเข้าตึก (sessionStorage vwCityBack)
          มาเป็นฉากเปิดตั้งแต่แว้บแรก แล้วพอเมืองพร้อมค่อย "จาง" เข้าฉาก 3D จริง
     ภาพถูกวางตั้งแต่ index.html (สคริปต์สั้นก่อนโหลด three.js — เห็นเร็วที่สุดเท่าที่ทำได้)
          ที่นี่รับช่วงต่อ 2 อย่าง: ตั้งกล้องให้ตรงมุมในภาพ + สั่งจางภาพออกตอนวาดจริงแล้ว
     ตั้งกล้องตรงมุมภาพ = ภาพจางลงไปทับฉากที่หน้าตาเหมือนกันเป๊ะ (ไม่ใช่วาร์ปคนละมุม)
          จางเสร็จค่อยถอยกล้องกลับมามุมมองเมืองปกติช้า ๆ ให้เห็นว่าเป็น 3D จริง
     ============================================================ */
  const backShot = window.__vwBackShot;
  const t0=performance.now();
  let backPull = null;                         // 🧪 เทสต์เรียกด้วยเวลาจำลองได้ (แท็บพื้นหลัง rAF ไม่วิ่ง)
  if(backShot && backShot.cam){
    const c0 = backShot.cam;
    /* ปลายทาง = มุมที่ spawnSelf() ตั้งไว้ให้แล้ว (เล็งตัวเราที่หน้าประตู — รอบ 870)
       ภาพเล็งใจกลางตึก (รอบ 877 ดันกล้องชิดประตูตอนแคป) → ต้องไถกลับมาหาตัวเรา ไม่งั้นตัวเราค้างอยู่ริมจอ */
    const aimX=rig.tx, aimZ=rig.tz;
    rig.tx=c0.tx; rig.tz=c0.tz; rig.yaw=c0.yaw; rig.pitch=c0.pitch; rig.dist=c0.dist;
    rig.apply();
    const PULL_WAIT = 900, PULL_DUR = 1700;   // รอภาพจางจบก่อน (จาง .9s) แล้วค่อยถอยกล้อง
    backPull = (now)=>{
      if(ptr.size) return;                     // เด็กแตะจอเอง = หยุดจัดกล้องให้ทันที ปล่อยเขาคุม
      const sim = now!==undefined;
      const k=clamp(((sim?now:performance.now())-t0-PULL_WAIT)/PULL_DUR,0,1), e=1-Math.pow(1-k,3);
      rig.dist  = c0.dist  + (88  -c0.dist )*e;
      rig.pitch = c0.pitch + (0.95-c0.pitch)*e;
      rig.tx    = c0.tx    + (aimX-c0.tx   )*e;
      rig.tz    = c0.tz    + (aimZ-c0.tz   )*e;
      rig.apply();
      if(k<1 && !sim) requestAnimationFrame(()=>backPull());
    };
    backPull();
  }else{
    // 🎬 เปิดฉาก (เข้าเมืองตรง ๆ): กล้องหมุนลงมาหาเมืองช้าๆ
    const intro=()=>{
      const k=Math.min(1,(performance.now()-t0)/2200), e=1-Math.pow(1-k,3);
      rig.dist = 150-(150-88)*e; rig.pitch = 1.5-(1.5-0.95)*e; rig.yaw = 0.6*(1-e);
      rig.apply();
      if(k<1) requestAnimationFrame(intro);
    };
    intro();
  }

  // 📐 กันจอ 0×0/หมุนจอ: บางเครื่อง (WebView/preview) โหลดตอนหน้าต่างยังไม่มีขนาด แล้ว resize ไม่ยิงซ้ำ
  let _lw=0, _lh=0;
  const fitScreen = ()=>{
    if(_lw===innerWidth && _lh===innerHeight) return;
    _lw=innerWidth; _lh=innerHeight;
    if(_lw>0 && _lh>0){
      camera.aspect=_lw/_lh; camera.updateProjectionMatrix();
      renderer.setSize(_lw,_lh); rig.apply();
    }
  };
  const loop = ()=>{
    requestAnimationFrame(loop);
    fitScreen();
    const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
    for(let i=0;i<tickers.length;i++) tickers[i](dt,t);
    // เฉื่อยหลังปล่อยนิ้ว (เลื่อนลื่นแบบแผนที่)
    if(ptr.size===0 && (Math.abs(rig.vx)>0.001||Math.abs(rig.vz)>0.001)){
      rig.tx+=rig.vx; rig.tz+=rig.vz; rig.vx*=0.90; rig.vz*=0.90; rig.apply();
    }
    renderer.render(scene, camera);
  };
  loop();

  /* 🚪🚶 รอบ 886: ตาข่ายกันเหนียว — ไม่มี #splash / จางไม่ทำงาน ก็ยังต้องได้เดินออกจากประตู (ทำงานครั้งเดียวเสมอ) */
  setTimeout(walkSelfOut, 3000);

  const sp = document.getElementById('splash');
  if(sp){
    const fadeSplash = ()=>{
      if(fadeSplash.done) return;
      fadeSplash.done = true;
      sp.classList.add('done');
      setTimeout(()=>sp.remove(), backShot ? 1000 : 650);
      /* 🚪🚶 รอบ 886: จอเปิดเริ่มจาง = เห็นฉากจริงแล้ว → ให้ตัวเราก้าวออกจากประตูตอนนี้
         โหมดภาพ (รอบ 880): รอภาพจางไปพอสมควรก่อน · เข้าตรง (ไม่มีภาพ): รอกล้อง intro ร่อนลงมาใกล้เมืองก่อน
         ไม่งั้นตัวเรายังเป็นจุดเล็ก ๆ กลางจอ เดินออกมาแล้วเด็กไม่ทันเห็น */
      setTimeout(walkSelfOut, backShot ? 300 : 700);
    };
    /* 🎬 รอบ 880: โหมดภาพ = รอให้เมืองวาดจริงอย่างน้อย 1 เฟรมก่อนค่อยจาง
       (ไม่งั้นภาพจางลงไปเจอ canvas เปล่า แล้วเมืองค่อยโผล่ = กระพริบ)
       แท็บพื้นหลัง rAF ไม่วิ่ง → มีตาข่าย setTimeout กันภาพค้างจอ */
    if(backShot){
      requestAnimationFrame(()=>requestAnimationFrame(fadeSplash));
      setTimeout(fadeSplash, 900);
    }else fadeSplash();
  }

  /* 🧪 test hooks (preview เท่านั้น — ไม่กระทบผู้เล่น) */
  let _simT = 1000;   // เวลาจำลองของ step (แยกจาก clock จริง — แท็บ preview ที่ rAF ไม่วิ่ง)
  window.CITY = { scene, camera, renderer, rig, actors:Live.actors, _t:{
    step(n){ fitScreen();
             for(let i=0;i<(n||1);i++){ _simT+=1/60; for(let j=0;j<tickers.length;j++) tickers[j](1/60,_simT); }
             renderer.render(scene,camera); return _simT; },
    fakeStand(n){ for(let i=0;i<(n||5);i++) spawnStander('t'+i, {n:'เด็กทดสอบ'+(i+1), g:['ป.3','ม.2','ปริญญาตรี'][i%3], act:['กำลังจับคู่คำศัพท์ 🎮','กำลังอ่านหมวดคำศัพท์ 📚','กำลังดูแลน้องสัตว์ 🏠'][i%3], at:Date.now()}); },
    fakeRide(){ spawnVehicle('tc1',{kind:'car',n:'นักซิ่ง',av:'blk3c02'}); spawnVehicle('tm1',{kind:'moto',n:'สายลม',av:'blk6'});
                spawnVehicle('th1',{kind:'heli',n:'กัปตัน',av:'h_p'}); spawnVehicle('td1',{kind:'drone',n:'มือโดรน',av:''}); },
    clear(){ Object.keys(Live.actors).forEach(removeActor); },
    /* 🚶 รอบ 866 */
    self(){ const S=Live.self; if(!S||!S.g) return null;
            const lm=(S.g.userData.limbs||[]).map(p=>+p.rotation.x.toFixed(3));
            return {x:S.g.position.x, z:S.g.position.z, y:S.g.position.y, ry:S.g.rotation.y,
                    r:Math.hypot(S.g.position.x,S.g.position.z), walk:!!S.walk, bub:!!S.bub, limbs:lm,
                    named:!!S.named}; },
    walkTo(key, cb){ const b=BUILDINGS.filter(x=>x.key===key)[0]; if(!b) return false;
                     return walkSelfTo(b, cb||function(){}); },
    door(key){ return doorSpotOf(key); },
    /* 🚪🔊 รอบ 890: บานประตู — ดูสถานะ/สั่งเปิด-ปิดเอง */
    doorKeys(){ return Object.keys(CityDoors); },
    doorState(key){ const d=CityDoors[key];
                    /* 🌀 รอบ 897: บานหมุนดู ry (องศา) · ประตูม้วนดู lift (ยกขึ้นกี่ % ของช่อง) */
                    return d ? {k:+d.k.toFixed(3), tgt:+d.tgt.toFixed(3), rest:d.rest, held:d.held, kind:d.kind,
                                ry:+d.h.rotation.y.toFixed(3), bays:d.kind==='roll' ? d.h.children.length : null,
                                lift:d.kind==='roll' ? +(1-d.h.children[0].scale.y).toFixed(3) : null,
                                spill:d.sp.length ? +d.sp[0].material.opacity.toFixed(3) : null,
                                glow:d.gl.length ? +d.gl[0].material.opacity.toFixed(3) : null} : null; },
    doorSet(key, open, snap){ return setCityDoor(key, !!open, !!snap); },
    /* 🚪👥 รอบ 892: ประตูแง้มตามคนออนไลน์ */
    doorRest(key, ajar, quiet){ return setDoorRest(key, !!ajar, !!quiet); },
    doorRestScan(){ return refreshDoorRest(); },
    /* 🚗 รอบ 900: ยานที่แล่นออกจากประตูม้วน — พิกัดที่รายงานเป็น "ของตึกหลังนั้น" (ยานเป็นลูกของกลุ่มตึก) */
    rideKeys(){ return Object.keys(DOOR_RIDES); },
    rideLaunch(key){ return launchRide(key); },
    rideRelease(key){ return releaseRide(key); },
    rideLead(key){ return +rideLeadS(key).toFixed(3); },
    ride(key){ const r=Rides[key]; if(!r) return null;
               const p=r.g.position;
               return {u:+r.u.toFixed(3), dir:r.dir, go:r.go, sc:+r.g.scale.x.toFixed(2),
                       x:+p.x.toFixed(2), y:+p.y.toFixed(2), z:+p.z.toFixed(2),
                       ry:+r.g.rotation.y.toFixed(3), inScene:!!r.g.parent,
                       wheel:r.g.userData.wheels?+r.g.userData.wheels[0].rotation.y.toFixed(2):null,
                       leg:r.g.userData.legs?+r.g.userData.legs[0].rotation.x.toFixed(3):null,
                       prop:r.g.userData.props?+r.g.userData.props[0].rotation.y.toFixed(2):null}; },
    /* 🚪🚶 รอบ 886: เดินออกจากประตู — ดูสถานะ/สั่งเดินเอง (เทสต์ไม่ต้องรอ splash) */
    exit(){ const S=Live.self; return {key:ExitWalk.key, done:ExitWalk.done, spot:ExitWalk.spot,
                                       walk:!!(S&&S.walk), dusts:footDusts.length}; },
    exitOut(){ return walkSelfOut(); },
    exitReset(){ const S=Live.self; if(!S||!S.g||!ExitWalk.spot) return false;
                 ExitWalk.done=false; S.walk=false;
                 stageExitWalk(S.g, ExitWalk.key, ExitWalk.bld, ExitWalk.spot); return true; },   // ตั้งต้นใหม่ เทสต์ซ้ำในหน้าเดิม
    /* 🎬 รอบ 880: จอเปิดจากภาพเมือง — ดูโหมด/มุมกล้อง + ไล่กล้องถอยด้วยเวลาจำลอง (ms นับจากบูต) */
    intro(){ return {photo:!!backShot, cam:backShot?backShot.cam:null,
                     splash:(()=>{ const e=document.getElementById('splash'); return e?{cls:e.className, shot:!!document.getElementById('splash-shot')}:null; })(),
                     rig:{tx:+rig.tx.toFixed(2), tz:+rig.tz.toFixed(2), yaw:+rig.yaw.toFixed(3), pitch:+rig.pitch.toFixed(3), dist:+rig.dist.toFixed(2)}}; },
    introPull(ms){ if(!backPull) return null; backPull(t0+ms);
                   return {dist:+rig.dist.toFixed(2), pitch:+rig.pitch.toFixed(3), tx:+rig.tx.toFixed(2), tz:+rig.tz.toFixed(2), yaw:+rig.yaw.toFixed(3)}; },
    /* 🔑 รอบ 869: จำลองแตะตึกจริง (ผ่าน travelTo เต็มเส้นทาง — รวม guest-reroute ด้วย) */
    tapBuilding(key){ travelTo.busy=false; const b=BUILDINGS.filter(x=>x.key===key)[0]; if(!b) return false; travelTo(b); return true; },
    /* 🎵 รอบ 873: สถานะเพลง (เทสต์ปุ่ม/ระดับเสียง) */
    bgm(){ return { want:bgmWant(), btn:bgmBtn?bgmBtn.textContent:null,
                    vol:bgmAudio?bgmAudio.volume:null, paused:bgmAudio?bgmAudio.paused:null,
                    loop:bgmAudio?bgmAudio.loop:null }; },
    /* 💬 รอบ 866 */
    bubble(uid, txt, ts){ showBubble(uid, txt, ts||Date.now()); },
    fakeDb(db, uid){ Live.db=db; Live.uid=(uid===undefined?'me':uid); },   // ยัด db จำลอง แล้วเรียก watchChats/poll เทสต์เส้นทาง RTDB (uid=null = จำลอง "ยังไม่ล็อกอิน")
    watchChats(){ watchFriendChats(); },
    watchPresence(){ watchPresence(); },     // 🖊️ รอบ 868: เทสต์เส้นทาง presence ด้วย db จำลอง (ไม่ต้อง login จริง)
    poll(){ return pollWorlds(); },
    bubbleAt(uid){ const A = uid==='__self'?Live.self:Live.actors[uid];
                   return A && A.bub ? {y:A.bub.position.y, op:A.bub.material.opacity,
                                        w:+A.bub.scale.x.toFixed(2), txt:A.bubTxt} : null; },
    /* 🖊️ รอบ 868 */
    bubCount(){ return {live:Live.bubList.length, pick:actorPick.filter(o=>o.userData.actor&&o.userData.actor.bubble).length,
                        tex:bubTexCache.size, texKeys:[...bubTexCache.keys()]}; },
    safe(t){ return bubSafeText(t); },        // ข้อความที่ "แสดงจริง" หลังผ่านตัวกรองคำหยาบ
    tapBubble(uid){ const A = uid==='__self'?Live.self:Live.actors[uid];
                    if(!A||!A.bub) return false; const inf=A.bub.userData.actor;
                    if(inf&&inf.bubble) openChatBox(inf.uid); return true; },
    openChat(uid){ openChatBox(uid); return !!Live.chatWith; },
    tap(x,y){ onTap(x,y); },                 // เรียกตรรกะแตะตรง ๆ (แยกจากชั้น pointer event)
    /* 💬🔴 รอบ 873 */
    unread(){ return {n:unreadCount(), uids:Object.keys(Live.unread), chip:(document.getElementById('online-chip')||{}).textContent}; },
    badgeAt(uid){ const A=Live.actors[uid];
                  return A && A.badge ? {y:+A.badge.position.y.toFixed(2), vis:A.badge.visible,
                                         w:+A.badge.scale.x.toFixed(2), pick:actorPick.indexOf(A.badge)>=0} : null; },
    seenTs(uid){ return chatSeenTsCity(uid); },
    markRead(uid){ markReadCity(uid); refreshChip(); },
    ptrState(){ return {n:ptr.size, down:downInfo && {id:downInfo.id, b:downInfo.b}}; },
    chatState(){ return {with:Live.chatWith, canSend:chatBoxCanSend(), why:chatBoxWhy(),
                         open:(document.getElementById('chat-box')||{style:{}}).style.display==='flex',
                         note:(document.getElementById('cb-note')||{}).textContent||''}; },
    type(txt){ const i=document.getElementById('cb-input'); if(!i) return false; i.value=txt; return true; },
    send(){ sendCityChat(); },
    friends(f){ Object.assign(Live.friends, f||{}); },
    stopLive(){ const n=Live.off.length; cityStopLive(); return {closed:n, poll:Live.pollT}; },
  }};
}

if(typeof THREE==='undefined'){
  document.body.innerHTML += '<div style="color:#fff;text-align:center;padding-top:40vh;font-family:system-ui">⚠️ โหลด three.js ไม่สำเร็จ — <a href="index_classic.html" style="color:#8fd0ff">เข้าล็อบบี้แบบเดิม</a></div>';
}else boot();

})();
