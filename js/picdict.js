"use strict";
/* ============================================================
   📖 picdict.js — หนังสือ "Picture Dictionary" เล่มใหญ่ (รอบ 992 · ผู้ใช้สั่ง 4 ส.ค.)
   · หนังสือกาง 2 หน้า พลิกหน้าแบบ 3D เหมือนหนังสือจริง (rotateY ที่สันหนังสือ
     + เงาวิ่งตามหน้ากระดาษ + เสียงพลิกกระดาษสังเคราะห์ + ขอบตั้งกระดาษ 2 ข้าง
     หนา/บางตามตำแหน่งที่อ่านถึง)
   · เนื้อหา = แผ่นโปสเตอร์คำศัพท์ img/matching/<file> (สารบัญ js/data/picdict.js)
   · แตะการ์ดคำไหนบนหน้า = อ่านออกเสียง speakWord() + บอลลูนคำอังกฤษ/ไทย
     (ตำแหน่งช่องมาจาก PICDICT_WORDS ใน js/data/picdict_words.js — แผ่นที่ยัง
      ไม่ถูกถอดคำ เปิดดูได้ปกติ แค่ยังไม่มีเสียง)
   · เข้า: ปุ่ม 📖 ล่างล็อบบี้เดิม (#btn-picdict) + ตึกในเมือง 3D (?go=picdict)
   ============================================================ */
(function(){
  const $   = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const esc = s => (has('escapeHTML') ? escapeHTML(s) : s);

  let sec = null;            // <section id="screen-picdict">
  const pd = {
    pages:[],                // รายการหน้า: {type:'toc',part}|{type:'sheet',file,en,th,icon,num}
    s:0,                     // spread ปัจจุบัน (ซ้าย=2s ขวา=2s+1)
    opened:false,            // ผ่านหน้าปกเข้ามาแล้วหรือยัง (จำระหว่าง session)
    busy:false,              // กำลังพลิกอยู่ ห้ามพลิกซ้อน
  };

  /* ---------- รายการหน้า: [สารบัญซ้าย, สารบัญขวา, แผ่นที่ 1..N] (+หน้าว่างปิดท้ายให้คู่) ---------- */
  function buildPages(){
    if(pd.pages.length) return;
    pd.pages.push({type:'toc', part:0}, {type:'toc', part:1});
    let n = 0;
    (typeof PICDICT_BOOK !== 'undefined' ? PICDICT_BOOK : []).forEach(gr=>{
      gr.sheets.forEach(([file,en,th])=>{
        pd.pages.push({type:'sheet', file, en, th, icon:gr.icon, num:++n});
      });
    });
    pd.total = n;
    if(pd.pages.length % 2) pd.pages.push({type:'end'});
  }
  const maxSpread = () => Math.ceil(pd.pages.length/2) - 1;

  /* ---------- 🔊 เสียงพลิกกระดาษ (สังเคราะห์ noise สั้น ๆ — ไม่ใช้ไฟล์เสียง) ---------- */
  let actx = null;
  function flipSfx(){
    if(typeof state !== 'undefined' && !state.sound) return;
    try{
      actx = actx || new (window.AudioContext||window.webkitAudioContext)();
      const t0 = actx.currentTime, dur = 0.24;
      const buf = actx.createBuffer(1, actx.sampleRate*dur, actx.sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<d.length;i++){ const p=i/d.length; d[i]=(Math.random()*2-1)*Math.pow(1-p,1.6)*(0.25+0.75*Math.sin(p*Math.PI)); }
      const src = actx.createBufferSource(); src.buffer = buf;
      const bp = actx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=0.8;
      bp.frequency.setValueAtTime(900,t0); bp.frequency.exponentialRampToValueAtTime(3200,t0+dur*0.8);
      const g = actx.createGain();
      g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(0.5,t0+0.03);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
      src.connect(bp); bp.connect(g); g.connect(actx.destination);
      src.start(t0); src.stop(t0+dur);
    }catch(e){}
  }

  /* ---------- สร้างหน้าจอครั้งเดียว ---------- */
  function build(){
    if(sec) return sec;
    sec = document.createElement('section');
    sec.id = 'screen-picdict';
    sec.className = 'screen';
    sec.innerHTML = `
      <button class="back-btn" id="pd-back">⬅ กลับ</button>
      <button class="pd-toc-btn" id="pd-tocbtn" title="กลับไปหน้าสารบัญ">📑 สารบัญ</button>
      <div class="pd-stage" id="pd-stage">
        <!-- 📕 หนังสือปิดอยู่ (หน้าปก) -->
        <div class="pd-closed" id="pd-closed">
          <div class="pd-cover" id="pd-cover">
            <div class="pd-cover-edge"></div>
            <div class="pd-cover-in">
              <div class="pd-cover-top">🐶 🐱 🐰</div>
              <div class="pd-cover-book">📖</div>
              <h1>Picture<br>Dictionary</h1>
              <p>พจนานุกรมภาพ แตะแล้วออกเสียงได้</p>
              <span class="pd-cover-hint">👆 แตะเพื่อเปิดหนังสือ</span>
            </div>
          </div>
        </div>
        <!-- 📖 หนังสือกางอยู่ -->
        <div class="pd-bookwrap" id="pd-bookwrap" hidden>
          <button class="pd-arrow pd-arr-l" id="pd-prev" title="ย้อนหน้า">‹</button>
          <div class="pd-book" id="pd-book">
            <div class="pd-stack pd-stack-l" id="pd-stack-l"></div>
            <div class="pd-stack pd-stack-r" id="pd-stack-r"></div>
            <div class="pd-page pd-static-l" id="pd-pl"></div>
            <div class="pd-page pd-static-r" id="pd-pr"></div>
            <div class="pd-cast" id="pd-cast"></div>
            <div class="pd-turn" id="pd-turn" hidden>
              <div class="pd-face pd-face-f" id="pd-ff"></div>
              <div class="pd-face pd-face-b" id="pd-fb"></div>
            </div>
            <div class="pd-spine"></div>
            <div class="pd-corner pd-corner-l" id="pd-cl" title="พลิกกลับ"></div>
            <div class="pd-corner pd-corner-r" id="pd-cr" title="พลิกไป"></div>
          </div>
          <button class="pd-arrow pd-arr-r" id="pd-next" title="หน้าถัดไป">›</button>
        </div>
        <div class="pd-balloon" id="pd-balloon" hidden></div>
      </div>`;
    const host = $('screen-game') ? $('screen-game').parentNode : document.body;
    host.appendChild(sec);
    $('pd-back').addEventListener('click', exit);
    $('pd-cover').addEventListener('click', openBook);
    $('pd-next').addEventListener('click', ()=>step(1));
    $('pd-prev').addEventListener('click', ()=>step(-1));
    $('pd-cr').addEventListener('click', ()=>step(1));
    $('pd-cl').addEventListener('click', ()=>step(-1));
    $('pd-tocbtn').addEventListener('click', ()=>{ if(pd.opened) goTo(0); });
    /* จอเปลี่ยนขนาด/หมุนจอ → ตารางช่องคลิกต้องวางใหม่ให้ตรงภาพ
       ใช้ ResizeObserver เกาะตัวหนังสือ (อีเวนต์ resize ของ window มาไม่ถึงในบางเบราว์เซอร์/preview) */
    let rzT = 0;
    const refit = ()=>{
      if(!sec.classList.contains('active') || !pd.opened || pd.busy) return;
      clearTimeout(rzT);
      rzT = setTimeout(renderSpread, 120);
    };
    window.addEventListener('resize', refit);
    if(window.ResizeObserver){
      const ro = new ResizeObserver(refit);
      ro.observe($('pd-book'));
    }
    return sec;
  }

  /* ---------- เนื้อหาหน้า ---------- */
  function pageHTML(idx){
    const pg = pd.pages[idx];
    if(!pg || pg.type === 'end')
      return `<div class="pd-endpage"><span>📖✨</span><p>จบเล่มแล้ว เก่งมาก!</p></div>`;
    if(pg.type === 'toc'){
      const groups = (typeof PICDICT_BOOK !== 'undefined' ? PICDICT_BOOK : []);
      const half = Math.ceil(groups.length/2);
      const part = pg.part ? groups.slice(half) : groups.slice(0,half);
      let n = 0;   // เลขหน้าของแผ่นแรกในแต่ละกลุ่ม — นับรวมทุกกลุ่มก่อนหน้า
      const startOf = gi => { let c=0; for(let i=0;i<gi;i++) c += groups[i].sheets.length; return c; };
      const base = pg.part ? startOf(half) : 0;
      const rows = part.map((gr,i)=>{
        const start = startOf((pg.part?half:0)+i);
        const chips = gr.sheets.map(([file,en,th],j)=>
          `<button class="pd-chip" data-num="${start+j+1}">${esc(th)}</button>`).join('');
        return `<div class="pd-g"><div class="pd-g-t">${gr.icon} ${esc(gr.g)}</div><div class="pd-chips">${chips}</div></div>`;
      }).join('');
      return `${pg.part?'':'<div class="pd-toc-head">📖 Picture Dictionary <small>สารบัญ — แตะหมวดที่อยากอ่านได้เลย</small></div>'}
        <div class="pd-toc">${rows}</div><div class="pd-pno">${pg.part?'สารบัญ ๒':'สารบัญ ๑'}</div>`;
    }
    /* หน้าแผ่นภาพ */
    const W = (typeof PICDICT_WORDS !== 'undefined' && PICDICT_WORDS[pg.file]) || null;
    return `
      <div class="pd-ph">${pg.icon} <b>${esc(pg.th)}</b><span>${esc(pg.en)}</span></div>
      <div class="pd-imgbox">
        <img src="img/matching/${encodeURIComponent(pg.file)}" alt="${esc(pg.en)}" draggable="false">
        ${W ? '<div class="pd-cells"></div>' : ''}
      </div>
      <div class="pd-pno">${W ? '🔊 แตะการ์ดเพื่อฟังเสียง · ' : ''}หน้า ${pg.num} / ${pd.total}</div>`;
  }

  /* วางตารางช่องคลิกทับภาพ (ตำแหน่ง = สัดส่วนภาพที่ contain อยู่ในกล่อง) */
  function placeCells(pageEl, idx){
    const pg = pd.pages[idx];
    if(!pg || pg.type !== 'sheet') return;
    const W = (typeof PICDICT_WORDS !== 'undefined' && PICDICT_WORDS[pg.file]) || null;
    const box = pageEl.querySelector('.pd-imgbox'), img = pageEl.querySelector('img'),
          ov  = pageEl.querySelector('.pd-cells');
    if(!W || !box || !img || !ov) return;
    const fit = ()=>{
      if(!img.naturalWidth) return;
      const bw = box.clientWidth, bh = box.clientHeight;
      const sc = Math.min(bw/img.naturalWidth, bh/img.naturalHeight);
      const iw = img.naturalWidth*sc, ih = img.naturalHeight*sc;
      const [pt,pr,pb,pl] = W.pad || [0,0,0,0];   // % ระยะขอบแผ่นก่อนถึงตารางการ์ด
      ov.style.left   = ((bw-iw)/2 + iw*pl/100) + 'px';
      ov.style.top    = ((bh-ih)/2 + ih*pt/100) + 'px';
      ov.style.width  = (iw*(100-pl-pr)/100) + 'px';
      ov.style.height = (ih*(100-pt-pb)/100) + 'px';
      ov.style.gridTemplateColumns = `repeat(${W.cols},1fr)`;
      if(!ov.childElementCount){
        W.words.forEach(([en,th],i)=>{
          const c = document.createElement('button');
          c.className = 'pd-cell'; c.type = 'button';
          c.title = `${en} · ${th}`;
          c.addEventListener('click', ev=>{ ev.stopPropagation(); sayCell(c, en, th); });
          ov.appendChild(c);
        });
      }
    };
    if(img.complete) fit(); else img.addEventListener('load', fit, {once:true});
  }

  /* ---------- 🔊 แตะการ์ด = อ่านออกเสียง + บอลลูนคำ ---------- */
  let balloonT = 0;
  function sayCell(cell, en, th){
    if(has('speakWord')) speakWord(en);
    cell.classList.remove('hit'); void cell.offsetWidth; cell.classList.add('hit');
    const b = $('pd-balloon'), st = $('pd-stage');
    if(!b || !st) return;
    b.innerHTML = `🔊 <b>${esc(en)}</b><span>${esc(th)}</span>`;
    b.hidden = false;
    const r = cell.getBoundingClientRect(), sr = st.getBoundingClientRect();
    b.style.left = Math.min(Math.max(r.left - sr.left + r.width/2, 70), sr.width-70) + 'px';
    const top = r.top - sr.top - 8;
    b.classList.toggle('below', top < 46);         // ช่องแถวบนสุด — บอลลูนย้ายไปใต้ช่องแทน
    b.style.top = (b.classList.contains('below') ? r.bottom - sr.top + 8 : top) + 'px';
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(balloonT);
    balloonT = setTimeout(()=>{ b.hidden = true; }, 1900);
  }

  /* ---------- เรนเดอร์หน้าคู่ปัจจุบัน + ความหนากระดาษ 2 ข้าง + โหลดหน้าถัดไปล่วงหน้า ---------- */
  function renderInto(el, idx){
    el.innerHTML = pageHTML(idx);
    placeCells(el, idx);
    el.querySelectorAll('.pd-chip').forEach(ch=>{
      ch.addEventListener('click', ev=>{
        ev.stopPropagation();
        goTo(Math.floor((+ch.dataset.num + 1) / 2));   // แผ่น num อยู่หน้า index num+1 → spread
      });
    });
  }
  function renderSpread(){
    renderInto($('pd-pl'), pd.s*2);
    renderInto($('pd-pr'), pd.s*2+1);
    updateStacks();
    preload();
  }
  function updateStacks(){
    const m = maxSpread();
    const l = $('pd-stack-l'), r = $('pd-stack-r');
    const w = frac => Math.round(3 + 11*frac);       // 3–14px ตามสัดส่วนหน้าที่อ่านไป/เหลือ
    if(l) l.style.width = w(m ? pd.s/m : 0) + 'px';
    if(r) r.style.width = w(m ? (m-pd.s)/m : 0) + 'px';
    $('pd-prev').style.visibility = $('pd-cl').style.visibility = pd.s <= 0 ? 'hidden' : '';
    $('pd-next').style.visibility = $('pd-cr').style.visibility = pd.s >= m ? 'hidden' : '';
  }
  function preload(){
    for(const d of [1,-1,2]){
      const s = pd.s + d;
      if(s < 0 || s > maxSpread()) continue;
      [s*2, s*2+1].forEach(i=>{
        const pg = pd.pages[i];
        if(pg && pg.type === 'sheet'){ const im = new Image(); im.src = 'img/matching/' + encodeURIComponent(pg.file); }
      });
    }
  }

  /* ---------- 🔄 พลิกหน้า (หัวใจความ "เหมือนหนังสือจริง") ----------
     ไปหน้า (dir=1): แผ่นพลิก = หน้าขวาปัจจุบัน (หงายหลังเป็นหน้าซ้ายใหม่)
       หมุน rotateY 0 → -180 รอบสันหนังสือ · หน้าขวานิ่งข้างใต้เปลี่ยนเป็นหน้าขวาใหม่ตั้งแต่ต้น
     ย้อนหน้า (dir=-1): กลับด้านกัน · เงา 2 ชั้น: บนตัวแผ่นพลิก + ทาบหน้านิ่งฝั่งปลายทาง */
  function flipTo(target, dir){
    if(pd.busy || target < 0 || target > maxSpread() || target === pd.s) return;
    pd.busy = true;
    const turn = $('pd-turn'), ff = $('pd-ff'), fb = $('pd-fb'),
          pl = $('pd-pl'), pr = $('pd-pr'), book = $('pd-book');
    turn.classList.toggle('back', dir < 0);
    book.classList.remove('fwd','bwd'); book.classList.add(dir > 0 ? 'fwd' : 'bwd');
    if(dir > 0){
      renderInto(ff, pd.s*2+1);        // หน้าแผ่นพลิก: หน้าขวาเดิม
      renderInto(fb, target*2);        //   ด้านหลัง: หน้าซ้ายใหม่
      renderInto(pr, target*2+1);      // ใต้แผ่น: หน้าขวาใหม่โผล่รอ
    }else{
      renderInto(ff, pd.s*2);          // หน้าแผ่นพลิก: หน้าซ้ายเดิม
      renderInto(fb, target*2+1);      //   ด้านหลัง: หน้าขวาใหม่
      renderInto(pl, target*2);        // ใต้แผ่น: หน้าซ้ายใหม่โผล่รอ
    }
    turn.hidden = false;
    turn.style.transition = 'none';
    turn.style.transform = 'rotateY(0deg)';
    void turn.offsetWidth;                                   // force reflow ก่อนเริ่ม transition
    turn.style.transition = 'transform .75s cubic-bezier(.35,.06,.28,.99)';
    turn.style.transform = `rotateY(${dir>0?-180:180}deg)`;
    flipSfx();
    const done = ()=>{
      turn.removeEventListener('transitionend', done);
      pd.s = target;
      renderSpread();                                        // เรนเดอร์จริงทั้งคู่ (รวม overlay ช่องคลิก)
      turn.hidden = true;
      book.classList.remove('fwd','bwd');
      pd.busy = false;
    };
    turn.addEventListener('transitionend', done);
    setTimeout(()=>{ if(pd.busy) done(); }, 950);            // กันเหตุ transitionend หาย (แท็บพับ ฯลฯ)
  }
  const step = dir => flipTo(pd.s + dir, dir);
  const goTo = s   => flipTo(s, s > pd.s ? 1 : -1);

  /* ---------- เปิด/ปิดปก ---------- */
  function openBook(){
    if(pd.opened) return;
    pd.opened = true;
    flipSfx();
    const cl = $('pd-closed'), bw = $('pd-bookwrap');
    cl.classList.add('opening');
    setTimeout(()=>{
      cl.hidden = true; cl.classList.remove('opening');
      bw.hidden = false;
      renderSpread();
    }, 560);
  }

  /* ---------- เข้า/ออก ---------- */
  function open(){
    build();
    buildPages();
    if(has('closePanel')) closePanel();
    if(pd.opened){ $('pd-closed').hidden = true; $('pd-bookwrap').hidden = false; }
    else         { $('pd-closed').hidden = false; $('pd-bookwrap').hidden = true; }
    if(has('showScreen')) showScreen('screen-picdict');
    if(pd.opened) renderSpread(); else preload();
  }
  function exit(){
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    if(has('renderDashboard')) renderDashboard();
    if(has('showScreen')) showScreen('screen-dashboard');
  }

  /* ---------- ปุ่มเข้า (ล็อบบี้เดิม) + Esc = ออก ---------- */
  function bind(){
    const b = $('btn-picdict');
    if(b) b.addEventListener('click', open);
    document.addEventListener('keydown', e=>{
      if(!sec || !sec.classList.contains('active')) return;
      if(e.key === 'Escape') exit();
      else if(e.key === 'ArrowRight') step(1);
      else if(e.key === 'ArrowLeft') step(-1);
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();

  window.PicDict = { open, exit, _t:{ pd, flipTo, goTo, sayCell, buildPages, renderSpread } };
})();
