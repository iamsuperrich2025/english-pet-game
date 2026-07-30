"use strict";
/* ============================================================
   📋 EXAM STD — ข้อสอบจริงแบบมาตรฐาน IELTS / TOEIC / TOEFL (รอบ 812)
   คนละระบบกับ js/bandadv.js (คลังศัพท์ IELTS/TOEIC/TOEFL รอบ 807) ซึ่งเป็นการจับคู่ en↔th
   ที่นี่ = โจทย์เลือกตอบแบบข้อสอบจริง 30 ข้อ/ชุด: ไวยากรณ์ + การอ่านจับใจความ (ไม่มีเรียงความ)
   ทุกข้อมี "เฉลยละเอียด" อธิบายว่าทำไมข้อนั้นถูกและตัวลวงผิดเพราะอะไร

   ทำไมไม่ต่อเข้า startQuiz เดิม: เครื่องยนต์เดิมเป็นโจทย์คำเดียว→เลือกคำแปล ไม่มีบทอ่าน
   ไม่มีเฉลยเชิงอธิบาย และไม่มีโหมด "ตอบครบก่อนดูเฉลย" แบบสนามสอบจริง จึงเขียนจอสอบเอง
   แต่ยังเชื่อมของกลางเดิมทุกตัว: state.quizPassed / state.quizLog / certAward / addCoins / feedEvent

   ข้อมูล: js/data/exam/<ชุด>.json (โหลดขี้เกียจผ่าน fetch) · สารบัญ js/data/exam/manifest.js
   เจน/ตรวจไฟล์ด้วย tools/gen_exam_std_manifest.py (ห้ามแก้ manifest มือ)
   ============================================================ */
const XS_PASS_PCT   = 0.7;          // เกณฑ์ผ่าน 70% (21/30) — ต่ำกว่าหมวดคำศัพท์ (80%) เพราะข้อสอบแนวนี้ยากกว่าจริง
const XS_REWARD     = 900;          // ผ่านครั้งแรกของชุด (สอบซ้ำได้ 30)
const XS_REWARD_AGAIN = 30;
/* ⏱️ เวลาแนะนำต่อชุด (นาที) — เทียบสัดส่วนจากเวลาจริงของแต่ละสนามสอบ · ไม่มีการตัดจบอัตโนมัติ
   (เด็ก/ผู้เริ่มต้นควรได้อ่านจนจบ แต่ต้องเห็นว่าถ้าสอบจริงเวลาประมาณนี้) */
const XS_TIME_HINT  = {ielts:45, toeic:25, toefl:40};

/* คะแนนเทียบโดยประมาณ (ไม่ใช่คะแนนทางการ — เขียนบอกบนจอทุกครั้ง)
   เก็บเป็น [คะแนนดิบขั้นต่ำ, ข้อความ] เรียงจากสูงไปต่ำ */
const XS_SCALE = {
  ielts:[[28,'Band 8.0+'],[25,'Band 7.5'],[22,'Band 7.0'],[19,'Band 6.5'],[16,'Band 6.0'],[13,'Band 5.5'],[10,'Band 5.0'],[0,'ต่ำกว่า Band 5.0']],
  toeic:[[29,'ส่วน Reading ~470–495'],[26,'~420–465'],[23,'~370–415'],[20,'~320–365'],[16,'~260–315'],[12,'~200–255'],[0,'ต่ำกว่า 200']],
  // ⚠️ ช่วงคะแนนที่โชว์ต้องไม่ต่ำกว่าคะแนนดิบที่ทำได้ ไม่งั้นดูเหมือนถูกหักคะแนน (เจอตอนเทสต์: ดิบ 20 เคยขึ้น "15–19")
  toefl:[[28,'Reading 27–30 (ดีมาก)'],[24,'Reading 23–26 (ดี)'],[20,'Reading 19–22 (ค่อนข้างดี)'],[16,'Reading 15–18 (พอใช้)'],[12,'Reading 11–14 (ต้องฝึกเพิ่ม)'],[0,'ต่ำกว่า 11']],
};
function xsScaleText(exam, raw){
  const t = XS_SCALE[exam] || [];
  const hit = t.find(r=>raw >= r[0]);
  return hit ? hit[1] : '';
}

const __xsCache   = {};             // setId → ชุดข้อสอบที่โหลดแล้ว (แบนราบพร้อมใช้)
const __xsLoading = {};
const __xsFail    = {};             // setId → '404' | 'network' (บอกต้นตอให้ผู้ใช้ตรงจุด เหมือน bandAdvLoad)

/* หา meta ของชุด (จากมานิเฟสต์) → {exam, examMeta, set} */
function xsFindSet(setId){
  if(typeof EXAM_STD_MANIFEST === 'undefined') return null;
  for(const exam in EXAM_STD_MANIFEST){
    const m = EXAM_STD_MANIFEST[exam];
    const s = m.sets.find(x=>x.id === setId);
    if(s) return {exam, examMeta:m, set:s};
  }
  return null;
}

/* โหลดชุดข้อสอบ + "แบนราบ" เป็นรายข้อ (แนบชื่อส่วน/บทอ่านของข้อนั้นไว้ในตัวข้อเลย
   เพื่อให้จอสอบวาดข้อเดียวจบ ไม่ต้องไล่หา section ย้อนกลับทุกครั้ง) */
function examStdLoad(setId){
  if(__xsCache[setId]) return Promise.resolve(__xsCache[setId]);
  if(__xsLoading[setId]) return __xsLoading[setId];
  const found = xsFindSet(setId);
  if(!found) return Promise.resolve(null);
  const url = 'js/data/exam/' + found.set.f;
  delete __xsFail[setId];
  __xsLoading[setId] = fetch(url).then(r=>{
    if(!r.ok){
      __xsFail[setId] = r.status === 404 ? '404' : 'http';
      console.error(`[examStdLoad] โหลดชุดข้อสอบไม่สำเร็จ (สถานะ ${r.status}): ${url}`);
      return null;
    }
    return r.json();
  }).catch(err=>{
    __xsFail[setId] = 'network';
    console.error(`[examStdLoad] โหลดชุดข้อสอบไม่สำเร็จ (เน็ตหลุด/เชื่อมต่อไม่ได้): ${url}`, err);
    return null;
  }).then(d=>{
    delete __xsLoading[setId];
    if(!d) return null;
    const items = [];
    (d.sections || []).forEach((sec, si)=>{
      (sec.items || []).forEach(it=>{
        items.push({q:it.q, c:it.c, a:it.a, ex:it.ex, ref:it.ref || '', tag:it.tag || '',
                    secI:si, secName:sec.n || '', secDesc:sec.d || '', p:sec.p || null});
      });
    });
    const pack = {id:setId, exam:found.exam, examMeta:found.examMeta, meta:found.set,
                  label:d.label || found.set.label, items};
    __xsCache[setId] = pack;
    return pack;
  });
  return __xsLoading[setId];
}
function xsFailMsg(setId){
  const k = __xsFail[setId];
  if(k === '404') return 'ชุดข้อสอบนี้ยังไม่ขึ้นเว็บ แจ้งผู้ดูแลให้อัปเดตก่อนนะ 🙏';
  if(k === 'network') return 'เน็ตหลุดระหว่างโหลดชุดข้อสอบ ลองเช็กสัญญาณแล้วลองใหม่นะ 😅';
  return 'โหลดชุดข้อสอบไม่สำเร็จ ลองใหม่อีกครั้งนะ 😅';
}

/* id ที่ใช้กับของกลางเดิม (quizPassed / quizLog / ใบประกาศ) — คนละ id กับหมวดคำศัพท์ badv_* */
function xsQuizId(setId){ return 'xstd_' + setId; }
/* คะแนนดีที่สุด + เวลาของชุดนี้ (เวลาอ่านจากใบประกาศ = แหล่งเดียวกับที่ finishQuiz ใช้ ไม่คิดเอง) */
function xsBest(setId){
  const id = xsQuizId(setId);
  let b = null;
  ((typeof state !== 'undefined' && state.quizLog) || []).forEach(l=>{
    if(l && l.cat === id && (!b || l.score > b.s)) b = {s:l.score, t:l.total};
  });
  if(b){
    const cert = (typeof state !== 'undefined' && Array.isArray(state.certs))
      ? state.certs.find(c=>c.id === id) : null;
    b.sec = (cert && cert.sec) || 0;
  }
  return b;
}

/* ============================================================
   🖥️ จอสอบ (overlay เต็มจอเอง ไม่ใช้ screen-quiz เดิม)
   XS = สถานะรอบสอบปัจจุบัน · mode 'exam' = ตอบครบแล้วส่ง (ดูเฉลยทีเดียวตอนจบ เหมือนสนามสอบจริง)
                              · mode 'practice' = เฉลยละเอียดทันทีทีละข้อ (โหมดฝึก)
   ============================================================ */
const XS = {pack:null, mode:'exam', idx:0, ans:[], startAt:0, done:false};
let __xsTimer = null;

function xsTimerStop(){ if(__xsTimer){ clearInterval(__xsTimer); __xsTimer = null; } }
function xsElapsed(){ return XS.startAt ? Math.round((Date.now() - XS.startAt) / 1000) : 0; }
function xsFmt(sec){
  sec = Math.max(0, Math.round(sec));
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}

function examStdStart(setId, mode){
  examStdLoad(setId).then(pack=>{
    if(!pack || !pack.items.length){ toast(xsFailMsg(setId)); return; }
    const ov = document.getElementById('xs-picker');
    if(ov) ov.remove();                       // ปิดแผงเลือกชุดก่อน ไม่ให้บังจอสอบ
    XS.pack = pack; XS.mode = (mode === 'practice') ? 'practice' : 'exam';
    XS.idx = 0; XS.ans = new Array(pack.items.length).fill(-1);
    XS.locked = new Array(pack.items.length).fill(false);   // โหมดฝึก: ตอบแล้วล็อก ไม่ให้แก้ย้อน
    XS.startAt = Date.now(); XS.done = false;
    xsBuildScreen();
    xsRender();
  });
}

/* โครงจอ — สร้างครั้งเดียวต่อรอบสอบ แล้ววาดเฉพาะเนื้อข้อ (กันกระพริบ + เก็บ scroll ของบทอ่าน) */
function xsBuildScreen(){
  const old = document.getElementById('xs-screen');
  if(old) old.remove();
  const p = XS.pack;
  const hint = XS_TIME_HINT[p.exam] || 0;
  const ov = document.createElement('div');
  ov.id = 'xs-screen';
  ov.innerHTML = `
    <div class="xs-top">
      <span class="xs-badge">${p.examMeta.emoji} ${escapeHTML(p.label)}</span>
      <span class="xs-mode">${XS.mode === 'exam' ? '📋 โหมดสอบจริง' : '🎓 โหมดฝึก (เฉลยทันที)'}</span>
      <span class="xs-time" id="xs-time">⏱️ 0:00${hint ? ` / แนะนำ ${hint}:00` : ''}</span>
      <span class="xs-score" id="xs-score"></span>
      <button class="xs-quit" id="xs-quit">✕ ออก</button>
    </div>
    <div class="xs-nav" id="xs-nav"></div>
    <div class="xs-body">
      <div class="xs-pass" id="xs-pass"></div>
      <div class="xs-qside">
        <div class="xs-sec" id="xs-sec"></div>
        <div class="xs-q" id="xs-q"></div>
        <div class="xs-choices" id="xs-choices"></div>
        <div class="xs-ex" id="xs-ex"></div>
      </div>
    </div>
    <div class="xs-foot">
      <button class="xs-btn back" id="xs-back">❮ ข้อก่อน</button>
      <span class="xs-count" id="xs-count"></span>
      <button class="xs-btn next" id="xs-next">ข้อถัดไป ❯</button>
      <button class="xs-btn send" id="xs-send">📨 ส่งคำตอบ</button>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#xs-quit').addEventListener('click', xsQuitAsk);
  ov.querySelector('#xs-back').addEventListener('click', ()=>xsGo(-1));
  ov.querySelector('#xs-next').addEventListener('click', ()=>xsGo(1));
  ov.querySelector('#xs-send').addEventListener('click', xsSubmitAsk);
  ov.querySelector('#xs-nav').addEventListener('click', ev=>{
    const b = ev.target.closest('.xs-dot');
    if(!b) return;
    XS.idx = Number(b.dataset.i);
    if(typeof sfx !== 'undefined' && sfx.click) sfx.click();
    xsRender();
  });
  ov.querySelector('#xs-choices').addEventListener('click', ev=>{
    const b = ev.target.closest('.xs-ch');
    if(b) xsChoose(Number(b.dataset.i));
  });
  xsTimerStop();
  const tick = ()=>{
    const el = document.getElementById('xs-time');
    if(!el) return xsTimerStop();
    const s = xsElapsed();
    el.textContent = `⏱️ ${xsFmt(s)}${hint ? ` / แนะนำ ${hint}:00` : ''}`;
    el.classList.toggle('over', !!hint && s > hint * 60);
  };
  tick();
  __xsTimer = setInterval(tick, 1000);
}

function xsRender(){
  const p = XS.pack, it = p.items[XS.idx], n = p.items.length;
  const picked = XS.ans[XS.idx], locked = XS.locked[XS.idx];
  const reveal = (XS.mode === 'practice') && locked;      // โหมดฝึก: เฉลยโผล่ทันทีหลังตอบ
  /* บทอ่าน: วาดใหม่เฉพาะเมื่อเปลี่ยน "ส่วน" (ข้อในบทเดียวกันจะไม่รีเซ็ต scroll ที่อ่านค้างไว้) */
  const box = document.getElementById('xs-pass');
  if(box.dataset.sec !== String(it.secI)){
    box.dataset.sec = String(it.secI);
    box.scrollTop = 0;
    if(it.p){
      const num = p.exam !== 'toeic';                     // เอกสารธุรกิจ TOEIC ไม่ใส่เลขย่อหน้า (เป็นหัวจดหมาย/ตาราง)
      box.innerHTML = `<div class="xs-ptitle">📄 ${escapeHTML(it.p.t || '')}</div>`
        + (it.p.x || []).map((t, i)=>`<p class="xs-para">${num ? `<span class="xs-pn">${i+1}</span>` : ''}${escapeHTML(t)}</p>`).join('');
      box.hidden = false;
    }else{
      box.innerHTML = ''; box.hidden = true;
    }
  }
  document.getElementById('xs-sec').innerHTML =
    `<b>${escapeHTML(it.secName)}</b>${it.secDesc ? `<small>${escapeHTML(it.secDesc)}</small>` : ''}`;
  document.getElementById('xs-q').innerHTML =
    `<span class="xs-qno">ข้อ ${XS.idx + 1}</span> ${escapeHTML(it.q)}`;
  const AB = ['A','B','C','D'];
  document.getElementById('xs-choices').innerHTML = it.c.map((c, i)=>{
    let cls = 'xs-ch';
    if(picked === i) cls += ' pick';
    if(reveal){
      if(i === it.a) cls += ' right';
      else if(picked === i) cls += ' wrong';
    }
    return `<button class="${cls}" data-i="${i}"${locked ? ' disabled' : ''}>
      <span class="xs-ab">${AB[i]}</span><span class="xs-ct">${escapeHTML(c)}</span></button>`;
  }).join('');
  const ex = document.getElementById('xs-ex');
  if(reveal){
    const ok = picked === it.a;
    ex.className = 'xs-ex show ' + (ok ? 'ok' : 'no');
    ex.innerHTML = `<div class="xs-exh">${ok ? '✅ ถูกต้อง!' : `❌ ยังไม่ถูก — คำตอบคือ ${AB[it.a]}`}</div>
      <div class="xs-exb">${escapeHTML(it.ex)}</div>
      ${it.ref ? `<div class="xs-exref">📍 ดูที่ ${escapeHTML(it.ref)}</div>` : ''}`;
  }else{
    ex.className = 'xs-ex'; ex.innerHTML = '';
  }
  // แถบนำทาง 30 ข้อ (เห็นภาพรวมว่าเหลือข้อไหน — เหมือนกระดาษคำตอบสนามสอบ)
  document.getElementById('xs-nav').innerHTML = p.items.map((x, i)=>{
    let cls = 'xs-dot';
    if(i === XS.idx) cls += ' now';
    if(XS.ans[i] >= 0) cls += ' has';
    if(XS.mode === 'practice' && XS.locked[i]) cls += (XS.ans[i] === x.a ? ' ok' : ' no');
    return `<button class="${cls}" data-i="${i}">${i + 1}</button>`;
  }).join('');
  const left = XS.ans.filter(a=>a < 0).length;
  document.getElementById('xs-count').textContent =
    `ข้อ ${XS.idx + 1} / ${n}${left ? ` · ยังไม่ตอบ ${left} ข้อ` : ' · ตอบครบแล้ว'}`;
  if(XS.mode === 'practice'){
    const done = XS.locked.filter(Boolean).length;
    const ok   = XS.locked.filter((l, i)=>l && XS.ans[i] === p.items[i].a).length;
    document.getElementById('xs-score').textContent = `ถูก ${ok}/${done} ข้อ`;
  }else{
    document.getElementById('xs-score').textContent = `ตอบแล้ว ${n - left}/${n} ข้อ`;
  }
  document.getElementById('xs-back').disabled = XS.idx === 0;
  const lastQ = XS.idx === n - 1;
  document.getElementById('xs-next').hidden = lastQ;
  // ปุ่มส่ง: โหมดสอบเห็นตลอด (ส่งได้ทุกเมื่อ) · โหมดฝึกโผล่เฉพาะข้อสุดท้ายหลังตอบแล้ว
  const send = document.getElementById('xs-send');
  send.hidden = (XS.mode === 'practice') && !(lastQ && locked);
  send.textContent = (XS.mode === 'practice') ? '📊 ดูผลสอบ' : '📨 ส่งคำตอบ';
  /* จอมือถือแนวนอนเตี้ย: กล่องเฉลยละเอียดยาวกว่ากรอบ → เลื่อนให้เห็นเฉลยทันทีที่ตอบ
     (ข้อใหม่ที่ยังไม่ตอบให้เริ่มที่บนสุดเสมอ) */
  const side = document.querySelector('.xs-qside');
  if(reveal) ex.scrollIntoView({block:'nearest'});
  else side.scrollTop = 0;
}

function xsChoose(i){
  if(XS.locked[XS.idx]) return;
  XS.ans[XS.idx] = i;
  if(XS.mode === 'practice'){
    XS.locked[XS.idx] = true;
    const ok = i === XS.pack.items[XS.idx].a;
    if(typeof sfx !== 'undefined') (ok ? sfx.correct : sfx.wrong)();
  }else if(typeof sfx !== 'undefined' && sfx.click){
    sfx.click();
  }
  xsRender();
}
function xsGo(d){
  const n = XS.pack.items.length;
  XS.idx = Math.min(n - 1, Math.max(0, XS.idx + d));
  xsRender();
}
/* คีย์บอร์ด: 1-4 หรือ a-d เลือกคำตอบ · ←→ เปลี่ยนข้อ · Enter ไปข้อถัดไป (ทำข้อสอบยาวได้ไวขึ้น) */
document.addEventListener('keydown', e=>{
  const sc = document.getElementById('xs-screen');
  if(!sc || XS.done) return;
  const k = e.key.toLowerCase();
  if('1234'.includes(k)){ e.preventDefault(); xsChoose(Number(k) - 1); }
  else if('abcd'.includes(k) && k.length === 1){ e.preventDefault(); xsChoose('abcd'.indexOf(k)); }
  else if(e.key === 'ArrowLeft'){ e.preventDefault(); xsGo(-1); }
  else if(e.key === 'ArrowRight' || e.key === 'Enter'){ e.preventDefault(); xsGo(1); }
});

function xsQuitAsk(){
  const done = XS.ans.filter(a=>a >= 0).length;
  if(!done){ xsClose(); return; }
  alertBox(`<div style="font-size:46px;line-height:1">🚪</div>
    <div style="font-size:19px;font-weight:bold;margin-top:6px;color:#7d5fc0">ออกจากข้อสอบเลยไหม?</div>
    <div style="margin-top:6px;color:#6a5a78">ตอบไปแล้ว <b>${done}</b> ข้อ — ออกตอนนี้คำตอบจะไม่ถูกบันทึกและไม่ได้คะแนนนะ</div>`,
    'ทำต่อ 📝', {text:'ออกจากข้อสอบ', onClick:xsClose});
}
function xsClose(){
  xsTimerStop();
  const ov = document.getElementById('xs-screen');
  if(ov) ov.remove();
  XS.pack = null; XS.done = true;
}
function xsSubmitAsk(){
  const left = XS.ans.filter(a=>a < 0).length;
  if(left && XS.mode === 'exam'){
    alertBox(`<div style="font-size:46px;line-height:1">📨</div>
      <div style="font-size:19px;font-weight:bold;margin-top:6px;color:#7d5fc0">ส่งคำตอบเลยไหม?</div>
      <div style="margin-top:6px;color:#6a5a78">ยังเหลือ <b>${left}</b> ข้อที่ไม่ได้ตอบ — ข้อที่ไม่ตอบจะนับเป็นผิดนะ</div>`,
      'กลับไปทำต่อ', {text:'ส่งเลย 📨', onClick:xsFinish});
    return;
  }
  xsFinish();
}

/* ============================================================
   🏁 จบข้อสอบ — ให้รางวัล/ใบประกาศผ่านของกลางเดิม แล้วเด้ง "สรุปเฉลยละเอียด" ทุกข้อที่ผิด
   ============================================================ */
function xsFinish(){
  if(XS.done) return;
  XS.done = true;
  xsTimerStop();
  const p = XS.pack, n = p.items.length, secs = xsElapsed();
  const correct = p.items.filter((it, i)=>XS.ans[i] === it.a).length;
  const passMark = Math.ceil(n * XS_PASS_PCT);
  const passed = correct >= passMark;
  const cid = xsQuizId(p.id);
  const cat = {id:cid, name:p.label, emoji:p.examMeta.emoji, reward:XS_REWARD};
  const firstPass = passed && !state.quizPassed.includes(cid);
  const prevBestSec = (passed && Array.isArray(state.certs))
    ? ((state.certs.find(c=>c.id === cid) || {}).sec || 0) : 0;

  let coins = 0, rp = 5, myCert = null;
  if(passed){
    coins = firstPass ? XS_REWARD : XS_REWARD_AGAIN;
    rp = firstPass ? 120 : 30;
    if(firstPass) state.quizPassed.push(cid);
    addCoins(coins);
    if(typeof questEvent === 'function') questEvent('quiz');
    if(typeof feedEvent === 'function') feedEvent('quiz',
      `สอบผ่านข้อสอบ ${p.examMeta.label} ${correct}/${n} ข้อ ⏱️ ${xsFmt(secs)} 📋`);
    if(typeof certAward === 'function') myCert = certAward(cat, correct, n, secs);
  }
  addRP(rp);
  const made = (typeof addCraft === 'function') ? addCraft(correct) : null;
  state.quizLog.push({cat:cid, score:correct, total:n, passed, ts:Date.now(), sec:secs});
  saveState();
  const newRecord = !!(myCert && myCert.sec === secs && (!prevBestSec || secs < prevBestSec));

  const pct = Math.round(correct / n * 100);
  const scale = xsScaleText(p.exam, correct);
  const ov = document.createElement('div');
  ov.className = 'levelup-overlay';
  ov.innerHTML = `<div class="levelup-box xs-result">
    <h2>${passed ? '🏆 สอบผ่าน เก่งมาก!' : '💪 ยังไม่ผ่าน แต่ใกล้แล้ว!'}</h2>
    <div class="lv-emoji" style="font-size:52px">${passed ? '🎉' : '📖'}</div>
    <div class="xs-rscore">${p.examMeta.emoji} ${escapeHTML(p.label)}<br>
      ตอบถูก <b>${correct}/${n}</b> ข้อ (${pct}%)</div>
    ${scale ? `<div class="xs-rscale">📊 คะแนนเทียบโดยประมาณ: <b>${escapeHTML(scale)}</b>
      <small>เป็นการเทียบคร่าว ๆ จากชุดฝึกนี้เท่านั้น ไม่ใช่คะแนนทางการของสนามสอบ</small></div>` : ''}
    <div class="xs-rrow">⏱️ ใช้เวลา <b>${xsFmt(secs)}</b> (เฉลี่ยข้อละ ${(secs / n).toFixed(1)} วิ)${
      newRecord ? (prevBestSec ? ` — <b style="color:#e07b39">🏁 ทำลายสถิติเดิม ${xsFmt(prevBestSec)}!</b>` : ' — <b style="color:#e07b39">🏁 สถิติแรกของชุดนี้!</b>')
      : (prevBestSec ? ` · สถิติดีที่สุด ${xsFmt(prevBestSec)}` : '')}</div>
    <div class="xs-rrow">${passed
      ? `รับ +${fmtNum(coins)} 🪙 +${rp} RP${firstPass ? ' 🎁 (ผ่านครั้งแรกของชุดนี้!)' : ''}`
      : `ได้กำลังใจ +${rp} RP 💪 ต้องตอบถูก <b>${passMark}</b> ข้อขึ้นไปถึงจะผ่าน — ลองใหม่ได้ไม่จำกัด`}
      ${made ? `<br>🏭 แต้มผลิต +${correct} — <b>ผลิตสำเร็จ!</b> 🎉` : ''}</div>
    ${myCert ? `<div class="lv-cert-row">🎖️ ได้รับ <b>ใบประกาศ Vocab World</b> เก็บไว้ในโปรไฟล์แล้ว
      <button class="lv-cert-btn" type="button">ดูใบประกาศ</button></div>` : ''}
    <button>ดูเฉลยละเอียด 📖</button>
  </div>`;
  if(myCert){
    const cb = ov.querySelector('.lv-cert-btn');
    if(cb) cb.addEventListener('click', e=>{ e.stopPropagation(); openCertBig(myCert); });
  }
  ov.querySelector('button:not(.lv-cert-btn)').addEventListener('click', ()=>{
    ov.remove();
    xsShowReview();                      // เฉลยละเอียดทุกข้อ (จอสอบยังอยู่เบื้องหลังเป็นฉาก)
  });
  document.body.appendChild(ov);
  if(passed && typeof sfx !== 'undefined') sfx.levelup(); else if(typeof sfx !== 'undefined') sfx.wrong();
  if(made && typeof showCollectReveal === 'function') setTimeout(()=>showCollectReveal(made, null, true), 600);
}

/* 📖 เฉลยละเอียดหลังสอบ — ค่าเริ่มต้นโชว์ "ข้อที่ผิด" ก่อน (สิ่งที่ต้องทบทวนจริง) สลับดูทุกข้อได้
   ต้องมีเสมอไม่ว่าผ่านหรือไม่ผ่าน เพราะหัวใจของข้อสอบมาตรฐานคือเข้าใจว่าทำไมตัวลวงผิด */
function xsShowReview(){
  const p = XS.pack;
  if(!p) return;
  const AB = ['A','B','C','D'];
  let onlyWrong = true;
  const ov = document.createElement('div');
  ov.id = 'xs-review'; ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="xsr-box">
    <button class="pl-close" id="xsr-close">✕</button>
    <div class="xsr-head">📖 เฉลยละเอียด · ${escapeHTML(p.label)}
      <span class="xsr-sub">อ่านเฉลยให้ครบก่อนสอบรอบหน้า — ตัวลวงของข้อสอบมาตรฐานมักซ้ำรูปแบบเดิม</span></div>
    <div class="xsr-tabs">
      <button class="xsr-tab on" data-w="1">❌ ข้อที่ตอบผิด</button>
      <button class="xsr-tab" data-w="0">📋 ทุกข้อ (${p.items.length})</button>
    </div>
    <div class="xsr-list" id="xsr-list"></div>
    <div class="xsr-foot"><button class="xsr-ok" id="xsr-ok">เข้าใจแล้ว ปิด</button></div>
  </div>`;
  const draw = ()=>{
    const rows = p.items.map((it, i)=>({it, i, ok:XS.ans[i] === it.a}))
                        .filter(r=>!onlyWrong || !r.ok);
    const list = ov.querySelector('#xsr-list');
    if(!rows.length){
      list.innerHTML = `<div class="xsr-none">🌟 ไม่มีข้อผิดเลย เต็มทั้งชุด! กดแท็บ "ทุกข้อ" เพื่อทบทวนเฉลยได้</div>`;
      return;
    }
    list.innerHTML = rows.map(r=>{
      const picked = XS.ans[r.i];
      return `<div class="xsr-item ${r.ok ? 'ok' : 'no'}">
        <div class="xsr-qh"><b>ข้อ ${r.i + 1}</b> <small>${escapeHTML(r.it.secName)}</small>
          ${r.it.tag ? `<em>${escapeHTML(r.it.tag)}</em>` : ''}</div>
        <div class="xsr-q">${escapeHTML(r.it.q)}</div>
        <div class="xsr-ans">✅ เฉลย: <b>${AB[r.it.a]}. ${escapeHTML(r.it.c[r.it.a])}</b>
          ${r.ok ? '<span class="xsr-you good">ตอบถูก</span>'
                 : `<span class="xsr-you bad">หนูตอบ: ${picked >= 0 ? AB[picked] + '. ' + escapeHTML(r.it.c[picked]) : 'ไม่ได้ตอบ'}</span>`}</div>
        <div class="xsr-ex">${escapeHTML(r.it.ex)}</div>
        ${r.it.ref ? `<div class="xsr-ref">📍 ${escapeHTML(r.it.ref)}</div>` : ''}
      </div>`;
    }).join('');
    list.scrollTop = 0;
  };
  document.body.appendChild(ov);
  draw();
  ov.querySelector('.xsr-tabs').addEventListener('click', ev=>{
    const b = ev.target.closest('.xsr-tab');
    if(!b) return;
    onlyWrong = b.dataset.w === '1';
    ov.querySelectorAll('.xsr-tab').forEach(t=>t.classList.toggle('on', t === b));
    draw();
  });
  const shut = ()=>{
    ov.remove();
    xsClose();                            // ปิดจอสอบด้วย กลับหน้าหมวด
    if(typeof renderCats === 'function') renderCats();
    if(typeof showScreen === 'function') showScreen('screen-cats');
    openExamStdPicker(p.exam);            // เด้งแผงชุดข้อสอบกลับมา เลือกชุดถัดไปต่อได้เลย
  };
  ov.querySelector('#xsr-close').addEventListener('click', shut);
  ov.querySelector('#xsr-ok').addEventListener('click', shut);
}

/* ============================================================
   🗂️ แผงเลือกชุดข้อสอบ (ต่อ 1 สนามสอบ) — เห็นครบทั้งใบ ไม่ต้องเลื่อน (กฎทองข้อ 7)
   ============================================================ */
function openExamStdPicker(exam){
  const m = (typeof EXAM_STD_MANIFEST !== 'undefined') ? EXAM_STD_MANIFEST[exam] : null;
  if(!m) return;
  const old = document.getElementById('xs-picker');
  if(old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'xs-picker'; ov.className = 'pl-overlay';
  const passMark = s=>Math.ceil(s.q * XS_PASS_PCT);
  ov.innerHTML = `<div class="xsp-box">
    <button class="pl-close" id="xsp-close">✕</button>
    <div class="xsp-head">${m.emoji} ข้อสอบจริงแบบมาตรฐาน · ${escapeHTML(m.label)}
      <span class="xsp-sub">${escapeHTML(m.sub)} · ${m.sets.length} ชุด × ${m.sets[0].q} ข้อ · ทุกข้อมีเฉลยละเอียด
        <br>⏱️ เวลาแนะนำ ${XS_TIME_HINT[exam] || '-'} นาที/ชุด · ผ่านที่ ${Math.round(XS_PASS_PCT * 100)}% ขึ้นไป รับ ${fmtNum(XS_REWARD)} 🪙 + ใบประกาศ 🎖️</span></div>
    <div class="xsp-rows">${m.sets.map(s=>{
      const best = xsBest(s.id);
      const done = state.quizPassed.includes(xsQuizId(s.id));
      return `<div class="xsp-set${done ? ' done' : ''}">
        <div class="xsp-name">${escapeHTML(s.label)}${done ? ' <span class="xsp-tick">✅ ผ่านแล้ว</span>' : ''}</div>
        <div class="xsp-info">${s.q} ข้อ · ${s.passages} บทอ่าน · ${s.secs.map(x=>`${escapeHTML(x.n.split('·').pop().trim())} ${x.q} ข้อ`).join(' · ')}</div>
        <div class="xsp-best">${best ? `คะแนนสูงสุด <b>${best.s}/${best.t}</b>${best.sec ? ` · ⏱️ ${xsFmt(best.sec)}` : ''} · ผ่านที่ ${passMark(s)} ข้อ`
          : `ยังไม่เคยสอบชุดนี้ · ผ่านที่ ${passMark(s)} ข้อ`}</div>
        <div class="xsp-btns">
          <button class="xsp-go exam" data-set="${s.id}">📋 สอบจริง (เฉลยตอนจบ)</button>
          <button class="xsp-go practice" data-set="${s.id}">🎓 โหมดฝึก (เฉลยทันทีทุกข้อ)</button>
        </div>
      </div>`;
    }).join('')}</div>
    <div class="xsp-foot">📝 ข้อสอบชุดนี้ <b>เขียนขึ้นใหม่ทั้งหมดตามรูปแบบและแนวข้อสอบจริง</b> (ไม่ใช่ข้อสอบเก่าของสนามสอบ) ·
      เป็นข้อสอบแบบเลือกตอบ ไวยากรณ์ + การอ่านจับใจความ ไม่มีส่วนเขียนเรียงความ</div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#xsp-close').addEventListener('click', ()=>ov.remove());
  ov.querySelector('.xsp-rows').addEventListener('click', ev=>{
    const b = ev.target.closest('.xsp-go');
    if(!b) return;
    toast('⏳ กำลังเปิดชุดข้อสอบ...');
    examStdStart(b.dataset.set, b.classList.contains('practice') ? 'practice' : 'exam');
  });
}

/* การ์ด 3 สนามสอบ ต่อท้ายหน้า "หมวดคำศัพท์ & แบบทดสอบ" (เรียกจาก renderCats ใน game.js) */
function examStdCardsHTML(){
  if(typeof EXAM_STD_MANIFEST === 'undefined') return '';
  const keys = Object.keys(EXAM_STD_MANIFEST);
  if(!keys.length) return '';
  const allSets = keys.reduce((n, k)=>n + EXAM_STD_MANIFEST[k].sets.length, 0);
  const passedN = keys.reduce((n, k)=>n + EXAM_STD_MANIFEST[k].sets
    .filter(s=>state.quizPassed.includes(xsQuizId(s.id))).length, 0);
  return `<div class="band-sec-head">📋 ข้อสอบจริงแบบมาตรฐาน
      <small>โจทย์เลือกตอบแนวข้อสอบจริง ไวยากรณ์ + การอ่านจับใจความ ${EXAM_STD_MANIFEST[keys[0]].sets[0].q} ข้อ/ชุด พร้อมเฉลยละเอียดทุกข้อ ·
        ผ่านแล้ว ${passedN}/${allSets} ชุด</small></div>`
    + keys.map(k=>{
      const m = EXAM_STD_MANIFEST[k];
      const nq = m.sets.reduce((n, s)=>n + s.q, 0);
      const done = m.sets.filter(s=>state.quizPassed.includes(xsQuizId(s.id))).length;
      return `<div class="cat-card band-card">
        <div class="cat-head">
          <span class="cat-emoji">${m.emoji}</span>
          <span class="cat-name">ข้อสอบ ${escapeHTML(m.label)}</span>
          ${done === m.sets.length
            ? '<span class="cat-pass">✅ ผ่านครบทุกชุด</span>'
            : `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 รางวัล ${fmtNum(XS_REWARD)} 🪙</span>`}
        </div>
        <div class="cat-info">${escapeHTML(m.sub)} · ${m.sets.length} ชุด รวม ${nq} ข้อ${done ? ` · ผ่านแล้ว ${done}/${m.sets.length} ชุด` : ''}</div>
        <div class="cat-btns">
          <button class="cat-btn xstd" data-xstd="${k}">📝 เลือกชุดข้อสอบ ${m.sets[0].q} ข้อ · เฉลยละเอียด</button>
        </div>
      </div>`;
    }).join('');
}

/* ============================================================
   🚪 รอบ 813: ทางลัดจากรางเมนูซ้าย (#btn-rail-examstd) — ก่อนหน้านี้ต้องกด
   "หมวดคำศัพท์ & แบบทดสอบ" แล้วเลื่อนหาการ์ดท้ายรายการก่อนถึงจะเจอ 3 สนามสอบ
   แผงเล็กนี้ข้ามขั้นตอนนั้น เลือกสนามสอบแล้วเปิด openExamStdPicker ตรง ๆ
   ============================================================ */
function openExamStdBoard(){
  if(typeof EXAM_STD_MANIFEST === 'undefined') return;
  const keys = Object.keys(EXAM_STD_MANIFEST);
  if(!keys.length) return;
  const old = document.getElementById('xsb-board');
  if(old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'xsb-board'; ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="xsb-box">
    <button class="pl-close" id="xsb-close">✕</button>
    <div class="xsb-head">📋 ข้อสอบจริงแบบมาตรฐาน<span class="xsb-sub">โจทย์เลือกตอบแนวข้อสอบจริง ไวยากรณ์ + การอ่านจับใจความ พร้อมเฉลยละเอียดทุกข้อ</span></div>
    <div class="xsb-grid">${keys.map(k=>{
      const m = EXAM_STD_MANIFEST[k];
      const nq = m.sets.reduce((n, s)=>n + s.q, 0);
      const done = m.sets.filter(s=>state.quizPassed.includes(xsQuizId(s.id))).length;
      return `<button class="xsb-card" data-ex="${k}">
        <span class="xsb-emoji">${m.emoji}</span>
        <span class="xsb-name">${escapeHTML(m.label)}</span>
        <span class="xsb-info">${m.sets.length} ชุด · ${nq} ข้อ</span>
        <span class="xsb-done">${done ? `✅ ผ่านแล้ว ${done}/${m.sets.length}` : `🎁 ${fmtNum(XS_REWARD)} 🪙`}</span>
      </button>`;
    }).join('')}</div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#xsb-close').addEventListener('click', ()=>ov.remove());
  ov.querySelector('.xsb-grid').addEventListener('click', ev=>{
    const b = ev.target.closest('.xsb-card');
    if(!b) return;
    ov.remove();
    openExamStdPicker(b.dataset.ex);
  });
}
(function bindExamStdRail(){
  const bind = ()=>{
    const btn = document.getElementById('btn-rail-examstd');
    if(btn) btn.addEventListener('click', ()=>{ if(typeof closePanel === 'function') closePanel(); openExamStdBoard(); });
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
