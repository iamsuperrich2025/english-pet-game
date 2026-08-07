"use strict";
/* ============================================================
   🔒 GRADE LOCK — ล็อกการเปลี่ยนระดับชั้น (รอบ 647 · ผู้ใช้สั่ง 28 ก.ค. 2026)
   ------------------------------------------------------------
   เหตุผล: ระดับชั้นคุมความยากคำศัพท์ (vocabForStudent/gradeBand) → เด็กที่ "ลดชั้น"
   จะได้คำง่าย ๆ แล้วปั๊มเหรียญได้เร็วผิดปกติ · ต่อยอดจากรอบ 643 (สัญลักษณ์ดาว/เพชรใต้ชื่อ)
   ที่ทำให้เพื่อนทุกคน "เห็น" ชั้นของเรา — รอบนี้คุม "การเปลี่ยน" ชั้นนั้นเอง

   กติกา 3 ข้อ (ที่เดียวทั้งเกม):
   ① เปลี่ยนได้เดือนละ 1 ครั้ง (GRADE_LOCK_DAYS = 30 วันเต็มนับจากครั้งล่าสุด)
   ② เปลี่ยน "ขึ้น" ได้อย่างเดียว — ลดชั้นลง/เลือกชั้นเดิม ไม่ได้เลย ไม่ว่าครบกำหนดหรือยัง
   ③ ยังไม่ครบกำหนด = ขึ้นป้ายบอกว่าเหลืออีกกี่วัน + วันที่เปลี่ยนได้ (ห้ามปิดเงียบ ตามกฎทอง #1)
   ตอนสมัครไม่นับเป็น "การเปลี่ยน" (gradeSetAt=0) → เลือกผิดตอนสมัครยังขยับขึ้นได้ทันที 1 ครั้ง

   เก็บใน state (ไปกับเซฟ cloud อัตโนมัติ): gradeSetAt + gradeHist (ดู js/state.js)
   ชั้นที่ส่งขึ้นออนไลน์คือ field `g` ใน /presence, /leaderboard, /gfeed ฯลฯ —
   เปลี่ยนแล้วผลักขึ้น server ทันทีในฟังก์ชันเดียวกัน (ไม่รอ beat 60 วิ) เพื่อนจึงเห็นดาวตรงเสมอ
   ============================================================ */

/* ลำดับชั้นจากต่ำ→สูง — ต้องตรงกับ <select id="reg-grade"> ใน index.html เป๊ะ */
const GRADES = ['ต่ำกว่าประถมศึกษา',
                'ป.1','ป.2','ป.3','ป.4','ป.5','ป.6',
                'ม.1','ม.2','ม.3','ม.4','ม.5','ม.6',
                'ปริญญาตรี','สูงกว่าปริญญาตรี'];
const GRADE_LOCK_DAYS = 30;                          // "เดือนละครั้ง" = 30 วันเต็ม
const GRADE_LOCK_MS   = GRADE_LOCK_DAYS*24*60*60*1000;

/* อันดับของชั้น (ยิ่งมากยิ่งสูง) · -1 = ไม่รู้จัก (เซฟเก่า/ค่าเพี้ยน) */
function gradeRank(g){ return GRADES.indexOf(String(g == null ? '' : g).trim()); }
function myGrade(){ return state.student ? (state.student.grade || '') : ''; }
function gradeTester(){ return typeof isTester === 'function' && isTester(); }

/* ประวัติชั้น — migrate เซฟเก่าแบบขี้เกียจ (เรียกเมื่อไหร่ก็ได้ ปลอดภัยกับ state ที่ถูกโหลดใหม่จาก cloud) */
function gradeHistList(){
  if(!Array.isArray(state.gradeHist)) state.gradeHist = [];
  if(!state.gradeHist.length && state.student && myGrade()){
    // เซฟที่มีมาก่อนรอบ 647: ถือว่าชั้นปัจจุบันคือชั้นแรก · gradeSetAt=0 → ยังเปลี่ยนขึ้นได้ 1 ครั้งทันที
    state.gradeHist = [{g: myGrade(), at: state.savedAt || 0}];
  }
  return state.gradeHist;
}

/* เวลาที่เหลือก่อนเปลี่ยนได้อีกครั้ง (ms · 0 = เปลี่ยนได้เลย) */
function gradeLockLeftMs(){
  const last = +state.gradeSetAt || 0;
  if(!last) return 0;                                 // ยังไม่เคยเปลี่ยน
  const left = last + GRADE_LOCK_MS - Date.now();
  return left > 0 ? left : 0;
}
/* เหลืออีกกี่วัน (ปัดขึ้น — เหลือ 2 ชม. ก็ยังนับเป็น "อีก 1 วัน" ไม่ใช่ 0) */
function gradeLockLeftDays(){ return Math.ceil(gradeLockLeftMs()/86400000); }
function gradeUnlockAt(){ return (+state.gradeSetAt || 0) + GRADE_LOCK_MS; }
function gradeLocked(){ return !gradeTester() && gradeLockLeftMs() > 0; }

/* ชั้นที่เลือกได้ตอนนี้ = สูงกว่าชั้นปัจจุบันเท่านั้น (ข้อ ②) */
function gradeUpOptions(){
  const r = gradeRank(myGrade());
  if(gradeTester()) return GRADES.filter(g=>g !== myGrade());
  return GRADES.filter((g,i)=> i > r);                // r = -1 (ชั้นเพี้ยน) → เลือกได้ทุกชั้น
}

/* ---------- เปลี่ยนชั้นจริง — ประตูเดียวของทั้งเกม ----------
   คืน {ok:boolean, msg:string} · ไม่แก้ state เลยถ้า ok=false */
function gradeChangeTo(newG){
  if(!state.student) return {ok:false, msg:'ยังไม่ได้ลงทะเบียน'};
  const cur = myGrade(), curR = gradeRank(cur), newR = gradeRank(newG);
  const tester = gradeTester();
  if(newR < 0)      return {ok:false, msg:'ไม่รู้จักระดับชั้นนี้'};
  if(newR === curR) return {ok:false, msg:`ตอนนี้อยู่ ${cur} อยู่แล้ว`};
  if(!tester && newR < curR)   return {ok:false, msg:`⛔ ลดระดับชั้นลงไม่ได้ (ตอนนี้ ${cur}) — เลือกได้เฉพาะชั้นที่สูงขึ้น`};
  if(!tester && gradeLocked()) return {ok:false, msg:`🔒 เพิ่งเปลี่ยนชั้นไปเมื่อเร็ว ๆ นี้ — เปลี่ยนได้อีกครั้งในอีก ${gradeLockLeftDays()} วัน (${fmtThaiDate(gradeUnlockAt())})`};

  const now = Date.now();
  gradeHistList().push({g:newG, at:now});             // เก็บชั้นเดิมไว้ครบ (ตัวก่อนหน้า = ชั้นเดิม)
  if(state.gradeHist.length > 40) state.gradeHist = state.gradeHist.slice(-40);
  state.student.grade = newG;
  state.gradeSetAt = now;
  saveState();

  /* ผลักชั้นใหม่ขึ้น server ทันที (field g) — เพื่อน/กระดานอันดับเห็นดาวตรงกันเลย ไม่ต้องรอ beat */
  if(typeof authPushSave === 'function')        authPushSave(true);
  if(typeof onlinePushPresence === 'function')  onlinePushPresence();
  if(typeof onlinePushScore === 'function')     onlinePushScore();
  if(typeof renderDashboard === 'function')     renderDashboard();
  return {ok:true, msg:tester
    ? `🧪 เปลี่ยนเป็น ${newG} แล้ว — พร้อมทดสอบมุมมองระดับชั้นนี้`
    : `เปลี่ยนเป็น ${newG} เรียบร้อย 🎉 คำศัพท์จะยากขึ้นตามชั้นใหม่`};
}

/* ---------- ป้ายสั้น ๆ ไว้ติดใน UI (ห้ามปิดเงียบ — กฎทอง #1) ---------- */
function gradeLockNote(){
  if(!state.student) return '';
  if(gradeTester()) return '🧪 บัญชีทดสอบ — เปลี่ยนเป็นระดับชั้นใดก็ได้ ไม่จำกัดครั้ง';
  if(gradeLocked()) return `🔒 เปลี่ยนชั้นได้อีกครั้งในอีก ${gradeLockLeftDays()} วัน (${fmtThaiDate(gradeUnlockAt())})`;
  if(!gradeUpOptions().length) return '🏆 อยู่ชั้นสูงสุดแล้ว เปลี่ยนต่อไม่ได้';
  return '✏️ เปลี่ยนระดับชั้นได้ 1 ครั้ง (เดือนละครั้ง · ขึ้นได้อย่างเดียว)';
}

/* ---------- กล่องเปลี่ยนระดับชั้น ---------- */
function openGradeChange(){
  if(!state.student) return;
  if(typeof sfx !== 'undefined') sfx.select();
  const cur = myGrade();
  const ups = gradeUpOptions();
  const locked = gradeLocked();
  const tester = gradeTester();
  const hist = gradeHistList();

  /* แถบสถานะบนสุด — บอกเหตุผลเสมอว่าเปลี่ยนได้/ไม่ได้เพราะอะไร */
  let banner;
  if(tester){
    banner = `<div class="gl-ok">🧪 <b>โหมดบัญชีทดสอบ</b><span class="gl-lock-sub">เปลี่ยนเป็นระดับชั้นใดก็ได้ และเปลี่ยนซ้ำได้ทันที</span></div>`;
  }else if(locked){
    banner = `<div class="gl-lock">🔒 <b>ยังเปลี่ยนไม่ได้</b><span class="gl-lock-sub">เหลืออีก <b>${gradeLockLeftDays()} วัน</b> · เปลี่ยนได้วันที่ ${fmtThaiDate(gradeUnlockAt())}
      <br>เปลี่ยนชั้นได้ <b>เดือนละ 1 ครั้ง</b> เท่านั้นนะ (เปลี่ยนล่าสุด ${fmtThaiDate(state.gradeSetAt)})</span></div>`;
  }else if(!ups.length){
    banner = `<div class="gl-lock gl-top">🏆 <b>อยู่ระดับชั้นสูงสุดแล้ว</b><span class="gl-lock-sub">ไม่มีชั้นให้เปลี่ยนขึ้นอีก</span></div>`;
  }else{
    banner = `<div class="gl-ok">✅ <b>ตอนนี้เปลี่ยนได้ 1 ครั้ง</b><span class="gl-lock-sub">เปลี่ยนแล้วต้องรอ <b>${GRADE_LOCK_DAYS} วัน</b> ถึงจะเปลี่ยนได้อีก</span></div>`;
  }

  const rows = ups.map(g=>`<button class="gl-opt" data-g="${escapeHTML(g)}">
      <span class="gl-opt-g">${escapeHTML(g)}</span>${gradeMark(g)}</button>`).join('');

  /* ประวัติชั้นเดิม — เขียนเป็น "โซ่" บรรทัดเดียว (เก่า→ใหม่) แทนตาราง
     เพราะจอเตี้ย 812×375 ต้องเห็นครบทั้งใบโดยไม่ต้องเลื่อน (กฎทอง #7) */
  const shortDate = ts => ts ? new Date(ts).toLocaleDateString('th-TH',thLocaleOpt({day:'numeric',month:'short'})) : 'ตอนสมัคร';   // 🇹🇭 รอบ 988
  const histMax   = window.innerHeight < 460 ? 4 : 6;   // จอเตี้ย = โซ่สั้นลง กล่องจึงไม่ล้นจอ
  const histChain = hist.slice(-histMax).map((h,i,a)=>`<span class="gl-hg">${escapeHTML(h.g)}${gradeMark(h.g)}
      <small class="gl-hat">${(i === a.length-1 && a.length > 1) ? 'ตอนนี้' : shortDate(h.at)}</small></span>`)
    .join('<span class="gl-harr">→</span>');

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay gradelock-overlay';
  overlay.innerHTML = `<div class="levelup-box gradelock-box">
    <div class="gl-head">
      <span class="gl-emoji">🎖️</span>
      <div class="gl-ht"><h2>ระดับชั้นของหนู</h2>
        <div class="gl-cur">${escapeHTML(cur || '-')} ${gradeMark(cur)}</div></div>
    </div>
    ${banner}
    <div class="gl-why">${tester
      ? 'บัญชีนี้ใช้ตรวจการมองเห็นของแต่ละระดับชั้น — เลือกชั้นที่ต้องการทดสอบได้เลย 🧪'
      : 'คำศัพท์ในเกมยาก-ง่ายตามระดับชั้น — ระบบจึงให้ <b>เปลี่ยนขึ้นได้อย่างเดียว</b> และ <b>เดือนละ 1 ครั้ง</b> เพื่อความยุติธรรมกับเพื่อน ๆ ทุกคน 🌟'}</div>
    ${(!locked && ups.length) ? `<div class="gl-pick"><div class="gl-pick-lb">${tester?'เลือกระดับชั้นที่ต้องการทดสอบ':'เลือกชั้นใหม่ (สูงกว่าเดิมเท่านั้น)'}</div><div class="gl-opts">${rows}</div></div>` : ''}
    ${hist.length ? `<div class="gl-hist"><div class="gl-pick-lb">📜 ประวัติระดับชั้น (เก่า → ใหม่)</div>
      <div class="gl-hline">${histChain}</div></div>` : ''}
    <div class="gl-foot"><button class="set-close">ปิด</button></div>
  </div>`;

  overlay.querySelectorAll('.gl-opt').forEach(b=>b.addEventListener('click', ()=>{
    const g = b.dataset.g;
    if(typeof sfx !== 'undefined') sfx.select();
    /* ยืนยันก่อนเสมอ (บัญชีปกติย้อนชั้นไม่ได้ · บัญชีทดสอบเปลี่ยนซ้ำได้) — ใช้กล่องของเกม ไม่ใช่ confirm เบราว์เซอร์ */
    askConfirm(`<h2 style="margin:0 0 6px">🎖️ เปลี่ยนเป็น ${escapeHTML(g)}?</h2>
      <p class="gl-cf">${tester
        ? '🧪 เปลี่ยนได้อีกทันทีเมื่อต้องการทดสอบระดับชั้นอื่น'
        : `• ลดกลับลงมา <b>ไม่ได้</b> อีกเลย<br>• เปลี่ยนได้อีกครั้งในอีก <b>${GRADE_LOCK_DAYS} วัน</b><br>• คำศัพท์จะ <b>ยากขึ้น</b> ตามชั้นใหม่`}</p>`, 'เปลี่ยนเลย', ()=>{
      const r = gradeChangeTo(g);
      if(typeof sfx !== 'undefined') (r.ok ? sfx.levelup() : sfx.wrong());
      toast(r.msg, r.ok ? 2600 : 4200);
      overlay.remove();
      openGradeChange();                              // เปิดใหม่ให้เห็นสถานะล็อกที่เพิ่งเริ่มนับ
    });
  }));
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}
