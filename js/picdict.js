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
   🆕 รอบ 995: กางเล่มเต็มจอ+กึ่งกลางเป๊ะด้วย fitBook() (วัดจอจริง ไม่ใช้ aspect-ratio ตายตัว)
      · ภาพเต็มหน้ากระดาษ (object-fit:fill ยืดได้ไม่เกิน PD_STRETCH)
      · ถอดปุ่มลูกศร ‹ › ออก — พลิกหน้าด้วยการ "ปัดซ้าย/ขวา" ลากตามนิ้วแบบหนังสือจริง
   ============================================================ */
(function(){
  const $   = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const esc = s => (has('escapeHTML') ? escapeHTML(s) : s);

  /* 🗜️ รอบ 993: หน้าหนังสือใช้ "แผ่นย่อ" img/matching/web/<ชื่อ>.webp (2MB → ~250KB ต่อแผ่น
     เจนด้วย tools/shrink_matching.py) — ต้นฉบับ .png 91MB เป็นไฟล์ untracked จึงไม่ขึ้นเว็บเลย
     (deploy เอาไฟล์จาก git HEAD) ทำให้หน้าหนังสือบนเว็บจริงภาพ 404 ทั้งเล่ม
     onerror → ถอยไปใช้ .png ต้นฉบับ (เครื่องผู้ใช้ที่ยังไม่ได้รันสคริปต์ย่อก็ยังเห็นภาพ) */
  const sheetSrc  = file => 'img/matching/web/' + encodeURIComponent(file.replace(/\.png$/i,'') + '.webp');
  const sheetOrig = file => 'img/matching/' + encodeURIComponent(file);

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
      <!-- 🎧 รอบ 994: โหมดครูถามศัพท์ — ครูอ่านคำ เด็กแตะการ์ดให้ถูก ได้เหรียญเหมือนมินิเกมอื่น -->
      <button class="pd-quiz-btn" id="pd-quizbtn" title="ครูอ่านคำ แล้วหนูแตะการ์ดให้ถูก">🎧 ครูถามศัพท์</button>
      <div class="pd-qbar" id="pd-qbar" hidden>
        <button class="pd-q-replay" id="pd-qreplay" title="ฟังอีกครั้ง">🔊 ฟังอีกที</button>
        <div class="pd-q-ask" id="pd-qask">ครูกำลังอ่านคำ… ตั้งใจฟังนะ</div>
        <div class="pd-q-score">
          <span class="pd-q-coin" id="pd-qcoin">0 🪙</span>
          <span class="pd-q-combo" id="pd-qcombo">Combo ×0</span>
        </div>
        <button class="pd-q-quit" id="pd-qquit" title="ออกจากโหมดครูถาม">✕ เลิกถาม</button>
      </div>
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
        </div>
        <div class="pd-balloon" id="pd-balloon" hidden></div>
        <div class="pd-hint" id="pd-hint" hidden>👆 ปัดซ้าย–ขวา เพื่อพลิกหน้า</div>
      </div>`;
    const host = $('screen-game') ? $('screen-game').parentNode : document.body;
    host.appendChild(sec);
    $('pd-back').addEventListener('click', exit);
    $('pd-cover').addEventListener('click', openBook);
    $('pd-cr').addEventListener('click', ()=>step(1));
    $('pd-cl').addEventListener('click', ()=>step(-1));
    $('pd-tocbtn').addEventListener('click', ()=>{ if(pd.opened) goTo(0); });
    $('pd-quizbtn').addEventListener('click', qzStart);
    $('pd-qquit').addEventListener('click', ()=>qzStop(true));
    $('pd-qreplay').addEventListener('click', qzReplay);
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
      ro.observe($('pd-stage'));      // เกาะ "เวที" ไม่ใช่ตัวเล่ม — fitBook เปลี่ยนขนาดเล่มเองจะวนไม่จบ
    }
    bindDrag();
    return sec;
  }

  /* ============================================================
     📐 fitBook — วัดจอจริงแล้วกางหนังสือให้ "เต็มความกว้าง + กึ่งกลางเป๊ะ" (รอบ 995)
     แผ่นภาพเป็นแนวตั้ง 2:3 → กางคู่ได้ 4:3 ซึ่งเตี้ยกว่าจอกว้าง ทำให้เล่มลอยแคบกลางจอ
     จึงยอมให้ "ยืดแนวนอน" ได้ถึง PD_STRETCH เท่า เพื่อกินความกว้างที่เหลือ (ภาพจึงดูกว้างขึ้นด้วย)
     ห้ามยืดเกินนี้ ไม่งั้นการ์ด/ตัวหนังสือบนแผ่นจะบิด
     ============================================================ */
  /* 1.45 = ค่าที่วัดจากภาพที่ผู้ใช้ขีดเส้นแดงไว้ (จอ 1062×493 → อยากได้เล่มกว้าง ~820px)
     เทียบภาพจริงแล้วการ์ด/ตัวหนังสือบนแผ่นยังอ่านง่าย ไม่บิด — เกินกว่านี้เริ่มแบน */
  const PD_STRETCH = 1.45;   // ยืดแนวนอนได้มากสุด (1 = ไม่ยืดเลย) — ปรับที่นี่ที่เดียว
  const GAP_X = 16;          // เว้นซ้าย-ขวาให้ "ขอบตั้งกระดาษ" ที่ยื่นออกนอกเล่ม
  const GAP_T = 6, GAP_B = 8;

  /* เขตหวงห้ามของปุ่มลอย ⬅ กลับ / 📑 สารบัญ / 🎧 ครูถาม (วัดจากปุ่มจริง ไม่ใช้ค่าคงที่
     — ขนาด/ตำแหน่งปุ่มเปลี่ยนตามฟอนต์และจอเตี้ย) คืน {side, bottom} เทียบขอบเวที */
  function btnBox(){
    const st = $('pd-stage');
    const out = { side:0, bottom:0 };
    if(!st) return out;
    const sr = st.getBoundingClientRect();
    ['pd-back','pd-tocbtn','pd-quizbtn'].forEach(id=>{
      const el = $(id);
      if(!el || el.hidden || !el.offsetParent) return;
      const r = el.getBoundingClientRect();
      if(!r.width) return;
      /* ปุ่มเกาะขอบไหน ให้วัดจากขอบนั้น (วัดผิดข้าง = ได้เขตเกือบเต็มจอ หนังสือหดฟรี) */
      const left = (r.left + r.right)/2 < (sr.left + sr.right)/2;
      out.side   = Math.max(out.side, (left ? r.right - sr.left : sr.right - r.left) + 6);
      out.bottom = Math.max(out.bottom, r.bottom - sr.top + 6);
    });
    out.side = Math.round(out.side); out.bottom = Math.round(out.bottom);
    return out;
  }

  function fitBook(){
    const st = $('pd-stage'), book = $('pd-book'), wrap = $('pd-bookwrap');
    if(!st || !book || !wrap || wrap.hidden) return;
    const sw = st.clientWidth, sh = st.clientHeight;
    if(!sw || !sh) return;
    const pad   = window.innerHeight <= 430 ? 12 : 20;   // padding ซ้าย+ขวาในหน้ากระดาษ (css)
    const chrome = pd.chrome != null ? pd.chrome : (window.innerHeight <= 430 ? 30 : 46);
    /* คิดขนาดเล่มจาก "ความสูงที่มี" + เพดานความกว้าง (maxW) */
    const calc = (topPad, maxW) => {
      let H = Math.max(140, sh - topPad - GAP_B);
      const imgH = Math.max(40, H - chrome);
      const natW = (imgH*2/3 + pad) * 2;                       // กว้างที่ภาพพอดีไม่ยืด
      let W = Math.min(maxW, (imgH*2/3*PD_STRETCH + pad) * 2);
      if(W < natW){                                            // จอแคบ/สูง → ลดความสูงลงแทน (ไม่บีบภาพ)
        H = Math.max(120, (W/2 - pad) * 1.5 + chrome);
      }
      return { W:Math.round(W), H:Math.round(H), topPad };
    };
    const fullW = Math.max(160, sw - GAP_X*2);
    const btn   = btnBox();
    let r = calc(GAP_T, fullW);
    if((sw - r.W)/2 < btn.side){
      /* เล่มกว้างจนลอดใต้ปุ่มมุมบน — เลือกทางที่ได้ "หน้ากระดาษใหญ่กว่า" ระหว่าง
         ① หลบด้านข้าง: สูงเต็ม แต่กว้างไม่เกินขอบเขตปุ่ม  ② ถอยลงล่างปุ่ม: กางเต็มกว้าง แต่เตี้ยลง */
      const a = calc(GAP_T, Math.max(240, sw - btn.side*2));
      const b = calc(Math.max(GAP_T, btn.bottom), fullW);
      r = (a.W*a.H >= b.W*b.H) ? a : b;
    }
    wrap.style.padding = `${r.topPad}px 0 ${GAP_B}px`;
    book.style.width  = r.W + 'px';
    book.style.height = r.H + 'px';
  }
  /* กางเล่มใหม่ + วางช่องคลิกตาม — เรียกทุกครั้งที่ "พื้นที่เวทีเปลี่ยน"
     (เปลี่ยนหน้า / หมุนจอ / เปิด-ปิดแถบครูถามศัพท์ ซึ่งกินความสูงเวทีไป ~34px)
     ⚠️ ResizeObserver ไม่ยิงตอนแท็บถูกซ่อน จึงต้องเรียกตรงจุดที่รู้ว่าเลย์เอาต์เปลี่ยนด้วย */
  function relayout(){
    fitBook();
    if(measChrome()) fitBook();          // รู้ความสูงหัวเรื่อง/เลขหน้าจริงแล้ว กางใหม่ให้พอดี
    refitCells();                        // ช่องคลิกต้องวางตามขนาดเล่มที่เพิ่งคำนวณ
  }
  /* chrome = ส่วนของหน้ากระดาษที่ไม่ใช่ภาพ (หัวเรื่อง + เลขหน้า + padding บน-ล่าง) */
  function measChrome(){
    const pl = $('pd-pl'), box = pl && pl.querySelector('.pd-imgbox');
    if(!box) return false;
    const c = Math.round(pl.clientHeight - box.clientHeight);
    if(c > 0 && Math.abs(c - (pd.chrome || 0)) > 1){ pd.chrome = c; return true; }
    return false;
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
        <img src="${sheetSrc(pg.file)}" alt="${esc(pg.en)}" draggable="false"
             onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='${sheetOrig(pg.file)}';}">
        ${W ? '<div class="pd-cells"></div>' : ''}
      </div>
      <div class="pd-pno">${W ? '🔊 แตะการ์ดเพื่อฟังเสียง · ' : ''}หน้า ${pg.num} / ${pd.total}</div>`;
  }

  /* วางตารางช่องคลิกทับภาพ (ตำแหน่ง = สัดส่วนภาพที่ contain อยู่ในกล่อง) */
  function placeCells(pageEl, idx){
    pageEl._fitCells = null;                       // หน้าเพิ่งถูกเรนเดอร์ใหม่ ตัวจัดช่องเก่าใช้ไม่ได้แล้ว
    const pg = pd.pages[idx];
    if(!pg || pg.type !== 'sheet') return;
    const W = (typeof PICDICT_WORDS !== 'undefined' && PICDICT_WORDS[pg.file]) || null;
    const box = pageEl.querySelector('.pd-imgbox'), img = pageEl.querySelector('img'),
          ov  = pageEl.querySelector('.pd-cells');
    if(!W || !box || !img || !ov) return;
    const fit = ()=>{
      /* 🖼️ รอบ 995: ภาพเป็น object-fit:fill → เต็มกล่องพอดี ไม่มีขอบว่างให้ชดเชยอีก */
      const iw = box.clientWidth, ih = box.clientHeight;
      if(!iw || !ih) return;
      const [pt,pr,pb,pl] = W.pad || [0,0,0,0];   // % ระยะขอบแผ่นก่อนถึงตารางการ์ด
      ov.style.left   = (iw*pl/100) + 'px';
      ov.style.top    = (ih*pt/100) + 'px';
      ov.style.width  = (iw*(100-pl-pr)/100) + 'px';
      ov.style.height = (ih*(100-pt-pb)/100) + 'px';
      ov.style.gridTemplateColumns = `repeat(${W.cols},1fr)`;
      if(!ov.childElementCount){
        W.words.forEach(([en,th],i)=>{
          const c = document.createElement('button');
          c.className = 'pd-cell'; c.type = 'button';
          c.title = `${en} · ${th}`;
          c.dataset.en = en; c.dataset.th = th;      // 🎧 รอบ 994: โหมดครูถามใช้หาช่องคำตอบ
          c.addEventListener('click', ev=>{ ev.stopPropagation(); sayCell(c, en, th); });
          ov.appendChild(c);
        });
      }
    };
    pageEl._fitCells = fit;              // เรียกซ้ำได้หลัง fitBook เปลี่ยนขนาดเล่ม
    if(img.complete) fit(); else img.addEventListener('load', fit, {once:true});
  }
  const refitCells = ()=> [$('pd-pl'), $('pd-pr')].forEach(el=>{ if(el && el._fitCells) el._fitCells(); });

  /* ---------- 🔊 แตะการ์ด = อ่านออกเสียง + บอลลูนคำ ---------- */
  let balloonT = 0;
  function sayCell(cell, en, th){
    /* เพิ่งปล่อยนิ้วจากการปัดพลิกหน้า → คลิกที่ตามมาไม่ใช่ "ตั้งใจแตะการ์ด" */
    const now = (performance && performance.now) ? performance.now() : Date.now();
    if(dg.endAt && now - dg.endAt < 350) return;
    if(qz.on){ qzAnswer(cell, en, th); return; }   // 🎧 โหมดครูถามศัพท์ — แตะ = ตอบคำถาม
    if(has('speakWord')) speakWord(en);
    cell.classList.remove('hit'); void cell.offsetWidth; cell.classList.add('hit');
    showBalloon(cell, en, th);
  }
  function showBalloon(cell, en, th){
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
    relayout();
    updateStacks();
    preload();
    // 🎧 พลิกหน้าระหว่างโหมดครูถาม = ถามคำใหม่จากหน้าที่เห็นตอนนี้ (รอภาพวางช่องเสร็จก่อน)
    if(qz.on) setTimeout(qzAsk, 260);
  }
  function updateStacks(){
    const m = maxSpread();
    const l = $('pd-stack-l'), r = $('pd-stack-r');
    const w = frac => Math.round(3 + 11*frac);       // 3–14px ตามสัดส่วนหน้าที่อ่านไป/เหลือ
    if(l) l.style.width = w(m ? pd.s/m : 0) + 'px';
    if(r) r.style.width = w(m ? (m-pd.s)/m : 0) + 'px';
    $('pd-cl').style.visibility = pd.s <= 0 ? 'hidden' : '';
    $('pd-cr').style.visibility = pd.s >= m ? 'hidden' : '';
  }
  function preload(){
    for(const d of [1,-1,2]){
      const s = pd.s + d;
      if(s < 0 || s > maxSpread()) continue;
      [s*2, s*2+1].forEach(i=>{
        const pg = pd.pages[i];
        if(pg && pg.type === 'sheet'){ const im = new Image(); im.src = sheetSrc(pg.file); }
      });
    }
  }

  /* ---------- 🔄 พลิกหน้า (หัวใจความ "เหมือนหนังสือจริง") ----------
     ไปหน้า (dir=1): แผ่นพลิก = หน้าขวาปัจจุบัน (หงายหลังเป็นหน้าซ้ายใหม่)
       หมุน rotateY 0 → -180 รอบสันหนังสือ · หน้าขวานิ่งข้างใต้เปลี่ยนเป็นหน้าขวาใหม่ตั้งแต่ต้น
     ย้อนหน้า (dir=-1): กลับด้านกัน · เงา 2 ชั้น: บนตัวแผ่นพลิก + ทาบหน้านิ่งฝั่งปลายทาง */
  /* เตรียมแผ่นพลิก (ใช้ร่วมกันทั้งพลิกอัตโนมัติและลากตามนิ้ว) */
  function prepFaces(target, dir){
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
  }
  /* พลิกจบ = ย้ายไปหน้าปลายทางจริง แล้วเก็บแผ่นพลิกกลับที่ */
  function finishFlip(target){
    const turn = $('pd-turn'), book = $('pd-book');
    pd.s = target;
    renderSpread();                                          // เรนเดอร์จริงทั้งคู่ (รวม overlay ช่องคลิก)
    turn.hidden = true;
    turn.style.transition = 'none';
    turn.style.transform = 'rotateY(0deg)';
    book.classList.remove('fwd','bwd','dragging','settle');
    book.style.removeProperty('--pdp');
    pd.busy = false;
  }
  function cancelFlip(){                                      // ลากแล้วปล่อยกลางทาง = คืนหน้าเดิม
    const turn = $('pd-turn'), book = $('pd-book');
    turn.hidden = true;
    turn.style.transition = 'none';
    turn.style.transform = 'rotateY(0deg)';
    book.classList.remove('fwd','bwd','dragging','settle');
    book.style.removeProperty('--pdp');
    pd.busy = false;
    renderSpread();
  }

  function flipTo(target, dir){
    if(pd.busy || target < 0 || target > maxSpread() || target === pd.s) return;
    pd.busy = true;
    prepFaces(target, dir);
    const turn = $('pd-turn');
    turn.style.transition = 'none';
    turn.style.transform = 'rotateY(0deg)';
    void turn.offsetWidth;                                   // force reflow ก่อนเริ่ม transition
    turn.style.transition = 'transform .75s cubic-bezier(.35,.06,.28,.99)';
    turn.style.transform = `rotateY(${dir>0?-180:180}deg)`;
    flipSfx();
    let fin = false;
    const done = ()=>{
      if(fin) return; fin = true;
      turn.removeEventListener('transitionend', done);
      finishFlip(target);
    };
    turn.addEventListener('transitionend', done);
    setTimeout(done, 950);                                    // กันเหตุ transitionend หาย (แท็บพับ ฯลฯ)
  }

  /* ============================================================
     👆 ปัด/ลากพลิกหน้า (รอบ 995 · ผู้ใช้สั่ง "เอาปุ่ม next/back ออก ใช้ปัดแทน")
     แผ่นกระดาษหมุนตามนิ้วทีละองศาแบบหนังสือจริง (fliphtml5): ลากไปครึ่งทางแล้วเปลี่ยนใจ
     ลากกลับได้ · ปล่อยเกินครึ่ง (หรือปัดเร็ว ๆ) = พลิกต่อจนสุด · ไม่ถึง = ไหลกลับที่เดิม
     ============================================================ */
  const dg = { id:null, x0:0, y0:0, on:false, dir:0, target:0, prog:0, t0:0, endAt:0 };
  const halfW = ()=> Math.max(60, $('pd-book').clientWidth/2);

  function setTurn(prog){
    const turn = $('pd-turn'), book = $('pd-book');
    turn.style.transform = `rotateY(${(dg.dir > 0 ? -180 : 180) * prog}deg)`;
    book.style.setProperty('--pdp', Math.sin(Math.min(prog,1)*Math.PI).toFixed(3));
  }
  function dragDown(e){
    if(pd.busy || !pd.opened || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dg.id = e.pointerId; dg.x0 = e.clientX; dg.y0 = e.clientY;
    dg.on = false; dg.prog = 0; dg.t0 = (performance && performance.now) ? performance.now() : Date.now();
  }
  function dragMove(e){
    if(dg.id === null || e.pointerId !== dg.id) return;
    const dx = e.clientX - dg.x0, dy = e.clientY - dg.y0;
    if(!dg.on){
      if(Math.abs(dx) < 12 || Math.abs(dx) <= Math.abs(dy)) return;   // ยังไม่ชัดว่าปัดแนวนอน
      const dir = dx < 0 ? 1 : -1, target = pd.s + dir;
      if(pd.busy || target < 0 || target > maxSpread()){ dg.id = null; return; }   // สุดเล่มแล้ว
      pd.busy = true; dg.on = true; dg.dir = dir; dg.target = target;
      prepFaces(target, dir);
      const turn = $('pd-turn'), book = $('pd-book');
      turn.style.transition = 'none';
      book.classList.add('dragging'); book.classList.remove('settle');
      try{ book.setPointerCapture(e.pointerId); }catch(_){}
    }
    dg.prog = Math.min(1, Math.max(0, (dg.dir > 0 ? -dx : dx) / halfW()));
    setTurn(dg.prog);
    e.preventDefault();
  }
  function dragUp(e){
    if(dg.id === null || (e && e.pointerId !== dg.id)) return;
    dg.id = null;
    if(!dg.on) return;
    dg.on = false;
    const turn = $('pd-turn'), book = $('pd-book');
    const dt = ((performance && performance.now) ? performance.now() : Date.now()) - dg.t0;
    const go = dg.prog > 0.42 || (dg.prog > 0.1 && dt < 340);        // ปัดเร็วสั้น ๆ ก็ให้พลิก
    const to = go ? 1 : 0, dur = Math.max(200, Math.round(640*Math.abs(to - dg.prog)));
    book.classList.add('settle');
    turn.style.transition = `transform ${dur}ms cubic-bezier(.25,.6,.3,1)`;
    requestAnimationFrame(()=>{ setTurn(to); });
    if(go) flipSfx();
    dg.endAt = (performance && performance.now) ? performance.now() : Date.now();
    let fin = false, tm = 0;
    const end = ()=>{
      if(fin) return; fin = true;
      clearTimeout(tm);
      turn.removeEventListener('transitionend', end);
      dg.endAt = (performance && performance.now) ? performance.now() : Date.now();
      if(go) finishFlip(dg.target); else cancelFlip();
    };
    turn.addEventListener('transitionend', end);
    tm = setTimeout(end, dur + 260);
  }
  function bindDrag(){
    const book = $('pd-book');
    book.addEventListener('pointerdown', dragDown);
    book.addEventListener('pointermove', dragMove);
    book.addEventListener('pointerup', dragUp);
    book.addEventListener('pointercancel', dragUp);
    book.addEventListener('dragstart', e=>e.preventDefault());
  }
  const step = dir => flipTo(pd.s + dir, dir);
  const goTo = s   => flipTo(s, s > pd.s ? 1 : -1);

  /* ============================================================
     🎧 โหมดครูถามศัพท์ (รอบ 994 · ผู้ใช้สั่ง)
     ครูอ่านคำอังกฤษ 1 คำ → เด็กแตะการ์ดบนหน้าที่กางอยู่ให้ถูก
     · คำถามสุ่มจาก "การ์ดที่มองเห็นอยู่ตอนนี้" เท่านั้น (2 หน้าที่กาง) — เด็กหาเจอได้จริง
     · ถูก = เหรียญ/EXP/RP/คอมโบ/แต้มโรงงาน **สูตรเดียวกับเกมจับคู่ภาพทุกบรรทัด**
       (ตัวนับ game.* + addSessionCoins + showSessionSummary ชุดเดียวกัน สถิติจึงรวมกัน)
     · ผิด 2 ครั้งในคำเดียว = การ์ดคำตอบเรืองให้เห็น (ไม่ปล่อยให้เด็กจมอยู่กับคำเดียว)
     · พลิกหน้าระหว่างเล่นได้ — คำถามเปลี่ยนตามหน้าใหม่เอง
     ============================================================ */
  const qz = { on:false, cur:null, wrong:0, lock:false, asked:0, right:0 };

  const qzCells = ()=> [ ...$('pd-pl').querySelectorAll('.pd-cell'),
                         ...$('pd-pr').querySelectorAll('.pd-cell') ].filter(c=>c.dataset.en);

  function qzStart(){
    if(!pd.opened) return;
    if(qzCells().length < 2){
      if(has('toast')) toast('📖 หน้านี้ยังไม่มีคำให้ครูถาม ลองพลิกไปหน้าที่มีการ์ดคำก่อนนะ', 2200);
      return;
    }
    if(qz.on) return;
    qz.on = true; qz.asked = 0; qz.right = 0;
    /* ตัวนับ "ครั้งนี้" ชุดเดียวกับเกมจับคู่คำศัพท์/จับคู่ภาพ (สถิติสัปดาห์+ตลอดกาลนับรวมกัน) */
    if(typeof game !== 'undefined'){
      game.combo = 0; game.sessionCoins = 0; game.sessionMatches = 0;
      game.sessMilestone = 0; game.beatBestShown = false;
      if(has('rolloverWeekBest')) rolloverWeekBest();
      game.prevBest = state.weekBestCoins || 0;
      game.prevAllBest = state.bestSessionCoins || 0;
    }
    sec.classList.add('quiz');
    $('pd-qbar').hidden = false;
    $('pd-quizbtn').hidden = true;
    relayout();                      // แถบคำถามกินความสูงเวที → หนังสือต้องหดให้พอดีทันที
    qzScore();
    if(typeof sfx !== 'undefined') sfx.select();
    qzAsk();
  }

  /* ปิดโหมด · คืน true ถ้าโชว์การ์ดสรุปรอบ (ผู้เรียกจะได้ไม่เด้งหน้าจอซ้อนการ์ด)
     onClose = สิ่งที่ทำเมื่อกด "ออกไปพัก" บนการ์ดสรุป (กดเลิกถาม = อยู่ในหนังสือต่อ · กดกลับ = ออกไปล็อบบี้) */
  function qzStop(summary, onClose){
    if(!qz.on) return false;
    qz.on = false; qz.cur = null; qz.lock = false;
    sec.classList.remove('quiz');
    $('pd-qbar').hidden = true;
    $('pd-quizbtn').hidden = false;
    relayout();                      // แถบคำถามหายไป → คืนพื้นที่ให้หนังสือกางเต็มเหมือนเดิม
    qzCells().forEach(c=>c.classList.remove('qz-target','qz-ok','qz-no'));
    const earned = (typeof game !== 'undefined') ? game.sessionCoins : 0;
    if(!summary || earned <= 0 || !has('showSessionSummary')) return false;
    if(has('feedEvent')) feedEvent('coin', `ครูถามศัพท์ในหนังสือภาพ ตอบถูก ${qz.right} คำ ได้ ${has('fmtNum')?fmtNum(earned):earned} เหรียญ 🎧`);
    const isRecord = earned > (game.prevBest || 0);
    const allTime  = isRecord && earned > (game.prevAllBest || 0);
    showSessionSummary(earned, qz.right, isRecord, allTime, onClose || (()=>{}), qzStart);
    return true;
  }

  function qzAsk(){
    if(!qz.on) return;
    const cells = qzCells();
    if(cells.length < 2){        // พลิกมาหน้าที่ยังไม่มีคำ — รอจนกว่าจะพลิกไปหน้าที่มี
      qz.cur = null;
      $('pd-qask').innerHTML = '📖 หน้านี้ยังไม่มีการ์ดคำ — พลิกไปหน้าที่มีการ์ดต่อได้เลย';
      return;
    }
    cells.forEach(c=>c.classList.remove('qz-target','qz-ok','qz-no'));
    let pick = cells[Math.floor(Math.random()*cells.length)];
    if(qz.cur && cells.length > 1){          // กันถามคำเดิมซ้ำติดกัน
      let guard = 0;
      while(pick.dataset.en === qz.cur.en && guard++ < 12)
        pick = cells[Math.floor(Math.random()*cells.length)];
    }
    qz.cur = { en:pick.dataset.en, th:pick.dataset.th };
    qz.wrong = 0; qz.lock = false; qz.asked++;
    $('pd-qask').innerHTML = `👂 ครูถามคำที่ <b>${qz.asked}</b> — แตะการ์ดที่ครูอ่านให้ถูกนะ`;
    setTimeout(qzReplay, 260);               // ให้ป้ายขึ้นก่อนแล้วค่อยอ่าน
  }
  function qzReplay(){
    if(qz.on && qz.cur && has('speakWord')) speakWord(qz.cur.en);
  }

  function qzAnswer(cell, en, th){
    if(!qz.cur || qz.lock) return;
    if(en !== qz.cur.en){                    // ❌ ตอบผิด
      qz.wrong++;
      if(typeof game !== 'undefined') game.combo = 0;
      qzScore();
      cell.classList.remove('qz-no'); void cell.offsetWidth; cell.classList.add('qz-no');
      if(typeof sfx !== 'undefined') sfx.wrong();
      $('pd-qask').innerHTML = qz.wrong >= 2
        ? `💡 คำตอบเรืองอยู่ตรงนั้น — แตะการ์ดนั้นได้เลย`
        : `ยังไม่ใช่นะ ลองอีกครั้ง! (แตะ <b>🔊 ฟังอีกที</b> ได้)`;
      if(qz.wrong >= 2){                     // ผิด 2 ครั้ง = เฉลยด้วยการเรืองการ์ด
        const ans = qzCells().find(c=>c.dataset.en === qz.cur.en);
        if(ans) ans.classList.add('qz-target');
      }else{
        setTimeout(qzReplay, 400);
      }
      return;
    }

    /* ✅ ตอบถูก — สูตรรางวัลชุดเดียวกับ js/picmatch.js (จับคู่ 1 คู่ = ตอบถูก 1 คำ) */
    qz.lock = true; qz.right++;
    cell.classList.remove('qz-no'); cell.classList.add('qz-ok');
    if(typeof game !== 'undefined'){ game.combo++; game.sessionMatches++; }
    if(typeof state !== 'undefined'){
      state.totalMatches++;
      state.pmPairs = (state.pmPairs || 0) + 1;
      state.pmScore = Math.round((state.pmScore || 0) + 2);
    }
    if(has('questEvent')) questEvent('match');
    if(has('vbRecord')) vbRecord(en, th, true);

    const p = has('activePet') ? activePet() : null;
    let coins = 10, exp = 5; const rp = 2, notes = [];
    if(p && p.type === 'dragon' && has('abilityOn') && abilityOn(p) && game.combo >= 3){ coins *= 2; notes.push('🔥ไฟลุก x2'); }
    if(state.phone && !state.netCut && typeof PHONE_BONUS !== 'undefined'){ coins += PHONE_BONUS; notes.push(`📱 มือถือ +${PHONE_BONUS}`); }
    if(!p) exp = 0;
    else if(p.sick){ exp = 0; notes.push('🤒 ป่วยอยู่ ไม่ได้ EXP'); }
    else if(p.shape === 'strong' && typeof SHAPE_EXP_BONUS !== 'undefined'){ exp += SHAPE_EXP_BONUS; notes.push(`💪 ล่ำกำยำ +${SHAPE_EXP_BONUS} EXP`); }
    if(has('addCoins')) addCoins(coins);
    if(has('addSessionCoins')) addSessionCoins(coins);
    if(has('addRP')) addRP(rp);
    if(has('addCraft')){
      const made = addCraft(1);
      if(made && has('showCollectReveal')) setTimeout(()=>showCollectReveal(made, null, true), 650);
    }
    if(typeof sfx !== 'undefined'){ sfx.correct(); sfx.coin(); }
    if(has('floatFx')) floatFx(`+${coins} 🪙 +${rp} RP${exp > 0 ? ` +${exp} EXP` : ''}`, '#f2994a');
    if(game.combo >= 2 && has('floatFx')) setTimeout(()=>floatFx(`🔥 COMBO ×${game.combo}!`, '#ff6fa7'), 250);
    if(notes.length && has('toast')) setTimeout(()=>toast(notes.join(' · '), 1200), 500);
    if(exp > 0 && has('addExp')) addExp(exp, p);
    if(has('saveState')) saveState();
    qzScore();
    $('pd-qask').innerHTML = `🎉 เก่งมาก! <b>${esc(en)}</b> = ${esc(th)}`;
    showBalloon(cell, en, th);
    setTimeout(()=>{ if(qz.on) qzAsk(); }, 1500);
  }

  function qzScore(){
    const c = (typeof game !== 'undefined') ? game.sessionCoins : 0;
    const k = (typeof game !== 'undefined') ? game.combo : 0;
    $('pd-qcoin').textContent = (has('fmtNum') ? fmtNum(c) : c) + ' 🪙';
    const cb = $('pd-qcombo');
    cb.textContent = 'Combo ×' + k;
    cb.classList.toggle('hot', k >= 2);
  }

  /* ---------- เปิด/ปิดปก ---------- */
  let hintT = 0;
  function showHint(){                       // ไม่มีปุ่มลูกศรแล้ว ต้องบอกเด็กว่าพลิกยังไง
    const h = $('pd-hint');
    if(!h) return;
    h.hidden = false;
    h.style.animation = 'none'; void h.offsetWidth; h.style.animation = '';
    clearTimeout(hintT);
    hintT = setTimeout(()=>{ h.hidden = true; }, 2900);
  }
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
      showHint();
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
    if(pd.opened){ renderSpread(); showHint(); } else preload();
  }
  function exit(){
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    const back = ()=>{
      if(has('renderDashboard')) renderDashboard();
      if(has('showScreen')) showScreen('screen-dashboard');
    };
    // 🎧 เล่นโหมดครูถามค้างอยู่ = สรุปรอบก่อน (การ์ดสรุปพาออกเองตอนกด "ออกไปพัก")
    if(qz.on && qzStop(true, back)) return;
    back();
  }

  /* เปิดหนังสือแล้วเริ่มโหมดครูถามให้เลย (ปุ่ม 🎧 ในล็อบบี้ / ตึกในเมือง 3D)
     ถ้ายังไม่เคยเปิดหนังสือ = ยังอยู่หน้าปก → เปิดปกให้เองแล้วค่อยเริ่มถาม
     ถ้าหน้าที่ค้างไว้ไม่มีการ์ดคำ (เช่นสารบัญ) → พาไปหน้าแรกที่มีคำแล้วเริ่ม */
  function openQuiz(){
    open();
    const go = ()=>{
      if(qz.on) return;
      if(qzCells().length >= 2){ qzStart(); return; }
      const first = pd.pages.findIndex(p => p.type === 'sheet' &&
        typeof PICDICT_WORDS !== 'undefined' && PICDICT_WORDS[p.file]);
      if(first < 0){ if(has('toast')) toast('📖 ยังไม่มีคำในหนังสือให้ครูถามเลย'); return; }
      goTo(Math.floor(first/2));
      /* รอจน "ช่องคลิกวางเสร็จจริง" แล้วค่อยเริ่มถาม — ตั้งเวลาตายตัวไม่พอ
         เครื่องช้า/เน็ตช้าโหลดภาพนานกว่า 1 วิได้ (ช่องคลิกวางหลังภาพ onload) */
      let tries = 0;
      const wait = setInterval(()=>{
        if(qz.on || ++tries > 40){ clearInterval(wait); return; }   // 40×150ms = 6 วิ
        if(!pd.busy && qzCells().length >= 2){ clearInterval(wait); qzStart(); }
      }, 150);
    };
    if(!pd.opened){ openBook(); setTimeout(go, 900); }
    else setTimeout(go, 260);
  }

  /* ---------- ปุ่มเข้า (ล็อบบี้เดิม) + Esc = ออก ---------- */
  function bind(){
    const b = $('btn-picdict');
    if(b) b.addEventListener('click', open);
    const q = $('btn-picquiz');
    if(q) q.addEventListener('click', openQuiz);
    document.addEventListener('keydown', e=>{
      if(!sec || !sec.classList.contains('active')) return;
      if(e.key === 'Escape') exit();
      else if(e.key === 'ArrowRight') step(1);
      else if(e.key === 'ArrowLeft') step(-1);
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();

  window.PicDict = { open, openQuiz, exit, _t:{ pd, qz, dg, flipTo, goTo, step, sayCell, buildPages,
                                      renderSpread, fitBook, qzStart, qzStop, qzAsk, qzCells } };
})();
