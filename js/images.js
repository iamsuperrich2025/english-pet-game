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

/* ไอเทมที่สวมอยู่ของสัตว์ตัวหนึ่ง (ใส่ได้ทีละ 1 ชิ้น) */
function equippedItem(p){
  p = p || activePet();
  if(!p) return null;
  const id = p.equipped.head || p.equipped.face || p.equipped.neck;
  return ITEMS.find(i=>i.id === id) || null;
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
