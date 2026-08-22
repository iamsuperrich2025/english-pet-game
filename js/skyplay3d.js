"use strict";
/* ============================================================
   ☁️📚 รอบ 1233 — VOCAB SKY PLAYGROUND · PHASE 4
   Bright Fantasy Social World + Obby ของ Vocab World
   - standalone Three.js engine: ไม่แตะ Adventure World / Invasion
   - Soft Cuboid Chibi 3D + pet จริง + NetRoom สูงสุด 6 คน
   - Letter Hunt, Word Race, Sky Obby, Vocabulary Tower, Daily Missions
   - Classroom Sky Events: ครูเลือกคำ/เวลา/โหมด + สรุปชั้นเรียนผ่าน NetRoom เดิม
   ============================================================ */
(function(){
  const TAU=Math.PI*2, ROOM_MAX=6, FALL_Y=-14, GRAVITY=29, MOVE_SPEED=8.2, JUMP_SPEED=11.2, TOWER_FLOORS=6;
  const ACTIVITY_KINDS=['letter','race','obby','tower'];
  const ACTIVITY_META={letter:{icon:'🔤',name:'Letter Hunt'},race:{icon:'🏁',name:'Word Race'},obby:{icon:'☁️',name:'Sky Obby'},tower:{icon:'🏰',name:'Vocabulary Tower'}};
  const CLASS_MIN_WORDS=3,CLASS_MAX_WORDS=5,CLASS_TIMES=[30,60,90];
  const CLASS_MODES={meaning:{code:'M',name:'🎯 เลือกความหมาย'},listen:{code:'L',name:'🔊 ฟังแล้วเลือก'},spell:{code:'S',name:'✏️ เลือกสะกดถูก'}};
  const COLORS={sky:0x8fd8ff,navy:0x16346b,cyan:0x46ddff,pink:0xff67ad,yellow:0xffd74d,mint:0x62e6b0,purple:0x8f70ff,white:0xfffbef};
  const AV_BASE=[
    [0xffcf9e,0xe53935,0x1e58c8,0x2b2320],[0xffd9ae,0x29b6f6,0x274a8f,0x6d4c2f],
    [0xf2b98a,0x43a047,0x7a6a4f,0xef6c00],[0xffcf9e,0xfb8c00,0x5d4037,0x232323],
    [0xffd9ae,0x8e24aa,0x4e5a63,0xffca28],[0xffe0bd,0xf06292,0xfafafa,0x8d5a3b],
    [0xf2b98a,0xfdd835,0x33691e,0x232323],[0xffd9ae,0x4db6ac,0x37474f,0xf5f5f5]
  ];

  let root,canvas,renderer,scene,camera,clock,raf=0,running=false,paused=false,lastFrame=0;
  let player,petComp,room=null,myUid='local',peers={},peerActors={},sessionCoins=0,sessionStars=0;
  let supports=[],cameraMeshes=[],moving=[],rotators=[],checkpoints=[],stars=[],effects=[],portal=null,gate=null;
  let letterTokens=[],raceGates=[],towerFloors=[],towerQuestion=null,joinOffer=null,activity='plaza',activityRound=null,activityStartedAt=0,activityDone=false;
  let classOffer=null,classWire='',classFinished=false,classView='setup',classRoster={};
  let keys=new Set(),joy={id:null,x:0,z:0},look={id:null,x:0,y:0},listeners=[];
  let camYaw=0,camPitch=.36,camDist=8.8,grounded=false,jumpQueued=false,emoteUntil=0;
  let currentCheckpoint=0,lastSupport=null,lastNetAt=0,lastPeerBudget=0,routeFinished=false,gateQuestion=null;
  let texLoader,audioCtx=null,fxLow=false;
  const ui={};
  const geoCache={},matCache={};

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=n=>(typeof fmtNum==='function'?fmtNum(n):Math.round(n).toLocaleString());
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const profileAvatar=()=>{
    if(typeof lobbyBlk==='function') return lobbyBlk();
    if(/^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(state.profAv||'')) return state.profAv;
    return state.playerAvatar==='female'?'blk6':'blk1';
  };
  const petInfo=()=>typeof activePet==='function'?activePet():null;
  const addListener=(el,type,fn,opt)=>{ if(!el)return;el.addEventListener(type,fn,opt);listeners.push(()=>el.removeEventListener(type,fn,opt)); };
  const colorCss=n=>'#'+Number(n).toString(16).padStart(6,'0');

  function ensureState(){
    if(!state.skyProgress||typeof state.skyProgress!=='object') state.skyProgress={checkpoint:0,stars:0,totalCoins:0};
    if(!state.skyProgress.activities||typeof state.skyProgress.activities!=='object') state.skyProgress.activities={letter:0,race:0,obby:0,tower:0};
    if(!state.skyProgress.badges||typeof state.skyProgress.badges!=='object') state.skyProgress.badges={};
    if(!Number.isFinite(state.skyProgress.towerCheckpoint)) state.skyProgress.towerCheckpoint=0;
    if(!Array.isArray(state.skyDone)) state.skyDone=[];
    if(!state.skyDaily||typeof state.skyDaily!=='object') state.skyDaily={date:'',routes:{}};
    if(!state.skyDaily.routes||typeof state.skyDaily.routes!=='object') state.skyDaily.routes={};
    if(state.skyDaily.date!==(typeof todayStr==='function'?todayStr():new Date().toISOString().slice(0,10)))
      state.skyDaily={date:(typeof todayStr==='function'?todayStr():new Date().toISOString().slice(0,10)),routes:{},claims:{},missions:null,active:null};
    if(!state.skyDaily.claims||typeof state.skyDaily.claims!=='object') state.skyDaily.claims={};
    if(!Array.isArray(state.skyDaily.missions)||state.skyDaily.missions.length!==3) state.skyDaily.missions=makeDailyMissions(state.skyDaily.date);
    currentCheckpoint=clamp(parseInt(state.skyProgress.checkpoint,10)||0,0,2);
  }

  function makeDailyMissions(date){
    const shift=hashText(date)%ACTIVITY_KINDS.length,rot=ACTIVITY_KINDS.slice(shift).concat(ACTIVITY_KINDS.slice(0,shift));
    return rot.slice(0,3).map(kind=>({kind,target:1,progress:0,done:false}));
  }

  function createDom(){
    const old=document.getElementById('sp-root');if(old)old.remove();
    root=document.createElement('div');root.id='sp-root';root.innerHTML=`
      <canvas id="sp-canvas" aria-label="Vocab Sky Playground 3D"></canvas>
      <div class="sp-sky-glow"></div>
      <div class="sp-top">
        <button class="sp-pill sp-exit" id="sp-exit">← Exit</button>
        <div class="sp-pill sp-title"><b>☁️ Vocab Sky Playground</b><small id="sp-online">กำลังเตรียมสนาม…</small></div>
        <div class="sp-pill sp-challenge"><small>CHALLENGE</small><b id="sp-challenge">Rainbow Route</b><span id="sp-progress">⭐ 0/5 · 💎 CP ${currentCheckpoint+1}/3</span></div>
        <button class="sp-pill sp-play" id="sp-play">🎮 PLAY</button>
        <button class="sp-pill sp-class-btn" id="sp-class">🏫 CLASS</button>
        <div class="sp-pill sp-coins">🪙 <b id="sp-coins">${fmt(state.coins||0)}</b></div>
      </div>
      <section class="sp-daily" id="sp-daily" aria-label="Daily Sky Missions">
        <header><b>🌞 DAILY SKY</b><span id="sp-daily-count">0/3</span></header>
        <div id="sp-missions"></div><footer id="sp-badges">🏅 ยังไม่มี badge</footer>
        <button id="sp-join-live" hidden>🟢 JOIN LIVE</button>
      </section>
      <div class="sp-score" id="sp-score" aria-live="polite"></div>
      <div class="sp-hint" id="sp-hint">WASD เดิน · Space กระโดด · ลากฉากเพื่อหมุนกล้อง</div>
      <div class="sp-word" id="sp-word"><b>STAR</b><span>ดาว</span></div>
      <div class="sp-pop" id="sp-pop"><b>+100 Coins</b><span>Rainbow Route complete!</span></div>
      <div class="sp-toast" id="sp-toast"></div>
      <div class="sp-joy" id="sp-joy"><i></i></div>
      <div class="sp-actions"><button id="sp-emote" aria-label="Emote">👋</button><button id="sp-jump" aria-label="Jump">JUMP</button></div>
      <div class="sp-activity" id="sp-activity" aria-hidden="true"><div class="sp-activity-card">
        <button class="sp-close" id="sp-activity-close" aria-label="Close">×</button><small>☁️ PLAY TOGETHER · สูงสุด 6 คน</small><h2>เลือกกิจกรรม</h2>
        <div class="sp-daily-summary" id="sp-daily-summary"></div><div class="sp-activity-grid">
          <button data-activity="letter"><b>🔤 Letter Hunt</b><span>ช่วยกันเก็บตัวอักษรให้ครบคำ</span></button>
          <button data-activity="race"><b>🏁 Word Race</b><span>วิ่งผ่านประตูคำตอบ 3 ด่าน</span></button>
          <button data-activity="obby"><b>☁️ Sky Obby</b><span>แข่งขึ้นยอดฟ้า จับเวลาและอันดับสด</span></button>
          <button data-activity="tower"><b>🏰 Vocabulary Tower</b><span>พิชิต 6 ชั้น ยิ่งสูงยิ่งท้าทาย</span></button>
        </div><p>เพื่อนในสวนลอยฟ้าเดียวกันจะเห็น progress และอันดับแบบสด</p>
      </div></div>
      <div class="sp-gate" id="sp-gate" aria-hidden="true"><div class="sp-gate-card">
        <small>🔮 VOCABULARY GATE</small><h2 id="sp-gate-q">Which word means แมว?</h2><div id="sp-gate-options"></div>
        <p id="sp-gate-feedback">ตอบถูกเพื่อเปิดสะพาน · ตอบผิดลองใหม่ได้</p>
      </div></div>
      <div class="sp-tower" id="sp-tower" aria-hidden="true"><div class="sp-tower-card">
        <small>🏰 VOCABULARY TOWER · <span id="sp-tower-level">ชั้น 1/6</span></small><h2 id="sp-tower-q"></h2>
        <button class="sp-hear" id="sp-tower-hear">🔊 ฟังคำศัพท์</button><div id="sp-tower-options"></div>
        <p id="sp-tower-feedback">ตอบผิดลองใหม่ได้ · ไม่เสียเหรียญ</p>
      </div></div>
      <div class="sp-classroom" id="sp-classroom" aria-hidden="true"><div class="sp-class-card">
        <button class="sp-close" id="sp-class-close" aria-label="Close">×</button>
        <small>🏫 CLASSROOM SKY EVENT · ห้องเดิมสูงสุด 6 คน</small><h2 id="sp-class-title">สร้างกิจกรรมห้องเรียน</h2>
        <div id="sp-class-body"></div>
      </div></div>`;
    document.body.appendChild(root);canvas=root.querySelector('#sp-canvas');
    Object.assign(ui,{online:root.querySelector('#sp-online'),challenge:root.querySelector('#sp-challenge'),progress:root.querySelector('#sp-progress'),coins:root.querySelector('#sp-coins'),hint:root.querySelector('#sp-hint'),word:root.querySelector('#sp-word'),pop:root.querySelector('#sp-pop'),toast:root.querySelector('#sp-toast'),joy:root.querySelector('#sp-joy'),joyKnob:root.querySelector('#sp-joy i'),gate:root.querySelector('#sp-gate'),gateQ:root.querySelector('#sp-gate-q'),gateOptions:root.querySelector('#sp-gate-options'),gateFeedback:root.querySelector('#sp-gate-feedback'),activity:root.querySelector('#sp-activity'),score:root.querySelector('#sp-score'),daily:root.querySelector('#sp-daily'),missions:root.querySelector('#sp-missions'),dailyCount:root.querySelector('#sp-daily-count'),dailySummary:root.querySelector('#sp-daily-summary'),badges:root.querySelector('#sp-badges'),joinLive:root.querySelector('#sp-join-live'),tower:root.querySelector('#sp-tower'),towerLevel:root.querySelector('#sp-tower-level'),towerQ:root.querySelector('#sp-tower-q'),towerOptions:root.querySelector('#sp-tower-options'),towerFeedback:root.querySelector('#sp-tower-feedback'),classBtn:root.querySelector('#sp-class'),classroom:root.querySelector('#sp-classroom'),classTitle:root.querySelector('#sp-class-title'),classBody:root.querySelector('#sp-class-body'),classClose:root.querySelector('#sp-class-close')});
  }

  function mat(color,kind='lambert'){
    const k=kind+'_'+color;if(matCache[k])return matCache[k];
    const opt={color};let m;
    if(kind==='basic')m=new THREE.MeshBasicMaterial(opt);
    else if(kind==='standard')m=new THREE.MeshStandardMaterial({color,roughness:.68,metalness:.04});
    else m=new THREE.MeshLambertMaterial(opt);
    return matCache[k]=m;
  }
  function softGeo(w,h,d,r){
    r=Math.min(r==null?Math.min(w,h,d)*.24:r,w*.49,h*.49,d*.49);const k=`s_${w}_${h}_${d}_${r}`;
    if(geoCache[k])return geoCache[k];const g=new THREE.BoxGeometry(w,h,d,2,2,2),p=g.attributes.position;
    const ix=w*.5-r,iy=h*.5-r,iz=d*.5-r;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),qx=clamp(x,-ix,ix),qy=clamp(y,-iy,iy),qz=clamp(z,-iz,iz),dx=x-qx,dy=y-qy,dz=z-qz,l=Math.hypot(dx,dy,dz)||1;p.setXYZ(i,qx+dx/l*r,qy+dy/l*r,qz+dz/l*r);}
    p.needsUpdate=true;g.computeVertexNormals();g.userData.shared=true;return geoCache[k]=g;
  }
  function meshSoft(w,h,d,color,r){return new THREE.Mesh(softGeo(w,h,d,r),mat(color));}
  function avatarColors(id){
    const n=clamp((parseInt(String(id).replace('blk',''),10)||1)-1,0,87);if(n<8)return AV_BASE[n];
    const h=(n*47)%360,c=new THREE.Color();c.setHSL(h/360,.68,.52);const c2=new THREE.Color();c2.setHSL(((h+45)%360)/360,.55,.32);return [0xffd4ad,c.getHex(),c2.getHex(),0x352a29];
  }
  function makeChibi(id){
    const [skin,shirt,pants,hair]=avatarColors(id),g=new THREE.Group();g.userData.limbs=[];g.userData.playerStyle='soft-cuboid-chibi-3d';
    [-.16,.16].forEach(x=>{const p=new THREE.Group();p.position.set(x,.46,0);const l=meshSoft(.25,.42,.29,pants,.09);l.position.y=-.21;p.add(l);g.add(p);g.userData.limbs.push(p);});
    const torso=meshSoft(.64,.55,.42,shirt,.14);torso.position.y=.74;g.add(torso);
    [-1,1].forEach(s=>{const p=new THREE.Group();p.position.set(s*.42,.95,0);const a=meshSoft(.19,.42,.23,shirt,.08);a.position.y=-.2;a.rotation.z=s*-.1;const hand=meshSoft(.17,.15,.19,skin,.06);hand.position.y=-.28;a.add(hand);p.add(a);g.add(p);g.userData.limbs.push(p);});
    const head=meshSoft(.7,.62,.62,skin,.18);head.position.y=1.28;g.add(head);
    [-.14,.14].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.052,8,6),mat(0x172442,'basic'));eye.scale.y=1.22;eye.position.set(x,1.34,-.305);g.add(eye);const shine=new THREE.Mesh(new THREE.SphereGeometry(.017,6,4),mat(0xffffff,'basic'));shine.position.set(x-.012,1.365,-.349);g.add(shine);});
    const smile=new THREE.Mesh(new THREE.TorusGeometry(.09,.014,5,12,Math.PI),mat(0xa34e54,'basic'));smile.position.set(0,1.205,-.318);smile.rotation.z=Math.PI;g.add(smile);
    const hairTop=meshSoft(.72,.16,.64,hair,.07);hairTop.position.y=1.61;g.add(hairTop);return g;
  }
  function textSprite(text,color=0xffffff,w=512,h=128){
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');c.clearRect(0,0,w,h);c.fillStyle='rgba(16,40,88,.82)';c.beginPath();c.roundRect(8,8,w-16,h-16,28);c.fill();c.fillStyle=colorCss(color);c.font=`800 ${Math.floor(h*.44)}px Arial`;c.textAlign='center';c.textBaseline='middle';c.fillText(String(text).slice(0,24),w/2,h/2);
    const t=new THREE.CanvasTexture(cv);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.userData.ownTexture=t;return s;
  }

  function initThree(){
    renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.45));renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace&&THREE.SRGBColorSpace&&(renderer.outputColorSpace=THREE.SRGBColorSpace);
    scene=new THREE.Scene();scene.fog=new THREE.Fog(0xb9ddff,72,150);scene.background=makeSkyTexture();
    camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,190);clock=new THREE.Clock();texLoader=new THREE.TextureLoader();
    scene.add(new THREE.HemisphereLight(0xf9fbff,0x836bb7,1.02));const sun=new THREE.DirectionalLight(0xffefd0,.74);sun.position.set(-30,55,25);scene.add(sun);
    buildWorld();buildPlayer();buildPet();bindInput();resize();
  }
  function makeSkyTexture(){const cv=document.createElement('canvas');cv.width=32;cv.height=512;const c=cv.getContext('2d'),g=c.createLinearGradient(0,0,0,512);g.addColorStop(0,'#5366c9');g.addColorStop(.42,'#8ecbff');g.addColorStop(.77,'#ffd1dc');g.addColorStop(1,'#fff1bd');c.fillStyle=g;c.fillRect(0,0,32,512);const t=new THREE.CanvasTexture(cv);t.mapping=THREE.EquirectangularReflectionMapping;return t;}

  function addPlatform(x,y,z,w,d,color,opt={}){
    const h=opt.h||.72,m=meshSoft(w,h,d,color,Math.min(.25,h*.3));m.position.set(x,y,z);scene.add(m);cameraMeshes.push(m);
    const s={mesh:m,x,z,w,d,top:y+h*.5,enabled:true,kind:opt.kind||'platform',dx:0,dz:0};supports.push(s);return s;
  }
  function addCloud(x,y,z,s=1){const g=new THREE.Group();[[0,0,0,2.5],[2,0,.1,1.8],[-2,.05,.2,1.7],[.7,.45,0,1.7]].forEach(([px,py,pz,r])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r*s,10,7),mat(0xfffaff));m.position.set(px*s,py*s,pz*s);g.add(m);});g.position.set(x,y,z);scene.add(g);return g;}
  function addTree(x,z,c=0x5bd48a,s=1){const g=new THREE.Group(),tr=meshSoft(.8,3,.8,0xa97955,.2);tr.position.y=2;g.add(tr);const crown=meshSoft(3.2,3.5,3.2,c,.85);crown.position.y=4.4;g.add(crown);g.position.set(x,.45,z);g.scale.setScalar(s);scene.add(g);}
  function addCrystal(x,y,z,id){const g=new THREE.Group(),gem=new THREE.Mesh(new THREE.OctahedronGeometry(.8,0),new THREE.MeshStandardMaterial({color:0x74f5ff,emissive:0x248dff,emissiveIntensity:1.1,roughness:.25}));gem.scale.y=1.55;gem.position.y=1.25;g.add(gem);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05,.09,8,28),new THREE.MeshBasicMaterial({color:0xc9fbff,transparent:true,opacity:.75}));ring.rotation.x=Math.PI/2;ring.position.y=.35;g.add(ring);g.position.set(x,y,z);scene.add(g);checkpoints.push({id,g,gem,ring,pos:new THREE.Vector3(x,y,z),hit:false});}
  function addStar(x,y,z,en,th){const g=new THREE.Group(),gem=new THREE.Mesh(new THREE.OctahedronGeometry(.5,0),new THREE.MeshStandardMaterial({color:0xffe06b,emissive:0xff9f2b,emissiveIntensity:1.05,roughness:.24}));gem.scale.y=1.25;g.add(gem);const ring=new THREE.Mesh(new THREE.TorusGeometry(.72,.055,7,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7}));ring.rotation.x=Math.PI/2;g.add(ring);g.position.set(x,y,z);scene.add(g);stars.push({g,gem,ring,en,th,got:false,phase:Math.random()*TAU});}
  function clearLetterTokens(){letterTokens.forEach(o=>{scene.remove(o.g);disposeTree(o.g);});letterTokens=[];}
  function addLetterToken(ch,i,total){
    const a=i/total*TAU+.18,g=new THREE.Group(),gem=new THREE.Mesh(new THREE.OctahedronGeometry(.66,0),new THREE.MeshStandardMaterial({color:i%2?COLORS.cyan:COLORS.pink,emissive:i%2?0x176fa8:0xa62864,emissiveIntensity:.75,roughness:.28}));gem.scale.y=1.3;g.add(gem);
    const label=textSprite(ch,0xffffff,140,140);label.scale.set(1.35,1.35,1);label.position.y=1.45;g.add(label);g.position.set(Math.sin(a)*20,1.2,Math.cos(a)*20);scene.add(g);letterTokens.push({g,ch,active:true,phase:a});
  }
  function clearRaceGates(){raceGates.forEach(o=>{scene.remove(o.g);disposeTree(o.g);});raceGates=[];}
  function buildRaceGates(options){
    clearRaceGates();[-12,0,12].forEach((x,i)=>{const g=new THREE.Group(),left=meshSoft(.55,4,.75,[COLORS.pink,COLORS.cyan,COLORS.yellow][i],.2),right=left.clone(),top=meshSoft(6,.6,.75,[COLORS.pink,COLORS.cyan,COLORS.yellow][i],.2);left.position.set(-2.7,2,0);right.position.set(2.7,2,0);top.position.y=3.8;g.add(left,right,top);const label=textSprite(String(options[i]||'?').toUpperCase(),0xffffff,360,105);label.scale.set(4.2,1.2,1);label.position.y=5;g.add(label);g.position.set(x,.45,9);scene.add(g);raceGates.push({g,word:options[i]||'',x,z:9,hitAt:0});});
  }
  function buildVocabularyTower(){
    const cx=45,cz=1,colors=[COLORS.pink,COLORS.yellow,COLORS.mint,COLORS.cyan,COLORS.purple,0xff9e74];towerFloors=[];
    const core=meshSoft(2.1,20,2.1,0xf3e8ff,.5);core.position.set(cx,10.5,cz);scene.add(core);cameraMeshes.push(core);
    for(let i=0;i<TOWER_FLOORS;i++){
      const a=i*.92,x=cx+Math.sin(a)*(i?4.2:0),z=cz+Math.cos(a)*(i?4.2:0),y=1.2+i*3.35,s=addPlatform(x,y,z,7,6,colors[i],{kind:'tower'});
      const label=textSprite(`FLOOR ${i+1}`,0xffffff,300,90);label.scale.set(3.5,1.05,1);label.position.set(x,y+2,z);scene.add(label);
      towerFloors.push({floor:i,pos:new THREE.Vector3(x,s.top+.04,z),support:s});
    }
    const crown=new THREE.Mesh(new THREE.ConeGeometry(6.1,4.2,6),mat(0xffd968,'standard'));crown.position.set(cx,21.2,cz);crown.rotation.y=Math.PI/6;scene.add(crown);
    const sign=textSprite('🏰 VOCABULARY TOWER',0xfff1a3,620,120);sign.scale.set(8.2,1.6,1);sign.position.set(cx,7.2,cz+6);scene.add(sign);
  }
  function buildWorld(){
    supports=[];cameraMeshes=[];moving=[];rotators=[];checkpoints=[];stars=[];effects=[];letterTokens=[];raceGates=[];towerFloors=[];
    const island=new THREE.Mesh(new THREE.CylinderGeometry(35,39,4.2,48),mat(0x8bdc78));island.position.y=-1.65;scene.add(island);cameraMeshes.push(island);supports.push({kind:'island',top:.45,enabled:true});
    const plaza=new THREE.Mesh(new THREE.CylinderGeometry(25,25,.35,48),mat(0xfff0cd));plaza.position.y=.27;scene.add(plaza);cameraMeshes.push(plaza);
    const pathMat=mat(0x78d8ff);for(let i=0;i<8;i++){const a=i/8*TAU,m=new THREE.Mesh(new THREE.BoxGeometry(5,.12,16),pathMat);m.position.set(Math.sin(a)*15,.52,Math.cos(a)*15);m.rotation.y=a;scene.add(m);}
    const fountain=new THREE.Group(),basin=new THREE.Mesh(new THREE.CylinderGeometry(5,5,.65,32),mat(0x65cdf3));basin.position.y=.75;fountain.add(basin);const bowl=new THREE.Mesh(new THREE.CylinderGeometry(4.1,4.3,.35,32),mat(0xc9fbff));bowl.position.y=1.05;fountain.add(bowl);const col=meshSoft(1.1,4,1.1,0xf9d26b,.28);col.position.y=2.9;fountain.add(col);const star=textSprite('★',0xfff17a,160,160);star.scale.set(2.4,2.4,1);star.position.y=5.6;fountain.add(star);scene.add(fountain);cameraMeshes.push(basin,col);
    const sign=textSprite('VOCAB WORLD',0xffffff,720,160);sign.scale.set(11,2.45,1);sign.position.set(0,7,-7);scene.add(sign);
    [[-27,-18],[27,-17],[-28,13],[28,15],[-19,27],[19,27]].forEach((p,i)=>addTree(p[0],p[1],[0x64d67f,0xff87b7,0x7dd5ff,0xffc95c][i%4],.8+i%2*.12));
    addCloud(-28,18,-50,1.5);addCloud(35,28,-62,1.2);addCloud(-45,35,10,1.1);addCloud(46,22,28,1.3);
    // Giant original learning toys: book, pencil and ABC blocks.
    const book=new THREE.Group(),cover=meshSoft(7,.75,5.2,0x8d6cff,.3);cover.position.y=1.2;book.add(cover);const pages=meshSoft(6.4,.55,4.7,0xfff9e8,.22);pages.position.y=1.68;book.add(pages);book.position.set(-23,0,-5);book.rotation.y=.35;scene.add(book);
    const pencil=meshSoft(1.1,1.1,9,0xffcf52,.3);pencil.position.set(24,2,-3);pencil.rotation.set(0,.5,Math.PI/5);scene.add(pencil);
    ['A','B','C'].forEach((ch,i)=>{const b=meshSoft(3.2,3.2,3.2,[COLORS.pink,COLORS.cyan,COLORS.yellow][i],.5);b.position.set(-6+i*6,2.05,18);scene.add(b);const s=textSprite(ch,0xffffff,150,150);s.scale.set(1.8,1.8,1);s.position.set(-6+i*6,2.1,16.3);scene.add(s);});

    // Route: low -> medium -> high, with one moving, one rotating and one disappearing obstacle.
    addPlatform(0,1.2,-20,7,5,COLORS.pink,{kind:'start'});
    addPlatform(0,2.4,-27,7,5,COLORS.yellow,{kind:'gate'});
    addPlatform(-7,4,-34,6,5,COLORS.mint);
    const mv=addPlatform(-1,6,-40,6,4,COLORS.cyan,{kind:'moving'});mv.baseX=-1;mv.amp=5;mv.speed=.00075;moving.push(mv);
    addPlatform(7,8,-43,6,5,COLORS.purple);
    addPlatform(12,10.5,-36,5,5,COLORS.pink);
    const dis=addPlatform(8,13,-29,5,5,COLORS.yellow,{kind:'disappear'});dis.phase=0;moving.push(dis);
    addPlatform(1,15.5,-26,5,5,COLORS.mint);
    addPlatform(-6,18,-31,5,5,COLORS.cyan);
    addPlatform(-10,20.5,-23,5,5,COLORS.purple);
    const rotBase=addPlatform(-5,23,-16,7,7,COLORS.pink,{kind:'rotator'});const bar=meshSoft(11,.45,.65,0xff704f,.18);bar.position.set(-5,24,-16);scene.add(bar);rotators.push({mesh:bar,x:-5,y:24,z:-16,speed:.0012});
    addPlatform(3,26,-12,6,6,COLORS.yellow,{kind:'bounce'});
    addPlatform(10,29,-17,8,8,COLORS.mint,{kind:'finish'});
    // Branching shortcut cloud path.
    [[12,3,-22],[17,5,-28],[19,7,-36]].forEach((p,i)=>addPlatform(p[0],p[1],p[2],4.5,4.5,0xfff7ff,{kind:'shortcut'+i}));
    // Distant floating islands make the full playground readable from the plaza.
    [[-52,20,-35,10],[49,15,-41,8],[-45,30,35,7],[48,36,29,9]].forEach(([x,y,z,r],i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r+2,3,24),mat([0x8bdc78,0xffc5dc,0x80d8ff,0xb9a1ff][i]));m.position.set(x,y,z);scene.add(m);});
    buildVocabularyTower();

    addCrystal(0,.55,8,0);addCrystal(-7,4.38,-34,1);addCrystal(-10,20.88,-23,2);
    const words=wordPool();const spots=[[0,2.35,-20],[-7,5.2,-34],[7,9.2,-43],[1,16.7,-26],[-5,24.8,-16]];spots.forEach((p,i)=>{const w=words[i%words.length];addStar(p[0],p[1],p[2],w[0],w[1]);});
    gate={mesh:meshSoft(7.2,5.2,.8,0x6a5cff,.28),open:false,asked:false};gate.mesh.position.set(0,5,-30.1);scene.add(gate.mesh);cameraMeshes.push(gate.mesh);
    const gs=textSprite('VOCAB GATE',0xffffff,420,110);gs.scale.set(5.2,1.35,1);gs.position.set(0,8,-30);scene.add(gs);
    portal=new THREE.Group();const pr=new THREE.Mesh(new THREE.TorusGeometry(2.15,.32,10,38),new THREE.MeshStandardMaterial({color:0xffe378,emissive:0xff8f2a,emissiveIntensity:1.4}));pr.position.y=2.3;portal.add(pr);const ps=textSprite('FINISH',0xffffff,300,100);ps.scale.set(3.5,1.15,1);ps.position.y=5;portal.add(ps);portal.position.set(10,29.4,-17);scene.add(portal);
  }

  function baseWordPool(){let pool=(typeof vocabForStudent==='function'?vocabForStudent():[]).filter(x=>x&&/^[a-z]{3,10}$/i.test(x[0])&&x[1]);if(pool.length<8)pool=pool.concat([['cat','แมว'],['dog','สุนัข'],['book','หนังสือ'],['star','ดาว'],['apple','แอปเปิล'],['cloud','เมฆ'],['jump','กระโดด'],['friend','เพื่อน']]);return pool;}
  function hashText(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function wordPool(seed){const pool=baseWordPool().slice(),h=hashText(seed||Math.random());return pool.sort((a,b)=>(hashText(a[0]+h)-hashText(b[0]+h))).slice(0,8);}
  function buildPlayer(){
    const g=new THREE.Group(),fig=makeChibi(profileAvatar());g.add(fig);const sh=new THREE.Mesh(new THREE.CircleGeometry(.72,20),new THREE.MeshBasicMaterial({color:0x17326a,transparent:true,opacity:.24,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.02;g.add(sh);scene.add(g);
    player={group:g,fig,limbs:fig.userData.limbs,pos:g.position,vel:new THREE.Vector3(),facing:new THREE.Vector3(0,0,-1),yaw:0};spawnAtCheckpoint(false);
  }
  function petImage(p){if(!p)return '';if(typeof currentPetImg==='function'){const s=currentPetImg(p);if(s)return s;}const st=typeof petStage==='function'?petStage(p):(p.level>=3?'adult':p.level===2?'baby':'egg');return `img/${p.type}_${st}_normal.png`;}
  function buildPet(){const p=petInfo();if(!p)return;const g=new THREE.Group(),sh=new THREE.Mesh(new THREE.CircleGeometry(.55,20),new THREE.MeshBasicMaterial({color:0x17326a,transparent:true,opacity:.2,depthWrite:false}));sh.rotation.x=-Math.PI/2;g.add(sh);const spr=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false,alphaTest:.03}));spr.scale.set(p.type==='dragon'?2.6:2.05,p.type==='dragon'?2.6:2.05,1);spr.position.y=1.05;g.add(spr);texLoader.load(petImage(p),t=>{if('colorSpace'in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;spr.material.map=t;spr.material.needsUpdate=true;},undefined,()=>{});scene.add(g);petComp={group:g,spr,type:p.type,data:p,vel:new THREE.Vector3(),phase:Math.random()*TAU};g.position.copy(player.pos).add(new THREE.Vector3(-2,0,2));}

  function bindInput(){
    addListener(root.querySelector('#sp-exit'),'click',stop);addListener(root.querySelector('#sp-jump'),'pointerdown',e=>{e.preventDefault();jumpQueued=true;});addListener(root.querySelector('#sp-emote'),'pointerdown',e=>{e.preventDefault();emoteUntil=performance.now()+1800;netSend(true);showToast('👋 โบกมือให้เพื่อนแล้ว');});
    addListener(root.querySelector('#sp-play'),'click',openActivityMenu);addListener(root.querySelector('#sp-activity-close'),'click',closeActivityMenu);ui.activity.querySelectorAll('[data-activity]').forEach(b=>addListener(b,'click',()=>startActivity(b.dataset.activity)));
    addListener(ui.classBtn,'click',()=>classOffer&&activity==='plaza'?joinClassroom():openClassroom());addListener(ui.classClose,'click',closeClassroom);
    addListener(ui.joinLive,'click',joinLiveActivity);addListener(root.querySelector('#sp-tower-hear'),'click',()=>{if(towerQuestion&&typeof speakWord==='function')speakWord(towerQuestion.en);});
    addListener(window,'keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))keys.add(e.code);if(e.code==='Space'){e.preventDefault();jumpQueued=true;}if(e.code==='KeyE')emoteUntil=performance.now()+1800;});
    addListener(window,'keyup',e=>keys.delete(e.code));addListener(window,'resize',resize);addListener(document,'visibilitychange',()=>{if(document.hidden){keys.clear();joy.x=joy.z=0;}});
    const j=ui.joy,moveJoy=e=>{if(joy.id!==e.pointerId)return;const r=j.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=Math.max(1,Math.hypot(dx,dy)),lim=r.width*.34,k=Math.min(lim,m)/m;joy.x=clamp(dx/lim,-1,1);joy.z=clamp(dy/lim,-1,1);ui.joyKnob.style.transform=`translate(calc(-50% + ${dx*k}px),calc(-50% + ${dy*k}px))`;};
    const endJoy=e=>{if(joy.id!==e.pointerId)return;joy.id=null;joy.x=joy.z=0;ui.joyKnob.style.transform='translate(-50%,-50%)';};
    addListener(j,'pointerdown',e=>{e.preventDefault();joy.id=e.pointerId;j.setPointerCapture&&j.setPointerCapture(e.pointerId);moveJoy(e);});addListener(j,'pointermove',moveJoy);addListener(j,'pointerup',endJoy);addListener(j,'pointercancel',endJoy);
    addListener(canvas,'pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0&&e.button!==2)return;look={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId);});
    addListener(canvas,'pointermove',e=>{if(look.id!==e.pointerId)return;const dx=e.clientX-look.x,dy=e.clientY-look.y;look.x=e.clientX;look.y=e.clientY;camYaw-=dx*.006;camPitch=clamp(camPitch+dy*.004,.16,.8);});
    const endLook=e=>{if(look.id===e.pointerId)look.id=null;};addListener(canvas,'pointerup',endLook);addListener(canvas,'pointercancel',endLook);addListener(canvas,'contextmenu',e=>e.preventDefault());addListener(canvas,'wheel',e=>{camDist=clamp(camDist+Math.sign(e.deltaY)*.8,6.5,14);},{passive:true});
  }

  function supportAt(x,z,fromY,toY){let best=null,top=-Infinity;if(Math.hypot(x,z)<=34.5&&.45<=fromY+.4&&.45>=toY-.35){top=.45;best=supports[0];}for(const s of supports){if(!s.w||!s.enabled)continue;const sx=s.mesh.position.x,sz=s.mesh.position.z;if(Math.abs(x-sx)<=s.w*.5-.18&&Math.abs(z-sz)<=s.d*.5-.18&&s.top<=fromY+.42&&s.top>=toY-.42&&s.top>top){top=s.top;best=s;}}return best?{s:best,top}:null;}
  function blockedGate(nx,nz){return gate&&!gate.open&&Math.abs(nx)<4.2&&nz<-29.35&&nz>-30.85&&player.pos.y<8;}
  function updatePlayer(dt,t){
    if(paused)return;let ix=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+joy.x,iz=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+joy.z,len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;len=1;}
    const fx=-Math.sin(camYaw),fz=-Math.cos(camYaw),rx=Math.cos(camYaw),rz=-Math.sin(camYaw),dx=fx*(-iz)+rx*ix,dz=fz*(-iz)+rz*ix,targetX=dx*MOVE_SPEED,targetZ=dz*MOVE_SPEED,k=1-Math.pow(.0009,dt);
    player.vel.x+=(targetX-player.vel.x)*k;player.vel.z+=(targetZ-player.vel.z)*k;if(len<.05){player.vel.x*=Math.pow(.002,dt);player.vel.z*=Math.pow(.002,dt);}if(jumpQueued&&grounded){player.vel.y=JUMP_SPEED;grounded=false;lastSupport=null;tone(420,.1,.06);}jumpQueued=false;
    if(lastSupport&&lastSupport.kind==='moving'){player.pos.x+=lastSupport.dx||0;player.pos.z+=lastSupport.dz||0;}
    let nx=player.pos.x+player.vel.x*dt,nz=player.pos.z+player.vel.z*dt;if(blockedGate(nx,nz)){nx=player.pos.x;nz=player.pos.z;player.vel.x=player.vel.z=0;showGate();}
    player.pos.x=nx;player.pos.z=nz;const oldY=player.pos.y;player.vel.y-=GRAVITY*dt;let ny=oldY+player.vel.y*dt,hit=player.vel.y<=0?supportAt(nx,nz,oldY,ny):null;
    if(hit){ny=hit.top;player.vel.y=0;grounded=true;lastSupport=hit.s;if(hit.s.kind==='bounce'){player.vel.y=14.2;grounded=false;lastSupport=null;tone(620,.13,.06);showToast('✨ Jump Pad!');}}else{grounded=false;lastSupport=null;}player.pos.y=ny;
    if(player.pos.y<FALL_Y)respawn();
    const movingNow=Math.hypot(player.vel.x,player.vel.z)>.4;if(movingNow){player.facing.set(player.vel.x,0,player.vel.z).normalize();player.yaw=Math.atan2(-player.facing.x,-player.facing.z);player.group.rotation.y+=(player.yaw-player.group.rotation.y)*Math.min(1,dt*11);}
    const swing=movingNow?Math.sin(t*.014)*.72:0;player.limbs.forEach((l,i)=>{l.rotation.x+=(swing*(i%2?-1:1)-l.rotation.x)*Math.min(1,dt*14);});if(t<emoteUntil&&player.limbs[3])player.limbs[3].rotation.z=-1.7+Math.sin(t*.02)*.28;
  }
  function updateWorld(dt,t){
    for(const s of moving){s.dx=s.dz=0;if(s.kind==='moving'){const old=s.mesh.position.x,n=s.baseX+Math.sin(t*s.speed)*s.amp;s.mesh.position.x=n;s.x=n;s.dx=n-old;}else if(s.kind==='disappear'){const on=Math.sin(t*.0011)>-.25;s.enabled=on;s.mesh.visible=on;s.mesh.material.transparent=true;s.mesh.material.opacity=on?1:.16;}}
    rotators.forEach(r=>{const a=t*r.speed;r.mesh.rotation.y=a;const rx=player.pos.x-r.x,rz=player.pos.z-r.z,lx=rx*Math.cos(a)-rz*Math.sin(a),lz=rx*Math.sin(a)+rz*Math.cos(a);if(Math.abs(player.pos.y-r.y)<1.25&&Math.abs(lx)<5.6&&Math.abs(lz)<.7&&t-(r.hitAt||0)>900){r.hitAt=t;const sign=lz<0?-1:1;player.vel.x=Math.sin(a)*sign*8;player.vel.z=Math.cos(a)*sign*8;player.vel.y=5.2;grounded=false;showToast('🌈 แท่งหมุนดันออก—กระโดดข้ามได้!');tone(180,.12,.06);}});checkpoints.forEach(c=>{c.gem.rotation.y+=dt*1.7;c.ring.rotation.z-=dt*.9;const near=player.pos.distanceTo(c.pos)<2.1&&Math.abs(player.pos.y-c.pos.y)<2.4;if(near&&currentCheckpoint<c.id)activateCheckpoint(c);});
    stars.forEach(s=>{if(s.got)return;s.g.rotation.y+=dt*1.4;s.g.position.y+=Math.sin(t*.003+s.phase)*.0025;if(player.pos.distanceTo(s.g.position)<1.55)collectStar(s);});
    if(gate&&!gate.open&&player.pos.z<-27.2&&player.pos.z>-31.5&&Math.abs(player.pos.x)<4&&player.pos.y<8)showGate();
    if(portal){portal.rotation.y+=dt*.45;if(!routeFinished&&player.pos.distanceTo(portal.position.clone().add(new THREE.Vector3(0,1,0)))<2.8)finishRoute();}tickActivity(dt,t);
    for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.life-=dt;f.mesh.position.addScaledVector(f.vel,dt);f.mesh.scale.setScalar(Math.max(.02,f.life/f.max));if(f.mesh.material)f.mesh.material.opacity=Math.max(0,f.life/f.max);if(f.life<=0){scene.remove(f.mesh);disposeTree(f.mesh);effects.splice(i,1);}}
  }
  function updatePet(dt,t){if(!petComp)return;const flying=petComp.type==='dragon',back=player.facing.clone().multiplyScalar(-2.1),side=new THREE.Vector3(-player.facing.z,0,player.facing.x).multiplyScalar(1.05),goal=player.pos.clone().add(back).add(side);goal.y+=flying?1.15:0;const delta=goal.clone().sub(petComp.group.position),d=delta.length();if(d>10){petComp.group.position.copy(goal);petComp.vel.set(0,0,0);burst(petComp.group.position,COLORS.mint,8);}else{petComp.vel.addScaledVector(delta,dt*12);petComp.vel.multiplyScalar(Math.pow(.025,dt));petComp.group.position.addScaledVector(petComp.vel,dt);}const pace=Math.min(1,petComp.vel.length()/7);petComp.spr.position.y=1.05+Math.abs(Math.sin(t*.012+petComp.phase))*.16*pace+(flying?Math.sin(t*.004)*.18:0);petComp.spr.material.rotation=flying?Math.sin(t*.004)*.05:0;}

  function cameraTick(dt){const head=player.pos.clone().add(new THREE.Vector3(0,1.35,0)),cp=Math.cos(camPitch),desired=head.clone().add(new THREE.Vector3(Math.sin(camYaw)*cp*camDist,Math.sin(camPitch)*camDist+1.2,Math.cos(camYaw)*cp*camDist));let use=desired;const dir=desired.clone().sub(head),dist=dir.length(),ray=new THREE.Raycaster(head,dir.normalize(),.4,dist);const hit=ray.intersectObjects(cameraMeshes,false).find(h=>h.distance>.7);if(hit)use=head.clone().add(dir.multiplyScalar(Math.max(.7,hit.distance-.45)));camera.position.lerp(use,1-Math.pow(.0005,dt));camera.lookAt(head);}
  function activateCheckpoint(c){currentCheckpoint=c.id;c.hit=true;state.skyProgress.checkpoint=currentCheckpoint;if(activity==='obby'&&activityRound){activityRound.checkpoint=currentCheckpoint;saveActiveRun();}else saveState();if(typeof authPushSave==='function')authPushSave(false);c.gem.material.emissive.setHex(0x7dffae);showPop(`Checkpoint ${c.id+1}`,`Magic Vocabulary Crystal activated`);tone(660,.18,.08);setTimeout(()=>tone(880,.2,.07),70);burst(c.pos.clone().add(new THREE.Vector3(0,1,0)),COLORS.cyan,12);updateHud();netSend(true);}
  function respawn(){if(activity==='tower'&&activityRound){spawnTowerAt(activityRound.checkpoint);showToast(`💎 กลับมาที่ Tower Checkpoint ${activityRound.checkpoint}/${TOWER_FLOORS}`);return;}const old=currentCheckpoint;spawnAtCheckpoint(true);showToast(`💎 กลับมาที่ Checkpoint ${old+1}`);}
  function spawnAtCheckpoint(fx=true){const c=checkpoints[currentCheckpoint]||checkpoints[0],p=c?c.pos:new THREE.Vector3(0,.55,8);player.pos.set(p.x,p.y+.04,p.z+1.8);player.vel.set(0,0,0);grounded=false;if(fx)burst(player.pos.clone(),COLORS.cyan,10);if(petComp)petComp.group.position.copy(player.pos).add(new THREE.Vector3(-2,0,2));}
  function collectStar(s){s.got=true;scene.remove(s.g);sessionStars++;sessionCoins+=20;state.skyProgress.stars=(state.skyProgress.stars||0)+1;state.skyProgress.totalCoins=(state.skyProgress.totalCoins||0)+20;addCoins(20);if(typeof questEvent==='function')questEvent('word3d',1);saveState();showWord(s.en,s.th);if(typeof speakWord==='function')speakWord(s.en);tone(880,.16,.08);burst(s.g.position.clone(),COLORS.yellow,14);updateHud();netSend(true);}
  function finishRoute(){routeFinished=true;const key='rainbow',first=!state.skyDaily.routes[key],claim=activityRound&&activityRound.runId?`run_${activityRound.runId}`:'',already=claim&&state.skyDaily.claims[claim],reward=already?0:(first?100:20);state.skyDaily.routes[key]=true;if(claim)state.skyDaily.claims[claim]=Date.now();if(!state.skyDone.includes(key))state.skyDone.push(key);if(reward){addCoins(reward);sessionCoins+=reward;state.skyProgress.totalCoins=(state.skyProgress.totalCoins||0)+reward;}saveState();if(typeof authPushSave==='function')authPushSave(true);showPop(reward?`+${reward} Coins`:'Reward saved',first?'Rainbow Route complete!':reward?'โบนัสเล่นซ้ำวันนี้':'รอบนี้รับรางวัลแล้ว');tone(523,.35,.1);setTimeout(()=>tone(784,.35,.1),80);burst(portal.position.clone().add(new THREE.Vector3(0,2,0)),COLORS.yellow,22);if(activity==='obby'&&!activityDone)completeActivity('obby',false);updateHud();}
  function showGate(){if(!gate||gate.open||paused)return;if(!gateQuestion)gateQuestion=makeGateQuestion();paused=true;ui.gateQ.textContent=`Which word means “${gateQuestion.th}”?`;ui.gateFeedback.textContent='ตอบถูกเพื่อเปิดสะพาน · ตอบผิดลองใหม่ได้';ui.gateFeedback.className='';ui.gateOptions.innerHTML=gateQuestion.options.map(x=>`<button data-word="${esc(x)}">${esc(x.toUpperCase())}</button>`).join('');ui.gate.querySelectorAll('button').forEach(b=>addListener(b,'click',()=>answerGate(b.dataset.word)));ui.gate.classList.add('on');ui.gate.setAttribute('aria-hidden','false');}
  function makeGateQuestion(){const p=wordPool().slice(0,4),answer=p[0],options=[answer[0],p[1][0],p[2][0]].sort(()=>Math.random()-.5);return {en:answer[0],th:answer[1],options};}
  function answerGate(word){if(!gateQuestion||!gate)return;if(word.toLowerCase()!==gateQuestion.en.toLowerCase()){ui.gateFeedback.textContent='ยังไม่ใช่ครับ ลองอีกครั้งได้เลย';ui.gateFeedback.className='bad';tone(150,.12,.07);return;}const openedGate=gate;openedGate.open=true;paused=false;ui.gateFeedback.textContent=`ถูกต้อง! ${gateQuestion.en.toUpperCase()} = ${gateQuestion.th}`;ui.gateFeedback.className='good';if(typeof speakWord==='function')speakWord(gateQuestion.en);openedGate.mesh.material.transparent=true;openedGate.mesh.material.opacity=.16;setTimeout(()=>{if(ui.gate&&ui.gate.isConnected){ui.gate.classList.remove('on');ui.gate.setAttribute('aria-hidden','true');}if(openedGate.mesh)openedGate.mesh.visible=false;},700);showPop('Gate Open!',`${gateQuestion.en.toUpperCase()} = ${gateQuestion.th}`);tone(700,.24,.08);}

  /* ============================================================
     🏰🌞 รอบ 1231 — PHASE 3: TOWER + DAILY SKY MISSIONS
     claim ทุกรางวัลอยู่ใน save เดิม · ไม่เพิ่มฐานศัพท์/สกุลเงิน/Firebase path
     ============================================================ */
  function claimOnce(key,coins){
    if(state.skyDaily.claims[key])return 0;state.skyDaily.claims[key]=Date.now();
    if(coins>0){addCoins(coins);sessionCoins+=coins;state.skyProgress.totalCoins=(state.skyProgress.totalCoins||0)+coins;}return coins;
  }
  function unlockBadge(key){if(state.skyProgress.badges[key])return false;state.skyProgress.badges[key]=Date.now();return true;}
  function badgeText(){const b=state.skyProgress.badges,out=[];if(b.speed)out.push('⚡ เร็ว');if(b.accuracy)out.push('🎯 แม่น');if(b.coop)out.push('🤝 Co-op');return out.join(' · ')||'🏅 ยังไม่มี badge';}
  function renderDailyPanel(){
    if(!ui.daily)return;const missions=state.skyDaily.missions,done=missions.filter(m=>m.done).length;
    ui.dailyCount.textContent=`${done}/3`;ui.missions.innerHTML=missions.map(m=>{const meta=ACTIVITY_META[m.kind];return `<span class="${m.done?'done':''}"><b>${m.done?'✓':meta.icon}</b><i>${esc(meta.name)}</i><em>${Math.min(m.target,m.progress||0)}/${m.target}</em></span>`;}).join('');
    ui.badges.textContent=badgeText();ui.dailySummary.textContent=`Daily Sky ${done}/3 · โบนัสแรกวัน ${state.skyDaily.claims.daily_first?'✓ รับแล้ว':'+40 🪙'}`;
    ui.daily.classList.toggle('in-run',activity!=='plaza');ui.joinLive.hidden=!joinOffer||activity!=='plaza';if(joinOffer){const meta=ACTIVITY_META[joinOffer.kind];ui.joinLive.textContent=`🟢 JOIN ${meta.icon} ${meta.name}`;}
  }
  function recordDailyActivity(kind,time,peerCount){
    let bonus=claimOnce('daily_first',40),newBadge=[];const mission=state.skyDaily.missions.find(m=>m.kind===kind);
    if(mission&&!mission.done){mission.progress=Math.min(mission.target,(mission.progress||0)+1);mission.done=mission.progress>=mission.target;if(mission.done)bonus+=claimOnce(`mission_${kind}`,30);}
    if(state.skyDaily.missions.every(m=>m.done))bonus+=claimOnce('daily_all',100);
    const speedLimit={letter:30000,race:24000,obby:75000,tower:80000}[kind]||0;
    if(speedLimit&&time<=speedLimit&&unlockBadge('speed'))newBadge.push('⚡ Speed');
    if(activityRound&&activityRound.mistakes===0&&unlockBadge('accuracy'))newBadge.push('🎯 Accuracy');
    if(peerCount>0&&unlockBadge('coop'))newBadge.push('🤝 Co-op');
    saveState();if(typeof authPushSave==='function')authPushSave(true);renderDailyPanel();
    if(newBadge.length)setTimeout(()=>showToast(`🏅 ได้ Badge: ${newBadge.join(' · ')}`),250);return bonus;
  }
  function saveActiveRun(push=false){
    if(!activityRound||activityDone||!ACTIVITY_KINDS.includes(activity))return;
    state.skyDaily.active={kind:activity,seed:activityRound.seed,runId:activityRound.runId,score:activityRound.score,progress:activityRound.progress,question:activityRound.question||0,checkpoint:activityRound.checkpoint||0,mistakes:activityRound.mistakes||0,elapsed:Math.round(activityElapsed())};
    saveState();if(push&&typeof authPushSave==='function')authPushSave(false);
  }
  function clearActiveRun(){if(state.skyDaily.active&&activityRound&&state.skyDaily.active.runId===activityRound.runId)state.skyDaily.active=null;}
  function restoreActiveRun(){const a=state.skyDaily.active;if(!a||!ACTIVITY_KINDS.includes(a.kind)||!a.runId)return false;startActivity(a.kind,{resume:a});showToast(`🔄 กลับเข้า ${ACTIVITY_META[a.kind].name} จาก checkpoint เดิม`);return true;}

  function towerPool(floor){
    const minLen=floor<2?3:floor<4?5:6,pool=baseWordPool().filter(w=>w[0].length>=minLen);return (pool.length>=5?pool:baseWordPool()).slice().sort((a,b)=>hashText(activityRound.seed+floor+a[0])-hashText(activityRound.seed+floor+b[0]));
  }
  function makeTowerQuestion(floor){
    const pool=towerPool(floor),answer=pool[0],count=floor<2?3:4,reverse=floor>=3,options=pool.slice(0,count).sort((a,b)=>hashText(activityRound.seed+'opt'+floor+a[0])-hashText(activityRound.seed+'opt'+floor+b[0]));
    return {floor,en:answer[0],th:answer[1],answer:reverse?answer[1]:answer[0],options:options.map(w=>reverse?w[1]:w[0]),prompt:reverse?`“${answer[0].toUpperCase()}” แปลว่าอะไร?`:`Which word means “${answer[1]}”?`};
  }
  function spawnTowerAt(floor){const f=towerFloors[clamp(floor,0,TOWER_FLOORS-1)];if(!f)return;player.pos.copy(f.pos);player.vel.set(0,0,0);grounded=false;if(petComp)petComp.group.position.copy(player.pos).add(new THREE.Vector3(-2,0,2));}
  function showTowerQuestion(){
    if(activity!=='tower'||activityDone)return;towerQuestion=makeTowerQuestion(activityRound.progress);paused=true;ui.towerLevel.textContent=`ชั้น ${activityRound.progress+1}/${TOWER_FLOORS} · ${towerQuestion.options.length} ตัวเลือก`;ui.towerQ.textContent=towerQuestion.prompt;ui.towerFeedback.textContent='ตอบผิดลองใหม่ได้ · ไม่เสียเหรียญ';ui.towerFeedback.className='';ui.towerOptions.innerHTML=towerQuestion.options.map((x,i)=>`<button data-i="${i}">${esc(x)}</button>`).join('');ui.towerOptions.querySelectorAll('button').forEach(b=>addListener(b,'click',()=>answerTower(Number(b.dataset.i))));ui.tower.classList.add('on');ui.tower.setAttribute('aria-hidden','false');
  }
  function answerTower(index){
    if(!towerQuestion||activity!=='tower'||activityDone)return false;const picked=towerQuestion.options[index];
    if(picked!==towerQuestion.answer){activityRound.mistakes++;ui.towerFeedback.textContent='ยังไม่ใช่ครับ — ลองใหม่ได้ทันที ไม่ลดชั้น ไม่หักเหรียญ';ui.towerFeedback.className='bad';tone(150,.1,.05);saveActiveRun();return false;}
    if(typeof speakWord==='function')speakWord(towerQuestion.en);if(typeof questEvent==='function')questEvent('word3d',1);activityRound.score++;activityRound.progress++;ui.towerFeedback.textContent=`ถูกต้อง! ${towerQuestion.en.toUpperCase()} = ${towerQuestion.th}`;ui.towerFeedback.className='good';tone(760,.16,.07);
    if(activityRound.progress%2===0){activityRound.checkpoint=activityRound.progress;state.skyProgress.towerCheckpoint=Math.max(state.skyProgress.towerCheckpoint,activityRound.checkpoint);showPop(`Tower Checkpoint ${activityRound.checkpoint}/${TOWER_FLOORS}`,'💎 กลับมาต่อจากชั้นนี้ได้');}
    saveActiveRun();if(activityRound.progress>=TOWER_FLOORS){ui.tower.classList.remove('on');ui.tower.setAttribute('aria-hidden','true');paused=false;towerQuestion=null;completeActivity('tower');return true;}
    spawnTowerAt(activityRound.progress);setTimeout(()=>{if(running&&activity==='tower'&&!activityDone)showTowerQuestion();},280);return true;
  }
  function kindFromMode(mode){return mode==='L'?'letter':mode==='R'?'race':mode==='O'?'obby':mode==='T'?'tower':null;}
  function considerJoinOffer(uid,d){const p=parseActivity(d),kind=p&&kindFromMode(p.mode);if(!kind||!p.seed||activity!=='plaza')return;joinOffer={uid,kind,seed:p.seed};renderDailyPanel();}
  function joinLiveActivity(){if(!joinOffer)return;const offer=joinOffer;joinOffer=null;startActivity(offer.kind,{seed:offer.seed,joined:true});showToast(`🤝 Join-in-progress: ${ACTIVITY_META[offer.kind].name}`);}

  /* ============================================================
     🏫☁️ รอบ 1233 — PHASE 4: CLASSROOM SKY EVENTS
     ครูเลือกคำจาก vocab เดิม + เวลา + โหมด; config ส่งทาง cw เดิม (<=60)
     คะแนน/ความคืบหน้าส่งทาง hp เดิม (<=28) · ไม่เพิ่ม path/เงิน/ฐานศัพท์
     ============================================================ */
  function classroomPool(){
    const seen=new Set();return baseWordPool().filter(w=>w&&/^[a-z]{3,8}$/i.test(w[0])&&!seen.has(w[0].toLowerCase())&&seen.add(w[0].toLowerCase())).sort((a,b)=>a[0].localeCompare(b[0])).slice(0,8);
  }
  function classModeByCode(code){return Object.keys(CLASS_MODES).find(k=>CLASS_MODES[k].code===code)||'meaning';}
  function classPair(word){return baseWordPool().find(w=>w[0].toLowerCase()===String(word).toLowerCase())||[word,word];}
  function makeClassWire(round){return `C4|${round.eventId}|${CLASS_MODES[round.mode].code}|${round.seconds}|${round.words.join(',')}`;}
  function parseClassWire(value){
    const p=String(value||'').split('|');if(p.length!==5||p[0]!=='C4'||!/^[a-z0-9]{3,6}$/i.test(p[1])||!/^[MLS]$/.test(p[2])||!CLASS_TIMES.includes(Number(p[3])))return null;
    const words=p[4].split(',').map(w=>w.toLowerCase()).filter(w=>/^[a-z]{3,8}$/.test(w));if(words.length<CLASS_MIN_WORDS||words.length>CLASS_MAX_WORDS||new Set(words).size!==words.length)return null;
    return {eventId:p[1],mode:classModeByCode(p[2]),seconds:Number(p[3]),words};
  }
  function openClassroom(){if(!ui.classroom||paused&&activity!=='classroom')return;paused=true;ui.classroom.classList.add('on');ui.classroom.setAttribute('aria-hidden','false');if(activity==='classroom'&&activityRound)renderClassroom(true);else renderClassroomSetup();}
  function closeClassroom(){
    if(activity==='classroom'&&activityRound&&!classFinished&&activityRound.role==='student'){showToast('🏫 ทำกิจกรรมให้จบก่อนครับ');return;}
    if(classFinished){endClassroom();return;}ui.classroom.classList.remove('on');ui.classroom.setAttribute('aria-hidden','true');paused=false;
  }
  function renderClassroomSetup(){
    classView='setup';ui.classTitle.textContent='ครูสร้างกิจกรรมห้องเรียน';ui.classClose.hidden=false;const pool=classroomPool();
    ui.classBody.innerHTML=`<div class="sp-class-setup"><section><b>① เลือกคำ ${CLASS_MIN_WORDS}–${CLASS_MAX_WORDS} คำ</b><div class="sp-class-words">${pool.map((w,i)=>`<label><input type="checkbox" data-class-word value="${esc(w[0])}" ${i<4?'checked':''}><span>${esc(w[0].toUpperCase())}<small>${esc(w[1])}</small></span></label>`).join('')}</div></section><section class="sp-class-controls"><label><b>② โหมด</b><select id="sp-class-mode">${Object.keys(CLASS_MODES).map(k=>`<option value="${k}">${CLASS_MODES[k].name}</option>`).join('')}</select></label><label><b>③ เวลา</b><select id="sp-class-time">${CLASS_TIMES.map(n=>`<option value="${n}" ${n===60?'selected':''}>${n} วินาที</option>`).join('')}</select></label><button class="sp-class-start" id="sp-class-start">🚀 เริ่มห้องกิจกรรม</button><small>${coopReady()?'🟢 เพื่อนในสวนนี้จะเห็นปุ่ม JOIN CLASS':'🟡 กำลังใช้โหมดทดลองเดี่ยว · ล็อกอินเพื่อเชิญนักเรียน'}</small></section></div>`;
    ui.classBody.querySelector('#sp-class-start').onclick=startClassroomHost;
  }
  function startClassroomHost(){
    const words=Array.from(ui.classBody.querySelectorAll('[data-class-word]:checked')).map(x=>x.value);if(words.length<CLASS_MIN_WORDS||words.length>CLASS_MAX_WORDS){showToast(`เลือก ${CLASS_MIN_WORDS}–${CLASS_MAX_WORDS} คำครับ`);return;}
    const mode=ui.classBody.querySelector('#sp-class-mode').value,seconds=Number(ui.classBody.querySelector('#sp-class-time').value),eventId=Date.now().toString(36).slice(-5);activity='classroom';activityDone=false;classFinished=false;classRoster={};activityStartedAt=performance.now();activityRound={role:'host',eventId,mode,seconds,words,score:0,progress:0,mistakes:0};classWire=makeClassWire(activityRound);if(classWire.length>60){showToast('คำที่เลือกยาวเกินไป ลดจำนวนคำลงครับ');activity='plaza';activityRound=null;return;}ui.classroom.classList.add('on');paused=true;netSend(true);renderClassroom(true);updateHud();showToast('🏫 เปิดห้องแล้ว · รอนักเรียนกด JOIN CLASS');
  }
  function considerClassOffer(uid,d){
    const config=parseClassWire(d&&d.cw),p=parseActivity(d);if(!config||!p||p.mode!=='H'||p.seed!==config.eventId||activity!=='plaza')return;classOffer={uid,config,elapsed:p.time};updateClassButton();
  }
  function joinClassroom(){
    if(!classOffer)return;const o=classOffer;classOffer=null;activity='classroom';activityDone=false;classFinished=false;classRoster={};activityRound={role:'student',eventId:o.config.eventId,mode:o.config.mode,seconds:o.config.seconds,words:o.config.words,score:0,progress:0,mistakes:0,question:0,lastFeedback:''};activityStartedAt=performance.now()-Math.max(0,o.elapsed*100);classWire='';paused=true;ui.classroom.classList.add('on');ui.classroom.setAttribute('aria-hidden','false');makeClassQuestion();netSend(true);renderClassroom(true);updateHud();showToast('🏫 เข้าห้องแล้ว · ตอบได้จนหมดเวลา');
  }
  function classTimeLeft(){return activityRound?Math.max(0,activityRound.seconds*1000-activityElapsed()):0;}
  function misspell(word,step){
    const a=word.split(''),i=(hashText(word+step)%(a.length-1));[a[i],a[i+1]]=[a[i+1],a[i]];let out=a.join('');if(out===word){a[i]=String.fromCharCode(97+(a[i].charCodeAt(0)-96)%26);out=a.join('');}return out;
  }
  function makeClassQuestion(){
    if(!activityRound||activityRound.role!=='student')return;const i=activityRound.question||0,word=activityRound.words[i%activityRound.words.length],pair=classPair(word),mode=activityRound.mode;let prompt,options;
    if(mode==='meaning'){prompt=`คำไหนแปลว่า “${pair[1]}”?`;options=activityRound.words.slice();}
    else if(mode==='listen'){prompt='🔊 ฟังแล้วเลือกคำที่ได้ยิน';options=activityRound.words.slice();setTimeout(()=>{if(running&&activity==='classroom'&&!classFinished&&typeof speakWord==='function')speakWord(word);},80);}
    else{prompt=`เลือกคำที่สะกดถูก: ${pair[1]}`;options=[word,misspell(word,1),misspell(word,2)];}
    options=Array.from(new Set(options)).sort((a,b)=>hashText(activityRound.eventId+i+a)-hashText(activityRound.eventId+i+b));activityRound.current={word,pair,prompt,options};
  }
  function answerClassroom(word){
    if(activity!=='classroom'||classFinished||!activityRound||activityRound.role!=='student'||!activityRound.current)return;const correct=String(word).toLowerCase()===activityRound.current.word.toLowerCase();activityRound.progress++;if(correct){activityRound.score++;activityRound.lastFeedback=`✅ ${activityRound.current.word.toUpperCase()} = ${activityRound.current.pair[1]}`;tone(760,.12,.06);}else{activityRound.mistakes++;activityRound.lastFeedback=`💡 คำตอบคือ ${activityRound.current.word.toUpperCase()}`;tone(150,.1,.05);}activityRound.question++;makeClassQuestion();netSend(true);renderClassroom(true);
  }
  function classRows(){
    if(!activityRound)return [];const rows=Object.values(classRoster);if(activityRound.role==='student')rows.push({uid:myUid,n:String(state.profileName||'ฉัน'),score:activityRound.score,progress:activityRound.progress,time:Math.round(activityElapsed()/100),mine:true});
    return rows.sort((a,b)=>b.score-a.score||b.progress-a.progress||a.time-b.time).slice(0,ROOM_MAX-1);
  }
  function rememberClassPeer(uid,d){const p=parseActivity(d);if(activity==='classroom'&&activityRound&&p&&p.mode==='C'&&p.seed===activityRound.eventId)classRoster[uid]={uid,n:String(d.n||'นักเรียน'),score:p.score,progress:p.progress,time:p.time};}
  function classResultHtml(rows){
    if(!rows.length)return '<p class="sp-class-wait">🟢 รอนักเรียนกด JOIN CLASS…</p>';return `<div class="sp-class-results"><header><b>ชื่อ</b><b>ถูก/ตอบ</b><b>แม่นยำ</b><b>เวลา</b></header>${rows.map((r,i)=>{const acc=r.progress?Math.round(r.score/r.progress*100):0;return `<div class="${r.mine?'me':''}"><b>${i+1}. ${esc(r.n)}</b><span>${r.score}/${r.progress}</span><span>${acc}%</span><span>${fmtTime(r.time*100)}</span></div>`;}).join('')}</div>`;
  }
  function renderClassroom(force=false){
    if(!ui.classBody||activity!=='classroom'||!activityRound)return;const now=performance.now();if(!force&&now-(ui.classBody._at||0)<180)return;ui.classBody._at=now;const left=Math.ceil(classTimeLeft()/1000),mode=CLASS_MODES[activityRound.mode],rows=classRows();ui.classClose.hidden=!classFinished&&activityRound.role==='student';
    if(classFinished){classView='summary';ui.classTitle.textContent='📊 ผลสรุปชั้นเรียน';ui.classBody.innerHTML=`<div class="sp-class-summary"><div class="sp-class-kpis"><b>${mode.name}</b><span>⏱ ${activityRound.seconds} วินาที</span><span>👥 ${rows.length} นักเรียน</span></div>${classResultHtml(rows)}<button class="sp-class-done" id="sp-class-done">✓ ปิดผลสรุป</button></div>`;ui.classBody.querySelector('#sp-class-done').onclick=endClassroom;return;}
    classView='live';ui.classTitle.textContent=activityRound.role==='host'?`🟢 กิจกรรมกำลังเล่น · ${left}s}`:`${mode.name} · ${left}s`;
    if(activityRound.role==='host'){ui.classBody.innerHTML=`<div class="sp-class-live"><div class="sp-class-kpis"><b>${mode.name}</b><span>📚 ${activityRound.words.map(w=>esc(w.toUpperCase())).join(' · ')}</span><span>⏱ ${left}s</span></div>${classResultHtml(rows)}<button class="sp-class-finish" id="sp-class-finish">📊 จบและดูผลสรุปตอนนี้</button><p>ผลจะอัปเดตสดจากนักเรียนสูงสุด 5 คน</p></div>`;ui.classBody.querySelector('#sp-class-finish').onclick=finishClassroom;}
    else{const q=activityRound.current;ui.classBody.innerHTML=`<div class="sp-class-question"><div class="sp-class-kpis"><b>⏱ ${left}s</b><span>✅ ${activityRound.score}/${activityRound.progress}</span><span>🎯 ${activityRound.progress?Math.round(activityRound.score/activityRound.progress*100):0}%</span></div><h3>${esc(q.prompt)}</h3>${activityRound.mode==='listen'?'<button class="sp-class-hear" id="sp-class-hear">🔊 ฟังอีกครั้ง</button>':''}<div class="sp-class-options">${q.options.map(w=>`<button data-class-answer="${esc(w)}">${esc(w.toUpperCase())}</button>`).join('')}</div><p>${esc(activityRound.lastFeedback||'ตอบได้เรื่อยๆ จนหมดเวลา · ไม่หักเหรียญ')}</p></div>`;ui.classBody.querySelectorAll('[data-class-answer]').forEach(b=>b.onclick=()=>answerClassroom(b.dataset.classAnswer));const hear=ui.classBody.querySelector('#sp-class-hear');if(hear)hear.onclick=()=>typeof speakWord==='function'&&speakWord(q.word);}
  }
  function finishClassroom(){if(classFinished||activity!=='classroom')return;classFinished=true;activityDone=true;paused=true;netSend(true);renderClassroom(true);updateHud();tone(784,.25,.07);showToast('📊 หมดเวลา · เปิดผลสรุปชั้นเรียนแล้ว');}
  function tickClassroom(){if(activity!=='classroom'||!activityRound)return false;if(!classFinished&&classTimeLeft()<=0)finishClassroom();renderClassroom();return true;}
  function endClassroom(){
    const wasHost=activityRound&&activityRound.role==='host';activity='plaza';activityRound=null;activityStartedAt=0;activityDone=false;classFinished=false;classWire='';classRoster={};classView='setup';paused=false;ui.classroom.classList.remove('on');ui.classroom.setAttribute('aria-hidden','true');if(wasHost)netSend(true);updateClassButton();updateHud();
  }
  function updateClassButton(){if(!ui.classBtn)return;const join=classOffer&&activity==='plaza';ui.classBtn.textContent=join?'🟢 JOIN CLASS':'🏫 CLASS';ui.classBtn.classList.toggle('live',!!join);}

  /* ============================================================
     🎮☁️ รอบ 1230 — PHASE 2 SHARED ACTIVITIES
     Letter Hunt co-op · Word Race · timed multiplayer Sky Obby
     ใช้ hp payload เดิมของ NetRoom — ไม่เพิ่ม Firebase path
     ============================================================ */
  function openActivityMenu(){if(activity==='classroom'){openClassroom();return;}if(!ui.activity||paused)return;paused=true;ui.activity.classList.add('on');ui.activity.setAttribute('aria-hidden','false');}
  function closeActivityMenu(){if(!ui.activity)return;ui.activity.classList.remove('on');ui.activity.setAttribute('aria-hidden','true');paused=false;}
  function activitySeed(kind){return `${kind}-${state.skyDaily.date}`;}
  function startActivity(kind,opt={}){
    if(!ACTIVITY_KINDS.includes(kind))return;classWire='';classFinished=false;clearLetterTokens();clearRaceGates();if(ui.tower){ui.tower.classList.remove('on');ui.tower.setAttribute('aria-hidden','true');}towerQuestion=null;paused=false;const resume=opt.resume||null;activity=kind;activityStartedAt=performance.now()-Math.max(0,Number(resume&&resume.elapsed)||0);activityDone=false;routeFinished=false;
    const seed=String(resume&&resume.seed||opt.seed||activitySeed(kind)),words=wordPool(seed);activityRound={seed,runId:String(resume&&resume.runId||`${kind}:${state.skyDaily.date}:${Date.now()}:${Math.random().toString(36).slice(2,7)}`),score:Number(resume&&resume.score)||0,progress:Number(resume&&resume.progress)||0,penalty:0,words,word:words[0],question:Number(resume&&resume.question)||0,checkpoint:Number(resume&&resume.checkpoint)||0,mistakes:Number(resume&&resume.mistakes)||0,joined:!!opt.joined};
    if(kind==='letter'){
      const chars=words[0][0].toUpperCase().split(''),decoys='AEIOULRSTN'.split('').filter(c=>!chars.includes(c)).slice(0,Math.max(3,10-chars.length)),tokens=chars.concat(decoys).sort((a,b)=>hashText(seed+a)-hashText(seed+b));tokens.forEach((ch,i)=>addLetterToken(ch,i,tokens.length));player.pos.set(0,.55,8);player.vel.set(0,0,0);showToast(`🔤 ช่วยกันหาตัวอักษรคำว่า ${words[0][0].toUpperCase()}`);
      for(let i=0;i<activityRound.progress;i++){const token=letterTokens.find(o=>o.active&&o.ch===chars[i]);if(token){token.active=false;token.g.visible=false;}}
    }else if(kind==='race'){
      setupRaceQuestion();player.pos.set(0,.55,27);player.vel.set(0,0,0);showToast('🏁 วิ่งผ่านประตูคำตอบที่ถูกต้อง 3 ด่าน!');
    }else if(kind==='obby'){
      currentCheckpoint=resume?clamp(activityRound.checkpoint,0,2):0;state.skyProgress.checkpoint=currentCheckpoint;spawnAtCheckpoint(false);showToast('☁️ Sky Obby เริ่มแล้ว—รีบไปที่ FINISH!');
    }else{
      activityRound.progress=clamp(activityRound.progress,0,TOWER_FLOORS-1);activityRound.checkpoint=clamp(activityRound.checkpoint,0,TOWER_FLOORS);spawnTowerAt(activityRound.progress);showToast('🏰 ตอบศัพท์เพื่อพิชิตหอคอย 6 ชั้น · ผิดได้ไม่เสียเหรียญ');
    }
    closeActivityMenu();if(kind==='tower')showTowerQuestion();saveActiveRun();updateActivityHud(performance.now(),true);renderDailyPanel();netSend(true);
  }
  function raceQuestion(){const q=activityRound.question,w=activityRound.words,answer=w[(q*2)%w.length],opts=[answer[0],w[(q*2+1)%w.length][0],w[(q*2+3)%w.length][0]];return {answer,options:opts.sort((a,b)=>hashText(activityRound.seed+q+a)-hashText(activityRound.seed+q+b))};}
  function setupRaceQuestion(){const q=raceQuestion();activityRound.current=q;buildRaceGates(q.options);}
  function activityElapsed(){return activityStartedAt?Math.max(0,performance.now()-activityStartedAt+(activityRound?activityRound.penalty||0:0)):0;}
  function fmtTime(ms){return `${(ms/1000).toFixed(1)}s`;}
  function activityCode(){return activity==='letter'?'L':activity==='race'?'R':activity==='obby'?'O':activity==='tower'?'T':'P';}
  function parseActivity(d){const p=String(d&&d.hp||'').split(':');if(!['S2','S3','S4'].includes(p[0]))return null;return {version:p[0],mode:p[1],score:Number(p[2])||0,progress:Number(p[3])||0,time:Number(p[4])||0,seed:p.slice(5).join(':')};}
  function activityRows(){
    const mode=activityCode(),rows=[{uid:myUid,n:String(state.profileName||'ฉัน'),score:activityRound?activityRound.score:0,progress:activityRound?activityRound.progress:0,time:Math.round(activityElapsed()/100),mine:true}];
    for(const uid in peers){const p=parseActivity(peers[uid]);if(p&&p.mode===mode&&activityRound&&p.seed===activityRound.seed)rows.push({uid,n:String(peers[uid].n||'เพื่อน'),score:p.score,progress:p.progress,time:p.time});}
    return rows.sort((a,b)=>b.score-a.score||b.progress-a.progress||a.time-b.time);
  }
  function updateActivityHud(t,force=false){
    if(!ui.score||(!force&&t-(ui.score._at||0)<180))return;ui.score._at=t;
    if(activity==='plaza'||!activityRound){ui.challenge.textContent='Daily Sky Missions';ui.progress.textContent=`${state.skyDaily.missions.filter(m=>m.done).length}/3 · ${badgeText()}`;ui.score.classList.remove('on');return;}
    if(activity==='classroom'){const rows=classRows(),left=Math.ceil(classTimeLeft()/1000);ui.challenge.textContent=`Classroom · ${CLASS_MODES[activityRound.mode].name}`;ui.progress.textContent=classFinished?`📊 สรุป ${rows.length} นักเรียน`:`⏱ ${left}s · 👥 ${rows.length}/${ROOM_MAX-1}`;ui.score.innerHTML=rows.map((r,i)=>`<span class="${r.mine?'me':''}"><b>${i+1}</b> ${esc(r.n)} <i>${r.score}/${r.progress}</i></span>`).join('');ui.score.classList.toggle('on',rows.length>0);return;}
    const rows=activityRows(),mine=rows.findIndex(r=>r.mine)+1;ui.score.innerHTML=rows.slice(0,6).map((r,i)=>`<span class="${r.mine?'me':''}"><b>${i+1}</b> ${esc(r.n)} <i>${activity==='letter'?r.progress+'/'+activityRound.word[0].length:activity==='race'?r.score+'/3':activity==='tower'?r.progress+'/'+TOWER_FLOORS:fmtTime(r.time*100)}</i></span>`).join('');ui.score.classList.add('on');
    if(activity==='letter'){
      const team=rows.reduce((n,r)=>n+Math.min(activityRound.word[0].length,r.progress),0),goal=activityRound.word[0].length*rows.length;ui.challenge.textContent=`Letter Hunt · ${activityRound.word[0].toUpperCase()}`;ui.progress.textContent=`TEAM ${team}/${goal} · ${activityRound.word[1]}`;
    }else if(activity==='race'){
      const q=activityRound.current;ui.challenge.textContent=`Word Race · ${activityRound.score}/3`;ui.progress.textContent=q?`Which word means “${q.answer[1]}”? · ${fmtTime(activityElapsed())}`:'';
    }else if(activity==='obby'){ui.challenge.textContent=`Sky Obby · #${mine||1}`;ui.progress.textContent=`${fmtTime(activityElapsed())} · 💎 CP ${currentCheckpoint+1}/3`;}
    else{ui.challenge.textContent=`Vocabulary Tower · ชั้น ${Math.min(TOWER_FLOORS,activityRound.progress+1)}/${TOWER_FLOORS}`;ui.progress.textContent=`💎 CP ${activityRound.checkpoint}/${TOWER_FLOORS} · ผิด ${activityRound.mistakes} · ${fmtTime(activityElapsed())}`;}
  }
  function activityReward(kind,firstReward,repeatReward){const key=`activity_${kind}`,claim=`run_${activityRound.runId}`,first=!state.skyDaily.routes[key],fresh=!state.skyDaily.claims[claim],reward=fresh?(first?firstReward:repeatReward):0;state.skyDaily.routes[key]=true;state.skyDaily.claims[claim]=Date.now();if(fresh)state.skyProgress.activities[kind]=(state.skyProgress.activities[kind]||0)+1;if(reward){addCoins(reward);sessionCoins+=reward;state.skyProgress.totalCoins=(state.skyProgress.totalCoins||0)+reward;}saveState();if(typeof authPushSave==='function')authPushSave(true);return reward;}
  function completeActivity(kind,reward=true){
    if(activityDone)return;activityDone=true;const time=activityElapsed(),peerCount=Math.max(0,activityRows().length-1);activityRound.score=kind==='letter'?activityRound.word[0].length:kind==='race'?3:kind==='tower'?TOWER_FLOORS:Math.max(1,9999-Math.round(time/10));activityRound.progress=kind==='obby'?3:activityRound.progress;
    let coins=0;if(reward)coins=activityReward(kind,kind==='letter'?60:kind==='race'?80:120,kind==='letter'?10:kind==='race'?15:20);else state.skyProgress.activities[kind]=(state.skyProgress.activities[kind]||0)+1;clearActiveRun();const dailyBonus=recordDailyActivity(kind,time,peerCount),meta=ACTIVITY_META[kind];if(kind!=='obby')showPop(`+${coins+dailyBonus} Coins`,`${meta.name} complete · ${fmtTime(time)}`);else showPop(`Sky Obby ${fmtTime(time)}`,dailyBonus?`Daily bonus +${dailyBonus} 🪙`:'Finish! เช็กอันดับด้านขวา');tone(784,.3,.09);setTimeout(()=>tone(1047,.25,.07),90);burst(player.pos.clone().add(new THREE.Vector3(0,1,0)),COLORS.yellow,20);updateHud();updateActivityHud(performance.now(),true);netSend(true);
  }
  function tickActivity(dt,t){
    if(tickClassroom()){updateActivityHud(t);return;}
    if(activity==='plaza'||!activityRound||activityDone){updateActivityHud(t);return;}
    if(activity==='letter'){
      const expected=activityRound.word[0][activityRound.progress].toUpperCase();for(const o of letterTokens){if(!o.active)continue;o.g.rotation.y+=dt*1.5;o.g.position.y=1.2+Math.sin(t*.003+o.phase)*.22;if(player.pos.distanceTo(o.g.position)<1.5){if(o.ch===expected){o.active=false;o.g.visible=false;activityRound.progress++;activityRound.score++;showWord(o.ch,activityRound.word[1]);tone(880,.12,.07);saveActiveRun();if(activityRound.progress>=activityRound.word[0].length)completeActivity('letter');else showToast(`เก่งมาก! ตัวต่อไป: ${activityRound.word[0][activityRound.progress].toUpperCase()}`);netSend(true);}else{activityRound.mistakes++;saveActiveRun();showToast(`ตอนนี้ต้องหาตัว ${expected}`);tone(150,.1,.05);o.g.position.x*=-.98;o.g.position.z*=-.98;}break;}}
    }else if(activity==='race'){
      for(const g of raceGates){if(t-g.hitAt<900||Math.abs(player.pos.x-g.x)>3.1||Math.abs(player.pos.z-g.z)>1.8)continue;g.hitAt=t;const q=activityRound.current;if(g.word.toLowerCase()===q.answer[0].toLowerCase()){activityRound.score++;activityRound.progress=activityRound.score;if(typeof speakWord==='function')speakWord(q.answer[0]);showPop(`${q.answer[0].toUpperCase()} = ${q.answer[1]}`,`Gate ${activityRound.score}/3`);tone(720,.16,.07);if(activityRound.score>=3)completeActivity('race');else{activityRound.question++;setupRaceQuestion();player.pos.set(0,.55,27);player.vel.set(0,0,0);saveActiveRun();}}else{activityRound.mistakes++;activityRound.penalty+=2000;saveActiveRun();showToast('❌ ผิดประตู +2 วินาที');tone(150,.12,.06);player.pos.set(0,.55,27);player.vel.set(0,0,0);}netSend(true);break;}
    }
    updateActivityHud(t);
  }

  function coopReady(){return typeof Online!=='undefined'&&Online.ready&&Online.db&&typeof NetRoom!=='undefined'&&typeof onlineKey==='function';}
  function setupOnline(){myUid=coopReady()?onlineKey():'local';if(!coopReady()){ui.online.textContent='โหมดฝึกเดี่ยว · ล็อกอินเพื่อพบเพื่อน';return;}room=NetRoom.create({map:'sky',roomMax:ROOM_MAX,sendMs:190,push:()=>netSend(true),onPeer,onPeerGone,onStatus:updateOnline,toast:html=>{const d=document.createElement('div');d.innerHTML=html;showToast(d.textContent||'อัปเดตสนาม');},roomNoun:'สวนลอยฟ้า',roomIcon:'☁️',roomFmt:i=>'สวนลอยฟ้า '+i});room.join();updateOnline();}
  function netSend(force){if(!room||!player)return;const elapsed=Math.min(99999,Math.round(activityElapsed()/100));let hp=`S3:${activityCode()}:${activityRound?activityRound.score:0}:${activity==='obby'?currentCheckpoint:(activityRound?activityRound.progress:0)}:${elapsed}:${activityRound?activityRound.seed:'plaza'}`;if(activity==='classroom'&&activityRound)hp=`S4:${activityRound.role==='host'?'H':'C'}:${activityRound.score||0}:${activityRound.progress||0}:${elapsed}:${activityRound.eventId}`;room.send({n:String(state.profileName||'นักสำรวจ').slice(0,40),x:+player.pos.x.toFixed(2),y:+player.pos.y.toFixed(2),z:+player.pos.z.toFixed(2),yaw:+player.group.rotation.y.toFixed(3),av:profileAvatar(),m:performance.now()<emoteUntil?1:0,w:sessionStars,cw:classWire||'',hp},!!force);}
  function onPeer(uid,d){peers[uid]=d||{};if(!peerActors[uid])buildPeer(uid,d||{});const a=peerActors[uid];if(a){a.target.set(Number(d.x)||0,Number(d.y)||0,Number(d.z)||0);a.yaw=Number(d.yaw)||0;a.data=d||{};}considerJoinOffer(uid,d||{});considerClassOffer(uid,d||{});rememberClassPeer(uid,d||{});updateOnline();updateActivityHud(performance.now(),true);if(activity==='classroom')renderClassroom(true);}
  function onPeerGone(uid){delete peers[uid];removePeer(uid);if(joinOffer&&joinOffer.uid===uid){joinOffer=null;for(const other in peers){considerJoinOffer(other,peers[other]);if(joinOffer)break;}renderDailyPanel();}if(classOffer&&classOffer.uid===uid){classOffer=null;for(const other in peers){considerClassOffer(other,peers[other]);if(classOffer)break;}updateClassButton();}updateOnline();updateActivityHud(performance.now(),true);if(activity==='classroom')renderClassroom(true);}
  function buildPeer(uid,d){const g=new THREE.Group(),fig=makeChibi(/^blk/.test(d.av||'')?d.av:'blk1');g.add(fig);const name=textSprite(String(d.n||'เพื่อน').slice(0,18),0xffffff,420,100);name.scale.set(3.4,.82,1);name.position.y=2.35;g.add(name);scene.add(g);return peerActors[uid]={group:g,fig,limbs:fig.userData.limbs,target:new THREE.Vector3(Number(d.x)||0,Number(d.y)||0,Number(d.z)||0),yaw:Number(d.yaw)||0,data:d,phase:Math.random()*TAU};}
  function removePeer(uid){const a=peerActors[uid];if(!a)return;scene.remove(a.group);disposeTree(a.group);delete peerActors[uid];}
  function tickOnline(t,dt){if(room){room.tick(t);if(t-lastNetAt>190){lastNetAt=t;netSend(false);}}if(t-lastPeerBudget>500){lastPeerBudget=t;drawPeerBudget();}for(const uid in peerActors){const a=peerActors[uid],before=a.group.position.clone();a.group.position.lerp(a.target,1-Math.pow(.0004,dt));a.group.rotation.y+=(a.yaw-a.group.rotation.y)*Math.min(1,dt*8);const moving=before.distanceTo(a.group.position)>.012,swing=moving?Math.sin(t*.013+a.phase)*.65:0;a.limbs.forEach((l,i)=>l.rotation.x+=(swing*(i%2?-1:1)-l.rotation.x)*Math.min(1,dt*12));if(Number(a.data.m)&&a.limbs[3])a.limbs[3].rotation.z=-1.6+Math.sin(t*.02)*.25;}}
  function drawPeerBudget(){if(typeof NetRoom==='undefined')return;NetRoom.drawBudget({peers,max:ROOM_MAX-1,slack:0,margin:.8,dist:(u)=>peerActors[u]?player.pos.distanceTo(peerActors[u].group.position):999,isDrawn:p=>{const u=Object.keys(peers).find(k=>peers[k]===p);return !!peerActors[u];},show:(u,p)=>buildPeer(u,p),hide:u=>removePeer(u)});}
  function updateOnline(){if(!ui.online)return;updateClassButton();if(!room){ui.online.textContent='โหมดฝึกเดี่ยว · ล็อกอินเพื่อพบเพื่อน';return;}ui.online.textContent=room.online?`ออนไลน์ ${Math.min(ROOM_MAX,room.count)}/${ROOM_MAX} คน · ${room.roomLabel}`:'กำลังเชื่อมต่อสวนออนไลน์…';}

  function updateHud(){if(!root)return;ui.coins.textContent=fmt(state.coins||0);renderDailyPanel();if(activity==='plaza')ui.progress.textContent=`Daily ${state.skyDaily.missions.filter(m=>m.done).length}/3 · ⭐ ${sessionStars}/5`;else updateActivityHud(performance.now(),true);}
  function showWord(en,th){ui.word.querySelector('b').textContent=String(en).toUpperCase();ui.word.querySelector('span').textContent=`${th} · +20 Coins`;ui.word.classList.add('on');clearTimeout(ui.word._t);ui.word._t=setTimeout(()=>ui.word.classList.remove('on'),1700);}
  function showPop(big,small){ui.pop.querySelector('b').textContent=big;ui.pop.querySelector('span').textContent=small;ui.pop.classList.add('on');clearTimeout(ui.pop._t);ui.pop._t=setTimeout(()=>ui.pop.classList.remove('on'),1900);}
  function showToast(text){ui.toast.textContent=text;ui.toast.classList.add('on');clearTimeout(ui.toast._t);ui.toast._t=setTimeout(()=>ui.toast.classList.remove('on'),2400);}
  function tone(freq,dur=.12,vol=.07){if(!running||!root||!state.sound)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(60,freq*.65),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+dur+.03);}catch(e){}}
  function burst(pos,color,n=10){if(fxLow)n=Math.ceil(n*.45);for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.09,0),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,depthWrite:false}));m.position.copy(pos);scene.add(m);const a=Math.random()*TAU,v=new THREE.Vector3(Math.cos(a)*(1+Math.random()*2),1+Math.random()*2.5,Math.sin(a)*(1+Math.random()*2)),life=.45+Math.random()*.3;effects.push({mesh:m,vel:v,life,max:life});}}
  function resize(){if(!renderer||!camera)return;renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
  function perfStats(){if(!renderer||!scene)return null;let objects=0,meshes=0,visibleMeshes=0,sprites=0;scene.traverse(o=>{objects++;if(o.isMesh){meshes++;if(o.visible)visibleMeshes++;}if(o.isSprite&&o.visible)sprites++;});return {calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,objects,meshes,visibleMeshes,sprites,children:scene.children.length,effects:effects.length};}
  function disposeTree(obj){if(!obj)return;obj.traverse&&obj.traverse(o=>{if(o.userData&&o.userData.ownTexture)o.userData.ownTexture.dispose();if(o.geometry&&!o.geometry.userData.shared)o.geometry.dispose();if(o.material&&!Object.values(matCache).includes(o.material)){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m.map&&m.map!==scene.background)m.map.dispose();m.dispose();});}});}

  function loop(t){if(!running)return;raf=requestAnimationFrame(loop);const dt=Math.min(.034,lastFrame?(t-lastFrame)/1000:.016);lastFrame=t;updateWorld(dt,t);updatePlayer(dt,t);updatePet(dt,t);tickOnline(t,dt);cameraTick(dt);renderer.render(scene,camera);}
  function start(){if(running)return;ensureState();fxLow=!!state.noAnim||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);if(typeof clearWarnToasts==='function')clearWarnToasts();if(typeof Music!=='undefined')Music.suspendBg();createDom();initThree();running=true;paused=false;activity='plaza';activityRound=null;activityStartedAt=0;activityDone=false;routeFinished=false;sessionCoins=0;sessionStars=0;joinOffer=null;classOffer=null;classWire='';classFinished=false;classRoster={};setupOnline();updateHud();if(!restoreActiveRun())showToast('🎮 PLAY 4 กิจกรรม · 🏫 CLASS สร้างกิจกรรมห้องเรียน');lastFrame=0;raf=requestAnimationFrame(loop);}
  function stop(){if(!running)return;if(activityRound&&!activityDone)saveActiveRun();running=false;paused=false;cancelAnimationFrame(raf);raf=0;listeners.splice(0).forEach(fn=>{try{fn();}catch(e){}});keys.clear();if(room){room.leave();room=null;}Object.keys(peerActors).forEach(removePeer);peers={};peerActors={};if(typeof speechSynthesis!=='undefined')try{speechSynthesis.cancel();}catch(e){};saveState();if(typeof authPushSave==='function')authPushSave(true);if(scene)disposeTree(scene);if(scene&&scene.background)scene.background.dispose();if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();renderer.setSize(2,2,false);}if(root)root.remove();root=canvas=renderer=scene=camera=clock=null;player=petComp=portal=gate=null;supports=[];moving=[];rotators=[];checkpoints=[];stars=[];effects=[];letterTokens=[];raceGates=[];towerFloors=[];towerQuestion=null;joinOffer=null;classOffer=null;classWire='';classFinished=false;classRoster={};activity='plaza';activityRound=null;if(audioCtx){try{audioCtx.close();}catch(e){}audioCtx=null;}if(typeof Music!=='undefined')Music.resumeBg();if(typeof renderDashboard==='function')renderDashboard();if(typeof toast==='function')toast(`☁️ กลับจาก Vocab Sky Playground · เก็บ ${sessionStars} คำ · +${fmt(sessionCoins)} 🪙`);}

  window.SkyPlayground3D={start,stop,_t:{get running(){return running},get player(){return player},get pet(){return petComp},get stars(){return stars},get checkpoints(){return checkpoints},get towerFloors(){return towerFloors},get towerQuestion(){return towerQuestion},get gate(){return gate},get room(){return room},get peers(){return peers},get camera(){return camera},get activity(){return activity},get activityRound(){return activityRound},get letters(){return letterTokens},get raceGates(){return raceGates},get joinOffer(){return joinOffer},get classOffer(){return classOffer},get classWire(){return classWire},get classFinished(){return classFinished},get daily(){return state.skyDaily},perf:perfStats,resize,frame:(ms=16)=>{const t=performance.now();updateWorld(ms/1000,t);updatePlayer(ms/1000,t);updatePet(ms/1000,t);cameraTick(ms/1000);renderer.render(scene,camera);},fall:()=>{player.pos.y=FALL_Y-1;updatePlayer(.016,performance.now());},checkpoint:i=>activateCheckpoint(checkpoints[clamp(i,0,2)]),openGate:showGate,answer:w=>answerGate(w),answerTower,openClass:openClassroom,startClass:startClassroomHost,joinClass:joinClassroom,answerClass:answerClassroom,finishClass:finishClassroom,endClass:endClassroom,joinLive:joinLiveActivity,finish:finishRoute,collect:i=>stars[i]&&collectStar(stars[i]),startActivity,peer:onPeer,gone:onPeerGone}};
})();
