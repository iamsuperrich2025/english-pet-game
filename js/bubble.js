"use strict";
/* ============================================================
   🫧 bubble.js — เกมแตะฟองสะกดคำ
   - ฟอง 1 ใบต่อ 1 ตัวอักษร: คำที่มีตัวซ้ำจะมีฟองซ้ำครบจำนวน
   - สุ่มตำแหน่งใหม่ทุกคำ โดยไม่ซ้อนกัน และไม่เรืองแสงใบ้ฟองที่ต้องกด
   - คลังคำตามระดับชั้น คำไม่ซ้ำจนครบคลัง
   - คะแนนสะสมตลอดกาล state.bbScore → /leaderboard.bb → Top 10 + js/bbaward.js
   ============================================================ */
(function(){
  const COIN_PER_WORD=5, PT_PER_BUBBLE=2, PERFECT_BONUS=5;
  const MINLEN=2, MAXLEN=14;
  let overlay=null, boardEl=null, stageEl=null, wordEl=null, thaiEl=null, statEl=null, fxEl=null;
  const GRADE_POOL_SIZE=500;
  const GRADE_SPECS={
    'ต่ำกว่าประถมศึกษา':{bands:[1,2],pos:0},'ป.1':{bands:[1,2],pos:0},'ป.2':{bands:[1,2],pos:1},
    'ป.3':{bands:[2,3],pos:0},'ป.4':{bands:[2,3],pos:1},'ป.5':{bands:[3,4],pos:0},'ป.6':{bands:[3,4],pos:1},
    'ม.1':{bands:[4,5],pos:0},'ม.2':{bands:[4,5],pos:.5},'ม.3':{bands:[4,5],pos:1},
    'ม.4':{bands:[5,4],pos:0},'ม.5':{bands:[5,4],pos:.5},'ม.6':{bands:[5,4],pos:1},
    'ปริญญาตรี':{bands:[5,4],pos:1},'สูงกว่าปริญญาตรี':{bands:[5,4],pos:1}
  };
  let cur=null, queue=[], qGrade=null, locked=false, bubbles=[], gradePools={};

  const grade=()=> (typeof state!=='undefined' && state.student) ? state.student.grade : 'ป.1';
  const shuffle=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  function pool(){
    if(gradePools[grade()]) return gradePools[grade()];
    const seen=new Set(), out=[];
    const src=(typeof vocabForStudent==='function')?vocabForStudent():[];
    src.forEach(pair=>{
      const raw=String(pair[0]||'').trim();
      if(!/^[A-Za-z]+$/.test(raw)) return;
      const w=raw.toUpperCase();
      if(w.length<MINLEN || w.length>MAXLEN || seen.has(w)) return;
      seen.add(w); out.push({w,th:pair[1]||''});
    });
    return out;
  }
  async function prepareGradePool(g=grade()){
    if(gradePools[g]) return gradePools[g];
    const spec=GRADE_SPECS[g]||GRADE_SPECS['ป.1'];
    if(typeof bandLoad!=='function'||typeof bandCat!=='function') return pool();
    await Promise.all(spec.bands.map(b=>bandLoad(b)));
    const seen=new Set(), ranked=[];
    spec.bands.forEach((b,rank)=>{
      const cat=bandCat(b);
      (cat&&cat.words||[]).forEach(pair=>{
        const raw=String(pair[0]||'').trim().toLowerCase(), th=String(pair[1]||'').trim();
        if(!/^[a-z]+$/.test(raw)||raw.length<MINLEN||raw.length>MAXLEN||!th||seen.has(raw))return;
        seen.add(raw); ranked.push({w:raw.toUpperCase(),th,rank,len:raw.length});
      });
    });
    ranked.sort((a,b)=>a.rank-b.rank||a.len-b.len||a.w.localeCompare(b.w));
    const start=Math.round(Math.max(0,ranked.length-GRADE_POOL_SIZE)*spec.pos);
    gradePools[g]=ranked.slice(start,start+GRADE_POOL_SIZE).map(x=>({w:x.w,th:x.th}));
    return gradePools[g];
  }
  function usedSet(){
    if(typeof state==='undefined') return new Set();
    if(!state.bbUsedByGrade||typeof state.bbUsedByGrade!=='object') state.bbUsedByGrade={};
    if(!Array.isArray(state.bbUsedByGrade[grade()])) state.bbUsedByGrade[grade()]=[];
    return new Set(state.bbUsedByGrade[grade()].map(x=>String(x).toUpperCase()));
  }
  function markUsed(w){
    if(typeof state==='undefined') return;
    if(!state.bbUsedByGrade||typeof state.bbUsedByGrade!=='object') state.bbUsedByGrade={};
    if(!Array.isArray(state.bbUsedByGrade[grade()])) state.bbUsedByGrade[grade()]=[];
    if(state.bbUsedByGrade[grade()].indexOf(w)<0) state.bbUsedByGrade[grade()].push(w);
  }
  function refill(announce){
    const all=pool(); if(!all.length){ queue=[]; return false; }
    const used=usedSet(); let left=all.filter(x=>!used.has(x.w));
    if(!left.length){
      if(typeof state!=='undefined'&&state.bbUsedByGrade) state.bbUsedByGrade[grade()]=[];
      left=all.slice();
      if(announce && typeof toast==='function') toast('🎉 แตะฟองครบทุกคำในระดับชั้นแล้ว! เริ่มรอบใหม่');
    }
    queue=shuffle(left); qGrade=grade(); return true;
  }
  function nextWord(){
    if(qGrade!==grade()) queue=[];
    if(!queue.length && !refill(true)){ cur=null; renderWord(); return; }
    const pick=queue.shift();
    cur={w:pick.w,th:pick.th,at:0,miss:0};
    renderWord(); renderBubbles();
  }

  function build(){
    overlay=document.createElement('div'); overlay.id='bb-overlay';
    overlay.innerHTML=`<div id="bb-board">
      <div class="bb-head">
        <span class="bb-title">🫧 ฟองคำศัพท์ · Bubble</span>
        <span class="bb-stat" id="bb-stat"></span>
        <button class="bb-snd" id="bb-snd" type="button" title="เปิด/ปิดเสียงฟอง"><span class="bb-snd-ic">🔊</span><span class="bb-snd-track"><span class="bb-snd-thumb"></span></span></button>
        <button class="bb-close" id="bb-close" type="button" title="ปิดเกม (หรือกด Esc)">✕ ปิดเกม</button>
      </div>
      <div class="bb-prompt">
        <span class="bb-star bb-star-l" aria-hidden="true">⭐</span>
        <div class="bb-word" id="bb-word"></div>
        <span class="bb-star bb-star-r" aria-hidden="true">⭐</span>
        <div class="bb-thai" id="bb-thai"></div>
        <div class="bb-hint">💡 เลือกตัวอักษรให้ถูกต้องเพื่อสร้างคำศัพท์</div>
      </div>
      <div class="bb-stage" id="bb-stage" aria-label="ฟองตัวอักษร"><span class="bb-planet bb-planet-a" aria-hidden="true"></span><span class="bb-planet bb-planet-b" aria-hidden="true"></span></div>
      <div class="bb-tools">
        <button class="bb-tool" id="bb-speak" type="button">🔊 ฟังเสียง</button>
        <button class="bb-tool" id="bb-skip" type="button">⏭ ข้ามคำนี้</button>
      </div>
      <div class="bb-fx" id="bb-fx"></div>
    </div>`;
    document.body.appendChild(overlay);
    boardEl=overlay.querySelector('#bb-board'); stageEl=overlay.querySelector('#bb-stage');
    wordEl=overlay.querySelector('#bb-word'); thaiEl=overlay.querySelector('#bb-thai');
    statEl=overlay.querySelector('#bb-stat'); fxEl=overlay.querySelector('#bb-fx');
    overlay.querySelector('#bb-close').addEventListener('click',close);
    overlay.querySelector('#bb-speak').addEventListener('click',()=>{ if(cur&&typeof speakWord==='function') speakWord(cur.w.toLowerCase()); });
    overlay.querySelector('#bb-skip').addEventListener('click',skip);
    stageEl.addEventListener('pointerdown',e=>{ const b=e.target.closest('.bb-bubble'); if(!b)return; e.preventDefault(); hitBubble(+b.dataset.id,b); });
    statEl.addEventListener('click',e=>{ if(e.target.closest('.bba-open')&&typeof BbAward!=='undefined') BbAward.open(); });
    const snd=overlay.querySelector('#bb-snd');
    const syncSound=()=>{ const on=!(typeof state!=='undefined'&&state.bbSoundOff); snd.classList.toggle('off',!on); snd.querySelector('.bb-snd-ic').textContent=on?'🔊':'🔇'; };
    snd.addEventListener('click',()=>{ if(typeof state!=='undefined'){ state.bbSoundOff=!state.bbSoundOff; if(typeof saveState==='function')saveState(); } syncSound(); });
    syncSound();
    window.addEventListener('resize',()=>{ if(overlay&&overlay.style.display==='flex') layoutBubbles(); });
    document.addEventListener('keydown',e=>{ if(!overlay||overlay.style.display!=='flex')return; if(document.querySelector('.wsa-overlay'))return; if(e.key==='Escape')close(); });
  }

  function renderWord(){
    if(!wordEl)return;
    if(!cur){ wordEl.innerHTML='<span class="bb-empty">ไม่มีคำศัพท์ในระดับชั้นนี้</span>'; thaiEl.textContent=''; stageEl.innerHTML=''; renderStat(); return; }
    wordEl.innerHTML=cur.w.split('').map((ch,i)=>`<span class="bb-ch${i<cur.at?' got':''}">${ch}</span>`).join('');
    thaiEl.textContent=cur.th||''; renderStat();
  }
  function renderLoading(){
    if(!wordEl)return;
    wordEl.innerHTML='<span class="bb-empty">กำลังเตรียมคำศัพท์ 500 คำ...</span>';
    thaiEl.textContent=`คลังคำเฉพาะ ${grade()}`; stageEl.innerHTML=''; renderStat();
  }
  function renderStat(){
    if(!statEl)return; const st=(typeof state!=='undefined')?state:{};
    statEl.innerHTML=`<b>🪙 ${(st.coins||0).toLocaleString()}</b><span class="bb-score bba-open" role="button" tabindex="0" title="ดูอันดับ Top 10 / รางวัลรายเดือน">🏆 ${Math.round(st.bbScore||0).toLocaleString()} คะแนน</span><span>${Math.round(st.bbWords||0).toLocaleString()} คำ · ${grade()}</span>`;
  }
  function renderBubbles(){
    if(!cur||!stageEl)return;
    bubbles=shuffle(cur.w.split('').map((ch,i)=>({id:i,ch,alive:true})));
    const ornaments=['🌸','❄️','🍁','🍀','🌱'];
    stageEl.innerHTML='<span class="bb-planet bb-planet-a" aria-hidden="true"></span><span class="bb-planet bb-planet-b" aria-hidden="true"></span>'+bubbles.map((b,i)=>`<button class="bb-bubble bb-color-${i%5}" data-id="${b.id}" type="button" aria-label="ตัว ${b.ch}"><span>${b.ch}</span><i aria-hidden="true">${ornaments[i%ornaments.length]}</i></button>`).join('');
    requestAnimationFrame(layoutBubbles);
  }
  function layoutBubbles(){
    if(!stageEl||!cur)return;
    const els=[...stageEl.querySelectorAll('.bb-bubble:not(.popped)')]; if(!els.length)return;
    const w=stageEl.clientWidth,h=stageEl.clientHeight,n=els.length; if(w<20||h<20)return;
    const aspect=Math.max(.7,w/Math.max(h,1));
    const cols=Math.max(1,Math.min(n,Math.ceil(Math.sqrt(n*aspect))));
    const rows=Math.ceil(n/cols);
    const d=Math.max(38,Math.min(92,Math.min(w/(cols+.35),h/(rows+.25))*.72));
    const pad=d*.58, min=d+14, pts=[];                 // เผื่อระยะลอยขึ้น-ลงต่างจังหวะ ไม่ให้วงฟองชนกันขณะขยับ
    let failed=false;
    for(let idx=0;idx<n;idx++){
      let x=pad,y=pad,ok=false;
      for(let t=0;t<240&&!ok;t++){
        x=pad+Math.random()*Math.max(1,w-pad*2); y=pad+Math.random()*Math.max(1,h-pad*2);
        ok=pts.every(p=>Math.hypot(p.x-x,p.y-y)>=min);
      }
      if(!ok){ failed=true; break; }
      pts.push({x,y});
    }
    /* คำยาว/จอเตี้ยบางครั้งสุ่มแบบอิสระไม่ลงตัว → สุ่มช่อง grid ทั้งชุดใหม่ (ห้ามผสมจุดสุ่มกับ fallback เพราะอาจซ้อนกัน) */
    if(failed){
      pts.length=0; const cw=w/cols,ch=h/rows,slots=shuffle(Array.from({length:n},(_,i)=>i));
      slots.forEach(slot=>{ const c=slot%cols,r=Math.floor(slot/cols);
        pts.push({x:(c+.5)*cw+(Math.random()-.5)*Math.max(0,cw-d)*.22,
                  y:(r+.5)*ch+(Math.random()-.5)*Math.max(0,ch-d)*.22}); });
    }
    els.forEach((el,idx)=>{
      const {x,y}=pts[idx]; el.style.setProperty('--bb-size',d.toFixed(1)+'px');
      el.style.left=x.toFixed(1)+'px'; el.style.top=y.toFixed(1)+'px';
      el.style.setProperty('--bb-drift',(Math.random()*2.2+2).toFixed(2)+'s');
      el.style.setProperty('--bb-delay',(-Math.random()*2).toFixed(2)+'s');
    });
  }

  function bubbleSound(size){
    if(typeof state!=='undefined'&&state.bbSoundOff)return;
    if(typeof sfx!=='undefined'&&sfx.bubblePop)sfx.bubblePop(size);
  }
  function hitBubble(id,el){
    if(locked||!cur||!el||el.classList.contains('popped'))return;
    const item=bubbles.find(b=>b.id===id); if(!item||!item.alive)return;
    const want=cur.w[cur.at];
    if(item.ch!==want){
      cur.miss++; el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong');
      if(typeof sfx!=='undefined'&&sfx.bubbleTap&&!(typeof state!=='undefined'&&state.bbSoundOff))sfx.bubbleTap();
      return;
    }
    item.alive=false; cur.at++; el.classList.add('popped'); bubbleSound(parseFloat(getComputedStyle(el).width)||60);
    renderWord(); setTimeout(()=>el.remove(),360);
    if(cur.at>=cur.w.length) finishWord();
  }
  function wordPoints(word,miss){ return word.length*PT_PER_BUBBLE+(miss?0:PERFECT_BONUS); }
  function skip(){ if(locked||!cur)return; nextWord(); }
  function finishWord(){
    locked=true; const w=cur.w,th=cur.th,pts=wordPoints(w,cur.miss),perfect=!cur.miss;
    markUsed(w); if(typeof addCoins==='function')addCoins(COIN_PER_WORD);
    if(typeof state!=='undefined'){ state.bbScore=Math.round((state.bbScore||0)+pts); state.bbWords=(state.bbWords||0)+1; }
    if(typeof onlinePushScore==='function')onlinePushScore();
    if(typeof vbRecord==='function')vbRecord(w,th,true);
    if(typeof saveState==='function')saveState();
    if(typeof sfx!=='undefined'){ if(sfx.coinGetTier)sfx.coinGetTier(1); else if(sfx.coinGet)sfx.coinGet(); }
    if(typeof speakWord==='function')speakWord(w.toLowerCase());
    if(fxEl&&!document.documentElement.classList.contains('no-anim')){
      const p=document.createElement('div'); p.className='bb-coinpop';
      p.innerHTML=`+${COIN_PER_WORD} 🪙 <span>+${pts} คะแนน${perfect?' ✨ ไม่พลาดเลย!':''}</span>`;
      fxEl.appendChild(p); setTimeout(()=>p.remove(),1400);
    }
    renderStat(); wordEl.classList.add('done');
    setTimeout(()=>{ wordEl.classList.remove('done'); locked=false; nextWord(); },820);
  }

  async function open(){
    if(typeof TypeGame!=='undefined'&&TypeGame.close)TypeGame.close();
    if(!overlay)build(); overlay.style.display='flex'; void boardEl.offsetWidth; boardEl.classList.add('open');
    locked=true; if(!gradePools[grade()]){ renderLoading(); await prepareGradePool(); }
    if(!overlay||overlay.style.display!=='flex')return;
    locked=false; if(qGrade!==grade())queue=[];
    if(!cur||cur.at>=cur.w.length)nextWord(); else{ renderWord(); renderBubbles(); }
    requestAnimationFrame(layoutBubbles); if(typeof sfx!=='undefined'&&sfx.select)sfx.select();
  }
  function close(){
    if(!overlay)return; boardEl.classList.remove('open'); if(typeof saveState==='function')saveState();
    setTimeout(()=>{ overlay.style.display='none'; if(typeof renderDashboard==='function')renderDashboard(); },300);
  }
  function bindRail(){ const b=document.getElementById('btn-rail-bubble'); if(b)b.addEventListener('click',()=>{ if(typeof closePanel==='function')closePanel(); open(); }); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindRail); else bindRail();

  window.BubbleGame={open,close,_t:{pool,prepareGradePool,refill,nextWord,layoutBubbles,hitBubble,skip,usedSet,markUsed,wordPoints,
    get cur(){return cur;},get bubbles(){return bubbles;},get locked(){return locked;},set locked(v){locked=!!v;},
    get overlay(){return overlay;},get stage(){return stageEl;},get gradePools(){return gradePools;},GRADE_POOL_SIZE,COIN_PER_WORD,PT_PER_BUBBLE,PERFECT_BONUS}};
})();
