/* ============================================================
   🏟️ netroom.js — ระบบ "หลายสนาม" (room sharding) กลางของทุกโลก 3D (รอบ 640)
   ใช้ร่วมกันทั้ง js/adventure3d.js · js/invasion3d.js · js/moto3d.js — ห้ามก๊อปโค้ดซ้ำอีก
   (ยกก้อน "กันผู้เล่นล้นสนาม" ของรอบ 637 ออกมาจาก invasion3d.js แล้วทำให้ทุกโลกใช้ได้)

   ── ทำไมต้องแตกสนาม ────────────────────────────────────────
   Firebase RTDB กระจาย (fanout) ทุก write ไปให้ "ทุกคนที่ฟัง node แม่เดียวกัน"
     ข้อความ/วินาที ต่อสนาม = R × (R−1) / T        (R=คนต่อสนาม · T=จังหวะส่ง)
     ทราฟฟิกรวมทั้งเกม     = จำนวนคนทั้งหมด × (R−1)/T × B
   → ทราฟฟิกรวม "ไม่ขึ้นกับจำนวนสนาม" แต่ขึ้นกับ "คนต่อสนาม"
     500 คนห้องเดียวที่ 170ms = 107 MB/วิ (โควตาฟรี 10GB หมดใน 1.5 นาที)
     500 คน สนามละ 14 คน     = 1.3 MB/วิ  (ถูกลง 82 เท่า)

   ── งบทราฟฟิก (วัดจริง รอบ 640) ────────────────────────────
   payload เดิมส่งชื่อเล่น/คะแนน/แชทซ้ำทุก 170ms = ~220 ไบต์/ข้อความ
   รอบนี้แยก "ร้อน/เย็น" (ดู splitPayload) → ~127 ไบต์/ข้อความ (−42%)
     /wroom/<map>/<room>/<uid> = {x,z,y,r,a,m,l}   ร้อน  ส่งทุก T (ข้ามถ้าไม่ขยับ)
     /winfo/<map>/<room>/<uid> = {n,w,c,k,q,h,j,t} เย็น  เขียนเฉพาะตอนเปลี่ยน + เต้นหัวใจ 20 วิ
   ต่อ 1 คน-ชั่วโมง ≈ 11.7 MB → โควตาฟรี 10GB/เดือน ≈ 850 คน-ชั่วโมง/เดือน

   ── 🚦 เพดานคน (WORLD_CAP) ─────────────────────────────────
   แพ็กเกจ Spark (ฟรี) จำกัด "เชื่อมต่อพร้อมกัน 100 ราย/ฐานข้อมูล" — เด็กเปิดเกมค้างก็กิน 1 ราย
   → 500 คนพร้อมกันทำไม่ได้บนแพ็กเกจฟรี ไม่ว่าโค้ดจะดีแค่ไหน
   ตอนนี้ตั้ง WORLD_CAP=80 (ปลอดภัยกับฟรี) · โครงสร้างรองรับ 500+ อยู่แล้ว
   **วันไหนอัปเป็น Blaze แก้เลขเดียว WORLD_CAP=504 ก็ได้ 36 สนามเต็มทันที ไม่ต้องแก้อย่างอื่นเลย**

   ── 🧓 แผนรองรับเครื่องที่ยังไม่อัปเดต ──────────────────────
   ① เครื่องเก่ายังเขียน/อ่าน `/world/<map>/<uid>` เหมือนเดิมเป๊ะ — path นั้นกับ rules ของมันไม่ถูกแตะเลย
      เครื่องเก่าจึงเล่นด้วยกันเองได้ปกติ ไม่พัง แค่ยังไม่เห็นคนที่อัปแล้ว (ได้แถบ "มีเวอร์ชันใหม่" อยู่แล้ว)
   ② เครื่องใหม่ "มองเห็น" เครื่องเก่าด้วย (สะพานอ่านอย่างเดียว ดู LEGACY_BRIDGE)
      ฟัง `/world/<map>` แบบจำกัด LEGACY_WATCH คน → ทราฟฟิกมีเพดาน ไม่ระเบิด
      เครื่องใหม่ **ไม่เขียนลง `/world` เด็ดขาด** — ถ้าเขียน เครื่องใหม่คนอื่นจะเห็นกันข้ามสนามผ่านสะพาน = เพดานสนามพัง
      หมดช่วงเปลี่ยนผ่านแล้วปิด LEGACY_BRIDGE=false ได้เลย (รอบถัดไป)
   ③ rules ยังไม่ publish → เขียน /wroom โดน PERMISSION_DENIED → goLegacy() ตกกลับไปเล่น
      "สนามเดียวแบบเดิม" อัตโนมัติ (เพดาน ROOM_MAX เหมือนรอบ 637) — เกมไม่พัง ไม่ต้องรอ publish
   ============================================================ */
(function(){
'use strict';

/* ── ค่าคงที่กลาง (แก้ที่เดียว มีผลทุกโลก) ───────────────── */
const CFG = {
  ROOM_MAX:      14,      // คนต่อสนาม (วัดแล้วมือถือเด็กไหว · ยิ่งมากยิ่งเปลืองทราฟฟิกเป็นเส้นตรง)
  ROOMS_MAX:     36,      // เพดานจำนวนสนามที่ rules รับ (r0..r35 = 504 คน ≥ เป้า 500)
  WORLD_CAP:     80,      // 🚦 เพดานคนพร้อมกันทั้งเกม — ตัวเดียวที่ต้องแก้ตอนอัป Blaze
  ROOM_GHOST_MS: 90000,   // ตอนนับหัว: t เก่ากว่านี้ = ผีค้าง ไม่นับเป็นคน
  ROOM_RETRY_MS: 20000,   // ทุกสนามเต็ม → ลองหาที่ว่างใหม่ทุก 20 วิ
  PEER_STALE_MS: 45000,   // เพื่อนเงียบเกินนี้ = ผีค้าง เอาออกจากจอ (> เต้นหัวใจ 2 ครั้ง)
  INFO_BEAT_MS:  20000,   // เต้นหัวใจ node เย็น — คนยืนนิ่งไม่ส่งตำแหน่งก็ยังไม่ถูกนับเป็นผี
  CROWD_PER:     6,       // ทุก ๆ กี่คนที่เพิ่ม ยืดจังหวะส่งขึ้น 1 เท่า
  NET_GAP_MAX:   3,       // ยืดได้มากสุดกี่เท่า
  VERIFY_MS:     2500,    // หลังเข้าสนามกี่ ms ค่อยตรวจว่าตัวเองมีสิทธิ์นั่งจริง (กันแห่เข้าพร้อมกัน)
  LEGACY_BRIDGE: true,    // เห็นเครื่องที่ยังไม่อัปเดตไหม (ปิดได้เมื่อพ้นช่วงเปลี่ยนผ่าน)
  LEGACY_WATCH:  8,       // สะพานเครื่องเก่า: ฟังมากสุดกี่คน (คุมทราฟฟิกให้มีเพดาน)
  MEET_TRIES:    3,       // 🤝 นัดเจอเพื่อน: ตามหาเพื่อนที่ชวนกันซ้ำได้กี่ครั้งหลังเข้าสนามแล้ว
  MEET_GAP_MS:   7000,    // เว้นกี่ ms ต่อครั้ง (เพื่อนอาจกดเข้าโลกช้ากว่าเราไม่กี่วินาที)
  RESERVE_TTL_MS: 120000, // 🪑 กันที่ไว้ให้เพื่อนที่ชวนกัน (ยังไม่มาถึง) ได้นานสุดกี่ ms ก่อนปล่อยที่คืน
};

/* จำนวนสนามที่เปิดใช้จริง = คุมโดย WORLD_CAP (80/14 → 6 สนาม)
   cap = เพดานคนต่อสนามของ "โลกนั้น" (รอบ 685) — โลกที่จำกัดคนน้อย ต้องเปิดสนามเยอะขึ้น
   ไม่งั้นโลกที่ตั้งเพดานต่อห้องต่ำจะเปิดจำนวนห้องไม่พอกับ WORLD_CAP
   เช่น โรงแรม 6 คน/หลัง → ceil(80/6)=14 หลัง รองรับผู้เล่นพร้อมกันตามงบโลก */
function roomsAllowed(cap){
  const per=Math.max(1, cap || CFG.ROOM_MAX);
  return Math.max(1, Math.min(CFG.ROOMS_MAX, Math.ceil(CFG.WORLD_CAP / per)));
}

/* ── แผนที่ชื่อฟิลด์: ชื่อยาว (โลกใช้) ↔ ชื่อสั้น (สายส่งใช้) ──
   โลก 3D ยังสร้าง payload ด้วยชื่อเดิมทุกตัว (n,x,z,yaw,av,w,c,ct,cw,hp,m,tl)
   โมดูลนี้ย่อชื่อ + แยกร้อน/เย็นให้เอง แล้วคืนกลับเป็นชื่อเดิมตอนรับ → โลกไม่ต้องรู้เรื่องเลย */
const HOT_KEYS  = {x:'x', z:'z', y:'y', yaw:'r', av:'a', m:'m', tl:'l'};
const COLD_KEYS = {n:'n', w:'w', c:'c', ct:'k', cw:'q', hp:'h'};
const HOT_BACK={}, COLD_BACK={};
for(const k in HOT_KEYS)  HOT_BACK[HOT_KEYS[k]]=k;
for(const k in COLD_KEYS) COLD_BACK[COLD_KEYS[k]]=k;

function splitPayload(p){
  const hot={}, cold={};
  for(const k in p){
    const v=p[k];
    if(v===undefined || v===null) continue;
    if(HOT_KEYS[k]!==undefined)       hot[HOT_KEYS[k]]=v;
    else if(COLD_KEYS[k]!==undefined) cold[COLD_KEYS[k]]=v;
    /* ฟิลด์อื่น (เช่น ts เดิม) ทิ้ง — เวลาใช้ `t` ใน node เย็นแทน ไม่ต้องส่งซ้ำทุกเฟรม */
  }
  return {hot, cold};
}
function mergeBack(hot, cold){
  const d={};
  if(cold) for(const k in cold){ const o=COLD_BACK[k]; if(o!==undefined) d[o]=cold[k]; }
  if(hot)  for(const k in hot ){ const o=HOT_BACK[k];  if(o!==undefined) d[o]=hot[k];  }
  return d;
}

/* ── 🤝 ใครบ้างที่ "นัดกันเล่นโลกนี้" ──────────────────────────────
   ใช้คำเชิญเล่นโลก 3D ที่มีอยู่แล้ว (`/tinv`) — ไม่ต้องเพิ่ม path ใหม่ ไม่ต้องแก้ rules
     Online.tinv      = คำเชิญที่ "เพื่อนชวนเรา"  {uid:{map,n,ts}}
     state.tinvSent   = คำเชิญที่ "เราชวนเพื่อน" {uid:{map,ts}}
   นับทั้งสองทาง เพราะใครกดเข้าโลกก่อนก็ได้ */
function metUids(map){
  const out={};
  try{
    const inv=(typeof Online!=='undefined' && Online.tinv) || {};
    for(const uid in inv) if(inv[uid] && inv[uid].map===map) out[uid]=inv[uid].n||'เพื่อน';
    const sent=(typeof state!=='undefined' && state && state.tinvSent) || {};
    for(const uid in sent) if(sent[uid] && sent[uid].map===map && !out[uid]) out[uid]='เพื่อน';
    const a=aimGet(map);                       // 🎯 กด "ตามเข้าไป" จากแผงเพื่อนในล็อบบี้ = นัดเจอแบบหนึ่ง
    if(a && !out[a.uid]) out[a.uid]=a.n;
  }catch(e){}
  return out;
}

/* ── 🎯 "ตามเพื่อนเข้าไป" จากล็อบบี้ (รอบ 642) ──────────────────────
   แผงเพื่อนในล็อบบี้ (js/ui.js) รู้แล้วว่าเพื่อนอยู่โลกไหน/สนามไหน จาก whereFriends()
   กดปุ่ม "ตามเข้าไป" = **ตั้งเป้าไว้เฉย ๆ** แล้วค่อยเข้าโลกตามปกติ
   → ตอน join ระบบ "นัดเจอกัน" ของรอบ 641 (metUids → findMet) พาไปสนามเดียวกับเพื่อนให้เอง
     ไม่ต้องเขียนทางเข้าสนามใหม่ · เพื่อนย้ายสนามระหว่างที่เรากำลังโหลดโลกก็ยังตามเจอ
   เก็บในหน่วยความจำอย่างเดียว — ไม่มี path ใหม่ ไม่ต้องแก้ rules */
const AIM_TTL_MS = 120000;      // ตั้งเป้าแล้วต้องเข้าโลกภายในเวลานี้ (โหลดโลก 3D ครั้งแรกกินเวลาหลายวินาที)
let aim = null;                 // {map, room, uid, n, at}
function aimAt(map, room, uid, n){
  if(!map || !uid) return;
  aim={map:map, room:(typeof room==='number'?room:0), uid:uid, n:n||'เพื่อน', at:Date.now()};
}
function aimGet(map){
  if(!aim || (map && aim.map!==map) || Date.now()-aim.at>AIM_TTL_MS) return null;
  return aim;
}
function aimClear(){ aim=null; }

/* ── 🌍 เพื่อนคนไหนอยู่โลก 3D ไหน/สนามไหน (ล็อบบี้เรียกตอนเปิดแผงเพื่อน) ──
   อ่าน node เย็น "โลกละ 1 ครั้ง" (rules ให้ `.read` ที่ระดับ $map อยู่แล้ว) = 9 อ่าน/ครั้ง
   ไม่ใช่ไล่ทีละสนาม (จะกลายเป็น 9×สนาม) · ความถี่คุมอีกชั้นที่ js/ui.js
   คืน {found:{uid:{map,room,n,t}}, denied:true ถ้าอ่านไม่ได้ (rules ยังไม่ publish)} */
const MAPS3D = ['adv','haunt','heli','drone','drive','soccer','moto','invasion','mecha','f1'];   // 🏎️ รอบ 896: โลกแข่งรถ F1
function whereFriends(uids){
  const db=dbOf(), ids=uids||{};
  if(!db || !Object.keys(ids).length) return Promise.resolve({found:{}, denied:false});
  const now=Date.now(), found={};
  let denied=0;
  return Promise.all(MAPS3D.map(function(map){
    return db.ref('winfo/'+map).once('value').then(function(snap){
      const rooms=snap.val()||{};
      for(const rkey in rooms){
        const r=parseInt(String(rkey).replace(/^r/,''),10);
        const v=rooms[rkey]||{};
        for(const uid in v){
          if(!ids[uid] || !v[uid]) continue;
          const t=(typeof v[uid].t==='number') ? v[uid].t : 0;
          if(t && now-t>CFG.ROOM_GHOST_MS) continue;          // ผีค้าง (ปิดเครื่องดื้อ ๆ) ไม่นับว่าอยู่
          const old=found[uid];
          if(old && old.t>=t) continue;                        // โผล่หลายที่ = เชื่ออันที่สดกว่า
          found[uid]={map:map, room:(isFinite(r)?r:0), n:v[uid].n||'', t:t};
        }
      }
    }).catch(function(e){ if(isDenied(e)) denied++; });
  })).then(function(){ return {found:found, denied:denied>0}; });
}

function dbOf(){ return (typeof Online!=='undefined' && Online.ready && Online.db) ? Online.db : null; }
function envReady(){
  return !!dbOf() && typeof onlineKey==='function' && typeof firebase!=='undefined';
}
function isDenied(e){
  const m = String((e && (e.code || e.message)) || '');
  return /permission[_ ]?denied/i.test(m);
}

/* ============================================================
   สร้างตัวจัดการสนามของโลกหนึ่ง ๆ
   opt = { map, sendMs, push(), onPeer(uid,d), onPeerGone(uid), onStatus(), toast(html,ms) }
     push()   = ให้โลกเรียก netSend(true) ของตัวเอง (โมดูลไม่รู้จัก payload ของแต่ละโลก)
     onPeer   = ได้ payload ชื่อฟิลด์เดิมทุกตัว → โค้ด onPeer เดิมของแต่ละโลกใช้ต่อได้เลย
     onStatus = สถานะสนามเปลี่ยน (เข้า/ออก/เต็ม/คนเปลี่ยน) → ให้โลกวาดป้ายใหม่
   ============================================================ */
function create(opt){
  const map     = opt.map;
  const sendMs  = opt.sendMs || 180;
  const toast   = opt.toast   || function(){};
  const onPeer  = opt.onPeer  || function(){};
  const onGone  = opt.onPeerGone || function(){};
  const onStat  = opt.onStatus|| function(){};
  const push    = opt.push    || function(){};
  /* บางโลกต้องได้ "เวลาเซิร์ฟเวอร์ต่อแพ็กเก็ต" ใน node ร้อนจริง ๆ (โลกขับรถใช้วัดอัตราชะลอ = ไฟเบรกเพื่อน)
     โลกอื่นไม่ต้อง → ประหยัดไปอีก ~20 ไบต์/ข้อความ */
  const hotTs   = !!opt.hotTs;
  /* ฟิลด์ที่ rules เก่าของ /world อาจยังไม่รับ (โหมด legacy เท่านั้น) — โดนปฏิเสธ = ตัดทิ้งแล้วส่งซ้ำ */
  const lgOpt   = opt.legacyOptional || [];
  /* 🏨 รอบ 686: ป้ายสถานะเรียก "หน่วยสนาม" ของแต่ละโลกไม่เหมือนกัน — โรงแรมผีสิงไม่ใช่สนาม
     ไม่ใส่ = ใช้คำเดิม "สนาม" ทุกที่เหมือนเดิม (โลกอื่นไม่กระทบ) */
  const ROOM_NOUN = opt.roomNoun || 'สนาม';
  const ROOM_ICON = opt.roomIcon || '🏟️';
  const ROOM_FMT  = opt.roomFmt  || function(i){ return ROOM_NOUN+' '+i; };
  /* 🚦 รอบ 684 + Phase 3: เพดานคนต่อสนามเฉพาะโลกนั้น ๆ (โรงแรมส่งค่ากำหนดของตัวเอง)
     ไม่ใส่ = ใช้ค่ากลาง ROOM_MAX เหมือนเดิมทุกโลก · เกินเพดาน = ระบบพาไปสนามถัดไปให้เอง */
  const ROOM_MAX = Math.max(1, Math.min(CFG.ROOM_MAX, opt.roomMax || CFG.ROOM_MAX));

  const peers = {};             // uid → {hot,cold,seen,legacy}
  let myUid='', idx=-1, count=0, full=false, legacy=false, joined=false, netOk=false;
  let hRef=null, iRef=null, myHot=null, myInfo=null, lgRef=null;
  let lastHot='', lastCold='', lastHotAt=0, beatAt=0, seatWritten=false, myJoinAt=0;
  let retryAt=0, sweepAt=0, verifyAt=0, busy=false, everOk=false;
  let meetLeft=0, meetAt=0, meetName='';        // 🤝 ตามหาเพื่อนที่นัดกันไว้
  let reserveSince=0;                            // 🪑 เริ่มกันที่ไว้ให้เพื่อนตั้งแต่เมื่อไร (0=ยังไม่เริ่ม)

  function esc(v){ return (typeof escapeHTML==='function') ? escapeHTML(String(v)) : String(v).replace(/[<>&]/g,''); }
  function rk(i){ return 'r'+i; }
  function hotRefOf(i){  return dbOf().ref('wroom/'+map+'/'+rk(i)); }
  function infoRefOf(i){ return dbOf().ref('winfo/'+map+'/'+rk(i)); }
  function legacyRefOf(){ return dbOf().ref('world/'+map); }

  /* ── นับหัวแบบเบา: อ่านเฉพาะ node เย็นของ "สนามเดียว" (~1KB) ไม่ใช่ทั้งโลก ──
     forPick=true (เฉพาะ pickRoom ตอนสุ่มหาสนามให้คนแปลกหน้า): คนที่กำลัง "กันที่ไว้ให้เพื่อน"
     (ดู shouldReserve — ธง h==='RSV') นับเป็น 2 ที่นั่ง กันคนแปลกหน้าเข้ามายึดที่สุดท้ายก่อนเพื่อนจะมาถึง
     goToRoom/findMet/findFriends ไม่ใช้ forPick — เพราะคนที่ถูกกันที่ไว้ให้ (หรือกด "ไปหา" เพื่อนตรง ๆ)
     ต้องเข้าได้เสมอ ไม่ให้ธงกันที่ของตัวเองย้อนมาบล็อกตัวเอง */
  function countRoom(i, forPick){
    return infoRefOf(i).once('value').then(function(snap){
      const v=snap.val()||{}, now=Date.now();
      let n=0;
      for(const uid in v){
        if(uid===myUid) continue;
        const rec=v[uid]||{};
        const t=rec.t;
        if(typeof t==='number' && now-t>CFG.ROOM_GHOST_MS) continue;   // ผีค้างไม่นับ
        n++;
        if(forPick && rec.h==='RSV') n++;
      }
      return n;
    });
  }

  /* ── เลือกสนามให้อัตโนมัติ: "อัดสนามต้น ๆ ให้เต็มก่อน" ──────────────
     ห้ามสุ่มกระจาย! เด็ก 2 คนกดเข้าโลกพร้อมกันต้องได้สนามเดียวกัน ไม่งั้นเพื่อนไม่มีวันเจอกัน
     ปกติอ่านแค่ 1 สนาม (~1KB) · แย่สุดเท่าจำนวนสนามที่เปิด */
  function pickRoom(from){
    const N=roomsAllowed(ROOM_MAX), start=Math.max(0, Math.min(N-1, from||0));
    let k=0;
    function step(){
      if(k>=N) return Promise.resolve(null);            // ทุกสนามเต็ม
      const at=(start+k)%N; k++;                        // ไล่จาก start วนไปจนครบทุกสนาม
      return countRoom(at, true).then(function(n){       // forPick=true: เคารพที่กันไว้ให้เพื่อน (ห้ามแซง)
        return (n<ROOM_MAX) ? {idx:at,count:n} : step();
      });
    }
    return step();
  }

  /* ── 🪑 รอบ 686: กันที่ไว้ให้ "เพื่อนที่ชวนกันไว้" (metUids) ที่ยังไม่มาถึง ──────────
     ผู้ใช้สั่ง 29 ก.ค. 2026: เดิมตามเพื่อนได้ แต่ถ้าสนามเขาเต็มพอดี (คนแปลกหน้าแซงเข้าที่นั่งสุดท้าย
     ก่อน) จะหลุดไปคนละสนาม → ให้กันที่ไว้จนกว่าเพื่อนจะมาถึงหรือรอนานเกินไป (RESERVE_TTL_MS)
     ใช้ฟิลด์ hp/h ที่โลกนี้ไม่เคยใช้ (มีแต่โลกเฮลิฯ ใช้จริง) — ไม่ต้องแก้ Firebase rules เลย */
  function shouldReserve(){
    if(!joined || legacy) return false;
    const want=metUids(map), keys=Object.keys(want);
    if(!keys.length){ reserveSince=0; return false; }
    if(keys.some(function(u){ return !!peers[u]; })){ reserveSince=0; return false; }   // เพื่อนมาถึงแล้ว
    if(!reserveSince) reserveSince=Date.now();
    return Date.now()-reserveSince<=CFG.RESERVE_TTL_MS;                                 // รอนานเกินไป → ปล่อยที่คืน
  }

  /* ── เข้าสนาม i จริง (ต่อ listener + เริ่มส่ง) ───────────────── */
  function attach(i, n){
    idx=i; count=n; full=false; joined=true; netOk=true;
    myJoinAt=Date.now(); seatWritten=false; lastHot=''; lastCold=''; lastHotAt=0; beatAt=0; reserveSince=0;
    hRef=hotRefOf(i); iRef=infoRefOf(i);
    myHot=hRef.child(myUid); myInfo=iRef.child(myUid);
    try{ myHot.onDisconnect().remove(); myInfo.onDisconnect().remove(); }catch(e){}
    hRef.on('child_added',  onHotSnap);
    hRef.on('child_changed',onHotSnap);
    hRef.on('child_removed',onHotGone);
    iRef.on('child_added',  onColdSnap);
    iRef.on('child_changed',onColdSnap);
    iRef.on('child_removed',onHotGone);
    verifyAt = performance.now() + CFG.VERIFY_MS;
    bridgeOn();
    push();                       // ให้โลกยิง payload ชุดแรกทันที (สร้าง node เย็นที่มี j/t)
    onStat();
  }
  function detachRoom(){
    if(hRef){ hRef.off('child_added'); hRef.off('child_changed'); hRef.off('child_removed'); }
    if(iRef){ iRef.off('child_added'); iRef.off('child_changed'); iRef.off('child_removed'); }
    if(myHot){  try{ myHot.onDisconnect().cancel();  myHot.remove().catch(function(){});  }catch(e){} }
    if(myInfo){ try{ myInfo.onDisconnect().cancel(); myInfo.remove().catch(function(){}); }catch(e){} }
    hRef=iRef=myHot=myInfo=null; joined=false; netOk=false; verifyAt=0;
  }

  /* ── รับข้อมูลเพื่อน (ร้อน/เย็น) แล้วรวมเป็น payload ชื่อฟิลด์เดิม ── */
  function slot(uid){
    let p=peers[uid];
    if(!p) p=peers[uid]={hot:null,cold:null,seen:performance.now(),legacy:false};
    return p;
  }
  function onHotSnap(snap){
    const uid=snap.key; if(uid===myUid) return;
    const p=slot(uid); p.hot=snap.val()||{}; p.seen=performance.now();
    emit(uid,p);
  }
  function onColdSnap(snap){
    const uid=snap.key; if(uid===myUid) return;
    const p=slot(uid); p.cold=snap.val()||{}; p.seen=performance.now();
    emit(uid,p);
    if(verifyAt===0 && joined) verifyAt=performance.now()+CFG.VERIFY_MS;   // มีคนใหม่เข้ามา → ตรวจที่นั่งอีกรอบ
  }
  function onHotGone(snap){ drop(snap.key); }
  function emit(uid,p){
    if(!p.hot) return;                        // มีแต่ข้อมูลเย็น = ยังไม่ประกาศตำแหน่ง รอก่อน
    onPeer(uid, mergeBack(p.hot, p.cold));
  }
  function drop(uid){
    if(uid===myUid || !peers[uid]) return;
    delete peers[uid]; onGone(uid); onStat();
  }
  function dropAll(){ Object.keys(peers).forEach(drop); }

  /* ── 🧓 สะพานเครื่องเก่า (อ่านอย่างเดียว · จำกัดจำนวน) ─────────────
     เครื่องใหม่ไม่เขียนลง /world เด็ดขาด (ดูหัวไฟล์ ข้อ ②) */
  function bridgeOn(){
    if(!CFG.LEGACY_BRIDGE || lgRef) return;
    try{
      lgRef=legacyRefOf().orderByKey().limitToFirst(CFG.LEGACY_WATCH);
      lgRef.on('child_added',  onLegacy);
      lgRef.on('child_changed',onLegacy);
      lgRef.on('child_removed',function(s){ drop(s.key); });
    }catch(e){ lgRef=null; }
  }
  function bridgeOff(){
    if(!lgRef) return;
    lgRef.off('child_added'); lgRef.off('child_changed'); lgRef.off('child_removed');
    lgRef=null;
  }
  function onLegacy(snap){
    const uid=snap.key; if(uid===myUid) return;
    const p=peers[uid];
    if(p && !p.legacy) return;                       // คนนี้อยู่ในสนามเราแล้ว (ข้อมูลจริงกว่า) — อย่าทับ
    const q=slot(uid); q.legacy=true; q.seen=performance.now();
    const d=snap.val()||{};
    q.hot=d; q.cold=null;
    onPeer(uid, d);                                  // payload รูปแบบเดิมอยู่แล้ว ส่งตรงได้เลย
  }

  /* ── กันแห่เข้าพร้อมกัน: ทุกเครื่องเรียงลำดับเหมือนกัน (j → uid) ──
     ตัวเองหลุดเกิน ROOM_MAX = ถอยไปหาสนามใหม่เอง → ไม่มีสนามไหนเกินเพดานค้าง */
  function verifySeat(){
    if(!joined || legacy) return;
    const arr=[{u:myUid, j:myJoinAt}];
    const now=Date.now();
    for(const uid in peers){
      const p=peers[uid]; if(p.legacy || !p.cold) continue;
      const t=p.cold.t;
      if(typeof t==='number' && now-t>CFG.ROOM_GHOST_MS) continue;
      arr.push({u:uid, j:(typeof p.cold.j==='number'?p.cold.j:0)});
    }
    arr.sort(function(a,b){ return (a.j-b.j) || (a.u<b.u?-1:1); });
    let rank=0; for(let i=0;i<arr.length;i++) if(arr[i].u===myUid){ rank=i; break; }
    count=arr.length-1;
    if(rank>=ROOM_MAX){
      /* 🚦 คนแห่เข้าพร้อมกันเป็นร้อย → ทุกเครื่องอ่านเจอ "สนามยังว่าง" พร้อมกันหมดแล้วกระโดดลงสนามเดียวกัน
         ถ้าให้คนที่เกินไล่หาใหม่ตั้งแต่สนามแรก จะแห่ตามกันไปสนามถัดไปเป็นทอด ๆ (ช้าและแกว่ง)
         → ทุกเครื่องเรียงลำดับชุดเดียวกันอยู่แล้ว จึงคำนวณเองได้เลยว่า "ควรถอยไปสนามที่เท่าไร"
           hop = ลำดับตัวเอง ÷ เพดานสนาม → กระจาย 500 คนลงสนามถูกต้องภายในรอบเดียว */
      const hop=Math.floor(rank/ROOM_MAX);
      const want=idx+hop;
      detachRoom(); dropAll();
      joinNow(false, want);                          // ไปหาสนามที่ยังว่างจริง (เริ่มไล่จากสนามที่ควรอยู่)
    }else onStat();
  }

  /* ── หาสนาม + เข้า (ใช้ทั้งตอนเริ่มและตอนลองใหม่) ───────────── */
  function joinNow(first, from){
    if(busy || joined || !envReady()) return;
    busy=true; retryAt=performance.now(); myUid=onlineKey();
    /* 🤝 นัดกันไว้ = พาไปสนามเดียวกับเพื่อนเลย ไม่ต้องให้เด็กกด "ไปหาเพื่อน" เอง
       (หาไม่เจอ/เต็ม → เข้าสนามปกติ แล้วค่อยตามอีกไม่กี่วินาที เผื่อเพื่อนกดเข้าช้ากว่า) */
    const pre = (first && from===undefined) ? findMet() : Promise.resolve(null);
    pre.catch(function(){ return null; }).then(function(met){
      if(met && met.count<ROOM_MAX){
        busy=false; meetLeft=0;
        const was=full; full=false;
        attach(met.room, met.count);
        toast('🤝 <b>พาเข้าสนามเดียวกับ '+esc(met.n)+' แล้ว!</b>'+
              '<br><span class="ib-sub">อยู่สนาม '+(met.room+1)+' ด้วยกัน เจอกันในนี้เลย</span>', 2600);
        return null;
      }
      if(met){                                   // เจอเพื่อนแต่สนามเขาเต็ม — ห้ามเงียบ
        meetName=met.n;
        toast('🧯 <b>สนามของ '+esc(met.n)+' เต็มพอดี</b>'+
              '<br><span class="ib-sub">พาเข้าสนามอื่นให้ก่อน · กด 👥 ไปหาเพื่อน ลองใหม่ได้เมื่อมีที่ว่าง</span>', 3000);
      }else if(Object.keys(metUids(map)).length){
        meetLeft=CFG.MEET_TRIES; meetAt=performance.now()+CFG.MEET_GAP_MS;   // เพื่อนยังไม่เข้าโลก — ตามต่ออีกหน่อย
      }
      return pickRoom(from);
    }).then(function(r){
      if(r===null && joined) return;             // เข้าสนามเพื่อนไปแล้ว
      busy=false;
      if(!r){                                        // ทุกสนามเต็ม → สนามฝึกส่วนตัว (เล่นต่อได้ครบทุกอย่าง)
        const was=full; full=true; joined=false; dropAll(); onStat();
        if(!was) toast('🧯 <b>สนามเต็มทุกสนามตอนนี้</b><br><span class="ib-sub">'+
          (first?'เล่นใน <b>สนามฝึกส่วนตัว</b> ได้ครบทุกอย่าง แค่ยังไม่เห็นเพื่อน'
                :'ยังไม่มีที่ว่าง — เล่นสนามฝึกส่วนตัวไปก่อน')+
          ' · ระบบจะพาเข้าให้เองทันทีที่มีคนออก 👌</span>', 3200);
        return;
      }
      const was=full;
      attach(r.idx, r.count);
      if(was) toast('✅ <b>มีที่ว่างแล้ว — พาเข้าสนาม '+(r.idx+1)+' ให้อัตโนมัติ</b>'+
        '<br><span class="ib-sub">เห็นเพื่อนคนอื่นได้ตามปกติแล้ว</span>', 2200);
    }).catch(function(e){
      busy=false;
      if(isDenied(e)) goLegacy();                    // rules ยังไม่ publish → เล่นสนามเดียวแบบเดิม
      else { full=false; onStat(); }
    });
  }

  /* ============================================================
     🧓 โหมดเดิม (legacy) — rules /wroom ยังไม่ publish
     กลับไปใช้ /world/<map>/<uid> ห้องเดียว + เพดาน ROOM_MAX แบบรอบ 637 เป๊ะ
     เกมเล่นได้ครบทุกอย่าง แค่ไม่มีหลายสนาม → "ยังไม่ publish = ไม่พัง"
     ============================================================ */
  function goLegacy(){
    if(legacy) return;
    legacy=true; detachRoom(); bridgeOff(); dropAll();
    idx=-1; myUid=onlineKey();
    const ref=legacyRefOf();
    ref.once('value').then(function(snap){
      const v=snap.val()||{}, now=Date.now(); let n=0;
      for(const uid in v){
        if(uid===myUid) continue;
        const ts=v[uid] && v[uid].ts;
        if(typeof ts==='number' && now-ts>CFG.ROOM_GHOST_MS) continue;
        n++;
      }
      count=n;
      if(n>=ROOM_MAX){                            // ห้องเดียวเต็ม → สนามฝึกส่วนตัว
        full=true; joined=false; onStat();
        toast('🧯 <b>สนามเต็มแล้ว ('+n+'/'+ROOM_MAX+' คน)</b><br>'+
          '<span class="ib-sub">เล่นสนามฝึกส่วนตัวไปก่อน · ระบบจะพาเข้าให้เองเมื่อมีที่ว่าง 👌</span>', 3200);
        return;
      }
      full=false; joined=true; netOk=true;
      hRef=ref; myHot=ref.child(myUid); myInfo=null;
      lastHot=''; lastCold=''; lastHotAt=0;
      try{ myHot.onDisconnect().remove(); }catch(e){}
      hRef.on('child_added',  onLegacySelf);
      hRef.on('child_changed',onLegacySelf);
      hRef.on('child_removed',onHotGone);
      push(); onStat();
    }).catch(function(){ full=false; joined=false; onStat(); });
  }
  function onLegacySelf(snap){
    const uid=snap.key; if(uid===myUid) return;
    const p=slot(uid); p.legacy=true; p.hot=snap.val()||{}; p.cold=null; p.seen=performance.now();
    onPeer(uid, p.hot);
  }

  /* ── ส่งข้อมูลตัวเอง (โลกส่ง payload ชื่อฟิลด์เดิมมาทั้งก้อน) ── */
  function gap(){
    return sendMs * Math.min(CFG.NET_GAP_MAX, 1 + Math.floor(Object.keys(peers).length / CFG.CROWD_PER));
  }
  function send(payload, force){
    if(!joined || !myHot || !netOk) return;
    const now=performance.now();
    if(legacy){                                       // โหมดเดิม: ส่งทั้งก้อนเหมือนเดิมเป๊ะ
      if(!force && now-lastHotAt<gap()) return;
      lastHotAt=now;
      const p=Object.assign({}, payload);
      p.ts=firebase.database.ServerValue.TIMESTAMP;
      myHot.set(p).catch(function(){
        /* rules เก่ายังไม่รับบางฟิลด์ (tl/hp/cw) → ตัดทิ้งแล้วส่งซ้ำทันที กัน multiplayer พังทั้งก้อน
           (แพตเทิร์นเดิมของ adventure3d — ยกมาไว้ที่เดียว) */
        let retry=false;
        lgOpt.forEach(function(k){ if(p[k]!==undefined){ delete p[k]; retry=true; } });
        if(retry) myHot.set(p).catch(function(){ netOk=false; });
        else netOk=false;
      });
      return;
    }
    const s=splitPayload(payload);
    /* 🪑 รอบ 686: แปะธงกันที่ไว้ให้เพื่อน (ถ้าโลกยังไม่ได้ใช้ฟิลด์ hp เอง เช่น heli — ไม่ไปทับของจริง) */
    if(s.cold.h===undefined && shouldReserve()) s.cold.h='RSV';
    /* 🧊 เย็น: เขียนเฉพาะตอนเนื้อหาเปลี่ยน + เต้นหัวใจทุก INFO_BEAT_MS
       (คนยืนนิ่งอ่านคำศัพท์ = ไม่ส่งตำแหน่งเลย แต่ยังไม่ถูกนับเป็นผี เพราะ t เดินอยู่) */
    const csig=JSON.stringify(s.cold);
    if(force || csig!==lastCold || now>beatAt){
      lastCold=csig; beatAt=now+CFG.INFO_BEAT_MS;
      const c=Object.assign({}, s.cold);
      c.t=firebase.database.ServerValue.TIMESTAMP;    // เวลาเซิร์ฟเวอร์ — ใช้นับหัว/กวาดผี (เทียบกับ Date.now แบบเดียวกับรอบ 637)
      /* j = ลำดับที่นั่งในสนาม · ใช้ "นาฬิกาเครื่องตัวเอง" ไม่ใช่ ServerValue เพราะ set() ทับทั้ง node
         → ต้องแนบค่าเดิมกลับไปทุกครั้ง ถ้าใช้ ServerValue จะต้องอ่านกลับก่อนถึงจะรู้ค่า (มีจังหวะที่ j หายไป)
         เพี้ยนข้ามเครื่องได้บ้าง แต่ทุกเครื่องอ่าน "ตัวเลขชุดเดียวกัน" จึงเรียงลำดับตรงกันเสมอ = ตัดสินใครออกได้ตรงกัน */
      c.j=myJoinAt; seatWritten=true;
      myInfo.set(c).then(function(){ everOk=true; }).catch(onFail);
    }
    /* 🔥 ร้อน: จำกัดจังหวะ + ข้ามถ้าไม่ขยับเลย (ประหยัดทราฟฟิกจริงจัง เด็กยืนนิ่งบ่อย) */
    if(!force && now-lastHotAt<gap()) return;
    const hsig=JSON.stringify(s.hot);
    if(!force && hsig===lastHot) return;
    lastHotAt=now; lastHot=hsig;
    const h=s.hot;
    if(hotTs) h.ts=firebase.database.ServerValue.TIMESTAMP;
    myHot.set(h).then(function(){ everOk=true; }).catch(onFail);
  }
  function onFail(e){
    /* ⚠️ Firebase คืน PERMISSION_DENIED ทั้งกรณี "ไม่มี path นี้ใน rules" และ "ค่าฟิลด์ไม่ผ่าน validate"
       แยกจากกันที่ตัวข้อความไม่ได้ → ใช้ everOk เป็นตัวตัดสิน:
       ยังไม่เคยเขียนสำเร็จเลย = rules /wroom ยังไม่ publish จริง → ตกกลับโหมดเดิม
       เคยเขียนสำเร็จแล้ว = path ใช้ได้ ปัญหาอยู่ที่ค่าบางตัว → อย่าทิ้งระบบสนามทั้งชุด */
    if(isDenied(e) && !everOk) goLegacy();
    else netOk=false;
  }

  /* ── กวาดผีค้าง (เครื่องดับกลางคัน onDisconnect ไม่ทำงาน) ── */
  function sweep(now){
    for(const uid in peers) if(now-(peers[uid].seen||0)>CFG.PEER_STALE_MS) drop(uid);
  }

  /* ── เรียกทุกเฟรมจากลูปหลักของแต่ละโลก ─────────────────── */
  function tick(now){
    if(!envReady()) return;
    if(!joined && !busy && now-retryAt>CFG.ROOM_RETRY_MS) joinNow(false);
    if(now>sweepAt){ sweepAt=now+2000; sweep(now); }
    if(verifyAt && now>verifyAt){ verifyAt=0; verifySeat(); }
    if(meetLeft>0 && joined && !busy && now>meetAt) tickMeet(now);
  }
  /* 🤝 เพื่อนที่นัดกันเพิ่งกดเข้าโลกตามมา แต่ไปโผล่คนละสนาม → ย้ายไปหาเขา
     ⚠️ ต้องมีฝ่ายเดียวที่ย้าย ไม่งั้นสลับที่กันไปมาแล้วไม่มีวันเจอกัน
        → ใช้กติกาที่ทั้งสองเครื่องคิดได้ตรงกัน: **uid มากกว่าเป็นฝ่ายเดินไปหา** */
  function tickMeet(now){
    meetAt=now+CFG.MEET_GAP_MS; meetLeft--;
    findMet().then(function(met){
      if(!met) return;
      meetLeft=0;
      if(met.room===idx) return;                       // อยู่สนามเดียวกันอยู่แล้ว
      /* 🎯 เรากด "ตามเข้าไป" เอง = เราต้องเป็นฝ่ายเดินเสมอ (อีกฝ่ายไม่ได้กำลังตามเรา ไม่มีทางสลับที่กัน) */
      const a=aimGet(map);
      if(!(myUid>met.uid) && !(a && a.uid===met.uid)) return;   // ไม่งั้นอีกฝ่ายเป็นคนเดินมาหาเรา
      if(met.count>=ROOM_MAX){
        toast('🧯 <b>สนามของ '+esc(met.n)+' เต็มพอดี</b>'+
              '<br><span class="ib-sub">กด 👥 ไปหาเพื่อน ลองใหม่ได้เมื่อมีที่ว่าง</span>', 3000);
        return;
      }
      goToRoom(met.room).then(function(r){
        if(r.ok) toast('🤝 <b>ย้ายไปสนามเดียวกับ '+esc(met.n)+' แล้ว!</b>'+
                       '<br><span class="ib-sub">อยู่สนาม '+(met.room+1)+' ด้วยกัน</span>', 2600);
      });
    }).catch(function(){});
  }

  /* ── 👥 หาว่าเพื่อนอยู่สนามไหน (อ่านตอนกดเท่านั้น ~1KB/สนาม) ── */
  function findFriends(){
    const ids={};
    const list=(typeof Online!=='undefined' && Online.friends) ? Online.friends : [];
    list.forEach(function(f){ if(f && f.id) ids[f.id]=f.n||'เพื่อน'; });
    if(!envReady() || legacy || !Object.keys(ids).length) return Promise.resolve([]);
    const N=roomsAllowed(ROOM_MAX), out=[], now=Date.now();
    let i=0;
    function step(){
      if(i>=N) return Promise.resolve(out);
      const at=i++;
      return infoRefOf(at).once('value').then(function(snap){
        const v=snap.val()||{};
        for(const uid in v){
          if(!ids[uid] || uid===myUid) continue;
          const t=v[uid] && v[uid].t;
          if(typeof t==='number' && now-t>CFG.ROOM_GHOST_MS) continue;
          out.push({uid:uid, n:(v[uid]&&v[uid].n)||ids[uid], room:at, here:(at===idx)});
        }
        return step();
      }).catch(function(){ return step(); });
    }
    return step();
  }

  /* ── 🤝 เพื่อนที่นัดกันไว้ อยู่สนามไหน (เจอคนแรกที่ยังไม่เต็ม พอ) ──
     อ่าน node เย็นทีละสนามเท่าที่จำเป็น เจอแล้วหยุดทันที (~1KB/สนาม) */
  function findMet(){
    const want=metUids(map);
    const keys=Object.keys(want);
    if(!envReady() || legacy || !keys.length) return Promise.resolve(null);
    const N=roomsAllowed(ROOM_MAX), now=Date.now();
    let i=0;
    function step(){
      if(i>=N) return Promise.resolve(null);
      const at=i++;
      return infoRefOf(at).once('value').then(function(snap){
        const v=snap.val()||{};
        let n=0, hit=null;
        for(const uid in v){
          const t=v[uid] && v[uid].t;
          if(typeof t==='number' && now-t>CFG.ROOM_GHOST_MS) continue;   // ผีค้างไม่นับ
          if(uid!==myUid) n++;
          if(want[uid] && !hit) hit={uid:uid, n:(v[uid]&&v[uid].n)||want[uid]};
        }
        if(hit) return {room:at, count:n, uid:hit.uid, n:hit.n};
        return step();
      }).catch(function(){ return step(); });
    }
    return step();
  }

  /* ── 🏃 ไปหาเพื่อน: ย้ายเข้าสนามที่เพื่อนอยู่ ────────────────
     เต็ม = คืน {ok:false,reason:'full'} ให้โลกขึ้นป้ายบอกเหตุผล (ห้ามเงียบ) */
  function goToRoom(i){
    if(legacy) return Promise.resolve({ok:false, reason:'legacy'});
    if(i===idx && joined) return Promise.resolve({ok:true, same:true});
    if(busy) return Promise.resolve({ok:false, reason:'busy'});
    busy=true;
    return countRoom(i).then(function(n){
      busy=false;
      if(n>=ROOM_MAX) return {ok:false, reason:'full', count:n, room:i};
      detachRoom(); dropAll(); full=false;
      attach(i, n);
      return {ok:true, room:i};
    }).catch(function(){ busy=false; return {ok:false, reason:'error'}; });
  }

  /* ── 🏷️ ป้ายบอกสถานะบนจอ (กฎทอง #1: ห้ามเงียบ เด็กต้องรู้ว่าทำไมไม่เห็นเพื่อน) ──
     drawn = จำนวนเพื่อนที่ "วาดตัวจริง" อยู่ (โลกเป็นคนรู้) · short = จอเตี้ยให้สั้นลง */
  function statusText(short, drawn){
    const n=Object.keys(peers).length+1;
    if(full) return short ? wrap('🧯 '+ROOM_NOUN+'เต็ม · เล่นสนามฝึกก่อน'+goBtn(short), short)
      : ('🧯 ทุก'+ROOM_NOUN+'เต็มตอนนี้ ('+roomsAllowed(ROOM_MAX)+' '+ROOM_NOUN+')<br>เล่นสนามฝึกส่วนตัวไปก่อน · มีที่ว่างเมื่อไหร่พาเข้าให้เอง'+goBtn(short));
    if(!joined) return short ? '📡 กำลังหา'+ROOM_NOUN+'…' : '📡 กำลังหา'+ROOM_NOUN+'ที่ว่างให้…';
    /* โหมดเดิมมีสนามเดียว ห้ามใช้คำว่า "ในสนาม N คน" — เด็กอ่านสับสนว่าเป็น "สนามที่ N" */
    if(legacy)  return short ? ('👥 '+n+' คน') : ('👥 มีผู้เล่น '+n+' คน');
    let s=ROOM_ICON+' '+ROOM_FMT(idx+1)+' · '+n+' คน';
    /* จอเตี้ยมาก (<370) ตัดวรรค "เห็นใกล้ ๆ N" ทิ้ง — กล่องกว้างแค่ ~120px ข้อความยาวจะตัดบรรทัดเพิ่ม
       แล้วชายกล่องเลื่อนลงไปทับจอย (กระดานยึดขอบบน โตลงล่าง) */
    if(typeof drawn==='number' && drawn < n-1 && innerHeight>=370)
      s += short ? (' · เห็นใกล้ ๆ '+drawn) : ('<br>เห็นตัวเพื่อนใกล้ ๆ '+drawn+' คน');
    return wrap(s+goBtn(short), short);
  }
  /* จอเตี้ยบีบบรรทัดให้แน่นขึ้นอีกนิด — กระดานคะแนนของโลก 3D ยึดขอบบนแล้วโตลงล่าง
     ทุก px ที่ประหยัดได้คือระยะห่างจากปุ่มจอย (วัดจริงที่ 620×360) */
  function wrap(html, short){
    return short ? '<span style="display:inline-block;font-size:.92em;line-height:1.22">'+html+'</span>' : html;
  }
  /* ปุ่ม "ไปหาเพื่อน" ฝังมากับป้ายสถานะเลย — โลกไหนก็แค่ดักคลิก .nr-go ใน element ที่วาดป้ายนี้
     (ใช้สไตล์ inline ไม่แตะไฟล์ css ที่ session อื่นอาจกำลังแก้อยู่) */
  function goBtn(short){
    if(legacy) return '';
    /* 📏 จอเตี้ย: ต่อท้ายบรรทัดเดิม ห้ามขึ้นบรรทัดใหม่ — กระดานคะแนนยึดขอบบน โตลงล่าง
       เพิ่มอีก 1 บรรทัด = ชายกล่องเลื่อนลงไปทับจอย (วัดจริงที่ 620×360: งบสูงไม่เกิน ~70px) */
    return (short?' ':'<br>')+
      '<span class="nr-go" style="display:inline-block;margin-top:'+(short?'0':'3px')+';padding:'+(short?'0 6px':'2px 8px')+';'+
      'border-radius:9px;background:rgba(92,200,255,.22);border:1px solid rgba(122,214,255,.55);color:#bfe9ff;'+
      'font-weight:700;cursor:pointer;white-space:nowrap">👥 ไปหาเพื่อน</span>';
  }

  /* ============================================================
     👥 แผง "ไปหาเพื่อน" — ใช้ร่วมกันทุกโลก (เขียนที่เดียว)
     🔒 คุ้มครองเด็ก: โชว์ได้แค่ "ชื่อเล่น + 🆔" เท่านั้น ห้ามมีชื่อจริง/ชั้นเรียนเด็ดขาด
     กฎทอง #7: กล่องต้องพอดีจอ ไม่มี scroll → ตัดรายชื่อไว้ที่ LIST_MAX แล้วบอกว่าเหลืออีกกี่คน
     ============================================================ */
  const LIST_MAX=6;
  function openFriends(){
    closeFriends();
    const esc = (typeof escapeHTML==='function') ? escapeHTML : function(s){ return String(s); };
    const tag = (typeof idTag==='function') ? idTag : function(){ return ''; };
    const ov=document.createElement('div');
    ov.id='nr-friends';
    ov.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;'+
      'background:rgba(4,10,20,.72);font-family:system-ui,-apple-system,"Segoe UI",sans-serif';
    ov.innerHTML='<div style="width:min(92vw,420px);max-height:88vh;background:linear-gradient(160deg,#12243c,#0b1729);'+
      'border:1px solid rgba(122,214,255,.45);border-radius:16px;padding:14px 14px 12px;color:#e8f4ff;box-shadow:0 18px 48px rgba(0,0,0,.55)">'+
      '<div style="font-weight:800;font-size:clamp(14px,3.6vh,18px);margin-bottom:2px">👥 ไปหาเพื่อน</div>'+
      '<div id="nr-sub" style="opacity:.75;font-size:clamp(10px,2.4vh,12px);margin-bottom:8px">'+
        (innerHeight<430
          ? 'เราอยู่ <b>'+ROOM_NOUN+' '+(idx+1)+'</b> · แตะ “ไปหา” เพื่อย้ายไป'+ROOM_NOUN+'เดียวกัน'
          : 'ตอนนี้เราอยู่ <b>'+ROOM_NOUN+' '+(idx+1)+'</b> · เพื่อนที่อยู่คนละ'+ROOM_NOUN+'จะไม่เห็นกัน แตะ “ไปหา” เพื่อย้ายไป'+ROOM_NOUN+'เดียวกัน')+'</div>'+
      '<div id="nr-list" style="font-size:clamp(11px,2.7vh,14px)">⏳ กำลังหาเพื่อนในโลกนี้…</div>'+
      '<div id="nr-note" style="margin-top:8px;font-size:clamp(10px,2.4vh,12px);min-height:1em"></div>'+
      '<button id="nr-close" style="margin-top:10px;width:100%;padding:8px;border-radius:11px;border:0;'+
        'background:#2a4a6e;color:#fff;font-weight:800;font-size:clamp(12px,2.8vh,15px);cursor:pointer">ปิด</button>'+
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#nr-close').onclick=closeFriends;
    ov.addEventListener('click',function(e){ if(e.target===ov) closeFriends(); });

    findFriends().then(function(list){
      const box=ov.querySelector('#nr-list'); if(!box) return;
      if(!list.length){
        box.innerHTML='<div style="opacity:.8;line-height:1.5">ยังไม่มีเพื่อนอยู่ในโลกนี้ตอนนี้ 🙈<br>'+
          '<span style="opacity:.7">ชวนเพื่อนเข้าโลกเดียวกันแล้วกดปุ่มนี้ใหม่ ระบบจะพาไป'+ROOM_NOUN+'เดียวกันให้เอง</span></div>';
        return;
      }
      const show=list.slice(0,LIST_MAX);
      box.innerHTML='<div id="nr-rows"></div><div id="nr-more" style="opacity:.65;padding-top:6px"></div>';
      const rowBox=box.querySelector('#nr-rows');
      rowBox.innerHTML=show.map(function(f){
        return '<div style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-top:1px solid rgba(255,255,255,.09)">'+
          '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+
            esc(f.n)+' <small style="opacity:.6">'+tag(f.uid)+'</small></span>'+
          '<span style="opacity:.85;white-space:nowrap">'+ROOM_NOUN+' '+(f.room+1)+'</span>'+
          (f.here ? '<span style="color:#7ee39a;font-weight:700;white-space:nowrap">✅ '+ROOM_NOUN+'เดียวกัน</span>'
                  : '<button data-room="'+f.room+'" class="nr-jump" style="padding:4px 10px;border-radius:9px;border:0;'+
                    'background:#3a86c8;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap">ไปหา</button>')+
          '</div>';
      }).join('');
      /* 📏 กฎทอง #7: กล่องต้องพอดีจอ ไม่มี scroll — วัดจริงแล้วตัดแถวออกจนพอดี
         (คำนวณจำนวนแถวล่วงหน้าไม่ได้ ความสูงแถวเปลี่ยนตาม clamp/ขนาดฟอนต์/ความยาวชื่อ) */
      const card=ov.firstElementChild, more=box.querySelector('#nr-more');
      let shown=show.length;
      function paintMore(){
        const hidden=list.length-shown;
        more.textContent = hidden>0 ? ('…และอีก '+hidden+' คน (ย่อให้พอดีจอ)') : '';
      }
      paintMore();
      let guard=0;
      while(card.scrollHeight>card.clientHeight+1 && shown>1 && guard++<40){
        rowBox.removeChild(rowBox.lastElementChild); shown--; paintMore();
      }
      box.querySelectorAll('.nr-jump').forEach(function(b){
        b.onclick=function(){
          const to=parseInt(b.getAttribute('data-room'),10);
          const note=ov.querySelector('#nr-note');
          b.disabled=true; b.textContent='กำลังย้าย…';
          goToRoom(to).then(function(r){
            if(r.ok){
              if(note){ note.style.color='#7ee39a'; note.innerHTML='✅ ย้ายเข้า <b>'+ROOM_NOUN+' '+(to+1)+'</b> แล้ว!'; }
              setTimeout(closeFriends,900);
            }else{
              b.disabled=false; b.textContent='ไปหา';
              /* ❗ ห้ามเงียบ — ต้องบอกเหตุผลบนจอเสมอ (กฎทอง #1) */
              if(note){ note.style.color='#ffb3a0';
                note.innerHTML = (r.reason==='full')
                  ? '🧯 <b>'+ROOM_NOUN+' '+(to+1)+' เต็มแล้ว</b> ('+r.count+'/'+ROOM_MAX+' คน) — ย้ายเข้าไม่ได้ตอนนี้<br>'+
                    '<span style="opacity:.8">ลองใหม่อีกครั้งเมื่อมีคนออก หรือให้เพื่อนกด “ไปหา” มาที่'+ROOM_NOUN+'เราแทน</span>'
                  : '⚠️ ย้ายไม่สำเร็จตอนนี้ ลองใหม่อีกครั้งนะ';
              }
            }
          });
        };
      });
    });
  }
  function closeFriends(){
    const el=document.getElementById('nr-friends');
    if(el && el.parentNode) el.parentNode.removeChild(el);
  }

  function join(){
    if(!envReady()) return;
    myUid=onlineKey(); legacy=false; full=false;
    joinNow(true);
  }
  function leave(){
    closeFriends();
    if(aimGet(map)) aimClear();          // 🎯 ออกจากโลกแล้ว = เป้า "ตามเพื่อน" ของโลกนี้หมดหน้าที่
    detachRoom(); bridgeOff(); dropAll();
    idx=-1; count=0; full=false; legacy=false; joined=false; netOk=false;
    retryAt=0; sweepAt=0; verifyAt=0; busy=false; everOk=false; seatWritten=false;
    meetLeft=0; meetAt=0; meetName=''; reserveSince=0;
  }

  return {
    join, leave, send, tick, findFriends, goToRoom, statusText, openFriends, closeFriends,
    get peers(){ return peers; },
    get room(){ return idx; },
    get roomLabel(){ return idx<0?'-':String(idx+1); },
    get count(){ return Object.keys(peers).length+1; },
    get full(){ return full; },
    get joined(){ return joined; },
    get legacy(){ return legacy; },
    get online(){ return joined && netOk; },
    get sendGap(){ return gap(); },
    /* ── test hooks (ใช้เฉพาะตอนเทสต์ preview) ── */
    _age(uid,ms){ if(peers[uid]) peers[uid].seen=performance.now()-ms; },
    _verify:verifySeat, _count:countRoom, _pick:pickRoom, _findMet:findMet, _met:metUids,
    _reserve:shouldReserve,   // 🪑 รอบ 686: hook เทสต์ระบบกันที่ไว้ให้เพื่อน
    get _meetLeft(){ return meetLeft; }, _tickMeet:tickMeet,
  };
}

/* ============================================================
   🎨 งบวาดตัวเพื่อน — วาดโมเดล 3D เฉพาะคนใกล้ตัว N คน (ยกจากรอบ 637 มาใช้ร่วมกัน)
   รับข้อมูลครบทุกคน (กระดานคะแนนเห็นหมด) แต่โมเดล+ป้ายชื่อวาดเท่าที่มือถือเด็กไหว
   o = {peers, max, slack, margin, dist(uid,p), isDrawn(p), show(uid,p), hide(uid,p)}
   ============================================================ */
function drawBudget(o){
  const uids=Object.keys(o.peers||{});
  if(!uids.length) return;
  const max=o.max||8, slack=(o.slack===undefined?2:o.slack), margin=o.margin||0.8;
  const rank=uids.map(function(u){ return {u:u, p:o.peers[u], d:o.dist(u,o.peers[u])}; })
                 .sort(function(a,b){ return a.d-b.d; });
  function drawn(){ let n=0; for(let i=0;i<rank.length;i++) if(o.isDrawn(rank[i].p)) n++; return n; }
  /* ก) ไกลเกินงบ+สแล็ก = ซ่อนแน่นอน */
  for(let i=max+slack;i<rank.length;i++) if(o.isDrawn(rank[i].p)) o.hide(rank[i].u, rank[i].p);
  /* ข) มีสล็อตว่าง = เติมคนใกล้สุดที่ยังไม่ได้วาด */
  for(let i=0;i<rank.length && drawn()<max;i++) if(!o.isDrawn(rank[i].p)) o.show(rank[i].u, rank[i].p);
  /* ค) เต็มสล็อตแต่มีคนใกล้กว่า "อย่างมีนัย" รออยู่ → สลับได้ไม่เกิน 2 คน/รอบ
     ใช้มาร์จินระยะ (ไม่ใช่แค่ลำดับ) กันสร้าง-ลบสลับไปมาตอนสองคนวิ่งเคียงกัน */
  let swaps=0;
  while(swaps<2){
    let want=null, far=null;
    for(let i=0;i<rank.length;i++){ if(!o.isDrawn(rank[i].p)){ want=rank[i]; break; } }
    for(let i=0;i<rank.length;i++){ if(o.isDrawn(rank[i].p)) far=rank[i]; }
    if(!want || !far || want.d >= far.d*margin-2) break;
    o.hide(far.u, far.p); o.show(want.u, want.p); swaps++;
  }
}

window.NetRoom = { create:create, drawBudget:drawBudget, CFG:CFG, roomsAllowed:roomsAllowed,
                   /* 🌍 ล็อบบี้ใช้: ดูว่าเพื่อนอยู่โลก/สนามไหน + ตั้งเป้า "ตามเข้าไป" (รอบ 642) */
                   whereFriends:whereFriends, aimAt:aimAt, aimGet:aimGet, aimClear:aimClear, MAPS3D:MAPS3D,
                   _split:splitPayload, _merge:mergeBack };
})();
