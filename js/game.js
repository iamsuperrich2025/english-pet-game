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
  sessionMatches:0,             // จำนวนคำที่จับคู่ถูก "ครั้งนี้" (ไว้โชว์การ์ดสรุปตอนออก)
  sessMilestone:0,              // หลักเหรียญครั้งนี้ที่ฉลองไปแล้วสูงสุด (กันฉลองซ้ำ)
  prevBest:0,                   // สถิติเหรียญ/ครั้ง "สัปดาห์นี้" เดิม (ตอนเข้าเกม) — ไว้เทียบว่าทำลายสถิติหรือยัง
  prevAllBest:0,                // สถิติเหรียญ/ครั้ง "ตลอดกาล" เดิม (ตอนเข้าเกม) — ไว้เช็กว่าเป็นสถิติสูงสุดตลอดกาลด้วยไหม
  beatBestShown:false,          // เด้ง "ทำลายสถิติ!" ไปแล้วในครั้งนี้ (โชว์ครั้งเดียวพอ)
  lastCat:null,                 // หมวดล่าสุด (ให้ปุ่ม "เล่นต่ออีกรอบ" เริ่มโหมดเดิม)
  replayStreak:0,               // 🔥 กด "เล่นต่ออีกรอบ" ติดกันกี่รอบ (ครบ 3 รอบติด = โบนัส) · รีเซ็ตเมื่อเข้าเกมใหม่จากเมนู
  _viaReplay:false,             // ธง: startGame รอบนี้มาจากปุ่มเล่นต่อ (ไม่รีเซ็ตสตรีค)
};
const REPLAY_BONUS_EVERY = 3;   // เล่นต่อครบทุกกี่รอบติด = จ่ายโบนัส (3,6,9,...)
// 🔥 สตรีคยิ่งยาว โบนัสยิ่งเยอะ (ไล่ระดับ): 3 รอบ +50 · 6 รอบ +100 · 9 รอบ +200 · 15 รอบขึ้นไป +300 (คงที่)
const REPLAY_BONUS_TIERS = [[15,300],[9,200],[6,100],[3,50]];   // [ครบกี่รอบติด, โบนัส] — เลือกจากมากไปน้อย
function replayBonusFor(streak){                        // โบนัสที่จะได้เมื่อสตรีคถึงค่านี้ (0=ยังไม่ถึงเกณฑ์)
  const t = REPLAY_BONUS_TIERS.find(x => streak >= x[0]);
  return t ? t[1] : 0;
}

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

/* 🚪 ออกจากเกม (ปุ่ม ⬅ กลับ) — เก็บเหรียญได้เด้งการ์ดสรุปผลงานทุกครั้ง (ทำสถิติใหม่=ฉลองพิเศษ+โปรยเหรียญ) */
function exitGame(){
  clearInterval(game.timerId);
  const earned = game.sessionCoins;
  const doExit = ()=>{ renderDashboard(); showScreen('screen-dashboard'); };
  if(earned <= 0){ doExit(); return; }   // ยังไม่ได้เก็บเหรียญเลย (แค่แวะเข้ามา) → ออกเลย ไม่ต้องมีการ์ด
  const isRecord = earned > game.prevBest;             // เกินสถิติสัปดาห์เดิม = สถิติใหม่
  const allTime  = isRecord && earned > game.prevAllBest;   // เป็นสถิติสูงสุดตลอดกาลด้วยไหม
  const replay = ()=>{                                  // เล่นต่ออีกรอบโหมดเดิม (ไม่กลับหน้าเมือง) + นับสตรีค
    game._viaReplay = true;
    const streak = (game.replayStreak || 0) + 1;
    game.replayStreak = streak;
    addDiligent();                                     // 🏅 นับรอบเล่นต่อสะสมถาวร → เข็มนักเล่นขยัน (20/50/100)
    questEvent('replay');                              // 🎯 Daily Quest: เล่นต่ออีกรอบ
    startGame(game.lastCat);
    const bonus = (streak % REPLAY_BONUS_EVERY === 0) ? replayBonusFor(streak) : 0;
    if(bonus > 0){                                     // เล่นต่อครบทุก 3 รอบติด → โบนัสไล่ระดับ (ยิ่งยาวยิ่งเยอะ)
      addCoins(bonus);
      addSessionCoins(bonus);
      const cc = document.getElementById('game-coin-count');
      if(cc) cc.textContent = fmtNum(state.coins);
      saveState();
      setTimeout(()=>{
        if(typeof sfx !== 'undefined') sfx.levelup();
        floatFx(`🔥 เล่นต่อ ${streak} รอบติด! +${bonus} 🪙`, '#ff8c42');
        toast(`เก่งมาก! ขยันเล่นต่อเนื่อง รับโบนัส +${bonus} 🪙 ไปเลย 🎉`, 2600);
      }, 600);
    }
  };
  showSessionSummary(earned, game.sessionMatches, isRecord, allTime, doExit, replay);
}

/* 🎉 การ์ดสรุปตอนจบการเล่น — โชว์เหรียญ+จำนวนคำที่ทำได้ทุกครั้ง · ทำสถิติใหม่=ฉลอง+โปรยเหรียญ+เสียงเหรียญ
   ปุ่ม 2 ตัว: "เล่นต่ออีกรอบ" (เริ่มโหมดเดิมทันที) · "ออกไปพัก" (กลับหน้าเมือง) */
function showSessionSummary(earned, matches, isRecord, allTime, onClose, onReplay){
  const p = activePet();
  const petSick = !!(p && p.sick);
  // น้องป่วย → ปุ่มหลักเตือนอย่างอ่อนโยนให้ไปดูแลก่อน (ยังกดเล่นต่อได้) · ปกติ → ปุ่มหลัก = เล่นต่อ
  const primary   = petSick ? {txt:'🩺 ไปดูแลน้องก่อน', cb:onClose}  : {txt:'🔄 เล่นต่ออีกรอบ!', cb:onReplay};
  const secondary = petSick ? {txt:'🔄 เล่นต่อก่อน',    cb:onReplay} : {txt:'ออกไปพัก 😊',      cb:onClose};

  // 🔥 สตรีคเล่นต่อ: โชว์ความคืบหน้าไปโบนัสถัดไป (โบนัสไล่ระดับ — บอกยอดของรอบเป้าถัดไป)
  const streak = game.replayStreak || 0;
  const remain = REPLAY_BONUS_EVERY - (streak % REPLAY_BONUS_EVERY);
  const nextBonus = replayBonusFor(streak + remain);   // โบนัสที่จะได้เมื่อครบเป้าถัดไป (50→100→200)
  const streakLine = streak > 0
    ? `<p class="sm-streak">🔥 เล่นต่อเนื่อง <b>${streak}</b> รอบ — อีก <b>${remain}</b> รอบ ได้โบนัส +${nextBonus} 🪙!</p>`
    : '';

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay summary-overlay';
  overlay.innerHTML = `<div class="levelup-box summary-box">
    <div class="sm-burst">${isRecord ? '🎉' : '👏'}</div>
    <h2 class="sm-title">${isRecord ? 'เก่งมากเลย!' : 'เล่นได้เยี่ยม!'}</h2>
    <p class="sm-line">รอบเล่นนี้หนูเก็บได้</p>
    <div class="sm-coin">${fmtNum(earned)} 🪙</div>
    <p class="sm-matches">🔤 จับคู่ถูก <b>${fmtNum(matches)}</b> คำ</p>
    ${isRecord ? `<div class="sm-badge">🏆 ทำสถิติสัปดาห์ใหม่!</div>` : ''}
    ${allTime ? `<div class="sm-badge sm-badge-all">⭐ และเป็นสถิติสูงสุดตลอดกาลด้วย!</div>` : ''}
    ${streakLine}
    ${petSick ? `<p class="sm-sick">🤒 น้อง${escapeHTML(p.name)}ยังป่วยอยู่ ไปรักษาให้หายก่อนดีไหม?</p>` : ''}
    <p class="sm-cheer">${isRecord ? 'พักได้เลย เดี๋ยวมาทำลายสถิติใหม่กันอีกนะ 💪' : 'เก็บเพิ่มได้อีกเรื่อยๆ นะ เยี่ยมมาก! 😊'}</p>
    <div class="sm-btns">
      <button class="sm-primary">${primary.txt}</button>
      <button class="sm-secondary">${secondary.txt}</button>
    </div>
  </div>`;
  const done = (cb)=>{ overlay.remove(); if(cb) cb(); };
  overlay.querySelector('.sm-primary').addEventListener('click', ()=>done(primary.cb));
  overlay.querySelector('.sm-secondary').addEventListener('click', ()=>done(secondary.cb));
  overlay.addEventListener('click', e=>{ if(e.target===overlay) done(onClose); });   // แตะพื้นหลัง = ออกไปพัก
  document.body.appendChild(overlay);
  if(isRecord){
    sprinkleConfetti(overlay);                       // โปรยเหรียญ/ดาวฉลอง
    for(let i=0;i<4;i++) setTimeout(()=>sfx.coin&&sfx.coin(), 260 + i*150);   // เสียงเหรียญกรุ๊งกริ๊งไล่กัน
  }
  if(typeof sfx !== 'undefined') sfx[isRecord ? 'rankup' : 'levelup']();
  if(state.haptic !== false && navigator.vibrate) navigator.vibrate(isRecord ? [40,50,40,50,90] : [30,40,30]);
}

/* ✨ โปรยเหรียญ/ดาวตกจากด้านบนการ์ด (ข้าม ถ้าผู้ใช้ปิดแอนิเมชันเพื่อเครื่องช้า) */
function sprinkleConfetti(container){
  if(state.noAnim) return;
  const items = ['🪙','⭐','🎉','✨','🪙','⭐'];
  for(let i=0; i<20; i++){
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = items[i % items.length];
    s.style.left = Math.random()*100 + '%';
    s.style.fontSize = (14 + Math.random()*16) + 'px';
    s.style.animationDelay = (Math.random()*0.7) + 's';
    s.style.animationDuration = (1.6 + Math.random()*1.3) + 's';
    container.appendChild(s);
    setTimeout(()=>s.remove(), 3600);
  }
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
    {ic:'🚗', nm:'โลกขับรถกำแพงเพชร', n:(state.driveDone||[]).length, own:state.driveTicket},
  ];
  const world3dTotal = worlds.reduce((a,w)=>a+w.n, 0);
  const worldRows = worlds.filter(w=>w.own || w.n>0).map(w=>
    `<div class="rp-row"><span>${w.ic} ${w.nm}</span><span><b>${fmtNum(w.n)}</b> คำ</span></div>`).join('')
    || `<div class="rp-empty">ยังไม่ได้เข้าโลก 3D — มีตั๋วเมื่อไหร่ลองผจญภัยดูนะ! 🚀</div>`;

  // 🏆 ตู้เข็มสะสม — เข็มสายที่สะสมจากจำนวนถาวร (สายฟ้า/ผาดโผน/นักเล่นขยัน): แถบ % ไปเข็มถัดไป + อีโมจิเรียงระดับ
  const trophyDefs = [
    {ic:'⚡', label:'สายฟ้าแลบ',   unit:'ครั้ง', count:state.thunderCount||0,   tiers:THUNDER_TIERS,   ui:THUNDER_TIER_UI,   ef:thunderEmoji},
    {ic:'🎯', label:'บินเฉียดสุดๆ', unit:'ครั้ง', count:state.daredevilCount||0, tiers:DAREDEVIL_TIERS, ui:DAREDEVIL_TIER_UI, ef:daredevilEmoji},
    {ic:'🏅', label:'เล่นต่ออีกรอบ', unit:'รอบ',  count:state.diligentCount||0,  tiers:DILIGENT_TIERS,  ui:DILIGENT_TIER_UI,  ef:diligentEmoji},
  ];
  const trophyHtml = trophyDefs.map(d=>{
    const reached = d.tiers.filter(t=>d.count>=t[0]).pop();       // เข็มสูงสุดที่ถึงแล้ว
    const next    = d.tiers.find(t=>d.count<t[0]);                // เข็มถัดไป (undefined=ครบหมด)
    const prevT   = reached ? reached[0] : 0;                     // ฐานช่วงปัจจุบัน
    const pct     = next ? Math.round((d.count-prevT)/(next[0]-prevT)*100) : 100;
    const ems     = d.tiers.map(t=>`<span class="rp-em${d.count>=t[0]?' earned':''}">${d.ef(t[1])}</span>`).join('');
    const note    = next ? `อีก <b>${next[0]-d.count}</b> ${d.unit} = ${d.ui[next[1]]}` : `ครบทุกเข็มแล้ว! 🏆`;
    return `<div class="rp-tline">
      <div class="rp-tl-head"><span>${d.ic} ${d.label} <small>(${fmtNum(d.count)} ${d.unit})</small></span><span class="rp-tl-ems">${ems}</span></div>
      <div class="rp-bar"><div class="rp-bar-fill" style="width:${pct}%"></div></div>
      <div class="rp-tl-note">${note}</div>
    </div>`;
  }).join('');
  // ✈️ ใบอนุญาตนักบิน = อิงสตรีค (ไม่ใช่จำนวนสะสม) → โชว์เป็นแถวสถานะเข็มที่ได้ ไม่มีแถบ %
  const pilotNames = ['','🥉 ใบอนุญาตนักบิน','🥈 นักบินฝีมือดี','🥇 กัปตันมือทอง'];
  const pilotHtml = state.pilotBadge
    ? `<div class="rp-row"><span>✈️ ใบอนุญาตนักบิน (โลกเฮลิฯ)</span><span><b>${pilotNames[state.pilotBadge]}</b></span></div>`
    : `<div class="rp-row"><span>✈️ ใบอนุญาตนักบิน (โลกเฮลิฯ)</span><span style="color:#9a8aac">ยังไม่ได้ — บินเก็บ 5 คำติดไม่ชน 🥉</span></div>`;
  const crownHtml = state.crownBadge
    ? `<div class="rp-crown">👑 <b>เข็มลับ "นักสะสมเข็ม"</b> — สะสมครบทั้ง 4 สาย! สุดยอด</div>`
    : `<div class="rp-row"><span>👑 เข็มลับ "นักสะสมเข็ม"</span><span style="color:#9a8aac">ได้เข็มครบทั้ง 4 สายแล้วปลดล็อก</span></div>`;

  // 📈 กราฟแต้มเข็มที่เก็บได้รายสัปดาห์ (ประวัติ + สัปดาห์นี้ที่กำลังนับ)
  const wkShort = (wk)=>{ const p = String(wk||'').split('-'); return p.length===3 ? (+p[2])+'/'+(+p[1]) : ''; };
  const curScore = (typeof currentBadgeScore === 'function') ? currentBadgeScore() : 0;
  const curGain  = Math.max(0, curScore - (state.badgeWeekStartScore||0));
  const bwBars   = (state.badgeWeekHist||[]).slice(-5).concat([{wk:state.badgeWeekKey||'', gain:curGain, now:true}]);
  const bwMax    = Math.max(1, ...bwBars.map(b=>b.gain||0));
  const bwGraph  = bwBars.some(b=>(b.gain||0) > 0)
    ? `<div class="rp-wgraph">${bwBars.map(b=>{
        const h = Math.round(((b.gain||0)/bwMax)*100);
        return `<div class="rp-wcol"><div class="rp-wval">${(b.gain||0)>0 ? '+'+b.gain : ''}</div>`
          + `<div class="rp-wbar${b.now?' now':''}" style="height:${(b.gain||0)>0 ? Math.max(14,h) : 4}%"></div>`
          + `<div class="rp-wlbl">${b.now ? 'นี้' : wkShort(b.wk)}</div></div>`;
      }).join('')}</div>`
    : `<div class="rp-empty">เริ่มเก็บเข็มสัปดาห์นี้ แล้วสัปดาห์หน้าจะเห็นกราฟความก้าวหน้า 📊</div>`;
  const weekBadgeHtml = `<div class="rp-wtitle">📈 แต้มเข็มที่เก็บได้รายสัปดาห์</div>
    <div class="rp-wnow">สัปดาห์นี้เก็บเพิ่ม <b>+${curGain}</b> แต้มเข็ม ${curGain>0 ? '🔥 เก่งมาก!' : '— ไปเก็บเข็มเพิ่มกันเถอะ!'}</div>
    ${bwGraph}`;

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
      <h3 class="rp-h3">🏆 ตู้เข็มสะสมของ${name}</h3>
      ${trophyHtml}
      ${pilotHtml}
      ${crownHtml}
      ${weekBadgeHtml}
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

/* 🏅 รอบ 105: เข็มนักเล่นขยัน (สไตล์เดียวกับเข็มสายฟ้า) — สะสมจากจำนวน "รอบเล่นต่อ" ทั้งหมด (ถาวร)
   ครบ 20=🏅 · 50=🎖️ · 100=🏆 — ได้แล้วไม่หาย ติดท้ายชื่อใน map/กระดานให้เพื่อนเห็น */
const DILIGENT_TIERS = [[20,1],[50,2],[100,3]];
const DILIGENT_TIER_UI = ['', '🏅 เข็มนักเล่นขยัน', '🎖️ เข็มนักเล่นตัวยง', '🏆 เข็มยอดนักสู้คำศัพท์'];
function diligentEmoji(b){ return ['','🏅','🎖️','🏆'][b||0] || ''; }

/* 🤖 รอบ 229: เข็มนักล่าบอส (โลกหุ่นยนต์) — สะสมจากจำนวนบอสที่ล้มสำเร็จ (state.mechaBoss ถาวร)
   ครบ 3=⚔️ · 10=🛡️ · 25=🤖 — ได้แล้วไม่หาย ติดท้ายชื่อให้เพื่อนเห็นทุกโลก (นับ+ประกาศใน adventure3d.js) */
const MECHABOSS_TIERS = [[3,1],[10,2],[25,3]];
const MECHABOSS_TIER_UI = ['', '⚔️ เข็มนักล่าบอส', '🛡️ เข็มอัศวินเหล็ก', '🤖 เข็มเจ้าสมรภูมิ'];
function mechaBossEmoji(b){ return ['','⚔️','🛡️','🤖'][b||0] || ''; }

/* 🎖️ เข็มทั้งหมดต่อท้ายชื่อ (นักบิน🥉+สายฟ้า⚡+ผาดโผน🎯+นักเล่นขยัน🏅) — ใช้โชว์ในการ์ดเพื่อน/
   กระดานหน้าเมือง (บันทึกลง presence.n/leaderboard.n ให้เพื่อนเห็นด้วย) · pilotEmoji เป็น local
   ของ adventure3d จึง inline อาร์เรย์นักบินที่นี่ให้เป็นฟังก์ชัน global */
function badgeSuffix(){
  return (state.crownBadge ? '👑' : '')                // 👑 เข็มลับ นักสะสมเข็ม — นำหน้าเสมอ
    + (['','🥉','🥈','🥇'][state.pilotBadge||0]||'')
    + thunderEmoji(state.thunderBadge)
    + daredevilEmoji(state.daredevilBadge)
    + diligentEmoji(state.diligentBadge)
    + mechaBossEmoji(state.mechaBossBadge);            // 🤖 รอบ 229: เข็มนักล่าบอส (โลกหุ่น)
}

/* 🎖️ ข้อมูลเข็มแต่ละอิโมจิ: ชื่อ + แต้ม (ระดับ 1-3 · เข็มลับ 👑=5) — ใช้แตกเข็มจากชื่อที่ baked ไว้ใน
   presence/leaderboard (โชว์แถวเข็มในการ์ดผู้เล่น + คิดคะแนนกระดานเข็ม + ตรวจเพื่อนได้เข็มใหม่) */
const BADGE_META = {
  '👑':{n:'นักสะสมเข็ม (เข็มลับ)',p:5},
  '🥉':{n:'ใบอนุญาตนักบิน',p:1}, '🥈':{n:'นักบินฝีมือดี',p:2}, '🥇':{n:'กัปตันมือทอง',p:3},
  '⚡':{n:'เข็มสายฟ้า',p:1}, '🌩️':{n:'เข็มพายุฟ้าคะนอง',p:2}, '⛈️':{n:'เข็มมหาพายุ',p:3},
  '🎯':{n:'เข็มเฉียดเฉี่ยว',p:1}, '🌀':{n:'เข็มนักบินผาดโผน',p:2}, '🔥':{n:'เข็มเจ้าเวหา',p:3},
  '🏅':{n:'เข็มนักเล่นขยัน',p:1}, '🎖️':{n:'เข็มนักเล่นตัวยง',p:2}, '🏆':{n:'เข็มยอดนักสู้คำศัพท์',p:3},
  '⚔️':{n:'เข็มนักล่าบอส',p:1}, '🛡️':{n:'เข็มอัศวินเหล็ก',p:2}, '🤖':{n:'เข็มเจ้าสมรภูมิ',p:3},   // 🤖 รอบ 229: เข็มโลกหุ่น
};
const NAME_BADGE_RE = /(?:👑|🥉|🥈|🥇|⚡|🌩️|⛈️|🎯|🌀|🔥|🏅|🎖️|🏆|⚔️|🛡️|🤖)+$/u;
function splitNameBadges(full){                        // แยก "ชื่อสะอาด" กับ "เข็มท้ายชื่อ"
  full = String(full || '');
  const m = full.match(NAME_BADGE_RE);
  const badges = m ? m[0] : '';
  return { name: badges ? full.slice(0, full.length - badges.length).trim() : full, badges };
}
function badgeEmojis(str){                              // แตกอิโมจิเข็มเป็นอาร์เรย์ตามลำดับที่พบ
  const arr = [], re = /👑|🥉|🥈|🥇|⚡|🌩️|⛈️|🎯|🌀|🔥|🏅|🎖️|🏆|⚔️|🛡️|🤖/gu; let x;
  while((x = re.exec(String(str || '')))) arr.push(x[0]);
  return arr;
}
function badgeScore(str){                               // คะแนนรวม (ผลรวมระดับเข็ม) — ใช้จัดอันดับกระดานเข็ม
  return badgeEmojis(str).reduce((a,e)=>a + ((BADGE_META[e] && BADGE_META[e].p) || 0), 0);
}

/* 👑 เข็มลับ "นักสะสมเข็ม" — ปลดเมื่อมีเข็มครบทั้ง 4 สาย (นักบิน+สายฟ้า+ผาดโผน+ขยัน อย่างละ ≥1)
   เรียกท้ายทุกครั้งที่ได้เข็มใหม่ + ตอนเข้าหน้าเมือง (ครอบผู้เล่นเดิมที่ครบอยู่แล้ว) · ฉลองครั้งเดียว */
function checkCrown(){
  if(state.crownBadge) return false;
  if((state.pilotBadge||0) > 0 && (state.thunderBadge||0) > 0 &&
     (state.daredevilBadge||0) > 0 && (state.diligentBadge||0) > 0){
    state.crownBadge = 1;
    saveState();
    setTimeout(()=>{                                   // หน่วงให้พ้นการฉลองเข็มสายที่ 4 ที่เพิ่งได้
      celebrateBadge('👑', 'ได้เข็มลับ "นักสะสมเข็ม"!',
        'สะสมเข็มครบทั้ง 4 สาย — สุดยอดไปเลย! 👑 โชว์นำหน้าชื่อให้เพื่อนเห็นทุกโลก');
    }, 3600);
    return true;
  }
  return false;
}

/* 📈 แต้มเข็มรวมของเราตอนนี้ (จาก badgeSuffix ของตัวเอง) — ใช้คิดความก้าวหน้ารายสัปดาห์ */
function currentBadgeScore(){ return badgeScore(badgeSuffix()); }

/* 🗓️ สรุปแต้มเข็มที่เก็บเพิ่มรายสัปดาห์ (จันทร์รีเซ็ต) → เก็บ gain ของสัปดาห์ก่อนลง badgeWeekHist
   ให้กราฟในตู้เข็มโชว์พัฒนาการ · เรียกตอนเข้าหน้าเมือง */
function rolloverBadgeWeek(){
  const wk = (typeof weekKeyStr === 'function') ? weekKeyStr() : '';
  const cur = currentBadgeScore();
  if(state.badgeWeekKey !== wk){
    if(state.badgeWeekKey){                            // ปิดสัปดาห์เก่า: บันทึกว่าเก็บเพิ่มกี่แต้ม
      const gain = Math.max(0, cur - (state.badgeWeekStartScore||0));
      state.badgeWeekHist = (state.badgeWeekHist||[]).concat([{wk:state.badgeWeekKey, gain}]).slice(-8);
    }
    state.badgeWeekKey = wk;
    state.badgeWeekStartScore = cur;
    saveState();
  }
}
function addDiligent(){                                 // เรียกทุกครั้งที่กด "เล่นต่ออีกรอบ"
  state.diligentCount = (state.diligentCount||0) + 1;
  const tier = DILIGENT_TIERS.filter(t=>state.diligentCount >= t[0]).pop();
  if(tier && tier[1] > (state.diligentBadge||0)){
    state.diligentBadge = tier[1];
    setTimeout(()=>{   // หน่วงให้พ้นการ์ดสรุป/โบนัสสตรีคก่อนค่อยฉลองเข็ม
      celebrateBadge(diligentEmoji(tier[1]), `ได้${DILIGENT_TIER_UI[tier[1]]}!`,
        `เล่นต่อรวม ${tier[0]} รอบแล้ว — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกเลยนะ 🎉`);
    }, 1200);
  }
  saveState();
  checkCrown();                                        // 👑 เช็กเข็มลับ (ครบ 4 สาย)
}

/* 🎊 ฉลอง "ได้เข็มใหม่" อลังกลางจอ — แบนเนอร์เด้ง + โปรยเหรียญ + เสียง (reuse sprinkleConfetti)
   ใช้กับเข็มนักเล่นขยัน (ต่อยอดได้กับเข็มอื่น) · pointer-events:none = ไม่บังการเล่น หายเองใน ~3 วิ */
function celebrateBadge(emoji, title, sub){
  if(typeof sfx !== 'undefined') sfx.rankup();
  if(state.haptic !== false && navigator.vibrate) navigator.vibrate([40,50,40,50,90]);
  const overlay = document.createElement('div');
  overlay.className = 'badge-celebrate-overlay';
  overlay.innerHTML = `<div class="badge-celebrate">
    <div class="bc-emoji">${emoji}</div>
    <div class="bc-title">🎉 ${escapeHTML(title)}</div>
    <div class="bc-sub">${escapeHTML(sub)}</div>
  </div>`;
  document.body.appendChild(overlay);
  sprinkleConfetti(overlay);                           // โปรยเหรียญ/ดาวบนแบนเนอร์
  setTimeout(()=>{ overlay.classList.add('bc-out'); setTimeout(()=>overlay.remove(), 400); }, 2600);
}
function addThunder(){
  state.thunderCount = (state.thunderCount||0) + 1;
  const tier = THUNDER_TIERS.filter(t=>state.thunderCount >= t[0]).pop();
  if(tier && tier[1] > (state.thunderBadge||0)){
    state.thunderBadge = tier[1];
    setTimeout(()=>{   // รอเอฟเฟกต์ฟ้าผ่า (~1.8 วิ) จบก่อนค่อยฉลองเข็ม
      celebrateBadge(thunderEmoji(tier[1]), `ได้${THUNDER_TIER_UI[tier[1]]}!`,
        `ทำสายฟ้าแลบครบ ${tier[0]} ครั้ง — เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกเลยนะ 🎉`);
    }, 1900);
  }
  saveState();
  checkCrown();                                        // 👑 เช็กเข็มลับ (ครบ 4 สาย)
}

function startGame(cat){
  careTick();
  if(!game._viaReplay) game.replayStreak = 0;        // เข้าเกมใหม่จากเมนู = เริ่มนับสตรีคเล่นต่อใหม่
  game._viaReplay = false;
  game.lastCat = cat || null;                        // จำหมวดไว้ ให้ปุ่ม "เล่นต่ออีกรอบ" เริ่มโหมดเดิม
  game.pool = cat ? cat.words : vocabForStudent();   // เล่นเฉพาะหมวด หรือคละตามระดับชั้น
  document.querySelector('#screen-game .board-label').textContent =
    `🇬🇧 คำศัพท์ภาษาอังกฤษ${cat ? ` · หมวด${cat.name}` : ''}`;
  game.combo = 0;
  game.sessionCoins = 0;   // เริ่มนับเหรียญ "ครั้งนี้" ใหม่ทุกครั้งที่เข้าเกม
  game.sessionMatches = 0;
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
  // ตัวละครผู้เลี้ยงมาเชียร์ (ข้อ 4 ต่อยอด) — รอบ 245: ใช้ตัวละครในล็อบบี้ (blk) เป็นรูปโปรไฟล์ โชว์เสมอ
  const gav = document.getElementById('game-avatar');
  if(gav){ const h = playerAvatarHTML(''); gav.innerHTML = h; gav.style.display = h ? '' : 'none'; }
  const p = activePet();
  const hintBtn = document.getElementById('hint-btn');
  hintBtn.style.display = (p && p.type==='cat' && abilityOn(p)) ? 'block' : 'none';
  newRound();
  showScreen('screen-game');
  if(p && p.sick) alertBox('<div class="ab-emoji">🤒</div><div class="ab-title" style="color:#b23a48">น้องป่วยอยู่นะ</div><div class="ab-desc">เล่นได้เหรียญตามปกติ แต่ <b>จะไม่ได้ EXP</b> จนกว่าจะรักษาหาย — เก็บเหรียญไปจ่ายค่ารักษากันนะ! 🩺</div>',
    'ลุยเก็บเหรียญ!',
    {text:`🩺 รักษาเลย (🪙${fmtNum(CURE_COST)})`, onClick:()=>{
      curePet();   // เช็กเหรียญพอ/หักเงิน/หายป่วยใน curePet เอง (ไม่พอ = toast เตือน เล่นเก็บเหรียญต่อได้)
      document.getElementById('game-coin-count').textContent = fmtNum(state.coins);
    }});
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
    game.sessionMatches++;
    state.totalMatches++;
    questEvent('match');                              // 🎯 Daily Quest: จับคู่ถูก

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
  /* หมวดตามชั้นเรียน + การ์ดคลังศัพท์ใหญ่ band 1-5 ต่อท้าย (dictband.js · รอบ 264) */
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
  }).join('') + (typeof bandCardsHTML === 'function' ? bandCardsHTML() : '');
  list.querySelectorAll('.cat-btn.practice').forEach(b=>
    b.addEventListener('click', ()=>b.dataset.band ? bandPlay(b.dataset.band, 'game') : startGame(findCat(b.dataset.cat))));
  list.querySelectorAll('.cat-btn.quiz').forEach(b=>
    b.addEventListener('click', ()=>b.dataset.band ? bandPlay(b.dataset.band, 'quiz') : startQuiz(findCat(b.dataset.cat))));
}

const quiz = {cat:null, questions:[], idx:0, correct:0, answered:false,
              qAt:0, fastAll:true};   // ⚡ สอบสายฟ้า: ถูกทุกข้อ + ข้อละไม่เกิน 5 วิ

function startQuiz(cat){
  // สุ่มข้อจากหมวด (ปกติ 10 · ชุด band = ทุกคำในชุด 10-19 ข้อ) + ช้อยส์ไทย 4 ตัวไม่ซ้ำข้อความ
  // ตัวลวง: หมวดปกติจากหมวดเดียวกัน · ชุด band จากทั้งระดับ (distractPool)
  const dPool = cat.distractPool || cat.words;
  quiz.questions = shuffle(cat.words).slice(0, cat.quizCount || 10).map(([en,th])=>{
    const wrong = shuffle([...new Set(dPool.map(w=>w[1]).filter(t=>t !== th))]).slice(0,3);
    // หมวด band (dictband.js) มีข้อมูลพจนานุกรมแนบ: IPA/คำอ่านโชว์บนโจทย์ + ประโยคตัวอย่างไว้เฉลย
    const meta = cat.dictMeta ? cat.dictMeta[en] : null;
    return {en, correct:th, choices:shuffle([th, ...wrong]), meta};
  });
  quiz.cat = cat; quiz.idx = 0; quiz.correct = 0; quiz.fastAll = true;
  quiz.results = [];   // ผลรายข้อ {en, ok} — สอบซ่อมรวม band ใช้ตัดเกรดรายชุด (รอบ 270)
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
  wordEl.innerHTML = `${escapeHTML(q.en)} <span class="quiz-speak">🔊</span>`
    + (q.meta && (q.meta.ipa || q.meta.pron)
        ? `<div class="quiz-phon">${escapeHTML(q.meta.ipa || '')} ${escapeHTML(q.meta.pron || '')}</div>` : '');
  wordEl.onclick = ()=>speakWord(q.en);             // 🔊 แตะการ์ดคำโจทย์ = อ่านออกเสียง
  // กล่องเฉลยประโยคตัวอย่าง (โผล่หลังตอบ เฉพาะหมวด band ที่มีตัวอย่าง)
  let xb = document.getElementById('quiz-extra');
  if(!xb){
    xb = document.createElement('div'); xb.id = 'quiz-extra';
    document.getElementById('quiz-choices').after(xb);
  }
  xb.classList.remove('show'); xb.innerHTML = '';
  const box = document.getElementById('quiz-choices');
  box.innerHTML = q.choices.map(c=>`<button class="quiz-choice">${c}</button>`).join('');
  box.querySelectorAll('.quiz-choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(quiz.answered) return;
      quiz.answered = true;
      quiz.results.push({en: q.en, ok: btn.textContent === q.correct});
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
      // หมวด band: เฉลยประโยคตัวอย่าง EN+TH แล้วค้างไว้ให้อ่านก่อนขึ้นข้อใหม่
      let wait = 950;
      if(q.meta && q.meta.ex){
        xb.innerHTML = `<div class="qx-ex">💬 ${escapeHTML(q.meta.ex)}</div>`
          + (q.meta.exTh ? `<div class="qx-exth">${escapeHTML(q.meta.exTh)}</div>` : '');
        xb.classList.add('show');
        // จอเตี้ย: กล่องเฉลยอาจอยู่ใต้ fold → เลื่อนให้เห็นทันที (smooth โดนเบราว์เซอร์ throttle ได้ตอนแท็บพัก)
        xb.scrollIntoView({block:'nearest'});
        wait = 2400;
      }
      setTimeout(()=>{
        quiz.idx++;
        if(quiz.idx >= quiz.questions.length) finishQuiz();
        else renderQuizQuestion();
      }, wait);
    });
  });
}

function finishQuiz(){
  const qx = document.getElementById('quiz-extra');
  if(qx){ qx.classList.remove('show'); qx.innerHTML = ''; }
  const cat = quiz.cat;
  const passMark = Math.ceil(quiz.questions.length * 0.8);       // เกณฑ์ผ่าน 80% (10 ข้อ = 8 เท่าเดิม · ชุดท้าย band 11-19 ข้อคิดตามสัดส่วน)
  const passed = quiz.correct >= passMark;
  const firstPass = passed && !state.quizPassed.includes(cat.id);
  let coins = 0, exp = 0, rp = 5;                                // สอบไม่ผ่านก็ยังได้ +5 RP จากความพยายาม
  if(passed){
    coins = firstPass ? cat.reward : 20;   // รางวัลใหญ่เฉพาะการผ่านครั้งแรกของหมวด
    exp   = firstPass ? 30 : 10;
    rp    = firstPass ? 100 : 30;
    if(firstPass) state.quizPassed.push(cat.id);
    addCoins(coins);
    questEvent('quiz');                               // 🎯 Daily Quest: สอบผ่าน
    if(typeof feedEvent === 'function') feedEvent('quiz', `สอบผ่านหมวด${cat.name} ${quiz.correct}/${quiz.questions.length} ข้อ 📝`);
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
  if(typeof cat.onFinish === 'function') cat.onFinish(passed);   // สอบซ่อมรวม band: ตัดเกรดรายชุด (dictband.js)

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
        : `ได้กำลังใจ +${rp} RP 💪 ต้องตอบถูก ${passMark} ข้อขึ้นไปถึงจะได้รางวัลพิเศษ ลองใหม่อีกครั้งนะ`}
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
    // ชุดข้อสอบ/สอบซ่อมรวม band: เด้งแผงเลือกชุดกลับมาให้เลือกชุดถัดไปต่อเลย
    if((cat.setIdx !== undefined || cat.retakeSets) && typeof openBandSetPicker === 'function') openBandSetPicker(cat.band);
    // สอบซ่อมรวม: สรุปละเอียดรายชุด + คำที่ยังผิด ทับแผง (รอบ 271)
    if(cat.retakeSets && typeof bandShowRetakeSummary === 'function') bandShowRetakeSummary();
  });
  document.body.appendChild(overlay);
  if(passed && typeof cat.onPass === 'function') cat.onPass();   // โบนัสครบทุกชุดของระดับ (dictband.js)
  if(made) setTimeout(()=>showCollectReveal(made, null, true), 600);
  if(passed) sfx.levelup(); else sfx.wrong();
}
