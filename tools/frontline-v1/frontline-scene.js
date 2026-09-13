/* Three.js lifecycle for recycled terrain, vaults, A-Z pickups, carried tokens, shells, and bursts. */
(function () {
  'use strict';
  const F=window.Frontline,T=window.THREE;
  // Reconcile only the rendered pose. Movement, collision and network state stay authoritative.
  F.makeRenderPose=function(){
    let source=null,lastX=0,lastZ=0,lastH=0,lastBump=0,offsetX=0,offsetZ=0,offsetH=0;
    const view={};
    return function(local,dt){
      const distance=Math.hypot(local.x-lastX,local.z-lastZ),bump=local.bumpSeq||0,turn=Math.abs(F.wrap((local.hull||0)-lastH));
      const reset=source!==local||distance>12||dt>.2;
      if(reset){offsetX=offsetZ=offsetH=0;}
      else if(bump!==lastBump||distance>F.C.speeds[2]*Math.max(0,dt)*1.5+.1||turn>F.C.turnSpeed*Math.max(0,dt)*1.5+.08){
        offsetX+=lastX-local.x;offsetZ+=lastZ-local.z;offsetH=F.wrap(offsetH+lastH-(local.hull||0));
      }
      const decay=Math.exp(-Math.max(0,dt)/.12);offsetX*=decay;offsetZ*=decay;offsetH*=decay;
      if(Math.hypot(offsetX,offsetZ)<.0001)offsetX=offsetZ=0;
      if(Math.abs(offsetH)<.0001)offsetH=0;
      source=local;lastX=local.x;lastZ=local.z;lastH=local.hull||0;lastBump=bump;
      Object.assign(view,local);view.x+=offsetX;view.z+=offsetZ;view.hull=F.wrap((local.hull||0)+offsetH);view.turret=view.hull;
      return view;
    };
  };
  F.makeScene=function(canvas,labels,sound=()=>{}){
    const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    if('outputColorSpace' in renderer&&T.SRGBColorSpace)renderer.outputColorSpace=T.SRGBColorSpace;
    else if('outputEncoding' in renderer&&T.sRGBEncoding)renderer.outputEncoding=T.sRGBEncoding;
    const scene=new T.Scene();scene.background=new T.Color(0x9edcf6);
    const lighting=F.makeLighting(renderer,scene);
    const camera=new T.OrthographicCamera(-16,16,16,-16,.1,130);
    const shapes=F.makeShapes(),battlefield=F.buildMap(scene,shapes);
    const tanks=new Map(),pickups=new Map(),bases=new Map(),bombActors=new Map(),seen=new Map(),seenBomb=new Map(),hints=[];
    const projected=new T.Vector3(),look=new T.Vector3(),renderPose=F.makeRenderPose();
    let display=null,homeHint=null;
    function text(el,value){if(el.textContent!==value)el.textContent=value;}
    const fx=F.makeEffects(scene,sound);
    let width=1,height=1;
    function label(className){const el=document.createElement('span');el.className=className;labels.appendChild(el);return el;}
    function resize(){
      width=Math.max(1,canvas.clientWidth);height=Math.max(1,canvas.clientHeight);
      document.getElementById('battle').style.setProperty('--fl-scale',String(Math.min(1.66,Math.max(1,Math.min(width/1008,height/566)))));
      // Wider view from higher above; cap ultra-wide screens inside the recycled terrain margin.
      const aspect=width/height,view=Math.min(height<=430?25:31,F.C.chunkSize*3.8/aspect);
      camera.left=-view*aspect/2;camera.right=view*aspect/2;camera.top=view/2;camera.bottom=-view/2;
      camera.updateProjectionMatrix();renderer.setSize(width,height,false);
    }
    const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
    function project(el,x,y,z){
      projected.set(x,y,z).project(camera);
      const visible=Math.abs(projected.x)<1.08&&Math.abs(projected.y)<1.08;
      el.hidden=!visible;if(visible)el.style.transform='translate('+((projected.x+1)*width/2)+'px,'+((1-projected.y)*height/2)+'px) translate(-50%,-50%)';
    }
    function render(room,local,id,dt,now,serverNow=Date.now()){
      display=renderPose(local,dt);
      battlefield.update(display.x,display.z-3);
      const players=room.players||{},actors={...(room.guards||{}),...players};
      for(const [key,actor] of tanks)if(!actors[key]){scene.remove(actor.mesh);actor.label.remove();actor.health.dispose();tanks.delete(key);seen.delete(key);}
      for(const [key,p] of Object.entries(actors)){
        if(!tanks.has(key)){const mesh=shapes.tank(p.slot),tag=label('fl-carried-letter'),health=F.makeHealthBar(labels,key);
          scene.add(mesh);mesh.position.set(p.x,0,p.z);tanks.set(key,{mesh,label:tag,health});}
        const actor=tanks.get(key),mesh=actor.mesh,pose=key===id?display:p,k=key===id?1:1-Math.exp(-dt/(F.C.poseBlend||.14));
        if(actor.sx==null){actor.sx=pose.x;actor.sz=pose.z;actor.sh=pose.hull||0;}
        actor.sx+=(pose.x-actor.sx)*k;actor.sz+=(pose.z-actor.sz)*k;actor.sh+=F.wrap((pose.hull||0)-actor.sh)*k;
        mesh.position.x=actor.sx;mesh.position.z=actor.sz;mesh.rotation.y=-actor.sh;
        mesh.userData.turret.rotation.y=-(pose.turret-pose.hull);if(mesh.userData.setDirection)mesh.userData.setDirection(pose.hull);mesh.visible=p.hp>0;
        text(actor.label,p.carried||'');actor.label.hidden=!p.carried||p.hp<=0;
        actor.health.update(p);
        const event=room.events&&room.events[key];
        if(event&&seen.get(key)!==event.id){seen.set(key,event.id);if(serverNow-event.at<5000)fx.shell(event,now,serverNow);}
      }
      for(const [key,actor] of pickups)if(!room.letters||!room.letters[key]){
        scene.remove(actor.mesh);actor.label.remove();pickups.delete(key);
      }
      const remain=F.remainNeeded(room,id);
      for(const [key,item] of Object.entries(room.letters||{})){
        if(!pickups.has(key)){const mesh=shapes.letter(),tag=label('fl-letter');scene.add(mesh);pickups.set(key,{mesh,label:tag});}
        const actor=pickups.get(key),need=!!remain[item.letter];
        actor.mesh.position.set(item.x,0,item.z);text(actor.label,item.letter);
        actor.label.classList.toggle('needed',need);
        actor.label.classList.toggle('drop',key[0]==='d');
        if(!need)actor.label.hidden=true;
      }
      for(const [key,actor] of bases)if(!room.bases||!room.bases[key]){
        scene.remove(actor.mesh);actor.label.remove();bases.delete(key);
      }
      for(const [key,base] of Object.entries(room.bases||{})){
        if(!bases.has(key)){const mesh=shapes.base(base.slot),tag=label('fl-base-label');scene.add(mesh);bases.set(key,{mesh,label:tag});}
        const actor=bases.get(key),p=players[key];
        actor.mesh.position.set(base.x,0,base.z);
        actor.mesh.userData.damageParts.forEach(part=>part.visible=base.hp>0);
        actor.label.classList.toggle('open',base.hp<=0);
        actor.label.classList.toggle('mine',key===id);
        text(actor.label,'P'+(base.slot+1)+(p&&p.bot?' BOT':'')+' BASE · '+(base.hp>0?'HP '+base.hp:'OPEN'));
      }
      for(const [key,actor] of bombActors)if(!room.bombs||!room.bombs[key]){
        scene.remove(actor.mesh);actor.label.remove();bombActors.delete(key);seenBomb.delete(key);
      }
      for(const [key,bomb] of Object.entries(room.bombs||{})){
        if(!bombActors.has(key)){const mesh=shapes.bomb(),tag=label('fl-bomb-timer');scene.add(mesh);bombActors.set(key,{mesh,label:tag});if(!bomb.explodedAt)sound('bomb',bomb.x,bomb.z);}
        const actor=bombActors.get(key);actor.mesh.position.set(bomb.x,0,bomb.z);
        actor.label.hidden=!!bomb.explodedAt;
        if(bomb.explodedAt){
          actor.mesh.visible=false;
          if(seenBomb.get(key)!==bomb.id){
            seenBomb.set(key,bomb.id);
            fx.burst(bomb.x,bomb.z,'bomb',now);
          }
        }else{
          actor.mesh.visible=true;
          const remaining=Math.max(0,bomb.explodeAt-serverNow),pulse=1+Math.max(0,.13*Math.sin(remaining*.025));
          actor.mesh.userData.body.scale.setScalar(pulse);
          actor.mesh.userData.warning.scale.setScalar(F.C.bombRadius*(1-remaining/F.C.bombFuse*.15));
          text(actor.label,(remaining/1000).toFixed(1)+'s');
        }
      }
      camera.position.set(display.x,34,display.z+12);look.set(display.x,0,display.z-3);camera.lookAt(look);camera.updateMatrixWorld();
      /* Reproject after the camera update so labels stay attached during chunk streaming. */
      for(const [key,actor] of tanks){
        const p=actors[key];if(!p)continue;
        if(p.hp>0){
          if(p.carried)project(actor.label,actor.mesh.position.x,2.8,actor.mesh.position.z);
          project(actor.health.element,actor.mesh.position.x,2.8,actor.mesh.position.z);
        }
        actor.health.lift(project,actor.mesh.position.x,actor.mesh.position.z,now);
      }
      for(const [key,actor] of pickups){
        const item=room.letters[key];if(!item)continue;
        if(!remain[item.letter]){actor.label.hidden=true;continue;}
        project(actor.label,item.x,1.75,item.z);
      }
      const needed=F.neededLetterHints(room,id,display);
      while(hints.length<needed.length)hints.push(label('fl-hint'));
      needed.forEach((item,i)=>{
        const el=hints[i];projected.set(item.x,1.75,item.z).project(camera);
        const placed=F.placeLetterHint((projected.x+1)*width/2,(1-projected.y)*height/2,width,height);
        el.hidden=!placed.visible;
        if(!placed.visible)return;
        if(el.dataset.letter!==item.letter){el.dataset.letter=item.letter;el.replaceChildren();
          const mark=document.createElement('i'),ch=document.createElement('b');ch.textContent=item.letter;el.append(mark,ch);}
        el.style.transform='translate('+placed.x+'px,'+placed.y+'px) translate(-50%,-50%) rotate('+placed.angle+'rad)';
        const ch=el.querySelector('b');if(ch)ch.style.transform='rotate('+(-placed.angle)+'rad)';
      });
      for(let i=needed.length;i<hints.length;i++)hints[i].hidden=true;
      if(!homeHint)homeHint=label('fl-hint home');
      const home=F.ownBaseHint(room,id);
      if(home){
        projected.set(home.x,2.2,home.z).project(camera);
        const placed=F.placeLetterHint((projected.x+1)*width/2,(1-projected.y)*height/2,width,height);
        homeHint.hidden=!placed.visible;
        if(placed.visible){
          if(homeHint.dataset.kind!=='home'){homeHint.dataset.kind='home';homeHint.replaceChildren();
            const mark=document.createElement('i'),ch=document.createElement('b');ch.textContent='บ้าน';homeHint.append(mark,ch);}
          homeHint.style.transform='translate('+placed.x+'px,'+placed.y+'px) translate(-50%,-50%) rotate('+placed.angle+'rad)';
          const ch=homeHint.querySelector('b');if(ch)ch.style.transform='rotate('+(-placed.angle)+'rad)';
        }
      }else homeHint.hidden=true;
      for(const [key,actor] of bases){const base=room.bases[key];if(base)project(actor.label,base.x,2.2,base.z-3.35);}
      for(const [key,actor] of bombActors){const b=room.bombs[key];if(b&&!b.explodedAt)project(actor.label,b.x,2.3,b.z);}
      lighting.update(display);fx.frame(now,display);renderer.render(scene,camera);
    }
    return{render,feedback(pose,now){fx.muzzle(display?{...pose,x:display.x,z:display.z}:pose,now);},metrics(){return{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,
      geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,dpr:renderer.getPixelRatio(),
      viewWidth:camera.right-camera.left,viewHeight:camera.top-camera.bottom,cameraElevation:Math.atan2(34,15)*180/Math.PI,
      chunks:battlefield.count,chunkCenter:battlefield.center,...fx.metrics(),pickups:pickups.size,bases:bases.size,bombs:bombActors.size,healthBars:tanks.size,letterHints:hints.filter(el=>!el.hidden).length,baseHint:!!(homeHint&&!homeHint.hidden),tankModelReady:shapes.tankModelReady};},
      dispose(){observer.disconnect();fx.dispose();shapes.dispose();battlefield.dispose();lighting.dispose();
        labels.replaceChildren();renderer.dispose();renderer.forceContextLoss();}
    };
  };
})();
