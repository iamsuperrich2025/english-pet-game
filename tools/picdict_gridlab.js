/* ============================================================
   🔬 picdict_gridlab.js — เครื่องมือ "อบกริดการ์ด" หนังสือ Picture Dictionary (รอบ 1005)
   ------------------------------------------------------------
   ทำไมต้องอบล่วงหน้า: แผ่นโปสเตอร์แบ่งช่องไม่เท่ากัน + มีร่องปลอม 3 ตระกูล
   (รูป↔ป้ายอังกฤษ↔ป้ายไทย↔การ์ดถัดไป) คาบซ้ำกันเป๊ะ — ตรวจจับสดตอนรันไทม์
   เฟสหลุดได้หลายแบบ (บทเรียนรอบ 1003/1005 พลาดมาแล้ว 3 รอบ) · แผ่นมีแค่ 46 ใบ
   และไม่เปลี่ยน จึงคำนวณครั้งเดียวที่นี่ ตรวจด้วยตา แล้วฝังผลลง
   js/data/picdict_grid.js ให้เกมเปิดตารางอย่างเดียว

   วิธีใช้ (ใน preview ที่เปิดเกม + mock login แล้ว):
   1) eval ไฟล์นี้ทั้งไฟล์ในแท็บเกม (fetch('tools/picdict_gridlab.js').then(r=>r.text()).then(eval))
   2) const R = await GridLab.bakeAll()        — คำนวณทุกแผ่น + คะแนน judge
   3) GridLab.report(R)                        — ตารางสรุป แผ่นไหนคะแนนต่ำให้ดูภาพ
   4) await GridLab.strip(R,'FarmAnimals.png',[2,6]) — เซฟภาพ strip+กรอบไว้ดูด้วยตา
   5) GridLab.exportJs(R)                      — คืนซอร์ส js/data/picdict_grid.js (ก๊อปไปเขียนไฟล์)

   หลักการ:
   · แถว: โปรไฟล์พื้นหลังเต็มกว้าง → DP เลือกเส้นให้แถวสูงใกล้กัน (หลายเกณฑ์)
     + เวอร์ชัน "ซ่อมเฟส" (เลื่อนเส้นลงหลังกลุ่มป้าย ด้วยเกณฑ์หมึก 2 แบบ 0.93/0.96)
   · คอลัมน์: แยกทีละแถว (แถวสุดท้ายจัดกึ่งกลางได้) + เส้นเสมือนเมื่อการ์ดชิดกัน
   · เลือกชุดที่ "judge" ให้คะแนนดีสุด — judge เลียนแบบตาคน: การ์ดถูก = รูปก้อนใหญ่
     + มีป้ายใต้รูป "ภายในช่อง" · เฟสผิด = แถบป้ายบางโผล่หัวช่องแทน
     (สอบเทียบแล้ว: แผ่นถูก 0–2% ผิด 25–53%)
   ============================================================ */
window.GridLab = (function(){
  const FILES = () => Object.keys(PICDICT_WORDS);
  const cv = document.createElement('canvas');

  async function loadSheet(file){
    const im = new Image();
    await new Promise((res, rej) => { im.onload = res; im.onerror = rej;
      im.src = 'img/matching/web/' + encodeURIComponent(file.replace(/\.png$/i,'')) + '.webp'; });
    const iw = im.naturalWidth, ih = im.naturalHeight;
    cv.width = iw; cv.height = ih;
    const ctx = cv.getContext('2d', {willReadFrequently:true});
    ctx.clearRect(0,0,iw,ih); ctx.drawImage(im,0,0);
    const d = ctx.getImageData(0,0,iw,ih).data;
    const bgAt = (x,y) => { const i=(y*iw+x)*4; return d[i]>240 && d[i+1]>240 && d[i+2]>240; };
    return {im, iw, ih, bgAt};
  }

  /* ---- DP แกนเดียว (สำเนาตรรกะเกมรอบ 1005 — เกมจะเลิกใช้ ย้ายมาอยู่นี่ถาวร) ---- */
  function dpPick(cand, top, bot, need){
    const hEst=(bot-top)/need, lo=hEst*0.45, hi=hEst*2.0, INF=1e18, PEN=hEst*hEst;
    const cs=cand.filter(c=>c.v>top+2 && c.v<bot-2);
    for(let k=1;k<need;k++){
      const v=top+hEst*k;
      if(!cs.some(c=>Math.abs(c.v-v)<hEst*0.3)) cs.push({v, pen:PEN});
    }
    cs.sort((a,b)=>a.v-b.v);
    const K=need-1, n=cs.length;
    if(K===0) return [top,bot];
    if(n<K) return null;
    const cost=(a,b)=>{const h=b-a; return (h<lo||h>hi)?INF:(h-hEst)*(h-hEst);};
    let prev=cs.map(c=>{const x=cost(top,c.v); return x>=INF?INF:x+(c.pen||0);});
    const layers=[];
    for(let k=1;k<K;k++){
      const cur=new Array(n).fill(INF), pick=new Array(n).fill(-1);
      for(let i=0;i<n;i++) for(let j=0;j<i;j++){
        if(prev[j]>=INF) continue;
        const st=cost(cs[j].v,cs[i].v);
        if(st>=INF) continue;
        const c=prev[j]+st+(cs[i].pen||0);
        if(c<cur[i]){cur[i]=c;pick[i]=j;}
      }
      layers.push(pick); prev=cur;
    }
    let best=INF, bi=-1;
    for(let i=0;i<n;i++){
      if(prev[i]>=INF) continue;
      const st=cost(cs[i].v,bot);
      if(st>=INF) continue;
      if(prev[i]+st<best){best=prev[i]+st;bi=i;}
    }
    if(bi<0) return null;
    const idx=[bi];
    for(let k=layers.length-1;k>=0;k--) idx.unshift(layers[k][idx[0]]);
    if(idx.filter(i=>cs[i].pen).length > Math.max(1, Math.floor(need*0.25))) return null;
    return [top, ...idx.map(i=>cs[i].v), bot];
  }
  function axisSolutions(profile, len, need){
    const sols=[], seen=new Set();
    for(const th of [0.985,0.97,0.95,0.92,0.88]) for(const mw of [3,2]){
      let top=0; while(top<len && profile[top]>=th) top++;
      let bot=len-1; while(bot>=0 && profile[bot]>=th) bot--;
      if(bot-top<need*8) continue;
      const cand=[]; let st=-1;
      for(let i=top;i<=bot;i++){
        const g=profile[i]>=th;
        if(g&&st<0)st=i;
        if(!g&&st>=0){ if(i-st>=mw) cand.push({v:(st+i-1)/2}); st=-1; }
      }
      const b=dpPick(cand, top, bot, need);
      if(!b) continue;
      const key=b.map(v=>Math.round(v)).join(',');
      if(seen.has(key)) continue;
      seen.add(key);
      sols.push(b.map((v,i)=>i===0?Math.max(0,v-2):(i===b.length-1?Math.min(len,v+3):v)));
    }
    return sols;
  }
  /* เลื่อนเส้นลงหลังกลุ่มแถบป้าย (inkTh = เกณฑ์นับหมึก — ป้ายจาง/เข้มต่างกันต่อแผ่น จึงลองหลายค่า) */
  function phaseFix(ys, rowBg, ih, inkTh){
    const fixed=ys.slice();
    for(let k=1;k<fixed.length-1;k++){
      const rowH=fixed[k+1]-fixed[k];
      const end=Math.min(ih, Math.round(fixed[k]+rowH*0.95));
      const bands=[]; let st=-1;
      for(let y=Math.round(fixed[k]); y<end; y++){
        const has=rowBg[y]<inkTh;
        if(has&&st<0)st=y;
        if(!has&&st>=0){ bands.push([st,y-1]); st=-1; }
      }
      if(st>=0) bands.push([st,end-1]);
      const big=bands.findIndex(b=>b[1]-b[0]>rowH*0.28);
      if(big>0 && bands[big][0]-fixed[k]<rowH*0.65)
        fixed[k]=(bands[big-1][1]+bands[big][0])/2;
    }
    return fixed;
  }

  /* ---- สร้างช่องจากชุดเส้นแถว: คอลัมน์แยกทีละแถว + บีบขอบแถวเข้าหาการ์ด ---- */
  function buildCells(S, ys, cols, wordsN){
    const {iw, ih, bgAt} = S;
    const rows = ys.length-1;
    const cells = new Array(wordsN);
    for(let r=0;r<rows;r++){
      const k = Math.min(cols, wordsN - r*cols);
      if(k <= 0) break;
      const y0=Math.round(ys[r]), y1=Math.round(ys[r+1]);
      const colBg=new Float64Array(iw);
      for(let x=0;x<iw;x++){
        let b=0;
        for(let y=y0;y<y1;y++) if(bgAt(x,y)) b++;
        colBg[x]=b/(y1-y0);
      }
      const xs = axisSolutions(colBg, iw, k)[0];
      if(!xs) return null;
      for(let c=0;c<k;c++) cells[r*cols+c]={x0:xs[c], x1:xs[c+1], y0:ys[r], y1:ys[r+1], r};
    }
    for(let r=0;r<rows;r++){
      const rc=cells.filter(c=>c&&c.r===r);
      if(!rc.length) continue;
      const y0=Math.round(rc[0].y0), y1=Math.round(rc[0].y1);
      const hasInk=y=>{
        let cnt=0;
        for(const cl of rc){
          const x0=Math.round(cl.x0+(cl.x1-cl.x0)*0.18), x1=Math.round(cl.x1-(cl.x1-cl.x0)*0.18);
          const need=Math.max(2,Math.round((x1-x0)*0.05));
          let ink=0;
          for(let x=x0;x<x1;x++){ if(!bgAt(x,y)&&++ink>=need) break; }
          if(ink>=need) cnt++;
        }
        return cnt/rc.length>=0.6;
      };
      let t=y0; while(t<y1-10 && !hasInk(t)) t++;
      let b=y1-1; while(b>t+10 && !hasInk(b)) b--;
      for(const cl of rc){ cl.y0=Math.max(y0,t-4); cl.y1=Math.min(y1,b+5); }
    }
    return cells.every(Boolean) ? cells : null;
  }

  /* ---- ด่านตรวจ ก.ทุกช่องมีการ์ด + ข.ขอบช่องสะอาด ---- */
  function validate(S, cells){
    const {ih, bgAt} = S;
    let dirty=0;
    for(const cl of cells){
      const y0=Math.round(cl.y0+(cl.y1-cl.y0)*0.12), y1=Math.round(cl.y1-(cl.y1-cl.y0)*0.12);
      const x0=Math.round(cl.x0+(cl.x1-cl.x0)*0.18), x1=Math.round(cl.x1-(cl.x1-cl.x0)*0.18);
      let inkRows=0;
      for(let y=y0;y<y1;y++){ for(let x=x0;x<x1;x++){ if(!bgAt(x,y)){ inkRows++; break; } } }
      if(inkRows<(y1-y0)*0.2) return null;
      let eInk=0,eTot=0;
      for(const yy of [Math.round(cl.y0)+1, Math.round(cl.y0)+2, Math.round(cl.y1)-3, Math.round(cl.y1)-2]){
        if(yy<0||yy>=ih) continue;
        for(let x=x0;x<x1;x+=2){ eTot++; if(!bgAt(x,yy)) eInk++; }
      }
      if(eTot && eInk/eTot>0.25) dirty++;
    }
    return dirty<=cells.length*0.15 ? {dirty} : null;
  }

  /* ---- judge เลียนแบบตาคน (ตัวตัดสินหลัก — สอบเทียบกับภาพจริงแล้ว) ---- */
  function judge(S, cells){
    const {bgAt} = S;
    let bad=0;
    for(const cl of cells){
      const Y0=Math.round(cl.y0), Y1=Math.round(cl.y1);
      const x0=Math.round(cl.x0+(cl.x1-cl.x0)*0.15), x1=Math.round(cl.x1-(cl.x1-cl.x0)*0.15);
      const need=Math.max(2,Math.round((x1-x0)*0.04));
      const bands=[]; let st=-1;
      for(let y=Y0;y<Y1;y++){
        let ink=0; for(let x=x0;x<x1;x++){ if(!bgAt(x,y)&&++ink>=need) break; }
        const has=ink>=need;
        if(has&&st<0)st=y;
        if(!has&&st>=0){ if(y-st>=4) bands.push([st,y-1]); st=-1; }
      }
      if(st>=0&&Y1-st>=4) bands.push([st,Y1-1]);
      if(!bands.length){ bad++; continue; }
      let big=0;
      for(let i=1;i<bands.length;i++) if(bands[i][1]-bands[i][0]>bands[big][1]-bands[big][0]) big=i;
      const bigB=bands[big], H=Y1-Y0;
      const hasBelow=bands.some((b,i)=>i>big);
      const bigSpans=(bigB[1]-bigB[0])>H*0.6;
      const thinAboveTop=bands[0]!==bigB && bands[0][1]-bands[0][0]<H*0.25 && bands[0][0]-Y0<H*0.18;
      if(!(hasBelow||bigSpans) && thinAboveTop) bad++;
    }
    return bad/cells.length;
  }

  /* ---- อบหนึ่งแผ่น: ลองทุกชุด(+ซ่อมเฟส 2 เกณฑ์) เลือก judge ต่ำสุด ---- */
  async function bakeSheet(file){
    const W = PICDICT_WORDS[file];
    const S = await loadSheet(file);
    const {iw, ih, bgAt} = S;
    const rows = Math.ceil(W.words.length/W.cols);
    const rx0=Math.round(iw*0.03), rx1=Math.round(iw*0.97);
    const rowBg=new Float64Array(ih);
    for(let y=0;y<ih;y++){
      let b=0;
      for(let x=rx0;x<rx1;x++) if(bgAt(x,y)) b++;
      rowBg[y]=b/(rx1-rx0);
    }
    const seen=new Set(), sols=[];
    const push=ys=>{ const k=ys.map(v=>Math.round(v)).join(','); if(!seen.has(k)){ seen.add(k); sols.push(ys); } };
    for(const ys of axisSolutions(rowBg, ih, rows)){
      push(ys);
      push(phaseFix(ys, rowBg, ih, 0.93));
      push(phaseFix(ys, rowBg, ih, 0.96));
    }
    let best=null;
    for(const ys of sols){
      const cells=buildCells(S, ys, W.cols, W.words.length);
      if(!cells) continue;
      const v=validate(S, cells);
      if(!v) continue;
      const j=judge(S, cells);
      if(!best || j<best.j || (j===best.j && v.dirty<best.dirty)){
        best={j, dirty:v.dirty, cells};
      }
    }
    if(!best) return {file, ok:false};
    return {file, ok:true, judgeBad:+(best.j*100).toFixed(1), dirty:best.dirty, n:best.cells.length,
            frac:best.cells.map(c=>[+(c.x0/iw).toFixed(4), +(c.y0/ih).toFixed(4),
                                    +(c.x1/iw).toFixed(4), +(c.y1/ih).toFixed(4)])};
  }

  async function bakeAll(){
    const out={};
    for(const f of FILES()){
      try{ out[f]=await bakeSheet(f); }
      catch(e){ out[f]={file:f, ok:false, err:String(e)}; }
    }
    return out;
  }
  function report(R){
    return Object.values(R).map(r=>r.file.replace('.png','')+': '+(r.ok?('bad'+r.judgeBad+'% d'+r.dirty):'FAIL '+(r.err||'')))
      .join('\n');
  }
  /* เซฟภาพ strip คอลัมน์ + กรอบที่อบแล้ว ไว้ตรวจด้วยตา */
  async function strip(R, file, colIdxs){
    const r=R[file];
    if(!r||!r.ok) return 'no-grid';
    const S=await loadSheet(file);
    const {im, iw, ih}=S;
    const W=PICDICT_WORDS[file];
    const scale=0.42;
    const parts=colIdxs.map(ci=>{
      const cc=r.frac.map((f,i)=>({f,i})).filter(o=>o.i%W.cols===ci);
      const x0=Math.max(0,Math.round(cc[0].f[0]*iw)-4), x1=Math.min(iw,Math.round(cc[0].f[2]*iw)+4);
      return {cc,x0,x1};
    });
    const cv2=document.createElement('canvas');
    cv2.width=Math.round((parts.reduce((s,p)=>s+(p.x1-p.x0),0)+10*(parts.length-1))*scale);
    cv2.height=Math.round(ih*scale);
    const ctx=cv2.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,cv2.width,cv2.height);
    let ox=0;
    for(const p of parts){
      ctx.drawImage(im, p.x0,0,p.x1-p.x0,ih, ox*scale,0,(p.x1-p.x0)*scale,ih*scale);
      ctx.strokeStyle='red'; ctx.lineWidth=2; ctx.font='9px sans-serif'; ctx.fillStyle='red';
      for(const o of p.cc){
        ctx.strokeRect((ox+o.f[0]*iw-p.x0)*scale, o.f[1]*ih*scale, (o.f[2]-o.f[0])*iw*scale, (o.f[3]-o.f[1])*ih*scale);
        ctx.fillText(PICDICT_WORDS[file].words[o.i][0], ox*scale+3, o.f[1]*ih*scale+10);
      }
      ox+=(p.x1-p.x0)+10;
    }
    const a=document.createElement('a');
    a.href=cv2.toDataURL('image/png');
    a.download='gridlab_'+file.replace(/\.png$/i,'')+'.png';
    document.body.appendChild(a); a.click(); a.remove();
    return a.download;
  }
  /* คืนซอร์สไฟล์ข้อมูลพร้อมเขียนทับ js/data/picdict_grid.js */
  function exportJs(R){
    const ok=Object.values(R).filter(r=>r.ok);
    const lines=ok.map(r=>JSON.stringify(r.file)+':'+JSON.stringify(r.frac));
    return '"use strict";\n'+
      '/* 📐 picdict_grid.js — กรอบการ์ดรายช่องของแผ่น Picture Dictionary (สัดส่วน 0..1: [x0,y0,x1,y1] เรียงตาม words)\n'+
      '   ⚙️ ไฟล์นี้ "อบ" ด้วย tools/picdict_gridlab.js (รอบ 1005) — ห้ามแก้มือ · แผ่นใหม่ให้รัน GridLab แล้ว export ใหม่\n'+
      '   เหตุที่ต้องอบล่วงหน้า: แผ่นแบ่งช่องไม่เท่ากัน+มีร่องปลอมคาบซ้ำ ตรวจสดตอนรันไทม์เฟสหลุดง่าย (รอบ 1003/1005) */\n'+
      'const PICDICT_GRID = {\n'+lines.join(',\n')+'\n};\n';
  }

  return {bakeAll, bakeSheet, report, strip, exportJs, _internals:{axisSolutions, phaseFix, buildCells, validate, judge}};
})();
'GridLab ready';
