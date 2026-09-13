"use strict";
/* ============================================================
   ⚓ wordship.js — กองเรือคำศัพท์ (Cute Word Fleet) รอบ 1467
   โลก 3D ของเล่นแบบ Vocab World Kart (Soft Cuboid) + ยิงวิถีโค้งแบบ World of Warships
   คลังคำ = vocabForStudent() ชุดเดียวกับยิงเป้าคำ · ยิงใช้คลิปวงเพลิง Arena ชุดเดียว · ไม่ดึงคลังคำเน็ต
   THREE โหลดครั้งแรกตอนแอดมินกดเข้า · เรือโมเดลขนาดโลกคงที่ (ไกลแล้วเล็กเองจากกล้อง)
   ป้ายคำแยกจากลำเรือ ขยายตามระยะให้อ่านชัด · หัว/ท้ายเรือ · แล่นท้าย→หัว (ถอยได้เฉพาะผู้เล่น)
   ไม่มี Game Over · SCOPE แล้วลากซ้ายขวา = หมุนกระบอกแบบละเอียด · เลี้ยวยึดแกนหัว–ท้าย
   ============================================================ */
(function(){
  const MINLEN=3, MAXLEN=8;
  const HIT_COIN=5, PERFECT_BONUS=5, PT_PER_LETTER=2, LETTER_REWARD=1000;
  const HEARTS=3, COOLDOWN=520, MAX_SHELLS=48, MAX_FX=48, MAX_FLEET=1;
  const WATER_HORIZON=.42, FAR_SCALE=.42, NEAR_SCALE=1, SHIP_SPEED=9;
  const SPEED_NAMES=['ช้ามาก','ช้า','ปกติ','เร็ว','เร็วมาก'];
  const SPEED_MUL=[.45,.7,1,1.38,1.75];
  const NEAR_Z=-8, FAR_Z=-110, SEA_LEFT=-240, SEA_RIGHT=240, SEA_BACK=160, SEA_MESH=900;
  const ICE_SHOW=38, ICE_HIDE=56, ICE_SPAN=9;
  const HOME={x:-26,z:-6}, SPIRE={x:54,z:-40}, PICKUP_R=7, HOME_R=10, STORY_H=3.4, ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LABEL_AT=22, LABEL_W=4, LABEL_H=1.28, CARD_W=5.6, CARD_H=7.2, CARD_FADE=.20;
  const BOW_LEN=4.5, G=8.4, SHELL_MASS=1.2, MUZZLE=62, ELEV=.16, ELEV_MIN=0, ELEV_MAX=.72, ELEV_SWIPE=.0048, ELEV_SWIPE_FINE=.0007, HIT_R=2.6, TURRET_FWD=3.05, TURRET_AFT=3.15, BARREL_LEN=1.85, BARREL_SEP=.26, BARREL_COUNT=4; // ELEV_MIN=0: no depression through the deck
  const TURN_RATE=1.05, TURRET_SWIPE=.0075, TURRET_SWIPE_FINE=.00095, CAM_SWIPE=.0062, FOV_N=52, FOV_Z=26;
  const NO_GAME_OVER=true, STUCK_MSG='เรือติดสิ่งกีดขวาง ให้กดถอยหลัง';
  const DPR_CAP=1.5, FRAME_MS=1000/60;
  const FALLBACK=[['CAT','แมว'],['DOG','สุนัข'],['BOOK','หนังสือ'],['FISH','ปลา'],['BIRD','นก']];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const pick=a=>a[(Math.random()*a.length)|0];
  const wrapPi=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a;};

  let root=null,hud={},raf=0,opening=false,running=false,paused=false,built=false;
  let W=0,H=0,dpr=1,last=0,elapsed=0,shake=0;
  let word=null,queue=[],qGrade=null,lastWord='';
  let score=0,scoreSettled=false,combo=0,wordsDone=0,coinsRun=0,misses=0,hearts=HEARTS;
  let player={x:0,y:0,z:18,yaw:0,vx:0,vz:0,aimX:0,aimZ:NEAR_Z-8,bob:0,recoil:0,turretRel:0,elev:.16,auto:0,camYaw:0,scope:false,speedLevel:2};
  let fleet=[],shells=[],fx=[],fireAt=0,wave=1,runId=0;
  let stored='', carried='', fieldLetters=[], coinSession={id:'',total:0,paid:0}, hintEls=[];
  let holdDrive=0,holdTurn=0,keyFwd=false,keyBack=false,keyLeft=false,keyRight=false,pointers=new Map();
  let audio=null,saveTimer=0,timers=new Set();
  let THREE=null,scene=null,camera=null,renderer=null,raycaster=null,waterPlane=null;
  let playerMesh=null,playerTurret=null,playerTurrets=null,aimMarker=null,geoCache=null,tmpV=null,tmpV2=null;
  let iceWalls={far:null,back:null,left:null,right:null};
  let shellFireMat=null, stuckAt=-99, toastGen=0;

  function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
  function clearTimers(){timers.forEach(clearTimeout);timers.clear();}
  function queueSave(){
    if(saveTimer){clearTimeout(saveTimer);timers.delete(saveTimer);}
    saveTimer=later(()=>{saveTimer=0;if(typeof saveState==='function')saveState();if(typeof authPushSave==='function')authPushSave(false);},500);
  }
  function grade(){return (typeof state!=='undefined'&&state.student&&state.student.grade)||'ป.1';}

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
  function remainNeeded(){
    const remain={}, target=word&&word.w||'';
    if(!target) return remain;
    wordMarks(stored, target).forEach((done,i)=>{ if(!done) remain[target[i]]=(remain[target[i]]||0)+1; });
    return remain;
  }
  function neededLetterHints(from){
    if(carried) return [];
    const remain=remainNeeded();
    const ox=from&&from.x!=null?from.x:player.x, oz=from&&from.z!=null?from.z:player.z;
    const best={};
    fieldLetters.forEach(it=>{
      if(!remain[it.letter]) return;
      const d=Math.hypot(it.x-ox, it.z-oz);
      if(!best[it.letter]||d<best[it.letter].d) best[it.letter]={letter:it.letter,x:it.x,z:it.z,d};
    });
    return Object.values(best);
  }
  function placeHint(px,py,width,height){
    const padX=52,padTop=86,padBottom=124,minX=padX,maxX=width-padX,minY=padTop,maxY=height-padBottom;
    const cx=width/2,cy=Math.min(Math.max(height*.42,minY+20),maxY-20);
    let dx=px-cx,dy=py-cy; if(dx*dx+dy*dy<1e-8) dy=-1;
    let t=Infinity;
    if(dx>1e-6) t=Math.min(t,(maxX-cx)/dx);
    if(dx<-1e-6) t=Math.min(t,(minX-cx)/dx);
    if(dy>1e-6) t=Math.min(t,(maxY-cy)/dy);
    if(dy<-1e-6) t=Math.min(t,(minY-cy)/dy);
    if(!isFinite(t)||t<=0) t=1;
    const x=cx+dx*t, y=cy+dy*t;
    return {visible:true,x,y,angle:Math.atan2(px-x,-(py-y))};
  }
  function worldToScreen(x,y,z){
    if(camera&&tmpV){
      tmpV.set(x,y,z); tmpV.project(camera);
      return {x:(tmpV.x*.5+.5)*W, y:(-tmpV.y*.5+.5)*H};
    }
    return {x:W/2+(x-player.x)*8, y:H/2-(player.z-z)*8};
  }
  function ensureHintEl(i, home){
    if(!hud.arrows||typeof document==='undefined'||!document.createElement) return null;
    while(hintEls.length<=i){
      const el=document.createElement('div');
      el.className='wsh-nav';
      el.innerHTML='<i></i><b></b>';
      hud.arrows.appendChild(el);
      hintEls.push(el);
    }
    const el=hintEls[i];
    el.classList.toggle('home', !!home);
    return el;
  }
  function renderNavArrows(){
    if(!hud.arrows) return;
    hintEls.forEach(el=>{ if(el) el.hidden=true; });
    const needed=neededLetterHints();
    const items=needed.map(h=>({letter:h.letter,x:h.x,y:1.75,z:h.z,home:false}));
    const atHome=Math.hypot(player.x-HOME.x, player.z-HOME.z)<=HOME_R+4;
    if(!atHome) items.push({letter:'บ้าน',x:HOME.x,y:2.4,z:HOME.z,home:true});
    items.forEach((item,i)=>{
      const el=ensureHintEl(i, item.home); if(!el) return;
      const p=worldToScreen(item.x,item.y,item.z);
      const placed=placeHint(p.x,p.y,Math.max(1,W),Math.max(1,H));
      el.hidden=!placed.visible;
      if(!placed.visible) return;
      const b=el.querySelector('b');
      if(b && b.textContent!==item.letter) b.textContent=item.letter;
      el.style.transform='translate('+placed.x+'px,'+placed.y+'px) translate(-50%,-50%) rotate('+placed.angle+'rad)';
      if(b) b.style.transform='rotate('+(-placed.angle)+'rad)';
    });
  }
  function walletCoins(){ return (typeof state!=='undefined' && state)? (Number(state.coins)||0) : 0; }
  function beginCoinSession(){
    settleCoinSession();
    coinSession={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2), total:0, paid:0};
    coinsRun=0;
    return coinSession.id;
  }
  function creditReward(){
    coinSession.total+=LETTER_REWARD;
    coinsRun=coinSession.total;
    return LETTER_REWARD;
  }
  function settleCoinSession(){
    const amount=Math.max(0,(coinSession.total||0)-(coinSession.paid||0));
    if(amount && typeof addCoins==='function'){
      addCoins(amount);
      coinSession.paid=(coinSession.paid||0)+amount;
      queueSave();
    }
    return amount;
  }
  function letterClearOfLand(x,z){
    const spots=[{x:HOME.x,z:HOME.z,r:16},{x:SPIRE.x,z:SPIRE.z,r:14},{x:-88,z:-28,r:12},{x:96,z:-52,r:12}];
    return spots.every(s=>Math.hypot(x-s.x,z-s.z)>s.r);
  }
  function randomLetterPoint(index, serial){
    for(let pass=0; pass<10; pass++){
      const seed=(index+1)*97+(serial+pass*31)*193;
      const x=((Math.sin(seed*12.9898)*43758.5453)%1)*160-80;
      const z=((Math.sin((seed+17)*78.233)*12345.6789)%1)*90-40;
      if(letterClearOfLand(x,z)) return {x,z};
    }
    return {x:(index%2?1:-1)*(28+(index%5)*6), z:(index%3-1)*22};
  }
  function disposeLetterMeshes(){
    fieldLetters.forEach(it=>{
      if(it.mesh&&scene) scene.remove(it.mesh);
      if(it.mesh&&it.mesh.userData&&it.mesh.userData.tex) it.mesh.userData.tex.dispose();
    });
  }
  function spawnLetters(){
    disposeLetterMeshes();
    fieldLetters=[];
    ALPHABET.split('').forEach((letter,index)=>{
      const p=randomLetterPoint(index,0);
      const it={letter,x:p.x,z:p.z,serial:0,mesh:null};
      if(scene){
        it.mesh=makeLetterCard(letter);
        if(it.mesh){ poseLetterCard(it); scene.add(it.mesh); }
      }
      fieldLetters.push(it);
    });
    return fieldLetters;
  }
  function relocateLetter(it){
    if(!it) return it;
    it.serial=(it.serial||0)+1;
    const p=randomLetterPoint(it.letter.charCodeAt(0)-65, it.serial);
    it.x=p.x; it.z=p.z;
    if(it.mesh) poseLetterCard(it);
    return it;
  }
  function placeLetter(letter, x, z){
    const ch=String(letter||'').toUpperCase().replace(/[^A-Z]/g,'').charAt(0);
    if(!ch) return null;
    let it=fieldLetters.find(L=>L.letter===ch);
    if(!it){ it={letter:ch,x:x,z:z,serial:0,mesh:null}; fieldLetters.push(it); }
    it.x=x; it.z=z;
    if(it.mesh) poseLetterCard(it);
    return it;
  }
  function tryPickup(){
    if(carried) return '';
    for(let i=0;i<fieldLetters.length;i++){
      const it=fieldLetters[i];
      if(Math.hypot(player.x-it.x, player.z-it.z)>PICKUP_R) continue;
      carried=it.letter;
      relocateLetter(it);
      beep('ok'); renderHud();
      return carried;
    }
    return '';
  }
  function tryDeposit(){
    if(!carried) return '';
    if(Math.hypot(player.x-HOME.x, player.z-HOME.z)>HOME_R) return '';
    stored+=carried;
    const got=carried; carried='';
    beep('hit');
    completeWord();
    renderHud();
    return got;
  }
  function dropCarried(){
    if(!carried) return '';
    const h=headingVec(player.yaw||0);
    let x=player.x+h.x*9, z=player.z+h.z*9;
    const lim=playerLimits();
    x=clamp(x, lim.minX+10, lim.maxX-10);
    z=clamp(z, lim.minZ+10, lim.maxZ-10);
    if(!letterClearOfLand(x,z)){
      x=clamp(player.x-h.z*10, lim.minX+10, lim.maxX-10);
      z=clamp(player.z+h.x*10, lim.minZ+10, lim.maxZ-10);
    }
    const got=carried;
    carried='';
    placeLetter(got, x, z);
    beep('splash');
    renderHud();
    return got;
  }
  function completeWord(){
    if(!word||!word.w||!hasWord(stored, word.w)) return false;
    let next=stored;
    for(const ch of word.w) next=next.replace(ch,'');
    stored=next;
    wordsDone++; wave++; score+=10;
    if(typeof state!=='undefined') state.wshWords=(state.wshWords||0)+1;
    creditReward();
    beep('sink');
    word=takeWord();
    renderHud();
    return true;
  }
  function tickLetters(){
    if(carried) tryDeposit();
    else tryPickup();
    fieldLetters.forEach(it=>{
      if(it.mesh){
        it.mesh.position.y=2.15+Math.sin(elapsed*3+(it.serial||0))*.18;
        poseLetterCard(it);
        fadeLetterCard(it);
      }
    });
  }
  function setStored(s){ stored=String(s||''); return stored; }
  function setCarried(s){ carried=String(s||''); return carried; }

  function ac(){
    if(audio) return audio;
    const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx) return null;
    audio=new Ctx(); return audio;
  }
  const ARENA_FIRE={file:'fire-a6fea31058694941.mp3',hash:'a6fea31058694941'};
  let fireSfx=null, fireBlob=null, fireUrl='', fireLoad=null, fireBusy=false, fireAtMs=-1e9, fireGen=0;
  function fireSoundOn(){
    return !(typeof state!=='undefined'&&state.sound===false) && !(typeof document!=='undefined'&&document.hidden);
  }
  function loadFireClip(){
    if(fireBlob) return Promise.resolve(fireBlob);
    if(fireLoad) return fireLoad;
    const path='/sound/arena/'+ARENA_FIRE.file, key=(typeof location!=='undefined'?location.origin:'')+'/__vw_asset__'+path+'?v='+ARENA_FIRE.hash;
    fireLoad=Promise.resolve().then(async()=>{
      let cache=null;
      try{ cache=await caches.open('vw-assets-content-v1'); const hit=await cache.match(key); if(hit) return fireBlob=await hit.blob(); }catch(_){}
      if(typeof fetch!=='function') return null;
      const res=await fetch(path); if(!res.ok) throw 0;
      if(cache) try{ await cache.put(key, res.clone()); }catch(_){}
      return fireBlob=await res.blob();
    }).catch(()=>null).finally(()=>{ fireLoad=null; });
    return fireLoad;
  }
  function prepareFireClip(){ if(fireSoundOn()) void loadFireClip(); }
  function stopFireClip(){
    fireGen++; fireBusy=false; fireAtMs=-1e9;
    if(fireSfx){ try{ fireSfx.pause(); fireSfx.removeAttribute('src'); fireSfx.load(); }catch(_){} fireSfx=null; }
    if(fireUrl){ try{ URL.revokeObjectURL(fireUrl); }catch(_){} fireUrl=''; }
  }
  function playFireClip(){
    if(!fireSoundOn()||fireBusy||(typeof performance!=='undefined'?performance.now():0)-fireAtMs<250) return false;
    const Ctor=typeof Audio!=='undefined'?Audio:(typeof window!=='undefined'?window.Audio:null);
    if(!Ctor) return false;
    try{
      if(!fireSfx){ fireSfx=new Ctor(); fireSfx.preload='none'; fireSfx.volume=.55; }
      const el=fireSfx, at=fireGen;
      fireBusy=true; fireAtMs=typeof performance!=='undefined'?performance.now():0;
      void loadFireClip().then(blob=>{
        if(!blob||el!==fireSfx||at!==fireGen||!fireSoundOn()) return;
        if(!fireUrl){ fireUrl=URL.createObjectURL(blob); el.src=fireUrl; }
        try{ el.currentTime=0; }catch(_){}
        return el.play();
      }).catch(()=>{}).finally(()=>{ if(el===fireSfx) fireBusy=false; });
      return true;
    }catch(_){ fireBusy=false; return false; }
  }
  function beep(type){
    const a=ac(); if(!a||typeof state!=='undefined'&&state.sound===false) return;
    if(a.state==='suspended') a.resume().catch(()=>{});
    const t=a.currentTime, o=a.createOscillator(), g=a.createGain();
    const table={hit:[620,240,.12],ok:[523,784,.18],bad:[180,90,.16],sink:[392,196,.28],hurt:[140,70,.22],splash:[240,90,.08]};
    const spec=table[type]||table.ok;
    o.type=type==='ok'?'triangle':'sine';
    o.frequency.setValueAtTime(spec[0],t); o.frequency.exponentialRampToValueAtTime(Math.max(40,spec[1]),t+spec[2]);
    g.gain.setValueAtTime(.07,t); g.gain.exponentialRampToValueAtTime(.0001,t+spec[2]+.04);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+spec[2]+.05);
  }

  function headingFromDelta(dx,dz){ return Math.atan2(-dx, -dz); }
  function headingVec(yaw){ return {x:-Math.sin(yaw), z:-Math.cos(yaw)}; }
  function barrelDir(yaw, turretRel, elev){
    const h=headingVec((yaw||0)+(turretRel||0));
    const e=elev==null?(player.elev==null?ELEV:player.elev):elev;
    const ce=Math.cos(e), se=Math.sin(e);
    return {x:h.x*ce, y:se, z:h.z*ce};
  }
  function bowOf(s){ const h=headingVec(s.yaw||0); return {x:s.x+h.x*BOW_LEN, y:s.y||0, z:s.z+h.z*BOW_LEN}; }
  function sternOf(s){ const h=headingVec(s.yaw||0); return {x:s.x-h.x*BOW_LEN, y:s.y||0, z:s.z-h.z*BOW_LEN}; }
  function driveAlongHeading(s, gear, speed){
    const g=gear<0?-1:gear>0?1:0;
    const h=headingVec(s.yaw||0), spd=speed==null?SHIP_SPEED:speed;
    s.vx=h.x*spd*g; s.vy=0; s.vz=h.z*spd*g;
    return s;
  }
  function keelStep(s, dt, lim){
    const h=headingVec(s.yaw||0);
    const along=s.vx*h.x+s.vz*h.z;
    s.vx=h.x*along; s.vy=0; s.vz=h.z*along;
    const nx=s.x+s.vx*dt, nz=s.z+s.vz*dt;
    if(lim && (nx<lim.minX||nx>lim.maxX||nz<lim.minZ||nz>lim.maxZ)){
      s.vx=0; s.vz=0; s.blocked=true; return s;
    }
    s.blocked=false;
    s.x=nx; s.z=nz; return s;
  }
  function pointerHalf(cx, rect){
    const r=rect||{left:0,width:Math.max(1,W)};
    return (cx-r.left)<r.width*.5?'cam':'gun';
  }
  function applyAimSwipe(dx, dy, scoped){
    const yawRate=scoped?TURRET_SWIPE_FINE:TURRET_SWIPE;
    const elRate=scoped?ELEV_SWIPE_FINE:ELEV_SWIPE;
    player.turretRel=clamp(player.turretRel-(dx||0)*yawRate, -2.6, 2.6);
    player.elev=clamp((player.elev==null?ELEV:player.elev)-(dy||0)*elRate, ELEV_MIN, ELEV_MAX);
    return 'gun';
  }
  function yawOnKeel(s, dYaw){
    if(!s||!dYaw) return s;
    s.yaw=(s.yaw||0)+dYaw;
    return s;
  }
  function waterLimits(){
    return {nearZ:NEAR_Z, farZ:FAR_Z, left:SEA_LEFT, right:SEA_RIGHT, back:SEA_BACK, top:FAR_Z, bottom:NEAR_Z};
  }
  function apparentHull(z, camZ){
    const cz=camZ==null?28.8:camZ;
    return 1/Math.max(.8, cz-z);
  }
  function depthScale(z){ return apparentHull(z); }
  function applyShipScale(s){
    if(!s) return 1;
    s.scale=1; s.w=s.baseW; s.h=s.baseH;
    if(s.mesh) s.mesh.scale.set(1,1,1);
    return 1;
  }
  function labelWorldScale(dist){
    const d=clamp(dist==null?LABEL_AT:dist,14,52);
    const k=d/LABEL_AT;
    return {w:LABEL_W*k, h:LABEL_H*k, dist:d};
  }
  function fitWordLabel(label, ship, cam){
    if(!ship) return labelWorldScale(LABEL_AT);
    const dist=cam&&cam.position
      ?Math.hypot(cam.position.x-ship.x, cam.position.y-(ship.y+3), cam.position.z-ship.z)
      :Math.hypot(0,7.4,28.8-ship.z);
    const sz=labelWorldScale(dist);
    if(label){
      if(label.scale&&label.scale.set) label.scale.set(sz.w,sz.h,1);
      if(label.position&&label.position.set) label.position.set(ship.x, 3.55, ship.z);
    }
    return sz;
  }
  function shipSpeed(){ return SHIP_SPEED; }
  function playerDriveSpeed(){
    const i=clamp(player.speedLevel|0,0,SPEED_MUL.length-1);
    return SHIP_SPEED*SPEED_MUL[i];
  }
  function setSpeedLevel(n){
    player.speedLevel=clamp(n|0,0,SPEED_NAMES.length-1);
    const fill=(player.speedLevel/(SPEED_NAMES.length-1))*100;
    const name=SPEED_NAMES[player.speedLevel];
    if(hud.speed){ hud.speed.value=String(player.speedLevel); hud.speed.style.setProperty('--fill',fill+'%'); }
    if(hud.speedName) hud.speedName.textContent=name;
    if(hud.speedOut) hud.speedOut.textContent=name;
    return player.speedLevel;
  }

  function shellLandingAngle(dist, speed, g){
    const x=(dist*g)/(speed*speed);
    if(x>=1) return Math.PI/4;
    return .5*Math.asin(clamp(x,0,1));
  }
  function shellSplashPoint(m){
    m=m||muzzle();
    const a=G*SHELL_MASS;
    const vx=(m.fx||0)*MUZZLE, vy=(m.fy||0)*MUZZLE, vz=(m.fz||0)*MUZZLE;
    const y0=Math.max(.02, m.y||0);
    const disc=vy*vy+2*a*y0;
    if(disc<0||a<=0) return {x:m.x,y:.06,z:m.z,t:0,ok:false};
    const t=(vy+Math.sqrt(disc))/a;
    return {x:m.x+vx*t, y:.06, z:m.z+vz*t, t, ok:t>.05&&t<8};
  }
  function aimSplash(){
    const guns=muzzles();
    let x=0,z=0,n=0,t=0;
    for(let i=0;i<guns.length;i++){
      const p=shellSplashPoint(guns[i]);
      if(!p.ok) continue;
      x+=p.x; z+=p.z; t+=p.t; n++;
    }
    if(!n) return {ok:false,x:player.x,y:.06,z:player.z,t:0};
    return {ok:true,x:x/n,y:.06,z:z/n,t:t/n};
  }
  function makeAimCross(){
    if(!THREE) return null;
    const g=new THREE.Group();
    const m=new THREE.MeshBasicMaterial({color:0xfff1b8,transparent:true,opacity:.68,depthWrite:false});
    const hx=new THREE.Mesh(new THREE.BoxGeometry(1.65,.028,.06), m);
    const hz=new THREE.Mesh(new THREE.BoxGeometry(.06,.028,1.65), m);
    g.add(hx); g.add(hz);
    g.renderOrder=9;
    return g;
  }

  function setViewport(w,h){
    W=Math.max(320,w|0); H=Math.max(200,h|0);
    if(camera&&renderer){
      camera.aspect=W/Math.max(1,H);
      camera.updateProjectionMatrix();
      dpr=Math.min(DPR_CAP, window.devicePixelRatio||1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(W,H,false);
    }
  }
  function resize(){
    if(!root) return;
    const r=root.getBoundingClientRect();
    setViewport(r.width,r.height);
  }

  function playerLimits(){ return {minX:SEA_LEFT+6, maxX:SEA_RIGHT-6, minZ:FAR_Z+10, maxZ:SEA_BACK-4}; }
  function iceWanted(x,z,pad){
    const lim=playerLimits();
    const p=pad==null?ICE_SHOW:pad;
    x=x==null?player.x:x; z=z==null?player.z:z;
    return {
      far:(z-lim.minZ)<p,
      back:(lim.maxZ-z)<p,
      left:(x-lim.minX)<p,
      right:(lim.maxX-x)<p
    };
  }
  function makeIceCliff(){
    if(!THREE||!geoCache) return null;
    const g=new THREE.Group();
    for(let i=0;i<ICE_SPAN;i++){
      const u=i-(ICE_SPAN-1)*.5;
      const h=9+(i*5%7)*1.35;
      addBox(g,i%2?0xeef6fb:0xdceaf2,7.1,h,4.4,u*6.5,h*.5,0,.38);
      addBox(g,0xf8fcff,4.2,h*.42,3.1,u*6.5,h*.78,-.35,.22);
    }
    return g;
  }
  function poseIce(kind, mesh, lim){
    if(!mesh) return mesh;
    const x=clamp(player.x, lim.minX, lim.maxX), z=clamp(player.z, lim.minZ, lim.maxZ);
    if(kind==='far'){ mesh.position.set(x,0,lim.minZ-6); mesh.rotation.y=0; }
    else if(kind==='back'){ mesh.position.set(x,0,lim.maxZ+6); mesh.rotation.y=Math.PI; }
    else if(kind==='left'){ mesh.position.set(lim.minX-6,0,z); mesh.rotation.y=Math.PI*.5; }
    else { mesh.position.set(lim.maxX+6,0,z); mesh.rotation.y=-Math.PI*.5; }
    return mesh;
  }
  function dropIce(kind){
    const m=iceWalls[kind];
    if(!m) return;
    if(scene) scene.remove(m);
    m.traverse(o=>{ if(o.material&&o.material.dispose) o.material.dispose(); });
    iceWalls[kind]=null;
  }
  function dropIceAll(){ ['far','back','left','right'].forEach(dropIce); }
  function tickIce(){
    const lim=playerLimits();
    const show=iceWanted(player.x,player.z,ICE_SHOW);
    const keep=iceWanted(player.x,player.z,ICE_HIDE);
    ['far','back','left','right'].forEach(kind=>{
      const on=iceWalls[kind];
      if(on){
        if(!keep[kind]) dropIce(kind);
        else poseIce(kind,on,lim);
        return;
      }
      if(!show[kind]||!scene||!THREE) return;
      const mesh=makeIceCliff();
      if(!mesh) return;
      scene.add(mesh);
      iceWalls[kind]=poseIce(kind,mesh,lim);
    });
  }
  function setPlayer(x,z){
    const lim=playerLimits();
    if(x!=null) player.x=clamp(x,lim.minX,lim.maxX);
    if(z!=null) player.z=clamp(z,lim.minZ,lim.maxZ);
  }
  function setAuto(v){
    const n=Number(v)||0;
    player.auto=player.auto===n?0:n;
    if(hud.autoFwd) hud.autoFwd.setAttribute('aria-pressed', String(player.auto===1));
    if(hud.autoBack) hud.autoBack.setAttribute('aria-pressed', String(player.auto===-1));
    return player.auto;
  }
  function setScope(on){
    player.scope=on==null?!player.scope:!!on;
    if(hud.scope) hud.scope.setAttribute('aria-pressed', String(player.scope));
    if(root) root.classList.toggle('wsh-scoped', player.scope);
    return player.scope;
  }

  function makeWordSprite(text){
    if(!THREE||typeof document==='undefined'||!document.createElement) return null;
    const c=document.createElement('canvas'); c.width=512; c.height=160;
    const g=c.getContext('2d');
    g.clearRect(0,0,512,160);
    g.fillStyle='rgba(12,40,70,.82)';
    g.beginPath(); if(g.roundRect) g.roundRect(8,16,496,128,32); else g.rect(8,16,496,128); g.fill();
    g.font='900 '+(text.length>7?72:96)+'px Kanit,system-ui,sans-serif';
    g.textAlign='center'; g.textBaseline='middle';
    g.lineWidth=18; g.strokeStyle='#0b2740'; g.strokeText(text,256,84);
    g.fillStyle='#fff56b'; g.fillText(text,256,84);
    const tex=new THREE.CanvasTexture(c);
    tex.minFilter=THREE.LinearFilter;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false,sizeAttenuation:true}));
    sp.center.set(.5,0);
    sp.renderOrder=12;
    sp.frustumCulled=false;
    sp.userData.canvas=c; sp.userData.tex=tex;
    return sp;
  }
  function makeLetterCard(letter){
    if(!THREE||typeof document==='undefined'||!document.createElement) return null;
    const ch=String(letter||'A').charAt(0);
    const i=Math.max(0, ALPHABET.indexOf(ch));
    const face=['#fff1f7','#fff6e8','#fefce8','#ecfdf3','#e8f4ff','#f3e8ff'][i%6];
    const ink=['#be185d','#c2410c','#a16207','#047857','#1d4ed8','#6d28d9'][i%6];
    const rim=['#fb7185','#fb923c','#facc15','#34d399','#60a5fa','#c084fc'][i%6];
    const c=document.createElement('canvas'); c.width=384; c.height=480;
    const g=c.getContext('2d');
    g.clearRect(0,0,384,480);
    g.fillStyle='rgba(40,70,100,.18)';
    g.beginPath(); g.ellipse(192,452,118,18,0,0,Math.PI*2); g.fill();
    g.fillStyle=rim;
    if(g.roundRect){ g.beginPath(); g.roundRect(28,18,328,420,48); g.fill(); }
    else g.fillRect(28,18,328,420);
    g.fillStyle=face;
    if(g.roundRect){ g.beginPath(); g.roundRect(48,38,288,380,36); g.fill(); }
    else g.fillRect(48,38,288,380);
    g.fillStyle=rim; g.beginPath(); g.arc(92,88,16,0,Math.PI*2); g.fill();
    g.beginPath(); g.arc(292,88,16,0,Math.PI*2); g.fill();
    g.fillStyle='#fff'; g.beginPath(); g.arc(92,88,8,0,Math.PI*2); g.fill();
    g.beginPath(); g.arc(292,88,8,0,Math.PI*2); g.fill();
    g.font='900 210px Kanit,system-ui,sans-serif';
    g.textAlign='center'; g.textBaseline='middle';
    g.lineWidth=22; g.strokeStyle='#fff'; g.strokeText(ch,192,248);
    g.fillStyle=ink; g.fillText(ch,192,248);
    const tex=new THREE.CanvasTexture(c);
    tex.minFilter=THREE.LinearFilter;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:true,depthWrite:false,sizeAttenuation:true}));
    sp.center.set(.5,0);
    sp.renderOrder=8;
    sp.frustumCulled=false;
    sp.userData.canvas=c; sp.userData.tex=tex;
    return sp;
  }
  function poseLetterCard(it){
    if(!it||!it.mesh) return it;
    const y=it.mesh.position.y>0.2?it.mesh.position.y:2.15;
    it.mesh.position.set(it.x, y, it.z);
    let k=1;
    if(camera){
      const dist=Math.hypot(camera.position.x-it.x, camera.position.z-it.z);
      k=clamp(dist/36, 1, 1.45);
    }
    it.mesh.scale.set(CARD_W*k, CARD_H*k, 1);
    return it;
  }
  function letterOccludesShip(it, cam, ship){
    cam=cam||camera; ship=ship||player;
    if(!it||!cam||!cam.position||!ship) return false;
    const cx=cam.position.x, cy=cam.position.y, cz=cam.position.z;
    const dxs=ship.x-cx, dys=1.2-cy, dzs=ship.z-cz;
    const ds=Math.hypot(dxs,dys,dzs);
    if(ds<.4) return false;
    const k=it.mesh&&it.mesh.scale&&it.mesh.scale.x?it.mesh.scale.x/CARD_W:1;
    const ly=(it.mesh&&it.mesh.position&&it.mesh.position.y>0.2?it.mesh.position.y:2.15)+CARD_H*k*.45;
    const dxl=it.x-cx, dyl=ly-cy, dzl=it.z-cz;
    const dl=Math.hypot(dxl,dyl,dzl);
    if(dl>=ds-0.8||dl<.3) return false;
    const ang=Math.acos(clamp((dxs*dxl+dys*dyl+dzs*dzl)/(ds*dl),-1,1));
    return ang<Math.atan((CARD_W*k*.55)/dl)+.07;
  }
  function fadeLetterCard(it){
    if(!it||!it.mesh||!it.mesh.material) return it;
    it.mesh.material.opacity=letterOccludesShip(it)?CARD_FADE:1;
    return it;
  }
  function faceWordToCamera(sprite, cam){
    if(!sprite||!cam) return false;
    if(sprite.isSprite) return true;
    sprite.quaternion.copy(cam.quaternion);
    return true;
  }

  function softBox(w,h,d,r){
    r=r==null?.12:r;
    const key=[w,h,d,r].join(':');
    if(geoCache.has(key)) return geoCache.get(key);
    const g=new THREE.BoxGeometry(w,h,d,3,3,3), p=g.attributes.position;
    const inner=new THREE.Vector3(), v=new THREE.Vector3(), n=new THREE.Vector3();
    for(let i=0;i<p.count;i++){
      v.fromBufferAttribute(p,i);
      inner.set(clamp(v.x,-w/2+r,w/2-r), clamp(v.y,-h/2+r,h/2-r), clamp(v.z,-d/2+r,d/2-r));
      n.copy(v).sub(inner); if(n.lengthSq()<1e-8) n.set(0,1,0); else n.normalize();
      v.copy(inner).addScaledVector(n,r); p.setXYZ(i,v.x,v.y,v.z);
    }
    g.computeVertexNormals(); geoCache.set(key,g); return g;
  }
  function mat(c){ return new THREE.MeshPhongMaterial({color:c,shininess:48,specular:0x334455}); }
  function addBox(parent,c,w,h,d,x,y,z,r){
    const m=new THREE.Mesh(softBox(w,h,d,r==null?.1:r), mat(c));
    m.position.set(x,y,z); parent.add(m); return m;
  }

  function makeGunHouse(parent, z, y, sc){
    const turret=new THREE.Group(); turret.position.set(0,y,z);
    addBox(turret,0x5a6878,1.22*sc,.34*sc,1.28*sc,0,.02,0,.11);
    addBox(turret,0x44505c,.92*sc,.2*sc,.92*sc,0,-.24*sc,.06*sc,.08);
    const elev=new THREE.Group(); elev.position.set(0,.14*sc,0);
    const bl=2.05*sc;
    addBox(elev,0xd4c48a,.15*sc,.15*sc,bl,-.26*sc,0,-bl*.5,.045);
    addBox(elev,0xd4c48a,.15*sc,.15*sc,bl,.26*sc,0,-bl*.5,.045);
    const axle=new THREE.Mesh(new THREE.CylinderGeometry(.045*sc,.045*sc,.72*sc,8), mat(0x5a6878));
    axle.rotation.z=Math.PI*.5; elev.add(axle);
    const hingeKey='hinge:'+sc;
    let hingeGeo=geoCache&&geoCache.get(hingeKey);
    if(!hingeGeo){
      hingeGeo=new THREE.TorusGeometry(.13*sc,.032*sc,8,14);
      if(geoCache) geoCache.set(hingeKey,hingeGeo);
    }
    [-.26,.26].forEach(side=>{
      const ring=new THREE.Mesh(hingeGeo, mat(0xc5b48a));
      ring.position.set(side*sc,0,0); ring.rotation.y=Math.PI*.5;
      elev.add(ring);
    });
    elev.rotation.x=ELEV;
    turret.add(elev);
    turret.userData.elevPivot=elev;
    parent.add(turret);
    return turret;
  }
  function makeCuteShip(color, isPlayer){
    const rootG=new THREE.Group();
    const hull=isPlayer?color:color;
    const deck=isPlayer?0xd8e7ee:0xffe4ee;
    addBox(rootG,hull,3.15,.9,9.4,0,.28,0,.18);
    addBox(rootG,hull,2.15,.72,1.2,0,.3,-5.0,.16);
    addBox(rootG,hull,1.28,.56,1.0,0,.28,-5.85,.12);
    addBox(rootG,hull,.62,.4,.78,0,.26,-6.52,.09);
    addBox(rootG,hull,.22,.26,.48,0,.24,-7.05,.05);
    addBox(rootG,hull,2.55,.78,1.35,0,.3,4.55,.16);
    addBox(rootG,deck,2.85,.12,8.6,0,.8,-.05,.06);
    addBox(rootG,0x8aa4b0,.08,.22,7.8,-1.42,.92,-.1,.03);
    addBox(rootG,0x8aa4b0,.08,.22,7.8,1.42,.92,-.1,.03);
    const fore=makeGunHouse(rootG,-TURRET_FWD,1.22,1);
    const aft=makeGunHouse(rootG,TURRET_AFT,1.18,.92);
    addBox(rootG,deck,1.85,.7,2.6,0,1.28,.15,.12);
    addBox(rootG,isPlayer?0x6ec8e6:0xff9db8,1.55,.55,1.55,0,1.85,.05,.12);
    addBox(rootG,0xfff6e8,1.2,.42,1.05,0,2.28,.12,.1);
    addBox(rootG,0x6b7c8a,.55,1.15,.55,-.42,2.05,-.85,.08);
    addBox(rootG,0x6b7c8a,.55,1.15,.55,.42,2.05,-.85,.08);
    addBox(rootG,0x4b5563,.42,.18,.42,-.42,2.68,-.85,.06);
    addBox(rootG,0x4b5563,.42,.18,.42,.42,2.68,-.85,.06);
    addBox(rootG,0xc5d0d8,.12,1.55,.12,0,2.85,.35,.03);
    addBox(rootG,0xe8eef2,.55,.08,.55,0,3.6,.35,.02);
    addBox(rootG,0x7a8b96,.35,.22,1.1,-.95,1.05,-1.6,.06);
    addBox(rootG,0x7a8b96,.35,.22,1.1,.95,1.05,-1.6,.06);
    addBox(rootG,0x7a8b96,.35,.22,1.1,-.95,1.05,2.2,.06);
    addBox(rootG,0x7a8b96,.35,.22,1.1,.95,1.05,2.2,.06);
    addBox(rootG,0xff8fab,.1,.85,.1,1.05,1.85,3.9,.03);
    if(isPlayer){
      addBox(rootG,0xffd1a0,.7,.58,.62,.95,2.05,.95,.16);
      addBox(rootG,0x271b16,.11,.13,.04,.82,2.14,1.24,.03);
      addBox(rootG,0x271b16,.11,.13,.04,1.08,2.14,1.24,.03);
      addBox(rootG,0x562a1e,.26,.09,.04,.95,1.92,1.24,.03);
    }
    return {root:rootG, turret:fore, turrets:[fore,aft]};
  }

  function addIslandHouse(x,z,y){
    addBox(scene,0xf3efe4,3.4,2.6,3.6,x,y+1.3,z,.18);
    addBox(scene,0xc45c78,3.8,1.1,4,x,y+2.85,z,.12);
    addBox(scene,0x6ec8e6,.7,.7,.7,x+1.1,y+2.1,z+.9,.08);
    addBox(scene,0x562a1e,1.1,1.6,.35,x,y+.7,z+1.85,.06);
  }
  function makeMesaHome(){
    const x=HOME.x, z=HOME.z, h=STORY_H*3;
    const rim=new THREE.Mesh(new THREE.CircleGeometry(14,28), mat(0xcbb07a));
    rim.rotation.x=-Math.PI/2; rim.position.set(x,.02,z); scene.add(rim);
    addBox(scene,0xd6b36a,16,.9,16,x,.4,z,.4);
    addBox(scene,0xc4a05c,12,h*.42,12,x,h*.28,z,.35);
    addBox(scene,0xb48b4a,8.5,h*.38,8.5,x,h*.62,z,.28);
    addBox(scene,0x7aad6a,7.2,.45,7.2,x,h+.15,z,.2);
    addIslandHouse(x,z,h);
    const dock=new THREE.Mesh(new THREE.RingGeometry(HOME_R-1.2,HOME_R,.18,28), new THREE.MeshBasicMaterial({color:0xffe36b,transparent:true,opacity:.55,side:THREE.DoubleSide}));
    dock.rotation.x=-Math.PI/2; dock.position.set(x,.06,z); scene.add(dock);
  }
  function makeSpireIsland(){
    const x=SPIRE.x, z=SPIRE.z, h=STORY_H*3.15;
    const rim=new THREE.Mesh(new THREE.CircleGeometry(11,22), mat(0x8a6a72));
    rim.rotation.x=-Math.PI/2; rim.position.set(x,.02,z); scene.add(rim);
    addBox(scene,0x6b4a52,10,.7,10,x,.28,z,.3);
    addBox(scene,0x7c5560,6.4,h*.5,6.4,x,h*.32,z,.22);
    addBox(scene,0x915a4a,3.2,h*.55,3.2,x,h*.72,z,.16);
    addBox(scene,0xb07058,1.35,h*.42,1.35,x,h+.35,z,.1);
    addBox(scene,0xf2e6c9,.9,.55,.9,x,h+.85,z,.08);
    addBox(scene,0x6b8f6a,1.6,1.2,1.6,x-2.4,1.1,z+2.2,.2);
    addBox(scene,0x5f7f5c,1.2,1.8,1.2,x+2.6,1.4,z-1.6,.16);
  }

  function buildWorld(){
    THREE=window.THREE; if(!THREE) throw new Error('no THREE');
    geoCache=new Map();
    tmpV=new THREE.Vector3(); tmpV2=new THREE.Vector3();
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0xb7c6d0);
    scene.fog=new THREE.Fog(0xb7c6d0,160,720);
    camera=new THREE.PerspectiveCamera(FOV_N, W/Math.max(1,H), .2, 900);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.setClearColor(0xb7c6d0,1);
    renderer.shadowMap.enabled=false;
    const hold=root.querySelector('.wsh-stage')||root;
    hold.insertBefore(renderer.domElement, hold.firstChild);
    renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none';
    raycaster=new THREE.Raycaster();
    waterPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);

    const hemi=new THREE.HemisphereLight(0xf3efe4,0x6a8490,.92);
    scene.add(hemi);
    const sun=new THREE.DirectionalLight(0xf0ead8,.62);
    sun.position.set(18,28,12); scene.add(sun);

    const sea=new THREE.Mesh(new THREE.PlaneGeometry(SEA_MESH,SEA_MESH,1,1), new THREE.MeshPhongMaterial({color:0x6a93a3,shininess:6,specular:0x33444c}));
    sea.rotation.x=-Math.PI/2; scene.add(sea);
    const rim=new THREE.Mesh(new THREE.CircleGeometry(9,24), mat(0x7ad08a));
    rim.rotation.x=-Math.PI/2; rim.position.set(-88,.02,-28); scene.add(rim);
    addBox(scene,0x7ad08a,5.2,2.4,4.4,-88,1.1,-28,.4);
    addBox(scene,0xf7d48a,6.2,.4,5.2,-88,.18,-28,.2);
    const rim2=new THREE.Mesh(new THREE.CircleGeometry(7,20), mat(0x8be08f));
    rim2.rotation.x=-Math.PI/2; rim2.position.set(96,.02,-52); scene.add(rim2);
    addBox(scene,0x8be08f,4.2,1.8,3.6,96,.9,-52,.35);
    makeMesaHome();
    makeSpireIsland();

    const builtPlayer=makeCuteShip(0x5ad0ff,true);
    playerMesh=builtPlayer.root; playerTurret=builtPlayer.turret; playerTurrets=builtPlayer.turrets;
    scene.add(playerMesh);

    aimMarker=makeAimCross();
    if(aimMarker){ aimMarker.position.y=.06; scene.add(aimMarker); }
    resize();
  }

  function pickCourse(kind, dir){
    const lim=waterLimits();
    const goRight=dir==null?Math.random()<.5:dir>0;
    const startX=goRight?lim.left-8:lim.right+8, endX=goRight?lim.right+8:lim.left-8;
    const mode=kind||pick(['flat','flat','nearFar','farNear']);
    let startZ, endZ;
    if(mode==='nearFar'){ startZ=lim.nearZ; endZ=lim.farZ; }
    else if(mode==='farNear'){ startZ=lim.farZ; endZ=lim.nearZ; }
    else { startZ=endZ=lim.farZ+Math.random()*(lim.nearZ-lim.farZ); }
    return {startX,startY:0,startZ,endX,endY:0,endZ,mode,dir:goRight?1:-1};
  }
  function spawnWave(course){
    disposeFleetMeshes();
    const c=course||pickCourse();
    const dx=c.endX-c.startX, dz=c.endZ-c.startZ, dist=Math.hypot(dx,dz)||1;
    const yaw=headingFromDelta(dx,dz);
    const speed=shipSpeed();
    const boss=wave%5===0 && wave>0;
    const s={
      alive:true, x:c.startX, y:0, z:c.startZ, yaw, gear:1, vx:0, vy:0, vz:0, speed, dist,
      startX:c.startX, startY:0, startZ:c.startZ, endX:c.endX, endY:0, endZ:c.endZ,
      mode:c.mode, dir:c.dir, baseW:3.15, baseH:1.4, w:3.15, h:1.4, scale:1,
      word:'', th:'', target:false, hp:boss?3:1, maxHp:boss?3:1,
      color:'#ff8fab', bob:Math.random()*6, sink:0, phase:Math.random()*6.28, boss, mesh:null, label:null, turret:null
    };
    driveAlongHeading(s, 1, speed);
    if(scene){
      const built=makeCuteShip(0xff8fab,false);
      s.mesh=built.root; s.turret=built.turret;
      scene.add(s.mesh);
    }
    applyShipScale(s);
    fleet.length=0; fleet.push(s);
    renderHud();
    return s;
  }
  function disposeFleetMeshes(){
    fleet.forEach(s=>{
      if(s.mesh&&scene) scene.remove(s.mesh);
      if(s.label&&scene) scene.remove(s.label);
      if(s.label&&s.label.userData&&s.label.userData.tex) s.label.userData.tex.dispose();
    });
  }

  function turretRight(yaw){ return {x:Math.cos(yaw||0), z:-Math.sin(yaw||0)}; }
  function muzzles(){
    const yaw=player.yaw||0, rel=player.turretRel||0;
    const dir=barrelDir(yaw, rel), hull=headingVec(yaw), right=turretRight(yaw+rel);
    const guns=[
      {along:TURRET_FWD, y:1.36, sep:BARREL_SEP, len:BARREL_LEN},
      {along:TURRET_FWD, y:1.36, sep:-BARREL_SEP, len:BARREL_LEN},
      {along:-TURRET_AFT, y:1.31, sep:BARREL_SEP*.92, len:BARREL_LEN*.92},
      {along:-TURRET_AFT, y:1.31, sep:-BARREL_SEP*.92, len:BARREL_LEN*.92}
    ];
    return guns.map(g=>{
      const tx=player.x+hull.x*g.along+right.x*g.sep;
      const tz=player.z+hull.z*g.along+right.z*g.sep;
      const ty=g.y;
      return {x:tx+dir.x*g.len, y:ty+dir.y*g.len, z:tz+dir.z*g.len, fx:dir.x, fy:dir.y, fz:dir.z};
    });
  }
  function muzzle(){ return muzzles()[0]; }
  function getShellFireMat(){
    if(shellFireMat||!THREE) return shellFireMat;
    shellFireMat=new THREE.ShaderMaterial({
      transparent:true, depthWrite:false, side:THREE.DoubleSide, blending:THREE.AdditiveBlending, toneMapped:false,
      uniforms:{time:{value:0},seed:{value:0},fade:{value:1}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:`precision highp float;varying vec2 vUv;uniform float time,seed,fade;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
        float fbm(vec2 p){float v=.57*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p;v+=.28*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p;return v+.11*noise(p);}
        void main(){
          vec2 p=vec2(vUv.x*2.0-1.0,vUv.y);
          float t=time+seed*5.37;
          vec2 flow=vec2(p.x*3.8+seed,p.y*6.3-t*2.5);
          float n=fbm(flow+vec2(fbm(flow*.58)*1.6,-fbm(flow*.58)*.9));
          float curl=sin(p.y*5.0-t*1.5+seed)*.13*p.y;
          float envelope=1.0-length(vec2((p.x+curl)*(1.0+p.y*.65),(p.y-.23)*1.38));
          float density=envelope+(n-.5)*1.05-p.y*.12;
          float alpha=smoothstep(.11,.29,density)*smoothstep(.2,.47,n+envelope*.32-p.y*.16)*smoothstep(0.0,.08,p.y)*(1.0-smoothstep(.76,1.0,p.y))*fade;
          alpha*=smoothstep(0.0,.17,vUv.x)*smoothstep(0.0,.17,1.0-vUv.x);
          float heat=clamp(density*.83+n*.38-p.y*.22,0.0,1.0);
          vec3 col=mix(vec3(.38,.065,.012),vec3(1.0,.34,.028),smoothstep(.15,.5,heat));
          col=mix(col,vec3(1.0,.73,.19),smoothstep(.48,.74,heat));
          col=mix(col,vec3(1.0,.98,.84),smoothstep(.72,.96,heat));
          if(alpha<.008)discard;
          gl_FragColor=vec4(col,alpha);
        }`
    });
    return shellFireMat;
  }
  function shellFireBefore(){
    if(!shellFireMat) return;
    const u=shellFireMat.uniforms;
    u.time.value=elapsed; u.seed.value=this.userData.seed||0; u.fade.value=1;
    shellFireMat.uniformsNeedUpdate=true;
  }
  function makeFireball(){
    const g=new THREE.Group();
    const core=new THREE.Mesh(new THREE.SphereGeometry(.2,8,8), new THREE.MeshBasicMaterial({color:0xffe7a8,transparent:true,opacity:.92,blending:THREE.AdditiveBlending,depthWrite:false}));
    g.add(core);
    const geo=new THREE.PlaneGeometry(1.05,1.9); geo.translate(0,.95,0);
    const mat=getShellFireMat();
    const f1=new THREE.Mesh(geo, mat);
    f1.rotation.x=Math.PI*.5; f1.userData.seed=Math.random()*9; f1.onBeforeRender=shellFireBefore;
    const f2=new THREE.Mesh(geo, mat);
    f2.rotation.set(Math.PI*.5, Math.PI*.5, 0); f2.userData.seed=f1.userData.seed+3.17; f2.onBeforeRender=shellFireBefore;
    g.add(f1); g.add(f2);
    g.userData.flames=[f1,f2];
    return g;
  }
  function poseFireball(o){
    if(!o||!o.mesh) return o;
    o.mesh.position.set(o.x,o.y,o.z);
    o.mesh.visible=!!o.alive;
    if(!tmpV||!o.alive) return o;
    const sp=Math.hypot(o.vx,o.vy,o.vz);
    if(sp<1e-4) return o;
    tmpV.set(o.vx/sp, o.vy/sp, o.vz/sp);
    tmpV2.set(0,0,-1);
    o.mesh.quaternion.setFromUnitVectors(tmpV2, tmpV);
    const k=.85+Math.min(1.4, sp*.014);
    if(o.mesh.userData.flames) o.mesh.userData.flames.forEach(f=>{ f.scale.set(.72,k,1); });
    return o;
  }
  function spawnShell(m){
    let o=shells.find(s=>!s.alive); if(!o && shells.length>=MAX_SHELLS) return null; o=o||{};
    Object.assign(o,{
      alive:true, x:m.x, y:m.y, z:m.z,
      vx:m.fx*MUZZLE, vy:m.fy*MUZZLE, vz:m.fz*MUZZLE,
      mass:SHELL_MASS, r:.18, life:6, mesh:o.mesh||null
    });
    if(!shells.includes(o)) shells.push(o);
    if(scene&&THREE){
      if(!o.mesh){ o.mesh=makeFireball(); scene.add(o.mesh); }
      poseFireball(o);
    }
    return o;
  }
  function fire(){
    if(!running||paused||!word) return false;
    if(elapsed*1000<fireAt) return false;
    fireAt=elapsed*1000+COOLDOWN;
    const guns=muzzles();
    let n=0;
    for(let i=0;i<guns.length;i++) if(spawnShell(guns[i])) n++;
    if(!n) return false;
    player.recoil=1; playFireClip(); shake=.5; return true;
  }

  function awardHit(){
    if(typeof addCoins==='function') addCoins(HIT_COIN);
    coinsRun+=HIT_COIN; combo++; score+=10+combo;
    queueSave(); beep('ok'); renderHud();
  }
  function awardWord(done){
    const pts=(done.w.length*PT_PER_LETTER)+(misses?0:PERFECT_BONUS);
    score+=pts; wordsDone++;
    const bonus=done.w.length*PT_PER_LETTER;
    if(typeof addCoins==='function') addCoins(bonus+(misses?0:PERFECT_BONUS));
    coinsRun+=bonus+(misses?0:PERFECT_BONUS);
    if(typeof state!=='undefined') state.wshWords=(state.wshWords||0)+1;
    queueSave(); beep('sink'); renderHud();
  }
  function sinkShip(ship,correct){
    if(!ship||!ship.alive) return;
    ship.alive=false; ship.sink=1;
    burst(ship.x,ship.y+.8,ship.z, correct?14:6);
  }
  function hitShip(ship){
    if(!ship||!ship.alive) return false;
    sinkShip(ship,false); beep('hit');
    return true;
  }
  function hurt(reason){
    combo=0; beep('hurt'); shake=1.2;
    toast(reason||'เรือโดนคลื่นซัด!');
    renderHud();
  }
  function toast(msg, ms){
    if(!hud.toast) return;
    const gen=++toastGen;
    hud.toast.textContent=msg; hud.toast.style.opacity='1';
    later(()=>{if(hud.toast && gen===toastGen) hud.toast.style.opacity='0';}, ms||1400);
  }
  function warnStuck(wantFwd){
    if(!wantFwd||!player.blocked) return false;
    if(elapsed-stuckAt<2.4) return true;
    stuckAt=elapsed;
    toast(STUCK_MSG, 2400);
    beep('bad');
    return true;
  }
  function burst(x,y,z,n){
    if(!scene||!THREE) return;
    for(let i=0;i<n;i++){
      let o=fx.find(p=>!p.alive); if(!o && fx.length>=MAX_FX) return; o=o||{};
      const a=Math.random()*6.28, s=3+Math.random()*6;
      Object.assign(o,{alive:true,x,y,z,vx:Math.cos(a)*s,vy:4+Math.random()*5,vz:Math.sin(a)*s,life:.4,r:.12});
      if(!o.mesh){ o.mesh=new THREE.Mesh(new THREE.SphereGeometry(.12,6,6), mat(0xffffff)); scene.add(o.mesh); }
      o.mesh.visible=true;
      if(!fx.includes(o)) fx.push(o);
    }
  }

  function tickShell(o,dt){
    if(!o.alive) return;
    o.vy-=G*SHELL_MASS*dt;
    o.x+=o.vx*dt; o.y+=o.vy*dt; o.z+=o.vz*dt; o.life-=dt;
    poseFireball(o);
    for(let i=0;i<fleet.length;i++){
      const s=fleet[i]; if(!s.alive) continue;
      const rad=HIT_R;
      if(Math.hypot(o.x-s.x,o.z-s.z)<rad && o.y>=0 && o.y<2.4){
        o.alive=false; if(o.mesh) o.mesh.visible=false; hitShip(s); return;
      }
    }
    if(o.life<=0 || o.y<-.4 || o.x<SEA_LEFT-50 || o.x>SEA_RIGHT+50 || o.z<FAR_Z-80 || o.z>SEA_BACK+80){
      o.alive=false; if(o.mesh) o.mesh.visible=false; return;
    }
    if(o.y<=0 && o.vy<=0){
      o.alive=false; if(o.mesh) o.mesh.visible=false;
      beep('splash'); burst(o.x,.2,o.z,6);
      for(let i=0;i<fleet.length;i++){
        const s=fleet[i]; if(!s.alive) continue;
        if(Math.hypot(o.x-s.x,o.z-s.z)<HIT_R*1.15){ hitShip(s); return; }
      }
    }
  }

  function courseProgress(s){
    if(!s||!s.dist) return 0;
    return Math.hypot(s.x-s.startX, s.z-s.startZ)/s.dist;
  }
  function tickFleet(dt){
    const lim=waterLimits();
    fleet.forEach(s=>{
      if(!s.alive){
        if(s.sink>0){ s.sink=Math.max(0,s.sink-dt); if(s.mesh) s.mesh.position.y=-s.sink*2; }
        return;
      }
      s.phase+=dt;
      driveAlongHeading(s, 1, s.speed);
      s.x+=s.vx*dt;
      s.z=clamp(s.z+s.vz*dt, lim.farZ-6, lim.back||SEA_BACK);
      s.y=0; s.vy=0;
      applyShipScale(s);
      const bob=Math.sin(elapsed*2.2+s.phase)*.08;
      if(s.mesh){
        s.mesh.position.set(s.x, bob, s.z);
        s.mesh.rotation.y=s.yaw||0;
      }
      if(s.label){
        fitWordLabel(s.label,s,camera);
        faceWordToCamera(s.label, camera);
      }
      const gone=courseProgress(s)>=1 || (s.vx>0&&s.x>lim.right+10) || (s.vx<0&&s.x<lim.left-10);
      if(gone){
        sinkShip(s,false);
        const id=runId; later(()=>{ if(running&&id===runId) spawnWave(); },500);
      }
    });
  }

  function aimFromScreen(cx,cy){
    if(camera&&raycaster&&renderer&&tmpV){
      const rect=renderer.domElement.getBoundingClientRect();
      const nx=((cx-rect.left)/Math.max(1,rect.width))*2-1;
      const ny=-((cy-rect.top)/Math.max(1,rect.height))*2+1;
      raycaster.setFromCamera({x:nx,y:ny}, camera);
      const hit=raycaster.ray.intersectPlane(waterPlane, tmpV);
      if(hit){
        player.aimX=clamp(hit.x, SEA_LEFT, SEA_RIGHT);
        player.aimZ=clamp(hit.z, FAR_Z, NEAR_Z+2);
        return;
      }
    }
    player.aimX=(cx/Math.max(1,W)-.5)*(SEA_RIGHT-SEA_LEFT)*.45;
    player.aimZ=NEAR_Z-(cy/Math.max(1,H))*28;
  }

  function tickPlayer(dt){
    const lim=playerLimits();
    const turn=clamp((holdTurn||0)+(keyLeft?1:0)+(keyRight?-1:0),-1,1);
    yawOnKeel(player, turn*TURN_RATE*dt);
    const held=(keyFwd?1:0)+(keyBack?-1:0)+holdDrive;
    const gear=held||player.auto||0;
    driveAlongHeading(player, gear, playerDriveSpeed());
    keelStep(player, dt, lim);
    warnStuck(gear>0);
    player.y=0; player.bob+=dt*3; player.recoil=Math.max(0,player.recoil-dt*6);
    if(playerTurrets) playerTurrets.forEach(t=>{ if(t) t.rotation.y=player.turretRel; });
    else if(playerTurret) playerTurret.rotation.y=player.turretRel;
    const e=clamp(player.elev==null?ELEV:player.elev, ELEV_MIN, ELEV_MAX);
    player.elev=e;
    (playerTurrets||[playerTurret]).forEach(t=>{
      if(t&&t.userData&&t.userData.elevPivot) t.userData.elevPivot.rotation.x=e;
    });
    if(playerMesh){
      playerMesh.position.set(player.x, Math.sin(player.bob)*.08-player.recoil*.12, player.z);
      playerMesh.rotation.y=player.yaw;
    }
    const splash=aimSplash();
    player.aimX=splash.x; player.aimZ=splash.z;
    if(aimMarker){
      aimMarker.visible=!!splash.ok;
      if(splash.ok) aimMarker.position.set(splash.x,.06,splash.z);
    }
    tickIce();
  }

  function tickFx(dt){
    fx.forEach(p=>{
      if(!p.alive) return;
      p.x+=p.vx*dt; p.y+=p.vy*dt; p.z+=p.vz*dt; p.vy-=18*dt; p.life-=dt;
      if(p.mesh){ p.mesh.position.set(p.x,p.y,p.z); p.mesh.visible=p.life>0; }
      if(p.life<=0) p.alive=false;
    });
    shake=Math.max(0,shake-dt*6);
  }

  function cameraLookTarget(){
    return {x:player.x, y:1.35, z:player.z};
  }
  function updateCamera(){
    if(!camera) return;
    const wantFov=player.scope?FOV_Z:FOV_N;
    camera.fov+=(wantFov-camera.fov)*0.18;
    camera.updateProjectionMatrix();
    const yaw=player.camYaw;
    const zoom=player.scope?1.55:1;
    const back=14.8/zoom, height=(6.2+shake*.08)/Math.sqrt(zoom);
    const behind=headingVec(yaw);
    camera.position.set(player.x-behind.x*back, height, player.z-behind.z*back);
    const look=cameraLookTarget();
    camera.lookAt(look.x, look.y, look.z);
  }

  function renderHud(){
    if(!hud.th) return;
    hud.th.textContent=word?word.th:'—';
    const marks=wordMarks(stored, word&&word.w);
    hud.en.textContent=word?word.w.split('').map((ch,i)=>marks[i]?ch:'•').join(' '):'';
    hud.hearts.textContent='❤'.repeat(hearts)+'♡'.repeat(Math.max(0,HEARTS-hearts));
    hud.coins.textContent=String(coinsRun);
    if(hud.wallet) hud.wallet.textContent=String(walletCoins());
    if(hud.vault) hud.vault.textContent=stored||'—';
    if(hud.carry) hud.carry.textContent=carried||'—';
    if(hud.drop) hud.drop.disabled=!carried;
    hud.wave.textContent='คลื่น '+wave;
    hud.words.textContent=String(wordsDone);
    if(hud.hint) hud.hint.textContent=carried?('ถือ '+carried+' · DROP ทิ้งใบผิด หรือฝากที่บ้าน'):('เก็บการ์ดตัวอักษร แล้วฝากที่บ้านตัวเอง · สะกด “'+(word?word.th:'')+'”');
  }

  function step(dt){
    elapsed+=dt; tickPlayer(dt); tickLetters(); tickFleet(dt); shells.forEach(s=>tickShell(s,dt)); tickFx(dt);
  }
  function draw(){
    updateCamera();
    renderNavArrows();
    if(renderer&&scene&&camera) renderer.render(scene,camera);
  }
  function loop(t){
    if(!running) return;
    raf=requestAnimationFrame(loop);
    if(!last) last=t;
    let dt=Math.min(.05,(t-last)/1000); last=t;
    if(paused){ draw(); return; }
    while(dt>0){ const s=Math.min(FRAME_MS/1000,dt); step(s); dt-=s; }
    draw();
  }

  function resetRun(){
    runId++; score=0; scoreSettled=false; combo=0; wordsDone=0; coinsRun=0; misses=0; hearts=HEARTS; wave=1;
    shells.forEach(s=>{s.alive=false; if(s.mesh) s.mesh.visible=false;});
    fx.forEach(p=>{p.alive=false; if(p.mesh) p.mesh.visible=false;});
    last=0; elapsed=0; fireAt=0; pointers.clear(); holdDrive=0; holdTurn=0;
    player.vx=0; player.vz=0; player.x=0; player.z=18; player.yaw=0; player.turretRel=0; player.elev=ELEV; player.blocked=false;
    stuckAt=-99;
    player.auto=0; player.camYaw=0; player.scope=false; player.aimX=0; player.aimZ=NEAR_Z-10;
    dropIceAll();
    if(root) root.classList.remove('wsh-scoped');
    if(hud.autoFwd) hud.autoFwd.setAttribute('aria-pressed','false');
    if(hud.autoBack) hud.autoBack.setAttribute('aria-pressed','false');
    if(hud.scope) hud.scope.setAttribute('aria-pressed','false');
    setSpeedLevel(player.speedLevel==null?2:player.speedLevel);
    qGrade=null; queue=[]; lastWord=''; stored=''; carried='';
    beginCoinSession();
    word=takeWord();
    spawnWave();
    spawnLetters();
  }

  function settleScoreRun(){
    if(scoreSettled) return 0;
    scoreSettled=true;
    const add=Math.max(0,score);
    if(typeof state!=='undefined') state.wshScore=(state.wshScore||0)+add;
    queueSave(); return add;
  }
  function endRun(){
    paused=true; running=false; settleCoinSession(); settleScoreRun();
    if(hud.result){
      hud.result.hidden=false;
      hud.result.innerHTML=`<div class="wsh-card"><h2>⚓ จอดเรือแล้ว</h2>
        <p>สะกด/ยิงถูก <b>${wordsDone}</b> คำ · เหรียญรอบนี้ <b>${coinsRun}</b></p>
        <div class="wsh-buttons"><button type="button" data-a="again">เล่นอีก</button><button type="button" data-a="exit">ออก</button></div></div>`;
    }
  }
  function showIntro(){
    if(typeof state!=='undefined' && state.wshIntro) return;
    paused=true;
    if(!hud.intro) return;
    hud.intro.hidden=false;
    hud.intro.innerHTML=`<div class="wsh-card">
      <h2>⚓ กองเรือคำศัพท์</h2>
      <p>เก็บการ์ดตัวอักษรบนน้ำ ถือได้ครั้งละ 1 ใบ · เก็บผิดกด DROP ทิ้ง แล้วแล่นไปฝากที่บ้านตัวเอง (เกาะสูงวงทอง)</p>
      <p>กติกาคำและเหรียญเหมือน Frontline: สะกดคำจากตัวอักษรในบ้านได้ 1,000 เหรียญ เข้ากระเป๋าเหรียญส่วนกลาง</p>
      <p>เดินหน้าจากท้ายไปหัวเรือ · ถอยได้ · ซีกซ้ายลากหมุนกล้อง · ซีกขวาลากซ้ายขวาหันป้อม ลากขึ้นลงยกกระบอก · FIRE จาก 4 กระบอก</p>
      <button type="button">⚓ ออกทะเล!</button></div>`;
    hud.intro.querySelector('button').onclick=()=>{
      hud.intro.hidden=true; paused=false;
      if(typeof state!=='undefined'){ state.wshIntro=1; if(typeof saveState==='function') saveState(); }
    };
  }

  function bind(){
    const uiClick=e=>e.target&&e.target.closest&&e.target.closest('.wsh-pad, .wsh-speed, .wsh-exit, .wsh-modal, button, input');
    const rectOf=()=>(renderer&&renderer.domElement||root).getBoundingClientRect();
    const onMove=e=>{
      const p=pointers.get(e.pointerId); if(!p) return;
      const dx=e.clientX-p.x, dy=e.clientY-p.y;
      if(player.scope||p.mode==='gun') applyAimSwipe(dx, dy, !!player.scope);
      else if(p.mode==='cam') player.camYaw-=dx*CAM_SWIPE;
      p.x=e.clientX; p.y=e.clientY;
    };
    const down=e=>{
      if(e.button===2||uiClick(e)) return;
      const rect=rectOf();
      pointers.set(e.pointerId, {mode:pointerHalf(e.clientX, rect), x:e.clientX, y:e.clientY});
      try{root.setPointerCapture&&root.setPointerCapture(e.pointerId);}catch(_){}
    };
    const up=e=>{ pointers.delete(e.pointerId); };
    root.addEventListener('pointerdown',down);
    root.addEventListener('pointermove',onMove);
    root.addEventListener('pointerup',up); root.addEventListener('pointercancel',up);
    root.querySelectorAll('[data-auto]').forEach(b=>{
      b.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); setAuto(Number(b.dataset.auto)); });
    });
    root.querySelectorAll('[data-hold]').forEach(b=>{
      const act=b.dataset.hold;
      const press=e=>{
        e.preventDefault(); e.stopPropagation();
        if(act==='fwd') holdDrive=1;
        else if(act==='back') holdDrive=-1;
        else if(act==='left') holdTurn=1;
        else if(act==='right') holdTurn=-1;
        else if(act==='fire') fire();
        try{b.setPointerCapture(e.pointerId);}catch(_){}
      };
      const release=()=>{
        if(act==='fwd'&&holdDrive===1) holdDrive=0;
        if(act==='back'&&holdDrive===-1) holdDrive=0;
        if(act==='left'&&holdTurn===1) holdTurn=0;
        if(act==='right'&&holdTurn===-1) holdTurn=0;
      };
      b.addEventListener('pointerdown',press);
      b.addEventListener('pointerup',release);
      b.addEventListener('pointercancel',release);
    });
    if(hud.scope) hud.scope.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); setScope(); });
    if(hud.drop) hud.drop.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); dropCarried(); });
    if(hud.speed){
      const onSp=e=>{ e.stopPropagation(); setSpeedLevel(Number(e.target.value)); };
      hud.speed.addEventListener('input',onSp);
      hud.speed.addEventListener('change',onSp);
      hud.speed.addEventListener('pointerdown',e=>e.stopPropagation());
    }
    window.addEventListener('keydown',e=>{
      if(!running) return;
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') keyLeft=true;
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') keyRight=true;
      if(e.key==='ArrowUp'||e.key==='w'||e.key==='W') keyFwd=true;
      if(e.key==='ArrowDown'||e.key==='s'||e.key==='S') keyBack=true;
      if(e.code==='Space'){ e.preventDefault(); fire(); }
      if(e.key==='q'||e.key==='Q'){ e.preventDefault(); dropCarried(); }
      if(e.key==='Shift') setScope(true);
      if(e.key==='Escape') close();
    });
    window.addEventListener('keyup',e=>{
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') keyLeft=false;
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') keyRight=false;
      if(e.key==='ArrowUp'||e.key==='w'||e.key==='W') keyFwd=false;
      if(e.key==='ArrowDown'||e.key==='s'||e.key==='S') keyBack=false;
      if(e.key==='Shift') setScope(false);
    });
    window.addEventListener('resize',resize);
    hud.exit.addEventListener('click',close);
    if(hud.result) hud.result.addEventListener('click',e=>{
      const a=e.target&&e.target.getAttribute('data-a');
      if(a==='again'){ hud.result.hidden=true; resetRun(); running=true; paused=false; last=0; requestAnimationFrame(loop); }
      if(a==='exit') close();
    });
  }

  function buildDom(){
    if(root) return;
    root=document.createElement('div'); root.id='wsh-game';
    root.innerHTML=`<div class="wsh-stage"></div>
      <div class="wsh-cross" aria-hidden="true"></div>
      <div class="wsh-hud">
        <div class="wsh-glass wsh-stats"><span id="wsh-hearts"></span><b id="wsh-coins">0</b> 🪙<span class="wsh-wallet">กระเป๋า <b id="wsh-wallet">0</b></span><span id="wsh-wave">คลื่น 1</span><span>คำ <b id="wsh-words">0</b></span></div>
        <div class="wsh-glass wsh-word"><small>ฝากตัวอักษรที่บ้านแล้วสะกด</small><strong id="wsh-th">—</strong><em id="wsh-en"></em><span class="wsh-bank">ถือ <b id="wsh-carry">—</b> · บ้าน <b id="wsh-vault">—</b></span></div>
        <button type="button" class="wsh-exit" id="wsh-exit">ออก</button>
        <div class="wsh-hint" id="wsh-hint"></div>
        <div class="wsh-toast" id="wsh-toast"></div>
      </div>
      <div id="wsh-arrows" aria-hidden="true"></div>
      <div class="wsh-pad">
        <div class="wsh-left-controls">
          <div class="wsh-auto">
            <button type="button" data-auto="1" aria-pressed="false">AUTO FORWARD</button>
            <button type="button" data-auto="-1" aria-pressed="false">AUTO REVERSE</button>
          </div>
          <div class="wsh-drive">
            <button type="button" data-hold="fwd">เดินหน้า</button>
            <button type="button" data-hold="back">ถอยหลัง</button>
          </div>
          <div class="wsh-steer">
            <button type="button" data-hold="left">เลี้ยวซ้าย</button>
            <button type="button" data-hold="right">เลี้ยวขวา</button>
          </div>
        </div>
        <div class="wsh-attack">
          <button type="button" id="wsh-drop" disabled>DROP</button>
          <button type="button" id="wsh-scope" aria-pressed="false">SCOPE</button>
          <button type="button" data-hold="fire">FIRE</button>
        </div>
      </div>
      <label class="wsh-speed" for="wsh-speed"><span>SPEED <b id="wsh-speed-name">ปกติ</b></span>
        <input id="wsh-speed" type="range" min="0" max="4" step="1" value="2">
        <span class="wsh-speed-foot"><span>ช้า</span><output id="wsh-speed-out">ปกติ</output><span>เร็ว</span></span>
      </label>
      <div class="wsh-modal" id="wsh-intro" hidden></div>
      <div class="wsh-modal" id="wsh-result" hidden></div>`;
    document.body.appendChild(root);
    hud={
      hearts:root.querySelector('#wsh-hearts'), coins:root.querySelector('#wsh-coins'), wallet:root.querySelector('#wsh-wallet'),
      vault:root.querySelector('#wsh-vault'), carry:root.querySelector('#wsh-carry'),
      wave:root.querySelector('#wsh-wave'), words:root.querySelector('#wsh-words'),
      th:root.querySelector('#wsh-th'), en:root.querySelector('#wsh-en'),
      hint:root.querySelector('#wsh-hint'), toast:root.querySelector('#wsh-toast'), arrows:root.querySelector('#wsh-arrows'),
      exit:root.querySelector('#wsh-exit'), intro:root.querySelector('#wsh-intro'),
      result:root.querySelector('#wsh-result'),
      autoFwd:root.querySelector('[data-auto="1"]'), autoBack:root.querySelector('[data-auto="-1"]'),
      scope:root.querySelector('#wsh-scope'), drop:root.querySelector('#wsh-drop'),
      speed:root.querySelector('#wsh-speed'), speedName:root.querySelector('#wsh-speed-name'),
      speedOut:root.querySelector('#wsh-speed-out')
    };
    bind(); setSpeedLevel(player.speedLevel==null?2:player.speedLevel); built=true;
  }

  function adminAllowed(){
    try{
      if(typeof isAdmin==='function') return isAdmin()===true;
      if(typeof state!=='undefined' && state.adminAccess===true) return true;
    }catch(_){}
    return false;
  }
  async function open(){
    if(!adminAllowed()){
      if(typeof toast==='function') toast('🔒 กองเรือคำศัพท์กำลังทดสอบ — เปิดให้ผู้ดูแลระบบเท่านั้น');
      return;
    }
    if(opening) return; opening=true;
    try{
      THREE=window.THREE;
      if(!THREE) throw new Error('no THREE');
      buildDom();
      root.style.display='block';
      if(!scene) buildWorld();
      resize(); resetRun();
      running=true; paused=false; last=0;
      if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
      ac(); prepareFireClip();
      showIntro();
      renderHud();
      requestAnimationFrame(loop);
    }catch(e){
      console.error('WordShip open fail', e);
      if(typeof toast==='function') toast('⚠️ เปิดกองเรือไม่สำเร็จ');
    }
    opening=false;
  }
  function close(){
    running=false; paused=true; settleCoinSession(); settleScoreRun();
    dropIceAll();
    if(raf) cancelAnimationFrame(raf); raf=0;
    clearTimers();
    if(root) root.style.display='none';
    if(hud.result) hud.result.hidden=true;
    if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
    stopFireClip();
    try{ if(audio&&audio.state==='running') audio.suspend(); }catch(_){}
    if(typeof saveState==='function') saveState();
    if(typeof renderDashboard==='function') renderDashboard();
  }

  window.WordShip={ open, close, refreshLock:typeof refreshWordShipLock==='function'?refreshWordShipLock:function(){}, _t:{
    MINLEN, MAXLEN, HIT_COIN, PERFECT_BONUS, HEARTS, MAX_FLEET, WATER_HORIZON, FAR_SCALE, NEAR_SCALE, SHIP_SPEED, SPEED_NAMES, SPEED_MUL, G, SHELL_MASS, MUZZLE, ELEV, ELEV_MIN, ELEV_MAX, ELEV_SWIPE, ELEV_SWIPE_FINE, NEAR_Z, FAR_Z, SEA_LEFT, SEA_RIGHT, SEA_BACK, SEA_MESH, BOW_LEN, FOV_N, FOV_Z, NO_GAME_OVER, STUCK_MSG, TURRET_SWIPE, TURRET_SWIPE_FINE, MAX_SHELLS, BARREL_COUNT, TURRET_FWD, TURRET_AFT, LETTER_REWARD, PICKUP_R, HOME_R, STORY_H, HOME, SPIRE, ALPHABET, ICE_SHOW, ICE_HIDE, CARD_W, CARD_H, CARD_FADE,
    pool, takeWord, spawnWave, pickCourse, waterLimits, depthScale, applyShipScale, apparentHull, labelWorldScale, fitWordLabel, courseProgress, fire, hitShip, setViewport, setPlayer, resetRun, step, awardHit, adminAllowed, shipSpeed, playerDriveSpeed, setSpeedLevel,
    shellLandingAngle, tickShell, faceWordToCamera, headingFromDelta, headingVec, barrelDir, bowOf, sternOf, driveAlongHeading, keelStep, pointerHalf, applyAimSwipe, yawOnKeel, setAuto, setScope, muzzle, muzzles, hurt, cameraLookTarget, wordMarks, hasWord, completeWord, tryPickup, tryDeposit, dropCarried, placeLetter, spawnLetters, setStored, setCarried, creditReward, settleCoinSession, beginCoinSession, walletCoins, remainNeeded, neededLetterHints, placeHint, playerLimits, iceWanted, tickIce, dropIceAll, shellSplashPoint, aimSplash, letterOccludesShip, fadeLetterCard, poseFireball, warnStuck, playFireClip,
    get word(){return word;}, get fleet(){return fleet;}, get shells(){return shells;},
    get score(){return score;}, get coinsRun(){return coinsRun;}, get hearts(){return hearts;},
    get wordsDone(){return wordsDone;}, get misses(){return misses;}, get wave(){return wave;},
    get stored(){return stored;}, get carried(){return carried;}, get letters(){return fieldLetters;},
    get player(){return player;}, get running(){return running;}, get iceWalls(){return iceWalls;},
    setRunning(v){running=!!v;}, setPaused(v){paused=!!v;}, setHoldDrive(v){holdDrive=v||0;}, setHoldTurn(v){holdTurn=v||0;}, settleScoreRun
  }};
})();
