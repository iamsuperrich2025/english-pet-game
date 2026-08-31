"use strict";
/* ============================================================
   🚗🐾 PET SHOPPING 3D — รอบ 1169
   โลกสั้น first-person แยกจาก Adventure3D: ร้านใกล้, GPS ชัด,
   ร้านสร้างเป็นองค์ประกอบสถาปัตย์จริง ไม่ใช่กล่องแปะภาพ
   ============================================================ */
window.PetShopping3D=(()=>{
  const DAY_SKY=0xbfe5ef,NIGHT_SKY=0x0b1630,DAY_FOG=0xaed8e8,NIGHT_FOG=0x080f1f;
  const DAY_AMBIENT=0xfcfeff,NIGHT_AMBIENT=0x21374f,NIGHT_FILL=0x5e84a8,NIGHT_PULSE=0x80e0ff;
  const SHOP_ORIG_Z=-82;
  const ROAD_CENTER_Z=-55,ROAD_HALF_X=13,ROAD_HALF_Z=11,ROAD_CORRIDOR_HALF=14.5,ROAD_ENTRANCE_CORRIDOR_HALF=23.5;
  const SIDE_ENTRANCE_GAP_LEAD=82,SIDE_ENTRANCE_GAP_TAIL=58;
  const ROAD_ANCHOR=Object.freeze({x:0,z:18});
  const SHOP_TURN_Z=ROAD_CENTER_Z-(Math.abs(SHOP_ORIG_Z-ROAD_CENTER_Z)*5); // เดินตรงอีก 5 เท่าก่อนเลี้ยวเข้าเลนย่อย
  const SHOP_CENTER_Z=SHOP_TURN_Z-20,STORE_STOP_Z=SHOP_CENTER_Z-8;
  const SHOP_CLEAR_RADIUS=24,SHOP_TRIGGER_CLEARANCE=27,SHOP_HINT_DIST=58;
  const STORE_POS=Object.freeze({
    food:Object.freeze({x:-42,z:SHOP_CENTER_Z}),
    fashion:Object.freeze({x:42,z:SHOP_CENTER_Z})
  });
  let root,scene,camera,renderer,raf,last=0,running=false,paused=false,target='food',carId='car_01';
  let car={x:0,z:18,yaw:Math.PI,speed:0,steer:0},keys={},listeners=[],routeLine,routeLights=[],storeBtn,gpsEl,wheelEl,petEl,speedEl,radioEl;
  let steerCtl=0,padThr=false,padBr=false,gearR=false,kBack=false,dSpeed=0,dSteer=0,dVelX=0,dVelZ=0,dCamYaw=0,dRoll=0,dRollV=0,dPitch=0,dPitchV=0,dHeave=0,dHeaveV=0,carRevBeepAt=0,collisionAt=0,collisionBounceUntil=0;
  let steerHitEl,steerKnobEl,throttleEl,brakeEl,gearDEl,gearREl,hornEl,turnEl,turnDotEl;
  let dashEl,dashImgEl,gaugeEl,gaugeCtx,radioListEl,radioVizEl,radioVizCtx;
  let engineEl,beltEl,goEl,startEl,lawEl,camEl,seatEl,warningEl,carMesh;
  let cam3=false,seatLevel=0;
  let carEngineOn=false,carBelted=false,carStartOpen=true,carOverSpeed=false;
  let turnSig=0,turnAt=0,turnYawOn=0,turnReturnAt=0,turnClickPhase=-1;
  let solidRects=[],solidCircles=[];
  const disposables=[];
  const C={food:0x81b89a,fashion:0xd694be,road:0x59636b,walk:0xe9d8bf};
  /* ============================================================
     🚗🏙️ รอบ 1168 — ระบบขับรถเมืองกำแพงเพชร + collision เด้งออก/ขอบถนนที่มองเห็น
     Source of truth: js/adventure3d.js โซน 🚗 โหมด drive (KPP), ไม่ใช่บ้านโพธิ์สวัสดิ์
     ยกมาทั้ง physics, cockpit, gauges, camera, start/belt, D/R,
     turn signal, radio/equalizer และเสียง; GPS ยังเป็น Pet Shopping เดิมเท่านั้น
     ============================================================ */
  const CAR_ACCEL=11,CAR_BRAKE=15,CAR_VMAX=55.6,CAR_VMAX_OFF=7,CAR_VREV=6.5,CAR_WB=2.6,CAR_STEER_MAX=.52;
  const CAR_EYE=1.55,CAR_LEGAL_KMH=90;
  const CAR_ROLL_MAX=.035,CAR_ROLL_GAIN=.0024,CAR_ROLL_SPRING=36,CAR_ROLL_DAMP=14;
  const WORLD_HALF=700,DRIVE_LIMIT=480;
  const RADIO_RECT=[560,514,835,606];
  const ROUTE_LIGHT_COUNT=18,ROUTE_LIGHT_SPEED=22,ROUTE_LIGHT_WIDTH=0.86,ROUTE_LIGHT_PULSE=0.24;
  const ROUTE_LIGHT_HEIGHT=.36,ROUTE_LIGHT_GAP_MIN=1.9;
  const NIGHT_POLL_MS=30000,DAY_START=6,DAY_END=19;
  let routePath=[],routeLength=0,routePulse=0,routePulseAt=0,routePulseMat=null,routeGlowMat=null,isNight=false,envWatchId=null;
  let dayAmbient,daySun,dayFill,nightAmbient,nightFill,nightPoint,nightPulseAmbient;
  let headTargets=[];
  let carHeadlights=[],shopSpotLights=[];
  const CAR_RADIO_RECT={car_01:[622,378,889,505],car_02:[585,518,821,652],car_03:[555,524,787,645],car_04:[506,471,789,591],car_05:[512,543,749,669],car_06:[550,500,788,606],car_07:[563,580,782,685],car_08:[528,598,710,700],car_09:[550,501,786,592],car_10:[521,520,808,669]};
  const radioBars=new Float32Array(32),radioPeaks=new Float32Array(32);
  function pointSegmentDistSq(px,pz,a,b){
    const vx=b.x-a.x,vz=b.z-a.z;
    const wx=px-a.x,wz=pz-a.z;
    const len2=vx*vx+vz*vz;
    const t=len2?Math.max(0,Math.min(1,(wx*vx+wz*vz)/len2)):0;
    const dx=px-(a.x+vx*t),dz=pz-(a.z+vz*t);
    return dx*dx+dz*dz;
  }
  function onGuideRoad(x,z,kind=target){
    const pts=routeFor(ROAD_ANCHOR,kind);
    const half=(z>=SHOP_TURN_Z-SIDE_ENTRANCE_GAP_LEAD && z<=SHOP_TURN_Z+SIDE_ENTRANCE_GAP_TAIL)?ROAD_ENTRANCE_CORRIDOR_HALF:ROAD_CORRIDOR_HALF;
    const w2=half*half;
    for(let i=1;i<pts.length;i++){
      if(pointSegmentDistSq(x,z,pts[i-1],pts[i])<=w2)return true;
    }
    return false;
  }
  function onRoad(x,z){return Math.abs(x)<=ROAD_HALF_X||Math.abs(z-ROAD_CENTER_Z)<=ROAD_HALF_Z||onGuideRoad(x,z);}
  function keepCarOnRoad(now=0){if(onRoad(car.x,car.z))return false;const dx=Math.abs(car.x)-ROAD_HALF_X,dz=Math.abs(car.z-ROAD_CENTER_Z)-ROAD_HALF_Z;let nx=0,nz=0;if(dx<=dz){const side=Math.sign(car.x)||1;car.x=side*(ROAD_HALF_X-.28);nx=-side;}else{const side=Math.sign(car.z-ROAD_CENTER_Z)||1;car.z=ROAD_CENTER_Z+side*(ROAD_HALF_Z-.28);nz=-side;}bounceCar(nx,nz,Math.hypot(dVelX,dVelZ),now);car.speed=Math.abs(dSpeed);return true;}
  const CarSnd={ctx:null,master:null,osc:null,osc2:null,gain:null,lp:null,on:false,rpm:0,skidGain:null,skidBp:null,
    ac(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;this.ctx=new A();this.master=this.ctx.createGain();this.master.gain.value=1;this.master.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},
    start(){if(this.on)return;try{const c=this.ac();if(!c)return;this.gain=c.createGain();this.gain.gain.value=0;this.lp=c.createBiquadFilter();this.lp.type='lowpass';this.lp.frequency.value=520;this.osc=c.createOscillator();this.osc.type='sawtooth';this.osc.frequency.value=55;this.osc2=c.createOscillator();this.osc2.type='square';this.osc2.frequency.value=28;const g2=c.createGain();g2.gain.value=.5;this.osc.connect(this.lp);this.osc2.connect(g2);g2.connect(this.lp);this.lp.connect(this.gain);this.gain.connect(this.master);this.osc.start();this.osc2.start();this.on=true;this.rpm=0;}catch(e){}},
    ignite(){try{const c=this.ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(72,t);lfo.frequency.value=11;lg.gain.value=26;lfo.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(.07,t);g.gain.setValueAtTime(.07,t+.62);g.gain.exponentialRampToValueAtTime(.001,t+.8);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.85);lfo.start(t);lfo.stop(t+.85);setTimeout(()=>{this.start();if(this.on)this.rpm=.95;},680);}catch(e){}},
    update(th,sp,dt){if(!this.on)return;const mute=(typeof state!=='undefined'&&state.sound===false)||!running;if(this.master)this.master.gain.setTargetAtTime(mute?0:1,this.ctx.currentTime,.08);const tgt=.18+Math.min(1,sp/CAR_VMAX)*.72+(th>0?.14:0);this.rpm+=(tgt-this.rpm)*Math.min(1,dt*3);this.osc.frequency.value=48+this.rpm*175;this.osc2.frequency.value=24+this.rpm*88;this.lp.frequency.value=360+this.rpm*950;this.gain.gain.value=.03+this.rpm*.05;},
    skidStart(){if(this.skidGain||!this.ctx)return;try{const c=this.ctx,nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const src=c.createBufferSource();src.buffer=nb;src.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1650;bp.Q.value=5.5;const g=c.createGain();g.gain.value=0;src.connect(bp);bp.connect(g);g.connect(this.master);src.start();this.skidGain=g;this.skidBp=bp;}catch(e){}},
    setSkid(amt){if(typeof state!=='undefined'&&state.sound===false){if(this.skidGain)this.skidGain.gain.value=0;return;}if(!this.ctx)return;if(!this.skidGain)this.skidStart();if(!this.skidGain)return;const a=Math.max(0,Math.min(1,amt)),tgt=a*a*.13,g=this.skidGain.gain;g.value+=(tgt-g.value)*.35;if(this.skidBp)this.skidBp.frequency.value=1350+a*900;},
    tone(freq,dur=.2,vol=.055,type='square'){try{const c=this.ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.02);}catch(e){}},
    revBeep(){this.tone(1000,.2,.055);},horn(){this.tone(440,.42,.09);this.tone(554,.42,.09);},
    thud(){this.tone(86,.3,.18,'sine');},
    tlClick(hi){this.tone(hi?1480:960,.05,.07);this.tone(hi?420:300,.07,.05,'sine');},
    beltClick(){try{const c=this.ac();if(!c)return;const t=c.currentTime,n=c.createBufferSource(),nb=c.createBuffer(1,c.sampleRate*.22,c.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=nb;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2600;const ng=c.createGain();ng.gain.value=.06;n.connect(bp);bp.connect(ng);ng.connect(this.master);n.start(t);[[.24,2000],[.32,1150]].forEach(([dt0,f])=>{const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime(.14,t+dt0);g.gain.exponentialRampToValueAtTime(.001,t+dt0+.05);o.connect(g);g.connect(this.master);o.start(t+dt0);o.stop(t+dt0+.07);});}catch(e){}},
    stop(){if(this.skidGain)this.skidGain.gain.value=0;if(this.master&&this.ctx)this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.05);}
  };
  function sndKick(){CarSnd.ac();}
  function syncGearUi(){if(!gearDEl||!gearREl)return;gearDEl.classList.toggle('on',!gearR);gearREl.classList.toggle('on',gearR);throttleEl&&throttleEl.classList.toggle('rev',gearR);const lb=throttleEl&&throttleEl.querySelector('small');if(lb)lb.textContent=gearR?'ถอย':'เร่ง';}
  function setGear(rev){if(gearR===rev)return;gearR=rev;syncGearUi();if(typeof sfx!=='undefined'&&sfx.select)sfx.select();}
  function mat(color,opt={}){const m=new THREE.MeshStandardMaterial({color,roughness:opt.roughness??.7,metalness:opt.metalness??.05,transparent:!!opt.transparent,opacity:opt.opacity??1});disposables.push(m);return m;}
  function mesh(g,m,x,y,z,parent=scene){const q=new THREE.Mesh(g,m);q.position.set(x,y,z);parent.add(q);disposables.push(g);return q;}
  function box(x,y,z,w,h,d,m,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);}
  function solidRect(x,z,w,d,pad=.75){solidRects.push({x,z,hw:w/2+pad,hd:d/2+pad});}
  function solidCircle(x,z,r){solidCircles.push({x,z,r:r+1.15});}
  function hitsSolid(x,z){for(const b of solidRects)if(Math.abs(x-b.x)<=b.hw&&Math.abs(z-b.z)<=b.hd)return true;for(const c of solidCircles){const dx=x-c.x,dz=z-c.z;if(dx*dx+dz*dz<=c.r*c.r)return true;}return false;}
  function solidContact(x,z){let best=null;for(const b of solidRects){const ox=b.hw-Math.abs(x-b.x),oz=b.hd-Math.abs(z-b.z);if(ox>=0&&oz>=0){const hit=ox<oz?{nx:(Math.sign(x-b.x)||1),nz:0,depth:ox}:{nx:0,nz:(Math.sign(z-b.z)||1),depth:oz};if(!best||hit.depth<best.depth)best=hit;}}for(const c of solidCircles){const dx=x-c.x,dz=z-c.z,dist=Math.hypot(dx,dz);if(dist<=c.r){const inv=dist>.001?1/dist:0,hit={nx:inv?dx*inv:-(Math.sin(car.yaw)||1),nz:inv?dz*inv:-Math.cos(car.yaw),depth:c.r-dist};if(!best||hit.depth<best.depth)best=hit;}}return best;}
  function bounceCar(nx,nz,hitSpd,now){const bounce=Math.min(2.4,Math.max(.65,hitSpd*.2)),along=Math.sin(car.yaw)*nx+Math.cos(car.yaw)*nz;dVelX=nx*bounce;dVelZ=nz*bounce;dSpeed=bounce*along;dSteer*=.3;collisionBounceUntil=Math.max(collisionBounceUntil,now+320);}
  function resolveSolidCollision(hitSpd,now){let hit=solidContact(car.x,car.z),normal=hit&&{nx:hit.nx,nz:hit.nz};for(let i=0;hit&&i<3;i++){car.x+=hit.nx*(hit.depth+.22);car.z+=hit.nz*(hit.depth+.22);hit=solidContact(car.x,car.z);}if(!normal)return false;bounceCar(normal.nx,normal.nz,hitSpd,now);return true;}
  function loadTexture(url,onReady){
    const owner=scene,finish=tex=>{if(scene!==owner||!root){if(tex.image&&tex.image.close)tex.image.close();tex.dispose();return;}tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;disposables.push(tex);onReady(tex);};
    if(typeof fetch==='function'&&typeof createImageBitmap==='function')fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.blob();}).then(createImageBitmap).then(bm=>finish(new THREE.Texture(bm))).catch(()=>new THREE.TextureLoader().load(url,finish,undefined,()=>{}));
    else new THREE.TextureLoader().load(url,finish,undefined,()=>{});
  }
  function listen(el,type,fn,opt){el.addEventListener(type,fn,opt);listeners.push(()=>el.removeEventListener(type,fn,opt));}
  function isNightNow(){const h=(new Date()).getHours();return h<DAY_START||h>=DAY_END;}
  function routeFor(start,kind){
    const p=STORE_POS[kind]||STORE_POS.food;
    return [
      {x:start.x,z:start.z},
      {x:0,z:ROAD_CENTER_Z},
      {x:0,z:SHOP_TURN_Z},
      {x:p.x,z:SHOP_TURN_Z},
      {x:p.x,z:STORE_STOP_Z}
    ];
  }
  /* ============================================================
     💠💡 รอบ 1169 — แถบนำทางกว้าง + ไฟวิ่งจากรถสู่จุดหมาย
     ============================================================ */
  function clearRouteVisual(){
    if(!routeLine)return;
    scene.remove(routeLine);
    routeLine.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
    routeLine=null;
    routeLights=[];
  }
  function normalizeRouteDist(d){
    if(!routeLength)return 0;
    const m=routeLength;
    d%=m;
    if(d<0)d+=m;
    return d;
  }
  function routeSampleAt(pts,d,out){
    if(!pts||!pts.length)return {x:0,z:0,tX:0,tZ:1};
    const dist=normalizeRouteDist(d);
    let remain=dist;
    for(let i=1;i<pts.length;i++){
      const a=pts[i-1],b=pts[i],seg=Math.hypot(b.x-a.x,b.z-a.z);
      if(remain<=seg){
        const q=seg?remain/seg:0;
        out.x=a.x+(b.x-a.x)*q;
        out.z=a.z+(b.z-a.z)*q;
        out.tX=seg?((b.x-a.x)/seg):0;
        out.tZ=seg?((b.z-a.z)/seg):1;
        return out;
      }
      remain-=seg;
    }
    const last=pts[pts.length-1],prev=pts[pts.length-2];
    out.x=last.x;
    out.z=last.z;
    out.tX=last.x-prev.x;
    out.tZ=last.z-prev.z;
    return out;
  }
  function tickRouteLights(t){
    if(!routeLights.length||!routeLength)return;
    const now=t/1000,dt=Math.max(0,now-routePulseAt);
    routePulseAt=now;
    const nightSpeed=isNight?ROUTE_LIGHT_SPEED*2.7:ROUTE_LIGHT_SPEED*0.2;
    routePulse=normalizeRouteDist(routePulse+dt*nightSpeed);
    const wave=routeLength*ROUTE_LIGHT_PULSE;
    const pA={x:0,z:0,tX:0,tZ:1};
    routeLights.forEach((node,idx)=>{
      const baseS=node.s;
      const lead=1-Math.min(1,normalizeRouteDist(routePulse-baseS)/(wave||1));
      const show=normalizeRouteDist(baseS+routePulse);
      const q=routeSampleAt(routePath,show,pA);
      const dir=Math.atan2(q.tX,q.tZ);
      node.group.position.set(q.x,ROUTE_LIGHT_HEIGHT+lead*.09*Math.sin(now*6+idx*.4),q.z);
      node.group.rotation.set(-Math.PI/2,dir,0);
      if(isNight){
        const glow=Math.max(0,Math.min(1,lead*1.6));
        node.core.material.opacity=0.22+glow*0.7;
        node.shell.material.opacity=0.14+glow*0.42;
        node.group.scale.setScalar(0.52+glow*0.82);
      }else{
        node.core.material.opacity=0.18;
        node.shell.material.opacity=0.08;
        node.group.scale.setScalar(0.45);
      }
    });
    if(routeLength>0){
      const tone=Math.min(1,routePulse/routeLength);
      if(nightPulseAmbient){
        nightPulseAmbient.intensity=isNight?(0.36+tone*0.16):0;
      }
    }
  }
  function rebuildRoute(){
    clearRouteVisual();
    routeLine=new THREE.Group();
    const raw=routeFor(car,target),bandMat=new THREE.MeshBasicMaterial({color:0x17d9ff,transparent:true,opacity:.48,depthWrite:false,side:THREE.DoubleSide});
    routePath=raw;
    routeLength=0;
    for(let i=1;i<raw.length;i++){const a=raw[i-1],b=raw[i];routeLength+=Math.hypot(b.x-a.x,b.z-a.z);}
    if(!routeLength) {routeLength=1;}
    for(let i=1;i<raw.length;i++){
      const a=raw[i-1],b=raw[i],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
      if(len<.2)continue;
      const g=new THREE.BoxGeometry(2.6,.055,len),m=new THREE.Mesh(g,bandMat);
      m.position.set((a.x+b.x)/2,.245,(a.z+b.z)/2);
      m.rotation.y=Math.atan2(dx,dz);
      m.renderOrder=1;
      routeLine.add(m);
    }
    const pts=raw.map(p=>new THREE.Vector3(p.x,.31,p.z)),
          lineGeo=new THREE.BufferGeometry().setFromPoints(pts),
          lineMat=new THREE.LineBasicMaterial({color:0xc8f8ff,transparent:true,opacity:.95});
    routeLine.add(new THREE.Line(lineGeo,lineMat));
    const outer=new THREE.BoxGeometry(ROUTE_LIGHT_WIDTH,.1,ROUTE_LIGHT_WIDTH*0.28);
    const inner=new THREE.BoxGeometry(ROUTE_LIGHT_WIDTH*.64,.12,ROUTE_LIGHT_WIDTH*.22);
    routePulseMat=new THREE.MeshBasicMaterial({color:0x5cf4ff,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide});
    routeGlowMat=new THREE.MeshBasicMaterial({color:0x9cf3ff,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide});
    const gap=routeLength/ROUTE_LIGHT_COUNT;
    for(let i=0;i<ROUTE_LIGHT_COUNT;i++){
      const seed=i*gap;
      const mark=routeSampleAt(raw,seed,{x:0,z:0,tX:0,tZ:1});
      const node=new THREE.Group();
      const core=new THREE.Mesh(outer,routePulseMat);
      const shell=new THREE.Mesh(inner,routeGlowMat);
      core.rotation.x=-Math.PI/2;
      shell.rotation.x=-Math.PI/2;
      node.add(core);
      node.add(shell);
      node.position.set(mark.x,ROUTE_LIGHT_HEIGHT,mark.z);
      node.renderOrder=2;
      node.rotation.y=Math.atan2(mark.tX,mark.tZ);
      node.userData={routeS:seed};
      routeLine.add(node);
      routeLights.push({group:node,core,shell,s:seed});
    }
    scene.add(routeLine);
    if(!routePulseAt)routePulseAt=(performance.now()/1000);
    routePulse=0;
  }
  function addRoad(){
    const road=mat(C.road),walk=mat(C.walk),line=mat(0xffe8a8),grass=mat(0x9bcf8e);
    box(0,-.18,-55,WORLD_HALF*2,.3,WORLD_HALF*2,grass);box(0,.01,-55,30,.18,WORLD_HALF*2,road);box(0,.02,-55,WORLD_HALF*2,.19,26,road);
    box(-18,.05,-55,6,.2,WORLD_HALF*2,walk);box(18,.05,-55,6,.2,WORLD_HALF*2,walk);box(0,.12,-55,.35,.05,WORLD_HALF*2,line);
    for(let z=WORLD_HALF-55;z>-WORLD_HALF-55;z-=14){box(-7,.13,z,.35,.04,7,line);box(7,.13,z,.35,.04,7,line);}
    for(let x=-WORLD_HALF;x<=WORLD_HALF;x+=14)box(x,.13,-55,7,.04,.32,line);
    addRoadBarriers();
  }
  function addRoadBarriers(){
    const steel=mat(0xb7c2c8,{metalness:.72,roughness:.28}),shadow=mat(0x35434a,{metalness:.5,roughness:.42}),amber=mat(0xff8a00,{metalness:.18,roughness:.3}),cream=mat(0xfff4d6);
    const sideGapStart=SHOP_TURN_Z-SIDE_ENTRANCE_GAP_LEAD;
    const sideGapEnd=SHOP_TURN_Z+SIDE_ENTRANCE_GAP_TAIL;
    const addRail=(x,z,w,d)=>rails.push({x,z,w,d});
    const splitSideRail=(x,w,d,center,gapA,gapB)=>{
      const half=d/2;
      const s=center-half;
      const e=center+half;
      const g1=Math.max(s,gapA);
      const g2=Math.min(e,gapB);
      if(g1<=s && g2>=e){return;}
      if(g1> s)addRail(x,(s+g1)/2,w,g1-s);
      if(g2< e)addRail(x,(g2+e)/2,w,e-g2);
    };
    const rails=[];
    addRail(-15,193,.34,464);
    addRail(15,193,.34,464);
    splitSideRail(-15,.34,464,-303,sideGapStart,sideGapEnd);
    splitSideRail(15,.34,464,-303,sideGapStart,sideGapEnd);
    addRail(-249,-69,462,.34);
    addRail(-249,-41,462,.34);
    addRail(249,-69,462,.34);
    addRail(249,-41,462,.34);
    rails.forEach(r=>{box(r.x,.8,r.z,r.w,.28,r.d,steel);box(r.x,.35,r.z,r.w,.18,r.d,shadow);});
    const postGeo=new THREE.BoxGeometry(.42,1.35,.42),posts=[];
    rails.forEach(r=>{const vertical=r.d>r.w,len=vertical?r.d:r.w,n=Math.floor(len/16);for(let i=0;i<=n;i++){const v=-len/2+i*len/n;posts.push({x:r.x+(vertical?0:v),z:r.z+(vertical?v:0)});}});
    const inst=new THREE.InstancedMesh(postGeo,shadow,posts.length),dummy=new THREE.Object3D();posts.forEach((p,i)=>{dummy.position.set(p.x,.67,p.z);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});inst.instanceMatrix.needsUpdate=true;scene.add(inst);disposables.push(postGeo);
    function closedSign(x,z,rot){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);box(-4.6,1.25,0,.24,2.5,.24,shadow,g);box(4.6,1.25,0,.24,2.5,.24,shadow,g);for(let i=-4;i<=4;i++)box(i,1.55,0,.92,.72,.28,i%2?amber:cream,g);const cv=document.createElement('canvas');cv.width=512;cv.height=160;const c=cv.getContext('2d');c.fillStyle='#18252b';c.fillRect(0,0,512,160);c.strokeStyle='#ff8a00';c.lineWidth=14;c.strokeRect(7,7,498,146);c.fillStyle='#fff';c.textAlign='center';c.font='900 52px sans-serif';c.fillText('ROAD CLOSED',256,64);c.fillStyle='#ffc168';c.font='900 48px sans-serif';c.fillText('ห้ามผ่าน',256,126);const tx=new THREE.CanvasTexture(cv),sm=new THREE.MeshBasicMaterial({map:tx});disposables.push(tx,sm);box(0,2.65,0,5.8,1.8,.2,sm,g);}
    closedSign(0,424,0);closedSign(0,-534,0);closedSign(-479,-55,Math.PI/2);closedSign(479,-55,Math.PI/2);
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
  function buildFoodShop(group,p){
    const bowl=mat(0x8f6a40),grain=mat(0xffe2c1),bone=mat(0xe7f3ff),bag=mat(0xf7b45f);
    mesh(new THREE.CylinderGeometry(1.8,1.2,.9,14),bowl,0,4.8,-4.75,group);
    mesh(new THREE.ConeGeometry(1.6,1.2,18),grain,0,4.95,-5.1,group);
    mesh(new THREE.TorusGeometry(1.4,.2,12,20),mat(0xffdf9e),0,4.8,-5.15,group);
    mesh(new THREE.CylinderGeometry(.32,.32,2.5,12),bone,0,5.2,-4,group);
    mesh(new THREE.SphereGeometry(.4,12,8),bone,-1.2,5.1,-4.1,group);
    mesh(new THREE.SphereGeometry(.4,12,8),bone,1.2,5.1,-4.1,group);
    for(let i=0;i<4;i++){
      const x=-1.2+i*0.95;
      box(x,2.7,-6.1,0.7,.22,.12,bag,group);
      box(x,2.2,-5.95,1.2,.18,.11,mat(0xfff2d0),group);
    }
    for(let i=0;i<4;i++){
      const x=-4.8+i*2.8;
      mesh(new THREE.BoxGeometry(2.1,0.95,1.05),bag,x,2.45,-6.6,group);
      mesh(new THREE.BoxGeometry(1.95,0.9,0.16),mat(0xfff1dd),x+0.1,3.35,-6.6,group);
      for(let j=0;j<2;j++)box(x-0.32+j*0.64,3.55,-6.58,0.26,0.15,0.18,mat(0x4a3424),group);
    }
  }
  function buildFashionShop(group,p){
    const ribbon=mat(0xff8fc4),cloth=mat(0xc5eef9),sat=mat(0x5b4a67);
    for(const x of [-5,5]){box(x,1.2,3,0.2,4.4,5.6,mat(0x2f3338),group);}
    for(let i=0;i<4;i++){
      const z=-3.9+i*1.8;
      box(0,4.25,z,7.5,1.05,0.18,cloth,group);
      box(0,5.35,z,7.9,0.2,0.18,mat(0xfff6ef),group);
      if(i%2===0){box(-2.6,3.15,z,2.2,2.2,0.16,sat,group);box(2.6,3.15,z,2.2,2.2,0.16,sat,group);}
    }
    for(const x of [-2,2]){box(x,2.7,-2.4,3.1,1.3,0.16,ribbon,group);box(x,2.8,2.7,2.5,1.8,0.2,mat(0xfff5df),group);}
    mesh(new THREE.TorusGeometry(1.1,.17,10,16),ribbon,0,4.45,6.0,group);
    mesh(new THREE.TorusGeometry(1.75,.35,8,18),mat(0xffd4f0),-2.9,2.2,6.2,group);
    mesh(new THREE.ConeGeometry(.9,1.1,14),mat(0xfff7c4),2.9,1.85,5.95,group);
    const lens=mat(0x6b8cff,{transparent:true,opacity:.78});
    mesh(new THREE.TorusGeometry(.62,.14,10,16),mat(0x262e3d),3,2.33,6.6,group);
    mesh(new THREE.TorusGeometry(.62,.14,10,16),mat(0x262e3d),4,2.15,6.22,group);
    mesh(new THREE.BoxGeometry(0.9,.4,.06),lens,3.45,2.33,6.6,group);
    mesh(new THREE.BoxGeometry(0.9,.4,.06),lens,4.02,2.15,6.22,group);
    mesh(new THREE.SphereGeometry(.58,10,8),mat(0xff8ec7),1.55,2.35,5.9,group);
  }
  function addCuteShop(kind){
    const p=STORE_POS[kind],accent=mat(C[kind]),stone=mat(kind==='food'?0xf7f3e8:0xfff0f8),dark=mat(0x2f3c45),glass=mat(0xbce7ed,{transparent:true,opacity:.34,roughness:.15}),wood=mat(0xa87955),gold=mat(0xc9a45c,{metalness:.55,roughness:.3});
    const group=new THREE.Group();
    group.position.set(p.x,0,p.z);
    group.rotation.y=Math.PI;
    scene.add(group);
    solidRect(p.x,p.z,26,18,1.25);
    box(0,.22,0,26,.4,18,dark,group);
    box(0,4,0,24.5,7.8,12,stone,group);
    box(0,8.3,-5.75,24.8,2.0,1.2,kind==='food'?accent:gold,group);
    mesh(new THREE.CylinderGeometry(10.9,10.9,.95,16),mat(kind==='food'?0xd8f7ea:0xffd8ed),0,6.1,-6.2,group);
    for(const x of [-6.9,6.9])for(let y=1.8;y<7;y+=1.65)box(x,y,-1.1,1.1,.2,8.1,wood,group);
    for(const x of [-4.4,4.4])box(x,1.05,2.6,2.7,2,5.8,wood,group);
    if(kind==='food')buildFoodShop(group,p);else buildFashionShop(group,p);
    const sign=document.createElement('canvas');sign.width=512;sign.height=128;
    const c=sign.getContext('2d');const head=kind==='food'?['#3a9a80','#7fcfda']:['#8d3b7d','#f5b0ff'];
    const grad=c.createLinearGradient(0,0,512,128);grad.addColorStop(0,head[0]);grad.addColorStop(1,head[1]);c.fillStyle=grad;c.fillRect(0,0,512,128);
    c.fillStyle='#fff6d4';c.textAlign='center';c.font='bold 44px sans-serif';c.fillText(kind==='food'?'PAWS & PANTRY':'MAISON DE PAWS',256,76);
    const tx=new THREE.CanvasTexture(sign),sm=new THREE.MeshBasicMaterial({map:tx});
    disposables.push(tx,sm);
    box(0,10.55,-6.6,13.8,2.7,.12,sm,group);
    facadeTexture(kind);
    const spotCol=kind==='food'?0xffd08f:0xfed2fa;
    for(let i=0;i<2;i++){const sx=i===0?-0.62:0.62;const light=new THREE.SpotLight(spotCol,0.58,26,Math.PI/2.7,0.45,0.78);light.position.set(sx,7.55,3.55);const t=new THREE.Object3D();t.position.set(sx,1.8,7.2);light.target=t;scene.add(t);group.add(light,t);shopSpotLights.push(light);}
  }
  function decorateTown(rows){
    loadTexture('img/pet-shopping/cute_town_mural_v2.webp',tex=>{tex.anisotropy=Math.min(4,renderer&&renderer.capabilities?renderer.capabilities.getMaxAnisotropy():1);const mural=new THREE.MeshBasicMaterial({map:tex}),frame=mat(0xffefd0),awnings=[mat(0xff8f78),mat(0x55c9bd),mat(0xf3c957),mat(0xb69adc)];disposables.push(mural);rows.forEach(({x,z,h},i)=>{const fy=Math.min(h-2.5,5),awning=awnings[i%awnings.length];[-1,1].forEach(face=>{const fz=z+face*6.07;box(x,fy,fz,8,4.2,.13,mural);box(x,fy+2.25,fz,8.5,.28,.22,frame);box(x,fy-2.25,fz,8.5,.28,.22,frame);box(x,fy+2.45,z+face*6.45,9,.35,1.05,awning);});});Object.values(STORE_POS).forEach(p=>[-8.2,8.2].forEach(dx=>{box(p.x+dx,5.1,p.z+6.22,5.6,6.7,.16,mural);box(p.x+dx,8.58,p.z+6.25,6.1,.3,.24,frame);box(p.x+dx,1.62,p.z+6.25,6.1,.3,.24,frame);}));});
  }
  function addTown(){
    const colors=[0xf0c8ae,0xa7cfd4,0xd8c2e5,0xf0dda9],roof=mat(0x6f6564),rows=[];
    const nearShopArea=(z)=>Math.abs(z-SHOP_CENTER_Z)<=SHOP_CLEAR_RADIUS+2;
    for(let i=0;i<54;i++){const side=i%2?-1:1,x=side*(35+(i%3)*12),z=250-Math.floor(i/2)*29;if(nearShopArea(z))continue;const h=8+(i%4)*2,wall=mat(colors[i%colors.length]);box(x,h/2,z,13,h,12,wall);box(x,h+.4,z,14,.8,13,roof);solidRect(x,z,13,12);rows.push({x,z,side,h});for(let y=3;y<h;y+=3)for(const dx of [-3,3])box(x+dx,y,z-side*6.05,2,1.5,.15,mat(0xfff1b8));}
    for(let z=245;z>-540;z-=20){if(!nearShopArea(z)) {addTree(-23,z);addTree(23,z);}}
    decorateTown(rows);addCuteShop('food');addCuteShop('fashion');
  }
  function applyEnv(nightNow=isNightNow()){
    if(!scene||!dayAmbient)return;
    isNight=!!nightNow;
    scene.background.setHex(isNight?NIGHT_SKY:DAY_SKY);
    scene.fog.color.setHex(isNight?NIGHT_FOG:DAY_FOG);
    scene.fog.near=isNight?95:85;
    scene.fog.far=isNight?240:220;
    dayAmbient.intensity=isNight?0:1.05;
    daySun.intensity=isNight?0:1.25;
    dayFill.intensity=isNight?0:0.9;
    nightAmbient.intensity=isNight?0.3:0;
    nightFill.intensity=isNight?1.15:0;
    nightPoint.intensity=isNight?0.55:0;
    nightPulseAmbient.intensity=isNight?0.2:0;
    if(shopSpotLights.length){
      shopSpotLights.forEach((light)=>{light.intensity=isNight?0.58:0;});
    }
    updateHeadlights();
    if(root)root.classList.toggle('night-mode',isNight);
  }
  function setupLighting(){
    dayAmbient=new THREE.HemisphereLight(DAY_AMBIENT,0x55745c,1.08);
    daySun=new THREE.DirectionalLight(0xffe7bd,1.25);
    daySun.position.set(-30,50,20);
    dayFill=new THREE.DirectionalLight(0xb7cbda,0.56);
    dayFill.position.set(24,36,-40);
    nightAmbient=new THREE.AmbientLight(NIGHT_AMBIENT,0.34);
    nightFill=new THREE.DirectionalLight(NIGHT_FILL,0.9);
    nightFill.position.set(-14,18,18);
    nightFill.target.position.set(0,-3,0);
    scene.add(dayAmbient,daySun,dayFill,nightAmbient,nightFill,nightFill.target);
    nightFill.visible=true;
    nightPoint=new THREE.PointLight(NIGHT_PULSE,0.4,85,1.72);
    nightPoint.position.set(0,12,SHOP_CENTER_Z);
    nightPoint.castShadow=false;
    scene.add(nightPoint);
    nightPulseAmbient=new THREE.PointLight(NIGHT_PULSE,0.14,190,1.8);
    nightPulseAmbient.position.set(0,16,ROAD_CENTER_Z);
    scene.add(nightPulseAmbient);
    setupHeadlights();
    dayAmbient.visible=true;
    daySun.visible=true;
    dayFill.visible=true;
  }
  function setupHeadlights(){
    if(carHeadlights.length) return;
    const mk=(i)=>{
      const l=new THREE.SpotLight(0xfff8cb,0,56,Math.PI/4,0.45,0.75);
      const t=new THREE.Object3D();
      l.target=t;
      l.castShadow=false;
      l.visible=false;
      return {light:l,target:t,side:i?1:-1};
    };
    const left=mk(-1),right=mk(1);
    left.light.distance=42;
    right.light.distance=42;
    scene.add(left.light,left.target,right.light,right.target);
    carHeadlights=[left,right];
    headTargets=[left.target,right.target];
  }
  function updateHeadlights(){
    if(!carHeadlights.length)return;
    const fX=Math.sin(car.yaw),fZ=Math.cos(car.yaw);
    const rX=Math.cos(car.yaw),rZ=-Math.sin(car.yaw);
    carHeadlights.forEach((entry,idx)=>{
      const side=idx===0?-1:1;
      const light=entry.light;
      const target=headTargets[idx];
      const hx=car.x + rX*(0.58*side) + fX*0.9;
      const hz=car.z + rZ*(0.58*side) + fZ*0.9;
      const tx=car.x + fX*28 + rX*side*0.26;
      const tz=car.z + fZ*28 + rZ*side*0.26;
      light.visible=isNight;
      light.intensity=isNight?1.45:0;
      light.position.set(hx,1.05,hz);
      if(target){
        target.position.set(tx,0.7,tz);
      }
    });
  }
  function buildScene(){
    solidRects=[];solidCircles=[];collisionBounceUntil=0;
    scene=new THREE.Scene();scene.background=new THREE.Color(0xbfe5ef);scene.fog=new THREE.Fog(0xbfe5ef,85,220);
    camera=new THREE.PerspectiveCamera(66,innerWidth/innerHeight,.1,300);
    renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    renderer.setSize(innerWidth,innerHeight);
    renderer.shadowMap.enabled=false;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.08;
    root.prepend(renderer.domElement);
    setupLighting();
    addRoad();
    addTown();
    rebuildRoute();
    applyEnv();
    if(envWatchId) clearInterval(envWatchId);
    envWatchId=setInterval(()=>applyEnv(),NIGHT_POLL_MS);
  }
  /* 🚗🏙️ Cockpit/controls below are direct adapters of KPP drive functions:
     loadCarDash/loadCarWheel, drawCarGauges, radio, start/belt and turn signal. */
  function tryImage(sources,onDone){let i=0;const next=()=>{if(i>=sources.length)return onDone(null);const im=new Image();im.onload=()=>onDone(im);im.onerror=next;im.src=sources[i++];};next();}
  function loadCarCockpit(){
    const num=carId.replace('car_','');
    tryImage([`img/3d_car/3d_dash_${carId}.png?v=1168`,`img/car/dash_${carId}.png`,'img/car/dash.png'],im=>{if(!dashEl)return;dashEl.innerHTML='';if(im){dashEl.appendChild(im);dashImgEl=im;}else{dashEl.innerHTML='<div class="ps3-dash-css"></div>';dashImgEl=null;}radioLayout();});
    tryImage([`img/3d_car/3d_wheel_${num}.png`,'img/car/wheel.png'],im=>{if(!wheelEl)return;wheelEl.innerHTML='';if(im)wheelEl.appendChild(im);else wheelEl.innerHTML='<div class="ps3-wheel-css"></div>';});
  }
  function carDial(c,cx,cy,r,frac,max,step,redFrom){const a0=Math.PI*.75,sweep=Math.PI*1.5;c.save();c.translate(cx,cy);c.fillStyle='rgba(9,12,17,.86)';c.beginPath();c.arc(0,0,r*1.05,0,7);c.fill();c.lineWidth=Math.max(2,r*.06);c.strokeStyle='rgba(150,160,176,.85)';c.stroke();c.fillStyle='#e5e9ef';c.strokeStyle='#edf1f6';c.font=`700 ${Math.max(7,r*.17)}px sans-serif`;c.textAlign='center';c.textBaseline='middle';const n=Math.round(max/step);for(let i=0;i<=n;i++){const a=a0+sweep*i/n,co=Math.cos(a),si=Math.sin(a);c.beginPath();c.moveTo(co*r*.88,si*r*.88);c.lineTo(co*r*.74,si*r*.74);c.stroke();c.fillText(String(i*step),co*r*.56,si*r*.56);}if(redFrom!=null){c.strokeStyle='#ff4038';c.lineWidth=Math.max(2,r*.055);c.beginPath();c.arc(0,0,r*.81,a0+sweep*(redFrom/max),a0+sweep);c.stroke();}const a=a0+sweep*Math.max(0,Math.min(1,frac));c.rotate(a);c.fillStyle='#ff4433';c.beginPath();c.moveTo(-r*.17,0);c.lineTo(0,-r*.04);c.lineTo(r*.8,0);c.lineTo(0,r*.04);c.closePath();c.fill();c.rotate(-a);c.fillStyle='#14171c';c.beginPath();c.arc(0,0,r*.12,0,7);c.fill();c.restore();}
  function drawCarGauges(){if(!gaugeCtx||cam3||!wheelEl)return;const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);if(gaugeEl.width!==Math.round(w*dpr)||gaugeEl.height!==Math.round(h*dpr)){gaugeEl.width=Math.round(w*dpr);gaugeEl.height=Math.round(h*dpr);}const c=gaugeCtx;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);const r0=wheelEl.getBoundingClientRect(),r=Math.max(22,r0.height*.105),cx=r0.left+r0.width/2,cy=Math.min(r0.top+r0.height*.285,h-r*1.2);carDial(c,cx-r*1.3,cy,r,Math.abs(dSpeed)*3.6/240,240,40,CAR_LEGAL_KMH);carDial(c,cx+r*1.3,cy,r,.1+(CarSnd.rpm||0)*.75,8,1,6.5);}
  function radioRect(){return CAR_RADIO_RECT[carId]||RADIO_RECT;}
  function objectPositionRatio(token,fallback){token=(token||'').toLowerCase();if(token==='left'||token==='top')return 0;if(token==='right'||token==='bottom')return 1;if(token==='center')return .5;const n=parseFloat(token);return Number.isFinite(n)&&token.includes('%')?n/100:fallback;}
  function dashImageMap(){const box=dashImgEl.getBoundingClientRect(),nw=dashImgEl.naturalWidth||1536,nh=dashImgEl.naturalHeight||1024,s=Math.max(box.width/nw,box.height/nh),rw=nw*s,rh=nh*s,pos=getComputedStyle(dashImgEl).objectPosition.trim().split(/\s+/),px=objectPositionRatio(pos[0],.5),py=objectPositionRatio(pos[1]||pos[0],.5);return{box,s,offX:Math.max(0,rw-box.width)*px,offY:Math.max(0,rh-box.height)*py};}
  function radioLayout(){if(!radioEl)return;if(cam3||!dashImgEl||!dashImgEl.parentNode){radioEl.style.display='none';return;}const{box,s,offX,offY}=dashImageMap();if(!box.width)return;const[x0,y0,x1,y1]=radioRect(),L=box.left+x0*s-offX,T=box.top+y0*s-offY,W=(x1-x0)*s,H=(y1-y0)*s;radioEl.style.display='block';Object.assign(radioEl.style,{left:L+'px',top:T+'px',width:W+'px',height:H+'px'});const dpr=Math.min(devicePixelRatio||1,2);radioVizEl.width=Math.round(W*dpr);radioVizEl.height=Math.round(H*dpr);if(radioListEl){const lw=Math.max(W*2.6,250),ll=Math.max(6,Math.min(L+W/2-lw/2,innerWidth-lw-6));radioListEl.style.left=ll+'px';radioListEl.style.width=lw+'px';radioListEl.style.bottom=(innerHeight-T+8)+'px';}radioState();}
  function radioState(){const on=typeof Music!=='undefined'&&Music.isCarOn();if(!radioEl)return;radioEl.classList.toggle('on',on);radioEl.setAttribute('aria-pressed',String(on));const music=root&&root.querySelector('.ps3-music');if(music){music.classList.toggle('active',on);music.setAttribute('aria-pressed',String(on));}const hint=radioEl.querySelector('.ps3-radio-hint');if(hint)hint.innerHTML=on?'':'<b>♪ MUSIC</b><span>แตะเพื่อเปิดเพลงในรถ</span>';}
  function renderRadioList(){if(!radioListEl||typeof Music==='undefined')return;const tracks=Music.carTracks(),cur=Music.curCar(),m=Music.mode(),lbl={all:['REPEAT ALL','เล่นซ้ำทั้งหมด'],one:['REPEAT ONE','เล่นซ้ำเพลง'],shuffle:['SHUFFLE','สุ่มเล่น']};radioListEl.innerHTML=`<div class="rl-head"><span>🎵 CAR RADIO · เพลงในรถ</span><button class="rl-x" type="button">✕</button></div><div class="rl-tracks">${tracks.map((t,i)=>`<button class="rl-track${i===cur?' on':''}" data-i="${i}" type="button"><span>${i===cur?'▶':'♪'}</span>Track ${i+1}</button>`).join('')}</div><div class="rl-modes">${['all','one','shuffle'].map(k=>`<button class="rl-mode${m===k?' on':''}" data-m="${k}" type="button">${lbl[k][0]}<small>${lbl[k][1]}</small></button>`).join('')}</div><button class="rl-power" type="button">⏻ TURN OFF · ปิดเพลง</button>`;}
  function radioToggle(){if(!radioListEl)return;if(radioListEl.style.display==='block'){radioListEl.style.display='none';return;}renderRadioList();radioLayout();radioListEl.style.display='block';}
  function drawRadioViz(){
    if(!radioVizCtx||!radioEl||radioEl.style.display==='none')return;
    const c=radioVizCtx,W=radioVizEl.width,H=radioVizEl.height,bg=c.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#0b1b2b');bg.addColorStop(.48,'#06111f');bg.addColorStop(1,'#02060d');c.fillStyle=bg;c.fillRect(0,0,W,H);
    const sheen=c.createLinearGradient(0,0,W,H*.7);sheen.addColorStop(0,'rgba(150,225,255,.16)');sheen.addColorStop(.32,'rgba(70,130,175,.035)');sheen.addColorStop(.5,'rgba(255,255,255,0)');c.fillStyle=sheen;c.fillRect(0,0,W,H*.58);
    c.lineWidth=Math.max(1,H*.008);c.strokeStyle='rgba(117,206,255,.16)';for(let y=H*.28;y<H*.86;y+=H*.145){c.beginPath();c.moveTo(W*.045,y);c.lineTo(W*.955,y);c.stroke();}
    c.fillStyle='rgba(173,225,255,.72)';c.font=`700 ${Math.max(7,H*.075)}px sans-serif`;c.textAlign='left';c.fillText('PREMIUM SPECTRUM',W*.05,H*.12);c.textAlign='right';c.fillStyle='rgba(255,178,66,.86)';c.fillText('HI-RES',W*.95,H*.12);
    const on=typeof Music!=='undefined'&&Music.isCarOn(),data=on?Music.vizData():null,n=radioBars.length,left=W*.05,right=W*.95,top=H*.19,base=H*.86,usable=base-top,gap=Math.max(1,W*.004),bw=(right-left-gap*(n-1))/n;
    for(let i=0;i<n;i++){
      const p=i/(n-1),idx=data?Math.min(data.length-1,Math.round(Math.pow(p,1.55)*(data.length-1))):0,a=data?data[Math.max(0,idx-1)]||0:0,b=data?data[idx]||0:0,d=data?data[Math.min(data.length-1,idx+1)]||0:0,raw=Math.max(b,a*.82,d*.88)/255,v=Math.min(1,raw*(.94+p*.72));
      radioBars[i]=v>radioBars[i]?radioBars[i]*.28+v*.72:radioBars[i]*.91+v*.09;radioPeaks[i]=Math.max(radioBars[i],radioPeaks[i]-.009);
      const x=left+i*(bw+gap),bh=Math.max(H*.025,radioBars[i]*usable),segH=Math.max(2,H*.026),segGap=Math.max(1,H*.009);c.shadowBlur=Math.max(2,H*.025);c.shadowColor='rgba(21,195,255,.48)';
      for(let y=base-segH;y>base-bh;y-=segH+segGap){const q=(base-y)/usable;c.fillStyle=q>.78?'#ff9d22':q>.58?'#55e4ff':'#18aeea';c.fillRect(x,y,bw,segH);}
      c.shadowBlur=0;const py=Math.max(top,base-radioPeaks[i]*usable);c.fillStyle=radioPeaks[i]>.72?'#ffc35a':'#9aeeff';c.fillRect(x,py,bw,Math.max(1,H*.012));
      c.globalAlpha=.13;c.fillStyle='#31c8ff';c.fillRect(x,base+H*.018,bw,Math.min(H*.07,bh*.16));c.globalAlpha=1;
    }
    c.fillStyle='rgba(139,197,222,.62)';c.font=`600 ${Math.max(6,H*.06)}px sans-serif`;c.textAlign='left';c.fillText('20',left,H*.96);c.textAlign='center';c.fillText('1k',W*.5,H*.96);c.textAlign='right';c.fillText('20k Hz',right,H*.96);
    const vignette=c.createRadialGradient(W*.5,H*.48,H*.1,W*.5,H*.48,W*.62);vignette.addColorStop(.52,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.48)');c.fillStyle=vignette;c.fillRect(0,0,W,H);
  }
  function turnSet(v){turnSig=v;turnAt=performance.now();turnYawOn=car.yaw;turnReturnAt=0;turnClickPhase=-1;if(turnEl){turnEl.classList.toggle('sig',!!v);turnDotEl.style.top=(v===1?25:v===2?75:50)+'%';}root&&root.classList.toggle('turn-left',v===1);root&&root.classList.toggle('turn-right',v===2);}
  function turnTick(now){if(!turnSig)return;const ph=Math.floor(now/400)%2;if(ph!==turnClickPhase){turnClickPhase=ph;CarSnd.tlClick(ph===0);}let dy=car.yaw-turnYawOn;dy=((dy+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;if(Math.abs(dy)>.87&&Math.abs(dSteer)<.07&&!turnReturnAt)turnReturnAt=now+900;if((turnReturnAt&&now>turnReturnAt)||now-turnAt>20000)turnSet(0);}
  function updateSwitch(btn,on){btn.classList.toggle('on',on);const tx=btn.querySelector('b');if(tx)tx.textContent=on?'เปิด':'ปิด';}
  function showLaw(warn,done){if(!lawEl){done&&done();return;}lawEl.innerHTML=`<h3>🛡️ SAFETY BRIEFING · ขับสนุกไม่เสียค่าปรับ</h3>${warn?'<div class="li-warn">⚠️ ยังไม่คาดเข็มขัด คาดไว้จะปลอดภัยกว่านะ</div>':''}<div class="li-grid"><div>🔒 <b>เข็มขัดนิรภัย</b><br><small>ไม่คาดก็ไม่หักเหรียญ แต่คาดแล้วปลอดภัยกว่า</small></div><div>🚨 <b>ความเร็ว</b><br><small>เกิน ${CAR_LEGAL_KMH} กม./ชม. มีไฟเตือน แต่ไม่เสียค่าปรับ</small></div><div>💥 <b>ขับชนแรง</b><br><small>รถเด้งและมีเสียงชน แต่ไม่หักค่าซ่อม</small></div></div><button type="button">🫡 รับทราบ</button>`;lawEl.style.display='block';lawEl.querySelector('button').onclick=()=>{lawEl.style.display='none';done&&done();};}
  function makeDriverCar(){const g=new THREE.Group(),body=mat(0x45a0c9,{metalness:.25}),dark=mat(0x20262b),glass=mat(0xbfe3ff,{transparent:true,opacity:.7}),lamp=mat(0xfff59d),shadowMat=new THREE.MeshBasicMaterial({color:0x101518,transparent:true,opacity:.42,depthWrite:false});disposables.push(shadowMat);box(0,.75,0,1.9,.6,4.1,body,g);const shield=box(0,1.28,-.62,1.7,.5,.09,glass,g);shield.rotation.x=-.2;[-.6,.6].forEach(x=>box(x,.86,-2.06,.24,.18,.07,lamp,g));const groundShadow=mesh(new THREE.CircleGeometry(1.65,20),shadowMat,0,.035,0,g);groundShadow.rotation.x=-Math.PI/2;groundShadow.scale.set(1,1.65,1);g.userData.wheels=[];[[-1,-1.35],[1,-1.35],[-1,1.35],[1,1.35]].forEach(([sx,z])=>{const hold=new THREE.Group();hold.position.set(sx*.97,.5,z);const wh=mesh(new THREE.CylinderGeometry(.5,.5,.32,12),dark,0,0,0,hold);wh.rotation.z=Math.PI/2;g.add(hold);g.userData.wheels.push(wh);});g.visible=false;scene.add(g);return g;}
  function petVisual(){const p=(typeof activePet==='function')?activePet():null;let src='';try{src=p&&typeof currentPetImg==='function'?currentPetImg(p):'';}catch(e){}return src?`<img src="${src}" alt="${p?escapeHTML(p.name):'น้อง'}">`:`<span>${p&&PETS[p.type]?PETS[p.type].adult:'🐶'}</span>`;}
  function buildHUD(rental){
    root.dataset.car=carId;
    const carNo=Number(String(carId).match(/\d+/)?.[0]||1),hue=(188+carNo*17)%360;
    root.style.setProperty('--ps3-accent',`hsl(${hue} 72% 56%)`);
    root.insertAdjacentHTML('beforeend',`
      <div class="ps3-hud"><div class="ps3-gps"><span class="ps3-gps-icon">◆</span><div><b>GPS · ${target==='food'?'ร้านอาหารสัตว์':'ร้านแฟชั่นสัตว์เลี้ยง'}</b><span>ตรงไปตามเส้นนำทาง</span></div></div><div class="ps3-actions"><button data-dest="food" class="${target==='food'?'active':''}" aria-label="นำทางไปร้านอาหารสัตว์">🥫</button><button data-dest="fashion" class="${target==='fashion'?'active':''}" aria-label="นำทางไปร้านแฟชั่น">🎀</button><button class="ps3-music" aria-label="เปิดหรือปิดเพลงในรถ">🎵</button><button data-exit="1" class="ps3-exit" aria-label="ออกจากโลก">✕ <span>ออก</span></button></div></div>
      <div class="ps3-turn-effects" aria-hidden="true"><i class="ps3-turn-glow left"></i><i class="ps3-turn-glow right"></i></div>
      <div class="ps3-cardash"></div><canvas class="ps3-cargauge"></canvas><div class="ps3-carwheel"></div>
      <button class="ps3-radio-screen" type="button" aria-pressed="true"><canvas></canvas><span class="ps3-radio-hint"></span></button><div class="ps3-radio-list"></div>
      <div class="ps3-pet">${petVisual()}<small>น้องนั่งด้วย 🐾</small></div>
      <div class="ps3-tools"><button class="ps3-cam" type="button">👁️ <span>มุมกล้อง</span></button><button class="ps3-seat" type="button">🎚️ <span>มุมนั่ง</span></button></div>
      <div class="ps3-steerpad" aria-label="พวงมาลัย ลากซ้ายขวา"><span>◀</span><i></i><span>▶</span></div>
      <button class="ps3-gaspad" type="button"><span>▲</span><small>เร่ง</small></button><button class="ps3-brakepad" type="button"><span>■</span><small>เบรก</small></button>
      <button class="ps3-geard" type="button">D<small>เดินหน้า</small></button><button class="ps3-gearr" type="button">R<small>ถอยหลัง</small></button>
      <div class="ps3-turnpad"><span aria-hidden="true">←</span><i></i><span aria-hidden="true">→</span></div><button class="ps3-horn" type="button">📯</button>
      <div class="ps3-warning"></div><button class="ps3-store">เข้าร้าน</button><div class="ps3-help">W เร่ง · Space เบรก · A/D เลี้ยว · R เกียร์ · Z/C ไฟเลี้ยว · V กล้อง · H แตร · M เพลง${rental?' · รถเช่ารอบนี้':''}</div>
      <div class="ps3-carstart"><h3>🚗 เตรียมออกรถ</h3><div class="cs-row"><span>🔑 <b>สตาร์ทเครื่องยนต์</b><small>เครื่องไม่ติด รถออกไม่ได้นะ</small></span><button class="cs-engine" type="button"><i></i><b>ปิด</b></button></div><div class="cs-row"><span>🔒 <b>คาดเข็มขัดนิรภัย</b><small>คาดไว้จะปลอดภัยกว่า · ด่านนี้ไม่หักค่าปรับ</small></span><button class="cs-belt" type="button"><i></i><b>ปิด</b></button></div><button class="cs-go" type="button" disabled>🚗 ออกรถ!</button></div>
      <div class="ps3-law"></div>`);
    gpsEl=root.querySelector('.ps3-gps span:not(.ps3-gps-icon)');storeBtn=root.querySelector('.ps3-store');dashEl=root.querySelector('.ps3-cardash');wheelEl=root.querySelector('.ps3-carwheel');gaugeEl=root.querySelector('.ps3-cargauge');gaugeCtx=gaugeEl.getContext('2d');petEl=root.querySelector('.ps3-pet');speedEl=null;radioEl=root.querySelector('.ps3-radio-screen');radioVizEl=radioEl.querySelector('canvas');radioVizCtx=radioVizEl.getContext('2d');radioListEl=root.querySelector('.ps3-radio-list');steerHitEl=root.querySelector('.ps3-steerpad');steerKnobEl=steerHitEl.querySelector('i');throttleEl=root.querySelector('.ps3-gaspad');brakeEl=root.querySelector('.ps3-brakepad');gearDEl=root.querySelector('.ps3-geard');gearREl=root.querySelector('.ps3-gearr');hornEl=root.querySelector('.ps3-horn');turnEl=root.querySelector('.ps3-turnpad');turnDotEl=turnEl.querySelector('i');engineEl=root.querySelector('.cs-engine');beltEl=root.querySelector('.cs-belt');goEl=root.querySelector('.cs-go');startEl=root.querySelector('.ps3-carstart');lawEl=root.querySelector('.ps3-law');camEl=root.querySelector('.ps3-cam');seatEl=root.querySelector('.ps3-seat');warningEl=root.querySelector('.ps3-warning');syncGearUi();loadCarCockpit();radioState();
  }
  function bind(){
    listen(root,'scroll',()=>{if(root.scrollTop||root.scrollLeft){root.scrollTop=0;root.scrollLeft=0;}},{passive:true});
    [engineEl,beltEl,goEl].forEach(btn=>listen(btn,'pointerdown',e=>e.preventDefault()));
    const pinView=()=>{const reset=()=>{if(!root)return;const a=document.activeElement;if(a&&a.blur)a.blur();root.scrollTop=root.scrollLeft=0;window.scrollTo(0,0);};reset();requestAnimationFrame(reset);setTimeout(reset,60);};
    listen(window,'keydown',e=>{if(!keys[e.code]){if(e.code==='KeyM'&&typeof Music!=='undefined'){Music.toggleCar();radioState();}if(e.code==='KeyH'){sndKick();CarSnd.horn();}if(e.code==='KeyR')setGear(!gearR);if(e.code==='KeyV')toggleCamera();if(e.code==='KeyZ')turnSet(turnSig===1?0:1);if(e.code==='KeyC')turnSet(turnSig===2?0:2);}keys[e.code]=true;if(e.code==='Escape')exit();if(e.code==='ArrowDown'||e.code==='KeyS')kBack=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();});listen(window,'keyup',e=>{keys[e.code]=false;if(e.code==='ArrowDown'||e.code==='KeyS')kBack=false;});listen(window,'resize',()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);radioLayout();});
    root.querySelectorAll('[data-dest]').forEach(b=>listen(b,'click',()=>{target=b.dataset.dest;rebuildRoute();root.querySelector('.ps3-gps b').textContent=`GPS · ${target==='food'?'ร้านอาหารสัตว์':'ร้านแฟชั่นสัตว์เลี้ยง'}`;root.querySelectorAll('[data-dest]').forEach(x=>x.classList.toggle('active',x===b));}));
    listen(root.querySelector('.ps3-music'),'click',()=>{if(typeof Music==='undefined'||!Music.ready()){toast('🎵 ยังไม่มีไฟล์เพลงในรถ');return;}Music.toggleCar();if(!Music.isCarOn())radioListEl.style.display='none';radioState();});
    listen(radioEl,'click',()=>{if(typeof Music==='undefined'||!Music.ready()){toast('🎵 ยังไม่มีไฟล์เพลงในรถ');return;}if(!Music.isCarOn()){Music.carRadio(true);radioState();}else radioToggle();});listen(radioListEl,'click',e=>{const tr=e.target.closest('.rl-track');if(tr){Music.playCar(+tr.dataset.i);renderRadioList();return;}const md=e.target.closest('.rl-mode');if(md){Music.setMode(md.dataset.m);renderRadioList();return;}if(e.target.closest('.rl-power')){Music.carRadio(false);radioListEl.style.display='none';radioState();return;}if(e.target.closest('.rl-x'))radioListEl.style.display='none';});
    listen(root.querySelector('[data-exit]'),'click',exit);listen(storeBtn,'click',openShop);
    const thrOn=e=>{e.preventDefault();padThr=true;throttleEl.classList.add('on');sndKick();},thrOff=()=>{padThr=false;throttleEl.classList.remove('on');};listen(throttleEl,'pointerdown',thrOn);['pointerup','pointercancel','pointerleave'].forEach(x=>listen(throttleEl,x,thrOff));
    const brOn=e=>{e.preventDefault();padBr=true;brakeEl.classList.add('on');sndKick();},brOff=()=>{padBr=false;brakeEl.classList.remove('on');};listen(brakeEl,'pointerdown',brOn);['pointerup','pointercancel','pointerleave'].forEach(x=>listen(brakeEl,x,brOff));const gearDriveOn=(e,rev)=>{e.preventDefault();setGear(rev);padThr=true;throttleEl.classList.add('on');sndKick();try{e.currentTarget.setPointerCapture(e.pointerId);}catch(err){}};const gearDriveOff=()=>{padThr=false;throttleEl.classList.remove('on');};listen(gearDEl,'pointerdown',e=>gearDriveOn(e,false));listen(gearREl,'pointerdown',e=>gearDriveOn(e,true));['pointerup','pointercancel','lostpointercapture'].forEach(x=>{listen(gearDEl,x,gearDriveOff);listen(gearREl,x,gearDriveOff);});listen(hornEl,'pointerdown',e=>{e.preventDefault();sndKick();CarSnd.horn();});
    let sliding=false;const setSteer=e=>{const r=steerHitEl.getBoundingClientRect();steerCtl=Math.max(-1,Math.min(1,(((e.clientX-r.left)/r.width)*2-1)*1.25));steerKnobEl.style.left=(50+steerCtl*36)+'%';};listen(steerHitEl,'pointerdown',e=>{e.preventDefault();sliding=true;steerHitEl.classList.add('on');try{steerHitEl.setPointerCapture(e.pointerId);}catch(err){}setSteer(e);});listen(steerHitEl,'pointermove',e=>{if(sliding)setSteer(e);});const steerEnd=()=>{sliding=false;steerCtl=0;steerHitEl.classList.remove('on');steerKnobEl.style.left='50%';};listen(steerHitEl,'pointerup',steerEnd);listen(steerHitEl,'pointercancel',steerEnd);
    let turning=false,turnV=0;const turnFrom=e=>{const r=turnEl.getBoundingClientRect();turnV=Math.max(-1,Math.min(1,(((e.clientY-r.top)/r.height)*2-1)*1.25));turnDotEl.style.top=(50+turnV*25)+'%';};listen(turnEl,'pointerdown',e=>{e.preventDefault();turning=true;turnEl.classList.add('on');turnFrom(e);try{turnEl.setPointerCapture(e.pointerId);}catch(err){}});listen(turnEl,'pointermove',e=>{if(turning)turnFrom(e);});const turnEnd=()=>{if(!turning)return;turning=false;turnEl.classList.remove('on');turnSet(turnV<-.35?1:turnV>.35?2:0);};listen(turnEl,'pointerup',turnEnd);listen(turnEl,'pointercancel',turnEnd);
    const releasePointerControls=()=>{steerEnd();thrOff();brOff();};listen(window,'pointerup',releasePointerControls);listen(window,'pointercancel',releasePointerControls);listen(window,'blur',()=>{releasePointerControls();keys={};kBack=false;});listen(document,'visibilitychange',()=>{if(document.hidden){releasePointerControls();keys={};kBack=false;}});
    listen(engineEl,'click',()=>{carEngineOn=!carEngineOn;updateSwitch(engineEl,carEngineOn);if(carEngineOn)CarSnd.ignite();else CarSnd.stop();goEl.disabled=!carEngineOn;pinView();});listen(beltEl,'click',()=>{carBelted=!carBelted;updateSwitch(beltEl,carBelted);if(carBelted)CarSnd.beltClick();pinView();});listen(goEl,'click',()=>{if(!carEngineOn)return;const go=()=>{carStartOpen=false;startEl.style.display='none';pinView();};if(carBelted)go();else showLaw(true,go);});
    listen(camEl,'click',toggleCamera);listen(seatEl,'click',()=>{seatLevel=(seatLevel+1)%3;seatEl.classList.toggle('on',seatLevel!==0);seatEl.querySelector('span').textContent=['มุมนั่ง','นั่งสูง','นั่งต่ำ'][seatLevel];});
  }
  function toggleCamera(){cam3=!cam3;root.classList.toggle('cam3',cam3);camEl&&camEl.classList.toggle('on',cam3);if(carMesh)carMesh.visible=cam3;radioLayout();}
  function openShop(){if(paused)return;const p=STORE_POS[target],d=Math.hypot(car.x-p.x,car.z-p.z);if(d>SHOP_TRIGGER_CLEARANCE)return;paused=true;car.speed=dSpeed=dVelX=dVelZ=0;PetPantry.openStore(target,{onClose(){paused=false;}});}
  function navText(dist){if(dist<SHOP_TRIGGER_CLEARANCE)return 'ถึงร้านแล้ว · จอดรถแล้วกด “เข้าร้าน”';const p=STORE_POS[target],dx=p.x-car.x,dz=p.z-car.z;const ang=Math.atan2(dx,dz)-car.yaw,turn=Math.sin(ang)>0?'เลี้ยวซ้าย':'เลี้ยวขวา';return dist>SHOP_HINT_DIST?`ตรงไป ${Math.round(Math.max(0,dist-25))} ม. แล้ว${turn}`:`อีก ${Math.round(dist)} ม. · เตรียม${turn}`;}
  function carDrive(dt,now){
    const prevLongSpeed=dSpeed;
    let sd=steerCtl;if(!!(keys.ArrowLeft||keys.KeyA)!==!!(keys.ArrowRight||keys.KeyD))sd=(keys.ArrowRight||keys.KeyD)?1:-1;let th=0;if(padThr||keys.ArrowUp||keys.KeyW)th=gearR?-1:1;if(kBack)th=-1;if(padBr||keys.Space)th=0;
    if(!carEngineOn||carStartOpen||now<collisionBounceUntil)th=0;
    if(carEngineOn&&!carStartOpen&&(gearR||dSpeed<-.5)&&now-carRevBeepAt>600){carRevBeepAt=now;CarSnd.revBeep();}const road=onRoad(car.x,car.z),vmax=road?CAR_VMAX:CAR_VMAX_OFF;if(th>0)dSpeed+=CAR_ACCEL*(road?1:.55)*th*dt;else if(th<0){if(dSpeed>.3)dSpeed=Math.max(0,dSpeed-CAR_BRAKE*dt);else dSpeed=Math.max(-CAR_VREV,dSpeed+CAR_ACCEL*.7*th*dt);}if(padBr||keys.Space)dSpeed=dSpeed>0?Math.max(0,dSpeed-CAR_BRAKE*1.2*dt):Math.min(0,dSpeed+CAR_BRAKE*1.2*dt);dSpeed*=Math.max(0,1-(road?.16:1.15)*dt);if(dSpeed>vmax)dSpeed=Math.max(vmax,dSpeed-CAR_BRAKE*.8*dt);
    const tgt=sd*CAR_STEER_MAX/(1+Math.abs(dSpeed)*.045),ramp=Math.abs(tgt)>Math.abs(dSteer)?3.8:6;dSteer+=(tgt-dSteer)*Math.min(1,dt*ramp);const yawRate=(dSpeed/CAR_WB)*Math.tan(dSteer),maxYaw=1.9/(1+Math.abs(dSpeed)*.06),yrApplied=Math.max(-maxYaw,Math.min(maxYaw,yawRate));car.yaw-=yrApplied*dt;const sin=Math.sin(car.yaw),cos=Math.cos(car.yaw),grip=Math.min(1,dt*(6.5-Math.min(3.8,Math.abs(dSteer)*Math.abs(dSpeed)*.38)));dVelX+=(sin*dSpeed-dVelX)*grip;dVelZ+=(cos*dSpeed-dVelZ)*grip;const hitSpd=Math.hypot(dVelX,dVelZ);car.x+=dVelX*dt;car.z+=dVelZ*dt;car.x=Math.max(-DRIVE_LIMIT,Math.min(DRIVE_LIMIT,car.x));car.z=Math.max(-DRIVE_LIMIT-55,Math.min(DRIVE_LIMIT-55,car.z));if(resolveSolidCollision(hitSpd,now)&&now-collisionAt>900){collisionAt=now;CarSnd.thud();if(hitSpd>7&&warningEl){warningEl.innerHTML='💥 รถชนแรง! รถเด้งออก · ไม่เสียค่าปรับ';warningEl.classList.add('show');setTimeout(()=>warningEl&&warningEl.classList.remove('show'),2200);}if((typeof state==='undefined'||state.haptic!==false)&&navigator.vibrate)navigator.vibrate(35);}keepCarOnRoad(now);const vlen=Math.hypot(dVelX,dVelZ),slip=(vlen>.6&&road)?Math.abs(dVelX*cos-dVelZ*sin):0;CarSnd.setSkid(Math.max(0,Math.min(1,(slip-1.6)/6)));const latA=yrApplied*dSpeed,sdt=Math.min(dt,.05),rollTgt=Math.max(-CAR_ROLL_MAX,Math.min(CAR_ROLL_MAX,latA*CAR_ROLL_GAIN));dRollV+=((rollTgt-dRoll)*CAR_ROLL_SPRING-dRollV*CAR_ROLL_DAMP)*sdt;dRoll+=dRollV*sdt;car.speed=Math.abs(dSpeed);car.steer=sd;if(wheelEl)wheelEl.style.transform=`translateX(-50%) rotate(${(dSteer*440).toFixed(1)}deg)`;turnTick(now);CarSnd.update(th,car.speed,dt);
    const longAccel=(dSpeed-prevLongSpeed)/Math.max(dt,.001),pitchTgt=Math.max(-.024,Math.min(.021,longAccel*.0022)),roadWave=(Math.sin(car.z*.19)+Math.sin(car.x*.27))*.006*Math.min(1,Math.abs(dSpeed)/8);dPitchV+=((pitchTgt-dPitch)*30-dPitchV*11)*sdt;dPitch+=dPitchV*sdt;dHeaveV+=((roadWave-dHeave)*46-dHeaveV*13)*sdt;dHeave+=dHeaveV*sdt;
    const kmh=Math.abs(dSpeed)*3.6;if(kmh>CAR_LEGAL_KMH){carOverSpeed=true;if(warningEl){warningEl.innerHTML=`🚨 เร็วเกิน ${CAR_LEGAL_KMH} กม./ชม. · ชะลอรถเพื่อความปลอดภัย · ไม่เสียค่าปรับ`;warningEl.classList.add('show');}}else if(kmh<CAR_LEGAL_KMH-5){carOverSpeed=false;if(warningEl&&!warningEl.textContent.includes('รถชน'))warningEl.classList.remove('show');}

  }
  function tick(t){if(!running)return;raf=requestAnimationFrame(tick);const dt=Math.min(.04,(t-last)/1000||.016);last=t;if(!paused)carDrive(dt,t);tickRouteLights(t);dCamYaw+=(car.yaw-dCamYaw)*Math.min(1,dt*6.5);
    const seatY=[0,.18,-.12][seatLevel]||0;if(cam3){if(carMesh){carMesh.position.set(car.x,0,car.z);carMesh.rotation.y=car.yaw;carMesh.rotation.z=dRoll;carMesh.rotation.x=dPitch*.55;(carMesh.userData.wheels||[]).forEach(w=>w.rotation.x-=dSpeed*dt/.5);}camera.position.set(car.x-Math.sin(dCamYaw)*7.4,3.15,car.z-Math.cos(dCamYaw)*7.4);camera.lookAt(car.x,1.65,car.z);}else{camera.position.set(car.x,CAR_EYE+seatY+dHeave,car.z);camera.rotation.set(-.008+dPitch,dCamYaw-Math.PI,-dRoll*.65,'YXZ');}const p=STORE_POS[target],dist=Math.hypot(car.x-p.x,car.z-p.z);gpsEl.textContent=navText(dist);storeBtn.classList.toggle('show',dist<SHOP_TRIGGER_CLEARANCE);updateHeadlights();renderer.render(scene,camera);drawCarGauges();drawRadioViz();
  }
  function start(opt={}){if(running||!window.THREE||!document.body)return false;target=opt.target==='fashion'?'fashion':'food';carId=/^car_\d+$/.test(opt.carId||'')?opt.carId:'car_01';car={x:0,z:18,yaw:Math.PI,speed:0,steer:0};keys={};steerCtl=0;padThr=padBr=gearR=kBack=false;dSpeed=dSteer=dVelX=dVelZ=dRoll=dRollV=dPitch=dPitchV=dHeave=dHeaveV=0;radioBars.fill(0);radioPeaks.fill(0);dCamYaw=car.yaw;carRevBeepAt=collisionAt=0;carEngineOn=carBelted=carOverSpeed=false;carStartOpen=true;turnSet(0);cam3=false;seatLevel=0;root=document.createElement('div');root.className='ps3-root';document.body.appendChild(root);try{buildScene();carMesh=makeDriverCar();buildHUD(!!opt.rental);bind();if(typeof Music!=='undefined'){Music.suspendBg();Music.carRadio(true);radioState();}running=true;last=performance.now();raf=requestAnimationFrame(tick);return true;}catch(e){console.error(e);cleanup();return false;}}
  function cleanup(){cancelAnimationFrame(raf);listeners.splice(0).forEach(fn=>fn());CarSnd.stop();if(envWatchId){clearInterval(envWatchId);envWatchId=null;}if(typeof Music!=='undefined'){Music.carRadio(false);Music.resumeBg();}if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const a=Array.isArray(o.material)?o.material:[o.material];a.forEach(m=>m.dispose&&m.dispose());}});disposables.splice(0).forEach(x=>x&&x.dispose&&x.dispose());if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();}if(root)root.remove();root=scene=camera=renderer=routeLine=null;routePath=[];routeLength=0;routePulse=0;routePulseAt=0;routeLights=[];carHeadlights=[];headTargets=[];shopSpotLights=[];storeBtn=gpsEl=wheelEl=petEl=speedEl=radioEl=steerHitEl=steerKnobEl=throttleEl=brakeEl=gearDEl=gearREl=hornEl=turnEl=turnDotEl=dashEl=dashImgEl=gaugeEl=gaugeCtx=radioListEl=radioVizEl=radioVizCtx=engineEl=beltEl=goEl=startEl=lawEl=camEl=seatEl=warningEl=carMesh=null;running=paused=false;keys={};padThr=padBr=kBack=false;}
  function exit(){if(!running)return;cleanup();if(typeof renderDashboard==='function')renderDashboard();}
  return {start,exit,isRunning:()=>running,_t:{routeFor,onRoad,keepCarOnRoad,STORE_POS,WORLD_HALF,DRIVE_LIMIT,hitsSolid,solidContact,setPose(x,z,yaw=car.yaw){car.x=x;car.z=z;car.yaw=yaw;dSpeed=dVelX=dVelZ=0;collisionBounceUntil=0;},setSafety(engine,belt){carEngineOn=!!engine;carBelted=!!belt;carStartOpen=!engine;},setControls(throttle,reverse=false){padThr=!!throttle;gearR=!!reverse;},stepDrive(dt,now=1000){carDrive(dt,now);},setTestRect(x,z,w,d){solidRects=[{x,z,hw:w/2,hd:d/2}];solidCircles=[];},clearTestSolids(){solidRects=[];solidCircles=[];},get solids(){return {rects:solidRects.length,circles:solidCircles.length};},get driveState(){return {x:car.x,z:car.z,speed:dSpeed,steer:dSteer,gearR,engine:carEngineOn,belt:carBelted,cam3,turnSig,collisionBounceUntil};},get cleanupState(){return {running,paused,listeners:listeners.length};}}};
})();
