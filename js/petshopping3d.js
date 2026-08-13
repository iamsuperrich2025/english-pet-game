"use strict";
/* ============================================================
   🚗🐾 PET SHOPPING 3D — รอบ 1158
   โลกสั้น first-person แยกจาก Adventure3D: ร้านใกล้, GPS ชัด,
   ร้านสร้างเป็นองค์ประกอบสถาปัตย์จริง ไม่ใช่กล่องแปะภาพ
   ============================================================ */
window.PetShopping3D=(()=>{
  const STORE_POS=Object.freeze({food:Object.freeze({x:-42,z:-82}),fashion:Object.freeze({x:42,z:-82})});
  let root,scene,camera,renderer,raf,last=0,running=false,paused=false,target='food',carId='car_01';
  let car={x:0,z:18,yaw:Math.PI,speed:0,steer:0},keys={},listeners=[],routeLine,storeBtn,gpsEl,wheelEl,petEl;
  const disposables=[];
  const C={food:0x81b89a,fashion:0xd694be,road:0x59636b,walk:0xe9d8bf};
  function mat(color,opt={}){const m=new THREE.MeshStandardMaterial({color,roughness:opt.roughness??.7,metalness:opt.metalness??.05,transparent:!!opt.transparent,opacity:opt.opacity??1});disposables.push(m);return m;}
  function mesh(g,m,x,y,z,parent=scene){const q=new THREE.Mesh(g,m);q.position.set(x,y,z);parent.add(q);disposables.push(g);return q;}
  function box(x,y,z,w,h,d,m,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);}
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
    box(0,-.18,-38,150,.3,170,grass);box(0,.01,-40,30,.18,150,road);box(0,.02,-55,126,.19,26,road);
    box(-18,.05,-40,6,.2,150,walk);box(18,.05,-40,6,.2,150,walk);box(0,.12,-40,.35,.05,150,line);
    for(let z=12;z>-114;z-=14){box(-7,.13,z,.35,.04,7,line);box(7,.13,z,.35,.04,7,line);}
    for(let x=-55;x<=55;x+=14)box(x,.13,-55,7,.04,.32,line);
  }
  function addTree(x,z){const trunk=mat(0x9b6b42),leaf=mat(0x70b87b);box(x,1.4,z,.7,2.8,.7,trunk);mesh(new THREE.SphereGeometry(2.3,9,7),leaf,x,4,z);}
  function facadeTexture(kind){
    const loader=new THREE.TextureLoader();loader.load(`img/pet-shopping/${kind}_window.webp`,tex=>{tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:tex});disposables.push(tex,m);const p=STORE_POS[kind];box(p.x,5.7,p.z+5.55,14,7.3,.12,m);},()=>{},()=>{});
  }
  function addShop(kind){
    const p=STORE_POS[kind],accent=mat(C[kind]),stone=mat(kind==='food'?0xf6efdd:0xffeef3),gold=mat(0xc9a45c,{metalness:.55,roughness:.3}),glass=mat(0xbce7ed,{transparent:true,opacity:.32,roughness:.1}),dark=mat(0x3e4b4c),wood=mat(0xa87955);
    const group=new THREE.Group();group.position.set(p.x,0,p.z);group.rotation.y=Math.PI;scene.add(group); // หัน façade เข้าหาถนน/จุดเริ่ม
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
  function addTown(){
    const colors=[0xf0c8ae,0xa7cfd4,0xd8c2e5,0xf0dda9],roof=mat(0x6f6564);
    for(let i=0;i<12;i++){const side=i%2?-1:1,x=side*(35+(i%3)*12),z=10-Math.floor(i/2)*22,h=8+(i%4)*2,wall=mat(colors[i%colors.length]);box(x,h/2,z,13,h,12,wall);box(x,h+.4,z,14,.8,13,roof);for(let y=3;y<h;y+=3)for(const dx of [-3,3])box(x+dx,y,z-side*6.05,2,1.5,.15,mat(0xfff1b8));}
    for(let z=5;z>-110;z-=16){addTree(-23,z);addTree(23,z);}
    addShop('food');addShop('fashion');
  }
  function buildScene(){
    scene=new THREE.Scene();scene.background=new THREE.Color(0xbfe5ef);scene.fog=new THREE.Fog(0xbfe5ef,85,220);
    camera=new THREE.PerspectiveCamera(66,innerWidth/innerHeight,.1,300);scene.add(new THREE.HemisphereLight(0xfff5df,0x55745c,1.05));const sun=new THREE.DirectionalLight(0xffe7bd,1.25);sun.position.set(-30,50,20);scene.add(sun);
    renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=false;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;root.prepend(renderer.domElement);
    addRoad();addTown();rebuildRoute();
  }
  function petVisual(){const p=(typeof activePet==='function')?activePet():null;let src='';try{src=p&&typeof currentPetImg==='function'?currentPetImg(p):'';}catch(e){}return src?`<img src="${src}" alt="${p?escapeHTML(p.name):'น้อง'}">`:`<span>${p&&PETS[p.type]?PETS[p.type].adult:'🐶'}</span>`;}
  function buildHUD(rental){
    root.insertAdjacentHTML('beforeend',`<div class="ps3-hud"><div class="ps3-gps"><b>🧭 GPS · ${target==='food'?'ร้านอาหารสัตว์':'ร้านแฟชั่นสัตว์เลี้ยง'}</b><span>ตรงไปตามเส้นสีฟ้า · ร้านอยู่ใกล้ๆ</span></div><div class="ps3-actions"><button data-dest="food">🥫</button><button data-dest="fashion">🎀</button><button data-radio="1">🎵</button><button data-exit="1">ออก</button></div></div><div class="ps3-cockpit"><img class="ps3-dash" src="img/3d_car/3d_dash_${carId}.png" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='img/3d_car/3d_dash_car_01.png'}else this.style.display='none'"><img class="ps3-wheel" src="img/3d_car/3d_wheel_${String(carId).match(/\d+/)?.[0]?.padStart(2,'0')||'01'}.png" onerror="this.style.display='none'"><div class="ps3-pet">${petVisual()}<small>น้องมาด้วย! 🐾</small></div></div><div class="ps3-touch"><button data-steer="-1">◀</button><button data-gas="1">▲</button><button data-brake="1">▼</button><button data-steer="1">▶</button></div><button class="ps3-store">เข้าร้าน</button><div class="ps3-help">WASD/ลูกศร · Space เบรก · M วิทยุ${rental?' · รถเช่ารอบนี้':''}</div>`);
    gpsEl=root.querySelector('.ps3-gps span');storeBtn=root.querySelector('.ps3-store');wheelEl=root.querySelector('.ps3-wheel');petEl=root.querySelector('.ps3-pet');
  }
  function bind(){
    listen(window,'keydown',e=>{keys[e.code]=true;if(e.code==='Escape')exit();if(e.code==='KeyM'&&typeof Music!=='undefined')Music.toggleCar();if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();});listen(window,'keyup',e=>keys[e.code]=false);listen(window,'resize',()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
    root.querySelectorAll('[data-dest]').forEach(b=>listen(b,'click',()=>{target=b.dataset.dest;rebuildRoute();root.querySelector('.ps3-gps b').textContent=`🧭 GPS · ${target==='food'?'ร้านอาหารสัตว์':'ร้านแฟชั่นสัตว์เลี้ยง'}`;}));listen(root.querySelector('[data-radio]'),'click',()=>{if(typeof Music!=='undefined')Music.toggleCar();});listen(root.querySelector('[data-exit]'),'click',exit);listen(storeBtn,'click',openShop);
    root.querySelectorAll('[data-steer],[data-gas],[data-brake]').forEach(b=>{const code=b.dataset.steer?(Number(b.dataset.steer)<0?'ArrowLeft':'ArrowRight'):b.dataset.gas?'ArrowUp':'Space';const on=e=>{e.preventDefault();keys[code]=true};const off=e=>{e.preventDefault();keys[code]=false};listen(b,'pointerdown',on);listen(b,'pointerup',off);listen(b,'pointercancel',off);listen(b,'pointerleave',off);});
  }
  function openShop(){if(paused)return;const p=STORE_POS[target],d=Math.hypot(car.x-p.x,car.z-p.z);if(d>27)return;paused=true;car.speed=0;PetPantry.openStore(target,{onClose(){paused=false;}});}
  function navText(dist){if(dist<27)return 'ถึงร้านแล้ว · จอดรถแล้วกด “เข้าร้าน”';const p=STORE_POS[target],dx=p.x-car.x,dz=p.z-car.z;const ang=Math.atan2(dx,dz)-car.yaw,turn=Math.sin(ang)>0?'เลี้ยวซ้าย':'เลี้ยวขวา';return dist>55?`ตรงไป ${Math.round(dist-25)} ม. แล้ว${turn}`:`อีก ${Math.round(dist)} ม. · เตรียม${turn}`;}
  function tick(t){if(!running)return;raf=requestAnimationFrame(tick);const dt=Math.min(.04,(t-last)/1000||.016);last=t;if(!paused){const gas=keys.ArrowUp||keys.KeyW,rev=keys.ArrowDown||keys.KeyS,brake=keys.Space;car.speed+=(gas?22:rev?-14:0)*dt;car.speed*=Math.pow(brake?.72:.986,dt*60);car.speed=Math.max(-8,Math.min(24,car.speed));const s=(keys.ArrowLeft||keys.KeyA?1:0)-(keys.ArrowRight||keys.KeyD?1:0);car.steer+=(s-car.steer)*Math.min(1,dt*7);car.yaw+=car.steer*car.speed*dt*.035;car.x+=Math.sin(car.yaw)*car.speed*dt;car.z+=Math.cos(car.yaw)*car.speed*dt;car.x=Math.max(-62,Math.min(62,car.x));car.z=Math.max(-112,Math.min(25,car.z));if(wheelEl)wheelEl.style.transform=`translateX(-50%) rotate(${car.steer*38}deg)`;}
    camera.position.set(car.x,2.2,car.z);camera.rotation.set(-.035,car.yaw-Math.PI,0,'YXZ');const p=STORE_POS[target],dist=Math.hypot(car.x-p.x,car.z-p.z);gpsEl.textContent=navText(dist);storeBtn.classList.toggle('show',dist<27);renderer.render(scene,camera);
  }
  function start(opt={}){if(running||!window.THREE||!document.body)return false;target=opt.target==='fashion'?'fashion':'food';carId=/^car_\d+$/.test(opt.carId||'')?opt.carId:'car_01';car={x:0,z:18,yaw:Math.PI,speed:0,steer:0};keys={};root=document.createElement('div');root.className='ps3-root';document.body.appendChild(root);try{buildScene();buildHUD(!!opt.rental);bind();if(typeof Music!=='undefined'){Music.suspendBg();Music.carRadio(true);}running=true;last=performance.now();raf=requestAnimationFrame(tick);return true;}catch(e){console.error(e);cleanup();return false;}}
  function cleanup(){cancelAnimationFrame(raf);listeners.splice(0).forEach(fn=>fn());if(typeof Music!=='undefined'){Music.carRadio(false);Music.resumeBg();}if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const a=Array.isArray(o.material)?o.material:[o.material];a.forEach(m=>m.dispose&&m.dispose());}});disposables.splice(0).forEach(x=>x&&x.dispose&&x.dispose());if(renderer){renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();}if(root)root.remove();root=scene=camera=renderer=routeLine=null;running=paused=false;keys={};}
  function exit(){if(!running)return;cleanup();if(typeof renderDashboard==='function')renderDashboard();}
  return {start,exit,isRunning:()=>running,_t:{routeFor,STORE_POS,get cleanupState(){return {running,paused,listeners:listeners.length};}}};
})();
