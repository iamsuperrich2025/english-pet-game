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
function toast(msg, ms=1800){
  const t = document.createElement('div');
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
  wrong  : ()=>{ beep(180,.25,0,'sawtooth',.08); },
  coin   : ()=>{ beep(1320,.1,.05,'triangle'); },
  levelup: ()=>{ [523,659,784,1047].forEach((f,i)=>beep(f,.2,i*.13)); },
  buy    : ()=>{ beep(880,.1); beep(1175,.15,.08); },
  rankup : ()=>{ [392,523,659,784,1047,1319].forEach((f,i)=>beep(f,.25,i*.11,'triangle',.18)); },
};

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
