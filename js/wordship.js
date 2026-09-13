"use strict";
/* ============================================================
   ⚓ wordship.js — กองเรือคำศัพท์ (Cute Word Fleet) รอบ 1429
   สไตล์ World of Warships ฉบับน่ารักสดใสสำหรับเด็กประถม
   คลังคำ = สูตรเดียวกับ ShootWord.pool() / vocabForStudent() ที่โหลดมากับล็อบบี้แล้ว
   ไม่ดึงคำศัพท์จากเซิร์ฟเวอร์ซ้ำ · ไม่มีไฟล์ภาพ/เพลงเพิ่ม · วาด Canvas + เสียง WebAudio
   เข้าเกม: ปุ่ม #btn-rail-wordship → ui.js โหลด css/js ครั้งแรกตอนกดเท่านั้น
   เรือศัตรู 1 ลำ แล่นในเขตน้ำเท่านั้น (ห้ามขึ้นท้องฟ้า) ซ้าย↔ขวา / ใกล้↔ไกล
   ใกล้→ไกล = ลำเรือเล็กลงตามระยะ · ความเร็วคงที่
   📐 HUD clamp ตาม vh · ทดสอบ 812×375 · ไม่มี scrollbar
   ============================================================ */
(function(){
  const MINLEN=3, MAXLEN=10;
  const HIT_COIN=5, PERFECT_BONUS=5, PT_PER_LETTER=2;
  const HEARTS=3, COOLDOWN=380, MAX_SHELLS=40, MAX_FX=90, MAX_FLEET=1;
  const WATER_HORIZON=.42, WATER_NEAR=.72, FAR_SCALE=.38, NEAR_SCALE=1, SHIP_SPEED=.16;
  const DPR_CAP=1.5, FRAME_MS=1000/60;
  const HULLS=['#7ecbff','#ffb3d9','#ffe08a','#b5f2c0','#d0b8ff','#ffc4a8'];
  const FALLBACK=[['CAT','แมว'],['DOG','สุนัข'],['BOOK','หนังสือ'],['FISH','ปลา'],['BIRD','นก']];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const pick=a=>a[(Math.random()*a.length)|0];

  let root=null,canvas=null,ctx=null,hud={},raf=0,opening=false,running=false,paused=false,built=false;
  let W=0,H=0,dpr=1,last=0,elapsed=0,shake=0;
  let word=null,queue=[],qGrade=null,lastWord='';
  let score=0,scoreSettled=false,combo=0,wordsDone=0,coinsRun=0,misses=0,hearts=HEARTS;
  let player={x:0,y:0,vx:0,aimX:0,aimY:0,bob:0,recoil:0};
  let fleet=[],shells=[],fx=[],wake=[],islands=[],clouds=[];
  let fireAt=0,wave=1,runId=0,keyLeft=false,keyRight=false,pointerId=null,pointerX=0;
  let audio=null,saveTimer=0,timers=new Set();

  function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
  function clearTimers(){timers.forEach(clearTimeout);timers.clear();}
  function queueSave(){
    if(saveTimer){clearTimeout(saveTimer);timers.delete(saveTimer);}
    saveTimer=later(()=>{saveTimer=0;if(typeof saveState==='function')saveState();if(typeof authPushSave==='function')authPushSave(false);},500);
  }
  function grade(){return (typeof state!=='undefined'&&state.student&&state.student.grade)||'ป.1';}

  /* ---------- คลังคำตามระดับชั้น (กฎเหล็กเดียวกับยิงเป้าคำ) ---------- */
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

  function ac(){
    if(audio) return audio;
    const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx) return null;
    audio=new Ctx(); return audio;
  }
  function beep(type){
    const a=ac(); if(!a||typeof state!=='undefined'&&state.sound===false) return;
    if(a.state==='suspended') a.resume().catch(()=>{});
    const t=a.currentTime, o=a.createOscillator(), g=a.createGain();
    const table={shot:[420,180,.08],hit:[620,240,.12],ok:[523,784,.18],bad:[180,90,.16],sink:[392,196,.28],hurt:[140,70,.22]};
    const spec=table[type]||table.shot;
    o.type=type==='ok'?'triangle':type==='shot'?'square':'sine';
    o.frequency.setValueAtTime(spec[0],t); o.frequency.exponentialRampToValueAtTime(Math.max(40,spec[1]),t+spec[2]);
    g.gain.setValueAtTime(.07,t); g.gain.exponentialRampToValueAtTime(.0001,t+spec[2]+.04);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+spec[2]+.05);
  }

  function setViewport(w,h){
    W=Math.max(320,w|0); H=Math.max(200,h|0);
    player.x=player.x||W*.5; player.y=H*.82;
    player.aimX=player.aimX||W*.5; player.aimY=player.aimY||H*.35;
  }
  function resize(){
    if(!canvas) return;
    const r=root.getBoundingClientRect();
    setViewport(r.width,r.height);
    dpr=Math.min(DPR_CAP, window.devicePixelRatio||1);
    canvas.width=(W*dpr)|0; canvas.height=(H*dpr)|0;
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function playerLimits(){const pad=Math.min(W,H)*.11; return {minX:pad, maxX:W-pad};}
  function setPlayer(x){const lim=playerLimits(); player.x=clamp(x,lim.minX,lim.maxX);}

  function burst(x,y,color,n){
    for(let i=0;i<n;i++){
      let o=fx.find(p=>!p.alive); if(!o && fx.length>=MAX_FX) return; o=o||{};
      const a=Math.random()*6.28, s=18+Math.random()*46;
      Object.assign(o,{alive:true,x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-20,life:.45+Math.random()*.35,color,r:2+Math.random()*3});
      if(!fx.includes(o)) fx.push(o);
    }
  }
  function splash(x,y){burst(x,y,'#e8fbff',8); burst(x,y,'#7ecbff',4);}

  function spawnIslands(){
    islands=[{x:W*.16,y:H*.42,s:28},{x:W*.82,y:H*.28,s:22},{x:W*.7,y:H*.55,s:16}];
    clouds=[{x:W*.2,y:H*.1,s:1},{x:W*.55,y:H*.07,s:1.2},{x:W*.88,y:H*.12,s:.9}];
  }

  function waterLimits(){
    const pad=Math.max(16, H*.025);
    const top=H*WATER_HORIZON+pad, bottom=H*WATER_NEAR-pad;
    return {horizon:H*WATER_HORIZON, top, bottom:Math.max(top+8, bottom), nearY:H*WATER_NEAR};
  }
  function depthScale(y){
    const lim=waterLimits();
    const t=clamp((y-lim.top)/Math.max(1,lim.bottom-lim.top),0,1);
    return FAR_SCALE+(NEAR_SCALE-FAR_SCALE)*t;
  }
  function applyShipScale(s){
    if(!s) return 1;
    const sc=depthScale(s.y);
    s.scale=sc; s.w=s.baseW*sc; s.h=s.baseH*sc;
    return sc;
  }
  function shipSpeed(){ return Math.min(W,H)*SHIP_SPEED; }
  function pickCourse(kind, dir){
    const lim=waterLimits();
    const goRight=dir==null?Math.random()<.5:dir>0;
    const startX=goRight?-52:W+52, endX=goRight?W+52:-52;
    const mode=kind||pick(['flat','flat','nearFar','farNear']);
    let startY, endY;
    if(mode==='nearFar'){ startY=lim.bottom; endY=lim.top; }
    else if(mode==='farNear'){ startY=lim.top; endY=lim.bottom; }
    else { startY=endY=lim.top+Math.random()*(lim.bottom-lim.top); }
    return {startX,startY,endX,endY,mode,dir:goRight?1:-1};
  }
  function spawnWave(course){
    word=takeWord();
    const c=course||pickCourse();
    const dx=c.endX-c.startX, dy=c.endY-c.startY, dist=Math.hypot(dx,dy)||1;
    const speed=shipSpeed(), vx=speed*dx/dist, vy=speed*dy/dist;
    const boss=wave%5===0 && wave>0;
    const baseW=clamp(W*(boss?.22:.18),90,158), baseH=clamp(H*(boss?.13:.11),32,56);
    const s={
      alive:true, x:c.startX, y:c.startY, vx, vy, speed, dist,
      startX:c.startX, startY:c.startY, endX:c.endX, endY:c.endY, mode:c.mode, dir:c.dir,
      baseW, baseH, w:baseW, h:baseH, scale:1,
      word:word.w, th:word.th, target:true, hp:boss?3:1, maxHp:boss?3:1,
      color:'#ff8fab', bob:Math.random()*6, sink:0, phase:Math.random()*6.28, boss
    };
    applyShipScale(s);
    fleet.length=0; fleet.push(s);
    renderHud();
    return s;
  }

  function fire(){
    if(!running||paused||!word) return false;
    if(elapsed*1000<fireAt) return false;
    fireAt=elapsed*1000+COOLDOWN;
    const ang=Math.atan2(player.aimY-player.y, player.aimX-player.x);
    let o=shells.find(s=>!s.alive); if(!o && shells.length>=MAX_SHELLS) return false; o=o||{};
    const speed=Math.min(W,H)*.72;
    Object.assign(o,{alive:true,x:player.x,y:player.y-18,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,r:5,life:1.6});
    if(!shells.includes(o)) shells.push(o);
    player.recoil=1; beep('shot'); shake=.6; return true;
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
    burst(ship.x,ship.y, correct?'#ffe36b':'#c5d7ff', correct?18:8);
    splash(ship.x,ship.y+8);
  }

  function hitShip(ship){
    if(!ship||!ship.alive) return false;
    if(ship.target){
      ship.hp--; ship.phase+=1;
      if(ship.hp>0){ beep('hit'); burst(ship.x,ship.y,'#fff2a8',8); return true; }
      sinkShip(ship,true); awardHit(); awardWord(word); misses=0; wave++;
      const id=runId; later(()=>{ if(running&&hearts>0&&id===runId) spawnWave(); }, 650); return true;
    }
    misses++; combo=0; beep('bad'); splash(ship.x,ship.y); shake=1.2;
    return true;
  }

  function hurt(reason){
    if(hearts<=0) return;
    hearts--; combo=0; beep('hurt'); shake=2;
    toast(reason||'เรือโดนคลื่นซัด!');
    if(hearts<=0) endRun();
    renderHud();
  }

  function toast(msg){
    if(!hud.toast) return;
    hud.toast.textContent=msg; hud.toast.style.opacity='1';
    later(()=>{if(hud.toast) hud.toast.style.opacity='0';}, 1400);
  }

  function tickShell(o,dt){
    if(!o.alive) return;
    o.x+=o.vx*dt; o.y+=o.vy*dt; o.life-=dt;
    if(o.life<=0||o.x<-20||o.x>W+20||o.y<-20||o.y>H+20){ o.alive=false; return; }
    for(let i=0;i<fleet.length;i++){
      const s=fleet[i]; if(!s.alive) continue;
      if(Math.abs(o.x-s.x)<s.w*.42 && Math.abs(o.y-s.y)<s.h*.55){
        o.alive=false; hitShip(s); return;
      }
    }
  }

  function courseProgress(s){
    if(!s||!s.dist) return 0;
    return Math.hypot(s.x-s.startX, s.y-s.startY)/s.dist;
  }
  function tickFleet(dt){
    const lim=waterLimits();
    fleet.forEach(s=>{
      if(!s.alive){ if(s.sink>0) s.sink=Math.max(0,s.sink-dt); return; }
      s.phase+=dt;
      s.x+=s.vx*dt;
      s.y=clamp(s.y+s.vy*dt, lim.top, lim.bottom);
      applyShipScale(s);
      const gone=courseProgress(s)>=1 || (s.vx>0&&s.x>W+s.w) || (s.vx<0&&s.x<-s.w);
      if(gone){
        sinkShip(s,false); hurt('เรือเป้าหมายแล่นหนีไปแล้ว');
        const id=runId; later(()=>{ if(running&&hearts>0&&id===runId) spawnWave(); },500);
      }
    });
  }

  function tickPlayer(dt){
    const lim=playerLimits();
    const want=(keyLeft?-1:0)+(keyRight?1:0);
    player.vx+=(want*420-player.vx)*Math.min(1,dt*8);
    if(pointerId!==null) player.x+=(pointerX-player.x)*Math.min(1,dt*10);
    else player.x+=player.vx*dt;
    player.x=clamp(player.x,lim.minX,lim.maxX);
    player.y=H*.82; player.bob+=dt*3; player.recoil=Math.max(0,player.recoil-dt*6);
    const tgt=fleet.find(s=>s.alive&&s.target);
    if(tgt && pointerId===null){ player.aimX+=(tgt.x-player.aimX)*dt*3; player.aimY+=(tgt.y-player.aimY)*dt*3; }
  }

  function tickFx(dt){
    fx.forEach(p=>{ if(!p.alive) return; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=70*dt; p.life-=dt; if(p.life<=0) p.alive=false; });
    shake=Math.max(0,shake-dt*6);
  }

  function drawSky(){
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#9fe7ff'); g.addColorStop(WATER_HORIZON,'#b9f3ff'); g.addColorStop(WATER_HORIZON,'#4ec6ea'); g.addColorStop(1,'#1878b8');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#ffe38a'; ctx.beginPath(); ctx.arc(W*.86,H*.14,Math.min(W,H)*.08,0,7); ctx.fill();
    clouds.forEach((c,i)=>{
      const x=(c.x+elapsed*12*(i%2?1:-1)+W)%(W+80)-40, y=c.y;
      ctx.fillStyle='rgba(255,255,255,.86)';
      ctx.beginPath(); ctx.ellipse(x,y,28*c.s,14*c.s,0,0,7);
      ctx.ellipse(x+18*c.s,y+2,22*c.s,12*c.s,0,0,7);
      ctx.ellipse(x-16*c.s,y+3,18*c.s,10*c.s,0,0,7); ctx.fill();
    });
    islands.forEach(o=>{
      ctx.fillStyle='#7ad08a'; ctx.beginPath(); ctx.ellipse(o.x,o.y,o.s,o.s*.45,0,0,7); ctx.fill();
      ctx.fillStyle='#f7d48a'; ctx.beginPath(); ctx.ellipse(o.x,o.y+o.s*.2,o.s*1.1,o.s*.22,0,0,7); ctx.fill();
    });
    const horizon=H*WATER_HORIZON;
    for(let i=0;i<7;i++){
      ctx.strokeStyle=`rgba(255,255,255,${.08+i*.03})`; ctx.lineWidth=2;
      ctx.beginPath();
      for(let x=0;x<=W;x+=16){
        const y=horizon+i*H*.08 + Math.sin(x*.02+elapsed*1.4+i)*3;
        x?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }
      ctx.stroke();
    }
  }

  function drawShip(s, isPlayer){
    const bob=Math.sin((isPlayer?player.bob:elapsed*2.2)+ (s.phase||0))*3;
    const y=s.y+bob+(isPlayer?player.recoil*6:0);
    const sink=s.sink||0;
    ctx.save(); ctx.translate(s.x,y);
    if(!isPlayer && (s.dir||s.vx||0)<0) ctx.scale(-1,1);
    ctx.rotate(sink? sink*.6 : Math.sin(elapsed+ (s.phase||0))*.03);
    const w=s.w, h=s.h;
    ctx.fillStyle=s.color||'#7ecbff';
    ctx.beginPath(); ctx.moveTo(-w*.48,0); ctx.quadraticCurveTo(0,h*.7,w*.48,0); ctx.quadraticCurveTo(0,-h*.55,-w*.48,0); ctx.fill();
    ctx.fillStyle='#fff8e8'; ctx.fillRect(-w*.22,-h*.42,w*.44,h*.32);
    ctx.fillStyle='#ff8fab'; ctx.fillRect(w*.12,-h*.72,5,h*.38);
    ctx.beginPath(); ctx.moveTo(w*.14,-h*.72); ctx.lineTo(w*.34,-h*.62); ctx.lineTo(w*.14,-h*.52); ctx.fill();
    ctx.fillStyle='#6b5b4a'; ctx.fillRect(-w*.06,-h*.62,w*.1,h*.28);
    if(!isPlayer && s.word){
      ctx.font='900 '+Math.max(11, Math.min(18,w*.18))+'px Kanit,system-ui';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.lineWidth=4; ctx.strokeStyle='rgba(20,40,70,.35)'; ctx.strokeText(s.word,0,-2);
      ctx.fillStyle=s.target?'#fff':'#1d3557'; ctx.fillText(s.word,0,-2);
      if(s.target){
        ctx.strokeStyle='rgba(255,230,90,.95)'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.ellipse(0,2,w*.5,h*.62,0,0,7); ctx.stroke();
      }
    }else if(isPlayer){
      ctx.fillStyle='#ffd36b'; ctx.beginPath(); ctx.arc(0,-h*.1,5,0,7); ctx.fill();
    }
    if(s.maxHp>1 && s.alive){
      ctx.fillStyle='rgba(0,0,0,.25)'; ctx.fillRect(-w*.3,h*.38,w*.6,5);
      ctx.fillStyle='#7dff9b'; ctx.fillRect(-w*.3,h*.38,w*.6*(s.hp/s.maxHp),5);
    }
    ctx.restore();
  }

  function draw(){
    if(!ctx) return;
    ctx.save();
    if(shake) ctx.translate((Math.random()-.5)*shake*4,(Math.random()-.5)*shake*3);
    drawSky();
    fleet.forEach(s=>{ if(s.alive||s.sink>0) drawShip(s,false); });
    shells.forEach(o=>{
      if(!o.alive) return;
      ctx.fillStyle='#fff4b0'; ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,7); ctx.fill();
      ctx.fillStyle='#ff9a3c'; ctx.beginPath(); ctx.arc(o.x-o.vx*.02,o.y-o.vy*.02,o.r*.55,0,7); ctx.fill();
    });
    drawShip({x:player.x,y:player.y,w:clamp(W*.16,86,140),h:clamp(H*.1,30,48),color:'#5ad0ff',phase:0,word:'',alive:true,maxHp:1},true);
    fx.forEach(p=>{ if(!p.alive) return; ctx.globalAlpha=clamp(p.life*2,0,1); ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); ctx.globalAlpha=1; });
    ctx.restore();
  }

  function renderHud(){
    if(!hud.th) return;
    hud.th.textContent=word?word.th:'—';
    hud.en.textContent=word?word.w.replace(/./g,'•'):'';
    hud.hearts.textContent='❤'.repeat(hearts)+'♡'.repeat(Math.max(0,HEARTS-hearts));
    hud.coins.textContent=String(coinsRun);
    hud.wave.textContent='คลื่น '+wave;
    hud.words.textContent=String(wordsDone);
    if(hud.hint) hud.hint.textContent='ยิงเรือลำเดียวที่แปลว่า “'+(word?word.th:'')+'” — เรืออยู่ในน้ำเท่านั้น';
  }

  function step(dt){
    elapsed+=dt; tickPlayer(dt); tickFleet(dt); shells.forEach(s=>tickShell(s,dt)); tickFx(dt);
    if(running&&!paused&&pointerId!==null) fire();
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
    fleet=[]; shells=[]; fx=[]; last=0; elapsed=0; fireAt=0; pointerId=null;
    player.vx=0; qGrade=null; queue=[]; lastWord='';
    spawnIslands(); spawnWave();
  }

  function settleScoreRun(){
    if(scoreSettled) return 0;
    scoreSettled=true;
    const add=Math.max(0,score);
    if(typeof state!=='undefined') state.wshScore=(state.wshScore||0)+add;
    queueSave(); return add;
  }

  function endRun(){
    paused=true; running=false; settleScoreRun();
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
      <p>ทะเลสดใสแบบเรือรบของเล่น — มีเรือศัตรู<b>ลำเดียว</b>ในน้ำ อ่านคำไทยแล้วยิงให้ตรงคำอังกฤษบนลำเรือ</p>
      <p>คำศัพท์ชุดเดียวกับเกม 🎯 ยิงเป้าคำ ตามระดับชั้นของน้อง · ไม่โหลดคลังคำใหม่จากเน็ต</p>
      <p>ลากซ้ายขวาบังคับเรือ · แตะจอ/Space ยิง · เรือเป้าหมายมีวงแหวนทอง</p>
      <button type="button">⚓ ออกทะเล!</button></div>`;
    hud.intro.querySelector('button').onclick=()=>{
      hud.intro.hidden=true; paused=false;
      if(typeof state!=='undefined'){ state.wshIntro=1; if(typeof saveState==='function') saveState(); }
    };
  }

  function bind(){
    const onMove=e=>{
      if(pointerId===null && e.pointerType==='mouse'){ player.aimX=e.clientX; player.aimY=e.clientY; return; }
      if(e.pointerId!==pointerId) return;
      pointerX=e.clientX; player.aimX=e.clientX; player.aimY=e.clientY;
    };
    canvas.addEventListener('pointerdown',e=>{
      if(e.button===2) return;
      pointerId=e.pointerId; pointerX=e.clientX; player.aimX=e.clientX; player.aimY=e.clientY;
      try{canvas.setPointerCapture(e.pointerId);}catch(_){}
      fire();
    });
    canvas.addEventListener('pointermove',onMove);
    const up=e=>{ if(e.pointerId===pointerId) pointerId=null; };
    canvas.addEventListener('pointerup',up); canvas.addEventListener('pointercancel',up);
    window.addEventListener('keydown',e=>{
      if(!running) return;
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') keyLeft=true;
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') keyRight=true;
      if(e.code==='Space'){ e.preventDefault(); fire(); }
      if(e.key==='Escape') close();
    });
    window.addEventListener('keyup',e=>{
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') keyLeft=false;
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') keyRight=false;
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
    root.innerHTML=`<canvas></canvas>
      <div class="wsh-hud">
        <div class="wsh-glass wsh-stats"><span id="wsh-hearts"></span><b id="wsh-coins">0</b> 🪙<span id="wsh-wave">คลื่น 1</span><span>คำ <b id="wsh-words">0</b></span></div>
        <div class="wsh-glass wsh-word"><small>ยิงเรือที่แปลว่า</small><strong id="wsh-th">—</strong><em id="wsh-en"></em></div>
        <button type="button" class="wsh-exit" id="wsh-exit">ออก</button>
        <div class="wsh-hint" id="wsh-hint"></div>
        <div class="wsh-toast" id="wsh-toast"></div>
      </div>
      <div class="wsh-modal" id="wsh-intro" hidden></div>
      <div class="wsh-modal" id="wsh-result" hidden></div>`;
    document.body.appendChild(root);
    canvas=root.querySelector('canvas'); ctx=canvas.getContext('2d',{alpha:false});
    hud={
      hearts:root.querySelector('#wsh-hearts'), coins:root.querySelector('#wsh-coins'),
      wave:root.querySelector('#wsh-wave'), words:root.querySelector('#wsh-words'),
      th:root.querySelector('#wsh-th'), en:root.querySelector('#wsh-en'),
      hint:root.querySelector('#wsh-hint'), toast:root.querySelector('#wsh-toast'),
      exit:root.querySelector('#wsh-exit'), intro:root.querySelector('#wsh-intro'),
      result:root.querySelector('#wsh-result')
    };
    bind(); built=true;
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
      buildDom();
      root.style.display='block';
      resize(); resetRun();
      running=true; paused=false; last=0;
      if(typeof Music!=='undefined'&&Music.suspendBg) Music.suspendBg();
      ac();
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
    running=false; paused=true; settleScoreRun();
    if(raf) cancelAnimationFrame(raf); raf=0;
    clearTimers();
    if(root) root.style.display='none';
    if(hud.result) hud.result.hidden=true;
    if(typeof Music!=='undefined'&&Music.resumeBg) Music.resumeBg();
    try{ if(audio&&audio.state==='running') audio.suspend(); }catch(_){}
    if(typeof saveState==='function') saveState();
    if(typeof renderDashboard==='function') renderDashboard();
  }

  window.WordShip={ open, close, refreshLock:typeof refreshWordShipLock==='function'?refreshWordShipLock:function(){}, _t:{
    MINLEN, MAXLEN, HIT_COIN, PERFECT_BONUS, HEARTS, MAX_FLEET, WATER_HORIZON, FAR_SCALE, NEAR_SCALE, SHIP_SPEED,
    pool, takeWord, spawnWave, pickCourse, waterLimits, depthScale, applyShipScale, courseProgress, fire, hitShip, setViewport, setPlayer, resetRun, step, awardHit, adminAllowed, shipSpeed,
    get word(){return word;}, get fleet(){return fleet;}, get shells(){return shells;},
    get score(){return score;}, get coinsRun(){return coinsRun;}, get hearts(){return hearts;},
    get wordsDone(){return wordsDone;}, get misses(){return misses;}, get wave(){return wave;},
    get player(){return player;}, get running(){return running;},
    setRunning(v){running=!!v;}, setPaused(v){paused=!!v;}, settleScoreRun
  }};
})();
