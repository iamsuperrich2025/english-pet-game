/* ============================================================
   hauntedhotelghost.js — Haunted Hotel PNG ghost runtime
   One lightweight subdivided plane + shader; no physics, post-processing,
   dynamic lights or cosmetic Firebase state.
   ============================================================ */
(function(){
  'use strict';

  const IMAGE='img/ghosts/newGhost/ghost_attack_01.png';
  const TURN_TRIGGER=10;
  let sharedTexture=null;

  function wrapAngle(value){
    let out=(Number(value)||0)%(Math.PI*2);
    if(out>Math.PI)out-=Math.PI*2;
    if(out<-Math.PI)out+=Math.PI*2;
    return out;
  }
  function createTurnCounter(){
    let dark=false,anchor=0,armed=true,count=0;
    return {
      setBlackout:function(on,yaw){
        const next=!!on;
        if(next&&!dark){anchor=Number(yaw)||0;armed=true;count=0;}
        if(!next){armed=true;count=0;}
        dark=next;
      },
      update:function(yaw){
        if(!dark)return false;
        const delta=Math.abs(wrapAngle((Number(yaw)||0)-anchor));
        if(!armed&&delta<.72)armed=true;
        if(armed&&delta>2.42){
          armed=false; count++;
          if(count>=TURN_TRIGGER){count=0;return true;}
        }
        return false;
      },
      snapshot:function(){return {dark:dark,count:count,armed:armed,anchor:anchor};}
    };
  }
  function playerDistance(origin,player){
    const dy=(Number(player.y)||0)-(Number(origin.y)||0);
    return Math.hypot((Number(player.x)||0)-(Number(origin.x)||0),(Number(player.z)||0)-(Number(origin.z)||0),dy*.7);
  }
  function chooseTarget(origin,players){
    const visible=(players||[]).filter(function(player){return player&&!player.room;});
    if(!visible.length)return null;
    visible.sort(function(a,b){return playerDistance(origin,a)-playerDistance(origin,b)||String(a.id).localeCompare(String(b.id));});
    return visible[0];
  }
  function texture(THREE){
    if(sharedTexture)return sharedTexture;
    sharedTexture=new THREE.TextureLoader().load(IMAGE);
    sharedTexture.minFilter=THREE.LinearFilter;
    sharedTexture.magFilter=THREE.LinearFilter;
    sharedTexture.generateMipmaps=true;
    return sharedTexture;
  }
  function makeMaterial(THREE){
    const uniforms={
      map:{value:texture(THREE)},uTime:{value:0},uLight:{value:1},uBlackout:{value:0},
      uSpeed:{value:0},uTurn:{value:0},uOpacity:{value:0},uJump:{value:0},
      uTexel:{value:new THREE.Vector2(1/1024,1/1536)}
    };
    const material=new THREE.ShaderMaterial({
      uniforms:uniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:false,
      vertexShader:[
        'uniform float uTime; uniform float uSpeed; uniform float uTurn;',
        'varying vec2 vUv;',
        'void main(){',
        '  vUv=uv;',
        '  vec3 p=position;',
        '  float face=1.0-smoothstep(.12,.27,distance(uv,vec2(.50,.87)));',
        '  float edge=smoothstep(.12,.45,abs(uv.x-.50));',
        '  float ends=pow(1.0-uv.y,1.55);',
        '  float hair=clamp(max(edge*.86,ends)*(1.0-face*.94),0.0,1.0);',
        '  float w1=sin(uTime*.73+uv.y*8.1+uv.x*3.7);',
        '  float w2=sin(uTime*1.19+uv.y*15.7-uv.x*5.2);',
        '  float w3=sin(uTime*.31+uv.y*4.3+2.1);',
        '  p.x+=(w1*.035+w2*.016+w3*.024+uTurn*.055)*hair*(1.0+uSpeed*.34);',
        '  p.y+=(sin(uTime*.61+uv.x*10.0)*.018+sin(uTime*1.43+uv.y*7.0)*.009)*hair;',
        '  p.x-=uTurn*ends*.045;',
        '  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);',
        '}'
      ].join('\n'),
      fragmentShader:[
        'uniform sampler2D map; uniform float uTime; uniform float uLight; uniform float uBlackout;',
        'uniform float uOpacity; uniform float uJump; uniform vec2 uTexel;',
        'varying vec2 vUv;',
        'void main(){',
        '  float faceStable=1.0-smoothstep(.12,.27,distance(vUv,vec2(.50,.87)));',
        '  float tips=pow(1.0-vUv.y,1.7)*smoothstep(.18,.48,abs(vUv.x-.50));',
        '  vec2 warp=vec2((sin(uTime*.83+vUv.y*13.0)+sin(uTime*1.37-vUv.y*7.0))*.0017*tips,',
        '                 sin(uTime*.57+vUv.x*11.0)*.0012*tips);',
        '  vec2 uv=clamp(vUv+warp*(1.0-faceStable*.96),vec2(.001),vec2(.999));',
        '  vec4 tex=texture2D(map,uv);',
        '  float n=max(max(texture2D(map,uv+vec2(uTexel.x*3.0,0.0)).a,texture2D(map,uv-vec2(uTexel.x*3.0,0.0)).a),',
        '              max(texture2D(map,uv+vec2(0.0,uTexel.y*3.0)).a,texture2D(map,uv-vec2(0.0,uTexel.y*3.0)).a));',
        '  float rim=clamp(n-tex.a,0.0,.42);',
        '  float irregular=.965+sin(uTime*.71)*.018+sin(uTime*1.93+1.7)*.012+sin(uTime*.17+4.1)*.010;',
        '  float level=mix(.48,.76,uLight)*irregular;',
        '  vec3 cold=tex.rgb*vec3(.78,.88,.91)*level;',
        '  float lum=dot(tex.rgb,vec3(.299,.587,.114));',
        '  float faceGlow=faceStable*smoothstep(.28,.78,lum)*(.035+.035*uBlackout+.10*uJump);',
        '  vec3 color=cold+vec3(.55,.80,.92)*faceGlow+vec3(.38,.70,.87)*rim*(.42+.46*uBlackout+.50*uJump);',
        '  color=mix(color,((color-.5)*(1.0+.34*uJump)+.5),uJump);',
        '  float tipFade=1.0-tips*(.035+.025*sin(uTime*.89+vUv.x*17.0));',
        '  float alpha=max(tex.a,rim*.62)*uOpacity*tipFade;',
        '  if(alpha<.012)discard;',
        '  gl_FragColor=vec4(color,alpha);',
        '}'
      ].join('\n')
    });
    return material;
  }
  function makeStatic(THREE){
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture(THREE),transparent:true,depthWrite:false,fog:true}));
    sprite.scale.set(1.45,2.18,1);
    return sprite;
  }
  function create(options){
    const opt=options||{},THREE=opt.THREE||window.THREE,scene=opt.scene,camera=opt.camera;
    const material=makeMaterial(THREE),geometry=new THREE.PlaneGeometry(2.2,3.3,16,24);
    const mesh=new THREE.Mesh(geometry,material),group=new THREE.Group();
    mesh.position.y=0; mesh.renderOrder=8; mesh.frustumCulled=false; group.add(mesh); group.visible=false;
    if(scene)scene.add(group);
    const counter=createTurnCounter();
    let dark=false,opacity=0,velocity=new THREE.Vector3(),lastDir=new THREE.Vector3(1,0,0),turn=0;
    let scareUntil=0,breathing=false,lastTarget='',passDir=1,disposed=false;

    function stopBreathing(){
      if(!breathing)return;
      breathing=false;
      if(typeof opt.onBreathingStop==='function')opt.onBreathingStop();
    }
    function setBlackout(on,yaw){
      const next=!!on;
      if(next===dark)return;
      dark=next; counter.setBlackout(next,yaw);
      scareUntil=0; material.uniforms.uJump.value=0; stopBreathing();
      if(next){group.visible=true;opacity=0;velocity.set(0,0,0);lastTarget='';}
    }
    function beginScare(now){
      scareUntil=now+3000; stopBreathing(); material.uniforms.uJump.value=1;
      if(typeof opt.onJumpScare==='function')opt.onJumpScare(3000);
    }
    function update(dt,now,context){
      if(disposed)return;
      const ctx=context||{},yaw=Number(ctx.yaw)||0,players=ctx.players||[],localId=String(ctx.localId||'');
      setBlackout(!!ctx.blackout,yaw);
      material.uniforms.uTime.value=(Number(now)||0)/1000;
      material.uniforms.uLight.value=Math.max(0,Math.min(1,Number(ctx.lightLevel)||0));
      material.uniforms.uBlackout.value=dark?1:0;
      if(!dark){opacity=Math.max(0,opacity-dt*2.8);material.uniforms.uOpacity.value=opacity;if(opacity<=.01)group.visible=false;return;}
      group.visible=true; opacity=Math.min(.94,opacity+dt*.72);
      const local=players.find(function(player){return String(player.id)===localId;})||players[0]||null;
      if(counter.update(yaw)&&now>=scareUntil&&!breathing)beginScare(now);
      if(scareUntil&&now>=scareUntil){
        scareUntil=0; material.uniforms.uJump.value=0;
        if(local&&!local.room){breathing=true;if(typeof opt.onBreathingStart==='function')opt.onBreathingStart();}
      }
      if(breathing&&local&&local.room)stopBreathing();

      const origin=group.position,target=chooseTarget(origin,players);
      let tx=origin.x+passDir*8,tz=0,ty=origin.y;
      if(target){
        lastTarget=String(target.id); tx=Number(target.x)||0; tz=Number(target.z)||0; ty=(Number(target.y)||0)+1.68;
      }else if(players.length){
        const hidden=players.slice().sort(function(a,b){return playerDistance(origin,a)-playerDistance(origin,b);})[0];
        if(hidden){
          if(lastTarget!==String(hidden.id)){passDir=origin.x<(Number(hidden.x)||0)?1:-1;lastTarget=String(hidden.id);}
          tx=(Number(hidden.x)||0)+passDir*10; tz=0; ty=(Number(hidden.y)||0)+1.68;
        }
      }
      if(!Number.isFinite(origin.y)||origin.lengthSq()===0){
        const base=target||local||{x:0,y:0,z:0};
        group.position.set((Number(base.x)||0)+9,(Number(base.y)||0)+1.68,0);
      }
      const dx=tx-origin.x,dy=ty-origin.y,dz=tz-origin.z,d=Math.hypot(dx,dy*.65,dz)||.001;
      const keep=target?1.65:.3,speed=d>17?2.75:2.15,wanted=d>keep?speed:0;
      const desired=new THREE.Vector3(dx/d*wanted,dy/d*wanted,dz/d*wanted);
      const smooth=Math.min(1,dt*(wanted>velocity.length()?1.9:2.8));
      velocity.lerp(desired,smooth);
      origin.addScaledVector(velocity,dt);
      const planar=Math.hypot(velocity.x,velocity.z),dir=planar>.05?new THREE.Vector3(velocity.x/planar,0,velocity.z/planar):lastDir;
      const signed=lastDir.x*dir.z-lastDir.z*dir.x; turn+=(signed-turn)*Math.min(1,dt*4.2); lastDir.lerp(dir,Math.min(1,dt*2.5)).normalize();
      material.uniforms.uSpeed.value=Math.min(1,planar/2.75);
      material.uniforms.uTurn.value=Math.max(-1,Math.min(1,turn*4));
      material.uniforms.uOpacity.value=opacity;
      if(camera)group.quaternion.copy(camera.quaternion);
      mesh.position.y=Math.sin((Number(now)||0)*.0011+group.position.x*.17)*.075;
    }
    function dispose(){
      if(disposed)return;disposed=true;stopBreathing();
      if(scene)scene.remove(group);geometry.dispose();material.dispose();
    }
    return {spr:group,mats:[material],update:update,setBlackout:setBlackout,stopBreathing:stopBreathing,dispose:dispose,
      snapshot:function(){return {dark:dark,opacity:opacity,target:lastTarget,breathing:breathing,scareUntil:scareUntil,turns:counter.snapshot()};}};
  }

  window.HauntedHotelGhost={IMAGE:IMAGE,TURN_TRIGGER:TURN_TRIGGER,create:create,makeStatic:makeStatic,
    _wrapAngle:wrapAngle,_chooseTarget:chooseTarget,_createTurnCounter:createTurnCounter};
})();
