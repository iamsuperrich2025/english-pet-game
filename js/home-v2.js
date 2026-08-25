"use strict";
/* ============================================================
   Vocab World Home V2 — Admin Preview (Phase 1)
   ------------------------------------------------------------
   Additive UI shell only. It does NOT own economy, auth, quests,
   Firebase, purchases, or game routing. Existing Lobby DOM stays
   in place and existing buttons/functions remain authoritative.
   ============================================================ */
(function(){
  const ROOT_ID = 'vw-home-v2-root';
  const CLASS_ON = 'vw2-active';
  const SESSION_KEY = 'vwHomeV2PreviewClassic';
  let root = null;
  let classicToggle = null;
  let syncTimer = 0;
  let clockTimer = 0;

  function adminAllowed(){
    try{ return typeof isAdmin === 'function' && isAdmin() === true; }
    catch(_){ return false; }
  }

  function dashboard(){ return document.getElementById('screen-dashboard'); }
  function dashboardActive(){
    const el = dashboard();
    return !!(el && el.classList.contains('active'));
  }
  function previewWanted(){ return sessionStorage.getItem(SESSION_KEY) !== '1'; }
  function setPreviewWanted(on){
    if(on) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, '1');
    syncVisibility();
  }

  function cleanText(text, max){
    const out = String(text || '').replace(/\s+/g,' ').trim();
    return out.length > max ? out.slice(0, max - 1).trimEnd() + '…' : out;
  }
  function textOf(sel, fallback='—'){
    const el = document.querySelector(sel);
    const t = el ? cleanText(el.textContent, 180) : '';
    return t || fallback;
  }
  function htmlEscape(v){
    return String(v == null ? '' : v).replace(/[&<>"]/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
    })[c]);
  }
  function fmt(v){
    try{ return typeof fmtNum === 'function' ? fmtNum(v) : Number(v || 0).toLocaleString('th-TH'); }
    catch(_){ return String(v || 0); }
  }

  function clickExisting(selector, opts){
    opts = opts || {};
    const el = document.querySelector(selector);
    if(!el || el.disabled) return false;
    if(opts.classicFirst) setPreviewWanted(false);
    el.click();
    return true;
  }

  function openPanelViaExisting(panelId){
    return clickExisting(`.lobby-rail [data-panel="${panelId}"]`, {classicFirst:true});
  }

  function openPetShop(){
    const b = document.getElementById('tab-addpet');
    if(b){ b.click(); return; }
    if(typeof renderPetShop === 'function' && typeof showScreen === 'function'){
      renderPetShop(); showScreen('screen-select');
    }
  }

  function action(name){
    switch(name){
      case 'classic': setPreviewWanted(false); break;
      case 'v2': setPreviewWanted(true); break;
      case 'city': clickExisting('#btn-rail-city'); break;
      case 'shop': openPetShop(); break;
      case 'home': openPanelViaExisting('panel-home'); break;
      case 'invest': openPanelViaExisting('panel-farm'); break;
      case 'factory': openPanelViaExisting('panel-factory'); break;
      case 'market': openPanelViaExisting('panel-market'); break;
      case 'friends': openPanelViaExisting('panel-friends'); break;
      case 'gifts': openPanelViaExisting('panel-gifts'); break;
      case 'rank': clickExisting('#btn-rail-rank', {classicFirst:true}); break;
      case 'chat': clickExisting('#btn-chat'); break;
      case 'music': clickExisting('#btn-music'); break;
      case 'night': clickExisting('#btn-night'); break;
      case 'settings': clickExisting('#btn-settings'); break;
      case 'logout': clickExisting('#btn-logout'); break;
      case 'wordsearch': clickExisting('#btn-rail-wordsearch'); break;
      case 'typing': clickExisting('#btn-rail-typing'); break;
      case 'bubble': clickExisting('#btn-rail-bubble'); break;
      case 'shoot': clickExisting('#btn-rail-shootword'); break;
      case 'cannon': clickExisting('#btn-rail-lettercannon'); break;
      case 'play': clickExisting('#btn-play'); break;
      case 'cats': clickExisting('#btn-cats'); break;
      case 'picmatch': clickExisting('#btn-picmatch'); break;
      case 'picdict': clickExisting('#btn-picdict'); break;
      case 'picquiz': clickExisting('#btn-picquiz'); break;
      case 'vocabbook': clickExisting('#btn-vocab-book'); break;
      case 'bandexam': clickExisting('#btn-band-exam'); break;
      case 'ielts': clickExisting('.lobby-bottom [data-xstd="ielts"]'); break;
      case 'toeic': clickExisting('.lobby-bottom [data-xstd="toeic"]'); break;
      case 'toefl': clickExisting('.lobby-bottom [data-xstd="toefl"]'); break;
      case 'onetp6': clickExisting('.lobby-bottom [data-xstd="onetp6"]'); break;
      case 'onetm3': clickExisting('.lobby-bottom [data-xstd="onetm3"]'); break;
      case 'onetm6': clickExisting('.lobby-bottom [data-xstd="onetm6"]'); break;
    }
  }

  function build(){
    const dash = dashboard();
    if(!dash || document.getElementById(ROOT_ID)) return;
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('aria-label','Vocab World Home V2 Admin Preview');
    root.innerHTML = `
      <div class="vw2-sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="vw2-shell">
        <header class="vw2-top">
          <section class="vw2-profile vw2-glass">
            <div class="vw2-avatar" id="vw2-avatar"><span>🧑‍🚀</span></div>
            <div class="vw2-profile-main">
              <div class="vw2-name-row"><strong id="vw2-name">ผู้เล่น</strong><span class="vw2-pencil">✏️</span></div>
              <div class="vw2-id" id="vw2-id">ID —</div>
              <div class="vw2-minirow"><span id="vw2-clock">—</span></div>
              <div class="vw2-rank" id="vw2-rank">กำลังโหลดแรงค์…</div>
            </div>
          </section>

          <section class="vw2-wallet">
            <button class="vw2-wallet-pill coin" data-vw2-action="rank"><span>🪙</span><b id="vw2-coins">0</b><em>+</em></button>
            <div class="vw2-wallet-pill today"><small>วันนี้</small><b>+<span id="vw2-today">0</span></b></div>
            <div class="vw2-wallet-pill worth"><small>มูลค่ารวม</small><b id="vw2-worth">0</b></div>
          </section>

          <section class="vw2-top-actions">
            <button data-vw2-action="chat" title="ข้อความ">💬</button>
            <button data-vw2-action="music" title="เพลง">🎵</button>
            <button data-vw2-action="night" title="โหมดกลางคืน">🌙</button>
            <button data-vw2-action="settings" title="ตั้งค่า">⚙️</button>
            <button data-vw2-action="classic" class="vw2-classic" title="กลับหน้าล็อบบี้เดิมชั่วคราว">↩ Classic</button>
          </section>
        </header>

        <div class="vw2-main-grid">
          <nav class="vw2-left vw2-glass" aria-label="เมนูหลัก">
            <button data-vw2-action="city"><span>🏰</span><b>เมือง 3D</b></button>
            <button data-vw2-action="shop"><span>🧪</span><b>ร้านค้า</b></button>
            <button data-vw2-action="home"><span>🏠</span><b>บ้าน</b></button>
            <button data-vw2-action="invest"><span>📈</span><b>ลงทุน</b></button>
            <button data-vw2-action="gifts"><span>🎁</span><b>ของขวัญ</b></button>
          </nav>

          <section class="vw2-feed vw2-glass">
            <div class="vw2-section-head"><span>🌏</span><strong>Global Feed</strong><button data-vw2-action="classic" title="เปิดฟีดเดิม">ดูทั้งหมด</button></div>
            <div class="vw2-feed-card">
              <div class="vw2-feed-avatar">✨</div>
              <div><b>กิจกรรมล่าสุด</b><p id="vw2-feed-text">กำลังโหลดกิจกรรมของเพื่อน…</p></div>
            </div>
            <div class="vw2-feed-stats"><span>👍 <b id="vw2-feed-likes">—</b></span><span>💬 ชวนเพื่อนมาเรียนด้วยกัน</span></div>
            <div class="vw2-feed-coin">🪙<span>เรียน เล่น และเติบโตไปพร้อมกัน</span></div>
          </section>

          <main class="vw2-feature vw2-glass">
            <div class="vw2-word-ribbon" id="vw2-newword">✨ คำศัพท์ใหม่รอหนูอยู่</div>
            <div class="vw2-feature-title"><span>☁</span><strong>Vocab World</strong><span>☁</span></div>
            <div class="vw2-feature-stage">
              <div class="vw2-stage-cloud c1"></div><div class="vw2-stage-cloud c2"></div>
              <div class="vw2-castle" aria-hidden="true"><span>🏰</span></div>
              <div class="vw2-pet-halo"></div>
              <div class="vw2-pet" id="vw2-pet"><span>🐲</span></div>
              <div class="vw2-player-mini" id="vw2-player-mini">🧙‍♂️</div>
              <div class="vw2-stage-copy"><b id="vw2-pet-name">ออกผจญภัยกับน้อง</b><span>ฝึกคำศัพท์ · สะสมเหรียญ · พบเพื่อน</span></div>
            </div>
            <div class="vw2-feature-actions">
              <button class="vw2-enter" data-vw2-action="city">🏰 เข้าโลก 3D</button>
              <button class="vw2-play" data-vw2-action="play">🎮 เกมจับคู่คำศัพท์</button>
            </div>
          </main>

          <aside class="vw2-right">
            <section class="vw2-mission vw2-glass">
              <div class="vw2-section-head"><span>🎯</span><strong>ภารกิจวันนี้</strong><b id="vw2-quest-count">0/0</b></div>
              <div class="vw2-progress"><i id="vw2-quest-bar"></i></div>
              <div id="vw2-quests" class="vw2-quests"><div class="vw2-empty">กำลังโหลดภารกิจ…</div></div>
            </section>
            <section class="vw2-online vw2-glass">
              <div class="vw2-section-head"><span>🧑‍🤝‍🧑</span><strong>เพื่อนออนไลน์</strong><b id="vw2-online-count">—</b></div>
              <div class="vw2-online-card"><span class="vw2-online-dot"></span><div><b id="vw2-online-name">กำลังเชื่อมต่อ…</b><small id="vw2-online-text">เล่นและเรียนไปพร้อมกัน</small></div></div>
              <button class="vw2-friends-btn" data-vw2-action="friends">👥 ดูเพื่อนทั้งหมด</button>
            </section>
          </aside>
        </div>

        <footer class="vw2-bottom" aria-label="ทางลัดการเรียนและเกม">
          <button class="ielts" data-vw2-action="ielts">📘 <b>IELTS</b></button>
          <button class="toeic" data-vw2-action="toeic">📗 <b>TOEIC</b></button>
          <button class="toefl" data-vw2-action="toefl">📙 <b>TOEFL</b></button>
          <button class="onet" data-vw2-action="onetp6">⭐ <b>O-NET ป.6</b></button>
          <button class="onet" data-vw2-action="onetm3">🌿 <b>O-NET ม.3</b></button>
          <button class="onet" data-vw2-action="onetm6">👑 <b>O-NET ม.6</b></button>
          <button class="vocab" data-vw2-action="cats">💜 <b>หมวดคำศัพท์ &amp; แบบทดสอบ</b></button>
          <button class="games" data-vw2-action="picmatch">🎮 <b>เล่นเกมจับคู่คำ</b></button>
        </footer>
        <div class="vw2-preview-mark">ADMIN PREVIEW · HOME V2 PHASE 1</div>
      </div>`;
    dash.appendChild(root);

    root.addEventListener('click', e=>{
      const b = e.target.closest('[data-vw2-action]');
      if(!b) return;
      e.preventDefault();
      if(typeof sfx !== 'undefined' && sfx && typeof sfx.select === 'function') sfx.select();
      action(b.dataset.vw2Action);
    });
  }

  function ensureClassicToggle(){
    if(classicToggle) return;
    classicToggle = document.createElement('button');
    classicToggle.id = 'vw2-preview-switch';
    classicToggle.type = 'button';
    classicToggle.textContent = '✨ Home V2';
    classicToggle.title = 'กลับไปดู Home V2 (Admin Preview)';
    classicToggle.addEventListener('click', ()=>setPreviewWanted(true));
    document.body.appendChild(classicToggle);
  }

  function copyImage(srcSel, targetId, fallbackEmoji){
    const src = document.querySelector(srcSel);
    const box = document.getElementById(targetId);
    if(!box) return;
    const url = src && src.getAttribute('src');
    if(url){
      if(box.dataset.src === url) return;
      box.dataset.src = url;
      box.innerHTML = `<img src="${htmlEscape(url)}" alt="">`;
    }else if(!box.dataset.src){ box.innerHTML = `<span>${fallbackEmoji}</span>`; }
  }

  function questHTML(){
    if(typeof state === 'undefined' || !state) return {html:'<div class="vw2-empty">ยังไม่มีข้อมูลภารกิจ</div>',done:0,total:0};
    try{
      const qs = typeof questsToday === 'function' ? questsToday() : [];
      const qstate = state.quests || {prog:{},done:[]};
      const doneIds = Array.isArray(qstate.done) ? qstate.done : [];
      const cards = qs.slice(0,3).map(q=>{
        const done = doneIds.includes(q.id);
        const current = Math.min(Number(q.target)||0, Number((qstate.prog||{})[q.id])||0);
        const target = Number(q.target)||1;
        const pct = done ? 100 : Math.max(0,Math.min(100,Math.round(current/target*100)));
        return `<button class="vw2-quest-row${done?' done':''}" data-vw2-action="classic" title="เปิดหน้าล็อบบี้เดิมเพื่อทำภารกิจ">
          <span class="vw2-qemoji">${htmlEscape(q.emoji || '⭐')}</span>
          <span class="vw2-qbody"><b>${htmlEscape(q.name || 'ภารกิจ')}</b><i><u style="width:${pct}%"></u></i></span>
          <span class="vw2-qscore">${done?'✅':`${current}/${target}`}</span>
        </button>`;
      }).join('');
      return {html:cards || '<div class="vw2-empty">วันนี้ยังไม่มีภารกิจ</div>',done:doneIds.length,total:qs.length};
    }catch(_){
      return {html:`<div class="vw2-empty">${htmlEscape(textOf('#quest-card','กำลังโหลดภารกิจ…'))}</div>`,done:0,total:0};
    }
  }

  function sync(){
    if(!root || !adminAllowed()) return;
    const name = (typeof state !== 'undefined' && state && state.profileName) ? state.profileName : textOf('#student-chip','ผู้เล่น');
    const uid = (typeof onlineKey === 'function') ? onlineKey() : '';
    const id = (typeof idTag === 'function') ? idTag(uid) : '';
    const coins = (typeof state !== 'undefined' && state) ? state.coins : textOf('#coin-count','0');
    const today = (typeof state !== 'undefined' && state && state.daily) ? state.daily.coins : textOf('#coin-today','0');
    let worth = coins;
    try{ if(typeof netWorth === 'function') worth = netWorth(); }catch(_){ }

    const setText=(idName,value)=>{ const el=document.getElementById(idName); if(el){ const next=String(value == null ? '' : value); if(el.textContent !== next) el.textContent=next; } };
    setText('vw2-name', cleanText(name,28));
    setText('vw2-id', id || 'ID —');
    setText('vw2-coins', fmt(coins));
    setText('vw2-today', fmt(today));
    setText('vw2-worth', fmt(worth));
    setText('vw2-clock', textOf('#clock-chip','วันนี้'));
    setText('vw2-rank', textOf('#rank-tab','แรงค์กำลังอัปเดต'));
    setText('vw2-newword', textOf('#newword-banner','✨ คำศัพท์ใหม่รอหนูอยู่'));

    copyImage('#pass-photo img','vw2-avatar','🧑‍🚀');
    copyImage('#pass-photo img','vw2-player-mini','🧙‍♂️');
    copyImage('#pet-card .hero-scene .pet-img','vw2-pet','🐲');

    try{
      if(typeof activePet === 'function'){
        const p=activePet();
        setText('vw2-pet-name', p && p.name ? p.name : 'ออกผจญภัยกับน้อง');
      }
    }catch(_){ }

    const feed = textOf('#feed-list','ยังไม่มีกิจกรรมใหม่ — เริ่มเล่นเกมเพื่อสร้างเรื่องราวของวันนี้!');
    setText('vw2-feed-text', cleanText(feed,150));
    const likes = (typeof state !== 'undefined' && state && state.feedLikes != null) ? fmt(state.feedLikes) : 'เพื่อน';
    setText('vw2-feed-likes', likes);

    const q = questHTML();
    const qs = document.getElementById('vw2-quests');
    if(qs && qs.dataset.vw2Html !== q.html){ qs.innerHTML = q.html; qs.dataset.vw2Html = q.html; }
    setText('vw2-quest-count', `${Math.min(q.done,q.total)}/${q.total}`);
    const qb = document.getElementById('vw2-quest-bar');
    if(qb) qb.style.width = (q.total ? Math.min(100,(q.done/q.total)*100) : 0) + '%';

    let onlineCount = '';
    let onlineName = '';
    try{
      if(typeof Online !== 'undefined' && Online){
        const list = Array.isArray(Online.friends) ? Online.friends : [];
        onlineCount = String(list.length);
        const f = list[0];
        if(f) onlineName = f.n || f.name || '';
      }
    }catch(_){ }
    if(!onlineCount){
      const sub = textOf('#online-sub','');
      const m = sub.match(/\d+/); onlineCount = m ? m[0] : '—';
    }
    if(!onlineName){
      const raw = textOf('#online-card','กำลังเชื่อมต่อเพื่อนออนไลน์');
      onlineName = cleanText(raw,48);
    }
    setText('vw2-online-count', onlineCount);
    setText('vw2-online-name', onlineName || 'ยังไม่มีเพื่อนออนไลน์');
    setText('vw2-online-text', onlineName ? 'กำลังเรียนอยู่ตอนนี้' : 'ชวนเพื่อนมาเรียนด้วยกัน');
  }

  function scheduleSync(){
    clearTimeout(syncTimer);
    syncTimer = setTimeout(()=>{
      if(adminAllowed() && dashboardActive() && previewWanted()) sync();
    }, 120);
  }

  function syncVisibility(){
    const dash = dashboard();
    if(!dash) return;
    const allowed = adminAllowed();
    const active = dashboardActive();
    if(!allowed){
      dash.classList.remove(CLASS_ON);
      if(root) root.hidden = true;
      if(classicToggle) classicToggle.hidden = true;
      return;
    }

    ensureClassicToggle();
    const showV2 = active && previewWanted();

    // Runtime-safety: build Home V2 lazily only after the real dashboard is
    // active and admin authorization is already known. This keeps all Home
    // V2 work off the startup/loading path.
    if(showV2 && !root) build();

    dash.classList.toggle(CLASS_ON, showV2);
    if(root) root.hidden = !showV2;
    if(classicToggle) classicToggle.hidden = !active || showV2;
  }

  function tick(){
    syncVisibility();
    if(root && adminAllowed() && dashboardActive() && previewWanted()) sync();
  }

  function init(){
    // No MutationObserver on the classic Lobby. The existing Lobby has
    // animated/ticker DOM that changes frequently; observing its subtree can
    // create a feedback-heavy main-thread workload. A slow, bounded poll is
    // sufficient for this admin-only preview.
    clearInterval(clockTimer);
    clockTimer = setInterval(tick, 2000);
    window.addEventListener('focus', tick);
    setTimeout(tick, 250);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
