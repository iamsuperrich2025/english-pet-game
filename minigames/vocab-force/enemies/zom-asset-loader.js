"use strict";
/* One zombie template. Extra GLBs contribute clips only. Instances clone the rig. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  let template = null;
  let height = 1.8;
  let clips = {};
  let ready = false;

  function three(){ return root.THREE; }

  function ensureLoader(){
    return VF.NexAssets && VF.NexAssets.loadGltf
      ? Promise.resolve()
      : Promise.reject(new Error('NexAssets missing'));
  }

  function cloneSkinned(source){
    const THREE = three();
    const rootObj = source.clone(true);
    const bonesByName = {};
    rootObj.traverse(function(n){
      if(n.isBone) bonesByName[n.name] = n;
    });
    const srcSkins = [];
    source.traverse(function(n){ if(n.isSkinnedMesh) srcSkins.push(n); });
    const dstSkins = [];
    rootObj.traverse(function(n){ if(n.isSkinnedMesh) dstSkins.push(n); });
    for(let i = 0; i < srcSkins.length; i++){
      const src = srcSkins[i];
      const dst = dstSkins[i];
      if(!src || !dst || !src.skeleton) continue;
      dst.geometry = src.geometry;
      dst.material = src.material;
      const bones = src.skeleton.bones.map(function(bone){
        return bonesByName[bone.name] || bone;
      });
      const inverses = src.skeleton.boneInverses.map(function(m){ return m.clone(); });
      dst.bind(new THREE.Skeleton(bones, inverses), src.bindMatrix.clone());
      dst.frustumCulled = true;
      dst.castShadow = false;
      dst.receiveShadow = false;
    }
    return rootObj;
  }

  VF._t.cloneSkinned = cloneSkinned;

  VF.ZomAssets = {
    ready: function(){ return ready; },
    height: function(){ return height; },
    clips: function(){ return clips; },
    async prepare(onProgress){
      if(ready) return this;
      await ensureLoader();
      const man = VF.ZomManifest;
      const report = function(p, msg){ if(onProgress) onProgress(p, msg); };
      report(0.1, 'กำลังโหลดซอมบี้');
      const bodySpec = man.spec(man.bodyState);
      const body = await VF.NexAssets.loadGltf(bodySpec.url);
      template = body.scene;
      template.traverse(function(n){
        if(n.isMesh){ n.castShadow = false; n.receiveShadow = false; n.frustumCulled = true; }
      });
      height = VF.NexAssets.groundAlign(template) || 1.8;
      clips.walk = VF.NexAssets.clipByName(body, man.spec('walk').clip);
      clips.idle = VF.NexAssets.clipByName(body, man.spec('idle').clip) || clips.walk;
      report(0.45, 'กำลังโหลดท่าตะโกน');
      const recScream = await VF.NexAssets.loadGltf(man.spec('scream').url);
      clips.scream = VF.NexAssets.clipByName(recScream, man.spec('scream').clip);
      if(recScream.url !== VF.asset(bodySpec.url)){
        VF.NexAssets.disposeScene(recScream.scene);
        recScream.scene = null; recScream.gltf = null;
      }
      report(0.75, 'กำลังโหลดท่าล้ม');
      const recFall = await VF.NexAssets.loadGltf(man.spec('fall').url);
      clips.fall = VF.NexAssets.clipByName(recFall, man.spec('fall').clip);
      if(recFall.url !== VF.asset(bodySpec.url)){
        VF.NexAssets.disposeScene(recFall.scene);
        recFall.scene = null; recFall.gltf = null;
      }
      ready = true;
      report(1, 'ซอมบี้พร้อม');
      return this;
    },
    spawn(){
      if(!ready || !template) throw new Error('ZomAssets not prepared');
      const THREE = three();
      const pivot = new THREE.Group();
      pivot.name = 'VFZombie';
      const model = cloneSkinned(template);
      pivot.add(model);
      const anim = new VF.NexAnimationController(model, VF.ZomManifest);
      if(clips.walk) anim.addClip('walk', clips.walk);
      if(clips.idle) anim.addClip('idle', clips.idle);
      if(clips.scream) anim.addClip('scream', clips.scream);
      if(clips.fall) anim.addClip('fall', clips.fall);
      return {pivot: pivot, model: model, anim: anim, height: height};
    }
  };

  VF._t.zomAssets = VF.ZomAssets;
})(typeof window !== 'undefined' ? window : globalThis);
