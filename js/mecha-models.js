/* 🤖 Round 1399 — selected GLB mecha peers. Shared geometry, independent pivots.
   Soft Cuboid Chibi 3D; ten allowlisted files; existing m_01..m_10 wire format. */
(function(root){
  'use strict';
  const templates=new Map(), pending=new Map();
  let loaderPending=null;
  function robotId(value){ return /^robot_(?:0[1-9]|10)$/.test(value)?value:'robot_01'; }
  function fromAvatar(value){ const match=/^m_(0[1-9]|10)$/.exec(value||'');return match?'robot_'+match[1]:'robot_01'; }
  function avatar(value){ return 'm_'+robotId(value).slice(-2); }
  function resolveSelection(selected,owned){
    if(/^robot_(?:0[1-9]|10)$/.test(selected))return selected;
    return (Array.isArray(owned)&&owned.find(id=>/^robot_(?:0[1-9]|10)$/.test(id)))||'robot_01';
  }
  function ensureLoader(){
    if(root.THREE&&root.THREE.GLTFLoader)return Promise.resolve();
    if(!loaderPending){
      const load=typeof loadScriptOnce==='function'?loadScriptOnce('js/vendor/GLTFLoader.js'):new Promise((resolve,reject)=>{
        const s=document.createElement('script');s.src='js/vendor/GLTFLoader.js';s.onload=resolve;s.onerror=()=>{s.remove();reject(new Error('GLTFLoader unavailable'));};document.head.appendChild(s);
      });
      loaderPending=Promise.resolve(load).then(()=>{if(!root.THREE.GLTFLoader)throw new Error('GLTFLoader unavailable');}).catch(error=>{loaderPending=null;throw error;});
    }
    return loaderPending;
  }
  // Adventure3D uses a legacy linear-output renderer. Keep portable GLBs in
  // standard PBR, but bridge their colors/materials once for this engine only.
  function legacyMaterials(source){
    const materials=new Map(), geometries=new Set();
    source.traverse(o=>{
      if(!o.isMesh)return;
      if(!geometries.has(o.geometry)){
        geometries.add(o.geometry);
        const color=o.geometry.getAttribute('color');
        if(color){
          const scale=color.normalized?255:1;
          for(let i=0;i<color.array.length;i+=color.itemSize)for(let c=0;c<3;c++){
            const v=color.array[i+c]/scale;
            color.array[i+c]=(v<=.0031308?v*12.92:1.055*Math.pow(v,1/2.4)-.055)*scale;
          }
          color.needsUpdate=true;
        }
      }
      const old=o.material;
      if(!materials.has(old))materials.set(old,new root.THREE.MeshPhongMaterial({
        name:old.name,vertexColors:true,color:0xffffff,shininess:38,specular:0x404040,
        emissive:old.emissive?old.emissive.clone().convertLinearToSRGB():0x000000
      }));
      o.material=materials.get(old);
    });
    materials.forEach((replacement,old)=>old.dispose());
  }
  function prepare(value){
    const id=robotId(value);
    if(templates.has(id))return Promise.resolve(templates.get(id));
    if(pending.has(id))return pending.get(id);
    const work=ensureLoader().then(()=>new Promise((resolve,reject)=>{
      new root.THREE.GLTFLoader().load('img/models/mecha/'+id+'.glb',gl=>{
        const source=gl.scene;
        if(!['Leg_L','Leg_R','Arm_L','Arm_R'].every(name=>source.getObjectByName(name))){reject(new Error('Mecha pivots missing: '+id));return;}
        legacyMaterials(source);
        source.userData.robotId=id;source.userData.playerStyle='soft-cuboid-chibi-3d';
        source.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});
        templates.set(id,source);resolve(source);
      },undefined,reject);
    })).finally(()=>pending.delete(id));
    pending.set(id,work);return work;
  }
  function attach(host,value,fallback){
    const id=robotId(value);host.userData.robotId=id;host.userData.mechaModelStatus='loading';
    return prepare(id).then(source=>{
      if(host.userData.mechaDisposed)return false;
      const model=source.clone(true);
      const limbs=['Leg_L','Leg_R','Arm_L','Arm_R'].map(name=>model.getObjectByName(name));
      const previous=host.userData.limbs||[];
      limbs.forEach((limb,i)=>{if(previous[i])limb.rotation.x=previous[i].rotation.x;});
      if(fallback)host.remove(fallback);
      host.add(model);host.userData.limbs=limbs;host.userData.mechaModelStatus='ready';host.userData.playerStyle='soft-cuboid-chibi-3d';
      return true;
    }).catch(error=>{
      if(!host.userData.mechaDisposed)host.userData.mechaModelStatus='fallback';
      console.warn('[MechaModels] '+id+' kept its fallback:',error.message||error);
      return false;
    });
  }
  root.MechaModels=Object.freeze({robotId,fromAvatar,avatar,resolveSelection,prepare,attach});
})(window);
