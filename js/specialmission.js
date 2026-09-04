/* ============================================================
   specialmission.js — ภารกิจพิเศษแบบเดี่ยว (รอบ 1354)
   แยกจาก Daily Quest และ canonical progress ของเพื่อนโดยตั้งใจ
   ============================================================ */
(function(root){
  'use strict';

  const GOAL = 5;
  const REWARD = 10000;
  const PROMO_LOGIN_LIMIT = 2;
  const PROMO_RETRY_MS = 900;
  const STATE_DONE = 'hauntSpecialMissionDone';
  const STATE_NOTICE = 'hauntSpecialMissionNotice';
  const STATE_PROMOS = 'hauntSpecialPromoViews';
  let run = null;
  let promoPending = false;
  let promoTimer = 0;
  let lastLoginAt = 0;

  function gameState(){ return typeof state !== 'undefined' && state ? state : null; }
  function normalize(){
    const s = gameState();
    if(!s) return null;
    if(typeof s[STATE_DONE] !== 'boolean') s[STATE_DONE] = false;
    s[STATE_PROMOS] = Math.max(0, Math.min(PROMO_LOGIN_LIMIT, Math.floor(Number(s[STATE_PROMOS]) || 0)));
    if(!s[STATE_NOTICE] || typeof s[STATE_NOTICE] !== 'object') s[STATE_NOTICE] = null;
    return s;
  }
  function persist(pushNow){
    if(typeof saveState === 'function') saveState();
    if(typeof authPushSave === 'function'){
      try{
        const out = authPushSave(!!pushNow);
        if(out && typeof out.catch === 'function') out.catch(()=>{});
      }catch(_){ }
    }
  }
  function cleanWord(value){ return String(value || '').trim().toLowerCase(); }
  function cleanThai(value){ return String(value || '').trim(); }
  function snapshot(){
    const s = normalize();
    return {
      done:!!(s && s[STATE_DONE]), active:!!run, dead:!!(run && run.dead),
      runId:run ? run.id : '', count:run ? run.words : 0, goal:GOAL, reward:REWARD,
      words:run ? run.log.slice() : []
    };
  }
  function beginHauntedRun(runId){
    const id = String(runId || 'local');
    if(!run || run.id !== id){
      run = {id, words:0, dead:false, credited:new Set(), log:[]};
    }
    return snapshot();
  }
  function leaveHauntedRun(){ run = null; }
  function failHauntedRun(){
    if(run){ run.dead = true; run.words = 0; run.credited.clear(); run.log = []; }
    return snapshot();
  }
  function playMoneyFx(){
    if(typeof sfx === 'undefined' || !sfx) return;
    try{ if(sfx.rankup) sfx.rankup(); }catch(_){ }
    if(sfx.coinGet){
      [180,560,980].forEach(ms=>setTimeout(()=>{ try{sfx.coinGet();}catch(_){} },ms));
    }
  }
  function ensureStyle(){
    if(typeof document === 'undefined' || document.getElementById('hhsm-style')) return;
    const style = document.createElement('style');
    style.id = 'hhsm-style';
    style.textContent = `
      .hhsm-overlay{position:fixed;inset:0;z-index:13050;display:flex;align-items:center;justify-content:center;
        padding:clamp(6px,2vh,18px);background:radial-gradient(circle at 50% 38%,rgba(72,42,99,.95),rgba(9,5,18,.985) 72%);
        font-family:inherit;color:#fff;overflow:hidden;animation:hhsm-fade .24s ease-out}
      .hhsm-card{position:relative;width:min(760px,96vw);max-height:calc(100dvh - 12px);overflow:hidden;text-align:center;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(4px,1.25vh,10px);
        padding:clamp(10px,2.6vh,24px) clamp(14px,3.4vw,34px);border:2px solid #ffd86c;border-radius:clamp(16px,3vh,28px);
        background:linear-gradient(155deg,rgba(37,15,58,.98),rgba(12,7,25,.99));box-shadow:0 0 0 4px rgba(255,216,108,.14),0 24px 80px #000}
      .hhsm-card:before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.18;
        background:conic-gradient(transparent,#ffd86c,transparent 16%,transparent 32%,#c58cff,transparent 49%,transparent 70%,#ffd86c,transparent 86%);
        animation:hhsm-spin 14s linear infinite}
      .hhsm-card>*{position:relative;z-index:1}.hhsm-kicker{font-size:clamp(11px,2.4vh,16px);font-weight:900;letter-spacing:.18em;color:#d9b8ff}
      .hhsm-title{margin:0;font-size:clamp(20px,5.8vh,42px);line-height:1.08;color:#ffe69b;text-shadow:0 0 18px rgba(255,216,108,.64)}
      .hhsm-rule{font-size:clamp(13px,3.1vh,21px);line-height:1.35}.hhsm-rule b{color:#7fffc1}.hhsm-rule em{font-style:normal;color:#ff9aac}
      .hhsm-coin-visual{height:clamp(54px,15vh,112px);display:flex;align-items:flex-end;justify-content:center;gap:clamp(2px,1vw,9px);filter:drop-shadow(0 8px 10px #000)}
      .hhsm-coin-visual span{font-size:clamp(38px,11vh,78px);line-height:1;animation:hhsm-coin .72s ease-out both}.hhsm-coin-visual span:nth-child(2){animation-delay:.11s}.hhsm-coin-visual span:nth-child(3){animation-delay:.22s}
      .hhsm-amount{font-size:clamp(28px,8vh,58px);line-height:1;font-weight:1000;color:#ffd44f;text-shadow:0 0 18px rgba(255,190,34,.7)}
      .hhsm-copy{margin:0;font-size:clamp(12px,2.8vh,19px);line-height:1.38;color:#f1eaff}.hhsm-copy small{font-size:.84em;color:#cfc3dc}
      .hhsm-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.hhsm-btn{min-width:clamp(150px,28vw,250px);min-height:44px;border:0;border-radius:999px;
        padding:clamp(8px,2vh,13px) clamp(18px,4vw,34px);font:900 clamp(14px,3.1vh,20px)/1.15 inherit;cursor:pointer;color:#5f3c05;
        background:linear-gradient(#ffe98d,#efae2e);box-shadow:0 5px 0 #a96813}.hhsm-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #a96813}
      .hhsm-btn.secondary{color:#eee;background:linear-gradient(#73558f,#432e5c);box-shadow:0 5px 0 #261731}
      @keyframes hhsm-fade{from{opacity:0}to{opacity:1}}@keyframes hhsm-spin{to{transform:rotate(360deg)}}
      @keyframes hhsm-coin{0%{opacity:0;transform:translateY(-28px) scale(.35) rotate(-18deg)}65%{opacity:1;transform:translateY(4px) scale(1.15)}100%{transform:none}}
      @media(max-height:430px){.hhsm-card{width:min(780px,98vw);padding:7px 16px;gap:3px}.hhsm-kicker{font-size:10px}.hhsm-title{font-size:24px}
        .hhsm-rule{font-size:13px}.hhsm-coin-visual{height:48px}.hhsm-coin-visual span{font-size:40px}.hhsm-amount{font-size:32px}.hhsm-copy{font-size:12px;line-height:1.25}
        .hhsm-btn{min-height:40px;padding:6px 20px;font-size:14px}.hhsm-actions{flex-wrap:nowrap}}
    `;
    document.head.appendChild(style);
  }
  function showRewardNotice(){
    const s = normalize();
    const notice = s && s[STATE_NOTICE];
    if(!notice || !(Number(notice.amount) > 0) || typeof document === 'undefined') return false;
    if(document.getElementById('hhsm-reward')) return true;
    ensureStyle();
    playMoneyFx();
    const ov = document.createElement('div');
    ov.id = 'hhsm-reward'; ov.className = 'hhsm-overlay';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-labelledby','hhsm-reward-title');
    ov.innerHTML = `<section class="hhsm-card">
      <div class="hhsm-kicker">SPECIAL SOLO MISSION</div>
      <h2 class="hhsm-title" id="hhsm-reward-title">🎉 ยินดีด้วย! ภารกิจพิเศษสำเร็จ</h2>
      <div class="hhsm-coin-visual" aria-label="เหรียญรางวัลเข้ากระเป๋าแล้ว"><span>🪙</span><span>🪙</span><span>🪙</span></div>
      <div class="hhsm-amount">+${Number(notice.amount).toLocaleString('en-US')} เหรียญ</div>
      <p class="hhsm-copy"><b>เก็บคำศัพท์ครบ ${GOAL} คำในโรงแรมผีสิงโดยไม่ GAME OVER สำเร็จ!</b><br>
        เงินเข้ากระเป๋าทันทีเรียบร้อยแล้ว<br><small>เป็นรางวัลครั้งเดียวต่อบัญชี · คำที่เพื่อนเก็บไม่ถูกนำมานับ</small></p>
      <div class="hhsm-actions"><button type="button" class="hhsm-btn" data-hhsm-ack>รับทราบ 🪙</button></div>
    </section>`;
    const hold = e=>{ if(e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); } };
    document.addEventListener('keydown',hold,true);
    ov.querySelector('[data-hhsm-ack]').addEventListener('click',()=>{
      document.removeEventListener('keydown',hold,true);
      s[STATE_NOTICE] = null; persist(true); ov.remove();
      if(typeof renderDashboard === 'function' && document.getElementById('screen-dashboard')?.classList.contains('active')) renderDashboard();
    });
    document.body.appendChild(ov);
    ov.querySelector('[data-hhsm-ack]').focus();
    return true;
  }
  function award(){
    const s = normalize();
    if(!s || s[STATE_DONE] || !run || run.dead) return false;
    if(typeof addCoins !== 'function') return false;
    addCoins(REWARD);
    s[STATE_DONE] = true;
    s[STATE_NOTICE] = {amount:REWARD, at:Date.now(), runId:run.id, words:run.log.slice(0,GOAL)};
    promoPending = false; clearTimeout(promoTimer); promoTimer = 0;
    persist(true);
    showRewardNotice();
    return true;
  }
  function hauntedClaimCommitted(detail){
    const d = detail || {};
    const en = cleanWord(d.en), th = cleanThai(d.th), ordinal = Number(d.ordinal);
    if(!run || run.id !== String(d.runId || 'local')) beginHauntedRun(d.runId);
    if(!run || run.dead || snapshot().done) return {credited:false,awarded:false,...snapshot()};
    if(!d.completesWord || !/^[a-z]{2,9}$/.test(en) || !th || !Number.isInteger(ordinal) || ordinal < 0 || ordinal >= en.length)
      return {credited:false,awarded:false,reason:'invalid-word',...snapshot()};
    if(cleanWord(d.ch) !== en.charAt(ordinal)) return {credited:false,awarded:false,reason:'letter-word-mismatch',...snapshot()};
    const key = `${Number(d.wordIndex)}:${en}`;
    if(run.credited.has(key)) return {credited:false,awarded:false,reason:'duplicate',...snapshot()};
    run.credited.add(key); run.words += 1; run.log.push({en,th});
    const paid = run.words >= GOAL && award();
    return {credited:true,awarded:paid,reward:paid?REWARD:0,word:{en,th},...snapshot()};
  }
  function blockersPresent(){
    if(typeof document === 'undefined') return true;
    return !!document.querySelector('#hhsm-reward,.hhsm-promo,.rankup-overlay,.levelup-overlay,.panel-overlay,.onet-promo-overlay,.alert-overlay,#adv-overlay.on');
  }
  function closePromo(ov){
    if(!ov)return;
    if(ov._hhsmEscapeHold)document.removeEventListener('keydown',ov._hhsmEscapeHold,true);
    ov.remove();
  }
  function gotoHaunted(){
    const button = typeof document !== 'undefined' ? document.getElementById('btn-world-haunt') : null;
    if(button && !button.disabled){ button.click(); return true; }
    try{
      const world = typeof WORLD3D !== 'undefined' && WORLD3D.find(item=>item.mode === 'haunt');
      if(world && typeof railWorldClick === 'function'){ railWorldClick(world); return true; }
    }catch(_){ }
    if(typeof toast === 'function') toast('👻 เปิดหน้า Home แล้วแตะ “ผีสิง” ในหมวดโลก 3D');
    return false;
  }
  function showPromo(){
    const s = normalize();
    if(!s || s[STATE_DONE] || s[STATE_PROMOS] >= PROMO_LOGIN_LIMIT || typeof document === 'undefined') return false;
    if(blockersPresent() || !document.getElementById('screen-dashboard')?.classList.contains('active')) return false;
    ensureStyle();
    s[STATE_PROMOS] += 1; persist(false);
    const ov = document.createElement('div');
    ov.className = 'hhsm-overlay hhsm-promo'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML = `<section class="hhsm-card">
      <div class="hhsm-kicker">ภารกิจพิเศษแยกจากภารกิจรายวัน</div>
      <h2 class="hhsm-title">👻 โรงแรมผีสิง: นักล่าคำเดี่ยว</h2>
      <div class="hhsm-rule"><b>เก็บคำศัพท์ให้ครบ ${GOAL} คำ</b> โดยไม่ GAME OVER<br><em>นับเฉพาะคำที่หนูเก็บตัวอักษรสุดท้ายเอง — คำของเพื่อนไม่นับ</em></div>
      <div class="hhsm-amount">รางวัล ${REWARD.toLocaleString('en-US')} 🪙</div>
      <p class="hhsm-copy">เงินเข้าทันทีเมื่อทำสำเร็จ · รับได้ครั้งเดียวต่อบัญชี<br><small>ป้ายนี้จะค้างจนกดปุ่มด้านล่าง · แสดง 1 ครั้งต่อ login เฉพาะ 2 login แรก</small></p>
      <div class="hhsm-actions"><button type="button" class="hhsm-btn" data-hhsm-go>ไปโรงแรมผีสิง</button><button type="button" class="hhsm-btn secondary" data-hhsm-close>รับทราบ</button></div>
    </section>`;
    const hold=e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();}};
    ov._hhsmEscapeHold=hold; document.addEventListener('keydown',hold,true);
    ov.querySelector('[data-hhsm-close]').addEventListener('click',()=>closePromo(ov));
    ov.querySelector('[data-hhsm-go]').addEventListener('click',()=>{ closePromo(ov); setTimeout(gotoHaunted,60); });
    ov.addEventListener('click',e=>{if(e.target===ov){e.preventDefault();e.stopPropagation();}});
    document.body.appendChild(ov); ov.querySelector('[data-hhsm-go]').focus();
    return true;
  }
  function promoLoop(){
    clearTimeout(promoTimer); promoTimer = 0;
    if(!promoPending) return;
    const s = normalize();
    if(!s || s[STATE_DONE] || s[STATE_PROMOS] >= PROMO_LOGIN_LIMIT){ promoPending = false; return; }
    if(showPromo()){ promoPending = false; return; }
    promoTimer = setTimeout(promoLoop,PROMO_RETRY_MS);
  }
  function onLogin(){
    const now = Date.now();
    if(now - lastLoginAt < 5000) return;
    lastLoginAt = now;
    const s = normalize();
    if(!s) return;
    if(s[STATE_NOTICE]){ showRewardNotice(); return; }
    if(s[STATE_DONE] || s[STATE_PROMOS] >= PROMO_LOGIN_LIMIT) return;
    promoPending = true; promoLoop();
  }

  root.SpecialMission = Object.freeze({
    GOAL,REWARD,PROMO_LOGIN_LIMIT,beginHauntedRun,leaveHauntedRun,failHauntedRun,
    hauntedClaimCommitted,snapshot,showRewardNotice,onLogin,_showPromo:showPromo
  });
})(window);
