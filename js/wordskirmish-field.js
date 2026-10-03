/* Original tactical arena — รอบ 1631 ยกระดับภาพ: ท้องฟ้าไล่สี+ภูเขาแนวขอบฟ้า+พื้นผิววาด canvas
   (หญ้า/ดิน/ถนน/โลหะ/คอนกรีต/ไม้) + กระสอบทราย/ถัง/หิน/พุ่มไม้ · โหลด texture 0 ไฟล์จากเน็ต
   ⚠️ colliders/blocked()/supplies/zone คงพิกัดเดิมเป๊ะ — เกมเพลย์+แผนที่ย่อยไม่เปลี่ยน */
(function(){'use strict';
  // ---- canvas texture helpers ----
  const GROUND=1, CONTAINER=2, CONCRETE=3, ROOF=4, WOOD=5;
  function buildTextures(T){
    const canvasTex=(size, painter, repeat)=>{
      const c=document.createElement('canvas'); c.width=c.height=size;
      painter(c.getContext('2d'), size);
      const t=new T.CanvasTexture(c);
      if(repeat){ t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(repeat, repeat); }
      t.anisotropy=4;
      return t;
    };
    const noise=(q, s, n, alpha, dark)=>{
      for(let i=0;i<n;i++){
        const v=Math.random();
        q.fillStyle=v<dark?`rgba(0,0,0,${alpha})`:`rgba(255,255,255,${alpha*.7})`;
        q.fillRect(Math.random()*s, Math.random()*s, 1+Math.random()*2, 1+Math.random()*2);
      }
    };
    return {
      [GROUND]: canvasTex(512,(q,s)=>{
        q.fillStyle='#6d7c4e'; q.fillRect(0,0,s,s);                    // หญ้าแห้งทหาร
        for(let i=0;i<40;i++){ q.fillStyle=`rgba(${90+Math.random()*30|0},${100+Math.random()*26|0},${60+Math.random()*20|0},.35)`;
          q.beginPath(); q.ellipse(Math.random()*s,Math.random()*s,14+Math.random()*40,10+Math.random()*28,Math.random()*3,0,7); q.fill(); }
        noise(q,s,2600,.16,.55);
        // แผลถนนแนวกากบาท (สนามบินสไตล์)
        q.fillStyle='rgba(112,104,84,.55)';
        q.fillRect(0,s/2-26,s,52); q.fillRect(s/2-26,0,52,s);
        q.strokeStyle='rgba(70,64,50,.5)'; q.lineWidth=3;
        q.strokeRect(-4,s/2-26,s+8,52); q.strokeRect(s/2-26,-4,52,s+8);
        for(let i=0;i<9;i++){ q.fillStyle='rgba(226,214,170,.5)'; q.fillRect(i*60+10,s/2-2,30,4); q.fillRect(s/2-2,i*60+10,4,30); }
      },3),
      [CONTAINER]: canvasTex(256,(q,s)=>{
        q.fillStyle='#9aa4a8'; q.fillRect(0,0,s,s);
        for(let x=0;x<s;x+=16){ q.fillStyle='rgba(255,255,255,.13)'; q.fillRect(x,0,5,s); q.fillStyle='rgba(0,0,0,.22)'; q.fillRect(x+9,0,4,s); }
        noise(q,s,700,.14,.5);
        for(let i=0;i<7;i++){ const x=Math.random()*s; const g=q.createLinearGradient(0,0,0,s);
          g.addColorStop(0,'rgba(120,70,40,.4)'); g.addColorStop(1,'rgba(120,70,40,0)');
          q.fillStyle=g; q.fillRect(x,0,3+Math.random()*6,s*.6); }                  // รอยสนิมไหล
        q.fillStyle='rgba(40,46,50,.5)'; q.font='bold 34px monospace'; q.fillText('VX-07',24,70);
      }),
      [CONCRETE]: canvasTex(256,(q,s)=>{
        q.fillStyle='#a8a9a0'; q.fillRect(0,0,s,s); noise(q,s,2400,.15,.5);
        q.strokeStyle='rgba(60,60,56,.35)'; q.lineWidth=2;
        for(let i=0;i<5;i++){ q.beginPath(); let x=Math.random()*s,y=Math.random()*s; q.moveTo(x,y);
          for(let k=0;k<4;k++){ x+=Math.random()*40-20; y+=Math.random()*40-20; q.lineTo(x,y); } q.stroke(); }
        q.fillStyle='rgba(90,86,70,.25)'; q.fillRect(0,s-34,s,34);                     // คราบใต้ฝน
      }),
      [ROOF]: canvasTex(128,(q,s)=>{ q.fillStyle='#4b5a60'; q.fillRect(0,0,s,s); noise(q,s,500,.2,.5); }),
      [WOOD]: canvasTex(128,(q,s)=>{
        q.fillStyle='#8a6f4d'; q.fillRect(0,0,s,s);
        for(let y=0;y<s;y+=21){ q.fillStyle='rgba(0,0,0,.28)'; q.fillRect(0,y,s,2); }
        for(let i=0;i<130;i++){ q.fillStyle=`rgba(60,40,20,${.05+Math.random()*.12})`; q.fillRect(Math.random()*s,Math.random()*s,Math.random()*30,2); }
      }),
    };
  }
  window.WordSkirmishField={build(T,scene){
    T=window.THREE||T;
    const root=new T.Group(),colliders=[],blocks=[],trees=[],supplies=[];scene.add(root);
    scene.background=new T.Color(0xc4d2cf); scene.fog=new T.Fog(0xc4d2cf,55,130);
    const tex=buildTextures(T);
    const add=(x,y,z,w,h,d,color,solid=true,kind=CONTAINER)=>{blocks.push({x,y,z,w,h,d,color,kind});if(solid)colliders.push({x,z,hx:w/2+.42,hz:d/2+.42});};
    // ---- ท้องฟ้าไล่สี (โดมหันเข้าใน) + ภูเขาแนวขอบฟ้า ----
    const skyGeo=new T.SphereGeometry(150,20,12);
    const skyCols=[], pos=skyGeo.attributes.position, zen=new T.Color(0x6f9ec4), hor=new T.Color(0xd8d2bc);
    for(let i=0;i<pos.count;i++){ const h=Math.max(0,Math.min(1,pos.getY(i)/150*.5+.5)); const c=hor.clone().lerp(zen,Math.pow(h,1.4)); skyCols.push(c.r,c.g,c.b); }
    skyGeo.setAttribute('color', new T.Float32BufferAttribute(skyCols,3));
    const sky=new T.Mesh(skyGeo,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,fog:false,depthWrite:false}));
    sky.renderOrder=-10; root.add(sky);
    const hills=new T.InstancedMesh(new T.ConeGeometry(1,1,5),new T.MeshLambertMaterial({color:0x7e9484}),14), hd=new T.Object3D();
    for(let i=0;i<14;i++){ const a=i/14*Math.PI*2, r=105+(i%4)*12, h=14+(i%5)*6;
      hd.position.set(Math.cos(a)*r,h/2-2,Math.sin(a)*r); hd.scale.set(26+(i%3)*10,h,20+(i%4)*8); hd.updateMatrix(); hills.setMatrixAt(i,hd.matrix); }
    root.add(hills);
    // ---- พื้นดิน + ถนนกากบาท + ลานกลาง ----
    const ground=new T.Mesh(new T.CircleGeometry(60,64),new T.MeshLambertMaterial({map:tex[GROUND],color:0xffffff}));
    ground.rotation.x=-Math.PI/2;root.add(ground);
    // ถนนกากบาท/ลาน/เส้นประ — วาดลงพื้นดินแล้ว ไม่ต้องสร้างเมช (kind 0 = ข้าม batch)
    add(0,.012,0,106,.02,5,0xada58c,false,0);add(0,.014,0,5,.02,106,0xada58c,false,0);
    add(0,.025,0,13,.02,13,0x777f72,false,0);
    for(let i=-4;i<=4;i++){add(i*10,.03,0,3,.03,.12,0xe4d7b5,false,0);add(0,.031,i*10,.12,.03,3,0xe4d7b5,false,0);}
    // ---- ตู้คอนเทนเนอร์ 6 ใบ (พิกัด/collider เดิม) ----
    const containers=[[-10,-26,7,3.3],[-34,-8,3.3,8],[30,11,8,3.3],[12,30,3.3,7],[-9,10,5,2.4],[10,-9,2.4,5]];
    containers.forEach(([x,z,w,d],i)=>{const color=[0x9fb6ba,0xc09a80,0xa4b8a0][i%3];add(x,1.4,z,w,2.8,d,color,true,CONTAINER);add(x,2.87,z,w+.15,.14,d+.15,0x6a6f66,false,CONTAINER);for(let k=-2;k<=2;k++)add(x+k*w/6,1.4,z-d/2-.025,.06,2.5,.05,0x314b50,false,CONTAINER);});
    // ---- อาคารเปิด 3 ด้าน 2 หลัง (ผนัง solid เดิม) ----
    [[-35,27],[30,-31]].forEach(([x,z])=>{add(x,2,z-4,12,4,.5,0xb5b3a6,true,CONCRETE);add(x-6,2,z,.5,4,8,0xb0b5ac,true,CONCRETE);add(x+6,2,z,.5,4,8,0xb0b5ac,true,CONCRETE);add(x,4.1,z,13,.25,9,0x526469,false,ROOF);});
    // ---- ต้นไม้รอบนอก (visual only เหมือนเดิม) ----
    for(let i=0;i<20;i++){const a=i*2.399,r=31+(i%3)*7,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<5||Math.abs(z)<5)continue;add(x,1.4,z,.65,2.8,.65,0x655f45,false,0);trees.push({x,z,y:3.5,s:2.1+(i%3)*.25});}
    // ---- ลังเสบียง (solid เดิม) ----
    for(const [x,z] of [[-13,-7],[16,6],[-7,26],[25,-14],[-27,9],[7,-37]]){add(x,.6,z,2.6,1.2,1.2,0xbcb599,true,WOOD);add(x,.08,z+1,3.2,.16,.8,0x7c8069,false,0);}
    // โหลด instanced batches ตาม kind (kind 0 = วาดบนพื้นแล้ว ข้าม)
    const batches=[];
    const addBatch=(list,kind)=>{
      if(!list.length)return;
      const mesh=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshLambertMaterial({map:tex[kind],color:0xffffff}),list.length), dummy=new T.Object3D();
      list.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.scale.set(b.w,b.h,b.d);dummy.rotation.set(0,0,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color(b.color));});
      mesh.instanceMatrix.needsUpdate=true; root.add(mesh); batches.push(mesh);
    };
    addBatch(blocks.filter(b=>b.kind===CONTAINER), CONTAINER);
    addBatch(blocks.filter(b=>b.kind===CONCRETE), CONCRETE);
    addBatch(blocks.filter(b=>b.kind===ROOF), ROOF);
    addBatch(blocks.filter(b=>b.kind===WOOD), WOOD);
    // ลำต้น + พุ่ม
    const trunks=new T.InstancedMesh(new T.CylinderGeometry(.16,.24,1.6,6),new T.MeshLambertMaterial({color:0x5d4a35}),trees.length);
    trees.forEach((t,i)=>{hd.position.set(t.x,.8,t.z);hd.scale.set(1,1,1);hd.rotation.set(0,0,0);hd.updateMatrix();trunks.setMatrixAt(i,hd.matrix);});
    root.add(trunks); batches.push(trunks);
    const crowns=new T.InstancedMesh(new T.ConeGeometry(1,2.8,7),new T.MeshLambertMaterial({color:0x486c58}),trees.length);
    trees.forEach((t,i)=>{hd.position.set(t.x,t.y,t.z);hd.scale.set(t.s,t.s,t.s);hd.updateMatrix();crowns.setMatrixAt(i,hd.matrix);});
    root.add(crowns); batches.push(crowns);
    // ---- ของใหม่รอบ ๆ สนาม (visual only ไม่กระทบเดิน/ยิง) ----
    const sand=new T.InstancedMesh(new T.BoxGeometry(.55,.24,.32),new T.MeshLambertMaterial({color:0xa08f68}),40);
    let si=0;
    [[-35,27],[30,-31]].forEach(([x,z])=>{ for(let i=0;i<20;i++){ const a=(i%10)/10*Math.PI-.9, r=7.2, row=(i/10|0);
      hd.position.set(x+Math.sin(a)*r,.14+row*.24,z+Math.cos(a)*r); hd.rotation.set(0,a,0); hd.scale.set(1,1,1); hd.updateMatrix(); sand.setMatrixAt(si++,hd.matrix); } });
    root.add(sand);
    const barrels=new T.InstancedMesh(new T.CylinderGeometry(.34,.34,.95,10),new T.MeshLambertMaterial({color:0xffffff}),10), bcols=[0x8a4a3a,0x4a6a7a,0x777f66,0x8a7a3a,0x5a5f6a];
    for(let i=0;i<10;i++){ const c=containers[i%6];
      hd.position.set(c[0]+c[2]/2+ .9+(i%2)*.5,.48,c[1]+((i%3)-1)*1.2); hd.rotation.set(0,i,0); hd.scale.set(1,1,1); hd.updateMatrix();
      barrels.setMatrixAt(i,hd.matrix); barrels.setColorAt(i,new T.Color(bcols[i%5])); }
    root.add(barrels);
    const rocks=new T.InstancedMesh(new T.DodecahedronGeometry(1,0),new T.MeshLambertMaterial({color:0x8b9089}),16);
    for(let i=0;i<16;i++){ const a=i*2.4+.7, r=12+(i%5)*8;
      const s=.28+(i%4)*.16; hd.position.set(Math.cos(a)*r,s*.4,Math.sin(a)*r); hd.rotation.set(i,i*2,i*.7); hd.scale.set(s,s*.7,s); hd.updateMatrix(); rocks.setMatrixAt(i,hd.matrix); }
    root.add(rocks);
    const bushes=new T.InstancedMesh(new T.SphereGeometry(1,7,5),new T.MeshLambertMaterial({color:0x51684a}),22);
    for(let i=0;i<22;i++){ const a=i*1.7+.4, r=8+(i%6)*7.4, s=.4+(i%3)*.22;
      hd.position.set(Math.cos(a)*r,s*.5,Math.sin(a)*r); hd.rotation.set(0,0,0); hd.scale.set(s,s*.62,s); hd.updateMatrix(); bushes.setMatrixAt(i,hd.matrix); }
    root.add(bushes);
    // ---- กล่องเสบียง 8 จุด (พิกัด/พฤติกรรมเดิม) ----
    [[-14,-14,0],[14,-14,1],[14,14,2],[-14,14,3],[0,-30,4],[30,0,5],[-30,0,6],[0,30,7]].forEach(([x,z,id])=>{
      const mesh=new T.Mesh(new T.BoxGeometry(1.2,.65,.85),new T.MeshLambertMaterial({map:tex[WOOD],color:[0xe1b969,0x65c6bd,0xb8a3df,0xd4e3c3][id%4]}));mesh.position.set(x,.4,z);root.add(mesh);
      const beacon=new T.Mesh(new T.CylinderGeometry(.08,.08,2.6,5),new T.MeshBasicMaterial({color:0xf8df9e,transparent:true,opacity:.5}));beacon.position.set(x,1.5,z);root.add(beacon);supplies.push({x,z,id,mesh,beacon,taken:false});
    });
    // ---- วงโซน + ขอบวง ----
    const ring=new T.Mesh(new T.CylinderGeometry(1,1,10,96,1,true),new T.MeshBasicMaterial({color:0x76cbee,side:T.DoubleSide,transparent:true,opacity:.16,depthWrite:false}));ring.position.y=5;root.add(ring);
    const edge=new T.Mesh(new T.TorusGeometry(1,.015,4,96),new T.MeshBasicMaterial({color:0x93eaff}));edge.rotation.x=-Math.PI/2;edge.position.y=.06;root.add(edge);
    return {root,colliders,supplies,blockers:[ground,...batches],blocked(x,z){return Math.hypot(x,z)>51.4||colliders.some(c=>Math.abs(x-c.x)<c.hx&&Math.abs(z-c.z)<c.hz);},reset(){supplies.forEach(s=>{s.taken=false;s.mesh.visible=s.beacon.visible=true;});},update(c,t){ring.position.set(c.x,5,c.z);ring.scale.set(c.radius,1,c.radius);edge.position.set(c.x,.06,c.z);edge.scale.set(c.radius,c.radius,1);supplies.forEach(s=>{s.beacon.visible=!s.taken;s.beacon.material.opacity=.3+Math.sin(t*3)*.12;});}};
  }};
})();
