"use strict";
/* ============================================================
   BAND ADV — คลังศัพท์ขั้นสูงแยกหมวด (js/data/band/ · รอบ 681)
   ต่างจาก js/dictband.js (DICT_BAND 1-5): ไม่ผูกชั้นเรียน เปิดเล่นได้ทุกคน
   ไม่มี pos/ipa/ตัวอย่าง (entry แค่ [en, th]) จึงไม่มีชุดสอบย่อย/สอบซ่อม —
   ต่อเข้าเครื่องยนต์เดิม startGame/startQuiz ตรงๆ เหมือนหมวดคำศัพท์ปกติ
   โหลดคำจากไฟล์ย่อยแบบขี้เกียจผ่าน fetch (ไฟล์ย่อยเป็น JSON ล้วน ไม่ต้อง <script>)
   ============================================================ */
const BAND_ADV_REWARD = 500;   // เท่ากับ BAND_SET_REWARD ใน dictband.js
const __bandAdvLoading = {};
const __bandAdvCats = {};

function bandAdvLoad(id){
  if(__bandAdvCats[id]) return Promise.resolve(__bandAdvCats[id]);
  if(__bandAdvLoading[id]) return __bandAdvLoading[id];
  const m = (typeof BAND_ADV_MANIFEST !== 'undefined') ? BAND_ADV_MANIFEST[id] : null;
  if(!m) return Promise.resolve(null);
  __bandAdvLoading[id] = Promise.all(m.files.map(fi=>
    fetch('js/data/band/' + fi.f).then(r=>r.json()).catch(()=>[])
  )).then(chunks=>{
    const seenEn = new Set(), seenTh = new Set(), words = [];
    chunks.forEach(arr=>(arr || []).forEach(pair=>{
      const en = String(pair && pair[0] || '').trim().toLowerCase();  // normalize ตัวเล็กเสมอ — business ขึ้นต้นตัวใหญ่ทุกคำ ไม่ทำ = เทียบคำตอบพลาด
      const th = String(pair && pair[1] || '').trim();
      if(!en || !th || seenEn.has(en) || seenTh.has(th)) return;
      seenEn.add(en); seenTh.add(th);
      words.push([en, th]);
    }));
    const cat = {id:'badv_' + id, name:m.label, emoji:m.emoji, reward:BAND_ADV_REWARD, words, quizCount:10};
    __bandAdvCats[id] = cat;
    return cat;
  });
  return __bandAdvLoading[id];
}

/* ปุ่มบนการ์ด band adv → จับคู่ = เล่นเลย · สอบ = สุ่ม 10 ข้อจากทั้งหมวด (เหมือนหมวดคำศัพท์ปกติ) */
function bandAdvPlay(id, mode){
  if(!__bandAdvLoading[id] && !__bandAdvCats[id]) toast('⏳ กำลังเปิดคลังศัพท์...');
  bandAdvLoad(id).then(cat=>{
    if(!cat || !cat.words.length){ toast('โหลดคลังศัพท์ไม่สำเร็จ ลองใหม่อีกครั้งนะ 😅'); return; }
    if(mode === 'quiz') startQuiz(cat); else startGame(cat);
  });
}

/* การ์ดคลังศัพท์ขั้นสูงต่อท้ายหน้าเลือกหมวด (เรียกจาก renderCats ใน game.js) */
function bandAdvCardsHTML(){
  if(typeof BAND_ADV_MANIFEST === 'undefined') return '';
  return `<div class="band-sec-head">🎓 คลังศัพท์ขั้นสูง
      <small>ศัพท์เฉพาะทางแยกหมวด เปิดเล่นได้ทุกคน ไม่ผูกชั้นเรียน</small></div>`
    + Object.keys(BAND_ADV_MANIFEST).map(id=>{
      const m = BAND_ADV_MANIFEST[id];
      const passed = state.quizPassed.includes('badv_' + id);
      return `<div class="cat-card band-card">
        <div class="cat-head">
          <span class="cat-emoji">${m.emoji}</span>
          <span class="cat-name">${escapeHTML(m.label)}</span>
          ${passed
            ? '<span class="cat-pass">✅ ผ่านแล้ว</span>'
            : `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 รางวัล ${BAND_ADV_REWARD} 🪙</span>`}
        </div>
        <div class="cat-info">${fmtNum(m.count)} คำ</div>
        <div class="cat-btns">
          <button class="cat-btn practice" data-badv="${id}">🎮 ฝึกจับคู่</button>
          <button class="cat-btn quiz" data-badv="${id}">📝 สอบ 10 ข้อ</button>
        </div>
      </div>`;
    }).join('');
}
