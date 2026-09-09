/* 🏝️ รอบ 1377 — Vocab World Kart: Soft Cuboid Chibi 3D island kart profile.
   Geometry/materials are shared across all colours, preview and cockpit. No raster downloads.
   This module owns presentation/tuning only; F1's racing, vocabulary, reward and input engine stays shared. */
(function(root){
'use strict';
const T=root.THREE, geometryCache=new Map(),paintCache=new Map();
const vertexMat=new T.MeshPhongMaterial({vertexColors:true,shininess:65,specular:0x303030});
const staticMat=new T.MeshLambertMaterial({vertexColors:true});
const white=0xfff8dc,black=0x202630,gold=0xffcf36;
let kit=null,waterfalls=[],lastSteer=0;
function softBox(w,h,d,r=.12){
  const key=[w,h,d,r].join(':');if(geometryCache.has(key))return geometryCache.get(key);
  const g=new T.BoxGeometry(w,h,d,3,3,3),p=g.attributes.position;
  const inner=new T.Vector3(),v=new T.Vector3(),normal=new T.Vector3();
  for(let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);inner.set(Math.max(-w/2+r,Math.min(w/2-r,v.x)),Math.max(-h/2+r,Math.min(h/2-r,v.y)),Math.max(-d/2+r,Math.min(d/2-r,v.z)));
    normal.copy(v).sub(inner).normalize();v.copy(inner).addScaledVector(normal,r);p.setXYZ(i,v.x,v.y,v.z);
  }
  g.computeVertexNormals();geometryCache.set(key,g);return g;
}
function merge(parts){
  const pos=[],norm=[],colors=[],matrix=new T.Matrix4(),normalMatrix=new T.Matrix3(),p=new T.Vector3(),n=new T.Vector3(),col=new T.Color();
  for(const a of parts){
    const g=a.g,ix=g.index,ap=g.attributes.position,an=g.attributes.normal;
    matrix.compose(new T.Vector3(...(a.p||[0,0,0])),new T.Quaternion().setFromEuler(new T.Euler(...(a.r||[0,0,0]))),new T.Vector3(...(a.s||[1,1,1])));
    normalMatrix.getNormalMatrix(matrix);col.setHex(a.c==null?0xffffff:a.c).convertSRGBToLinear();
    for(let j=0;j<(ix?ix.count:ap.count);j++){
      const i=ix?ix.getX(j):j;p.fromBufferAttribute(ap,i).applyMatrix4(matrix);n.fromBufferAttribute(an,i).applyMatrix3(normalMatrix).normalize();
      pos.push(p.x,p.y,p.z);norm.push(n.x,n.y,n.z);colors.push(col.r,col.g,col.b);
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(norm,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}
function box(parts,c,w,h,d,x,y,z,r=.09,rot){parts.push({g:softBox(w,h,d,Math.min(r,w*.23,h*.23,d*.23)),c,p:[x,y,z],r:rot});}
function starGeo(size=.26){
  const s=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?size*.45:size;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();return new T.ShapeGeometry(s);
}
function makeKit(){
  if(kit)return kit;
  const paint=[],trim=[],driver=[],steering=[],cuffs=[],wheel=[];
  box(paint,0xffffff,1.9,.35,2.85,0,.55,.05,.14);
  box(paint,0xffffff,1.8,.36,1.27,0,.84,1.01,.14);
  box(paint,0xffffff,.3,.52,1.4,-.91,.84,-.24);box(paint,0xffffff,.3,.52,1.4,.91,.84,-.24);
  box(paint,0xffffff,1.82,.4,.48,0,.92,-1.36);
  box(trim,black,2.4,.26,.35,0,.42,1.75);box(trim,black,2.27,.24,.35,0,.4,-1.65);
  for(const x of [-.72,.72]){
    box(trim,0x684324,.52,.42,.08,x,.88,1.67,.06);
    box(trim,gold,.42,.31,.095,x,.88,1.725,.06);box(trim,0xfffbc2,.28,.2,.035,x,.9,1.78,.04);
    box(trim,0xff3428,.22,.1,.07,x,.71,-1.65,.025);
  }
  box(trim,white,.24,.018,1.29,0,1.025,1.02,.003);
  trim.push({g:starGeo(.29),c:white,p:[.49,1.03,1.07],r:[-Math.PI/2,0,0]});
  box(trim,black,1.14,.19,1.18,0,.76,-.36,.07);box(trim,black,.96,.58,.23,0,1.02,-.96,.1);
  for(const x of [-.65,.65])box(trim,black,.09,.65,.1,x,1.05,-1.47,.02);

  box(driver,0xffd1a0,.96,.73,.76,0,1.91,-.39,.19);
  box(driver,0xffd1a0,.17,.27,.3,-.53,1.88,-.36,.06);box(driver,0xffd1a0,.17,.27,.3,.53,1.88,-.36,.06);
  box(driver,0xffffff,1.18,.34,1.02,0,2.32,-.46,.16);
  // Painted helmet kit shares the selected vehicle material, while the friendly face stays visible.
  const helmet=[{g:new T.SphereGeometry(.6,18,12,0,Math.PI*2,0,Math.PI/2),c:0xffffff,p:[0,2.19,-.46],s:[1,.87,.89]}];
  box(helmet,0xffffff,.73,.65,.49,0,1.34,-.45,.16);
  box(helmet,0xffffff,.24,.66,.82,-.5,2.06,-.55,.10);box(helmet,0xffffff,.24,.66,.82,.5,2.06,-.55,.10);
  driver.push({g:new T.SphereGeometry(.607,4,14,Math.PI/2-.14,.28,0,Math.PI/2),c:white,p:[0,2.19,-.46],s:[1,.87,.89]});
  driver.push({g:starGeo(.2),c:white,p:[.32,2.43,.061]});
  for(const x of [-.23,.23]){
    box(driver,0x271b16,.13,.19,.025,x,1.99,.003,.026);box(driver,white,.045,.062,.02,x-.021,2.025,.025,.01);
    box(driver,0x763622,.18,.047,.03,x,2.13,.019,.015);
    box(driver,0xf5987a,.17,.07,.024,x*1.38,1.85,.01,.024);
  }
  box(driver,0x562a1e,.34,.15,.026,0,1.77,.012,.04);box(driver,white,.24,.051,.018,0,1.816,.03,.012);
  const ring=new T.TorusGeometry(.39,.055,7,24);
  steering.push({g:ring,c:black});box(steering,black,.64,.072,.07,0,0,0,.025);box(steering,black,.075,.33,.07,0,-.12,0,.025);
  box(steering,gold,.19,.16,.09,0,0,.04,.04);
  for(const x of [-.39,.39]){box(steering,0xffd1a0,.23,.24,.22,x,0,0,.065);box(cuffs,0xffffff,.21,.28,.24,x,-.2,-.035,.05);}
  const tyre=new T.CylinderGeometry(.46,.46,.32,16,1);wheel.push({g:tyre,c:0x181c22,r:[0,0,Math.PI/2]});
  for(const x of [-.172,.172]){
    wheel.push({g:new T.CylinderGeometry(.27,.27,.025,12),c:gold,p:[x,0,0],r:[0,0,Math.PI/2]});
    wheel.push({g:new T.CylinderGeometry(.105,.105,.032,10),c:0x72777c,p:[x*1.09,0,0],r:[0,0,Math.PI/2]});
  }
  for(let i=0;i<16;i++){const a=i*Math.PI/8;box(wheel,0x323740,.325,.055,.12,0,Math.cos(a)*.452,Math.sin(a)*.452,.012,[a,0,0]);}
  kit={paint:merge(paint),trim:merge(trim),driver:merge(driver),helmet:merge(helmet),steering:merge(steering),cuffs:merge(cuffs),wheel:merge(wheel),flap:softBox(2.05,.14,.46,.05)};return kit;
}
function paintMat(c){if(!paintCache.has(c))paintCache.set(c,new T.MeshPhongMaterial({color:new T.Color(c).convertSRGBToLinear(),shininess:65,specular:0x252525}));const m=paintCache.get(c);m.userData.kartLinear=true;return m;}
function buildCar(c){
  const k=makeKit(),g=new T.Group();g.name='Island Star Kart';
  g.add(new T.Mesh(k.paint,paintMat(c)),new T.Mesh(k.trim,vertexMat));
  const driver=new T.Group();driver.add(new T.Mesh(k.driver,vertexMat),new T.Mesh(k.helmet,paintMat(c)));g.add(driver);
  const steering=new T.Group();steering.add(new T.Mesh(k.steering,vertexMat),new T.Mesh(k.cuffs,paintMat(c)));steering.position.set(0,1.2,.34);steering.rotation.x=-.3;g.add(steering);
  const front=[],wheels=[];for(const x of [-1.02,1.02])for(const z of [-1.04,1.12]){
    const mount=new T.Group(),w=new T.Mesh(k.wheel,vertexMat);mount.position.set(x,.48,z);mount.add(w);g.add(mount);wheels.push(w);if(z>0)front.push(mount);
  }
  const flap=new T.Mesh(k.flap,paintMat(c));flap.position.set(0,1.4,-1.48);g.add(flap);
  g.userData={modelKind:'island-star-kart',driver,steering,drsFlap:flap,front:[],wheels:[],kartFront:front,kartWheels:wheels,disposePeer(){},peerGpu:{drawCalls:10,textures:0,sharedGeometry:true}};return g;
}
function carView(g,mode){g.visible=mode!=='road';g.userData.driver.visible=mode!=='cockpit';}
function steer(g,angle){if(!g)return;lastSteer=angle;g.userData.steering.rotation.z=angle*2.2;g.userData.kartFront.forEach(w=>w.rotation.y=-angle);}
function camera(c,g,mode,p,dt){
  if(!g)return false;carView(g,mode);steer(g,lastSteer);
  g.userData.kartWheels.forEach(w=>w.rotation.x+=p.spd*dt/.46);
  const f=Math.sin(p.yaw),z=Math.cos(p.yaw);
  if(mode==='cockpit'){
    c.position.set(p.px+f*(-.78),p.py+1.95,p.pz+z*(-.78));
    c.lookAt(p.px+f*18,p.py+.7+Math.sin(p.pitch)*18,p.pz+z*18);c.rotateZ(p.roll*.5);
    c.fov=76+Math.min(6,p.spd/5);c.near=.075;c.updateProjectionMatrix();return true;
  }
  return false;
}
function applyEnvironment(scene,r,c,lights,mobile){
  scene.background=new T.Color(0x71c9f7);scene.fog=new T.Fog(0xade5f4,160,720);
  c.far=1000;c.updateProjectionMatrix();r.setPixelRatio(Math.min(root.devicePixelRatio||1,mobile?1.25:1.75));
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.NoToneMapping;r.toneMappingExposure=1;
  scene.traverse(o=>{for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m&&m.color&&!m.vertexColors&&!m.userData.kartLinear){m.color.convertSRGBToLinear();m.userData.kartLinear=true;}});
  lights.hemi.color.setHex(0xd9f2ff);lights.hemi.groundColor.setHex(0x8b8042);lights.hemi.intensity=.65;
  lights.sun.color.setHex(0xfff1ce);lights.sun.intensity=.85;lights.sun.position.set(-80,180,60);
  lights.warm.visible=false;
}
// Solid Kart road corridor. Sweep movement in <=0.75 m steps, including peer pushes,
// so a fast frame cannot tunnel through a roadside wall into a nearby track section.
let boundarySegments=[];
function boundaryPoint(x,z){
  let best=null,gap=Infinity;
  for(const b of boundarySegments){
    const t=Math.max(0,Math.min(1,((x-b.x)*b.dx+(z-b.z)*b.dz)/b.len2));
    const qx=b.x+t*b.dx,qz=b.z+t*b.dz,dx=x-qx,dz=z-qz,dist=Math.hypot(dx,dz),g=dist-b.limit;
    if(g<gap){gap=g;best={x:qx,z:qz,dx,dz,dist,limit:b.limit,gap:g};}
    if(g<=0)return null;
  }
  return best;
}
function collideBoundary(fromX,fromZ,x,z,vx,vz){
  const steps=Math.max(1,Math.ceil(Math.hypot(x-fromX,z-fromZ)/.75));
  for(let i=1;i<=steps;i++){
    const qx=fromX+(x-fromX)*i/steps,qz=fromZ+(z-fromZ)*i/steps,b=boundaryPoint(qx,qz);
    if(!b)continue;
    const nx=b.dx/(b.dist||1),nz=b.dz/(b.dist||1),outward=vx*nx+vz*nz;
    if(outward>0){vx-=nx*outward*1.48;vz-=nz*outward*1.48;}
    const normal=vx*nx+vz*nz;
    return {x:b.x+nx*(b.limit-.03),z:b.z+nz*(b.limit-.03),vx:vx*.88+nx*normal*.12,vz:vz*.88+nz*normal*.12};
  }
  return null;
}
function buildTrack(a){
  const {scene,LINE:L,sfIdx,HALF_W,RUNOFF_W,ribbonGeo,kerbStrips,TexLib}=a;
  const groups=new Map();waterfalls=[];TexLib.kerb.encoding=T.sRGBEncoding;
  boundarySegments=[];
  function boundarySegment(x,z,qx,qz,limit){const dx=qx-x,dz=qz-z,len2=dx*dx+dz*dz;if(len2>1e-8)boundarySegments.push({x,z,dx,dz,len2,limit});}
  for(let i=0;i<L.n;i++){const j=(i+1)%L.n;boundarySegment(L.x[i],L.z[i],L.x[j],L.z[j],HALF_W+RUNOFF_W-1.45);}
  for(let i=1;i<profile.map.pit.length;i++){const p=profile.map.pit[i-1],q=profile.map.pit[i];boundarySegment(p[0],p[1],q[0],q[1],4.5);}

  function part(c,g,p,r,s){const key=String(c);if(!groups.has(key))groups.set(key,[]);groups.get(key).push({c,g,p,r,s});}
  const cube=new T.BoxGeometry(1,1,1);
  function block(c,x,y,z,w,h,d,ry=0){part(c,cube,[x,y,z],[0,ry,0],[w,h,d]);}
  function point(i,lat){i=(i%L.n+L.n)%L.n;return {x:L.x[i]+L.nx[i]*lat,z:L.z[i]+L.nz[i]*lat,yaw:Math.atan2(L.tx[i],L.tz[i]),i};}
  // Round 1378: validate scenery against EVERY road segment, including the pit lane.
  // A nearby hairpin can pass through the outside of a different bend.
  const roadSegments=[];
  for(let i=0;i<L.n;i++){const j=(i+1)%L.n;roadSegments.push([L.x[i],L.z[i],L.x[j],L.z[j],HALF_W+RUNOFF_W+1]);}
  for(let i=1;i<profile.map.pit.length;i++){const p=profile.map.pit[i-1],q=profile.map.pit[i];roadSegments.push([p[0],p[1],q[0],q[1],7.5]);}
  const sceneryBounds=[];scene.userData.kartSceneryBounds=sceneryBounds;
  function sceneryClear(x,z,w,d,yaw=0){
    const c=Math.cos(yaw),s=Math.sin(yaw);
    for(const [ax,az,bx,bz,margin] of roadSegments){
      const x0=c*(ax-x)-s*(az-z),z0=s*(ax-x)+c*(az-z);
      const dx=c*(bx-ax)-s*(bz-az),dz=s*(bx-ax)+c*(bz-az);
      let lo=0,hi=1;
      for(const [p,v,h] of [[x0,dx,w/2+margin],[z0,dz,d/2+margin]]){
        if(Math.abs(v)<1e-8){if(Math.abs(p)>h){lo=2;break;}}
        else{const a=(-h-p)/v,b=(h-p)/v;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}
      }
      if(lo<=hi)return false;
    }
    return true;
  }
  function reserveScenery(kind,x,z,w,d,yaw=0){
    if(!sceneryClear(x,z,w,d,yaw))return false;
    sceneryBounds.push({kind,x,z,w,d,yaw});return true;
  }
  function palm(x,z,scale=1){
    if(!reserveScenery('palm',x,z,8*scale,8*scale))return;
    for(let j=0;j<5;j++)block(0x946035,x+j*.13*scale,(j*.85+.42)*scale,z,.72*scale,.92*scale,.76*scale,j*.11);
    for(let j=0;j<7;j++){
      const angle=j*Math.PI*2/7;part(0x69a42e,new T.BoxGeometry(.9,.22,3.7),[x+Math.sin(angle)*1.5*scale,4.7*scale,z+Math.cos(angle)*1.5*scale],[.32,angle,0],[scale,scale,scale]);
      part(0x96c33b,new T.BoxGeometry(.64,.18,2.3),[x+Math.sin(angle)*.8*scale,5*scale,z+Math.cos(angle)*.8*scale],[-.28,angle,0],[scale,scale,scale]);
    }
  }
  for(const side of [-1,1]){const p=point(sfIdx-3,side*24);palm(p.x,p.z,2.2);}
  const ground=new T.Mesh(new T.PlaneGeometry(2600,2600),new T.MeshLambertMaterial({color:0x66b9b6}));ground.rotation.x=-Math.PI/2;ground.position.y=-4;scene.add(ground);
  scene.add(new T.Mesh(ribbonGeo(HALF_W+RUNOFF_W+22,0,-.12,35),new T.MeshLambertMaterial({color:0x8bc13f})));
  scene.add(new T.Mesh(ribbonGeo(HALF_W+RUNOFF_W,0,-.01,30),new T.MeshLambertMaterial({color:0xd6b67d})));
  const dirt=document.createElement('canvas');dirt.width=dirt.height=256;const ctx=dirt.getContext('2d');
  ctx.fillStyle='#cba777';ctx.fillRect(0,0,256,256);
  let seed=1377;for(let i=0;i<9000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%256;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%256;ctx.fillStyle=i%2?'#b99a7055':'#efd1a04d';ctx.fillRect(x,y,i%7?1:2,1);}
  const roadTex=new T.CanvasTexture(dirt);roadTex.wrapS=roadTex.wrapT=T.RepeatWrapping;roadTex.encoding=T.sRGBEncoding;
  scene.add(new T.Mesh(ribbonGeo(HALF_W,0,.025,22),new T.MeshLambertMaterial({map:roadTex})));
  scene.add(kerbStrips());
  const lights=[],sf=point(sfIdx,0),gantry=new T.Group();gantry.position.set(sf.x,0,sf.z);gantry.rotation.y=sf.yaw;
  const postMat=new T.MeshLambertMaterial({color:0x966032}),checks=[];
  for(const x of [-11,11]){const p=new T.Mesh(softBox(1.1,9,1.2,.12),postMat);p.position.set(x,4.5,0);gantry.add(p);}
  for(let row=0;row<3;row++)for(let col=0;col<18;col++){
    checks.push({g:cube,c:(row+col)%2?0xfff9dc:0x343237,p:[(col-8.5)*1.2,8.2+row*.7,0],s:[1.2,.7,.6]});
  }
  for(let i=0;i<5;i++){
    const m=new T.Mesh(new T.SphereGeometry(.32,10,6),new T.MeshBasicMaterial({color:0x330000}));m.position.set((i-2)*1.35,7.3,.45);gantry.add(m);
    const gl=new T.Sprite(new T.SpriteMaterial({map:TexLib.glow,color:0xff2a2a,opacity:0,transparent:true,depthWrite:false}));gl.position.copy(m.position);gl.scale.set(2,2,1);gantry.add(gl);lights.push({m,g:gl});
  }
  gantry.add(new T.Mesh(merge(checks),staticMat));a.setLights(lights);scene.add(gantry);
  const finish=new T.Mesh(new T.PlaneGeometry(HALF_W*2,1.4),new T.MeshBasicMaterial({map:TexLib.kerb}));finish.rotation.x=-Math.PI/2;finish.position.set(sf.x,.05,sf.z);finish.rotation.z=-sf.yaw;scene.add(finish);
  // One set of vertex buffers per material, not hundreds of repeated individual draw calls.
  for(let i=0;i<L.n;i+=2)for(const side of [-1,1]){
    const p=point(i,side*(HALF_W+RUNOFF_W+.9));block((i/2)%2?0xfff6df:0xe75443,p.x,.52,p.z,1.1,1.1,5.1,p.yaw);
  }
  for(let i=0;i<L.n;i+=17)for(const side of [-1,1]){
    const p=point(i,side*(HALF_W+RUNOFF_W+12+(i%4)*5));palm(p.x,p.z,1.05+(i%5)*.15);
    const q=point(i,side*(HALF_W+RUNOFF_W+34));const h=6+(i%7)*2.1;
    if(Math.min((i-sfIdx+L.n)%L.n,(sfIdx-i+L.n)%L.n)<34)continue;
    if(!reserveScenery('cliff',q.x,q.z,26,54,p.yaw))continue;
    block(0xad7952,q.x,h/2-2,q.z,21,h,23,p.yaw);block(0x89b83d,q.x,h-1.2,q.z,22,2.5,24,p.yaw);
    for(let j=0;j<3;j++)block(j%2?0xc18c62:0x9d6e4e,q.x+Math.sin(p.yaw)*6*j,h*.28+j*2,q.z+Math.cos(p.yaw)*6*j,8,3,24,p.yaw);
  }
  // Landmark vista beside the start: tall terraced island, red/white lighthouse and waterfall.
  let island=null;
  for(let offset=59;offset<=419;offset+=20){const p=point(sfIdx+20,offset);if(reserveScenery('lighthouse-island',p.x,p.z,90,90)){island=p;break;}}
  if(island){
  block(0xaf7850,island.x,12,island.z,58,31,45,island.yaw);block(0x82b43e,island.x,28,island.z,60,3.8,47,island.yaw);
  for(let j=0;j<6;j++){
    part(j%2?0xf14b49:0xffefd1,new T.CylinderGeometry(3.1-j*.12,3.2-j*.12,3.5,12),[island.x,31+j*3.5,island.z]);
  }
  part(0x36404c,new T.CylinderGeometry(4.1,3.5,1.2,12),[island.x,52,island.z]);
  part(0xffd45b,new T.CylinderGeometry(2.3,2.3,3.7,8),[island.x,54,island.z]);
  part(0xd54540,new T.ConeGeometry(5.2,3.3,8),[island.x,57.5,island.z]);
  const waterMat=new T.MeshBasicMaterial({color:0x6bdbfa,transparent:true,opacity:.84,side:T.DoubleSide,depthWrite:false});
  for(let j=0;j<7;j++){
    const w=new T.Mesh(new T.PlaneGeometry(1.8,29),waterMat);w.position.set(island.x-12+j*1.7,13,island.z+23.5);scene.add(w);waterfalls.push(w);
    block(0xc4f8ff,island.x-12+j*1.7,.2,island.z+23.8,2.4,.45,4);
  }
  }
  for(const side of [-1,1]){const p=point(sfIdx+13,side*24);block(0x8c653d,p.x,4,p.z,.24,8,.24);block(0xf0564a,p.x+1.5,7.4,p.z,3,.95,.1);}
  // Puffy clustered clouds, and distant island silhouettes entirely from shared geometry.
  const cloud=new T.SphereGeometry(1,7,5);
  for(let j=0;j<30;j++){const p=point(j*37,80+(j%3)*60);part(0xf3f7e9,cloud,[p.x,28+(j%5)*6,p.z],null,[18+(j%3)*6,7,9]);}
  for(const parts of groups.values()){
    // Keep static batches below ~130 m for useful frustum culling on phones.
    const chunks=new Map();for(const p of parts){const key=Math.floor(p.p[0]/130)+':'+Math.floor(p.p[2]/130);if(!chunks.has(key))chunks.set(key,[]);chunks.get(key).push(p);}
    for(const batch of chunks.values())scene.add(new T.Mesh(merge(batch),staticMat));
  }
  const fantasy=a.buildFantasyCircuit();a.setFantasy(fantasy);scene.add(fantasy);
  // Reuse the same visible pit lane and limiter, with a sandy service lane.
  if(profile.map.pit){const pts=profile.map.pit;for(let i=1;i<pts.length;i++){
    const [x,z]=pts[i], [px,pz]=pts[i-1],len=Math.hypot(x-px,z-pz),m=new T.Mesh(new T.BoxGeometry(12,.05,len+.15),new T.MeshLambertMaterial({color:0xead3a1}));m.position.set((x+px)/2,.04,(z+pz)/2);m.rotation.y=Math.atan2(x-px,z-pz);scene.add(m);
  }}
}
function animate(dt,now){for(let i=0;i<waterfalls.length;i++)waterfalls[i].scale.x=.92+Math.sin(now*.002+i)*.07;}
function decorateDom(w){
  w.classList.add('kart-theme');const el=s=>w.querySelector(s);
  el('#kart-garage-title').textContent='ISLAND STAR KART';el('.garage-kicker').textContent='Vocab World Kart · Admin Preview';
  el('.garage-sub').textContent='รถคาร์ตเกาะสายรุ้ง · เลือกสีเดียวกันทั้งคันและมุมคนขับ';
  el('.garage-stage').innerHTML='<canvas class="kart-preview" width="720" height="330" aria-label="รถคาร์ตสีที่เลือก"></canvas>';
  el('#kart-intro h2').textContent='🏝️ Vocab World Kart · Tropical Island';
  const rules=el('.fi-rules');rules.innerHTML=rules.innerHTML.replace('Vocab Motors VR-X1 · Open-Wheel Racing · สนามกลางทะเลทราย 5.4 กม. 15 โค้งใต้แสงไฟ!','Island Star Kart · เกาะเขตร้อน '+(profile.map.lengthKm).toFixed(1)+' กม. · สูงสุด 110 กม./ชม.').replace('80 กม./ชม.','40 กม./ชม.').replace('⚠️ ออกนอกแทร็ก ทรายลื่นและช้าลงมาก','🚧 ขอบสนามแข็ง ชนแล้วเด้งกลับ · ไม่มีระบบวาร์ป');
  const style=document.createElement('style');style.textContent=`
  body:has(#kart-wrap.on) > .toast, body:has(#kart-wrap.on) > #toast-clear-all{display:none!important}
  #kart-wrap.fp #kart-hud{display:flex!important;bottom:8px}
  #kart-wrap #kart-cockpit{display:none!important;background:none!important}
  #kart-wrap .garage-card{background:linear-gradient(145deg,#fff8e6,#f6e6c3);border:2px solid #e8b953;color:#26434d;box-shadow:0 22px 80px #142e5980}
  #kart-wrap #kart-garage h2{color:#173b5b;text-shadow:0 2px #fff;font-weight:950}
  #kart-wrap .garage-kicker{color:#99803e}#kart-wrap .garage-sub{color:#476475}
  #kart-wrap .garage-stage{height:clamp(108px,31vh,190px);background:radial-gradient(ellipse at 50% 85%,#bdd9b0,#daf3ef 55%,#b9e4f5);margin:3px 0;border:1px solid #b6d3ca}
  #kart-wrap .garage-stage:before{display:none}#kart-wrap .kart-preview{width:100%;height:100%;object-fit:contain}
  #kart-wrap #kart-garage-back{color:#355368;border-color:#91a49c}#kart-wrap .garage-color-name{text-shadow:none}
  #kart-wrap .garage-swatch{box-shadow:0 3px 5px #18383130}#kart-wrap #kart-garage{background:#163d4e80;backdrop-filter:blur(3px)}
  #kart-wrap #kart-car-proof{background:#143844a8;color:#fff8d5}#kart-wrap #kart-hud{border-color:#ffd36f}
  #kart-wrap #kart-intro>.box{background:linear-gradient(135deg,#133c4f,#17324d)}
  @media(max-height:400px){#kart-wrap .garage-card{padding:8px 14px}#kart-wrap .garage-stage{height:108px}#kart-wrap .garage-sub{font-size:10px}#kart-wrap .garage-swatches{margin:4px 0}}
  `;w.appendChild(style);
}
function paintDom(w,style){w.querySelector('#kart-garage-color-name').textContent='Island Star · '+style.label;w.querySelector('#kart-car-proof').textContent='🏝️ Kart · '+style.label+' · ADMIN';w.style.setProperty('--f1-cockpit-center','none');}
let previewScene,previewCamera,previewCar,previewColor;
function preview(r,color,w){
  const cv=w.querySelector('.kart-preview');if(!cv)return;
  if(!previewScene){previewScene=new T.Scene();previewScene.add(new T.HemisphereLight(0xe7f8ff,0x9e896c,.7));const light=new T.DirectionalLight(0xfff3d8,.9);light.position.set(-4,7,6);previewScene.add(light);previewCamera=new T.PerspectiveCamera(34,cv.width/cv.height,.1,30);previewCamera.position.set(3.4,2.7,5.2);previewCamera.lookAt(0,1.2,0);}
  if(previewColor!==color){if(previewCar)previewScene.remove(previewCar);previewCar=buildCar(color);previewScene.add(previewCar);previewColor=color;}
  const size=r.getSize(new T.Vector2()),ratio=r.getPixelRatio(),alpha=r.getClearAlpha(),clear=r.getClearColor(new T.Color()).clone();
  r.setPixelRatio(1);r.setSize(cv.width,cv.height,false);r.setClearColor(0x000000,0);r.render(previewScene,previewCamera);
  const ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);ctx.drawImage(r.domElement,0,0);r.setClearColor(clear,alpha);r.setPixelRatio(ratio);r.setSize(size.x,size.y,false);
}
const scale=.5,source=root.F1_MAP;
const profile={
  id:'kart',map:{track:source.track.map(p=>p.map(v=>v*scale)),pit:source.pit.map(p=>p.map(v=>v*scale)),sf:source.sf,bld:[],lengthKm:2.7},
  physics:Object.freeze({top:110/3.6,accel:5.2,power:135,drag:.0041,brake:10,coast:2.8,grip:10.8,wheelbase:2.16,steer:.49,steerHi:.092,pit:40/3.6}),
  hitParts:[[0,.05,.94,1.4],[0,1.65,1.2,.2],[0,-1.58,1.12,.2],[-1.02,1.12,.17,.46],[1.02,1.12,.17,.46],[-1.02,-1.04,.17,.46],[1.02,-1.04,.17,.46]],
  environment:{id:'tropical-island',downloadBytes:0,shadows:0},
  authorized:()=>typeof canAccessKartBeta==='function'&&canAccessKartBeta()&&typeof KartAccess!=='undefined'&&KartAccess.valid(),
  gearOf:v=>v<6?1:v<12?2:v<20?3:v<26?4:5,
  collideBoundary,buildCar,carView,steer,camera,buildTrack,applyEnvironment,animate,decorateDom,paintDom,preview,
};
root.KartProfile=profile;root.KartWorld=root.createVocabRacingWorld(profile);
})(window);
