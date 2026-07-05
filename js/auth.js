"use strict";
/* ============================================================
   ENGINE: Google Login + Sync เซฟขึ้น cloud (backlog ข้อ 0.1)
   ------------------------------------------------------------
   กติกา (ผู้ใช้เลือกแบบ ก. 5 ก.ค. 2026): บังคับ login ด้วย Google
   เท่านั้นก่อนเข้าเกม — offline/SDK โหลดไม่ได้ → หน้าประตูให้ลองใหม่
   ------------------------------------------------------------
   - เซฟจริงอยู่ cloud: /users/<uid>/save = {data: JSON ทั้ง state, at: เวลาเซฟ}
     localStorage เป็นแค่ cache ในเครื่อง — login แล้วโหลดจาก cloud ถ้าใหม่กว่า
   - push ขึ้น cloud ทุก 1 นาที (เฉพาะตอนเซฟขยับ) + ตอนปิด/พับแท็บ + จุดสำคัญ
   - เซฟเก่าในเครื่องที่ยังไม่ผูกบัญชี (ownerUid null) → login ครั้งแรกถามผูก
   - ลำดับโหลด: online.js โหลด SDK (app→auth→database) เสร็จแล้วเรียก authStart()
   ============================================================ */

const Auth = {
  user:null,          // firebase user ที่ login อยู่ (null = ยังไม่ login)
  booted:false,       // เข้าเกมแล้ว (กัน onAuthStateChanged/enterGame ทำงานซ้ำ)
  sdkReady:false,     // authStart ถูกเรียกแล้ว (SDK มาครบ)
  gated:false,        // ติดหน้าประตู offline อยู่ (ไม่ต้องรอ watchdog ซ้ำ)
  lastPushedAt:0,     // savedAt ล่าสุดที่ push ขึ้น cloud สำเร็จ (กันเขียนซ้ำโดยไม่จำเป็น)
};

const AUTH_PUSH_MS        = 60*1000;   // push เซฟขึ้น cloud ทุก 1 นาที
const AUTH_SDK_TIMEOUT_MS = 20*1000;   // รอ SDK นานสุดก่อนถือว่าออฟไลน์

/* ---------- หน้าจอ login: สลับสถานะ เชื่อมต่อ/พร้อม/ออฟไลน์ ---------- */
function authSetStatus(mode, msg){
  const st    = document.getElementById('login-status');
  const btn   = document.getElementById('btn-google-login');
  const retry = document.getElementById('btn-login-retry');
  if(!st) return;
  st.textContent = msg || '';
  btn.style.display   = mode === 'ready'   ? '' : 'none';
  retry.style.display = mode === 'offline' ? '' : 'none';
}
function authShowLogin(){
  authSetStatus('ready', 'เข้าสู่ระบบเพื่อเริ่มผจญภัยเลย! 👇');
  showScreen('screen-login');
}
function authGateOffline(msg){
  Auth.gated = true;
  authSetStatus('offline', msg || 'ต่ออินเทอร์เน็ตไม่ได้ 📶 เช็กเน็ตแล้วกดลองใหม่นะ');
  showScreen('screen-login');
}

/* ---------- จุดคุยกับ DB (แยกเป็นฟังก์ชันเล็กๆ ให้ mock ทดสอบง่าย) ---------- */
function authSaveRef(uid){ return firebase.database().ref('users/' + uid + '/save'); }
function authFetchCloud(uid){ return authSaveRef(uid).get().then(s=>s.val()); }
function authWriteCloud(uid, payload){ return authSaveRef(uid).set(payload); }
function authDeleteCloud(uid){ return authSaveRef(uid).remove(); }
function authWriteProfileName(uid, name){
  return firebase.database().ref('users/' + uid + '/profile/name').set(name);
}

/* ---------- ชื่อในเกม (ข้อ 0.2) → /users/<uid>/profile/name ----------
   สำเนาสาธารณะฝั่ง DB (rules validate ความยาว 2–20 ซ้ำอีกชั้น) —
   ข้อ 0.3 จะใช้ค้นหาเพื่อน · เรียกซ้ำได้ ปลอดภัย (เขียนค่าเดิมทับ) */
function authPushProfile(){
  if(!Auth.user || !state.profileName) return;
  try{
    authWriteProfileName(Auth.user.uid, state.profileName).catch(()=>{});
  }catch(e){ /* SDK ยังไม่พร้อม — รอบหน้าค่อยส่ง */ }
}

/* ---------- กล่องบังคับตั้งชื่อในเกม (ผู้เล่นเดิมที่เซฟยังไม่มีชื่อ — ข้อ 0.2)
   ปิดข้ามไม่ได้: ชื่อนี้ใช้โชว์บน presence/leaderboard แทนชื่อจริง ---------- */
function authAskProfileName(){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    <div class="lv-emoji">📛</div>
    <h2>ตั้งชื่อในเกมกันเถอะ!</h2>
    <p style="font-size:14.5px;color:#8a7aa0;margin:6px 0 10px">
      ชื่อนี้คือชื่อที่เพื่อนๆ ทั้งเกมจะเห็น (ไทย/อังกฤษ 2–20 ตัว)<br>
      ไม่ต้องใช้ชื่อ-นามสกุลจริงก็ได้นะ 😊</p>
    <input id="pf-name-input" maxlength="20" placeholder="เช่น น้องบีม, Beam123"
      style="width:88%;padding:10px 12px;border:2px solid #d9c9ef;border-radius:12px;font-size:16px;font-family:inherit;text-align:center">
    <p id="pf-name-err" style="color:#e05555;font-size:13.5px;min-height:18px;margin:8px 0 2px"></p>
    <button class="cf-ok" id="pf-name-ok">ใช้ชื่อนี้เลย ✅</button>
  </div>`;
  document.body.appendChild(overlay);
  const input = overlay.querySelector('#pf-name-input');
  const err   = overlay.querySelector('#pf-name-err');
  const submit = ()=>{
    const r = checkName(input.value, 2, 20);
    if(!r.ok){
      sfx.wrong();
      err.textContent = r.msg;
      return;
    }
    state.profileName = r.name;
    saveState();
    authPushProfile();
    authPushSave(true);
    overlay.remove();
    sfx.levelup();
    toast(`📛 ตั้งชื่อ "${r.name}" เรียบร้อย!`);
    // อัปเดตชื่อบน presence/leaderboard ทันที (lastCoins = null บังคับเขียนกระดานใหม่)
    if(typeof Online !== 'undefined') Online.lastCoins = null;
    if(typeof onlinePushPresence === 'function') onlinePushPresence();
    if(typeof onlinePushScore === 'function') onlinePushScore();
    renderDashboard();
  };
  overlay.querySelector('#pf-name-ok').addEventListener('click', submit);
  input.addEventListener('keydown', e=>{ if(e.key === 'Enter') submit(); });
  setTimeout(()=>input.focus(), 50);
}

/* ---------- เริ่มระบบหลัง SDK โหลดครบ (เรียกจาก online.js) ---------- */
function authStart(){
  Auth.sdkReady = true;
  firebase.initializeApp(FIREBASE_CONFIG);
  firebase.auth().getRedirectResult().catch(()=>{});   // เก็บผลกรณี login แบบ redirect
  firebase.auth().onAuthStateChanged(user=>{
    if(Auth.booted) return;                            // เข้าเกมไปแล้ว ไม่ทำซ้ำ
    if(user) authOnLogin(user);
    else authShowLogin();
  });
}

/* watchdog: SDK ไม่มาใน 20 วิ (เน็ตหลุด/CDN ล่ม) → หน้าประตู offline */
setTimeout(()=>{
  if(!Auth.sdkReady && !Auth.gated) authGateOffline();
}, AUTH_SDK_TIMEOUT_MS);

/* ---------- ปุ่ม "เข้าสู่ระบบด้วย Google" ---------- */
function authLoginClick(){
  const provider = new firebase.auth.GoogleAuthProvider();
  authSetStatus('connecting', 'กำลังเปิดหน้าต่างเข้าสู่ระบบ... ⏳');
  firebase.auth().signInWithPopup(provider).catch(err=>{
    if(err && err.code === 'auth/popup-blocked'){
      firebase.auth().signInWithRedirect(provider);    // เบราว์เซอร์กัน popup → ใช้ redirect แทน
      return;
    }
    authShowLogin();
    if(err && err.code === 'auth/popup-closed-by-user'){
      toast('ยังไม่ได้เข้าสู่ระบบนะ ลองใหม่อีกครั้ง 😊');
    }else{
      toast('เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้งนะ (' + (err && err.code || 'error') + ')', 2600);
    }
  });
  // สำเร็จแล้ว onAuthStateChanged จะพาเข้าเกมเอง
}

/* ---------- login สำเร็จ → โหลดเซฟ cloud มาเทียบกับเซฟในเครื่อง ---------- */
function authOnLogin(user){
  Auth.user = user;
  authSetStatus('connecting', 'กำลังโหลดเซฟจากบัญชีของหนู... ☁️');
  showScreen('screen-login');
  authFetchCloud(user.uid)
    .then(cloud=>authSyncOnLogin(cloud, user.uid))
    .catch(()=>{
      // อ่าน cloud ไม่ได้ (rules ยังไม่วาง/เน็ตสะดุด) → เข้าเกมด้วยเซฟในเครื่องไปก่อน
      toast('⚠️ เชื่อมเซฟ cloud ไม่สำเร็จ ใช้เซฟในเครื่องชั่วคราว', 2600);
      authEnterGame();
    });
}

function authSyncOnLogin(cloud, uid){
  const hasLocal = !!state.student;
  if(cloud && typeof cloud.data === 'string'){
    /* มีเซฟใน cloud: ใช้เซฟเครื่องต่อเมื่อเป็นของบัญชีเดียวกันและใหม่กว่าเท่านั้น
       (กรณีปกติ: เครื่องเดิมเล่นต่อ cache ใหม่กว่า cloud เล็กน้อย — ไม่ต้องโหลดทับ) */
    const cloudAt  = typeof cloud.at === 'number' ? cloud.at : 0;
    const useLocal = hasLocal && state.ownerUid === uid && (state.savedAt || 0) >= cloudAt;
    if(!useLocal){
      try{
        localStorage.setItem(STORAGE_KEY, cloud.data);
        state = loadState();                       // ผ่าน migration ตามปกติ เซฟรุ่นเก่าก็ปลอดภัย
      }catch(e){ /* เซฟ cloud เสีย → ใช้ของเครื่องต่อ */ }
    }
    state.ownerUid = uid;
    saveState();
    authPushSave(true);
    authEnterGame();
  }else if(hasLocal && !state.ownerUid){
    authAskLink(uid);                              // เซฟเก่ายังไม่ผูกบัญชี → ถามผูก
  }else if(hasLocal && state.ownerUid === uid){
    saveState();                                   // เซฟเราเองแต่ cloud หาย (เช่นเพิ่งวาง rules) → ส่งขึ้นใหม่
    authPushSave(true);
    authEnterGame();
  }else{
    authFreshStart(uid);                           // ไม่มีเซฟ / เซฟในเครื่องเป็นของบัญชีอื่น → เริ่มใหม่
  }
}

/* เริ่มเซฟใหม่ของบัญชีนี้ (ล้าง cache เครื่อง — เซฟของบัญชีอื่นอยู่ใน cloud ของเขาแล้ว) */
function authFreshStart(uid){
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  state.ownerUid = uid;
  saveState();
  authEnterGame();
}

/* ---------- กล่องถามผูกเซฟเก่าเข้าบัญชี (login ครั้งแรกของผู้เล่นเดิม) ---------- */
function authAskLink(uid){
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  document.body.appendChild(overlay);

  const step1 = ()=>{
    overlay.innerHTML = `<div class="levelup-box">
      <div class="lv-emoji">💾</div>
      <h2>พบเซฟเดิมในเครื่องนี้</h2>
      <p style="font-size:15.5px;margin:6px 0">
        ${state.student.first} · 🪙 ${fmtNum(Math.round(state.coins))} · สัตว์เลี้ยง ${state.pets.length} ตัว
      </p>
      <p style="font-size:14px;color:#8a7aa0;margin:0 0 4px">
        ผูกเซฟนี้เข้าบัญชี Google ของหนูไหม?<br>ผูกแล้วเปิดเครื่องไหนก็เล่นต่อได้ ☁️
      </p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap">
        <button class="cf-no" style="background:#b8a8cc;box-shadow:0 4px 0 #96859f">ไม่ผูก เริ่มใหม่</button>
        <button class="cf-ok">ผูกเซฟนี้เลย ✅</button>
      </div>
    </div>`;
    overlay.querySelector('.cf-ok').addEventListener('click', ()=>{
      overlay.remove();
      state.ownerUid = uid;
      saveState();
      authPushSave(true);
      toast('☁️ ผูกเซฟเข้าบัญชีเรียบร้อย!');
      authEnterGame();
    });
    overlay.querySelector('.cf-no').addEventListener('click', step2);
  };
  const step2 = ()=>{   // ยืนยันซ้ำก่อนลบ (กันเด็กกดพลาด — เซฟเดิมหายถาวร)
    overlay.innerHTML = `<div class="levelup-box">
      <div class="lv-emoji">🗑️</div>
      <h2>แน่ใจนะ?</h2>
      <p style="font-size:15px">เซฟเดิม (${state.student.first} · 🪙 ${fmtNum(Math.round(state.coins))})<br>จะถูกลบ<b>ถาวร</b> เอากลับมาไม่ได้แล้วนะ</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap">
        <button class="cf-ok">กลับไปผูกเซฟ</button>
        <button class="cf-no" style="background:#e57373;box-shadow:0 4px 0 #b23b3b">ลบแล้วเริ่มใหม่</button>
      </div>
    </div>`;
    overlay.querySelector('.cf-ok').addEventListener('click', step1);
    overlay.querySelector('.cf-no').addEventListener('click', ()=>{
      overlay.remove();
      authFreshStart(uid);
    });
  };
  step1();
}

/* ---------- เข้าเกมจริง (จุดเดียว) + เริ่มวงจร push เซฟ ---------- */
function authEnterGame(){
  if(Auth.booted) return;
  Auth.booted = true;
  onlineStart();                                   // เพื่อนออนไลน์ + leaderboard (ใน online.js)
  bootGame();                                      // careTick + เข้าหน้า ลงทะเบียน/dashboard (ใน main.js)
  authPushProfile();                               // sync ชื่อในเกมขึ้น profile ทุก login (กันโหนดหาย/เซฟย้ายเครื่อง)
  setInterval(()=>authPushSave(false), AUTH_PUSH_MS);
  window.addEventListener('beforeunload', ()=>authPushSave(false));
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'hidden') authPushSave(false);
  });
}

/* ---------- push เซฟทั้งก้อนขึ้น cloud (เฉพาะตอนเซฟขยับ / force) ---------- */
function authPushSave(force){
  if(!Auth.user) return;
  if(!state.student) return;                       // ยังไม่ลงทะเบียน — ไม่มีอะไรให้เซฟ
  if(!force && state.savedAt === Auth.lastPushedAt) return;
  const at = state.savedAt || Date.now();
  authWriteCloud(Auth.user.uid, {data: JSON.stringify(state), at})
    .then(()=>{ Auth.lastPushedAt = at; })
    .catch(()=>{});                                // เน็ตสะดุด → รอบหน้าลองใหม่เอง
}

/* ---------- ออกจากระบบ: push เซฟรอบสุดท้าย → signOut → ล้าง cache → reload ---------- */
function authLogout(){
  askConfirm(`<h2>🚪 ออกจากระบบ?</h2>
    <p style="font-size:15px">เซฟของหนูเก็บไว้ในบัญชี Google เรียบร้อย ☁️<br>เข้าสู่ระบบใหม่เมื่อไหร่ก็เล่นต่อได้เลย</p>`,
    'ออกจากระบบ', ()=>{
      let done = false;
      const finish = ()=>{
        if(done) return;
        done = true;
        try{ if(Online.ready) Online.db.ref('presence/' + onlineKey()).remove(); }catch(e){}
        firebase.auth().signOut().catch(()=>{}).then(()=>{
          localStorage.removeItem(STORAGE_KEY);    // เครื่องโรงเรียนใช้ร่วมกัน — ไม่ทิ้งเซฟไว้
          location.reload();
        });
      };
      if(Auth.user && state.student){
        saveState();
        authWriteCloud(Auth.user.uid, {data: JSON.stringify(state), at: state.savedAt})
          .then(finish, finish);
        setTimeout(finish, 3000);                  // กันเน็ตค้างแล้วออกไม่ได้
      }else finish();
    });
}
