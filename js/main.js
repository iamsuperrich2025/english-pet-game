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
  state.student = {first, last, grade};
  saveState();
  authPushSave(true);                  // ลงทะเบียนเสร็จ ส่งเซฟขึ้นบัญชีทันที
  sfx.levelup();
  toast(`ยินดีต้อนรับ ${first}! 🎉`);
  renderDashboard();
  showScreen('screen-dashboard');
});

document.getElementById('btn-google-login').addEventListener('click', authLoginClick);
document.getElementById('btn-login-retry').addEventListener('click', ()=>location.reload());
document.getElementById('btn-logout').addEventListener('click', authLogout);

document.getElementById('btn-play').addEventListener('click', ()=>startGame(null));
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
document.getElementById('sound-toggle').addEventListener('click', ()=>{
  state.sound = !state.sound;
  saveState();
  document.getElementById('sound-toggle').textContent = state.sound ? '🔊' : '🔇';
  if(state.sound) sfx.select();
});
document.getElementById('btn-reset').addEventListener('click', ()=>{
  askConfirm('<h2>🔄 เริ่มเกมใหม่ทั้งหมด?</h2><p style="font-size:15px">ลบข้อมูลทั้งหมด รวมสัตว์เลี้ยงทุกตัว เหรียญ แรงค์ และประวัติการสอบ<br>เซฟที่เก็บในบัญชี Google ก็ถูกลบด้วยนะ ☁️</p>',
    'ลบแล้วเริ่มใหม่', ()=>{
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      if(Auth.user){
        state.ownerUid = Auth.user.uid;          // ยัง login อยู่ — เซฟใหม่เป็นของบัญชีนี้เลย
        saveState();
        authDeleteCloud(Auth.user.uid).catch(()=>{});
        Auth.lastPushedAt = 0;
      }
      document.getElementById('reg-first').value = '';
      document.getElementById('reg-last').value = '';
      showScreen('screen-register');
    });
});

/* ---------- INIT ---------- */
// ตรวจหาภาพเริ่มต้น (ตะกร้า/ไข่ ในร้านสัตว์เลี้ยง) + เหรียญตราแรงค์ + ที่พัก
probeImages(Object.keys(PETS).map(k=>startImgKey(k))).then(()=>{
  if(document.getElementById('screen-select').classList.contains('active')) renderPetShop();
});
Promise.all([probeRankImages(), probeHomeImages(), probeCollectImages()]).then(()=>{
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

// นาฬิกาใต้ชื่อผู้เล่น เดินทุกวินาที (เฉพาะตอนเปิดหน้า Dashboard)
setInterval(()=>{
  if(document.getElementById('screen-dashboard').classList.contains('active')) renderClock();
}, 1000);
