/* 🇹🇭 รอบ 1186: ป้าย O-NET เกือบเต็มจอ · สูงสุด 3 login/บัญชี · เลือกไม่แสดงอีกได้ */
(function(){
  const MAX_SHOWS = 3;
  const KEY_VER = 'v4';             // รอบ 1187: รีเซ็ต counter ที่อาจถูกนับผิดก่อนแก้ Auth guard
  let pending = false;
  let retryTimer = 0;
  let promoUid = '';

  // auth.js/state.js ใช้ top-level const/let จึงเข้าถึงผ่าน identifier โดยตรง ไม่ใช่ window.*
  const authReady = ()=> typeof Auth !== 'undefined' && Auth.booted;
  const uid = ()=> promoUid || (typeof Auth !== 'undefined' && Auth.user && Auth.user.uid) || 'player';
  const sessionKey = ()=> `vwOnetPromoLoginShown:${KEY_VER}:${uid()}`;
  const seenKey = ()=> `vwOnetPromoSeen:${KEY_VER}:${uid()}`;
  const neverKey = ()=> `vwOnetPromoNever:${KEY_VER}:${uid()}`;
  const storeGet = (store,key)=>{try{return store.getItem(key);}catch(e){return null;}};
  const storeSet = (store,key,val)=>{try{store.setItem(key,val);}catch(e){}};
  const storeDel = (store,key)=>{try{store.removeItem(key);}catch(e){}};
  // state.js ประกาศด้วย top-level let จึงไม่มี window.state ใน production Classic
  const classicReady = ()=> typeof state !== 'undefined' && !!state.student;
  const localSeen = ()=> Math.max(0, Number(storeGet(localStorage,seenKey())) || 0);
  const stateSeen = ()=> classicReady() ? Math.max(0, Number(state.onetPromoSeenV4) || 0) : 0;
  const seenCount = ()=> Math.max(localSeen(),stateSeen());
  const neverAgain = ()=> storeGet(localStorage,neverKey()) === '1' || (classicReady() && state.onetPromoNeverV4 === true);
  const shownThisLogin = ()=> storeGet(sessionStorage,sessionKey()) === '1';

  function saveClassicPrefs(){
    if(!classicReady()) return;
    if(typeof saveState === 'function') saveState();
    if(typeof authPushSave === 'function') authPushSave(true);
  }
  function syncPrefsToClassic(){
    if(!classicReady()) return;
    let changed = false;
    const n = localSeen();
    if(n > stateSeen()){state.onetPromoSeenV4=n;changed=true;}
    if(storeGet(localStorage,neverKey()) === '1' && state.onetPromoNeverV4 !== true){state.onetPromoNeverV4=true;changed=true;}
    if(state.onetPromoNeverV4 === true) storeSet(localStorage,neverKey(),'1');
    if(stateSeen() > n) storeSet(localStorage,seenKey(),String(stateSeen()));
    if(changed) saveClassicPrefs();
  }
  function allowed(){
    syncPrefsToClassic();
    return !shownThisLogin() && !neverAgain() && seenCount() < MAX_SHOWS;
  }
  function recordShown(){
    const n = Math.min(MAX_SHOWS,seenCount()+1);
    storeSet(sessionStorage,sessionKey(),'1');
    storeSet(localStorage,seenKey(),String(n));
    if(classicReady()){
      state.onetPromoSeenV4=n;
      saveClassicPrefs();
    }
    return n;
  }
  function rememberNever(){
    storeSet(localStorage,neverKey(),'1');
    if(classicReady()){
      state.onetPromoNeverV4=true;
      saveClassicPrefs();
    }
  }
  function finishPromo(){
    const el = document.getElementById('onet-promo-overlay');
    if(el && el.querySelector('#onet-promo-never')?.checked) rememberNever();
    if(el) el.remove();
    pending = false;
    setTimeout(()=>racingPromoMaybeShow(),180);
  }

  /* 🏁 ป้ายเปิดสนาม Vocab World Racing — แสดงต่อจาก O-NET และปิดแล้วไม่แสดงซ้ำ */
  const racingKey = ()=> `vwRacingPromoDismissed:v1:${uid()}`;
  const racingDismissed = ()=> storeGet(localStorage,racingKey()) === '1'
    || (classicReady() && state.racingPromoDismissedV1 === true);
  function rememberRacingDismissed(){
    storeSet(localStorage,racingKey(),'1');
    if(classicReady()){
      state.racingPromoDismissedV1=true;
      saveClassicPrefs();
    }
  }
  function finishRacingPromo(){
    const el=document.getElementById('racing-promo-overlay');
    if(el) el.remove();
    rememberRacingDismissed();
  }
  function openRacingPromo(){
    if(racingDismissed() || document.getElementById('racing-promo-overlay') || document.getElementById('onet-promo-overlay')) return;
    const el=document.createElement('div');
    el.id='racing-promo-overlay';
    el.className='racing-promo-overlay';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-modal','true');
    el.setAttribute('aria-labelledby','racing-promo-title');
    el.innerHTML=`<section class="racing-promo-card">
      <button class="racing-promo-close" type="button" aria-label="ปิดป้าย Vocab World Racing">✕ ปิด</button>
      <div class="racing-promo-flag">🏁 สนามใหม่เปิดให้ทุกคนแล้ว!</div>
      <div class="racing-promo-car" aria-hidden="true">🏎️<span>💨</span></div>
      <h2 id="racing-promo-title">Vocab World Racing</h2>
      <p class="racing-promo-lead">ซิ่งรถ F1 บนสนามจริง ฝึกคำศัพท์ระหว่างแข่ง<br><b>สนุกกับเพื่อนได้ทั้งห้อง!</b></p>
      <div class="racing-promo-features"><span>🌍 สนาม 3D</span><span>👥 Multiplayer</span><span>📚 คำศัพท์ 5 ระดับ</span></div>
      <p class="racing-promo-price">ค่าเข้าเพียง <b>🪙 500</b> ต่อรอบ</p>
      <button class="racing-promo-go" type="button">🏎️ ไปสนามแข่งเลย!</button>
      <small>ปิดป้ายนี้แล้วจะไม่แสดงอีก</small>
    </section>`;
    document.body.appendChild(el);
    el.querySelector('.racing-promo-close').addEventListener('click',finishRacingPromo);
    el.querySelector('.racing-promo-go').addEventListener('click',()=>{
      finishRacingPromo();
      const btn=document.getElementById('btn-world-f1');
      if(btn){btn.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>btn.click(),300);}
      else if(typeof showScreen==='function') showScreen('dashboard');
    });
    el.addEventListener('keydown',e=>{if(e.key==='Escape') finishRacingPromo();});
    el.querySelector('.racing-promo-go').focus();
  }
  function racingPromoMaybeShow(){
    if(racingDismissed() || document.getElementById('racing-promo-overlay') || document.getElementById('onet-promo-overlay')) return;
    const dash=document.getElementById('screen-dashboard');
    if(!dash || !dash.classList.contains('active') || visibleBlocker()) return;
    openRacingPromo();
  }

  function openPromo(force){
    if(document.getElementById('onet-promo-overlay') || (!force && !allowed())) return;
    const showNo = force ? 1 : recordShown();
    const el = document.createElement('div');
    el.id = 'onet-promo-overlay';
    el.className = 'onet-promo-overlay';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-modal','true');
    el.setAttribute('aria-labelledby','onet-promo-title');
    el.innerHTML = `<section class="onet-promo-card">
      <button class="onet-promo-close" type="button" aria-label="ปิดป้าย O-NET">✕ ปิด</button>
      <div class="onet-promo-content">
        <div class="onet-promo-kicker">🇹🇭 ภารกิจพิเศษ O-NET · ครั้งที่ ${showNo}/${MAX_SHOWS}</div>
        <h2 class="onet-promo-title" id="onet-promo-title">ลองสนามสอบ ก่อนวันจริง!</h2>
        <p class="onet-promo-lead">เตรียมพร้อม O-NET ภาษาอังกฤษด้วยข้อสอบเสมือนจริง สุ่มใหม่ทุกครั้ง พร้อมเฉลยละเอียด</p>
        <div class="onet-promo-grades"><span>🎒 ป.6</span><span>📘 ม.3</span><span>🎓 ม.6</span></div>
        <div class="onet-promo-grid">
          <div class="onet-promo-stat"><b>15 ชุด</b><small>ฝึกได้หลายระดับ</small></div>
          <div class="onet-promo-stat"><b>620 ข้อ</b><small>สุ่มโจทย์และตัวเลือก</small></div>
          <div class="onet-promo-stat"><b>สูงสุด 5,000 🪙</b><small>รางวัลพิชิตข้อสอบ</small></div>
        </div>
        <div class="onet-promo-actions">
          <button class="onet-promo-go" type="button">🚀 ทดลองสอบ O-NET เลย</button>
          <button class="onet-promo-later" type="button">ไว้ทีหลัง</button>
        </div>
        <label class="onet-promo-optout"><input id="onet-promo-never" type="checkbox"> <span>ไม่ต้องแสดงป้ายนี้อีก</span></label>
        <p class="onet-promo-note">แนวข้อสอบอ้างอิง Test Blueprint สทศ. ปีการศึกษา 2569 · ป้ายนี้แสดงสูงสุด 3 Login</p>
      </div>
    </section>`;
    document.body.appendChild(el);
    el.querySelector('.onet-promo-close').addEventListener('click',finishPromo);
    el.querySelector('.onet-promo-later').addEventListener('click',finishPromo);
    el.querySelector('.onet-promo-go').addEventListener('click',()=>{
      finishPromo();
      if(typeof window.openOnetBoard === 'function') window.openOnetBoard();
      else location.href = 'index_classic.html?go=onet';
    });
    el.addEventListener('keydown',e=>{if(e.key === 'Escape') finishPromo();});
    el.querySelector('.onet-promo-go').focus();
  }

  function isVisible(el){
    if(!el || el.hidden) return false;
    const cs = getComputedStyle(el);
    if(cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function visibleBlocker(){
    return [...document.querySelectorAll('#consent-gate,.confirm-overlay,.levelup-overlay,.pl-overlay,.alert-overlay')].some(isVisible);
  }
  function maybeShow(){
    if(pending || document.getElementById('onet-promo-overlay')) return;
    if(!authReady() || !classicReady()) return;
    if(!allowed()){setTimeout(()=>racingPromoMaybeShow(),850);return;}
    pending = true;
    clearTimeout(retryTimer);
    const attempt = ()=>{
      const dash = document.getElementById('screen-dashboard');
      if(!dash || !dash.classList.contains('active')){pending=false;return;}
      if(visibleBlocker()){retryTimer=setTimeout(attempt,650);return;}
      pending = false;
      openPromo(false);
    };
    retryTimer = setTimeout(attempt,850);
  }
  function reset(){
    clearTimeout(retryTimer);
    pending = false;
    storeDel(sessionStorage,sessionKey());
  }
  function cityMaybeShow(cityUid){
    promoUid = String(cityUid || '');
    if(!promoUid || pending || document.getElementById('onet-promo-overlay')) return;
    if(!allowed()){setTimeout(()=>racingPromoMaybeShow(),1100);return;}
    pending = true;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(()=>{pending=false;openPromo(false);},1100);
  }

  window.onetPromoMaybeShow = maybeShow;
  window.onetPromoClose = finishPromo;
  window.onetPromoReset = reset;
  window.onetPromoPreview = ()=>openPromo(true);
  window.onetPromoCityMaybeShow = cityMaybeShow;
  window.racingPromoMaybeShow = racingPromoMaybeShow;
  window.racingPromoPreview = openRacingPromo;
}());
