/* ============================================================
   🔧 GunLab — ชุดเครื่องมือ dev สำหรับจูน "ท่าถือปืน" ในโลกยานแม่ (รอบ 457)
   ไฟล์นี้ไม่ถูกโหลดโดยเกม — ใช้เฉพาะตอนเปิด preview เพื่อ "สั่งจูนด้วยคำสั่งสั้น ๆ"
   (เหตุผล: ก่อนหน้านี้ทุกครั้งที่จูน ต้องส่งโค้ดวัดมุม/ค้นหา/จับภาพยาว ๆ เข้าไปใหม่ = เปลือง token มาก)

   ── วิธีใช้ (พิมพ์ใน console/eval ของ preview) ─────────────────────────
   โหลดครั้งเดียวต่อหน้า:
     await (async()=>{const t=await (await fetch('tools/gunlab.js?b='+Date.now())).text();(0,eval)(t);await GunLab.boot();})()
   จูน (ใส่เฉพาะสิ่งที่อยากเปลี่ยน):
     GunLab.tune({deg:5})            // มุมแนวปืนบนจอ (0 = นอนขนานพื้น · เลขมาก = ตั้งชัน)
     GunLab.tune({s:1.5, deg:5})     // ขยายปืน + คงมุม
     GunLab.tune({z:-1.1, s:1.6})    // ดันไปข้างหน้า + ขยายชดเชย
     GunLab.big(1.2)                 // ใหญ่ขึ้น 20% โดยคงมุมเดิม
     GunLab.fwd(.15)                 // ดันไปข้างหน้า 0.15 ม. + ขยายชดเชยอัตโนมัติ (ขนาดบนจอเท่าเดิม)
   ดูภาพผล (⚖️ ถ่ายเฉพาะเมื่อจำเป็นจริง — ผู้ใช้สั่ง 22 ก.ค. 2026:
     งานที่วัดเป็นตัวเลขได้อยู่แล้ว เช่น องศา/สัดส่วนที่เห็น/จุดกระสุนตก → เชื่อตัวเลข ไม่ต้องถ่าย
     ถ่ายเมื่อเป็นเรื่ององค์ประกอบภาพ หรือผลไม่ตรงกับตัวเลขที่คาด):
     GunLab.shot()                   // ครอปเฉพาะโซนปืน 320px ≈ 8KB (เซฟลง Downloads/gunlab.jpg)
     GunLab.shot({full:true})        // ภาพเต็มจอ (ใช้เมื่อต้องดูองค์ประกอบทั้งเฟรมเท่านั้น)
   ค่าที่ได้จะถูกคืนมาเป็น 3 บรรทัดพร้อมก๊อปไปวางทับใน TUNE ZONE ของ js/invasion3d.js

   ── 🆕 รอบ 502: 3 เครื่องมือลด token รอบจูนถัดไป ───────────────────────
     GunLab.barrel()                 // ทิศลำกล้องจริง 3 มิติ (แนวราบ/ก้ม-เงย) + ปากกระบอกบนจอ %
     GunLab.snapAim()                // 🎯 ดูดจุดเล็งไปบนแนวลำกล้อง — **ดูค่าเฉย ๆ ไม่แตะของจริง**
     GunLab.snapAim({apply:true})    //    ใส่ค่าลงเกมสด ๆ (ยังไม่แก้ไฟล์ · ต้องให้ผู้ใช้สั่งก่อนถึงจะก๊อปลงไฟล์)
     GunLab.yaw(-5)  GunLab.pitch(3) // 🔄 หมุนรอบแกนที่ผ่าน "จุดศูนย์กลางปืน" (สูตรรอบ 482–497)
                                     //    yaw(+) = ปากกระบอกเบนขวา · pitch(+) = ปากกระบอกเงยขึ้น
     GunLab.savePreset('a')          // 💾 เซฟท่าถือ+จุดเล็งของกระบอกที่ถืออยู่ (localStorage)
     GunLab.loadPreset('a')          //    เรียกคืนมาเทียบไป-กลับ โดยไม่ต้องไล่จูนใหม่
     GunLab.presets() / GunLab.delPreset('a')
     GunLab.freeze(false)            // 🧊 คืนคลื่น sway/หายใจ (เครื่องมือ 3 ตัวบนหยุดคลื่นให้เองตอนวัด)

   ── 🆕 รอบ 516: อ่าน/สลับหลาย preset รวดเดียว (คิวต่อยอด #5–7) ─────────
     GunLab.savePreset('a'); GunLab.savePreset('b')
     GunLab.diff('a','b')            // 📊 เทียบ 2 preset เป็นตารางเดียว (ดู .table) — Δตำแหน่ง/Δขนาด/
                                     //    Δองศาลำกล้อง/Δจุดเล็ง + ปากกระบอกเลื่อนกี่ % ของจอ (muzzleShiftPct)
     GunLab.snapAim({fit:true})      // 🎯 กลับด้าน: ขยับ "ท่าถือ" เข้าหาจุดเล็งเดิม (ดูอย่างเดียว คืนบรรทัด GUN_VIEW)
     GunLab.snapAim({fit:true,apply:true})   //    ค้างค่าไว้ในเกมสด ๆ (ยังไม่แตะไฟล์)
     GunLab.saveProfile('classic')   // 💾 เก็บ preset "ทุกกระบอกพร้อมกัน" เป็นชุดเดียว
     GunLab.loadProfile('classic')   //    สลับสไตล์ถือปืนทั้งเกมในคำสั่งเดียว (คืนกระบอกที่ถืออยู่เดิม)
     GunLab.profiles() / GunLab.delProfile('classic')

   ⛔ **ค่าท่าถือ + จุดเล็งของ rifle/r93 ถูกล็อกไว้** (กล่อง 🔒 LOCKED เหนือ GUN_VIEW ใน js/invasion3d.js)
      เครื่องมือในไฟล์นี้ **ไม่แก้ไฟล์เกมเอง** — แก้ได้แค่ค่าในหน่วยความจำของ preview เพื่อทดลอง
      จะก๊อปบรรทัดที่คืนมาไปวางทับในไฟล์จริงได้ **เฉพาะเมื่อผู้ใช้สั่งในรอบนั้น** เท่านั้น
      ทุกคำสั่งที่แตะค่าล็อกจะคืนธง `locked:true` และคำเตือนมาให้เสมอ
      ถ้ากระบอกที่ถืออยู่ไม่มีจุดเล็งของตัวเอง (ไม่มีใน AIM_BY_GUN) จะได้ `shared:true`
      = กำลังจะแตะ **AIM_OFF ค่ากลางที่ใช้ร่วมทุกกระบอก** (รอบ 488 เคยพลาดจนไรเฟิลเล็งเสีย)
   ============================================================ */
window.GunLab = (function(){
  const T = ()=>window.InvasionWorld && window.InvasionWorld._t;

  /* เข้าโลกยานแม่แบบไม่ต้อง login จริง + สลับเป็นปืนสไนเปอร์ */
  async function boot(weapon){
    window.authFetchCloud=()=>Promise.resolve(null);
    window.authWriteCloud=()=>Promise.resolve();
    window.authDeleteCloud=()=>Promise.resolve();
    window.authWriteProfileName=()=>Promise.resolve();
    window.onlineStart=()=>{};
    if(typeof authOnLogin==='function') authOnLogin({uid:'test1',email:'t@test.com'});
    await loadScriptOnce('js/vendor/three.min.js');
    await loadScriptOnce('js/vendor/GLTFLoader.js');
    await loadScriptOnce('js/invasion3d.js');
    InvasionWorld.start();
    await new Promise(r=>setTimeout(r,3500));            // รอโมเดล .glb โหลดครบ
    const t=T(); const want=weapon||'r93';
    if(t.weapon!==want) t.applyWeapon(want);        // dev: สลับทันที ไม่ต้องรออนิเมชันเปลี่ยนปืน
    t.step(1/60,3);
    return {weapon:t.weapon, ...t.gunSil()};
  }

  /* จูนท่าปืน — คืน 3 บรรทัดพร้อมวางทับใน TUNE ZONE */
  function tune(o){ const r=T().setGunPose(o||{}); T().step(1/60,2); return r; }

  /* ใหญ่ขึ้น k เท่า (คงมุมเดิม) */
  function big(k){ const t=T(), p=t.gunPose; return tune({s:p.s*(k||1.2), deg:+t.gunSil().deg}); }

  /* ดันไปข้างหน้า d เมตร + ขยายชดเชยให้ขนาดบนจอเท่าเดิม (คงมุมเดิม) */
  function fwd(d){ const t=T(), p=t.gunPose, z=p.p[2]-(d||.1);
    return tune({z, s:p.s*(z/p.p[2]), deg:+t.gunSil().deg}); }

  /* จับภาพหน้าจอเกมจริง → เซฟลง Downloads (screenshot ของเบราว์เซอร์ค้างกับฉาก 3D นี้เสมอ)
     ⚡ ค่าเริ่มต้น = **ครอปเฉพาะโซนปืน** (ขวา-ล่าง + กากบาท) กว้าง 320px คุณภาพ .45 ≈ 8KB
        เล็กกว่าภาพเต็มจอ ~4 เท่า = ประหยัด token ตอนเปิดดู (ผู้ใช้สั่ง 22 ก.ค. 2026)
     ใช้ภาพเต็มจอเมื่อจำเป็นเท่านั้น: GunLab.shot({full:true})
     ออปชัน: {name,w,q,full}  (เรียกแบบเก่า shot('a.jpg',460) ก็ยังได้) */
  function shot(opt,w2){
    const o = (typeof opt==='string') ? {name:opt, w:w2, full:true} : (opt||{});
    const name=o.name||'gunlab.jpg', full=!!o.full, w=o.w||(full?460:320), q=o.q||(full?.5:.45);
    const t=T(), cv=document.querySelector('canvas');
    const gl=cv.getContext('webgl2')||cv.getContext('webgl');
    t.step(1/60,1);
    const W=cv.width,H=cv.height,buf=new Uint8Array(W*H*4);
    gl.readPixels(0,0,W,H,gl.RGBA,gl.UNSIGNED_BYTE,buf);
    const big=document.createElement('canvas'); big.width=W; big.height=H;
    const bx=big.getContext('2d'), img=bx.createImageData(W,H);
    for(let y=0;y<H;y++){ const sy=(H-1-y)*W*4, dy=y*W*4;
      for(let i=0;i<W*4;i++) img.data[dy+i]=buf[sy+i]; }
    bx.putImageData(img,0,0);
    /* โซนปืน: ครึ่งขวา-ล่างของจอ (กากบาทอยู่มุมซ้ายบนของกรอบพอดี ใช้อ้างอิงตำแหน่งได้) */
    const sx=full?0:W*0.42, sy0=full?0:H*0.30, sw=full?W:W*0.58, sh=full?H:H*0.70;
    const sm=document.createElement('canvas'); sm.width=w; sm.height=Math.round(w*sh/sw);
    const g2=sm.getContext('2d'); g2.drawImage(big,sx,sy0,sw,sh,0,0,sm.width,sm.height);
    /* กากบาทอ้างอิง = "จุดเล็งจริง" (AIM_OFF) ไม่ใช่กลางจอ — ตั้งแต่รอบ 458 จุดเล็งเลื่อนลงได้ */
    const ao=(T().aimOff||[0,0]);
    const ax=W*(0.5+ao[0]*0.5), ay=H*(0.5-ao[1]*0.5);
    const cx=(ax-sx)/sw*sm.width, cy=(ay-sy0)/sh*sm.height;
    g2.strokeStyle='#39ff6a'; g2.lineWidth=2; g2.beginPath();
    g2.moveTo(cx-10,cy); g2.lineTo(cx+10,cy); g2.moveTo(cx,cy-10); g2.lineTo(cx,cy+10); g2.stroke();
    const b=sm.toDataURL('image/jpeg',q).split(',')[1];
    const a=document.createElement('a');
    a.href='data:image/jpeg;base64,'+b; a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    return {file:name, kb:Math.round(b.length*3/4/1024), ...T().gunSil()};
  }

  /* 🔫 จับปืนกระบอกอื่นให้ "หน้าตาเหมือน R93" (รอบ 463)
     เป้าหมาย 3 อย่างพร้อมกัน: มุมเงาปืน (deg) · ความยาวเงาปืนบนจอ (len) · แนวปืนพาดผ่านจุดเล็ง (yAtX0)
     วิธี: วนปรับทีละตัว — scale คุม len · y คุม yAtX0 · pitch คุม deg — สัก 12 รอบก็ลู่เข้าแล้ว
     ใช้: GunLab.match('rifle', GunLab.target('r93'))   */
  function target(w){ const t=T(); const cur=t.weapon;
    t.applyWeapon(w); t.step(1/60,2);
    const s=t.gunSil(); const r={deg:s.deg, len:s.len, yAtX0:s.yAtX0};
    t.applyWeapon(cur); t.step(1/60,2);
    return r; }
  function match(w,goal,rounds){ const t=T();
    if(t.weapon!==w){ t.applyWeapon(w); t.step(1/60,2); }
    let p=t.gunPose, s=p.s, y=p.p[1];
    for(let i=0;i<(rounds||12);i++){
      let r=t.gunSil();
      s*= (r.len>0)? Math.pow(goal.len/r.len, .7) : 1;      // ขนาดเท่ากัน
      s=Math.max(.2,Math.min(4,s));
      t.setGunPose({s});
      r=t.gunSil();
      y+= (goal.yAtX0-r.yAtX0)*0.45;                        // แนวปืนพาดผ่านจุดเล็ง
      t.setGunPose({y});
      t.setGunPose({deg:goal.deg});                         // มุมเงาปืน
    }
    return t.setGunPose({}); }

  /* เลื่อน "จุดเล็ง" ขึ้น-ลงบนจอ (หน่วย NDC: 0 = กลางจอ · −1 = ขอบล่าง) — รอบ 458
     คืนบรรทัด AIM_OFF พร้อมก๊อปไปวางทับใน js/invasion3d.js */
  function aim(y,x){ const r=T().setAimOff(y,x); T().step(1/60,2); return r; }

  /* ตรวจว่ากระสุนไปตรงจุดเล็งจริงไหม: ยิงเรย์ตาม aimDir แล้วฉายจุดที่โดนกลับลงจอ
     ค่าที่ถูก = ใกล้เคียงตำแหน่งจุดเล็ง (aimOff) */
  function check(){ const t=T(), cam=t.camera, d=t.aimDir();
    const hit=t.rayTarget(cam.position.clone(), d, 900);
    const p=(hit?hit.point.clone():cam.position.clone().addScaledVector(d,300)).project(cam);
    return {aimOff:t.aimOff, hitNDC:[+p.x.toFixed(3),+p.y.toFixed(3)], hit:hit?hit.type:'none'}; }

  /* 🔍 เทียบปืน 2 กระบอกในภาพเดียว (ครอปโซนปืนทั้งคู่ ต่อกันแนวนอน) — รอบ 463
     ใช้ตัดสิน "หน้าตาเหมือนกันไหม" ด้วยภาพเดียว แทนการถ่ายทีละกระบอก */
  function pair(name,w){
    const t=T(), cv=document.querySelector('canvas');
    const gl=cv.getContext('webgl2')||cv.getContext('webgl');
    const W=cv.width,H=cv.height, cw=w||300;
    const sx=W*0.42, sy0=H*0.30, sw=W*0.58, sh=H*0.70;
    const ch=Math.round(cw*sh/sw);
    const sheet=document.createElement('canvas'); sheet.width=cw*2; sheet.height=ch;
    const g=sheet.getContext('2d');
    ['rifle','r93'].forEach((wp,i)=>{
      if(t.weapon!==wp) t.applyWeapon(wp);
      t.step(1/60,3);
      const buf=new Uint8Array(W*H*4); gl.readPixels(0,0,W,H,gl.RGBA,gl.UNSIGNED_BYTE,buf);
      const big=document.createElement('canvas'); big.width=W; big.height=H;
      const bx=big.getContext('2d'), img=bx.createImageData(W,H);
      for(let y=0;y<H;y++){ const a=(H-1-y)*W*4, b=y*W*4; for(let j=0;j<W*4;j++) img.data[b+j]=buf[a+j]; }
      bx.putImageData(img,0,0);
      g.drawImage(big,sx,sy0,sw,sh,i*cw,0,cw,ch);
      const ao=t.aimOff, ax=W*(0.5+ao[0]*0.5), ay=H*(0.5-ao[1]*0.5);
      const px=i*cw+(ax-sx)/sw*cw, py=(ay-sy0)/sh*ch;
      g.strokeStyle='#39ff6a'; g.lineWidth=2; g.beginPath();
      g.moveTo(px-9,py); g.lineTo(px+9,py); g.moveTo(px,py-9); g.lineTo(px,py+9); g.stroke();
      g.fillStyle='#000'; g.fillRect(i*cw+3,3,86,17);
      g.fillStyle='#fff'; g.font='12px monospace'; g.fillText(wp+' '+t.gunSil().deg+'°',i*cw+7,16);
    });
    const b=sheet.toDataURL('image/jpeg',.45).split(',')[1];
    const a=document.createElement('a'); a.href='data:image/jpeg;base64,'+b; a.download=name||'gunpair.jpg';
    document.body.appendChild(a); a.click(); a.remove();
    return {file:name||'gunpair.jpg', kb:Math.round(b.length*3/4/1024)};
  }

  /* ══════════════════════════════════════════════════════════════════
     🆕 รอบ 502 — ชุดเครื่องมือที่ "ใช้ซ้ำทุกรอบจูน" (เดิมต้องส่งสูตรยาวเข้ามาใหม่ทุกครั้ง)
     ══════════════════════════════════════════════════════════════════ */
  const LOCKED = ['rifle','r93'];        // ค่าที่ผู้ใช้สั่งล็อก (รอบ 498) — เตือนทุกครั้งที่จะแตะ
  function lockNote(w){ return LOCKED.indexOf(w)<0 ? null :
    `⛔ ${w} เป็นค่าที่ผู้ใช้ล็อกไว้ (รอบ 498) — ก๊อปลงไฟล์ได้เฉพาะเมื่อผู้ใช้สั่งในรอบนี้`; }

  /* 🧊 หยุดคลื่น sway/หายใจชั่วคราว (รอบ 501 ทำให้ปืนขยับตลอดเวลา → วัดค่าไม่นิ่ง)
     เครื่องมือวัด/หมุน/preset ด้านล่างเรียกให้เองอัตโนมัติ — ค่าที่อ่านได้จึงเป็น "ท่าฐาน" ล้วน
     คืนคลื่นเมื่อจูนเสร็จ: GunLab.freeze(false)  (หรือรีโหลดหน้า) */
  const SW_AMP=['x','y','z','roll','pitch','yaw','breathY','breathPitch','breathRoll'];
  let swSaved=null;
  function freeze(on){
    const t=T();
    if(on===false){ if(swSaved){ t.setSway(swSaved); swSaved=null; t.step(1/60,2); } return {frozen:false}; }
    if(!swSaved){ const c=t.sway.cfg, z={}; swSaved={};
      SW_AMP.forEach(k=>{ swSaved[k]=c[k]; z[k]=0; });
      t.setSway(z); t.step(1/60,3); }
    return {frozen:true};
  }

  /* 📐 แกนหลักของปืนแบบ 3 มิติ (PCA ของจุดยอดโมเดล)
     ⚠️ ทำไมต้อง 3 มิติ ไม่ใช่ฉายลงจอ: พานท้าย R93 อยู่ **หลังระนาบกล้อง** (z เป็นบวก)
        ฉายลงจอแล้วค่าเพี้ยนหลักพัน% (บทเรียนรอบ 487) → หาแนวลำกล้องในสเปซกล้องก่อน
        แล้วค่อยฉายเฉพาะจุดที่อยู่หน้ากล้อง
     คืน: c=จุดศูนย์กลางปืน · dir=ทิศท้าย→ปาก (หน่วยเวกเตอร์) · muzzle/butt=ปลายทั้งสองข้าง · len=ความยาว */
  function gunAxis(){
    const t=T(), TH=window.THREE, m=t.gunModels[t.weapon];
    if(!m) return null;
    freeze();                                          // วัดบนท่าฐาน ไม่ให้คลื่น sway กวน
    const rig=m.userData.boltRig, skip=new Set(); if(rig) rig.pivot.traverse(o=>skip.add(o));
    t.gunGrp.updateMatrixWorld(true);
    const v=new TH.Vector3(), pts=[];
    m.traverse(o=>{ if(!o.isMesh||skip.has(o)||!o.geometry.attributes.position) return;
      const pa=o.geometry.attributes.position;
      for(let i=0;i<pa.count;i+=3){ v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld);
        pts.push([v.x,v.y,v.z]); } });
    if(pts.length<20) return null;
    const c=[0,0,0]; pts.forEach(p=>{c[0]+=p[0];c[1]+=p[1];c[2]+=p[2];});
    c[0]/=pts.length; c[1]/=pts.length; c[2]/=pts.length;
    /* เมทริกซ์ความแปรปรวนร่วม 3×3 แล้วหาเวกเตอร์ลักษณะเฉพาะตัวหลักด้วย power iteration */
    const C=[[0,0,0],[0,0,0],[0,0,0]];
    pts.forEach(p=>{ const d=[p[0]-c[0],p[1]-c[1],p[2]-c[2]];
      for(let i=0;i<3;i++) for(let j=0;j<3;j++) C[i][j]+=d[i]*d[j]; });
    let d=[0,0,-1];
    for(let k=0;k<80;k++){
      const n=[0,0,0];
      for(let i=0;i<3;i++) n[i]=C[i][0]*d[0]+C[i][1]*d[1]+C[i][2]*d[2];
      const L=Math.hypot(n[0],n[1],n[2]); if(L<1e-12) break;
      d=[n[0]/L,n[1]/L,n[2]/L];
    }
    if(d[2]>0) d=[-d[0],-d[1],-d[2]];                  // ให้ทิศชี้ออกหน้ากล้องเสมอ = ทางปากกระบอก
    let lo=1e9,hi=-1e9;
    pts.forEach(p=>{ const u=(p[0]-c[0])*d[0]+(p[1]-c[1])*d[1]+(p[2]-c[2])*d[2];
      if(u<lo)lo=u; if(u>hi)hi=u; });
    const at=u=>[c[0]+d[0]*u, c[1]+d[1]*u, c[2]+d[2]*u];
    return {c, dir:d, muzzle:at(hi), butt:at(lo), len:+(hi-lo).toFixed(3), n:pts.length};
  }

  /* ฉายจุดในสเปซกล้อง (vmScene) ลงจอ → NDC + % ของจอ · คืน null ถ้าจุดอยู่หลังระนาบกล้อง */
  function proj(p){
    const t=T(), TH=window.THREE;
    if(p[2]>-0.02) return null;
    const P=(t.vmCam?t.vmCam:t.camera).projectionMatrix;
    const v=new TH.Vector3(p[0],p[1],p[2]).applyMatrix4(P);
    return {ndc:[+v.x.toFixed(4),+v.y.toFixed(4)],
            pct:[+(50+v.x*50).toFixed(1), +(50-v.y*50).toFixed(1)]};
  }

  /* 🔭 ทิศลำกล้องจริง (องศา) + ปากกระบอกบนจอ — ใช้ยืนยันผลทุกครั้งหลังหมุน */
  function barrel(){
    const a=gunAxis(); if(!a) return null;
    const d=a.dir, mz=proj(a.muzzle);
    return {weapon:T().weapon,
      yawDeg:+(Math.atan2(-d[0],-d[2])*180/Math.PI).toFixed(2),   // + = เบนซ้าย · − = เบนขวา
      pitchDeg:+(Math.atan2(d[1],Math.hypot(d[0],d[2]))*180/Math.PI).toFixed(2), // + = เงย
      muzzlePct: mz?mz.pct:null, center:a.c.map(n=>+n.toFixed(3)), len:a.len};
  }

  /* 🎯 ดูดจุดเล็งไปอยู่ "บนแนวลำกล้องจริง" ที่ระยะ zero (ค่าเริ่มต้น 50 ม. = ZERO_DIST)
     ค่าเริ่มต้น = **ดูอย่างเดียว ไม่แตะอะไร** (ค่าจุดเล็งทั้ง 2 กระบอกถูกล็อก)
     ใส่ {apply:true} ถึงจะเปลี่ยนค่าในเกมสด ๆ (ยังไม่แตะไฟล์)
     ออปชัน: {dist, apply} */
  function snapAim(o){
    o=o||{}; if(o.fit) return snapAimFit(o);          // 🆕 รอบ 516: กลับด้าน — ขยับปืนเข้าหาจุดเล็งเดิม
    const t=T(), a=gunAxis(); if(!a) return {err:'no gun'};
    const dist=(typeof o.dist==='number')?o.dist:50;
    const far=[a.muzzle[0]+a.dir[0]*dist, a.muzzle[1]+a.dir[1]*dist, a.muzzle[2]+a.dir[2]*dist];
    const p=proj(far); if(!p) return {err:'แนวลำกล้องชี้ไปหลังกล้อง — ตรวจ pitch/yaw ก่อน'};
    const q=t.setAimOff();                       // เรียกเปล่า = แค่ถามสถานะ ไม่เปลี่ยนค่า
    const x=p.ndc[0], y=p.ndc[1], w=t.weapon;
    const r={weapon:w, aim:[x,y], pct:p.pct, cur:q.aimOff, shared:q.shared,
      locked:LOCKED.indexOf(w)>=0, applied:!!o.apply, dist,
      line: q.shared?`const AIM_OFF=[${x},${y}];`:`AIM_BY_GUN={ ${w}:[${x},${y}] };`,
      warn:[lockNote(w),
        q.shared?'⚠️ กระบอกนี้ใช้ AIM_OFF ค่ากลางร่วมกับทุกกระบอก — แก้แล้วกระบอกอื่นเล็งเพี้ยนตาม (รอบ 488) ถ้าต้องการเฉพาะกระบอกนี้ให้เพิ่ม key ใน AIM_BY_GUN':null
      ].filter(Boolean)};
    if(o.apply){ t.setAimOff(y,x); t.step(1/60,2); r.check=check(); }
    return r;
  }

  /* 🔄 หมุนปืนรอบแกนที่ผ่าน "จุดศูนย์กลางปืน" (สูตรที่ใช้ซ้ำทุกรอบใน 482–497)
     ⚠️ ห้ามบวก yaw/pitch ใส่ Euler ตรง ๆ — Euler เรียง XYZ (pitch มาก่อน) แกนหมุนจะเอียงตาม pitch
        ต้องคูณเมทริกซ์ T(C)·R(แกน,มุม)·T(−C) ทับของเดิม แล้ว decompose ใหม่ (p กับ r จึงเปลี่ยนพร้อมกัน)
     yaw : แกนตั้ง (0,1,0) · pitch: แกนนอนที่ **ตั้งฉากกับแนวลำกล้อง** (ไม่ใช่แกน X ของจอ — บทเรียนรอบ 483) */
  function spin(deg,kind){
    const t=T(), TH=window.THREE, a=gunAxis(); if(!a) return {err:'no gun'};
    const before=barrel();
    const axis = (kind==='yaw') ? new TH.Vector3(0,1,0)
                                : new TH.Vector3(a.dir[2],0,-a.dir[0]).normalize();
    /* เครื่องหมาย: yaw(+) = ปากกระบอกไปขวา · pitch(+) = ปากกระบอกเงยขึ้น (วัดยืนยันกับเกมจริงแล้ว) */
    const ang = -deg*Math.PI/180;
    const C=a.c;
    const M=new TH.Matrix4().makeTranslation(C[0],C[1],C[2])
      .multiply(new TH.Matrix4().makeRotationAxis(axis,ang))
      .multiply(new TH.Matrix4().makeTranslation(-C[0],-C[1],-C[2]));
    const g=t.gunGrp; g.updateMatrixWorld(true);
    M.multiply(g.matrixWorld);
    if(g.parent){ g.parent.updateMatrixWorld(true);
      M.premultiply(new TH.Matrix4().copy(g.parent.matrixWorld).invert()); }
    const pos=new TH.Vector3(), q=new TH.Quaternion(), sc=new TH.Vector3();
    M.decompose(pos,q,sc);
    const e=new TH.Euler().setFromQuaternion(q,'XYZ');
    const r=tune({x:pos.x,y:pos.y,z:pos.z,pitch:e.x,yaw:e.y,roll:e.z,s:sc.x});
    const after=barrel();
    r.turned={kind, ask:deg,
      got:+( kind==='yaw' ? (before.yawDeg-after.yawDeg) : (after.pitchDeg-before.pitchDeg) ).toFixed(2)};
    r.barrel=after; r.centerKept=a.c.map(n=>+n.toFixed(3));
    const w=lockNote(t.weapon); if(w) r.warn=[w];
    return r;
  }
  function yaw(deg){ return spin(deg,'yaw'); }        // + = ปากกระบอกเบนขวา (ท้ายปืนมาซ้าย)
  function pitch(deg){ return spin(deg,'pitch'); }    // + = ปากกระบอกเงยขึ้น

  /* 💾 preset ท่าถือ+จุดเล็ง ของกระบอกที่ถืออยู่ (เก็บใน localStorage)
     ใช้เทียบท่าไป-กลับเร็ว ๆ โดยไม่ต้องไล่จูนใหม่ · ไม่แตะไฟล์เกม */
  const PK='gunlab.preset.';
  function savePreset(name){
    const t=T(); if(!name) return {err:'ต้องตั้งชื่อ: GunLab.savePreset("a")'};
    freeze();                                          // เซฟ "ท่าฐาน" ไม่ใช่ท่าที่คลื่น sway ดันอยู่
    const p=t.gunPose, rec={weapon:t.weapon, p:p.p, r:p.r, s:p.s, aim:t.aimOff.slice(),
      sil:t.gunSil(), at:new Date().toISOString().slice(0,16)};
    try{ localStorage.setItem(PK+name, JSON.stringify(rec)); }catch(e){ return {err:String(e)}; }
    return Object.assign({saved:name}, rec);
  }
  /* ออปชัน: {aim:false} = คืนแค่ท่าถือ ไม่แตะจุดเล็ง · {swap:false} = ห้ามสลับกระบอกเอง */
  function loadPreset(name,o){
    o=o||{}; const t=T(); freeze();
    let rec; try{ rec=JSON.parse(localStorage.getItem(PK+name)||'null'); }catch(e){}
    if(!rec) return {err:'ไม่มี preset ชื่อ '+name, have:presets().map(r=>r.name)};
    const notes=[];
    if(rec.weapon!==t.weapon){
      if(o.swap===false) return {err:`preset นี้เป็นของ ${rec.weapon} แต่ถืออยู่ ${t.weapon}`};
      t.applyWeapon(rec.weapon); t.step(1/60,2); notes.push('สลับเป็น '+rec.weapon+' ให้แล้ว');
    }
    const r=tune({x:rec.p[0],y:rec.p[1],z:rec.p[2],pitch:rec.r[0],yaw:rec.r[1],roll:rec.r[2],s:rec.s});
    let aim=t.aimOff.slice(), shared=t.setAimOff().shared;
    if(o.aim!==false && rec.aim){
      if(shared) notes.push('⚠️ กระบอกนี้ใช้ AIM_OFF ค่ากลาง — คืนจุดเล็งจะกระทบกระบอกอื่นด้วย');
      t.setAimOff(rec.aim[1],rec.aim[0]); aim=t.aimOff.slice();
    }
    const w=lockNote(rec.weapon); if(w) notes.push(w+' (ค่าที่โหลดอยู่ในหน่วยความจำ preview เท่านั้น)');
    return Object.assign({loaded:name, aim, shared, note:notes}, r);
  }
  function presets(){
    const out=[];
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i);
      if(k.indexOf(PK)!==0) continue;
      try{ const v=JSON.parse(localStorage.getItem(k));
        out.push({name:k.slice(PK.length), weapon:v.weapon, s:v.s, aim:v.aim, at:v.at}); }catch(e){}
    }
    return out;
  }
  function delPreset(name){ localStorage.removeItem(PK+name); return {del:name, left:presets().map(r=>r.name)}; }

  /* ══════════════════════════════════════════════════════════════════
     🆕 รอบ 516 — 3 เครื่องมือลด token รอบจูนถัดไป (คิวต่อยอด #5–7)
       • diff('a','b')          เทียบ preset 2 ชุดเป็นตารางเดียว อ่านรอบเดียวจบ
       • snapAim({fit:true})    กลับด้าน snapAim: ขยับ "ท่าถือ" เข้าหาจุดเล็งเดิม (คืนบรรทัด GUN_VIEW)
       • saveProfile/loadProfile เก็บ/สลับ preset "ทุกกระบอกพร้อมกัน" เป็นชุดเดียว
     ⚠️ ทั้งหมดแตะแค่ค่าในหน่วยความจำ preview — ไม่เขียนไฟล์เกม · ค่าล็อก rifle/r93 ก๊อปลงไฟล์ได้เฉพาะเมื่อผู้ใช้สั่ง
     ══════════════════════════════════════════════════════════════════ */

  /* 📸 snapshot/restore "ทุกกระบอก" — setGunPose เขียนทับ GUN_VIEW[weapon] ในหน่วยความจำ (invasion3d.js:3109)
     → เครื่องมือที่แตะหลายกระบอก (diff/saveProfile) ต้องคืนค่าทุกกระบอกที่แตะ ไม่ใช่แค่กระบอกที่ถืออยู่
        ไม่งั้นค่าล็อกของอีกกระบอกจะค้างเพี้ยนจนกว่าจะรีโหลดหน้า */
  function _snapAll(){
    const t=T(); freeze();
    const held=t.weapon, guns={};
    Object.keys(t.gunModels).forEach(w=>{
      if(t.weapon!==w){ t.applyWeapon(w); t.step(1/60,1); }
      const p=t.gunPose; guns[w]={p:p.p.slice(), r:p.r.slice(), s:p.s, aim:t.aimOff.slice()};
    });
    if(t.weapon!==held){ t.applyWeapon(held); t.step(1/60,1); }
    return {held, guns};
  }
  function _applyGun(w,g){
    const t=T(); if(!t.gunModels[w]) return false;
    if(t.weapon!==w){ t.applyWeapon(w); t.step(1/60,1); }
    t.setGunPose({x:g.p[0],y:g.p[1],z:g.p[2],pitch:g.r[0],yaw:g.r[1],roll:g.r[2],s:g.s});
    if(g.aim) t.setAimOff(g.aim[1],g.aim[0]);
    t.step(1/60,1); return true;
  }
  function _restoreAll(snap){
    const t=T();
    Object.keys(snap.guns).forEach(w=>_applyGun(w,snap.guns[w]));
    if(t.weapon!==snap.held){ t.applyWeapon(snap.held); t.step(1/60,1); }
  }
  function _readPreset(name){
    try{ return JSON.parse(localStorage.getItem(PK+name)||'null'); }catch(e){ return null; }
  }

  /* 📊 GunLab.diff('a','b') — เทียบ preset 2 ชุด (savePreset ไว้ก่อน) เป็นตารางเดียว อ่านรอบเดียวจบ
     คอลัมน์: ค่า a · ค่า b · Δ(b−a) · แถว: ตำแหน่ง xyz / ขนาด / องศาลำกล้องจริง(yaw,pitch) / จุดเล็ง xy
              + ปากกระบอกเลื่อนกี่ % ของจอ (muzzleShiftPct)
     วัดองศาลำกล้อง/ปากกระบอกด้วยการ apply preset ลงเกมชั่วคราวแล้ววัด barrel() → คืนทุกกระบอกตามเดิม */
  function diff(a,b){
    const t=T();
    const ra=_readPreset(a), rb=_readPreset(b);
    if(!ra) return {err:'ไม่มี preset '+a, have:presets().map(r=>r.name)};
    if(!rb) return {err:'ไม่มี preset '+b, have:presets().map(r=>r.name)};
    const snap=_snapAll();
    _applyGun(ra.weapon, ra); const ba=barrel();
    _applyGun(rb.weapon, rb); const bb=barrel();
    _restoreAll(snap);
    const f3=(u,v)=>[+(v[0]-u[0]).toFixed(3),+(v[1]-u[1]).toFixed(3),+(v[2]-u[2]).toFixed(3)];
    const dPos=f3(ra.p,rb.p), dScale=+(rb.s-ra.s).toFixed(3);
    const dAim=[+((rb.aim?rb.aim[0]:0)-(ra.aim?ra.aim[0]:0)).toFixed(4),
               +((rb.aim?rb.aim[1]:0)-(ra.aim?ra.aim[1]:0)).toFixed(4)];
    const dYaw=+(bb.yawDeg-ba.yawDeg).toFixed(2), dPitch=+(bb.pitchDeg-ba.pitchDeg).toFixed(2);
    const dMuz=(ba.muzzlePct&&bb.muzzlePct)
      ? [+(bb.muzzlePct[0]-ba.muzzlePct[0]).toFixed(1), +(bb.muzzlePct[1]-ba.muzzlePct[1]).toFixed(1)] : null;
    const rows=[
      ['',              a,                          b,                          'Δ(b−a)'],
      ['weapon',        ra.weapon,                  rb.weapon,                  ra.weapon===rb.weapon?'—':'≠'],
      ['pos x',         ra.p[0],                    rb.p[0],                    dPos[0]],
      ['pos y',         ra.p[1],                    rb.p[1],                    dPos[1]],
      ['pos z',         ra.p[2],                    rb.p[2],                    dPos[2]],
      ['scale',         ra.s,                       rb.s,                       dScale],
      ['barrel yaw°',   ba.yawDeg,                  bb.yawDeg,                  dYaw],
      ['barrel pitch°', ba.pitchDeg,                bb.pitchDeg,                dPitch],
      ['aim x',         ra.aim?ra.aim[0]:'—',       rb.aim?rb.aim[0]:'—',       dAim[0]],
      ['aim y',         ra.aim?ra.aim[1]:'—',       rb.aim?rb.aim[1]:'—',       dAim[1]],
      ['muzzle x%',     ba.muzzlePct?ba.muzzlePct[0]:'—', bb.muzzlePct?bb.muzzlePct[0]:'—', dMuz?dMuz[0]:'—'],
      ['muzzle y%',     ba.muzzlePct?ba.muzzlePct[1]:'—', bb.muzzlePct?bb.muzzlePct[1]:'—', dMuz?dMuz[1]:'—'],
    ];
    const wid=rows[0].map((_,c)=>Math.max(...rows.map(r=>String(r[c]).length)));
    const table=rows.map(r=>r.map((c,i)=>String(c).padEnd(wid[i])).join('  ')).join('\n');
    return {a, b, table, dPos, dScale, dYawDeg:dYaw, dPitchDeg:dPitch, dAim, muzzleShiftPct:dMuz,
      note:'muzzleShiftPct = ปากกระบอกเลื่อนกี่ % ของจอ (b−a) · x: +=ขวา · y: +=ลง (วัดจากขอบบน)'};
  }

  /* 🎯 GunLab.snapAim({fit:true}) — กลับด้านของ snapAim:
     snapAim เดิม = ย้าย "จุดเล็ง" ไปบนแนวลำกล้อง · fit = ขยับ "ท่าถือปืน" เข้าหาจุดเล็งเดิมแทน
     ไล่ yaw/pitch รอบจุดศูนย์กลางปืน (สูตร spin เดิม) จนแนวลำกล้องที่ระยะ zero พาดผ่านจุดเล็ง (t.aimOff)
     ค่าเริ่มต้น = ดูอย่างเดียว คืนท่าเดิม (เหมือน snapAim) · {apply:true} ค้างค่าไว้ในเกมสด ๆ
     ออปชัน: {fit, apply, dist} · คืนบรรทัด GUN_VIEW พร้อมก๊อป (ก๊อปลงไฟล์ได้เฉพาะเมื่อผู้ใช้สั่ง — ค่าล็อก) */
  function _barNDC(dist){
    const a=gunAxis(); if(!a) return null;
    const far=[a.muzzle[0]+a.dir[0]*dist, a.muzzle[1]+a.dir[1]*dist, a.muzzle[2]+a.dir[2]*dist];
    const p=proj(far); return p?p.ndc:null;
  }
  function snapAimFit(o){
    const t=T(), w=t.weapon, dist=(typeof o.dist==='number')?o.dist:50;
    const aim=t.aimOff.slice();                       // จุดเล็งเดิม (NDC [x,y]) = เป้าหมายที่ลำกล้องต้องพาดผ่าน
    freeze();
    const p0=t.gunPose, back={p:p0.p.slice(), r:p0.r.slice(), s:p0.s};
    const restore=()=>{ t.setGunPose({x:back.p[0],y:back.p[1],z:back.p[2],
      pitch:back.r[0],yaw:back.r[1],roll:back.r[2],s:back.s}); t.step(1/60,1); };
    let base=_barNDC(dist);
    if(!base){ restore(); return {err:'แนวลำกล้องชี้ไปหลังกล้อง — ตรวจ pitch/yaw ก่อน'}; }
    /* คาลิเบรต "องศา→หน่วยจอ" ด้วยการโพรบ 1° แล้วคืนท่าเดิม (yaw กระทบแกน x · pitch กระทบแกน y) */
    yaw(1);   const yx=_barNDC(dist); restore(); const dyx=yx?(yx[0]-base[0]):0;
    base=_barNDC(dist);
    pitch(1); const py=_barNDC(dist); restore(); const dpy=py?(py[1]-base[1]):0;
    if(Math.abs(dyx)<1e-6||Math.abs(dpy)<1e-6){ restore();
      return {err:'ปืนไม่ตอบสนองการหมุน (dyx/dpy≈0) — จุดเล็งอาจอยู่นอกวิสัยของท่าถือนี้'}; }
    const gX=1/dyx, gY=1/dpy;
    let cur=_barNDC(dist), iters=0, err=Infinity;
    for(let i=0;i<30;i++){ iters++;
      const ex=aim[0]-cur[0], ey=aim[1]-cur[1]; err=Math.hypot(ex,ey);
      if(err<1.5e-4) break;
      yaw(+(ex*gX*0.85).toFixed(4)); pitch(+(ey*gY*0.85).toFixed(4));   // damp .85 กันแกว่ง
      cur=_barNDC(dist); if(!cur){ restore(); return {err:'ลู่ออกนอกจอระหว่างไล่ — จุดเล็งไกลเกินท่าถือนี้'}; }
    }
    const p=t.gunPose, f=n=>+n.toFixed(3), bar=barrel();
    const res={weapon:w, fit:true, applied:!!o.apply, dist, iters, err:+err.toFixed(5),
      pose:{p:p.p.map(f), r:p.r.map(f), s:f(p.s)}, barrel:bar, aimTarget:aim, muzzlePct:bar.muzzlePct,
      line:`  ${w}: {p:[${p.p.map(f).join(',')}], r:[${p.r.map(f).join(',')}], s:${f(p.s)}},`,
      warn:[lockNote(w),
        '⚠️ fit ขยับ "ท่าถือ" (GUN_VIEW) เข้าหาจุดเล็งเดิม — ค่าท่าถือถูกล็อก ก๊อปลงไฟล์ได้เฉพาะเมื่อผู้ใช้สั่ง'
      ].filter(Boolean)};
    if(!o.apply) restore(); else t.step(1/60,2);
    return res;
  }

  /* 💾 GunLab.saveProfile('ชื่อ') / loadProfile('ชื่อ') — preset "ทุกกระบอกพร้อมกัน" เป็นชุดเดียว
     สลับ "สไตล์ถือปืนทั้งเกม" ได้ในคำสั่งเดียว · วนทุก key ใน gunModels เก็บท่าถือ+จุดเล็ง แล้วคืนกระบอกที่ถืออยู่เดิม
     เก็บใน localStorage แยกจาก preset รายกระบอก (คนละ namespace) · ไม่แตะไฟล์เกม */
  const PROF='gunlab.profile.';
  function saveProfile(name){
    if(!name) return {err:'ต้องตั้งชื่อ: GunLab.saveProfile("classic")'};
    const snap=_snapAll();                            // snapAll คืนกระบอกที่ถืออยู่เดิมให้แล้ว
    const rec={guns:snap.guns, held:snap.held, at:new Date().toISOString().slice(0,16)};
    try{ localStorage.setItem(PROF+name, JSON.stringify(rec)); }catch(e){ return {err:String(e)}; }
    return {saved:name, guns:Object.keys(rec.guns), held:rec.held, at:rec.at};
  }
  function loadProfile(name){
    const t=T(); freeze();
    let rec; try{ rec=JSON.parse(localStorage.getItem(PROF+name)||'null'); }catch(e){}
    if(!rec||!rec.guns) return {err:'ไม่มี profile ชื่อ '+name, have:profiles().map(r=>r.name)};
    const held=t.weapon, applied=[], notes=[];
    Object.keys(rec.guns).forEach(w=>{
      if(_applyGun(w,rec.guns[w])) applied.push(w); else notes.push('ข้าม '+w+' (ไม่มีในเกมนี้)');
    });
    if(t.weapon!==held){ t.applyWeapon(held); t.step(1/60,2); }   // คืนกระบอกที่ถืออยู่เดิม
    const locked=applied.filter(w=>LOCKED.indexOf(w)>=0);
    if(locked.length) notes.push('⛔ '+locked.join(',')+
      ' เป็นค่าล็อก — โหลดอยู่ในหน่วยความจำ preview เท่านั้น ห้ามก๊อปลงไฟล์เว้นแต่ผู้ใช้สั่ง');
    return {loaded:name, applied, held, note:notes};
  }
  function profiles(){
    const out=[];
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i);
      if(k.indexOf(PROF)!==0) continue;
      try{ const v=JSON.parse(localStorage.getItem(k));
        out.push({name:k.slice(PROF.length), guns:Object.keys(v.guns||{}), held:v.held, at:v.at}); }catch(e){}
    }
    return out;
  }
  function delProfile(name){ localStorage.removeItem(PROF+name); return {del:name, left:profiles().map(r=>r.name)}; }

  /* ปิดเสียง/คืนหน้า login หลังเทสต์ (กฎ: เทสต์เสียงเสร็จต้องปิดให้เรียบร้อย) */
  function done(){ try{ localStorage.removeItem('petVocabAdventure_v1'); }catch(e){} location.reload(); }

  return {boot,tune,big,fwd,shot,pair,aim,check,match,target,done,freeze,
          gunAxis,barrel,snapAim,yaw,pitch,spin,savePreset,loadPreset,presets,delPreset,
          diff,saveProfile,loadProfile,profiles,delProfile,
          sil:()=>T().gunSil(),pose:()=>T().gunPose};
})();
