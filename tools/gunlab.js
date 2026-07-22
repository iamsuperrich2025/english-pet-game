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
   ดูภาพผล:
     GunLab.shot()                   // ครอปเฉพาะโซนปืน 320px ≈ 8KB (เซฟลง Downloads/gunlab.jpg)
     GunLab.shot({full:true})        // ภาพเต็มจอ (ใช้เมื่อต้องดูองค์ประกอบทั้งเฟรมเท่านั้น)
   ค่าที่ได้จะถูกคืนมาเป็น 3 บรรทัดพร้อมก๊อปไปวางทับใน TUNE ZONE ของ js/invasion3d.js
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
    for(let i=0;i<4 && t.weapon!==want;i++) t.swapWeapon();
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
    const cx=(W/2-sx)/sw*sm.width, cy=(H/2-sy0)/sh*sm.height;          // กากบาทอ้างอิง
    g2.strokeStyle='#39ff6a'; g2.lineWidth=2; g2.beginPath();
    g2.moveTo(cx-10,cy); g2.lineTo(cx+10,cy); g2.moveTo(cx,cy-10); g2.lineTo(cx,cy+10); g2.stroke();
    const b=sm.toDataURL('image/jpeg',q).split(',')[1];
    const a=document.createElement('a');
    a.href='data:image/jpeg;base64,'+b; a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    return {file:name, kb:Math.round(b.length*3/4/1024), ...T().gunSil()};
  }

  /* ปิดเสียง/คืนหน้า login หลังเทสต์ (กฎ: เทสต์เสียงเสร็จต้องปิดให้เรียบร้อย) */
  function done(){ try{ localStorage.removeItem('petVocabAdventure_v1'); }catch(e){} location.reload(); }

  return {boot,tune,big,fwd,shot,done,sil:()=>T().gunSil(),pose:()=>T().gunPose};
})();
