"use strict";
/* ============================================================
   🖼️ picmatch.js — เกม "จับคู่ภาพ" (รอบ 977 · ผู้ใช้สั่ง 3 ส.ค. · โหมดภาพ-คำ รอบ 978 · กรองตามระดับชั้น รอบ 980)
   2 โหมด สลับด้วยปุ่มบนกระดาน:
   · "pic"  = แถวบน ภาพสัตว์ชุดที่ 1 ↔ แถวล่าง สัตว์ตัวเดียวกันคนละลายเส้น (ชุดที่ 2) — เฉพาะ 46 ตัวที่มีภาพครบ 2 แผ่น
   · "word" = แถวบน ภาพสัตว์ (แผ่นเดียว) ↔ แถวล่าง คำศัพท์ภาษาอังกฤษ — ครบทั้ง 104 ตัวที่มีภาพอย่างน้อย 1 แผ่น
   จับคู่ถูก = ได้เหรียญ/EXP/RP/คอมโบ/แต้มโรงงาน "สูตรเดียวกับเกมจับคู่คำศัพท์ทุกประการ" (ทั้ง 2 โหมด)
   (ใช้ตัวนับ game.* + addSessionCoins + showSessionSummary ชุดเดียวกับ js/game.js)
   แตะภาพ/คำไหน = อ่านออกเสียงชื่อสัตว์เป็นภาษาอังกฤษ (speakWord → sound/words/<word>.mp3 · ไม่มีไฟล์ค่อย TTS)
   ภาพ: img/matching/cards/a1_<key>.png / a2_<key>.png (ตัดจากแผ่นของผู้ใช้ด้วย tools/slice_matching.py)
   คลังคำ: js/data/matchpics.js (โหมด pic · 46 ตัวครบ 2 แผ่น) · js/data/matchwords.js (โหมด word · 104 ตัว + sheet)
   ระดับชั้น: js/data/animalgrade.js (key→tier 1-3 เจนจาก tools/gen_animalgrade.py) — bank() กรองสะสมตาม gradeTier()
   ============================================================ */
(function(){
  /* 🎚️ รอบ 981 (ผู้ใช้สั่ง): ขนาดกระดานตามระดับชั้น — ยิ่งโตยิ่งเยอะ ภาพยิ่งย่อ (แบบเกม onet แนวนอน)
     [จำนวนคู่, วินาทีต่อรอบ] · เวลา = คู่ละ 15 วิ (กระดานใหญ่ลดเหลือคู่ละ 12 วิ ไม่งั้นนานเกินไป) */
  const SIZE_LOW  = [4,  60];      // ต่ำกว่าประถม · ป.1-2  → 8 ภาพ
  const SIZE_MID  = [10, 150];     // ป.3-4                → 20 ภาพ
  const SIZE_HIGH = [40, 480];     // ป.5 ขึ้นไป           → 80 ภาพ
  const NAME_MIN  = 80;            // ช่องเล็กกว่านี้ = ไม่โชว์ป้ายชื่อใต้ภาพ (ตัวหนังสือจะเล็กจนอ่านไม่ออก)

  /* ระดับชั้นผู้เล่น → ระดับ 1(ป.1-2)/2(ป.3-4)/3(ป.5 ขึ้นไป) — ใช้คุมทั้งขนาดกระดานและกรองคลังสัตว์ (รอบ 980)
     คุมความยาก: ตรรกะเดียวกับ defaultSize ของเกมค้นหาคำ */
  function gradeTier(){
    const g = String((typeof state !== 'undefined' && state.student) ? state.student.grade : 'ป.1');
    if(g.indexOf('ต่ำกว่าประถม') === 0) return 1;
    const m = /^ป\.(\d)/.exec(g);
    if(m) return (+m[1] <= 2) ? 1 : (+m[1] <= 4) ? 2 : 3;
    return 3;                       // ม.1-ม.6 · ปริญญาตรี · สูงกว่าปริญญาตรี
  }
  function sizeForGrade(){ return [SIZE_LOW, SIZE_MID, SIZE_HIGH][gradeTier() - 1]; }
  const MODE_LABEL = {pic:'🖼️ ภาพ-ภาพ', word:'🔤 ภาพ-คำ'};

  let queue = [], qi = 0;          // คิวสัตว์สุ่มไม่ซ้ำจนกว่าจะครบคลัง (คลังคนละชุดต่อโหมด)
  let sec = null;                  // <section id="screen-picmatch">
  const pm = {
    mode:'pic',                    // 'pic' = จับคู่ภาพกับภาพ (เดิม) · 'word' = จับคู่ภาพกับคำอังกฤษ
    pairs:[], sel1:null, sel2:null, matched:0, checking:false,
    timerId:0, timeLeft:0, total:60, roundAt:0, clean:true, hintUsed:false,
  };

  const $  = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const bank = () => {
    const arr = pm.mode === 'word'
      ? (typeof MATCH_WORDS !== 'undefined' ? MATCH_WORDS : [])
      : (typeof MATCH_PICS !== 'undefined' ? MATCH_PICS : []);
    if(typeof ANIMAL_GRADE === 'undefined') return arr;      // ไฟล์กรองยังไม่โหลด — เล่นได้ครบคลังเดิม (กันพัง)
    const tier = gradeTier();
    // 🎓 รอบ 980: กรองสัตว์ตามระดับชั้นผู้เล่นแบบสะสม (tier สูง = เห็นของ tier ต่ำด้วยเสมอ ไม่มีวันเห็นน้อยลง)
    const filtered = arr.filter(it => (ANIMAL_GRADE[it[0]] || 3) <= tier);
    return filtered.length ? filtered : arr;                // กันคลังว่าง (เผื่อคีย์ไม่ตรงตารางในอนาคต)
  };
  const imgSrc = (sheet, key) => `img/matching/cards/${sheet}_${key}.png`;

  /* ---------- คิวสัตว์: สุ่มทั้งคลังแล้วจ่ายทีละรอบ ครบคลังค่อยสับใหม่ (เห็นภาพหลากหลาย ไม่วนซ้ำ) ---------- */
  function take(n){
    const out = [];
    n = Math.min(n, bank().length);   // 🛡️ รอบ 981: คลัง (หลังกรองตามชั้น) เล็กกว่าที่ขอ = เอาเท่าที่มี
    while(out.length < n){            //    ไม่งั้นลูปหาตัวไม่ซ้ำไปเรื่อย ๆ ไม่มีวันจบ = เกมค้าง
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
      <!-- 🔀 รอบ 985 (ผู้ใช้สั่ง): กระดานเดียว ภาพ 2 ชุดคละกันทั้งกระดาน (เลิกแยกแถวบน/แถวล่าง)
           #pm-grid-b เก็บไว้เป็นกล่องเปล่า เผื่อโค้ดเก่า/เทสต์ยังอ้างถึง -->
      <div class="pm-grid" id="pm-grid-a"></div>
      <div class="pm-grid" id="pm-grid-b" hidden></div>
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
  function updateLabels(){    // รอบ 985: เหลือแค่ปุ่มโหมด — ป้ายบอกแถวบน/ล่างถูกถอดออก (กระดานคละกันแล้ว)
    $('pm-mode').textContent = MODE_LABEL[pm.mode];
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
    fitGrid();          // ตอน newRound จอยังไม่ active (วัดขนาดไม่ได้) — วัดจริงหลังโชว์จอ
  }

  /* ---------- รอบใหม่ ---------- */
  function newRound(){
    clearInterval(pm.timerId);
    let size = sizeForGrade();
    // 🔤 โหมดภาพ-คำ: ตัวหนังสือต้องอ่านออก → กระดานใหญ่สุด 20 คู่ (40 คู่ = ช่องเล็กจนคำยาวโดนตัด)
    if(pm.mode === 'word' && size[0] > 20) size = [20, 300];
    pm.pairs = take(size[0]);
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
    /* 🔀 รอบ 985 (ผู้ใช้สั่ง "เอาภาพ 2 ชุดมาผสมกันเลย เค้าต้องคละกัน"):
       ทุกใบทั้ง 2 ชุดลงกริดเดียว สับไพ่รวมกันหมด — แตะใบไหนก่อนก็ได้ ขอแค่เป็นสัตว์ตัวเดียวกัน */
    const all = [];
    pm.pairs.forEach(it => {
      all.push(imgCard('a1', pm.mode === 'word' ? (it[3] || 'a1') : 'a1', it));
      all.push(pm.mode === 'word' ? wordCard(it) : imgCard('a2', 'a2', it));
    });
    $('pm-grid-a').innerHTML = shuffle(all).join('');
    $('pm-grid-b').innerHTML = '';
    [...sec.querySelectorAll('.pm-card')].forEach(c => c.addEventListener('click', () => pick(c)));
    fitGrid();                       // 📐 ย่อ/ขยายช่องให้กระดานทั้งใบพอดีจอ (กระดานใหญ่ = ภาพเล็กลง)

    const hb = $('pm-hint');
    hb.disabled = false; hb.textContent = '💡 น้องแมวช่วยตัดช้อยส์!';

    const p = has('activePet') ? activePet() : null;
    // เวลา: ตามขนาดกระดาน (+20 วิ ถ้าเลี้ยงสุนัขโตเต็มวัยไม่ป่วย — กติกาเดียวกับเกมจับคู่คำศัพท์)
    pm.total = size[1] + ((p && p.type === 'dog' && has('abilityOn') && abilityOn(p)) ? 20 : 0);
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

  /* ---------- 📐 จัดกริดให้พอดีจอ (รอบ 981 · กระดานเดียวคละกันตั้งแต่รอบ 985) ----------
     เลือก "จำนวนคอลัมน์" ที่ทำให้ช่องใหญ่ที่สุด โดยการ์ดทั้งกระดานยังอยู่ในจอครบ ไม่ต้องเลื่อน
     กระดาน 40 คู่ (80 ภาพ) จึงย่อภาพลงเองแบบเกมจับคู่แนวนอน · ช่องเล็กกว่า NAME_MIN = ซ่อนป้ายชื่อ */
  function fitGrid(){
    const n = pm.pairs.length * 2;                       // รอบ 985: ทุกใบอยู่กริดเดียว = 2 เท่าของจำนวนคู่
    if(!n || !sec || !sec.classList.contains('active')) return;
    const gA = $('pm-grid-a');
    sec.classList.toggle('big', n > 40);                 // กระดานใหญ่ = บีบป้ายล่างเหลือบรรทัดเดียว เอาที่ไปขยายช่อง
    void gA.offsetWidth;                                 // บังคับ reflow ก่อนวัด (จอเต็มชั้น fixed — รอบ 984)
    const availW = gA.clientWidth;
    if(!availW) return;                                  // ยังไม่ได้โชว์จอ — เดี๋ยว open()/resize เรียกซ้ำ
    let used = 0;                                        // ความสูงของทุกอย่างที่ไม่ใช่กริด (หัว/แถบเวลา/ป้าย/โน้ต)
    [...sec.children].forEach(el=>{
      if(!el.classList.contains('pm-grid') && el.offsetHeight) used += el.offsetHeight + 6;
    });
    const availH = Math.max(60, window.innerHeight - sec.getBoundingClientRect().top - used - 10);
    const gap = n > 40 ? 4 : n > 16 ? 6 : 8;
    let best = 0, bestCols = n;
    for(let cols = 1; cols <= n; cols++){
      const rows = Math.ceil(n / cols);
      const s = Math.min((availW - gap*(cols-1)) / cols, (availH - gap*(rows-1)) / rows);
      // `>=` = ช่องใหญ่เท่ากันให้เลือกแบบที่คอลัมน์เยอะกว่า (กระดานกางเต็มความกว้างจอสวยกว่า แถวน้อยลง)
      if(s >= best){ best = s; bestCols = cols; }
    }
    let side = Math.max(24, Math.min(150, Math.floor(best)));
    const rows = Math.ceil(n / bestCols);
    const apply = s => {
      sec.style.setProperty('--pmh', s + 'px');
      sec.style.setProperty('--pmc', bestCols);
      sec.style.setProperty('--pmg', gap + 'px');
      sec.classList.toggle('tiny', s < NAME_MIN);
    };
    apply(side);
    /* คำนวณมาร์จิน/ขอบของแต่ละจอไม่ตรงเป๊ะเสมอ → วัดของจริงแล้วหดจนกระดานอยู่ในจอครบ (กฎทองข้อ 7)
       ⚠️ วัดจาก "ลูกใบล่างสุด" ไม่ใช่ตัว section — ป้ายล่างล้นออกนอก section ได้ (rect ของ section ไม่รวมส่วนที่ล้น) */
    const lowest = ()=>{
      let b = 0;
      [...sec.children].forEach(el=>{ const r = el.getBoundingClientRect(); if(r.height && r.bottom > b) b = r.bottom; });
      return b;
    };
    for(let i = 0; i < 6; i++){
      const over = lowest() - window.innerHeight;
      if(over <= 0 || side <= 24) break;
      side = Math.max(24, side - Math.max(1, Math.ceil(over / rows)));
      apply(side);
    }
  }
  window.addEventListener('resize', ()=>{ if(sec && sec.classList.contains('active')) fitGrid(); });

  let preImgs = [];
  function preload(){
    const nx = queue.slice(qi, qi + pm.pairs.length);
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
  /* 🔀 รอบ 985: กระดานคละกันแล้ว → แตะใบไหนก่อนก็ได้ (เดิมต้องแถวบน 1 ใบ + แถวล่าง 1 ใบ)
     ใบแรกที่แตะ = sel1 · ใบที่สอง = sel2 → ตรวจทันที · แตะใบเดิมซ้ำ = ยกเลิกการเลือก */
  function pick(c){
    if(pm.checking || c.classList.contains('matched')) return;
    if(typeof sfx !== 'undefined') sfx.select();
    speakWord(c.dataset.en);                       // 🔊 เสียงอ่านชื่อสัตว์ภาษาอังกฤษ (ทุกใบในกระดาน)
    if(pm.sel1 === c){ c.classList.remove('selected'); pm.sel1 = null; return; }
    if(!pm.sel1){ pm.sel1 = c; c.classList.add('selected'); return; }
    pm.sel2 = c;
    c.classList.add('selected');
    check();
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
    if(typeof state !== 'undefined'){
      state.totalMatches++;
      // 🖼️ รอบ 979: แต้มสะสมตลอดกาล (state.pmScore/pmPairs/pmBoards) → แท็บใหม่ "🖼️ จับคู่ภาพ" (สูตรเดียวกับ wsScore)
      state.pmPairs = (state.pmPairs || 0) + 1;
      state.pmScore = Math.round((state.pmScore || 0) + 2);
    }
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

    if(pm.matched === pm.pairs.length){
      clearInterval(pm.timerId);
      // โบนัสเคลียร์รอบคิดตามขนาดกระดาน (4 คู่ = +20🪙 +5RP เท่าเกมจับคู่คำศัพท์เดิม · 40 คู่ = +200🪙 +50RP)
      const bCoin = pm.pairs.length * 5, bRp = Math.round(pm.pairs.length * 1.25);
      if(has('addCoins')) addCoins(bCoin);
      setSess(bCoin);
      if(has('addRP')) addRP(bRp);
      if(typeof state !== 'undefined'){   // 🖼️ รอบ 979: เคลียร์รอบ = โบนัสแต้มกระดานอันดับ (สูตรเดียวกับ WS_CLEAR_BONUS)
        state.pmBoards = (state.pmBoards || 0) + 1;
        state.pmScore = Math.round((state.pmScore || 0) + 10);
      }
      if(has('saveState')) saveState();
      $('pm-coin').textContent = has('fmtNum') ? fmtNum(state.coins) : state.coins;
      // ⚡ สายฟ้าแลบ: เคลียร์ครบไม่พลาดเลยภายในเวลาที่กำหนด (เกณฑ์เดียวกับเกมจับคู่คำศัพท์ · คิดตามขนาดกระดาน)
      const thunder = pm.clean && typeof THUNDER_MS !== 'undefined'
                   && (Date.now() - pm.roundAt) <= THUNDER_MS * (pm.pairs.length / 4);
      if(thunder){
        if(has('thunderFx')) thunderFx();
        if(typeof sfx !== 'undefined') sfx.spark();
        if(has('addThunder')) addThunder();
        if(has('floatFx')) setTimeout(()=>floatFx('⚡ สายฟ้าแลบ! ไวเวอร์!', '#7fd4ff'), 200);
      }
      setTimeout(()=>{
        if(typeof sfx !== 'undefined') sfx.levelup();
        if(has('floatFx')) floatFx(`🎉 เก่งมาก! โบนัส +${bCoin} 🪙 +${bRp} RP`, '#5fc46a');
      }, thunder ? 900 : 400);
      setTimeout(newRound, thunder ? 2100 : 1600);
    }
  }

  /* ---------- ตัดช้อยส์ (แมวโตเต็มวัย) — ไฮไลต์คู่ที่ถูก 1 คู่ ---------- */
  function hint(){
    if(pm.hintUsed) return;
    const left = [...sec.querySelectorAll('.pm-card:not(.matched)')];
    if(!left.length) return;
    const a = left[Math.floor(Math.random() * left.length)];
    // รอบ 985: คู่ของมันอยู่ในกระดานเดียวกัน = ใบอื่นที่ key ตรงกัน
    const b = left.find(c => c !== a && c.dataset.key === a.dataset.key);
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
