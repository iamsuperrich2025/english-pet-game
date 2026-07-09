"use strict";
/* ============================================================
   เกมจับคู่คำศัพท์ + หมวดคำศัพท์ & แบบทดสอบ
   รางวัล: จับคู่ถูก +10🪙 +2RP +5EXP · เคลียร์รอบ +20🪙 +5RP
   สอบผ่านครั้งแรก +รางวัลหมวด +100RP · ผ่านซ้ำ +20🪙 +30RP · ไม่ผ่าน +5RP
   ============================================================ */
const game = {
  pairs:[], selEn:null, selTh:null, matched:0,
  combo:0, hintUsed:false,
  timerId:null, timeLeft:0, totalTime:60, checking:false,
  pool:null,
  roundAt:0, roundClean:true,   // ⚡ จับเวลารอบ+ไม่พลาดเลย → เอฟเฟกต์สายฟ้า
  sessionCoins:0,               // 🪙 เหรียญที่เก็บได้ "ครั้งนี้" (เริ่มนับใหม่ทุกครั้งที่เข้าเกม) — โชว์เป็นกำลังใจ
  sessMilestone:0,              // หลักเหรียญครั้งนี้ที่ฉลองไปแล้วสูงสุด (กันฉลองซ้ำ)
  prevBest:0,                   // สถิติเหรียญ/ครั้ง "สัปดาห์นี้" เดิม (ตอนเข้าเกม) — ไว้เทียบว่าทำลายสถิติหรือยัง
  prevAllBest:0,                // สถิติเหรียญ/ครั้ง "ตลอดกาล" เดิม (ตอนเข้าเกม) — ไว้เช็กว่าเป็นสถิติสูงสุดตลอดกาลด้วยไหม
  beatBestShown:false,          // เด้ง "ทำลายสถิติ!" ไปแล้วในครั้งนี้ (โชว์ครั้งเดียวพอ)
};

/* 🎉 หลักเหรียญที่จะเด้งฉลอง "ว้าว! ครั้งนี้ X 🪙 แล้ว!" (ฐาน 10🪙/คู่ · 60/รอบ) */
const SESSION_MILESTONES = [100, 250, 500, 1000, 2000, 3000, 5000, 8000, 10000];

/* 🪙 อัปเดตตัวเลข "เล่นครั้งนี้เก็บไปแล้ว X" ในป้ายล่าง + เด้ง + ฉลองหลักเหรียญ/ทำลายสถิติ */
function addSessionCoins(n){
  game.sessionCoins += n;
  const el = document.getElementById('game-session-coins');
  if(el){
    el.textContent = fmtNum(game.sessionCoins) + ' 🪙';
    // สีป้ายไต่ระดับตามจำนวนเหรียญครั้งนี้ (เทา→เขียว→ทอง→รุ้ง) ให้รู้สึก "เลเวลอัป" การสะสม
    const tier = game.sessionCoins>=2000 ? 3 : game.sessionCoins>=500 ? 2 : game.sessionCoins>=100 ? 1 : 0;
    el.classList.remove('t1','t2','t3');
    if(tier) el.classList.add('t'+tier);
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  if(n <= 0) return;   // รีเซ็ต/โหลดป้าย ไม่ต้องฉลอง

  // 🎉 ฉลองเมื่อข้ามหลักเหรียญใหม่ (เด้งหลักสูงสุดที่เพิ่งข้าม กันเด้งรัวหลายหลักพร้อมกัน)
  const passed = SESSION_MILESTONES.filter(m => game.sessionCoins >= m && m > game.sessMilestone).pop();
  if(passed){
    game.sessMilestone = passed;
    setTimeout(()=>{   // หน่วงให้พ้น float +เหรียญ/คอมโบ ก่อน
      sfx.levelup();
      floatFx(`🎉 ว้าว! ครั้งนี้ ${fmtNum(passed)} 🪙 แล้ว!`, '#ffb521');
    }, 620);
  }

  // 🏆 ทำลายสถิติ "สัปดาห์นี้" (รีเซ็ตทุกจันทร์ → เด็กมีโอกาสทำลายใหม่เรื่อยๆ ไม่ตัน) · เด้งครั้งเดียว/ครั้งเล่น
  if(!game.beatBestShown && game.prevBest > 0 && game.sessionCoins > game.prevBest){
    game.beatBestShown = true;
    updateBestTarget();   // เปลี่ยนป้ายเป้าเป็น "สถิติสัปดาห์ใหม่แล้ว!"
    setTimeout(()=>{
      sfx.rankup();
      toast(`🏆 ทำลายสถิติสัปดาห์นี้! ครั้งนี้เก็บเกิน ${fmtNum(game.prevBest)} 🪙 ที่เคยทำได้แล้ว เก่งขึ้นทุกวันเลย!`, 3200);
    }, passed ? 1500 : 700);   // ถ้าเพิ่งเด้งหลักเหรียญ ให้เหลื่อมกันไม่ให้ทับ
  }

  // อัปเดตสถิติสูงสุด — ทั้งสัปดาห์นี้และตลอดกาล (เซฟจะถูกบันทึกโดย saveState ที่ตามมาใน checkMatch)
  if(game.sessionCoins > (state.weekBestCoins||0)) state.weekBestCoins = game.sessionCoins;
  if(game.sessionCoins > (state.bestSessionCoins||0)) state.bestSessionCoins = game.sessionCoins;
}

/* 🏆 ป้ายบอกเป้าสถิติสัปดาห์ในการ์ดล่าง — มีสถิติสัปดาห์นี้=ตั้งเป้าให้ทำลาย · ทำลายแล้ว=ฉลอง · ยังไม่มี=ซ่อน */
function updateBestTarget(){
  const el = document.getElementById('game-best-target');
  if(!el) return;
  if(game.beatBestShown){
    el.innerHTML = `<br>🏆 <b>สถิติสัปดาห์ใหม่แล้ว!</b> เก่งกว่าตัวเองสุดๆ 🎉`;
  }else if(game.prevBest > 0){
    el.innerHTML = `<br>🏆 สถิติสัปดาห์นี้: <b>${fmtNum(game.prevBest)} 🪙</b> — ครั้งนี้เก็บให้เกินสิ!`;
  }else{
    el.innerHTML = '';   // สัปดาห์นี้ยังไม่มีสถิติ — ไม่ต้องโชว์เป้า
  }
}

/* 🗓️ คีย์สัปดาห์ = วันจันทร์ของสัปดาห์นั้น (YYYY-MM-DD) — ใช้ตัดสินว่าถึงเวลารีเซ็ตสถิติรายสัปดาห์ */
function weekKeyStr(d){
  d = d ? new Date(d) : new Date();
  const mon = (d.getDay() + 6) % 7;           // จันทร์=0 ... อาทิตย์=6
  d.setDate(d.getDate() - mon); d.setHours(0,0,0,0);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function rolloverWeekBest(){   // ถ้าข้ามสัปดาห์แล้ว → ล้างสถิติสัปดาห์ เริ่มนับใหม่
  const wk = weekKeyStr();
  if(state.weekKey !== wk){ state.weekKey = wk; state.weekBestCoins = 0; }
}

/* 🚪 ออกจากเกม (ปุ่ม ⬅ กลับ) — ถ้ารอบเล่นนี้ทำสถิติใหม่ เด้งการ์ดสรุปฉลองก่อนแล้วค่อยออก */
function exitGame(){
  clearInterval(game.timerId);
  const earned = game.sessionCoins;
  const madeRecord = earned > 0 && earned > game.prevBest;   // เก็บเกินสถิติสัปดาห์เดิม = สถิติใหม่
  const doExit = ()=>{ renderDashboard(); showScreen('screen-dashboard'); };
  if(madeRecord){
    const allTime = earned > game.prevAllBest;               // เป็นสถิติสูงสุดตลอดกาลด้วยไหม
    showSessionSummary(earned, allTime, doExit);
  }else{
    doExit();
  }
}

/* 🎉 การ์ดสรุปตอนจบการเล่น (เมื่อทำสถิติใหม่) */
function showSessionSummary(earned, allTime, onClose){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay summary-overlay';
  overlay.innerHTML = `<div class="levelup-box summary-box">
    <div class="sm-burst">🎉</div>
    <h2 class="sm-title">เก่งมากเลย!</h2>
    <p class="sm-line">รอบเล่นนี้หนูเก็บได้</p>
    <div class="sm-coin">${fmtNum(earned)} 🪙</div>
    <div class="sm-badge">🏆 ทำสถิติสัปดาห์ใหม่!</div>
    ${allTime ? `<div class="sm-badge sm-badge-all">⭐ และเป็นสถิติสูงสุดตลอดกาลด้วย!</div>` : ''}
    <p class="sm-cheer">พักได้เลย เดี๋ยวมาทำลายสถิติใหม่กันอีกนะ 💪</p>
    <button class="cf-ok summary-ok">ออกไปพัก 😊</button>
  </div>`;
  const close = ()=>{ overlay.remove(); if(onClose) onClose(); };
  overlay.querySelector('.summary-ok').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });   // แตะพื้นหลัง = ออกเหมือนกัน
  document.body.appendChild(overlay);
  if(typeof sfx !== 'undefined') sfx.rankup();
  if(state.haptic !== false && navigator.vibrate) navigator.vibrate([40,50,40,50,90]);
}

/* 📊 รายงานความก้าวหน้าของเด็ก (แยกต่างหาก) — รวมพัฒนาการตั้งแต่เริ่มเล่นทั้งหมด
   ออกแบบให้ "มีคุณค่า+ให้กำลังใจ" ไม่ใช่ตารางตัวเลขแห้งๆ: ระดับนักคำศัพท์+แถบความคืบหน้า,
   การ์ดสถิติเด่น, แบบทดสอบ, โลก 3D, เข็มรางวัล, สัตว์เลี้ยง + คำชมตามระดับ */
const VOCAB_PER_LEVEL = 50;                    // จับคู่ถูกครบ 50 คำ = ขึ้น 1 ระดับนักคำศัพท์
const VOCAB_RANK_NAMES = ['นักคำศัพท์น้อย','นักสำรวจคำ','นักผจญคำ','จอมคำศัพท์','ปรมาจารย์คำศัพท์'];
function vocabRankName(lvl){ return VOCAB_RANK_NAMES[Math.min(lvl-1, VOCAB_RANK_NAMES.length-1)] || VOCAB_RANK_NAMES[0]; }

function showProgressReport(){
  const s = state.student || {};
  const name = escapeHTML(state.profileName || s.first || 'หนู');
  const matches = state.totalMatches || 0;
  const lvl = Math.floor(matches / VOCAB_PER_LEVEL) + 1;
  const inLvl = matches % VOCAB_PER_LEVEL;
  const pct = Math.round(inLvl / VOCAB_PER_LEVEL * 100);
  const toNext = VOCAB_PER_LEVEL - inLvl;

  // แบบทดสอบ: ผ่านกี่หมวด / สอบกี่ครั้ง / เฉลี่ยถูกกี่ %
  const qCount = state.quizLog.length;
  const qPass = (typeof catsForStudent === 'function')
    ? catsForStudent().filter(c=>state.quizPassed.includes(c.id)).length
    : (state.quizPassed||[]).length;
  const qTotalCats = (typeof catsForStudent === 'function') ? catsForStudent().length : 0;
  const qAvg = qCount ? Math.round(state.quizLog.reduce((a,l)=>a + (l.total? l.score/l.total : 0), 0) / qCount * 100) : 0;

  // โลกผจญภัย 3D: คำที่พิชิตต่อโลก (โชว์เฉพาะโลกที่มีตั๋วหรือเคยพิชิต)
  const worlds = [
    {ic:'🌍', nm:'โลกผจญภัย',   n:(state.advDone||[]).length,   own:state.advTicket},
    {ic:'👻', nm:'โลกผีสิง',     n:(state.hauntDone||[]).length, own:state.hauntTicket},
    {ic:'🚁', nm:'โลกเฮลิคอปเตอร์', n:(state.heliDone||[]).length, own:state.heliTicket},
    {ic:'🛸', nm:'โลกโดรน FPV',  n:(state.droneDone||[]).length, own:state.droneTicket},
  ];
  const world3dTotal = worlds.reduce((a,w)=>a+w.n, 0);
  const worldRows = worlds.filter(w=>w.own || w.n>0).map(w=>
    `<div class="rp-row"><span>${w.ic} ${w.nm}</span><span><b>${fmtNum(w.n)}</b> คำ</span></div>`).join('')
    || `<div class="rp-empty">ยังไม่ได้เข้าโลก 3D — มีตั๋วเมื่อไหร่ลองผจญภัยดูนะ! 🚀</div>`;

  // เข็มรางวัลที่สะสมได้
  const badges = [];
  if(state.thunderBadge)   badges.push(THUNDER_TIER_UI[state.thunderBadge]);
  if(state.daredevilBadge) badges.push(DAREDEVIL_TIER_UI[state.daredevilBadge]);
  if(state.pilotBadge)     badges.push(['','🥉 ใบอนุญาตนักบิน','🥈 นักบินฝีมือดี','🥇 กัปตันมือทอง'][state.pilotBadge]);
  const badgeHtml = badges.length
    ? `<div class="rp-badges">${badges.map(b=>`<span class="rp-badge">${b}</span>`).join('')}</div>`
    : `<div class="rp-empty">ยังไม่มีเข็ม — เล่นเก่งๆ เดี๋ยวได้เข็มติดชื่อให้เพื่อนเห็น! 🎖️</div>`;

  // สัตว์เลี้ยง
  const petCount = state.pets.length;
  const petLv = state.pets.reduce((a,p)=>a + (p.level||1), 0);

  // คำชมตามจำนวนคำที่ทำได้ (ให้กำลังใจไล่ระดับ)
  const cheer = matches >= 500 ? 'สุดยอดไปเลย! หนูคือนักคำศัพท์ตัวจริง เก่งมากๆ 🌟'
    : matches >= 200 ? 'เก่งขึ้นเยอะเลย! สะสมคำศัพท์ได้เยอะมาก สู้ต่อไปนะ 💪'
    : matches >= 50  ? 'เริ่มเก่งแล้วนะ! เล่นอีกนิดก็ขึ้นระดับใหม่แล้ว ลุยเลย! ✨'
    : 'เพิ่งเริ่มต้น — ทุกคำที่หนูจับคู่ถูกคือความเก่งที่เพิ่มขึ้น มาลุยกัน! 🚀';

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay report-overlay';
  overlay.innerHTML = `<div class="levelup-box report-box">
    <button class="report-close" aria-label="ปิด">✕</button>
    <div class="rp-head">
      <div class="rp-avatar">${playerAvatarHTML('👧')}</div>
      <h2 class="rp-title">📊 ความก้าวหน้าของ${name}</h2>
      <p class="rp-sub">${s.grade ? 'ชั้น ' + escapeHTML(s.grade) + ' · ' : ''}สรุปตั้งแต่เริ่มเล่นมาทั้งหมด</p>
    </div>

    <div class="rp-levelcard">
      <div class="rp-level-top"><span>🎓 ${vocabRankName(lvl)} · ระดับ ${lvl}</span><span>${fmtNum(matches)} คำ</span></div>
      <div class="rp-bar"><div class="rp-bar-fill" style="width:${pct}%"></div></div>
      <div class="rp-level-note">อีก <b>${toNext}</b> คำ ขึ้นระดับ ${lvl+1}!</div>
    </div>

    <div class="rp-grid">
      <div class="rp-stat"><div class="rp-ic">🔤</div><div class="rp-num">${fmtNum(matches)}</div><div class="rp-lbl">คำที่จับคู่ถูก</div></div>
      <div class="rp-stat"><div class="rp-ic">🪙</div><div class="rp-num">${fmtNum(state.lifetimeCoins||0)}</div><div class="rp-lbl">เหรียญที่หามาได้</div></div>
      <div class="rp-stat"><div class="rp-ic">🏆</div><div class="rp-num">${fmtNum(state.bestSessionCoins||0)}</div><div class="rp-lbl">สถิติ/ครั้ง ดีที่สุด</div></div>
      <div class="rp-stat"><div class="rp-ic">🗓️</div><div class="rp-num">${fmtNum(state.weekBestCoins||0)}</div><div class="rp-lbl">สถิติสัปดาห์นี้</div></div>
    </div>

    <div class="rp-section">
      <h3 class="rp-h3">📝 แบบทดสอบคำศัพท์</h3>
      <div class="rp-row"><span>สอบผ่านแล้ว</span><span><b>${qPass}</b>${qTotalCats ? ' / ' + qTotalCats : ''} หมวด</span></div>
      <div class="rp-row"><span>สอบไปทั้งหมด</span><span><b>${fmtNum(qCount)}</b> ครั้ง</span></div>
      ${qCount ? `<div class="rp-row"><span>คะแนนเฉลี่ย</span><span><b>${qAvg}%</b> ถูก</span></div>` : ''}
    </div>

    <div class="rp-section">
      <h3 class="rp-h3">🌍 คำที่พิชิตในโลก 3D <span class="rp-badge-mini">รวม ${fmtNum(world3dTotal)} คำ</span></h3>
      ${worldRows}
    </div>

    <div class="rp-section">
      <h3 class="rp-h3">🎖️ เข็มรางวัล</h3>
      ${badgeHtml}
    </div>

    <div class="rp-section">
      <h3 class="rp-h3">🐾 ครอบครัวสัตว์เลี้ยง</h3>
      <div class="rp-row"><span>เลี้ยงอยู่</span><span><b>${petCount}</b> ตัว · เลเวลรวม <b>${petLv}</b></span></div>
    </div>

    <p class="rp-cheer">${cheer}</p>
    <button class="cf-ok report-ok">เยี่ยมเลย! 🎉</button>
  </div>`;
  const close = ()=>overlay.remove();
  overlay.querySelector('.report-close').addEventListener('click', close);
  overlay.querySelector('.report-ok').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
  document.body.appendChild(overlay);
  if(typeof sfx !== 'undefined') sfx.levelup();
}
const THUNDER_MS = 5000;        // เพดานเวลา "สายฟ้าแลบ" (ทั้งเคลียร์รอบจับคู่ และตอบต่อข้อในควิซ)

/* ⚡ รอบ 70: สถิติสายฟ้าแลบสะสม + เข็มสายฟ้า (สไตล์เดียวกับเข็มนักบิน รอบ 62)
   ครบ 5=⚡ · 15=🌩️ · 30=⛈️ — ได้แล้วไม่หาย ติดท้ายชื่อใน map/กระดานให้เพื่อนเห็น */
const THUNDER_TIERS = [[5,1],[15,2],[30,3]];
const THUNDER_TIER_UI = ['', '⚡ เข็มสายฟ้า', '🌩️ เข็มพายุฟ้าคะนอง', '⛈️ เข็มมหาพายุ'];
function thunderEmoji(b){ return ['','⚡','🌩️','⛈️'][b||0] || ''; }

/* 🎯 รอบ 87: เข็มนักบินผาดโผน (สไตล์เดียวกับเข็มสายฟ้า) — สะสมจาก "บินเฉียดสุดๆ" ในโลก heli/drone
   ครบ 10=🎯 · 30=🌀 · 60=🔥 — ได้แล้วไม่หาย ติดท้ายชื่อใน map/กระดานให้เพื่อนเห็น (นับ+ประกาศใน adventure3d.js) */
const DAREDEVIL_TIERS = [[10,1],[30,2],[60,3]];
const DAREDEVIL_TIER_UI = ['', '🎯 เข็มเฉียดเฉี่ยว', '🌀 เข็มนักบินผาดโผน', '🔥 เข็มเจ้าเวหา'];
function daredevilEmoji(b){ return ['','🎯','🌀','🔥'][b||0] || ''; }
function addThunder(){
  state.thunderCount = (state.thunderCount||0) + 1;
  const tier = THUNDER_TIERS.filter(t=>state.thunderCount >= t[0]).pop();
  if(tier && tier[1] > (state.thunderBadge||0)){
    state.thunderBadge = tier[1];
    setTimeout(()=>{   // รอเอฟเฟกต์ฟ้าผ่า (~1.8 วิ) จบก่อนค่อยประกาศเข็ม
      sfx.rankup();
      toast(`🎉 ได้${THUNDER_TIER_UI[tier[1]]}! ทำสายฟ้าแลบครบ ${tier[0]} ครั้ง — เข็มติดท้ายชื่อให้เพื่อนเห็นใน map เลยนะ`, 4000);
    }, 1900);
  }
  saveState();
}

function startGame(cat){
  careTick();
  game.pool = cat ? cat.words : vocabForStudent();   // เล่นเฉพาะหมวด หรือคละตามระดับชั้น
  document.querySelector('#screen-game .board-label').textContent =
    `🇬🇧 คำศัพท์ภาษาอังกฤษ${cat ? ` · หมวด${cat.name}` : ''}`;
  game.combo = 0;
  game.sessionCoins = 0;   // เริ่มนับเหรียญ "ครั้งนี้" ใหม่ทุกครั้งที่เข้าเกม
  game.sessMilestone = 0;
  game.beatBestShown = false;
  rolloverWeekBest();                            // ข้ามสัปดาห์ (จันทร์) → ล้างสถิติสัปดาห์ก่อน
  game.prevBest = state.weekBestCoins || 0;       // เป้าในเกม = สถิติ "สัปดาห์นี้" (ทำลายใหม่ได้เรื่อยๆ)
  game.prevAllBest = state.bestSessionCoins || 0; // จำสถิติตลอดกาลเดิม ไว้เช็กตอนออกเกม
  updateComboPill();
  const sc = document.getElementById('game-session-coins');
  if(sc) sc.classList.remove('t1','t2','t3');   // ป้ายเริ่มที่สีเทา (tier 0) ทุกครั้งที่เข้าเกม
  addSessionCoins(0);      // รีเซ็ตป้ายเป็น 0 🪙
  updateBestTarget();      // โชว์เป้าสถิติสัปดาห์ (ถ้ามี)
  const rb = document.getElementById('btn-report');
  if(rb) rb.onclick = showProgressReport;   // .onclick กัน handler ซ้อนเวลาเข้าเกมหลายรอบ
  document.getElementById('game-coin-count').textContent = fmtNum(state.coins);
  // ตัวละครผู้เลี้ยงมาเชียร์ (ข้อ 4 ต่อยอด) — ยังไม่เลือกตัวละคร = ซ่อนไว้
  const gav = document.getElementById('game-avatar');
  if(gav){ gav.innerHTML = playerAvatarHTML(''); gav.style.display = state.playerAvatar ? '' : 'none'; }
  const p = activePet();
  const hintBtn = document.getElementById('hint-btn');
  hintBtn.style.display = (p && p.type==='cat' && abilityOn(p)) ? 'block' : 'none';
  newRound();
  showScreen('screen-game');
  if(p && p.sick) alertBox('<div style="font-size:56px;line-height:1">🤒</div><div style="font-size:21px;font-weight:bold;margin-top:8px;color:#b23a48">น้องป่วยอยู่นะ</div><div style="margin-top:8px;color:#6a5a78;line-height:1.5">เล่นได้เหรียญตามปกติ แต่ <b>จะไม่ได้ EXP</b> จนกว่าจะรักษาหาย — เก็บเหรียญไปจ่ายค่ารักษากันนะ! 🩺</div>', 'ลุยเก็บเหรียญ!');
}

function newRound(){
  clearInterval(game.timerId);
  game.pairs = shuffle(game.pool || vocabForStudent()).slice(0,4).map(([en,th])=>({en,th}));
  game.selEn = null; game.selTh = null;
  game.matched = 0; game.hintUsed = false; game.checking = false;
  game.roundAt = Date.now(); game.roundClean = true;

  const enGrid = document.getElementById('en-grid');
  const thGrid = document.getElementById('th-grid');
  enGrid.innerHTML = shuffle(game.pairs).map(p=>
    `<div class="word-card en" data-word="${p.en}">${p.en}</div>`).join('');
  thGrid.innerHTML = shuffle(game.pairs).map(p=>
    `<div class="word-card th" data-match="${p.en}">${p.th}</div>`).join('');

  enGrid.querySelectorAll('.word-card').forEach(c=>c.addEventListener('click',()=>pickCard(c,'en')));
  thGrid.querySelectorAll('.word-card').forEach(c=>c.addEventListener('click',()=>pickCard(c,'th')));

  const hintBtn = document.getElementById('hint-btn');
  hintBtn.disabled = false;
  hintBtn.textContent = '💡 น้องแมวช่วยตัดช้อยส์!';

  // จับเวลา: 60 วิ (+20 ถ้าเลี้ยงสุนัขโตเต็มวัยและไม่ป่วย)
  const p = activePet();
  game.totalTime = 60 + ((p && p.type==='dog' && abilityOn(p)) ? 20 : 0);
  game.timeLeft = game.totalTime;
  updateTimerBar();
  game.timerId = setInterval(()=>{
    game.timeLeft--;
    updateTimerBar();
    if(game.timeLeft <= 0){
      clearInterval(game.timerId);
      sfx.wrong();
      game.combo = 0; updateComboPill();
      toast('⏰ หมดเวลา! ลองรอบใหม่ สู้ๆ นะ');
      setTimeout(newRound, 900);
    }
  }, 1000);
}

function updateTimerBar(){
  const fill = document.getElementById('timer-fill');
  fill.style.width = Math.max(0,(game.timeLeft/game.totalTime)*100) + '%';
  fill.classList.toggle('low', game.timeLeft <= 12);
}

function updateComboPill(){
  document.getElementById('combo-pill').textContent = 'Combo ×' + game.combo;
}

function pickCard(card, lang){
  if(game.checking || card.classList.contains('matched')) return;
  sfx.select();
  if(lang === 'en') speakWord(card.dataset.word);   // 🔊 อ่านออกเสียงคำอังกฤษ
  const key = lang === 'en' ? 'selEn' : 'selTh';
  if(game[key]) game[key].classList.remove('selected');
  if(game[key] === card){ game[key] = null; return; }  // แตะซ้ำ = ยกเลิก
  game[key] = card;
  card.classList.add('selected');
  if(game.selEn && game.selTh) checkMatch();
}

function checkMatch(){
  game.checking = true;
  const en = game.selEn, th = game.selTh;
  const correct = th.dataset.match === en.dataset.word;

  if(correct){
    game.combo++;
    game.matched++;
    state.totalMatches++;

    // ---- คำนวณรางวัล + ความสามารถพิเศษ ----
    const p = activePet();
    let coins = 10, exp = 5, rp = 2, notes = [];
    if(p && p.type==='dragon' && abilityOn(p) && game.combo >= 3){ coins *= 2; notes.push('🔥ไฟลุก x2'); }
    if(state.phone && !state.netCut){ coins += PHONE_BONUS; notes.push(`📱 มือถือ +${PHONE_BONUS}`); }   // โบนัสมือถือ (ระงับตอนถูกตัดเน็ต)
    if(!p) exp = 0;                                   // ยังไม่มีสัตว์ → ไม่มี EXP แต่ได้เหรียญ+RP เต็มๆ
    else if(p.sick){ exp = 0; notes.push('🤒 ป่วยอยู่ ไม่ได้ EXP'); }
    else if(p.shape === 'strong'){ exp += SHAPE_EXP_BONUS; notes.push(`💪 ล่ำกำยำ +${SHAPE_EXP_BONUS} EXP`); }   // ข้อ 5.2: กินดีร่างล่ำ = โตไวขึ้น
    addCoins(coins);
    addSessionCoins(coins);   // 🪙 สะสมเข้าตัวนับ "ครั้งนี้"
    addRP(rp);

    // แต้มผลิตโรงงาน (ตอบถูก 1 คำ = 1 แต้ม) — ครบแล้วเปิดฉากผลิตสำเร็จ
    const made = addCraft(1);
    if(made){
      setTimeout(()=>showCollectReveal(made, null, true), 650);
    }else if(state.producing){
      const cc = collectInfo(state.producing.id);
      notes.push(`🏭 ${cc.name} ${state.producing.progress}/${cc.words}`);
    }

    sfx.correct(); sfx.coin();
    // ตัวละครเด้งเชียร์ตอนตอบถูก (เคารพ html.no-anim อัตโนมัติผ่าน CSS)
    const gav = document.getElementById('game-avatar');
    if(gav && state.playerAvatar){ gav.classList.remove('cheer'); void gav.offsetWidth; gav.classList.add('cheer'); }
    floatFx(`+${coins} 🪙 +${rp} RP${exp>0 ? ` +${exp} EXP` : ''}`, '#f2994a');
    if(game.combo >= 2){
      setTimeout(()=>floatFx(`🔥 COMBO ×${game.combo}!`, '#ff6fa7'), 250);
    }
    if(notes.length) setTimeout(()=>toast(notes.join(' · '), 1200), 500);

    updateComboPill();
    if(exp > 0) addExp(exp, p);
    document.getElementById('game-coin-count').textContent = fmtNum(state.coins);
    saveState();

    en.classList.remove('selected'); th.classList.remove('selected');
    en.classList.add('matched'); th.classList.add('matched');
    game.selEn = null; game.selTh = null;
    game.checking = false;

    if(game.matched === 4){
      clearInterval(game.timerId);
      addCoins(20);   // โบนัสเคลียร์รอบ
      addSessionCoins(20);
      addRP(5);
      saveState();
      document.getElementById('game-coin-count').textContent = fmtNum(state.coins);
      // ⚡ สายฟ้าแลบ: เคลียร์ครบ 4 คู่ ไม่พลาดเลย ภายใน 5 วิ → ฟ้าผ่าเต็มจอ+จอสั่น+เสียง spark
      const thunder = game.roundClean && (Date.now() - game.roundAt) <= THUNDER_MS;
      if(thunder){
        thunderFx();
        sfx.spark();
        addThunder();
        setTimeout(()=>floatFx('⚡ สายฟ้าแลบ! ไวเวอร์!', '#7fd4ff'), 200);
      }
      setTimeout(()=>{
        sfx.levelup();
        floatFx('🎉 เก่งมาก! โบนัส +20 🪙 +5 RP', '#5fc46a');
      }, thunder ? 900 : 400);
      setTimeout(newRound, thunder ? 2100 : 1600);
    }
  }else{
    sfx.wrong();
    game.roundClean = false;    // พลาดแล้ว รอบนี้อดสายฟ้า
    en.classList.add('shake'); th.classList.add('shake');
    game.combo = 0;
    updateComboPill();
    setTimeout(()=>{
      en.classList.remove('selected','shake');
      th.classList.remove('selected','shake');
      game.selEn = null; game.selTh = null;
      game.checking = false;
    }, 450);
  }
}

/* ---- ตัดช้อยส์ (แมวโตเต็มวัย): ไฮไลต์คู่ที่ถูก 1 คู่ ---- */
document.getElementById('hint-btn').addEventListener('click', ()=>{
  if(game.hintUsed) return;
  const remaining = [...document.querySelectorAll('#en-grid .word-card:not(.matched)')];
  if(!remaining.length) return;
  const enCard = remaining[Math.floor(Math.random()*remaining.length)];
  const thCard = document.querySelector(`#th-grid .word-card[data-match="${enCard.dataset.word}"]`);
  game.hintUsed = true;
  const btn = document.getElementById('hint-btn');
  btn.disabled = true;
  btn.textContent = '💡 ใช้ไปแล้วรอบนี้';
  sfx.coin();
  enCard.classList.add('hint-glow'); thCard.classList.add('hint-glow');
  setTimeout(()=>{
    enCard.classList.remove('hint-glow'); thCard.classList.remove('hint-glow');
  }, 2500);
});

/* ============================================================
   หมวดคำศัพท์ & แบบทดสอบ 10 ข้อ (ผ่านที่ 8 ข้อขึ้นไป)
   ============================================================ */
function renderCats(){
  document.getElementById('cats-coin-count').textContent = fmtNum(state.coins);
  document.getElementById('cats-level-label').textContent =
    `📚 คำศัพท์ระดับ${gradeBand(state.student ? state.student.grade : 'ป.1').label}`;
  const list = document.getElementById('cats-list');
  list.innerHTML = catsForStudent().map(c=>{
    const attempts = state.quizLog.filter(l=>l.cat === c.id);
    const best = attempts.length ? Math.max(...attempts.map(a=>a.score)) : null;
    const passed = state.quizPassed.includes(c.id);
    return `<div class="cat-card">
      <div class="cat-head">
        <span class="cat-emoji">${c.emoji}</span>
        <span class="cat-name">${c.name}</span>
        ${passed
          ? '<span class="cat-pass">✅ ผ่านแล้ว</span>'
          : `<span class="cat-pass" style="background:var(--yellow);color:#a8791a;border-color:var(--yellow-d)">🎁 รางวัล ${c.reward} 🪙</span>`}
      </div>
      <div class="cat-info">${c.words.length} คำ · สอบมาแล้ว ${attempts.length} ครั้ง${best !== null ? ` · คะแนนสูงสุด ${best}/10` : ''}</div>
      <div class="cat-btns">
        <button class="cat-btn practice" data-cat="${c.id}">🎮 ฝึกจับคู่</button>
        <button class="cat-btn quiz" data-cat="${c.id}">📝 สอบ 10 ข้อ</button>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.cat-btn.practice').forEach(b=>
    b.addEventListener('click', ()=>startGame(findCat(b.dataset.cat))));
  list.querySelectorAll('.cat-btn.quiz').forEach(b=>
    b.addEventListener('click', ()=>startQuiz(findCat(b.dataset.cat))));
}

const quiz = {cat:null, questions:[], idx:0, correct:0, answered:false,
              qAt:0, fastAll:true};   // ⚡ สอบสายฟ้า: ถูกทุกข้อ + ข้อละไม่เกิน 5 วิ

function startQuiz(cat){
  // สุ่ม 10 ข้อจากหมวด: โจทย์อังกฤษ + ช้อยส์ไทย 4 ตัว (ตัวลวงจากหมวดเดียวกัน)
  quiz.questions = shuffle(cat.words).slice(0,10).map(([en,th])=>{
    const wrong = shuffle(cat.words.filter(w=>w[1] !== th)).slice(0,3).map(w=>w[1]);
    return {en, correct:th, choices:shuffle([th, ...wrong])};
  });
  quiz.cat = cat; quiz.idx = 0; quiz.correct = 0; quiz.fastAll = true;
  renderQuizQuestion();
  showScreen('screen-quiz');
}

function renderQuizQuestion(){
  const q = quiz.questions[quiz.idx];
  quiz.answered = false;
  quiz.qAt = Date.now();   // ⚡ เริ่มจับเวลาข้อนี้
  document.getElementById('quiz-progress').textContent =
    `${quiz.cat.emoji} หมวด${quiz.cat.name} · ข้อ ${quiz.idx+1} จาก ${quiz.questions.length} · คำนี้แปลว่าอะไร?`;
  document.getElementById('quiz-score-pill').textContent = `ถูก ${quiz.correct} ข้อ`;
  const wordEl = document.getElementById('quiz-word');
  wordEl.innerHTML = `${escapeHTML(q.en)} <span class="quiz-speak">🔊</span>`;
  wordEl.onclick = ()=>speakWord(q.en);             // 🔊 แตะการ์ดคำโจทย์ = อ่านออกเสียง
  const box = document.getElementById('quiz-choices');
  box.innerHTML = q.choices.map(c=>`<button class="quiz-choice">${c}</button>`).join('');
  box.querySelectorAll('.quiz-choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(quiz.answered) return;
      quiz.answered = true;
      if(btn.textContent !== q.correct || Date.now() - quiz.qAt > THUNDER_MS) quiz.fastAll = false;
      if(btn.textContent === q.correct){
        quiz.correct++;
        btn.classList.add('right');
        sfx.correct();
      }else{
        btn.classList.add('wrong');
        sfx.wrong();
        box.querySelectorAll('.quiz-choice').forEach(b=>{
          if(b.textContent === q.correct) b.classList.add('right');
        });
      }
      document.getElementById('quiz-score-pill').textContent = `ถูก ${quiz.correct} ข้อ`;
      setTimeout(()=>{
        quiz.idx++;
        if(quiz.idx >= quiz.questions.length) finishQuiz();
        else renderQuizQuestion();
      }, 950);
    });
  });
}

function finishQuiz(){
  const cat = quiz.cat;
  const passed = quiz.correct >= 8;                              // เกณฑ์ผ่าน: 8/10
  const firstPass = passed && !state.quizPassed.includes(cat.id);
  let coins = 0, exp = 0, rp = 5;                                // สอบไม่ผ่านก็ยังได้ +5 RP จากความพยายาม
  if(passed){
    coins = firstPass ? cat.reward : 20;   // รางวัลใหญ่เฉพาะการผ่านครั้งแรกของหมวด
    exp   = firstPass ? 30 : 10;
    rp    = firstPass ? 100 : 30;
    if(firstPass) state.quizPassed.push(cat.id);
    addCoins(coins);
  }
  addRP(rp);
  // แต้มผลิตโรงงาน: ตอบถูก 1 ข้อ = 1 แต้ม (ครบแล้วเปิดฉากผลิตสำเร็จหลังกล่องผลสอบ)
  const made = addCraft(quiz.correct);
  // โบนัสตามบ้าน (ข้อ 8): ทำข้อสอบครบ 10 ข้อ เพิง +0 / บ้านกลาง +100 / ปราสาท +200
  const homeB = homeInfo(state.home);
  const homeBonus = homeB ? homeB.quizBonus : 0;
  if(homeBonus > 0) addCoins(homeBonus);
  state.quizLog.push({cat:cat.id, score:quiz.correct, total:quiz.questions.length, passed, ts:Date.now()});
  const p = activePet();
  if(exp && p && !p.sick) addExp(exp, p);
  saveState();

  // ⚡ สอบสายฟ้า: ตอบถูกทุกข้อ + แต่ละข้อไม่เกิน 5 วิ → ฟ้าผ่าเต็มจอ+จอสั่น+เสียง spark
  const thunder = quiz.fastAll && quiz.correct === quiz.questions.length;
  if(thunder){ thunderFx(); sfx.spark(); addThunder(); }

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    <h2>${thunder ? '⚡ สอบสายฟ้า สุดยอดไปเลย!' : passed ? '🏆 สอบผ่าน เก่งมาก!' : '💪 เกือบแล้ว สู้ๆ!'}</h2>
    <div class="lv-emoji" style="font-size:56px">${thunder ? '⚡' : passed ? '🎉' : '📖'}</div>
    <p style="margin:8px 0 0;font-size:17px">หมวด${cat.name}: ตอบถูก <b>${quiz.correct}/${quiz.questions.length}</b> ข้อ<br>
      ${thunder ? '<b style="color:#3b8dde">ถูกทุกข้อ แถมไวปานสายฟ้า (ข้อละไม่เกิน 5 วิ)! ⚡</b><br>' : ''}
      ${passed
        ? (firstPass ? `รับรางวัลพิเศษ +${coins} 🪙 +${rp} RP${exp?` +${exp} EXP`:''}! 🎁` : `ผ่านอีกครั้ง รับ +${coins} 🪙 +${rp} RP${exp?` +${exp} EXP`:''}`)
        : `ได้กำลังใจ +${rp} RP 💪 ต้องตอบถูก 8 ข้อขึ้นไปถึงจะได้รางวัลพิเศษ ลองใหม่อีกครั้งนะ`}
      ${homeBonus > 0 ? `<br>${homeB.emoji} โบนัสขยันจาก${homeB.name} <b>+${homeBonus} 🪙</b>` : ''}
      ${quiz.correct > 0 && made ? `<br>🏭 แต้มผลิต +${quiz.correct} — <b>ผลิตสำเร็จ!</b> 🎉` : ''}
      ${quiz.correct > 0 && !made && state.producing ? `<br>🏭 แต้มผลิต +${quiz.correct} (${collectInfo(state.producing.id).name} ${state.producing.progress}/${collectInfo(state.producing.id).words})` : ''}
    </p>
    <button>ตกลง</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>{
    overlay.remove();
    renderCats();
    showScreen('screen-cats');
  });
  document.body.appendChild(overlay);
  if(made) setTimeout(()=>showCollectReveal(made, null, true), 600);
  if(passed) sfx.levelup(); else sfx.wrong();
}
