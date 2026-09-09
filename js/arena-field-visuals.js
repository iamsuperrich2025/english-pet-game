"use strict";
/* Round 1380 — small articulated heroes and bounded spell effects.
   All visuals are original procedural geometry / canvas textures: no image downloads. */
(function(){
  const TAU=Math.PI*2;
  function hero(color=0x428cff,spec=null){
    const g=new THREE.Group(), body=new THREE.Group();g.add(body);
    // Rounded cuboid shared within this actor; 96 triangles per part.
    const geo=new THREE.BoxGeometry(1,1,1,2,2,2),p=geo.attributes.position,v=new THREE.Vector3(),c=new THREE.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);c.copy(v).clampScalar(-.34,.34);v.sub(c).normalize().multiplyScalar(.16).add(c);p.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();
    const mats={armor:new THREE.MeshStandardMaterial({color,roughness:.65}),skin:new THREE.MeshStandardMaterial({color:0xffd6b0,roughness:.9}),dark:new THREE.MeshStandardMaterial({color:0x172d4f,roughness:.7}),metal:new THREE.MeshStandardMaterial({color:0xdaf4ff,roughness:.35,metalness:.3}),hair:new THREE.MeshStandardMaterial({color:spec?.hair||0x304c6b,roughness:.8}),gold:new THREE.MeshStandardMaterial({color:0xffcd69,roughness:.4,emissive:0x755218,emissiveIntensity:.2})};
    function box(parent,mat,x,y,z,sx,sy,sz){const m=new THREE.Mesh(geo,mats[mat]);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
    box(body,'armor',0,.86,0,.63,.66,.42);box(body,'skin',0,1.49,.05,.78,.69,.62);box(body,spec?'hair':'armor',0,1.82,-.035,.85,.25,.7);
    if(spec){box(body,'armor',0,.9,-.29,.76,.83,.1);if(spec.gender==='หญิง'){box(body,'hair',-.4,1.47,-.08,.21,.54,.3);box(body,'hair',.4,1.47,-.08,.21,.54,.3);}}
    box(body,'dark',-.17,1.51,.368,.075,.11,.025);box(body,'dark',.17,1.51,.368,.075,.11,.025);
    const legs=[new THREE.Group(),new THREE.Group()],arms=[new THREE.Group(),new THREE.Group()];
    legs.forEach((l,i)=>{l.position.set(i?.2:-.2,.61,0);body.add(l);box(l,'dark',0,-.26,0,.26,.52,.3);});
    arms.forEach((a,i)=>{a.position.set(i?.44:-.44,1.1,0);body.add(a);box(a,'armor',0,-.22,0,.23,.48,.27);});
    box(arms[0],'gold',0,-.3,.25,.48,.61,.14);
    box(arms[1],'metal',0,-.45,.52,.12,.12,.97);box(arms[1],'gold',0,-.45,.12,.36,.13,.13);
    g.userData.rig={body,legs,arms,attackUntil:0,attackAt:0,yaw:0};
    Object.values(mats).forEach(m=>m.color.convertSRGBToLinear());return g;
  }
  function strike(g,t){const r=g.userData.rig;if(r){r.attackAt=t;r.attackUntil=t+340;}}
  function animate(g,t,speed,yaw,down,dt=.016){
    const r=g.userData.rig;if(!r)return;
    const blend=1-Math.exp(-dt*16),delta=Math.atan2(Math.sin(yaw-r.yaw),Math.cos(yaw-r.yaw));r.yaw+=delta*blend;g.rotation.y=r.yaw;
    const walk=Math.sin(t*.017)*Math.min(1,speed/5),q=Math.max(0,Math.min(1,(t-r.attackAt)/340)),swing=t<r.attackUntil?Math.sin(q*Math.PI):0;
    r.body.position.y=Math.abs(walk)*.055;r.body.rotation.z=down?-1.15:-walk*.045;r.body.rotation.y=-swing*.6;
    r.legs[0].rotation.x=walk*.62;r.legs[1].rotation.x=-walk*.62;
    r.arms[0].rotation.x=-walk*.3-swing*.45;r.arms[1].rotation.x=walk*.3-swing*1.5;r.arms[1].rotation.y=-1.6*swing;
  }
  function house(color,label,textSprite){
    const g=new THREE.Group(),mat=new THREE.MeshStandardMaterial({color:0xc7dae3,roughness:.9}),roofMat=new THREE.MeshStandardMaterial({color,roughness:.65});
    const base=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.5,.25,24),new THREE.MeshStandardMaterial({color:0x497c89,roughness:.8}));base.position.y=.08;g.add(base);
    const wall=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.8,2.1),mat);wall.position.set(0,1,-.7);g.add(wall);
    const roof=new THREE.Mesh(new THREE.ConeGeometry(2.35,1.45,4),roofMat);roof.rotation.y=Math.PI/4;roof.scale.z=.85;roof.position.set(0,2.6,-.7);g.add(roof);
    const door=new THREE.Mesh(new THREE.BoxGeometry(.75,1.2,.12),new THREE.MeshBasicMaterial({color:0x173851}));door.position.set(0,.69,.4);g.add(door);
    const lamp=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.14),new THREE.MeshBasicMaterial({color:0xffe6a0}));lamp.position.set(.85,1.28,.41);g.add(lamp);
    const ring=new THREE.Mesh(new THREE.RingGeometry(3,3.1,64),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.position.y=.25;g.add(ring);
    const sign=textSprite(label,0xd7fbff,256,64);sign.scale.set(3.9,.98,1);sign.position.set(0,3.7,-.7);g.add(sign);const seen=new Set();g.traverse(o=>{if(o.material&&!o.isSprite&&!seen.has(o.material)){seen.add(o.material);o.material.color.convertSRGBToLinear();}});return g;
  }
  // Merge only the immutable arena scenery, before actors/effects are created.
  function compactStatic(scene){
    scene.updateMatrixWorld(true);const groups=new Map();
    scene.traverse(o=>{if(!o.isMesh||Array.isArray(o.material)||o.material.map)return;const m=o.material,key=[m.type,m.color.getHex(),m.emissive&&m.emissive.getHex(),m.emissiveIntensity,m.roughness,m.metalness,m.transparent,m.opacity,m.blending,m.side,m.depthWrite].join('|');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);});
    for(const meshes of groups.values()){
      if(meshes.length<2)continue;const copies=meshes.map(m=>{const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();return g.applyMatrix4(m.matrixWorld);}),count=copies.reduce((n,g)=>n+g.attributes.position.count,0),merged=new THREE.BufferGeometry();
      for(const [name,size] of [['position',3],['normal',3],['uv',2]]){const values=new Float32Array(count*size);let offset=0;for(const g of copies){if(g.attributes[name])values.set(g.attributes[name].array,offset);offset+=g.attributes.position.count*size;}merged.setAttribute(name,new THREE.BufferAttribute(values,size));}
      merged.computeBoundingSphere();const mat=meshes[0].material,disposed=new Set();meshes.forEach(m=>{m.parent.remove(m);m.geometry.dispose();if(m.material!==mat&&!disposed.has(m.material)){disposed.add(m.material);m.material.dispose();}});copies.forEach(g=>g.dispose());scene.add(new THREE.Mesh(merged,mat));
    }
  }
  function garden(scene){
    const rockGeo=new THREE.BoxGeometry(.85,.18,1.6),mat=new THREE.MeshStandardMaterial({color:new THREE.Color(0x8097ad).convertSRGBToLinear(),roughness:.95});
    const stones=new THREE.InstancedMesh(rockGeo,mat,100),dummy=new THREE.Object3D();
    for(let i=0;i<100;i++){const a=i/100*TAU;dummy.position.set(Math.sin(a)*30.7,.02,Math.cos(a)*30.7);dummy.rotation.y=a;dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);}scene.add(stones);
    const bushGeo=new THREE.IcosahedronGeometry(.7,0),bushMat=new THREE.MeshStandardMaterial({color:new THREE.Color(0x398877).convertSRGBToLinear(),roughness:1}),bushes=new THREE.InstancedMesh(bushGeo,bushMat,60);
    for(let i=0;i<60;i++){const a=i/60*TAU,r=28+(i%3)*.6;dummy.position.set(Math.sin(a)*r,.3,Math.cos(a)*r);dummy.scale.set(1,.5,1);dummy.updateMatrix();bushes.setMatrixAt(i,dummy.matrix);}scene.add(bushes);
  }
  function createFx(scene,low){
    const cap=low?256:640,positions=new Float32Array(cap*3),colors=new Float32Array(cap*3),life=new Float32Array(cap),max=new Float32Array(cap),vel=new Float32Array(cap*3),baseColor=new Float32Array(cap*3);
    positions.fill(0);for(let i=0;i<cap;i++)positions[i*3+1]=-100;
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geo.setAttribute('color',new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage));
    const texCanvas=document.createElement('canvas');texCanvas.width=texCanvas.height=32;const ctx=texCanvas.getContext('2d'),gr=ctx.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'#fff');gr.addColorStop(.18,'#fff');gr.addColorStop(.45,'#ffffffb0');gr.addColorStop(1,'#ffffff00');ctx.fillStyle=gr;ctx.fillRect(0,0,32,32);
    const map=new THREE.CanvasTexture(texCanvas),mat=new THREE.PointsMaterial({size:.44,map,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
    const points=new THREE.Points(geo,mat);points.frustumCulled=false;scene.add(points);let cursor=0;
    const color=new THREE.Color();
    function burst(pos,col,n=20,force=4){color.setHex(col).convertSRGBToLinear();for(let j=0;j<Math.min(n,cap);j++){const i=cursor++%cap,k=i*3,a=Math.random()*TAU,f=(.25+Math.random())*force;positions[k]=pos.x;positions[k+1]=(pos.y||0)+.6;positions[k+2]=pos.z;vel[k]=Math.cos(a)*f;vel[k+1]=Math.random()*force*.8;vel[k+2]=Math.sin(a)*f;life[i]=max[i]=.35+Math.random()*.55;baseColor[k]=color.r;baseColor[k+1]=color.g;baseColor[k+2]=color.b;}}
    const runeCanvas=document.createElement('canvas');runeCanvas.width=runeCanvas.height=256;const rc=runeCanvas.getContext('2d');rc.strokeStyle='#fff';rc.lineWidth=2;
    for(const r of [68,103,120]){rc.beginPath();rc.arc(128,128,r,0,TAU);rc.stroke();}
    for(let i=0;i<12;i++){const a=i/12*TAU;rc.save();rc.translate(128,128);rc.rotate(a);rc.strokeRect(79,-6,13,12);rc.beginPath();rc.moveTo(105,0);rc.lineTo(118,0);rc.stroke();rc.restore();}
    for(let j=0;j<2;j++){rc.beginPath();for(let i=0;i<3;i++){const a=i/3*TAU+j*Math.PI;const x=128+Math.cos(a)*68,y=128+Math.sin(a)*68;i?rc.lineTo(x,y):rc.moveTo(x,y);}rc.closePath();rc.stroke();}
    const runeMap=new THREE.CanvasTexture(runeCanvas),ringGeo=new THREE.RingGeometry(.9,1,72),planeGeo=new THREE.PlaneGeometry(2,2),beamGeo=new THREE.CylinderGeometry(.04,.1,1,5,1,true),domeGeo=new THREE.SphereGeometry(1,24,12,0,TAU,0,Math.PI/2);
    /* ==== 🌪 Round 1381: reusable elemental silhouettes ==== */
    const coneGeo=new THREE.ConeGeometry(1,3,7),shardGeo=new THREE.OctahedronGeometry(1,0),orbGeo=new THREE.IcosahedronGeometry(1,1),haloGeo=new THREE.TorusGeometry(1,.045,5,56),waveGeo=new THREE.CylinderGeometry(1,1,2.4,32,1,true,0,Math.PI);
    const ribbon=[],ribbonIndex=[];
    for(let i=0;i<=64;i++){const t=i/64,a=t*Math.PI*7,r=.35+t*4.3;for(const edge of [-1,1]){const aa=a+edge*.16;ribbon.push(Math.cos(aa)*r,t*9,Math.sin(aa)*r);}if(i<64){const n=i*2;ribbonIndex.push(n,n+1,n+2,n+1,n+3,n+2);}}
    const twisterGeo=new THREE.BufferGeometry();twisterGeo.setAttribute('position',new THREE.Float32BufferAttribute(ribbon,3));twisterGeo.setIndex(ribbonIndex);twisterGeo.computeVertexNormals();
    const boundaryGeo=new THREE.RingGeometry(.984,1,96);
    const elementalGeos={boundary:boundaryGeo,flame:coneGeo,shard:shardGeo,meteor:orbGeo,core:orbGeo,orbit:haloGeo,wind:twisterGeo,water:waveGeo};
    const pool=[],qUp=new THREE.Vector3(0,1,0),delta=new THREE.Vector3();
    for(let i=0;i<(low?28:48);i++){const m=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));m.visible=false;scene.add(m);pool.push({m,life:0,max:1,kind:'ring',size:1,anchor:new THREE.Vector3(),serial:0,phase:0});}
    let index=0;
    function take(kind,pos,col,size,duration){const f=pool[index++%pool.length];f.serial++;f.phase=index*.73;f.yaw=0;f.kind=kind;f.life=f.max=duration;f.size=size;const m=f.m;m.geometry=elementalGeos[kind]||(kind==='rune'?planeGeo:kind==='beam'?beamGeo:kind==='dome'?domeGeo:ringGeo);m.material.blending=THREE.AdditiveBlending;m.material.map=kind==='rune'?runeMap:null;m.material.needsUpdate=true;m.material.color.setHex(col).convertSRGBToLinear();m.material.toneMapped=false;m.material.opacity=1;m.visible=true;m.position.set(pos.x,.13+(pos.y||0),pos.z);m.rotation.set(kind==='beam'||kind==='dome'||(elementalGeos[kind]&&kind!=='boundary')?0:-Math.PI/2,0,0);m.scale.setScalar(1);f.anchor.copy(m.position);return f;}
    function ring(pos,col,size=5,duration=.6){take('ring',pos,col,size,duration);}
    function beam(a,b,col,duration=.3){const f=take('beam',a,col,1,duration);delta.copy(b).sub(a);if(delta.length()<.01)delta.y=.01;f.m.position.copy(a).addScaledVector(delta,.5);f.m.position.y+=.7;f.m.scale.set(1,delta.length(),1);f.m.quaternion.setFromUnitVectors(qUp,delta.normalize());}
    function spell(pos,kind){const col=kind==='ult'?0xffce79:kind==='arc'?0x5cddff:0xc16bff,r=kind==='ult'?16:kind==='nova'?7:4;
      take('rune',pos,col,r,1.2);ring(pos,col,r,.8);ring(pos,0xffffff,r*.74,.6);burst(pos,col,low?32:80,kind==='ult'?12:7);
      if(kind==='nova'||kind==='ult')take('dome',pos,kind==='ult'?0x63cfff:0xdf6dff,r, .9);
      if(kind==='ult')for(let i=0;i<10;i++){const a=i/10*TAU,x=pos.x+Math.cos(a)*r*.7,z=pos.z+Math.sin(a)*r*.7;beam(new THREE.Vector3(x,11,z),new THREE.Vector3(x,0,z),i%2?0xff79dc:0xffeab2,.55+i*.025);}
    }
    function element(kind,pos,opts={}){
      const r=opts.r||5,life=opts.life||1.4,records=[];
      const add=(k,p,c,size,duration)=>{const f=take(k,p,c,size,duration);if(['flame','wind','water'].includes(k))f.m.material.blending=THREE.NormalBlending;records.push({f,serial:f.serial,offset:f.anchor.clone().sub(pos)});return f;};
      const at=(x=0,y=0,z=0)=>new THREE.Vector3(pos.x+x,pos.y+y,pos.z+z);
      if(kind==='fire'){
        add('rune',pos,0xff541f,r,life);add('dome',pos,0xff7627,r*1.12,.95);for(let i=0;i<12;i++){const a=i/12*TAU;add('flame',at(Math.cos(a)*r*.66,1,Math.sin(a)*r*.66),i%2?0xff5429:0xffd35e,2.25,life);}ring(pos,0xff993d,r*1.15,.8);ring(pos,0xfff2a1,r*.72,.5);burst(pos,0xffad39,110,9);
      }else if(kind==='wind'){
        for(let i=0;i<5;i++)add('wind',pos,i%2?0xddffee:0x52eac9,r/3.8,life);add('rune',pos,0x68ffc5,r*1.08,life);ring(pos,0xd4fff7,r*.7,.55);burst(pos,0xbafff5,90,8);
      }else if(kind==='ice'||kind==='earth'){
        const ice=kind==='ice',col=ice?0x5bdcff:0xffba58;add('rune',pos,col,r,1.1);ring(pos,col,r,.7);
        for(let i=0;i<9;i++){const a=i/9*TAU;add(ice?'shard':'flame',at(Math.cos(a)*r*.67,1,Math.sin(a)*r*.67),i%2?col:ice?0xd4ffff:0xd7883a,ice?1.1:1.45,1.6);}
        ring(pos,ice?0xd4ffff:0xffe0a1,r*1.08,.8);burst(pos,col,120,11);
      }else if(kind==='meteor'){
        add('rune',pos,0xff872f,r*1.1,life);add('meteor',pos,0xffd879,1.5,life);add('meteor',pos,0xff5c20,2.2,life).phase=1;burst(pos,0xffc24c,45,7);
      }else if(kind==='impact'||kind==='collapse'){
        const col=kind==='impact'?0xff863a:0xcd69ff;add('dome',pos,col,r,.5);ring(pos,col,r,.7);ring(pos,0xffedcd,r*.65,.45);burst(pos,col,85,10);
      }else if(kind==='gravity'){
        const core=add('core',at(0,2,0),0x080d22,2,life);core.m.material.blending=THREE.NormalBlending;
        for(let i=0;i<4;i++)add('orbit',at(0,2,0),i%2?0xf3b6ff:0x974cff,r*(.4+i*.14),life);add('rune',pos,0x9c66ff,r*1.08,life);ring(pos,0xe1b7ff,r*.8,.65);burst(pos,0xc46dff,100,7);
      }else if(kind==='water'){
        const f=add('water',at(0,1,0),0x47bfff,r*1.12,life);f.yaw=opts.yaw||0;const crest=add('water',at(0,1.35,0),0xbbf9ff,r*1.08,life);crest.yaw=f.yaw;ring(pos,0xc8f7ff,r*.9,.55);burst(pos,0x70e1ff,100,8);
      }else if(kind==='light'){
        add('dome',pos,0xffe9a2,r*1.12,1.8);add('rune',pos,0xffcf60,r*1.1,2.2);for(let i=0;i<8;i++){const a=i/8*TAU,p=at(Math.cos(a)*3.5,0,Math.sin(a)*3.5);beam(p,at(Math.cos(a)*3.5,10,Math.sin(a)*3.5),0xfff6c1,1.35);}ring(pos,0xffffe4,r*.85,.7);burst(pos,0xb6ff99,120,8);
      }
      return {move(next){for(const h of records)if(h.f.serial===h.serial&&h.f.life>0){h.f.anchor.copy(next).add(h.offset);h.f.m.position.copy(h.f.anchor);}}};
    }
    function mega(pos,kind,r){
      const col=parseInt(ArenaElements.byId[kind].color.slice(1),16),visualR=Math.min(26,r*1.45);
      element(kind,pos,{r:visualR,life:2.8});
      const rim=take('boundary',pos,0xff55bf,visualR+.12,2.8);rim.m.material.blending=THREE.NormalBlending;
      take('boundary',pos,col,visualR,2.8);take('rune',pos,col,visualR,2.8);take('dome',pos,0x78dfff,visualR*.98,2.8);ring(pos,0xffffff,visualR*1.03,1.1);burst(pos,col,low?72:160,19);
    }
    function slash(pos,yaw){const f=take('slash',pos,0xb9faff,2.5,.25);f.m.geometry=newSlashGeo;f.m.rotation.z=-yaw+.6;f.m.position.y=.75;}
    const newSlashGeo=new THREE.RingGeometry(.72,1,32,1,0,Math.PI*1.35);
    function tick(dt){for(let i=0;i<cap;i++){if(life[i]<=0)continue;life[i]-=dt;const k=i*3,f=Math.max(0,life[i]/max[i]);if(f===0){positions[k+1]=-100;continue;}positions[k]+=vel[k]*dt;positions[k+1]+=vel[k+1]*dt;positions[k+2]+=vel[k+2]*dt;vel[k+1]-=dt*4;colors[k]=baseColor[k]*f;colors[k+1]=baseColor[k+1]*f;colors[k+2]=baseColor[k+2]*f;}geo.attributes.position.needsUpdate=true;geo.attributes.color.needsUpdate=true;
      for(const f of pool){
        if(f.life<=0)continue;f.life-=dt;const p=1-Math.max(0,f.life/f.max),m=f.m,age=f.max-f.life,fade=Math.min(1,(1-p)*4);m.visible=f.life>0;m.material.opacity=(1-p)*(f.kind==='dome'?.13:.9);
        if(f.kind==='boundary'){m.scale.setScalar(f.size);m.material.opacity=Math.min(1,age*8)*fade*.95;}
        else if(f.kind==='wind'){m.rotation.set(0,age*4+f.phase,0);m.scale.set(f.size,1,f.size);m.material.opacity=fade*.68;}
        else if(f.kind==='flame'){m.scale.set(f.size*.55,f.size*(.8+Math.sin(age*14+f.phase)*.25)*fade,f.size*.55);m.material.opacity=fade*.95;}
        else if(f.kind==='shard'){m.scale.set(f.size*.4,f.size*(1.4+Math.sin(p*Math.PI)*.7),f.size*.4);m.rotation.y=age*.7+f.phase;}
        else if(f.kind==='meteor'){m.position.set(f.anchor.x+6*(1-p),f.anchor.y+13*(1-p),f.anchor.z-3*(1-p));m.scale.setScalar(f.size);m.rotation.x+=dt*3;m.material.opacity=f.size>1.2?.34:1;}
        else if(f.kind==='orbit'){m.rotation.set(.6+f.phase,age*2,age+f.phase);m.scale.setScalar(f.size*(1-.2*p));m.material.opacity=fade*.9;}
        else if(f.kind==='core'){m.scale.setScalar(f.size*(.85+Math.sin(age*7)*.1));m.material.opacity=fade;}
        else if(f.kind==='water'){m.rotation.set(0,f.yaw,0);m.scale.set(f.size,1+Math.sin(p*Math.PI)*.4,f.size);m.material.opacity=fade*.27;}
        else {if(f.kind!=='beam')m.scale.setScalar(f.size*(f.kind==='rune'?.9+.1*p:.15+.85*Math.sin(p*Math.PI/2)));if(f.kind==='rune'||f.kind==='slash')m.rotation.z+=dt*(f.kind==='slash'?8:.6);}
      }
    }

    function dispose(){scene.remove(points);pool.forEach(f=>{scene.remove(f.m);f.m.material.dispose();});[geo,ringGeo,planeGeo,beamGeo,domeGeo,boundaryGeo,newSlashGeo,coneGeo,shardGeo,orbGeo,haloGeo,waveGeo,twisterGeo].forEach(g=>g.dispose());[mat,map,runeMap].forEach(m=>m.dispose());}
    return {burst,ring,beam,spell,element,mega,slash,tick,dispose,stats:()=>({particles:cap,active:life.reduce((n,x)=>n+(x>0),0),meshes:pool.length})};
  }
  window.ArenaFieldVisuals={hero,animate,strike,house,createFx,garden,compactStatic};
})();
