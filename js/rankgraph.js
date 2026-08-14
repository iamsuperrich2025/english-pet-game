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
    const W=1400,H=500,L=54,R=28,T=62,B=42;
    const max=Math.max(1,rows[0].val), innerW=W-L-R, innerH=H-T-B;
    const x=i=>L+(rows.length===1?innerW/2:i*innerW/(rows.length-1));
    const y=v=>T+(1-v/max)*innerH;
    const pts=rows.map((r,i)=>`${x(i).toFixed(1)},${y(r.val).toFixed(1)}`).join(' ');
    const grid=[0,.25,.5,.75,1].map(p=>{
      const yy=(T+innerH*(1-p)).toFixed(1);
      return `<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}"/><text x="${L-8}" y="${+yy+4}" text-anchor="end">${esc(fmt(max*p))}</text>`;
    }).join('');
    const dots=rows.map((r,i)=>{
      const xx=x(i), yy=y(r.val), above=i%2===0, ly=above?Math.max(16,yy-12):Math.min(H-8,yy+18);
      return `<g class="rg-point" tabindex="0" role="img" aria-label="อันดับ ${i+1} ${esc(r.name)} ${esc(fmt(r.val))}">
        <line class="rg-stem" x1="${xx}" y1="${yy}" x2="${xx}" y2="${above?ly+3:ly-11}"/>
        <circle cx="${xx}" cy="${yy}" r="6"/><text class="rg-name" x="${xx}" y="${ly}" text-anchor="middle">${esc(r.name)}</text>
        <text class="rg-rank" x="${xx}" y="${H-12}" text-anchor="middle">${i+1}</text>
        <title>อันดับ ${i+1} · ${esc(r.name)} · ${esc(fmt(r.val))}</title></g>`;
    }).join('');
    return `<div class="rg-chart-head"><b style="color:${cat.color}">${cat.icon} ${esc(cat.label)} · Top ${TOP}</b><span>แตะ/ชี้จุดเพื่อดูชื่อและคะแนน</span></div>
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
