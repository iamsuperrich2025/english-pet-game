"use strict";
/* ============================================================
   🔤💥 Letter Cannon — ป้อมพิทักษ์คำศัพท์ (รอบ 1134)
   Endless vocabulary spelling: shoot the next letter in order.
   No penalty, no health loss, no game over. Two-layer image turret.
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
    {id:'double',name:'DOUBLE SCORE',icon:'×2',color:'#7dff9b',time:10}
  ];
  const MAX_LETTERS=11, MAX_BULLETS=38, MAX_PARTICLES=120, ROOM_MAX=7;
  const DOUBLE_TAP_MS=380, TAP_HOLD_MS=420, TAP_MOVE_PX=24;
  const FALLBACK=[['CAT','แมว'],['DOG','สุนัข'],['BOOK','หนังสือ'],['APPLE','แอปเปิล'],['WATER','น้ำ']];
  const TURRET={
    size:1254,pivot:{x:627,y:950},mount:{x:627,y:515},
    baseClip:{x:24,y:440,w:1200,h:600},
    muzzles:[{x:384,y:305},{x:870,y:305}],
    baseUrl:'assets/images/letter_cannon/letter_cannon_base.png',
    headUrl:'assets/images/letter_cannon/letter_cannon_gun_head.png'
  };
  const AIM_MIN=-Math.PI+.003,AIM_MAX=-.003;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const pick=a=>a[(Math.random()*a.length)|0];
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  let root=null,canvas=null,ctx=null,raf=0,abort=null,audio=null,opening=false;
  let W=0,H=0,dpr=1,last=0,elapsed=0,running=false,paused=false,counting=false;
  let word=null,pos=0,queue=[],queueGrade='',score=0,combo=0,wordsDone=0,coinsRun=0;
  let aim=-Math.PI/2,targetAim=-Math.PI/2,firing=false,fireAt=0,spawnAt=0,powerAt=0;
  let activePower=null,powerLeft=0,powerTotal=0,shake=0,flash=0,flashSide=0,barrelCycle=0,aimPointer=null,lastTapAt=0;
  const tapPointers=new Map();
  let room=null,peers={},lastNetSend=0;
  let letters=[],bullets=[],particles=[],stars=[],clouds=[];
  let hud={},timers=new Set(),turretImages=null,turretLoad=null;
  function adminAllowed(){
    return typeof isAdmin==='function' && isAdmin();
  }
  function lockedNotice(){
    if(typeof sfx!=='undefined'&&sfx.wrong)sfx.wrong();
    if(typeof toast==='function')toast('🔒 Letter Cannon เปิดให้เฉพาะบัญชี Admin ในขณะนี้');
  }
  function refreshLock(){const b=document.getElementById('btn-rail-lettercannon');if(!b)return;const locked=!adminAllowed();b.classList.toggle('tester-locked',locked);b.title=locked?'เปิดให้เฉพาะบัญชี Admin':'Letter Cannon';const lk=b.querySelector('.rail-lock');if(lk)lk.style.display=locked?'':'none';}
  function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
  function clearTimers(){timers.forEach(clearTimeout);timers.clear();}
  function loadTurretAssets(){
    if(turretImages)return Promise.resolve(turretImages);
    if(turretLoad)return turretLoad;
    const load=src=>new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('โหลดภาพป้อมไม่สำเร็จ: '+src));img.src=src;});
    turretLoad=Promise.all([load(TURRET.baseUrl),load(TURRET.headUrl)]).then(([base,head])=>{turretImages={base,head};return turretImages;}).catch(err=>{turretLoad=null;throw err;});
    return turretLoad;
  }

  function grade(){return typeof state!=='undefined'&&state.student&&state.student.grade||'ป.1';}
  function wordPool(){
    const src=typeof vocabForStudent==='function'?vocabForStudent():FALLBACK;
    const seen=new Set(),out=[];
    src.forEach(v=>{const en=String(v&&v[0]||'').toUpperCase().replace(/[^A-Z]/g,'');if(en.length>=3&&en.length<=10&&!seen.has(en)){seen.add(en);out.push({en,th:String(v[1]||'')});}});
    return out.length?out:FALLBACK.map(v=>({en:v[0],th:v[1]}));
  }
  function nextWord(){
    const g=grade();
    if(g!==queueGrade||!queue.length){queue=shuffle(wordPool());queueGrade=g;}
    word=queue.shift();pos=0;ensureNeeded(true);renderHud();
  }
  function nextNeeded(){return word&&word.en[pos]||'';}
  function myUid(){try{return typeof onlineKey==='function'?onlineKey():'local';}catch(e){return'local';}}
  function seatOrder(n){const out=[0];for(let i=1;out.length<n;i++){out.push(-i);if(out.length<n)out.push(i);}return out;}
  function seatIds(){const me=myUid();return [me].concat(Object.keys(peers).filter(uid=>uid!==me).sort());}
  function seatGap(){return Math.min(160,W/(ROOM_MAX+1));}
  function seatX(uid){const ids=seatIds(),at=Math.max(0,ids.indexOf(uid));return W*.5+seatOrder(ids.length)[at]*seatGap();}
  function cannonX(){return seatX(myUid());}
  function turretSize(){const crowded=seatIds().length>1,fit=seatGap()*.88/.94;return clamp(Math.min(H*(crowded?.32:.36),crowded?fit:300),crowded?82:120,300);}
  function turretGeometry(x,angle,size,side,recoil){
    const scale=size/TURRET.size,mountY=H-(1002-TURRET.mount.y)*scale;
    const rotate=(px,py)=>({x:x+px*Math.cos(angle)-py*Math.sin(angle),y:mountY+px*Math.sin(angle)+py*Math.cos(angle)});
    const muzzles=TURRET.muzzles.map(m=>rotate((m.x-TURRET.pivot.x)*scale,(m.y-TURRET.pivot.y)*scale+(recoil||0)));
    return {x,mountY,size,scale,angle,muzzles,muzzle:muzzles[side||0]};
  }
  function neededAlive(){const n=nextNeeded();return letters.some(o=>o.alive&&o.kind==='letter'&&o.ch===n&&o.y<H*.72);}
  function safeX(r){
    for(let n=0;n<18;n++){const x=r+Math.random()*(W-r*2);if(letters.every(o=>!o.alive||Math.abs(o.x-x)>r*1.55||o.y>H*.28))return x;}
    return r+Math.random()*(W-r*2);
  }
  function spawnLetter(ch,priority){
    if(letters.filter(o=>o.alive).length>=MAX_LETTERS)return null;
    const r=clamp(Math.min(W,H)*.041,19,35),level=Math.min(12,wordsDone);
    const o=letters.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,kind:'letter',ch:ch||pick(AZ),x:safeX(r),y:-r-Math.random()*H*.08,r,vy:(H*(.052+level*.0026))*(priority?.86:1)*(activePower&&activePower.id==='freeze'?.46:1),phase:Math.random()*6.28,spin:(Math.random()-.5)*.45,priority:!!priority,hit:0});
    if(!letters.includes(o))letters.push(o);return o;
  }
  function ensureNeeded(force){if(!word)return;if(force||!neededAlive())spawnLetter(nextNeeded(),true);}
  function spawnDistractor(){
    let ch=pick(AZ);const need=nextNeeded();if(Math.random()<.25&&word)ch=pick(word.en.split(''));if(ch===need&&neededAlive())ch=pick(AZ.replace(need,''));spawnLetter(ch,false);
  }
  function spawnPower(){
    if(letters.some(o=>o.alive&&o.kind==='power'))return;
    const p=pick(POWER),r=clamp(Math.min(W,H)*.038,18,32),o=letters.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,kind:'power',power:p,x:safeX(r),y:-r,r,vy:H*.05,phase:Math.random()*6.28,spin:.8,hit:0});if(!letters.includes(o))letters.push(o);
  }
  function bullet(angle,side,muzzleIndex){
    const g=turretGeometry(cannonX(),aim+Math.PI/2,turretSize(),muzzleIndex,0),bx=g.muzzle.x,by=g.muzzle.y,o=bullets.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,x:bx,y:by,px:bx,py:by,vx:Math.cos(angle)*H*1.35,vy:Math.sin(angle)*H*1.35,life:1.2,side:!!side,homing:activePower&&activePower.id==='homing'&&!side});if(!bullets.includes(o)&&bullets.length<MAX_BULLETS)bullets.push(o);
  }
  function fire(){
    if(!running||paused||counting)return;const now=performance.now(),gap=activePower&&activePower.id==='beam'?105:190;if(now-fireAt<gap)return;fireAt=now;
    const side=barrelCycle++%2;flashSide=side;
    if(activePower&&activePower.id==='beam'){beamHit(side);sound('beam');}
    else{bullet(aim,false,side);if(activePower&&activePower.id==='triple'){bullet(aim-.14,true,0);bullet(aim+.14,true,1);}sound('shot');}
    const m=turretGeometry(cannonX(),aim+Math.PI/2,turretSize(),side,0).muzzle;for(let i=0;i<5;i++)particle(m.x,m.y,'#fff19a',aim+(Math.random()-.5)*.35,50+Math.random()*130,.16+Math.random()*.12);
    shake=Math.max(shake,2.1);flash=.085;netSend(true);
  }
  function beamHit(side){
    const m=turretGeometry(cannonX(),aim+Math.PI/2,turretSize(),side,0).muzzle,dx=Math.cos(aim),dy=Math.sin(aim),ox=m.x,oy=m.y;let best=null,bd=Infinity;
    letters.forEach(o=>{if(!o.alive)return;const t=(o.x-ox)*dx+(o.y-oy)*dy;if(t<0)return;const q=Math.abs((o.x-ox)*dy-(o.y-oy)*dx);if(q<o.r*1.5&&t<bd){best=o;bd=t;}});if(best)hit(best,false);
  }
  function hit(o,side){
    if(!o.alive)return;
    if(o.kind==='power'){o.alive=false;activate(o.power);burst(o.x,o.y,o.power.color,22);sound('power');return;}
    if(side){o.alive=false;burst(o.x,o.y,'#8cefff',7);return;}
    if(o.ch===nextNeeded()){correct(o);}else{wrong(o);}
  }
  function correct(o){
    const x=o.x,y=o.y;o.alive=false;pos++;combo++;const mul=activePower&&activePower.id==='double'?2:1;score+=10*mul+Math.min(50,combo*2);burst(x,y,'#ffe96f',18);toast('✅ '+o.ch+(combo>2?'  COMBO '+combo:'') ,'#fff07b');sound('correct');
    if(activePower&&activePower.id==='chain'){const decoy=letters.find(v=>v.alive&&v.kind==='letter'&&v.ch!==nextNeeded());if(decoy){decoy.alive=false;lightning(x,y,decoy.x,decoy.y);burst(decoy.x,decoy.y,'#b98aff',9);}}
    if(pos>=word.en.length)completeWord();else{ensureNeeded(true);renderHud();}
  }
  function wrong(o){
    o.hit=.28;burst(o.x,o.y,'#76dfff',5);toast('🔤 ต้องหา '+nextNeeded()+' — ลองใหม่นะ','#8fe9ff');sound('soft');
  }
  function completeWord(){
    wordsDone++;const reward=word.en.length*(activePower&&activePower.id==='double'?2:1);coinsRun+=reward;score+=100+word.en.length*12;
    if(typeof addCoins==='function')addCoins(reward);if(typeof saveState==='function')saveState();if(typeof speakWord==='function')speakWord(word.en.toLowerCase());
    toast('🌟 '+word.en+' · '+word.th+'  +'+reward+' 🪙','#ffe85c');celebrate();later(()=>{if(running)nextWord();},820);
  }
  function activate(p){
    if(p.id==='nova'){letters.forEach(o=>{if(o.alive&&o.kind==='letter'&&o.ch!==nextNeeded()){o.alive=false;burst(o.x,o.y,p.color,8);}});toast('✺ NOVA — เคลียร์ตัวหลอก!','#fff18c');shake=7;return;}
    activePower=p;powerLeft=powerTotal=p.time;toast(p.icon+' '+p.name,p.color);renderHud();
  }
  function celebrate(){for(let i=0;i<40;i++)particle(W*.5,H*.32,pick(['#fff278','#60eaff','#ff72d2','#9b83ff']),Math.random()*6.28,80+Math.random()*260,1+Math.random());sound('win');}
  function particle(x,y,color,a,s,life){let p=particles.find(v=>!v.alive)||{};Object.assign(p,{alive:true,x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:1.5+Math.random()*3,color,life:life||.65,max:life||.65});if(!particles.includes(p)&&particles.length<MAX_PARTICLES)particles.push(p);}
  function burst(x,y,color,n){for(let i=0;i<n;i++)particle(x,y,color,Math.random()*6.28,40+Math.random()*190,.35+Math.random()*.55);}
  function lightning(x1,y1,x2,y2){for(let i=0;i<12;i++){const k=i/11,px=x1+(x2-x1)*k+(Math.random()-.5)*15,py=y1+(y2-y1)*k+(Math.random()-.5)*15;particle(px,py,'#d7b8ff',0,0,.25);}}
  function toast(text,color){if(!root)return;const e=document.createElement('div');e.className='lc-toast';e.style.color=color||'#fff';e.textContent=text;root.appendChild(e);later(()=>e.remove(),950);}

  function sound(type){
    if(typeof state!=='undefined'&&!state.sound)return;
    try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type=type==='shot'?'sawtooth':type==='soft'?'sine':'triangle';const f=type==='correct'?740:type==='win'?520:type==='power'?980:type==='beam'?1250:type==='soft'?260:155;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(type==='shot'?75:f*1.55,t+.12);g.gain.setValueAtTime(type==='shot'?.08:.06,t);g.gain.exponentialRampToValueAtTime(.001,t+(type==='win'?.42:.16));o.start(t);o.stop(t+.45);}catch(e){}
  }
  function renderHud(){
    if(!root||!word)return;hud.target.textContent=word.en;hud.meaning.textContent=(word.th||'คำศัพท์ระดับ '+grade())+' · '+grade();hud.progress.innerHTML=word.en.split('').map((c,i)=>'<span class="lc-slot '+(i<pos?'done':'')+'">'+(i<pos?c:'•')+'</span>').join('');hud.score.textContent=score.toLocaleString();hud.combo.textContent=combo.toLocaleString();hud.words.textContent=wordsDone.toLocaleString();hud.coins.textContent=coinsRun.toLocaleString();
    hud.powerName.textContent=activePower?activePower.icon+' '+activePower.name:'ปืนพลังอักษร';hud.powerFill.style.width=activePower?(powerLeft/powerTotal*100)+'%':'0%';hud.sound.textContent=typeof state==='undefined'||state.sound?'🔊':'🔇';
  }
  function layout(){if(!canvas)return;const r=canvas.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(320,r.width);H=Math.max(240,r.height);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);initSky();}
  function initSky(){stars=Array.from({length:Math.round(clamp(W*H/9000,35,100))},()=>({x:Math.random()*W,y:Math.random()*H*.74,r:.5+Math.random()*1.8,p:Math.random()*6.28}));clouds=Array.from({length:7},(_,i)=>({x:Math.random()*W,y:H*(.12+Math.random()*.45),s:.5+Math.random()*1.2,v:3+Math.random()*8,h:i%2}));}
  function drawBackground(t){
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#07163b');g.addColorStop(.43,'#183977');g.addColorStop(.72,'#52266f');g.addColorStop(1,'#081f3d');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    stars.forEach(s=>{ctx.globalAlpha=.35+.55*(.5+.5*Math.sin(t*1.8+s.p));ctx.fillStyle='#d9f8ff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});ctx.globalAlpha=1;
    const moon=ctx.createRadialGradient(W*.5,H*.27,2,W*.5,H*.27,H*.3);moon.addColorStop(0,'rgba(93,239,255,.32)');moon.addColorStop(.35,'rgba(127,82,255,.12)');moon.addColorStop(1,'rgba(20,8,64,0)');ctx.fillStyle=moon;ctx.fillRect(0,0,W,H*.72);
    clouds.forEach(c=>{c.x+=c.v/60;if(c.x>W+120)c.x=-140;ctx.fillStyle=c.h?'rgba(93,42,134,.18)':'rgba(76,186,222,.13)';ctx.beginPath();ctx.ellipse(c.x,c.y,90*c.s,17*c.s,0,0,7);ctx.ellipse(c.x+44*c.s,c.y-8*c.s,55*c.s,22*c.s,0,0,7);ctx.fill();});
    ctx.fillStyle='#081c3c';ctx.beginPath();ctx.moveTo(0,H*.72);for(let x=0;x<=W;x+=W/9)ctx.lineTo(x,H*(.58+.1*Math.sin(x*.015+1.2)));ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
    ctx.strokeStyle='rgba(89,225,255,.2)';ctx.lineWidth=1;for(let i=0;i<9;i++){const y=H*(.72+i*.045);ctx.beginPath();ctx.moveTo(0,y);ctx.quadraticCurveTo(W*.5,y+22,W,y);ctx.stroke();}
  }
  function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
  function drawLetter(o,t){
    const wob=Math.sin(t*1.5+o.phase)*6,x=o.x+wob,y=o.y,r=o.r;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t+o.phase)*.08+o.spin*.05);if(o.hit>0)ctx.scale(1+o.hit*.45,1-o.hit*.18);
    const glow=o.priority?'#ffe96d':'#5de7ff';ctx.shadowColor=glow;ctx.shadowBlur=o.priority?22:12;const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,o.priority?'#ffe05a':'#5eefff');g.addColorStop(1,o.priority?'#ff7b45':'#7655e9');ctx.fillStyle=g;roundRect(-r,-r,r*2,r*2,r*.38);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(7,24,63,.88)';roundRect(-r*.78,-r*.78,r*1.56,r*1.56,r*.27);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 '+(r*1.15)+'px Kanit,system-ui';ctx.fillText(o.ch,0,r*.08);ctx.restore();
  }
  function drawPower(o,t){const p=o.power,r=o.r;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(t*.65+o.phase);ctx.shadowColor=p.color;ctx.shadowBlur=25;ctx.fillStyle=p.color;ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,rr=i%2?r:r*.7;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.rotate(-t*.9);ctx.shadowBlur=0;ctx.fillStyle='#15204f';ctx.beginPath();ctx.arc(0,0,r*.66,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 '+(r*.7)+'px system-ui';ctx.fillText(p.icon,0,1);ctx.restore();}
  function drawTurret(x,shotAngle,size,hot,opacity,showFlash){
    if(!turretImages)return;const angle=shotAngle+Math.PI/2,recoil=hot?size*.018:0,g=turretGeometry(x,angle,size,showFlash?flashSide:0,recoil),s=g.scale,c=TURRET.baseClip;
    ctx.save();ctx.globalAlpha=opacity==null?1:opacity;ctx.shadowColor=showFlash?'#54e8ff':'#ff8ee8';ctx.shadowBlur=showFlash?20:12;
    ctx.drawImage(turretImages.base,c.x,c.y,c.w,c.h,x-(TURRET.mount.x-c.x)*s,g.mountY-(TURRET.mount.y-c.y)*s,c.w*s,c.h*s);
    ctx.translate(x,g.mountY);ctx.rotate(angle);ctx.translate(0,recoil);ctx.drawImage(turretImages.head,-TURRET.pivot.x*s,-TURRET.pivot.y*s,TURRET.size*s,TURRET.size*s);ctx.restore();
    if(showFlash&&flash>0){const m=g.muzzles[flashSide];ctx.save();ctx.globalAlpha=clamp(flash*11,0,1);ctx.shadowColor='#fff08c';ctx.shadowBlur=22;ctx.fillStyle='#fff4a2';ctx.beginPath();ctx.arc(m.x,m.y,size*(.025+flash*.18),0,7);ctx.fill();ctx.restore();}
  }
  function drawCannon(){
    const heat=(performance.now()-fireAt<150)?1:0;drawTurret(cannonX(),aim,turretSize(),heat,1,true);
  }
  function drawPeerCannon(uid,p){const x=seatX(uid),a=typeof p.yaw==='number'?clamp(p.yaw,AIM_MIN,AIM_MAX):-Math.PI/2,hot=!!p.m;drawTurret(x,a,turretSize(),hot,.78,false);ctx.save();ctx.fillStyle='rgba(8,20,58,.78)';ctx.textAlign='center';ctx.font='700 '+clamp(H*.018,9,13)+'px Kanit';ctx.fillText(String(p.n||'ผู้เล่น').slice(0,14),x,H*.975);ctx.restore();}
  function drawAim(){const g=turretGeometry(cannonX(),aim+Math.PI/2,turretSize(),0,0),x=g.x+Math.cos(aim)*H*.33,y=g.mountY+Math.sin(aim)*H*.33;ctx.strokeStyle='rgba(135,244,255,.65)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.moveTo(x-19,y);ctx.lineTo(x-6,y);ctx.moveTo(x+6,y);ctx.lineTo(x+19,y);ctx.moveTo(x,y-19);ctx.lineTo(x,y-6);ctx.stroke();}
  function update(dt){
    elapsed+=dt;aim+=((targetAim-aim+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*13);aim=clamp(aim,AIM_MIN,AIM_MAX);flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
    if(activePower){powerLeft-=dt;if(powerLeft<=0){activePower=null;powerLeft=0;renderHud();}}
    if(elapsed>spawnAt){spawnDistractor();spawnAt=elapsed+clamp(1.05-wordsDone*.018,.58,1.05);}
    if(elapsed>powerAt){spawnPower();powerAt=elapsed+14+Math.random()*8;}
    ensureNeeded(false);
    if(firing)fire();
    letters.forEach(o=>{if(!o.alive)return;o.hit=Math.max(0,o.hit-dt);const slow=activePower&&activePower.id==='freeze'?.44:1;o.y+=o.vy*slow*dt;if(o.y>H*.83+o.r){o.alive=false;burst(o.x,H*.8,'#59dfff',5);}});
    bullets.forEach(b=>{if(!b.alive)return;b.px=b.x;b.py=b.y;if(b.homing){const n=letters.find(o=>o.alive&&o.kind==='letter'&&o.ch===nextNeeded());if(n){const a=Math.atan2(n.y-b.y,n.x-b.x),s=Math.hypot(b.vx,b.vy);b.vx+=(Math.cos(a)*s-b.vx)*dt*7;b.vy+=(Math.sin(a)*s-b.vy)*dt*7;}}b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.life<=0||b.x<0||b.x>W||b.y<0)b.alive=false;if(!b.alive)return;for(const o of letters){if(o.alive&&Math.hypot(b.x-o.x,b.y-o.y)<o.r+5){b.alive=false;hit(o,b.side);break;}}});
    particles.forEach(p=>{if(!p.alive)return;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.life-=dt;if(p.life<=0)p.alive=false;});
    if(room){room.tick(performance.now());netSend(false);}
  }
  function draw(t){ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);drawBackground(t);letters.forEach(o=>{if(o.alive)(o.kind==='power'?drawPower(o,t):drawLetter(o,t));});bullets.forEach(b=>{if(!b.alive)return;ctx.strokeStyle=b.side?'rgba(255,182,87,.65)':'#d8ffff';ctx.lineWidth=b.side?2:4;ctx.shadowColor='#5befff';ctx.shadowBlur=13;ctx.beginPath();ctx.moveTo(b.px,b.py);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.shadowBlur=0;});particles.forEach(p=>{if(!p.alive)return;ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();});ctx.globalAlpha=1;Object.keys(peers).forEach(uid=>drawPeerCannon(uid,peers[uid]));drawCannon();drawAim();ctx.restore();}
  function frame(now){if(!running)return;raf=requestAnimationFrame(frame);if(paused||counting){last=now;draw(now/1000);return;}const dt=Math.min(.033,Math.max(0,(now-last)/1000||.016));last=now;update(dt);draw(now/1000);if(((now/250)|0)!==(((now-dt*1000)/250)|0))renderHud();}
  function aimAt(x,y){const g=turretGeometry(cannonX(),aim+Math.PI/2,turretSize(),0,0),dx=x-g.x,dy=y-g.mountY;if(dy>=-1){if(Math.abs(dx)<10)return;targetAim=dx<0?AIM_MIN:AIM_MAX;return;}targetAim=clamp(Math.atan2(dy,dx),AIM_MIN,AIM_MAX);}
  function registerTap(now){const second=lastTapAt>0&&now-lastTapAt>0&&now-lastTapAt<=DOUBLE_TAP_MS;lastTapAt=second?0:now;return second;}
  function resetTap(){lastTapAt=0;tapPointers.clear();}

  function netReady(){return typeof Online!=='undefined'&&Online.ready&&Online.db&&typeof Auth!=='undefined'&&Auth.user&&typeof onlineKey==='function'&&typeof firebase!=='undefined'&&typeof NetRoom!=='undefined';}
  function netJoin(){if(!netReady()){updateRoomHud();return;}room=NetRoom.create({map:'lettercannon',sendMs:180,roomMax:ROOM_MAX,roomNoun:'ห้อง',roomIcon:'🔤',push(){lastNetSend=0;netSend(true);},onPeer(uid,d){peers[uid]=Object.assign(peers[uid]||{},d);updateRoomHud();},onPeerGone(uid){delete peers[uid];updateRoomHud();},onStatus:updateRoomHud,toast(html){toast(String(html).replace(/<[^>]+>/g,' '),'#9af3ff');}});room.join();}
  function netSend(force){if(!room||!room.online)return;const now=performance.now();if(!force&&now-lastNetSend<room.sendGap)return;lastNetSend=now;room.send({n:(typeof onlineDisplayName==='function'&&onlineDisplayName())||(typeof state!=='undefined'&&state.playerName)||'ผู้เล่น',x:0,z:0,yaw:Math.round(aim*1000)/1000,m:now-fireAt<170?1:0,w:wordsDone},force);}
  function updateRoomHud(){if(!hud.room)return;if(room&&room.online)hud.room.textContent='🌐 ห้อง '+room.roomLabel+' · '+room.count+'/'+ROOM_MAX+' ป้อม';else if(room)hud.room.textContent='📡 กำลังหาห้องว่าง…';else hud.room.textContent='👤 เล่นคนเดียว (ออฟไลน์)';}

  function bind(){
    abort=new AbortController();const s={signal:abort.signal};
    const release=e=>{
      const tap=e&&tapPointers.get(e.pointerId),now=performance.now();
      if(e&&e.type==='pointerup'&&tap&&!tap.moved&&now-tap.at<=TAP_HOLD_MS){aimAt(e.clientX,e.clientY);if(registerTap(now)){aim=targetAim;fire();}}
      else if(tap)lastTapAt=0;
      if(e)tapPointers.delete(e.pointerId);else resetTap();
      if(!e||aimPointer==null||e.pointerId===aimPointer)aimPointer=null;firing=false;
    };
    canvas.addEventListener('pointermove',e=>{const tap=tapPointers.get(e.pointerId);if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>TAP_MOVE_PX)tap.moved=true;if(e.pointerType==='mouse'||aimPointer===e.pointerId){e.preventDefault();aimAt(e.clientX,e.clientY);}},{...s,passive:false});
    canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();aimPointer=e.pointerId;tapPointers.set(e.pointerId,{x:e.clientX,y:e.clientY,at:performance.now(),moved:false});try{canvas.setPointerCapture(e.pointerId);}catch(_e){}aimAt(e.clientX,e.clientY);},{...s,passive:false});
    window.addEventListener('pointerup',release,s);window.addEventListener('pointercancel',release,s);canvas.addEventListener('touchcancel',release,{...s,passive:true});window.addEventListener('blur',()=>{release();pause(true);},s);
    window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')targetAim=clamp(targetAim-.08,AIM_MIN,AIM_MAX);if(e.key==='ArrowRight')targetAim=clamp(targetAim+.08,AIM_MIN,AIM_MAX);if(e.code==='Space'){e.preventDefault();firing=true;fire();}if(e.key==='Escape')pause();},s);window.addEventListener('keyup',e=>{if(e.code==='Space')release();},s);
    window.addEventListener('resize',layout,s);window.addEventListener('orientationchange',layout,s);document.addEventListener('visibilitychange',()=>{if(document.hidden){release();pause(true);}},s);
    hud.pause.addEventListener('click',()=>{resetTap();pause();},s);hud.exit.addEventListener('click',close,s);hud.sound.addEventListener('click',()=>{resetTap();toggleSound();},s);
  }
  function toggleSound(){if(typeof state!=='undefined'){state.sound=!state.sound;if(typeof saveState==='function')saveState();if(typeof Music!=='undefined'&&Music.onSound)Music.onSound();}renderHud();sound('correct');}
  function pause(force){if(!root||counting)return;paused=force===true?true:!paused;firing=false;let m=root.querySelector('#lc-pause');if(paused&&!m){m=document.createElement('div');m.id='lc-pause';m.className='lc-modal';m.innerHTML='<div class="lc-card"><h2>⏸ พักป้อม</h2><p>คำและตัวอักษรรออยู่ตรงนี้ ไม่มีเวลาจำกัดครับ</p><div class="lc-buttons"><button class="lc-btn primary" data-a="go">▶ เล่นต่อ</button><button class="lc-btn" data-a="exit">🚪 กลับ Lobby</button></div></div>';root.appendChild(m);m.querySelector('[data-a=go]').onclick=()=>pause();m.querySelector('[data-a=exit]').onclick=close;}else if(!paused&&m){m.remove();last=performance.now();}}
  function tutorial(){
    if(localStorage.getItem('vwLetterCannonIntro')==='1'){countdown();return;}const m=document.createElement('div');m.className='lc-modal';m.innerHTML='<div class="lc-card"><h2>🔤💥 Letter Cannon</h2><p><b>ยิงตัวอักษรตามลำดับเพื่อประกอบคำเป้าหมาย</b><br>ตัวอย่าง APPLE: ยิง A → P → P → L → E</p><p>🖱️ เมาส์เล็ง · ดับเบิลคลิกยิง &nbsp;|&nbsp; 📱 ลากเล็ง · แตะหน้าจอสองครั้งยิง<br>แตะฝั่งซ้ายหรือขวาก็ยิงได้ ยิงผิดไม่เสียอะไร และเล่นได้นานเท่าที่ต้องการ</p><div class="lc-buttons"><button class="lc-btn primary" data-a="start">🚀 เริ่มปกป้องคำศัพท์</button><button class="lc-btn" data-a="exit">🚪 ออกจากเกม</button></div></div>';root.appendChild(m);m.querySelector('[data-a=start]').onclick=()=>{localStorage.setItem('vwLetterCannonIntro','1');m.remove();countdown();};m.querySelector('[data-a=exit]').onclick=close;
  }
  function countdown(){counting=true;const m=document.createElement('div');m.className='lc-modal lc-countdown';root.appendChild(m);let n=3;const step=()=>{if(!running||!m.isConnected)return;m.innerHTML='<div class="lc-count">'+(n?n:'GO!')+'</div><button class="lc-btn lc-count-exit">🚪 ออกจากเกม</button>';m.querySelector('button').onclick=close;sound('correct');if(n--){later(step,650);}else later(()=>{m.remove();counting=false;last=performance.now();},520);};step();}
  function buildDom(){
    root=document.createElement('div');root.id='lc-game';root.innerHTML='<canvas class="lc-game-canvas" aria-label="สนาม Letter Cannon — แตะสองครั้งเพื่อยิง"></canvas><div class="lc-hud"><div class="lc-stats lc-glass"><div class="lc-stat"><span>คะแนน</span><b id="lc-score">0</b></div><div class="lc-stat"><span>Combo</span><b id="lc-combo">0</b></div><div class="lc-stat"><span>คำสำเร็จ</span><b id="lc-words">0</b></div><div class="lc-stat"><span>เหรียญรอบนี้</span><b id="lc-coins">0</b></div></div><div class="lc-wordbox lc-glass"><div class="lc-target" id="lc-target"></div><div class="lc-meaning" id="lc-meaning"></div><div class="lc-progress" id="lc-progress"></div></div><div class="lc-actions"><button class="lc-iconbtn" id="lc-sound" title="เปิด/ปิดเสียง">🔊</button><button class="lc-iconbtn" id="lc-pause-btn" title="พัก">⏸</button><button class="lc-iconbtn lc-exitwide" id="lc-exit" title="ออกจากเกมกลับ Lobby">🚪 ออกจากเกม</button></div><div class="lc-room lc-glass" id="lc-room">📡 กำลังเชื่อมต่อ…</div><div class="lc-power lc-glass"><div class="lc-power-name" id="lc-power-name">ปืนพลังอักษร</div><div class="lc-power-bar"><div class="lc-power-fill" id="lc-power-fill"></div></div></div><div class="lc-hint lc-glass"><b>แตะหน้าจอสองครั้งเพื่อยิง</b> · ซ้ายหรือขวาก็ได้ · ผิดไม่เสียอะไร</div></div><div class="lc-rotate">📱↻<br>หมุนโทรศัพท์เป็นแนวนอน<br>เพื่อเล็งป้อมได้เต็มสนาม</div>';
    document.body.appendChild(root);canvas=root.querySelector('canvas');ctx=canvas.getContext('2d',{alpha:false});['score','combo','words','coins','target','meaning','progress','power-name','power-fill','pause-btn','exit','sound','room'].forEach(k=>hud[k.replace('-','')]=root.querySelector('#lc-'+k));hud.powerName=root.querySelector('#lc-power-name');hud.powerFill=root.querySelector('#lc-power-fill');hud.pause=root.querySelector('#lc-pause-btn');
  }
  function startGame(){if(!opening||running)return;opening=false;buildDom();layout();bind();score=combo=wordsDone=coinsRun=pos=0;elapsed=0;spawnAt=.4;powerAt=9;letters=[];bullets=[];particles=[];peers={};activePower=null;barrelCycle=flashSide=0;running=true;paused=false;nextWord();if(typeof Music!=='undefined'&&Music.suspendBg)Music.suspendBg();netJoin();last=performance.now();raf=requestAnimationFrame(frame);tutorial();}
  function open(){if(running||opening)return;if(!adminAllowed()){lockedNotice();return;}opening=true;loadTurretAssets().then(startGame).catch(err=>{opening=false;console.error(err);if(typeof toast==='function')toast('⚠️ โหลดภาพป้อมไม่สำเร็จ กรุณารีเฟรชแล้วลองใหม่');});}
  function close(){opening=false;running=false;firing=false;aimPointer=null;resetTap();clearTimers();cancelAnimationFrame(raf);if(room){room.leave();room=null;}peers={};if(abort)abort.abort();abort=null;letters.length=bullets.length=particles.length=0;try{if(audio&&audio.state==='running')audio.suspend();}catch(e){}if(root)root.remove();root=canvas=ctx=null;if(typeof Music!=='undefined'&&Music.resumeBg)Music.resumeBg();if(typeof renderDashboard==='function')renderDashboard();}
  function bindRail(){const b=document.getElementById('btn-rail-lettercannon');if(b){refreshLock();b.addEventListener('click',()=>{refreshLock();if(!adminAllowed()){lockedNotice();return;}if(typeof closePanel==='function')closePanel();open();});}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindRail);else bindRail();
  window.LetterCannon={open,close,refreshLock,_t:{adminAllowed,wordPool,nextWord,ensureNeeded,spawnLetter,spawnPower,fire,hit,activate,seatOrder,turretGeometry,registerTap,resetTap,get word(){return word;},get pos(){return pos;},get score(){return score;},get combo(){return combo;},get wordsDone(){return wordsDone;},get running(){return running;},get paused(){return paused;},get aim(){return aim;},get letters(){return letters;},get bullets(){return bullets;},get activePower(){return activePower;},setAim(a){targetAim=aim=clamp(a,AIM_MIN,AIM_MAX);},setViewport(w,h){W=w;H=h;},step(dt){update(dt||.016);},TURRET,AIM_MIN,AIM_MAX,POWER,MAX_LETTERS,MAX_BULLETS,ROOM_MAX,DOUBLE_TAP_MS,TAP_HOLD_MS,TAP_MOVE_PX}};
})();
