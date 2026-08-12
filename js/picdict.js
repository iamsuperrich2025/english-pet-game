"use strict";
/* ============================================================
   🖼️ Picture Dictionary — single-page card gallery (รอบ 1123)
   ยกเลิกหนังสือกาง 2 หน้า/การพลิกกระดาษ แล้วแสดงการ์ด 18 คำต่อหน้า
   (6 คอลัมน์ × 3 แถว) เพื่อให้ภาพและคำอ่านใหญ่ชัดบนจอเล็ก
   หมวดและชุดคำเดิมมาจาก PICDICT_BOOK / PICDICT_WORDS / PICDICT_GRID
   ============================================================ */
(function(){
  const $ = id => document.getElementById(id);
  const has = f => typeof window[f] === 'function';
  const esc = s => has('escapeHTML') ? escapeHTML(String(s || '')) : String(s || '');
  const PAGE_SIZE = 18;
  const sheetSrc = file => '/img/matching/web/' + encodeURIComponent(file.replace(/\.png$/i,'') + '.webp');
  const sheetOrig = file => '/img/matching/' + encodeURIComponent(file);

  let sec = null;
  const pd = { groups:[], sheets:[], group:0, sheet:0, page:0, total:0 };
  const qz = { on:false, cur:null, wrong:0, lock:false, asked:0, right:0 };
  const swipe = { id:null, x0:0, y0:0, dx:0, active:false, animating:false,
                  lastFollow:0, maxFollow:0, suppressUntil:0 };
  const imageCache = new Map();

  function buildData(){
    if(pd.sheets.length) return;
    const groups = typeof PICDICT_BOOK !== 'undefined' ? PICDICT_BOOK : [];
    pd.groups = groups;
    groups.forEach((group, gi)=>group.sheets.forEach(([file,en,th])=>{
      pd.sheets.push({file,en,th,group:gi,icon:group.icon});
    }));
    pd.total = pd.sheets.length;
  }

  function build(){
    if(sec) return sec;
    sec = document.createElement('section');
    sec.id = 'screen-picdict';
    sec.className = 'screen';
    sec.innerHTML = `
      <div class="pd-toolbar">
        <button class="back-btn" id="pd-back">⬅ กลับ</button>
        <button class="pd-catalog-btn" id="pd-catalog">☰ หมวดคำศัพท์</button>
        <div class="pd-title"><b id="pd-title-th">Picture Dictionary</b><span id="pd-title-en">พจนานุกรมภาพ</span></div>
        <button class="pd-quiz-btn" id="pd-quizbtn">🎧 ครูถามศัพท์</button>
      </div>
      <div class="pd-qbar" id="pd-qbar" hidden>
        <button class="pd-q-replay" id="pd-qreplay">🔊 ฟังอีกที</button>
        <div class="pd-q-ask" id="pd-qask">ครูกำลังอ่านคำ…</div>
        <div class="pd-q-score"><span id="pd-qcoin">0 🪙</span><span id="pd-qcombo">Combo ×0</span></div>
        <button class="pd-q-quit" id="pd-qquit">✕ เลิกถาม</button>
      </div>
      <div class="pd-gallery" id="pd-gallery" aria-live="polite"></div>
      <div class="pd-footer">
        <div class="pd-swipe-hint">↔ ปัดซ้าย–ขวาเพื่อเปลี่ยนหน้า</div>
        <div class="pd-page-info"><b id="pd-page-info"></b><span id="pd-word-range"></span></div>
      </div>
      <div class="pd-catalog" id="pd-catalog-panel" hidden>
        <div class="pd-catalog-card">
          <div class="pd-catalog-head"><b>เลือกหมวดคำศัพท์</b><button id="pd-catalog-close">✕</button></div>
          <div class="pd-catalog-body"><div class="pd-groups" id="pd-groups"></div><div class="pd-sheets" id="pd-sheets"></div></div>
        </div>
      </div>
      <div class="pd-balloon" id="pd-balloon" hidden></div>
      <div class="pd-zoom" id="pd-zoom" hidden>
        <div class="pd-zoom-card" id="pd-zoom-card">
          <button class="pd-zoom-close" id="pd-zoom-close">✕</button>
          <canvas class="pd-zoom-canvas" id="pd-zoom-canvas"></canvas>
          <div class="pd-zoom-label"><b id="pd-zoom-en"></b><span id="pd-zoom-th"></span></div>
          <div class="pd-zoom-listen" id="pd-zoom-listen"><span class="pd-zoom-speaker">🔊</span><span id="pd-zoom-listen-text"></span></div>
          <div class="pd-zoom-reward" id="pd-zoom-reward" hidden><b>+1 🪙</b><span>ฟังจบแล้ว เงินเข้าแล้ว!</span></div>
        </div>
      </div>`;
    const host = $('screen-game') ? $('screen-game').parentNode : document.body;
    host.appendChild(sec);
    $('pd-back').addEventListener('click', exit);
    $('pd-catalog').addEventListener('click', openCatalog);
    $('pd-catalog-close').addEventListener('click', closeCatalog);
    $('pd-catalog-panel').addEventListener('click', e=>{ if(e.target === $('pd-catalog-panel')) closeCatalog(); });
    $('pd-quizbtn').addEventListener('click', qzStart);
    $('pd-qquit').addEventListener('click', ()=>qzStop(true));
    $('pd-qreplay').addEventListener('click', qzReplay);
    $('pd-zoom').addEventListener('click', e=>{ if(e.target === $('pd-zoom') || e.target === $('pd-zoom-close')) closeZoom(); });
    bindSwipe();
    return sec;
  }

  function wordsFor(sheet){
    const entry = typeof PICDICT_WORDS !== 'undefined' && sheet ? PICDICT_WORDS[sheet.file] : null;
    return entry && Array.isArray(entry.words) ? entry.words : [];
  }
  function currentSheet(){ return pd.sheets[pd.sheet] || null; }
  function currentGrid(){
    const sh = currentSheet();
    return sh && typeof PICDICT_GRID !== 'undefined' ? PICDICT_GRID[sh.file] : null;
  }
  function fallbackRect(entry, i){
    const cols = entry.cols || 8, rows = entry.rows || Math.ceil(entry.words.length/cols);
    const pad = entry.pad || [0,0,0,0], x = i%cols, y = Math.floor(i/cols);
    const w = (1-pad[1]/100-pad[3]/100)/cols, h = (1-pad[0]/100-pad[2]/100)/rows;
    return [pad[3]/100+x*w, pad[0]/100+y*h, pad[3]/100+(x+1)*w, pad[0]/100+(y+1)*h];
  }
  function loadSheet(sheet){
    if(imageCache.has(sheet.file)) return imageCache.get(sheet.file);
    const promise = new Promise((resolve,reject)=>{
      const img = new Image();
      img.onload = ()=>resolve(img);
      /* ใช้แผ่น WebP ที่ถูก track/deploy จริง; 1024px กว้างพอสำหรับครอปการ์ด 8 คอลัมน์ */
      img.src = sheetSrc(sheet.file);
      img.onerror = ()=>reject(new Error('image unavailable: '+img.src));
    });
    imageCache.set(sheet.file,promise);
    return promise;
  }

  function drawCard(canvas,img,rect){
    const w = canvas.width = 240, h = canvas.height = 128;
    const rw=(rect[2]-rect[0])*img.naturalWidth, rh=(rect[3]-rect[1])*img.naturalHeight;
    /* ใช้ส่วนภาพด้านบนของการ์ดต้นฉบับ แล้วเขียนชื่อใหม่เป็น DOM ขนาดใหญ่ด้านล่าง */
    const sx=rect[0]*img.naturalWidth+rw*.05, sy=rect[1]*img.naturalHeight+rh*.02;
    const sw=rw*.90, sh=rh*.64;
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h);
    const scale=Math.min(w/sw,h/sh), dw=sw*scale, dh=sh*scale;
    ctx.drawImage(img,sx,sy,sw,sh,(w-dw)/2,(h-dh)/2,dw,dh);
  }

  function paintCards(sheet,entry,gallery,start){
    const grid=currentGrid();
    loadSheet(sheet).then(img=>{
      if(currentSheet()!==sheet || pd.page*PAGE_SIZE!==start) return;
      [...gallery.children].forEach((card,offset)=>{
        const i=start+offset, rect=(grid&&grid[i]) || fallbackRect(entry,i);
        drawCard(card.querySelector('canvas'),img,rect);
      });
    }).catch(err=>{ gallery.classList.add('images-missing'); gallery.dataset.imageError=String(err&&err.message||err); });
  }

  function render(){
    const sheet=currentSheet(), entry=sheet && typeof PICDICT_WORDS !== 'undefined' ? PICDICT_WORDS[sheet.file] : null;
    if(!sheet) return;
    $('pd-title-th').textContent = `${sheet.icon} ${sheet.th}`;
    $('pd-title-en').textContent = sheet.en;
    const words=wordsFor(sheet), pages=Math.max(1,Math.ceil(words.length/PAGE_SIZE));
    pd.page=Math.min(pd.page,pages-1);
    const start=pd.page*PAGE_SIZE, shown=words.slice(start,start+PAGE_SIZE), gallery=$('pd-gallery');
    gallery.innerHTML='';
    if(!shown.length){
      gallery.innerHTML='<div class="pd-empty">หมวดนี้ยังไม่มีข้อมูลคำศัพท์สำหรับแสดงเป็นการ์ด</div>';
    }else{
      shown.forEach(([en,th],offset)=>{
        const index=start+offset, card=document.createElement('button');
        card.className='pd-cell'; card.type='button'; card.dataset.en=en; card.dataset.th=th; card.dataset.index=index;
        card.innerHTML=`<canvas aria-hidden="true"></canvas><b>${esc(en)}</b><span>${esc(th)}</span>`;
        card.addEventListener('click',()=>{ if(performance.now() >= swipe.suppressUntil) sayCell(card,en,th); });
        gallery.appendChild(card);
      });
      /* วาดหลัง DOM ลงจอแล้ว 1 เฟรม: บาง WebView ยกเลิก Image decode ถ้าสร้าง canvas หลายใบ
         ใน task เดียวกับการเปิดหน้าจอ (พบจริงบน preview จอ 812×375) */
      requestAnimationFrame(()=>paintCards(sheet,entry,gallery,start));
    }
    $('pd-page-info').textContent=`หน้า ${pd.page+1} / ${pages}`;
    $('pd-word-range').textContent=words.length ? `คำที่ ${start+1}–${Math.min(start+PAGE_SIZE,words.length)} จาก ${words.length}` : 'ยังไม่มีคำ';
    if(qz.on) setTimeout(qzAsk,120);
  }

  function changePage(dir){
    if(!closeZoom()) return;
    const pages=Math.max(1,Math.ceil(wordsFor(currentSheet()).length/PAGE_SIZE));
    const next=pd.page+dir;
    if(next<0 || next>=pages) return;
    pd.page=next; render();
  }

  const pageCount=()=>Math.max(1,Math.ceil(wordsFor(currentSheet()).length/PAGE_SIZE));
  const canPage=dir=>pd.page+dir>=0 && pd.page+dir<pageCount();

  /* ปล่อยนิ้ว: ลากถึงเกณฑ์ = หน้าเดิมไหลออก แล้วหน้าใหม่ไหลเข้าจากอีกฝั่ง
     ไม่ถึง/สุดรายการ = เด้งกลับอย่างนุ่มนวล */
  function settleSwipe(gallery,dir,dx){
    const go=Math.abs(dx)>=Math.max(46,gallery.clientWidth*.08) && canPage(dir);
    gallery.classList.remove('swiping');
    gallery.classList.add('settling');
    if(!go){
      gallery.style.transform='translateX(0px)';
      setTimeout(()=>gallery.classList.remove('settling'),190);
      return;
    }
    swipe.animating=true;
    const width=gallery.clientWidth;
    gallery.style.transform=`translateX(${dir>0?-width:width}px)`;
    setTimeout(()=>{
      pd.page+=dir;
      render();
      gallery.classList.remove('settling');
      gallery.classList.add('swiping');
      gallery.style.transform=`translateX(${dir>0?width:-width}px)`;
      void gallery.offsetWidth;
      gallery.classList.remove('swiping');
      gallery.classList.add('settling');
      requestAnimationFrame(()=>{ gallery.style.transform='translateX(0px)'; });
      setTimeout(()=>{
        gallery.classList.remove('settling');
        gallery.style.transform='';
        swipe.animating=false;
      },190);
    },170);
  }

  /* ปัดซ้าย = หน้าถัดไป · ปัดขวา = หน้าก่อนหน้า
     แผงทั้งหน้าตามนิ้วแบบ 1:1; ที่ขอบหน้าแรก/สุดท้ายมีแรงต้าน
     ล็อกเมื่อแนวนอนชัดเจน เพื่อไม่ให้การแตะการ์ดหรือขยับนิ้วเล็กน้อยเปลี่ยนหน้า */
  function bindSwipe(){
    const gallery=$('pd-gallery');
    gallery.addEventListener('pointerdown',e=>{
      if(swipe.animating || (e.pointerType==='mouse' && e.button!==0)) return;
      swipe.id=e.pointerId; swipe.x0=e.clientX; swipe.y0=e.clientY; swipe.dx=0; swipe.active=false;
      swipe.lastFollow=0; swipe.maxFollow=0;
    });
    gallery.addEventListener('pointermove',e=>{
      if(swipe.id===null || e.pointerId!==swipe.id) return;
      const dx=e.clientX-swipe.x0, dy=e.clientY-swipe.y0;
      if(!swipe.active){
        if(Math.abs(dx)<12 || Math.abs(dx)<=Math.abs(dy)*1.15) return;
        swipe.active=true;
        try{ gallery.setPointerCapture(e.pointerId); }catch(_){}
      }
      swipe.dx=dx;
      const dir=dx<0?1:-1;
      const follow=canPage(dir) ? dx : dx*.22;  // ขอบรายการ: ยืดได้เล็กน้อยแล้วเด้งกลับ
      swipe.lastFollow=follow; swipe.maxFollow=Math.max(swipe.maxFollow,Math.abs(follow));
      gallery.dataset.followPx=Math.round(follow);
      gallery.style.transform=`translateX(${follow}px)`;
      gallery.classList.add('swiping');
      e.preventDefault();
    });
    const finish=e=>{
      if(swipe.id===null || (e && e.pointerId!==swipe.id)) return;
      const moved=swipe.active, dx=swipe.dx;
      swipe.id=null; swipe.active=false; swipe.dx=0;
      if(!moved) return;
      gallery.dataset.maxFollowPx=Math.round(swipe.maxFollow);
      swipe.suppressUntil=performance.now()+420;
      settleSwipe(gallery,dx<0?1:-1,dx);
    };
    gallery.addEventListener('pointerup',finish);
    gallery.addEventListener('pointercancel',finish);
  }

  function renderCatalog(){
    $('pd-groups').innerHTML=pd.groups.map((g,i)=>`<button class="pd-group${i===pd.group?' on':''}" data-i="${i}">${g.icon}<span>${esc(g.g)}</span></button>`).join('');
    const indices=pd.sheets.map((s,i)=>[s,i]).filter(([s])=>s.group===pd.group);
    $('pd-sheets').innerHTML=indices.map(([s,i])=>`<button class="pd-sheet${i===pd.sheet?' on':''}" data-i="${i}"><b>${esc(s.th)}</b><span>${esc(s.en)}</span></button>`).join('');
    $('pd-groups').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ pd.group=+b.dataset.i; renderCatalog(); }));
    $('pd-sheets').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      pd.sheet=+b.dataset.i; pd.group=currentSheet().group; pd.page=0; closeCatalog(); render();
    }));
  }
  function openCatalog(){ if(qz.on) qzStop(false); renderCatalog(); $('pd-catalog-panel').hidden=false; }
  function closeCatalog(){ $('pd-catalog-panel').hidden=true; }

  let balloonT=0;
  function showBalloon(cell,en,th){
    const b=$('pd-balloon'); if(!b) return;
    b.innerHTML=`🔊 <b>${esc(en)}</b><span>${esc(th)}</span>`; b.hidden=false;
    const r=cell.getBoundingClientRect(); b.style.left=(r.left+r.width/2)+'px'; b.style.top=Math.max(4,r.top-6)+'px';
    clearTimeout(balloonT); balloonT=setTimeout(()=>b.hidden=true,1500);
  }
  function sayCell(cell,en,th){
    if(qz.on){ qzAnswer(cell,en,th); return; }
    showBalloon(cell,en,th); openZoom(cell,en,th); startZoomListen(en);
  }

  let zoomListening=false, zoomSeq=0, rewardT=0;
  const zoomOpen=()=>{ const z=$('pd-zoom'); return !!z&&!z.hidden; };
  function openZoom(cell,en,th){
    const source=cell.querySelector('canvas'), out=$('pd-zoom-canvas'), ctx=out.getContext('2d');
    out.width=480; out.height=256; ctx.clearRect(0,0,out.width,out.height); ctx.drawImage(source,0,0,out.width,out.height);
    $('pd-zoom-en').textContent=en; $('pd-zoom-th').textContent=th;
    $('pd-zoom').hidden=false; requestAnimationFrame(()=>$('pd-zoom').classList.add('show'));
  }
  function zoomUI(mode){
    zoomListening=mode==='listening'; $('pd-zoom').classList.toggle('listening',zoomListening);
    $('pd-zoom-close').disabled=zoomListening;
    $('pd-zoom-listen-text').textContent=mode==='listening'?'กำลังฟัง… ปิดได้เมื่ออ่านจบ':mode==='done'?'✅ ฟังจบแล้ว · ได้รับ 1 เหรียญ':mode==='failed'?'⚠️ เสียงไม่สำเร็จ':'🔇 เปิดเสียงก่อน จึงจะรับเหรียญได้';
    if(mode!=='done'){ clearTimeout(rewardT); $('pd-zoom-reward').hidden=true; }
  }
  function startZoomListen(en){
    const seq=++zoomSeq, canSpeak=has('speakWord')&&typeof state!=='undefined'&&state.sound!==false;
    zoomUI(canSpeak?'listening':'muted'); if(!canSpeak) return;
    speakWord(en,ok=>{
      if(seq!==zoomSeq||!zoomOpen()) return;
      if(!ok){ zoomUI('failed'); return; }
      zoomUI('done'); if(has('addCoins')) addCoins(1); if(has('saveState')) saveState();
      const reward=$('pd-zoom-reward'); reward.hidden=false; reward.classList.add('show');
      if(has('coinFlyFx')) coinFlyFx($('pd-zoom-card'),1);
      clearTimeout(rewardT); rewardT=setTimeout(()=>{ reward.classList.remove('show'); reward.hidden=true; },1650);
    });
  }
  function closeZoom(){
    if(!zoomOpen()) return true;
    if(zoomListening){ $('pd-zoom-card').classList.add('locked-pulse'); setTimeout(()=>$('pd-zoom-card').classList.remove('locked-pulse'),430); return false; }
    zoomSeq++; clearTimeout(rewardT); $('pd-zoom').classList.remove('show','listening'); setTimeout(()=>$('pd-zoom').hidden=true,170); return true;
  }

  const qzCells=()=>[...$('pd-gallery').querySelectorAll('.pd-cell')].filter(c=>c.dataset.en);
  function qzStart(){
    if(qzCells().length<2){ if(has('toast')) toast('หมวดนี้ยังไม่มีคำให้ครูถาม',1800); return; }
    if(qz.on||!closeZoom()) return;
    qz.on=true; qz.asked=0; qz.right=0;
    if(typeof game!=='undefined'){
      game.combo=0; game.sessionCoins=0; game.sessionMatches=0; game.sessMilestone=0; game.beatBestShown=false;
      if(has('rolloverWeekBest')) rolloverWeekBest(); game.prevBest=state.weekBestCoins||0; game.prevAllBest=state.bestSessionCoins||0;
    }
    sec.classList.add('quiz'); $('pd-qbar').hidden=false; $('pd-quizbtn').hidden=true; qzScore();
    if(typeof sfx!=='undefined') sfx.select(); qzAsk();
  }
  function qzStop(summary,onClose){
    if(!qz.on) return false;
    qz.on=false; qz.cur=null; qz.lock=false; sec.classList.remove('quiz'); $('pd-qbar').hidden=true; $('pd-quizbtn').hidden=false;
    qzCells().forEach(c=>c.classList.remove('qz-target','qz-ok','qz-no'));
    const earned=typeof game!=='undefined'?game.sessionCoins:0;
    if(!summary||earned<=0||!has('showSessionSummary')) return false;
    if(has('feedEvent')) feedEvent('coin',`ครูถามศัพท์ในพจนานุกรมภาพ ตอบถูก ${qz.right} คำ ได้ ${has('fmtNum')?fmtNum(earned):earned} เหรียญ 🎧`);
    const isRecord=earned>(game.prevBest||0), allTime=isRecord&&earned>(game.prevAllBest||0);
    showSessionSummary(earned,qz.right,isRecord,allTime,onClose||(()=>{}),qzStart); return true;
  }
  function qzAsk(){
    if(!qz.on) return;
    const cells=qzCells(); if(cells.length<2) return;
    cells.forEach(c=>c.classList.remove('qz-target','qz-ok','qz-no'));
    let pick=cells[Math.floor(Math.random()*cells.length)],guard=0;
    while(qz.cur&&cells.length>1&&pick.dataset.en===qz.cur.en&&guard++<12) pick=cells[Math.floor(Math.random()*cells.length)];
    qz.cur={en:pick.dataset.en,th:pick.dataset.th}; qz.wrong=0; qz.lock=false; qz.asked++;
    $('pd-qask').innerHTML=`👂 คำที่ <b>${qz.asked}</b> — แตะการ์ดที่ครูอ่าน`; setTimeout(qzReplay,220);
  }
  function qzReplay(){ if(qz.on&&qz.cur&&has('speakWord')) speakWord(qz.cur.en); }
  function qzAnswer(cell,en,th){
    if(!qz.cur||qz.lock) return;
    if(en!==qz.cur.en){
      qz.wrong++; if(typeof game!=='undefined') game.combo=0; qzScore();
      cell.classList.remove('qz-no'); void cell.offsetWidth; cell.classList.add('qz-no'); if(typeof sfx!=='undefined') sfx.wrong();
      $('pd-qask').innerHTML=qz.wrong>=2?'💡 คำตอบเรืองอยู่ตรงนั้น — แตะได้เลย':'ยังไม่ใช่นะ ลองอีกครั้ง!';
      if(qz.wrong>=2){ const ans=qzCells().find(c=>c.dataset.en===qz.cur.en); if(ans) ans.classList.add('qz-target'); } else setTimeout(qzReplay,400);
      return;
    }
    qz.lock=true; qz.right++; cell.classList.remove('qz-no'); cell.classList.add('qz-ok');
    if(typeof game!=='undefined'){ game.combo++; game.sessionMatches++; }
    if(typeof state!=='undefined'){ state.totalMatches++; state.pmPairs=(state.pmPairs||0)+1; state.pmScore=Math.round((state.pmScore||0)+2); }
    if(has('questEvent')) questEvent('match'); if(has('vbRecord')) vbRecord(en,th,true);
    const p=has('activePet')?activePet():null; let coins=10,exp=5; const rp=2,notes=[];
    if(p&&p.type==='dragon'&&has('abilityOn')&&abilityOn(p)&&game.combo>=3){ coins*=2; notes.push('🔥ไฟลุก x2'); }
    if(state.phone&&!state.netCut&&typeof PHONE_BONUS!=='undefined'){ coins+=PHONE_BONUS; notes.push(`📱 มือถือ +${PHONE_BONUS}`); }
    if(!p) exp=0; else if(p.sick){ exp=0; notes.push('🤒 ป่วยอยู่ ไม่ได้ EXP'); } else if(p.shape==='strong'&&typeof SHAPE_EXP_BONUS!=='undefined'){ exp+=SHAPE_EXP_BONUS; notes.push(`💪 ล่ำกำยำ +${SHAPE_EXP_BONUS} EXP`); }
    if(has('addCoins')) addCoins(coins); if(has('addSessionCoins')) addSessionCoins(coins); if(has('addRP')) addRP(rp);
    if(has('addCraft')){ const made=addCraft(1); if(made&&has('showCollectReveal')) setTimeout(()=>showCollectReveal(made,null,true),650); }
    if(typeof sfx!=='undefined'){ sfx.correct(); sfx.coin(); }
    if(has('floatFx')) floatFx(`+${coins} 🪙 +${rp} RP${exp>0?` +${exp} EXP`:''}`,'#f2994a');
    if(game.combo>=2&&has('floatFx')) setTimeout(()=>floatFx(`🔥 COMBO ×${game.combo}!`,'#ff6fa7'),250);
    if(notes.length&&has('toast')) setTimeout(()=>toast(notes.join(' · '),1200),500);
    if(exp>0&&has('addExp')) addExp(exp,p); if(has('saveState')) saveState(); qzScore();
    $('pd-qask').innerHTML=`🎉 เก่งมาก! <b>${esc(en)}</b> = ${esc(th)}`; showBalloon(cell,en,th); setTimeout(()=>{ if(qz.on) qzAsk(); },1500);
  }
  function qzScore(){
    const c=typeof game!=='undefined'?game.sessionCoins:0,k=typeof game!=='undefined'?game.combo:0;
    $('pd-qcoin').textContent=(has('fmtNum')?fmtNum(c):c)+' 🪙'; $('pd-qcombo').textContent='Combo ×'+k; $('pd-qcombo').classList.toggle('hot',k>=2);
  }

  function open(){
    build(); buildData(); if(typeof window.bgmDuckForPictureDictionary==='function') window.bgmDuckForPictureDictionary(true);
    if(has('closePanel')) closePanel(); if(has('showScreen')) showScreen('screen-picdict'); render();
  }
  function exit(){
    if(!closeZoom()) return; closeCatalog();
    if(typeof window.bgmDuckForPictureDictionary==='function') window.bgmDuckForPictureDictionary(false);
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    const back=()=>{ if(has('renderDashboard')) renderDashboard(); if(has('showScreen')) showScreen('screen-dashboard'); };
    if(qz.on&&qzStop(true,back)) return; back();
  }
  function openQuiz(){ open(); setTimeout(qzStart,180); }
  function bind(){
    const b=$('btn-picdict'); if(b) b.addEventListener('click',open);
    const q=$('btn-picquiz'); if(q) q.addEventListener('click',openQuiz);
    document.addEventListener('keydown',e=>{
      if(!sec||!sec.classList.contains('active')) return;
      if(e.key==='Escape'){ if(zoomOpen()) closeZoom(); else if(!$('pd-catalog-panel').hidden) closeCatalog(); else exit(); }
      else if(e.key==='ArrowRight') changePage(1); else if(e.key==='ArrowLeft') changePage(-1);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
  window.PicDict={open,openQuiz,exit,_t:{pd,qz,swipe,render,changePage,bindSwipe,settleSwipe,qzStart,qzStop,qzAsk,qzCells,drawCard,buildData}};
})();
