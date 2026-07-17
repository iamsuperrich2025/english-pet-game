"use strict";
/* ============================================================
   DICT BAND — คลังศัพท์ใหญ่ตามระดับ (band 1-5) จาก js/data/dict_band/
   manifest.js โหลดตอนบูต (เบา) → ชิ้นข้อมูล db<band>_*.js โหลดขี้เกียจ
   ตอนผู้เล่นกดเล่น แล้วต่อเข้าเครื่องยนต์เดิมทั้งคู่:
     🎮 startGame(cat)  = เกมจับคู่ [en, แปลTH]
     📝 startQuiz(cat)  = ข้อสอบ 10 ข้อ ตัวลวงจาก band เดียวกัน
                          + โชว์ IPA/คำอ่านบนการ์ดโจทย์ + เฉลยประโยคตัวอย่าง
   entry 8 ช่อง: [en,pos,ipa,คำอ่าน,นิยามEN,แปลTH,ตัวอย่างEN,แปลตัวอย่าง]
   ============================================================ */

const BAND_EMOJI  = {1:'🐣', 2:'🌱', 3:'🌳', 4:'🚀', 5:'🏆'};
const BAND_REWARD = 200;              // รางวัลสอบผ่านครั้งแรกของแต่ละระดับ
const __bandLoading = {};             // band -> Promise (โหลดชิ้นข้อมูลครั้งเดียว)
const __bandCats = {};                // band -> cat object (สร้างครั้งเดียวหลังโหลด)

function bandLoad(b){
  if(__bandLoading[b]) return __bandLoading[b];
  const m = (typeof DICT_BAND_MANIFEST !== 'undefined') ? DICT_BAND_MANIFEST[b] : null;
  if(!m) return Promise.resolve();
  __bandLoading[b] = new Promise(res=>{
    let done = 0;
    const fin = ()=>{ if(++done >= m.files.length) res(); };
    m.files.forEach(fi=>{
      const s = document.createElement('script');
      s.src = 'js/data/dict_band/' + fi.f;
      s.onload = fin; s.onerror = fin;
      document.head.appendChild(s);
    });
  });
  return __bandLoading[b];
}

/* แปลTH ในพจนานุกรมยาว (หลายความหมาย/มีวงเล็บ) → ตัดเหลือท่อนแรกไว้ขึ้นการ์ด */
function bandShortTH(th){
  const t = String(th || '').split(/[,;(（/]/)[0].trim();
  return t || String(th || '').trim();
}

/* สร้าง "หมวดเสมือน" ของ band — โครงเดียวกับ cat ใน vocab.js (เรียกหลัง bandLoad เสร็จ)
   กันซ้ำทั้งฝั่ง en และฝั่งแปลไทย เพื่อไม่ให้การ์ดจับคู่/ช้อยส์มีข้อความชนกัน */
function bandCat(b){
  if(__bandCats[b]) return __bandCats[b];
  const m = DICT_BAND_MANIFEST[b];
  const seenEn = new Set(), seenTh = new Set(), words = [], meta = {};
  DICT_BAND.forEach(ch=>{
    if(Number(ch.band) !== Number(b)) return;
    ch.words.forEach(e=>{
      const en = String(e[0]).trim().toLowerCase();   // normalize ตัวเล็กเสมอ (กฎถาวร — ไม่ทำ = เทียบคำตอบพลาด)
      const th = bandShortTH(e[5]);
      if(!en || !th || seenEn.has(en) || seenTh.has(th)) return;
      seenEn.add(en); seenTh.add(th);
      words.push([en, th]);
      meta[en] = {pos:e[1], ipa:e[2], pron:e[3], def:e[4], ex:e[6], exTh:e[7]};
    });
  });
  __bandCats[b] = {id:'band'+b, band:Number(b), name:`คลังศัพท์ ${m.label}`,
                   emoji:BAND_EMOJI[b] || '📖', reward:BAND_REWARD, words, dictMeta:meta};
  return __bandCats[b];
}

/* ปุ่มบนการ์ด band → โหลดชิ้นข้อมูลก่อน แล้วค่อยเข้าเกม/ข้อสอบ */
function bandPlay(b, mode){
  toast('⏳ กำลังเปิดคลังศัพท์...');
  bandLoad(b).then(()=>{
    const cat = bandCat(b);
    if(!cat.words.length){ toast('โหลดคลังศัพท์ไม่สำเร็จ ลองใหม่อีกครั้งนะ 😅'); return; }
    if(mode === 'quiz') startQuiz(cat); else startGame(cat);
  });
}

/* ปุ่มส้ม "เล่นเกมจับคู่คำศัพท์" หน้า lobby → คลังศัพท์ band ตามชั้นเรียนผู้เล่น
   (manifest หาย/โหลดไม่สำเร็จ = ถอยกลับคลังเดิม vocabForStudent ผ่าน startGame(null)) */
function bandPlayLobby(){
  const b = (typeof DICT_BAND_MANIFEST !== 'undefined')
    ? gradeBand(state.student ? state.student.grade : 'ป.1').band : 0;
  if(!b || !DICT_BAND_MANIFEST[b]){ startGame(null); return; }
  if(!__bandLoading[b]) toast('⏳ กำลังเปิดคลังศัพท์...');   // เตือนเฉพาะโหลดครั้งแรก
  bandLoad(b).then(()=>{
    const cat = bandCat(b);
    if(cat.words.length) startGame(cat); else startGame(null);
  });
}

/* การ์ด band 5 ใบ ต่อท้ายหน้าเลือกหมวด (เรียกจาก renderCats ใน game.js) */
function bandCardsHTML(){
  if(typeof DICT_BAND_MANIFEST === 'undefined') return '';
  const myBand = gradeBand(state.student ? state.student.grade : 'ป.1').band;
  return `<div class="band-sec-head">📖 คลังศัพท์ใหญ่ตามระดับ
      <small>ศัพท์เยอะจุใจทุกระดับ · ข้อสอบมีคำอ่าน + เฉลยประโยคตัวอย่าง</small></div>`
    + Object.keys(DICT_BAND_MANIFEST).map(b=>{
      const m = DICT_BAND_MANIFEST[b], id = 'band'+b;
      const attempts = state.quizLog.filter(l=>l.cat === id);
      const best = attempts.length ? Math.max(...attempts.map(a=>a.score)) : null;
      const passed = state.quizPassed.includes(id);
      const mine = Number(b) === myBand;
      return `<div class="cat-card band-card${mine ? ' mine' : ''}">
        <div class="cat-head">
          <span class="cat-emoji">${BAND_EMOJI[b] || '📖'}</span>
          <span class="cat-name">ระดับ ${m.label}${mine ? ' <span class="band-mine-tag">⭐ ระดับของหนู</span>' : ''}</span>
          ${passed
            ? '<span class="cat-pass">✅ ผ่านแล้ว</span>'
            : `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 รางวัล ${BAND_REWARD} 🪙</span>`}
        </div>
        <div class="cat-info">${fmtNum(m.count)} คำ · สอบมาแล้ว ${attempts.length} ครั้ง${best !== null ? ` · คะแนนสูงสุด ${best}/10` : ''}</div>
        <div class="cat-btns">
          <button class="cat-btn practice" data-band="${b}">🎮 ฝึกจับคู่</button>
          <button class="cat-btn quiz" data-band="${b}">📝 สอบ 10 ข้อ</button>
        </div>
      </div>`;
    }).join('');
}
