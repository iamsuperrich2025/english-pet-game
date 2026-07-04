"use strict";
/* ============================================================
   UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
   ============================================================ */

/* ---- สถานะหน้าตลาดสินค้าสะสม (ในหน่วยความจำ ไม่ต้องเซฟ) ---- */
let marketFilter = 'all';       // ตัวกรอง dropdown หน้าตลาดซื้อ ('all' | id สินค้า)
let collectView = 'shop';       // มุมมองการ์ด: 'shop' (ตลาดซื้อ) | 'mine' (คลังของฉัน)
let marketBought = new Set();    // ประกาศที่ซื้อไปแล้วในรอบเวลานี้ (กันโชว์ซ้ำ)
let marketBoughtSlot = null;     // รอบเวลา (10 นาที) ล่าสุดของ marketBought
const MARKET_ROTATE_MS = 10*60*1000;   // ประกาศขายในตลาดหมุนเวียนทุก 10 นาที

/* ---------- ภาพเริ่มต้น (ตะกร้า/ไข่ วาดด้วย CSS ถ้าไม่มีภาพเจน) ---------- */
function startHTML(key){
  const p = PETS[key];
  if(p.startKey === 'egg'){
    const inner = p.decals.map((d,i)=>`<span class="decal d${i+1}">${d}</span>`).join('');
    return `<div class="egg ${p.eggClass}">${inner}</div>`;
  }
  return `<div class="basket ${p.eggClass}">
    <span class="ear ear-l"></span><span class="ear ear-r"></span>
    <div class="sleep-head"></div>
    <div class="blanket"></div>
    <div class="basket-body"></div>
    <span class="zzz">💤</span>
  </div>`;
}

function petVisualHTML(p){
  const conf = PETS[p.type];
  const stage = petStage(p);
  const imgUrl = currentPetImg(p);
  let core, overlays = '';
  if(imgUrl){
    core = `<img class="pet-img" src="${imgUrl}" alt="${conf.name}">`;
  }else if(stage === 'egg'){
    core = startHTML(p.type);
  }else{
    core = `<span class="pet-emoji">${conf[stage]}</span>`;
    const worn = equippedItem(p);
    if(worn) overlays += `<span class="wear wear-${worn.slot}">${worn.emoji}</span>`;
    if(p.sick) overlays += `<span class="sick-badge">🤒</span>`;
  }
  const auraHTML = (stage === 'adult' && !p.sick)
    ? `<div class="aura"><span class="sparkle sp1">✨</span><span class="sparkle sp2">✨</span><span class="sparkle sp3">✨</span></div>`
    : '';
  return `<div class="pet-stage">${auraHTML}<div class="pet-wrap" id="pet-tap">${core}${overlays}</div></div>`;
}

/* ---------- เวลามื้ออาหารเป็นข้อความไทย (มื้อทุก 3 ชม.) ---------- */
function mealLabel(ts){
  const d = new Date(ts);
  const day = d.getDate() !== new Date().getDate() ? 'พรุ่งนี้ ' : '';
  return `${day}${String(d.getHours()).padStart(2,'0')}:00 น.`;
}
function fmtMins(ms){
  const totalMin = Math.max(0, Math.ceil(ms/60000));
  const h = Math.floor(totalMin/60), m = totalMin%60;
  return h > 0 ? (m > 0 ? `${h} ชม. ${m} นาที` : `${h} ชม.`) : `${m} นาที`;
}

/* ============================================================
   นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
   ============================================================ */
function renderClock(){
  const el = document.getElementById('clock-chip');
  if(!el) return;
  const now = new Date(Date.now());
  const dateTxt = now.toLocaleDateString('th-TH', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const timeTxt = now.toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  el.textContent = `📅 ${dateTxt} · ⏰ ${timeTxt} น.`;
  renderRainBar();                                   // แถบนับถอยหลังฝนเดินไปพร้อมนาฬิกา
  const compLive = document.getElementById('comp-live');
  if(compLive) compLive.textContent = compLiveTotal().toFixed(2);   // ตัวเลขรายได้คอมวิ่งทุกวินาที
  renderFarmClock();                                 // นาฬิกานับถอยหลังต้นไม้เดินพร้อมนาฬิกา
}

/* ============================================================
   แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
   ============================================================ */
function renderRainBar(){
  const el = document.getElementById('rain-banner');
  if(!el) return;
  const now = Date.now();
  const safe = rainProtected();
  if(rainNow(now)){
    const end = rainStartToday(now) + RAIN_DUR_MS;
    el.className = 'rain-banner raining' + (safe ? '' : ' danger');
    el.innerHTML = `<div class="rain-row"><span class="rain-icon">🌧️</span>
      <b>ฝนกำลังตกอยู่ตอนนี้!</b> (หยุดเวลา ${RAIN_HOUR+1}:00 น. — อีก ${fmtMins(end - now)})</div>
      <div class="rain-note">${safe
        ? '🏠 น้องอยู่ในบ้านสบายใจ ไม่เปียกฝนแน่นอน'
        : state.pets.some(p=>p.level>=2)
          ? '⚠️ น้องไม่มีที่หลบฝนสภาพดี เปียกฝนจนป่วยแล้ว! (ค่ารักษา 🪙' + fmtNum(CURE_COST) + ')'
          : '⚠️ ยังไม่มีที่หลบฝนสภาพดี — รีบหาบ้านก่อนรับน้องมาเลี้ยงนะ'}</div>`;
    return;
  }
  const next = nextRainStart(now);
  const msLeft = next - now;
  const pct = Math.min(100, Math.max(0, (1 - msLeft/(24*3600*1000)) * 100));
  el.className = 'rain-banner' + (safe ? '' : ' warn');
  el.innerHTML = `<div class="rain-row"><span class="rain-icon">🌧️</span>
    ฝนจะตกเวลา <b>${RAIN_HOUR}:00 น.</b> (ตกทุกวัน) — อีก <b>${fmtMins(msLeft)}</b></div>
    <div class="rain-track"><div class="rain-fill" style="width:${pct}%"></div></div>
    <div class="rain-note">${safe
      ? '🏠 มีบ้านสภาพดีแล้ว หลบฝนได้สบายใจ'
      : '⚠️ ยังไม่มีที่หลบฝนสภาพดี — ถ้าฝนตกน้องจะเปียกจนป่วย (ค่ารักษา 🪙' + fmtNum(CURE_COST) + ')'}</div>`;
}

/* ============================================================
   การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
   ต่อ Firebase สำเร็จ → โชว์ผู้เล่นจริงที่ออนไลน์อยู่ (Online.friends)
   ออฟไลน์/ต่อไม่ได้ → ถอยไปใช้เพื่อนจำลองเดิม (สุ่มหมุนเวียนทุก 5 นาที)
   ============================================================ */
function renderOnlineCard(){
  const el = document.getElementById('online-card');
  if(!el) return;
  const meName = state.student ? `${state.student.first} (หนูเอง)` : 'หนูเอง';
  const meGrade = state.student ? state.student.grade : '';
  const meRow = `<div class="online-row online-me">
      <span class="online-dot"></span>
      <span class="online-name">⭐ ${meName}</span>
      <span class="online-act">ชั้น ${meGrade} · กำลังเล่นอยู่ตอนนี้</span>
    </div>`;

  /* ---- โหมดออนไลน์จริง ---- */
  if(typeof Online !== 'undefined' && Online.ready){
    const rows = Online.friends.map(f=>`<div class="online-row">
      <span class="online-dot"></span>
      <span class="online-name">${f.n}</span>
      <span class="online-act">ชั้น ${f.g} · ${f.act}</span>
    </div>`).join('');
    el.innerHTML = `
      <h3 class="shop-title">🧑‍🤝‍🧑 คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา <span class="online-live">🌏 ออนไลน์จริง</span></h3>
      <div class="online-count">ตอนนี้มีเพื่อนออนไลน์ ${Online.friends.length + 1} คน 💚</div>
      ${meRow}${rows}
      ${Online.friends.length ? '' : '<div class="online-note">ยังไม่มีเพื่อนคนอื่นออนไลน์ตอนนี้ — ชวนเพื่อนมาเล่นด้วยกันสิ! 🎉</div>'}`;
    return;
  }

  /* ---- โหมดออฟไลน์: เพื่อนจำลองเดิม ---- */
  const seed = Math.floor(Date.now()/(5*60*1000));      // ชุดรายชื่อเปลี่ยนทุก 5 นาที
  const rnd = seededRand(seed * 7919);
  const count = Math.min(ONLINE_NAMES.length, onlineBaseCount(new Date().getHours()) + Math.floor(rnd()*3));
  const pool = ONLINE_NAMES.slice();
  for(let i=pool.length-1;i>0;i--){                     // สับไพ่แบบ deterministic
    const j = Math.floor(rnd()*(i+1));
    [pool[i],pool[j]] = [pool[j],pool[i]];
  }
  const friends = pool.slice(0, count);
  const rows = friends.map(f=>`<div class="online-row">
      <span class="online-dot"></span>
      <span class="online-name">${f.n}</span>
      <span class="online-act">ชั้น ${f.g} · ${ONLINE_ACTIVITIES[Math.floor(rnd()*ONLINE_ACTIVITIES.length)]}</span>
    </div>`).join('');
  el.innerHTML = `
    <h3 class="shop-title">🧑‍🤝‍🧑 คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา</h3>
    <div class="online-count">ตอนนี้มีเพื่อนออนไลน์ ${count + 1} คน 💚</div>
    ${meRow}${rows}`;
}

/* ============================================================
   การ์ด Leaderboard 🏆 — อันดับผู้เล่นที่มีเหรียญมากที่สุด Top 50
   (ข้อมูลจริงจาก Firebase — ออฟไลน์โชว์ข้อความเชิญชวนแทน)
   ============================================================ */
function renderLeaderboardCard(){
  const el = document.getElementById('leaderboard-card');
  if(!el) return;
  const title = `<h3 class="shop-title">🏆 สุดยอดนักสะสมเหรียญ Top ${LEADERBOARD_SIZE}</h3>`;
  if(typeof Online === 'undefined' || !Online.ready){
    el.innerHTML = title + `<div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อดูอันดับผู้เล่นจากทุกโรงเรียนนะ!</div>`;
    return;
  }
  if(!Online.board.length){
    el.innerHTML = title + `<div class="lb-empty">ยังไม่มีใครขึ้นกระดาน — เล่นเกมเก็บเหรียญเป็นคนแรกเลย! 🥇</div>`;
    return;
  }
  const medal = (i)=> i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : (i+1);
  const myId = state.onlineId;
  const myIdx = Online.board.findIndex(r=>r.id === myId);
  const rows = Online.board.map((r,i)=>`
    <div class="lb-row${r.id === myId ? ' lb-me' : ''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name">${r.id === myId ? '⭐ ' : ''}${r.n}<small> ชั้น ${r.g}</small></span>
      <span class="lb-coins">🪙 ${fmtNum(r.coins)}</span>
    </div>`).join('');
  el.innerHTML = title + `
    <div class="online-count">${myIdx >= 0 ? `หนูอยู่อันดับที่ ${myIdx + 1} จาก ${Online.board.length} คน 🎯` : `เก็บเหรียญเพิ่มเพื่อไต่ขึ้นกระดานนะ 💪`}</div>
    <div class="lb-list">${rows}</div>`;
}

/* ============================================================
   RANK CARD + ฉากเลื่อนแรงค์
   ============================================================ */
function rankBadgeHTML(rankId, emoji, cls){
  const img = IMG_FILES[`rank_${rankId}`];
  return img ? `<img class="${cls}" src="${img}" alt="">` : `<span class="${cls} rank-badge-emoji">${emoji}</span>`;
}

function renderRankCard(){
  const el = document.getElementById('rank-card');
  const worth = netWorth();                  // แรงค์ยึดมูลค่าทรัพย์สินสุทธิ (เหรียญ + ทรัพย์สิน)
  const info = rankInfo(worth);
  const r = info.rank;
  const assets = assetValue();
  const nextText = info.next
    ? `💰 มูลค่ารวม ${fmtNum(worth)} (🪙${fmtNum(state.coins)} + ทรัพย์สิน ${fmtNum(assets)}) · อีก ${fmtNum(info.next.min - worth)} ถึง ${info.next.name}`
    : `💰 มูลค่ารวม ${fmtNum(worth)} (🪙${fmtNum(state.coins)} + ทรัพย์สิน ${fmtNum(assets)}) · แรงค์สูงสุดแล้ว! 👑`;
  el.style.borderColor = r.color;
  el.innerHTML = `
    <div class="rank-badge-wrap">${rankBadgeHTML(r.id, r.emoji, 'rank-badge-img')}</div>
    <div class="rank-body">
      <div class="rank-name" style="color:${r.color}">${r.emoji} ${info.label} <small>${r.en}${info.tier ? ' ' + info.tier : ''}</small></div>
      <div class="rank-bar"><div class="rank-fill" style="width:${Math.round(info.prog*100)}%;background:${r.color}"></div></div>
      <div class="rank-text">${nextText}</div>
    </div>`;
}

/* ฉากอัพแรงค์ใหญ่: เหรียญตราใหญ่ + รัศมีหมุน (สไตล์เกมยิงแรงค์) */
function showRankUp(before, after){
  sfx.rankup();
  const r = after.rank;
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:${r.color}"></div>
    <div class="rankup-content">
      <div class="rankup-title">🎖️ RANK UP!</div>
      <div class="rankup-badge" style="--rank-color:${r.color}">
        ${rankBadgeHTML(r.id, r.emoji, 'rankup-badge-img')}
      </div>
      <div class="rankup-name" style="color:${r.color}">${r.name}${after.tier ? ' ' + after.tier : ''}</div>
      <div class="rankup-en">${r.en}${after.tier ? ' ' + after.tier : ''}</div>
      <p class="rankup-sub">เลื่อนจาก ${before.rank.emoji} ${before.label} — เก่งมาก สู้ต่อไป!</p>
      <button class="rankup-btn">รับตำแหน่ง 🎉</button>
    </div>`;
  overlay.querySelector('.rankup-btn').addEventListener('click', ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(overlay);
}

/* ============================================================
   PET DASHBOARD
   ============================================================ */
function renderDashboard(){
  careTick();
  dailyTick();
  const now = Date.now();

  /* ---- เหรียญ: สะสมทั้งหมด + วันนี้ ---- */
  document.getElementById('coin-count').textContent = fmtNum(state.coins);
  document.getElementById('coin-today').textContent = fmtNum(state.daily.coins);
  document.getElementById('sound-toggle').textContent = state.sound ? '🔊' : '🔇';
  document.getElementById('student-chip').textContent = state.student
    ? `🎓 ${state.student.first} ${state.student.last} · ชั้น ${state.student.grade} (ศัพท์${gradeBand(state.student.grade).label})` : '';

  renderClock();
  renderRankCard();
  renderOnlineCard();
  renderLeaderboardCard();

  /* ---- สภาพอากาศ ---- */
  const w = weatherNow();
  let wMsg = '';
  if(!state.home && state.pets.some(p=>p.level>=2)){
    if(w.id === 'rain') wMsg = ' — น้องไม่มีที่หลบฝนเลย รีบหาที่พักนะ!';
    else if(w.id === 'hot' || w.id === 'sunny') wMsg = ' — น้องตากแดดอยู่ หาที่พักให้น้องหน่อยนะ';
  }
  document.getElementById('weather-banner').innerHTML =
    `${w.emoji} อากาศตอนนี้: <b>${w.name}</b>${wMsg}`;

  /* ---- แท็บสลับสัตว์ (หลายตัว) ---- */
  const tabs = document.getElementById('pet-tabs');
  if(state.pets.length){
    tabs.style.display = 'flex';
    tabs.innerHTML = state.pets.map((p,i)=>{
      const stage = petStage(p);
      const face = stage === 'egg' ? (PETS[p.type].startKey==='egg'?'🥚':'🧺') : PETS[p.type][stage];
      const alert = p.sick ? ' 🤒' : (petHungry(p) ? ' 😫' : '');
      return `<button class="pet-tab ${i===state.active?'on':''}" data-i="${i}">${face} ${PETS[p.type].name}${alert}</button>`;
    }).join('') + `<button class="pet-tab add" id="tab-addpet">➕</button>`;
    tabs.querySelectorAll('.pet-tab[data-i]').forEach(b=>b.addEventListener('click', ()=>{
      state.active = +b.dataset.i; saveState(); sfx.select(); renderDashboard();
    }));
    document.getElementById('tab-addpet').addEventListener('click', ()=>{ renderPetShop(); showScreen('screen-select'); });
  }else{
    tabs.style.display = 'none'; tabs.innerHTML = '';
  }

  /* ---- การ์ดสัตว์เลี้ยง ---- */
  const card = document.getElementById('pet-card');
  const p = activePet();
  if(!p){
    card.className = 'pet-card';
    card.innerHTML = `
      <div class="pet-emoji" style="font-size:64px">🏪</div>
      <div class="pet-name">ยังไม่มีสัตว์เลี้ยง</div>
      <div class="stage-label">เล่นเกมจับคู่คำศัพท์ &amp; สอบให้ผ่าน เพื่อสะสมเหรียญ<br>
        แล้วไปรับน้องที่ร้านสัตว์เลี้ยงกัน! (🐶🐱 ${fmtNum(PETS.dog.price)} · 🐲 ${fmtNum(PETS.dragon.price)})</div>
      <div class="care-row"><button class="care-btn btn-feed" id="btn-goshop">🏪 ไปร้านสัตว์เลี้ยง</button></div>`;
    document.getElementById('btn-goshop').addEventListener('click', ()=>{ renderPetShop(); showScreen('screen-select'); });
    renderHomeCard();
    renderPhoneCard();
    renderComputerCard();
    renderFarmCard();
    renderCollectCard();
    renderShop();
    return;
  }

  const conf = PETS[p.type];
  const stage = petStage(p);
  const startStageName = conf.startKey === 'egg'
    ? 'ร่างไข่ 🥚 (เล่นเกมเพื่อฟักไข่!)'
    : 'แรกเกิดหลับปุ๋ย 🧺 (เล่นเกมให้น้องโตจนลืมตา!)';
  const stageNames = {egg:startStageName, baby:'ร่างเด็ก 🍼', adult:'ร่างโตเต็มวัย 🌟'};

  /* ---- ความหิวระบบมื้อ (หิวทุก 3 ชม.) ---- */
  let hungerUI = '';
  if(stage !== 'egg'){
    const slot = currentSlotStart(now);
    const hungry = petHungry(p);
    let hungerStatus, barPct, barCls = '';
    if(p.sick){
      hungerStatus = '🤒 ป่วยอยู่... ต้องรักษาก่อนถึงจะกินได้';
      barPct = 0;
    }else if(hungry){
      const msLeft = Math.max(0, HUNGRY_SICK_MS - (now - slot));
      hungerStatus = `😫 หิวแล้ว! ให้อาหารภายใน <b>${fmtMins(msLeft)}</b> ไม่งั้นน้องจะป่วยนะ`;
      barPct = (msLeft/HUNGRY_SICK_MS)*100; barCls = 'hungry';
    }else{
      const covered = p.fedUpTo >= nextSlotStart(now) - 1;   // feast ครอบมื้อถัดไปแล้ว
      const nextMeal = p.fedUpTo > slot ? nextSlotStart(now) + SLOT_MS : nextSlotStart(now);
      hungerStatus = covered
        ? `🍱 อิ่มพิเศษ! ข้ามมื้อถัดไปได้เลย มื้อต่อไป: ${mealLabel(nextMeal)}`
        : `😋 อิ่มมีความสุข · มื้อถัดไป: ${mealLabel(nextMeal)}`;
      barPct = 100; if(covered) barCls = 'buffed';
    }
    const sickCauseText = p.sickCause === 'heat'
      ? 'เพราะอากาศร้อนเกินไป (หาที่พักติดแอร์จะช่วยได้)'
      : p.sickCause === 'thirst'
        ? 'เพราะบ้านถูกตัดน้ำ ไม่มีน้ำกิน-อาบ (จ่ายค่าน้ำค้างให้น้ำกลับมานะ)'
        : p.sickCause === 'rain'
          ? 'เพราะโดนฝนเปียกทั้งตัว ไม่มีที่หลบฝนสภาพดี (หาที่พักให้น้องนะ)'
          : 'เพราะหิวนานเกินไป';

    /* ---- ความร้อนสะสม (ป่วยทุก 6 ชม. ถ้าไม่มีที่พักติดแอร์ — มังกรไม่ป่วย) ---- */
    let heatUI;
    if(p.type === 'dragon'){
      heatUI = `<div class="heat-text safe">🔥 มังกรเกิดจากไฟ ทนร้อนได้สบาย ไม่ป่วยจากอากาศร้อน</div>`;
    }else if(heatProtected()){
      heatUI = `<div class="heat-text safe">❄️ อยู่ในที่พักติดแอร์ เย็นสบาย ไม่ร้อนเลย</div>`;
    }else{
      const pct = heatPct(p);
      const msLeft = p.heatFrom != null ? Math.max(0, HEAT_SICK_MS - (now - p.heatFrom)) : HEAT_SICK_MS;
      heatUI = `
        <div class="level-row">
          <span class="level-badge" style="background:#e05b3a">🌡️ ร้อน</span>
          <div class="heat-bar"><div class="heat-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="heat-text">🥵 ความร้อนสะสม ${Math.round(pct)}% — ถ้าเต็มน้องจะป่วย (อีก ${fmtMins(msLeft)})<br>
          <small>${state.powerCut && (state.home === 'castle' || (state.home === 'medium' && state.ac))
            ? '🔌 ไฟถูกตัด แอร์เลยใช้ไม่ได้ — รีบจ่ายค่าไฟค้างให้ไฟกลับมานะ'
            : 'หาที่พักที่มีแอร์ให้น้องจะไม่ร้อนเลยนะ'}</small></div>`;
    }

    /* ---- ขาดน้ำสะสม (เฉพาะตอนบ้านถูกตัดน้ำ — ป่วยทุก 6 ชม. โดนทุกชนิด) ---- */
    let thirstUI = '';
    if(state.waterCut){
      const tPct = p.thirstFrom != null ? Math.min(100, (now - p.thirstFrom)/THIRST_SICK_MS*100) : 0;
      const tLeft = p.thirstFrom != null ? Math.max(0, THIRST_SICK_MS - (now - p.thirstFrom)) : THIRST_SICK_MS;
      thirstUI = `
        <div class="level-row">
          <span class="level-badge" style="background:#3a7bd5">🚱 ขาดน้ำ</span>
          <div class="heat-bar"><div class="heat-fill thirst-fill" style="width:${tPct}%"></div></div>
        </div>
        <div class="heat-text thirst-text">🚱 ขาดน้ำสะสม ${Math.round(tPct)}% — ถ้าเต็มน้องจะป่วย (อีก ${fmtMins(tLeft)})<br>
          <small>บ้านถูกตัดน้ำอยู่ — จ่ายค่าน้ำค้างให้น้ำกลับมานะ</small></div>`;
    }

    hungerUI = `
      <div class="level-row">
        <span class="level-badge" style="background:var(--orange-d)">🍖 อิ่ม</span>
        <div class="hunger-bar"><div class="hunger-fill ${barCls}" style="width:${barPct}%"></div></div>
      </div>
      <div class="hunger-text">${hungerStatus}</div>
      ${heatUI}
      ${thirstUI}
      ${p.sick ? `<div class="sick-banner">🤒 <b>${conf.name}ป่วยแล้ว!</b> ${sickCauseText}<br>ตอนป่วยจะไม่ได้ EXP และใช้ความสามารถพิเศษไม่ได้<br>พาไปหาหมอเพื่อรักษาให้หายก่อนนะ</div>` : ''}
      <div class="care-row">
        <button class="care-btn btn-feed" id="btn-feed" ${p.sick?'disabled':''}>🍽️ ให้อาหาร</button>
        ${p.sick ? `<button class="care-btn btn-cure" id="btn-cure">💊 รักษา 🪙${fmtNum(CURE_COST)}</button>` : ''}
      </div>`;
  }

  const sickGray = p.sick && stage!=='egg' && !IMG_FILES[`${p.type}_${stage}_sick`];
  card.className = 'pet-card ' + (stage==='egg' ? 'pet-egg-stage' : stage==='baby' ? 'pet-baby' : 'pet-adult')
                   + (sickGray ? ' pet-sick' : '');
  card.innerHTML = `
    ${petVisualHTML(p)}
    <div class="pet-name">${conf.name}</div>
    <div class="stage-label">${stageNames[stage]}</div>
    <div class="level-row">
      <span class="level-badge">Lv.${p.level}</span>
      <div class="exp-bar"><div class="exp-fill" style="width:${Math.min(100, p.exp/expNeed(p.level)*100)}%"></div></div>
    </div>
    <div class="exp-text">EXP ${p.exp}/${expNeed(p.level)} · จับคู่ถูกสะสม ${state.totalMatches} คำ</div>
    ${hungerUI}
    <div class="ability-box ${abilityOn(p)?'':'locked'}">
      ${!isAdult(p)
        ? `🔒 ความสามารถพิเศษจะปลดล็อกเมื่อโตเต็มวัย (Lv.3)<br><small>${conf.ability}</small>`
        : p.sick
          ? `🤒 ป่วยอยู่ ใช้ความสามารถพิเศษไม่ได้<br><small>${conf.ability}</small>`
          : `<b>ความสามารถพิเศษ:</b> ${conf.ability}`}
    </div>`;

  const feedBtn = document.getElementById('btn-feed');
  if(feedBtn) feedBtn.addEventListener('click', feedPet);
  const cureBtn = document.getElementById('btn-cure');
  if(cureBtn) cureBtn.addEventListener('click', curePet);

  // แตะน้องแล้วเด้งดึ๋ง + มีเสียง
  const tap = document.getElementById('pet-tap');
  tap.style.cursor = 'pointer'; tap.style.pointerEvents = 'auto';
  tap.addEventListener('click', ()=>{
    sfx.select();
    if(!p.sick && stage!=='egg' && !petHungry(p) && IMG_FILES[`${p.type}_${stage}_happy`]){
      makeHappy(2500);
    }else{
      tap.style.transform = 'scale(1.15) rotate(-5deg)';
      setTimeout(()=>tap.style.transform = '', 180);
    }
  });

  renderHomeCard();
  renderPhoneCard();
  renderComputerCard();
  renderFarmCard();
  renderShop();
}

/* ============================================================
   ให้อาหาร (ระบบมื้อ)
   ============================================================ */
function feedPet(){
  const p = activePet();
  if(!p) return;
  if(p.sick){ sfx.wrong(); toast('🤒 น้องป่วยอยู่ กินไม่ลง... ต้องรักษาก่อนนะ'); return; }
  const hungry = petHungry(p);
  const canFeast = p.fedUpTo < nextSlotStart(Date.now());
  if(!hungry && !canFeast){
    sfx.select(); toast('😋 น้องอิ่มแปล้ถึงมื้อหน้าแล้ว ไว้ค่อยกินใหม่นะ'); return;
  }
  openFoodMenu(p, hungry);
}

function openFoodMenu(p, hungry){
  sfx.select();
  const fav = Object.assign({id:'favorite'}, PETS[p.type].favFood);
  const menuFoods = [fav, ...FOODS];
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box food-box">
    <h2>🍽️ เลือกเมนูให้น้องกิน</h2>
    ${hungry ? '' : `<p style="margin:4px 0;font-size:13.5px;color:#9a8aac">น้องอิ่มมื้อนี้แล้ว — มีแต่ชุดอาหารวิเศษที่กินตุนข้ามมื้อได้</p>`}
    <div class="food-grid">
      ${menuFoods.map(f=>{
        const usable = hungry || f.skipNext;
        return `
        <div class="food-item ${f.exp ? 'food-fav' : ''} ${f.special ? 'food-special' : ''} ${(state.coins < f.price || !usable) ? 'cant-afford' : ''}" data-food="${f.id}">
          ${f.exp ? `<span class="fav-tag">💖 เมนูโปรดของ${PETS[p.type].name}!</span>` : ''}
          <span class="fd-emoji">${f.emoji}</span>
          <span class="fd-en">${f.en}</span>
          <span class="fd-name">${f.name}</span>
          <span class="fd-info">🪙${fmtNum(f.price)} · อิ่ม ${f.skipNext ? 6 : 3} ชม.</span>
          ${f.exp ? `<span class="fd-exp">✨ ได้ EXP แถม +${f.exp}!</span>` : ''}
          ${f.skipNext ? `<span class="fd-exp">⏳ อิ่มตุนข้ามมื้อถัดไปได้เลย!</span>` : ''}
        </div>`;}).join('')}
    </div>
    <button class="food-cancel">ไว้ก่อน</button>
  </div>`;
  overlay.querySelector('.food-cancel').addEventListener('click', ()=>overlay.remove());
  overlay.querySelectorAll('.food-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      const food = menuFoods.find(f=>f.id===el.dataset.food);
      if(!hungry && !food.skipNext){
        sfx.wrong(); toast('น้องอิ่มมื้อนี้แล้ว เมนูนี้ไว้มื้อหน้านะ 😊'); return;
      }
      if(state.coins < food.price){
        sfx.wrong();
        toast(`เหรียญไม่พอ ${food.en} ราคา 🪙${food.price} — ไปเล่นเกมเก็บเหรียญกัน!`);
        return;
      }
      overlay.remove();
      feedWith(p, food);
    });
  });
  document.body.appendChild(overlay);
}

function feedWith(p, food){
  const now = Date.now();
  state.coins -= food.price;
  p.fedUpTo = food.skipNext ? nextSlotStart(now) : currentSlotStart(now);
  sfx.buy();
  if(food.exp) addExp(food.exp, p);   // เมนูโปรด: ได้ EXP แถม (อาจเลเวลอัพได้เลย)
  saveState();
  makeHappy(4000);
  showFeedResult(p, food);
}

function showFeedResult(p, food){
  const conf = PETS[p.type];
  const stage = petStage(p);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const happyImg = IMG_FILES[`${p.type}_${stage}_happy`] || IMG_FILES[`${p.type}_${stage}_normal`];
  const nextMeal = p.fedUpTo >= nextSlotStart(Date.now()) - 1
    ? nextSlotStart(Date.now()) + SLOT_MS : nextSlotStart(Date.now());
  overlay.innerHTML = `<div class="levelup-box feed-box">
    <h2>${food.emoji} หม่ำ ${food.en} อร่อยจัง!</h2>
    <div class="feed-pet">${happyImg ? `<img src="${happyImg}" alt="">` : (conf[stage] || '😋')}${food.emoji}</div>
    <div class="feed-gain">อิ่มมื้อนี้เรียบร้อย 🎉 มื้อถัดไป: ${mealLabel(nextMeal)}</div>
    ${food.exp ? `<div class="feed-gain" style="background:var(--purple);border-color:var(--purple-d);color:#6a48a8">💖 เมนูโปรด! ได้ EXP แถม +${food.exp} ✨</div>` : ''}
    ${food.skipNext ? `<div class="feed-gain" style="background:var(--yellow);border-color:var(--yellow-d);color:#a8791a">🍱 อาหารวิเศษ! อิ่มตุนข้ามมื้อถัดไปเลย ⏳</div>` : ''}<br>
    <button>อิ่มแล้ว 😋</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>{ overlay.remove(); renderDashboard(); });
  document.body.appendChild(overlay);
}

function curePet(){
  const p = activePet();
  if(!p || !p.sick) return;
  if(state.coins < CURE_COST){
    sfx.wrong();
    toast(`ค่ารักษา 🪙${fmtNum(CURE_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญมารักษาน้องนะ!`);
    return;
  }
  state.coins -= CURE_COST;
  p.sick = false; p.sickCause = null;
  p.fedUpTo = currentSlotStart(Date.now());          // หายป่วยแล้วอิ่มมีแรง
  p.heatFrom = (p.type === 'dragon' || heatProtected()) ? null : Date.now();
  p.thirstFrom = state.waterCut ? Date.now() : null; // ยังถูกตัดน้ำอยู่ → เริ่มนับรอบใหม่
  sfx.levelup();
  toast('💊 รักษาหายแล้ว! น้องกลับมาแข็งแรงร่าเริง 🎉');
  saveState();
  renderDashboard();
}

/* ============================================================
   ร้านค้าไอเทมแต่งตัว (ล็อกช่วงแรกเกิด/ไข่ ตามกติกาใหม่)
   ============================================================ */
function renderShop(){
  const wrap = document.getElementById('shop-grid-wrap');
  const p = activePet();
  if(!p){
    wrap.innerHTML = `<div class="lock-banner">🔒 ยังไม่มีสัตว์เลี้ยง — รับน้องจากร้านสัตว์เลี้ยงก่อน แล้วค่อยมาช้อปกันนะ</div>`;
    return;
  }
  if(petStage(p) === 'egg'){
    wrap.innerHTML = `<div class="lock-banner">🔒 น้องยังเป็น${PETS[p.type].startKey==='egg'?'ไข่':'เด็กแรกเกิด'}อยู่ ยังใส่เครื่องแต่งตัวไม่ได้<br>เล่นเกมให้น้องโตถึง Lv.2 ก่อนนะ</div>`;
    return;
  }
  wrap.innerHTML = `<div class="shop-grid" id="shop-grid"></div>`;
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = ITEMS.map(item=>{
    const owned = state.owned.includes(item.id);
    const equipped = p.equipped[item.slot] === item.id;
    const affordable = state.coins >= item.price;
    let cls = 'shop-item', tag = `<span class="it-price">🪙${fmtNum(item.price)}</span>`;
    if(equipped){ cls += ' equipped'; tag = `<span class="it-tag tag-on">ใส่อยู่</span>`; }
    else if(owned){ cls += ' owned'; tag = `<span class="it-tag tag-wear">สวมใส่</span>`; }
    else if(!affordable){ cls += ' locked-price'; }
    return `<div class="${cls}" data-item="${item.id}">
      <span class="it-emoji">${item.emoji}</span>
      <span class="it-name">${item.name}</span>${tag}
    </div>`;
  }).join('');

  grid.querySelectorAll('.shop-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      const item = ITEMS.find(i=>i.id===el.dataset.item);
      const owned = state.owned.includes(item.id);
      if(!owned){
        if(state.coins < item.price){
          sfx.wrong();
          toast(`เหรียญไม่พอ ต้องมี 🪙${fmtNum(item.price)} — ไปเล่นเกมเก็บเหรียญกัน!`);
          return;
        }
        state.coins -= item.price;
        state.owned.push(item.id);
        p.equipped = {head:null, face:null, neck:null};   // ใส่ได้ทีละ 1 ชิ้น
        p.equipped[item.slot] = item.id;                  // ซื้อแล้วใส่ให้ทันที
        sfx.buy();
        toast(`ซื้อ${item.name}สำเร็จ! น้องใส่ให้แล้ว 🥰`);
      }else{
        const wasOn = p.equipped[item.slot] === item.id;
        p.equipped = {head:null, face:null, neck:null};
        if(!wasOn) p.equipped[item.slot] = item.id;
        sfx.select();
      }
      saveState();
      renderDashboard();
    });
  });
}

/* ============================================================
   ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
   ============================================================ */
function homeVisualHTML(h, cls, decayed, dark, nowater){
  // ถูกตัดไฟ: ภาพ _dark / ถูกตัดน้ำ: ภาพ _nowater / เสื่อมสภาพ: ภาพ _decayed
  // ไม่มีภาพใช้ฟิลเตอร์แทน (เฉพาะมืด/หม่น — ตัดน้ำไม่มีฟิลเตอร์ ใช้ tag+กล่องบิลบอก)
  const dImg = (dark && IMG_FILES[`home_${h.id}_dark`])
            || (nowater && IMG_FILES[`home_${h.id}_nowater`])
            || (decayed && IMG_FILES[`home_${h.id}_decayed`]) || null;
  const img = dImg || IMG_FILES[`home_${h.id}`];
  const dCls = dark && !IMG_FILES[`home_${h.id}_dark`] ? ' home-dark-img'
             : (decayed && !dImg ? ' home-decayed-img' : '');
  return img ? `<img class="${cls}${dCls}" src="${img}" alt="${h.name}">`
             : `<span class="${cls} home-emoji${dCls}">${decayed ? '🏚️' : h.emoji}</span>`;
}

/* ฉากบ้านพัง (ค้างค่าบำรุงข้ามเดือน — billTick ตั้ง state.pendingRuin ไว้) */
function showHomeRuined(){
  const h = homeInfo(state.pendingRuin);
  state.pendingRuin = null;
  saveState();
  if(!h) return;
  const img = IMG_FILES[`home_${h.id}_ruined`];
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    <h2>💥 บ้านพังแล้ว!</h2>
    <div class="feed-pet">${img ? `<img src="${img}" alt="">` : '🏚️'}</div>
    <p style="font-size:15px;margin:8px 0">${h.emoji} <b>${h.name}</b> ค้างค่าบำรุงจนสิ้นเดือน<br>
    บ้านเลยทรุดโทรมจนพังทลายลงมา...<br>
    ตอนนี้น้องกลายเป็น<b>ผู้ไม่มีที่อยู่อาศัย</b> 😢<br>ต้องเก็บเหรียญหาซื้อที่พักใหม่นะ</p>
    <button>เข้าใจแล้ว 😢</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>{ overlay.remove(); renderDashboard(); });
  document.body.appendChild(overlay);
}

function renderHomeCard(){
  if(state.pendingRuin) showHomeRuined();
  const el = document.getElementById('home-card');
  const h = homeInfo(state.home);
  const w = weatherNow();
  let body;
  if(!h){
    body = `
      <div class="home-current none">
        <span class="home-emoji">🌳</span>
        <div>
          <b>ยังไม่มีที่พัก</b><br>
          <small>น้องต้องตากแดดตากฝน (ตอนนี้${w.emoji} ${w.name}) — ความร้อนสะสมจะทำให้น้องป่วยทุก 6 ชม.</small>
        </div>
      </div>
      <button class="big-btn blue home-btn" id="btn-home-shop">🏠 หาที่พักให้น้อง (เริ่มต้น 🪙${fmtNum(HOMES[0].price)})</button>`;
  }else{
    const acWorks = h.builtinAC || (h.canAC && state.ac);
    const acState = state.powerCut
      ? (acWorks ? '🔌 ไฟถูกตัด แอร์ใช้ไม่ได้ — น้องร้อนแล้ว!' : '🔌 ไฟถูกตัด บ้านมืดทั้งหลัง')
      : h.builtinAC ? '❄️ มีแอร์ในตัว เย็นสบาย'
      : h.canAC ? (state.ac ? '❄️ ติดแอร์แล้ว เย็นสบาย' : '🥵 ยังไม่มีแอร์ — น้องยังร้อนอยู่')
      : '🥵 ไม่มีผนัง ติดแอร์ไม่ได้ — กันฝนได้ แต่กันร้อนไม่ได้';

    /* ---- บิลค่าบำรุงรายเดือน (0.5% ของราคาบ้าน ออกทุกวันที่ 1) ---- */
    const due = billOutstanding('maint');
    const decayed = homeDecayed();
    const nowD = new Date(Date.now());
    const lastDay = new Date(nowD.getFullYear(), nowD.getMonth()+1, 0).getDate();
    let billUI;
    if(due > 0 && decayed){
      billUI = `<div class="bill-box overdue">🏚️ <b>บ้านทรุดโทรมแล้ว!</b> เพราะค้างค่าบำรุงเกินวันที่ ${DECAY_DAY}<br>
        รีบจ่าย 🪙${fmtNum(due)} ภายในสิ้นเดือน (วันที่ ${lastDay}) ไม่งั้น<b>บ้านจะพัง</b>และไม่มีที่อยู่!</div>
        <button class="big-btn home-btn" id="btn-pay-maint">💸 จ่ายค่าบำรุงบ้าน 🪙${fmtNum(due)}</button>`;
    }else if(due > 0){
      billUI = `<div class="bill-box">📋 <b>บิลค่าบำรุงบ้านเดือนนี้ 🪙${fmtNum(due)}</b><br>
        จ่ายก่อนวันที่ ${DECAY_DAY} ไม่งั้นบ้านจะทรุดโทรม และถ้าค้างถึงสิ้นเดือนบ้านจะพังนะ</div>
        <button class="big-btn home-btn" id="btn-pay-maint">💸 จ่ายค่าบำรุงบ้าน 🪙${fmtNum(due)}</button>`;
    }else if(state.bills.maint && state.bills.maint.due > 0){
      billUI = `<div class="bill-box paid">✅ จ่ายค่าบำรุงเดือนนี้แล้ว — บิลหน้ามาวันที่ 1</div>`;
    }else{
      billUI = `<div class="bill-box paid">🆓 เดือนแรกฟรีค่าบำรุง — ตั้งแต่เดือนหน้า บิล 🪙${fmtNum(maintCost(h.id))}/เดือน มาทุกวันที่ 1</div>`;
    }

    /* ---- บิลสาธารณูปโภครายเดือน (ค่าไฟ/ค่าน้ำ — เน็ตอยู่การ์ดมือถือ) ---- */
    const utilUI = HOME_UTILITIES.map(id=>utilityBillUI(id, h, lastDay)).join('');
    const trashUI = trashBillUI(h, lastDay);
    const trashFine = (billOutstanding('trash') > 0 && state.bills.trash) ? (state.bills.trash.fine || 0) : 0;
    const cutTags = HOME_UTILITIES
      .filter(id=>state[UTILITIES[id].cutKey])
      .map(id=>` <span class="it-tag tag-off">${UTILITY_UI[id].cutName}</span>`).join('')
      + (trashFine > 0 ? ' <span class="it-tag tag-off">ค้างค่าขยะ</span>' : '');

    body = `
      <div class="home-current">
        ${homeVisualHTML(h, 'home-img', decayed, state.powerCut, state.waterCut)}
        <div>
          <b>${h.emoji} ${h.name}</b>${decayed ? ' <span class="it-tag tag-off">ทรุดโทรม</span>' : ''}${cutTags}<br>
          <small>${h.desc}</small><br>
          <small>${acState}</small>
        </div>
      </div>
      ${billUI}
      ${utilUI}
      ${trashUI}
      ${h.canAC && !state.ac ? `<button class="big-btn blue home-btn" id="btn-buy-ac">❄️ ซื้อ+ติดตั้งแอร์ (🪙${fmtNum(AC_PRICE)} + ค่าติดตั้ง 🪙${fmtNum(AC_INSTALL)})</button>` : ''}
      ${state.home !== 'castle' ? `<button class="big-btn purple home-btn" id="btn-home-shop">🏠 อัปเกรดที่พัก</button>` : ''}`;
  }
  el.innerHTML = `<h3 class="shop-title">🏠 ที่พักหลบแดดหลบฝน</h3>${body}`;
  const shopBtn = document.getElementById('btn-home-shop');
  if(shopBtn) shopBtn.addEventListener('click', openHomeShop);
  const acBtn = document.getElementById('btn-buy-ac');
  if(acBtn) acBtn.addEventListener('click', buyAC);
  const payBtn = document.getElementById('btn-pay-maint');
  if(payBtn) payBtn.addEventListener('click', payMaint);
  const payTrashBtn = document.getElementById('btn-pay-trash');
  if(payTrashBtn) payTrashBtn.addEventListener('click', payTrash);
  el.querySelectorAll('.btn-pay-utility').forEach(b=>b.addEventListener('click', ()=>payUtility(b.dataset.u)));
  el.querySelectorAll('.btn-fix-utility').forEach(b=>b.addEventListener('click', ()=>buyUtilityFix(b.dataset.u)));
}

function payMaint(){
  const due = billOutstanding('maint');
  if(due <= 0) return;
  if(state.coins < due){
    sfx.wrong(); toast(`ค่าบำรุงบ้าน 🪙${fmtNum(due)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= due;
  state.bills.maint.paid = state.bills.maint.due;
  sfx.buy();
  toast('💸 จ่ายค่าบำรุงเรียบร้อย! บ้านกลับมาสภาพดีเหมือนเดิม 🏠✨');
  saveState();
  renderDashboard();
}

/* ---- บิลค่าจัดการขยะ (ข้อ 13): ไม่มี cutKey/fixKey เลยไม่เข้าเครื่อง UTILITIES
   ค้างข้ามเดือน → ค่าปรับ +500 ทบสะสม (เก็บใน bills.trash.fine) ไม่ตัด/ไม่พัง ---- */
function trashBillUI(h, lastDay){
  const due = billOutstanding('trash');
  const b = state.bills.trash;
  const fine = b ? (b.fine || 0) : 0;
  if(due > 0){
    const note = fine > 0
      ? `<br><b>⚠️ รวมค่าปรับค้างจ่ายสะสม 🪙${fmtNum(fine)}</b> — โดนปรับเพิ่ม +🪙${fmtNum(TRASH_FINE)} ทุกเดือนที่ยังไม่จ่าย (ขยะไม่ถูกตัด บ้านไม่พังนะ)`
      : `<br>จ่ายภายในสิ้นเดือน (วันที่ ${lastDay}) ไม่งั้นโดน<b>ค่าปรับ +🪙${fmtNum(TRASH_FINE)}</b> เดือนหน้า (แต่ขยะไม่ถูกตัด บ้านไม่พัง)`;
    return `<div class="bill-box${fine > 0 ? ' overdue' : ''}">🗑️ <b>บิลค่าจัดการขยะเดือนนี้ 🪙${fmtNum(due)}</b>${note}</div>
      <button class="big-btn home-btn" id="btn-pay-trash">🗑️ จ่ายค่าจัดการขยะ 🪙${fmtNum(due)}</button>`;
  }
  if(b && b.due > 0){
    return `<div class="bill-box paid">✅ จ่ายค่าจัดการขยะเดือนนี้แล้ว — บิลหน้ามาวันที่ 1</div>`;
  }
  return `<div class="bill-box paid">🆓 เดือนแรกฟรีค่าจัดการขยะ — ตั้งแต่เดือนหน้า บิล 🪙${fmtNum(trashCost(h.id))}/เดือน มาทุกวันที่ 1</div>`;
}

function payTrash(){
  const due = billOutstanding('trash');
  if(due <= 0) return;
  if(state.coins < due){
    sfx.wrong(); toast(`ค่าจัดการขยะ 🪙${fmtNum(due)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= due;
  state.bills.trash.paid = state.bills.trash.due;
  state.bills.trash.fine = 0;               // จ่ายครบ ค่าปรับสะสมหายหมด
  sfx.buy();
  toast('🗑️ จ่ายค่าจัดการขยะเรียบร้อย! เมืองสะอาด ไม่มีค่าปรับค้างแล้ว ✨');
  saveState();
  renderDashboard();
}

/* ============================================================
   บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
   config ข้อความ+ปุ่มต่อชนิด · onRestored = ทำอะไรตอนจ่ายบิลค้างครบแล้วกลับมาใช้ได้
   ============================================================ */
const UTILITY_UI = {
  elec:{
    icon:'⚡', name:'ค่าไฟ', cost: elecCost,
    cutName:'ถูกตัดไฟ', cutIcon:'🔌',
    cutMsg:'บ้านมืดทั้งหลัง แอร์ใช้ไม่ได้ น้องจะร้อนสะสมจนป่วย 🥵',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดไฟ</b> บ้านมืด แอร์ใช้ไม่ได้เลยนะ',
    fixIcon:'⚙️', fixName:'หม้อแปลงใหม่', fixVerb:'ซื้อ', fixCost: TRANSFORMER_COST,
    fixBrokenMsg:'หม้อแปลงพังไปด้วย',
    fixedToast:'⚙️ ได้หม้อแปลงใหม่แล้ว! จ่ายค่าไฟค้างให้ครบ ไฟก็จะกลับมานะ',
    needFixToast:'⚙️ หม้อแปลงพังอยู่ ต้องซื้อหม้อแปลงใหม่ก่อน ถึงจะจ่ายค่าไฟค้างได้นะ',
    paidToast:'⚡ จ่ายค่าไฟเรียบร้อย! เดือนนี้ไฟสว่างสบายใจ ✨',
    restoredToast:'⚡ ไฟกลับมาแล้ว! บ้านสว่าง แอร์กลับมาเย็นฉ่ำ 🎉',
    onRestored(){ if(heatProtected()) for(const p of state.pets) p.heatFrom = null; },
  },
  water:{
    icon:'🚰', name:'ค่าน้ำ', cost: waterCost,
    cutName:'ถูกตัดน้ำ', cutIcon:'🚱',
    cutMsg:'น้องไม่มีน้ำกิน-อาบ ขาดน้ำสะสมจนป่วยได้ (มังกรก็ต้องกินน้ำนะ)',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดน้ำ</b> น้องไม่มีน้ำกิน-อาบเลยนะ',
    fixIcon:'🔧', fixName:'ติดตั้งระบบน้ำใหม่', fixVerb:'จ่ายค่า', fixCost: WATER_INSTALL_COST,
    fixBrokenMsg:'ระบบน้ำเสียหายไปด้วย',
    fixedToast:'🔧 ติดตั้งระบบน้ำใหม่แล้ว! จ่ายค่าน้ำค้างให้ครบ น้ำก็จะไหลนะ',
    needFixToast:'🔧 ระบบน้ำเสียอยู่ ต้องจ่ายค่าติดตั้งระบบน้ำใหม่ก่อน ถึงจะจ่ายค่าน้ำค้างได้นะ',
    paidToast:'🚰 จ่ายค่าน้ำเรียบร้อย! เดือนนี้น้ำไหลสบายใจ ✨',
    restoredToast:'🚰 น้ำกลับมาไหลแล้ว! น้องมีน้ำกิน-อาบ สดชื่นสุดๆ 🎉',
    onRestored(){ for(const p of state.pets) p.thirstFrom = null; },
  },
  net:{
    icon:'📶', name:'ค่าเน็ต', cost: netCost,
    cutName:'ถูกตัดเน็ต', cutIcon:'📵',
    cutMsg:'มือถือใช้เน็ตไม่ได้ <b>โบนัสจับคู่ +5 เหรียญ/ข้อ ถูกระงับ</b> จนกว่าจะจ่ายครบ',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดเน็ต</b> โบนัสมือถือ +5/ข้อ หายไปเลยนะ',
    // ไม่มี fixKey — จ่ายบิลค้างได้เลย ไม่ต้องซื้ออุปกรณ์ใหม่
    paidToast:'📶 จ่ายค่าเน็ตเรียบร้อย! เดือนนี้เน็ตแรงเต็มสปีด ✨',
    restoredToast:'📶 เน็ตกลับมาแล้ว! โบนัสมือถือ +5/ข้อ ใช้ได้เหมือนเดิม 🎉',
    onRestored(){},
  },
  data:{
    icon:'📡', name:'ค่าบริการข้อมูล', cost: dataCost,
    cutName:'ถูกตัดบริการข้อมูล', cutIcon:'🔇',
    cutMsg:'คอมพิวเตอร์ออนไลน์ไม่ได้ <b>รายได้ +0.01 เหรียญ/วิ หยุดนิ่ง</b> จนกว่าจะจ่ายครบ 5,000',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดบริการข้อมูล</b> รายได้จากคอมหยุดเดินเลยนะ',
    // ไม่มี fixKey — จ่ายบิลค้างได้เลย
    paidToast:'📡 จ่ายค่าบริการข้อมูลเรียบร้อย! คอมออนไลน์ทำเงินต่อ ✨',
    restoredToast:'📡 บริการข้อมูลกลับมาแล้ว! เหรียญกลับมาเพิ่ม +0.01/วิ เหมือนเดิม 🎉',
    onRestored(){ state.compSince = Date.now(); },   // เริ่มเดินเข็มรายได้ใหม่ตั้งแต่ตอนนี้
  },
};

function utilityBillUI(id, h, lastDay){
  const u = UTILITY_UI[id], reg = UTILITIES[id];
  const due = billOutstanding(id);
  const cut = state[reg.cutKey], fixed = reg.fixKey ? state[reg.fixKey] : true;
  if(cut){
    return `<div class="bill-box overdue">${u.cutIcon} <b>${u.cutName}แล้ว!</b> เพราะค้าง${u.name}จนสิ้นเดือน<br>
      ${u.cutMsg}<br>
      ${fixed
        ? `${reg.fixKey ? `${u.fixIcon} ${u.fixName}พร้อมแล้ว — ` : ''}จ่าย${u.name}ค้าง 🪙${fmtNum(due)} ให้กลับมาใช้ได้!`
        : `${u.fixBrokenMsg} ต้อง${u.fixVerb}<b>${u.fixName} 🪙${fmtNum(u.fixCost)}</b>ก่อน จึงจะจ่าย${u.name}ค้าง 🪙${fmtNum(due)} ได้`}</div>
      ${fixed
        ? `<button class="big-btn home-btn btn-pay-utility" data-u="${id}">${u.icon} จ่าย${u.name}ค้าง 🪙${fmtNum(due)}</button>`
        : `<button class="big-btn home-btn btn-fix-utility" data-u="${id}">${u.fixIcon} ${u.fixVerb}${u.fixName} 🪙${fmtNum(u.fixCost)}</button>`}`;
  }
  if(due > 0){
    return `<div class="bill-box">${u.icon} <b>บิล${u.name}เดือนนี้ 🪙${fmtNum(due)}</b><br>
      จ่ายภายในสิ้นเดือน (วันที่ ${lastDay}) ${u.warnMsg}</div>
      <button class="big-btn home-btn btn-pay-utility" data-u="${id}">${u.icon} จ่าย${u.name} 🪙${fmtNum(due)}</button>`;
  }
  if(state.bills[id] && state.bills[id].due > 0){
    return `<div class="bill-box paid">✅ จ่าย${u.name}เดือนนี้แล้ว — บิลหน้ามาวันที่ 1</div>`;
  }
  return `<div class="bill-box paid">🆓 เดือนแรกฟรี${u.name} — ตั้งแต่เดือนหน้า บิล${u.name} 🪙${fmtNum(u.cost(h && h.id))}/เดือน มาทุกวันที่ 1</div>`;
}

function payUtility(id){
  const u = UTILITY_UI[id], reg = UTILITIES[id];
  const due = billOutstanding(id);
  if(due <= 0) return;
  if(state[reg.cutKey] && reg.fixKey && !state[reg.fixKey]){
    sfx.wrong(); toast(u.needFixToast); return;
  }
  if(state.coins < due){
    sfx.wrong(); toast(`${u.name} 🪙${fmtNum(due)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= due;
  state.bills[id].paid = state.bills[id].due;
  if(state[reg.cutKey]){
    state[reg.cutKey] = false;
    state[reg.fixKey] = false;
    u.onRestored();
    sfx.levelup();
    toast(u.restoredToast);
  }else{
    sfx.buy();
    toast(u.paidToast);
  }
  saveState();
  renderDashboard();
}

function buyUtilityFix(id){
  const u = UTILITY_UI[id], reg = UTILITIES[id];
  if(!reg.fixKey || !state[reg.cutKey] || state[reg.fixKey]) return;
  if(state.coins < u.fixCost){
    sfx.wrong(); toast(`${u.fixName} 🪙${fmtNum(u.fixCost)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= u.fixCost;
  state[reg.fixKey] = true;
  sfx.buy();
  toast(u.fixedToast);
  saveState();
  renderDashboard();
}

/* ============================================================
   การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
   โบนัสจับคู่ +5 เหรียญ/ข้อ · ค่าเน็ต 1,000/เดือน (บิล id 'net')
   ============================================================ */
function renderPhoneCard(){
  const el = document.getElementById('phone-card');
  if(!el) return;
  let body;
  if(!state.phone){
    body = `
      <div class="home-current none">
        <span class="home-emoji">📱</span>
        <div>
          <b>ยังไม่มีมือถือ</b><br>
          <small>มีมือถือแล้วเกมจับคู่ได้โบนัส <b>+${PHONE_BONUS} เหรียญ/ข้อ</b>!<br>
          ค่าเน็ต 🪙${fmtNum(NET_FEE)}/เดือน (จ่ายทุกวันที่ 1 · เดือนแรกฟรี) · ขายคืนได้ 🪙${fmtNum(PHONE_SELL)}</small>
        </div>
      </div>
      <button class="big-btn blue home-btn" id="btn-buy-phone">📱 ซื้อมือถือ 🪙${fmtNum(PHONE_PRICE)}</button>`;
  }else{
    const nowD = new Date(Date.now());
    const lastDay = new Date(nowD.getFullYear(), nowD.getMonth()+1, 0).getDate();
    const bonusState = state.netCut
      ? `<span class="it-tag tag-off">ถูกตัดเน็ต</span> โบนัส +${PHONE_BONUS}/ข้อ ถูกระงับ 📵`
      : `✨ โบนัสจับคู่ <b>+${PHONE_BONUS} เหรียญ/ข้อ</b> ทำงานอยู่`;
    body = `
      <div class="home-current">
        <span class="home-emoji">${state.netCut ? '📵' : '📱'}</span>
        <div>
          <b>มือถือของหนู</b><br>
          <small>${bonusState}</small>
        </div>
      </div>
      ${utilityBillUI('net', null, lastDay)}
      <button class="big-btn purple home-btn" id="btn-sell-phone">💸 ขายคืนมือถือ 🪙${fmtNum(PHONE_SELL)}</button>`;
  }
  el.innerHTML = `<h3 class="shop-title">📱 มือถือ</h3>${body}`;
  const buyBtn = document.getElementById('btn-buy-phone');
  if(buyBtn) buyBtn.addEventListener('click', buyPhone);
  const sellBtn = document.getElementById('btn-sell-phone');
  if(sellBtn) sellBtn.addEventListener('click', sellPhone);
  el.querySelectorAll('.btn-pay-utility').forEach(b=>b.addEventListener('click', ()=>payUtility(b.dataset.u)));
}

function buyPhone(){
  if(state.phone) return;
  if(state.coins < PHONE_PRICE){
    sfx.wrong(); toast(`มือถือ 🪙${fmtNum(PHONE_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>📱 ซื้อมือถือ</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(PHONE_PRICE)}</b><br>
    เกมจับคู่ได้โบนัส +${PHONE_BONUS} เหรียญ/ข้อ<br>
    <small>📶 ค่าเน็ต 🪙${fmtNum(NET_FEE)}/เดือน จ่ายทุกวันที่ 1 (เดือนแรกฟรี)<br>ค้างถึงสิ้นเดือนจะถูกตัดเน็ต โบนัสหายนะ</small></p>`,
    'ซื้อเลย!', ()=>{
      state.coins -= PHONE_PRICE;
      state.phone = true;
      state.netCut = false;
      state.bills.net = {month: ymStr(Date.now()), due: 0, paid: 0};   // เดือนแรกฟรี
      sfx.buy();
      toast(`📱 ได้มือถือแล้ว! จับคู่ถูกรับเพิ่ม +${PHONE_BONUS} เหรียญทุกข้อ 🎉`);
      saveState();
      renderDashboard();
    });
}

function sellPhone(){
  if(!state.phone) return;
  askConfirm(`<h2>💸 ขายคืนมือถือ</h2>
    <p style="font-size:15px;margin:6px 0">ได้เงินคืน <b>🪙${fmtNum(PHONE_SELL)}</b><br>
    <small>โบนัสจับคู่ +${PHONE_BONUS}/ข้อ จะหายไป และบิลเน็ตถูกยกเลิก</small></p>`,
    'ขายเลย', ()=>{
      state.phone = false;
      state.netCut = false;
      delete state.bills.net;
      addCoins(PHONE_SELL);
      sfx.buy();
      toast(`💸 ขายมือถือแล้ว ได้เงินคืน 🪙${fmtNum(PHONE_SELL)}`);
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
   รายได้ +0.01 เหรียญ/วิ (โชว์ตัวเลขวิ่งสด) · ค่าบริการข้อมูล 5,000/เดือน (บิล id 'data')
   ============================================================ */
function compLiveTotal(){   // รายได้สะสมจากคอม รวมเศษที่ยังไม่ตกเป็นเหรียญเต็ม
  let v = state.compEarned;
  if(state.computer && !state.dataCut && state.compSince != null)
    v += (Date.now() - state.compSince)/1000 * COMP_RATE;
  return v;
}

function renderComputerCard(){
  const el = document.getElementById('computer-card');
  if(!el) return;
  let body;
  if(!state.computer){
    body = `
      <div class="home-current none">
        <span class="home-emoji">💻</span>
        <div>
          <b>ยังไม่มีคอมพิวเตอร์</b><br>
          <small>มีคอมแล้วเหรียญเพิ่มเอง <b>+${COMP_RATE} เหรียญ/วินาที</b> ตลอดเวลา!<br>
          📡 ค่าบริการข้อมูล 🪙${fmtNum(DATA_FEE)}/เดือน (จ่ายทุกวันที่ 1 · เดือนแรกฟรี) · ขายคืนได้ 🪙${fmtNum(COMP_SELL)}</small>
        </div>
      </div>
      <button class="big-btn blue home-btn" id="btn-buy-comp">💻 ซื้อคอมพิวเตอร์ 🪙${fmtNum(COMP_PRICE)}</button>`;
  }else{
    const nowD = new Date(Date.now());
    const lastDay = new Date(nowD.getFullYear(), nowD.getMonth()+1, 0).getDate();
    body = `
      <div class="comp-earn ${state.dataCut ? 'off' : ''}">
        <div class="comp-earn-label">${state.dataCut ? '🔇 รายได้หยุดนิ่ง (ถูกตัดบริการข้อมูล)' : '💻 คอมกำลังทำเงินให้หนู +'+COMP_RATE+' เหรียญ/วินาที'}</div>
        <div class="comp-earn-num" id="comp-live">${compLiveTotal().toFixed(2)}</div>
        <div class="comp-earn-sub">เหรียญที่คอมหามาได้ทั้งหมด</div>
      </div>
      ${utilityBillUI('data', null, lastDay)}
      <button class="big-btn purple home-btn" id="btn-sell-comp">💸 ขายคืนคอมพิวเตอร์ 🪙${fmtNum(COMP_SELL)}</button>`;
  }
  el.innerHTML = `<h3 class="shop-title">💻 คอมพิวเตอร์</h3>${body}`;
  const buyBtn = document.getElementById('btn-buy-comp');
  if(buyBtn) buyBtn.addEventListener('click', buyComputer);
  const sellBtn = document.getElementById('btn-sell-comp');
  if(sellBtn) sellBtn.addEventListener('click', sellComputer);
  el.querySelectorAll('.btn-pay-utility').forEach(b=>b.addEventListener('click', ()=>payUtility(b.dataset.u)));
}

function buyComputer(){
  if(state.computer) return;
  if(state.coins < COMP_PRICE){
    sfx.wrong(); toast(`คอมพิวเตอร์ 🪙${fmtNum(COMP_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>💻 ซื้อคอมพิวเตอร์</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(COMP_PRICE)}</b><br>
    เหรียญเพิ่มเอง +${COMP_RATE}/วินาที ตลอดเวลา (≈ 864 เหรียญ/วัน)<br>
    <small>📡 ค่าบริการข้อมูล 🪙${fmtNum(DATA_FEE)}/เดือน จ่ายทุกวันที่ 1 (เดือนแรกฟรี)<br>ค้างถึงสิ้นเดือนถูกตัดบริการ รายได้หยุดนะ</small></p>`,
    'ซื้อเลย!', ()=>{
      state.coins -= COMP_PRICE;
      state.computer = true;
      state.compSince = Date.now();
      state.dataCut = false;
      state.bills.data = {month: ymStr(Date.now()), due: 0, paid: 0};   // เดือนแรกฟรี
      sfx.buy();
      toast(`💻 ได้คอมพิวเตอร์แล้ว! เหรียญกำลังเพิ่มขึ้นเองทุกวินาที 🎉`);
      saveState();
      renderDashboard();
    });
}

function sellComputer(){
  if(!state.computer) return;
  askConfirm(`<h2>💸 ขายคืนคอมพิวเตอร์</h2>
    <p style="font-size:15px;margin:6px 0">ได้เงินคืน <b>🪙${fmtNum(COMP_SELL)}</b><br>
    <small>รายได้ +${COMP_RATE}/วิ จะหายไป และบิลค่าบริการข้อมูลถูกยกเลิก</small></p>`,
    'ขายเลย', ()=>{
      careTick();                        // ตกรายได้ค้างให้ครบก่อนขาย
      state.computer = false;
      state.compSince = null;
      state.dataCut = false;
      delete state.bills.data;
      addCoins(COMP_SELL);
      sfx.buy();
      toast(`💸 ขายคอมพิวเตอร์แล้ว ได้เงินคืน 🪙${fmtNum(COMP_SELL)}`);
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
   ตามเวลาของมัน · ครบเวลาแล้วเก็บขายได้ · ขายแล้วต้นไม่หาย เริ่ม
   ออกผลรอบใหม่ทันที (plantedAt=now) · นาฬิกานับถอยหลังต่อต้น
   ============================================================ */
function fruitCountdown(ms){                      // ตัวเลขนับถอยหลังแบบ วัน/ชม./นาที/วิ
  const totalSec = Math.ceil(ms/1000);
  const d = Math.floor(totalSec/86400);
  const h = Math.floor((totalSec%86400)/3600);
  const m = Math.floor((totalSec%3600)/60);
  const s = totalSec%60;
  if(d > 0) return `${d} วัน ${h} ชม. ${m} นาที`;
  if(h > 0) return `${h} ชม. ${m} นาที ${s} วิ`;
  if(m > 0) return `${m} นาที ${s} วิ`;
  return `${s} วิ`;
}

function renderFarmCard(){
  const el = document.getElementById('farm-card');
  if(!el) return;
  const now = Date.now();
  const shop = FRUITS.map(f=>`
    <button class="farm-buy-btn" data-fruit="${f.id}">
      <span class="farm-buy-emoji">${f.emoji}</span>
      <span>ปลูก${f.name} 🪙${fmtNum(f.price)}
        <small>โตใน ${f.growDays} วัน · เก็บขายผลได้ 🪙${fmtNum(f.sell)} (ขายแล้วออกผลใหม่เรื่อยๆ)</small>
      </span>
    </button>`).join('');

  let list, sig = '';
  if(state.farm.length){
    let readyCount = 0, readyTotal = 0;
    const rows = state.farm.map((t,i)=>{
      const f = fruitInfo(t.id);
      const left = fruitMsLeft(t, now);
      const ready = left <= 0;
      sig += ready ? '1' : '0';
      if(ready){ readyCount++; readyTotal += f.sell; }
      const status = ready
        ? '✅ ผลสุกแล้ว! เก็บขายได้เลย'
        : '⏳ อีก ' + fruitCountdown(left);
      const action = ready
        ? `<button class="farm-sell-btn" data-tree="${i}">เก็บขาย 🪙${fmtNum(f.sell)}</button>`
        : `<div class="farm-grow-badge">🌱 กำลังโต</div>`;
      return `<div class="farm-tree ${ready ? 'ready' : ''}">
        <span class="farm-tree-emoji">${f.emoji}</span>
        <div class="farm-tree-info">
          <b>${f.name}</b>
          <div class="farm-tree-status" id="farm-time-${i}">${status}</div>
        </div>
        ${action}
      </div>`;
    }).join('');
    // ปุ่มรวบ: โผล่เมื่อมีต้นสุกตั้งแต่ 2 ต้นขึ้นไป (ต้นเดียวใช้ปุ่มของมันเองได้อยู่แล้ว)
    const sellAll = readyCount >= 2
      ? `<button class="farm-sellall-btn" id="btn-farm-sellall">🧺 เก็บขายทั้งหมดที่สุกแล้ว (${readyCount} ต้น) 🪙${fmtNum(readyTotal)}</button>`
      : '';
    list = sellAll + '<div class="farm-list">' + rows + '</div>';
  }else{
    list = `<div class="home-current none">
      <span class="home-emoji">🌱</span>
      <div><b>สวนยังว่างอยู่</b><br>
        <small>ซื้อต้นไม้มาปลูก รอผลสุกแล้วเก็บขายได้เงิน — ลงทุนครั้งเดียวเก็บผลได้เรื่อยๆ!</small>
      </div>
    </div>`;
  }

  el.innerHTML = `<h3 class="shop-title">🌳 สวนผลไม้</h3>
    <div class="farm-shop">${shop}</div>
    ${list}`;
  el.dataset.readysig = sig;
  el.querySelectorAll('.farm-buy-btn').forEach(b=>b.addEventListener('click', ()=>buyFruit(b.dataset.fruit)));
  el.querySelectorAll('.farm-sell-btn').forEach(b=>b.addEventListener('click', ()=>sellFruit(+b.dataset.tree)));
  const sellAllBtn = document.getElementById('btn-farm-sellall');
  if(sellAllBtn) sellAllBtn.addEventListener('click', sellAllFruit);
}

/* อัปเดตนาฬิกานับถอยหลังต่อต้นทุกวินาที (เรียกจาก renderClock) */
function renderFarmClock(){
  const el = document.getElementById('farm-card');
  if(!el || !state.farm || !state.farm.length) return;
  const now = Date.now();
  let sig = '';
  state.farm.forEach((t,i)=>{
    const left = fruitMsLeft(t, now);
    sig += left <= 0 ? '1' : '0';
    if(left > 0){
      const tEl = document.getElementById('farm-time-'+i);
      if(tEl) tEl.textContent = '⏳ อีก ' + fruitCountdown(left);
    }
  });
  if(el.dataset.readysig !== sig) renderFarmCard();   // มีต้นสุกใหม่ → สร้างการ์ดใหม่ให้ปุ่มขายโผล่
}

function buyFruit(id){
  const f = fruitInfo(id);
  if(!f) return;
  if(state.coins < f.price){
    sfx.wrong(); toast(`ปลูก${f.name} 🪙${fmtNum(f.price)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>${f.emoji} ปลูก${f.name}</h2>
    <p style="font-size:15px;margin:6px 0">ราคาต้น <b>🪙${fmtNum(f.price)}</b><br>
    โตเต็มที่ใน <b>${f.growDays} วัน</b> แล้วเก็บขายผลได้ <b>🪙${fmtNum(f.sell)}</b><br>
    <small>🌱 ขายแล้วต้นไม่หาย เริ่มออกผลรอบใหม่ทันที เก็บขายได้เรื่อยๆ</small></p>`,
    'ปลูกเลย!', ()=>{
      state.coins -= f.price;
      state.farm.push({id: f.id, plantedAt: Date.now()});
      sfx.buy();
      toast(`${f.emoji} ปลูก${f.name}เรียบร้อย! อีก ${f.growDays} วันมาเก็บผลกันนะ 🎉`);
      saveState();
      renderDashboard();
    });
}

function sellFruit(i){
  const t = state.farm[i];
  if(!t) return;
  const f = fruitInfo(t.id);
  if(fruitMsLeft(t, Date.now()) > 0){       // ยังไม่สุก (อาจกดพร้อมนาฬิกาพอดี) — กันพลาด
    sfx.wrong(); toast('ผลยังไม่สุกนะ รออีกนิดหนึ่ง 🌱'); renderFarmCard(); return;
  }
  addCoins(f.sell);
  t.plantedAt = Date.now();                 // เริ่มออกผลรอบใหม่ทันที ต้นเดิมไม่หาย
  sfx.buy();
  floatFx(`+🪙${fmtNum(f.sell)}`);
  toast(`${f.emoji} เก็บ${f.name}ขายได้ 🪙${fmtNum(f.sell)}! ต้นเริ่มออกผลรอบใหม่แล้ว 🌱`);
  saveState();
  renderDashboard();
}

/* เก็บขายทุกต้นที่สุกแล้วรวดเดียว — ต้นที่ขายเริ่มออกผลรอบใหม่ทันที (ต้นที่ยังไม่สุกไม่ยุ่ง) */
function sellAllFruit(){
  const now = Date.now();
  let count = 0, total = 0;
  for(const t of state.farm){
    if(fruitMsLeft(t, now) > 0) continue;
    const f = fruitInfo(t.id);
    addCoins(f.sell);
    total += f.sell; count++;
    t.plantedAt = now;                        // เริ่มออกผลรอบใหม่ทันที ต้นเดิมไม่หาย
  }
  if(!count){ sfx.wrong(); toast('ยังไม่มีต้นไหนสุกเลยนะ รออีกนิด 🌱'); renderFarmCard(); return; }
  sfx.buy();
  floatFx(`+🪙${fmtNum(total)}`);
  toast(`🧺 เก็บผลสุก ${count} ต้นขายรวดเดียว ได้ 🪙${fmtNum(total)}! ทุกต้นออกผลรอบใหม่แล้ว 🌱`);
  saveState();
  renderDashboard();
}

/* ============================================================
   สินค้าสะสมฟุ่มเฟือย + ตลาดซื้อขายต่อ (Global Trade HQ ในเครื่อง)
   - ตลาดซื้อ: ประกาศขายจากผู้เล่นจำลอง สุ่ม deterministic หมุนทุก 10 นาที
     + dropdown ค้นหาสินค้าที่อยากได้ · ซื้อแล้วเปิดภาพใหญ่ (คล้ายฉากอัปแรงค์)
   - คลังของฉัน: ของสะสมที่มี → ตั้งราคาขายเอง · ลูกค้าจำลองมาซื้อตามเวลา (marketTick)
   หมายเหตุ: ผู้ซื้อ-ขายเป็น "จำลอง" (ยังไม่มี backend) — เฟส 2 ค่อยต่อ Firebase
   ============================================================ */
function collectImg(id){ return IMG_FILES[`collect_${id}`] || null; }

/* สร้าง seed ของรอบตลาด (เปลี่ยนทุก 10 นาที + ต่างกันตามตัวกรอง) */
function marketSeed(filterId){
  const slot = Math.floor(Date.now()/MARKET_ROTATE_MS);
  let h = 0;
  for(const ch of (filterId || 'all')) h = (h*31 + ch.charCodeAt(0)) >>> 0;
  return (Math.imul(slot, 7919) ^ h) >>> 0;
}
/* ประกาศขายจากผู้เล่นจำลอง — เลือกตัวกรองแล้วสร้างเฉพาะสินค้านั้น (ค้นหาเจอเสมอ) */
function marketListings(filterId){
  const rnd = seededRand(marketSeed(filterId));
  const specific = filterId && filterId !== 'all';
  const pool = specific ? [collectInfo(filterId)] : COLLECTIBLES;
  const count = specific ? 5 : 8;
  const out = [];
  for(let i=0;i<count;i++){
    const item = pool.length === 1 ? pool[0] : pool[Math.floor(rnd()*pool.length)];
    const seller = ONLINE_NAMES[Math.floor(rnd()*ONLINE_NAMES.length)];
    const mult = 0.6 + rnd()*0.8;                              // 0.6–1.4 เท่าของราคาฐาน
    const price = Math.max(100, Math.round(item.price*mult/100)*100);   // ปัดหลักร้อย
    out.push({sig:`${i}`, id:item.id, seller:seller.n, grade:seller.g, price});
  }
  out.sort((a,b)=>a.price - b.price);                          // เรียงถูก → แพง
  return out;
}

function renderCollectCard(){
  const el = document.getElementById('collect-card');
  if(!el) return;
  const slot = Math.floor(Date.now()/MARKET_ROTATE_MS);
  if(marketBoughtSlot !== slot){ marketBought.clear(); marketBoughtSlot = slot; }   // รอบใหม่ = สต๊อกใหม่

  /* กล่องแจ้ง "ขายของสำเร็จ" (ลูกค้าจำลองมาซื้อของที่เราลงขาย) */
  let soldUI = '';
  if(state.tradeSold.length){
    const total = state.tradeSold.reduce((s,x)=>s + x.price, 0);
    const items = state.tradeSold.slice().reverse().map(x=>{
      const c = collectInfo(x.id);
      return `<li>${c ? c.emoji+' '+c.name : x.id} — 🪙${fmtNum(x.price)}</li>`;
    }).join('');
    soldUI = `<div class="mkt-sold">📬 <b>ขายของสะสมได้ ${state.tradeSold.length} ชิ้น!</b> รับเงินรวม 🪙${fmtNum(total)}
      <ul>${items}</ul>
      <button id="mkt-sold-ok">รับทราบ ✅</button></div>`;
  }

  const body = collectView === 'mine' ? renderCollectMine() : renderCollectShop();
  el.innerHTML = `<h3 class="shop-title">🏆 สินค้าสะสม &amp; ตลาดซื้อขาย</h3>
    <p class="collect-sub">ของเล่นสุดหรูซื้อสะสม โชว์ภาพใหญ่ตอนได้มา · ตั้งราคาขายต่อเองได้แบบตลาดโลก 🌍</p>
    ${soldUI}
    <div class="mkt-tabs">
      <button class="mkt-tab ${collectView==='shop'?'on':''}" data-v="shop">🛒 ตลาดซื้อ</button>
      <button class="mkt-tab ${collectView==='mine'?'on':''}" data-v="mine">🎁 คลังของฉัน${state.collection.length?` (${state.collection.length})`:''}</button>
    </div>
    ${body}`;

  el.querySelectorAll('.mkt-tab').forEach(b=>b.addEventListener('click', ()=>{
    collectView = b.dataset.v; sfx.select(); renderCollectCard();
  }));
  const soldOk = document.getElementById('mkt-sold-ok');
  if(soldOk) soldOk.addEventListener('click', ()=>{ state.tradeSold = []; saveState(); renderCollectCard(); });
  const filt = document.getElementById('mkt-filter');
  if(filt) filt.addEventListener('change', ()=>{ marketFilter = filt.value; sfx.select(); renderCollectCard(); });
  el.querySelectorAll('.mkt-buy').forEach(b=>b.addEventListener('click',
    ()=>buyFromMarket(b.dataset.sig, b.dataset.id, +b.dataset.price)));
  el.querySelectorAll('.cc-list-btn').forEach(b=>b.addEventListener('click', ()=>openListDialog(b.dataset.id)));
  el.querySelectorAll('.ml-cancel').forEach(b=>b.addEventListener('click', ()=>cancelListing(+b.dataset.i)));
}

/* ---- มุมมอง "ตลาดซื้อ": dropdown ค้นหา + รายการประกาศขาย ---- */
function renderCollectShop(){
  const opts = `<option value="all">🔍 ทุกสินค้า</option>` +
    COLLECTIBLES.map(c=>`<option value="${c.id}" ${marketFilter===c.id?'selected':''}>${c.emoji} ${c.name}</option>`).join('');
  const listings = marketListings(marketFilter).filter(l=>!marketBought.has(l.sig));
  const rows = listings.length ? listings.map(l=>{
    const c = collectInfo(l.id), tier = COLLECT_TIERS[c.tier], img = collectImg(l.id);
    const ratio = l.price / c.price;
    const diff = Math.round((1 - ratio)*100);
    const diffTxt = diff >= 5 ? ` <small class="mkt-price-lo">(ถูกกว่าปกติ ${diff}%)</small>`
                  : diff <= -5 ? ` <small class="mkt-price-hi">(แพงกว่าปกติ ${-diff}%)</small>` : '';
    const priceCls = ratio < 0.95 ? 'mkt-price-lo' : ratio > 1.1 ? 'mkt-price-hi' : '';
    const afford = state.coins >= l.price;
    return `<div class="mkt-row">
      <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
      <div class="mkt-info"><b>${c.name}</b> <span class="mkt-tier-stars" style="color:${tier.color}">${tier.stars}</span>${diffTxt}<br>
        <small>👤 ${l.seller} · ชั้น ${l.grade}</small></div>
      <button class="mkt-buy ${afford?'':'cant'}" data-sig="${l.sig}" data-id="${l.id}" data-price="${l.price}">
        <span class="${priceCls}">🪙${fmtNum(l.price)}</span><br>ซื้อ</button>
    </div>`;
  }).join('') : `<div class="mkt-empty">ยังไม่มีประกาศขายสินค้านี้ตอนนี้ — ลองเลือกสินค้าอื่น หรือรออีกสักครู่นะ 🕐</div>`;
  return `<select class="mkt-filter" id="mkt-filter">${opts}</select>${rows}`;
}

/* ---- มุมมอง "คลังของฉัน": ของสะสม (ตั้งขายได้) + รายการที่กำลังลงขาย ---- */
function renderCollectMine(){
  const counts = {};
  for(const id of state.collection) counts[id] = (counts[id]||0) + 1;
  const ids = COLLECTIBLES.map(c=>c.id).filter(id=>counts[id]);
  let ownedUI;
  if(ids.length){
    ownedUI = `<div class="collect-grid">` + ids.map(id=>{
      const c = collectInfo(id), tier = COLLECT_TIERS[c.tier], img = collectImg(id);
      return `<div class="collect-cell" style="border-color:${tier.color}">
        <div class="cc-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</div>
        <div class="cc-name">${c.name}</div>
        <span class="cc-count" style="color:${tier.color}">${tier.stars} ×${counts[id]}</span>
        <button class="cc-list-btn" data-id="${id}">🏷️ ตั้งราคาขาย</button>
      </div>`;
    }).join('') + `</div>`;
  }else{
    ownedUI = `<div class="mkt-empty">คลังยังว่างอยู่ — ไปช้อปที่ <b>🛒 ตลาดซื้อ</b> กันเถอะ!<br>ซื้อของสะสมแล้วเก็บไว้ ขายต่อทำกำไรได้ 💰</div>`;
  }
  let listUI = '';
  if(state.listings.length){
    listUI = `<div class="mkt-listhead">🏷️ กำลังลงขายอยู่ (${state.listings.length} ชิ้น)</div>` +
      state.listings.map((l,i)=>{
        const c = collectInfo(l.id), img = collectImg(l.id);
        const st = listingStatus(l.price / c.price);
        return `<div class="mkt-listing">
          <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
          <div class="mkt-info"><b>${c.name}</b> · ตั้งขาย 🪙${fmtNum(l.price)}<br>
            <small style="color:${st.c}">${st.t}</small></div>
          <button class="ml-cancel" data-i="${i}">ยกเลิก</button>
        </div>`;
      }).join('');
  }
  return ownedUI + listUI;
}

function buyFromMarket(sig, id, price){
  const c = collectInfo(id);
  if(!c) return;
  if(state.coins < price){
    sfx.wrong();
    toast(`เหรียญไม่พอ ต้องมี 🪙${fmtNum(price)} — ไปเล่นเกมเก็บเหรียญกัน!`);
    return;
  }
  state.coins -= price;
  state.collection.push(id);
  marketBought.add(sig);
  sfx.buy();
  saveState();
  showCollectReveal(id, price);      // เปิดภาพใหญ่ฉลอง (กดปิดแล้ว renderDashboard)
}

/* กล่องตั้งราคาขายเอง (พิมพ์ราคา + โชว์สถานะราคาสด) */
function openListDialog(id){
  const c = collectInfo(id);
  if(!c || !state.collection.includes(id)) return;
  sfx.select();
  const img = collectImg(id);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box list-dialog">
    <h2>🏷️ ตั้งราคาขาย</h2>
    <div class="ld-pic">${img?`<img src="${img}" alt="">`:`<span>${c.emoji}</span>`}</div>
    <div class="ld-name">${c.name}</div>
    <p class="ld-note">ราคาปกติของชิ้นนี้ 🪙${fmtNum(c.price)}<br>ตั้งถูกกว่าปกติ = ลูกค้าซื้อไว · ตั้งแพงเกินไป = ไม่มีคนซื้อ</p>
    <div class="ld-input">🪙 <input type="number" id="list-price" value="${c.price}" min="1" step="100"></div>
    <div class="list-hint" id="list-hint"></div>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:14px">
      <button class="cf-no" style="background:#b8a8cc;box-shadow:0 4px 0 #96859f">ยกเลิก</button>
      <button class="cf-ok">🏷️ ลงขายเลย</button>
    </div>
  </div>`;
  const input = overlay.querySelector('#list-price');
  const hint = overlay.querySelector('#list-hint');
  const upd = ()=>{
    const v = +input.value;
    if(!v || v <= 0){ hint.textContent = 'ใส่ราคามากกว่า 0 นะ'; hint.style.color = '#c0392b'; return; }
    const st = listingStatus(v / c.price);
    hint.textContent = st.t; hint.style.color = st.c;
  };
  input.addEventListener('input', upd); upd();
  overlay.querySelector('.cf-no').addEventListener('click', ()=>overlay.remove());
  overlay.querySelector('.cf-ok').addEventListener('click', ()=>{
    const price = Math.round(+input.value);
    if(!price || price <= 0){ sfx.wrong(); toast('ใส่ราคาที่มากกว่า 0 นะ'); return; }
    const idx = state.collection.indexOf(id);
    if(idx < 0){ overlay.remove(); return; }
    state.collection.splice(idx, 1);
    state.listings.push({id, price, listedAt: Date.now()});
    overlay.remove();
    sfx.buy();
    toast(`🏷️ ลงขาย${c.name} 🪙${fmtNum(price)} แล้ว! รอลูกค้ามาซื้อได้เลย`);
    saveState();
    renderDashboard();
  });
  document.body.appendChild(overlay);
}

function cancelListing(i){
  const l = state.listings[i];
  if(!l) return;
  const c = collectInfo(l.id);
  state.listings.splice(i, 1);
  state.collection.push(l.id);
  sfx.select();
  toast(`เก็บ${c ? c.name : 'สินค้า'}กลับเข้าคลังแล้ว`);
  saveState();
  renderDashboard();
}

/* ฉากเปิดภาพใหญ่ตอนได้ของสะสมใหม่ (สไตล์เดียวกับฉากอัปแรงค์ ใช้สีตามระดับ) */
function showCollectReveal(id, price){
  const c = collectInfo(id), tier = COLLECT_TIERS[c.tier];
  sfx.rankup();
  const img = collectImg(id);
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:${tier.color}"></div>
    <div class="rankup-content">
      <div class="rankup-title">🎁 ได้ของสะสมใหม่!</div>
      <div class="collect-reveal-frame" style="--rank-color:${tier.color}">
        ${img ? `<img class="collect-reveal-img" src="${img}" alt="">` : `<span class="cr-emoji">${c.emoji}</span>`}
      </div>
      <div class="rankup-name" style="color:${tier.color}">${c.name}</div>
      <div class="collect-reveal-stars" style="color:${tier.color}">${tier.stars} ${tier.label}</div>
      <p class="rankup-sub">${price != null ? `ซื้อมาในราคา 🪙${fmtNum(price)} · ` : ''}เก็บเข้าคลังสะสมแล้ว 🏆<br>ตั้งราคาขายต่อในตลาดได้ทุกเมื่อ!</p>
      <button class="rankup-btn">เยี่ยมไปเลย! 🎉</button>
    </div>`;
  overlay.querySelector('.rankup-btn').addEventListener('click', ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(overlay);
}

function buyAC(){
  const total = AC_PRICE + AC_INSTALL;
  if(state.coins < total){
    sfx.wrong(); toast(`แอร์+ติดตั้งรวม 🪙${fmtNum(total)} — เหรียญยังไม่พอนะ`); return;
  }
  askConfirm(`<h2>❄️ ติดแอร์ให้บ้าน</h2>
    <p style="font-size:16px;margin:6px 0">เครื่องปรับอากาศ 🪙${fmtNum(AC_PRICE)}<br>+ ค่าติดตั้ง 🪙${fmtNum(AC_INSTALL)}<br>= รวม <b>🪙${fmtNum(total)}</b></p>`,
    'ติดเลย!', ()=>{
      state.coins -= total;
      state.ac = true;
      for(const p of state.pets) if(p.type !== 'dragon') p.heatFrom = null;
      sfx.buy();
      toast('❄️ ติดแอร์เรียบร้อย! บ้านเย็นฉ่ำ น้องสบายตัวสุดๆ 🎉');
      saveState();
      renderDashboard();
    });
}

function openHomeShop(){
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box home-shop-box">
    <h2>🏠 เลือกที่พักให้น้อง</h2>
    <div class="home-list">
      ${HOMES.map(h=>{
        const current = state.home === h.id;
        const afford = state.coins >= h.price;
        return `<div class="home-option ${current?'current':''} ${!current && !afford?'cant-afford':''}" data-home="${h.id}">
          ${homeVisualHTML(h, 'home-opt-img')}
          <div class="home-opt-body">
            <b>${h.emoji} ${h.name}</b>
            <small>${h.desc}<br>${h.acNote}<br>🧾 ค่าบำรุง 🪙${fmtNum(maintCost(h.id))} + ⚡ ค่าไฟ 🪙${fmtNum(elecCost(h.id))} + 🚰 ค่าน้ำ 🪙${fmtNum(waterCost(h.id))} + 🗑️ ค่าขยะ 🪙${fmtNum(trashCost(h.id))}/เดือน (จ่ายทุกวันที่ 1)${h.quizBonus > 0 ? `<br>🎁 ทำแบบทดสอบครบ 10 ข้อ รับโบนัส +${h.quizBonus} 🪙 ทุกครั้ง` : ''}</small>
            ${current ? '<span class="it-tag tag-on">อยู่ปัจจุบัน</span>' : `<span class="home-price">🪙${fmtNum(h.price)}</span>`}
          </div>
        </div>`;}).join('')}
    </div>
    <button class="food-cancel">ไว้ก่อน</button>
  </div>`;
  overlay.querySelector('.food-cancel').addEventListener('click', ()=>overlay.remove());
  overlay.querySelectorAll('.home-option').forEach(el=>{
    el.addEventListener('click', ()=>{
      const h = homeInfo(el.dataset.home);
      if(state.home === h.id){ toast('อยู่ที่พักนี้อยู่แล้วจ้า 😊'); return; }
      if(state.coins < h.price){
        sfx.wrong(); toast(`${h.name} ราคา 🪙${fmtNum(h.price)} — เหรียญยังไม่พอ สู้ๆ!`); return;
      }
      overlay.remove();
      askConfirm(`<h2>${h.emoji} ${h.name}</h2>
        <p style="font-size:16px;margin:6px 0">${h.desc}<br>${h.acNote}<br>ราคา <b>🪙${fmtNum(h.price)}</b><br>
        <small>🧾 ค่าบำรุง 🪙${fmtNum(maintCost(h.id))} + ⚡ ค่าไฟ 🪙${fmtNum(elecCost(h.id))} + 🚰 ค่าน้ำ 🪙${fmtNum(waterCost(h.id))} + 🗑️ ค่าขยะ 🪙${fmtNum(trashCost(h.id))}/เดือน (เดือนแรกฟรี)</small></p>`,
        'ซื้อเลย!', ()=>{
          state.coins -= h.price;
          state.home = h.id;
          state.ac = false;                       // แอร์ติดกับบ้านหลังเดิม ย้ายบ้านต้องซื้อใหม่
          state.bills.maint = {month: ymStr(Date.now()), due: 0, paid: 0};   // เดือนแรกฟรี บิลจริงออกวันที่ 1
          state.bills.elec  = {month: ymStr(Date.now()), due: 0, paid: 0};   // ค่าไฟ/ค่าน้ำบ้านใหม่ก็ฟรีเดือนแรก
          state.bills.water = {month: ymStr(Date.now()), due: 0, paid: 0};
          state.bills.trash = {month: ymStr(Date.now()), due: 0, paid: 0, fine: 0};   // ค่าขยะฟรีเดือนแรก
          state.powerCut = false; state.transformerBought = false;           // มิเตอร์+ระบบน้ำใหม่มากับบ้านใหม่
          state.waterCut = false; state.plumbingBought = false;
          if(heatProtected()) for(const p of state.pets) p.heatFrom = null;
          sfx.buy();
          toast(`🎉 ได้${h.name}แล้ว! น้องมีที่หลบแดดหลบฝนแล้ว`);
          saveState();
          renderDashboard();
        });
    });
  });
  document.body.appendChild(overlay);
}

/* ============================================================
   ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
   ============================================================ */
function renderPetShop(){
  document.getElementById('petshop-coin-count').textContent = fmtNum(state.coins);
  const grid = document.getElementById('egg-grid');
  grid.innerHTML = Object.keys(PETS).map(key=>{
    const p = PETS[key];
    const eggImg = IMG_FILES[startImgKey(key)];
    const owned = hasPetType(key);
    const afford = state.coins >= p.price;
    return `<div class="egg-card ${owned?'owned-pet':''} ${!owned && !afford?'cant-afford':''}" data-pet="${key}">
      ${eggImg ? `<img class="egg-img" src="${eggImg}" alt="${p.eggName}">` : startHTML(key)}
      <div class="egg-name">${p.eggName}</div>
      <div class="egg-desc">${p.eggDesc}</div>
      ${owned ? '<div class="pet-price owned">✅ เลี้ยงอยู่แล้ว</div>' : `<div class="pet-price">🪙${fmtNum(p.price)}</div>`}
    </div>`;
  }).join('');
  grid.querySelectorAll('.egg-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const key = card.dataset.pet;
      const conf = PETS[key];
      if(hasPetType(key)){ sfx.select(); toast(`มี${conf.name}อยู่แล้วจ้า เลี้ยงน้องให้โตกันเถอะ 🥰`); return; }
      if(state.coins < conf.price){
        sfx.wrong();
        toast(`${conf.eggName} ราคา 🪙${fmtNum(conf.price)} — เล่นเกมจับคู่สะสมเหรียญก่อนนะ!`);
        return;
      }
      askConfirm(`<h2>รับ${conf.eggName}มาเลี้ยง?</h2>
        <p style="font-size:16px;margin:6px 0">${conf.eggDesc}<br>ราคา <b>🪙${fmtNum(conf.price)}</b><br><small>${conf.ability}</small></p>`,
        'รับเลย! 🥰', ()=>{
          state.coins -= conf.price;
          state.pets.push(newPet(key));
          state.active = state.pets.length - 1;
          saveState();
          sfx.levelup();
          toast(conf.startKey === 'egg'
            ? `ได้${conf.eggName}แล้ว! เล่นเกมเพื่อฟักไข่กันเถอะ 🎉`
            : `ได้${conf.eggName}แล้ว! เล่นเกมให้น้องแข็งแรงจนลืมตากันเถอะ 🎉`);
          renderDashboard();
          showScreen('screen-dashboard');
          probeImages(petImageKeys(key)).then(renderDashboard);
        });
    });
  });
}

/* ============================================================
   เลเวลอัพ (รายตัว)
   ============================================================ */
function showLevelUp(p){
  sfx.levelup();
  const conf = PETS[p.type];
  let title = `เลเวลอัพ! Lv.${p.level} 🎊`;
  let emoji = '⭐', msg = `${conf.name}เก่งขึ้นแล้ว!`;
  if(p.level === 2){
    if(conf.startKey === 'egg'){
      title = '🥚💥 ไข่ฟักแล้ว!';
      msg = `${conf.name}ออกมาจากไข่แล้ว น่ารักมาก! ปลดล็อกแอนิเมชันดุ๊กดิ๊ก`;
    }else{
      title = '👀 น้องลืมตาแล้ว!';
      msg = `${conf.name}ลืมตาและออกจากตะกร้าแล้ว! ปลดล็อกแอนิเมชันดุ๊กดิ๊ก<br>
        <small>🔍 รู้ไหม? ลูกหมาและลูกแมวแรกเกิดจะหลับตา แล้วค่อยลืมตาตอนอายุราว 1–2 สัปดาห์</small>`;
    }
    emoji = conf.baby;
  }else if(p.level === 3){
    title = '🌟 โตเต็มวัยแล้ว!';
    emoji = conf.adult; msg = `${conf.name}โตเต็มวัย มีออร่าประกาย ✨ ปลดล็อก: ${conf.ability}`;
  }
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const lvImg = IMG_FILES[`${p.type}_${petStage(p)}_happy`] || IMG_FILES[`${p.type}_${petStage(p)}_normal`];
  overlay.innerHTML = `<div class="levelup-box">
    <h2>${title}</h2>
    ${lvImg ? `<img class="lv-img" src="${lvImg}" alt="">` : `<div class="lv-emoji" style="font-size:70px">${emoji}</div>`}
    <p style="margin:8px 0 0;font-size:16px">${msg}</p>
    <button>เย้! 🎉</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>overlay.remove());
  document.body.appendChild(overlay);
  saveState();
}

/* ============================================================
   สถิติผลการเรียนรู้
   ============================================================ */
function renderStats(){
  dailyTick();
  const s = state.student || {first:'-', last:'', grade:'-'};
  const worth = netWorth();                  // แรงค์ยึดมูลค่าทรัพย์สินสุทธิ
  const info = rankInfo(worth);
  const catRows = catsForStudent().map(c=>{
    const attempts = state.quizLog.filter(l=>l.cat === c.id);
    const best = attempts.length ? Math.max(...attempts.map(a=>a.score)) : null;
    const passed = state.quizPassed.includes(c.id);
    return `<div class="stats-row">
      <span>${c.emoji} ${c.name}</span>
      <span>${best === null ? 'ยังไม่เคยสอบ' : `สูงสุด ${best}/10`}${passed ? ' <span class="pass-mark">✅</span>' : ''}</span>
    </div>`;
  }).join('');
  const logs = [...state.quizLog].reverse().slice(0,20).map(l=>{
    const c = findCat(l.cat);
    return `<div class="stats-row">
      <span>${c ? c.emoji + ' ' + c.name : l.cat} — <b>${l.score}/${l.total}</b>
        ${l.passed ? '<span class="pass-mark">ผ่าน</span>' : '<span class="fail-mark">ไม่ผ่าน</span>'}</span>
      <span style="color:#9a8aac">${fmtThaiDT(l.ts)}</span>
    </div>`;
  }).join('');
  const petRows = state.pets.length
    ? state.pets.map(p=>{
        const stage = petStage(p);
        const face = stage === 'egg' ? (PETS[p.type].startKey==='egg'?'🥚':'🧺') : PETS[p.type][stage];
        return `<div class="stats-row"><span>${face} ${PETS[p.type].name}</span><span>Lv.${p.level}${p.sick?' 🤒':''}</span></div>`;
      }).join('')
    : '<div class="cat-info">ยังไม่มีสัตว์เลี้ยง</div>';
  document.getElementById('stats-body').innerHTML = `
    <div class="stats-card">
      <h3 class="stats-title">👧 ${s.first} ${s.last} · ชั้น ${s.grade}</h3>
      <div class="stats-row"><span>🎖️ แรงค์ปัจจุบัน (ตามมูลค่าทรัพย์สินสุทธิ)</span>
        <span style="color:${info.rank.color};font-weight:bold">${info.rank.emoji} ${info.label}</span></div>
      <div class="stats-row"><span>💪 แต้มความพยายามสะสม</span><span><b>${fmtNum(state.rp)}</b> RP</span></div>
      <div class="stats-row"><span>🪙 เหรียญที่หาได้วันนี้ (${fmtThaiDate(Date.now())})</span><span><b>+${fmtNum(state.daily.coins)}</b> เหรียญ</span></div>
      <div class="stats-row"><span>🪙 เหรียญคงเหลือ</span><span><b>${fmtNum(state.coins)}</b> เหรียญ</span></div>
      <div class="stats-row"><span>🏆 มูลค่าทรัพย์สินที่ซื้อไว้</span><span><b>${fmtNum(assetValue())}</b> เหรียญ</span></div>
      <div class="stats-row"><span>💰 มูลค่ารวมสุทธิ (ฐานคิดแรงค์)</span><span style="font-weight:bold;color:${info.rank.color}">${fmtNum(worth)} เหรียญ</span></div>
      <div class="stats-row"><span>สอบไปแล้วทั้งหมด</span><span><b>${state.quizLog.length}</b> ครั้ง</span></div>
      <div class="stats-row"><span>หมวดที่สอบผ่านแล้ว (ระดับชั้นนี้)</span><span><b>${catsForStudent().filter(c=>state.quizPassed.includes(c.id)).length}</b> / ${catsForStudent().length} หมวด</span></div>
      <div class="stats-row"><span>จับคู่คำศัพท์ถูกสะสม</span><span><b>${state.totalMatches}</b> คำ</span></div>
    </div>
    <div class="stats-card"><h3 class="stats-title">🐾 สัตว์เลี้ยงของหนู</h3>${petRows}</div>
    <div class="stats-card"><h3 class="stats-title">📚 คะแนนสูงสุดรายหมวด (${gradeBand(s.grade).label})</h3>${catRows}</div>
    <div class="stats-card"><h3 class="stats-title">🕐 ประวัติการสอบล่าสุด</h3>
      ${logs || '<div class="cat-info">ยังไม่มีประวัติการสอบ — ไปลองสอบหมวดแรกกันเถอะ!</div>'}
    </div>`;
}
