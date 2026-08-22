"use strict";
/* ============================================================
   ⌨️ typing.js — เกม "พิมพ์คำศัพท์" (Keyboard Typing) รอบ 648
   ผู้ใช้สั่ง 28 ก.ค. 2026 · ปุ่มรางซ้ายล็อบบี้ → กระดานเต็มจอ (มีปุ่มปิดชัดเจน)
   - แป้นวางตามตำแหน่งคีย์บอร์ดจริง (QWERTY เหลื่อมแถว) · ปุ่มนูน 3 มิติ กดแล้วยุบ-เด้งขึ้นทันที
   - เสียงกดเหมือนคีย์บอร์ดจริง (sfx.keyTap ใน js/util.js — กดลง/ปล่อยขึ้นคนละเสียง)
   - คำศัพท์อังกฤษกลางจอด้านบน + คำแปลไทยใต้คำ · พิมพ์ครบ 1 คำ = 🪙 10 เหรียญ + เสียงเงินเข้า
   🏆 รอบ 649-650: ยอดสะสมตลอดกาล → แท็บใหม่ "⌨️ พิมพ์คำ" ในกระดานอันดับ
      + รางวัลรายเดือน Top 10 (10,000–1,000 เหรียญ) ผ่าน js/tpaward.js — กติกาเดียวกับ 🔎 ค้นหาคำ
      **อันดับตัดสินที่ `state.tpWords` (จำนวนคำ) — "ใครพิมพ์ได้เยอะที่สุด" (ผู้ใช้กำหนดรอบ 654)**
      `state.tpScore` = "เหรียญสะสม" (ความยาวคำ × 4 · +10 ถ้าไม่พิมพ์ผิดเลย) โชว์คู่กัน + ใช้ตัดสินตอนคำเท่ากัน
      ⌨️ เข็มนักพิมพ์ปลดที่ 100/500/1000/3000/10000 คำ (checkTypistBadge ใน js/game.js · รอบ 655 ต่อระดับ 4-5)
   🔒 กฎเหล็ก 2 ข้อ:
     ① คำที่นำมาเล่น = คำตามระดับชั้นผู้เล่นเท่านั้น (vocabForStudent)
     ② คำห้ามซ้ำ — จำคำที่เล่นไปแล้วถาวรใน state.tpUsed จนหมดคลังจึงวนรอบใหม่
   📐 ห้ามมี scrollbar (กฎทองข้อ 7): ขนาดแป้นคำนวณเป็น px เอง (fitKeys) จากที่ว่างจริง
      ทั้งกว้างและสูง — CSS ล้วนทำไม่ได้เพราะแป้นต้องจัตุรัสและพอดีทั้ง 2 แกนพร้อมกัน
   ============================================================ */
(function(){
  const COIN_PER_WORD = 10;             // 🪙 ผู้ใช้สั่ง: รางวัลเกม Typing x2
  const PT_PER_LETTER = 4;              // 🏆 เหรียญสะสมกระดาน = ความยาวคำ × 4
  const PERFECT_BONUS = 10;             // 🏆 ไม่พิมพ์ผิดเลยทั้งคำ = โบนัสอีก 10 เหรียญสะสม
  const MINLEN = 2, MAXLEN = 14;
  /* แถวแป้นตามคีย์บอร์ดจริง · off = ระยะเหลื่อมหัวแถว (หน่วย = 1 แป้น) */
  const ROWS = [
    { off:0,    keys:'QWERTYUIOP'.split('') },
    { off:0.5,  keys:'ASDFGHJKL'.split('')  },
    { off:1.0,  keys:'ZXCVBNM'.split('').concat(['BKSP']) },
  ];
  const ROW_UNITS = [10, 9.5, 9.5];     // ความกว้างรวมของแต่ละแถว (BKSP = 1.5 หน่วย)
  const MAX_UNITS = 10;                 // แถวที่กว้างสุด → ใช้หนีบความกว้าง
  const KEY_MIN = 30, KEY_MAX = 104;    // ขนาดแป้น (px) — ใหญ่ กดสะดวก แต่ไม่ล้นจอ

  let overlay=null, boardEl=null, keysEl=null, wordEl=null, thaiEl=null,
      statEl=null, fxEl=null, hintEl=null;
  let cur=null;                         // {w, th, typed}
  let queue=[], qGrade=null;            // คิวคำที่ยังไม่เคยเล่นในระดับชั้นนี้
  let locked=false;                     // กันกดตอนกำลังฉลองคำที่เพิ่งจบ

  const grade = ()=> (typeof state!=='undefined' && state.student) ? state.student.grade : 'ป.1';
  const shuffle = a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  /* ---------- คลังคำ + กติกา "ห้ามซ้ำ" ---------- */
  /* คำที่เล่นได้: อังกฤษล้วน A-Z (คำที่มีช่องว่าง/ขีด พิมพ์บนแป้นตัวอักษรล้วนไม่ได้ → ตัดทิ้ง) */
  function pool(){
    const seen=new Set(), out=[];
    const src=(typeof vocabForStudent==='function')?vocabForStudent():[];
    src.forEach(pair=>{
      const raw=String(pair[0]||'').trim();
      if(!/^[A-Za-z]+$/.test(raw)) return;
      const w=raw.toUpperCase();
      if(w.length<MINLEN || w.length>MAXLEN || seen.has(w)) return;
      seen.add(w); out.push({w, th:pair[1]||''});
    });
    return out;
  }
  function usedSet(){
    if(typeof state==='undefined') return new Set();
    if(!Array.isArray(state.tpUsed)) state.tpUsed=[];
    return new Set(state.tpUsed.map(x=>String(x).toUpperCase()));
  }
  function markUsed(w){
    if(typeof state==='undefined') return;
    if(!Array.isArray(state.tpUsed)) state.tpUsed=[];
    if(state.tpUsed.indexOf(w)<0) state.tpUsed.push(w);
  }
  /* เติมคิวจากคำที่ "ยังไม่เคยเล่น" · หมดคลัง = ล้างประวัติแล้ววนรอบใหม่ (บอกผู้เล่นด้วย ห้ามเงียบ) */
  function refill(announce){
    const all=pool();
    if(!all.length){ queue=[]; return false; }
    const used=usedSet();
    let left=all.filter(x=>!used.has(x.w));
    if(!left.length){
      if(typeof state!=='undefined') state.tpUsed=[];
      left=all.slice();
      if(announce && typeof toast==='function')
        toast('🎉 พิมพ์ครบทุกคำในระดับชั้นแล้ว! เริ่มรอบใหม่');
    }
    queue=shuffle(left);
    qGrade=grade();
    return true;
  }
  function nextWord(){
    if(qGrade!==grade()) queue=[];                    // เปลี่ยนระดับชั้น = เปลี่ยนคลังคำ
    if(!queue.length && !refill(true)){ cur=null; return; }
    if(!queue.length){ cur=null; return; }
    const pick=queue.shift();
    cur={ w:pick.w, th:pick.th, typed:'', miss:0 };   // miss = พิมพ์ผิดกี่ครั้งในคำนี้ (0 = ได้โบนัส PERFECT_BONUS)
    renderWord();
  }

  /* ---------- DOM ---------- */
  function build(){
    overlay=document.createElement('div'); overlay.id='tp-overlay';
    overlay.innerHTML=`<div id="tp-board">
      <div class="tp-head">
        <span class="tp-title">⌨️ พิมพ์คำศัพท์ · Typing</span>
        <span class="tp-stat" id="tp-stat"></span>
        <button class="tp-snd" id="tp-snd" type="button" title="เปิด/ปิดเสียงกดแป้น">
          <span class="tp-snd-ic">🔊</span><span class="tp-snd-track"><span class="tp-snd-thumb"></span></span>
        </button>
        <button class="tp-close" id="tp-close" type="button" title="ปิดเกม (หรือกด Esc)">✕ ปิดเกม</button>
      </div>
      <div class="tp-prompt">
        <div class="tp-word" id="tp-word"></div>
        <div class="tp-thai" id="tp-thai"></div>
        <div class="tp-hint" id="tp-hint">👆 กดแป้นตามตัวอักษรที่เรืองแสง · พิมพ์ครบ 1 คำ = 🪙 ${COIN_PER_WORD} เหรียญ</div>
      </div>
      <div class="tp-keys" id="tp-keys"></div>
      <div class="tp-fx" id="tp-fx"></div>
    </div>`;
    document.body.appendChild(overlay);
    boardEl=overlay.querySelector('#tp-board');
    keysEl =overlay.querySelector('#tp-keys');
    wordEl =overlay.querySelector('#tp-word');
    thaiEl =overlay.querySelector('#tp-thai');
    statEl =overlay.querySelector('#tp-stat');
    hintEl =overlay.querySelector('#tp-hint');
    fxEl   =overlay.querySelector('#tp-fx');
    overlay.querySelector('#tp-close').addEventListener('click', close);
    /* 🔊 ปุ่มเลื่อนเปิด/ปิดเสียงกดแป้น (เฉพาะเสียงคลิกคีย์บอร์ด — ไม่กระทบเสียงเหรียญ/พูดคำ) */
    const sndBtn=overlay.querySelector('#tp-snd');
    const syncSndBtn=()=>{
      const on=!(typeof state!=='undefined' && state.tpKeySoundOff);
      sndBtn.classList.toggle('off', !on);
      sndBtn.querySelector('.tp-snd-ic').textContent = on?'🔊':'🔇';
    };
    syncSndBtn();
    sndBtn.addEventListener('click', ()=>{
      if(typeof state!=='undefined'){
        state.tpKeySoundOff=!state.tpKeySoundOff;
        if(typeof saveState==='function') saveState();
      }
      syncSndBtn();
    });
    /* 🏆 รอบ 649: กดแต้มบนหัวกระดาน → กระดานประกาศรางวัลรายเดือน (ผูกเองที่นี่ ไม่พึ่ง listener ของ ui.js
       เพราะเด็กอาจเปิดเกมพิมพ์คำก่อนเคยเปิดกระดานอันดับ) · .wsa-overlay z-index 95 > #tp-overlay 93 */
    statEl.addEventListener('click', e=>{
      if(!e.target.closest('.tpa-open')) return;
      if(typeof TpAward!=='undefined') TpAward.open();
    });
    buildKeys();
    bindKeys();
  }

  function buildKeys(){
    keysEl.innerHTML=ROWS.map((row,ri)=>
      `<div class="tp-row" style="--tp-off:${row.off}">`+
      row.keys.map(k=> k==='BKSP'
        ? `<button class="tp-key tp-key-fn" data-k="BKSP" type="button" style="--tp-w:1.5">⌫</button>`
        : `<button class="tp-key" data-k="${k}" type="button">${k}</button>`).join('')+
      `</div>`).join('')+
      `<div class="tp-row tp-row-fn">
         <button class="tp-key tp-key-fn tp-wide" data-k="SPEAK" type="button" style="--tp-w:2.6">🔊 ฟังเสียง</button>
         <button class="tp-key tp-key-fn tp-wide" data-k="SKIP"  type="button" style="--tp-w:2.6">⏭ ข้ามคำนี้</button>
       </div>`;
  }

  /* 📐 ขนาดแป้น = พอดีทั้ง "กว้าง" และ "สูง" พร้อมกัน → ไม่มี scrollbar ทุกจอ (กฎทองข้อ 7)
     คิดเป็นหน่วยแป้น: กว้างสุด 10 หน่วย · สูง 3 แถวตัวอักษร + แถวปุ่มช่วย 0.78 หน่วย */
  function fitKeys(){
    if(!keysEl || !boardEl) return;
    const cs=getComputedStyle(keysEl);
    const gap=parseFloat(cs.rowGap)||6;
    const availW=keysEl.clientWidth  - (parseFloat(cs.paddingLeft)||0)*2;
    const availH=keysEl.clientHeight - (parseFloat(cs.paddingTop)||0)*2;
    if(availW<=0||availH<=0) return;
    const rowsH=3 + 0.78;                                  // 3 แถวตัวอักษร + แถวปุ่มช่วย (เตี้ยกว่า)
    const gapsW=(MAX_UNITS-1)*gap, gapsH=ROWS.length*gap;  // 4 แถว = 3 ช่องไฟ + เผื่ออีก 1
    const u=Math.max(KEY_MIN, Math.min(KEY_MAX,
      Math.min((availW-gapsW)/MAX_UNITS, (availH-gapsH)/rowsH)));
    keysEl.style.setProperty('--tp-u', u.toFixed(1)+'px');
    keysEl.style.setProperty('--tp-fs', Math.max(13, Math.round(u*0.42))+'px');
    keysEl.style.setProperty('--tp-fnfs', Math.max(10, Math.round(u*0.24))+'px');
  }

  /* ---------- แสดงผล ---------- */
  function renderWord(){
    if(!cur){ wordEl.innerHTML='<span class="tp-empty">ไม่มีคำศัพท์ในระดับชั้นนี้</span>'; thaiEl.textContent=''; return; }
    /* 👀 โชว์ตัวอักษร "ครบทั้งคำ" เสมอ — ผู้ใช้สั่งให้เด็ก "กดตามคำที่ปรากฏ" ไม่ใช่ทดสอบสะกดจากช่องว่าง
       ตัวที่พิมพ์แล้ว=เขียว · ตัวที่ต้องกดตอนนี้=ทอง+ขีดกะพริบ · ตัวที่เหลือ=จาง */
    const n=cur.typed.length;
    wordEl.innerHTML=cur.w.split('').map((ch,i)=>
      `<span class="tp-ch${i<n?' got':(i===n?' now':'')}">${ch}</span>`).join('');
    thaiEl.textContent=cur.th||'';
    renderStat();
    glowNext();
  }
  function renderStat(){
    if(!statEl) return;
    const st=(typeof state!=='undefined')?state:{};
    const done=(st.tpWords||0) || (Array.isArray(st.tpUsed)?st.tpUsed.length:0);
    const coins=st.coins||0, pts=Math.round(st.tpScore||0);
    /* 🏆 รอบ 654: ปุ่มเดียวโชว์ทั้ง "จำนวนคำ (ตัวตัดสินอันดับ)" และ "เหรียญสะสม" → กดเข้ากระดานประกาศรางวัล
       (ผู้ใช้สั่งเรียกคะแนนสะสมว่า "เหรียญ" ไม่ใช่ "แต้ม" — เด็กเห็นค่ามากกว่า) */
    statEl.innerHTML=`<b>🪙 ${coins.toLocaleString()}</b>`
      +`<span class="tp-pts tpa-open" role="button" tabindex="0" title="ดูอันดับ Top 10 / รางวัลรายเดือน">`
      +`🏆 ${done.toLocaleString()} คำ · ${pts.toLocaleString()} เหรียญ</span>`
      +`<span>ระดับชั้น ${grade()}</span>`;
  }
  /* แป้นตัวถัดไปเรืองแสง — เด็กที่ยังหาแป้นไม่คล่องจะได้ไม่จนตรอก */
  function glowNext(){
    if(!keysEl) return;
    keysEl.querySelectorAll('.tp-key.next').forEach(e=>e.classList.remove('next'));
    if(!cur) return;
    const ch=cur.w[cur.typed.length];
    if(!ch) return;
    const el=keysEl.querySelector(`.tp-key[data-k="${ch}"]`);
    if(el) el.classList.add('next');
  }

  /* 🔊 เสียงคลิกคีย์บอร์ด — เช็กปุ่มเลื่อน tp-snd (state.tpKeySoundOff) ก่อนเรียก sfx.keyTap ทุกจุด */
  function keyTap(up, bright){
    if(typeof state!=='undefined' && state.tpKeySoundOff) return;
    if(typeof sfx!=='undefined' && sfx.keyTap) sfx.keyTap(up, bright);
  }

  /* 🎬 ปุ่มยุบลง-เด้งขึ้นทันทีเหมือนคีย์บอร์ดจริง (คลาส .down ติดสั้น ๆ แล้วถอด) */
  function pressFx(el, ms){
    if(!el) return;
    el.classList.remove('down'); void el.offsetWidth; el.classList.add('down');
    clearTimeout(el._tpUp);
    el._tpUp=setTimeout(()=>{
      el.classList.remove('down');
      keyTap(true);   // เสียงตอนแป้นเด้งขึ้น
    }, ms||90);
  }

  /* ---------- รับการกด ---------- */
  function bindKeys(){
    /* pointerdown = ยุบทันทีตั้งแต่นิ้วแตะ (เหมือนแป้นจริง) ไม่ต้องรอปล่อยนิ้ว */
    keysEl.addEventListener('pointerdown', e=>{
      const el=e.target.closest('.tp-key'); if(!el) return;
      e.preventDefault();
      hit(el.dataset.k, el);
    });
    /* คีย์บอร์ดจริงของเครื่อง (คอม/แท็บเล็ตมีคีย์บอร์ด) — กดแล้วแป้นบนจอยุบตามด้วย */
    document.addEventListener('keydown', e=>{
      if(!overlay || overlay.style.display!=='flex') return;
      if(document.querySelector('.wsa-overlay')) return;   // 🏆 รอบ 649: กระดานประกาศรางวัลเปิดทับอยู่ — ปล่อยให้มันจัดการคีย์เอง
      if(e.key==='Escape'){ close(); return; }
      if(e.repeat) return;
      let k=null;
      if(/^[a-zA-Z]$/.test(e.key)) k=e.key.toUpperCase();
      else if(e.key==='Backspace') k='BKSP';
      if(!k) return;
      e.preventDefault();
      hit(k, keysEl.querySelector(`.tp-key[data-k="${k}"]`));
    });
    window.addEventListener('resize', ()=>{ if(overlay && overlay.style.display==='flex') fitKeys(); });
  }

  function hit(k, el){
    if(!k) return;
    if(k==='SPEAK'){ pressFx(el);
      keyTap(false);
      if(cur && typeof speakWord==='function') speakWord(cur.w.toLowerCase());
      return; }
    if(k==='SKIP'){ pressFx(el);
      keyTap(false);
      skip(); return; }
    if(locked || !cur) return;

    const want=cur.w[cur.typed.length];
    if(k==='BKSP'){
      pressFx(el);
      keyTap(false);
      if(cur.typed.length){ cur.typed=cur.typed.slice(0,-1); renderWord(); }
      return;
    }
    const ok=(k===want);
    pressFx(el);
    keyTap(false, ok);
    if(!ok){                                   // พิมพ์ผิด = ไม่หักอะไร แค่บอกให้รู้ (เด็กจะได้ไม่ท้อ) · เสียแค่โบนัส "ไม่ผิดเลย"
      cur.miss++;
      if(el){ el.classList.add('bad'); setTimeout(()=>el.classList.remove('bad'), 260); }
      wordEl.classList.remove('shake'); void wordEl.offsetWidth; wordEl.classList.add('shake');
      return;
    }
    cur.typed+=k;
    renderWord();
    if(cur.typed.length>=cur.w.length) finishWord();
  }

  function skip(){
    if(locked || !cur) return;
    cur.typed='';
    nextWord();                                 // คำที่ข้ามยังไม่ถูก mark = กลับมาเจอใหม่ได้ในรอบถัดไป
  }

  /* 🏆 เหรียญสะสมของคำนี้ = ความยาว×4 + โบนัสถ้าไม่พิมพ์ผิดเลย */
  function wordPoints(word, miss){
    return word.length*PT_PER_LETTER + (miss ? 0 : PERFECT_BONUS);
  }
  /* ✅ พิมพ์ครบคำ → 🪙 10 เหรียญ + เหรียญสะสมกระดาน + เสียงเงินเข้าชัด ๆ + ลงสมุดคำศัพท์ + กันคำซ้ำ */
  function finishWord(){
    locked=true;
    const w=cur.w, th=cur.th;
    const pts=wordPoints(w, cur.miss);
    markUsed(w);
    if(typeof addCoins==='function') addCoins(COIN_PER_WORD);
    /* 🏆 แต้มสะสมตลอดกาล → กระดานอันดับแท็บ ⌨️ พิมพ์คำ (field tp) + รางวัลรายเดือน Top 10 */
    if(typeof state!=='undefined'){
      state.tpScore=Math.round((state.tpScore||0)+pts);
      state.tpWords=(state.tpWords||0)+1;
    }
    /* ⌨️ รอบ 654: เข็มนักพิมพ์ (100/500/1000 คำ) — ต้องเช็กก่อน push เพราะเข็มถูก bake ไปกับชื่อบนกระดาน */
    if(typeof checkTypistBadge==='function') checkTypistBadge();
    if(typeof onlinePushScore==='function') onlinePushScore();   // ผลักคำ/เหรียญขึ้นกระดานทันที (มี sig กันเขียนซ้ำ)
    if(typeof vbRecord==='function') vbRecord(w, th, true);      // 📒 ลงสมุดคำศัพท์ถาวร
    if(typeof saveState==='function') saveState();
    if(typeof sfx!=='undefined'){
      if(sfx.coinGetTier) sfx.coinGetTier(1); else if(sfx.coinGet) sfx.coinGet(); else if(sfx.coin) sfx.coin();
    }
    if(typeof speakWord==='function') speakWord(w.toLowerCase());
    coinPop(pts, !cur.miss);
    wordEl.classList.add('done');
    renderStat();
    setTimeout(()=>{
      wordEl.classList.remove('done');
      locked=false;
      nextWord();
    }, 780);
  }
  function coinPop(pts, perfect){
    if(!fxEl || document.documentElement.classList.contains('no-anim')) return;
    const p=document.createElement('div');
    p.className='tp-coinpop';
    p.innerHTML=`+${COIN_PER_WORD} 🪙 <span class="tp-pop-pt">+1 คำ · +${pts||0} เหรียญสะสม${perfect?' ✨ ไม่ผิดเลย!':''}</span>`;
    fxEl.appendChild(p);
    setTimeout(()=>p.remove(), 1400);
  }

  /* ---------- เปิด/ปิด ---------- */
  function open(){
    if(typeof BubbleGame!=='undefined' && BubbleGame.close) BubbleGame.close();
    if(!overlay) build();
    overlay.style.display='flex';
    void boardEl.offsetWidth;
    boardEl.classList.add('open');
    locked=false;
    if(qGrade!==grade()) queue=[];
    if(!cur || !cur.typed) { cur=null; nextWord(); } else renderWord();
    fitKeys();
    requestAnimationFrame(fitKeys);            // วัดอีกครั้งหลังแผงเข้าที่จริง
    if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
  }
  function close(){
    if(!overlay) return;
    keyTap(false);
    boardEl.classList.remove('open');
    if(typeof saveState==='function') saveState();
    setTimeout(()=>{
      overlay.style.display='none';
      if(typeof renderDashboard==='function') renderDashboard();   // อัปเดตเหรียญบนล็อบบี้
    }, 380);
  }

  function bindRail(){
    const btn=document.getElementById('btn-rail-typing');
    if(btn) btn.addEventListener('click', ()=>{ if(typeof closePanel==='function') closePanel(); open(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindRail); else bindRail();

  window.TypeGame={ open, close, _t:{ get cur(){return cur;}, get queue(){return queue;},
    get locked(){return locked;}, set locked(v){locked=!!v;},   // ชุดทดสอบต้องข้ามช่วงหน่วงฉลอง 780ms ได้
    pool, refill, nextWord, hit, fitKeys, skip, usedSet, markUsed, wordPoints, renderStat,
    COIN_PER_WORD, PT_PER_LETTER, PERFECT_BONUS, ROWS, KEY_MIN, KEY_MAX,
    get overlay(){return overlay;}, get keysEl(){return keysEl;} } };
})();
