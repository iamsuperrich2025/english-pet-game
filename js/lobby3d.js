/* ============================================================
   lobby3d.js — โมเดล 3D ตัวละครในหน้า Lobby (รอบ 114)
   • โหลด GLB ผู้เลี้ยง + น้อง (img/models/*.glb)
   • idle เบาๆ (หายใจ/โยกตัว) + เล่น animation clip จากไฟล์ (Tripo ชื่อ NlaTrack → ใช้ clip แรก)
   • ปัด/ลากซ้าย-ขวา = หมุนตัวละคร 360° ดูรอบตัว (ตอน idle ยืนหันหน้าตรง ไม่หมุนเอง — ผู้ใช้สั่งรอบ 114)
   • ไม่มีไฟล์ .glb / โหลดไม่ได้ / เปิดแบบ file:// → ซ่อน canvas ใช้ภาพ PNG เดิม (fallback)
   โหลด dynamic: ต้องมี global THREE (js/vendor/three.min.js) + THREE.GLTFLoader (js/vendor/GLTFLoader.js)
   ============================================================ */
const Lobby3D = (function(){
  const MODEL_DIR = 'img/models/';
  // ความสูงโมเดล (หน่วยโลก) ตามระดับร่างยักษ์ 0..4 — ล้อกับ 2D: ปกติผู้เลี้ยงสูงกว่า · ยักษ์สุดผู้เลี้ยงแค่เข่า
  const PET_H   = [0.80, 1.85, 2.45, 3.00, 3.50];   // รอบ 161: g0 1.30→0.80 — น้องร่างปกติสูงไม่เกินเอวคน (0.80/1.55 ≈ 52%)
  const OWNER_H = [1.55, 1.50, 1.35, 1.15, 1.00];
  // โมเดล Tripo หันด้านข้าง (หน้าชี้ -X) โดยดีฟอลต์ → หมุนฐาน -90° ให้ยืน standby หันหน้าเข้าหาผู้เล่น
  // ✅ ทำงานถูกแล้วหลังแก้ cloneSkinned (รอบ 105) — ก่อนหน้านี้เห็นหลัง/เล็ก เพราะ skeleton ไม่ rebind (ดู cloneSkinned)
  const FACE_CAMERA = -Math.PI/2;

  let three=null, renderer=null, scene=null, camera=null, clock=null;
  let rootTilt=null, spin=null, sway=null;        // rootTilt→spin(หมุนผู้เล่น)→sway(idle)
  let ownerRoot=null, petRoot=null;               // holder แต่ละตัว (ใส่โมเดลที่ fit แล้ว)
  let mixers=[];                                   // AnimationMixer ต่อโมเดล
  let raf=0, running=false, disabled=false, booting=false;
  let heroEl=null, canvas=null;
  let curKey='';                                   // avatar|petType|stage ที่โหลดอยู่
  let curGiant=-1;
  const existCache={};                             // "avatar|petType" -> true/false (มีไฟล์ glb ครบไหม)
  let dragRot=0, targetRot=0, spinVel=0;           // มุมหมุนจากการปัด
  const gltfCache={};                              // url -> gltf.scene (ต้นฉบับ clone ได้)

  function isFileProto(){ return location.protocol === 'file:'; }

  // เช็กว่ามีไฟล์ .glb ครบทั้งผู้เลี้ยง+น้องไหม (ก่อนโหลด three 700KB) — cache ต่อคู่ avatar|pet
  async function modelsExist(avatar, petType){
    const k = `${avatar||'male'}|${petType}`;
    if(k in existCache) return existCache[k];
    try{
      const urls=[`${MODEL_DIR}caretaker_${avatar||'male'}.glb`, `${MODEL_DIR}pet_${petType}.glb`];
      const res = await Promise.all(urls.map(u=>fetch(u,{method:'HEAD'}).then(r=>r.ok).catch(()=>false)));
      const ok = res.every(Boolean);
      existCache[k]=ok; return ok;
    }catch(e){ existCache[k]=false; return false; }
  }

  function loadScript(src){
    // ใช้ helper ร่วมกับเกม ถ้ามี ไม่งั้นฉีดเอง
    if(typeof loadScriptOnce === 'function') return loadScriptOnce(src);
    return new Promise((res,rej)=>{
      let s=document.querySelector(`script[src="${src}"]`);
      if(s){ if(s.dataset.loaded) return res(); s.addEventListener('load',res); s.addEventListener('error',rej); return; }
      s=document.createElement('script'); s.src=src;
      s.addEventListener('load',()=>{ s.dataset.loaded='1'; res(); });
      s.addEventListener('error',rej); document.head.appendChild(s);
    });
  }

  async function ensureLibs(){
    if(window.THREE && THREE.GLTFLoader) return true;
    await loadScript('js/vendor/three.min.js');
    if(!(window.THREE && THREE.GLTFLoader)) await loadScript('js/vendor/GLTFLoader.js');
    return !!(window.THREE && THREE.GLTFLoader);
  }

  function initRenderer(){
    three = window.THREE;
    canvas = document.createElement('canvas');
    canvas.id = 'lobby3d-canvas';
    renderer = new three.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
    if('outputColorSpace' in renderer && three.SRGBColorSpace) renderer.outputColorSpace = three.SRGBColorSpace;
    else if('outputEncoding' in renderer && three.sRGBEncoding) renderer.outputEncoding = three.sRGBEncoding;

    scene = new three.Scene();
    camera = new three.PerspectiveCamera(32, 1, 0.1, 100);

    // แสงนุ่มโทนสว่างเข้ากับธีมเมืองฟ้า
    scene.add(new three.HemisphereLight(0xffffff, 0x6a7ba0, 1.15));
    const key = new three.DirectionalLight(0xfff4e0, 1.05); key.position.set(3, 6, 5); scene.add(key);
    const rim = new three.DirectionalLight(0xbfe0ff, 0.5); rim.position.set(-4, 3, -3); scene.add(rim);

    rootTilt = new three.Group();          // เอียงเล็กน้อยให้เห็นมิติ
    spin = new three.Group();              // หมุนรอบแกน y จากการปัด
    sway = new three.Group();              // idle bob/sway
    spin.add(sway); rootTilt.add(spin); scene.add(rootTilt);

    ownerRoot = new three.Group(); petRoot = new three.Group();
    sway.add(ownerRoot); sway.add(petRoot);

    clock = new three.Clock();
    bindDrag();
  }

  // ---- fit โมเดลให้สูง targetH, เท้าอยู่ y=0, กึ่งกลาง x/z ----
  function fitInto(holder, srcScene, targetH){
    while(holder.children.length) holder.remove(holder.children[0]);
    const box = new three.Box3().setFromObject(srcScene);
    const size = new three.Vector3(); box.getSize(size);
    const center = new three.Vector3(); box.getCenter(center);
    const h = size.y || 1;
    const s = targetH / h;
    srcScene.position.set(-center.x, -box.min.y, -center.z);  // เท้าแตะพื้น กึ่งกลาง xz
    const wrap = new three.Group(); wrap.add(srcScene); wrap.scale.setScalar(s);
    holder.add(wrap);
    // คืนครึ่งความกว้างหลัง scale (ใช้จัดตำแหน่งข้างกัน)
    return { halfW:(size.x*s)/2, halfD:(size.z*s)/2, height:targetH };
  }

  function clearMixers(){ mixers.forEach(m=>m.stopAllAction&&m.stopAllAction()); mixers=[]; }

  // เล่น idle clip: หาชื่อ idle/breath/stand ก่อน · Tripo export ชื่อ clip เป็น NlaTrack/NlaTrack.001
  // (ท่าที่เลือกตอน animate คือ idle/look_around ทั้งคู่ ปลอดภัยในล็อบบี้) → ไม่เจอชื่อ ใช้ clip แรกแทน
  function setupClips(gltf, root){
    if(!gltf.animations || !gltf.animations.length) return;
    const idle = gltf.animations.find(a=>/idle|breath|stand|rest/i.test(a.name)) || gltf.animations[0];
    const mixer = new three.AnimationMixer(root);
    mixer.clipAction(idle).play();
    mixers.push(mixer);
  }

  // clone ที่ rebind skeleton ให้ถูก (โมเดล Tripo เป็น SkinnedMesh)
  // ⚠️ .clone(true) ธรรมดา ไม่ผูก bone ใหม่ → GPU skinning ยึด bone ต้นฉบับ
  //    ทำให้ scale/ตำแหน่ง/การหมุนที่ตั้งบน node ไม่มีผลกับ vertex (โมเดลเล็ก+หันหลัง+หมุนไม่ติด)
  // ใช้อัลกอริทึม SkeletonUtils.clone ของ three.js (self-contained)
  function cloneSkinned(source){
    const srcLookup = new Map(), cloneLookup = new Map();
    const clone = source.clone(true);
    (function walk(a,b){ srcLookup.set(b,a); cloneLookup.set(a,b);
      for(let i=0;i<a.children.length;i++) walk(a.children[i], b.children[i]); })(source, clone);
    clone.traverse(node=>{
      if(!node.isSkinnedMesh) return;
      const srcMesh = srcLookup.get(node);
      const srcBones = srcMesh.skeleton.bones;
      node.skeleton = srcMesh.skeleton.clone();
      node.bindMatrix.copy(srcMesh.bindMatrix);
      node.skeleton.bones = srcBones.map(b=>cloneLookup.get(b));
      node.bind(node.skeleton, node.bindMatrix);
    });
    return clone;
  }

  function loadGLB(url){
    if(gltfCache[url]) return Promise.resolve(gltfCache[url]);
    return new Promise((res,rej)=>{
      new three.GLTFLoader().load(url, g=>{ gltfCache[url]=g; res(g); }, undefined, err=>rej(err));
    });
  }

  async function loadModels(avatar, petType){
    clearMixers();
    const ownerUrl = `${MODEL_DIR}caretaker_${avatar||'male'}.glb`;
    const petUrl   = `${MODEL_DIR}pet_${petType}.glb`;
    // ต้องได้ครบทั้งคู่ ไม่งั้นถือว่า 3D ใช้ไม่ได้ → fallback PNG
    const [og, pg] = await Promise.all([loadGLB(ownerUrl), loadGLB(petUrl)]);
    ownerRoot.userData.gltf = og; petRoot.userData.gltf = pg;
    return {og, pg};
  }

  function applyLayout(giant){
    const g = Math.max(0, Math.min(4, giant||0));
    const og = ownerRoot.userData.gltf, pg = petRoot.userData.gltf;
    if(!og || !pg) return;
    const pm = fitInto(petRoot,   cloneSkinned(pg.scene), PET_H[g]);
    const om = fitInto(ownerRoot, cloneSkinned(og.scene), OWNER_H[g]);
    setupClips(pg, petRoot); setupClips(og, ownerRoot);
    if(g === 0){
      // รอบ 161: ร่างปกติ — คนซ้ายสุด น้องขวาสุด เปิดกลางเวทีให้เหรียญ rank เด่นเต็มตา
      petRoot.position.set(0, 0, 0.1);
      ownerRoot.position.set(0, 0, 0.1);
      sideLayout();                       // ระยะแยกคิดจากความกว้างมุมกล้องจริง (คำนวณซ้ำตอน resize)
    }else{
      // ร่างยักษ์ (g1-4): จัดกลางแบบเดิม — น้องกลาง (x=0) · ผู้เลี้ยงยืนหน้า-เยื้องซ้ายเล็กน้อย
      petRoot.position.set(0, 0, 0);
      ownerRoot.position.set(-(pm.halfW*0.35 + om.halfW*0.5), 0, pm.halfD*0.6 + 0.15);
    }
    petRoot.rotation.y = FACE_CAMERA; ownerRoot.rotation.y = FACE_CAMERA;   // หันหน้าเข้าหาผู้เล่น
    frameCamera(g);
    curGiant = g;
  }

  // รอบ 161: ตำแหน่งแยกสองข้าง (เฉพาะร่างปกติ g0) — x = ~74% ของครึ่งความกว้างที่กล้องเห็น
  // จอกว้าง=แยกไกล จอแคบ=ยังอยู่ในเฟรม (ขั้นต่ำ 0.85 กันจมกลางเหรียญบนจอแคบมาก)
  function sideLayout(){
    if(!camera) return;
    const viewW = (OWNER_H[0] * 1.55) * camera.aspect;   // fitH ของ g0 × aspect
    const x = Math.max(0.85, (viewW / 2) * 0.74);
    ownerRoot.position.x = -x;
    petRoot.position.x = x;
  }

  function frameCamera(g){
    // ให้กล้องกรอบพอดีความสูงรวม (เน้นน้องเป็นหลัก) + เผื่อขอบ
    // รอบ 114: เผื่อขอบมากขึ้น (1.16→1.55) = ตัวละครเล็กลง ~25% เปิดที่ให้เห็นเหรียญแรงค์ฉากหลัง
    const topH = Math.max(PET_H[g], OWNER_H[g]);
    const centerY = topH * 0.52;
    const fitH = topH * 1.55;
    const dist = (fitH/2) / Math.tan((camera.fov*Math.PI/180)/2);
    camera.position.set(0, centerY, dist + 0.4);
    camera.lookAt(0, centerY, 0);
    rootTilt.rotation.x = 0.02;
  }

  function resize(){
    if(!heroEl || !renderer) return;
    const r = heroEl.getBoundingClientRect();
    const w = Math.max(2, r.width), h = Math.max(2, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
    if(curGiant === 0 && ownerRoot.userData.gltf) sideLayout();   // รอบ 161: aspect เปลี่ยน → ระยะแยกสองข้างเปลี่ยนตาม
  }

  // ---- ปัด/ลาก หมุนตัวละคร ----
  function bindDrag(){
    let down=false, lastX=0, lastT=0;
    const start=(x)=>{ down=true; lastX=x; lastT=performance.now(); spinVel=0; };
    const move=(x)=>{ if(!down) return; const dx=x-lastX; lastX=x;
      const now=performance.now(); const dt=Math.max(1, now-lastT); lastT=now;
      targetRot += dx*0.012; spinVel = (dx*0.012)/(dt/16.7); };
    const end=()=>{ down=false; };
    canvas.addEventListener('pointerdown', e=>{ canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId); start(e.clientX); });
    canvas.addEventListener('pointermove', e=>move(e.clientX));
    window.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.style.touchAction='none';
  }

  function tick(){
    if(!running) return;
    raf = requestAnimationFrame(tick);
    // หยุดเรนเดอร์ถ้าออกจากหน้า dashboard (ประหยัดแบต)
    const dash = document.getElementById('screen-dashboard');
    if(!dash || !dash.classList.contains('active')){ stop(); return; }
    const dt = clock.getDelta();
    // โมเมนตัมหลังปล่อยนิ้ว
    if(Math.abs(spinVel) > 0.0001){ targetRot += spinVel; spinVel *= 0.92; if(Math.abs(spinVel)<0.0004) spinVel=0; }
    dragRot += (targetRot - dragRot) * 0.18;
    if(spin) spin.rotation.y = dragRot;
    // idle procedural: หายใจ/โยกเบาๆ
    const t = clock.elapsedTime;
    if(sway){ sway.position.y = Math.sin(t*1.6)*0.012; sway.rotation.z = Math.sin(t*0.9)*0.010; }
    mixers.forEach(m=>m.update(dt));
    renderer.render(scene, camera);
  }
  function start(){ if(running) return; running=true; clock.start(); raf=requestAnimationFrame(tick); }
  function stop(){ running=false; if(raf) cancelAnimationFrame(raf); raf=0; }

  // ซ่อนภาพ PNG ทันทีที่รู้ว่ามีโมเดล 3D (กันภาพเก่าวูบขึ้นก่อนโมเดลโหลดเสร็จ — ผู้ใช้สั่งรอบ 114)
  // โหลดพลาดจริงค่อยคืน PNG ผ่าน showCanvas(false)
  function hidePng(){
    const png = heroEl && heroEl.querySelector('.hero-scene');
    if(png) png.style.visibility='hidden';
  }

  function showCanvas(on){
    if(!heroEl) return;
    const png = heroEl.querySelector('.hero-scene');
    if(on){
      if(canvas.parentElement !== heroEl) heroEl.appendChild(canvas);
      canvas.style.display=''; if(png) png.style.visibility='hidden';
    }else{
      if(canvas) canvas.style.display='none';
      if(png) png.style.visibility='';
    }
  }

  // ---- entry: เรียกทุกครั้งที่ render dashboard ----
  async function attach(hero, opts){
    if(disabled || isFileProto()) return;      // file:// โหลด glb ไม่ได้ → PNG
    heroEl = hero;
    if(!heroEl) return;
    const key = `${opts.avatar||'male'}|${opts.petType}|${opts.stage}`;
    // ซ่อน PNG ตั้งแต่เฟรมแรกกันภาพวูบก่อนโมเดลโหลด — ถ้าเช็กแล้วไม่มีโมเดล
    // showCanvas(false) คืน PNG ให้ (เคสมี cache คืนใน microtask เดียว ไม่ทันเห็น)
    hidePng();
    // ถ้าพร้อมแล้วและ key เดิม → แค่แนบ canvas + อัปเดตขนาดร่างยักษ์
    if(renderer && curKey === key && ownerRoot.userData.gltf && petRoot.userData.gltf){
      if(curGiant !== (opts.giant||0)) applyLayout(opts.giant||0);
      showCanvas(true); resize(); start();
      return;
    }
    if(booting) return;                          // กันโหลดซ้อน
    booting = true;
    try{
      const exists = await modelsExist(opts.avatar, opts.petType);
      if(!exists){ showCanvas(false); booting=false; return; }   // ไม่มีไฟล์ → PNG (ไม่โหลด three)
      hidePng();                                   // มีโมเดลแน่ → ไม่ให้ PNG โผล่ระหว่างโหลด
      const ok = await ensureLibs();
      if(!ok){ disabled=true; showCanvas(false); booting=false; return; }   // คืน PNG (ถูก hidePng ไว้)
      if(!renderer) initRenderer();
      await loadModels(opts.avatar, opts.petType);   // throw ถ้าไฟล์ไม่มี → fallback
      curKey = key;
      applyLayout(opts.giant||0);
      // มุมเริ่ม: หันหน้าตรง
      targetRot = 0; dragRot = 0; if(spin) spin.rotation.y = 0;
      showCanvas(true); resize(); start();
    }catch(e){
      // ไม่มีโมเดล/โหลดพลาด → ใช้ PNG เดิม (ไม่ถือเป็นบั๊ก)
      showCanvas(false);
    }finally{
      booting = false;
    }
  }

  // ปิดชั่วคราวเมื่อออกจากหน้า (main.js/showScreen wrapper เรียกได้ถ้าต้องการ)
  function pause(){ stop(); }

  window.addEventListener('resize', ()=>{ if(running) resize(); });

  return { attach, pause, _stop:stop,
    _debug:()=>({running, disabled, curKey, curGiant,
      ownerLoaded:!!(ownerRoot&&ownerRoot.userData.gltf), petLoaded:!!(petRoot&&petRoot.userData.gltf),
      triangles: renderer?renderer.info.render.triangles:0,
      rotY: spin?+spin.rotation.y.toFixed(3):null, targetRot:+targetRot.toFixed(3),
      mixers:mixers.length,
      clipTime:mixers[0]?+mixers[0].time.toFixed(2):null}) };
})();
