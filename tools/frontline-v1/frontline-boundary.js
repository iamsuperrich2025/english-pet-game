/* A visible toy-wood perimeter for the existing arena; presentation only, never collision. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeBoundary=function(scene,shapes){
    const root=new T.Group(),hx=F.C.halfX,hz=F.C.halfZ;
    root.name='frontline-arena-edge';scene.add(root);
    for(const sign of [-1,1])for(const [y,height,color] of [[.35,.22,0xbf8650],[.87,.27,0xe3b674]]){
      shapes.part(root,[hx*2,height,.26],[0,y,sign*hz],color,.08);
      shapes.part(root,[.26,height,hz*2],[sign*hx,y,0],color,.08);
    }
    const nx=Math.ceil(hx*2/6),nz=Math.ceil(hz*2/6);
    const sample=shapes.part(root,[.56,1.4,.56],[0,0,0],0xc99459,.14);root.remove(sample);
    const posts=new T.InstancedMesh(sample.geometry,sample.material,(nx+nz)*2),pose=new T.Object3D();
    // All posts share one fixed draw; this Three version cannot cull instance bounds correctly.
    posts.frustumCulled=false;let index=0;
    function post(x,z){pose.position.set(x,.66,z);pose.updateMatrix();posts.setMatrixAt(index++,pose.matrix);}
    for(let i=0;i<nx;i++){const x=-hx+i*hx*2/nx;post(x,-hz);post(-x,hz);}
    for(let i=0;i<nz;i++){const z=-hz+i*hz*2/nz;post(hx,z);post(-hx,-z);}
    posts.instanceMatrix.needsUpdate=true;root.add(posts);
    root.traverse(mesh=>{if(mesh.isMesh)mesh.receiveShadow=true;});
    return{dispose(){scene.remove(root);if(posts.dispose)posts.dispose();}};
  };
})();
