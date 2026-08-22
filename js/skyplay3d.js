"use strict";
/* ============================================================
   ☁️📚 รอบ 1235 — VOCAB SKY PLAYGROUND · PHASE 5
   Bright Fantasy Social World + Obby ของ Vocab World
   - standalone Three.js engine: ไม่แตะ Adventure World / Invasion
   - Soft Cuboid Chibi 3D + pet จริง + NetRoom สูงสุด 6 คน
   - Letter Hunt, Word Race, Sky Obby, Vocabulary Tower, Daily Missions
   - Classroom Sky Events เดิม + Teacher Lesson Packs, playlists, ready check, reports
   ============================================================ */
(function(){
  const TAU=Math.PI*2, ROOM_MAX=6, FALL_Y=-14, GRAVITY=29, MOVE_SPEED=8.2, JUMP_SPEED=11.2, TOWER_FLOORS=6;
  const ACTIVITY_KINDS=['letter','race','obby','tower'];
  const ACTIVITY_META={letter:{icon:'🔤',name:'Letter Hunt'},race:{icon:'🏁',name:'Word Race'},obby:{icon:'☁️',name:'Sky Obby'},tower:{icon:'🏰',name:'Vocabulary Tower'}};
  const CLASS_MIN_WORDS=3,CLASS_MAX_WORDS=5,CLASS_TIMES=[30,60,90];
  const CLASS_MODES={meaning:{code:'M',name:'🎯 เลือกความหมาย'},listen:{code:'L',name:'🔊 ฟังแล้วเลือก'},spell:{code:'S',name:'✏️ เลือกสะกดถูก'}};
  const TEACHER_STORE_KEY='vocabSkyTeacher_v1',REPORT_ALPH='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
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
  let classOffer=null,classWire='',classFinished=false,classView='setup',classRoster={},classHostUid='',classReportSaved=false,teacherData=null;
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

  /* ============================================================
     👩‍🏫📋 รอบ 1235 — PHASE 5: LOCAL TEACHER DATA
     lesson packs / active reconnect / reports อยู่ฝั่งเครื่อง · ไม่เพิ่ม Firebase path
     ============================================================ */
  function cleanTeacherData(raw){
    const out={packs:[],reports:[],active:null,host:null},src=raw&&typeof raw==='object'?raw:{};
    if(Array.isArray(src.packs))out.packs=src.packs.slice(0,20).map(p=>({id:String(p.id||''),name:String(p.name||'ชุดคำศัพท์').slice(0,32),words:Array.isArray(p.words)?p.words.filter(w=>/^[a-z]{3,8}$/i.test(w)).slice(0,CLASS_MAX_WORDS):[],playlist:Array.isArray(p.playlist)?p.playlist.filter(k=>CLASS_MODES[k]).slice(0,3):[],seconds:CLASS_TIMES.includes(Number(p.seconds))?Number(p.seconds):60,updatedAt:Number(p.updatedAt)||Date.now()})).filter(p=>p.id&&p.words.length>=CLASS_MIN_WORDS&&p.playlist.length);
    if(Array.isArray(src.reports))out.reports=src.reports.slice(0,20).filter(r=>r&&r.eventId&&Array.isArray(r.rows)&&Array.isArray(r.words));
    if(src.active&&typeof src.active==='object'&&src.active.eventId)out.active=src.active;
    if(src.host&&typeof src.host==='object'&&src.host.eventId&&Array.isArray(src.host.words)&&Array.isArray(src.host.playlist))out.host=src.host;return out;
  }
  function loadTeacherData(){try{return cleanTeacherData(JSON.parse(localStorage.getItem(TEACHER_STORE_KEY)||'null'));}catch(e){return cleanTeacherData(null);}}
  function persistTeacherData(){try{localStorage.setItem(TEACHER_STORE_KEY,JSON.stringify(teacherData||cleanTeacherData(null)));return true;}catch(e){showToast('⚠️ พื้นที่เก็บข้อมูลเต็ม · ยังเล่นต่อได้');return false;}}
  function saveStudentResume(){
    if(!teacherData||!activityRound||activityRound.role!=='student'||!activityRound.eventId)return;
    teacherData.active={eventId:activityRound.eventId,score:activityRound.score||0,progress:activityRound.progress||0,mistakes:activityRound.mistakes||0,step:activityRound.step||0,question:activityRound.question||0,answerLog:String(activityRound.answerLog||'').slice(-48),ready:!!activityRound.ready};persistTeacherData();
  }
  function clearStudentResume(eventId){if(teacherData&&teacherData.active&&(!eventId||teacherData.active.eventId===eventId)){teacherData.active=null;persistTeacherData();}}
  function saveHostResume(force=false){
    if(!teacherData||!activityRound||activityRound.role!=='host'||activityRound.version!=='C5')return;if(!force&&Date.now()-(saveHostResume._at||0)<1000)return;saveHostResume._at=Date.now();teacherData.host={eventId:activityRound.eventId,name:activityRound.name,words:activityRound.words.slice(),playlist:lessonModes().slice(),seconds:activityRound.seconds,phase:activityRound.phase,step:activityRound.step||0,startedAt:activityRound.phase==='run'?Date.now()-activityElapsed():0,roster:classRoster,updatedAt:Date.now()};persistTeacherData();
  }
  function clearHostResume(eventId){if(teacherData&&teacherData.host&&(!eventId||teacherData.host.eventId===eventId)){teacherData.host=null;persistTeacherData();}}
  function restoreHostLesson(){
    const h=teacherData&&teacherData.host;if(!h||!['ready','run'].includes(h.phase)||Date.now()-(Number(h.updatedAt)||0)>30*60*1000)return false;const elapsed=h.phase==='run'?Math.max(0,Date.now()-(Number(h.startedAt)||Date.now())):0,total=h.seconds*h.playlist.length*1000;if(elapsed>total+60000){clearHostResume(h.eventId);return false;}activity='classroom';activityDone=false;classFinished=false;classRoster=h.roster&&typeof h.roster==='object'?h.roster:{};classReportSaved=false;classHostUid=myUid;activityRound={version:'C5',role:'host',phase:h.phase,step:clamp(h.step||Math.floor(elapsed/(h.seconds*1000)),0,h.playlist.length-1),eventId:h.eventId,name:h.name||'บทเรียน Sky',words:h.words,playlist:h.playlist,mode:h.playlist[0],seconds:h.seconds,score:0,progress:0,mistakes:0};activityStartedAt=h.phase==='run'?performance.now()-elapsed:0;classWire=makeClassWire(activityRound);paused=true;ui.classroom.classList.add('on');ui.classroom.setAttribute('aria-hidden','false');netSend(true);renderClassroom(true);updateHud();showToast('🔄 ครูกลับเข้า lesson เดิมจากเครื่องนี้');return true;
  }

  function createDom(){
    const old=document.getElementById('sp-root');if(old)old.remove();
    root=document.createElement('div');root.id='sp-root';root.innerHTML=`
      <canvas id="sp-canvas" aria-label="Vocab Sky Playground 3D"></canvas>
      <div class="sp-sky-glow"></div>
      <div class="sp-top">
        <button class="sp-pill sky-exit" id="sp-exit">← Exit</button>
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
      <div class="sky-hint" id="sp-hint">WASD เดิน · Space กระโดด · ลากฉากเพื่อหมุนกล้อง</div>
      <div class="sky-word" id="sp-word"><b>STAR</b><span>ดาว</span></div>
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
    const [skin,shirt,pants,hair]=avatarColors(id),g=new THREE.Group(),parts={legs:[],arms:[],hands:[]};
    g.userData.limbs=[];g.userData.parts=parts;g.userData.playerStyle='soft-cuboid-chibi-3d';
    [-1,1].forEach((s,i)=>{const p=new THREE.Group(),leg=meshSoft(.28,.43,.36,pants,.11);p.position.set(s*.17,.48,-.025);p.userData.swingSign=i?-1:1;leg.position.y=-.21;leg.name=`player-leg-${i?'right':'left'}`;p.add(leg);g.add(p);parts.legs.push(p);g.userData.limbs.push(p);});
    const torso=meshSoft(.68,.6,.45,shirt,.16);torso.position.y=.83;torso.name='player-torso';g.add(torso);
    [-1,1].forEach((s,i)=>{const p=new THREE.Group(),sleeve=meshSoft(.22,.3,.25,shirt,.09),hand=meshSoft(.2,.25,.21,skin,.085);p.position.set(s*.45,1.09,0);p.rotation.z=s*-.08;p.userData.swingSign=i?1:-1;p.userData.restZ=p.rotation.z;p.userData.kind='arm';sleeve.position.y=-.14;hand.position.y=-.415;sleeve.name=`player-arm-${i?'right':'left'}`;hand.name=`player-hand-${i?'right':'left'}`;p.add(sleeve,hand);g.add(p);parts.arms.push(p);parts.hands.push(hand);g.userData.limbs.push(p);});
    const head=meshSoft(.78,.68,.65,skin,.2);head.position.y=1.42;head.name='player-head';g.add(head);
    [-1,1].forEach((s,i)=>{const eye=meshSoft(.1,.14,.045,0x172442,.035);eye.position.set(s*.145,1.465,-.327);eye.name=`player-eye-${i?'right':'left'}`;g.add(eye);});
    const smile=new THREE.Mesh(new THREE.TorusGeometry(.09,.015,5,12,Math.PI),mat(0xa34e54,'basic')),hairTop=meshSoft(.8,.17,.67,hair,.075),hairBack=meshSoft(.72,.34,.14,hair,.06);smile.position.set(0,1.3,-.338);smile.rotation.z=Math.PI;hairTop.position.y=1.73;hairBack.position.set(0,1.54,.305);smile.name='player-smile';g.add(smile,hairTop,hairBack);return g;
  }
  function makePetChibi(type){
    type=['dog','cat','dragon'].includes(type)?type:'cat';const palette=type==='dog'?[0xc98752,0xffe0b0,0x69402e]:type==='dragon'?[0x65d9b5,0xd9fff1,0x347f87]:[0xf3a15f,0xffe2bd,0x985333];
    const [fur,cream,dark]=palette,g=new THREE.Group(),legs=[],tail=[],wings=[];g.userData.petStyle='soft-cuboid-chibi-3d';g.userData.legs=legs;g.userData.tail=tail;g.userData.wings=wings;
    [[-.22,-.2],[.22,-.2],[-.22,.2],[.22,.2]].forEach(([x,z],i)=>{const p=new THREE.Group(),leg=meshSoft(.22,.37,.27,i<2?dark:fur,.09);p.position.set(x,.38,z);leg.position.y=-.18;p.add(leg);p.name=`pet-leg-${i}`;g.add(p);legs.push(p);});
    const body=meshSoft(.67,.64,.71,fur,.21),head=meshSoft(.76,.62,.66,fur,.21);body.position.y=.65;head.position.y=1.09;g.add(body,head);[-1,1].forEach(s=>{const eye=meshSoft(.105,.14,.045,0x17324c,.04);eye.position.set(s*.15,1.16,-.335);g.add(eye);});
    if(type!=='dragon'){const muzzle=meshSoft(.35,.2,.12,cream,.06);muzzle.position.set(0,1.01,-.37);g.add(muzzle);[-1,1].forEach(s=>{const ear=meshSoft(type==='dog'?.22:.25,type==='dog'?.38:.31,.19,type==='dog'?dark:fur,.07);ear.position.set(s*(type==='dog'?.39:.24),type==='dog'?1.2:1.43,.01);ear.rotation.z=s*(type==='dog'?.13:-.24);g.add(ear);});}
    else [-1,1].forEach(s=>{const horn=meshSoft(.13,.31,.14,0xffd86f,.045);horn.position.set(s*.23,1.43,.04);horn.rotation.z=s*-.28;g.add(horn);const wing=new THREE.Group(),panel=meshSoft(.13,.52,.58,0x8ff0d9,.06);wing.position.set(s*.42,.76,.2);wing.rotation.z=s*-.52;panel.rotation.x=.24;wing.add(panel);g.add(wing);wings.push(wing);});
    const tailRoot=new THREE.Group(),tailMesh=meshSoft(.18,.18,.6,type==='dragon'?0xffd86f:dark,.075);tailRoot.position.set(0,.66,.38);tailMesh.position.z=.27;tailRoot.add(tailMesh);g.add(tailRoot);tail.push(tailRoot);return g;
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
    const g=new THREE.Group(),fig=makeChibi(profileAvatar()),sh=new THREE.Mesh(new THREE.CircleGeometry(.72,20),new THREE.MeshBasicMaterial({color:0x17326a,transparent:true,opacity:.18,depthWrite:false}));g.add(fig);sh.rotation.x=-Math.PI/2;sh.position.y=.02;sh.name='player-contact-shadow';g.add(sh);scene.add(g);
    player={group:g,fig,limbs:fig.userData.limbs,pos:g.position,vel:new THREE.Vector3(),facing:new THREE.Vector3(0,0,-1),yaw:0};spawnAtCheckpoint(false);
  }
  function buildPet(){const p=petInfo();if(!p)return;const g=new THREE.Group(),model=makePetChibi(p.type),stage=typeof petStage==='function'?petStage(p):(p.level>=3?'adult':p.level===2?'baby':'egg'),scale=stage==='adult'?1:stage==='baby'?.88:.76,sh=new THREE.Mesh(new THREE.CircleGeometry(.52,20),new THREE.MeshBasicMaterial({color:0x17326a,transparent:true,opacity:.15,depthWrite:false}));model.scale.setScalar(scale);g.add(model);sh.rotation.x=-Math.PI/2;sh.position.y=.015;sh.name='pet-contact-shadow';g.add(sh);scene.add(g);petComp={group:g,model,type:p.type,data:p,vel:new THREE.Vector3(),phase:Math.random()*TAU,yaw:0,legs:model.userData.legs,tail:model.userData.tail,wings:model.userData.wings};g.position.copy(player.pos).add(new THREE.Vector3(-2,0,2));}
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
    const swing=movingNow?Math.sin(t*.014)*.72:0;player.limbs.forEach(l=>{const target=swing*(Number(l.userData.swingSign)||1);l.rotation.x+=(target-l.rotation.x)*Math.min(1,dt*14);});const rightArm=player.fig.userData.parts.arms[1];if(t<emoteUntil)rightArm.rotation.z=-1.7+Math.sin(t*.02)*.28;else rightArm.rotation.z+=(rightArm.userData.restZ-rightArm.rotation.z)*Math.min(1,dt*12);
  }
  function updateWorld(dt,t){
    for(const s of moving){s.dx=s.dz=0;if(s.kind==='moving'){const old=s.mesh.position.x,n=s.baseX+Math.sin(t*s.speed)*s.amp;s.mesh.position.x=n;s.x=n;s.dx=n-old;}else if(s.kind==='disappear'){const on=Math.sin(t*.0011)>-.25;s.enabled=on;s.mesh.visible=on;s.mesh.material.transparent=true;s.mesh.material.opacity=on?1:.16;}}
    rotators.forEach(r=>{const a=t*r.speed;r.mesh.rotation.y=a;const rx=player.pos.x-r.x,rz=player.pos.z-r.z,lx=rx*Math.cos(a)-rz*Math.sin(a),lz=rx*Math.sin(a)+rz*Math.cos(a);if(Math.abs(player.pos.y-r.y)<1.25&&Math.abs(lx)<5.6&&Math.abs(lz)<.7&&t-(r.hitAt||0)>900){r.hitAt=t;const sign=lz<0?-1:1;player.vel.x=Math.sin(a)*sign*8;player.vel.z=Math.cos(a)*sign*8;player.vel.y=5.2;grounded=false;showToast('🌈 แท่งหมุนดันออก—กระโดดข้ามได้!');tone(180,.12,.06);}});checkpoints.forEach(c=>{c.gem.rotation.y+=dt*1.7;c.ring.rotation.z-=dt*.9;const near=player.pos.distanceTo(c.pos)<2.1&&Math.abs(player.pos.y-c.pos.y)<2.4;if(near&&currentCheckpoint<c.id)activateCheckpoint(c);});
    stars.forEach(s=>{if(s.got)return;s.g.rotation.y+=dt*1.4;s.g.position.y+=Math.sin(t*.003+s.phase)*.0025;if(player.pos.distanceTo(s.g.position)<1.55)collectStar(s);});
    if(gate&&!gate.open&&player.pos.z<-27.2&&player.pos.z>-31.5&&Math.abs(player.pos.x)<4&&player.pos.y<8)showGate();
    if(portal){portal.rotation.y+=dt*.45;if(!routeFinished&&player.pos.distanceTo(portal.position.clone().add(new THREE.Vector3(0,1,0)))<2.8)finishRoute();}tickActivity(dt,t);
    for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.life-=dt;f.mesh.position.addScaledVector(f.vel,dt);f.mesh.scale.setScalar(Math.max(.02,f.life/f.max));if(f.mesh.material)f.mesh.material.opacity=Math.max(0,f.life/f.max);if(f.life<=0){scene.remove(f.mesh);disposeTree(f.mesh);effects.splice(i,1);}}
  }
  function updatePet(dt,t){if(!petComp)return;const flying=petComp.type==='dragon',back=player.facing.clone().multiplyScalar(-2.1),side=new THREE.Vector3(-player.facing.z,0,player.facing.x).multiplyScalar(1.05),goal=player.pos.clone().add(back).add(side),delta=goal.clone().sub(petComp.group.position),d=delta.length();if(d>10){petComp.group.position.copy(goal);petComp.vel.set(0,0,0);burst(petComp.group.position,COLORS.mint,8);}else{petComp.vel.addScaledVector(delta,dt*12);petComp.vel.multiplyScalar(Math.pow(.025,dt));petComp.group.position.addScaledVector(petComp.vel,dt);}const speed=petComp.vel.length(),pace=Math.min(1,speed/7),wave=t*.012+petComp.phase;if(speed>.18){petComp.yaw=Math.atan2(-petComp.vel.x,-petComp.vel.z);petComp.group.rotation.y+=(petComp.yaw-petComp.group.rotation.y)*Math.min(1,dt*8);}petComp.model.position.y=flying?1.15+Math.sin(t*.004+petComp.phase)*.12:Math.abs(Math.sin(wave))*.09*pace;petComp.legs.forEach((l,i)=>{l.rotation.x+=(Math.sin(wave)*(i%2?-1:1)*.4*pace-l.rotation.x)*Math.min(1,dt*12);});petComp.tail.forEach(tail=>tail.rotation.y=Math.sin(t*.008+petComp.phase)*.38);petComp.wings.forEach((wing,i)=>wing.rotation.z=(i?1:-1)*(.48+Math.sin(t*.013+petComp.phase)*.18));}
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
     🏫☁️ รอบ 1233 — PHASE 4: CLASSROOM SKY EVENTS (คง C4/S4 เดิม)
     👩‍🏫📊 รอบ 1235 — PHASE 5: LESSON PACKS + CLASSROOM REPORTS
     C5/S5 เพิ่ม playlist/ready/reconnect/late join ผ่าน cw+hp เดิม · ไม่เพิ่ม path/เงิน/ฐานศัพท์
     ============================================================ */
  function classroomPool(){
    const seen=new Set();return baseWordPool().filter(w=>w&&/^[a-z]{3,8}$/i.test(w[0])&&!seen.has(w[0].toLowerCase())&&seen.add(w[0].toLowerCase())).sort((a,b)=>a[0].localeCompare(b[0])).slice(0,8);
  }
  function classModeByCode(code){return Object.keys(CLASS_MODES).find(k=>CLASS_MODES[k].code===code)||'meaning';}
  function classPair(word){return baseWordPool().find(w=>w[0].toLowerCase()===String(word).toLowerCase())||[word,word];}
  function makeClassWire(round){const list=round.playlist&&round.playlist.length?round.playlist:[round.mode];return `${round.version==='C4'?'C4':'C5'}|${round.eventId}|${list.map(k=>CLASS_MODES[k].code).join('')}|${round.seconds}|${round.words.join(',')}`;}
  function parseClassWire(value){
    const p=String(value||'').split('|');if(p.length!==5||!['C4','C5'].includes(p[0])||!/^[a-z0-9]{3,6}$/i.test(p[1])||!/^[MLS]{1,3}$/.test(p[2])||!CLASS_TIMES.includes(Number(p[3])))return null;
    const words=p[4].split(',').map(w=>w.toLowerCase()).filter(w=>/^[a-z]{3,8}$/.test(w));if(words.length<CLASS_MIN_WORDS||words.length>CLASS_MAX_WORDS||new Set(words).size!==words.length)return null;
    const playlist=p[2].split('').map(classModeByCode).filter((k,i,a)=>a.indexOf(k)===i);if(p[0]==='C4'&&playlist.length!==1)return null;
    return {version:p[0],eventId:p[1],mode:playlist[0],playlist,seconds:Number(p[3]),words};
  }
  function lessonModes(round=activityRound){return round&&round.playlist&&round.playlist.length?round.playlist:[round&&round.mode||'meaning'];}
  function currentClassMode(){const list=lessonModes();return list[clamp(activityRound&&activityRound.step||0,0,list.length-1)];}
  function phaseNumber(phase){return phase==='run'?1:phase==='finished'?2:0;}
  function encodeClassAnswer(step,wordIndex,correct){return REPORT_ALPH[clamp(step,0,2)*10+clamp(wordIndex,0,4)*2+(correct?1:0)];}
  function decodeClassAnswers(log,words,playlist){const out=words.map(w=>({word:w,correct:0,wrong:0,total:0}));for(const ch of String(log||'')){const v=REPORT_ALPH.indexOf(ch),step=Math.floor(v/10),wi=Math.floor((v%10)/2);if(v<0||step>=playlist.length||wi>=out.length)continue;out[wi][v%2?'correct':'wrong']++;out[wi].total++;}return out;}
  function studentReportWire(){return activityRound&&activityRound.version==='C5'&&activityRound.role==='student'?`R5|${activityRound.eventId}|${String(activityRound.answerLog||'').slice(-48)}`:'';}
  function parseStudentReport(value,eventId){const p=String(value||'').split('|');return p.length===3&&p[0]==='R5'&&p[1]===eventId&&/^[0-9A-Za-z_-]{0,48}$/.test(p[2])?p[2]:'';}
  function readLessonDraft(showError=true){
    const words=Array.from(ui.classBody.querySelectorAll('[data-class-word]:checked')).map(x=>x.value),playlist=Array.from(ui.classBody.querySelectorAll('[data-class-mode]:checked')).map(x=>x.value),seconds=Number(ui.classBody.querySelector('#sp-class-time').value),name=String(ui.classBody.querySelector('#sp-pack-name').value||'ชุดคำศัพท์').trim().slice(0,32);
    if(words.length<CLASS_MIN_WORDS||words.length>CLASS_MAX_WORDS){if(showError)showToast(`เลือก ${CLASS_MIN_WORDS}–${CLASS_MAX_WORDS} คำครับ`);return null;}if(!playlist.length){if(showError)showToast('เลือกกิจกรรมอย่างน้อย 1 แบบครับ');return null;}return {name,words,playlist,seconds};
  }
  function saveLessonPack(){
    const draft=readLessonDraft();if(!draft)return;const sel=ui.classBody.querySelector('#sp-pack-select'),old=teacherData.packs.find(p=>p.id===sel.value),id=old?old.id:Date.now().toString(36).slice(-6),pack={id,...draft,updatedAt:Date.now()};if(old)Object.assign(old,pack);else teacherData.packs.unshift(pack);teacherData.packs=teacherData.packs.slice(0,20);persistTeacherData();renderClassroomSetup(id);showToast(`💾 บันทึก “${pack.name}” ในเครื่องแล้ว`);
  }
  function openClassroom(){if(!ui.classroom||paused&&activity!=='classroom')return;paused=true;ui.classroom.classList.add('on');ui.classroom.setAttribute('aria-hidden','false');if(activity==='classroom'&&activityRound)renderClassroom(true);else renderClassroomSetup();}
  function closeClassroom(){
    if(activity==='classroom'&&activityRound&&!classFinished&&activityRound.role==='student'){showToast('🏫 ทำกิจกรรมให้จบก่อนครับ');return;}
    if(classFinished){endClassroom();return;}ui.classroom.classList.remove('on');ui.classroom.setAttribute('aria-hidden','true');paused=false;
  }
  function renderClassroomSetup(selectedId=''){
    classView='setup';ui.classTitle.textContent='👩‍🏫 Teacher Lesson Packs';ui.classClose.hidden=false;const pool=classroomPool(),pack=teacherData.packs.find(p=>p.id===selectedId),words=new Set(pack?pack.words:pool.slice(0,4).map(w=>w[0])),playlist=new Set(pack?pack.playlist:Object.keys(CLASS_MODES)),seconds=pack?pack.seconds:60;
    const packOptions=teacherData.packs.map(p=>`<option value="${esc(p.id)}" ${p.id===selectedId?'selected':''}>${esc(p.name)}</option>`).join('');
    ui.classBody.innerHTML=`<div class="sp-packbar"><select id="sp-pack-select"><option value="">✨ ชุดใหม่</option>${packOptions}</select><input id="sp-pack-name" maxlength="32" value="${esc(pack?pack.name:'บทเรียนใหม่')}" aria-label="ชื่อ lesson pack"><button id="sp-pack-save">💾 บันทึก</button><button id="sp-report-library" ${teacherData.reports.length?'':'disabled'}>📊 รายงาน ${teacherData.reports.length}</button></div><div class="sp-class-setup"><section><b>① เลือกคำจากฐานเดิม ${CLASS_MIN_WORDS}–${CLASS_MAX_WORDS} คำ</b><div class="sp-class-words">${pool.map(w=>`<label><input type="checkbox" data-class-word value="${esc(w[0])}" ${words.has(w[0])?'checked':''}><span>${esc(w[0].toUpperCase())}<small>${esc(w[1])}</small></span></label>`).join('')}</div></section><section class="sp-class-controls"><b>② Lesson playlist</b><div class="sp-class-playlist">${Object.keys(CLASS_MODES).map((k,i)=>`<label><input type="checkbox" data-class-mode value="${k}" ${playlist.has(k)?'checked':''}><span>${i+1}. ${CLASS_MODES[k].name}</span></label>`).join('')}</div><label><b>③ เวลา/กิจกรรม</b><select id="sp-class-time">${CLASS_TIMES.map(n=>`<option value="${n}" ${n===seconds?'selected':''}>${n} วินาที</option>`).join('')}</select></label><button class="sp-class-start" id="sp-class-start">👋 เปิด Ready Check</button><small>${coopReady()?'🟢 รอนักเรียนพร้อมแล้วค่อยเริ่ม':'🟡 ทดลองเดี่ยวได้ · ล็อกอินเพื่อเชิญนักเรียน'}</small></section></div>`;
    ui.classBody.querySelector('#sp-pack-select').onchange=e=>renderClassroomSetup(e.target.value);ui.classBody.querySelector('#sp-pack-save').onclick=saveLessonPack;ui.classBody.querySelector('#sp-report-library').onclick=()=>renderReportLibrary();ui.classBody.querySelector('#sp-class-start').onclick=startClassroomHost;
  }
  function startClassroomHost(){
    const draft=readLessonDraft();if(!draft)return;const eventId=Date.now().toString(36).slice(-5);activity='classroom';activityDone=false;classFinished=false;classRoster={};classReportSaved=false;classHostUid=myUid;activityStartedAt=0;activityRound={version:'C5',role:'host',phase:'ready',step:0,eventId,...draft,mode:draft.playlist[0],score:0,progress:0,mistakes:0};classWire=makeClassWire(activityRound);if(classWire.length>60){showToast('คำที่เลือกยาวเกินไป ลดจำนวนคำลงครับ');activity='plaza';activityRound=null;return;}saveHostResume(true);ui.classroom.classList.add('on');paused=true;netSend(true);renderClassroom(true);updateHud();showToast('👋 Ready Check เปิดแล้ว · รอนักเรียนกดพร้อม');
  }
  function considerClassOffer(uid,d){
    const config=parseClassWire(d&&d.cw),p=parseActivity(d);if(!config||!p||p.mode!=='H'||p.seed!==config.eventId)return;if(activity==='classroom'&&activityRound&&activityRound.role==='student'&&activityRound.eventId===config.eventId){syncClassHost(uid,p);return;}if(activity!=='plaza')return;classOffer={uid,config,elapsed:p.time,phase:config.version==='C5'?(p.score===2?'finished':p.score===1?'run':'ready'):'run',step:p.progress};updateClassButton();
  }
  function joinClassroom(){
    if(!classOffer)return;const o=classOffer,resume=teacherData.active&&teacherData.active.eventId===o.config.eventId?teacherData.active:null;classOffer=null;classHostUid=o.uid;activity='classroom';activityDone=false;classFinished=false;classRoster={};activityRound={version:o.config.version,role:'student',phase:o.phase,step:o.step||0,eventId:o.config.eventId,mode:o.config.mode,playlist:o.config.playlist,seconds:o.config.seconds,words:o.config.words,score:resume?Number(resume.score)||0:0,progress:resume?Number(resume.progress)||0:0,mistakes:resume?Number(resume.mistakes)||0:0,question:resume?Number(resume.question)||0:0,answerLog:resume?String(resume.answerLog||''):'',ready:resume?!!resume.ready:false,lastFeedback:resume?'🔄 กลับมาต่อจากเครื่องนี้':''};activityStartedAt=o.phase==='run'?performance.now()-Math.max(0,o.elapsed*100):0;classWire='';paused=true;ui.classroom.classList.add('on');ui.classroom.setAttribute('aria-hidden','false');if(o.phase==='run')makeClassQuestion();saveStudentResume();netSend(true);renderClassroom(true);updateHud();showToast(o.phase==='run'?'🏫 เข้าช้าได้ · ต่อจากกิจกรรมปัจจุบัน':'👋 เข้า Ready Check แล้ว');
  }
  function markClassReady(){if(!activityRound||activityRound.role!=='student'||activityRound.phase!=='ready')return;activityRound.ready=!activityRound.ready;saveStudentResume();netSend(true);renderClassroom(true);}
  function startLessonRun(){if(!activityRound||activityRound.role!=='host'||activityRound.phase!=='ready')return;const rows=classRows(),waiting=rows.filter(r=>!r.ready);if(rows.length&&waiting.length){showToast(`รออีก ${waiting.length} คนกดพร้อมก่อนครับ`);return;}activityRound.phase='run';activityRound.step=0;activityStartedAt=performance.now();saveHostResume(true);netSend(true);renderClassroom(true);showToast('🚀 เริ่ม lesson playlist แล้ว');}
  function syncClassHost(uid,p){classHostUid=uid;const phase=p.score===2?'finished':p.score===1?'run':'ready';if(phase==='finished'){finishClassroom(true);return;}if(phase==='run'){const was=activityRound.phase,step=clamp(p.progress,0,lessonModes().length-1),remoteStart=performance.now()-Math.max(0,p.time*100);if(was!=='run'||Math.abs(activityStartedAt-remoteStart)>900)activityStartedAt=remoteStart;activityRound.phase='run';if(step!==activityRound.step||was!=='run'){activityRound.step=step;activityRound.question=0;activityRound.lastFeedback=was==='ready'?'🚀 ครูเริ่มบทเรียนแล้ว':'';makeClassQuestion();}saveStudentResume();}renderClassroom(true);}
  function classTimeLeft(){if(!activityRound||activityRound.phase!=='run')return 0;const span=activityRound.seconds*1000;return Math.max(0,span-(activityElapsed()%span));}
  function misspell(word,step){
    const a=word.split(''),i=(hashText(word+step)%(a.length-1));[a[i],a[i+1]]=[a[i+1],a[i]];let out=a.join('');if(out===word){a[i]=String.fromCharCode(97+(a[i].charCodeAt(0)-96)%26);out=a.join('');}return out;
  }
  function makeClassQuestion(){
    if(!activityRound||activityRound.role!=='student'||activityRound.phase!=='run')return;const i=activityRound.question||0,wordIndex=i%activityRound.words.length,word=activityRound.words[wordIndex],pair=classPair(word),mode=currentClassMode();let prompt,options;
    if(mode==='meaning'){prompt=`คำไหนแปลว่า “${pair[1]}”?`;options=activityRound.words.slice();}
    else if(mode==='listen'){prompt='🔊 ฟังแล้วเลือกคำที่ได้ยิน';options=activityRound.words.slice();setTimeout(()=>{if(running&&activity==='classroom'&&!classFinished&&typeof speakWord==='function')speakWord(word);},80);}
    else{prompt=`เลือกคำที่สะกดถูก: ${pair[1]}`;options=[word,misspell(word,1),misspell(word,2)];}
    options=Array.from(new Set(options)).sort((a,b)=>hashText(activityRound.eventId+activityRound.step+i+a)-hashText(activityRound.eventId+activityRound.step+i+b));activityRound.current={word,wordIndex,pair,prompt,options,mode};
  }
  function answerClassroom(word){
    if(activity!=='classroom'||classFinished||!activityRound||activityRound.phase!=='run'||activityRound.role!=='student'||!activityRound.current)return;const correct=String(word).toLowerCase()===activityRound.current.word.toLowerCase();activityRound.progress++;if(activityRound.version==='C5')activityRound.answerLog=(String(activityRound.answerLog||'')+encodeClassAnswer(activityRound.step,activityRound.current.wordIndex,correct)).slice(-48);if(correct){activityRound.score++;activityRound.lastFeedback=`✅ ${activityRound.current.word.toUpperCase()} = ${activityRound.current.pair[1]}`;tone(760,.12,.06);}else{activityRound.mistakes++;activityRound.lastFeedback=`💡 คำตอบคือ ${activityRound.current.word.toUpperCase()}`;tone(150,.1,.05);}activityRound.question++;makeClassQuestion();saveStudentResume();netSend(true);renderClassroom(true);
  }
  function classRows(){
    if(!activityRound)return [];const rows=Object.values(classRoster);if(activityRound.role==='student')rows.push({uid:myUid,n:String(state.profileName||'ฉัน'),score:activityRound.score,progress:activityRound.progress,time:Math.round(activityElapsed()/100),mine:true});
    return rows.sort((a,b)=>b.score-a.score||b.progress-a.progress||a.time-b.time).slice(0,ROOM_MAX-1);
  }
  function rememberClassPeer(uid,d){const p=parseActivity(d);if(activity==='classroom'&&activityRound&&activityRound.role==='host'&&p&&['R','C','F'].includes(p.mode)&&p.seed===activityRound.eventId){const old=classRoster[uid]||{};classRoster[uid]={...old,uid,n:String(d.n||'นักเรียน'),ready:p.mode==='R'?!!p.score:true,status:p.mode,score:p.mode==='R'?(old.score||0):p.score,progress:p.mode==='R'?(old.progress||0):p.progress,time:p.mode==='R'?(old.time||0):p.time,answerLog:parseStudentReport(d.cw,activityRound.eventId)||old.answerLog||''};saveHostResume();}}
  function classResultHtml(rows){
    if(!rows.length)return '<p class="sp-class-wait">🟢 รอนักเรียนกด JOIN CLASS…</p>';return `<div class="sp-class-results"><header><b>ชื่อ</b><b>ถูก/ตอบ</b><b>แม่นยำ</b><b>เวลา</b></header>${rows.map((r,i)=>{const acc=r.progress?Math.round(r.score/r.progress*100):0;return `<div class="${r.mine?'me':''}"><b>${i+1}. ${esc(r.n)}</b><span>${r.score}/${r.progress}</span><span>${acc}%</span><span>${fmtTime(r.time*100)}</span></div>`;}).join('')}</div>`;
  }
  function classReadyHtml(rows){if(!rows.length)return '<p class="sp-class-wait">🟢 รอนักเรียนกด JOIN CLASS…</p>';return `<div class="sp-ready-grid">${rows.map(r=>`<span class="${r.ready?'ready':''}"><b>${r.ready?'✅':'⏳'} ${esc(r.n)}</b><i>${r.ready?'พร้อม':'รอกดพร้อม'}</i></span>`).join('')}</div>`;}
  function classWordStats(rows,words=activityRound.words,playlist=lessonModes()){const out=words.map(w=>({word:w,correct:0,wrong:0,total:0}));rows.forEach(r=>decodeClassAnswers(r.answerLog,words,playlist).forEach((s,i)=>{out[i].correct+=s.correct;out[i].wrong+=s.wrong;out[i].total+=s.total;}));return out;}
  function classWordHtml(stats){return `<div class="sp-word-report"><header><b>คำศัพท์</b><b>ถูก</b><b>ผิด</b><b>แม่นยำ</b></header>${stats.map(s=>`<div><b>${esc(s.word.toUpperCase())}</b><span>${s.correct}</span><span>${s.wrong}</span><span>${s.total?Math.round(s.correct/s.total*100):0}%</span></div>`).join('')}</div>`;}
  function reportSnapshot(){const rows=classRows().map(r=>({uid:r.uid,n:r.n,score:r.score||0,progress:r.progress||0,time:r.time||0,answerLog:r.answerLog||''}));return {eventId:activityRound.eventId,name:activityRound.name||'บทเรียน Sky',at:Date.now(),seconds:activityRound.seconds,words:activityRound.words.slice(),playlist:lessonModes().slice(),rows};}
  function saveClassReport(){if(classReportSaved||!teacherData||!activityRound||activityRound.role!=='host')return;const report=reportSnapshot();teacherData.reports=teacherData.reports.filter(r=>r.eventId!==report.eventId);teacherData.reports.unshift(report);teacherData.reports=teacherData.reports.slice(0,20);classReportSaved=persistTeacherData();}
  function csvCell(v){return `"${String(v==null?'':v).replace(/"/g,'""')}"`;}
  function reportCsv(report){const rows=[['รายงาน',report.name],['เวลา',new Date(report.at).toLocaleString('th-TH')],['คำศัพท์',report.words.join(' / ')],[],['ชื่อ','ถูก','ตอบ','แม่นยำ (%)','เวลา (วินาที)']];report.rows.forEach(r=>rows.push([r.n,r.score,r.progress,r.progress?Math.round(r.score/r.progress*100):0,(r.time/10).toFixed(1)]));rows.push([],['รายคำ','ถูก','ผิด','แม่นยำ (%)']);classWordStats(report.rows,report.words,report.playlist).forEach(s=>rows.push([s.word,s.correct,s.wrong,s.total?Math.round(s.correct/s.total*100):0]));return '\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');}
  function downloadClassReport(report){if(!report)return;const url=URL.createObjectURL(new Blob([reportCsv(report)],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`sky-class-${report.eventId}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function printClassReport(report){if(!report)return;const w=window.open('','_blank','noopener,noreferrer,width=900,height=700');if(!w){showToast('กรุณาอนุญาต pop-up เพื่อพิมพ์รายงาน');return;}const stats=classWordStats(report.rows,report.words,report.playlist);w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(report.name)}</title><style>body{font:14px system-ui;padding:24px;color:#17336b}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #a9bde0;padding:7px;text-align:left}h1{margin:0}</style><h1>☁️ ${esc(report.name)}</h1><p>${new Date(report.at).toLocaleString('th-TH')} · ${esc(report.words.join(' / '))}</p><h2>รายคน</h2><table><tr><th>ชื่อ</th><th>ถูก/ตอบ</th><th>แม่นยำ</th></tr>${report.rows.map(r=>`<tr><td>${esc(r.n)}</td><td>${r.score}/${r.progress}</td><td>${r.progress?Math.round(r.score/r.progress*100):0}%</td></tr>`).join('')}</table><h2>รายคำ</h2><table><tr><th>คำศัพท์</th><th>ถูก</th><th>ผิด</th><th>แม่นยำ</th></tr>${stats.map(s=>`<tr><td>${esc(s.word.toUpperCase())}</td><td>${s.correct}</td><td>${s.wrong}</td><td>${s.total?Math.round(s.correct/s.total*100):0}%</td></tr>`).join('')}</table>`);w.document.close();w.focus();setTimeout(()=>w.print(),80);}
  function renderReportLibrary(id=''){const report=teacherData.reports.find(r=>r.eventId===id)||teacherData.reports[0];if(!report){showToast('ยังไม่มีรายงานในเครื่อง');return;}classView='reports';ui.classTitle.textContent='📊 Classroom Reports';ui.classBody.innerHTML=`<div class="sp-report-view"><select id="sp-report-select">${teacherData.reports.map(r=>`<option value="${esc(r.eventId)}" ${r.eventId===report.eventId?'selected':''}>${esc(r.name)} · ${new Date(r.at).toLocaleDateString('th-TH')}</option>`).join('')}</select><div class="sp-report-cols">${classResultHtml(report.rows)}${classWordHtml(classWordStats(report.rows,report.words,report.playlist))}</div><div class="sp-report-actions"><button id="sp-report-csv">⬇️ CSV</button><button id="sp-report-print">🖨️ พิมพ์</button><button id="sp-report-back">← Lesson Packs</button></div></div>`;ui.classBody.querySelector('#sp-report-select').onchange=e=>renderReportLibrary(e.target.value);ui.classBody.querySelector('#sp-report-csv').onclick=()=>downloadClassReport(report);ui.classBody.querySelector('#sp-report-print').onclick=()=>printClassReport(report);ui.classBody.querySelector('#sp-report-back').onclick=()=>renderClassroomSetup();}
  function renderClassroom(force=false){
    if(!ui.classBody||activity!=='classroom'||!activityRound)return;const now=performance.now();if(!force&&now-(ui.classBody._at||0)<180)return;ui.classBody._at=now;const left=Math.ceil(classTimeLeft()/1000),mode=CLASS_MODES[currentClassMode()],rows=classRows();ui.classClose.hidden=!classFinished&&activityRound.role==='student';
    if(classFinished){classView='summary';const stats=classWordStats(rows);ui.classTitle.textContent='📊 ผลสรุปชั้นเรียน';ui.classBody.innerHTML=`<div class="sp-class-summary"><div class="sp-class-kpis"><b>${lessonModes().map(k=>CLASS_MODES[k].name).join(' → ')}</b><span>👥 ${rows.length} นักเรียน</span></div><div class="sp-report-cols">${classResultHtml(rows)}${classWordHtml(stats)}</div><div class="sp-report-actions">${activityRound.role==='host'?'<button id="sp-class-csv">⬇️ CSV</button><button id="sp-class-print">🖨️ พิมพ์</button>':''}<button class="sp-class-done" id="sp-class-done">✓ ปิดผลสรุป</button></div></div>`;const report=activityRound.role==='host'?teacherData.reports.find(r=>r.eventId===activityRound.eventId):null;const csv=ui.classBody.querySelector('#sp-class-csv'),print=ui.classBody.querySelector('#sp-class-print');if(csv)csv.onclick=()=>downloadClassReport(report);if(print)print.onclick=()=>printClassReport(report);ui.classBody.querySelector('#sp-class-done').onclick=endClassroom;return;}
    if(activityRound.phase==='ready'){classView='ready';ui.classTitle.textContent='👋 Ready Check';if(activityRound.role==='host'){ui.classBody.innerHTML=`<div class="sp-class-ready"><div class="sp-class-kpis"><b>${lessonModes().map(k=>CLASS_MODES[k].name).join(' → ')}</b><span>📚 ${activityRound.words.map(w=>esc(w.toUpperCase())).join(' · ')}</span></div>${classReadyHtml(rows)}<button class="sp-class-start" id="sp-lesson-go">🚀 ${rows.length&&rows.every(r=>r.ready)?'ทุกคนพร้อม · ':''}เริ่มบทเรียน</button><p>เริ่มเดี่ยวได้ · ถ้ามีนักเรียนต้องพร้อมครบก่อน</p></div>`;ui.classBody.querySelector('#sp-lesson-go').onclick=startLessonRun;}else{ui.classBody.innerHTML=`<div class="sp-class-ready sp-ready-student"><b>${activityRound.ready?'✅ พร้อมแล้ว':'👋 กดเมื่อพร้อมเรียน'}</b><span>${lessonModes().map(k=>CLASS_MODES[k].name).join(' → ')}</span><button id="sp-student-ready">${activityRound.ready?'↩ ยังไม่พร้อม':'✅ ฉันพร้อม'}</button><small>รอครูเริ่ม · reconnect แล้วสถานะยังอยู่</small></div>`;ui.classBody.querySelector('#sp-student-ready').onclick=markClassReady;}return;}
    classView='live';ui.classTitle.textContent=`${activityRound.role==='host'?'🟢 ':''}${mode.name} · ${left}s`;
    if(activityRound.role==='host'){ui.classBody.innerHTML=`<div class="sp-class-live"><div class="sp-class-kpis"><b>${activityRound.step+1}/${lessonModes().length} · ${mode.name}</b><span>📚 ${activityRound.words.map(w=>esc(w.toUpperCase())).join(' · ')}</span><span>⏱ ${left}s</span></div>${classResultHtml(rows)}<button class="sp-class-finish" id="sp-class-finish">📊 จบและดูผลสรุปตอนนี้</button><p>ผลสดสูงสุด 5 คน · คนหลุด/เข้าช้ายังอยู่ในรายงาน</p></div>`;ui.classBody.querySelector('#sp-class-finish').onclick=()=>finishClassroom(false);}
    else{const q=activityRound.current;if(!q){makeClassQuestion();return renderClassroom(true);}ui.classBody.innerHTML=`<div class="sp-class-question"><div class="sp-class-kpis"><b>${activityRound.step+1}/${lessonModes().length} · ⏱ ${left}s</b><span>✅ ${activityRound.score}/${activityRound.progress}</span><span>🎯 ${activityRound.progress?Math.round(activityRound.score/activityRound.progress*100):0}%</span></div><h3>${esc(q.prompt)}</h3>${q.mode==='listen'?'<button class="sp-class-hear" id="sp-class-hear">🔊 ฟังอีกครั้ง</button>':''}<div class="sp-class-options">${q.options.map(w=>`<button data-class-answer="${esc(w)}">${esc(w.toUpperCase())}</button>`).join('')}</div><p>${esc(activityRound.lastFeedback||'โหมดชั้นเรียนไม่แจกเหรียญ · ตอบได้จนหมดเวลา')}</p></div>`;ui.classBody.querySelectorAll('[data-class-answer]').forEach(b=>b.onclick=()=>answerClassroom(b.dataset.classAnswer));const hear=ui.classBody.querySelector('#sp-class-hear');if(hear)hear.onclick=()=>typeof speakWord==='function'&&speakWord(q.word);}
  }
  function finishClassroom(fromHost=false){if(classFinished||activity!=='classroom')return;classFinished=true;activityDone=true;activityRound.phase='finished';paused=true;if(activityRound.role==='host'){saveClassReport();clearHostResume(activityRound.eventId);}else saveStudentResume();if(!fromHost)netSend(true);renderClassroom(true);updateHud();tone(784,.25,.07);showToast('📊 จบบทเรียน · เปิดผลรายคนแะรายคำแล้ว');}
  function tickClassroom(){if(activity!=='classroom'||!activityRound)return false;if(!classFinished&&activityRound.phase==='run'){const step=Math.floor(activityElapsed()/(activityRound.seconds*1000)),total=lessonModes().length;if(step>=total){finishClassroom(false);return true;}if(step!==activityRound.step){activityRound.step=step;activityRound.question=0;activityRound.lastFeedback=`➡️ ต่อด้วย ${CLASS_MODES[currentClassMode()].name}`;if(activityRound.role==='student'){makeClassQuestion();saveStudentResume();}else saveHostResume(true);netSend(true);renderClassroom(true);}}renderClassroom();return true;}
  function endClassroom(){
    const wasHost=activityRound&&activityRound.role==='host',eventId=activityRound&&activityRound.eventId;if(wasHost)clearHostResume(eventId);else clearStudentResume(eventId);activity='plaza';activityRound=null;activityStartedAt=0;activityDone=false;classFinished=false;classWire='';classRoster={};classHostUid='';classReportSaved=false;classView='setup';paused=false;ui.classroom.classList.remove('on');ui.classroom.setAttribute('aria-hidden','true');if(wasHost)netSend(true);updateClassButton();updateHud();
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
  function parseActivity(d){const p=String(d&&d.hp||'').split(':');if(!['S2','S3','S4','S5'].includes(p[0]))return null;return {version:p[0],mode:p[1],score:Number(p[2])||0,progress:Number(p[3])||0,time:Number(p[4])||0,seed:p.slice(5).join(':')};}
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
  function netSend(force){if(!room||!player)return;const elapsed=Math.min(99999,Math.round(activityElapsed()/100));let hp=`S3:${activityCode()}:${activityRound?activityRound.score:0}:${activity==='obby'?currentCheckpoint:(activityRound?activityRound.progress:0)}:${elapsed}:${activityRound?activityRound.seed:'plaza'}`,cw=classWire||'';if(activity==='classroom'&&activityRound){if(activityRound.version==='C5'){if(activityRound.role==='host')hp=`S5:H:${phaseNumber(activityRound.phase)}:${activityRound.step||0}:${elapsed}:${activityRound.eventId}`;else{const mode=activityRound.phase==='ready'?'R':activityRound.phase==='finished'?'F':'C',score=mode==='R'?(activityRound.ready?1:0):(activityRound.score||0);hp=`S5:${mode}:${score}:${activityRound.progress||0}:${elapsed}:${activityRound.eventId}`;cw=studentReportWire();}}else hp=`S4:${activityRound.role==='host'?'H':'C'}:${activityRound.score||0}:${activityRound.progress||0}:${elapsed}:${activityRound.eventId}`;}room.send({n:String(state.profileName||'นักสำรวจ').slice(0,40),x:+player.pos.x.toFixed(2),y:+player.pos.y.toFixed(2),z:+player.pos.z.toFixed(2),yaw:+player.group.rotation.y.toFixed(3),av:profileAvatar(),m:performance.now()<emoteUntil?1:0,w:sessionStars,cw,hp},!!force);}
  function onPeer(uid,d){peers[uid]=d||{};if(!peerActors[uid])buildPeer(uid,d||{});const a=peerActors[uid];if(a){a.target.set(Number(d.x)||0,Number(d.y)||0,Number(d.z)||0);a.yaw=Number(d.yaw)||0;a.data=d||{};}considerJoinOffer(uid,d||{});considerClassOffer(uid,d||{});rememberClassPeer(uid,d||{});updateOnline();updateActivityHud(performance.now(),true);if(activity==='classroom')renderClassroom(true);}
  function onPeerGone(uid){delete peers[uid];removePeer(uid);if(joinOffer&&joinOffer.uid===uid){joinOffer=null;for(const other in peers){considerJoinOffer(other,peers[other]);if(joinOffer)break;}renderDailyPanel();}if(classOffer&&classOffer.uid===uid){classOffer=null;for(const other in peers){considerClassOffer(other,peers[other]);if(classOffer)break;}updateClassButton();}updateOnline();updateActivityHud(performance.now(),true);if(activity==='classroom')renderClassroom(true);}
  function buildPeer(uid,d){const g=new THREE.Group(),fig=makeChibi(/^blk/.test(d.av||'')?d.av:'blk1');g.add(fig);const name=textSprite(String(d.n||'เพื่อน').slice(0,18),0xffffff,420,100);name.scale.set(3.4,.82,1);name.position.y=2.35;g.add(name);scene.add(g);return peerActors[uid]={group:g,fig,limbs:fig.userData.limbs,target:new THREE.Vector3(Number(d.x)||0,Number(d.y)||0,Number(d.z)||0),yaw:Number(d.yaw)||0,data:d,phase:Math.random()*TAU};}
  function removePeer(uid){const a=peerActors[uid];if(!a)return;scene.remove(a.group);disposeTree(a.group);delete peerActors[uid];}
  function tickOnline(t,dt){if(room){room.tick(t);if(t-lastNetAt>190){lastNetAt=t;netSend(false);}}if(t-lastPeerBudget>500){lastPeerBudget=t;drawPeerBudget();}for(const uid in peerActors){const a=peerActors[uid],before=a.group.position.clone();a.group.position.lerp(a.target,1-Math.pow(.0004,dt));a.group.rotation.y+=(a.yaw-a.group.rotation.y)*Math.min(1,dt*8);const moving=before.distanceTo(a.group.position)>.012,swing=moving?Math.sin(t*.013+a.phase)*.65:0;a.limbs.forEach(l=>{const target=swing*(Number(l.userData.swingSign)||1);l.rotation.x+=(target-l.rotation.x)*Math.min(1,dt*12);});const rightArm=a.fig.userData.parts.arms[1];if(Number(a.data.m))rightArm.rotation.z=-1.6+Math.sin(t*.02)*.25;else rightArm.rotation.z+=(rightArm.userData.restZ-rightArm.rotation.z)*Math.min(1,dt*10);}}
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
  function start(){if(!(typeof canAccessSkyBeta==='function'&&canAccessSkyBeta())){if(typeof toast==='function')toast('🔒 Vocab Sky Playground กำลังเปิดแบบ Private Beta เฉพาะบัญชีที่ได้รับเชิญ ขอบคุณที่สนใจนะครับ');return false;}if(running)return true;ensureState();teacherData=loadTeacherData();fxLow=!!state.noAnim||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);if(typeof clearWarnToasts==='function')clearWarnToasts();if(typeof Music!=='undefined')Music.suspendBg();createDom();initThree();running=true;paused=false;activity='plaza';activityRound=null;activityStartedAt=0;activityDone=false;routeFinished=false;sessionCoins=0;sessionStars=0;joinOffer=null;classOffer=null;classWire='';classFinished=false;classRoster={};classHostUid='';classReportSaved=false;setupOnline();updateHud();if(!restoreHostLesson()&&!restoreActiveRun())showToast('🎮 PLAY 4 กิจกรรม · 🏫 CLASS เปิด Lesson Packs และ Reports');lastFrame=0;raf=requestAnimationFrame(loop);return true;}
  function stop(){if(!running)return;if(activityRound&&!activityDone)saveActiveRun();if(activity==='classroom'&&activityRound){if(activityRound.role==='student')saveStudentResume();else saveHostResume(true);}running=false;paused=false;cancelAnimationFrame(raf);raf=0;listeners.splice(0).forEach(fn=>{try{fn();}catch(e){}});keys.clear();if(room){room.leave();room=null;}Object.keys(peerActors).forEach(removePeer);peers={};peerActors={};if(typeof speechSynthesis!=='undefined')try{speechSynthesis.cancel();}catch(e){};saveState();if(typeof authPushSave==='function')authPushSave(true);if(scene)disposeTree(scene);if(scene&&scene.background)scene.background.dispose();if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();renderer.setSize(2,2,false);}if(root)root.remove();root=canvas=renderer=scene=camera=clock=null;player=petComp=portal=gate=null;supports=[];moving=[];rotators=[];checkpoints=[];stars=[];effects=[];letterTokens=[];raceGates=[];towerFloors=[];towerQuestion=null;joinOffer=null;classOffer=null;classWire='';classFinished=false;classRoster={};classHostUid='';classReportSaved=false;activity='plaza';activityRound=null;if(audioCtx){try{audioCtx.close();}catch(e){}audioCtx=null;}if(typeof Music!=='undefined')Music.resumeBg();if(typeof renderDashboard==='function')renderDashboard();if(typeof toast==='function')toast(`☁️ กลับจาก Vocab Sky Playground · เก็บ ${sessionStars} คำ · +${fmt(sessionCoins)} 🪙`);}

  window.SkyPlayground3D={start,stop,_t:{get running(){return running},get player(){return player},get pet(){return petComp},get stars(){return stars},get checkpoints(){return checkpoints},get towerFloors(){return towerFloors},get towerQuestion(){return towerQuestion},get gate(){return gate},get room(){return room},get peers(){return peers},get camera(){return camera},get activity(){return activity},get activityRound(){return activityRound},get letters(){return letterTokens},get raceGates(){return raceGates},get joinOffer(){return joinOffer},get classOffer(){return classOffer},get classWire(){return classWire},get classFinished(){return classFinished},get teacherData(){return teacherData},get daily(){return state.skyDaily},perf:perfStats,resize,frame:(ms=16)=>{const t=performance.now();updateWorld(ms/1000,t);updatePlayer(ms/1000,t);updatePet(ms/1000,t);cameraTick(ms/1000);renderer.render(scene,camera);},fall:()=>{player.pos.y=FALL_Y-1;updatePlayer(.016,performance.now());},checkpoint:i=>activateCheckpoint(checkpoints[clamp(i,0,2)]),openGate:showGate,answer:w=>answerGate(w),answerTower,openClass:openClassroom,startClass:startClassroomHost,readyClass:markClassReady,runLesson:startLessonRun,tickClass:tickClassroom,joinClass:joinClassroom,answerClass:answerClassroom,finishClass:finishClassroom,endClass:endClassroom,showReports:renderReportLibrary,reportCsv,joinLive:joinLiveActivity,finish:finishRoute,collect:i=>stars[i]&&collectStar(stars[i]),startActivity,peer:onPeer,gone:onPeerGone}};
})();
