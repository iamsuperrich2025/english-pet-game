/* ============================================================
   🧪 tools/test_netroom.js — ชุดทดสอบระบบหลายสนาม (js/netroom.js) รอบ 640
   รันใน console ของ preview หลังโหลด tools/fakedb.js แล้ว:  await NRTest.all()
   ทดสอบด้วย "ผู้เล่นจำลอง" หลายร้อยคนที่เข้า/ออกผ่าน NetRoom ตัวจริง (ไม่ใช่ยัดข้อมูลลง DB เฉย ๆ)
   ============================================================ */
(function(){
'use strict';

const log=[];
function ok(name, pass, detail){
  log.push({name:name, pass:!!pass, detail:detail===undefined?'':String(detail)});
  console.log((pass?'✅':'❌')+' '+name+(detail!==undefined?('  — '+detail):''));
  return !!pass;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* เดินลูปเกมจำลอง: ต้องใช้ performance.now() จริงเสมอ
   (เคยพลาด: ยัด now ปลอม +9e5 → sweep มองว่าเพื่อนทุกคนเป็นผีค้าง แล้วกวาดทิ้งหมดก่อน verifySeat จะได้ทำงาน) */
async function settle(ps, waves, gap){
  for(let w=0; w<(waves||4); w++){
    await sleep(gap||90);
    for(const p of ps) tickAs(p);
  }
  await sleep(60);
}
/* ⚠️ onlineKey() เป็นฟังก์ชัน "global" ตัวเดียวของทั้งหน้า — ของจริงคืน uid คงที่ต่อเครื่อง
   แต่ในเทสต์เรามีผู้เล่นจำลองหลายร้อยคนในหน้าเดียว → ต้องสลับ uid ให้ตรงคนก่อนเรียกทุกครั้ง
   (เคยพลาด: ผู้เล่นที่ถูกสั่งย้ายสนามไปเขียน DB ด้วย uid ของคนสุดท้ายที่สร้าง → ทับกันเหลือ 49 รายการ) */
function tickAs(p){
  window.onlineKey=function(){ return p._uid; };
  p.tick(performance.now());
}

/* ผู้เล่นจำลอง 1 คน = NetRoom หนึ่งตัว (uid สลับผ่าน onlineKey ก่อนเรียก join) */
function makePlayer(uid, map){
  window.onlineKey=function(){ return uid; };
  const seen={};
  const r=NetRoom.create({
    map:map||'adv', sendMs:170,
    push(){ r.send({n:'เด็ก'+uid.slice(1), x:0, z:0, yaw:0, av:'foot', w:0}, true); },
    onPeer(u,d){ seen[u]=d; },
    onPeerGone(u){ delete seen[u]; },
    onStatus(){}, toast(){},
  });
  r._uid=uid; r._seen=seen;
  r.join();
  return r;
}
/* ตั้งคำเชิญเล่นโลก 3D — เป็นที่มาของการ "นัดเจอกัน" (ไม่มี path ใหม่ ใช้ของเดิม) */
function setInvite(fromUid, map, name){
  window.Online=window.Online||{};
  Online.tinv = fromUid ? {[fromUid]:{map:map, n:name||'เพื่อน', ts:Date.now()}} : {};
}
function setSent(toUid, map){
  window.state=window.state||{};
  state.tinvSent = toUid ? {[toUid]:{map:map, ts:Date.now()}} : {};
}
function clearInvites(){ setInvite(null); setSent(null); }

function roomsOf(map){
  const t=FakeDB.get('winfo/'+map)||{};
  const out={};
  for(const rk in t) out[rk]=Object.keys(t[rk]||{}).length;
  return out;
}
function maxRoom(map){
  const c=roomsOf(map); let m=0;
  for(const k in c) if(c[k]>m) m=c[k];
  return m;
}

const T={};

/* ── 1) 500 คนเข้าพร้อมกัน: กระจายลงสนามถูก + ไม่มีสนามไหนเกินเพดาน ── */
T.scale500=async function(){
  FakeDB.reset();
  const cap=NetRoom.CFG.WORLD_CAP;
  NetRoom.CFG.WORLD_CAP=504;                       // จำลองวันที่อัป Blaze แล้ว (36 สนาม × 14)
  const vm=NetRoom.CFG.VERIFY_MS; NetRoom.CFG.VERIFY_MS=40;   // เร่งรอบตรวจที่นั่งให้เทสต์ไม่ต้องรอ 2.5 วิ/รอบ
  const N=500, ps=[];
  for(let i=0;i<N;i++) ps.push(makePlayer('u'+String(i).padStart(3,'0'),'adv'));
  await settle(ps, 5);                                        // แห่เข้าพร้อมกัน → ให้ระบบกระจายตัวเอง
  NetRoom.CFG.VERIFY_MS=vm;

  const cnt=roomsOf('adv');
  const total=Object.values(cnt).reduce((a,b)=>a+b,0);
  const over=Object.keys(cnt).filter(k=>cnt[k]>NetRoom.CFG.ROOM_MAX);
  const joined=ps.filter(p=>p.joined).length;
  const rooms=Object.keys(cnt).length;

  ok('500 คน — ทุกคนได้ที่เล่น', joined===N, joined+'/'+N+' คนอยู่ในสนาม');
  ok('500 คน — ไม่มีสนามไหนเกินเพดาน '+NetRoom.CFG.ROOM_MAX, over.length===0,
     'สนามที่ล้น: '+(over.length?over.join(','):'ไม่มี')+' · สูงสุด '+maxRoom('adv')+' คน');
  ok('500 คน — จำนวนคนใน DB ตรงกับคนที่เข้า', total===N, total+' รายการใน /winfo');
  ok('500 คน — ใช้สนามพอดี ไม่กระจายเกินจำเป็น', rooms<=Math.ceil(N/NetRoom.CFG.ROOM_MAX)+1,
     'ใช้ '+rooms+' สนาม (ทฤษฎีต่ำสุด '+Math.ceil(N/NetRoom.CFG.ROOM_MAX)+')');
  /* เพื่อนต้องเจอกัน: คนที่เข้าติดกันต้องได้สนามเดียวกันเป็นส่วนใหญ่ (นโยบายอัดสนามต้นก่อน) */
  const pairSame=ps.slice(0,50).filter((p,i)=>i%2===0 && ps[i+1] && p.room===ps[i+1].room).length;
  ok('เพื่อนที่กดเข้าพร้อมกันได้สนามเดียวกัน', pairSame>=20, pairSame+'/25 คู่แรกอยู่สนามเดียวกัน');

  for(const p of ps) p.leave();
  NetRoom.CFG.WORLD_CAP=cap;
  await sleep(30);
};

/* ── 2) เพดานคนทั้งเกม (WORLD_CAP=80 บน Spark ฟรี) ── */
T.worldCap=async function(){
  FakeDB.reset();
  const vm=NetRoom.CFG.VERIFY_MS; NetRoom.CFG.VERIFY_MS=40;
  const N=140, ps=[];
  for(let i=0;i<N;i++) ps.push(makePlayer('c'+String(i).padStart(3,'0'),'adv'));
  await settle(ps, 5);
  NetRoom.CFG.VERIFY_MS=vm;

  const cnt=roomsOf('adv');
  const total=Object.values(cnt).reduce((a,b)=>a+b,0);
  const rooms=NetRoom.roomsAllowed();
  const ceiling=rooms*NetRoom.CFG.ROOM_MAX;
  const inField=ps.filter(p=>p.joined).length, training=ps.filter(p=>p.full).length;

  ok('เพดานฟรี — เปิดแค่ '+rooms+' สนาม', rooms===Math.ceil(NetRoom.CFG.WORLD_CAP/NetRoom.CFG.ROOM_MAX),
     'WORLD_CAP='+NetRoom.CFG.WORLD_CAP+' → '+rooms+' สนาม (เพดานจริง '+ceiling+' คน)');
  ok('เพดานฟรี — คนในสนามรวมไม่เกินเพดาน', total<=ceiling, total+'/'+ceiling+' คน');
  ok('เพดานฟรี — คนที่เกินได้ "สนามฝึกส่วนตัว" ไม่ใช่ถูกเตะออก', inField+training===N && training>0,
     'ในสนาม '+inField+' คน · สนามฝึกส่วนตัว '+training+' คน (รวม '+(inField+training)+'/'+N+')');
  const outside=ps.filter(p=>p.full)[0];
  ok('เพดานฟรี — ป้ายบอกเหตุผลบนจอ (ห้ามเงียบ)',
     !!outside && /สนามเต็ม/.test(outside.statusText(false)),
     outside ? outside.statusText(true).replace(/<[^>]+>/g,' ').trim() : 'ไม่มีใครอยู่นอกสนาม (ผิด)');

  for(const p of ps) p.leave();
  await sleep(30);
};

/* ── 3) เข้า-ออกสลับกันร้อยครั้ง: ไม่มีสนามค้าง/ผีค้าง ── */
T.churn=async function(){
  FakeDB.reset();
  const base=[];
  for(let i=0;i<10;i++) base.push(makePlayer('k'+i,'moto'));
  await sleep(40);
  for(let round=0;round<100;round++){
    const p=makePlayer('churn'+round,'moto');
    await sleep(2);
    p.leave();
  }
  await sleep(60);
  const hot=FakeDB.get('wroom/moto')||{}, info=FakeDB.get('winfo/moto')||{};
  let leftHot=0, leftInfo=0;
  for(const rk in hot) leftHot+=Object.keys(hot[rk]||{}).filter(u=>u.indexOf('churn')===0).length;
  for(const rk in info) leftInfo+=Object.keys(info[rk]||{}).filter(u=>u.indexOf('churn')===0).length;
  ok('เข้า-ออก 100 ครั้ง — ไม่มีข้อมูลค้างใน DB', leftHot===0&&leftInfo===0, 'ค้าง hot '+leftHot+' · info '+leftInfo);
  ok('เข้า-ออก 100 ครั้ง — คนที่อยู่เดิมยังอยู่ครบ', base.filter(p=>p.joined).length===10,
     base.filter(p=>p.joined).length+'/10 คน');
  ok('เข้า-ออก 100 ครั้ง — ไม่มี listener ค้างสะสม', FakeDB.subs()<=10*7+10,
     FakeDB.subs()+' listeners (10 คนที่ยังอยู่)');
  for(const p of base) p.leave();
  await sleep(20);
  ok('ออกหมดแล้ว — listener เหลือ 0', FakeDB.subs()===0, FakeDB.subs()+' listeners');
};

/* ── 4) ผีค้าง (เครื่องดับกลางคัน) ไม่กินที่นั่ง ── */
T.ghost=async function(){
  FakeDB.reset();
  const old=Date.now()-5*60*1000;                 // เก่ากว่า ROOM_GHOST_MS (90 วิ) มาก
  const seed={};
  for(let i=0;i<14;i++) seed['ghost'+i]={n:'ผี'+i, t:old, j:old};
  FakeDB.seed('winfo/adv/r0', seed);
  const p=makePlayer('alive1','adv');
  await sleep(60);
  ok('ผีค้าง 14 คน (ts เก่า) ไม่ถูกนับเป็นคน', p.joined && p.room===0,
     p.joined?('เข้าสนาม '+(p.room+1)+' ได้ตามปกติ'):'เข้าไม่ได้ (ผิด)');
  p.leave();

  /* ผีที่ "หยุดส่ง" ระหว่างเล่น ต้องถูกกวาดออกจากจอ */
  FakeDB.reset();
  const a=makePlayer('gA','adv'); await sleep(20);
  const b=makePlayer('gB','adv'); await sleep(40);
  const before=Object.keys(a._seen).length;
  a._age('gB', NetRoom.CFG.PEER_STALE_MS+5000);
  tickAs(a); await sleep(20); tickAs(a);
  await sleep(20);
  ok('เพื่อนที่เงียบเกิน '+(NetRoom.CFG.PEER_STALE_MS/1000)+' วิ ถูกกวาดออกจากจอ',
     before===1 && Object.keys(a._seen).length===0, 'ก่อนกวาด '+before+' คน → หลังกวาด '+Object.keys(a._seen).length);
  a.leave(); b.leave();
};

/* ── 5) เพื่อนต้องเจอกัน: หาสนามเพื่อน + ย้ายไปหา + สนามเต็มต้องบอกเหตุผล ── */
T.friends=async function(){
  FakeDB.reset();
  window.Online=window.Online||{}; Online.db=FakeDB.db; Online.ready=true;
  /* ยัดสนาม 1 ให้เต็ม แล้ววางเพื่อนไว้สนาม 2 */
  const now=Date.now(), full={};
  for(let i=0;i<NetRoom.CFG.ROOM_MAX;i++) full['pad'+i]={n:'คนอื่น'+i, t:now, j:now};
  FakeDB.seed('winfo/adv/r0', full);
  FakeDB.seed('winfo/adv/r1', {buddy9:{n:'เพื่อนบี', t:now, j:now}});
  Online.friends=[{id:'buddy9', n:'เพื่อนบี'}];

  const me=makePlayer('meX','adv');
  await sleep(60);
  const list=await me.findFriends();
  ok('รู้ว่าเพื่อนอยู่สนามไหน', list.length===1 && list[0].room===1,
     list.length?('เจอ '+list[0].n+' ที่สนาม '+(list[0].room+1)):'ไม่เจอเพื่อน');

  const r=await me.goToRoom(1);
  ok('กด "ไปหาเพื่อน" แล้วย้ายเข้าสนามเดียวกันได้จริง', r.ok && me.room===1,
     'ผลลัพธ์: '+JSON.stringify(r)+' · ตอนนี้อยู่สนาม '+(me.room+1));

  /* สนามเพื่อนเต็ม → ต้องบอกเหตุผล ไม่ใช่เงียบ */
  const r2=await me.goToRoom(0);
  ok('สนามเพื่อนเต็ม = คืนเหตุผลให้ขึ้นป้าย (ห้ามเงียบ)', r2.ok===false && r2.reason==='full',
     JSON.stringify(r2));
  ok('ย้ายไม่สำเร็จแล้วยังอยู่สนามเดิม ไม่หลุดออนไลน์', me.joined && me.room===1, 'สนาม '+(me.room+1));
  me.leave();
  delete Online.friends;
};

/* ── 6) payload: แยกร้อน/เย็นถูกต้อง + วัดทราฟฟิกจริง ── */
T.payload=async function(){
  const full={n:'เด็กดี', x:12.3, z:-4.5, y:1.7, yaw:1.23, av:'foot-r.', w:7, c:'สวัสดี', ct:123, cw:'cat|แมว', hp:'3|5|0', m:1, tl:2};
  const s=NetRoom._split(full);
  ok('แยกร้อน/เย็นถูกช่อง',
     s.hot.x===12.3 && s.hot.r===1.23 && s.hot.a==='foot-r.' && s.cold.n==='เด็กดี' && s.cold.k===123 && s.cold.h==='3|5|0',
     'ร้อน='+JSON.stringify(s.hot)+' เย็น='+JSON.stringify(s.cold));
  const back=NetRoom._merge(s.hot, s.cold);
  const same=Object.keys(full).every(k=>JSON.stringify(back[k])===JSON.stringify(full[k]));
  ok('ประกอบคืนเป็นชื่อฟิลด์เดิมครบทุกตัว', same, JSON.stringify(back));

  const oldBytes=JSON.stringify(Object.assign({}, full, {ts:1753700000000})).length;
  const newBytes=JSON.stringify(s.hot).length;
  ok('payload ที่ส่งทุกเฟรมเบาลงจริง', newBytes < oldBytes*0.62,
     'เดิม '+oldBytes+' ไบต์/เฟรม → ตอนนี้ '+newBytes+' ไบต์/เฟรม (ลด '+Math.round((1-newBytes/oldBytes)*100)+'%)');

  /* วัดทราฟฟิกจริงจากสนามเต็ม: เดินจริง 20 เฟรม แล้วดู "ไบต์ต่อข้อความกระจาย" ที่ DB ส่งออก
     แล้วคำนวณต่อด้วยจังหวะส่งจริงของระบบ (gap() ยืดตามจำนวนคนอยู่แล้ว) */
  FakeDB.reset();
  const R=NetRoom.CFG.ROOM_MAX, ps=[];
  for(let i=0;i<R;i++) ps.push(makePlayer('t'+i,'adv'));
  await sleep(80);
  FakeDB.zero();
  for(let step=1; step<=20; step++){
    ps.forEach((p,i)=>p.send({n:'เด็ก'+i, x:step*2+i, z:step, yaw:step*0.1, av:'foot-r.', w:0}, true));
    await sleep(3);
  }
  const st=FakeDB.stats();
  const perMsg=st.bytesDown/Math.max(1,st.msgs);
  const gapS=ps[0].sendGap/1000;                       // จังหวะส่งจริงตอนสนามเต็ม (ยืดแล้ว)
  const perPlayerHr=(R-1)/gapS*perMsg*3600/1e6;        // ดาวน์โหลดต่อ 1 คน-ชั่วโมง
  ok('สนามเต็ม '+R+' คน → ระบบยืดจังหวะส่งเอง', ps[0].sendGap>170,
     '170ms → '+ps[0].sendGap+'ms (คนยิ่งเยอะยิ่งส่งห่าง)');
  ok('ขนาดข้อความที่กระจายต่อครั้ง', perMsg<150,
     Math.round(perMsg)+' ไบต์/ข้อความ (payload เดิม ~220)');
  const monthHours=10*1024/perPlayerHr;
  ok('อยู่ในงบโควตาฟรี 10GB/เดือน', perPlayerHr<25,
     '≈ '+perPlayerHr.toFixed(1)+' MB ต่อคน-ชั่วโมง → เล่นได้ ≈ '+Math.round(monthHours)+' คน-ชั่วโมง/เดือน '+
     '(เพดาน '+NetRoom.CFG.WORLD_CAP+' คนพร้อมกัน = '+Math.round(monthHours/NetRoom.CFG.WORLD_CAP)+' ชม./เดือนถ้าเต็มตลอด)');
  for(const p of ps) p.leave();
};

/* ── 7) rules ยังไม่ publish → ตกกลับสนามเดียวแบบเดิม เกมไม่พัง ── */
T.legacyFallback=async function(){
  FakeDB.reset();
  const realRef=FakeDB.db.ref;
  Online.db={ ref:function(p){
    const r=realRef(p);
    if(String(p).indexOf('wroom/')===0 || String(p).indexOf('winfo/')===0){
      const deny=()=>Promise.reject({code:'PERMISSION_DENIED', message:'permission_denied'});
      return Object.assign({}, r, {set:deny, update:deny, once:deny,
        child:function(k){ const c=realRef(p+'/'+k); return Object.assign({}, c, {set:deny, update:deny,
          onDisconnect:c.onDisconnect}); }});
    }
    return r;
  }};
  const p=makePlayer('legacy1','adv');
  await sleep(120);
  ok('rules ยังไม่ publish → ตกกลับ "สนามเดียว" อัตโนมัติ', p.legacy===true, 'legacy='+p.legacy);
  ok('โหมดเดิมยังเล่นออนไลน์ได้ (เขียนลง /world เหมือนเดิม)', !!FakeDB.get('world/adv/legacy1'),
     JSON.stringify(FakeDB.get('world/adv/legacy1')||null));
  ok('โหมดเดิม — ป้ายไม่โชว์ "เลขสนาม" ให้สับสน (มีสนามเดียว)', !/สนาม\s*\d/.test(p.statusText(false)),
     p.statusText(false).replace(/<[^>]+>/g,' ').trim());
  p.leave();
  Online.db=FakeDB.db;
};

/* ── 8) สะพานเครื่องเก่า: เครื่องใหม่เห็นเครื่องที่ยังไม่อัปเดต ── */
T.legacyBridge=async function(){
  FakeDB.reset();
  FakeDB.seed('world/adv/oldPhone1', {n:'เครื่องเก่า', x:5, z:5, yaw:0, av:'foot', ts:Date.now()});
  const p=makePlayer('newPhone1','adv');
  await sleep(80);
  ok('เครื่องใหม่มองเห็นเครื่องเก่าที่ยังไม่อัปเดต', !!p._seen.oldPhone1,
     'เห็น: '+Object.keys(p._seen).join(','));
  ok('เครื่องใหม่ไม่เขียนลง /world (กันเห็นข้ามสนาม)', !FakeDB.get('world/adv/newPhone1'),
     FakeDB.get('world/adv/newPhone1')?'เขียนลงไป (ผิด)':'ไม่เขียน (ถูก)');
  p.leave();
};

/* ── 9) 🤝 นัดกันแล้วได้สนามเดียวกันเอง (ไม่ต้องกด "ไปหาเพื่อน") ── */
T.meetUp=async function(){
  /* ก) เพื่อนอยู่สนาม 3 อยู่แล้ว (สนาม 1-2 เต็ม) → เราต้องไปโผล่สนาม 3 ไม่ใช่สนามแรกที่ว่าง */
  FakeDB.reset(); clearInvites();
  const now=Date.now();
  for(let rm=0; rm<2; rm++)                                  // สนาม 1-2 เต็ม
    for(let i=0;i<NetRoom.CFG.ROOM_MAX;i++)
      FakeDB.seed('winfo/adv/r'+rm+'/pad'+rm+'_'+i, {n:'คนอื่น', t:now, j:now});
  FakeDB.seed('winfo/adv/r2/buddyZ', {n:'น้องบีม', t:now, j:now});
  setInvite('buddyZ','adv','น้องบีม');
  let toasts=[];
  window.onlineKey=function(){ return 'meA'; };
  const me=NetRoom.create({map:'adv', sendMs:170,
    push(){ me.send({n:'ฉัน',x:0,z:0,yaw:0,av:'foot',w:0}, true); },
    onPeer(){}, onPeerGone(){}, onStatus(){}, toast(h){ toasts.push(h.replace(/<[^>]+>/g,'')); }});
  me.join(); await sleep(200);
  ok('🤝 เพื่อนชวนไว้ → เข้าสนามเดียวกับเพื่อนเลย', me.room===2,
     'ไปโผล่สนาม '+(me.room+1)+' (เพื่อนอยู่สนาม 3)');
  ok('🤝 บอกเด็กบนจอว่าพาไปหาเพื่อนแล้ว', toasts.some(t=>/พาเข้าสนามเดียวกับ น้องบีม/.test(t)),
     toasts.join(' | ').slice(0,110));
  me.leave();

  /* ข) สนามเพื่อนเต็มพอดี → ต้องบอกเหตุผล ไม่ใช่เงียบ แล้วยังเล่นได้ปกติ */
  FakeDB.reset(); clearInvites();
  for(let i=0;i<NetRoom.CFG.ROOM_MAX;i++)
    FakeDB.seed('winfo/adv/r0/pad'+i, {n:'คนอื่น', t:Date.now(), j:Date.now()});
  FakeDB.seed('winfo/adv/r0/buddyF', {n:'น้องปลื้ม', t:Date.now(), j:Date.now()});
  setInvite('buddyF','adv','น้องปลื้ม');
  toasts=[]; window.onlineKey=function(){ return 'meB'; };
  const b=NetRoom.create({map:'adv', sendMs:170,
    push(){ b.send({n:'ฉัน',x:0,z:0,yaw:0,av:'foot',w:0}, true); },
    onPeer(){}, onPeerGone(){}, onStatus(){}, toast(h){ toasts.push(h.replace(/<[^>]+>/g,'')); }});
  b.join(); await sleep(200);
  ok('🤝 สนามเพื่อนเต็ม → ขึ้นป้ายบอกเหตุผล (ห้ามเงียบ)',
     toasts.some(t=>/สนามของ น้องปลื้ม เต็ม/.test(t)), toasts.join(' | ').slice(0,110));
  ok('🤝 สนามเพื่อนเต็ม → ยังเข้าสนามอื่นเล่นได้ปกติ', b.joined && b.room!==0,
     b.joined?('เข้าสนาม '+(b.room+1)):'เข้าไม่ได้ (ผิด)');
  b.leave();

  /* ค) เพื่อนกดเข้าโลกช้ากว่า → ตามไปหาทีหลัง และต้อง "ย้ายฝ่ายเดียว" ไม่สลับที่กันไปมา */
  FakeDB.reset(); clearInvites();
  setSent('zzFriend','adv');                                  // เราชวนเขา (uid เขามากกว่าเรา)
  window.onlineKey=function(){ return 'aaMe'; };
  const early=NetRoom.create({map:'adv', sendMs:170,
    push(){ early.send({n:'ฉัน',x:0,z:0,yaw:0,av:'foot',w:0}, true); },
    onPeer(){}, onPeerGone(){}, onStatus(){}, toast(){}});
  early.join(); await sleep(150);
  const myRoom=early.room;
  FakeDB.seed('winfo/adv/r4/zzFriend', {n:'น้องหนึ่ง', t:Date.now(), j:Date.now()});   // เพื่อนไปโผล่สนาม 5
  early.tick(performance.now()+CFG_gap());
  await sleep(200);
  ok('🤝 uid น้อยกว่า = ไม่ย้ายตาม (ปล่อยให้อีกฝ่ายเดินมาหา ไม่สลับที่กันไปมา)',
     early.room===myRoom, 'ยังอยู่สนาม '+(early.room+1)+' · เพื่อนอยู่สนาม 5');
  early.leave();

  FakeDB.reset(); clearInvites();
  setSent('aaFriend','adv');                                  // คราวนี้ uid เรามากกว่า → เราเป็นฝ่ายเดิน
  window.onlineKey=function(){ return 'zzMe'; };
  let t2=[];
  const late=NetRoom.create({map:'adv', sendMs:170,
    push(){ late.send({n:'ฉัน',x:0,z:0,yaw:0,av:'foot',w:0}, true); },
    onPeer(){}, onPeerGone(){}, onStatus(){}, toast(h){ t2.push(h.replace(/<[^>]+>/g,'')); }});
  late.join(); await sleep(150);
  FakeDB.seed('winfo/adv/r4/aaFriend', {n:'น้องหนึ่ง', t:Date.now(), j:Date.now()});
  late.tick(performance.now()+CFG_gap());
  await sleep(250);
  ok('🤝 uid มากกว่า = เดินไปหาเพื่อนที่เข้ามาทีหลัง', late.room===4,
     'ย้ายไปสนาม '+(late.room+1)+' · '+t2.join(' | ').slice(0,80));
  late.leave();

  /* ง) ไม่ได้นัดใคร → พฤติกรรมเดิม (อัดสนามแรกก่อน) ต้องไม่เปลี่ยน */
  FakeDB.reset(); clearInvites();
  window.onlineKey=function(){ return 'plain1'; };
  const plain=NetRoom.create({map:'adv', sendMs:170,
    push(){ plain.send({n:'ฉัน',x:0,z:0,yaw:0,av:'foot',w:0}, true); },
    onPeer(){}, onPeerGone(){}, onStatus(){}, toast(){}});
  plain.join(); await sleep(150);
  ok('ไม่ได้นัดใคร → ยังเข้าสนามแรกตามเดิม', plain.room===0, 'สนาม '+(plain.room+1));
  plain.leave(); clearInvites();
};
function CFG_gap(){ return NetRoom.CFG.MEET_GAP_MS+1000; }

window.NRTest={
  ...T,
  async all(){
    log.length=0;
    if(!window.FakeDB) { console.error('ต้องโหลด tools/fakedb.js ก่อน'); return; }
    await FakeDB.install();
    const names=['payload','scale500','worldCap','churn','ghost','friends','meetUp','legacyFallback','legacyBridge'];
    for(const n of names){
      console.log('\n── '+n+' ──');
      try{ await T[n](); }catch(e){ ok(n+' (ทำงานจนจบ)', false, e && e.message || e); }
    }
    const pass=log.filter(l=>l.pass).length;
    console.log('\n===== ผ่าน '+pass+'/'+log.length+' =====');
    return {pass:pass, total:log.length, fail:log.filter(l=>!l.pass), log:log};
  },
  get log(){ return log; },
};
})();
