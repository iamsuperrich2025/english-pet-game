"use strict";
/* ============================================================
   🌐🎧 PICQUIZ ONLINE — แข่งครูถามศัพท์จากหนังสือ
   · ห้องส่วนตัวด้วยรหัส 6 ตัว · สูงสุด 50 คน · เจ้าของกดเริ่ม
   · 10 คำ/รอบ · ฟังเสียงแล้วแตะการ์ด · คะแนนตามความเร็ว
   · แชทกลุ่มกรองคำหยาบ · สายเสียง WebRTC P2P สูงสุด 8 คน

   Firebase:
     /pquizRooms/<CODE>             room/game/members/chat/voice
     /pquizRtc/<CODE>/<toUid>/<id>  WebRTC signaling ที่ผู้รับอ่านแล้วลบ
   เสียงวิ่งตรงระหว่างเครื่อง ไม่บันทึกลง Firebase
   ============================================================ */
(function(){
  const ROOM_MAX = 50, VOICE_MAX = 8, CHAT_MAX = 160, CHAT_KEEP = 80;
  const ROUND_TOTAL = 10, ASK_MS = 12000, RESULT_MS = 2600;
  const RTC_CFG = {iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}]};
  const $ = id => document.getElementById(id);
  const esc = s => typeof escapeHTML === 'function' ? escapeHTML(String(s == null ? '' : s))
                                                    : String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now = ()=>Date.now() + (P.serverOffset || 0);
  const myUid = ()=> typeof onlineKey === 'function' ? onlineKey() : (window.Auth && Auth.user && Auth.user.uid) || '';
  const myName = ()=> typeof onlineDisplayName === 'function' ? onlineDisplayName() : (window.state && state.student && state.student.name) || 'ผู้เล่น';
  const myGrade = ()=> (window.state && state.student && state.student.grade) || '';
  const serverTS = ()=> window.firebase && firebase.database ? firebase.database.ServerValue.TIMESTAMP : Date.now();
  const dbReady = ()=> !!(window.Online && Online.ready && Online.db && myUid());
  const tell = (msg, ms)=> typeof toast === 'function' ? toast(msg, ms) : void 0;

  const P = {
    root:null, mode:null, hub:null, room:null, hud:null, drawer:null, incoming:null,
    code:'', owner:'', title:'', status:'', members:{}, scores:{}, game:null, chats:[], voice:null,
    refs:[], memberRef:null, memberSlot:'', roomRef:null, serverOffset:0, beat:null, tick:null, gameBusy:false,
    answered:'', lastQuestion:'', lastChat:'', declinedCall:0, wordPool:[], usedWords:new Set(),
    voiceLocal:null, voicePeers:{}, voiceInbox:null, voiceMemberRef:null, micOn:true,
  };

  function ensureUI(){
    if(P.root) return;
    const root = document.createElement('div');
    root.id = 'pqr-root';
    root.innerHTML = `
      <div class="pqr-shade" id="pqr-mode" hidden>
        <div class="pqr-card pqr-mode-card">
          <button class="pqr-x" data-pqr="mode-x" aria-label="ปิด">✕</button>
          <h2>🎧 ครูถามศัพท์จากหนังสือ</h2>
          <p>เลือกวิธีเล่น</p>
          <div class="pqr-mode-grid">
            <button class="pqr-mode-btn solo" data-pqr="solo"><b>👤 เล่นคนเดียว</b><small>ฝึกหาคำตามจังหวะของเรา</small></button>
            <button class="pqr-mode-btn online" data-pqr="online"><b>🌐 แข่งออนไลน์</b><small>สร้างห้องหรือเข้าด้วยรหัส สูงสุด ${ROOM_MAX} คน</small></button>
          </div>
        </div>
      </div>
      <section class="pqr-full" id="pqr-hub" hidden>
        <header><button data-pqr="hub-back">⬅ กลับ</button><h2>🌐 ห้องแข่งครูถามศัพท์</h2><span class="pqr-net" id="pqr-net">กำลังเชื่อมต่อ…</span></header>
        <div class="pqr-hub-body">
          <div class="pqr-card pqr-create">
            <div class="pqr-bigicon">🏁</div><h3>สร้างห้องใหม่</h3>
            <label>ชื่อห้อง<input id="pqr-title" maxlength="30" autocomplete="off"></label>
            <button class="pqr-primary" data-pqr="create">➕ สร้างห้อง (1–${ROOM_MAX} คน)</button>
            <small>🔒 ส่งรหัสห้อง 6 ตัวให้เฉพาะคนที่ต้องการชวน</small>
          </div>
          <div class="pqr-or">หรือ</div>
          <div class="pqr-card pqr-join">
            <div class="pqr-bigicon">🚪</div><h3>เข้าห้องด้วยรหัส</h3>
            <label>รหัสห้อง<input id="pqr-code" class="pqr-code-input" maxlength="6" inputmode="text" autocomplete="off" placeholder="ABC123"></label>
            <button class="pqr-primary blue" data-pqr="join">🚀 เข้าห้อง</button>
            <small>ต้องเข้าด้วยบัญชี Google · ห้องเต็มแล้วจะเข้าไม่ได้</small>
          </div>
        </div>
      </section>
      <section class="pqr-full" id="pqr-room" hidden>
        <header class="pqr-room-head">
          <button data-pqr="leave">⬅ ออก</button>
          <div><h2 id="pqr-room-title">ห้องแข่ง</h2><button class="pqr-code-chip" id="pqr-code-chip" data-pqr="copy">รหัส ------ 📋</button></div>
          <div class="pqr-head-actions"><span id="pqr-count">👥 0/${ROOM_MAX}</span><button class="pqr-call" data-pqr="call">📞 เริ่มสายเสียง</button></div>
        </header>
        <div class="pqr-room-grid">
          <div class="pqr-card pqr-members"><h3>👥 ผู้เล่น <span id="pqr-member-n"></span></h3><div id="pqr-member-list"></div></div>
          <div class="pqr-card pqr-wait">
            <div class="pqr-room-hero">📖🎧</div><h3 id="pqr-wait-title">รอเจ้าของห้องเริ่มเกม</h3>
            <p>10 คำ · ฟังเสียงแล้วแตะการ์ดให้ถูก · ตอบเร็วได้คะแนนมาก</p>
            <button class="pqr-start" id="pqr-start" data-pqr="start" hidden>🏁 เริ่มเกมตอนนี้</button>
            <div class="pqr-voice-note">🎧 สายเสียงกลุ่มรองรับ ${VOICE_MAX} คนพร้อมกัน ห้องเกมยังรองรับ ${ROOM_MAX} คนเต็ม</div>
          </div>
          <div class="pqr-card pqr-chat"><h3>💬 แชทในห้อง</h3><div class="pqr-chat-list" id="pqr-chat-list"></div>${chatForm('room')}</div>
        </div>
      </section>
      <div class="pqr-hud" id="pqr-hud" hidden>
        <div class="pqr-hud-main"><b id="pqr-round">รอบ 1/10</b><span id="pqr-ask">👂 ตั้งใจฟัง…</span><b id="pqr-timer">12.0</b></div>
        <div class="pqr-hud-actions"><button data-pqr="replay">🔊 ฟังอีก</button><button data-pqr="scores">🏆 อันดับ</button><button data-pqr="chat">💬 แชท</button><button data-pqr="mic">🎤 ไมค์</button><button class="pqr-hang" data-pqr="hang">📞 วางสาย</button><button data-pqr="game-leave">✕ ออก</button></div>
      </div>
      <div class="pqr-drawer" id="pqr-drawer" hidden><div class="pqr-drawer-card"><button class="pqr-x" data-pqr="drawer-x">✕</button><div id="pqr-drawer-body"></div></div></div>
      <div class="pqr-incoming" id="pqr-incoming" hidden><div><span>📞</span><b id="pqr-incoming-title">สายเสียงกลุ่ม</b><small>ไมโครโฟนจะเปิดเมื่อกดรับเท่านั้น · ไม่มีการอัดเสียง</small><div><button class="accept" data-pqr="accept">🎤 รับสาย</button><button class="decline" data-pqr="decline">✕ ไม่รับ</button></div></div></div>
      <div id="pqr-audio" hidden></div>`;
    document.body.appendChild(root);
    P.root=root; P.mode=$('pqr-mode'); P.hub=$('pqr-hub'); P.room=$('pqr-room');
    P.hud=$('pqr-hud'); P.drawer=$('pqr-drawer'); P.incoming=$('pqr-incoming');
    root.addEventListener('click', onAction);
    ['pqr-title','pqr-code'].forEach(id=>$(id).addEventListener('keydown',e=>{
      if(e.key==='Enter') id==='pqr-title' ? createRoom() : joinFromInput();
    }));
    $('pqr-code').addEventListener('input',e=>{ e.target.value=cleanCode(e.target.value); });
  }

  function chatForm(where){
    return `<form class="pqr-chat-form" data-pqr-form="${where}"><input maxlength="${CHAT_MAX}" placeholder="พิมพ์ข้อความสุภาพ…" autocomplete="off"><button>ส่ง ➤</button></form>`;
  }

  function onAction(e){
    const b=e.target.closest('[data-pqr]');
    if(!b) return;
    const a=b.dataset.pqr;
    if(a==='mode-x') hideMode();
    else if(a==='solo'){ hideMode(); if(window.PicDict) PicDict.openQuiz(); }
    else if(a==='online'){ hideMode(); openHub(); }
    else if(a==='hub-back') closeHub();
    else if(a==='create') createRoom();
    else if(a==='join') joinFromInput();
    else if(a==='leave'||a==='game-leave') leaveRoom(true);
    else if(a==='copy') copyCode();
    else if(a==='start') startGame();
    else if(a==='call') startVoiceCall();
    else if(a==='accept') voiceAccept();
    else if(a==='decline') voiceDecline();
    else if(a==='mic') voiceToggleMic();
    else if(a==='hang') voiceHangup();
    else if(a==='replay') speakQuestion();
    else if(a==='scores') openScores();
    else if(a==='chat') openChatDrawer();
    else if(a==='drawer-x') P.drawer.hidden=true;
  }

  function showMode(){
    ensureUI();
    P.mode.hidden=false;
  }
  function hideMode(){ if(P.mode) P.mode.hidden=true; }
  function openHub(){
    ensureUI();
    if(!dbReady()){
      tell('📡 โหมดออนไลน์ต้องเชื่อมอินเทอร์เน็ตและเข้าด้วย Google ก่อนนะ',2600);
      return;
    }
    P.hub.hidden=false;
    $('pqr-net').textContent='🟢 ออนไลน์';
    $('pqr-title').value=('ห้องของ '+myName()).slice(0,30);
    Online.db.ref('.info/serverTimeOffset').once('value').then(s=>{ P.serverOffset=Number(s.val())||0; }).catch(()=>{});
  }
  function closeHub(){ if(P.hub) P.hub.hidden=true; }
  function cleanCode(s){ return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6); }
  function roomCode(){
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s='';
    if(window.crypto && crypto.getRandomValues){ const a=new Uint8Array(6); crypto.getRandomValues(a); a.forEach(x=>s+=chars[x%chars.length]); }
    else for(let i=0;i<6;i++) s+=chars[Math.floor(Math.random()*chars.length)];
    return s;
  }
  function validTitle(raw){
    const s=String(raw||'').replace(/\s+/g,' ').trim().slice(0,30);
    if(s.length<3) return {ok:false,msg:'ชื่อห้องต้องยาวอย่างน้อย 3 ตัวนะ'};
    if(typeof nameHasBadWord==='function' && nameHasBadWord(s)) return {ok:false,msg:'ชื่อห้องมีคำไม่สุภาพ ลองตั้งใหม่นะ 😊'};
    return {ok:true,s};
  }
  function memberData(){ return {u:myUid(),n:myName().slice(0,40),g:myGrade().slice(0,20),at:serverTS()}; }
  function membersByUid(raw){
    const out={}; Object.keys(raw||{}).forEach(slot=>{const m=raw[slot];if(m&&m.u)out[m.u]=Object.assign({_slot:String(slot)},m);});
    return out;
  }
  function voiceMembers(){
    const out={},raw=P.voice&&P.voice.members||{};Object.keys(raw).forEach(slot=>{const m=raw[slot];if(m&&m.u)out[m.u]=Object.assign({_slot:String(slot)},m);});
    return out;
  }

  async function createRoom(){
    if(!dbReady()) return openHub();
    const ck=validTitle($('pqr-title').value); if(!ck.ok){ tell(ck.msg); return; }
    const uid=myUid();
    for(let tries=0;tries<6;tries++){
      const code=roomCode(), ref=Online.db.ref('pquizRooms/'+code);
      const payload={owner:uid,title:ck.s,status:'waiting',created:serverTS(),members:{0:memberData()}};
      try{
        const res=await ref.transaction(cur=>cur===null?payload:undefined,undefined,false);
        if(res.committed){ await enterRoom(code,true); return; }
      }catch(err){ rulesFail(err); return; }
    }
    tell('⚠️ สร้างรหัสห้องไม่สำเร็จ ลองใหม่อีกครั้งนะ');
  }
  function joinFromInput(){
    const code=cleanCode($('pqr-code').value);
    if(code.length!==6){ tell('รหัสห้องมี 6 ตัวนะ'); return; }
    enterRoom(code,false);
  }
  async function enterRoom(code, created){
    if(!dbReady()) return;
    if(P.code) await leaveRoom(false);
    const ref=Online.db.ref('pquizRooms/'+code);
    let room;
    try{ room=(await ref.once('value')).val(); }
    catch(err){ rulesFail(err); return; }
    if(!room){ tell('🔎 ไม่พบห้องนี้ ตรวจรหัสอีกครั้งนะ'); return; }
    const rawMembers=room.members||{}, members=membersByUid(rawMembers), uid=myUid(), count=Object.keys(members).length;
    if(!members[uid] && room.status==='playing'){ tell('⏳ เกมเริ่มแล้ว รอรอบถัดไปก่อนนะ'); return; }
    if(!members[uid] && count>=ROOM_MAX){ tell('🧯 ห้องเต็มแล้ว ('+count+'/'+ROOM_MAX+' คน)'); return; }
    let memberRef=null, memberSlot=members[uid]&&members[uid]._slot||'';
    try{
      if(memberSlot){ memberRef=ref.child('members/'+memberSlot); await memberRef.child('at').set(serverTS()); }
      else{
        const free=Array.from({length:ROOM_MAX},(_,i)=>String(i)).filter(slot=>!rawMembers[slot]);
        for(const slot of free){
          const slotRef=ref.child('members/'+slot),res=await slotRef.transaction(cur=>cur===null?memberData():undefined,undefined,false);
          if(res.committed){memberSlot=slot;memberRef=slotRef;break;}
        }
        if(!memberRef)throw Object.assign(new Error('room-full'),{name:'QuotaExceededError'});
      }
    }
    catch(err){ tell('🧯 เข้าห้องไม่ได้ ห้องอาจเต็มแล้วหรือยังไม่เปิดกฎความปลอดภัย'); return; }
    memberRef.onDisconnect().remove();
    if(room.owner===uid) ref.onDisconnect().remove();       // เจ้าของหลุด/ปิดแท็บ = ปิดห้องทันที ไม่ทิ้งห้องผี
    P.code=code; P.roomRef=ref; P.memberRef=memberRef; P.memberSlot=memberSlot; P.owner=room.owner; P.title=room.title;
    P.hub.hidden=true; P.room.hidden=false;
    bindRoom();
    if(created) tell('✅ สร้างห้อง '+code+' แล้ว ส่งรหัสนี้ให้เพื่อนได้เลย 🎉',2600);
  }
  function listen(ref,event,fn){ ref.on(event,fn); P.refs.push(()=>ref.off(event,fn)); }
  function bindRoom(){
    const r=P.roomRef;
    listen(r.child('owner'),'value',s=>{
      if(!s.exists()){ roomClosed(); return; }
      P.owner=s.val(); paintRoom();
    });
    listen(r.child('title'),'value',s=>{ P.title=s.val()||'ห้องแข่ง'; paintRoom(); });
    listen(r.child('status'),'value',s=>{ P.status=s.val()||'waiting'; paintRoom(); });
    listen(r.child('members'),'value',s=>{ P.members=membersByUid(s.val()||{}); paintMembers(); voiceSyncMembers(); });
    listen(r.child('scores'),'value',s=>{ P.scores=s.val()||{}; paintMembers(); if(!P.drawer.hidden && P.drawer.dataset.kind==='scores') openScores(); });
    listen(r.child('game'),'value',s=>{ P.game=s.val()||null; onGame(); });
    const cq=r.child('chat').orderByKey().limitToLast(CHAT_KEEP);
    listen(cq,'value',s=>{ const a=[]; s.forEach(ch=>{const v=ch.val();if(v&&v.t)a.push(Object.assign({key:ch.key},v));}); P.chats=a; paintChat(); });
    listen(r.child('voice'),'value',s=>{ P.voice=s.val()||null; onVoiceState(); });
    P.beat=setInterval(()=>{ if(P.memberRef) P.memberRef.child('at').set(serverTS()).catch(()=>{}); },20000);
    P.tick=setInterval(gameTick,200);
    paintRoom(); paintMembers(); paintChat();
  }
  function unbindRoom(){ P.refs.splice(0).forEach(fn=>{try{fn();}catch(e){}}); clearInterval(P.beat); clearInterval(P.tick); P.beat=P.tick=null; }
  async function leaveRoom(ask){
    if(!P.code) return;
    if(ask && typeof askConfirm==='function'){
      askConfirm(`<h2>🚪 ออกจากห้อง?</h2><p>${P.owner===myUid()?'คุณเป็นเจ้าของ ห้องจะปิดให้ทุกคนนะ':'คะแนนรอบนี้จะไม่ถูกเก็บ'}</p>`,'ออกจากห้อง',()=>leaveRoom(false));
      return;
    }
    const wasOwner=P.owner===myUid(), ref=P.roomRef, member=P.memberRef;
    voiceCleanup(true); unbindRoom();
    try{ if(member) member.onDisconnect().cancel(); }catch(e){}
    try{ if(wasOwner&&ref) ref.onDisconnect().cancel(); }catch(e){}
    try{ if(ref) wasOwner ? await ref.remove() : await member.remove(); }catch(e){}
    resetRoomUI();
  }
  function roomClosed(){
    if(!P.code) return;
    tell('🚪 เจ้าของปิดห้องแล้ว');
    voiceCleanup(true); unbindRoom(); resetRoomUI();
  }
  function resetRoomUI(){
    document.body.classList.remove('pqr-playing');
    const sec=$('screen-picdict'); if(sec) sec.classList.remove('pqr-online');
    P.code='';P.owner='';P.title='';P.status='';P.members={};P.scores={};P.game=null;P.chats=[];P.voice=null;
    P.roomRef=P.memberRef=null;P.memberSlot='';P.answered=P.lastQuestion='';P.usedWords.clear();
    if(P.room) P.room.hidden=true; if(P.hud) P.hud.hidden=true; if(P.drawer) P.drawer.hidden=true; if(P.incoming) P.incoming.hidden=true;
    if(P.hub) P.hub.hidden=false;
    if(window.PicDict && $('screen-picdict') && $('screen-picdict').classList.contains('active')) PicDict.exit();
  }
  function rulesFail(){ tell('⚠️ โหมดห้องออนไลน์ยังไม่เปิดใช้งาน<br><small>ต้อง publish Firebase Security Rules โซน pquizRooms/pquizRtc ก่อน</small>',4200); }

  function paintRoom(){
    if(!P.code) return;
    $('pqr-room-title').textContent=P.title||'ห้องแข่ง';
    $('pqr-code-chip').textContent='รหัส '+P.code+' 📋';
    const mine=P.owner===myUid(), start=$('pqr-start'); start.hidden=!mine;
    start.textContent=P.status==='finished'?'🔄 เล่นอีกรอบ':'🏁 เริ่มเกมตอนนี้';
    start.disabled=P.status==='playing';
    $('pqr-wait-title').textContent=mine?'คุณเป็นเจ้าของ กดเริ่มได้ทันที':'รอเจ้าของห้องเริ่มเกม';
    const call=P.voice&&P.voice.state&&P.voice.state!=='idle';
    const cb=P.room.querySelector('[data-pqr="call"]');
    cb.hidden=!mine||call; cb.textContent='📞 เริ่มสายเสียง';
  }
  function rankedMembers(){
    return Object.keys(P.members).map(uid=>{
      const m=P.members[uid]||{}, s=P.scores[uid]||{};
      return {uid,n:m.n||'ผู้เล่น',g:m.g||'',score:Number(s.score)||0,ok:Number(s.ok)||0,wrong:Number(s.wrong)||0};
    }).sort((a,b)=>(b.score-a.score)||(b.ok-a.ok)||a.n.localeCompare(b.n,'th'));
  }
  function paintMembers(){
    if(!P.code) return;
    const rows=rankedMembers(), voice=voiceMembers();
    $('pqr-count').textContent='👥 '+rows.length+'/'+ROOM_MAX;
    $('pqr-member-n').textContent=rows.length+'/'+ROOM_MAX;
    $('pqr-member-list').innerHTML=rows.slice(0,12).map((m,i)=>`<div class="pqr-member ${m.uid===myUid()?'me':''}"><span>${P.status==='playing'?(i+1)+'.':'🟢'} ${esc(m.n)} ${m.uid===P.owner?'👑':''} ${voice[m.uid]?'🎤':''}</span><b>${P.status==='playing'||P.status==='finished'?m.score.toLocaleString()+' pt':esc(m.g)}</b></div>`).join('')+(rows.length>12?`<div class="pqr-more">+ อีก ${rows.length-12} คน</div>`:'');
  }
  function copyCode(){
    if(!P.code) return;
    const text='มาแข่งครูถามศัพท์ใน Vocab World กัน! รหัสห้อง: '+P.code;
    if(navigator.clipboard) navigator.clipboard.writeText(text).then(()=>tell('📋 คัดลอกรหัส '+P.code+' แล้ว')).catch(()=>tell('รหัสห้อง: '+P.code));
    else tell('รหัสห้อง: '+P.code);
  }

  /* ---------- 💬 แชทกลุ่ม ---------- */
  document.addEventListener('submit',e=>{
    const f=e.target.closest('.pqr-chat-form'); if(!f) return;
    e.preventDefault(); sendChat(f.querySelector('input'));
  });
  async function sendChat(inp){
    if(!P.roomRef||!P.members[myUid()]) return;
    const t=String(inp.value||'').replace(/\s+/g,' ').trim();
    if(!t) return;
    if(t.length>CHAT_MAX){ tell('ข้อความยาวได้ไม่เกิน '+CHAT_MAX+' ตัว'); return; }
    if(typeof nameHasBadWord==='function'&&nameHasBadWord(t)){ tell('ข้อความมีคำไม่สุภาพ พิมพ์ใหม่นะ 😊'); return; }
    inp.value='';
    try{
      await P.roomRef.child('chat').push({u:myUid(),s:P.memberSlot,n:myName().slice(0,40),t,ts:serverTS()});
      if(P.owner===myUid()&&P.chats.length>=CHAT_KEEP){ const old=P.chats.slice(0,P.chats.length-CHAT_KEEP+1); old.forEach(m=>P.roomRef.child('chat/'+m.key).remove().catch(()=>{})); }
    }catch(e){ rulesFail(e); }
  }
  function chatHTML(){
    if(!P.chats.length) return '<div class="pqr-empty">💬 ยังไม่มีข้อความ</div>';
    return P.chats.slice(-20).map(m=>`<div class="pqr-msg ${m.u===myUid()?'mine':''}"><b>${esc(m.n)}</b><span>${esc(m.t)}</span></div>`).join('');
  }
  function paintChat(){
    const box=$('pqr-chat-list'); if(box){ box.innerHTML=chatHTML(); box.scrollTop=box.scrollHeight; }
    if(!P.drawer.hidden&&P.drawer.dataset.kind==='chat') openChatDrawer();
  }
  function openChatDrawer(){
    P.drawer.hidden=false; P.drawer.dataset.kind='chat';
    $('pqr-drawer-body').innerHTML='<h3>💬 แชทในห้อง</h3><div class="pqr-chat-list pqr-chat-draw">'+chatHTML()+'</div>'+chatForm('drawer');
    const box=$('pqr-drawer-body').querySelector('.pqr-chat-list'); box.scrollTop=box.scrollHeight;
  }
  function openScores(){
    const rows=rankedMembers(); P.drawer.hidden=false;P.drawer.dataset.kind='scores';
    $('pqr-drawer-body').innerHTML='<h3>🏆 อันดับในห้อง</h3><div class="pqr-score-list">'+rows.slice(0,15).map((m,i)=>`<div class="pqr-score-row ${m.uid===myUid()?'me':''}"><b>${i<3?['🥇','🥈','🥉'][i]:i+1}</b><span>${esc(m.n)} ${m.uid===P.owner?'👑':''}</span><strong>${m.score.toLocaleString()} pt</strong><small>ถูก ${m.ok} · ผิด ${m.wrong}</small></div>`).join('')+(rows.length>15?`<div class="pqr-more">+ อีก ${rows.length-15} คน</div>`:'')+'</div>';
  }

  /* ---------- 🏁 เกมแข่ง ---------- */
  function makePool(){
    if(P.wordPool.length) return P.wordPool;
    if(!window.PicDict||!PicDict._t) return [];
    PicDict._t.buildPages();
    P.wordPool=[];
    PicDict._t.pd.pages.forEach((pg,idx)=>{
      if(!pg||pg.type!=='sheet'||!window.PICDICT_WORDS||!PICDICT_WORDS[pg.file]) return;
      PICDICT_WORDS[pg.file].words.forEach(w=>{ if(w&&w[0]) P.wordPool.push({en:String(w[0]),th:String(w[1]||''),spread:Math.floor(idx/2)}); });
    });
    return P.wordPool;
  }
  async function startGame(){
    if(P.owner!==myUid()||!P.roomRef||P.status==='playing') return;
    if(!makePool().length){ tell('⚠️ ยังไม่มีคำศัพท์ในหนังสือ'); return; }
    const scores={}; Object.keys(P.members).forEach(uid=>{scores[uid]={n:(P.members[uid].n||'ผู้เล่น').slice(0,40),score:0,ok:0,wrong:0};});
    const id=myUid().slice(-8)+'-'+now().toString(36);
    P.usedWords.clear(); P.answered='';
    try{
      await P.roomRef.update({status:'playing',scores,answers:null,game:{id,phase:'countdown',round:0,total:ROUND_TOTAL,startAt:now()+3200}});
    }catch(e){ rulesFail(e); }
  }
  function pickWord(){
    const pool=makePool(); if(!pool.length) return null;
    let choices=pool.filter(w=>!P.usedWords.has(w.en.toLowerCase()));
    if(!choices.length){ P.usedWords.clear(); choices=pool; }
    const q=choices[Math.floor(Math.random()*choices.length)]; P.usedWords.add(q.en.toLowerCase()); return q;
  }
  async function nextQuestion(round){
    if(P.owner!==myUid()||P.gameBusy) return;
    P.gameBusy=true;
    const q=pickWord(), start=now()+500;
    if(!q){ P.gameBusy=false; return; }
    try{
      await P.roomRef.child('game').set({id:P.game.id,phase:'question',round,total:ROUND_TOTAL,startAt:start,deadline:start+ASK_MS,q:{id:P.game.id+'-'+round,en:q.en,th:q.th,spread:q.spread}});
    }finally{P.gameBusy=false;}
  }
  async function finishRound(){
    if(P.owner!==myUid()||P.gameBusy||!P.game||P.game.phase!=='question') return;
    P.gameBusy=true;
    try{
      const round=P.game.round, q=P.game.q, start=P.game.startAt||now();
      const [as,ss]=await Promise.all([P.roomRef.child('answers/'+round).once('value'),P.roomRef.child('scores').once('value')]);
      const answers=as.val()||{}, scores=ss.val()||{}, correct=[];
      Object.keys(P.members).forEach(uid=>{
        const m=P.members[uid]||{}, old=scores[uid]||{n:m.n||'ผู้เล่น',score:0,ok:0,wrong:0}, a=answers[uid];
        old.n=(m.n||old.n||'ผู้เล่น').slice(0,40); old.score=Number(old.score)||0;old.ok=Number(old.ok)||0;old.wrong=Number(old.wrong)||0;
        if(a&&a.pick===q.en){ const ms=Math.max(0,Math.min(ASK_MS,(Number(a.ts)||P.game.deadline)-start)); const pts=Math.max(100,1000-Math.floor(ms/20)); old.score+=pts;old.ok++;correct.push({uid,n:old.n,pts,ms}); }
        else if(a){ old.wrong++; }
        scores[uid]=old;
      });
      correct.sort((a,b)=>a.ms-b.ms);
      await P.roomRef.update({scores,game:{id:P.game.id,phase:'result',round,total:ROUND_TOTAL,startAt:start,deadline:P.game.deadline,q,result:{correct:correct.length,fast:correct[0]||null,nextAt:now()+RESULT_MS}}});
    }catch(e){}finally{P.gameBusy=false;}
  }
  async function finishGame(){
    if(P.owner!==myUid()||P.gameBusy) return; P.gameBusy=true;
    try{
      const rows=rankedMembers(), top=rows.slice(0,3).map(x=>({u:x.uid,n:x.n,s:x.score}));
      await P.roomRef.update({status:'finished',game:{id:P.game.id,phase:'finished',round:ROUND_TOTAL,total:ROUND_TOTAL,endedAt:now(),top}});
    }finally{P.gameBusy=false;}
  }
  function gameTick(){
    if(!P.code||!P.game) return;
    const t=now(), g=P.game;
    if(P.owner===myUid()){
      if(g.phase==='countdown'&&t>=g.startAt) nextQuestion(1);
      else if(g.phase==='question'&&t>=g.deadline) finishRound();
      else if(g.phase==='result'&&g.result&&t>=g.result.nextAt){ g.round>=ROUND_TOTAL?finishGame():nextQuestion(g.round+1); }
    }
    if(!P.hud.hidden){
      if(g.phase==='countdown') $('pqr-timer').textContent=Math.max(0,Math.ceil((g.startAt-t)/1000));
      else if(g.phase==='question') $('pqr-timer').textContent=(Math.max(0,g.deadline-t)/1000).toFixed(1);
    }
  }
  function onGame(){
    if(!P.game) return;
    const g=P.game;
    if(g.phase==='countdown'||g.phase==='question'||g.phase==='result') enterBookGame();
    if(g.phase==='question'&&g.q&&g.q.id!==P.lastQuestion){
      P.lastQuestion=g.q.id;P.answered=''; showQuestion();
    }else if(g.phase==='result'){ showResult(); }
    else if(g.phase==='finished') showFinished();
  }
  function enterBookGame(){
    if(!window.PicDict) return;
    P.room.hidden=true; P.hud.hidden=false; document.body.classList.add('pqr-playing');
    PicDict.open(); const sec=$('screen-picdict'); if(sec) sec.classList.add('pqr-online');
    if(!PicDict._t.pd.opened){ PicDict._t.openBook(); }
    if(P.game&&P.game.q) moveToQuestion(P.game.q.spread);
    $('pqr-round').textContent=P.game.phase==='countdown'?'เตรียมตัว':`คำที่ ${P.game.round}/${ROUND_TOTAL}`;
    paintVoiceButtons();
  }
  function moveToQuestion(spread){
    let tries=0; const go=()=>{
      if(!P.code||!P.game||!P.game.q) return;
      if(!PicDict._t.pd.opened||PicDict._t.pd.busy){ if(tries++<25)setTimeout(go,160);return; }
      if(PicDict._t.pd.s!==spread) PicDict._t.goTo(spread); else PicDict._t.renderSpread();
    }; go();
  }
  function showQuestion(){
    const g=P.game; if(!g||!g.q)return;
    $('pqr-round').textContent=`คำที่ ${g.round}/${ROUND_TOTAL}`;
    $('pqr-ask').innerHTML='👂 ฟังคำศัพท์แล้วแตะการ์ดให้ถูก';
    moveToQuestion(g.q.spread); setTimeout(speakQuestion,650);
  }
  function speakQuestion(){ if(P.game&&P.game.q&&typeof speakWord==='function') speakWord(P.game.q.en); }
  function showResult(){
    if(!P.game||!P.game.result)return; const r=P.game.result;
    $('pqr-ask').innerHTML=r.fast?`✅ เร็วที่สุด: <b>${esc(r.fast.n)}</b> +${r.fast.pts} pt · ตอบถูก ${r.correct} คน`:'⏰ หมดเวลา ยังไม่มีใครตอบถูก';
    $('pqr-timer').textContent='•••';
  }
  function showFinished(){
    P.hud.hidden=true; document.body.classList.remove('pqr-playing'); const sec=$('screen-picdict');if(sec)sec.classList.remove('pqr-online');
    if(window.PicDict&&sec&&sec.classList.contains('active')) PicDict.exit();
    P.room.hidden=false; paintRoom();paintMembers();openScores();
    const top=(P.game&&P.game.top)||[];
    tell(top.length?`🏆 จบเกมแล้ว! แชมป์รอบนี้คือ ${esc(top[0].n)} 🎉`:'🏆 จบเกมแล้ว',3500);
  }
  async function answerCard(cell){
    const g=P.game; if(!g||g.phase!=='question'||!g.q||P.answered===g.q.id)return;
    const pick=cell.dataset.en||''; P.answered=g.q.id;
    cell.classList.add(pick===g.q.en?'pqr-ok':'pqr-no');
    $('pqr-ask').innerHTML=pick===g.q.en?'✅ ถูกต้อง! รอเฉลยคะแนน…':'❌ ยังไม่ถูก รอคำถัดไปนะ';
    try{ await P.roomRef.child('answers/'+g.round+'/'+myUid()).transaction(cur=>cur===null?{qid:g.q.id,pick:pick.slice(0,40),s:P.memberSlot,ts:serverTS()}:undefined,undefined,false); }
    catch(e){ tell('⚠️ ส่งคำตอบไม่สำเร็จ'); }
  }

  /* ดักก่อน handler โหมดเดี่ยว — ไม่ต้องแก้ js/picdict.js ซึ่งมีงาน session อื่นค้างอยู่ */
  document.addEventListener('click',e=>{
    const launch=e.target.closest&&e.target.closest('#btn-picquiz,#pd-quizbtn');
    if(launch&&!P.code){ e.preventDefault();e.stopImmediatePropagation();showMode();return; }
    const cell=e.target.closest&&e.target.closest('#screen-picdict.pqr-online .pd-cell');
    if(cell&&P.code&&P.game&&P.game.phase==='question'){ e.preventDefault();e.stopImmediatePropagation();answerCard(cell); }
  },true);
  ['pointerdown','touchstart'].forEach(ev=>document.addEventListener(ev,e=>{
    if(!P.code||!P.game||!$('screen-picdict')||!$('screen-picdict').classList.contains('pqr-online'))return;
    if(e.target.closest&&e.target.closest('.pd-cell'))return;
    if(e.target.closest&&e.target.closest('.pd-book')){e.preventDefault();e.stopImmediatePropagation();}
  },{capture:true,passive:false}));

  /* ---------- 🎧 สายเสียงกลุ่ม WebRTC mesh ไม่เกิน 8 คน ---------- */
  async function startVoiceCall(){
    if(P.owner!==myUid()||!P.roomRef)return;
    if(P.voice&&P.voice.state&&P.voice.state!=='idle')return;
    try{
      await P.roomRef.child('voice').set({state:'ring',by:myUid(),n:myName().slice(0,40),at:serverTS()});
    }catch(e){ rulesFail(e); return; }
    try{ await voiceJoin(); }
    catch(e){ P.roomRef.child('voice').remove().catch(()=>{}); tell(voiceError(e),3600); }
  }
  function onVoiceState(){
    paintRoom(); paintVoiceButtons();
    if(!P.voice||!P.voice.state||P.voice.state==='idle'){ P.incoming.hidden=true;voiceCleanup(false);return; }
    const vm=voiceMembers(), inCall=!!vm[myUid()];
    if(!inCall&&P.declinedCall!==(P.voice.at||0)){
      $('pqr-incoming-title').textContent='📞 '+(P.voice.n||'เจ้าของห้อง')+' ชวนคุยสายเสียงกลุ่ม ('+Object.keys(vm).length+'/'+VOICE_MAX+')';
      P.incoming.hidden=false;
    }else P.incoming.hidden=true;
    if(inCall) voiceEnsurePeers();
  }
  async function voiceAccept(){
    P.incoming.hidden=true;
    try{await voiceJoin();}catch(e){tell(voiceError(e),3600);}
  }
  function voiceDecline(){ P.declinedCall=P.voice&&P.voice.at||0;P.incoming.hidden=true; }
  async function voiceJoin(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){const e=new Error('media');e.name='NotSupportedError';throw e;}
    if(!P.voiceLocal){ P.voiceLocal=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false}); }
    P.micOn=true;
    const raw=(await P.roomRef.child('voice/members').once('value')).val()||{}, vm=membersByUid(raw), old=vm[myUid()];
    let ref=null;
    if(old)ref=P.roomRef.child('voice/members/'+old._slot);
    else{
      const free=Array.from({length:VOICE_MAX},(_,i)=>String(i)).filter(slot=>!raw[slot]);
      for(const slot of free){
        const slotRef=P.roomRef.child('voice/members/'+slot),res=await slotRef.transaction(cur=>cur===null?{u:myUid(),rs:P.memberSlot,n:myName().slice(0,40),at:serverTS(),mic:true}:undefined,undefined,false);
        if(res.committed){ref=slotRef;break;}
      }
    }
    if(!ref){voiceStopTracks();const e=new Error('voice-full');e.name='QuotaExceededError';throw e;}
    P.voiceMemberRef=ref;
    try{ if(old)await ref.set({u:myUid(),rs:P.memberSlot,n:myName().slice(0,40),at:serverTS(),mic:true}); }
    catch(e){ voiceStopTracks(); throw e; }
    ref.onDisconnect().remove(); bindVoiceInbox(); paintVoiceButtons();
  }
  function voiceError(e){
    const n=e&&e.name||'';
    if(n==='NotAllowedError'||n==='SecurityError') return '🎤 ต้องกด “อนุญาต” ไมโครโฟนในเบราว์เซอร์ก่อนนะ';
    if(n==='NotFoundError'||n==='NotReadableError') return '🎤 ไม่พบไมโครโฟน หรือไมค์กำลังถูกแอปอื่นใช้อยู่';
    if(n==='NotSupportedError') return '⚠️ เบราว์เซอร์นี้ไม่รองรับสายเสียง';
    return '🎧 สายเสียงเต็มแล้ว ('+VOICE_MAX+'/'+VOICE_MAX+' คน) หรือต่อสายไม่สำเร็จ';
  }
  function bindVoiceInbox(){
    if(P.voiceInbox||!P.code)return;
    const ref=Online.db.ref('pquizRtc/'+P.code+'/'+myUid()); P.voiceInbox=ref;
    ref.remove().catch(()=>{});ref.onDisconnect().remove();
    ref.on('child_added',voiceSignal);
  }
  function voiceSignal(s){
    const m=s.val();s.ref.remove().catch(()=>{});if(!m||!m.f||!m.t)return;
    let d;try{d=JSON.parse(m.d);}catch(e){return;}
    const p=voicePeer(m.f,false);
    if(m.t==='offer') p.pc.setRemoteDescription(d).then(()=>{p.remote=true;flushIce(p);return p.pc.createAnswer();}).then(a=>p.pc.setLocalDescription(a)).then(()=>voiceSig(m.f,'answer',p.pc.localDescription.toJSON())).catch(()=>{});
    else if(m.t==='answer') p.pc.setRemoteDescription(d).then(()=>{p.remote=true;flushIce(p);}).catch(()=>{});
    else if(m.t==='ice'){ if(p.remote)p.pc.addIceCandidate(d).catch(()=>{});else p.ice.push(d); }
  }
  async function voiceSig(to,t,d){
    if(!P.code)return;const me=P.members[myUid()],them=P.members[to];if(!me||!them)return;
    const inbox=Online.db.ref('pquizRtc/'+P.code+'/'+to),payload={f:myUid(),s:me._slot,r:them._slot,t,d:JSON.stringify(d),ts:serverTS()};
    const start=Math.floor(Math.random()*200);
    for(let i=0;i<8;i++){try{const res=await inbox.child(String((start+i)%200)).transaction(cur=>cur===null?payload:undefined,undefined,false);if(res.committed)return;}catch(e){return;}}
  }
  function voicePeer(uid,offerer){
    if(P.voicePeers[uid])return P.voicePeers[uid];
    const pc=new RTCPeerConnection(RTC_CFG), p=P.voicePeers[uid]={uid,pc,ice:[],remote:false};
    if(P.voiceLocal)P.voiceLocal.getTracks().forEach(t=>pc.addTrack(t,P.voiceLocal));
    pc.onicecandidate=e=>{if(e.candidate)voiceSig(uid,'ice',e.candidate.toJSON());};
    pc.ontrack=e=>{
      let a=$('pqr-audio-'+safeId(uid));if(!a){a=document.createElement('audio');a.id='pqr-audio-'+safeId(uid);a.autoplay=true;$('pqr-audio').appendChild(a);}a.srcObject=e.streams[0];a.play().catch(()=>{});
    };
    pc.onconnectionstatechange=()=>{if(['failed','closed'].includes(pc.connectionState))voiceDropPeer(uid);};
    if(offerer) setTimeout(async()=>{try{const o=await pc.createOffer();await pc.setLocalDescription(o);voiceSig(uid,'offer',pc.localDescription.toJSON());}catch(e){}},240);
    return p;
  }
  function safeId(s){return String(s).replace(/[^a-zA-Z0-9_-]/g,'_');}
  function flushIce(p){p.ice.splice(0).forEach(c=>p.pc.addIceCandidate(c).catch(()=>{}));}
  function voiceEnsurePeers(){
    if(!P.voiceLocal||!P.voice)return;const vm=voiceMembers(),me=myUid();
    Object.keys(vm).forEach(uid=>{if(uid!==me&&!P.voicePeers[uid])voicePeer(uid,me<uid);});
    Object.keys(P.voicePeers).forEach(uid=>{if(!vm[uid])voiceDropPeer(uid);});
  }
  function voiceSyncMembers(){if(P.voiceLocal)voiceEnsurePeers();}
  function voiceDropPeer(uid){
    const p=P.voicePeers[uid];if(p){try{p.pc.close();}catch(e){}delete P.voicePeers[uid];}
    const a=$('pqr-audio-'+safeId(uid));if(a)a.remove();
  }
  function voiceToggleMic(){
    if(!P.voiceLocal){ if(P.voice&&P.voice.state!=='idle')voiceAccept();else tell('🎤 ยังไม่ได้เข้าสายเสียง');return; }
    P.micOn=!P.micOn;P.voiceLocal.getAudioTracks().forEach(t=>t.enabled=P.micOn);
    if(P.voiceMemberRef)P.voiceMemberRef.child('mic').set(P.micOn).catch(()=>{});paintVoiceButtons();
  }
  async function voiceHangup(){
    if(!P.voiceLocal){tell('🎤 ยังไม่ได้อยู่ในสาย');return;}
    const owner=P.owner===myUid();
    try{ if(owner)await P.roomRef.child('voice').remove();else if(P.voiceMemberRef)await P.voiceMemberRef.remove(); }catch(e){}
    voiceCleanup(false);
  }
  function voiceStopTracks(){if(P.voiceLocal)P.voiceLocal.getTracks().forEach(t=>t.stop());P.voiceLocal=null;}
  function voiceCleanup(leaving){
    Object.keys(P.voicePeers).forEach(voiceDropPeer);
    if(P.voiceInbox){P.voiceInbox.off();try{P.voiceInbox.onDisconnect().cancel();}catch(e){}if(leaving)P.voiceInbox.remove().catch(()=>{});P.voiceInbox=null;}
    if(P.voiceMemberRef){try{P.voiceMemberRef.onDisconnect().cancel();}catch(e){}if(leaving)P.voiceMemberRef.remove().catch(()=>{});P.voiceMemberRef=null;}
    voiceStopTracks();P.micOn=true;paintVoiceButtons();
  }
  function paintVoiceButtons(){
    if(!P.root)return;const inCall=!!P.voiceLocal,vm=voiceMembers(),n=Object.keys(vm).length;
    P.root.querySelectorAll('[data-pqr="mic"]').forEach(b=>{b.classList.toggle('off',inCall&&!P.micOn);b.textContent=inCall?(P.micOn?'🎤 ปิดไมค์':'🔇 เปิดไมค์'):'🎤 ไมค์';});
    P.root.querySelectorAll('[data-pqr="hang"]').forEach(b=>{b.hidden=!inCall;b.textContent='📞 วางสาย ('+n+'/'+VOICE_MAX+')';});
  }

  window.addEventListener('beforeunload',()=>{voiceStopTracks();});
  window.PicQuizOnline={open:showMode,leave:leaveRoom,_t:{P,ensureUI,openHub,paintRoom,paintMembers,paintChat,enterBookGame,showQuestion,onVoiceState,
    createRoom,enterRoom,startGame,answerCard,startVoiceCall,voiceAccept,voiceHangup,makePool,membersByUid,voiceMembers}};
})();
