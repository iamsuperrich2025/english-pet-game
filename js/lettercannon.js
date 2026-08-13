"use strict";
/* ============================================================
   🔤💥 Letter Cannon — ป้อมพิทักษ์คำศัพท์ (รอบ 1149)
   Endless vocabulary spelling: shoot the next letter in order.
   No penalty, no health loss, no game over. Solo auto-fire cannon.
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
  const MAX_LETTERS=11, MAX_BULLETS=42, MAX_PARTICLES=260, SHOT_ANGLE=-Math.PI/2;
  const FALLBACK=[['CAT','แมว'],['DOG','สุนัข'],['BOOK','หนังสือ'],['APPLE','แอปเปิล'],['WATER','น้ำ']];
  const TURRET={
    size:1254,pivot:{x:627,y:950},mount:{x:627,y:515},
    muzzles:[{x:384,y:305},{x:870,y:305}],
    headUrl:'assets/images/letter_cannon/letter_cannon_gun_head.png'
  };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const pick=a=>a[(Math.random()*a.length)|0];
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  let root=null,canvas=null,ctx=null,raf=0,abort=null,audio=null,opening=false;
  let W=0,H=0,dpr=1,last=0,elapsed=0,running=false,paused=false,counting=false;
  let word=null,pos=0,queue=[],queueGrade='',score=0,combo=0,wordsDone=0,coinsRun=0;
  let fireAt=0,spawnAt=0,powerAt=0,playerX=0;
  let activePower=null,powerLeft=0,powerTotal=0,shake=0,flash=0,flashSide=0,barrelCycle=0;
  const movePointers=new Map();let keyLeft=false,keyRight=false;
  let letters=[],bullets=[],particles=[],shockwaves=[],stars=[],clouds=[];
  let hud={},timers=new Set(),turretImage=null,turretLoad=null;
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
    if(turretImage)return Promise.resolve(turretImage);
    if(turretLoad)return turretLoad;
    const load=src=>new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('โหลดภาพป้อมไม่สำเร็จ: '+src));img.src=src;});
    turretLoad=load(TURRET.headUrl).then(head=>{turretImage=head;return turretImage;}).catch(err=>{turretLoad=null;throw err;});
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
  function cannonX(){return playerX||W*.5;}
  function turretSize(){return clamp(Math.min(H*.25,W*.16),88,190);}
  function cannonLimits(){const pad=turretSize()*.3;return{min:pad,max:W-pad};}
  function turretGeometry(x,size,side,recoil){
    const scale=size/TURRET.size,mountY=H-(1002-TURRET.mount.y)*scale;
    const muzzles=TURRET.muzzles.map(m=>({x:x+(m.x-TURRET.pivot.x)*scale,y:mountY+(m.y-TURRET.pivot.y)*scale+(recoil||0)}));
    return {x,mountY,size,scale,muzzles,muzzle:muzzles[side||0]};
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
    const g=turretGeometry(cannonX(),turretSize(),muzzleIndex,0),bx=g.muzzle.x,by=g.muzzle.y,o=bullets.find(x=>!x.alive)||{};
    Object.assign(o,{alive:true,x:bx,y:by,px:bx,py:by,vx:Math.cos(angle)*H*1.7,vy:Math.sin(angle)*H*1.7,life:1.2,side:!!side,homing:activePower&&activePower.id==='homing'&&!side,phase:Math.random()*6.28});if(!bullets.includes(o)&&bullets.length<MAX_BULLETS)bullets.push(o);
  }
  function fire(){
    if(!running||paused||counting)return;const now=performance.now(),gap=activePower&&activePower.id==='beam'?110:245;if(now-fireAt<gap)return;fireAt=now;
    const side=barrelCycle++%2;flashSide=side;
    if(activePower&&activePower.id==='beam'){beamHit(side);sound('beam');}
    else{bullet(SHOT_ANGLE,false,side);if(activePower&&activePower.id==='triple'){bullet(SHOT_ANGLE-.11,true,0);bullet(SHOT_ANGLE+.11,true,1);}sound('shot');}
    const m=turretGeometry(cannonX(),turretSize(),side,0).muzzle;for(let i=0;i<13;i++)particle(m.x,m.y,pick(['#ffffff','#fff19a','#ff9f45','#59efff']),SHOT_ANGLE+(Math.random()-.5)*.72,80+Math.random()*280,.22+Math.random()*.24,2+Math.random()*4);
    shockwave(m.x,m.y,'#9df7ff',5,34,.28);shake=Math.max(shake,4.8);flash=.13;
  }
  function beamHit(side){
    const m=turretGeometry(cannonX(),turretSize(),side,0).muzzle,dx=Math.cos(SHOT_ANGLE),dy=Math.sin(SHOT_ANGLE),ox=m.x,oy=m.y;let best=null,bd=Infinity;
    letters.forEach(o=>{if(!o.alive)return;const t=(o.x-ox)*dx+(o.y-oy)*dy;if(t<0)return;const q=Math.abs((o.x-ox)*dy-(o.y-oy)*dx);if(q<o.r*1.5&&t<bd){best=o;bd=t;}});if(best)hit(best,false);
  }
  function hit(o,side){
    if(!o.alive)return;
    if(o.kind==='power'){o.alive=false;impact(o.x,o.y,o.power.color,34);activate(o.power);sound('power');return;}
    if(side){o.alive=false;impact(o.x,o.y,'#8cefff',18);return;}
    if(o.ch===nextNeeded()){correct(o);}else{wrong(o);}
  }
  function correct(o){
    const x=o.x,y=o.y,r=o.r;o.alive=false;pos++;combo++;const mul=activePower&&activePower.id==='double'?2:1;score+=10*mul+Math.min(50,combo*2);impact(x,y,'#ffe96f',30,r);toast('✅ '+o.ch+(combo>2?'  COMBO '+combo:'') ,'#fff07b');sound('correct');
    if(activePower&&activePower.id==='chain'){const decoy=letters.find(v=>v.alive&&v.kind==='letter'&&v.ch!==nextNeeded());if(decoy){decoy.alive=false;lightning(x,y,decoy.x,decoy.y);burst(decoy.x,decoy.y,'#b98aff',9);}}
    if(pos>=word.en.length)completeWord();else{ensureNeeded(true);renderHud();}
  }
  function wrong(o){
    o.hit=.48;impact(o.x,o.y,'#76dfff',16,o.r*.72);toast('🔤 ต้องหา '+nextNeeded()+' — ลองใหม่นะ','#8fe9ff');sound('soft');
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
  function particle(x,y,color,a,s,life,r){let p=particles.find(v=>!v.alive)||{};Object.assign(p,{alive:true,x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:r||1.5+Math.random()*3,color,life:life||.65,max:life||.65});if(!particles.includes(p)&&particles.length<MAX_PARTICLES)particles.push(p);}
  function burst(x,y,color,n){for(let i=0;i<n;i++)particle(x,y,color,Math.random()*6.28,40+Math.random()*190,.35+Math.random()*.55);}
  function shockwave(x,y,color,start,end,life){let o=shockwaves.find(v=>!v.alive)||{};Object.assign(o,{alive:true,x,y,color,start,end,life,max:life});if(!shockwaves.includes(o))shockwaves.push(o);}
  function impact(x,y,color,n,r){burst(x,y,color,n);for(let i=0;i<8;i++)particle(x,y,i%2?'#ffffff':'#ff8bdc',Math.random()*6.28,170+Math.random()*280,.45+Math.random()*.5,3+Math.random()*5);shockwave(x,y,'#ffffff',5,(r||28)*2.5,.42);shockwave(x,y,color,8,(r||28)*3.4,.62);shake=Math.max(shake,7.5);}
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
  function layout(){if(!canvas)return;const r=canvas.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(320,r.width);H=Math.max(240,r.height);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(playerX){const lim=cannonLimits();playerX=clamp(playerX,lim.min,lim.max);}initSky();}
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
  function drawTurret(x,size,hot){
    if(!turretImage)return;const recoil=hot?size*.018:0,g=turretGeometry(x,size,flashSide,recoil),s=g.scale;
    ctx.save();ctx.shadowColor='#54e8ff';ctx.shadowBlur=24;ctx.translate(x,g.mountY+recoil);ctx.drawImage(turretImage,-TURRET.pivot.x*s,-TURRET.pivot.y*s,TURRET.size*s,TURRET.size*s);ctx.restore();
    if(flash>0){const m=g.muzzles[flashSide],f=clamp(flash*9,0,1);ctx.save();ctx.globalAlpha=f;ctx.globalCompositeOperation='lighter';const glow=ctx.createRadialGradient(m.x,m.y,1,m.x,m.y,size*.22);glow.addColorStop(0,'#fff');glow.addColorStop(.22,'#fff38a');glow.addColorStop(.55,'rgba(68,234,255,.8)');glow.addColorStop(1,'rgba(93,71,255,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(m.x,m.y,size*.22,0,7);ctx.fill();ctx.restore();}
  }
  function drawCannon(){
    const heat=(performance.now()-fireAt<150)?1:0;drawTurret(cannonX(),turretSize(),heat);
  }
  function update(dt){
    elapsed+=dt;flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
    const dirs=Array.from(movePointers.values()),dir=(keyRight?1:0)-(keyLeft?1:0)+(dirs.includes(1)?1:0)-(dirs.includes(-1)?1:0),lim=cannonLimits();playerX=clamp(playerX+clamp(dir,-1,1)*W*.43*dt,lim.min,lim.max);
    if(activePower){powerLeft-=dt;if(powerLeft<=0){activePower=null;powerLeft=0;renderHud();}}
    if(elapsed>spawnAt){spawnDistractor();spawnAt=elapsed+clamp(1.05-wordsDone*.018,.58,1.05);}
    if(elapsed>powerAt){spawnPower();powerAt=elapsed+14+Math.random()*8;}
    ensureNeeded(false);
    fire();
    letters.forEach(o=>{if(!o.alive)return;o.hit=Math.max(0,o.hit-dt);const slow=activePower&&activePower.id==='freeze'?.44:1;o.y+=o.vy*slow*dt;if(o.y>H*.83+o.r){o.alive=false;burst(o.x,H*.8,'#59dfff',5);}});
    bullets.forEach(b=>{if(!b.alive)return;b.px=b.x;b.py=b.y;if(b.homing){const n=letters.find(o=>o.alive&&o.kind==='letter'&&o.ch===nextNeeded());if(n){const a=Math.atan2(n.y-b.y,n.x-b.x),s=Math.hypot(b.vx,b.vy);b.vx+=(Math.cos(a)*s-b.vx)*dt*7;b.vy+=(Math.sin(a)*s-b.vy)*dt*7;}}b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.life<=0||b.x<0||b.x>W||b.y<0)b.alive=false;if(!b.alive)return;if(Math.random()<.8)particle(b.x,b.y,b.side?'#ffb25b':'#65f4ff',Math.atan2(-b.vy,-b.vx)+(Math.random()-.5)*.7,20+Math.random()*90,.2+Math.random()*.16,1.5+Math.random()*3);for(const o of letters){if(o.alive&&Math.hypot(b.x-o.x,b.y-o.y)<o.r+7){b.alive=false;hit(o,b.side);break;}}});
    particles.forEach(p=>{if(!p.alive)return;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.life-=dt;if(p.life<=0)p.alive=false;});
    shockwaves.forEach(o=>{if(o.alive&&(o.life-=dt)<=0)o.alive=false;});
  }
  function draw(t){ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);drawBackground(t);letters.forEach(o=>{if(o.alive)(o.kind==='power'?drawPower(o,t):drawLetter(o,t));});ctx.globalCompositeOperation='lighter';bullets.forEach(b=>{if(!b.alive)return;ctx.strokeStyle=b.side?'rgba(255,171,67,.85)':'#bfffff';ctx.lineWidth=b.side?4:8;ctx.shadowColor=b.side?'#ff772e':'#35eaff';ctx.shadowBlur=24;ctx.beginPath();ctx.moveTo(b.px,b.py);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,b.side?4:7,0,7);ctx.fill();});particles.forEach(p=>{if(!p.alive)return;ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.shadowColor=p.color;ctx.shadowBlur=p.r*3;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();});shockwaves.forEach(o=>{if(!o.alive)return;const k=1-o.life/o.max,r=o.start+(o.end-o.start)*k;ctx.globalAlpha=(1-k)*.82;ctx.strokeStyle=o.color;ctx.lineWidth=5*(1-k)+1;ctx.shadowColor=o.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(o.x,o.y,r,0,7);ctx.stroke();});ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.shadowBlur=0;drawCannon();ctx.restore();}
  function frame(now){if(!running)return;raf=requestAnimationFrame(frame);if(paused||counting){last=now;draw(now/1000);return;}const dt=Math.min(.033,Math.max(0,(now-last)/1000||.016));last=now;update(dt);draw(now/1000);if(((now/250)|0)!==(((now-dt*1000)/250)|0))renderHud();}
  function bind(){
    abort=new AbortController();const s={signal:abort.signal};
    const press=(e,dir)=>{e.preventDefault();movePointers.set(e.pointerId,dir);try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_e){}e.currentTarget.classList.add('down');};
    const release=e=>{if(e){movePointers.delete(e.pointerId);if(e.currentTarget&&e.currentTarget.classList)e.currentTarget.classList.remove('down');}else{movePointers.clear();hud.left.classList.remove('down');hud.right.classList.remove('down');}keyLeft=keyRight=false;};
    hud.left.addEventListener('pointerdown',e=>press(e,-1),s);hud.right.addEventListener('pointerdown',e=>press(e,1),s);hud.left.addEventListener('pointerup',release,s);hud.right.addEventListener('pointerup',release,s);hud.left.addEventListener('pointercancel',release,s);hud.right.addEventListener('pointercancel',release,s);
    const releaseGlobal=e=>{const dir=movePointers.get(e.pointerId);movePointers.delete(e.pointerId);if(dir<0)hud.left.classList.remove('down');if(dir>0)hud.right.classList.remove('down');};
    window.addEventListener('pointerup',releaseGlobal,s);window.addEventListener('pointercancel',releaseGlobal,s);window.addEventListener('blur',()=>{release();pause(true);},s);
    window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){e.preventDefault();keyLeft=true;}if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){e.preventDefault();keyRight=true;}if(e.key==='Escape')pause();},s);window.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keyLeft=false;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keyRight=false;},s);
    window.addEventListener('resize',layout,s);window.addEventListener('orientationchange',layout,s);document.addEventListener('visibilitychange',()=>{if(document.hidden){release();pause(true);}},s);
    hud.pause.addEventListener('click',()=>{release();pause();},s);hud.exit.addEventListener('click',close,s);hud.sound.addEventListener('click',toggleSound,s);
  }
  function toggleSound(){if(typeof state!=='undefined'){state.sound=!state.sound;if(typeof saveState==='function')saveState();if(typeof Music!=='undefined'&&Music.onSound)Music.onSound();}renderHud();sound('correct');}
  function pause(force){if(!root||counting)return;paused=force===true?true:!paused;movePointers.clear();keyLeft=keyRight=false;let m=root.querySelector('#lc-pause');if(paused&&!m){m=document.createElement('div');m.id='lc-pause';m.className='lc-modal';m.innerHTML='<div class="lc-card"><h2>⏸ พักป้อม</h2><p>คำและตัวอักษรรออยู่ตรงนี้ ไม่มีเวลาจำกัดครับ</p><div class="lc-buttons"><button class="lc-btn primary" data-a="go">▶ เล่นต่อ</button><button class="lc-btn" data-a="exit">🚪 กลับ Lobby</button></div></div>';root.appendChild(m);m.querySelector('[data-a=go]').onclick=()=>pause();m.querySelector('[data-a=exit]').onclick=close;}else if(!paused&&m){m.remove();last=performance.now();}}
  function tutorial(){
    if(localStorage.getItem('vwLetterCannonIntro')==='1'){countdown();return;}const m=document.createElement('div');m.className='lc-modal';m.innerHTML='<div class="lc-card"><h2>🔤💥 Letter Cannon</h2><p><b>ยิงตัวอักษรตามลำดับเพื่อประกอบคำเป้าหมาย</b><br>ตัวอย่าง APPLE: ยิง A → P → P → L → E</p><p>ปืนใหญ่ยิงขึ้นด้านบนอัตโนมัติ<br>กดค้างปุ่ม <b>◀ ซ้าย</b> หรือ <b>ขวา ▶</b> ที่มุมล่างเพื่อเลื่อนปืนไปรับตัวอักษร</p><p>ยิงผิดไม่เสียอะไร และเล่นได้นานเท่าที่ต้องการ</p><div class="lc-buttons"><button class="lc-btn primary" data-a="start">🚀 เริ่มปกป้องคำศัพท์</button><button class="lc-btn" data-a="exit">🚪 ออกจากเกม</button></div></div>';root.appendChild(m);m.querySelector('[data-a=start]').onclick=()=>{localStorage.setItem('vwLetterCannonIntro','1');m.remove();countdown();};m.querySelector('[data-a=exit]').onclick=close;
  }
  function countdown(){counting=true;const m=document.createElement('div');m.className='lc-modal lc-countdown';root.appendChild(m);let n=3;const step=()=>{if(!running||!m.isConnected)return;m.innerHTML='<div class="lc-count">'+(n?n:'GO!')+'</div><button class="lc-btn lc-count-exit">🚪 ออกจากเกม</button>';m.querySelector('button').onclick=close;sound('correct');if(n--){later(step,650);}else later(()=>{m.remove();counting=false;last=performance.now();},520);};step();}
  function buildDom(){
    root=document.createElement('div');root.id='lc-game';root.innerHTML='<canvas class="lc-game-canvas" aria-label="สนาม Letter Cannon — ปืนยิงอัตโนมัติ กดซ้ายขวาเพื่อเลื่อน"></canvas><div class="lc-hud"><div class="lc-stats lc-glass"><div class="lc-stat"><span>คะแนน</span><b id="lc-score">0</b></div><div class="lc-stat"><span>Combo</span><b id="lc-combo">0</b></div><div class="lc-stat"><span>คำสำเร็จ</span><b id="lc-words">0</b></div><div class="lc-stat"><span>เหรียญรอบนี้</span><b id="lc-coins">0</b></div></div><div class="lc-wordbox lc-glass"><div class="lc-target" id="lc-target"></div><div class="lc-meaning" id="lc-meaning"></div><div class="lc-progress" id="lc-progress"></div></div><div class="lc-actions"><button class="lc-iconbtn" id="lc-sound" title="เปิด/ปิดเสียง">🔊</button><button class="lc-iconbtn" id="lc-pause-btn" title="พัก">⏸</button><button class="lc-iconbtn lc-exitwide" id="lc-exit" title="ออกจากเกมกลับ Lobby">🚪 ออกจากเกม</button></div><div class="lc-power lc-glass"><div class="lc-power-name" id="lc-power-name">ปืนพลังอักษร</div><div class="lc-power-bar"><div class="lc-power-fill" id="lc-power-fill"></div></div></div><div class="lc-hint lc-glass"><b>ยิงอัตโนมัติ</b> · กดค้างซ้าย/ขวาเพื่อเลื่อนปืน · ผิดไม่เสียอะไร</div><button class="lc-move lc-move-left" id="lc-left" aria-label="เลื่อนปืนไปทางซ้าย">◀<span>ซ้าย</span></button><button class="lc-move lc-move-right" id="lc-right" aria-label="เลื่อนปืนไปทางขวา"><span>ขวา</span>▶</button></div><div class="lc-rotate">📱↻<br>หมุนโทรศัพท์เป็นแนวนอน<br>เพื่อเห็นสนามได้กว้างเต็มจอ</div>';
    document.body.appendChild(root);canvas=root.querySelector('canvas');ctx=canvas.getContext('2d',{alpha:false});['score','combo','words','coins','target','meaning','progress','power-name','power-fill','pause-btn','exit','sound','left','right'].forEach(k=>hud[k.replace('-','')]=root.querySelector('#lc-'+k));hud.powerName=root.querySelector('#lc-power-name');hud.powerFill=root.querySelector('#lc-power-fill');hud.pause=root.querySelector('#lc-pause-btn');
  }
  function startGame(){if(!opening||running)return;opening=false;buildDom();layout();playerX=W*.5;bind();score=combo=wordsDone=coinsRun=pos=0;elapsed=0;spawnAt=.4;powerAt=9;letters=[];bullets=[];particles=[];shockwaves=[];activePower=null;barrelCycle=flashSide=0;running=true;paused=false;nextWord();if(typeof Music!=='undefined'&&Music.suspendBg)Music.suspendBg();last=performance.now();raf=requestAnimationFrame(frame);tutorial();}
  function open(){if(running||opening)return;if(!adminAllowed()){lockedNotice();return;}opening=true;loadTurretAssets().then(startGame).catch(err=>{opening=false;console.error(err);if(typeof toast==='function')toast('⚠️ โหลดภาพป้อมไม่สำเร็จ กรุณารีเฟรชแล้วลองใหม่');});}
  function close(){opening=false;running=false;movePointers.clear();keyLeft=keyRight=false;clearTimers();cancelAnimationFrame(raf);if(abort)abort.abort();abort=null;letters.length=bullets.length=particles.length=shockwaves.length=0;try{if(audio&&audio.state==='running')audio.suspend();}catch(e){}if(root)root.remove();root=canvas=ctx=null;if(typeof Music!=='undefined'&&Music.resumeBg)Music.resumeBg();if(typeof renderDashboard==='function')renderDashboard();}
  function bindRail(){const b=document.getElementById('btn-rail-lettercannon');if(b){refreshLock();b.addEventListener('click',()=>{refreshLock();if(!adminAllowed()){lockedNotice();return;}if(typeof closePanel==='function')closePanel();open();});}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindRail);else bindRail();
  window.LetterCannon={open,close,refreshLock,_t:{adminAllowed,wordPool,nextWord,ensureNeeded,spawnLetter,spawnPower,fire,hit,activate,turretGeometry,turretSize,cannonLimits,get word(){return word;},get pos(){return pos;},get score(){return score;},get combo(){return combo;},get wordsDone(){return wordsDone;},get running(){return running;},get paused(){return paused;},get playerX(){return playerX;},get letters(){return letters;},get bullets(){return bullets;},get particles(){return particles;},get shockwaves(){return shockwaves;},get activePower(){return activePower;},setPlayerX(x){playerX=clamp(x,cannonLimits().min,cannonLimits().max);},setMove(left,right){keyLeft=!!left;keyRight=!!right;},setViewport(w,h){W=w;H=h;if(!playerX)playerX=W*.5;},step(dt){update(dt||.016);},TURRET,SHOT_ANGLE,POWER,MAX_LETTERS,MAX_BULLETS}};
})();
