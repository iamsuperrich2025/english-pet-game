/* 🤖 รอบ 1613 — ตัวโกงซอมบี้ในโลกหุ่นยนต์นักรบ → หุ่นยนต์ร้าย GLB
   minigames/robot/badRobot_walking_2_inplace.glb (Mixamo skinned + ท่าเดิน)
   · โหลด template ครั้งเดียว แชร์ geometry/วัสดุ · clone กระดูก + AnimationMixer ต่อตัว
   · โหลดไม่สำเร็จ = ตกกลับไปใช้ซอมบี้กล่องเดิม (fallback ใน adventure3d.js) */
(function(root){
  'use strict';
  const URL='minigames/robot/badRobot_walking_2_inplace.glb';
  const TARGET_H=3.3;                      // สูงพอ ๆ กับซอมบี้เดิม (หัว ~4.9 ใน world)
  let template=null, pending=null;
  const mixers=new Set();                  // mixer ทุกตัวที่ยังอยู่ในสนาม

  function ensureLoader(){
    if(root.THREE&&root.THREE.GLTFLoader)return Promise.resolve();
    if(!pending){
      const load=typeof loadScriptOnce==='function'?loadScriptOnce('js/vendor/GLTFLoader.js'):new Promise((resolve,reject)=>{
        const s=document.createElement('script');s.src='js/vendor/GLTFLoader.js';s.onload=resolve;s.onerror=()=>{s.remove();reject(new Error('GLTFLoader unavailable'));};document.head.appendChild(s);
      });
      pending=Promise.resolve(load).then(()=>{if(!root.THREE.GLTFLoader)throw new Error('GLTFLoader unavailable');}).catch(error=>{pending=null;throw error;});
    }
    return pending;
  }
  /* สะพานวัสดุ: renderer ตัวเก่าใช้ linear output — ปรับสี texture/material ให้เข้ากับโลก mecha
     (แพทเทิร์นเดียวกับ js/mecha-models.js รอบ 1399 · เก็บ map ของ GLB ไว้ใช้งาน) */
  function legacyMaterials(source){
    const materials=new Map();
    source.traverse(o=>{
      if(!o.isMesh)return;
      const old=o.material;
      if(!materials.has(old)){
        const m=new root.THREE.MeshPhongMaterial({
          name:old.name,
          map:old.map||null,
          color:old.color?old.color.clone().convertSRGBToLinear():new root.THREE.Color(0xffffff),
          shininess:34,specular:0x3a3a3a,
          emissive:old.emissive?old.emissive.clone().convertSRGBToLinear():new root.THREE.Color(0x000000),
          transparent:!!old.transparent,opacity:old.opacity===undefined?1:old.opacity
        });
        materials.set(old,m);
      }
      o.material=materials.get(old);
    });
  }
  /* clone ตัวละครที่มีกระดูก (SkeletonUtils ฉบับย่อ — vendor ไม่มีไฟล์นี้) */
  function cloneSkinned(src){
    const srcMap=new Map(), cloneMap=new Map();
    const c=src.clone(true);
    (function walk(a,b){
      srcMap.set(b,a); cloneMap.set(a,b);
      for(let i=0;i<a.children.length;i++) walk(a.children[i],b.children[i]);
    })(src,c);
    c.traverse(n=>{
      if(!n.isSkinnedMesh)return;
      const s=srcMap.get(n);
      const bones=s.skeleton.bones.map(b=>cloneMap.get(b)||b);
      n.skeleton=new root.THREE.Skeleton(bones,s.skeleton.boneInverses); // boneInverses แชร์ได้ (read-only)
      n.bind(n.skeleton,n.bindMatrix.clone());
    });
    return c;
  }
  function prepare(){
    if(template)return Promise.resolve(template);
    if(pending)return pending;
    pending=ensureLoader().then(()=>new Promise((resolve,reject)=>{
      new root.THREE.GLTFLoader().load(URL,g=>{
        const scene=g.scene;
        scene.traverse(o=>{ if(o.isMesh){o.castShadow=false;o.receiveShadow=false;} });
        legacyMaterials(scene);
        const box=new root.THREE.Box3().setFromObject(scene);
        const h=(box.max.y-box.min.y)||1;
        /* เลือกคลิปเดินที่ยาวสุด (walking_2_inplace 1.25 วิ · .001 สั้น 0.08 วิ) */
        let clip=null;
        (g.animations||[]).forEach(a=>{ if(!clip||a.duration>clip.duration) clip=a; });
        template={scene,scale:TARGET_H/h,minY:box.min.y,clip};
        resolve(template);
      },undefined,reject);
    })).catch(err=>{ pending=null; throw err; });
    return pending;
  }
  /* ผูกหุ่นร้ายเข้ากับกลุ่มซอมบี้ (grp) — เอา fallback (กล่องเดิม) ออกเมื่อพร้อม
     opts: {boss, species, fallback} · คืน Promise<boolean> */
  function attach(host,opts){
    opts=opts||{};
    host.userData.mzStatus='loading';
    return prepare().then(t=>{
      if(host.userData.mzDisposed)return false;
      const model=cloneSkinned(t.scene);
      model.traverse(o=>{ if(o.isMesh) o.userData.mzShared=true; });   // geometry/วัสดุ template — ห้าม dispose ใน removeAlien
      if(opts.boss&&opts.species){
        /* บอส: เรืองแสงตามสีสายพันธุ์ (วัสดุ clone แยก คืนหน่วยความจำใน detach) */
        const em=new root.THREE.Color(opts.species.emis||opts.species.body||0xff3344).multiplyScalar(2);   // emis สายพันธุ์เป็นโทนเข้ม — เพิ่ม 2 เท่าให้เห็นชัดแบบบอส
        const own=[];
        model.traverse(o=>{
          if(!o.isMesh)return;
          o.material=o.material.clone();
          o.material.emissive=em.clone();
          own.push(o.material);
        });
        host.userData.mzOwnMats=own;
      }
      const inner=new root.THREE.Group();
      inner.scale.setScalar(t.scale);
      inner.rotation.y=Math.PI;                 // โมเดล Mixamo หันหน้า +Z → กลับให้หัน -Z เหมือนซอมบี้เดิม
      inner.position.y=-t.minY*t.scale-1.55;    // เท้าแตะพื้นโลก (grp ลอย baseY=1.55)
      inner.add(model);
      if(opts.fallback){ host.remove(opts.fallback); disposeFallback(opts.fallback); }
      host.add(inner);
      if(t.clip){
        const mixer=new root.THREE.AnimationMixer(model);
        mixer.clipAction(t.clip).play();
        mixer.setTime(Math.random()*t.clip.duration);   // กันทุกตัวเดินพร้อมจังหวะเดียวกัน
        mixers.add(mixer);
        host.userData.mzMixer=mixer;
      }
      host.userData.mzStatus='ready';
      return true;
    }).catch(err=>{
      if(!host.userData.mzDisposed) host.userData.mzStatus='fallback';
      console.warn('[MechaZombieRobot] ใช้ซอมบี้กล่องแทน:',err&&err.message||err);
      return false;
    });
  }
  function disposeFallback(g){
    g.traverse(o=>{
      if(o.geometry)o.geometry.dispose();
      if(o.material){ if(o.material.map)o.material.map.dispose(); o.material.dispose(); }
    });
  }
  /* เรียกใน removeAlien ก่อน dispose กลุ่ม — ถอน mixer + คืนวัสดุบอส */
  function detach(host){
    const ud=host.userData||{};
    ud.mzDisposed=true;
    if(ud.mzMixer){ mixers.delete(ud.mzMixer); ud.mzMixer=null; }
    if(ud.mzOwnMats){ ud.mzOwnMats.forEach(m=>{ try{m.dispose();}catch(e){} }); ud.mzOwnMats=null; }
  }
  function tick(dt){ mixers.forEach(m=>m.update(dt)); }
  root.MechaZombieRobot=Object.freeze({prepare,attach,detach,tick});
})(window);
