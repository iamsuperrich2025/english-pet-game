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

/* ============================================================
   👑 โบนัสสูงสุด (รอบ 779) — สอบใหญ่ระดับ "สูง" (badvx_<หมวด>_expert) ผ่านครบทุกหมวดใน
   BAND_ADV_MANIFEST → ใบประกาศพิเศษ certAwardAdvSupreme (js/cert.js) + โบนัสเหรียญก้อนใหญ่
   เรียกจาก onPass ของ cat ระดับ 'expert' เท่านั้น (bandAdvExamCat ด้านล่าง) — กันเช็กซ้ำทุกระดับเปล่า ๆ
   ============================================================ */
const BAND_ADV_SUPREME_BONUS = 5000;   // มากกว่ารางวัลระดับสูงเดี่ยว (3000) เพราะต้องผ่านทุกหมวด
function bandAdvCheckSupreme(){
  if(typeof BAND_ADV_MANIFEST === 'undefined' || typeof state === 'undefined') return;
  if(state.bandAdvSupreme) return;
  const ids = Object.keys(BAND_ADV_MANIFEST);
  if(!ids.length || !ids.every(id=>state.quizPassed.includes(bandAdvExamId(id, 'expert')))) return;
  state.bandAdvSupreme = true;
  addCoins(BAND_ADV_SUPREME_BONUS);
  const cert = (typeof certAwardAdvSupreme === 'function') ? certAwardAdvSupreme(ids.length) : null;
  saveState();
  setTimeout(()=>alertBox(`<div style="font-size:56px;line-height:1">👑</div>
    <div style="font-size:21px;font-weight:bold;margin-top:8px;color:#7d5fc0">สุดยอดที่สุด! สอบใหญ่ระดับสูงผ่านครบทุกหมวดคลังศัพท์ขั้นสูงแล้ว</div>
    <div style="margin-top:8px;color:#6a5a78">ครบ ${ids.length} หมวด — รับโบนัสก้อนใหญ่ <b>+${fmtNum(BAND_ADV_SUPREME_BONUS)} 🪙</b>${cert ? '<br>👑 พร้อมใบประกาศ <b>Supreme</b> เก็บไว้ในโปรไฟล์แล้ว!' : ''}</div>`,
    'เย้! 🎉', cert ? {text:'ดูใบประกาศ 👑', onClick:()=>openCertBig(cert)} : null), 900);
}

/* ล็อกไหม + เหตุผล (ระดับแรกต้องผ่านสอบ 10 ข้อของหมวดนั้นก่อน · ที่เหลือต้องผ่านระดับก่อนหน้า) */
function bandAdvExamLock(id, i){
  const passed = (typeof state !== 'undefined' && state.quizPassed) ? state.quizPassed : [];
  if(i === 0) return passed.includes('badv_' + id) ? null : 'ต้องสอบ 10 ข้อของหมวดนี้ให้ผ่านก่อนนะ 📝';
  const prev = BAND_ADV_EXAM[i-1];
  return passed.includes(bandAdvExamId(id, prev.k)) ? null : `ต้องผ่านสอบใหญ่ระดับ${prev.lv} (${prev.q} ข้อ) ก่อนนะ ${prev.emoji}`;
}
/* คะแนนสูงสุด + ⏱️ เวลาของรอบที่ดีที่สุดในแต่ละระดับ
   เวลาเอาจาก "ใบประกาศ" (แหล่งเดียวกับที่ finishQuiz ใช้ตัดสินสถิติ) — ไม่หาเองจาก quizLog
   ไม่งั้นรอบที่รีบตอบจนคะแนนตกจะโชว์เป็นเวลาที่ดีที่สุด ทั้งที่ใบไม่ได้อัปเดต */
function bandAdvExamBest(id, k){
  const eid = bandAdvExamId(id, k);
  let b = null;
  ((typeof state !== 'undefined' && state.quizLog) || []).forEach(l=>{
    if(l && l.cat === eid && (!b || l.score > b.s)) b = {s:l.score, t:l.total};
  });
  if(b){
    const cert = (typeof state !== 'undefined' && Array.isArray(state.certs))
      ? state.certs.find(c=>c.id === eid) : null;
    b.sec = (cert && cert.sec) || 0;   // ⏱️ รอบ 777
  }
  return b;
}
function bandAdvExamCat(id, e, cat){
  return {id:bandAdvExamId(id, e.k), name:bandAdvExamName(cat.name, e), emoji:e.emoji,
          reward:e.reward, words:cat.words, quizCount:e.q, timed:true, examSummary:true,   // ⏱️ รอบ 777: จับเวลารวมทั้งชุด · 📝 รอบ 784: เด้งสรุปคำผิด
          // 📝 รอบ 784: เก็บคำที่ตอบผิดจาก quiz.results คู่กับ quiz.questions ไว้โชว์หลังปิดกล่องผลสอบ (bandAdvShowExamSummary)
          onFinish(){
            const wrong = [];
            quiz.questions.forEach((q, i)=>{ if(quiz.results[i] && !quiz.results[i].ok) wrong.push([q.en, q.correct]); });
            __advExamSummaryLast = {score:quiz.correct, total:quiz.questions.length, wrong};
          },
          // 👑 รอบ 779: ผ่านระดับ "สูง" ทุกครั้ง → เช็กว่าครบทุกหมวดหรือยัง (bandAdvCheckSupreme เช็ก dedupe เอง)
          onPass(){ if(e.k === 'expert' && typeof bandAdvCheckSupreme === 'function') bandAdvCheckSupreme(); }};
}

/* ---------- 📝 สรุปคำตอบผิดหลังสอบใหญ่ (รอบ 784): 30-50 ข้อไม่มีสรุป เด็กไม่รู้ว่าพลาดคำไหน
   เด้งหลังปิดกล่องผลสอบ ทุกครั้งไม่ว่าผ่านหรือไม่ผ่าน (แบบเดียวกับ bandShowRetakeSummary ใน dictband.js)
   แตะการ์ดคำ = ฟังเสียง — ใช้คลาส .rts-* ชุดเดียวกัน (สไตล์ generic พอ ไม่ผูกกับ retake) ---------- */
let __advExamSummaryLast = null;
function bandAdvShowExamSummary(){
  const r = __advExamSummaryLast;
  if(!r) return;
  __advExamSummaryLast = null;
  const ov = document.createElement('div');
  ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="rts-box">
    <button class="pl-close" id="axs-close">✕</button>
    <div class="rts-head">📝 สรุปผลสอบใหญ่ · ถูก ${r.score}/${r.total} ข้อ</div>
    ${r.wrong.length
      ? `<div class="rts-sub">📖 คำที่ตอบผิด ${r.wrong.length} คำ — ทบทวนก่อนสอบใหม่ (แตะคำเพื่อฟังเสียง 🔊)</div>
         <div class="rts-words">${r.wrong.map(w=>
           `<button class="rts-word" data-w="${escapeHTML(w[0])}"><b>${escapeHTML(w[0])}</b> — ${escapeHTML(w[1])}</button>`).join('')}</div>`
      : `<div class="rts-sub">🌟 ไม่มีคำตอบผิดเลย เก่งมาก!</div>`}
    <div class="rts-foot"><button class="rts-okbtn" id="axs-ok">เข้าใจแล้ว ไปต่อ!</button></div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#axs-close').addEventListener('click', ()=>ov.remove());
  ov.querySelector('#axs-ok').addEventListener('click', ()=>ov.remove());
  ov.addEventListener('click', e=>{
    const w = e.target.closest('.rts-word');
    if(w && typeof speakWord === 'function') speakWord(w.dataset.w);
  });
}

/* 🎓 รอบ 781: ป้ายความคืบหน้าเข็มนักสอบใหญ่ในหัวแผง (นิยามเข็มอยู่ js/game.js — ที่นี่แค่โชว์)
   บอกให้เด็กเห็นเป้าหมายตรงจุดที่กำลังจะกดสอบ ไม่ต้องเข้าไปดูตู้เข็มก่อน */
function bigExamBadgeNote(){
  if(typeof BIGEXAM_TIERS === 'undefined') return '';
  const n = bigExamCertCount();
  const next = BIGEXAM_TIERS.find(t=>n < t[0]);
  const cur = bigExamEmoji(state.bigExamBadge);
  return `<br>${cur || '🎓'} ใบสอบใหญ่สะสม <b>${n}</b> ใบ · `
    + (next ? `อีก <b>${next[0] - n}</b> ใบ = ${BIGEXAM_TIER_UI[next[1]]}` : 'ได้เข็มนักสอบใหญ่ครบทุกระดับแล้ว! 🏛️');
}

/* ============================================================
   🏁 กระดานอันดับ "สอบใหญ่เร็วที่สุด" (รอบ 786) — รายหมวด × รายระดับ
   ⚠️ ไม่เพิ่มโซนใน DB / ไม่ต้อง publish rules ใหม่ — ใช้ข้อมูลที่มีอยู่แล้ว 2 ทาง:
     ① เพื่อน = โพสต์ในฟีดรวม `Online.gfeed` (120 โพสต์ล่าสุดทั้งเกม · โพสต์เขียนโดย feedEvent
        รูปแบบ "สอบผ่านหมวด<หมวด> · สอบใหญ่ระดับ<x> <sc>/<tt> ข้อ ⏱️ m:ss 📝" — รอบ 777)
     ② ตัวเรา = ใบประกาศในเซฟ (state.certs ที่มี .big + .sec) → เห็นเวลาตัวเองเสมอ
        แม้โพสต์หลุด 120 โพสต์ล่าสุด หรือปิดเปิดเผยกิจกรรมไว้ (ข้อมูลไม่ได้ถูกส่งออกไปไหน)
   ⇒ เป็นกระดาน "จากกิจกรรมล่าสุด" ไม่ใช่สถิติตลอดกาล — เขียนบอกเด็กตรง ๆ ในหน้าจอ ห้ามอวดเกินจริง
   ============================================================ */
const BXR_TOP = 8;                    // โชว์กี่แถวต่อกระดาน (พอดีจอเตี้ยไม่ต้องเลื่อน)
const __BXR_POST_RE = /^สอบผ่านหมวด(.+?)\s*·\s*สอบใหญ่ระดับ(ต้น|กลาง|สูง)\s+(\d+)\s*\/\s*(\d+)\s*ข้อ\s*⏱️\s*(\d+):([0-5]\d)/;

/* ชื่อหมวดไทย → id (จากมานิเฟสต์ · ทำใหม่ทุกครั้ง ราคาถูกและรองรับหมวดที่เพิ่มมาใหม่) */
function bxrIdByLabel(label){
  if(typeof BAND_ADV_MANIFEST === 'undefined') return '';
  const th = String(label || '').trim();
  return Object.keys(BAND_ADV_MANIFEST).find(id=>BAND_ADV_MANIFEST[id].label === th) || '';
}
/* แถวอันดับของ (หมวด, ระดับ) — เร็วสุดก่อน · 1 คนต่อ 1 แถว (เก็บเวลาดีสุด) */
function bxRankRows(catId, lvKey){
  const e = BAND_ADV_EXAM.find(x=>x.k === lvKey);
  if(!e) return [];
  const by = {};                       // uid → แถว
  const put = (uid, row)=>{
    const old = by[uid];
    if(!old || row.sec < old.sec) by[uid] = Object.assign({}, old, row);
  };
  // ① จากฟีดรวม (เพื่อนทั้งเกม)
  const posts = (typeof Online !== 'undefined' && Array.isArray(Online.gfeed)) ? Online.gfeed : [];
  posts.forEach(p=>{
    if(!p || p.c !== 'quiz') return;
    const m = __BXR_POST_RE.exec(String(p.tx || '').trim());
    if(!m || m[2] !== e.lv || bxrIdByLabel(m[1]) !== catId) return;
    put(p.u, {uid:p.u, name:p.n || 'เพื่อน', g:p.g || '', sc:Number(m[3]), tt:Number(m[4]),
              sec:Number(m[5]) * 60 + Number(m[6]), ts:p.ts || 0});
  });
  // ② ของเราจากใบประกาศ (ทับของฟีดถ้าดีกว่า — ใบเก็บเวลาที่ดีที่สุดไว้อยู่แล้ว)
  const me = (typeof onlineKey === 'function') ? onlineKey() : 'me';
  const cert = (typeof state !== 'undefined' && Array.isArray(state.certs))
    ? state.certs.find(c=>c.id === bandAdvExamId(catId, lvKey) && c.sec) : null;
  if(cert){
    put(me, {uid:me, name:(typeof onlineDisplayName === 'function' ? onlineDisplayName() : '') || (state.student && state.student.name) || 'หนู',
             g:(state.student && state.student.grade) || '', sc:cert.sc, tt:cert.tt, sec:cert.sec, ts:cert.ts || 0});
  }
  return Object.keys(by).map(u=>{
    const r = by[u];
    r.me = (u === me);
    return r;
  }).sort((a, b)=>(a.sec - b.sec) || (b.sc / b.tt - a.sc / a.tt));
}

/* แถว HTML เดียว (ชื่อเล่น + สัญลักษณ์ระดับชั้นเสมอ — กฎคุ้มครองเด็ก ห้ามชื่อจริง) */
function bxrRowHTML(r, i){
  const nm = (typeof splitNameBadges === 'function') ? splitNameBadges(r.name) : {name:r.name, badges:''};
  const mark = (typeof gradeMark === 'function' && typeof gradeOf === 'function')
    ? gradeMark(gradeOf(r.uid, r.g)) : '';
  return `<div class="bxr-row${r.me ? ' me' : ''}">
    <span class="bxr-rk">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1)}</span>
    <span class="bxr-nm">${r.me ? '⭐ ' : ''}${escapeHTML(nm.name)}${mark}<small>${escapeHTML(nm.badges)}</small></span>
    <span class="bxr-sc">${r.sc}/${r.tt}</span>
    <span class="bxr-tm">⏱️ ${fmtMMSS(r.sec)}</span>
  </div>`;
}
/* เนื้อกระดาน (ใช้ทั้งในแผงของตัวเอง และแท็บ 🏁 ในกระดานเต็มจอ) */
function bxRankBodyHTML(catId, lvKey){
  const rows = bxRankRows(catId, lvKey);
  if(!rows.length){
    return `<div class="bxr-none">ยังไม่มีใครทำเวลาระดับนี้ในกิจกรรมล่าสุดเลย — สอบผ่านคนแรกแล้วขึ้นกระดานเลย! 🏁</div>`;
  }
  const top = rows.slice(0, BXR_TOP);
  const meAt = rows.findIndex(r=>r.me);
  return top.map(bxrRowHTML).join('')
    + (meAt >= BXR_TOP ? `<div class="bxr-more">…</div>${bxrRowHTML(rows[meAt], meAt)}` : '');
}

/* 🏁 ตัวกระดาน (ชิปเลือกหมวด/ระดับ + รายชื่อ) — วาดลงกล่องไหนก็ได้ วาดใหม่เองเมื่อกดชิป
   ใช้ 2 ที่: แผงป๊อปอัปจากปุ่มในแผงสอบใหญ่ · แท็บ 🏁 ในกระดานอันดับเต็มจอ (js/ui.js) */
let __bxrCat = '', __bxrLv = 'found';
function bxRankMount(box, catId){
  if(!box || typeof BAND_ADV_MANIFEST === 'undefined') return;
  const ids = Object.keys(BAND_ADV_MANIFEST);
  if(!ids.length) return;
  __bxrCat = (catId && BAND_ADV_MANIFEST[catId]) ? catId : (BAND_ADV_MANIFEST[__bxrCat] ? __bxrCat : ids[0]);
  const draw = ()=>{
    const m = BAND_ADV_MANIFEST[__bxrCat];
    box.innerHTML = `
      <div class="bxr-pick">
        <div class="bxr-cats">${ids.map(id=>`<button class="bxr-chip${id === __bxrCat ? ' on' : ''}" data-cat="${id}">${BAND_ADV_MANIFEST[id].emoji} ${escapeHTML(BAND_ADV_MANIFEST[id].label)}</button>`).join('')}</div>
        <div class="bxr-lvs">${BAND_ADV_EXAM.map(e=>`<button class="bxr-chip lv${e.k === __bxrLv ? ' on' : ''}" data-lv="${e.k}">${e.emoji} ระดับ${e.lv} · ${e.q} ข้อ</button>`).join('')}</div>
      </div>
      <div class="bxr-list">${bxRankBodyHTML(__bxrCat, __bxrLv)}</div>
      <div class="bxr-foot">${m.emoji} ${escapeHTML(m.label)} · เวลาบนกระดาน = เวลาที่ดีที่สุดของแต่ละคน (ตัวเดียวกับที่พิมพ์บนใบประกาศ)</div>`;
    box.querySelector('.bxr-pick').addEventListener('click', ev=>{
      const b = ev.target.closest('.bxr-chip');
      if(!b) return;
      if(b.dataset.cat) __bxrCat = b.dataset.cat; else if(b.dataset.lv) __bxrLv = b.dataset.lv;
      if(typeof sfx !== 'undefined' && sfx.click) sfx.click();
      draw();
    });
  };
  draw();
}
/* คำอธิบายแหล่งข้อมูล — ต้องบอกตรง ๆ ว่าไม่ใช่อันดับตลอดกาล (ใช้ทั้ง 2 ทางเข้า) */
function bxRankNote(){
  return (typeof Online !== 'undefined' && Online.ready)
    ? 'จากกิจกรรมล่าสุดในฟีดรวม + สถิติของหนูเอง (ไม่ใช่อันดับตลอดกาล) · ต้องสอบผ่านถึงขึ้นกระดาน'
    : '📴 ตอนนี้ออฟไลน์ — เห็นเฉพาะสถิติของหนูเอง ต่อเน็ตแล้วจะเห็นของเพื่อนด้วย';
}
/* แผงป๊อปอัป (เปิดจากปุ่ม 🏁 ในแผงเลือกระดับสอบใหญ่) */
function openBigExamRank(catId){
  const old = document.getElementById('bxr-overlay');
  if(old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'bxr-overlay'; ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="bxr-box">
      <button class="pl-close" id="bxr-close">✕</button>
      <div class="bxr-head">🏁 สอบใหญ่เร็วที่สุด<span class="bxr-sub">${bxRankNote()}</span></div>
      <div class="bxr-body"></div>
    </div>`;
  document.body.appendChild(ov);
  bxRankMount(ov.querySelector('.bxr-body'), catId);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#bxr-close').addEventListener('click', ()=>ov.remove());
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
        <button class="bax-rank" id="bax-rank">🏁 อันดับเร็วที่สุด</button>
        <span class="bax-sub">ข้อสอบยาวจากทั้งคลัง ${fmtNum(cat.words.length)} คำ · ผ่าน 80% ขึ้นไป รับ <b>ใบประกาศแยกใบตามระดับ</b> 🎖️
          ${bigExamBadgeNote()}</span></div>
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
            : best ? `คะแนนสูงสุด ${best.s}/${best.t}${best.sec ? ` · ⏱️ ${fmtMMSS(best.sec)}` : ''}` : 'ยังไม่เคยสอบระดับนี้'}</span>
        </button>`;
      }).join('')}</div>
      <div class="bax-foot">ข้อสอบสุ่มใหม่ทุกครั้งจากทั้งคลัง · ⏱️ จับเวลารวมไว้ให้ (ไม่มีหมดเวลา แค่ไว้ทำลายสถิติตัวเอง — เวลาขึ้นบนใบประกาศด้วย) · สอบซ้ำได้ไม่จำกัด คะแนนดีขึ้นหรือทำเวลาดีขึ้น = ใบอัปเดตเอง</div>
    </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
    ov.querySelector('#bax-close').addEventListener('click', ()=>ov.remove());
    // 🏁 รอบ 786: กระดานเร็วที่สุดของหมวดนี้ (ไม่ปิดแผงสอบ — กดปิดกระดานแล้วเลือกระดับต่อได้เลย)
    ov.querySelector('#bax-rank').addEventListener('click', ()=>openBigExamRank(id));
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
  // 👑 รอบ 779: แถบสรุปความคืบหน้าสู่ใบ Supreme (ครบทุกหมวด × สอบใหญ่ระดับสูง)
  const advIds = Object.keys(BAND_ADV_MANIFEST);
  const expertDone = advIds.filter(id=>state.quizPassed.includes(bandAdvExamId(id, 'expert'))).length;
  return `<div class="band-sec-head">🎓 คลังศัพท์ขั้นสูง
      <small>${state.bandAdvSupreme
        ? '👑 สอบใหญ่ระดับสูงผ่านครบทุกหมวดแล้ว — ได้ใบประกาศ Supreme + โบนัสก้อนใหญ่!'
        : `ศัพท์เฉพาะทางแยกหมวด เปิดเล่นได้ทุกคน ไม่ผูกชั้นเรียน · 🏅 ระดับสูงผ่านแล้ว ${expertDone}/${advIds.length} หมวด`}</small></div>`
    + advIds.map(id=>{
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
