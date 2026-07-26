"use strict";
/* ============================================================
   🏆 wsaward.js — รางวัลรายเดือนของกระดานอันดับ 🔎 ค้นหาคำ (รอบ 592)
   ผู้ใช้สั่ง 26 ก.ค. 2026:
     ① Top 10 ได้เหรียญรางวัลทุกวันที่ 1 ของเดือน (10,000 ลดหลั่นถึง 1,000)
     ② โชว์เงินรางวัลต่อท้ายชื่อในตาราง Top 10 (ทำใน ui.js — WsAward.prizeFor)
     ③ ตัดสินอันดับ "วันที่ 1 เวลา 00:01" เท่านั้น
     ④ กระดานข้อความแจ้งผู้ได้รับรางวัล (ได้เท่าไหร่ · เพราะอะไร)
     ⑤ แต้มไม่รีเซ็ตรายเดือน — สะสมตลอดกาล (state.wsScore เดิม ไม่แตะ)

   🔒 หลักการ "ตัดรอบครั้งเดียว ทุกคนเห็นอันดับเดียวกัน":
   เกมนี้เป็น client-only (Spark ไม่มี Cloud Functions) → ใช้ snapshot ใน RTDB
   `/wsAward/<YYYY-MM>` = {at, w:{<uid>:{r,p,n,g,s}}} · rules ให้ "สร้างได้ครั้งเดียว"
   (`!data.exists()`) → เครื่องแรกที่เปิดเกมหลัง 00:01 ของวันที่ 1 เป็นคนตัดรอบ
   ที่เหลืออ่าน snapshot เดียวกันทั้งหมด ใครก็เขียนทับไม่ได้
   ============================================================ */
(function(){
  /* 🎁 เงินรางวัลตามอันดับ (ผู้ใช้กำหนด — ห้ามแก้เองถ้าผู้ใช้ไม่สั่ง) */
  const PRIZES = [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000];
  const TOP = 10;
  const CUT_HOUR = 0, CUT_MIN = 1;            // ③ ตัดรอบ 00:01 ของวันที่ 1
  const CHECK_MS = 60000;                     // วนเช็กทุก 1 นาที (เดือนที่จัดการแล้วไม่แตะ DB)
  const TH_MON = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  /* ---------- เวลา/เดือน ---------- */
  function monthKey(d){                        // → '2026-07'
    const t = d || new Date();
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0');
  }
  function monthParts(m){ const p = String(m || '').split('-'); return [+p[0] || 0, +p[1] || 1]; }
  function monthThai(m){ const [y, mo] = monthParts(m); return (TH_MON[mo - 1] || '') + ' ' + y; }
  function cutDate(m){ const [y, mo] = monthParts(m); return new Date(y, mo - 1, 1, CUT_HOUR, CUT_MIN, 0, 0); }
  function pastCut(m){ return Date.now() >= cutDate(m).getTime(); }
  function nextCutDate(){                      // จุดตัดรอบครั้งถัดไป (วันที่ 1 เดือนหน้า 00:01)
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 1, CUT_HOUR, CUT_MIN, 0, 0);
  }
  function fmtLeft(ms){
    if(ms <= 0) return 'อีกไม่ถึงนาที';
    const mins = Math.floor(ms / 60000), d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), mi = mins % 60;
    if(d > 0) return `อีก ${d} วัน ${h} ชม.`;
    if(h > 0) return `อีก ${h} ชม. ${mi} นาที`;
    return `อีก ${mi} นาที`;
  }
  function cutText(m){
    const c = cutDate(m);
    return `${c.getDate()} ${TH_MON[c.getMonth()]} ${c.getFullYear()} เวลา 00:01 น.`;
  }
  const prizeFor = (rank)=> (rank >= 1 && rank <= TOP) ? PRIZES[rank - 1] : 0;

  /* ---------- อันดับสด (แหล่งเดียวกับแท็บ 🔎 ในกระดานอันดับ) ---------- */
  function liveTop(){
    if(typeof Online === 'undefined' || !Online.ready) return [];
    const myId = (typeof onlineKey === 'function') ? onlineKey() : '';
    const map = {};
    (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n || '', g:r.g || '', ws:r.ws || 0}; });
    if(myId && typeof state !== 'undefined' && state.student){
      const nm = (state.profileName || state.student.first || 'หนู') + ((typeof badgeSuffix === 'function') ? badgeSuffix() : '');
      map[myId] = {id:myId, n:nm, g:state.student.grade || '', ws:Math.round(state.wsScore || 0)};
    }
    return Object.values(map).filter(r=>r.ws > 0).sort((a,b)=> b.ws - a.ws).slice(0, TOP);
  }

  /* ---------- เครื่องจ่ายรางวัล ---------- */
  let busy = false, lastSnap = null, lastSnapM = '';
  function snapRef(m){ return Online.db.ref('wsAward/' + m); }

  async function check(){
    if(busy) return;
    if(typeof state === 'undefined' || !state.student) return;
    if(typeof Online === 'undefined' || !Online.ready || !Online.db) return;
    const m = monthKey();
    if(!pastCut(m)) return;                            // ยังไม่ถึง 00:01 ของวันที่ 1 (ช่วง 00:00-00:01)
    if((state.wsAwardSeen || '') === m) return;        // เดือนนี้จัดการแล้ว — ไม่ยิง DB ซ้ำ
    busy = true;
    try{
      let snap = await readSnap(m);
      if(!snap){                                      // ยังไม่มีใครตัดรอบเดือนนี้ → ตัดให้ (สร้างได้ครั้งเดียวตาม rules)
        const rows = liveTop();
        if(!rows.length){ busy = false; return; }      // กระดานยังไม่โหลด → รอรอบเช็กถัดไป
        const w = {};
        rows.forEach((r, i)=>{
          w[r.id] = {r:i + 1, p:PRIZES[i], n:String(r.n).slice(0, 40), g:String(r.g || '').slice(0, 20), s:Math.round(r.ws)};
        });
        try{ await snapRef(m).set({at:firebase.database.ServerValue.TIMESTAMP, w}); }catch(e){}
        snap = await readSnap(m);                     // อ่านของจริง (เผื่อเครื่องอื่นชิงตัดรอบก่อน / rules ยังไม่ publish)
        if(!snap){ busy = false; return; }
      }
      payMe(m, snap);
    }catch(e){}
    busy = false;
  }
  async function readSnap(m){
    try{
      const v = (await snapRef(m).once('value')).val();
      if(v && v.w){ lastSnap = v; lastSnapM = m; return v; }
      return null;
    }catch(e){ return null; }
  }
  function payMe(m, snap){
    const myId = (typeof onlineKey === 'function') ? onlineKey() : '';
    const mine = snap.w ? snap.w[myId] : null;
    const paid = state.wsAwardPaid || [];
    state.wsAwardSeen = m;
    if(mine && paid.indexOf(m) < 0){
      const prize = Math.min(PRIZES[0], Math.max(0, Math.round(mine.p || prizeFor(mine.r))));
      state.wsAwardPaid = paid.concat([m]).slice(-24);
      state.wsAwardLog  = [{m, r:mine.r, p:prize, s:Math.round(mine.s || 0), at:Date.now()}]
                          .concat(state.wsAwardLog || []).slice(0, 24);
      if(typeof addCoins === 'function') addCoins(prize);
      if(typeof saveState === 'function') saveState();
      showReveal({m, r:mine.r, p:prize, s:Math.round(mine.s || 0)});
      if(typeof renderLeaderboardCard === 'function') renderLeaderboardCard();
    }else if(typeof saveState === 'function') saveState();
  }

  /* ---------- ④ ประกาศส่วนตัว: เด้งบอกทันทีที่ได้รับรางวัล ---------- */
  function showReveal(a){
    const name = (typeof state !== 'undefined' && (state.profileName || (state.student && state.student.first))) || 'หนู';
    const esc  = (typeof escapeHTML === 'function') ? escapeHTML : (s)=>String(s);
    const num  = (typeof fmtNum === 'function') ? fmtNum : (n)=>String(n);
    const medal = a.r === 1 ? '🥇' : a.r === 2 ? '🥈' : a.r === 3 ? '🥉' : '🏅';
    if(typeof sfx !== 'undefined' && sfx.rankup) sfx.rankup();
    const ov = document.createElement('div');
    ov.className = 'rankup-overlay';
    ov.innerHTML = `
      <div class="rankup-rays" style="--rank-color:#ffd76a"></div>
      <div class="rankup-content">
        <div class="rankup-title">🏆 รางวัลประจำเดือน ${monthThai(a.m)}</div>
        <div class="wsa-reveal-medal">${medal}</div>
        <div class="rankup-name" style="color:#ffb300">+${num(a.p)} เหรียญ 🪙</div>
        <p class="rankup-sub">ยินดีด้วย ${esc(name)}! 🎉<br>
          ได้เพราะอยู่ <b>อันดับ ${a.r} ของ Top ${TOP}</b> นักสะสมแต้มเกม 🔎 ค้นหาคำ<br>
          <small>แต้มสะสมตอนตัดรอบ ${num(a.s)} แต้ม · ตัดรอบ ${cutText(a.m)}<br>
          แต้มไม่ถูกล้าง เก็บสะสมต่อได้เลย เดือนหน้าลุ้นอีกรอบ 💪</small></p>
        <button class="rankup-btn">เก็บเหรียญ! 🥳</button>
      </div>`;
    ov.querySelector('.rankup-btn').addEventListener('click', ()=>{
      ov.remove();
      if(typeof renderDashboard === 'function' && document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
      openBoard();                                   // ต่อไปที่กระดานข้อความ (เห็นรายชื่อผู้ได้รางวัลทั้งหมด)
    });
    document.body.appendChild(ov);
  }

  /* ---------- ④ กระดานข้อความรางวัล (เปิดจากแท็บ 🔎 / กระดานเต็มจอ) ---------- */
  function openBoard(){
    document.querySelectorAll('.wsa-overlay').forEach(o=>o.remove());
    const esc = (typeof escapeHTML === 'function') ? escapeHTML : (s)=>String(s);
    const num = (typeof fmtNum === 'function') ? fmtNum : (n)=>String(n);
    const myId = (typeof onlineKey === 'function') ? onlineKey() : '';
    const m = monthKey();
    const ov = document.createElement('div'); ov.className = 'wsa-overlay';
    const close = ()=> ov.remove();

    // 📣 ประกาศถึงตัวเอง (ล่าสุด 2 ใบ — พื้นที่จำกัด กฎทอง #7 ห้ามมี scroll)
    const log = (state.wsAwardLog || []).slice(0, 2);
    const mine = log.length ? log.map(a=>`
      <div class="wsa-msg">
        <div class="wsa-msg-h">🎉 ยินดีด้วย! ได้รับ <b>${num(a.p)} เหรียญ</b> 🪙</div>
        <div class="wsa-msg-b">เพราะอยู่ <b>อันดับ ${a.r}</b> ของ Top ${TOP} นักสะสมแต้มเกม 🔎 ค้นหาคำ
          ประจำเดือน <b>${monthThai(a.m)}</b><br>
          <small>แต้มตอนตัดรอบ ${num(a.s)} แต้ม · ตัดรอบ ${cutText(a.m)}</small></div>
      </div>`).join('')
      : `<div class="wsa-msg wsa-msg-none">ยังไม่มีประกาศถึง${(typeof selfPronoun === 'function') ? selfPronoun() : 'หนู'}นะ —
          เก็บแต้มให้ติด <b>Top ${TOP}</b> ก่อนวันตัดรอบ แล้วเหรียญรางวัลจะเข้ามาเองเลย 💪</div>`;

    // 🏆 ผู้ได้รับรางวัลของเดือนนี้ (จาก snapshot ที่ตัดรอบแล้ว) — ถ้ายังไม่ตัด โชว์อันดับสดว่า "ถ้าตัดตอนนี้"
    const snap = (lastSnapM === m) ? lastSnap : null;
    let winHtml, winHead;
    if(snap && snap.w){
      const rows = Object.keys(snap.w).map(uid=>Object.assign({uid}, snap.w[uid])).sort((a,b)=> a.r - b.r);
      winHead = `🏆 ผู้ได้รับรางวัลเดือน ${monthThai(m)} <small>(ตัดรอบแล้ว ${cutText(m)})</small>`;
      winHtml = rows.map(r=>`
        <div class="wsa-row${r.uid === myId ? ' me' : ''}">
          <span class="wsa-r">${r.r === 1 ? '🥇' : r.r === 2 ? '🥈' : r.r === 3 ? '🥉' : r.r}</span>
          <span class="wsa-n">${r.uid === myId ? '⭐ ' : ''}${esc((typeof splitNameBadges === 'function' ? splitNameBadges(r.n).name : r.n) || '')}</span>
          <span class="wsa-s">🔎 ${num(r.s || 0)}</span>
          <span class="wsa-p">🪙 ${num(r.p || prizeFor(r.r))}</span>
        </div>`).join('');
    }else{
      const rows = liveTop();
      winHead = `📊 ถ้าตัดรอบตอนนี้ (ยังไม่ตัด · ${fmtLeft(nextCutDate() - Date.now())})`;
      winHtml = rows.length ? rows.map((r, i)=>`
        <div class="wsa-row${r.id === myId ? ' me' : ''}">
          <span class="wsa-r">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
          <span class="wsa-n">${r.id === myId ? '⭐ ' : ''}${esc((typeof splitNameBadges === 'function' ? splitNameBadges(r.n).name : r.n) || '')}</span>
          <span class="wsa-s">🔎 ${num(r.ws)}</span>
          <span class="wsa-p">🪙 ${num(PRIZES[i])}</span>
        </div>`).join('')
        : `<div class="wsa-msg wsa-msg-none">ยังไม่มีใครมีแต้มเลย — เล่น 🔎 ค้นหาคำ เป็นคนแรกสิ!</div>`;
    }

    ov.innerHTML = `<div class="wsa-box">
      <div class="wsa-head">
        <button class="wsa-close" type="button">✕</button>
        <span class="wsa-title">📜 กระดานประกาศรางวัล · เกม 🔎 ค้นหาคำ</span>
        <span class="wsa-when">⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 ของเดือน เวลา 00:01 น. เท่านั้น</b> · ครั้งถัดไป ${fmtLeft(nextCutDate() - Date.now())}</span>
      </div>
      <div class="wsa-cols">
        <div class="wsa-col">
          <div class="wsa-sec-h">📣 ประกาศถึง${(typeof selfPronoun === 'function') ? selfPronoun() : 'หนู'}</div>
          ${mine}
          <div class="wsa-sec-h">📖 กติกา</div>
          <ul class="wsa-rules">
            <li>หาคำเจอ 1 คำ = <b>ความยาวคำ × 2 แต้ม</b> · เจอครบกระดาน <b>+20 แต้ม</b></li>
            <li><b>แต้มไม่รีเซ็ตรายเดือน</b> — สะสมตลอดกาล เล่นทุกวันยิ่งได้เปรียบ</li>
            <li>ตัดสินอันดับ <b>วันที่ 1 เวลา 00:01 น.</b> เท่านั้น · เหรียญเข้าอัตโนมัติตอนเปิดเกม</li>
          </ul>
        </div>
        <div class="wsa-col">
          <div class="wsa-sec-h">${winHead}</div>
          <div class="wsa-list">${winHtml}</div>
        </div>
        <div class="wsa-col wsa-col-prize">
          <div class="wsa-sec-h">🎁 เงินรางวัลแต่ละอันดับ</div>
          <div class="wsa-prizes">${PRIZES.map((p, i)=>`
            <div class="wsa-pz"><span>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : 'อันดับ ' + (i + 1)}</span><b>${num(p)}</b></div>`).join('')}</div>
        </div>
      </div>
    </div>`;
    ov.querySelector('.wsa-close').addEventListener('click', close);
    ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
    document.addEventListener('keydown', function esckey(e){
      if(e.key === 'Escape'){ close(); document.removeEventListener('keydown', esckey); }
    });
    document.body.appendChild(ov);
    if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
    if(!snap) readSnap(m).then(s=>{ if(s && document.body.contains(ov)){ close(); openBoard(); } });  // เผื่อเพิ่งมีคนตัดรอบ
  }

  /* ---------- เปิดเครื่อง: วนเช็กเบา ๆ (เดือนที่จ่ายแล้วไม่ยิง DB) ---------- */
  setInterval(()=>{ try{ check(); }catch(e){} }, CHECK_MS);
  setTimeout(()=>{ try{ check(); }catch(e){} }, 6000);      // หลังกระดานอันดับโหลดรอบแรก

  window.WsAward = {
    open: openBoard, check, prizeFor, monthKey, monthThai, cutText, nextCutDate, fmtLeft,
    PRIZES, TOP,
    _t:{ liveTop, readSnap, payMe, showReveal, cutDate, pastCut, get snap(){ return lastSnap; }, get snapM(){ return lastSnapM; } }
  };
})();
