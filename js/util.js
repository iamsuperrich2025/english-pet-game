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

function fmtThaiDT(ts){
  return new Date(ts).toLocaleString('th-TH',
    {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'}) + ' น.';
}
function fmtThaiDate(ts){
  return new Date(ts).toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'numeric'});
}

/* ---------- screen navigation ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

/* ---------- FX ---------- */
// คำเตือน/ทำรายการไม่สำเร็จ → ค้างจนผู้ใช้กดปิด · ข้อความแจ้งสำเร็จ → หายเอง
const TOAST_WARN_RE = /ไม่สำเร็จ|ไม่พอ|ไม่ได้|ไม่มี|ยังไม่|หมดเวลา|หมดอายุ|ลองใหม่|ป่วย|ให้ครบ|มากกว่า 0|อินเทอร์เน็ต|ต้อง.{0,20}ก่อน|⚠️|❌|🚫|💔|⏰|🤒/;
let lastWrongAt = 0;                       // กันเสียงเตือนซ้ำ (call site เรียก sfx.wrong ก่อน toast อยู่แล้ว)
const nowMs = ()=> (window.performance ? performance.now() : Date.now());
function restackToasts(){
  const list = [...document.querySelectorAll('.toast-warn')];
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
function toast(msg, ms=1800){
  const t = document.createElement('div');
  if(TOAST_WARN_RE.test(msg)){
    t.className = 'toast toast-warn';
    const span = document.createElement('span');
    span.className = 'toast-msg'; span.textContent = msg;
    const x = document.createElement('button');
    x.className = 'toast-x'; x.textContent = '✕'; x.setAttribute('aria-label','ปิด');
    x.onclick = ()=>{ t.remove(); restackToasts(); };
    t.appendChild(span); t.appendChild(x);
    document.body.appendChild(t);
    if(nowMs() - lastWrongAt > 200 && typeof sfx !== 'undefined') sfx.wrong();  // เสียงเตือน (ไม่ซ้ำถ้าเพิ่งเล่นไป)
    if(state.haptic !== false && navigator.vibrate) navigator.vibrate(50);      // สั่นเบาๆ (สวิตช์แยกจากเสียง)
    restackToasts();                       // ค้างไว้ ไม่ตั้ง setTimeout
    return;
  }
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), ms);
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
function beep(freq, dur, delay=0, type='sine', vol=0.15){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const t = audioCtx.currentTime + delay;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + dur);
  }catch(e){}
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
};

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
function speakWord(word){
  if(!state.sound || !word) return;
  try{
    if(wordAudioNow){ wordAudioNow.pause(); }      // ตัดเสียงเก่า กันพูดซ้อนตอนแตะรัว
    const key = word.toLowerCase();
    if(wordAudio[key] === 'miss') return speakWordTTS(word);
    const a = wordAudio[key] || new Audio(wordAudioFile(word));
    wordAudio[key] = a;
    let failed = false;
    const fail = ()=>{ if(failed) return; failed = true; wordAudio[key] = 'miss'; speakWordTTS(word); };
    a.onerror = fail;
    wordAudioNow = a;
    a.currentTime = 0;
    const p = a.play();
    if(p && p.catch) p.catch(fail);
  }catch(e){ speakWordTTS(word); }
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
    const fail = ()=>{ if(failed) return; failed = true; wordAudio[key] = 'miss'; speakWordTTS(ch.toUpperCase() + '.'); };
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
function speakWordTTS(word){
  if(!state.sound || !word || !('speechSynthesis' in window)) return;
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
    window.speechSynthesis.speak(u);
  }catch(e){}
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
  const submit = ()=>{
    const r = checkName(input.value, opt.min, opt.max);
    if(!r.ok){
      sfx.wrong();
      err.textContent = r.msg;
      return;
    }
    overlay.remove();
    opt.onOk(r.name);
  };
  overlay.querySelector('#pf-name-ok').addEventListener('click', submit);
  input.addEventListener('keydown', e=>{ if(e.key === 'Enter') submit(); });
  const cancel = overlay.querySelector('#pf-name-cancel');
  if(cancel) cancel.addEventListener('click', ()=>{
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

/* ---------- หน้าตั้งค่า (รวมสวิตช์ เสียง/สั่น/แอนิเมชัน + วิธีเล่น ไว้ที่เดียว) ---------- */
function openSettings(){
  const hapticSupported = ('vibrate' in navigator);   // แถวสั่นโผล่เฉพาะเครื่องที่รองรับ
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay settings-overlay';
  overlay.innerHTML = `<div class="levelup-box settings-box">
    <h2 style="margin:0 0 4px">⚙️ ตั้งค่า</h2>
    <p class="set-hint">แตะสวิตช์เพื่อสลับ — <b class="set-hint-on">เขียว = เปิดอยู่</b> · <b class="set-hint-off">เทา = ปิดอยู่</b></p>
    <div class="set-row" id="set-sound">
      <span class="set-lwrap"><span class="set-label">🔊 เสียงในเกม</span>
        <span class="set-desc">เสียงเอฟเฟกต์ ปุ่มกด และอ่านออกเสียงคำศัพท์</span></span>
      <button class="set-switch" aria-label="สลับเสียงในเกม"></button>
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
    <div class="set-row set-blk-row" id="set-blk">
      <span class="set-label">🦸 ตัวละครของหนู<br><small class="set-sub2">แตะเลือกตัวที่จะยืนข้างน้อง · เป็นรูปโปรไฟล์ของหนูด้วย</small></span>
      <div class="blk-grid">
        ${['blk1','blk2','blk3','blk4','blk5','blk6','blk7','blk8'].map(b=>
          `<button class="blk-mini" data-blk="${b}"><img src="img/blocks/${b}.png" alt="${b}"></button>`).join('')}
      </div>
    </div>
    <div class="set-feed-head">📰 การเปิดเผยกิจกรรมในโปรไฟล์
      <span class="set-feed-sub">เลือกเองว่าให้เพื่อนเห็นอะไรบ้างในหน้าโปรไฟล์/ฟีด — ทุกหมวดปิดมาตั้งแต่แรก ไม่มีใครเห็นจนกว่าหนูจะเปิด</span></div>
    ${Object.keys(FEED_CATS).map(k=>`
    <div class="set-row set-feed-row" data-cat="${k}">
      <span class="set-lwrap"><span class="set-label">${FEED_CATS[k].e} ${FEED_CATS[k].n}</span>
        <span class="set-desc">${FEED_CATS[k].d}</span></span>
      <button class="set-switch" aria-label="สลับการเปิดเผย ${FEED_CATS[k].n}"></button>
    </div>`).join('')}
    <button class="set-help" id="set-help">📖 วิธีเล่นเกม</button>
    ${(typeof isTeacher==='function' && isTeacher()) ?
      `<button class="set-help" id="set-teacher">👩‍🏫 คู่มือครู (เครื่องมือคุมห้อง)</button>` : ''}
    <div style="margin-top:16px"><button class="set-close">เสร็จแล้ว</button></div>
  </div>`;
  const setSwitch = (el, on)=>{   // แสดงสวิตช์เลื่อน: ลูกกลม + คำว่า เปิด/ปิด
    if(!el) return;
    el.className = 'set-switch ' + (on ? 'on' : 'off');
    el.innerHTML = `<span class="set-sw-txt">${on ? 'เปิด' : 'ปิด'}</span><span class="set-sw-knob"></span>`;
  };
  const paint = ()=>{
    setSwitch(overlay.querySelector('#set-sound .set-switch'), state.sound);
    setSwitch(overlay.querySelector('#set-haptic .set-switch'), state.haptic !== false);
    setSwitch(overlay.querySelector('#set-anim .set-switch'), !state.noAnim);   // "เปิด" = มีเอฟเฟกต์ · "ปิด" = ปิดเพื่อความลื่น
    const curBlk = (typeof lobbyBlk === 'function') ? lobbyBlk() : (state.blockAv || 'blk1');   // 🧱 รอบ 238 · ไฮไลต์ตัวที่เลือกอยู่
    overlay.querySelectorAll('.blk-mini').forEach(b=>b.classList.toggle('sel', curBlk === b.dataset.blk));
    // 📰 รอบ 155: สวิตช์เปิดเผยกิจกรรม (default ปิดทุกหมวด)
    overlay.querySelectorAll('.set-feed-row').forEach(r=>
      setSwitch(r.querySelector('.set-switch'), !!(state.feedShare && state.feedShare[r.dataset.cat])));
  };
  // 🧱 รอบ 238/245: เลือก "ตัวละครของหนู" (บล็อก blk1..8) = ยืนข้างน้องในล็อบบี้ + เป็นรูปโปรไฟล์
  //   (เก็บใน state.blockAv — ตัวเดียวกับที่ใช้ในโลกขับรถ/ผจญภัย)
  overlay.querySelectorAll('.blk-mini').forEach(b=>b.addEventListener('click', ()=>{
    state.blockAv = b.dataset.blk;
    saveState(); sfx.select(); paint();
    if(typeof renderDashboard === 'function') renderDashboard();   // อัปเดตแถบโปรไฟล์ + ตัวในล็อบบี้ทันที
  }));
  overlay.querySelector('#set-sound .set-switch').addEventListener('click', ()=>{
    state.sound = !state.sound; saveState(); paint(); if(state.sound) sfx.select();
    if(typeof Music !== 'undefined') Music.onSound();          // รอบ 181: หยุด/เล่นเพลงตามสวิตช์เสียง
  });
  const hSwitch = overlay.querySelector('#set-haptic .set-switch');
  if(hSwitch) hSwitch.addEventListener('click', ()=>{
    state.haptic = (state.haptic === false); saveState(); paint();
    if(state.haptic && navigator.vibrate) navigator.vibrate(50);
  });
  overlay.querySelector('#set-anim .set-switch').addEventListener('click', ()=>{
    state.noAnim = !state.noAnim; saveState(); applyNoAnim(); paint();
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
  overlay.querySelector('#set-help').addEventListener('click', openHelp);
  const tg = overlay.querySelector('#set-teacher');
  if(tg) tg.addEventListener('click', openTeacherGuide);
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
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
      <div class="help-item"><b>🍚 ข้าวเย็นของหนู</b><br>คนก็ต้องกินข้าวเย็นตอน 18:00 เหมือนกัน! แตะปุ่ม 🍚 มุมขวาบน (มื้อละ 🪙200) ถ้าลืมกินจนเลย 20:00 จะป่วย ต้องจ่ายค่ารักษา 🪙100</div>
      <div class="help-item"><b>☠️ อาหารคน vs อาหารสัตว์</b><br>เมนูอาหารแยก 2 ชุด — <b>ชุดอาหารสัตว์</b> ปลอดภัยเสมอ ส่วน <b>ชุดอาหารคน</b> บางอย่างเป็นโทษกับสัตว์จริงๆ (เช่น ช็อกโกแลต องุ่น นมวัว เป็นพิษกับหมาแมว · มังกรกินเผ็ดได้แต่แพ้ของหวาน) ป้อนได้แต่<b>พิษจะสะสม</b> ไม่ลดเอง — เต็ม 100 น้องป่วยทันที! ขับพิษที่หลอด ☠️ ได้ (🪙1,000) · ฝึกความรู้ได้ที่ปุ่ม <b>🛡️ ควิซอาหารปลอดภัย</b> (รับเหรียญได้วันละรอบ)</div>
      <div class="help-item"><b>💪 รูปร่างของน้องเปลี่ยนตามการกิน</b><br>กินดีเต็มหลอด <b>3 มื้อติด</b> → <b>ล่ำกำยำ</b> ได้ EXP แถม +2 ทุกคำ! · กินของโทษ 3 มื้อติด → <b>อ้วนกลม</b> 🍩 · อดข้าวบ่อย → <b>ผอมโซ</b> 🦴 — กลับมากินดีๆ ต่อเนื่อง หุ่นก็กลับมาปกติได้เสมอ</div>
      <div class="help-item"><b>🏠 บ้าน &amp; บิล</b><br>ซื้อบ้านให้น้องหลบแดดหลบฝน · ทุกเดือนมีค่าบำรุง/ค่าไฟ/ค่าน้ำ/ค่าขยะ — ถ้ามี <span style="color:#e8483f;font-weight:bold">จุดแดง</span> บนปุ่มแปลว่ามีบิลค้าง รีบไปจ่ายนะ</div>
      <div class="help-item"><b>💰 หาเงินเพิ่ม</b><br>🌳 ฟาร์มปลูกผัก · 🏭 โรงงานผลิตของ · 🏪 ตลาดขายของ · 📱 มือถือ/💻 คอมพิวเตอร์ ช่วยเพิ่มรายได้</div>
      <div class="help-item"><b>📚 หมวดคำศัพท์ &amp; แบบทดสอบ</b><br>ฝึกคำศัพท์เป็นหมวด สอบผ่านรับรางวัลใหญ่ครั้งแรก</div>
      <div class="help-item"><b>👥 เพื่อน &amp; 🎁 ของขวัญ</b><br>เพิ่มเพื่อนด้วยรหัส 6 ตัว แชทและส่งของขวัญให้กันได้</div>
      <div class="help-item"><b>🌍 โลก 3D (ตั๋วที่ร้านค้า)</b><br>เลี้ยงน้องให้โตเต็มวัย (Lv.3) แล้วซื้อ <b>🎫 ตั๋วโลกผจญภัย</b> (🪙5,000) — เดินเก็บตัวอักษรมาประกอบคำศัพท์ คำละ 🪙15 ระวัง monster 👾 ยิงสู้ได้ · เก่งแล้วลอง <b>🎃 ตั๋วโลกผีสิง</b> (🪙10,000) คำละ 🪙25 แต่ผีสู้ไม่ได้ต้องหนี! · ในโลกเจอเพื่อนจริงๆ เดินไปมา แชทลอยหัว 💬 คุยเสียง 🎤 ได้ · 📨 ชวนเพื่อนเข้าโลกพร้อมกันครั้งแรก รับเงินคืนคนละ 🪙2,000 · กระดาน 🏆 มุมซ้ายบนโชว์ว่าใครประกอบคำเก่งสุดรอบนี้</div>
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
