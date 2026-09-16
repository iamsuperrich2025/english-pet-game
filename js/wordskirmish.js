"use strict";
/* ============================================================
   🔫 wordskirmish.js — ยิงรบคำ (Cute Word Skirmish) รอบ 1480
   คัดลอกกติกาปืนลมจากยิงเป้าคำ + เดินอิสระมุม 3rd-person + บ้าน/ตัวอักษรแบบ Frontline
   Soft Cuboid Chibi 3D น่ารัก · ออนไลน์ NetRoom map `skirmish` สูงสุด 8 คน
   แอดมินเท่านั้นจนกว่าจะอนุมัติเผยแพร่ · THREE โหลดตอนกดเข้า
   ============================================================ */
(function(){
  const MINLEN=3, MAXLEN=8, LETTER_REWARD=1000, COOLDOWN=310, BODY_DMG=35, MAX_HP=100;
  /* HOME_R กว้างกว่ามุมบ้าน (ทแยง ~4.1) จึงฝากตัวอักษรจากที่ยืนข้างบ้านได้ทุกด้าน
     และจุดเกิดที่ 4.5 อยู่ในระยะฝากพอดี ไม่ต้องเดินอ้อมกลับ */
  const SPEED=8, PICKUP_R=2.4, HOME_R=5.6, HOUSE_HALF=2.9, ARENA=28, DPR_CAP=1.5;
  /* กล้องอยู่กลางหลังตัวละครแต่กดมุมลง เล็งไปจุดไกล AIM_AHEAD ตามแนวหน้า
     → หัวตัวละครต่ำกว่ากากบาท กากบาทกลางจอคือแนวกระสุนจริงและตรงกับทิศที่ตัวละครหัน
     ลากนิ้วลง = ก้ม · ลากนิ้วขึ้น = เงย (กล้องเกมปกติ ไม่ใช่คันโยกเครื่องบิน) */
  const CAM_DIST=6.4, CAM_H=3, CAM_LOOK=.25, CAM_SHOULDER=0, AIM_AHEAD=26, PITCH_GAIN=6, FOV=52;
  const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const FALLBACK=[['CAT','แมว'],['DOG','สุนัข'],['BOOK','หนังสือ'],['FISH','ปลา'],['BIRD','นก']];
  const HOMES=[
    {x:-20,z:-20,col:0xff8fab,name:'บ้านชมพู'},
    {x:20,z:-20,col:0x62d4ff,name:'บ้านฟ้า'},
    {x:-20,z:20,col:0x86efac,name:'บ้านเขียว'},
    {x:20,z:20,col:0xffe066,name:'บ้านเหลือง'}
  ];
  const PAL=[0xff8a80,0xffd180,0xffff8d,0xccff90,0x80d8ff,0xb388ff,0xff80ab,0xa7ffeb];
  const LOCK_MSG='🔒 ยิงรบคำกำลังทดสอบ — เปิดให้ผู้ดูแลระบบเท่านั้น';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};

  let root=null,hud={},raf=0,opening=false,running=false,paused=false,built=false;
  let W=0,H=0,dpr=1,last=0,elapsed=0;
  let THREE=null,scene=null,camera=null,renderer=null,raycaster=null,tmpV=null,tmpV2=null;
  let word=null,queue=[],qGrade=null,lastWord='';
  let stored='',carried='',fieldLetters=[],wordsDone=0,coinsRun=0;
  let coinSession={id:'',total:0,paid:0};
  let player={x:0,z:0,yaw:0,hp:MAX_HP,alive:true,seat:0,bob:0,recoil:0,respawnAt:0};
  const PITCH_DEF=0.28;
  let lookYaw=0,lookPitch=PITCH_DEF,shake=0;
  let keys={f:0,b:0,l:0,r:0}, joy={x:0,z:0}, autoRun=false, pointers=new Map();
  let lastShot=0,eventSeq=0,lastEvent='-',seenShot={};
  let playerMesh=null,gunMesh=null,homeMeshes=[],vaultMeshes=[],bots=[],peersVis={};
  let room=null,myUid='',netToast='';
  let audio=null,saveTimer=0,timers=new Set();
  const PAD_KEY='skmPad1', HOLD_MS=420, JOY_R=46, DODGE_T=.48;
  const STANCES=['stand','crouch','kneel','prone'];
  const POSE_CODE={stand:'',crouch:'c',kneel:'k',prone:'p'};
  let padPos={joy:{x:.14,y:.82},auto:{x:.14,y:.56},crouch:{x:.32,y:.56},prone:{x:.32,y:.40},dodge:{x:.32,y:.26},fire:{x:.9,y:.88},drop:{x:.9,y:.72}};
  let stance='stand', dodgeT=0, dodgeDir=1, dodgeYaw=0, lastStrafe=1;

  function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
  function loadPad(){
    try{
      const raw=JSON.parse(localStorage.getItem(PAD_KEY)||'{}');
      if(raw&&raw.joy&&raw.fire&&raw.drop) padPos=Object.assign({auto:{x:.14,y:.56},crouch:{x:.32,y:.56},prone:{x:.32,y:.40},dodge:{x:.32,y:.26}}, raw);
    }catch(_){}
  }
  function savePad(){
    try{ localStorage.setItem(PAD_KEY, JSON.stringify(padPos)); }catch(_){}
  }
  function placeCtl(el, x, y, key){
    if(!el) return {x,y};
    const half=Math.max(18, (el.getBoundingClientRect().width||80)/2);
    const leftPad=key==='joy'||key==='auto'||key==='crouch'||key==='prone'||key==='dodge';
    const minX=half;
    const maxX=leftPad?Math.max(minX+8, W*0.5-half):W-half;
    x=clamp(x, minX+4, maxX-4);
    y=clamp(y, half+4, H-half-4);
    el.style.left=x+'px'; el.style.top=y+'px';
    el.style.right='auto'; el.style.bottom='auto';
    if(key) padPos[key]={x:W?x/W:padPos[key].x, y:H?y/H:padPos[key].y};
    return {x,y};
  }
  function layoutPad(){
    if(!hud.joy) return;
    placeCtl(hud.joy, (padPos.joy.x||.14)*W, (padPos.joy.y||.82)*H, 'joy');
    placeCtl(hud.auto, (padPos.auto.x||.14)*W, (padPos.auto.y||.56)*H, 'auto');
    placeCtl(hud.crouch, (padPos.crouch.x||.32)*W, (padPos.crouch.y||.56)*H, 'crouch');
    placeCtl(hud.prone, (padPos.prone.x||.32)*W, (padPos.prone.y||.40)*H, 'prone');
    placeCtl(hud.dodge, (padPos.dodge.x||.32)*W, (padPos.dodge.y||.26)*H, 'dodge');
    placeCtl(hud.fire, (padPos.fire.x||.9)*W, (padPos.fire.y||.88)*H, 'fire');
    placeCtl(hud.drop, (padPos.drop.x||.9)*W, (padPos.drop.y||.72)*H, 'drop');
  }
  function paintAuto(){
    if(!hud.auto) return;
    hud.auto.classList.toggle('skm-on', autoRun);
    hud.auto.setAttribute('aria-pressed', autoRun?'true':'false');
    hud.auto.textContent=autoRun?'ไปบ้าน':'AUTO';
  }
  function atOwnHome(){
    const h=homeOf(player.seat);
    return Math.hypot(player.x-h.x, player.z-h.z)<=HOME_R;
  }
  function homeApproach(seat){
    const h=homeOf(seat==null?player.seat:seat);
    const len=Math.hypot(h.x,h.z)||1;
    const fx=-h.x/len, fz=-h.z/len;
    return {x:h.x+fx*4.5, z:h.z+fz*4.5, home:h};
  }
  function finishAutoHome(){
    if(carried) tryDeposit();
    setAutoRun(false);
    showToast('ถึงบ้านแล้ว');
  }
  function setAutoRun(on){
    if(on && atOwnHome()){
      autoRun=false;
      paintAuto();
      if(carried) tryDeposit();
      showToast('ถึงบ้านแล้ว');
      return false;
    }
    autoRun=!!on;
    paintAuto();
    if(autoRun) showToast('วิ่งกลับ'+homeOf(player.seat).name);
    return autoRun;
  }
  function toggleAuto(){ return setAutoRun(!autoRun); }
  function stanceSpec(name){
    const p=name||stance;
    if(p==='crouch') return {y:0, rx:0, cam:2.35, look:.02, spd:.55};
    if(p==='kneel') return {y:0, rx:0, cam:2.02, look:-.08, spd:.32};
    if(p==='prone') return {y:0, rx:0, cam:1.28, look:-.55, spd:.2};
    return {y:0, rx:0, cam:CAM_H, look:CAM_LOOK, spd:1};
  }
  function paintPose(){
    ['crouch','prone','dodge'].forEach(key=>{
      const el=hud[key]; if(!el) return;
      const on=key==='dodge'?dodgeT>0:stance===key;
      el.classList.toggle('skm-on',on);
      el.setAttribute('aria-pressed',on?'true':'false');
    });
  }
  function setStance(name){
    stance=STANCES.indexOf(name)>=0?name:'stand';
    paintPose();
    return stance;
  }
  function toggleStance(name){
    return setStance(stance===name?'stand':name);
  }
  function poseTag(){
    const base=POSE_CODE[stance]||'';
    if(dodgeT>0) return base+(dodgeDir<0?'L':'R')+Math.round(Math.abs(dodgeAmt())*9);
    return base;
  }
  function packAv(){ return 'sk'+(player.seat+1)+poseTag(); }
  function parseAv(av){
    const m=String(av||'').match(/^sk(\d)([ckp]?)([LR]?)([0-9]?)/i);
    const pose={c:'crouch',k:'kneel',p:'prone'}[(m&&m[2]||'').toLowerCase()]||'stand';
    const side=m&&m[3].toUpperCase();
    const dodge=(side==='L'?-1:side==='R'?1:0)*(m&&m[4]!==''?Number(m[4])/9:1);
    return {seat:m?clamp((parseInt(m[1],10)||1)-1,0,3):0, pose, dodge};
  }
  function dodgeAmt(){
    if(dodgeT<=0) return 0;
    return dodgeDir*Math.sin((1-dodgeT/DODGE_T)*Math.PI);
  }
  function startDodge(dir){
    if(!player.alive || dodgeT>0) return 0;
    if(dir) dodgeDir=dir<0?-1:1;
    else dodgeDir=keys.l||joy.x<-.2?-1:keys.r||joy.x>.2?1:lastStrafe<0?-1:1;
    dodgeT=DODGE_T; dodgeYaw=lookYaw;
    paintPose();
    return dodgeDir;
  }
  function setJoyKnob(x,z){
    if(!hud.joyKnob) return;
    hud.joyKnob.style.transform='translate('+((x||0)*22)+'px,'+((z||0)*22)+'px)';
  }
  function clearTimers(){timers.forEach(clearTimeout);timers.clear();}
  function queueSave(){
    if(saveTimer){clearTimeout(saveTimer);timers.delete(saveTimer);}
    saveTimer=later(()=>{saveTimer=0;if(typeof saveState==='function')saveState();if(typeof authPushSave==='function')authPushSave(false);},500);
  }
  function grade(){return (typeof state!=='undefined'&&state.student&&state.student.grade)||'ป.1';}
  function adminAllowed(){
    try{
      if(typeof isAdmin==='function' && isAdmin()===true) return true;
      if(typeof state!=='undefined' && state.adminAccess===true) return true;
    }catch(_){}
    return false;
  }
  function pool(){
    const seen=new Set(), out=[];
    const src=(typeof vocabForStudent==='function')?vocabForStudent():FALLBACK;
    src.forEach(pair=>{
      const w=String(pair[0]||'').toUpperCase().replace(/[^A-Z]/g,'');
      if(w.length>=MINLEN && w.length<=MAXLEN && !seen.has(w)){
        seen.add(w); out.push({w, th:String(pair[1]||'')});
      }
    });
    return out.length?out:FALLBACK.map(v=>({w:v[0],th:v[1]}));
  }
  function takeWord(){
    const g=grade();
    if(qGrade!==g || !queue.length){
      queue=shuffle(pool()); qGrade=g;
      if(queue.length>1 && queue[0].w===lastWord) queue.push(queue.shift());
    }
    const next=queue.shift()||{w:'CAT',th:'แมว'};
    lastWord=next.w; return next;
  }
  function wordMarks(bank, target){
    const have={}; for(const ch of bank||'') have[ch]=(have[ch]||0)+1;
    return String(target||'').split('').map(ch=>{ if(have[ch]){ have[ch]--; return true; } return false; });
  }
  function hasWord(bank, target){ return !!target && wordMarks(bank, target).every(Boolean); }
  function walletCoins(){ return (typeof state!=='undefined' && state)? (Number(state.coins)||0) : 0; }
  function beginCoinSession(){
    settleCoinSession();
    coinSession={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2), total:0, paid:0};
    coinsRun=0; return coinSession.id;
  }
  function creditReward(){ coinSession.total+=LETTER_REWARD; coinsRun=coinSession.total; return LETTER_REWARD; }
  function settleCoinSession(){
    const amount=Math.max(0,(coinSession.total||0)-(coinSession.paid||0));
    if(amount && typeof addCoins==='function'){
      addCoins(amount);
      coinSession.paid=(coinSession.paid||0)+amount;
      queueSave();
    }
    return amount;
  }

  function mat(col, extra){
    return new THREE.MeshLambertMaterial(Object.assign({color:col}, extra||{}));
  }
  function box(w,h,d,col,x,y,z){
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(col));
    m.position.set(x||0,y||0,z||0); m.castShadow=false; m.receiveShadow=false;
    return m;
  }
  function cyl(rt,rb,h,col){
    return new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,10), mat(col));
  }
  function stampHit(node, kind){ node.traverse(m=>{ m.userData.hit=kind; }); }
  function bone(w,h,d,col){ return box(w,h,d,col,0,-h/2,0); }  // พิвотอยู่หัวกระดูก หมุนที่ข้อต่อ
  function joint(x,y,z){ const p=new THREE.Group(); p.position.set(x,y,z); return p; }
  /* Soft Cuboid Chibi 3D — ข้อต่อมนุษย์ (สะโพก/เข่า/ไหล่/ศอก/ข้อมือ) ปืนติดมือขวา งอแขนยกปืนได้ */
  function makeChibi(palette, withGun){
    const g=new THREE.Group(), body=new THREE.Group(), upper=joint(0,.62,0);
    g.add(body); body.add(upper);
    const support=[];
    const skin=palette.skin||0xffcf9e, shirt=palette.shirt||0xff8fab, pants=palette.pants||0x5b8def, hair=palette.hair||0x3b2a24;
    const pelvis=box(.56,.2,.38,pants,0,.62,0);
    const torso=box(.7,.52,.44,shirt,0,.98,0);
    body.add(pelvis); upper.add(torso); torso.position.y-=.62; support.push(pelvis,torso);
    function makeLeg(side){
      const hip=joint(side*.16,.62,0);
      const thigh=bone(.26,.28,.28,pants); hip.add(thigh);
      const knee=joint(0,-.28,0); hip.add(knee);
      const shin=bone(.24,.24,.26,pants); knee.add(shin);
      const ankle=joint(0,-.24,0); knee.add(ankle);
      const foot=box(.22,.1,.32,0x5d4037,0,-.05,-.06); ankle.add(foot);
      body.add(hip); support.push(thigh,shin,foot); return {hip,knee,ankle};
    }
    function makeArm(side){
      const shoulder=joint(side*.4,1.16,.02);
      shoulder.add(bone(.2,.28,.22,shirt));
      const elbow=joint(0,-.28,0); shoulder.add(elbow);
      const forearm=bone(.18,.26,.2,skin); elbow.add(forearm);
      const wrist=joint(0,-.26,0); elbow.add(wrist);
      const hand=box(.16,.14,.18,skin,0,-.06,-.02); wrist.add(hand);
      shoulder.position.y-=.62; upper.add(shoulder); support.push(forearm,hand); return {shoulder,elbow,wrist,hand};
    }
    const legL=makeLeg(-1), legR=makeLeg(1);
    const armL=makeArm(-1), armR=makeArm(1);
    const neck=joint(0,1.24,0);
    const head=box(.78,.7,.7,skin,0,.38,0);
    const hairM=box(.82,.22,.74,hair,0,.74,0);
    const eyeL=box(.1,.12,.06,0x2b1c14,-.16,.4,-.34), eyeR=box(.1,.12,.06,0x2b1c14,.16,.4,-.34);
    const blushL=box(.12,.08,.04,0xff9bb5,-.28,.28,-.32), blushR=box(.12,.08,.04,0xff9bb5,.28,.28,-.32);
    const smile=box(.22,.05,.04,0xe11d48,0,.2,-.34);
    neck.add(head,hairM,eyeL,eyeR,blushL,blushR,smile); neck.position.y-=.62; upper.add(neck);
    stampHit(neck,'head');
    stampHit(pelvis,'body'); stampHit(torso,'body');
    stampHit(legL.hip,'body'); stampHit(legR.hip,'body');
    stampHit(armL.shoulder,'body'); stampHit(armR.shoulder,'body');
    let gun=null;
    if(withGun){
      gun=new THREE.Group();
      /* แกนปืน: +Z = กระบอก (lookAt ของ THREE หัน +Z ไปหาเป้า) · -Z = พานท้าย */
      const body=box(.16,.2,.62,0xffd54f,0,.02,.16);
      const barrel=cyl(.065,.08,.78,0xff8a65); barrel.rotation.x=Math.PI/2; barrel.position.set(0,.04,.72);
      const grip=box(.12,.26,.14,0xff7043,0,-.16,-.06);
      const stock=box(.14,.18,.34,0xffcc80,0,.02,-.4);
      const sight=box(.05,.1,.07,0x29b6f6,0,.16,.28);
      gun.add(body,barrel,grip,stock,sight);
      gun.position.set(.1,-.02,-.14);
      armR.wrist.add(gun); stampHit(gun,'body');
    }
    const rig={
      hipL:legL.hip,kneeL:legL.knee,ankleL:legL.ankle,
      hipR:legR.hip,kneeR:legR.knee,ankleR:legR.ankle,
      shoulderL:armL.shoulder,elbowL:armL.elbow,wristL:armL.wrist,
      shoulderR:armR.shoulder,elbowR:armR.elbow,wristR:armR.wrist,
      neck, gun, body, upper, support, groundBox:new THREE.Box3()
    };
    support.forEach(m=>m.geometry.computeBoundingBox());
    g.userData.rig=rig;
    g.userData.gun=gun;
    g.userData.limbs=[rig.hipL,rig.hipR,rig.shoulderL,rig.shoulderR];
    g.userData.playerStyle='soft-cuboid-chibi-3d';
    poseChibi(g,{moving:false,bob:0,recoil:0,lookX:0,alive:true});
    return g;
  }
  /* ท่าถือปืนสองมือ: ไหล่ยก + ศอกงอ ปืนชี้ -Z · ขาแกว่งที่สะโพก/เข่า
     ท่า Free Fire: ย่อ / คุกเข่าข้างเดียว / หมอบ / หลบเอียงตัว */
  function poseChibi(mesh, st){
    const r=mesh&&mesh.userData&&mesh.userData.rig; if(!r) return r;
    const moving=!!(st&&st.moving), bob=Number(st&&st.bob)||0, recoil=Number(st&&st.recoil)||0;
    const alive=!(st&&st.alive===false);
    const pose=(st&&st.pose)||'stand';
    const dodge=Number(st&&st.dodge)||0;
    const swing=Math.sin(bob)*(moving?.62:0);
    if(r.body){
      r.body.rotation.set(alive&&pose==='prone'?-Math.PI/2:0,0,0);
      r.body.position.y=0;
      r.upper.rotation.set(alive&&pose==='crouch'?-.22:0,0,alive&&pose!=='prone'?-dodge*.38:0);
      r.upper.position.x=alive&&pose==='prone'?dodge*.12:0;
    }
    r.hipL.rotation.set(swing,0,.05);
    r.hipR.rotation.set(-swing,0,-.05);
    r.kneeL.rotation.set(-Math.max(.04, moving?(.4-swing)*.85:.04),0,0);
    r.kneeR.rotation.set(-Math.max(.04, moving?(.4+swing)*.85:.04),0,0);
    r.ankleL.rotation.set(-r.hipL.rotation.x-r.kneeL.rotation.x,0,0);
    r.ankleR.rotation.set(-r.hipR.rotation.x-r.kneeR.rotation.x,0,0);
    if(!alive){
      r.shoulderL.rotation.set(.4,.1,.5); r.elbowL.rotation.set(-.5,0,0); r.wristL.rotation.set(0,0,0);
      r.shoulderR.rotation.set(.35,-.1,-.5); r.elbowR.rotation.set(-.45,0,0); r.wristR.rotation.set(0,0,0);
      r.neck.rotation.set(.35,0,0);
      return r;
    }
    if(pose==='crouch'){
      r.hipL.rotation.set(1.2+swing*.12,0,.08);
      r.hipR.rotation.set(1.2-swing*.12,0,-.08);
      r.kneeL.rotation.set(-2,0,0); r.kneeR.rotation.set(-2,0,0);
      r.ankleL.rotation.set(-r.hipL.rotation.x+2,0,0);
      r.ankleR.rotation.set(-r.hipR.rotation.x+2,0,0);
    }else if(pose==='kneel'){
      r.hipR.rotation.set(-.35,0,-.08); r.kneeR.rotation.set(-1.45,0,0);
      r.ankleR.rotation.set(1.8,0,0);
      r.hipL.rotation.set(1.4,0,.08); r.kneeL.rotation.set(-1.65,0,0);
      r.ankleL.rotation.set(.25,0,0);
    }else if(pose==='prone'){
      r.hipL.rotation.set(.04,0,.16+swing*.08);
      r.hipR.rotation.set(.04,0,-.16-swing*.08);
      r.kneeL.rotation.set(-.08,0,0); r.kneeR.rotation.set(-.08,0,0);
      r.ankleL.rotation.set(0,0,0); r.ankleR.rotation.set(0,0,0);
    }
    const kick=recoil;
    r.shoulderR.rotation.set(1.18+kick*.28, .12, .38);
    r.elbowR.rotation.set(1.22-kick*.1, -.06, -.18);
    r.wristR.rotation.set(-.18, .2, .16);
    const hold=Math.sin(bob*.55)*0.04;
    r.shoulderL.rotation.set(1.05+hold, -.18, -.42);
    r.elbowL.rotation.set(1.12, .1, .12);
    r.wristL.rotation.set(-.1, -.2, -.18);
    if(pose==='prone'){
      r.shoulderR.rotation.set(1.05+kick*.1,0,.12); r.elbowR.rotation.set(2,0,0);
      r.shoulderL.rotation.set(1.05,0,-.12); r.elbowL.rotation.set(2,0,0);
    }
    r.neck.rotation.set((pose==='prone'?Math.PI/2:pose==='crouch'?.22:0)+(Number(st&&st.lookX)||0),0,0);
    if(r.body){
      // Root owns yaw only. Pose axes stay local at every compass heading.
      // Reuse cached bounds: feet/knees/elbows support the same rendered hit meshes.
      mesh.updateWorldMatrix(true,true);
      let floor=Infinity;
      for(const part of r.support){
        r.groundBox.copy(part.geometry.boundingBox).applyMatrix4(part.matrixWorld);
        floor=Math.min(floor,r.groundBox.min.y);
      }
      r.body.position.y=mesh.position.y+.03-floor;
    }
    if(r.gun && tmpV && tmpV2){
      // Aim in world space: lying down must never rotate the barrel into the floor.
      mesh.updateWorldMatrix(true,true);
      r.gun.getWorldPosition(tmpV);
      tmpV2.set(0,.04+kick*.3+(Number(st&&st.lookX)||0)*5,-5).applyQuaternion(mesh.quaternion).add(tmpV);
      r.gun.lookAt(tmpV2);
    }
    return r;
  }
  function makeHouse(spec){
    const g=new THREE.Group();
    const wall=box(5.2,3.2,5.2,spec.col,0,1.6,0);
    const roof=new THREE.Mesh(new THREE.ConeGeometry(4.2,2.2,4), mat(0xfff3e0));
    roof.position.y=3.9; roof.rotation.y=Math.PI/4;
    const door=box(1.2,1.8,.2,0x6d4c41,0,.9,-2.62);
    const win=box(.8,.8,.12,0xb3e5fc,-1.4,2.1,-2.62);
    const win2=box(.8,.8,.12,0xb3e5fc,1.4,2.1,-2.62);
    const flag=box(.08,1.4,.08,0xffffff,2.2,3.4,0);
    const banner=box(1.1,.4,.08,spec.col,2.7,3.9,0);
    g.add(wall,roof,door,win,win2,flag,banner);
    g.position.set(spec.x,0,spec.z);
    g.userData.home=spec; g.userData.solid=true;
    return g;
  }
  function letterTex(ch){
    const c=document.createElement('canvas'); c.width=128; c.height=160;
    const q=c.getContext('2d');
    q.fillStyle='#fff7ed'; q.roundRect(8,8,112,144,18); q.fill();
    q.strokeStyle='#fb7185'; q.lineWidth=6; q.stroke();
    q.fillStyle='#be123c'; q.font='900 92px Kanit,system-ui,sans-serif';
    q.textAlign='center'; q.textBaseline='middle'; q.fillText(ch,64,84);
    const t=new THREE.CanvasTexture(c); t.needsUpdate=true; return t;
  }
  function makeLetterCard(ch){
    const g=new THREE.Group();
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.6), new THREE.MeshBasicMaterial({map:letterTex(ch),transparent:true,side:THREE.DoubleSide}));
    mesh.position.y=.98; g.add(mesh);          // ต่ำกว่าระดับตา ไม่บังแนวเล็ง
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.55,10), new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.18}));
    shadow.rotation.x=-Math.PI/2; shadow.position.y=.02; g.add(shadow);
    g.userData.letter=ch; return g;
  }

  function remainNeeded(){
    const remain={}, target=word&&word.w||'';
    if(!target) return remain;
    wordMarks(stored, target).forEach((done,i)=>{ if(!done) remain[target[i]]=(remain[target[i]]||0)+1; });
    return remain;
  }
  function spawnLetters(){
    fieldLetters.forEach(it=>{ if(it.mesh&&scene) scene.remove(it.mesh); });
    fieldLetters=[];
    for(let i=0;i<ALPHABET.length;i++){
      const ang=i/26*Math.PI*2, r=9+(i%3)*3.2;
      const x=Math.cos(ang)*r, z=Math.sin(ang)*r;
      placeLetter(ALPHABET[i], x, z);
    }
  }
  function placeLetter(letter,x,z){
    const ch=String(letter||'').toUpperCase().replace(/[^A-Z]/g,'').charAt(0);
    if(!ch) return null;
    let it=fieldLetters.find(L=>L.letter===ch);
    if(!it){ it={letter:ch,x:x,z:z,mesh:null,up:true}; fieldLetters.push(it); }
    it.x=x; it.z=z; it.up=true;
    if(!it.mesh && scene){ it.mesh=makeLetterCard(ch); scene.add(it.mesh); }
    if(it.mesh){ it.mesh.position.set(x,0,z); it.mesh.visible=true; }
    return it;
  }
  function hideLetter(ch){
    const it=fieldLetters.find(L=>L.letter===ch);
    if(!it) return;
    it.up=false;
    if(it.mesh) it.mesh.visible=false;
  }
  /* ตัวอักษรในบ้าน = ของเราคนเดียว ใครมายิง/เดินทับ/ตายก็ขโมยไม่ได้ */
  function syncVault(){
    vaultMeshes.forEach(m=>{ if(scene&&m.parent) scene.remove(m); });
    vaultMeshes=[];
    if(!scene || typeof THREE==='undefined' || !THREE) return;
    const h=homeOf(player.seat);
    const chars=String(stored||'');
    for(let i=0;i<chars.length;i++){
      const card=makeLetterCard(chars[i]);
      const ang=-.7+i*.2, rad=1.55;
      card.position.set(h.x+Math.sin(ang)*rad, .2, h.z+Math.cos(ang)*rad);
      card.userData.safe=true;
      scene.add(card); vaultMeshes.push(card);
    }
  }
  function tryPickup(){
    if(carried || !player.alive) return '';
    for(let i=0;i<fieldLetters.length;i++){
      const it=fieldLetters[i];
      if(!it.up || it.safe) continue;
      if(Math.hypot(player.x-it.x, player.z-it.z)>PICKUP_R) continue;
      carried=it.letter; hideLetter(it.letter);
      emitEvent('P|'+it.letter);
      beep('ok'); renderHud();
      return carried;
    }
    return '';
  }
  function homeOf(seat){ return HOMES[(seat%HOMES.length+HOMES.length)%HOMES.length]; }
  function tryDeposit(){
    if(!carried || !player.alive) return '';
    const h=homeOf(player.seat);
    if(Math.hypot(player.x-h.x, player.z-h.z)>HOME_R) return '';
    stored+=carried;
    const got=carried; carried='';
    hideLetter(got);
    syncVault();
    beep('hit'); completeWord(); renderHud();
    showToast('ฝาก '+got+' ไว้ในบ้านแล้ว · ปลอดภัย');
    return got;
  }
  function dropCarried(){
    if(!carried) return '';
    const fx=-Math.sin(player.yaw)*2.4, fz=-Math.cos(player.yaw)*2.4;
    const x=clamp(player.x+fx, -ARENA+2, ARENA-2);
    const z=clamp(player.z+fz, -ARENA+2, ARENA-2);
    const got=carried; carried='';
    placeLetter(got,x,z);
    emitEvent('D|'+got+'|'+Math.round(x)+'|'+Math.round(z));
    beep('miss'); renderHud();
    return got;
  }
  function completeWord(){
    if(!word||!word.w||!hasWord(stored, word.w)) return false;
    let next=stored;
    for(const ch of word.w) next=next.replace(ch,'');
    stored=next; wordsDone++; creditReward();
    syncVault();
    beep('win');
    word=takeWord(); spawnLetters(); renderHud();
    showToast('ครบคำ! +'+LETTER_REWARD+' เหรียญ');
    return true;
  }

  function ac(){
    if(typeof state!=='undefined' && !state.sound) return null;
    try{
      audio=audio||new (window.AudioContext||window.webkitAudioContext)();
      if(audio.state==='suspended') audio.resume().catch(()=>{});
      return audio;
    }catch(_){ return null; }
  }
  function beep(kind){
    const ctx=ac(); if(!ctx) return;
    const t=ctx.currentTime, o=ctx.createOscillator(), g=ctx.createGain();
    const tab={ok:[520,720,.08],hit:[340,180,.1],miss:[180,90,.12],win:[660,990,.22],shot:[140,70,.07],head:[880,220,.16]};
    const p=tab[kind]||tab.ok;
    o.type=kind==='shot'?'square':'sine'; o.frequency.setValueAtTime(p[0],t); o.frequency.exponentialRampToValueAtTime(p[1],t+p[2]);
    g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.001,t+p[2]+.04);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+p[2]+.05);
  }
  /* ปืนลมชุดเดียวกับยิงเป้าคำ — noise puff สั้น */
  function shotSound(){
    const ctx=ac(); if(!ctx) return;
    const t=ctx.currentTime, n=ctx.createBuffer(1, ctx.sampleRate*0.2, ctx.sampleRate);
    const d=n.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const s=ctx.createBufferSource(); s.buffer=n;
    const f=ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1400; f.Q.value=0.8;
    const g=ctx.createGain(); g.gain.setValueAtTime(.22,t); g.gain.exponentialRampToValueAtTime(.001,t+.09);
    s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t); s.stop(t+.12);
  }

  function emitEvent(payload){
    eventSeq=(eventSeq+1)%999;
    lastEvent=String(payload||'-').slice(0,58);
  }
  function packHp(){
    const c=carried||'-';
    return ('K|'+(player.alive?player.hp:0)+'|'+c+'|'+player.seat).slice(0,28);
  }
  function parseHp(s){
    const p=String(s||'').split('|');
    if(p[0]!=='K') return {hp:MAX_HP,carry:'',seat:0};
    return {hp:clamp(parseInt(p[1],10)||0,0,MAX_HP), carry:p[2]==='-'?'':String(p[2]||'').charAt(0), seat:clamp(parseInt(p[3],10)||0,0,3)};
  }

  /* บ้านทุกหลังทึบ (ฝากตัวอักษรจากนอกกำแพงได้ เพราะ HOME_R กว้างกว่าตัวบ้าน)
     ชนแล้วลองไถลตามแกนที่ยังว่าง เพื่อไม่ให้ติดมุมบ้าน */
  function homeBlocked(x,z){
    return HOMES.some(h=>Math.abs(x-h.x)<HOUSE_HALF && Math.abs(z-h.z)<HOUSE_HALF);
  }
  function collideMove(nx,nz){
    nx=clamp(nx,-ARENA+.8,ARENA-.8); nz=clamp(nz,-ARENA+.8,ARENA-.8);
    if(!homeBlocked(nx,nz)){ player.x=nx; player.z=nz; return; }
    if(!homeBlocked(nx,player.z)){ player.x=nx; return; }
    if(!homeBlocked(player.x,nz)){ player.z=nz; }
  }
  /* เกิดที่หน้าบ้านตัวเอง หันหน้าออกกลางสนาม (ไม่ใช่หันเข้าผนังบ้าน)
     ระยะ 4.5 > HOUSE_HALF จึงไม่ติดกำแพง แต่ยังอยู่ในรัศมีฝากตัวอักษร */
  function spawnAtHome(){
    const h=homeOf(player.seat);
    const len=Math.hypot(h.x,h.z)||1;
    const fx=-h.x/len, fz=-h.z/len;            // ทิศไปกลางสนาม
    player.x=h.x+fx*4.5; player.z=h.z+fz*4.5;
    player.yaw=Math.atan2(-fx,-fz); lookYaw=player.yaw;
    player.hp=MAX_HP; player.alive=true; player.respawnAt=0;
    dodgeT=0; setStance('stand'); clearInput();
  }
  function applyDamage(kind, fromName){
    if(!player.alive) return false;
    if(kind==='H' || kind==='head'){
      player.hp=0; player.alive=false; player.respawnAt=elapsed+2.2;
      if(carried) dropCarried();
      const kept=stored?(' · ตัวอักษรในบ้านปลอดภัย ('+stored+')'):'';
      beep('head'); showToast((fromName||'โดนหัว')+' · ตายทันที'+kept);
      return true;
    }
    player.hp=Math.max(0, player.hp-BODY_DMG);
    beep('hit'); showToast('-'+BODY_DMG+' HP');
    if(player.hp<=0){
      player.alive=false; player.respawnAt=elapsed+2.2;
      if(carried) dropCarried();
      showToast(stored?('หมดแรง · ตัวอักษรในบ้านปลอดภัย'):'หมดแรง · เกิดใหม่ที่บ้าน');
    }
    renderHud(); return true;
  }
  function hitPartFromObject(obj){
    let o=obj; while(o){ if(o.userData && o.userData.hit) return o.userData.hit; o=o.parent; }
    return '';
  }

  function fire(){
    const now=performance.now();
    if(now-lastShot<COOLDOWN || !running || !player.alive) return false;
    lastShot=now; shotSound(); shake=.035; player.recoil=1;
    if(!raycaster||!camera) return false;
    camera.updateMatrixWorld();          // กันเรย์ใช้เมทริกซ์กล้องค้างจากเฟรมก่อน
    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
    const targets=[];
    bots.forEach(b=>{ if(b.mesh&&b.alive) targets.push(b.mesh); });
    Object.keys(peersVis).forEach(uid=>{ const v=peersVis[uid]; if(v&&v.mesh) targets.push(v.mesh); });
    const hits=raycaster.intersectObjects(targets, true);
    const h=hits[0];
    if(!h) return true;
    const part=hitPartFromObject(h.object)||'body';
    const rootObj=(()=>{ let o=h.object; while(o&&!o.userData.skirmish) o=o.parent; return o; })();
    if(!rootObj) return true;
    if(rootObj.userData.bot){
      const b=rootObj.userData.bot;
      if(part==='head'){ b.hp=0; b.alive=false; b.respawnAt=elapsed+2.5; beep('head'); showToast('เฮดช็อต!'); }
      else { b.hp=Math.max(0,b.hp-BODY_DMG); if(b.hp<=0){ b.alive=false; b.respawnAt=elapsed+2.5; } beep('hit'); }
      if(b.mesh) b.mesh.visible=b.alive;
      return true;
    }
    if(rootObj.userData.uid){
      const uid=rootObj.userData.uid;
      emitEvent('H|'+(part==='head'?'H':'B')+'|'+String(uid).slice(-8));
      showToast(part==='head'?'เล็งหัว!':'โดนตัว');
    }
    return true;
  }

  function applyPeerEvent(uid, rec){
    const cw=String((rec&&rec.cw)||'-');
    if(!cw || cw==='-') return;
    const key=uid+':'+cw;
    if(seenShot[key]) return;
    const keep=Object.keys(seenShot);
    if(keep.length>240) keep.slice(0,120).forEach(k=>{ delete seenShot[k]; });
    seenShot[key]=1;
    const p=cw.split('|');
    if(p[0]==='P' && p[1]) hideLetter(p[1]);
    else if(p[0]==='D' && p[1]) placeLetter(p[1], Number(p[2])||0, Number(p[3])||0);
    else if(p[0]==='H'){
      const mine=String(myUid||'').slice(-8);
      if(p[2]===mine || p[2]===myUid) applyDamage(p[1], rec.n||'เพื่อน');
    }
  }

  function netSend(){
    if(!room || typeof room.send!=='function') return;
    room.send({
      n:String((typeof state!=='undefined'&&state.profileName)||'แอดมิน').slice(0,40),
      x:+player.x.toFixed(2), z:+player.z.toFixed(2), y:+stanceSpec().y.toFixed(2),
      yaw:+player.yaw.toFixed(3),
      av:packAv(),
      hp:packHp(), cw:lastEvent, w:wordsDone, c:'-', m:player.alive?0:1
    });
  }
  function syncPeers(){
    if(!room) return;
    const peers=room.peers||{};
    Object.keys(peers).forEach(uid=>{
      const rec=peers[uid]||{};
      applyPeerEvent(uid, rec);
      let vis=peersVis[uid];
      if(!vis){
        const st=parseHp(rec.hp);
        const mesh=makeChibi({shirt:PAL[st.seat%PAL.length], pants:0x3949ab, skin:0xffcf9e, hair:0x4e342e}, true);
        mesh.userData.skirmish=true; mesh.userData.uid=uid;
        scene.add(mesh); vis=peersVis[uid]={mesh,uid}; 
      }
      const st=parseHp(rec.hp);
      const pose=parseAv(rec.av);
      const spec=stanceSpec(pose.pose);
      const lean=pose.dodge;
      vis.mesh.position.set(Number(rec.x)||0, spec.y, Number(rec.z)||0);
      vis.mesh.rotation.set(0, Number(rec.yaw)||0, st.hp>0?0:Math.PI/2);
      vis.mesh.visible=st.hp>0;
      if(vis.lastX!=null&&Math.hypot(vis.mesh.position.x-vis.lastX,vis.mesh.position.z-vis.lastZ)>.001) vis.movingUntil=elapsed+.2;
      const moving=!lean&&elapsed<(vis.movingUntil||0);
      vis.lastX=vis.mesh.position.x; vis.lastZ=vis.mesh.position.z;
      poseChibi(vis.mesh,{moving,bob:elapsed*7,alive:st.hp>0,pose:pose.pose,dodge:lean});
    });
    Object.keys(peersVis).forEach(uid=>{
      if(!peers[uid]){ scene.remove(peersVis[uid].mesh); delete peersVis[uid]; }
    });
  }
  function assignSeat(){
    const ids=[myUid].concat(room?Object.keys(room.peers||{}):[]).filter(Boolean).sort();
    const i=Math.max(0, ids.indexOf(myUid));
    const next=i%HOMES.length;
    if(next!==player.seat){ player.seat=next; spawnAtHome(); }
  }
  function startNet(){
    if(typeof NetRoom==='undefined' || !NetRoom.create) return;
    myUid=(typeof onlineKey==='function'?onlineKey():'')||('local-'+Math.random().toString(36).slice(2,8));
    room=NetRoom.create({
      map:'skirmish', roomMax:8, sendMs:170,
      roomNoun:'สนามยิงรบ', roomIcon:'🔫',
      push:()=>netSend(),
      onPeer:function(){ assignSeat(); },
      onPeerGone:function(){ assignSeat(); },
      onStatus:function(){ if(hud.net) hud.net.textContent=room&&room.statusText?room.statusText():''; },
      toast:function(msg){ netToast=String(msg||'').replace(/<[^>]+>/g,' '); if(hud.net) hud.net.textContent=netToast; }
    });
    if(room && room.join) room.join();
    assignSeat();
  }

  function tickBots(dt){
    bots.forEach((b,i)=>{
      if(!b.alive){
        if(elapsed>=b.respawnAt){ b.alive=true; b.hp=MAX_HP; if(b.mesh) b.mesh.visible=true; }
        return;
      }
      b.t=(b.t||0)+dt;
      const h=HOMES[(i+2)%HOMES.length];
      b.x=h.x+Math.sin(b.t*.6+i)*5; b.z=h.z+Math.cos(b.t*.6+i)*5;
      if(b.mesh){
        b.mesh.position.set(b.x,0,b.z); b.mesh.rotation.y=b.t; b.mesh.visible=true;
        poseChibi(b.mesh,{moving:true,bob:b.t*8,alive:true});
      }
    });
  }
  function tickLetters(){
    if(carried) tryDeposit(); else tryPickup();
    fieldLetters.forEach(it=>{
      if(it.mesh && it.up){
        it.mesh.position.y=Math.sin(elapsed*3+(it.x||0))*.12;
        if(camera) it.mesh.lookAt(camera.position.x, it.mesh.position.y, camera.position.z);
      }
    });
    vaultMeshes.forEach((m,i)=>{
      if(!m) return;
      m.position.y=.2+Math.sin(elapsed*2+i)*.06;
      if(camera) m.lookAt(camera.position.x, m.position.y, camera.position.z);
    });
  }
  function applyLook(dx, dy){
    lookYaw-=dx*0.006;
    lookPitch=clamp(lookPitch+dy*0.004, .08, .62);
  }
  function shoulderOrigin(){
    return {x:player.x+Math.cos(lookYaw)*CAM_SHOULDER, z:player.z-Math.sin(lookYaw)*CAM_SHOULDER};
  }
  function aimPoint(){
    const o=shoulderOrigin();
    const spec=stanceSpec();
    const fx=-Math.sin(lookYaw), fz=-Math.cos(lookYaw);
    return {
      x:o.x+fx*AIM_AHEAD,
      y:spec.look+(PITCH_DEF-lookPitch)*PITCH_GAIN,
      z:o.z+fz*AIM_AHEAD
    };
  }
  function cameraTick(){
    if(!camera) return;
    const o=shoulderOrigin();
    const spec=stanceSpec();
    camera.position.set(o.x+Math.sin(lookYaw)*CAM_DIST, spec.cam, o.z+Math.cos(lookYaw)*CAM_DIST);
    const a=aimPoint();
    camera.lookAt(a.x, a.y, a.z);
    if(shake>0){
      camera.position.x+=(Math.random()-.5)*shake*4;
      camera.position.y+=(Math.random()-.5)*shake*3;
      shake*=.82; if(shake<.002) shake=0;
    }
  }
  function walkAnim(dt, moving){
    if(!playerMesh) return;
    const spec=stanceSpec();
    const lean=player.alive?dodgeAmt():0;
    playerMesh.position.set(player.x, player.alive?spec.y:-.4, player.z);
    playerMesh.rotation.set(0, player.yaw, player.alive?0:Math.PI/2);
    playerMesh.visible=true;
    player.bob+=dt*(moving?10:2);
    if(player.recoil>0) player.recoil=Math.max(0, player.recoil-dt*8);
    poseChibi(playerMesh,{
      moving, bob:player.bob, recoil:player.recoil||0,
      lookX:(PITCH_DEF-lookPitch)*0.9, alive:player.alive,
      pose:stance, dodge:lean
    });
  }

  function step(dt){
    if(!running||paused) return;
    elapsed+=dt;
    if(!player.alive){
      if(player.respawnAt && elapsed>=player.respawnAt) spawnAtHome();
    }else{
      const fx=clamp(((keys.f?1:0)+(joy.z<0?-joy.z:0)) - ((keys.b?1:0)+(joy.z>0?joy.z:0)),-1,1);
      const sx=clamp(((keys.r?1:0)+(joy.x>0?joy.x:0)) - ((keys.l?1:0)+(joy.x<0?-joy.x:0)),-1,1);
      if(sx) lastStrafe=sx>0?1:-1;
      /* จอย/คีย์ = เดินตามกล้อง · AUTO = วิ่งเข้าหน้าบ้านตัวเอง (เล็งกล้องได้อยู่) */
      let mx=-Math.sin(lookYaw)*fx + Math.cos(lookYaw)*sx;
      let mz=-Math.cos(lookYaw)*fx - Math.sin(lookYaw)*sx;
      if(autoRun){
        if(atOwnHome()){ finishAutoHome(); mx=0; mz=0; }
        else{
          const t=homeApproach();
          const dx=t.x-player.x, dz=t.z-player.z, len=Math.hypot(dx,dz)||1;
          if(len<0.85){ collideMove(t.x,t.z); finishAutoHome(); mx=0; mz=0; }
          else{
            mx+=dx/len; mz+=dz/len;
            const mag=Math.hypot(mx,mz); if(mag>1){ mx/=mag; mz/=mag; }
          }
        }
      }
      const dodging=dodgeT>0;
      if(dodging){
        const before=1-dodgeT/DODGE_T, after=Math.min(1,before+dt/DODGE_T);
        // Integral of a half-sine: a two-unit sidestep, independent of frame rate.
        const distance=dodgeDir*(Math.cos(before*Math.PI)-Math.cos(after*Math.PI));
        collideMove(player.x+Math.cos(dodgeYaw)*distance,player.z-Math.sin(dodgeYaw)*distance);
      }
      const moving=Math.abs(mx)>.05||Math.abs(mz)>.05;
      if(moving){
        const spd=SPEED*stanceSpec().spd;
        collideMove(player.x+mx*spd*dt, player.z+mz*spd*dt);
        player.yaw=dodging?lookYaw:Math.atan2(-mx, -mz);
      }else{
        player.yaw=lookYaw;
      }
      if(dodging){ dodgeT=Math.max(0,dodgeT-dt); if(!dodgeT) paintPose(); }
      walkAnim(dt, moving);
      tickLetters();
    }
    tickBots(dt);
    cameraTick();
    if(room && room.tick) room.tick();
    syncPeers();
    netSend();
    if(playerMesh && !player.alive) playerMesh.rotation.z=Math.PI/2;
  }

  function renderHud(){
    if(!hud.hp) return;
    hud.hp.textContent=player.alive?('♥ '+player.hp):'หมดแรง';
    if(hud.coins) hud.coins.textContent=String(coinsRun);
    if(hud.wallet) hud.wallet.textContent=String(walletCoins());
    if(hud.vault) hud.vault.textContent=stored||'—';
    if(hud.carry) hud.carry.textContent=carried||'—';
    if(hud.th) hud.th.textContent=word?word.th:'—';
    if(hud.en){
      const marks=wordMarks(stored, word&&word.w);
      hud.en.textContent=word?word.w.split('').map((ch,i)=>marks[i]?ch:'_').join(' '):'';
    }
    if(hud.drop) hud.drop.disabled=!carried;
    if(hud.hint) hud.hint.textContent=player.alive
      ? (autoRun?('กำลังวิ่งกลับ'+homeOf(player.seat).name+' · กด AUTO เพื่อหยุด · เล็งขวายังได้')
        :(carried?('ถือ '+carried+' · ฝากที่บ้านแล้วปลอดภัย หรือ DROP ทิ้ง'):('เก็บตัวอักษรแล้วฝากที่'+homeOf(player.seat).name+' · ในบ้าน = ปลอดภัย')))
      : (stored?('กำลังเกิดใหม่ · ตัวอักษรในบ้านปลอดภัย ('+stored+')'):'กำลังเกิดใหม่ที่บ้าน…');
  }
  function showToast(msg){
    if(!hud.toast) return;
    hud.toast.textContent=msg; hud.toast.style.opacity='1';
    later(()=>{ if(hud.toast) hud.toast.style.opacity='0'; }, 1400);
  }

  function bind(){
    loadPad();
    root.addEventListener('pointerdown', e=>{
      if(hud.intro && !hud.intro.hidden) return;
      const hold=e.target.getAttribute && e.target.getAttribute('data-hold');
      const id=e.pointerId;
      if(hold==='fire' || hold==='drop' || hold==='auto' || hold==='crouch' || hold==='prone' || hold==='dodge'){
        e.preventDefault(); e.stopPropagation();
        try{ e.target.setPointerCapture(id); }catch(_){}
        pointers.set(id,{kind:'btn',act:hold,el:e.target,x:e.clientX,y:e.clientY,t0:performance.now(),drag:false});
        return;
      }
      if(e.target.closest && (e.target.closest('#skm-exit') || e.target.closest('.skm-card'))) return;
      const left=e.clientX < W*0.5;
      if(left){
        e.preventDefault();
        if([...pointers.values()].some(p=>p.kind==='joy')) return;
        const origin=placeCtl(hud.joy, e.clientX, e.clientY, 'joy');
        setJoyKnob(0,0); if(hud.joy) hud.joy.classList.add('skm-dragging');
        try{ root.setPointerCapture(id); }catch(_){}
        pointers.set(id,{kind:'joy',x:origin.x,y:origin.y});
        joy.x=0; joy.z=0;
        return;
      }
      e.preventDefault();
      try{ root.setPointerCapture(id); }catch(_){}
      pointers.set(id,{kind:'look',x:e.clientX,y:e.clientY});
    });
    root.addEventListener('pointermove', e=>{
      const p=pointers.get(e.pointerId); if(!p) return;
      if(p.kind==='look'){
        applyLook(e.clientX-p.x, e.clientY-p.y);
        p.x=e.clientX; p.y=e.clientY;
      }else if(p.kind==='joy'){
        let dx=e.clientX-p.x, dy=e.clientY-p.y, dist=Math.hypot(dx,dy);
        if(dist>JOY_R){
          p.x+=dx*(dist-JOY_R)/dist; p.y+=dy*(dist-JOY_R)/dist;
          const origin=placeCtl(hud.joy, p.x, p.y, 'joy');
          p.x=origin.x; p.y=origin.y;
          dx=e.clientX-p.x; dy=e.clientY-p.y; dist=Math.hypot(dx,dy);
        }
        joy.x=clamp(dx/JOY_R,-1,1); joy.z=clamp(dy/JOY_R,-1,1);
        if(Math.abs(joy.x)>.2) lastStrafe=joy.x>0?1:-1;
        setJoyKnob(joy.x, joy.z);
      }else if(p.kind==='btn'){
        const moved=Math.hypot(e.clientX-p.x, e.clientY-p.y);
        if(!p.drag && moved>8 && performance.now()-p.t0>=HOLD_MS){
          p.drag=true; if(p.el) p.el.classList.add('skm-dragging');
        }
        if(p.drag){
          placeCtl(p.el, e.clientX, e.clientY, p.act);
        }else if(moved>16){
          p.slid=true;
        }
      }
    });
    const up=e=>{
      const p=pointers.get(e.pointerId); if(!p) return;
      if(p.kind==='joy'){
        joy.x=0; joy.z=0; setJoyKnob(0,0); if(hud.joy) hud.joy.classList.remove('skm-dragging'); savePad();
      }else if(p.kind==='btn'){
        if(p.el) p.el.classList.remove('skm-dragging');
        if(p.drag) savePad();
        else if(e.type==='pointerup' && !p.slid){
          if(p.act==='fire') fire();
          else if(p.act==='drop') dropCarried();
          else if(p.act==='auto') toggleAuto();
          else if(p.act==='crouch') toggleStance('crouch');
          else if(p.act==='prone') toggleStance('prone');
          else if(p.act==='dodge') startDodge();
        }
      }
      pointers.delete(e.pointerId);
    };
    root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up);
    if(hud.exit) hud.exit.addEventListener('click', ()=>{ close(); });
    if(hud.introOk) hud.introOk.addEventListener('click', ()=>{ if(hud.intro) hud.intro.hidden=true; });
    window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', resize);
    window.addEventListener('blur', clearInput);
    document.addEventListener('visibilitychange',()=>{if(document.hidden) clearInput();});
  }
  function clearInput(){
    keys.f=keys.b=keys.l=keys.r=0; joy.x=joy.z=0;
    pointers.forEach(p=>{if(p.el) p.el.classList.remove('skm-dragging');}); pointers.clear();
    if(hud.joy) hud.joy.classList.remove('skm-dragging');
    setJoyKnob(0,0);
  }
  function onKey(e){
    if(!running || paused || (hud.intro&&!hud.intro.hidden)) return;
    if(e.repeat && ['KeyE','KeyC','KeyZ','KeyX','ControlLeft'].includes(e.code)){e.preventDefault(); return;}
    if(e.code==='KeyW'||e.code==='ArrowUp') keys.f=1;
    if(e.code==='KeyS'||e.code==='ArrowDown') keys.b=1;
    if(e.code==='KeyA'||e.code==='ArrowLeft') keys.l=1;
    if(e.code==='KeyD'||e.code==='ArrowRight') keys.r=1;
    if(e.code==='Space'||e.code==='KeyF'){ e.preventDefault(); fire(); }
    if(e.code==='KeyQ') dropCarried();
    if(e.code==='KeyE'){ e.preventDefault(); toggleAuto(); }
    if(e.code==='KeyC'){ e.preventDefault(); toggleStance('crouch'); }
    if(e.code==='KeyZ'){ e.preventDefault(); toggleStance('prone'); }
    if(e.code==='KeyX'||e.code==='ControlLeft'){ e.preventDefault(); startDodge(); }
    if(e.code==='Escape') close();
  }
  function onKeyUp(e){
    if(e.code==='KeyW'||e.code==='ArrowUp') keys.f=0;
    if(e.code==='KeyS'||e.code==='ArrowDown') keys.b=0;
    if(e.code==='KeyA'||e.code==='ArrowLeft') keys.l=0;
    if(e.code==='KeyD'||e.code==='ArrowRight') keys.r=0;
  }

  function buildWorld(){
    scene=new THREE.Scene(); scene.background=new THREE.Color(0x9be7ff); scene.fog=new THREE.Fog(0x9be7ff, 28, 70);
    camera=new THREE.PerspectiveCamera(FOV, 16/9, .1, 120);
    raycaster=new THREE.Raycaster(); tmpV=new THREE.Vector3(); tmpV2=new THREE.Vector3();
    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x7cb342, 1.05));
    const sun=new THREE.DirectionalLight(0xfff3c4, .55); sun.position.set(8,14,6); scene.add(sun);
    const ground=new THREE.Mesh(new THREE.CircleGeometry(ARENA+6, 36), mat(0x8ee08a));
    ground.rotation.x=-Math.PI/2; scene.add(ground);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(ARENA+1.2,.35,8,48), mat(0xfff59d));
    rim.rotation.x=Math.PI/2; rim.position.y=.2; scene.add(rim);
    homeMeshes=HOMES.map(makeHouse); homeMeshes.forEach(h=>scene.add(h));
    for(let i=0;i<10;i++){
      const t=box(.6,1.8,.6,0x66bb6a, Math.cos(i)*12, .9, Math.sin(i*1.7)*11);
      scene.add(t);
    }
    const palettes=[
      {shirt:0xff8fab,pants:0x5b8def,skin:0xffcf9e,hair:0x3b2a24},
      {shirt:0x7c4dff,pants:0x3949ab,skin:0xffd9ae,hair:0x6d4c2f}
    ];
    playerMesh=makeChibi(palettes[0], true); playerMesh.userData.skirmish=true; scene.add(playerMesh);
    bots=palettes.slice(1).map((p,i)=>{
      const mesh=makeChibi(p, true); mesh.userData.skirmish=true;
      const bot={mesh,x:8,z:8,hp:MAX_HP,alive:true,respawnAt:0,t:i};
      mesh.userData.bot=bot; scene.add(mesh); return bot;
    });
    spawnLetters();
  }
  function buildDom(){
    if(root) return;
    root=document.createElement('div'); root.id='skm-game';
    root.innerHTML=`
      <div class="skm-stage"></div>
      <div class="skm-cross" aria-hidden="true">+</div>
      <div class="skm-hud">
        <div class="skm-glass skm-stats"><b id="skm-hp">♥ 100</b><span>รอบนี้ <b id="skm-coins">0</b></span><span>กระเป๋า <b id="skm-wallet">0</b></span><small id="skm-net"></small></div>
        <div class="skm-glass skm-word"><small>ฝากตัวอักษรที่บ้านแล้วสะกด</small><strong id="skm-th">—</strong><em id="skm-en"></em><span class="skm-bank">ถือ <b id="skm-carry">—</b> · บ้าน <b id="skm-vault">—</b></span></div>
        <button type="button" class="skm-exit" id="skm-exit">ออก</button>
        <div class="skm-hint" id="skm-hint"></div>
      </div>
      <div class="skm-zones" aria-hidden="true">
        <div class="skm-zone" id="skm-zone-move"></div>
        <div class="skm-zone" id="skm-zone-look"></div>
      </div>
      <button type="button" class="skm-joy" data-hold="joy" id="skm-joy" aria-label="เดิน"><span class="skm-joy-knob"></span><span class="skm-joy-lab">เดิน</span></button>
      <button type="button" class="skm-float" id="skm-auto" data-hold="auto" aria-label="วิ่งกลับบ้านอัตโนมัติ" aria-pressed="false">AUTO</button>
      <button type="button" class="skm-float" id="skm-crouch" data-hold="crouch" aria-label="ย่อ">ย่อ</button>
      <button type="button" class="skm-float" id="skm-prone" data-hold="prone" aria-label="หมอบ">หมอบ</button>
      <button type="button" class="skm-float" id="skm-dodge" data-hold="dodge" aria-label="หลบ">หลบ</button>
      <button type="button" class="skm-float" id="skm-drop" data-hold="drop">DROP</button>
      <button type="button" class="skm-float" id="skm-fire" data-hold="fire">FIRE</button>
      <div class="skm-toast" id="skm-toast"></div>
      <div class="skm-modal" id="skm-intro">
        <div class="skm-card">
          <h2>🔫 ยิงรบคำ</h2>
          <p>มุมมองบุคคลที่สาม เดินอิสระ ยิงปืนลมแบบยิงเป้าคำ</p>
          <p>โดนหัว = ตายทันที · โดนตัว = ลด HP ตามดาเมจปืน</p>
          <p>เก็บตัวอักษร ฝากที่บ้านตัวเอง สะกดคำได้ 1,000 เหรียญ · ของในบ้านปลอดภัย ตายแล้วไม่หลุด</p>
          <p>ซ้าย = เดิน · AUTO กลับบ้าน · ย่อ/หมอบคนละปุ่ม · หลบเอียงตัว · ขวา = เล็ง · เพื่อนเห็นท่าเดียวกัน</p>
          <p>เล่นออนไลน์ได้หลายคน (เฉพาะแอดมินขณะทดสอบ)</p>
          <button type="button" id="skm-intro-ok">เริ่มเล่น</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    hud={
      hp:root.querySelector('#skm-hp'), coins:root.querySelector('#skm-coins'), wallet:root.querySelector('#skm-wallet'),
      vault:root.querySelector('#skm-vault'), carry:root.querySelector('#skm-carry'),
      th:root.querySelector('#skm-th'), en:root.querySelector('#skm-en'),
      hint:root.querySelector('#skm-hint'), toast:root.querySelector('#skm-toast'),
      exit:root.querySelector('#skm-exit'), intro:root.querySelector('#skm-intro'),
      introOk:root.querySelector('#skm-intro-ok'), drop:root.querySelector('#skm-drop'),
      fire:root.querySelector('#skm-fire'), joy:root.querySelector('#skm-joy'),
      auto:root.querySelector('#skm-auto'),
      crouch:root.querySelector('#skm-crouch'), prone:root.querySelector('#skm-prone'), dodge:root.querySelector('#skm-dodge'),
      joyKnob:root.querySelector('.skm-joy-knob'), net:root.querySelector('#skm-net')
    };
    bind(); built=true;
  }
  function resize(){
    if(!root) return;
    W=root.clientWidth||innerWidth; H=root.clientHeight||innerHeight;
    dpr=Math.min(DPR_CAP, window.devicePixelRatio||1);
    if(camera){ camera.aspect=W/Math.max(1,H); camera.updateProjectionMatrix(); }
    if(renderer) renderer.setSize(W,H,false);
    layoutPad();
  }
  function loop(t){
    if(!running) return;
    const dt=Math.min(.05, last? (t-last)/1000 : .016); last=t;
    step(dt); renderHud();
    if(renderer&&scene&&camera) renderer.render(scene,camera);
    raf=requestAnimationFrame(loop);
  }
  function resetRun(){
    word=takeWord(); stored=''; carried=''; wordsDone=0;
    beginCoinSession(); player.seat=0; spawnAtHome(); spawnLetters();
    bots.forEach(b=>{ b.hp=MAX_HP; b.alive=true; });
    syncVault();
  }

  async function open(){
    if(!adminAllowed()){
      if(typeof toast==='function') toast(LOCK_MSG);
      return;
    }
    if(opening) return; opening=true;
    try{
      if(!window.THREE){
        if(typeof toast==='function') toast('🔫 กำลังเปิดยิงรบคำ...');
        if(typeof loadScriptOnce!=='function') throw new Error('no loader');
        await loadScriptOnce('js/vendor/three.min.js');
      }
      THREE=window.THREE;
      buildDom();
      if(!renderer){
        renderer=new THREE.WebGLRenderer({antialias:false, alpha:false});
        renderer.setPixelRatio(Math.min(DPR_CAP, devicePixelRatio||1));
        root.querySelector('.skm-stage').appendChild(renderer.domElement);
      }
      if(!scene) buildWorld();
      root.style.display='block';
      resize(); resetRun();
      running=true; paused=false; last=0;
      if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
      ac(); startNet(); renderHud();
      requestAnimationFrame(loop);
    }catch(e){
      console.error('WordSkirmish open fail', e);
      if(typeof toast==='function') toast('⚠️ เปิดยิงรบคำไม่สำเร็จ');
    }
    opening=false;
  }
  function close(){
    running=false; paused=true; setAutoRun(false); dodgeT=0; setStance('stand'); clearInput(); settleCoinSession();
    if(raf) cancelAnimationFrame(raf); raf=0;
    clearTimers();
    if(room && room.leave) room.leave(); room=null;
    Object.keys(peersVis).forEach(uid=>{ if(scene&&peersVis[uid].mesh) scene.remove(peersVis[uid].mesh); });
    peersVis={};
    vaultMeshes.forEach(m=>{ if(scene&&m.parent) scene.remove(m); }); vaultMeshes=[];
    if(root) root.style.display='none';
    if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
    try{ if(audio&&audio.state==='running') audio.suspend(); }catch(_){}
    if(typeof saveState==='function') saveState();
    if(typeof renderDashboard==='function') renderDashboard();
  }

  window.WordSkirmish={ open, close, refreshLock:typeof refreshSkirmishLock==='function'?refreshSkirmishLock:function(){}, _t:{
    MINLEN, MAXLEN, LETTER_REWARD, COOLDOWN, BODY_DMG, MAX_HP, SPEED, PICKUP_R, HOME_R, HOUSE_HALF, ARENA, CAM_DIST, FOV, HOMES, LOCK_MSG,
    pool, takeWord, wordMarks, hasWord, creditReward, settleCoinSession, beginCoinSession, walletCoins,
    tryPickup, tryDeposit, dropCarried, completeWord, placeLetter, spawnLetters, applyDamage, packHp, parseHp,
    fire, step, resetRun, collideMove, homeBlocked, homeOf, adminAllowed, aimPoint, poseChibi, makeChibi,
    placeCtl, layoutPad, syncVault, HOLD_MS, JOY_R, toggleAuto, setAutoRun, homeApproach, atOwnHome,
    STANCES, stanceSpec, setStance, toggleStance, startDodge, packAv, parseAv, onKey, onKeyUp, clearInput,
    syncPeers, setRoom(value){room=value;}, get peersVis(){return peersVis;},
    setLook(y,p){ if(y!=null) lookYaw=y; if(p!=null) lookPitch=p; return {lookYaw,lookPitch}; },
    applyLook,
    get word(){return word;}, get stored(){return stored;}, get carried(){return carried;}, get letters(){return fieldLetters;},
    get player(){return player;}, get bots(){return bots;}, get running(){return running;}, get coinsRun(){return coinsRun;},
    get camera(){return camera;}, get scene(){return scene;}, get renderer(){return renderer;}, get playerMesh(){return playerMesh;},
    get padPos(){return padPos;}, get vaultMeshes(){return vaultMeshes;}, get autoRun(){return autoRun;},
    get stance(){return stance;}, get dodgeT(){return dodgeT;},
    setStored(s){ stored=String(s||''); syncVault(); return stored; }, setCarried(s){ carried=String(s||''); return carried; },
    setPlayer(p){ Object.assign(player,p||{}); return player; },
    setRunning(v){ running=!!v; }
  }};
})();
