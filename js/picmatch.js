"use strict";
/* ============================================================
   🖼️ picmatch.js — เกม "จับคู่ภาพ" (รอบ 977 · ผู้ใช้สั่ง 3 ส.ค. · โหมดภาพ-คำ รอบ 978)
   2 โหมด สลับด้วยปุ่มบนกระดาน:
   · "pic"  = แถวบน ภาพสัตว์ชุดที่ 1 ↔ แถวล่าง สัตว์ตัวเดียวกันคนละลายเส้น (ชุดที่ 2) — เฉพาะ 46 ตัวที่มีภาพครบ 2 แผ่น
   · "word" = แถวบน ภาพสัตว์ (แผ่นเดียว) ↔ แถวล่าง คำศัพท์ภาษาอังกฤษ — ครบทั้ง 104 ตัวที่มีภาพอย่างน้อย 1 แผ่น
   จับคู่ถูก = ได้เหรียญ/EXP/RP/คอมโบ/แต้มโรงงาน "สูตรเดียวกับเกมจับคู่คำศัพท์ทุกประการ" (ทั้ง 2 โหมด)
   (ใช้ตัวนับ game.* + addSessionCoins + showSessionSummary ชุดเดียวกับ js/game.js)
   แตะภาพ/คำไหน = อ่านออกเสียงชื่อสัตว์เป็นภาษาอังกฤษ (speakWord → sound/words/<word>.mp3 · ไม่มีไฟล์ค่อย TTS)
   ภาพ: img/matching/cards/a1_<key>.png / a2_<key>.png (ตัดจากแผ่นของผู้ใช้ด้วย tools/slice_matching.py)
   คลังคำ: js/data/matchpics.js (โหมด pic · 46 ตัวครบ 2 แผ่น) · js/data/matchwords.js (โหมด word · 104 ตัว + sheet)
   ============================================================ */
(function(){
  const PAIRS = 4;                 // จำนวนคู่ต่อรอบ (เท่าเกมจับคู่คำศัพท์)
  const SEC = 60;                  // เวลาต่อรอบ (+20 วิ ถ้าเลี้ยงสุนัขโตเต็มวัยไม่ป่วย — กติกาเดียวกัน)
  const MODE_LABEL = {pic:'🖼️ ภาพ-ภาพ', word:'🔤 ภาพ-คำ'};

  let queue = [], qi = 0;          // คิวสัตว์สุ่มไม่ซ้ำจนกว่าจะครบคลัง (คลังคนละชุดต่อโหมด)
  let sec = null;                  // <section id="screen-picmatch">
  const pm = {
    mode:'pic',                    // 'pic' = จับคู่ภาพกับภาพ (เดิม) · 'word' = จับคู่ภาพกับคำอังกฤษ
    pairs:[], sel1:null, sel2:null, matched:0, checking:false,
    timerId:0, timeLeft:0, total:SEC, roundAt:0, clean:true, hintUsed:false,
  };

  const $  = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const bank = () => {
    const arr = pm.mode === 'word'
      ? (typeof MATCH_WORDS !== 'undefined' ? MATCH_WORDS : [])
      : (typeof MATCH_PICS !== 'undefined' ? MATCH_PICS : []);
    return arr;
  };
  const imgSrc = (sheet, key) => `img/matching/cards/${sheet}_${key}.png`;

  /* ---------- คิวสัตว์: สุ่มทั้งคลังแล้วจ่ายทีละรอบ ครบคลังค่อยสับใหม่ (เห็นภาพหลากหลาย ไม่วนซ้ำ) ---------- */
  function take(n){
    const out = [];
    while(out.length < n){
      if(qi >= queue.length){ queue = shuffle(bank().slice()); qi = 0; }
      if(!queue.length) break;                       // คลังว่าง (ไฟล์ข้อมูลไม่โหลด) — กันลูปไม่รู้จบ
      const it = queue[qi++];
      if(!out.some(o => o[0] === it[0])) out.push(it);
    }
    return out;
  }

  /* ---------- สร้างหน้าจอครั้งเดียว ---------- */
  function build(){
    if(sec) return sec;
    sec = document.createElement('section');
    sec.id = 'screen-picmatch';
    sec.className = 'screen';
    sec.innerHTML = `
      <div class="game-top">
        <button class="back-btn" id="pm-back">⬅ กลับ</button>
        <div class="game-avatar" id="pm-avatar" title="ตัวละครของหนูมาเชียร์!"></div>
        <button class="pm-mode-btn" id="pm-mode" title="สลับโหมดเกม">🖼️ ภาพ-ภาพ</button>
        <div class="coin-pill"><img class="coin-ic" src="img/coins/coin_gold.png" alt="เหรียญ" onerror="this.replaceWith('🪙')"> <span id="pm-coin">0</span></div>
        <div class="combo-pill" id="pm-combo">Combo ×0</div>
      </div>
      <div class="timer-wrap"><div class="timer-fill" id="pm-timer"></div></div>
      <p class="board-label pm-label" id="pm-label-a">🖼️ เลือกภาพจากแถวบน 1 ภาพ</p>
      <div class="pm-grid" id="pm-grid-a"></div>
      <p class="board-label pm-label" id="pm-label-b">🎨 แล้วหา <b>สัตว์ตัวเดียวกัน</b> ในแถวล่าง (คนละลายเส้น)</p>
      <div class="pm-grid" id="pm-grid-b"></div>
      <button class="hint-btn" id="pm-hint" style="display:none">💡 น้องแมวช่วยตัดช้อยส์!</button>
      <p class="game-endless-note pm-note">♾️ เล่นได้เรื่อยๆ ไม่มีวันตัน — แตะภาพ/คำเพื่อ<b>ฟังเสียงอ่านภาษาอังกฤษ</b> · ครั้งนี้เก็บไปแล้ว <b class="sess-coin" id="pm-sess">0 🪙</b><span class="pm-n2"><br>เพลียเมื่อไหร่ กดปุ่ม <b>⬅ กลับ</b> มุมซ้ายบนพักได้เสมอ 😊</span></p>`;
    const host = $('screen-game') ? $('screen-game').parentNode : document.body;
    host.appendChild(sec);
    $('pm-back').addEventListener('click', exit);
    $('pm-hint').addEventListener('click', hint);
    $('pm-mode').addEventListener('click', toggleMode);
    return sec;
  }

  /* ---------- สลับโหมด: ภาพ-ภาพ ↔ ภาพ-คำ (คลังคำคนละชุด ต้องสับคิวใหม่) ---------- */
  function toggleMode(){
    if(typeof sfx !== 'undefined') sfx.select();
    pm.mode = pm.mode === 'pic' ? 'word' : 'pic';
    queue = []; qi = 0;
    updateLabels();
    newRound();
  }
  function updateLabels(){
    const word = pm.mode === 'word';
    $('pm-mode').textContent = MODE_LABEL[pm.mode];
    $('pm-label-a').innerHTML = word
      ? '🖼️ เลือก<b>ภาพสัตว์</b>จากแถวบน 1 ภาพ'
      : '🖼️ เลือกภาพจากแถวบน 1 ภาพ';
    $('pm-label-b').innerHTML = word
      ? '🔤 แล้วหา <b>คำศัพท์ภาษาอังกฤษ</b> ที่ตรงกันในแถวล่าง'
      : '🎨 แล้วหา <b>สัตว์ตัวเดียวกัน</b> ในแถวล่าง (คนละลายเส้น)';
  }

  /* ---------- เปิดเกม ---------- */
  function open(){
    if(!bank().length){
      if(has('toast')) toast('⚠️ ยังโหลดคลังภาพไม่ได้ ลองรีเฟรชหน้าอีกครั้งนะ');
      return;
    }
    build();
    if(has('careTick')) careTick();
    // ตัวนับ "ครั้งนี้" ชุดเดียวกับเกมจับคู่คำศัพท์ (สถิติสัปดาห์/ตลอดกาลจึงนับรวมกัน)
    if(typeof game !== 'undefined'){
      game.combo = 0; game.sessionCoins = 0; game.sessionMatches = 0;
      game.sessMilestone = 0; game.beatBestShown = false;
      if(has('rolloverWeekBest')) rolloverWeekBest();
      game.prevBest = state.weekBestCoins || 0;
      game.prevAllBest = state.bestSessionCoins || 0;
    }
    setSess(0); setCombo();
    $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
    const av = $('pm-avatar');
    if(av && has('playerAvatarHTML')){ const h = playerAvatarHTML(''); av.innerHTML = h; av.style.display = h ? '' : 'none'; }
    const p = has('activePet') ? activePet() : null;
    $('pm-hint').style.display = (p && p.type === 'cat' && has('abilityOn') && abilityOn(p)) ? 'block' : 'none';
    newRound();
    showScreen('screen-picmatch');
  }

  /* ---------- รอบใหม่ ---------- */
  function newRound(){
    clearInterval(pm.timerId);
    pm.pairs = take(PAIRS);
    pm.sel1 = pm.sel2 = null;
    pm.matched = 0; pm.checking = false; pm.hintUsed = false;
    pm.roundAt = Date.now(); pm.clean = true;

    const imgCard = (side, sheetFile, it) =>
      `<button class="pm-card" data-key="${it[0]}" data-en="${it[1]}" data-th="${it[2]}" data-side="${side}">
         <img class="pm-img" src="${imgSrc(sheetFile, it[0])}" alt="${it[1]}" draggable="false">
         <span class="pm-name">${it[1]} · ${it[2]}</span>
       </button>`;
    const wordCard = it =>
      `<button class="pm-card pm-wordcard" data-key="${it[0]}" data-en="${it[1]}" data-th="${it[2]}" data-side="a2">
         <span class="pm-word-text">${it[1]}</span>
       </button>`;
    if(pm.mode === 'word'){
      $('pm-grid-a').innerHTML = shuffle(pm.pairs.slice()).map(it => imgCard('a1', it[3] || 'a1', it)).join('');
      $('pm-grid-b').innerHTML = shuffle(pm.pairs.slice()).map(it => wordCard(it)).join('');
    }else{
      $('pm-grid-a').innerHTML = shuffle(pm.pairs.slice()).map(it => imgCard('a1', 'a1', it)).join('');
      $('pm-grid-b').innerHTML = shuffle(pm.pairs.slice()).map(it => imgCard('a2', 'a2', it)).join('');
    }
    [...sec.querySelectorAll('.pm-card')].forEach(c => c.addEventListener('click', () => pick(c)));

    const hb = $('pm-hint');
    hb.disabled = false; hb.textContent = '💡 น้องแมวช่วยตัดช้อยส์!';

    const p = has('activePet') ? activePet() : null;
    pm.total = SEC + ((p && p.type === 'dog' && has('abilityOn') && abilityOn(p)) ? 20 : 0);
    pm.timeLeft = pm.total;
    tickBar();
    pm.timerId = setInterval(()=>{
      pm.timeLeft--;
      tickBar();
      if(pm.timeLeft <= 0){
        clearInterval(pm.timerId);
        if(typeof sfx !== 'undefined') sfx.wrong();
        if(typeof game !== 'undefined') game.combo = 0;
        setCombo();
        if(has('toast')) toast('⏰ หมดเวลา! ลองรอบใหม่ สู้ๆ นะ');
        setTimeout(newRound, 900);
      }
    }, 1000);
    preload();   // โหลดภาพรอบถัดไปล่วงหน้า กันภาพขึ้นช้า
  }

  let preImgs = [];
  function preload(){
    const nx = queue.slice(qi, qi + PAIRS);
    preImgs = [];
    if(pm.mode === 'word'){
      nx.forEach(it => { const i = new Image(); i.src = imgSrc(it[3] || 'a1', it[0]); preImgs.push(i); });
    }else{
      nx.forEach(it => ['a1','a2'].forEach(s => { const i = new Image(); i.src = imgSrc(s, it[0]); preImgs.push(i); }));
    }
  }

  function tickBar(){
    const f = $('pm-timer');
    f.style.width = Math.max(0, (pm.timeLeft / pm.total) * 100) + '%';
    f.classList.toggle('low', pm.timeLeft <= 12);
  }
  function setCombo(){
    const n = (typeof game !== 'undefined') ? game.combo : 0;
    $('pm-combo').textContent = 'Combo ×' + n;
  }
  function setSess(add){
    if(typeof game === 'undefined') return;
    if(has('addSessionCoins')) addSessionCoins(add);   // นับรวมกับเกมจับคู่คำศัพท์ (สถิติสัปดาห์เดียวกัน)
    const el = $('pm-sess');
    if(el){
      el.textContent = (has('fmtNum') ? fmtNum(game.sessionCoins) : game.sessionCoins) + ' 🪙';
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }
  }

  /* ---------- แตะภาพ ---------- */
  function pick(c){
    if(pm.checking || c.classList.contains('matched')) return;
    if(typeof sfx !== 'undefined') sfx.select();
    speakWord(c.dataset.en);                       // 🔊 เสียงอ่านชื่อสัตว์ภาษาอังกฤษ (ทุกภาพ ทั้ง 2 แถว)
    const k = c.dataset.side === 'a1' ? 'sel1' : 'sel2';
    if(pm[k]) pm[k].classList.remove('selected');
    if(pm[k] === c){ pm[k] = null; return; }       // แตะซ้ำ = ยกเลิก
    pm[k] = c;
    c.classList.add('selected');
    if(pm.sel1 && pm.sel2) check();
  }

  /* ---------- ตรวจคู่ (สูตรรางวัลเดียวกับ checkMatch ใน js/game.js) ---------- */
  function check(){
    pm.checking = true;
    const A = pm.sel1, B = pm.sel2;
    const ok = A.dataset.key === B.dataset.key;

    if(!ok){
      if(typeof sfx !== 'undefined') sfx.wrong();
      pm.clean = false;
      if(has('vbRecord')){                          // 📒 จับผิด = ยังไม่แม่นคำนี้ → ลงสมุดทบทวน
        vbRecord(A.dataset.en, A.dataset.th, false);
        if(has('saveState')) saveState();
      }
      A.classList.add('shake'); B.classList.add('shake');
      if(typeof game !== 'undefined') game.combo = 0;
      setCombo();
      setTimeout(()=>{
        A.classList.remove('selected','shake'); B.classList.remove('selected','shake');
        pm.sel1 = pm.sel2 = null; pm.checking = false;
      }, 450);
      return;
    }

    if(typeof game !== 'undefined'){ game.combo++; game.sessionMatches++; }
    pm.matched++;
    if(typeof state !== 'undefined') state.totalMatches++;
    if(has('questEvent')) questEvent('match');
    if(has('vbRecord')) vbRecord(A.dataset.en, A.dataset.th, true);

    const p = has('activePet') ? activePet() : null;
    let coins = 10, exp = 5, rp = 2; const notes = [];
    if(p && p.type === 'dragon' && has('abilityOn') && abilityOn(p) && game.combo >= 3){ coins *= 2; notes.push('🔥ไฟลุก x2'); }
    if(state.phone && !state.netCut && typeof PHONE_BONUS !== 'undefined'){ coins += PHONE_BONUS; notes.push(`📱 มือถือ +${PHONE_BONUS}`); }
    if(!p) exp = 0;
    else if(p.sick){ exp = 0; notes.push('🤒 ป่วยอยู่ ไม่ได้ EXP'); }
    else if(p.shape === 'strong' && typeof SHAPE_EXP_BONUS !== 'undefined'){ exp += SHAPE_EXP_BONUS; notes.push(`💪 ล่ำกำยำ +${SHAPE_EXP_BONUS} EXP`); }
    if(has('addCoins')) addCoins(coins);
    setSess(coins);
    if(has('addRP')) addRP(rp);

    if(has('addCraft')){                            // 🏭 แต้มผลิตโรงงาน (1 คู่ = 1 แต้ม) เหมือนจับคู่คำศัพท์
      const made = addCraft(1);
      if(made && has('showCollectReveal')) setTimeout(()=>showCollectReveal(made, null, true), 650);
      else if(state.producing && has('collectInfo')){
        const cc = collectInfo(state.producing.id);
        notes.push(`🏭 ${cc.name} ${state.producing.progress}/${cc.words}`);
      }
    }

    if(typeof sfx !== 'undefined'){ sfx.correct(); sfx.coin(); }
    const av = $('pm-avatar');
    if(av && state.playerAvatar){ av.classList.remove('cheer'); void av.offsetWidth; av.classList.add('cheer'); }
    if(has('floatFx')) floatFx(`+${coins} 🪙 +${rp} RP${exp > 0 ? ` +${exp} EXP` : ''}`, '#f2994a');
    if(game.combo >= 2 && has('floatFx')) setTimeout(()=>floatFx(`🔥 COMBO ×${game.combo}!`, '#ff6fa7'), 250);
    if(notes.length && has('toast')) setTimeout(()=>toast(notes.join(' · '), 1200), 500);

    setCombo();
    if(exp > 0 && has('addExp')) addExp(exp, p);
    $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
    if(has('saveState')) saveState();

    A.classList.remove('selected'); B.classList.remove('selected');
    A.classList.add('matched'); B.classList.add('matched');
    pm.sel1 = pm.sel2 = null; pm.checking = false;

    if(pm.matched === PAIRS){
      clearInterval(pm.timerId);
      if(has('addCoins')) addCoins(20);
      setSess(20);
      if(has('addRP')) addRP(5);
      if(has('saveState')) saveState();
      $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
      // ⚡ สายฟ้าแลบ: เคลียร์ครบไม่พลาดเลยภายในเวลาที่กำหนด (เกณฑ์เดียวกับเกมจับคู่คำศัพท์)
      const thunder = pm.clean && typeof THUNDER_MS !== 'undefined' && (Date.now() - pm.roundAt) <= THUNDER_MS;
      if(thunder){
        if(has('thunderFx')) thunderFx();
        if(typeof sfx !== 'undefined') sfx.spark();
        if(has('addThunder')) addThunder();
        if(has('floatFx')) setTimeout(()=>floatFx('⚡ สายฟ้าแลบ! ไวเวอร์!', '#7fd4ff'), 200);
      }
      setTimeout(()=>{
        if(typeof sfx !== 'undefined') sfx.levelup();
        if(has('floatFx')) floatFx('🎉 เก่งมาก! โบนัส +20 🪙 +5 RP', '#5fc46a');
      }, thunder ? 900 : 400);
      setTimeout(newRound, thunder ? 2100 : 1600);
    }
  }

  /* ---------- ตัดช้อยส์ (แมวโตเต็มวัย) — ไฮไลต์คู่ที่ถูก 1 คู่ ---------- */
  function hint(){
    if(pm.hintUsed) return;
    const left = [...sec.querySelectorAll('#pm-grid-a .pm-card:not(.matched)')];
    if(!left.length) return;
    const a = left[Math.floor(Math.random() * left.length)];
    const b = sec.querySelector(`#pm-grid-b .pm-card[data-key="${a.dataset.key}"]`);
    pm.hintUsed = true;
    const hb = $('pm-hint');
    hb.disabled = true; hb.textContent = '💡 ใช้ไปแล้วรอบนี้';
    if(typeof sfx !== 'undefined') sfx.coin();
    a.classList.add('hint-glow'); if(b) b.classList.add('hint-glow');
    setTimeout(()=>{ a.classList.remove('hint-glow'); if(b) b.classList.remove('hint-glow'); }, 2500);
  }

  /* ---------- ออกจากเกม (การ์ดสรุปใบเดียวกับเกมจับคู่คำศัพท์) ---------- */
  function exit(){
    clearInterval(pm.timerId);
    const earned = (typeof game !== 'undefined') ? game.sessionCoins : 0;
    const matches = (typeof game !== 'undefined') ? game.sessionMatches : 0;
    const back = ()=>{ if(has('renderDashboard')) renderDashboard(); showScreen('screen-dashboard'); };
    if(earned <= 0 || !has('showSessionSummary')){ back(); return; }
    if(has('feedEvent')) feedEvent('coin', `จับคู่ภาพสัตว์ได้ ${has('fmtNum') ? fmtNum(earned) : earned} เหรียญ (${matches} คู่) 🖼️`);
    const isRecord = earned > (game.prevBest || 0);
    const allTime  = isRecord && earned > (game.prevAllBest || 0);
    showSessionSummary(earned, matches, isRecord, allTime, back, ()=>open());
  }

  /* ---------- ปุ่มเข้าเกม (ล็อบบี้เดิม) + Esc = ออก ---------- */
  function bind(){
    const b = $('btn-picmatch');
    if(b) b.addEventListener('click', ()=>{ if(has('closePanel')) closePanel(); open(); });
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && sec && sec.classList.contains('active')) exit();
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();

  window.PicMatch = { open, exit, _t:{ pm, newRound, check, pick, take, get queue(){ return queue; }, bank } };
})();
