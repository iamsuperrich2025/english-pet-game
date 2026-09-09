/* Small equal-mass bumpers: short movement steps, solid hulls and constrained pushes. */
(function(){
  'use strict';
  const F=window.Frontline,R=1.65,D=R*2,EPS=.0001;
  function bodies(room,tank,key){
    const list=[];
    for(const [k,p] of Object.entries(room?.players||{}))if(p.hp>0&&p.id!==tank?.id)list.push({p,key:k,x:p.x,z:p.z});
    for(const p of Object.values(room?.guards||{}))if(p.hp>0&&p.id!==tank?.id)list.push({p,key:'guard',x:p.x,z:p.z});
    if(tank&&tank.hp>0)list.push({p:tank,key,x:tank.x,z:tank.z});
    return list;
  }
  function allowed(room,b,x,z){
    return Math.abs(x)<=F.C.halfX-1&&Math.abs(z)<=F.C.halfZ-1&&(!F.canOccupy||F.canOccupy(room,b.key,x,z));
  }
  function shift(room,b,dx,dz){
    let fraction=1;
    if(!allowed(room,b,b.x+dx,b.z+dz)){
      let lo=0,hi=1;
      for(let i=0;i<12;i++){const mid=(lo+hi)/2;if(allowed(room,b,b.x+dx*mid,b.z+dz*mid))lo=mid;else hi=mid;}
      fraction=lo;
    }
    b.x+=dx*fraction;b.z+=dz*fraction;return fraction;
  }
  function solve(room,list){
    for(let pass=0;pass<16;pass++){
      let overlap=false;
      for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
        const a=list[i],b=list[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),depth=D-d;
        if(depth<=EPS)continue;overlap=true;
        const nx=d>EPS?(Math.abs(dx)<1e-8?0:dx/d):1,nz=d>EPS?(Math.abs(dz)<1e-8?0:dz/d):0,half=(depth+EPS)*.5;
        const fa=shift(room,a,-nx*half,-nz*half),fb=shift(room,b,nx*half,nz*half);
        // A wall or locked vault takes the load; the other hull absorbs the remainder.
        if(fa<1)shift(room,b,nx*half*(1-fa),nz*half*(1-fa));
        if(fb<1)shift(room,a,-nx*half*(1-fb),-nz*half*(1-fb));
      }
      if(!overlap)return true;
    }
    return list.every((a,i)=>list.slice(i+1).every(b=>Math.hypot(a.x-b.x,a.z-b.z)>=D-EPS));
  }
  F.tankDiameter=D;
  F.moveTank=function(tank,room,key,x,z){
    const list=bodies(room,tank,key),self=list[list.length-1],dx=x-tank.x,dz=z-tank.z;
    if(!self)return false;
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.2));let bumped=false;
    for(let step=0;step<steps;step++){
      const before=list.map(b=>({x:b.x,z:b.z}));
      if(!allowed(room,self,self.x+dx/steps,self.z+dz/steps))break;
      self.x+=dx/steps;self.z+=dz/steps;
      if(!solve(room,list)){list.forEach((b,i)=>Object.assign(b,before[i]));bumped=true;break;}
      if(Math.hypot(self.x-before[before.length-1].x-dx/steps,self.z-before[before.length-1].z-dz/steps)>EPS)bumped=true;
    }
    for(const b of list){
      if(b.p!==tank&&Math.hypot(b.x-b.p.x,b.z-b.p.z)>EPS)b.p.bumpSeq=(b.p.bumpSeq||0)+1;
      b.p.x=b.x;b.p.z=b.z;
    }
    return bumped;
  };
  F.clearSpawn=function(room,tank,key){
    const others=bodies(room,tank,key).filter(b=>b.p!==tank),origin={x:tank.x,z:tank.z};
    for(let ring=0;ring<=4;ring++)for(let i=0;i<(ring?16:1);i++){
      const angle=i*Math.PI/8,x=origin.x+Math.cos(angle)*ring*(D+.1),z=origin.z+Math.sin(angle)*ring*(D+.1);
      if(allowed(room,{key},x,z)&&others.every(b=>Math.hypot(x-b.x,z-b.z)>=D)){tank.x=x;tank.z=z;return;}
    }
  };
})();
