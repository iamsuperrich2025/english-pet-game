/* Round 1505 — mecha projectiles.
   Ballistic shells (Word Fleet gravity): Adventure3D owns physics via launch/sync/impact.
   Impact FX: multi-layer fire-ring with white-hot core → amber → deep ember + gravity sparks (~1.2s).
   Legacy fire(from,to) kept for tools/mecha/fx-preview.html flash previews.
   Instanced batches, 12 live shots, zero raster assets. */
(function(root){
'use strict';
const STYLES=[
 {id:'robot_01',name:'ลูกไฟกองเรือ',color:0xff6a18,accent:0xfff3c8,kind:'shell'},
 {id:'robot_02',name:'พลาสมาคู่บับเบิล',color:0x1ad8ff,accent:0xe8fbff,kind:'twin'},
 {id:'robot_03',name:'จรวดจิ๋วหยก',color:0x5af08a,accent:0xffc878,kind:'rocket'},
 {id:'robot_04',name:'ดาวหางเรลกัน',color:0xffd028,accent:0xfff6d0,kind:'rail'},
 {id:'robot_05',name:'หมัดดาวสายฟ้า',color:0xc878ff,accent:0x7ef0ff,kind:'bolt'},
 {id:'robot_06',name:'เปลวไฟมาร์ชเมลโลว์',color:0xff7a28,accent:0xffe8a0,kind:'flame'},
 {id:'robot_07',name:'จานจักรกลีบดาว',color:0xff5a78,accent:0xfff0f5,kind:'saw'},
 {id:'robot_08',name:'เกาส์ละอองดาว',color:0xffc028,accent:0xfff4c8,kind:'gauss'},
 {id:'robot_09',name:'เกลียวไอออน',color:0x6a78ff,accent:0x78f0ff,kind:'ion'},
 {id:'robot_10',name:'เกล็ดหิมะคริสตัล',color:0x88e8ff,accent:0xf5ffff,kind:'frost'}
];
function style(id){return STYLES.find(s=>s.id===id)||STYLES[0];}
function create(scene){
 const T=root.THREE,MAX_SHOTS=12,CAPACITY=384;
 const material=new T.MeshPhongMaterial({color:0xffffff,emissive:0x222222,shininess:110,specular:0x888888,toneMapped:false});
 const haloMaterial=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.32,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
 const starShape=new T.Shape();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?.55:1;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(!i)starShape.moveTo(x,y);else starShape.lineTo(x,y);}starShape.closePath();
 const sphere=new T.SphereGeometry(1,10,7),rod=new T.CylinderGeometry(1,1,1,8);rod.rotateX(Math.PI/2);
 const star=new T.ExtrudeGeometry(starShape,{depth:.12,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.055,bevelThickness:.03});star.translate(0,0,-.06);
 const geometries={orb:sphere,rod,ring:new T.TorusGeometry(1,.095,6,24),crystal:new T.OctahedronGeometry(1,0),star,halo:sphere};
 const batches={},draw=new T.Object3D(),color=new T.Color(),q=new T.Quaternion(),axis=new T.Vector3(0,0,1),direction=new T.Vector3(),position=new T.Vector3(),tmp=new T.Vector3();
 let dead=false,serial=0,peak=0;
 for(const [name,geometry]of Object.entries(geometries)){const mesh=new T.InstancedMesh(geometry,name==='halo'?haloMaterial:material,CAPACITY);mesh.count=0;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.renderOrder=name==='halo'?2:1;mesh.name='mecha-fx-'+name;scene.add(mesh);batches[name]=mesh;}
 const shots=Array.from({length:MAX_SHOTS},()=>({
  active:false,ballistic:false,impacting:false,id:'',
  from:new T.Vector3(),to:new T.Vector3(),pos:new T.Vector3(),prev:new T.Vector3(),vel:new T.Vector3(),
  q:new T.Quaternion(),born:0,duration:0,impactAt:0,hit:false,serial:0
 }));
 function item(name,x,y,z,sx,sy,sz,col,rotation,spin=0){
  const mesh=batches[name],i=mesh.count;if(i>=CAPACITY)return;
  draw.position.set(x,y,z);draw.scale.set(Math.max(.0001,sx),Math.max(.0001,sy),Math.max(.0001,sz));draw.quaternion.copy(rotation||q);if(spin)draw.rotateZ(spin);draw.updateMatrix();mesh.setMatrixAt(i,draw.matrix);color.setHex(col);mesh.setColorAt(i,color);mesh.count++;
 }
 function local(name,shot,p,dx,dy,dz,sx,sy,sz,col,spin=0){tmp.set(dx,dy,dz).applyQuaternion(shot.q).add(p);item(name,tmp.x,tmp.y,tmp.z,sx,sy,sz,col,shot.q,spin);}
 function segment(from,to,r,col){direction.subVectors(to,from);const length=direction.length();if(length<.001)return;q.setFromUnitVectors(axis,direction.multiplyScalar(1/length));position.copy(from).add(to).multiplyScalar(.5);item('rod',position.x,position.y,position.z,r,r,length,col,q);}
 function orientFromVel(shot){
  const sp=shot.vel.length(); if(sp<1e-4) return;
  direction.copy(shot.vel).multiplyScalar(1/sp); shot.q.setFromUnitVectors(axis, direction);
 }
 function takeSlot(){
  let slot=shots.find(s=>!s.active); if(!slot) slot=shots.reduce((a,b)=>a.serial<b.serial?a:b);
  slot.active=true; slot.serial=++serial; peak=Math.max(peak,shots.filter(s=>s.active).length); return slot;
 }
 function bySerial(ser){ return shots.find(s=>s.active && s.serial===ser)||null; }
 function fire(id,from,to,now,hit){
  if(dead)return false; const slot=takeSlot();
  slot.ballistic=false; slot.impacting=false; slot.id=id; slot.from.copy(from); slot.to.copy(to);
  slot.pos.copy(from); slot.prev.copy(from); slot.vel.subVectors(to,from);
  slot.born=now; slot.hit=!!hit; orientFromVel(slot);
  const length=slot.from.distanceTo(slot.to); slot.duration=Math.max(140,Math.min(360,length/140*1000));
  return slot.serial;
 }
 function launch(id,from,vel,now){
  if(dead)return 0; const slot=takeSlot();
  slot.ballistic=true; slot.impacting=false; slot.id=id;
  slot.from.copy(from); slot.pos.copy(from); slot.prev.copy(from); slot.vel.copy(vel);
  slot.to.copy(from).addScaledVector(vel,.2); slot.born=now; slot.hit=false; slot.impactAt=0; slot.duration=0;
  orientFromVel(slot); return slot.serial;
 }
 function sync(serial,x,y,z,vx,vy,vz){
  const slot=bySerial(serial); if(!slot||!slot.ballistic||slot.impacting) return false;
  slot.prev.copy(slot.pos); slot.pos.set(x,y,z); slot.vel.set(vx,vy,vz); orientFromVel(slot); return true;
 }
 function impact(serial,hit,now){
  const slot=bySerial(serial); if(!slot) return false;
  slot.hit=!!hit; slot.impacting=true; slot.impactAt=now||((typeof performance!=='undefined')?performance.now():0);
  slot.to.copy(slot.pos); return true;
 }
 function kill(serial){ const slot=bySerial(serial); if(!slot) return false; slot.active=false; slot.impacting=false; return true; }

 const p=new T.Vector3(),tail=new T.Vector3(),zigA=new T.Vector3(),zigB=new T.Vector3();
 const HOT=0xfff8e6, CORE=0xffe066, FLAME=0xff6a14, DEEP=0xff2a00, EMBER=0xc43a08, BLOOM=0xff4010;
 function drawKind(shot,s,spin,age){
  const special=s.kind!=='shell';
  if(s.kind==='shell'){
   local('orb',shot,p,0,0,.12,.16,.16,.2,HOT);local('orb',shot,p,0,0,0,.28,.28,.36,CORE);
   local('orb',shot,p,0,0,-.08,.34,.34,.42,FLAME);local('halo',shot,p,0,0,0,.72,.72,.95,s.color);
   local('halo',shot,p,0,0,.05,.42,.42,.55,HOT);local('ring',shot,p,0,0,-.18,.38,.38,.65,s.accent,spin);
   for(let j=1;j<=7;j++){
    tail.copy(shot.prev).lerp(shot.pos,1-j*.14);
    const u=1-j*.11, size=.2*u;
    const col=j<2?HOT:(j<4?CORE:(j%2?FLAME:s.color));
    local('orb',shot,tail,Math.sin(j+spin)*.05,Math.cos(j*.7)*.04,0,size,size*1.25,size*1.9,col);
    local('halo',shot,tail,0,0,0,size*1.7,size*1.7,size*2.1,j<3?CORE:s.color);
   }
  }else if(s.kind==='twin'){
   for(const sign of [-1,1]){local('orb',shot,p,sign*.38,sign*.2+Math.sin(spin)*.1,0,.22,.22,.44,s.color);local('orb',shot,p,sign*.38,sign*.2-.04,.14,.11,.11,.32,s.accent);local('ring',shot,p,sign*.38,sign*.2,-.28,.3,.3,.5,s.color,spin);local('halo',shot,p,sign*.38,sign*.2,0,.55,.55,.65,s.color);local('halo',shot,p,sign*.38,sign*.2,.08,.28,.28,.35,HOT);}
   for(let j=1;j<=5;j++){tail.copy(shot.prev).lerp(shot.pos,1-j*.18);const size=.15*(1-j*.12);local('orb',shot,tail,0,0,0,size,size,size*1.8,j%2?s.color:s.accent);local('halo',shot,tail,0,0,0,size*1.5,size*1.5,size*1.8,s.color);}
  }else if(s.kind==='rocket'){
   for(const sign of [-1,1]){
    const x=sign*(.28+Math.sin(spin)*.12),y=Math.sin(spin*1.3)*.2;
    local('orb',shot,p,x,y,0,.2,.2,.5,0xe9f3e5);local('crystal',shot,p,x,y,.4,.22,.22,.32,s.color,Math.PI/4);
    local('ring',shot,p,x,y,-.1,.22,.22,.55,s.color);local('star',shot,p,x,y,-.32,.34,.34,.85,s.color,Math.PI/8);
    local('halo',shot,p,x,y,-.2,.55,.55,.7,FLAME);
    for(let j=0;j<5;j++)local('orb',shot,p,x,y,-.55-j*.16,.15-j*.02,.15-j*.02,.24-j*.03,j===0?HOT:(j<2?CORE:s.accent));
   }
  }else if(s.kind==='rail'||s.kind==='ion'){
   tail.copy(shot.pos).addScaledVector(shot.vel,-0.018);
   segment(tail,shot.pos,s.kind==='rail'?.05:.06,s.accent);segment(tail,p,.12,s.color);
   for(let j=0;j<5;j++)local('ring',shot,p,0,0,-j*.35,.32+j*.05,.32+j*.05,.55,s.color,spin+j);
   local('star',shot,p,0,0,.12,.32,.32,1.15,s.accent,spin);local('halo',shot,p,0,0,0,.7,.7,.8,s.color);local('orb',shot,p,0,0,.08,.14,.14,.16,HOT);
  }else if(s.kind==='bolt'){
   local('star',shot,p,0,0,0,.55,.55,1.2,s.accent,spin);local('orb',shot,p,0,0,0,.28,.28,.28,s.color);local('halo',shot,p,0,0,0,.75,.75,.65,s.color);local('orb',shot,p,0,0,.06,.12,.12,.14,HOT);
   zigA.copy(shot.prev);for(let j=1;j<=6;j++){zigB.copy(shot.prev).lerp(p,j/6);if(j<6){tmp.set(j%2?.26:-.26,Math.sin(j*3+age*.04)*.24,0).applyQuaternion(shot.q);zigB.add(tmp);}segment(zigA,zigB,.045,j%2?s.accent:s.color);zigA.copy(zigB);}
  }else if(s.kind==='flame'){
   for(let j=0;j<9;j++){tail.copy(shot.prev).lerp(p,j/8);const size=.13+j*.055;local('orb',shot,tail,Math.sin(j+spin)*.1,Math.sin(j*.7+spin)*.07,0,size,size*1.25,size*1.9,j%2?FLAME:CORE);local('halo',shot,tail,0,0,0,size*1.7,size*1.7,size*2,s.color);}
   local('star',shot,p,0,0,.24,.22,.22,1.2,HOT,spin);local('orb',shot,p,0,0,.1,.16,.16,.18,HOT);
  }else if(s.kind==='saw'){
   local('star',shot,p,0,0,0,.55,.55,.95,s.accent,spin);local('ring',shot,p,0,0,.1,.38,.38,.65,s.color,-spin);local('orb',shot,p,0,0,.14,.16,.16,.12,s.color);local('halo',shot,p,0,0,0,.72,.72,.28,s.color);
   local('ring',shot,p,0,0,-.15,.48,.48,.4,s.accent,spin*.7);
  }else if(s.kind==='gauss'){
   for(let j=0;j<6;j++){const a=j*Math.PI*2/6+spin*.15,r=.18+.2;local('star',shot,p,Math.cos(a)*r,Math.sin(a)*r,0,.16,.16,.95,j%2?s.color:s.accent,spin+j);}
   local('ring',shot,p,0,0,-.22,.4,.4,.5,s.color,spin);local('halo',shot,p,0,0,0,.65,.65,.55,s.color);local('orb',shot,p,0,0,0,.12,.12,.14,HOT);
  }else if(s.kind==='frost'){
   local('crystal',shot,p,0,0,0,.2,.2,.42,s.color,spin);for(let j=0;j<3;j++)local('rod',shot,p,0,0,0,.035,.55,.035,s.accent,spin+j*Math.PI/3);
   for(let j=0;j<6;j++){const a=j*Math.PI/3+spin;local('crystal',shot,p,Math.cos(a)*.42,Math.sin(a)*.42,-.12,.1,.1,.2,s.accent,spin);}
   local('halo',shot,p,0,0,0,.7,.7,.65,s.color);local('ring',shot,p,0,0,.05,.45,.45,.4,s.accent,-spin);
  }else if(special){
   for(let j=1;j<=5;j++){tail.copy(shot.prev).lerp(shot.pos,1-j*.18);const size=.15*(1-j*.12);local('orb',shot,tail,0,0,0,size,size,size*1.8,s.color);local('halo',shot,tail,0,0,0,size*1.5,size*1.5,size*1.8,s.color);}
   local('orb',shot,p,0,0,0,.24,.24,.32,s.color);local('halo',shot,p,0,0,0,.6,.6,.7,s.color);local('orb',shot,p,0,0,.08,.12,.12,.14,HOT);
  }
 }
 function drawImpact(shot,s,age){
  /* 🔥 รอบ 1505: วงเพลิงพลังสูง — แกนขาวร้อน · คลื่นกระแทก · เปลวไฟ · ประกายถ่วงแรงโน้มถ่วง */
  const fireRing=!!shot.ballistic || !!shot.hit;
  const dur=fireRing?1200:280;
  const e=Math.min(1,age/dur),k=Math.sin(e*Math.PI),fade=1-e,special=s.kind!=='shell',boom=special?1.65:1.15;
  const t=age/1000;
  p.copy(shot.pos);
  if(fireRing){
   const power=shot.hit?1.2:1;
   local('ring',shot,p,0,.02,0,(.55+e*3.1)*power,(.55+e*3.1)*power,.7,FLAME,e);
   local('ring',shot,p,0,.05,0,(.4+e*2.55)*power,(.4+e*2.55)*power,.55,CORE,-e*1.2);
   local('ring',shot,p,0,.08,0,(.28+e*1.85)*power,(.28+e*1.85)*power,.45,HOT,e*.7);
   local('ring',shot,p,0,.04,0,(.7+e*3.6)*power,(.7+e*3.6)*power,.35,BLOOM,e*.4);
   local('halo',shot,p,0,.2,0,(1.15+e*2.2)*power,(1.15+e*2.2)*power,.75,BLOOM);
   local('halo',shot,p,0,.35,0,(.7+e*1.3)*power,(.9+e*1.5)*power,.55,FLAME);
   local('orb',shot,p,0,.22,0,(.42+e*.7)*fade*power,(.55+e*.9)*fade*power,(.42+e*.7)*fade*power,CORE);
   local('orb',shot,p,0,.28,0,(.22+e*.28)*fade,(.28+e*.35)*fade,(.22+e*.28)*fade,HOT);
   local('star',shot,p,0,.25,.1,.7*fade*power,.7*fade*power,.85,HOT,age*.01);
   const tongues=10;
   for(let j=0;j<tongues;j++){
    const a=j*Math.PI*2/tongues+e*1.1, r=(.7+e*1.55)*power;
    const lift=.2+Math.sin(j*1.7+e*6)*.18+e*.45;
    const h=(.35+e*.55)*k*power;
    local('orb',shot,p,Math.cos(a)*r,lift,Math.sin(a)*r,.2*k*power,h,.2*k*power,j%2?FLAME:CORE);
    local('halo',shot,p,Math.cos(a)*r*.92,lift+.15,Math.sin(a)*r*.92,.48*k*power,.65*k*power,.48*k*power,BLOOM);
    local('orb',shot,p,Math.cos(a)*r*.55,lift+.35+e*.5,Math.sin(a)*r*.55,.12*fade,.2*fade,.12*fade,HOT);
   }
   for(let j=0;j<18;j++){
    const seed=j*2.399963+.37;
    const spd=(2.4+(j%6)*.42)*power;
    const life=Math.max(0,1-t/(0.85+(j%4)*.08));
    if(life<=0) continue;
    const sx=Math.cos(seed)*spd*t;
    const sz=Math.sin(seed)*spd*t;
    const sy=.2+spd*t*1.25-5.2*t*t+(j%3)*.05;
    const col=life>.72?HOT:(life>.42?CORE:(life>.22?FLAME:EMBER));
    const szz=.055+.09*life;
    local('orb',shot,p,sx,Math.max(-.05,sy),sz,szz,szz*1.15,szz,col);
    if(life>.4) local('halo',shot,p,sx,Math.max(0,sy),sz,szz*2.2,szz*2.4,szz*2.2,col);
   }
   for(let j=0;j<8;j++){
    const a=j*Math.PI/4+age*.012, lift=.5+e*1.6+j*.12, rr=.2+e*.25;
    local('orb',shot,p,Math.cos(a)*rr,lift,Math.sin(a)*rr,.08*fade,.12*fade,.08*fade,j%2?EMBER:CORE);
   }
   return;
  }
  local('ring',shot,p,0,0,0,(.28+e*.95)*boom,(.28+e*.95)*boom,.55,s.color,e);
  local('ring',shot,p,0,0,.02,(.18+e*1.25)*boom,(.18+e*1.25)*boom,.4,s.accent,-e);
  local('star',shot,p,0,0,.05,.38*fade*boom,.38*fade*boom,.6,s.accent,age*.006);
  local('halo',shot,p,0,0,0,(.45+e)*boom,(.45+e)*boom,.5,s.color);
  for(let j=0;j<(special?8:5);j++){const a=j*Math.PI*2/(special?8:5);local('star',shot,p,Math.cos(a)*(.3+e)*boom,Math.sin(a)*(.3+e)*boom,.06,.14*k*boom,.14*k*boom,.55,j%2?s.color:s.accent,a+e);}
 }
 function tick(now){
  if(dead)return;
  for(const batch of Object.values(batches))batch.count=0;
  for(const shot of shots){
   if(!shot.active)continue;
   const s=style(shot.id),spin=(now-shot.born)*.018,age=now-shot.born;
   if(shot.impacting){
    const idur=(shot.ballistic||shot.hit)?1200:280;
    drawImpact(shot,s,now-shot.impactAt);
    if(now-shot.impactAt>idur){shot.active=false;shot.impacting=false;}
    continue;
   }
   if(shot.ballistic){
    if(age<110){
     const scale=.22+age/110*.95;
     local('ring',shot,shot.from,0,0,0,scale,scale,.7,HOT,age*.01);
     local('halo',shot,shot.from,0,0,0,scale*1.4,scale*1.4,.4,FLAME);
     local('orb',shot,shot.from,0,0,0,scale*.35,scale*.35,scale*.4,CORE);
    }
    p.copy(shot.pos); drawKind(shot,s,spin,age); continue;
   }
   const t=Math.max(0,age/Math.max(1,shot.duration)),fade=1-Math.max(0,(age-shot.duration)/280);
   if(fade<=0){shot.active=false;continue;}
   if(age<115){const scale=.15+age/115*.55;local('ring',shot,shot.from,0,0,0,scale,scale,.6,s.accent,age*.008);local('halo',shot,shot.from,0,0,0,scale,scale,.2,s.color);}
   if(t<1){
    shot.prev.copy(shot.from).lerp(shot.to,Math.max(0,t-.08));
    shot.pos.copy(shot.from).lerp(shot.to,t);
    direction.subVectors(shot.to,shot.from); const len=direction.length(); if(len>1e-4){direction.multiplyScalar(1/len);shot.q.setFromUnitVectors(axis,direction);}
    p.copy(shot.pos); drawKind(shot,s,spin,age);
   }else if(shot.hit){
    shot.pos.copy(shot.to); drawImpact(shot,s,age-shot.duration);
   }
  }
  for(const batch of Object.values(batches)){batch.visible=batch.count>0;batch.instanceMatrix.needsUpdate=true;if(batch.instanceColor)batch.instanceColor.needsUpdate=true;}
 }
 function dispose(){if(dead)return;dead=true;for(const b of Object.values(batches)){scene.remove(b);if(b.dispose)b.dispose();}new Set(Object.values(geometries)).forEach(g=>g.dispose());material.dispose();haloMaterial.dispose();shots.forEach(s=>{s.active=false;s.impacting=false;});}
 return {fire,launch,sync,impact,kill,tick,dispose,stats:()=>({active:shots.filter(s=>s.active).length,styles:[...new Set(shots.filter(s=>s.active).map(s=>s.id))],peak,max:MAX_SHOTS,batches:Object.values(batches).filter(b=>b.visible&&b.count>0).length,instances:Object.values(batches).reduce((n,b)=>n+b.count,0),disposed:dead,ballistic:shots.filter(s=>s.active&&s.ballistic&&!s.impacting).length})};
}
root.MechaCombatFX=Object.freeze({create,style,styles:STYLES});
})(window);
