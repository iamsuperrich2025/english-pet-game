/* adv3d_tex.js — 🪓 เฟส 3 (รอบ 546): ผ่าจาก js/adventure3d.js โซน "Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)"
   IIFE จบในตัว expose window.Adv3dTex — ไฟล์หลักคง alias ชื่อเดิม จุดเรียกทั้งไฟล์ไม่ต้องแก้ · โหลดก่อนไฟล์หลักใน loadAdv3d() (js/ui.js)
   deps ตอนรัน: THREE (global) · ค่าจาก closure ไฟล์หลัก inject ผ่าน Adv3dTex.bind({adRenterActive, adSeqBase})
   (logic โฆษณา DB/ร้านเช่าป้าย adsFetch/adShop/flyby ไม่ย้าย — พัวพัน Online/state/toast อยู่ไฟล์หลักต่อ) */
window.Adv3dTex=(function(){
const texCache={};                 // cache เฉพาะ L/E (โซน soccer ใช้ texCache แยกของไฟล์หลัก คนละคีย์ SG)
let _hookRenter=()=>null;          // adRenterActive ของไฟล์หลัก (อ่าน adRenters สดจาก DB)
let _adSeq=0;                      // เลขป้ายตั้งพื้นถัดไป — ตั้งฐานผ่าน bind
const TILE_COLORS = ['#ff8a65','#4fc3f7','#aed581','#ffd54f','#ba68c8','#f06292','#4dd0e1','#ff8a80'];
function letterTexture(ch){
  const key='L'+ch;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const col=TILE_COLORS[(ch.charCodeAt(0)-97)%TILE_COLORS.length];
  c.beginPath(); c.roundRect(8,8,112,112,26);
  c.fillStyle=col; c.fill();
  c.lineWidth=8; c.strokeStyle='rgba(255,255,255,.9)'; c.stroke();
  c.fillStyle='#fff'; c.font='900 84px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(ch.toUpperCase(),64,72);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
/* 🖤 รอบ 778 (ผู้ใช้สั่ง "เฉพาะโลกนี้เท่านั้น"): แผ่นตัวอักษรสีดำสำหรับโรงแรมผีสิง
   แผ่นสีลูกกวาดของโลกอื่นสว่างจ้าจนกลืนบรรยากาศบ้านผีไม่ลง (และตอนไฟดับยิ่งโดดออกมาทั้งแถบ)
   ดำสนิท+ขอบ/ตัวอักษรขาว = ยังอ่านง่ายในความมืด แต่กลมกลืนกับโลก · cache คนละคีย์ ('D') ไม่ชนของเดิม */
function letterTextureDark(ch){
  const key='D'+ch;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.beginPath(); c.roundRect(8,8,112,112,26);
  c.fillStyle='#0b0b0e'; c.fill();
  c.lineWidth=8; c.strokeStyle='rgba(236,240,255,.92)'; c.stroke();
  c.fillStyle='#f2f5ff'; c.font='900 84px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(ch.toUpperCase(),64,72);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
function emojiTexture(emo){
  const key='E'+emo;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  c.font='100px serif'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(emo,64,70);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
/* 👻 ภาพผีไทย (อัปเกรดจาก emoji) — วาง img/ghosts/ghost_1.png … ghost_5.png (PNG โปร่งใส 1024×1024)
   ภาพไหนโหลดได้ใช้แทน emoji · ผีที่ลอยอยู่แล้วสลับภาพตอน respawn (ทุก 20 วิ) · prompt ใน PROMPTS_GHOSTS.md */
const GHOST_IMG_MAX=5;
const ghostTex=[];
let ghostProbed=false;
let ghostProbeLeft=0;      // จำนวนภาพที่ยัง probe ไม่เสร็จ (โหลดสำเร็จ/พลาด)
let onGhostReady=null;     // callback เรียกครั้งเดียวเมื่อ probe ครบทุกภาพ
// วัดกรอบตัวผี (พิกเซลไม่โปร่งใส) ตอนโหลด → คืนสัดส่วนไว้ฟิตสเกลอัตโนมัติ (ไม่ต้อง hardcode ทีละตัว · ครอบภาพผีที่เจนใหม่ในอนาคตด้วย)
function measureGhostBox(img){
  const cw=img.naturalWidth||img.width, ch=img.naturalHeight||img.height, aspect=cw/ch;
  const w=160, h=Math.max(1,Math.round(160*ch/cw));    // ย่อวัดพอ (สัดส่วนเท่าเดิม เร็วกว่าสแกนเต็มภาพ)
  try{
    const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
    const x=cv.getContext('2d'); x.drawImage(img,0,0,w,h);
    const d=x.getImageData(0,0,w,h).data;
    let top=h, bot=-1;
    for(let y=0;y<h;y++){ for(let px=0;px<w;px++){ if(d[(y*w+px)*4+3]>16){ if(y<top)top=y; bot=y; break; } } }
    if(bot<top) return {aspect, fhFrac:.95, belowFrac:.03};   // ภาพโปร่งหมด → ค่ากันเหนียว
    return {aspect, fhFrac:(bot-top+1)/h, belowFrac:(h-1-bot)/h};  // สัดส่วนตัว + ระยะขอบล่างถึงเท้า
  }catch(e){ return {aspect, fhFrac:.95, belowFrac:.03}; }     // canvas tainted → เดาสัดส่วน
}
function probeGhostImages(){
  if(ghostProbed) return; ghostProbed=true;
  ghostProbeLeft=GHOST_IMG_MAX;
  const settle=()=>{ if(--ghostProbeLeft<=0 && onGhostReady){ const f=onGhostReady; onGhostReady=null; f(); } };  // ครบทุกภาพ → เรียก callback
  for(let i=1;i<=GHOST_IMG_MAX;i++){
    const img=new Image();                             // probe ด้วย Image (ห้าม fetch local — กติกาเดียวกับ probeImages)
    img.onload=()=>{ const t=new THREE.Texture(img); t.needsUpdate=true; t.userData=Object.assign({gi:i},measureGhostBox(img)); ghostTex.push(t); settle(); };  // gi=เลขไฟล์ + สัดส่วนตัวจริง
    img.onerror=settle;                                // ภาพหาย/โหลดพลาด ก็นับว่า settle (ไม่ให้ค้างรอ)
    img.src='img/ghosts/ghost_'+i+'.png';
  }
}
// เรียก cb เมื่อภาพผีพร้อม (probe ครบทุกภาพแล้ว ไม่ว่าโหลดได้กี่ภาพ) · ถ้าครบอยู่แล้ว → เรียกทันที
function whenGhostsReady(cb){
  if(!ghostProbed || ghostProbeLeft<=0) cb();
  else onGhostReady=cb;
}
function ghostTexture(emojis){
  if(ghostTex.length) return ghostTex[Math.floor(Math.random()*ghostTex.length)];
  return emojiTexture(emojis[Math.floor(Math.random()*emojis.length)]);
}
// jump scare: คืน src ภาพผีสุ่มตัว (ถ้าผู้ใช้วางภาพแล้ว) ไม่มี = null → ใช้ emoji 👻 เต็มจอเดิม
function ghostScareSrc(){
  if(!ghostTex.length) return null;
  const t=ghostTex[Math.floor(Math.random()*ghostTex.length)];
  return (t.image && t.image.src) || null;
}
/* 📢 ป้ายโฆษณาบนยอดตึก (รอบ 58) — พื้นหลังคนละสไตล์ต่อป้าย + เลขป้ายมุมซ้ายเสมอ
   รอบ 1320: ป้ายว่างไม่แสดงในทุกโลก · มีภาพลูกค้าหรือผู้เช่าจริงจึงค่อยแสดง
   วางไฟล์ img/ads/ad_<เลข>.png (สัดส่วน 8:3 เช่น 1024×384) → ภาพลูกค้าขึ้นแทนทันที */
const AD_STYLES=[
  ['#ff8a80','#b71c1c','#fff'],['#81d4fa','#0d47a1','#fff'],['#c5e1a5','#33691e','#1b3609'],
  ['#ffd54f','#e65100','#5d3a00'],['#ce93d8','#4a148c','#fff'],['#f8bbd0','#880e4f','#fff'],
  ['#80cbc4','#004d40','#fff'],['#ffab91','#bf360c','#fff'],['#cfd8dc','#263238','#eceff1'],
  ['#fff59d','#f9a825','#5d3a00'],
];
/* 🪧 รอบ 362: ผู้เช่าป้ายจาก DB /ads/<n>={uid,n,ts} — ผู้เล่นจ่ายเหรียญจองใส่ชื่อ 7 วัน
   ลูกค้าจริง (img/ads/ad_<n>.png) สำคัญกว่าเสมอ · _adTexDraws เก็บตัววาดซ้ำต่อป้าย (ข้อมูล DB มาทีหลัง) */
const _adTexDraws={}, _adHasImg={};
function adBoardTexture(n,onContent){
  const cv=document.createElement('canvas'); cv.width=512; cv.height=192;
  const c=cv.getContext('2d');
  const [c1,c2,tc]=AD_STYLES[(n-1)%AD_STYLES.length];
  const tex=new THREE.CanvasTexture(cv);
  const draw=(img)=>{
    const renter=_hookRenter(n);
    const hasContent=!!(img||renter);
    c.clearRect(0,0,512,192);
    if(!hasContent){
      tex.needsUpdate=true;
      if(onContent) onContent(false);
      return;
    }
    const g=c.createLinearGradient(0,0,512,192);
    g.addColorStop(0,c1); g.addColorStop(1,c2);
    c.fillStyle=g; c.fillRect(0,0,512,192);
    // ลวดลายพื้นหลังต่างกัน 3 ตระกูล (แถบ/จุด/ดาว) สลับตามเลขป้าย
    c.globalAlpha=.14; c.fillStyle='#fff';
    if(n%3===0){ for(let x=0;x<512;x+=64) c.fillRect(x,0,20,192); }
    else if(n%3===1){ for(let x=28;x<512;x+=72) for(let y=28;y<192;y+=68){ c.beginPath(); c.arc(x,y,13,0,7); c.fill(); } }
    else{ c.font='40px serif'; for(let x=14;x<512;x+=92) c.fillText('✦',x,58+((x/92|0)%2)*84); }
    c.globalAlpha=1;
    if(img){
      c.drawImage(img,6,6,500,180);                    // โฆษณาลูกค้าเต็มป้าย (เว้นกรอบ 6px)
    }else if(renter){                                  // 🪧 ป้ายผู้เล่นเช่า — ชื่อเล่น+เข็ม (ไม่มีชื่อจริง)
      c.fillStyle=tc; c.textAlign='center';
      c.font='900 30px Kanit, Tahoma, Arial'; c.fillText('🪧 ป้ายนี้เป็นของ',256,60);
      let fs=52; c.font='900 '+fs+'px Kanit, Tahoma, Arial';
      while(fs>20 && c.measureText(renter.n).width>470){ fs-=4; c.font='900 '+fs+'px Kanit, Tahoma, Arial'; }
      c.fillText(renter.n,256,140);
    }
    // กรอบขาว + เลขป้าย (โชว์ตลอดแม้มีโฆษณา — ลูกค้าใช้อ้างอิงว่าลงป้ายไหน)
    c.lineWidth=8; c.strokeStyle='rgba(255,255,255,.9)'; c.strokeRect(4,4,504,184);
    c.fillStyle='rgba(0,0,0,.68)';
    c.beginPath(); c.roundRect(10,10,92,38,10); c.fill();
    c.fillStyle='#ffd54f'; c.font='900 24px Arial'; c.textAlign='center';
    c.fillText('ป้าย '+n,56,37);
    tex.needsUpdate=true;
    if(onContent) onContent(true);
  };
  draw(null);
  const img=new Image();                               // probe ภาพลูกค้า (กติกาเดียวกับ probeImages)
  img.onload=()=>{ _adHasImg[n]=true; draw(img); };
  img.src='img/ads/ad_'+n+'.png';
  _adTexDraws[n]=()=>draw(_adHasImg[n]?img:null);      // 🪧 วาดซ้ำเมื่อข้อมูลผู้เช่ามาถึง/เปลี่ยน
  return tex;
}
/* 📢 รอบ 204: ป้ายโฆษณาตั้งพื้น (แผ่น 8:3 บนเสา 2 ต้น)
   รอบ 1320: ซ่อนทั้งแผ่นและเสาเมื่อไม่มีภาพลูกค้าหรือผู้เช่าจริง */
/* _adSeq ประกาศหัวไฟล์ — ไฟล์หลักตั้งฐานเลขป้าย (ต่อจากป้ายเฮลิฯ กันชน ad_<n>.png) ผ่าน bind ค่า adSeqBase */
function addAdBillboard(sc,n,x,z,angle,groundY){
  const pw=7, ph=pw*3/8, postH=3;
  const g=new THREE.Group();
  g.visible=false;
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),
    new THREE.MeshBasicMaterial({map:adBoardTexture(n,v=>{g.visible=v;}),transparent:true,side:THREE.DoubleSide}));
  panel.position.y=postH+ph/2; g.add(panel);
  const poleG=new THREE.CylinderGeometry(.13,.13,postH+ph,6), poleM=new THREE.MeshLambertMaterial({color:0x37474f});
  [-pw/3,pw/3].forEach(off=>{ const p=new THREE.Mesh(poleG,poleM); p.position.set(off,(postH+ph)/2,0); g.add(p); });
  g.position.set(x,groundY||0,z); g.rotation.y=angle; sc.add(g);
}
/* วางป้ายเป็นวงรอบสนาม หันหน้าเข้ากลาง · tr!=null = เพิ่มกันชน (โลกเดิน) */
function ringAds(sc,count,radius,groundY,tr){
  for(let i=0;i<count;i++){
    const a=(i+.5)/count*Math.PI*2, x=Math.cos(a)*radius, z=Math.sin(a)*radius;
    addAdBillboard(sc,++_adSeq,x,z,Math.atan2(-x,-z),groundY);
    if(tr) tr.push({x,z,r:1.4});
  }
}
/* 🏙️ ผนังตึกโลกเฮลิฯ — default วาดหน้าต่างเรียงชั้น (procedural) ให้ดูมีมิติกว่ากล่องสีล้วน
   วางไฟล์ img/buildings/facade_<n>.png (n=1..6 · ภาพต่อกันได้/seamless จัตุรัส) → ผนังจริงขึ้นแทน tile ขึ้นตึกอัตโนมัติ
   prompt อยู่ใน PROMPTS_BUILDINGS.md */
const BUILDING_TINTS=[0x9fb2c8,0xc8b89f,0xb0c8a8,0xc8a8b8,0x9fc8c4,0xbfae90];
// 🪟 รอบ 379: จำนวน "แถวหน้าต่าง (ชั้น)" ใน 1 tile ของ facade_1..6 — นับจากภาพจริง (เปลี่ยนภาพต้องนับใหม่)
const FACADE_ROWS={1:8,2:6,3:5,4:4,5:8,6:5};
function buildingFacadeTexture(n){
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const tex=new THREE.CanvasTexture(cv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;            // tile ซ้ำขึ้นตึก (repeat ตั้งตามขนาดตึกตอนสร้าง)
  const base='#'+('000000'+BUILDING_TINTS[(n-1)%BUILDING_TINTS.length].toString(16)).slice(-6);
  const drawProc=()=>{
    c.fillStyle=base; c.fillRect(0,0,128,128);
    for(let gy=0;gy<3;gy++)for(let gx=0;gx<3;gx++){       // หน้าต่าง 3×3 ต่อกระเบื้อง (บางบานติดไฟ)
      c.fillStyle=Math.random()<.45?'rgba(255,236,170,.92)':'rgba(28,38,54,.85)';
      c.fillRect(gx*42+9,gy*42+9,26,30);
    }
    tex.needsUpdate=true;
  };
  drawProc();
  const img=new Image();                               // probe รูปผนังจริง .jpg ก่อน .png (รอบ 370 — jpg เบากว่า ~8 เท่า)
  img.onload=()=>{ tex.image=img; tex.needsUpdate=true; };
  img.onerror=()=>{ const p=new Image(); p.onload=()=>{ tex.image=p; tex.needsUpdate=true; }; p.src='img/buildings/facade_'+n+'.png'; };
  img.src='img/buildings/facade_'+n+'.jpg';
  return tex;
}

/* ป้ายผู้เล่นคนอื่น: ชื่อ + ภาพตัวละคร (player_male/female.png ถ้ามี · ไม่มีใช้อีโมจิ)
   โหมดเฮลิคอปเตอร์: เพื่อนเป็น 🚁 บินอยู่ (ตำแหน่ง+ความสูงจริงจาก /world) */
/* 🎖️ รอบ 644: grade = ระดับชั้นของเพื่อน → วาดดาว/เพชรใต้ชื่อในป้าย (กล่องยืดลง 16px ตอนมี) */
function makePeerSprite(name, av, M, grade){
  const cv=document.createElement('canvas'); cv.width=128; cv.height=170;
  const tex=new THREE.CanvasTexture(cv);
  const flyMode=M.heli||M.drone;
  const hasG=!!(typeof gradeSymbol==='function' && gradeSymbol(grade));
  const boxH=hasG?46:30, bodyY=hasG?52:36;          // สูงกล่องป้าย · ตำแหน่งเริ่มรูป/อีโมจิใต้ป้าย
  const draw=(img)=>{
    const c=cv.getContext('2d');
    c.clearRect(0,0,128,170);
    c.fillStyle='rgba(0,0,0,.55)';
    c.beginPath(); c.roundRect(4,2,120,boxH,12); c.fill();
    c.fillStyle='#fff'; c.font='bold 19px Arial'; c.textAlign='center'; c.textBaseline='middle';
    let nm=(name||'เพื่อน'); if(nm.length>9) nm=nm.slice(0,8)+'…';
    c.fillText(nm,64,hasG?16:18);
    if(hasG) gradeMarkCanvas(c,grade,64,36,15);
    if(flyMode){
      // 🚁 รอบ 355: โลกเฮลิฯ อ่านเฟสของเพื่อนจาก av ('h_w'=เดิน 'h_r'=นั่งโดยสาร 'h_g'=วิงสูท 'h_p'=ขับ)
      // 🚁 รอบ 385: เฟสขับ/นั่ง (p/r) ไม่วาด emoji — tickPeers วาดลำโมเดล 3D จริงแทน เหลือแค่ป้ายชื่อลอยเหนือลำ
      const hm={w:'🚶',r:'',g:'🪂',p:'',b:''}, hc=av?av.charAt(2):'';   // b=ขับลำฟ้า (รอบ 392) — วาดลำ 3D แทน emoji
      const em=M.drone?'🛸':(av&&av.slice(0,2)==='h_'?(hc in hm?hm[hc]:'🚁'):'🚁');
      if(em){ c.font='96px serif'; c.fillText(em,64,bodyY+69); }
    }
    else if(img){ c.drawImage(img,14,bodyY,100,166-bodyY); }
    else{ c.font='90px serif'; c.fillText(av==='male'?'👦':'👧',64,bodyY+69); }
    tex.needsUpdate=true;
  };
  draw(null);
  if(!flyMode && (av==='male' || av==='female')){
    const img=new Image();
    img.onload=()=>draw(img);
    img.src='img/player_'+av+'.png';
  }
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  spr.scale.set(flyMode?2.4:1.7,flyMode?2.4:2.26,1);
  return spr;
}
function bind(o){ if(o.adRenterActive)_hookRenter=o.adRenterActive; if(o.adSeqBase!=null)_adSeq=o.adSeqBase; }
return {bind, letterTexture, letterTextureDark, emojiTexture, ghostTex, measureGhostBox, probeGhostImages, whenGhostsReady,
  ghostTexture, ghostScareSrc, adBoardTexture, addAdBillboard, ringAds, adTexDraws:_adTexDraws, adHasImg:_adHasImg,
  FACADE_ROWS, buildingFacadeTexture, makePeerSprite};
})();
