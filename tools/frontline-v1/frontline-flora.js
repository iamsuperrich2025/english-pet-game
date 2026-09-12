/* Fixed instanced grass and daisies: three draw calls, rewritten only for recycled chunks. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeFlora=function(root){
    const leaf=new T.Shape();leaf.moveTo(-.055,0);leaf.quadraticCurveTo(-.2,.28,0,.54);leaf.quadraticCurveTo(.2,.4,.055,0);
    const leafGeo=new T.ShapeGeometry(leaf,3),flower=new T.Shape();
    for(let i=0;i<=40;i++){const a=i*Math.PI*2/40,r=.25+.075*Math.cos(a*5),x=Math.cos(a)*r,y=Math.sin(a)*r;
      if(i===0)flower.moveTo(x,y);else flower.lineTo(x,y);}
    const flowerGeo=new T.ShapeGeometry(flower),pollenGeo=new T.CircleGeometry(.09,10);
    const mat=hex=>new T.MeshLambertMaterial({color:new T.Color(hex).convertSRGBToLinear(),side:T.DoubleSide});
    const leafMat=mat(0xffffff),flowerMat=mat(0xfffde8),pollenMat=mat(0xffce47);
    const bladesPer=40*3,bloomsPer=10,slots=15;
    const grass=new T.InstancedMesh(leafGeo,leafMat,slots*bladesPer),petals=new T.InstancedMesh(flowerGeo,flowerMat,slots*bloomsPer),pollen=new T.InstancedMesh(pollenGeo,pollenMat,slots*bloomsPer);
    const leaves=[0x75b347,0x8ec952,0x65a244].map(hex=>new T.Color(hex).convertSRGBToLinear()),dummy=new T.Object3D();
    grass.count=slots*bladesPer;petals.count=pollen.count=slots*bloomsPer;
    for(const mesh of [grass,petals,pollen]){mesh.frustumCulled=false;root.add(mesh);}
    function allowed(x,z){return Math.abs(x)<F.C.halfX-1.4&&Math.abs(z)<F.C.halfZ-1.4&&
      Math.abs(x-Math.round(x/36)*36)>1.9&&Math.abs(z-Math.round(z/36)*36)>1.9&&
      [0,1,2,3].every(slot=>{const b=F.baseSpot(slot);return Math.hypot(x-b.x,z-b.z)>4.3;});}
    function hide(){dummy.position.set(1000,-10,1000);dummy.rotation.set(0,0,0);dummy.scale.setScalar(0);dummy.updateMatrix();}
    function fill(slot,tx,tz,hash){
      let blades=slot*bladesPer,blooms=slot*bloomsPer;const size=F.C.chunkSize;
      for(let i=0;i<40;i++){
        const x=(tx+hash(tx,tz,400+i*7)-.5)*size,z=(tz+hash(tx,tz,401+i*7)-.5)*size,ok=allowed(x,z);
        const yaw=hash(tx,tz,402+i*7)*Math.PI*2,scale=1.05+hash(tx,tz,403+i*7)*.55;
        for(let n=0;n<3;n++){
          if(ok){dummy.position.set(x+(n-1)*.20,-.04,z);dummy.rotation.set(-.8,Math.sin(yaw)*.3,(n-1)*-.48);dummy.scale.set(scale*1.4,scale,scale);dummy.updateMatrix();}
          else hide();
          grass.setMatrixAt(blades,dummy.matrix);grass.setColorAt(blades,leaves[n]);blades++;
        }
        if(i%4===0){
          if(ok){dummy.position.set(x+.35,.045,z+.25);dummy.rotation.set(-Math.PI/2,0,yaw);dummy.scale.setScalar(.8+scale*.3);dummy.updateMatrix();}
          else hide();
          petals.setMatrixAt(blooms,dummy.matrix);
          if(ok){dummy.position.y=.055;dummy.updateMatrix();}
          pollen.setMatrixAt(blooms,dummy.matrix);blooms++;
        }
      }
      for(const mesh of [grass,petals,pollen])mesh.instanceMatrix.needsUpdate=true;
      if(grass.instanceColor)grass.instanceColor.needsUpdate=true;
    }
    return{fill,dispose(){for(const mesh of [grass,petals,pollen]){root.remove(mesh);if(mesh.dispose)mesh.dispose();}
      [leafGeo,flowerGeo,pollenGeo].forEach(g=>g.dispose());[leafMat,flowerMat,pollenMat].forEach(m=>m.dispose());}};
  };
})();
