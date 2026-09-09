/* One small 512px shadow map, refreshed at 10 Hz. Effects never cast shadows or create lights. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeLighting=function(renderer,scene){
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
    const sky=new T.HemisphereLight(0xfffbe8,0x66974d,.82),sun=new T.DirectionalLight(0xfff4d6,.9);
    sun.castShadow=true;sun.shadow.mapSize.set(512,512);sun.shadow.bias=-.00035;sun.shadow.normalBias=.035;
    Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:85});sun.shadow.camera.updateProjectionMatrix();
    scene.add(sky,sun,sun.target);let last=-Infinity;
    return{update(focus,now){if(now-last<100)return;last=now;
      sun.position.set(focus.x-12,26,focus.z+10);sun.target.position.set(focus.x,0,focus.z-3);renderer.shadowMap.needsUpdate=true;
    },dispose(){sun.shadow.dispose();scene.remove(sky,sun,sun.target);}};
  };
})();
