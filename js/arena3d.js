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
  const SKILL_CD={basic:.34,arc:4,nova:7,ult:15,...Object.fromEntries(ArenaElements.skills.map(s=>[s.id,s.cd]))};
  /* ============================================================
     🤝👑 รอบ 1048 — CO-OP PVE + CHAPTER BOSSES
     ใช้ NetRoom/Firebase fields เดิมเท่านั้น: ห้องละ 2–4 คน, ผู้นำห้อง
     กระจาย state ของบอส, revive แบบกดค้าง และรางวัลฐานเท่ากันทุกคน
     ============================================================ */
  const PARTY_MAX=4, BOSS_WORD_GOAL=3, REVIVE_HOLD_MS=2200, DOWN_MS=12000;
  const CHAPTERS=[
    {id:1,ico:'🌿',name:'ประตูอักษร',boss:'ผู้พิทักษ์คำสั้น',min:3,max:4,color:0x59f0ba},
    {id:2,ico:'🌊',name:'สายน้ำความหมาย',boss:'อสูรสะท้อนคำ',min:4,max:5,color:0x50d9ff},
    {id:3,ico:'🌙',name:'หอคอยประโยค',boss:'จอมเวทพจนานุกรม',min:5,max:6,color:0xbe72ff},
    {id:4,ico:'☀️',name:'แกนปริซึม',boss:'ราชันคำศัพท์',min:6,max:8,color:0xffcf62},
  ];
  const STORE=typeof ArenaRelics!=='undefined'?ArenaRelics.items:[
    {id:'prism',ico:'💠',name:'แกนปริซึม',price:250,desc:'พลังโจมตีทุกสกิล +25%'},
    {id:'storm',ico:'🌀',name:'ตราวายุ',price:600,desc:'วงระเบิด Nova กว้างขึ้น 35%'},
    {id:'echo',ico:'🔮',name:'ลูกแก้วสะท้อน',price:1200,desc:'ยิงพลังพื้นฐานแยกไปหาอีก 1 เป้าหมาย'},
    {id:'wing',ico:'🪽',name:'ปีกผู้พิทักษ์',price:800,desc:'ได้โล่ 30 หน่วยและฟื้นโล่เมื่อไม่โดนโจมตี'},
  ];
  const BOT_COLORS=[0x38dcff,0x9d5cff,0xff4da6,0xffb33f,0x42f0a0];
  const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let root,canvas,renderer,scene,camera,clock,raf=0,running=false,paused=false,built=false;
  let player,petComp,aimRing,arenaMotes,fieldFx,home,elements;
  let spellSlots=['light',null],editingSlot=0,selectedHero=null,equipRequest=0;const spellPurchases=new Map();
  let activeMap=null,sceneDrawn=false,relicMods={"damage":0,"crit":0,"critDamage":0,"echoDamage":0,"cooldown":0,"megaCooldown":0,"heal":0,"hp":0,"armor":0,"regen":0,"shield":0,"speed":0,"pickup":0,"cargo":0,"dropLife":0,"wordReward":0,"petDamage":0,"petCooldown":0,"revive":0,"elements":{}};
  const skillSeconds=kind=>SKILL_CD[kind]*(selectedHero && kind===selectedHero.id ? .8 : 1)*(kind==='ult'?1-relicMods.megaCooldown:kind==='basic'?1:1-relicMods.cooldown);
  let cargo=[],homeRoute=false,lastHomePaint=0,fullHintAt=0,basicHeld=false,pendingBuy=null;
  const HOME_SPOTS=[[-12,13],[12,13],[-12,-13],[12,-13]];const CARGO_MAX=1;let race=null,raceTargets=[],vaultHomes=new Map(),raceStatus='กำลังเชื่อมต่อการแข่งขัน…',raceSessionOffset=0;
  const pendingTimers=new Set();
  function schedule(fn,ms){const id=setTimeout(()=>{pendingTimers.delete(id);if(running)fn();},ms);pendingTimers.add(id);return id;}
  let bots=[],drops=[],shots=[],effects=[],respawns=[];
  let keys=new Set(),joy={x:0,z:0,id:null},listeners=[];
  let bag={},recentLetters=[],target=null,wordBusy=false,wordNo=0;
  let energy=0,kills=0,sessionWords=0,sessionCoins=0;
  const CRYSTAL_NEED=5,CRYSTAL_RESPAWN=18;
  let crystalCharge=0,megaUses=0,crystalNodes=[],crystalLetterIndex=0;
  let cooldown={basic:0,arc:0,nova:0,ult:0},lastFrame=0,lastBotEnsure=0,lastPetStrike=0,lastHitAt=0;
  let hp=100,maxHp=100,shield=0,maxShield=0;
  let texLoader,fxLow=false;
  let room=null,myUid='local',peers={},peerActors={},lastNetSend=0,lastPartyPaint=0;
  let downed=false,downUntil=0,reviveHold=null,reviveSignal='-',reviveSeq=0,revivesGiven=0,lastReviveSent=0;
  let chapter=1,waveBase=0,bossPhase='wave',boss=null,bossEncounter='',bossMax=0,bossHp=0,bossWord='',bossContribution=0,bossWordSolved=false,bossVictoryAt=0,bossReward=0;
  const ui={};
  const vitalNodes=new Map(),vitalLive=new Set();
  const hudPoint=new THREE.Vector3();
  const letterMarks=[],letterHints=[];
  let homeHintEl=null;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const fmt=n=>(typeof fmtNum==='function'?fmtNum(n):Math.round(n).toLocaleString());
  const own=id=>!!(state.arenaItems&&state.arenaItems[id])||!!(typeof ArenaRelics!=='undefined'&&ArenaRelics.byId[id]&&typeof isAdmin==='function'&&isAdmin());
  const powerMult=()=> ((own('prism')?1.25:1)+relicMods.damage)*(1+energy*.11);
  function refreshRelics(){if(typeof ArenaRelics!=='undefined')relicMods=ArenaRelics.compile(state.arenaItems,typeof isAdmin==='function'&&isAdmin());maxHp=100+relicMods.hp;maxShield=(own('wing')?30:0)+relicMods.shield;hp=Math.min(hp,maxHp);shield=Math.min(shield,maxShield);}
  const profileAvatar=()=>{
    if(typeof lobbyBlk==='function') return lobbyBlk();
    if(/^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(state.profAv||'')) return state.profAv;
    return state.playerAvatar==='female'?'blk6':'blk1';
  };
  const petInfo=()=> typeof activePet==='function'?activePet():null;

  function addListener(el,type,fn,opt){ el.addEventListener(type,fn,opt); listeners.push(()=>el.removeEventListener(type,fn,opt)); }
  function ensureState(){
    if(!state.arenaItems||typeof state.arenaItems!=='object'||Array.isArray(state.arenaItems)) state.arenaItems={};
    refreshRelics();
    if(!state.arenaStats||typeof state.arenaStats!=='object') state.arenaStats={words:0,kills:0,bestCombo:0,bossWins:0,revives:0,coopWords:0,fairCoins:0,bestChapter:0};
    for(const k of ['words','kills','bestCombo','bossWins','revives','coopWords','fairCoins','bestChapter']) if(typeof state.arenaStats[k]!=='number') state.arenaStats[k]=0;
    if(!Number.isInteger(state.arenaChapter)||state.arenaChapter<1||state.arenaChapter>CHAPTERS.length) state.arenaChapter=1;
    if(!Array.isArray(state.arenaBossClaims)) state.arenaBossClaims=[];
    if(!state.arenaHome||typeof state.arenaHome!=='object')state.arenaHome={};
    const old=state.arenaHome.letters||{},letters={};
    for(const ch of ALPHABET){const n=Number(old[ch]);if(Number.isFinite(n)&&n>0)letters[ch]=Math.min(999,Math.floor(n));}
    state.arenaHome.letters=letters;
    selectedHero=typeof ArenaHeroes!=='undefined'?ArenaHeroes.get(state.arenaHero):null;
    activeMap=typeof ArenaMaps!=='undefined'?ArenaMaps.get(state.arenaMap):null;
    spellSlots=ArenaElements.normalizeSlots(state.arenaLoadout);state.arenaLoadout=spellSlots.slice();
    state.arenaHome.cargo=(Array.isArray(state.arenaHome.cargo)?state.arenaHome.cargo:[]).filter(ch=>typeof ch==='string'&&/^[A-Z]$/.test(ch)).slice(0,9); // Retain legacy solo cargo; never import it into the race.
  }

  function createDom(){
    root=document.getElementById('va-root');
    if(root) root.remove();
    root=document.createElement('div'); root.id='va-root';
    const av=profileAvatar(), p=petInfo(), online=typeof Online!=='undefined'&&Online.ready;
    root.innerHTML=`
      <canvas id="va-canvas"></canvas><div class="va-vitals-layer" id="va-vitals-layer"></div><div class="va-nav-layer" id="va-nav-layer"></div><div class="va-vignette"></div><div class="va-scan"></div>
      <div class="va-top">
        <button class="va-exit" id="va-exit" aria-label="ออกจากสนาม">← ออก</button>
        <div class="va-player-card va-glass"><span class="va-avatar-icon" aria-hidden="true">${selectedHero?.icon||'⚔'}</span><div class="va-player-name">${esc(state.profileName||'นักผจญภัย')}</div><div class="va-online${online?'':' off'}">● ${online?'WORD RACE':'รอออนไลน์'}</div></div>
        <div class="va-word-card va-glass"><div class="va-word-th" id="va-word-th">เป้าหมายคำศัพท์</div><div class="va-word-en" id="va-word-en">READY</div><div class="va-word-slots" id="va-word-slots"></div></div>
        <div class="va-coins va-glass"><span class="va-coin-total">🪙 <span id="va-coins">${fmt(state.coins||0)}</span></span><small id="va-session-coins" aria-label="เหรียญที่ได้รับในรอบนี้">รอบนี้ +0</small></div>
        <button class="va-shop-btn" id="va-shop-open">🛒 พลังพิเศษ</button>
      </div>
      <div class="va-energy va-glass" id="va-energy"><span class="va-energy-label" id="va-crystal-count">◆ 0 / 5 · เก็บคริสตัล</span><div class="va-energy-track"><div class="va-energy-fill" id="va-energy-fill"></div></div><span class="va-energy-power" id="va-energy-power">×1.0</span></div>
      <button class="va-music-toggle va-glass" id="va-music-toggle" type="button" role="switch" aria-label="เพลงพื้นหลัง Arena" aria-checked="true"><span class="va-music-track" aria-hidden="true"><i></i></span><span class="va-music-label">เพลง</span></button>
      <div class="va-bag va-glass"><span class="va-bag-label">ขนกลับบ้าน</span><div class="va-bag-list" id="va-bag-list"></div></div>
      <div class="va-party va-glass" id="va-party"><button id="va-party-friends" class="va-party-find" aria-label="ไปหาเพื่อน">👥</button><div><b id="va-party-status">กำลังหาปาร์ตี้…</b><div class="va-party-list" id="va-party-list"></div></div></div>
      <div class="va-boss va-glass" id="va-boss"><div class="va-boss-head"><span id="va-boss-chapter">บท 1</span><b id="va-boss-name">ผู้พิทักษ์คำศัพท์</b><em id="va-boss-hp-text">100%</em></div><div class="va-boss-track"><div class="va-boss-fill" id="va-boss-fill"></div></div><div class="va-boss-word" id="va-boss-word"></div></div>
      <div class="va-hp va-glass" id="va-hp"><b>HP</b><div class="va-hp-track"><div class="va-hp-fill" id="va-hp-fill"></div></div></div>
      <div class="va-stick" id="va-stick"><div class="va-stick-knob" id="va-stick-knob"></div></div>
      <div class="va-skills"><button class="va-spell-toggle va-glass" id="va-spells-open">✨ คลังธาตุ <small>E</small></button>
        <button class="va-skill ult" data-skill="ult" aria-label="MEGA เก็บคริสตัล 5 อัน"><span class="ico">💎</span><span class="key">3 MEGA</span><span class="cd"></span><b class="va-mega-uses" id="va-mega-uses" aria-hidden="true">เหลือ 0</b></button>
        <button class="va-skill nova" data-slot="1" data-skill="nova" aria-label="Nova"><span class="ico">🌀</span><span class="key">2 NOVA</span><span class="cd"></span></button>
        <button class="va-skill arc" data-slot="0" data-skill="arc" aria-label="Arc"><span class="ico">⚡</span><span class="key">1 ARC</span><span class="cd"></span></button>
        <button class="va-skill basic" data-skill="basic" aria-label="ยิงพลัง"><span class="ico">✦</span><span class="key">ยิง</span><span class="cd"></span></button>
      </div>
      <button class="va-home-nav va-glass" id="va-home-nav"><b>⌂ บ้านของคุณ</b><span id="va-home-hint">เดินเข้าวงเพื่อฝากอักษร</span></button><button id="va-drop-letter" class="va-glass" aria-label="ทิ้งอักษร Q">DROP · Q</button><div class="va-cargo" id="va-cargo" aria-hidden="true"></div><div class="va-feed" id="va-feed"></div>
      <div class="va-pop" id="va-pop"><strong></strong><span></span></div>
      <div class="va-downed" id="va-downed"><strong>ต้องการความช่วยเหลือ!</strong><span id="va-down-time">รอเพื่อนมาชุบ 12 วิ</span><small>ยังขยับช้า ๆ ไปหาเพื่อนได้ · ไม่เสียเหรียญ</small></div>
      <button class="va-revive" id="va-revive"><b>🤝 กดค้างเพื่อช่วยเพื่อน</b><span><i id="va-revive-fill"></i></span><small id="va-revive-name"></small></button>
      <div class="va-modal" id="va-shop"><div class="va-panel">
        <div class="va-panel-head"><div><div class="va-panel-title">🛒 คลังพลังอักษร</div><div class="va-panel-sub">ใช้เหรียญรวมที่มีอยู่ ซื้อครั้งเดียว ใช้ได้ถาวร</div></div><div class="va-panel-coins">🪙 <span id="va-shop-coins"></span></div><button class="va-close" id="va-shop-close">✕</button></div>
        <div class="va-store-grid" id="va-store-grid"></div>
      </div></div>
      <div class="va-modal va-buy-confirm" id="va-buy-confirm" role="dialog" aria-modal="true" aria-labelledby="va-buy-title">
        <div class="va-buy-card">
          <div class="va-buy-gem" id="va-buy-icon" aria-hidden="true"></div>
          <div class="va-buy-kicker">ยืนยันการซื้อ</div>
          <h2 id="va-buy-title"></h2>
          <p id="va-buy-copy"></p>
          <dl class="va-buy-ledger"><div><dt>กำลังจะเสีย</dt><dd id="va-buy-price"></dd></div><div><dt>คงเหลือถ้าซื้อ</dt><dd id="va-buy-after"></dd></div></dl>
          <p class="va-buy-note" id="va-buy-note">ซื้อแล้วใช้ได้ถาวรทั้งบัญชี</p>
          <div class="va-buy-actions"><button type="button" id="va-buy-cancel">ยกเลิก</button><button type="button" id="va-buy-ok">ยืนยัน</button></div>
        </div>
      </div>
      <div class="va-modal" id="va-intro"><div class="va-panel va-intro-panel">
        <div class="va-intro-logo">VOCAB ARENA</div><div class="va-intro-sub">ตัวเล็ก · เวทมนตร์ใหญ่ · ขนอักษรกลับบ้าน</div>
        <div class="va-intro-steps"><div class="va-intro-step"><b>⚔️</b>เดินจอยซ้าย · สู้ปุ่มขวา</div><div class="va-intro-step"><b>💎</b>อักษร A–Z ร่วมกัน · ขนครั้งละ 1 ตัว</div><div class="va-intro-step"><b>🏠</b>บ้าน 5,000 HP · พังแล้วใครก็หยิบได้</div><div class="va-intro-step"><b>👑</b>คำเดียวทั้งห้อง · ชนะรับ 1,000 เหรียญ</div><div class="va-intro-step"><b>✨</b>ครบ 5 คริสตัล · ได้ MEGA 5 ครั้ง</div></div>
        <button class="va-start" id="va-start">เริ่มภารกิจ ✦</button>
      </div></div>
      <div class="va-modal" id="va-spellbook" role="dialog" aria-modal="true" aria-label="คลังพลังธาตุ"><div class="va-panel va-spell-panel">
        <div class="va-panel-head"><div><div class="va-panel-title">✨ คลังพลังธาตุ</div><div class="va-panel-sub">เริ่มด้วย ยิง + แสงฟื้นฟู · ซื้อ 3,000–5,000 เหรียญ ใช้ถาวร · เลือกได้ 2 ช่อง</div></div><button class="va-close" id="va-spells-close" aria-label="ปิดคลังธาตุ">✕</button></div>
        <div class="va-slot-tabs" id="va-slot-tabs"></div><div class="va-spell-grid" id="va-spell-grid"></div>
        <div class="va-spell-footer">WASD / จอย: เดิน · 1 / 2: พลังที่เลือก · 3: MEGA (คริสตัล 5 อัน) · Space: โจมตีค้าง</div>
      </div></div><div class="va-portrait"><div><b>📱↻</b>หมุนเครื่องเป็นแนวนอนเพื่อเข้าสนามครับ</div></div>`;
    document.body.appendChild(root);
    if(activeMap){
      ArenaMaps.decorate(root,activeMap.id);
      const switcher=document.createElement('button');switcher.id='va-map-change';switcher.className='va-map-change va-glass';switcher.textContent='◇ '+activeMap.name+' · เปลี่ยน';root.append(switcher);
      addListener(switcher,'click',async function changeArenaMap(){if(paused)return;paused=true;const id=await ArenaMaps.choose();if(!running)return;if(!id){paused=false;return;}const earned=sessionCoins;stop({mapSwitch:true});start({earned});});
      if(selectedHero){const avatar=root.querySelector('.va-avatar-icon');avatar.textContent='';const image=document.createElement('img');image.src=selectedHero.thumb;image.alt='';avatar.append(image);}
    }
    canvas=root.querySelector('#va-canvas');
    ['vitalsLayer','spellbook','spellGrid','slotTabs','homeHint','cargo','wordTh','wordEn','wordSlots','coins','energy','energyFill','energyPower','bagList','party','partyStatus','partyList','boss','bossChapter','bossName','bossHpText','bossFill','bossWord','hp','hpFill','feed','pop','downed','downTime','revive','reviveFill','reviveName','shop','shopCoins','storeGrid','intro','stick','stickKnob','buyConfirm'].forEach(k=>{
      const id='va-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()); ui[k]=root.querySelector('#'+id);
    });
    bindDom();
    renderShop();syncLoadoutButtons();
    if(p) feed(`🐾 ${p.name||((typeof PETS!=='undefined'&&PETS[p.type])?PETS[p.type].name:'น้อง')} จะวิ่งตามและช่วยโจมตี`, 'gold');
  }

  function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function bindDom(){
    addListener(root.querySelector('#va-exit'),'click',stop);
    addListener(root.querySelector('#va-home-nav'),'click',()=>{homeRoute=!homeRoute;paintHome();});
    addListener(root.querySelector('#va-drop-letter'),'click',()=>{if(!paused&&!downed)race?.drop();});
    const clearInput=()=>{basicHeld=false;keys.clear();joy.x=joy.z=0;joy.id=null;homeRoute=false;ui.stickKnob.style.transform='translate(-50%,-50%)';};
    addListener(window,'blur',clearInput);addListener(document,'visibilitychange',()=>{clearInput();lastFrame=0;});
    addListener(root.querySelector('#va-shop-open'),'click',()=>toggleShop(true));
    addListener(root.querySelector('#va-shop-close'),'click',()=>toggleShop(false));
    addListener(root.querySelector('#va-spells-open'),'click',()=>toggleSpellbook(true));
    addListener(root.querySelector('#va-spells-close'),'click',()=>toggleSpellbook(false));
    addListener(ui.spellbook,'click',e=>{if(e.target===ui.spellbook&&!ui.buyConfirm.classList.contains('on'))toggleSpellbook(false);});
    addListener(ui.slotTabs,'click',e=>{const b=e.target.closest('[data-equip-slot]');if(b){editingSlot=Number(b.dataset.equipSlot);renderSpellbook();}});
    addListener(ui.spellGrid,'click',e=>{const b=e.target.closest('[data-equip-spell]');if(b){const id=b.dataset.equipSpell;if(ArenaElements.owned(id))equipSpell(editingSlot,id);else askBuy('spell',id,editingSlot);}});
    addListener(root.querySelector('#va-party-friends'),'click',()=>{ if(room&&room.online)room.openFriends();else feed('📡 ต้องออนไลน์ก่อน จึงจะชวนหรือไปหาเพื่อนได้','bad'); });
    addListener(ui.shop,'click',e=>{ if(e.target===ui.shop&&!ui.buyConfirm.classList.contains('on')) toggleShop(false); });
    addListener(ui.storeGrid,'click',e=>{ const b=e.target.closest('[data-buy]'); if(b&&!b.disabled) askBuy('relic',b.dataset.buy); });
    addListener(ui.buyConfirm,'click',e=>{ if(e.target===ui.buyConfirm) closeBuy(); });
    addListener(root.querySelector('#va-buy-cancel'),'click',closeBuy);
    addListener(root.querySelector('#va-buy-ok'),'click',commitBuy);
    root.querySelectorAll('[data-skill]').forEach(b=>{
      addListener(b,'pointerdown',e=>{e.preventDefault();if(b.dataset.skill==='basic'){basicHeld=true;b.setPointerCapture&&b.setPointerCapture(e.pointerId);}castSkill(b.dataset.skill);});
      if(b.dataset.skill==='basic')for(const event of ['pointerup','pointercancel','lostpointercapture'])addListener(b,event,()=>{basicHeld=false;});
    });
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
    const reviveStart=e=>{e.preventDefault();const p=nearestDownedPeer();if(!p)return;reviveHold={uid:p.uid,at:performance.now(),pointer:e.pointerId};ui.revive.setPointerCapture&&ui.revive.setPointerCapture(e.pointerId);};
    const reviveEnd=e=>{if(reviveHold&&(!e||e.pointerId===reviveHold.pointer))reviveHold=null;};
    addListener(ui.revive,'pointerdown',reviveStart);addListener(ui.revive,'pointerup',reviveEnd);addListener(ui.revive,'pointercancel',reviveEnd);addListener(ui.revive,'pointerleave',reviveEnd);
    addListener(canvas,'pointerdown',e=>{ if(e.pointerType==='mouse'&&e.button===0) castSkill('basic'); });
    addListener(root.querySelector('#va-start'),'click',()=>{
      state.arenaIntro=true; state.arenaHomeIntro=true; saveState(); ui.intro.classList.remove('on'); paused=false; clock.getDelta(); feed('เก็บอักษร → ขนกลับบ้าน → เดินเข้าวงเพื่อฝาก · H พากลับบ้าน','gold');
    });
    const kd=e=>{
      if(!running) return;
      if(e.code!=='Escape'&&(e.target.closest?.('input,select,textarea,.va-swipe-strip')||e.defaultPrevented))return;
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
      keys.add(e.code);
      if(e.repeat) return;
      if(e.code==='Space') castSkill('basic');
      else if(e.code==='Digit1') castSkill(spellSlots[0]);
      else if(e.code==='Digit2') castSkill(spellSlots[1]);
      else if(e.code==='Digit3') castSkill('ult');
      else if(e.code==='KeyE')toggleSpellbook(!ui.spellbook.classList.contains('on'));
      else if(e.code==='KeyQ'){if(!e.repeat&&!paused&&!downed)race?.drop();}
      else if(e.code==='KeyH'){homeRoute=!homeRoute;paintHome();}
      else if(e.code==='KeyB') toggleShop(!ui.shop.classList.contains('on'));
      else if(e.code==='Escape'){ if(ui.buyConfirm.classList.contains('on'))closeBuy();else if(ui.spellbook.classList.contains('on'))toggleSpellbook(false);else if(ui.shop.classList.contains('on')) toggleShop(false); else stop(); }
    };
    const ku=e=>keys.delete(e.code);
    addListener(window,'keydown',kd,{passive:false}); addListener(window,'keyup',ku);
    addListener(window,'resize',resize);
  }

  function initThree(){
    renderer=new THREE.WebGLRenderer({canvas,alpha:!!activeMap,antialias:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.45));
    renderer.setSize(innerWidth,innerHeight,false);
    if('outputColorSpace' in renderer&&THREE.SRGBColorSpace) renderer.outputColorSpace=THREE.SRGBColorSpace;
    else if('outputEncoding' in renderer&&THREE.sRGBEncoding) renderer.outputEncoding=THREE.sRGBEncoding;
    if('toneMapping' in renderer&&THREE.ACESFilmicToneMapping){ renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.85; }
    scene=new THREE.Scene(); scene.background=new THREE.Color(0x14243d); scene.fog=new THREE.FogExp2(0x14243d,.006);
    camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,120);
    clock=new THREE.Clock(); texLoader=new THREE.TextureLoader();
    buildArena(); ArenaFieldVisuals.compactStatic(scene); fieldFx=ArenaFieldVisuals.createFx(scene,fxLow);
    elements=ArenaElements.create({fx:fieldFx,enemies:()=>[...bots,...raceTargets.filter(b=>!b.dead)],hit:hitBot,storm:()=>own('storm'),heal:(health,guard)=>{const before=hp;health*=1+relicMods.heal;hp=Math.min(maxHp,hp+health);if(hp>before&&window.ArenaAudio)ArenaAudio.playHeal();shield=Math.min(Math.max(maxShield,20),shield+guard);floatText(player.pos,`+${Math.round(hp-before)} HP · โล่ +${guard}`,0xd5ffac);updateHud();}});
    buildPlayer(); buildPet(); buildHome();if(!activeMap)ArenaFieldVisuals.garden(scene);
    built=true; resize();
  }

  function buildArena(){
    crystalNodes=[];
    if(activeMap){arenaMotes=null;crystalNodes=ArenaMaps.scenery(scene,activeMap.id);return;}
    scene.add(new THREE.HemisphereLight(0x8bdcff,0x130d2c,.75));
    const sun=new THREE.DirectionalLight(0xc9f5ff,1.1); sun.position.set(-12,24,11); scene.add(sun);
    const fill=new THREE.PointLight(0xb44cff,.7,55); fill.position.set(10,8,-10); scene.add(fill);
    const ground=new THREE.Mesh(new THREE.CylinderGeometry(ARENA_R+2,ARENA_R+3,1.25,64),new THREE.MeshStandardMaterial({color:0x223653,roughness:.78,metalness:.18}));
    ground.position.y=-.68; scene.add(ground);
    const inner=new THREE.Mesh(new THREE.CircleGeometry(ARENA_R,64),new THREE.MeshBasicMaterial({color:new THREE.Color(0x263758).convertSRGBToLinear(),toneMapped:false}));
    inner.rotation.x=-Math.PI/2; inner.position.y=-.04; scene.add(inner);
    for(const r of [7.5,16,25,31.2]){
      const ring=new THREE.Mesh(new THREE.RingGeometry(r-.035,r+.035,96),new THREE.MeshBasicMaterial({color:r===31.2?0x58e8ff:0x2a8fa1,transparent:true,opacity:r===31.2?.5:.09,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
      ring.rotation.x=-Math.PI/2; ring.position.y=.015; scene.add(ring);
    }
    const laneMat=new THREE.MeshBasicMaterial({color:new THREE.Color(0x3d5990).convertSRGBToLinear(),toneMapped:false,transparent:true,opacity:.22,depthWrite:false});
    for(const a of [0,Math.PI/3,-Math.PI/3]){
      const lane=new THREE.Mesh(new THREE.PlaneGeometry(7,61),laneMat.clone()); lane.rotation.x=-Math.PI/2; lane.rotation.z=a; lane.position.y=.012; scene.add(lane);
      for(let j=-3;j<=3;j++){
        const mark=new THREE.Mesh(new THREE.RingGeometry(1.6,1.78,28),new THREE.MeshBasicMaterial({color:0x4cdaf0,transparent:true,opacity:.055,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
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
      crystalNodes.push({pos:g.position.clone(),remaining:0,drop:null});scene.add(g);
    }
    const starGeo=new THREE.BufferGeometry(),n=180,arr=new Float32Array(n*3);
    for(let i=0;i<n;i++){ const a=Math.random()*TAU,r=Math.sqrt(Math.random())*ARENA_R; arr[i*3]=Math.sin(a)*r;arr[i*3+1]=rnd(.35,4.5);arr[i*3+2]=Math.cos(a)*r; }
    starGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
    arenaMotes=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x8eeaff,size:.085,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})); scene.add(arenaMotes);
  }

  function loadSprite(url,onReady){
    const sceneAtLoad=scene,mat=new THREE.SpriteMaterial({transparent:true,depthWrite:false,alphaTest:.03});
    const spr=new THREE.Sprite(mat);
    texLoader.load(url,t=>{if(scene!==sceneAtLoad){t.dispose();return;} if('colorSpace' in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;else if('encoding'in t&&THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;mat.map=t;mat.needsUpdate=true;if(onReady)onReady(spr,t); },undefined,()=>{});
    return spr;
  }

  function buildPlayer(){
    const group=new THREE.Group(); scene.add(group);
    const aura=new THREE.Mesh(new THREE.RingGeometry(.9,1.45,48),new THREE.MeshBasicMaterial({color:0x5de8ff,transparent:true,opacity:.63,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
    aura.rotation.x=-Math.PI/2; aura.position.y=.06; group.add(aura);
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.05,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3,depthWrite:false})); shadow.rotation.x=-Math.PI/2; shadow.position.y=.025; group.add(shadow);
    const spr=activeMap&&selectedHero?ArenaMaps.actor(selectedHero):ArenaFieldVisuals.hero(selectedHero?.tint,selectedHero);spr.scale.setScalar(1.12);group.add(spr);
    const crown=makeTextSprite('✦',0x8ef3ff,120,120);crown.scale.set(.65,.65,1);crown.position.y=2.32;group.add(crown);
    player={group,spr,aura,crown,pos:group.position,vel:new THREE.Vector3(),facing:new THREE.Vector3(0,0,-1)};
    aimRing=new THREE.Mesh(new THREE.RingGeometry(.85,1.15,40),new THREE.MeshBasicMaterial({color:0xffe873,transparent:true,opacity:.8,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
    aimRing.rotation.x=-Math.PI/2;aimRing.position.y=.08;aimRing.visible=false;scene.add(aimRing);
    maxShield=(own('wing')?30:0)+relicMods.shield;shield=maxShield;
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
    const spr=loadSprite(petImage(p)); const sz=p.type==='dragon'?1.3:1.05;spr.scale.set(sz,sz,1);spr.position.y=.65;group.add(spr);
    const glow=new THREE.Mesh(new THREE.RingGeometry(.48,.68,30),new THREE.MeshBasicMaterial({color:p.type==='dragon'?0xff8a48:0x78f4d1,transparent:true,opacity:.42,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));glow.rotation.x=-Math.PI/2;glow.position.y=.04;group.add(glow);
    petComp={group,spr,glow,vel:new THREE.Vector3(),type:p.type,data:p,phase:Math.random()*TAU};
  }

  function coopReady(){return typeof Online!=='undefined'&&Online.ready&&Online.db&&typeof NetRoom!=='undefined'&&typeof onlineKey==='function';}
  function safeAvatar(v){return /^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(v||'')?v:'blk1';}
  function parseArenaStatus(v){
    const p=String(v||'').split(':');
    const max=clamp(parseInt(p[4],10)||100,100,180);return p[0]==='A3'?{hp:clamp(parseInt(p[1],10)||0,0,max),max,down:p[2]==='1',enc:p[3]||'-'}:null;
  }
  function isArenaPeer(d){return !!(d&&parseArenaStatus(d.hp));}
  function partyUids(){return [myUid].concat(Object.keys(peers).filter(uid=>isArenaPeer(peers[uid]))).sort();}
  function leaderId(){return partyUids()[0]||myUid;}
  function isLeader(){return leaderId()===myUid;}
  function partyWords(){let n=sessionWords;for(const uid in peers)if(isArenaPeer(peers[uid]))n+=Math.max(0,Number(peers[uid].w)||0);return n;}
  function packArenaStatus(){return `A3:${Math.ceil(hp)}:${downed?1:0}:${bossEncounter||'-'}${maxHp>100?':'+maxHp:''}`.slice(0,28);}
  function buildPeerActor(uid,d){
    const group=new THREE.Group();group.position.set(Number(d.x)||0,0,Number(d.z)||0);scene.add(group);
    const aura=new THREE.Mesh(new THREE.RingGeometry(.72,1.12,36),new THREE.MeshBasicMaterial({color:0x7be8ff,transparent:true,opacity:.42,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));aura.rotation.x=-Math.PI/2;aura.position.y=.05;group.add(aura);
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.86,28),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.24,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.02;group.add(shadow);
    const peerHero=typeof ArenaHeroes!=='undefined'?ArenaHeroes.get(String(d.av||'').startsWith('AH:')?d.av.slice(3):'wind'):null;const spr=activeMap&&peerHero?ArenaMaps.actor(peerHero):ArenaFieldVisuals.hero(0xc08aff);spr.scale.setScalar(1.12);group.add(spr);
    const name=makeTextSprite(String(d.n||'เพื่อน').slice(0,18),0xdffbff,320,80);name.scale.set(2.7,.68,1);name.position.y=2.9;group.add(name);
    const hpBack=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.13),new THREE.MeshBasicMaterial({color:0x170e24,transparent:true,opacity:.84,side:THREE.DoubleSide}));hpBack.position.y=2.38;hpBack.visible=false;group.add(hpBack);
    const hpBar=new THREE.Mesh(new THREE.PlaneGeometry(2.12,.08),new THREE.MeshBasicMaterial({color:0x56efa7,side:THREE.DoubleSide}));hpBar.position.set(0,2.38,.01);hpBar.visible=false;group.add(hpBar);
    const peerHome=activeMap?ArenaMaps.house(0xad82dd,String(d.n||'เพื่อน').slice(0,12),loadSprite,makeTextSprite):ArenaFieldVisuals.house(0xad82dd,String(d.n||'เพื่อน').slice(0,12),makeTextSprite);scene.add(peerHome);
    return peerActors[uid]={uid,group,home:peerHome,spr,aura,name,hpBar,target:new THREE.Vector3(group.position.x,0,group.position.z),phase:Math.random()*TAU};
  }
  function removePeerActor(uid){const a=peerActors[uid];if(!a)return;if(scene){scene.remove(a.group);scene.remove(a.home);}disposeTree(a.group);disposeTree(a.home);delete peerActors[uid];}
  function onPeer(uid,d){
    peers[uid]=d||{};let a=peerActors[uid];if(!a&&scene)a=buildPeerActor(uid,d||{});
    if(a){a.target.set(Number(d.x)||0,0,Number(d.z)||0);a.data=d||{};}
    const evt=String(d&&d.c||'');
    if(downed&&evt.startsWith('R|')){const p=evt.split('|'),key=uid+'|'+p[2];if(p[1]===myUid&&!onPeer._seen.has(key)){onPeer._seen.add(key);recoverPlayer('เพื่อนช่วยชุบ');}}
    syncLeaderState();renderPartyHud();
  }
  onPeer._seen=new Set();
  function onPeerGone(uid){delete peers[uid];removePeerActor(uid);syncLeaderState();renderPartyHud();}
  function netToast(html){const d=document.createElement('div');d.innerHTML=html;feed(d.textContent||'อัปเดตสนาม Co-op','gold');}
  function setupCoop(){
    myUid=coopReady()?onlineKey():'local';renderPartyHud();
    if(!coopReady()){feed('📡 เข้าสู่ระบบออนไลน์เพื่อแข่งคำร่วมกันและรับเหรียญ','bad');return;}
    room=NetRoom.create({map:'adv',roomMax:PARTY_MAX,sendMs:170,push:()=>netSend(true),onPeer,onPeerGone,onStatus:renderPartyHud,toast:netToast,roomNoun:'ปาร์ตี้',roomIcon:'🤝',roomFmt:i=>'ปาร์ตี้ '+i,...(activeMap?ArenaMaps.roomOptions(activeMap.id):{})});
    room.join();
  }
  function netSend(force){
    if(!room||!player)return;
    const yaw=Math.atan2(player.facing.x,player.facing.z),payload={n:String(state.profileName||'นักผจญภัย').slice(0,40),x:+player.pos.x.toFixed(2),z:+player.pos.z.toFixed(2),y:Math.round(bossContribution),yaw:+yaw.toFixed(3),av:activeMap&&selectedHero?'AH:'+selectedHero.id:profileAvatar(),m:downed?1:0,w:sessionWords,c:reviveSignal||'-',ct:revivesGiven,cw:'',hp:packArenaStatus()};
    room.send(payload,!!force);
  }
  function tickCoop(t){
    if(room){room.tick(t);if(t-lastNetSend>170){lastNetSend=t;netSend(false);}}
    updatePeerActors(t);updateRevive(t);if(race)race.tick(room);
    if(t-lastPartyPaint>350){lastPartyPaint=t;renderPartyHud();}
  }
  function updatePeerActors(t){
    for(const uid in peerActors){const a=peerActors[uid],d=peers[uid]||{},st=parseArenaStatus(d.hp),isDown=!!(st&&st.down),speed=a.group.position.distanceTo(a.target)*6;a.group.position.lerp(a.target,.16);ArenaFieldVisuals.animate(a.spr,t,speed,Number(d.yaw)||0,isDown);a.aura.material.color.setHex(isDown?0xff5d75:0x7be8ff);a.hpBar.scale.x=st?clamp(st.hp/st.max,0,1):1;a.hpBar.position.x=-(1-a.hpBar.scale.x)*1.06;}

  }
  function renderPartyHud(){
    if(!ui.partyStatus)return;const members=[{uid:myUid,n:state.profileName||'เรา',hp,down:downed,self:true}];
    for(const uid of Object.keys(peers))if(isArenaPeer(peers[uid])){const st=parseArenaStatus(peers[uid].hp);members.push({uid,n:peers[uid].n||'เพื่อน',hp:st.hp,down:st.down});}
    let status;if(!coopReady())status='สนามฝึกเดี่ยว · ออฟไลน์';else if(!room||!room.joined)status='กำลังหาปาร์ตี้ Co-op…';else status=`Co-op ${members.length}/${PARTY_MAX} · ปาร์ตี้ ${room.roomLabel}${members.length<2?' · รอเพื่อนได้':''}`;
    ui.partyStatus.textContent=status;ui.partyList.innerHTML=members.slice(0,PARTY_MAX).map(m=>`<span class="${m.down?'down':''}${m.self?' self':''}" title="${esc(m.n)}">${m.down?'🆘':'●'} ${esc(m.self?'เรา':m.n)}</span>`).join('');
    if(activeMap&&room)ui.partyStatus.textContent=room.full?'แผนที่เต็ม · กดเปลี่ยนแผนที่':room.joined?`Co-op ${members.length}/4 · ห้อง ${Math.floor((room.room-ArenaMaps.FIRST)/3)+1} · ${activeMap.name}`:'กำลังเชื่อมต่อห้อง…';
    ui.partyStatus.textContent=room?.full?'แผนที่เต็ม · กดเปลี่ยนแผนที่':raceStatus;
    const btn=root&&root.querySelector('#va-party-friends');if(btn)btn.classList.toggle('off',!room||!room.online);
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
    const body=activeMap?ArenaMaps.slime(col,elite):new THREE.Mesh(new THREE.IcosahedronGeometry(elite?1.45:1.08,1),coreMat);if(!activeMap)body.scale.y=1.18;else coreMat.dispose();body.position.y=1.25;group.add(body);
    if(!activeMap){
    const eyeMat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.92,blending:THREE.AdditiveBlending});
    const eye=new THREE.Mesh(new THREE.TorusGeometry(elite?.76:.57,.10,8,28),eyeMat);eye.position.set(0,1.38,.88);group.add(eye);
    for(let i=0;i<(elite?8:5);i++){ const spike=new THREE.Mesh(new THREE.ConeGeometry(.18,elite?1.3:.9,5),coreMat);const a=i/(elite?8:5)*TAU;spike.position.set(Math.sin(a)*(elite?1.25:.92),1.2,Math.cos(a)*(elite?1.25:.92));spike.rotation.z=Math.sin(a)*1.1;spike.rotation.x=Math.cos(a)*1.1;group.add(spike); }
    }
    const letter=makeTextSprite(ch,col);letter.scale.set(elite?2.2:1.65,elite?1.1:.84,1);letter.position.y=3.25;group.add(letter);
    const barBack=new THREE.Mesh(new THREE.PlaneGeometry(elite?2.7:2.1,.18),new THREE.MeshBasicMaterial({color:0x180e20,transparent:true,opacity:.9,side:THREE.DoubleSide}));barBack.position.y=2.62;barBack.visible=false;group.add(barBack);
    const bar=new THREE.Mesh(new THREE.PlaneGeometry(elite?2.62:2.02,.11),new THREE.MeshBasicMaterial({color:elite?0xffc24d:0x61f5b3,side:THREE.DoubleSide}));bar.position.set(0,2.62,.012);bar.visible=false;group.add(bar);
    const a=Math.random()*TAU,r=rnd(17,28);group.position.set(Math.sin(a)*r,0,Math.cos(a)*r);group.scale.setScalar(activeMap?1.3:.68);scene.add(group);
    const mhp=elite?180:80+rnd(-8,16),bot={group,body,letter,bar,col,ch,elite,hp:mhp,maxHp:mhp,vel:new THREE.Vector3(),attackAt:rnd(.3,1.2),phase:Math.random()*TAU,dead:false,slow:0};
    bots.push(bot);return bot;
  }

  function chapterDef(id){return CHAPTERS[(clamp(parseInt(id,10)||1,1,CHAPTERS.length)-1)];}
  function bossWire(){
    if(bossPhase==='boss')return `B:${chapter}:${bossEncounter}:${Math.round(bossMax)}:${Math.round(bossHp)}:${bossWord}`.slice(0,60);
    if(bossPhase==='victory')return `V:${chapter}:${bossEncounter}:${Math.round(bossReward)}:${bossWord}`.slice(0,60);
    return `W:${chapter}:${Math.round(waveBase)}`;
  }
  function syncLeaderState(){return;
    if(!running||isLeader())return;const d=peers[leaderId()];if(d&&typeof d.cw==='string'&&d.cw)applyLeaderWire(d.cw);
  }
  function applyLeaderWire(wire){return;
    const p=String(wire||'').split(':'),kind=p[0],ch=clamp(parseInt(p[1],10)||1,1,CHAPTERS.length);
    if(kind==='B'){
      const enc=p[2]||'',max=Math.max(100,parseInt(p[3],10)||100),left=clamp(parseInt(p[4],10)||0,0,max),word=String(p[5]||'WORD').replace(/[^A-Z]/gi,'').slice(0,8).toUpperCase()||'WORD';
      if(enc&&enc!==bossEncounter)startBoss(ch,word,max,enc,false);setBossHp(left);
    }else if(kind==='V'){
      const enc=p[2]||'',reward=Math.max(1,parseInt(p[3],10)||1),word=String(p[4]||bossWord||'WORD').replace(/[^A-Z]/gi,'').slice(0,8).toUpperCase();
      if(enc&&bossPhase!=='victory')beginBossVictory(ch,enc,reward,word,false);
    }else if(kind==='W'){
      const base=Math.max(0,parseInt(p[2],10)||0);
      if(bossPhase!=='wave')finishBossVictory(false,ch);chapter=ch;waveBase=base;
    }
  }
  function pickBossWord(ch){
    const cfg=chapterDef(ch),all=(typeof vocabForStudent==='function'?vocabForStudent():[]).filter(x=>x&&/^[a-z]+$/i.test(x[0])&&String(x[0]).length>=cfg.min&&String(x[0]).length<=cfg.max);
    const pool=all.length?all:[['cat','แมว'],['book','หนังสือ'],['planet','ดาวเคราะห์'],['teacher','ครู']].filter(x=>x[0].length>=cfg.min&&x[0].length<=cfg.max);
    const pick=pool[Math.floor(Math.random()*pool.length)]||['word','คำศัพท์'];return {en:String(pick[0]).toUpperCase(),th:String(pick[1]||'คำศัพท์')};
  }
  function buildChapterBoss(word,ch,max){
    const cfg=chapterDef(ch),b=buildBot(word.charAt(0),true);b.boss=true;b.chapter=ch;b.hp=max;b.maxHp=max;b.group.position.set(0,0,-10);b.group.scale.setScalar(1.18+.05*ch);b.attackAt=performance.now()+1400;
    b.group.remove(b.letter);disposeTree(b.letter);b.letter=makeTextSprite(word,cfg.color,420,130);b.letter.scale.set(3.2,1.08,1);b.letter.position.y=3.5;b.group.add(b.letter);
    b.body.material.color.setHex(0x111c3d);b.body.material.emissive.setHex(cfg.color);b.body.material.emissiveIntensity=.78;b.bar.material.color.setHex(cfg.color);return b;
  }
  function startBoss(ch,word,max,enc,leader){
    chapter=ch;bossPhase='boss';bossEncounter=enc;bossMax=max;bossHp=max;bossWord=word;bossContribution=0;bossWordSolved=false;bossVictoryAt=0;bossReward=0;wordBusy=false;
    if(boss){const i=bots.indexOf(boss);if(i>=0)bots.splice(i,1);scene.remove(boss.group);disposeTree(boss.group);}
    boss=buildChapterBoss(word,ch,max);target={en:word,th:`คำผนึกบอส · ${chapterDef(ch).name}`,boss:true};updateWord();updateBossHud();
    showPop(`${chapterDef(ch).ico} BOSS บท ${ch}`,`${chapterDef(ch).boss} · สะกด ${word} เพื่อทำลายเกราะ`);feed(`👑 บอสประจำบทมาแล้ว! ทุกคนโจมตีร่วมกัน และเก็บอักษรสะกด ${word}`,'gold');ringFx(boss.group.position,chapterDef(ch).color,10,.9);haptic([40,55,75]);
    if(leader)netSend(true);
  }
  function startBossAsLeader(){
    const chosen=pickBossWord(chapter),size=partyUids().length,max=Math.round((420+chapter*120)*(1+.55*(size-1))),enc=(Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36)).slice(-8);
    startBoss(chapter,chosen.en,max,enc,true);
  }
  function setBossHp(v){bossHp=clamp(Number(v)||0,0,bossMax||1);if(boss){boss.hp=bossHp;const k=clamp(bossHp/boss.maxHp,0,1);boss.bar.scale.x=k;boss.bar.position.x=-(1-k)*1.31;}updateBossHud();}
  function bossImpact(){let total=bossContribution;for(const uid in peers){const d=peers[uid],st=parseArenaStatus(d&&d.hp);if(st&&st.enc===bossEncounter)total+=Math.max(0,Number(d.y)||0);}return total;}
  function driveBoss(t){return;
    if(!isLeader()){syncLeaderState();return;}
    if(bossPhase==='wave'){
      if(partyWords()-waveBase>=BOSS_WORD_GOAL)startBossAsLeader();
    }else if(bossPhase==='boss'){
      setBossHp(Math.max(0,bossMax-bossImpact()));if(bossHp<=0)beginBossVictory(chapter,bossEncounter,160+chapter*45,bossWord,true);
    }else if(bossPhase==='victory'&&t-bossVictoryAt>3600)finishBossVictory(true);
  }
  function beginBossVictory(ch,enc,reward,word,leader){
    chapter=ch;bossEncounter=enc;bossReward=reward;bossWord=word;bossPhase='victory';bossVictoryAt=performance.now();setBossHp(0);
    if(boss){boss.dead=true;boss.group.scale.multiplyScalar(1.08);burst(boss.group.position,chapterDef(ch).color,52,8);ringFx(boss.group.position,0xffe77a,14,1.1);}
    showPop('พิชิตบอส!',`${chapterDef(ch).name} · รางวัลแบ่งแบบทีม`);feed('⚖️ ทุกคนได้รางวัลฐานเท่ากัน 80% และโบนัสช่วยทีมสูงสุด 20%','gold');awardBoss(enc,ch,reward);haptic([45,55,90]);if(leader)netSend(true);
  }
  function awardBoss(enc,ch,totalReward){return;
    if(!enc||state.arenaBossClaims.includes(enc))return;
    const count=Math.max(1,partyUids().length),total=Math.max(1,bossImpact()),fair=total/count,ratio=clamp(bossContribution/fair,0,1),base=Math.round(totalReward*.8),bonus=Math.round(totalReward*.2*ratio),reward=base+bonus;
    state.arenaBossClaims.push(enc);state.arenaBossClaims=state.arenaBossClaims.slice(-20);state.arenaStats.bossWins++;state.arenaStats.fairCoins+=reward;state.arenaStats.bestChapter=Math.max(state.arenaStats.bestChapter||0,ch);state.arenaChapter=ch%CHAPTERS.length+1;
    addCoins(reward);sessionCoins+=reward;saveState();showPop(`+${fmt(reward)} 🪙`,`ฐานทีม ${fmt(base)} + โบนัสช่วยทีม ${fmt(bonus)}`);feed(`🏆 รางวัลบอส ${fmt(reward)} เหรียญ — ไม่มีการแย่ง Last Hit`,'gold');updateHud();
  }
  function finishBossVictory(leader,nextChapter){
    if(boss){const i=bots.indexOf(boss);if(i>=0)bots.splice(i,1);scene.remove(boss.group);disposeTree(boss.group);boss=null;}
    chapter=nextChapter||chapter%CHAPTERS.length+1;bossPhase='wave';bossEncounter='';bossMax=bossHp=bossContribution=0;bossWord='';bossWordSolved=false;bossReward=0;waveBase=partyWords();wordBusy=false;nextWord();updateBossHud();feed(`📖 เริ่มบท ${chapter}: ${chapterDef(chapter).name} · ครบอีก ${BOSS_WORD_GOAL} คำจะพบบอส`,'gold');if(leader)netSend(true);
  }
  function updateBossHud(){
    if(!ui.boss)return;const on=bossPhase==='boss'||bossPhase==='victory',cfg=chapterDef(chapter);ui.boss.classList.toggle('on',on);ui.boss.classList.toggle('won',bossPhase==='victory');ui.bossChapter.textContent=`${cfg.ico} บท ${chapter}`;ui.bossName.textContent=cfg.boss;ui.bossHpText.textContent=bossMax?`${Math.ceil(bossHp/bossMax*100)}%`:'100%';ui.bossFill.style.width=(bossMax?bossHp/bossMax*100:100)+'%';ui.bossWord.textContent=bossWord?`คำผนึก: ${bossWord}`:'';
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
    for(const b of [...bots,...raceTargets]){ if(b.dead||b===exclude)continue;const d=flatDist(player.pos,b.group.position);if(d<bd){bd=d;best=b;} }
    return best;
  }

  function castSkill(kind){
    if(!running||paused||document.hidden||downed||performance.now()<cooldown[kind]) return;
    const now=performance.now(),mult=powerMult()*(1+(relicMods.elements[ArenaElements.byId[kind]?.family||kind]||0));
    const aim=targetNearest(18);if(aim)player.facing.copy(aim.group.position).sub(player.pos).setY(0).normalize();
    if(!SKILL_CD[kind])return;if(kind!=='basic'&&kind!=='ult'&&!ArenaElements.owned(kind))return;
    if(ArenaElements.byId[kind]?.pack&&!ArenaElements.isReady(kind)){const at=root;ArenaElements.prepare(kind).then(()=>{if(root===at&&running)feed('พร้อมใช้ '+ArenaElements.byId[kind].name,'gold');}).catch(()=>{if(root===at&&running)feed('โหลดธาตุไม่สำเร็จ · กดลองใหม่','bad');});return;}
    if(kind==='ult'&&megaUses===0){ feed(`เก็บคริสตัลอีก ${CRYSTAL_NEED-crystalCharge} อัน เพื่อปล่อย MEGA`,'bad');pulseButton('ult');return; }
    if(ArenaElements.byId[kind]&&kind!=='arc'&&kind!=='nova'){
      if(elements.cast(kind,player.pos,player.facing,aim,mult)){
        const def=ArenaElements.byId[kind];cooldown[kind]=now+skillSeconds(kind)*1000;ArenaFieldVisuals.strike(player.spr,now);feed(`${def.icon} ${def.name} · ${def.detail}`,'gold');if(window.ArenaAudio)ArenaAudio.playElement(def.family||kind);haptic(25);updateHud();
      }
      return;
    }
    if(kind==='basic'){
      const b=targetNearest(15);if(!b){feed('เข้าใกล้ปีศาจหรือบ้านคู่แข่งอีกนิดครับ');return;}
      ArenaFieldVisuals.strike(player.spr,now);fieldFx.slash(player.pos,Math.atan2(player.facing.x,player.facing.z));cooldown.basic=now+SKILL_CD.basic*1000;fireBolt(b,24*mult,0x7ff3ff,false);
      if(own('echo')){const b2=targetNearest(15,b);if(b2)schedule(()=>{if(running&&!b2.dead)fireBolt(b2,16*mult*(1+relicMods.echoDamage),0xcb7cff,false);},85);}
    }else if(kind==='arc'){
      const first=targetNearest(17);if(!first){feed('ไม่มีปีศาจในระยะ ARC');return;}
      ArenaFieldVisuals.strike(player.spr,now);fieldFx.spell(player.pos,'arc');cooldown.arc=now+skillSeconds('arc')*1000;let cur=first,seen=new Set();
      for(let i=0;i<3&&cur;i++){seen.add(cur);const from=i?Array.from(seen)[i-1].group.position:player.pos;beam(from,cur.group.position,i?0xa777ff:0x66eeff,.23);hitBot(cur,(42-i*8)*mult);cur=bots.filter(b=>!b.dead&&!seen.has(b)&&flatDist(b.group.position,cur.group.position)<7).sort((a,b)=>flatDist(a.group.position,cur.group.position)-flatDist(b.group.position,cur.group.position))[0];}
      burst(first.group.position,0x77e9ff,22,5);if(window.ArenaAudio)ArenaAudio.playElement('arc');haptic(22);
    }else if(kind==='nova'){
      ArenaFieldVisuals.strike(player.spr,now);fieldFx.spell(player.pos,'nova');cooldown.nova=now+skillSeconds('nova')*1000;const rad=own('storm')?8.2:6.1;ringFx(player.pos,0xb55cff,rad,.62);
      let n=0;for(const b of [...bots,...raceTargets]){if(!b.dead&&flatDist(player.pos,b.group.position)<=rad){hitBot(b,48*mult);burst(b.group.position,0xd27cff,10,3);n++;}}
      feed(n?`🌀 NOVA โดน ${n} เป้าหมาย`:'🌀 NOVA ยังไม่ถึงตัวปีศาจ');if(window.ArenaAudio)ArenaAudio.playElement();haptic(35);
    }else if(kind==='ult'){
      const kind=selectedHero?.id||'fire';
      if(!elements.castMega(kind,player.pos,player.facing,powerMult()*(1+(relicMods.elements[kind]||0))))return;
      megaUses--;if(megaUses===0)crystalCharge=0;cooldown.ult=now+skillSeconds('ult')*1000;ArenaFieldVisuals.strike(player.spr,now);
      showPop('MEGA '+kind.toUpperCase(),megaUses?`เหลือพลังวงใหญ่อีก ${megaUses} ครั้ง`:'ใช้ครบแล้ว · เก็บคริสตัลใหม่ 5 อัน');if(window.ArenaAudio)ArenaAudio.playMega();haptic([30,45,60]);
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
    const shotColor=bot.boss?chapterDef(bot.chapter).color:(bot.elite?0xffb141:0xff4e89),shotSize=bot.boss ? 0.31 : (bot.elite ? 0.25 : 0.18),mesh=new THREE.Mesh(new THREE.SphereGeometry(shotSize,9,7),new THREE.MeshBasicMaterial({color:shotColor,transparent:true,opacity:.92,blending:THREE.AdditiveBlending}));
    mesh.position.copy(bot.group.position);mesh.position.y=1.3;scene.add(mesh);
    // สนามนี้เน้นฝึกคำศัพท์ เด็กต้องมีเวลาวิ่งเก็บอักษร — กระสุนบอทจึงเป็นแรงกดดันเบา ไม่รุมตายเร็ว
    const to=player.pos.clone().sub(bot.group.position).setY(0).normalize();shots.push({mesh,vel:to.multiplyScalar(bot.boss?9.2:(bot.elite?8.5:7)),damage:bot.boss?10+bot.chapter*2:(bot.elite?9:4),color:shotColor,fromEnemy:true,ttl:2.7,lastSpark:0});
  }
  function hitBot(b,dmg){
    if(b?.vaultOwner){if(!downed&&race?.ready&&!race.busy)race.hit(b.vaultOwner,b.revision);return;}
    if(!b||b.dead)return;
    if(relicMods.crit&&Math.random()<relicMods.crit)dmg*=1.5+relicMods.critDamage;
    if(b.boss){
      bossContribution=Math.min(bossMax*1.5,bossContribution+Math.max(0,dmg));
      b.body.material.emissiveIntensity=2.4;schedule(()=>{if(b&&!b.dead)b.body.material.emissiveIntensity=.78;},70);
      floatText(b.group.position,`-${Math.round(dmg)}`,dmg>70?0xffef75:0x9df5ff);burst(b.group.position,b.col,7,2.2);netSend(false);return;
    }
    b.hp-=dmg;b.bar.scale.x=clamp(b.hp/b.maxHp,0,1);b.bar.position.x=-(1-b.bar.scale.x)*(b.elite?1.31:1.01);
    b.body.material.emissiveIntensity=2.2;schedule(()=>{if(b&&!b.dead)b.body.material.emissiveIntensity=.42;},70);
    floatText(b.group.position,`-${Math.round(dmg)}`,dmg>70?0xffef75:0x9df5ff);burst(b.group.position,b.col,6,1.8);
    if(b.hp<=0)killBot(b);
  }
  function killBot(b){
    if(b.dead)return;b.dead=true;kills++;state.arenaStats.kills=(state.arenaStats.kills||0)+1;
    const idx=bots.indexOf(b);if(idx>=0)bots.splice(idx,1);scene.remove(b.group);disposeTree(b.group);
    respawns.push(performance.now()+rnd(900,1700));respawns.sort((a,c)=>a-c);
    feed(`👾 กำจัดปีศาจ ${b.ch} — ไปเก็บอักษร A–Z ในสนามต่อได้`);
  }

  function dropLetter(pos,ch,col,options={}){
    const group=new THREE.Group();group.position.copy(pos);group.position.y=.35;
    const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.58,0),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:activeMap?.18:1.65,metalness:.3,roughness:.18,transparent:true,opacity:.9}));gem.scale.y=1.3;group.add(gem);
    if(activeMap)ArenaMaps.crystal(gem);const spr=makeTextSprite(ch,activeMap?0x154f89:0xffffff,256,256);spr.scale.set(.9,.9,1);spr.position.y=.08;spr.material.depthTest=false;spr.renderOrder=8;group.add(spr);
    const halo=new THREE.Mesh(new THREE.RingGeometry(.55,.82,30),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.68,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));halo.rotation.x=-Math.PI/2;halo.position.y=.08;if(activeMap)halo.material.blending=THREE.NormalBlending;group.add(halo);
    if(options.node){group.scale.setScalar(1.85);group.position.y=2.3;}
    const d={group,gem,halo,spr,ch,col,phase:Math.random()*TAU,life:options.node?Infinity:45+relicMods.dropLife,node:options.node||null,chargeable:options.chargeable!==false};
    scene.add(group);drops.push(d);return d;
  }
  /* ==== 💎 Round 1384: letter crystals charge a five-pickup elemental MEGA ==== */
  function spawnCrystal(node){const ch=ALPHABET[crystalLetterIndex++%26];node.drop=dropLetter(node.pos,ch,0x77eaff,{node});node.remaining=0;}
  function updateCrystalNodes(dt){for(const node of crystalNodes)if(!node.drop){node.remaining-=dt;if(node.remaining<=0)spawnCrystal(node);}}
  function collectDrop(d){
    if(downed||!race?.ready||race.busy||!drops.includes(d)||!d.raceId)return;
    if(cargo.length){
      const now=performance.now();
      if(now-fullHintAt>1800){fullHintAt=now;showPop('เก็บได้ทีละ 1 ตัว','กำลังถือ '+cargo[0]+' อยู่ · ฝากบ้านหรือกด DROP ก่อน');feed('อุ๊ย เก็บได้ทีละ 1 ตัวอักษรเท่านั้น · ฝาก '+cargo[0]+' ที่บ้านหรือกด DROP','bad');}
      return;
    }
    netSend(true);race.pickup(d.raceId,d.raceRevision);
  }
  /* ==== Shared server race: letters, vaults and one winner per word ==== */
  function raceReset(){bag={};cargo=[];target={en:'…',th:'กำลังเชื่อมต่อคำร่วมกัน'};raceTargets=[];raceStatus='กำลังเชื่อมต่อการแข่งขัน…';for(const d of drops){scene.remove(d.group);disposeTree(d.group);}drops=[];updateHud();}
  function raceSnapshot(r,previous,earned){
    if(!running)return;raceStatus='แข่งคำเดียวกัน · ผู้ชนะรับ 1,000 🪙';sessionCoins=raceSessionOffset+earned;
    bag={};for(const ch of r.self.bank||'')bag[ch]=(bag[ch]||0)+1;cargo=r.self.carried?[r.self.carried]:[];
    target={en:r.word.target,th:r.word.translation};wordBusy=!!r.word.completedAt;
    if(previous&&r.self.revision>previous.self.revision&&r.self.carried&&r.self.fresh){energy=Math.min(ENERGY_MAX,energy+1);if(!megaUses){crystalCharge=Math.min(5,crystalCharge+1);if(crystalCharge===5){megaUses=5;showPop('MEGA ×5 READY','เก็บครบ 5 อักษรแล้ว');if(window.ArenaAudio)ArenaAudio.prepareMega();}}}
    if(previous&&r.word.completedAt&&(!previous.word.completedAt||previous.word.round!==r.word.round)){
      showPop(r.word.winnerId===myUid?'ชนะ! +1,000 🪙':r.word.winnerName+' ชนะ',r.word.target+' · กำลังเปลี่ยนคำ');
      if(r.word.winnerId===myUid){sessionWords++;state.arenaStats.words++;saveState();}
    }
    const remaining=new Map(Object.entries(r.items||{}));
    for(let i=drops.length-1;i>=0;i--){const d=drops[i],item=remaining.get(d.raceId);if(!item||item.rev!==d.raceRevision){scene.remove(d.group);disposeTree(d.group);drops.splice(i,1);}else remaining.delete(d.raceId);}
    for(const [id,item]of remaining){const d=dropLetter(new THREE.Vector3(item.x,0,item.z),item.ch,0x77eaff,{chargeable:!item.dropped});d.life=Infinity;d.raceId=id;d.raceRevision=item.rev;}
    placeHome();updateHud();renderPartyHud();
  }

  function buildHome(){home=activeMap?ArenaMaps.house(0x58baff,'บ้านของคุณ',loadSprite,makeTextSprite):ArenaFieldVisuals.house(0x58baff,'บ้านของคุณ',makeTextSprite);scene.add(home);placeHome();}
  function placeHome(){
    if(!home)return;const snap=race?.snapshot;
    const mySlot=snap?.self.slot??Math.max(0,partyUids().indexOf(myUid))%4;home.position.set(HOME_SPOTS[mySlot][0],0,HOME_SPOTS[mySlot][1]);home.scale.y=snap?.self.hp===0?.22:1;
    raceTargets.length=0;
    for(const uid in peerActors)peerActors[uid].home.visible=false;
    for(const [uid,base]of Object.entries(snap?.bases||{}))if(uid!==myUid){
      let b=vaultHomes.get(uid);if(!b){const group=activeMap?ArenaMaps.house(0xffbf6b,base.name,loadSprite,makeTextSprite):ArenaFieldVisuals.house(0xffbf6b,base.name,makeTextSprite);scene.add(group);b={vaultOwner:uid,group,hp:5000,maxHp:5000,revision:0,dead:false,col:0xffbf6b,boss:true,vel:new THREE.Vector3()};vaultHomes.set(uid,b);}
      b.hp=base.hp;b.dead=base.hp<=0;b.revision=base.revision;b.group.position.set(HOME_SPOTS[base.slot][0],0,HOME_SPOTS[base.slot][1]);b.group.scale.y=b.dead?.22:1;raceTargets.push(b);
    }
    for(const [uid,b]of vaultHomes)if(!snap?.bases?.[uid]){scene.remove(b.group);disposeTree(b.group);vaultHomes.delete(uid);}
  }

  function persistHome(){if(race)return;state.arenaHome.letters=bag;state.arenaHome.cargo=cargo.slice();saveState();}
  function bankCargo(){
    if(!home||downed||!race?.ready||race.busy||flatDist(player.pos,home.position)>3.3||(!cargo.length&&(wordBusy||!canBuild()))||(cargo.length&&race.snapshot.self.bank.length>=999))return false;
    netSend(true);race.bank();return true;
  }

  function paintHome(){if(!home||!ui.homeHint)return;const dist=Math.round(flatDist(player.pos,home.position)),total=Object.values(bag).reduce((n,v)=>n+v,0);ui.homeHint.textContent=`${homeRoute?'กำลังกลับ · ':''}${dist<=3?'ถึงบ้านแล้ว':dist+' ม.'} · ขน ${cargo.length}/${CARGO_MAX} · คลัง ${total}`;const dropButton=root.querySelector('#va-drop-letter');dropButton.disabled=!cargo.length||downed||!race?.ready||race.busy;root.querySelector('#va-home-nav').classList.toggle('routing',homeRoute);ui.cargo.textContent=cargo.join(' ');}
  const cargoScreen=new THREE.Vector3();
  function updateHome(dt,t){
    placeHome();
    if(!downed&&race?.ready&&!race.busy&&!cargo.length)for(const b of raceTargets)if(b.hp===0&&flatDist(player.pos,b.group.position)<3.3){netSend(true);race.raid(b.vaultOwner,b.revision);break;}
    if(!downed&&flatDist(player.pos,home.position)<3.3){bankCargo();checkWord();if((race?.snapshot?.self.hp??5000)>0&&hp<maxHp){const before=hp;hp=Math.min(maxHp,hp+dt*7);if(hp>before&&window.ArenaAudio)ArenaAudio.playHeal();if(t-lastHomePaint>200)updateHud();}}
    if(t-lastHomePaint>200){lastHomePaint=t;paintHome();}
    cargoScreen.copy(player.pos);cargoScreen.y=activeMap?8.8:2.9;cargoScreen.project(camera);ui.cargo.style.transform=`translate(${(cargoScreen.x*.5+.5)*innerWidth}px,${(-cargoScreen.y*.5+.5)*innerHeight}px) translate(-50%,-50%)`;
  }

  function nextWord(){target={en:'…',th:'กำลังเชื่อมต่อคำร่วมกัน'};updateWord();}

  function canBuild(){
    if(!target)return false;const tmp={...bag};for(const ch of target.en){if(!tmp[ch])return false;tmp[ch]--;}return true;
  }
  function checkWord(){return bankCargo();}

  function closeBuy(){pendingBuy=null;if(ui.buyConfirm)ui.buyConfirm.classList.remove('on');}
  function askBuy(kind,id,slot){
    const spell=kind==='spell'?ArenaElements.byId[id]:null,relic=kind==='relic'?(typeof ArenaRelics!=='undefined'&&ArenaRelics.byId[id]||STORE.find(x=>x.id===id)):null;
    const item=spell||relic;if(!item)return;
    if(spell&&ArenaElements.owned(id)){equipSpell(slot,id);return;}
    if(relic&&(own(id)||relic.raceDisabled)){if(relic.raceDisabled)feed('ไอเท็มนี้พักใช้ตามกติกาแข่งขัน','gold');return;}
    const price=Number(item.price)||0,have=state.coins||0,ok=have>=price;
    pendingBuy={kind,id,slot,price};
    root.querySelector('#va-buy-icon').innerHTML=spell?(typeof ArenaGrimoire!=='undefined'?ArenaGrimoire.icon(item):esc(item.icon||'✨')):(typeof ArenaRelics!=='undefined'?ArenaRelics.icon(item):esc(item.ico||'✦'));
    root.querySelector('#va-buy-title').textContent=item.name;
    root.querySelector('#va-buy-copy').textContent='ตอนนี้กำลังจะเสีย '+fmt(price)+' เหรียญ เพื่อซื้อ '+item.name+' แล้ว ยืนยันที่จะซื้อหรือไม่?';
    root.querySelector('#va-buy-price').textContent='◈ '+fmt(price);
    root.querySelector('#va-buy-after').textContent='◈ '+fmt(Math.max(0,have-price));
    root.querySelector('#va-buy-note').textContent=ok?'ซื้อแล้วใช้ได้ถาวรทั้งบัญชี · คลังที่เปิดอยู่ยังค้างไว้':'เหรียญยังไม่พอ · ยังไม่หักจนกว่าจะยืนยันได้';
    const go=root.querySelector('#va-buy-ok');go.disabled=!ok;go.setAttribute('aria-disabled',ok?'false':'true');
    ui.buyConfirm.classList.add('on');
  }
  function commitBuy(){
    const job=pendingBuy;if(!job)return;closeBuy();
    if(job.kind==='relic')buyItem(job.id);else buySpell(job.slot,job.id);
  }

  function buyItem(id){
    if(typeof ArenaRelics!=='undefined'&&ArenaRelics.byId[id]?.raceDisabled){feed('ไอเท็มนี้พักใช้ตามกติกาแข่งขัน','gold');return;}
    ensureState();const it=STORE.find(x=>x.id===id);if(!it||own(id))return;
    if((state.coins||0)<it.price){feed(`เหรียญยังไม่พอซื้อ ${it.name} — ขาด ${fmt(it.price-(state.coins||0))} 🪙`,'bad');return;}
    state.coins-=it.price;state.arenaItems[id]=true;saveState();
    const beforeHp=maxHp,beforeShield=maxShield;refreshRelics();hp=Math.min(maxHp,hp+maxHp-beforeHp);shield=Math.min(maxShield,shield+maxShield-beforeShield);
    renderShop();updateHud();feed(`✨ ซื้อ ${it.name} แล้ว ใช้พลังทันที`,'gold');showPop(it.ico,it.name);
  }
  function renderShop(){
    if(!ui.storeGrid)return;ui.shopCoins.textContent=fmt(state.coins||0);if(typeof ArenaRelics!=='undefined'){ArenaRelics.render(root,{own,fmt});return;}
    ui.storeGrid.innerHTML=STORE.map(it=>`<button class="va-store-item${own(it.id)?' owned':''}" data-buy="${it.id}"><span class="va-store-ico">${it.ico}</span><div class="va-store-name">${it.name}</div><div class="va-store-desc">${it.desc}</div><div class="va-store-price">${own(it.id)?'✓ มีแล้ว':`🪙 ${fmt(it.price)}`}</div></button>`).join('');
  }
  function toggleShop(on){
    if(!running)return;if(!on)closeBuy();basicHeld=false;keys.clear();ui.shop.classList.toggle('on',!!on);syncPause();if(on)renderShop();
  }

  /* ==== 🔥 Round 1381 — two persistent elemental slots ==== */
  function syncPause(){paused=ui.shop.classList.contains('on')||ui.intro.classList.contains('on')||ui.spellbook.classList.contains('on');lastFrame=0;if(clock)clock.getDelta();}
  function syncLoadoutButtons(){
    if(!root)return;root.querySelectorAll('[data-slot]').forEach(b=>{const slot=Number(b.dataset.slot),def=ArenaElements.byId[spellSlots[slot]];b.hidden=!def;if(!def){b.dataset.skill='empty';return;}b.dataset.skill=def.id;b.style.setProperty('--element',def.color);if(typeof ArenaGrimoire!=='undefined')b.querySelector('.ico').innerHTML=ArenaGrimoire.icon(def);else b.querySelector('.ico').textContent=def.icon;b.querySelector('.key').textContent=`${slot+1} ${def.name}`;b.setAttribute('aria-label',`${slot+1} ${def.name}`);});
  }
  function equipSpell(slot,id){
    if(![0,1].includes(slot)||!ArenaElements.byId[id]||!ArenaElements.owned(id))return false;
    const request=++equipRequest;
    if(ArenaElements.byId[id].pack&&!ArenaElements.isReady(id)){const at=root;ArenaGrimoire.status(root,'กำลังเตรียม '+ArenaElements.byId[id].name+'…');return ArenaElements.prepare(id).then(()=>{if(root!==at||!running||request!==equipRequest)return false;ArenaGrimoire.status(root,'พร้อมใช้งาน');return equipSpell(slot,id);}).catch(()=>{if(root===at&&request===equipRequest)ArenaGrimoire.status(root,'โหลดไม่สำเร็จ · แตะเพื่อลองใหม่');return false;});}
    const other=1-slot;if(spellSlots[other]===id)spellSlots[other]=spellSlots[slot];spellSlots[slot]=id;state.arenaLoadout=spellSlots.slice();saveState();syncLoadoutButtons();renderSpellbook();return true;
  }
  async function buySpell(slot,id){
    const def=ArenaElements.byId[id];if(!def||!Number.isFinite(def.price)||![0,1].includes(slot))return false;
    if(ArenaElements.owned(id))return equipSpell(slot,id);
    if(spellPurchases.has(id))return spellPurchases.get(id);
    if((state.coins||0)<def.price){feed('เหรียญไม่พอซื้อ '+def.name,'bad');return false;}
    const at=root;ArenaGrimoire.status(root,'กำลังเตรียม '+def.name+'…');
    const purchase=(async function purchaseArenaSpell(){
      try{
        if(typeof ArenaElements.prepare==='function')await ArenaElements.prepare(id);
        if(root!==at||!running)return false;
        if(ArenaElements.owned(id))return equipSpell(slot,id);
        if((state.coins||0)<def.price){ArenaGrimoire.status(root,'เหรียญไม่พอ · ยังไม่ได้ซื้อ');return false;}
        state.coins-=def.price;state.arenaItems['spell_'+id]=true;saveState();
        const applied=await equipSpell(slot,id);updateHud();ArenaGrimoire.status(root,'ซื้อ '+def.name+' แล้ว · ใช้ได้ถาวร');return applied;
      }catch(e){if(root===at)ArenaGrimoire.status(root,'โหลดไม่สำเร็จ · ไม่หักเหรียญ · แตะเพื่อลองใหม่');return false;}
      finally{spellPurchases.delete(id);}
    })();
    spellPurchases.set(id,purchase);return purchase;
  }
  function renderSpellbook(){
    if(typeof ArenaGrimoire!=='undefined'){ArenaGrimoire.render(root,{slots:spellSlots,editing:editingSlot,seconds:skillSeconds,own:ArenaElements.owned});return;}
    ui.slotTabs.innerHTML=spellSlots.map((id,i)=>`<button data-equip-slot="${i}" class="${editingSlot===i?'selected':''}" aria-pressed="${editingSlot===i}">${i+1} · ${ArenaElements.byId[id]?.icon||'+'} ${ArenaElements.byId[id]?.name||'เลือกพลัง'}</button>`).join('');
    ui.spellGrid.innerHTML=ArenaElements.skills.map(def=>{const slot=spellSlots.indexOf(def.id);return `<button class="va-spell-card${slot>=0?' equipped':''}" data-equip-spell="${def.id}" style="--element:${def.color}" aria-label="${def.name} ${def.desc}"><span class="va-element-icon">${def.icon}</span><b>${def.name}</b><small>${def.desc}</small><em>${slot>=0?'ช่อง '+(slot+1)+' · ':''}${Number(skillSeconds(def.id).toFixed(1))} วิ</em></button>`;}).join('');
  }
  function toggleSpellbook(on){if(!running)return;if(!on)closeBuy();basicHeld=false;keys.clear();joy.x=joy.z=0;homeRoute=false;ui.spellbook.classList.toggle('on',!!on);if(on){if(!spellSlots[1])editingSlot=1;renderSpellbook();}syncPause();}

  function updatePlayer(dt,t){
    let x=joy.x,z=joy.z;
    if(keys.has('KeyA')||keys.has('ArrowLeft'))x-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))x+=1;
    if(keys.has('KeyW')||keys.has('ArrowUp'))z-=1;if(keys.has('KeyS')||keys.has('ArrowDown'))z+=1;
    if(Math.hypot(x,z)>.1)homeRoute=false;
    if(homeRoute&&home&&!downed){const dx=home.position.x-player.pos.x,dz=home.position.z+1.7-player.pos.z,d=Math.hypot(dx,dz);if(d<1.5)homeRoute=false;else{x=dx/d;z=dz/d;}}
    const len=Math.hypot(x,z);if(len>1){x/=len;z/=len;}
    const petSpeed=petComp&&petComp.type==='dog'?1.08:1,speed=7.5*petSpeed*(1+relicMods.speed)*(downed?.24:1);
    player.vel.x+=(x*speed-player.vel.x)*Math.min(1,dt*10);player.vel.z+=(z*speed-player.vel.z)*Math.min(1,dt*10);
    if(len<.05){player.vel.x*=Math.max(0,1-dt*7);player.vel.z*=Math.max(0,1-dt*7);}
    player.pos.x+=player.vel.x*dt;player.pos.z+=player.vel.z*dt;
    for(const b of raceTargets)if(!b.dead){const dx=player.pos.x-b.group.position.x,dz=player.pos.z-b.group.position.z,d=Math.hypot(dx,dz);if(d<3.5){player.pos.x=b.group.position.x+(d?dx/d:1)*3.5;player.pos.z=b.group.position.z+(d?dz/d:0)*3.5;}}
    const r=Math.hypot(player.pos.x,player.pos.z);if(r>ARENA_R-1.8){player.pos.x*=((ARENA_R-1.8)/r);player.pos.z*=((ARENA_R-1.8)/r);}
    if(player.vel.lengthSq()>.12)player.facing.set(player.vel.x,0,player.vel.z).normalize();
    ArenaFieldVisuals.animate(player.spr,t,player.vel.length(),Math.atan2(player.facing.x,player.facing.z),downed,dt);player.aura.rotation.z+=dt;player.aura.material.color.setHex(downed?0xff5577:crystalCharge>=CRYSTAL_NEED?0xff79dd:0x5de8ff);player.crown.material.opacity=.7;

  }

  function updatePet(dt,t){
    if(!petComp)return;const moving=player.vel.lengthSq()>.25;
    const behind=player.facing.clone().multiplyScalar(moving?-2.15:-1.35),side=new THREE.Vector3(-player.facing.z,0,player.facing.x).multiplyScalar(moving?1.0:Math.sin(t*.0008+petComp.phase)*1.15);
    const goal=player.pos.clone().add(behind).add(side);const delta=goal.sub(petComp.group.position);petComp.vel.addScaledVector(delta,dt*14);petComp.vel.multiplyScalar(Math.pow(.035,dt));petComp.group.position.addScaledVector(petComp.vel,dt);
    const d=flatDist(petComp.group.position,player.pos);if(d>7){petComp.group.position.lerp(player.pos,.3);petComp.vel.set(0,0,0);burst(petComp.group.position,0x83f5d3,12,2);}
    const pace=Math.min(1,petComp.vel.length()/7);petComp.spr.position.y=.65+Math.abs(Math.sin(t*.014+petComp.phase))*.18*pace+Math.sin(t*.004)*.035;petComp.spr.scale.x=Math.abs(petComp.spr.scale.x)*(petComp.vel.x<-.12?-1:1);petComp.glow.rotation.z-=dt*1.6;
    if(t-lastPetStrike>4600*(1-relicMods.petCooldown)&&bots.length){const b=targetNearest(11);if(b){lastPetStrike=t;const bonus=petComp.type==='dragon'?26:petComp.type==='cat'?20:15;fireBolt(b,bonus*(own('prism')?1.25:1)*(1+relicMods.petDamage),petComp.type==='dragon'?0xff784d:0x7fffd2,true);feed(`🐾 ${petComp.data.name||'น้อง'} ช่วยโจมตี!`);}}
  }

  function updateBots(dt,t){
    const ppos=player.pos;
    for(const b of bots){
      if(b.dead)continue;
      const to=ppos.clone().sub(b.group.position).setY(0),d=to.length(),dir=to.normalize(),desired=new THREE.Vector3();
      if(d>8.5)desired.copy(dir).multiplyScalar(b.elite?3.5:2.7);else if(d<5.2)desired.copy(dir).multiplyScalar(-1.8);else desired.set(-dir.z,0,dir.x).multiplyScalar(Math.sin(t*.001+b.phase)>0?1.4:-1.4);
      if(b.slow>t)desired.multiplyScalar(.45);b.vel.lerp(desired,Math.min(1,dt*2.8));b.group.position.addScaledVector(b.vel,dt);
      const rr=Math.hypot(b.group.position.x,b.group.position.z);if(rr>ARENA_R-1){b.group.position.multiplyScalar((ARENA_R-1)/rr);}
      if(!activeMap)b.body.rotation.y+=dt*(b.elite?1.7:1.1);b.body.position.y=1.25+Math.sin(t*.003+b.phase)*.16;b.letter.position.y=3.25+Math.sin(t*.004+b.phase)*.13;
      b.group.lookAt(camera.position.x,b.group.position.y,camera.position.z);
      if(d<9.5&&t>b.attackAt&&!downed){enemyBolt(b);if(b.boss&&b.chapter>=2)schedule(()=>{if(running&&boss===b&&!b.dead&&!downed)enemyBolt(b);},230);b.attackAt=t+(b.boss?Math.max(850,1750-b.chapter*140):(b.elite?1500:rnd(2200,3200)));}
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
    if(downed||(home&&(race?.snapshot?.self.hp??5000)>0&&flatDist(player.pos,home.position)<3.3))return true;
    n*=1-relicMods.armor;
    if(shield>0){const use=Math.min(shield,n);shield-=use;n-=use;if(use>0){floatText(player.pos,`โล่ -${Math.ceil(use)}`,0x79dfff);if(window.ArenaAudio)ArenaAudio.playShield();}}
    if(n>0){const lost=Math.min(hp,n);hp=Math.max(0,hp-n);floatText(player.pos,`−${Math.ceil(lost)}`,0xff7f95);}lastHitAt=performance.now();ui.hp.animate([{opacity:1},{opacity:.5},{opacity:1}],{duration:220});haptic(28);
    const fell=hp<=0;if(fell)downPlayer();updateHud();return fell;
  }
  function downPlayer(){
    if(downed)return;homeRoute=false;crystalCharge=0;megaUses=0;if(race)race.drop();paintHome();downed=true;downUntil=performance.now()+DOWN_MS;hp=0;reviveHold=null;ui.downed.classList.add('on');
    for(let i=shots.length-1;i>=0;i--)if(shots[i].fromEnemy)removeShot(i);
    showPop('ล้มแล้ว!','เพื่อนยืนใกล้แล้วกดค้าง 2.2 วิ เพื่อช่วยชุบ');feed('🆘 ล้มแล้ว — คลานไปหาเพื่อนได้ และไม่เสียเหรียญ','bad');ringFx(player.pos,0xff5577,5,.65);netSend(true);
  }
  function recoverPlayer(source){
    if(!downed)return;downed=false;downUntil=0;hp=source==='เพื่อนช่วยชุบ'?Math.round(maxHp*.7):Math.round(maxHp*.45);if(hp>0&&window.ArenaAudio)ArenaAudio.playHeal();shield=Math.round(maxShield*.5);energy=Math.max(0,energy-(source==='เพื่อนช่วยชุบ'?0:2));ui.downed.classList.remove('on');
    showPop('กลับมาสู้ต่อ!',source==='เพื่อนช่วยชุบ'?'เพื่อนช่วยชุบ · HP 70%':'พลังสำรอง · HP 45%');feed(`🪽 ${source} — ไม่มีการหักเหรียญ`,'gold');ringFx(player.pos,0x79f5ff,7,.8);burst(player.pos,0x79f5ff,30,5);netSend(true);updateHud();
  }
  function nearestDownedPeer(){
    let best=null,bd=3.8;for(const uid in peers){const d=peers[uid],st=parseArenaStatus(d&&d.hp),a=peerActors[uid];if(!st||!st.down||!a)continue;const dist=flatDist(player.pos,a.group.position);if(dist<bd){bd=dist;best={uid,d,a,dist};}}return best;
  }
  function finishRevive(p){
    if(!p||performance.now()-lastReviveSent<900)return;lastReviveSent=performance.now();reviveSeq++;reviveSignal=`R|${p.uid}|${reviveSeq}`;revivesGiven++;state.arenaStats.revives=(state.arenaStats.revives||0)+1;
    if(bossPhase==='boss'){const support=Math.round(bossMax*.06);bossContribution+=support;feed(`✨ พลังช่วยทีมสวนกลับบอส +${fmt(support)}`,'gold');}
    saveState();netSend(true);schedule(()=>{if(reviveSignal.startsWith('R|')){reviveSignal='-';netSend(true);}},1800);ringFx(p.a.group.position,0x6fffd1,5,.7);burst(p.a.group.position,0x6fffd1,24,4);showPop('ช่วยเพื่อนสำเร็จ','นับเป็นผลงานทีมสำหรับโบนัสรางวัล');haptic([25,35,45]);reviveHold=null;
  }
  function updateRevive(t){
    if(!ui.revive)return;
    if(downed){ui.revive.classList.remove('on');ui.downTime.textContent=`รอเพื่อนมาชุบ ${Math.max(0,Math.ceil((downUntil-t)/1000))} วิ`;if(t>=downUntil)recoverPlayer('พลังสำรองอัตโนมัติ');return;}
    const p=nearestDownedPeer(),show=!!p&&t-lastReviveSent>1100;ui.revive.classList.toggle('on',show);if(!show){reviveHold=null;ui.reviveFill.style.width='0%';return;}
    ui.reviveName.textContent=`${p.d.n||'เพื่อน'} · ต้องอยู่ใกล้ตลอด`;if(reviveHold&&reviveHold.uid===p.uid){const k=clamp((t-reviveHold.at)/(REVIVE_HOLD_MS*(1-relicMods.revive)),0,1);ui.reviveFill.style.width=(k*100)+'%';if(k>=1)finishRevive(p);}else{reviveHold=null;ui.reviveFill.style.width='0%';}
  }

  function updateDrops(dt,t){
    // Letter lifetimes and positions are owned by the room server.

    for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.life-=dt;if(d.life<=0){scene.remove(d.group);disposeTree(d.group);drops.splice(i,1);continue;}d.gem.rotation.y+=dt*(activeMap?.8:2.6);if(!activeMap)d.gem.rotation.x+=dt*.8;d.group.position.y=(d.node?2.3:.65)+Math.sin(t*.004+d.phase)*.16;d.halo.rotation.z+=dt*1.8;if(!downed&&flatDist(d.group.position,player.pos)<1.4*(1+relicMods.pickup))collectDrop(d);}
  }
  function updateEffects(dt){
    for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.life-=dt;
      if(f.kind==='number'){
        if(f.life<=0){f.node.remove();effects.splice(i,1);continue;}
        f.pos.y+=dt*1.8;f.pos.x+=dt*f.drift;hudPoint.copy(f.pos).project(camera);const k=f.life/f.max,scale=1+Math.sin((1-k)*Math.PI)*.18;f.node.style.opacity=Math.min(1,k*1.5);f.node.style.transform=`translate(${(hudPoint.x*.5+.5)*innerWidth}px,${(-hudPoint.y*.5+.5)*innerHeight}px) translate(-50%,-50%) scale(${scale})`;continue;
      }
      if(f.vel)f.mesh.position.addScaledVector(f.vel,dt);if(f.spin)f.mesh.rotation.z+=dt*f.spin;
      const k=clamp(f.life/f.max,0,1);if(f.kind==='burst'){f.vel.y-=dt*2.8;f.mesh.scale.setScalar(Math.max(.01,k));}
      else if(f.kind==='ring'){const s=1+(1-k)*(f.to-1);f.mesh.scale.setScalar(s);}
      else if(f.kind==='float'){f.mesh.position.y+=dt*.9;}
      if(f.mesh.material)f.mesh.material.opacity=k*(f.opacity||1);
      if(f.life<=0){scene.remove(f.mesh);disposeTree(f.mesh);effects.splice(i,1);}
    }
  }

  function cameraTick(dt,snap=false){
    // Round 1389: all maps use the original following perspective camera.
    const aspect=innerWidth/innerHeight,wide=aspect>1.8;const want=new THREE.Vector3(player.pos.x,wide?33:36,player.pos.z+(wide?20:23));if(snap)camera.position.copy(want);else camera.position.lerp(want,1-Math.pow(.002,dt));camera.lookAt(player.pos.x,0,player.pos.z-2.3);
    const b=targetNearest(15);aimRing.visible=!!b;if(b){aimRing.position.x=b.group.position.x;aimRing.position.z=b.group.position.z;aimRing.scale.setScalar(b.elite?1.35:1);aimRing.material.opacity=.55+Math.sin(performance.now()*.008)*.25;}
  }

  /* ==== 🔤🧭 Round 1414 — Frontline-sized needed letters + edge arrows to letters and home ==== */
  function remainNeeded(){return (!target||wordBusy||!window.ArenaNav)?{}:ArenaNav.remain(target.en,bag,cargo);}
  function navLayer(){return root&&root.querySelector('#va-nav-layer');}
  function navMark(cls){const el=document.createElement('div');el.className=cls;navLayer().appendChild(el);return el;}
  function projectNav(x,y,z){hudPoint.set(x,y,z).project(camera);return {x:(hudPoint.x*.5+.5)*innerWidth,y:(-hudPoint.y*.5+.5)*innerHeight,behind:hudPoint.z>1||hudPoint.z<-1};}
  function styleNeededDrops(left){
    for(const d of drops){
      const need=!!left[d.ch],s=need?(d.node?1.55:2.85):.9;
      if(d.spr){d.spr.scale.set(s,s,1);d.spr.position.y=need?.42:.08;}
      if(d.halo)d.halo.scale.setScalar(need?1.45:1);
    }
  }
  function paintLetterCards(left){
    const needed=drops.filter(d=>left[d.ch]);
    while(letterMarks.length<needed.length)letterMarks.push(navMark('va-letter needed'));
    needed.forEach((d,i)=>{
      const el=letterMarks[i],p=projectNav(d.group.position.x,d.group.position.y+(d.node?1.35:1.85),d.group.position.z);
      const on=!p.behind&&p.x>-40&&p.x<innerWidth+40&&p.y>-40&&p.y<innerHeight+40;
      el.hidden=!on;if(!on)return;
      if(el.textContent!==d.ch)el.textContent=d.ch;
      el.style.transform='translate('+p.x+'px,'+p.y+'px) translate(-50%,-50%)';
    });
    for(let i=needed.length;i<letterMarks.length;i++)letterMarks[i].hidden=true;
  }
  function paintLetterHints(left){
    if(!window.ArenaNav)return;
    const items=drops.map(d=>({letter:d.ch,x:d.group.position.x,z:d.group.position.z}));
    const needed=cargo.length?[]:ArenaNav.neededLetterHints(items,player.pos,left);
    while(letterHints.length<needed.length)letterHints.push(navMark('va-hint'));
    needed.forEach((item,i)=>{
      const el=letterHints[i],p=projectNav(item.x,1.75,item.z),placed=ArenaNav.placeLetterHint(p.x,p.y,innerWidth,innerHeight);
      el.hidden=!placed.visible;if(!placed.visible)return;
      if(el.dataset.letter!==item.letter){el.dataset.letter=item.letter;el.replaceChildren();const mark=document.createElement('i'),ch=document.createElement('b');ch.textContent=item.letter;el.append(mark,ch);}
      el.style.transform='translate('+placed.x+'px,'+placed.y+'px) translate(-50%,-50%) rotate('+placed.angle+'rad)';
      const ch=el.querySelector('b');if(ch)ch.style.transform='rotate('+(-placed.angle)+'rad)';
    });
    for(let i=needed.length;i<letterHints.length;i++)letterHints[i].hidden=true;
  }
  function paintHomeHint(){
    if(!window.ArenaNav)return;
    if(!homeHintEl)homeHintEl=navMark('va-hint home');
    if(!home){homeHintEl.hidden=true;return;}
    const p=projectNav(home.position.x,2.2,home.position.z),placed=ArenaNav.placeLetterHint(p.x,p.y,innerWidth,innerHeight);
    homeHintEl.hidden=!placed.visible;if(!placed.visible)return;
    if(homeHintEl.dataset.kind!=='home'){homeHintEl.dataset.kind='home';homeHintEl.replaceChildren();const mark=document.createElement('i'),ch=document.createElement('b');ch.textContent='บ้าน';homeHintEl.append(mark,ch);}
    homeHintEl.style.transform='translate('+placed.x+'px,'+placed.y+'px) translate(-50%,-50%) rotate('+placed.angle+'rad)';
    const ch=homeHintEl.querySelector('b');if(ch)ch.style.transform='rotate('+(-placed.angle)+'rad)';
  }
  function updateNav(){
    if(!root||!camera||!navLayer()||paused)return;
    const left=remainNeeded();
    styleNeededDrops(left);paintLetterCards(left);paintLetterHints(left);paintHomeHint();
  }

  function loop(t){
    if(!running)return;raf=requestAnimationFrame(loop);const dt=Math.min(.034,lastFrame?(t-lastFrame)/1000:.016);lastFrame=t;
    if(document.hidden)return;
    if(!paused){if((basicHeld||keys.has('Space'))&&targetNearest(15))castSkill('basic');updatePlayer(dt,t);updatePet(dt,t);elements.tick(dt);updateBots(dt,t);updateShots(dt,t);updateDrops(dt,t);updateHome(dt,t);updateEffects(dt);fieldFx.tick(dt);ensureBots(t);cameraTick(dt);updateNav();
      if(!downed&&relicMods.regen&&t-lastHitAt>4000){const before=hp;hp=Math.min(maxHp,hp+dt*relicMods.regen);if(hp>before&&window.ArenaAudio)ArenaAudio.playHeal();}if(maxShield&&t-lastHitAt>4200)shield=Math.min(maxShield,shield+dt*4.5);if(arenaMotes)arenaMotes.rotation.y+=dt*.015;updateCooldownUi(t);}
    tickCoop(t);if(!paused||!sceneDrawn)updateVitals();
    if(!paused||!sceneDrawn){renderer.render(scene,camera);sceneDrawn=true;}
  }

  function flatDist(a,b){const x=a.x-b.x,z=a.z-b.z;return Math.hypot(x,z);}
  function burst(pos,color,n=12,force=3){if(fieldFx)fieldFx.burst(pos,color,fxLow?Math.ceil(n*.6):n,force);}
  function spark(pos,color){if(fieldFx)fieldFx.burst(pos,color,1,.3);}
  function ringFx(pos,color,to=5,life=.5){if(fieldFx)fieldFx.ring(pos,color,to,life);}
  function beam(a,b,color,life=.25){if(fieldFx)fieldFx.beam(a,b,color,life);}
  function floatText(pos,text,color){
    if(!ui.vitalsLayer||effects.length>=32)return;const node=document.createElement('span');node.className='va-damage-number';node.textContent=text;node.style.color='#'+new THREE.Color(color).getHexString();ui.vitalsLayer.appendChild(node);effects.push({node,pos:pos.clone().setY(2.15),drift:rnd(-.55,.55),life:1.15,max:1.15,kind:'number'});
  }
  function updateVitals(){
    if(!ui.vitalsLayer||!camera)return;vitalLive.clear();
    function paint(key,pos,y,value,max,kind){
      vitalLive.add(key);let node=vitalNodes.get(key);if(!node){node=document.createElement('div');node.className='va-vital '+kind;node.innerHTML='<b></b><span><i></i></span>';node._text=node.querySelector('b');node._fill=node.querySelector('i');vitalNodes.set(key,node);ui.vitalsLayer.appendChild(node);}
      const v=Math.max(0,Math.ceil(value)),top=Math.max(1,Math.ceil(max)),label=`${v} / ${top}`;if(node._text.textContent!==label){node._text.textContent=label;node._fill.style.width=Math.min(100,v/top*100)+'%';node.classList.toggle('low',v/top<.3);node.setAttribute('aria-label',`HP ${label}`);}
      hudPoint.copy(pos);hudPoint.y+=y;hudPoint.project(camera);node.hidden=hudPoint.z>1||hudPoint.z< -1||Math.abs(hudPoint.x)>1.08||Math.abs(hudPoint.y)>1.08;node.style.transform=`translate(${(hudPoint.x*.5+.5)*innerWidth}px,${(-hudPoint.y*.5+.5)*innerHeight}px) translate(-50%,-100%)`;
    }
    if(home&&race?.snapshot)paint('own-vault',home.position,4.5,race.snapshot.self.hp,5000,'peer');
    for(const b of raceTargets)paint('vault-'+b.vaultOwner,b.group.position,4.5,b.hp,5000,'enemy');
    if(player)paint(player,player.pos,2.8,hp,maxHp,'self');
    for(const b of bots)if(!b.dead)paint(b,b.group.position,4.15*b.group.scale.y,b.boss?bossHp:b.hp,b.maxHp,b.boss?'boss':'enemy');
    for(const uid in peerActors){const a=peerActors[uid],st=parseArenaStatus((peers[uid]||{}).hp);if(st)paint(a,a.group.position,3.05,st.hp,st.max,'peer');}
    for(const [key,node] of vitalNodes)if(!vitalLive.has(key)){node.remove();vitalNodes.delete(key);}
  }

  function disposeTree(obj){obj.traverse&&obj.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});}

  function feed(text,kind=''){
    if(!ui.feed)return;const d=document.createElement('div');d.className='va-feed-line '+kind;d.textContent=text;ui.feed.prepend(d);while(ui.feed.children.length>4)ui.feed.lastElementChild.remove();schedule(()=>d.remove(),4200);
  }
  function showPop(big,small){if(!ui.pop)return;ui.pop.querySelector('strong').textContent=big;ui.pop.querySelector('span').textContent=small||'';ui.pop.classList.add('on');clearTimeout(ui.pop._t);ui.pop._t=schedule(()=>ui.pop.classList.remove('on'),1450);}
  function updateWord(){
    if(!target)return;ui.wordTh.textContent=target.boss?(bossWordSolved?'✅ ทำลายเกราะคำศัพท์แล้ว · ช่วยทีมโจมตีต่อ':`${target.th} · ทุกคนช่วยกันได้`):`${target.th} · ${wordBusy?'จบคำแล้ว · รอคำถัดไป':'ฝากก่อนชนะ 1,000 เหรียญ'}`;ui.wordEn.textContent=target.en;
    const have={...bag};ui.wordSlots.innerHTML=Array.from(target.en).map(ch=>{const got=have[ch]>0;if(got)have[ch]--;return `<i class="${got?'got':''}">${ch}</i>`;}).join('');
  }
  function updateHud(){
    if(!root)return;ui.coins.textContent=fmt(state.coins||0);root.querySelector('#va-session-coins').textContent='รอบนี้ +'+fmt(sessionCoins);ui.shopCoins.textContent=fmt(state.coins||0);ui.energyFill.style.width=(crystalCharge/CRYSTAL_NEED*100)+'%';ui.energy.classList.toggle('hot',crystalCharge>=CRYSTAL_NEED);root.querySelector('#va-crystal-count').textContent=megaUses?`💎 MEGA เหลือ ${megaUses} ครั้ง`:`◆ ${crystalCharge}/5 · เก็บคริสตัล`;ui.energyPower.textContent='×'+powerMult().toFixed(1);
    ui.hpFill.style.width=(hp/maxHp*100)+'%';ui.hp.classList.toggle('low',hp/maxHp<.3);ui.hp.querySelector('b').textContent=(maxShield||shield>0)?`HP ${Math.ceil(hp)} · 🛡${Math.ceil(shield)}`:`HP ${Math.ceil(hp)}`;
    const entries=Object.entries(cargo.reduce((a,ch)=>(a[ch]=(a[ch]||0)+1,a),{}));ui.bagList.innerHTML=entries.length?entries.map(([ch,n])=>`<span class="va-bag-letter">${ch}${n>1?`<small>×${n}</small>`:''}</span>`).join(''):'<span style="font-size:9px;color:#7795aa">ยังไม่มีอักษร</span>';
    root.querySelectorAll('[data-skill]').forEach(b=>b.classList.toggle('down',downed));root.querySelector('[data-skill="ult"]').classList.toggle('ready',crystalCharge>=CRYSTAL_NEED&&!downed);root.querySelector('[data-skill="ult"]').classList.toggle('locked',crystalCharge<CRYSTAL_NEED||downed);root.querySelector('#va-mega-uses').textContent=`เหลือ ${megaUses}`;root.querySelector('[data-skill="ult"]').setAttribute('aria-label',megaUses?`MEGA เหลือใช้ได้ ${megaUses} ครั้ง`:`MEGA คริสตัล ${crystalCharge} จาก 5`);updateWord();updateBossHud();paintHome();
  }
  function updateCooldownUi(t){
    root.querySelectorAll('[data-skill]').forEach(b=>{if(b.hidden)return;const k=b.dataset.skill,left=Math.max(0,cooldown[k]-t),total=skillSeconds(k)*1000;b.classList.toggle('cool',left>0);b.style.setProperty('--cd',Math.round(left/total*100)+'%');b.querySelector('.cd').textContent=left>0?(left/1000).toFixed(left>950?0:1)+(k==='ult'?' วิ':''):'';});
  }
  function pulseButton(k){const b=root.querySelector(`[data-skill="${k}"]`);if(b)b.animate([{transform:'scale(1)'},{transform:'scale(.84)'},{transform:'scale(1)'}],{duration:240});}

  function haptic(v){if(state.haptic&&navigator.vibrate)try{navigator.vibrate(v);}catch(e){}}

  function resize(){if(!renderer||!camera)return;sceneDrawn=false;const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(player)cameraTick(0,true);}

  function resetRound(){
    bots=[];drops=[];shots=[];effects=[];respawns=[];bag={};cargo=[];homeRoute=false;recentLetters=[];energy=0;crystalCharge=0;megaUses=0;crystalLetterIndex=Math.floor(Math.random()*26);kills=0;sessionWords=0;sessionCoins=0;cooldown=Object.fromEntries(Object.keys(SKILL_CD).map(k=>[k,0]));if(elements)elements.clear();hp=maxHp;shield=maxShield;wordBusy=false;lastPetStrike=performance.now();lastHitAt=0;downed=false;downUntil=0;reviveHold=null;reviveSignal='-';reviveSeq=0;revivesGiven=0;chapter=state.arenaChapter||1;waveBase=0;bossPhase='wave';boss=null;bossEncounter='';bossMax=bossHp=bossContribution=0;bossWord='';bossWordSolved=false;bossVictoryAt=0;bossReward=0;onPeer._seen.clear();
    player.pos.set(home.position.x+2,0,home.position.z-4);player.vel.set(0,0,0);if(petComp){petComp.group.position.set(-1.8,0,9);petComp.vel.set(0,0,0);}nextWord();for(let i=0;i<BOT_TARGET;i++)buildBot(chooseBotLetter(),false);updateHud();
  }

  function start(session){
    if(running)return;
    ensureState();fxLow=!!state.noAnim||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
    if(typeof clearWarnToasts==='function')clearWarnToasts();if(typeof Music!=='undefined')Music.suspendBg();
    sceneDrawn=false;createDom();if(window.ArenaAudio)ArenaAudio.start(root);initThree();race=window.ArenaRace?.create({snapshot:raceSnapshot,reset:raceReset,status:text=>{raceStatus=text;renderPartyHud();},credit:n=>{if(running){if(n)feed(`รับ ${fmt(n)} เหรียญเข้ากระเป๋าแล้ว`,'gold');updateHud();}}});raceSessionOffset=session?.earned||0;resetRound();cameraTick(0,true);if(session&&Number.isFinite(session.earned))sessionCoins=Math.max(0,session.earned);updateHud();running=true;paused=!state.arenaHomeIntro;lastFrame=0;setupCoop();
    if(!state.arenaHomeIntro)ui.intro.classList.add('on');else feed('เก็บอักษรแล้วขนกลับบ้าน · H หรือปุ่มบ้านพากลับไปฝาก','gold');
    raf=requestAnimationFrame(loop);
  }

  function stop(options){
    if(!running)return;if(race){race.close();race=null;}raceTargets=[];vaultHomes.clear();running=false;equipRequest++;paused=false;cancelAnimationFrame(raf);raf=0;pendingTimers.forEach(clearTimeout);pendingTimers.clear();if(window.ArenaAudio)ArenaAudio.stop();if(elements){elements.clear();elements=null;}if(fieldFx){fieldFx.dispose();fieldFx=null;}listeners.splice(0).forEach(fn=>{try{fn();}catch(e){}});keys.clear();joy={x:0,z:0,id:null};basicHeld=false;
    if(room){room.leave();room=null;}Object.keys(peerActors).forEach(removePeerActor);peers={};peerActors={};
    for(const s of shots){if(s.mesh.parent)scene.remove(s.mesh);disposeTree(s.mesh);}if(scene)disposeTree(scene);if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();renderer.setSize(2,2,false);}
    if(root)root.remove();vitalNodes.clear();vitalLive.clear();letterMarks.length=0;letterHints.length=0;homeHintEl=null;root=null;built=false;renderer=scene=camera=clock=null;bots=[];drops=[];shots=[];effects=[];petComp=null;player=null;home=null;crystalNodes=[];crystalCharge=0;megaUses=0;
    saveState();if(options?.mapSwitch)return;if(typeof Music!=='undefined')Music.resumeBg();if(typeof renderDashboard==='function')renderDashboard();
    if(typeof toast==='function')toast(`🌀 กลับจาก Vocab Arena — สำเร็จ ${sessionWords} คำ · +${fmt(sessionCoins)} 🪙`);
  }

  window.VocabArena3D={start,stop,_t:{
    map:()=>activeMap?.id,room:()=>room,camera:()=>camera,ground:()=>scene?.getObjectByName('arena-ground'),project:p=>new THREE.Vector3(p.x,p.y||0,p.z).project(camera),
    get sessionCoins(){return sessionCoins},get running(){return running},get bots(){return bots},get drops(){return drops},get bag(){return bag},get target(){return target},get cargo(){return cargo},home:()=>home,bank:bankCargo,stats:()=>({frames:renderer.info.render.frame,draws:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures,fx:fieldFx.stats()}),get energy(){return energy},get crystalCharge(){return crystalCharge},get megaUses(){return megaUses},get crystalNodes(){return crystalNodes},tickDrops:updateDrops,drop:dropLetter,nav:()=>({remain:remainNeeded(),letters:letterMarks.filter(el=>!el.hidden).length,hints:letterHints.filter(el=>!el.hidden).length,home:!!(homeHintEl&&!homeHintEl.hidden)}),
    get slots(){return spellSlots.slice()},get cooldowns(){return {...cooldown}},elementStats:()=>elements.stats(),equip:equipSpell,spellbook:toggleSpellbook,refreshRelics,relics:()=>({...relicMods,maxHp,maxShield,cargoMax:CARGO_MAX}),health:()=>({hp,shield}),hero:()=>selectedHero?.id,skillSeconds,damage:damagePlayer,cast:castSkill,kill:(i=0)=>bots[i]&&hitBot(bots[i],9999),collect:(i=0)=>drops[i]&&collectDrop(drops[i]),complete:()=>checkWord(),race:()=>race,
    buy:buyItem,buySpell,player:()=>player,resize,down:downPlayer,recover:()=>recoverPlayer('เพื่อนช่วยชุบ'),boss:()=>({phase:bossPhase,chapter,encounter:bossEncounter,hp:bossHp,max:bossMax,word:bossWord,contribution:bossContribution}),triggerBoss:()=>{},wire:applyLeaderWire,peer:onPeer,gone:onPeerGone,party:()=>({leader:leaderId(),members:partyUids(),online:!!(room&&room.online)}),
    /* ทดสอบแยกเฟสเมื่อ WebView เครื่องใดสร้างฉากไม่ผ่าน — ไม่ทำงานเองในเกมจริง */
    stage(part){
      if(part==='dom'){ensureState();createDom();return 'dom';}
      if(part==='three'){if(!root){ensureState();createDom();}initThree();return 'three';}
      if(part==='reset'){if(!built){if(!root){ensureState();createDom();}initThree();}resetRound();return 'reset';}
      return 'unknown';
    },
    frame:(ms=16)=>{const t=performance.now();updatePlayer(ms/1000,t);updatePet(ms/1000,t);elements.tick(ms/1000);updateBots(ms/1000,t);updateShots(ms/1000,t);updateDrops(ms/1000,t);updateHome(ms/1000,t);updateEffects(ms/1000);fieldFx.tick(ms/1000);cameraTick(ms/1000);updateNav();updateVitals();renderer.render(scene,camera);}
  }};
})();
