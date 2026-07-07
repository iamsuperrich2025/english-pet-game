/* ============================================================
   adventure3d.js — โลกผจญภัย 3D (คิว 7725691507 ข้อ 8)
   First-person เก็บตัวอักษรอังกฤษมาประกอบคำศัพท์ (guideline 10 คำ
   ตามระดับชั้น ไม่ซ้ำคำที่ทำแล้ว) · minimap เรดาร์ · monsters สุ่มเกิด
   ยิงสู้ได้ · พลังหมด → ออก Lobby ต้องจ่ายค่ารักษา 1,000 ก่อนเข้าใหม่
   ▶ โหลดแบบ dynamic หลัง js/vendor/three.min.js (global THREE) เท่านั้น
   ▶ ใช้ globals ของเกม: state/saveState/addCoins/vocabForStudent/
     shuffle/sfx/toast/fmtNum/escapeHTML/renderDashboard
   ============================================================ */
(function(){
'use strict';

/* ---------- ค่ากติกา ---------- */
const WORD_REWARD    = 15;        // เหรียญ/คำ (ผู้ใช้เคาะ 7 ก.ค. — 3 เท่าของเกมจับคู่)
const MONSTER_REWARD = 2;         // เหรียญ/ตัว เมื่อยิง monster แตก
const GUIDE_WORDS    = 10;        // จำนวนคำ guideline บนจอ (8.1)
const RELOCATE_MS    = 75000;     // ตัวอักษรค้างครบเวลานี้ → สุ่มย้ายที่ (8.2)
const HALF           = 60;        // ครึ่งความกว้างแผนที่ (โลก 120×120)
const PLAYER_SPEED   = 6;         // m/s
const MONSTER_SPEED  = 3.4;       // ช้ากว่าผู้เล่น วิ่งหนีทันเสมอ
const MONSTER_MAX    = 4;
const MONSTER_SPAWN_MS = 16000;
const MONSTER_DMG    = 10;        // ดาเมจต่อครั้งที่โดนตัว
const MONSTER_HP     = 2;         // ยิง 2 นัดแตก
const SHOOT_GAP_MS   = 280;
const PICK_DIST      = 1.6;       // ระยะเดินเก็บตัวอักษร
const EYE_H          = 1.6;

/* ---------- สถานะรอบเล่น ---------- */
let built=false, running=false, rafId=0;
let renderer, scene, camera, clock;
let yaw=0, pitch=0;
let hp=100, sessionCoins=0, sessionWords=0;
let inv={};                       // ตัวอักษรในกระเป๋า {a:2,...}
let words=[];                     // guideline [{en,th}]
let letters=[];                   // ตัวอักษรในโลก [{ch,spr,born}]
let monsters=[];                  // [{spr,hp,pos,tgt,wanderAt,hitAt}]
let shots=[];                     // [{mesh,dir,life}]
let trees=[];                     // จุดชนต้นไม้ [{x,z,r}]
let keys={}, joy={on:false,dx:0,dy:0}, lookTouch=null, lastShot=0, lastRelocate=0, lastSpawn=0;
let dmgFlashEl, hudWordsEl, hudInvEl, hudHpEl, hudCoinEl, mapCv, mapCtx, banEl, overlayEl, canvasEl;
let texCache={};

/* ============================================================
   คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6)
   ============================================================ */
function wordPool(exclude){
  const cur = words.map(w=>w.en);
  let pool = vocabForStudent()
    .filter(([en])=>/^[a-z]{2,9}$/i.test(en))
    .filter(([en])=>!state.advDone.includes(en.toLowerCase()) && !cur.includes(en.toLowerCase()));
  if(!pool.length && exclude!==true){
    // ประกอบครบทุกคำในระดับชั้นแล้ว → เริ่มรอบใหม่ (คำเติมไม่มีวันหมดตามสเปก 8.6)
    state.advDone = [];
    saveState();
    return wordPool(true);
  }
  return pool;
}
function pickWords(n){
  return shuffle(wordPool()).slice(0,n).map(([en,th])=>({en:en.toLowerCase(), th}));
}

/* ============================================================
   Texture ตัวอักษร / monster (canvas → sprite)
   ============================================================ */
const TILE_COLORS = ['#ff8a65','#4fc3f7','#aed581','#ffd54f','#ba68c8','#f06292','#4dd0e1','#ff8a80'];
function letterTexture(ch){
  const key='L'+ch;
  if(texCache[key]) return texCache[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=128;
  const c=cv.getContext('2d');
  const col=TILE_COLORS[(ch.charCodeAt(0)-97)%TILE_COLORS.length];
  c.beginPath();
  if(c.roundRect) c.roundRect(8,8,112,112,26); else c.rect(8,8,112,112);  // roundRect: Chrome 99+ · เครื่องเก่าใช้เหลี่ยม
  c.fillStyle=col; c.fill();
  c.lineWidth=8; c.strokeStyle='rgba(255,255,255,.9)'; c.stroke();
  c.fillStyle='#fff'; c.font='900 84px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText(ch.toUpperCase(),64,72);
  const t=new THREE.CanvasTexture(cv);
  texCache[key]=t; return t;
}
const MONSTER_EMOJI=['👾','🕷️','🦇','👻'];
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

/* ============================================================
   สร้างฉาก static ครั้งเดียว (พื้น/ต้นไม้/หิน/รั้ว/แสง)
   ============================================================ */
function buildScene(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x8ed4f7);
  scene.fog=new THREE.Fog(0x8ed4f7, 30, 95);

  scene.add(new THREE.HemisphereLight(0xffffff,0x6faa50,1.05));
  const sun=new THREE.DirectionalLight(0xfff2cc,.8); sun.position.set(30,60,20); scene.add(sun);

  const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(HALF*2+20,HALF*2+20),
    new THREE.MeshLambertMaterial({color:0x7ec850}));
  ground.rotation.x=-Math.PI/2; scene.add(ground);

  // รั้วรอบแผนที่ (มองเห็นขอบเขต)
  const fenceMat=new THREE.MeshLambertMaterial({color:0xb98a5a});
  [[0,-HALF],[0,HALF]].forEach(([x,z])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(HALF*2,1.6,.4),fenceMat);
    f.position.set(x,.8,z); scene.add(f);
  });
  [[-HALF,0],[HALF,0]].forEach(([x,z])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(.4,1.6,HALF*2),fenceMat);
    f.position.set(x,.8,z); scene.add(f);
  });

  // ต้นไม้ (เก็บจุดชนไว้ให้เดินอ้อม) + หิน + ดอกไม้
  const trunkG=new THREE.CylinderGeometry(.35,.5,2.6,7);
  const trunkM=new THREE.MeshLambertMaterial({color:0x8b5a2b});
  const crownG=new THREE.IcosahedronGeometry(2.1,0);
  const crownM=new THREE.MeshLambertMaterial({color:0x2e8b3d});
  for(let i=0;i<42;i++){
    const x=(Math.random()*2-1)*(HALF-6), z=(Math.random()*2-1)*(HALF-6);
    if(Math.hypot(x,z)<8) continue;                 // เว้นจุดเกิดผู้เล่น
    const tr=new THREE.Mesh(trunkG,trunkM); tr.position.set(x,1.3,z);
    const cr=new THREE.Mesh(crownG,crownM); cr.position.set(x,3.6,z);
    cr.rotation.y=Math.random()*Math.PI;
    scene.add(tr,cr); trees.push({x,z,r:1.0});
  }
  const rockG=new THREE.DodecahedronGeometry(1,0);
  const rockM=new THREE.MeshLambertMaterial({color:0x9e9e9e});
  for(let i=0;i<14;i++){
    const x=(Math.random()*2-1)*(HALF-5), z=(Math.random()*2-1)*(HALF-5);
    if(Math.hypot(x,z)<8) continue;
    const r=new THREE.Mesh(rockG,rockM);
    const s=.5+Math.random()*.9;
    r.scale.set(s,s*.7,s); r.position.set(x,s*.4,z); r.rotation.y=Math.random()*3;
    scene.add(r); trees.push({x,z,r:s*.9});
  }
  const flG=new THREE.SphereGeometry(.16,6,5);
  ['#ff6b81','#ffd54f','#fff','#b388ff'].forEach(col=>{
    const m=new THREE.MeshBasicMaterial({color:col});
    for(let i=0;i<22;i++){
      const f=new THREE.Mesh(flG,m);
      f.position.set((Math.random()*2-1)*(HALF-4),.16,(Math.random()*2-1)*(HALF-4));
      scene.add(f);
    }
  });
}

/* ============================================================
   ตัวอักษรในโลก (8.2) — spawn/เก็บ/ย้ายที่ตามเวลา
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
      // กันคำสองคำแย่งตัวอักษรก้อนเดียวกันใน inventory: หักที่ใช้ไปแล้วออก
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
  state.advDone.push(w.en);
  addCoins(WORD_REWARD);
  sessionCoins+=WORD_REWARD; sessionWords++;
  sfx.levelup();
  if(state.haptic!==false && navigator.vibrate) navigator.vibrate(60);
  showBanner(`🎉 <b>${escapeHTML(w.en.toUpperCase())}</b> = ${escapeHTML(w.th)}<br><span class="adv-ban-coin">+${WORD_REWARD} 🪙</span>`);
  const fresh=pickWords(1);                 // เติมคำใหม่ให้ครบ 10 (8.4)
  fresh.forEach(nw=>{ words.push(nw); spawnLettersForWord(nw); });
  ensureCoverage();
  saveState();
  renderHudWords(); renderHudInv(); renderHudTop();
}

/* ============================================================
   Monsters (8.5) — สุ่มเกิด ไล่ผู้เล่น · ยิงสู้ได้ (ผู้ใช้เคาะ)
   ============================================================ */
function spawnMonster(){
  if(monsters.length>=MONSTER_MAX) return;
  const emo=MONSTER_EMOJI[Math.floor(Math.random()*MONSTER_EMOJI.length)];
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTexture(emo),transparent:true}));
  const p=randPos(22);
  spr.position.set(p.x,1.2,p.z); spr.scale.set(2.2,2.2,1);
  scene.add(spr);
  monsters.push({spr,hp:MONSTER_HP,tgt:randPos(0),wanderAt:0,hitAt:0});
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
    if(d<15){ tx=px; tz=pz; sp=MONSTER_SPEED; }            // เห็นผู้เล่น → ไล่
    else{
      if(now>m.wanderAt){ m.tgt=randPos(0); m.wanderAt=now+4000+Math.random()*4000; }
      tx=m.tgt.x; tz=m.tgt.z; sp=MONSTER_SPEED*.45;
    }
    const dd=Math.hypot(tx-mp.x,tz-mp.z);
    if(dd>.3){ mp.x+=(tx-mp.x)/dd*sp*dt; mp.z+=(tz-mp.z)/dd*sp*dt; }
    mp.y=1.2+Math.sin(now/300+mp.x)*0.15;                  // ลอยดุ๊กดิ๊ก
    if(d<1.5 && now-m.hitAt>1200){                         // ชนผู้เล่น → เจ็บ
      m.hitAt=now;
      damagePlayer(MONSTER_DMG);
      const kx=(px-mp.x)/(d||1), kz=(pz-mp.z)/(d||1);      // เด้งถอยเล็กน้อย
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

/* ---------- ยิง ---------- */
function shoot(){
  const now=performance.now();
  if(!running || now-lastShot<SHOOT_GAP_MS) return;
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
   พลังหมด (8.5) — ออก Lobby + ติดสถานะบาดเจ็บ (รักษา 1,000 ที่การ์ดตั๋ว)
   ============================================================ */
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
  mapCtx.fillStyle='rgba(20,40,20,.72)';
  mapCtx.beginPath(); mapCtx.arc(S/2,S/2,S/2,0,7); mapCtx.fill();
  const wx=v=>S/2+v*sc, wz=v=>S/2+v*sc;
  mapCtx.fillStyle='#ffd54f';
  letters.forEach(l=>{ mapCtx.beginPath(); mapCtx.arc(wx(l.spr.position.x),wz(l.spr.position.z),2.2,0,7); mapCtx.fill(); });
  mapCtx.fillStyle='#ff5252';
  monsters.forEach(m=>{ mapCtx.beginPath(); mapCtx.arc(wx(m.spr.position.x),wz(m.spr.position.z),3,0,7); mapCtx.fill(); });
  // ผู้เล่น: สามเหลี่ยมหันตามทิศ
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
  #adv-inv{bottom:8px;left:50%;transform:translateX(-50%);max-width:70vw;background:rgba(0,0,0,.42);
    border-radius:12px;padding:5px 10px;display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
  .adv-inv-ch{color:#fff;font-weight:800;font-size:13px;background:rgba(255,255,255,.18);border-radius:6px;padding:1px 6px}
  .adv-inv-empty{color:#eee;font-size:12px}
  #adv-cross{top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;
    background:rgba(255,255,255,.9);box-shadow:0 0 4px #000}
  #adv-dmg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(255,0,0,.55));opacity:0}
  #adv-dmg.on{animation:advDmg .5s ease-out}
  @keyframes advDmg{0%{opacity:1}100%{opacity:0}}
  #adv-banner{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#fff;
    font-size:20px;text-shadow:0 2px 6px #000;opacity:0;pointer-events:none;background:rgba(0,0,0,.55);
    border-radius:16px;padding:12px 22px;max-width:86vw}
  #adv-banner.show{animation:advBan 2.4s ease-out}
  #adv-banner.stay{opacity:1;animation:none;pointer-events:auto}
  .adv-ban-coin{color:#ffd54f;font-weight:900}
  @keyframes advBan{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}
    20%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
  .adv-ko{font-size:22px;font-weight:800}
  .adv-ko small{font-size:14px;font-weight:600;color:#ffcdd2}
  .adv-ko-btn{margin-top:10px;background:#43a047;color:#fff;border:2px solid #fff;border-radius:12px;
    font-weight:800;font-size:16px;padding:9px 20px;font-family:inherit}
  #adv-joy{position:absolute;bottom:18px;left:18px;width:110px;height:110px;border-radius:50%;
    background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.4);pointer-events:none;display:none}
  #adv-joy-dot{position:absolute;left:50%;top:50%;width:44px;height:44px;border-radius:50%;
    background:rgba(255,255,255,.5);transform:translate(-50%,-50%)}
  #adv-shoot{position:absolute;bottom:26px;right:22px;width:76px;height:76px;border-radius:50%;pointer-events:auto;
    background:rgba(255,167,38,.9);border:3px solid #fff;font-size:32px;display:none}
  .adv-touch #adv-joy,.adv-touch #adv-shoot{display:block}
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
    <div class="adv-hud" id="adv-inv"></div>
    <div class="adv-hud" id="adv-cross"></div>
    <div id="adv-dmg"></div>
    <div id="adv-banner"></div>
    <div id="adv-joy"><div id="adv-joy-dot"></div></div>
    <button id="adv-shoot">🔥</button>
    <div class="adv-hud" id="adv-hint">คลิกจอ=ล็อกเมาส์ · WASD เดิน · คลิกยิง · Esc ปลดเมาส์แล้วค่อยกดออก</div>`;
  document.body.appendChild(overlayEl);

  canvasEl=overlayEl.querySelector('#adv-canvas');
  dmgFlashEl=overlayEl.querySelector('#adv-dmg');
  hudWordsEl=overlayEl.querySelector('#adv-words');
  hudInvEl=overlayEl.querySelector('#adv-inv');
  hudHpEl=overlayEl.querySelector('#adv-hp');
  hudCoinEl=overlayEl.querySelector('#adv-coin');
  banEl=overlayEl.querySelector('#adv-banner');
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
  askConfirm(`<h2>🚪 ออกจากโลกผจญภัย</h2>
    <p style="font-size:15px;margin:6px 0">รอบนี้เก็บได้ <b>${sessionWords}</b> คำ · <b>+${fmtNum(sessionCoins)}</b> 🪙<br>
    <small>กลับมาเล่นต่อเมื่อไหร่ก็ได้ ตั๋วใช้ได้ตลอด</small></p>`,
    'ออกเลย', ()=>exitWorld());
  // askConfirm ไม่มี callback ตอนยกเลิก → เฝ้า overlay หาย แล้วเล่นต่อ
  const watch=setInterval(()=>{
    if(!document.querySelector('.levelup-overlay')){
      clearInterval(watch);
      if(overlayEl.classList.contains('on') && hp>0 && !running){ running=true; loop(); }
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

/* ---------- เดิน + กันทะลุต้นไม้/รั้ว ---------- */
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
  // ตัวอักษรลอยดุ๊กดิ๊ก
  letters.forEach(l=>{ l.spr.position.y=1.15+Math.sin(now/400+l.spr.position.x*2)*.12; });
}

/* ============================================================
   Loop หลัก
   ============================================================ */
function step(dt,now){
  tickPlayer(dt,now);
  tickMonsters(dt,now);
  tickShots(dt);
  if(now-lastSpawn>MONSTER_SPAWN_MS){ lastSpawn=now; spawnMonster(); }
  if(now-lastRelocate>5000){ lastRelocate=now; relocateLetters(now); ensureCoverage(); }
  drawMinimap();
  renderer.render(scene,camera);
}
function loop(){
  if(!running) return;
  rafId=requestAnimationFrame(loop);
  step(Math.min(clock.getDelta(),.1), performance.now());
}

/* ============================================================
   เข้า/ออกโลก
   ============================================================ */
function start(){
  if(!state.advTicket){ toast('🎫 ต้องมีตั๋วโลกผจญภัยก่อนนะ'); return; }
  if(state.advHurt){ toast('🤕 ยังบาดเจ็บอยู่ ต้องรักษาตัวก่อนเข้าโลกผจญภัย'); return; }
  if(!built){
    buildDom();
    renderer=new THREE.WebGLRenderer({canvas:canvasEl,antialias:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    camera=new THREE.PerspectiveCamera(72,window.innerWidth/window.innerHeight,.1,220);
    clock=new THREE.Clock();
    buildScene();
    built=true;
  }
  // รีเซ็ตรอบเล่น
  while(letters.length) removeLetter(0);
  monsters.slice().forEach(m=>{ scene.remove(m.spr); m.spr.material.dispose(); }); monsters=[];
  shots.forEach(s=>{ scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); }); shots=[];
  hp=100; sessionCoins=0; sessionWords=0; inv={}; keys={}; yaw=0; pitch=0;
  camera.position.set(0,EYE_H,0);
  if(!Array.isArray(state.advDone)) state.advDone=[];
  words=pickWords(GUIDE_WORDS);
  words.forEach(spawnLettersForWord);
  for(let i=0;i<8;i++) spawnLetter('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]);
  spawnMonster();
  banEl.classList.remove('show','stay'); banEl.innerHTML='';

  overlayEl.classList.add('on');
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  renderHudTop(); renderHudWords(); renderHudInv();
  lastSpawn=performance.now(); lastRelocate=performance.now();
  clock.getDelta();
  running=true;
  loop();
  showBanner('🌍 <b>โลกผจญภัย!</b><br><small>เก็บตัวอักษรมาประกอบคำทางซ้าย · ระวัง monster 👾</small>');
}

function exitWorld(){
  running=false;
  cancelAnimationFrame(rafId);
  if(document.pointerLockElement) document.exitPointerLock();
  overlayEl.classList.remove('on');
  banEl.classList.remove('show','stay'); banEl.innerHTML='';
  saveState();
  renderDashboard();
  if(sessionWords>0 || sessionCoins>0)
    toast(`🌍 กลับจากโลกผจญภัย — ได้ ${sessionWords} คำ · +${fmtNum(sessionCoins)} 🪙`);
}

window.Adventure3D={ start };
// ช่องทดสอบสำหรับ preview (testkit) — เกมจริงไม่เรียกใช้
window.Adventure3D._t={
  get camera(){return camera}, get letters(){return letters}, get monsters(){return monsters},
  get words(){return words}, get inv(){return inv}, get hp(){return hp}, get running(){return running},
  damage:damagePlayer, shoot, spawnMonster, step,
};
})();
