"use strict";
/* ============================================================
   ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
   - เพื่อนออนไลน์จริง (presence): เห็นผู้เล่นคนอื่นที่เปิดเกมอยู่จริง
   - Leaderboard: อันดับผู้เล่นที่มีเหรียญมากที่สุด Top 50
   ------------------------------------------------------------
   หลักการ "มีก็ใช้ ไม่มีก็ไม่พัง": โหลด Firebase SDK แบบ dynamic
   ถ้าออฟไลน์/โหลดไม่สำเร็จ → Online.ready = false ตลอด
   การ์ดเพื่อนถอยไปใช้เพื่อนจำลองเดิม เกมเล่นได้ครบทุกระบบ
   ------------------------------------------------------------
   โครงข้อมูลใน DB:
   /presence/<uid>    = {n:ชื่อ, g:ชั้น, act:กำลังทำอะไร, at:เวลา}  (ลบเองเมื่อหลุด)
   /leaderboard/<uid> = {n:ชื่อ, g:ชั้น, coins:เหรียญ, at:เวลา}
   <uid> = uid บัญชี Google (เปลี่ยนจาก onlineId เดิมตอนข้อ 0.2 —
   เกมบังคับ login เสมอ · onlineId สุ่มเดิมเหลือไว้เป็น fallback กันพัง)
   ============================================================ */

const Online = {
  ready:false,      // ต่อ Firebase สำเร็จและกำลังเชื่อมต่ออยู่
  db:null,
  friends:[],       // ผู้เล่นจริงคนอื่นที่ออนไลน์: [{id,n,g,act,at}]
  board:[],         // Leaderboard Top 50 (เรียงมาก→น้อยแล้ว): [{id,n,g,coins}]
  lastCoins:null,   // เหรียญล่าสุดที่ส่งขึ้น leaderboard (กันเขียนซ้ำโดยไม่จำเป็น)
  /* ---- ระบบเพื่อน (ข้อ 0.3) ---- */
  myCode:'',        // รหัสเพื่อนของเรา (6 ตัว จาก uid — โชว์ให้เพื่อนค้นหา)
  presenceMap:{},   // uid → true ของทุกคนที่ออนไลน์สดตอนนี้ (ไว้ join สถานะเพื่อน)
  reqs:[],          // คำขอเป็นเพื่อนที่ส่งมาหาเรา: [{uid,n,g,ts}]
  myFriends:[],     // เพื่อนของเรา: [{uid,n,g,ts}]
};

const ONLINE_STALE_MS  = 10*60*1000;   // presence ค้างเกิน 10 นาที = ผีค้าง ไม่นับ
const ONLINE_BEAT_MS   = 60*1000;      // ส่งสถานะ/คะแนนทุก 1 นาที
const LEADERBOARD_SIZE = 50;

/* ชื่อที่โชว์สาธารณะ: ชื่อในเกม (ข้อ 0.2 — ผ่านตัวกรอง badwords แล้ว)
   fallback เซฟเก่าที่ยังไม่ทันตั้งชื่อ: ชื่อจริง + อักษรแรกนามสกุล (แบบเดิม) */
function onlineDisplayName(){
  if(state.profileName) return state.profileName;
  if(!state.student) return null;
  const last = (state.student.last || '').trim();
  return state.student.first + (last ? ' ' + last[0] + '.' : '');
}

/* ผู้เล่นกำลังทำอะไรอยู่ (ดูจากหน้าจอที่เปิด) — โชว์ในการ์ดเพื่อน */
function onlineActivity(){
  const map = {
    'screen-game' : 'กำลังจับคู่คำศัพท์ 🎮',
    'screen-quiz' : 'กำลังสอบคำศัพท์ 📝',
    'screen-cats' : 'กำลังอ่านหมวดคำศัพท์ 📚',
    'screen-stats': 'กำลังดูผลการเรียน 📊',
    'screen-select': 'กำลังเลือกสัตว์เลี้ยง 🐾',
  };
  for(const id in map){
    const s = document.getElementById(id);
    if(s && s.classList.contains('active')) return map[id];
  }
  return 'กำลังดูแลน้องสัตว์ 🏠';
}

/* id ประจำเครื่อง (สุ่มครั้งเดียว เก็บในเซฟ — fallback เผื่อไม่มี Auth.user เท่านั้น) */
function ensureOnlineId(){
  if(!state.onlineId){
    state.onlineId = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    saveState();
  }
  return state.onlineId;
}

/* key ประจำตัวใน /presence และ /leaderboard — ข้อ 0.2 เปลี่ยนเป็น uid บัญชี Google
   (rules ผูก auth.uid === $uid ได้ + ข้อ 0.3 ใช้ join กับรายชื่อเพื่อน) */
function onlineKey(){
  return (typeof Auth !== 'undefined' && Auth.user) ? Auth.user.uid : ensureOnlineId();
}

/* ---------- ส่งสถานะตัวเองขึ้น DB (เรียกซ้ำได้ ปลอดภัย) ---------- */
function onlinePushPresence(){
  if(!Online.ready || !state.student) return;
  Online.db.ref('presence/' + onlineKey()).set({
    n: onlineDisplayName(),
    g: state.student.grade,
    act: onlineActivity(),
    at: firebase.database.ServerValue.TIMESTAMP,
  }).catch(()=>{});
}
function onlinePushScore(){
  if(!Online.ready || !state.student) return;
  if(Online.lastCoins === state.coins) return;         // เหรียญไม่ขยับ ไม่ต้องเขียน
  Online.lastCoins = state.coins;
  Online.db.ref('leaderboard/' + onlineKey()).set({
    n: onlineDisplayName(),
    g: state.student.grade,
    coins: Math.round(state.coins),
    at: firebase.database.ServerValue.TIMESTAMP,
  }).catch(()=>{});
}

/* วาดการ์ดที่เกี่ยวข้องใหม่ เฉพาะตอนเปิดหน้า Dashboard อยู่ */
function onlineRerender(){
  const dash = document.getElementById('screen-dashboard');
  if(!dash || !dash.classList.contains('active')) return;
  if(typeof renderOnlineCard === 'function') renderOnlineCard();
  if(typeof renderLeaderboardCard === 'function') renderLeaderboardCard();
  if(typeof renderFriendPanel === 'function') renderFriendPanel();
}

/* ============================================================
   ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
   โครงข้อมูลใน DB:
   /friendCodes/<code>       = uid            (แผนที่รหัส→uid สำหรับค้นหา)
   /friendReq/<toUid>/<from> = {n,g,ts}       (คำขอที่ส่งไปหา toUid)
   /friends/<uid>/<friend>   = {n,g,ts}       (เพื่อนที่รับแล้ว เขียนทั้งสองฝั่ง)
   ============================================================ */

/* รหัสเพื่อน 6 ตัว สร้างจาก uid แบบ deterministic (uid เดิม = รหัสเดิมเสมอ)
   ใช้ตัวอักษร/เลขที่ไม่สับสน (ตัด I L O 0 1) */
const FRIEND_ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function friendCode(uid){
  let h = 5381;
  for(let i=0;i<uid.length;i++) h = (Math.imul(h, 33) ^ uid.charCodeAt(i)) >>> 0;
  let code = '';
  for(let i=0;i<6;i++){
    h = (Math.imul(h, 33) ^ (h >>> 13)) >>> 0;   // มิกซ์ใหม่ทุกตำแหน่ง กระจายทั่ว
    code += FRIEND_ALPHA[h % FRIEND_ALPHA.length];
  }
  return code;
}

/* ค้นหาผู้เล่นจากรหัสเพื่อน → {uid, n, g, self?, already?} หรือ null (ไม่พบ) */
function friendSearch(rawCode){
  const code = String(rawCode || '').toUpperCase().replace(/[^A-Z2-9]/g, '');
  if(code.length !== 6) return Promise.reject('รหัสเพื่อนต้องมี 6 ตัวนะ');
  const me = onlineKey();
  return Online.db.ref('friendCodes/' + code).get().then(s=>{
    const uid = s.val();
    if(!uid || typeof uid !== 'string') return null;
    if(uid === me) return {uid, self:true};
    // อ่านชื่อ/ชั้นจาก leaderboard (อ่านสาธารณะได้ + มีทุกคนที่เคย login)
    return Online.db.ref('leaderboard/' + uid).get().then(ls=>{
      const v = ls.val() || {};
      return {uid, n: typeof v.n === 'string' ? v.n : 'ผู้เล่น', g: v.g || '',
              already: Online.myFriends.some(f=>f.uid === uid)};
    });
  });
}

/* ส่งคำขอเป็นเพื่อนไปหา toUid */
function friendRequest(toUid){
  if(!Online.ready || !state.student) return Promise.reject('offline');
  return Online.db.ref('friendReq/' + toUid + '/' + onlineKey()).set({
    n: onlineDisplayName(), g: state.student.grade,
    ts: firebase.database.ServerValue.TIMESTAMP,
  });
}

/* รับคำขอ: เขียนเพื่อนทั้งสองฝั่ง แล้วลบคำขอออกจากกล่องเรา */
function friendAccept(fromUid){
  const me = onlineKey();
  const req = Online.reqs.find(r=>r.uid === fromUid) || {};
  const meData   = {n: onlineDisplayName(), g: state.student.grade, ts: firebase.database.ServerValue.TIMESTAMP};
  const themData = {n: req.n || 'ผู้เล่น', g: req.g || '', ts: firebase.database.ServerValue.TIMESTAMP};
  return Promise.all([
    Online.db.ref('friends/' + me + '/' + fromUid).set(themData),
    Online.db.ref('friends/' + fromUid + '/' + me).set(meData),
  ]).then(()=>Online.db.ref('friendReq/' + me + '/' + fromUid).remove());
}

/* ปฏิเสธคำขอ: ลบออกจากกล่องเราเฉยๆ */
function friendDecline(fromUid){
  return Online.db.ref('friendReq/' + onlineKey() + '/' + fromUid).remove();
}

/* ============================================================
   ระบบแชทกับเพื่อน (ข้อ 0.4)
   /chats/<pairId>/<msgId> = {f:uidผู้ส่ง, t:ข้อความ, ts:เวลา}
   pairId = uid สองตัวเรียง alphabet ต่อกันด้วย "_" (uid Google เป็น a-zA-Z0-9
   ไม่มี "_" อยู่แล้ว → แยกสมาชิกได้ชัดใน rules ด้วย $pairId.contains(auth.uid))
   เก็บ 100 ข้อความล่าสุด/คู่ (chatPrune ตัดตัวเก่าทิ้งตอนส่ง)
   ตรวจคำหยาบด้วย nameHasBadWord (badwords.js) ก่อนส่ง — ข้อความยาวได้ ≤200 ตัว
   ============================================================ */
const CHAT_MAX_LEN  = 200;   // ความยาวข้อความสูงสุด
const CHAT_KEEP      = 100;   // เก็บกี่ข้อความล่าสุด/คู่

function chatPairId(otherUid){
  return [onlineKey(), otherUid].sort().join('_');
}
function chatRef(otherUid){
  return Online.db.ref('chats/' + chatPairId(otherUid));
}

/* ฟังข้อความ 100 ตัวล่าสุด (real-time) → cb([{key,f,t,ts},...] เก่า→ใหม่)
   คืนฟังก์ชันสำหรับเลิกฟัง (เรียกตอนปิดกล่องแชท) */
function chatListen(otherUid, cb){
  const q = chatRef(otherUid).orderByKey().limitToLast(CHAT_KEEP);
  const handler = q.on('value', (snap)=>{
    const out = [];
    snap.forEach(ch=>{
      const v = ch.val();
      if(v && typeof v.t === 'string' && typeof v.f === 'string')
        out.push({key: ch.key, f: v.f, t: v.t, ts: v.ts || 0});
    });
    cb(out);
  });
  return ()=>q.off('value', handler);
}

/* ส่งข้อความ → resolve เมื่อสำเร็จ · reject(ข้อความบอกเหตุ) เมื่อไม่ผ่าน
   (ปลอดภัยสำหรับเด็ก: กรองคำหยาบชุดเดียวกับตั้งชื่อ ข้อ 0.2) */
function chatSend(otherUid, rawText){
  if(!Online.ready) return Promise.reject('ต้องต่ออินเทอร์เน็ตก่อนถึงจะแชทได้นะ 📡');
  const text = String(rawText || '').replace(/\s+/g, ' ').trim();
  if(!text) return Promise.reject('ยังไม่ได้พิมพ์ข้อความเลยนะ');
  if(text.length > CHAT_MAX_LEN) return Promise.reject(`ข้อความยาวเกินไป (ไม่เกิน ${CHAT_MAX_LEN} ตัว)`);
  if(nameHasBadWord(text)) return Promise.reject('ข้อความมีคำไม่สุภาพอยู่ พิมพ์ใหม่นะ 😊');
  const base = chatRef(otherUid);
  return base.push({
    f:  onlineKey(),
    t:  text,
    ts: firebase.database.ServerValue.TIMESTAMP,
  }).then(()=>chatPrune(base));
}

/* ตัดข้อความเก่าให้เหลือ 100 ล่าสุด (best-effort — ล้มเหลวไม่กระทบการส่ง) */
function chatPrune(base){
  return base.once('value').then(snap=>{
    const keys = [];
    snap.forEach(ch=>{ keys.push(ch.key); });
    if(keys.length > CHAT_KEEP){
      const upd = {};
      keys.slice(0, keys.length - CHAT_KEEP).forEach(k=>{ upd[k] = null; });
      return base.update(upd);
    }
  }).catch(()=>{});
}

/* ---------- เริ่มระบบหลัง login สำเร็จ (เรียกจาก authEnterGame ใน auth.js —
   initializeApp ทำแล้วใน authStart) ---------- */
function onlineStart(){
  Online.db = firebase.database();
  const id = onlineKey();
  const presRef = Online.db.ref('presence/' + id);

  // สถานะการเชื่อมต่อ: ต่อได้ → ลงทะเบียน onDisconnect (หลุดแล้วลบตัวเองออก)
  Online.db.ref('.info/connected').on('value', (snap)=>{
    const ok = snap.val() === true;
    Online.ready = ok;
    if(ok){
      presRef.onDisconnect().remove();
      onlinePushPresence();
      Online.lastCoins = null;       // ต่อใหม่ ส่งคะแนนรอบใหม่เสมอ
      onlinePushScore();
      // เผยแพร่รหัสเพื่อนของเรา (แผนที่ code→uid ให้คนอื่นค้นหาได้ — ข้อ 0.3)
      Online.myCode = friendCode(id);
      Online.db.ref('friendCodes/' + Online.myCode).set(id).catch(()=>{});
    }
    onlineRerender();
  });

  // ฟังรายชื่อคนออนไลน์ (ตัด: ข้อมูลเสีย/ผีค้างเกิน 10 นาที) + สร้างแผนที่ presence
  Online.db.ref('presence').on('value', (snap)=>{
    const now = Date.now(), out = [], pmap = {};
    snap.forEach(ch=>{
      const v = ch.val();
      if(!v || typeof v.n !== 'string') return;
      if(typeof v.at === 'number' && now - v.at > ONLINE_STALE_MS) return;
      pmap[ch.key] = true;                          // ทุกคนที่ออนไลน์สด (รวมตัวเอง) — ไว้ join เพื่อน
      if(ch.key === id) return;
      out.push({id: ch.key, n: v.n, g: v.g || '', act: v.act || 'กำลังเล่นอยู่ 🎮'});
    });
    Online.friends = out;
    Online.presenceMap = pmap;
    onlineRerender();
  });

  // ฟังคำขอเป็นเพื่อนที่ส่งมาหาเรา (ข้อ 0.3)
  Online.db.ref('friendReq/' + id).on('value', (snap)=>{
    const out = [];
    snap.forEach(ch=>{
      const v = ch.val();
      if(v && typeof v.n === 'string') out.push({uid: ch.key, n: v.n, g: v.g || '', ts: v.ts || 0});
    });
    out.sort((a,b)=>b.ts - a.ts);
    Online.reqs = out;
    onlineRerender();
  });

  // ฟังรายชื่อเพื่อนของเรา (ข้อ 0.3)
  Online.db.ref('friends/' + id).on('value', (snap)=>{
    const out = [];
    snap.forEach(ch=>{
      const v = ch.val();
      if(v && typeof v.n === 'string') out.push({uid: ch.key, n: v.n, g: v.g || '', ts: v.ts || 0});
    });
    out.sort((a,b)=>a.n.localeCompare(b.n, 'th'));
    Online.myFriends = out;
    onlineRerender();
  });

  // ฟัง Leaderboard Top 50 (RTDB ให้มาเรียงน้อย→มาก กลับด้านเป็นมาก→น้อย)
  Online.db.ref('leaderboard').orderByChild('coins').limitToLast(LEADERBOARD_SIZE).on('value', (snap)=>{
    const out = [];
    snap.forEach(ch=>{
      const v = ch.val();
      if(!v || typeof v.coins !== 'number' || typeof v.n !== 'string') return;
      out.push({id: ch.key, n: v.n, g: v.g || '', coins: v.coins});
    });
    out.sort((a,b)=>b.coins - a.coins);
    Online.board = out;
    onlineRerender();
  });

  // ส่งสถานะ + คะแนนเป็นระยะ (เหรียญไม่ขยับจะไม่เขียน leaderboard ซ้ำ)
  setInterval(()=>{ onlinePushPresence(); onlinePushScore(); }, ONLINE_BEAT_MS);
}

/* ---------- โหลด Firebase SDK แบบ dynamic (app → auth → database)
   เกมบังคับ login (ข้อ 0.1): โหลดครบ → authStart() พาเข้าระบบ login
   โหลดไม่ได้/config หาย → หน้าประตู offline ใน auth.js (เข้าเกมไม่ได้) ---------- */
(function onlineInit(){
  if(typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.databaseURL){
    setTimeout(()=>authGateOffline('ตั้งค่าระบบออนไลน์ไม่ครบ (firebase-config) แจ้งคุณครูให้ตรวจสอบนะ 🛠️'), 0);
    return;
  }
  const base = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const load = (f)=>new Promise((res, rej)=>{
    const s = document.createElement('script');
    s.src = base + f;
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  load('firebase-app-compat.js')
    .then(()=>load('firebase-auth-compat.js'))
    .then(()=>load('firebase-database-compat.js'))
    .then(()=>authStart())
    .catch(()=>authGateOffline());
})();
