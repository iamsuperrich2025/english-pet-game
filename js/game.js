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
};

function startGame(cat){
  careTick();
  game.pool = cat ? cat.words : vocabForStudent();   // เล่นเฉพาะหมวด หรือคละตามระดับชั้น
  document.querySelector('#screen-game .board-label').textContent =
    `🇬🇧 คำศัพท์ภาษาอังกฤษ${cat ? ` · หมวด${cat.name}` : ''}`;
  game.combo = 0;
  updateComboPill();
  document.getElementById('game-coin-count').textContent = fmtNum(state.coins);
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
    addCoins(coins);
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
      addRP(5);
      saveState();
      document.getElementById('game-coin-count').textContent = fmtNum(state.coins);
      setTimeout(()=>{
        sfx.levelup();
        floatFx('🎉 เก่งมาก! โบนัส +20 🪙 +5 RP', '#5fc46a');
      }, 400);
      setTimeout(newRound, 1600);
    }
  }else{
    sfx.wrong();
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

const quiz = {cat:null, questions:[], idx:0, correct:0, answered:false};

function startQuiz(cat){
  // สุ่ม 10 ข้อจากหมวด: โจทย์อังกฤษ + ช้อยส์ไทย 4 ตัว (ตัวลวงจากหมวดเดียวกัน)
  quiz.questions = shuffle(cat.words).slice(0,10).map(([en,th])=>{
    const wrong = shuffle(cat.words.filter(w=>w[1] !== th)).slice(0,3).map(w=>w[1]);
    return {en, correct:th, choices:shuffle([th, ...wrong])};
  });
  quiz.cat = cat; quiz.idx = 0; quiz.correct = 0;
  renderQuizQuestion();
  showScreen('screen-quiz');
}

function renderQuizQuestion(){
  const q = quiz.questions[quiz.idx];
  quiz.answered = false;
  document.getElementById('quiz-progress').textContent =
    `${quiz.cat.emoji} หมวด${quiz.cat.name} · ข้อ ${quiz.idx+1} จาก ${quiz.questions.length} · คำนี้แปลว่าอะไร?`;
  document.getElementById('quiz-score-pill').textContent = `ถูก ${quiz.correct} ข้อ`;
  document.getElementById('quiz-word').textContent = q.en;
  const box = document.getElementById('quiz-choices');
  box.innerHTML = q.choices.map(c=>`<button class="quiz-choice">${c}</button>`).join('');
  box.querySelectorAll('.quiz-choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(quiz.answered) return;
      quiz.answered = true;
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

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    <h2>${passed ? '🏆 สอบผ่าน เก่งมาก!' : '💪 เกือบแล้ว สู้ๆ!'}</h2>
    <div class="lv-emoji" style="font-size:56px">${passed ? '🎉' : '📖'}</div>
    <p style="margin:8px 0 0;font-size:17px">หมวด${cat.name}: ตอบถูก <b>${quiz.correct}/${quiz.questions.length}</b> ข้อ<br>
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
