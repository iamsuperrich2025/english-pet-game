"use strict";
/* ============================================================
   🌀🔤 รอบ 1045 — VOCAB ARENA
   โลกผจญภัย PvE มุมกล้อง MOBA-inspired ที่ออกแบบใหม่สำหรับ Vocab World
   - ไม่ใช้แผนที่/ฮีโร่/ไอคอน/เอฟเฟกต์/เสียงจากเกมอื่น
   - ตัวละครอ่านจากตัวเลือกโปรไฟล์ blk1..blk88 และน้องตัวจริงวิ่งตาม
   - ฆ่าปีศาจตัวอักษร → เก็บอักษร → ประกอบคำ → รับเหรียญ → ซื้อพลัง
   ============================================================ */
(function(){
  const TAU=Math.PI*2, ARENA_R=32, BOT_TARGET=8, ENERGY_MAX=10;
  const SKILL_CD={basic:.34,arc:4,nova:7,ult:15};
  const STORE=[
    {id:'prism',ico:'💠',name:'แกนปริซึม',price:250,desc:'พลังโจมตีทุกสกิล +25%'},
    {id:'storm',ico:'🌀',name:'ตราวายุ',price:600,desc:'วงระเบิด Nova กว้างขึ้น 35%'},
    {id:'echo',ico:'🔮',name:'ลูกแก้วสะท้อน',price:1200,desc:'ยิงพลังพื้นฐานแยกไปหาอีก 1 เป้าหมาย'},
    {id:'wing',ico:'🪽',name:'ปีกผู้พิทักษ์',price:800,desc:'ได้โล่ 30 หน่วยและฟื้นโล่เมื่อไม่โดนโจมตี'},
  ];
  const BOT_COLORS=[0x38dcff,0x9d5cff,0xff4da6,0xffb33f,0x42f0a0];
  const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let root,canvas,renderer,scene,camera,clock,raf=0,running=false,paused=false,built=false;
  let player,petComp,aimRing,arenaMotes;
  let bots=[],drops=[],shots=[],effects=[],respawns=[];
  let keys=new Set(),joy={x:0,z:0,id:null},listeners=[];
  let bag={},recentLetters=[],target=null,wordBusy=false,wordNo=0;
  let energy=0,kills=0,sessionWords=0,sessionCoins=0;
  let cooldown={basic:0,arc:0,nova:0,ult:0},lastFrame=0,lastBotEnsure=0,lastPetStrike=0,lastHitAt=0;
  let hp=100,maxHp=100,shield=0,maxShield=0;
  let texLoader,audioCtx=null,fxLow=false;
  const ui={};

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const fmt=n=>(typeof fmtNum==='function'?fmtNum(n):Math.round(n).toLocaleString());
  const own=id=>!!(state.arenaItems&&state.arenaItems[id]);
  const powerMult=()=> (own('prism')?1.25:1)*(1+energy*.11);
  const profileAvatar=()=>{
    if(typeof lobbyBlk==='function') return lobbyBlk();
    if(/^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(state.profAv||'')) return state.profAv;
    return state.playerAvatar==='female'?'blk6':'blk1';
  };
  const petInfo=()=> typeof activePet==='function'?activePet():null;

  function addListener(el,type,fn,opt){ el.addEventListener(type,fn,opt); listeners.push(()=>el.removeEventListener(type,fn,opt)); }
  function ensureState(){
    if(!state.arenaItems||typeof state.arenaItems!=='object'||Array.isArray(state.arenaItems)) state.arenaItems={};
    if(!state.arenaStats||typeof state.arenaStats!=='object') state.arenaStats={words:0,kills:0,bestCombo:0};
    for(const k of ['words','kills','bestCombo']) if(typeof state.arenaStats[k]!=='number') state.arenaStats[k]=0;
  }

  function createDom(){
    root=document.getElementById('va-root');
    if(root) root.remove();
    root=document.createElement('div'); root.id='va-root';
    const av=profileAvatar(), p=petInfo(), online=typeof Online!=='undefined'&&Online.ready;
    root.innerHTML=`
      <canvas id="va-canvas"></canvas><div class="va-vignette"></div><div class="va-scan"></div>
      <div class="va-top">
        <button class="va-exit" id="va-exit" aria-label="ออกจากสนาม">← ออก</button>
        <div class="va-player-card va-glass"><img src="img/blocks/${av}.png" alt=""><div class="va-player-name">${esc(state.profileName||'นักผจญภัย')}</div><div class="va-online${online?'':' off'}">● ${online?'ONLINE PvE':'PvE ฝึกซ้อม'}</div></div>
        <div class="va-word-card va-glass"><div class="va-word-th" id="va-word-th">เป้าหมายคำศัพท์</div><div class="va-word-en" id="va-word-en">READY</div><div class="va-word-slots" id="va-word-slots"></div></div>
        <div class="va-coins va-glass">🪙 <span id="va-coins">${fmt(state.coins||0)}</span></div>
        <button class="va-shop-btn" id="va-shop-open">🛒 พลังพิเศษ</button>
      </div>
      <div class="va-energy va-glass" id="va-energy"><span class="va-energy-label">พลังอักษร</span><div class="va-energy-track"><div class="va-energy-fill" id="va-energy-fill"></div></div><span class="va-energy-power" id="va-energy-power">×1.0</span></div>
      <div class="va-bag va-glass"><span class="va-bag-label">กระเป๋า</span><div class="va-bag-list" id="va-bag-list"></div></div>
      <div class="va-hp va-glass" id="va-hp"><b>HP</b><div class="va-hp-track"><div class="va-hp-fill" id="va-hp-fill"></div></div></div>
      <div class="va-stick" id="va-stick"><div class="va-stick-knob" id="va-stick-knob"></div></div>
      <div class="va-skills">
        <button class="va-skill ult" data-skill="ult" aria-label="Wordstorm"><span class="ico">🌈</span><span class="key">3 WORDSTORM</span><span class="cd"></span></button>
        <button class="va-skill nova" data-skill="nova" aria-label="Nova"><span class="ico">🌀</span><span class="key">2 NOVA</span><span class="cd"></span></button>
        <button class="va-skill arc" data-skill="arc" aria-label="Arc"><span class="ico">⚡</span><span class="key">1 ARC</span><span class="cd"></span></button>
        <button class="va-skill basic" data-skill="basic" aria-label="ยิงพลัง"><span class="ico">✦</span><span class="key">ยิง</span><span class="cd"></span></button>
      </div>
      <div class="va-feed" id="va-feed"></div>
      <div class="va-pop" id="va-pop"><strong></strong><span></span></div>
      <div class="va-modal" id="va-shop"><div class="va-panel">
        <div class="va-panel-head"><div><div class="va-panel-title">🛒 คลังพลังอักษร</div><div class="va-panel-sub">ใช้เหรียญรวมที่มีอยู่ ซื้อครั้งเดียว ใช้ได้ถาวร</div></div><div class="va-panel-coins">🪙 <span id="va-shop-coins"></span></div><button class="va-close" id="va-shop-close">✕</button></div>
        <div class="va-store-grid" id="va-store-grid"></div>
      </div></div>
      <div class="va-modal" id="va-intro"><div class="va-panel va-intro-panel">
        <div class="va-intro-logo">VOCAB ARENA</div><div class="va-intro-sub">สนามผจญภัยพลังคำศัพท์ฉบับใหม่ของ Vocab World</div>
        <div class="va-intro-steps"><div class="va-intro-step"><b>👾</b>กำจัดปีศาจที่มีตัวอักษร</div><div class="va-intro-step"><b>🔤</b>เดินเก็บอักษรที่ตก</div><div class="va-intro-step"><b>📖</b>ประกอบคำครบ รับเหรียญ</div><div class="va-intro-step"><b>✨</b>อักษรยิ่งมาก พลังยิ่งแรง</div></div>
        <button class="va-start" id="va-start">เริ่มภารกิจ ✦</button>
      </div></div>
      <div class="va-portrait"><div><b>📱↻</b>หมุนเครื่องเป็นแนวนอนเพื่อเข้าสนามครับ</div></div>`;
    document.body.appendChild(root);
    canvas=root.querySelector('#va-canvas');
    ['wordTh','wordEn','wordSlots','coins','energy','energyFill','energyPower','bagList','hp','hpFill','feed','pop','shop','shopCoins','storeGrid','intro','stick','stickKnob'].forEach(k=>{
      const id='va-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()); ui[k]=root.querySelector('#'+id);
    });
    bindDom();
    renderShop();
    if(p) feed(`🐾 ${p.name||((typeof PETS!=='undefined'&&PETS[p.type])?PETS[p.type].name:'น้อง')} จะวิ่งตามและช่วยโจมตี`, 'gold');
  }

  function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function bindDom(){
    addListener(root.querySelector('#va-exit'),'click',stop);
    addListener(root.querySelector('#va-shop-open'),'click',()=>toggleShop(true));
    addListener(root.querySelector('#va-shop-close'),'click',()=>toggleShop(false));
    addListener(ui.shop,'click',e=>{ if(e.target===ui.shop) toggleShop(false); });
    addListener(ui.storeGrid,'click',e=>{ const b=e.target.closest('[data-buy]'); if(b) buyItem(b.dataset.buy); });
    root.querySelectorAll('[data-skill]').forEach(b=>addListener(b,'pointerdown',e=>{ e.preventDefault(); castSkill(b.dataset.skill); }));
    const st=ui.stick;
    const joyMove=e=>{
      if(joy.id!==e.pointerId) return;
      const r=st.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),lim=r.width*.34;
      const m=Math.hypot(dx,dy)||1, k=m>lim?lim/m:1;
      joy.x=dx*k/lim; joy.z=dy*k/lim;
      ui.stickKnob.style.transform=`translate(calc(-50% + ${dx*k}px),calc(-50% + ${dy*k}px))`;
    };
    const joyEnd=e=>{ if(joy.id!==e.pointerId) return; joy.id=null; joy.x=joy.z=0; ui.stickKnob.style.transform='translate(-50%,-50%)'; };
    addListener(st,'pointerdown',e=>{ e.preventDefault(); joy.id=e.pointerId; st.setPointerCapture&&st.setPointerCapture(e.pointerId); joyMove(e); });
    addListener(st,'pointermove',joyMove); addListener(st,'pointerup',joyEnd); addListener(st,'pointercancel',joyEnd);
    addListener(canvas,'pointerdown',e=>{ if(e.pointerType==='mouse'&&e.button===0) castSkill('basic'); });
    addListener(root.querySelector('#va-start'),'click',()=>{
      state.arenaIntro=true; saveState(); ui.intro.classList.remove('on'); paused=false; clock.getDelta(); feed('กำจัดปีศาจ แล้วเดินเข้าไปเก็บอักษรครับ','gold');
    });
    const kd=e=>{
      if(!running) return;
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
      keys.add(e.code);
      if(e.repeat) return;
      if(e.code==='Space') castSkill('basic');
      else if(e.code==='Digit1') castSkill('arc');
      else if(e.code==='Digit2') castSkill('nova');
      else if(e.code==='Digit3') castSkill('ult');
      else if(e.code==='KeyB') toggleShop(!ui.shop.classList.contains('on'));
      else if(e.code==='Escape'){ if(ui.shop.classList.contains('on')) toggleShop(false); else stop(); }
    };
    const ku=e=>keys.delete(e.code);
    addListener(window,'keydown',kd,{passive:false}); addListener(window,'keyup',ku);
    addListener(window,'resize',resize);
  }

  function initThree(){
    renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.45));
    renderer.setSize(innerWidth,innerHeight,false);
    if('outputColorSpace' in renderer&&THREE.SRGBColorSpace) renderer.outputColorSpace=THREE.SRGBColorSpace;
    else if('outputEncoding' in renderer&&THREE.sRGBEncoding) renderer.outputEncoding=THREE.sRGBEncoding;
    if('toneMapping' in renderer&&THREE.ACESFilmicToneMapping){ renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.08; }
    scene=new THREE.Scene(); scene.background=new THREE.Color(0x071321); scene.fog=new THREE.FogExp2(0x071321,.018);
    camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,120);
    clock=new THREE.Clock(); texLoader=new THREE.TextureLoader();
    buildArena(); buildPlayer(); buildPet();
    built=true; resize();
  }

  function buildArena(){
    scene.add(new THREE.HemisphereLight(0x8bdcff,0x130d2c,1.25));
    const sun=new THREE.DirectionalLight(0xc9f5ff,1.45); sun.position.set(-12,24,11); scene.add(sun);
    const fill=new THREE.PointLight(0xb44cff,1.3,55); fill.position.set(10,8,-10); scene.add(fill);
    const ground=new THREE.Mesh(new THREE.CylinderGeometry(ARENA_R+2,ARENA_R+3,1.25,64),new THREE.MeshStandardMaterial({color:0x102d35,roughness:.78,metalness:.18}));
    ground.position.y=-.68; scene.add(ground);
    const inner=new THREE.Mesh(new THREE.CircleGeometry(ARENA_R,64),new THREE.MeshStandardMaterial({color:0x174745,roughness:.92,metalness:.03}));
    inner.rotation.x=-Math.PI/2; inner.position.y=-.04; scene.add(inner);
    for(const r of [7.5,16,25,31.2]){
      const ring=new THREE.Mesh(new THREE.RingGeometry(r-.10,r+.10,96),new THREE.MeshBasicMaterial({color:r===31.2?0x58e8ff:0x2a8fa1,transparent:true,opacity:r===31.2?.55:.18,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
      ring.rotation.x=-Math.PI/2; ring.position.y=.015; scene.add(ring);
    }
    const laneMat=new THREE.MeshStandardMaterial({color:0x1a5963,emissive:0x06364b,emissiveIntensity:.65,roughness:.55,transparent:true,opacity:.74});
    for(const a of [0,Math.PI/3,-Math.PI/3]){
      const lane=new THREE.Mesh(new THREE.PlaneGeometry(7,61),laneMat.clone()); lane.rotation.x=-Math.PI/2; lane.rotation.z=a; lane.position.y=.012; scene.add(lane);
      for(let j=-3;j<=3;j++){
        const mark=new THREE.Mesh(new THREE.RingGeometry(1.6,1.78,28),new THREE.MeshBasicMaterial({color:0x4cdaf0,transparent:true,opacity:.13,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
        mark.rotation.x=-Math.PI/2; mark.position.set(Math.sin(a)*j*7,.03,Math.cos(a)*j*7); scene.add(mark);
      }
    }
    const rockMat=new THREE.MeshStandardMaterial({color:0x183949,roughness:.72,metalness:.22});
    const crystalColors=[0x3be6ff,0xa05dff,0xff55bd];
    for(let i=0;i<30;i++){
      const a=i/30*TAU+rnd(-.06,.06),r=rnd(27.3,32),h=rnd(1.7,4.6);
      const g=new THREE.Group(); g.position.set(Math.sin(a)*r,0,Math.cos(a)*r); g.rotation.y=-a;
      const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rnd(.7,1.6),0),rockMat); rock.scale.y=rnd(.6,1.3); rock.position.y=.35; g.add(rock);
      if(i%2===0){ const col=crystalColors[i%3]; const c=new THREE.Mesh(new THREE.OctahedronGeometry(rnd(.35,.62),0),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.8,roughness:.25,metalness:.12})); c.scale.y=h; c.position.set(rnd(-.4,.4),h*.42,rnd(-.25,.25)); g.add(c); }
      scene.add(g);
    }
    for(let i=0;i<6;i++){
      const a=i/6*TAU+.25,r=22.8,col=crystalColors[i%3],g=new THREE.Group(); g.position.set(Math.sin(a)*r,0,Math.cos(a)*r);
      const base=new THREE.Mesh(new THREE.CylinderGeometry(1.5,2.15,.8,8),new THREE.MeshStandardMaterial({color:0x172b45,metalness:.55,roughness:.34})); base.position.y=.38; g.add(base);
      const core=new THREE.Mesh(new THREE.OctahedronGeometry(.9,0),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.7,metalness:.25,roughness:.2})); core.scale.y=2.5; core.position.y=2.4; core.rotation.y=a; g.add(core);
      const halo=new THREE.Mesh(new THREE.TorusGeometry(1.5,.065,8,40),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.65,blending:THREE.AdditiveBlending})); halo.rotation.x=Math.PI/2; halo.position.y=2.4; g.add(halo); g.userData.halo=halo; scene.add(g);
    }
    const starGeo=new THREE.BufferGeometry(),n=180,arr=new Float32Array(n*3);
    for(let i=0;i<n;i++){ const a=Math.random()*TAU,r=Math.sqrt(Math.random())*ARENA_R; arr[i*3]=Math.sin(a)*r;arr[i*3+1]=rnd(.35,4.5);arr[i*3+2]=Math.cos(a)*r; }
    starGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
    arenaMotes=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x8eeaff,size:.085,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})); scene.add(arenaMotes);
  }

  function loadSprite(url,onReady){
    const mat=new THREE.SpriteMaterial({transparent:true,depthWrite:false,alphaTest:.03});
    const spr=new THREE.Sprite(mat);
    texLoader.load(url,t=>{ if('colorSpace' in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;else if('encoding'in t&&THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;mat.map=t;mat.needsUpdate=true;if(onReady)onReady(spr,t); },undefined,()=>{});
    return spr;
  }

  function buildPlayer(){
    const group=new THREE.Group(); scene.add(group);
    const aura=new THREE.Mesh(new THREE.RingGeometry(.9,1.45,48),new THREE.MeshBasicMaterial({color:0x5de8ff,transparent:true,opacity:.63,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
    aura.rotation.x=-Math.PI/2; aura.position.y=.06; group.add(aura);
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.05,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3,depthWrite:false})); shadow.rotation.x=-Math.PI/2; shadow.position.y=.025; group.add(shadow);
    const spr=loadSprite(`img/blocks/${profileAvatar()}.png`); spr.scale.set(3.35,4.65,1);spr.position.y=2.3;group.add(spr);
    const crown=makeTextSprite('✦',0x8ef3ff,120,120);crown.scale.set(.65,.65,1);crown.position.y=4.65;group.add(crown);
    player={group,spr,aura,crown,pos:group.position,vel:new THREE.Vector3(),facing:new THREE.Vector3(0,0,-1)};
    aimRing=new THREE.Mesh(new THREE.RingGeometry(.85,1.15,40),new THREE.MeshBasicMaterial({color:0xffe873,transparent:true,opacity:.8,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
    aimRing.rotation.x=-Math.PI/2;aimRing.position.y=.08;aimRing.visible=false;scene.add(aimRing);
    maxShield=own('wing')?30:0;shield=maxShield;
  }

  function petImage(p){
    if(!p) return '';
    if(typeof currentPetImg==='function'){ const s=currentPetImg(p); if(s) return s; }
    const st=typeof petStage==='function'?petStage(p):(p.level>=3?'adult':p.level===2?'baby':'newborn');
    return `img/${p.type}_${st}_normal.png`;
  }

  function buildPet(){
    const p=petInfo(); if(!p) return;
    const group=new THREE.Group();group.position.set(-1.8,0,1.8);scene.add(group);
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.55,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.25,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;group.add(shadow);
    const spr=loadSprite(petImage(p)); const sz=p.type==='dragon'?2.5:2.0;spr.scale.set(sz,sz,1);spr.position.y=1.05;group.add(spr);
    const glow=new THREE.Mesh(new THREE.RingGeometry(.48,.68,30),new THREE.MeshBasicMaterial({color:p.type==='dragon'?0xff8a48:0x78f4d1,transparent:true,opacity:.42,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));glow.rotation.x=-Math.PI/2;glow.position.y=.04;group.add(glow);
    petComp={group,spr,glow,vel:new THREE.Vector3(),type:p.type,data:p,phase:Math.random()*TAU};
  }

  function makeTextSprite(text,color=0xffffff,w=256,h=128){
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.clearRect(0,0,w,h);x.textAlign='center';x.textBaseline='middle';x.font=`900 ${Math.round(h*.62)}px Kanit,Arial`;
    x.shadowColor='#000';x.shadowBlur=12;x.lineWidth=Math.max(5,h*.07);x.strokeStyle='rgba(0,8,20,.92)';x.strokeText(text,w/2,h/2);
    x.fillStyle='#'+new THREE.Color(color).getHexString();x.shadowColor=x.fillStyle;x.shadowBlur=18;x.fillText(text,w/2,h/2);
    const t=new THREE.CanvasTexture(c);if('colorSpace'in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;else if('encoding'in t&&THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;
    return new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));
  }

  function buildBot(ch,elite=false){
    const group=new THREE.Group(),col=BOT_COLORS[(ch.charCodeAt(0)+kills)%BOT_COLORS.length];
    const coreMat=new THREE.MeshStandardMaterial({color:0x142342,emissive:col,emissiveIntensity:.42,metalness:.68,roughness:.26});
    const body=new THREE.Mesh(new THREE.IcosahedronGeometry(elite?1.45:1.08,1),coreMat);body.scale.y=1.18;body.position.y=1.25;group.add(body);
    const eyeMat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.92,blending:THREE.AdditiveBlending});
    const eye=new THREE.Mesh(new THREE.TorusGeometry(elite?.76:.57,.10,8,28),eyeMat);eye.position.set(0,1.38,.88);group.add(eye);
    for(let i=0;i<(elite?8:5);i++){ const spike=new THREE.Mesh(new THREE.ConeGeometry(.18,elite?1.3:.9,5),coreMat);const a=i/(elite?8:5)*TAU;spike.position.set(Math.sin(a)*(elite?1.25:.92),1.2,Math.cos(a)*(elite?1.25:.92));spike.rotation.z=Math.sin(a)*1.1;spike.rotation.x=Math.cos(a)*1.1;group.add(spike); }
    const letter=makeTextSprite(ch,col);letter.scale.set(elite?2.2:1.65,elite?1.1:.84,1);letter.position.y=3.25;group.add(letter);
    const barBack=new THREE.Mesh(new THREE.PlaneGeometry(elite?2.7:2.1,.18),new THREE.MeshBasicMaterial({color:0x180e20,transparent:true,opacity:.9,side:THREE.DoubleSide}));barBack.position.y=2.62;group.add(barBack);
    const bar=new THREE.Mesh(new THREE.PlaneGeometry(elite?2.62:2.02,.11),new THREE.MeshBasicMaterial({color:elite?0xffc24d:0x61f5b3,side:THREE.DoubleSide}));bar.position.set(0,2.62,.012);group.add(bar);
    const a=Math.random()*TAU,r=rnd(17,28);group.position.set(Math.sin(a)*r,0,Math.cos(a)*r);scene.add(group);
    const mhp=elite?180:80+rnd(-8,16),bot={group,body,letter,bar,col,ch,elite,hp:mhp,maxHp:mhp,vel:new THREE.Vector3(),attackAt:rnd(.3,1.2),phase:Math.random()*TAU,dead:false,slow:0};
    bots.push(bot);return bot;
  }

  function missingLetters(){
    if(!target) return [];
    const need={}; for(const ch of target.en.toUpperCase()) need[ch]=(need[ch]||0)+1;
    for(const [ch,n] of Object.entries(bag)) need[ch]=Math.max(0,(need[ch]||0)-n);
    return Object.entries(need).flatMap(([ch,n])=>Array(n).fill(ch));
  }
  function chooseBotLetter(){
    const miss=missingLetters();
    if(miss.length&&Math.random()<.72) return miss[Math.floor(Math.random()*miss.length)];
    return ALPHABET[Math.floor(Math.random()*ALPHABET.length)];
  }
  function ensureBots(now){
    if(now-lastBotEnsure<500)return;lastBotEnsure=now;
    while(respawns.length&&respawns[0]<=now){respawns.shift();if(bots.length<BOT_TARGET)buildBot(chooseBotLetter(),kills>0&&kills%12===0);}
    while(bots.length+respawns.length<BOT_TARGET)buildBot(chooseBotLetter(),false);
  }

  function targetNearest(range=99,exclude){
    let best=null,bd=range;
    for(const b of bots){ if(b.dead||b===exclude)continue;const d=flatDist(player.pos,b.group.position);if(d<bd){bd=d;best=b;} }
    return best;
  }

  function castSkill(kind){
    if(!running||paused||performance.now()<cooldown[kind]) return;
    ensureAudio();
    const now=performance.now(),mult=powerMult();
    if(kind==='ult'&&energy<5){ feed(`ต้องเก็บอักษรอีก ${5-energy} ตัว เพื่อเปิด WORDSTORM`,'bad');pulseButton('ult');return; }
    if(kind==='basic'){
      const b=targetNearest(15);if(!b){feed('เข้าใกล้ปีศาจอีกนิดครับ');return;}
      cooldown.basic=now+SKILL_CD.basic*1000;fireBolt(b,24*mult,0x7ff3ff,false);
      if(own('echo')){const b2=targetNearest(15,b);if(b2)setTimeout(()=>{if(running&&!b2.dead)fireBolt(b2,16*mult,0xcb7cff,false);},85);}
      tone(480,.05,.08,'sine');
    }else if(kind==='arc'){
      const first=targetNearest(17);if(!first){feed('ไม่มีปีศาจในระยะ ARC');return;}
      cooldown.arc=now+SKILL_CD.arc*1000;let cur=first,seen=new Set();
      for(let i=0;i<3&&cur;i++){seen.add(cur);const from=i?Array.from(seen)[i-1].group.position:player.pos;beam(from,cur.group.position,i?0xa777ff:0x66eeff,.23);hitBot(cur,(42-i*8)*mult);cur=bots.filter(b=>!b.dead&&!seen.has(b)&&flatDist(b.group.position,cur.group.position)<7).sort((a,b)=>flatDist(a.group.position,cur.group.position)-flatDist(b.group.position,cur.group.position))[0];}
      burst(first.group.position,0x77e9ff,22,5);tone(720,.13,.16,'sawtooth');haptic(22);
    }else if(kind==='nova'){
      cooldown.nova=now+SKILL_CD.nova*1000;const rad=own('storm')?8.2:6.1;ringFx(player.pos,0xb55cff,rad,.62);
      let n=0;for(const b of bots.slice()){if(!b.dead&&flatDist(player.pos,b.group.position)<=rad){hitBot(b,48*mult);burst(b.group.position,0xd27cff,10,3);n++;}}
      feed(n?`🌀 NOVA โดน ${n} เป้าหมาย`:'🌀 NOVA ยังไม่ถึงตัวปีศาจ');tone(235,.32,.18,'sawtooth');haptic(35);
    }else if(kind==='ult'){
      const charge=energy;energy=0;cooldown.ult=now+SKILL_CD.ult*1000;
      ringFx(player.pos,0x57efff,9,.85);setTimeout(()=>running&&ringFx(player.pos,0xff5bd8,15,.85),120);setTimeout(()=>running&&ringFx(player.pos,0xffe56c,22,.9),240);
      for(const b of bots.slice()){if(b.dead)continue;beam(new THREE.Vector3(b.group.position.x,11,b.group.position.z),b.group.position,0xffec8b,.45);hitBot(b,(74+charge*8)*(own('prism')?1.25:1));burst(b.group.position,BOT_COLORS[Math.floor(Math.random()*BOT_COLORS.length)],28,7);}
      showPop('WORDSTORM',`พลังอักษร ${charge} ตัว ระเบิดทั่วสนาม!`);tone(110,.7,.24,'sawtooth');setTimeout(()=>tone(660,.38,.16,'sine'),120);haptic([30,45,60]);
    }
    updateHud();
  }

  function fireBolt(bot,damage,color,fromPet){
    if(!bot||bot.dead)return;
    const geo=new THREE.SphereGeometry(fromPet ? .16 : .24,10,8),mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.96,blending:THREE.AdditiveBlending});
    const mesh=new THREE.Mesh(geo,mat),start=(fromPet&&petComp?petComp.group.position:player.pos).clone();start.y=fromPet?1.25:1.6;mesh.position.copy(start);scene.add(mesh);
    shots.push({mesh,target:bot,damage,color,fromEnemy:false,ttl:1.7,lastSpark:0,speed:fromPet?19:24});
  }
  function enemyBolt(bot){
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(bot.elite?.25:.18,9,7),new THREE.MeshBasicMaterial({color:bot.elite?0xffb141:0xff4e89,transparent:true,opacity:.92,blending:THREE.AdditiveBlending}));
    mesh.position.copy(bot.group.position);mesh.position.y=1.3;scene.add(mesh);
    // สนามนี้เน้นฝึกคำศัพท์ เด็กต้องมีเวลาวิ่งเก็บอักษร — กระสุนบอทจึงเป็นแรงกดดันเบา ไม่รุมตายเร็ว
    const to=player.pos.clone().sub(bot.group.position).setY(0).normalize();shots.push({mesh,vel:to.multiplyScalar(bot.elite?8.5:7),damage:bot.elite?9:4,color:bot.elite?0xffb141:0xff4e89,fromEnemy:true,ttl:2.7,lastSpark:0});
  }
  function hitBot(b,dmg){
    if(!b||b.dead)return;
    b.hp-=dmg;b.bar.scale.x=clamp(b.hp/b.maxHp,0,1);b.bar.position.x=-(1-b.bar.scale.x)*(b.elite?1.31:1.01);
    b.body.material.emissiveIntensity=2.2;setTimeout(()=>{if(b&&!b.dead)b.body.material.emissiveIntensity=.42;},70);
    floatText(b.group.position,`-${Math.round(dmg)}`,dmg>70?0xffef75:0x9df5ff);burst(b.group.position,b.col,6,1.8);
    if(b.hp<=0)killBot(b);
  }
  function killBot(b){
    if(b.dead)return;b.dead=true;kills++;state.arenaStats.kills=(state.arenaStats.kills||0)+1;
    const idx=bots.indexOf(b);if(idx>=0)bots.splice(idx,1);scene.remove(b.group);disposeTree(b.group);
    dropLetter(b.group.position,b.ch,b.col);respawns.push(performance.now()+rnd(900,1700));respawns.sort((a,c)=>a-c);
    feed(`👾 กำจัดปีศาจ ${b.ch} — เก็บอักษรที่ตกได้เลย`);tone(180,.12,.11,'square');
  }

  function dropLetter(pos,ch,col){
    const group=new THREE.Group();group.position.copy(pos);group.position.y=.35;
    const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.58,0),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.65,metalness:.3,roughness:.18,transparent:true,opacity:.9}));gem.scale.y=1.3;group.add(gem);
    const spr=makeTextSprite(ch,0xffffff,180,180);spr.scale.set(1.12,1.12,1);spr.position.y=1.3;group.add(spr);
    const halo=new THREE.Mesh(new THREE.RingGeometry(.55,.82,30),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.68,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));halo.rotation.x=-Math.PI/2;halo.position.y=.08;group.add(halo);
    scene.add(group);drops.push({group,gem,halo,ch,col,phase:Math.random()*TAU,life:18});
  }
  function collectDrop(d){
    bag[d.ch]=(bag[d.ch]||0)+1;recentLetters.push(d.ch);if(recentLetters.length>9)recentLetters.shift();energy=Math.min(ENERGY_MAX,energy+1);
    const p=d.group.position.clone();scene.remove(d.group);disposeTree(d.group);drops.splice(drops.indexOf(d),1);
    burst(p,d.col,24,4);ringFx(p,d.col,2.8,.36);floatText(p,`+ ${d.ch}`,0xfff39a);tone(880,.16,.12,'sine');haptic(18);
    feed(`🔤 เก็บ ${d.ch} แล้ว · พลังโจมตี ×${powerMult().toFixed(1)}`,'gold');updateHud();checkWord();
  }

  function nextWord(){
    wordBusy=false;const done=Array.isArray(state.advDone)?state.advDone:[];
    let pool=(typeof vocabForStudent==='function'?vocabForStudent():[]).filter(x=>x&&/^[a-z]{3,8}$/i.test(x[0])).filter(x=>!done.includes(String(x[0]).toLowerCase()));
    if(!pool.length){state.advDone=[];pool=(typeof vocabForStudent==='function'?vocabForStudent():[]).filter(x=>x&&/^[a-z]{3,8}$/i.test(x[0]));}
    if(!pool.length)pool=[['cat','แมว'],['dog','สุนัข'],['book','หนังสือ'],['star','ดาว']];
    const pick=pool[Math.floor(Math.random()*pool.length)];target={en:String(pick[0]).toUpperCase(),th:String(pick[1]||'คำศัพท์')};wordNo++;
    updateWord();feed(`📖 คำใหม่ ${target.en} = ${target.th}`,'gold');
  }
  function canBuild(){
    if(!target)return false;const tmp={...bag};for(const ch of target.en){if(!tmp[ch])return false;tmp[ch]--;}return true;
  }
  function checkWord(){ if(canBuild()&&!wordBusy)completeWord(); }
  function completeWord(){
    wordBusy=true;for(const ch of target.en)bag[ch]--;
    const reward=40+target.en.length*15+Math.min(100,energy*5),word=target.en,meaning=target.th;
    if(!Array.isArray(state.advDone))state.advDone=[];if(!state.advDone.includes(word.toLowerCase()))state.advDone.push(word.toLowerCase());
    addCoins(reward);sessionWords++;sessionCoins+=reward;state.arenaStats.words=(state.arenaStats.words||0)+1;saveState();
    showPop(word,`${meaning} · +${fmt(reward)} 🪙`);feed(`🎉 ประกอบ ${word} สำเร็จ ได้ ${fmt(reward)} เหรียญ`,'gold');
    ringFx(player.pos,0xffe36d,8,.65);burst(player.pos,0xffe36d,38,7);tone(523,.42,.16,'sine');setTimeout(()=>tone(784,.45,.13,'sine'),90);
    updateHud();setTimeout(()=>{if(running)nextWord();},1350);
  }

  function buyItem(id){
    ensureState();const it=STORE.find(x=>x.id===id);if(!it||own(id))return;
    if((state.coins||0)<it.price){feed(`เหรียญยังไม่พอซื้อ ${it.name} — ขาด ${fmt(it.price-(state.coins||0))} 🪙`,'bad');tone(150,.13,.11,'square');return;}
    state.coins-=it.price;state.arenaItems[id]=true;saveState();
    if(id==='wing'){maxShield=30;shield=maxShield;}
    renderShop();updateHud();feed(`✨ ซื้อ ${it.name} แล้ว ใช้พลังทันที`,'gold');showPop(it.ico,it.name);tone(660,.22,.14,'sine');
    if(typeof sfx!=='undefined'&&sfx.buy)sfx.buy();
  }
  function renderShop(){
    if(!ui.storeGrid)return;ui.shopCoins.textContent=fmt(state.coins||0);
    ui.storeGrid.innerHTML=STORE.map(it=>`<button class="va-store-item${own(it.id)?' owned':''}" data-buy="${it.id}"><span class="va-store-ico">${it.ico}</span><div class="va-store-name">${it.name}</div><div class="va-store-desc">${it.desc}</div><div class="va-store-price">${own(it.id)?'✓ มีแล้ว':`🪙 ${fmt(it.price)}`}</div></button>`).join('');
  }
  function toggleShop(on){
    if(!running)return;ui.shop.classList.toggle('on',!!on);paused=!!on||ui.intro.classList.contains('on');
    if(on)renderShop();else{paused=false;clock.getDelta();}
  }

  function updatePlayer(dt,t){
    let x=joy.x,z=joy.z;
    if(keys.has('KeyA')||keys.has('ArrowLeft'))x-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))x+=1;
    if(keys.has('KeyW')||keys.has('ArrowUp'))z-=1;if(keys.has('KeyS')||keys.has('ArrowDown'))z+=1;
    const len=Math.hypot(x,z);if(len>1){x/=len;z/=len;}
    const petSpeed=petComp&&petComp.type==='dog'?1.08:1,speed=7.5*petSpeed;
    player.vel.x+=(x*speed-player.vel.x)*Math.min(1,dt*10);player.vel.z+=(z*speed-player.vel.z)*Math.min(1,dt*10);
    if(len<.05){player.vel.x*=Math.max(0,1-dt*7);player.vel.z*=Math.max(0,1-dt*7);}
    player.pos.x+=player.vel.x*dt;player.pos.z+=player.vel.z*dt;
    const r=Math.hypot(player.pos.x,player.pos.z);if(r>ARENA_R-1.8){player.pos.x*=((ARENA_R-1.8)/r);player.pos.z*=((ARENA_R-1.8)/r);}
    if(player.vel.lengthSq()>.12)player.facing.set(player.vel.x,0,player.vel.z).normalize();
    player.spr.position.y=2.3+Math.sin(t*.012)*(len>.1?.12:.045);player.aura.rotation.z+=dt*(1.4+energy*.16);player.aura.material.color.setHex(energy>=5?0xff79dd:0x5de8ff);player.crown.material.opacity=.55+Math.sin(t*.006)*.3;
  }

  function updatePet(dt,t){
    if(!petComp)return;const moving=player.vel.lengthSq()>.25;
    const behind=player.facing.clone().multiplyScalar(moving?-2.15:-1.35),side=new THREE.Vector3(-player.facing.z,0,player.facing.x).multiplyScalar(moving?1.0:Math.sin(t*.0008+petComp.phase)*1.15);
    const goal=player.pos.clone().add(behind).add(side);const delta=goal.sub(petComp.group.position);petComp.vel.addScaledVector(delta,dt*14);petComp.vel.multiplyScalar(Math.pow(.035,dt));petComp.group.position.addScaledVector(petComp.vel,dt);
    const d=flatDist(petComp.group.position,player.pos);if(d>7){petComp.group.position.lerp(player.pos,.3);petComp.vel.set(0,0,0);burst(petComp.group.position,0x83f5d3,12,2);}
    const pace=Math.min(1,petComp.vel.length()/7);petComp.spr.position.y=1.05+Math.abs(Math.sin(t*.014+petComp.phase))*.18*pace+Math.sin(t*.004)*.035;petComp.spr.scale.x=Math.abs(petComp.spr.scale.x)*(petComp.vel.x<-.12?-1:1);petComp.glow.rotation.z-=dt*1.6;
    if(t-lastPetStrike>4600&&bots.length){const b=targetNearest(11);if(b){lastPetStrike=t;const bonus=petComp.type==='dragon'?26:petComp.type==='cat'?20:15;fireBolt(b,bonus*(own('prism')?1.25:1),petComp.type==='dragon'?0xff784d:0x7fffd2,true);feed(`🐾 ${petComp.data.name||'น้อง'} ช่วยโจมตี!`);}}
  }

  function updateBots(dt,t){
    const ppos=player.pos;
    for(const b of bots){
      const to=ppos.clone().sub(b.group.position).setY(0),d=to.length(),dir=to.normalize(),desired=new THREE.Vector3();
      if(d>8.5)desired.copy(dir).multiplyScalar(b.elite?3.5:2.7);else if(d<5.2)desired.copy(dir).multiplyScalar(-1.8);else desired.set(-dir.z,0,dir.x).multiplyScalar(Math.sin(t*.001+b.phase)>0?1.4:-1.4);
      if(b.slow>t)desired.multiplyScalar(.45);b.vel.lerp(desired,Math.min(1,dt*2.8));b.group.position.addScaledVector(b.vel,dt);
      const rr=Math.hypot(b.group.position.x,b.group.position.z);if(rr>ARENA_R-1){b.group.position.multiplyScalar((ARENA_R-1)/rr);}
      b.body.rotation.y+=dt*(b.elite?1.7:1.1);b.body.position.y=1.25+Math.sin(t*.003+b.phase)*.16;b.letter.position.y=3.25+Math.sin(t*.004+b.phase)*.13;
      b.group.lookAt(camera.position.x,b.group.position.y,camera.position.z);
      if(d<9.5&&t>b.attackAt){enemyBolt(b);b.attackAt=t+(b.elite?1500:rnd(2200,3200));}
    }
  }

  function updateShots(dt,t){
    for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.ttl-=dt;if(s.ttl<=0||!s.mesh.parent){removeShot(i);continue;}
      if(s.fromEnemy){s.mesh.position.addScaledVector(s.vel,dt);if(flatDist(s.mesh.position,player.pos)<1.05){const hitPos=s.mesh.position.clone(),dmg=s.damage,col=s.color;removeShot(i);const revived=damagePlayer(dmg);burst(hitPos,col,10,2);if(revived)return;continue;}}
      else{if(!s.target||s.target.dead){removeShot(i);continue;}const goal=s.target.group.position.clone();goal.y=1.3;const v=goal.sub(s.mesh.position),d=v.length();if(d<s.speed*dt+.35){hitBot(s.target,s.damage);burst(s.mesh.position,s.color,10,2);removeShot(i);continue;}s.mesh.position.addScaledVector(v.normalize(),s.speed*dt);}
      s.mesh.scale.setScalar(1+Math.sin(t*.03)*.18);if(t-s.lastSpark>55){s.lastSpark=t;spark(s.mesh.position,s.color);}
    }
  }
  function removeShot(i){const s=shots[i];if(!s)return;scene.remove(s.mesh);s.mesh.geometry.dispose();s.mesh.material.dispose();shots.splice(i,1);}
  function damagePlayer(n){
    if(shield>0){const use=Math.min(shield,n);shield-=use;n-=use;if(use)floatText(player.pos,`โล่ -${Math.ceil(use)}`,0x79dfff);}
    if(n>0)hp=Math.max(0,hp-n);lastHitAt=performance.now();root.animate([{filter:'none'},{filter:'drop-shadow(0 0 26px #ff315f)'},{filter:'none'}],{duration:220});tone(95,.12,.12,'square');haptic(28);
    const revived=hp<=0;if(revived)revive();updateHud();return revived;
  }
  function revive(){
    hp=maxHp;shield=maxShield;energy=Math.max(0,energy-2);player.pos.set(0,0,7);
    for(let i=shots.length-1;i>=0;i--)if(shots[i].fromEnemy)removeShot(i);
    showPop('คืนพลัง','ไม่เสียเหรียญ · พลังอักษรลด 2 หน่วย');feed('🪽 กลับเข้าสนามแล้ว ไม่มีการหักเหรียญ','bad');ringFx(player.pos,0x79f5ff,6,.7);
  }

  function updateDrops(dt,t){
    for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.life-=dt;if(d.life<=0){scene.remove(d.group);disposeTree(d.group);drops.splice(i,1);continue;}d.gem.rotation.y+=dt*2.6;d.gem.rotation.x+=dt*.8;d.group.position.y=.35+Math.sin(t*.004+d.phase)*.16;d.halo.rotation.z+=dt*1.8;if(flatDist(d.group.position,player.pos)<1.65)collectDrop(d);}
  }
  function updateEffects(dt){
    for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.life-=dt;if(f.vel)f.mesh.position.addScaledVector(f.vel,dt);if(f.spin)f.mesh.rotation.z+=dt*f.spin;
      const k=clamp(f.life/f.max,0,1);if(f.kind==='burst'){f.vel.y-=dt*2.8;f.mesh.scale.setScalar(Math.max(.01,k));}
      else if(f.kind==='ring'){const s=1+(1-k)*(f.to-1);f.mesh.scale.setScalar(s);}
      else if(f.kind==='float'){f.mesh.position.y+=dt*.9;}
      if(f.mesh.material)f.mesh.material.opacity=k*(f.opacity||1);
      if(f.life<=0){scene.remove(f.mesh);disposeTree(f.mesh);effects.splice(i,1);}
    }
  }

  function cameraTick(dt){
    const aspect=innerWidth/innerHeight,wide=aspect>1.8;const want=new THREE.Vector3(player.pos.x,wide?20.5:23,player.pos.z+(wide?15:17));camera.position.lerp(want,1-Math.pow(.002,dt));camera.lookAt(player.pos.x,0,player.pos.z-2.3);
    const b=targetNearest(15);aimRing.visible=!!b;if(b){aimRing.position.x=b.group.position.x;aimRing.position.z=b.group.position.z;aimRing.scale.setScalar(b.elite?1.35:1);aimRing.material.opacity=.55+Math.sin(performance.now()*.008)*.25;}
  }

  function loop(t){
    if(!running)return;raf=requestAnimationFrame(loop);const dt=Math.min(.034,lastFrame?(t-lastFrame)/1000:.016);lastFrame=t;
    if(!paused){updatePlayer(dt,t);updatePet(dt,t);updateBots(dt,t);updateShots(dt,t);updateDrops(dt,t);updateEffects(dt);ensureBots(t);cameraTick(dt);
      if(maxShield&&t-lastHitAt>4200)shield=Math.min(maxShield,shield+dt*4.5);if(arenaMotes)arenaMotes.rotation.y+=dt*.015;updateCooldownUi(t);}
    renderer.render(scene,camera);
  }

  function flatDist(a,b){const x=a.x-b.x,z=a.z-b.z;return Math.hypot(x,z);}
  function burst(pos,color,n=12,force=3){
    if(fxLow)n=Math.ceil(n*.45);for(let i=0;i<n;i++){const mesh=new THREE.Mesh(new THREE.OctahedronGeometry(rnd(.06,.17),0),new THREE.MeshBasicMaterial({color,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));mesh.position.copy(pos);mesh.position.y+=rnd(.4,2);scene.add(mesh);const a=Math.random()*TAU,v=new THREE.Vector3(Math.sin(a)*rnd(.4,force),rnd(.8,force*.8),Math.cos(a)*rnd(.4,force));const life=rnd(.3,.7);effects.push({mesh,vel:v,life,max:life,kind:'burst',opacity:1});}
  }
  function spark(pos,color){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.065,5,4),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));mesh.position.copy(pos);scene.add(mesh);effects.push({mesh,vel:new THREE.Vector3(rnd(-.3,.3),rnd(-.2,.2),rnd(-.3,.3)),life:.16,max:.16,kind:'burst',opacity:.7});}
  function ringFx(pos,color,to=5,life=.5){const mesh=new THREE.Mesh(new THREE.RingGeometry(.8,1,52),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.set(pos.x,.12,pos.z);scene.add(mesh);effects.push({mesh,life,max:life,kind:'ring',to,opacity:.9});}
  function beam(a,b,color,life=.25){
    const p1=a.clone(),p2=b.clone();p1.y=p1.y||1.4;p2.y=p2.y||1.4;const mid=p1.clone().add(p2).multiplyScalar(.5),len=p1.distanceTo(p2),mesh=new THREE.Mesh(new THREE.CylinderGeometry(.055,.16,len,7,1,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));mesh.position.copy(mid);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p2.clone().sub(p1).normalize());scene.add(mesh);effects.push({mesh,life,max:life,kind:'fade',opacity:.95});
  }
  function floatText(pos,text,color){const mesh=makeTextSprite(text,color,256,100);mesh.scale.set(2.1,.82,1);mesh.position.copy(pos);mesh.position.y=3.4;scene.add(mesh);effects.push({mesh,life:.72,max:.72,kind:'float',opacity:1});}
  function disposeTree(obj){obj.traverse&&obj.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});}

  function feed(text,kind=''){
    if(!ui.feed)return;const d=document.createElement('div');d.className='va-feed-line '+kind;d.textContent=text;ui.feed.prepend(d);while(ui.feed.children.length>4)ui.feed.lastElementChild.remove();setTimeout(()=>d.remove(),4200);
  }
  function showPop(big,small){if(!ui.pop)return;ui.pop.querySelector('strong').textContent=big;ui.pop.querySelector('span').textContent=small||'';ui.pop.classList.add('on');clearTimeout(ui.pop._t);ui.pop._t=setTimeout(()=>ui.pop.classList.remove('on'),1450);}
  function updateWord(){
    if(!target)return;ui.wordTh.textContent=`${target.th} · กำจัดปีศาจแล้วเก็บอักษร`;ui.wordEn.textContent=target.en;
    const have={...bag};ui.wordSlots.innerHTML=Array.from(target.en).map(ch=>{const got=have[ch]>0;if(got)have[ch]--;return `<i class="${got?'got':''}"></i>`;}).join('');
  }
  function updateHud(){
    if(!root)return;ui.coins.textContent=fmt(state.coins||0);ui.shopCoins.textContent=fmt(state.coins||0);ui.energyFill.style.width=(energy/ENERGY_MAX*100)+'%';ui.energy.classList.toggle('hot',energy>=5);ui.energyPower.textContent='×'+powerMult().toFixed(1);
    ui.hpFill.style.width=(hp/maxHp*100)+'%';ui.hp.classList.toggle('low',hp/maxHp<.3);ui.hp.querySelector('b').textContent=maxShield?`HP ${Math.ceil(hp)} · 🛡${Math.ceil(shield)}`:`HP ${Math.ceil(hp)}`;
    const entries=Object.entries(bag).filter(x=>x[1]>0).slice(-8);ui.bagList.innerHTML=entries.length?entries.map(([ch,n])=>`<span class="va-bag-letter">${ch}${n>1?`<small>×${n}</small>`:''}</span>`).join(''):'<span style="font-size:9px;color:#7795aa">ยังไม่มีอักษร</span>';
    root.querySelector('[data-skill="ult"]').classList.toggle('ready',energy>=5);root.querySelector('[data-skill="ult"]').classList.toggle('locked',energy<5);updateWord();
  }
  function updateCooldownUi(t){
    root.querySelectorAll('[data-skill]').forEach(b=>{const k=b.dataset.skill,left=Math.max(0,cooldown[k]-t),total=SKILL_CD[k]*1000;b.classList.toggle('cool',left>0);b.style.setProperty('--cd',Math.round(left/total*100)+'%');b.querySelector('.cd').textContent=left>0?(left/1000).toFixed(left>950?0:1):'';});
  }
  function pulseButton(k){const b=root.querySelector(`[data-skill="${k}"]`);if(b)b.animate([{transform:'scale(1)'},{transform:'scale(.84)'},{transform:'scale(1)'}],{duration:240});}

  function ensureAudio(){if(!state.sound)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}catch(e){}}
  function tone(freq,dur=.1,vol=.1,type='sine'){if(!state.sound)return;ensureAudio();if(!audioCtx)return;const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(45,freq*.55),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+dur+.02);}
  function haptic(v){if(state.haptic&&navigator.vibrate)try{navigator.vibrate(v);}catch(e){}}

  function resize(){if(!renderer||!camera)return;const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}

  function resetRound(){
    bots=[];drops=[];shots=[];effects=[];respawns=[];bag={};recentLetters=[];energy=0;kills=0;sessionWords=0;sessionCoins=0;cooldown={basic:0,arc:0,nova:0,ult:0};hp=maxHp;shield=maxShield;wordBusy=false;lastPetStrike=performance.now();lastHitAt=0;
    player.pos.set(0,0,7);player.vel.set(0,0,0);if(petComp){petComp.group.position.set(-1.8,0,9);petComp.vel.set(0,0,0);}nextWord();for(let i=0;i<BOT_TARGET;i++)buildBot(chooseBotLetter(),false);updateHud();
  }

  function start(){
    if(running)return;ensureState();fxLow=!!state.noAnim||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
    if(typeof clearWarnToasts==='function')clearWarnToasts();if(typeof Music!=='undefined')Music.suspendBg();
    createDom();initThree();resetRound();running=true;paused=!state.arenaIntro;lastFrame=0;
    if(!state.arenaIntro)ui.intro.classList.add('on');else feed('เดินด้วยจอยซ้าย · กดพลังด้านขวา · เก็บอักษรให้ครบคำ','gold');
    raf=requestAnimationFrame(loop);
  }

  function stop(){
    if(!running)return;running=false;paused=false;cancelAnimationFrame(raf);raf=0;listeners.splice(0).forEach(fn=>{try{fn();}catch(e){}});keys.clear();joy={x:0,z:0,id:null};
    for(const s of shots)if(s.mesh.parent)scene.remove(s.mesh);if(scene)disposeTree(scene);if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();renderer.setSize(2,2,false);}
    if(root)root.remove();root=null;built=false;renderer=scene=camera=clock=null;bots=[];drops=[];shots=[];effects=[];petComp=null;player=null;
    saveState();if(typeof Music!=='undefined')Music.resumeBg();if(typeof renderDashboard==='function')renderDashboard();
    if(typeof toast==='function')toast(`🌀 กลับจาก Vocab Arena — สำเร็จ ${sessionWords} คำ · +${fmt(sessionCoins)} 🪙`);
  }

  window.VocabArena3D={start,stop,_t:{
    get running(){return running},get bots(){return bots},get drops(){return drops},get bag(){return bag},get target(){return target},get energy(){return energy},
    cast:castSkill,kill:(i=0)=>bots[i]&&hitBot(bots[i],9999),collect:(i=0)=>drops[i]&&collectDrop(drops[i]),complete:()=>{if(target){for(const ch of target.en)bag[ch]=(bag[ch]||0)+1;checkWord();}},
    buy:buyItem,player:()=>player,resize,
    /* ทดสอบแยกเฟสเมื่อ WebView เครื่องใดสร้างฉากไม่ผ่าน — ไม่ทำงานเองในเกมจริง */
    stage(part){
      if(part==='dom'){ensureState();createDom();return 'dom';}
      if(part==='three'){if(!root){ensureState();createDom();}initThree();return 'three';}
      if(part==='reset'){if(!built){if(!root){ensureState();createDom();}initThree();}resetRound();return 'reset';}
      return 'unknown';
    },
    frame:(ms=16)=>{const t=performance.now();updatePlayer(ms/1000,t);updatePet(ms/1000,t);updateBots(ms/1000,t);updateShots(ms/1000,t);updateDrops(ms/1000,t);updateEffects(ms/1000);cameraTick(ms/1000);renderer.render(scene,camera);}
  }};
})();
