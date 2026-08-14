"use strict";
/* ============================================================
   🚗🐾 PET SHOPPING 3D — รอบ 1160
   โลกสั้น first-person แยกจาก Adventure3D: ร้านใกล้, GPS ชัด,
   ร้านสร้างเป็นองค์ประกอบสถาปัตย์จริง ไม่ใช่กล่องแปะภาพ
   ============================================================ */
window.PetShopping3D=(()=>{
  const STORE_POS=Object.freeze({food:Object.freeze({x:-42,z:-82}),fashion:Object.freeze({x:42,z:-82})});
  let root,scene,camera,renderer,raf,last=0,running=false,paused=false,target='food',carId='car_01';
  let car={x:0,z:18,yaw:Math.PI,speed:0,steer:0},keys={},listeners=[],routeLine,storeBtn,gpsEl,wheelEl,petEl,speedEl,radioEl;
  let steerCtl=0,padThr=false,padBr=false,gearR=false,kBack=false,dSpeed=0,dSteer=0,dVelX=0,dVelZ=0,dRoll=0,dRollV=0,carRevBeepAt=0,collisionAt=0;
  let steerHitEl,steerKnobEl,throttleEl,brakeEl,gearEl,hornEl;
  let solidRects=[],solidCircles=[];
  const disposables=[];
  const C={food:0x81b89a,fashion:0xd694be,road:0x59636b,walk:0xe9d8bf};
  /* ============================================================
     🚗🏙️ รอบ 1160 — พอร์ตระบบบังคับรถจาก js/moto3d.js โซนรอบ 785
     bicycle model + พวงมาลัยคืนกลาง + เบรก + เกียร์ D/R + แตร + เสียงรถ
     สูตรและค่าคงที่ยกมาชุดเดียวกัน ไม่สร้างฟิสิกส์ชุดใหม่
     ============================================================ */
  const CAR_ACCEL=11,CAR_BRAKE=15,CAR_VMAX=55.6,CAR_VMAX_OFF=7,CAR_VREV=6.5,CAR_WB=2.6,CAR_STEER_MAX=.52;
  const WORLD_HALF=700,DRIVE_LIMIT=480;
  function onRoad(x,z){return Math.abs(x)<=15||Math.abs(z+55)<=13;}
  const CarSnd={ctx:null,master:null,osc:null,osc2:null,gain:null,lp:null,on:false,rpm:0,skidGain:null,skidBp:null,
    ac(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;this.ctx=new A();this.master=this.ctx.createGain();this.master.gain.value=1;this.master.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},
    start(){if(this.on)return;try{const c=this.ac();if(!c)return;this.gain=c.createGain();this.gain.gain.value=0;this.lp=c.createBiquadFilter();this.lp.type='lowpass';this.lp.frequency.value=520;this.osc=c.createOscillator();this.osc.type='sawtooth';this.osc.frequency.value=55;this.osc2=c.createOscillator();this.osc2.type='square';this.osc2.frequency.value=28;const g2=c.createGain();g2.gain.value=.5;this.osc.connect(this.lp);this.osc2.connect(g2);g2.connect(this.lp);this.lp.connect(this.gain);this.gain.connect(this.master);this.osc.start();this.osc2.start();this.on=true;this.rpm=0;}catch(e){}},
    ignite(){try{const c=this.ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(72,t);lfo.frequency.value=11;lg.gain.value=26;lfo.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(.07,t);g.gain.setValueAtTime(.07,t+.62);g.gain.exponentialRampToValueAtTime(.001,t+.8);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.85);lfo.start(t);lfo.stop(t+.85);setTimeout(()=>{this.start();if(this.on)this.rpm=.95;},680);}catch(e){}},
    update(th,sp,dt){if(!this.on)return;const mute=(typeof state!=='undefined'&&state.sound===false)||!running;if(this.master)this.master.gain.setTargetAtTime(mute?0:1,this.ctx.currentTime,.08);const tgt=.18+Math.min(1,sp/CAR_VMAX)*.72+(th>0?.14:0);this.rpm+=(tgt-this.rpm)*Math.min(1,dt*3);this.osc.frequency.value=48+this.rpm*175;this.osc2.frequency.value=24+this.rpm*88;this.lp.frequency.value=360+this.rpm*950;this.gain.gain.value=.03+this.rpm*.05;},
    skidStart(){if(this.skidGain||!this.ctx)return;try{const c=this.ctx,nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const src=c.createBufferSource();src.buffer=nb;src.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1650;bp.Q.value=5.5;const g=c.createGain();g.gain.value=0;src.connect(bp);bp.connect(g);g.connect(this.master);src.start();this.skidGain=g;this.skidBp=bp;}catch(e){}},
    setSkid(amt){if(typeof state!=='undefined'&&state.sound===false){if(this.skidGain)this.skidGain.gain.value=0;return;}if(!this.ctx)return;if(!this.skidGain)this.skidStart();if(!this.skidGain)return;const a=Math.max(0,Math.min(1,amt)),tgt=a*a*.13,g=this.skidGain.gain;g.value+=(tgt-g.value)*.35;if(this.skidBp)this.skidBp.frequency.value=1350+a*900;},
    tone(freq,dur=.2,vol=.055,type='square'){try{const c=this.ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.02);}catch(e){}},
    revBeep(){this.tone(1000,.2,.055);},horn(){this.tone(440,.42,.09);this.tone(554,.42,.09);},
    stop(){if(this.skidGain)this.skidGain.gain.value=0;if(this.master&&this.ctx)this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.05);}
  };
  function sndKick(){if(!CarSnd.on)CarSnd.ignite();}
  function syncGearUi(){if(!gearEl)return;gearEl.classList.toggle('on',gearR);const x=gearEl.querySelector('.ps3-ci');if(x)x.textContent=gearR?'R':'D';const lb=throttleEl&&throttleEl.querySelector('small');if(lb)lb.textContent=gearR?'ถอย':'เร่ง';}
  function setGear(rev){if(gearR===rev)return;gearR=rev;syncGearUi();if(typeof sfx!=='undefined'&&sfx.select)sfx.select();}
  function mat(color,opt={}){const m=new THREE.MeshStandardMaterial({color,roughness:opt.roughness??.7,metalness:opt.metalness??.05,transparent:!!opt.transparent,opacity:opt.opacity??1});disposables.push(m);return m;}
  function mesh(g,m,x,y,z,parent=scene){const q=new THREE.Mesh(g,m);q.position.set(x,y,z);parent.add(q);disposables.push(g);return q;}
  function box(x,y,z,w,h,d,m,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);}
  function solidRect(x,z,w,d,pad=.75){solidRects.push({x,z,hw:w/2+pad,hd:d/2+pad});}
  function solidCircle(x,z,r){solidCircles.push({x,z,r:r+1.15});}
  function hitsSolid(x,z){for(const b of solidRects)if(Math.abs(x-b.x)<=b.hw&&Math.abs(z-b.z)<=b.hd)return true;for(const c of solidCircles){const dx=x-c.x,dz=z-c.z;if(dx*dx+dz*dz<=c.r*c.r)return true;}return false;}
  function loadTexture(url,onReady){
    const owner=scene,finish=tex=>{if(scene!==owner||!root){if(tex.image&&tex.image.close)tex.image.close();tex.dispose();return;}tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;disposables.push(tex);onReady(tex);};
    if(typeof fetch==='function'&&typeof createImageBitmap==='function')fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.blob();}).then(createImageBitmap).then(bm=>finish(new THREE.Texture(bm))).catch(()=>new THREE.TextureLoader().load(url,finish,undefined,()=>{}));
    else new THREE.TextureLoader().load(url,finish,undefined,()=>{});
  }
  function listen(el,type,fn,opt){el.addEventListener(type,fn,opt);listeners.push(()=>el.removeEventListener(type,fn,opt));}
  function routeFor(start,kind){const p=STORE_POS[kind]||STORE_POS.food;return [{x:start.x,z:start.z},{x:0,z:-55},{x:p.x,z:-55},{x:p.x,z:p.z+8}];}
  function rebuildRoute(){
    if(routeLine){scene.remove(routeLine);routeLine.geometry.dispose();}
    const pts=routeFor(car,target).map(p=>new THREE.Vector3(p.x,.34,p.z));
    const g=new THREE.BufferGeometry().setFromPoints(pts),m=new THREE.LineBasicMaterial({color:0x4fd5ff,transparent:true,opacity:.9});
    routeLine=new THREE.Line(g,m);scene.add(routeLine);disposables.push(g,m);
  }
  function addRoad(){
    const road=mat(C.road),walk=mat(C.walk),line=mat(0xffe8a8),grass=mat(0x9bcf8e);
    box(0,-.18,-55,WORLD_HALF*2,.3,WORLD_HALF*2,grass);box(0,.01,-55,30,.18,WORLD_HALF*2,road);box(0,.02,-55,WORLD_HALF*2,.19,26,road);
    box(-18,.05,-55,6,.2,WORLD_HALF*2,walk);box(18,.05,-55,6,.2,WORLD_HALF*2,walk);box(0,.12,-55,.35,.05,WORLD_HALF*2,line);
    for(let z=WORLD_HALF-55;z>-WORLD_HALF-55;z-=14){box(-7,.13,z,.35,.04,7,line);box(7,.13,z,.35,.04,7,line);}
    for(let x=-WORLD_HALF;x<=WORLD_HALF;x+=14)box(x,.13,-55,7,.04,.32,line);
  }
  function addTree(x,z){const trunk=mat(0x9b6b42),leaf=mat(0x70b87b);box(x,1.4,z,.7,2.8,.7,trunk);mesh(new THREE.SphereGeometry(2.3,9,7),leaf,x,4,z);solidCircle(x,z,1.15);}
  function facadeTexture(kind){
    loadTexture(`img/pet-shopping/${kind}_window.webp`,tex=>{const m=new THREE.MeshBasicMaterial({map:tex});disposables.push(m);const p=STORE_POS[kind];box(p.x,5.7,p.z+6.18,14,7.3,.12,m);});
  }
  function addShop(kind){
    const p=STORE_POS[kind],accent=mat(C[kind]),stone=mat(kind==='food'?0xf6efdd:0xffeef3),gold=mat(0xc9a45c,{metalness:.55,roughness:.3}),glass=mat(0xbce7ed,{transparent:true,opacity:.32,roughness:.1}),dark=mat(0x3e4b4c),wood=mat(0xa87955);
    const group=new THREE.Group();group.position.set(p.x,0,p.z);group.rotation.y=Math.PI;scene.add(group); // หัน façade เข้าหาถนน/จุดเริ่ม
    solidRect(p.x,p.z,25,18,1.25);
    box(0,.25,0,25,.5,18,stone,group);box(0,5,-6,25,10,1,stone,group);box(-12,5,0,1,10,12,stone,group);box(12,5,0,1,10,12,stone,group);box(0,10,0,26,.7,18,accent,group);
    box(0,10.8,-5.9,27,1.2,1.3,gold,group);box(0,9.7,-5.8,26,.35,1.1,dark,group);
    [-11,-7.3,7.3,11].forEach(x=>{box(x,5,-6.7,.8,9,.8,gold,group);box(x,9.5,-6.7,1.35,.5,1.35,stone,group);});
    [-8.9,-4.4,4.4,8.9].forEach(x=>box(x,5.4,-6.45,3.7,6.8,.22,glass,group));
    box(0,4.3,-6.6,4.2,7.6,.25,glass,group);box(0,8.6,-7.1,9,.35,3,accent,group);
    box(0,3.5,-1.5,3.8,1.3,1.6,wood,group); // checkout
    for(const x of [-8,8])for(let y=1.2;y<6;y+=1.5)box(x,y,-1,1.1,.25,8,wood,group); // wall shelves
    for(const x of [-4,4])box(x,1.1,2,2.8,2.2,6,wood,group); // gondola / fashion islands
    if(kind==='fashion')[-5,5].forEach(x=>{box(x,3.4,3,.18,4,.18,gold,group);box(x,5.3,3,3.4,.18,.18,gold,group);});
    const sign=document.createElement('canvas');sign.width=512;sign.height=128;const c=sign.getContext('2d');c.fillStyle=kind==='food'?'#3d7a67':'#8d507e';c.fillRect(0,0,512,128);c.fillStyle='#fff5d1';c.textAlign='center';c.font='bold 42px sans-serif';c.fillText(kind==='food'?'PAWS & PANTRY':'MAISON DE PAWS',256,78);const tx=new THREE.CanvasTexture(sign);const sm=new THREE.MeshBasicMaterial({map:tx});disposables.push(tx,sm);box(0,10.6,-6.7,13,2.7,.12,sm,group);
    facadeTexture(kind);
  }
  function decorateTown(rows){
    loadTexture('img/pet-shopping/cute_town_mural_v2.webp',tex=>{tex.anisotropy=Math.min(4,renderer&&renderer.capabilities?renderer.capabilities.getMaxAnisotropy():1);const mural=new THREE.MeshBasicMaterial({map:tex}),frame=mat(0xffefd0),awnings=[mat(0xff8f78),mat(0x55c9bd),mat(0xf3c957),mat(0xb69adc)];disposables.push(mural);rows.forEach(({x,z,h},i)=>{const fy=Math.min(h-2.5,5),awning=awnings[i%awnings.length];[-1,1].forEach(face=>{const fz=z+face*6.07;box(x,fy,fz,8,4.2,.13,mural);box(x,fy+2.25,fz,8.5,.28,.22,frame);box(x,fy-2.25,fz,8.5,.28,.22,frame);box(x,fy+2.45,z+face*6.45,9,.35,1.05,awning);});});Object.values(STORE_POS).forEach(p=>[-8.2,8.2].forEach(dx=>{box(p.x+dx,5.1,p.z+6.22,5.6,6.7,.16,mural);box(p.x+dx,8.58,p.z+6.25,6.1,.3,.24,frame);box(p.x+dx,1.62,p.z+6.25,6.1,.3,.24,frame);}));});
  }
  function addTown(){
    const colors=[0xf0c8ae,0xa7cfd4,0xd8c2e5,0xf0dda9],roof=mat(0x6f6564),rows=[];
    for(let i=0;i<54;i++){const side=i%2?-1:1,x=side*(35+(i%3)*12),z=250-Math.floor(i/2)*29;if(Math.abs(z+82)<18)continue;const h=8+(i%4)*2,wall=mat(colors[i%colors.length]);box(x,h/2,z,13,h,12,wall);box(x,h+.4,z,14,.8,13,roof);solidRect(x,z,13,12);rows.push({x,z,side,h});for(let y=3;y<h;y+=3)for(const dx of [-3,3])box(x+dx,y,z-side*6.05,2,1.5,.15,mat(0xfff1b8));}
    for(let z=245;z>-540;z-=20){if(Math.abs(z+82)>16){addTree(-23,z);addTree(23,z);}}
    decorateTown(rows);addShop('food');addShop('fashion');
  }
  function buildScene(){
    solidRects=[];solidCircles=[];
    scene=new THREE.Scene();scene.background=new THREE.Color(0xbfe5ef);scene.fog=new THREE.Fog(0xbfe5ef,85,220);
    camera=new THREE.PerspectiveCamera(66,innerWidth/innerHeight,.1,300);scene.add(new THREE.HemisphereLight(0xfff5df,0x55745c,1.05));const sun=new THREE.DirectionalLight(0xffe7bd,1.25);sun.position.set(-30,50,20);scene.add(sun);
    renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=false;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;root.prepend(renderer.domElement);
    addRoad();addTown();rebuildRoute();
  }
  function petVisual(){const p=(typeof activePet==='function')?activePet():null;let src='';try{src=p&&typeof currentPetImg==='function'?currentPetImg(p):'';}catch(e){}return src?`<img src="${src}" alt="${p?escapeHTML(p.name):'น้อง'}">`:`<span>${p&&PETS[p.type]?PETS[p.type].adult:'🐶'}</span>`;}
  function radioState(){
    const on=typeof Music!=='undefined'&&Music.isCarOn();
    if(!radioEl)return;
    radioEl.classList.toggle('on',on);radioEl.setAttribute('aria-pressed',String(on));
    const label=radioEl.querySelector('small');if(label)label.textContent=on?'เพลง ON · แตะเพื่อปิด':'เพลง OFF · แตะเพื่อเปิด';
  }
  function buildHUD(rental){
    const carNo=Number(String(carId).match(/\d+/)?.[0]||1),hue=(188+carNo*17)%360;
    root.style.setProperty('--ps3-accent',`hsl(${hue} 72% 56%)`);
    root.insertAdjacentHTML('beforeend',`
      <div class="ps3-hud"><div class="ps3-gps"><span class="ps3-gps-icon">◆</span><div><b>GPS · ${target==='food'?'ร้านอาหารสัตว์':'ร้านแฟชั่นสัตว์เลี้ยง'}</b><span>ตรงไปตามเส้นนำทาง</span></div></div><div class="ps3-actions"><button data-dest="food" class="${target==='food'?'active':''}" aria-label="นำทางไปร้านอาหารสัตว์">🥫</button><button data-dest="fashion" class="${target==='fashion'?'active':''}" aria-label="นำทางไปร้านแฟชั่น">🎀</button><button data-exit="1" class="ps3-exit" aria-label="ออกจากโลก">✕ <span>ออก</span></button></div></div>
      <div class="ps3-windshield" aria-hidden="true"></div>
      <div class="ps3-cockpit"><div class="ps3-dash-shell"><div class="ps3-dash-stitch"></div><div class="ps3-speed"><strong>0</strong><span>km/h</span></div><button class="ps3-radio" data-radio="1" type="button" aria-pressed="true"><span class="ps3-eq" aria-hidden="true">${'<i></i>'.repeat(7)}</span><strong>CAR RADIO</strong><small>เพลง ON · แตะเพื่อปิด</small></button><div class="ps3-wheel" aria-hidden="true"><i></i></div><div class="ps3-pet">${petVisual()}<small>น้องนั่งด้วย 🐾</small></div></div></div>
      <div class="ps3-slider" aria-hidden="true"><div class="ps3-knob"><span>เลี้ยว</span></div></div><div class="ps3-steerhit" aria-label="พวงมาลัย ลากซ้ายขวา"></div>
      <button class="ps3-throttle" type="button" aria-label="คันเร่ง"><span>🚗</span><small>เร่ง</small></button>
      <div class="ps3-car-controls"><button class="ps3-cbtn ps3-brake" type="button"><span class="ps3-ci">🦶</span><small>เบรก</small></button><button class="ps3-cbtn ps3-gear" type="button"><span class="ps3-ci">D</span><small>เกียร์</small></button><button class="ps3-cbtn ps3-horn" type="button"><span class="ps3-ci">📯</span><small>แตร</small></button></div>
      <button class="ps3-store">เข้าร้าน</button><div class="ps3-help">W เร่ง · S เบรก/ถอย · A/D เลี้ยว · R เกียร์ · H แตร · M เพลง${rental?' · รถเช่ารอบนี้':''}</div>`);
    gpsEl=root.querySelector('.ps3-gps span:not(.ps3-gps-icon)');storeBtn=root.querySelector('.ps3-store');wheelEl=root.querySelector('.ps3-wheel');petEl=root.querySelector('.ps3-pet');speedEl=root.querySelector('.ps3-speed strong');radioEl=root.querySelector('.ps3-radio');steerHitEl=root.querySelector('.ps3-steerhit');steerKnobEl=root.querySelector('.ps3-knob');throttleEl=root.querySelector('.ps3-throttle');brakeEl=root.querySelector('.ps3-brake');gearEl=root.querySelector('.ps3-gear');hornEl=root.querySelector('.ps3-horn');syncGearUi();radioState();
  }
  function bind(){
    listen(window,'keydown',e=>{keys[e.code]=true;if(e.code==='Escape')exit();if(e.code==='KeyM'&&typeof Music!=='undefined'){Music.toggleCar();radioState();}if((e.code==='KeyH')){sndKick();CarSnd.horn();}if(e.code==='KeyR')setGear(!gearR);if(e.code==='ArrowDown'||e.code==='KeyS')kBack=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();});listen(window,'keyup',e=>{keys[e.code]=false;if(e.code==='ArrowDown'||e.code==='KeyS')kBack=false;});listen(window,'resize',()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
    root.querySelectorAll('[data-dest]').forEach(b=>listen(b,'click',()=>{target=b.dataset.dest;rebuildRoute();root.querySelector('.ps3-gps b').textContent=`GPS · ${target==='food'?'ร้านอาหารสัตว์':'ร้านแฟชั่นสัตว์เลี้ยง'}`;root.querySelectorAll('[data-dest]').forEach(x=>x.classList.toggle('active',x===b));}));listen(radioEl,'click',()=>{if(typeof Music==='undefined')return;if(!Music.ready()){toast('🎵 ยังไม่มีไฟล์เพลงในรถ');return;}Music.toggleCar();radioState();});listen(root.querySelector('[data-exit]'),'click',exit);listen(storeBtn,'click',openShop);
    const thrOn=e=>{e.preventDefault();padThr=true;throttleEl.classList.add('pressing');sndKick();},thrOff=()=>{padThr=false;throttleEl.classList.remove('pressing');};listen(throttleEl,'pointerdown',thrOn);['pointerup','pointercancel','pointerleave'].forEach(x=>listen(throttleEl,x,thrOff));
    const brOn=e=>{e.preventDefault();padBr=true;brakeEl.classList.add('press');sndKick();},brOff=()=>{padBr=false;brakeEl.classList.remove('press');};listen(brakeEl,'pointerdown',brOn);['pointerup','pointercancel','pointerleave'].forEach(x=>listen(brakeEl,x,brOff));listen(gearEl,'click',e=>{e.preventDefault();setGear(!gearR);});listen(hornEl,'pointerdown',e=>{e.preventDefault();sndKick();CarSnd.horn();});
    let sliding=false;const setSteer=e=>{const r=steerHitEl.getBoundingClientRect();steerCtl=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2.05));steerKnobEl.style.left=(50+steerCtl*26)+'%';};listen(steerHitEl,'pointerdown',e=>{sliding=true;steerKnobEl.classList.add('grab');try{steerHitEl.setPointerCapture(e.pointerId);}catch(err){}setSteer(e);});listen(steerHitEl,'pointermove',e=>{if(sliding)setSteer(e);});const steerEnd=()=>{sliding=false;steerCtl=0;steerKnobEl.classList.remove('grab');steerKnobEl.style.left='50%';};listen(steerHitEl,'pointerup',steerEnd);listen(steerHitEl,'pointercancel',steerEnd);
  }
  function openShop(){if(paused)return;const p=STORE_POS[target],d=Math.hypot(car.x-p.x,car.z-p.z);if(d>27)return;paused=true;car.speed=dSpeed=dVelX=dVelZ=0;PetPantry.openStore(target,{onClose(){paused=false;}});}
  function navText(dist){if(dist<27)return 'ถึงร้านแล้ว · จอดรถแล้วกด “เข้าร้าน”';const p=STORE_POS[target],dx=p.x-car.x,dz=p.z-car.z;const ang=Math.atan2(dx,dz)-car.yaw,turn=Math.sin(ang)>0?'เลี้ยวซ้าย':'เลี้ยวขวา';return dist>55?`ตรงไป ${Math.round(dist-25)} ม. แล้ว${turn}`:`อีก ${Math.round(dist)} ม. · เตรียม${turn}`;}
  function carDrive(dt,now){
    let sd=steerCtl;if(!!(keys.ArrowLeft||keys.KeyA)!==!!(keys.ArrowRight||keys.KeyD))sd=(keys.ArrowRight||keys.KeyD)?1:-1;let th=0;if(padThr||keys.ArrowUp||keys.KeyW)th=gearR?-1:1;if(kBack)th=-1;if(padBr||keys.Space)th=0;
    if((gearR||dSpeed<-.5)&&now-carRevBeepAt>600){carRevBeepAt=now;CarSnd.revBeep();}const road=onRoad(car.x,car.z),vmax=road?CAR_VMAX:CAR_VMAX_OFF;if(th>0)dSpeed+=CAR_ACCEL*(road?1:.55)*th*dt;else if(th<0){if(dSpeed>.3)dSpeed=Math.max(0,dSpeed-CAR_BRAKE*dt);else dSpeed=Math.max(-CAR_VREV,dSpeed+CAR_ACCEL*.7*th*dt);}if(padBr||keys.Space)dSpeed=dSpeed>0?Math.max(0,dSpeed-CAR_BRAKE*1.2*dt):Math.min(0,dSpeed+CAR_BRAKE*1.2*dt);dSpeed*=Math.max(0,1-(road?.16:1.15)*dt);if(dSpeed>vmax)dSpeed=Math.max(vmax,dSpeed-CAR_BRAKE*.8*dt);
    const tgt=sd*CAR_STEER_MAX/(1+Math.abs(dSpeed)*.045),ramp=Math.abs(tgt)>Math.abs(dSteer)?3.8:6;dSteer+=(tgt-dSteer)*Math.min(1,dt*ramp);const yawRate=(dSpeed/CAR_WB)*Math.tan(dSteer),maxYaw=1.9/(1+Math.abs(dSpeed)*.06),yrApplied=Math.max(-maxYaw,Math.min(maxYaw,yawRate));car.yaw-=yrApplied*dt;const sin=Math.sin(car.yaw),cos=Math.cos(car.yaw),grip=Math.min(1,dt*(6.5-Math.min(3.8,Math.abs(dSteer)*Math.abs(dSpeed)*.38)));dVelX+=(sin*dSpeed-dVelX)*grip;dVelZ+=(cos*dSpeed-dVelZ)*grip;const prevX=car.x,prevZ=car.z;car.x+=dVelX*dt;car.z+=dVelZ*dt;car.x=Math.max(-DRIVE_LIMIT,Math.min(DRIVE_LIMIT,car.x));car.z=Math.max(-DRIVE_LIMIT-55,Math.min(DRIVE_LIMIT-55,car.z));if(hitsSolid(car.x,car.z)){car.x=prevX;car.z=prevZ;dVelX*=-.18;dVelZ*=-.18;dSpeed*=-.12;if(now-collisionAt>320){collisionAt=now;CarSnd.tone(86,.2,.1,'sine');if((typeof state==='undefined'||state.haptic!==false)&&navigator.vibrate)navigator.vibrate(35);}}const vlen=Math.hypot(dVelX,dVelZ),slip=(vlen>.6&&road)?Math.abs(dVelX*cos-dVelZ*sin):0;CarSnd.setSkid(Math.max(0,Math.min(1,(slip-1.6)/6)));const latA=yrApplied*dSpeed,sdt=Math.min(dt,.05),rollTgt=Math.max(-.12,Math.min(.12,latA*.008));dRollV+=((rollTgt-dRoll)*60-dRollV*9)*sdt;dRoll+=dRollV*sdt;car.speed=Math.abs(dSpeed);car.steer=sd;if(wheelEl)wheelEl.style.transform=`translateX(-50%) rotate(${dSteer/CAR_STEER_MAX*100}deg)`;CarSnd.update(th,car.speed,dt);
  }
  function tick(t){if(!running)return;raf=requestAnimationFrame(tick);const dt=Math.min(.04,(t-last)/1000||.016);last=t;if(!paused)carDrive(dt,t);
    camera.position.set(car.x,2.2,car.z);camera.rotation.set(-.035,car.yaw-Math.PI,0,'YXZ');const p=STORE_POS[target],dist=Math.hypot(car.x-p.x,car.z-p.z);gpsEl.textContent=navText(dist);if(speedEl)speedEl.textContent=Math.round(Math.abs(car.speed)*4.2);storeBtn.classList.toggle('show',dist<27);renderer.render(scene,camera);
  }
  function start(opt={}){if(running||!window.THREE||!document.body)return false;target=opt.target==='fashion'?'fashion':'food';carId=/^car_\d+$/.test(opt.carId||'')?opt.carId:'car_01';car={x:0,z:18,yaw:Math.PI,speed:0,steer:0};keys={};steerCtl=0;padThr=padBr=gearR=kBack=false;dSpeed=dSteer=dVelX=dVelZ=dRoll=dRollV=0;carRevBeepAt=collisionAt=0;root=document.createElement('div');root.className='ps3-root';document.body.appendChild(root);try{buildScene();buildHUD(!!opt.rental);bind();if(typeof Music!=='undefined'){Music.suspendBg();Music.carRadio(true);radioState();}running=true;last=performance.now();raf=requestAnimationFrame(tick);return true;}catch(e){console.error(e);cleanup();return false;}}
  function cleanup(){cancelAnimationFrame(raf);listeners.splice(0).forEach(fn=>fn());CarSnd.stop();if(typeof Music!=='undefined'){Music.carRadio(false);Music.resumeBg();}if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const a=Array.isArray(o.material)?o.material:[o.material];a.forEach(m=>m.dispose&&m.dispose());}});disposables.splice(0).forEach(x=>x&&x.dispose&&x.dispose());if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();}if(root)root.remove();root=scene=camera=renderer=routeLine=null;storeBtn=gpsEl=wheelEl=petEl=speedEl=radioEl=steerHitEl=steerKnobEl=throttleEl=brakeEl=gearEl=hornEl=null;running=paused=false;keys={};padThr=padBr=kBack=false;}
  function exit(){if(!running)return;cleanup();if(typeof renderDashboard==='function')renderDashboard();}
  return {start,exit,isRunning:()=>running,_t:{routeFor,STORE_POS,WORLD_HALF,DRIVE_LIMIT,hitsSolid,setPose(x,z,yaw=car.yaw){car.x=x;car.z=z;car.yaw=yaw;dSpeed=dVelX=dVelZ=0;},get solids(){return {rects:solidRects.length,circles:solidCircles.length};},get driveState(){return {x:car.x,z:car.z,speed:dSpeed,steer:dSteer,gearR};},get cleanupState(){return {running,paused,listeners:listeners.length};}}};
})();
