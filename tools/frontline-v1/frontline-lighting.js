/* One small 512px shadow map. The frustum snaps to texel-aligned steps so received ground shadows do not crawl. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeLighting=function(renderer,scene){
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
    const sky=new T.HemisphereLight(0xfffbe8,0x66974d,.82),sun=new T.DirectionalLight(0xfff4d6,.9);
    const half=26,mapSize=512,quant=(half*2)/mapSize*8,snap=v=>Math.round(v/quant)*quant;
    sun.castShadow=true;sun.shadow.mapSize.set(mapSize,mapSize);sun.shadow.bias=-.00035;sun.shadow.normalBias=.035;
    Object.assign(sun.shadow.camera,{left:-half,right:half,top:half,bottom:-half,near:1,far:85});sun.shadow.camera.updateProjectionMatrix();
    scene.add(sky,sun,sun.target);let lastX=Infinity,lastZ=Infinity;
    return{update(focus){
      if(lastX!==Infinity&&Math.hypot(focus.x-lastX,focus.z-lastZ)<quant*.6)return;
      const x=snap(focus.x),z=snap(focus.z);
      if(x===lastX&&z===lastZ)return;
      lastX=x;lastZ=z;
      sun.position.set(x-12,26,z+10);sun.target.position.set(x,0,z-3);sun.target.updateMatrixWorld();
      renderer.shadowMap.needsUpdate=true;
    },dispose(){sun.shadow.dispose();scene.remove(sky,sun,sun.target);}};
  };
})();
