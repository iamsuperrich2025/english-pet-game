"use strict";
/* ============================================================
   UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
   ============================================================ */

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function fmtNum(n){ return n.toLocaleString('en-US'); }   // 25000 → "25,000"

/* escape ก่อนแทรกข้อความลง innerHTML — ใช้กับข้อความจากผู้เล่นคนอื่น (ชื่อบน
   presence/leaderboard มาจาก DB) กันสคริปต์/แท็กแฝง (ข้อ 0.2) */
function escapeHTML(s){
  return String(s == null ? '' : s)
    .replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ============================================================
   🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
   เหตุผล: กันปั๊มเหรียญด้วยการ "โกงระดับชั้น" (เลือกชั้นต่ำเพื่อทำคำง่าย ๆ)
   → ทุกที่ที่มีชื่อผู้เล่นต้องเห็นระดับชั้นของเขาด้วย
   กติกาสัญลักษณ์: ดาวเงิน ★ = ประถม · ดาวทอง ★ = มัธยม · จำนวนดาว = ชั้นปี
                   💎 1 เม็ด = ปริญญาตรี (2 เม็ด = สูงกว่าปริญญาตรี) · ☆ = ต่ำกว่าประถม
   ⚠️ ที่นี่ที่เดียวทั้งเกม — ui.js เรียกใช้ทุกจุด (ฟีด/โปรไฟล์/กระดานอันดับ/รายชื่อเพื่อน/แถบบน)
   ============================================================ */
function gradeSymbol(grade){
  const g = String(grade == null ? '' : grade).trim();
  if(!g) return null;
  let m = /^ป\.([1-6])$/.exec(g);
  if(m) return {cls:'gm-silver', sym:'★'.repeat(+m[1]), cat:'ประถมศึกษา',
                title:`ระดับชั้น ${g} — ดาวเงิน ${m[1]} ดวง (ประถมศึกษาปีที่ ${m[1]})`};
  m = /^ม\.([1-6])$/.exec(g);
  if(m) return {cls:'gm-gold', sym:'★'.repeat(+m[1]), cat:'มัธยมศึกษา',
                title:`ระดับชั้น ${g} — ดาวทอง ${m[1]} ดวง (มัธยมศึกษาปีที่ ${m[1]})`};
  if(g === 'ปริญญาตรี')        return {cls:'gm-gem', sym:'💎',   cat:'ปริญญาตรี',        title:'ระดับชั้น ปริญญาตรี — เพชร 1 เม็ด'};
  if(g === 'สูงกว่าปริญญาตรี') return {cls:'gm-gem', sym:'💎💎', cat:'สูงกว่าปริญญาตรี', title:'ระดับชั้น สูงกว่าปริญญาตรี — เพชร 2 เม็ด'};
  if(g === 'ต่ำกว่าประถมศึกษา')return {cls:'gm-pre', sym:'☆',    cat:'ต่ำกว่าประถมศึกษา', title:'ระดับชั้น ต่ำกว่าประถมศึกษา — ดาวโปร่ง'};
  return {cls:'gm-pre', sym:'☆', cat:g, title:'ระดับชั้น ' + g};
}
/* HTML ป้ายสัญลักษณ์ (คืน '' ถ้าไม่รู้ชั้น — จุดที่เรียกไม่ต้องเช็กเอง) */
function gradeMark(grade, extraCls){
  const s = gradeSymbol(grade);
  if(!s) return '';
  return `<span class="gmark ${s.cls}${extraCls ? ' ' + extraCls : ''}" title="${escapeHTML(s.title)}"`
       + ` aria-label="${escapeHTML(s.title)}">${s.sym}</span>`;
}
/* ชื่อ + สัญลักษณ์ "ใต้ชื่อ" เป็นก้อนเดียว (ใช้ในบรรทัดที่ข้อความไหลต่อท้ายชื่อ เช่น ฟีด)
   nameHTML ต้อง escape มาแล้ว */
function nameWithGrade(nameHTML, grade){
  const mk = gradeMark(grade);
  return mk ? `<span class="gm-stack">${nameHTML}${mk}</span>` : nameHTML;
}
/* 🖼️ รอบ 644: วาดสัญลักษณ์ลงบน canvas — ป้ายชื่อลอยเหนือหัวในโลก 3D (ไม่ใช่ DOM จึงใช้ CSS ไม่ได้)
   คืน true เมื่อวาดจริง (ผู้เรียกใช้ตัดสินใจว่าจะขยายกล่องป้ายไหม) */
function gradeMarkCanvas(c, grade, x, y, size){
  const s = gradeSymbol(grade);
  if(!s || !c) return false;
  c.save();
  c.font = 'bold ' + size + 'px system-ui,sans-serif';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  if(s.cls === 'gm-gold'){ c.fillStyle = '#ffd451'; c.shadowColor = 'rgba(255,170,30,.95)'; }
  else if(s.cls === 'gm-gem'){ c.fillStyle = '#9fe8ff'; c.shadowColor = 'rgba(120,225,255,.95)'; }
  else { c.fillStyle = '#e8eef6'; c.shadowColor = 'rgba(130,175,225,.95)'; }
  c.shadowBlur = size * .4;
  c.fillText(s.sym, x, y);
  c.restore();
  return true;
}
/* หาระดับชั้นจาก uid เมื่อจุดที่เรียกไม่มีค่า g ติดมา (เพื่อนที่บันทึกไว้ตั้งแต่ก่อนมีฟิลด์ g)
   ไล่จาก: ค่าที่ส่งมา → ตัวเราเอง → กระดานอันดับ → คนออนไลน์ → รายชื่อเพื่อน */
function gradeOf(uid, g){
  if(g) return g;
  const id = String(uid || '');
  if(!id) return '';
  if(typeof onlineKey === 'function' && id === onlineKey() && typeof state !== 'undefined' && state.student)
    return state.student.grade || '';
  if(typeof Online === 'undefined') return '';
  const pick = (arr, key)=>{
    const r = (arr || []).find(x=> String(x[key] || '') === id);
    return r && r.g ? r.g : '';
  };
  return pick(Online.board, 'id') || pick(Online.friends, 'id') || pick(Online.myFriends, 'uid') || '';
}

/* สุ่มแบบกำหนด seed ได้ (mulberry32) — ให้ทุกเครื่องเห็นผลเดียวกันในช่วงเวลาเดียวกัน */
function seededRand(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}

/* 🇹🇭 รอบ 988: ผูกโซน Asia/Bangkok (thLocaleOpt ใน js/thaitime.js) — เครื่องที่ตั้งไทม์โซนต่างประเทศ
   เคยเห็นวัน/เวลาผิดไปเป็นชั่วโมง/ข้ามวัน ทั้งที่ข้อความเขียนว่า "น." */
function fmtThaiDT(ts){
  return new Date(ts).toLocaleString('th-TH',
    thLocaleOpt({day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})) + ' น.';
}
function fmtThaiDate(ts){
  return new Date(ts).toLocaleDateString('th-TH', thLocaleOpt({day:'numeric', month:'short', year:'numeric'}));
}

/* ---------- screen navigation ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  // 🧭 รอบ 602: กลับเข้าล็อบบี้ = รางเมนูซ้ายเด้งกลับบนสุดเสมอ (ปุ่มอยู่ที่เดิมทุกครั้ง ไม่ต้องตามหา)
  if(id === 'screen-dashboard' && typeof railScrollTop === 'function') railScrollTop();
}

/* ---------- FX ---------- */
// คำเตือน/ทำรายการไม่สำเร็จ → ค้างจนผู้ใช้กดปิด · ข้อความแจ้งสำเร็จ → หายเอง
const TOAST_WARN_RE = /ไม่สำเร็จ|ไม่พอ|ไม่ได้|ไม่มี|ยังไม่|หมดเวลา|หมดอายุ|ลองใหม่|ป่วย|ให้ครบ|มากกว่า 0|อินเทอร์เน็ต|ต้อง.{0,20}ก่อน|⚠️|❌|🚫|💔|⏰|🤒/;
let lastWrongAt = 0;                       // กันเสียงเตือนซ้ำ (call site เรียก sfx.wrong ก่อน toast อยู่แล้ว)
const nowMs = ()=> (window.performance ? performance.now() : Date.now());
function restackToasts(){
  /* 🔗 รอบ 974: toast แบบมีลิงก์ (.toast-link) เข้ากองเดียวกับคำเตือน = ไม่ทับกันเวลามีหลายใบ
     แต่ clearWarnToasts ยังกวาดแค่ .toast-warn เหมือนเดิม (ลิงก์แจ้งเตือนไม่โดนล้างทิ้งกลางทาง) */
  const list = [...document.querySelectorAll('.toast-warn, .toast-link')];
  let b = 76;                              // ตรงกับ bottom ใน .toast (css)
  for(let i = list.length - 1; i >= 0; i--){   // อันใหม่สุดอยู่ล่างสุด อันเก่าดันขึ้นไป
    list[i].style.bottom = b + 'px';
    b += list[i].offsetHeight + 10;
  }
  // ปุ่ม "ปิดทั้งหมด" — โผล่เมื่อมีคำเตือนซ้อน ≥2 อัน วางเหนือกอง
  let clr = document.getElementById('toast-clear-all');
  if(list.length >= 2){
    if(!clr){
      clr = document.createElement('button');
      clr.id = 'toast-clear-all'; clr.className = 'toast-clear-all';
      clr.textContent = '✕ ปิดทั้งหมด';
      clr.onclick = ()=>{ document.querySelectorAll('.toast-warn').forEach(t=>t.remove()); restackToasts(); };
      document.body.appendChild(clr);
    }
    clr.style.bottom = b + 'px';
  }else if(clr){
    clr.remove();
  }
}
/* 🧹 รอบ 941: ล้าง toast คำเตือนที่ค้างอยู่ (toast-warn ค้างจนกดปิดเอง) — เรียกเมื่อเงื่อนไขที่เตือนถูกแก้แล้ว
   re = กรองเฉพาะข้อความที่เข้า pattern · ไม่ส่ง = ล้างทั้งหมด (เช่น ตอนเข้าโลก 3D ป้ายเตือนของล็อบบี้ถือว่าหมดหน้าที่) */
function clearWarnToasts(re){
  document.querySelectorAll('.toast-warn').forEach(t=>{ if(!re || re.test(t.textContent)) t.remove(); });
  restackToasts();
}
function toast(msg, ms=1800){
  const t = document.createElement('div');
  // 💰 รอบ 859 (ผู้ใช้สั่ง): ms=0 = บังคับค้างจนผู้เล่นกดปิดเอง (ใช้กับแจ้งเรื่องเงินตอนบูต — เดิมหายก่อนอ่านทัน)
  const warn = TOAST_WARN_RE.test(msg);
  if(warn || ms === 0){
    t.className = 'toast toast-warn';
    const span = document.createElement('span');
    span.className = 'toast-msg'; span.textContent = msg;
    const x = document.createElement('button');
    x.className = 'toast-x'; x.textContent = '✕'; x.setAttribute('aria-label','ปิด');
    x.onclick = ()=>{ t.remove(); restackToasts(); };
    t.appendChild(span); t.appendChild(x);
    document.body.appendChild(t);
    if(warn){   // ข่าวเงินเข้า (ms=0 แต่ไม่ใช่คำเตือน) ไม่ต้องเล่นเสียงผิด/สั่น
      if(nowMs() - lastWrongAt > 200 && typeof sfx !== 'undefined') sfx.wrong();  // เสียงเตือน (ไม่ซ้ำถ้าเพิ่งเล่นไป)
      if(state.haptic !== false && navigator.vibrate) navigator.vibrate(50);      // สั่นเบาๆ (สวิตช์แยกจากเสียง)
    }
    restackToasts();                       // ค้างไว้ ไม่ตั้ง setTimeout
    return;
  }
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), ms);
}
/* 🔗 รอบ 974 (ผู้ใช้สั่ง 3 ส.ค. 2026): แถบแจ้งเตือนที่พ่วง "ลิงก์ไปดูต้นเรื่อง"
   กติกาที่ผู้ใช้ย้ำ: ผู้ใช้ "เลือกได้" ว่าจะกดหรือไม่กด → ไม่กดก็หายเองตามเวลา ไม่บังคับ ไม่เด้งหน้าจอเอง
   อยู่ที่นี่ (util.js) เพราะ toast/restackToasts อยู่ที่นี่ — ใช้ซ้ำกับเรื่องอื่นที่มี "ต้นเรื่อง" ได้ */
function toastLink(msg, label, fn, ms = 7000){
  const t = document.createElement('div');
  t.className = 'toast toast-link';
  const s = document.createElement('span');
  s.className = 'toast-msg'; s.textContent = msg;
  const go = document.createElement('button');
  go.className = 'toast-go'; go.type = 'button'; go.textContent = label || '🔗 ไปดูต้นเรื่อง';
  const close = ()=>{ t.remove(); restackToasts(); };
  go.onclick = ()=>{ close(); try{ if(fn) fn(); }catch(e){} };
  const x = document.createElement('button');
  x.className = 'toast-x'; x.textContent = '✕'; x.setAttribute('aria-label','ปิด');
  x.onclick = close;
  t.appendChild(s); t.appendChild(go); t.appendChild(x);
  document.body.appendChild(t);
  restackToasts();
  if(ms > 0) setTimeout(()=>{ if(t.parentNode) close(); }, ms);
  return t;
}
function floatFx(text, color){
  const f = document.createElement('div');
  f.className = 'float-fx'; f.textContent = text;
  if(color) f.style.color = color;
  document.body.appendChild(f);
  setTimeout(()=>f.remove(), 1000);
}

/* ---------- SOUND (WebAudio — ไม่ต้องใช้ไฟล์เสียง) ---------- */
let audioCtx = null;
let keyTapComp = null;   // 🔊 limiter เฉพาะเสียงกดแป้น กัน clip ตอน gain สูง (รอบ)
function beep(freq, dur, delay=0, type='sine', vol=0.15){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    /* 🔊 รอบ 755: AudioContext ถูก "suspended" ได้หลายกรณี — เปิดหน้าเว็บมาก่อนแตะจอ (มือถือ/iOS
       เข้มเรื่องนี้มาก), สลับแท็บ/ล็อกจอแล้วกลับมา, หรือเบราว์เซอร์พักเอง → beep() เดิม "สร้างโน้ตสำเร็จ
       ไม่มี error แต่ไม่มีเสียงออกลำโพงเลย" = เงียบทั้งเกมแบบเงียบ ๆ หาไม่เจอ
       โลก 3D/เพลง ทุกตัวมี resume ของตัวเองอยู่แล้ว แต่ beep() (เสียง UI ทั้งเกม) ไม่เคยมี — เติมที่นี่ที่เดียวจบ */
    if(audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
    const t = audioCtx.currentTime + delay;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + dur);
  }catch(e){}
}
/* 🔎 รอบ 755 (กฎทองข้อ 1 — ห้ามเดาข้ามเครื่อง): บอกบนจอเลยว่า "ทำไมไม่มีเสียง"
   คืนข้อความสั้น ๆ เมื่อเสียงออกไม่ได้ · คืน '' เมื่อทุกอย่างปกติ (ไม่ต้องโชว์อะไร)
   ใช้ที่จุดที่ผู้ใช้ "คาดหวังจะได้ยินเสียง" เช่น ตอบควิซถูกแล้วได้เหรียญ */
function soundStatus(){
  if(!state.sound) return '🔇 เสียงปิดอยู่ — เปิดที่ปุ่มลำโพงมุมบน';
  try{
    if(typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended')
      return '🔇 เบราว์เซอร์ยังไม่อนุญาตให้เล่นเสียง — แตะหน้าจอ 1 ครั้งแล้วลองใหม่';
  }catch(e){}
  return '';
}
const sfx = {
  select : ()=>{ beep(660,.12); },
  correct: ()=>{ beep(660,.12); beep(880,.18,.1); },
  wrong  : ()=>{ lastWrongAt = nowMs(); beep(180,.25,0,'sawtooth',.08); },
  coin   : ()=>{ beep(1320,.1,.05,'triangle'); },
  levelup: ()=>{ [523,659,784,1047].forEach((f,i)=>beep(f,.2,i*.13)); },
  buy    : ()=>{ beep(880,.1); beep(1175,.15,.08); },
  rankup : ()=>{ [392,523,659,784,1047,1319].forEach((f,i)=>beep(f,.25,i*.11,'triangle',.18)); },
  spark  : ()=>{ playSpark(); },   // ⚡ ฟ้าผ่า/กระแสไฟ (จับคู่ครบใน 5 วิ / สอบสายฟ้า)
  siren  : ()=>{ sirenSynth(); },  // 🚨 หวอเบาๆ ตอนน้องเพิ่งล้มป่วย
  cashier: ()=>{ playCashier(); }, // 🛒 จ่ายเงินสำเร็จที่แคชเชียร์ (ซื้อของโรงงาน/ตลาดเพื่อน)
  petVoice: (type, mood)=>{ petVoiceSynth(type, mood); },  // 🐾 เสียงร้องของน้องตามชนิด+อารมณ์ (แตะน้องในล็อบบี้)
  /* ☎️ รอบ 630: เสียงคู่ของระบบโทร (กริ่งใช้ไฟล์จริง — 2 ตัวนี้สังเคราะห์ เพราะเป็นเสียงสั้นแบบ UI)
     callOn  = "ต่อติดแล้ว" 2 โน้ตไต่ขึ้นนุ่ม ๆ (เดิมยืม sfx.correct ของข้อสอบมาใช้ ฟังแล้วเหมือนตอบถูก)
     callOff = "ปุ๊ก" วางสาย 2 โน้ตตกลงต่ำ ปิดท้ายเบา — บอกว่าสายจบแล้วโดยไม่ตกใจ */
  callOn : ()=>{ beep(784,.12,0,'triangle',.13); beep(1175,.18,.1,'triangle',.12); },
  callOff: ()=>{ beep(523,.1,0,'sine',.12);      beep(392,.2,.09,'sine',.11); },
  /* 🪙 รอบ 327: "เหรียญเข้ากระเป๋า" — ชัดกว่า sfx.coin เดิม (จิ๊งเดียว)
     กรุ๊งกริ๊งไต่ขึ้น 3 ตัว + ตัวปิดเสียงใส = รู้ทันทีว่าได้เหรียญจริง ไม่ใช่แค่เสียงกดปุ่ม */
  coinGet: ()=>{ [880, 1175, 1568].forEach((f,i)=>beep(f, .12, i*.07, 'triangle', .17));
                 beep(2093, .22, .22, 'sine', .10); },
  /* 🪙 รอบ 598: เหรียญเข้ากระเป๋า "ไล่ระดับตามความยาวคำ" (ใช้ในเกม Word Search)
     tier 0 = คำสั้น 3-5 ตัว (เสียงเท่า coinGet เดิมเป๊ะ) · 1 = 6-7 ตัว · 2 = 8-10 ตัว
     คำยิ่งยาว = โน้ตเยอะขึ้น ไต่สูงขึ้น ยาวขึ้น → รู้สึกคุ้มกว่าตามรางวัลที่ได้จริง */
  coinGetTier: (tier)=>{
    const T=[{n:[880,1175,1568],           tail:2093},
             {n:[880,1175,1568,1976],      tail:2349},
             {n:[784,1047,1319,1760,2093], tail:2637}];
    const s=T[Math.max(0, Math.min(2, tier|0))];
    s.n.forEach((f,i)=>beep(f, .12, i*.07, 'triangle', .17));
    beep(s.tail, .22, s.n.length*.07+.01, 'sine', .10);
  },
  /* 🔥 รอบ 601: เสียงคอมโบ (Word Search — หาคำติดกันเร็ว ๆ) ซ้อนบนเสียงเหรียญ
     คอมโบยิ่งยาว ระดับเสียงยิ่งไต่สูงขึ้นทีละครึ่งเสียง (ตันที่คอมโบ 10) */
  combo: (n)=>{
    const k=Math.max(0, Math.min(8, (n|0)-2));           // คอมโบ 2 = ขั้นแรก
    const f=880*Math.pow(1.09, k);
    [f, f*1.26, f*1.5].forEach((x,i)=>beep(x, .14, i*.05, 'triangle', .15));
    beep(f*2, .26, .16, 'sine', .09);
  },
  /* ⌨️ รอบ 648: เสียงกดคีย์บอร์ดจริง (เกมพิมพ์คำศัพท์) — ต้องสั้นมากและไม่ล้า เพราะกดรัว ๆ ทีละสิบครั้ง
     down (up=false) = กดลงสุด: ช็อตนอยส์ "แคร่ก" + ตุบต่ำตอนแป้นชนฐาน · up = ปล่อยเด้งขึ้น เบา/แหลมกว่า
     bright=true (แป้นตัวถัดไปถูก) ปรับสีเสียงให้สดขึ้นเล็กน้อย ไม่ใช่เสียงคนละตัว */
  keyTap : (up, bright)=>{ keyTapSynth(!!up, !!bright); },
  /* 🫧 เสียงฟอง: transient สั้น + resonance แบบหยดน้ำ สุ่ม pitch เล็กน้อยกันฟังเป็นเครื่องจักร */
  bubblePop: (size)=>{ bubblePopSynth(size); },
  bubbleTap: ()=>{ bubbleTapSynth(); },
  /* 🎉 รอบ 598: เก็บคำครบทั้งกระดาน (Word Search) — แฟนแฟร์ไต่ 4 ตัว + คอร์ดปิดค้าง
     (เดิม sfx.win ไม่มีจริง โค้ดเลยตกไปใช้ sfx.coin = จิ๊งเดียว ไม่สมกับการเก็บครบทั้งกระดาน) */
  win: ()=>{
    [523, 659, 784, 1047].forEach((f,i)=>beep(f, .18, i*.10, 'triangle', .18));
    [1047, 1319, 1568].forEach(f=>beep(f, .55, .44, 'triangle', .12));   // คอร์ดปิด
    beep(2093, .5, .5, 'sine', .08);
  },
};

/* ---------- 🌧️ เสียงฝนตกเบาๆ วนลูป (รอบ 963) ----------
   สังเคราะห์ล้วนด้วย WebAudio ไม่ใช้ไฟล์เสียง: white noise ผ่าน lowpass ตัดความถี่สูงออก
   เหลือเสียง "ซ่าาา" นุ่มๆ + LFO ไล่ความดังช้าๆ กันฟังดูราบเรียบจนน่าเบื่อ
   เริ่ม/หยุดตาม rainFxTick() (ui.js) — ตราบใดที่เอฟเฟกต์ฝนเต็มจอกำลังแสดงอยู่
   มีสวิตช์แยกของตัวเอง (state.rainSound) นอกเหนือจากสวิตช์เสียงหลัก (state.sound) */
const RainSound = {
  src: null, lp: null, gain: null, lfo: null, lfoGain: null,
  start(){
    if(this.src || !state.sound || state.rainSound === false) return;
    try{
      audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      const c = audioCtx;
      if(c.state === 'suspended') c.resume().catch(()=>{});
      const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
      const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = 0.4;
      const g = c.createGain(); g.gain.value = 0;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.11;      // ความดังไหวช้าๆ เหมือนลมพัดฝนโชย
      const lfoGain = c.createGain(); lfoGain.gain.value = 0.018;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      src.connect(lp); lp.connect(g); g.connect(c.destination);
      src.start(); lfo.start();
      g.gain.setTargetAtTime(0.055, c.currentTime, 1.2);                 // ค่อยๆ ดังขึ้น ไม่โผล่มาทันที
      this.src = src; this.lp = lp; this.gain = g; this.lfo = lfo; this.lfoGain = lfoGain;
    }catch(e){}
  },
  stop(){
    if(!this.src) return;
    const {src, lfo, gain} = this;
    try{
      gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
      setTimeout(()=>{ try{ src.stop(); lfo.stop(); }catch(e){} try{ gain.disconnect(); }catch(e){} }, 900);
    }catch(e){}
    this.src = null; this.lp = null; this.gain = null; this.lfo = null; this.lfoGain = null;
  },
  refresh(){    // เรียกตอนสลับสวิตช์เสียง/สวิตช์ฝนในหน้าตั้งค่า — ปิดทันทีถ้าปิดสวิตช์ใดสวิตช์หนึ่ง
    if(!state.sound || state.rainSound === false) this.stop();
    else if(document.getElementById('rain-fx')) this.start();
  },
};

/* ---------- 🐾 เสียงร้องของน้องตามชนิด + อารมณ์ (รอบ 322 · ปรับตามอารมณ์รอบ 323) ----------
   ชนิด: แมว = เหมียว (สระไต่ขึ้นแล้วตกยาว + lowpass ปิดลง) · หมา = โฮ่ง 2 พัลส์ + noise
         มังกร = คำรามต่ำ (saw ต่ำ + noise) · ชนิดใหม่ที่ยังไม่มีเสียงเฉพาะ = จิ๊บสั้นเป็นกลาง
   อารมณ์ (mood — ui.js ส่งมาจาก p.sick / p.sleeping / petHungry(p)):
     happy  = อิ่มสบายดี → เสียงสูงขึ้น สั้นกระชับ ดังกว่า (สดใส)
     hungry = หิว        → เสียงต่ำลง ยาวขึ้น เบาลง (ออดอ้อน)
     sick   = ป่วย       → ต่ำและอ่อยที่สุด ยาวเอื่อย (ไม่มีแรง)
     sleep  = หลับอยู่   → เบามาก เสียงต่ำสั้น (ละเมอ ไม่ปลุกทั้งบ้าน)
   ทำด้วยตัวคูณ 3 ตัว (pitch/แรง/ความยาว) กับสูตรเสียงชุดเดิม — ไม่ต้องเขียนเสียงใหม่ทุกอารมณ์
   คุมความดังไว้ต่ำ (เกมเด็ก ไม่ให้ตกใจ) และเคารพสวิตช์เสียงเหมือน beep() */
const PET_MOOD = {
  normal:{p:1,    v:1,   d:1   },
  happy: {p:1.12, v:1.15, d:.88},
  hungry:{p:.86,  v:.72, d:1.25},
  sick:  {p:.74,  v:.55, d:1.45},
  sleep: {p:.8,   v:.4,  d:1.1 },
};
function petVoiceSynth(type, mood){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const ctx = audioCtx, t0 = ctx.currentTime;
    const M = PET_MOOD[mood] || PET_MOOD.normal;
    const F = hz => hz * M.p;            // ความถี่ (อารมณ์ดี=สูงขึ้น · ป่วย/หิว=ต่ำลง)
    const V = v  => v  * M.v;            // ความดัง (ป่วย/หลับ=เบาลง)
    const D = s  => s  * M.d;            // ความยาว (ป่วย/หิว=ลากยาวกว่า)
    const noiseBuf = (ms)=>{             // ก้อน noise สั้นๆ ใช้ผสมให้เสียงมีเนื้อ
      const n = Math.ceil(ctx.sampleRate*ms/1000);
      const b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
      for(let i=0;i<n;i++) d[i] = (Math.random()*2-1)*(1-i/n);
      return b;
    };
    if(type === 'cat'){
      // เหมียว~ : ไต่ขึ้นนิดแล้วตกยาว · ตอนป่วย/หิว ตัวคูณจะทำให้กลายเป็น "เหมี้ยว..." ต่ำยาวอ่อยเอง
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(F(520), t0);
      o.frequency.linearRampToValueAtTime(F(760), t0+D(.10));
      o.frequency.linearRampToValueAtTime(F(430), t0+D(.42));
      f.type = 'lowpass';
      f.frequency.setValueAtTime(F(2200), t0);
      f.frequency.linearRampToValueAtTime(F(900), t0+D(.42));
      g.gain.setValueAtTime(.0001, t0);
      g.gain.linearRampToValueAtTime(V(.12), t0+D(.06));
      g.gain.exponentialRampToValueAtTime(.001, t0+D(.45));
      o.connect(f); f.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0+D(.46));
    }else if(type === 'dog'){
      // โฮ่ง โฮ่ง : 2 พัลส์ (ป่วย/หลับเหลือเสียงเดียว = ไม่มีแรงเห่ารัว)
      const beats = (mood === 'sick' || mood === 'sleep') ? [0] : [0, D(.19)];
      beats.forEach(dt=>{
        const t = t0 + dt;
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = 'square';
        o.frequency.setValueAtTime(F(300), t);
        o.frequency.exponentialRampToValueAtTime(F(140), t+D(.13));
        f.type = 'lowpass'; f.frequency.setValueAtTime(F(1500), t);
        g.gain.setValueAtTime(V(.14), t);
        g.gain.exponentialRampToValueAtTime(.001, t+D(.14));
        o.connect(f); f.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t+D(.15));
        const ns = ctx.createBufferSource(), ng = ctx.createGain();
        ns.buffer = noiseBuf(60);
        ng.gain.setValueAtTime(V(.05), t);
        ng.gain.exponentialRampToValueAtTime(.001, t+D(.06));
        ns.connect(ng); ng.connect(ctx.destination);
        ns.start(t); ns.stop(t+D(.07));
      });
    }else if(type === 'dragon'){
      // คำรามต่ำๆ (ไม่ดุจนเด็กกลัว) · ป่วย = ครางเบาๆ ยาวกว่าเดิม
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(F(110), t0);
      o.frequency.linearRampToValueAtTime(F(78), t0+D(.55));
      f.type = 'lowpass'; f.frequency.setValueAtTime(F(700), t0);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.linearRampToValueAtTime(V(.13), t0+D(.09));
      g.gain.exponentialRampToValueAtTime(.001, t0+D(.62));
      o.connect(f); f.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0+D(.63));
      const ns = ctx.createBufferSource(), ng = ctx.createGain(), nf = ctx.createBiquadFilter();
      ns.buffer = noiseBuf(500);
      nf.type = 'lowpass'; nf.frequency.setValueAtTime(F(400), t0);
      ng.gain.setValueAtTime(V(.05), t0);
      ng.gain.exponentialRampToValueAtTime(.001, t0+D(.5));
      ns.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
      ns.start(t0); ns.stop(t0+D(.52));
    }else{
      beep(F(700), D(.14), 0, 'triangle', V(.10));   // ชนิดใหม่ที่ยังไม่มีเสียงเฉพาะ
    }
  }catch(e){}
}

/* ---------- 🚨 เสียงหวอเบาๆ (วี้-หว่อ 2 รอบ เสียงนุ่มไม่ทำเด็กตกใจ) ---------- */
function sirenSynth(){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(620, t);
    o.frequency.linearRampToValueAtTime(920, t+.35);
    o.frequency.linearRampToValueAtTime(620, t+.7);
    o.frequency.linearRampToValueAtTime(920, t+1.05);
    o.frequency.linearRampToValueAtTime(620, t+1.4);
    g.gain.setValueAtTime(.055, t);
    g.gain.setValueAtTime(.055, t+1.25);
    g.gain.exponentialRampToValueAtTime(.001, t+1.5);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t+1.5);
  }catch(e){}
}

/* ---------- 🛒 เสียงแคชเชียร์ "จ่ายเงินสำเร็จ" (ชิ้ง! ลิ้นชักเปิด + กระดิ่ง + เหรียญกรุ๊งกริ๊ง) ----------
   ชั้น 1: ไฟล์ sound/cashier.mp3 (prompt เจนเสียงใน PROMPTS_SOUND.md หัวข้อ cashier)
   ชั้น 2 (ไม่มีไฟล์): สังเคราะห์ WebAudio — แกร๊กลิ้นชัก + กริ๊งกริ๊งกระดิ่ง + เศษเหรียญท้าย */
let cashierAudio = null, cashierFileMiss = false;
function playCashier(){
  if(!state.sound) return;
  if(!cashierFileMiss){
    try{
      cashierAudio = cashierAudio || new Audio('sound/cashier.mp3');
      cashierAudio.onerror = ()=>{ cashierFileMiss = true; cashierSynth(); };
      cashierAudio.currentTime = 0;
      const p = cashierAudio.play();
      if(p && p.catch) p.catch(()=>{ cashierFileMiss = true; cashierSynth(); });
      return;
    }catch(e){ cashierFileMiss = true; }
  }
  cashierSynth();
}
function cashierSynth(){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    // แกร๊ก — ลิ้นชักเงินเปิด (ช็อตเสียงซ่าสั้นผ่าน lowpass)
    const len = Math.ceil(audioCtx.sampleRate*.09);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = (Math.random()*2-1)*(1-i/len);
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const lp = audioCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 950;
    const ng = audioCtx.createGain(); ng.gain.value = .22;
    src.connect(lp); lp.connect(ng); ng.connect(audioCtx.destination); src.start(t);
    // กริ๊ง-กริ๊ง — กระดิ่งแคชเชียร์ 2 ที (โน้ตสูง + harmonic ให้ใสเหมือนโลหะ)
    [.10,.24].forEach(at=>{
      [[2093,.13],[2093*2.4,.05]].forEach(([fq,v])=>{
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'triangle'; o.frequency.value = fq;
        g.gain.setValueAtTime(v, t+at);
        g.gain.exponentialRampToValueAtTime(.001, t+at+.5);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t+at); o.stop(t+at+.5);
      });
    });
    // เศษเหรียญกรุ๊งกริ๊งตกท้ายเสียง
    [1568,1976,2637].forEach((fq,i)=>beep(fq,.08,.36+i*.06,'triangle',.07));
  }catch(e){}
}

/* ---------- ⌨️ เสียงกดคีย์บอร์ด (รอบ 648 · เกมพิมพ์คำศัพท์ js/typing.js) ----------
   คีย์บอร์ดจริงมี 2 เสียงต่อการกด 1 ครั้ง: "แคร่ก" ตอนกดลง + "แป๊ะ" เบา ๆ ตอนปล่อยเด้งขึ้น
   ทำเป็นนอยส์สั้น 15-30 ms ผ่าน bandpass (เสียงพลาสติกกระทบ) + ตุบไซน์ต่ำเฉพาะจังหวะกดลง
   ⚠️ ห้ามยาวกว่านี้ — เด็กกดรัวทีละสิบครั้ง เสียงยาว = ทับกันเละและล้าหู */
function keyTapSynth(up, bright){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    if(!keyTapComp){   // 🔊 gain รวมตอนนี้ >1 (เสียงดังขึ้น 3 เท่าซ้อน) ต้องมี limiter กันเสียงแตก
      keyTapComp = audioCtx.createDynamicsCompressor();
      keyTapComp.threshold.value=-20; keyTapComp.knee.value=10; keyTapComp.ratio.value=10;
      keyTapComp.attack.value=.001; keyTapComp.release.value=.05;
      keyTapComp.connect(audioCtx.destination);
    }
    const t = audioCtx.currentTime;
    const dur = up ? .016 : .028;
    const len = Math.ceil(audioCtx.sampleRate*dur);
    const buf = audioCtx.createBuffer(1,len,audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = (Math.random()*2-1)*Math.pow(1-i/len, 2.2);  // ซองจดหมายตกเร็ว = "คลิก" ไม่ใช่ "ซ่า"
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const bp = audioCtx.createBiquadFilter(); bp.type='bandpass';
    bp.frequency.value = (up?3000:1900) * (bright?1.18:1); bp.Q.value = 1.2;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(up?.711:1.311, t);   // 🔊 ×3 ซ้อนจากรอบก่อน (รอบ)
    g.gain.exponentialRampToValueAtTime(.001, t+dur);
    src.connect(bp); bp.connect(g); g.connect(keyTapComp);
    src.start(t); src.stop(t+dur);
    if(!up){                       // แป้นชนฐาน = ตุบต่ำสั้น ๆ (ให้รู้สึกว่ามีน้ำหนัก)
      const o = audioCtx.createOscillator(), og = audioCtx.createGain();
      o.type='sine';
      o.frequency.setValueAtTime(200, t);
      o.frequency.exponentialRampToValueAtTime(92, t+.05);
      og.gain.setValueAtTime(.819, t);   // 🔊 ×3 ซ้อนจากรอบก่อน (รอบ)
      og.gain.exponentialRampToValueAtTime(.001, t+.06);
      o.connect(og); og.connect(keyTapComp);
      o.start(t); o.stop(t+.07);
    }
  }catch(e){}
}

/* ---------- 🫧 เสียงฟองธรรมชาติ (เกมฟอง) ---------- */
function bubblePopSynth(size){
  if(!state.sound) return;
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
    const t=audioCtx.currentTime, s=Math.max(38,Math.min(96,+size||64));
    const base=(1150-(s-38)*7)*(0.94+Math.random()*.12);
    const len=Math.ceil(audioCtx.sampleRate*.025),buf=audioCtx.createBuffer(1,len,audioCtx.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);
    const src=audioCtx.createBufferSource(),bp=audioCtx.createBiquadFilter(),ng=audioCtx.createGain(); src.buffer=buf;
    bp.type='bandpass';bp.frequency.value=base*1.8;bp.Q.value=1.3;ng.gain.setValueAtTime(.22,t);ng.gain.exponentialRampToValueAtTime(.001,t+.03);
    src.connect(bp);bp.connect(ng);ng.connect(audioCtx.destination);src.start(t);
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';
    o.frequency.setValueAtTime(base*1.28,t);o.frequency.exponentialRampToValueAtTime(base*.72,t+.09);
    g.gain.setValueAtTime(.14,t);g.gain.exponentialRampToValueAtTime(.001,t+.11);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.12);
    const drop=audioCtx.createOscillator(),dg=audioCtx.createGain();drop.type='sine';drop.frequency.setValueAtTime(base*.46,t+.018);drop.frequency.exponentialRampToValueAtTime(base*.31,t+.13);
    dg.gain.setValueAtTime(.001,t);dg.gain.linearRampToValueAtTime(.055,t+.025);dg.gain.exponentialRampToValueAtTime(.001,t+.14);drop.connect(dg);dg.connect(audioCtx.destination);drop.start(t);drop.stop(t+.15);
  }catch(e){}
}
function bubbleTapSynth(){
  if(!state.sound)return;
  try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type='sine';o.frequency.setValueAtTime(210,t);o.frequency.exponentialRampToValueAtTime(145,t+.055);g.gain.setValueAtTime(.055,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.065);
  }catch(e){}
}

/* ---------- ⚡ เสียงฟ้าผ่า+ประกายไฟ ----------
   ชั้น 1: ไฟล์ sound/spark.mp3 (เจนจาก Suno ได้ — prompt ใน PROMPTS_SOUND.md หัวข้อ spark)
   ชั้น 2 (ไม่มีไฟล์): สังเคราะห์ WebAudio — เปรี๊ยะไฟฟ้า + zap ไล่ลง + ฟ้าร้องท้าย */
let sparkAudio = null, sparkFileMiss = false;
function playSpark(){
  if(!state.sound) return;
  if(!sparkFileMiss){
    try{
      sparkAudio = sparkAudio || new Audio('sound/spark.mp3');
      sparkAudio.onerror = ()=>{ sparkFileMiss = true; sparkSynth(); };
      sparkAudio.currentTime = 0;
      const p = sparkAudio.play();
      if(p && p.catch) p.catch(()=>{ sparkFileMiss = true; sparkSynth(); });
      return;
    }catch(e){ sparkFileMiss = true; }
  }
  sparkSynth();
}
function sparkSynth(){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const noise = (at,dur,type,freq,vol)=>{   // ช็อตเสียงซ่าผ่านฟิลเตอร์ (เปรี๊ยะ/ฟ้าร้อง)
      const len = Math.ceil(audioCtx.sampleRate*dur);
      const buf = audioCtx.createBuffer(1,len,audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
      const src = audioCtx.createBufferSource(); src.buffer = buf;
      const f = audioCtx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(vol, t+at);
      g.gain.exponentialRampToValueAtTime(0.001, t+at+dur);
      src.connect(f); f.connect(g); g.connect(audioCtx.destination);
      src.start(t+at);
    };
    noise(0,  .08,'highpass',2600,.3);    // เปรี๊ยะแรก
    noise(.05,.15,'bandpass',1800,.25);   // ไฟช็อตต่อเนื่อง
    noise(.12,.09,'highpass',3200,.22);   // เปรี๊ยะซ้ำ
    noise(.5, .1, 'highpass',2900,.16);   // ประกายท้าย (รับจังหวะฟ้าผ่าลูกถัดไป)
    noise(.18,1.15,'lowpass',150,.5);     // ฟ้าร้องกลบท้าย
    const o = audioCtx.createOscillator(), g2 = audioCtx.createGain();
    o.type = 'sawtooth';                  // zap ไล่เสียงสูง→ต่ำ
    o.frequency.setValueAtTime(2800, t);
    o.frequency.exponentialRampToValueAtTime(160, t+.22);
    g2.gain.setValueAtTime(.12, t);
    g2.gain.exponentialRampToValueAtTime(.001, t+.24);
    o.connect(g2); g2.connect(audioCtx.destination);
    o.start(t); o.stop(t+.26);
  }catch(e){}
}

/* ---------- ⚡ เอฟเฟกต์ฟ้าผ่า+กระแสไฟฟ้าเต็มจอ (canvas ชั่วคราว วาดเอง ไม่ใช้ asset) ----------
   ฟ้าผ่า 5 ลูกไล่จังหวะ สุ่มตำแหน่ง เส้นหยักแตกกิ่ง + แฟลชขาวทั้งจอ + จอสั่น (เคารพ no-anim) */
function thunderFx(dur = 1800){
  if(typeof state !== 'undefined' && state.noAnim) return;
  const cv = document.createElement('canvas');
  cv.className = 'thunder-fx';
  const W = cv.width = innerWidth, H = cv.height = innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const t0 = performance.now();
  const strikes = [];
  for(let i=0;i<5;i++) strikes.push({at: i===0 ? 0 : 120+i*260+Math.random()*120,
                                     x: (0.1+0.8*Math.random())*W, bolt:null});
  function mkBolt(x){
    const pts = [[x+(Math.random()*40-20), 0]];
    let y = 0, px = pts[0][0];
    while(y < H){
      y += H*(0.06+Math.random()*0.09);
      px += (Math.random()*90-45);
      pts.push([px, Math.min(y,H)]);
    }
    const branches = [];
    for(let b=0; b<1+Math.floor(Math.random()*2); b++){
      const i = 2+Math.floor(Math.random()*Math.max(1, pts.length-3));
      let bx = pts[i][0], by = pts[i][1];
      const bp = [[bx,by]];
      for(let k=0;k<3;k++){ bx += (Math.random()*120-60); by += H*0.07*Math.random()+20; bp.push([bx,by]); }
      branches.push(bp);
    }
    return {pts, branches};
  }
  function drawPath(pts, w, alpha){
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.strokeStyle = `rgba(215,242,255,${alpha})`;
    ctx.lineWidth = w;
    ctx.shadowColor = '#7fd4ff'; ctx.shadowBlur = 18;
    ctx.stroke();
  }
  function frame(now){
    const t = now - t0;
    ctx.clearRect(0,0,W,H);
    let flash = 0;
    for(const s of strikes){
      const age = t - s.at;
      if(age < 0) continue;
      if(!s.bolt) s.bolt = mkBolt(s.x);
      const a = Math.max(0, 1 - age/320);
      if(a > 0){
        drawPath(s.bolt.pts, 4, a);                 // แกนหนาเรือง
        drawPath(s.bolt.pts, 1.3, Math.min(1, a*1.5)); // ไส้ขาวจ้า
        for(const b of s.bolt.branches) drawPath(b, 1.6, a*0.7);
        flash = Math.max(flash, a*0.3);
      }
    }
    if(flash > 0){ ctx.fillStyle = `rgba(224,242,255,${flash})`; ctx.fillRect(0,0,W,H); }
    if(t < dur) requestAnimationFrame(frame);
    else cv.remove();
  }
  requestAnimationFrame(frame);
  document.body.classList.add('quake');
  setTimeout(()=>document.body.classList.remove('quake'), 650);
}

/* ---------- 🔊 เสียงอ่านคำศัพท์อังกฤษ ----------
   ชั้น 1: ไฟล์ MP3 เสียง Neural ของ Microsoft (ตัวเดียวกับ Edge) เจนล่วงหน้าด้วย
           tools/gen_word_audio.py → sound/words/<word>.mp3 — ทุกเบราว์เซอร์เสียงเดียวกันเป๊ะ
   ชั้น 2 (สำรอง — ไม่มีไฟล์/โหลดพลาด): Web Speech API เลือกเสียงธรรมชาติสุดที่เครื่องมี */
const wordAudio = {};        // cache Audio ต่อคำ ('miss' = ไม่มีไฟล์ ใช้ชั้น 2 ตลอด)
let wordAudioNow = null;
function wordAudioFile(word){  // กติกาชื่อไฟล์ต้องตรงกับ word_key() ใน gen_word_audio.py
  return 'sound/words/' + word.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') + '.mp3';
}
/* 🚫 error 2 ตัวนี้ "ไม่ใช่ไฟล์เสียงหาย" — เจอแล้วต้องเงียบเฉย ๆ (รอบ 669/672)
   · AbortError      = play() โดน pause() ตัดกลางคัน — เกิดประจำเวลาเสียงใหม่มาแทนเสียงเก่า
                       (ขึ้นข้อสอบข้อใหม่ · เก็บตัวอักษรตัวถัดไป · เก็บตัวสุดท้ายครบคำแล้วเสียงอ่านทั้งคำมาตัด)
   · NotAllowedError = เบราว์เซอร์บล็อกเสียงอัตโนมัติ (ยังไม่มี user gesture)
   ถ้าเหมาว่าไฟล์หาย: คำ/ตัวอักษรนั้นโดนหมายหัว 'miss' ใช้เสียงหุ่นยนต์ถาวร (แม้กดฟังเองทีหลัง)
   + TTS ดังพูดของเก่าทับของใหม่ที่เพิ่งขึ้น */
function speakCutOff(err){
  const n = err && err.name;
  return n === 'AbortError' || n === 'NotAllowedError';
}
function speakWord(word, onDone){
  const notify = ok=>{ if(typeof onDone === 'function') onDone(!!ok); };
  if(!state.sound || !word){ setTimeout(()=>notify(false), 0); return null; }
  try{
    if(wordAudioNow){ wordAudioNow.pause(); }      // ตัดเสียงเก่า กันพูดซ้อนตอนแตะรัว
    const key = word.toLowerCase();
    if(wordAudio[key] === 'miss') return speakWordTTS(word, notify);
    const a = wordAudio[key] || new Audio(wordAudioFile(word));
    wordAudio[key] = a;
    let finished = false;
    const finish = ok=>{
      if(finished) return;
      finished = true;
      a.onended = a.onerror = a.onpause = null;
      if(wordAudioNow === a) wordAudioNow = null;
      notify(ok);
    };
    const fail = err=>{
      if(finished) return;
      if(speakCutOff(err)){ finish(false); return; } // โดนตัด/ถูกบล็อก ไม่ใช่ไฟล์หาย (ดู speakCutOff)
      finished = true;
      a.onended = a.onerror = a.onpause = null;
      if(wordAudioNow === a) wordAudioNow = null;
      wordAudio[key] = 'miss';
      speakWordTTS(word, notify);
    };
    a.onerror = fail;
    a.onended = ()=>finish(true);
    a.onpause = ()=>{ if(!a.ended) finish(false); };
    wordAudioNow = a;
    a.currentTime = 0;
    const p = a.play();
    if(p && p.catch) p.catch(fail);
    return a;
  }catch(e){ return speakWordTTS(word, notify); }
}
/* 🔠 เสียงชื่อตัวอักษร (เอ บี ซี — เก็บตัวอักษรในโลก 3D เด็กเล็กฝึกจำตัวอักษร)
   ไฟล์ sound/letters/<a-z>.mp3 (เจนจากสคริปต์เดียวกัน) · แชร์ตัวเล่นกับ speakWord —
   เก็บตัวสุดท้ายแล้วคำสำเร็จ เสียงอ่านทั้งคำ (delay 0.7 วิ) จะตัดเสียงตัวอักษรให้เอง */
function speakLetter(ch){
  ch = String(ch || '').toLowerCase();
  if(!state.sound || !/^[a-z]$/.test(ch)) return;
  try{
    if(wordAudioNow){ wordAudioNow.pause(); }
    const key = 'letter:' + ch;
    if(wordAudio[key] === 'miss') return speakWordTTS(ch.toUpperCase() + '.');
    const a = wordAudio[key] || new Audio('sound/letters/' + ch + '.mp3');
    wordAudio[key] = a;
    let failed = false;
    const fail = (err)=>{
      if(failed) return; failed = true;
      if(speakCutOff(err)) return;                 // เก็บตัวถัดไป/ครบคำแล้วเสียงคำมาตัด — ไม่ใช่ไฟล์หาย (รอบ 672)
      wordAudio[key] = 'miss'; speakWordTTS(ch.toUpperCase() + '.');
    };
    a.onerror = fail;
    wordAudioNow = a;
    a.currentTime = 0;
    const p = a.play();
    if(p && p.catch) p.catch(fail);
  }catch(e){}
}
let speakVoice = null;
function pickSpeakVoice(){
  const vs = window.speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));
  if(!vs.length) return null;
  const score = v=>{
    const n = v.name.toLowerCase();
    return (/(natural|neural)/.test(n)?8:0) + (n.includes('google')?6:0)
         + (/(samantha|karen|daniel|moira|tessa|ava|allison)/.test(n)?5:0)
         + (/^en-us$/i.test(v.lang)?3:0) + (n.includes('online')?1:0);
  };
  return vs.sort((a,b)=>score(b)-score(a))[0];
}
function speakWordTTS(word, onDone){
  const notify = ok=>{ if(typeof onDone === 'function') onDone(!!ok); };
  if(!state.sound || !word || !('speechSynthesis' in window)){
    setTimeout(()=>notify(false), 0); return null;
  }
  try{
    if(!speakVoice){
      speakVoice = pickSpeakVoice();
      // บางเบราว์เซอร์โหลดรายชื่อเสียงช้า — รอบแรกใช้เสียง default ไปก่อนแล้วอัปเกรดเอง
      if(!speakVoice) window.speechSynthesis.onvoiceschanged = ()=>{ speakVoice = pickSpeakVoice(); };
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1;
    if(speakVoice) u.voice = speakVoice;
    let finished = false;
    const finish = ok=>{ if(finished) return; finished = true; notify(ok); };
    u.onend = ()=>finish(true);
    u.onerror = ()=>finish(false);
    window.speechSynthesis.speak(u);
    return u;
  }catch(e){ setTimeout(()=>notify(false), 0); return null; }
}
/* ---------- ป๊อปอัพตั้งชื่อ (ใช้ร่วม: ชื่อในเกมข้อ 0.2 + ชื่อสัตว์ข้อ 7) ----------
   opt = {emoji, title, desc(html), placeholder, value, min, max,
          okText, cancelText (ไม่ใส่ = บังคับตั้ง ปิดข้ามไม่ได้), onOk(name), onCancel}
   ตรวจด้วย checkName (badwords.js) — ไม่ผ่านโชว์ข้อความแดง กล่องไม่ปิด */
function askNameDialog(opt){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    <div class="lv-emoji">${opt.emoji || '📛'}</div>
    <h2>${opt.title}</h2>
    <p style="font-size:14.5px;color:#8a7aa0;margin:6px 0 10px">${opt.desc || ''}</p>
    <input id="pf-name-input" maxlength="${opt.max}" placeholder="${opt.placeholder || ''}"
      style="width:88%;padding:10px 12px;border:2px solid #d9c9ef;border-radius:12px;font-size:16px;font-family:inherit;text-align:center">
    <p id="pf-name-err" style="color:#e05555;font-size:13.5px;min-height:18px;margin:8px 0 2px"></p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      ${opt.cancelText ? `<button class="cf-no" id="pf-name-cancel" style="background:#b8a8cc;box-shadow:0 4px 0 #96859f">${opt.cancelText}</button>` : ''}
      <button class="cf-ok" id="pf-name-ok">${opt.okText}</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  const input = overlay.querySelector('#pf-name-input');
  const err   = overlay.querySelector('#pf-name-err');
  input.value = opt.value || '';
  // 📱 กันแป้นพิมพ์มือถือบังกล่อง (ใช้ตัวช่วยตัวเดียวกับแชท — visualViewport ดันกล่องขึ้นเหนือคีย์บอร์ด)
  const stopKbFit = (typeof chatFitKeyboard === 'function')
    ? chatFitKeyboard(overlay, overlay.querySelector('.levelup-box')) : ()=>{};
  const submit = ()=>{
    const r = checkName(input.value, opt.min, opt.max);
    if(!r.ok){
      sfx.wrong();
      err.textContent = r.msg;
      return;
    }
    stopKbFit();
    overlay.remove();
    opt.onOk(r.name);
  };
  overlay.querySelector('#pf-name-ok').addEventListener('click', submit);
  input.addEventListener('keydown', e=>{ if(e.key === 'Enter') submit(); });
  const cancel = overlay.querySelector('#pf-name-cancel');
  if(cancel) cancel.addEventListener('click', ()=>{
    stopKbFit();
    overlay.remove();
    if(opt.onCancel) opt.onCancel();
  });
  setTimeout(()=>input.focus(), 50);
}

/* ---------- ป๊อปอัพยืนยัน (แทน confirm ของเบราว์เซอร์) ---------- */
function askConfirm(html, okText, onOk){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    ${html}
    <div style="display:flex;gap:10px;justify-content:center;margin-top:14px">
      <button class="cf-no" style="background:#b8a8cc;box-shadow:0 4px 0 #96859f">ยกเลิก</button>
      <button class="cf-ok">${okText}</button>
    </div>
  </div>`;
  overlay.querySelector('.cf-no').addEventListener('click', ()=>overlay.remove());
  overlay.querySelector('.cf-ok').addEventListener('click', ()=>{ overlay.remove(); onOk(); });
  document.body.appendChild(overlay);
}

/* ---------- กล่องเตือนสำคัญกลางจอ (สำหรับคำเตือนที่ห้ามพลาด เช่น น้องป่วย) ---------- */
// html = เนื้อหา (ใส่ emoji ใหญ่ + ข้อความได้) · กด/แตะนอกกล่อง = ปิด
// extraBtn (ไม่บังคับ) = {text,onClick} ปุ่มที่สองสีเขียว กดแล้วปิดกล่องก่อนค่อยทำงาน
function alertBox(html, okText='เข้าใจแล้ว', extraBtn=null){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay alert-overlay';
  overlay.innerHTML = `<div class="levelup-box alert-box">
    ${html}
    <div class="ab-btns">
      ${extraBtn ? `<button class="cf-ok ab-extra">${extraBtn.text}</button>` : ''}
      <button class="cf-ok alert-ok">${okText}</button>
    </div>
  </div>`;
  const close = ()=>overlay.remove();
  overlay.querySelector('.alert-ok').addEventListener('click', close);
  if(extraBtn) overlay.querySelector('.ab-extra').addEventListener('click', ()=>{ close(); extraBtn.onClick(); });
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });   // แตะพื้นหลังปิดได้
  document.body.appendChild(overlay);
  if(typeof sfx !== 'undefined') sfx.wrong();
  if(state.haptic !== false && navigator.vibrate) navigator.vibrate([40,60,40]);
}

/* ---------- ปิด/เปิดแอนิเมชัน (สำหรับเครื่องช้า) ---------- */
function applyNoAnim(){
  document.documentElement.classList.toggle('no-anim', !!(typeof state !== 'undefined' && state.noAnim));
}

/* 🏷️ รอบ 806: ชื่อ EN/TH ใต้ตัวละครโปรไฟล์ 88 ตัว (เสริมคำศัพท์) — blk1-8 = ชื่อมาสคอตเดิม (BLOCK_AVATARS)
   blk9-48 = อาชีพจริง (ดูจากภาพ: นักบิน/หมอ/เชฟ/ตำรวจ ฯลฯ) · blk49-88 = คอสตูมสัตว์/แฟนตาซี/กิจกรรม
   🔤 รอบ 808: เพิ่ม pron = คำอ่านเทียบเสียงไทย (เครื่องหมาย ' หลังพยางค์ที่ลงเสียงหนัก ตามสเปกผู้ใช้ เช่น doctor="ดอค'เถอะ") */
const BLK_VOCAB = {
  blk1:{en:'Red Racer',pron:"เรด เร'เซอะ",th:'เรซเซอร์แดง'}, blk2:{en:'Blue Captain',pron:"บลู แค็พ'เทิ่น",th:'กัปตันฟ้า'},
  blk3:{en:'Green Tea',pron:'กรีน ที',th:'ชาเขียว'}, blk4:{en:'Orange Sunny',pron:"ออ'เรินจ์ ซัน'นี่",th:'ซันนี่ส้ม'},
  blk5:{en:'Purple Wizard',pron:"เพอร์'เพิ่ล วิซ'เอิด",th:'วิซาร์ดม่วง'}, blk6:{en:'Pinky',pron:"พิง'กี้",th:'พิ้งกี้'},
  blk7:{en:'Lemon',pron:"เล'เมิ่น",th:'เลม่อน'}, blk8:{en:'Minty',pron:"มิน'ที่",th:'มิ้นตี้'},
  blk9:{en:'Superhero',pron:"ซู'เพอร์ฮีโร่",th:'ซูเปอร์ฮีโร่'}, blk10:{en:'Pilot',pron:"ไพ'เลิท",th:'นักบิน'},
  blk11:{en:'Explorer',pron:"เอ็กซ์พลอ'เรอะ",th:'นักสำรวจ'}, blk12:{en:'Firefighter',pron:"ไฟ'เออร์ไฟเทอะ",th:'นักดับเพลิง'},
  blk13:{en:'Astronaut',pron:"แอส'โทรนอท",th:'นักบินอวกาศ'}, blk14:{en:'Doctor',pron:"ดอค'เถอะ",th:'หมอ'},
  blk15:{en:'Nurse',pron:'เนิร์ส',th:'พยาบาล'}, blk16:{en:'Chef',pron:'เชฟ',th:'เชฟ'},
  blk17:{en:'Farmer',pron:"ฟาร์'เมอะ",th:'ชาวนา'}, blk18:{en:'Artist',pron:"อาร์'ทิสท์",th:'ศิลปิน'},
  blk19:{en:'Musician',pron:"มิวซิ'เชิ่น",th:'นักดนตรี'}, blk20:{en:'Skateboarder',pron:"สเกท'บอร์เดอะ",th:'นักเล่นสเก็ตบอร์ด'},
  blk21:{en:'Soccer Player',pron:"ซอค'เคอะ เพล'เยอะ",th:'นักฟุตบอล'}, blk22:{en:'Basketball Player',pron:"แบส'คิทบอล เพล'เยอะ",th:'นักบาสเกตบอล'},
  blk23:{en:'Swimmer',pron:"สวิม'เมอะ",th:'นักว่ายน้ำ'}, blk24:{en:'Cyclist',pron:"ไซ'เคลิสท์",th:'นักปั่นจักรยาน'},
  blk25:{en:'Police Officer',pron:"เพอะลีส' ออฟ'ฟิเซอะ",th:'ตำรวจ'}, blk26:{en:'Mail Carrier',pron:"เมล แค'เรียเออะ",th:'บุรุษไปรษณีย์'},
  blk27:{en:'Conductor',pron:"เคินดัค'เทอะ",th:'พนักงานรถไฟ'}, blk28:{en:'Construction Worker',pron:"เคินสตรัค'เชิ่น เวอร์'เคอะ",th:'คนงานก่อสร้าง'},
  blk29:{en:'Mechanic',pron:"เมอะแค'นิค",th:'ช่างซ่อมรถ'}, blk30:{en:'Gardener',pron:"การ์'เดิ่นเนอะ",th:'คนสวน'},
  blk31:{en:'Baker',pron:"เบ'เคอะ",th:'คนทำขนมปัง'}, blk32:{en:'Student',pron:"สทู'เดิ่นท์",th:'นักเรียน'},
  blk33:{en:'Hiker',pron:"ไฮ'เคอะ",th:'นักเดินป่า'}, blk34:{en:'Fisherman',pron:"ฟิช'เชอะเหมิ่น",th:'ชาวประมง'},
  blk35:{en:'Sailor',pron:"เซ'เลอะ",th:'กะลาสีเรือ'}, blk36:{en:'Diver',pron:"ได'เวอะ",th:'นักดำน้ำ'},
  blk37:{en:'Backpacker',pron:"แบค'แพคเคอะ",th:'นักท่องเที่ยวแบกเป้'}, blk38:{en:'Photographer',pron:"เฟอะทอก'กระเฟอะ",th:'ช่างภาพ'},
  blk39:{en:'Detective',pron:"ดิเทค'ทิฟ",th:'นักสืบ'}, blk40:{en:'Reporter',pron:"ริพอร์'เทอะ",th:'นักข่าว'},
  blk41:{en:'Martial Artist',pron:"มาร์'เชิ่ล อาร์'ทิสท์",th:'นักศิลปะการต่อสู้'}, blk42:{en:'Boxer',pron:"บ็อค'เซอะ",th:'นักมวย'},
  blk43:{en:'Ninja',pron:"นิน'จะ",th:'นินจา'}, blk44:{en:'Knight',pron:'ไนท์',th:'อัศวิน'},
  blk45:{en:'Pirate',pron:"ไพ'เริท",th:'โจรสลัด'}, blk46:{en:'Cowboy',pron:"เคา'บอย",th:'คาวบอย'},
  blk47:{en:'Archer',pron:"อาร์'เชอะ",th:'นักธนู'}, blk48:{en:'Race Car Driver',pron:"เรส คาร์ ไดร'เวอะ",th:'นักแข่งรถ'},
  blk49:{en:'Wizard',pron:"วิซ'เอิด",th:'พ่อมด'}, blk50:{en:'Witch',pron:'วิทช์',th:'แม่มด'},
  blk51:{en:'Fairy',pron:"แฟ'รี่",th:'นางฟ้า'}, blk52:{en:'Mermaid',pron:"เมอร์'เมด",th:'นางเงือก'},
  blk53:{en:'Elf',pron:'เอลฟ์',th:'เอลฟ์'}, blk54:{en:'Dragon',pron:"แดรก'เกิ่น",th:'มังกร'},
  blk55:{en:'Unicorn',pron:"ยู'นิคอร์น",th:'ยูนิคอร์น'}, blk56:{en:'Angel',pron:"เอน'เจิ่ล",th:'ทูตสวรรค์'},
  blk57:{en:'Cat',pron:'แคท',th:'แมว'}, blk58:{en:'Dog',pron:'ดอก',th:'สุนัข'},
  blk59:{en:'Bunny',pron:"บัน'นี่",th:'กระต่าย'}, blk60:{en:'Bear',pron:'แบร์',th:'หมี'},
  blk61:{en:'Panda',pron:"แพน'ดะ",th:'แพนด้า'}, blk62:{en:'Fox',pron:'ฟอกซ์',th:'สุนัขจิ้งจอก'},
  blk63:{en:'Penguin',pron:"เพน'กวิน",th:'เพนกวิน'}, blk64:{en:'Frog',pron:'ฟรอก',th:'กบ'},
  blk65:{en:'Dinosaur',pron:"ได'โนซอร์",th:'ไดโนเสาร์'}, blk66:{en:'Shark',pron:'ชาร์ค',th:'ฉลาม'},
  blk67:{en:'Bee',pron:'บี',th:'ผึ้ง'}, blk68:{en:'Butterfly',pron:"บัท'เทอะฟลาย",th:'ผีเสื้อ'},
  blk69:{en:'Ladybug',pron:"เล'ดี้บัก",th:'เต่าทอง'}, blk70:{en:'Owl',pron:'เอาล์',th:'นกฮูก'},
  blk71:{en:'Lion',pron:"ไล'เอิ่น",th:'สิงโต'}, blk72:{en:'Turtle',pron:"เทอร์'เทิ่ล",th:'เต่า'},
  blk73:{en:'Robot',pron:"โร'บอท",th:'หุ่นยนต์'}, blk74:{en:'Alien',pron:"เอ'เลี่ยน",th:'มนุษย์ต่างดาว'},
  blk75:{en:'Space Explorer',pron:"สเปส เอ็กซ์พลอ'เรอะ",th:'นักสำรวจอวกาศ'}, blk76:{en:'Cyber Warrior',pron:"ไซ'เบอะ วอ'ริเออะ",th:'นักรบไซเบอร์'},
  blk77:{en:'Winter Kid',pron:"วิน'เทอะ คิด",th:'เด็กหน้าหนาว'}, blk78:{en:'Rainy Day Kid',pron:"เร'นี่ เด คิด",th:'เด็กวันฝนตก'},
  blk79:{en:'Snorkeler',pron:"สนอร์'เคเลอะ",th:'นักดำน้ำตื้น'}, blk80:{en:'Cozy Kid',pron:"โค'ซี่ คิด",th:'เด็กใส่เสื้อกันหนาว'},
  blk81:{en:'Party Kid',pron:"พาร์'ที่ คิด",th:'เด็กในงานปาร์ตี้'}, blk82:{en:'Graduate',pron:"แกรด'จูเอท",th:'บัณฑิตน้อย'},
  blk83:{en:'Juggler',pron:"จัก'เกลอะ",th:'นักเล่นกล'}, blk84:{en:'Magician',pron:"เมอะจิ'เชิ่น",th:'นักมายากล'},
  blk85:{en:'Ice Skater',pron:"ไอซ์ สเก'เทอะ",th:'นักสเก็ตน้ำแข็ง'}, blk86:{en:'Skier',pron:"สกี'เออะ",th:'นักเล่นสกี'},
  blk87:{en:'Rock Star',pron:'รอค สตาร์',th:'ร็อกสตาร์'}, blk88:{en:'Ballerina',pron:"แบลเลอะรี'น่า",th:'นักบัลเล่ต์'},
};

/* ---------- หน้าตั้งค่า (รวมสวิตช์ เสียง/สั่น/แอนิเมชัน + วิธีเล่น ไว้ที่เดียว) ---------- */
function openSettings(){
  const hapticSupported = ('vibrate' in navigator);   // แถวสั่นโผล่เฉพาะเครื่องที่รองรับ
  // 🖼️ รอบ 751: ตัวละครให้เลือก 88 ตัว (blk1-8 = ตัวบล็อกเดิมที่มีโมเดลในโลก 3D · blk9-blk88 = ภาพ 2D ชุดใหม่)
  const blkAvCount = (typeof PROF_AV_MAX === 'number') ? PROF_AV_MAX : 8;
  const blkAvList = Array.from({length: blkAvCount}, (_, i)=> 'blk' + (i + 1));
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay settings-overlay';
  // 🗂️ รอบ 893: เดิมยัดทุกแถวในกล่องเดียว = เนื้อหาสูงกว่าจอ 2-3 เท่า ต้องเลื่อนในตัวเอง (ขัดกฎทอง #7)
  //   → แบ่งเป็น 3 แท็บ (ทั่วไป/ตัวละคร/เปิดเผย) โชว์ทีละแท็บ ใช้ .lb-tab เดิม (โทนม่วงเดียวกับกระดานอันดับ)
  overlay.innerHTML = `<div class="levelup-box settings-box">
    <button class="set-x" id="set-x" type="button" aria-label="ปิด">✕</button>
    <h2 style="margin:0 0 4px">⚙️ ตั้งค่า</h2>
    <p class="set-hint">แตะสวิตช์เพื่อสลับ — <b class="set-hint-on">เขียว = เปิดอยู่</b> · <b class="set-hint-off">เทา = ปิดอยู่</b></p>
    <div class="set-tabs">
      <button class="lb-tab set-tab active" data-tab="general">🔊 ทั่วไป</button>
      <button class="lb-tab set-tab" data-tab="avatar">🦸 ตัวละคร</button>
      <button class="lb-tab set-tab" data-tab="feed">📰 เปิดเผย</button>
    </div>
    <div class="set-panels">
      <div class="set-panel active" data-panel="general">
        <div class="set-row" id="set-sound">
          <span class="set-lwrap"><span class="set-label">🔊 เสียงในเกม</span>
            <span class="set-desc">เสียงเอฟเฟกต์ ปุ่มกด และอ่านออกเสียงคำศัพท์</span></span>
          <button class="set-switch" aria-label="สลับเสียงในเกม"></button>
        </div>
        <div class="set-row" id="set-rainsound">
          <span class="set-lwrap"><span class="set-label">🌧️ เสียงฝนตก</span>
            <span class="set-desc">เสียงฝนเบาๆ วนลูป ตอนฝนตกเต็มจอ (19:00-20:00 ยังไม่มีบ้านสภาพดี)</span></span>
          <button class="set-switch" aria-label="สลับเสียงฝนตก"></button>
        </div>
        ${hapticSupported ? `<div class="set-row" id="set-haptic">
          <span class="set-lwrap"><span class="set-label">📳 สั่นเตือน</span>
            <span class="set-desc">มือถือสั่นตอนโดนผีทำร้าย/ตอบถูก</span></span>
          <button class="set-switch" aria-label="สลับสั่นเตือน"></button>
        </div>` : ''}
        <div class="set-row" id="set-anim">
          <span class="set-lwrap"><span class="set-label">✨ เอฟเฟกต์เคลื่อนไหว</span>
            <span class="set-desc">ภาพเด้ง/เลื่อนไหวสวยงาม · ปิดได้ถ้าเครื่องช้าจะลื่นขึ้น</span></span>
          <button class="set-switch" aria-label="สลับเอฟเฟกต์เคลื่อนไหว"></button>
        </div>
        ${(typeof NightUI!=='undefined') ? `<div class="set-row set-night-row" id="set-night">
          <span class="set-lwrap"><span class="set-label">🌙 โหมดกลางคืน</span>
            <span class="set-desc">สีล็อบบี้อุ่นตาตอนกลางคืน — อัตโนมัติ 19:00-06:00 หรือปักไว้เองก็ได้</span></span>
          <div class="set-seg" role="group" aria-label="เลือกโหมดกลางคืน">
            <button class="set-seg-btn" data-mode="auto">🕒<span>อัตโนมัติ</span></button>
            <button class="set-seg-btn" data-mode="day">☀️<span>กลางวัน</span></button>
            <button class="set-seg-btn" data-mode="night">🌙<span>กลางคืน</span></button>
          </div>
        </div>` : ''}
        <div class="set-row set-photo-row" id="set-photo">
          <span class="set-lwrap"><span class="set-label">📷 รูปโปรไฟล์ของหนู</span>
            <span class="set-desc">อัปโหลดรูปของหนูเอง (ให้ผู้ปกครองช่วยเลือก) · ไม่ใส่ก็ได้ ใช้ตัวการ์ตูนแทน</span></span>
          <button class="ph-open" type="button" aria-label="เปลี่ยนรูปโปรไฟล์"></button>
        </div>
      </div>
      <div class="set-panel" data-panel="avatar">
        <div class="set-row set-blk-row" id="set-blk">
          <span class="set-label">🦸 ตัวละครของหนู<br><small class="set-sub2">แตะเลือกตัวที่จะยืนข้างน้อง · ใช้เป็นรูปโปรไฟล์เมื่อยังไม่ได้ใส่รูปจริง<br>
            มี ${blkAvCount} ตัวให้เลือก — กด ❯ ดูตัวถัดไป · 8 ตัวแรกเป็นตัวบล็อกที่ใช้ในโลก 3D ด้วย ตัวอื่นใช้ในล็อบบี้/โปรไฟล์ · <b>ใต้ตัวละครมีชื่อ EN + คำอ่าน + ไทย เสริมคำศัพท์ให้หนูด้วยนะ 📚</b></small></span>
          <div class="strip-wrap blk-strip">
            <button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button>
            <div class="strip-x blk-x grid1x5">
              ${blkAvList.map(b=>{
                const v = BLK_VOCAB[b] || {en:'', pron:'', th:''};
                return `<button class="blk-mini" data-blk="${b}"><img src="img/blocks/${b}.png" alt="" loading="lazy">
                  <span class="blk-cap"><b class="blk-cap-en">${v.en}</b><span class="blk-cap-pron">${v.pron}</span><span class="blk-cap-th">${v.th}</span></span></button>`;
              }).join('')}
            </div>
            <button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button>
          </div>
        </div>
      </div>
      <div class="set-panel" data-panel="feed">
        <div class="set-feed-head">📰 การเปิดเผยกิจกรรมในโปรไฟล์
          <span class="set-feed-sub">เลือกเองว่าให้เพื่อนเห็นอะไรบ้างในหน้าโปรไฟล์/ฟีด — ทุกหมวดเปิดมาตั้งแต่แรก ปิดเองได้ถ้าไม่อยากให้เห็น</span></div>
        ${Object.keys(FEED_CATS).map(k=>`
        <div class="set-row set-feed-row" data-cat="${k}">
          <span class="set-lwrap"><span class="set-label">${FEED_CATS[k].e} ${FEED_CATS[k].n}</span>
            <span class="set-desc">${FEED_CATS[k].d}</span></span>
          <button class="set-switch" aria-label="สลับการเปิดเผย ${FEED_CATS[k].n}"></button>
        </div>`).join('')}
      </div>
    </div>
    <div class="set-foot">
      <button class="set-help" id="set-help">📖 วิธีเล่นเกม</button>
      ${(typeof isTeacher==='function' && isTeacher()) ?
        `<button class="set-help" id="set-teacher">👩‍🏫 คู่มือครู (เครื่องมือคุมห้อง)</button>` : ''}
      <button class="set-close">เสร็จแล้ว</button>
    </div>
  </div>`;
  overlay.querySelectorAll('.set-tab').forEach(tab=>tab.addEventListener('click', ()=>{
    if(tab.classList.contains('active')) return;
    overlay.querySelectorAll('.set-tab').forEach(t=>t.classList.toggle('active', t===tab));
    overlay.querySelectorAll('.set-panel').forEach(p=>p.classList.toggle('active', p.dataset.panel===tab.dataset.tab));
    sfx.select();
  }));
  const setSwitch = (el, on)=>{   // แสดงสวิตช์เลื่อน: ลูกกลม + คำว่า เปิด/ปิด
    if(!el) return;
    el.className = 'set-switch ' + (on ? 'on' : 'off');
    el.innerHTML = `<span class="set-sw-txt">${on ? 'เปิด' : 'ปิด'}</span><span class="set-sw-knob"></span>`;
  };
  const paint = ()=>{
    setSwitch(overlay.querySelector('#set-sound .set-switch'), state.sound);
    setSwitch(overlay.querySelector('#set-rainsound .set-switch'), state.rainSound !== false);
    setSwitch(overlay.querySelector('#set-haptic .set-switch'), state.haptic !== false);
    setSwitch(overlay.querySelector('#set-anim .set-switch'), !state.noAnim);   // "เปิด" = มีเอฟเฟกต์ · "ปิด" = ปิดเพื่อความลื่น
    const curBlk = (typeof lobbyBlk === 'function') ? lobbyBlk() : (state.blockAv || 'blk1');   // 🧱 รอบ 238 · ไฮไลต์ตัวที่เลือกอยู่
    overlay.querySelectorAll('.blk-mini').forEach(b=>b.classList.toggle('sel', curBlk === b.dataset.blk));
    // 📷 รอบ 709: ปุ่มรูปโปรไฟล์ — มีรูปแล้วโชว์รูปย่อ ยังไม่มีโชว์เครื่องหมาย ＋
    const phBtn = overlay.querySelector('#set-photo .ph-open');
    if(phBtn){
      const ph = (typeof photoGet === 'function') ? photoGet() : '';
      phBtn.innerHTML = ph ? `<img class="ph-thumb" src="${ph}" alt=""><span>เปลี่ยนรูป</span>`
                           : `<span class="ph-plus">＋</span><span>ใส่รูป</span>`;
      phBtn.classList.toggle('has', !!ph);
    }
    // 📰 รอบ 155: สวิตช์เปิดเผยกิจกรรม (default เปิดทุกหมวดตั้งแต่รอบ 565)
    overlay.querySelectorAll('.set-feed-row').forEach(r=>
      setSwitch(r.querySelector('.set-switch'), !!(state.feedShare && state.feedShare[r.dataset.cat])));
    // 🌙 รอบ 886: ไฮไลต์ปุ่มโหมดกลางคืนที่กำลังใช้อยู่ (อ่านสดจาก NightUI ทุกครั้งที่ paint กันหลุด sync กับปุ่ม 🌙 แถบบน)
    const nightRow = overlay.querySelector('#set-night');
    if(nightRow && typeof NightUI!=='undefined'){
      const curMode = NightUI.getMode();
      nightRow.querySelectorAll('.set-seg-btn').forEach(btn=>btn.classList.toggle('active', btn.dataset.mode===curMode));
    }
  };
  // 🧱 รอบ 238/245: เลือก "ตัวละครของหนู" = ยืนข้างน้องในล็อบบี้ + เป็นรูปโปรไฟล์ (เก็บใน state.profAv)
  // 🖼️ รอบ 751: blk1-8 มีโมเดลในโลก 3D ด้วย → ตั้ง state.blockAv ตามไปเลย (พฤติกรรมเดิม)
  //   blk9+ ไม่มีโมเดล 3D → ไม่แตะ blockAv ตัวบล็อกในโลกขับรถยังเป็นตัวเดิมที่เลือกไว้
  overlay.querySelectorAll('.blk-mini').forEach(b=>b.addEventListener('click', ()=>{
    state.profAv = b.dataset.blk;
    if(/^blk[1-8]$/.test(b.dataset.blk)) state.blockAv = b.dataset.blk;
    saveState(); sfx.select(); paint();
    if(typeof renderDashboard === 'function') renderDashboard();   // อัปเดตแถบโปรไฟล์ + ตัวในล็อบบี้ทันที
  }));
  if(typeof bindStripArrows === 'function') bindStripArrows(overlay.querySelector('.blk-strip'), {full:true});
  // เปิดตั้งค่ามา = เลื่อนแถบไปตรงตัวที่เลือกอยู่เลย (ตัวที่ 88 จะได้ไม่ต้องกดลูกศรยาว ๆ)
  setTimeout(()=>{ const s = overlay.querySelector('.blk-mini.sel'); if(s) s.scrollIntoView({block:'nearest', inline:'center'}); }, 0);
  overlay.querySelector('#set-sound .set-switch').addEventListener('click', ()=>{
    state.sound = !state.sound; saveState(); paint(); if(state.sound) sfx.select();
    if(typeof Music !== 'undefined') Music.onSound();          // รอบ 181: หยุด/เล่นเพลงตามสวิตช์เสียง
    if(typeof RainSound !== 'undefined') RainSound.refresh();
  });
  const rsSwitch = overlay.querySelector('#set-rainsound .set-switch');
  if(rsSwitch) rsSwitch.addEventListener('click', ()=>{
    state.rainSound = (state.rainSound === false);   // undefined/true → false → true
    saveState(); paint(); if(state.rainSound !== false) sfx.select();
    if(typeof RainSound !== 'undefined') RainSound.refresh();
  });
  const hSwitch = overlay.querySelector('#set-haptic .set-switch');
  if(hSwitch) hSwitch.addEventListener('click', ()=>{
    state.haptic = (state.haptic === false); saveState(); paint();
    if(state.haptic && navigator.vibrate) navigator.vibrate(50);
  });
  overlay.querySelector('#set-anim .set-switch').addEventListener('click', ()=>{
    state.noAnim = !state.noAnim; saveState(); applyNoAnim(); paint();
  });
  // 🌙 รอบ 886: แตะปุ่มโหมดกลางคืน — ไม่มี state.* ให้เซฟ (NightUI คุม localStorage เอง แยกจากเซฟเกม)
  const nightRow = overlay.querySelector('#set-night');
  if(nightRow) nightRow.querySelectorAll('.set-seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(btn.classList.contains('active')) return;
      NightUI.setMode(btn.dataset.mode);
      sfx.select(); paint();
    });
  });
  // 📰 รอบ 155: สลับการเปิดเผยกิจกรรมรายหมวด
  // เปิด = เริ่มรายงานหมวดนั้น · ปิด = หยุด + ลบโพสต์เก่าหมวดนั้นออกจาก DB (คนอื่นไม่เห็นของเก่าด้วย)
  overlay.querySelectorAll('.set-feed-row').forEach(r=>{
    r.querySelector('.set-switch').addEventListener('click', ()=>{
      const cat = r.dataset.cat;
      if(!state.feedShare) state.feedShare = {};
      state.feedShare[cat] = !state.feedShare[cat];
      saveState(); paint();
      if(state.feedShare[cat]){
        sfx.select();
        toast(cat === 'assets'
          ? `${FEED_CATS[cat].e} เปิดเผยคลังทรัพย์สินในโปรไฟล์แล้ว`
          : `${FEED_CATS[cat].e} เปิดรายงาน "${FEED_CATS[cat].n}" แล้ว — เพื่อนจะเห็นในโปรไฟล์/ฟีด`);
      }else{
        toast(`🔒 ปิด "${FEED_CATS[cat].n}" แล้ว — ลบรายการเก่าให้ด้วย`);
        if(cat !== 'assets' && typeof feedPurgeCat === 'function') feedPurgeCat(cat);
      }
      if(cat === 'assets' && typeof feedPushAssets === 'function') feedPushAssets();
    });
  });
  // 📷 รอบ 709: เปิดกล่องรูปโปรไฟล์ (js/photo.js) — ปิดกล่องแล้ว paint() ใหม่ ปุ่มจะโชว์รูปล่าสุด
  const phOpen = overlay.querySelector('#set-photo .ph-open');
  if(phOpen) phOpen.addEventListener('click', ()=>{
    if(typeof openPhotoMenu !== 'function'){ toast('ระบบรูปโปรไฟล์ยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ'); return; }
    sfx.select(); openPhotoMenu(paint);
  });
  overlay.querySelector('#set-help').addEventListener('click', openHelp);
  const tg = overlay.querySelector('#set-teacher');
  if(tg) tg.addEventListener('click', openTeacherGuide);
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.querySelector('.set-x').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  paint();
  document.body.appendChild(overlay);
}

/* ---------- วิธีเล่นเกม (เปิดจากหน้าตั้งค่า) ---------- */
function openHelp(){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay help-overlay';
  overlay.innerHTML = `<div class="levelup-box help-box">
    <h2 style="margin:0 0 8px">📖 วิธีเล่น Vocab World</h2>
    <div class="help-body">
      <div class="help-item"><b>🎮 เล่นเกมจับคู่คำศัพท์</b><br>กดปุ่ม "เล่นเกมจับคู่คำศัพท์!" ตอบให้ถูกเพื่อรับ 🪙 เหรียญ ยิ่งเก่งยิ่งได้เยอะ</div>
      <div class="help-item"><b>🐾 เลี้ยงน้อง</b><br>น้องหิวข้าวเย็นทุกวันตอน <b>18:00 น.</b> ให้กินหลายอย่างจนหลอดอิ่มเต็ม 100 ก่อน 20:00 · พาเข้านอนก่อน <b>23:00 น.</b> (เข้านอนได้ตั้งแต่ 2 ทุ่ม ตื่นเอง 6 โมงเช้า) · อย่าให้ร้อนเกินไป — พลาดข้อไหนน้องจะป่วย 🤒 (ต้องจ่ายค่ารักษา)</div>
      <div class="help-item"><b>🍚 ข้าวเย็นของหนู</b><br>กิจกรรมเสริมช่วง 18:00–06:00 แตะปุ่ม 🍚 ในแถวชื่อน้องได้ (มื้อละ 🪙200) จะกินหรือข้ามก็ได้ — ผู้เล่นไม่ป่วยและไม่เสียค่ารักษา</div>
      <div class="help-item"><b>☠️ อาหารคน vs อาหารสัตว์</b><br>เมนูอาหารแยก 2 ชุด — <b>ชุดอาหารสัตว์</b> ปลอดภัยเสมอ ส่วน <b>ชุดอาหารคน</b> บางอย่างเป็นโทษกับสัตว์จริงๆ (เช่น ช็อกโกแลต องุ่น นมวัว เป็นพิษกับหมาแมว · มังกรกินเผ็ดได้แต่แพ้ของหวาน) ป้อนได้แต่<b>พิษจะสะสม</b> ไม่ลดเอง — เต็ม 100 น้องป่วยทันที! ขับพิษที่หลอด ☠️ ได้ (🪙1,000) · ฝึกความรู้ได้ที่ปุ่ม <b>🛡️ ควิซอาหารปลอดภัย</b> (รับเหรียญได้วันละรอบ)</div>
      <div class="help-item"><b>💪 รูปร่างของน้องเปลี่ยนตามการกิน</b><br>กินดีเต็มหลอด <b>3 มื้อติด</b> → <b>ล่ำกำยำ</b> ได้ EXP แถม +2 ทุกคำ! · กินของโทษ 3 มื้อติด → <b>อ้วนกลม</b> 🍩 · อดข้าวบ่อย → <b>ผอมโซ</b> 🦴 — กลับมากินดีๆ ต่อเนื่อง หุ่นก็กลับมาปกติได้เสมอ</div>
      <div class="help-item"><b>🏠 บ้าน &amp; บิล</b><br>ซื้อบ้านให้น้องหลบแดดหลบฝน · ทุกเดือนมีค่าบำรุง/ค่าไฟ/ค่าน้ำ/ค่าขยะ — ถ้ามี <span style="color:#e8483f;font-weight:bold">จุดแดง</span> บนปุ่มแปลว่ามีบิลค้าง รีบไปจ่ายนะ</div>
      <div class="help-item"><b>💰 หาเงินเพิ่ม</b><br>🌳 ฟาร์มปลูกผัก · 🏭 โรงงานผลิตของ · 🏪 ตลาดขายของ · 📱 มือถือ/💻 คอมพิวเตอร์ ช่วยเพิ่มรายได้</div>
      <div class="help-item"><b>📚 หมวดคำศัพท์ &amp; แบบทดสอบ</b><br>ฝึกคำศัพท์เป็นหมวด สอบผ่านรับรางวัลใหญ่ครั้งแรก</div>
      <div class="help-item"><b>👥 เพื่อน &amp; 🎁 ของขวัญ</b><br>เพิ่มเพื่อนด้วยรหัส 6 ตัว แชทและส่งของขวัญให้กันได้</div>
      <div class="help-item"><b>🌍 โลก 3D (ตั๋วที่ตลาด)</b><br>เลี้ยงน้องให้โตเต็มวัย (Lv.3) แล้วซื้อ <b>🎫 ตั๋วโลกผจญภัย</b> (🪙5,000) — เดินเก็บตัวอักษรมาประกอบคำศัพท์ คำละ 🪙15 ระวัง monster 👾 ยิงสู้ได้ · เก่งแล้วลอง <b>🎃 ตั๋วโลกผีสิง</b> (🪙10,000) คำละ 🪙25 แต่ผีสู้ไม่ได้ต้องหนี! · ในโลกเจอเพื่อนจริงๆ เดินไปมา แชทลอยหัว 💬 คุยเสียง 🎤 ได้ · 📨 ชวนเพื่อนเข้าโลกพร้อมกันครั้งแรก รับเงินคืนคนละ 🪙2,000 · กระดาน 🏆 มุมซ้ายบนโชว์ว่าใครประกอบคำเก่งสุดรอบนี้</div>
      <div class="help-item"><b>⚙️ ตั้งค่า</b><br>เปิด/ปิด เสียง สั่นเตือน และเอฟเฟกต์เคลื่อนไหว (ปิดได้ถ้าเครื่องช้า) · เปลี่ยนตัวละครของหนู 🦸 ได้ที่นี่ด้วย</div>
    </div>
    <div style="margin-top:14px"><button class="set-close">เข้าใจแล้ว!</button></div>
  </div>`;
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ---------- 👩‍🏫 คู่มือครู (เปิดจากหน้าตั้งค่า — เห็นเฉพาะบัญชีใน TEACHER_EMAILS) ---------- */
function openTeacherGuide(){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay help-overlay';
  overlay.innerHTML = `<div class="levelup-box help-box">
    <h2 style="margin:0 0 8px">👩‍🏫 คู่มือครู — เครื่องมือคุมห้องในโลก 3D</h2>
    <div class="help-body">
      <div class="help-item"><b>🔑 บัญชีครูคืออะไร</b><br>บัญชี Google ที่ลงทะเบียนไว้ใน <code>TEACHER_EMAILS</code> (ไฟล์ js/auth.js) จะเห็นปุ่มพิเศษ 2 ปุ่มในโลก 3D ทั้งกลางวันและผีสิง — เด็กมองไม่เห็นปุ่มเหล่านี้ · อยากเพิ่มครูคนอื่น เพิ่มอีเมลต่อท้ายรายชื่อในไฟล์ได้เลย</div>
      <div class="help-item"><b>👩‍🏫 ปิด/เปิดเสียงห้อง</b><br>ปุ่มแดงในโลก 3D — กดแล้ว<b>ไมค์เด็กทุกคนใน map ดับทันที</b>และถูกล็อก (ปุ่มไมค์เด็กขึ้น "🎤 ครูปิด") เด็กที่เข้ามาทีหลังก็โดนล็อกด้วย · กดอีกครั้ง = เปิดห้อง เด็กเปิดไมค์เองได้ · ไมค์ครูไม่ติดล็อก — เหมาะกับตอนอธิบายกติกาหรือคุมความเรียบร้อย</div>
      <div class="help-item"><b>🏁 จบรอบแข่ง (พิธีประกาศแชมป์)</b><br>กดแล้ว<b>ทุกเครื่องใน map</b> เห็นโพเดียม 🥇🥈🥉 พร้อมแตรฉลอง · เด็กที่ติดอันดับรับโบนัสอัตโนมัติ <b>ที่ 1 +100 · ที่ 2 +50 · ที่ 3 +25</b> เหรียญ · จบพิธีคะแนนทุกคน<b>รีเซ็ตเป็น 0 เริ่มรอบใหม่ทันที</b> — กดแข่งหลายยกในคาบเดียวได้</div>
      <div class="help-item"><b>🏆 กระดานคะแนน (มุมซ้ายบนใน map)</b><br>โชว์อันดับสด "ใครประกอบคำได้เยอะสุดรอบนี้" — คนนำมีมงกุฎ 👑 แถวของเด็กแต่ละคนไฮไลต์เขียวบนจอตัวเอง · คะแนนนับต่อรอบเล่น (ออกจาก map = เริ่มนับใหม่)</div>
      <div class="help-item"><b>📋 สูตรจัดแข่งในคาบ (แนะนำ)</b><br>1) ให้เด็กซื้อตั๋วแล้วเข้าโลกเดียวกัน (เช่น โลกผจญภัย 🌍)<br>2) กด 👩‍🏫 ปิดเสียงห้อง แล้วอธิบายกติกา+เวลา เช่น "10 นาที ใครได้เยอะสุดชนะ"<br>3) เปิดเสียงห้อง ปล่อยเด็กลุย — ดูอันดับสดจากกระดาน 🏆<br>4) หมดเวลา กด 🏁 จบรอบแข่ง — โพเดียมเด้งทุกจอ รางวัลเข้าอัตโนมัติ<br>5) แข่งยกต่อไปได้ทันที คะแนนรีเซ็ตให้แล้ว</div>
      <div class="help-item"><b>🛡️ ความปลอดภัยที่ระบบดูแลให้แล้ว</b><br>ไมค์เด็ก<b>ปิดเป็นค่าเริ่มต้น</b>ทุกครั้งที่เข้า map (ต้องกดเปิดเอง) · คนเปิดไมค์มี 🎤 ลอยเหนือหัว มองเห็นชัด · เด็กปิดลำโพง 🔇 เองได้ถ้าไม่อยากได้ยินใคร · โหมด 👥 คุยเฉพาะเพื่อนที่ชวนกัน · แชทลอยหัวผ่าน<b>ตัวกรองคำหยาบ</b>เดียวกับระบบตั้งชื่อ · ข้อความโชว์แค่ 5 วินาทีแล้วหาย</div>
      <div class="help-item"><b>📨 โบนัสชวนเพื่อน</b><br>เด็กกดปุ่มชวนบนการ์ดตั๋ว เลือกเพื่อน แล้วเข้าโลกพร้อมกันครั้งแรก → ได้เงินคืน<b>คนละ 🪙2,000</b> (ครั้งเดียวต่อโลก) — ใช้กระตุ้นให้เด็กชวนกันเข้าคาบแข่งได้</div>
    </div>
    <div style="margin-top:14px"><button class="set-close">เข้าใจแล้ว!</button></div>
  </div>`;
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ✨ รอบ 831/834: แสงใต้ปุ่มโชว์แป๊บเดียวตอนกด (ผู้ใช้สั่ง) — delegate ตัวเดียวจบทั้งเกม
   ครอบทั้งปุ่มแนวตั้ง (รางเมนูซ้าย) และแนวนอน (แถบล่าง Lobby) โดยไม่ต้องแปะ class ทีละปุ่ม ·
   ปุ่มอื่นที่อยากได้ effect นี้เพิ่ม ใส่ class "tapglow" ในมาร์กอัปได้เลย (CSS อยู่ท้าย css/style.css) */
const TAPGLOW_SEL = '.tapglow, .rail-btn, .lobby-bottom .big-btn';
document.addEventListener('pointerdown', e=>{
  const b = e.target.closest(TAPGLOW_SEL);
  if(!b || b.disabled) return;
  b.classList.remove('tapglow-on');
  void b.offsetWidth;   // รีสตาร์ท animation ถ้ากดรัว ๆ
  b.classList.add('tapglow-on');
  clearTimeout(b.__tapglowT);
  b.__tapglowT = setTimeout(()=>b.classList.remove('tapglow-on'), 550);
});

/* ============================================================
   🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
   ผู้ใช้เจอตอนเล่นโลกยานแม่บนมือถือ — กล่องนั้นเป็น UI ของเบราว์เซอร์เอง
   โผล่ทุกครั้งที่หน้าเว็บเรียก requestPointerLock() (ล็อกเคอร์เซอร์แบบเกม FPS)
   ต้นตอ: แตะจอ → เบราว์เซอร์ยิง mousedown "ปลอม" ตามหลัง touch → โลก 3D
   เข้าใจผิดว่าเป็นเมาส์จริงแล้วสั่งล็อก · ปิดไม่ได้ที่ตัวกล่อง ต้องไม่ล็อกตั้งแต่ต้น
   ตัวนี้เป็นด่านกลางของทุกโลก 3D: ล็อกเมาส์ให้ "เครื่องที่มีเมาส์จริง" เท่านั้น
   ============================================================ */
let TOUCH_INPUT_SEEN = !(window.matchMedia ? window.matchMedia('(hover:hover) and (pointer:fine)').matches
                                           : !('ontouchstart' in window));
window.addEventListener('touchstart', ()=>{ TOUCH_INPUT_SEEN = true; }, {passive:true, capture:true});
window.addEventListener('pointerdown', e=>{
  if(e.pointerType==='touch' || e.pointerType==='pen') TOUCH_INPUT_SEEN = true;
}, {passive:true, capture:true});

/* คืน true เฉพาะเมื่อควรล็อกเคอร์เซอร์จริง ๆ · e = MouseEvent ที่เป็นต้นเหตุ (ถ้ามี)
   sourceCapabilities.firesTouchEvents = mouse event นี้เกิดจากนิ้วแตะ ไม่ใช่เมาส์ */
function mouseLockOK(e){
  if(TOUCH_INPUT_SEEN) return false;
  if(e && e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return false;
  return true;
}
/* ล็อกเคอร์เซอร์แบบปลอดภัย — คืน true ถ้าสั่งล็อกไปจริง (โลก 3D ใช้ตัวนี้เท่านั้น) */
function lockMouse3D(el, e){
  if(!el || !mouseLockOK(e)){
    try{ if(document.pointerLockElement) document.exitPointerLock(); }catch(_){}   // เผื่อค้างมาจากก่อนหน้า
    return false;
  }
  try{ el.requestPointerLock && el.requestPointerLock(); }catch(_){ return false; }
  return true;
}
