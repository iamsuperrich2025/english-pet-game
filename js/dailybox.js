"use strict";
/* ============================================================
   🎁🪙 กล่องสุ่มรายวัน — รอบ 1272
   5 รางวัลสับด้วย crypto, ไม่ซ้ำตำแหน่งเดิมจากวันก่อน, รับได้วันละครั้ง
   ใบยินดีไม่มี timer/Esc/backdrop close; ปิดได้เฉพาะปุ่มรับทราบ
   ============================================================ */
(function(){
  const PRIZES = Object.freeze([5000, 4000, 3000, 2000, 1000]);
  const THEMES = Object.freeze([
    {name:'แมวเหมียว', face:'🐱', cls:'pink'},
    {name:'กระต่ายปุกปุย', face:'🐰', cls:'sky'},
    {name:'หมีน้อย', face:'🐻', cls:'honey'},
    {name:'จิ้งจอกแสนซน', face:'🦊', cls:'mint'},
    {name:'ลูกเจี๊ยบ', face:'🐥', cls:'lilac'}
  ]);
  const BLOCKERS = '.rankup-overlay,.levelup-overlay,.panel-overlay,.onet-promo-overlay,.alert-overlay';
  let retryTimer = 0, resizeTimer = 0;

  function randomIndex(max){
    if(max <= 1) return 0;
    try{
      if(window.crypto && typeof window.crypto.getRandomValues === 'function'){
        const a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0] % max;
      }
    }catch(e){}
    return Math.floor(Math.random() * max);
  }
  function shuffled(){
    const out = PRIZES.slice();
    for(let i=out.length-1;i>0;i--){ const j=randomIndex(i+1); [out[i],out[j]]=[out[j],out[i]]; }
    return out;
  }
  function sameOrder(a,b){ return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]); }
  function validOrder(order,previous){
    if(!Array.isArray(order)||order.length!==PRIZES.length||!PRIZES.every(v=>order.includes(v))) return false;
    if(sameOrder(order,PRIZES)||sameOrder(order,PRIZES.slice().reverse())) return false;
    return !(Array.isArray(previous)&&previous.length===PRIZES.length&&order.some((v,i)=>v===previous[i]));
  }
  function makeOrder(previous){
    for(let i=0;i<120;i++){ const order=shuffled(); if(validOrder(order,previous)) return order; }
    const base=Array.isArray(previous)&&previous.length===5?previous.slice():[3000,1000,5000,2000,4000];
    for(let n=1;n<5;n++){ const order=base.slice(n).concat(base.slice(0,n)); if(validOrder(order,previous)) return order; }
    return [3000,1000,5000,2000,4000];
  }
  function today(){ return typeof todayStr==='function'?todayStr():new Date().toISOString().slice(0,10); }
  function validSavedRound(r){
    return r&&Array.isArray(r.order)&&r.order.length===5&&PRIZES.every(v=>r.order.includes(v))&&
      (!r.claimed||(PRIZES.includes(Number(r.prize))&&Number.isInteger(r.slot)&&r.slot>=0&&r.slot<5));
  }
  function roundState(){
    const date=today(), old=state.dailyMysteryBox;
    if(old&&old.date===date&&validSavedRound(old)) return old;
    state.dailyMysteryBox={date,order:makeOrder(old&&old.order),claimed:false,acknowledged:false,slot:-1,prize:0,claimedAt:0};
    saveState(); if(typeof authPushSave==='function') authPushSave(true);
    return state.dailyMysteryBox;
  }
  function fmt(n){ return typeof fmtNum==='function'?fmtNum(n):Number(n).toLocaleString('th-TH'); }
  function isDashboardReady(){
    const dash=document.getElementById('screen-dashboard');
    return !!(dash&&dash.classList.contains('active')&&state&&state.student&&(typeof Auth==='undefined'||Auth.booted));
  }
  function hasBlocker(){
    return [...document.querySelectorAll(BLOCKERS)].some(el=>{
      if(el.matches('[data-daily-box]')) return false;
      const css=window.getComputedStyle(el);
      return css.display!=='none'&&css.visibility!=='hidden'&&Number(css.opacity)!==0&&el.getClientRects().length>0;
    });
  }
  function schedule(delay){ clearTimeout(retryTimer); retryTimer=setTimeout(maybeShow,Math.max(80,Number(delay)||800)); }
  function fit(card){
    if(!card) return; let k=1; card.style.setProperty('--db-fit','1');
    const room=Math.max(240,window.innerHeight*.96);
    while(card.scrollHeight>room&&k>.68){ k=Math.round((k-.04)*100)/100; card.style.setProperty('--db-fit',String(k)); }
  }
  function onResize(){ clearTimeout(resizeTimer); resizeTimer=setTimeout(()=>fit(document.querySelector('[data-daily-box] .db-card')),100); }
  function chestHTML(theme,index,open){
    return `<span class="db-chest ${theme.cls}${open?' is-open':''}" aria-hidden="true"><span class="db-lid"><i></i></span><span class="db-body"><b>${theme.face}</b><i class="db-lock">?</i></span><span class="db-spark s1">✦</span><span class="db-spark s2">✧</span></span><span class="db-box-label">กล่อง ${String.fromCharCode(65+index)}</span>`;
  }
  function pickerHTML(){
    const boxes=THEMES.map((theme,i)=>`<button class="db-pick" type="button" data-slot="${i}" aria-label="เลือกกล่อง ${String.fromCharCode(65+i)} ${theme.name}">${chestHTML(theme,i,false)}</button>`).join('');
    return `<div class="db-kicker">🌟 ของขวัญประจำวัน 🌟</div><h2 id="db-title">🎁 เลือกกล่องสุ่ม 1 ใบ</h2><p class="db-sub">มีเหรียญ <b>5,000 • 4,000 • 3,000 • 2,000 • 1,000</b><br>ซ่อนอยู่ข้างใน — เลือกได้เพียงวันละ 1 ครั้ง</p><div class="db-grid">${boxes}</div><p class="db-foot">🔀 รางวัลทุกตำแหน่งถูกสลับใหม่และไม่ซ้ำช่องเดิมจากเมื่อวาน</p>`;
  }
  function shell(inner,label){
    const ov=document.createElement('div'); ov.className='db-overlay'; ov.dataset.dailyBox='1';
    ov.setAttribute('role','alertdialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-labelledby','db-title'); ov.setAttribute('aria-label',label||'กล่องสุ่มรายวัน');
    ov.innerHTML=`<div class="db-bg-stars" aria-hidden="true"></div><div class="db-card">${inner}</div>`;
    document.body.appendChild(ov); fit(ov.querySelector('.db-card')); window.addEventListener('resize',onResize); return ov;
  }
  function removeOverlay(ov){ window.removeEventListener('resize',onResize); if(ov) ov.remove(); }
  function showPicker(round){
    const ov=shell(pickerHTML(),'เลือกกล่องสุ่มรายวัน 1 ใบ'), buttons=[...ov.querySelectorAll('.db-pick')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>claim(round,Number(btn.dataset.slot),ov)));
    setTimeout(()=>buttons[0]&&buttons[0].focus({preventScroll:true}),80);
  }
  function storedClaim(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY), saved=raw&&JSON.parse(raw), claim=saved&&saved.dailyMysteryBox;
      return claim&&claim.date===today()&&claim.claimed?claim:null;
    }catch(e){ return null; }
  }
  function playRewardSound(){
    if(typeof sfx==='undefined') return; if(sfx.levelup) sfx.levelup();
    if(sfx.coinGet){ setTimeout(()=>sfx.coinGet(),220); setTimeout(()=>sfx.coinGet(),620); setTimeout(()=>sfx.coinGet(),1080); }
  }
  function claim(round,slot,ov){
    if(!round||round.claimed||slot<0||slot>=5) return;
    // แท็บอื่นบนเครื่องเดียวกันอาจเปิดกล่องก่อนหน้าไม่กี่มิลลิวินาที — อ่าน localStorage สดก่อนจ่าย
    const other=storedClaim();
    if(other){
      state=loadState(); removeOverlay(ov); schedule(80); return;
    }
    ov.querySelectorAll('.db-pick').forEach(btn=>{btn.disabled=true;}); if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
    const prize=Number(round.order[slot]);
    round.claimed=true; round.acknowledged=false; round.slot=slot; round.prize=prize; round.claimedAt=Date.now();
    addCoins(prize); saveState(); if(typeof authPushSave==='function') authPushSave(true);
    if(typeof renderDashboard==='function') renderDashboard();
    if(typeof feedEvent==='function') feedEvent('coin',`เปิดกล่องสุ่มรายวัน ได้รับ +${fmt(prize)} 🪙`);
    playRewardSound(); if(state.haptic!==false&&navigator.vibrate) navigator.vibrate([40,45,80,45,140]); showPrize(round,ov);
  }
  function prizeHTML(round){
    const theme=THEMES[round.slot]||THEMES[0], soundNote=typeof soundStatus==='function'?soundStatus():'';
    return `<div class="db-win" aria-live="assertive"><div class="db-kicker">🎊 ยินดีด้วย! 🎊</div><h2 id="db-title">เปิดกล่องสำเร็จ</h2><div class="db-win-main"><div class="db-open-wrap">${chestHTML(theme,round.slot,true)}<div class="db-coins" aria-hidden="true"><i>🪙</i><i>🪙</i><i>🪙</i><i>✨</i><i>⭐</i></div></div><div class="db-win-copy"><div class="db-won-label">หนูได้รับ</div><div class="db-amount">+${fmt(round.prize)} <span>เหรียญ 🪙</span></div><div class="db-wallet">👛 เงินเข้ากระเป๋าแล้ว • ยอดคงเหลือ ${fmt(Math.round(state.coins))}</div></div></div>${soundNote?`<p class="db-sound-note">${soundNote}</p>`:'<p class="db-sound-note ok">🔊 เสียงรางวัลดังขึ้นและเหรียญเข้ากระเป๋าทันที</p>'}<button class="db-ack" type="button">รับทราบ ✨</button><p class="db-must-ack">ข้อความนี้จะค้างอยู่จนกว่าหนูจะกด “รับทราบ”</p></div>`;
  }
  function showPrize(round,existing){
    const ov=existing||shell('',`ยินดีด้วย ได้รับ ${fmt(round.prize)} เหรียญ`), card=ov.querySelector('.db-card');
    ov.setAttribute('aria-label',`ยินดีด้วย ได้รับ ${fmt(round.prize)} เหรียด`); card.classList.add('won'); card.innerHTML=prizeHTML(round); fit(card);
    const ack=card.querySelector('.db-ack'); ack.addEventListener('click',()=>{
      round.acknowledged=true; saveState(); if(typeof authPushSave==='function') authPushSave(true); removeOverlay(ov);
      if(typeof renderDashboard==='function') renderDashboard();
    }); setTimeout(()=>ack.focus({preventScroll:true}),80);
  }
  function maybeShow(){
    clearTimeout(retryTimer); if(document.querySelector('[data-daily-box]')) return;
    if(!isDashboardReady()){schedule(900);return;} const round=roundState();
    if(round.claimed&&round.acknowledged) return; if(hasBlocker()){schedule(900);return;}
    round.claimed?showPrize(round):showPicker(round);
  }
  window.DailyMysteryBox=Object.freeze({schedule,maybeShow,_test:Object.freeze({PRIZES:PRIZES.slice(),makeOrder,validOrder,sameOrder})});
  window.dailyMysteryBoxSchedule=schedule;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(900),{once:true}); else schedule(900);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(500);});
}());
