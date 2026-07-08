/* ============================================================
   adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
   🌍 adv   = โลกผจญภัยกลางวัน: เก็บตัวอักษรประกอบคำ 15🪙/คำ · monster ยิงสู้ได้
   👻 haunt = โลกผีสิงกลางคืน: 25🪙/คำ · ผี 8 ตัว โผล่ 20 วิแล้วย้ายที่
              สู้ไม่ได้ต้องหนี · โดนจับ = game over ทันที + jump scare
   ทั้ง 2 โลก multiplayer สไตล์ Roblox: ผู้เล่นอื่นโผล่ใน map ผ่าน Firebase
   (/world/<map>/<uid> = ตำแหน่ง) · เจอเพื่อนที่ชวน/ถูกชวน (tinv) ครั้งแรก
   ของ map → เงินคืนคนละ TINV_CASHBACK
   เสียงหลอน: สังเคราะห์ Web Audio (ไม่มีลิขสิทธิ์) · ถ้ามีไฟล์ sound/haunt_*.mp3
   (เจนจาก Suno — ดู PROMPTS_SOUND.md) จะสลับใช้ไฟล์จริงอัตโนมัติ
   ▶ โหลด dynamic หลัง js/vendor/three.min.js (global THREE) เท่านั้น
   ============================================================ */
(function(){
'use strict';

/* ---------- ค่ากติกากลาง ---------- */
const GUIDE_WORDS  = 10;        // จำนวนคำ guideline บนจอ (8.1)
const RELOCATE_MS  = 75000;     // ตัวอักษรค้างครบเวลานี้ → สุ่มย้ายที่ (8.2)
const HALF         = 60;        // ครึ่งความกว้างแผนที่ (โลก 120×120)
const PLAYER_SPEED = 6;         // m/s
const PICK_DIST    = 1.6;       // ระยะเดินเก็บตัวอักษร
const EYE_H        = 1.6;
const NET_SEND_MS  = 180;       // ส่งตำแหน่งขึ้น DB ถี่สุดเท่านี้ (~5.5Hz)

/* ---------- ค่าเฉพาะโหมด ---------- */
const MODES = {
  adv: {
    label:'โลกผจญภัย', emoji:'🌍', reward:15, doneKey:'advDone',
    shoot:true, ghost:false,
    sky:0x8ed4f7, fogN:30, fogF:95, ground:0x7ec850,
    monMax:4, monSpawnMs:16000, monSpeed:3.4, monDmg:10, monHp:2,
    monEmoji:['👾','🕷️','🦇','👻'],
    intro:'🌍 <b>โลกผจญภัย!</b><br><small>เก็บตัวอักษรมาประกอบคำทางซ้าย · ระวัง monster 👾 ยิงสู้ได้</small>',
    hint:'คลิกจอ=ล็อกเมาส์ · WASD เดิน · คลิกยิง · Esc ปลดเมาส์แล้วค่อยกดออก',
  },
  haunt: {
    label:'โลกผีสิง', emoji:'👻', reward:25, doneKey:'hauntDone',
    shoot:false, ghost:true,
    sky:0x090916, fogN:9, fogF:46, ground:0x18251d,
    ghostMax:8, ghostLife:20000, ghostSpeed:5.0, huntR:18, seeR:11,
    ghostEmoji:['👻','👻','👻','💀','🧟'],
    intro:'👻 <b>โลกผีสิง...</b><br><small>ผีโผล่ทีละ 20 วิแล้วย้ายที่ · สู้ไม่ได้ ถ้าโผล่ใกล้ให้วิ่งหนี!<br>โดนจับ = จบเกมทันที</small>',
    hint:'คลิกจอ=ล็อกเมาส์ · WASD วิ่งหนี · สู้ไม่ได้!! · Esc ปลดเมาส์แล้วค่อยกดออก',
    koTitle:'💫 พลังหมดแล้ว!',
  },
  heli: {
    label:'โลกเฮลิคอปเตอร์', emoji:'🚁', reward:30, doneKey:'heliDone',
    shoot:false, ghost:false, heli:true,
    sky:0x9fd9f7, fogN:45, fogF:150, ground:0x8a8f96,
    intro:'🚁 <b>โลกเฮลิคอปเตอร์ Bell!</b><br><small>ตัวอักษรอยู่บนยอดตึก — บินลอดระหว่างตึก<br>แล้ว<b>ลงจอดบนดาดฟ้า</b>เพื่อเก็บ · ระวังชนตึก!</small>',
    hint:'W/S เอียงหน้า-หลัง · A/D สไลด์ · Q/E หันหัว · Space ขึ้น · Shift ลง · จอดเบาๆ บนดาดฟ้าเพื่อเก็บตัวอักษร',
    koTitle:'🚁💥 เฮลิคอปเตอร์พังแล้ว!',
  },
};
MODES.adv.koTitle='💫 พลังหมดแล้ว!';
const SHOOT_GAP_MS = 280;
const MONSTER_REWARD = 2;       // เหรียญ/ตัว เมื่อยิง monster แตก (โหมด adv)

/* ---------- สถานะรอบเล่น ---------- */
let mode='adv', M=MODES.adv;
let built=false, running=false, rafId=0;
let renderer, camera, clock;
let worlds={};                    // ฉาก static ต่อโหมด {scene,trees,buildings} สร้างครั้งเดียว
let scene=null, trees=[], buildings=[];
/* ---------- เฮลิคอปเตอร์ (โหมด heli) ---------- */
const HELI_SKID=1.35;             // ความสูงตาคนขับเหนือแท่นลงจอด (คาน skid)
let hVel={x:0,y:0,z:0}, hCol=0, hLanded=true, hHitAt=0, hudInstEl=null, cockpitEl=null;
let yaw=0, pitch=0;
let hp=100, sessionCoins=0, sessionWords=0;
let inv={};                       // ตัวอักษรในกระเป๋า {a:2,...}
let words=[];                     // guideline [{en,th}]
let letters=[];                   // ตัวอักษรในโลก [{ch,spr,born}]
let monsters=[];                  // adv: [{spr,hp,tgt,wanderAt,hitAt}] · haunt(ผี): [{spr,born,hunting,wailAt,tgt,wanderAt}]
let shots=[];                     // [{mesh,dir,life}]
let keys={}, joy={on:false,dx:0,dy:0}, lookTouch=null, lastShot=0, lastEnsure=0, lastSpawn=0;
let dmgFlashEl, hudWordsEl, hudInvEl, hudHpEl, hudCoinEl, hudHuntEl, hudBoardEl, mapCv, mapCtx, banEl, overlayEl, canvasEl, scareEl, hintEl;
let texCache={};

/* ---------- multiplayer ---------- */
let peers={};                     // uid → {spr, cur:{x,z}, tgt:{x,z}, n, av, bubble, lastCt}
let worldRef=null, myRef=null, lastNetSend=0, lastSent=null;
/* แชทลอยหัวแบบ Roblox: พิมพ์สั้นๆ โชว์เหนือหัว BUBBLE_MS */
const CHAT_MAX=60, BUBBLE_MS=5000;
let myChat=null;                  // {text, ts} — แนบไปกับ sendPos ระหว่างยังสด (ct ใช้ Date.now คงที่ กันเด้งซ้ำ)
let chatBoxEl=null, chatInputEl=null, selfMsgEl=null;

/* ============================================================
   คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
   ============================================================ */
function doneList(){ return state[M.doneKey]; }
function wordPool(second){
  const cur = words.map(w=>w.en);
  let pool = vocabForStudent()
    .filter(([en])=>/^[a-z]{2,9}$/i.test(en))
    .filter(([en])=>!doneList().includes(en.toLowerCase()) && !cur.includes(en.toLowerCase()));
  if(!pool.length && second!==true){
    // ประกอบครบทุกคำในระดับชั้นแล้ว → เริ่มรอบใหม่ (คำเติมไม่มีวันหมดตามสเปก 8.6)
    state[M.doneKey] = [];
    saveState();
    return wordPool(true);
  }
  return pool;
}
function pickWords(n){
  return shuffle(wordPool()).slice(0,n).map(([en,th])=>({en:en.toLowerCase(), th}));
}

/* ============================================================
   Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
   ============================================================ */
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
/* ป้ายผู้เล่นคนอื่น: ชื่อ + ภาพตัวละคร (player_male/female.png ถ้ามี · ไม่มีใช้อีโมจิ)
   โหมดเฮลิคอปเตอร์: เพื่อนเป็น 🚁 บินอยู่ (ตำแหน่ง+ความสูงจริงจาก /world) */
function makePeerSprite(name, av){
  const cv=document.createElement('canvas'); cv.width=128; cv.height=170;
  const tex=new THREE.CanvasTexture(cv);
  const heliMode=M.heli;
  const draw=(img)=>{
    const c=cv.getContext('2d');
    c.clearRect(0,0,128,170);
    c.fillStyle='rgba(0,0,0,.55)';
    c.beginPath(); c.roundRect(4,2,120,30,12); c.fill();
    c.fillStyle='#fff'; c.font='bold 19px Arial'; c.textAlign='center'; c.textBaseline='middle';
    let nm=(name||'เพื่อน'); if(nm.length>9) nm=nm.slice(0,8)+'…';
    c.fillText(nm,64,18);
    if(heliMode){ c.font='96px serif'; c.fillText('🚁',64,105); }
    else if(img){ c.drawImage(img,14,36,100,130); }
    else{ c.font='90px serif'; c.fillText(av==='male'?'👦':'👧',64,105); }
    tex.needsUpdate=true;
  };
  draw(null);
  if(!heliMode && (av==='male' || av==='female')){
    const img=new Image();
    img.onload=()=>draw(img);
    img.src='img/player_'+av+'.png';
  }
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  spr.scale.set(heliMode?2.6:1.7,heliMode?3.45:2.26,1);
  return spr;
}

/* ---------- แชทลอยหัว (Roblox-style) ---------- */
function bubbleSprite(text){
  const cv=document.createElement('canvas'); cv.width=360; cv.height=120;
  const c=cv.getContext('2d');
  c.font='600 26px Arial';
  // ตัดเป็น ≤2 บรรทัดตามความกว้างจริง (รองรับไทย/อังกฤษปน)
  const maxW=320, lines=[]; let cur='';
  for(const ch of String(text)){
    if(c.measureText(cur+ch).width>maxW){ lines.push(cur); cur=ch; if(lines.length===2) break; }
    else cur+=ch;
  }
  if(lines.length<2 && cur) lines.push(cur);
  if(lines.length===2 && cur && lines[1]!==cur) lines[1]=lines[1].slice(0,-1)+'…';
  const h=lines.length>1?110:78;
  const spooky=mode==='haunt';                    // โลกผี: กรอบดำ ตัวเขียวเรืองแสง
  c.clearRect(0,0,360,120);
  c.fillStyle=spooky?'rgba(8,8,20,.92)':'rgba(255,255,255,.95)';
  c.beginPath(); c.roundRect(6,6,348,h-12,20); c.fill();
  c.strokeStyle=spooky?'rgba(124,255,176,.75)':'rgba(0,0,0,.25)'; c.lineWidth=3; c.stroke();
  if(spooky){ c.shadowColor='#7cffb0'; c.shadowBlur=14; }
  c.fillStyle=spooky?'#7cffb0':'#333'; c.textAlign='center'; c.textBaseline='middle';
  lines.forEach((ln,i)=>c.fillText(ln,180,(lines.length>1?36:h/2)+i*36));
  c.shadowBlur=0;
  const tex=new THREE.CanvasTexture(cv);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  spr.scale.set(3.0,1.0,1);
  return spr;
}
function showPeerBubble(p, text){
  if(p.bubble){ scene.remove(p.bubble.spr); p.bubble.spr.material.map.dispose(); p.bubble.spr.material.dispose(); }
  const spr=bubbleSprite(text);
  spr.position.set(p.cur.x, 3.1, p.cur.z);
  scene.add(spr);
  p.bubble={spr, until:performance.now()+BUBBLE_MS};
  sfx.select();
}
function removePeerBubble(p){
  if(!p.bubble) return;
  scene.remove(p.bubble.spr); p.bubble.spr.material.map.dispose(); p.bubble.spr.material.dispose();
  p.bubble=null;
}

/* ============================================================
   สร้างฉาก static ครั้งเดียวต่อโหมด
   ============================================================ */
function buildScene(md){
  const cfg=MODES[md];
  const sc=new THREE.Scene();
  const tr=[];
  sc.background=new THREE.Color(cfg.sky);
  sc.fog=new THREE.Fog(cfg.sky, cfg.fogN, cfg.fogF);

  if(md==='adv'){
    sc.add(new THREE.HemisphereLight(0xffffff,0x6faa50,1.05));
    const sun=new THREE.DirectionalLight(0xfff2cc,.8); sun.position.set(30,60,20); sc.add(sun);
  }else if(md==='haunt'){
    sc.add(new THREE.HemisphereLight(0x9db4ff,0x1a2418,.38));
    const moonL=new THREE.DirectionalLight(0xbfd0ff,.3); moonL.position.set(-40,50,-30); sc.add(moonL);
    // พระจันทร์เต็มดวงสีซีด
    const moon=new THREE.Mesh(new THREE.CircleGeometry(6,24),
      new THREE.MeshBasicMaterial({color:0xf5f0d8,fog:false}));
    moon.position.set(-45,38,-70); moon.lookAt(0,EYE_H,0); sc.add(moon);
  }
  // (โหมด heli ใส่แสงของตัวเองในบล็อกเมืองด้านล่าง)

  const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(HALF*2+20,HALF*2+20),
    new THREE.MeshLambertMaterial({color:cfg.ground}));
  ground.rotation.x=-Math.PI/2; sc.add(ground);

  // รั้วรอบแผนที่
  const fenceMat=new THREE.MeshLambertMaterial({color:md==='adv'?0xb98a5a:0x3a3a4a});
  [[0,-HALF],[0,HALF]].forEach(([x,z])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(HALF*2,1.6,.4),fenceMat);
    f.position.set(x,.8,z); sc.add(f);
  });
  [[-HALF,0],[HALF,0]].forEach(([x,z])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(.4,1.6,HALF*2),fenceMat);
    f.position.set(x,.8,z); sc.add(f);
  });

  if(md==='adv'){
    // ต้นไม้เขียว + หิน + ดอกไม้
    const trunkG=new THREE.CylinderGeometry(.35,.5,2.6,7);
    const trunkM=new THREE.MeshLambertMaterial({color:0x8b5a2b});
    const crownG=new THREE.IcosahedronGeometry(2.1,0);
    const crownM=new THREE.MeshLambertMaterial({color:0x2e8b3d});
    for(let i=0;i<42;i++){
      const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
      if(Math.hypot(x,z)<8) continue;
      const t1=new THREE.Mesh(trunkG,trunkM); t1.position.set(x,1.3,z);
      const c1=new THREE.Mesh(crownG,crownM); c1.position.set(x,3.6,z);
      c1.rotation.y=Math.random()*Math.PI;
      sc.add(t1,c1); tr.push({x,z,r:1.0});
    }
    const rockG=new THREE.DodecahedronGeometry(1,0);
    const rockM=new THREE.MeshLambertMaterial({color:0x9e9e9e});
    for(let i=0;i<14;i++){
      const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
      if(Math.hypot(x,z)<8) continue;
      const r=new THREE.Mesh(rockG,rockM);
      const s=.5+Math.random()*.9;
      r.scale.set(s,s*.7,s); r.position.set(x,s*.4,z); r.rotation.y=Math.random()*3;
      sc.add(r); tr.push({x,z,r:s*.9});
    }
    const flG=new THREE.SphereGeometry(.16,6,5);
    ['#ff6b81','#ffd54f','#fff','#b388ff'].forEach(col=>{
      const m=new THREE.MeshBasicMaterial({color:col});
      for(let i=0;i<22;i++){
        const f=new THREE.Mesh(flG,m);
        f.position.set((Math.random()*2-1)*(HALF-4),.16,(Math.random()*2-1)*(HALF-4));
        sc.add(f);
      }
    });
  }else if(md==='heli'){
    // เมืองตึกสูง: ตัวอักษรวางบนดาดฟ้า ต้องบินลอดตึกแล้วลงจอดเก็บ
    sc.add(new THREE.HemisphereLight(0xffffff,0x777a80,1.0));
    const sun=new THREE.DirectionalLight(0xfff4d6,.7); sun.position.set(40,80,30); sc.add(sun);
    // ถนนตาราง (เส้นเข้มบนพื้น)
    const roadM=new THREE.MeshLambertMaterial({color:0x50545a});
    for(let i=-2;i<=2;i++){
      const r1=new THREE.Mesh(new THREE.PlaneGeometry(HALF*2+20,6),roadM);
      r1.rotation.x=-Math.PI/2; r1.position.set(0,.02,i*24); sc.add(r1);
      const r2=new THREE.Mesh(new THREE.PlaneGeometry(6,HALF*2+20),roadM);
      r2.rotation.x=-Math.PI/2; r2.position.set(i*24,.02,0); sc.add(r2);
    }
    // ตึก: กริดทุก 24m เว้นลานกลาง (จุดเกิด) · เก็บ footprint ไว้เช็กชน+วางตัวอักษร
    const cols=[0x9fb2c8,0xc8b89f,0xb0c8a8,0xc8a8b8,0x9fc8c4,0xbfae90];
    const list=[];
    for(let gx=-2;gx<=2;gx++) for(let gz=-2;gz<=2;gz++){
      if(gx===0 && gz===0) continue;                    // ลานกลาง = จุดเกิด/สนามบินหลัก
      if(Math.random()<.22) continue;                   // เว้นช่องว่างให้เมืองโปร่ง
      const x=gx*24 + (Math.random()*4-2);
      const z=gz*24 + (Math.random()*4-2);
      const w=9+Math.random()*4, d=9+Math.random()*4, h=8+Math.random()*20;
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),
        new THREE.MeshLambertMaterial({color:cols[Math.floor(Math.random()*cols.length)]}));
      b.position.set(x,h/2,z); sc.add(b);
      // ขอบดาดฟ้า + วง helipad ให้เล็งง่าย
      const pad=new THREE.Mesh(new THREE.CircleGeometry(3.2,20),
        new THREE.MeshLambertMaterial({color:0x3d434b}));
      pad.rotation.x=-Math.PI/2; pad.position.set(x,h+.03,z); sc.add(pad);
      const ring=new THREE.Mesh(new THREE.RingGeometry(2.4,3.0,20),
        new THREE.MeshBasicMaterial({color:0xffd54f,side:THREE.DoubleSide}));
      ring.rotation.x=-Math.PI/2; ring.position.set(x,h+.06,z); sc.add(ring);
      list.push({x,z,w,d,h});
    }
    // ลานจอดกลางเมือง (จุดเกิด)
    const basePad=new THREE.Mesh(new THREE.CircleGeometry(5,24),
      new THREE.MeshLambertMaterial({color:0x3d434b}));
    basePad.rotation.x=-Math.PI/2; basePad.position.set(0,.03,0); sc.add(basePad);
    const baseH=new THREE.Mesh(new THREE.RingGeometry(3.4,4.2,24),
      new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));
    baseH.rotation.x=-Math.PI/2; baseH.position.set(0,.06,0); sc.add(baseH);
    worlds[md]={scene:sc, trees:tr, buildings:list};
    return;
  }else{
    // ต้นไม้ตายกิ่งโกร๋น + ป้ายหลุมศพ + ฟักทอง + ดวงไฟวิญญาณ
    const trunkM=new THREE.MeshLambertMaterial({color:0x2e2019});
    const trunkG=new THREE.CylinderGeometry(.22,.42,3.4,6);
    const branchG=new THREE.CylinderGeometry(.08,.16,1.8,5);
    for(let i=0;i<34;i++){
      const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
      if(Math.hypot(x,z)<8) continue;
      const t1=new THREE.Mesh(trunkG,trunkM); t1.position.set(x,1.7,z);
      const b1=new THREE.Mesh(branchG,trunkM);
      b1.position.set(x+.5,2.9,z); b1.rotation.z=-.8+Math.random()*.4;
      const b2=new THREE.Mesh(branchG,trunkM);
      b2.position.set(x-.5,2.5,z); b2.rotation.z=.8-Math.random()*.4;
      sc.add(t1,b1,b2); tr.push({x,z,r:.8});
    }
    const graveG=new THREE.BoxGeometry(.9,1.2,.22);
    const graveM=new THREE.MeshLambertMaterial({color:0x777788});
    for(let i=0;i<22;i++){
      const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
      if(Math.hypot(x,z)<8) continue;
      const g=new THREE.Mesh(graveG,graveM);
      g.position.set(x,.6,z); g.rotation.y=Math.random()*3; g.rotation.z=(Math.random()-.5)*.16;
      sc.add(g); tr.push({x,z,r:.7});
    }
    for(let i=0;i<12;i++){
      const p=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture('🎃'),transparent:true}));
      p.position.set((Math.random()*2-1)*(HALF-5),.55,(Math.random()*2-1)*(HALF-5));
      p.scale.set(1.1,1.1,1); sc.add(p);
    }
    const wispM=new THREE.MeshBasicMaterial({color:0x7cffb0});
    for(let i=0;i<10;i++){
      const w=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),wispM);
      w.position.set((Math.random()*2-1)*(HALF-4),1.4+Math.random()*1.5,(Math.random()*2-1)*(HALF-4));
      sc.add(w);
    }
  }
  worlds[md]={scene:sc, trees:tr};
}

/* ============================================================
   ตัวอักษรในโลก (8.2)
   ============================================================ */
function randPos(minFromPlayer){
  for(let i=0;i<30;i++){
    const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
    if(Math.hypot(x-camera.position.x,z-camera.position.z)>=(minFromPlayer||10)) return {x,z};
  }
  return {x:0,z:0};
}
function spawnLetter(ch){
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:letterTexture(ch),transparent:true}));
  if(M.heli && buildings.length){
    // โหมดเฮลิคอปเตอร์: ตัวอักษรอยู่บนยอดตึก (สุ่มตึก) — ต้องลงจอดเก็บ
    const b=buildings[Math.floor(Math.random()*buildings.length)];
    spr.position.set(b.x,b.h+1.3,b.z);
    spr.scale.set(2.2,2.2,1);                    // ใหญ่ขึ้น มองเห็นจากไกล
  }else{
    const p=randPos(10);
    spr.position.set(p.x,1.15,p.z);
    spr.scale.set(1.5,1.5,1);
  }
  scene.add(spr);
  letters.push({ch,spr,born:performance.now(),baseY:spr.position.y});
}
function spawnLettersForWord(w){ w.en.split('').forEach(spawnLetter); }
/* เติมตัวอักษรที่ยังขาด (ผู้เล่นอาจใช้ตัวอักษรของคำ A ไปประกอบคำ B) */
function ensureCoverage(){
  const worldCnt={}; letters.forEach(l=>worldCnt[l.ch]=(worldCnt[l.ch]||0)+1);
  const haveCnt=Object.assign({},inv);
  words.forEach(w=>{
    const need={}; w.en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
    Object.keys(need).forEach(ch=>{
      let miss=need[ch]-(haveCnt[ch]||0)-(worldCnt[ch]||0);
      const useFromInv=Math.min(need[ch],haveCnt[ch]||0);
      haveCnt[ch]=(haveCnt[ch]||0)-useFromInv;
      while(miss-->0 && letters.length<90){ spawnLetter(ch); worldCnt[ch]=(worldCnt[ch]||0)+1; }
    });
  });
}
function relocateLetters(now){
  letters.forEach(l=>{
    if(now-l.born>=RELOCATE_MS){
      if(M.heli && buildings.length){
        const b=buildings[Math.floor(Math.random()*buildings.length)];
        l.spr.position.set(b.x,b.h+1.3,b.z);
      }else{
        const p=randPos(10);
        l.spr.position.set(p.x,1.15,p.z);
      }
      l.baseY=l.spr.position.y;
      l.born=now;
    }
  });
}
function removeLetter(i){
  const l=letters[i];
  scene.remove(l.spr); l.spr.material.dispose();
  letters.splice(i,1);
}

/* ============================================================
   ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
   ============================================================ */
function tryCompleteWords(){
  let done=true;
  while(done){
    done=false;
    for(let i=0;i<words.length;i++){
      const w=words[i];
      const need={}; w.en.split('').forEach(ch=>need[ch]=(need[ch]||0)+1);
      if(Object.keys(need).every(ch=>(inv[ch]||0)>=need[ch])){
        Object.keys(need).forEach(ch=>{ inv[ch]-=need[ch]; if(inv[ch]<=0) delete inv[ch]; });
        completeWord(i); done=true; break;
      }
    }
  }
}
function completeWord(i){
  const w=words[i];
  words.splice(i,1);
  doneList().push(w.en);
  addCoins(M.reward);
  sessionCoins+=M.reward; sessionWords++;
  sfx.levelup();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(60);
  showBanner(`🎉 <b>${escapeHTML(w.en.toUpperCase())}</b> = ${escapeHTML(w.th)}<br><span class="adv-ban-coin">+${M.reward} 🪙</span>`);
  const fresh=pickWords(1);                 // เติมคำใหม่ให้ครบ 10 (8.4)
  fresh.forEach(nw=>{ words.push(nw); spawnLettersForWord(nw); });
  ensureCoverage();
  saveState();
  if(myRef) sendPos(true);                  // ประกาศคะแนนใหม่ขึ้นกระดานทุกเครื่องทันที
  renderHudWords(); renderHudInv(); renderHudTop(); renderBoard();
}

/* ============================================================
   โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
   ============================================================ */
function spawnMonster(){
  if(monsters.length>=M.monMax) return;
  const emo=M.monEmoji[Math.floor(Math.random()*M.monEmoji.length)];
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture(emo),transparent:true}));
  const p=randPos(22);
  spr.position.set(p.x,1.2,p.z); spr.scale.set(2.2,2.2,1);
  scene.add(spr);
  monsters.push({spr,hp:M.monHp,tgt:randPos(0),wanderAt:0,hitAt:0});
}
function killMonster(i){
  const m=monsters[i];
  scene.remove(m.spr); m.spr.material.dispose();
  monsters.splice(i,1);
  addCoins(MONSTER_REWARD); sessionCoins+=MONSTER_REWARD;
  sfx.coin();
  saveState(); renderHudTop();
}
function tickMonsters(dt,now){
  const px=camera.position.x, pz=camera.position.z;
  monsters.forEach(m=>{
    const mp=m.spr.position;
    const d=Math.hypot(px-mp.x,pz-mp.z);
    let tx,tz,sp;
    if(d<15){ tx=px; tz=pz; sp=M.monSpeed; }
    else{
      if(now>m.wanderAt){ m.tgt=randPos(0); m.wanderAt=now+4000+Math.random()*4000; }
      tx=m.tgt.x; tz=m.tgt.z; sp=M.monSpeed*.45;
    }
    const dd=Math.hypot(tx-mp.x,tz-mp.z);
    if(dd>.3){ mp.x+=(tx-mp.x)/dd*sp*dt; mp.z+=(tz-mp.z)/dd*sp*dt; }
    mp.y=1.2+Math.sin(now/300+mp.x)*0.15;
    if(d<1.5 && now-m.hitAt>1200){
      m.hitAt=now;
      damagePlayer(M.monDmg);
      const kx=(px-mp.x)/(d||1), kz=(pz-mp.z)/(d||1);
      movePlayer(kx*1.2, kz*1.2);
    }
  });
}
function damagePlayer(n){
  if(!running) return;
  hp=Math.max(0,hp-n);
  sfx.wrong();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(80);
  dmgFlashEl.classList.remove('on'); void dmgFlashEl.offsetWidth; dmgFlashEl.classList.add('on');
  renderHudTop();
  if(hp<=0) knockedOut();
}

/* ---------- ยิง (เฉพาะโหมด adv) ---------- */
function shoot(){
  const now=performance.now();
  if(!running || !M.shoot || now-lastShot<SHOOT_GAP_MS) return;
  lastShot=now;
  sfx.select();
  const mesh=new THREE.Mesh(
    new THREE.SphereGeometry(.14,8,6),
    new THREE.MeshBasicMaterial({color:0xffe13a}));
  mesh.position.copy(camera.position);
  const dir=new THREE.Vector3(); camera.getWorldDirection(dir);
  mesh.position.addScaledVector(dir,.6);
  scene.add(mesh);
  shots.push({mesh,dir,life:1.4});
}
function tickShots(dt){
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];
    s.mesh.position.addScaledVector(s.dir,30*dt);
    s.life-=dt;
    let hit=false;
    for(let j=monsters.length-1;j>=0;j--){
      if(s.mesh.position.distanceTo(monsters[j].spr.position)<1.2){
        hit=true;
        monsters[j].hp--;
        if(monsters[j].hp<=0) killMonster(j);
        else{ sfx.correct(); monsters[j].spr.material.color.set(0xff8080);
              setTimeout(((m)=>()=>{ if(m.spr.material) m.spr.material.color.set(0xffffff); })(monsters[j]),150); }
        break;
      }
    }
    if(hit || s.life<=0){
      scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose();
      shots.splice(i,1);
    }
  }
}

/* ============================================================
   โหมด haunt: ผีโผล่ 20 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
   ============================================================ */
function spawnGhost(first){
  const emo=M.ghostEmoji[Math.floor(Math.random()*M.ghostEmoji.length)];
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture(emo),transparent:true,opacity:0}));
  spr.scale.set(2.6,2.6,1);
  scene.add(spr);
  const g={spr,born:0,hunting:false,tgt:{x:0,z:0},wanderAt:0,wailAt:0};
  respawnGhost(g, first?28:0);              // ตอนเริ่มเกม บังคับเกิดไกลผู้เล่นก่อน (ยังไม่ทันตั้งตัว)
  monsters.push(g);
}
function respawnGhost(g, minDist){
  const p=randPos(minDist!==undefined?minDist:0);
  g.spr.position.set(p.x,1.35,p.z);
  g.born=performance.now();
  g.tgt=randPos(0); g.wanderAt=0;
  const d=Math.hypot(p.x-camera.position.x,p.z-camera.position.z);
  const wasHunting=g.hunting;
  g.hunting=d<M.huntR;
  if(g.hunting && !wasHunting && running){       // ลุ้นตรงนี้: ผีสุ่มเกิดใกล้เรา!
    HSound.whoosh();
    if(state.haptic!==false && navigator.vibrate) navigator.vibrate([60,40,60]);
  }
}
function tickGhosts(dt,now){
  const px=camera.position.x, pz=camera.position.z;
  let hunted=null;
  monsters.forEach(g=>{
    const life=now-g.born;
    if(life>=M.ghostLife){ respawnGhost(g); return; }     // ครบ 20 วิ → หายไปเกิดที่ใหม่ (รอด!)
    // โปร่งใสตอนเกิด/ก่อนหาย (เตือนล่วงหน้า)
    const fadeIn=Math.min(1,life/600), fadeOut=Math.min(1,(M.ghostLife-life)/600);
    g.spr.material.opacity=.92*Math.min(fadeIn,fadeOut);
    const mp=g.spr.position;
    const d=Math.hypot(px-mp.x,pz-mp.z);
    if(!g.hunting && d<M.seeR){                            // เดินเข้าไปใกล้ผีเอง → มันเห็นเรา
      g.hunting=true;
      HSound.whoosh();
      if(state.haptic!==false && navigator.vibrate) navigator.vibrate([60,40,60]);
    }
    if(g.hunting){
      const dd=d||1;
      mp.x+=(px-mp.x)/dd*M.ghostSpeed*dt;
      mp.z+=(pz-mp.z)/dd*M.ghostSpeed*dt;
      if(!hunted || (M.ghostLife-life)<hunted.left) hunted={left:M.ghostLife-life, dist:d};
      if(now-g.wailAt>2600){ g.wailAt=now; HSound.wail(); }
    }else{
      if(now>g.wanderAt){ g.tgt=randPos(0); g.wanderAt=now+5000+Math.random()*5000; }
      const dd=Math.hypot(g.tgt.x-mp.x,g.tgt.z-mp.z);
      if(dd>.3){ mp.x+=(g.tgt.x-mp.x)/dd*.8*dt; mp.z+=(g.tgt.z-mp.z)/dd*.8*dt; }
    }
    mp.y=1.35+Math.sin(now/260+mp.x)*.22;
    if(d<1.25 && g.spr.material.opacity>.5) caught();      // โดนจับ = จบทันที
  });
  // HUD นับถอยหลังหนี + เสียงหัวใจเต้นตามความใกล้
  if(hunted && running){
    hudHuntEl.style.display='block';
    hudHuntEl.textContent=`👻 หนี! อีก ${Math.ceil(hunted.left/1000)} วิ ผีจะหายไป`;
    overlayEl.classList.add('adv-hunted');
    HSound.heartbeat(hunted.dist);
  }else{
    hudHuntEl.style.display='none';
    overlayEl.classList.remove('adv-hunted');
    HSound.heartbeat(null);
  }
}

/* ---------- Jump scare + game over (ผู้ใช้เคาะ: เต็มที่) ---------- */
function caught(){
  if(!running) return;
  running=false;
  state.advHurt=true; saveState();
  HSound.heartbeat(null);
  HSound.scream();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(400);
  scareEl.classList.add('on');
  overlayEl.classList.add('adv-shake');
  setTimeout(()=>{
    scareEl.classList.remove('on');
    overlayEl.classList.remove('adv-shake');
    banEl.innerHTML=`<div class="adv-ko">👻 โดนผีจับแล้ว!!<br>
      <small>ต้องกลับไปรักษาตัวที่ Lobby ค่ารักษา 🪙${fmtNum(CURE_COST)}<br>
      รอบนี้เก็บได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙</small><br>
      <button class="adv-ko-btn" id="adv-ko-exit">🏠 กลับ Lobby</button></div>`;
    banEl.classList.add('show','stay');
    document.getElementById('adv-ko-exit').addEventListener('click',()=>exitWorld());
  },1500);
}

/* ---------- พลังหมดโหมด adv (8.5) ---------- */
function knockedOut(){
  running=false;
  state.advHurt=true; saveState();
  if(M.heli) HeliSound.stop();
  banEl.innerHTML=`<div class="adv-ko">${M.koTitle||'💫 พลังหมดแล้ว!'}<br>
    <small>ต้องกลับไปรักษาตัวที่ Lobby ค่ารักษา 🪙${fmtNum(CURE_COST)}<br>
    รอบนี้เก็บได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙</small><br>
    <button class="adv-ko-btn" id="adv-ko-exit">🏠 กลับ Lobby</button></div>`;
  banEl.classList.add('show','stay');
  document.getElementById('adv-ko-exit').addEventListener('click',()=>exitWorld());
}

/* ============================================================
   เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
   ถ้ามีไฟล์ sound/haunt_ambient.mp3 / haunt_chase.mp3 / haunt_scare.mp3
   (เจนจาก Suno — PROMPTS_SOUND.md) จะใช้ไฟล์จริงแทนอัตโนมัติ
   ============================================================ */
const HSound={
  ctx:null, master:null, ambNodes:[], eerieTimer:0, hbTimer:0, hbRate:0,
  files:{amb:null,chase:null,scare:null}, probed:false, chaseOn:false,
  probe(){
    if(this.probed) return; this.probed=true;
    // probe ด้วย Audio element (ห้าม fetch local — กติกาเดียวกับ probeImages)
    [['amb','sound/haunt_ambient.mp3'],['chase','sound/haunt_chase.mp3'],['scare','sound/haunt_scare.mp3']].forEach(([k,src])=>{
      const a=new Audio();
      a.addEventListener('canplaythrough',()=>{ this.files[k]=a; },{once:true});
      a.preload='auto'; a.src=src;
    });
  },
  ensure(){
    if(!this.ctx){
      this.ctx=new (window.AudioContext||window.webkitAudioContext)();
      this.master=this.ctx.createGain();
      this.master.gain.value=.9;
      this.master.connect(this.ctx.destination);
    }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
  },
  noiseBuf(){
    if(this._nb) return this._nb;
    const len=this.ctx.sampleRate*2, buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    this._nb=buf; return buf;
  },
  startAmbient(){
    if(!state.sound) return;
    this.probe();
    if(this.files.amb){ this.files.amb.loop=true; this.files.amb.volume=.55; this.files.amb.play().catch(()=>{}); return; }
    this.ensure();
    // ลมหอน: white noise → lowpass + LFO ขยับความถี่
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf(); n.loop=true;
    const lp=this.ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=260; lp.Q.value=1.2;
    const ng=this.ctx.createGain(); ng.gain.value=.05;
    const lfo=this.ctx.createOscillator(); lfo.frequency.value=.13;
    const lfoG=this.ctx.createGain(); lfoG.gain.value=140;
    lfo.connect(lfoG); lfoG.connect(lp.frequency);
    n.connect(lp); lp.connect(ng); ng.connect(this.master);
    n.start(); lfo.start();
    // drone ทุ้มสองเสียงเพี้ยนกันนิดๆ (หลอนแบบคลาสสิก)
    const o1=this.ctx.createOscillator(); o1.type='sine'; o1.frequency.value=55;
    const o2=this.ctx.createOscillator(); o2.type='sine'; o2.frequency.value=56.7;
    const og=this.ctx.createGain(); og.gain.value=.035;
    o1.connect(og); o2.connect(og); og.connect(this.master);
    o1.start(); o2.start();
    this.ambNodes=[n,lfo,o1,o2,og,ng];
    // โน้ตหลอนสุ่มเป็นระยะ
    this.eerieTimer=setInterval(()=>{ if(state.sound) this.eerie(); },9000+Math.random()*7000);
  },
  eerie(){
    this.ensure();
    const o=this.ctx.createOscillator(); o.type='sine';
    const f=300+Math.random()*500;
    o.frequency.setValueAtTime(f,this.ctx.currentTime);
    o.frequency.linearRampToValueAtTime(f*.82,this.ctx.currentTime+2.2);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.0001,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.03,this.ctx.currentTime+.7);
    g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+2.4);
    o.connect(g); g.connect(this.master);
    o.start(); o.stop(this.ctx.currentTime+2.5);
  },
  wail(){                                    // เสียงผีหวีดตอนไล่
    if(!state.sound) return;
    this.ensure();
    const o=this.ctx.createOscillator(); o.type='triangle';
    o.frequency.setValueAtTime(700,this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(320,this.ctx.currentTime+.9);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.06,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.95);
    o.connect(g); g.connect(this.master);
    o.start(); o.stop(this.ctx.currentTime+1);
  },
  whoosh(){                                  // ผีโผล่ใกล้ (เตือนให้หนี)
    if(!state.sound) return;
    this.ensure();
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=2;
    bp.frequency.setValueAtTime(1400,this.ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(180,this.ctx.currentTime+.55);
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.22,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.6);
    n.connect(bp); bp.connect(g); g.connect(this.master);
    n.start(); n.stop(this.ctx.currentTime+.65);
  },
  heartbeat(dist){                           // dist=null → หยุด · ยิ่งใกล้ยิ่งเร็ว
    if(dist===null){
      if(this.hbTimer){ clearInterval(this.hbTimer); this.hbTimer=0; this.hbRate=0; }
      if(this.files.chase && this.chaseOn){ this.files.chase.pause(); this.chaseOn=false; }
      return;
    }
    if(!state.sound) return;
    if(this.files.chase){
      if(!this.chaseOn){ this.files.chase.loop=true; this.files.chase.volume=.7; this.files.chase.play().catch(()=>{}); this.chaseOn=true; }
      return;
    }
    const rate=dist<6?380:dist<12?560:800;
    if(rate===this.hbRate) return;
    this.hbRate=rate;
    if(this.hbTimer) clearInterval(this.hbTimer);
    const thump=(when,vol)=>{
      const o=this.ctx.createOscillator(); o.type='sine'; o.frequency.value=52;
      const g=this.ctx.createGain();
      g.gain.setValueAtTime(vol,when);
      g.gain.exponentialRampToValueAtTime(.001,when+.14);
      o.connect(g); g.connect(this.master);
      o.start(when); o.stop(when+.15);
    };
    this.ensure();
    this.hbTimer=setInterval(()=>{
      if(!state.sound) return;
      const t=this.ctx.currentTime;
      thump(t,.24); thump(t+.17,.15);        // ตุบ-ตับ
    },rate);
  },
  scream(){                                  // jump scare!
    if(!state.sound) return;
    if(this.files.scare){ this.files.scare.currentTime=0; this.files.scare.volume=1; this.files.scare.play().catch(()=>{}); return; }
    this.ensure();
    const t=this.ctx.currentTime;
    const o1=this.ctx.createOscillator(); o1.type='sawtooth';
    o1.frequency.setValueAtTime(820,t); o1.frequency.exponentialRampToValueAtTime(140,t+1.1);
    const o2=this.ctx.createOscillator(); o2.type='square';
    o2.frequency.setValueAtTime(666,t); o2.frequency.exponentialRampToValueAtTime(97,t+1.1);
    const n=this.ctx.createBufferSource(); n.buffer=this.noiseBuf();
    const g=this.ctx.createGain();
    g.gain.setValueAtTime(.5,t);
    g.gain.exponentialRampToValueAtTime(.001,t+1.25);
    o1.connect(g); o2.connect(g); n.connect(g); g.connect(this.master);
    o1.start(t); o2.start(t); n.start(t);
    o1.stop(t+1.3); o2.stop(t+1.3); n.stop(t+1.3);
  },
  stopAll(){
    this.heartbeat(null);
    if(this.eerieTimer){ clearInterval(this.eerieTimer); this.eerieTimer=0; }
    this.ambNodes.forEach(nd=>{ try{ nd.stop ? nd.stop() : nd.disconnect(); }catch(e){} });
    this.ambNodes=[];
    if(this.files.amb){ this.files.amb.pause(); }
    if(this.files.chase){ this.files.chase.pause(); this.chaseOn=false; }
  },
};

/* ============================================================
   Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
   /world/<map>/<uid> = {n,av,x,z,yaw,ts} · onDisconnect ลบตัวเอง
   letters/monster เป็นของใครของมัน (ไม่ sync — เห็นกันอย่างเดียว)
   ============================================================ */
function netReady(){
  return typeof Online!=='undefined' && Online.ready && Online.db
      && typeof Auth!=='undefined' && Auth.user;
}
function netJoin(){
  if(!netReady()) return;
  const uid=onlineKey();
  worldRef=Online.db.ref('world/'+mode);
  myRef=worldRef.child(uid);
  myRef.onDisconnect().remove();
  lastSent=null; sendPos(true);
  worldRef.on('child_added',onPeerData);
  worldRef.on('child_changed',onPeerData);
  worldRef.on('child_removed',s=>removePeer(s.key));
  Voice.join();
  podiumJoin();
}
function sendPos(force){
  if(!myRef) return;
  const now=performance.now();
  if(!force && now-lastNetSend<NET_SEND_MS) return;
  const x=Math.round(camera.position.x*10)/10, z=Math.round(camera.position.z*10)/10,
        y=Math.round(yaw*100)/100;
  if(!force && lastSent && lastSent.x===x && lastSent.z===z && lastSent.yaw===y) return;
  lastNetSend=now; lastSent={x,z,yaw:y};
  const payload={
    n:onlineDisplayName(), av:state.playerAvatar||'',
    x, z, yaw:y, m:Voice.mic?1:0, w:sessionWords, ts:firebase.database.ServerValue.TIMESTAMP,
  };
  if(M.heli) payload.y=Math.round(camera.position.y*10)/10;   // ความสูงบิน (โหมดเฮลิคอปเตอร์)
  // แนบแชทลอยหัวระหว่างยังสด (ct = Date.now คงที่ต่อข้อความ — ฝั่งรับใช้แยกข้อความใหม่/เก่า)
  if(myChat && Date.now()-myChat.ts<BUBBLE_MS+1000){ payload.c=myChat.text; payload.ct=myChat.ts; }
  myRef.set(payload).catch(()=>{});
}
/* ส่งแชทลอยหัว: กรองคำหยาบ + echo ของตัวเองมุมล่าง */
function sendChat(text){
  text=String(text||'').trim().slice(0,CHAT_MAX);
  if(!text) return;
  if(typeof nameHasBadWord==='function' && nameHasBadWord(text)){
    sfx.wrong(); toast('⚠️ ข้อความมีคำไม่สุภาพ ลองพิมพ์ใหม่นะ'); return;
  }
  myChat={text, ts:Date.now()};
  if(myRef) sendPos(true);
  selfMsgEl.textContent='💬 '+text;
  selfMsgEl.classList.add('on');
  clearTimeout(selfMsgEl._tm);
  selfMsgEl._tm=setTimeout(()=>selfMsgEl.classList.remove('on'),BUBBLE_MS);
  sfx.select();
}
function toggleChatBox(open){
  const showing=getComputedStyle(chatBoxEl).display!=='none';   // CSS ตั้ง none ไว้ inline ยังว่าง — ต้องดู computed
  const want=open===undefined?!showing:open;
  chatBoxEl.style.display=want?'flex':'none';
  if(want){
    if(document.pointerLockElement) document.exitPointerLock();
    chatInputEl.value='';
    setTimeout(()=>chatInputEl.focus(),50);
  }
}
function onPeerData(snap){
  const uid=snap.key;
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  const d=snap.val()||{};
  if(typeof d.x!=='number' || typeof d.z!=='number') return;
  const py=(typeof d.y==='number')?d.y:1.5;
  let p=peers[uid];
  if(!p){
    p=peers[uid]={spr:makePeerSprite(d.n,d.av), cur:{x:d.x,z:d.z,y:py}, tgt:{x:d.x,z:d.z,y:py}, n:d.n||'เพื่อน'};
    p.spr.position.set(d.x,py,d.z);
    scene.add(p.spr);
    showBanner(`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> อยู่ในโลกนี้ด้วย!`);
    tinvCheck(uid);
    Voice.onPeer(uid);
  }
  p.tgt={x:d.x,z:d.z,y:py};
  // 🏆 กระดานคะแนน: จำนวนคำที่เพื่อนประกอบได้รอบนี้ (field w) — เปลี่ยนเมื่อไหร่วาดใหม่
  const w=typeof d.w==='number'?d.w:0;
  if(p.w!==w){ p.w=w; renderBoard(); }
  // ไอคอน 🎤 เหนือหัวคนที่เปิดไมค์ (เด็กเห็นชัดว่าเดินเข้าใกล้ใครแล้วคุยได้)
  if(d.m===1 && !p.micSpr){
    p.micSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture('🎤'),transparent:true}));
    p.micSpr.scale.set(.7,.7,1);
    p.micSpr.position.set(p.cur.x,2.72,p.cur.z);
    scene.add(p.micSpr);
  }else if(d.m!==1 && p.micSpr){
    scene.remove(p.micSpr); p.micSpr.material.dispose(); p.micSpr=null;   // texture 🎤 อยู่ใน cache ห้าม dispose map
  }
  // แชทลอยหัว: ct เปลี่ยน = ข้อความใหม่ (ct คงที่ต่อข้อความ ฝั่งส่งแนบซ้ำได้ไม่เด้งซ้ำ)
  if(typeof d.ct==='number' && typeof d.c==='string' && d.c && p.lastCt!==d.ct){
    p.lastCt=d.ct;
    showPeerBubble(p, d.c);
  }
}
function removePeer(uid){
  const p=peers[uid];
  if(!p) return;
  removePeerBubble(p);
  if(p.micSpr){ scene.remove(p.micSpr); p.micSpr.material.dispose(); p.micSpr=null; }
  Voice.drop(uid);
  scene.remove(p.spr); p.spr.material.map.dispose(); p.spr.material.dispose();
  delete peers[uid];
  renderBoard();
}
function netLeave(){
  podiumLeave();
  Voice.leave();
  if(worldRef){ worldRef.off('child_added'); worldRef.off('child_changed'); worldRef.off('child_removed'); }
  if(myRef){ myRef.remove().catch(()=>{}); }
  Object.keys(peers).forEach(removePeer);
  worldRef=null; myRef=null;
}
function tickPeers(dt,now){
  Object.keys(peers).forEach(uid=>{
    const p=peers[uid];
    const k=Math.min(1,dt*6);                     // lerp นุ่มๆ ระหว่างแพ็กเก็ต
    p.cur.x+=(p.tgt.x-p.cur.x)*k;
    p.cur.z+=(p.tgt.z-p.cur.z)*k;
    p.cur.y+=((p.tgt.y||1.5)-(p.cur.y||1.5))*k;
    const baseY=M.heli?(p.cur.y||1.5):1.5;        // เฮลิคอปเตอร์เพื่อนบินตามความสูงจริง
    p.spr.position.set(p.cur.x,baseY+Math.sin(now/280+p.cur.x)*.05,p.cur.z);
    if(p.bubble){
      if(now>p.bubble.until) removePeerBubble(p);
      else p.bubble.spr.position.set(p.cur.x,baseY+1.6,p.cur.z);   // ลอยตามหัว
    }
    if(p.micSpr) p.micSpr.position.set(p.cur.x,baseY+1.22+Math.sin(now/300)*.06,p.cur.z);
    // เสียงพูดเบาลงตามระยะห่างในโลก (สไตล์ Roblox) — ไกลเกิน ~45m = เงียบ
    const en=Voice.pcs[uid];
    if(en && en.audio && !en.audio.muted){
      const d=Math.hypot(p.cur.x-camera.position.x,p.cur.z-camera.position.z);
      en.audio.volume=Math.max(0,Math.min(1,1.15-d/45));
    }
  });
}

/* ============================================================
   Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
   Firebase ใช้แค่ signaling: /rtc/<map>/<toUid>/<msgId>={f,t,d,ts}
   (ผู้รับอ่าน+ลบกล่องตัวเอง · ผู้ส่ง push ได้เฉพาะ f=ตัวเอง)
   🎤 ไมค์ปิดเป็นค่าเริ่มต้นทุกครั้งที่เข้า (ความปลอดภัยเด็ก — ไม่จำข้ามรอบ)
   🔊 ลำโพง + โหมด (all=ทุกคนใน map / friends=เฉพาะเพื่อนที่ invite กันใน map นี้)
   จำใน state.voiceSpk/voiceMode · เสียงเบาลงตามระยะห่างในโลก (สไตล์ Roblox)
   ============================================================ */
const RTC_CFG={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}]};
function tinvLinked(uid){
  const sent=state.tinvSent && state.tinvSent[uid];
  const got=(typeof Online!=='undefined' && Online.tinv)?Online.tinv[uid]:null;
  return (sent && sent.map===mode) || (got && got.map===mode);
}
const Voice={
  mic:false, spk:true, vmode:'all',
  stream:null, pcs:{}, inRef:null,
  roomMuted:false, classRef:null, _prevRoom:null,   // 👩‍🏫 ครูปิดเสียงทั้งห้อง (/class/<map>/muteAll)
  allowed(uid){ return this.vmode==='all' || tinvLinked(uid); },
  join(){
    if(!netReady()) return;
    this.spk=state.voiceSpk!==false;
    this.vmode=state.voiceMode==='friends'?'friends':'all';
    this.mic=false;                                        // ปิดไมค์เสมอตอนเข้า
    this.inRef=Online.db.ref('rtc/'+mode+'/'+onlineKey());
    this.inRef.remove().catch(()=>{});                     // ล้างข้อความค้างจากรอบก่อน
    this.inRef.on('child_added',(s)=>{ const m=s.val(); s.ref.remove().catch(()=>{}); if(m) this.handle(m); });
    // 👩‍🏫 ฟังสถานะ "ครูปิดเสียงทั้งห้อง" ของ map นี้ (สถานะค้างอยู่ใน DB — เด็กเข้าทีหลังก็โดนล็อกด้วย)
    this._prevRoom=null;
    this.classRef=Online.db.ref('class/'+mode+'/muteAll');
    this.classRef.on('value',(s)=>{
      const v=s.val();
      const on=!!(v && v.on);
      this.roomMuted=on;
      const teacher=(typeof isTeacher==='function' && isTeacher());
      if(on && !teacher && this.mic) this.setMic(false);   // ตัดไมค์เด็กที่เปิดค้างทันที
      if(this._prevRoom!==null || on){                     // เข้ามาเจอห้องปิดอยู่ก็แจ้ง / สถานะเปลี่ยนก็แจ้ง
        if(this._prevRoom!==on){
          showBanner(on?'👩‍🏫 <b>คุณครูปิดเสียงทั้งห้อง</b><br><small>ไมค์ทุกคนถูกปิดชั่วคราว</small>'
                       :'👩‍🏫 <b>คุณครูเปิดเสียงห้องแล้ว</b><br><small>เปิดไมค์คุยกันได้เลย</small>');
        }
      }
      this._prevRoom=on;
      updateVoiceBtns();
    });
    updateVoiceBtns();
  },
  leave(){
    if(this.classRef){ this.classRef.off(); this.classRef=null; }
    this.roomMuted=false; this._prevRoom=null;
    if(this.inRef){ this.inRef.off(); this.inRef.remove().catch(()=>{}); this.inRef=null; }
    Object.keys(this.pcs).forEach(uid=>this.drop(uid));
    if(this.stream){ this.stream.getTracks().forEach(tr=>tr.stop()); this.stream=null; }  // คืนไมค์ให้เครื่อง
    this.mic=false;
  },
  sig(uid,t,d){
    if(!netReady()) return;
    Online.db.ref('rtc/'+mode+'/'+uid).push({
      f:onlineKey(), t, d:JSON.stringify(d), ts:firebase.database.ServerValue.TIMESTAMP,
    }).catch(()=>{});
  },
  ensure(uid){
    if(this.pcs[uid]) return this.pcs[uid];
    const pc=new RTCPeerConnection(RTC_CFG);
    const en=this.pcs[uid]={pc, audio:null, sender:null, iceQ:[], haveRemote:false};
    const tr=pc.addTransceiver('audio',{direction:'sendrecv'});   // ช่องเสียงมีเสมอ — สลับ track ทีหลัง ไม่ต้อง renegotiate
    en.sender=tr.sender;
    if(this.mic && this.stream) tr.sender.replaceTrack(this.stream.getAudioTracks()[0]).catch(()=>{});
    pc.onicecandidate=e=>{ if(e.candidate) this.sig(uid,'ice',e.candidate.toJSON()); };
    pc.ontrack=e=>{
      if(!en.audio){ en.audio=document.createElement('audio'); en.audio.autoplay=true; document.body.appendChild(en.audio); }
      en.audio.srcObject=e.streams[0];
      en.audio.muted=!this.spk;
    };
    return en;
  },
  drop(uid){
    const en=this.pcs[uid];
    if(!en) return;
    try{ en.pc.close(); }catch(e){}
    if(en.audio){ en.audio.srcObject=null; en.audio.remove(); }
    delete this.pcs[uid];
  },
  onPeer(uid){                                             // เพื่อนโผล่ใน map → ฝั่ง uid น้อยกว่าเป็นคนชวนต่อสาย (กันชนกัน)
    if(!this.inRef || !this.allowed(uid) || this.pcs[uid]) return;
    if(onlineKey()<uid) this.call(uid);
  },
  async call(uid){
    const en=this.ensure(uid);
    try{
      const of=await en.pc.createOffer();
      await en.pc.setLocalDescription(of);
      this.sig(uid,'offer',en.pc.localDescription.toJSON());
    }catch(e){}
  },
  async handle(m){
    const uid=m.f;
    let d; try{ d=JSON.parse(m.d); }catch(e){ return; }
    if(m.t==='offer'){
      if(!this.allowed(uid)) return;                       // โหมดเพื่อน: ไม่รับสายคนนอก
      const en=this.ensure(uid);
      try{
        await en.pc.setRemoteDescription(d); en.haveRemote=true;
        en.iceQ.splice(0).forEach(c=>en.pc.addIceCandidate(c).catch(()=>{}));
        const an=await en.pc.createAnswer();
        await en.pc.setLocalDescription(an);
        this.sig(uid,'answer',en.pc.localDescription.toJSON());
      }catch(e){}
    }else if(m.t==='answer'){
      const en=this.pcs[uid]; if(!en) return;
      try{ await en.pc.setRemoteDescription(d); en.haveRemote=true;
           en.iceQ.splice(0).forEach(c=>en.pc.addIceCandidate(c).catch(()=>{})); }catch(e){}
    }else if(m.t==='ice'){
      const en=this.pcs[uid]; if(!en) return;
      if(en.haveRemote) en.pc.addIceCandidate(d).catch(()=>{});
      else en.iceQ.push(d);
    }
  },
  async setMic(on){
    if(on && this.roomMuted && !(typeof isTeacher==='function' && isTeacher())){
      sfx.wrong(); toast('👩‍🏫 คุณครูปิดเสียงห้องอยู่ — เปิดไมค์ไม่ได้ตอนนี้นะ'); return;
    }
    if(on && !this.stream){
      try{ this.stream=await navigator.mediaDevices.getUserMedia({audio:true}); }
      catch(e){ sfx.wrong(); toast('🎤 เปิดไมค์ไม่สำเร็จ — ต้องกด "อนุญาต" ไมโครโฟนในเบราว์เซอร์นะ'); updateVoiceBtns(); return; }
    }
    this.mic=on;
    const track=on&&this.stream?this.stream.getAudioTracks()[0]:null;
    Object.values(this.pcs).forEach(en=>{ if(en.sender) en.sender.replaceTrack(track).catch(()=>{}); });
    if(myRef) sendPos(true);                               // ประกาศสถานะไมค์ (ไอคอน 🎤 เหนือหัว) ทันที
    showBanner(on?'🎤 <b>เปิดไมค์แล้ว</b><br><small>เพื่อนใน map ได้ยินเสียงหนู</small>'
                 :'🎤 <b>ปิดไมค์แล้ว</b><br><small>ไม่มีใครได้ยินเสียงหนู</small>');
    updateVoiceBtns();
  },
  /* 👩‍🏫 ครูสลับปิด/เปิดเสียงทั้งห้อง (เฉพาะบัญชีใน TEACHER_EMAILS — auth.js) */
  toggleRoomMute(){
    if(!this.classRef){ sfx.wrong(); toast('⚠️ ยังไม่ได้เชื่อมต่อออนไลน์ — สั่งปิดเสียงห้องไม่ได้'); return; }
    const on=!this.roomMuted;
    this.classRef.set({on, by:onlineDisplayName(), ts:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{});
  },
  setSpk(on){
    this.spk=on; state.voiceSpk=on; saveState();
    Object.values(this.pcs).forEach(en=>{ if(en.audio) en.audio.muted=!on; });
    updateVoiceBtns();
  },
  setMode(m){
    this.vmode=m; state.voiceMode=m; saveState();
    Object.keys(this.pcs).forEach(uid=>{ if(!this.allowed(uid)) this.drop(uid); });   // ตัดสายคนนอกทันที
    Object.keys(peers).forEach(uid=>this.onPeer(uid));                                // ต่อสายที่ขาด (ฝั่งเราเป็นผู้ชวน)
    showBanner(m==='friends'?'👥 <b>คุยเฉพาะเพื่อนที่ชวนกัน</b><br><small>ได้ยิน/พูดเฉพาะเพื่อนที่ invite กันใน map นี้</small>'
                            :'🌐 <b>คุยกับทุกคนใน map</b>');
    updateVoiceBtns();
  },
};
function updateVoiceBtns(){
  const mic=document.getElementById('adv-mic'), spk=document.getElementById('adv-spk'),
        vm=document.getElementById('adv-vmode'), tm=document.getElementById('adv-tmute');
  if(!mic) return;
  const teacher=(typeof isTeacher==='function' && isTeacher());
  const locked=Voice.roomMuted && !teacher;
  mic.textContent=locked?'🎤 ครูปิด':(Voice.mic?'🎤 เปิด':'🎤 ปิด');
  mic.classList.toggle('v-off',!Voice.mic);
  mic.classList.toggle('v-lock',locked);
  spk.textContent=Voice.spk?'🔊 เปิด':'🔇 ปิด';
  spk.classList.toggle('v-off',!Voice.spk);
  vm.textContent=Voice.vmode==='friends'?'👥 เพื่อน':'🌐 ทุกคน';
  tm.style.display=teacher?'block':'none';
  tm.textContent=Voice.roomMuted?'👩‍🏫 เปิดเสียงห้อง':'👩‍🏫 ปิดเสียงห้อง';
  tm.classList.toggle('v-muting',Voice.roomMuted);
  const pb=document.getElementById('adv-podbtn');
  if(pb) pb.style.display=teacher?'block':'none';
}

/* ============================================================
   🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
   ครู snapshot อันดับ top 3 เขียนขึ้น DB → ทุกเครื่องเห็นโพเดียม 🥇🥈🥉
   + แตรฉลอง · คนติดโพเดียมรับโบนัส (เช็ก uid ตัวเอง) · จบพิธีคะแนน
   รีเซ็ตเริ่มรอบใหม่ · ครูลบ node ใน 15 วิ + กันเล่นซ้ำด้วย id ในหน่วยความจำ
   ============================================================ */
const PODIUM_BONUS=[100,50,25];       // โบนัสที่ 1/2/3
let podiumRef=null, lastPodiumId=0;
function podiumJoin(){
  if(!netReady()) return;
  podiumRef=Online.db.ref('class/'+mode+'/podium');
  podiumRef.on('value',(s)=>{
    const v=s.val();
    if(!v || typeof v.id!=='number' || v.id===lastPodiumId) return;
    if(Math.abs(Date.now()-v.id)>5*60*1000) return;   // พิธีเก่าค้าง DB — ไม่เล่นซ้ำ
    lastPodiumId=v.id;
    showPodium(v);
  });
}
function podiumLeave(){ if(podiumRef){ podiumRef.off(); podiumRef=null; } }
function endRound(){
  if(!(typeof isTeacher==='function' && isTeacher())) return;
  if(!podiumRef){ sfx.wrong(); toast('⚠️ ยังไม่ได้เชื่อมต่อออนไลน์ — จบรอบแข่งไม่ได้'); return; }
  const rows=[{u:onlineKey(), n:onlineDisplayName(), w:sessionWords}];
  Object.keys(peers).forEach(uid=>rows.push({u:uid, n:peers[uid].n||'เพื่อน', w:peers[uid].w||0}));
  rows.sort((a,b)=>b.w-a.w);
  const ref=podiumRef;
  ref.set({id:Date.now(), by:onlineDisplayName(),
           ts:firebase.database.ServerValue.TIMESTAMP, top:rows.slice(0,3)}).catch(()=>{});
  setTimeout(()=>{ ref.remove().catch(()=>{}); },15000);
}
function showPodium(v){
  const top=Array.isArray(v.top)?v.top:Object.values(v.top||{});
  const me=(typeof onlineKey==='function' && typeof Auth!=='undefined' && Auth.user)?onlineKey():'';
  let myBonus=0;
  top.forEach((r,i)=>{ if(r && me && r.u===me) myBonus=PODIUM_BONUS[i]||0; });
  if(myBonus){ addCoins(myBonus); saveState(); sessionCoins+=myBonus; }
  sessionWords=0;                                    // เริ่มรอบแข่งใหม่ทุกคน
  if(myRef) sendPos(true);
  renderBoard(); renderHudTop();
  const wasRunning=running;
  running=false;                                     // พักเกมระหว่างพิธี (ผีไม่แอบจับ)
  const medal=['🥇','🥈','🥉'], hgt=[104,74,56], ord=[1,0,2];   // วางเรียง 2-1-3
  const cols=ord.filter(i=>top[i]).map(i=>{
    const r=top[i];
    return `<div class="adv-pd-col">
      <div class="adv-pd-name">${medal[i]} ${escapeHTML(r.n||'?')}<br><small>${r.w||0} คำ</small></div>
      <div class="adv-pd-stand s${i}" style="height:${hgt[i]}px">${i+1}</div>
    </div>`;
  }).join('');
  const pd=document.getElementById('adv-podium');
  pd.innerHTML=`<div class="adv-pd-box">
    <div class="adv-pd-title">🏁 จบรอบแข่ง! ผลจาก ${escapeHTML(v.by||'คุณครู')}</div>
    <div class="adv-pd-row">${cols||'<small style="color:#fff">รอบนี้ยังไม่มีคะแนน — รอบใหม่เริ่มแล้ว!</small>'}</div>
    <div class="adv-pd-me">${myBonus?`🎁 หนูได้โบนัสโพเดียม +${myBonus} 🪙!`:'รอบใหม่เริ่มแล้ว เก็บคำเลย! 🔤'}</div>
    <small class="adv-pd-hint">แตะเพื่อปิด</small>
  </div>`;
  pd.classList.add('on');
  sfx.rankup();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate([80,60,80]);
  const close=()=>{
    pd.classList.remove('on'); pd.removeEventListener('click',close); clearTimeout(tm);
    if(wasRunning && overlayEl.classList.contains('on') && hp>0 && !banEl.classList.contains('stay')){
      running=true; clock.getDelta(); loop();
    }
  };
  const tm=setTimeout(close,8000);
  pd.addEventListener('click',close);
}

/* ---------- ส่วนลดชวนเพื่อน: เจอกันใน map จริง → เงินคืน (ครั้งเดียว/map) ---------- */
function tinvCheck(uid){
  if(state.tinvClaimed[mode]) return;
  const sentRec=state.tinvSent && state.tinvSent[uid];
  const inRec=(typeof Online!=='undefined' && Online.tinv) ? Online.tinv[uid] : null;
  const match=(sentRec && sentRec.map===mode) || (inRec && inRec.map===mode);
  if(!match) return;
  state.tinvClaimed[mode]=true;
  addCoins(TINV_CASHBACK);
  sessionCoins+=TINV_CASHBACK;
  sfx.rankup();
  saveState(); renderHudTop();
  const nm=peers[uid]?peers[uid].n:'เพื่อน';
  showBanner(`🎊 เล่นพร้อมกับ <b>${escapeHTML(nm)}</b> ตามคำชวน!<br><span class="adv-ban-coin">รับเงินคืน +${fmtNum(TINV_CASHBACK)} 🪙</span>`);
  if(inRec && typeof tinvClear==='function') tinvClear(uid);   // เคลียร์คำเชิญฝั่งเรา (ฝั่งเพื่อนรับของเขาเอง)
}

/* ============================================================
   HUD
   ============================================================ */
function showBanner(html){
  if(banEl.classList.contains('stay')) return;
  banEl.innerHTML=html;
  banEl.classList.remove('show'); void banEl.offsetWidth; banEl.classList.add('show');
}
function renderHudTop(){
  hudHpEl.style.width=hp+'%';
  hudHpEl.className='adv-hp-fill'+(hp<=30?' low':'');
  hudCoinEl.textContent=`🪙 +${fmtNum(sessionCoins)} · 📖 ${sessionWords} คำ`;
}
function renderHudWords(){
  hudWordsEl.innerHTML=words.map(w=>{
    const have=Object.assign({},inv);
    const chips=w.en.split('').map(ch=>{
      const ok=(have[ch]||0)>0; if(ok) have[ch]--;
      return `<span class="adv-ch${ok?' got':''}">${ch.toUpperCase()}</span>`;
    }).join('');
    return `<div class="adv-word">${chips}<small>${escapeHTML(w.th)}</small></div>`;
  }).join('');
}
function renderHudInv(){
  const ks=Object.keys(inv).sort();
  hudInvEl.innerHTML=ks.length
    ? ks.map(ch=>`<span class="adv-inv-ch">${ch.toUpperCase()}${inv[ch]>1?'×'+inv[ch]:''}</span>`).join('')
    : '<span class="adv-inv-empty">เดินชนตัวอักษรเพื่อเก็บ ✨</span>';
}
/* 🏆 กระดานคะแนนสด: ใครประกอบคำได้เยอะสุดรอบนี้ (me + เพื่อนใน map) */
function renderBoard(){
  if(!hudBoardEl) return;
  const rows=[{n:state.profileName||'หนู', w:sessionWords, me:true}];
  Object.keys(peers).forEach(uid=>rows.push({n:peers[uid].n||'เพื่อน', w:peers[uid].w||0}));
  rows.sort((a,b)=>b.w-a.w);
  const meIdx=rows.findIndex(r=>r.me);
  const row=(r,i)=>`<div class="adv-b-row${r.me?' me':''}">
    <span class="adv-b-nm">${i===0&&r.w>0?'👑':(i+1)+'.'} ${escapeHTML(r.n)}</span><b>${r.w}</b></div>`;
  let html=rows.slice(0,4).map(row).join('');
  if(meIdx>=4) html+=`<div class="adv-b-more">⋯</div>`+row(rows[meIdx],meIdx);   // เราหลุด top 4 → โชว์แถวตัวเองต่อท้าย
  hudBoardEl.innerHTML=`<div class="adv-b-title">🏆 ประกอบคำรอบนี้</div>`+html;
}
function drawMinimap(){
  const S=mapCv.width, sc=S/(HALF*2+8);
  mapCtx.clearRect(0,0,S,S);
  mapCtx.fillStyle=mode==='haunt'?'rgba(18,14,34,.78)':'rgba(20,40,20,.72)';
  mapCtx.beginPath(); mapCtx.arc(S/2,S/2,S/2,0,7); mapCtx.fill();
  const wx=v=>S/2+v*sc, wz=v=>S/2+v*sc;
  mapCtx.fillStyle='#ffd54f';
  letters.forEach(l=>{ mapCtx.beginPath(); mapCtx.arc(wx(l.spr.position.x),wz(l.spr.position.z),2.2,0,7); mapCtx.fill(); });
  monsters.forEach(m=>{
    mapCtx.fillStyle=(mode==='haunt' && !m.hunting)?'#b0bfff':'#ff5252';
    mapCtx.beginPath(); mapCtx.arc(wx(m.spr.position.x),wz(m.spr.position.z),3,0,7); mapCtx.fill();
  });
  mapCtx.fillStyle='#69f0ae';
  Object.keys(peers).forEach(uid=>{
    const p=peers[uid];
    mapCtx.beginPath(); mapCtx.arc(wx(p.cur.x),wz(p.cur.z),3,0,7); mapCtx.fill();
  });
  const px=wx(camera.position.x), pz=wz(camera.position.z);
  mapCtx.save(); mapCtx.translate(px,pz); mapCtx.rotate(-yaw);
  mapCtx.fillStyle='#fff';
  mapCtx.beginPath(); mapCtx.moveTo(0,-6); mapCtx.lineTo(4.5,5); mapCtx.lineTo(-4.5,5); mapCtx.closePath(); mapCtx.fill();
  mapCtx.restore();
}

/* ============================================================
   DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
   ============================================================ */
function buildDom(){
  const st=document.createElement('style');
  st.textContent=`
  #adv-overlay{position:fixed;inset:0;z-index:95;background:#000;display:none;touch-action:none}
  #adv-overlay.on{display:block}
  #adv-canvas{width:100%;height:100%;display:block}
  .adv-hud{position:absolute;pointer-events:none;font-family:inherit}
  #adv-topbar{top:8px;left:50%;transform:translateX(-50%);display:flex;gap:10px;align-items:center}
  .adv-hp{width:150px;height:16px;background:rgba(0,0,0,.45);border:2px solid #fff;border-radius:10px;overflow:hidden}
  .adv-haunt .adv-hp{display:none}
  .adv-hp-fill{height:100%;background:#66bb6a;transition:width .25s}
  .adv-hp-fill.low{background:#ef5350}
  #adv-coin{color:#fff;font-weight:800;font-size:14px;text-shadow:0 1px 3px #000;white-space:nowrap}
  #adv-board{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.5);border-radius:12px;
    padding:6px 9px;min-width:132px;max-width:190px;pointer-events:none}
  .adv-b-title{color:#ffd54f;font-weight:800;font-size:12px;margin-bottom:2px;white-space:nowrap}
  .adv-b-row{color:#fff;font-size:12px;font-weight:600;display:flex;gap:8px;justify-content:space-between;line-height:1.4}
  .adv-b-row.me{color:#8ef7a5}
  .adv-b-nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px}
  .adv-b-more{color:#bbb;font-size:10px;line-height:.7;text-align:center}
  #adv-words{top:132px;left:8px;max-height:calc(100vh - 145px);overflow-y:auto;background:rgba(0,0,0,.42);border-radius:12px;padding:7px 9px;pointer-events:auto}
  .adv-word{margin:3px 0;display:flex;align-items:center;gap:2px;flex-wrap:wrap}
  .adv-word small{color:#ffe082;font-size:10px;margin-left:5px}
  .adv-ch{display:inline-block;min-width:15px;text-align:center;padding:1px 3px;border-radius:5px;
    background:rgba(255,255,255,.16);color:#fff;font-weight:800;font-size:12px;margin:1px}
  .adv-ch.got{background:#66bb6a;color:#fff;box-shadow:0 0 5px #66bb6a}
  #adv-map{top:8px;right:8px}
  #adv-exit{top:118px;right:8px;pointer-events:auto;background:rgba(211,47,47,.92);color:#fff;border:2px solid #fff;
    border-radius:12px;font-weight:800;font-size:14px;padding:7px 12px;font-family:inherit}
  #adv-hunt{top:52px;left:50%;transform:translateX(-50%);color:#ff5252;font-weight:900;font-size:18px;
    text-shadow:0 1px 4px #000;background:rgba(0,0,0,.5);border-radius:12px;padding:4px 14px;display:none;
    animation:advHuntPulse .6s infinite}
  @keyframes advHuntPulse{0%,100%{opacity:1}50%{opacity:.55}}
  #adv-inv{bottom:8px;left:50%;transform:translateX(-50%);max-width:70vw;background:rgba(0,0,0,.42);
    border-radius:12px;padding:5px 10px;display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
  .adv-inv-ch{color:#fff;font-weight:800;font-size:13px;background:rgba(255,255,255,.18);border-radius:6px;padding:1px 6px}
  .adv-inv-empty{color:#eee;font-size:12px}
  #adv-cross{top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;
    background:rgba(255,255,255,.9);box-shadow:0 0 4px #000}
  .adv-haunt #adv-cross{display:none}
  #adv-dmg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(255,0,0,.55));opacity:0}
  #adv-dmg.on{animation:advDmg .5s ease-out}
  @keyframes advDmg{0%{opacity:1}100%{opacity:0}}
  .adv-hunted #adv-dmg{animation:advHuntVig 1.1s ease-in-out infinite}
  @keyframes advHuntVig{0%,100%{opacity:.25}50%{opacity:.6}}
  #adv-banner{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#fff;
    font-size:20px;text-shadow:0 2px 6px #000;opacity:0;pointer-events:none;background:rgba(0,0,0,.55);
    border-radius:16px;padding:12px 22px;max-width:86vw;z-index:5}
  #adv-banner.show{animation:advBan 2.4s ease-out}
  #adv-banner.stay{opacity:1;animation:none;pointer-events:auto}
  .adv-ban-coin{color:#ffd54f;font-weight:900}
  @keyframes advBan{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}
    20%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
  .adv-ko{font-size:22px;font-weight:800}
  .adv-ko small{font-size:14px;font-weight:600;color:#ffcdd2}
  .adv-ko-btn{margin-top:10px;background:#43a047;color:#fff;border:2px solid #fff;border-radius:12px;
    font-weight:800;font-size:16px;padding:9px 20px;font-family:inherit}
  #adv-scare{position:absolute;inset:0;pointer-events:none;z-index:9;display:none;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at center,rgba(120,0,0,.85),#000 78%)}
  #adv-scare.on{display:flex;animation:advScare 1.5s ease-out forwards}
  #adv-scare span{font-size:56vh;line-height:1;filter:drop-shadow(0 0 40px #f00)}
  @keyframes advScare{0%{opacity:0;transform:scale(.25)}8%{opacity:1;transform:scale(1.15)}
    16%{transform:scale(.95)}24%{transform:scale(1.08)}70%{opacity:1}100%{opacity:0;transform:scale(1.35)}}
  .adv-shake{animation:advShake .12s linear 9}
  @keyframes advShake{0%{transform:translate(0,0)}25%{transform:translate(-12px,6px)}50%{transform:translate(10px,-8px)}
    75%{transform:translate(-8px,-6px)}100%{transform:translate(9px,7px)}}
  #adv-joy{position:absolute;bottom:18px;left:18px;width:110px;height:110px;border-radius:50%;
    background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.4);pointer-events:none;display:none}
  #adv-joy-dot{position:absolute;left:50%;top:50%;width:44px;height:44px;border-radius:50%;
    background:rgba(255,255,255,.5);transform:translate(-50%,-50%)}
  #adv-shoot{position:absolute;bottom:26px;right:22px;width:76px;height:76px;border-radius:50%;pointer-events:auto;
    background:rgba(255,167,38,.9);border:3px solid #fff;font-size:32px;display:none}
  .adv-touch #adv-joy{display:block}
  .adv-touch #adv-shoot{display:block}
  .adv-touch.adv-haunt #adv-shoot{display:none}
  .adv-touch.adv-heli #adv-shoot{display:none}
  .adv-heli #adv-cross{display:none}
  #adv-inst{top:34px;left:50%;transform:translateX(-50%);color:#fff;font-weight:800;font-size:13px;
    text-shadow:0 1px 3px #000;background:rgba(0,0,0,.4);border-radius:10px;padding:2px 12px;display:none;white-space:nowrap}
  .adv-heli #adv-inst{display:block}
  #adv-cockpit{position:absolute;left:0;right:0;bottom:0;pointer-events:none;display:none;z-index:3}
  .adv-heli #adv-cockpit{display:block}
  #adv-cockpit img{width:100%;display:block;max-height:38vh;object-fit:cover;object-position:top}
  /* ไม่มีภาพ (ยังไม่เจนจาก PROMPTS_HELI.md) → cockpit จำลองด้วย CSS: แผงหน้าปัด+เสากรอบ */
  #adv-cockpit .cp-css{height:15vh;background:linear-gradient(180deg,#2a2f38,#14171d);
    border-top:4px solid #3d4450;border-radius:24px 24px 0 0;margin:0 -2vw;position:relative}
  #adv-cockpit .cp-css:before{content:'';position:absolute;left:50%;top:-11vh;transform:translateX(-50%);
    width:3vw;height:11vh;background:linear-gradient(180deg,rgba(40,44,52,.0),#2a2f38);border-radius:8px}
  #adv-cockpit .cp-dash{position:absolute;top:10px;left:50%;transform:translateX(-50%);
    display:flex;gap:14px;color:#8fe3a0;font-weight:800;font-size:12px;font-family:monospace}
  #adv-cockpit .cp-dash span{background:#0d0f13;border:2px solid #3d4450;border-radius:8px;padding:3px 10px}
  #adv-hint{bottom:8px;right:8px;color:#fff;font-size:11px;text-shadow:0 1px 3px #000;text-align:right;opacity:.85}
  .adv-touch #adv-hint{display:none}
  #adv-chat-btn{position:absolute;top:160px;right:8px;pointer-events:auto;background:rgba(33,150,243,.92);
    color:#fff;border:2px solid #fff;border-radius:12px;font-weight:800;font-size:14px;padding:7px 12px;font-family:inherit}
  .adv-vbtn{position:absolute;right:8px;pointer-events:auto;background:rgba(67,160,71,.92);color:#fff;
    border:2px solid #fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;font-family:inherit;min-width:86px}
  .adv-vbtn.v-off{background:rgba(97,97,97,.92)}
  .adv-vbtn.v-lock{background:rgba(230,126,34,.92)}
  #adv-mic{top:202px} #adv-spk{top:242px} #adv-vmode{top:282px;background:rgba(123,31,162,.92)}
  #adv-tmute{top:322px;background:rgba(198,40,40,.92);display:none}
  #adv-tmute.v-muting{background:rgba(46,125,50,.92)}
  #adv-podbtn{top:362px;background:rgba(249,168,37,.95);color:#5d3a00;display:none}
  #adv-podium{position:absolute;inset:0;display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.74);z-index:8;pointer-events:auto}
  #adv-podium.on{display:flex}
  .adv-pd-box{text-align:center;max-width:88vw}
  .adv-pd-title{color:#ffd54f;font-weight:900;font-size:20px;text-shadow:0 2px 6px #000;margin-bottom:14px}
  .adv-pd-row{display:flex;align-items:flex-end;gap:12px;justify-content:center}
  .adv-pd-col{display:flex;flex-direction:column;align-items:center;gap:6px;animation:advPdRise .7s ease-out}
  .adv-pd-name{color:#fff;font-weight:800;font-size:15px;text-shadow:0 1px 4px #000;max-width:120px;
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .adv-pd-name small{color:#ffe082;font-weight:700;white-space:normal}
  .adv-pd-stand{width:92px;border-radius:9px 9px 0 0;color:rgba(0,0,0,.55);font-weight:900;font-size:26px;
    display:flex;align-items:center;justify-content:center}
  .adv-pd-stand.s0{background:linear-gradient(180deg,#ffe082,#f9a825)}
  .adv-pd-stand.s1{background:linear-gradient(180deg,#e8e8e8,#9e9e9e)}
  .adv-pd-stand.s2{background:linear-gradient(180deg,#ffab91,#8d6e63)}
  .adv-pd-me{margin-top:14px;color:#8ef7a5;font-weight:900;font-size:17px;text-shadow:0 1px 4px #000}
  .adv-pd-hint{display:block;margin-top:8px;color:#ccc;font-size:11px}
  @keyframes advPdRise{0%{opacity:0;transform:translateY(42px)}100%{opacity:1;transform:translateY(0)}}
  #adv-chat-box{position:absolute;bottom:56px;left:50%;transform:translateX(-50%);display:none;flex-direction:column;gap:6px;
    background:rgba(0,0,0,.6);border-radius:14px;padding:8px;pointer-events:auto;width:min(420px,86vw)}
  .adv-chat-row{display:flex;gap:6px}
  #adv-quick{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}
  .adv-qc{background:rgba(255,255,255,.92);border:none;border-radius:9px;padding:5px 10px;
    font-size:13px;font-weight:700;font-family:inherit;color:#333}
  .adv-qc:active{background:#ffe082}
  #adv-chat-input{flex:1;border:none;border-radius:9px;padding:8px 10px;font-size:15px;font-family:inherit;outline:none}
  #adv-chat-send{background:#43a047;color:#fff;border:none;border-radius:9px;font-weight:800;font-size:14px;
    padding:8px 14px;font-family:inherit}
  #adv-selfmsg{position:absolute;bottom:96px;left:50%;transform:translateX(-50%);max-width:70vw;
    background:rgba(255,255,255,.95);color:#333;border-radius:14px;padding:5px 13px;font-size:14px;font-weight:600;
    display:none;pointer-events:none}
  #adv-selfmsg.on{display:block}
  .adv-haunt #adv-selfmsg{background:rgba(8,8,20,.92);color:#7cffb0;border:1px solid rgba(124,255,176,.6);
    text-shadow:0 0 8px rgba(124,255,176,.8)}
  .adv-haunt .adv-qc{background:rgba(20,20,38,.95);color:#7cffb0;border:1px solid rgba(124,255,176,.4)}`;
  document.head.appendChild(st);

  overlayEl=document.createElement('div');
  overlayEl.id='adv-overlay';
  overlayEl.innerHTML=`
    <canvas id="adv-canvas"></canvas>
    <div class="adv-hud" id="adv-topbar"><div class="adv-hp"><div class="adv-hp-fill" id="adv-hp"></div></div><span id="adv-coin"></span></div>
    <div class="adv-hud" id="adv-board"></div>
    <div class="adv-hud" id="adv-words"></div>
    <canvas class="adv-hud" id="adv-map" width="120" height="120"></canvas>
    <button class="adv-hud" id="adv-exit">🚪 ออก</button>
    <div class="adv-hud" id="adv-hunt"></div>
    <div class="adv-hud" id="adv-inst"></div>
    <div id="adv-cockpit"></div>
    <div class="adv-hud" id="adv-inv"></div>
    <div class="adv-hud" id="adv-cross"></div>
    <div id="adv-dmg"></div>
    <div id="adv-banner"></div>
    <div id="adv-scare"><span>👻</span></div>
    <div id="adv-joy"><div id="adv-joy-dot"></div></div>
    <button id="adv-shoot">🔥</button>
    <button id="adv-chat-btn">💬 แชท</button>
    <button class="adv-vbtn v-off" id="adv-mic">🎤 ปิด</button>
    <button class="adv-vbtn" id="adv-spk">🔊 เปิด</button>
    <button class="adv-vbtn" id="adv-vmode">🌐 ทุกคน</button>
    <button class="adv-vbtn" id="adv-tmute">👩‍🏫 ปิดเสียงห้อง</button>
    <button class="adv-vbtn" id="adv-podbtn">🏁 จบรอบแข่ง</button>
    <div id="adv-podium"></div>
    <div id="adv-chat-box">
      <div id="adv-quick"></div>
      <div class="adv-chat-row">
        <input id="adv-chat-input" maxlength="60" placeholder="พิมพ์สั้นๆ โชว์ลอยหัว 5 วิ...">
        <button id="adv-chat-send">ส่ง</button>
      </div>
    </div>
    <div id="adv-selfmsg"></div>
    <div class="adv-hud" id="adv-hint"></div>`;
  document.body.appendChild(overlayEl);

  canvasEl=overlayEl.querySelector('#adv-canvas');
  dmgFlashEl=overlayEl.querySelector('#adv-dmg');
  hudBoardEl=overlayEl.querySelector('#adv-board');
  hudWordsEl=overlayEl.querySelector('#adv-words');
  hudInvEl=overlayEl.querySelector('#adv-inv');
  hudHpEl=overlayEl.querySelector('#adv-hp');
  hudCoinEl=overlayEl.querySelector('#adv-coin');
  hudHuntEl=overlayEl.querySelector('#adv-hunt');
  banEl=overlayEl.querySelector('#adv-banner');
  scareEl=overlayEl.querySelector('#adv-scare');
  hintEl=overlayEl.querySelector('#adv-hint');
  mapCv=overlayEl.querySelector('#adv-map'); mapCtx=mapCv.getContext('2d');
  chatBoxEl=overlayEl.querySelector('#adv-chat-box');
  chatInputEl=overlayEl.querySelector('#adv-chat-input');
  selfMsgEl=overlayEl.querySelector('#adv-selfmsg');
  hudInstEl=overlayEl.querySelector('#adv-inst');
  cockpitEl=overlayEl.querySelector('#adv-cockpit');
  // cockpit: ใช้ภาพ img/heli_cockpit.png ถ้าเจนแล้ว (PROMPTS_HELI.md) · ไม่มี → แผง CSS จำลอง
  const cpImg=new Image();
  cpImg.onload=()=>{ cockpitEl.innerHTML=''; cockpitEl.appendChild(cpImg); };
  cpImg.onerror=()=>{ cockpitEl.innerHTML=`<div class="cp-css"><div class="cp-dash"><span>ALT</span><span>SPD</span><span>FUEL ∞</span><span>BELL 206</span></div></div>`; };
  cpImg.src='img/heli_cockpit.png';

  overlayEl.querySelector('#adv-exit').addEventListener('click',confirmExit);
  const shootBtn=overlayEl.querySelector('#adv-shoot');
  shootBtn.addEventListener('touchstart',e=>{ e.preventDefault(); shoot(); },{passive:false});
  shootBtn.addEventListener('click',e=>{ e.preventDefault(); shoot(); });

  overlayEl.querySelector('#adv-mic').addEventListener('click',()=>Voice.setMic(!Voice.mic));
  overlayEl.querySelector('#adv-spk').addEventListener('click',()=>Voice.setSpk(!Voice.spk));
  overlayEl.querySelector('#adv-vmode').addEventListener('click',()=>Voice.setMode(Voice.vmode==='all'?'friends':'all'));
  overlayEl.querySelector('#adv-tmute').addEventListener('click',()=>Voice.toggleRoomMute());
  overlayEl.querySelector('#adv-podbtn').addEventListener('click',endRound);

  overlayEl.querySelector('#adv-chat-btn').addEventListener('click',()=>toggleChatBox());
  overlayEl.querySelector('#adv-chat-send').addEventListener('click',()=>{
    sendChat(chatInputEl.value); toggleChatBox(false);
  });
  // quick chat: เด็กเล็กพิมพ์ช้า → แตะเดียวส่งเลย (ปลอดภัย ไม่ต้องพิมพ์เอง)
  const QUICK_CHATS=['สวัสดี! 👋','มาทางนี้! 🏃','ไปเก็บคำกัน! 🔤','ช่วยด้วย! 🆘','เก่งมาก! 🎉','หนีเร็ว!! 👻'];
  const quickEl=overlayEl.querySelector('#adv-quick');
  QUICK_CHATS.forEach(txt=>{
    const b=document.createElement('button');
    b.className='adv-qc'; b.textContent=txt;
    b.addEventListener('click',()=>{ sendChat(txt); toggleChatBox(false); });
    quickEl.appendChild(b);
  });
  chatInputEl.addEventListener('keydown',e=>{
    e.stopPropagation();                                   // กัน WASD ในช่องพิมพ์ไปขยับตัวละคร
    if(e.code==='Enter'){ sendChat(chatInputEl.value); toggleChatBox(false); }
    if(e.code==='Escape') toggleChatBox(false);
  });

  bindInput();
}

function confirmExit(){
  if(!running){ exitWorld(); return; }
  running=false;                                   // พักเกมระหว่างถาม
  askConfirm(`<h2>🚪 ออกจาก${M.label}</h2>
    <p style="font-size:15px;margin:6px 0">รอบนี้เก็บได้ <b>${sessionWords}</b> คำ · <b>+${fmtNum(sessionCoins)}</b> 🪙<br>
    <small>กลับมาเล่นต่อเมื่อไหร่ก็ได้ ตั๋วใช้ได้ตลอด</small></p>`,
    'ออกเลย', ()=>exitWorld());
  // askConfirm ไม่มี callback ตอนยกเลิก → เฝ้า overlay หาย แล้วเล่นต่อ
  const watch=setInterval(()=>{
    if(!document.querySelector('.levelup-overlay')){
      clearInterval(watch);
      if(overlayEl.classList.contains('on') && hp>0 && !running){ running=true; clock.getDelta(); loop(); }
    }
  },200);
}

/* ============================================================
   Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
   ============================================================ */
const IS_TOUCH='ontouchstart' in window;
function bindInput(){
  document.addEventListener('keydown',e=>{
    if(!overlayEl.classList.contains('on')) return;
    if(e.target && e.target.tagName==='INPUT') return;     // กำลังพิมพ์แชท
    if(e.code==='Enter' && running){ toggleChatBox(true); e.preventDefault(); return; }
    keys[e.code]=true;
  });
  document.addEventListener('keyup',e=>{ keys[e.code]=false; });

  if(!IS_TOUCH){
    canvasEl.addEventListener('click',()=>{
      if(document.pointerLockElement===canvasEl) shoot();
      else canvasEl.requestPointerLock();
    });
    document.addEventListener('mousemove',e=>{
      if(document.pointerLockElement!==canvasEl) return;
      yaw-=e.movementX*.0024;
      pitch=Math.max(-1.25,Math.min(1.25,pitch-e.movementY*.0024));
    });
  }else{
    overlayEl.classList.add('adv-touch');
    const joyEl=overlayEl.querySelector('#adv-joy'), dotEl=overlayEl.querySelector('#adv-joy-dot');
    let joyId=null, joyCx=0, joyCy=0;
    overlayEl.addEventListener('touchstart',e=>{
      for(const t of e.changedTouches){
        if(t.target.closest('#adv-shoot,#adv-exit,#adv-words,#adv-banner,#adv-chat-btn,#adv-chat-box,.adv-vbtn,#adv-podium')) continue;
        if(t.clientX<window.innerWidth*.45 && joyId===null){
          joyId=t.identifier; joyCx=t.clientX; joyCy=t.clientY;
          joyEl.style.left=(joyCx-55)+'px'; joyEl.style.top=(joyCy-55)+'px'; joyEl.style.bottom='auto';
          joy.on=true; joy.dx=0; joy.dy=0;
        }else if(lookTouch===null){
          lookTouch={id:t.identifier,x:t.clientX,y:t.clientY};
        }
      }
    },{passive:true});
    overlayEl.addEventListener('touchmove',e=>{
      for(const t of e.changedTouches){
        if(t.identifier===joyId){
          const dx=t.clientX-joyCx, dy=t.clientY-joyCy, d=Math.hypot(dx,dy), max=48;
          const cl=d>max?max/d:1;
          joy.dx=dx*cl/max; joy.dy=dy*cl/max;
          dotEl.style.transform=`translate(calc(-50% + ${dx*cl}px),calc(-50% + ${dy*cl}px))`;
        }else if(lookTouch && t.identifier===lookTouch.id){
          if(M.heli){
            // โหมดเฮลิคอปเตอร์: ลากขวาแนวนอน = หันหัว · แนวตั้ง = ขึ้น/ลง (collective)
            yaw-=(t.clientX-lookTouch.x)*.004;
            hCol=Math.max(-1,Math.min(1,hCol-(t.clientY-lookTouch.y)*.012));
          }else{
            yaw-=(t.clientX-lookTouch.x)*.005;
            pitch=Math.max(-1.25,Math.min(1.25,pitch-(t.clientY-lookTouch.y)*.005));
          }
          lookTouch.x=t.clientX; lookTouch.y=t.clientY;
        }
      }
    },{passive:true});
    const endTouch=e=>{
      for(const t of e.changedTouches){
        if(t.identifier===joyId){ joyId=null; joy.on=false; joy.dx=joy.dy=0;
          dotEl.style.transform='translate(-50%,-50%)';
          joyEl.style.left='18px'; joyEl.style.top='auto'; joyEl.style.bottom='18px'; }
        if(lookTouch && t.identifier===lookTouch.id){ lookTouch=null; hCol=0; }   // ปล่อยนิ้ว = hover
      }
    };
    overlayEl.addEventListener('touchend',endTouch,{passive:true});
    overlayEl.addEventListener('touchcancel',endTouch,{passive:true});
  }

  window.addEventListener('resize',()=>{
    if(!renderer || !overlayEl.classList.contains('on')) return;
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
}

/* ---------- เดิน + กันทะลุสิ่งกีดขวาง/รั้ว ---------- */
function movePlayer(mx,mz){
  let nx=camera.position.x+mx, nz=camera.position.z+mz;
  nx=Math.max(-HALF+1.2,Math.min(HALF-1.2,nx));
  nz=Math.max(-HALF+1.2,Math.min(HALF-1.2,nz));
  for(const t of trees){
    const d=Math.hypot(nx-t.x,nz-t.z), min=t.r+.5;
    if(d<min && d>0){ nx=t.x+(nx-t.x)/d*min; nz=t.z+(nz-t.z)/d*min; }
  }
  camera.position.x=nx; camera.position.z=nz;
}
function tickPlayer(dt,now){
  let fw=0,sd=0;
  if(keys.KeyW||keys.ArrowUp) fw+=1;
  if(keys.KeyS||keys.ArrowDown) fw-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  if(fw||sd){
    const l=Math.hypot(fw,sd)||1;
    if(l>1){ fw/=l; sd/=l; }
    const sin=Math.sin(yaw),cos=Math.cos(yaw);
    movePlayer((-sin*fw+cos*sd)*PLAYER_SPEED*dt,(-cos*fw-sin*sd)*PLAYER_SPEED*dt);
    camera.position.y=EYE_H+Math.sin(now/180)*.045;      // ก้าวเดินหัวโยกนิดๆ
  }
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw); camera.rotateX(pitch);

  // เก็บตัวอักษร
  for(let i=letters.length-1;i>=0;i--){
    const lp=letters[i].spr.position;
    if(Math.hypot(lp.x-camera.position.x,lp.z-camera.position.z)<PICK_DIST){
      const ch=letters[i].ch;
      inv[ch]=(inv[ch]||0)+1;
      removeLetter(i);
      sfx.coin();
      renderHudInv(); renderHudWords();
      tryCompleteWords();
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });
}

/* ============================================================
   🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
   จอยซ้าย/WASD = เอียงตัว (cyclic) · ลากขวาแนวตั้ง/Space-Shift = ขึ้นลง (collective)
   ลากขวาแนวนอน/Q-E = หันหัว (yaw) · ลงจอดเบาๆ บนดาดฟ้าใกล้ตัวอักษร = เก็บ
   ============================================================ */
function heliFloorAt(x,z){
  let f=0;
  for(const b of buildings){
    if(Math.abs(x-b.x)<=b.w/2+.4 && Math.abs(z-b.z)<=b.d/2+.4 && b.h>f) f=b.h;
  }
  return f;
}
function tickHeli(dt,now){
  // ---- อ่านอินพุต ----
  let fw=0,sd=0,yawIn=0;
  if(keys.KeyW||keys.ArrowUp) fw+=1;
  if(keys.KeyS||keys.ArrowDown) fw-=1;
  if(keys.KeyA||keys.ArrowLeft) sd-=1;
  if(keys.KeyD||keys.ArrowRight) sd+=1;
  if(keys.KeyQ) yawIn+=1;
  if(keys.KeyE) yawIn-=1;
  let col=0;
  if(keys.Space) col+=1;
  if(keys.ShiftLeft||keys.ShiftRight||keys.KeyC) col-=1;
  if(joy.on){ fw=-joy.dy; sd=joy.dx; }
  col+=hCol;                                   // จากลากนิ้วครึ่งขวา (มือถือ)
  col=Math.max(-1,Math.min(1,col));
  yaw+=yawIn*1.5*dt;

  // ---- ฟิสิกส์ ----
  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  if(hLanded){
    if(col>.25 && HeliSound.ready){ hLanded=false; hVel.y=2.5; }  // เทคออฟได้เมื่อสตาร์ทเครื่องเสร็จ
  }else{
    hVel.x+=(-sin*fw+cos*sd)*13*dt;
    hVel.z+=(-cos*fw-sin*sd)*13*dt;
    hVel.y+=(col*9 - hVel.y*1.8)*dt;           // ไต่/ลดระดับนุ่มๆ auto-hover
    const drag=Math.max(0,1-1.4*dt);
    hVel.x*=drag; hVel.z*=drag;
    const hs=Math.hypot(hVel.x,hVel.z);
    if(hs>17){ hVel.x*=17/hs; hVel.z*=17/hs; }
  }
  let nx=camera.position.x+hVel.x*dt;
  let ny=camera.position.y+hVel.y*dt;
  let nz=camera.position.z+hVel.z*dt;
  nx=Math.max(-HALF+2,Math.min(HALF-2,nx));
  nz=Math.max(-HALF+2,Math.min(HALF-2,nz));
  ny=Math.min(60,ny);

  // ---- ชนตึกด้านข้าง: บินต่ำกว่ายอด + ทะลุ footprint → เด้งออก+เจ็บ ----
  for(const b of buildings){
    const inX=Math.abs(nx-b.x)<=b.w/2+.9, inZ=Math.abs(nz-b.z)<=b.d/2+.9;
    if(inX && inZ && ny<b.h-.5){
      const pushX=(nx>b.x?1:-1)*((b.w/2+1)-Math.abs(nx-b.x));
      const pushZ=(nz>b.z?1:-1)*((b.d/2+1)-Math.abs(nz-b.z));
      if(Math.abs(pushX)<Math.abs(pushZ)) nx+=pushX; else nz+=pushZ;
      hVel.x*=-.25; hVel.z*=-.25;
      if(now-hHitAt>1000){ hHitAt=now; damagePlayer(20); HeliSound.thud(); }
      break;
    }
  }

  // ---- พื้น/ดาดฟ้า: แตะพื้นเบา = ลงจอด · กระแทกแรง = เจ็บ ----
  const floor=heliFloorAt(nx,nz), minY=floor+HELI_SKID;
  if(ny<=minY){
    if(hVel.y<-7 && now-hHitAt>1000){ hHitAt=now; damagePlayer(25); HeliSound.thud(); ny=minY; hVel.y=2.2; }
    else{
      ny=minY;
      if(!hLanded && Math.abs(hVel.y)<=7 && col<=.1){
        hLanded=true; hVel={x:0,y:0,z:0}; sfx.select(); HeliSound.thud(.4);
      }
      hVel.y=Math.max(0,hVel.y);
      if(hLanded){ hVel.x=0; hVel.z=0; }
    }
  }
  camera.position.set(nx,ny,nz);
  camera.rotation.set(0,0,0);
  camera.rotateY(yaw);
  camera.rotateX(-fw*.12+(pitch*0));            // ก้มเงยตามการเอียง (cockpit feedback)
  camera.rotateZ(-sd*.09);

  // ---- เก็บตัวอักษร: ต้อง "ลงจอดแล้ว" บนดาดฟ้า/พื้นใกล้ตัวอักษร ----
  if(hLanded){
    for(let i=letters.length-1;i>=0;i--){
      const lp=letters[i].spr.position;
      if(Math.hypot(lp.x-nx,lp.z-nz)<3.6 && Math.abs((letters[i].baseY-1.3)-floor)<2){
        const ch=letters[i].ch;
        inv[ch]=(inv[ch]||0)+1;
        removeLetter(i);
        sfx.coin();
        renderHudInv(); renderHudWords();
        tryCompleteWords();
      }
    }
  }
  letters.forEach(l=>{ l.spr.position.y=(l.baseY||1.15)+Math.sin(now/400+l.spr.position.x*2)*.12; });

  // ---- หน้าปัด + เสียงใบพัด ----
  if(hudInstEl){
    if(!HeliSound.ready){
      hudInstEl.textContent='🔑 กำลังสตาร์ทเครื่องยนต์... รอใบพัดหมุนเต็มรอบ';
    }else{
      const spd=Math.round(Math.hypot(hVel.x,hVel.z)*3.6);
      hudInstEl.textContent=`⛰️ ${Math.max(0,ny-HELI_SKID).toFixed(0)}m · 🚀 ${spd} กม./ชม. ${hLanded?'· 🛬 จอดแล้ว':''}`;
    }
  }
  HeliSound.update(col,hLanded,dt);
}

/* ---------- เสียงใบพัด Bell — สังเคราะห์ (ปลอดลิขสิทธิ์) · มีไฟล์ sound/heli_rotor.mp3 ใช้แทนอัตโนมัติ ---------- */
const HeliSound={
  ctx:null,master:null,lfo:null,whine:null,whineG:null,nodes:[],
  files:{start:null,rotor:null,high:null},probed:false,on:false,
  ready:false,rpm:0,_startTm:0,highOn:false,
  probe(){
    if(this.probed) return; this.probed=true;
    // 3 ไฟล์อัปเกรดจาก Suno (PROMPTS_HELI.md): สตาร์ทเครื่อง / ลูปบินปกติ / ลูปเร่งเครื่องเต็มกำลัง
    [['start','sound/heli_start.mp3'],['rotor','sound/heli_rotor.mp3'],['high','sound/heli_rotor_high.mp3']].forEach(([k,src])=>{
      const a=new Audio();
      a.addEventListener('canplaythrough',()=>{ this.files[k]=a; },{once:true});
      a.preload='auto'; a.src=src;
    });
  },
  ensureCtx(){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!this.ctx){ this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.connect(this.ctx.destination); }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
  },
  buildNodes(){
    this.ensureCtx();
    // ตุบใบพัด: sawtooth ทุ้ม AM ด้วย LFO ความถี่ใบพัด + ลมหมุนจาก noise + หวีดเทอร์ไบน์
    const osc=this.ctx.createOscillator(); osc.type='sawtooth'; osc.frequency.value=27;
    const lp=this.ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=140;
    const og=this.ctx.createGain(); og.gain.value=.001;
    const len=this.ctx.sampleRate*2, buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    const noi=this.ctx.createBufferSource(); noi.buffer=buf; noi.loop=true;
    const bp=this.ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=650; bp.Q.value=.8;
    const ng=this.ctx.createGain(); ng.gain.value=.001;
    this.lfo=this.ctx.createOscillator(); this.lfo.type='square'; this.lfo.frequency.value=2;
    const lg1=this.ctx.createGain(); lg1.gain.value=.14;
    const lg2=this.ctx.createGain(); lg2.gain.value=.05;
    this.lfo.connect(lg1); lg1.connect(og.gain);
    this.lfo.connect(lg2); lg2.connect(ng.gain);
    // เสียงหวีดเทอร์ไบน์ (เร่ง-เบาตาม RPM)
    this.whine=this.ctx.createOscillator(); this.whine.type='triangle'; this.whine.frequency.value=120;
    this.whineG=this.ctx.createGain(); this.whineG.gain.value=.0001;
    this.whine.connect(this.whineG); this.whineG.connect(this.master);
    osc.connect(lp); lp.connect(og); og.connect(this.master);
    noi.connect(bp); bp.connect(ng); ng.connect(this.master);
    osc.start(); noi.start(); this.lfo.start(); this.whine.start();
    this.nodes=[osc,noi,this.lfo,this.whine];
  },
  start(){                       // เข้าโลก → ซีเควนซ์สตาร์ทเครื่องก่อน (ready แล้วถึงบินได้)
    if(this.on) return;
    this.on=true; this.ready=false; this.rpm=0; this.highOn=false;
    this.probe();
    if(!state.sound){ this.ready=true; this.rpm=.55; return; }   // ปิดเสียง = ข้ามซีเควนซ์ บินได้เลย
    if(this.files.start){
      const a=this.files.start;
      a.currentTime=0; a.volume=.85; a.play().catch(()=>{});
      const durMs=Math.min(((a.duration||5)*1000)||5000, 9000);
      this._startTm=setTimeout(()=>{ this.ready=true; this.rpm=.55; this.loopStart(); },durMs);
      return;
    }
    // สังเคราะห์: เทอร์ไบน์สปูลขึ้น + ใบพัดค่อยๆ หมุนเร็วขึ้น ~3.5 วิ
    this.buildNodes();
    const t=this.ctx.currentTime;
    this.master.gain.setValueAtTime(.1,t);
    this.master.gain.linearRampToValueAtTime(.45,t+3.3);
    this.whine.frequency.setValueAtTime(85,t);
    this.whine.frequency.exponentialRampToValueAtTime(430,t+3.2);
    this.whineG.gain.setValueAtTime(.0001,t);
    this.whineG.gain.exponentialRampToValueAtTime(.055,t+1.6);
    this.lfo.frequency.setValueAtTime(1.6,t);
    this.lfo.frequency.linearRampToValueAtTime(10.5,t+3.4);
    this._startTm=setTimeout(()=>{ this.ready=true; this.rpm=.55; },3600);
  },
  loopStart(){                   // จบไฟล์สตาร์ท → เข้าลูปบิน (ไฟล์ถ้ามี · ไม่มีใช้สังเคราะห์)
    if(!state.sound) return;
    if(this.files.rotor){
      this.files.rotor.loop=true; this.files.rotor.volume=.55;
      this.files.rotor.play().catch(()=>{});
      if(this.files.high){
        this.files.high.loop=true; this.files.high.volume=0;
        this.files.high.play().catch(()=>{});
      }
    }else{
      this.buildNodes();
      this.master.gain.value=.4;
      this.whine.frequency.value=380; this.whineG.gain.value=.05;
      this.lfo.frequency.value=10.5;
    }
  },
  update(col,landed,dt){
    if(!this.on) return;
    if(!state.sound){ this.stop(); this.on=true; this.ready=true; return; }  // ปิดเสียงกลางคัน: เงียบแต่ยังบินได้
    if(!this.ready) return;                       // ระหว่างสตาร์ทเครื่อง ไม่ปรับ RPM
    // โมเดล RPM มีแรงเฉื่อย: เร่ง/เบาเครื่องค่อยเป็นค่อยไป (สมจริง ไม่กระโดด)
    const target=landed?.55:(1+Math.max(0,col)*.45);
    this.rpm+=(target-this.rpm)*Math.min(1,(dt||.016)*.9);
    const r=this.rpm;
    if(this.files.rotor){
      this.files.rotor.playbackRate=.8+r*.35;
      if(this.files.high){
        const hi=Math.max(0,Math.min(1,(r-.85)/.5));   // crossfade ลูปปกติ ↔ ลูปเร่งเครื่อง
        this.files.high.playbackRate=.9+r*.2;
        this.files.high.volume=.7*hi;
        this.files.rotor.volume=.55*(1-hi*.75);
      }else{
        this.files.rotor.volume=.3+r*.3;
      }
      return;
    }
    if(this.lfo) this.lfo.frequency.value=6.5+r*6.5;
    if(this.whine){ this.whine.frequency.value=230+r*360; this.whineG.gain.value=.02+r*.05; }
    if(this.master) this.master.gain.value=.18+r*.32;
  },
  thud(vol){
    if(!state.sound || !this.ctx) { sfx.wrong(); return; }
    const t=this.ctx.currentTime;
    const o=this.ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(70,t);
    o.frequency.exponentialRampToValueAtTime(35,t+.25);
    const g=this.ctx.createGain(); g.gain.setValueAtTime(vol||.6,t);
    g.gain.exponentialRampToValueAtTime(.001,t+.3);
    o.connect(g); g.connect(this.master||this.ctx.destination);
    o.start(t); o.stop(t+.32);
  },
  stop(){
    this.on=false; this.ready=false; this.rpm=0;
    clearTimeout(this._startTm);
    Object.values(this.files).forEach(f=>{ if(f) f.pause(); });
    this.nodes.forEach(n=>{ try{ n.stop(); }catch(e){} });
    this.nodes=[]; this.lfo=null; this.whine=null; this.whineG=null;
    if(this.master) this.master.gain.value=0;
  },
};

/* ============================================================
   Loop หลัก
   ============================================================ */
function loop(){
  if(!running) return;
  rafId=requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.1), now=performance.now();
  if(M.heli){ tickHeli(dt,now); }
  else{
    tickPlayer(dt,now);
    if(M.ghost){ tickGhosts(dt,now); }
    else{
      tickMonsters(dt,now);
      tickShots(dt);
      if(now-lastSpawn>M.monSpawnMs){ lastSpawn=now; spawnMonster(); }
    }
  }
  if(now-lastEnsure>5000){ lastEnsure=now; relocateLetters(now); ensureCoverage(); }
  tickPeers(dt,now);
  sendPos(false);
  drawMinimap();
  renderer.render(scene,camera);
}

/* ============================================================
   เข้า/ออกโลก
   ============================================================ */
function clearEntities(){
  while(letters.length) removeLetter(0);
  monsters.forEach(m=>{ scene.remove(m.spr); m.spr.material.dispose(); }); monsters=[];
  shots.forEach(s=>{ scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); }); shots=[];
}
function start(md){
  mode=(md==='haunt'||md==='heli')?md:'adv';
  M=MODES[mode];
  if(mode==='adv' && !state.advTicket){ toast('🎫 ต้องมีตั๋วโลกผจญภัยก่อนนะ'); return; }
  if(mode==='haunt' && !state.hauntTicket){ toast('🎃 ต้องมีตั๋วโลกผีสิงก่อนนะ'); return; }
  if(mode==='heli' && !state.heliTicket){ toast('🚁 ต้องมีตั๋วโลกเฮลิคอปเตอร์ก่อนนะ'); return; }
  if(state.advHurt){ toast('🤕 ยังบาดเจ็บอยู่ ต้องรักษาตัวก่อนเข้าโลก 3D'); return; }

  if(!built){
    buildDom();
    renderer=new THREE.WebGLRenderer({canvas:canvasEl,antialias:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    camera=new THREE.PerspectiveCamera(72,window.innerWidth/window.innerHeight,.1,220);
    clock=new THREE.Clock();
    built=true;
  }
  if(scene) clearEntities();                       // ล้างของโหมดก่อนหน้า (ถ้าเคยเข้า)
  if(!worlds[mode]) buildScene(mode);
  scene=worlds[mode].scene; trees=worlds[mode].trees||[]; buildings=worlds[mode].buildings||[];

  hp=100; sessionCoins=0; sessionWords=0; inv={}; keys={}; yaw=0; pitch=0;
  if(M.heli){
    camera.position.set(0,HELI_SKID,0);            // เริ่มบนลานจอดกลางเมือง
    hVel={x:0,y:0,z:0}; hCol=0; hLanded=true; hHitAt=0;
  }else{
    camera.position.set(0,EYE_H,0);
  }
  if(!Array.isArray(state[M.doneKey])) state[M.doneKey]=[];
  words=pickWords(GUIDE_WORDS);
  words.forEach(spawnLettersForWord);
  for(let i=0;i<8;i++) spawnLetter('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]);
  if(M.ghost){ for(let i=0;i<M.ghostMax;i++) spawnGhost(true); }
  else if(!M.heli) spawnMonster();
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  scareEl.classList.remove('on');
  overlayEl.classList.toggle('adv-haunt',mode==='haunt');
  overlayEl.classList.toggle('adv-heli',mode==='heli');
  if(mode==='heli') HeliSound.start();
  hintEl.textContent=M.hint;
  hudHuntEl.style.display='none';
  Voice.spk=state.voiceSpk!==false;                        // สะท้อนค่าที่จำไว้แม้ยังออฟไลน์ (join ทับอีกทีตอนต่อเน็ต)
  Voice.vmode=state.voiceMode==='friends'?'friends':'all';
  Voice.mic=false;
  updateVoiceBtns();

  overlayEl.classList.add('on');
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  renderHudTop(); renderHudWords(); renderHudInv(); renderBoard();
  lastSpawn=performance.now(); lastEnsure=performance.now();
  netJoin();
  if(mode==='haunt') HSound.startAmbient();
  clock.getDelta();
  running=true;
  loop();
  showBanner(M.intro);
}

function exitWorld(){
  running=false;
  cancelAnimationFrame(rafId);
  if(document.pointerLockElement) document.exitPointerLock();
  netLeave();
  HSound.stopAll();
  HeliSound.stop();
  toggleChatBox(false);
  selfMsgEl.classList.remove('on');
  myChat=null;
  overlayEl.classList.remove('on','adv-hunted','adv-shake');
  scareEl.classList.remove('on');
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  saveState();
  renderDashboard();
  if(sessionWords>0 || sessionCoins>0)
    toast(`${M.emoji} กลับจาก${M.label} — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.Adventure3D={
  start,
  /* test hooks — ใช้เฉพาะตอนเทสต์ preview */
  _t:{
    get letters(){return letters}, get monsters(){return monsters}, get words(){return words},
    get inv(){return inv}, get peers(){return peers}, get hp(){return hp}, get mode(){return mode},
    get running(){return running}, set running(v){running=v},
    camera:()=>camera, damagePlayer, caught, spawnGhost, tinvCheck, onPeerData, exitWorld, sendChat, Voice, tinvLinked, showPodium, endRound,
    give(ch,n){ inv[ch]=(inv[ch]||0)+(n||1); renderHudInv(); renderHudWords(); tryCompleteWords(); },
    get heli(){ return {vel:hVel, landed:hLanded, col:hCol, buildings, floorAt:heliFloorAt,
                        rpm:HeliSound.rpm, soundReady:HeliSound.ready, sound:HeliSound}; },
    set landed(v){ hLanded=v; },
    setKeys(o){ keys=o||{}; },
    step(dt){                        // เดินเกม 1 เฟรมเอง — rAF ไม่ fire ใน preview ที่มองไม่เห็นหน้าต่าง
      const now=performance.now(); dt=dt||.016;
      if(M.heli){ tickHeli(dt,now); }
      else{
        tickPlayer(dt,now);
        if(M.ghost) tickGhosts(dt,now); else { tickMonsters(dt,now); tickShots(dt); }
      }
      tickPeers(dt,now); drawMinimap(); renderer.render(scene,camera);
    },
  },
};
})();
