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
  },
};
const SHOOT_GAP_MS = 280;
const MONSTER_REWARD = 2;       // เหรียญ/ตัว เมื่อยิง monster แตก (โหมด adv)

/* ---------- สถานะรอบเล่น ---------- */
let mode='adv', M=MODES.adv;
let built=false, running=false, rafId=0;
let renderer, camera, clock;
let worlds={};                    // ฉาก static ต่อโหมด {scene,trees} สร้างครั้งเดียว
let scene=null, trees=[];
let yaw=0, pitch=0;
let hp=100, sessionCoins=0, sessionWords=0;
let inv={};                       // ตัวอักษรในกระเป๋า {a:2,...}
let words=[];                     // guideline [{en,th}]
let letters=[];                   // ตัวอักษรในโลก [{ch,spr,born}]
let monsters=[];                  // adv: [{spr,hp,tgt,wanderAt,hitAt}] · haunt(ผี): [{spr,born,hunting,wailAt,tgt,wanderAt}]
let shots=[];                     // [{mesh,dir,life}]
let keys={}, joy={on:false,dx:0,dy:0}, lookTouch=null, lastShot=0, lastEnsure=0, lastSpawn=0;
let dmgFlashEl, hudWordsEl, hudInvEl, hudHpEl, hudCoinEl, hudHuntEl, mapCv, mapCtx, banEl, overlayEl, canvasEl, scareEl, hintEl;
let texCache={};

/* ---------- multiplayer ---------- */
let peers={};                     // uid → {spr, cur:{x,z}, tgt:{x,z}, n, av}
let worldRef=null, myRef=null, lastNetSend=0, lastSent=null;

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
/* ป้ายผู้เล่นคนอื่น: ชื่อ + ภาพตัวละคร (player_male/female.png ถ้ามี · ไม่มีใช้อีโมจิ) */
function makePeerSprite(name, av){
  const cv=document.createElement('canvas'); cv.width=128; cv.height=170;
  const tex=new THREE.CanvasTexture(cv);
  const draw=(img)=>{
    const c=cv.getContext('2d');
    c.clearRect(0,0,128,170);
    c.fillStyle='rgba(0,0,0,.55)';
    c.beginPath(); c.roundRect(4,2,120,30,12); c.fill();
    c.fillStyle='#fff'; c.font='bold 19px Arial'; c.textAlign='center'; c.textBaseline='middle';
    let nm=(name||'เพื่อน'); if(nm.length>9) nm=nm.slice(0,8)+'…';
    c.fillText(nm,64,18);
    if(img){ c.drawImage(img,14,36,100,130); }
    else{ c.font='90px serif'; c.fillText(av==='male'?'👦':'👧',64,105); }
    tex.needsUpdate=true;
  };
  draw(null);
  if(av==='male' || av==='female'){
    const img=new Image();
    img.onload=()=>draw(img);
    img.src='img/player_'+av+'.png';
  }
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  spr.scale.set(1.7,2.26,1);
  return spr;
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
  }else{
    sc.add(new THREE.HemisphereLight(0x9db4ff,0x1a2418,.38));
    const moonL=new THREE.DirectionalLight(0xbfd0ff,.3); moonL.position.set(-40,50,-30); sc.add(moonL);
    // พระจันทร์เต็มดวงสีซีด
    const moon=new THREE.Mesh(new THREE.CircleGeometry(6,24),
      new THREE.MeshBasicMaterial({color:0xf5f0d8,fog:false}));
    moon.position.set(-45,38,-70); moon.lookAt(0,EYE_H,0); sc.add(moon);
  }

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
  const p=randPos(10);
  spr.position.set(p.x,1.15,p.z); spr.scale.set(1.5,1.5,1);
  scene.add(spr);
  letters.push({ch,spr,born:performance.now()});
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
      const p=randPos(10);
      l.spr.position.set(p.x,1.15,p.z);
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
  renderHudWords(); renderHudInv(); renderHudTop();
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
  banEl.innerHTML=`<div class="adv-ko">💫 พลังหมดแล้ว!<br>
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
}
function sendPos(force){
  if(!myRef) return;
  const now=performance.now();
  if(!force && now-lastNetSend<NET_SEND_MS) return;
  const x=Math.round(camera.position.x*10)/10, z=Math.round(camera.position.z*10)/10,
        y=Math.round(yaw*100)/100;
  if(!force && lastSent && lastSent.x===x && lastSent.z===z && lastSent.yaw===y) return;
  lastNetSend=now; lastSent={x,z,yaw:y};
  myRef.set({
    n:onlineDisplayName(), av:state.playerAvatar||'',
    x, z, yaw:y, ts:firebase.database.ServerValue.TIMESTAMP,
  }).catch(()=>{});
}
function onPeerData(snap){
  const uid=snap.key;
  if(typeof onlineKey==='function' && uid===onlineKey()) return;
  const d=snap.val()||{};
  if(typeof d.x!=='number' || typeof d.z!=='number') return;
  let p=peers[uid];
  if(!p){
    p=peers[uid]={spr:makePeerSprite(d.n,d.av), cur:{x:d.x,z:d.z}, tgt:{x:d.x,z:d.z}, n:d.n||'เพื่อน'};
    p.spr.position.set(d.x,1.5,d.z);
    scene.add(p.spr);
    showBanner(`🧑‍🤝‍🧑 <b>${escapeHTML(p.n)}</b> อยู่ในโลกนี้ด้วย!`);
    tinvCheck(uid);
  }
  p.tgt={x:d.x,z:d.z};
}
function removePeer(uid){
  const p=peers[uid];
  if(!p) return;
  scene.remove(p.spr); p.spr.material.map.dispose(); p.spr.material.dispose();
  delete peers[uid];
}
function netLeave(){
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
    p.spr.position.set(p.cur.x,1.5+Math.sin(now/280+p.cur.x)*.05,p.cur.z);
  });
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
  #adv-words{top:8px;left:8px;max-height:72vh;overflow-y:auto;background:rgba(0,0,0,.42);border-radius:12px;padding:7px 9px;pointer-events:auto}
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
  #adv-hint{bottom:8px;right:8px;color:#fff;font-size:11px;text-shadow:0 1px 3px #000;text-align:right;opacity:.85}
  .adv-touch #adv-hint{display:none}`;
  document.head.appendChild(st);

  overlayEl=document.createElement('div');
  overlayEl.id='adv-overlay';
  overlayEl.innerHTML=`
    <canvas id="adv-canvas"></canvas>
    <div class="adv-hud" id="adv-topbar"><div class="adv-hp"><div class="adv-hp-fill" id="adv-hp"></div></div><span id="adv-coin"></span></div>
    <div class="adv-hud" id="adv-words"></div>
    <canvas class="adv-hud" id="adv-map" width="120" height="120"></canvas>
    <button class="adv-hud" id="adv-exit">🚪 ออก</button>
    <div class="adv-hud" id="adv-hunt"></div>
    <div class="adv-hud" id="adv-inv"></div>
    <div class="adv-hud" id="adv-cross"></div>
    <div id="adv-dmg"></div>
    <div id="adv-banner"></div>
    <div id="adv-scare"><span>👻</span></div>
    <div id="adv-joy"><div id="adv-joy-dot"></div></div>
    <button id="adv-shoot">🔥</button>
    <div class="adv-hud" id="adv-hint"></div>`;
  document.body.appendChild(overlayEl);

  canvasEl=overlayEl.querySelector('#adv-canvas');
  dmgFlashEl=overlayEl.querySelector('#adv-dmg');
  hudWordsEl=overlayEl.querySelector('#adv-words');
  hudInvEl=overlayEl.querySelector('#adv-inv');
  hudHpEl=overlayEl.querySelector('#adv-hp');
  hudCoinEl=overlayEl.querySelector('#adv-coin');
  hudHuntEl=overlayEl.querySelector('#adv-hunt');
  banEl=overlayEl.querySelector('#adv-banner');
  scareEl=overlayEl.querySelector('#adv-scare');
  hintEl=overlayEl.querySelector('#adv-hint');
  mapCv=overlayEl.querySelector('#adv-map'); mapCtx=mapCv.getContext('2d');

  overlayEl.querySelector('#adv-exit').addEventListener('click',confirmExit);
  const shootBtn=overlayEl.querySelector('#adv-shoot');
  shootBtn.addEventListener('touchstart',e=>{ e.preventDefault(); shoot(); },{passive:false});
  shootBtn.addEventListener('click',e=>{ e.preventDefault(); shoot(); });

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
  document.addEventListener('keydown',e=>{ if(overlayEl.classList.contains('on')) keys[e.code]=true; });
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
        if(t.target.closest('#adv-shoot,#adv-exit,#adv-words,#adv-banner')) continue;
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
          yaw-=(t.clientX-lookTouch.x)*.005;
          pitch=Math.max(-1.25,Math.min(1.25,pitch-(t.clientY-lookTouch.y)*.005));
          lookTouch.x=t.clientX; lookTouch.y=t.clientY;
        }
      }
    },{passive:true});
    const endTouch=e=>{
      for(const t of e.changedTouches){
        if(t.identifier===joyId){ joyId=null; joy.on=false; joy.dx=joy.dy=0;
          dotEl.style.transform='translate(-50%,-50%)';
          joyEl.style.left='18px'; joyEl.style.top='auto'; joyEl.style.bottom='18px'; }
        if(lookTouch && t.identifier===lookTouch.id) lookTouch=null;
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
  letters.forEach(l=>{ l.spr.position.y=1.15+Math.sin(now/400+l.spr.position.x*2)*.12; });
}

/* ============================================================
   Loop หลัก
   ============================================================ */
function loop(){
  if(!running) return;
  rafId=requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.1), now=performance.now();
  tickPlayer(dt,now);
  if(M.ghost){ tickGhosts(dt,now); }
  else{
    tickMonsters(dt,now);
    tickShots(dt);
    if(now-lastSpawn>M.monSpawnMs){ lastSpawn=now; spawnMonster(); }
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
  mode=(md==='haunt')?'haunt':'adv';
  M=MODES[mode];
  if(mode==='adv' && !state.advTicket){ toast('🎫 ต้องมีตั๋วโลกผจญภัยก่อนนะ'); return; }
  if(mode==='haunt' && !state.hauntTicket){ toast('🎃 ต้องมีตั๋วโลกผีสิงก่อนนะ'); return; }
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
  scene=worlds[mode].scene; trees=worlds[mode].trees;

  hp=100; sessionCoins=0; sessionWords=0; inv={}; keys={}; yaw=0; pitch=0;
  camera.position.set(0,EYE_H,0);
  if(!Array.isArray(state[M.doneKey])) state[M.doneKey]=[];
  words=pickWords(GUIDE_WORDS);
  words.forEach(spawnLettersForWord);
  for(let i=0;i<8;i++) spawnLetter('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]);
  if(M.ghost){ for(let i=0;i<M.ghostMax;i++) spawnGhost(true); }
  else spawnMonster();
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  scareEl.classList.remove('on');
  overlayEl.classList.toggle('adv-haunt',mode==='haunt');
  hintEl.textContent=M.hint;
  hudHuntEl.style.display='none';

  overlayEl.classList.add('on');
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  renderHudTop(); renderHudWords(); renderHudInv();
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
    camera:()=>camera, damagePlayer, caught, spawnGhost, tinvCheck, onPeerData, exitWorld,
    give(ch,n){ inv[ch]=(inv[ch]||0)+(n||1); renderHudInv(); renderHudWords(); tryCompleteWords(); },
  },
};
})();
