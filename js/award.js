"use strict";
/* ============================================================
   🏆 award.js — เครื่องจ่าย "รางวัลรายเดือน Top 10" ใช้ร่วมทุกกระดาน (รอบ 649)
   เดิมโค้ดก้อนนี้อยู่ใน js/wsaward.js เฉพาะแท็บ 🔎 ค้นหาคำ
   รอบ 649 เพิ่มแท็บ ⌨️ พิมพ์คำ ที่ใช้กติกาเดียวกันเป๊ะ → ยกมาเป็นโรงงานกลาง
   (ห้ามก๊อปโค้ดซ้ำ — กฎทองข้อ 8) · ผู้เรียก = js/wsaward.js + js/tpaward.js

   🔒 หลักการ "ตัดรอบครั้งเดียว ทุกคนเห็นอันดับเดียวกัน" (ของเดิมรอบ 592 ไม่เปลี่ยน):
   เกมนี้เป็น client-only (Spark ไม่มี Cloud Functions) → ใช้ snapshot ใน RTDB
   `/<path>/<YYYY-MM>` = {at, w:{<uid>:{r,p,n,g,s}}} · rules ให้ "สร้างได้ครั้งเดียว"
   (`!data.exists()`) → เครื่องแรกที่เปิดเกมหลัง 00:01 ของวันที่ 1 เป็นคนตัดรอบ
   ที่เหลืออ่าน snapshot เดียวกันทั้งหมด ใครก็เขียนทับไม่ได้

   🩹 GRACE_MS (มาจากรอบ 634): เลยจุดตัดเกิน 48 ชม. แล้วยังไม่มี snapshot → ข้ามเดือนนั้น
   ไม่ตัดย้อนหลังด้วยข้อมูลสด (กันป้ายบอกวันตัดรอบผิดความจริงตอนฟีเจอร์เพิ่งขึ้นเว็บกลางเดือน)

   cfg ที่ผู้เรียกต้องส่ง:
     id      'ws' | 'tp'                      · path  ชื่อโซนใน RTDB ('wsAward')
     field   ชื่อฟิลด์คะแนนใน /leaderboard ('ws')
     scoreOf ()=>number                       คะแนนสดของตัวเอง (จาก state)
     seenK/paidK/logK   ชื่อคีย์ใน state (กันจ่ายซ้ำ/ประกาศ)
     emoji   '🔎'                             · game  '🔎 ค้นหาคำ' (ชื่อเกมในข้อความ)
     field2/scoreOf2/unit2  (ไม่บังคับ) คะแนนรองที่โชว์คู่กัน — ใช้ตัดสินเมื่อคะแนนหลักเท่ากัน
     unit    หน่วยคะแนนหลัก ('แต้ม'/'คำ')     · role  คำเรียกผู้เล่น ('นักสะสมแต้มเกม')
     rules   [html, ...]                      บรรทัดกติกาในกระดานประกาศ
     empty   ข้อความตอนยังไม่มีใครมีแต้ม
   ============================================================ */
(function(){
  /* 🎁 เงินรางวัลตามอันดับ (ผู้ใช้กำหนด — ห้ามแก้เองถ้าผู้ใช้ไม่สั่ง) */
  const PRIZES = [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000];
  const TOP = 10;
  const CUT_HOUR = 0, CUT_MIN = 1;            // ③ ตัดรอบ 00:01 ของวันที่ 1
  const CHECK_MS = 60000;                     // วนเช็กทุก 1 นาที (เดือนที่จัดการแล้วไม่แตะ DB)
  const GRACE_MS = 48 * 3600000;              // 🔒 รอบ 634: เลยจุดตัด >48ชม.แล้วยังไม่มีใครตัด → ข้ามเดือนนั้นไปเลย
  const TH_MON = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  /* ---------- เวลา/เดือน (ใช้ร่วมทุกกระดาน) ---------- */
  /* 🇹🇭 รอบ 988: เดือน/จุดตัดคิดเป็น "เวลาไทย" ทั้งหมด (js/thaitime.js)
     — เดิมใช้นาฬิกาเครื่อง ผู้เล่นที่ตั้งไทม์โซนต่างประเทศจะตัดรอบคนละเวลากับคนอื่น */
  function monthKey(d){                        // → '2026-07'
    const t = thDate(d);
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0');
  }
  function monthParts(m){ const p = String(m || '').split('-'); return [+p[0] || 0, +p[1] || 1]; }
  function monthThai(m){ const [y, mo] = monthParts(m); return (TH_MON[mo - 1] || '') + ' ' + y; }
  // จุดตัด = วันที่ 1 เวลา 00:01 น. เวลาไทย → timestamp จริง (ทุกเครื่องทั่วโลกตัดพร้อมกันเป๊ะ)
  function cutDate(m){ const [y, mo] = monthParts(m); return new Date(thTs(y, mo - 1, 1, CUT_HOUR, CUT_MIN)); }
  function pastCut(m){ return Date.now() >= cutDate(m).getTime(); }
  function nextCutDate(){                      // จุดตัดรอบครั้งถัดไป (วันที่ 1 เดือนหน้า 00:01 น. ไทย)
    const n = thDate();
    return new Date(thTs(n.getFullYear(), n.getMonth() + 1, 1, CUT_HOUR, CUT_MIN));
  }
  function fmtLeft(ms){
    if(ms <= 0) return 'อีกไม่ถึงนาที';
    const mins = Math.floor(ms / 60000), d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), mi = mins % 60;
    if(d > 0) return `อีก ${d} วัน ${h} ชม.`;
    if(h > 0) return `อีก ${h} ชม. ${mi} นาที`;
    return `อีก ${mi} นาที`;
  }
  function cutText(m){
    const c = thDate(cutDate(m));              // 🇹🇭 รอบ 988: อ่านหน้าปัดไทย
    return `${c.getDate()} ${TH_MON[c.getMonth()]} ${c.getFullYear()} เวลา 00:01 น.`;
  }
  const prizeFor = (rank)=> (rank >= 1 && rank <= TOP) ? PRIZES[rank - 1] : 0;

  /* ============================================================
     โรงงาน: สร้างเครื่องจ่ายรางวัล 1 ตัวต่อ 1 กระดาน
     ============================================================ */
  function makeMonthAward(cfg){
    /* แต่ละเกมกำหนดตารางรางวัลเฉพาะของตัวเองได้; ไม่ส่งมา = ใช้ตารางมาตรฐานเดิม */
    const PRIZES = Array.isArray(cfg.prizes) && cfg.prizes.length ? cfg.prizes.slice() : window.AwardCore.PRIZES.slice();
    const TOP = PRIZES.length;
    const prizeFor = (rank)=> (rank >= 1 && rank <= TOP) ? PRIZES[rank - 1] : 0;
    const F  = cfg.field;                       // ฟิลด์ที่ใช้ "จัดอันดับ" บน /leaderboard
    const F2 = cfg.field2 || '';                // ฟิลด์รองที่โชว์คู่กัน (มีเฉพาะบางกระดาน)
    const U  = cfg.unit || 'แต้ม', U2 = cfg.unit2 || '';
    const ROLE = cfg.role || 'นักสะสมแต้มเกม';   // คำเรียกผู้เล่นในข้อความประกาศ
    const second = (v2)=> F2 ? ` · ${(typeof fmtNum === 'function' ? fmtNum : String)(v2 || 0)} ${U2}` : '';

    /* ---------- อันดับสด (แหล่งเดียวกับแท็บในกระดานอันดับ) ---------- */
    /* 🔢 รอบ 654: อันดับตัดสินด้วย F · คะแนนเท่ากันดูที่ F2 (เช่น พิมพ์คำ = จำนวนคำก่อน แล้วค่อยดูเหรียญ) */
    function liveTop(){
      if(typeof Online === 'undefined' || !Online.ready) return [];
      const myId = (typeof onlineKey === 'function') ? onlineKey() : '';
      const map = {};
      const board = cfg.boardOf ? cfg.boardOf() : Online.board;
      (board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n || '', g:r.g || '', v:r[F] || 0, v2:F2 ? (r[F2] || 0) : 0}; });
      if(myId && typeof state !== 'undefined' && state.student && !(typeof isTester === 'function' && isTester())){
        const nm = (state.profileName || state.student.first || 'หนู') + ((typeof badgeSuffix === 'function') ? badgeSuffix() : '');
        map[myId] = {id:myId, n:nm, g:state.student.grade || '', v:Math.round(cfg.scoreOf() || 0),
                     v2:F2 ? Math.round((cfg.scoreOf2 && cfg.scoreOf2()) || 0) : 0};
      }
      return Object.values(map).filter(r=>r.v > 0).sort((a,b)=> (b.v - a.v) || (b.v2 - a.v2)).slice(0, TOP);
    }

    /* ---------- เครื่องจ่ายรางวัล ---------- */
    let busy = false, lastSnap = null, lastSnapM = '';
    function snapRef(m){ return Online.db.ref(cfg.path + '/' + m); }

    async function check(){
      if(busy) return;
      if(typeof state === 'undefined' || !state.student) return;
      if(typeof Online === 'undefined' || !Online.ready || !Online.db) return;
      const m = monthKey();
      if(!pastCut(m)) return;                            // ยังไม่ถึง 00:01 ของวันที่ 1 (ช่วง 00:00-00:01)
      if((state[cfg.seenK] || '') === m) return;         // เดือนนี้จัดการแล้ว — ไม่ยิง DB ซ้ำ
      busy = true;
      try{
        let snap = await readSnap(m);
        if(!snap && (Date.now() - cutDate(m).getTime()) > GRACE_MS){
          state[cfg.seenK] = m;                         // เลยช่วงตัดรอบไปนานเกินไป — ข้ามเดือนนี้ ไม่ตัดย้อนหลัง
          if(typeof saveState === 'function') saveState();
          busy = false; return;
        }
        if(!snap){                                      // ยังไม่มีใครตัดรอบเดือนนี้ (ยังอยู่ในช่วง grace) → ตัดให้ (สร้างได้ครั้งเดียวตาม rules)
          const rows = liveTop();
          if(!rows.length){ busy = false; return; }      // กระดานยังไม่โหลด → รอรอบเช็กถัดไป
          const w = {};
          rows.forEach((r, i)=>{
            w[r.id] = {r:i + 1, p:PRIZES[i], n:String(r.n).slice(0, 40), g:String(r.g || '').slice(0, 20), s:Math.round(r.v)};
            if(F2) w[r.id].s2 = Math.round(r.v2 || 0);       // 🔢 รอบ 654: คะแนนรองตอนตัดรอบ (เช่น เหรียญสะสมของเกมพิมพ์คำ)
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
      const paid = state[cfg.paidK] || [];
      state[cfg.seenK] = m;
      if(mine && paid.indexOf(m) < 0){
        const prize = Math.min(PRIZES[0], Math.max(0, Math.round(mine.p || prizeFor(mine.r))));
        state[cfg.paidK] = paid.concat([m]).slice(-24);
        state[cfg.logK]  = [{m, r:mine.r, p:prize, s:Math.round(mine.s || 0), s2:Math.round(mine.s2 || 0), at:Date.now()}]
                           .concat(state[cfg.logK] || []).slice(0, 24);
        if(typeof addCoins === 'function') addCoins(prize);
        if(typeof saveState === 'function') saveState();
        showReveal({m, r:mine.r, p:prize, s:Math.round(mine.s || 0), s2:Math.round(mine.s2 || 0)});
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
            ได้เพราะอยู่ <b>อันดับ ${a.r} ของ Top ${TOP}</b> ${ROLE} ${cfg.game}<br>
            <small>ตอนตัดรอบมี ${num(a.s)} ${U}${second(a.s2)} · ตัดรอบ ${cutText(a.m)}<br>
            ยอดสะสมไม่ถูกล้าง เก็บต่อได้เลย เดือนหน้าลุ้นอีกรอบ 💪</small></p>
          <button class="rankup-btn">เก็บเหรียญ! 🥳</button>
        </div>`;
      ov.querySelector('.rankup-btn').addEventListener('click', ()=>{
        ov.remove();
        if(typeof renderDashboard === 'function' && document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
        openBoard();                                   // ต่อไปที่กระดานข้อความ (เห็นรายชื่อผู้ได้รางวัลทั้งหมด)
      });
      document.body.appendChild(ov);
    }

    /* ---------- ④ กระดานข้อความรางวัล (เปิดจากแท็บ / กระดานเต็มจอ) ---------- */
    function openBoard(){
      document.querySelectorAll('.wsa-overlay').forEach(o=>o.remove());
      const esc = (typeof escapeHTML === 'function') ? escapeHTML : (s)=>String(s);
      const num = (typeof fmtNum === 'function') ? fmtNum : (n)=>String(n);
      const myId = (typeof onlineKey === 'function') ? onlineKey() : '';
      const m = monthKey();
      const ov = document.createElement('div'); ov.className = 'wsa-overlay';
      const close = ()=> ov.remove();

      // 📣 ประกาศถึงตัวเอง (ล่าสุด 2 ใบ — พื้นที่จำกัด กฎทอง #7 ห้ามมี scroll)
      const log = (state[cfg.logK] || []).slice(0, 2);
      const mine = log.length ? log.map(a=>`
        <div class="wsa-msg">
          <div class="wsa-msg-h">🎉 ยินดีด้วย! ได้รับ <b>${num(a.p)} เหรียญ</b> 🪙</div>
          <div class="wsa-msg-b">เพราะอยู่ <b>อันดับ ${a.r}</b> ของ Top ${TOP} ${ROLE} ${cfg.game}
            ประจำเดือน <b>${monthThai(a.m)}</b><br>
            <small>ตอนตัดรอบมี ${num(a.s)} ${U}${second(a.s2)} · ตัดรอบ ${cutText(a.m)}</small></div>
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
            <span class="wsa-s">${cfg.emoji} ${num(r.s || 0)} ${U}${second(r.s2)}</span>
            <span class="wsa-p">🪙 ${num(r.p || prizeFor(r.r))}</span>
          </div>`).join('');
      }else{
        const rows = liveTop();
        winHead = `📊 ถ้าตัดรอบตอนนี้ (ยังไม่ตัด · ${fmtLeft(nextCutDate() - Date.now())})`;
        winHtml = rows.length ? rows.map((r, i)=>`
          <div class="wsa-row${r.id === myId ? ' me' : ''}">
            <span class="wsa-r">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <span class="wsa-n">${r.id === myId ? '⭐ ' : ''}${esc((typeof splitNameBadges === 'function' ? splitNameBadges(r.n).name : r.n) || '')}</span>
            <span class="wsa-s">${cfg.emoji} ${num(r.v)} ${U}${second(r.v2)}</span>
            <span class="wsa-p">🪙 ${num(PRIZES[i])}</span>
          </div>`).join('')
          : `<div class="wsa-msg wsa-msg-none">${cfg.empty}</div>`;
      }

      ov.innerHTML = `<div class="wsa-box">
        <div class="wsa-head">
          <button class="wsa-close" type="button">✕</button>
          <span class="wsa-title">📜 กระดานประกาศรางวัล · เกม ${cfg.game}</span>
          <span class="wsa-when">⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 ของเดือน เวลา 00:01 น. เท่านั้น</b> · ครั้งถัดไป ${fmtLeft(nextCutDate() - Date.now())}</span>
        </div>
        <div class="wsa-cols">
          <div class="wsa-col">
            <div class="wsa-sec-h">📣 ประกาศถึง${(typeof selfPronoun === 'function') ? selfPronoun() : 'หนู'}</div>
            ${mine}
            <div class="wsa-sec-h">📖 กติกา</div>
            <ul class="wsa-rules">${cfg.rules.map(r=>`<li>${r}</li>`).join('')}</ul>
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

    return {
      open: openBoard, check, prizeFor, monthKey, monthThai, cutText, nextCutDate, fmtLeft,
      PRIZES, TOP,
      _t:{ liveTop, readSnap, payMe, showReveal, cutDate, pastCut, get snap(){ return lastSnap; }, get snapM(){ return lastSnapM; } }
    };
  }

  window.makeMonthAward = makeMonthAward;
  window.AwardCore = { PRIZES, TOP, prizeFor, monthKey, monthThai, cutDate, cutText, pastCut, nextCutDate, fmtLeft, GRACE_MS };
})();
