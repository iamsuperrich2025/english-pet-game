"use strict";
/* ==== Round 1387 — three illustrated arenas; one selected plate, grouped four-seat rooms ==== */
(function(){
  const maps=[
    {id:'sky',name:'Sky Citadel',thai:'ปราสาทลอยฟ้า',desc:'ลานหินอ่อนเหนือเมฆ · คริสตัลสีฟ้า',accent:'#75eaff',light:0xe5f6ff,ambient:0x91b7d9,art:'img/arena-maps/sky.avif',fallback:'img/arena-maps/sky.webp',thumb:'img/arena-maps/sky-thumb.webp',rx:.345,ry:.30,cy:.51},
    {id:'crystal',name:'Crystal Hollow',thai:'ถ้ำคริสตัล',desc:'แสงอัญมณีม่วง · น้ำตกในถ้ำเวทมนตร์',accent:'#c59aff',light:0xb9b6ff,ambient:0x69729f,art:'img/arena-maps/crystal.avif',fallback:'img/arena-maps/crystal.webp',thumb:'img/arena-maps/crystal-thumb.webp',rx:.34,ry:.30,cy:.50},
    {id:'forest',name:'Moonleaf Ruins',thai:'ป่าโบราณ',desc:'ซากวิหารกลางป่า · ผีเสื้อและแสงจันทร์',accent:'#87f2ce',light:0xffefd0,ambient:0x90bba3,art:'img/arena-maps/forest.avif',fallback:'img/arena-maps/forest.webp',thumb:'img/arena-maps/forest-thumb.webp',rx:.345,ry:.31,cy:.54}
  ];
  const FIRST=21,GROUPS=5,PER_MAP=4;let selectedImage=null,pending=null,picker=null;
  const get=id=>maps.find(m=>m.id===id)||maps[0];
  const online=()=>typeof Online!=='undefined'&&Online.ready&&Online.db&&typeof onlineKey==='function';
  function countData(data,uid,now=Date.now()){let n=0;for(const [key,v] of Object.entries(data||{})){if(key===uid)continue;if(typeof v.t==='number'&&now-v.t>90000)continue;n++;}return n;}
  async function availability(read,id){
    const slot=maps.indexOf(get(id));
    for(let g=0;g<GROUPS;g++){
      const counts=await Promise.all(maps.map((_,s)=>read(FIRST+g*3+s)));
      if(counts.some(n=>n<PER_MAP))return {group:g+1,counts,idx:FIRST+g*3+slot,count:counts[slot],full:counts[slot]>=PER_MAP,exhausted:false};
    }
    return {group:GROUPS,counts:[4,4,4],idx:-1,count:4,full:true,exhausted:true};
  }
  async function inspect(id){
    if(!online())return {group:1,counts:[0,0,0],idx:FIRST+maps.indexOf(get(id)),count:0,full:false,offline:true};
    const uid=onlineKey();return availability(async function readArenaRoom(i){const snap=await Online.db.ref('winfo/adv/r'+i).once('value');return countData(snap.val(),uid);},id);
  }
  function roomOptions(id){
    const slot=maps.indexOf(get(id));return {roomIndices:Array.from({length:GROUPS},(_,g)=>FIRST+g*3+slot),legacy:false,
      roomPicker:async function pickArenaRoom(read){const a=await availability(read,id);return a.full?null:{idx:a.idx,count:a.count};},
      fullMessage:'แผนที่นี้เต็ม · กดเปลี่ยนแผนที่เพื่อเลือกที่ว่าง ระบบเปิดห้องถัดไปเมื่อครบทั้ง 3 แผนที่',
      roomNoun:'ห้อง',roomIcon:'✦',roomFmt:i=>'ห้อง '+(Math.floor((i-1-FIRST)/3)+1)};
  }
  function prepare(id){
    const map=get(id);if(selectedImage?.id===map.id)return Promise.resolve(selectedImage.image);
    if(pending?.id===map.id)return pending.promise;
    const image=new Image();image.decoding='async';
    const promise=new Promise((resolve,reject)=>{let fallback=false;image.onload=()=>{selectedImage={id:map.id,image};resolve(image);};image.onerror=()=>{if(!fallback){fallback=true;image.src=map.fallback;}else reject(new Error('โหลดภาพแผนที่ไม่สำเร็จ'));};image.src=map.art;});
    pending={id:map.id,promise};promise.finally(()=>{if(pending?.promise===promise)pending=null;}).catch(()=>{});return promise;
  }
  function decorate(root,id){
    const map=get(id);root.dataset.map=map.id;root.style.setProperty('--map-accent',map.accent);
    const art=document.createElement('img');art.className='va-map-art';art.alt='';art.draggable=false;art.src=selectedImage?.id===map.id?selectedImage.image.src:map.art;
    art.onerror=()=>{art.onerror=null;art.src=map.fallback;};root.prepend(art);
    const ambience=document.createElement('div');ambience.className='va-map-ambience';ambience.setAttribute('aria-hidden','true');for(let i=0;i<12;i++){const p=document.createElement('i');p.style.cssText='--i:'+i+';left:'+(4+(i*23)%92)+'%;top:'+(12+(i*37)%76)+'%;';ambience.append(p);}art.after(ambience);
  }
  function camera(camera,id,w,h){
    const m=get(id),elevation=.68,r=30,halfW=r/(2*m.rx),halfH=r*elevation/(2*m.ry);
    camera.left=-halfW;camera.right=halfW;camera.top=halfH*2*m.cy;camera.bottom=-halfH*2*(1-m.cy);
    camera.position.set(0,68,Math.sqrt(10000-68*68));camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
  }
  function scenery(scene,id){
    const m=get(id);scene.background=null;scene.fog=null;
    scene.add(new THREE.HemisphereLight(m.light,m.ambient,.7));const sun=new THREE.DirectionalLight(m.light,1.0);sun.position.set(-15,30,20);scene.add(sun);
    const nodes=[],mat=new THREE.MeshBasicMaterial({color:0x3b6788,toneMapped:false}),baseGeo=new THREE.CylinderGeometry(1.15,1.5,.7,12);
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.25,pos=new THREE.Vector3(Math.sin(a)*22.8,0,Math.cos(a)*22.8),base=new THREE.Mesh(baseGeo,mat);base.position.copy(pos);base.position.y=.3;scene.add(base);nodes.push({pos,remaining:0,drop:null});}
    return nodes;
  }
  function slime(col,elite){
    const radius=elite?1.5:1.2,material=new THREE.MeshStandardMaterial({color:new THREE.Color(col).convertSRGBToLinear(),emissive:col,emissiveIntensity:.12,roughness:.2,metalness:.05});
    const body=new THREE.Mesh(new THREE.SphereGeometry(radius,16,12),material);body.position.y=1.25;body.scale.y=.92;
    const sphere=new THREE.SphereGeometry(1,8,6),dummy=new THREE.Object3D();
    function pair(color,positions,scale){const part=new THREE.InstancedMesh(sphere,new THREE.MeshBasicMaterial({color,toneMapped:false}),positions.length);positions.forEach((p,i)=>{dummy.position.set(p[0]*radius,p[1]*radius,p[2]*radius);dummy.scale.set(...scale);dummy.rotation.set(0,0,0);dummy.updateMatrix();part.setMatrixAt(i,dummy.matrix);});body.add(part);}
    pair(0x174972,[[-.3,.14,.94],[.3,.14,.94]],[.10,.15,.05]);
    pair(0xffffff,[[-.32,.21,.975],[.28,.21,.975],[-.38,.66,.62]],[.065,.08,.03]);
    pair(0xff9cc4,[[-.58,-.07,.83],[.58,-.07,.83]],[.17,.07,.035]);
    pair(0x54dfa2,[[-.17,.99,0],[.18,1.06,0]],[.38,.12,.19]);
    const mouth=new THREE.Mesh(new THREE.TorusGeometry(.13,.034,5,12,Math.PI),new THREE.MeshBasicMaterial({color:0x285279,toneMapped:false}));mouth.rotation.z=Math.PI;mouth.position.set(0,-.07,radius*.99);body.add(mouth);return body;
  }
  function actor(spec){
    return ArenaFieldVisuals.hero(spec?.tint,spec);
  }
  function house(color,label,loadSprite,textSprite){
    const g=new THREE.Group(),art=loadSprite('img/arena-maps/home.webp');art.material.toneMapped=false;art.scale.set(7.5,8.3,1);art.position.set(0,4,-.4);g.add(art);
    const ring=new THREE.Mesh(new THREE.RingGeometry(3,3.28,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.07;g.add(ring);
    const sign=textSprite(label,0xbbf7ff,256,64);sign.scale.set(4.6,1.15,1);sign.position.set(0,8.8,-.4);g.add(sign);return g;
  }
  function crystal(gem){
    gem.scale.set(1.65,2.1,1.65);gem.material.dispose();gem.material=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});const geo=gem.geometry,colors=new Float32Array(geo.attributes.position.count*3),palette=[0x26a3eb,0x7cffff,0x50cafa,0x0b77d1],c=new THREE.Color();
    for(let i=0;i<geo.attributes.position.count;i++){c.setHex(palette[Math.floor(i/3)%4]).convertSRGBToLinear();colors.set([c.r,c.g,c.b],i*3);}geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  }
  function choose(){
    if(typeof isAdmin!=='function'||!isAdmin())return Promise.resolve(null);if(picker)return picker.promise;
    const before=document.activeElement,root=document.createElement('div');root.id='va-map-picker';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','เลือกแผนที่');
    let choice=get(state.arenaMap).id,closed=false,busy=false,polling=false,snapshot=null,timer=null,resolve;
    const promise=new Promise(r=>{resolve=r;});picker={promise};
    root.innerHTML='<header><button data-close aria-label="กลับ">← กลับ</button><div><small>CHOOSE YOUR WORLD</small><h1>เลือกแผนที่ผจญภัย</h1></div><span>3 MAPS · 4 PLAYERS</span></header><div class="vam-cards">'+maps.map(m=>'<button class="vam-card" data-map="'+m.id+'" style="--accent:'+m.accent+'"><img src="'+m.thumb+'" alt="'+m.thai+'" width="384" height="216"><div><small>'+m.thai+'</small><h2>'+m.name+'</h2><p>'+m.desc+'</p><b class="vam-count">กำลังตรวจที่ว่าง…</b></div></button>').join('')+'</div><footer><div><strong id="vam-room">ห้อง 1</strong><p id="vam-note">แผนที่ละ 4 คน · เต็มทั้ง 3 แผนที่ ระบบเปิดห้องใหม่อัตโนมัติ</p></div><button id="vam-play">เข้าสู่แผนที่ →</button></footer>';
    document.body.append(root);const play=root.querySelector('#vam-play'),note=root.querySelector('#vam-note');
    function paint(){root.querySelectorAll('[data-map]').forEach((b,i)=>{const active=b.dataset.map===choice;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));if(snapshot)b.querySelector('.vam-count').textContent=(snapshot.offline?'ฝึกซ้อมออฟไลน์':Math.min(4,snapshot.counts[i])+' / 4 คน')+(snapshot.counts[i]>=4?' · เต็ม':'');});play.disabled=busy||!snapshot||snapshot.full;}
    async function refresh(){if(closed||polling||document.hidden)return;polling=true;try{const a=await inspect(choice);if(closed)return;a.full=a.counts[maps.indexOf(get(choice))]>=PER_MAP;snapshot=a;root.querySelector('#vam-room').textContent=a.offline?'เล่นคนเดียวกับศัตรู AI':'ห้อง '+a.group+' · เลือกแผนที่ของคุณ';note.textContent=a.exhausted?'ห้องออนไลน์เต็มทุกชุด · รอที่ว่างสักครู่':a.full?'แผนที่ที่เลือกเต็มแล้ว · เลือกอีกแผนที่ที่ยังมีที่ว่าง':'แผนที่ละ 4 คน · ครบทั้ง 3 แผนที่ จะเปิดห้องถัดไปอัตโนมัติ';paint();}catch(e){if(!closed){snapshot=null;play.disabled=true;note.textContent='ตรวจห้องไม่สำเร็จ · กำลังลองเชื่อมต่อใหม่';}}finally{polling=false;}}
    function close(result){if(closed)return;closed=true;clearInterval(timer);document.removeEventListener('keydown',keys);root.remove();picker=null;if(before?.isConnected)before.focus();resolve(result);}
    function keys(e){e.stopPropagation();if(e.code==='Escape'){e.preventDefault();close(null);}if(e.code==='Tab'){const b=[...root.querySelectorAll('button:not(:disabled)')],first=b[0],last=b[b.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
    root.addEventListener('click',async e=>{if(e.target.closest('[data-close]'))return close(null);const b=e.target.closest('[data-map]');if(b&&!busy){choice=b.dataset.map;snapshot=null;paint();refresh();return;}if(!e.target.closest('#vam-play')||busy||!snapshot||snapshot.full)return;
      busy=true;paint();play.textContent='กำลังเตรียมแผนที่…';try{await prepare(choice);const a=await inspect(choice);if(closed)return;snapshot=a;if(a.full){busy=false;paint();note.textContent='แผนที่เต็มระหว่างเตรียม · เลือกแผนที่ที่ยังว่าง';play.textContent='เข้าสู่แผนที่ →';return;}state.arenaMap=choice;if(typeof saveState==='function')saveState();close(choice);}catch(err){if(closed)return;busy=false;play.textContent='ลองโหลดอีกครั้ง';note.textContent='โหลดฉากไม่สำเร็จ · กดเพื่อลองใหม่';paint();}});
    document.addEventListener('keydown',keys);root.querySelector('[data-close]').focus();paint();refresh();timer=setInterval(refresh,5000);return promise;
  }
  window.ArenaMaps={maps,get,prepare,choose,decorate,camera,scenery,slime,actor,house,crystal,inspect,roomOptions,availability,countData,FIRST,GROUPS,PER_MAP};
})();
