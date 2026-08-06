"use strict";
/* ============================================================
   🖼️ picmatch.js — เกม "จับคู่ภาพ" (รอบ 977 · เชื่อม Picture Dictionary รอบ 1053)
   2 โหมด สลับด้วยปุ่มบนกระดาน:
   · "pic"  = ภาพจาก Picture Dictionary ↔ ภาพเดียวกัน
   · "word" = ภาพจาก Picture Dictionary ↔ คำศัพท์ภาษาอังกฤษ
   จับคู่ถูก = ได้เหรียญ/EXP/RP/คอมโบ/แต้มโรงงาน "สูตรเดียวกับเกมจับคู่คำศัพท์ทุกประการ" (ทั้ง 2 โหมด)
   (ใช้ตัวนับ game.* + addSessionCoins + showSessionSummary ชุดเดียวกับ js/game.js)
   แตะภาพ/คำไหน = อ่านออกเสียงภาษาอังกฤษ (speakWord → MP3/TTS)
   หมวด/คำ/กรอบภาพใช้ข้อมูลชุดเดียวกับ Picture Dictionary:
   js/data/picdict.js + picdict_words.js + picdict_grid.js · img/matching/web/*.webp
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

  let queue = [], qi = 0;          // เก็บไว้ใน test API เดิม; รอบ 1053 ใช้คลังชุดที่ผู้เล่นเลือกแทน
  let sec = null;                  // <section id="screen-picmatch">
  const pm = {
    mode:'pic',                    // 'pic' = ภาพเดียวกัน 2 ใบ · 'word' = ภาพกับคำอังกฤษ
    pairs:[], sel1:null, sel2:null, matched:0, checking:false,
    timerId:0, timeLeft:0, total:60, roundAt:0, clean:true, hintUsed:false,
    choosing:true, group:0, sheetFile:'', sheetEn:'', sheetTh:'', pageStart:0,
  };

  const $  = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const book = () => typeof PICDICT_BOOK !== 'undefined' ? PICDICT_BOOK : [];
  const wordsFor = file => (typeof PICDICT_WORDS !== 'undefined' && PICDICT_WORDS[file]) || null;
  const gridFor = file => (typeof PICDICT_GRID !== 'undefined' && PICDICT_GRID[file]) || null;
  const sheetSrc = file => `img/matching/web/${file.replace(/\.png$/i,'.webp')}`;
  function sheetItems(file){
    const W = wordsFor(file), G = gridFor(file);
    if(!W) return [];
    return W.words.map(([en,th], index)=>({
      key:`${file}:${index}`, file, index, en, th,
      rect:(G && G[index]) || [index%W.cols/W.cols, Math.floor(index/W.cols)/W.rows,
        (index%W.cols+1)/W.cols, (Math.floor(index/W.cols)+1)/W.rows],
    }));
  }
  function pageSize(){
    const n = sizeForGrade()[0];
    return pm.mode === 'word' ? Math.min(20,n) : n; // คำต้องอ่านได้; ภาพ-ภาพใช้งบ 4/10/40 ตามชั้นตรง ๆ
  }
  const bank = () => pm.sheetFile
    ? sheetItems(pm.sheetFile).slice(pm.pageStart, pm.pageStart + pageSize()) : [];

  /* ---------- คลังชุดที่เลือก: ทุกภาพในลิงก์ชุดนั้นต้องได้ขึ้นกระดานครบ ---------- */
  function take(n){
    queue = shuffle(bank().slice()); qi = Math.min(n, queue.length);
    return queue.slice(0, qi);
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
        <button class="pm-category-btn pm-play" id="pm-category" title="เลือกหมวดอื่น">📚 เลือกหมวด</button>
        <button class="pm-mode-btn" id="pm-mode" title="สลับโหมดเกม">🖼️ ภาพ-ภาพ</button>
        <button class="pm-now pm-play" id="pm-now" title="แตะฟังเสียงอีกครั้ง">🔊 <span id="pm-now-en">แตะภาพฟังเสียง</span><span class="pm-now-th" id="pm-now-th"></span></button>
        <div class="pm-right pm-play">
          <div class="coin-pill"><img class="coin-ic" src="img/coins/coin_gold.png" alt="เหรียญ" onerror="this.replaceWith('🪙')"> <span id="pm-coin">0</span></div>
          <div class="combo-pill" id="pm-combo">Combo ×0</div>
        </div>
      </div>
      <div class="pm-chooser" id="pm-chooser">
        <div class="pm-choose-head"><b>🖼️ เลือกหมวด Picture Dictionary</b><span id="pm-budget"></span></div>
        <div class="pm-group-tabs" id="pm-group-tabs"></div>
        <div class="pm-sheet-list" id="pm-sheet-list"></div>
      </div>
      <div class="timer-wrap pm-play"><div class="timer-fill" id="pm-timer"></div></div>
      <!-- 🔀 รอบ 985 (ผู้ใช้สั่ง): กระดานเดียว ภาพ 2 ชุดคละกันทั้งกระดาน (เลิกแยกแถวบน/แถวล่าง)
           #pm-grid-b เก็บไว้เป็นกล่องเปล่า เผื่อโค้ดเก่า/เทสต์ยังอ้างถึง -->
      <div class="pm-grid pm-play" id="pm-grid-a"></div>
      <div class="pm-grid pm-play" id="pm-grid-b" hidden></div>
      <button class="hint-btn pm-play" id="pm-hint" style="display:none">💡 น้องแมวช่วยตัดช้อยส์!</button>
      <p class="game-endless-note pm-note pm-play">♾️ ภาพทุกใบมาจาก <b>Picture Dictionary</b> · แตะภาพ/คำเพื่อฟังเสียง · ครั้งนี้เก็บไปแล้ว <b class="sess-coin" id="pm-sess">0 🪙</b><span class="pm-n2"><br>อยากเปลี่ยนหมวด กด <b>📚 หมวดภาพ</b> ด้านบนได้เสมอ 😊</span></p>`;
    const host = $('screen-game') ? $('screen-game').parentNode : document.body;
    host.appendChild(sec);
    $('pm-back').addEventListener('click', exit);
    $('pm-hint').addEventListener('click', hint);
    $('pm-mode').addEventListener('click', toggleMode);
    $('pm-category').addEventListener('click', showChooser);
    $('pm-now').addEventListener('click', replayNow);
    $('pm-group-tabs').addEventListener('click', e=>{
      const b=e.target.closest('[data-group]'); if(!b) return;
      pm.group=+b.dataset.group; renderChooser();
    });
    $('pm-sheet-list').addEventListener('click', e=>{
      const b=e.target.closest('[data-file][data-start]'); if(!b) return;
      chooseSheet(b.dataset.file,b.dataset.en,b.dataset.th,+b.dataset.start);
    });
    return sec;
  }

  /* ---------- สลับโหมด: ภาพ-ภาพ ↔ ภาพ-คำ (คลังคำคนละชุด ต้องสับคิวใหม่) ---------- */
  function toggleMode(){
    if(typeof sfx !== 'undefined') sfx.select();
    pm.mode = pm.mode === 'pic' ? 'word' : 'pic';
    queue = []; qi = 0;
    updateLabels();
    if(pm.choosing) renderChooser();
    else{
      pm.pageStart = Math.floor(pm.pageStart/pageSize())*pageSize();
      newRound();
    }
  }
  function updateLabels(){    // รอบ 985: เหลือแค่ปุ่มโหมด — ป้ายบอกแถวบน/ล่างถูกถอดออก (กระดานคละกันแล้ว)
    $('pm-mode').textContent = MODE_LABEL[pm.mode];
  }

  /* ============================================================
     📚 Picture Dictionary category chooser (รอบ 1053)
     8 กลุ่ม + 46 หมวดใช้สารบัญเดียวกับหนังสือ; หมวดที่เกินงบ 4/10/40 คู่
     แบ่งเป็นลิงก์ "ชุด" ใต้ชื่อหมวด เพื่อไม่ให้ภาพส่วนเกินหายไป
     ============================================================ */
  function renderChooser(){
    const groups=book(), budget=pageSize();
    const grade=String(typeof state !== 'undefined' && state.student ? state.student.grade : 'ป.1');
    if(!groups.length) return;
    pm.group=Math.max(0,Math.min(pm.group,groups.length-1));
    $('pm-budget').textContent=`${grade} · ${budget} คู่/ชุด${pm.mode==='word'&&sizeForGrade()[0]>20?' (โหมดคำจำกัด 20 คู่เพื่อให้อ่านชัด)':''}`;
    $('pm-group-tabs').innerHTML=groups.map((g,i)=>
      `<button class="pm-group-tab${i===pm.group?' on':''}" data-group="${i}">${g.icon} ${esc(g.g)}</button>`).join('');
    const gr=groups[pm.group];
    $('pm-sheet-list').innerHTML=gr.sheets.map(([file,en,th])=>{
      const count=sheetItems(file).length, pages=Math.ceil(count/budget);
      const links=Array.from({length:pages},(_,i)=>{
        const start=i*budget, end=Math.min(count,start+budget);
        return `<button class="pm-set-link" data-file="${esc(file)}" data-en="${esc(en)}" data-th="${esc(th)}" data-start="${start}">ชุด ${i+1} <small>${start+1}–${end}</small></button>`;
      }).join('');
      return `<article class="pm-sheet-card"><div class="pm-sheet-title"><span>${gr.icon}</span><b>${esc(th)}</b><small>${esc(en)} · ${count} ภาพ</small></div><div class="pm-set-links">${links}</div></article>`;
    }).join('');
  }
  function showChooser(){
    clearInterval(pm.timerId); pm.choosing=true;
    sec.classList.add('choosing');
    $('pm-back').textContent='⬅ กลับ Lobby';
    renderChooser();
  }
  function chooseSheet(file,en,th,start){
    pm.sheetFile=file; pm.sheetEn=en; pm.sheetTh=th; pm.pageStart=start; pm.choosing=false;
    sec.classList.remove('choosing');
    $('pm-back').textContent='⬅ กลับ';
    const end=Math.min(sheetItems(file).length,start+pageSize());
    $('pm-category').textContent=`📚 ${th} ${start+1}–${end}`;
    updateLabels(); newRound(); fitGrid();
  }

  /* ---------- เปิดเกม ---------- */
  function open(){
    if(!book().length || typeof PICDICT_WORDS === 'undefined' || typeof PICDICT_GRID === 'undefined'){
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
    showScreen('screen-picmatch');
    updateLabels(); showChooser();
  }

  /* ---------- รอบใหม่ ---------- */
  function newRound(){
    clearInterval(pm.timerId);
    if(!pm.sheetFile){ showChooser(); return; }
    let size = sizeForGrade();
    // 🔤 โหมดภาพ-คำ: ตัวหนังสือต้องอ่านออก → กระดานใหญ่สุด 20 คู่ (40 คู่ = ช่องเล็กจนคำยาวโดนตัด)
    if(pm.mode === 'word' && size[0] > 20) size = [20, 300];
    pm.pairs = take(pageSize());
    pm.sel1 = pm.sel2 = null;
    pm.matched = 0; pm.checking = false; pm.hintUsed = false;
    pm.roundAt = Date.now(); pm.clean = true;
    resetNow();                        // 🔊 การ์ดชุดใหม่ทั้งกระดาน → เคลียร์ป้ายเสียง/ความหมายรอบก่อน

    const cropStyle = it=>{
      const [x0,y0,x1,y1]=it.rect, w=x1-x0, h=y1-y0;
      const px=w<.999 ? x0/(1-w)*100 : 0, py=h<.999 ? y0/(1-h)*100 : 0;
      // รอบ 1054: แยกการ escape ออกจาก ${...} ให้ทั้งคนและ static checker อ่านได้ตรงไปตรงมา
      const bg=encodeURI(sheetSrc(it.file)).split("'").join('%27');
      return `background-image:url('${bg}');background-size:${100/w}% ${100/h}%;background-position:${px}% ${py}%`;
    };
    const imgCard = (side, it) =>
      `<button class="pm-card pm-sheet-card-img" data-key="${esc(it.key)}" data-en="${esc(it.en)}" data-th="${esc(it.th)}" data-side="${side}">
         <span class="pm-sheet-img" style="${cropStyle(it)}" role="img" aria-label="${esc(it.en)}"></span>
         <span class="pm-name">${esc(it.en)} · ${esc(it.th)}</span>
       </button>`;
    const wordCard = it =>
      `<button class="pm-card pm-wordcard" data-key="${esc(it.key)}" data-en="${esc(it.en)}" data-th="${esc(it.th)}" data-side="a2">
         <span class="pm-word-text">${esc(it.en)}</span>
       </button>`;
    /* 🔀 รอบ 985 (ผู้ใช้สั่ง "เอาภาพ 2 ชุดมาผสมกันเลย เค้าต้องคละกัน"):
       ทุกใบทั้ง 2 ชุดลงกริดเดียว สับไพ่รวมกันหมด — แตะใบไหนก่อนก็ได้ ขอแค่เป็นสัตว์ตัวเดียวกัน */
    const all = [];
    pm.pairs.forEach(it => {
      all.push(imgCard('a1',it));
      all.push(pm.mode === 'word' ? wordCard(it) : imgCard('a2',it));
    });
    $('pm-grid-a').innerHTML = shuffle(all).join('');
    $('pm-grid-b').innerHTML = '';
    [...sec.querySelectorAll('.pm-card')].forEach(c => c.addEventListener('click', () => pick(c)));
    fitGrid();                       // 📐 ย่อ/ขยายช่องให้กระดานทั้งใบพอดีจอ (กระดานใหญ่ = ภาพเล็กลง)

    const hb = $('pm-hint');
    hb.disabled = false; hb.textContent = '💡 น้องแมวช่วยตัดช้อยส์!';

    const p = has('activePet') ? activePet() : null;
    // เวลา: ตามขนาดกระดาน (+20 วิ ถ้าเลี้ยงสุนัขโตเต็มวัยไม่ป่วย — กติกาเดียวกับเกมจับคู่คำศัพท์)
    pm.total = Math.max(30,pm.pairs.length*(pm.pairs.length>20?12:15)) + ((p && p.type === 'dog' && has('abilityOn') && abilityOn(p)) ? 20 : 0);
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
    const totalN = pm.pairs.length * 2;                  // รอบ 985: ขนาด "รอบ" ทั้งหมด (คงที่ทั้งรอบ ไม่ผันตามใบที่หายไป)
    if(!totalN || !sec || !sec.classList.contains('active')) return;
    const gA = $('pm-grid-a');
    sec.classList.toggle('big', totalN > 40);            // กระดานใหญ่ = บีบป้ายล่างเหลือบรรทัดเดียว เอาที่ไปขยายช่อง
    void gA.offsetWidth;                                 // บังคับ reflow ก่อนวัด (จอเต็มชั้น fixed — รอบ 984)
    const availW = gA.clientWidth;
    if(!availW) return;                                  // ยังไม่ได้โชว์จอ — เดี๋ยว open()/resize เรียกซ้ำ
    // 🧷 รอบ 1020: การ์ดที่จับคู่แล้วคงเป็นช่องล่องหนใน DOM → จำนวนลูกคงที่ตลอดรอบ
    // จึงรักษาจำนวนคอลัมน์ ขนาดช่อง และพิกัดของการ์ดใบอื่นไว้ตามกระดานเริ่มต้น
    const n = gA.children.length;
    if(!n) return;                                       // กระดานว่าง (เคลียร์ครบ รอ newRound ตั้งกระดานใหม่) — ข้ามคำนวณรอบนี้
    let used = 0;                                        // ความสูงของทุกอย่างที่ไม่ใช่กริด (หัว/แถบเวลา/ป้าย/โน้ต)
    [...sec.children].forEach(el=>{
      // 🐱 ปุ่มน้องแมวลอยมุมล่างขวา (position:absolute) ไม่กิน flow แล้ว → ไม่นับความสูงมาจอง
      if(!el.classList.contains('pm-grid') && el.offsetHeight && getComputedStyle(el).position !== 'absolute') used += el.offsetHeight + 6;
    });
    const availH = Math.max(60, window.innerHeight - sec.getBoundingClientRect().top - used - 10);
    const gap = totalN > 40 ? 4 : totalN > 16 ? 6 : 8;    // gap อิงขนาดรอบเดิม กันช่องกระโดดตอนใบเหลือน้อยใกล้จบ
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
    preImgs = [];
    if(pm.sheetFile){ const i=new Image(); i.src=sheetSrc(pm.sheetFile); preImgs.push(i); }
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

  /* 🗣️ ป้ายกลางบนจอ: คำอังกฤษ + ความหมายไทยของใบล่าสุดที่แตะ (แทนที่พื้นที่ว่างหลังย้ายเหรียญไปข้าง Combo) */
  function updateNow(en, th){
    pm.lastEn = en; pm.lastTh = th;
    const e = $('pm-now-en'), t = $('pm-now-th');
    if(e) e.textContent = en;
    if(t) t.textContent = th ? ' · ' + th : '';
  }
  function resetNow(){
    pm.lastEn = pm.lastTh = null;
    const e = $('pm-now-en'), t = $('pm-now-th');
    if(e) e.textContent = 'แตะภาพฟังเสียง';
    if(t) t.textContent = '';
  }
  function replayNow(){
    if(pm.lastEn) speakWord(pm.lastEn);
  }

  /* ---------- แตะภาพ ---------- */
  /* 🔀 รอบ 985: กระดานคละกันแล้ว → แตะใบไหนก่อนก็ได้ (เดิมต้องแถวบน 1 ใบ + แถวล่าง 1 ใบ)
     ใบแรกที่แตะ = sel1 · ใบที่สอง = sel2 → ตรวจทันที · แตะใบเดิมซ้ำ = ยกเลิกการเลือก */
  function pick(c){
    if(pm.checking || c.classList.contains('matched')) return;
    if(typeof sfx !== 'undefined') sfx.select();
    speakWord(c.dataset.en);                       // 🔊 เสียงอ่านชื่อสัตว์ภาษาอังกฤษ (ทุกใบในกระดาน)
    updateNow(c.dataset.en, c.dataset.th);          // 🗣️ ป้ายกลางบน: คำอังกฤษ+ความหมายไทยของใบล่าสุดที่แตะ
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

    // 🧷 รอบ 1020: โชว์กรอบเขียวสักครู่แล้วหมุน+หดให้ล่องหน แต่คงปุ่มไว้เป็นช่องว่างในกริด
    // ห้าม remove()/fitGrid() หลังจับคู่ — การ์ดใบอื่นต้องอยู่พิกัดเดิมตลอดรอบ
    setTimeout(()=>{
      A.classList.add('gone'); B.classList.add('gone');
    }, 500);

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
    if(has('feedEvent')) feedEvent('coin', `จับคู่ภาพได้ ${has('fmtNum') ? fmtNum(earned) : earned} เหรียญ (${matches} คู่) 🖼️`);
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

  window.PicMatch = { open, exit, _t:{ pm, newRound, check, pick, take, showChooser, chooseSheet, sheetItems, pageSize, get queue(){ return queue; }, bank } };
})();
