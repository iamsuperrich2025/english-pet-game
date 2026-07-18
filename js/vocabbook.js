"use strict";
/* ============================================================
   📒 สมุดคำศัพท์ของฉัน + ข้อสอบทบทวนส่วนตัว (รอบ 288)
   เก็บทุกคำที่เด็กเจอในเกมจับคู่/ข้อสอบทุกแบบ (รวม band) ลง state.vocabBook
   ถาวรข้ามเซสชัน: {en: {th, c:ถูกกี่ครั้ง, w:ผิดกี่ครั้ง, t:เจอล่าสุด, lw:ครั้งล่าสุดผิด?}}
   แบ่ง 3 กลุ่ม: 💪 ต้องทบทวน (ครั้งล่าสุดผิด/ผิดมากกว่าถูก) · 🌱 กำลังเรียนรู้ · ⭐ แม่นแล้ว
   ข้อสอบทบทวน = หยิบคำอ่อนของตัวเอง ≤10 คำ เข้าเครื่องยนต์ startQuiz เดิม
   จุดเข้า: ปุ่ม 📒 ท้ายแถบ lobby + การ์ดบนหน้าหมวดคำศัพท์
   ============================================================ */

const VB_MAX = 500;                  // เพดานจำนวนคำในสมุด — เกินแล้วตัดคำ ⭐ ที่เก่าสุดก่อน (กันเซฟบวม)
const VB_QUIZ_N = 10;                // ข้อสอบทบทวนสูงสุดกี่ข้อ/รอบ
const VB_QUIZ_MIN = 4;               // มีคำในสมุดอย่างน้อยกี่คำถึงเปิดสอบทบทวนได้

/* กลุ่มของคำ: 'review'=ต้องทบทวน · 'master'=แม่นแล้ว · 'learn'=กำลังเรียนรู้ */
function vbGroup(e){
  if(e.lw || e.w > e.c) return 'review';
  if(e.c >= 3 && e.c > e.w) return 'master';
  return 'learn';
}
const VB_GROUP_UI = {review:['💪','ต้องทบทวน'], learn:['🌱','กำลังเรียนรู้'], master:['⭐','แม่นแล้ว']};

/* บันทึกผล 1 คำ (เรียกจาก game.js ทั้งเกมจับคู่และข้อสอบ) — ไม่ saveState เอง (จุดเรียกเซฟอยู่แล้ว) */
function vbRecord(en, th, ok){
  en = String(en || '').trim().toLowerCase();     // normalize ตัวเล็กเสมอ (กฎถาวร band)
  th = String(th || '').trim();
  if(!en || !th || typeof state === 'undefined' || !state) return;
  const b = state.vocabBook || (state.vocabBook = {});
  const e = b[en] || (b[en] = {th, c:0, w:0, t:0, lw:0});
  e.th = th;                                      // อัปเดตคำแปลล่าสุด (band อาจตัดสั้นต่างรุ่น)
  if(ok) e.c++; else e.w++;
  e.lw = ok ? 0 : 1;
  e.t = Date.now();
  const keys = Object.keys(b);
  if(keys.length > VB_MAX){                       // ล้น: ตัดคำ ⭐ แม่นแล้วที่เก่าสุดก่อน ค่อยไล่ตามเก่าสุด
    keys.sort((x, y)=>{
      const gx = vbGroup(b[x]) === 'master' ? 0 : 1, gy = vbGroup(b[y]) === 'master' ? 0 : 1;
      return gx !== gy ? gx - gy : b[x].t - b[y].t;
    });
    keys.slice(0, keys.length - VB_MAX).forEach(k=>delete b[k]);
  }
}

/* 📖 รอบ 329: "เคยอ่านคำนี้" — เก็บคำที่เด็กกดอ่านจากแถบ 🆕 New Word เข้าสมุดอัตโนมัติ
   ต่างจาก vbRecord: ไม่ใช่การตอบถูก/ผิด จึงไม่แตะ c/w → คำใหม่จะอยู่กลุ่ม 🌱 กำลังเรียนรู้
   (vbGroup: c=0,w=0,lw=0 → 'learn') และถูกหยิบเข้าข้อสอบทบทวนก่อนใคร เพราะเรียงจาก "ฝึกน้อยสุด"
   คำที่เคยตอบมาแล้วจะไม่ถูกรีเซ็ตสถิติ — แค่ขยับเวลาเจอล่าสุด
   คืน true ถ้าเป็นคำใหม่ที่เพิ่งเข้าสมุด (ผู้เรียกเอาไปแจ้งเด็กได้) */
function vbSeen(en, th){
  en = String(en || '').trim().toLowerCase();
  th = String(th || '').trim();
  if(!en || typeof state === 'undefined' || !state) return false;
  const b = state.vocabBook || (state.vocabBook = {});
  const fresh = !b[en];
  const e = b[en] || (b[en] = {th, c:0, w:0, t:0, lw:0});
  if(th) e.th = th;
  e.t = Date.now();
  return fresh;
}

/* นับจำนวนคำแต่ละกลุ่ม → {review, learn, master, total} */
function vbStats(){
  const b = (typeof state !== 'undefined' && state && state.vocabBook) || {};
  const s = {review:0, learn:0, master:0, total:0};
  for(const k in b){ s[vbGroup(b[k])]++; s.total++; }
  return s;
}

/* รายการคำตาม filter ('all'/'review'/'learn'/'master') — 💪 ก่อน 🌱 ก่อน ⭐ · ในกลุ่มเรียงเจอล่าสุดก่อน */
function vbList(filter){
  const b = (typeof state !== 'undefined' && state && state.vocabBook) || {};
  const ord = {review:0, learn:1, master:2};
  return Object.keys(b)
    .map(en=>({en, ...b[en], g:vbGroup(b[en])}))
    .filter(e=>filter === 'all' || e.g === filter)
    .sort((x, y)=>ord[x.g] !== ord[y.g] ? ord[x.g] - ord[y.g] : y.t - x.t);
}

/* ---------- 📝 ข้อสอบทบทวนส่วนตัว: คำอ่อนก่อน (ผิดเยอะสุดก่อน) เติมด้วยคำฝึกน้อย ----------
   ตัวลวงจากทั้งสมุด + คลังตามชั้นเรียน (กันสมุดเล็กช้อยส์ซ้ำ) · ต่อเข้า startQuiz เดิม */
function vbReviewCat(){
  const b = (typeof state !== 'undefined' && state && state.vocabBook) || {};
  const all = Object.keys(b).map(en=>({en, ...b[en], g:vbGroup(b[en])}));
  if(all.length < VB_QUIZ_MIN) return null;
  const weak = all.filter(e=>e.g === 'review').sort((x, y)=>(y.w - y.c) - (x.w - x.c) || x.t - y.t);
  const rest = all.filter(e=>e.g !== 'review').sort((x, y)=>x.c - y.c || x.t - y.t);   // ฝึกน้อยสุดก่อน
  const pick = weak.concat(rest).slice(0, VB_QUIZ_N);
  const words = pick.map(e=>[e.en, e.th]);
  const pool = all.map(e=>[e.en, e.th])
    .concat(typeof vocabForStudent === 'function' ? vocabForStudent() : []);
  return {id:'vbreview', vbook:true, name:'ทบทวนคำของหนู', emoji:'📒', reward:50,
          words, quizCount:words.length, distractPool:pool,
          onFinish(){ if(typeof questEvent === 'function') questEvent('vbquiz'); }};   // 🎯 ภารกิจ 📒: สอบทบทวนจบ 1 รอบ (ไม่ต้องผ่าน — นับความพยายาม)
}
function vbStartReview(){
  const cat = vbReviewCat();
  if(!cat){ toast(`📒 ยังมีคำในสมุดไม่ถึง ${VB_QUIZ_MIN} คำ — ไปเล่นเกม/ทำข้อสอบเก็บคำก่อนนะ`, 2800); return; }
  const ov = document.getElementById('vb-overlay');
  if(ov) ov.remove();                             // ปิดสมุดก่อน ไม่งั้นบังหน้าข้อสอบ
  startQuiz(cat);
}

/* ---------- 📒 หน้าสมุด — กล่องขาวเต็มจอแบบ bsp-box · ไม่มี scrollbar (กฎข้อ 7)
   คำเกินพื้นที่ = แบ่งหน้า ◀▶ (วัดของจริงหลัง layout ว่าหน้าหนึ่งใส่ได้กี่ชิป) ---------- */
let __vbFilter = 'all', __vbPageStarts = [0];
function openVocabBook(){
  __vbFilter = vbStats().review ? 'review' : 'all';   // มีคำต้องทบทวน → เปิดมาที่กลุ่มนั้นเลย
  __vbPageStarts = [0];
  let ov = document.getElementById('vb-overlay');
  if(ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'vb-overlay'; ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="vb-box">
    <button class="pl-close" id="vb-close">✕</button>
    <div class="vb-head">📒 สมุดคำศัพท์ของฉัน <span class="vb-total" id="vb-total"></span>
      <button class="vb-quizbtn" id="vb-quiz">📝 สอบทบทวนคำของหนู</button></div>
    <div class="vb-tabs" id="vb-tabs"></div>
    <div class="vb-words" id="vb-words"></div>
    <div class="vb-foot"><button class="vb-pg" id="vb-prev">◀</button>
      <span id="vb-pginfo"></span>
      <button class="vb-pg" id="vb-next">▶</button>
      <span class="vb-hint">แตะคำเพื่อฟังเสียง 🔊 · ตอบถูกในเกม/ข้อสอบ คำจะเลื่อนไป ⭐ เอง</span></div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#vb-close').addEventListener('click', ()=>ov.remove());
  ov.querySelector('#vb-quiz').addEventListener('click', vbStartReview);
  ov.querySelector('#vb-tabs').addEventListener('click', e=>{
    const t = e.target.closest('.vb-tab');
    if(!t) return;
    __vbFilter = t.dataset.f; __vbPageStarts = [0];
    vbRender(ov);
  });
  ov.querySelector('#vb-prev').addEventListener('click', ()=>{
    if(__vbPageStarts.length > 1){ __vbPageStarts.pop(); vbRender(ov); }
  });
  ov.querySelector('#vb-next').addEventListener('click', ()=>{
    const n = Number(ov.querySelector('#vb-next').dataset.start || -1);
    if(n >= 0){ __vbPageStarts.push(n); vbRender(ov); }
  });
  ov.querySelector('#vb-words').addEventListener('click', e=>{
    const w = e.target.closest('.vb-word');
    if(w && typeof speakWord === 'function') speakWord(w.dataset.w);
  });
  vbRender(ov);
}

function vbRender(ov){
  const st = vbStats();
  ov.querySelector('#vb-total').textContent = st.total ? `${fmtNum(st.total)} คำ` : '';
  // แท็บกลุ่ม (นับจำนวนสด)
  ov.querySelector('#vb-tabs').innerHTML =
    [['all', '📚', 'ทั้งหมด', st.total],
     ['review', VB_GROUP_UI.review[0], VB_GROUP_UI.review[1], st.review],
     ['learn',  VB_GROUP_UI.learn[0],  VB_GROUP_UI.learn[1],  st.learn],
     ['master', VB_GROUP_UI.master[0], VB_GROUP_UI.master[1], st.master]]
    .map(([f, em, nm, n])=>`<button class="vb-tab${__vbFilter === f ? ' on' : ''}" data-f="${f}">${em} ${nm} <b>${n}</b></button>`).join('');

  const list = vbList(__vbFilter);
  const box = ov.querySelector('#vb-words');
  const start = __vbPageStarts[__vbPageStarts.length - 1];
  if(!list.length){
    box.innerHTML = `<div class="vb-empty">📒 ${__vbFilter === 'all'
      ? 'สมุดยังว่างอยู่ — ไปเล่นเกมจับคู่หรือทำข้อสอบ แล้วทุกคำที่เจอจะมาอยู่ที่นี่เองนะ!'
      : 'กลุ่มนี้ยังไม่มีคำ'}</div>`;
  }else{
    box.innerHTML = list.slice(start).map(e=>
      `<button class="vb-word g-${e.g}" data-w="${escapeHTML(e.en)}"
        title="ถูก ${e.c} · ผิด ${e.w}">${VB_GROUP_UI[e.g][0]} <b>${escapeHTML(e.en)}</b> — ${escapeHTML(e.th)}</button>`).join('');
    // วัดของจริง: ชิปแรกที่ "ล้นก้นกล่อง" = จุดตัดหน้า → ซ่อนที่เหลือ จำ index เริ่มหน้าถัดไป
    const H = box.clientHeight;
    let cut = -1;
    [...box.children].forEach((c, i)=>{
      if(cut < 0 && c.offsetTop + c.offsetHeight > H + 2) cut = i;
      if(cut >= 0) c.style.display = 'none';
    });
    if(cut === 0) cut = 1;                        // กันวนไม่รู้จบบนจอเตี้ยสุดๆ (อย่างน้อยหน้าละ 1)
    ov.querySelector('#vb-next').dataset.start = (cut > 0 && start + cut < list.length) ? start + cut : -1;
  }
  const nextOk = Number(ov.querySelector('#vb-next').dataset.start || -1) >= 0;
  const page = __vbPageStarts.length;
  ov.querySelector('#vb-prev').style.visibility = page > 1 ? 'visible' : 'hidden';
  ov.querySelector('#vb-next').style.visibility = nextOk ? 'visible' : 'hidden';
  ov.querySelector('#vb-pginfo').textContent = (page > 1 || nextOk) ? `หน้า ${page}` : '';
}

/* ---------- จุดเข้า: ปุ่ม 📒 ท้ายแถบ lobby (index.html) — สคริปต์อยู่ท้าย body ผูกได้เลย ---------- */
(function(){
  const b = document.getElementById('btn-vocab-book');
  if(b) b.addEventListener('click', openVocabBook);
})();

/* การ์ดสมุดบนหน้าหมวดคำศัพท์ (game.js renderCats เรียกต่อท้าย bandCardsHTML) */
function vbCardHTML(){
  const st = vbStats();
  return `<div class="cat-card vb-card">
    <div class="cat-head"><span class="cat-emoji">📒</span><span class="cat-name">สมุดคำศัพท์ของฉัน</span>
      ${st.review ? `<span class="cat-pass" style="background:#ffe9d6;color:#b26a1e;border-color:#f2a95e">💪 ต้องทบทวน ${st.review} คำ</span>`
                  : '<span class="cat-pass">⭐ เยี่ยมมาก</span>'}</div>
    <div class="cat-info">ทุกคำที่หนูเจอในเกมและข้อสอบ ถูกเก็บไว้ที่นี่ · ตอนนี้มี ${fmtNum(st.total)} คำ</div>
    <div class="cat-btns">
      <!-- ⚠️ ห้ามใช้คลาส practice/quiz — renderCats ผูก listener กับ .cat-btn.practice/.quiz ทุกปุ่ม จะเด้งเข้าเกมซ้อน -->
      <button class="cat-btn vb-open" onclick="openVocabBook()">📒 เปิดสมุด</button>
      <button class="cat-btn vb-go" onclick="vbStartReview()">📝 สอบทบทวนส่วนตัว</button>
    </div>
  </div>`;
}
