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
const BAND_SET_REWARD  = 100;         // รางวัลสอบผ่านครั้งแรกของแต่ละชุด
const BAND_DONE_BONUS  = 500;         // โบนัสครั้งเดียวเมื่อผ่านครบทุกชุดของระดับ
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
   ⚠️ ต้อง deterministic: ชิ้นไฟล์โหลด async ลำดับไม่แน่นอน → รวมทุก entry แล้ว "เรียง a-z ก่อน"
   ค่อยกันซ้ำ (en/แปลไทย) — ไม่งั้นชุดข้อสอบตายตัวจะสลับคำทุกครั้งที่เปิดเกม */
function bandCat(b){
  if(__bandCats[b]) return __bandCats[b];
  const m = DICT_BAND_MANIFEST[b];
  const all = [];
  DICT_BAND.forEach(ch=>{ if(Number(ch.band) === Number(b)) all.push(...ch.words); });
  all.sort((x,y)=>String(x[0]).toLowerCase() < String(y[0]).toLowerCase() ? -1 : 1);
  const seenEn = new Set(), seenTh = new Set(), words = [], meta = {};
  all.forEach(e=>{
    const en = String(e[0]).trim().toLowerCase();   // normalize ตัวเล็กเสมอ (กฎถาวร — ไม่ทำ = เทียบคำตอบพลาด)
    const th = bandShortTH(e[5]);
    if(!en || !th || seenEn.has(en) || seenTh.has(th)) return;
    seenEn.add(en); seenTh.add(th);
    words.push([en, th]);
    meta[en] = {pos:e[1], ipa:e[2], pron:e[3], def:e[4], ex:e[6], exTh:e[7]};
  });
  __bandCats[b] = {id:'band'+b, band:Number(b), name:`คลังศัพท์ ${m.label}`,
                   emoji:BAND_EMOJI[b] || '📖', reward:BAND_SET_REWARD, words, dictMeta:meta};
  return __bandCats[b];
}

/* ---------- ข้อสอบแบ่งชุดตายตัว: ชุดละ 10 คำ · เศษท้ายรวมเข้าชุดสุดท้าย (ชุดท้าย ≤19 คำ)
   เช่น 925 คำ → 91 ชุด×10 + ชุดที่ 92 = 15 คำ ---------- */
function bandSets(words){
  const sets = [];
  const full = Math.floor(words.length / 10), rem = words.length % 10;
  const n = (rem > 0 && full > 0) ? full : (full || 1);   // เศษ<10 รวมเข้าชุดสุดท้าย
  for(let i = 0; i < n; i++){
    sets.push(words.slice(i*10, i === n-1 ? words.length : (i+1)*10));
  }
  return sets;
}
function bandSetId(b, i){ return `band${b}s${i+1}`; }

/* ผ่านครบทุกชุดของระดับ → โบนัสครั้งเดียว (เรียกได้ทั้งจากสอบชุดปกติและสอบซ่อมรวม) */
function bandCheckComplete(b){
  const cat = bandCat(b), sets = bandSets(cat.words);
  const allDone = sets.every((_, k)=>state.quizPassed.includes(bandSetId(b, k)));
  state.bandComplete = state.bandComplete || {};
  if(!allDone || state.bandComplete[b]) return;
  state.bandComplete[b] = true;
  addCoins(BAND_DONE_BONUS);
  saveState();
  setTimeout(()=>alertBox(`<div style="font-size:56px;line-height:1">🏆</div>
    <div style="font-size:21px;font-weight:bold;margin-top:8px;color:#7d5fc0">สุดยอด! ผ่านครบทุกชุดของระดับ ${DICT_BAND_MANIFEST[b].label}</div>
    <div style="margin-top:8px;color:#6a5a78">ทั้งหมด ${sets.length} ชุด ${fmtNum(cat.words.length)} คำ — รับโบนัสพิเศษ <b>+${BAND_DONE_BONUS} 🪙</b></div>`, 'เย้! 🎉'), 900);
}

/* หมวดเสมือนของ "ชุดที่ i" — สอบทุกคำในชุด (10-19 ข้อ) ตัวลวงสุ่มจากทั้ง band */
function bandSetCat(b, i){
  const cat = bandCat(b), sets = bandSets(cat.words), set = sets[i];
  return {id:bandSetId(b, i), band:Number(b), setIdx:i, setTotal:sets.length,
    name:`${DICT_BAND_MANIFEST[b].label} ชุดที่ ${i+1}`, emoji:BAND_EMOJI[b] || '📖',
    reward:BAND_SET_REWARD, words:set, quizCount:set.length,
    distractPool:cat.words, dictMeta:cat.dictMeta,
    onPass(){ bandCheckComplete(b); }};
}

/* ---------- 🔁 สอบซ่อมรวม (รอบ 270): รวบคำจากชุดสีส้ม (เคยสอบยังไม่ผ่าน) มาสอบรอบเดียว
   หยิบชุดคะแนนต่ำสุดก่อน สูงสุด 3 ชุด/รอบ · ตัดเกรด "รายชุด" — ชุดไหนตอบถูก ≥80%
   ของคำชุดนั้นถึงเคลียร์ (+รางวัลชุดละ ${BAND_SET_REWARD}) ชุดที่ไม่ถึงยังส้มอยู่ สอบซ่อมต่อได้ ---------- */
const BAND_RETAKE_MAX = 3;
function bandTriedSets(b){
  const cat = bandCat(b), sets = bandSets(cat.words), out = [];
  sets.forEach((s, i)=>{
    if(state.quizPassed.includes(bandSetId(b, i))) return;
    let bs = null;
    state.quizLog.forEach(l=>{ if(l.cat === bandSetId(b, i) && (bs === null || l.score > bs)) bs = l.score; });
    if(bs !== null) out.push({i, s, bs});
  });
  out.sort((x, y)=>x.bs - y.bs);   // คะแนนต่ำสุดก่อน = ชุดที่ต้องซ่อมด่วนสุด
  return out;
}
function bandRetakeCat(b){
  const cat = bandCat(b);
  const pick = bandTriedSets(b).slice(0, BAND_RETAKE_MAX);
  if(!pick.length) return null;
  const words = pick.flatMap(t=>t.s);
  return {id:`band${b}retake`, band:Number(b), retakeSets:pick.map(t=>t.i),
    name:`${DICT_BAND_MANIFEST[b].label} สอบซ่อม ${pick.length} ชุด`, emoji:'🔁',
    reward:0, words, quizCount:words.length, distractPool:cat.words, dictMeta:cat.dictMeta,
    onFinish(){   // เรียกจาก finishQuiz — ตัดเกรดรายชุดจากผลรายข้อ (quiz.results)
      const okByEn = {};
      (quiz.results || []).forEach(r=>{ okByEn[r.en] = r.ok; });
      let cleared = 0, coins = 0;
      pick.forEach(t=>{
        const okN = t.s.filter(w=>okByEn[w[0]]).length;
        const passSet = okN >= Math.ceil(t.s.length * 0.8);
        state.quizLog.push({cat:bandSetId(b, t.i), score:okN, total:t.s.length, passed:passSet, ts:Date.now()});
        if(passSet && !state.quizPassed.includes(bandSetId(b, t.i))){
          state.quizPassed.push(bandSetId(b, t.i));
          cleared++; coins += BAND_SET_REWARD;
        }
      });
      if(coins) addCoins(coins);
      saveState();
      if(cleared){
        bandCheckComplete(b);
        setTimeout(()=>toast(`🔁 สอบซ่อมสำเร็จ! เคลียร์ ${cleared} ชุด +${fmtNum(coins)} 🪙`, 3200), 800);
      }else{
        setTimeout(()=>toast('🔁 ยังไม่มีชุดไหนถึง 80% — ดูเฉลยแล้วลองใหม่อีกครั้งนะ 💪', 3000), 800);
      }
    }};
}

function bandSetsPassed(b, total){
  let k = 0;
  for(let i = 0; i < total; i++) if(state.quizPassed.includes(bandSetId(b, i))) k++;
  return k;
}

/* แผงเลือกชุดข้อสอบ — เห็นครบทุกชุดในจอเดียว ไม่มี scrollbar (กฎถาวรข้อ 7)
   คำนวณจำนวนคอลัมน์จากสัดส่วนพื้นที่จริง ชิปหดตามจอ */
function openBandSetPicker(b){
  if(!bandUnlocked(b)){ bandLockToast(b); return; }
  if(!__bandLoading[b]) toast('⏳ กำลังเปิดคลังศัพท์...');
  bandLoad(b).then(()=>{
    const cat = bandCat(b);
    if(!cat.words.length){ toast('โหลดคลังศัพท์ไม่สำเร็จ ลองใหม่อีกครั้งนะ 😅'); return; }
    const sets = bandSets(cat.words);
    const passedN = bandSetsPassed(b, sets.length);
    let ov = document.getElementById('bsp-overlay');
    if(ov) ov.remove();
    ov = document.createElement('div');
    ov.id = 'bsp-overlay'; ov.className = 'pl-overlay';
    // รอบ 269: คะแนนสูงสุดที่เคยสอบของแต่ละชุด (จาก state.quizLog) — โชว์บนชิป
    const best = {};   // setIdx → {s:คะแนนสูงสุด, t:จำนวนข้อ}
    state.quizLog.forEach(l=>{
      const m = /^band(\d+)s(\d+)$/.exec(l.cat || '');
      if(!m || Number(m[1]) !== Number(b)) return;
      const i = Number(m[2]) - 1;
      if(!best[i] || l.score > best[i].s) best[i] = {s:l.score, t:l.total};
    });
    // 🔁 สอบซ่อมรวม: โชว์ปุ่มเมื่อมีชุดสีส้ม ≥2 (ชุดเดียวแตะชิปตรงๆ ง่ายกว่า)
    const tried = bandTriedSets(b);
    const rN = Math.min(tried.length, BAND_RETAKE_MAX);
    const rW = tried.slice(0, rN).reduce((a, t)=>a + t.s.length, 0);
    let nextMarked = false;
    ov.innerHTML = `<div class="bsp-box">
      <button class="pl-close" id="bsp-close">✕</button>
      <div class="bsp-head">${cat.emoji} ข้อสอบ ${DICT_BAND_MANIFEST[b].label} · ${sets.length} ชุด
        <span class="bsp-prog">ผ่านแล้ว ${passedN}/${sets.length} ชุด</span>
        ${tried.length >= 2 ? `<button class="bsp-retake" id="bsp-retake">🔁 สอบซ่อมรวม ${rN} ชุด (${rW} ข้อ)</button>` : ''}</div>
      <div class="bsp-grid" id="bsp-grid">${sets.map((s, i)=>{
        const done = state.quizPassed.includes(bandSetId(b, i));
        const bs = best[i];
        const tried = !done && bs;   // 🧡 เคยสอบแต่ยังไม่ผ่าน = ชุดที่ควรกลับไปสอบซ่อม
        const next = !done && !nextMarked ? (nextMarked = true, ' next') : '';
        return `<button class="bsp-chip${done ? ' done' : ''}${tried ? ' tried' : ''}${next}" data-i="${i}"
          title="ชุดที่ ${i+1} · ${s.length} ข้อ${bs ? ` · คะแนนสูงสุด ${bs.s}/${bs.t}` : ''}">
          <span class="bsp-num">${i+1}</span>${done ? '<span class="bsp-tick">✓</span>' : ''}${bs ? `<span class="bsp-best">${bs.s}/${bs.t}</span>` : ''}</button>`;
      }).join('')}</div>
      <div class="bsp-foot">ชุดละ 10 ข้อ (ชุดสุดท้าย ${sets[sets.length-1].length} ข้อ) · ผ่าน = ตอบถูก 80% ขึ้นไป · 🧡 ส้ม = เคยสอบยังไม่ผ่าน ลองซ่อมดูนะ · ผ่านครั้งแรกรับ ${BAND_SET_REWARD} 🪙 · ครบทุกชุดโบนัส ${BAND_DONE_BONUS} 🪙</div>
    </div>`;
    document.body.appendChild(ov);
    // จัดคอลัมน์ให้ชิปทั้งหมดพอดีพื้นที่ ไม่ต้องเลื่อน
    const grid = ov.querySelector('#bsp-grid');
    const fit = ()=>{
      const r = grid.getBoundingClientRect();
      const cols = Math.max(5, Math.ceil(Math.sqrt(sets.length * (r.width / Math.max(r.height, 80)))));
      grid.style.setProperty('--bsp-cols', cols);
      grid.style.setProperty('--bsp-rows', Math.ceil(sets.length / cols));
    };
    fit();
    ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
    ov.querySelector('#bsp-close').addEventListener('click', ()=>ov.remove());
    const rBtn = ov.querySelector('#bsp-retake');
    if(rBtn) rBtn.addEventListener('click', ()=>{
      const rc = bandRetakeCat(b);
      if(!rc) return;
      ov.remove();
      startQuiz(rc);
    });
    grid.addEventListener('click', e=>{
      const c = e.target.closest('.bsp-chip');
      if(!c) return;
      ov.remove();                      // ปิดแผงก่อน ไม่งั้นบังหน้าข้อสอบ
      startQuiz(bandSetCat(b, Number(c.dataset.i)));
    });
  });
}

/* ---------- ปลดล็อกระดับ (รอบ 267): ระดับ ≤ ชั้นเรียนตัวเอง = เปิดเสมอ
   ระดับสูงกว่า = ต้องสอบผ่านครบทุกชุดของระดับก่อนหน้า (state.bandComplete) ---------- */
function bandMine(){ return gradeBand(state.student ? state.student.grade : 'ป.1').band; }
function bandUnlocked(b){
  b = Number(b);
  if(b <= bandMine()) return true;
  return !!(state.bandComplete && state.bandComplete[b-1]);
}
function bandLockToast(b){
  const prev = DICT_BAND_MANIFEST[Number(b)-1];
  toast(`🔒 ระดับนี้ยังไม่ปลดล็อก — สอบผ่านครบทุกชุดของระดับ ${prev ? prev.label : 'ก่อนหน้า'} ก่อนนะ`, 2600);
}

/* ปุ่ม "📝 สอบเลื่อนขั้น" หน้า lobby → เปิดแผงชุดข้อสอบของระดับตัวเองทันที */
function bandExamLobby(){
  if(typeof DICT_BAND_MANIFEST === 'undefined'){ toast('ยังเปิดคลังข้อสอบไม่ได้ ลองใหม่อีกครั้งนะ 😅'); return; }
  openBandSetPicker(bandMine());
}

/* ---------- ป้ายความคืบหน้าใต้ปุ่มสอบเลื่อนขั้น (รอบ 268): "ผ่านแล้ว k/n ชุด" ----------
   n ต้องรู้จำนวนคำจริงหลัง dedupe → พรีโหลดคลังระดับตัวเองเบื้องหลัง (ครั้งเดียว
   หลังเข้า lobby 2.5 วิ — ไฟล์เล็ก + SW cache ให้ · กดปุ่มส้ม/ปุ่มม่วงครั้งแรกก็ไวขึ้นด้วย) */
let __bandPreloadTimer = null;
function updateBandExamBtn(){
  const btn = document.getElementById('btn-band-exam');
  if(!btn || typeof DICT_BAND_MANIFEST === 'undefined' || !state.student) return;
  const b = bandMine();
  const done = state.quizPassed.filter(id=>new RegExp(`^band${b}s\\d+$`).test(id)).length;
  let sub;
  if(__bandCats[b]){
    const total = bandSets(__bandCats[b].words).length;
    sub = (state.bandComplete && state.bandComplete[b])
      ? `🏆 ครบ ${total} ชุดแล้ว!`
      : `ผ่านแล้ว ${done}/${total} ชุด`;
  }else{
    sub = done ? `ผ่านแล้ว ${done} ชุด` : `ระดับ ${DICT_BAND_MANIFEST[b].label}`;
  }
  btn.innerHTML = `📝 สอบเลื่อนขั้น <span class="exam-sub">${escapeHTML(sub)}</span>`;
}
/* เรียกจาก renderDashboard (ui.js) — อัปเดตป้ายปุ่ม + ป้ายออฟไลน์ + ตั้งพรีโหลดครั้งเดียว */
function bandLobbyTick(){
  updateBandExamBtn();
  if(typeof updateOfflinePill === 'function') updateOfflinePill();
  if(__bandPreloadTimer || typeof DICT_BAND_MANIFEST === 'undefined' || !state.student) return;
  __bandPreloadTimer = setTimeout(()=>{
    const b = bandMine();
    bandLoad(b).then(()=>{ bandCat(b); updateBandExamBtn(); });
  }, 2500);
}

/* ปุ่มบนการ์ด band → จับคู่ = โหลดแล้วเข้าเกมทั้งคลัง · สอบ = เปิดแผงเลือกชุด */
function bandPlay(b, mode){
  if(!bandUnlocked(b)){ bandLockToast(b); return; }
  if(mode === 'quiz'){ openBandSetPicker(b); return; }
  if(!__bandLoading[b]) toast('⏳ กำลังเปิดคลังศัพท์...');
  bandLoad(b).then(()=>{
    const cat = bandCat(b);
    if(!cat.words.length){ toast('โหลดคลังศัพท์ไม่สำเร็จ ลองใหม่อีกครั้งนะ 😅'); return; }
    startGame(cat);
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
  const myBand = bandMine();
  return `<div class="band-sec-head">📖 คลังศัพท์ใหญ่ตามระดับ
      <small>ศัพท์เยอะจุใจทุกระดับ · ข้อสอบมีคำอ่าน + เฉลยประโยคตัวอย่าง · ผ่านครบทุกชุด = ปลดล็อกระดับถัดไป</small></div>`
    + Object.keys(DICT_BAND_MANIFEST).map(b=>{
      const m = DICT_BAND_MANIFEST[b];
      const setsDone = state.quizPassed.filter(id=>new RegExp(`^band${b}s\\d+$`).test(id)).length;
      const complete = state.bandComplete && state.bandComplete[b];
      const mine = Number(b) === myBand;
      const open = bandUnlocked(b);
      const prev = DICT_BAND_MANIFEST[Number(b)-1];
      return `<div class="cat-card band-card${mine ? ' mine' : ''}${open ? '' : ' locked'}">
        <div class="cat-head">
          <span class="cat-emoji">${open ? (BAND_EMOJI[b] || '📖') : '🔒'}</span>
          <span class="cat-name">ระดับ ${m.label}${mine ? ' <span class="band-mine-tag">⭐ ระดับของหนู</span>' : ''}</span>
          ${complete
            ? '<span class="cat-pass">🏆 ครบทุกชุด</span>'
            : open
              ? `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 ชุดละ ${BAND_SET_REWARD} 🪙</span>`
              : '<span class="cat-pass" style="background:#eee6f6;color:#9a8aac;border-color:#d9c9ef">🔒 ยังไม่ปลดล็อก</span>'}
        </div>
        <div class="cat-info">${fmtNum(m.count)} คำ แบ่งสอบชุดละ 10 ข้อ${setsDone ? ` · ✅ ผ่านแล้ว ${setsDone} ชุด` : ''}</div>
        ${open
          ? `<div class="cat-btns">
              <button class="cat-btn practice" data-band="${b}">🎮 ฝึกจับคู่</button>
              <button class="cat-btn quiz" data-band="${b}">📝 สอบเป็นชุด</button>
            </div>`
          : `<div class="band-lock">🔒 สอบผ่านครบทุกชุดของระดับ ${prev ? prev.label : 'ก่อนหน้า'} ก่อน จะปลดล็อกระดับนี้</div>`}
      </div>`;
    }).join('');
}
