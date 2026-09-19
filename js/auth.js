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
  loginInFlight:false,// กันแตะปุ่ม Google ซ้ำระหว่างกำลังเปิด popup/redirect
  loginUid:null,      // กัน onAuthStateChanged ซ้ำจนโหลด cloud save ซ้อนกัน
};

const AUTH_PUSH_MS        = 60*1000;   // push เซฟขึ้น cloud ทุก 1 นาที
const AUTH_SDK_TIMEOUT_MS = 20*1000;   // รอ SDK นานสุดก่อนถือว่าออฟไลน์
const AUTH_CLOUD_SLOW_MS  = 6*1000;    // นานกว่านี้ต้องมีทางออกให้ผู้เล่น ไม่ปล่อยหน้าค้างเงียบ
const AUTH_CLOUD_TIMEOUT_MS = 12*1000; // RTDB get() อาจค้างไม่ resolve/reject เมื่อการเชื่อมต่อครึ่งหลุด

/* ☁️🔒 Vocab Sky Playground — Private Beta
   แยกจากสิทธิ์ผู้ทดสอบ/ครู/ชื่อ Admin โดยตั้งใจ: รายชื่อนี้ให้สิทธิ์เข้า Sky เท่านั้น
   เปิดสาธารณะภายหลังได้ด้วยการเปลี่ยน SKY_BETA_OPEN เป็น true จุดเดียว */
const SKY_BETA_OPEN = false;
const SKY_BETA_EMAILS = new Set([
  'freddommun@gmail.com',
  'sumpajitshami@gmail.com',
  'parkerhulk2020@gmail.com',
]);
function skyBetaEmail(raw){
  return String(raw || '').trim().toLowerCase();
}
function canAccessSkyBeta(user=Auth.user){
  return SKY_BETA_OPEN || !!(user && SKY_BETA_EMAILS.has(skyBetaEmail(user.email)));
}

/* 🛡️ รอบ 1142: ชื่อผู้ดูแลระบบสงวนไว้ให้ 3 บัญชีนี้เท่านั้น
   normalize + ตัดช่องว่าง/zero-width เพื่อกันชื่อเลียนแบบ เช่น "A d m i n" */
const ADMIN_NAME_EMAILS = new Set([
  'freddommun@gmail.com',
  'sumpajitshami@gmail.com',
  'parkerhulk2020@gmail.com',
]);
function adminReservedNameKey(raw){
  return String(raw || '').normalize('NFKC')
    .replace(/[\s\u200B-\u200D\uFEFF]+/g, '')
    .toLocaleLowerCase('th-TH');
}
function isReservedAdminName(raw){
  const key = adminReservedNameKey(raw);
  return key === 'admin' || key === 'แอดมิน';
}
function canUseReservedAdminName(){
  const email = Auth.user && Auth.user.email
    ? String(Auth.user.email).trim().toLowerCase() : '';
  return ADMIN_NAME_EMAILS.has(email);
}
/* 🏝️ Round 1379: Kart is public; retain the old capability name for cached callers. */
function canAccessKartBeta(){
  return true;
}
function isAdmin(){
  return canUseReservedAdminName();
}
function checkProfileName(raw, min=2, max=20){
  if(isReservedAdminName(raw) && !canUseReservedAdminName()){
    return {ok:false, msg:'ชื่อ Admin และ แอดมิน สงวนไว้สำหรับบัญชีผู้ดูแลระบบเท่านั้น'};
  }
  return checkName(raw, min, max);
}

/* ---------- บัญชีครู (รอบ 43+: ปุ่มคุมห้องในโลก 3D เช่น ปิดเสียงทั้งห้อง) ----------
   เพิ่มอีเมลครูต่อท้าย array ได้เลย (ตัวพิมพ์เล็ก) — บัญชีอื่นไม่เห็นปุ่มครู */
const TEACHER_EMAILS = ['freddommun@gmail.com'];
function isTeacher(){
  return !!(Auth.user && Auth.user.email
    && TEACHER_EMAILS.includes(String(Auth.user.email).toLowerCase()));
}
function syncAdminAccess(){
  const allowed=isAdmin();
  if(state.adminAccess!==allowed){state.adminAccess=allowed;saveState();}
  if(typeof LetterCannon!=='undefined'&&LetterCannon.refreshLock)LetterCannon.refreshLock();
  if(typeof refreshWordShipLock==='function')refreshWordShipLock();
  if(typeof refreshSkirmishLock==='function')refreshSkirmishLock();
  if(typeof refreshVocabForceLock==='function')refreshVocabForceLock();
  if(typeof refreshMechaLock==='function')refreshMechaLock();
  if(typeof HomeTheme!=='undefined' && HomeTheme && typeof HomeTheme.paint==='function') HomeTheme.paint();
}

/* ---------- บัญชีผู้ทดสอบเกม (รอบ 56 + 59) ----------
   สิทธิ์: (1) เหรียญต่ำกว่าเพดาน → เติมให้อัตโนมัติ
   (2) เปิดสิทธิ์ทดสอบทุกระดับชั้นและโลก Coming soon
   สัตว์ทุกตัวต้องเติบโตตาม EXP จริงเหมือนผู้เล่นทั่วไป — ห้ามเร่งวัยหลังซื้อ
   เพิ่มผู้ทดสอบ: เติมอีเมลต่อท้าย array (ตัวพิมพ์เล็ก) */
/* 🧪 รอบ 1070 (ผู้ใช้สั่ง 7 ส.ค. 2026): เติมเหรียญเป็น 10,000,000 วันละครั้ง ทั้ง 2 บัญชี
   + ฝัง testerAccess ในเซฟ เพื่อให้ Lobby เมือง 3D (standalone ไม่มี Firebase Auth) รู้สิทธิ์บัญชีจริง */
const TESTER_EMAILS = ['sumpajitshami@gmail.com', 'freddommun@gmail.com'];
const TESTER_COINS  = 10000000;
const TESTER_PET_GROWTH_FIX_VERSION = 1;
function isTester(){
  return !!(Auth.user && Auth.user.email
    && TESTER_EMAILS.includes(String(Auth.user.email).toLowerCase()));
}
/* 🧪 บัญชีทดสอบไม่เกี่ยวข้องกับอันดับสาธารณะ — เช็กทั้งบัญชีตัวเอง (อีเมลจริง)
   และชื่อในแถวเก่าบน DB เพื่อให้เครื่องผู้เล่นอื่นซ่อนข้อมูลที่เคยส่งไว้ก่อนอัปเดตนี้ด้วย */
const RANK_EXCLUDED_TESTER_NAMES = new Set(['ครูรุต', 'sumpajit', 'sumpajitshami', 'สัมปจิตฉามิ']);
function rankUserExcluded(uid, name){
  if(Auth.user && uid === Auth.user.uid && isTester()) return true;
  const raw = (typeof splitNameBadges === 'function') ? splitNameBadges(name).name : String(name || '');
  const key = String(raw || '').normalize('NFC').replace(/\s+/g, '').toLocaleLowerCase('th-TH');
  return RANK_EXCLUDED_TESTER_NAMES.has(key);
}
function testerBoost(){
  if(!isTester()) return;
  const got = [];
  // ผูก marker กับทั้งวัน+ยอดเป้าหมาย → รอบที่เพิ่มวงเงินมีผลทันที แม้วันนี้เคยรับยอดเก่าแล้ว
  const grant = thDayKey() + ':' + TESTER_COINS;       // 🇹🇭 รอบ 988: วันไทย
  if(state.coins < TESTER_COINS && state.testerCoinDay !== grant){
    state.testerCoinDay = grant;
    addCoins(TESTER_COINS - state.coins);
    got.push(`เติมเหรียญเป็น ${fmtNum(TESTER_COINS)} 🪙 (รอบวันนี้)`);
  }
  if(state.testerAccess !== true){
    state.testerAccess = true;
    got.push('เปิดสิทธิ์ทดสอบทุกระดับชั้นและโลก Coming soon');
  }
  /* รอบ 1372: booster รุ่นเก่าตั้งสัตว์ทุกตัวเป็น Lv.3/EXP 0 แบบไม่มี marker รายตัว
     คืนเฉพาะลายเซ็นนั้นให้เริ่ม Lv.1 หนึ่งครั้ง แล้วปล่อยให้ EXP เป็นผู้กำหนดวัยตามปกติ */
  if(state.testerPetGrowthFixVersion !== TESTER_PET_GROWTH_FIX_VERSION){
    const restored = [];
    (state.pets || []).forEach(p=>{
      if(Number(p.level) !== 3 || Number(p.exp || 0) !== 0) return;
      p.level = 1;
      p.exp = 0;
      restored.push(p.name || PETS[p.type]?.name || 'น้อง');
    });
    state.testerPetGrowthFixVersion = TESTER_PET_GROWTH_FIX_VERSION;
    got.push(restored.length ? `คืนวัยแรกเกิดให้ ${restored.join(', ')}` : 'เปิดการเติบโตตาม EXP จริง');
  }
  if(!got.length) return;
  saveState();
  if(typeof renderDashboard === 'function') renderDashboard();
  if(typeof onlinePushScore === 'function') onlinePushScore();
  if(typeof authPushSave === 'function') authPushSave(true);
  setTimeout(()=>toast(`🧪 บัญชีผู้ทดสอบเกม — ${got.join(' · ')}`), 900);
}

/* ---------- หน้าจอ login: สลับสถานะ เชื่อมต่อ/พร้อม/ออฟไลน์ ---------- */
function authSetStatus(mode, msg){
  const st    = document.getElementById('login-status');
  const btn   = document.getElementById('btn-google-login');
  const retry = document.getElementById('btn-login-retry');
  if(!st) return;
  st.textContent = msg || '';
  btn.style.display   = mode === 'ready'   ? '' : 'none';
  retry.style.display = (mode === 'offline' || mode === 'cloud-wait' || mode === 'cloud-error') ? '' : 'none';
  retry.textContent = mode === 'offline' ? '🔄 ลองใหม่อีกครั้ง' : '🔄 รีเฟรชเกมแล้วลองใหม่';
  // รอบ 267: ต่อเน็ตไม่ได้ → เปิดทางเล่นออฟไลน์ (เซฟอยู่ในเครื่อง เน็ตกลับมาค่อย sync)
  const off = document.getElementById('btn-offline-play');
  if(off){
    const localSafe = mode === 'cloud-error' && authLocalSaveSafe(Auth.user && Auth.user.uid);
    off.style.display = (mode === 'offline' || localSafe) ? '' : 'none';
    off.textContent = localSafe ? '📴 ใช้เซฟในเครื่องไปก่อน' : '📴 เล่นแบบออฟไลน์ไปก่อน';
  }
}
function authLocalSaveSafe(uid){
  return !!(uid && state && state.student && state.ownerUid === uid);
}
function authShowLogin(){
  authSetStatus('ready', arguments[0] || 'เข้าสู่ระบบเพื่อเริ่มผจญภัยเลย! 👇');
  showScreen('screen-login');
}
function authGateOffline(msg){
  Auth.gated = true;
  authSetStatus('offline', msg || 'ต่ออินเทอร์เน็ตไม่ได้ 📶 เช็กเน็ตแล้วกดลองใหม่นะ');
  showScreen('screen-login');
}

/* ---------- จุดคุยกับ DB (แยกเป็นฟังก์ชันเล็กๆ ให้ mock ทดสอบง่าย) ---------- */
function authSaveRef(uid){ return firebase.database().ref('users/' + uid + '/save'); }
function authFetchCloud(uid){
  const read = authSaveRef(uid).get().then(s=>s.val());
  return new Promise((resolve, reject)=>{
    let done = false;
    const timer = setTimeout(()=>{
      if(done) return;
      done = true;
      const err = new Error('Cloud save read timed out');
      err.code = 'cloud/timeout';
      reject(err);
    }, AUTH_CLOUD_TIMEOUT_MS);
    read.then(value=>{
      if(done) return;
      done = true; clearTimeout(timer); resolve(value);
    }, err=>{
      if(done) return;
      done = true; clearTimeout(timer); reject(err);
    });
  });
}
// Serialize cloud saves; stale snapshots cannot erase server-confirmed Arena credits.
let authCloudWriteQueue=Promise.resolve();
function authWriteCloud(uid,payload){
 const write=()=>authSaveRef(uid).transaction(current=>{
  if(!current?.data||!payload?.data)return payload;
  let remote,local;try{remote=JSON.parse(current.data);local=JSON.parse(payload.data);}catch{return payload;}
  const latest=remote.arenaRaceReceipts;
  if(!latest)return payload;
  const receipts=local.arenaRaceReceipts||{};let delta=0;
  for(const [key,total]of Object.entries(latest))if(Number.isSafeInteger(total)&&total>(receipts[key]||0)){delta+=total-(receipts[key]||0);receipts[key]=total;}
  if(delta){local.coins=(Number(local.coins)||0)+delta;local.lifetimeCoins=(Number(local.lifetimeCoins)||0)+delta;const day=new Date(Date.now()+7*3600000).toISOString().slice(0,10);if(local.daily?.date!==day)local.daily={date:day,coins:0};local.daily.coins=(Number(local.daily.coins)||0)+delta;}
  local.arenaRaceReceipts=receipts;return {...payload,data:JSON.stringify(local)};
 },undefined,false).then(r=>{if(!r.committed)throw Error('cloud/save_failed');});
 authCloudWriteQueue=authCloudWriteQueue.catch(()=>{}).then(write);return authCloudWriteQueue;
}
function authDeleteCloud(uid){ return authSaveRef(uid).remove(); }
function authWriteProfileName(uid, name){
  return firebase.database().ref('users/' + uid + '/profile/name').set(name);
}

/* ---------- ชื่อในเกม (ข้อ 0.2) → /users/<uid>/profile/name ----------
   สำเนาสาธารณะฝั่ง DB (rules validate ความยาว 2–20 ซ้ำอีกชั้น) —
   ข้อ 0.3 จะใช้ค้นหาเพื่อน · เรียกซ้ำได้ ปลอดภัย (เขียนค่าเดิมทับ) */
function authPushProfile(){
  if(!Auth.user || !state.profileName || !checkProfileName(state.profileName).ok) return;
  try{
    authWriteProfileName(Auth.user.uid, state.profileName).catch(()=>{});
  }catch(e){ /* SDK ยังไม่พร้อม — รอบหน้าค่อยส่ง */ }
}

/* บันทึกชื่อในเกม + อัปเดตทุกที่ที่ชื่อโชว์ (จุดเดียว — ใช้ทั้งตั้งครั้งแรก/แก้ชื่อ) */
function authApplyProfileName(name){
  const checked = checkProfileName(name);
  if(!checked.ok){
    sfx.wrong();
    toast(checked.msg, 3200);
    return false;
  }
  name = checked.name;
  state.profileName = name;
  saveState();
  authPushProfile();
  authPushSave(true);
  // อัปเดตชื่อบน presence/leaderboard ทันที (lastCoins = null บังคับเขียนกระดานใหม่)
  if(typeof Online !== 'undefined') Online.lastCoins = null;
  if(typeof onlinePushPresence === 'function') onlinePushPresence();
  if(typeof onlinePushScore === 'function') onlinePushScore();
  sfx.levelup();
  toast(`📛 ชื่อในเกมของหนูคือ "${name}" 🎉`);
  renderDashboard();
  window.dispatchEvent(new Event('vw2-profile-name-changed'));
  return true;
}

/* ผู้เล่นเดิมที่เคยใช้ชื่อสงวนก่อนอัปเดต: ล้างชื่อสาธารณะและบังคับตั้งใหม่เมื่อเข้าเกม */
function authEnsureProfileName(){
  if(!state.profileName){ authAskProfileName(); return false; }
  if(!isReservedAdminName(state.profileName) || canUseReservedAdminName()) return true;
  state.profileName = null;
  saveState();
  try{
    if(Auth.user) authWriteProfileName(Auth.user.uid, null).catch(()=>{});
  }catch(e){ /* SDK ยังไม่พร้อม — เซฟรอบถัดไปยังคงไม่ส่งชื่อสงวน */ }
  authPushSave(true);
  if(typeof Online !== 'undefined') Online.lastCoins = null;
  if(typeof onlinePushPresence === 'function') onlinePushPresence();
  if(typeof onlinePushScore === 'function') onlinePushScore();
  authAskProfileName(true);
  return false;
}

/* ---------- กล่องบังคับตั้งชื่อในเกม (ผู้เล่นเดิมที่เซฟยังไม่มีชื่อ — ข้อ 0.2)
   ปิดข้ามไม่ได้: ชื่อนี้ใช้โชว์บน presence/leaderboard แทนชื่อจริง ---------- */
function authAskProfileName(reservedReset=false){
  askNameDialog({
    emoji:'📛', title:'ตั้งชื่อในเกมกันเถอะ!',
    desc:(reservedReset
      ? '<b>ชื่อ Admin/แอดมินใช้ได้เฉพาะบัญชีผู้ดูแลระบบ จึงต้องเปลี่ยนชื่อก่อนเล่นต่อนะ</b><br>'
      : '') + 'ชื่อนี้คือชื่อที่เพื่อนๆ ทั้งเกมจะเห็น (ไทย/อังกฤษ 2–20 ตัว)<br>ไม่ต้องใช้ชื่อ-นามสกุลจริงก็ได้นะ 😊',
    placeholder:'เช่น น้องบีม, Beam123', min:2, max:20,
    validate:checkProfileName,
    okText:'ใช้ชื่อนี้เลย ✅',
    onOk:authApplyProfileName,
  });
}

/* ---------- ปุ่ม ✏️ แก้ชื่อในเกมภายหลัง (แถบโปรไฟล์บน Lobby) ---------- */
function authEditProfileName(){
  askNameDialog({
    emoji:'✏️', title:'เปลี่ยนชื่อในเกม',
    desc:'ชื่อใหม่จะไปโชว์บนการ์ดเพื่อนและกระดานอันดับทันที (ไทย/อังกฤษ 2–20 ตัว)',
    placeholder:'เช่น น้องบีม, Beam123', value:state.profileName || '', min:2, max:20,
    validate:checkProfileName,
    okText:'เปลี่ยนชื่อ ✅', cancelText:'ยกเลิก',
    onOk:authApplyProfileName,
  });
}

/* ---------- เริ่มระบบหลัง SDK โหลดครบ (เรียกจาก online.js) ---------- */
function authStart(){
  if(Auth.sdkReady) return;                         // SDK/observer ต้องเริ่มเพียงครั้งเดียว
  Auth.sdkReady = true;
  AuthDebug.add('authStart', 'initializing Firebase Auth');
  firebase.initializeApp(FIREBASE_CONFIG);
  firebase.auth().getRedirectResult()
    .then(result=>{ AuthDebug.add('getRedirectResult', 'resolved'); if(typeof accountDeletionHandleRedirectResult==='function') accountDeletionHandleRedirectResult(result, null); })
    .catch(error=>{ AuthDebug.authError('getRedirectResult rejected', error); if(typeof accountDeletionHandleRedirectResult==='function') accountDeletionHandleRedirectResult(null, error); });
  firebase.auth().onAuthStateChanged(user=>{
    AuthDebug.add('onAuthStateChanged result', user ? 'signed-in user received' : 'no signed-in user');
    if(Auth.booted){                                   // เข้าเกมไปแล้ว (รวมโหมดออฟไลน์)
      if(user) authLateSync(user);                     // SDK เพิ่งมาหลังเล่นออฟไลน์ → sync ย้อนหลัง
      return;
    }
    if(user) authOnLogin(user);
    else authShowLogin();
  });
}

/* watchdog: SDK ไม่มาใน 20 วิ (เน็ตหลุด/CDN ล่ม) → หน้าประตู offline */
setTimeout(()=>{
  if(!Auth.sdkReady && !Auth.gated) authGateOffline();
}, AUTH_SDK_TIMEOUT_MS);
/* รอบ 267: เปิดแอพตอนไม่มีเน็ตเลย → ไม่ต้องรอ 20 วิ เปิดประตูออฟไลน์ทันที */
window.addEventListener('load', ()=>{
  setTimeout(()=>{
    if(!navigator.onLine && !Auth.sdkReady && !Auth.booted && !Auth.gated)
      authGateOffline('ยังไม่มีอินเทอร์เน็ต 📶 เล่นแบบออฟไลน์ไปก่อนได้เลย');
  }, 700);
});

/* ---------- เข้าเกมแบบออฟไลน์ (รอบ 267): เล่นด้วยเซฟในเครื่อง ไม่ต้อง login ----------
   เน็ตกลับมาเมื่อไหร่ → โหลด SDK ใหม่ → onAuthStateChanged เรียก authLateSync
   ดันเซฟ + คะแนนขึ้น server ให้เอง (บัญชี Google จำไว้ในเครื่องจากการ login ครั้งก่อน) */
/* ป้าย "📴 ออฟไลน์ · ยังไม่ sync" บนหัว lobby (รอบ 268) — โชว์เฉพาะตอนเล่นออฟไลน์และยังไม่ได้ sync */
function updateOfflinePill(){
  const pill = document.getElementById('offline-pill');
  if(pill) pill.style.display = (Auth.offlineMode && !Auth.user) ? '' : 'none';
}

function authEnterOffline(){
  if(Auth.booted) return;
  Auth.booted = true;
  Auth.offlineMode = true;
  bootGame();
  updateOfflinePill();
  setInterval(()=>authPushSave(false), AUTH_PUSH_MS);      // เริ่มมีผลจริงหลัง authLateSync (ต้องมี Auth.user)
  const retry = ()=>{
    if(!Auth.sdkReady && navigator.onLine && typeof onlineLoadSDK === 'function') onlineLoadSDK();
  };
  window.addEventListener('online', ()=>setTimeout(retry, 1500));
  setInterval(retry, 60*1000);
  setTimeout(()=>toast('📴 เล่นแบบออฟไลน์ — ต่อเน็ตเมื่อไหร่ คะแนนจะขึ้นเซิร์ฟเวอร์ให้เอง', 3000), 700);
}

/* เน็ตกลับมาหลังเล่นออฟไลน์: บัญชีที่เครื่องจำไว้กลับมา → ดันเซฟในเครื่องขึ้น cloud + เปิดระบบออนไลน์
   (เซฟในเครื่องคือเซสชันที่กำลังเล่น = ใหม่สุดเสมอ ไม่ดึง cloud มาทับ) */
function authLateSync(user){
  if(Auth.user) return;                                    // มีบัญชีอยู่แล้ว — ไม่ทำซ้ำ
  if(state.ownerUid && state.ownerUid !== user.uid){       // เซฟเครื่องเป็นของอีกบัญชี — ห้ามเขียนทับ cloud เขา
    toast('⚠️ เซฟในเครื่องเป็นของอีกบัญชี — คะแนนไม่ถูก sync (เข้าสู่ระบบใหม่ตอนเปิดเกมครั้งหน้านะ)', 3200);
    return;
  }
  Auth.user = user;
  if(!state.ownerUid && state.student){ state.ownerUid = user.uid; saveState(); }
  authPushSave(true);
  authPushProfile();
  try{ if(typeof onlineStart === 'function') onlineStart(); }catch(e){}
  updateOfflinePill();                                     // sync แล้ว → เก็บป้าย 📴
  toast('☁️ กลับมาออนไลน์แล้ว — เซฟ + คะแนนขึ้นเซิร์ฟเวอร์เรียบร้อย!', 2800);
}

/* ---------- ปุ่ม "เข้าสู่ระบบด้วย Google" ---------- */
/* 📱 อยู่ในแอปที่ติดตั้งแล้วไหม (TWA จาก Play Store / PWA ที่ Add to Home screen)
   ที่นั่น popup มักเปิดไม่ได้ → ใช้ signInWithRedirect ตรงๆ ปลอดภัยกว่า
   ⚠️ เช็คเฉพาะ standalone + referrer android-app:// เท่านั้น ห้ามเช็ค display-mode:fullscreen
      เพราะเกมสั่งเต็มจอเองผ่าน Fullscreen API ในเบราว์เซอร์ปกติด้วย (จะเข้าใจผิดว่าเป็นแอป) */
function authIsAppMode(){
  try{
    if((document.referrer || '').indexOf('android-app://') === 0) return true;   // TWA บน Play Store
    if(navigator.standalone === true) return true;                               // iOS home screen
    return window.matchMedia('(display-mode: standalone)').matches;
  }catch(e){ return false; }
}
/* preview บนเครื่อง/LAN ไม่มี Firebase auth handler ของ origin ตัวเอง:
   ใช้ popup เท่านั้น เพื่อไม่ redirect ไป vocabworld.web.app/__/auth/handler */
function authIsLocalLanPreviewHost(hostname){
  const host = String(hostname == null ? location.hostname : hostname).trim().toLowerCase();
  if(host === 'localhost' || host === '127.0.0.1') return true;
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if(!match) return false;
  const octets = match.slice(1).map(Number);
  if(octets.some(n=>n > 255)) return false;
  return octets[0] === 10 || octets[0] === 127 ||
    (octets[0] === 192 && octets[1] === 168) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31);
}

/* TEMP local/LAN only: mobile auth diagnostics. Remove after the blank-page investigation. */
const AuthDebug = (()=>{
  const enabled = authIsLocalLanPreviewHost();
  const lines = [];
  let panel = null;
  let output = null;
  const safe = value=>String(value == null ? '' : value)
    .replace(/([?&#](?:access_?token|id_?token|token|password|secret|api_?key|code)=)[^&#\s]*/gi, '$1[redacted]')
    .replace(/\bBearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [redacted]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email-redacted]');
  const context = ()=>[
    'href: ' + safe(location.href),
    'host: ' + safe(location.hostname) + ' · origin: ' + safe(location.origin),
    'local/LAN detected: ' + enabled,
  ].join('\n');
  const render = ()=>{
    if(!output) return;
    output.textContent = context() + '\n--- latest ' + lines.length + ' event(s) ---\n' + lines.join('\n');
  };
  const add = (event, detail)=>{
    if(!enabled) return;
    const now = new Date().toLocaleTimeString();
    lines.push('[' + now + '] ' + safe(event) + (detail ? ' — ' + safe(detail) : ''));
    if(lines.length > 20) lines.splice(0, lines.length - 20);
    render();
  };
  const authError = (event, error)=>{
    const code = error && error.code ? error.code : 'no-code';
    const message = error && error.message ? error.message : String(error || 'unknown error');
    add(event, 'code=' + code + ' · message=' + message);
  };
  const mount = ()=>{
    if(!enabled || panel || !document.body) return;
    panel = document.createElement('section');
    panel.id = 'auth-local-debug-overlay';
    panel.setAttribute('aria-label', 'Local auth diagnostic log');
    panel.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;max-height:46vh;padding:6px 8px;background:#101820;color:#d8f6ff;border-bottom:2px solid #24b7d9;font:11px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;box-shadow:0 2px 9px #000b;pointer-events:auto';
    const bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;color:#7ee8ff;font-weight:700';
    bar.textContent = 'LOCAL/LAN AUTH DEBUG · temporary';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'COPY LOG';
    copy.style.cssText = 'border:1px solid #7ee8ff;border-radius:4px;background:#173340;color:#fff;padding:3px 7px;font:inherit;font-weight:700';
    copy.addEventListener('click', ()=>{
      const text = context() + '\n' + lines.join('\n');
      const done = ()=>add('copy log', 'copied sanitized log');
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, ()=>add('copy log', 'clipboard unavailable'));
      else add('copy log', 'clipboard unavailable');
    });
    bar.appendChild(copy);
    output = document.createElement('pre');
    output.style.cssText = 'margin:0;max-height:34vh;overflow:auto;white-space:pre-wrap;word-break:break-word;color:inherit';
    panel.append(bar, output);
    document.body.appendChild(panel);
    render();
  };
  if(enabled){
    const previousOnError = window.onerror;
    window.onerror = function(message, source, line, column, error){
      authError('window.onerror', error || {message:String(message) + ' @' + safe(source) + ':' + line + ':' + column});
      if(typeof previousOnError === 'function') return previousOnError.apply(this, arguments);
      return false;
    };
    window.addEventListener('unhandledrejection', event=>authError('unhandledrejection', event.reason));
    window.addEventListener('error', event=>{
      if(event.target && event.target !== window) add('resource error', event.target.src || event.target.href || event.target.tagName || 'unknown resource');
    }, true);
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
    else mount();
    add('debug overlay ready', 'diagnostics active for local/LAN only');
  }
  return {enabled, add, authError};
})();
/* error code ที่แปลว่า "popup ใช้ไม่ได้ในสภาพแวดล้อมนี้" → production redirect แทน */
const AUTH_REDIRECT_CODES = ['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment',
                             'auth/web-storage-unsupported', 'auth/cancelled-popup-request'];
const AUTH_POPUP_CANCEL_CODES = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];
function authLoginClick(){
  AuthDebug.add('before login', 'login button pressed');
  if(Auth.loginInFlight) return;
  Auth.loginInFlight = true;
  const provider = new firebase.auth.GoogleAuthProvider();
  authSetStatus('connecting', 'กำลังเปิดหน้าต่างเข้าสู่ระบบ... ⏳');
  const localLanPreview = authIsLocalLanPreviewHost();
  const appMode = !localLanPreview && authIsAppMode();
  AuthDebug.add('auth flow chosen', (!localLanPreview && appMode) ? 'redirect' : 'popup');
  if(!localLanPreview && appMode){ firebase.auth().signInWithRedirect(provider); return; }
  AuthDebug.add('popup opened', 'signInWithPopup requested');
  firebase.auth().signInWithPopup(provider).then(()=>{
    Auth.loginInFlight = false;
    AuthDebug.add('popup resolved', 'Firebase popup promise resolved');
  }).catch(err=>{
    Auth.loginInFlight = false;
    AuthDebug.authError('popup rejected', err);
    if(!localLanPreview && err && AUTH_REDIRECT_CODES.indexOf(err.code) >= 0){
      firebase.auth().signInWithRedirect(provider);    // เบราว์เซอร์กัน popup → ใช้ redirect แทน
      return;
    }
    const code = err && err.code;
    if(localLanPreview && code === 'auth/popup-blocked'){
      authShowLogin('เบราว์เซอร์บล็อกหน้าต่าง Google — อนุญาต pop-up แล้วกดเข้าสู่ระบบอีกครั้ง');
      toast('อนุญาต pop-up สำหรับหน้านี้ แล้วลองเข้าสู่ระบบอีกครั้งนะ');
    }else if(AUTH_POPUP_CANCEL_CODES.indexOf(code) >= 0){
      authShowLogin('ยกเลิกการเข้าสู่ระบบแล้ว — กดเข้าสู่ระบบอีกครั้งได้เลย');
      toast('ยังไม่ได้เข้าสู่ระบบนะ ลองใหม่อีกครั้ง 😊');
    }else{
      authShowLogin();
      toast('เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้งนะ (' + (err && err.code || 'error') + ')', 2600);
    }
  });
  // สำเร็จแล้ว onAuthStateChanged จะพาเข้าเกมเอง
}
/* ---------- login สำเร็จ → โหลดเซฟ cloud มาเทียบกับเซฟในเครื่อง ---------- */
function authOnLogin(user){
  if(Auth.booted || Auth.loginUid === user.uid) return;
  Auth.loginUid = user.uid;
  Auth.loginInFlight = false;
  Auth.user = user;
  authSetStatus('connecting', 'กำลังโหลดเซฟจากบัญชีของหนู... ☁️');
  showScreen('screen-login');
  let cloudSettled = false;
  const slowTimer = setTimeout(()=>{
    if(cloudSettled || Auth.booted) return;
    authSetStatus('cloud-wait', 'การเชื่อมต่อใช้เวลานานกว่าปกติ — กดรีเฟรชได้โดยเซฟในเครื่องจะไม่หาย');
  }, AUTH_CLOUD_SLOW_MS);
  authFetchCloud(user.uid)
    .then(cloud=>{
      cloudSettled = true; clearTimeout(slowTimer);
      authSyncOnLogin(cloud, user.uid);
    })
    .catch(err=>{
      Auth.loginUid = null;                           // ให้ผู้ใช้ retry ได้เมื่อ cloud load ไม่สำเร็จ
      cloudSettled = true; clearTimeout(slowTimer);
      const code = String(err && (err.code || err.message) || 'unknown');
      console.warn('[auth-cloud] load failed:', code);
      const timedOut = code === 'cloud/timeout';
      const localSafe = authLocalSaveSafe(user.uid);
      const reason = timedOut ? 'Cloud ตอบช้าเกิน 12 วินาที' : 'Cloud ปฏิเสธหรือเครือข่ายขัดข้อง (' + code + ')';
      authSetStatus('cloud-error', '⚠️ ' + reason + (localSafe ? ' — รีเฟรชหรือใช้เซฟในเครื่องไปก่อนได้' : ' — กรุณารีเฟรชเพื่อลองใหม่'));
      showScreen('screen-login');
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
        ${escapeHTML(state.profileName || (state.student && state.student.first) || 'ผู้เล่น')} · 🪙 ${fmtNum(Math.round(state.coins))} · สัตว์เลี้ยง ${state.pets.length} ตัว
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
      <p style="font-size:15px">เซฟเดิม (${escapeHTML(state.profileName || (state.student && state.student.first) || 'ผู้เล่น')} · 🪙 ${fmtNum(Math.round(state.coins))})<br>จะถูกลบ<b>ถาวร</b> เอากลับมาไม่ได้แล้วนะ</p>
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
  AuthDebug.add('lobby navigation attempt', 'authEnterGame -> bootGame');
  Auth.booted = true;
  onlineStart();                                   // เพื่อนออนไลน์ + leaderboard (ใน online.js)
  bootGame();                                      // careTick + เข้าหน้า ลงทะเบียน/dashboard (ใน main.js)
syncAdminAccess();                               // admin allowlist เดิม: ป้ายล็อก Letter Cannon ใน Classic/เมือง 3D
  if(new URLSearchParams(location.search).get('vocab-force')==='1'){
    const direct=new URL(location.href);
    direct.searchParams.delete('vocab-force');
    history.replaceState(null,'',direct.pathname+direct.search+direct.hash);
    if(isAdmin() && typeof openVocabForce==='function') openVocabForce();
    else if(typeof toast==='function') toast('⚡ Vocab Force — COMING SOON');
  }  testerBoost();                                   // บัญชีผู้ทดสอบ → เติมเหรียญให้พอทดสอบโลก 3D
  authPushProfile();                               // sync ชื่อในเกมขึ้น profile ทุก login (กันโหนดหาย/เซฟย้ายเครื่อง)
  setInterval(()=>authPushSave(false), AUTH_PUSH_MS);
  window.addEventListener('beforeunload', ()=>authPushSave(false));
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'hidden') authPushSave(false);
  });
}

/* ---------- push เซฟทั้งก้อนขึ้น cloud (เฉพาะตอนเซฟขยับ / force) ---------- */
function authPushSaveAwait(force){
  if(window.ArenaRace?.saving)return Promise.resolve(false);
  if(!Auth.user || !state.student) return Promise.resolve(false);
  if(!force && state.savedAt === Auth.lastPushedAt) return Promise.resolve(true);
  const at = state.savedAt || Date.now();
  return authWriteCloud(Auth.user.uid, {data: JSON.stringify(state), at})
    .then(()=>{ Auth.lastPushedAt = at; return true; });
}
function authPushSave(force){
  authPushSaveAwait(force).catch(()=>{});           // เน็ตสะดุด → รอบหน้าลองใหม่เอง
}

/* ---------- ออกจากระบบ: push เซฟรอบสุดท้าย → signOut → ล้าง cache → reload ---------- */
function authLogout(){
  askConfirm(`<h2>🚪 ออกจากระบบ?</h2>
    <p style="font-size:15px">เซฟของหนูเก็บไว้ในบัญชี Google เรียบร้อย ☁️<br>เข้าสู่ระบบใหม่เมื่อไหร่ก็เล่นต่อได้เลย</p>`,
    'ออกจากระบบ', ()=>{
      // 🇹🇭 รอบ 1184: login ครั้งถัดไปในแท็บเดิมต้องเห็นป้าย O-NET ได้อีกครั้ง
      if(typeof onetPromoReset === 'function') onetPromoReset();
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
