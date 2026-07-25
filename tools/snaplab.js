/* ============================================================
   📸 SnapLab — จับภาพ preview โลก 3D แบบประหยัด token (รอบ 543)
   ไฟล์นี้ไม่ถูกโหลดโดยเกม — ใช้เฉพาะตอนเทสต์ preview
   (เหตุผล: เดิมทุกรอบต้องเขียนโค้ด readPixels→composite→download ใหม่เอง
    + ภาพเต็มความละเอียดเปลือง token ตอนเปิดดู — รวมไว้ที่นี่ทีเดียว)

   ── วิธีใช้ (พิมพ์ใน console/eval ของ preview) ─────────────────────────
   โหลดครั้งเดียวต่อหน้า:
     await (async()=>{const t=await (await fetch('tools/snaplab.js?b='+Date.now())).text();(0,eval)(t);})()

   ⚖️ กติกาเดิมของผู้ใช้ (22 ก.ค. 2026): วัดเป็นตัวเลขได้ → เชื่อตัวเลข ไม่ต้องถ่าย
      ถ่ายเฉพาะเรื่ององค์ประกอบภาพ หรือผลไม่ตรงตัวเลขที่คาด · รวมหลายมุม = ใช้ grid ภาพเดียว

     Snap.shot()                       // ภาพเดี่ยวเฟรมปัจจุบัน ย่อเหลือกว้าง 820px q.5 → Downloads/snap_<เวลา>.jpg
     Snap.shot({name:'a.jpg',w:640})   // คืน {file,kb,w,h} — Read ไฟล์จาก C:\Users\rober\Downloads\<file>
     Snap.grid([                        // 🧩 หลายมุม/หลายสถานะ "ในไฟล์เดียว" (ถูกกว่าเปิดหลายภาพมาก)
       {label:'ท้ายลำ', run:()=>InvasionWorld._t.setExtView(0)},
       {label:'ข้างขวา', run:()=>InvasionWorld._t.setExtView(1)},
     ])                                 // run เป็น async ได้ · หลัง run เดินเฟรมให้เอง (settle)
     Snap.grid(steps,{cols:2,w:960,settle:2,name:'grid.jpg'})
     Snap.step(3)                       // เดินเฟรมเกมเอง (แท็บถูกซ่อน rAF ไม่วิ่ง — ใช้ testkit step)
     Snap.grab()                        // ได้ <canvas> 2D ของเฟรมปัจจุบัน (ต่อยอดวาดเองได้)

   หมายเหตุ: โลกยานแม่ (InvasionWorld) ใช้ได้ทันที · โลกอื่นต้องมี _t.step/_t.stepFrame
   ถ้าไม่มีตัวเดินเฟรม จะคืน warn:'no stepper' และภาพอาจว่าง (readPixels ต้องอยู่ task เดียวกับ render)
   ============================================================ */
window.Snap = (function(){
  const tk = ()=> (window.InvasionWorld&&InvasionWorld._t) || (window.Adventure3D&&Adventure3D._t) || null;
  const stepper = ()=>{ const t=tk(); if(!t) return null;
    if(t.step)      return n=>t.step(1/60,n);
    if(t.stepFrame) return n=>{for(let i=0;i<n;i++)t.stepFrame(1/60);};
    return null; };
  function step(n){ const s=stepper(); if(s) s(n||1); return !!s; }

  /* เฟรมปัจจุบัน → canvas 2D (โครงเดียวกับ GunLab.shot ที่ใช้งานจริงมาแล้ว) */
  function grab(){
    const cv=document.querySelector('canvas');
    const gl=cv.getContext('webgl2')||cv.getContext('webgl');
    const stepped=step(1);
    const W=cv.width,H=cv.height,buf=new Uint8Array(W*H*4);
    gl.readPixels(0,0,W,H,gl.RGBA,gl.UNSIGNED_BYTE,buf);
    const big=document.createElement('canvas'); big.width=W; big.height=H;
    const bx=big.getContext('2d'), img=bx.createImageData(W,H);
    for(let y=0;y<H;y++){ const sy=(H-1-y)*W*4, dy=y*W*4;
      for(let i=0;i<W*4;i++) img.data[dy+i]=buf[sy+i]; }
    bx.putImageData(img,0,0); big._warn = stepped?null:'no stepper';
    return big;
  }

  function save(cnv,name,q){
    const b=cnv.toDataURL('image/jpeg',q).split(',')[1];
    const a=document.createElement('a');
    a.href='data:image/jpeg;base64,'+b; a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    const r={file:name, kb:Math.round(b.length*3/4/1024), w:cnv.width, h:cnv.height};
    if(cnv._warn) r.warn=cnv._warn;
    return r;
  }

  const stamp = ()=>{ const d=new Date();
    return String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+String(d.getSeconds()).padStart(2,'0'); };

  function shot(o){ o=o||{};
    const src=grab(), w=o.w||820;
    const sm=document.createElement('canvas'); sm.width=w; sm.height=Math.round(w*src.height/src.width);
    sm.getContext('2d').drawImage(src,0,0,sm.width,sm.height); sm._warn=src._warn;
    return save(sm, o.name||('snap_'+stamp()+'.jpg'), o.q||.5);
  }

  async function grid(steps,o){ o=o||{};
    const shots=[];
    for(const s of steps){ if(s.run) await s.run(); step(o.settle||2);
      shots.push({label:s.label||'', c:grab()}); }
    const cols=o.cols||(shots.length>4?3:2);
    const rows=Math.ceil(shots.length/cols);
    const cellW=Math.round((o.w||960)/cols);
    const cellH=Math.round(cellW*shots[0].c.height/shots[0].c.width);
    const g=document.createElement('canvas'); g.width=cellW*cols; g.height=cellH*rows;
    const gx=g.getContext('2d'); gx.fillStyle='#000'; gx.fillRect(0,0,g.width,g.height);
    shots.forEach((s,i)=>{ const x=(i%cols)*cellW, y=(i/cols|0)*cellH;
      gx.drawImage(s.c,x,y,cellW,cellH);
      if(s.label){ gx.font='bold 13px sans-serif';
        const tw=gx.measureText(s.label).width;
        gx.fillStyle='rgba(0,0,0,.65)'; gx.fillRect(x,y,tw+12,19);
        gx.fillStyle='#39ff6a'; gx.fillText(s.label,x+6,y+14); } });
    if(shots.some(s=>s.c._warn)) g._warn='no stepper';
    return save(g, o.name||('snapgrid_'+stamp()+'.jpg'), o.q||.5);
  }

  return {shot, grid, grab, step};
})();
