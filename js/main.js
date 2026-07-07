"use strict";
/* ============================================================
   ปุ่มหลัก + INIT
   ============================================================ */
document.getElementById('btn-register').addEventListener('click', ()=>{
  const first = document.getElementById('reg-first').value.trim();
  const last  = document.getElementById('reg-last').value.trim();
  const grade = document.getElementById('reg-grade').value;
  if(!first || !last){
    sfx.wrong();
    toast('กรอกชื่อและนามสกุลให้ครบก่อนนะ 😊');
    return;
  }
  // ชื่อในเกม (ข้อ 0.2): ตรวจ regex ไทย/อังกฤษ/เลข/เว้นวรรค + คำหยาบ (badwords.js)
  const nick = checkName(document.getElementById('reg-nick').value, 2, 20);
  if(!nick.ok){
    sfx.wrong();
    toast('ชื่อในเกม: ' + nick.msg, 2400);
    return;
  }
  state.student = {first, last, grade};
  state.profileName = nick.name;
  state.playerFedDay = mealDayKey(Date.now());   // ข้อ 6: ผู้เล่นใหม่ถือว่าอิ่มมื้อล่าสุด (เริ่มนับมื้อหน้า กันป่วยตั้งแต่วันแรก)
  saveState();
  authPushProfile();                   // ชื่อในเกมขึ้น /users/<uid>/profile/name
  authPushSave(true);                  // ลงทะเบียนเสร็จ ส่งเซฟขึ้นบัญชีทันที
  // ประกาศตัวขึ้น presence/leaderboard ทันที เพื่อให้เพื่อนค้นหาเจอ "ชื่อ+ชั้น" ได้เลย
  // (ไม่ต้องรอ beat 60 วิ — กันเคสค้นเจอแต่ชื่อขึ้นว่า "ผู้เล่น")
  if(typeof onlinePushPresence === 'function') onlinePushPresence();
  if(typeof onlinePushScore    === 'function') onlinePushScore();
  sfx.levelup();
  toast(`ยินดีต้อนรับ ${nick.name}! 🎉`);
  renderDashboard();
  showScreen('screen-dashboard');
});

document.getElementById('btn-google-login').addEventListener('click', authLoginClick);
document.getElementById('btn-login-retry').addEventListener('click', ()=>location.reload());
document.getElementById('btn-logout').addEventListener('click', authLogout);

document.getElementById('btn-play').addEventListener('click', ()=>startGame(null));
document.getElementById('btn-foodquiz').addEventListener('click', openFoodQuiz);   // ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
document.getElementById('btn-cats').addEventListener('click', ()=>{ renderCats(); showScreen('screen-cats'); });
document.getElementById('btn-stats').addEventListener('click', ()=>{ renderStats(); showScreen('screen-stats'); });
document.getElementById('btn-cats-back').addEventListener('click', ()=>{ renderDashboard(); showScreen('screen-dashboard'); });
document.getElementById('btn-stats-back').addEventListener('click', ()=>{ renderDashboard(); showScreen('screen-dashboard'); });
document.getElementById('btn-quiz-back').addEventListener('click', ()=>{ renderCats(); showScreen('screen-cats'); });
document.getElementById('btn-petshop-back').addEventListener('click', ()=>{ renderDashboard(); showScreen('screen-dashboard'); });
document.getElementById('btn-back').addEventListener('click', ()=>{
  clearInterval(game.timerId);
  renderDashboard();
  showScreen('screen-dashboard');
});
// หน้าตั้งค่า (รวมสวิตช์เสียง/สั่นไว้ที่เดียว — openSettings อยู่ใน util.js)
document.getElementById('btn-settings').addEventListener('click', openSettings);
// ข้าวเย็นผู้เล่น (คิว 7725691507 ข้อ 6) — กิน 200 / ป่วยรักษา 1,000
document.getElementById('btn-dinner').addEventListener('click', dinnerClick);
// แตะ badge เลขรวมบนปุ่ม ⚙️ → เมนูสรุปสิ่งที่ค้าง (ไม่เปิดหน้าตั้งค่า)
document.getElementById('settings-badge').addEventListener('click', (e)=>{ e.stopPropagation(); openAttentionSummary(); });
/* ปุ่มรีเซ็ตเกม (btn-reset) ถูกถอดออกตามคำสั่งผู้ใช้ 5 ก.ค. 2026 — อันตรายเกินไป
   (เด็กเข้าใจผิดว่าเป็น logout → เซฟหายถาวรทั้งเครื่องและ cloud)
   ถ้าต้องรีเซ็ตจริงให้ทำผ่าน console: localStorage.removeItem(STORAGE_KEY) + ลบ /users/<uid>/save ใน DB */

/* ---------- INIT ---------- */
// ตรวจหาภาพเริ่มต้น (ตะกร้า/ไข่ ในร้านสัตว์เลี้ยง) + เหรียญตราแรงค์ + ที่พัก
probeImages(Object.keys(PETS).map(k=>startImgKey(k))).then(()=>{
  if(document.getElementById('screen-select').classList.contains('active')) renderPetShop();
});
Promise.all([probeRankImages(), probeHomeImages(), probeCollectImages(), probeGiftImages()]).then(()=>{
  if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
});

/* เข้าเกมจริง — เรียกครั้งเดียวจาก authEnterGame (auth.js) หลัง login + sync เซฟเสร็จ
   (ก่อนหน้านั้นห้ามเรียก careTick เพราะ saveState จะไปบัมพ์ savedAt
   ทำให้เซฟเก่าในเครื่องดู "ใหม่กว่า" เซฟ cloud ทั้งที่ไม่ได้เล่นจริง) */
function bootGame(){
  // ตรวจหาภาพทุกแบบของสัตว์ที่เลี้ยงอยู่ (ทำหลัง sync — เซฟอาจเพิ่งโหลดมาจาก cloud)
  for(const p of state.pets){
    probeImages(petImageKeys(p.type)).then(()=>{
      if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
    });
  }
  careTick();
  if(!state.student){
    const acc = document.getElementById('reg-account');
    if(acc && Auth.user) acc.textContent = '☁️ บัญชี: ' + (Auth.user.email || '');
    showScreen('screen-register');     // ครั้งแรกของบัญชีนี้: ลงทะเบียนนักเรียนก่อน
  }else{
    renderDashboard();
    showScreen('screen-dashboard');
    // ผู้เล่นเดิมก่อนอัพเดทข้อ 0.2 ยังไม่มีชื่อในเกม → บังคับตั้งก่อนเล่นต่อ
    if(!state.profileName) authAskProfileName();
  }
}

// ระหว่างรอ auth โชว์หน้า login ไว้ก่อน (auth.js พาไปหน้าถัดไปเอง)
showScreen('screen-login');

// อัปเดตสถานะสัตว์เป็นระยะ (ทุก 1 นาที) ระหว่างเปิดหน้า Dashboard ค้างไว้
setInterval(()=>{
  if(!Auth.booted) return;             // ยังไม่เข้าเกม — ห้ามเดิน careTick (จะไปบัมพ์ savedAt)
  careTick();
  if(document.getElementById('screen-dashboard').classList.contains('active')){
    renderDashboard();
  }
}, 60000);

// เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ) — เช็กทุก 5 วิ ทุกหน้าจอ (โชว์เฉพาะฝนตก+ไม่มีบ้านสภาพดี)
setInterval(()=>{ if(Auth.booted) rainFxTick(); }, 5000);

// นาฬิกาใต้ชื่อผู้เล่น เดินทุกวินาที (เฉพาะตอนเปิดหน้า Dashboard)
setInterval(()=>{
  if(document.getElementById('screen-dashboard').classList.contains('active')) renderClock();
}, 1000);
