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
const __bandAdvFail = {};   // id -> [{file, kind:'404'|'network'}] ไฟล์ที่โหลดพังของรอบล่าสุด (รอบ 768)

/* แยกสาเหตุที่โหลดพัง: 404 = ไฟล์ยังไม่ขึ้นเว็บ (ต้อง deploy ใหม่) vs network = เน็ตหลุด/เชื่อมต่อไม่ได้
   log ชื่อไฟล์ลง console กัน "ต้นตอ" หายไปกับ .catch เงียบ ๆ เหมือนรอบ 767 */
function bandAdvFailMsg(id){
  const fails = __bandAdvFail[id] || [];
  if(!fails.length) return 'โหลดคลังศัพท์ไม่สำเร็จ ลองใหม่อีกครั้งนะ 😅';
  if(fails.some(f=>f.kind === '404')) return 'คลังศัพท์นี้ยังไม่ขึ้นเว็บ แจ้งผู้ดูแลให้อัปเดตก่อนนะ 🙏';
  return 'เน็ตหลุดระหว่างโหลดคลังศัพท์ ลองเช็กสัญญาณแล้วลองใหม่นะ 😅';
}

function bandAdvLoad(id){
  if(__bandAdvCats[id]) return Promise.resolve(__bandAdvCats[id]);
  if(__bandAdvLoading[id]) return __bandAdvLoading[id];
  const m = (typeof BAND_ADV_MANIFEST !== 'undefined') ? BAND_ADV_MANIFEST[id] : null;
  if(!m) return Promise.resolve(null);
  __bandAdvFail[id] = [];
  __bandAdvLoading[id] = Promise.all(m.files.map(fi=>{
    const url = 'js/data/band/' + fi.f;
    return fetch(url).then(r=>{
      if(!r.ok){
        const kind = r.status === 404 ? '404' : 'http';
        console.error(`[bandAdvLoad] โหลดไฟล์คำศัพท์ไม่สำเร็จ (สถานะ ${r.status}${kind === '404' ? ' — ไฟล์ไม่ขึ้นเว็บ' : ''}): ${url}`);
        __bandAdvFail[id].push({file:fi.f, kind});
        return [];
      }
      return r.json();
    }).catch(err=>{
      console.error(`[bandAdvLoad] โหลดไฟล์คำศัพท์ไม่สำเร็จ (เน็ตหลุด/เชื่อมต่อไม่ได้): ${url}`, err);
      __bandAdvFail[id].push({file:fi.f, kind:'network'});
      return [];
    });
  })).then(chunks=>{
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
    if(!cat || !cat.words.length){ toast(bandAdvFailMsg(id)); return; }
    if(mode === 'quiz') startQuiz(cat); else startGame(cat);
  });
}

/* ============================================================
   🏅 โหมดสอบใหญ่ (รอบ 773) — สอบยาว 30/40/50 ข้อ ได้ "ใบประกาศแยกระดับ" คนละใบ
   เดิมทุกหมวดมีแค่สอบ 10 ข้อ = ใบเดียวจบ เด็กที่คล่องแล้วไม่มีเป้าต่อ
   ปลดล็อกไล่ขั้น: ต้น(ต้องผ่านสอบ 10 ข้อก่อน) → กลาง → สูง
   id หมวดสอบ = `badvx_<หมวด>_<ระดับ>` (คนละ id กับ `badv_<หมวด>` → certAward ออกใบใหม่ ไม่ทับใบเดิม)
   ต่อเข้าเครื่องยนต์เดิม startQuiz ตรง ๆ แค่ตั้ง quizCount (เกณฑ์ผ่าน 80% คิดจากจำนวนข้อใน finishQuiz)
   ============================================================ */
const BAND_ADV_EXAM = [
  {k:'found',  lv:'ต้น',   emoji:'📗', q:30, reward:1200},
  {k:'inter',  lv:'กลาง',  emoji:'📘', q:40, reward:2000},
  {k:'expert', lv:'สูง',   emoji:'📕', q:50, reward:3000},
];
function bandAdvExamId(id, k){ return 'badvx_' + id + '_' + k; }
/* ชื่อไทยของหมวดสอบ — cert.js อ่านชื่อนี้ (ทั้งของเราและของเพื่อนในฟีด) แยกระดับใบ ห้ามเปลี่ยนรูปแบบเล่น ๆ */
function bandAdvExamName(label, e){ return `${label} · สอบใหญ่ระดับ${e.lv}`; }

/* ล็อกไหม + เหตุผล (ระดับแรกต้องผ่านสอบ 10 ข้อของหมวดนั้นก่อน · ที่เหลือต้องผ่านระดับก่อนหน้า) */
function bandAdvExamLock(id, i){
  const passed = (typeof state !== 'undefined' && state.quizPassed) ? state.quizPassed : [];
  if(i === 0) return passed.includes('badv_' + id) ? null : 'ต้องสอบ 10 ข้อของหมวดนี้ให้ผ่านก่อนนะ 📝';
  const prev = BAND_ADV_EXAM[i-1];
  return passed.includes(bandAdvExamId(id, prev.k)) ? null : `ต้องผ่านสอบใหญ่ระดับ${prev.lv} (${prev.q} ข้อ) ก่อนนะ ${prev.emoji}`;
}
/* คะแนนสูงสุดที่เคยทำได้ของแต่ละระดับ (จาก state.quizLog) */
function bandAdvExamBest(id, k){
  const eid = bandAdvExamId(id, k);
  let b = null;
  ((typeof state !== 'undefined' && state.quizLog) || []).forEach(l=>{
    if(l && l.cat === eid && (!b || l.score > b.s)) b = {s:l.score, t:l.total};
  });
  return b;
}
function bandAdvExamCat(id, e, cat){
  return {id:bandAdvExamId(id, e.k), name:bandAdvExamName(cat.name, e), emoji:e.emoji,
          reward:e.reward, words:cat.words, quizCount:e.q};
}

/* แผงเลือกระดับสอบใหญ่ — เห็นครบทั้ง 3 ระดับในจอเดียว ไม่มี scrollbar (กฎทองข้อ 7) */
function bandAdvExamOpen(id){
  const m = (typeof BAND_ADV_MANIFEST !== 'undefined') ? BAND_ADV_MANIFEST[id] : null;
  if(!m) return;
  if(!__bandAdvLoading[id] && !__bandAdvCats[id]) toast('⏳ กำลังเปิดคลังศัพท์...');
  bandAdvLoad(id).then(cat=>{
    if(!cat || !cat.words.length){ toast(bandAdvFailMsg(id)); return; }
    const old = document.getElementById('bax-overlay');
    if(old) old.remove();
    const ov = document.createElement('div');
    ov.id = 'bax-overlay'; ov.className = 'pl-overlay';
    ov.innerHTML = `<div class="bax-box">
      <button class="pl-close" id="bax-close">✕</button>
      <div class="bax-head">🏅 สอบใหญ่ · ${m.emoji} ${escapeHTML(m.label)}
        <span class="bax-sub">ข้อสอบยาวจากทั้งคลัง ${fmtNum(cat.words.length)} คำ · ผ่าน 80% ขึ้นไป รับ <b>ใบประกาศแยกใบตามระดับ</b> 🎖️</span></div>
      <div class="bax-row">${BAND_ADV_EXAM.map((e, i)=>{
        const done = state.quizPassed.includes(bandAdvExamId(id, e.k));
        const lock = bandAdvExamLock(id, i);
        const few  = cat.words.length < e.q;            // คลังเล็กกว่าจำนวนข้อ = ยังเปิดระดับนี้ไม่ได้
        const best = bandAdvExamBest(id, e.k);
        const need = Math.ceil(e.q * 0.8);
        return `<button class="bax-lv${done ? ' done' : ''}${(lock || few) ? ' locked' : ''}" data-i="${i}">
          <span class="bax-emoji">${(lock || few) ? '🔒' : e.emoji}</span>
          <span class="bax-name">ระดับ${e.lv}</span>
          <span class="bax-q">${e.q} ข้อ</span>
          <span class="bax-need">ผ่านที่ ${need} ข้อขึ้นไป</span>
          <span class="bax-rw">${done ? '✅ ได้ใบประกาศแล้ว' : `🎁 ${fmtNum(e.reward)} 🪙`}</span>
          <span class="bax-best">${few ? `คลังต้องมี ${e.q} คำขึ้นไป`
            : lock ? escapeHTML(lock)
            : best ? `คะแนนสูงสุด ${best.s}/${best.t}` : 'ยังไม่เคยสอบระดับนี้'}</span>
        </button>`;
      }).join('')}</div>
      <div class="bax-foot">ข้อสอบสุ่มใหม่ทุกครั้งจากทั้งคลัง · สอบซ้ำได้ไม่จำกัด (คะแนนดีขึ้น = ใบประกาศอัปเดตเอง) · ทำไม่ทันกดปุ่ม ⬅️ ออกได้ตลอด</div>
    </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
    ov.querySelector('#bax-close').addEventListener('click', ()=>ov.remove());
    ov.querySelector('.bax-row').addEventListener('click', ev=>{
      const b = ev.target.closest('.bax-lv');
      if(!b) return;
      const i = Number(b.dataset.i), e = BAND_ADV_EXAM[i];
      if(cat.words.length < e.q){ toast(`คลังหมวดนี้มี ${fmtNum(cat.words.length)} คำ ยังสอบ ${e.q} ข้อไม่ได้นะ 😅`, 2600); return; }
      const lock = bandAdvExamLock(id, i);
      if(lock){ toast('🔒 ' + lock, 2600); return; }
      ov.remove();                      // ปิดแผงก่อน ไม่งั้นบังหน้าข้อสอบ
      startQuiz(bandAdvExamCat(id, e, cat));
    });
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
      // 🏅 รอบ 773: ผ่านสอบใหญ่ไปกี่ระดับแล้ว (ใบประกาศแยกใบต่อระดับ)
      const bigDone = BAND_ADV_EXAM.filter(e=>state.quizPassed.includes(bandAdvExamId(id, e.k)));
      return `<div class="cat-card band-card">
        <div class="cat-head">
          <span class="cat-emoji">${m.emoji}</span>
          <span class="cat-name">${escapeHTML(m.label)}</span>
          ${passed
            ? '<span class="cat-pass">✅ ผ่านแล้ว</span>'
            : `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 รางวัล ${BAND_ADV_REWARD} 🪙</span>`}
        </div>
        <div class="cat-info">${fmtNum(m.count)} คำ${bigDone.length
          ? ` · 🏅 สอบใหญ่ผ่านแล้ว ${bigDone.map(e=>e.emoji).join('')} ${bigDone.length}/${BAND_ADV_EXAM.length} ระดับ` : ''}</div>
        <div class="cat-btns">
          <button class="cat-btn practice" data-badv="${id}">🎮 ฝึกจับคู่</button>
          <button class="cat-btn quiz" data-badv="${id}">📝 สอบ 10 ข้อ</button>
          <button class="cat-btn bigexam" data-badv="${id}">🏅 สอบใหญ่ 30-50 ข้อ · ใบประกาศแยกระดับ</button>
        </div>
      </div>`;
    }).join('');
}
