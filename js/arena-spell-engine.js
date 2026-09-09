"use strict";
/* Round 1387: bounded spell trajectories. Uses ArenaElements' shared 12-zone budget. */
(function(){
  const TAU=Math.PI*2;
  function create(api){
    const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
    function position(z,forward,side=0){
      const p=z.origin.clone().addScaledVector(z.dir,forward);
      p.x+=z.dir.z*side;p.z-=z.dir.x*side;const d=Math.hypot(p.x,p.z);
      if(d>30){p.x*=30/d;p.z*=30/d;}p.y=0;return p;
    }
    function visual(z,p,r,shape,life=.55){
      return api.fx.motif(z.family,p,{r,shape:shape||z.recipe.pattern,life,color:z.color,variant:z.variant,yaw:Math.atan2(z.dir.x,z.dir.z)});
    }
    function hit(z,b,p,damage){
      const r=z.recipe;if(r.slow)b.slow=Math.max(b.slow||0,performance.now()+r.slow*1000);
      if(r.push)api.push(b,p,r.push);if(r.pull&&!['field','orbit'].includes(r.pattern))api.push(b,p,-r.pull);
      api.hit(b,damage*z.mult);api.fx.burst(b.group.position,z.color,6,3);
    }
    function area(z,p,r,damage,once=false){
      api.enemies(p,r,b=>{if(once&&z.hit.has(b))return;if(once)z.hit.add(b);hit(z,b,p,damage);});
    }
    function cast(def,pos,dir,target,mult){
      const recipe=window.ArenaSpellPacks?.[def.pack]?.[def.id];if(!recipe)return false;
      const aim=target?target.group.position.clone():pos.clone().addScaledVector(dir,8),count=recipe.pulses||recipe.steps||recipe.jumps||1;
      const duration=recipe.life||((recipe.delay||0)+(count-1)*(recipe.interval||.4)+.65);
      const z=api.zone('expanded',recipe.aim?aim:pos,dir,mult,duration,recipe.r);
      Object.assign(z,{recipe,family:def.family,color:parseInt(def.color.slice(1),16),spellId:def.id,origin:pos.clone(),aim,next:0,lastVisual:-1,variant:Object.keys(ArenaSpellPacks[def.pack]).indexOf(def.id),finalized:false});
      if(recipe.pattern==='chain')z.chainFrom=pos.clone();
      if(recipe.pattern==='field')z.visual=visual(z,z.pos,z.r,'field',duration);
      if(recipe.delay)api.fx.ring(z.pos,z.color,z.r,recipe.delay);
      if(recipe.pattern!=='return'&&(recipe.heal||recipe.shield))api.heal(recipe.heal||0,recipe.shield||0);
      return true;
    }
    function pulse(z,i){
      const r=z.recipe,pattern=r.pattern,col=z.color;
      if(pattern==='line'){
        const p=position(z,(i+.75)/r.steps*r.range,r.zigzag?(i%2?1:-1)*r.zigzag:0);
        visual(z,p,r.r,'lance');api.fx.beam(i?z.lastPoint:z.origin,p,col,.38);z.lastPoint=p;area(z,p,r.r,r.damage,true);
      }else if(pattern==='cone'){
        for(let n=-2;n<=2;n++){const p=position(z,r.range*.65,n*r.range*.13);visual(z,p,r.r,'wing');api.fx.beam(z.origin,p,col,.4);}
        api.enemies(z.origin,r.range,b=>{const p=b.group.position,dx=p.x-z.origin.x,dz=p.z-z.origin.z,d=Math.hypot(dx,dz)||1;if((dx*z.dir.x+dz*z.dir.z)/d>=.58)hit(z,b,z.origin,r.damage);});
      }else if(pattern==='cross'){
        for(let n=0;n<4;n++){const dir=z.dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0),n*Math.PI/2),end=z.origin.clone().addScaledVector(dir,r.range);api.fx.beam(z.origin,end,col,.6);
          for(let j=1;j<=4;j++){const p=z.origin.clone().addScaledVector(dir,j*r.range/4);visual(z,p,r.r,'lance',.7);area(z,p,r.r,r.damage,true);}}
      }else if(pattern==='twin'){
        for(const side of [-1,1]){const p=z.pos.clone();p.x+=z.dir.z*r.spread*side;p.z-=z.dir.x*r.spread*side;visual(z,p,r.r,'burst',.8);area(z,p,r.r,r.damage);}
      }else if(pattern==='rain'){
        const a=i*2.399963,spread=r.inward?r.spread*(1-i/r.steps):r.spread*Math.sqrt((i+.5)/r.steps),p=z.pos.clone();p.x+=Math.cos(a)*spread;p.z+=Math.sin(a)*spread;
        api.fx.beam(p.clone().add(new THREE.Vector3(0,11,0)),p,col,.5);visual(z,p,r.r,'burst',.7);area(z,p,r.r,r.damage);
      }else if(pattern==='rings'){
        const radius=r.r*(i+1)/r.steps;api.fx.ring(z.pos,col,radius,.65);
        api.enemies(z.pos,radius+r.r/r.steps*.6,b=>{if(z.hit.has(b)||Math.abs(distance(z.pos,b.group.position)-radius)>r.r/r.steps*.6)return;z.hit.add(b);hit(z,b,z.pos,r.damage);});
        for(let n=0;n<6;n++){const p=z.pos.clone(),a=n/6*TAU;p.x+=Math.cos(a)*radius;p.z+=Math.sin(a)*radius;visual(z,p,1.1,'petal');}
      }else if(pattern==='chain'){
        const reach=i?r.r:r.range,from=z.chainFrom;
        const candidates=api.allEnemies().filter(b=>!b.dead&&!z.hit.has(b)&&distance(from,b.group.position)<=reach).sort((a,b)=>distance(from,a.group.position)-distance(from,b.group.position));
        if(!candidates.length)return;const b=candidates[0];z.hit.add(b);api.fx.beam(from,b.group.position,col,.32);visual(z,b.group.position,2,'spark');hit(z,b,from,r.damage*Math.pow(.94,i));z.chainFrom=b.group.position.clone();
      }else{
        api.fx.ring(z.pos,col,r.r,.65);if(pattern!=='field')visual(z,z.pos,r.r,'burst',.85);
        area(z,z.pos,r.r,r.damage);
      }
    }
    function tick(z,dt){
      const r=z.recipe,pattern=r.pattern;
      if(pattern==='field'&&r.pull)api.enemies(z.pos,r.r,b=>api.push(b,z.pos,-Math.min(distance(b.group.position,z.pos),dt*r.pull)));
      if(['orbit','return','serpent','fan'].includes(pattern)){
        const t=Math.min(1,z.age/z.max),points=[],arms=r.arms||1;
        for(let i=0;i<arms;i++){
          let p;
          if(pattern==='orbit'){const a=z.age*2.3*(r.reverse&&i%2?-1:1)+i/arms*TAU;p=z.pos.clone();p.x+=Math.cos(a)*r.orbit;p.z+=Math.sin(a)*r.orbit;}
          else if(pattern==='fan'){const spread=(i-(arms-1)/2)*.25,d=z.dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0),spread);p=z.origin.clone().addScaledVector(d,t*r.range);}
          else p=position(z,pattern==='return'?Math.sin(t*Math.PI)*r.range:t*r.range,pattern==='serpent'?Math.sin(t*Math.PI*3)*(r.amplitude||4):0);
          points.push(p);
        }
        if(pattern==='return'&&t>=.5&&!z.returned){z.returned=true;z.hit.clear();}
        if(z.age-z.lastVisual>=.13){for(const p of points)visual(z,p,r.r,pattern,.4);z.lastVisual=z.age;}
        if(pattern==='orbit'){while(z.next*(r.interval||.5)<=Math.min(z.age,z.max)){z.next++;for(const p of points)area(z,p,r.r,r.damage);}}
        else for(const p of points)area(z,p,r.r,r.damage,true);
      }else{
        const count=r.pulses||r.steps||r.jumps||1;
        while(z.next<count&&(r.delay||0)+z.next*(r.interval||.4)<=z.age){pulse(z,z.next);z.next++;}
      }
      if(z.life<=0&&!z.finalized){z.finalized=true;
        if(r.final){visual(z,z.pos,r.r,'burst',.8);area(z,z.pos,r.r,r.final);}
        if(pattern==='return'&&r.heal)api.heal(r.heal,r.shield||0);
      }
    }
    return {cast,tick};
  }
  window.ArenaSpellEngine={create};
})();

