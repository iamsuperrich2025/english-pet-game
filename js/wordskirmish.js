"use strict";
/* ============================================================
   🔫 wordskirmish.js — รบคำ Battle Royale + โหมดฝึก รอบ 1526
   กล้องไหล่ / SCOPE / อาวุธ / ท่าทาง / HUD · กติกาและสนามแยกโมดูล BR/Field
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
  const SCOPE_ZOOM=2.5, SCOPE_FOV=2*Math.atan(Math.tan(FOV*Math.PI/360)/SCOPE_ZOOM)*180/Math.PI;
  const SHOT_RANGE=100, SHOT_SPEED=120;
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
  let lookYaw=0,lookPitch=PITCH_DEF,shake=0,shakeX=0,shakeY=0,scoped=false;
  let shotBlockers=[],shotTargets=[],shotHits=[],shotTrails=[],shotCursor=0,lastShotTrace=null,aimNdc=null;
  let keys={f:0,b:0,l:0,r:0}, joy={x:0,z:0}, autoRun=false, pointers=new Map();
  let lastShot=0,eventSeq=0,lastEvent='-',seenShot={};
  let playerMesh=null,gunMesh=null,homeMeshes=[],vaultMeshes=[],bots=[],peersVis={};
  let room=null,myUid='',netToast='';
  let audio=null,saveTimer=0,timers=new Set();
  const PAD_KEY='skmPad1', HOLD_MS=420, JOY_R=46, DODGE_T=.48;
  const STANCES=['stand','crouch','kneel','prone'];
  const POSE_CODE={stand:'',crouch:'c',kneel:'k',prone:'p'};
  let padPos={joy:{x:.14,y:.82},auto:{x:.14,y:.56},crouch:{x:.32,y:.56},prone:{x:.32,y:.40},dodge:{x:.32,y:.26},scope:{x:.72,y:.88},fire:{x:.9,y:.88},drop:{x:.9,y:.72}};
  let stance='stand', dodgeT=0, dodgeDir=1, dodgeYaw=0, lastStrafe=1;
  const BR=window.WordSkirmishBR;
  let battle=false,field=null,match=null,roundState=null,roundEpoch=0,roundRoster='',inv=null;
  let fireHeld=false,sprinting=false,jumpY=0,jumpV=0,hudEdit=false,kills=0,zoneClock=0,uiClock=0;
  let combatQueue=[],eventFlush=0,lastAttacker='',brUI={},lastRoundPhase='',zoneState=null;
  const BR_PAD={joy:{x:.12,y:.76},auto:{x:.27,y:.48},crouch:{x:.91,y:.70},prone:{x:.92,y:.88},dodge:{x:.73,y:.72},scope:{x:.70,y:.32},fire:{x:.80,y:.49},drop:{x:.59,y:.76},sprint:{x:.11,y:.43},jump:{x:.92,y:.46},reload:{x:.79,y:.88},heal:{x:.28,y:.83}};
  const trainingPad=JSON.parse(JSON.stringify(padPos));
  function controlKey(){return battle?'skmPadBR1':PAD_KEY;}


  function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
  function loadPad(){
    try{
      const raw=JSON.parse(localStorage.getItem(controlKey())||'{}');
      if(raw&&raw.joy&&raw.fire&&raw.drop) padPos=Object.assign(battle?JSON.parse(JSON.stringify(BR_PAD)):{scope:{x:.72,y:.88},auto:{x:.14,y:.56},crouch:{x:.32,y:.56},prone:{x:.32,y:.40},dodge:{x:.32,y:.26}}, raw);
    }catch(_){}
  }
  function savePad(){
    try{ localStorage.setItem(controlKey(), JSON.stringify(padPos)); }catch(_){}
  }
  function placeCtl(el, x, y, key){
    if(!el) return {x,y};
    const half=Math.max(18, (el.getBoundingClientRect().width||80)/2);
    const leftPad=!battle&&(key==='joy'||key==='auto'||key==='crouch'||key==='prone'||key==='dodge');
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
    if(battle){for(const key of Object.keys(BR_PAD)){const el=hud[key]||brUI[key];if(el)placeCtl(el,padPos[key].x*W,padPos[key].y*H,key);}return;}
    placeCtl(hud.joy, (padPos.joy.x||.14)*W, (padPos.joy.y||.82)*H, 'joy');
    placeCtl(hud.auto, (padPos.auto.x||.14)*W, (padPos.auto.y||.56)*H, 'auto');
    placeCtl(hud.crouch, (padPos.crouch.x||.32)*W, (padPos.crouch.y||.56)*H, 'crouch');
    placeCtl(hud.prone, (padPos.prone.x||.32)*W, (padPos.prone.y||.40)*H, 'prone');
    placeCtl(hud.dodge, (padPos.dodge.x||.32)*W, (padPos.dodge.y||.26)*H, 'dodge');
    placeCtl(hud.fire, (padPos.fire.x||.9)*W, (padPos.fire.y||.88)*H, 'fire');
    placeCtl(hud.drop, (padPos.drop.x||.9)*W, (padPos.drop.y||.72)*H, 'drop');
    placeScope();
  }
  /* ==== 🔭 Scope / centred muzzle ray / pooled shot trails · รอบ 1526 ==== */
  function placeScope(){
    if(!hud.scope) return;
    const desired=padPos.scope||{x:.72,y:.88};
    const candidates=[desired,{x:.72,y:.88},{x:.9,y:.56},{x:.72,y:.72},{x:.72,y:.56},{x:.9,y:.4}];
    for(const p of candidates){
      placeCtl(hud.scope,p.x*W,p.y*H,'scope');
      const a=hud.scope.getBoundingClientRect();
      if(![hud.fire,hud.drop,hud.joy,hud.auto,hud.crouch,hud.prone,hud.dodge].some(el=>{
        if(!el) return false; const b=el.getBoundingClientRect();
        return a.left<b.right+8&&a.right>b.left-8&&a.top<b.bottom+8&&a.bottom>b.top-8;
      })) break;
    }
  }
  function setScope(on){
    scoped=!!on&&running&&player.alive&&(!battle||!hudEdit);
    if(root) root.classList.toggle('skm-scoped',scoped);
    if(hud.scope){
      hud.scope.classList.toggle('skm-on',scoped);
      hud.scope.setAttribute('aria-pressed',scoped?'true':'false');
      hud.scope.textContent=scoped?'SCOPE ×2.5':'SCOPE';
    }
    if(camera){camera.fov=scoped?SCOPE_FOV:FOV;camera.updateProjectionMatrix();}
    if(playerMesh) playerMesh.visible=!scoped;
    if(scoped) shake=shakeX=shakeY=0;
    return scoped;
  }
  function toggleScope(){return setScope(!scoped);}
  function collectShotTargets(){
    shotTargets.length=0;
    for(const m of shotBlockers) shotTargets.push(m);
    for(const b of bots) if(b.mesh&&b.alive) shotTargets.push(b.mesh);
    for(const uid in peersVis){const m=peersVis[uid].mesh;if(m&&m.visible) shotTargets.push(m);}
  }
  function resolveShot(){
    if(!camera||!raycaster||!playerMesh) return null;
    // Refresh input/pose before sampling; keep the displayed camera shake for this shot.
    walkAnim(0,!!player.moving); cameraTick(false); scene.updateMatrixWorld(true);
    camera.updateMatrixWorld();
    collectShotTargets();
    raycaster.near=0; raycaster.far=SHOT_RANGE;
    raycaster.setFromCamera(aimNdc,camera);
    shotHits.length=0; raycaster.intersectObjects(shotTargets,true,shotHits);
    const target=shotHits.length?shotHits[0].point.clone():raycaster.ray.at(SHOT_RANGE,new THREE.Vector3());
    const rig=playerMesh.userData.rig;
    rig.gun.lookAt(target); playerMesh.updateWorldMatrix(true,true);
    const muzzle=rig.muzzle.getWorldPosition(new THREE.Vector3());
    const direction=target.clone().sub(muzzle),distance=direction.length();
    if(distance<.001) return null;
    direction.multiplyScalar(1/distance);
    raycaster.set(muzzle,direction); raycaster.far=distance+.02;
    shotHits.length=0; raycaster.intersectObjects(shotTargets,true,shotHits);
    const hit=shotHits[0]||null;
    // The first muzzle hit decides both damage and the visible trail endpoint.
    return {muzzle,target,point:hit?hit.point.clone():target.clone(),hit};
  }
  function buildShotTrails(){
    const geo=new THREE.BoxGeometry(.045,.045,1),material=new THREE.MeshBasicMaterial({color:0xffe66d});
    shotTrails=Array.from({length:4},()=>{
      const mesh=new THREE.Mesh(geo,material);mesh.visible=false;scene.add(mesh);
      return {mesh,start:new THREE.Vector3(),direction:new THREE.Vector3(),length:0,travel:0};
    });
  }
  function showShotTrail(shot){
    const t=shotTrails[shotCursor++%shotTrails.length]; if(!t) return;
    t.start.copy(shot.muzzle);t.direction.copy(shot.point).sub(t.start);t.length=t.direction.length();
    if(t.length<.001){t.mesh.visible=false;return;}
    t.direction.multiplyScalar(1/t.length);t.travel=0;
    t.mesh.position.copy(t.start);t.mesh.lookAt(shot.point);t.mesh.scale.z=.001;t.mesh.visible=true;
  }
  function tickShotTrails(dt){
    for(const t of shotTrails){
      if(!t.mesh.visible) continue;
      if(t.travel>=t.length){t.mesh.visible=false;continue;}
      t.travel=Math.min(t.length,t.travel+SHOT_SPEED*dt);
      const tail=Math.max(0,t.travel-1.2);
      t.mesh.position.copy(t.start).addScaledVector(t.direction,(tail+t.travel)/2);
      t.mesh.scale.z=Math.max(.001,t.travel-tail);
    }
  }
  function clearShotTrails(){for(const t of shotTrails)t.mesh.visible=false;lastShotTrace=null;}
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
  const roundedGeometry=new Map();
  function box(w,h,d,col,x,y,z){
    let geometry;
    if(battle){
      const key=[w,h,d].join('/');geometry=roundedGeometry.get(key);
      if(!geometry){geometry=new THREE.BoxGeometry(w,h,d,4,4,4);const p=geometry.attributes.position,r=Math.min(.065,w*.18,h*.18,d*.18),v=new THREE.Vector3(),core=new THREE.Vector3(),normal=new THREE.Vector3();
        for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);core.set(clamp(v.x,-w/2+r,w/2-r),clamp(v.y,-h/2+r,h/2-r),clamp(v.z,-d/2+r,d/2-r));normal.copy(v).sub(core).normalize();v.copy(core).addScaledVector(normal,r);p.setXYZ(i,v.x,v.y,v.z);geometry.attributes.normal.setXYZ(i,normal.x,normal.y,normal.z);}roundedGeometry.set(key,geometry);}
    }else geometry=new THREE.BoxGeometry(w,h,d);
    const m=new THREE.Mesh(geometry, mat(col));
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
    if(battle){
      hairM.material.color.setHex(0x394e51);
      const brim=box(.89,.09,.78,0x293e43,0,.65,-.04);neck.add(brim);
      const vest=box(.63,.41,.12,0x344b50,0,.36,-.25);upper.add(vest);stampHit(vest,'body');
      const pouch=box(.18,.18,.09,0xa6956e,.18,.3,-.34);upper.add(pouch);stampHit(pouch,'body');
    }
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
      if(battle){body.material.color.setHex(0x3b4c52);barrel.material.color.setHex(0x25363e);grip.material.color.setHex(0x73694f);stock.material.color.setHex(0x83755b);sight.material.color.setHex(0x97d7d4);}
      gun.add(body,barrel,grip,stock,sight);
      gun.position.set(.1,-.02,-.14);
      armR.wrist.add(gun); stampHit(gun,'body');
    }
    const rig={
      hipL:legL.hip,kneeL:legL.knee,ankleL:legL.ankle,
      hipR:legR.hip,kneeR:legR.knee,ankleR:legR.ankle,
      shoulderL:armL.shoulder,elbowL:armL.elbow,wristL:armL.wrist,
      shoulderR:armR.shoulder,elbowR:armR.elbow,wristR:armR.wrist,
      neck, gun, muzzle:gun?joint(0,.04,1.11):null, body, upper, support, groundBox:new THREE.Box3()
    };
    if(gun) gun.add(rig.muzzle);
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
    fieldLetters.forEach(it=>{ if(it.mesh&&scene){scene.remove(it.mesh);it.mesh.traverse(m=>{if(m.geometry)m.geometry.dispose();if(m.material){if(m.material.map)m.material.map.dispose();m.material.dispose();}});} });
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
    vaultMeshes.forEach(m=>{ if(scene&&m.parent){scene.remove(m);m.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});} });
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
    const arena=battle?BR.RADIUS:ARENA;
    const x=clamp(player.x+fx, -arena+2, arena-2);
    const z=clamp(player.z+fz, -arena+2, arena-2);
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
    if(battle&&inv){inv.armor=Math.min(100,inv.armor+35);inv.reserve[inv.weapon]+=BR.WEAPONS[inv.weapon].mag;}
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
    if(battle){combatQueue.push(String(payload));return;}
    lastEvent=(String(payload||'-')+'|'+eventSeq).slice(0,60);
  }
  function packHp(){
    const c=carried||'-';
    return ('K|'+(player.alive&&(!battle||roundState&&roundState.admitted)?Math.ceil(player.hp):0)+'|'+c+'|'+player.seat+(battle?'|'+Math.ceil(inv?inv.armor:0)+'|'+BR.token(lastAttacker):'')).slice(0,28);
  }
  function parseHp(s){
    const p=String(s||'').split('|');
    if(p[0]!=='K') return {hp:MAX_HP,carry:'',seat:0};
    return {hp:clamp(parseInt(p[1],10)||0,0,MAX_HP), carry:p[2]==='-'?'':String(p[2]||'').charAt(0), seat:clamp(parseInt(p[3],10)||0,0,3)};
  }

  /* บ้านทุกหลังทึบ (ฝากตัวอักษรจากนอกกำแพงได้ เพราะ HOME_R กว้างกว่าตัวบ้าน)
     ชนแล้วลองไถลตามแกนที่ยังว่าง เพื่อไม่ให้ติดมุมบ้าน */
  function homeBlocked(x,z){
    return (battle&&field&&field.blocked(x,z))||HOMES.some(h=>Math.abs(x-h.x)<HOUSE_HALF && Math.abs(z-h.z)<HOUSE_HALF);
  }
  function collideMove(nx,nz){
    const arena=battle?BR.RADIUS:ARENA;
    nx=clamp(nx,-arena+.8,arena-.8); nz=clamp(nz,-arena+.8,arena-.8);
    if(!homeBlocked(nx,nz)){ player.x=nx; player.z=nz; return; }
    if(!homeBlocked(nx,player.z)){ player.x=nx; return; }
    if(!homeBlocked(player.x,nz)){ player.z=nz; }
  }
  /* เกิดที่หน้าบ้านตัวเอง หันหน้าออกกลางสนาม (ไม่ใช่หันเข้าผนังบ้าน)
     ระยะ 4.5 > HOUSE_HALF จึงไม่ติดกำแพง แต่ยังอยู่ในรัศมีฝากตัวอักษร */
  function spawnAtHome(){
    jumpY=jumpV=0;
    const h=homeOf(player.seat);
    const len=Math.hypot(h.x,h.z)||1;
    const fx=-h.x/len, fz=-h.z/len;            // ทิศไปกลางสนาม
    player.x=h.x+fx*4.5; player.z=h.z+fz*4.5;
    player.yaw=Math.atan2(-fx,-fz); lookYaw=player.yaw;
    player.hp=MAX_HP; player.alive=true; player.respawnAt=0;
    dodgeT=0; setStance('stand'); setScope(false); clearInput();
  }
  function applyDamage(kind, fromName){
    if(!player.alive) return false;
    if(battle) return battleDamage(kind==='H'||kind==='head'?60:20,fromName);
    if(kind==='H' || kind==='head'){
      player.hp=0; player.alive=false; setScope(false); player.respawnAt=elapsed+2.2;
      if(carried) dropCarried();
      const kept=stored?(' · ตัวอักษรในบ้านปลอดภัย ('+stored+')'):'';
      beep('head'); showToast((fromName||'โดนหัว')+' · ตายทันที'+kept);
      return true;
    }
    player.hp=Math.max(0, player.hp-BODY_DMG);
    beep('hit'); showToast('-'+BODY_DMG+' HP');
    if(player.hp<=0){
      player.alive=false; setScope(false); player.respawnAt=elapsed+2.2;
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
    const weapon=battle&&inv?BR.WEAPONS[inv.weapon]:null;
    if(now-lastShot<(weapon?weapon.interval*1000:COOLDOWN) || !running || !player.alive) return false;
    if(battle){
      if(hudEdit||!roundState||roundState.phase!=='A'||!roundState.admitted)return false;
      if(inv.action){if(inv.action.kind==='heal')inv.action=null;else return false;}
      if(inv.ammo[inv.weapon]<=0){reloadBattle();return false;}
    }
    const shot=resolveShot(); if(!shot) return false;
    if(weapon) inv.ammo[inv.weapon]--;
    lastShot=now; shotSound(); shake=scoped?0:.035; player.recoil=1;
    lastShotTrace=shot; showShotTrail(shot);
    const h=shot.hit;
    if(!h) return true;
    const part=hitPartFromObject(h.object)||'body';
    const rootObj=(()=>{ let o=h.object; while(o&&!o.userData.skirmish) o=o.parent; return o; })();
    if(!rootObj) return true;
    if(rootObj.userData.bot){
      const b=rootObj.userData.bot;
      if(battle){
        const d=BR.damage(b.hp,b.armor||0,part==='head'?weapon.head:weapon.damage);b.hp=d.hp;b.armor=d.armor;
        if(!b.hp){b.alive=false;b.mesh.visible=false;kills++;showToast('กำจัดคู่แข่ง '+kills+' คน');}else showToast((part==='head'?'HEADSHOT ':'HIT ')+Math.round(part==='head'?weapon.head:weapon.damage));
        beep(part==='head'?'head':'hit');return true;
      }
      if(part==='head'){ b.hp=0; b.alive=false; b.respawnAt=elapsed+2.5; beep('head'); showToast('เฮดช็อต!'); }
      else { b.hp=Math.max(0,b.hp-BODY_DMG); if(b.hp<=0){ b.alive=false; b.respawnAt=elapsed+2.5; } beep('hit'); }
      if(b.mesh) b.mesh.visible=b.alive;
      return true;
    }
    if(rootObj.userData.uid){
      const uid=rootObj.userData.uid;
      if(battle)emitEvent('H,'+BR.token(uid)+','+inv.weapon+','+(part==='head'?'H':'B'));
      else emitEvent('H|'+(part==='head'?'H':'B')+'|'+String(uid).slice(-8));
      showToast(part==='head'?'เล็งหัว!':'โดนตัว');
    }
    return true;
  }

  function applyPeerEvent(uid, rec){
    const cw=String((rec&&rec.cw)||'-');
    if(battle){applyBattleEvent(uid,rec,cw);return;}
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
      x:+player.x.toFixed(2), z:+player.z.toFixed(2), y:+(stanceSpec().y+jumpY).toFixed(2),
      yaw:+player.yaw.toFixed(3),
      av:packAv(),
      hp:packHp(), cw:lastEvent, w:wordsDone, c:battle&&match?match.packet().c:'-', ct:battle&&match?match.packet().ct:0, m:player.alive?0:1
    });
  }
  function syncPeers(){
    if(!room) return;
    const peers=room.peers||{};
    Object.keys(peers).forEach(uid=>{
      const rec=peers[uid]||{};
      if(battle){const r=BR.decode(rec.c,rec.ct);if(!r||!roundState||r.start!==roundState.start||!roundState.roster.includes(BR.token(uid))){if(peersVis[uid])peersVis[uid].mesh.visible=false;return;}}
      applyPeerEvent(uid, rec);
      let vis=peersVis[uid];
      if(!vis){
        const st=parseHp(rec.hp);
        const mesh=makeChibi({shirt:PAL[st.seat%PAL.length], pants:0x3949ab, skin:0xffcf9e, hair:0x4e342e}, true);
        mesh.userData.skirmish=true; mesh.userData.uid=uid;
        scene.add(mesh); vis=peersVis[uid]={mesh,uid}; 
      }
      const st=parseHp(rec.hp);
      if(battle&&vis.lastHp>0&&st.hp<=0&&String(rec.hp).split('|')[5]===BR.token(myUid))kills++;
      vis.lastHp=st.hp;
      const pose=parseAv(rec.av);
      const spec=stanceSpec(pose.pose);
      const lean=pose.dodge;
      vis.mesh.position.set(Number(rec.x)||0, spec.y+(battle?clamp(Number(rec.y)||0,0,2):0), Number(rec.z)||0);
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
    if(battle)return;
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
    if(battle){tickBattleBots(dt);return;}
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
    const sensitivity=scoped?1/SCOPE_ZOOM:1;
    lookYaw-=dx*0.006*sensitivity;
    lookPitch=clamp(lookPitch+dy*0.004*sensitivity, battle?-.8:.08, battle?1.15:.62);
  }
  function shoulderOrigin(){
    const shoulder=battle?1.0:CAM_SHOULDER;
    return {x:player.x+Math.cos(lookYaw)*shoulder, z:player.z-Math.sin(lookYaw)*shoulder};
  }
  function aimPoint(){
    const o=shoulderOrigin();
    const spec=stanceSpec();
    const fx=-Math.sin(lookYaw), fz=-Math.cos(lookYaw);
    return {
      x:o.x+fx*AIM_AHEAD,
      y:spec.look+jumpY+(PITCH_DEF-lookPitch)*(battle?30:PITCH_GAIN),
      z:o.z+fz*AIM_AHEAD
    };
  }
  function cameraTick(advanceShake=true){
    if(!camera) return;
    const o=shoulderOrigin();
    const spec=stanceSpec();
    camera.position.set(o.x+Math.sin(lookYaw)*CAM_DIST, spec.cam+jumpY, o.z+Math.cos(lookYaw)*CAM_DIST);
    if(battle&&field){
      tmpV.set(player.x,Math.max(.45,stanceSpec().cam-.8)+jumpY,player.z);tmpV2.copy(camera.position).sub(tmpV);const distance=tmpV2.length();
      raycaster.set(tmpV,tmpV2.normalize());raycaster.far=distance;const walls=raycaster.intersectObjects(shotBlockers,true);if(walls.length)camera.position.copy(tmpV).addScaledVector(tmpV2,Math.max(.3,walls[0].distance-.25));
    }
    const a=aimPoint();
    camera.lookAt(a.x, a.y, a.z);
    if(advanceShake){
      shakeX=!scoped&&shake>0?(Math.random()-.5)*shake*4:0;
      shakeY=!scoped&&shake>0?(Math.random()-.5)*shake*3:0;
      shake*=.82; if(shake<.002) shake=0;
    }
    camera.position.x+=shakeX;camera.position.y+=shakeY;
    if(playerMesh&&player.alive){
      // Keep the local barrel pointing along the same camera-centre line while aiming.
      const gun=playerMesh.userData.gun;
      playerMesh.updateWorldMatrix(true,true);
      tmpV.set(0,0,-1).applyQuaternion(camera.quaternion);
      tmpV2.copy(camera.position).addScaledVector(tmpV,SHOT_RANGE);
      if(gun) gun.lookAt(tmpV2);
    }
  }

  function walkAnim(dt, moving){
    player.moving=!!moving;
    if(!playerMesh) return;
    const spec=stanceSpec();
    const lean=player.alive?dodgeAmt():0;
    playerMesh.position.set(player.x, player.alive?spec.y+jumpY:-.4, player.z);
    playerMesh.rotation.set(0, player.yaw, player.alive?0:Math.PI/2);
    playerMesh.visible=!scoped;
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
    if(battle)tickBattle(dt);
    if(!player.alive){
      if(!battle&&player.respawnAt && elapsed>=player.respawnAt) spawnAtHome();
    }else if(!battle||(!hudEdit&&(!hud.intro||hud.intro.hidden))){
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
      if(battle){const speedLength=Math.hypot(mx,mz);if(speedLength>1){mx/=speedLength;mz/=speedLength;}}
      const dodging=dodgeT>0;
      if(dodging){
        const before=1-dodgeT/DODGE_T, after=Math.min(1,before+dt/DODGE_T);
        // Integral of a half-sine: a two-unit sidestep, independent of frame rate.
        const distance=dodgeDir*(Math.cos(before*Math.PI)-Math.cos(after*Math.PI));
        collideMove(player.x+Math.cos(dodgeYaw)*distance,player.z-Math.sin(dodgeYaw)*distance);
      }
      const moving=Math.abs(mx)>.05||Math.abs(mz)>.05;
      if(moving){
        const spd=SPEED*stanceSpec().spd*(battle?(scoped?.6:sprinting&&stance==='stand'?1.5:1):1);
        if(battle&&inv.action&&inv.action.kind==='heal')inv.action=null;
        collideMove(player.x+mx*spd*dt, player.z+mz*spd*dt);
        player.yaw=dodging||scoped?lookYaw:Math.atan2(-mx, -mz);
      }else{
        player.yaw=lookYaw;
      }
      if(dodging){ dodgeT=Math.max(0,dodgeT-dt); if(!dodgeT) paintPose(); }
      walkAnim(dt, moving);
      if(!battle||roundState&&roundState.phase==='A')tickLetters();
    }
    tickBots(dt);
    cameraTick();
    if(battle&&fireHeld)fire();
    if(room && room.tick) room.tick();
    syncPeers();
    netSend();
    tickShotTrails(dt);
    if(playerMesh && !player.alive) playerMesh.rotation.z=Math.PI/2;
  }

  function renderHud(){
    if(!hud.hp) return;
    if(battle)renderBattleHud();
    hud.hp.textContent=player.alive?('♥ '+Math.ceil(player.hp)):'หมดแรง';
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
      if(battle&&hold&&hold!=='joy'){
        e.preventDefault();e.stopPropagation();try{e.target.setPointerCapture(id);}catch(_){}
        pointers.set(id,{kind:'battle',act:hold,el:e.target,x:e.clientX,y:e.clientY,drag:hudEdit});
        if(hudEdit)e.target.classList.add('skm-dragging');else battleAction(hold,true);return;
      }
      if(hold==='fire' || hold==='drop' || hold==='auto' || hold==='crouch' || hold==='prone' || hold==='dodge' || hold==='scope'){
        e.preventDefault(); e.stopPropagation();
        try{ e.target.setPointerCapture(id); }catch(_){}
        pointers.set(id,{kind:'btn',act:hold,el:e.target,x:e.clientX,y:e.clientY,t0:performance.now(),drag:false});
        return;
      }
      if(e.target.closest && (e.target.closest('#skm-exit') || e.target.closest('.skm-card') || e.target.closest('[data-ui]'))) return;
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
      if(p.kind==='battle'){if(p.drag)placeCtl(p.el,e.clientX,e.clientY,p.act);else if(p.act==='fire')applyLook(e.clientX-p.x,e.clientY-p.y);p.x=e.clientX;p.y=e.clientY;
      }else if(p.kind==='look'){
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
      if(p.kind==='battle'){if(p.el)p.el.classList.remove('skm-dragging');if(p.drag)savePad();if(p.act==='fire')fireHeld=false;
      }else if(p.kind==='joy'){
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
          else if(p.act==='scope') toggleScope();
        }
      }
      pointers.delete(e.pointerId);
    };
    root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up);
    if(hud.exit) hud.exit.addEventListener('click', ()=>{ close(); });
    if(hud.introOk) hud.introOk.addEventListener('click', startBattle);
    root.querySelector('#skm-training').addEventListener('click',()=>{hud.intro.hidden=true;});
    root.querySelector('#skm-edit').addEventListener('click',()=>{hudEdit=!hudEdit;fireHeld=false;clearInput();setScope(false);root.classList.toggle('skm-editing',hudEdit);root.querySelector('#skm-edit').textContent=hudEdit?'บันทึก HUD':'จัดปุ่ม';});
    root.querySelectorAll('[data-weapon]').forEach(el=>el.addEventListener('click',()=>selectWeapon(Number(el.dataset.weapon))));

    window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', resize);
    window.addEventListener('blur', clearInput);
    document.addEventListener('visibilitychange',()=>{if(document.hidden) clearInput();});
  }
  function clearInput(){
    fireHeld=false;sprinting=false;keys.f=keys.b=keys.l=keys.r=0; joy.x=joy.z=0;
    pointers.forEach(p=>{if(p.el) p.el.classList.remove('skm-dragging');}); pointers.clear();
    if(hud.joy) hud.joy.classList.remove('skm-dragging');
    setJoyKnob(0,0);
  }
  function onKey(e){
    if(!running || paused || (hud.intro&&!hud.intro.hidden)) return;
    if(e.repeat && ['KeyE','KeyC','KeyZ','KeyX','ControlLeft','KeyV','KeyH','KeyR','Space','Digit1','Digit2','Digit3'].includes(e.code)){e.preventDefault(); return;}
    if(e.code==='KeyW'||e.code==='ArrowUp') keys.f=1;
    if(e.code==='KeyS'||e.code==='ArrowDown') keys.b=1;
    if(e.code==='KeyA'||e.code==='ArrowLeft') keys.l=1;
    if(e.code==='KeyD'||e.code==='ArrowRight') keys.r=1;
    if(battle){
      if(e.code==='Space'){e.preventDefault();jumpBattle();}
      if(e.code==='KeyF'){e.preventDefault();fireHeld=true;fire();}
      if(e.code==='ShiftLeft'||e.code==='ShiftRight')sprinting=true;
      if(e.code==='KeyR')reloadBattle();if(e.code==='KeyH')healBattle();
      if(/^Digit[123]$/.test(e.code))selectWeapon(Number(e.code.slice(-1))-1);
    }else if(e.code==='Space'||e.code==='KeyF'){ e.preventDefault(); fire(); }
    if(e.code==='KeyQ') dropCarried();
    if(e.code==='KeyV'){e.preventDefault();toggleScope();}
    if(e.code==='KeyE'){ e.preventDefault(); toggleAuto(); }
    if(e.code==='KeyC'){ e.preventDefault(); toggleStance('crouch'); }
    if(e.code==='KeyZ'){ e.preventDefault(); toggleStance('prone'); }
    if(e.code==='KeyX'||e.code==='ControlLeft'){ e.preventDefault(); startDodge(); }
    if(e.code==='Escape') close();
  }
  function onKeyUp(e){
    if(e.code==='KeyF')fireHeld=false;
    if(e.code==='ShiftLeft'||e.code==='ShiftRight')sprinting=false;
    if(e.code==='KeyW'||e.code==='ArrowUp') keys.f=0;
    if(e.code==='KeyS'||e.code==='ArrowDown') keys.b=0;
    if(e.code==='KeyA'||e.code==='ArrowLeft') keys.l=0;
    if(e.code==='KeyD'||e.code==='ArrowRight') keys.r=0;
  }

  function buildWorld(){
    scene=new THREE.Scene(); scene.background=new THREE.Color(0x9be7ff); scene.fog=new THREE.Fog(0x9be7ff, 28, 70);
    camera=new THREE.PerspectiveCamera(FOV, 16/9, .1, 120);
    raycaster=new THREE.Raycaster(); tmpV=new THREE.Vector3(); tmpV2=new THREE.Vector3(); aimNdc=new THREE.Vector2(0,0);
    scene.add(new THREE.HemisphereLight(battle?0xdde8e4:0xfff6e8, battle?0x35484b:0x7cb342, battle?.62:1.05));
    const sun=new THREE.DirectionalLight(battle?0xffddb0:0xfff3c4, battle?.72:.55); sun.position.set(8,14,6); scene.add(sun);
    const ground=new THREE.Mesh(new THREE.CircleGeometry(ARENA+6, 36), mat(0x8ee08a));
    ground.rotation.x=-Math.PI/2; scene.add(ground);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(ARENA+1.2,.35,8,48), mat(0xfff59d));
    rim.rotation.x=Math.PI/2; rim.position.y=.2; scene.add(rim);
    homeMeshes=HOMES.map(makeHouse); homeMeshes.forEach(h=>scene.add(h));
    shotBlockers=[ground,rim,...homeMeshes];
    for(let i=0;i<10;i++){
      const t=box(.6,1.8,.6,0x66bb6a, Math.cos(i)*12, .9, Math.sin(i*1.7)*11);
      scene.add(t);shotBlockers.push(t);
    }
    if(battle){
      scene.remove(ground,rim);shotBlockers.splice(0,2);
      for(const m of shotBlockers.slice(homeMeshes.length)){scene.remove(m);}shotBlockers=homeMeshes.slice();
      field=window.WordSkirmishField.build(THREE,scene);shotBlockers.push(...field.blockers);
      homeMeshes.forEach((h,i)=>h.children.forEach(m=>{if(m.material)m.material.color.setHex([0xa57478,0x618b9c,0x6c9277,0xb6a16a][i]);}));
    }
    buildShotTrails();
    const palettes=[
      {shirt:0xff8fab,pants:0x5b8def,skin:0xffcf9e,hair:0x3b2a24},
      {shirt:0x7c4dff,pants:0x3949ab,skin:0xffd9ae,hair:0x6d4c2f}
    ];
    playerMesh=makeChibi(battle?{shirt:0xb3a787,pants:0x3f545e,skin:0xffcf9e,hair:0x3b2a24}:palettes[0], true); playerMesh.userData.skirmish=true; scene.add(playerMesh);
    bots=(battle?Array.from({length:7},(_,i)=>({shirt:[0x586f73,0x938566,0x806f7e][i%3],pants:0x344652,skin:0xffcf9e,hair:0x3b2a24})):palettes.slice(1)).map((p,i)=>{
      const mesh=makeChibi(p, true); mesh.userData.skirmish=true;
      const bot={mesh,x:8,z:8,hp:MAX_HP,armor:25,alive:true,respawnAt:0,t:i,id:i,shotAt:0};
      mesh.userData.bot=bot; scene.add(mesh); return bot;
    });
    spawnLetters();
  }
  function buildDom(){
    if(root) return;
    root=document.createElement('div'); root.id='skm-game';
    root.innerHTML=`
      <div class="skm-stage"></div>
      <div class="skm-scope-view" aria-hidden="true"><div class="skm-scope-ring"><b>2.5×</b></div></div>
      <div class="skm-cross" aria-hidden="true"></div>
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
      <button type="button" class="skm-float" id="skm-scope" data-hold="scope" aria-label="กล้องเล็ง ซูม 2.5 เท่า" aria-pressed="false">SCOPE</button>
      <button type="button" class="skm-float" id="skm-fire" data-hold="fire">FIRE</button>
      <div class="skm-toast" id="skm-toast"></div>
      <div class="skm-modal" id="skm-intro">
        <div class="skm-card">
          <span class="skm-kicker">WORD SKIRMISH / SURVIVAL</span><h2>รบคำ • BATTLE ROYALE</h2>
          <p>8 ผู้เข้าแข่งขัน · วงปลอดภัยบีบเข้าหากัน · รอดเป็นคนสุดท้าย</p>
          <p>ปืน 3 แบบ เกราะ กล่องเสบียง และชุดรักษา · เล่นคนเดียวมีบอท 7 ตัว</p>
          <p>เก็บอักษรฝากบ้าน สะกดคำรับ 1,000 เหรียญ พร้อมเติมเกราะและกระสุน</p>
          <p class="skm-keys">WASD เดิน · Shift วิ่ง · Space กระโดด · F ยิงค้าง · V SCOPE<br>R บรรจุ · H รักษา · 1–3 เลือกปืน · C ย่อ · Z หมอบ · X หลบ</p>
          <button type="button" id="skm-intro-ok">ลงสนาม BATTLE ROYALE</button>
          <button type="button" id="skm-training">ฝึกเก็บคำ / เกิดใหม่ได้</button>
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
      scope:root.querySelector('#skm-scope'), fire:root.querySelector('#skm-fire'), joy:root.querySelector('#skm-joy'),
      auto:root.querySelector('#skm-auto'),
      crouch:root.querySelector('#skm-crouch'), prone:root.querySelector('#skm-prone'), dodge:root.querySelector('#skm-dodge'),
      joyKnob:root.querySelector('.skm-joy-knob'), net:root.querySelector('#skm-net')
    };
    buildBattleHud();bind(); built=true;
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
  /* ==== 🪂 Battle Royale runtime · rounds / inventory / touch HUD · รอบ 1526 ==== */
  function disposeWorld(){
    if(scene){const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(m=>{if(m.geometry)geometries.add(m.geometry);for(const a of (Array.isArray(m.material)?m.material:[m.material]))if(a){materials.add(a);if(a.map)textures.add(a.map);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
    roundedGeometry.clear();scene=null;peersVis={};fieldLetters=[];vaultMeshes=[];shotTrails=[];field=null;
  }
  function buildBattleHud(){
    const wrap=document.createElement('div');wrap.className='skm-br-ui';
    wrap.innerHTML=`<canvas id="skm-map" width="160" height="160" aria-label="แผนที่ วงปลอดภัยและกล่องเสบียง"></canvas>
      <div class="skm-match"><b id="skm-phase">เตรียมตัว</b><span id="skm-zone-time"></span><small id="skm-alive"></small></div>
      <button id="skm-edit" data-ui type="button">จัดปุ่ม</button>
      <div class="skm-vitals"><div><b id="skm-health-number">100</b> HP <span id="skm-armor-number">50 เกราะ</span></div><i><em id="skm-health-fill"></em></i><i class="skm-armor"><em id="skm-armor-fill"></em></i><small id="skm-action"></small></div>
      <div class="skm-weapon-panel" data-ui><div id="skm-ammo"></div><div class="skm-weapon-slots">${['RANGER','SWIFT','SCOUT'].map((n,i)=>`<button type="button" data-weapon="${i}"><small>${i+1}</small>${n}</button>`).join('')}</div></div>
      <div class="skm-round-result" id="skm-result" hidden><span id="skm-result-kicker"></span><strong id="skm-result-title"></strong><small id="skm-result-copy"></small></div>
      <div class="skm-zone-warning" id="skm-zone-warning" hidden>ออกจากวงปลอดภัย · กลับเข้าวงสีน้ำเงิน</div>`;
    root.appendChild(wrap);
    for(const [key,label] of [['sprint','วิ่ง'],['jump','กระโดด'],['reload','บรรจุ'],['heal','รักษา']]){
      const button=document.createElement('button');button.className='skm-float skm-br-button';button.type='button';button.id='skm-'+key;button.dataset.hold=key;button.textContent=label;button.setAttribute('aria-label',label);root.appendChild(button);brUI[key]=button;
    }
    for(const id of ['map','phase','zone-time','alive','health-number','armor-number','health-fill','armor-fill','action','ammo','result','result-kicker','result-title','result-copy','zone-warning'])brUI[id]=root.querySelector('#skm-'+id);
    brUI.weapons=[...root.querySelectorAll('[data-weapon]')];
  }
  function startBattle(){
    if(!BR||!window.WordSkirmishField){showToast('โหลดโหมดแข่งขันไม่ครบ กรุณาเปิดเกมใหม่');return;}
    battle=true;inv=BR.inventory();roundEpoch=0;roundRoster='';roundState=null;lastRoundPhase='';lastAttacker='';jumpY=jumpV=0;hudEdit=false;
    myUid=myUid||('local-'+Math.random().toString(36).slice(2,10));match=BR.controller(myUid);match.request(Date.now());
    combatQueue=[];eventFlush=0;seenShot={};lastEvent='-';root.classList.add('skm-battle');hud.intro.hidden=true;
    padPos=JSON.parse(JSON.stringify(BR_PAD));loadPad();disposeWorld();buildWorld();resetRun();player.alive=false;
    bots.forEach(b=>{b.alive=false;b.mesh.visible=false;});layoutPad();resize();uiClock=-1;
  }
  function resetBattleRound(r){
    roundEpoch=r.start;roundRoster=r.roster.join('.');inv=BR.inventory();kills=0;lastAttacker='';zoneClock=0;jumpY=jumpV=0;fireHeld=false;lastEvent='-';combatQueue=[];seenShot={};lastShot=0;
    setScope(false);clearInput();setAutoRun(false);dodgeT=0;setStance('stand');
    player.hp=100;player.alive=r.admitted;player.respawnAt=0;
    const seat=Math.max(0,r.roster.indexOf(r.me)),angle=seat/Math.max(8,r.roster.length)*Math.PI*2+Math.PI/8;
    player.seat=seat%4;player.x=Math.sin(angle)*37;player.z=Math.cos(angle)*37;player.yaw=lookYaw=angle;lookPitch=PITCH_DEF;
    bots.forEach((b,i)=>{const a=(i+1)/8*Math.PI*2+Math.PI/8;b.x=Math.sin(a)*37;b.z=Math.cos(a)*37;b.hp=100;b.armor=25;b.alive=r.admitted&&r.roster.length===1;b.shotAt=elapsed+2+i*.17;b.mesh.visible=b.alive;b.mesh.position.set(b.x,0,b.z);});
    if(field)field.reset();spawnLetters();syncVault();scene.updateMatrixWorld(true);
  }
  function battleDamage(amount,attacker,zone=false){
    if(!player.alive||!roundState||roundState.phase!=='A'||!roundState.admitted)return false;
    const d=BR.damage(player.hp,zone?0:inv.armor,amount);player.hp=d.hp;if(!zone)inv.armor=d.armor;
    if(inv.action&&inv.action.kind==='heal')inv.action=null;
    if(attacker)lastAttacker=attacker;
    if(player.hp<=0){player.alive=false;player.respawnAt=0;fireHeld=false;setScope(false);clearInput();if(carried)dropCarried();beep('head');showToast('ถูกกำจัด · รอรอบถัดไป');}
    else if(!zone){beep('hit');showToast('ถูกยิง −'+Math.ceil(amount)+'');}
    return true;
  }
  function reloadBattle(){if(battle&&player.alive&&BR.reload(inv,elapsed)){fireHeld=false;return true;}return false;}
  function healBattle(){if(battle&&player.alive&&BR.heal(inv,player.hp,elapsed)){fireHeld=false;return true;}return false;}
  function jumpBattle(){if(!battle||!player.alive||jumpY>0||hudEdit)return false;setStance('stand');jumpV=5.8;return true;}
  function selectWeapon(i){if(!battle||!inv||!inv.owned[i]||!player.alive)return false;inv.weapon=i;inv.action=null;return true;}
  function battleAction(act){
    if(act==='fire'){fireHeld=true;fire();}else if(act==='scope')toggleScope();else if(act==='reload')reloadBattle();else if(act==='heal')healBattle();
    else if(act==='jump')jumpBattle();else if(act==='sprint'){sprinting=!sprinting;setStance('stand');}
    else if(act==='auto')toggleAuto();else if(act==='drop')dropCarried();else if(act==='dodge')startDodge();else if(act==='crouch')toggleStance('crouch');else if(act==='prone')toggleStance('prone');
  }
  function flushBattleEvents(){
    if(!combatQueue.length||elapsed-eventFlush<.17||!roundEpoch)return;
    const prefix='R'+roundEpoch.toString(36)+'.'+(++eventSeq).toString(36)+'|';let body='';
    while(combatQueue.length){const next=(body?';':'')+combatQueue[0];if(prefix.length+body.length+next.length>60)break;body+=next;combatQueue.shift();}
    lastEvent=prefix+body;eventFlush=elapsed;
  }
  function applyBattleEvent(uid,rec,cw){
    if(!roundState||roundState.phase!=='A'||!roundState.roster.includes(BR.token(uid))||Number(rec.ct)!==roundEpoch||!cw.startsWith('R'+roundEpoch.toString(36)+'.'))return;
    const key=uid+':'+cw;if(seenShot[key])return;seenShot[key]=true;
    if(Object.keys(seenShot).length>300){const old=Object.keys(seenShot);old.slice(0,150).forEach(k=>delete seenShot[k]);}
    const split=cw.indexOf('|');if(split<0)return;
    for(const event of cw.slice(split+1).split(';')){
      const hit=event.split(',');
      if(hit[0]==='H'&&hit[1]===BR.token(myUid)){
        const w=BR.WEAPONS[Number(hit[2])];if(w&&(hit[3]==='H'||hit[3]==='B'))battleDamage(hit[3]==='H'?w.head:w.damage,uid);
      }else{const p=event.split('|');if(p[0]==='P'&&/^[A-Z]$/.test(p[1]))hideLetter(p[1]);else if(p[0]==='D'&&/^[A-Z]$/.test(p[1]))placeLetter(p[1],clamp(Number(p[2])||0,-52,52),clamp(Number(p[3])||0,-52,52));}
    }
  }
  function tickBattle(dt){
    if(!match)return;
    const now=Date.now(),mask=bots.reduce((m,b,i)=>m|(b.alive?1<<i:0),0);
    roundState=match.sync(now,room?room.peers:{},player.alive,mask);
    if(roundState.start&&(roundState.start!==roundEpoch||(roundState.phase==='W'&&roundState.roster.join('.')!==roundRoster)))resetBattleRound(roundState);
    // A spectator only joins at the next warm-up; a warm-up roster may still admit them.
    if(roundState.phase==='W'&&roundState.admitted&&!player.alive&&roundState.start>now){resetBattleRound(roundState);}
    const solo=roundState.admitted&&roundState.roster.length===1;
    bots.forEach(b=>{if(!solo){b.alive=false;b.mesh.visible=false;}});
    if(roundState.phase!==lastRoundPhase){fireHeld=false;lastRoundPhase=roundState.phase;if(roundState.phase==='A')showToast('เริ่มแข่งขัน · อยู่ในวงปลอดภัย');if(roundState.phase==='F'){setScope(false);inv.action=null;}}
    zoneState=BR.zone(roundEpoch?(now-roundEpoch)/1000:0);if(field)field.update(zoneState,elapsed);
    if(jumpV||jumpY){jumpV-=17*dt;jumpY=Math.max(0,jumpY+jumpV*dt);if(!jumpY)jumpV=0;}
    if(inv.action&&inv.action.kind==='heal'&&(keys.f||keys.b||keys.l||keys.r||Math.hypot(joy.x,joy.z)>.1||autoRun))inv.action=null;
    if(player.alive){player.hp=BR.finishAction(inv,player.hp,elapsed);}
    if(roundState.phase==='A'&&roundState.admitted&&player.alive){
      zoneClock+=dt;if(zoneClock>=1){zoneClock-=1;if(BR.outside(player.x,player.z,zoneState))battleDamage(zoneState.damage,'',true);}
      for(const s of field.supplies){if(s.taken||Math.hypot(player.x-s.x,player.z-s.z)>2)continue;s.taken=true;s.mesh.visible=s.beacon.visible=false;
        const weapon=s.id%3;inv.owned[weapon]=true;inv.reserve[weapon]+=BR.WEAPONS[weapon].mag;inv.armor=Math.min(100,inv.armor+30);inv.medkits=Math.min(5,inv.medkits+1);showToast('เสบียงส่วนตัว · '+BR.WEAPONS[weapon].name+' +กระสุน +เกราะ +ชุดรักษา');beep('ok');}
    }
    flushBattleEvents();
  }
  function tickBattleBots(dt){
    if(!roundState||roundState.phase!=='A'||!roundState.admitted||roundState.roster.length!==1)return;
    for(const b of bots){
      if(!b.alive){b.mesh.visible=false;continue;}
      if(BR.outside(b.x,b.z,zoneState)){b.hp-=zoneState.damage*dt;if(b.hp<=0){b.hp=0;b.alive=false;b.mesh.visible=false;continue;}}
      let target=player.alive?player:null,distance=target?Math.hypot(b.x-player.x,b.z-player.z):Infinity;
      for(const other of bots)if(other!==b&&other.alive){const d=Math.hypot(b.x-other.x,b.z-other.z);if(d<distance){target=other;distance=d;}}
      if(!target)continue;
      let tx=target.x,tz=target.z;const unsafe=BR.outside(b.x,b.z,{...zoneState,radius:Math.max(0,zoneState.radius-4)});
      if(unsafe){tx=zoneState.x;tz=zoneState.z;}
      const dx=tx-b.x,dz=tz-b.z,len=Math.hypot(dx,dz)||1,advance=unsafe||distance>13;
      let mx=advance?dx/len:Math.cos(elapsed*.6+b.id)*dz/len,mz=advance?dz/len:-Math.cos(elapsed*.6+b.id)*dx/len;
      const speed=unsafe?6.5:3.5,nx=b.x+mx*speed*dt,nz=b.z+mz*speed*dt;
      if(!homeBlocked(nx,nz)){b.x=nx;b.z=nz;}else if(!homeBlocked(nx,b.z))b.x=nx;else if(!homeBlocked(b.x,nz))b.z=nz;
      else{const side=Math.sin(elapsed*.5+b.id)>0?1:-1;const sx=b.x-dz/len*speed*dt*side,sz=b.z+dx/len*speed*dt*side;if(!homeBlocked(sx,sz)){b.x=sx;b.z=sz;}}
      b.mesh.position.set(b.x,0,b.z);b.mesh.rotation.y=Math.atan2(b.x-target.x,b.z-target.z);b.mesh.visible=true;
      poseChibi(b.mesh,{moving:true,bob:elapsed*8+b.id,alive:true});
      if(elapsed<b.shotAt||distance>42)continue;b.shotAt=elapsed+1.1+(b.id%3)*.3;
      const from=new THREE.Vector3(b.x,1.35,b.z),to=new THREE.Vector3(target.x,target===player?Math.max(.28,stance==='prone'?.35:stance==='crouch'?.75:1.05)+jumpY:1.05,target.z),dir=to.clone().sub(from),length=dir.length();
      raycaster.set(from,dir.normalize());raycaster.far=length;const blocks=raycaster.intersectObjects(shotBlockers,true);if(blocks.length)continue;
      // Aim has reaction time and misses moving/jumping targets. AI never shoots through cover.
      const chance=target===player?(jumpY>.2?.18:player.moving?.42:.68):.7;
      const hit=Math.random()<chance;showShotTrail({muzzle:from,point:hit?to:to.clone().add(new THREE.Vector3(.8,1,0))});
      if(hit){if(target===player)battleDamage(12,'bot'+b.id);else{const d=BR.damage(target.hp,target.armor,18);target.hp=d.hp;target.armor=d.armor;if(!target.hp){target.alive=false;target.mesh.visible=false;}}}
    }
  }
  function renderBattleHud(){
    if(!inv||!roundState||elapsed-uiClock<.1)return;uiClock=elapsed;
    const r=roundState,seconds=r.start?(Date.now()-r.start)/1000:0,w=BR.WEAPONS[inv.weapon];
    brUI.phase.textContent=!r.start?'กำลังจัดสนาม':r.phase==='W'?'เตรียมตัว '+Math.max(0,Math.ceil(-seconds)):r.phase==='F'?'จบรอบ':'SURVIVAL';
    brUI['zone-time'].textContent=zoneState?(zoneState.closing?'วงกำลังบีบ':'วงบีบใน')+' '+zoneState.remaining+'s':'';
    const peers=room?room.peers:{};let alive=(player.alive&&r.admitted?1:0)+bots.filter(b=>b.alive).length;
    for(const id in peers)if(r.roster.includes(BR.token(id))&&Number(peers[id].ct)===r.start&&parseHp(peers[id].hp).hp>0)alive++;
    if(!r.admitted)alive=r.roster.filter(t=>Object.keys(peers).some(id=>BR.token(id)===t&&parseHp(peers[id].hp).hp>0)).length+(r.mask.toString(2).match(/1/g)||[]).length;
    brUI.alive.textContent='เหลือ '+alive+' / '+(r.roster.length+(r.roster.length===1?7:0))+'  ·  กำจัด '+kills;
    brUI['health-number'].textContent=Math.ceil(player.hp);brUI['armor-number'].textContent=Math.ceil(inv.armor)+' เกราะ';brUI['health-fill'].style.width=player.hp+'%';brUI['armor-fill'].style.width=inv.armor+'%';
    brUI.ammo.textContent=w.name+'  '+inv.ammo[inv.weapon]+' / '+inv.reserve[inv.weapon];
    brUI.weapons.forEach((el,i)=>{el.disabled=!inv.owned[i];el.classList.toggle('selected',i===inv.weapon);});
    brUI.action.textContent=inv.action?(inv.action.kind==='reload'?'บรรจุกระสุน':'กำลังรักษา')+' '+Math.max(0,inv.action.end-elapsed).toFixed(1)+'s':'ชุดรักษา '+inv.medkits+'  ·  SCOPE 2.5×';
    brUI.sprint.classList.toggle('skm-on',sprinting);brUI.heal.disabled=!inv.medkits||player.hp>=100||!player.alive;brUI.reload.disabled=!!inv.action||!player.alive;
    brUI['zone-warning'].hidden=!(r.phase==='A'&&player.alive&&zoneState&&BR.outside(player.x,player.z,zoneState));
    const result=r.phase==='F'||(!r.admitted&&r.start>0)||(!player.alive&&r.phase==='A');brUI.result.hidden=!result;
    if(result){const win=r.phase==='F'&&r.winner===r.me;brUI['result-kicker'].textContent=win?'LAST SURVIVOR':r.phase==='F'?'ROUND COMPLETE':'SPECTATING';brUI['result-title'].textContent=win?'ชนะ! ผู้รอดคนสุดท้าย':!r.admitted?'เข้าร่วมรอบถัดไป':r.phase==='F'?'จบการแข่งขัน':'ถูกกำจัด';brUI['result-copy'].textContent=(r.phase==='F'?'รอบใหม่จะเริ่มอัตโนมัติ':'รอจนเหลือผู้รอดคนสุดท้าย')+' · กำจัด '+kills+' · คำสำเร็จ '+wordsDone;}
    drawBattleMap();
  }
  function drawBattleMap(){
    const q=brUI.map.getContext('2d'),n=160,scale=1.4,c=zoneState||BR.zone(0);q.clearRect(0,0,n,n);q.fillStyle='#152b30';q.fillRect(0,0,n,n);
    q.save();q.translate(80,80);q.scale(scale,scale);q.fillStyle='#516554';q.beginPath();q.arc(0,0,52,0,Math.PI*2);q.fill();q.strokeStyle='#d3e0d055';q.lineWidth=3;q.beginPath();q.moveTo(-52,0);q.lineTo(52,0);q.moveTo(0,-52);q.lineTo(0,52);q.stroke();
    q.fillStyle='#a1aaa0';for(const a of field.colliders)q.fillRect(a.x-a.hx,a.z-a.hz,a.hx*2,a.hz*2);
    q.strokeStyle='#8ee3ff';q.lineWidth=1.2;q.beginPath();q.arc(c.x,c.z,c.radius,0,Math.PI*2);q.stroke();
    q.fillStyle='#f4cc76';for(const s of field.supplies)if(!s.taken)q.fillRect(s.x-1,s.z-1,2,2);
    HOMES.forEach((h,i)=>{q.fillStyle=i===player.seat?'#ffcf77':'#96a4ac';q.fillRect(h.x-2,h.z-2,4,4);});
    q.translate(player.x,player.z);q.rotate(-lookYaw);q.fillStyle='#fff';q.beginPath();q.moveTo(0,-3.5);q.lineTo(-2.3,2.5);q.lineTo(2.3,2.5);q.closePath();q.fill();q.restore();
  }

  function resetRun(){
    clearShotTrails();setScope(false);
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
      if(battle){disposeWorld();battle=false;field=null;match=null;padPos=JSON.parse(JSON.stringify(trainingPad));}
      buildDom();root.classList.remove('skm-battle','skm-editing');hud.intro.hidden=false;
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
    running=false; paused=true; setAutoRun(false); dodgeT=0; setStance('stand'); setScope(false);clearShotTrails(); clearInput(); settleCoinSession();
    fireHeld=false;combatQueue=[];
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
    applyLook, setScope, toggleScope, resolveShot, cameraTick, SCOPE_ZOOM, SCOPE_FOV, SHOT_RANGE,
    get scoped(){return scoped;}, get lastShotTrace(){return lastShotTrace;}, get shotTrails(){return shotTrails;},
    get word(){return word;}, get stored(){return stored;}, get carried(){return carried;}, get letters(){return fieldLetters;},
    get player(){return player;}, get bots(){return bots;}, get running(){return running;}, get coinsRun(){return coinsRun;},
    get camera(){return camera;}, get scene(){return scene;}, get renderer(){return renderer;}, get playerMesh(){return playerMesh;},
    get padPos(){return padPos;}, get vaultMeshes(){return vaultMeshes;}, get autoRun(){return autoRun;},
    get stance(){return stance;}, get dodgeT(){return dodgeT;},
    setStored(s){ stored=String(s||''); syncVault(); return stored; }, setCarried(s){ carried=String(s||''); return carried; },
    setPlayer(p){ Object.assign(player,p||{}); return player; },
    renderHud, startBattle, tickBattle, battleDamage, selectWeapon, reloadBattle, healBattle, jumpBattle, applyBattleEvent, flushBattleEvents,
    get battle(){return battle;},get inventory(){return inv;},get roundState(){return roundState;},get field(){return field;},get jumpY(){return jumpY;},get kills(){return kills;},get match(){return match;},get myUid(){return myUid;},
    setRunning(v){ running=!!v; }
  }};
})();
