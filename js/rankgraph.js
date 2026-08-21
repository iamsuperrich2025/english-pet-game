/* ============================================================
   📈 กราฟอันดับ Top 30 — โหลด snapshot เมื่อเปิดเท่านั้น
   แต่ละหมวดใช้สีประจำตัวไม่ซ้ำ และชื่อผู้เล่นติดอยู่กับทุกจุด
   ============================================================ */
(function(){
  'use strict';

  const TOP = 30;
  const CACHE_MS = 2 * 60 * 1000;
  const CATS = [
    {key:'coins',  icon:'🪙', label:'เหรียญ',        color:'#0072b2', score:v=>v.coins},
    {key:'assets', icon:'🏆', label:'ทรัพย์สินรวม', color:'#e69f00', score:v=>v.av},
    {key:'online', icon:'🌐', label:'เหรียญออนไลน์',color:'#009e73', score:v=>v.oe},
    {key:'badges', icon:'🏅', label:'เข็ม',          color:'#cc79a7', score:v=>typeof badgeScore==='function'?badgeScore(v.n||''):0},
    {key:'boss',   icon:'🤖', label:'ล้มบอส',       color:'#d55e00', score:v=>v.bk},
    {key:'ws',     icon:'🔎', label:'ค้นหาคำ',      color:'#56b4e9', score:v=>v.ws},
    {key:'pm',     icon:'🖼️', label:'จับคู่ภาพ',    color:'#7b61c9', score:v=>v.pm},
    {key:'tp',     icon:'⌨️', label:'พิมพ์คำ',      color:'#8a6d00', score:v=>v.tw},
    {key:'bb',     icon:'🫧', label:'ฟอง',           color:'#00a6a6', score:v=>v.bb},
    {key:'sg',     icon:'🎯', label:'ยิงเป้าคำ',    color:'#a23b72', score:v=>v.sg}
  ];
  let selected = 'coins';
  let cache = null;
  let cacheAt = 0;

  function esc(v){
    if(typeof escapeHTML === 'function') return escapeHTML(String(v == null ? '' : v));
    return String(v == null ? '' : v).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function fmt(v){ return typeof fmtNum === 'function' ? fmtNum(v) : Math.round(v||0).toLocaleString(); }
  function cleanName(v){
    const raw = String(v || 'ผู้เล่น');
    return typeof splitNameBadges === 'function' ? (splitNameBadges(raw).name || 'ผู้เล่น') : raw;
  }
  function demoPlayers(){
    const names=['ข้าวปั้น','ฟ้าใส','น้องต้นกล้า','มังกรน้อย','เจ้าเหมียว','ใบหม่อน','ปลาวาฬ','สายรุ้ง','ขนมปัง','ภูผา'];
    return Array.from({length:38},(_,i)=>({id:'rg'+i,n:names[i%names.length]+(i>9?String(i+1):''),g:'',coins:99000-i*2100,av:180000-i*3300,
      oe:60000-i*1050,bk:900-i*18,ws:50000-i*900,pm:42000-i*760,tw:3100-i*55,bb:37000-i*650,sg:46000-i*810}));
  }
  function rowsFrom(players, cat){
    return players.map(v=>({uid:v.id||'',name:cleanName(v.n),g:v.g||'',val:Math.max(0,Math.round(Number(cat.score(v))||0))}))
      .filter(r=>r.val>0).sort((a,b)=>b.val-a.val || a.name.localeCompare(b.name,'th')).slice(0,TOP);
  }
  function loadAll(force){
    if(!force && cache && Date.now()-cacheAt<CACHE_MS) return Promise.resolve(cache);
    if(window.__RANK_GRAPH_DEMO){ cache=demoPlayers(); cacheAt=Date.now(); return Promise.resolve(cache); }
    if(typeof Online==='undefined' || !Online.ready || !Online.db) return Promise.reject(new Error('offline'));
    return Online.db.ref('leaderboard').get().then(snap=>{
      const out=[];
      snap.forEach(ch=>{
        const v=ch.val();
        if(!v || typeof v.n!=='string') return;
        if(typeof rankUserExcluded==='function' && rankUserExcluded(ch.key,v.n)) return;
        out.push(Object.assign({id:ch.key},v));
      });
      /* เจ้าของบัญชีใช้ state สดเหมือนกระดานอันดับหลัก ไม่รอ snapshot Firebase รอบถัดไป */
      const myId=typeof onlineKey==='function'?onlineKey():'';
      if(myId && typeof state!=='undefined' && state.student && !(typeof isTester==='function'&&isTester())){
        const mine={id:myId,n:(state.profileName||state.student.first||'ผู้เล่น')+(typeof badgeSuffix==='function'?badgeSuffix():''),g:state.student.grade||'',
          coins:Math.round(state.coins||0),av:Math.round(typeof assetValue==='function'?assetValue():0),oe:Math.round(state.onlineEarned||0),
          bk:Math.round(state.mechaBoss||0),ws:Math.round(state.wsScore||0),pm:Math.round(state.pmScore||0),tw:Math.round(state.tpWords||0),
          bb:Math.round(state.bbScore||0),sg:Math.round(state.sgScore||0)};
        const at=out.findIndex(v=>v.id===myId); if(at>=0) out[at]=Object.assign({},out[at],mine); else out.push(mine);
      }
      cache=out; cacheAt=Date.now(); return out;
    });
  }
  function tabsHTML(players){
    return CATS.map(cat=>{
      const n=rowsFrom(players,cat).length;
      return `<button class="rg-tab${cat.key===selected?' active':''}" data-rg-cat="${cat.key}" style="--rg-c:${cat.color}">
        <i></i>${cat.icon} ${esc(cat.label)} <small>${n}</small></button>`;
    }).join('');
  }
  function chartHTML(players){
    const cat=CATS.find(c=>c.key===selected)||CATS[0];
    const rows=rowsFrom(players,cat);
    if(!rows.length) return `<div class="rg-empty">${cat.icon} หมวดนี้ยังไม่มีคะแนน — มาเป็นคนแรกบนกราฟกัน!</div>`;
    /* กราฟแนวนอนแบบหนึ่งผู้เล่นต่อหนึ่งแถว: ตัวอักษรใหญ่ได้จริงทุกจอ และเลื่อนเฉพาะขึ้นลง */
    const W=1000,ROW=50,T=20,B=26,L=245,R=125,H=T+B+rows.length*ROW;
    const max=Math.max(1,rows[0].val), innerW=W-L-R;
    const x=v=>L+(v/max)*innerW;
    const y=i=>T+i*ROW+ROW/2;
    const pts=rows.map((r,i)=>`${x(r.val).toFixed(1)},${y(i).toFixed(1)}`).join(' ');
    const grid=[0,.25,.5,.75,1].map(p=>{
      const xx=(L+innerW*p).toFixed(1);
      return `<line x1="${xx}" y1="${T}" x2="${xx}" y2="${H-B}"/><text x="${xx}" y="${H-2}" text-anchor="middle">${esc(fmt(max*p))}</text>`;
    }).join('');
    const dots=rows.map((r,i)=>{
      const xx=x(r.val), yy=y(i);
      return `<g class="rg-point" tabindex="0" role="img" aria-label="อันดับ ${i+1} ${esc(r.name)} ${esc(fmt(r.val))}">
        <text class="rg-rank" x="18" y="${yy+6}">${i+1}</text>
        <text class="rg-name" x="66" y="${yy+6}">${esc(r.name)}</text>
        <line class="rg-bar" x1="${L}" y1="${yy}" x2="${xx}" y2="${yy}"/>
        <circle cx="${xx}" cy="${yy}" r="7"/><text class="rg-score" x="${Math.min(W-R+12,xx+15)}" y="${yy+6}">${esc(fmt(r.val))}</text>
        <title>อันดับ ${i+1} · ${esc(r.name)} · ${esc(fmt(r.val))}</title></g>`;
    }).join('');
    return `<div class="rg-chart-head"><b style="color:${cat.color}">${cat.icon} ${esc(cat.label)} · Top ${rows.length}</b><span>เลื่อนขึ้นลงเพื่อดูผู้เล่นทั้งหมด</span></div>
      <svg class="rg-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="กราฟอันดับ Top ${TOP} หมวด${esc(cat.label)}" style="--rg-c:${cat.color}">
        <g class="rg-grid">${grid}</g><polyline class="rg-line" points="${pts}"/>${dots}
      </svg>`;
  }
  function bind(box,players){
    box.querySelectorAll('[data-rg-cat]').forEach(b=>b.addEventListener('click',()=>{
      selected=b.dataset.rgCat;
      if(typeof sfx!=='undefined' && sfx.click) sfx.click();
      box.querySelector('.rg-tabs').innerHTML=tabsHTML(players);
      box.querySelector('.rg-stage').innerHTML=chartHTML(players);
      bind(box,players);
    }));
  }
  function openRankGraph(){
    document.querySelectorAll('.rg-overlay').forEach(o=>o.remove());
    const ov=document.createElement('div'); ov.className='rg-overlay';
    ov.innerHTML=`<section class="rg-box" role="dialog" aria-modal="true" aria-labelledby="rg-title">
      <header><h2 id="rg-title">📈 กราฟอันดับผู้เล่น</h2><p>Top 30 ของแต่ละหมวดคะแนนหลัก</p><button class="rg-close" aria-label="ปิดกราฟ">✕ ปิด</button></header>
      <div class="rg-tabs" aria-label="เลือกหมวดกราฟ"></div>
      <div class="rg-stage"><div class="rg-loading"><b>กำลังโหลดอันดับ…</b><span>รวบรวมคะแนนล่าสุดจากทุกหมวด</span></div></div>
      <footer>สอบใหญ่และข้อสอบมาตรฐานมีหลายชุดย่อย จึงดูกราฟ/อันดับแยกชุดได้จากแท็บเดิม</footer>
    </section>`;
    const close=()=>{ ov.remove(); document.removeEventListener('keydown',onKey); };
    const onKey=e=>{ if(e.key==='Escape') close(); };
    ov.querySelector('.rg-close').addEventListener('click',close);
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
    document.addEventListener('keydown',onKey);
    document.body.appendChild(ov);
    loadAll(false).then(players=>{
      if(!ov.isConnected) return;
      ov.querySelector('.rg-tabs').innerHTML=tabsHTML(players);
      ov.querySelector('.rg-stage').innerHTML=chartHTML(players);
      bind(ov.querySelector('.rg-box'),players);
    }).catch(()=>{
      if(!ov.isConnected) return;
      ov.querySelector('.rg-stage').innerHTML=`<div class="rg-empty">📡 ยังโหลดกราฟไม่ได้<br><small>เชื่อมต่ออินเทอร์เน็ตแล้วกด “ลองอีกครั้ง”</small><button class="rg-retry">ลองอีกครั้ง</button></div>`;
      ov.querySelector('.rg-retry').addEventListener('click',()=>{ close(); openRankGraph(); });
    });
    if(typeof sfx!=='undefined' && sfx.select) sfx.select();
  }
  window.openRankGraph=openRankGraph;
  window.__rankGraph={cats:CATS,rowsFrom,open:openRankGraph};
  try{
    if(/[?&]rgdemo(?:=1)?(?:&|$)/.test(location.search)){
      window.__RANK_GRAPH_DEMO=true;
      window.addEventListener('load',()=>setTimeout(openRankGraph,350));
    }
  }catch(e){}
})();
