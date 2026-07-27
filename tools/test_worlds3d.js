/* ============================================================
   🧪 tools/test_worlds3d.js — ทดสอบระบบหลายสนามใน "โลกจริงทั้ง 3 ไฟล์" (รอบ 640)
   invasion3d (โลกยานแม่) · moto3d (โลกมอเตอร์ไซค์) · adventure3d (adv/haunt/heli/drone/drive/soccer/mecha)
   ต้องโหลด tools/fakedb.js ก่อน แล้วเรียก:  await W3D.all()
   ⚠️ preview เครื่องนี้เป็น document.hidden → requestAnimationFrame ไม่ยิงเลย ต้องเดินเฟรมเองผ่าน _t.stepFrame()
   ============================================================ */
(function(){
'use strict';
const log=[];
function ok(name, pass, detail){
  log.push({name, pass:!!pass, detail:detail===undefined?'':String(detail)});
  console.log((pass?'✅':'❌')+' '+name+(detail!==undefined?('  — '+detail):''));
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MY='meTest1';

/* ── mock login + fake DB (ตาม testkit ใน HANDOFF.md) ── */
async function boot(){
  window.authFetchCloud=()=>Promise.resolve(null);
  window.authWriteCloud=()=>Promise.resolve();
  window.authDeleteCloud=()=>Promise.resolve();
  window.authWriteProfileName=()=>Promise.resolve();
  window.onlineStart=()=>{};
  await FakeDB.install();
  window.onlineKey=()=>MY;
  window.onlineDisplayName=()=>'ครูเทส';
  window.Auth=window.Auth||{}; Auth.user={uid:MY, email:'t@test.com'};
  if(typeof authOnLogin==='function' && !(state&&state.student)) authOnLogin({uid:MY, email:'t@test.com'});
  await sleep(200);
  /* ตั๋วครบทุกโลก ไม่งั้น start() เด้งออกก่อนเข้าเกม */
  ['advTicket','hauntTicket','heliTicket','droneTicket','driveTicket','soccerTicket',
   'mechaTicket','motoTicket','invasionTicket'].forEach(k=>{ state[k]=true; });
  /* 🤖 โหมด mecha ขอ "มีหุ่นอย่างน้อย 1 ตัว" · 🚗 โหมด drive ขอแผนที่เมือง (ปกติ ui.js โหลดให้ก่อน start) */
  if(!(state.robots&&state.robots.length)) state.robots=[{id:'r1', name:'หุ่นเทส', parts:{}, lv:1}];
  if(!window.KPP_CITY) await new Promise((ok,no)=>{
    const e=document.createElement('script'); e.src='js/data/city_kpp.js?b='+Date.now();
    e.onload=ok; e.onerror=ok; document.head.appendChild(e);
  });
}
/* ยัดเพื่อนปลอม N คน ลงสนามหนึ่ง ๆ ผ่าน DB ตรง (เหมือนเครื่องเพื่อนเขียนเข้ามาจริง) */
function seedPeers(map, room, n, spread){
  const now=Date.now(), rk='r'+room;
  for(let i=0;i<n;i++){
    const uid='pal'+i;
    FakeDB.seed('winfo/'+map+'/'+rk+'/'+uid, {n:'เพื่อน'+i, w:i, t:now, j:now-1000-i});
    FakeDB.db.ref('wroom/'+map+'/'+rk+'/'+uid).set({
      x:(i%8)*(spread||6)+3, z:Math.floor(i/8)*(spread||6)+3, y:1.7, r:0, a:'foot-r.'});
  }
}
function txt(el){ return el?el.innerText.replace(/\s+/g,' ').trim():''; }

const T={};

/* ── โลกยานแม่ ── */
T.invasion=async function(){
  FakeDB.reset(); await FakeDB.install(); window.onlineKey=()=>MY;
  if(typeof InvasionWorld==='undefined'){ ok('invasion3d โหลดแล้ว', false, 'ยังไม่ได้โหลดไฟล์'); return; }
  const W=InvasionWorld._t;
  InvasionWorld.start();                       // เข้าโลกจริง (สร้าง scene + netJoin เอง)
  await sleep(600);
  W.stepFrame(1/60);
  const c1=W.crowd;
  ok('[ยานแม่] เข้าสนามอัตโนมัติ ไม่ต้องให้เด็กเลือก', c1.joined && c1.roomIdx===0,
     'สนาม '+(c1.roomIdx+1)+' · legacy='+c1.legacy);
  ok('[ยานแม่] เขียนลง path ใหม่ /wroom (ไม่ใช่ /world เดิม)',
     !!FakeDB.get('wroom/invasion/r0/'+MY) && !FakeDB.get('world/invasion/'+MY),
     JSON.stringify(FakeDB.get('wroom/invasion/r0/'+MY)));

  /* เพื่อน 20 คน (เกินงบวาด 8) */
  seedPeers('invasion', 0, 20, 8);
  await sleep(200);
  for(let i=0;i<8;i++){ W.stepFrame(1/60); await sleep(120); }   // เดินเฟรมเอง (rAF ไม่ยิงตอน document.hidden)
  const c2=W.crowd;
  ok('[ยานแม่] รับข้อมูลเพื่อนครบทุกคน', c2.peers===20, c2.peers+' คน');
  ok('[ยานแม่] วาดโมเดลแค่คนใกล้ตัวตามงบ', c2.drawn===c2.drawMax, 'วาด '+c2.drawn+'/'+c2.peers+' คน');
  ok('[ยานแม่] จังหวะส่งยืดตามจำนวนคน', c2.gap===510, '170ms → '+c2.gap+'ms');

  const board=document.getElementById('inv-board');
  const t=txt(board);
  ok('[ยานแม่] ป้ายบอกสนาม+จำนวนคนบนกระดาน', /สนาม\s*1/.test(t) && /21\s*คน/.test(t), t.slice(0,120));
  ok('[ยานแม่] บอกด้วยว่าทำไมไม่เห็นเพื่อนครบ', /เห็นใกล้|เห็นตัวเพื่อน/.test(t), t.slice(0,160));
  ok('[ยานแม่] มีปุ่ม "ไปหาเพื่อน" บนจอ', !!(board&&board.querySelector('.nr-go')), '');

  ok('[ยานแม่] สนามยังไม่เต็ม (21/'+NetRoom.CFG.ROOM_MAX+') → ยังไม่ควรเต็ม? เช็กเพดาน',
     c2.peers+1>NetRoom.CFG.ROOM_MAX, 'มี '+(c2.peers+1)+' คน เกินเพดาน '+NetRoom.CFG.ROOM_MAX+' (จำลองสนามแน่น)');
  W.netLeave();
  await sleep(80);
  ok('[ยานแม่] ออกจากโลก = ลบตัวเองออกจากสนามจริง', !FakeDB.get('wroom/invasion/r0/'+MY), '');
  try{ InvasionWorld._t.exitWorld && InvasionWorld._t.exitWorld(); }catch(e){}
  await sleep(100);
};

/* ── โลกมอเตอร์ไซค์ ── */
T.moto=async function(){
  FakeDB.reset(); await FakeDB.install(); window.onlineKey=()=>MY;
  if(typeof MotoWorld==='undefined'){ ok('moto3d โหลดแล้ว', false, 'ยังไม่ได้โหลดไฟล์'); return; }
  const W=MotoWorld._t;
  MotoWorld.start({});                          // เข้าโลกจริง
  await sleep(600);
  W.step(1/60,1);
  ok('[มอไซค์] เข้าสนามอัตโนมัติ + เขียน path ใหม่', !!FakeDB.get('wroom/moto/r0/'+MY),
     JSON.stringify(FakeDB.get('wroom/moto/r0/'+MY)));

  seedPeers('moto', 0, 13, 20);
  await sleep(200);
  for(let i=0;i<8;i++){ W.step(1/60,1); await sleep(120); }
  const c=W.crowd;
  ok('[มอไซค์] รับเพื่อนครบ 13 คน', c.peers===13, c.peers+' คน');
  ok('[มอไซค์] วาดเฉพาะคนใกล้ตัวตามงบ ('+c.drawMax+')', c.drawn===c.drawMax, 'วาด '+c.drawn+'/13');
  ok('[มอไซค์] จังหวะส่งยืดตามจำนวนคน', c.gap>180, '180ms → '+c.gap+'ms');
  const board=document.getElementById('moto-board');
  const t=txt(board);
  ok('[มอไซค์] ป้ายบอกสนาม+จำนวนคน', /สนาม\s*1/.test(t) && /14\s*คน/.test(t), t.slice(0,120));
  ok('[มอไซค์] มีปุ่ม "ไปหาเพื่อน"', !!(board&&board.querySelector('.nr-go')), '');
  W.netLeave();
  await sleep(80);
  ok('[มอไซค์] ออกแล้วไม่มีข้อมูลค้าง', !FakeDB.get('wroom/moto/r0/'+MY), '');
  try{ W.exitWorld && W.exitWorld(); }catch(e){}
  await sleep(100);
};

/* ── โลกผจญภัย (ทุกโหมดในไฟล์เดียว) ── */
T.adventure=async function(){
  if(typeof Adventure3D==='undefined'){ ok('adventure3d โหลดแล้ว', false, 'ยังไม่ได้โหลดไฟล์'); return; }
  const W=Adventure3D._t;
  /* ทุกโหมดในไฟล์นี้ต้องได้ระบบหลายสนามเหมือนกัน */
  for(const md of ['adv','haunt','heli','drone','drive','soccer','mecha']){
    FakeDB.reset(); await FakeDB.install(); window.onlineKey=()=>MY;
    try{ Adventure3D.start(md); }catch(e){ ok('[ผจญภัย·'+md+'] เข้าโลกได้', false, e.message); continue; }
    await sleep(500);
    const wrote=FakeDB.get('wroom/'+md+'/r0/'+MY);
    ok('[ผจญภัย·'+md+'] เข้าสนามอัตโนมัติ + เขียน path ใหม่ /wroom/'+md, !!wrote, JSON.stringify(wrote||null));
    if(md==='drive') ok('[ผจญภัย·drive] ยังมี ts ในแพ็กเก็ตร้อน (ใช้คำนวณไฟเบรกเพื่อน)',
      wrote && typeof wrote.ts==='number', 'ts='+(wrote&&wrote.ts));
    if(md==='adv'){
      seedPeers('adv', 0, 5, 10);
      await sleep(250);
      W.peersTick(1/60);
      const board=document.querySelector('#adv-board');
      const t=txt(board);
      ok('[ผจญภัย] ป้ายบอกสนาม+จำนวนคนบนกระดาน', /สนาม\s*1/.test(t) && /6\s*คน/.test(t), t.slice(0,140));
      ok('[ผจญภัย] มีปุ่ม "ไปหาเพื่อน"', !!(board&&board.querySelector('.nr-go')), '');
    }
    try{ W.exitWorld(); }catch(e){}
    await sleep(150);
    ok('[ผจญภัย·'+md+'] ออกแล้วไม่มีข้อมูลค้างในสนาม', !FakeDB.get('wroom/'+md+'/r0/'+MY), '');
  }
};

/* ── แผง "ไปหาเพื่อน" ต้องพอดีจอ ไม่มี scroll (กฎทองข้อ 7) ── */
T.friendPanelFit=async function(){
  FakeDB.reset(); await FakeDB.install(); window.onlineKey=()=>MY;
  const now=Date.now();
  Online.friends=[];
  for(let i=0;i<9;i++){
    FakeDB.seed('winfo/adv/r'+(i%3)+'/bud'+i, {n:'เพื่อนชื่อยาวมากทดสอบ'+i, t:now, j:now});
    Online.friends.push({id:'bud'+i, n:'เพื่อนชื่อยาวมากทดสอบ'+i});
  }
  const r=NetRoom.create({map:'adv', sendMs:170, push(){ r.send({n:'ครูเทส',x:0,z:0,yaw:0,av:'foot',w:0},true); },
                          onPeer(){}, onPeerGone(){}, onStatus(){}, toast(){}});
  r.join(); await sleep(120);
  r.openFriends(); await sleep(200);

  const ov0=document.getElementById('nr-friends');
  ok('แผงไปหาเพื่อน เปิดได้', !!ov0, ov0?'':'ไม่พบ overlay');
  window.__NRFIT=function(){
    const ov=document.getElementById('nr-friends');
    if(!ov) return null;
    const card=ov.firstElementChild, rc=card.getBoundingClientRect();
    return {w:innerWidth, h:innerHeight, cw:Math.round(rc.width), ch:Math.round(rc.height),
            top:Math.round(rc.top), bottom:Math.round(rc.bottom), left:Math.round(rc.left), right:Math.round(rc.right),
            scrollH:card.scrollHeight, clientH:card.clientHeight,
            fits: rc.top>=-1 && rc.bottom<=innerHeight+1 && rc.left>=-1 && rc.right<=innerWidth+1,
            noScroll: card.scrollHeight<=card.clientHeight+1};
  };
  const ov=document.getElementById('nr-friends');
  ok('แผงไปหาเพื่อน โชว์ชื่อเล่น+🆔 เท่านั้น (ไม่มีชื่อจริง/ชั้นเรียน)',
     !!ov && !/ป\.\d|ม\.\d|ชั้น|ชื่อจริง/.test(txt(ov)), txt(ov).slice(0,150));
  window.__NRROOM=r;      // เปิดค้างไว้ให้เทสต์ขนาดจอวัดต่อ (ปิดเองด้วย W3D.closePanel())
};
window.__nrClose=function(){ if(window.__NRROOM){ __NRROOM.closeFriends(); __NRROOM.leave(); __NRROOM=null; }
  if(typeof Online!=='undefined') delete Online.friends; };

window.W3D={
  ...T, boot, seedPeers,
  _resize:async ()=>{},
  async all(){
    log.length=0;
    await boot();
    for(const n of ['invasion','moto','adventure','friendPanelFit']){
      console.log('\n── '+n+' ──');
      try{ await T[n](); }catch(e){ ok(n+' (ทำงานจนจบ)', false, (e&&e.message)||e); }
    }
    const pass=log.filter(l=>l.pass).length;
    console.log('\n===== ผ่าน '+pass+'/'+log.length+' =====');
    return {pass, total:log.length, log};
  },
  get log(){ return log; },
};
})();
