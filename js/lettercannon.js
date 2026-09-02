"use strict";
"use strict";
/* 🔤💥🏆 รางวัลรายเดือนของกระดาน Letter Cannon / Dragon Sky Siege */
if(typeof window.makeMonthAward==='function') window.LcAward = window.makeMonthAward({
  id:'lc', path:'lcAward', field:'lc',
  boardOf:()=> (typeof Online!=='undefined' ? Online.lcBoard : []),
  scoreOf:()=> (typeof state!=='undefined' ? (state.lcScore||0) : 0),
  seenK:'lcAwardSeen', paidK:'lcAwardPaid', logK:'lcAwardLog',
  emoji:'🔤💥', unit:'แต้ม', game:'🔤💥 Letter Cannon',
  empty:'ยังไม่มีใครมีแต้มเลย — เล่น Letter Cannon เป็นคนแรกสิ!',
  rules:[
    'คะแนนทุกภารกิจที่จบหรือออกจากเกมจะรวมเป็น <b>คะแนนสะสมตลอดกาล</b>',
    '<b>คะแนนไม่รีเซ็ตรายเดือน</b> — เล่นต่อเนื่องเพื่อไต่อันดับ Top 100',
    'ตัดสินอันดับ <b>วันที่ 1 เวลา 00:01 น.</b> · Top 10 รับ 10,000–1,000 เหรียญอัตโนมัติ',
  ],
});
/* ============================================================
  🐉💥 Dragon Sky Siege (รอบ 1315)
   Portrait shooter: free flight, graded 500-word loops, return fire and timed bosses.
   Three ballistic rounds, homing missiles, ten hearts and a living dragon gunner.
   ============================================================ */
(function(){
  const AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const POWER=[
    {id:'triple',name:'TRIPLE ARC',icon:'⑶',color:'#ffca55',time:9},
    {id:'beam',name:'PLASMA BEAM',icon:'⚡',color:'#59efff',time:7},
    {id:'chain',name:'CHAIN LIGHTNING',icon:'ϟ',color:'#b987ff',time:8},
    {id:'homing',name:'HOMING COMET',icon:'☄',color:'#ff7bd5',time:9},
    {id:'nova',name:'NOVA BURST',icon:'✺',color:'#fff183',time:0},
    {id:'freeze',name:'TIME FREEZE',icon:'❄',color:'#8ff8ff',time:8},
    {id:'double',name:'DOUBLE SCORE',icon:'×2',color:'#7dff9b',time:10},
    {id:'barrage',name:'DRAGON BARRAGE',icon:'🔥',color:'#ff7a45',time:10},
    {id:'missileRain',name:'MISSILE RAIN',icon:'🚀',color:'#ffb04f',time:10}
  ];
  const AMMO=[
    {id:'tracer',name:'TRACER',speed:2.15,color:'#ffd65a',core:'#fff8c2',size:4,damage:1,pierce:0,sound:'shot'},
    {id:'heavy',name:'HEAVY',speed:1.55,color:'#ff873f',core:'#fff0b0',size:7,damage:2,pierce:0,sound:'heavy'},
    {id:'piercer',name:'PIERCER',speed:1.9,color:'#7feaff',core:'#eaffff',size:5,damage:1,pierce:1,sound:'pierce'}
  ];
  const MAX_MISSILES=3, MAX_MISSILE_STOCK=12, MISSILE_PICKUP_BONUS=4, MISSILE_SALVO=3, MISSILE_BLAST=105;
  const MAX_LETTERS=12, MAX_BULLETS=72, MAX_PARTICLES=140, SHOT_ANGLE=-Math.PI/2, WORD_BONUS=50;
  const FRAME_MS=1000/60,DPR_CAP=1.5,MUZZLE_PARTICLES=7,ROUND_TRAIL_STEP=.065,MISSILE_TRAIL_STEP=.035;
  const MISSION_WORDS=5, MAX_SHIELD=10, BASE_LINE=.9;
  const BOSS_INTERVAL=30,MAX_ENEMIES=3;
  const MOVE_SPEED_CAP=1500, MOVE_SPEED_FACTOR=1.5, MOVE_ACCEL=34, MOVE_BRAKE=42;
  const COIN_IMAGE='img/coins/coin_gold.webp';
  /* เพลงสร้างเมื่อเข้าเกมเท่านั้น; production build จะแทน token ด้วย URL ที่มี content hash
     จึง stream เท่าที่เล่นและใช้ browser disk cache เดิมข้าม deploy เมื่อไฟล์เพลงไม่เปลี่ยน */
  const LC_BGM_BUILD_URL='__VW_LC_BGM_URL__';
  const LC_BGM_URL=LC_BGM_BUILD_URL.startsWith('__VW_')?'sound/letter_cannon/Wordflight_Beyond_the_Stars.mp3':LC_BGM_BUILD_URL;
  const LC_BGM_VOLUME=.4,LC_BGM_EXIT_FADE_MS=1100;
  const LC_BACKGROUND_URLS=[1,2,3].map(n=>'img/letter_cannon/letter_cannon_bg'+n+'.avif');
  const LC_BACKGROUND_SCENE_S=12,LC_BACKGROUND_FADE_S=2;
  const FALLBACK=[['CAT','แมว'],['DOG','สุนัข'],['BOOK','หนังสือ'],['APPLE','แอปเปิล'],['WATER','น้ำ']];
  const PLAYER={size:1254,url:'assets/images/letter_cannon/dragon_gunner_player.webp'};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const pick=a=>a[(Math.random()*a.length)|0];
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const ANNOUNCEMENT_KEY='vwLetterCannonAnnouncement1152';
  let root=null,canvas=null,ctx=null,raf=0,abort=null,audio=null,opening=false,saveTimer=0,dockObserver=null;
  let lcBgm=null,lcBgmBtn=null,lcBgmFadeTimer=0,lcBgmFadeToken=0,lcBgmPlayToken=0,lcBgmBlocked=false,lcMusicEnabled=true;
  let W=0,H=0,dpr=1,last=0,frameAt=0,elapsed=0,running=false,paused=false,counting=false;
  let word=null,pos=0,queue=[],queueGrade='',lastWord='',vocabSize=0,score=0,scoreSettled=false,combo=0,wordsDone=0,setWordsDone=0,coinsRun=0;
  let shield=MAX_SHIELD,wave=1,bossMode=false,boss=null,bossesDefeated=0,missionEnded=false,threatsStopped=0,misses=0;
  let fireAt=0,spawnAt=0,threatAt=0,enemyAt=0,bossAt=0,powerAt=0,playerX=0,playerY=0,playerVX=0,playerVY=0;
  let activePower=null,powerLeft=0,powerTotal=0,shake=0,flash=0,flashSide=0,barrelCycle=0;
  let missiles=MAX_MISSILES,currentAmmo=AMMO[0],shotSeq=0;
  let dragPointer=null,dragX=0,dragY=0,keyLeft=false,keyRight=false,keyUp=false,keyDown=false;
  let letters=[],bullets=[],particles=[],shockwaves=[],stars=[],clouds=[],letterSeq=0,wordSeq=0,particleCursor=0,rewardedLetters=new Set(),rewardedWords=new Set();
  let hud={},timers=new Set(),playerImage=null,playerLoad=null,orientationLocked=false,gameFullscreen=false,skyGradient=null,noiseBuffers=Object.create(null);
  let backgroundImages=Array(LC_BACKGROUND_URLS.length).fill(null),backgroundLoads=Array(LC_BACKGROUND_URLS.length).fill(null);
  function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
  function clearTimers(){timers.forEach(clearTimeout);timers.clear();}
  function resetFrameClock(){last=frameAt=0;}
  function queueCloudSave(){
    if(saveTimer){clearTimeout(saveTimer);timers.delete(saveTimer);}
    saveTimer=later(()=>{saveTimer=0;if(typeof authPushSave==='function')authPushSave(false);},650);
  }
  function flushCloudSave(){
    if(saveTimer){clearTimeout(saveTimer);timers.delete(saveTimer);saveTimer=0;}
    if(typeof authPushSave==='function')authPushSave(false);
  }
  function loadPlayerAssets(){
    if(playerImage)return Promise.resolve(playerImage);
    if(playerLoad)return playerLoad;
    const load=src=>new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('โหลดภาพมังกรนักบินไม่สำเร็จ: '+src));img.src=src;});
    playerLoad=load(PLAYER.url).then(img=>{playerImage=img;return img;}).catch(err=>{playerLoad=null;throw err;});
    return playerLoad;
  }
  function loadBackgroundAsset(index){
    if(backgroundImages[index])return Promise.resolve(backgroundImages[index]);
    if(backgroundLoads[index])return backgroundLoads[index];
    const src=LC_BACKGROUND_URLS[index];if(!src)return Promise.resolve(null);
    backgroundLoads[index]=new Promise(resolve=>{const img=new Image();img.decoding='async';img.onload=()=>{backgroundImages[index]=img;resolve(img);};img.onerror=()=>{backgroundLoads[index]=null;resolve(null);};img.src=src;});
    return backgroundLoads[index];
  }

  function grade(){return typeof state!=='undefined'&&state.student&&state.student.grade||'ป.1';}
  function wordPool(){
    const rich=typeof f1VocabForStudent==='function'?f1VocabForStudent(grade()):[],basic=typeof vocabForStudent==='function'?vocabForStudent():FALLBACK,src=rich.length>=500?rich:rich.concat(basic);
    const seen=new Set(),out=[];
    src.forEach(v=>{const en=String(v&&v[0]||'').toUpperCase().replace(/[^A-Z]/g,'');if(en.length>=2&&en.length<=10&&!seen.has(en)){seen.add(en);out.push({en,th:String(v[1]||'')});}});
    return out.length?out:FALLBACK.map(v=>({en:v[0],th:v[1]}));
  }
  function nextWord(){
    const g=grade();
    if(g!==queueGrade){queue=[];queueGrade=g;lastWord='';}
    if(!queue.length){queue=shuffle(wordPool());vocabSize=queue.length;if(queue.length>1&&queue[0].en===lastWord)queue.push(queue.shift());}
    word=queue.shift();lastWord=word.en;word.rewardId=++wordSeq;pos=0;ensureNeeded(true);renderHud();
  }
  function nextNeeded(){return word&&word.en[pos]||'';}
  function cannonX(){return playerX||W*.5;}
  function playerSize(){return clamp(Math.min(W*.26,H*.16),78,138);}
  function playerLimits(){const pad=playerSize()*.55;return{minX:pad,maxX:W-pad,minY:Math.max(H*.27,pad+76),maxY:H*.84};}
  function playerGeometry(x,y,size,side,recoil){
    const yy=y||playerY||H*.76,back=(recoil||0),muzzles=[{x:x-size*.18,y:yy-size*.28+back},{x:x+size*.18,y:yy-size*.28+back}];
    return{x,y:yy,mountY:yy,size,scale:size/PLAYER.size,muzzles,muzzle:muzzles[side||0]};
  }
  function turretSize(){return playerSize();}
  function cannonLimits(){const p=playerLimits();return{min:p.minX,max:p.maxX};}
  function turretGeometry(x,size,side,recoil){return playerGeometry(x,playerY,size,side,recoil);}
  function neededAlive(){const n=nextNeeded();return letters.some(o=>o.alive&&o.kind==='letter'&&o.ch===n&&o.y<H*.72);}
  function safeX(r){
    for(let n=0;n<18;n++){const x=r+Math.random()*(W-r*2);if(letters.every(o=>!o.alive||Math.abs(o.x-x)>r*1.55||o.y>H*.28))return x;}
    return r+Math.random()*(W-r*2);
  }
  function spawnLetter(ch,priority){
    if(letters.filter(o=>o.alive).length>=MAX_LETTERS)return null;
    const r=clamp(Math.min(W,H)*.041,19,35),level=Math.min(12,wordsDone);
    const o=letters.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,kind:'letter',ch:ch||pick(AZ),x:safeX(r),y:-r-Math.random()*H*.08,r,vy:(H*(.052+level*.0026))*(priority?.86:1)*(activePower&&activePower.id==='freeze'?.46:1),phase:Math.random()*6.28,spin:(Math.random()-.5)*.45,priority:!!priority,hit:0,coinAwarded:false,rewardId:++letterSeq});
    if(!letters.includes(o))letters.push(o);return o;
  }
  function ensureNeeded(force){if(!word||pos>=word.en.length)return;if(force||!neededAlive())spawnLetter(nextNeeded(),true);}
  function spawnDistractor(){
    let ch=pick(AZ);const need=nextNeeded();if(Math.random()<.25&&word)ch=pick(word.en.split(''));if(ch===need&&neededAlive())ch=pick(AZ.replace(need,''));spawnLetter(ch,false);
  }
  function spawnPower(){
    if(letters.some(o=>o.alive&&o.kind==='power'))return;
    const p=pick(POWER),r=clamp(Math.min(W,H)*.038,18,32),o=letters.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,kind:'power',power:p,x:safeX(r),y:-r,r,vy:H*.05,phase:Math.random()*6.28,spin:.8,hit:0});if(!letters.includes(o))letters.push(o);return o;
  }
  function collectPower(o){
    if(!o||!o.alive||o.kind!=='power')return false;o.alive=false;impact(o.x,o.y,o.power.color,34);activate(o.power);sound('power');return true;
  }
  function spawnMeteor(){
    if(letters.filter(o=>o.alive&&o.kind==='meteor').length>=(bossMode?3:2))return null;
    const r=clamp(Math.min(W,H)*(bossMode?.052:.043),22,42),o=letters.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,kind:'meteor',x:safeX(r),y:-r,r,vy:H*(.105+wave*.018)*(activePower&&activePower.id==='freeze'?.46:1),phase:Math.random()*6.28,spin:(Math.random()-.5)*2.3,hit:0,hp:bossMode?2:1,maxHp:bossMode?2:1});
    if(!letters.includes(o))letters.push(o);return o;
  }
  function spawnEnemy(){
    if(letters.filter(o=>o.alive&&o.kind==='enemy').length>=MAX_ENEMIES)return null;
    const r=clamp(Math.min(W,H)*.038,20,34),o=letters.find(x=>!x.alive)||{},hp=2+Math.floor(bossesDefeated/2),x=safeX(r);
    Object.assign(o,{alive:true,kind:'enemy',x,baseX:x,y:-r,r,vy:H*(.048+wave*.006),hp,maxHp:hp,fireAt:elapsed+1+Math.random(),phase:Math.random()*6.28,hit:0});if(!letters.includes(o))letters.push(o);return o;
  }
  function fireEnemyShot(source,offset){
    let o=bullets.find(x=>!x.alive);if(!o&&bullets.length>=MAX_BULLETS)return null;o=o||{};const a=Math.atan2(playerY-source.y,playerX-source.x)+(offset||0),speed=H*(.31+Math.min(.12,bossesDefeated*.012));
    Object.assign(o,{alive:true,kind:'enemyShot',x:source.x,y:source.y+source.r*.42,px:source.x,py:source.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:4.2,trailLeft:0,r:source.kind==='boss'?6:4.5,phase:Math.random()*6.28});if(!bullets.includes(o))bullets.push(o);sound('enemy');return o;
  }
  function hitEnemy(o,damage){
    if(!o||!o.alive)return false;o.hp-=Math.max(1,damage||1);o.hit=.24;impact(o.x,o.y,'#ff5c72',10,o.r*.55);if(o.hp>0)return false;
    o.alive=false;threatsStopped++;score+=35+wave*8;combo++;burst(o.x,o.y,'#ffbd63',16);toast('✈️ ทำลายเครื่องบินศัตรู!','#ffd38b');sound('explode');renderHud();return true;
  }
  function spawnBoss(){
    if(boss&&boss.alive)return boss;const r=clamp(Math.min(W*.15,H*.09),52,88),hp=28+bossesDefeated*10;
    boss={alive:true,kind:'boss',x:W*.5,y:H*.16,r,hp,maxHp:hp,fireAt:elapsed+1.2,phase:Math.random()*6.28,hit:0};bossMode=true;toast('👾 BOSS '+(bossesDefeated+1)+' เข้าโจมตี!','#ffcf76');sound('boss');renderHud();return boss;
  }
  function completeBossCycle(){
    if(!boss||boss.alive)return false;bossMode=false;bossesDefeated++;wave=bossesDefeated+1;setWordsDone=0;bossAt=elapsed+BOSS_INTERVAL;refillMissile();
    letters.forEach(o=>{if(o.alive&&o.kind==='enemy')o.alive=false;});bullets.forEach(b=>{if(b.alive&&b.kind==='enemyShot')b.alive=false;});nextWord();celebrate();toast('🏆 บอสถูกทำลาย! เริ่มชุดคำศัพท์ใหม่ · คลื่น '+wave,'#fff08b');renderHud();return true;
  }
  function hitBoss(o,damage){
    if(!o||!o.alive)return false;o.hp-=Math.max(1,damage||1);o.hit=.18;impact(o.x,o.y,'#ff6586',12,o.r*.35);sound('meteor');if(o.hp>0){renderHud();return false;}
    o.hp=0;o.alive=false;threatsStopped++;score+=500+bossesDefeated*150;burst(o.x,o.y,'#ffe16d',34);shockwave(o.x,o.y,'#ff6f91',18,o.r*2.4,.8);sound('explode');return completeBossCycle();
  }
  function tickBoss(dt){
    if(!boss||!boss.alive)return;boss.hit=Math.max(0,boss.hit-dt);boss.x=W*.5+Math.sin(elapsed*.72+boss.phase)*W*.29;
    if(elapsed>=boss.fireAt){fireEnemyShot(boss,-.2);fireEnemyShot(boss,0);fireEnemyShot(boss,.2);boss.fireAt=elapsed+Math.max(.82,1.55-bossesDefeated*.08);}
  }
  function hitMeteor(o,damage){
    if(!o.alive)return;o.hp-=Math.max(1,damage||1);o.hit=.3;impact(o.x,o.y,'#ff9b4c',18,o.r*.8);sound('meteor');
    if(o.hp>0){toast('💥 เกราะอุกกาบาตแตก — ยิงอีกครั้ง!','#ffd18b');return;}
    o.alive=false;threatsStopped++;score+=20+wave*5;combo++;burst(o.x,o.y,'#ffdf78',18);toast('🛡️ ป้องกันฐาน! +'+(20+wave*5),'#9dffdc');renderHud();
  }
  function damageBase(reason,x){
    if(missionEnded||shield<=0)return false;shield--;combo=0;misses++;shake=13;flash=Math.max(flash,.28);
    impact(x||W*.5,H*BASE_LINE,'#ff5f70',34,42);toast('💔 '+reason+' · โล่เหลือ '+shield,'#ff9caa');sound('damage');renderHud();
    if(shield<=0)later(()=>finishMission(false),520);return true;
  }
  function settleScoreRun(){
    if(scoreSettled)return 0;scoreSettled=true;const earned=Math.max(0,Math.round(score||0));
    if(typeof state!=='undefined'){state.lcScore=Math.max(0,Math.round(state.lcScore||0))+earned;if(typeof saveState==='function')saveState();if(typeof onlinePushScore==='function')onlinePushScore();queueCloudSave();}
    return earned;
  }
  function finishMission(won){
    if(missionEnded||!root)return;missionEnded=true;paused=true;dragPointer=null;keyLeft=keyRight=keyUp=keyDown=false;playerVX=playerVY=0;
    settleScoreRun();
    const rank=bossesDefeated>=3?'S':bossesDefeated>=2?'A':bossesDefeated>=1?'B':wordsDone>=3?'C':'D',m=document.createElement('div');m.id='lc-result';m.className='lc-modal';
    m.innerHTML='<div class="lc-card lc-result-card"><div class="lc-rank lost">'+rank+'</div><h2>💥 ฐานเสียหาย</h2><p>ต้านได้ '+wave+' คลื่น · สะกด '+wordsDone+' คำจากคลังระดับ '+grade()+'</p><div class="lc-result-grid"><span class="lc-result-coins"><img src="'+COIN_IMAGE+'" alt="เหรียญทอง"><em>เหรียญเข้ากระเป๋า</em><b>+'+coinsRun.toLocaleString()+'</b></span><span>บอสที่ชนะ<b>'+bossesDefeated+'</b></span><span>คำศัพท์<b>'+wordsDone+'</b></span><span>ยิงพลาด<b>'+misses+'</b></span></div><div class="lc-buttons"><button class="lc-btn primary" data-a="retry">↻ เล่นภารกิจใหม่</button><button class="lc-btn" data-a="exit">🚪 กลับ Lobby</button></div></div>';
    root.appendChild(m);m.querySelector('[data-a=retry]').onclick=()=>{m.remove();resetMission();countdown();};m.querySelector('[data-a=exit]').onclick=close;sound(won?'win':'damage');if(coinsRun>0)later(()=>sound('coinBig'),260);
  }
  function resetMission(){
    clearTimers();score=combo=wordsDone=setWordsDone=coinsRun=pos=0;scoreSettled=false;shield=MAX_SHIELD;wave=1;bossMode=missionEnded=false;boss=null;bossesDefeated=0;threatsStopped=misses=0;elapsed=0;spawnAt=.35;threatAt=2.4;enemyAt=4;bossAt=BOSS_INTERVAL;powerAt=8;queue=[];queueGrade='';lastWord='';vocabSize=0;
    letters=[];bullets=[];particles=[];shockwaves=[];particleCursor=0;rewardedLetters.clear();rewardedWords.clear();activePower=null;powerLeft=powerTotal=0;missiles=MAX_MISSILES;shotSeq=0;currentAmmo=AMMO[0];barrelCycle=flashSide=0;paused=false;nextWord();renderHud();
  }
  function bullet(angle,side,muzzleIndex,ammo){
    const a=ammo||currentAmmo,g=playerGeometry(cannonX(),playerY,playerSize(),muzzleIndex,0),bx=g.muzzle.x,by=g.muzzle.y,o=bullets.find(x=>!x.alive)||{},speed=H*a.speed;
    Object.assign(o,{alive:true,kind:'round',ammo:a,damage:a.damage,pierce:a.pierce,x:bx,y:by,px:bx,py:by,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1.25,trailLeft:0,side:!!side,homing:activePower&&activePower.id==='homing'&&!side,phase:Math.random()*6.28});if(!bullets.includes(o)&&bullets.length<MAX_BULLETS)bullets.push(o);return o;
  }
  function fire(){
    if(!running||paused||counting||missionEnded)return;const ammo=AMMO[shotSeq%AMMO.length],now=performance.now(),gap=activePower&&activePower.id==='beam'?110:ammo.id==='tracer'?175:ammo.id==='heavy'?315:240;if(now-fireAt<gap)return;fireAt=now;shotSeq++;currentAmmo=ammo;
    const side=barrelCycle++%2;flashSide=side;
    if(activePower&&activePower.id==='beam'){beamHit(side);sound('beam');}
    else{bullet(SHOT_ANGLE,false,side,ammo);if(activePower&&activePower.id==='triple'){bullet(SHOT_ANGLE-.11,true,0,ammo);bullet(SHOT_ANGLE+.11,true,1,ammo);}if(activePower&&activePower.id==='barrage')[-.24,-.12,.12,.24].forEach((a,i)=>bullet(SHOT_ANGLE+a,true,i%2,ammo));sound(ammo.sound);}
    const m=playerGeometry(cannonX(),playerY,playerSize(),side,0).muzzle;for(let i=0;i<MUZZLE_PARTICLES;i++)particle(m.x,m.y,pick(['#ffffff',ammo.core,ammo.color,'#ff9f45']),SHOT_ANGLE+(Math.random()-.5)*.72,80+Math.random()*280,.22+Math.random()*.24,2+Math.random()*4);
    shockwave(m.x,m.y,ammo.color,5,34,.28);shake=Math.max(shake,ammo.id==='heavy'?7:4.8);flash=.13;
  }
  function missileTarget(){return boss&&boss.alive?boss:letters.filter(o=>o.alive&&(o.kind==='enemy'||o.kind==='meteor')).sort((a,b)=>b.y-a.y)[0]||null;}
  function spawnMissile(target){
    const side=barrelCycle++%2,g=playerGeometry(cannonX(),playerY,playerSize(),side,0),m=g.muzzle,o=bullets.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,kind:'missile',target,x:m.x,y:m.y,px:m.x,py:m.y,vx:0,vy:-H*.72,speed:H*.72,life:4,trailLeft:0,side:false,phase:Math.random()*6.28});if(!bullets.includes(o)&&bullets.length<MAX_BULLETS)bullets.push(o);return o;
  }
  function fireMissile(){
    if(!running||paused||counting||missionEnded)return false;if(missiles<=0){toast('Missile หมด — สะกดครบคำเพื่อเติม','#ffd179');return false;}const target=missileTarget();if(!target){toast('ยังไม่มีศัตรูให้ล็อกเป้า','#9deaff');return false;}
    const salvo=activePower&&activePower.id==='missileRain'?Math.min(MISSILE_SALVO,missiles):1;missiles-=salvo;for(let i=0;i<salvo;i++)spawnMissile(target);sound('missile');toast(salvo>1?'🚀 MISSILE SALVO ×'+salvo:'🚀 MISSILE LOCK','#ffdd83');renderHud();return true;
  }
  function refillMissile(){if(missiles<MAX_MISSILES)missiles++;return missiles;}
  function explodeMissile(b){
    if(!b.alive)return;b.alive=false;const x=b.x,y=b.y;letters.forEach(o=>{if(!o.alive||Math.hypot(o.x-x,o.y-y)>MISSILE_BLAST)return;if(o.kind==='meteor')hitMeteor(o,99);else if(o.kind==='enemy')hitEnemy(o,99);else if(o.kind==='letter'&&!o.priority){o.alive=false;burst(o.x,o.y,'#ffb65d',8);}});if(boss&&boss.alive&&Math.hypot(boss.x-x,boss.y-y)<=MISSILE_BLAST+boss.r)hitBoss(boss,8);
    impact(x,y,'#ff9d38',42,MISSILE_BLAST*.55);shockwave(x,y,'#fff2a0',12,MISSILE_BLAST,.5);score+=30;sound('explode');renderHud();
  }
  function beamHit(side){
    const m=turretGeometry(cannonX(),turretSize(),side,0).muzzle,dx=Math.cos(SHOT_ANGLE),dy=Math.sin(SHOT_ANGLE),ox=m.x,oy=m.y,targets=boss&&boss.alive?letters.concat([boss]):letters;let best=null,bd=Infinity;
    targets.forEach(o=>{if(!o.alive)return;const t=(o.x-ox)*dx+(o.y-oy)*dy;if(t<0)return;const q=Math.abs((o.x-ox)*dy-(o.y-oy)*dx);if(q<o.r*1.5&&t<bd){best=o;bd=t;}});if(best)hit(best,false);
  }
  function hit(o,side,damage){
    if(!o.alive)return;
    if(o.kind==='boss'){hitBoss(o,damage);return;}
    if(o.kind==='enemy'){hitEnemy(o,damage);return;}
    if(o.kind==='power'){collectPower(o);return;}
    if(o.kind==='meteor'){hitMeteor(o,damage);return;}
    if(side){o.alive=false;impact(o.x,o.y,'#8cefff',18);return;}
    if(o.ch===nextNeeded()){correct(o);}else{wrong(o);}
  }
  function correct(o){
    const x=o.x,y=o.y,r=o.r;o.alive=false;pos++;combo++;awardLetterCoin(o,x,y);const mul=activePower&&activePower.id==='double'?2:1;score+=10*mul+Math.min(50,combo*2);impact(x,y,'#ffe96f',30,r);toast('✅ '+o.ch+(combo>2?'  STREAK '+combo:'') ,'#fff07b');sound('correct');
    if(combo>0&&combo%6===0&&!activePower)activate(POWER.find(p=>p.id==='homing'));
    if(activePower&&activePower.id==='chain'){const decoy=letters.find(v=>v.alive&&v.kind==='letter'&&v.ch!==nextNeeded());if(decoy){decoy.alive=false;lightning(x,y,decoy.x,decoy.y);burst(decoy.x,decoy.y,'#b98aff',9);}}
    if(pos>=word.en.length)completeWord();else{ensureNeeded(true);renderHud();}
  }
  function wrong(o){
    o.alive=false;combo=0;misses++;score=Math.max(0,score-5);impact(o.x,o.y,'#76dfff',16,o.r*.72);toast('⚠️ ต้องหา '+nextNeeded()+' · สตรีคขาด','#8fe9ff');sound('soft');renderHud();
  }
  function completeWord(){
    wordsDone++;setWordsDone++;score+=100+word.en.length*12;awardWordBonus(word);refillMissile();renderHud();
    if(typeof speakWord==='function')speakWord(word.en.toLowerCase());
    toast('🌟 '+word.en+' · '+word.th+'  ครบคำ! +'+WORD_BONUS+' เหรียญ','#ffe85c');celebrate();paused=true;
    later(()=>{if(running&&!missionEnded){nextWord();paused=false;resetFrameClock();}},820);
  }
  function awardLetterCoin(o,x,y){
    if(!o||o.coinAwarded||rewardedLetters.has(o.rewardId))return false;o.coinAwarded=true;rewardedLetters.add(o.rewardId);coinsRun++;
    if(typeof addCoins==='function')addCoins(1);if(typeof saveState==='function')saveState();queueCloudSave();coinFx(x,y,1,false);later(()=>sound('coin'),70);renderHud();return true;
  }
  function awardWordBonus(doneWord){
    if(!doneWord||rewardedWords.has(doneWord.rewardId))return false;rewardedWords.add(doneWord.rewardId);coinsRun+=WORD_BONUS;
    if(typeof addCoins==='function')addCoins(WORD_BONUS);if(typeof saveState==='function')saveState();queueCloudSave();coinFx(W*.5,H*.52,WORD_BONUS,true);later(()=>sound('coinBig'),130);renderHud();return true;
  }
  function coinFx(x,y,amount,big){
    if(!root)return;const rr=root.getBoundingClientRect(),cr=canvas&&canvas.getBoundingClientRect(),sx=cr?cr.left-rr.left+x*cr.width/W:x,sy=cr?cr.top-rr.top+y*cr.height/H:y,e=document.createElement('div');e.className='lc-coinfx'+(big?' big':'');e.style.left=sx+'px';e.style.top=sy+'px';e.innerHTML='<img class="lc-coin-img" src="'+COIN_IMAGE+'" alt="เหรียญทอง"><b>+'+amount+' เหรียญ</b>';root.appendChild(e);
    const tr=hud.coins&&hud.coins.getBoundingClientRect?hud.coins.getBoundingClientRect():null;if(tr){const count=big?6:1;for(let i=0;i<count;i++){const f=document.createElement('img'),startX=sx+(i-(count-1)/2)*(big?12:0),startY=sy+(big?Math.abs(i-(count-1)/2)*5:0);f.className='lc-coin-flight'+(big?' big':'');f.src=COIN_IMAGE;f.alt='';f.style.left=startX+'px';f.style.top=startY+'px';f.style.setProperty('--coin-x',(tr.left+tr.width*.5-rr.left-startX)+'px');f.style.setProperty('--coin-y',(tr.top+tr.height*.5-rr.top-startY)+'px');f.style.animationDelay=(i*55)+'ms';root.appendChild(f);later(()=>f.remove(),big?1250:950);}}
    if(hud.coins){hud.coins.classList.remove('pop');void hud.coins.offsetWidth;hud.coins.classList.add('pop');}
    later(()=>{e.remove();if(hud.coins)hud.coins.classList.remove('pop');},big?1550:1150);
  }
  function activate(p){
    if(p.id==='nova'){letters.forEach(o=>{if(o.alive&&o.kind==='letter'&&o.ch!==nextNeeded()){o.alive=false;burst(o.x,o.y,p.color,8);}});toast('✺ NOVA — เคลียร์ตัวหลอก!','#fff18c');shake=7;return;}
    activePower=p;powerLeft=powerTotal=p.time;if(p.id==='missileRain')missiles=Math.min(MAX_MISSILE_STOCK,missiles+MISSILE_PICKUP_BONUS);const detail=p.id==='barrage'?' · กระสุน 5 สาย':p.id==='missileRain'?` · จรวด +${MISSILE_PICKUP_BONUS} / ยิงชุดละ ${MISSILE_SALVO}`:'';toast(p.icon+' '+p.name+detail,p.color);renderHud();
  }
  function celebrate(){for(let i=0;i<40;i++)particle(W*.5,H*.32,pick(['#fff278','#60eaff','#ff72d2','#9b83ff']),Math.random()*6.28,80+Math.random()*260,1+Math.random());sound('win');}
  function particle(x,y,color,a,s,life,r){let p;if(particles.length<MAX_PARTICLES){p={};particles.push(p);}else p=particles[particleCursor];particleCursor=(particleCursor+1)%MAX_PARTICLES;Object.assign(p,{alive:true,x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:r||1.5+Math.random()*3,color,life:life||.65,max:life||.65});}
  function burst(x,y,color,n){for(let i=0;i<n;i++)particle(x,y,color,Math.random()*6.28,40+Math.random()*190,.35+Math.random()*.55);}
  function shockwave(x,y,color,start,end,life){let o=shockwaves.find(v=>!v.alive)||{};Object.assign(o,{alive:true,x,y,color,start,end,life,max:life});if(!shockwaves.includes(o))shockwaves.push(o);}
  function impact(x,y,color,n,r){burst(x,y,color,n);for(let i=0;i<8;i++)particle(x,y,i%2?'#ffffff':'#ff8bdc',Math.random()*6.28,170+Math.random()*280,.45+Math.random()*.5,3+Math.random()*5);shockwave(x,y,'#ffffff',5,(r||28)*2.5,.42);shockwave(x,y,color,8,(r||28)*3.4,.62);shake=Math.max(shake,7.5);}
  function lightning(x1,y1,x2,y2){for(let i=0;i<12;i++){const k=i/11,px=x1+(x2-x1)*k+(Math.random()-.5)*15,py=y1+(y2-y1)*k+(Math.random()-.5)*15;particle(px,py,'#d7b8ff',0,0,.25);}}
  function toast(text,color){if(!root)return;const e=document.createElement('div');e.className='lc-toast';e.style.color=color||'#fff';e.textContent=text;root.appendChild(e);later(()=>e.remove(),950);}

  /* ============================================================
     🎵 LETTER CANNON BACKGROUND MUSIC — lazy stream + disk cache + exit fade
     ============================================================ */
  function lcMusicPreferenceOn(){return lcMusicEnabled;}
  function lcMusicCanPlay(){return lcMusicPreferenceOn();}
  function lcMusicSyncButton(){
    if(!lcBgmBtn)return;
    const on=lcMusicPreferenceOn();
    lcBgmBtn.setAttribute('aria-pressed',on?'true':'false');
    lcBgmBtn.classList.toggle('blocked',lcBgmBlocked);
    lcBgmBtn.textContent=lcBgmBlocked?'⚠️ แตะเปิดเพลง':(on?'🎵 เพลง เปิด':'🔇 เพลง ปิด');
    lcBgmBtn.title='Beyond the Stars — เปิด/ปิดเพลง Letter Cannon';
  }
  function lcMusicEnsure(){
    if(lcBgm)return lcBgm;
    const a=new Audio();a.preload='metadata';a.loop=true;a.volume=LC_BGM_VOLUME;a.src=LC_BGM_URL;
    a.addEventListener('error',()=>{lcBgmBlocked=true;lcMusicSyncButton();});lcBgm=a;return a;
  }
  function lcMusicCancelFade(){lcBgmFadeToken++;if(lcBgmFadeTimer){clearTimeout(lcBgmFadeTimer);lcBgmFadeTimer=0;}}
  function lcMusicStart(){
    lcMusicCancelFade();lcBgmBlocked=false;lcMusicSyncButton();if(!lcMusicCanPlay())return Promise.resolve(false);
    const a=lcMusicEnsure(),token=++lcBgmPlayToken;a.volume=LC_BGM_VOLUME;const p=a.play();
    if(!p||!p.then)return Promise.resolve(true);
    return p.then(()=>{if(token!==lcBgmPlayToken||(!running&&!opening)){a.pause();return false;}lcBgmBlocked=false;lcMusicSyncButton();return true;}).catch(()=>{if(token===lcBgmPlayToken){lcBgmBlocked=true;lcMusicSyncButton();}return false;});
  }
  function lcMusicStop(fadeMs=0,reset=false,done){
    lcMusicCancelFade();lcBgmPlayToken++;const a=lcBgm;
    const finish=()=>{if(a){a.pause();a.volume=LC_BGM_VOLUME;if(reset){try{a.currentTime=0;}catch(_e){}}}lcBgmFadeTimer=0;if(done)done();};
    if(!a||a.paused||fadeMs<=0){finish();return;}
    const startAt=performance.now(),startVol=a.volume,fadeToken=++lcBgmFadeToken;
    const step=()=>{if(fadeToken!==lcBgmFadeToken)return;const k=Math.min(1,(performance.now()-startAt)/fadeMs);a.volume=Math.max(0,startVol*(1-k));if(k>=1)finish();else lcBgmFadeTimer=setTimeout(step,40);};step();
  }
  function lcMusicToggle(){
    if(lcBgmBlocked&&lcMusicPreferenceOn()){lcBgmBlocked=false;lcMusicSyncButton();lcMusicStart();return;}
    lcMusicEnabled=!lcMusicEnabled;
    lcBgmBlocked=false;lcMusicSyncButton();if(lcMusicEnabled)lcMusicStart();else lcMusicStop(320,false);
  }

  function noiseBurst(type,t){
    if(!audio||!['shot','heavy','pierce','missile','explode','enemy'].includes(type))return;
    const dur=type==='explode'?.42:type==='missile'?.28:type==='heavy'?.16:.085,len=Math.max(1,(audio.sampleRate*dur)|0);let buf=noiseBuffers[type];if(!buf){buf=audio.createBuffer(1,len,audio.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,type==='explode'?.75:1.8);noiseBuffers[type]=buf;}
    const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();src.buffer=buf;filter.type=type==='pierce'?'highpass':'lowpass';filter.frequency.value=type==='pierce'?1800:type==='explode'?850:1250;gain.gain.setValueAtTime(type==='explode'?.16:type==='heavy'?.13:.09,t);gain.gain.exponentialRampToValueAtTime(.001,t+dur);src.connect(filter);filter.connect(gain);gain.connect(audio.destination);src.start(t);
  }
  function toneSound(type){
    if(typeof state!=='undefined'&&!state.sound)return;
    try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const t=audio.currentTime,f=type==='correct'?740:(type==='coin'||type==='coinBig')?880:type==='win'?520:type==='power'?980:type==='beam'?1250:type==='missile'?72:type==='explode'?105:type==='heavy'?115:type==='pierce'?360:type==='enemy'?190:type==='boss'?74:type==='damage'?82:type==='meteor'?130:type==='soft'?260:155,notes=type==='coin'?[f,f*1.25,f*1.75]:type==='coinBig'?[f,f*1.25,f*1.5,f*2]:type==='boss'?[f,f*.8,f*.62]:type==='damage'?[f,f*.72]:type==='missile'?[f,f*1.18]:[f];notes.forEach((hz,i)=>{const at=t+i*.082,o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type=(type==='shot'||type==='heavy'||type==='missile'||type==='explode'||type==='enemy'||type==='boss'||type==='damage'||type==='meteor')?'sawtooth':type==='soft'?'sine':'triangle';o.frequency.setValueAtTime(hz,at);if(['shot','heavy','missile','explode','enemy','damage'].includes(type))o.frequency.exponentialRampToValueAtTime(type==='damage'?42:type==='missile'?38:75,at+.18);g.gain.setValueAtTime(type==='missile'||type==='explode'?.12:type==='damage'?.1:type==='shot'||type==='heavy'?.08:type==='enemy'?.045:(type==='coin'||type==='coinBig')?.11:.06,at);g.gain.exponentialRampToValueAtTime(.001,at+(type==='win'?.42:type==='missile'?.35:(type==='coin'||type==='coinBig')?.3:.2));o.start(at);o.stop(at+.5);});}catch(e){}
  }
  function sound(type){toneSound(type);if((typeof state==='undefined'||state.sound)&&audio)noiseBurst(type,audio.currentTime);}
  function renderHud(){
    if(!root||!word)return;hud.target.textContent=word.en;hud.meaning.textContent=(word.th||'คำศัพท์ระดับ '+grade())+' · '+grade()+' · คลัง '+vocabSize+' คำ';hud.progress.innerHTML=word.en.split('').map((c,i)=>'<span class="lc-slot '+(i<pos?'done':'')+'">'+(i<pos?c:'•')+'</span>').join('');hud.coins.textContent=coinsRun.toLocaleString();hud.combo.textContent=combo.toLocaleString();hud.words.textContent='ชุด '+(bossesDefeated+1)+' · '+setWordsDone;hud.stopped.textContent=threatsStopped.toLocaleString();
    hud.shield.innerHTML=Array.from({length:MAX_SHIELD},(_v,i)=>'<i class="'+(i<shield?'on':'')+'">❤</i>').join('');hud.shield.setAttribute('aria-label','พลังมังกรเหลือ '+shield+' จาก '+MAX_SHIELD+' ดวง');hud.wave.textContent=bossMode&&boss?'BOSS '+boss.hp+'/'+boss.maxHp:'คลื่น '+wave;root.classList.toggle('boss',bossMode);
    hud.powerName.textContent=activePower?activePower.icon+' '+activePower.name:'กระสุน '+currentAmmo.name;hud.powerFill.style.width=activePower?(powerLeft/powerTotal*100)+'%':'0%';hud.missile.textContent='🚀 '+missiles;hud.missile.disabled=missiles<=0;hud.sound.textContent=typeof state==='undefined'||state.sound?'🔊':'🔇';lcMusicSyncButton();
  }
  function layout(){if(!canvas)return;const r=canvas.getBoundingClientRect();dpr=Math.min(DPR_CAP,window.devicePixelRatio||1);W=Math.max(280,r.width);H=Math.max(480,r.height);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);skyGradient=ctx.createLinearGradient(0,0,0,H);skyGradient.addColorStop(0,'#315b68');skyGradient.addColorStop(.46,'#24505b');skyGradient.addColorStop(1,'#102f45');if(playerX){const p=playerLimits();playerX=clamp(playerX,p.minX,p.maxX);playerY=clamp(playerY||H*.76,p.minY,p.maxY);}initSky();}
  function initSky(){stars=Array.from({length:8},(_,i)=>({x:.1+((i*37)%80)/100,y:i*.15,s:.45+(i%3)*.15,p:i*1.7}));clouds=Array.from({length:9},(_,i)=>({x:.08+((i*29)%84)/100,y:i*.14,s:.5+(i%4)*.2,v:34+(i%3)*17,h:i%2}));}
  function drawDistantPlane(x,y,s,a){
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;ctx.fillStyle='#a8d9cf';ctx.beginPath();ctx.moveTo(0,-13*s);ctx.lineTo(5*s,-1*s);ctx.lineTo(19*s,6*s);ctx.lineTo(17*s,11*s);ctx.lineTo(4*s,7*s);ctx.lineTo(3*s,16*s);ctx.lineTo(-3*s,16*s);ctx.lineTo(-4*s,7*s);ctx.lineTo(-17*s,11*s);ctx.lineTo(-19*s,6*s);ctx.lineTo(-5*s,-1*s);ctx.closePath();ctx.fill();ctx.restore();
  }
  function drawIsland(x,y,s){
    ctx.save();ctx.translate(x,y);ctx.rotate(.18*Math.sin(x));ctx.globalAlpha=.52;ctx.fillStyle='#173f39';ctx.beginPath();ctx.ellipse(0,0,72*s,25*s,0,0,7);ctx.fill();ctx.fillStyle='#47663c';ctx.beginPath();ctx.ellipse(-7*s,-3*s,58*s,18*s,0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(229,207,138,.45)';ctx.lineWidth=Math.max(1,3*s);ctx.beginPath();ctx.moveTo(-50*s,6*s);ctx.bezierCurveTo(-15*s,-18*s,18*s,18*s,48*s,-7*s);ctx.stroke();ctx.restore();
  }
  function drawBackgroundPanel(img,phase,alpha){
    if(!img||alpha<=0)return;const iw=img.naturalWidth||941,ih=img.naturalHeight||1672,scale=Math.max(W/iw,H/ih)*1.28,dw=iw*scale,dh=ih*scale,maxY=Math.max(0,dh-H),x=(W-dw)/2,y=-maxY*(1-phase);
    ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(img,x,y,dw,dh);ctx.restore();
  }
  function drawBackground(t){
    if(backgroundImages[0]){
      const scene=Math.floor(t/LC_BACKGROUND_SCENE_S),phase=(t%LC_BACKGROUND_SCENE_S)/LC_BACKGROUND_SCENE_S,index=scene%LC_BACKGROUND_URLS.length,current=backgroundImages[index]||backgroundImages[0],next=backgroundImages[(index+1)%LC_BACKGROUND_URLS.length]||current,fadeStart=1-LC_BACKGROUND_FADE_S/LC_BACKGROUND_SCENE_S;
      let blend=next!==current&&phase>fadeStart?(phase-fadeStart)/(1-fadeStart):0;blend=blend*blend*(3-2*blend);
      drawBackgroundPanel(current,phase,1-blend);drawBackgroundPanel(next,0,blend);ctx.fillStyle='rgba(3,20,37,.18)';ctx.fillRect(0,0,W,H);return;
    }
    const scroll=(t*78)%(H+160);ctx.fillStyle=skyGradient||'#24505b';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(191,235,227,.09)';ctx.lineWidth=1;for(let i=0;i<15;i++){const y=(i*72+scroll)%(H+72)-36;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y+18);ctx.stroke();}
    for(let i=0;i<7;i++){const y=(i*173+scroll*1.12)%(H+220)-110,x=W*(.18+((i*43)%67)/100);drawIsland(x,y,.48+(i%3)*.17);}
    stars.forEach((p,i)=>{const y=(p.y*H+scroll*.52)%(H+120)-60,x=p.x*W+Math.sin(t*.65+p.p)*24;drawDistantPlane(x,y,p.s,.18+(i%3)*.06);});
    clouds.forEach(c=>{const y=(c.y*H+t*c.v)%(H+220)-110,x=c.x*W+Math.sin(t*.19+c.y*9)*32;ctx.fillStyle=c.h?'rgba(225,238,224,.11)':'rgba(225,246,248,.16)';ctx.beginPath();ctx.ellipse(x,y,74*c.s,19*c.s,-.15,0,7);ctx.ellipse(x+31*c.s,y-10*c.s,48*c.s,22*c.s,0,0,7);ctx.fill();});
    if(bossMode){ctx.fillStyle='rgba(83,11,72,.16)';ctx.fillRect(0,0,W,H);}
  }
  function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
  function drawLetter(o,t){
    const wob=Math.sin(t*1.5+o.phase)*6,x=o.x+wob,y=o.y,r=o.r;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t+o.phase)*.08+o.spin*.05);if(o.hit>0)ctx.scale(1+o.hit*.45,1-o.hit*.18);
    const glow=o.priority?'#ffe96d':'#5de7ff';ctx.shadowColor=glow;ctx.shadowBlur=o.priority?22:12;const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,o.priority?'#ffe05a':'#5eefff');g.addColorStop(1,o.priority?'#ff7b45':'#7655e9');ctx.fillStyle=g;roundRect(-r,-r,r*2,r*2,r*.38);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(7,24,63,.88)';roundRect(-r*.78,-r*.78,r*1.56,r*1.56,r*.27);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 '+(r*1.15)+'px Kanit,system-ui';ctx.fillText(o.ch,0,r*.08);ctx.restore();
  }
  function drawPower(o,t){const p=o.power,r=o.r;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(t*.65+o.phase);ctx.shadowColor=p.color;ctx.shadowBlur=25;ctx.fillStyle=p.color;ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,rr=i%2?r:r*.7;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.rotate(-t*.9);ctx.shadowBlur=0;ctx.fillStyle='#15204f';ctx.beginPath();ctx.arc(0,0,r*.66,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 '+(r*.7)+'px system-ui';ctx.fillText(p.icon,0,1);ctx.restore();}
  function drawMeteor(o,t){const r=o.r;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(t*o.spin+o.phase);ctx.shadowColor='#ff623f';ctx.shadowBlur=22;ctx.fillStyle=o.hp>1?'#8d3550':'#63364d';ctx.strokeStyle='#ffb05e';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5,rr=r*(i%2?.78:1);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ffd36a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 '+(r*.72)+'px system-ui';ctx.fillText(o.hp>1?'2':'!',0,1);ctx.restore();}
  function drawEnemy(o,t){const r=o.r;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(Math.sin(t*2+o.phase)*.08);if(o.hit>0)ctx.scale(1.12,.9);ctx.shadowColor='#ff4768';ctx.shadowBlur=16;ctx.fillStyle='#8e244a';ctx.beginPath();ctx.moveTo(0,r);ctx.lineTo(-r*.42,r*.08);ctx.lineTo(-r*1.15,-r*.3);ctx.lineTo(-r*.94,-r*.68);ctx.lineTo(-r*.28,-r*.44);ctx.lineTo(0,-r);ctx.lineTo(r*.28,-r*.44);ctx.lineTo(r*.94,-r*.68);ctx.lineTo(r*1.15,-r*.3);ctx.lineTo(r*.42,r*.08);ctx.closePath();ctx.fill();ctx.strokeStyle='#ff9c6b';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ffd35c';ctx.beginPath();ctx.arc(0,-r*.12,r*.18,0,7);ctx.fill();ctx.fillStyle='rgba(15,9,38,.8)';ctx.fillRect(-r,-r-8,r*2,4);ctx.fillStyle='#ff5b73';ctx.fillRect(-r,-r-8,r*2*(o.hp/o.maxHp),4);ctx.restore();}
  function drawBoss(t){if(!boss||!boss.alive)return;const o=boss,r=o.r;ctx.save();ctx.translate(o.x,o.y);if(o.hit>0)ctx.scale(1.05,.94);ctx.shadowColor='#ff3e78';ctx.shadowBlur=30;ctx.fillStyle='#581b68';ctx.beginPath();ctx.moveTo(0,r*.72);ctx.lineTo(-r*.55,r*.28);ctx.lineTo(-r*1.45,r*.05);ctx.lineTo(-r*1.2,-r*.45);ctx.lineTo(-r*.42,-r*.58);ctx.lineTo(0,-r);ctx.lineTo(r*.42,-r*.58);ctx.lineTo(r*1.2,-r*.45);ctx.lineTo(r*1.45,r*.05);ctx.lineTo(r*.55,r*.28);ctx.closePath();ctx.fill();ctx.strokeStyle='#ff6688';ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ffe166';ctx.beginPath();ctx.arc(0,-r*.08,r*.24+Math.sin(t*5)*2,0,7);ctx.fill();ctx.fillStyle='#ff6c48';ctx.fillRect(-r*.82,r*.18,r*.24,r*.48);ctx.fillRect(r*.58,r*.18,r*.24,r*.48);ctx.restore();const bw=Math.min(W*.72,310),bx=(W-bw)/2,by=H*.035;ctx.fillStyle='rgba(11,8,38,.82)';roundRect(bx,by,bw,12,8);ctx.fill();ctx.fillStyle='#ff5578';roundRect(bx+2,by+2,(bw-4)*(o.hp/o.maxHp),8,6);ctx.fill();ctx.fillStyle='#fff1a6';ctx.font='900 12px Kanit';ctx.textAlign='center';ctx.fillText('BOSS '+o.hp+'/'+o.maxHp,W*.5,by+27);}
  function drawBase(){
    const y=H*BASE_LINE,g=ctx.createLinearGradient(0,y-12,W,y+12);g.addColorStop(0,'rgba(72,232,255,.08)');g.addColorStop(.5,shield?'rgba(98,246,255,.82)':'rgba(255,76,97,.8)');g.addColorStop(1,'rgba(72,232,255,.08)');
    ctx.save();ctx.strokeStyle=g;ctx.lineWidth=3;ctx.shadowColor=shield?'#43e8ff':'#ff4d65';ctx.shadowBlur=18;ctx.setLineDash([18,10]);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  }
  function drawDragonGunner(t){
    if(!playerImage)return;const size=playerSize(),dw=size*1.46,dh=dw,iw=playerImage.naturalWidth||PLAYER.size,ih=playerImage.naturalHeight||PLAYER.size,top=-dh*.54,bank=clamp(playerVX/900,-.11,.11),speed=Math.min(1,Math.hypot(playerVX,playerVY)/700),sway=Math.sin(t*(5.2+speed*2.2))*(.12+speed*.08);
    ctx.save();ctx.translate(playerX,playerY);ctx.rotate(bank);ctx.shadowColor='#35dfff';ctx.shadowBlur=22;
    ctx.save();ctx.translate(0,top+dh*.5);ctx.rotate(sway);ctx.drawImage(playerImage,iw*.35,ih*.48,iw*.3,ih*.52,-dw*.15,0,dw*.3,dh*.52);ctx.restore();
    ctx.drawImage(playerImage,0,0,iw,ih*.66,-dw*.5,top,dw,dh*.66);ctx.drawImage(playerImage,0,ih*.48,iw*.36,ih*.52,-dw*.5,top+dh*.48,dw*.36,dh*.52);ctx.drawImage(playerImage,iw*.64,ih*.48,iw*.36,ih*.52,dw*.14,top+dh*.48,dw*.36,dh*.52);ctx.restore();
    const g=playerGeometry(playerX,playerY,size,flashSide,flash>0?size*.018:0);
    if(flash>0){const m=g.muzzles[flashSide],f=clamp(flash*9,0,1);ctx.save();ctx.globalAlpha=f;ctx.globalCompositeOperation='lighter';const glow=ctx.createRadialGradient(m.x,m.y,1,m.x,m.y,size*.22);glow.addColorStop(0,'#fff');glow.addColorStop(.22,'#fff38a');glow.addColorStop(.55,'rgba(68,234,255,.8)');glow.addColorStop(1,'rgba(93,71,255,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(m.x,m.y,size*.22,0,7);ctx.fill();ctx.restore();}
  }
  function drawProjectile(b){
    const a=Math.atan2(b.vy,b.vx),ammo=b.ammo||AMMO[0];ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a+Math.PI/2);
    if(b.kind==='enemyShot'){ctx.shadowColor='#ff315f';ctx.shadowBlur=18;ctx.fillStyle='#ff334f';ctx.beginPath();ctx.arc(0,0,b.r||5,0,7);ctx.fill();ctx.fillStyle='#fff0a4';ctx.beginPath();ctx.arc(0,-2,(b.r||5)*.38,0,7);ctx.fill();}
    else if(b.kind==='missile'){ctx.shadowColor='#ffb13c';ctx.shadowBlur=14;ctx.fillStyle='#ff7a25';ctx.beginPath();ctx.moveTo(-5,12);ctx.lineTo(0,24+Math.random()*7);ctx.lineTo(5,12);ctx.fill();ctx.shadowBlur=4;ctx.fillStyle='#d9e5eb';roundRect(-5,-15,10,30,5);ctx.fill();ctx.fillStyle='#ff433c';ctx.beginPath();ctx.moveTo(-5,-10);ctx.lineTo(0,-20);ctx.lineTo(5,-10);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(-11,15);ctx.lineTo(-4,13);ctx.moveTo(5,7);ctx.lineTo(11,15);ctx.lineTo(4,13);ctx.fill();}
    else{const z=ammo.size;ctx.globalAlpha=.72;ctx.strokeStyle=ammo.color;ctx.lineWidth=Math.max(2,z*.55);ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(0,25+z*2);ctx.stroke();ctx.globalAlpha=1;ctx.shadowColor=ammo.color;ctx.shadowBlur=13;ctx.fillStyle=ammo.color;roundRect(-z*.55,-z*2.2,z*1.1,z*3.7,z*.5);ctx.fill();ctx.fillStyle=ammo.core;ctx.beginPath();ctx.moveTo(-z*.52,-z*1.45);ctx.lineTo(0,-z*2.55);ctx.lineTo(z*.52,-z*1.45);ctx.closePath();ctx.fill();ctx.fillStyle='#a46b25';ctx.fillRect(-z*.54,z*1.05,z*1.08,z*.72);}
    ctx.restore();
  }
  function tickBullet(b,dt){
    if(!b.alive)return;b.px=b.x;b.py=b.y;if(b.kind==='enemyShot'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(Math.hypot(b.x-playerX,b.y-playerY)<playerSize()*.31){b.alive=false;impact(b.x,b.y,'#ff4667',14,18);damageBase('ถูกกระสุนศัตรู',b.x);return;}if(b.life<=0||b.x<-25||b.x>W+25||b.y>H+25)b.alive=false;return;}let target=null;if(b.kind==='missile'){if(!b.target||!b.target.alive)b.target=missileTarget();target=b.target;}else if(b.homing)target=letters.find(o=>o.alive&&o.kind==='letter'&&o.ch===nextNeeded());
    if(target){const a=Math.atan2(target.y-b.y,target.x-b.x),s=b.kind==='missile'?b.speed:Math.hypot(b.vx,b.vy),turn=b.kind==='missile'?9:7;b.vx+=(Math.cos(a)*s-b.vx)*Math.min(1,dt*turn);b.vy+=(Math.sin(a)*s-b.vy)*Math.min(1,dt*turn);}b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.life<=0||b.x<-35||b.x>W+35||b.y<-45||b.y>H+45)b.alive=false;if(!b.alive)return;
    b.trailLeft=(b.trailLeft||0)-dt;if(b.trailLeft<=0){b.trailLeft+=b.kind==='missile'?MISSILE_TRAIL_STEP:ROUND_TRAIL_STEP;const trail=b.kind==='missile'?'#ff9b38':(b.ammo||AMMO[0]).color;particle(b.x,b.y,trail,Math.atan2(-b.vy,-b.vx)+(Math.random()-.5)*.6,25+Math.random()*95,.18+Math.random()*.17,b.kind==='missile'?3.5:1.8+Math.random()*2.3);}
    if(boss&&boss.alive&&Math.hypot(b.x-boss.x,b.y-boss.y)<boss.r+(b.kind==='missile'?13:7)){if(b.kind==='missile')explodeMissile(b);else{hitBoss(boss,b.damage);b.alive=false;}return;}
    for(const o of letters){if(!o.alive||Math.hypot(b.x-o.x,b.y-o.y)>=o.r+(b.kind==='missile'?13:7))continue;if(b.kind==='missile'){explodeMissile(b);break;}hit(o,b.side,b.damage);if(b.pierce>0){b.pierce--;b.x+=b.vx*.012;b.y+=b.vy*.012;}else{b.alive=false;break;}}
  }
  function update(dt){
    elapsed+=dt;flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
    const lim=playerLimits(),kbdX=(keyRight?1:0)-(keyLeft?1:0),kbdY=(keyDown?1:0)-(keyUp?1:0),mag=Math.hypot(kbdX,kbdY)||1,maxSpeed=Math.min(MOVE_SPEED_CAP,Math.max(W,H)*MOVE_SPEED_FACTOR),targetVX=dragPointer!==null?clamp((dragX-playerX)*11,-maxSpeed,maxSpeed):kbdX/mag*maxSpeed,targetVY=dragPointer!==null?clamp((dragY-playerY)*11,-maxSpeed,maxSpeed):kbdY/mag*maxSpeed,moving=dragPointer!==null||kbdX||kbdY,response=moving?MOVE_ACCEL:MOVE_BRAKE;playerVX+=(targetVX-playerVX)*Math.min(1,dt*response);playerVY+=(targetVY-playerVY)*Math.min(1,dt*response);if(!moving&&Math.hypot(playerVX,playerVY)<4)playerVX=playerVY=0;playerX=clamp(playerX+playerVX*dt,lim.minX,lim.maxX);playerY=clamp(playerY+playerVY*dt,lim.minY,lim.maxY);
    if(activePower){powerLeft-=dt;if(powerLeft<=0){activePower=null;powerLeft=0;renderHud();}}
    if(elapsed>spawnAt){spawnDistractor();spawnAt=elapsed+clamp(1.05-wordsDone*.018,.58,1.05);}
    if(elapsed>threatAt){spawnMeteor();threatAt=elapsed+(bossMode?1.05:clamp(3.25-wave*.55,1.55,2.7));}
    if(elapsed>enemyAt){spawnEnemy();enemyAt=elapsed+clamp(5.2-wave*.38,2.2,5.2);}
    if(!bossMode&&elapsed>=bossAt)spawnBoss();tickBoss(dt);
    if(elapsed>powerAt){spawnPower();powerAt=elapsed+11+Math.random()*6;}
    ensureNeeded(false);
    fire();
    letters.forEach(o=>{if(!o.alive)return;o.hit=Math.max(0,o.hit-dt);const slow=activePower&&activePower.id==='freeze'?.44:1;o.y+=o.vy*slow*dt;if(o.kind==='power'&&Math.hypot(o.x-playerX,o.y-playerY)<o.r+playerSize()*.34){collectPower(o);return;}if(o.kind==='enemy'){o.x=clamp(o.baseX+Math.sin(elapsed*1.35+o.phase)*W*.12,o.r,W-o.r);if(elapsed>=o.fireAt){fireEnemyShot(o,0);o.fireAt=elapsed+Math.max(1.1,2.2-bossesDefeated*.08);}}if(o.y>H*BASE_LINE+o.r){o.alive=false;burst(o.x,H*BASE_LINE,'#59dfff',5);if(o.kind==='meteor')damageBase('อุกกาบาตชนฐาน',o.x);else if(o.kind==='enemy')damageBase('เครื่องบินศัตรูฝ่าแนวป้องกัน',o.x);else if(o.kind==='letter'&&o.priority)damageBase('พลาดตัว '+o.ch,o.x);}});
    bullets.forEach(b=>tickBullet(b,dt));
    particles.forEach(p=>{if(!p.alive)return;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.life-=dt;if(p.life<=0)p.alive=false;});
    shockwaves.forEach(o=>{if(o.alive&&(o.life-=dt)<=0)o.alive=false;});
  }
  function draw(t){ctx.save();drawBackground(elapsed);if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);drawBase();letters.forEach(o=>{if(o.alive)(o.kind==='power'?drawPower(o,t):o.kind==='meteor'?drawMeteor(o,t):o.kind==='enemy'?drawEnemy(o,t):drawLetter(o,t));});drawBoss(t);ctx.globalCompositeOperation='source-over';bullets.forEach(b=>{if(b.alive)drawProjectile(b);});ctx.globalCompositeOperation='lighter';ctx.shadowBlur=0;particles.forEach(p=>{if(!p.alive)return;ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();});shockwaves.forEach(o=>{if(!o.alive)return;const k=1-o.life/o.max,r=o.start+(o.end-o.start)*k;ctx.globalAlpha=(1-k)*.82;ctx.strokeStyle=o.color;ctx.lineWidth=5*(1-k)+1;ctx.shadowColor=o.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(o.x,o.y,r,0,7);ctx.stroke();});ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.shadowBlur=0;drawDragonGunner(t);ctx.restore();}
  function frame(now){if(!running)return;raf=requestAnimationFrame(frame);if(!frameAt){frameAt=now-FRAME_MS;last=now-FRAME_MS;}const since=now-frameAt;if(paused||counting){const gap=paused?100:33;if(since<gap)return;frameAt=now;last=now;draw(now/1000);return;}if(since<FRAME_MS*.9)return;frameAt=now-(since%FRAME_MS);const dt=Math.min(.033,Math.max(0,(now-last)/1000||.016));last=now;update(dt);draw(now/1000);if(((now/250)|0)!==(((now-dt*1000)/250)|0))renderHud();}
  function bind(){
    abort=new AbortController();const s={signal:abort.signal};
    const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};};
    const drag=e=>{if(e.pointerId!==dragPointer)return;e.preventDefault();const p=point(e),lim=playerLimits();dragX=clamp(p.x,lim.minX,lim.maxX);dragY=clamp(p.y,lim.minY,lim.maxY);};
    const releaseDrag=e=>{if(e.pointerId===dragPointer)dragPointer=null;};
    const resetInput=()=>{dragPointer=null;keyLeft=keyRight=keyUp=keyDown=false;playerVX=playerVY=0;};
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();dragPointer=e.pointerId;const p=point(e);dragX=p.x;dragY=p.y;try{canvas.setPointerCapture(e.pointerId);}catch(_e){}},s);canvas.addEventListener('pointermove',drag,s);canvas.addEventListener('pointerup',releaseDrag,s);canvas.addEventListener('pointercancel',releaseDrag,s);
    window.addEventListener('pointerup',releaseDrag,s);window.addEventListener('pointercancel',releaseDrag,s);window.addEventListener('blur',()=>{resetInput();pause(true);},s);
    window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){e.preventDefault();keyLeft=true;}if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){e.preventDefault();keyRight=true;}if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'){e.preventDefault();keyUp=true;}if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){e.preventDefault();keyDown=true;}if(e.key==='m'||e.key==='M'){e.preventDefault();fireMissile();}if(e.key==='Escape')pause();},s);
    window.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keyLeft=false;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keyRight=false;if(e.key==='ArrowUp'||e.key==='w'||e.key==='W')keyUp=false;if(e.key==='ArrowDown'||e.key==='s'||e.key==='S')keyDown=false;},s);
    window.addEventListener('resize',layout,s);window.addEventListener('orientationchange',layout,s);document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();pause(true);lcMusicStop(0,false);}else if(running)lcMusicStart();},s);
    hud.pause.addEventListener('click',()=>{resetInput();pause();},s);hud.exit.addEventListener('click',close,s);hud.sound.addEventListener('click',toggleSound,s);hud.music.addEventListener('click',lcMusicToggle,s);hud.missile.addEventListener('click',fireMissile,s);
  }
  function toggleSound(){if(typeof state!=='undefined'){state.sound=!state.sound;if(typeof saveState==='function')saveState();if(typeof Music!=='undefined'&&Music.onSound)Music.onSound();}renderHud();sound('correct');}
  function pause(force){if(!root||counting||missionEnded)return;paused=force===true?true:!paused;dragPointer=null;keyLeft=keyRight=keyUp=keyDown=false;playerVX=playerVY=0;let m=root.querySelector('#lc-pause');if(paused&&!m){m=document.createElement('div');m.id='lc-pause';m.className='lc-modal';m.innerHTML='<div class="lc-card"><h2>⏸ พักภารกิจ</h2><p>คลื่นศัตรูและพลังมังกรหยุดรออยู่ตรงนี้ครับ</p><div class="lc-buttons"><button class="lc-btn primary" data-a="go">▶ เล่นต่อ</button><button class="lc-btn" data-a="exit">🚪 กลับ Lobby</button></div></div>';root.appendChild(m);m.querySelector('[data-a=go]').onclick=()=>pause();m.querySelector('[data-a=exit]').onclick=close;}else if(!paused&&m){m.remove();resetFrameClock();}}
  function tutorial(){
    if(localStorage.getItem('vwDragonSkyIntro2')==='1'){countdown();return;}const m=document.createElement('div');m.className='lc-modal';m.innerHTML='<div class="lc-card"><h2>🐉 Dragon Sky Siege</h2><p><b>ลากนิ้วบนสนามเพื่อบินอิสระ</b> · ปืนยิงอัตโนมัติและสลับกระสุนให้เอง</p><p>บินเก็บ <b>🔥 DRAGON BARRAGE</b> เพื่อยิงกระสุน 5 สาย และ <b>🚀 MISSILE RAIN</b> เพื่อเติมจรวดแล้วยิงเป็นชุด</p><p>เครื่องบินศัตรูจะยิงสวนกลับ · ทุก 30 วินาทีบอสจะออกมา<br>กด <b>M</b> หรือ 🚀 เพื่อปล่อย Missile ล็อกเป้า</p><div class="lc-buttons"><button class="lc-btn primary" data-a="start">🚀 ทะยานขึ้นฟ้า</button><button class="lc-btn" data-a="exit">🚪 ออกจากเกม</button></div></div>';root.appendChild(m);m.querySelector('[data-a=start]').onclick=()=>{localStorage.setItem('vwDragonSkyIntro2','1');m.remove();countdown();};m.querySelector('[data-a=exit]').onclick=close;
  }
  function countdown(){counting=true;const m=document.createElement('div');m.className='lc-modal lc-countdown';root.appendChild(m);let n=3;const step=()=>{if(!running||!m.isConnected)return;m.innerHTML='<div class="lc-count">'+(n?n:'GO!')+'</div><button class="lc-btn lc-count-exit">🚪 ออกจากเกม</button>';m.querySelector('button').onclick=close;sound('correct');if(n--){later(step,650);}else later(()=>{m.remove();counting=false;resetFrameClock();},520);};step();}
  function buildDom(){
    root=document.createElement('div');root.id='lc-game';root.innerHTML='<canvas class="lc-game-canvas" aria-label="สนาม Dragon Sky Siege — ลากนิ้วเพื่อบิน หลบกระสุนศัตรู และจัดแนวยิงอัตโนมัติให้ตรงเป้าหมาย"></canvas><div class="lc-hud"><div class="lc-info-dock"><div class="lc-wordbox lc-glass"><div class="lc-target" id="lc-target"></div><div class="lc-meaning" id="lc-meaning"></div><div class="lc-progress" id="lc-progress"></div></div><div class="lc-stats lc-glass"><div class="lc-stat lc-coin-stat"><span>เหรียญ</span><b id="lc-coins">0</b></div><div class="lc-stat"><span>สตรีค</span><b id="lc-combo">0</b></div><div class="lc-stat lc-shield-stat"><span>พลังมังกร</span><b id="lc-shield" aria-label="พลังมังกร 10 ดวง"></b></div><div class="lc-stat"><span>คำศัพท์</span><b id="lc-words">ชุด 1 · 0</b></div><div class="lc-stat"><span>สถานะ</span><b id="lc-wave">คลื่น 1</b></div><div class="lc-stat"><span>ทำลาย</span><b id="lc-stopped">0</b></div></div></div><button class="lc-musicbtn" id="lc-music" type="button" aria-pressed="true" title="Beyond the Stars — เปิด/ปิดเพลง Letter Cannon">🎵 เพลง เปิด</button><div class="lc-actions"><button class="lc-iconbtn" id="lc-sound" title="เปิด/ปิดเสียงเอฟเฟกต์">🔊</button><button class="lc-iconbtn lc-missilebtn" id="lc-missile" title="ยิง Missile (M)">🚀 3</button><button class="lc-iconbtn" id="lc-pause-btn" title="พัก">⏸</button><button class="lc-iconbtn lc-exitwide" id="lc-exit" title="ออกจากเกมกลับ Lobby">🚪 ออก</button></div><div class="lc-power lc-glass"><div class="lc-power-name" id="lc-power-name">กระสุน TRACER</div><div class="lc-power-bar"><div class="lc-power-fill" id="lc-power-fill"></div></div></div><div class="lc-hint lc-glass"><b>AUTO FIRE</b> · เก็บ 🔥/🚀 เพื่อยิงเพิ่ม · M Missile</div></div>';
    document.body.appendChild(root);canvas=root.querySelector('canvas');ctx=canvas.getContext('2d',{alpha:false});['coins','combo','shield','words','wave','stopped','target','meaning','progress','power-name','power-fill','pause-btn','exit','sound','music','missile'].forEach(k=>hud[k.replace(/-([a-z])/g,(_m,c)=>c.toUpperCase())]=root.querySelector('#lc-'+k));hud.powerName=root.querySelector('#lc-power-name');hud.powerFill=root.querySelector('#lc-power-fill');hud.pause=root.querySelector('#lc-pause-btn');lcBgmBtn=hud.music;lcMusicSyncButton();const coinStat=hud.coins.parentElement;coinStat.insertAdjacentHTML('beforeend','<img src="'+COIN_IMAGE+'" alt="เหรียญทอง">');
    const statsPanel=root.querySelector('.lc-stats'),syncStatsHeight=()=>{if(root&&statsPanel&&statsPanel.isConnected)root.style.setProperty('--lc-stats-height',Math.ceil(statsPanel.getBoundingClientRect().height)+'px');};requestAnimationFrame(syncStatsHeight);if(typeof ResizeObserver==='function'){dockObserver=new ResizeObserver(syncStatsHeight);dockObserver.observe(statsPanel);}
  }
  async function lockPortrait(){
    if(!screen.orientation||!screen.orientation.lock)return false;
    for(const mode of ['portrait-primary','portrait']){try{await screen.orientation.lock(mode);orientationLocked=true;return true;}catch(_e){}}
    return false;
  }
  async function requestPortrait(){
    if(!document.fullscreenElement&&document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen({navigationUI:'hide'});gameFullscreen=true;}catch(_e){}}
    await lockPortrait();
  }
  function releasePortrait(){try{if(orientationLocked&&screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(_e){}orientationLocked=false;if(gameFullscreen&&document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});gameFullscreen=false;}
  function startGame(){if(!opening||running)return;opening=false;buildDom();layout();playerX=W*.5;playerY=H*.76;playerVX=playerVY=0;bind();running=true;resetMission();if(typeof Music!=='undefined'&&Music.suspendBg)Music.suspendBg();lcMusicStart();later(()=>loadBackgroundAsset(1),1800);later(()=>loadBackgroundAsset(2),5200);resetFrameClock();raf=requestAnimationFrame(frame);tutorial();}
  function open(){if(running||opening)return;opening=true;lcMusicEnabled=true;lcBgmBlocked=false;if(typeof Music!=='undefined'&&Music.suspendBg)Music.suspendBg();lcMusicStart();requestPortrait();Promise.all([loadPlayerAssets(),loadBackgroundAsset(0)]).then(startGame).catch(err=>{opening=false;lcMusicStop(0,true,()=>{if(typeof Music!=='undefined'&&Music.resumeBg)Music.resumeBg();});console.error(err);releasePortrait();if(typeof toast==='function')toast('⚠️ โหลดภาพมังกรนักบินไม่สำเร็จ กรุณารีเฟรชแล้วลองใหม่');});}
  function close(){opening=false;if(running)settleScoreRun();running=false;lcMusicStop(LC_BGM_EXIT_FADE_MS,true,()=>{if(!running&&typeof Music!=='undefined'&&Music.resumeBg)Music.resumeBg();});frameAt=0;dragPointer=null;keyLeft=keyRight=keyUp=keyDown=false;playerVX=playerVY=0;flushCloudSave();clearTimers();cancelAnimationFrame(raf);if(abort)abort.abort();abort=null;if(dockObserver)dockObserver.disconnect();dockObserver=null;letters.length=bullets.length=particles.length=shockwaves.length=0;try{if(audio&&audio.state==='running')audio.suspend();}catch(e){}if(root)root.remove();root=canvas=ctx=null;lcBgmBtn=null;releasePortrait();if(typeof renderDashboard==='function')renderDashboard();}
  function announcementSeen(){try{return !!(typeof state!=='undefined'&&state.letterCannonAnnouncementSeen)||localStorage.getItem(ANNOUNCEMENT_KEY)==='1';}catch(e){return false;}}
  function rememberAnnouncement(){try{localStorage.setItem(ANNOUNCEMENT_KEY,'1');}catch(e){}if(typeof state!=='undefined'){state.letterCannonAnnouncementSeen=true;if(typeof saveState==='function')saveState();if(typeof authPushSave==='function')authPushSave(false);}}
  function guideToMenu(){if(typeof closePanel==='function')closePanel();const b=document.getElementById('btn-rail-lettercannon');if(!b)return;setTimeout(()=>{b.scrollIntoView({behavior:'smooth',block:'center'});b.classList.add('lc-menu-highlight');try{b.focus({preventScroll:true});}catch(e){b.focus();}setTimeout(()=>b.classList.remove('lc-menu-highlight'),5200);},120);}
  function maybeShowAnnouncement(){
    if(announcementSeen()||document.getElementById('lc-announce')||typeof state==='undefined'||!state.student||typeof Auth==='undefined'||!Auth.booted)return false;
    const dashboard=document.getElementById('screen-dashboard');if(dashboard&&!dashboard.classList.contains('active'))return false;
    const m=document.createElement('div');m.id='lc-announce';m.className='lc-announce';m.innerHTML='<div class="lc-announce-card" role="dialog" aria-modal="true" aria-labelledby="lc-announce-title"><button class="lc-announce-close" aria-label="ปิดประกาศ">×</button><div class="lc-announce-icon">🐉👾</div><h2 id="lc-announce-title">Dragon Sky Siege</h2><p>ศัตรูยิงสวนกลับและบอสออกทุก 30 วินาที ทำลายบอสแล้ววนสู่คลื่นที่ยากขึ้นพร้อมคำศัพท์ชุดใหม่<br>คลังคำศัพท์ตรงระดับชั้น <b>500 คำ</b> · ยิงถูก <b>+1</b> และครบคำ <b>+50 เหรียญ</b></p><div class="lc-buttons"><button class="lc-btn primary" data-a="interest">ไปขึ้นบิน</button><button class="lc-btn" data-a="close">ปิด</button></div></div>';document.body.appendChild(m);
    const done=guide=>{rememberAnnouncement();m.remove();if(guide)guideToMenu();};m.querySelector('[data-a=interest]').onclick=()=>done(true);m.querySelector('[data-a=close]').onclick=()=>done(false);m.querySelector('.lc-announce-close').onclick=()=>done(false);return true;
  }
  function watchAnnouncement(){if(maybeShowAnnouncement()||typeof MutationObserver==='undefined')return;const ob=new MutationObserver(()=>{if(maybeShowAnnouncement())ob.disconnect();});ob.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});}
  function bindRail(){const b=document.getElementById('btn-rail-lettercannon');if(b)b.addEventListener('click',()=>{if(typeof closePanel==='function')closePanel();open();});watchAnnouncement();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindRail);else bindRail();
  window.LetterCannon={open,close,maybeShowAnnouncement,guideToMenu,_t:{wordPool,nextWord,ensureNeeded,spawnLetter,spawnPower,collectPower,spawnMeteor,spawnEnemy,fireEnemyShot,hitEnemy,spawnBoss,hitBoss,completeBossCycle,bullet,fire,spawnMissile,fireMissile,refillMissile,explodeMissile,tickBullet,hit,activate,damageBase,resetMission,settleScoreRun,awardLetterCoin,awardWordBonus,playerGeometry,playerSize,playerLimits,turretGeometry,turretSize,cannonLimits,get word(){return word;},get pos(){return pos;},get score(){return score;},get combo(){return combo;},get wordsDone(){return wordsDone;},get setWordsDone(){return setWordsDone;},get coinsRun(){return coinsRun;},get shield(){return shield;},get wave(){return wave;},get boss(){return boss;},get bossesDefeated(){return bossesDefeated;},get bossMode(){return bossMode;},get threatsStopped(){return threatsStopped;},get misses(){return misses;},get missiles(){return missiles;},get currentAmmo(){return currentAmmo;},get running(){return running;},get paused(){return paused;},get playerX(){return playerX;},get playerY(){return playerY;},get playerVX(){return playerVX;},get playerVY(){return playerVY;},get letters(){return letters;},get bullets(){return bullets;},get particles(){return particles;},get shockwaves(){return shockwaves;},get activePower(){return activePower;},setPlayer(x,y){const p=playerLimits();playerX=clamp(x,p.minX,p.maxX);playerY=clamp(y,p.minY,p.maxY);playerVX=playerVY=0;},setPlayerX(x){playerX=clamp(x,cannonLimits().min,cannonLimits().max);playerVX=0;},setMove(left,right,up,down){keyLeft=!!left;keyRight=!!right;keyUp=!!up;keyDown=!!down;},setViewport(w,h){W=w;H=h;if(!playerX)playerX=W*.5;if(!playerY)playerY=H*.76;},setRunning(value){running=!!value;},step(dt){update(dt||.016);},PLAYER,AMMO,MAX_MISSILES,MAX_MISSILE_STOCK,MISSILE_PICKUP_BONUS,MISSILE_SALVO,MISSILE_BLAST,SHOT_ANGLE,POWER,MAX_LETTERS,MAX_BULLETS,MAX_PARTICLES,WORD_BONUS,MISSION_WORDS,BOSS_INTERVAL,MAX_ENEMIES,MAX_SHIELD,BASE_LINE,MOVE_SPEED_CAP,MOVE_SPEED_FACTOR,MOVE_ACCEL,MOVE_BRAKE,FRAME_MS,DPR_CAP,MUZZLE_PARTICLES,ROUND_TRAIL_STEP,MISSILE_TRAIL_STEP,COIN_IMAGE}};
  Object.assign(window.LetterCannon._t,{lcMusicStart,lcMusicStop,lcMusicToggle,getMusicState:()=>({url:LC_BGM_URL,preload:lcBgm?lcBgm.preload:null,loop:lcBgm?lcBgm.loop:null,paused:lcBgm?lcBgm.paused:true,volume:lcBgm?lcBgm.volume:0,enabled:lcMusicPreferenceOn(),blocked:lcBgmBlocked}),LC_BGM_VOLUME,LC_BGM_EXIT_FADE_MS});
})();
