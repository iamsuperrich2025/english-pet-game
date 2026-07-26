"use strict";
/* ============================================================
   🔎 wordsearch.js — เกมค้นหาคำศัพท์ (Word Search) รอบ 194
   แผงฟ้าล้ำยุคเลื่อนออกจากซ้าย · สุ่มคำไม่ซ้ำในแต่ละเกม
   🆕 รอบ 588: กระดานเกือบเต็มจอ · แถบ "หาคำเหล่านี้ให้เจอ" ย้ายขึ้นบนสุด จัดกึ่งกลาง
              · เอาไฟกระพริบที่คำที่เจอออก (เหลือไฮไลต์เขียวนิ่ง ๆ)
   🆕 รอบ 589: กระดาน "เตี้ยกว้าง" 5 แถวเสมอ (ผู้ใช้สั่ง: 10 แถวบนมือถือช่องเล็กเกินไป)
              เลือกจำนวนคอลัมน์ได้ 5×10 / 5×13 / 5×16 (ตั้งต้นตามระดับชั้น · จำไว้ใน state.wsSize)
              · กดที่ชิปคำ = อ่านออกเสียง (speakWord) + ใบ้ "เส้นที่คำวางอยู่" (แถว/หลัก/ทแยง)
   🆕 รอบ 590: แต้มสะสมตลอดกาล (state.wsScore/wsWords/wsBoards) → แท็บใหม่ "🔎 ค้นหาคำ"
              ในกระดานอันดับ (Top 10 all time · field ws ใน /leaderboard)
   🔒 กฎเหล็ก: คำที่นำมาเล่น = คำตามระดับชั้นผู้เล่นเท่านั้น (vocabForStudent)
   ปุ่ม: สุ่มเกมใหม่ · เก็บกระดานชั่วคราว (เลื่อนซ้าย เก็บข้อมูล) ·
        ล้างกระดาน-ออกจากเกม (ลบตัวอักษรแบบมีสไตล์ แล้วเลื่อนเก็บซ้าย)
   ============================================================ */
(function(){
  const MINLEN=3, MAXLEN=10;
  /* 📐 รอบ 589: กระดานเตี้ยกว้าง — แถวคงที่ 5 แถว ช่องจะได้ใหญ่ (เดิม 10 แถว บนมือถือตัวเล็กมาก)
     เลือกได้แค่ "จำนวนคอลัมน์" · กว้างขึ้น = คำเยอะขึ้น ท้าทายขึ้น */
  const ROWS=5;
  const COLS=[10,13,16], WANT_BY_COLS={10:5, 13:6, 16:8};
  const DIRS=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
  const AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let wsGame=null;                    // เกมปัจจุบัน (อยู่ในหน่วยความจำ · เก็บชั่วคราวลง state.wordSearch)
  let queue=[], qi=0, qGrade=null;    // คิวคำสุ่ม (ไม่ซ้ำข้ามเกมจนกว่าจะหมดคลัง)
  let overlay=null, boardEl=null, gridEl=null, wordsEl=null, progEl=null, winEl=null;
  let sel=null;                       // สถานะลากเลือก {r0,c0,cells}

  const shuffle=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const grade=()=> (typeof state!=='undefined'&&state.student)?state.student.grade:'ป.1';

  /* 📐 คอลัมน์ตั้งต้นตามระดับชั้น: ต่ำกว่าประถม-ป.3 = 10 · ป.4-ป.6 = 13 · ม.ต้น-ม.ปลาย = 16 */
  function defaultSize(){
    const g=String(grade()||'');
    if(g.indexOf('ม.')===0) return 16;
    const m=/^ป\.(\d)/.exec(g);
    if(m) return (+m[1]>=4)?13:10;
    return 10;
  }
  /* คอลัมน์ที่ใช้จริง = ที่ผู้เล่นเลือกไว้ (ถ้ามี) ไม่งั้นตามระดับชั้น */
  function curSize(){
    const s=(typeof state!=='undefined'&&state.wsSize)?+state.wsSize:0;
    return (COLS.indexOf(s)>=0)?s:defaultSize();
  }

  /* คลังคำตามระดับชั้น (อังกฤษล้วน A-Z · ยาว 3-10 · ไม่ซ้ำ) — กฎเหล็ก */
  function pool(){
    const seen=new Set(), out=[];
    const src=(typeof vocabForStudent==='function')?vocabForStudent():[];
    src.forEach(pair=>{
      const w=String(pair[0]||'').toUpperCase().replace(/[^A-Z]/g,'');
      if(w.length>=MINLEN && w.length<=MAXLEN && !seen.has(w)){ seen.add(w); out.push({w, th:pair[1]||''}); }
    });
    return out;
  }
  /* ดึงคำถัดไปจากคิว (รีเซ็ต+สับใหม่เมื่อคิวหมด หรือเปลี่ยนระดับชั้น)
     🐛 รอบ 589: เดิมถ้าคิวเหลือน้อยกว่าที่ขอ จะคืนเท่าที่เหลือ → กระดานได้คำแค่ 1-2 คำ
        (เห็นชัดตอนกระดาน 12/15 ที่ขอคำเยอะ) · แก้เป็นสับคิวใหม่แล้ววนต่อจนครบจำนวน */
  function takeWords(n){
    const g=grade();
    if(qGrade!==g || !queue.length){ queue=shuffle(pool()); qi=0; qGrade=g; }
    if(!queue.length) return [];
    const out=[];
    while(out.length<n){
      if(qi>=queue.length){ queue=shuffle(queue); qi=0; }   // คิวหมด → สับใหม่แล้ววนต่อ
      out.push(queue[qi++]);
      if(out.length>=queue.length*2) break;                 // กันวนไม่จบตอนคลังคำน้อยมาก
    }
    return out;
  }

  /* วางคำลงกริดตัวอักษร (สุ่มทิศ 8 ทาง · เลี่ยงชน) → คืนพิกัดเซลล์ หรือ null
     รอบ 589: กระดานไม่จัตุรัสแล้ว → แยก rows/cols (คำยาวกว่า 5 จะลงได้เฉพาะแนวนอน ตัววางลองสุ่มจนเจอเอง) */
  function place(g, word, rows, cols){
    for(let t=0;t<200;t++){
      const [dr,dc]=DIRS[Math.floor(Math.random()*8)];
      const r0=Math.floor(Math.random()*rows), c0=Math.floor(Math.random()*cols);
      const r1=r0+dr*(word.length-1), c1=c0+dc*(word.length-1);
      if(r1<0||r1>=rows||c1<0||c1>=cols) continue;
      let ok=true; const cells=[];
      for(let i=0;i<word.length;i++){ const r=r0+dr*i, c=c0+dc*i;
        if(g[r][c] && g[r][c]!==word[i]){ ok=false; break; } cells.push([r,c]); }
      if(!ok) continue;
      for(let i=0;i<word.length;i++){ g[cells[i][0]][cells[i][1]]=word[i]; }
      return cells;
    }
    return null;
  }

  /* สร้างเกมใหม่ 1 กระดาน (5 แถว × คอลัมน์ตามที่เลือก · จำนวนคำตามความกว้าง)
     🔁 รอบ 589: 5 แถวทำให้คำยาว >5 ตัวลงได้เฉพาะแนวนอน บางครั้งวางไม่ครบ
        → ปั้นกระดานซ้ำได้ถึง 12 ใบ เอาใบแรกที่คำครบ (ไม่ครบสักใบ = เอาใบที่ได้คำเยอะสุด) */
  function generate(size){
    const cols=(COLS.indexOf(+size)>=0)?+size:curSize();
    const want=WANT_BY_COLS[cols]||5;
    let best=null;
    for(let t=0;t<12;t++){
      const g=buildBoard(ROWS, cols, want);
      if(g.words.length>=want) return g;
      if(!best || g.words.length>best.words.length) best=g;
    }
    return best;
  }
  function buildBoard(rows, cols, WANT){
    const g=Array.from({length:rows},()=>Array.from({length:cols},()=>''));
    const words=[];
    const cands=takeWords(WANT*4);                         // เผื่อบางคำวางไม่ลง
    for(const cd of cands){
      if(words.length>=WANT) break;
      if(cd.w.length>cols) continue;                       // คำยาวกว่ากระดานวางไม่ได้
      if(words.some(w=>w.w===cd.w)) continue;
      const cells=place(g, cd.w, rows, cols);
      if(cells) words.push({w:cd.w, th:cd.th, cells, found:false});
    }
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) if(!g[r][c]) g[r][c]=AZ[Math.floor(Math.random()*26)];
    const grid=g.map(row=>row.map(ch=>({ch, found:false})));
    return {rows, cols, size:cols, grid, words, done:false};
  }
  /* กระดานที่เซฟไว้จากเวอร์ชันก่อน (จัตุรัส ไม่มี rows/cols) → เติมให้ครบจากตัวกริดจริง */
  function normalize(g){
    if(!g||!g.grid||!g.grid.length) return g;
    if(!g.rows) g.rows=g.grid.length;
    if(!g.cols) g.cols=g.grid[0].length;
    g.size=g.cols;
    return g;
  }

  /* ---------- DOM ---------- */
  function build(){
    overlay=document.createElement('div'); overlay.id='ws-overlay';
    overlay.innerHTML=`<div id="ws-board">
      <div class="ws-head"><span class="ws-title">🔎 ค้นหาคำศัพท์ · Word Search</span>
        <span class="ws-findbar"><span class="ws-find">🔤 หาคำเหล่านี้ให้เจอ</span><span id="ws-prog"></span>
          <span class="ws-tip">👆 กดที่คำ = ฟังเสียง + ใบ้ตำแหน่ง</span></span>
        <span class="ws-grade"></span></div>
      <div class="ws-body">
        <div id="ws-words"></div>
        <div class="ws-gridwrap"><div id="ws-grid"></div></div>
      </div>
      <div class="ws-actions">
        <span class="ws-sizes" role="group" aria-label="ขนาดกระดาน"><span class="ws-sizes-lb">📐 ขนาด</span>${
          COLS.map(s=>`<button type="button" class="ws-size" data-size="${s}">${ROWS}×${s}</button>`).join('')}</span>
        <button id="ws-new" type="button">🎲 สุ่มเกมใหม่</button>
        <button id="ws-stash" type="button">📥 เก็บกระดานชั่วคราว</button>
        <button id="ws-clear" type="button">🧹 ล้างกระดาน — ออกจากเกม</button>
      </div>
      <div id="ws-win"></div>
    </div>`;
    document.body.appendChild(overlay);
    boardEl=overlay.querySelector('#ws-board');
    gridEl =overlay.querySelector('#ws-grid');
    wordsEl=overlay.querySelector('#ws-words');
    progEl =overlay.querySelector('#ws-prog');
    winEl  =overlay.querySelector('#ws-win');
    overlay.querySelector('#ws-new').addEventListener('click', ()=>{ if(typeof sfx!=='undefined')sfx.select(); newGame(); });
    overlay.querySelector('#ws-stash').addEventListener('click', stash);
    overlay.querySelector('#ws-clear').addEventListener('click', clearExit);
    overlay.querySelector('.ws-grade').textContent='ระดับชั้น '+grade();
    /* 📐 รอบ 589: เลือกขนาดกระดาน → สุ่มกระดานใหม่ทันทีตามขนาดนั้น */
    overlay.querySelector('.ws-sizes').addEventListener('click', e=>{
      const b=e.target.closest('.ws-size'); if(!b) return;
      const s=+b.dataset.size;
      if(s===(wsGame?wsGame.cols:curSize())) return;
      if(typeof state!=='undefined'){ state.wsSize=s; }
      if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
      newGame(s);
      if(typeof toast==='function') toast(`📐 เปลี่ยนเป็นกระดาน ${ROWS}×${s} · หา ${wsGame.words.length} คำ`);
    });
    /* 🔊 รอบ 589: กดชิปคำ = อ่านออกเสียง + ใบ้ตำแหน่งคร่าว ๆ */
    wordsEl.addEventListener('click', e=>{
      const el=e.target.closest('.ws-word'); if(!el||!wsGame) return;
      const w=wsGame.words[+el.dataset.i]; if(!w) return;
      if(typeof speakWord==='function') speakWord(w.w.toLowerCase());
      if(!w.found) hintWord(w, el);
    });
    bindSelect();
  }

  /* 💡 ใบ้ตำแหน่งคร่าว ๆ — ไฮไลต์ "เส้นที่คำนั้นวางอยู่" ลากยาวจนสุดขอบกระดานทั้งสองด้าน
     แนวนอน=ทั้งแถว · แนวตั้ง=ทั้งหลัก · ทแยง=ทั้งเส้นทแยง (ยาวเท่ากันทุกแบบ ≤ ขนาดกระดาน)
     บอกแค่ "อยู่เส้นไหน" ไม่ชี้ตัวอักษร เด็กยังต้องไล่หาเอง */
  function hintWord(w, chipEl){
    if(!gridEl||!w.cells.length) return;
    const rows=wsGame.rows, cols=wsGame.cols, [r0,c0]=w.cells[0], last=w.cells[w.cells.length-1];
    const len=w.cells.length, far=Math.max(rows,cols);
    const dr=len>1?Math.sign(last[0]-r0):0, dc=len>1?Math.sign(last[1]-c0):0;
    const line=[];
    for(let i=-far;i<=far;i++){ const r=r0+dr*i, c=c0+dc*i;
      if(r>=0&&r<rows&&c>=0&&c<cols) line.push([r,c]); }
    gridEl.querySelectorAll('.ws-cell.hint').forEach(e=>e.classList.remove('hint'));
    line.forEach(([r,c])=>{
      const el=gridEl.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
      if(el && !el.classList.contains('found')) el.classList.add('hint');
    });
    if(chipEl){ chipEl.classList.add('hinting'); setTimeout(()=>chipEl.classList.remove('hinting'), 2200); }
    clearTimeout(hintWord._t);
    hintWord._t=setTimeout(()=>{ if(gridEl) gridEl.querySelectorAll('.ws-cell.hint').forEach(e=>e.classList.remove('hint')); }, 2200);
  }
  /* 📏 รอบ 589: คำนวณขนาดกระดานเป็น px เอง — ช่องเป็นจัตุรัสเป๊ะทุกจอ + ตัวอักษรโตตามช่อง
     (CSS aspect-ratio ทำไม่ได้: height:100% + max-width หนีบกว้างอย่างเดียว ช่องเลยยืด) */
  function fitGrid(){
    if(!gridEl||!wsGame) return;
    const wrap=gridEl.parentElement; if(!wrap) return;
    const cs=getComputedStyle(gridEl);
    const pad=parseFloat(cs.paddingLeft)||0, bw=parseFloat(cs.borderLeftWidth)||0;
    const gap=parseFloat(cs.columnGap)||0, chrome=2*(pad+bw);
    const rows=wsGame.rows, cols=wsGame.cols;
    const availW=wrap.clientWidth, availH=wrap.clientHeight;
    if(availW<=0||availH<=0) return;
    const cell=Math.max(10, Math.min((availW-chrome-(cols-1)*gap)/cols,
                                     (availH-chrome-(rows-1)*gap)/rows));
    gridEl.style.width =Math.floor(cell*cols+(cols-1)*gap+chrome)+'px';
    gridEl.style.height=Math.floor(cell*rows+(rows-1)*gap+chrome)+'px';
    gridEl.style.setProperty('--ws-fs', Math.max(11, Math.round(cell*0.54))+'px');
  }
  /* ปุ่มขนาดที่กำลังใช้อยู่ = ติดไฟ */
  function syncSizeBtns(){
    if(!overlay) return;
    // กระดานเก่าที่เซฟไว้ (จัตุรัส 10 แถว) ไม่ตรงกับปุ่มไหน → ไม่ต้องติดไฟปุ่มใด
    const cur=(wsGame && wsGame.rows!==ROWS) ? -1 : (wsGame?wsGame.cols:curSize());
    overlay.querySelectorAll('.ws-size').forEach(b=>b.classList.toggle('on', +b.dataset.size===cur));
  }

  function render(){
    if(!wsGame) return;
    gridEl.style.setProperty('--ws-r', wsGame.rows);
    gridEl.style.setProperty('--ws-c', wsGame.cols);
    gridEl.style.setProperty('--ws-ar', (wsGame.cols/wsGame.rows).toFixed(4));
    gridEl.innerHTML=wsGame.grid.map((row,r)=>row.map((cell,c)=>
      `<div class="ws-cell${cell.found?' found':''}" data-r="${r}" data-c="${c}"${cell.found?` style="--zi:${cell.zi||0}"`:''}>${cell.ch}</div>`).join('')).join('');
    wordsEl.innerHTML=wsGame.words.map((w,i)=>
      `<span class="ws-word${w.found?' got':''}" data-i="${i}" title="กดเพื่อฟังเสียง${w.found?'':' + ใบ้ตำแหน่ง'}">${w.w}<small>${(typeof escapeHTML==='function')?escapeHTML(w.th):w.th}</small></span>`).join('');
    updateProg();
    syncSizeBtns();
    overlay.querySelector('.ws-grade').textContent='ระดับชั้น '+grade();
    fitGrid();
    requestAnimationFrame(fitGrid);          // เผื่อแถบคำเพิ่ง/ลดบรรทัด ความสูงที่เหลือเปลี่ยน
  }
  function updateProg(){
    if(!wsGame) return;
    const done=wsGame.words.filter(w=>w.found).length;
    progEl.textContent=`เจอแล้ว ${done}/${wsGame.words.length} คำ`;
  }
  /* ---------- ลากเลือกแนวเส้นตรง 8 ทิศ ---------- */
  function cellAt(x,y){ const el=document.elementFromPoint(x,y); const c=el&&el.closest?el.closest('.ws-cell'):null;
    return (c&&gridEl.contains(c))?c:null; }
  function lineCells(r0,c0,r1,c1){
    const dr=r1-r0, dc=c1-c0;
    if(!(dr===0||dc===0||Math.abs(dr)===Math.abs(dc))) return null;   // ต้องเป็นแนวตรง/ทแยง
    const n=Math.max(Math.abs(dr),Math.abs(dc)); const sr=Math.sign(dr), sc=Math.sign(dc);
    const out=[]; for(let i=0;i<=n;i++) out.push([r0+sr*i, c0+sc*i]); return out;
  }
  function paintSel(cells){
    gridEl.querySelectorAll('.ws-cell.sel').forEach(e=>e.classList.remove('sel'));
    if(!cells) return;
    cells.forEach(([r,c])=>{ const el=gridEl.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`); if(el)el.classList.add('sel'); });
  }
  function bindSelect(){
    const start=e=>{ if(!wsGame||wsGame.done) return; const t=e.touches?e.touches[0]:e; const c=cellAt(t.clientX,t.clientY);
      if(!c) return; e.preventDefault(); sel={r0:+c.dataset.r, c0:+c.dataset.c, cells:[[+c.dataset.r,+c.dataset.c]]}; paintSel(sel.cells); };
    const move=e=>{ if(!sel) return; const t=e.touches?e.touches[0]:e; const c=cellAt(t.clientX,t.clientY);
      if(!c) return; e.preventDefault(); const cells=lineCells(sel.r0,sel.c0,+c.dataset.r,+c.dataset.c);
      if(cells){ sel.cells=cells; paintSel(cells); } };
    const end=()=>{ if(!sel) return; commit(sel.cells); paintSel(null); sel=null; };
    gridEl.addEventListener('mousedown',start); gridEl.addEventListener('mousemove',move); window.addEventListener('mouseup',end);
    gridEl.addEventListener('touchstart',start,{passive:false}); gridEl.addEventListener('touchmove',move,{passive:false});
    gridEl.addEventListener('touchend',end);
  }
  function commit(cells){
    if(!cells||cells.length<MINLEN) return;
    const str=cells.map(([r,c])=>wsGame.grid[r][c].ch).join('');
    const rev=str.split('').reverse().join('');
    const hit=wsGame.words.find(w=>!w.found && (w.w===str || w.w===rev));
    if(!hit){ if(typeof sfx!=='undefined'&&sfx.wrong)sfx.wrong(); flashWrong(cells); return; }
    hit.found=true;
    hit.cells.forEach(([r,c],i)=>{ wsGame.grid[r][c].found=true; wsGame.grid[r][c].zi=i; });   // zi = ลำดับตัวอักษร (คลื่นไฟฟ้าไล่)
    if(typeof vbRecord==='function') vbRecord(hit.w, hit.th, true);   // 📒 รอบ 291: ลงสมุดคำศัพท์ถาวร (normalize ตัวเล็กใน vbRecord)
    const reward=hit.w.length*2;                                    // 🪙 รางวัลตามความยาวคำ (3 ตัว=6 … 10 ตัว=20)
    if(typeof addCoins==='function') addCoins(reward);
    addWsScore(reward, 1);                                          // 🔎 รอบ 590: แต้มสะสมตลอดกาล (กระดานอันดับ)
    if(typeof sfx!=='undefined'){ if(sfx.spark)sfx.spark(); else if(sfx.coin)sfx.coin(); }   // ⚡ ฟ้าร้อง+ไฟช็อต
    if(typeof speakWord==='function') speakWord(hit.w.toLowerCase());
    render(); saveTemp();
    wsFlash();                                                      // ⚡ แฟลชฟ้าผ่าบนกระดาน
    wsCoinPop(reward, hit.cells);                                   // 🪙 ป๊อปเหรียญตื่นเต้น
    if(wsGame.words.every(w=>w.found)) win();
  }
  /* ⚡ แฟลชฟ้าผ่า + 🪙 ป๊อปเหรียญ (สไตล์เกมจับคู่คำศัพท์) */
  function wsFlash(){
    if(!boardEl || document.documentElement.classList.contains('no-anim')) return;
    let f=boardEl.querySelector('.ws-flash');
    if(!f){ f=document.createElement('div'); f.className='ws-flash'; boardEl.appendChild(f); }
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  }
  function wsCoinPop(reward, cells){
    if(!gridEl || document.documentElement.classList.contains('no-anim')) return;
    const mid=cells[Math.floor(cells.length/2)];
    const el=gridEl.querySelector(`.ws-cell[data-r="${mid[0]}"][data-c="${mid[1]}"]`);
    const pop=document.createElement('div'); pop.className='ws-coinpop'; pop.textContent=`+${reward} 🪙`;
    if(el){ const br=boardEl.getBoundingClientRect(), cr=el.getBoundingClientRect();
      pop.style.left=(cr.left-br.left+cr.width/2)+'px'; pop.style.top=(cr.top-br.top+cr.height/2)+'px'; }
    else { pop.style.left='40%'; pop.style.top='40%'; }
    boardEl.appendChild(pop);
    setTimeout(()=>pop.remove(), 1550);
  }
  function flashWrong(cells){
    cells.forEach(([r,c])=>{ const el=gridEl.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
      if(el){ el.classList.add('bad'); setTimeout(()=>el.classList.remove('bad'),320); } });
  }
  /* ============================================================
     🔎🏆 รอบ 590: แต้มสะสมตลอดกาล → กระดานอันดับ (แท็บ "ค้นหาคำ")
     แต้ม = เท่ากับเหรียญที่ได้ต่อคำ (ความยาว×2) + โบนัสจบกระดาน WS_CLEAR_BONUS
     เก็บใน state (เซฟลง cloud ตามระบบเดิม) · ดันขึ้น /leaderboard field ws
     ============================================================ */
  const WS_CLEAR_BONUS=20;
  function addWsScore(pts, words, boards){
    if(typeof state==='undefined') return;
    state.wsScore=Math.round((state.wsScore||0)+(pts||0));
    state.wsWords=(state.wsWords||0)+(words||0);
    state.wsBoards=(state.wsBoards||0)+(boards||0);
    if(typeof saveState==='function') saveState();
    if(typeof onlinePushScore==='function') onlinePushScore();      // ให้เพื่อนเห็นอันดับใหม่ทันที (มี sig กันเขียนซ้ำ)
    if(typeof renderLeaderboardCard==='function') renderLeaderboardCard();
  }

  function win(){
    wsGame.done=true; saveTemp();
    addWsScore(WS_CLEAR_BONUS, 0, 1);                               // 🎁 โบนัสจบกระดาน
    winEl.innerHTML=`<div class="ws-win-in">🎉 เก่งมาก! เจอครบทุกคำแล้ว<br><small>+${WS_CLEAR_BONUS} แต้มโบนัสจบกระดาน · รวม ${(state.wsScore||0).toLocaleString()} แต้ม<br>กด 🎲 สุ่มเกมใหม่ เล่นต่อได้เลย</small></div>`;
    winEl.classList.add('on');
    if(typeof sfx!=='undefined'&&sfx.win)sfx.win(); else if(typeof sfx!=='undefined'&&sfx.coin)sfx.coin();
    setTimeout(()=>winEl.classList.remove('on'), 2600);
  }

  /* ---------- เปิด/เก็บ/ล้าง ---------- */
  function saveTemp(){ if(typeof state==='undefined')return; state.wordSearch=wsGame; if(typeof saveState==='function')saveState(); }
  function newGame(size){ winEl.classList.remove('on'); wsGame=generate(size); render(); saveTemp(); }
  function open(){
    if(!overlay) build();
    if(!wsGame){ wsGame=(typeof state!=='undefined'&&state.wordSearch)?normalize(state.wordSearch):null; }
    if(!wsGame) wsGame=generate();
    render();
    overlay.style.display='flex';
    void boardEl.offsetWidth;                 // reflow เพื่อให้ transition เลื่อนเข้าเห็นชัด
    boardEl.classList.add('open');
    fitGrid();                                // วัดใหม่ตอนแผงถูกโชว์จริง (ตอน display:none วัดไม่ได้)
    if(typeof sfx!=='undefined'&&sfx.select)sfx.select();
  }
  function slideAway(after){
    boardEl.classList.remove('open');
    setTimeout(()=>{ overlay.style.display='none'; if(after)after();
      if(typeof renderDashboard==='function') renderDashboard(); }, 520);   // รีเฟรชเหรียญบนหน้า Lobby
  }
  function stash(){ if(typeof sfx!=='undefined'&&sfx.select)sfx.select(); saveTemp(); slideAway(); }   // เลื่อนซ้าย เก็บข้อมูลไว้
  function clearExit(){
    if(typeof sfx!=='undefined'&&sfx.wrong)sfx.wrong();
    // ลบตัวอักษรแบบมีสไตล์ (กระจายหายทีละเซลล์แบบสุ่มดีเลย์) แล้วค่อยเลื่อนเก็บ
    [...gridEl.children].forEach(c=>{ c.style.transitionDelay=(Math.random()*0.4).toFixed(2)+'s'; c.classList.add('gone'); });
    winEl.classList.remove('on');
    setTimeout(()=>{
      wsGame=null;
      if(typeof state!=='undefined'){ delete state.wordSearch; if(typeof saveState==='function')saveState(); }
      slideAway(()=>{ if(gridEl) gridEl.innerHTML=''; });
    }, 650);
  }

  /* ปุ่ม rail + ปิดด้วย Esc (= เก็บชั่วคราว) */
  function bindRail(){
    const btn=document.getElementById('btn-rail-wordsearch');
    if(btn) btn.addEventListener('click', ()=>{ if(typeof closePanel==='function')closePanel(); open(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && overlay && overlay.style.display==='flex' && boardEl.classList.contains('open')) stash(); });
    window.addEventListener('resize', ()=>{ if(overlay && overlay.style.display==='flex') fitGrid(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindRail); else bindRail();

  window.WordSearch={ open, _t:{ get game(){return wsGame;}, generate, pool, takeWords, commit, lineCells,
    newGame, hintWord, curSize, defaultSize, addWsScore, ROWS, COLS, WANT_BY_COLS, WS_CLEAR_BONUS } };
})();
