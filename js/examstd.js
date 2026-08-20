"use strict";
/* ============================================================
   📋 EXAM STD — ข้อสอบจริงแบบมาตรฐาน IELTS / TOEIC / TOEFL / O-NET (รอบ 812 · O-NET รอบ 1183)
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
const XS_ONET_REWARD = {
  onetp6:{first:2500, again:180}, onetm3:{first:3500, again:250}, onetm6:{first:5000, again:400}
};
function xsIsOnet(exam){ return /^onet/.test(exam || ''); }
function xsReward(exam, first){
  const r = XS_ONET_REWARD[exam];
  return r ? (first ? r.first : r.again) : (first ? XS_REWARD : XS_REWARD_AGAIN);
}
/* ⏱️ เวลาต่อชุด (นาที) — เทียบสัดส่วนจากเวลาจริงของแต่ละสนามสอบ
   โหมด exam/practice = ใช้เป็น "เวลาแนะนำ" เท่านั้น ไม่ตัดจบ (เด็ก/ผู้เริ่มต้นควรได้อ่านจนจบ)
   โหมด timed (รอบ 814) = ใช้เป็น "เวลาจริง" นับถอยหลัง หมดแล้วส่งคำตอบอัตโนมัติ */
const XS_TIME_HINT  = {ielts:45, toeic:25, toefl:40, onetp6:60, onetm3:90, onetm6:90};
const XS_TIME_FALLBACK = 30;        // ถ้ามีสนามสอบใหม่ที่ยังไม่ตั้งเวลาไว้ (กันโหมดจับเวลาไม่มีลิมิต)
function xsLimitSec(exam){ return (XS_TIME_HINT[exam] || XS_TIME_FALLBACK) * 60; }

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
        items.push({q:it.q, c:it.c, a:it.a, ex:it.ex, ref:it.ref || '', tag:it.tag || '', srcI:items.length,
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

/* 📈 รอบ 820: ประวัติ "กี่ครั้งล่าสุด" ของชุดนี้ — เก่าสุดก่อน ใหม่สุดท้าย (อ่านวาดจากซ้ายไปขวา) · เก็บสูงสุด 5 ครั้ง */
const XS_HIST_MAX = 5;
function xsHistory(setId){
  const id = xsQuizId(setId);
  return ((typeof state !== 'undefined' && state.quizLog) || [])
    .filter(l=>l && l.cat === id)
    .sort((a, b)=>(a.ts || 0) - (b.ts || 0))
    .slice(-XS_HIST_MAX);
}
/* กราฟพัฒนาการเล็ก ๆ ในแผงเลือกชุด — เส้นคะแนน (สูง=ดี) + จุดสี (เขียวผ่าน/แดงไม่ผ่าน) ต่อครั้ง
   ต้องมี ≥2 ครั้งถึงจะมี "แนวโน้ม" ให้ดู (ครั้งเดียวมีแค่คะแนนสูงสุด ซึ่ง .xsp-best โชว์อยู่แล้ว) */
function xsHistorySVG(setId){
  const hist = xsHistory(setId);
  if(hist.length < 2) return '';
  const W = 132, H = 30, padX = 7, padY = 5;
  const step = hist.length > 1 ? (W - padX * 2) / (hist.length - 1) : 0;
  const yOf = h=>{
    const pct = h.total ? h.score / h.total : 0;
    return H - padY - pct * (H - padY * 2);
  };
  const pts = hist.map((h, i)=>({x:padX + step * i, y:yOf(h), h}));
  const line = pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dots = pts.map(p=>{
    const t = p.h.sec ? xsFmt(p.h.sec) : '';
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.2" fill="${p.h.passed ? '#6cba57' : '#e6816c'}"
      stroke="#fff" stroke-width="1"><title>${p.h.score}/${p.h.total}${t ? ' · ⏱ ' + t : ''}${p.h.mode === 'timed' ? ' (จับเวลาจริง)' : ''}</title></circle>`;
  }).join('');
  return `<svg class="xsp-hist-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <polyline points="${line}" fill="none" stroke="#b79df0" stroke-width="1.8"/>${dots}
  </svg>`;
}

/* ============================================================
   🖥️ จอสอบ (overlay เต็มจอเอง ไม่ใช้ screen-quiz เดิม)
   XS = สถานะรอบสอบปัจจุบัน · mode 'exam' = ตอบครบแล้วส่ง (ดูเฉลยทีเดียวตอนจบ เหมือนสนามสอบจริง)
                              · mode 'practice' = เฉลยละเอียดทันทีทีละข้อ (โหมดฝึก)
                              · mode 'timed'  = เหมือน exam แต่ "จับเวลาจริง" นับถอยหลังตาม XS_TIME_HINT
                                                หมดเวลา = ส่งคำตอบอัตโนมัติทันที (รอบ 814)
   ⏱️ secSpent[secI] = วินาทีที่ใช้ในแต่ละ "ส่วน" (Part/Section) — เก็บทุกโหมด ใช้ทำสถิติในหน้าเฉลย
   ============================================================ */
const XS = {pack:null, mode:'exam', idx:0, ans:[], startAt:0, done:false,
            limit:0, timeUp:false, warned:{}, secSpent:[], curSec:-1, markAt:0};
let __xsTimer = null;
function xsIsPractice(){ return XS.mode === 'practice'; }   // อีก 2 โหมดพฤติกรรมเหมือนกัน (เฉลยตอนจบ)

/* 🎲 รอบ 1183: กันจดจำเฉลย 1A 2C — สุ่มลำดับส่วน, ข้อในส่วน และตำแหน่งช้อยส์ใหม่ทุกรอบ
   เก็บ signature รอบก่อนต่อชุด เพื่อรับประกันว่ากดฝึก→สอบจริง (หรือสอบซ้ำ) จะไม่ได้ลำดับเดิม */
const __xsLastOrder = {};
function xsShuffle(a){
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function xsRandomizedPack(base){
  const bySec = {};
  base.items.forEach(it=>(bySec[it.secI] || (bySec[it.secI]=[])).push(it));
  const groups = xsShuffle(Object.keys(bySec).map(k=>xsShuffle(bySec[k].slice())));
  let items = groups.flat().map(it=>{
    const pairs = xsShuffle(it.c.map((text,i)=>({text, right:i===it.a})));
    return Object.assign({}, it, {c:pairs.map(x=>x.text), a:pairs.findIndex(x=>x.right)});
  });
  let sig = items.map(x=>x.srcI).join(',');
  if(__xsLastOrder[base.id] === sig && items.length > 1){ items.push(items.shift()); sig = items.map(x=>x.srcI).join(','); }
  __xsLastOrder[base.id] = sig;
  return Object.assign({}, base, {items});
}

function xsTimerStop(){ if(__xsTimer){ clearInterval(__xsTimer); __xsTimer = null; } }
function xsElapsed(){ return XS.startAt ? Math.round((Date.now() - XS.startAt) / 1000) : 0; }
function xsFmt(sec){
  sec = Math.max(0, Math.round(sec));
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}

/* ⏱️ จับเวลาต่อ "ส่วน" — เรียกทุกครั้งที่วาดข้อ: โยนเวลาที่ผ่านมาเข้าส่วนก่อนหน้า แล้วเริ่มนับส่วนใหม่
   (เรียกซ้ำในส่วนเดิมได้ ไม่เพี้ยน เพราะรีเซ็ต markAt ทุกครั้ง) */
function xsMark(secI){
  const now = Date.now();
  if(XS.markAt && XS.curSec >= 0) XS.secSpent[XS.curSec] = (XS.secSpent[XS.curSec] || 0) + (now - XS.markAt) / 1000;
  XS.curSec = secI; XS.markAt = now;
}
/* สรุปต่อส่วน: ชื่อ/จำนวนข้อ/ตอบถูก/เวลาที่ใช้ — ใช้ทั้งกล่องผลสอบและแท็บ "เวลาแต่ละส่วน" */
function xsSecStats(){
  const p = XS.pack;
  if(!p) return [];
  const g = [];
  p.items.forEach((it, i)=>{
    let s = g.find(x=>x.i === it.secI);
    if(!s){ s = {i:it.secI, name:it.secName || `ส่วนที่ ${it.secI + 1}`, q:0, ok:0, sec:0}; g.push(s); }
    s.q++;
    if(XS.ans[i] === it.a) s.ok++;
  });
  g.forEach(s=>{ s.sec = XS.secSpent[s.i] || 0; });
  return g;
}

function examStdStart(setId, mode){
  examStdLoad(setId).then(pack=>{
    if(!pack || !pack.items.length){ toast(xsFailMsg(setId)); return; }
    const ov = document.getElementById('xs-picker');
    if(ov) ov.remove();                       // ปิดแผงเลือกชุดก่อน ไม่ให้บังจอสอบ
    pack = xsRandomizedPack(pack);
    XS.pack = pack;
    XS.mode = (mode === 'practice' || mode === 'timed') ? mode : 'exam';
    XS.idx = 0; XS.ans = new Array(pack.items.length).fill(-1);
    XS.locked = new Array(pack.items.length).fill(false);   // โหมดฝึก: ตอบแล้วล็อก ไม่ให้แก้ย้อน
    XS.startAt = Date.now(); XS.done = false;
    XS.limit = (XS.mode === 'timed') ? xsLimitSec(pack.exam) : 0;
    XS.timeUp = false; XS.warned = {};
    XS.secSpent = []; XS.curSec = -1; XS.markAt = 0;
    xsBuildScreen();
    xsRender();
    if(XS.limit) toast(`⏱️ จับเวลาจริง ${Math.round(XS.limit / 60)} นาที — หมดเวลาระบบส่งคำตอบให้อัตโนมัติ`);
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
      <span class="xs-mode">${XS.mode === 'practice' ? '🎓 โหมดฝึก (เฉลยทันที)'
        : XS.mode === 'timed' ? '⏱️ โหมดสอบจับเวลาจริง' : '📋 โหมดสอบจริง'}</span>
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
    if(XS.limit){                                       // 🕐 โหมดจับเวลาจริง: นับถอยหลัง + ตัดจบเอง
      const left = XS.limit - s;
      el.textContent = `⏳ เหลือ ${xsFmt(Math.max(0, left))} / ${xsFmt(XS.limit)}`;
      el.classList.toggle('warn', left <= 300 && left > 60);
      el.classList.toggle('crit', left <= 60);
      // เตือนก่อนหมดเวลาให้ทันตั้งตัว (ครั้งเดียวต่อรอบ) — เด็กมักเพลินกับบทอ่านยาว
      if(left <= 300 && left > 60 && !XS.warned.m5){ XS.warned.m5 = true; toast('⏳ เหลือเวลา 5 นาที!'); }
      if(left <= 60 && left > 0 && !XS.warned.m1){ XS.warned.m1 = true; toast('⏳ เหลือเวลา 1 นาที — รีบตอบข้อที่เหลือ!'); }
      if(left <= 0){ xsTimerStop(); xsTimeUp(); return; }
      return;
    }
    el.textContent = `⏱️ ${xsFmt(s)}${hint ? ` / แนะนำ ${hint}:00` : ''}`;
    el.classList.toggle('over', !!hint && s > hint * 60);
  };
  tick();
  __xsTimer = setInterval(tick, 1000);
}

/* ⏰ หมดเวลา — ส่งคำตอบให้อัตโนมัติทันที เหมือนกดส่งเอง (ข้อที่ไม่ได้ตอบนับเป็นผิด) */
function xsTimeUp(){
  if(XS.done || !XS.pack) return;
  XS.timeUp = true;
  // ถ้ามีกล่องยืนยัน (ออก/ส่งไม่ครบ) ค้างอยู่ ต้องเก็บก่อน ไม่ให้ทับกล่องผลสอบ
  document.querySelectorAll('.alert-overlay').forEach(o=>o.remove());
  if(typeof toast === 'function') toast('⏰ หมดเวลาแล้ว ส่งคำตอบให้อัตโนมัติ');
  xsFinish();
}

function xsRender(){
  const p = XS.pack, it = p.items[XS.idx], n = p.items.length;
  const picked = XS.ans[XS.idx], locked = XS.locked[XS.idx];
  const reveal = xsIsPractice() && locked;                // โหมดฝึก: เฉลยโผล่ทันทีหลังตอบ
  if(!XS.done) xsMark(it.secI);                           // ⏱️ ปิดยอดเวลาส่วนก่อนหน้า/เริ่มนับส่วนนี้
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
  const AB = ['A','B','C','D','E'];
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
    if(xsIsPractice() && XS.locked[i]) cls += (XS.ans[i] === x.a ? ' ok' : ' no');
    return `<button class="${cls}" data-i="${i}">${i + 1}</button>`;
  }).join('');
  const left = XS.ans.filter(a=>a < 0).length;
  document.getElementById('xs-count').textContent =
    `ข้อ ${XS.idx + 1} / ${n}${left ? ` · ยังไม่ตอบ ${left} ข้อ` : ' · ตอบครบแล้ว'}`;
  if(xsIsPractice()){
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
  send.hidden = xsIsPractice() && !(lastQ && locked);
  send.textContent = xsIsPractice() ? '📊 ดูผลสอบ' : '📨 ส่งคำตอบ';
  /* จอมือถือแนวนอนเตี้ย: กล่องเฉลยละเอียดยาวกว่ากรอบ → เลื่อนให้เห็นเฉลยทันทีที่ตอบ
     (ข้อใหม่ที่ยังไม่ตอบให้เริ่มที่บนสุดเสมอ) */
  const side = document.querySelector('.xs-qside');
  if(reveal) ex.scrollIntoView({block:'nearest'});
  else side.scrollTop = 0;
}

function xsChoose(i){
  if(XS.locked[XS.idx]) return;
  XS.ans[XS.idx] = i;
  if(xsIsPractice()){
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
/* คีย์บอร์ด: 1-5 หรือ a-e เลือกคำตอบ · ←→ เปลี่ยนข้อ · Enter ไปข้อถัดไป */
document.addEventListener('keydown', e=>{
  const sc = document.getElementById('xs-screen');
  if(!sc || XS.done) return;
  const k = e.key.toLowerCase();
  if('12345'.includes(k)){ e.preventDefault(); xsChoose(Number(k) - 1); }
  else if('abcde'.includes(k) && k.length === 1){ e.preventDefault(); xsChoose('abcde'.indexOf(k)); }
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
  XS.pack = null; XS.done = true; XS.limit = 0; XS.markAt = 0;
}
function xsSubmitAsk(){
  const left = XS.ans.filter(a=>a < 0).length;
  if(left && !xsIsPractice()){
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
  xsMark(XS.curSec);                       // ⏱️ ปิดยอดเวลาส่วนสุดท้ายก่อนสรุป
  XS.markAt = 0;                           // หยุดนับ (เวลาที่นั่งอ่านเฉลยไม่นับเข้าส่วนไหน)
  const p = XS.pack, n = p.items.length;
  // โหมดจับเวลา: หมดเวลาแล้วใช้เวลาลิมิตเป๊ะ ๆ (กันเลขเกินลิมิตเพราะ tick คลาดวินาที)
  const secs = (XS.timeUp && XS.limit) ? XS.limit : xsElapsed();
  const unanswered = XS.ans.filter(a=>a < 0).length;
  const correct = p.items.filter((it, i)=>XS.ans[i] === it.a).length;
  const passMark = Math.ceil(n * XS_PASS_PCT);
  const passed = correct >= passMark;
  const cid = xsQuizId(p.id);
  const firstReward = xsReward(p.exam, true), againReward = xsReward(p.exam, false);
  const cat = {id:cid, name:p.label, emoji:p.examMeta.emoji, reward:firstReward};
  const firstPass = passed && !state.quizPassed.includes(cid);
  const prevBestSec = (passed && Array.isArray(state.certs))
    ? ((state.certs.find(c=>c.id === cid) || {}).sec || 0) : 0;

  let coins = 0, rp = 5, myCert = null;
  if(passed){
    coins = firstPass ? firstReward : againReward;
    rp = firstPass ? 120 : 30;
    if(firstPass) state.quizPassed.push(cid);
    addCoins(coins);
    if(typeof questEvent === 'function') questEvent('quiz');
    if(typeof feedEvent === 'function') feedEvent('quiz',
      `สอบผ่านข้อสอบ ${p.label} ${correct}/${n} ข้อ ⏱️ ${xsFmt(secs)} 📋`);   // 🏁 รอบ 815: p.label (มีชื่อชุดต่อท้าย) ไม่ใช่ p.examMeta.label เดิม — กระดานอันดับต้องแยกเป็นรายชุด
    if(typeof certAward === 'function') myCert = certAward(cat, correct, n, secs, XS.mode === 'timed');
    xrkSubmit(p.id, correct, n, secs);       // 🏁 รอบ 825: ลงกระดานอันดับตลอดกาล /examRank/<setId>/<uid> (เก็บเฉพาะสถิติที่ดีที่สุด)
  }
  addRP(rp);
  const made = (typeof addCraft === 'function') ? addCraft(correct) : null;
  state.quizLog.push({cat:cid, score:correct, total:n, passed, ts:Date.now(), sec:secs, mode:XS.mode});
  saveState();
  const newRecord = !!(myCert && myCert.sec === secs && (!prevBestSec || secs < prevBestSec));

  const pct = Math.round(correct / n * 100);
  const scale = xsIsOnet(p.exam) ? `${Math.round(correct / n * 100)}/100 คะแนน` : xsScaleText(p.exam, correct);
  /* ⏱️ ส่วนที่กินเวลาเกินสัดส่วนจำนวนข้อมากที่สุด — ชี้ให้เห็นตรงนี้เลยว่าต้องไปฝึกส่วนไหนให้เร็วขึ้น */
  const stats = xsSecStats();
  const totSec = stats.reduce((a, s)=>a + s.sec, 0);
  let slow = null;
  if(totSec > 5 && stats.length > 1){
    slow = stats.slice().sort((a, b)=>(b.sec / b.q) - (a.sec / a.q))[0];
    slow = {name:slow.name, tp:Math.round(slow.sec / totSec * 100), qp:Math.round(slow.q / n * 100)};
  }
  const ov = document.createElement('div');
  ov.className = 'levelup-overlay';
  ov.innerHTML = `<div class="levelup-box xs-result">
    <h2>${XS.timeUp ? '⏰ หมดเวลาแล้ว!' : passed ? '🏆 สอบผ่าน เก่งมาก!' : '💪 ยังไม่ผ่าน แต่ใกล้แล้ว!'}</h2>
    <div class="lv-emoji">${XS.timeUp ? '⏰' : passed ? '🎉' : '📖'}</div>
    ${XS.timeUp ? `<div class="xs-rtimeup">ระบบ<b>ส่งคำตอบให้อัตโนมัติ</b>เมื่อหมดเวลา${
      unanswered ? ` · ข้อที่ยังไม่ได้ตอบ ${unanswered} ข้อ นับเป็นผิด` : ' · ตอบครบทุกข้อก่อนหมดเวลา 👏'}</div>` : ''}
    <div class="xs-rscore">${p.examMeta.emoji} ${escapeHTML(p.label)}<br>
      ตอบถูก <b>${correct}/${n}</b> ข้อ (${pct}%)</div>
    ${scale ? `<div class="xs-rscale">📊 คะแนนเทียบโดยประมาณ: <b>${escapeHTML(scale)}</b>
      <small>เป็นการเทียบคร่าว ๆ จากชุดฝึกนี้เท่านั้น ไม่ใช่คะแนนทางการของสนามสอบ</small></div>` : ''}
    <div class="xs-rrow">⏱️ ใช้เวลา <b>${xsFmt(secs)}</b>${XS.limit ? ` / ${xsFmt(XS.limit)}` : ''} (เฉลี่ยข้อละ ${(secs / n).toFixed(1)} วิ)${
      newRecord ? (prevBestSec ? ` — <b style="color:#e07b39">🏁 ทำลายสถิติเดิม ${xsFmt(prevBestSec)}!</b>` : ' — <b style="color:#e07b39">🏁 สถิติแรกของชุดนี้!</b>')
      : (prevBestSec ? ` · สถิติดีที่สุด ${xsFmt(prevBestSec)}` : '')}</div>
    <div class="xs-rrow">${passed
      ? `รับ +${fmtNum(coins)} 🪙 +${rp} RP${firstPass ? ' 🎁 (ผ่านครั้งแรกของชุดนี้!)' : ''}`
      : `ได้กำลังใจ +${rp} RP 💪 ต้องตอบถูก <b>${passMark}</b> ข้อขึ้นไปถึงจะผ่าน — ลองใหม่ได้ไม่จำกัด`}
      ${made ? `<br>🏭 แต้มผลิต +${correct} — <b>ผลิตสำเร็จ!</b> 🎉` : ''}</div>
    ${slow ? `<div class="xs-rslow">🐢 ส่วนที่กินเวลาที่สุด: <b>${escapeHTML(slow.name)}</b>
      — ใช้ ${slow.tp}% ของเวลา แต่มีแค่ ${slow.qp}% ของข้อ<span class="xs-rslow-tip"> ·
      ดูครบทุกส่วนที่แท็บ <b>⏱️ เวลาแต่ละส่วน</b> ในเฉลย</span></div>` : ''}
    ${myCert ? `<div class="lv-cert-row">🎖️ ได้รับ <b>ใบประกาศ Vocab World</b> เก็บไว้ในโปรไฟล์แล้ว
      <button class="lv-cert-btn" type="button">ดูใบประกาศ</button></div>` : ''}
    <div class="xs-actions">
      ${passed ? `<button class="xs-rank-btn" type="button">🏁 ดูอันดับ</button>` : ''}
      <button class="xs-review-btn" type="button">ดูเฉลยละเอียด 📖</button>
    </div>
  </div>`;
  if(myCert){
    const cb = ov.querySelector('.lv-cert-btn');
    if(cb) cb.addEventListener('click', e=>{ e.stopPropagation(); openCertBig(myCert); });
  }
  const rankBtn = ov.querySelector('.xs-rank-btn');
  if(rankBtn) rankBtn.addEventListener('click', ()=>{ ov.remove(); openExamStdRank(p.exam, p.id); });
  ov.querySelector('.xs-review-btn').addEventListener('click', ()=>{
    ov.remove();
    xsShowReview();                      // เฉลยละเอียดทุกข้อ (จอสอบยังอยู่เบื้องหลังเป็นฉาก)
  });
  document.body.appendChild(ov);
  if(passed && typeof sfx !== 'undefined') sfx.levelup(); else if(typeof sfx !== 'undefined') sfx.wrong();
  if(made && typeof showCollectReveal === 'function') setTimeout(()=>showCollectReveal(made, null, true), 600);
}

/* 📖 เฉลยละเอียดหลังสอบ — ค่าเริ่มต้นโชว์ "ข้อที่ผิด" ก่อน (สิ่งที่ต้องทบทวนจริง) สลับดูทุกข้อได้
   ต้องมีเสมอไม่ว่าผ่านหรือไม่ผ่าน เพราะหัวใจของข้อสอบมาตรฐานคือเข้าใจว่าทำไมตัวลวงผิด */
/* ⏱️ ตารางเวลาแต่ละส่วน — แถบสี = สัดส่วน "เวลา" ที่ใช้ · ขีด = สัดส่วน "จำนวนข้อ" ของส่วนนั้น
   แถบยาวเกินขีด = ส่วนนั้นกินเวลากว่าที่ควร (คือส่วนที่ต้องฝึกให้เร็วขึ้น) */
function xsTimeTableHTML(){
  const p = XS.pack;
  const st = xsSecStats(), n = p.items.length;
  const tot = st.reduce((a, s)=>a + s.sec, 0);
  if(tot < 1) return `<div class="xsr-none">ยังไม่มีข้อมูลเวลาพอจะสรุปได้ (ทำข้อสอบเร็วมาก 😄)</div>`;
  return `<div class="xst-wrap">
    <div class="xst-note">แถบสี = <b>สัดส่วนเวลา</b>ที่ใช้ในส่วนนั้น · ขีดตั้ง = <b>สัดส่วนจำนวนข้อ</b><span class="xst-tip"> ·
      แถบยาวเลยขีดมาก = ส่วนนั้นกินเวลากว่าที่ควร ควรฝึกส่วนนั้นให้เร็วขึ้น</span></div>
    ${st.map(s=>{
      const tp = s.sec / tot * 100, qp = s.q / n * 100;
      const r  = tp / (qp || 1);
      const v  = r >= 1.25 ? ['slow','🐢 ช้ากว่าสัดส่วนข้อ'] : r <= 0.8 ? ['fast','⚡ เร็วกว่าสัดส่วนข้อ'] : ['even','✅ พอดีกับสัดส่วนข้อ'];
      return `<div class="xst-row ${v[0]}">
        <div class="xst-h"><b>${escapeHTML(s.name)}</b><span class="xst-tag">${v[1]}</span></div>
        <div class="xst-bar"><i style="width:${Math.min(100, tp).toFixed(1)}%"></i><u style="left:${Math.min(99.5, qp).toFixed(1)}%"></u></div>
        <div class="xst-n">⏱️ ${xsFmt(s.sec)} (${Math.round(tp)}% ของเวลา) · ${s.q} ข้อ (${Math.round(qp)}% ของข้อ) ·
          ข้อละ ${(s.sec / s.q).toFixed(1)} วิ · ตอบถูก ${s.ok}/${s.q}</div>
      </div>`;
    }).join('')}
    <div class="xst-sum">รวมเวลาทั้งชุด ⏱️ <b>${xsFmt(tot)}</b>${XS.limit ? ` จากเวลาที่ให้ ${xsFmt(XS.limit)}` : ''}
      ${XS.timeUp ? ' · ⏰ รอบนี้หมดเวลาก่อนทำครบ' : ''}</div>
  </div>`;
}

function xsShowReview(){
  const p = XS.pack;
  if(!p) return;
  const AB = ['A','B','C','D','E'];
  let tab = 'wrong';
  const ov = document.createElement('div');
  ov.id = 'xs-review'; ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="xsr-box">
    <button class="pl-close" id="xsr-close">✕</button>
    <div class="xsr-head">📖 เฉลยละเอียด · ${escapeHTML(p.label)}
      <span class="xsr-sub">อ่านเฉลยให้ครบก่อนสอบรอบหน้า — ตัวลวงของข้อสอบมาตรฐานมักซ้ำรูปแบบเดิม</span></div>
    <div class="xsr-tabs">
      <button class="xsr-tab on" data-t="wrong">❌ ข้อที่ตอบผิด</button>
      <button class="xsr-tab" data-t="all">📋 ทุกข้อ (${p.items.length})</button>
      <button class="xsr-tab" data-t="time">⏱️ เวลาแต่ละส่วน</button>
    </div>
    <div class="xsr-list" id="xsr-list"></div>
    <div class="xsr-foot"><button class="xsr-ok" id="xsr-ok">เข้าใจแล้ว ปิด</button></div>
  </div>`;
  const draw = ()=>{
    const list = ov.querySelector('#xsr-list');
    if(tab === 'time'){ list.innerHTML = xsTimeTableHTML(); list.scrollTop = 0; return; }
    const rows = p.items.map((it, i)=>({it, i, ok:XS.ans[i] === it.a}))
                        .filter(r=>tab !== 'wrong' || !r.ok);
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
    tab = b.dataset.t;
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
  const onet = xsIsOnet(exam), firstReward = xsReward(exam, true), againReward = xsReward(exam, false);
  const old = document.getElementById('xs-picker');
  if(old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'xs-picker'; ov.className = 'pl-overlay';
  const passMark = s=>Math.ceil(s.q * XS_PASS_PCT);
  ov.innerHTML = `<div class="xsp-box${onet ? ' onet-picker' : ''}">
    <button class="pl-close" id="xsp-close">${onet ? '✕ ออก' : '✕'}</button>
    <div class="xsp-head">${m.emoji} ${onet ? 'ตะลุยข้อสอบ O-NET' : 'ข้อสอบจริงแบบมาตรฐาน'} · ${escapeHTML(m.label)}
      <button class="bax-rank" id="xsp-rank">🏁 อันดับ</button>
      <span class="xsp-sub">${escapeHTML(m.sub)} · ${m.sets.length} ชุด × ${m.sets[0].q} ข้อ · ทุกข้อมีเฉลยละเอียด
        <br>⏱️ เวลาของสนามสอบนี้ ${Math.round(xsLimitSec(exam) / 60)} นาที/ชุด (2 โหมดแรกเป็นเวลาแนะนำ ไม่ตัดจบ · โหมดจับเวลาจริงตัดจบอัตโนมัติ) ·
        ผ่านที่ ${Math.round(XS_PASS_PCT * 100)}% ขึ้นไป รับ ${fmtNum(firstReward)} 🪙 + ใบประกาศ 🎖️${onet ? ` · ผ่านซ้ำยังได้ ${fmtNum(againReward)} 🪙` : ''}</span></div>
    <div class="xsp-rows">${m.sets.map(s=>{
      const best = xsBest(s.id);
      const done = state.quizPassed.includes(xsQuizId(s.id));
      const hist = xsHistorySVG(s.id);                  // 📈 รอบ 820: เห็นได้ก็ต่อเมื่อสอบชุดนี้ ≥2 ครั้ง
      return `<div class="xsp-set${done ? ' done' : ''}">
        <div class="xsp-name">${escapeHTML(s.label)}${done ? ' <span class="xsp-tick">✅ ผ่านแล้ว</span>' : ''}</div>
        <div class="xsp-info">${s.q} ข้อ · ${s.passages} บทอ่าน · ${s.secs.map(x=>`${escapeHTML(x.n.split('·').pop().trim())} ${x.q} ข้อ`).join(' · ')}</div>
        <div class="xsp-best-row">
          <div class="xsp-best">${best ? `คะแนนสูงสุด <b>${best.s}/${best.t}</b>${best.sec ? ` · ⏱️ ${xsFmt(best.sec)}` : ''} · ผ่านที่ ${passMark(s)} ข้อ`
            : `ยังไม่เคยสอบชุดนี้ · ผ่านที่ ${passMark(s)} ข้อ`}</div>
          ${hist ? `<div class="xsp-hist" title="พัฒนาการคะแนน ${xsHistory(s.id).length} ครั้งล่าสุด (เก่า→ใหม่)">${hist}<small>📈 ${xsHistory(s.id).length} ครั้งล่าสุด</small></div>` : ''}
        </div>
        <div class="xsp-btns">
          <button class="xsp-go exam" data-set="${s.id}" data-mode="exam">📋 ${onet ? 'สอบจริง' : 'สอบจริง (เฉลยตอนจบ)'}</button>
          <button class="xsp-go practice" data-set="${s.id}" data-mode="practice">🎓 ${onet ? 'โหมดฝึก' : 'โหมดฝึก (เฉลยทันทีทุกข้อ)'}</button>
          <button class="xsp-go timed" data-set="${s.id}" data-mode="timed"
            ><span class="xsp-lg">⏱️ สอบจับเวลาจริง ${Math.round(xsLimitSec(exam) / 60)} นาที · หมดเวลาส่งอัตโนมัติ + สถิติเวลาต่อส่วน</span
            ><span class="xsp-sm">⏱️ จับเวลาจริง ${Math.round(xsLimitSec(exam) / 60)} นาที</span></button>
        </div>
      </div>`;
    }).join('')}</div>
    <div class="xsp-foot">📝 ข้อสอบชุดนี้ <b>เขียนขึ้นใหม่ทั้งหมดตามรูปแบบและแนวข้อสอบจริง</b> (ไม่ใช่ข้อสอบเก่าของสนามสอบ) ·
      ${onet ? 'อิง Test Blueprint O-NET ปีการศึกษา 2569 ของ สทศ. · สุ่มทั้งลำดับข้อและตำแหน่งตัวเลือกใหม่ทุกรอบ' : 'เป็นข้อสอบแบบเลือกตอบ ไวยากรณ์ + การอ่านจับใจความ ไม่มีส่วนเขียนเรียงความ'}</div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#xsp-close').addEventListener('click', ()=>ov.remove());
  ov.querySelector('#xsp-rank').addEventListener('click', ()=>openExamStdRank(exam));
  ov.querySelector('.xsp-rows').addEventListener('click', ev=>{
    const b = ev.target.closest('.xsp-go');
    if(!b) return;
    toast('⏳ กำลังเปิดชุดข้อสอบ...');
    examStdStart(b.dataset.set, b.dataset.mode || 'exam');
  });
}

/* ============================================================
   🏁 กระดานอันดับ "ข้อสอบจริงคะแนนสูงสุด/เร็วสุด" (รอบ 815 · 🆕 รอบ 825 = อันดับตลอดกาลจริง)
   หน้าตาเหมือนเดิมทุกอย่าง (bxrRowHTML/BXR_TOP + คลาส .bxr-* ของ js/bandadv.js · ไม่เพิ่ม CSS ใหม่)
   เปลี่ยนเฉพาะ "แหล่งข้อมูล":
     เดิม (815) = พาร์สข้อความโพสต์จากฟีดรวม Online.gfeed (120 โพสต์ล่าสุดทั้งเกม) + ใบประกาศของตัวเอง
       ⇒ เป็นอันดับ "จากกิจกรรมล่าสุด" เท่านั้น — คนที่สอบผ่านนานแล้วโพสต์หลุด 120 โพสต์ = หายจากกระดานคนอื่น
     ใหม่ (825) = **โซน DB ใหม่ `/examRank/<setId>/<uid> = {sc,tt,sec,n,g,ts}`** เก็บถาวรรายชุด
       ⇒ อันดับตลอดกาลจริง ไม่ผูกกับฟีดที่หมุนออก
   🔑 ตรรกะ "เก็บเฉพาะสถิติที่ดีที่สุดของแต่ละคนต่อชุด" ย้ายจากฝั่งอ่าน (put() เดิม) มาทำ **ฝั่งเขียน**
      (xrkSubmit ใน xsFinish) → ฝั่งอ่านมี 1 แถวต่อคนอยู่แล้ว ไม่ต้องยุบซ้ำ
   ⚠️ ต้อง publish rules โซน /examRank ก่อนถึงเขียน/อ่านได้ — **ยังไม่ publish = เกมไม่พัง**:
      โดน deny → Online.xrkOk=false → กระดานยังเห็นสถิติของตัวเอง (จากใบประกาศ state.certs)
      + xrkNote() ขึ้นป้ายบอกตรง ๆ ว่าติดอะไร (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ)
   ⇒ เรียง "คะแนนสูงสุดก่อน แล้วเวลาเร็วสุดตัดสินเมื่อคะแนนเท่ากัน" (ต่างจาก bxRankRows เดิมที่เรียงเวลาอย่างเดียว)
   ============================================================ */
const XRK_READ    = 50;      // ดึงมากสุดกี่แถว/ชุด (โชว์ Top 8 + แถวเราเสมอ → 50 เหลือเฟือ ไม่ต้องโหลดทั้งตาราง)
const XRK_ALL     = '_*';    // 🆕 รอบ 826: คีย์กระดาน "รวมทุกชุด" ของสนามสอบ (เช่น 'ielts_*') — ใช้ที่เดียวกับ setId ปกติทั้งระบบ
const __xrkCache  = {};      // setId (หรือ <exam>_*) → แถวที่เรียงแล้ว (null/ไม่มี = ยังไม่โหลด → กระดานขึ้น "กำลังโหลด")
const __xrkPend   = {};      // setId → Promise ที่โหลดค้างอยู่ (กันยิงซ้ำตอนกดชิปรัว)
const xrkIsAll    = k=>String(k || '').endsWith(XRK_ALL);
const xrkAllExam  = k=>String(k || '').slice(0, -XRK_ALL.length);

/* 📝 ฝั่งเขียน — เรียกตอนสอบผ่านใน xsFinish() · เก็บเฉพาะสถิติที่ดีที่สุด (คะแนนก่อน แล้วเวลา)
   อ่านแถวเดิมของตัวเองก่อน 1 ครั้ง แล้วเขียนทับเมื่อดีกว่าเท่านั้น — DB จึงมี 1 แถว/คน/ชุดเสมอ */
function xrkSubmit(setId, sc, tt, sec){
  if(typeof Online === 'undefined' || !Online.ready || !Online.db) return Promise.resolve(false);
  const uid = (typeof onlineKey === 'function') ? onlineKey() : '';
  if(!uid || !setId || !tt) return Promise.resolve(false);
  if(typeof isTester === 'function' && isTester())
    return Online.db.ref('examRank/' + setId + '/' + uid).remove().then(()=>false).catch(()=>false);
  const bs  = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';   // 🎖️ เข็มต่อท้ายชื่อ เหมือน leaderboard
  const row = {
    sc, tt, sec,
    n: (((typeof onlineDisplayName === 'function' ? onlineDisplayName() : '') || 'ผู้เล่น') + bs).slice(0, 40),
    g: (state.student && state.student.grade) || '',
    ts: Date.now(),
  };
  const ref = Online.db.ref('examRank/' + setId + '/' + uid);
  return ref.get().then(s=>{
    const o = s && s.val();
    if(o && typeof o.sc === 'number' && o.tt
      && !(sc / tt > o.sc / o.tt || (sc / tt === o.sc / o.tt && sec < (o.sec || 0)))) return false;   // ของเดิมดีกว่า/เท่ากัน
    return ref.set(row).then(()=>{
      Online.xrkOk = true;
      delete __xrkCache[setId];        // กระดานชุดนี้ต้องโหลดใหม่ (เห็นสถิติใหม่ของเราทันที)
      const f = xsFindSet(setId);
      if(f) delete __xrkCache[f.exam + XRK_ALL];   // + กระดาน "รวมทุกชุด" ของสนามสอบนั้น
      return true;
    });
  }).catch(()=>{ Online.xrkOk = false; return false; });   // rules ยังไม่ publish / ออฟไลน์ → ป้ายบนกระดานบอกเอง
}

/* รวมแถวจาก DB กับใบประกาศของตัวเอง แล้วเรียงอันดับ
   ใบประกาศ (state.certs) เก็บสถิติที่ดีที่สุดของเราอยู่แล้ว → เขียน DB ไม่ผ่าน/ออฟไลน์ ก็ยังเห็นแถวตัวเองเสมอ */
function xrkMerge(setId, rows){
  const me = (typeof onlineKey === 'function') ? onlineKey() : 'me';
  const visible = rows.filter(r=>!(typeof rankUserExcluded === 'function' && rankUserExcluded(r.uid, r.name)));
  const out = visible.filter(r=>r.uid !== me);
  let my = visible.find(r=>r.uid === me) || null;
  const cert = (typeof state !== 'undefined' && Array.isArray(state.certs))
    ? state.certs.find(c=>c.id === xsQuizId(setId) && c.sec) : null;
  if(cert && cert.tt){
    const c = {uid:me, name:(typeof onlineDisplayName === 'function' ? onlineDisplayName() : '') || (state.student && state.student.name) || 'หนู',
               g:(state.student && state.student.grade) || '', sc:cert.sc, tt:cert.tt, sec:cert.sec, ts:cert.ts || 0};
    if(!my || c.sc / c.tt > my.sc / my.tt || (c.sc / c.tt === my.sc / my.tt && c.sec < my.sec)) my = c;
  }
  if(my && !(typeof isTester === 'function' && isTester())){ my.me = true; out.push(my); }
  return out.sort((a, b)=>(b.sc / b.tt - a.sc / a.tt) || (a.sec - b.sec));
}

/* 🏅 รอบ 826: อันดับ "รวมทุกชุด" ของสนามสอบเดียว — รวมแถวรายชุดที่โหลดไว้แล้วมาบวกกัน (ไม่ยิง query ใหม่เกินจำเป็น
   เพราะ xrkFetch รายชุดมี cache อยู่แล้ว) · 1 คน 1 แถว: ชุดที่ผ่าน / คะแนนรวม / เวลารวม
   ⇒ เรียง **จำนวนชุดที่ผ่านมากก่อน** แล้วค่อยสัดส่วนคะแนนรวม แล้วเวลารวมน้อยสุด
      (ถ้าเรียงสัดส่วนก่อน คนสอบผ่านชุดเดียวเต็ม 30/30 จะแซงคนที่ผ่าน 5 ชุด = ไม่ตรงความหมายของ "รวมทุกชุด") */
function xrkAllRows(exam){
  const m = (typeof EXAM_STD_MANIFEST !== 'undefined') ? EXAM_STD_MANIFEST[exam] : null;
  if(!m) return Promise.resolve([]);
  return Promise.all(m.sets.map(s=>xrkFetch(s.id))).then(lists=>{
    const by = {};
    lists.forEach(rows=>(rows || []).forEach(r=>{
      const o = by[r.uid] || (by[r.uid] = {uid:r.uid, name:r.name, g:r.g, sc:0, tt:0, sec:0, ts:0, sets:0, me:!!r.me});
      o.sc += r.sc; o.tt += r.tt; o.sec += r.sec; o.sets++;
      if((r.ts || 0) >= o.ts){ o.ts = r.ts || 0; o.name = r.name; o.g = r.g; }   // ชื่อ/ชั้นเอาจากแถวล่าสุด
    }));
    return Object.keys(by).map(u=>by[u])
      .sort((a, b)=>(b.sets - a.sets) || (b.sc / b.tt - a.sc / a.tt) || (a.sec - b.sec));
  });
}

/* 📖 ฝั่งอ่าน — query /examRank/<setId> เอา 50 คะแนนสูงสุด (ต้องมี ".indexOn":"sc" ใน rules)
   แล้วเรียงคะแนน→เวลาเองฝั่ง client (RTDB เรียงได้ทีละคีย์เดียว) · cache ต่อชุด กดชิปสลับไปมาไม่ยิงซ้ำ
   คีย์ที่ลงท้าย XRK_ALL ('<exam>_*') = กระดานรวมทุกชุด (ประกอบจาก cache รายชุด ผ่าน xrkAllRows) */
function xrkFetch(setId){
  if(__xrkCache[setId]) return Promise.resolve(__xrkCache[setId]);
  if(__xrkPend[setId])  return __xrkPend[setId];
  if(xrkIsAll(setId)){
    const pa = xrkAllRows(xrkAllExam(setId)).then(rows=>{ __xrkCache[setId] = rows; delete __xrkPend[setId]; return rows; });
    __xrkPend[setId] = pa;
    return pa;
  }
  const fin = rows=>{ __xrkCache[setId] = rows; delete __xrkPend[setId]; return rows; };
  if(typeof Online === 'undefined' || !Online.ready || !Online.db) return Promise.resolve(fin(xrkMerge(setId, [])));
  const p = Online.db.ref('examRank/' + setId).orderByChild('sc').limitToLast(XRK_READ + 2).get().then(s=>{
    const v = (s && s.val()) || {}, out = [];
    Object.keys(v).forEach(u=>{
      const r = v[u];
      if(!r || typeof r.sc !== 'number' || !r.tt) return;
      out.push({uid:u, name:r.n || 'เพื่อน', g:r.g || '', sc:r.sc, tt:r.tt, sec:Number(r.sec) || 0, ts:r.ts || 0});
    });
    Online.xrkOk = true;
    return fin(xrkMerge(setId, out));
  }).catch(()=>{ Online.xrkOk = false; return fin(xrkMerge(setId, [])); });
  __xrkPend[setId] = p;
  return p;
}

/* คำอธิบายแหล่งข้อมูลของกระดานนี้โดยเฉพาะ — ห้ามใช้ bxRankNote() ร่วมกับกระดานสอบใหญ่ (js/bandadv.js)
   เพราะกระดานนั้นยังเป็น "จากกิจกรรมล่าสุด" อยู่ ส่วนกระดานนี้เป็นอันดับตลอดกาลจริงแล้ว (รอบ 825) */
function xrkNote(){
  if(typeof Online === 'undefined' || !Online.ready)
    return '📴 ตอนนี้ออฟไลน์ — เห็นเฉพาะสถิติของหนูเอง ต่อเน็ตแล้วจะเห็นของเพื่อนด้วย';
  if(Online.xrkOk === false)
    return '⚠️ กระดานกลางยังไม่เปิด (ต้องอัปเดตกฎความปลอดภัยโซน /examRank ก่อน) — ตอนนี้เห็นเฉพาะสถิติของหนูเอง';
  return xrkIsAll(__xrkSet)
    ? '🏅 อันดับตลอดกาล "รวมทุกชุด" ของสนามสอบนี้ · ยิ่งสอบผ่านหลายชุดยิ่งได้อันดับดี'
    : '🏆 อันดับตลอดกาลของชุดนี้ · เก็บสถิติที่ดีที่สุดของทุกคนที่เคยสอบผ่าน (ไม่หายไปตามเวลา)';
}
/* ป้ายบอกแหล่งข้อมูลอยู่ "นอก" กล่องที่ xrkMount วาด (หัวป๊อปอัป + .lbf-note ของแท็บเต็มจอ ใช้ id เดียวกัน
   เพราะเปิดได้ทีละใบ) → อ่าน DB เสร็จค่อยรู้ว่าติด deny ไหม จึงต้องเขียนป้ายใหม่ตอนนั้น */
function xrkNoteRefresh(){
  /* `.lbf-note` = ทางถอย เผื่อ js/ui.js ที่ขึ้นเว็บอยู่ยังเป็นเวอร์ชันก่อนรอบ 825 (ยังไม่มี id="xrk-note")
     — แท็บ xr เท่านั้นที่เรียก xrkMount จึงไม่ไปทับป้ายของแท็บอื่น */
  const el = document.getElementById('xrk-note') || document.querySelector('.lbf-note');
  if(el) el.textContent = xrkNote();
}

/* แถวของกระดานรวมทุกชุด — ใช้ bxrRowHTML เดิมทั้งแถว (ชื่อเล่น+สัญลักษณ์ระดับชั้น = กฎคุ้มครองเด็ก เขียนที่เดียว)
   แล้วแทรก "N ชุด ·" หน้าคะแนนรวมใน .bxr-sc เท่านั้น — ไม่เพิ่มคลาส/CSS ใหม่ */
function xrkAllRowHTML(r, i){
  return bxrRowHTML(r, i).replace('<span class="bxr-sc">', `<span class="bxr-sc">${r.sets} ชุด · `);
}
/* เนื้อกระดาน — วาดแถวด้วย bxrRowHTML ของ js/bandadv.js เลย (ฟอร์แมตเดียวกัน ไม่เขียนซ้ำ) */
function xrkBodyHTML(setId){
  const rows = __xrkCache[setId];
  const all  = xrkIsAll(setId);
  if(!rows) return `<div class="bxr-none">⏳ กำลังโหลดอันดับตลอดกาล${all ? 'รวมทุกชุดของสนามสอบนี้' : 'ของชุดนี้'}…</div>`;
  if(!rows.length){
    return `<div class="bxr-none">ยังไม่มีใครสอบผ่าน${all ? 'สนามสอบนี้' : 'ชุดนี้'}เลย — สอบผ่านคนแรกแล้วขึ้นกระดานเลย! 🏁</div>`;
  }
  const row  = all ? xrkAllRowHTML : bxrRowHTML;
  const top  = rows.slice(0, (typeof BXR_TOP !== 'undefined') ? BXR_TOP : 8);
  const meAt = rows.findIndex(r=>r.me);
  return top.map(row).join('')
    + (meAt >= top.length ? `<div class="bxr-more">…</div>${row(rows[meAt], meAt)}` : '');
}
/* 🏁 ตัวกระดาน (ชิปเลือกสนามสอบ + ชุด + รายชื่อ) — ใช้คลาส .bxr-* ร่วมกับ js/bandadv.js ทั้งชุด */
let __xrkExam = '', __xrkSet = '';
function xrkMount(box, exam, initialSetId){
  if(!box || typeof EXAM_STD_MANIFEST === 'undefined') return;
  const keys = Object.keys(EXAM_STD_MANIFEST);
  if(!keys.length) return;
  __xrkExam = (exam && EXAM_STD_MANIFEST[exam]) ? exam : (EXAM_STD_MANIFEST[__xrkExam] ? __xrkExam : keys[0]);
  if(initialSetId && EXAM_STD_MANIFEST[__xrkExam].sets.find(s=>s.id === initialSetId))
    __xrkSet = initialSetId;              // 🏁 รอบ 827: ถ้าส่ง initialSetId มา (เช่น ชุดที่เพิ่งสอบ) ให้เปิดชุดนั้นแทน
  else if(__xrkSet !== __xrkExam + XRK_ALL && !EXAM_STD_MANIFEST[__xrkExam].sets.find(s=>s.id === __xrkSet))
    __xrkSet = __xrkExam + XRK_ALL;      // 🏅 รอบ 826: ค่าเริ่มต้น = กระดานรวมทุกชุดของสนามสอบนั้น
  const draw = ()=>{
    const m = EXAM_STD_MANIFEST[__xrkExam];
    xrkNoteRefresh();                   // ป้ายแหล่งข้อมูล (แก้ทับให้เองแม้ ui.js ยังเป็นเวอร์ชันเก่า) — ต้องอัปเดตทุกครั้งที่วาด เพราะข้อความต่างกันระหว่าง "รวมทุกชุด" กับรายชุด
    box.innerHTML = `
      <div class="bxr-pick">
        <div class="bxr-cats">${keys.map(k=>`<button class="bxr-chip${k === __xrkExam ? ' on' : ''}" data-exam="${k}">${EXAM_STD_MANIFEST[k].emoji} ${escapeHTML(EXAM_STD_MANIFEST[k].label)}</button>`).join('')}</div>
        <div class="bxr-lvs"><button class="bxr-chip lv${__xrkSet === __xrkExam + XRK_ALL ? ' on' : ''}" data-set="${__xrkExam}${XRK_ALL}">🏅 รวมทุกชุด</button>${
          m.sets.map(s=>`<button class="bxr-chip lv${s.id === __xrkSet ? ' on' : ''}" data-set="${s.id}">${escapeHTML(s.label.split('·').pop().trim())}</button>`).join('')}</div>
      </div>
      <div class="bxr-list">${xrkBodyHTML(__xrkSet)}</div>
      <div class="bxr-foot">${m.emoji} ${escapeHTML(m.label)} · ${xrkIsAll(__xrkSet)
        ? `รวมทุกชุดที่เคยสอบผ่าน (${m.sets.length} ชุด × ${m.sets[0].q} ข้อ) · เรียง<b>จำนวนชุดที่ผ่านมากที่สุด</b> → คะแนนรวม → เวลารวมน้อยสุด`
        : 'เรียงคะแนนสูงสุดก่อน แล้วเวลาเร็วสุดตัดสินเมื่อคะแนนเท่ากัน (เวลาบนกระดาน = ตัวเดียวกับที่พิมพ์บนใบประกาศ)'}</div>`;
    /* ยังไม่มีข้อมูลชุดนี้ในเครื่อง → โหลดจาก DB แล้ววาดซ้ำ (กล่องต้องยังอยู่บนจอ + ยังเลือกชุดเดิมอยู่) */
    if(!__xrkCache[__xrkSet]){
      const want = __xrkSet;
      xrkFetch(want).then(()=>{ xrkNoteRefresh(); if(__xrkSet === want && box.isConnected) draw(); });
    }
    box.querySelector('.bxr-pick').addEventListener('click', ev=>{
      const b = ev.target.closest('.bxr-chip');
      if(!b) return;
      if(b.dataset.exam){ __xrkExam = b.dataset.exam; __xrkSet = __xrkExam + XRK_ALL; }   // สลับสนามสอบ = กลับไปกระดานรวมทุกชุดของสนามนั้น
      else if(b.dataset.set) __xrkSet = b.dataset.set;
      if(typeof sfx !== 'undefined' && sfx.click) sfx.click();
      draw();
    });
  };
  draw();
}
/* แผงป๊อปอัป (เปิดจากปุ่ม 🏁 อันดับ ในแผงเลือกชุดข้อสอบ หรือจากกล่องผลสอบ) — กล่อง/หัวใช้ .bxr-box/.bxr-head เดิมจาก css/style.css เลย ไม่เพิ่ม CSS ใหม่ */
function openExamStdRank(exam, setId){
  const old = document.getElementById('xrk-overlay');
  if(old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'xrk-overlay'; ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="bxr-box">
      <button class="pl-close" id="xrk-close">✕</button>
      <div class="bxr-head">🏁 ข้อสอบจริงคะแนนสูงสุด/เร็วสุด<span class="bxr-sub" id="xrk-note">${xrkNote()}</span></div>
      <div class="bxr-body"></div>
    </div>`;
  document.body.appendChild(ov);
  xrkMount(ov.querySelector('.bxr-body'), exam, setId);
  ov.addEventListener('click', e=>{ if(e.target === ov) ov.remove(); });
  ov.querySelector('#xrk-close').addEventListener('click', ()=>ov.remove());
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
        3 โหมด: สอบจริง / ฝึก (เฉลยทันที) / ⏱️ จับเวลาจริงตัดจบอัตโนมัติ · ผ่านแล้ว ${passedN}/${allSets} ชุด</small></div>`
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
            : `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 รางวัล ${fmtNum(xsReward(k, true))} 🪙</span>`}
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
function openExamStdBoard(onlyKeys, title){
  if(typeof EXAM_STD_MANIFEST === 'undefined') return;
  const keys = (onlyKeys || Object.keys(EXAM_STD_MANIFEST)).filter(k=>EXAM_STD_MANIFEST[k]);
  if(!keys.length) return;
  const old = document.getElementById('xsb-board');
  if(old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'xsb-board'; ov.className = 'pl-overlay';
  const onetOnly = keys.length && keys.every(xsIsOnet);
  ov.innerHTML = `<div class="xsb-box${onetOnly ? ' onet-board' : ''}">
    <button class="pl-close" id="xsb-close">✕ ออก</button>
    <div class="xsb-head">${onetOnly ? '🇹🇭 ' : '📋 '}${escapeHTML(title || 'ข้อสอบจริงแบบมาตรฐาน')}<span class="xsb-sub">${onetOnly ? 'เลือกระดับชั้น · 5 ชุดต่อระดับ · รูปแบบและเวลาตรงตาม Test Blueprint สทศ. 2569' : 'โจทย์เลือกตอบแนวข้อสอบจริง พร้อมเฉลยละเอียดทุกข้อ'}</span></div>
    <div class="xsb-grid">${keys.map(k=>{
      const m = EXAM_STD_MANIFEST[k];
      const nq = m.sets.reduce((n, s)=>n + s.q, 0);
      const done = m.sets.filter(s=>state.quizPassed.includes(xsQuizId(s.id))).length;
      return `<button class="xsb-card" data-ex="${k}">
        <span class="xsb-emoji">${m.emoji}</span>
        <span class="xsb-name">${escapeHTML(m.label)}</span>
        <span class="xsb-info">${m.sets.length} ชุด · ${nq} ข้อ</span>
        <span class="xsb-done">${done ? `✅ ผ่านแล้ว ${done}/${m.sets.length}` : `🎁 ${fmtNum(xsReward(k, true))} 🪙`}</span>
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
function openOnetBoard(){ openExamStdBoard(['onetp6','onetm3','onetm6'], 'O-NET ภาษาอังกฤษ'); }
// 🇹🇭 รอบ 1184: CTA จากป้ายหลัง login อยู่คนละไฟล์ จึงเปิดทางเข้าแบบ explicit บน window
window.openOnetBoard = openOnetBoard;
(function bindExamStdRail(){
  const bind = ()=>{
    const btn = document.getElementById('btn-rail-examstd');
    if(btn) btn.addEventListener('click', ()=>{ if(typeof closePanel === 'function') closePanel(); openExamStdBoard(); });
    const onet = document.getElementById('btn-rail-onet');
    if(onet) onet.addEventListener('click', ()=>{ if(typeof closePanel === 'function') closePanel(); openOnetBoard(); });
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
