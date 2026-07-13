"use strict";
/* ============================================================
   UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
   ============================================================ */

/* ---- สถานะการ์ดโรงงานผลิต (ในหน่วยความจำ ไม่ต้องเซฟ) ---- */
let factoryCat = 'all';         // ตัวกรองหมวดสินค้าในแคตตาล็อกโรงงาน ('all' | id หมวด)
let factoryPage = 0;            // หน้าปัจจุบันของแคตตาล็อก (5 รายการ/หน้า — ปัดซ้ายขวา/กดลูกศรเปลี่ยนหน้า)
let factorySlide = '';          // ทิศอนิเมชันตอนเปลี่ยนหน้า ('left'|'right'|'' = ไม่เล่น)
const FACTORY_PAGE_SIZE = 5;

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
    else if(p.sleeping) overlays += `<span class="sick-badge sleep-badge">💤</span>`;
  }
  const auraHTML = (stage === 'adult' && !p.sick)
    ? `<div class="aura"><span class="sparkle sp1">✨</span><span class="sparkle sp2">✨</span><span class="sparkle sp3">✨</span></div>`
    : '';
  return `<div class="pet-stage">${auraHTML}<div class="pet-wrap" id="pet-tap">${core}${overlays}</div></div>`;
}

/* ตัวละครผู้เลี้ยงยืนเต็มตัวข้างน้อง (ฉาก lobby 3D สไตล์ COD — รอบ 86)
   มีภาพ player_male/female.png ใช้ภาพเต็มตัว · ยังไม่เลือก/ไม่มีภาพ = อีโมจิตัวโต */
function caretakerFigureHTML(){
  const av = state.playerAvatar;
  const img = av && IMG_FILES[`player_${av}`];
  if(img) return `<div class="caretaker-fig"><img class="caretaker-img" src="${img}" alt="ผู้เลี้ยง"></div>`;
  const emoji = (av && AVATAR_UI[av]) ? AVATAR_UI[av].emoji : '🧑';
  return `<div class="caretaker-fig caretaker-emoji">${emoji}</div>`;
}

/* รอบ 114: เหรียญตราแรงค์ใหญ่เป็นฉากหลังกลางเวที lobby (อยู่หลังตัวละคร/canvas 3D)
   ใช้แรงค์ปัจจุบันจาก net worth · ไม่มีไฟล์ภาพ = ไม่โชว์ (ไม่ใช้อีโมจิ กันรก)
   รอบ 115: แรงค์เปลี่ยนระหว่าง session → เล่นเอฟเฟกต์เปลี่ยนร่าง (แฟลช+เหรียญหมุนสลับ)
   จำแรงค์ที่โชว์ล่าสุดไว้เทียบ — เข้าเกมครั้งแรก/เปลี่ยนหน้าไปมา ไม่เล่นซ้ำ */
let heroRankShownId = null;
function heroRankBgHTML(){
  const info = rankInfo(netWorth());
  const img = IMG_FILES[`rank_${info.rank.id}`];
  const fx = heroRankShownId !== null && heroRankShownId !== info.rank.id && !state.noAnim;
  heroRankShownId = info.rank.id;
  if(!img) return '';
  // รอบ 176: ชั้นแสงมีชีวิต — .rank-edge = แถบแสงวิ่งไล่ตามขอบเหลี่ยมของเหรียญ (mask ภาพจริง 2 ชั้น xor เหลือแต่ขอบ)
  // .rank-beam = ลำแสงกวาดทั้งเหรียญ (mask ภาพจริงชั้นเดียว) · img เรืองแสงหายใจสีตามแรงค์ (CSS rankBreath)
  const imgAbs = new URL(img, document.baseURI).href;   // ⚠️ url() ใน var() Chrome resolve เทียบไฟล์ CSS — ต้องส่ง absolute
  // รอบ 177: ยิ่งใกล้เลื่อนแรงค์ แสงยิ่งหายใจถี่ (3.6s → 2.0s ตาม prog) — เด็กรู้สึก "ใกล้แล้ว!"
  const pulse = (3.6 - 1.6*Math.min(1, info.prog || 0)).toFixed(2);
  // ประกายเพชร ✦ 8 จุด — ตำแหน่ง deterministic ต่อแรงค์ (seed จาก idx) กัน render ซ้ำแล้วจุดย้ายวูบวาบ
  let sparks = '', s = info.idx*7 + 3;
  const rnd = ()=>{ s = (s*16807) % 2147483647; return s/2147483647; };
  for(let i=0;i<8;i++){
    sparks += `<span style="left:${(18+rnd()*64).toFixed(1)}%;top:${(12+rnd()*70).toFixed(1)}%;`+
      `font-size:${(10+rnd()*16).toFixed(0)}px;animation-delay:${(rnd()*3).toFixed(2)}s;`+
      `animation-duration:${(1.6+rnd()*2).toFixed(2)}s">✦</span>`;
  }
  return `<div class="hero-rank-bg${fx ? ' rank-fx' : ''}" style="--rank-c:${info.rank.color};--rank-img:url('${imgAbs}');--rank-pulse:${pulse}s">
    <img src="${img}" alt="">
    <div class="rank-beam"><i></i></div>
    <div class="rank-edge"><i></i></div>
    <div class="rank-sparks">${sparks}</div>
    <div class="rank-floor"></div>
  </div>`;
}

/* ============================================================
   🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
   สุ่มครั้งเดียวต่อการเปิดเกม (module var — login ใหม่/รีเฟรช = คำใหม่)
   คลิกแบนเนอร์ = ป๊อปอัปรายละเอียดตาม format พจนานุกรม + อ่านออกเสียง
   ============================================================ */
let newWordPick = null;
function renderNewWord(){
  const el = document.getElementById('newword-banner');
  if(!el) return;
  if(typeof NEW_WORDS === 'undefined' || !state.student){ el.style.display='none'; return; }
  if(!newWordPick){
    const pool = newWordPool();
    newWordPick = pool[Math.floor(Math.random()*pool.length)];
  }
  const [en] = newWordPick;
  el.style.display='';
  el.innerHTML = `
    <span class="nw-tag">🆕 New!</span>
    <span class="nw-word">${en}</span>
    <span class="nw-hint">ไม่รู้ว่าแปลว่าอะไร? 👆 <b>คลิก</b></span>`;
  el.onclick = showNewWordPopup;
}

/* ป๊อปอัปรายละเอียดคำ — format ตามสเปกพจนานุกรม (TASK_DICTIONARY_SONNET.md):
   คำ / (pos) /IPA/ เสียงอ่านไทย / ประโยคอังกฤษอธิบายความหมาย / ความหมายไทย */
function showNewWordPopup(){
  if(!newWordPick) return;
  const [en, pos, ipa, thRead, sentence, thMean] = newWordPick;
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box nw-box">
    <div class="nw-pop-word">${en} <button class="nw-speak" title="ฟังเสียงอ่าน">🔊</button></div>
    <div class="nw-pop-phon">(${pos}) <span class="nw-ipa">${ipa}</span> ${thRead}</div>
    <div class="nw-pop-sent">${sentence}</div>
    <div class="nw-pop-mean">${thMean}</div>
    <div style="margin-top:14px"><button class="cf-ok">เข้าใจแล้ว! ✨</button></div>
  </div>`;
  const close = ()=>overlay.remove();
  overlay.querySelector('.cf-ok').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
  overlay.querySelector('.nw-speak').addEventListener('click', ()=>speakWord(en));
  document.body.appendChild(overlay);
  speakWord(en);   // เปิดมาอ่านให้ฟังเลย (มีปุ่ม 🔊 ฟังซ้ำ)
}

/* ร่างยักษ์ (รอบ 102): อัพเกรดขยายน้องในหน้า lobby ด้วยเหรียญ
   ระดับ 0=ปกติ (น้องเล็กกว่าผู้เลี้ยง) → GIANT_MAX=ยักษ์ (ผู้เลี้ยงสูงแค่เข่าของน้อง)
   คุมขนาดจริงด้วยความสูงเป็น vh: น้องสูงขึ้น + ผู้เลี้ยงเตี้ยลงตามสัดส่วน */
const GIANT_MAX = 4;
const GIANT_COST     = [0, 2000, 4000, 8000, 16000];   // เหรียญที่จ่ายเพื่อ "ขึ้น" ไปแต่ละระดับ
const GIANT_PET_VH   = [15, 42, 54, 64, 74];           // ความสูงน้อง (vh) — g0 = 15 (รอบ 161: ไม่เกินเอวคน ≈ 54% ของ 28vh)
const GIANT_OWNER_VH = [28, 33, 30, 26, 22];           // ความสูงผู้เลี้ยง (vh) — g0 = 28 (คงเดิมรอบ 161) · g4: 22/74 ≈ 0.30 (ระดับเข่า)
const GIANT_OWNER_X  = ['-56px','-54px','-42px','-27px','-14px']; // เยื้องผู้เลี้ยงจากกลางเวที (ลบ=ซ้าย): ปกติเยื้องซ้ายให้เห็นหน้าน้องด้านขวา · ยักษ์ยืนหน้าขาน้อง (หน้าน้องอยู่สูงเห็นอยู่แล้ว)
const GIANT_NAMES    = ['ปกติ','ตัวโต','ยักษ์เล็ก','ยักษ์ใหญ่','ยักษ์อลังการ'];
function giantLevel(p){ return Math.max(0, Math.min(GIANT_MAX, (p && p.giant) || 0)); }

/* รอบ 189: ระดับร่างยักษ์สูงสุดที่ "เคยจ่ายปลดล็อกแล้ว" — ขยายถึงระดับนี้ซ้ำได้ฟรี
   (รวม migration: ระดับปัจจุบันถือว่าจ่ายมาแล้วแน่นอน) */
function giantUnlocked(p){ return Math.max((p && p.giantMax) || 0, (p && p.giant) || 0); }

function upgradeGiant(p){
  p = p || activePet();
  if(!p) return;
  const g = giantLevel(p);
  if(g >= GIANT_MAX){ toast('น้องตัวใหญ่สุดแล้ว 🎉'); return; }
  p.giantMax = giantUnlocked(p);                 // จำระดับที่ปลดล็อกแล้ว (รวมระดับปัจจุบัน)
  const paid = p.giantMax >= g + 1;              // เคยจ่ายขึ้นระดับนี้แล้ว → ขยายฟรี
  const cost = paid ? 0 : GIANT_COST[g+1];
  if(cost > 0 && state.coins < cost){
    toast(`🪙 เหรียญไม่พอ — ขยายร่างระดับถัดไปต้องใช้ ${fmtNum(cost)} (ขาดอีก ${fmtNum(cost - state.coins)})`);
    return;
  }
  if(cost > 0) state.coins -= cost;              // จ่ายเฉพาะครั้งแรกของแต่ละระดับ
  p.giant = g + 1;
  if(p.giantMax < p.giant) p.giantMax = p.giant;
  saveState();
  sfx.select();
  floatFx(cost > 0 ? `🦣 ตัวใหญ่ขึ้น! -🪙${fmtNum(cost)}` : `🦣 ตัวใหญ่ขึ้น! ฟรี 🆓`);
  toast(`🦣 ${escapeHTML(p.name)} ร่าง${GIANT_NAMES[p.giant]}แล้ว!`);
  renderDashboard();
}

/* เปลี่ยนชื่อน้อง (ใช้ทั้งปุ่ม ✏️ และคลิกซ้ำแท็บน้องที่กำลังแสดงอยู่ — รอบ 189) */
function renamePet(p){
  p = p || activePet();
  if(!p) return;
  const conf = PETS[p.type];
  askNameDialog({
    emoji:'🏷️', title:`เปลี่ยนชื่อ${conf.name}`,
    desc:'ชื่อไทย/อังกฤษ/ตัวเลข 1–15 ตัว',
    placeholder:'เช่น บ็อบบี้, Lucky', value:p.name, min:1, max:15,
    okText:'เปลี่ยนชื่อ ✅', cancelText:'ยกเลิก',
    onOk:(name)=>{
      p.name = name; saveState(); sfx.select();
      toast(`🏷️ เปลี่ยนชื่อน้องเป็น "${name}" แล้ว!`);
      renderDashboard();
    },
  });
}
function resetGiant(p){
  p = p || activePet();
  if(!p || giantLevel(p) === 0) return;
  p.giant = 0;
  saveState();
  sfx.select();
  toast(`↩️ ${escapeHTML(p.name)} กลับมาตัวปกติแล้ว (ไม่คืนเหรียญ)`);
  renderDashboard();
}

/* ---------- เวลามื้ออาหารเป็นข้อความไทย (มื้อเย็นวันละครั้ง 18:00 — ข้อ 2) ---------- */
function mealLabel(ts){
  const d = new Date(ts), today = new Date();
  today.setHours(0,0,0,0);
  const dayDiff = Math.round((new Date(ts).setHours(0,0,0,0) - today.getTime())/86400000);
  const day = dayDiff >= 2 ? 'มะรืนนี้ ' : dayDiff === 1 ? 'พรุ่งนี้ ' : '';
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
  renderOnlineEarnPill();                            // item 8: ตัวเลขโบนัสออนไลน์วิ่งทุกวินาที
  renderFarmClock();                                 // นาฬิกานับถอยหลังต้นไม้เดินพร้อมนาฬิกา
  renderOrderClock();                                // นาฬิกานับถอยหลังออเดอร์พิเศษ
  renderDinnerChip();                                // ปุ่มข้าวเย็นผู้เล่น (ข้อ 6) โผล่/หายตามเวลา (อยู่แถวแท็บสัตว์ตั้งแต่รอบ 179)
  chatBadgeSync();                                   // รอบ 179: badge เลขข้อความใหม่บนปุ่มแชท header
  if(typeof syncMusicBtn === 'function') syncMusicBtn();   // 🎵 รอบ 184: ไอคอนปุ่มเพลงตาม state.musicOff
}

/* ============================================================
   ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
   คนก็ต้องกินมื้อเย็น 18:00 — เกิน 20:00 ไม่กิน → ป่วย จ่ายค่ารักษา 1,000
   ปุ่ม 🍚 ใน header โผล่ช่วงเย็น (18:00 ถึงตี 6) จนกว่าจะกิน · ป่วย → กลายเป็น 🤒
   ============================================================ */
function dinnerDue(now){
  now = now || Date.now();
  const h = new Date(now).getHours();
  return (h >= MEAL_HOUR || h < WAKE_HOUR) && state.playerFedDay !== mealDayKey(now);
}
function renderDinnerChip(){
  const btn = document.getElementById('btn-dinner');
  if(!btn || typeof state === 'undefined') return;
  if(state.playerSick){
    btn.style.display = ''; btn.textContent = '🤒';
    btn.title = 'หนูป่วยเพราะไม่กินข้าวเย็น — แตะเพื่อไปรักษา';
  }else if(dinnerDue()){
    btn.style.display = ''; btn.textContent = '🍚';
    btn.title = `ได้เวลากินข้าวเย็นของหนูแล้ว (🪙${fmtNum(DINNER_COST)})`;
  }else btn.style.display = 'none';
}
function dinnerClick(){
  sfx.select();
  if(state.playerSick){
    askConfirm(`<div style="font-size:56px;line-height:1">🤒</div>
      <div style="font-size:21px;font-weight:bold;margin-top:8px;color:#b23a48">หนูป่วยเพราะไม่ได้กินข้าวเย็น</div>
      <div style="margin-top:8px;color:#6a5a78;line-height:1.5">ไปหาหมอรักษาให้หายก่อนนะ<br>ค่ารักษา <b>🪙${fmtNum(CURE_COST)}</b> (มี 🪙${fmtNum(Math.floor(state.coins))})</div>`,
      `💊 รักษา 🪙${fmtNum(CURE_COST)}`, ()=>{
        if(state.coins < CURE_COST){ sfx.wrong(); toast(`ค่ารักษา 🪙${fmtNum(CURE_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ`); return; }
        state.coins -= CURE_COST;
        state.playerSick = false;
        sfx.levelup();
        toast('💊 รักษาหายแล้ว! คราวหน้าอย่าลืมกินข้าวเย็นตอน 18:00 นะ');
        saveState();
        renderDashboard();
      });
    return;
  }
  if(!dinnerDue()){ toast('😋 วันนี้กินข้าวเย็นแล้ว ไว้เจอกันมื้อพรุ่งนี้ 18:00 นะ'); return; }
  askConfirm(`<div style="font-size:56px;line-height:1">🍚</div>
    <div style="font-size:21px;font-weight:bold;margin-top:8px">กินข้าวเย็นของหนู</div>
    <div style="margin-top:8px;color:#6a5a78;line-height:1.5">คนก็ต้องกินข้าวให้ตรงเวลาเหมือนน้องนะ<br>ค่าข้าวเย็น <b>🪙${fmtNum(DINNER_COST)}</b> (มี 🪙${fmtNum(Math.floor(state.coins))})</div>`,
    `🍽️ กินเลย 🪙${fmtNum(DINNER_COST)}`, ()=>{
      if(state.coins < DINNER_COST){ sfx.wrong(); toast(`ค่าข้าวเย็น 🪙${fmtNum(DINNER_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ`); return; }
      state.coins -= DINNER_COST;
      state.playerFedDay = mealDayKey(Date.now());
      sfx.buy();
      toast('🍚 อิ่มอร่อย! กินข้าวเย็นตรงเวลา สุขภาพแข็งแรง 💪');
      saveState();
      renderDashboard();
    });
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
   เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
   → เม็ดฝนจางๆ ทั้งจอ + หยดน้ำเกาะ "กระจกจอ" ชั่วคราว (แค่ภาพ ไม่แตะ state)
   ============================================================ */
function rainFxTick(){
  const on = typeof Auth !== 'undefined' && Auth.booted
          && rainNow(Date.now()) && !rainProtected();
  let fx = document.getElementById('rain-fx');
  if(on && !fx){
    fx = document.createElement('div');
    fx.id = 'rain-fx';
    fx.innerHTML = `<div class="rain-layer l1"></div><div class="rain-layer l2"></div><div class="rain-glass"></div>`;
    document.body.appendChild(fx);
    rainFxDrop(fx.querySelector('.rain-glass'));
  }else if(!on && fx){
    fx.remove();                       // ฝนหยุด/ซื้อบ้านแล้ว → เอฟเฟกต์หาย
  }
}
/* หยดน้ำเกาะกระจก: ภาพเม็ดฝนจริง 5 แบบ (img/fx/) สุ่มแบบ/ขนาด/ตำแหน่ง/
   ความทึบ/องศาเอียง เกาะ ~6 วิ แล้วไหลลงจางหาย — spawn ต่อเนื่องจนกว่า overlay
   ถูกถอด (เช็ก document.contains ทุกรอบ กัน loop ค้าง) */
const RAIN_DROP_IMGS = ['raindrop.png','raindrop_1.png','raindrop_2.png','raindrop_3.png','raindrop_4.png'];
function rainFxDrop(glass){
  if(!document.body.contains(glass)) return;
  const img = document.createElement('img');
  img.className = 'glass-drop';
  img.src = 'img/fx/' + RAIN_DROP_IMGS[Math.floor(Math.random()*RAIN_DROP_IMGS.length)];
  /* 2 แบบให้เหมือนฝนจริง: ~45% "รูดเร็ว-ไกล" (เกาะแป๊บเดียวแล้วไหลลงยาว)
     ที่เหลือ "เกาะช้า" (ค้างอยู่กับที่แล้วจางหาย) — ease-in ทำให้เริ่มช้าแล้วเร่ง */
  const streak = Math.random() < 0.45;
  const size = (streak ? 14 : 18) + Math.random()*(streak ? 16 : 28);
  const fall = streak ? 130 + Math.random()*310 : 6 + Math.random()*26;    // ระยะไหลลง (px)
  const dur  = streak ? 1.1 + Math.random()*1.5 : 4.5 + Math.random()*2.6;  // ระยะเวลา (วิ) เร็ว/ช้า
  img.style.left  = (2 + Math.random()*92).toFixed(1) + '%';
  img.style.top   = (streak ? 1 + Math.random()*38 : 2 + Math.random()*80).toFixed(1) + '%'; // เม็ดรูดเริ่มบนๆ จะได้มีที่ไหล
  img.style.width = size.toFixed(0) + 'px';
  img.style.setProperty('--o', (0.4 + Math.random()*0.4).toFixed(2));      // ความทึบสูงสุด (จางแบบน้ำ)
  img.style.setProperty('--r', (Math.random()*16 - 8).toFixed(1) + 'deg'); // เอียงเล็กน้อยไม่ให้เหมือนกันเป๊ะ
  img.style.setProperty('--fall', fall.toFixed(0) + 'px');
  img.style.animationDuration = dur.toFixed(2) + 's';
  glass.appendChild(img);
  setTimeout(()=>img.remove(), dur*1000 + 150);
  setTimeout(()=>rainFxDrop(glass), 250 + Math.random()*600);
}

/* ============================================================
   การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
   ต่อ Firebase สำเร็จ → โชว์ผู้เล่นจริงที่ออนไลน์อยู่ (Online.friends)
   ออฟไลน์/ต่อไม่ได้ → ถอยไปใช้เพื่อนจำลองเดิม (สุ่มหมุนเวียนทุก 5 นาที)
   ============================================================ */
/* คำเรียกตัวเองตามระดับชั้น — ป.1-ป.6/อนุบาล = "หนู" (น่ารักสำหรับเด็ก) ·
   ตั้งแต่ ม.1 ขึ้นไป (รวม ปริญญา) = "คุณ" (สุภาพ เหมาะกับวัยโต) */
function selfPronoun(){
  const g = state.student ? state.student.grade : '';
  const junior = (g === 'ต่ำกว่าประถมศึกษา') || /^ป\.[1-6]$/.test(g);
  return junior ? 'หนู' : 'คุณ';
}
function selfTag(){ return selfPronoun() + 'เอง'; }   // "หนูเอง" / "คุณเอง"

/* 🆔 รอบ 187: รหัสประจำตัวผู้เล่น (6 ตัวจาก uid — คงที่แม้เปลี่ยนชื่อ) โชว์แทน "ชั้น" ในเกม
   มาตรการคุ้มครองเด็ก: ชั้นเรียนใช้เลือกความยากคำศัพท์เท่านั้น ไม่โชว์ · Lobby/กระดานเห็นแค่ 🆔 + ชื่อเล่น */
function idTag(uid){
  if(!uid || typeof friendCode !== 'function') return '';
  return '🆔 ' + friendCode(String(uid));
}

/* ============================================================
   รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
   แตะกล่อง = หยุดให้เลื่อนอ่านเองได้ · ปล่อยนิ้วเกิน 5 วิ = เลื่อนต่อ
   เนื้อหายาวเกินกล่องค่อยวน (ทำสำเนาต่อท้ายให้ลูปไร้รอยต่อ) · สั้นพอดีกล่อง = อยู่นิ่ง
   ============================================================ */
const SIDE_SCROLL_SPEED  = 14;      // px/วินาที
const SIDE_SCROLL_RESUME = 5000;    // ms หลังปล่อยนิ้วค่อยเลื่อนต่อ
const sideScrollSt = {};            // สถานะต่อกล่อง (id) — คงอยู่ข้าม re-render

function initSideScroll(el){
  if(!el) return;
  const st = sideScrollSt[el.id] || (sideScrollSt[el.id] = {hold:false, until:Date.now()+1500, pos:0});
  if(!el.__ssBound){
    el.__ssBound = true;
    const grab = ()=>{ st.hold = true; };
    const drop = ()=>{ if(st.hold){ st.hold = false; st.until = Date.now() + SIDE_SCROLL_RESUME; } };
    el.addEventListener('pointerdown', grab);
    el.addEventListener('touchstart', grab, {passive:true});
    window.addEventListener('pointerup', drop);
    window.addEventListener('pointercancel', drop);
    window.addEventListener('touchend', drop);
    window.addEventListener('touchcancel', drop);
    el.addEventListener('wheel', ()=>{ st.until = Date.now() + SIDE_SCROLL_RESUME; }, {passive:true});
  }
  el.__ssLoop = false;
  if(el.scrollHeight - el.clientHeight > 8){          // ยาวเกินกล่องค่อยวน
    const html = el.innerHTML;
    el.innerHTML = `<div class="ss-chunk">${html}</div><div class="ss-chunk">${html}</div>`;
    const c = el.querySelectorAll(':scope > .ss-chunk');
    el.__ssH = Math.max(1, c[1].offsetTop - c[0].offsetTop);
    el.__ssLoop = true;
    if(st.pos > el.__ssH) st.pos = 0;                 // เนื้อหาเปลี่ยน สั้นลง → เริ่มหัวลิสต์
    el.scrollTop = st.pos;
  }
  if(!window.__ssRafOn){ window.__ssRafOn = true; requestAnimationFrame(sideScrollTick); }
}
let __ssLastTs = 0;
function sideScrollTick(ts){
  requestAnimationFrame(sideScrollTick);
  const dt = Math.min(0.06, (ts - __ssLastTs)/1000 || 0);
  __ssLastTs = ts;
  for(const id in sideScrollSt){
    const el = document.getElementById(id), st = sideScrollSt[id];
    if(!el || !el.clientHeight) continue;                      // จอนี้ถูกซ่อนอยู่
    if(!el.__ssLoop){                                          // เรนเดอร์ตอนจอซ่อน (วัด overflow ไม่ได้) → เช็กซ้ำตอนโผล่
      if(el.scrollHeight - el.clientHeight > 8) initSideScroll(el);
      continue;
    }
    if(st.hold || Date.now() < st.until){ st.pos = el.scrollTop; continue; }  // ผู้ใช้ถืออยู่/เพิ่งปล่อย
    st.pos += SIDE_SCROLL_SPEED * dt;
    if(st.pos >= el.__ssH) st.pos -= el.__ssH;
    el.scrollTop = st.pos;
  }
}

/* ============================================================
   Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
   ทุกคนได้ชุดเดียวกัน (seed จากวันที่) · questEvent ใน state.js เรียก re-render ให้เอง
   รอบ 150: ภารกิจเพิ่งสำเร็จ → เด้งเลื่อนกล่องไปโชว์แถวนั้น + แฟลชเขียว ค่อยวนต่อ
   (สำเร็จตอนอยู่หน้าเกม = จำค้างไว้ กลับเข้า lobby ค่อยแฟลชให้เห็น)
   ============================================================ */
const QUEST_FLASH_HOLD = 5000;        // ms ค้างโชว์แถวที่เพิ่งสำเร็จ ก่อนกลับไปเลื่อนวนต่อ
let __qDoneSeen = null;               // done ids ที่เห็นรอบก่อน (null = ยังไม่เคยเรนเดอร์ ไม่นับของเก่าตอน login)
let __qFlashPend = null;              // ภารกิจรอแฟลช (สำเร็จตอนกล่องถูกซ่อน เช่น อยู่หน้าเกมจับคู่)

/* รอบ 170 (สเปกผู้ใช้ "เลื่อนขึ้นเฉยๆ ไม่น่าสนใจ"): เลิกลิสต์เลื่อนวน →
   การ์ดใหญ่ทีละใบ พลิก 3D สลับทุก 6 วิ + ปุ่ม 🚀 ไปทำเลย (deep-link) + จุดบอกตำแหน่ง 3 ใบ
   แตะการ์ด = พลิกใบถัดไปทันที (พัก auto 8 วิ) · ภารกิจเพิ่งสำเร็จ = เด้งไปใบนั้น แฟลชเขียว ค้าง 5 วิ */
const QUEST_DECK_FLIP_MS = 6000;
let __qDeckIdx = 0, __qDeckHold = 0;   // ใบที่โชว์ · เวลาห้าม auto-flip ถึง (แตะเอง/เพิ่งสำเร็จ)

function questGo(qid){                 // ปุ่ม 🚀 พาไปที่ที่ต้องทำ — คลิกปุ่ม/เรียก handler เดิม (guard ครบในตัว)
  sfx.select();
  if(qid === 'match20' || qid === 'replay2'){ const b = document.getElementById('btn-play'); if(b) b.click(); }
  else if(qid === 'quiz1'){ const b = document.getElementById('btn-cats'); if(b) b.click(); }
  else if(qid === 'word3d3'){ if(typeof railWorldClick === 'function') railWorldClick('adv'); }
  else if(qid === 'feed1'){ if(typeof openPetInfoOverlay === 'function') openPetInfoOverlay(); }
  else if(qid === 'produce1'){ const b = document.querySelector('.lobby-rail [data-panel="panel-factory"]'); if(b) b.click(); }
}

function qDeckDraw(el, flashId){
  const qs = questsToday();
  if(__qDeckIdx >= qs.length) __qDeckIdx = 0;
  el.classList.add('q-fit');   // รอบ 178 (สเปกผู้ใช้): กล่องหดพอดี 2 บรรทัด (ชื่อ+แถวรางวัล) — ซ่อนแถบ/จุดใน CSS ฟอนต์ขนาดปกติ
  const q = qs[__qDeckIdx];
  const done = state.quests.done.includes(q.id);
  const prog = Math.min(q.target, state.quests.prog[q.id]||0);
  const pct = done ? 100 : Math.round(prog/q.target*100);
  const dots = qs.map((x,i)=>`<span class="q-dot ${i===__qDeckIdx?'on':''} ${state.quests.done.includes(x.id)?'ok':''}"></span>`).join('');
  el.innerHTML = `<div class="q-bigcard ${done?'done':''} ${flashId===q.id?'q-flash':''}" data-qid="${q.id}">
      <div class="qb-top"><span class="qb-emoji">${q.emoji}</span><div class="qb-name">${q.name}</div></div>
      <div class="qb-bar"><i style="width:${pct}%"></i></div>
      <div class="qb-row">
        <span class="qb-prog">${done ? '✅ สำเร็จแล้ว' : `<b>${prog}</b>/${q.target}`}</span>
        <span class="qb-reward">+${q.reward}🪙</span>
        ${done ? '' : `<button class="qb-go" data-qid="${q.id}">🚀 ไปทำเลย</button>`}
      </div>
      <div class="q-dots">${dots}<span class="q-bonus">${state.quests.allDone
        ? `🏆 รับโบนัสครบ ${QUEST_PER_DAY} แล้ว +${QUEST_ALL_BONUS}🪙`
        : `ครบ ${QUEST_PER_DAY} ภารกิจ โบนัส +${QUEST_ALL_BONUS}🪙`}</span></div>
    </div>`;
}

function qDeckNext(animate){
  const el = document.getElementById('quest-card');
  if(!el) return;
  __qDeckIdx = (__qDeckIdx + 1) % QUEST_PER_DAY;
  const card = el.querySelector('.q-bigcard');
  if(!animate || !card || document.documentElement.classList.contains('no-anim')){ qDeckDraw(el, null); return; }
  card.classList.add('qflip-out');                       // พลิกครึ่งแรก → สลับเนื้อหา → พลิกเข้า
  setTimeout(()=>{
    qDeckDraw(el, null);
    const c2 = el.querySelector('.q-bigcard');
    if(c2){ c2.classList.add('qflip-in'); setTimeout(()=>c2.classList.remove('qflip-in'), 300); }
  }, 170);
}

function renderQuestCard(){
  const el = document.getElementById('quest-card');
  if(!el || typeof state === 'undefined' || !state.student) return;
  questTick();
  delete sideScrollSt[el.id];            // เด็คใบเดียวพอดีกล่อง — กัน ticker รอบ 149 มาห่อ ss-chunk ซ้อน
  const qs = questsToday();
  // ภารกิจที่เพิ่งสำเร็จ (ไม่นับชุดที่ done อยู่แล้วตอนเปิดเกม) → เด้งไปใบนั้น
  const doneNow = state.quests.done.slice();
  if(__qDoneSeen !== null){
    const fresh = doneNow.filter(id=>!__qDoneSeen.includes(id));
    if(fresh.length) __qFlashPend = fresh[fresh.length-1];
  }
  __qDoneSeen = doneNow;
  let flashId = null;
  if(__qFlashPend && el.clientHeight){   // กล่องมองเห็นอยู่ค่อยแฟลช (ซ่อนอยู่ = รอรอบเรนเดอร์ตอนกลับ lobby)
    const i = qs.findIndex(q=>q.id === __qFlashPend);
    if(i >= 0){ __qDeckIdx = i; __qDeckHold = Date.now() + QUEST_FLASH_HOLD; flashId = __qFlashPend; }
    __qFlashPend = null;
  }
  qDeckDraw(el, flashId);
  if(!el.dataset.bound){                 // element สร้างใหม่ทุก renderDashboard → ผูกใหม่ได้เสมอ
    el.dataset.bound = '1';
    el.addEventListener('click', (e)=>{
      const go = e.target.closest('.qb-go');
      if(go){ questGo(go.dataset.qid); return; }
      if(e.target.closest('.q-bigcard')){ sfx.select(); __qDeckHold = Date.now() + 8000; qDeckNext(true); }
    });
  }
  if(!window.__qDeckTimer) window.__qDeckTimer = setInterval(()=>{
    const box = document.getElementById('quest-card');
    if(!box || !box.clientHeight) return;                // จอถูกซ่อน/ยังไม่เข้าเกม
    if(Date.now() < __qDeckHold) return;                 // ผู้ใช้เพิ่งแตะ/เพิ่งแฟลช
    qDeckNext(true);
  }, QUEST_DECK_FLIP_MS);
}

/* helper ร่วม (รอบ 150/152): เลื่อนกล่อง aside ไปโชว์แถวที่ match sel + ติด class แฟลช
   แล้วค้างไว้ QUEST_FLASH_HOLD ก่อนกลับไปเลื่อนวนต่อ */
function sideFlashRows(el, sel, cls){
  const st = sideScrollSt[el.id];
  const rows = el.querySelectorAll(sel);                           // มีทั้งในสำเนา 1+2 ตอนวนลูป
  if(!st || !rows.length) return;
  rows.forEach(r=>r.classList.add(cls));
  const base = el.querySelector(':scope > .ss-chunk') || el;       // เทียบตำแหน่งจากสำเนาแรก
  let top = rows[0].offsetTop - base.offsetTop - 4;
  const max = el.__ssLoop ? el.__ssH - 1 : Math.max(0, el.scrollHeight - el.clientHeight);
  top = Math.max(0, Math.min(top, max));
  st.pos = top;
  el.scrollTop = top;
  st.hold = false;
  st.until = Date.now() + QUEST_FLASH_HOLD;
}

/* questFlashRow (รอบ 150) ถูกแทนด้วยเด็คการ์ดรอบ 170 — แฟลชผ่าน flashId ใน qDeckDraw แทน */

/* รอบ 152: ตรวจเพื่อนใหม่เพิ่งออนไลน์ (เฉพาะโหมดออนไลน์จริง — เพื่อนจำลองไม่นับ) */
const FRIEND_FLASH_GRACE = 8000;      // ms หลังต่อออนไลน์สำเร็จ ค่อยเริ่มนับเพื่อนใหม่ (กัน sync ชุดแรกสแปม)
let __onSeen = null;                  // friend ids ที่เห็นรอบก่อน (null = ยังไม่เคยเรนเดอร์โหมดออนไลน์)
let __onFirstTs = 0;                  // เวลาเรนเดอร์โหมดออนไลน์ครั้งแรก
let __onFlashPend = null;             // เพื่อนรอแฟลช (โผล่ตอนกล่องถูกซ่อน เช่น อยู่หน้าเกม)

/* รอบ 178 (สเปกผู้ใช้): กล่องเพื่อนออนไลน์ = พลิกหน้าทีละคน (1 แถว = 2 บรรทัด: ชื่อ+กิจกรรม)
   พลิก 180° (ครึ่งออก+ครึ่งเข้า rotateX แบบเด็คภารกิจ) วนอัตโนมัติ · แตะ = หยุด ·
   ลากขึ้น/ลง = พลิกทีละหน้าตามจังหวะนิ้ว · ปล่อยนิ้วเกิน 5 วิ = พลิกวนต่อเอง ไม่มีวันหยุด */
const ONLINE_FLIP_MS = 5000;          // จังหวะพลิกอัตโนมัติ
const ONLINE_FLIP_RESUME = 5000;      // ms หลังปล่อยนิ้วค่อยพลิกต่อ (ตามสเปก 5 วิ)
const ONLINE_SWIPE_STEP = 34;         // ลากกี่ px = พลิก 1 หน้า
let __onPages = [], __onPage = 0, __onHold = 0;
let __onDownY = null, __onAcc = 0, __onSwiped = false;

function onPageDraw(cls){
  const el = document.getElementById('online-card');
  if(!el) return;
  if(!__onPages.length){ el.innerHTML = ''; return; }
  if(__onPage >= __onPages.length) __onPage = 0;
  el.innerHTML = `<div class="on-page${cls ? ' ' + cls : ''}">${__onPages[__onPage]}</div>`;
  if(cls) setTimeout(()=>{ const p = el.querySelector('.on-page'); if(p) p.classList.remove(cls); }, 320);
}
function onPageFlip(dir){
  const el = document.getElementById('online-card');
  if(!el || __onPages.length < 2) return;
  const noAnim = document.documentElement.classList.contains('no-anim');
  const go = ()=>{ __onPage = (__onPage + dir + __onPages.length) % __onPages.length;
    onPageDraw(noAnim ? '' : (dir > 0 ? 'flip-in-up' : 'flip-in-down')); };
  const p = el.querySelector('.on-page');
  if(noAnim || !p){ go(); return; }
  p.classList.add(dir > 0 ? 'flip-out-up' : 'flip-out-down');
  setTimeout(go, 160);
}
function bindOnlinePager(el){
  if(el.dataset.pager) return;         // element ใหม่ทุก renderDashboard → ผูกใหม่ได้เสมอ
  el.dataset.pager = '1';
  el.addEventListener('pointerdown', e=>{ __onDownY = e.clientY; __onAcc = 0; __onSwiped = false;
    __onHold = Date.now() + 9e9; });   // นิ้วแตะค้าง = หยุดพลิกไปก่อน (ตั้งเวลาจริงตอนปล่อย)
  el.addEventListener('pointermove', e=>{
    if(__onDownY === null) return;
    const dy = e.clientY - __onDownY;
    if(Math.abs(dy - __onAcc) >= ONLINE_SWIPE_STEP){       // ทุกๆ ระยะลาก = พลิก 1 หน้า ตามจังหวะนิ้ว
      const dir = (dy - __onAcc) < 0 ? 1 : -1;             // ลากขึ้น = หน้าถัดไป (เหมือนเลื่อนอ่านต่อ)
      __onAcc = dy; __onSwiped = true;
      onPageFlip(dir);
    }
  });
  // ลากแล้วปล่อยบนแถว — กันเด้งเมนูเพื่อน (click delegation ที่ document) · จับที่ capture ก่อนถึงมัน
  el.addEventListener('click', e=>{ if(__onSwiped){ e.stopPropagation(); e.preventDefault(); __onSwiped = false; } }, true);
  el.addEventListener('wheel', ()=>{ __onHold = Date.now() + ONLINE_FLIP_RESUME; }, {passive:true});
  el.addEventListener('wheel', e=>{ onPageFlip(e.deltaY > 0 ? 1 : -1); }, {passive:true});
  if(!window.__onGestUp){               // ปล่อยนิ้วที่ไหนก็ได้ = เริ่มนับ 5 วิ (ผูกครั้งเดียวระดับ window)
    window.__onGestUp = true;
    const up = ()=>{ if(__onDownY === null) return; __onDownY = null;
      __onHold = Date.now() + ONLINE_FLIP_RESUME; };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  if(!window.__onFlipTimer) window.__onFlipTimer = setInterval(()=>{
    const box = document.getElementById('online-card');
    if(!box || !box.clientHeight) return;                  // จอถูกซ่อน
    if(Date.now() < __onHold) return;                      // ผู้ใช้กำลังแตะ/เพิ่งปล่อย
    onPageFlip(1);
  }, ONLINE_FLIP_MS);
}

function renderOnlineCard(){
  const el = document.getElementById('online-card');
  if(!el) return;
  delete sideScrollSt[el.id];            // รอบ 178: เลิกเลื่อนวน — กัน ticker รอบ 149 มาห่อ ss-chunk
  const lab = document.getElementById('online-label');  // หัวข้อนอกกล่อง (รอบ 149) — ติดป้าย "ออนไลน์จริง" เมื่อต่อ Firebase สำเร็จ
  if(lab) lab.innerHTML = `🧑‍🤝‍🧑 คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา${(typeof Online !== 'undefined' && Online.ready) ? ' <span class="online-live">🌏 ออนไลน์จริง</span>' : ''}`;
  const sub = document.getElementById('online-sub');     // บรรทัดจำนวนเพื่อน — ย้ายออกนอกกล่อง ใต้หัวข้อ (สเปกผู้ใช้)
  const meName = state.profileName || (state.student ? state.student.first : '') || selfTag();
  const meGrade = state.student ? state.student.grade : '';
  const meUid = (typeof onlineKey === 'function') ? onlineKey() : '';
  const meBadges = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';   // 🎖️ เข็มของเราต่อท้ายชื่อ (โชว์ทันทีจาก state)
  const meRow = `<div class="online-row online-me">
      <span class="online-dot"></span>
      <span class="online-name pl-click" data-uid="${escapeHTML(meUid)}" data-n="${escapeHTML(meName + meBadges)}" data-g="${escapeHTML(meGrade)}">⭐ ${escapeHTML(meName)}${meBadges} (${selfTag()})</span>
      <span class="online-act">${idTag(meUid)} · กำลังเล่นอยู่ตอนนี้</span>
    </div>`;

  /* ---- โหมดออนไลน์จริง ---- */
  if(typeof Online !== 'undefined' && Online.ready){
    if(sub) sub.textContent = `ตอนนี้มีเพื่อนออนไลน์ ${Online.friends.length + 1} คน 💚`;
    /* รอบ 152: เพื่อนใหม่เพิ่งออนไลน์ → toast + หน้าแฟลชฟ้า (ชุดแรกตอนต่อสำเร็จไม่นับ กันสแปม) */
    const ids = Online.friends.map(f=>String(f.id||'')).filter(Boolean);
    if(__onSeen === null){
      __onSeen = ids; __onFirstTs = Date.now();
    }else{
      const fresh = ids.filter(id=>!__onSeen.includes(id));
      __onSeen = ids;
      if(fresh.length && Date.now() - __onFirstTs > FRIEND_FLASH_GRACE){
        __onFlashPend = fresh[0];
        const f = Online.friends.find(x=>String(x.id) === __onFlashPend);
        if(typeof toast === 'function')
          toast(fresh.length > 1 ? `🎉 เพื่อน ${fresh.length} คนมาออนไลน์แล้ว!`
                                 : `🎉 ${f ? f.n : 'เพื่อน'} มาออนไลน์แล้ว!`);
        if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
      }
    }
    let flashFid = null, flashInv = null;    // กล่องมองเห็นอยู่ค่อยใช้ (ซ่อนอยู่ = pend รอตอนกลับ lobby)
    if(el.clientHeight){
      if(__onFlashPend){ flashFid = __onFlashPend; __onFlashPend = null; }
      if(window.__invFlashPend){ flashInv = window.__invFlashPend; window.__invFlashPend = null; }
    }
    /* รอบ 153: แถวเพื่อน = เมนูลัดทั้งแถว · รอบ 178: 1 แถว (2 บรรทัด) = 1 หน้าพลิก */
    const rows = Online.friends.map(f=>{
      const fid = String(f.id||'');
      return `<div class="online-row${flashFid === fid ? ' on-flash' : ''}" data-fid="${escapeHTML(fid)}" data-n="${escapeHTML(f.n)}" data-g="${escapeHTML(f.g)}">
      <span class="online-dot"></span>
      <span class="online-name">${escapeHTML(f.n)}</span>
      <span class="online-act">${idTag(fid)} · ${escapeHTML(f.act)}</span>
    </div>`;
    });
    bindPlayerClicks();
    bindFriendQuickMenu();
    /* รอบ 154: การ์ดคำชวน — หน้าของตัวเอง (สำคัญ มีปุ่ม) · "ไว้ก่อน" = ซ่อนเฉพาะเซสชัน */
    if(!Online.tinvHidden) Online.tinvHidden = {};
    const TINV_W = {adv:{ico:'🌍',label:'ผจญภัย'}, haunt:{ico:'👻',label:'ผีสิง'}, heli:{ico:'🚁',label:'เฮลิคอปเตอร์'}};
    const invEntries = Object.entries(Online.tinv || {}).filter(([fid])=>!Online.tinvHidden[fid]);
    const invs = invEntries.map(([fid,v])=>{
      const w = TINV_W[v.map] || {ico:'🌍', label:'3D'};
      return `<div class="inv-card${flashInv === fid ? ' on-flash' : ''}" data-fid="${escapeHTML(fid)}">
        <div class="inv-txt">📨 <b>${escapeHTML(v.n)}</b> ชวนไปเล่น<b>โลก${w.label} ${w.ico}</b><br>เจอกันใน map รับคนละ 🪙${fmtNum(TINV_CASHBACK)}!</div>
        <div class="inv-btns">
          <button class="inv-go" data-map="${escapeHTML(v.map)}" type="button">🚀 ไปเลย!</button>
          <button class="inv-x" data-fid="${escapeHTML(fid)}" type="button">ไว้ก่อน</button>
        </div>
      </div>`;
    });
    bindInviteCards();
    __onPages = [...invs, meRow, ...rows];
    if(!rows.length) __onPages.push('<div class="online-note">ยังไม่มีเพื่อนคนอื่นออนไลน์ตอนนี้ — ชวนเพื่อนมาเล่นด้วยกันสิ! 🎉</div>');
    /* เพื่อนใหม่/คำชวนใหม่ → พลิกไปหน้านั้นเลย + ค้าง 5 วิ (แถวติด on-flash มาแล้ว) */
    if(flashInv !== null){
      const i = invEntries.findIndex(([fid])=>fid === flashInv);
      if(i >= 0){ __onPage = i; __onHold = Date.now() + QUEST_FLASH_HOLD; }
    }else if(flashFid !== null){
      const i = Online.friends.findIndex(f=>String(f.id||'') === flashFid);
      if(i >= 0){ __onPage = invs.length + 1 + i; __onHold = Date.now() + QUEST_FLASH_HOLD; }
    }
    onPageDraw('');
    bindOnlinePager(el);
    return;
  }
  __onSeen = null;                           // หลุดออนไลน์ → เริ่มนับใหม่ตอนต่อกลับ (กันเน็ตกระพริบสแปม toast)

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
      <span class="online-act">${idTag(f.n)} · ${ONLINE_ACTIVITIES[Math.floor(rnd()*ONLINE_ACTIVITIES.length)]}</span>
    </div>`);
  if(sub) sub.textContent = `ตอนนี้มีเพื่อนออนไลน์ ${count + 1} คน 💚`;
  __onPages = [meRow, ...rows];
  onPageDraw('');
  bindPlayerClicks();
  bindOnlinePager(el);
}

/* ============================================================
   รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
   🤝 ชวนเล่นโลก 3D (tinv — เจอกันรับเงินคืน) · 🎁 ของขวัญ · 💬 ทักทาย (เฉพาะเพื่อนกันแล้ว)
   ยังไม่เป็นเพื่อน = ➕ ส่งคำขอเป็นเพื่อน · 👤 ดูข้อมูล (แทน pl-click ที่ชื่อแบบเดิม)
   ============================================================ */
/* รอบ 154: ปุ่มบนการ์ดคำชวนในกล่องเพื่อนออนไลน์ — 🚀 ไปเลย! / ไว้ก่อน (ผูกครั้งเดียว)
   🚀 ใช้ railWorldClick ของปุ่มรางโลก 3D: บาดเจ็บ→ชวนไปรักษา · ไม่มีตั๋ว→พาไปการ์ดซื้อในร้าน · มีตั๋ว→เข้าโลกเลย */
function bindInviteCards(){
  if(window.__invBound) return;
  window.__invBound = true;
  document.addEventListener('click', (e)=>{
    const go = e.target.closest('#online-card .inv-go');
    if(go){
      const w = (typeof WORLD3D !== 'undefined') ? WORLD3D.find(x=>x.mode === go.dataset.map) : null;
      if(w) railWorldClick(w);
      return;
    }
    const x = e.target.closest('#online-card .inv-x');
    if(x){
      if(!Online.tinvHidden) Online.tinvHidden = {};
      Online.tinvHidden[x.dataset.fid] = true;   // ซ่อนเฉพาะเซสชัน — คำชวนใน DB ยังอยู่ เข้าเกมใหม่เห็นอีก
      sfx.select();
      renderOnlineCard();
    }
  });
}

function bindFriendQuickMenu(){
  if(window.__fqBound) return;               // ผูก listener ครั้งเดียว (การ์ด re-render บ่อย)
  window.__fqBound = true;
  document.addEventListener('click', (e)=>{
    const row = e.target.closest('#online-card .online-row[data-fid]');
    if(!row) return;
    openFriendQuickMenu(row.dataset.fid, row.dataset.n || 'เพื่อน', row.dataset.g || '');
  });
}

function openFriendQuickMenu(uid, name, grade){
  if(!uid || typeof Online === 'undefined' || !Online.ready) return;
  sfx.select();
  document.querySelectorAll('.fq-overlay').forEach(o=>o.remove());   // เปิดซ้ำ = แทนที่อันเก่า
  const isFriend = (Online.myFriends || []).some(f=>f.uid === uid);
  const sp = (typeof splitNameBadges === 'function') ? splitNameBadges(name) : {name, badges:''};
  const sent = state.tinvSent || {};
  const wbtn = (map, emo, lab)=>{
    const s = sent[uid] && sent[uid].map === map;                    // ชวนโลกนี้ไปแล้ว = ติ๊กถูก กดซ้ำไม่ได้
    return `<button class="fq-world" data-map="${map}" ${s ? 'disabled' : ''} type="button">${emo} ${lab}${s ? ' ✓' : ''}</button>`;
  };
  const overlay = document.createElement('div');
  overlay.className = 'fq-overlay';
  overlay.innerHTML = `<div class="fq-box">
    <div class="fq-head">
      <span>🧑‍🤝‍🧑 ${escapeHTML(sp.name)}${escapeHTML(sp.badges)} <small>${idTag(uid)}</small></span>
      <button class="fq-close" type="button">✕</button>
    </div>
    <div class="fq-sec">🤝 ชวนเล่นด้วยกัน — เจอกันใน map รับคนละ 🪙${fmtNum(TINV_CASHBACK)}</div>
    <div class="fq-worlds">${wbtn('adv','🌍','ผจญภัย')}${wbtn('haunt','👻','ผีสิง')}${wbtn('heli','🚁','เฮลิฯ')}</div>
    <div class="fq-acts">
      ${isFriend
        ? `<button class="fq-act" data-act="gift" type="button">🎁 ส่งของขวัญ</button>
           <button class="fq-act" data-act="chat" type="button">💬 ทักทาย</button>`
        : `<button class="fq-act" data-act="addfr" type="button">➕ ส่งคำขอเป็นเพื่อน</button>`}
      <button class="fq-act" data-act="info" type="button">👤 ดูข้อมูล</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  const close = ()=>overlay.remove();
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
  overlay.querySelector('.fq-close').addEventListener('click', close);
  overlay.querySelectorAll('.fq-world').forEach(b=>b.addEventListener('click', ()=>{
    b.disabled = true;
    tinvSend(uid, b.dataset.map).then(()=>{
      state.tinvSent[uid] = {map: b.dataset.map, ts: Date.now()};
      saveState();
      sfx.buy();
      toast(`📨 ส่งคำชวนถึง ${sp.name} แล้ว! เข้าโลกรอเจอกันได้เลย`);
      close();
    }).catch(()=>{ b.disabled = false; toast('ส่งคำชวนไม่สำเร็จ ลองใหม่นะ'); });
  }));
  overlay.querySelectorAll('.fq-act').forEach(b=>b.addEventListener('click', ()=>{
    const act = b.dataset.act;
    close();
    if(act === 'gift') openGiftPicker({uid, n: sp.name, g: grade});
    else if(act === 'chat') openChat({uid, n: sp.name, g: grade});
    else if(act === 'addfr'){
      friendRequest(uid)
        .then(()=>{ sfx.buy(); toast(`📨 ส่งคำขอเป็นเพื่อนถึง ${sp.name} แล้ว! รอเพื่อนกดรับนะ 😊`); })
        .catch(()=>toast('ส่งคำขอไม่สำเร็จ ลองใหม่นะ'));
    }
    else if(act === 'info') showPlayerCard(uid, name, grade);
  }));
}

/* ============================================================
   การ์ด Leaderboard — สลับ 2 แท็บในการ์ดเดียว (ประหยัดพื้นที่):
   🪙 เหรียญ (นักสะสมเหรียญ Top 50) · 🏅 เข็ม (แต้มรวมเข็มสะสม)
   ข้อมูลจริงจาก Firebase — ออฟไลน์โชว์ข้อความเชิญชวนแทน
   ============================================================ */
let lbTab = 'coins';                                   // แท็บกระดานที่เปิดอยู่: 'coins' | 'badges'
function bindLbTabs(){
  if(window.__lbTabBound) return;                      // ผูก listener ครั้งเดียว (การ์ด re-render บ่อย)
  window.__lbTabBound = true;
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('.lb-tab');
    if(!t) return;
    lbTab = t.dataset.tab === 'badges' ? 'badges' : 'coins';
    if(typeof sfx !== 'undefined' && sfx.click) sfx.click();
    renderLeaderboardCard();
  });
}
function renderLeaderboardCard(){
  const el = document.getElementById('leaderboard-card');
  if(!el) return;
  bindLbTabs();
  // รอบ 151: แท็บอยู่นอกกล่อง (แถวหัวข้อ #lb-tabs-out) — ไม่วนไปกับเนื้อหา
  const out = document.getElementById('lb-tabs-out');
  if(out) out.innerHTML = `
    <button class="lb-tab${lbTab==='coins' ? ' active' : ''}" data-tab="coins">🪙 เหรียญ</button>
    <button class="lb-tab${lbTab==='badges' ? ' active' : ''}" data-tab="badges">🏅 เข็ม</button>`;
  if(typeof Online === 'undefined' || !Online.ready){
    el.innerHTML = `<div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อดูอันดับผู้เล่นจากทุกโรงเรียนนะ!</div>`;
    initSideScroll(el);
    return;
  }
  el.innerHTML = (lbTab === 'badges' ? lbBadgeHtml() : lbCoinHtml());
  bindPlayerClicks();
  initSideScroll(el);
}

/* 🪙 เนื้อหาแท็บเหรียญ */
function lbCoinHtml(){
  if(!Online.board.length) return `<div class="lb-empty">ยังไม่มีใครขึ้นกระดาน — เล่นเกมเก็บเหรียญเป็นคนแรกเลย! 🥇</div>`;
  const medal = (i)=> i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : (i+1);
  const myId = onlineKey();
  const myIdx = Online.board.findIndex(r=>r.id === myId);
  const rows = Online.board.map((r,i)=>`
    <div class="lb-row${r.id === myId ? ' lb-me' : ''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g)}">${r.id === myId ? '⭐ ' : ''}${escapeHTML(r.n)}<small> ${idTag(r.id)}</small></span>
      <span class="lb-coins">🪙 ${fmtNum(r.coins)}</span>
    </div>`).join('');
  return `<div class="online-count">${myIdx >= 0 ? `${selfPronoun()}อยู่อันดับที่ ${myIdx + 1} จาก ${Online.board.length} คน 🎯` : `เก็บเหรียญเพิ่มเพื่อไต่ขึ้นกระดานนะ 💪`}</div>
    <div class="lb-list">${rows}</div>`;
}

/* 🏅 เนื้อหาแท็บเข็ม — จัดอันดับด้วยแต้มรวมเข็ม (baked ในชื่อ presence/leaderboard.n) */
function lbBadgeHtml(){
  if(typeof badgeScore !== 'function') return `<div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อดูอันดับเข็มของเพื่อนๆ นะ!</div>`;
  const myId = onlineKey();
  const meName = state.profileName || (state.student ? state.student.first : '') || 'หนู';
  const meBadges = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';
  const map = {};                                      // รวมผู้เล่นจากกระดานเหรียญ + แทนที่เราด้วยเข็มสด
  (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g}; });
  map[myId] = {id:myId, n: meName + meBadges, g: (state.student ? state.student.grade : '')};
  let rows = Object.values(map).map(r=>{
    const sp = splitNameBadges(r.n);
    return {id:r.id, name:sp.name, badges:sp.badges, g:r.g, score:badgeScore(r.n), me:r.id===myId};
  }).filter(r=>r.score > 0);
  rows.sort((a,b)=> b.score - a.score || badgeEmojis(b.badges).length - badgeEmojis(a.badges).length);
  if(!rows.length) return `<div class="lb-empty">ยังไม่มีใครได้เข็มเลย — เล่นเก่งๆ เก็บเข็มเป็นคนแรกเลย! 🏅</div>`;
  const myIdx = rows.findIndex(r=>r.me);
  const medal = (i)=> i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : (i+1);
  const list = rows.slice(0, LEADERBOARD_SIZE).map((r,i)=>`
    <div class="lb-row${r.me ? ' lb-me' : ''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.name + r.badges)}" data-g="${escapeHTML(r.g||'')}">${r.me ? '⭐ ' : ''}${escapeHTML(r.name)}<small class="lb-badgeline">${r.badges} · ${r.score} แต้ม</small></span>
    </div>`).join('');
  return `<div class="online-count">${myIdx >= 0 ? `${selfPronoun()}อยู่อันดับเข็มที่ ${myIdx + 1} จาก ${rows.length} คน 🏅` : `ยังไม่มีเข็ม — เก็บเข็มแล้วมาไต่กระดานนะ 💪`}</div>
    <div class="lb-list">${list}</div>`;
}

/* ============================================================
   การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
   เงินรวม · จำนวนทรัพย์สิน · มูลค่าทรัพย์สินรวม (แยกกัน ไม่รวมยอด)
   เพื่อเป็นแรงบันดาลใจให้ผู้เล่นอื่นตั้งใจเล่น
   ============================================================ */
function bindPlayerClicks(){
  if(window.__plClickBound) return;         // ผูก listener ครั้งเดียว (การ์ด re-render บ่อย)
  window.__plClickBound = true;
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('.pl-click');
    if(!t) return;
    showPlayerCard(t.dataset.uid, t.dataset.n || 'ผู้เล่น', t.dataset.g || '');
  });
}

function showPlayerCard(uid, name, grade){
  // แยกเข็มออกจากชื่อ (เข็ม baked มากับชื่อจาก presence/leaderboard) → โชว์เป็นแถวเข็มสวยๆ
  const sp = (typeof splitNameBadges === 'function') ? splitNameBadges(name) : {name, badges:''};
  const arr = (typeof badgeEmojis === 'function') ? badgeEmojis(sp.badges) : [];
  const badgeRow = arr.length
    ? `<div class="pl-badges">${arr.map(e=>`<span class="pl-badge-chip"><b>${e}</b> ${escapeHTML((BADGE_META[e]||{}).n||'')}</span>`).join('')}</div>`
    : '';
  // 📰 รอบ 155: การ์ดยืดกว้างเกือบเต็มจอ + ปุ่ม Follow + กิจกรรมล่าสุด + กริดทรัพย์สินที่เปิดเผย
  const me = (typeof onlineKey === 'function') && uid === onlineKey();
  const canFollow = !!uid && !me && typeof followSet === 'function'
                    && typeof Online !== 'undefined' && Online.ready;
  const ov = document.createElement('div');
  ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="pl-card pl-wide">
      <button class="pl-close">✕</button>
      <div class="pl-head">👤 <span>${escapeHTML(sp.name)}</span>
        ${canFollow ? `<button class="pl-follow"></button>` : ''}
      </div>
      <div class="pl-grade">${idTag(uid) || 'ผู้เล่น Vocab World'}<span class="pl-followers"></span></div>
      ${badgeRow}
      <div class="pl-body">
        <div class="pl-cols">
          <div class="pl-col pl-stats-col"><div class="pl-loading">⏳ กำลังโหลดข้อมูล...</div></div>
          <div class="pl-col">
            <div class="pl-sec-title">📰 กิจกรรมล่าสุด</div>
            <div class="pl-feed"><div class="pl-loading">⏳ กำลังโหลด...</div></div>
          </div>
        </div>
        <div class="pl-pets-wrap" style="display:none">
          <div class="pl-sec-title">🐾 สัตว์เลี้ยง</div>
          <div class="pl-pets"></div>
        </div>
        <div class="pl-assets-wrap" style="display:none">
          <div class="pl-sec-title">🏆 ทรัพย์สินที่เปิดเผย</div>
          <div class="pl-assets"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const close = ()=>ov.remove();
  ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
  ov.querySelector('.pl-close').addEventListener('click', close);

  /* ---- ปุ่ม Follow (ทางเดียวแบบ TikTok ไม่ต้องอนุมัติ) + จำนวนผู้ติดตาม ---- */
  const loadFollowers = ()=>{
    if(typeof fetchFollowers !== 'function') return;
    fetchFollowers(uid).then(n=>{
      const el = ov.querySelector('.pl-followers');
      if(el && n != null) el.textContent = ` · 👥 ผู้ติดตาม ${fmtNum(n)} คน`;
    });
  };
  const fBtn = ov.querySelector('.pl-follow');
  if(fBtn){
    const paintFollow = ()=>{
      const onF = !!(state.follows && state.follows[uid]);
      fBtn.textContent = onF ? '✓ ติดตามแล้ว' : '➕ ติดตาม';
      fBtn.classList.toggle('on', onF);
    };
    paintFollow();
    fBtn.addEventListener('click', ()=>{
      if(state.follows && state.follows[uid]){
        followUnset(uid);
        toast(`เลิกติดตาม ${sp.name} แล้ว`);
      }else{
        followSet(uid, sp.name, grade || '');
        sfx.select();
        toast(`📰 ติดตาม ${sp.name} แล้ว! กิจกรรมของเขาจะมาโชว์ในฟีดหน้าหลัก`);
      }
      paintFollow();
      setTimeout(loadFollowers, 600);   // รอ DB รับค่าก่อนนับใหม่
      if(typeof renderFeedCard === 'function') renderFeedCard();
    });
  }
  loadFollowers();

  /* ---- คอลัมน์ซ้าย: สถิติการเงิน (เดิม) ---- */
  const statsFn = (typeof fetchPlayerStats === 'function') ? fetchPlayerStats(uid) : Promise.resolve(null);
  statsFn.then(d=>{
    const body = ov.querySelector('.pl-stats-col');
    if(!body) return;
    if(!d){
      body.innerHTML = `<div class="pl-none">ยังไม่มีข้อมูลของผู้เล่นคนนี้ 😅<br>
        <small>ผู้เล่นต้องเข้าเกมสักครั้งเพื่อบันทึกข้อมูลก่อนนะ</small></div>`;
      return;
    }
    const av = (d.av == null) ? '—' : fmtNum(d.av) + ' 🪙';
    const ni = (d.ni == null) ? '—' : fmtNum(d.ni) + ' ชิ้น';
    body.innerHTML = `
      ${d.me ? `<div class="pl-me-tag">⭐ นี่คือ${selfTag()}</div>` : ''}
      <div class="pl-stat">
        <span class="pl-lbl">💰 เงินรวม</span>
        <span class="pl-val pl-gold">${fmtNum(d.coins)} 🪙</span>
      </div>
      <div class="pl-stat">
        <span class="pl-lbl">📦 จำนวนทรัพย์สิน</span>
        <span class="pl-val">${ni}</span>
      </div>
      <div class="pl-stat">
        <span class="pl-lbl">🏆 มูลค่าทรัพย์สินรวม</span>
        <span class="pl-val pl-gold">${av}</span>
      </div>
      <div class="pl-tip">✨ ตั้งใจเล่น เก็บเงินและสะสมทรัพย์สินให้เยอะๆ นะ!</div>`;
  });

  /* ---- คอลัมน์ขวา: กิจกรรมล่าสุด (เห็นตามหมวดที่เจ้าตัวเปิดเผย — ไม่ต้อง follow ก็เห็น) ---- */
  const feedFn = (typeof fetchPlayerFeed === 'function') ? fetchPlayerFeed(uid) : Promise.resolve([]);
  feedFn.then(list=>{
    const el = ov.querySelector('.pl-feed');
    if(!el) return;
    if(!list.length){
      el.innerHTML = `<div class="pl-none">ยังไม่มีกิจกรรมที่เปิดเผย 🔒<br>
        <small>${me ? 'เปิดเผยกิจกรรมของหนูได้ในตั้งค่า ⚙️ (default ปิดทุกหมวด)' : 'ผู้เล่นเลือกเองได้ว่าจะเปิดเผยอะไรในตั้งค่า ⚙️'}</small></div>`;
      return;
    }
    el.innerHTML = list.map(it=>{
      const fc = (typeof FEED_CATS !== 'undefined' && FEED_CATS[it.c]) || {e:'✨'};
      return `<div class="pl-feed-row"><span class="feed-ico">${fc.e}</span>
        <span class="feed-txt">${escapeHTML(it.tx)} <small class="feed-ago">· ${feedAgo(it.ts)}</small></span></div>`;
    }).join('');
  });

  /* ---- แถวล่าง: กริดทรัพย์สินที่เปิดเผย (ตารางแบบหน้าโรงงาน · ชิ้นซ้ำใส่เลขจำนวนซ้อนมุม) ---- */
  const assetsFn = (typeof fetchPlayerAssets === 'function') ? fetchPlayerAssets(uid) : Promise.resolve(null);
  assetsFn.then(counts=>{
    if(!counts) return;
    const ids = Object.keys(counts).filter(id=>collectInfo(id));
    if(!ids.length) return;
    const wrap = ov.querySelector('.pl-assets-wrap');
    const gridEl = ov.querySelector('.pl-assets');
    if(!wrap || !gridEl) return;
    // เรียงตามมูลค่าแพง→ถูก ให้ของเด่นขึ้นก่อน
    ids.sort((a,b)=>collectInfo(b).price - collectInfo(a).price);
    gridEl.innerHTML = ids.map(id=>{
      const c = collectInfo(id);
      const img = collectImg(id);
      const n = Math.max(1, Math.min(999, Math.round(counts[id])));
      return `<div class="pl-asset" title="${escapeHTML(c.name)}">
        ${img ? `<img src="${img}" alt="">` : `<span class="pl-asset-emoji">${c.emoji}</span>`}
        ${n > 1 ? `<span class="pl-asset-n">×${n}</span>` : ''}
      </div>`;
    }).join('');
    wrap.style.display = '';
  });

  /* ---- 🐾 รอบ 195: สัตว์เลี้ยง (สูงสุด 3 ตัว) — ของตัวเองจาก state · คนอื่นจาก DB ถ้าเปิดเผย ---- */
  const petsFn = (typeof fetchPlayerPets === 'function') ? fetchPlayerPets(uid) : Promise.resolve(null);
  petsFn.then(list=>{
    if(!list || !list.length) return;
    const wrap = ov.querySelector('.pl-pets-wrap');
    const gridEl = ov.querySelector('.pl-pets');
    if(!wrap || !gridEl) return;
    gridEl.innerHTML = list.map(d=>{
      const img = petDescImg(d);
      const nm = d.nm || ((PETS[d.t] || {}).name) || 'สัตว์เลี้ยง';
      return `<div class="pl-pet" title="${escapeHTML(nm)}" data-name="${escapeHTML(nm)}">
        ${img ? `<img src="${img}" alt="">` : `<span class="pl-asset-emoji">${(PETS[d.t] || {}).emoji || '🐾'}</span>`}
        <span class="pl-pet-nm">${escapeHTML(nm)}</span>
      </div>`;
    }).join('');
    wrap.style.display = '';
  });

  /* ---- 🖼️ รอบ 195: แตะภาพเล็ก (สัตว์เลี้ยง/ทรัพย์สิน) → เปิดภาพใหญ่เกือบเต็มจอ (ไม่มี scroll) ---- */
  ov.addEventListener('click', (e)=>{
    const cell = e.target.closest('.pl-pet, .pl-asset');
    if(!cell) return;
    const img = cell.querySelector('img');
    const src = img && img.getAttribute('src');
    if(src) openImgLightbox(src, cell.dataset.name || cell.getAttribute('title') || '');
  });
}

/* ภาพสัตว์เลี้ยงจากตัวย่อ {t,s,sh,e} — ใช้ไฟล์ภาพชุดเดียวกับในเกม (probe แล้วใน IMG_FILES) */
function petDescImg(d){
  if(!d || !d.t) return null;
  const P = (typeof PETS !== 'undefined') ? PETS[d.t] : null;
  if(d.s === 'egg') return (P && IMG_FILES[`${d.t}_${P.startKey}`]) || null;
  const cands = [];
  if(d.s === 'adult' && d.sh && d.sh !== 'normal') cands.push(`${d.t}_adult_${d.sh}`);
  if(d.e) cands.push(`${d.t}_${d.s}_${d.e}`);
  cands.push(`${d.t}_${d.s}_normal`);
  for(const k of cands){ if(IMG_FILES[k]) return IMG_FILES[k]; }
  return null;
}

/* 🖼️ รอบ 195: Layer ภาพใหญ่ (lightbox) — เกือบเต็มจอ · object-fit:contain ไม่มี scrollbar · แตะที่ไหนก็ปิด */
function openImgLightbox(src, caption){
  if(!src) return;
  const lb = document.createElement('div');
  lb.className = 'img-lightbox';
  lb.innerHTML = `<div class="ilb-inner">
      <img src="${src}" alt="">
      ${caption ? `<div class="ilb-cap">${escapeHTML(caption)}</div>` : ''}
      <button class="ilb-x" type="button" aria-label="ปิด">✕</button>
    </div>`;
  document.body.appendChild(lb);
  requestAnimationFrame(()=>lb.classList.add('on'));
  const close = ()=>{ lb.classList.remove('on'); setTimeout(()=>lb.remove(), 220); };
  lb.addEventListener('click', close);
  if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
}

/* ============================================================
   แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
   - ตัวโครง (รหัส/ช่องค้นหา) สร้างครั้งเดียว (dataset.built) กันช่องค้นหา
     ถูกล้างตอน presence tick · ส่วนที่ขยับ (คำขอ/เพื่อน) refresh แยก
   ============================================================ */
/* จุดแดงแจ้งบิลค้างบนปุ่มเมนู — บ้าน (บำรุง/ไฟ/น้ำ/ขยะ) · ร้านค้า (เน็ต/ข้อมูล) */
function updateBillBadges(){
  const homeDue = ['maint','elec','water','trash'].some(id => billOutstanding(id) > 0);
  const shopDue = ['net','data'].some(id => billOutstanding(id) > 0);
  const set = (id, on)=>{ const b = document.getElementById(id); if(!b) return; if(on){ b.textContent = '!'; b.style.display = ''; } else b.style.display = 'none'; };
  set('home-bill-badge', homeDue);
  set('shop-bill-badge', shopDue);
  updateSettingsBadge();
}

/* ตั้งเลข badge + เด้งครั้งเดียวตอน "เพิ่มขึ้น" (มีของใหม่เข้า) — ใช้ร่วมกันทุก badge นับเลข (เพื่อน/ของขวัญ/รวม)
   คืน true ถ้าเลขเพิ่ม (ให้ badge รวมเอาไปสั่น) · ไม่เด้งตอนโหลดแรก/เลขเท่าเดิม/ลด · no-anim ปิดการเด้งเอง */
const _badgeLast = {};
function setBadge(el, n){
  if(!el) return false;
  if(n > 0){ el.textContent = n; el.style.display = ''; }
  else el.style.display = 'none';
  const key = el.id, last = _badgeLast[key];
  const increased = (last != null && n > last && n > 0);
  if(increased){
    el.classList.remove('badge-pop'); void el.offsetWidth;   // รีสตาร์ตแอนิเมชัน
    el.classList.add('badge-pop');
    el.addEventListener('animationend', ()=>el.classList.remove('badge-pop'), {once:true});
  }
  _badgeLast[key] = n;
  return increased;
}

/* เลขรวมบนปุ่ม ⚙️ ตั้งค่า = บิลค้าง + คำขอเพื่อน/แชท + ของขวัญที่ยังไม่เปิด (attention รวมให้เห็นแต่ไกล) */
function updateSettingsBadge(){
  const b = document.getElementById('settings-badge');
  if(!b) return;
  const bills = ['maint','elec','water','trash','net','data'].filter(id => billOutstanding(id) > 0).length;
  const reqs  = (typeof Online !== 'undefined' && Online.reqs) ? Online.reqs.length : 0;
  const chats = (typeof Online !== 'undefined' && Online.chatUnread) ? Object.keys(Online.chatUnread).length : 0;
  const gifts = (typeof Online !== 'undefined' && Online.giftIn) ? Online.giftIn.length : 0;
  const meal  = (state.playerSick || dinnerDue()) ? 1 : 0;   // ข้อ 6: ข้าวเย็นคนยังไม่กิน/ป่วย
  // สั่นครั้งเดียวที่ badge รวม (แหล่งเดียว กันสั่นซ้ำกับ badge ย่อย) · badge ย่อยเด้งภาพพร้อมกันเอง
  if(setBadge(b, bills + reqs + chats + gifts + meal)
     && typeof state !== 'undefined' && state.haptic !== false && navigator.vibrate) navigator.vibrate(30);
}

/* แตะ badge บนปุ่ม ⚙️ → เมนูสรุปว่าค้างอะไร กดแถวไหนพาไปหน้านั้นเลย */
function openAttentionSummary(){
  const homeIds = ['maint','elec','water','trash'], shopIds = ['net','data'];
  const homeBills = homeIds.filter(id => billOutstanding(id) > 0).length;
  const shopBills = shopIds.filter(id => billOutstanding(id) > 0).length;
  const homeTotal = homeIds.reduce((s,id)=> s + billOutstanding(id), 0);
  const shopTotal = shopIds.reduce((s,id)=> s + billOutstanding(id), 0);
  const billTotal = homeTotal + shopTotal;
  const reqs  = (typeof Online !== 'undefined' && Online.reqs) ? Online.reqs.length : 0;
  const chats = (typeof Online !== 'undefined' && Online.chatUnread) ? Object.keys(Online.chatUnread).length : 0;
  const gifts = (typeof Online !== 'undefined' && Online.giftIn) ? Online.giftIn.length : 0;
  const rows = [];
  if(homeBills > 0)   rows.push({ico:'🏠', txt:`บิลบ้านค้าง ${homeBills} รายการ`, sub:`ค่าบำรุง/ไฟ/น้ำ/ขยะ · รวม 🪙${fmtNum(homeTotal)}`, panel:'panel-home'});
  if(shopBills > 0)   rows.push({ico:'🛍️', txt:`บิลร้านค้าค้าง ${shopBills} รายการ`, sub:`ค่าเน็ต/ค่าบริการข้อมูล · รวม 🪙${fmtNum(shopTotal)}`, panel:'panel-shop'});
  if(reqs + chats > 0) rows.push({ico:'👥', txt:`คำขอเพื่อน/ข้อความใหม่ ${reqs + chats}`, sub:'ไปดูที่แผงเพื่อน', panel:'panel-friends'});
  if(gifts > 0)       rows.push({ico:'🎁', txt:`ของขวัญรอเปิด ${gifts}`, sub:'ไปเปิดของขวัญ', panel:'panel-gifts'});
  if(state.playerSick)   rows.push({ico:'🤒', txt:'หนูป่วยเพราะไม่กินข้าวเย็น', sub:`ไปหาหมอ ค่ารักษา 🪙${fmtNum(CURE_COST)}`, act:'dinner'});
  else if(dinnerDue())   rows.push({ico:'🍚', txt:'ยังไม่ได้กินข้าวเย็นของหนู', sub:`กินก่อน 20:00 ไม่งั้นป่วยนะ · 🪙${fmtNum(DINNER_COST)}`, act:'dinner'});
  if(!rows.length) return;   // ไม่มีอะไรค้าง (ปกติ badge ซ่อนอยู่แล้ว)
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay attn-overlay';
  overlay.innerHTML = `<div class="levelup-box attn-box">
    <h2 style="margin:0 0 8px">🔔 มีอะไรต้องจัดการ</h2>
    <div class="attn-list">${rows.map(r=>`
      <button class="attn-row" data-panel="${r.panel||''}" data-act="${r.act||''}">
        <span class="attn-ico">${r.ico}</span>
        <span class="attn-txt"><b>${r.txt}</b><br><small>${r.sub}</small></span>
        <span class="attn-go">›</span>
      </button>`).join('')}</div>
    ${billTotal > 0 ? `<div class="attn-total">💰 บิลที่ต้องจ่ายรวม <b>🪙${fmtNum(billTotal)}</b></div>` : ''}
    <div style="margin-top:14px"><button class="set-close">ปิด</button></div>
  </div>`;
  overlay.querySelectorAll('.attn-row').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      overlay.remove();
      if(btn.dataset.act === 'dinner') dinnerClick();       // ข้าวเย็นคน (ข้อ 6) เปิดกล่องกิน/รักษา
      else openPanel(btn.dataset.panel);
    });
  });
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}
function updateFriendBadge(){
  const b = document.getElementById('friend-badge');
  if(!b) return;
  // รวมทั้งคำขอเป็นเพื่อน + เพื่อนที่ส่งข้อความใหม่มา (ข้อ 0.4) เป็นตัวเลขเดียวบนปุ่ม "เพื่อน"
  const reqs  = (typeof Online !== 'undefined' && Online.reqs) ? Online.reqs.length : 0;
  const chats = (typeof Online !== 'undefined' && Online.chatUnread) ? Object.keys(Online.chatUnread).length : 0;
  setBadge(b, reqs + chats);   // เด้งภาพเมื่อมีคำขอ/ข้อความใหม่ (สั่นให้ badge รวมจัดการ)
  updateSettingsBadge();
}

function renderFriendPanel(){
  const el = document.getElementById('friend-card');
  if(!el) return;
  updateFriendBadge();
  if(typeof Online === 'undefined' || !Online.ready){
    el.dataset.built = '';
    el.innerHTML = `<h3 class="shop-title">👥 เพื่อนของหนู</h3>
      <div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อเพิ่มเพื่อนและเล่นด้วยกันนะ!</div>`;
    return;
  }
  if(el.dataset.built !== '1'){
    el.innerHTML = `<h3 class="shop-title">👥 เพื่อนของหนู</h3>
      <div class="fr-code-box">
        <div class="fr-code-label">🎫 รหัสเพื่อนของหนู — บอกเพื่อนให้มาเพิ่มได้เลย</div>
        <div class="fr-code-row">
          <span class="fr-code" id="fr-my-code">${Online.myCode || '...'}</span>
          <button class="fr-copy-btn" id="fr-copy">📋 คัดลอก</button>
        </div>
      </div>
      <div class="fr-search-box">
        <div class="fr-code-label">🔍 ค้นหาเพื่อนจากรหัส 6 ตัว</div>
        <div class="fr-search-row">
          <input id="fr-search-input" maxlength="6" placeholder="เช่น ABC234" autocomplete="off">
          <button class="fr-search-btn" id="fr-search-go">ค้นหา</button>
        </div>
        <div id="fr-search-result"></div>
      </div>
      <div id="fr-reqs"></div>
      <div class="fr-list-title">👫 เพื่อนของฉัน (<span id="fr-count">0</span> คน)</div>
      <div id="fr-list"></div>`;
    el.dataset.built = '1';
    document.getElementById('fr-copy').addEventListener('click', ()=>{
      const code = Online.myCode || '';
      if(navigator.clipboard) navigator.clipboard.writeText(code).catch(()=>{});
      sfx.select(); toast('📋 คัดลอกรหัส ' + code + ' แล้ว!');
    });
    const input = document.getElementById('fr-search-input');
    input.addEventListener('input', ()=>{ input.value = input.value.toUpperCase().replace(/[^A-Z2-9]/g, ''); });
    document.getElementById('fr-search-go').addEventListener('click', friendDoSearch);
    input.addEventListener('keydown', e=>{ if(e.key === 'Enter') friendDoSearch(); });
  }else{
    const codeEl = document.getElementById('fr-my-code');
    if(codeEl) codeEl.textContent = Online.myCode || '...';
  }
  refreshFriendData();
}

/* ค้นหารหัสเพื่อน → โชว์ผล + ปุ่มส่งคำขอ (แยกจาก refresh เพื่อไม่โดนล้างตอน tick) */
function friendDoSearch(){
  const input = document.getElementById('fr-search-input');
  const out = document.getElementById('fr-search-result');
  if(!input || !out) return;
  const code = input.value.trim();
  if(code.length !== 6){ out.innerHTML = `<div class="fr-hint">พิมพ์รหัส 6 ตัวให้ครบนะ</div>`; return; }
  out.innerHTML = `<div class="fr-hint">🔎 กำลังค้นหา...</div>`;
  friendSearch(code).then(r=>{
    if(!r){ out.innerHTML = `<div class="fr-hint">😕 ไม่พบรหัสนี้ ลองเช็กอีกครั้งนะ</div>`; return; }
    if(r.self){ out.innerHTML = `<div class="fr-hint">😄 นี่คือรหัสของ${selfTag()}นะ!</div>`; return; }
    const nameHTML = `<span class="fr-row-name">${escapeHTML(r.n)}<small> ${idTag(r.uid)}</small></span>`;
    if(r.already){ out.innerHTML = `<div class="fr-found">${nameHTML}<span class="fr-hint">✅ เป็นเพื่อนกันแล้ว</span></div>`; return; }
    out.innerHTML = `<div class="fr-found">${nameHTML}<button class="fr-add-btn" id="fr-send-req">➕ ส่งคำขอเป็นเพื่อน</button></div>`;
    document.getElementById('fr-send-req').addEventListener('click', ()=>{
      const btn = document.getElementById('fr-send-req');
      btn.disabled = true;
      friendRequest(r.uid)
        .then(()=>{ sfx.buy(); out.innerHTML = `<div class="fr-hint">📨 ส่งคำขอถึง ${escapeHTML(r.n)} แล้ว! รอเพื่อนกดรับนะ 😊</div>`; })
        .catch(()=>{ btn.disabled = false; toast('ส่งคำขอไม่สำเร็จ ลองใหม่นะ'); });
    });
  }).catch(err=>{ out.innerHTML = `<div class="fr-hint">${escapeHTML(String(err))}</div>`; });
}

/* อัปเดตเฉพาะส่วนที่ขยับบ่อย: คำขอ + รายชื่อเพื่อน + badge */
function refreshFriendData(){
  updateFriendBadge();
  const reqEl = document.getElementById('fr-reqs');
  if(reqEl){
    if(Online.reqs.length){
      reqEl.innerHTML = `<div class="fr-list-title">📨 คำขอเป็นเพื่อน (${Online.reqs.length})</div>` +
        Online.reqs.map(r=>`<div class="fr-row fr-req">
          <span class="fr-row-name">${escapeHTML(r.n)}<small> ${idTag(r.uid)}</small></span>
          <span class="fr-req-btns">
            <button class="fr-accept" data-uid="${escapeHTML(r.uid)}">✅ รับ</button>
            <button class="fr-decline" data-uid="${escapeHTML(r.uid)}">✕</button>
          </span></div>`).join('');
      reqEl.querySelectorAll('.fr-accept').forEach(b=>b.addEventListener('click', ()=>{
        b.disabled = true;
        friendAccept(b.dataset.uid).then(()=>{ sfx.buy(); toast('🎉 เป็นเพื่อนกันแล้ว!'); })
          .catch(()=>{ b.disabled = false; toast('เพิ่มเพื่อนไม่สำเร็จ ลองใหม่นะ'); });
      }));
      reqEl.querySelectorAll('.fr-decline').forEach(b=>b.addEventListener('click', ()=>{
        friendDecline(b.dataset.uid).catch(()=>{});
      }));
    }else reqEl.innerHTML = '';
  }
  const cnt = document.getElementById('fr-count');
  if(cnt) cnt.textContent = Online.myFriends.length;
  const listEl = document.getElementById('fr-list');
  if(listEl){
    if(Online.myFriends.length){
      listEl.innerHTML = Online.myFriends.map((f,i)=>{
        const on = Online.presenceMap && Online.presenceMap[f.uid];
        const unread = Online.chatUnread && Online.chatUnread[f.uid];
        return `<div class="fr-row">
          <span class="online-dot${on ? '' : ' off'}"></span>
          <span class="fr-row-name">${escapeHTML(f.n)}<small> ${idTag(f.uid)}</small></span>
          <span class="fr-row-status">${on ? '💚' : '⚪'}</span>
          <button class="fr-gift-btn" data-gi="${i}">🎁 ส่งของขวัญ</button>
          <button class="fr-chat-btn${unread ? ' has-unread' : ''}" data-i="${i}">💬 แชท${unread ? '<span class="fr-unread">ใหม่!</span>' : ''}</button></div>`;
      }).join('');
      listEl.querySelectorAll('.fr-chat-btn').forEach(b=>b.addEventListener('click', ()=>{
        openChat(Online.myFriends[+b.dataset.i]);
      }));
      listEl.querySelectorAll('.fr-gift-btn').forEach(b=>b.addEventListener('click', ()=>{
        openGiftPicker(Online.myFriends[+b.dataset.gi]);
      }));
    }else listEl.innerHTML = `<div class="lb-empty">ยังไม่มีเพื่อน — บอกรหัสของหนูให้เพื่อน หรือค้นหารหัสเพื่อนด้านบนเพื่อเพิ่มกันนะ! 🤝</div>`;
  }
}

/* ============================================================
   แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
   ============================================================ */
/* แผง emoji แบบจัดกลุ่มเป็นหมวด (professional) — ทุกตัวปลอดภัยสำหรับเด็ก
   แต่ละหมวด: icon = ไอคอนบนแถบหมวด · list = emoji ในหมวดนั้น */
const CHAT_EMOJI_CATS = [
  {id:'faces', icon:'😊', list:[
    '😀','😃','😄','😁','😆','😊','🙂','🙃','😉','😌','😍','🥰','😘','😋','😜','🤪',
    '🤗','🤩','🥳','😎','🤓','🥺','😢','😭','😴','😮','😯','🤔','😇','😐','😅','😬']},
  {id:'gestures', icon:'👍', list:[
    '👍','👎','👌','✌️','🤞','🤟','🤙','👋','🙌','👏','🙏','💪','🤝','👊','✊','🖐️','🤚','☝️']},
  {id:'hearts', icon:'❤️', list:[
    '❤️','🧡','💛','💚','💙','💜','🤍','🖤','💖','💗','💓','💞','💕','💝','💘','❣️','💔','💌']},
  {id:'animals', icon:'🐶', list:[
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
    '🐧','🐦','🐤','🦄','🐝','🐢','🐬','🐟','🦋','🐙','🐳']},
  {id:'food', icon:'🍰', list:[
    '🍎','🍓','🍌','🍉','🍇','🍑','🍒','🍰','🎂','🧁','🍩','🍪','🍫','🍬','🍭','🍦',
    '🍨','🍿','🍕','🍔','🍟','🥤','🧃','☕']},
  {id:'activities', icon:'⚽', list:[
    '⚽','🏀','🏈','⚾','🎾','🏐','🎮','🕹️','🎯','🎲','🎨','🎵','🎸','🎤','🏆','🥇',
    '🎳','🚗','✈️','🚀','🎡','🚲']},
  {id:'symbols', icon:'🎉', list:[
    '🎉','🎊','✨','⭐','🌟','💫','🔥','🌈','☀️','🌸','🌷','🌹','🎁','🎈','💯','✅',
    '❌','❓','❗','💤','👑','🔔']},
];
/* 🎨 รอบ 190: ธีมกล่องแชท — เน้นเพื่อน/แฟน/น่ารัก (พื้นหลังลายในไฟล์ css .chat-box.ct-<id>) */
const CHAT_THEMES = [
  {id:'sky',      emoji:'💙', name:'ฟ้าใส'},
  {id:'mint',     emoji:'🍃', name:'เพื่อนซี้'},
  {id:'love',     emoji:'💖', name:'คนพิเศษ'},
  {id:'peach',    emoji:'🍑', name:'พีชหวาน'},
  {id:'lavender', emoji:'💜', name:'ลาเวนเดอร์'},
  {id:'bubble',   emoji:'🫧', name:'ฟองสบู่'},
  {id:'night',    emoji:'🌙', name:'ราตรีดาว'},
];
const CHAT_SECRET_MS = 20000;   // อ่านแล้วข้อความหายใน 20 วินาที (แชทลับ)
let chatUnsub = null;   // ฟังก์ชันเลิกฟังแชทที่เปิดอยู่ (มีได้ทีละกล่อง)

/* ============================================================
   รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
   ปุ่ม 💬 บน header → ลิสต์เพื่อน (Online.myFriends) + ข้อความล่าสุด/เวลา +
   จุดฟ้า=ยังไม่อ่าน + จุดเขียว=ออนไลน์อยู่ · แตะแถว = เปิดกล่องแชทเดิม (openChat)
   ============================================================ */
function chatBadgeSync(){
  const b = document.getElementById('chat-badge');
  if(!b) return;
  const n = (typeof Online !== 'undefined' && Online.ready && typeof chatUnreadCount === 'function')
    ? chatUnreadCount() : 0;
  b.style.display = n ? '' : 'none';
  if(n) b.textContent = n;
}
function ibTimeStr(ts){
  const d = new Date(ts), now = new Date();
  if(d.toDateString() === now.toDateString())
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  if(now - ts < 7*86400e3) return ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'][d.getDay()];
  return `${d.getDate()}/${d.getMonth()+1}`;
}
function openChatInbox(){
  sfx.select();
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะดูข้อความได้นะ 📡'); return; }
  const friends = (Online.myFriends || []).slice();
  const onlineIds = new Set((Online.friends || []).map(f=>String(f.id||'')));
  const overlay = document.createElement('div');
  overlay.className = 'inbox-overlay';
  overlay.innerHTML = `<div class="ib-box">
    <div class="ib-head"><span>💬 ข้อความ</span><button class="ib-close" type="button">✕</button></div>
    <div class="ib-story" id="ib-story"></div>
    <div class="ib-list" id="ib-list"><div class="ib-empty">กำลังโหลดข้อความ… 💬</div></div>
  </div>`;
  document.body.appendChild(overlay);
  const close = ()=>overlay.remove();
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
  overlay.querySelector('.ib-close').addEventListener('click', ()=>{ sfx.select(); close(); });

  // รอบ 185 (idea 2): แถบ "กำลังออนไลน์" แนวนอนบนสุด — วงกลมเพื่อนที่ออนไลน์ เลื่อนข้างได้ แบบ story row
  // รอบ 187 (A1): เติม badge เลขข้อความใหม่บนวงกลม (เติมหลังโหลดนับ unread)
  const storyEl = overlay.querySelector('#ib-story');
  const onlineFriends = friends.map((f,i)=>({f,i})).filter(x=>onlineIds.has(String(x.f.uid)));
  if(onlineFriends.length){
    storyEl.innerHTML = onlineFriends.map(({f,i})=>
      `<button class="ib-story-item" data-i="${i}" type="button">
        <span class="ib-story-ava">${escapeHTML((f.n||'?').trim().charAt(0).toUpperCase())}<i class="ib-story-on"></i><span class="ib-story-badge" data-uid="${escapeHTML(f.uid)}" style="display:none"></span></span>
        <small>${escapeHTML((f.n||'').trim().split(' ')[0])}</small>
      </button>`).join('');
    storyEl.querySelectorAll('.ib-story-item').forEach(b=>b.addEventListener('click', ()=>{
      const f = friends[+b.dataset.i];
      if(f){ sfx.select(); close(); openChat(f); }
    }));
  } else storyEl.style.display = 'none';

  const listEl = overlay.querySelector('#ib-list');
  if(!friends.length){
    listEl.innerHTML = `<div class="ib-empty">ยังไม่มีเพื่อนเลย 🤝<br>ไปกด ➕ เป็นเพื่อนจากรายชื่อคนออนไลน์ก่อน<br>เป็นเพื่อนกันแล้วส่งข้อความหากันได้เลย!</div>`;
    return;
  }
  const meKey = onlineKey();
  const badgeTxt = n => n > 20 ? '20+' : String(n);
  // รอบ 185 (idea 1) + 187 (A1): ดึงข้อความล่าสุด (limitToLast 20) → เรียงคนเพิ่งคุยขึ้นบน + นับข้อความใหม่ต่อคน
  Promise.all(friends.map(f=>
    Online.db.ref('chats/' + chatPairId(f.uid)).orderByKey().limitToLast(20).once('value')
      .then(snap=>{
        let last = null, unread = 0;
        const seen = (typeof chatSeenTs === 'function') ? chatSeenTs(f.uid) : 0;
        snap.forEach(ch=>{ const m = ch.val(); last = m;
          if(m && m.f === f.uid && typeof m.ts === 'number' && m.ts > seen) unread++; });
        return {f, last, unread};
      })
      .catch(()=>({f, last:null, unread:0}))
  )).then(items=>{
    if(!document.body.contains(overlay)) return;       // ผู้ใช้ปิดกล่องไปแล้ว
    // เรียง ts มากสุดบน · ไม่เคยคุย (ts 0) ตกลงล่างตามลำดับเพื่อนเดิม (sort เสถียร)
    items.sort((a,b)=>((b.last&&b.last.ts)||0)-((a.last&&a.last.ts)||0));
    const sorted = items.map(x=>x.f);
    // เติม badge เลขบนวงกลม story
    const unreadByUid = {}; items.forEach(({f,unread})=>{ unreadByUid[f.uid] = unread; });
    storyEl.querySelectorAll('.ib-story-badge').forEach(b=>{
      const n = unreadByUid[b.dataset.uid] || 0;
      if(n > 0){ b.textContent = badgeTxt(n); b.style.display = ''; }
    });
    listEl.innerHTML = items.map(({f,last,unread},i)=>{
      let lastTxt, timeTxt = '';
      if(last && typeof last.t === 'string'){
        lastTxt = (last.f === meKey ? selfPronoun() + ': ' : '') + last.t;
        if(last.ts) timeTxt = ibTimeStr(last.ts);
      }else lastTxt = 'ยังไม่เคยคุยกัน — ทักเลย! 👋';
      return `<div class="ib-row${unread ? ' unread' : ''}" data-i="${i}">
        <span class="ib-ava">${escapeHTML((f.n||'?').trim().charAt(0).toUpperCase())}${onlineIds.has(String(f.uid)) ? '<i class="ib-on"></i>' : ''}</span>
        <span class="ib-mid"><b class="ib-name">${escapeHTML(f.n)}</b><small class="ib-last">${escapeHTML(lastTxt)}</small></span>
        <span class="ib-meta"><small class="ib-time">${timeTxt}</small>${unread ? `<span class="ib-dot">${badgeTxt(unread)}</span>` : ''}</span>
        <button class="ib-world" data-i="${i}" title="ชวนเล่นโลก 3D" type="button">🌍</button>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.ib-row').forEach(r=>r.addEventListener('click', ()=>{
      sfx.select(); close(); openChat(sorted[+r.dataset.i]);
    }));
    // รอบ 185 (idea 3): ปุ่ม 🌍 ท้ายแถว → เมนูชวนเล่นโลก 3D (tinv) — กันไม่ให้เด้ง openChat
    listEl.querySelectorAll('.ib-world').forEach(b=>b.addEventListener('click', e=>{
      e.stopPropagation();
      const f = sorted[+b.dataset.i];
      if(f) openFriendQuickMenu(f.uid, f.n, f.g);
    }));
  });
}

function openChat(friend){
  if(!friend) return;
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะแชทได้นะ 📡'); return; }
  const me = onlineKey();
  const pid = chatPairId(friend.uid);
  // จำค่าธีม + สถานะแชทลับ แยกตามคู่สนทนา (เพื่อน/แฟนคนละธีมได้)
  if(!state.chatTheme  || typeof state.chatTheme  !== 'object') state.chatTheme  = {};
  if(!state.secretChat || typeof state.secretChat !== 'object') state.secretChat = {};
  let theme = state.chatTheme[pid];
  if(!CHAT_THEMES.some(t=>t.id === theme)) theme = 'sky';
  let secretOn = !!state.secretChat[pid];

  const overlay = document.createElement('div');
  overlay.className = 'chat-overlay';
  overlay.innerHTML = `<div class="chat-box ct-${theme}" id="chat-box">
    <div class="chat-head">
      <span class="chat-head-name">💬 ${escapeHTML(friend.n)}<small> ${idTag(friend.uid)}</small></span>
      <button class="chat-theme-btn" id="chat-theme-btn" type="button" title="เลือกธีม">🎨</button>
      <label class="chat-secret-tg" title="แชทลับ: อ่านแล้วข้อความหายใน 20 วินาที">
        <span class="cs-ic">🕵️</span>
        <span class="cs-switch"><input type="checkbox" id="chat-secret"${secretOn ? ' checked' : ''}><span class="cs-slider"></span></span>
      </label>
      <button class="chat-close" id="chat-close" type="button">✕</button>
    </div>
    <div class="chat-secret-note" id="chat-secret-note"${secretOn ? '' : ' style="display:none"'}>🕵️ แชทลับเปิดอยู่ — อ่านแล้วข้อความจะหายไปใน 20 วินาที</div>
    <div class="chat-theme-strip" id="chat-theme-strip" style="display:none">
      ${CHAT_THEMES.map(t=>`<button class="chat-theme-sw ct-${t.id}${t.id === theme ? ' on' : ''}" data-th="${t.id}" type="button" title="${t.name}"><span>${t.emoji}</span><small>${t.name}</small></button>`).join('')}
    </div>
    <div class="chat-msgs" id="chat-msgs"><div class="chat-empty">กำลังโหลดข้อความ... 💬</div></div>
    <div class="chat-typing" id="chat-typing" style="display:none"><span class="ct-dots"><i></i><i></i><i></i></span> ${escapeHTML(friend.n)} กำลังพิมพ์…</div>
    <div class="chat-emoji-wrap" id="chat-emoji" style="display:none">
      <div class="chat-emoji-cats" id="chat-emoji-cats">
        ${CHAT_EMOJI_CATS.map((c,i)=>`<button class="chat-emoji-cat${i === 0 ? ' on' : ''}" data-ci="${i}" type="button">${c.icon}</button>`).join('')}
      </div>
      <div class="chat-emoji" id="chat-emoji-grid"></div>
    </div>
    <div class="chat-input-row">
      <button class="chat-emoji-btn" id="chat-emoji-btn" type="button">😊</button>
      <input id="chat-input" maxlength="200" placeholder="พิมพ์ข้อความ..." autocomplete="off">
      <button class="chat-send" id="chat-send" type="button">ส่ง</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const msgsEl = overlay.querySelector('#chat-msgs');
  const input  = overlay.querySelector('#chat-input');
  const emojiPanel = overlay.querySelector('#chat-emoji');
  const box    = overlay.querySelector('#chat-box');

  // 🎨 เลือกธีม (แถบ swatch เปิด/ปิด · จำแยกตามคู่สนทนา)
  const themeStrip = overlay.querySelector('#chat-theme-strip');
  overlay.querySelector('#chat-theme-btn').addEventListener('click', ()=>{
    themeStrip.style.display = themeStrip.style.display === 'none' ? '' : 'none';
  });
  overlay.querySelectorAll('.chat-theme-sw').forEach(b=>b.addEventListener('click', ()=>{
    theme = b.dataset.th;
    box.className = 'chat-box ct-' + theme;
    overlay.querySelectorAll('.chat-theme-sw').forEach(t=>t.classList.toggle('on', t === b));
    themeStrip.style.display = 'none';
    state.chatTheme[pid] = theme; saveState();
    if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
  }));

  // 🕵️ แชทลับ: อ่านแล้วลบข้อความใน 20 วิ (ฝั่งผู้อ่านลบ = อีกฝ่ายก็เห็นหายด้วย)
  const secretNote = overlay.querySelector('#chat-secret-note');
  const vanishTimers = new Map();   // msgKey → timeout id
  const scheduleVanish = (key)=>{
    if(!secretOn || vanishTimers.has(key)) return;
    vanishTimers.set(key, setTimeout(()=>{
      vanishTimers.delete(key);
      if(typeof chatDeleteMsg === 'function') chatDeleteMsg(friend.uid, key);
    }, CHAT_SECRET_MS));
  };
  const clearVanishTimers = ()=>{ vanishTimers.forEach(id=>clearTimeout(id)); vanishTimers.clear(); };
  let lastMsgs = [];
  overlay.querySelector('#chat-secret').addEventListener('change', e=>{
    secretOn = e.target.checked;
    state.secretChat[pid] = secretOn; saveState();
    secretNote.style.display = secretOn ? '' : 'none';
    if(!secretOn) clearVanishTimers();                       // ปิด = ยกเลิกนับถอยหลังที่ค้าง
    renderMsgs(lastMsgs);                                    // อัปเดตแอนิเมชันจางบนบับเบิล
    if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
  });

  // วาดข้อความ (แยกฟังก์ชันเพื่อ re-render ตอนสลับแชทลับ)
  function renderMsgs(msgs){
    lastMsgs = msgs;
    if(!msgs.length){
      msgsEl.innerHTML = `<div class="chat-empty">ยังไม่มีข้อความ — ทักทายเพื่อนก่อนเลย! 👋</div>`;
      return;
    }
    msgsEl.innerHTML = msgs.map(m=>{
      const mine = m.f === me;
      // บับเบิลของอีกฝ่าย + แชทลับเปิด = ค่อยๆ จางบอกว่ากำลังจะหาย
      const vanish = (secretOn && !mine) ? ' vanish' : '';
      return `<div class="chat-bubble${mine ? ' mine' : ''}${vanish}">${escapeHTML(m.t)}</div>`;
    }).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  overlay.querySelector('#chat-emoji-btn').addEventListener('click', ()=>{
    emojiPanel.style.display = emojiPanel.style.display === 'none' ? '' : 'none';
  });
  // แผง emoji แบบหมวด: คลิกหมวด → เปลี่ยนกริด · คลิก emoji → แทรกลงข้อความ
  const emojiGrid = overlay.querySelector('#chat-emoji-grid');
  const renderEmojiGrid = (ci)=>{
    emojiGrid.innerHTML = CHAT_EMOJI_CATS[ci].list
      .map(e=>`<button class="chat-emo" type="button">${e}</button>`).join('');
    emojiGrid.querySelectorAll('.chat-emo').forEach(b=>b.addEventListener('click', ()=>{
      if(input.value.length < 200) input.value += b.textContent;
      input.focus();
    }));
  };
  overlay.querySelectorAll('.chat-emoji-cat').forEach(b=>b.addEventListener('click', ()=>{
    overlay.querySelectorAll('.chat-emoji-cat').forEach(t=>t.classList.toggle('on', t === b));
    renderEmojiGrid(+b.dataset.ci);
  }));
  renderEmojiGrid(0);

  // 💬 รอบ 187 (A2): แจ้ง "กำลังพิมพ์" ให้อีกฝ่าย + โชว์แถวเมื่ออีกฝ่ายพิมพ์ (ต้อง publish rules /typing)
  input.addEventListener('input', ()=>{ if(typeof chatSetTyping === 'function') chatSetTyping(friend.uid); });
  const typingEl = overlay.querySelector('#chat-typing');
  const stopTyping = (typeof chatWatchTyping === 'function')
    ? chatWatchTyping(friend.uid, active=>{
        if(!document.body.contains(overlay)) return;
        typingEl.style.display = active ? '' : 'none';
        if(active) msgsEl.scrollTop = msgsEl.scrollHeight;   // เห็นแถวพิมพ์
      })
    : ()=>{};

  const send = ()=>{
    if(!input.value.trim()) return;
    const btn = overlay.querySelector('#chat-send');
    btn.disabled = true;
    if(typeof chatClearTyping === 'function') chatClearTyping(friend.uid);   // ส่งแล้ว = เลิกพิมพ์
    chatSend(friend.uid, input.value)
      .then(()=>{ input.value = ''; sfx.select(); })
      .catch(msg=>{ sfx.wrong(); toast(typeof msg === 'string' ? msg : 'ส่งไม่สำเร็จ ลองใหม่นะ'); })
      .then(()=>{ btn.disabled = false; input.focus(); });
  };
  overlay.querySelector('#chat-send').addEventListener('click', send);
  input.addEventListener('keydown', e=>{ if(e.key === 'Enter') send(); });

  const close = ()=>{
    if(chatUnsub){ chatUnsub(); chatUnsub = null; }
    stopTyping();
    clearVanishTimers();
    if(typeof chatClearTyping === 'function') chatClearTyping(friend.uid);
    overlay.remove();
  };
  overlay.querySelector('#chat-close').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });

  if(chatUnsub) chatUnsub();          // ปิดกล่องเก่าถ้ามีค้าง
  chatUnsub = chatListen(friend.uid, (msgs)=>{
    if(!document.body.contains(overlay)){ if(chatUnsub){ chatUnsub(); chatUnsub = null; } return; }
    renderMsgs(msgs);
    if(!msgs.length){
      if(typeof chatMarkSeen === 'function') chatMarkSeen(friend.uid);
      return;
    }
    // 🕵️ แชทลับ: ข้อความของอีกฝ่ายที่กำลังอ่านอยู่ → ตั้งเวลาลบ 20 วิ · ยกเลิกตัวที่หายไปแล้ว
    if(secretOn){
      const alive = new Set(msgs.map(m=>m.key));
      msgs.forEach(m=>{ if(m.f !== me) scheduleVanish(m.key); });
      vanishTimers.forEach((id,k)=>{ if(!alive.has(k)){ clearTimeout(id); vanishTimers.delete(k); } });
    }
    // เปิดกล่องอยู่ = อ่านแล้ว: จำ ts ล่าสุด กันเด้งแจ้งเตือนซ้ำ (ข้อ 0.4)
    if(typeof chatMarkSeen === 'function') chatMarkSeen(friend.uid, msgs[msgs.length - 1].ts || Date.now());
  });
  setTimeout(()=>input.focus(), 60);
  sfx.select();
}

/* ============================================================
   ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
   ============================================================ */
function giftImg(id){ return IMG_FILES[`gift_${id}`] || null; }

function giftDateStr(ts){
  if(!ts) return '';
  try{ return new Date(ts).toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'2-digit'}); }
  catch(e){ return ''; }
}

/* ภาพ/ชื่อของขวัญ 1 ชิ้น (k='shop' → gifts.js · k='collect' → collectibles.js) */
function giftItemPic(k, id){
  if(k === 'shop'){ const g = giftInfo(id), img = giftImg(id);
    return img ? `<img src="${img}" alt="">` : `<span class="hq-emoji">${g ? g.emoji : '🎁'}</span>`; }
  const c = collectInfo(id), img = collectImg(id);
  return img ? `<img src="${img}" alt="">` : `<span class="hq-emoji">${c ? c.emoji : '📦'}</span>`;
}
function giftItemName(k, id){
  if(k === 'shop'){ const g = giftInfo(id); return g ? g.name : 'ของขวัญ'; }
  const c = collectInfo(id); return c ? c.name : 'สินค้า';
}

function updateGiftBadge(){
  const b = document.getElementById('gift-badge');
  if(!b) return;
  const n = (typeof Online !== 'undefined' && Online.giftIn) ? Online.giftIn.length : 0;
  setBadge(b, n);   // เด้งภาพเมื่อมีของขวัญใหม่ (สั่นให้ badge รวมจัดการ)
  updateSettingsBadge();
}

/* แผงห้องของขวัญ: (1) ของที่รับมารอกดรับ/ไม่รับ (2) ของขวัญของฉัน (3) ที่ส่งไปยังรอผู้รับ */
function renderGiftPanel(){
  const el = document.getElementById('gift-card');
  if(!el) return;
  updateGiftBadge();
  if(typeof Online === 'undefined' || !Online.ready){
    el.innerHTML = `<h3 class="shop-title">🎁 ห้องของขวัญ</h3>
      <div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อส่ง–รับของขวัญกับเพื่อนนะ!<br>
      ส่งของขวัญให้เพื่อนได้ที่เมนู 👥 เพื่อน (ปุ่ม 🎁 ส่งของขวัญ)</div>`;
    return;
  }
  let html = `<h3 class="shop-title">🎁 ห้องของขวัญ</h3>`;

  const inbox = Online.giftIn || [];
  if(inbox.length){
    html += `<div class="gift-sec-title">📨 มีของขวัญส่งมาถึงหนู (${inbox.length})</div>`;
    html += inbox.map((it,i)=>`<div class="gift-in-row">
        <span class="gift-in-pic">${giftItemPic(it.k, it.id)}</span>
        <div class="gift-in-info"><b>${escapeHTML(giftItemName(it.k, it.id))}</b><br>
          <small>💌 จาก ${escapeHTML(it.fn)} · ${giftDateStr(it.ts)}</small></div>
        <span class="gift-in-btns">
          <button class="gift-accept" data-i="${i}">💝 รับ</button>
          <button class="gift-decline" data-i="${i}">✕ ไม่รับ</button>
        </span></div>`).join('');
  }

  const box = state.giftBox || [];
  html += `<div class="gift-sec-title">🎀 ของขวัญของฉัน (${box.length})</div>`;
  if(box.length){
    html += `<div class="hq-grid">` + box.map(x=>`<div class="hq-card gift-box-card" style="border-color:#e6a4c4">
        <div class="hq-head">${escapeHTML(giftItemName(x.k, x.id))}</div>
        <div class="hq-pic">${giftItemPic(x.k, x.id)}</div>
        <div class="gift-box-from">💌 จาก ${escapeHTML(x.fn || 'เพื่อน')}<br><small>${giftDateStr(x.ts)}</small></div>
      </div>`).join('') + `</div>`;
    html += `<div class="gift-note">💝 ของขวัญเก็บไว้เป็นที่ระลึก ขายต่อหรือส่งต่อไม่ได้นะ</div>`;
  }else{
    html += `<div class="mkt-empty">ยังไม่มีของขวัญเลย — เมื่อเพื่อนส่งของขวัญมาแล้วหนูกด "รับ" จะมาเก็บที่นี่ 🎁</div>`;
  }

  const out = Online.giftOut || [];
  if(out.length){
    html += `<div class="gift-sec-title">📤 ของขวัญที่หนูส่งไป (${out.length})</div>`;
    html += out.map(o=>`<div class="gift-out-row">
        <span class="gift-in-pic">${giftItemPic(o.k, o.id)}</span>
        <div class="gift-in-info"><b>${escapeHTML(giftItemName(o.k, o.id))}</b><br>
          <small>ส่งให้ ${escapeHTML(o.toName || 'เพื่อน')} · 🕓 สินค้ายังไม่มีผู้รับ</small></div>
      </div>`).join('');
  }

  el.innerHTML = html;
  el.querySelectorAll('.gift-accept').forEach(b=>b.addEventListener('click', ()=>{
    const it = (Online.giftIn || [])[+b.dataset.i]; if(it) acceptGift(it);
  }));
  el.querySelectorAll('.gift-decline').forEach(b=>b.addEventListener('click', ()=>{
    const it = (Online.giftIn || [])[+b.dataset.i]; if(it) declineGift(it);
  }));
}

/* ผู้รับกด "รับ": ยืนยันสถานะกับ server ก่อน (กันรับซ้ำ) → เก็บเข้าห้องของขวัญ + ฉากเปิด */
function acceptGift(it){
  return giftAccept(it).then(()=>{
    state.giftBox.push({k: it.k, id: it.id, from: it.from, fn: it.fn, ts: it.ts || Date.now()});
    saveState();
    if(typeof feedEvent === 'function') feedEvent('goods', `ได้รับของขวัญ ${giftItemName(it.k, it.id)} จาก ${it.fn || 'เพื่อน'} 🎁`);
    Online.giftIn = (Online.giftIn || []).filter(g=>!(g.from === it.from && g.key === it.key));
    showGiftReveal(it);
    renderDashboard();
  }).catch(()=>{ sfx.wrong(); toast('รับของขวัญไม่สำเร็จ ลองใหม่นะ'); });
}

/* ผู้รับกด "ไม่รับ": ตั้งสถานะ declined → ผู้ส่งเห็นแล้วได้ของ/เหรียญคืน */
function declineGift(it){
  return giftDecline(it).then(()=>{
    Online.giftIn = (Online.giftIn || []).filter(g=>!(g.from === it.from && g.key === it.key));
    sfx.select(); toast('บอกเพื่อนแล้วว่ายังไม่สะดวกรับนะ');
    renderGiftPanel();
  }).catch(()=>{ sfx.wrong(); toast('ทำรายการไม่สำเร็จ ลองใหม่นะ'); });
}

/* ฉากเปิดของขวัญ (สไตล์เดียวกับฉากได้ของสะสม โทนชมพู) */
function showGiftReveal(it){
  if(sfx.rankup) sfx.rankup();
  const name = giftItemName(it.k, it.id);
  const img  = it.k === 'shop' ? giftImg(it.id) : collectImg(it.id);
  const emo  = it.k === 'shop' ? ((giftInfo(it.id) || {}).emoji || '🎁') : ((collectInfo(it.id) || {}).emoji || '📦');
  const pic  = img ? `<img class="collect-reveal-img" src="${img}" alt="">` : `<span class="cr-emoji">${emo}</span>`;
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:#e6a4c4"></div>
    <div class="rankup-content">
      <div class="rankup-title">🎁 ได้รับของขวัญ!</div>
      <div class="collect-reveal-frame" style="--rank-color:#e6a4c4">${pic}</div>
      <div class="rankup-name" style="color:#d6467f">${escapeHTML(name)}</div>
      <p class="rankup-sub">💌 จาก ${escapeHTML(it.fn || 'เพื่อน')}<br>เก็บไว้ในห้องของขวัญเป็นที่ระลึกนะ 💝</p>
      <button class="rankup-btn">ขอบคุณนะ! 🥰</button>
    </div>`;
  overlay.querySelector('.rankup-btn').addEventListener('click', ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(overlay);
}

/* กล่องเลือกของขวัญส่งเพื่อน: แท็บ "ซื้อของขวัญ" (gifts.js) / "จากคลังของฉัน" (collectibles) */
let giftPickCat = 'cake';
function openGiftPicker(friend){
  if(!friend) return;
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะส่งของขวัญได้นะ 📡'); return; }
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'gift-pick-overlay';
  overlay.innerHTML = `<div class="gift-pick-box">
    <div class="gift-pick-head">
      <span>🎁 ส่งของขวัญให้ ${escapeHTML(friend.n)}</span>
      <button class="gift-pick-close" type="button">✕</button>
    </div>
    <div class="gift-pick-tabs">
      <button class="gp-tab on" data-tab="shop" type="button">🛍️ ซื้อของขวัญ</button>
      <button class="gp-tab" data-tab="mine" type="button">📦 จากคลังของฉัน</button>
    </div>
    <div class="gift-pick-body" id="gift-pick-body"></div>
  </div>`;
  document.body.appendChild(overlay);
  const body = overlay.querySelector('#gift-pick-body');
  let tab = 'shop';

  function renderBody(){
    if(tab === 'shop'){
      const chips = GIFT_CATS.map(c=>`<button class="gp-chip${giftPickCat === c.id ? ' on' : ''}" data-cat="${c.id}" type="button">${c.emoji} ${c.name}</button>`).join('');
      const items = GIFTS.filter(g=>g.cat === giftPickCat);
      const grid = `<div class="hq-grid">` + items.map(g=>{
        const img = giftImg(g.id), afford = state.coins >= g.price;
        return `<div class="hq-card gp-card${afford ? '' : ' gp-poor'}" data-k="shop" data-id="${g.id}" style="border-color:#e6a4c4">
          <div class="hq-head">${g.name}</div>
          <div class="hq-pic">${img ? `<img src="${img}" alt="">` : `<span class="hq-emoji">${g.emoji}</span>`}</div>
          <div class="hq-price gp-price">🪙 ${fmtNum(g.price)}</div>
        </div>`;
      }).join('') + `</div>`;
      body.innerHTML = `<div class="gp-chips">${chips}</div>${grid}`;
      body.querySelectorAll('.gp-chip').forEach(b=>b.addEventListener('click', ()=>{ giftPickCat = b.dataset.cat; renderBody(); }));
    }else{
      const counts = {};
      for(const id of state.collection) counts[id] = (counts[id] || 0) + 1;
      const ids = COLLECTIBLES.map(c=>c.id).filter(id=>counts[id]);
      if(!ids.length){
        body.innerHTML = `<div class="mkt-empty">คลังยังว่างอยู่ — ไปผลิตสินค้าที่แท็บ 🏭 โรงงานก่อน แล้วค่อยเอามาส่งให้เพื่อนได้นะ</div>`;
      }else{
        body.innerHTML = `<div class="gp-note">ส่งสินค้าจากคลังให้เพื่อน — ส่งแล้วชิ้นนั้นออกจากคลังทันที (ถ้าเพื่อนไม่รับหรือค้างนานเกิน 7 วัน ของจะกลับคืนคลังให้เอง)</div><div class="hq-grid">` + ids.map(id=>{
          const c = collectInfo(id), tier = COLLECT_TIERS[c.tier], img = collectImg(id);
          return `<div class="hq-card gp-card" data-k="collect" data-id="${id}" style="border-color:${tier.color}">
            <div class="hq-head">${c.name}</div>
            <div class="hq-pic">${img ? `<img src="${img}" alt="">` : `<span class="hq-emoji">${c.emoji}</span>`}<span class="hq-badge">×${counts[id]}</span></div>
            <div class="hq-price gp-price">มูลค่า 🪙${fmtNum(c.price)}</div>
          </div>`;
        }).join('') + `</div>`;
      }
    }
    body.querySelectorAll('.gp-card').forEach(card=>card.addEventListener('click', ()=>{
      confirmSendGift(friend, card.dataset.k, card.dataset.id, ()=>overlay.remove());
    }));
  }

  overlay.querySelectorAll('.gp-tab').forEach(b=>b.addEventListener('click', ()=>{
    tab = b.dataset.tab;
    overlay.querySelectorAll('.gp-tab').forEach(t=>t.classList.toggle('on', t === b));
    renderBody();
  }));
  overlay.querySelector('.gift-pick-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  renderBody();
}

/* กล่องยืนยันก่อนส่ง — เช็กเหรียญ/ของในคลัง */
function confirmSendGift(friend, k, id, onDone){
  const name = giftItemName(k, id);
  const img  = k === 'shop' ? giftImg(id) : collectImg(id);
  const emo  = k === 'shop' ? ((giftInfo(id) || {}).emoji || '🎁') : ((collectInfo(id) || {}).emoji || '📦');
  const pic  = img ? `<img src="${img}" alt="">` : `<span>${emo}</span>`;
  let costLine;
  if(k === 'shop'){
    const g = giftInfo(id); if(!g) return;
    if(state.coins < g.price){
      askConfirm(`<div class="ld-pic">${pic}</div><div class="ld-name">${escapeHTML(name)}</div>
        <p class="ld-note">ราคา 🪙${fmtNum(g.price)} — เหรียญไม่พอนะ (มี 🪙${fmtNum(state.coins)})<br>หาเหรียญเพิ่มก่อนแล้วค่อยมาส่งนะ 😊</p>`, 'ปิด', ()=>{});
      return;
    }
    costLine = `ราคา 🪙${fmtNum(g.price)} (หักตอนส่ง)`;
  }else{
    if(!state.collection.includes(id)){ toast('ไม่มีชิ้นนี้ในคลังแล้ว'); return; }
    costLine = `ส่งจากคลังของหนู — ชิ้นนี้จะออกจากคลังทันที`;
  }
  askConfirm(`<div class="ld-pic">${pic}</div><div class="ld-name">${escapeHTML(name)}</div>
    <p class="ld-note">ส่งให้ <b>${escapeHTML(friend.n)}</b><br>${costLine}</p>`,
    '🎁 ส่งเลย!', ()=>{ doSendGift(friend, k, id); if(onDone) onDone(); });
}

/* ส่งจริง: ตัดของ/หักเหรียญทันที (escrow) → เขียน DB · ส่งไม่สำเร็จคืนให้ */
function doSendGift(friend, k, id){
  if(k === 'shop'){
    const g = giftInfo(id); if(!g) return;
    if(state.coins < g.price){ toast('เหรียญไม่พอนะ'); return; }
    state.coins -= g.price; saveState(); renderDashboard();
    giftSend(friend.uid, 'shop', id)
      .then(()=>{ sfx.buy(); toast(`🎁 ส่ง${g.name}ให้ ${friend.n} แล้ว! รอเพื่อนกดรับนะ`); })
      .catch(msg=>{ state.coins += g.price; saveState(); renderDashboard();
        sfx.wrong(); toast(typeof msg === 'string' ? msg : 'ส่งไม่สำเร็จ คืนเหรียญให้แล้ว'); });
  }else{
    const idx = state.collection.indexOf(id);
    if(idx < 0){ toast('ไม่มีชิ้นนี้ในคลังแล้ว'); return; }
    const c = collectInfo(id);
    state.collection.splice(idx, 1); saveState(); renderDashboard();
    giftSend(friend.uid, 'collect', id)
      .then(()=>{ sfx.buy(); toast(`🎁 ส่ง${c ? c.name : 'ของ'}ให้ ${friend.n} แล้ว! รอเพื่อนกดรับนะ`); })
      .catch(msg=>{ state.collection.push(id); saveState(); renderDashboard();
        sfx.wrong(); toast(typeof msg === 'string' ? msg : 'ส่งไม่สำเร็จ คืนของให้แล้ว'); });
  }
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
      <div class="rank-name" style="color:${r.color}">${r.emoji} ${info.label}</div>
      <div class="rank-bar"><div class="rank-fill" style="width:${Math.round(info.prog*100)}%;background:${r.color}"></div></div>
      <div class="rank-text">${nextText}</div>
    </div>`;

  /* ป้ายแรงค์เล็กบนแถบบน Lobby (คลิกเปิดแผงแรงค์เต็ม — โฉมใหม่ 5725691826) */
  const mini = document.getElementById('rank-mini');
  if(mini) mini.innerHTML =
    `${rankBadgeHTML(r.id, r.emoji, 'rank-mini-img')}<span>${info.label}</span>`;
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
/* ============================================================
   📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
   - แผง "ข้อมูลน้อง"+"การดูแล" เดิม (ข้างเวที) ย้ายมาเป็น overlay ใหญ่
     เนื้อหาเก็บใน __petPlates (renderDashboard สร้างใหม่ทุกรอบ — overlay refresh ตาม)
   - ฟีด = กิจกรรมของคนที่เรา follow (Online.feed จาก feedWatchSync ใน online.js)
   ============================================================ */
let __petPlates = null;   // {info, care} — HTML แผงล่าสุด (สดจาก renderDashboard)

/* ผูกปุ่มในแผงข้อมูลน้อง/การดูแล (scope ด้วย root — ใช้เฉพาะใน overlay) */
function bindPetPlateButtons(root){
  const p = activePet();
  if(!p) return;
  const conf = PETS[p.type];
  const on = (id, fn)=>{ const b = root.querySelector('#' + id); if(b) b.addEventListener('click', fn); };
  on('btn-feed', feedPet);
  on('btn-cure', curePet);
  on('btn-giant-up', ()=>upgradeGiant(p));
  on('btn-giant-reset', ()=>resetGiant(p));
  on('btn-sleep', sleepAllPets);
  on('btn-wake', wakeAllPets);
  on('btn-detox', ()=>detoxPet(p));
  on('btn-pet-rename', ()=>renamePet(p));
}

/* overlay ใหญ่ ข้อมูลน้อง & การดูแล — 2 คอลัมน์ (ร่างไข่ = คอลัมน์เดียว) ไม่มี scrollbar
   เปิดจากปุ่มเหนือฟีด · กดปุ่มดูแลแล้ว renderDashboard จะ refresh เนื้อหาให้เอง */
function openPetInfoOverlay(){
  if(!__petPlates) return;
  const ov = document.createElement('div');
  ov.className = 'pi-overlay';
  const close = ()=>{ window.__piOverlay = null; ov.remove(); };
  const fill = ()=>{
    if(!__petPlates || !activePet()){ close(); return; }
    ov.innerHTML = `<div class="pi-box${__petPlates.care ? '' : ' one-col'}">
      <button class="pl-close pi-close">✕</button>
      <div class="stage-plate pi-plate">${__petPlates.info}</div>
      ${__petPlates.care ? `<div class="stage-plate pi-plate">${__petPlates.care}</div>` : ''}
    </div>`;
    bindPetPlateButtons(ov);
    ov.querySelector('.pi-close').addEventListener('click', close);
  };
  ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
  window.__piOverlay = {refresh: fill};
  fill();
  document.body.appendChild(ov);
  sfx.select();
}

/* เวลาแบบอ่านง่ายในแถวฟีด */
function feedAgo(ts){
  const d = Date.now() - (ts || 0);
  if(d < 90*1000) return 'เมื่อกี้';
  if(d < 60*60*1000) return Math.floor(d/60000) + ' นาทีก่อน';
  if(d < 24*60*60*1000) return Math.floor(d/3600000) + ' ชม.ก่อน';
  return Math.floor(d/86400000) + ' วันก่อน';
}

/* วาดฟีดเพื่อน (แผงซ้าย lobby) — เลื่อนอ่านเองได้ ไม่มี scrollbar (ซ่อนใน CSS)
   รอบ 169: รายการใหม่เข้าสด → แถวแฟลชฟ้า + เด้งกล่องไปโชว์ (แพทเทิร์นเดียวกับภารกิจรอบ 150/เพื่อนออนไลน์รอบ 152) */
let __feedSeen = null;        // ts ใหม่สุดที่เห็นรอบก่อน (null = ยังไม่เคยเห็นฟีดจริง — ชุดแรกตอน login ไม่แฟลช)
let __feedFlashPend = null;   // ts ของแถวที่รอแฟลช (มาใหม่ตอนกล่องถูกซ่อน เช่น อยู่หน้าเกม → กลับ lobby ค่อยแฟลช)

function renderFeedCard(){
  const el = document.getElementById('feed-list');
  if(!el) return;
  const nFollow = Object.keys(state.follows || {}).length;
  const feed = (typeof Online !== 'undefined' && Online.feed) ? Online.feed : [];
  if(!nFollow){
    el.innerHTML = `<div class="feed-empty">ยังไม่ได้ติดตามใครเลย 📰<br>
      <small>แตะชื่อเพื่อนในกล่องขวาหรือกระดานอันดับ แล้วกด ➕ ติดตาม<br>กิจกรรมของเขาจะมาโชว์ที่นี่</small></div>`;
    initSideScroll(el);    // เนื้อหาสั้น = รีเซ็ต __ssLoop กันสถานะวนค้างจากรอบก่อน
    return;
  }
  if(!feed.length){
    el.innerHTML = `<div class="feed-empty">ติดตามอยู่ ${nFollow} คน แต่ยังไม่มีกิจกรรมให้อ่าน 😴<br>
      <small>เพื่อนต้องเปิดเผยกิจกรรมในตั้งค่า ⚙️ ของเขาก่อนนะ</small></div>`;
    initSideScroll(el);
    return;
  }
  el.innerHTML = feed.map(it=>{
    const fc = (typeof FEED_CATS !== 'undefined' && FEED_CATS[it.c]) || {e:'✨'};
    return `<div class="feed-row" data-fid="${escapeHTML(it.uid)}" data-n="${escapeHTML(it.n)}" data-g="${escapeHTML(it.g || '')}" data-ts="${+it.ts || 0}">
      <span class="feed-ico">${fc.e}</span>
      <span class="feed-txt"><b class="feed-name">${escapeHTML(it.n)}</b> ${escapeHTML(it.tx)}
        <small class="feed-ago">· ${feedAgo(it.ts)}</small></span>
    </div>`;
  }).join('');
  if(!el.dataset.bound){   // delegation ครั้งเดียวต่อ element (สร้างใหม่ทุก renderDashboard)
    el.dataset.bound = '1';
    el.addEventListener('click', (e)=>{
      const row = e.target.closest('.feed-row');
      if(!row) return;
      sfx.select();
      showPlayerCard(row.dataset.fid, row.dataset.n, row.dataset.g || '');
    });
  }
  // รอบ 169: หารายการที่ใหม่กว่ารอบก่อน (baseline null = ชุดแรกหลัง login ไม่นับ)
  const maxTs = feed.reduce((m,it)=>Math.max(m, +it.ts || 0), 0);
  if(__feedSeen !== null){
    const fresh = feed.filter(it=>(+it.ts || 0) > __feedSeen).map(it=>+it.ts);
    if(fresh.length) __feedFlashPend = fresh;
  }
  if(maxTs > (__feedSeen || 0)) __feedSeen = maxTs;
  else if(__feedSeen === null) __feedSeen = 0;
  initSideScroll(el);      // รอบ 168: ฟีดยาวเกินกล่อง → เลื่อนวนอัตโนมัติเหมือน 3 กล่อง aside ขวา (แตะ=หยุด)
  if(__feedFlashPend && el.clientHeight){   // กล่องมองเห็นอยู่ค่อยแฟลช (ซ่อนอยู่ = ค้างไว้รอกลับ lobby)
    const sel = __feedFlashPend.map(t=>`.feed-row[data-ts="${t}"]`).join(',');
    sideFlashRows(el, sel, 'feed-flash');
    __feedFlashPend = null;
  }
}

/* 📐 รอบ 160: จัดขอบซ้ายแท็บสัตว์ให้ตรงแนวขอบซ้ายของ rank chip บน header
   (แท็บกับ chip อยู่คนละ container — คำนวณจาก rect จริง หารด้วย scale เผื่อเพจถูกย่อ)
   เรียกท้าย renderDashboard + ตอน resize */
function alignPetTabs(){
  const tabs = document.getElementById('pet-tabs');
  const rm = document.getElementById('rank-mini');
  const stage = document.querySelector('.lobby-stage');
  if(!tabs || !rm || !stage || tabs.style.display === 'none') return;
  const s = stage.getBoundingClientRect(), r = rm.getBoundingClientRect();
  if(!s.width || !stage.offsetWidth) return;
  const scale = s.width / stage.offsetWidth;   // เพจโดนย่อ (transform) → แปลงกลับเป็น layout px
  tabs.style.setProperty('--tabs-left', Math.max(0, (r.left - s.left) / scale) + 'px');
}
window.addEventListener('resize', ()=>{ if(typeof alignPetTabs === 'function') alignPetTabs(); });

function renderDashboard(){
  careTick();
  dailyTick();
  if(Array.isArray(state.pendingCut) && state.pendingCut.length) showCutNotice();
  // ข้อ 6: เพิ่งป่วยเพราะไม่กินข้าวเย็น → เด้งกล่องแจ้งครั้งเดียว
  if(state.playerSickPending){
    state.playerSickPending = false;
    saveState();
    alertBox(`<div style="font-size:56px;line-height:1">🤒</div>
      <div style="font-size:21px;font-weight:bold;margin-top:8px;color:#b23a48">หนูป่วยแล้ว!</div>
      <div style="margin-top:8px;color:#6a5a78;line-height:1.5">เพราะไม่ได้กินข้าวเย็นตอน <b>18:00 น.</b><br>แตะปุ่ม 🤒 มุมขวาบนเพื่อไปหาหมอ (ค่ารักษา 🪙${fmtNum(CURE_COST)})<br>คราวหน้ากินข้าวให้ตรงเวลานะ</div>`, 'รับทราบ 😢');
  }
  applyNoAnim();
  updateBillBadges();
  renderRailWorlds();
  const now = Date.now();

  /* ---- เหรียญ: สะสมทั้งหมด + วันนี้ ---- */
  document.getElementById('coin-count').textContent = fmtNum(state.coins);
  document.getElementById('coin-today').textContent = fmtNum(state.daily.coins);
  /* แถบโปรไฟล์ (รอบ 187 คุ้มครองเด็ก): ตัวละคร + ชื่อเล่น + ✏️ แก้ชื่อ + 🆔 รหัสประจำตัว (ไม่โชว์ชื่อจริง/ชั้นแล้ว) */
  const chip = document.getElementById('student-chip');
  if(state.student){
    const myUid = (typeof onlineKey === 'function') ? onlineKey() : '';
    chip.innerHTML = `${playerAvatarHTML()} <b>${escapeHTML(state.profileName || 'ผู้เล่น')}</b>`
      + ` <button class="chip-edit" id="btn-edit-name" title="เปลี่ยนชื่อในเกม">✏️</button>`
      + ` · ${idTag(myUid)}`;
    document.getElementById('btn-edit-name').addEventListener('click', authEditProfileName);
  }else chip.textContent = '';

  renderClock();
  renderRankCard();
  if(typeof checkCrown === 'function') checkCrown();          // 👑 เข็มลับ (ครอบผู้เล่นเดิมที่ครบ 4 สายอยู่แล้ว)
  if(typeof rolloverBadgeWeek === 'function') rolloverBadgeWeek();   // 📈 สแนปแต้มเข็มต้นสัปดาห์
  renderQuestCard();      // 🎯 Daily Quest (item 3)
  renderOnlineCard();
  renderLeaderboardCard();
  renderFriendPanel();
  renderGiftPanel();

  /* ---- สภาพอากาศ ---- */
  const w = weatherNow();
  let wMsg = '';
  if(!state.home && state.pets.some(p=>p.level>=2)){
    if(w.id === 'rain') wMsg = ' — น้องไม่มีที่หลบฝนเลย รีบหาที่พักนะ!';
    else if(w.id === 'hot' || w.id === 'sunny') wMsg = ' — น้องตากแดดอยู่ หาที่พักให้น้องหน่อยนะ';
  }
  document.getElementById('weather-banner').innerHTML =
    `${w.emoji} อากาศในเกมตอนนี้: <b>${w.name}</b>${wMsg}`;

  renderNewWord();   // 🆕 คำศัพท์ใหม่ 1 คำ/การ login (รอบ 116)

  /* ---- แท็บสลับสัตว์ (หลายตัว) ----
     รอบ 179: ปุ่มข้าวเย็น #btn-dinner ย้ายจาก header มาต่อท้ายปุ่ม ➕ (สเปกผู้ใช้ — header ใส่ปุ่มแชทแทน)
     element สร้างใหม่ทุก render → ผูก click ตรงนี้ · โชว์/ซ่อน+หน้า emoji คุมโดย renderDinnerChip เดิม */
  const tabs = document.getElementById('pet-tabs');
  if(state.pets.length || state.playerSick || dinnerDue()){
    tabs.style.display = 'flex';
    tabs.innerHTML = state.pets.map((p,i)=>{
      const stage = petStage(p);
      const face = stage === 'egg' ? (PETS[p.type].startKey==='egg'?'🥚':'🧺') : PETS[p.type][stage];
      const alert = p.sick ? ' 🤒' : (petHungry(p) ? ' 😫' : '');
      return `<button class="pet-tab ${i===state.active?'on':''}" data-i="${i}">${face} ${escapeHTML(p.name)}${alert}</button>`;
    }).join('')
      + (state.pets.length ? `<button class="pet-tab add" id="tab-addpet">➕</button>` : '')
      + `<button class="pet-tab dinner" id="btn-dinner" style="display:none">🍚</button>`;
    tabs.querySelectorAll('.pet-tab[data-i]').forEach(b=>b.addEventListener('click', ()=>{
      const i = +b.dataset.i;
      // รอบ 189: คลิกแท็บน้องที่กำลังแสดงอยู่แล้ว = เปิดกล่องเปลี่ยนชื่อ · คลิกตัวอื่น = สลับไปแสดงตัวนั้น
      if(i === state.active){ sfx.select(); renamePet(state.pets[i]); return; }
      state.active = i; saveState(); sfx.select(); renderDashboard();
    }));
    const addBtn = document.getElementById('tab-addpet');
    if(addBtn) addBtn.addEventListener('click', ()=>{ renderPetShop(); showScreen('screen-select'); });
    document.getElementById('btn-dinner').addEventListener('click', dinnerClick);
    renderDinnerChip();
  }else{
    tabs.style.display = 'none'; tabs.innerHTML = '';
  }
  alignPetTabs();   // รอบ 160: ขอบซ้ายแท็บตรงแนว rank chip

  /* ---- ปุ่มรักษาด่วนในรางซ้าย: กดได้เฉพาะตอนมีน้องป่วย + badge เลขบอกป่วยกี่ตัว ---- */
  const railCure = document.getElementById('btn-rail-cure');
  if(railCure){
    const sickCount = state.pets.filter(x=>x.sick).length;
    railCure.disabled = sickCount === 0;
    railCure.classList.toggle('cure-alert', sickCount > 0);
    const cb = document.getElementById('cure-badge');
    if(cb){
      cb.style.display = sickCount > 0 ? '' : 'none';
      cb.textContent = sickCount;
    }
  }

  /* ---- การ์ดสัตว์เลี้ยง ---- */
  const card = document.getElementById('pet-card');
  const p = activePet();
  if(!p){
    card.className = 'pet-card no-pet';   // ยังไม่มีสัตว์ → คงการ์ดกระจกแบบเดิม (มีสัตว์ = โชว์ตัวใหญ่กลางจอ)
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
    renderTicketCard();
    renderHauntCard();
    renderHeliCard();
    renderDroneCard();
    renderDriveCard();
    renderSoccerCard();
    renderFarmCard();
    renderFactoryCard();
    renderMarketCard();
    renderShop();
    return;
  }

  const conf = PETS[p.type];
  const stage = petStage(p);
  const startStageName = conf.startKey === 'egg'
    ? 'ร่างไข่ 🥚 (เล่นเกมเพื่อฟักไข่!)'
    : 'แรกเกิดหลับปุ๋ย 🧺 (เล่นเกมให้น้องโตจนลืมตา!)';
  const stageNames = {egg:startStageName, baby:'ร่างเด็ก 🍼', adult:'ร่างโตเต็มวัย 🌟'};

  /* ---- ความหิวระบบมื้อเย็น (ข้อ 2+3): หิว 18:00 วันละครั้ง กินสะสมให้เต็ม 100 ---- */
  let hungerUI = '';
  if(stage !== 'egg'){
    const slot = currentSlotStart(now);
    const hungry = petHungry(p);
    let hungerStatus, barPct, barCls = '';
    if(p.sick){
      hungerStatus = '🤒 ป่วยอยู่... ต้องรักษาก่อนถึงจะกินได้';
      barPct = 0;
    }else if(p.sleeping){
      hungerStatus = `😴 กำลังหลับปุ๋ย... ตื่นเองตอน ${String(WAKE_HOUR).padStart(2,'0')}:00 น.`;
      barPct = petHungry(p) ? Math.min(100, p.fullness||0) : 100;
    }else if(hungry){
      const msLeft = Math.max(0, HUNGRY_SICK_MS - (now - slot));
      hungerStatus = `😫 หิวข้าวเย็นแล้ว! ความอิ่ม <b>${Math.min(100, p.fullness||0)}/${MEAL_FULL}</b> — กินให้เต็มหลอดภายใน <b>${fmtMins(msLeft)}</b> ไม่งั้นน้องจะป่วยนะ`;
      barPct = Math.min(100, p.fullness||0); barCls = 'hungry';
    }else{
      const covered = p.fedUpTo >= nextSlotStart(now) - 1;   // feast ครอบมื้อพรุ่งนี้แล้ว
      const nextMeal = p.fedUpTo > slot ? nextSlotStart(now) + SLOT_MS : nextSlotStart(now);
      hungerStatus = covered
        ? `🍱 อิ่มพิเศษ! ตุนข้ามมื้อพรุ่งนี้ได้เลย มื้อต่อไป: ${mealLabel(nextMeal)}`
        : `😋 อิ่มมีความสุข · มื้อเย็นถัดไป: ${mealLabel(nextMeal)}`;
      barPct = 100; if(covered) barCls = 'buffed';
    }
    const sickCauseText = p.sickCause === 'heat'
      ? 'เพราะอากาศร้อนเกินไป (หาที่พักติดแอร์จะช่วยได้)'
      : p.sickCause === 'thirst'
        ? 'เพราะบ้านถูกตัดน้ำ ไม่มีน้ำกิน-อาบ (จ่ายค่าน้ำค้างให้น้ำกลับมานะ)'
        : p.sickCause === 'rain'
          ? 'เพราะโดนฝนเปียกทั้งตัว ไม่มีที่หลบฝนสภาพดี (หาที่พักให้น้องนะ)'
          : p.sickCause === 'sleep'
            ? `เพราะนอนดึกเกินไป ไม่ได้เข้านอนก่อน ${SLEEP_SICK_HOUR}:00 น. (พาเข้านอนได้ตั้งแต่ ${SLEEP_FROM_HOUR}:00 น. ทุกคืนนะ)`
            : p.sickCause === 'toxin'
              ? 'เพราะพิษจากอาหารสะสมเต็มหลอด (อาหารคนบางอย่างเป็นโทษกับสัตว์นะ — หมอจะขับพิษให้ตอนรักษา)'
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

    /* ---- พิษสะสมจากอาหารโทษ (ข้อ 5.1): ไม่ลดเอง เต็ม 100 → ป่วยทันที · ขับพิษ 1,000 ---- */
    let toxinUI = '';
    if((p.toxin||0) > 0){
      toxinUI = `
        <div class="level-row">
          <span class="level-badge" style="background:#7a3ab0">☠️ พิษ</span>
          <div class="heat-bar"><div class="heat-fill toxin-fill" style="width:${p.toxin}%"></div></div>
        </div>
        <div class="heat-text toxin-text">☠️ พิษสะสม ${p.toxin}/${TOXIN_FULL} — เต็มหลอดน้องจะป่วยทันที<br>
          <small>พิษจากอาหารคนที่เป็นโทษ ไม่ลดเอง</small>
          ${!p.sick ? `<button class="detox-btn" id="btn-detox">🧪 ขับพิษ 🪙${fmtNum(DETOX_COST)}</button>` : ''}</div>`;
    }

    /* ---- รูปร่างตามคุณภาพการกิน (ข้อ 5.2): ล่ำ=โบนัส EXP · อ้วน/ผอมโซ=ชวนกลับมากินดี ---- */
    let shapeUI = '';
    if(p.shape && p.shape !== 'normal'){
      const su = SHAPE_UI[p.shape];
      shapeUI = `<div class="heat-text shape-text shape-${p.shape}">${su.icon} <b>${su.name}</b> — ${su.tip}</div>`;
    }else if((p.cleanMeals||0) > 0){
      shapeUI = `<div class="heat-text shape-text shape-progress">💪 กินดีต่อเนื่อง ${p.cleanMeals}/${SHAPE_CLEAN_MEALS} มื้อ — ครบแล้ว${escapeHTML(p.name)}จะล่ำกำยำ ได้โบนัส EXP!</div>`;
    }

    hungerUI = `
      <div class="level-row">
        <span class="level-badge" style="background:var(--orange-d)">🍖 อิ่ม</span>
        <div class="hunger-bar"><div class="hunger-fill ${barCls}" style="width:${barPct}%"></div></div>
      </div>
      <div class="hunger-text">${hungerStatus}</div>
      ${heatUI}
      ${thirstUI}
      ${toxinUI}
      ${shapeUI}
      ${p.sick ? `<div class="sick-banner">🤒 <b>${escapeHTML(p.name)}ป่วยแล้ว!</b> ${sickCauseText}<br>ตอนป่วยจะไม่ได้ EXP และใช้ความสามารถพิเศษไม่ได้<br>พาไปหาหมอเพื่อรักษาให้หายก่อนนะ</div>` : ''}
      ${sleepHintHTML(p, now)}
      <div class="care-row">
        <button class="care-btn btn-feed" id="btn-feed" ${(p.sick || p.sleeping)?'disabled':''}>🍽️ ให้อาหาร</button>
        ${sleepBtnHTML(p, now)}
        ${p.sick ? `<button class="care-btn btn-cure" id="btn-cure">💊 รักษา 🪙${fmtNum(CURE_COST)}</button>` : ''}
      </div>`;
  }

  const sickGray = p.sick && stage!=='egg' && !IMG_FILES[`${p.type}_${stage}_sick`];
  const g = giantLevel(p);   // รอบ 102: ระดับร่างยักษ์ → คุมความสูงน้อง/ผู้เลี้ยง
  const heroVars = `--pet-vh:${GIANT_PET_VH[g]};--owner-vh:${GIANT_OWNER_VH[g]};--owner-x:${GIANT_OWNER_X[g]}`;
  card.className = 'pet-card ' + (stage==='egg' ? 'pet-egg-stage' : stage==='baby' ? 'pet-baby' : 'pet-adult')
                   + (sickGray ? ' pet-sick' : '') + (p.sleeping && !p.sick ? ' pet-asleep' : '');
  /* 📰 รอบ 155 (สเปกผู้ใช้): กล่อง "ข้อมูลน้อง"+"การดูแล" ย้ายไป overlay ใหญ่ (openPetInfoOverlay)
     ซ้าย = ปุ่มเปิด overlay (เหนือตำแหน่งกล่องข้อมูลน้องเดิม) + ฟีดเพื่อน 📰 กว้างขึ้น
     เวทีน้อง (hero) ขยับไปฝั่งขวา แทนที่กล่องการดูแลเดิม */
  __petPlates = {
    info: `
      <div class="plate-title">⬢ ข้อมูลน้อง</div>
      <div class="plate-head">
        <span class="pet-name">${escapeHTML(p.name)} <button class="chip-edit" id="btn-pet-rename" title="เปลี่ยนชื่อน้อง">✏️</button></span>
        <span class="stage-label">${stageNames[stage]}</span>
        <span class="level-badge">Lv.${p.level}</span>
        <div class="exp-bar"><div class="exp-fill" style="width:${Math.min(100, p.exp/expNeed(p.level)*100)}%"></div></div>
        <span class="exp-text">EXP ${p.exp}/${expNeed(p.level)} · สะสม ${state.totalMatches} คำ</span>
      </div>
      <div class="ability-box ${abilityOn(p)?'':'locked'}">
        ${!isAdult(p)
          ? `🔒 ความสามารถพิเศษจะปลดล็อกเมื่อโตเต็มวัย (Lv.3)<br><small>${conf.ability}</small>`
          : p.sick
            ? `🤒 ป่วยอยู่ ใช้ความสามารถพิเศษไม่ได้<br><small>${conf.ability}</small>`
            : `<b>ความสามารถพิเศษ:</b> ${conf.ability}`}
      </div>
      ${stage !== 'egg' ? `
      <div class="giant-box">
        <div class="giant-line">🦣 ร่างยักษ์: <b>${GIANT_NAMES[g]}</b><span class="giant-lvl">${g}/${GIANT_MAX}</span></div>
        <div class="giant-dots">${[1,2,3,4].map(i=>`<span class="${i<=g?'on':''}"></span>`).join('')}</div>
        <div class="giant-btns">
          ${g < GIANT_MAX
            ? (giantUnlocked(p) >= g+1
                ? `<button class="care-btn giant-up" id="btn-giant-up">⬆️ ขยายร่าง <b>ฟรี 🆓</b></button>`
                : `<button class="care-btn giant-up" id="btn-giant-up">⬆️ ขยายร่าง <b>🪙${fmtNum(GIANT_COST[g+1])}</b></button>`)
            : `<div class="giant-max">🎉 ยักษ์เต็มขั้นแล้ว!</div>`}
          ${g > 0 ? `<button class="care-btn giant-reset" id="btn-giant-reset">↩️ ย่อกลับปกติ</button>` : ''}
        </div>
      </div>` : ''}`,
    care: hungerUI ? `<div class="plate-title">⬢ การดูแล</div>${hungerUI}` : '',
  };
  const petAlert = p.sick ? ' <span class="pib-alert">🤒</span>' : (petHungry(p) ? ' <span class="pib-alert">😫</span>' : '');
  card.innerHTML = `
    <div class="stage-left">
      <button class="pet-info-btn" id="btn-pet-info">🐾 ข้อมูลน้อง &amp; การดูแล${petAlert}</button>
      <div class="stage-plate feed-plate">
        <div class="plate-title">⬢ ฟีดเพื่อน 📰</div>
        <div class="feed-list" id="feed-list"></div>
      </div>
    </div>
    <div class="stage-hero${g === 0 ? ' hero-side' : ''}">${heroRankBgHTML()}<div class="hero-scene" style="${heroVars}"><div class="hero-ground"></div>${caretakerFigureHTML()}${petVisualHTML(p)}</div></div>`;

  document.getElementById('btn-pet-info').addEventListener('click', openPetInfoOverlay);
  renderFeedCard();
  if(window.__piOverlay) window.__piOverlay.refresh();   // overlay เปิดค้างอยู่ → เนื้อหาตาม state ใหม่

  // รอบ 104: โมเดล 3D ผู้เลี้ยง+น้อง (idle + ปัดหมุน) — มีไฟล์ img/models/*.glb ถึงแสดง
  // ไม่มี/โหลดพลาด/เปิดแบบ file:// → ใช้ภาพ PNG เดิม (fallback อัตโนมัติใน Lobby3D)
  // รอบ 186: ป่วย/หิว/ใส่เครื่องแต่งตัว + มีภาพตรงสถานะ → ใช้ภาพ 2D แทนโมเดล (forcePng)
  //          เพื่อสื่อสถานะน้องชัดเจน · ไม่มีภาพหรือปกติ = โมเดล 3D เหมือนเดิม
  if(typeof Lobby3D !== 'undefined' && stage !== 'egg'){
    const hero = card.querySelector('.stage-hero');
    const forcePng = (typeof petStateImg === 'function') && !!petStateImg(p);
    if(hero) Lobby3D.attach(hero, {avatar:state.playerAvatar, petType:p.type, stage, giant:g, forcePng});
  }
  // ปุ่มดูแล (ให้อาหาร/รักษา/นอน/ขับพิษ/ยักษ์/เปลี่ยนชื่อ) ย้ายไปอยู่ใน overlay
  // ข้อมูลน้อง — ผูกใน bindPetPlateButtons ตอน openPetInfoOverlay (รอบ 155)

  // แตะน้องแล้วเด้งดึ๋ง + มีเสียง
  const tap = document.getElementById('pet-tap');
  tap.style.cursor = 'pointer'; tap.style.pointerEvents = 'auto';
  tap.addEventListener('click', ()=>{
    sfx.select();
    if(!p.sick && !p.sleeping && stage!=='egg' && !petHungry(p) && IMG_FILES[`${p.type}_${stage}_happy`]){
      makeHappy(2500);
    }else{
      tap.style.transform = 'scale(1.15) rotate(-5deg)';
      setTimeout(()=>tap.style.transform = '', 180);
    }
  });

  renderHomeCard();
  renderPhoneCard();
  renderComputerCard();
  renderTicketCard();
  renderHauntCard();
  renderHeliCard();
  renderDroneCard();
  renderDriveCard();
  renderSoccerCard();
  renderFarmCard();
  renderFactoryCard();
  renderMarketCard();
  renderShop();
}

/* ============================================================
   การนอน (คิว 7725691507 ข้อ 1)
   เข้านอนได้ตั้งแต่ 20:00 · ถึง 23:00 ยังไม่นอน = ป่วย · ตื่นเอง 06:00
   ปุ่มเดียวพาสัตว์ทุกตัว (Lv.2 ขึ้นไป) เข้านอนพร้อมกัน
   ============================================================ */
function sleepBtnHTML(p, now){
  const h = new Date(now).getHours();
  if(p.sleeping) return `<button class="care-btn btn-sleep" id="btn-wake">⏰ ปลุกน้อง</button>`;
  if(h >= SLEEP_FROM_HOUR || h < WAKE_HOUR)
    return `<button class="care-btn btn-sleep" id="btn-sleep">🌙 พาเข้านอน</button>`;
  return '';
}
function sleepHintHTML(p, now){
  const h = new Date(now).getHours();
  if(p.sick || p.sleeping) return '';
  if(h >= SLEEP_FROM_HOUR && h < SLEEP_SICK_HOUR){
    const deadline = new Date(now); deadline.setHours(SLEEP_SICK_HOUR,0,0,0);
    return `<div class="heat-text">🌙 ได้เวลาเตรียมนอนแล้ว — พาน้องเข้านอนก่อน <b>${SLEEP_SICK_HOUR}:00 น.</b> (อีก ${fmtMins(deadline.getTime() - now)}) ไม่งั้นน้องจะป่วยนะ</div>`;
  }
  if(h >= SLEEP_SICK_HOUR || h < WAKE_HOUR)
    return `<div class="heat-text">🌙 ดึกมากแล้ว รีบพาน้องเข้านอนเถอะ!</div>`;
  return '';
}
function sleepAllPets(){
  const h = new Date(Date.now()).getHours();
  if(h < SLEEP_FROM_HOUR && h >= WAKE_HOUR){
    sfx.wrong(); toast(`🌙 ยังไม่ถึงเวลานอน — พาเข้านอนได้ตั้งแต่ ${SLEEP_FROM_HOUR}:00 น. นะ`); return;
  }
  let n = 0;
  for(const p of state.pets){ if(p.level >= 2 && !p.sleeping){ p.sleeping = true; n++; } }
  if(!n) return;
  sfx.select();
  saveState();
  toast(`😴 พาน้องเข้านอนครบ ${n} ตัวแล้ว ฝันดีนะ 💤 (ตื่นเอง ${String(WAKE_HOUR).padStart(2,'0')}:00 น.)`);
  renderDashboard();
}
function wakeAllPets(){
  for(const p of state.pets) p.sleeping = false;
  sfx.select();
  saveState();
  toast(`⏰ ปลุกน้องตื่นแล้ว — ก่อน ${SLEEP_SICK_HOUR}:00 น. พากลับไปนอนด้วยนะ`);
  renderDashboard();
}

/* ============================================================
   ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
   ============================================================ */
function feedPet(){
  const p = activePet();
  if(!p) return;
  if(p.sick){ alertBox('<div style="font-size:56px;line-height:1">🤒</div><div style="font-size:21px;font-weight:bold;margin-top:8px;color:#b23a48">น้องป่วยอยู่นะ</div><div style="margin-top:8px;color:#6a5a78;line-height:1.5">กินไม่ลงเลย... ต้องพาไป <b>รักษา</b> ก่อน น้องถึงจะหายแล้วกลับมากินได้ 🩺</div>', 'พาไปรักษา'); return; }
  if(p.sleeping){ sfx.wrong(); toast('😴 น้องหลับอยู่ อย่าเพิ่งปลุกมากินข้าวเลยนะ'); return; }
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
  /* ข้อ 5.1: แยกเมนู 2 ชุด — ชุดอาหารสัตว์ (fav+ปลอดภัย) กับชุดอาหารคน (บางอย่างเป็นโทษ) */
  const petFoods = [fav, ...FOODS.filter(f=>!f.human)];
  const humanFoods = FOODS.filter(f=>f.human);
  const menuFoods = [...petFoods, ...humanFoods];
  const itemHTML = f=>{
    const usable = hungry || f.skipNext;
    const bad = foodBadFor(f, p.type);
    return `
        <div class="food-item ${f.exp ? 'food-fav' : ''} ${f.special ? 'food-special' : ''} ${bad ? 'food-bad' : ''} ${(state.coins < f.price || !usable) ? 'cant-afford' : ''}" data-food="${f.id}">
          ${f.exp ? `<span class="fav-tag">💖 เมนูโปรดของ${escapeHTML(p.name)}!</span>` : ''}
          ${bad ? `<span class="bad-tag">⚠️ เป็นโทษกับน้อง!</span>` : ''}
          <span class="fd-emoji">${f.emoji}</span>
          <span class="fd-en">${f.en}</span>
          <span class="fd-name">${f.name}</span>
          <span class="fd-info">🪙${fmtNum(f.price)} · อิ่ม +${f.fill}</span>
          ${f.exp ? `<span class="fd-exp">✨ ได้ EXP แถม +${f.exp}!</span>` : ''}
          ${f.skipNext ? `<span class="fd-exp">⏳ เต็มหลอดทันที + ตุนข้ามมื้อพรุ่งนี้!</span>` : ''}
          ${bad ? `<span class="fd-toxin">☠️ พิษสะสม +${f.toxin}</span>`
                : f.human ? `<span class="fd-safe">✅ ${p.type==='dragon' ? 'มังกรกินได้' : 'น้องกินได้'}</span>` : ''}
        </div>`;
  };
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box food-box">
    <h2>🍽️ เลือกเมนูให้น้องกิน</h2>
    ${hungry
      ? `<p style="margin:4px 0;font-size:13.5px;color:#9a8aac">ความอิ่มตอนนี้ <b>${Math.min(100, p.fullness||0)}/${MEAL_FULL}</b> — เลือกกินหลายอย่างให้เต็มหลอดนะ</p>`
      : `<p style="margin:4px 0;font-size:13.5px;color:#9a8aac">น้องอิ่มมื้อนี้แล้ว — มีแต่ชุดอาหารวิเศษที่กินตุนข้ามมื้อพรุ่งนี้ได้</p>`}
    <div class="food-grid">
      <div class="food-sec">🐾 ชุดอาหารสัตว์ (ปลอดภัย)</div>
      ${petFoods.map(itemHTML).join('')}
      <div class="food-sec food-sec-human">🧑 ชุดอาหารคน — ⚠️ บางอย่างเป็นโทษกับสัตว์</div>
      ${humanFoods.map(itemHTML).join('')}
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
      /* ข้อ 5.1: อาหารโทษ → ป๊อปอัพเตือนก่อน กดรับทราบแล้วถึงป้อนได้ (กินอิ่มจริงแต่พิษสะสม) */
      if(foodBadFor(food, p.type)){
        const toxAfter = Math.min(TOXIN_FULL, (p.toxin||0) + (food.toxin||0));
        sfx.wrong();
        askConfirm(`<div style="font-size:56px;line-height:1">${food.emoji}⚠️</div>
          <div style="font-size:20px;font-weight:bold;margin-top:8px;color:#b23a48">${food.name}เป็นโทษกับ${escapeHTML(p.name)}นะ!</div>
          <div style="margin-top:8px;color:#6a5a78;line-height:1.5">${escapeHTML(foodWhy(food, p.type))}<br><br>
          กินแล้วอิ่มได้ (+${food.fill}) แต่ <b style="color:#7a3ab0">พิษจะสะสม +${food.toxin}</b><br>
          บาร์พิษ: <b>${p.toxin||0} → ${toxAfter}/${TOXIN_FULL}</b>${toxAfter >= TOXIN_FULL ? ' — <b style="color:#b23a48">เต็มแล้วน้องจะป่วยทันที!</b>' : ''}<br>
          <small>พิษไม่ลดเอง ต้องจ่ายค่าขับพิษ 🪙${fmtNum(DETOX_COST)}</small></div>`,
          'เข้าใจแล้ว ให้กินเลย', ()=>feedWith(p, food));
        return;
      }
      feedWith(p, food);
    });
  });
  document.body.appendChild(overlay);
}

function feedWith(p, food){
  const now = Date.now();
  state.coins -= food.price;
  // ข้อ 3: สะสมความอิ่ม — ครบ 100 ถึงนับว่าอิ่มมื้อนี้ (feast เต็มหลอด + ตุนข้ามมื้อพรุ่งนี้)
  p.mealSlot = currentSlotStart(now);
  if(food.skipNext){
    p.fullness = MEAL_FULL;
    p.fedUpTo = nextSlotStart(now);
  }else{
    p.fullness = Math.min(MEAL_FULL, (p.fullness||0) + (food.fill||0));
    if(p.fullness >= MEAL_FULL && p.fedUpTo < currentSlotStart(now)) p.fedUpTo = currentSlotStart(now);
  }
  /* ข้อ 5.1: อาหารโทษ → พิษสะสม (ไม่ลดเอง) ครบ 100 → ป่วยทันที cause 'toxin' */
  if(foodBadFor(food, p.type)){
    p.toxin = Math.min(TOXIN_FULL, (p.toxin||0) + (food.toxin||0));
    if(p.toxin >= TOXIN_FULL && !p.sick){ p.sick = true; p.sickCause = 'toxin'; sfx.siren(); }   // 🚨 ล้มป่วยคามือ
    p.mealJunk = true;                 // ข้อ 5.2: มื้อนี้มีอาหารโทษปน
  }
  /* ข้อ 5.2: กินจนเต็มหลอด = จบมื้อ → นับมื้อสะอาด/มื้อโทษ อัปเดตรูปร่าง */
  const shapeChange = p.fullness >= MEAL_FULL ? shapeMealDone(p, now) : null;
  if(p.fullness >= MEAL_FULL) questEvent('feed');   // 🎯 Daily Quest: ป้อนน้องจนอิ่มเต็มหลอด
  sfx.buy();
  if(food.exp) addExp(food.exp, p);   // เมนูโปรด: ได้ EXP แถม (อาจเลเวลอัพได้เลย)
  saveState();
  makeHappy(4000);
  showFeedResult(p, food, shapeChange);
}

/* ตัวละครผู้เลี้ยง (ข้อ 4): มีภาพ player_male/female.png ใช้ภาพ ไม่มีใช้อีโมจิแทน
   fallback = สิ่งที่โชว์เมื่อผู้เล่นยังไม่เลือกตัวละคร (แต่ละจุดใช้ต่างกัน) */
const AVATAR_UI = {male:{emoji:'🦸‍♂️', name:'เด็กชาย'}, female:{emoji:'🦸‍♀️', name:'เด็กหญิง'}};
function playerAvatarHTML(fallback){
  const av = state.playerAvatar;
  if(!av || !AVATAR_UI[av]) return fallback !== undefined ? fallback : '📛';
  const img = IMG_FILES[`player_${av}`];
  return img ? `<img class="avatar-chip-img" src="${img}" alt="">` : AVATAR_UI[av].emoji;
}

/* ข้อความประจำร่าง (ข้อ 5.2) — ใช้ทั้งการ์ดสัตว์ + กล่องกินเสร็จ */
const SHAPE_UI = {
  fat:   {icon:'🍩', name:'อ้วนกลม',
          tip:`กินของโทษติดกัน ${SHAPE_JUNK_MEALS} มื้อ — กินอาหารดีๆ เต็มหลอดให้ครบ ${SHAPE_CLEAN_MEALS} มื้อติด จะกลับมาหุ่นดีเหมือนเดิม`},
  thin:  {icon:'🦴', name:'ผอมโซ',
          tip:'อดข้าวบ่อยจนผอม — กินให้อิ่มเต็มหลอดทุกมื้อ น้องจะค่อยๆ กลับมาแข็งแรง'},
  strong:{icon:'💪', name:'ล่ำกำยำ',
          tip:`กินดีครบ ${SHAPE_CLEAN_MEALS} มื้อติด! ได้ EXP แถม +${SHAPE_EXP_BONUS} ทุกคำที่จับคู่ถูก`},
};

function showFeedResult(p, food, shapeChange){
  const conf = PETS[p.type];
  const stage = petStage(p);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const happyImg = IMG_FILES[`${p.type}_${stage}_happy`] || IMG_FILES[`${p.type}_${stage}_normal`];
  const gotToxin = foodBadFor(food, p.type);            // ข้อ 5.1: มื้อนี้ได้พิษสะสมมาด้วย
  const toxinSick = p.sick && p.sickCause === 'toxin';  // พิษเต็ม 100 → ป่วยทันที
  const stillHungry = petHungry(p) && !p.sick;          // กินแล้วแต่ยังไม่เต็มหลอด → ชวนกินต่อ (ป่วยแล้วห้ามกินต่อ)
  const nextMeal = p.fedUpTo >= nextSlotStart(Date.now()) - 1
    ? nextSlotStart(Date.now()) + SLOT_MS : nextSlotStart(Date.now());
  overlay.innerHTML = `<div class="levelup-box feed-box">
    <h2>${food.emoji} หม่ำ ${food.en} อร่อยจัง!</h2>
    <div class="feed-pet">${happyImg ? `<img src="${happyImg}" alt="">` : (conf[stage] || '😋')}${food.emoji}</div>
    ${toxinSick
      ? `<div class="feed-gain" style="background:var(--orange);border-color:var(--orange-d);color:#a85a1a">ความอิ่ม ${Math.min(100, p.fullness||0)}/${MEAL_FULL} — กินไม่ลงแล้ว ไม่สบายตัว...</div>`
      : stillHungry
        ? `<div class="feed-gain" style="background:var(--orange);border-color:var(--orange-d);color:#a85a1a">ความอิ่ม ${Math.min(100, p.fullness||0)}/${MEAL_FULL} — ยังไม่เต็มหลอด กินต่ออีกหน่อยนะ 😋</div>`
        : `<div class="feed-gain">อิ่มมื้อนี้เรียบร้อย 🎉 มื้อเย็นถัดไป: ${mealLabel(nextMeal)}</div>`}
    ${food.exp ? `<div class="feed-gain" style="background:var(--purple);border-color:var(--purple-d);color:#6a48a8">💖 เมนูโปรด! ได้ EXP แถม +${food.exp} ✨</div>` : ''}
    ${food.skipNext ? `<div class="feed-gain" style="background:var(--yellow);border-color:var(--yellow-d);color:#a8791a">🍱 อาหารวิเศษ! เต็มหลอด + ตุนข้ามมื้อพรุ่งนี้เลย ⏳</div>` : ''}
    ${gotToxin ? `<div class="feed-gain" style="background:#f0e3fb;border-color:#b98ae0;color:#7a3ab0">☠️ พิษสะสม +${food.toxin} → ตอนนี้ <b>${p.toxin}/${TOXIN_FULL}</b>${toxinSick ? '' : ' — อย่าให้กินบ่อยนะ!'}</div>` : ''}
    ${toxinSick ? `<div class="feed-gain" style="background:#ffe3e3;border-color:#ff8f8f;color:#b23a48">🤒 พิษเต็มหลอด! ${escapeHTML(p.name)}ป่วยแล้ว — ต้องพาไปขับพิษ+รักษา 🪙${fmtNum(CURE_COST)}</div>` : ''}
    ${shapeChange === 'strong' ? `<div class="feed-gain" style="background:#e8f8e8;border-color:#8fd48f;color:#2e7d43">💪 ${escapeHTML(p.name)}ล่ำกำยำแล้ว! กินดีครบ ${SHAPE_CLEAN_MEALS} มื้อติด — ได้ EXP แถม +${SHAPE_EXP_BONUS} ทุกคำที่จับคู่ถูก</div>` : ''}
    ${shapeChange === 'fat' ? `<div class="feed-gain" style="background:#ffefd9;border-color:#e8b93f;color:#a8791a">🍩 ${escapeHTML(p.name)}ตัวกลมปุ๊กแล้ว! กินของโทษติดกัน ${SHAPE_JUNK_MEALS} มื้อ — กลับมากินดีๆ ${SHAPE_CLEAN_MEALS} มื้อติดจะหุ่นดีเหมือนเดิม</div>` : ''}
    ${shapeChange === 'normal' ? `<div class="feed-gain">😊 ${escapeHTML(p.name)}กลับมาหุ่นปกติแล้ว — กินดีต่อเนื่องอีกนิดจะล่ำกำยำเลยนะ</div>` : ''}<br>
    <button>${toxinSick ? 'พาไปหาหมอ 🩺' : stillHungry ? 'กินต่อ 🍽️' : 'อิ่มแล้ว 😋'}</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>{
    overlay.remove();
    if(stillHungry){ openFoodMenu(p, true); }
    else renderDashboard();
  });
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
  if(p.sickCause === 'toxin') p.toxin = 0;           // ข้อ 5.1: หมอขับพิษให้ตอนรักษา (เฉพาะป่วยจากพิษ)
  p.sick = false; p.sickCause = null;
  p.fedUpTo = currentSlotStart(Date.now());          // หายป่วยแล้วอิ่มมีแรง
  p.fullness = MEAL_FULL; p.mealSlot = p.fedUpTo;
  p.heatFrom = (p.type === 'dragon' || heatProtected()) ? null : Date.now();
  p.thirstFrom = state.waterCut ? Date.now() : null; // ยังถูกตัดน้ำอยู่ → เริ่มนับรอบใหม่
  sfx.levelup();
  toast('💊 รักษาหายแล้ว! น้องกลับมาแข็งแรงร่าเริง 🎉');
  saveState();
  renderDashboard();
}

/* ปุ่มรักษาด่วนในรางซ้าย: น้องป่วยตัวไหนก็รักษาได้จากปุ่มเดียว
   (ถ้าตัวที่ป่วยไม่ใช่ตัวที่เปิดอยู่ → สลับแท็บไปหาตัวนั้นก่อนแล้วรักษาเลย) */
function railCureClick(){
  let p = activePet();
  if(!p || !p.sick){
    const i = state.pets.findIndex(x=>x.sick);
    if(i < 0) return;
    state.active = i;
    renderDashboard();
  }
  curePet();
}

/* ข้อ 5.1: ขับพิษก่อนป่วย — พิษไม่ลดเอง จ่าย 1,000 ล้างบาร์พิษเป็น 0 */
function detoxPet(p){
  if(!p || !(p.toxin > 0) || p.sick) return;
  sfx.select();
  askConfirm(`<div style="font-size:56px;line-height:1">🧪</div>
    <div style="font-size:20px;font-weight:bold;margin-top:8px;color:#7a3ab0">ขับพิษให้${escapeHTML(p.name)}</div>
    <div style="margin-top:8px;color:#6a5a78;line-height:1.5">พิษสะสมตอนนี้ <b>${p.toxin}/${TOXIN_FULL}</b> — ถ้าเต็มหลอดน้องจะป่วยทันที<br>
    หมอจะล้างพิษให้เหลือ 0 ค่าขับพิษ <b>🪙${fmtNum(DETOX_COST)}</b> (มี 🪙${fmtNum(Math.floor(state.coins))})</div>`,
    `🧪 ขับพิษ 🪙${fmtNum(DETOX_COST)}`, ()=>{
      if(state.coins < DETOX_COST){ sfx.wrong(); toast(`ค่าขับพิษ 🪙${fmtNum(DETOX_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ`); return; }
      state.coins -= DETOX_COST;
      p.toxin = 0;
      sfx.levelup();
      toast(`🧪 ขับพิษเรียบร้อย! ${p.name}ตัวเบาสบายแล้ว — เลือกอาหารดีๆ ให้น้องนะ`);
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
   ทายว่า "ให้สัตว์ชนิดนี้กินอาหารนี้ได้ไหม" 5 ข้อ/รอบ — เฉลยพร้อมเหตุผลจริง (food.why)
   รางวัลเฉพาะรอบแรกของวัน (+10/ข้อ +25 ถูกครบ) เล่นซ้ำเป็นรอบฝึกซ้อม
   ============================================================ */
function openFoodQuiz(){
  sfx.select();
  const rewarded = state.foodQuizDay === new Date(Date.now()).toDateString();  // วันนี้รับรางวัลแล้ว → รอบฝึกซ้อม
  // สุ่มคู่ (สัตว์, อาหาร) ไม่ซ้ำกันในรอบ — คละให้มีทั้งข้อ "กินได้" และ "เป็นโทษ"
  const combos = [];
  for(const type of Object.keys(PETS)) for(const f of FOODS) combos.push({type, f});
  const qs = shuffle(combos).slice(0, FOODQUIZ_Q);
  let idx = 0, score = 0;

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  document.body.appendChild(overlay);

  const renderQ = ()=>{
    const q = qs[idx];
    const conf = PETS[q.type];
    overlay.innerHTML = `<div class="levelup-box fq-box">
      <h2>🛡️ ควิซอาหารปลอดภัย</h2>
      <p class="fq-progress">ข้อ ${idx+1}/${FOODQUIZ_Q} · ถูกแล้ว ${score} ข้อ${rewarded ? ' · <b>รอบฝึกซ้อม (รับเหรียญไปแล้ววันนี้)</b>' : ''}</p>
      <div class="fq-pair"><span>${conf.adult}</span><span class="fq-q">❓</span><span>${q.f.emoji}</span></div>
      <div class="fq-ask">ให้<b>${conf.name}</b>กิน <b>${q.f.emoji} ${q.f.name}</b> (${q.f.en}) ได้ไหม?</div>
      <div class="fq-btns">
        <button class="fq-yes">✅ ให้กินได้</button>
        <button class="fq-no">🚫 ไม่ควรให้</button>
      </div>
      <button class="food-cancel fq-quit">เลิกเล่น</button>
    </div>`;
    overlay.querySelector('.fq-quit').addEventListener('click', ()=>overlay.remove());
    const answer = saidYes=>{
      const bad = foodBadFor(q.f, q.type);
      const correct = saidYes !== bad;        // กินได้=ตอบใช่ถูกเมื่อไม่เป็นโทษ
      if(correct){ score++; sfx.correct(); } else sfx.wrong();
      const reason = bad
        ? (foodWhy(q.f, q.type) || 'อาหารนี้เป็นโทษกับสัตว์ชนิดนี้')
        : (q.f.human ? `${q.f.name}เป็นอาหารคนก็จริง แต่${conf.name}กินได้ ไม่เป็นโทษ` : `${q.f.name}เป็นอาหารที่ปลอดภัยสำหรับสัตว์ทุกตัว`);
      overlay.innerHTML = `<div class="levelup-box fq-box">
        <h2>${correct ? '🎉 ถูกต้อง!' : '💦 ยังไม่ใช่'}</h2>
        <div class="fq-pair"><span>${conf.adult}</span><span class="fq-q">${bad ? '🚫' : '✅'}</span><span>${q.f.emoji}</span></div>
        <div class="fq-ask"><b>${bad ? `ไม่ควรให้${conf.name}กิน${q.f.name}` : `${conf.name}กิน${q.f.name}ได้`}</b></div>
        <div class="fq-why">${escapeHTML(reason)}</div>
        <div class="fq-btns"><button class="fq-next">${idx+1 < FOODQUIZ_Q ? 'ข้อต่อไป ➡️' : 'ดูผล 🏁'}</button></div>
      </div>`;
      overlay.querySelector('.fq-next').addEventListener('click', ()=>{
        idx++;
        if(idx < FOODQUIZ_Q) renderQ(); else renderEnd();
      });
    };
    overlay.querySelector('.fq-yes').addEventListener('click', ()=>answer(true));
    overlay.querySelector('.fq-no').addEventListener('click', ()=>answer(false));
  };

  const renderEnd = ()=>{
    let coins = 0;
    if(!rewarded){
      coins = score * FOODQUIZ_COIN + (score === FOODQUIZ_Q ? FOODQUIZ_BONUS : 0);
      if(coins > 0){ addCoins(coins); state.foodQuizDay = new Date(Date.now()).toDateString(); saveState(); }
    }
    if(score === FOODQUIZ_Q) sfx.levelup(); else sfx.select();
    overlay.innerHTML = `<div class="levelup-box fq-box">
      <h2>${score === FOODQUIZ_Q ? '🏆 สุดยอดผู้พิทักษ์!' : '🏁 จบรอบแล้ว'}</h2>
      <div style="font-size:44px;margin:6px 0">${score === FOODQUIZ_Q ? '🛡️✨' : '🛡️'}</div>
      <div class="fq-ask">ตอบถูก <b>${score}/${FOODQUIZ_Q}</b> ข้อ</div>
      ${coins > 0 ? `<div class="feed-gain">ได้เหรียญ +${fmtNum(coins)} 🪙${score === FOODQUIZ_Q ? ` (รวมโบนัสครบทุกข้อ +${FOODQUIZ_BONUS}!)` : ''}</div>` : ''}
      ${rewarded ? `<div class="fq-why">รอบฝึกซ้อม — พรุ่งนี้กลับมารับเหรียญได้อีกนะ</div>`
                 : coins === 0 ? `<div class="fq-why">ยังไม่ได้เหรียญ — ลองใหม่ได้เลย รางวัลวันนี้ยังรออยู่!</div>` : ''}
      <div class="fq-btns">
        <button class="fq-again">เล่นอีกรอบ 🔁</button>
        <button class="fq-next">ปิด</button>
      </div>
    </div>`;
    overlay.querySelector('.fq-again').addEventListener('click', ()=>{ overlay.remove(); openFoodQuiz(); });
    overlay.querySelector('.fq-next').addEventListener('click', ()=>{ overlay.remove(); renderDashboard(); });
  };

  renderQ();
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
      ${soldBadge('item_'+item.id)}
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
        if(typeof sellInc==='function') sellInc('item_'+item.id);   // 🛒 นับยอดขายเครื่องแต่งตัว
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

/* กล่องเตือนบริการถูกตัด (ค่าไฟ/น้ำ/เน็ต/ข้อมูล — billTick ตั้ง state.pendingCut ไว้) */
function showCutNotice(){
  const ids = (state.pendingCut || []).filter(id => UTILITY_UI[id]);
  state.pendingCut = [];
  saveState();
  if(!ids.length) return;
  const rows = ids.map(id=>{
    const u = UTILITY_UI[id];
    return `<div style="margin-top:10px;text-align:left;background:#fbeceb;border-radius:12px;padding:9px 12px">
      <div style="font-weight:bold;color:#b23a48">${u.cutIcon} ${u.cutName}</div>
      <div style="color:#6a5a78;font-size:13.5px;line-height:1.45;margin-top:2px">${u.cutMsg}</div>
    </div>`;
  }).join('');
  alertBox(`<div style="font-size:52px;line-height:1">⚠️</div>
    <div style="font-size:20px;font-weight:bold;margin-top:6px;color:#b23a48">มีบริการถูกตัดแล้ว!</div>
    <div style="color:#6a5a78;margin-top:4px;font-size:13.5px;line-height:1.45">ค้างจ่ายข้ามเดือนเลยโดนตัด — รีบไปจ่ายบิลค้างที่การ์ดบ้าน/มือถือ/คอม เพื่อให้กลับมาใช้ได้นะ</div>
    ${rows}`, 'ไปจ่ายบิล');
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

    // รอบ 187: ผังใหม่ — ภาพบ้านใหญ่เต็มฝั่งซ้าย · ข้อมูล+บิลจัดเป็นระเบียบฝั่งขวา
    body = `
      <div class="home-layout">
        <div class="home-pic-col">
          ${homeVisualHTML(h, 'home-img-big', decayed, state.powerCut, state.waterCut)}
        </div>
        <div class="home-info-col">
          <div class="home-name-row"><b>${h.emoji} ${h.name}</b>${decayed ? ' <span class="it-tag tag-off">ทรุดโทรม</span>' : ''}${cutTags}</div>
          <div class="home-desc-row"><small>${h.desc}</small></div>
          <div class="home-ac-row"><small>${acState}</small></div>
          ${billUI}
          ${utilUI}
          ${trashUI}
          ${h.canAC && !state.ac ? `<button class="big-btn blue home-btn" id="btn-buy-ac">❄️ ซื้อ+ติดตั้งแอร์ (🪙${fmtNum(AC_PRICE)} + ค่าติดตั้ง 🪙${fmtNum(AC_INSTALL)})</button>${soldBadge('ac')}` : ''}
          ${state.home !== 'castle' ? `<button class="big-btn purple home-btn" id="btn-home-shop">🏠 อัปเกรดที่พัก</button>` : ''}
        </div>
      </div>`;
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
      <button class="big-btn blue home-btn" id="btn-buy-phone">📱 ซื้อมือถือ 🪙${fmtNum(PHONE_PRICE)}</button>${soldBadge('phone')}`;
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
      if(typeof sellInc==='function') sellInc('phone');
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

/* ============================================================
   item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
   pill 🌐 ใน header วิ่งสดทุกวินาที (renderClock) · ตกเหรียญเต็มทุก 100 วิ
   ============================================================ */
function onlineLiveTotal(){   // โบนัสออนไลน์สะสม รวมเศษที่ยังไม่ตกเป็นเหรียญเต็ม
  let v = state.onlineEarned || 0;
  if(state.onlineSince != null) v += (Date.now() - state.onlineSince)/1000 * ONLINE_RATE;
  return v;
}
function renderOnlineEarnPill(){
  const pill = document.getElementById('net-pill');
  if(!pill || typeof state === 'undefined' || !state.student) return;
  // เดินเข็มถี่ทุกวินาที (careTick หลักเดินทุก 1 นาที — เรียกตรงนี้ด้วยให้เหรียญตกตรงเวลา 100 วิ)
  const dropped = typeof onlineEarnTick === 'function' ? onlineEarnTick(Date.now()) : 0;
  if(dropped > 0){
    saveState();
    const c = document.getElementById('coin-count'), t = document.getElementById('coin-today');
    if(c) c.textContent = fmtNum(state.coins);       // อัปยอดใน header ทันที ไม่รอ render รอบหน้า
    if(t) t.textContent = fmtNum(state.daily.coins);
  }
  const on = typeof onlineEarnActive === 'function' && onlineEarnActive();
  if(!on && !(state.onlineEarned > 0)){ pill.style.display = 'none'; return; }
  pill.style.display = '';
  pill.classList.toggle('off', !on);
  pill.title = on ? 'โบนัสออนไลน์: เปิดเกมออนไลน์อยู่ = เหรียญเพิ่มเอง +0.01/วินาที!'
                  : 'โบนัสออนไลน์หยุดพัก (ต้อง login ออนไลน์ถึงจะเดิน)';
  const live = document.getElementById('net-live');
  if(live) live.textContent = onlineLiveTotal().toFixed(2);
}

/* 💡 รอบ 156: แตะ pill ตัวเลขบน header Lobby → หน้าต่างอธิบายว่าเลขนี้คือเลขอะไร
   (ผู้ใช้สั่ง 12 ก.ค.: เด็กเห็นเลข 3 ก้อนแล้วงง — แตะแล้วต้องมีคำอธิบาย) */
function openPillInfo(kind){
  const rate = (typeof ONLINE_RATE !== 'undefined') ? ONLINE_RATE : 0.01;
  const netOn = (typeof onlineEarnActive === 'function') && onlineEarnActive();
  const infos = {
    coins: {
      emoji:'🪙', title:'เหรียญสะสมทั้งหมด', val:`${fmtNum(state.coins)} เหรียญ`,
      desc:`เหรียญทั้งหมดที่หนูมีอยู่<b>ตอนนี้</b> — ใช้ซื้อของทุกอย่างในเกม เช่น อาหารน้อง บ้าน เสื้อผ้า ตั๋วโลก 3D และจ่ายบิลรายเดือน<br><br>
        หาเพิ่มได้จาก: เกมจับคู่คำศัพท์ 🎮 · สอบผ่าน 📝 · ภารกิจรายวัน 🎯 · โรงงาน 🏭 · ฟาร์ม 🌳 · ขายของในตลาด 🏪`,
    },
    today: {
      emoji:'📅', title:'เหรียญที่หาได้วันนี้', val:`+${fmtNum(state.daily.coins)} เหรียญ`,
      desc:`นับเฉพาะเหรียญที่<b>หามาได้วันนี้</b> (ตอนใช้จ่ายเลขนี้ไม่ลด) — ขึ้นวันใหม่รีเซ็ตเป็น 0 เริ่มนับใหม่<br><br>
        ไว้ดูว่าวันนี้ขยันแค่ไหน แคปหน้าจอส่งคุณครู/คุณพ่อคุณแม่ได้เลย 📸`,
    },
    net: {
      emoji:'🌐', title:'โบนัสออนไลน์', val:`+${onlineLiveTotal().toFixed(2)} เหรียญ`,
      desc:`ของขวัญฟรี! แค่<b>เปิดเกมแบบออนไลน์</b>อยู่ เหรียญก็เพิ่มเอง <b>+${rate} เหรียญ/วินาที</b> (สะสมครบแล้วตกเป็นเหรียญเต็มเข้ากระเป๋าเองทุก 100 วินาที)<br><br>
        ตัวเลขนี้ = โบนัสออนไลน์ที่สะสมมา<b>ทั้งหมด</b>ตั้งแต่เริ่มเล่น<br>
        ${netOn ? '🟢 ตอนนี้กำลังเดินอยู่ — เล่นต่อไปเลย!' : '⚪ ตอนนี้หยุดพัก (ต้องต่อเน็ต + login ถึงจะเดิน)'}`,
    },
  };
  const inf = infos[kind];
  if(!inf) return;
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay pillinfo-overlay';
  // รอบ 167: หัวกล่องแนวนอน (ไอคอน | ชื่อ+ป้ายเหรียญ) แทนกองแนวตั้ง — จอเตี้ยเห็นครบทั้งใบไม่ต้องเลื่อน
  overlay.innerHTML = `<div class="levelup-box pillinfo-box">
    <div class="plf-head">
      <span class="plf-emoji">${inf.emoji}</span>
      <div class="plf-ht"><h2>${inf.title}</h2><div class="pillinfo-val">${inf.val}</div></div>
    </div>
    <p class="pillinfo-desc">${inf.desc}</p>
    <div class="plf-foot"><button class="set-close">เข้าใจแล้ว!</button></div>
  </div>`;
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
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
      <button class="big-btn blue home-btn" id="btn-buy-comp">💻 ซื้อคอมพิวเตอร์ 🪙${fmtNum(COMP_PRICE)}</button>${soldBadge('computer')}`;
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
      if(typeof sellInc==='function') sellInc('computer');
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
   🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
   ซื้อได้เมื่อมีสัตว์โตเต็มวัย (Lv.3) อย่างน้อย 1 ตัว — ยังไม่โต = ล็อก
   ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · โลกผจญภัย 3D (ข้อ 8) กำลังก่อสร้าง
   ============================================================ */
/* 🛒 รอบ 208: ป้าย "ขายไปแล้ว N ชิ้น" — โชว์ยอดขายจริงทั้งเซิร์ฟเวอร์ (จาก Online.sales) ใต้สินค้าทุกชิ้น
   ให้เห็นว่ามีคนซื้อจริง + ดูความนิยมได้ · ไม่ต่อเน็ต/ยังไม่มียอด = "ขายแล้ว 0 ชิ้น" */
function soldCount(id){ return (typeof Online !== 'undefined' && Online.sales && Online.sales[id]) ? Online.sales[id] : 0; }
function soldBadge(id){
  const n = soldCount(id);
  return `<div class="sold-badge${n>0?' has':''}">🛒 ขายไปแล้ว <b>${fmtNum(n)}</b> ชิ้น</div>`;
}

function renderTicketCard(){
  const el = document.getElementById('ticket-card');
  if(!el) return;
  const hasAdult = state.pets.some(p=>isAdult(p));
  let body;
  if(state.advTicket && state.advHurt){
    body = `
      <h3 class="shop-title">🎫 ตั๋วโลกผจญภัย</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🤕</div>
        <b>บาดเจ็บจากโลกผจญภัย!</b><br>
        <small>พลังหมดตอนผจญภัย ต้องรักษาตัวก่อนถึงจะกลับเข้าโลก 3D ได้อีกครั้ง</small>
      </div>
      <button class="big-btn red home-btn" id="btn-adv-heal">💊 รักษาตัว 🪙${fmtNum(CURE_COST)}</button>`;
  }else if(state.advTicket){
    body = `
      <h3 class="shop-title">🎫 ตั๋วโลกผจญภัย</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🎫✨</div>
        <b>ประตูโลกผจญภัยเปิดแล้ว!</b><br>
        <small>เดินเก็บตัวอักษรมาประกอบคำศัพท์ คำละ 🪙15 · ระวัง monster 👾 ยิงสู้ได้<br>
        พลังหมดต้องกลับมารักษา 🪙${fmtNum(CURE_COST)} · ออกจากโลกเมื่อไหร่ก็ได้<br>
        🧑‍🤝‍🧑 ผู้เล่นอื่นที่อยู่ในโลกจะโผล่ใน map ให้เจอกัน (สไตล์ Roblox)</small>
      </div>
      ${tinvNoticeHTML('adv')}
      <button class="big-btn green home-btn" id="btn-enter-adv">🌍 เข้าโลกผจญภัย 3D</button>
      ${state.tinvClaimed.adv ? '' :
        `<button class="big-btn blue home-btn" id="btn-inv-adv">📨 ชวนเพื่อนเล่นด้วยกัน (เงินคืนคนละ 🪙${fmtNum(TINV_CASHBACK)})</button>`}`;
  }else if(!hasAdult){
    body = `
      <h3 class="shop-title">🎫 ตั๋วโลกผจญภัย</h3>
      <div class="lock-banner">🔒 การ์ดตั๋วถูกล็อก — เลี้ยงน้องให้<b>โตเต็มวัย (Lv.3)</b> อย่างน้อย 1 ตัวก่อน ถึงจะซื้อตั๋วเข้าโลกผจญภัย 3D ได้นะ</div>`;
  }else{
    body = `
      <h3 class="shop-title">🎫 ตั๋วโลกผจญภัย</h3>
      <div class="home-desc">
        <div style="font-size:44px">🎫</div>
        <div><b>ตั๋วเข้าโลกผจญภัย 3D</b><br>
        <small>ออกตามหาตัวอักษรมาประกอบคำศัพท์ในโลกกว้าง ได้เหรียญมากกว่าเกมจับคู่!<br>
        ✅ ประตูเปิดแล้ว ซื้อตั๋วเข้าไปเล่นได้เลย · ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้</small></div>
      </div>
      ${tinvNoticeHTML('adv')}
      <button class="big-btn blue home-btn" id="btn-buy-ticket">🎫 ซื้อตั๋ว 🪙${fmtNum(TICKET_PRICE)}</button>${soldBadge('tk_adv')}`;
  }
  el.innerHTML = body;
  const buy = document.getElementById('btn-buy-ticket');
  if(buy) buy.addEventListener('click', buyTicket);
  const enter = document.getElementById('btn-enter-adv');
  if(enter) enter.addEventListener('click', enterAdventure3D);
  const heal = document.getElementById('btn-adv-heal');
  if(heal) heal.addEventListener('click', advHealClick);
  const inv = document.getElementById('btn-inv-adv');
  if(inv) inv.addEventListener('click', ()=>openTinvPicker('adv'));
}

/* ---------- ข้อ 8: เข้าโลกผจญภัย 3D — โหลด engine เฉพาะตอนกดเข้า (กันหน้าหลักหนัก) ---------- */
function loadScriptOnce(src){
  return new Promise((resolve,reject)=>{
    let s = document.querySelector(`script[src="${src}"]`);
    if(s){
      if(s.dataset.loaded){ resolve(); return; }
      s.addEventListener('load', resolve); s.addEventListener('error', reject);
      return;
    }
    s = document.createElement('script');
    s.src = src;
    s.addEventListener('load', ()=>{ s.dataset.loaded='1'; resolve(); });
    s.addEventListener('error', reject);
    document.head.appendChild(s);
  });
}
let advLoading = false;
async function enterAdventure3D(){
  if(!state.advTicket || state.advHurt || advLoading) return;
  if(!window.Adventure3D){
    advLoading = true;
    toast('🌍 กำลังเปิดประตูโลกผจญภัย...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดโลกผจญภัยไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  // 🧱 เลือกตัวละครบล็อกก่อนเข้า (เพื่อนใน map เห็นเราเป็นหุ่นบล็อกเดินได้) — ยกเลิก = ไม่เข้าโลก
  const go = await Adventure3D.pickBlockAvatar('🌍 ลุยเลย!');
  if(!go) return;
  Adventure3D.start('adv');
}

/* เข้าโลกผีสิงกลางคืน 👻 (ตั๋วแยก · ใช้ engine เดียวกัน โหมด haunt) */
async function enterHaunted3D(){
  if(!state.hauntTicket || state.advHurt || advLoading) return;
  if(!window.Adventure3D){
    advLoading = true;
    toast('👻 กำลังเปิดประตูโลกผีสิง...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดโลกผีสิงไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  // 🧱 เลือกตัวละครบล็อกก่อนเข้า (เหมือนโลกผจญภัย/ขับรถ) — ยกเลิก = ไม่เข้าโลก
  const go = await Adventure3D.pickBlockAvatar('👻 กล้าเข้าไป!');
  if(!go) return;
  Adventure3D.start('haunt');
}

/* พลังหมดในโลก 3D → บาดเจ็บ ต้องจ่ายค่ารักษาก่อนเข้าใหม่ (สเปก 8.5) */
function advHealClick(){
  if(!state.advHurt) return;
  if(state.coins < CURE_COST){
    sfx.wrong();
    toast(`ค่ารักษา 🪙${fmtNum(CURE_COST)} — เหรียญไม่พอ ไปเล่นเกมจับคู่เก็บเหรียญก่อนนะ!`);
    return;
  }
  askConfirm(`<h2>💊 รักษาตัว</h2>
    <p style="font-size:15px;margin:6px 0">จ่ายค่ารักษา <b>🪙${fmtNum(CURE_COST)}</b><br>
    <small>หายดีแล้วกลับเข้าโลก 3D ได้ทันที (ทั้งโลกผจญภัยและโลกผีสิง)</small></p>`,
    'รักษาเลย', ()=>{
      state.coins -= CURE_COST;
      state.advHurt = false;
      sfx.buy();
      toast('💪 หายดีแล้ว! กลับเข้าโลกผจญภัยได้เลย');
      saveState();
      renderDashboard();
    });
}

function buyTicket(){
  if(state.advTicket) return;
  if(!state.pets.some(p=>isAdult(p))){ sfx.wrong(); toast('🔒 ต้องมีสัตว์โตเต็มวัย (Lv.3) ก่อนถึงจะซื้อตั๋วได้นะ'); return; }
  if(state.coins < TICKET_PRICE){
    sfx.wrong(); toast(`ตั๋วโลกผจญภัย 🪙${fmtNum(TICKET_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>🎫 ซื้อตั๋วโลกผจญภัย</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(TICKET_PRICE)}</b><br>
    ตั๋วเข้าโลกผจญภัย 3D — ตามหาตัวอักษรประกอบคำศัพท์ คำละ 🪙15<br>
    <small>✅ ประตูเปิดแล้ว ซื้อแล้วเข้าเล่นได้ทันที<br>ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย!', ()=>{
      state.coins -= TICKET_PRICE;
      state.advTicket = true;
      if(typeof sellInc==='function') sellInc('tk_adv');
      sfx.buy();
      toast('🎫 ได้ตั๋วโลกผจญภัยแล้ว! กดปุ่มเขียวเข้าโลก 3D ได้เลย 🌍✨');
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
   ซื้อได้เมื่อมีตั๋วโลกผจญภัยก่อน · 25🪙/คำ · ผีสู้ไม่ได้ ต้องหนี
   โดนจับ = game over + รักษา 1,000 (สถานะบาดเจ็บใช้ร่วมกับโลกกลางวัน)
   ============================================================ */
function renderHauntCard(){
  const el = document.getElementById('haunt-card');
  if(!el) return;
  let body;
  if(state.hauntTicket && state.advHurt){
    body = `
      <h3 class="shop-title">🎃 ตั๋วโลกผีสิง</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🤕</div>
        <b>ยังบาดเจ็บอยู่!</b><br>
        <small>ต้องรักษาตัวก่อน (ปุ่มรักษาอยู่ที่การ์ดตั๋วโลกผจญภัย หรือกดที่นี่ก็ได้)</small>
      </div>
      <button class="big-btn red home-btn" id="btn-haunt-heal">💊 รักษาตัว 🪙${fmtNum(CURE_COST)}</button>`;
  }else if(state.hauntTicket){
    body = `
      <h3 class="shop-title">🎃 ตั๋วโลกผีสิง</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">👻🌙</div>
        <b>ประตูโลกผีสิงเปิดแล้ว... กล้าเข้าไหม?</b><br>
        <small>กลางคืนสุดหลอน เก็บตัวอักษรประกอบคำ คำละ 🪙25<br>
        👻 ผีโผล่ทีละ 20 วิแล้วย้ายที่ · <b>สู้ไม่ได้ ต้องหนีอย่างเดียว!</b> โดนจับ = จบเกม รักษา 🪙${fmtNum(CURE_COST)}<br>
        🧑‍🤝‍🧑 ผู้เล่นอื่นโผล่ใน map ให้เจอกัน (สไตล์ Roblox)</small>
      </div>
      ${tinvNoticeHTML('haunt')}
      <button class="big-btn purple home-btn" id="btn-enter-haunt">👻 เข้าโลกผีสิง 3D</button>
      ${state.tinvClaimed.haunt ? '' :
        `<button class="big-btn blue home-btn" id="btn-inv-haunt">📨 ชวนเพื่อนเล่นด้วยกัน (เงินคืนคนละ 🪙${fmtNum(TINV_CASHBACK)})</button>`}`;
  }else if(!state.advTicket){
    body = `
      <h3 class="shop-title">🎃 ตั๋วโลกผีสิง</h3>
      <div class="lock-banner">🔒 การ์ดตั๋วถูกล็อก — ต้องมี<b>ตั๋วโลกผจญภัย 🎫</b>ก่อน ถึงจะกล้าเข้าโลกผีสิงกลางคืนได้นะ</div>`;
  }else{
    body = `
      <h3 class="shop-title">🎃 ตั๋วโลกผีสิง</h3>
      <div class="home-desc">
        <div style="font-size:44px">🎃</div>
        <div><b>ตั๋วเข้าโลกผีสิงกลางคืน 3D</b><br>
        <small>โลกมืดสุดหลอน รางวัลคำละ 🪙25 (มากกว่าโลกกลางวัน!)<br>
        👻 ผีเยอะ สู้ไม่ได้ ต้องหนีอย่างเดียว · ใจไม่ถึงอย่าเข้า...<br>
        ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></div>
      </div>
      ${tinvNoticeHTML('haunt')}
      <button class="big-btn blue home-btn" id="btn-buy-haunt">🎃 ซื้อตั๋ว 🪙${fmtNum(HAUNT_PRICE)}</button>${soldBadge('tk_haunt')}`;
  }
  el.innerHTML = body;
  const buy = document.getElementById('btn-buy-haunt');
  if(buy) buy.addEventListener('click', buyHauntTicket);
  const enter = document.getElementById('btn-enter-haunt');
  if(enter) enter.addEventListener('click', enterHaunted3D);
  const heal = document.getElementById('btn-haunt-heal');
  if(heal) heal.addEventListener('click', advHealClick);
  const inv = document.getElementById('btn-inv-haunt');
  if(inv) inv.addEventListener('click', ()=>openTinvPicker('haunt'));
}

function buyHauntTicket(){
  if(state.hauntTicket) return;
  if(!state.advTicket){ sfx.wrong(); toast('🔒 ต้องมีตั๋วโลกผจญภัยก่อนถึงจะซื้อตั๋วโลกผีสิงได้นะ'); return; }
  if(state.coins < HAUNT_PRICE){
    sfx.wrong(); toast(`ตั๋วโลกผีสิง 🪙${fmtNum(HAUNT_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>🎃 ซื้อตั๋วโลกผีสิง</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(HAUNT_PRICE)}</b><br>
    โลกกลางคืนสุดหลอน — รางวัลคำละ 🪙25<br>
    <small>👻 ผีสู้ไม่ได้ ต้องหนีอย่างเดียว โดนจับ = จบเกม รักษา 🪙${fmtNum(CURE_COST)}<br>
    ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'กล้าซื้อ! 👻', ()=>{
      state.coins -= HAUNT_PRICE;
      state.hauntTicket = true;
      if(typeof sellInc==='function') sellInc('tk_haunt');
      sfx.buy();
      toast('🎃 ได้ตั๋วโลกผีสิงแล้ว! กดปุ่มม่วงเข้าโลกกลางคืน... ถ้ากล้า 👻');
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
   บิน cockpit view เก็บตัวอักษรบนยอดตึก ต้องลงจอดบนดาดฟ้า · 30🪙/คำ
   ซื้อได้เมื่อมีตั๋วโลกผจญภัย (คู่ขนานกับโลกผี ไม่บังคับผ่านกันและกัน)
   ============================================================ */
function renderHeliCard(){
  const el = document.getElementById('heli-card');
  if(!el) return;
  let body;
  if(state.heliTicket && state.advHurt){
    body = `
      <h3 class="shop-title">🚁 ตั๋วโลกเฮลิคอปเตอร์</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🤕</div>
        <b>ยังบาดเจ็บอยู่!</b><br>
        <small>ต้องรักษาตัวก่อนถึงจะกลับขึ้นบินได้</small>
      </div>
      <button class="big-btn red home-btn" id="btn-heli-heal">💊 รักษาตัว 🪙${fmtNum(CURE_COST)}</button>`;
  }else if(state.heliTicket){
    body = `
      <h3 class="shop-title">🚁 ตั๋วโลกเฮลิคอปเตอร์</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🚁🏙️</div>
        <b>กัปตันพร้อมบิน!</b><br>
        <small>มุมมอง cockpit เฮลิคอปเตอร์ Bell · ตัวอักษรอยู่บนยอดตึก คำละ 🪙30<br>
        บินลอดระหว่างตึกแล้ว<b>ลงจอดเบาๆ บนดาดฟ้า</b>เพื่อเก็บ · ชนตึก/กระแทกแรง = เจ็บ เครื่องพังต้องรักษา 🪙${fmtNum(CURE_COST)}<br>
        🧑‍🤝‍🧑 เห็นเพื่อนบิน 🚁 ในเมืองเดียวกันแบบสด</small>
      </div>
      <div class="tinv-note" style="border-color:#c9a227;background:#fffbe8">🎖️ <b>ใบอนุญาตนักบิน:</b>
        ${['ยังไม่มีเข็ม — บิน 5 คำติดไม่ชนรับเข็มทองแดง 🥉','เข็มทองแดง 🥉 (เป้าถัดไป 15 คำ = เงิน 🥈)','เข็มเงิน 🥈 (เป้าถัดไป 30 คำ = ทอง 🥇)','เข็มทอง 🥇 — สุดยอดกัปตัน!'][state.pilotBadge||0]}
        · สตรีคปัจจุบัน <b>${state.heliStreak||0}</b> คำ</div>
      ${tinvNoticeHTML('heli')}
      <button class="big-btn green home-btn" id="btn-enter-heli">🚁 ขึ้นบิน!</button>
      ${state.tinvClaimed.heli ? '' :
        `<button class="big-btn blue home-btn" id="btn-inv-heli">📨 ชวนเพื่อนบินด้วยกัน (เงินคืนคนละ 🪙${fmtNum(TINV_CASHBACK)})</button>`}`;
  }else if(!state.advTicket){
    body = `
      <h3 class="shop-title">🚁 ตั๋วโลกเฮลิคอปเตอร์</h3>
      <div class="lock-banner">🔒 การ์ดตั๋วถูกล็อก — ต้องมี<b>ตั๋วโลกผจญภัย 🎫</b>ก่อน ถึงจะสอบใบขับขี่เฮลิคอปเตอร์ได้นะ</div>`;
  }else{
    body = `
      <h3 class="shop-title">🚁 ตั๋วโลกเฮลิคอปเตอร์</h3>
      <div class="home-desc">
        <div style="font-size:44px">🚁</div>
        <div><b>ตั๋วโลกเฮลิคอปเตอร์ Bell 3D</b><br>
        <small>ขับเฮลิคอปเตอร์มุมมองห้องนักบิน! รางวัลสูงสุด <b>คำละ 🪙30</b><br>
        ตัวอักษรอยู่บนยอดตึก — ต้องบินหลบตึกแล้วลงจอดบนดาดฟ้าให้นุ่ม 🛬<br>
        ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></div>
      </div>
      ${tinvNoticeHTML('heli')}
      <button class="big-btn blue home-btn" id="btn-buy-heli">🚁 ซื้อตั๋ว 🪙${fmtNum(HELI_PRICE)}</button>${soldBadge('tk_heli')}`;
  }
  el.innerHTML = body;
  const buy = document.getElementById('btn-buy-heli');
  if(buy) buy.addEventListener('click', buyHeliTicket);
  const enter = document.getElementById('btn-enter-heli');
  if(enter) enter.addEventListener('click', enterHeli3D);
  const heal = document.getElementById('btn-heli-heal');
  if(heal) heal.addEventListener('click', advHealClick);
  const inv = document.getElementById('btn-inv-heli');
  if(inv) inv.addEventListener('click', ()=>openTinvPicker('heli'));
}

function buyHeliTicket(){
  if(state.heliTicket) return;
  if(!state.advTicket){ sfx.wrong(); toast('🔒 ต้องมีตั๋วโลกผจญภัยก่อนถึงจะซื้อตั๋วเฮลิคอปเตอร์ได้นะ'); return; }
  if(state.coins < HELI_PRICE){
    sfx.wrong(); toast(`ตั๋วโลกเฮลิคอปเตอร์ 🪙${fmtNum(HELI_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>🚁 ซื้อตั๋วโลกเฮลิคอปเตอร์</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(HELI_PRICE)}</b><br>
    ขับเฮลิคอปเตอร์ Bell เก็บตัวอักษรบนยอดตึก — คำละ 🪙30<br>
    <small>🛬 ต้องลงจอดบนดาดฟ้าให้นุ่มถึงจะเก็บได้ · ชนตึกเครื่องพัง รักษา 🪙${fmtNum(CURE_COST)}<br>
    ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย กัปตัน! 🚁', ()=>{
      state.coins -= HELI_PRICE;
      state.heliTicket = true;
      if(typeof sellInc==='function') sellInc('tk_heli');
      sfx.buy();
      toast('🚁 ได้ตั๋วโลกเฮลิคอปเตอร์แล้ว! กดปุ่มเขียว "ขึ้นบิน" ได้เลย กัปตัน ✈️');
      saveState();
      renderDashboard();
    });
}

/* เข้าโลกเฮลิคอปเตอร์ (engine เดียวกัน โหมด heli) */
async function enterHeli3D(){
  if(!state.heliTicket || state.advHurt || advLoading) return;
  if(!window.Adventure3D){
    advLoading = true;
    toast('🚁 กำลังสตาร์ทเครื่องยนต์...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดโลกเฮลิคอปเตอร์ไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  Adventure3D.start('heli');
}

/* ============================================================
   🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
   บินโดรนเร็วมาก ลอดหน้าต่างเข้าไปในตึกร้างตามห้องต่างๆ เก็บตัวอักษร คำละ 🪙35
   ============================================================ */
function renderDroneCard(){
  const el = document.getElementById('drone-card');
  if(!el) return;
  let body;
  if(state.droneTicket && state.advHurt){
    body = `
      <h3 class="shop-title">🛸 ตั๋วโลกโดรน FPV</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🤕</div>
        <b>ยังบาดเจ็บอยู่!</b><br>
        <small>ต้องรักษาตัวก่อนถึงจะกลับขึ้นบินโดรนได้</small>
      </div>
      <button class="big-btn red home-btn" id="btn-drone-heal">💊 รักษาตัว 🪙${fmtNum(CURE_COST)}</button>`;
  }else if(state.droneTicket){
    body = `
      <h3 class="shop-title">🛸 ตั๋วโลกโดรน FPV</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🛸🏚️</div>
        <b>นักบินโดรนพร้อมลุย!</b><br>
        <small>มุมมอง FPV โดรนแข่ง เร็วสุดๆ · ตัวอักษรซ่อนอยู่<b>ในตึกร้าง</b> คำละ 🪙35<br>
        บินลอดหน้าต่าง เข้าไปในห้องต่างๆ แล้วบินเฉียดเก็บ (ไม่ต้องจอด) · ระวังชนกำแพง!<br>
        🧑‍🤝‍🧑 เห็นเพื่อนบินโดรน 🛸 ในเมืองร้างเดียวกันแบบสด</small>
      </div>
      ${tinvNoticeHTML('drone')}
      <button class="big-btn green home-btn" id="btn-enter-drone">🛸 บินโดรน!</button>
      ${state.tinvClaimed.drone ? '' :
        `<button class="big-btn blue home-btn" id="btn-inv-drone">📨 ชวนเพื่อนบินด้วยกัน (เงินคืนคนละ 🪙${fmtNum(TINV_CASHBACK)})</button>`}`;
  }else if(!state.heliTicket){
    body = `
      <h3 class="shop-title">🛸 ตั๋วโลกโดรน FPV</h3>
      <div class="lock-banner">🔒 การ์ดตั๋วถูกล็อก — ต้องมี<b>ตั๋วโลกเฮลิคอปเตอร์ 🚁</b>ก่อน (ผ่านการฝึกบินก่อน ถึงจะบินโดรนความเร็วสูงได้)</div>`;
  }else{
    body = `
      <h3 class="shop-title">🛸 ตั๋วโลกโดรน FPV</h3>
      <div class="home-desc">
        <div style="font-size:44px">🛸</div>
        <div><b>ตั๋วโลกโดรน FPV Racing 3D</b><br>
        <small>บินโดรน FPV มุมมองบุคคลที่หนึ่ง เร็วและคล่องกว่าเฮลิคอปเตอร์มาก! รางวัล <b>คำละ 🪙35</b><br>
        เมืองตึกร้าง — ต้องบินลอดหน้าต่างเข้าไปในตึก เก็บตัวอักษรตามห้องต่างๆ 🏚️<br>
        ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></div>
      </div>
      ${tinvNoticeHTML('drone')}
      <button class="big-btn blue home-btn" id="btn-buy-drone">🛸 ซื้อตั๋ว 🪙${fmtNum(DRONE_PRICE)}</button>${soldBadge('tk_drone')}`;
  }
  el.innerHTML = body;
  const buy = document.getElementById('btn-buy-drone');
  if(buy) buy.addEventListener('click', buyDroneTicket);
  const enter = document.getElementById('btn-enter-drone');
  if(enter) enter.addEventListener('click', enterDrone3D);
  const heal = document.getElementById('btn-drone-heal');
  if(heal) heal.addEventListener('click', advHealClick);
  const inv = document.getElementById('btn-inv-drone');
  if(inv) inv.addEventListener('click', ()=>openTinvPicker('drone'));
}

function buyDroneTicket(){
  if(state.droneTicket) return;
  if(!state.heliTicket){ sfx.wrong(); toast('🔒 ต้องมีตั๋วโลกเฮลิคอปเตอร์ก่อนถึงจะซื้อตั๋วโดรน FPV ได้นะ'); return; }
  if(state.coins < DRONE_PRICE){
    sfx.wrong(); toast(`ตั๋วโลกโดรน FPV 🪙${fmtNum(DRONE_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>🛸 ซื้อตั๋วโลกโดรน FPV</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(DRONE_PRICE)}</b><br>
    บินโดรน FPV เร็วสุดๆ เก็บตัวอักษรในตึกร้าง — คำละ 🪙35<br>
    <small>🏚️ ต้องบินลอดหน้าต่างเข้าไปในตึก เก็บตามห้องต่างๆ · ชนกำแพงโดรนพัง รักษา 🪙${fmtNum(CURE_COST)}<br>
    ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย! 🛸', ()=>{
      state.coins -= DRONE_PRICE;
      state.droneTicket = true;
      if(typeof sellInc==='function') sellInc('tk_drone');
      sfx.buy();
      toast('🛸 ได้ตั๋วโลกโดรน FPV แล้ว! กดปุ่มเขียว "บินโดรน" ได้เลย 🏙️');
      saveState();
      renderDashboard();
    });
}

/* เข้าโลกโดรน (engine เดียวกัน โหมด drone) */
async function enterDrone3D(){
  if(!state.droneTicket || state.advHurt || advLoading) return;
  if(!window.Adventure3D){
    advLoading = true;
    toast('🛸 กำลังอาร์มโดรน...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดโลกโดรนไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  Adventure3D.start('drone');
}

/* ============================================================
   🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
   ขับรถ first-person ในเมืองกำแพงเพชรจริง (ถนน/ตึก/แม่น้ำปิงจาก OpenStreetMap
   เริ่มที่หอนาฬิกาวงเวียนต้นโพธิ์) ขับชนตัวอักษรบนถนน คำละ 🪙40
   ============================================================ */
function renderDriveCard(){
  const el = document.getElementById('drive-card');
  if(!el) return;
  let body;
  if(state.driveTicket && state.advHurt){
    body = `
      <h3 class="shop-title">🚗 ตั๋วโลกขับรถกำแพงเพชร</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🤕</div>
        <b>ยังบาดเจ็บอยู่!</b><br>
        <small>ต้องรักษาตัวก่อนถึงจะกลับไปขับรถได้</small>
      </div>
      <button class="big-btn red home-btn" id="btn-drive-heal">💊 รักษาตัว 🪙${fmtNum(CURE_COST)}</button>`;
  }else if(state.driveTicket && carDriveBlock()){
    // 🔐 รอบ 131: มีตั๋วแต่ยังไม่มีรถ / ค้างค่างวด — ตั๋ว=สิทธิ์เข้าเมือง รถ=พาหนะ ต้องซื้อแยก
    const why = carDriveBlock();
    body = `
      <h3 class="shop-title">🚗 ตั๋วโลกขับรถกำแพงเพชร</h3>
      <div class="ticket-owned car-locked">
        <div style="font-size:44px">🔐</div>
        ${why==='nocar'
          ? `<b>ต้องซื้อรถก่อน จึงจะขับรถได้</b><br>
             <small>ตั๋ว = สิทธิ์เข้าเมืองกำแพงเพชร · <b>รถ = พาหนะ</b> ต้องมีก่อนออกถนน<br>
             ไปเลือกรถคันแรกที่หมวด 🚗 ยานพาหนะ ในตลาดกันเลย!</small>`
          : `<b>ค้างค่างวดรถ — ขับไม่ได้ชั่วคราว</b><br>
             <small>จ่ายงวดที่ค้าง <b>🪙${fmtNum(carLoanOverdue())}</b> ที่หมวดยานพาหนะ แล้วกลับมาขับได้ทันที</small>`}
      </div>
      <button class="big-btn blue home-btn" id="btn-drive-tocar">🏪 ไปหมวดยานพาหนะ</button>`;
  }else if(state.driveTicket){
    body = `
      <h3 class="shop-title">🚗 ตั๋วโลกขับรถกำแพงเพชร</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🚗🏙️</div>
        <b>คนขับพร้อมออกรถ!</b><br>
        <small>ขับรถเที่ยว<b>เมืองกำแพงเพชรของจริง</b> — ถนนทุกสายตรงตามแผนที่จริง<br>
        เริ่มที่หอนาฬิกาวงเวียนต้นโพธิ์ · ขับชนตัวอักษรบนถนนเก็บมาประกอบคำ คำละ 🪙40<br>
        ออกนอกถนนรถช้าลง · ชนตึกแรงๆ รถพัง ระวังด้วยนะ!<br>
        🧑‍🤝‍🧑 เห็นเพื่อนขับรถในเมืองเดียวกันแบบสด</small>
      </div>
      ${tinvNoticeHTML('drive')}
      <button class="big-btn green home-btn" id="btn-enter-drive">🚗 ออกรถ!</button>
      ${state.tinvClaimed.drive ? '' :
        `<button class="big-btn blue home-btn" id="btn-inv-drive">📨 ชวนเพื่อนขับด้วยกัน (เงินคืนคนละ 🪙${fmtNum(TINV_CASHBACK)})</button>`}`;
  }else if(!state.droneTicket){
    body = `
      <h3 class="shop-title">🚗 ตั๋วโลกขับรถกำแพงเพชร</h3>
      <div class="lock-banner">🔒 การ์ดตั๋วถูกล็อก — ต้องมี<b>ตั๋วโลกโดรน FPV 🛸</b>ก่อน (ไต่ระดับโลก 3D ทีละใบ)</div>`;
  }else{
    body = `
      <h3 class="shop-title">🚗 ตั๋วโลกขับรถกำแพงเพชร</h3>
      <div class="ticket-desc">
        <div style="font-size:44px">🚗🕰️</div>
        <b>ขับรถเที่ยวเมืองกำแพงเพชรของจริง!</b><br>
        <small>เมืองจริงจากแผนที่จริง — ถนนทุกสาย ตึก แม่น้ำปิง ตรงตำแหน่งจริง<br>
        ออกรถที่<b>หอนาฬิกาวงเวียนต้นโพธิ์</b> · ขับชนตัวอักษรบนถนน คำละ 🪙40<br>
        ชนตึกแรงๆ รถพัง รักษา 🪙${fmtNum(CURE_COST)}<br>
        ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></div>
      ${tinvNoticeHTML('drive')}
      <button class="big-btn blue home-btn" id="btn-buy-drive">🚗 ซื้อตั๋ว 🪙${fmtNum(DRIVE_PRICE)}</button>${soldBadge('tk_drive')}`;
  }
  el.innerHTML = body;
  const buy = document.getElementById('btn-buy-drive');
  if(buy) buy.addEventListener('click', buyDriveTicket);
  const enter = document.getElementById('btn-enter-drive');
  if(enter) enter.addEventListener('click', enterDrive3D);
  const heal = document.getElementById('btn-drive-heal');
  if(heal) heal.addEventListener('click', advHealClick);
  const inv = document.getElementById('btn-inv-drive');
  if(inv) inv.addEventListener('click', ()=>openTinvPicker('drive'));
  const tocar = document.getElementById('btn-drive-tocar');
  if(tocar) tocar.addEventListener('click', gotoVehicleShop);
}

function buyDriveTicket(){
  if(state.driveTicket) return;
  if(!state.droneTicket){ sfx.wrong(); toast('🔒 ต้องมีตั๋วโลกโดรน FPV ก่อนถึงจะซื้อตั๋วขับรถได้นะ'); return; }
  if(state.coins < DRIVE_PRICE){
    sfx.wrong(); toast(`ตั๋วโลกขับรถกำแพงเพชร 🪙${fmtNum(DRIVE_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>🚗 ซื้อตั๋วโลกขับรถกำแพงเพชร</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(DRIVE_PRICE)}</b><br>
    ขับรถเที่ยวเมืองกำแพงเพชรจริง เก็บตัวอักษรบนถนน — คำละ 🪙40<br>
    <small>🕰️ ถนน/ตึก/แม่น้ำตรงตามแผนที่จริง เริ่มที่หอนาฬิกาวงเวียนต้นโพธิ์ · ชนตึกแรงๆ รถพัง รักษา 🪙${fmtNum(CURE_COST)}<br>
    ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย! 🚗', ()=>{
      state.coins -= DRIVE_PRICE;
      state.driveTicket = true;
      if(typeof sellInc==='function') sellInc('tk_drive');
      sfx.buy();
      toast('🚗 ได้ตั๋วโลกขับรถกำแพงเพชรแล้ว! กดปุ่มเขียว "ออกรถ" ได้เลย 🕰️');
      saveState();
      renderDashboard();
    });
}

/* เข้าโลกขับรถ (engine เดียวกัน โหมด drive) — โหลดแผนที่เมืองจริงเพิ่ม 1 ไฟล์ (~240KB โหลดครั้งเดียว) */
async function enterDrive3D(){
  if(!state.driveTicket || state.advHurt || advLoading) return;
  // 🔐 รอบ 131: ยังไม่มีรถ / ค้างค่างวด — ขับไม่ได้ พาไปหมวดยานพาหนะ
  if(carDriveBlock()){ sfx.wrong(); showNeedCarDialog(carDriveBlock()); return; }
  if(!window.Adventure3D || !window.KPP_CITY){
    advLoading = true;
    toast('🚗 กำลังสตาร์ทรถ + โหลดแผนที่เมืองกำแพงเพชร...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/data/city_kpp.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดโลกขับรถไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  // 🧱 เลือกตัวละครบล็อกก่อนออกรถ (จำตัวล่าสุดไว้ · เพื่อนใน map เห็นเป็นตัวที่เลือก) — กดยกเลิก = ไม่เข้าโลก
  const go = await Adventure3D.pickBlockAvatar();
  if(!go) return;
  Adventure3D.start('drive');
}

/* ============================================================
   ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
   เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษรลอยหน้าประตู ประกอบเป็นคำ · คำละ 🪙20
   ============================================================ */
function renderSoccerCard(){
  const el = document.getElementById('soccer-card');
  if(!el) return;
  let body;
  if(state.soccerTicket && state.advHurt){
    body = `
      <h3 class="shop-title">⚽ ตั๋วโลกสนามฟุตบอล</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">🤕</div>
        <b>ยังบาดเจ็บอยู่!</b><br>
        <small>ต้องรักษาตัวก่อนถึงจะกลับไปลงสนามได้</small>
      </div>
      <button class="big-btn red home-btn" id="btn-soccer-heal">💊 รักษาตัว 🪙${fmtNum(CURE_COST)}</button>`;
  }else if(state.soccerTicket){
    body = `
      <h3 class="shop-title">⚽ ตั๋วโลกสนามฟุตบอล</h3>
      <div class="ticket-owned">
        <div style="font-size:44px">⚽🥅</div>
        <b>นักเตะพร้อมลงสนาม!</b><br>
        <small>เล็ง + <b>กดค้างเพื่อชาร์จพลัง</b> แล้วเตะบอลใส่ป้ายตัวอักษรที่ลอยหน้าประตู<br>
        ประกอบเป็นคำ คำละ 🪙20 · เลือก<b>สีเสื้อ + เบอร์หลังเสื้อ</b> · มุมมองบุคคลที่ 1/3<br>
        🧑‍🤝‍🧑 เห็นเพื่อนในสนามเดียวกันแบบสด</small>
      </div>
      <button class="big-btn green home-btn" id="btn-enter-soccer">⚽ ลงสนาม!</button>`;
  }else if(!state.driveTicket){
    body = `
      <h3 class="shop-title">⚽ ตั๋วโลกสนามฟุตบอล</h3>
      <div class="lock-banner">🔒 การ์ดตั๋วถูกล็อก — ต้องมี<b>ตั๋วโลกขับรถกำแพงเพชร 🚗</b>ก่อน (ไต่ระดับโลก 3D ทีละใบ)</div>`;
  }else{
    body = `
      <h3 class="shop-title">⚽ ตั๋วโลกสนามฟุตบอล</h3>
      <div class="ticket-desc">
        <div style="font-size:44px">⚽🏟️</div>
        <b>ลงสนามฟุตบอล 3D!</b><br>
        <small>เล็งแล้วเตะบอลใส่ป้ายตัวอักษรที่ลอยนิ่งหน้าประตู ให้ครบเป็นคำ — คำละ 🪙20<br>
        กดปุ่มเตะค้างเพื่อเพิ่มพลัง · เลือกสีเสื้อ + เบอร์หลังเสื้อ · มุมมองบุคคลที่ 1/3<br>
        ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></div>
      <button class="big-btn blue home-btn" id="btn-buy-soccer">⚽ ซื้อตั๋ว 🪙${fmtNum(SOCCER_PRICE)}</button>${soldBadge('tk_soccer')}`;
  }
  el.innerHTML = body;
  const buy = document.getElementById('btn-buy-soccer');
  if(buy) buy.addEventListener('click', buySoccerTicket);
  const enter = document.getElementById('btn-enter-soccer');
  if(enter) enter.addEventListener('click', enterSoccer3D);
  const heal = document.getElementById('btn-soccer-heal');
  if(heal) heal.addEventListener('click', advHealClick);
}

function buySoccerTicket(){
  if(state.soccerTicket) return;
  if(!state.driveTicket){ sfx.wrong(); toast('🔒 ต้องมีตั๋วโลกขับรถกำแพงเพชรก่อนถึงจะซื้อตั๋วสนามฟุตบอลได้นะ'); return; }
  if(state.coins < SOCCER_PRICE){
    sfx.wrong(); toast(`ตั๋วโลกสนามฟุตบอล 🪙${fmtNum(SOCCER_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>⚽ ซื้อตั๋วโลกสนามฟุตบอล</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(SOCCER_PRICE)}</b><br>
    เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร ประกอบเป็นคำ — คำละ 🪙20<br>
    <small>⚽ เลือกสีเสื้อ+เบอร์หลังเสื้อ · มุมมองบุคคลที่ 1/3<br>
    ตั๋วเฉพาะตัว ขายต่อ/ส่งต่อไม่ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย! ⚽', ()=>{
      state.coins -= SOCCER_PRICE;
      state.soccerTicket = true;
      if(typeof sellInc==='function') sellInc('tk_soccer');
      sfx.buy();
      toast('⚽ ได้ตั๋วโลกสนามฟุตบอลแล้ว! กดปุ่มเขียว "ลงสนาม" ได้เลย 🥅');
      saveState();
      renderDashboard();
    });
}

/* เข้าโลกสนามฟุตบอล (engine เดียวกัน โหมด soccer) */
async function enterSoccer3D(){
  if(!state.soccerTicket || state.advHurt || advLoading) return;
  if(!window.Adventure3D){
    advLoading = true;
    toast('⚽ กำลังเข้าสนาม...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดสนามฟุตบอลไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  Adventure3D.start('soccer');
}

/* ============================================================
   🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
   ปุ่มทุกใบสร้างจาก WORLD3D ก้อนเดียว → มีโลก 3D ใหม่ในอนาคต
   แค่ "เพิ่ม 1 บรรทัด" ที่นี่ (โหมด/ไอคอน/ชื่อ/คีย์ตั๋ว/การ์ดร้าน/ฟังก์ชันเข้า)
   แล้วปุ่มจะโผล่ในรางเอง · มีตั๋ว = กดเข้าโลกเลย · ยังไม่มีตั๋ว = 🔒 พาไปการ์ดซื้อในร้านค้า
   ============================================================ */
const WORLD3D = [
  { mode:'adv',   ico:'🌍', label:'ผจญภัย', ticketKey:'advTicket',   doneKey:'advDone',   price:TICKET_PRICE, card:'ticket-card', enter:enterAdventure3D },
  { mode:'haunt', ico:'👻', label:'ผีสิง',  ticketKey:'hauntTicket', doneKey:'hauntDone', price:HAUNT_PRICE,  card:'haunt-card',  enter:enterHaunted3D },
  { mode:'heli',  ico:'🚁', label:'เฮลิ',   ticketKey:'heliTicket',  doneKey:'heliDone',  price:HELI_PRICE,   card:'heli-card',   enter:enterHeli3D },
  { mode:'drone', ico:'🛸', label:'โดรน',   ticketKey:'droneTicket', doneKey:'droneDone', price:DRONE_PRICE,  card:'drone-card',  enter:enterDrone3D },
  { mode:'drive', ico:'🚗', label:'ขับรถ',  ticketKey:'driveTicket', doneKey:'driveDone', price:DRIVE_PRICE,  card:'drive-card',  enter:enterDrive3D },
  { mode:'soccer',ico:'⚽', label:'ฟุตบอล', ticketKey:'soccerTicket',doneKey:'soccerDone',price:SOCCER_PRICE, card:'soccer-card', enter:enterSoccer3D },
  { mode:'mecha', ico:'🤖', label:'หุ่นรบ', owned:()=>!!(state.robots&&state.robots.length), doneKey:'mechaDone', price:ROBOTS[0].price, card:'mkt-robots', enter:enterMecha3D },
];
function gotoRobotShop(){
  if(typeof openPanel === 'function') openPanel('panel-market');
  setTimeout(()=>{ const s = document.getElementById('mkt-robots'); if(s) s.scrollIntoView({behavior:'smooth', block:'start'}); }, 150);
}

function scrollShopCardIntoView(id){
  setTimeout(()=>{ const c = document.getElementById(id); if(c) c.scrollIntoView({behavior:'smooth', block:'center'}); }, 120);
}
function railWorldClick(w){
  if(state.advHurt){                                        // บาดเจ็บ → รักษาก่อน (การ์ดร้านมีปุ่มรักษา)
    sfx.wrong(); toast('🤕 ยังบาดเจ็บอยู่ ต้องรักษาตัวก่อนเข้าโลก 3D');
    if(typeof openPanel === 'function') openPanel('panel-shop');
    scrollShopCardIntoView(w.card); return;
  }
  const hasAccess = w.owned ? w.owned() : !!state[w.ticketKey];
  if(!hasAccess){                                           // ยังไม่มีตั๋ว/หุ่น → พาไปซื้อ
    sfx.select();
    if(w.mode === 'mecha'){ toast('🤖 ยังไม่มีหุ่นยนต์ — ไปซื้อที่หมวดยานพาหนะก่อนนะ'); gotoRobotShop(); return; }
    toast(`${w.ico} ยังไม่มีตั๋วโลก${w.label} — ไปซื้อตั๋วในร้านค้าก่อนนะ`);
    if(typeof openPanel === 'function') openPanel('panel-shop');
    scrollShopCardIntoView(w.card); return;
  }
  if(w.mode === 'drive' && carDriveBlock()){                // 🔐 รอบ 131: มีตั๋วแต่ไม่มีรถ/ค้างงวด → กล่องพาไปหมวดยานพาหนะ
    sfx.wrong(); showNeedCarDialog(carDriveBlock()); return;
  }
  w.enter();                                                // มีตั๋ว + ไม่บาดเจ็บ → เข้าโลกเลย
}

/* สร้างปุ่มโลก 3D ในรางครั้งแรก แล้วอัปเดตสถานะล็อก/ปลดล็อกทุกครั้งที่ render */
function renderRailWorlds(){
  const rail = document.querySelector('.lobby-rail');
  if(!rail) return;
  let box = document.getElementById('rail-worlds');
  if(!box){                                                 // สร้างครั้งเดียว
    box = document.createElement('div');
    box.id = 'rail-worlds';
    box.className = 'rail-worlds';
    box.innerHTML = '<div class="rail-div">โลก 3D</div>';
    WORLD3D.forEach(w=>{
      const b = document.createElement('button');
      b.className = 'rail-btn rail-world';
      b.id = 'btn-world-' + w.mode;
      b.innerHTML = `<span class="rail-ico">${w.ico}</span>${w.label}`
        + `<span class="rail-lock" style="display:none">🔒</span>`          // มุมขวาบน: ล็อกอยู่
        + `<span class="rail-count" style="display:none">0</span>`          // มุมขวาบน: จำนวนคำที่พิชิตแล้ว (ปลดล็อกแล้ว)
        + `<span class="rail-price" style="display:none"></span>`;          // ใต้ชื่อ: ราคาตั๋ว (ยังไม่มีตั๋ว)
      b.addEventListener('click', ()=>railWorldClick(w));
      box.appendChild(b);
    });
    rail.appendChild(box);
  }
  WORLD3D.forEach(w=>{
    const b = document.getElementById('btn-world-' + w.mode);
    if(!b) return;
    const locked = w.owned ? !w.owned() : !state[w.ticketKey];
    const done   = Array.isArray(state[w.doneKey]) ? state[w.doneKey].length : 0;
    const afford = state.coins >= w.price;
    b.classList.toggle('locked', locked);
    const lk = b.querySelector('.rail-lock');
    const cnt = b.querySelector('.rail-count');
    const pr  = b.querySelector('.rail-price');
    if(locked){                                               // ยังไม่มีตั๋ว → 🔒 + ราคาตั๋ว (พอซื้อ=เขียว "พร้อม!")
      if(lk){ lk.style.display = ''; lk.textContent = '🔒'; }
      if(cnt) cnt.style.display = 'none';
      if(pr){
        pr.style.display = '';
        pr.textContent = '🪙' + fmtNum(w.price);
        pr.classList.toggle('afford', afford);
        pr.title = afford ? 'เหรียญพอซื้อตั๋วแล้ว!' : '';
      }
    }else{                                                    // ปลดล็อกแล้ว → ซ่อนราคา · โชว์จำนวนคำที่พิชิต (ถ้ามี)
      // 🔐 รอบ 131: โลกขับรถมีตั๋วแต่ยังไม่มีรถ/ค้างค่างวด → กุญแจเหลืองล็อกทับ (ซื้อรถแล้วหายถาวร)
      const carBlock = w.mode === 'drive' ? carDriveBlock() : '';
      if(lk){
        lk.style.display = carBlock ? '' : 'none';
        if(carBlock){ lk.textContent = '🔐'; lk.title = carBlock==='nocar' ? 'ต้องซื้อรถก่อน จึงจะขับรถได้' : 'ค้างค่างวดรถ — จ่ายก่อนถึงขับได้'; }
      }
      if(pr) pr.style.display = 'none';
      if(cnt){
        cnt.style.display = (done > 0 && !carBlock) ? '' : 'none';
        cnt.textContent = fmtNum(done);
        cnt.title = 'พิชิตไปแล้ว ' + fmtNum(done) + ' คำ';
      }
    }
  });
}

/* ---------- คำเชิญเล่นด้วยกัน (เงินคืนคนละ TINV_CASHBACK เมื่อเจอกันใน map) ---------- */
function tinvNoticeHTML(map){
  if(state.tinvClaimed && state.tinvClaimed[map]) return '';
  if(!(window.Online && Online.tinv)) return '';
  const from = Object.values(Online.tinv).filter(v=>v.map===map);
  if(!from.length) return '';
  return `<div class="tinv-note">📨 <b>${escapeHTML(from[0].n)}</b> ชวนหนูไปเล่นด้วยกัน!
    เข้าโลกให้เจอกันใน map แล้วรับเงินคืนคนละ <b>🪙${fmtNum(TINV_CASHBACK)}</b></div>`;
}
function openTinvPicker(map){
  if(!(window.Online && Online.ready)){ sfx.wrong(); toast('⚠️ ยังไม่ได้เชื่อมต่อออนไลน์ — ลองใหม่อีกครั้งนะ'); return; }
  const friends = (Online.myFriends || []);
  if(!friends.length){ sfx.wrong(); toast('ยังไม่มีเพื่อนเลย — ไปเพิ่มเพื่อนที่เมนู 🧑‍🤝‍🧑 ก่อนนะ'); return; }
  const w = map==='haunt' ? 'โลกผีสิง 👻' : map==='heli' ? 'โลกเฮลิคอปเตอร์ 🚁' : map==='drone' ? 'โลกโดรน FPV 🛸' : 'โลกผจญภัย 🌍';
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box" style="max-width:340px">
    <h2 style="font-size:18px">📨 ชวนเพื่อนไปเล่น${w}</h2>
    <p style="font-size:13px;margin:4px 0">เล่นพร้อมกันใน map ครั้งแรก รับเงินคืน<b>คนละ 🪙${fmtNum(TINV_CASHBACK)}</b></p>
    <div style="max-height:44vh;overflow-y:auto;margin:8px 0">
      ${friends.map(f=>{
        const on = Online.presenceMap && Online.presenceMap[f.uid];
        const sent = state.tinvSent[f.uid] && state.tinvSent[f.uid].map===map;
        return `<button class="big-btn ${sent?'':'blue'}" data-uid="${f.uid}" data-n="${escapeHTML(f.n)}" ${sent?'disabled style="opacity:.55"':''}
          style="width:100%;margin:3px 0;font-size:14px;padding:8px">${on?'🟢':'⚪'} ${escapeHTML(f.n)}${sent?' · ✅ ชวนแล้ว':''}</button>`;
      }).join('')}
    </div>
    <button class="big-btn" id="tinv-close" style="width:100%;font-size:14px;padding:8px">ปิด</button>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#tinv-close').addEventListener('click', ()=>overlay.remove());
  overlay.querySelectorAll('button[data-uid]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const uid = btn.dataset.uid;
      tinvSend(uid, map).then(()=>{
        state.tinvSent[uid] = {map, ts: Date.now()};
        saveState();
        sfx.buy();
        toast(`📨 ส่งคำชวนถึง ${btn.dataset.n} แล้ว! เข้าโลกรอเจอกันได้เลย`);
        overlay.remove();
      }).catch(()=>{
        sfx.wrong(); toast('⚠️ ส่งคำชวนไม่สำเร็จ — ลองใหม่อีกครั้งนะ');
      });
    });
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
   โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
   - โรงงานผลิต: เลือกสินค้าค้างไว้ → เล่นเกมคำศัพท์ ตอบถูก 1 คำ = 1 แต้มผลิต
     (เครื่องยนต์ addCraft ใน state.js — hook อยู่ใน game.js) ครบแล้วเข้าคลัง
   - ออเดอร์พิเศษ: ลูกค้าจำลองสั่งผลิตเจาะจง จ่ายแพงกว่าราคาฐาน (orderTick ใน state.js)
   - คลังของฉัน: ตั้งราคาขายเอง · ลูกค้าจำลองมาซื้อตามเวลา (marketTick)
   หมายเหตุ: ผู้ซื้อเป็น "จำลอง" — เฟส 2 ต่อ Firebase ให้ผู้เล่นจริงซื้อขายของที่เพื่อนผลิต
   ============================================================ */
function collectImg(id){ return IMG_FILES[`collect_${id}`] || null; }

/* ============================================================
   โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
   เฉพาะสายการผลิต: งานที่กำลังผลิต + แคตตาล็อกเลือกสินค้าผลิต
   ============================================================ */
function renderFactoryCard(){
  const el = document.getElementById('factory-card');
  if(!el) return;
  el.innerHTML = `<h3 class="shop-title">🏭 โรงงานผลิตสินค้า</h3>
    <p class="collect-sub">เล่นเกมคำศัพท์เพื่อผลิตสินค้า (ตอบถูก 1 คำ = 1 แต้มผลิต) ผลิตเสร็จเก็บเข้าคลัง เอาไปตั้งขายที่เมนู 🏪 ตลาดได้เลย</p>
    ${renderFactory()}`;

  const catSel = document.getElementById('factory-cat');
  if(catSel) catSel.addEventListener('change', ()=>{ factoryCat = catSel.value; factoryPage = 0; sfx.select(); renderFactoryCard(); });
  /* เปลี่ยนหน้าแคตตาล็อก: ปุ่มลูกศร (เมาส์) + ปัดซ้ายขวา (จอสัมผัส) */
  const goPage = (d)=>{
    factorySlide = d > 0 ? 'left' : 'right';   // ปัดไปหน้าถัดไป → รายการใหม่สไลด์เข้าจากขวา
    factoryPage += d;
    sfx.select();
    renderFactoryCard();
    factorySlide = '';
  };
  const prevB = document.getElementById('factory-prev');
  const nextB = document.getElementById('factory-next');
  if(prevB) prevB.addEventListener('click', ()=>{ if(!prevB.disabled) goPage(-1); });
  if(nextB) nextB.addEventListener('click', ()=>{ if(!nextB.disabled) goPage(1); });
  const flist = document.getElementById('factory-list');
  if(flist){
    let sx = 0, sy = 0;
    flist.addEventListener('touchstart', (e)=>{
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, {passive:true});
    flist.addEventListener('touchend', (e)=>{
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if(Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)*1.5) return;   // ปัดสั้นไป/ตั้งใจเลื่อนจอแนวตั้ง
      if(dx < 0 && nextB && !nextB.disabled) goPage(1);                  // ปัดซ้าย = หน้าถัดไป
      if(dx > 0 && prevB && !prevB.disabled) goPage(-1);                 // ปัดขวา = หน้าก่อนหน้า
    }, {passive:true});
  }
  el.querySelectorAll('.craft-make').forEach(b=>b.addEventListener('click', ()=>startProduce(b.dataset.id)));
  const goBtn = document.getElementById('craft-go');
  if(goBtn) goBtn.addEventListener('click', ()=>startGame(null));
  const cancelBtn = document.getElementById('craft-cancel');
  if(cancelBtn) cancelBtn.addEventListener('click', cancelProduce);
}

/* ============================================================
   ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
   ออเดอร์พิเศษ + คลังของฉัน (ตั้งราคาขาย) + รายการที่กำลังลงขาย + กล่องขายสำเร็จ
   ============================================================ */
function renderMarketCard(){
  const el = document.getElementById('market-card');
  if(!el) return;

  /* กล่องแจ้ง "ขายของสำเร็จ" (ลูกค้าจำลองมาซื้อของที่เราลงขาย) */
  let soldUI = '';
  if(state.tradeSold.length){
    const total = state.tradeSold.reduce((s,x)=>s + x.price, 0);
    const items = state.tradeSold.slice().reverse().map(x=>{
      const c = collectInfo(x.id);
      return `<li>${c ? c.emoji+' '+c.name : x.id} — 🪙${fmtNum(x.price)}</li>`;
    }).join('');
    soldUI = `<div class="mkt-sold">📬 <b>ขายสินค้าได้ ${state.tradeSold.length} ชิ้น!</b> รับเงินรวม 🪙${fmtNum(total)}
      <ul>${items}</ul>
      <button id="mkt-sold-ok">รับทราบ ✅</button></div>`;
  }

  el.innerHTML = `<h3 class="shop-title">🏪 ตลาดขายสินค้า</h3>
    <p class="collect-sub">เอาสินค้าที่ผลิตจากโรงงานมาตั้งราคาขาย หรือส่งมอบออเดอร์พิเศษให้ลูกค้าทำกำไร 🌍</p>
    <button class="wl-open" id="btn-wishlist">💖 ของที่หนูเล็งไว้${state.wishlist && state.wishlist.length ? ` (${state.wishlist.length})` : ''} <small>มีคนลงขาย = แจ้งเตือนทันที</small></button>
    ${soldUI}
    ${renderOrdersUI()}
    ${renderMarketBrowse()}
    ${renderVehicleShop()}
    <div class="mkt-listhead">🎁 คลังสินค้าของฉัน${state.collection.length?` (${state.collection.length} ชิ้น)`:''}</div>
    ${renderCollectMine()}`;

  const soldOk = document.getElementById('mkt-sold-ok');
  if(soldOk) soldOk.addEventListener('click', ()=>{ state.tradeSold = []; saveState(); renderMarketCard(); });
  el.querySelectorAll('.order-deliver').forEach(b=>b.addEventListener('click', ()=>deliverOrder(+b.dataset.i)));
  el.querySelectorAll('.cc-list-btn').forEach(b=>b.addEventListener('click', ()=>openListDialog(b.dataset.id)));
  el.querySelectorAll('.ml-cancel').forEach(b=>b.addEventListener('click', ()=>cancelListing(+b.dataset.i)));
  el.querySelectorAll('.mb-buy').forEach(b=>b.addEventListener('click', ()=>buyMarketItem(b.dataset.key)));
  el.querySelectorAll('.car-buy').forEach(b=>b.addEventListener('click', ()=>openCarBuyDialog(b.dataset.id)));
  if(typeof rsInit==='function') rsInit();   // 🤖 โชว์รูมหุ่นยนต์ (thumb+จอใหญ่วนโชว์)
  const insBtn = document.getElementById('car-buy-ins');
  if(insBtn) insBtn.addEventListener('click', buyCarInsurance);
  const payBtn = document.getElementById('car-pay-loan');
  if(payBtn) payBtn.addEventListener('click', payCarLoanMonthly);
  const clsBtn = document.getElementById('car-close-loan');
  if(clsBtn) clsBtn.addEventListener('click', payCarLoanFull);
  const wl = document.getElementById('btn-wishlist');
  if(wl) wl.addEventListener('click', openWishlistDialog);
  updateWishBadge();
}

/* 💖 รอบ 126: badge ที่ปุ่มราง 🏪 ตลาด = จำนวนของที่เล็งไว้ซึ่งมีคนลงขายอยู่ตอนนี้ */
function updateWishBadge(){
  const b = document.getElementById('mkt-wish-badge');
  if(!b || typeof state === 'undefined') return;
  const me = (typeof onlineKey === 'function') ? onlineKey() : '';
  const n = (typeof Online !== 'undefined' && Online.marketOk)
    ? (Online.market || []).filter(m=>m.sid !== me && (state.wishlist || []).includes(m.id)).length : 0;
  b.style.display = n ? '' : 'none';
  b.textContent = n;
}

/* 💖 รอบ 126: กล่องเลือก "ของที่หนูเล็งไว้" — แตะสลับเล็ง/เลิกเล็งได้ทั้งแคตตาล็อก 50 ชิ้น */
function openWishlistDialog(){
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const grid = ()=>COLLECTIBLES.map(c=>{
    const on = (state.wishlist || []).includes(c.id);
    const tier = COLLECT_TIERS[c.tier], img = collectImg(c.id);
    return `<div class="wl-it ${on ? 'on' : ''}" data-id="${c.id}" style="border-color:${on ? '#e0447a' : tier.color}">
      ${img ? `<img src="${img}" alt="">` : `<span class="wl-emoji">${c.emoji}</span>`}
      <div class="wl-name">${c.name}</div>
      <div class="wl-h">${on ? '💖 เล็งอยู่' : '🤍 แตะเพื่อเล็ง'}</div>
    </div>`;
  }).join('');
  overlay.innerHTML = `<div class="levelup-box wl-box">
    <h2>💖 ของที่หนูเล็งไว้</h2>
    <p class="ld-note">แตะเลือกของที่อยากได้ — พอมีเพื่อนลงขายในตลาด เกมจะแจ้งเตือนหนูทันที!</p>
    <div class="wl-grid">${grid()}</div>
    <button class="cf-ok" style="margin-top:12px">เสร็จแล้ว ✅</button>
  </div>`;
  const wrap = overlay.querySelector('.wl-grid');
  wrap.addEventListener('click', e=>{
    const it = e.target.closest('.wl-it');
    if(!it) return;
    const id = it.dataset.id;
    if(!Array.isArray(state.wishlist)) state.wishlist = [];
    const i = state.wishlist.indexOf(id);
    if(i >= 0) state.wishlist.splice(i, 1); else state.wishlist.push(id);
    sfx.select();
    saveState();
    wrap.innerHTML = grid();
    updateWishBadge();
  });
  overlay.querySelector('.cf-ok').addEventListener('click', ()=>{ overlay.remove(); renderMarketCard(); });
  document.body.appendChild(overlay);
}

/* 🏪 item 2: ชั้นวางของจากเพื่อนทั้งเซิร์ฟเวอร์ — โชว์เมื่อตลาดจริงเปิดแล้ว (rules /market publish) */
function renderMarketBrowse(){
  if(typeof Online === 'undefined' || !Online.marketOk) return '';
  const me = (typeof onlineKey === 'function') ? onlineKey() : '';
  const items = (Online.market || []).filter(m=>m.sid !== me);
  const inner = items.length
    ? `<div class="hq-grid">` + items.map(m=>{
        const c = collectInfo(m.id), tier = COLLECT_TIERS[c.tier], img = collectImg(m.id);
        const afford = state.coins >= m.p;
        const wished = (state.wishlist || []).includes(m.id);   // 💖 ของที่เล็งไว้ — ขับให้เด่น
        return `<div class="hq-card ${wished ? 'mb-wish' : ''}" style="border-color:${wished ? '#e0447a' : tier.color}">
          <div class="hq-head">${wished ? '💖 ' : ''}${c.name}</div>
          <div class="hq-pic">
            ${img?`<img src="${img}" alt="">`:`<span class="hq-emoji">${c.emoji}</span>`}
            <span class="hq-stars" style="color:${tier.color}">${tier.stars}</span>
          </div>
          <div class="mb-seller">🧑‍🤝‍🧑 ร้านของ ${escapeHTML(m.sn)}</div>
          <button class="hq-price mb-buy ${afford?'':'cant-afford'}" data-key="${m.key}">🪙${fmtNum(m.p)} · ซื้อเลย</button>
        </div>`;
      }).join('') + `</div>`
    : `<div class="mkt-empty">ยังไม่มีเพื่อนลงขายตอนนี้ — ผลิตของแล้วมาเปิดร้านคนแรกกันเถอะ! 🏪</div>`;
  return `<div class="mkt-listhead">🌏 ตลาดเพื่อนออนไลน์ — ของที่เพื่อนผลิตเอง${items.length?` (${items.length} ชิ้น)`:''}</div>` + inner;
}

/* ============================================================
   🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
   ตั๋วขับรถ = สิทธิ์เข้าเมือง · รถ = พาหนะ ต้องซื้อแยก (ผู้ใช้เคาะ 11 ก.ค. 2026)
   ภาพ img/cars/<id>.png probe อัตโนมัติ — ไม่มีภาพใช้ 🚗 บนพื้นสีประจำคัน เกมไม่พัง
   ============================================================ */
let carsProbed = false;
function carImg(id){ return IMG_FILES[id] || null; }
function renderVehicleShop(){
  if(!carsProbed){
    carsProbed = true;
    probeImages(CARS.map(c=>c.id), 'img/cars').then(()=>{ if(document.getElementById('mkt-vehicles')) renderMarketCard(); });
  }
  /* กล่อง "รถของหนู" — สถานะ พ.ร.บ./ประกัน + งวดผ่อน (จ่ายงวด/โปะปิดยอด) */
  let mine = '';
  if(state.car){
    const my = carInfo(state.car.id), img = carImg(my.id);
    const L = state.car.loan, overdue = carLoanOverdue(), payable = carLoanPayable();
    mine = `<div class="car-mine" style="border-color:${my.c}">
      <div class="car-mine-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${my.c}33;border-color:${my.c}">🚗</span>`}</div>
      <div class="car-mine-info">
        <b>🚘 รถของหนู: ${my.name}</b><br>
        <small>📋 พ.ร.บ. ✅ · 🛡️ ประกันภัย ${state.car.insured
          ? '✅ คุ้มครองชนรถผู้เล่นอื่น'
          : `❌ ยังไม่มี (ชนรถเพื่อน = จ่ายเอง 🪙${fmtNum(CAR_HITCAR_FEE)}/ครั้ง)`}</small>
        ${L?`<div class="car-loan ${overdue?'od':''}">📅 ผ่อนเหลือ <b>🪙${fmtNum(L.remain)}</b> · เดือนละ 🪙${fmtNum(L.perMonth)}${
          overdue?`<br>⚠️ <b>ค้างงวด 🪙${fmtNum(overdue)} — ขับรถไม่ได้จนกว่าจะจ่าย!</b>`
          :(carLoanDue()-L.paid>0?`<br>งวดเดือนนี้เหลือ 🪙${fmtNum(carLoanDue()-L.paid)}`:'<br>งวดเดือนนี้จ่ายแล้ว ✅')}</div>`
        :'<div class="car-loan">💵 จ่ายครบแล้ว — รถเป็นของหนูเต็มตัว!</div>'}
      </div>
      <div class="car-mine-btns">
        ${!state.car.insured?`<button class="hq-price" id="car-buy-ins">🛡️ ซื้อประกัน 🪙${fmtNum(CAR_INSURANCE)}</button>`:''}
        ${L&&payable>0?`<button class="hq-price ${overdue?'car-od-btn':''}" id="car-pay-loan">📅 จ่ายงวด 🪙${fmtNum(payable)}</button>`:''}
        ${L?`<button class="hq-price" id="car-close-loan">💰 โปะปิดยอด 🪙${fmtNum(L.remain)}</button>`:''}
      </div>
    </div>`;
  }
  const grid = CARS.map(c=>{
    const img = carImg(c.id);
    const isMine = state.car && state.car.id === c.id;
    const minToday = Math.ceil(c.price*CAR_DOWN_RATE) + CAR_PRB;   // ถูกสุดที่ต้องมีวันนี้ = ดาวน์+พ.ร.บ.
    const btn = isMine ? `<button class="hq-price car-cur">🚘 รถของหนู</button>`
      : state.car ? `<button class="hq-price car-cur">มีรถอยู่แล้ว</button>`
      : `<button class="hq-price car-buy ${state.coins>=minToday?'':'cant-afford'}" data-id="${c.id}">🪙${fmtNum(c.price)} · ดูรายละเอียด</button>`;
    return `<div class="hq-card ${isMine?'hq-cur':''}" style="border-color:${c.c}">
      <div class="hq-head">${c.name}</div>
      <div class="hq-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${c.c}33;border-color:${c.c}">🚗</span>`}</div>
      ${btn}
      ${soldBadge(c.id)}
    </div>`;
  }).join('');
  return `<div class="mkt-listhead" id="mkt-vehicles">🚗 ยานพาหนะ — โชว์รูมรถ</div>
    <div class="gp-note">มีตั๋วโลกขับรถแล้วต้องมี<b>รถ</b>ถึงจะออกถนนได้ · ซื้อรถต้องมี <b>พ.ร.บ.</b> (บังคับ 🪙${fmtNum(CAR_PRB)})
    · <b>ประกันภัย</b>เลือกได้ (🪙${fmtNum(CAR_INSURANCE)} — คุ้มครองชนรถผู้เล่นอื่น)
    · จ่ายสด หรือผ่อน ${CAR_LOAN_MONTHS} เดือน (ดาวน์ ${Math.round(CAR_DOWN_RATE*100)}%) โปะปิดยอดได้ทุกเมื่อ</div>
    ${mine}
    <div class="hq-grid car-grid">${grid}</div>
    ${renderRobotShop()}`;
}

/* 🤖 หุ่นยนต์นักรบ (หมวดยานพาหนะ) — โชว์รูม: thumb ซ้าย (ราคา+ยอดขาย) · จอใหญ่ขวา (ไฟฟ้าไล่ตัว premium)
   ไม่แตะ = วนโชว์ทีละตัวทุก 3.5 วิ · แตะ = ค้างดูตัวนั้น + หยุดวน 2 นาที (บางคนหยุดดูจริง) แล้ววนต่อ */
let robotsProbed = false, rsIdx = 0, rsPausedUntil = 0, rsTimer = null;
const RS_CYCLE_MS = 3500, RS_PAUSE_MS = 120000;   // วนทุก 3.5 วิ · หยุดวน 2 นาทีหลังแตะ
function robotImg(id){ return IMG_FILES[id] || null; }
function renderRobotShop(){
  if(!robotsProbed){
    robotsProbed = true;
    probeImages(ROBOTS.map(r=>r.id), 'img/robots').then(()=>{ if(document.getElementById('mkt-robots')) renderMarketCard(); });
  }
  const owned = state.robots || [];
  const thumbs = ROBOTS.map((r,i)=>{
    const img = robotImg(r.id);
    return `<button class="rs-thumb${owned.includes(r.id)?' owned-r':''}" data-i="${i}" data-id="${r.id}" style="--rc:${r.c}">
      <div class="rs-thumb-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${r.c}33;border-color:${r.c}">🤖</span>`}</div>
      <div class="rs-thumb-price">🪙${fmtNum(r.price)}</div>
      ${soldBadge(r.id)}
    </button>`;
  }).join('');
  return `<div class="mkt-listhead" id="mkt-robots">🤖 หุ่นยนต์นักรบ — โชว์รูมหุ่นรบ</div>
    <div class="gp-note">แตะหุ่นเพื่อดูตัวใหญ่ · ไม่แตะ = โชว์วนทีละตัว · <b>ซื้อกี่ตัวก็ได้</b> สะสมเป็นทรัพย์สินในแรงค์ · มี ≥1 ตัว = เข้า<b>โลกหุ่นยนต์นักรบ</b> ยิงเอเลี่ยน คำละ 🪙35</div>
    <div class="rs-showroom">
      <div class="rs-list">${thumbs}</div>
      <div class="rs-stage"><div class="rs-big" id="rs-big"></div><div class="rs-info" id="rs-info"></div></div>
    </div>`;
}
/* แสดงหุ่นตัวที่ i บนจอใหญ่ + ไฟฟ้าไล่ตัว (mask ตามรูปหุ่น) + ป้ายข้อมูล/ปุ่มซื้อ */
function rsShowBig(i){
  const r = ROBOTS[i]; if(!r) return;
  const big = document.getElementById('rs-big'), info = document.getElementById('rs-info');
  if(!big || !info) return;
  const img = robotImg(r.id), have = (state.robots||[]).includes(r.id);
  if(img){
    big.style.setProperty('--rs-img', `url("${img}")`);
    big.innerHTML = `<img class="rs-big-img" src="${img}" alt="${escapeHTML(r.name)}"><div class="rs-elec"><i></i></div><div class="rs-edge"><i></i></div>`;
  }else{
    big.style.removeProperty('--rs-img');
    big.innerHTML = `<div style="font-size:120px;filter:drop-shadow(0 0 30px ${r.c})">🤖</div>`;
  }
  info.innerHTML = `<div class="rs-name">${escapeHTML(r.name)}</div>
    <div class="rs-weap" style="color:${r.c}">🔫 ${escapeHTML(r.weapon)}</div>
    <div class="rs-meta"><span class="rs-price">🪙${fmtNum(r.price)}</span>${soldBadge(r.id)}</div>
    ${have?`<button class="rs-buy own" disabled>🤖 มีหุ่นนี้แล้ว</button>`:`<button class="rs-buy" data-id="${r.id}">🛒 ซื้อหุ่นนี้</button>`}`;
  const buy = info.querySelector('.rs-buy:not(.own)');
  if(buy) buy.addEventListener('click', ()=>buyRobot(buy.dataset.id));
  document.querySelectorAll('.rs-thumb').forEach(t=>t.classList.toggle('active', +t.dataset.i===i));
}
/* เรียกหลัง render market — ผูกคลิก thumb + เริ่มวนโชว์ */
function rsInit(){
  const room = document.querySelector('.rs-showroom'); if(!room) return;
  if(rsIdx >= ROBOTS.length) rsIdx = 0;
  rsShowBig(rsIdx);
  room.querySelectorAll('.rs-thumb').forEach(b=>b.addEventListener('click', ()=>{
    rsIdx = +b.dataset.i; rsPausedUntil = Date.now() + RS_PAUSE_MS;
    if(typeof sfx!=='undefined' && sfx.select) sfx.select();
    rsShowBig(rsIdx);
  }));
  clearInterval(rsTimer);
  rsTimer = setInterval(()=>{
    const big = document.getElementById('rs-big');
    if(!big){ clearInterval(rsTimer); rsTimer = null; return; }   // ตลาด re-render/ปิด → หยุด
    if(!big.offsetParent) return;                                  // จอซ่อนอยู่ = ไม่วน
    if(Date.now() < rsPausedUntil) return;                         // เพิ่งแตะดู (ภายใน 2 นาที)
    rsIdx = (rsIdx + 1) % ROBOTS.length;
    rsShowBig(rsIdx);
  }, RS_CYCLE_MS);
}
function buyRobot(id){
  const r = ROBOTS.find(x=>x.id===id);
  if(!r || (state.robots||[]).includes(id)) return;
  if(state.coins < r.price){ sfx.wrong(); toast(`หุ่น ${r.name} 🪙${fmtNum(r.price)} — เหรียญยังไม่พอ สู้ๆ!`); return; }
  askConfirm(`<h2>🤖 ซื้อหุ่นยนต์ ${r.name}</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(r.price)}</b> · อาวุธ: <b>${r.weapon}</b><br>
    <small>บังคับเดินหน้า-ถอยเหมือนหุ่นเดิน · เข้าโลกหุ่นยนต์ยิงเอเลี่ยนตัวอักษร คำละ 🪙35<br>
    ซื้อกี่ตัวก็ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย! 🤖', ()=>{
      state.coins -= r.price;
      state.robots = state.robots || [];
      state.robots.push(id);
      if(!state.mechaRobot) state.mechaRobot = id;
      if(typeof sellInc==='function') sellInc(r.id);      // 🛒 นับยอดขาย
      sfx.buy();
      toast(`🤖 ได้หุ่น ${r.name} แล้ว! เข้าโลกหุ่นยนต์นักรบได้เลย 💥`);
      saveState();
      renderDashboard();
    });
}

/* เลือกหุ่นก่อนเข้าโลก (ถ้ามีหลายตัว) แล้วเข้าโลก mecha */
async function enterMecha3D(){
  if(!(state.robots && state.robots.length) || state.advHurt || advLoading) return;
  const chosen = await pickMechaRobot();
  if(!chosen) return;
  state.mechaRobot = chosen; saveState();
  if(!window.Adventure3D){
    advLoading = true;
    toast('🤖 กำลังบูตระบบหุ่นยนต์...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/adventure3d.js');
    }catch(e){
      advLoading = false;
      sfx.wrong(); toast('⚠️ โหลดโลกหุ่นยนต์ไม่สำเร็จ — เช็กอินเทอร์เน็ตแล้วลองใหม่นะ');
      return;
    }
    advLoading = false;
  }
  Adventure3D.start('mecha');
}
/* หน้าต่างเลือกหุ่น (เฉพาะตัวที่ครอบครอง) — คืน id หรือ null ถ้ายกเลิก */
function pickMechaRobot(){
  return new Promise(res=>{
    const owned = (state.robots||[]).map(id=>ROBOTS.find(r=>r.id===id)).filter(Boolean);
    if(owned.length<=1){ res(owned[0]?owned[0].id:null); return; }
    let sel = state.mechaRobot && owned.some(r=>r.id===state.mechaRobot) ? state.mechaRobot : owned[0].id;
    const ov = document.createElement('div');
    ov.className = 'levelup-overlay';
    ov.innerHTML = `<div class="levelup-box" style="max-width:560px">
      <h2>🤖 เลือกหุ่นออกรบ</h2>
      <div class="hq-grid car-grid" id="rp-grid">${owned.map(r=>{
        const img = robotImg(r.id);
        return `<div class="hq-card rp-it${r.id===sel?' hq-cur':''}" data-id="${r.id}" style="border-color:${r.c};cursor:pointer">
          <div class="hq-head">${r.name}</div>
          <div class="hq-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${r.c}33;border-color:${r.c}">🤖</span>`}</div>
          <div class="robot-weap" style="color:${r.c}">🔫 ${r.weapon}</div></div>`;
      }).join('')}</div>
      <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="rp-go">ออกรบ! 💥</button></div>
    </div>`;
    ov.querySelectorAll('.rp-it').forEach(el=>el.addEventListener('click',()=>{
      sel = el.dataset.id; sfx.select();
      ov.querySelectorAll('.rp-it').forEach(e2=>e2.classList.toggle('hq-cur', e2===el));
    }));
    ov.querySelector('.cb-x').addEventListener('click',()=>{ ov.remove(); res(null); });
    ov.querySelector('#rp-go').addEventListener('click',()=>{ ov.remove(); res(sel); });
    document.body.appendChild(ov);
  });
}

/* กล่องซื้อรถ — แจ้งชัด 3 รายการ: ราคารถ · พ.ร.บ. (บังคับ) · ประกัน (ทางเลือก) + เลือกจ่ายสด/ผ่อน */
function openCarBuyDialog(id){
  const c = carInfo(id);
  if(!c || state.car) return;
  sfx.select();
  let ins = false, plan = 'cash';
  const down = Math.ceil(c.price*CAR_DOWN_RATE);
  const perMonth = Math.ceil((c.price-down)/CAR_LOAN_MONTHS);
  const img = carImg(id);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box car-buy-box">
    <h2>🚗 ซื้อรถ ${c.name}</h2>
    <div class="cb-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${c.c}33;border-color:${c.c}">🚗</span>`}</div>
    <div class="cb-lines">
      <div class="cb-li"><span>🚗 ราคารถ</span><b>🪙${fmtNum(c.price)}</b></div>
      <div class="cb-li"><span>📋 พ.ร.บ. <small>(บังคับตามกฎหมาย)</small></span><b>🪙${fmtNum(CAR_PRB)}</b></div>
      <div class="cb-li cb-ins" id="cb-ins"><span>🛡️ ประกันภัย <small>(ทางเลือก — ชนรถผู้เล่นอื่น ประกันจ่ายให้)</small></span>
        <b>🪙${fmtNum(CAR_INSURANCE)}</b><button id="cb-ins-tg">➕ เอาด้วย</button></div>
    </div>
    <div class="cb-plan">
      <button class="cb-pl sel" data-p="cash">💵 จ่ายสด</button>
      <button class="cb-pl" data-p="loan">📅 ผ่อน ${CAR_LOAN_MONTHS} เดือน<small>ดาวน์ ${Math.round(CAR_DOWN_RATE*100)}% · ค้างงวด=ขับไม่ได้ชั่วคราว</small></button>
    </div>
    <div class="cb-total" id="cb-total"></div>
    <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="cb-buy">ซื้อเลย! 🚗</button></div>
  </div>`;
  const todayCost = ()=>(plan==='cash'?c.price:down) + CAR_PRB + (ins?CAR_INSURANCE:0);
  const refresh = ()=>{
    const t = todayCost();
    overlay.querySelector('#cb-ins-tg').textContent = ins ? '✅ เอาด้วย' : '➕ เอาด้วย';
    overlay.querySelector('#cb-ins').classList.toggle('on', ins);
    overlay.querySelectorAll('.cb-pl').forEach(b=>b.classList.toggle('sel', b.dataset.p===plan));
    overlay.querySelector('#cb-total').innerHTML = plan==='cash'
      ? `จ่ายวันนี้ทั้งหมด <b>🪙${fmtNum(t)}</b>`
      : `จ่ายวันนี้ (ดาวน์+พ.ร.บ.${ins?'+ประกัน':''}) <b>🪙${fmtNum(t)}</b><br><small>แล้วผ่อนเดือนละ <b>🪙${fmtNum(perMonth)}</b> × ${CAR_LOAN_MONTHS} เดือน — มีเงินเมื่อไหร่กด "โปะปิดยอด" ได้ทุกเมื่อ</small>`;
    overlay.querySelector('#cb-buy').classList.toggle('cant-afford', state.coins < t);
  };
  overlay.querySelector('#cb-ins-tg').addEventListener('click', ()=>{ ins = !ins; sfx.select(); refresh(); });
  overlay.querySelectorAll('.cb-pl').forEach(b=>b.addEventListener('click', ()=>{ plan = b.dataset.p; sfx.select(); refresh(); }));
  overlay.querySelector('.cb-x').addEventListener('click', ()=>{ overlay.remove(); });
  overlay.querySelector('#cb-buy').addEventListener('click', ()=>{
    const t = todayCost();
    if(state.coins < t){ sfx.wrong(); toast(`เหรียญยังไม่พอ — วันนี้ต้องจ่าย 🪙${fmtNum(t)} สู้ๆ!`); return; }
    state.coins -= t;
    state.car = {id, insured:ins,
      loan: plan==='cash' ? null : {remain:c.price-down, perMonth, month:ymStr(Date.now()), paid:0, carry:0}};
    if(typeof sellInc==='function') sellInc(id);          // 🛒 นับยอดขายรถ
    sfx.buy();
    toast(plan==='cash'
      ? `🚗 ได้รถ ${c.name} แล้ว! กดปุ่มขับรถออกเมืองได้เลย 🕰️`
      : `🚗 ออกรถ ${c.name} แบบผ่อนแล้ว! จ่ายงวดทุกเดือนที่หมวดยานพาหนะนะ 📅`);
    saveState();
    overlay.remove();
    renderDashboard();
  });
  refresh();
  document.body.appendChild(overlay);
}

function buyCarInsurance(){
  if(!state.car || state.car.insured) return;
  if(state.coins < CAR_INSURANCE){ sfx.wrong(); toast(`ประกันภัยรถ 🪙${fmtNum(CAR_INSURANCE)} — เหรียญยังไม่พอ สู้ๆ!`); return; }
  askConfirm(`<h2>🛡️ ซื้อประกันภัยรถ</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(CAR_INSURANCE)}</b> (จ่ายครั้งเดียว)<br>
    ชนรถผู้เล่นอื่นเมื่อไหร่ ประกันจ่ายค่าเสียหาย 🪙${fmtNum(CAR_HITCAR_FEE)} ให้ทุกครั้ง<br>
    <small>ไม่มีประกัน = จ่ายเองเต็มๆ ตอนออกจากโลกขับรถ</small></p>`,
    'ซื้อเลย! 🛡️', ()=>{
      state.coins -= CAR_INSURANCE;
      state.car.insured = true;
      sfx.buy();
      toast('🛡️ มีประกันแล้ว! ชนรถเพื่อนเมื่อไหร่ประกันจ่ายให้');
      saveState();
      renderDashboard();
    });
}

function payCarLoanMonthly(){
  const amt = carLoanPayable();
  if(!amt) return;
  if(state.coins < amt){ sfx.wrong(); toast(`งวดนี้ต้องจ่าย 🪙${fmtNum(amt)} — เหรียญยังไม่พอ สู้ๆ!`); return; }
  state.coins -= amt;
  const done = carLoanPay(amt);
  sfx.buy();
  toast(done ? '🎉 ผ่อนครบแล้ว! รถเป็นของหนูเต็มตัว' : '📅 จ่ายงวดเรียบร้อย — ขับรถได้ตามปกติ');
  saveState();
  renderDashboard();
}

function payCarLoanFull(){
  const L = state.car && state.car.loan;
  if(!L) return;
  if(state.coins < L.remain){ sfx.wrong(); toast(`โปะปิดยอดต้องใช้ 🪙${fmtNum(L.remain)} — เหรียญยังไม่พอ`); return; }
  askConfirm(`<h2>💰 โปะปิดยอดผ่อนรถ</h2>
    <p style="font-size:15px;margin:6px 0">จ่ายยอดที่เหลือทั้งหมด <b>🪙${fmtNum(L.remain)}</b> ครั้งเดียวจบ<br>
    <small>ปิดยอดแล้วไม่มีงวดรายเดือนอีก — รถเป็นของหนูเต็มตัว!</small></p>`,
    'โปะเลย! 💰', ()=>{
      state.coins -= L.remain;
      carLoanPay(L.remain);
      sfx.buy();
      toast('🎉 ปิดยอดแล้ว! รถเป็นของหนูเต็มตัว');
      saveState();
      renderDashboard();
    });
}

/* 🔐 ด่านกันขับ: มีตั๋วแต่ยังไม่มีรถ / ค้างค่างวด — คืน '' เมื่อขับได้ */
function carDriveBlock(){
  if(!state.car) return 'nocar';
  if(carLoanOverdue() > 0) return 'overdue';
  return '';
}
function gotoVehicleShop(){
  if(typeof openPanel === 'function') openPanel('panel-market');
  setTimeout(()=>{ const s = document.getElementById('mkt-vehicles'); if(s) s.scrollIntoView({behavior:'smooth', block:'start'}); }, 150);
}
function showNeedCarDialog(why){
  askConfirm(why==='overdue'
    ? `<div style="font-size:56px;line-height:1">🔐</div>
       <h2>ค้างค่างวดรถ</h2>
       <p style="font-size:15px;margin:6px 0">ขับรถไม่ได้ชั่วคราว — จ่ายงวดที่ค้าง <b>🪙${fmtNum(carLoanOverdue())}</b> ที่หมวดยานพาหนะ แล้วกลับมาขับได้ทันที</p>`
    : `<div style="font-size:56px;line-height:1">🔐</div>
       <h2>ต้องซื้อรถก่อน จึงจะขับรถได้</h2>
       <p style="font-size:15px;margin:6px 0">ตั๋ว = สิทธิ์เข้าเมืองกำแพงเพชร · <b>รถ = พาหนะ</b> ต้องมีก่อนออกถนน<br>ไปเลือกรถคันแรกที่หมวดยานพาหนะในตลาดกันเลย!</p>`,
    '🏪 ไปหมวดยานพาหนะ', gotoVehicleShop);
}

/* ---- มุมมอง "โรงงานผลิต": งานที่กำลังผลิต + แคตตาล็อกเลือกสินค้า ---- */
function renderFactory(){
  let jobUI;
  if(state.producing){
    const c = collectInfo(state.producing.id), tier = COLLECT_TIERS[c.tier], img = collectImg(c.id);
    const pct = Math.min(100, state.producing.progress/c.words*100);
    jobUI = `<div class="craft-box" style="border-color:${tier.color}">
      <div class="craft-head">
        <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
        <div class="mkt-info"><b>กำลังผลิต: ${c.name}</b> <span class="mkt-tier-stars" style="color:${tier.color}">${tier.stars}</span><br>
          <small>ตอบคำศัพท์ถูกอีก <b>${fmtNum(c.words - state.producing.progress)}</b> คำ ผลิตเสร็จ! (ขายได้ ~🪙${fmtNum(c.price)})</small></div>
      </div>
      <div class="craft-bar"><div class="craft-fill" style="width:${pct}%;background:${tier.color}"></div></div>
      <div class="craft-text">🔤 แต้มผลิต ${fmtNum(state.producing.progress)}/${fmtNum(c.words)} (${Math.floor(pct)}%)</div>
      <div class="craft-btn-row">
        <button class="big-btn craft-go-btn" id="craft-go"><span class="cg-ic">🎮</span> ไปเล่นเกมเก็บแต้มผลิต</button>
        <button class="craft-cancel" id="craft-cancel">ยกเลิก</button>
      </div>
    </div>`;
  }else{
    jobUI = `<div class="home-current none">
      <span class="home-emoji">🏭</span>
      <div><b>โรงงานยังว่างอยู่</b><br>
        <small>เลือกสินค้าจากแคตตาล็อกด้านล่าง แล้วเล่นเกมคำศัพท์เพื่อสะสมแต้มผลิต — ยิ่งเก่งยิ่งผลิตไว ผลิตเสร็จขายได้เงิน!</small>
      </div>
    </div>`;
  }
  const opts = `<option value="all">📦 ทุกหมวดสินค้า (${COLLECTIBLES.length} ชนิด)</option>` +
    COLLECT_CATS.map(g=>`<option value="${g.id}" ${factoryCat===g.id?'selected':''}>${g.emoji} หมวด${g.name}</option>`).join('');
  /* แบ่งหน้า 5 รายการ/หน้า (ผู้ใช้สั่ง 5 ก.ค. 2026) — ปัดซ้ายขวาบนจอสัมผัส หรือกดลูกศร */
  const items = COLLECTIBLES.filter(c=>factoryCat==='all' || c.cat===factoryCat);
  const pages = Math.max(1, Math.ceil(items.length/FACTORY_PAGE_SIZE));
  factoryPage = Math.min(Math.max(factoryPage, 0), pages - 1);
  /* การ์ดสินค้าสไตล์ Trade HQ (โฉมใหม่ 5725691826): หัวการ์ดชื่อสินค้า + ภาพใหญ่
     + badge แต้มคำ + แถบราคาทองเป็นปุ่มผลิต — โครง pagination/ปัดซ้ายขวาเดิมทั้งหมด */
  const rows = items.slice(factoryPage*FACTORY_PAGE_SIZE, (factoryPage+1)*FACTORY_PAGE_SIZE).map(c=>{
    const tier = COLLECT_TIERS[c.tier], img = collectImg(c.id);
    const cur = state.producing && state.producing.id === c.id;
    return `<div class="hq-card ${cur?'hq-cur':''}" style="border-color:${tier.color}">
      <div class="hq-head">${c.name}</div>
      <div class="hq-pic">
        ${img?`<img src="${img}" alt="">`:`<span class="hq-emoji">${c.emoji}</span>`}
        <span class="hq-badge">🔤 ${fmtNum(c.words)}</span>
        <span class="hq-stars" style="color:${tier.color}">${tier.stars}</span>
      </div>
      <button class="hq-price craft-make" data-id="${c.id}">${cur?'⏳ กำลังผลิตอยู่...':`🏭 ผลิต · ขาย ~🪙${fmtNum(c.price)}`}</button>
    </div>`;
  }).join('');
  const dots = Array.from({length: pages}, (_,i)=>`<span class="pg-dot ${i===factoryPage?'on':''}"></span>`).join('');
  const pager = pages > 1 ? `<div class="mkt-pager">
      <button class="pg-btn" id="factory-prev" ${factoryPage===0?'disabled':''}>◀</button>
      <div class="pg-mid"><div class="pg-dots">${dots}</div><small>หน้า ${factoryPage+1}/${pages} · ปัดซ้าย-ขวาเพื่อดูเพิ่ม</small></div>
      <button class="pg-btn" id="factory-next" ${factoryPage===pages-1?'disabled':''}>▶</button>
    </div>` : '';
  return jobUI + `<select class="mkt-filter" id="factory-cat">${opts}</select>` +
    `<div class="mkt-catalog hq-grid${factorySlide?' slide-'+factorySlide:''}" id="factory-list">${rows}</div>` + pager;
}

/* ---- ออเดอร์พิเศษ: ลูกค้าจำลองสั่งผลิตเจาะจง จ่ายแพงกว่าราคาฐาน 30–80% ---- */
function renderOrdersUI(){
  if(!state.orders.length) return '';
  const now = Date.now();
  const rows = state.orders.map((o,i)=>{
    const c = collectInfo(o.id), img = collectImg(o.id);
    const have = state.collection.includes(o.id);
    const bonus = Math.round((o.payout/c.price - 1)*100);
    return `<div class="order-row">
      <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
      <div class="mkt-info"><b>${c.name}</b> <span class="mkt-price-lo">+${bonus}% 💰</span><br>
        <small>👤 ${o.buyer} สั่งผลิต · ⏳ เหลือ <span id="order-left-${i}">${fmtMins(Math.max(0, o.expireAt - now))}</span></small></div>
      ${have
        ? `<button class="order-deliver" data-i="${i}">📦 ส่งมอบ<br>🪙${fmtNum(o.payout)}</button>`
        : `<span class="order-need">🪙${fmtNum(o.payout)}<br><small>ยังไม่มีของ</small></span>`}
    </div>`;
  }).join('');
  return `<div class="order-head">📦 ออเดอร์พิเศษ — ลูกค้าจ่ายแพงกว่าราคาตลาด!</div>${rows}`;
}

function startProduce(id){
  const c = collectInfo(id);
  if(!c) return;
  if(state.producing && state.producing.id === id){
    sfx.select(); toast(`🏭 กำลังผลิต${c.name}อยู่แล้ว — ไปเล่นเกมเก็บแต้มกันเถอะ!`); return;
  }
  const doStart = ()=>{
    state.producing = {id, progress:0};
    sfx.buy();
    toast(`🏭 เริ่มผลิต${c.name}! ตอบคำศัพท์ถูกให้ครบ ${fmtNum(c.words)} คำนะ`);
    saveState();
    renderFactoryCard();
  };
  if(state.producing && state.producing.progress > 0){
    const oc = collectInfo(state.producing.id);
    askConfirm(`<h2>🏭 เปลี่ยนสินค้าที่ผลิต?</h2>
      <p style="font-size:15px;margin:6px 0">ตอนนี้กำลังผลิต${oc.name} (${fmtNum(state.producing.progress)}/${fmtNum(oc.words)} แต้ม)<br>
      ถ้าเปลี่ยนไปผลิต${c.name} <b>แต้มเดิมจะหายนะ</b></p>`, 'เปลี่ยนเลย', doStart);
  }else{
    doStart();
  }
}

function cancelProduce(){
  if(!state.producing) return;
  const c = collectInfo(state.producing.id);
  askConfirm(`<h2>ยกเลิกการผลิต?</h2>
    <p style="font-size:15px;margin:6px 0">แต้มผลิต${c ? c.name : ''}ที่สะสมไว้ (${fmtNum(state.producing.progress)} แต้ม) จะหายไปนะ</p>`,
    'ยกเลิกการผลิต', ()=>{
      state.producing = null;
      sfx.select();
      toast('ยกเลิกการผลิตแล้ว — เลือกสินค้าใหม่ได้เลย');
      saveState();
      renderFactoryCard();
    });
}

function deliverOrder(i){
  const o = state.orders[i];
  if(!o) return;
  const c = collectInfo(o.id);
  const idx = state.collection.indexOf(o.id);
  if(idx < 0){ sfx.wrong(); toast(`ยังไม่มี${c.name}ในคลัง — ผลิตให้เสร็จก่อนนะ`); return; }
  state.collection.splice(idx, 1);
  state.orders.splice(i, 1);
  addCoins(o.payout);
  sfx.levelup();
  floatFx(`+🪙${fmtNum(o.payout)}`);
  toast(`📦 ส่งมอบ${c.name}ให้ ${o.buyer} เรียบร้อย! รับ 🪙${fmtNum(o.payout)} 🎉`);
  saveState();
  renderDashboard();
}

/* นาฬิกานับถอยหลังออเดอร์พิเศษ (เดินพร้อมนาฬิกา — หมดเวลาแล้ว careTick รอบถัดไปลบเอง) */
function renderOrderClock(){
  if(!state.orders || !state.orders.length) return;
  const now = Date.now();
  state.orders.forEach((o,i)=>{
    const el = document.getElementById('order-left-'+i);
    if(el) el.textContent = fmtMins(Math.max(0, o.expireAt - now));
  });
}

/* ---- มุมมอง "คลังของฉัน": ของสะสม (ตั้งขายได้) + รายการที่กำลังลงขาย ---- */
function renderCollectMine(){
  const counts = {};
  for(const id of state.collection) counts[id] = (counts[id]||0) + 1;
  const ids = COLLECTIBLES.map(c=>c.id).filter(id=>counts[id]);
  let ownedUI;
  if(ids.length){
    /* การ์ดสินค้าสไตล์ Trade HQ เหมือนแคตตาล็อกโรงงาน (โฉมใหม่ 5725691826) */
    ownedUI = `<div class="hq-grid">` + ids.map(id=>{
      const c = collectInfo(id), tier = COLLECT_TIERS[c.tier], img = collectImg(id);
      return `<div class="hq-card" style="border-color:${tier.color}">
        <div class="hq-head">${c.name}</div>
        <div class="hq-pic">
          ${img?`<img src="${img}" alt="">`:`<span class="hq-emoji">${c.emoji}</span>`}
          <span class="hq-badge">×${counts[id]}</span>
          <span class="hq-stars" style="color:${tier.color}">${tier.stars}</span>
        </div>
        <button class="hq-price cc-list-btn" data-id="${id}">🏷️ ตั้งราคาขาย</button>
      </div>`;
    }).join('') + `</div>`;
  }else{
    ownedUI = `<div class="mkt-empty">คลังยังว่างอยู่ — ไปผลิตสินค้าชิ้นแรกที่เมนู <b>🏭 โรงงาน</b> กันเถอะ!<br>ผลิตเสร็จเอามาตั้งขาย หรือส่งมอบออเดอร์พิเศษได้เงินเพิ่ม 💰</div>`;
  }
  let listUI = '';
  if(state.listings.length){
    listUI = `<div class="mkt-listhead">🏷️ กำลังลงขายอยู่ (${state.listings.length} ชิ้น)</div>` +
      state.listings.map((l,i)=>{
        const c = collectInfo(l.id), img = collectImg(l.id);
        const st = l.netKey
          ? {t:'🌏 แขวนอยู่ในตลาดเพื่อนออนไลน์ — เพื่อนซื้อเมื่อไหร่เงินเข้าทันที', c:'#1f6fbf'}
          : listingStatus(l.price / c.price);
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
    overlay.remove();
    // 🏪 item 2: พยายามแขวนขึ้นตลาดออนไลน์จริงก่อน — ไม่ได้ (ออฟไลน์/rules ยังไม่เปิด) fallback ตลาดจำลองเดิม
    const fin = (netKey)=>{
      const l = {id, price, listedAt: Date.now()};
      if(netKey) l.netKey = netKey;
      state.listings.push(l);
      sfx.buy();
      toast(netKey ? `🌏 ลงขาย${c.name} 🪙${fmtNum(price)} ในตลาดเพื่อนออนไลน์แล้ว!`
                   : `🏷️ ลงขาย${c.name} 🪙${fmtNum(price)} แล้ว! รอลูกค้ามาซื้อได้เลย`);
      saveState();
      renderDashboard();
    };
    if(typeof marketList === 'function') marketList(id, price).then(fin);
    else fin(null);
  });
  document.body.appendChild(overlay);
}

function cancelListing(i){
  const l = state.listings[i];
  if(!l) return;
  const c = collectInfo(l.id);
  const finish = ()=>{
    state.listings.splice(i, 1);
    state.collection.push(l.id);
    sfx.select();
    toast(`เก็บ${c ? c.name : 'สินค้า'}กลับเข้าคลังแล้ว`);
    saveState();
    renderDashboard();
  };
  if(!l.netKey || typeof marketUnlist !== 'function'){ finish(); return; }
  // 🏪 ประกาศจริง: ต้องถอนออกจาก DB ให้สำเร็จก่อนคืนของ (กันคนกำลังกดซื้อพอดี)
  marketUnlist(l.netKey).then(r=>{
    if(r === 'removed') finish();
    else if(r === 'gone') toast('🌏 มีเพื่อนซื้อชิ้นนี้ไปแล้ว — เดี๋ยวเงินเข้ากระเป๋าเองนะ');
    else { sfx.wrong(); toast('📡 ถอนไม่สำเร็จ ลองใหม่อีกครั้งนะ'); }
  });
}

/* 🏪 item 2: ซื้อของจากตลาดเพื่อนออนไลน์ (transaction คนแรกได้ · จ่ายเหรียญ + ของเข้าคลัง) */
let mktBuying = false;                       // กันกดรัว/ซื้อซ้อนระหว่างรอ DB
function buyMarketItem(key){
  if(mktBuying) return;
  const item = (Online.market || []).find(m=>m.key === key);
  if(!item || typeof marketBuy !== 'function') return;
  const c = collectInfo(item.id);
  if(!c) return;
  if(item.sid === (typeof onlineKey === 'function' ? onlineKey() : '')) return;   // ของตัวเอง
  if(state.coins < item.p){ sfx.wrong(); toast(`เหรียญไม่พอ (ต้องมี 🪙${fmtNum(item.p)}) สู้ๆ!`); return; }
  mktBuying = true;
  marketBuy(item).then(ok=>{
    mktBuying = false;
    if(!ok){ sfx.wrong(); toast('😅 ช้าไปนิดเดียว — มีคนซื้อตัดหน้าไปแล้ว'); renderMarketCard(); return; }
    state.coins -= item.p;
    state.collection.push(item.id);
    // 💖 ได้ของที่เล็งไว้แล้ว → ถอนออกจากลิสต์อัตโนมัติ (รอบ 126)
    const wi = (state.wishlist || []).indexOf(item.id);
    if(wi >= 0) state.wishlist.splice(wi, 1);
    saveState();
    if(typeof feedEvent === 'function') feedEvent('goods', `ซื้อ ${c.emoji} ${c.name} จากตลาดเพื่อน 🏪`);
    showCollectReveal(item.id, item.p);
    toast(`🌏 ซื้อ${c.name}จาก ${item.sn} สำเร็จ!`);
    renderDashboard();
  });
}

/* ฉากเปิดภาพใหญ่ตอนได้สินค้าใหม่ (สไตล์เดียวกับฉากอัปแรงค์ ใช้สีตามระดับ)
   produced=true → ฉาก "ผลิตสำเร็จ" (เรียกจาก game.js ตอนแต้มผลิตครบ) */
function showCollectReveal(id, price, produced){
  const c = collectInfo(id), tier = COLLECT_TIERS[c.tier];
  sfx.rankup();
  const img = collectImg(id);
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  const sub = produced
    ? `ผลิตด้วยแต้มคำศัพท์ ${fmtNum(c.words)} คำ เก่งมาก! เก็บเข้าคลังแล้ว 🏆<br>ตั้งขายในตลาด หรือส่งมอบออเดอร์พิเศษได้เลย!`
    : `${price != null ? `ซื้อมาในราคา 🪙${fmtNum(price)} · ` : ''}เก็บเข้าคลังสะสมแล้ว 🏆<br>ตั้งราคาขายต่อในตลาดได้ทุกเมื่อ!`;
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:${tier.color}"></div>
    <div class="rankup-content">
      <div class="rankup-title">${produced ? '🏭 ผลิตสำเร็จ!' : '🎁 ได้ของสะสมใหม่!'}</div>
      <div class="collect-reveal-frame" style="--rank-color:${tier.color}">
        ${img ? `<img class="collect-reveal-img" src="${img}" alt="">` : `<span class="cr-emoji">${c.emoji}</span>`}
      </div>
      <div class="rankup-name" style="color:${tier.color}">${c.name}</div>
      <div class="collect-reveal-stars" style="color:${tier.color}">${tier.stars} ${tier.label}</div>
      <p class="rankup-sub">${sub}</p>
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
      if(typeof sellInc==='function') sellInc('ac');
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
            ${soldBadge('home_'+h.id)}
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
          if(typeof sellInc==='function') sellInc('home_'+h.id);   // 🛒 นับยอดขายที่พัก
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
      ${!owned && !afford ? `<div class="egg-need">ขาดอีก 🪙${fmtNum(p.price - state.coins)} ≈ เล่นอีก ${fmtNum(Math.ceil((p.price - state.coins)/10))} คำ</div>` : ''}
      ${soldBadge('pet_'+key)}
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
          // ข้อ 7: บังคับตั้งชื่อก่อนรับน้อง (กดยกเลิก = ไม่ซื้อ เหรียญไม่หาย)
          askNameDialog({
            emoji:'🏷️', title:`ตั้งชื่อให้${conf.name}ก่อนรับกลับบ้าน`,
            desc:'ชื่อไทย/อังกฤษ/ตัวเลข 1–15 ตัว (เปลี่ยนทีหลังได้ที่ปุ่ม ✏️)',
            placeholder:'เช่น บ็อบบี้, Lucky', min:1, max:15,
            okText:'รับเลย! 🥰', cancelText:'ยังไม่รับ',
            onOk:(name)=>{
              state.coins -= conf.price;
              state.pets.push(newPet(key, name));
              state.active = state.pets.length - 1;
              if(typeof sellInc==='function') sellInc('pet_'+key);   // 🛒 นับยอดขายสัตว์เลี้ยง
              saveState();
              if(typeof feedEvent === 'function') feedEvent('other', `รับน้องใหม่ ${conf.emoji||'🐾'} "${name}" มาเลี้ยงแล้ว 🥰`);
              if(typeof testerBoost === 'function') testerBoost();  // 🧪 ผู้ทดสอบ: น้องโตเต็มวัยทันที ไม่ต้อง login ใหม่
              sfx.levelup();
              toast(conf.startKey === 'egg'
                ? `ได้ ${name} มาแล้ว! เล่นเกมเพื่อฟักไข่กันเถอะ 🎉`
                : `ได้ ${name} มาแล้ว! เล่นเกมให้น้องแข็งแรงจนลืมตากันเถอะ 🎉`);
              renderDashboard();
              showScreen('screen-dashboard');
              probeImages(petImageKeys(key)).then(renderDashboard);
            },
          });
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
  const pname = escapeHTML(p.name || conf.name);
  let title = `เลเวลอัพ! Lv.${p.level} 🎊`;
  let emoji = '⭐', msg = `${pname}เก่งขึ้นแล้ว!`;
  if(p.level === 2){
    if(conf.startKey === 'egg'){
      title = '🥚💥 ไข่ฟักแล้ว!';
      msg = `${pname}ออกมาจากไข่แล้ว น่ารักมาก! ปลดล็อกแอนิเมชันดุ๊กดิ๊ก`;
    }else{
      title = '👀 น้องลืมตาแล้ว!';
      msg = `${pname}ลืมตาและออกจากตะกร้าแล้ว! ปลดล็อกแอนิเมชันดุ๊กดิ๊ก<br>
        <small>🔍 รู้ไหม? ลูกหมาและลูกแมวแรกเกิดจะหลับตา แล้วค่อยลืมตาตอนอายุราว 1–2 สัปดาห์</small>`;
    }
    emoji = conf.baby;
  }else if(p.level === 3){
    title = '🌟 โตเต็มวัยแล้ว!';
    emoji = conf.adult; msg = `${pname}โตเต็มวัย มีออร่าประกาย ✨ ปลดล็อก: ${conf.ability}`;
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
        return `<div class="stats-row"><span>${face} ${escapeHTML(p.name)} <small>(${PETS[p.type].name})</small></span><span>Lv.${p.level}${p.sick?' 🤒':''}</span></div>`;
      }).join('')
    : '<div class="cat-info">ยังไม่มีสัตว์เลี้ยง</div>';
  document.getElementById('stats-body').innerHTML = `
    <div class="stats-card">
      <h3 class="stats-title">${playerAvatarHTML('👧')} ${escapeHTML(state.profileName || s.first || 'ผู้เล่น')} · ชั้น ${escapeHTML(s.grade||'-')} <small class="stats-nick">${idTag((typeof onlineKey==='function')?onlineKey():'')}</small></h3>
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
      <div class="stats-row"><span>⚡ สายฟ้าแลบ (เคลียร์ไว ≤5 วิ ไม่พลาดเลย)</span>
        <span><b>${fmtNum(state.thunderCount||0)}</b> ครั้ง${(state.thunderBadge||0) > 0 ? ` · ${THUNDER_TIER_UI[state.thunderBadge]}` : ''}</span></div>
      <div class="stats-row"><span>🎯 บินเฉียดสุดๆ (โลกเฮลิฯ/โดรน แบบไม่ชน)</span>
        <span><b>${fmtNum(state.daredevilCount||0)}</b> ครั้ง${(state.daredevilBadge||0) > 0 ? ` · ${DAREDEVIL_TIER_UI[state.daredevilBadge]}` : ''}</span></div>
      <div class="stats-row"><span>🏅 เล่นต่ออีกรอบสะสม (เกมจับคู่)</span>
        <span><b>${fmtNum(state.diligentCount||0)}</b> รอบ${(state.diligentBadge||0) > 0 ? ` · ${DILIGENT_TIER_UI[state.diligentBadge]}` : ''}</span></div>
      <div class="stats-row"><span>🏆 คอมโบเฉียดสูงสุด (เฉียดต่อเนื่องไม่ชน)</span>
        <span><b>${fmtNum(state.bestCombo||0)}</b> ครั้งติด</span></div>
      <div class="stats-row"><span>🏭 สินค้าที่ผลิตสำเร็จ</span><span><b>${fmtNum(state.producedCount)}</b> ชิ้น</span></div>
      <div class="stats-row"><span>🌐 โบนัสออนไลน์สะสม (เปิดเกมออนไลน์ = +${ONLINE_RATE}/วิ)</span><span><b>${fmtNum(state.onlineEarned||0)}</b> เหรียญ</span></div>
    </div>
    <div class="stats-card"><h3 class="stats-title">🐾 สัตว์เลี้ยงของหนู</h3>${petRows}</div>
    <div class="stats-card"><h3 class="stats-title">📚 คะแนนสูงสุดรายหมวด (${gradeBand(s.grade).label})</h3>${catRows}</div>
    <div class="stats-card"><h3 class="stats-title">🕐 ประวัติการสอบล่าสุด</h3>
      ${logs || '<div class="cat-info">ยังไม่มีประวัติการสอบ — ไปลองสอบหมวดแรกกันเถอะ!</div>'}
    </div>`;
  // item 4: ปุ่มการ์ดสรุปส่งครู — แทรกบนสุดของหน้าสถิติ
  const tcBtn = document.createElement('button');
  tcBtn.className = 'big-btn tc-open';
  tcBtn.id = 'btn-teacher-card';
  tcBtn.innerHTML = '📇 การ์ดสรุปส่งครู <small>(แคปหน้าจอส่งไลน์ครูได้เลย)</small>';
  tcBtn.addEventListener('click', showTeacherCard);
  document.getElementById('stats-body').prepend(tcBtn);
}

/* ============================================================
   item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
   เด็กแคปหน้าจอส่งไลน์ครู · ปุ่มปิดอยู่นอกตัวการ์ด แคปแล้วภาพสะอาด
   ============================================================ */
function showTeacherCard(){
  dailyTick();
  const s = state.student || {first:'-', last:'', grade:'-'};
  const info = rankInfo(netWorth());
  const last = state.quizLog.length ? state.quizLog[state.quizLog.length-1] : null;
  const lastCat = last ? findCat(last.cat) : null;
  const now = new Date();
  const dateTxt = now.toLocaleDateString('th-TH', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const timeTxt = now.toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'});
  const badges = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="tc-wrap">
    <div class="tc-card">
      <div class="tc-head">🌍 Vocab World<div class="tc-sub">การ์ดรายงานผลการเรียนรู้</div></div>
      <div class="tc-name">${playerAvatarHTML('🧒')} <b>${escapeHTML(state.profileName || s.first || 'ผู้เล่น')}</b> · ชั้น ${escapeHTML(s.grade||'-')} · ${idTag((typeof onlineKey==='function')?onlineKey():'')}${badges ? ` <span class="tc-badges">${badges}</span>` : ''}</div>
      <div class="tc-when">🗓️ ${dateTxt} · ⏰ ${timeTxt} น.</div>
      <div class="tc-row"><span>🪙 เหรียญที่หาได้วันนี้</span><b>+${fmtNum(state.daily.coins)}</b></div>
      <div class="tc-row"><span>🎖️ แรงค์ปัจจุบัน</span><b style="color:${info.rank.color}">${info.rank.emoji} ${info.label}</b></div>
      <div class="tc-row"><span>📝 คะแนนสอบล่าสุด</span><b>${last
        ? `${lastCat ? lastCat.emoji + ' ' + lastCat.name : last.cat} <span class="${last.passed ? 'tc-pass' : 'tc-try'}">${last.score}/${last.total} ${last.passed ? '✅ ผ่าน' : '💪 กำลังพยายาม'}</span>`
        : 'ยังไม่เคยสอบ'}</b></div>
      <div class="tc-row"><span>🃏 จับคู่คำศัพท์ถูกสะสม</span><b>${fmtNum(state.totalMatches)} คำ</b></div>
      <div class="tc-sign">✔️ ออกให้โดยเกมอัตโนมัติ · ${escapeHTML(location.hostname || 'Vocab World')}</div>
    </div>
    <div class="tc-hint">📸 แคปหน้าจอนี้ แล้วส่งให้คุณครูทางไลน์ได้เลย</div>
    <button class="tc-close">ปิด</button>
  </div>`;
  overlay.querySelector('.tc-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  sfx.select();
}
