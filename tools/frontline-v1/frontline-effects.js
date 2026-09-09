/* Fixed pools: visible shells, puff trails and layered gold/orange explosions. Local visual state only. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeEffects=function(scene,sound=()=>{}){
    const a=F.makeParticleShapes(),bullets=[],bursts=[],matrix=new T.Object3D(),tint=new T.Color();
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,counts={shots:0,blasts:0};
    const cream=a.color(0xfff5bd),orange=a.color(0xffa445),smoke=a.color(0x9a8f87),dust=a.color(0xdabe8a);
    let bulletIndex=0,burstIndex=0;
    function mesh(group,g,m){const p=new T.Mesh(g,m);group.add(p);return p;}
    function instances(group,g,m,count){const p=new T.InstancedMesh(g,m,count);p.frustumCulled=false;group.add(p);return p;}
    const trailMat=a.mat(0xffedcc,.72,false,true),flameMat=a.mat(0xffe680,.85,true);
    for(let i=0;i<24;i++){
      const group=new T.Group(),body=mesh(group,a.shell,a.shellMaterial),flame=mesh(group,a.star,flameMat);
      body.scale.setScalar(1.35);flame.position.z=.85;flame.scale.set(.18,1,.48);const trail=instances(group,a.ball,trailMat,5);
      group.visible=false;scene.add(group);bullets.push({group,body,flame,trail,active:false});
    }
    for(let i=0;i<20;i++){
      const group=new T.Group(),flashMat=a.mat(0xfffbc5,.95,true),ringMat=a.mat(0xffd36b,.85);
      const puffMat=a.mat(0xffffff,1,false,true),sparkMat=a.mat(0xffed96,.95,true),debrisMat=a.mat(0xc68b59,1,false,true);
      puffMat.depthWrite=debrisMat.depthWrite=true;
      const flash=mesh(group,a.star,flashMat),ring=mesh(group,a.ring,ringMat),echo=mesh(group,a.ring,ringMat);
      const glowMat=a.glowMaterial(),glow=mesh(group,a.glow,glowMat);glow.position.y=.02;
      const puffs=instances(group,a.ball,puffMat,18),sparks=instances(group,a.spark,sparkMat,10),debris=instances(group,a.debris,debrisMat,6);
      ring.position.y=.04;echo.position.y=.06;group.visible=false;scene.add(group);
      bursts.push({group,flash,ring,echo,glow,glowMat,puffs,sparks,debris,flashMat,ringMat,puffMat,sparkMat,debrisMat,active:false});
    }
    function burst(x,z,kind,now){
      const b=bursts[burstIndex++%bursts.length],muzzle=kind==='muzzle';b.active=true;b.started=now;b.kind=kind;
      b.duration=muzzle?180:kind==='bomb'?1050:650;b.radius=kind==='bomb'?F.C.bombRadius:muzzle?.95:1.65;
      b.group.position.set(x,muzzle?1.75:.16,z);b.group.visible=true;
      b.flash.geometry=muzzle?a.star:a.ball;
      b.ring.visible=b.echo.visible=b.glow.visible=b.puffs.visible=b.sparks.visible=!muzzle;b.debris.visible=kind==='bomb';
      b.puffs.count=kind==='bomb'?18:8;
      if(!muzzle){counts.blasts++;sound(kind==='bomb'?'explosion':'impact',x,z);}
    }
    function muzzle(pose,now){burst(pose.x+Math.sin(pose.turret)*2.35,pose.z-Math.cos(pose.turret)*2.35,'muzzle',now);}
    function shell(event,now,serverNow){
      const b=bullets[bulletIndex++%bullets.length];counts.shots++;b.event=event;b.active=true;
      b.duration=Math.max(160,event.hitAt-event.at);
      // Keep delayed mobile shots visible instead of jumping straight to their destination.
      b.started=now-Math.min(Math.max(0,serverNow-event.at),b.duration*.2);b.group.visible=true;
      b.group.rotation.y=Math.atan2(event.endX-event.x,event.endZ-event.z)+Math.PI;
      burst(event.x,event.z,'muzzle',now);
      sound('shot',event.x,event.z);
    }
    function frame(now,focus){
      for(const b of bullets){
        if(!b.active)continue;const e=b.event,t=Math.min(1,Math.max(0,(now-b.started)/b.duration));
        b.group.position.set(e.x+(e.endX-e.x)*t,1.7,e.z+(e.endZ-e.z)*t);
        b.group.visible=Math.abs(b.group.position.x-focus.x)<48&&Math.abs(b.group.position.z-focus.z)<30;
        b.flame.scale.x=.17+Math.sin(now*.07)*.04;
        const length=Math.min(3.4,Math.hypot(e.endX-e.x,e.endZ-e.z)*t);
        for(let i=0;i<5;i++){matrix.position.set(Math.sin(i*5)*.05,.04+i*.025,.75+length*(i/5));
          matrix.rotation.set(0,0,0);matrix.scale.setScalar((.14+i*.045)*Math.min(1,t*12));matrix.updateMatrix();b.trail.setMatrixAt(i,matrix.matrix);}
        b.trail.instanceMatrix.needsUpdate=true;
        if(t>=1){b.active=false;b.group.visible=false;burst(e.endX,e.endZ,'shell',now);}
      }
      for(const b of bursts){
        if(!b.active)continue;const t=(now-b.started)/b.duration;
        if(t>=1){b.active=false;b.group.visible=false;continue;}
        b.group.visible=Math.abs(b.group.position.x-focus.x)<48&&Math.abs(b.group.position.z-focus.z)<30;
        if(!b.group.visible)continue;
        const r=b.radius,ease=1-Math.pow(1-t,3),fade=Math.min(1,(1-t)*2.5),isBomb=b.kind==='bomb';
        b.flash.scale.setScalar(r*(b.kind==='muzzle'?.55+ease*.6:.25+ease*.3));b.flash.position.y=isBomb?1.2:.1;
        b.flashMat.opacity=Math.max(0,(b.kind==='muzzle'?1:.6)-t*3.5)*(reduced?.4:1);
        if(b.kind==='muzzle')continue;
        b.glow.scale.setScalar(r*3.4);b.glowMat.uniforms.strength.value=(1-t)*(isBomb?.7:.4);
        b.ring.scale.setScalar(r*(.25+.78*ease));b.echo.scale.setScalar(r*(.12+.66*ease));b.ringMat.opacity=(1-t)*.85;
        b.puffMat.opacity=fade;b.sparkMat.opacity=(1-t)*.95;b.debrisMat.opacity=fade;
        for(let i=0;i<b.puffs.count;i++){
          const core=i<6,angle=i*2.4,reach=r*ease*(core?.26:.52+(i%3)*.09);
          matrix.position.set(Math.cos(angle)*reach,(core?.3:.15)+ease*r*(core?.2:(i%3)*.22),Math.sin(angle)*reach);
          matrix.rotation.set(0,i,0);const size=r*(core?.23:.16)+(r*.1*ease);
          matrix.scale.set(size*(.75+.25*ease),size*(.85+ease*.4),size);matrix.updateMatrix();b.puffs.setMatrixAt(i,matrix.matrix);
          tint.copy(core?cream:i<12?orange:i%2?smoke:dust).lerp(smoke,Math.max(0,(t-.18)*(core?1:1.3)));
          b.puffs.setColorAt(i,tint);
        }
        for(let i=0;i<10;i++){
          const angle=i*Math.PI*.2+.18,reach=r*(.22+.9*ease);
          matrix.position.set(Math.cos(angle)*reach,.4+Math.sin(t*Math.PI)*r*(i%3+1)*.22,Math.sin(angle)*reach);
          matrix.rotation.set(0,angle,0);const size=r*(reduced?.025:.055)*(1-t);
          matrix.scale.set(size*1.3,1,size*(i%2?3:1.3));matrix.updateMatrix();b.sparks.setMatrixAt(i,matrix.matrix);
          if(i<6&&isBomb){matrix.position.multiplyScalar(.77);matrix.position.y+=r*Math.sin(t*Math.PI)*.5;
            matrix.rotation.set(t*5+i,t*3,t*4);matrix.scale.setScalar(r*(.055+i%2*.025));matrix.updateMatrix();b.debris.setMatrixAt(i,matrix.matrix);}
        }
        b.puffs.instanceMatrix.needsUpdate=b.puffs.instanceColor.needsUpdate=b.sparks.instanceMatrix.needsUpdate=true;
        if(isBomb)b.debris.instanceMatrix.needsUpdate=true;
      }
    }
    return{shell,burst,muzzle,frame,metrics(){return{bullets:bullets.filter(b=>b.active).length,
      explosions:bursts.filter(b=>b.active&&b.kind!=='muzzle').length,effectPool:44,shotsShown:counts.shots,blastsShown:counts.blasts};},
      dispose(){for(const b of [...bullets,...bursts]){scene.remove(b.group);b.group.traverse(p=>{if(p.isInstancedMesh)p.dispose();});}a.dispose();}};
  };
})();
