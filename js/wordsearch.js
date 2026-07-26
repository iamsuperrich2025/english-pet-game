"use strict";
/* ============================================================
   🔎 wordsearch.js — เกมค้นหาคำศัพท์ (Word Search) รอบ 194
   แผงฟ้าล้ำยุคเลื่อนออกจากซ้าย · สุ่มคำไม่ซ้ำในแต่ละเกม
   🆕 รอบ 588: กระดานเกือบเต็มจอ · แถบ "หาคำเหล่านี้ให้เจอ" ย้ายขึ้นบนสุด จัดกึ่งกลาง
              · เอาไฟกระพริบที่คำที่เจอออก (เหลือไฮไลต์เขียวนิ่ง ๆ)
   🔒 กฎเหล็ก: คำที่นำมาเล่น = คำตามระดับชั้นผู้เล่นเท่านั้น (vocabForStudent)
   ปุ่ม: สุ่มเกมใหม่ · เก็บกระดานชั่วคราว (เลื่อนซ้าย เก็บข้อมูล) ·
        ล้างกระดาน-ออกจากเกม (ลบตัวอักษรแบบมีสไตล์ แล้วเลื่อนเก็บซ้าย)
   ============================================================ */
(function(){
  const SIZE=10, WANT=7, MINLEN=3, MAXLEN=10;
  const DIRS=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
  const AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let wsGame=null;                    // เกมปัจจุบัน (อยู่ในหน่วยความจำ · เก็บชั่วคราวลง state.wordSearch)
  let queue=[], qi=0, qGrade=null;    // คิวคำสุ่ม (ไม่ซ้ำข้ามเกมจนกว่าจะหมดคลัง)
  let overlay=null, boardEl=null, gridEl=null, wordsEl=null, progEl=null, winEl=null;
  let sel=null;                       // สถานะลากเลือก {r0,c0,cells}

  const shuffle=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const grade=()=> (typeof state!=='undefined'&&state.student)?state.student.grade:'ป.1';

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
  /* ดึงคำถัดไปจากคิว (รีเซ็ต+สับใหม่เมื่อคิวหมด หรือเปลี่ยนระดับชั้น) */
  function takeWords(n){
    const g=grade();
    if(qGrade!==g || qi>=queue.length || !queue.length){ queue=shuffle(pool()); qi=0; qGrade=g; }
    const out=[];
    while(out.length<n && qi<queue.length) out.push(queue[qi++]);
    return out;
  }

  /* วางคำลงกริดตัวอักษร (สุ่มทิศ 8 ทาง · เลี่ยงชน) → คืนพิกัดเซลล์ หรือ null */
  function place(g, word){
    for(let t=0;t<90;t++){
      const [dr,dc]=DIRS[Math.floor(Math.random()*8)];
      const r0=Math.floor(Math.random()*SIZE), c0=Math.floor(Math.random()*SIZE);
      const r1=r0+dr*(word.length-1), c1=c0+dc*(word.length-1);
      if(r1<0||r1>=SIZE||c1<0||c1>=SIZE) continue;
      let ok=true; const cells=[];
      for(let i=0;i<word.length;i++){ const r=r0+dr*i, c=c0+dc*i;
        if(g[r][c] && g[r][c]!==word[i]){ ok=false; break; } cells.push([r,c]); }
      if(!ok) continue;
      for(let i=0;i<word.length;i++){ g[cells[i][0]][cells[i][1]]=word[i]; }
      return cells;
    }
    return null;
  }

  /* สร้างเกมใหม่ 1 กระดาน */
  function generate(){
    const g=Array.from({length:SIZE},()=>Array.from({length:SIZE},()=>''));
    const words=[];
    const cands=takeWords(WANT*3);                         // เผื่อบางคำวางไม่ลง
    for(const cd of cands){
      if(words.length>=WANT) break;
      if(words.some(w=>w.w===cd.w)) continue;
      const cells=place(g, cd.w);
      if(cells) words.push({w:cd.w, th:cd.th, cells, found:false});
    }
    for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) if(!g[r][c]) g[r][c]=AZ[Math.floor(Math.random()*26)];
    const grid=g.map(row=>row.map(ch=>({ch, found:false})));
    return {size:SIZE, grid, words, done:false};
  }

  /* ---------- DOM ---------- */
  function build(){
    overlay=document.createElement('div'); overlay.id='ws-overlay';
    overlay.innerHTML=`<div id="ws-board">
      <div class="ws-head"><span class="ws-title">🔎 ค้นหาคำศัพท์ · Word Search</span>
        <span class="ws-findbar"><span class="ws-find">🔤 หาคำเหล่านี้ให้เจอ</span><span id="ws-prog"></span></span>
        <span class="ws-grade"></span></div>
      <div class="ws-body">
        <div id="ws-words"></div>
        <div class="ws-gridwrap"><div id="ws-grid"></div></div>
      </div>
      <div class="ws-actions">
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
    bindSelect();
  }

  function render(){
    if(!wsGame) return;
    gridEl.style.setProperty('--ws-n', wsGame.size);
    gridEl.innerHTML=wsGame.grid.map((row,r)=>row.map((cell,c)=>
      `<div class="ws-cell${cell.found?' found':''}" data-r="${r}" data-c="${c}"${cell.found?` style="--zi:${cell.zi||0}"`:''}>${cell.ch}</div>`).join('')).join('');
    wordsEl.innerHTML=wsGame.words.map((w,i)=>
      `<span class="ws-word${w.found?' got':''}" data-i="${i}">${w.w}<small>${(typeof escapeHTML==='function')?escapeHTML(w.th):w.th}</small></span>`).join('');
    updateProg();
    overlay.querySelector('.ws-grade').textContent='ระดับชั้น '+grade();
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
  function win(){
    wsGame.done=true; saveTemp();
    winEl.innerHTML=`<div class="ws-win-in">🎉 เก่งมาก! เจอครบทุกคำแล้ว<br><small>กด 🎲 สุ่มเกมใหม่ เล่นต่อได้เลย</small></div>`;
    winEl.classList.add('on');
    if(typeof sfx!=='undefined'&&sfx.win)sfx.win(); else if(typeof sfx!=='undefined'&&sfx.coin)sfx.coin();
    setTimeout(()=>winEl.classList.remove('on'), 2600);
  }

  /* ---------- เปิด/เก็บ/ล้าง ---------- */
  function saveTemp(){ if(typeof state==='undefined')return; state.wordSearch=wsGame; if(typeof saveState==='function')saveState(); }
  function newGame(){ winEl.classList.remove('on'); wsGame=generate(); render(); saveTemp(); }
  function open(){
    if(!overlay) build();
    if(!wsGame){ wsGame=(typeof state!=='undefined'&&state.wordSearch)?state.wordSearch:null; }
    if(!wsGame) wsGame=generate();
    render();
    overlay.style.display='flex';
    void boardEl.offsetWidth;                 // reflow เพื่อให้ transition เลื่อนเข้าเห็นชัด
    boardEl.classList.add('open');
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
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindRail); else bindRail();

  window.WordSearch={ open, _t:{ get game(){return wsGame;}, generate, pool, takeWords, commit, lineCells } };
})();
