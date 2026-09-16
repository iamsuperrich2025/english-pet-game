/* Original low-cost tactical arena. Shared instanced geometry; no texture downloads. */
(function(){'use strict';
  window.WordSkirmishField={build(T,scene){
    const root=new T.Group(),colliders=[],blocks=[],trees=[],supplies=[];scene.add(root);
    scene.background=new T.Color(0xbacdc9);scene.fog=new T.Fog(0xbacdc9,65,125);
    const add=(x,y,z,w,h,d,color,solid=true)=>{blocks.push({x,y,z,w,h,d,color});if(solid)colliders.push({x,z,hx:w/2+.42,hz:d/2+.42});};
    const ground=new T.Mesh(new T.CircleGeometry(60,64),new T.MeshLambertMaterial({color:0x81946c}));ground.rotation.x=-Math.PI/2;root.add(ground);
    // Crossroads, landing pad, warehouse rows and staggered shipping containers.
    add(0,.012,0,106,.02,5,0xada58c,false);add(0,.014,0,5,.02,106,0xada58c,false);
    add(0,.025,0,13,.02,13,0x777f72,false);
    for(let i=-4;i<=4;i++){add(i*10,.03,0,3,.03,.12,0xe4d7b5,false);add(0,.031,i*10,.12,.03,3,0xe4d7b5,false);}
    const containers=[[-10,-26,7,3.3],[-34,-8,3.3,8],[30,11,8,3.3],[12,30,3.3,7],[-9,10,5,2.4],[10,-9,2.4,5]];
    containers.forEach(([x,z,w,d],i)=>{const color=[0x52767c,0x9c6952,0x596c5b][i%3];add(x,1.4,z,w,2.8,d,color);add(x,2.87,z,w+.15,.14,d+.15,0xc1b58f,false);for(let k=-2;k<=2;k++)add(x+k*w/6,1.4,z-d/2-.025,.06,2.5,.05,0x314b50,false);});
    // Three-sided shelters leave navigable doors; every solid wall shares movement/raycast geometry.
    [[-35,27],[30,-31]].forEach(([x,z])=>{add(x,2,z-4,12,4,.5,0xaba99a);add(x-6,2,z, .5,4,8,0x7e8a81);add(x+6,2,z,.5,4,8,0x7e8a81);add(x,4.1,z,13,.25,9,0x526469,false);});
    for(let i=0;i<20;i++){const a=i*2.399,r=31+(i%3)*7,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<5||Math.abs(z)<5)continue;add(x,1.4,z,.65,2.8,.65,0x655f45);trees.push({x,z,y:3.5,s:2.1+(i%3)*.25});}
    for(const [x,z] of [[-13,-7],[16,6],[-7,26],[25,-14],[-27,9],[7,-37]]){add(x,.6,z,2.6,1.2,1.2,0xbcb599);add(x,.08,z+1,3.2,.16,.8,0x7c8069,false);}
    const geometry=new T.BoxGeometry(1,1,1),material=new T.MeshLambertMaterial({color:0xffffff});
    const batch=new T.InstancedMesh(geometry,material,blocks.length),dummy=new T.Object3D();
    blocks.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.scale.set(b.w,b.h,b.d);dummy.updateMatrix();batch.setMatrixAt(i,dummy.matrix);batch.setColorAt(i,new T.Color(b.color));});batch.instanceMatrix.needsUpdate=true;root.add(batch);
    const crowns=new T.InstancedMesh(new T.ConeGeometry(1,2.8,7),new T.MeshLambertMaterial({color:0x486c58}),trees.length);
    trees.forEach((t,i)=>{dummy.position.set(t.x,t.y,t.z);dummy.scale.set(t.s,t.s,t.s);dummy.updateMatrix();crowns.setMatrixAt(i,dummy.matrix);});root.add(crowns);
    [[-14,-14,0],[14,-14,1],[14,14,2],[-14,14,3],[0,-30,4],[30,0,5],[-30,0,6],[0,30,7]].forEach(([x,z,id])=>{
      const mesh=new T.Mesh(new T.BoxGeometry(1.2,.65,.85),new T.MeshLambertMaterial({color:[0xe1b969,0x65c6bd,0xb8a3df,0xd4e3c3][id%4]}));mesh.position.set(x,.4,z);root.add(mesh);
      const beacon=new T.Mesh(new T.CylinderGeometry(.08,.08,2.6,5),new T.MeshBasicMaterial({color:0xf8df9e,transparent:true,opacity:.5}));beacon.position.set(x,1.5,z);root.add(beacon);supplies.push({x,z,id,mesh,beacon,taken:false});
    });
    const ring=new T.Mesh(new T.CylinderGeometry(1,1,10,96,1,true),new T.MeshBasicMaterial({color:0x76cbee,side:T.DoubleSide,transparent:true,opacity:.16,depthWrite:false}));ring.position.y=5;root.add(ring);
    const edge=new T.Mesh(new T.TorusGeometry(1,.015,4,96),new T.MeshBasicMaterial({color:0x93eaff}));edge.rotation.x=-Math.PI/2;edge.position.y=.06;root.add(edge);
    return {root,colliders,supplies,blockers:[ground,batch,crowns],blocked(x,z){return Math.hypot(x,z)>51.4||colliders.some(c=>Math.abs(x-c.x)<c.hx&&Math.abs(z-c.z)<c.hz);},reset(){supplies.forEach(s=>{s.taken=false;s.mesh.visible=s.beacon.visible=true;});},update(c,t){ring.position.set(c.x,5,c.z);ring.scale.set(c.radius,1,c.radius);edge.position.set(c.x,.06,c.z);edge.scale.set(c.radius,c.radius,1);supplies.forEach(s=>{s.beacon.visible=!s.taken;s.beacon.material.opacity=.3+Math.sin(t*3)*.12;});}};
  }};
})();
