"use strict";
/* ============================================================
   ปุ่มหลัก + INIT
   ============================================================ */
if(typeof Music !== 'undefined') Music.init();   // 🎵 รอบ 181: probe เพลง + เริ่ม bg หลัง gesture แรก

/* ข้อ 4: เลือกตัวละครผู้เลี้ยง (ชาย/หญิง) ตอนลงทะเบียน — ไฮไลต์ตัวที่เลือก */
let regAvatar = null;
document.querySelectorAll('#reg-avatar .avatar-opt').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    sfx.select();
    regAvatar = btn.dataset.av;
    document.querySelectorAll('#reg-avatar .avatar-opt').forEach(b=>b.classList.toggle('sel', b === btn));
  });
});

document.getElementById('btn-register').addEventListener('click', ()=>{
  const grade = document.getElementById('reg-grade').value;
  // 🛡️ รอบ 187: มาตรการคุ้มครองเด็ก — ไม่เก็บชื่อจริง/นามสกุล เหลือแค่ชื่อเล่น + ชั้น (ชั้นใช้เลือกความยากคำศัพท์ ไม่โชว์ในเกม)
  const nick = checkName(document.getElementById('reg-nick').value, 2, 20);
  if(!nick.ok){
    sfx.wrong();
    toast('ชื่อเล่น: ' + nick.msg, 2400);
    return;
  }
  if(!regAvatar){
    sfx.wrong();
    toast('เลือกตัวละครของหนูก่อนนะ 🦸');
    return;
  }
  /* 🔒 รอบ 647: ต้องเลือกชั้นเอง (ไม่มี default แล้ว) — เปลี่ยนทีหลังได้เดือนละครั้งและลดลงไม่ได้ */
  if(!grade){
    sfx.wrong();
    toast('เลือกระดับชั้นของหนูก่อนนะ 🎖️ (เปลี่ยนทีหลังได้เดือนละครั้ง และลดชั้นลงไม่ได้)', 3600);
    return;
  }
  state.student = {grade};
  /* ตอนสมัครไม่นับเป็น "การเปลี่ยนชั้น" → gradeSetAt=0 (ยังขยับขึ้นได้ 1 ครั้งถ้าเลือกผิด) */
  state.gradeSetAt = 0;
  state.gradeHist  = [{g:grade, at:Date.now()}];
  state.profileName = nick.name;
  state.playerAvatar = regAvatar;      // ข้อ 4: ตัวละครผู้เลี้ยง
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
document.getElementById('btn-offline-play').addEventListener('click', ()=>authEnterOffline());   // รอบ 267: เล่นออฟไลน์ เน็ตมาค่อย sync
document.getElementById('btn-logout').addEventListener('click', authLogout);

document.getElementById('btn-play').addEventListener('click', ()=>
  typeof bandPlayLobby === 'function' ? bandPlayLobby() : startGame(null));   // จับคู่ด้วยคลังศัพท์ band ตามชั้น (รอบ 265)
document.getElementById('btn-band-exam').addEventListener('click', ()=>{     // รอบ 267: สอบเลื่อนขั้น = แผงชุดข้อสอบระดับตัวเอง
  if(typeof bandExamLobby === 'function') bandExamLobby();
});
document.getElementById('btn-foodquiz').addEventListener('click', openFoodQuiz);   // ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
document.getElementById('btn-cats').addEventListener('click', ()=>{ renderCats(); showScreen('screen-cats'); });
document.getElementById('btn-stats').addEventListener('click', ()=>{ renderStats(); showScreen('screen-stats'); });
document.getElementById('btn-rail-trophy').addEventListener('click', showProgressReport);   // 🏆 ปุ่มลัดดูตู้เข็มสะสม/ความก้าวหน้า (รอบ 107)
document.getElementById('btn-rail-cure').addEventListener('click', railCureClick);   // ปุ่มรักษาด่วน (กดได้เฉพาะตอนมีน้องป่วย)
// 🥇 รอบ 594: ปุ่มอันดับในราง (แทนกลุ่มอันดับที่เคยอยู่คอลัมน์ขวา) → เปิดกระดานเต็มจอเลย
document.getElementById('btn-rail-rank').addEventListener('click', ()=>{
  if(typeof closePanel === 'function') closePanel();
  if(typeof openLeaderboardFull === 'function') openLeaderboardFull();
});
document.getElementById('btn-cats-back').addEventListener('click', ()=>{ renderDashboard(); showScreen('screen-dashboard'); });
document.getElementById('btn-stats-back').addEventListener('click', ()=>{ renderDashboard(); showScreen('screen-dashboard'); });
document.getElementById('btn-quiz-back').addEventListener('click', ()=>{ renderCats(); showScreen('screen-cats'); });
document.getElementById('btn-petshop-back').addEventListener('click', ()=>{ renderDashboard(); showScreen('screen-dashboard'); });
document.getElementById('btn-petshop-play').addEventListener('click', ()=>startGame(null)); // ลิงก์ใต้เหรียญในร้านสัตว์เลี้ยง → เข้าเกมสะสมเหรียญ
document.getElementById('btn-back').addEventListener('click', exitGame);   // ออกจากเกม + เด้งการ์ดสรุปถ้าทำสถิติใหม่ (exitGame ใน game.js)
// หน้าตั้งค่า (รวมสวิตช์เสียง/สั่นไว้ที่เดียว — openSettings อยู่ใน util.js)
document.getElementById('btn-settings').addEventListener('click', openSettings);
// 💡 รอบ 156: แตะ pill ตัวเลขบน header Lobby → หน้าต่างอธิบายว่าเลขนี้คืออะไร (openPillInfo ใน ui.js)
document.getElementById('coin-count').closest('.coin-pill').addEventListener('click', ()=>openPillInfo('coins'));
document.getElementById('coin-today').closest('.coin-pill').addEventListener('click', ()=>openPillInfo('today'));
document.getElementById('net-pill').addEventListener('click', ()=>openPillInfo('net'));
document.getElementById('offline-pill').addEventListener('click', ()=>openPillInfo('offline'));   // รอบ 269: แตะป้าย 📴 = กล่องอธิบาย
// รอบ 179: ปุ่มแชท header → หน้ารวมข้อความ (ปุ่มข้าวเย็นย้ายไปแถวแท็บสัตว์ ผูก click ใน renderDashboard)
document.getElementById('btn-chat').addEventListener('click', openChatInbox);
// 🎵 รอบ 184: ปุ่มเปิด/ปิดเพลงพื้นหลัง (แยกจากสวิตช์เสียง)
function syncMusicBtn(){
  const b = document.getElementById('btn-music');
  if(!b) return;
  const on = (typeof Music === 'undefined') || Music.isMusicOn();
  b.textContent = on ? '🎵' : '🔇';
  b.classList.toggle('off', !on);
  b.classList.toggle('playing', on);   // 🎵 รอบ 186: เพลงเปิด = แสงเขียววิ่งวนขอบปุ่ม
  b.title = on ? 'ปิดเพลงพื้นหลัง' : 'เปิดเพลงพื้นหลัง';
}
document.getElementById('btn-music').addEventListener('click', ()=>{
  if(typeof Music !== 'undefined') Music.toggleMusic();
  if(typeof sfx !== 'undefined') sfx.select();
  syncMusicBtn();
});
syncMusicBtn();
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
Promise.all([probeRankImages(), probeHomeImages(), probeCollectImages(), probeGiftImages(),
             probeImages(['player_male','player_female'])]).then(()=>{   // ข้อ 4: ภาพตัวละครผู้เลี้ยง
  if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
});

/* ============================================================
   🎁 เงินรางวัลย้อนหลัง (รอบ 593 · ผู้ใช้สั่ง) — ปรับรางวัลสอบผ่าน 10 ข้อ 100 → 500
   เซฟที่เคยสอบผ่านก่อนประกาศใหม่ ได้ส่วนต่างย้อนหลังตอนโหลด (คิดใน loadState → state.quizBackPay)
   ที่นี่ทำหน้าที่ "เด้งบอกเด็กครั้งเดียว" ว่าได้เพิ่มเท่าไหร่ เพราะอะไร
   ============================================================ */
function showQuizBackPay(){
  const b = state.quizBackPay;
  if(!b || !b.total) return;
  state.quizBackPay = null; saveState();              // เด้งครั้งเดียวพอ (เหรียญเข้าไปแล้วตั้งแต่ตอนโหลด)
  const num  = (typeof fmtNum === 'function') ? fmtNum : (n)=>String(n);
  const name = state.profileName || (state.student && state.student.first) || 'หนู';
  if(typeof sfx !== 'undefined' && sfx.coinGet) sfx.coinGet();
  const ov = document.createElement('div');
  ov.className = 'rankup-overlay';
  ov.innerHTML = `
    <div class="rankup-rays" style="--rank-color:#ffd76a"></div>
    <div class="rankup-content qbp">
      <div class="rankup-title">🎁 ปรับเงินรางวัลใหม่ — จ่ายย้อนหลังให้ด้วย!</div>
      <div class="qbp-coin">🪙</div>
      <div class="rankup-name" style="color:#ffb300">+${num(b.total)} เหรียญ 🪙</div>
      <p class="rankup-sub">ยินดีด้วย ${escapeHTML(name)}! 🎉<br>
        ตอนนี้ <b>สอบผ่าน 10 ข้อ รับ ${num(b.to)} เหรียญ</b> (เดิม ${num(b.from)} เหรียญ)<br>
        <small>หนูเคยสอบผ่านไปแล้ว <b>${num(b.n)} หมวด</b> ตอนนั้นได้หมวดละ ${num(b.from)}<br>
        ระบบเลยเติมส่วนต่างให้อีกหมวดละ <b>${num(b.per)}</b> = <b>${num(b.total)} เหรียญ</b> ให้ครบเท่ารางวัลใหม่<br>
        หมวดที่ยังไม่ได้สอบ ผ่านครั้งแรกรับ ${num(b.to)} เหรียญเลย 💪</small></p>
      <button class="rankup-btn">เก็บเหรียญ! 🥳</button>
    </div>`;
  // หมุนจอ/ย่อหน้าต่าง = คำนวณใหม่ ไม่ให้ล้น (หน่วงนิดให้ innerHeight นิ่งก่อน ไม่งั้นวัดได้ค่าเก่า)
  let refitT = 0;
  const refit = ()=>{ clearTimeout(refitT); refitT = setTimeout(()=>fitQbp(ov.querySelector('.qbp')), 140); };
  ov.querySelector('.rankup-btn').addEventListener('click', ()=>{
    clearTimeout(refitT);
    window.removeEventListener('resize', refit);
    ov.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(ov);
  fitQbp(ov.querySelector('.qbp'));      // 🔍 รอบ 596: ตัวใหญ่สุดเท่าที่จอรับไหว (ผู้ใหญ่สายตายาวอ่านชัด)
  window.addEventListener('resize', refit);
  if(typeof feedEvent === 'function')
    feedEvent('coin', `รับเงินรางวัลย้อนหลัง +${num(b.total)} 🪙 (ปรับรางวัลสอบผ่านเป็น ${num(b.to)} เหรียญ)`);
}

/* 🔍 รอบ 596 (ผู้ใช้สั่ง: "ขยายตัวหนังสือให้ผู้ใหญ่สายตาไม่ดีอ่านชัด แต่ห้ามมี scrollbar")
   ขนาดทุกชิ้นในกล่องอิง em ของ .qbp ซึ่งฐานเป็น clamp(...dvh...) ใน style.css — พอดีจอเองอยู่แล้ว
   ฟังก์ชันนี้เป็นตัวกันเหนียว: ถ้าบางจอ/บางภาษายังสูงล้น ก็หรี่ตัวคูณ --qbp-k ลงทีละสเต็ป
   ใช้ offsetHeight (ไม่โดน transform ของแอนิเมชัน popIn หลอกเหมือน getBoundingClientRect) */
function fitQbp(box){
  if(!box) return;
  const room = ()=> window.innerHeight * 0.96;
  let k = 1;
  box.style.setProperty('--qbp-k', k);
  while(box.offsetHeight > room() && k > 0.6){
    k = Math.round((k - 0.04) * 100) / 100;
    box.style.setProperty('--qbp-k', k);
  }
}

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
    else setTimeout(showQuizBackPay, 700);   // 🎁 รอบ 593: แจ้งเงินรางวัลย้อนหลัง (ถ้ามี) หลังหน้าจอนิ่ง
  }
}

// ระหว่างรอ auth โชว์หน้า login ไว้ก่อน (auth.js พาไปหน้าถัดไปเอง)
showScreen('screen-login');

// อัปเดตสถานะสัตว์เป็นระยะ (ทุก 1 นาที) ระหว่างเปิดหน้า Dashboard ค้างไว้
setInterval(()=>{
  if(!Auth.booted) return;             // ยังไม่เข้าเกม — ห้ามเดิน careTick (จะไปบัมพ์ savedAt)
  careTick();
  testerBoost();                       // 🧪 รอบ 163: เปิดเกมค้างข้ามวัน → เติมเหรียญผู้ทดสอบรอบวันใหม่เอง (มี guard วันละครั้งในตัว)
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

// item 8: แท็บถูกซ่อน/สลับแอพ → ตกเหรียญโบนัสออนไลน์ที่ค้างแล้วหยุดนับ (กลับมาแล้ว careTick/renderClock เริ่มนับใหม่เอง)
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState === 'hidden' && Auth.booted && typeof onlineEarnFlush === 'function')
    onlineEarnFlush(Date.now());
});
