"use strict";
/* Loads NEX GLBs once. One visible body. Extra files contribute clips only. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const cache = new Map();
  const pending = new Map();
  let loader = null;
  let loaderPromise = null;

  function three(){ return root.THREE; }

  function ensureLoader(){
    const THREE = three();
    if(THREE && THREE.GLTFLoader){
      loader = loader || new THREE.GLTFLoader();
      return Promise.resolve(loader);
    }
    if(loaderPromise) return loaderPromise;
    const src = (VF.vendorPath || 'js/vendor/') + 'GLTFLoader.js';
    loaderPromise = new Promise(function(resolve, reject){
      if(typeof loadScriptOnce === 'function'){
        loadScriptOnce(src).then(function(){
          const T = three();
          if(!T || !T.GLTFLoader) return reject(new Error('GLTFLoader missing'));
          loader = new T.GLTFLoader();
          resolve(loader);
        }).catch(reject);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = function(){
        const T = three();
        if(!T || !T.GLTFLoader) return reject(new Error('GLTFLoader missing'));
        loader = new T.GLTFLoader();
        resolve(loader);
      };
      s.onerror = function(){ reject(new Error('GLTFLoader failed: ' + src)); };
      document.head.appendChild(s);
    }).catch(function(err){ loaderPromise = null; throw err; });
    return loaderPromise;
  }

  function disposeScene(scene){
    if(!scene) return;
    scene.traverse(function(node){
      if(node.geometry && node.geometry.dispose) node.geometry.dispose();
      const mats = node.material ? (Array.isArray(node.material) ? node.material : [node.material]) : [];
      mats.forEach(function(mat){
        if(!mat) return;
        ['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap','alphaMap'].forEach(function(key){
          if(mat[key] && mat[key].dispose) mat[key].dispose();
        });
        if(mat.dispose) mat.dispose();
      });
    });
  }

  function stripRootXZ(clip){
    if(!clip || !clip.tracks) return clip;
    clip.tracks.forEach(function(track){
      if(!track || !track.name || track.name.indexOf('mixamorig:Hips.position') < 0) return;
      const v = track.values;
      if(!v) return;
      for(let i = 0; i < v.length; i += 3){ v[i] = 0; v[i + 2] = 0; }
    });
    return clip;
  }

  function loadGltf(rel){
    const url = VF.asset(rel);
    if(cache.has(url)) return Promise.resolve(cache.get(url));
    if(pending.has(url)) return pending.get(url);
    const work = ensureLoader().then(function(){
      return new Promise(function(resolve, reject){
        loader.load(url, function(gltf){
          const clips = (gltf.animations || []).map(function(clip){ return stripRootXZ(clip); });
          const rec = { url: url, gltf: gltf, clips: clips, scene: gltf.scene };
          cache.set(url, rec);
          resolve(rec);
        }, undefined, function(err){ reject(err || new Error('GLB failed: ' + url)); });
      });
    }).finally(function(){ pending.delete(url); });
    pending.set(url, work);
    return work;
  }

  function clipByName(rec, name){
    if(!rec || !rec.clips) return null;
    return rec.clips.find(function(c){ return c.name === name; }) || rec.clips[0] || null;
  }

  function groundAlign(rootObj){
    const THREE = three();
    rootObj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(rootObj);
    if(!Number.isFinite(box.min.y)) return 1.8;
    rootObj.position.y -= box.min.y;
    return Math.max(1.2, box.max.y - box.min.y);
  }

  VF.NexAssets = {
    cache: cache,
    loadGltf: loadGltf,
    clipByName: clipByName,
    disposeScene: disposeScene,
    groundAlign: groundAlign,
    async loadBody(manifest){
      const man = manifest || VF.NexManifest;
      const spec = man.spec(man.bodyState);
      const rec = await loadGltf(spec.url);
      return rec;
    },
    async loadState(state, manifest){
      const man = manifest || VF.NexManifest;
      const spec = man.spec(state);
      if(!spec) return null;
      const rec = await loadGltf(spec.url);
      return { spec: spec, rec: rec, clip: clipByName(rec, spec.clip) };
    },
    forgetExtras(keepUrl){
      cache.forEach(function(rec, url){
        if(url === keepUrl) return;
        if(rec && rec.scene && rec.scene.parent) rec.scene.parent.remove(rec.scene);
        disposeScene(rec.scene);
        rec.scene = null;
        rec.gltf = null;
      });
    }
  };
  VF._t.assets = VF.NexAssets;
})(typeof window !== 'undefined' ? window : globalThis);
