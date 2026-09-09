"use strict";
/* ==== Rounds 1387/1389 — three world-ground arenas; one selected texture, grouped four-seat rooms ==== */
(function(){
  const maps=[
    {id:'sky',name:'Sky Citadel',thai:'ปราสาทลอยฟ้า',desc:'ลานหินอ่อนเหนือเมฆ · คริสตัลสีฟ้า',accent:'#75eaff',light:0xe5f6ff,ambient:0x91b7d9,art:'img/arena-maps/sky.avif',fallback:'img/arena-maps/sky.webp',thumb:'img/arena-maps/sky-thumb.webp'},
    {id:'crystal',name:'Crystal Hollow',thai:'ถ้ำคริสตัล',desc:'แสงอัญมณีม่วง · น้ำตกในถ้ำเวทมนตร์',accent:'#c59aff',light:0xb9b6ff,ambient:0x69729f,art:'img/arena-maps/crystal.avif',fallback:'img/arena-maps/crystal.webp',thumb:'img/arena-maps/crystal-thumb.webp'},
    {id:'forest',name:'Moonleaf Ruins',thai:'ป่าโบราณ',desc:'ซากวิหารกลางป่า · ผีเสื้อและแสงจันทร์',accent:'#87f2ce',light:0xffefd0,ambient:0x90bba3,art:'img/arena-maps/forest.avif',fallback:'img/arena-maps/forest.webp',thumb:'img/arena-maps/forest-thumb.webp'}
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
    const ambience=document.createElement('div');ambience.className='va-map-ambience';ambience.setAttribute('aria-hidden','true');for(let i=0;i<12;i++){const p=document.createElement('i');p.style.cssText='--i:'+i+';left:'+(4+(i*23)%92)+'%;top:'+(12+(i*37)%76)+'%;';ambience.append(p);}root.prepend(ambience);
  }
  function scenery(scene,id){
    const m=get(id),back=id==='sky'?0xb4dff4:id==='crystal'?0x151433:0x18352c;
    scene.background=new THREE.Color(back);scene.fog=new THREE.FogExp2(back,.004);
    const texture=selectedImage?.id===id?new THREE.Texture(selectedImage.image):new THREE.TextureLoader().load(m.art);
    if('colorSpace' in texture&&THREE.SRGBColorSpace)texture.colorSpace=THREE.SRGBColorSpace;else texture.encoding=THREE.sRGBEncoding;
    texture.needsUpdate=true;texture.anisotropy=2;
    const size=id==='sky'?96:90,centerY=id==='sky'?.46:.478;
    // Repeat only the outer terrain strip beyond the painted map; keep the arena itself unchanged.
    texture.repeat.set(2.6,2.6);texture.offset.set(-.8,-.8);
    const floorMat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
    floorMat.onBeforeCompile=shader=>{const sample=`vec2 outside=max(max(-vUv,vUv-1.0),0.0);
      vec2 border=0.1-abs(mod(outside,0.2)-0.1);
      vec2 terrainUv=mix(vUv,border,step(vUv,vec2(0.0)));
      terrainUv=mix(terrainUv,1.0-border,step(vec2(1.0),vUv));
      vec4 sampledDiffuseColor=texture2D(map,terrainUv);
      sampledDiffuseColor.rgb*=1.0-${id==='sky'?'0.08':'0.35'}*smoothstep(0.0,0.3,max(outside.x,outside.y));`;
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',THREE.ShaderChunk.map_fragment.replace('vec4 sampledDiffuseColor = texture2D( map, vUv );',sample));};
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(size*2.6,size*2.6),floorMat);floor.name='arena-ground';floor.rotation.x=-Math.PI/2;floor.position.set(0,-.025,(.5-centerY)*size);scene.add(floor);
    scene.add(new THREE.HemisphereLight(m.light,m.ambient,.7));const sun=new THREE.DirectionalLight(m.light,1.0);sun.position.set(-15,30,20);scene.add(sun);
    // A few instanced perimeter crystals give depth while the detailed terrain stays one draw.
    const stone=new THREE.MeshStandardMaterial({color:new THREE.Color(id==='sky'?0xe1e6e4:id==='crystal'?0x33345b:0x7b8e78).convertSRGBToLinear(),roughness:.82}),gold=new THREE.MeshStandardMaterial({color:new THREE.Color(id==='crystal'?0x77628e:0xb8a46d).convertSRGBToLinear(),roughness:.6});
    const shaft=new THREE.InstancedMesh(new THREE.CylinderGeometry(.72,.94,3.6,8),stone,8),caps=new THREE.InstancedMesh(new THREE.CylinderGeometry(1.12,1.12,.32,8),gold,16),gems=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.85,0),new THREE.MeshStandardMaterial({color:new THREE.Color(m.accent).convertSRGBToLinear(),emissive:new THREE.Color(m.accent).convertSRGBToLinear(),emissiveIntensity:.22,roughness:.22}),8),dummy=new THREE.Object3D();
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2,x=Math.cos(a)*32.8,z=Math.sin(a)*32.8;dummy.position.set(x,1.8,z);dummy.scale.set(1,1,1);dummy.updateMatrix();shaft.setMatrixAt(i,dummy.matrix);for(let j=0;j<2;j++){dummy.position.y=j?3.65:.15;dummy.updateMatrix();caps.setMatrixAt(i*2+j,dummy.matrix);}dummy.position.y=4.75;dummy.scale.set(1,1.6,1);dummy.updateMatrix();gems.setMatrixAt(i,dummy.matrix);}scene.add(shaft,caps,gems);
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
    if(picker)return picker.promise;
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
  window.ArenaMaps={maps,get,prepare,choose,decorate,scenery,slime,actor,house,crystal,inspect,roomOptions,availability,countData,FIRST,GROUPS,PER_MAP};
})();
