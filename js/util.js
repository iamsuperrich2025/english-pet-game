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
};

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
// html = เนื้อหา (ใส่ emoji ใหญ่ + ข้อความได้) · ปุ่มเดียว กด/แตะนอกกล่อง = ปิด
function alertBox(html, okText='เข้าใจแล้ว'){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay alert-overlay';
  overlay.innerHTML = `<div class="levelup-box alert-box">
    ${html}
    <div style="margin-top:16px"><button class="cf-ok alert-ok">${okText}</button></div>
  </div>`;
  const close = ()=>overlay.remove();
  overlay.querySelector('.cf-ok').addEventListener('click', close);
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
    <h2 style="margin:0 0 6px">⚙️ ตั้งค่า</h2>
    <div class="set-row" id="set-sound">
      <span class="set-label">🔊 เสียงในเกม</span>
      <button class="set-switch"></button>
    </div>
    ${hapticSupported ? `<div class="set-row" id="set-haptic">
      <span class="set-label">📳 สั่นเตือน</span>
      <button class="set-switch"></button>
    </div>` : ''}
    <div class="set-row" id="set-anim">
      <span class="set-label">✨ เอฟเฟกต์เคลื่อนไหว</span>
      <button class="set-switch"></button>
    </div>
    <button class="set-help" id="set-help">📖 วิธีเล่นเกม</button>
    <div style="margin-top:16px"><button class="set-close">เสร็จแล้ว</button></div>
  </div>`;
  const paint = ()=>{
    const s = overlay.querySelector('#set-sound .set-switch');
    s.textContent = state.sound ? 'เปิด' : 'ปิด';
    s.className = 'set-switch ' + (state.sound ? 'on' : 'off');
    const h = overlay.querySelector('#set-haptic .set-switch');
    if(h){ const on = state.haptic !== false; h.textContent = on ? 'เปิด' : 'ปิด'; h.className = 'set-switch ' + (on ? 'on' : 'off'); }
    const a = overlay.querySelector('#set-anim .set-switch');
    const animOn = !state.noAnim;   // สวิตช์ "เปิด" = มีเอฟเฟกต์ · "ปิด" = ปิดเพื่อความลื่น
    a.textContent = animOn ? 'เปิด' : 'ปิด';
    a.className = 'set-switch ' + (animOn ? 'on' : 'off');
  };
  overlay.querySelector('#set-sound .set-switch').addEventListener('click', ()=>{
    state.sound = !state.sound; saveState(); paint(); if(state.sound) sfx.select();
  });
  const hSwitch = overlay.querySelector('#set-haptic .set-switch');
  if(hSwitch) hSwitch.addEventListener('click', ()=>{
    state.haptic = (state.haptic === false); saveState(); paint();
    if(state.haptic && navigator.vibrate) navigator.vibrate(50);
  });
  overlay.querySelector('#set-anim .set-switch').addEventListener('click', ()=>{
    state.noAnim = !state.noAnim; saveState(); applyNoAnim(); paint();
  });
  overlay.querySelector('#set-help').addEventListener('click', openHelp);
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
    <h2 style="margin:0 0 8px">📖 วิธีเล่น Pet Vocab Adventure</h2>
    <div class="help-body">
      <div class="help-item"><b>🎮 เล่นเกมจับคู่คำศัพท์</b><br>กดปุ่ม "เล่นเกมจับคู่คำศัพท์!" ตอบให้ถูกเพื่อรับ 🪙 เหรียญ ยิ่งเก่งยิ่งได้เยอะ</div>
      <div class="help-item"><b>🐾 เลี้ยงน้อง</b><br>เอาเหรียญไปซื้ออาหารให้น้องกิน อย่าให้หิวหรือร้อนเกินไป ไม่งั้นน้องจะป่วย 🤒 (ต้องจ่ายค่ารักษา)</div>
      <div class="help-item"><b>🏠 บ้าน &amp; บิล</b><br>ซื้อบ้านให้น้องหลบแดดหลบฝน · ทุกเดือนมีค่าบำรุง/ค่าไฟ/ค่าน้ำ/ค่าขยะ — ถ้ามี <span style="color:#e8483f;font-weight:bold">จุดแดง</span> บนปุ่มแปลว่ามีบิลค้าง รีบไปจ่ายนะ</div>
      <div class="help-item"><b>💰 หาเงินเพิ่ม</b><br>🌳 ฟาร์มปลูกผัก · 🏭 โรงงานผลิตของ · 🏪 ตลาดขายของ · 📱 มือถือ/💻 คอมพิวเตอร์ ช่วยเพิ่มรายได้</div>
      <div class="help-item"><b>📚 หมวดคำศัพท์ &amp; แบบทดสอบ</b><br>ฝึกคำศัพท์เป็นหมวด สอบผ่านรับรางวัลใหญ่ครั้งแรก</div>
      <div class="help-item"><b>👥 เพื่อน &amp; 🎁 ของขวัญ</b><br>เพิ่มเพื่อนด้วยรหัส 6 ตัว แชทและส่งของขวัญให้กันได้</div>
      <div class="help-item"><b>⚙️ ตั้งค่า</b><br>เปิด/ปิด เสียง สั่นเตือน และเอฟเฟกต์เคลื่อนไหว (ปิดได้ถ้าเครื่องช้า)</div>
    </div>
    <div style="margin-top:14px"><button class="set-close">เข้าใจแล้ว!</button></div>
  </div>`;
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}
