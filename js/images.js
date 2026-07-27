"use strict";
/* ============================================================
   ระบบตรวจหาภาพเจนอัตโนมัติ (ใช้ new Image() probe — ใช้ได้ทั้ง
   file:// และ http:// ต่างจาก fetch ที่ถูกบล็อกใน file://)
   ============================================================
   โฟลเดอร์ภาพ:
     img/                ภาพสัตว์  <pet>_<วัย>_<อาการ|ไอเทม>.png
     img/rank/           เหรียญตราแรงค์  rank_<id>.png
     img/home/           ที่พัก  home_<id>.png                     */

const IMG_FILES = {};                 // เช่น {'cat_baby_normal':'img/cat_baby_normal.png'}
const MOODS = ['normal','happy','hungry','sick'];

function startImgKey(pet){ return `${pet}_${PETS[pet].startKey}`; }

function petImageKeys(pet){
  const keys = [startImgKey(pet)];
  for(const stage of ['baby','adult']){
    for(const m of MOODS) keys.push(`${pet}_${stage}_${m}`);
    for(const it of ITEMS) keys.push(`${pet}_${stage}_${it.id}`);
  }
  // ข้อ 5.2: รูปร่างตามคุณภาพการกิน (เฉพาะโตเต็มวัย — prompt ใน PROMPTS_CHARACTERS.md)
  for(const s of ['fat','thin','strong']) keys.push(`${pet}_adult_${s}`);
  return keys;
}

function probeImages(keys, dir='img'){
  return Promise.all(keys.map(k=>{
    if(IMG_FILES[k] !== undefined) return Promise.resolve();   // เคยตรวจแล้ว
    return new Promise(done=>{
      const im = new Image();
      const path = `${dir}/${k}.png`;
      im.onload  = ()=>{ IMG_FILES[k] = path; done(); };
      im.onerror = ()=>{ IMG_FILES[k] = null; done(); };
      im.src = path;
    });
  }));
}
function probeRankImages(){ return probeImages(RANKS.map(r=>`rank_${r.id}`), 'img/rank'); }
function probeCollectImages(){ return probeImages(COLLECTIBLES.map(c=>`collect_${c.id}`), 'img/collectibles'); }
function probeGiftImages(){ return probeImages(GIFTS.map(g=>`gift_${g.id}`), 'img/gifts'); }
function probeHomeImages(){
  // ภาพบ้านปกติ + เสื่อมสภาพ (ค้างค่าบำรุง) + พัง (ฉากแจ้งเตือน) + มืด (ถูกตัดไฟ) + แห้ง (ถูกตัดน้ำ)
  return probeImages(HOMES.flatMap(h=>[`home_${h.id}`, `home_${h.id}_decayed`, `home_${h.id}_ruined`, `home_${h.id}_dark`, `home_${h.id}_nowater`]), 'img/home');
}

/* 🎬 รอบ 605: คลิปวิดีโอน้องตามช่วงวัย (ผู้ใช้เจนเองด้วย AI วางไว้ใน clip/)
   ชื่อไฟล์ = ชื่อเดียวกับภาพต้นแบบของวัยนั้น: clip/<pet>_<newborn|baby_normal|adult_normal>.mp4
   ตรวจแบบ "ลองเล่นก่อน" (ไม่ยิง HEAD ตอนบูต): มีไฟล์ = เล่นได้เลย · ไม่มี = video ยิง error
   → จำว่า null แล้วถอยไปใช้ฉากการ์ตูน CSS ของรอบ 604 (ครูวางคลิปเพิ่มทีหลังได้เลย ไม่ต้องแก้โค้ด) */
const CLIP_FILES = {};

/* 🗜️ รอบ 611: ไฟล์คลิป "ตัวเล็ก" ที่บีบไว้แล้วใน clip/sm/ (ต้นฉบับใน clip/ ยังอยู่ครบเป็นตัวสำรอง)
   บล็อกข้างล่างเจนอัตโนมัติด้วย `bash tools/compress_clips.sh` — ⛔ ห้ามแก้มือ (โดนทับ)
   ค่าแต่ละคลิป = รายชื่อไฟล์เรียง "เล็กสุดก่อน" → เกมหยิบตัวแรกที่เบราว์เซอร์นี้เล่นได้ */
/* CLIP-SM-START */
const CLIP_SM = {
  cat_adult_normal: ['sm/cat_adult_normal.mp4','sm/cat_adult_normal.webm'],
  cat_baby_normal: ['sm/cat_baby_normal.mp4','sm/cat_baby_normal.webm'],
  cat_newborn: ['sm/cat_newborn.mp4','sm/cat_newborn.webm'],
  dog_adult_normal: ['sm/dog_adult_normal.mp4','sm/dog_adult_normal.webm'],
  dog_baby_normal: ['sm/dog_baby_normal.mp4','sm/dog_baby_normal.webm'],
  dog_newborn: ['sm/dog_newborn.webm','sm/dog_newborn.mp4'],
  dragon_adult_normal: ['sm/dragon_adult_normal.mp4','sm/dragon_adult_normal.webm'],
  dragon_baby_normal: ['sm/dragon_baby_normal.mp4','sm/dragon_baby_normal.webm'],
  dragon_egg: ['sm/dragon_egg.mp4','sm/dragon_egg.webm'],
};
/* CLIP-SM-END */

/* เบราว์เซอร์นี้เล่น webm (VP9) ได้ไหม — ถามครั้งเดียวแล้วจำไว้
   ตอบ '' = เล่นไม่ได้ · 'maybe'/'probably' = ได้ (Safari เก่า/iOS เก่าจะได้ '' → ข้ามไปใช้ mp4) */
let __clipWebm = null;
function clipCanWebm(){
  if(__clipWebm === null){
    try{ __clipWebm = !!document.createElement('video').canPlayType('video/webm; codecs="vp9"'); }
    catch(e){ __clipWebm = false; }
  }
  return __clipWebm;
}
/* 🩹 รอบ 618: clip/*.mp4 ไม่ผ่าน sw.js cache (ปล่อยเบราว์เซอร์จัดการเอง — ดูคอมเมนต์ใน sw.js)
   → ชื่อไฟล์เดิมตลอด แก้ "เนื้อ" วิดีโอในไฟล์เดิมแล้วเครื่องผู้เล่นเก่ายังติดแคช HTTP เดิมของเบราว์เซอร์/CDN
   (เจอจริง: แก้พื้นหลังคลิปหมา/แมว/มังกร ผู้เล่นเห็นมังกรใหม่แต่หมา/แมวยังเป็นเวอร์ชันเก่า)
   แก้แบบเดียวกับ moto3d.js (?v=) — บัมพ์เลขนี้ทุกครั้งที่แก้ "เนื้อ" ไฟล์ clip/*.mp4 (ไม่ใช่แค่เพิ่มคลิปใหม่) */
const CLIP_ASSET_V = 618;
/* ไฟล์ที่ควรโหลดจริงของคลิปตัวหนึ่ง: เล็กสุดที่เล่นได้ก่อน · ไม่มีตัวเล็กก็ใช้ต้นฉบับ */
function clipFileFor(k){
  const list = CLIP_SM[k];
  if(list) for(const f of list){
    if(f.endsWith('.webm') && !clipCanWebm()) continue;
    return `clip/${f}?v=${CLIP_ASSET_V}`;
  }
  return `clip/${k}.mp4?v=${CLIP_ASSET_V}`;
}

function petClipKey(p){
  p = p || activePet(); if(!p) return null;
  const stage = petStage(p);
  return stage === 'egg' ? startImgKey(p.type) : `${p.type}_${stage}_normal`;
}
/* คืน URL คลิปที่ควรเล่นตอนนี้ · null = ให้ใช้ภาพนิ่ง
   ป่วย/หลับ/หิว = คงภาพนิ่งตามสถานะ (เด็กต้องเห็นอาการของน้อง) · ปิดเอฟเฟกต์เคลื่อนไหว = ไม่เล่นคลิป
   🎀 รอบ 609 (ผู้ใช้เจอเอง): "ใส่ชุด" ไม่บล็อกคลิปแล้ว — เด็กซื้อหมวกให้น้องแล้วคลิปหายไปเลยไม่สมเหตุผล
      อยากดูชุดเมื่อไหร่กดปุ่มสลับบนเวที (state.psDress) หรือดูในหน้า "ข้อมูลน้อง" ซึ่งใช้ภาพใส่ชุดอยู่แล้ว */
function petClipUrl(p){
  p = p || activePet(); if(!p) return null;
  if(state.noAnim || p.sick || p.sleeping) return null;
  if(typeof petHungry === 'function' && petHungry(p)) return null;
  if(state.psDress && typeof equippedItem === 'function' && equippedItem(p)) return null;   // เด็กเลือก "ดูชุด" อยู่
  const k = petClipKey(p); if(!k) return null;
  if(CLIP_FILES[k] === null) return null;              // เคยลองแล้วไม่มีไฟล์
  return CLIP_FILES[k] || clipFileFor(k);              // 🗜️ รอบ 611: ตัวเล็กที่เล่นได้ก่อน
}

/* ไอเทมที่สวมอยู่ของสัตว์ตัวหนึ่ง (ใส่ได้ทีละ 1 ชิ้น) */
function equippedItem(p){
  p = p || activePet();
  if(!p) return null;
  const id = p.equipped.head || p.equipped.face || p.equipped.neck;
  return ITEMS.find(i=>i.id === id) || null;
}

/* รอบ 186: ภาพสถานะที่ควร "แทนโมเดล 3D" บนเวที Lobby — ป่วย / หิว / ใส่เครื่องแต่งตัว
   คืน URL เฉพาะเมื่อมีภาพตรงสถานะจริงเท่านั้น (ไม่นับภาพ normal) → ผูกความรู้สึกกับสถานะน้อง
   ไม่มีภาพตรงสถานะ = null → เวทีใช้โมเดล 3D ปกติเหมือนเดิม (ไม่มีทางจอโล่ง) */
function petStateImg(p){
  p = p || activePet();
  if(!p) return null;
  const pet = p.type, stage = petStage(p);
  if(stage === 'egg') return null;
  if(p.sick)       return IMG_FILES[`${pet}_${stage}_sick`]   || null;
  if(petHungry(p)) return IMG_FILES[`${pet}_${stage}_hungry`] || null;
  const worn = equippedItem(p);
  if(worn)         return IMG_FILES[`${pet}_${stage}_${worn.id}`] || null;
  return null;
}

/* สถานะดีใจชั่วคราว (ตอนลูบตัว/หลังกินข้าว) */
let happyUntil = 0;
function happyNow(){ return Date.now() < happyUntil; }
function makeHappy(ms){
  happyUntil = Date.now() + ms;
  renderDashboard();
  clearTimeout(makeHappy._t);
  makeHappy._t = setTimeout(()=>{
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  }, ms + 100);
}

/* เลือกภาพที่จะแสดง: ป่วย > หิว > ดีใจ > รูปร่าง (ข้อ 5.2) > ใส่ชุด > ปกติ
   (ร่างอ้วน/ผอมโซ/ล่ำ คือผลจากการกิน — สำคัญกว่าชุดเพื่อให้เด็กเห็นผลชัด ภาพไม่มีก็ตกไปชุด/ปกติ) */
function currentPetImg(p){
  p = p || activePet();
  if(!p) return null;
  const pet = p.type, stage = petStage(p);
  if(stage === 'egg') return IMG_FILES[startImgKey(pet)] || null;
  const candidates = [];
  const worn = equippedItem(p);
  if(p.sick) candidates.push(`${pet}_${stage}_sick`);
  else if(petHungry(p)) candidates.push(`${pet}_${stage}_hungry`);
  else if(happyNow()) candidates.push(`${pet}_${stage}_happy`);
  else{
    if(stage === 'adult' && p.shape && p.shape !== 'normal') candidates.push(`${pet}_adult_${p.shape}`);
    if(worn) candidates.push(`${pet}_${stage}_${worn.id}`);
  }
  candidates.push(`${pet}_${stage}_normal`);
  for(const k of candidates){ if(IMG_FILES[k]) return IMG_FILES[k]; }
  return null;
}
