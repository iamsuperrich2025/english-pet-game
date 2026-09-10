/* Round 1399 — cute mecha projectiles. Cosmetic only: scoring/cadence remain
   in Adventure3D. Six instanced batches, 12 live shots, zero raster assets. */
(function(root){
'use strict';
const STYLES=[
 {id:'robot_01',name:'หอกดาวพลาสมา',color:0xff654c,accent:0xffd968,kind:'lance'},
 {id:'robot_02',name:'พลาสมาคู่บับเบิล',color:0x36cfff,accent:0xd0faff,kind:'twin'},
 {id:'robot_03',name:'จรวดจิ๋วหยก',color:0x76ef91,accent:0xffb467,kind:'rocket'},
 {id:'robot_04',name:'ดาวหางเรลกัน',color:0xffcf47,accent:0xfff3bc,kind:'rail'},
 {id:'robot_05',name:'หมัดดาวสายฟ้า',color:0xc291ff,accent:0x65eaff,kind:'bolt'},
 {id:'robot_06',name:'เปลวไฟมาร์ชเมลโลว์',color:0xff9851,accent:0xffe289,kind:'flame'},
 {id:'robot_07',name:'จานจักรกลีบดาว',color:0xff768c,accent:0xe6f1ff,kind:'saw'},
 {id:'robot_08',name:'เกาส์ละอองดาว',color:0xffcb52,accent:0xfff2b5,kind:'gauss'},
 {id:'robot_09',name:'เกลียวไอออน',color:0x7d89ff,accent:0x6deaff,kind:'ion'},
 {id:'robot_10',name:'เกล็ดหิมะคริสตัล',color:0x9be7ff,accent:0xf0fcff,kind:'frost'}
];
function style(id){return STYLES.find(s=>s.id===id)||STYLES[0];}
function create(scene){
 const T=root.THREE,MAX_SHOTS=12,CAPACITY=256;
 const material=new T.MeshPhongMaterial({color:0xffffff,emissive:0x111111,shininess:80,specular:0x666666,toneMapped:false});
 const haloMaterial=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.16,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
 const starShape=new T.Shape();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?.55:1;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(!i)starShape.moveTo(x,y);else starShape.lineTo(x,y);}starShape.closePath();
 const sphere=new T.SphereGeometry(1,10,7),rod=new T.CylinderGeometry(1,1,1,8);rod.rotateX(Math.PI/2);
 const star=new T.ExtrudeGeometry(starShape,{depth:.12,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.055,bevelThickness:.03});star.translate(0,0,-.06);
 const geometries={orb:sphere,rod,ring:new T.TorusGeometry(1,.095,6,24),crystal:new T.OctahedronGeometry(1,0),star,halo:sphere};
 const batches={},draw=new T.Object3D(),color=new T.Color(),q=new T.Quaternion(),axis=new T.Vector3(0,0,1),direction=new T.Vector3(),position=new T.Vector3(),tmp=new T.Vector3();
 let dead=false,serial=0,peak=0;
 for(const [name,geometry]of Object.entries(geometries)){const mesh=new T.InstancedMesh(geometry,name==='halo'?haloMaterial:material,CAPACITY);mesh.count=0;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.renderOrder=name==='halo'?2:1;mesh.name='mecha-fx-'+name;scene.add(mesh);batches[name]=mesh;}
 const shots=Array.from({length:MAX_SHOTS},()=>({active:false,id:'',from:new T.Vector3(),to:new T.Vector3(),q:new T.Quaternion(),born:0,duration:0,hit:false,serial:0}));
 function item(name,x,y,z,sx,sy,sz,col,rotation,spin=0){
  const mesh=batches[name],i=mesh.count;if(i>=CAPACITY)return;
  draw.position.set(x,y,z);draw.scale.set(Math.max(.0001,sx),Math.max(.0001,sy),Math.max(.0001,sz));draw.quaternion.copy(rotation||q);if(spin)draw.rotateZ(spin);draw.updateMatrix();mesh.setMatrixAt(i,draw.matrix);color.setHex(col);mesh.setColorAt(i,color);mesh.count++;
 }
 function local(name,shot,p,dx,dy,dz,sx,sy,sz,col,spin=0){tmp.set(dx,dy,dz).applyQuaternion(shot.q).add(p);item(name,tmp.x,tmp.y,tmp.z,sx,sy,sz,col,shot.q,spin);}
 function segment(from,to,r,col){direction.subVectors(to,from);const length=direction.length();if(length<.001)return;q.setFromUnitVectors(axis,direction.multiplyScalar(1/length));position.copy(from).add(to).multiplyScalar(.5);item('rod',position.x,position.y,position.z,r,r,length,col,q);}
 function fire(id,from,to,now,hit){
  if(dead)return false;let slot=shots.find(s=>!s.active);if(!slot)slot=shots.reduce((a,b)=>a.serial<b.serial?a:b);
  slot.active=true;slot.id=id;slot.from.copy(from);slot.to.copy(to);slot.born=now;slot.hit=!!hit;slot.serial=++serial;
  direction.subVectors(to,from);const length=direction.length();slot.q.setFromUnitVectors(axis,direction.normalize());slot.duration=Math.max(140,Math.min(360,length/140*1000));
  peak=Math.max(peak,shots.filter(s=>s.active).length);return true;
 }
 const p=new T.Vector3(),tail=new T.Vector3(),spark=new T.Vector3(),zigA=new T.Vector3(),zigB=new T.Vector3();
 function tick(now){
  if(dead)return;
  for(const batch of Object.values(batches))batch.count=0;
  for(const shot of shots){
   if(!shot.active)continue;const age=now-shot.born,t=Math.max(0,age/shot.duration),s=style(shot.id),fade=1-Math.max(0,(age-shot.duration)/260);
   if(fade<=0){shot.active=false;continue;}
   if(age<115){const scale=.15+age/115*.55;local('ring',shot,shot.from,0,0,0,scale,scale,.6,s.accent,age*.008);local('halo',shot,shot.from,0,0,0,scale,scale,.2,s.color);}
   if(t<1){
    p.copy(shot.from).lerp(shot.to,t);const spin=age*.018;
    // Two-tier trails add shape and movement without obscuring letters.
    if(s.kind!=='flame'&&s.kind!=='rail'&&s.kind!=='ion')for(let j=1;j<=3;j++){
     const f=Math.max(0,t-j*.055);tail.copy(shot.from).lerp(shot.to,f);const size=.10*(1-j*.17);local('orb',shot,tail,0,0,0,size,size,size*1.6,s.color);
    }
    if(s.kind==='lance'){
     local('crystal',shot,p,0,0,.25,.22,.22,.9,s.color,spin);local('crystal',shot,p,0,0,.3,.09,.09,.75,0xfff5d0,spin);
     local('ring',shot,p,0,0,-.36,.28,.28,.6,s.accent,-spin);local('halo',shot,p,0,0,0,.42,.42,.8,s.color);
    }else if(s.kind==='twin'){
     for(const sign of [-1,1]){local('orb',shot,p,sign*.31,sign*.16+Math.sin(spin)*.08,0,.17,.17,.36,s.color);local('orb',shot,p,sign*.31,sign*.16-.035,.11,.085,.085,.27,s.accent);local('ring',shot,p,sign*.31,sign*.16,-.22,.22,.22,.4,s.color,spin);}
    }else if(s.kind==='rocket'){
     for(const sign of [-1,1]){
      const x=sign*(.23+Math.sin(t*Math.PI)*.27),y=Math.sin(t*Math.PI)*1.3;
      local('orb',shot,p,x,y,0,.16,.16,.42,0xe9f3e5);local('crystal',shot,p,x,y,.32,.17,.17,.25,s.color,Math.PI/4);
      local('ring',shot,p,x,y,-.08,.165,.165,.5,s.color);local('star',shot,p,x,y,-.26,.26,.26,.7,s.color,Math.PI/8);
      for(let j=0;j<3;j++)local('orb',shot,p,x,y,-.5-j*.14,.12-j*.028,.12-j*.028,.18-j*.03,j===0?0xffeed0:s.accent);
     }
    }else if(s.kind==='rail'||s.kind==='ion'){
     segment(shot.from,shot.to,s.kind==='rail'?.035:.045,s.accent);segment(shot.from,p,.07,s.color);
     for(let j=0;j<3;j++)local('ring',shot,p,0,0,-j*.65,.25+j*.04,.25+j*.04,.5,s.color,spin+j);
     local('star',shot,p,0,0,.1,.23,.23,1,s.accent,spin);local('halo',shot,p,0,0,0,.4,.4,.5,s.color);
    }else if(s.kind==='bolt'){
     local('star',shot,p,0,0,0,.4,.4,1,s.accent,spin);local('orb',shot,p,0,0,0,.21,.21,.21,s.color);
     zigA.copy(shot.from);for(let j=1;j<=5;j++){zigB.copy(shot.from).lerp(p,j/5);if(j<5){tmp.set(j%2?.19:-.19,Math.sin(j*3+age*.04)*.18,0).applyQuaternion(shot.q);zigB.add(tmp);}segment(zigA,zigB,.035,j%2?s.accent:s.color);zigA.copy(zigB);}
    }else if(s.kind==='flame'){
     for(let j=0;j<6;j++){tail.copy(shot.from).lerp(p,j/5);const size=.09+j*.048;local('orb',shot,tail,Math.sin(j+spin)*.07,Math.sin(j*.7+spin)*.05,0,size,size*1.13,size*1.6,j%2?s.color:s.accent);local('halo',shot,tail,0,0,0,size*1.4,size*1.4,size*1.7,s.color);}
     local('star',shot,p,0,0,.2,.14,.14,1,0xfff3c5,spin);
    }else if(s.kind==='saw'){
     local('star',shot,p,0,0,0,.4,.4,.75,s.accent,spin);local('ring',shot,p,0,0,.08,.28,.28,.55,s.color,-spin);local('orb',shot,p,0,0,.12,.13,.13,.09,s.color);local('halo',shot,p,0,0,0,.5,.5,.13,s.color);
    }else if(s.kind==='gauss'){
     for(let j=0;j<5;j++){const a=j*Math.PI*2/5+spin*.15,r=.14+t*.48;local('star',shot,p,Math.cos(a)*r,Math.sin(a)*r,0,.13,.13,.85,j%2?s.color:s.accent,spin+j);}
     local('ring',shot,p,0,0,-.2,.3,.3,.4,s.color,spin);
    }else if(s.kind==='frost'){
     local('crystal',shot,p,0,0,0,.14,.14,.33,s.color,spin);for(let j=0;j<3;j++)local('rod',shot,p,0,0,0,.027,.4,.027,s.accent,spin+j*Math.PI/3);
     for(let j=0;j<4;j++){const a=j*Math.PI/2+spin;local('crystal',shot,p,Math.cos(a)*.36,Math.sin(a)*.36,-.1,.08,.08,.16,s.accent,spin);}
     local('halo',shot,p,0,0,0,.48,.48,.48,s.color);
    }
   }else if(shot.hit){
    const e=(age-shot.duration)/260,k=Math.sin(e*Math.PI);p.copy(shot.to);
    local('ring',shot,p,0,0,0,.25+e*.8,.25+e*.8,.5,s.color,e);
    local('star',shot,p,0,0,.04,.3*fade,.3*fade,.5,s.accent,age*.006);
    for(let j=0;j<5;j++){const a=j*Math.PI*2/5;local('star',shot,p,Math.cos(a)*(.25+e),Math.sin(a)*(.25+e),.05,.12*k,.12*k,.5,j%2?s.color:s.accent,a+e);}
   }
  }
  for(const batch of Object.values(batches)){batch.visible=batch.count>0;batch.instanceMatrix.needsUpdate=true;if(batch.instanceColor)batch.instanceColor.needsUpdate=true;}
 }
 function dispose(){if(dead)return;dead=true;for(const b of Object.values(batches)){scene.remove(b);if(b.dispose)b.dispose();}new Set(Object.values(geometries)).forEach(g=>g.dispose());material.dispose();haloMaterial.dispose();shots.forEach(s=>s.active=false);}
 return {fire,tick,dispose,stats:()=>({active:shots.filter(s=>s.active).length,styles:[...new Set(shots.filter(s=>s.active).map(s=>s.id))],peak,max:MAX_SHOTS,batches:Object.values(batches).filter(b=>b.visible&&b.count>0).length,instances:Object.values(batches).reduce((n,b)=>n+b.count,0),disposed:dead})};
}
root.MechaCombatFX=Object.freeze({create,style,styles:STYLES});
})(window);
