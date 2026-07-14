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
  // 🔄 รอบ 165: header Hosting ให้ .glb cache 7 วัน (ประหยัดโควตา/โหลดไว) → เครื่องผู้เล่นจะเห็นโมเดลเก่า
  // จนกว่า cache หมดอายุ · **เปลี่ยนไฟล์ .glb เมื่อไหร่ ต้องบัมพ์เลขนี้** (URL เปลี่ยน = HTTP cache
  // + sw cache miss ทุกเครื่องทันที ดาวน์โหลดตัวใหม่รอบเดียวแล้ว cache ต่อตามปกติ)
  const MODEL_VER = '163';                         // ล่าสุด: หมา/แมวเวอร์ชันย่อไฟล์ (รอบ 163)
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
  let viewH=0;                                     // ความสูง canvas (CSS px) ล่าสุด — ใช้เล็งเท้าลงเส้นพื้น
  let curKey='';                                   // avatar|petType|stage ที่โหลดอยู่
  let curGiant=-1;
  const existCache={};                             // "avatar|petType" -> true/false (มีไฟล์ glb ครบไหม)
  let dragRot=0, targetRot=0, spinVel=0;           // มุมหมุนจากการปัด
  const gltfCache={};                              // url -> gltf.scene (ต้นฉบับ clone ได้)

  // 🌀 Spin-to-Spell (รอบ 171) — วงแหวนตัวอักษรรอบน้อง ปัดหมุนให้ตัวที่ต้องการมาตรงช่องหน้า ▼ แล้วแตะเก็บ
  // เล่นได้เฉพาะร่างปกติ (g0) + มีโมเดล 3D จริง · ระหว่างเล่น: น้องย้ายมากลางเวที ผู้เลี้ยงซ่อน
  // drag บน canvas เปลี่ยนไปหมุนวงแหวน (spellTarget/spellVel — โมเมนตัมสูตรเดียวกับ spin ตัวละคร)
  let spellActive=false, spellLock=false, spellDown=false;
  let spellGroup=null, spellMarker=null, spellRay=null;
  let spellLetters=[], spellWord=null, spellIdx=0, spellDone=[];
  let spellRot=0, spellTarget=0, spellVel=0, spellSlotHalf=0.26, spellHintAt=0;
  let spellSlotAng=Math.PI/6, spellTickK=0, spellTickAt=0;   // ตรวจตัวอักษรผ่านช่อง → เสียงติ๊กแบบวงล้อเกมโชว์
  const SP_R=1.05, SP_Y=0.55, SP_LS=0.34, SP_MS=0.62;   // รัศมีวง/ความสูง/ขนาดตัวอักษร/ขนาด marker (หน่วยโลก — จูนได้)
  const SPELL_COIN=1000;                                 // รางวัลเต็มต่อคำ (ผู้ใช้เคาะ 1,000 รอบ 173 — "เพราะยาก")
  // รอบ 174 (ผู้ใช้เคาะ 3 ข้อ): จำกัดรางวัลเต็ม 5 คำแรก/วัน กันเหรียญเฟ้อ · เพอร์เฟกต์ (ไม่แตะผิดเลย) ×1.5 · ริบบิ้นสีตามหมวดคำ
  const SPELL_FULL_PER_DAY=1;                            // รอบ 192: ผู้ใช้ลด 5→1 คำ/วัน (กันเงินเฟ้อ จนไม่เล่นจับคู่คำศัพท์) — นับใน state.spellDay/spellWords
  const SPELL_COIN_LATE=100;                             // คำที่ 2+ ของวัน = ราคาปกติเดิม
  const SPELL_PERFECT_X=1.5;                             // โบนัสสะกดครบโดยไม่แตะผิดเลยทั้งคำ
  let spellMiss=0;                                       // นับแตะผิดในคำปัจจุบัน (0 ตอนจบ = เพอร์เฟกต์)
  // ริบบิ้นตามหมวดคำ (เทียบ regex กับ cat id ใน vocab.js) — ไม่เข้าเงื่อนไขใช้ชุดสีรวม 8 สีเดิม
  const SPELL_PALETTES=[
    [/animal/,                        ['#7ee2a0','#4caf50','#aed581','#2e7d32','#c5e1a5','#66bb6a']],  // สัตว์ = เขียวธรรมชาติ
    [/food|fruit/,                    ['#ff8a65','#ffb74d','#ff5f6e','#ffd54f','#e65100','#ffcc80']],  // อาหาร/ผลไม้ = ส้มแดงเหลือง
    [/body|health|sport/,             ['#f48fb1','#ff5f6e','#f06292','#ffcdd2','#ec407a','#ff8a80']],  // ร่างกาย/สุขภาพ/กีฬา = ชมพูแดง
    [/nature|weather|environment/,    ['#4dd0e1','#7ee2a0','#4fc3f7','#80cbc4','#26a69a','#b2ebf2']],  // ธรรมชาติ/อากาศ = เขียวฟ้า
    [/school|academic|numbers|days/,  ['#4fc3f7','#5c9dff','#90caf9','#7986cb','#81d4fa','#3f51b5']],  // โรงเรียน/เลข/วัน = ฟ้าน้ำเงิน
    [/tech|science|media/,            ['#4dd0e1','#00e5ff','#82b1ff','#b388ff','#18ffff','#8c9eff']],  // เทคโนโลยี/วิทย์ = ฟ้าไฟฟ้าม่วง
    [/family|feeling|character|clothes/, ['#ba68c8','#f48fb1','#ce93d8','#ff80ab','#9575cd','#f8bbd0']], // คน/ความรู้สึก/เสื้อผ้า = ม่วงชมพู
  ];
  // 🎡 ฟีลวงล้อ (feedback ผู้ใช้รอบ 172: "ลากประคอง" วางตัวอักษรตรงช่องได้เลย = โกงข้ามการปัด + ของเดิมฝืดไป)
  // → ระหว่างนิ้วแตะวงไม่ขยับ (จับ=หยุดวง) ปล่อยนิ้วค่อยเหวี่ยงตามความเร็วปัด · แรงเสียดทานต่ำ หมุนลื่นหลายรอบ
  const SPELL_SENS=0.016;      // ความไวปัด (rad ต่อ px ของความเร็ว) — เดิม 0.012 ฝืด
  const SPELL_FRICTION=0.975;  // ตัวคูณหน่วงต่อเฟรม — เดิม 0.92 หยุดไวเกิน (ระยะเหวี่ยง ≈ v×40 เฟรม)
  const SPELL_VMAX=0.6;        // เพดานความเร็ว (rad/เฟรม) กันปัดแรงจนภาพเบลอ
  const SPELL_VMIN=0.015;      // ปัดเบากว่านี้ = ไม่เหวี่ยง (ให้ snap จัดการ)

  function isFileProto(){ return location.protocol === 'file:'; }

  // เช็กว่ามีไฟล์ .glb ครบทั้งผู้เลี้ยง+น้องไหม (ก่อนโหลด three 700KB) — cache ต่อคู่ avatar|pet
  async function modelsExist(avatar, petType){
    const k = `${avatar||'male'}|${petType}`;
    if(k in existCache) return existCache[k];
    try{
      const urls=[`${MODEL_DIR}caretaker_${avatar||'male'}.glb?v=${MODEL_VER}`, `${MODEL_DIR}pet_${petType}.glb?v=${MODEL_VER}`];
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
    const ownerUrl = `${MODEL_DIR}caretaker_${avatar||'male'}.glb?v=${MODEL_VER}`;
    const petUrl   = `${MODEL_DIR}pet_${petType}.glb?v=${MODEL_VER}`;
    // ต้องได้ครบทั้งคู่ ไม่งั้นถือว่า 3D ใช้ไม่ได้ → fallback PNG
    const [og, pg] = await Promise.all([loadGLB(ownerUrl), loadGLB(petUrl)]);
    ownerRoot.userData.gltf = og; petRoot.userData.gltf = pg;
    return {og, pg};
  }

  function applyLayout(giant){
    const g = Math.max(0, Math.min(4, giant||0));
    const og = ownerRoot.userData.gltf, pg = petRoot.userData.gltf;
    if(!og || !pg) return;
    spellAbort();                         // เปลี่ยนน้อง/ร่างยักษ์กลางเกมสะกดคำ → เคลียร์เกมก่อนจัด layout ใหม่
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
    petRoot.position.x = spellActive ? 0 : x;            // ระหว่างเกมสะกดคำ น้องยืนกลางเวที (resize ห้ามดันกลับข้าง)
  }

  // เป้าเท้าตัวหน้าสุดห่างขอบล่างเวที (px) — เส้นพื้นเรืองแสง .stage-hero::after อยู่ bottom:30px
  // วัดจริง (readPixels): ค่า 13 → เท้าคน ~17px / อุ้งเท้าหมา ~25px = ต่ำกว่าเส้นทั้งคู่ ไม่ดูลอย
  const GROUND_PX = 13;

  function frameCamera(g){
    // ให้กล้องกรอบพอดีความสูงรวม (เน้นน้องเป็นหลัก) + เผื่อขอบ
    // รอบ 114: เผื่อขอบมากขึ้น (1.16→1.55) = ตัวละครเล็กลง ~25% เปิดที่ให้เห็นเหรียญแรงค์ฉากหลัง
    const topH = Math.max(PET_H[g], OWNER_H[g]);
    const fitH = topH * 1.55;
    const tanH = Math.tan((camera.fov*Math.PI/180)/2);
    const dist = (fitH/2) / tanH;
    const D = dist + 0.4;                       // ระยะกล้องถึงระนาบ z=0
    // รอบ 162: เดิม centerY=topH*.52 → เท้าลอย ~16% ของความสูงเวที เหนือเส้นพื้น (bottom:30px) ดูลอย
    // ใหม่: เล็งให้เท้า "ตัวที่ยืนใกล้กล้องสุด" (z0 — ร่างยักษ์ผู้เลี้ยงยืนหน้าน้อง perspective กดเท้าต่ำสุด)
    // ฉายลงที่ GROUND_PX จากขอบล่าง canvas (viewH มาจาก resize — จอเปลี่ยนคำนวณใหม่)
    // · poseDrop: ท่า idle โมเดล Tripo ยื่นต่ำกว่า bbox (y=0) ~5% ของความสูงตัว (คาลิเบรตจากวัด readPixels g0)
    // · cap 0.165 = สัดส่วนเดิม กันตัวหลุดเฟรมบนเวทีเตี้ยมาก
    const pxFrac = viewH ? Math.min(GROUND_PX / viewH, 0.165) : 0.04;
    const z0 = Math.max(ownerRoot.position.z, petRoot.position.z, 0);
    const V = (D - z0) * tanH;                  // ครึ่งความสูงโลกที่กล้องเห็น ณ ระนาบตัวหน้าสุด
    const poseDrop = 0.05 * OWNER_H[g];
    const centerY = V - poseDrop - 2*V*pxFrac;
    camera.position.set(0, centerY, D);
    camera.lookAt(0, centerY, 0);
    rootTilt.rotation.x = 0.02;
  }

  function resize(){
    if(!heroEl || !renderer) return;
    const r = heroEl.getBoundingClientRect();
    const w = Math.max(2, r.width), h = Math.max(2, r.height);
    viewH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
    if(curGiant >= 0 && ownerRoot.userData.gltf){
      frameCamera(curGiant);                       // รอบ 162: ความสูงจอเปลี่ยน → เล็งเท้าลงเส้นพื้นใหม่
      if(curGiant === 0) sideLayout();             // รอบ 161: aspect เปลี่ยน → ระยะแยกสองข้างเปลี่ยนตาม
    }
  }

  // ---- ปัด/ลาก หมุนตัวละคร ----
  function bindDrag(){
    let down=false, lastX=0, lastT=0, dnX=0, dnY=0, dnT=0, moved=0;
    const start=(x,y)=>{ down=true; spellDown=spellActive; lastX=x; lastT=performance.now();
      dnX=x; dnY=y; dnT=lastT; moved=0;
      if(spellActive){ spellVel=0; spellTarget=spellRot; }   // จับวง = หยุดสนิททันที (ตัดระยะไหลที่ target นำอยู่)
      else spinVel=0; };
    const move=(x,y)=>{ if(!down) return; const dx=x-lastX; lastX=x;
      moved=Math.max(moved, Math.abs(x-dnX), Math.abs(y-dnY));
      const now=performance.now(); const dt=Math.max(1, now-lastT); lastT=now;
      if(spellActive){
        // 🎡 flick-only: ระหว่างนิ้วแตะ วง "ไม่" หมุนตามนิ้ว (กันลากประคองวางตัวอักษรตรงช่อง = ข้ามการปัด)
        // เก็บความเร็วปัดไว้เฉยๆ (blend กัน jitter) — ปล่อยนิ้วค่อยเหวี่ยงใน end()
        const inst=(dx*SPELL_SENS)/(dt/16.7);
        spellVel = spellVel*0.5 + inst*0.5;
      }
      // 🔒 รอบ 235: ล็อกหมุนตัวละคร/สัตว์ในล็อบบี้ — ปัดไม่หมุนเป็นวงกลมอีกต่อไป
      // (น้องป่วย/หิว/ใส่ชุด = ภาพ 2D · หมุนแล้วโมเดลคนซ้อนทับน้อง) → หันหน้าตรงเสมอ เท้าอยู่ใต้เส้นฟ้า
      else{ /* locked: ไม่หมุนตัวละคร */ } };
    const end=(e)=>{ if(!down) return; down=false; spellDown=false;
      if(spellActive){
        // นิ้วนิ่งค้างก่อนปล่อย = ตั้งใจหยุด/แตะ · ปัดเบาเกิน = ไม่เหวี่ยง · ที่เหลือ = เหวี่ยงตามแรงปัด (มีเพดาน)
        if(performance.now()-lastT>120 || Math.abs(spellVel)<SPELL_VMIN) spellVel=0;
        else spellVel=Math.max(-SPELL_VMAX, Math.min(SPELL_VMAX, spellVel));
      }
      // แตะ (ไม่ใช่ลาก) ระหว่างเกมสะกดคำ = ลองเก็บตัวอักษร
      if(spellActive && moved<8 && performance.now()-dnT<600 && e && e.clientX!=null) spellTap(e.clientX, e.clientY); };
    canvas.addEventListener('pointerdown', e=>{ canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId); start(e.clientX, e.clientY); });
    canvas.addEventListener('pointermove', e=>move(e.clientX, e.clientY));
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
    if(spellActive) spellTick(dt, t);
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
    spellBtnSync();                       // ปุ่ม 🌀 สะกดคำ โผล่เฉพาะตอน 3D โชว์จริง (g0)
  }

  // รอบ 187: ป่วย/หิว/ใส่ชุด + มีภาพตรงสถานะ → โชว์ "เฉพาะน้อง" เป็นภาพ 2D · คนยังเป็นโมเดล 3D เหมือนเดิม
  // วิธี: ซ่อน mesh น้องใน 3D (petRoot.visible=false) เหลือคนบน canvas โปร่งใส + โชว์ .hero-scene แบบ pet-only
  //       (ซ่อนรูปคน 2D ในนั้น) → น้อง 2D โผล่ผ่านโซนโปร่งของ canvas ตรงตำแหน่งเดิม
  function applyPetPng(on){
    if(!heroEl) return;
    const png = heroEl.querySelector('.hero-scene');
    if(petRoot) petRoot.visible = !on;
    if(png){
      png.classList.toggle('pet-only', on);
      if(on) png.style.visibility = '';    // ปิด = ปล่อยให้ showCanvas คุม (hidden)
    }
    spellBtnSync();                          // น้อง 2D = ซ่อนปุ่มสะกดคำ (petRoot.visible=false)
  }

  // ---- entry: เรียกทุกครั้งที่ render dashboard ----
  async function attach(hero, opts){
    if(disabled || isFileProto()) return;      // file:// โหลด glb ไม่ได้ → PNG
    heroEl = hero;
    if(!heroEl) return;
    const forcePng = !!opts.forcePng;          // รอบ 187: น้องป่วย/หิว/ใส่ชุด → น้อง 2D (คนยัง 3D)
    const key = `${opts.avatar||'male'}|${opts.petType}|${opts.stage}`;
    // ซ่อน PNG ตั้งแต่เฟรมแรกกันภาพวูบก่อนโมเดลโหลด — ถ้าเช็กแล้วไม่มีโมเดล
    // showCanvas(false) คืน PNG ให้ (เคสมี cache คืนใน microtask เดียว ไม่ทันเห็น)
    hidePng();
    // ถ้าพร้อมแล้วและ key เดิม → แค่แนบ canvas + อัปเดตขนาดร่างยักษ์
    if(renderer && curKey === key && ownerRoot.userData.gltf && petRoot.userData.gltf){
      if(curGiant !== (opts.giant||0)) applyLayout(opts.giant||0);
      showCanvas(true); applyPetPng(forcePng); resize(); start();
      if(spellActive){ spellHud(); spellHudWord(); }   // renderDashboard กลางเกม (เช่นได้เหรียญ) ล้าง DOM เวที → คืน HUD
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
      showCanvas(true); applyPetPng(forcePng); resize(); start();
    }catch(e){
      // ไม่มีโมเดล/โหลดพลาด → ใช้ PNG เดิม (ไม่ถือเป็นบั๊ก)
      showCanvas(false);
    }finally{
      booting = false;
    }
  }

  /* ============================================================
     🌀 Spin-to-Spell (รอบ 171)
     วงแหวนตัวอักษร 12–16 ตัวรอบน้อง · ปัดหมุน (โมเมนตัม+snap เข้าช่อง)
     ตัวอักษรตรงช่องหน้า ▼ ขยายใหญ่ · แตะเก็บเรียงตามคำ · ครบคำ = อ่านคำ+เหรียญ
     คำจาก vocabForStudent() (ตามระดับชั้น เหมือนโลก 3D) · ไม่ซ้ำใน session
     ============================================================ */
  function angNorm(a){ a=(a+Math.PI)%(2*Math.PI); if(a<0) a+=2*Math.PI; return a-Math.PI; }

  // ---- เสียงเกม (รอบ 172): ไฟล์ sound/spell/<name>.mp3 มาก่อน (prompt ใน PROMPTS_SPELL_SOUND.md)
  //      ไม่มีไฟล์/โหลดพลาด → เสียงสังเคราะห์ beep (util.js) อัตโนมัติ — เกมเล่นได้เลยไม่ต้องรอไฟล์ ----
  const spellSndCache={};
  function spellSfx(name){
    if(typeof state!=='undefined' && !state.sound) return;
    if(spellSndCache[name]==='miss') return spellSynth(name);
    try{
      const a=spellSndCache[name] || new Audio(`sound/spell/${name}.mp3`);
      spellSndCache[name]=a;
      a.onerror=()=>{ if(spellSndCache[name]!=='miss'){ spellSndCache[name]='miss'; spellSynth(name); } };
      a.currentTime=0;
      const p=a.play();
      if(p && p.catch) p.catch(()=>{ if(spellSndCache[name]!=='miss'){ spellSndCache[name]='miss'; spellSynth(name); } });
    }catch(e){ spellSynth(name); }
  }
  function spellSynth(name){
    if(typeof beep!=='function') return;
    if(name==='tick') beep(1900,.035,0,'square',.05);                                    // แกร็กวงล้อ
    else if(name==='collect'){ beep(660,.12); beep(880,.18,.1); }                        // เก็บถูก (= sfx.correct)
    else if(name==='wrong') beep(180,.25,0,'sawtooth',.08);                              // เก็บผิด (= sfx.wrong)
    else if(name==='win'){ beep(523,.14); beep(659,.14,.12); beep(784,.16,.24); beep(1047,.34,.36,'sine',.2); }  // แฟนแฟร์จบคำ
    else if(name==='start'){ beep(440,.1); beep(660,.14,.09); }                          // เปิดวงแหวน
    else if(name==='firework') spellFireworkSynth();                                     // พลุฉลอง (รอบ 173)
  }
  // เสียงพลุสังเคราะห์: ตูม 3 ลูกไล่กัน (white noise ลด gain แบบพลุจริง) + ประกายแตกวิ้งๆ
  // ใช้ audioCtx ตัวเดียวกับ beep (util.js — let global) ตามนโยบายเสียงปลอดลิขสิทธิ์
  function spellFireworkSynth(){
    try{
      audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      const pop=(t0,vol,dur)=>{
        const n=Math.floor(audioCtx.sampleRate*dur), buf=audioCtx.createBuffer(1,n,audioCtx.sampleRate), d=buf.getChannelData(0);
        for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.2);
        const src=audioCtx.createBufferSource(); src.buffer=buf;
        const f=audioCtx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=2400;
        const g=audioCtx.createGain(); g.gain.value=vol;
        src.connect(f); f.connect(g); g.connect(audioCtx.destination);
        src.start(audioCtx.currentTime+t0);
      };
      pop(0,.30,.55); pop(.30,.20,.45); pop(.58,.25,.6);
      if(typeof beep==='function'){ beep(1568,.09,.12,'triangle',.05); beep(1976,.09,.42,'triangle',.05); beep(1760,.1,.7,'triangle',.045); }
    }catch(e){}
  }

  // 💰 ป้ายเงินรางวัลเด้งกลางจอ (รอบ 175 — ผู้ใช้สั่ง: +1,000 ตัวหนังสือเหลืองตัวใหญ่ ขยายจากเล็ก→ใหญ่
  //    ให้ตื่นเต้น เฉพาะคำรางวัลเต็ม 5 คำแรก/วัน) · โผล่กลางจอเหนือแบนเนอร์ เด้ง overshoot แล้วลอยขึ้นจางหาย
  function spellCoinPop(txt){
    if(document.documentElement.classList.contains('no-anim')) return;
    const old=document.getElementById('spell-coinpop'); if(old) old.remove();
    const el=document.createElement('div'); el.id='spell-coinpop'; el.textContent=txt;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 2300);   // ตรงกับความยาว animation spCoinPop
  }

  // 🎀 ริบบิ้นโปรยทั่วจอชั่วคราว (แพทเทิร์นเดียวกับ overlay ฝน #rain-fx: fixed inset:0 z-9000 บน body)
  // mult: ตัวคูณจำนวนริบบิ้น (เพอร์เฟกต์ 1.7) · สีเลือกตามหมวดของ spellWord.cat (SPELL_PALETTES)
  function spellConfetti(mult){
    if(document.documentElement.classList.contains('no-anim')) return;   // ผู้ใช้ปิดอนิเมชัน = ไม่โปรย
    const old=document.getElementById('spell-confetti'); if(old) old.remove();
    const fx=document.createElement('div'); fx.id='spell-confetti';
    let COLORS=['#ff5f6e','#ffd54f','#4fc3f7','#7ee2a0','#ba68c8','#ff8a65','#fff176','#4dd0e1'];
    const cat=(spellWord&&spellWord.cat)||'';
    for(const [re,pal] of SPELL_PALETTES){ if(re.test(cat)){ COLORS=pal; break; } }
    const n=Math.round(Math.min(120, Math.max(70, Math.round(window.innerWidth/11))) * (mult||1));
    let html='';
    for(let i=0;i<n;i++){
      html+=`<span class="sp-rb" style="left:${(Math.random()*100).toFixed(1)}%;`+
        `width:${(5+Math.random()*6).toFixed(1)}px;height:${(12+Math.random()*12).toFixed(1)}px;`+
        `background:${COLORS[i%COLORS.length]};`+
        `--dx:${(Math.random()*160-80).toFixed(0)}px;--rz:${(Math.random()*720-360).toFixed(0)}deg;`+
        `--rx:${(540+Math.random()*720).toFixed(0)}deg;`+
        `animation-duration:${(2.4+Math.random()*1.6).toFixed(2)}s;animation-delay:${(Math.random()*0.7).toFixed(2)}s"></span>`;
    }
    fx.innerHTML=html;
    document.body.appendChild(fx);
    setTimeout(()=>fx.remove(), 5200);   // ตัวสุดท้าย delay .7 + ยาวสุด 4.0 วิ = จบก่อนถอด
  }

  const spellTexCache={};
  const SP_COLORS=['#ff8a65','#4fc3f7','#aed581','#ffd54f','#ba68c8','#f06292','#4dd0e1','#ff8a80'];
  function spellLetterTex(ch){
    if(spellTexCache[ch]) return spellTexCache[ch];
    const cv=document.createElement('canvas'); cv.width=cv.height=128;
    const c=cv.getContext('2d');
    c.beginPath();
    if(c.roundRect) c.roundRect(10,10,108,108,26); else c.rect(10,10,108,108);
    c.fillStyle=SP_COLORS[(ch.charCodeAt(0)-97+26)%SP_COLORS.length]; c.fill();
    c.lineWidth=7; c.strokeStyle='rgba(255,255,255,.92)'; c.stroke();
    c.fillStyle='#fff'; c.font='900 78px Arial'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText(ch.toUpperCase(), 64, 70);
    const tx=new three.CanvasTexture(cv);
    if('colorSpace' in tx && three.SRGBColorSpace) tx.colorSpace=three.SRGBColorSpace;
    spellTexCache[ch]=tx; return tx;
  }
  function spellMarkerTex(){
    const cv=document.createElement('canvas'); cv.width=cv.height=128;
    const c=cv.getContext('2d');
    c.fillStyle='rgba(160,230,255,.95)';                                   // ▼ ชี้ลงจุดเก็บ
    c.beginPath(); c.moveTo(46,14); c.lineTo(82,14); c.lineTo(64,44); c.closePath(); c.fill();
    const g=c.createRadialGradient(64,86,4,64,86,46);                      // ลานเรืองแสงใต้ตัวอักษร
    g.addColorStop(0,'rgba(130,225,255,.95)'); g.addColorStop(.55,'rgba(80,180,255,.42)'); g.addColorStop(1,'rgba(80,180,255,0)');
    c.fillStyle=g; c.beginPath(); c.ellipse(64,86,46,24,0,0,2*Math.PI); c.fill();
    return new three.CanvasTexture(cv);
  }

  function spellEnsure(){
    if(!spellGroup){
      spellGroup=new three.Group(); rootTilt.add(spellGroup);   // หมุนแยกจาก spin ของตัวละคร
      spellMarker=new three.Sprite(new three.SpriteMaterial({map:spellMarkerTex(), transparent:true, depthTest:false}));
      spellMarker.position.set(0, SP_Y-0.30, SP_R+0.06);
      spellMarker.scale.set(SP_MS, SP_MS, 1);
      rootTilt.add(spellMarker);
      spellRay=new three.Raycaster();
    }
    spellMarker.visible=true;
  }

  function spellPickWord(second){
    let pool=[];
    try{
      // เก็บ cat id ติดมาด้วย (รอบ 174: ริบบิ้นฉลองสีตามหมวดคำ)
      (typeof catsForStudent==='function'?catsForStudent():[]).forEach(c=>{
        (c.words||[]).forEach(([en,th])=>{
          if(/^[a-z]{3,8}$/i.test(en) && !spellDone.includes(en.toLowerCase()))
            pool.push({en:en.toLowerCase(), th, cat:c.id||''});
        });
      });
    }catch(e){}
    if(!pool.length && second!==true){ spellDone=[]; return spellPickWord(true); }   // เล่นครบคลัง → วนใหม่
    if(!pool.length) pool=[{en:'cat',th:'แมว',cat:'animals'},{en:'dog',th:'สุนัข',cat:'animals'},{en:'book',th:'หนังสือ',cat:''}];
    return pool[Math.floor(Math.random()*pool.length)];
  }

  // นับโควตารางวัลเต็มรายวัน (แพทเทิร์น toDateString แบบ foodQuizDay/testerCoinDay) — คืนจำนวนคำเต็มที่เหลือวันนี้
  function spellDayLeft(){
    if(typeof state==='undefined') return SPELL_FULL_PER_DAY;
    const day=new Date().toDateString();
    if(state.spellDay!==day){ state.spellDay=day; state.spellWords=0; }
    return Math.max(0, SPELL_FULL_PER_DAY-(state.spellWords||0));
  }

  function spellBuildRing(){
    while(spellGroup.children.length){ const o=spellGroup.children[0]; spellGroup.remove(o); if(o.material) o.material.dispose(); }
    spellLetters=[];
    const chars=spellWord.en.split('');
    const N=chars.length<=5 ? 12 : (chars.length<=7 ? 14 : 16);   // 12–16 ตามสเปก
    spellSlotHalf=Math.min(0.30, (Math.PI/N)*0.85);
    spellSlotAng=2*Math.PI/N; spellTickK=0;                       // ฐานนับเสียงติ๊กผ่านช่อง
    const fill=[];
    while(chars.length+fill.length < N) fill.push(String.fromCharCode(97+Math.floor(Math.random()*26)));
    const ring=(typeof shuffle==='function') ? shuffle(chars.concat(fill))
      : chars.concat(fill).sort(()=>Math.random()-0.5);
    ring.forEach((ch,i)=>{
      const ang=i*2*Math.PI/N;
      const spr=new three.Sprite(new three.SpriteMaterial({map:spellLetterTex(ch), transparent:true}));
      spr.position.set(Math.sin(ang)*SP_R, SP_Y, Math.cos(ang)*SP_R);
      spr.scale.set(SP_LS, SP_LS, 1);
      spr.userData={ch, ang, baseY:SP_Y, i, scl:SP_LS, dying:false, k:1, flash:0};
      spellGroup.add(spr); spellLetters.push(spr);
    });
    spellRot=0; spellTarget=0; spellVel=0; spellGroup.rotation.y=0;
  }

  function spellNextWord(){
    spellLock=false; spellIdx=0; spellMiss=0;
    spellWord=spellPickWord();
    spellBuildRing();
    spellHud(); spellHudWord();
  }

  function spellTick(dt, t){
    // เหวี่ยงหลังปล่อยนิ้ว — แรงเสียดทานต่ำ หมุนลื่นแบบวงล้อ (SPELL_FRICTION) · ช้าพอค่อยส่งต่อให้ snap
    if(!spellDown && Math.abs(spellVel)>0.0001){ spellTarget+=spellVel; spellVel*=SPELL_FRICTION; if(Math.abs(spellVel)<0.003) spellVel=0; }
    // snap เบาๆ: หมดโมเมนตัมแล้วดึงตัวอักษรที่ใกล้ช่องสุดเข้ากลางช่อง (เด็กเล็งง่าย ไม่ต้องเป๊ะเอง)
    if(!spellDown && spellVel===0 && !spellLock && spellLetters.length){
      let best=null, bd=1e9;
      for(const s of spellLetters){
        if(s.userData.dying) continue;
        const d=angNorm(-s.userData.ang - spellTarget);
        if(Math.abs(d)<bd){ bd=Math.abs(d); best=d; }
      }
      if(best!==null && bd>0.002) spellTarget += best*0.10;
    }
    spellRot += (spellTarget-spellRot)*0.18;
    spellGroup.rotation.y=spellRot;
    // เสียงติ๊กทุกครั้งที่ตัวอักษรเคลื่อนผ่านช่อง (ฟีลวงล้อเกมโชว์) — throttle กันรัวตอนปัดแรง
    const k=Math.round(spellRot/spellSlotAng);
    if(k!==spellTickK){ spellTickK=k;
      const now=performance.now();
      if(now-spellTickAt>50){ spellTickAt=now; spellSfx('tick'); } }
    if(spellMarker && spellMarker.visible){ const p=1+Math.sin(t*3.2)*0.07; spellMarker.scale.set(SP_MS*p, SP_MS*p, 1); }
    for(let i=spellLetters.length-1;i>=0;i--){
      const s=spellLetters[i], u=s.userData;
      if(u.dying){                                           // เก็บแล้ว/จบคำ → ลอยขึ้น หด จาง แล้วถอดทิ้ง
        u.k*=Math.pow(0.001, dt);
        s.position.y += dt*1.6;
        s.material.opacity=Math.max(0, u.k);
        s.scale.set(SP_LS*1.5*u.k, SP_LS*1.5*u.k, 1);
        if(u.k<0.05){ spellGroup.remove(s); s.material.dispose(); spellLetters.splice(i,1); }
        continue;
      }
      const front=Math.abs(angNorm(u.ang+spellRot))<spellSlotHalf;
      u.scl += ((front?1.45:1)*SP_LS - u.scl)*0.22;          // ตัวตรงช่องขยายใหญ่
      s.scale.set(u.scl, u.scl, 1);
      s.position.y = u.baseY + Math.sin(t*2+u.i*1.7)*0.022 + (front?0.04:0);
      if(u.flash>0){ u.flash-=dt; if(u.flash<=0){ s.material.color.setHex(0xffffff); u.flash=0; } }
    }
  }

  function spellTap(cx, cy){
    if(spellLock || !spellWord || !spellLetters.length) return;
    const r=canvas.getBoundingClientRect();
    if(!r.width || !r.height) return;
    spellRay.setFromCamera(new three.Vector2(((cx-r.left)/r.width)*2-1, -((cy-r.top)/r.height)*2+1), camera);
    const hits=spellRay.intersectObjects(spellLetters.filter(s=>!s.userData.dying), false);
    if(!hits.length) return;
    const s=hits[0].object, u=s.userData;
    if(Math.abs(angNorm(u.ang+spellRot))>spellSlotHalf*1.4){   // ยังไม่ตรงช่อง — บอกวิธีเล่น (ไม่สแปม)
      const now=performance.now();
      if(now-spellHintAt>3500){ spellHintAt=now; if(typeof toast==='function') toast('🌀 ปัดเหวี่ยงวงแหวนให้ตัวอักษรมาตรงช่อง ▼ ก่อนแตะนะ'); }
      return;
    }
    if(u.ch===spellWord.en[spellIdx]){
      u.dying=true; u.k=1;
      spellIdx++;
      spellSfx('collect');
      if(typeof speakLetter==='function') speakLetter(u.ch);   // "เอ บี ซี" เหมือนเก็บในโลก 3D
      spellHudWord();
      if(spellIdx>=spellWord.en.length) spellComplete();
    }else{
      u.flash=0.4; s.material.color.setHex(0xff5f6e);
      spellMiss++;                                             // พลาดแล้ว — คำนี้ไม่เพอร์เฟกต์
      spellSfx('wrong');
    }
  }

  function spellComplete(){
    spellLock=true;
    const w=spellWord;
    spellDone.push(w.en);
    const perfect=spellMiss===0;                               // ไม่แตะผิดเลยทั้งคำ = เพอร์เฟกต์ ×1.5
    const fullLeft=spellDayLeft();                             // โควตารางวัลเต็มวันนี้ (เช็กก่อนนับคำนี้)
    spellSfx('win');
    spellSfx('firework');                                      // พลุตูมพร้อมแฟนแฟร์ (รอบ 173)
    if(perfect) setTimeout(()=>spellSfx('firework'), 450);     // เพอร์เฟกต์ = พลุชุดใหญ่ 2 ระลอก
    spellConfetti(perfect?1.7:1);                              // ริบบิ้นโปรยทั่วจอ (สีตามหมวดคำ · เพอร์เฟกต์เพิ่ม ~70%)
    let coinTxt='';
    if(typeof addCoins==='function' && typeof state!=='undefined'){
      let reward=fullLeft>0 ? SPELL_COIN : SPELL_COIN_LATE;
      if(perfect) reward=Math.round(reward*SPELL_PERFECT_X);
      state.spellWords=(state.spellWords||0)+1;
      addCoins(reward);
      if(typeof saveState==='function') saveState();
      const fmt=n=>(typeof fmtNum==='function')?fmtNum(n):n;
      if(fullLeft>0) spellCoinPop(`+🪙${fmt(reward)}`);   // ป้ายใหญ่เด้งกลางจอ เฉพาะ 5 คำรางวัลเต็ม/วัน (รอบ 175)
      coinTxt=`<div class="sp-coin">+🪙${fmt(reward)}</div>`
        +(perfect?`<div class="sp-perfect">🌟 เพอร์เฟกต์! ไม่พลาดเลย ×${SPELL_PERFECT_X}</div>`:'')
        +(fullLeft<=0?`<div class="sp-late">รางวัลเต็ม ${SPELL_FULL_PER_DAY} คำ/วันครบแล้ว — คำละ 🪙${SPELL_COIN_LATE}</div>`:'');
    }
    spellBanner(`<div class="sp-big">🎉 ${w.en.toUpperCase()}</div><div class="sp-thb">${w.th||''}</div>${coinTxt}`, 2600);
    setTimeout(()=>{ if(typeof speakWord==='function') speakWord(w.en); }, 700);   // อ่านทั้งคำ (ตัดเสียงตัวอักษรเอง)
    spellLetters.forEach(s=>{ s.userData.dying=true; });       // ตัวที่เหลือลอยหายพร้อมกัน
    setTimeout(()=>{ if(spellActive) spellNextWord(); }, 2600);
  }

  // ---- HUD (HTML ทับเวที — pointer-events:none ยกเว้นปุ่ม ให้ปัดหมุนทะลุถึง canvas) ----
  function spellHud(){
    if(!heroEl) return null;
    let h=heroEl.querySelector('.sp-hud');
    if(!h){
      h=document.createElement('div'); h.className='sp-hud';
      h.innerHTML='<div class="sp-word"></div><div class="sp-th"></div><div class="sp-day"></div>'+
        '<div class="sp-hint">🌀 ปัดเหวี่ยงให้วงหมุน · แตะวง=หยุด · ตัวตรงช่อง ▼ แตะเก็บ</div>';
      heroEl.appendChild(h);
      const x=document.createElement('button');
      x.className='sp-exit'; x.textContent='✖ เลิกเล่น';
      x.addEventListener('click', spellEnd);
      heroEl.appendChild(x);
    }
    return h;
  }
  function spellHudWord(){
    const h=spellHud();
    if(!h || !spellWord) return;
    h.querySelector('.sp-word').innerHTML=spellWord.en.split('')
      .map((c,i)=>`<span class="sp-ch${i<spellIdx?' got':''}">${c.toUpperCase()}</span>`).join('');
    h.querySelector('.sp-th').textContent=spellWord.th||'';
    const left=spellDayLeft(), fmt=n=>(typeof fmtNum==='function')?fmtNum(n):n;
    h.querySelector('.sp-day').textContent = left>0
      ? `⭐ รางวัลเต็ม 🪙${fmt(SPELL_COIN)} เหลือ ${left} คำวันนี้`
      : `วันนี้รับเต็มครบ ${SPELL_FULL_PER_DAY} คำแล้ว — คำละ 🪙${SPELL_COIN_LATE}`;
  }
  function spellBanner(html, ms){
    if(!heroEl) return;
    const b=document.createElement('div'); b.className='sp-banner'; b.innerHTML=html;
    heroEl.appendChild(b);
    setTimeout(()=>b.remove(), ms||1800);
  }
  function spellBtnSync(){
    if(!heroEl) return;
    const b=heroEl.querySelector('.spell-btn');
    const want=!spellActive && curGiant===0 && !!(petRoot && petRoot.userData.gltf) && petRoot.visible &&
      canvas && canvas.style.display!=='none' && canvas.parentElement===heroEl;
    if(want && !b){
      const btn=document.createElement('button');
      btn.className='spell-btn'; btn.innerHTML='🌀 สะกดคำ';
      btn.addEventListener('click', spellStart);
      heroEl.appendChild(btn);
    }else if(!want && b) b.remove();
  }

  // ---- เริ่ม/จบเกม ----
  function spellStart(){
    if(spellActive || !renderer || curGiant!==0 || !petRoot.userData.gltf) return;
    spellActive=true; spellDone=[];
    ownerRoot.visible=false;                 // เวทีโล่งให้วงแหวนเด่น
    petRoot.position.x=0;                    // น้องเข้ากลางเวที (คืนที่เดิมตอนจบผ่าน sideLayout)
    targetRot=0; spinVel=0;                  // น้องหันหน้าตรง
    spellEnsure();
    spellSfx('start');
    spellNextWord();
    spellBtnSync();
    start();
  }
  function spellAbort(){                     // เคลียร์เงียบๆ (layout เปลี่ยน/ออกเกม) — ไม่เรียก render ภายนอก
    if(!spellActive) return;
    spellActive=false; spellLock=false; spellWord=null; spellLetters=[];
    if(spellGroup) while(spellGroup.children.length){ const o=spellGroup.children[0]; spellGroup.remove(o); if(o.material) o.material.dispose(); }
    if(spellMarker) spellMarker.visible=false;
    ownerRoot.visible=true;
    if(heroEl) heroEl.querySelectorAll('.sp-hud,.sp-exit,.sp-banner').forEach(n=>n.remove());
  }
  function spellEnd(){
    if(!spellActive) return;
    spellAbort();
    if(curGiant===0) sideLayout();           // น้องกลับข้างขวาคู่ผู้เลี้ยง
    spellBtnSync();
    const dash=document.getElementById('screen-dashboard');
    if(typeof renderDashboard==='function' && dash && dash.classList.contains('active')) renderDashboard();
  }

  // ปิดชั่วคราวเมื่อออกจากหน้า (main.js/showScreen wrapper เรียกได้ถ้าต้องการ)
  function pause(){ stop(); }

  window.addEventListener('resize', ()=>{ if(running) resize(); });

  // ตำแหน่งตัวอักษรบนจอ (client px) — ไว้เทสต์อัตโนมัติ/จูน (ไม่ใช้ใน logic เกม)
  function _spellLetters(){
    if(!spellActive || !canvas) return [];
    const r=canvas.getBoundingClientRect(), v=new three.Vector3();
    return spellLetters.filter(s=>!s.userData.dying).map(s=>{
      s.getWorldPosition(v); v.project(camera);
      return {ch:s.userData.ch, ang:+s.userData.ang.toFixed(3),
        d:+angNorm(s.userData.ang+spellRot).toFixed(3),
        x:Math.round(r.left+(v.x+1)/2*r.width), y:Math.round(r.top+(1-v.y)/2*r.height)};
    });
  }

  return { attach, pause, _stop:stop, spellStart, spellEnd, _spellLetters,
    _debug:()=>({running, disabled, curKey, curGiant,
      ownerLoaded:!!(ownerRoot&&ownerRoot.userData.gltf), petLoaded:!!(petRoot&&petRoot.userData.gltf),
      triangles: renderer?renderer.info.render.triangles:0,
      rotY: spin?+spin.rotation.y.toFixed(3):null, targetRot:+targetRot.toFixed(3),
      mixers:mixers.length,
      clipTime:mixers[0]?+mixers[0].time.toFixed(2):null,
      spell:{active:spellActive, word:spellWord?spellWord.en:null, idx:spellIdx,
        letters:spellLetters.length, rot:+spellRot.toFixed(3), lock:spellLock,
        miss:spellMiss, cat:spellWord?spellWord.cat:null,
        wordsToday:(typeof state!=='undefined')?(state.spellWords||0):null}}) };
})();
