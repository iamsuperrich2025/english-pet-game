"use strict";
/* ============================================================
   🎯 shootword.js — เกม "ยิงเป้าคำศัพท์" (Carnival Word Shooting) รอบ 917
   ผู้ใช้สั่ง 2 ส.ค. 2026 (อนุมัติทำเป็นโลก 3D เต็มรูปแบบ):
     ① โลก 3D มุมมองบุคคลที่หนึ่ง — ยืนในซุ้มยิงปืนของสวนสนุก สีสันสดใสน่ารัก
     ② ใช้ภาพปืนของผู้ใช้ img/gun/hold.webp (ถือ) + aim.webp (เล็งผ่านศูนย์) —
        ย่อจาก ww2_hold_gun.png / ww2_aim_gun.png (ต้นฉบับเก็บในเครื่อง ไม่ commit)
     ③ แผ่นตัวอักษรวางบนหิ้งไม้กระดาน 3 ชั้น — โดนยิงแล้ว "พับถอยหลัง" แล้วเด้งดึ๋งกลับขึ้นมา
     ④ เสียงปืนสไตล์ "ปืนอัดลม" (สังเคราะห์ WebAudio ทั้งหมด ไม่ใช้ไฟล์)
     ⑤ ยิงสะกดคำตามที่ระบบกำหนด (คำตามระดับชั้นเท่านั้น — กฎเหล็กเดียวกับค้นหาคำ/พิมพ์คำ)
     ⑥ เล่นคนเดียว · แต้มสะสมตลอดกาล state.sgScore → กระดานอันดับแท็บ 🎯 (field sg)
        + รางวัลรายเดือน Top 10 (10,000–1,000) ผ่าน js/sgaward.js — กติกาเดียวกับ 🔎 ค้นหาคำ
   กติกาแต้ม (เรตเดียวกับ 🔎/⌨️): ครบ 1 คำ = ความยาว×2 แต้ม+เหรียญ · ไม่ยิงพลาดเลย +5
   โบนัสเป็ด 🦆 วิ่งผ่านหิ้ง ยิงโดน +3 เหรียญ (ไม่นับแต้มอันดับ — อันดับวัดที่คำล้วน ๆ)
   เข้าเกม: ปุ่มราง #btn-rail-shootword (โหลด three.min.js ครั้งแรกตอนกดเท่านั้น — ไม่ถ่วงล็อบบี้)
   📐 กฎทองข้อ 7: HUD ทุกชิ้น clamp ตาม vh ทดสอบ 812×375 · ไม่มี scrollbar
   ============================================================ */
(function(){
  /* ========== TUNE ZONE — ตำแหน่ง/ขนาดภาพปืน (จูนกับภาพจริงแล้ว อย่าเดาใหม่) ========== */
  const TUNE = {
    FOV: 58, FOV_AIM: 30,       // มุมกล้องปกติ/ตอนเล็ง (เล็ง = ซูมเข้า)
    HOLD_H: 64,                 // สูงภาพปืนถือ (vh)
    HOLD_R: -2, HOLD_B: -4,     // ชดเชยขอบขวา/ล่าง (vh — ติดลบ = ล้นขอบเล็กน้อย)
    MUZ_X: 0.14, MUZ_Y: 0.06,   // จุดปลายกระบอก (สัดส่วนบนภาพ hold — ไว้วางแฟลชอัดลม)
    AIM_H: 122,                 // สูงภาพเล็ง (vh)
    AIM_CX: 0.507, AIM_CY: 0.425, // จุดกึ่งกลางรูศูนย์เล็งบนภาพ (วัดจาก alpha จริงด้วย sight.py)
    AIM_SX: 50, AIM_SY: 50,     // จุดบนจอที่รูศูนย์ทาบ (% กว้าง / % สูง) = จุดที่กระสุนออก
    SNAP_R: 0.045,              // 🎯 รอบ 932: รัศมีช่วยเล็ง (สัดส่วนด้านสั้นของจอ) ~22px ที่จอสูง 491
  };                            //    ครึ่งหนึ่งของระยะห่างระหว่างแผ่น (~24px) → เล็งใกล้ใบไหนโดนใบนั้น ไม่ข้ามไปใบอื่น
  const MINLEN=3, MAXLEN=10;
  const PT_PER_LETTER=2, PERFECT_BONUS=5;      // เรตเดียวกับ 🔎 ค้นหาคำ / ⌨️ พิมพ์คำ
  const DUCK_COIN=3;                           // 🦆 โบนัสเป็ด (เหรียญล้วน ไม่เข้าแต้มอันดับ)
  const COOLDOWN=310;                          // ms ต่อนัด (ปืนอัดลมต้องปั๊มลม)
  const FOLD_ANGLE=1.78, FOLD_DUR=0.13;        // 🎯 รอบ 937: ยิงโดน → แผ่นพับแรง+ไวขึ้น (เดิม 1.5rad/0.2s) ให้รู้สึกหนักหน่วงชัดเจน
  const ROWS=[                                 // หิ้ง 3 ชั้นไล่ระดับแบบอัฒจันทร์ — ไกลขึ้น สูงขึ้น แผ่นใหญ่ขึ้น
    /* 🎯 รอบ 923: ผู้ใช้สั่งขยายระยะเป้าออกไปอีก 3 เท่า — คูณ z อย่างเดียว (สูง/กว้าง/ขนาดแผ่นเท่าเดิม)
       ยิงยากขึ้นตามระยะจริง (raycaster แม่นทุกระยะอยู่แล้ว) โหมดเล็งซูม FOV แคบลงช่วยชดเชยความไกล */
    {z:-27,  y:1.05, n:6, w:8.6,  size:0.95},  // (ตอนวัดจริง ชั้นเท่ากันจะบังกันหมด — ต้องยกชั้นหลังพ้นหัวแผ่นชั้นหน้า)
    {z:-40.5,y:2.35, n:6, w:11.2, size:1.12},
    {z:-54,  y:4.35, n:6, w:13.8, size:1.32},
  ];
  const AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const PASTEL=['#ff8a80','#ffd180','#ffff8d','#ccff90','#80d8ff','#b388ff','#ff80ab','#a7ffeb'];

  /* ---------- สถานะเกม ---------- */
  let three=false, built=false, running=false, opening=false;
  let overlay=null, renderer=null, scene=null, camera=null, clock=0, lastT=0;
  let shakeMag=0;                              // 🎥 รอบ 938: screen shake ตอนโดนแผ่น (ดูฟังก์ชัน shakeCam)
  /* 🎯 รอบ 932 (บั๊กผู้ใช้ "ยิงตัวอักษรแล้วไม่มีอะไรเกิดขึ้น"): pitch เริ่มต้นเดิม 0.10 ตั้งไว้ตอนเป้ายังอยู่ใกล้
     พอรอบ 923 ขยายระยะเป้า 3 เท่า มุมมองไปยังหิ้งแบนลงเหลือ ~0.00-0.06 rad → กล้องเงยสูงข้ามหัวแผ่นตลอด
     กากบาท/ปุ่มยิง (ยิงกลางจอเสมอ) จึงพุ่งไปโดนฉากหลัง ไม่โดนแผ่นสักที · 0.04 = กลางกลุ่มเป้าทั้ง 3 แถว */
  let yaw=0, pitch=0.04, aimMode=false, lastShot=0, boardLock=0;
  let word=null, pos=0, misses=0, streak=0;    // คำปัจจุบัน {w,th} · ตำแหน่งตัวถัดไป · ยิงพลาดในคำนี้
  let queue=[], qGrade=null;                   // คิวคำไม่ซ้ำจนหมดคลัง (สูตรเดียวกับ ws)
  let plates=[], ducks=[], balloons=[], clouds=[], bulbs=[], tickers=[];
  let wheelGrp=null, raycaster=null, texCache={};
  let hudCoins=null, hudChip=null, wordBar=null, fxEl=null, hintEl=null, streakEl=null;

  const grade=()=> (typeof state!=='undefined'&&state.student)?state.student.grade:'ป.1';
  const shuffle=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  /* ---------- คลังคำตามระดับชั้น (กฎเหล็ก — vocabForStudent เท่านั้น) ---------- */
  function pool(){
    const seen=new Set(), out=[];
    const src=(typeof vocabForStudent==='function')?vocabForStudent():[];
    src.forEach(pair=>{
      const w=String(pair[0]||'').toUpperCase().replace(/[^A-Z]/g,'');
      if(w.length>=MINLEN && w.length<=MAXLEN && !seen.has(w)){ seen.add(w); out.push({w, th:pair[1]||''}); }
    });
    return out;
  }
  function takeWord(){
    const g=grade();
    if(qGrade!==g || !queue.length){ queue=shuffle(pool()); qGrade=g; }
    return queue.shift()||null;
  }

  /* ============================================================
     🔊 เสียง — สังเคราะห์เองทั้งหมด (ปืนอัดลม/แผ่นพับ/สปริงเด้ง/เป็ด)
     ============================================================ */
  let AC=null, NOISE=null;
  function ac(){
    if(typeof state!=='undefined' && !state.sound) return null;
    try{
      AC=AC||new (window.AudioContext||window.webkitAudioContext)();
      if(AC.state==='suspended') AC.resume().catch(()=>{});
      return AC;
    }catch(e){ return null; }
  }
  function noise(ctx){
    if(NOISE) return NOISE;
    const b=ctx.createBuffer(1, ctx.sampleRate*0.5, ctx.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    return NOISE=b;
  }
  /* ยิงเสียง noise ผ่าน filter สั้น ๆ (ก้อนหลักของเสียงกลไกทุกแบบ) */
  function puffN(ctx,t,dur,type,freq,q,vol){
    const s=ctx.createBufferSource(); s.buffer=noise(ctx);
    const f=ctx.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q||1;
    const g=ctx.createGain();
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    s.connect(f); f.connect(g); g.connect(ctx.destination);
    s.start(t); s.stop(t+dur+0.02);
  }
  function tone(ctx,t,dur,type,f0,f1,vol){
    const o=ctx.createOscillator(); o.type=type;
    o.frequency.setValueAtTime(f0,t);
    if(f1) o.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);
    const g=ctx.createGain();
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t+dur+0.02);
  }
  const SND={
    /* 🔫 ปืนอัดลม: "พสึ่บ!" ลมอัด + ทึบเบา ๆ + กิ๊กกลไก แล้วตามด้วยเสียงปั๊มลุ้นนัดต่อไป */
    shot(){ const c=ac(); if(!c)return; const t=c.currentTime;
      puffN(c,t,0.09,'bandpass',1500,0.7,0.5);           // ลมพุ่ง
      puffN(c,t,0.05,'highpass',4500,1,0.18);            // ซี้ดปลายเสียง
      tone(c,t,0.07,'sine',150,70,0.32);                 // ทึบในกระบอก
      tone(c,t,0.015,'square',2100,0,0.1);               // กิ๊กไก
      puffN(c,t+0.17,0.05,'bandpass',700,2,0.14);        // ปั๊มลม chk-
      puffN(c,t+0.24,0.05,'bandpass',560,2,0.12);        // -chk
    },
    plink(){ const c=ac(); if(!c)return; const t=c.currentTime;   // โดนแผ่นโลหะ/ไม้ "ติ๊ง+ก๊อก" (รอบ 937: ดังขึ้น)
      tone(c,t,0.12,'triangle',2050,1450,0.34);
      tone(c,t,0.1,'sine',2900,2300,0.14);                // ประกายเสียงแหลมเสริมให้ "ติ๊ง" เด่นขึ้น
      puffN(c,t,0.03,'highpass',3200,1,0.24);
      tone(c,t+0.01,0.08,'sine',240,140,0.36);            // ก๊อกไม้
    },
    spring(){ const c=ac(); if(!c)return; const t=c.currentTime;  // 🪀 แผ่นเด้งกลับ "ดึ๋ง"
      const o=c.createOscillator(), g=c.createGain(); o.type='sine';
      [420,270,390,300,360].forEach((f,i)=>o.frequency.setValueAtTime(f,t+i*0.055));
      g.gain.setValueAtTime(0.1,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.32);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+0.34);
    },
    miss(){ const c=ac(); if(!c)return; const t=c.currentTime;    // ยิงโดนแผ่นผิดตัว (นุ่ม ไม่ดุ)
      tone(c,t,0.16,'sawtooth',185,120,0.06);
    },
    thud(){ const c=ac(); if(!c)return;                            // ยิงไม่โดนอะไรเลย
      puffN(c,c.currentTime,0.08,'lowpass',420,1,0.2);
    },
    quack(){ const c=ac(); if(!c)return; const t=c.currentTime;   // 🦆 ก้าบ! (2 พยางค์)
      [0,0.11].forEach(d=>{
        const o=c.createOscillator(), f=c.createBiquadFilter(), g=c.createGain();
        o.type='sawtooth'; o.frequency.setValueAtTime(430,t+d); o.frequency.exponentialRampToValueAtTime(210,t+d+0.09);
        f.type='bandpass'; f.frequency.value=900; f.Q.value=2;
        g.gain.setValueAtTime(0.16,t+d); g.gain.exponentialRampToValueAtTime(0.001,t+d+0.1);
        o.connect(f); f.connect(g); g.connect(c.destination); o.start(t+d); o.stop(t+d+0.12);
      });
    },
    fly(){ const c=ac(); if(!c)return; tone(c,c.currentTime,0.16,'sine',620,1400,0.09); },  // ตัวอักษรลอยเข้าช่อง
  };

  /* ============================================================
     🖼️ Canvas textures — ทุกลายวาดเอง (ธีมสวนสนุกพาสเทล)
     ============================================================ */
  function cv(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
  function tex(c){ const t=new THREE.CanvasTexture(c); t.anisotropy=2; return t; }
  /* แผ่นตัวอักษร — การ์ดขาวขอบสี ตัวอักษรใหญ่ (cache ต่อ ตัวอักษร+สี) */
  function letterTex(ch,ci){
    const k=ch+ci;
    if(texCache[k]) return texCache[k];
    const c=cv(160,160), q=c.getContext('2d');
    q.fillStyle=PASTEL[ci%PASTEL.length];
    q.beginPath(); q.roundRect(4,4,152,152,26); q.fill();
    q.fillStyle='#fffdf6';
    q.beginPath(); q.roundRect(16,16,128,128,18); q.fill();
    q.fillStyle='#35323e';
    q.font='900 92px Kanit, system-ui'; q.textAlign='center'; q.textBaseline='middle';
    q.fillText(ch,80,88);
    return texCache[k]=tex(c);
  }
  function stripeTex(c1,c2,vertical){       // ผ้าใบลายทาง (กันสาด/เต็นท์/เสา)
    const c=cv(128,128), q=c.getContext('2d');
    for(let i=0;i<8;i++){ q.fillStyle=i%2?c1:c2;
      if(vertical) q.fillRect(i*16,0,16,128); else q.fillRect(0,i*16,128,16); }
    const t=tex(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
  }
  function woodTex(){
    const c=cv(128,128), q=c.getContext('2d');
    q.fillStyle='#c68b59'; q.fillRect(0,0,128,128);
    q.strokeStyle='rgba(120,70,30,.35)'; q.lineWidth=2;
    for(let i=0;i<7;i++){ q.beginPath(); q.moveTo(0,10+i*18+Math.random()*6); q.bezierCurveTo(40,8+i*18,90,16+i*18,128,10+i*18); q.stroke(); }
    const t=tex(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
  }
  function grassTex(){
    const c=cv(256,256), q=c.getContext('2d');
    q.fillStyle='#9ede7c'; q.fillRect(0,0,256,256);
    for(let i=0;i<420;i++){ q.fillStyle=Math.random()<0.5?'#8fd56d':'#aee88d';
      q.fillRect(Math.random()*256,Math.random()*256,3,3); }
    for(let i=0;i<26;i++){ const x=Math.random()*256,y=Math.random()*256;   // ดอกไม้จิ๋ว
      q.fillStyle=['#fff','#ffd6e7','#fff3b0'][i%3];
      for(let p=0;p<5;p++){ const a=p*1.257; q.fillRect(x+Math.cos(a)*3,y+Math.sin(a)*3,2.6,2.6); }
      q.fillStyle='#ffb300'; q.fillRect(x,y,2.6,2.6); }
    const t=tex(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(12,12); return t;
  }
  function skyTex(){                        // ท้องฟ้าพาสเทล + เมฆวาดมือ
    const c=cv(512,512), q=c.getContext('2d');
    const gr=q.createLinearGradient(0,0,0,512);
    gr.addColorStop(0,'#7ec9ff'); gr.addColorStop(0.55,'#bfe6ff'); gr.addColorStop(0.8,'#ffeeda'); gr.addColorStop(1,'#ffd9b8');
    q.fillStyle=gr; q.fillRect(0,0,512,512);
    q.fillStyle='rgba(255,255,255,.85)';
    for(let i=0;i<9;i++){ const x=Math.random()*512, y=60+Math.random()*220, s=18+Math.random()*26;
      [[0,0,s],[s*0.9,4,s*0.75],[-s*0.9,5,s*0.7],[s*0.4,-s*0.45,s*0.65],[-s*0.4,-s*0.4,s*0.6]].forEach(([dx,dy,r])=>{
        q.beginPath(); q.arc(x+dx,y+dy,r,0,7); q.fill(); }); }
    return tex(c);
  }
  function backdropTex(){                   // ฉากหลังไกล: เนินเขา + ต้นไม้ + รั้วสวนสนุก
    const c=cv(1024,256), q=c.getContext('2d');
    q.fillStyle='rgba(0,0,0,0)'; q.clearRect(0,0,1024,256);
    q.fillStyle='#b5e39a'; q.beginPath(); q.moveTo(0,256);
    for(let x=0;x<=1024;x+=64) q.quadraticCurveTo(x+32,150+Math.sin(x*0.02)*30,x+64,205);
    q.lineTo(1024,256); q.closePath(); q.fill();
    for(let i=0;i<22;i++){ const x=20+i*47, y=196+Math.random()*22;
      q.fillStyle='#8d6748'; q.fillRect(x-2,y-8,4,10);
      q.fillStyle=['#66bb6a','#7cc576','#59a95e'][i%3];
      q.beginPath(); q.arc(x,y-16,11+Math.random()*4,0,7); q.fill(); }
    q.fillStyle='#f48fb1';                   // รั้วชมพู
    for(let x=0;x<1024;x+=26) q.fillRect(x,236,7,20);
    q.fillRect(0,232,1024,5);
    const t=tex(c); return t;
  }
  function duckTex(){                        // 🦆 เป็ดเหลืองยิงเล่นแบบงานวัด
    const c=cv(128,128), q=c.getContext('2d');
    q.fillStyle='#ffd54f'; q.beginPath(); q.arc(56,78,34,0,7); q.fill();          // ตัว
    q.beginPath(); q.arc(84,46,20,0,7); q.fill();                                  // หัว
    q.fillStyle='#ff9800'; q.beginPath(); q.moveTo(101,44); q.lineTo(122,50); q.lineTo(101,56); q.closePath(); q.fill(); // ปาก
    q.fillStyle='#35323e'; q.beginPath(); q.arc(90,42,3.4,0,7); q.fill();          // ตา
    q.fillStyle='#ffca28'; q.beginPath(); q.ellipse(48,80,18,12,-0.5,0,7); q.fill(); // ปีก
    return tex(c);
  }

  /* ============================================================
     🏗️ สร้างฉากสวนสนุก
     ============================================================ */
  const mat=(color,opt)=>new THREE.MeshLambertMaterial(Object.assign({color},opt||{}));
  function mesh(geo,m,x,y,z,ry){ const o=new THREE.Mesh(geo,m); o.position.set(x||0,y||0,z||0); if(ry)o.rotation.y=ry; return o; }

  function buildScene(){
    scene=new THREE.Scene();
    scene.fog=new THREE.Fog(0xcfeaff, 30, 180);   // 🎯 รอบ 923: ดันไกลออกตามระยะเป้าใหม่ ไม่งั้นหิ้งไกลสุดหายในหมอก
    camera=new THREE.PerspectiveCamera(TUNE.FOV, innerWidth/innerHeight, 0.1, 300);
    camera.position.set(0,1.6,0); camera.rotation.order='YXZ';
    raycaster=new THREE.Raycaster();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x99cc88, 1.05));
    const sun=new THREE.DirectionalLight(0xfff2cc, 0.75); sun.position.set(-18,30,14); scene.add(sun);

    // ท้องฟ้า + พื้นหญ้า
    const sky=new THREE.Mesh(new THREE.SphereGeometry(140,24,16),
      new THREE.MeshBasicMaterial({map:skyTex(), side:THREE.BackSide, fog:false}));
    sky.userData.noHit=true; scene.add(sky);
    const ground=new THREE.Mesh(new THREE.CircleGeometry(90,48), new THREE.MeshLambertMaterial({map:grassTex()}));
    ground.rotation.x=-Math.PI/2; scene.add(ground);

    buildBooth();
    buildStands();
    buildSign();
    buildFerris();
    buildTents();
    buildBalloons();
    buildClouds();
    buildDucks();
  }

  /* 🎪 ซุ้มยิงปืน — เคาน์เตอร์ไม้ + กันสาดลายทาง + เสาลูกกวาด + ไฟราว (กรอบภาพแบบงานวัด) */
  function buildBooth(){
    const cwT=woodTex(); cwT.repeat.set(6,1.4);          // เคาน์เตอร์ใกล้ตา — ลายไม้ต้องถี่ ไม่งั้นยืดเป็นสีครีมจืด
    const counter=mesh(new THREE.BoxGeometry(11,0.9,0.8), new THREE.MeshLambertMaterial({map:cwT}), 0,0.72,-2.4);
    scene.add(counter);
    scene.add(mesh(new THREE.BoxGeometry(11.4,0.12,1.0), mat(0xa9713f), 0,1.2,-2.4));   // ท็อปเคาน์เตอร์
    const poleTex=stripeTex('#ff5f6d','#fff',false);
    [-5.5,5.5].forEach(x=>{
      const p=mesh(new THREE.CylinderGeometry(0.16,0.16,4.6,10),
        new THREE.MeshLambertMaterial({map:poleTex}), x,2.3,-2.35);
      p.material.map.repeat.set(1,4); scene.add(p);
      scene.add(mesh(new THREE.SphereGeometry(0.24,10,8), mat(0xffd54f,{emissive:0x664400}), x,4.72,-2.35));
    });
    // กันสาดลายทาง + ขอบหยักโค้ง (โปร่งใสด้วย canvas alpha)
    // ⚠️ ระวัง: กันสาดอยู่ห่างตาแค่ ~2.6 ม. — ลายต้องถี่ (24 ริ้ว) หยักต้องเล็ก ไม่งั้นกลายเป็นก้อนสีเบลอยักษ์เต็มจอ
    const c=cv(768,96), q=c.getContext('2d');
    for(let i=0;i<24;i++){ q.fillStyle=i%2?'#ff5f6d':'#fffdf6'; q.fillRect(i*32,0,32,72); }
    q.globalCompositeOperation='destination-in';
    q.beginPath(); q.moveTo(0,0); q.lineTo(768,0); q.lineTo(768,56);
    for(let i=23;i>=0;i--) q.arc(i*32+16,56,16,0,Math.PI);
    q.closePath(); q.fill();
    const aw=new THREE.Mesh(new THREE.PlaneGeometry(14,1.5),
      new THREE.MeshBasicMaterial({map:tex(c), transparent:true, side:THREE.DoubleSide}));
    aw.position.set(0,3.62,-2.6); aw.rotation.x=0.22; aw.userData.noHit=true; scene.add(aw);   // ชายผ้าแตะขอบบนจอพอดี
    // 💡 ไฟราวใต้กันสาด — กะพริบระยิบ
    for(let i=0;i<15;i++){
      const x=-5.2+i*0.74, sag=Math.sin((i/14)*Math.PI)*0.28;
      const b=mesh(new THREE.SphereGeometry(0.05,8,6),      // ดวงเล็ก + แขวนสูง — ห้ามหย่อนมาบังป้ายชื่อซุ้ม
        new THREE.MeshBasicMaterial({color:[0xffd54f,0x80d8ff,0xff80ab,0xccff90][i%4]}), x,2.98-sag,-2.55);
      bulbs.push(b); scene.add(b);
    }
  }

  /* 🪵 หิ้งไม้กระดาน 3 ชั้น + แผ่นตัวอักษร 18 แผ่น + ธงสามเหลี่ยม */
  function buildStands(){
    const wood=new THREE.MeshLambertMaterial({map:woodTex()});
    ROWS.forEach((r,ri)=>{
      const plank=mesh(new THREE.BoxGeometry(r.w+1.6,0.2,0.62), wood, 0, r.y-0.11, r.z);
      scene.add(plank);
      const skirt=mesh(new THREE.BoxGeometry(r.w+1.6,r.y-0.2,0.14),
        new THREE.MeshLambertMaterial({map:stripeTex(ri%2?'#4fc3f7':'#ffb3c1','#fffdf6',true)}),
        0,(r.y-0.2)/2, r.z-0.2);
      skirt.material.map.repeat.set(Math.round(r.w/1.4),1);
      scene.add(skirt);
      for(let i=0;i<r.n;i++){
        const x=-r.w/2 + (r.w/(r.n-1))*i;
        plates.push(makePlate(x, r.y, r.z, r.size, ri));
      }
    });
    // ธงสามเหลี่ยมพาดเหนือหิ้งบนสุด
    const fr=ROWS[2];
    for(let i=0;i<12;i++){
      const x=-fr.w/2 + (fr.w/11)*i, sag=Math.sin((i/11)*Math.PI)*0.5;
      const f=new THREE.Mesh(new THREE.ConeGeometry(0.17,0.5,3),
        new THREE.MeshBasicMaterial({color:[0xff5f6d,0xffd54f,0x4fc3f7,0x9ccc65][i%4], side:THREE.DoubleSide}));
      f.position.set(x, fr.y+2.15-sag, fr.z-0.1); f.rotation.z=Math.PI; f.userData.noHit=true;
      scene.add(f);
    }
    // ฉากหลังไกล — เส้นพื้นในภาพ (ขอบล่าง canvas) ต้องทาบ y=0 พอดี ไม่งั้นรั้ว/ต้นไม้จมดิน
    const bd=new THREE.Mesh(new THREE.PlaneGeometry(120,14),
      new THREE.MeshBasicMaterial({map:backdropTex(), transparent:true}));
    bd.position.set(0,7,-76); scene.add(bd);   // 🎯 รอบ 923: ถอยตามหิ้งไกลสุด (-54) ไม่งั้นฉากหลังโผล่มาบังหิ้งชั้น 3
  }

  /* แผ่นตัวอักษร 1 แผ่น — บานพับที่ฐาน พับถอยหลังแล้วเด้งกลับ (สเปกผู้ใช้ข้อ 4) */
  function makePlate(x,y,z,size,row){
    const grp=new THREE.Group(); grp.position.set(x,y,z);
    const hinge=new THREE.Group(); grp.add(hinge);
    const geo=new THREE.BoxGeometry(size,size,0.07);
    const rim=mat(0x8d6748);
    const m=new THREE.Mesh(geo,[rim,rim,rim,rim,new THREE.MeshLambertMaterial({map:letterTex('A',0)}),rim]);
    m.position.y=size/2+0.03; hinge.add(m);
    const P={grp,hinge,mesh:m,letter:'A',ci:0,row,size,st:'up',t:0,pend:null,glow:0};
    m.userData.plate=P;
    scene.add(grp);
    return P;
  }
  function setPlateLetter(P,ch){
    P.letter=ch; P.ci=(P.ci+1+Math.floor(Math.random()*3))%PASTEL.length;
    P.mesh.material[4].map=letterTex(ch,P.ci);
    P.mesh.material[4].needsUpdate=true;
  }
  function flipPlate(P,newLetter){          // ยิงโดน → พับถอยหลัง (เปลี่ยนตัวอักษรตอนคว่ำอยู่ ถ้ามี)
    if(P.st!=='up') return;
    P.st='fall'; P.t=0; P.pend=newLetter||null;
  }

  /* 🪧 ป้ายชื่อซุ้มเหนือหิ้ง */
  function buildSign(){
    const c=cv(512,128), q=c.getContext('2d');
    q.fillStyle='#8d5a33'; q.beginPath(); q.roundRect(0,0,512,128,22); q.fill();
    q.fillStyle='#a9713f'; q.beginPath(); q.roundRect(10,10,492,108,16); q.fill();
    q.fillStyle='#fff3b0'; q.font='900 58px Kanit, system-ui'; q.textAlign='center'; q.textBaseline='middle';
    q.fillText('🎯 ยิงเป้าคำศัพท์', 256, 66);
    const s=new THREE.Mesh(new THREE.PlaneGeometry(7.4,1.85), new THREE.MeshBasicMaterial({map:tex(c), transparent:true}));
    s.position.set(0, ROWS[2].y+2.9, ROWS[2].z-0.6); s.userData.noHit=true; scene.add(s);
    [-3.4,3.4].forEach(x=> scene.add(mesh(new THREE.CylinderGeometry(0.09,0.09,ROWS[2].y+2.9,8), mat(0x8d5a33), x, (ROWS[2].y+2.9)/2, ROWS[2].z-0.6)));
  }

  /* 🎡 ชิงช้าสวรรค์หมุนช้า ๆ + 🎪 เต็นท์ลายทาง (ฉากหลังให้รู้ว่าอยู่สวนสนุก) */
  function buildFerris(){
    wheelGrp=new THREE.Group(); wheelGrp.position.set(-27,10.5,-42);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(8,0.28,10,36), mat(0xff8a65));
    wheelGrp.add(ring);
    const cabCols=[0xff5f6d,0xffd54f,0x4fc3f7,0x9ccc65,0xb388ff,0xff80ab,0x80cbc4,0xffab91];
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4;
      const spoke=mesh(new THREE.BoxGeometry(0.22,8,0.22), mat(0xffab91), 0,0,0);
      spoke.rotation.z=a+Math.PI/2;              // ⚠️ group.add() คืน group ไม่ใช่ลูก — ห้ามต่อท้าย .rotation
      wheelGrp.add(spoke);
      const cab=mesh(new THREE.BoxGeometry(1.5,1.3,1.2), mat(cabCols[i]), Math.cos(a)*8, Math.sin(a)*8, 0);
      cab.userData.spoke=a; wheelGrp.add(cab);
    }
    scene.add(wheelGrp);
    const legM=mat(0xa1887f);
    [[-3,0],[3,0]].forEach(([dx])=>{
      const leg=mesh(new THREE.CylinderGeometry(0.3,0.42,11,8), legM, -27+dx, 5.2, -42);
      leg.rotation.z=dx>0?-0.26:0.26; scene.add(leg);
    });
    tickers.push((dt,t)=>{
      wheelGrp.rotation.z=t*0.14;
      wheelGrp.children.forEach(ch=>{ if(ch.userData.spoke!==undefined) ch.rotation.z=-wheelGrp.rotation.z; });
    });
  }
  function buildTents(){
    [[16,-34,'#ff5f6d',4.4],[26,-27,'#4fc3f7',3.4],[-14,-30,'#ffb300',3.8],[34,-40,'#b388ff',5]].forEach(([x,z,col,s])=>{
      const t=new THREE.Group(); t.position.set(x,0,z);
      t.add(mesh(new THREE.CylinderGeometry(s*0.82,s*0.9,s*0.9,12), mat(0xfffdf6), 0,s*0.45,0));
      const roof=new THREE.Mesh(new THREE.ConeGeometry(s,s*0.95,12),
        new THREE.MeshLambertMaterial({map:stripeTex(col,'#fffdf6',true)}));
      roof.material.map.repeat.set(6,1); roof.position.y=s*0.9+s*0.47; t.add(roof);
      t.add(mesh(new THREE.ConeGeometry(0.22,0.55,3), new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}), 0,s*0.9+s*1.05,0));
      scene.add(t);
    });
  }
  /* 🎈 ลูกโป่งลอยขึ้นเรื่อย ๆ + ☁️ เมฆแผ่นลอยช้า */
  function buildBalloons(){
    for(let i=0;i<7;i++){
      const g=new THREE.Group();
      const col=[0xff5f6d,0xffd54f,0x4fc3f7,0x9ccc65,0xb388ff,0xff80ab,0x80cbc4][i];
      const b=mesh(new THREE.SphereGeometry(0.55,10,8), mat(col,{emissive:0x111111}), 0,0,0);
      b.scale.y=1.15; g.add(b);
      g.add(mesh(new THREE.CylinderGeometry(0.012,0.012,1.6,4), mat(0xeeeeee), 0,-1.1,0));
      g.position.set(-30+Math.random()*60, 2+Math.random()*12, -24-Math.random()*22);
      g.userData.vy=0.5+Math.random()*0.5; g.userData.vx=(Math.random()-0.5)*0.3;
      balloons.push(g); scene.add(g);
    }
    tickers.push(dt=>{
      balloons.forEach(g=>{
        g.position.y+=g.userData.vy*dt; g.position.x+=g.userData.vx*dt;
        if(g.position.y>22){ g.position.y=1.5; g.position.x=-30+Math.random()*60; }
      });
    });
  }
  function buildClouds(){
    const c=cv(128,64), q=c.getContext('2d');
    q.fillStyle='rgba(255,255,255,.92)';
    [[36,40,20],[62,34,24],[88,42,18],[50,26,15],[76,24,14]].forEach(([x,y,r])=>{ q.beginPath(); q.arc(x,y,r,0,7); q.fill(); });
    const t=tex(c);
    for(let i=0;i<5;i++){
      const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, opacity:0.9, fog:false}));
      sp.scale.set(14,7,1);
      sp.position.set(-50+Math.random()*100, 20+Math.random()*10, -60-Math.random()*30);
      clouds.push(sp); scene.add(sp);
    }
    tickers.push(dt=>{ clouds.forEach(s=>{ s.position.x+=dt*0.7; if(s.position.x>60)s.position.x=-60; }); });
  }
  /* 🦆 เป้าเป็ดวิ่ง — โบนัส +3 เหรียญ (ของแถมสไตล์งานวัด ไม่เข้าแต้มอันดับ) */
  function buildDucks(){
    const t=duckTex();
    [{z:-33.6,y:2.3,dir:1,sp:1.7},{z:-47.1,y:3.95,dir:-1,sp:2.2}].forEach(cfg=>{   // สูงพอโผล่พ้นหัวแผ่นชั้นหน้า (z ×3 รอบ 923 ตามหิ้ง)
      const g=new THREE.Group();
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(0.85,0.85),
        new THREE.MeshBasicMaterial({map:t, transparent:true, side:THREE.DoubleSide}));
      pl.position.y=0.42; g.add(pl);
      g.add(mesh(new THREE.BoxGeometry(0.06,0.5,0.06), mat(0x8d6748), 0,0.05,0));
      if(cfg.dir<0) pl.scale.x=-1;
      g.position.set(-cfg.dir*9, cfg.y, cfg.z);
      const D={grp:g, mesh:pl, dir:cfg.dir, sp:cfg.sp, y:cfg.y, st:'run', t:0};
      pl.userData.duck=D;
      ducks.push(D); scene.add(g);
    });
    tickers.push(dt=>{
      ducks.forEach(D=>{
        if(D.st==='run'){
          D.grp.position.x+=D.dir*D.sp*dt;
          D.grp.position.y=D.y+Math.abs(Math.sin(D.grp.position.x*2.4))*0.07;   // เด้งหยอง ๆ
          if(Math.abs(D.grp.position.x)>9.5){ D.dir*=-1; D.mesh.scale.x*=-1; }
        }else if(D.st==='down'){
          D.t+=dt;
          D.grp.rotation.x=Math.max(-1.5, D.grp.rotation.x-dt*9);
          if(D.t>2.4){ D.st='run'; D.grp.rotation.x=0; D.grp.position.x=-D.dir*9; }
        }
      });
    });
  }

  /* ============================================================
     🎯 ตรรกะเกม — สุ่มคำ · แจกตัวอักษรลงแผ่น · ยิง
     ============================================================ */
  function dealBoard(instant){
    /* แจกตัวอักษรของคำลงแผ่นแบบสุ่มตำแหน่ง (ทุกตัวอักษรของคำมีแผ่นของตัวเองครบ →
       การันตีสะกดจบได้เสมอ) ที่เหลือเป็นตัวหลอกสุ่ม · แผ่นเปลี่ยนตัวอักษร "ตอนคว่ำอยู่" เท่านั้น */
    const idx=shuffle(plates.map((_,i)=>i));
    const letters=new Array(plates.length);
    word.w.split('').forEach((ch,i)=>{ letters[idx[i]]=ch; });
    for(let i=word.w.length;i<plates.length;i++) letters[idx[i]]=AZ[Math.floor(Math.random()*26)];
    plates.forEach((P,i)=>{
      if(instant){ setPlateLetter(P,letters[i]); P.st='up'; P.hinge.rotation.x=0; }
      else setTimeout(()=>flipPlate(P,letters[i]), (i%6)*55 + Math.floor(i/6)*90);
    });
    boardLock=instant?0:1.15;               // กันยิงระหว่างแผ่นกำลังตีลังกาเปลี่ยนคำ
  }
  function nextWord(instant){
    word=takeWord();
    if(!word){ toast&&toast('ไม่มีคำศัพท์ในระดับชั้นนี้'); return; }
    pos=0; misses=0;
    dealBoard(instant);
    renderWordBar();
  }

  function shoot(px,py){
    const now=performance.now();
    if(now-lastShot<COOLDOWN || boardLock>0 || !running) return;
    lastShot=now;
    SND.shot(); recoilFx();
    const ndc=new THREE.Vector2((px/innerWidth)*2-1, -(py/innerHeight)*2+1);
    raycaster.setFromCamera(ndc, camera);
    const hits=raycaster.intersectObjects(scene.children,true)
      .filter(h=>{
        const D=h.object.userData.duck;
        if(D && D.st!=='run') return false;              // 🦆 เป็ดที่ล้มแล้ว — แผ่นใส quad ห้ามบังกระสุน
        let o=h.object; while(o){ if(o.userData.noHit) return false; o=o.parent; } return true;
      });
    const h=hits[0];
    if(h) impactFx(h.point);
    const P=h&&h.object.userData.plate, D=h&&h.object.userData.duck;
    if(P && P.st==='up'){ hitPlate(P); return; }
    if(D && D.st==='run'){ hitDuck(D); return; }
    /* 🎯 รอบ 932 — ช่วยเล็ง (จำเป็น ไม่ใช่ของแถม): หลังขยายระยะ 3 เท่า แผ่นเหลือแค่ ~12×12 px บนจอ
       และแต่ละแถวมี 6 ใบวางสมมาตร → **กึ่งกลางจอตรงกับ "ช่องว่างระหว่างแผ่น" พอดีทุกแถว**
       ปุ่มยิง/กากบาทที่ยิงกลางจอเสมอจึงลอดช่องไปโดนฉากหลังตลอด = "ยิงแล้วไม่มีอะไรเกิดขึ้น"
       → เล็งพลาดในรัศมีแคบ ๆ ให้ snap เข้าแผ่นที่ใกล้จุดเล็งที่สุด (ยังต้องเล็งใกล้ ไม่ใช่ยิงมั่วก็โดน) */
    const S=nearestPlate(px,py);
    if(S){ hitPlate(S); return; }
    SND.thud();
  }
  /* หาแผ่นที่ "ตั้งอยู่" ซึ่งอยู่ใกล้จุดเล็งบนจอที่สุด ภายในรัศมี TUNE.SNAP_R (สัดส่วนของด้านสั้นของจอ)
     🎯 รอบ 936 (ผู้ใช้เล็ง B ผ่านศูนย์แล้วยังไม่โดน — วัดจากภาพ: B ห่างจุดยิง 31px แต่รัศมีมีแค่ 27px):
     โหมดเล็งซูม ~1.9 เท่า (FOV 58→30) ทุกอย่างบนจอโตขึ้นแต่รัศมีเดิมเป็น px คงที่ = ช่วยเล็งเข้มงวดขึ้น
     เกือบเท่าตัวโดยไม่ตั้งใจ → คูณรัศมีตามอัตราซูมจริงของกล้อง (โหมดปกติ zoom=1 ไม่เปลี่ยน) */
  function nearestPlate(px,py){
    if(!camera) return null;
    const zoom=TUNE.FOV/(camera.fov||TUNE.FOV);
    const R=Math.min(innerWidth,innerHeight)*TUNE.SNAP_R*zoom;
    let best=null, bestD=R;
    const v=new THREE.Vector3();
    plates.forEach(P=>{
      if(P.st!=='up') return;
      P.mesh.getWorldPosition(v); v.project(camera);
      if(v.z>1) return;                                   // อยู่หลังกล้อง
      const sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight;
      const d=Math.hypot(sx-px, sy-py);
      if(d<bestD){ bestD=d; best=P; }
    });
    return best;
  }
  /* 🎥 รอบ 938: กระตุ้นสั่นกล้อง (screen shake) — เรียกซ้ำได้ เอาค่ามากสุดไว้ ไม่บวกทบจนสั่นเกิน */
  function shakeCam(amt){ shakeMag=Math.max(shakeMag,amt); }
  function hitPlate(P){
    const v=new THREE.Vector3(); P.mesh.getWorldPosition(v); sparkBurst(v);
    const need=word?word.w[pos]:null;
    if(need && P.letter===need){
      pos++; streak++; misses+=0;
      SND.plink(); setTimeout(()=>SND.fly(),90);
      shakeCam(0.032);                                   // โดนตัวถูก = สั่นแรงหน่อย ให้รู้สึกหนักหน่วงสมใจ
      flyLetter(P);
      flipPlate(P, AZ[Math.floor(Math.random()*26)]);   // เด้งกลับมาพร้อมตัวอักษรใหม่ (หมุนป้ายแบบงานวัด)
      showStreak();
      renderWordBar();
      if(pos>=word.w.length) wordDone();
    }else{
      misses++; streak=0;
      SND.plink(); SND.miss();
      shakeCam(0.017);                                   // โดนตัวผิด = สั่นเบากว่า (ยังรู้สึกกระแทกแต่ไม่ฉลอง)
      flipPlate(P,null);                                 // แผ่นผิด: พับแล้วเด้งกลับตัวเดิม
      showStreak();
    }
  }
  function hitDuck(D){
    D.st='down'; D.t=0;
    SND.plink(); SND.quack();
    if(typeof addCoins==='function') addCoins(DUCK_COIN);
    popText(`🦆 +${DUCK_COIN} 🪙`, '#ffd54f');
    renderTopHud();
  }

  /* ครบคำ → แต้ม+เหรียญเรตเดียวกับค้นหาคำ · ฉลอง · ขึ้นคำใหม่ */
  function wordDone(){
    const pts=word.w.length*PT_PER_LETTER + (misses===0?PERFECT_BONUS:0);
    if(typeof addCoins==='function') addCoins(pts);
    if(typeof state!=='undefined'){
      state.sgScore=Math.round((state.sgScore||0)+pts);
      state.sgWords=(state.sgWords||0)+1;
    }
    if(typeof vbRecord==='function') vbRecord(word.w, word.th, true);   // 📒 ลงสมุดคำศัพท์ถาวร
    if(typeof saveState==='function') saveState();
    if(typeof onlinePushScore==='function') onlinePushScore();          // ดันขึ้นกระดาน (มี sig กันเขียนซ้ำ)
    if(typeof sfx!=='undefined'){
      const tier=word.w.length>=8?2:word.w.length>=6?1:0;
      if(sfx.coinGetTier) sfx.coinGetTier(tier); else if(sfx.coinGet) sfx.coinGet();
    }
    if(typeof speakWord==='function') speakWord(word.w.toLowerCase());
    banner(word.w, word.th, pts, misses===0);
    confetti();
    renderTopHud();
    boardLock=1.8;
    setTimeout(()=>{ if(running) nextWord(false); }, 1750);
  }

  /* ============================================================
     🎬 แอนิเมชันต่อเฟรม (แผ่นพับ-เด้ง · ไฟกะพริบ · ฯลฯ)
     ============================================================ */
  const easeIn=k=>k*k;
  function easeOutElastic(k){
    if(k<=0)return 0; if(k>=1)return 1;
    return Math.pow(2,-9*k)*Math.sin((k*10-0.75)*2.0944)+1;
  }
  function tick(dt){
    clock+=dt;
    if(boardLock>0) boardLock-=dt;
    plates.forEach(P=>{
      if(P.st==='fall'){
        P.t+=dt; const k=Math.min(1,P.t/FOLD_DUR);
        P.hinge.rotation.x=-FOLD_ANGLE*easeIn(k);
        if(k>=1){ P.st='down'; P.t=0;
          if(P.pend){ setPlateLetter(P,P.pend); P.pend=null; } }
      }else if(P.st==='down'){
        P.t+=dt;
        if(P.t>0.42){ P.st='rise'; P.t=0; SND.spring(); }
      }else if(P.st==='rise'){
        P.t+=dt; const k=Math.min(1,P.t/0.72);
        P.hinge.rotation.x=-FOLD_ANGLE*(1-easeOutElastic(k));
        if(k>=1){ P.st='up'; P.hinge.rotation.x=0; }
      }
      if(P.glow>0){                          // ✨ ใบ้: แผ่นเป้าหมายเต้นตุ้บ ๆ
        P.glow-=dt;
        const s=1+Math.max(0,Math.sin(P.glow*14))*0.14;
        P.mesh.scale.set(s,s,1);
        if(P.glow<=0) P.mesh.scale.set(1,1,1);
      }
    });
    bulbs.forEach((b,i)=>{ const tw=0.5+0.5*Math.sin(clock*5+i*1.7); b.scale.setScalar(0.75+tw*0.35); });
    tickers.forEach(f=>f(dt,clock));
    // กล้องแกว่งหายใจเบา ๆ ตอนเล็ง (สมจริงขึ้นนิดเดียว ไม่ให้เด็กเวียนหัว)
    const sway=aimMode?0.0016:0.0006;
    if(shakeMag>0) shakeMag=Math.max(0,shakeMag-dt*shakeMag*9-dt*0.01);   // 🎥 รอบ 938: หน่วงเร็ว ~0.15-0.25s ไม่ทิ้งค้างจนเด็กเวียนหัว
    const shx=shakeMag? Math.sin(clock*53.1)*shakeMag : 0;
    const shy=shakeMag? Math.sin(clock*41.7+1.7)*shakeMag*0.7 : 0;
    camera.rotation.y=yaw+Math.sin(clock*1.1)*sway+shx;
    camera.rotation.x=pitch+Math.cos(clock*0.9)*sway+shy;
  }
  function loop(t){
    if(!running) return;
    requestAnimationFrame(loop);
    const dt=Math.min(0.05,(t-lastT)/1000)||0.016; lastT=t;
    tick(dt);
    renderer.render(scene,camera);
  }

  /* ============================================================
     🖥️ HUD + เอฟเฟกต์ DOM
     ============================================================ */
  function injectCss(){
    if(document.getElementById('sg-style')) return;
    const st=document.createElement('style'); st.id='sg-style';
    st.textContent=`
#sg-overlay{position:fixed;inset:0;z-index:93;display:none;background:#7ec9ff;overflow:hidden;touch-action:none;
  font-family:'Kanit',system-ui,sans-serif;-webkit-user-select:none;user-select:none}
#sg-overlay canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
#sg-gun-hold{position:absolute;pointer-events:none;z-index:3;
  height:${TUNE.HOLD_H}vh;right:${TUNE.HOLD_R}vh;bottom:${TUNE.HOLD_B}vh;
  filter:drop-shadow(0 6px 14px rgba(0,0,0,.35));transition:transform .09s ease-out}
#sg-gun-aim{position:absolute;pointer-events:none;z-index:3;display:none;
  height:${TUNE.AIM_H}vh;left:${TUNE.AIM_SX}vw;top:${TUNE.AIM_SY}vh;
  transform:translate(-${(TUNE.AIM_CX*100).toFixed(1)}%,-${(TUNE.AIM_CY*100).toFixed(1)}%);
  transition:transform .07s ease-out}
#sg-overlay.aim #sg-gun-hold{display:none}
#sg-overlay.aim #sg-gun-aim{display:block}
#sg-gun-hold.kick{transform:translate(6px,14px) rotate(1.6deg)}
#sg-gun-aim.kick{transform:translate(-${(TUNE.AIM_CX*100).toFixed(1)}%,calc(-${(TUNE.AIM_CY*100).toFixed(1)}% + 12px))}
#sg-muzzle{position:absolute;width:60px;height:60px;margin:-30px;border-radius:50%;pointer-events:none;z-index:4;opacity:0;
  background:radial-gradient(circle,rgba(255,255,255,.95),rgba(255,240,190,.55) 45%,transparent 70%)}
#sg-muzzle.on{animation:sgMuz .14s ease-out}
@keyframes sgMuz{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(1.25)}}
#sg-hud{position:absolute;inset:0;z-index:5;pointer-events:none}
#sg-hud>*{pointer-events:auto}
#sg-word{position:absolute;top:1vh;left:50%;transform:translateX(-50%);text-align:center;cursor:pointer;
  background:rgba(29,32,58,.72);border:2px solid #ffd54f;border-radius:14px;
  padding:.6vh 14px .9vh;max-width:min(92vw,620px);backdrop-filter:blur(3px)}
#sg-word .th{color:#ffe9a8;font-size:clamp(11px,2.6vh,15px);line-height:1.25}
#sg-word .th small{color:#9fb8d8;font-weight:400;margin-left:6px;font-size:.82em}
#sg-slots{display:flex;gap:clamp(3px,.8vh,6px);justify-content:center;margin-top:.5vh}
.sg-slot{width:clamp(20px,4.6vh,30px);height:clamp(24px,5.4vh,36px);border-radius:6px;
  display:flex;align-items:center;justify-content:center;font-weight:900;
  font-size:clamp(14px,3.6vh,22px);background:#fffdf6;color:#c9c2b4;border-bottom:3px solid #d9d2c2}
.sg-slot.got{background:#9ccc65;color:#fff;border-bottom-color:#7cb342;animation:sgPop .3s}
.sg-slot.now{background:#ffd54f;color:#7a5800;border-bottom-color:#f0a800;animation:sgNow 1s infinite}
@keyframes sgNow{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes sgPop{0%{transform:scale(.5)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
#sg-tl{position:absolute;top:1vh;left:1vh;display:flex;flex-direction:column;gap:.8vh;align-items:flex-start}
#sg-coins,#sg-chip{background:rgba(29,32,58,.72);border-radius:12px;padding:.5vh 10px;color:#fff;
  font-size:clamp(11px,2.8vh,15px);font-weight:700;border:1.5px solid rgba(255,255,255,.25)}
#sg-chip{cursor:pointer;border-color:#ffd54f;color:#ffe9a8}
#sg-exit{position:absolute;top:1vh;right:1vh;background:rgba(29,32,58,.72);color:#ffb3c1;border:1.5px solid #ff80ab;
  border-radius:12px;padding:.5vh 12px;font:700 clamp(11px,2.8vh,15px) Kanit,system-ui;cursor:pointer}
/* 🎯 รอบ 955: ปุ่มยิงโต 3 เท่าแล้วกินพื้นที่มุมล่างทั้งสองข้าง → ย้ายปุ่ม "เล็ง" ขึ้นมุมขวาบน (ใต้ปุ่มออก)
   ไม่งั้นวงกลมยิงฝั่งขวาทับปุ่มนี้จนกดไม่ได้ */
#sg-aimbtn{position:absolute;right:1.6vh;top:10vh;width:clamp(52px,11vh,72px);height:clamp(52px,11vh,72px);
  border-radius:50%;border:3px solid #ffd54f;background:rgba(29,32,58,.78);color:#ffe9a8;cursor:pointer;
  font:700 clamp(9px,2.2vh,12px) Kanit,system-ui;line-height:1.15;z-index:6}
#sg-aimbtn .ic{display:block;font-size:clamp(16px,4vh,24px)}
#sg-aimbtn.on{background:#ffd54f;color:#5a4300;border-color:#fff}
/* 🔫 รอบ 923: ปุ่มยิงเฉพาะ 2 ตำแหน่งซ้าย-ขวาล่างจอ (ผู้ใช้ขอ — เดิมมีแค่แตะจอสั้นๆ = ยิง)
   ยิงตรงกึ่งกลางจอเสมอ (จุดเดียวกับรูศูนย์เล็ง) · ต่อมารอบ 926: ผู้ใช้ส่งภาพวงกลม 1/2 — ย้ายขึ้นมากลางจอ
   (เดิมชิดขอบล่างสุด) top:40% translateY กึ่งกลางแนวตั้ง เว้นระยะพ้นปุ่ม 🎯 เล็งด้านล่าง · โปร่งใส 50% (.85→.5) */
/* 🔫🔎 รอบ 955 (บั๊กผู้ใช้ "กดปุ่มยิงซ้ายแล้วปืนเบนแทนที่จะยิง"): วัดในเกมจริงแล้ว —
   กดกลางปุ่มพอดี = ยิงออก กล้องนิ่ง (yaw 0.002) · **กดพลาดขอบปุ่มแค่ 20px = ไม่ยิง + กล้องเบน 0.28 rad (16°)**
   เพราะนิ้วลงนอกปุ่ม → overlay นับเป็น "ลากนิ้ว = มองรอบซุ้ม" · ต้นตอ = ปุ่มเล็กเกินไป (14vh ≈ 86px)
   แก้ 2 ชั้น: ① ผู้ใช้สั่งขยาย 3 เท่า → 40vh (≈ 3× ของเดิมทุกขนาดจอ) ย้ายไปมุมล่างซ้าย-ขวา (นิ้วโป้งทั้งสองข้างถึงพอดี
   และวงใหญ่ขนาดนี้ถ้าลอยกลางจอจะบังเป้า) ② ::before ขยายพื้นที่รับสัมผัสล้นออกอีก 26px รอบวง (มองไม่เห็น)
   = กดเฉียดขอบก็ยังยิง ไม่กลายเป็นลากจอ */
.sg-shoot{position:absolute;bottom:1.6vh;width:clamp(150px,40vh,260px);height:clamp(150px,40vh,260px);
  border-radius:50%;border:4px solid #ffd54f;background:rgba(255,95,109,.46);color:#fff;cursor:pointer;
  font:900 clamp(15px,3.6vh,22px) Kanit,system-ui;line-height:1.15;z-index:6;
  box-shadow:0 5px 0 rgba(198,40,56,.5),0 8px 18px rgba(0,0,0,.25);-webkit-tap-highlight-color:transparent}
.sg-shoot::before{content:'';position:absolute;inset:-26px;border-radius:50%}   /* พื้นที่กดเผื่อ (ล่องหน) */
.sg-shoot .ic{display:block;font-size:clamp(46px,12vh,80px)}
.sg-shoot.down{transform:translateY(3px);box-shadow:0 2px 0 rgba(198,40,56,.5),0 4px 10px rgba(0,0,0,.2)}
#sg-shoot-l{left:1.6vh}
#sg-shoot-r{right:1.6vh}
/* ✛ กากบาทกึ่งกลางจอ — บอกเด็กว่ากดปุ่มยิงแล้วกระสุนจะไปตรงไหน */
#sg-cross{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;pointer-events:none;z-index:4;opacity:.62}
#sg-cross i{position:absolute;display:block;background:#fff;box-shadow:0 0 3px rgba(0,0,0,.75)}
#sg-cross i:nth-child(1){left:50%;top:2px;bottom:2px;width:2px;margin-left:-1px}
#sg-cross i:nth-child(2){top:50%;left:2px;right:2px;height:2px;margin-top:-1px}
/* 🔴 รอบ 936: โหมดเล็ง เดิมซ่อนกากบาททิ้งทั้งอัน (นึกว่าศูนย์ปืนในภาพพอ) — ผู้ใช้เล็ง B "อยู่ในวงศูนย์แล้ว"
   แต่จุดยิงจริงอยู่ต่ำกว่านั้น ~30px เลยยิงลอดช่องว่าง → เปลี่ยนเป็นจุดแดงเล็กตรงจุดยิงจริงเป๊ะ ๆ แทน
   (เอาแผ่นตัวอักษรมาทาบจุดแดง = โดนแน่) */
#sg-overlay.aim #sg-cross{width:9px;height:9px;opacity:.92;border-radius:50%;
  background:rgba(255,64,64,.9);box-shadow:0 0 0 1.5px #fff,0 0 6px rgba(0,0,0,.55)}
#sg-overlay.aim #sg-cross i{display:none}
#sg-hint{position:absolute;bottom:1.2vh;left:50%;transform:translateX(-50%);color:#fff;
  background:rgba(29,32,58,.6);border-radius:10px;padding:.4vh 12px;font-size:clamp(10px,2.4vh,13px);
  white-space:nowrap;transition:opacity .6s}
#sg-streak{position:absolute;top:16vh;left:50%;transform:translateX(-50%);color:#ffd54f;font-weight:900;
  font-size:clamp(15px,4.5vh,26px);text-shadow:0 2px 8px rgba(0,0,0,.5);opacity:0;pointer-events:none}
#sg-streak.on{animation:sgStreak 1s ease-out}
@keyframes sgStreak{0%{opacity:0;transform:translate(-50%,10px) scale(.6)}25%{opacity:1;transform:translate(-50%,0) scale(1.15)}
  70%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-14px)}}
.sg-fly{position:absolute;z-index:7;pointer-events:none;font-weight:900;color:#ffd54f;
  font-size:clamp(18px,5vh,30px);text-shadow:0 2px 6px rgba(0,0,0,.6);transition:all .48s cubic-bezier(.5,-0.2,.6,1)}
.sg-poptx{position:absolute;z-index:7;pointer-events:none;font-weight:900;left:50%;top:38vh;transform:translateX(-50%);
  font-size:clamp(14px,4vh,22px);text-shadow:0 2px 6px rgba(0,0,0,.5);animation:sgPopUp 1.2s ease-out forwards}
@keyframes sgPopUp{0%{opacity:0;transform:translate(-50%,14px)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-40px)}}
#sg-banner{position:absolute;top:30vh;left:50%;transform:translateX(-50%);z-index:8;pointer-events:none;display:none;
  background:linear-gradient(160deg,#fff9e8,#ffedc2);border:3px solid #ffd54f;border-radius:18px;text-align:center;
  padding:1.4vh 26px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
#sg-banner .w{font-weight:900;font-size:clamp(20px,6.5vh,36px);color:#5a4300;letter-spacing:2px}
#sg-banner .m{font-size:clamp(12px,3.2vh,17px);color:#8a6d1f}
#sg-banner .p{font-weight:900;font-size:clamp(13px,3.6vh,19px);color:#2e9e4a;margin-top:.3vh}
#sg-banner.on{display:block;animation:sgBan 1.7s ease-out forwards}
@keyframes sgBan{0%{opacity:0;transform:translate(-50%,16px) scale(.7)}15%{opacity:1;transform:translate(-50%,0) scale(1.05)}
  25%{transform:translate(-50%,0) scale(1)}85%{opacity:1}100%{opacity:0}}
.sg-conf{position:absolute;top:-4vh;z-index:8;pointer-events:none;border-radius:2px;
  animation:sgConf linear forwards}
@keyframes sgConf{100%{transform:translateY(110vh) rotate(720deg)}}
#sg-intro{position:absolute;inset:0;z-index:9;background:rgba(20,24,48,.66);display:flex;align-items:center;justify-content:center}
#sg-intro .card{background:linear-gradient(165deg,#fff9e8,#ffe9c2);border:3px solid #ffb300;border-radius:18px;
  max-width:min(94vw,520px);max-height:94vh;padding:1.6vh 22px;text-align:center;color:#5a4300}
#sg-intro h2{margin:0;font-size:clamp(16px,4.6vh,24px)}
#sg-intro p{margin:.7vh 0;font-size:clamp(11px,2.9vh,15px);line-height:1.45}
#sg-intro button{background:linear-gradient(160deg,#ffb300,#ff8f00);color:#fff;border:none;border-radius:12px;
  padding:1vh 30px;font:900 clamp(14px,3.6vh,18px) Kanit,system-ui;cursor:pointer;box-shadow:0 4px 0 #c66900;margin-top:.5vh}
@media (max-height:420px){ #sg-word .th small{display:none} }
`;
    document.head.appendChild(st);
  }

  function buildDom(){
    injectCss();
    overlay=document.createElement('div'); overlay.id='sg-overlay';
    overlay.innerHTML=`
      <img id="sg-gun-hold" src="img/gun/hold.webp" alt="">
      <img id="sg-gun-aim" src="img/gun/aim.webp" alt="">
      <div id="sg-muzzle"></div>
      <div id="sg-cross"><i></i><i></i></div>
      <div id="sg-hud">
        <div id="sg-word"></div>
        <div id="sg-tl"><b id="sg-coins"></b><span id="sg-chip" class="sga-open" role="button" title="ดูอันดับ Top 10 / รางวัลรายเดือน"></span></div>
        <button id="sg-exit" type="button">✕ ออก</button>
        <button id="sg-aimbtn" type="button"><span class="ic">🎯</span>เล็ง</button>
        <button id="sg-shoot-l" class="sg-shoot" type="button"><span class="ic">🔫</span>ยิง</button>
        <button id="sg-shoot-r" class="sg-shoot" type="button"><span class="ic">🔫</span>ยิง</button>
        <div id="sg-streak"></div>
        <div id="sg-hint">👆 แตะแผ่น/กดปุ่ม 🔫 = ยิง · ลากนิ้ว = มองรอบซุ้ม · แตะคำบนป้าย = ฟังเสียง+ใบ้</div>
        <div id="sg-banner"></div>
        <div id="sg-fx"></div>
      </div>`;
    document.body.appendChild(overlay);
    wordBar=overlay.querySelector('#sg-word');
    hudCoins=overlay.querySelector('#sg-coins');
    hudChip=overlay.querySelector('#sg-chip');
    fxEl=overlay.querySelector('#sg-fx');
    hintEl=overlay.querySelector('#sg-hint');
    streakEl=overlay.querySelector('#sg-streak');
    overlay.querySelector('#sg-exit').addEventListener('click', close);
    overlay.querySelector('#sg-aimbtn').addEventListener('click', toggleAim);
    bindShootBtns();
    /* 🏆 กดแต้ม → กระดานประกาศรางวัล (ผูกเองแบบ typing.js — เผื่อยังไม่เคยเปิดกระดานอันดับ) */
    hudChip.addEventListener('click', ()=>{ if(typeof SgAward!=='undefined') SgAward.open(); });
    /* 🔊 แตะป้ายคำ = อ่านออกเสียง + ใบ้ (แผ่นเป้าหมายเต้น 1.4 วิ — บอกใบ้ไม่บอกเลย เด็กยังต้องเล็งเอง) */
    wordBar.addEventListener('click', ()=>{
      if(!word) return;
      if(typeof speakWord==='function') speakWord(word.w.toLowerCase());
      const need=word.w[pos];
      const cand=plates.filter(P=>P.st==='up'&&P.letter===need);
      if(cand.length) cand[Math.floor(Math.random()*cand.length)].glow=1.4;
    });
    bindInput();
  }

  function renderWordBar(){
    if(!word||!wordBar) return;
    wordBar.innerHTML=`<div class="th">${(typeof escapeHTML==='function')?escapeHTML(word.th):word.th}<small>ระดับชั้น ${grade()}</small></div>
      <div id="sg-slots">${word.w.split('').map((ch,i)=>
        `<span class="sg-slot${i<pos?' got':(i===pos?' now':'')}">${i<pos?ch:(i===pos?ch:ch)}</span>`).join('')}</div>`;
  }
  function renderTopHud(){
    if(!hudCoins) return;
    const st=(typeof state!=='undefined')?state:{};
    hudCoins.textContent=`🪙 ${(st.coins||0).toLocaleString()}`;
    hudChip.textContent=`🎯 ${(st.sgScore||0).toLocaleString()} แต้ม · ${(st.sgWords||0).toLocaleString()} คำ`;
  }
  function showStreak(){
    if(!streakEl) return;
    if(streak>=2){
      streakEl.textContent=`🔥 แม่นมาก ×${streak}!`;
      streakEl.classList.remove('on'); void streakEl.offsetWidth; streakEl.classList.add('on');
    }
  }
  function popText(txt,color){
    const p=document.createElement('div'); p.className='sg-poptx'; p.textContent=txt; p.style.color=color||'#fff';
    fxEl.appendChild(p); setTimeout(()=>p.remove(),1250);
  }
  /* ตัวอักษรลอยจากแผ่นที่ยิงโดน → เข้าช่องบนป้ายคำ */
  function flyLetter(P){
    const v=new THREE.Vector3(); P.mesh.getWorldPosition(v); v.project(camera);
    const sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight;
    const el=document.createElement('div'); el.className='sg-fly'; el.textContent=P.letter;
    el.style.left=sx+'px'; el.style.top=sy+'px';
    fxEl.appendChild(el);
    requestAnimationFrame(()=>{
      const slot=wordBar.querySelectorAll('.sg-slot')[Math.max(0,pos-1)];
      const r=slot?slot.getBoundingClientRect():{left:innerWidth/2,top:30,width:0,height:0};
      el.style.left=(r.left+r.width/2)+'px'; el.style.top=(r.top+r.height/2)+'px';
      el.style.transform='scale(.6)'; el.style.opacity='0.2';
    });
    setTimeout(()=>el.remove(),520);
  }
  function banner(w,th,pts,perfect){
    const b=overlay.querySelector('#sg-banner');
    b.innerHTML=`<div class="w">${w}</div><div class="m">${(typeof escapeHTML==='function')?escapeHTML(th):th}</div>
      <div class="p">+${pts} 🪙 +${pts} แต้ม${perfect?' ✨ ไม่พลาดเลย!':''}</div>`;
    b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
  }
  function confetti(){
    if(document.documentElement.classList.contains('no-anim')) return;
    for(let i=0;i<26;i++){
      const c=document.createElement('div'); c.className='sg-conf';
      c.style.left=(8+Math.random()*84)+'vw';
      c.style.width=c.style.height=(5+Math.random()*7)+'px';
      c.style.background=PASTEL[i%PASTEL.length];
      c.style.animationDuration=(1.3+Math.random()*1.2)+'s';
      c.style.animationDelay=(Math.random()*0.25)+'s';
      fxEl.appendChild(c); setTimeout(()=>c.remove(),2800);
    }
  }
  function recoilFx(){
    const g=overlay.querySelector(aimMode?'#sg-gun-aim':'#sg-gun-hold');
    g.classList.remove('kick'); void g.offsetWidth; g.classList.add('kick');
    setTimeout(()=>g.classList.remove('kick'),95);
    if(!aimMode){                             // แฟลชลมที่ปลายกระบอก (เฉพาะโหมดถือ — โหมดเล็งปากกระบอกอยู่นอกจอ)
      const hr=overlay.querySelector('#sg-gun-hold').getBoundingClientRect();
      const m=overlay.querySelector('#sg-muzzle');
      m.style.left=(hr.left+hr.width*TUNE.MUZ_X)+'px';
      m.style.top=(hr.top+hr.height*TUNE.MUZ_Y)+'px';
      m.classList.remove('on'); void m.offsetWidth; m.classList.add('on');
    }
  }
  /* 💥 วงแหวนกระแทก ณ จุดที่กระสุนตก (สไปรต์ 3D ขยาย-จาง) */
  let impactTex=null;
  function impactFx(point){
    if(!impactTex){
      const c=cv(64,64), q=c.getContext('2d');
      q.strokeStyle='#fff'; q.lineWidth=6; q.beginPath(); q.arc(32,32,22,0,7); q.stroke();
      q.fillStyle='rgba(255,255,255,.9)'; q.beginPath(); q.arc(32,32,7,0,7); q.fill();
      impactTex=tex(c);
    }
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:impactTex, transparent:true, opacity:0.95, depthTest:false}));
    sp.position.copy(point); sp.scale.setScalar(0.12);
    scene.add(sp);
    const t0=clock;
    tickers.push(function fade(dt){
      const k=(clock-t0)/0.22;
      if(k>=1){ scene.remove(sp); tickers.splice(tickers.indexOf(fade),1); return; }
      sp.scale.setScalar(0.12+k*0.5); sp.material.opacity=0.95*(1-k);
    });
  }
  /* ✨ ประกายกระเด็น ณ จุดที่ยิงโดนแผ่น — เสริม impactFx ให้รู้สึก "โดนหนักขึ้น" (รอบ 937) */
  let sparkTex=null;
  function sparkBurst(point){
    if(!sparkTex){
      const c=cv(16,16), q=c.getContext('2d');
      const g=q.createRadialGradient(8,8,0,8,8,8);
      g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.35,'rgba(255,221,110,.95)'); g.addColorStop(1,'rgba(255,221,110,0)');
      q.fillStyle=g; q.beginPath(); q.arc(8,8,8,0,7); q.fill();
      sparkTex=tex(c);
    }
    const N=10;
    for(let i=0;i<N;i++){
      const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:sparkTex, transparent:true, opacity:1, depthTest:false, blending:THREE.AdditiveBlending}));
      const ang=Math.random()*Math.PI*2, spd=1.8+Math.random()*2.6, vy0=1+Math.random()*2;
      sp.position.copy(point); sp.scale.setScalar(0.06+Math.random()*0.06);
      scene.add(sp);
      const vx=Math.cos(ang)*spd, vz=Math.sin(ang)*spd;
      const t0=clock, life=0.28+Math.random()*0.16;
      tickers.push(function fly(dt){
        const age=clock-t0, k=age/life;
        if(k>=1){ scene.remove(sp); tickers.splice(tickers.indexOf(fly),1); return; }
        sp.position.x+=vx*dt; sp.position.z+=vz*dt;
        sp.position.y+=(vy0-age*7)*dt;                    // แรงโน้มถ่วงเบา ๆ ดึงประกายตกลง
        sp.material.opacity=1-k;
      });
    }
  }

  /* ---------- อินพุต: ลาก = มองรอบ · แตะสั้น = ยิง ---------- */
  function bindInput(){
    let pd=null;
    overlay.addEventListener('pointerdown', e=>{
      if(e.target.closest('button')||e.target.closest('#sg-word')||e.target.closest('#sg-chip')) return;
      pd={x:e.clientX, y:e.clientY, t:performance.now(), moved:false};
      overlay.setPointerCapture&&overlay.setPointerCapture(e.pointerId);
    });
    overlay.addEventListener('pointermove', e=>{
      if(!pd) return;
      const dx=e.clientX-pd.x, dy=e.clientY-pd.y;
      /* 🎯 รอบ 936: เกณฑ์ "ถือว่าลาก" 9px ไวไป — นิ้วเด็กแตะจอสั่นเล็กน้อยก็โดนนับเป็นลาก
         แล้วปล่อยนิ้ว = ไม่ยิง (เงียบ ไม่มีเสียงด้วย) เป็นอีกสาเหตุของ "ยิงแล้วไม่มีอะไรเกิดขึ้น" */
      if(Math.abs(dx)+Math.abs(dy)>16) pd.moved=true;
      if(pd.moved){
        /* 🎯 รอบ 921: ทิศทางลากกลับด้าน — ลากซ้ายปืนเบนขวา/ลากลงปืนเงยขึ้น (ผู้ใช้เจอจริง)
           ยาว/pitch เป็นมุมกล้องจริง (rotation.y/x) ไม่ใช่ทิศจอ ต้องลบ ไม่ใช่บวก ถึงจะลากซ้าย=มองซ้าย/ลากลง=มองลง */
        const s=(aimMode?0.0011:0.0024);
        yaw   = clamp(yaw  - dx*s, -0.62, 0.62);
        pitch = clamp(pitch- dy*s*0.8, -0.06, 0.42);
        pd.x=e.clientX; pd.y=e.clientY;
      }
    });
    overlay.addEventListener('pointerup', e=>{
      if(!pd) return;
      const quick=performance.now()-pd.t<420;
      if(!pd.moved && quick){
        if(aimMode) shoot(innerWidth*TUNE.AIM_SX/100, innerHeight*TUNE.AIM_SY/100);  // โหมดเล็ง: ยิงตรงรูศูนย์เสมอ
        else shoot(e.clientX, e.clientY);                                            // โหมดถือ: ยิงตรงจุดที่แตะ
      }
      pd=null;
    });
    overlay.addEventListener('pointercancel', ()=>{ pd=null; });
    window.addEventListener('resize', onResize);
  }
  function toggleAim(){
    aimMode=!aimMode;
    overlay.classList.toggle('aim', aimMode);
    const b=overlay.querySelector('#sg-aimbtn');
    b.classList.toggle('on', aimMode);
    b.innerHTML=aimMode?'<span class="ic">👁</span>มุมกว้าง':'<span class="ic">🎯</span>เล็ง';
    camera.fov=aimMode?TUNE.FOV_AIM:TUNE.FOV; camera.updateProjectionMatrix();
    SND.thud();
    if(hintEl) hintEl.textContent=aimMode?'🎯 ลากนิ้วเลื่อนศูนย์ให้ทาบแผ่น แล้วแตะจอ/กดปุ่ม 🔫 เพื่อยิง':'👆 แตะแผ่น/กดปุ่ม 🔫 = ยิง · ลากนิ้ว = มองรอบซุ้ม';
  }
  /* 🔫 รอบ 923: ปุ่มยิง 2 ตำแหน่งซ้าย-ขวาล่างจอ — ยิงตรงกึ่งกลางจอเสมอ (จุดเดียวกับรูศูนย์เล็ง AIM_SX/AIM_SY = 50/50)
     pointerdown ไม่ใช่ click — ลดหน่วง เหมือนแป้นพิมพ์คำใน typing.js */
  /* 🔫🔁 รอบ 958 (ผู้ใช้สั่ง "กดค้างรัวได้"): กดค้าง = ยิงรัวซ้ำทุก COOLDOWN ms (310ms/นัด — cooldown เดิม
     กันเด็กรัวมั่วอยู่แล้ว ไม่ต้องคูลดาวน์เพิ่ม) · ใช้ setInterval ผูกกับปุ่มเดียว ไม่ใช่ตัวแปร global
     กันกด 2 ปุ่มพร้อมกันแล้ว clear ของกันเอง */
  function bindShootBtns(){
    ['sg-shoot-l','sg-shoot-r'].forEach(id=>{
      const b=overlay.querySelector('#'+id); if(!b) return;
      let holdTimer=null;
      const stop=()=>{ b.classList.remove('down'); if(holdTimer){ clearInterval(holdTimer); holdTimer=null; } };
      b.addEventListener('pointerdown', e=>{
        e.preventDefault();
        /* 🔫 รอบ 955: ยึดนิ้วไว้ที่ปุ่ม — นิ้วเด็กกดแล้วไถออกนอกวง จะไม่กลายเป็น "ลากจอ = กล้องเบน" */
        try{ b.setPointerCapture(e.pointerId); }catch(_){}
        b.classList.add('down');
        shoot(innerWidth*0.5, innerHeight*0.5);
        if(holdTimer) clearInterval(holdTimer);
        holdTimer=setInterval(()=> shoot(innerWidth*0.5, innerHeight*0.5), COOLDOWN);
      });
      b.addEventListener('pointerup', stop);
      b.addEventListener('pointerleave', stop);
      b.addEventListener('pointercancel', stop);
    });
  }
  function onResize(){
    if(!renderer) return;
    renderer.setSize(innerWidth,innerHeight);
    camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  }

  /* ---------- intro (ครั้งแรกครั้งเดียว — state.sgIntro) ---------- */
  function showIntro(){
    if(typeof state!=='undefined' && state.sgIntro) return;
    const d=document.createElement('div'); d.id='sg-intro';
    d.innerHTML=`<div class="card">
      <h2>🎯 ยิงเป้าคำศัพท์ · สวนสนุก</h2>
      <p>ยิงแผ่นตัวอักษรให้<b>สะกดตรงตามคำบนป้าย</b> ทีละตัว<br>
      👆 แตะแผ่น = ยิง · ลากนิ้ว = มองรอบซุ้ม · ปุ่ม 🎯 = เล็งซูมผ่านศูนย์ปืน<br>
      🔫 ปุ่มยิงซ้าย-ขวาล่างจอ = ยิงตรงกึ่งกลางจอเสมอ<br>
      ครบคำได้ <b>ความยาว × 2 เหรียญ+แต้ม</b> · ไม่พลาดเลย <b>+${PERFECT_BONUS}</b> · เจอเป็ด 🦆 ยิงได้ +${DUCK_COIN} 🪙</p>
      <p style="font-size:.85em;opacity:.8">แต้มสะสมขึ้นกระดานอันดับ 🎯 — Top 10 รับรางวัลทุกวันที่ 1 (10,000–1,000 🪙)</p>
      <button type="button">🎯 เริ่มเลย!</button>
    </div>`;
    d.querySelector('button').addEventListener('click', ()=>{
      d.remove();
      if(typeof state!=='undefined'){ state.sgIntro=1; if(typeof saveState==='function') saveState(); }
      if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
    });
    overlay.appendChild(d);
  }

  /* ============================================================
     เปิด/ปิดเกม
     ============================================================ */
  async function open(){
    if(opening) return; opening=true;
    try{
      if(!window.THREE){
        if(typeof toast==='function') toast('🎯 กำลังเปิดสวนสนุก...');
        if(typeof loadScriptOnce!=='function') throw new Error('no loader');
        await loadScriptOnce('js/vendor/three.min.js');
      }
      three=true;
      if(!built){
        buildDom();
        buildScene();
        renderer=new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));
        renderer.setSize(innerWidth,innerHeight);
        overlay.insertBefore(renderer.domElement, overlay.firstChild);
        built=true;
        nextWord(true);
      }else{
        onResize();
        if(qGrade!==grade()) nextWord(true);       // เปลี่ยนระดับชั้นระหว่างทาง = คลังคำใหม่
      }
      overlay.style.display='block';
      running=true; lastT=performance.now();
      requestAnimationFrame(loop);
      renderWordBar(); renderTopHud();
      showIntro();
      ac();                                         // ปลุก AudioContext ตั้งแต่ gesture แรก
      if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
    }catch(e){
      console.error('ShootWord open fail', e);
      if(typeof sfx!=='undefined'&&sfx.wrong) sfx.wrong();
      if(typeof toast==='function') toast('⚠️ เปิดสวนสนุกไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
    }
    opening=false;
  }
  function close(){
    running=false;
    if(overlay) overlay.style.display='none';
    if(typeof saveState==='function') saveState();
    try{ if(AC && AC.state==='running') AC.suspend(); }catch(e){}
    if(typeof renderDashboard==='function') renderDashboard();   // อัปเดตเหรียญบนล็อบบี้
  }

  function bindRail(){
    const btn=document.getElementById('btn-rail-shootword');
    if(btn) btn.addEventListener('click', ()=>{ if(typeof closePanel==='function') closePanel(); open(); });
    document.addEventListener('keydown', e=>{
      if(e.key==='Escape' && overlay && overlay.style.display==='block' && !document.querySelector('.wsa-overlay')) close();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindRail); else bindRail();

  /* ---------- ชุดทดสอบ ---------- */
  window.ShootWord={ open, close, _t:{
    get word(){return word;}, get pos(){return pos;}, get misses(){return misses;},
    get plates(){return plates;}, get ducks(){return ducks;}, get queue(){return queue;},
    get camera(){return camera;}, get scene(){return scene;}, get renderer(){return renderer;},
    get aimMode(){return aimMode;}, get boardLock(){return boardLock;},
    get shakeMag(){return shakeMag;},
    set boardLock(v){boardLock=v;}, set lastShot(v){lastShot=v;},
    step(dt){ tick(dt||0.016); if(renderer)renderer.render(scene,camera); },
    shoot, hitPlate, hitDuck, nextWord, dealBoard, pool, takeWord, toggleAim,
    setView(y,p){ yaw=y; pitch=p; },
    TUNE, ROWS, PT_PER_LETTER, PERFECT_BONUS, DUCK_COIN, COOLDOWN,
  }};
})();
