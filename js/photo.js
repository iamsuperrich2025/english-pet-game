/* ============================================================
   📷 photo.js — รูปโปรไฟล์ของผู้เล่นเอง (อัปโหลดรูปแบบ Facebook) — รอบ 709
   ------------------------------------------------------------
   • เก็บที่ไหน: localStorage แยกก้อน (`petVocabAdventure_photo`) + RTDB `/pphoto/<uid>`
     ตั้งใจ **ไม่ยัดลง state** เพราะ state ถูกเซฟขึ้น cloud ทั้งก้อนทุกครั้ง (รูป ~20KB จะทำให้เซฟบวมทุกครั้ง)
   • รูปถูก "ครอปเป็นจัตุรัส + ย่อ + บีบเป็น JPEG" ในเครื่องก่อนเสมอ → ไม่เกิน PHOTO_MAX ตัวอักษร
   • ไม่มีรูป = ใช้ตัวการ์ตูนบล็อก (lobbyBlk) เหมือนเดิมทุกจุด
   • 🛡️ ความปลอดภัยเด็ก: เพื่อนในเกมเห็นรูปนี้ได้ → กล่องอัปโหลดเตือนให้ผู้ปกครองช่วยเลือก
     และลบออกได้ตลอดเวลา (ลบ = หายทั้งเครื่องและบน DB)
   ============================================================ */

const PHOTO_LS_KEY = 'petVocabAdventure_photo';
const PHOTO_MAX    = 28000;                 // ตัวอักษร data URL สูงสุด (rules /pphoto ยอม ≤30000)
const PHOTO_PREFIX = 'data:image/jpeg;base64,';
const PHOTO_SIZES  = [256, 224, 192, 160];  // ไล่ย่อลงถ้าบีบเท่าไหร่ก็ยังเกินโควตา
const PHOTO_QS     = [0.82, 0.72, 0.62, 0.5];
const PHOTO_ZMAX   = 3.2;                   // ซูมได้สูงสุดกี่เท่าของขนาดพอดีกรอบ

const Photo = { cloudOk: null };            // null = ยังไม่รู้ · false = เขียน DB ไม่ผ่าน (rules ยังไม่ publish)
let PhotoMine = '';
try{ PhotoMine = localStorage.getItem(PHOTO_LS_KEY) || ''; }catch(e){}
const PhotoCache = {};                      // uid -> data URL ('' = ยืนยันแล้วว่าไม่มีรูป)
const PhotoPend  = {};                      // uid -> true (กำลังโหลดอยู่ กันยิงซ้ำ)

function photoValid(v){
  return typeof v === 'string' && v.length > 40 && v.length <= 30000 && v.indexOf(PHOTO_PREFIX) === 0;
}
function photoOnline(){
  return typeof Online !== 'undefined' && Online.ready && Online.db && typeof onlineKey === 'function';
}
function photoGet(){ return PhotoMine; }
function photoHas(){ return !!PhotoMine; }
function photoIsMine(uid){ return !!uid && typeof onlineKey === 'function' && uid === onlineKey(); }

/* รูปของผู้เล่นคนหนึ่ง (sync) — ยังไม่เคยโหลด = คืน '' แล้วสั่งโหลดไว้ให้รอบหน้า */
function photoOf(uid){
  if(!uid) return '';
  if(photoIsMine(uid)) return PhotoMine;
  if(PhotoCache[uid] !== undefined) return PhotoCache[uid];
  photoFetch(uid);
  return '';
}
/* โหลดรูปของผู้เล่นคนหนึ่งจาก DB (มี cache ต่อ uid) → Promise<dataURL|''> */
function photoFetch(uid, force){
  if(!uid) return Promise.resolve('');
  if(photoIsMine(uid) && !force) return Promise.resolve(PhotoMine);
  if(!force && PhotoCache[uid] !== undefined) return Promise.resolve(PhotoCache[uid]);
  if(!photoOnline()) return Promise.resolve('');
  if(PhotoPend[uid]) return PhotoPend[uid];
  PhotoPend[uid] = Online.db.ref('pphoto/' + uid).get().then(s=>{
    const v = s && s.val();
    const url = photoValid(v) ? v : '';
    PhotoCache[uid] = url;
    delete PhotoPend[uid];
    return url;
  }).catch(()=>{ PhotoCache[uid] = ''; delete PhotoPend[uid]; return ''; });
  return PhotoPend[uid];
}

/* ---------- เซฟ / ลบ / ซิงก์ ---------- */
function photoAfterChange(){
  if(typeof onlineKey === 'function') PhotoCache[onlineKey()] = PhotoMine;
  if(typeof renderDashboard === 'function' && document.getElementById('screen-dashboard')) renderDashboard();
}
function photoPush(quiet){
  if(!photoOnline()) return Promise.resolve(false);
  return Online.db.ref('pphoto/' + onlineKey()).set(PhotoMine).then(()=>{
    Photo.cloudOk = true; return true;
  }).catch(()=>{
    Photo.cloudOk = false;
    // ⚠️ กฎทอง #1: ห้ามปิดเงียบ — บอกผู้ใช้ตรง ๆ ว่ารูปยังไปไม่ถึงเพื่อน เพราะอะไร
    // (quiet = ผู้เรียกโชว์ป้ายบนจอเองแล้ว ไม่ต้องเด้ง toast ซ้ำ)
    if(!quiet && typeof toast === 'function')
      toast('📷 เก็บรูปในเครื่องนี้แล้ว แต่ยังส่งขึ้นระบบไม่ได้ — ต้องอัปเดตกฎความปลอดภัยโซน /pphoto ก่อน เพื่อนถึงจะเห็น', 4600);
    return false;
  });
}

/* 🔎 รอบ 763: "เพื่อนเห็นรูปนี้จริงหรือยัง" — อ่านกลับจาก DB ตัวเดียวกับที่เพื่อนอ่าน
   (ห้ามเชื่อแค่ว่าเซฟในเครื่องผ่าน — เคสจริง: rules โซน /pphoto ยังไม่ publish
    → เขียนโดน deny เงียบ ๆ เจ้าตัวเห็นรูปใหม่ แต่เพื่อนยังเห็นตัวการ์ตูนเหมือนเดิม)
   DB ไม่ตรงกับเครื่อง = ลองส่งซ้ำให้เองก่อน (self-heal) แล้วค่อยรายงานผลจริง */
function photoVerify(){
  if(!PhotoMine)     return Promise.resolve({k:'none', msg:'ตอนนี้ใช้ตัวการ์ตูนเป็นรูปโปรไฟล์ — เพื่อนเห็นตัวการ์ตูนนี้'});
  if(!photoOnline()) return Promise.resolve({k:'wait', msg:'⏳ ยังต่อระบบออนไลน์ไม่ได้ — ตรวจไม่ได้ว่าเพื่อนเห็นรูปนี้แล้วหรือยัง'});
  const bad = {k:'bad', msg:'⚠️ รูปนี้ยังอยู่แค่ในเครื่องนี้ — เพื่อนยังเห็นเป็นตัวการ์ตูนอยู่ (ต้องอัปเดตกฎความปลอดภัยโซน /pphoto ใน Firebase ก่อน)'};
  return Online.db.ref('pphoto/' + onlineKey()).get().then(s=>{
    const v = s && s.val();
    if(photoValid(v) && v === PhotoMine) return {k:'ok', msg:'✅ ส่งขึ้นระบบแล้ว — เพื่อนเห็นรูปนี้'};
    return photoPush(true).then(ok=> ok ? {k:'ok', msg:'✅ ส่งรูปขึ้นระบบเรียบร้อย — เพื่อนเห็นรูปนี้แล้ว'} : bad);
  }).catch(()=> bad);
}
function photoSaveUrl(url){
  PhotoMine = url;
  try{ localStorage.setItem(PHOTO_LS_KEY, url); }catch(e){}
  photoAfterChange();
  return photoPush();
}
function photoRemove(){
  PhotoMine = '';
  try{ localStorage.removeItem(PHOTO_LS_KEY); }catch(e){}
  photoAfterChange();
  if(photoOnline()) Online.db.ref('pphoto/' + onlineKey()).remove().catch(()=>{});
}
/* เข้าเกมบนเครื่องใหม่ → ดึงรูปของตัวเองลงมา · มีในเครื่องแต่ DB ว่าง → ส่งขึ้นให้ (self-heal) */
function photoPullMine(){
  if(!photoOnline()) return;
  Online.db.ref('pphoto/' + onlineKey()).get().then(s=>{
    const v = s && s.val();
    const cloud = photoValid(v) ? v : '';
    if(cloud && cloud !== PhotoMine){
      PhotoMine = cloud;
      try{ localStorage.setItem(PHOTO_LS_KEY, cloud); }catch(e){}
      photoAfterChange();
    }else if(!cloud && PhotoMine){
      photoPush();
    }
  }).catch(()=>{});
}

/* ---------- HTML ช่วยเรียก (จุดที่โชว์รูปโปรไฟล์) ---------- */
function photoBlkSrc(){
  return `img/blocks/${(typeof lobbyBlk === 'function') ? lobbyBlk() : (typeof state !== 'undefined' && state.blockAv) || 'blk1'}.png`;
}

/* 🖼️ รอบ 711: วงกลมเล็กโชว์รูปโปรไฟล์ "ของคนอื่น" — ใช้ในฟีด/คนออนไลน์/แชท
   มีรูป (ของตัวเอง sync ทันที · ของเพื่อนอ่าน /pphoto ทีหลัง แล้วโผล่ตอน render รอบถัดไปที่จุดนั้นวาดใหม่ — เกิดถี่อยู่แล้ว)
   → คืน <img> วงกลม · ไม่มีรูป → คืน '' (ผู้เรียกใช้ยังมีของเดิม อิโมจิ/ตัวอักษรย่อ ไม่เปลี่ยนอะไร) */
function photoMiniHTML(uid, cls){
  const ph = (typeof photoOf === 'function') ? photoOf(uid) : '';
  return ph ? `<img class="mini-av${cls ? ' ' + cls : ''}" src="${ph}" alt="">` : '';
}

/* ============================================================
   🗂️ กล่อง "รูปโปรไฟล์ของหนู" (เมนูหลัก)
   ============================================================ */
function openPhotoMenu(onDone){
  const ov = document.createElement('div');
  ov.className = 'levelup-overlay photo-overlay';
  const paintNow = ()=>{
    const box = ov.querySelector('.ph-now');
    if(!box) return;
    box.innerHTML = PhotoMine
      ? `<img class="ph-now-img" src="${PhotoMine}" alt="รูปโปรไฟล์ของหนู">
         <div class="ph-now-cap">รูปที่ใช้อยู่ตอนนี้</div>`
      : `<img class="ph-now-img ph-now-blk" src="${photoBlkSrc()}" alt="ตัวการ์ตูนของหนู">
         <div class="ph-now-cap">ตอนนี้ใช้ตัวการ์ตูนอยู่</div>`;
    const del = ov.querySelector('.ph-del');
    if(del) del.style.display = PhotoMine ? '' : 'none';
    paintSync();
  };
  /* 🔎 รอบ 763: ป้ายบอกตรง ๆ ว่า "เพื่อนเห็นรูปนี้แล้วหรือยัง" (กฎทอง #1 — ห้ามให้ผู้ใช้เดาเอง) */
  const paintSync = ()=>{
    const el = ov.querySelector('.ph-sync');
    if(!el) return;
    el.className = 'ph-sync ph-sync-wait';
    el.textContent = PhotoMine ? '⏳ กำลังตรวจว่าเพื่อนเห็นรูปนี้แล้วหรือยัง…' : '';
    if(!PhotoMine) return;
    photoVerify().then(r=>{
      if(!ov.isConnected) return;
      el.className = 'ph-sync ph-sync-' + r.k;
      el.textContent = r.msg;
    });
  };
  ov.innerHTML = `<div class="levelup-box photo-box">
    <h2 class="ph-h2">📷 รูปโปรไฟล์ของหนู</h2>
    <div class="ph-now"></div>
    <div class="ph-sync"></div>
    <p class="ph-warn">👨‍👩‍👧 <b>ให้ผู้ปกครองช่วยเลือกรูปนะ</b> — เพื่อนในเกมมองเห็นรูปนี้ได้
      เลี่ยงรูปที่บอกชื่อจริง ชื่อโรงเรียน หรือที่อยู่ · เปลี่ยนหรือลบทีหลังได้ตลอด</p>
    <div class="ph-btns">
      <button class="ph-btn ph-up" type="button">📤 เลือกรูปจากเครื่อง</button>
      <button class="ph-btn ph-del" type="button">🧱 กลับไปใช้ตัวการ์ตูน</button>
    </div>
    <div class="ph-foot"><button class="set-close ph-close" type="button">ปิด</button></div>
    <input type="file" class="ph-file" accept="image/*" style="display:none">
  </div>`;
  const close = ()=>{ ov.remove(); if(typeof onDone === 'function') onDone(); };
  ov.querySelector('.ph-close').addEventListener('click', close);
  ov.addEventListener('click', e=>{ if(e.target === ov) close(); });
  const file = ov.querySelector('.ph-file');
  ov.querySelector('.ph-up').addEventListener('click', ()=>{ if(typeof sfx!=='undefined') sfx.select(); file.click(); });
  file.addEventListener('change', ()=>{
    const f = file.files && file.files[0];
    file.value = '';
    if(f) openPhotoCrop(f, ()=>{ paintNow(); if(typeof onDone === 'function') onDone(); });
  });
  ov.querySelector('.ph-del').addEventListener('click', ()=>{
    if(!PhotoMine) return;
    photoRemove();
    if(typeof sfx !== 'undefined') sfx.select();
    if(typeof toast === 'function') toast('🧱 กลับไปใช้ตัวการ์ตูนเป็นรูปโปรไฟล์แล้ว');
    paintNow();
    if(typeof onDone === 'function') onDone();
  });
  paintNow();
  document.body.appendChild(ov);
}

/* ============================================================
   ✂️ กล่องครอปรูป (ลากเลื่อน + ซูม) → อบเป็น JPEG จัตุรัสก้อนเล็ก
   ============================================================ */
function photoLoadImgEl(f){
  return new Promise((res, rej)=>{
    const url = URL.createObjectURL(f), im = new Image();
    im.onload  = ()=>res(im);
    im.onerror = ()=>{ URL.revokeObjectURL(url); rej('เปิดไฟล์รูปนี้ไม่ได้ ลองรูปอื่นนะ'); };
    im.src = url;
  });
}
function photoLoadFile(f){
  if(!f) return Promise.reject('ยังไม่ได้เลือกไฟล์');
  if(!/^image\//.test(f.type || '')) return Promise.reject('ไฟล์นี้ไม่ใช่รูปภาพนะ ลองเลือกใหม่');
  if(f.size > 25 * 1024 * 1024) return Promise.reject('รูปใหญ่เกินไป (เกิน 25 MB) ลองรูปอื่นนะ');
  // createImageBitmap = หมุนรูปตาม EXIF ให้เอง (รูปจากมือถือจะได้ไม่ตะแคง)
  if(window.createImageBitmap){
    try{
      return createImageBitmap(f, {imageOrientation: 'from-image'}).catch(()=>photoLoadImgEl(f));
    }catch(e){ /* เบราว์เซอร์เก่าไม่รับ options */ }
  }
  return photoLoadImgEl(f);
}

function openPhotoCrop(f, onSaved){
  const ov = document.createElement('div');
  ov.className = 'levelup-overlay photo-overlay';
  ov.innerHTML = `<div class="levelup-box photo-box ph-crop-box">
    <h2 class="ph-h2">✂️ จัดรูปให้พอดี</h2>
    <p class="ph-tip">ลากรูปเพื่อเลื่อน · เลื่อนแถบข้างล่างเพื่อย่อ-ขยาย</p>
    <div class="ph-stage"><canvas class="ph-cv"></canvas><div class="ph-ring"></div></div>
    <input class="ph-zoom" type="range" min="100" max="${Math.round(PHOTO_ZMAX*100)}" value="100" aria-label="ย่อ-ขยายรูป">
    <div class="ph-btns">
      <button class="ph-btn ph-save" type="button">✅ ใช้รูปนี้</button>
      <button class="ph-btn ph-ghost ph-cancel" type="button">ยกเลิก</button>
    </div>
  </div>`;
  const cv    = ov.querySelector('.ph-cv');
  const stage = ov.querySelector('.ph-stage');
  const zoom  = ov.querySelector('.ph-zoom');
  const st    = {src:null, w:0, h:0, z:1, ox:0, oy:0, V:0};

  const scale     = ()=>Math.max(st.V / st.w, st.V / st.h) * st.z;
  const clampPan  = ()=>{
    const s = scale();
    st.ox = Math.min(0, Math.max(st.V - st.w * s, st.ox));
    st.oy = Math.min(0, Math.max(st.V - st.h * s, st.oy));
  };
  const draw = ()=>{
    if(!st.src) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if(cv.width !== Math.round(st.V*dpr)){ cv.width = cv.height = Math.round(st.V*dpr); }
    cv.style.width = cv.style.height = st.V + 'px';
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, st.V, st.V);
    const s = scale();
    g.imageSmoothingQuality = 'high';
    g.drawImage(st.src, st.ox, st.oy, st.w * s, st.h * s);
  };
  const setZoom = (z)=>{
    const s0 = scale();
    st.z = Math.max(1, Math.min(PHOTO_ZMAX, z));
    const r = scale() / s0;
    st.ox = st.V/2 - (st.V/2 - st.ox) * r;    // ซูมค้างที่จุดกึ่งกลางกรอบ (ไม่ให้ภาพกระโดด)
    st.oy = st.V/2 - (st.V/2 - st.oy) * r;
    clampPan(); draw();
  };
  /* อบรูปออกเป็น data URL — ไล่ลดคุณภาพ/ขนาดจนอยู่ในโควตา PHOTO_MAX */
  const bake = ()=>{
    for(const px of PHOTO_SIZES){
      const c = document.createElement('canvas'); c.width = c.height = px;
      const g = c.getContext('2d');
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, px, px);   // JPEG ไม่มีพื้นโปร่ง → รองพื้นขาวไว้
      g.imageSmoothingQuality = 'high';
      const k = px / st.V, s = scale();
      g.drawImage(st.src, st.ox*k, st.oy*k, st.w*s*k, st.h*s*k);
      for(const q of PHOTO_QS){
        const u = c.toDataURL('image/jpeg', q);
        if(u.length <= PHOTO_MAX) return u;
      }
    }
    return '';
  };

  const close = ()=>{
    if(st.src && st.src.close) st.src.close();               // ปล่อย ImageBitmap
    if(st.src && st.src.src && st.src.src.indexOf('blob:') === 0) URL.revokeObjectURL(st.src.src);
    ov.remove();
  };
  ov.querySelector('.ph-cancel').addEventListener('click', close);
  ov.addEventListener('click', e=>{ if(e.target === ov) close(); });
  zoom.addEventListener('input', ()=>setZoom(zoom.value / 100));

  /* ลากเลื่อน + หนีบซูม (pointer events ใช้ได้ทั้งเมาส์/นิ้ว) */
  const pts = new Map();
  let pinch0 = 0, z0 = 1;
  stage.addEventListener('pointerdown', e=>{
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(pts.size === 2){
      const [a, b] = [...pts.values()];
      pinch0 = Math.hypot(a.x-b.x, a.y-b.y); z0 = st.z;
    }
  });
  stage.addEventListener('pointermove', e=>{
    const p = pts.get(e.pointerId);
    if(!p) return;
    if(pts.size === 1){
      st.ox += e.clientX - p.x; st.oy += e.clientY - p.y;
      clampPan(); draw();
    }
    pts.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(pts.size === 2 && pinch0 > 0){
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      setZoom(z0 * (d / pinch0));
      zoom.value = Math.round(st.z * 100);
    }
    e.preventDefault();
  });
  const drop = e=>{ pts.delete(e.pointerId); if(pts.size < 2) pinch0 = 0; };
  stage.addEventListener('pointerup', drop);
  stage.addEventListener('pointercancel', drop);
  stage.addEventListener('wheel', e=>{
    e.preventDefault();
    setZoom(st.z * (e.deltaY < 0 ? 1.12 : 1/1.12));
    zoom.value = Math.round(st.z * 100);
  }, {passive:false});

  ov.querySelector('.ph-save').addEventListener('click', ()=>{
    const btn = ov.querySelector('.ph-save');
    btn.disabled = true; btn.textContent = '⏳ กำลังบันทึก…';
    const url = bake();
    if(!url){
      btn.disabled = false; btn.textContent = '✅ ใช้รูปนี้';
      if(typeof toast === 'function') toast('บีบรูปนี้ให้เล็กพอไม่ได้ ลองเลือกรูปอื่นนะ');
      return;
    }
    photoSaveUrl(url);
    if(typeof sfx !== 'undefined') sfx.levelup ? sfx.levelup() : sfx.select();
    if(typeof toast === 'function') toast('📷 เปลี่ยนรูปโปรไฟล์เรียบร้อย!');
    close();
    if(typeof onSaved === 'function') onSaved();
  });

  document.body.appendChild(ov);
  // วัดกรอบจริงหลังต่อเข้า DOM (ขนาดกรอบผูกกับ vh/vw — กฎทอง #7 ต้องพอดีจอเตี้ยด้วย)
  photoLoadFile(f).then(src=>{
    st.src = src;
    st.w = src.width || src.naturalWidth;
    st.h = src.height || src.naturalHeight;
    st.V = Math.round(stage.getBoundingClientRect().width) || 240;
    const s = scale();
    st.ox = (st.V - st.w * s) / 2;      // เริ่มที่กึ่งกลางรูป
    st.oy = (st.V - st.h * s) / 2;
    clampPan(); draw();
  }).catch(err=>{
    close();
    if(typeof toast === 'function') toast(typeof err === 'string' ? err : 'เปิดรูปนี้ไม่ได้ ลองรูปอื่นนะ');
  });
}
