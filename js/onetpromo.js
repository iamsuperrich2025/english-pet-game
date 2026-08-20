/* 🇹🇭 รอบ 1184: ป้ายเชิญชวน O-NET หลัง login — ปิดแล้วไม่เด้งซ้ำตลอด session */
(function(){
  let pending = false;
  let retryTimer = 0;
  const key = ()=> 'vwOnetPromoClosed:' + ((window.Auth && Auth.user && Auth.user.uid) || 'player');
  const closed = ()=> { try{return sessionStorage.getItem(key()) === '1';}catch(e){return false;} };
  const rememberClosed = ()=> { try{sessionStorage.setItem(key(),'1');}catch(e){} };

  function closePromo(remember){
    const el = document.getElementById('onet-promo-overlay');
    if(el) el.remove();
    pending = false;
    if(remember !== false) rememberClosed();
  }

  function openPromo(){
    if(document.getElementById('onet-promo-overlay') || closed()) return;
    const el = document.createElement('div');
    el.id = 'onet-promo-overlay';
    el.className = 'onet-promo-overlay';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-modal','true');
    el.setAttribute('aria-labelledby','onet-promo-title');
    el.innerHTML = `<section class="onet-promo-card">
      <button class="onet-promo-close" type="button" aria-label="ปิดป้าย O-NET">✕ ปิด</button>
      <div class="onet-promo-kicker">🇹🇭 ภารกิจพิเศษ O-NET</div>
      <h2 class="onet-promo-title" id="onet-promo-title">ลองสนามสอบ ก่อนวันจริง!</h2>
      <p class="onet-promo-lead">ฝึกทำข้อสอบภาษาอังกฤษเสมือนจริง พร้อมเฉลยและสุ่มข้อใหม่ทุกครั้ง</p>
      <div class="onet-promo-grades"><span>🎒 ป.6</span><span>📘 ม.3</span><span>🎓 ม.6</span></div>
      <div class="onet-promo-grid">
        <div class="onet-promo-stat"><b>15 ชุด</b><small>เลือกฝึกได้หลายระดับ</small></div>
        <div class="onet-promo-stat"><b>620 ข้อ</b><small>สุ่มลำดับกันจำคำตอบ</small></div>
        <div class="onet-promo-stat"><b>สูงสุด 5,000 🪙</b><small>รางวัลพิชิตข้อสอบ</small></div>
      </div>
      <div class="onet-promo-actions">
        <button class="onet-promo-go" type="button">🚀 ทดลองสอบ O-NET เลย</button>
        <button class="onet-promo-later" type="button">ไว้ทีหลัง</button>
      </div>
      <p class="onet-promo-note">แนวข้อสอบอ้างอิง Test Blueprint สทศ. ปีการศึกษา 2569</p>
    </section>`;
    document.body.appendChild(el);
    el.querySelector('.onet-promo-close').addEventListener('click',()=>closePromo(true));
    el.querySelector('.onet-promo-later').addEventListener('click',()=>closePromo(true));
    el.querySelector('.onet-promo-go').addEventListener('click',()=>{
      closePromo(true);
      if(typeof window.openOnetBoard === 'function') window.openOnetBoard();
    });
    el.addEventListener('keydown',e=>{if(e.key === 'Escape') closePromo(true);});
    el.querySelector('.onet-promo-go').focus();
  }

  function maybeShow(){
    if(pending || closed() || document.getElementById('onet-promo-overlay')) return;
    if(!window.Auth || !Auth.booted || !window.state || !state.student) return;
    pending = true;
    clearTimeout(retryTimer);
    const attempt = ()=>{
      const dash = document.getElementById('screen-dashboard');
      if(!dash || !dash.classList.contains('active')){pending=false;return;}
      const busy = document.querySelector('#consent-gate,.confirm-overlay,.levelup-overlay,.pl-overlay,.alert-overlay');
      if(busy){retryTimer=setTimeout(attempt,650);return;}
      pending = false;
      openPromo();
    };
    retryTimer = setTimeout(attempt,850);
  }

  function reset(){
    clearTimeout(retryTimer);
    pending = false;
    try{sessionStorage.removeItem(key());}catch(e){}
  }

  window.onetPromoMaybeShow = maybeShow;
  window.onetPromoClose = closePromo;
  window.onetPromoReset = reset;
  window.onetPromoPreview = openPromo;
}());
