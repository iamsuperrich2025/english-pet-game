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
  started:false,    // onlineStart รันแล้ว (กันรันซ้ำ — เรียกได้จาก authEnterGame/authLateSync)
  db:null,
  friends:[],       // ผู้เล่นจริงคนอื่นที่ออนไลน์: [{id,n,g,act,at}]
  board:[],         // Leaderboard Top 50 (เรียงมาก→น้อยแล้ว): [{id,n,g,coins}]
  lastScoreSig:null, // ลายเซ็น coins|av|ni ล่าสุดที่ส่งขึ้น leaderboard (กันเขียนซ้ำ)
  /* ---- ระบบเพื่อน (ข้อ 0.3) ---- */
  myCode:'',        // รหัสเพื่อนของเรา (6 ตัว จาก uid — โชว์ให้เพื่อนค้นหา)
  presenceMap:{},   // uid → true ของทุกคนที่ออนไลน์สดตอนนี้ (ไว้ join สถานะเพื่อน)
  reqs:[],          // คำขอเป็นเพื่อนที่ส่งมาหาเรา: [{uid,n,g,ts}]
  myFriends:[],     // เพื่อนของเรา: [{uid,n,g,ts}]
  chatUnread:{},    // uid เพื่อน → true ถ้ามีข้อความใหม่ที่ยังไม่ได้อ่าน (ข้อ 0.4)
  friendsHealed:{}, // uid เพื่อน → true ถ้าซ่อมฝั่งตรงข้ามให้ครบสองฝ่ายแล้วในเซสชันนี้
  /* ---- ระบบส่งของขวัญ (ข้อ 0.5) ---- */
  giftIn:[],        // ของขวัญที่มีคนส่งมาหาเรา รอกดรับ/ไม่รับ: [{from,fn,k,id,ts,key}]
  giftOut:[],       // ของขวัญที่เราส่งไป ยังรอผู้รับ (โชว์สถานะ "ยังไม่มีผู้รับ"): [{to,k,id,ts,key}]
  giftOutDone:{},   // key ของขวัญที่ประมวลผลผลลัพธ์แล้วในเซสชันนี้ (กันคืนของซ้ำจาก snapshot รัว)
  /* ---- คำเชิญเล่นโลก 3D ด้วยกัน (ส่วนลดคนละ 2,000 เมื่อเจอกันใน map) ---- */
  tinv:{},          // คำเชิญที่ส่งมาหาเรา: {fromUid:{map:'adv'|'haunt', n:ชื่อผู้ชวน, ts}}
  tinvSeen:{},      // fromUid ที่เด้ง toast ไปแล้วในเซสชันนี้ (กันเด้งซ้ำ)
  /* ---- ตลาดออนไลน์จริง (item 2) ---- */
  market:[],        // ประกาศขายทั้งเซิร์ฟเวอร์ (รวมของเรา): [{key,sid,sn,id,p,ts}]
  marketOk:false,   // true = อ่าน /market ได้ (rules โซน market publish แล้ว) → เปิดตลาดจริง
  /* ---- Follow + Feed กิจกรรม (รอบ 155) ---- */
  feed:[],          // feed รวมของคนที่เรา follow เรียงใหม่→เก่า: [{uid,n,g,c,tx,ts}]
  feedBy:{},        // uid → โพสต์ล่าสุดของคนนั้น (จาก watcher)
  feedRefs:{},      // uid → query ที่ .on ค้างอยู่ (ไว้ .off ตอนเลิก follow)
  lastAssetsSig:null, // JSON ทรัพย์สินล่าสุดที่ส่งขึ้น /feed/<me>/a (กันเขียนซ้ำ)
  lastPetsSig:null,   // JSON สัตว์เลี้ยง (สูงสุด 3 ตัว) ล่าสุดที่ส่งขึ้น /feed/<me>/pt (รอบ 195)
  /* ---- ยอดขายสินค้ารวมทั้งเซิร์ฟเวอร์ (รอบ 208) — โชว์ "ขายแล้ว N ชิ้น" ทุกสินค้า ---- */
  sales:{},           // productId → จำนวนที่ขายไปแล้วทั้งเซิร์ฟเวอร์ (จาก /sales)
  salesOk:false,      // true = อ่าน/เขียน /sales ได้ (rules publish แล้ว)
};

const ONLINE_STALE_MS  = 10*60*1000;   // presence ค้างเกิน 10 นาที = ผีค้าง ไม่นับ
const ONLINE_BEAT_MS   = 60*1000;      // ส่งสถานะ/คะแนนทุก 1 นาที
const LEADERBOARD_SIZE = 100;   // รอบ 246: 50→100 (ผู้ใช้: กระดานเต็มจอ Top 100)

/* ชื่อที่โชว์สาธารณะ: ชื่อในเกม (ข้อ 0.2 — ผ่านตัวกรอง badwords แล้ว)
   fallback เซฟเก่าที่ยังไม่ทันตั้งชื่อ: ชื่อจริง + อักษรแรกนามสกุล (แบบเดิม) */
function onlineDisplayName(){
  if(state.profileName) return state.profileName;
  if(!state.student) return null;
  const last = (state.student.last || '').trim();
  return (state.student.first || 'ผู้เล่น') + (last ? ' ' + last[0] + '.' : '');   // legacy fallback (ผู้ใช้ใหม่ไม่มี first แล้ว — ใช้ profileName)
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
  const bs = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';   // 🎖️ เข็มต่อท้ายชื่อ ให้เพื่อนเห็นในการ์ดหน้าเมือง
  Online.db.ref('presence/' + onlineKey()).set({
    n: onlineDisplayName() + bs,
    g: state.student.grade,
    act: onlineActivity(),
    at: firebase.database.ServerValue.TIMESTAMP,
  }).catch(()=>{});
}
function onlinePushScore(){
  if(!Online.ready || !state.student) return;
  const coins = Math.round(state.coins);
  const av    = Math.round(assetValue());   // มูลค่าทรัพย์สินรวม (โชว์ในการ์ดผู้เล่น)
  const ni    = assetCount();               // จำนวนชิ้นทรัพย์สิน
  const bs    = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';   // 🎖️ เข็มต่อท้ายชื่อบนกระดาน
  const bk    = Math.round(state.mechaBoss || 0);                          // 🤖 รอบ 228: บอสที่ล้มสะสม (กระดานโลกหุ่น)
  const ba    = (typeof lobbyBlk === 'function') ? lobbyBlk() : '';        // 🪪 รอบ 255: ตัวละคร blk ที่เลือก (โชว์เต็มตัวในการ์ดผู้เล่น)
  const hs    = Math.round(state.hauntSurviveBest || 0);                   // ⏱ รอบ 256: สถิติหนีผีรอดนานสุด (วินาที)
  const ws    = Math.round(state.wsScore || 0);                            // 🔎 รอบ 590: แต้มสะสมเกมค้นหาคำ (กระดานแท็บค้นหาคำ)
  const sig   = coins + '|' + av + '|' + ni + '|' + bs + '|' + bk + '|' + ba + '|' + hs + '|' + ws;   // ค่าใดเปลี่ยน = re-push
  if(Online.lastScoreSig === sig) return;   // เงิน/ทรัพย์สิน/เข็ม/บอส/ค้นหาคำไม่ขยับ ไม่ต้องเขียนซ้ำ
  Online.lastScoreSig = sig;
  const base = { n: onlineDisplayName() + bs, g: state.student.grade, coins,
                 at: firebase.database.ServerValue.TIMESTAMP };
  // เผื่อ rules ยังไม่รองรับฟิลด์ใหม่ (ช่วงอัปเดต) → ถอยทีละขั้น ไม่ให้ leaderboard พัง
  // (ws = รอบ 590 ยังรอ publish → ถอยไปก้อนเดิมที่มี ba/hs ก่อน แล้วค่อยถอยลงอีก)
  Online.db.ref('leaderboard/' + onlineKey()).set(Object.assign({av, ni, bk, ba, hs, ws}, base)).catch(()=>{
    Online.db.ref('leaderboard/' + onlineKey()).set(Object.assign({av, ni, bk, ba, hs}, base)).catch(()=>{
      Online.db.ref('leaderboard/' + onlineKey()).set(Object.assign({av, ni, bk}, base)).catch(()=>{
        Online.db.ref('leaderboard/' + onlineKey()).set(base).catch(()=>{});
      });
    });
  });
  if(typeof feedPushAssets === 'function') feedPushAssets();   // 📰 ทรัพย์สินเปลี่ยน → อัปเดตคลังที่เปิดเผย (มี sig กันเขียนซ้ำ)
}

/* ดึงข้อมูลการเงินของผู้เล่นคนหนึ่งมาโชว์ในการ์ด (คลิกชื่อ)
   - ตัวเราเอง: ใช้ค่าสดจาก state · คนอื่น: อ่านล่าสุดจาก /leaderboard/<uid>
   คืน {coins, av, ni, me} หรือ null ถ้ายังไม่มีข้อมูล */
function fetchPlayerStats(uid){
  if(uid && uid === onlineKey()){
    return Promise.resolve({coins: Math.round(state.coins), av: Math.round(assetValue()),
                            ni: assetCount(), ba: (typeof lobbyBlk === 'function') ? lobbyBlk() : null,
                            hs: Math.round(state.hauntSurviveBest || 0), me: true});
  }
  if(!Online.ready || !uid) return Promise.resolve(null);
  return Online.db.ref('leaderboard/' + uid).get().then(s=>{
    const v = s && s.val();
    if(!v) return null;
    return {
      coins: typeof v.coins === 'number' ? v.coins : 0,
      av:    typeof v.av    === 'number' ? v.av    : null,   // null = ผู้เล่นยังไม่ได้อัปเดตหลังเพิ่มฟีเจอร์
      ni:    typeof v.ni    === 'number' ? v.ni    : null,
      ba:    (typeof v.ba === 'string' && /^blk[1-8]$/.test(v.ba)) ? v.ba : null,   // 🪪 รอบ 255: ตัวละคร blk
      hs:    typeof v.hs === 'number' ? v.hs : null,                                // ⏱ รอบ 256: หนีผีรอดนานสุด (วิ)
      me: false,
    };
  }).catch(()=>null);
}

/* วาดการ์ดที่เกี่ยวข้องใหม่ เฉพาะตอนเปิดหน้า Dashboard อยู่ */
function onlineRerender(){
  const dash = document.getElementById('screen-dashboard');
  if(!dash || !dash.classList.contains('active')) return;
  if(typeof renderOnlineCard === 'function') renderOnlineCard();
  if(typeof renderLeaderboardCard === 'function') renderLeaderboardCard();
  if(typeof renderFriendPanel === 'function') renderFriendPanel();
  if(typeof renderGiftPanel === 'function') renderGiftPanel();
  if(typeof renderFeedCard === 'function') renderFeedCard();   // 📰 รอบ 155
}

/* 🔔 ตรวจว่าเพื่อน (ในรายชื่อเรา) ที่ออนไลน์อยู่ เพิ่งได้เข็มใหม่ไหม → เด้ง toast ให้กำลังใจ
   เข็ม baked อยู่ท้ายชื่อ presence.n อยู่แล้ว · เทียบแต้มเข็มกับที่จำไว้ · ครั้งแรกที่เห็น=ตั้ง baseline เงียบๆ */
function notifyFriendBadges(list){
  if(typeof splitNameBadges !== 'function' || typeof badgeScore !== 'function') return;
  const fset = new Set((Online.myFriends || []).map(f=>f.uid));
  Online.seenBadges = Online.seenBadges || {};
  list.forEach(p=>{
    const cur = splitNameBadges(p.n).badges;
    const prev = Online.seenBadges[p.id];
    if(fset.has(p.id) && prev !== undefined && badgeScore(cur) > badgeScore(prev)){
      const nm = splitNameBadges(p.n).name || 'เพื่อน';
      if(typeof toast === 'function') toast(`🎉 เพื่อน ${nm} เพิ่งได้เข็มใหม่! ${cur} — เก่งจัง ไปสะสมแข่งกันเลย!`, 3800);
      if(typeof sfx !== 'undefined' && sfx.levelup) sfx.levelup();
    }
    Online.seenBadges[p.id] = cur;
  });
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
    // อ่านชื่อ/ชั้นจากหลายแหล่งสาธารณะ: presence (สดถ้าออนไลน์อยู่) + leaderboard (ค้างถาวร)
    // เผื่อบางคนยังไม่มีเอนทรีใดเอนทรีหนึ่ง จะได้ไม่ตกไปเป็นคำว่า "ผู้เล่น"
    return Promise.all([
      Online.db.ref('presence/' + uid).get().catch(()=>null),
      Online.db.ref('leaderboard/' + uid).get().catch(()=>null),
    ]).then(([ps, ls])=>{
      const p = (ps && ps.val()) || {};
      const l = (ls && ls.val()) || {};
      const n = (typeof p.n === 'string' && p.n) || (typeof l.n === 'string' && l.n) || 'ผู้เล่น';
      const g = p.g || l.g || '';
      return {uid, n, g, already: Online.myFriends.some(f=>f.uid === uid)};
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

/* ซ่อมเพื่อนให้ครบสองฝ่ายอัตโนมัติ (self-heal mutual friendship)
   ปัญหา: ข้อมูลเพื่อน "ไม่ครบสองฝ่าย" (A มี B ในรายชื่อ แต่ B ไม่มี A) ค้างมาจาก
   ช่วง rules /chats ยังไม่ถูก publish → ฝั่งที่หายไปไม่มีทั้งปุ่มแชทและตัวเฝ้าข้อความ
   วิธีซ่อม: สำหรับเพื่อนทุกคนในรายชื่อของเรา เขียนยืนยันฝั่งตรงข้าม
   friends/<f.uid>/<me> = ตัวเรา (rules อนุญาต เพราะ auth.uid === $friendUid = ตัวเรา)
   throttle: ทำครั้งเดียวต่อ uid/เซสชัน กันเขียนรัวทุก tick presence */
function friendsHeal(){
  if(!Online.ready || !state.student) return;
  const me   = onlineKey();
  const name = onlineDisplayName();
  if(!name) return;                        // กัน validate ล้ม (n ต้อง 1–40 ตัว)
  const meData = {n: name, g: state.student.grade, ts: firebase.database.ServerValue.TIMESTAMP};
  (Online.myFriends || []).forEach(f=>{
    if(!f.uid || f.uid === me) return;
    if(Online.friendsHealed[f.uid]) return; // ซ่อมไปแล้วในเซสชันนี้
    Online.friendsHealed[f.uid] = true;
    Online.db.ref('friends/' + f.uid + '/' + me).set(meData).catch(()=>{
      delete Online.friendsHealed[f.uid];   // เขียนล้ม → ปลดล็อกให้ลองใหม่รอบหน้า
    });
  });
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

/* 🕵️ รอบ 190: แชทลับ — ลบข้อความออกจาก DB (ทั้งสองฝ่ายเห็นหายทันทีผ่าน chatListen)
   สิทธิ์: rules /chats ให้ทั้งคู่ใน pairId เขียน/ลบได้อยู่แล้ว (ไม่ต้องแก้ rules) */
function chatDeleteMsg(otherUid, key){
  if(!Online.ready || !Online.db || !key) return Promise.resolve();
  return chatRef(otherUid).child(key).remove().catch(()=>{});
}

/* 💬 รอบ 187 (A2): สัญญาณ "กำลังพิมพ์" — /typing/<pairId>/<me> = timestamp
   เขียนตอนพิมพ์ (throttle 2 วิ) · ลบตอนส่ง/ปิดกล่อง/หลุดเน็ต · ต้อง publish rules /typing ก่อนใช้จริง
   ยังไม่ publish = เขียนโดน deny เงียบๆ (แชทปกติไม่กระทบ) */
const TYPING_TTL = 6000;
let _typingLastSet = 0, _typingRef = null;
function typingRef(otherUid){ return Online.db.ref('typing/' + chatPairId(otherUid) + '/' + onlineKey()); }
function chatSetTyping(otherUid){
  if(!Online.ready || !Online.db) return;
  const now = Date.now();
  if(now - _typingLastSet < 2000) return;             // throttle: เขียนทุก 2 วิพอ
  _typingLastSet = now;
  const ref = typingRef(otherUid);
  _typingRef = ref;
  ref.set(now).catch(()=>{});
  ref.onDisconnect().remove();                         // หลุดเน็ต = ลบให้เอง
}
function chatClearTyping(otherUid){
  _typingLastSet = 0;
  if(!Online.ready || !Online.db) return;
  const ref = otherUid ? typingRef(otherUid) : _typingRef;
  if(ref){ try{ ref.onDisconnect().cancel(); }catch(e){} ref.remove().catch(()=>{}); }
  _typingRef = null;
}
/* ฝั่งรับ: เฝ้าสถานะพิมพ์ของอีกฝ่าย → cb(true/false) · คืนฟังก์ชันเลิกฟัง */
function chatWatchTyping(otherUid, cb){
  if(!Online.ready || !Online.db) return ()=>{};
  const ref = Online.db.ref('typing/' + chatPairId(otherUid) + '/' + otherUid);
  let timer = null;
  const handler = ref.on('value', s=>{
    const v = s.val();
    const active = typeof v === 'number' && (Date.now() - v) < TYPING_TTL;
    cb(active);
    if(timer){ clearTimeout(timer); timer = null; }
    if(active) timer = setTimeout(()=>cb(false), TYPING_TTL);   // คนพิมพ์หายไปเฉยๆ → หมดอายุเอง
  });
  return ()=>{ if(timer) clearTimeout(timer); ref.off('value', handler); };
}

/* 🎨 รอบ 241: ธีมแชท "ร่วมกันทั้งคู่" — /chattheme/<pairId> = themeId (string)
   ใครเปลี่ยนธีม อีกฝ่ายเห็นเปลี่ยนตามทันที (เดิมจำแยกในเครื่องใครเครื่องมัน)
   สิทธิ์: ทั้งคู่ใน pairId อ่าน/เขียนได้ (โซนใหม่ /chattheme — ต้อง publish rules ก่อนใช้จริง
   ยังไม่ publish = เขียนโดน deny เงียบๆ → ตกไปใช้ธีมในเครื่องเดิม แชทปกติไม่กระทบ) */
function chatThemeRef(otherUid){ return Online.db.ref('chattheme/' + chatPairId(otherUid)); }
function chatSetTheme(otherUid, themeId){
  if(!Online.ready || !Online.db || typeof themeId !== 'string') return;
  chatThemeRef(otherUid).set(themeId).catch(()=>{});
}
/* ฝั่งรับ: เฝ้าธีมของคู่สนทนา → cb(themeId) ทุกครั้งที่เปลี่ยน (รวมค่าเริ่มต้นตอนเปิด) · คืนฟังก์ชันเลิกฟัง */
function chatWatchTheme(otherUid, cb){
  if(!Online.ready || !Online.db) return ()=>{};
  const ref = chatThemeRef(otherUid);
  const handler = ref.on('value', s=>{ const v = s.val(); if(typeof v === 'string' && v) cb(v); });
  return ()=>ref.off('value', handler);
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

/* ---------- แจ้งเตือนข้อความใหม่ (แม้ไม่ได้เปิดกล่องแชท) ----------
   เฝ้าข้อความล่าสุดของเพื่อนทุกคน (limitToLast 1 = เบา) เทียบกับ state.chatSeen
   ที่จำว่าอ่านถึงข้อความไหนแล้ว → ตั้ง Online.chatUnread[uid] + เด้ง toast/badge */
let chatWatchers = {};   // pairId → ฟังก์ชันเลิกฟัง (มีทีละคู่ต่อเพื่อน 1 คน)

function chatSeenTs(otherUid){
  const v = state.chatSeen && state.chatSeen[chatPairId(otherUid)];
  return typeof v === 'number' ? v : 0;
}

/* จำว่าอ่านข้อความถึง ts นี้แล้ว (เรียกตอนเปิด/อยู่ในกล่องแชท) → เคลียร์ unread */
function chatMarkSeen(otherUid, ts){
  const pid = chatPairId(otherUid);
  const t = typeof ts === 'number' ? ts : Date.now();
  if(!state.chatSeen || typeof state.chatSeen !== 'object') state.chatSeen = {};
  if((state.chatSeen[pid] || 0) < t){ state.chatSeen[pid] = t; saveState(); }
  if(Online.chatUnread[otherUid]){
    delete Online.chatUnread[otherUid];
    if(typeof onlineRerender === 'function') onlineRerender();
  }
}

/* จำนวนเพื่อนที่มีข้อความใหม่ค้างอยู่ (ไว้โชว์ badge) */
function chatUnreadCount(){ return Object.keys(Online.chatUnread).length; }

/* ตั้ง/รื้อ watcher ให้ตรงกับรายชื่อเพื่อนปัจจุบัน (เรียกทุกครั้งที่เพื่อนเปลี่ยน) */
function chatWatchSync(){
  if(!Online.ready || !Online.db) return;
  const me = onlineKey();
  const want = {};                                  // pairId → uid เพื่อน
  (Online.myFriends || []).forEach(f=>{ want[chatPairId(f.uid)] = f.uid; });
  // รื้อ watcher ของคนที่ไม่ใช่เพื่อนแล้ว + ล้าง unread ค้าง
  for(const pid in chatWatchers){
    if(!(pid in want)){ try{ chatWatchers[pid](); }catch(e){} delete chatWatchers[pid]; }
  }
  for(const uid in Online.chatUnread){
    if(!(Online.myFriends || []).some(f=>f.uid === uid)) delete Online.chatUnread[uid];
  }
  // ตั้ง watcher ใหม่ให้เพื่อนที่ยังไม่มี
  for(const pid in want){
    if(chatWatchers[pid]) continue;
    const otherUid = want[pid];
    const q = Online.db.ref('chats/' + pid).orderByKey().limitToLast(1);
    let primed = false;                             // ครั้งแรก = snapshot เก่า (ตั้ง badge เงียบๆ ไม่เด้ง toast)
    const handler = q.on('value', (snap)=>{
      let last = null;
      snap.forEach(ch=>{ last = ch.val(); });
      const wasPrimed = primed; primed = true;
      if(!last || typeof last.f !== 'string' || typeof last.ts !== 'number') return;
      if(last.f === me) return;                      // ข้อความของเราเอง ไม่นับว่ายังไม่อ่าน
      if(last.ts <= chatSeenTs(otherUid)) return;    // อ่านแล้ว
      const wasUnread = !!Online.chatUnread[otherUid];
      Online.chatUnread[otherUid] = true;
      if(wasPrimed && !wasUnread){                   // ข้อความใหม่สดๆ ที่เพิ่งเข้ามา → แจ้งเตือน
        const fr = (Online.myFriends || []).find(f=>f.uid === otherUid);
        const nm = fr ? fr.n : 'เพื่อน';
        if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
        if(typeof toast === 'function') toast('💬 ' + nm + ' ส่งข้อความหาหนู!');
      }
      if(typeof onlineRerender === 'function') onlineRerender();
    });
    chatWatchers[pid] = ()=>q.off('value', handler);
  }
}

/* ============================================================
   ระบบส่งของขวัญ (ข้อ 0.5)
   /gifts/<toUid>/<fromUid>/<giftKey> = {k, id, fn, ts, st}
     k  = 'shop' (ของขวัญจากร้าน gifts.js) | 'collect' (สินค้าจากคลังผู้ส่ง)
     id = id ของขวัญ/สินค้า · fn = ชื่อผู้ส่ง (โชว์ให้ผู้รับ) · ts = เวลาส่ง
     st = 'pending' (ยังไม่มีผู้รับ) | 'accepted' (รับแล้ว) | 'declined' (ไม่รับ)
   สิทธิ์ (rules): ผู้รับอ่านทั้งกล่อง /gifts/<toUid> · ผู้ส่งอ่าน-เขียนได้เฉพาะ
   ซับทรีของตัวเอง /gifts/<toUid>/<fromUid> → ผู้ส่งเฝ้าสถานะของขวัญตัวเองได้
   คลัง collectible เป็น state ในเครื่อง (ไม่ได้อยู่ใน DB) → "คืนของ" ตอนถูก
   ปฏิเสธ/หมดอายุ ทำที่ฝั่งผู้ส่ง (giftOutWatch) เมื่อผู้ส่งออนไลน์
   ============================================================ */
const GIFT_EXPIRE_MS = 7*24*60*60*1000;   // ค้าง "ยังไม่มีผู้รับ" เกิน 7 วัน = หมดอายุ คืนของ

/* ส่งของขวัญไปหา toUid (ผู้เรียกจัดการหักเหรียญ/ตัดของออกจากคลังเองก่อน) */
function giftSend(toUid, kind, id){
  if(!Online.ready || !state.student) return Promise.reject('ต้องต่ออินเทอร์เน็ตก่อนถึงจะส่งของขวัญได้นะ 📡');
  const name = onlineDisplayName();
  if(!name) return Promise.reject('ตั้งชื่อในเกมก่อนถึงจะส่งของขวัญได้นะ');
  if(kind !== 'shop' && kind !== 'collect') return Promise.reject('ของขวัญไม่ถูกต้อง');
  return Online.db.ref('gifts/' + toUid + '/' + onlineKey()).push({
    k: kind, id: id, fn: name, st: 'pending',
    ts: firebase.database.ServerValue.TIMESTAMP,
  });
}

/* 🐾 รอบ 325: "ทักทายน้อง" — ส่งคำทักถึงสัตว์เลี้ยงของเพื่อน (ไม่เสียของ ไม่เสียเหรียญ)
   ใช้ท่อเดียวกับของขวัญ (/gifts/<to>/<from>) แต่ k='greet' + id=รหัสคำทัก → ไม่ต้องเพิ่มโซนใหม่ใน DB
   ⚠️ ต้อง publish rules ให้ k รับค่า 'greet' ด้วย ไม่งั้น server ปฏิเสธ (โค้ดจะบอกผู้ใช้เอง) */
function greetSend(toUid, greetId){
  if(!Online.ready || !state.student) return Promise.reject('ต้องต่ออินเทอร์เน็ตก่อนถึงจะทักทายน้องของเพื่อนได้นะ 📡');
  const name = onlineDisplayName();
  if(!name) return Promise.reject('ตั้งชื่อในเกมก่อนนะ');
  if(typeof greetId !== 'string' || greetId.length > 20) return Promise.reject('คำทักไม่ถูกต้อง');
  return Online.db.ref('gifts/' + toUid + '/' + onlineKey()).push({
    k: 'greet', id: greetId, fn: name, st: 'pending',
    ts: firebase.database.ServerValue.TIMESTAMP,
  });
}

/* ผู้รับกด "รับ": จำของเข้าห้องของขวัญ (ผู้เรียกทำ) + ตั้งสถานะ accepted ให้ผู้ส่งเห็น */
function giftAccept(item){
  return Online.db.ref('gifts/' + onlineKey() + '/' + item.from + '/' + item.key + '/st').set('accepted');
}
/* ผู้รับกด "ไม่รับ": ตั้งสถานะ declined → ผู้ส่งเห็นแล้วคืนของให้ตัวเอง */
function giftDecline(item){
  return Online.db.ref('gifts/' + onlineKey() + '/' + item.from + '/' + item.key + '/st').set('declined');
}

/* ---------- ผู้รับ: เฝ้ากล่องของขวัญของเรา (แจ้งเตือนของขวัญใหม่) ---------- */
let giftInPrimed = false;                 // ครั้งแรก = ของเก่า (ตั้ง badge เงียบๆ ไม่เด้ง toast)
function giftInWatch(){
  if(!Online.ready || !Online.db) return;
  Online.db.ref('gifts/' + onlineKey()).on('value', (snap)=>{
    const out = [];
    snap.forEach(fromNode=>{
      const from = fromNode.key;
      fromNode.forEach(gNode=>{
        const v = gNode.val();
        if(!v || (v.st && v.st !== 'pending')) return;          // ข้ามที่รับ/ปฏิเสธไปแล้ว
        if(v.k !== 'shop' && v.k !== 'collect') return;
        const ok = v.k === 'shop' ? giftInfo(v.id) : (typeof collectInfo === 'function' && collectInfo(v.id));
        if(!ok) return;
        out.push({from, key: gNode.key, k: v.k, id: v.id, fn: v.fn || 'เพื่อน', ts: v.ts || 0});
      });
    });
    out.sort((a,b)=>b.ts - a.ts);
    const wasPrimed = giftInPrimed; giftInPrimed = true;
    const grew = out.length > Online.giftIn.length;             // มีของขวัญใหม่เข้ามา
    Online.giftIn = out;
    if(wasPrimed && grew){
      if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
      if(typeof toast === 'function') toast('🎁 มีของขวัญส่งมาถึงหนู! เปิดดูในเมนู 🎁 ของขวัญ');
    }
    if(typeof onlineRerender === 'function') onlineRerender();
  });
}

/* ---------- ผู้ส่ง: เฝ้าของขวัญที่เราส่งไปหาเพื่อนแต่ละคน (สถานะ + คืนของ) ---------- */
let giftOutWatchers = {};                 // friendUid → ฟังก์ชันเลิกฟัง

/* คืนของให้ผู้ส่ง (ถูกปฏิเสธ/หมดอายุ): collectible กลับเข้าคลัง · ของร้านคืนเหรียญ */
function giftReclaim(rec){
  if(rec.k === 'collect' && typeof collectInfo === 'function' && collectInfo(rec.id)){
    state.collection.push(rec.id);
  }else if(rec.k === 'shop'){
    const g = giftInfo(rec.id);
    if(g) state.coins += g.price;         // คืนเหรียญ (ไม่ผ่าน addCoins กันบวกยอดวันนี้ซ้ำ)
  }
  saveState();
}

function giftOutWatchSync(){
  if(!Online.ready || !Online.db) return;
  const me = onlineKey();
  const want = {};
  (Online.myFriends || []).forEach(f=>{ if(f.uid && f.uid !== me) want[f.uid] = true; });
  // รื้อ watcher ของคนที่ไม่ใช่เพื่อนแล้ว
  for(const uid in giftOutWatchers){
    if(!(uid in want)){ try{ giftOutWatchers[uid](); }catch(e){} delete giftOutWatchers[uid]; }
  }
  // ตั้ง watcher ใหม่: /gifts/<friendUid>/<me> = ของขวัญที่เราส่งไปหาเพื่อนคนนี้
  for(const friendUid in want){
    if(giftOutWatchers[friendUid]) continue;
    const ref = Online.db.ref('gifts/' + friendUid + '/' + me);
    const handler = ref.on('value', (snap)=>{
      const now = Date.now();
      snap.forEach(gNode=>{
        const key = gNode.key, v = gNode.val();
        if(!v) return;
        const rec = {k: v.k, id: v.id};
        if(v.st === 'accepted'){
          if(!Online.giftOutDone[key]){
            Online.giftOutDone[key] = true;
            const g = v.k === 'shop' ? giftInfo(v.id) : (typeof collectInfo === 'function' && collectInfo(v.id));
            if(typeof toast === 'function') toast('🎉 เพื่อนรับ' + (g ? g.name : 'ของขวัญ') + 'แล้ว! ดีใจด้วยนะ');
            ref.child(key).remove().catch(()=>{});
          }
        }else if(v.st === 'declined'){
          if(!Online.giftOutDone[key]){
            Online.giftOutDone[key] = true;
            giftReclaim(rec);
            const g = v.k === 'shop' ? giftInfo(v.id) : (typeof collectInfo === 'function' && collectInfo(v.id));
            const back = v.k === 'shop' ? 'คืนเหรียญให้แล้ว' : 'ของกลับเข้าคลังแล้ว';
            if(typeof toast === 'function') toast('💔 เพื่อนยังไม่สะดวกรับ' + (g ? g.name : '') + ' — ' + back);
            ref.child(key).remove().catch(()=>{});
          }
        }else if(typeof v.ts === 'number' && now - v.ts > GIFT_EXPIRE_MS){
          if(!Online.giftOutDone[key]){
            Online.giftOutDone[key] = true;
            giftReclaim(rec);
            const g = v.k === 'shop' ? giftInfo(v.id) : (typeof collectInfo === 'function' && collectInfo(v.id));
            const back = v.k === 'shop' ? 'คืนเหรียญให้แล้ว' : 'ของกลับเข้าคลังแล้ว';
            if(typeof toast === 'function') toast('⏰ ของขวัญ' + (g ? g.name : '') + 'ยังไม่มีผู้รับ หมดอายุแล้ว — ' + back);
            ref.child(key).remove().catch(()=>{});
          }
        }
      });
      giftOutRebuild();
    });
    giftOutWatchers[friendUid] = ()=>ref.off('value', handler);
  }
  giftOutRebuild();
}

/* รวมรายการของขวัญที่ยังค้าง "ยังไม่มีผู้รับ" จากทุก watcher (ไว้โชว์สถานะฝั่งผู้ส่ง)
   อ่านสดจาก DB ทีละเพื่อน — best-effort ไม่บล็อก */
function giftOutRebuild(){
  const me = onlineKey();
  const friends = (Online.myFriends || []).filter(f=>f.uid && f.uid !== me);
  Promise.all(friends.map(f=>
    Online.db.ref('gifts/' + f.uid + '/' + me).get().then(s=>({f, s})).catch(()=>null)
  )).then(results=>{
    const out = [];
    results.forEach(r=>{
      if(!r || !r.s) return;
      r.s.forEach(gNode=>{
        const v = gNode.val();
        if(v && (!v.st || v.st === 'pending')) out.push({to: r.f.uid, toName: r.f.n, k: v.k, id: v.id, ts: v.ts || 0, key: gNode.key});
      });
    });
    out.sort((a,b)=>b.ts - a.ts);
    Online.giftOut = out;
    if(typeof onlineRerender === 'function') onlineRerender();
  });
}

/* ============================================================
   🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
   /market/<key> = {sid, sn, id, p, ts} — ลงขาย: สร้าง node ตัวเอง · ซื้อ/ถอน: ลบ node (transaction คนแรกได้)
   /msold/<sellerUid>/<key> = {id, p, bn, ts} — ใบเสร็จจากผู้ซื้อ ให้ฝั่งคนขายมารับเงิน (อ่านแล้วลบ)
   rules ยังไม่ publish → อ่าน/เขียนโดน deny เงียบๆ → เกม fallback ตลาดจำลองเดิมอัตโนมัติ
   ============================================================ */
let marketPrimed = false;                 // snapshot แรก = ของเก่าที่ค้างอยู่ (badge เงียบๆ ไม่เด้ง toast)
const marketSeen = {};                    // key ประกาศที่เคยเห็นแล้วในเซสชันนี้
/* 🛒 รอบ 208: ยอดขายรวมทั้งเซิร์ฟเวอร์ — ฟัง /sales (id→จำนวน) แล้วรีเฟรชการ์ดสินค้า
   sellInc(id): ตอนซื้อ → transaction +1 (rules ยอมให้เพิ่มทีละ 1) · เพิ่ม local ทันทีให้เห็นเลย */
function salesWatch(){
  if(!Online.db) return;
  Online.db.ref('sales').on('value', (snap)=>{
    Online.sales = snap.val() || {};
    Online.salesOk = true;
    salesRerender();
  }, ()=>{ Online.salesOk = false; });   // permission denied = โซน sales ยังไม่ publish
}
function salesRerender(){
  if(document.querySelector('.levelup-overlay')) return;      // มี dialog เปิดอยู่ อย่าเพิ่งรีเฟรช
  if(typeof renderDashboard === 'function') renderDashboard();
}
function sellInc(id){
  if(!id) return;
  Online.sales[id] = (Online.sales[id] || 0) + 1;            // เพิ่ม local ทันที (โชว์แม้ rules ยังไม่ publish)
  if(!Online.ready || !Online.db) return;
  Online.db.ref('sales/' + id)
    .transaction(cur => (typeof cur === 'number' ? cur : 0) + 1)
    .catch(()=>{});
}
function marketWatch(){
  if(!Online.db) return;
  Online.db.ref('market').limitToLast(120).on('value', (snap)=>{
    const out = [];
    snap.forEach(ch=>{
      const v = ch.val();
      if(!v || typeof v.p !== 'number' || v.p <= 0 || !v.sid) return;
      if(typeof collectInfo !== 'function' || !collectInfo(v.id)) return;
      out.push({key: ch.key, sid: v.sid, sn: v.sn || 'เพื่อน', id: v.id, p: v.p, ts: v.ts || 0});
    });
    out.sort((a,b)=>b.ts - a.ts);
    Online.market = out;
    Online.marketOk = true;
    // 💖 รอบ 126: ประกาศใหม่ (ไม่ใช่ของเรา) ตรงกับของที่เล็งไว้ → แจ้งเตือน (เด้งตัวแรกพอ กันรัว)
    const me = (typeof onlineKey === 'function') ? onlineKey() : '';
    let alerted = false;
    out.forEach(m=>{
      const isNew = !marketSeen[m.key];
      marketSeen[m.key] = true;
      if(!marketPrimed || !isNew || alerted || m.sid === me) return;
      if(!Array.isArray(state.wishlist) || !state.wishlist.includes(m.id)) return;
      const c = collectInfo(m.id);
      alerted = true;
      if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
      if(typeof toast === 'function')
        toast(`💖 ของที่หนูเล็งไว้มีคนลงขายแล้ว! ${c.emoji} ${c.name} 🪙${fmtNum(m.p)} จากร้าน ${m.sn} — รีบไปดูที่ 🏪 ตลาด`);
    });
    marketPrimed = true;
    if(typeof renderMarketCard === 'function') renderMarketCard();
    if(typeof updateWishBadge === 'function') updateWishBadge();
  }, ()=>{ Online.marketOk = false; });   // permission denied = rules โซน market ยังไม่ publish
}
/* ลงขายจริง: คืน Promise<key|null> — null = ตลาดจริงยังใช้ไม่ได้ (ผู้เรียก fallback ตลาดจำลอง) */
function marketList(id, price){
  if(!Online.ready || !Online.db || !Online.marketOk || !state.student) return Promise.resolve(null);
  const ref = Online.db.ref('market').push();
  return ref.set({sid: onlineKey(), sn: onlineDisplayName() || 'เพื่อน', id, p: price,
                  ts: firebase.database.ServerValue.TIMESTAMP})
            .then(()=>ref.key).catch(()=>null);
}
/* ถอนประกาศตัวเอง: 'removed' = ถอนสำเร็จ · 'gone' = มีคนซื้อตัดหน้าไปแล้ว (รอใบเสร็จ) · 'error' */
function marketUnlist(key){
  if(!Online.ready || !Online.db) return Promise.resolve('error');
  return Online.db.ref('market/' + key)
    .transaction(cur=>cur === null ? undefined : null)
    .then(r=>r.committed ? 'removed' : 'gone')
    .catch(()=>'error');
}
/* ซื้อของเพื่อน: ลบ node ด้วย transaction (คนแรกได้ คนช้าเจอ false) แล้วเขียนใบเสร็จให้คนขาย
   (cache อุ่นเสมอเพราะ marketWatch เปิด on('value') ค้างไว้ — transaction ไม่เจอ null หลอก) */
function marketBuy(item){
  if(!Online.ready || !Online.db) return Promise.resolve(false);
  return Online.db.ref('market/' + item.key)
    .transaction(cur=>cur === null ? undefined : null)
    .then(r=>{
      if(!r.committed) return false;
      Online.db.ref('msold/' + item.sid + '/' + item.key)
        .set({id: item.id, p: item.p, bn: onlineDisplayName() || 'เพื่อน',
              ts: firebase.database.ServerValue.TIMESTAMP}).catch(()=>{});
      return true;
    }).catch(()=>false);
}
/* ฝั่งคนขาย: เฝ้าใบเสร็จ — จับคู่ประกาศของเรา (netKey) + เช็กว่าของหลุดจากตลาดแล้วจริง (กันใบเสร็จปลอม) */
function marketSoldWatch(){
  if(!Online.db) return;
  Online.db.ref('msold/' + onlineKey()).on('child_added', (snap)=>{
    const v = snap.val() || {}, key = snap.key;
    const done = ()=>Online.db.ref('msold/' + onlineKey() + '/' + key).remove().catch(()=>{});
    const i = (state.listings || []).findIndex(l=>l.netKey === key);
    if(i < 0){ done(); return; }                       // ใบเสร็จที่ไม่รู้จัก → ทิ้ง
    Online.db.ref('market/' + key).once('value').then(ms=>{
      if(ms.exists()) return;                          // ของยังแขวนอยู่ = ใบเสร็จปลอม ไม่จ่าย
      const l = state.listings.splice(i, 1)[0];
      addCoins(l.price);
      state.tradeSold.push({id: l.id, price: l.price, ts: Date.now(), buyer: v.bn || 'เพื่อน'});
      if(state.tradeSold.length > 20) state.tradeSold = state.tradeSold.slice(-20);
      saveState();
      if(typeof sfx !== 'undefined' && sfx.buy) sfx.buy();
      if(typeof toast === 'function') toast(`🏪 ${v.bn || 'เพื่อน'} ซื้อของที่หนูลงขาย! +🪙${fmtNum(l.price)} เข้ากระเป๋าแล้ว`);
      if(typeof renderMarketCard === 'function') renderMarketCard();
      done();
    }).catch(()=>{});
  });
}

/* ---------- เริ่มระบบหลัง login สำเร็จ (เรียกจาก authEnterGame ใน auth.js —
   initializeApp ทำแล้วใน authStart) ---------- */
/* ============================================================
   คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
   ผู้ชวนจำคำเชิญที่ส่งใน state.tinvSent · ผู้ถูกชวนเห็นจาก watch นี้
   เจอกันใน map จริงทั้งคู่ → ต่างคนต่างรับเงินคืน TINV_CASHBACK (ครั้งเดียว/map)
   ============================================================ */
function tinvSend(toUid, map){
  if(!Online.ready || !Online.db) return Promise.reject();
  const me = onlineKey();
  return Online.db.ref('tinv/' + toUid + '/' + me).set({
    map, n: onlineDisplayName(), ts: firebase.database.ServerValue.TIMESTAMP,
  });
}
function tinvClear(fromUid){
  if(!Online.db) return;
  Online.db.ref('tinv/' + onlineKey() + '/' + fromUid).remove().catch(()=>{});
}
function tinvWatch(){
  Online.db.ref('tinv/' + onlineKey()).on('value', (snap)=>{
    const out = {};
    snap.forEach(ch=>{
      const v = ch.val();
      if(v && (v.map === 'adv' || v.map === 'haunt' || v.map === 'heli')) out[ch.key] = {map: v.map, n: v.n || 'เพื่อน', ts: v.ts || 0};
    });
    Online.tinv = out;
    Object.keys(out).forEach(uid=>{
      if(Online.tinvSeen[uid]) return;
      Online.tinvSeen[uid] = true;
      const w = out[uid].map === 'haunt' ? 'โลกผีสิง 👻' : out[uid].map === 'heli' ? 'โลกเฮลิคอปเตอร์ 🚁' : 'โลกผจญภัย 🌍';
      toast(`📨 ${out[uid].n} ชวนหนูไปเล่น${w}ด้วยกัน! เจอกันใน map รับเงินคืน 🪙${fmtNum(TINV_CASHBACK)}`);
      window.__invFlashPend = uid;    // รอบ 154: การ์ดคำชวนในกล่องเพื่อน แฟลช+เด้งไปโชว์ (renderOnlineCard จัดการ)
    });
    if(typeof renderTicketCard === 'function') renderTicketCard();
    if(typeof renderHauntCard === 'function') renderHauntCard();
    if(typeof renderHeliCard === 'function') renderHeliCard();
    if(typeof onlineRerender === 'function') onlineRerender();   // การ์ดคำชวนในกล่องเพื่อนโผล่/หายทันที
  });
}

/* ============================================================
   📰 Follow + Feed กิจกรรม (รอบ 155)
   /feed/<uid>/p/<pushKey> = {c:หมวด, tx:ข้อความ ≤120, ts} — เจ้าของเขียนเอง เก็บ 30 ล่าสุด
   /feed/<uid>/a           = JSON string {collectId:จำนวน} — คลังทรัพย์สิน (เฉพาะตอนเปิดเผย)
   /follow/<targetUid>/<followerUid> = {n:ชื่อผู้ติดตาม, ts} — follow ทางเดียวแบบ TikTok
   ยึดหลักเดิม "มีก็ใช้ ไม่มีก็ไม่พัง": rules ยังไม่ publish = เขียนโดน deny เงียบๆ เกมปกติ
   ============================================================ */
const FEED_MAX = 30;   // เก็บย้อนหลังต่อคน (ผู้ใช้เคาะ 12 ก.ค. — ประหยัดโควตา DB ฟรี)

/* จุดรับเหตุการณ์กลาง — ระบบเกมยิงมาที่นี่ (เขียนเฉพาะหมวดที่ผู้เล่นเปิดเผยเอง · default ปิดหมด) */
function feedEvent(cat, tx){
  try{
    if(!Online.ready || !state.student) return;
    if(!state.feedShare || !state.feedShare[cat]) return;
    const ref = Online.db.ref('feed/' + onlineKey() + '/p');
    ref.push({c:String(cat).slice(0,12), tx:String(tx).slice(0,120),
              ts:firebase.database.ServerValue.TIMESTAMP})
       .then(()=>feedPrune(ref)).catch(()=>{});
  }catch(e){ /* feed ล่มห้ามพังเกม */ }
}
/* ตัดโพสต์เก่าเกิน FEED_MAX (push key เรียงตามเวลาอยู่แล้ว) */
function feedPrune(ref){
  ref.once('value').then(snap=>{
    const keys = [];
    snap.forEach(ch=>{ keys.push(ch.key); });
    if(keys.length <= FEED_MAX) return;
    const del = {};
    keys.slice(0, keys.length - FEED_MAX).forEach(k=>{ del[k] = null; });
    ref.update(del).catch(()=>{});
  }).catch(()=>{});
}
/* ผู้เล่นปิดหมวดในตั้งค่า → ลบโพสต์หมวดนั้นของเราออกจาก DB (ปิดแล้วคนอื่นไม่เห็นของเก่าด้วย) */
function feedPurgeCat(cat){
  if(!Online.ready) return;
  const ref = Online.db.ref('feed/' + onlineKey() + '/p');
  ref.once('value').then(snap=>{
    const del = {};
    snap.forEach(ch=>{ const v = ch.val(); if(v && v.c === cat) del[ch.key] = null; });
    if(Object.keys(del).length) ref.update(del).catch(()=>{});
  }).catch(()=>{});
}
/* คลังทรัพย์สิน (สินค้าสะสม+ของที่ลงขายอยู่) ขึ้น /feed/<me>/a — เรียกจาก onlinePushScore/ตั้งค่า
   เปิดเผย = JSON {id:จำนวน} · ปิด = ลบทิ้ง · เขียนเฉพาะตอนค่าเปลี่ยน (lastAssetsSig) */
function feedPushAssets(){
  if(!Online.ready || !state.student) return;
  let sig, val = null;
  if(state.feedShare && state.feedShare.assets){
    const counts = {};
    for(const id of state.collection) counts[id] = (counts[id]||0) + 1;
    for(const l of state.listings) counts[l.id] = (counts[l.id]||0) + 1;   // ของลงขายยังเป็นของเรา
    val = JSON.stringify(counts);
    if(val.length > 3900) return;   // กันชน validate ≤4000 (ปกติ 50 ชนิดไม่มีทางถึง)
    sig = val;
  }else sig = 'off';
  if(Online.lastAssetsSig === sig) return;
  Online.lastAssetsSig = sig;
  const ref = Online.db.ref('feed/' + onlineKey() + '/a');
  (val === null ? ref.remove() : ref.set(val)).catch(()=>{ Online.lastAssetsSig = null; });
  feedPushPets();                     // 🐾 รอบ 195: ดันสัตว์เลี้ยง (สูงสุด 3) พร้อมกัน
}
/* 🐾 รอบ 195: ตัวย่อสัตว์เลี้ยง 1 ตัวสำหรับโชว์ในโปรไฟล์ (คำนวณภาพจาก type/stage/shape/item ฝั่งผู้ดู) */
function petDescriptor(p){
  return { t:p.type, s:(typeof petStage==='function')?petStage(p):'adult', sh:p.shape||'normal',
           e:((typeof equippedItem==='function' && equippedItem(p))||{}).id || '',
           nm:String(p.name||'').slice(0,20) };
}
/* ดันสัตว์เลี้ยงขึ้น /feed/<me>/pt (JSON สูงสุด 3 ตัว) — เปิดเผยพร้อมทรัพย์สิน (feedShare.assets) · กันเขียนซ้ำด้วย sig */
function feedPushPets(){
  if(!Online.ready || !state.student) return;
  let sig, val = null;
  if(state.feedShare && state.feedShare.assets && Array.isArray(state.pets) && state.pets.length){
    val = JSON.stringify(state.pets.slice(0,3).map(petDescriptor));
    if(val.length > 1800) return;
    sig = val;
  }else sig = 'off';
  if(Online.lastPetsSig === sig) return;
  Online.lastPetsSig = sig;
  const ref = Online.db.ref('feed/' + onlineKey() + '/pt');
  (val === null ? ref.remove() : ref.set(val)).catch(()=>{ Online.lastPetsSig = null; });
}
/* อ่านสัตว์เลี้ยงของผู้เล่น (โปรไฟล์ตัวเอง = จาก state เสมอ · คนอื่น = จาก DB ถ้าเปิดเผย) → [{t,s,sh,e,nm},...] | null */
function fetchPlayerPets(uid){
  if(!uid) return Promise.resolve(null);
  if(uid === onlineKey()){
    if(!Array.isArray(state.pets) || !state.pets.length) return Promise.resolve(null);
    return Promise.resolve(state.pets.slice(0,3).map(petDescriptor));
  }
  if(!Online.ready) return Promise.resolve(null);
  return Online.db.ref('feed/' + uid + '/pt').get().then(s=>{
    try{
      const v = s && s.val();
      const arr = (typeof v === 'string') ? JSON.parse(v) : null;
      return (Array.isArray(arr) && arr.length) ? arr.slice(0,3) : null;
    }catch(e){ return null; }
  }).catch(()=>null);
}
/* กด follow — ทางเดียวไม่ต้องอนุมัติ · จำชื่อ/ชั้นเป้าหมายใน state (ไว้โชว์ใน feed) */
function followSet(uid, n, g){
  if(!uid || uid === onlineKey()) return Promise.resolve(false);
  state.follows[uid] = {n: n || 'เพื่อน', g: g || '', ts: Date.now()};
  saveState();
  feedWatchSync();
  if(!Online.ready || !Online.db) return Promise.resolve(true);
  return Online.db.ref('follow/' + uid + '/' + onlineKey()).set({
    n: (onlineDisplayName() || 'เพื่อน').slice(0,40),
    ts: firebase.database.ServerValue.TIMESTAMP,
  }).then(()=>true).catch(()=>true);
}
function followUnset(uid){
  delete state.follows[uid];
  saveState();
  feedWatchSync();
  if(Online.db) Online.db.ref('follow/' + uid + '/' + onlineKey()).remove().catch(()=>{});
}
/* รวม feed ทุกคนที่ follow → เรียงใหม่→เก่า แล้ววาดการ์ด */
function feedRebuild(){
  const all = [];
  for(const uid in Online.feedBy){
    const f = (state.follows && state.follows[uid]) || {};
    for(const it of Online.feedBy[uid])
      all.push({uid, n: f.n || 'เพื่อน', g: f.g || '', c: it.c, tx: it.tx, ts: it.ts});
  }
  all.sort((a,b)=>b.ts - a.ts);
  Online.feed = all.slice(0, 60);
  if(typeof renderFeedCard === 'function') renderFeedCard();
}
/* ปรับ watcher ให้ตรงกับรายชื่อที่ follow อยู่ (แนวเดียวกับ chatWatchSync) */
function feedWatchSync(){
  if(!Online.db) return;
  const want = state.follows || {};
  for(const uid in Online.feedRefs){
    if(want[uid]) continue;
    Online.feedRefs[uid].off();
    delete Online.feedRefs[uid];
    delete Online.feedBy[uid];
  }
  for(const uid in want){
    if(Online.feedRefs[uid]) continue;
    const q = Online.db.ref('feed/' + uid + '/p').orderByKey().limitToLast(FEED_MAX);
    Online.feedRefs[uid] = q;
    q.on('value', (snap)=>{
      const out = [];
      snap.forEach(ch=>{
        const v = ch.val();
        if(v && typeof v.tx === 'string' && typeof v.ts === 'number')
          out.push({c: typeof v.c === 'string' ? v.c : 'other', tx: v.tx, ts: v.ts});
      });
      Online.feedBy[uid] = out;
      feedRebuild();
    }, ()=>{ /* อ่านโดน deny (rules ยังไม่ publish) — เงียบไว้ เกมปกติ */ });
  }
  feedRebuild();
}
/* อ่านกิจกรรมล่าสุดของผู้เล่นคนหนึ่ง (เปิดหน้า profile ใครก็เห็น — ตามหมวดที่เจ้าตัวเปิด) */
function fetchPlayerFeed(uid){
  if(!Online.ready || !uid) return Promise.resolve([]);
  return Online.db.ref('feed/' + uid + '/p').orderByKey().limitToLast(FEED_MAX).get().then(s=>{
    const out = [];
    s.forEach(ch=>{
      const v = ch.val();
      if(v && typeof v.tx === 'string') out.push({c: v.c || 'other', tx: v.tx, ts: v.ts || 0});
    });
    out.sort((a,b)=>b.ts - a.ts);
    return out;
  }).catch(()=>[]);
}
/* อ่านคลังทรัพย์สินที่ผู้เล่นเปิดเผย → {collectId:จำนวน} หรือ null (ตัวเอง=สดจาก state) */
function fetchPlayerAssets(uid){
  if(!uid) return Promise.resolve(null);
  if(uid === onlineKey()){
    if(!state.feedShare || !state.feedShare.assets) return Promise.resolve(null);
    const counts = {};
    for(const id of state.collection) counts[id] = (counts[id]||0) + 1;
    for(const l of state.listings) counts[l.id] = (counts[l.id]||0) + 1;
    return Promise.resolve(counts);
  }
  if(!Online.ready) return Promise.resolve(null);
  return Online.db.ref('feed/' + uid + '/a').get().then(s=>{
    try{
      const v = s && s.val();
      const obj = (typeof v === 'string') ? JSON.parse(v) : null;
      return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : null;
    }catch(e){ return null; }
  }).catch(()=>null);
}
/* นับผู้ติดตามของผู้เล่นคนหนึ่ง (โชว์ในหน้า profile) — null = อ่านไม่ได้ */
function fetchFollowers(uid){
  if(!Online.ready || !uid) return Promise.resolve(null);
  return Online.db.ref('follow/' + uid).get().then(s=>{
    let n = 0;
    s.forEach(()=>{ n++; });
    return n;
  }).catch(()=>null);
}

/* ============================================================
   📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625)
   เสียง+ภาพวิ่งตรงระหว่างเครื่อง (WebRTC P2P) · Firebase ใช้แค่ "กริ่ง" + signaling
   /calls/<toUid>/<fromUid> = {k, n, m, ts}
     k = 'ring' เรียกเข้า | 'ok' รับสาย | 'no' ไม่รับ | 'busy' ติดสายอื่น | 'end' วางสาย
     m = 'voice' | 'video' · n = ชื่อผู้โทร (โชว์บนกริ่ง)
     ผู้โทรตั้ง onDisconnect().remove() → ปิดแท็บกลางคัน กริ่งฝั่งโน้นดับเอง
   /rtc/chat/<toUid>/<msgId> = {f,t,d,ts} — offer/answer/ice (โครงเดียวกับ voice chat ในโลก 3D)
   🔒 กติกาเด็ก: โทร/รับได้เฉพาะ "เพื่อนที่เพิ่มกันแล้ว" · กล้อง-ไมค์เปิดตอนกดรับเท่านั้น
      · วางสายแล้วคืนกล้อง/ไมค์ให้เครื่องทุกครั้ง (track.stop)
   ⚠️ ต้อง publish rules โซน /calls + เพิ่ม 'chat' ใน enum ของ /rtc ก่อนถึงใช้ได้จริง
      (ยังไม่ publish = เขียนโดน deny → โค้ดบอกผู้ใช้บนจอเลยว่าติดตรงไหน ไม่เงียบ)
   ============================================================ */
const CALL_RTC_CFG = {iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}]};
const CALL_RING_MS = 35000;        // เรียกแล้วไม่มีคนรับ 35 วิ = สายไม่ได้รับ
const CALL_MAX_MS  = 60*60*1000;   // กันสายค้างลืมวาง — ตัดที่ 60 นาที

const Call = {
  st:'idle',            // idle | out (กำลังเรียกออก) | in (มีสายเข้า) | live (คุยอยู่)
  peer:null,            // {uid, n}
  kind:'voice',         // ชนิดสายที่ตกลงกัน
  caller:false,         // เราเป็นฝ่ายโทรออก (ฝ่ายนี้เป็นคนสร้าง offer + คนบันทึกผลลงแชท)
  pc:null, dc:null, local:null, remote:null,
  iceQ:[], haveRemote:false,
  micOn:true, camOn:true, spkOn:true, facing:'user',
  startedAt:0, ringTimer:null, maxTimer:null,
  inRef:null, rtcRef:null, _last:{},
  rulesOk:true,         // false = เขียน /calls ไม่ผ่าน (ยังไม่ publish rules)

  busy(){ return this.st !== 'idle'; },
  isFriend(uid){ return (Online.myFriends || []).some(f=>f.uid === uid); },
  ui(fn, ...a){ if(typeof callUI !== 'undefined' && typeof callUI[fn] === 'function') callUI[fn](...a); },

  /* ---------- เฝ้ากริ่ง + ท่อ signaling (ตั้งครั้งเดียวตอน onlineStart) ---------- */
  watch(){
    if(this.inRef || !Online.db) return;
    const me = onlineKey();
    this.inRef = Online.db.ref('calls/' + me);
    this.inRef.remove().catch(()=>{});                       // ล้างกริ่งค้างจากรอบก่อน
    this.inRef.onDisconnect().remove();                      // 🧹 ปิดแท็บ/เน็ตหลุด = ล้างกล่องตัวเองให้เกลี้ยง
    this.inRef.on('child_added',   s=>this.onSignal(s.key, s.val()));
    this.inRef.on('child_changed', s=>this.onSignal(s.key, s.val()));
    this.inRef.on('child_removed', s=>{                      // ผู้โทรยกเลิก/ปิดแท็บ → กริ่งดับเอง
      if(this.st === 'in' && this.peer && this.peer.uid === s.key) this.end('ผู้โทรวางสายไปแล้ว', true);
    });
    this.rtcRef = Online.db.ref('rtc/chat/' + me);
    this.rtcRef.remove().catch(()=>{});
    this.rtcRef.onDisconnect().remove();                     // 🧹 SDP/ICE ที่ค้างในกล่องเรา ลบทิ้งตอนหลุด
    this.rtcRef.on('child_added', s=>{
      const m = s.val(); s.ref.remove().catch(()=>{});
      if(m) this.onRtc(m);
    });
  },

  /* ---------- ส่งสัญญาณกริ่ง (สั้น ๆ ผ่าน /calls) ---------- */
  say(uid, k, extra){
    if(!Online.ready || !Online.db) return Promise.reject();
    const box = Online.db.ref('calls/' + uid + '/' + onlineKey());
    return box.set(Object.assign({k, ts: firebase.database.ServerValue.TIMESTAMP}, extra || {}));
  },
  /* ---------- ส่ง SDP/ICE (ผ่าน /rtc/chat — ก้อนใหญ่ ผู้รับอ่านแล้วลบทิ้ง) ---------- */
  sig(uid, t, d){
    if(!Online.ready || !Online.db) return;
    Online.db.ref('rtc/chat/' + uid).push({
      f: onlineKey(), t, d: JSON.stringify(d), ts: firebase.database.ServerValue.TIMESTAMP,
    }).catch(()=>{ this.rulesOk = false; });
  },

  /* ---------- ขอกล้อง/ไมค์จากเครื่อง ---------- */
  media(kind){
    const con = (kind === 'video')
      ? {audio:true, video:{facingMode:this.facing, width:{ideal:640}, height:{ideal:480}}}
      : {audio:true};
    return navigator.mediaDevices.getUserMedia(con);
  },
  mediaErr(e){
    const n = e && e.name || '';
    if(n === 'NotAllowedError' || n === 'SecurityError')
      return '🎤 ต้องกด "อนุญาต" ไมโครโฟน/กล้อง ในเบราว์เซอร์ก่อนถึงจะโทรได้นะ';
    if(n === 'NotFoundError' || n === 'OverconstrainedError')
      return '📷 เครื่องนี้ไม่มีกล้องหรือไมโครโฟนให้ใช้';
    if(n === 'NotReadableError')
      return '⚠️ กล้อง/ไมค์ถูกโปรแกรมอื่นใช้อยู่ ปิดโปรแกรมนั้นก่อนนะ';
    return '⚠️ เปิดกล้อง/ไมค์ไม่สำเร็จ ลองใหม่อีกครั้งนะ';
  },

  /* ---------- ☎️ โทรออก ---------- */
  async start(friend, kind){
    if(!friend || !friend.uid) return;
    if(!Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะโทรได้นะ 📡'); return; }
    if(this.busy()){ toast('📞 กำลังอยู่ในสายอยู่แล้วนะ'); return; }
    if(!this.isFriend(friend.uid)){ toast('โทรได้เฉพาะเพื่อนที่เพิ่มกันแล้วนะ 👫'); return; }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      toast('⚠️ เบราว์เซอร์นี้โทรไม่ได้ (ไม่รองรับกล้อง/ไมค์)'); return;
    }
    this.kind = (kind === 'video') ? 'video' : 'voice';
    this.micOn = true; this.camOn = true; this.spkOn = true; this.facing = 'user';
    try{ this.local = await this.media(this.kind); }
    catch(e){ sfx.wrong(); toast(this.mediaErr(e)); return; }
    this.st = 'out'; this.caller = true; this.peer = {uid:friend.uid, n:friend.n || 'เพื่อน'};
    this.ui('open');
    this.say(friend.uid, 'ring', {n: onlineDisplayName() || 'เพื่อน', m: this.kind})
      .then(()=>{
        Online.db.ref('calls/' + friend.uid + '/' + onlineKey()).onDisconnect().remove();
      })
      .catch(()=>{                                   // rules ยังไม่เปิด = บอกบนจอเลย ไม่ปล่อยเงียบ
        this.rulesOk = false;
        this.ui('status', '⚠️ ระบบโทรยังไม่เปิดใช้งาน<br><small>ต้องอัปเดตกฎความปลอดภัย (Firebase rules) โซน /calls ก่อนนะ</small>');
        setTimeout(()=>this.end('', true), 3200);
      });
    this.ringTimer = setTimeout(()=>{ if(this.st === 'out') this.end('ไม่มีคนรับสาย', false, 'miss'); }, CALL_RING_MS);
  },

  /* ---------- 📲 รับสาย ---------- */
  async accept(){
    if(this.st !== 'in' || !this.peer) return;
    let s;
    try{ s = await this.media(this.kind); }
    catch(e){ sfx.wrong(); toast(this.mediaErr(e)); this.decline(); return; }
    if(this.st !== 'in'){ s.getTracks().forEach(t=>t.stop()); return; }   // สายถูกวางระหว่างขออนุญาต
    this.local = s;
    this.st = 'live'; this.startedAt = Date.now();
    this.makePC();                                   // เตรียม pc ให้พร้อมก่อนบอก "รับสาย" (offer จะตามมา)
    this.say(this.peer.uid, 'ok').catch(()=>{});
    this.ui('open'); this.ui('live');
    this.armMax();
  },
  decline(){
    if(!this.peer) return;
    this.say(this.peer.uid, 'no').catch(()=>{});
    this.end('', true);
  },
  hangup(){
    if(this.peer) this.say(this.peer.uid, 'end').catch(()=>{});
    const dur = this.startedAt ? Date.now() - this.startedAt : 0;
    this.end('', true, dur ? 'done' : (this.caller ? 'cancel' : ''));
  },

  /* ---------- 🔌 WebRTC ---------- */
  makePC(){
    if(this.pc) return this.pc;
    const pc = new RTCPeerConnection(CALL_RTC_CFG);
    this.pc = pc; this.iceQ = []; this.haveRemote = false;
    this.remote = new MediaStream();
    if(this.local) this.local.getTracks().forEach(t=>pc.addTrack(t, this.local));
    pc.onicecandidate = e=>{ if(e.candidate && this.peer) this.sig(this.peer.uid, 'ice', e.candidate.toJSON()); };
    pc.ontrack = e=>{
      e.streams[0].getTracks().forEach(t=>{ if(!this.remote.getTracks().includes(t)) this.remote.addTrack(t); });
      this.ui('remote', this.remote);
    };
    pc.onconnectionstatechange = ()=>{
      if(pc.connectionState === 'connected') this.ui('status', '');
      if(pc.connectionState === 'failed') this.end('สายหลุด — สัญญาณเชื่อมต่อไม่ได้', true);
    };
    /* 💛 ดีกว่า LINE: ช่องส่ง "อิโมจิลอย" ระหว่างคุย (วิ่ง P2P ไม่ผ่านเซิร์ฟเวอร์) */
    if(this.caller){
      this.dc = pc.createDataChannel('rx');
      this.bindDC(this.dc);
    }else{
      pc.ondatachannel = e=>{ this.dc = e.channel; this.bindDC(this.dc); };
    }
    return pc;
  },
  bindDC(dc){
    dc.onmessage = e=>{
      const raw = String(e.data || '');
      if(raw === 'neg'){ if(this.caller) this.offer(); return; }   // อีกฝ่ายเพิ่งเปิดกล้อง → เจรจา SDP ใหม่
      const t = raw.slice(0, 4);
      if(t) this.ui('reaction', t, false);
    };
  },
  sendReaction(emo){
    this.ui('reaction', emo, true);
    try{ if(this.dc && this.dc.readyState === 'open') this.dc.send(emo); }catch(e){}
  },
  async offer(){
    const pc = this.makePC();
    try{
      const of = await pc.createOffer();
      await pc.setLocalDescription(of);
      this.sig(this.peer.uid, 'offer', pc.localDescription.toJSON());
    }catch(e){ this.end('ต่อสายไม่สำเร็จ ลองใหม่นะ', true); }
  },
  async onRtc(m){
    if(!this.peer || m.f !== this.peer.uid || this.st === 'idle') return;
    let d; try{ d = JSON.parse(m.d); }catch(e){ return; }
    if(m.t === 'offer'){
      const pc = this.makePC();
      try{
        await pc.setRemoteDescription(d); this.haveRemote = true;
        this.iceQ.splice(0).forEach(c=>pc.addIceCandidate(c).catch(()=>{}));
        const an = await pc.createAnswer();
        await pc.setLocalDescription(an);
        this.sig(m.f, 'answer', pc.localDescription.toJSON());
      }catch(e){}
    }else if(m.t === 'answer'){
      if(!this.pc) return;
      try{
        await this.pc.setRemoteDescription(d); this.haveRemote = true;
        this.iceQ.splice(0).forEach(c=>this.pc.addIceCandidate(c).catch(()=>{}));
      }catch(e){}
    }else if(m.t === 'ice'){
      if(!this.pc) return;
      if(this.haveRemote) this.pc.addIceCandidate(d).catch(()=>{});
      else this.iceQ.push(d);
    }
  },

  /* ---------- 🔔 กริ่งเข้า/สถานะจากอีกฝ่าย ---------- */
  onSignal(uid, v){
    if(!v || typeof v.k !== 'string') return;
    const sigId = v.k + '|' + (v.ts || 0);
    if(this._last[uid] === sigId) return;              // กันประมวลผลซ้ำ (child_added + child_changed)
    this._last[uid] = sigId;
    const clear = ()=>{ if(Online.db) Online.db.ref('calls/' + onlineKey() + '/' + uid).remove().catch(()=>{}); };

    if(v.k === 'ring'){
      if(!this.isFriend(uid)){ clear(); return; }      // 🔒 คนแปลกหน้าโทรเข้าไม่ได้
      // 🧹 กริ่งค้างเก่า (เครื่องผู้โทรดับกลางคัน onDisconnect ไม่ทัน) → ลบทิ้ง ไม่ปลุกทีหลัง
      if(typeof v.ts === 'number' && Date.now() - v.ts > CALL_RING_MS + 15000){ clear(); return; }
      if(this.busy()){ this.say(uid, 'busy').catch(()=>{}); clear(); return; }
      this.kind = (v.m === 'video') ? 'video' : 'voice';
      this.micOn = true; this.camOn = true; this.spkOn = true; this.facing = 'user';
      this.caller = false; this.st = 'in';
      const fr = (Online.myFriends || []).find(f=>f.uid === uid);
      this.peer = {uid, n: (fr && fr.n) || (typeof v.n === 'string' ? v.n : 'เพื่อน')};
      this.ui('incoming');
      this.ringTimer = setTimeout(()=>{ if(this.st === 'in') this.end('', true); }, CALL_RING_MS);
      return;
    }
    if(!this.peer || this.peer.uid !== uid) { clear(); return; }
    if(v.k === 'ok'){                                   // อีกฝ่ายกดรับ → เราเป็นคนยิง offer
      if(this.st !== 'out') return;
      clearTimeout(this.ringTimer); this.ringTimer = null;
      this.st = 'live'; this.startedAt = Date.now();
      this.ui('live'); this.armMax();
      this.offer();
    }else if(v.k === 'no'){
      this.end('ตอนนี้เพื่อนยังรับสายไม่ได้', false, 'reject');
    }else if(v.k === 'busy'){
      this.end('เพื่อนกำลังติดสายอื่นอยู่', false, 'busy');
    }else if(v.k === 'end'){
      const dur = this.startedAt ? Date.now() - this.startedAt : 0;
      this.end('', true, dur ? 'done' : '');
    }
  },

  armMax(){
    clearTimeout(this.maxTimer);
    this.maxTimer = setTimeout(()=>this.hangup(), CALL_MAX_MS);
  },

  /* ---------- ปุ่มระหว่างคุย ---------- */
  setMic(on){
    this.micOn = on;
    if(this.local) this.local.getAudioTracks().forEach(t=>{ t.enabled = on; });
    this.ui('btns');
  },
  setCam(on){
    this.camOn = on;
    if(this.local) this.local.getVideoTracks().forEach(t=>{ t.enabled = on; });
    this.ui('btns');
  },
  setSpk(on){ this.spkOn = on; this.ui('btns'); },
  /* 🔄 สลับกล้องหน้า/หลัง (มือถือ) — เปลี่ยน track ในสายเดิม ไม่ต้องต่อสายใหม่ */
  async flipCam(){
    if(this.kind !== 'video' || !this.local) return;
    this.facing = (this.facing === 'user') ? 'environment' : 'user';
    try{
      const ns = await navigator.mediaDevices.getUserMedia({video:{facingMode:this.facing}, audio:false});
      const nt = ns.getVideoTracks()[0];
      const old = this.local.getVideoTracks()[0];
      if(this.pc){
        const snd = this.pc.getSenders().find(s=>s.track && s.track.kind === 'video');
        if(snd) await snd.replaceTrack(nt);
      }
      if(old){ this.local.removeTrack(old); old.stop(); }
      this.local.addTrack(nt);
      nt.enabled = this.camOn;
      this.ui('localTrack');
    }catch(e){ toast('🔄 สลับกล้องไม่สำเร็จ (เครื่องนี้มีกล้องเดียว)'); }
  },
  /* 📹 ชวนเปิดกล้องระหว่างสายเสียง (voice → video) — ขอ track ใหม่แล้วต่อสายเดิม */
  async addVideo(){
    if(this.st !== 'live' || this.kind === 'video' || !this.pc) return;
    try{
      const ns = await navigator.mediaDevices.getUserMedia({video:{facingMode:this.facing, width:{ideal:640}, height:{ideal:480}}, audio:false});
      const nt = ns.getVideoTracks()[0];
      this.local.addTrack(nt);
      this.pc.addTrack(nt, this.local);
      this.kind = 'video'; this.camOn = true;
      this.ui('localTrack'); this.ui('btns');
      if(this.caller) this.offer();                    // ฝ่ายโทรออกเป็นคนเจรจาใหม่ (กันชนกัน)
      else this.sendRenegotiate();
    }catch(e){ toast(this.mediaErr(e)); }
  },
  sendRenegotiate(){ try{ if(this.dc && this.dc.readyState === 'open') this.dc.send('neg'); }catch(e){} },

  /* ---------- วางสาย/เก็บกวาด ---------- */
  end(note, silent, log){
    const peer = this.peer, caller = this.caller, kind = this.kind;
    const dur = this.startedAt ? Date.now() - this.startedAt : 0;
    clearTimeout(this.ringTimer); this.ringTimer = null;
    clearTimeout(this.maxTimer);  this.maxTimer = null;
    if(this.pc){ try{ this.pc.close(); }catch(e){} }
    this.pc = null; this.dc = null; this.iceQ = []; this.haveRemote = false;
    if(this.local){ this.local.getTracks().forEach(t=>t.stop()); }    // 🎤 คืนกล้อง/ไมค์ให้เครื่อง
    this.local = null; this.remote = null;
    if(peer && Online.db && Online.ready){
      const mine = Online.db.ref('calls/' + peer.uid + '/' + onlineKey());
      try{ mine.onDisconnect().cancel(); }catch(e){}
      mine.remove().catch(()=>{});
      Online.db.ref('calls/' + onlineKey() + '/' + peer.uid).remove().catch(()=>{});
    }
    this.st = 'idle'; this.peer = null; this.startedAt = 0; this.caller = false; this._last = {};
    this.ui('close', note || '');
    if(note && !silent && typeof toast === 'function') toast('📞 ' + note);
    if(log && caller && peer) this.logChat(peer.uid, log, kind, dur);
  },
  /* 📝 บันทึกผลสายลงห้องแชท (ฝ่ายโทรออกเป็นคนบันทึก — ห้องแชทใช้ร่วมกันทั้งคู่ ไม่ซ้ำ) */
  logChat(uid, kind, ctype, dur){
    if(typeof chatSend !== 'function') return;
    const ic = (ctype === 'video') ? '📹' : '📞';
    let txt = '';
    if(kind === 'done'){
      const s = Math.max(1, Math.round(dur/1000));
      const mm = Math.floor(s/60), ss = s%60;
      txt = ic + ' คุยสายกัน ' + (mm ? mm + ' นาที ' : '') + ss + ' วินาที';
    }
    else if(kind === 'miss')   txt = ic + ' สายที่ไม่ได้รับ';
    else if(kind === 'reject') txt = ic + ' เพื่อนยังรับสายไม่ได้';
    else if(kind === 'busy')   txt = ic + ' เพื่อนติดสายอื่นอยู่';
    else if(kind === 'cancel') txt = ic + ' ยกเลิกสายไปแล้ว';
    if(txt) chatSend(uid, txt).catch(()=>{});
  },
};

function onlineStart(){
  if(Online.started) return;   // รอบ 267: กันรันซ้ำ (เรียกได้ทั้งจาก authEnterGame และ authLateSync หลังเล่นออฟไลน์)
  Online.started = true;
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
      feedWatchSync();               // 📰 รอบ 155: เริ่มฟัง feed ของคนที่เรา follow
      feedPushAssets();              // 📰 คลังทรัพย์สินที่เปิดเผย (เขียนเฉพาะตอนค่าเปลี่ยน)
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
    notifyFriendBadges(out);          // 🔔 เพื่อนเพิ่งได้เข็มใหม่ → เด้ง toast ให้กำลังใจแข่งสะสม
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
    friendsHeal();                 // ซ่อมเพื่อนให้ครบสองฝ่ายอัตโนมัติ (self-heal)
    chatWatchSync();               // เพื่อนเปลี่ยน → ปรับ watcher ข้อความใหม่ให้ครบ (ข้อ 0.4)
    giftOutWatchSync();            // เพื่อนเปลี่ยน → ปรับ watcher สถานะของขวัญที่เราส่งไป (ข้อ 0.5)
    onlineRerender();
  });

  // ฟัง Leaderboard Top 50 (RTDB ให้มาเรียงน้อย→มาก กลับด้านเป็นมาก→น้อย)
  Online.db.ref('leaderboard').orderByChild('coins').limitToLast(LEADERBOARD_SIZE).on('value', (snap)=>{
    const out = [];
    snap.forEach(ch=>{
      const v = ch.val();
      if(!v || typeof v.coins !== 'number' || typeof v.n !== 'string') return;
      out.push({id: ch.key, n: v.n, g: v.g || '', coins: v.coins,
                av: typeof v.av === 'number' ? v.av : null,
                ni: typeof v.ni === 'number' ? v.ni : null,
                bk: typeof v.bk === 'number' ? v.bk : 0,     // 🤖 รอบ 228: บอสที่ล้ม (กระดานโลกหุ่น)
                ws: typeof v.ws === 'number' ? v.ws : 0});   // 🔎 รอบ 590: แต้มสะสมเกมค้นหาคำ
    });
    out.sort((a,b)=>b.coins - a.coins);
    Online.board = out;
    onlineRerender();
  });

  // ฟังกล่องของขวัญที่มีคนส่งมาหาเรา (ข้อ 0.5 — path คงที่ ตั้งครั้งเดียว)
  giftInWatch();

  // ฟังคำเชิญเล่นโลก 3D ด้วยกัน (path คงที่ ตั้งครั้งเดียว)
  tinvWatch();

  // 📞 รอบ 625: เฝ้ากริ่งโทรเข้า + ท่อ signaling ของสาย (ใช้ได้ทุกหน้าในเกม รวมโลก 3D)
  Call.watch();

  // 🏪 ตลาดออนไลน์จริง (item 2): ฟังประกาศขายทั้งเซิร์ฟเวอร์ + ใบเสร็จของที่เราขายได้
  marketWatch();
  marketSoldWatch();

  // 🛒 ยอดขายสินค้ารวมทั้งเซิร์ฟเวอร์ (รอบ 208) — โชว์ "ขายแล้ว N ชิ้น"
  salesWatch();

  // ส่งสถานะ + คะแนนเป็นระยะ (เหรียญไม่ขยับจะไม่เขียน leaderboard ซ้ำ)
  setInterval(()=>{ onlinePushPresence(); onlinePushScore(); }, ONLINE_BEAT_MS);
}

/* ---------- โหลด Firebase SDK แบบ dynamic (app → auth → database)
   โหลดครบ → authStart() พาเข้าระบบ login
   โหลดไม่ได้ → หน้าประตู offline (มีปุ่มเล่นออฟไลน์ · รอบ 267)
   เรียกซ้ำได้: หลังเข้าเกมออฟไลน์ auth.js จะ retry ทุกครั้งที่เน็ตกลับมา ---------- */
let __sdkLoading = false;
function onlineLoadSDK(){
  if(Auth.sdkReady || __sdkLoading) return;
  __sdkLoading = true;
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
    .catch(()=>{
      __sdkLoading = false;                        // เปิดทางลองใหม่รอบหน้า
      if(!Auth.booted) authGateOffline();          // เล่นอยู่แล้ว (ออฟไลน์) → เงียบๆ ไม่เด้งหน้า login ทับ
    });
}
(function onlineInit(){
  if(typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.databaseURL){
    setTimeout(()=>authGateOffline('ตั้งค่าระบบออนไลน์ไม่ครบ (firebase-config) แจ้งคุณครูให้ตรวจสอบนะ 🛠️'), 0);
    return;
  }
  onlineLoadSDK();
})();
